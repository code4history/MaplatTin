import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { featureCollection, point, polygon } from "@turf/turf";
import { counterTri, transformArr } from "@maplat/transform";
import type { PropertyTriKey, Tins, Tri } from "@maplat/transform";
import type { Position } from "geojson";
import { Options, Tin } from "../src/index.ts";
import { resolveOverlaps } from "../src/strict-overlap.ts";
import type { SearchIndex } from "../src/searchutils.ts";
import { insertSearchIndex } from "../src/searchutils.ts";

const loadMap = (filename: string): Record<string, unknown> =>
  JSON.parse(fs.readFileSync(`${__dirname}/maps/${filename}.json`, "utf-8"));

/**
 * TIN の全三角形から「三角形の辺」を searchIndex と同じキー形式
 * （頂点 index を String 化 → sort → "-" 連結）で集めた集合を返す。
 */
function collectTriangleEdgeKeys(tins: Tins): Set<string> {
  const keys = new Set<string>();
  tins.features.forEach((tri: Tri) => {
    const indices = (["a", "b", "c"] as PropertyTriKey[]).map((key) =>
      `${tri.properties![key].index}`,
    );
    [
      [0, 1],
      [0, 2],
      [1, 2],
    ].forEach(([i, j]) => keys.add([indices[i], indices[j]].sort().join("-")));
  });
  return keys;
}

/** pointsSet 内の配列位置 → 頂点 index（GCP は数値、エッジ中間ノードは "e12" 等）*/
function indexOfPosition(tin: Tin, position: number): string {
  return `${tin.pointsSet!.forw.features[position].properties!.target.index}`;
}

function buildTin(key: string, strictMode: string, useV2 = false): Tin {
  const map = loadMap(key);
  const tin = new Tin({
    wh: [map.width, map.height] as [number, number],
    strictMode: strictMode as Options["strictMode"],
    vertexMode: map.vertexMode as Options["vertexMode"],
    stateFull: false,
    useV2Algorithm: useV2,
  });
  tin.setPoints(map.gcps as Parameters<Tin["setPoints"]>[0]);
  if (map.edges) tin.setEdges(map.edges as Parameters<Tin["setEdges"]>[0]);
  tin.updateTin();
  return tin;
}

/** 全制約エッジのうち、TIN の辺として残っていないものを列挙する */
function missingConstraintEdges(tin: Tin): string[] {
  const triangleEdges = collectTriangleEdgeKeys(tin.tins!.forw!);
  return tin
    .pointsSet!.edges.map((edge) =>
      [indexOfPosition(tin, edge[0]), indexOfPosition(tin, edge[1])]
        .sort()
        .join("-"),
    )
    .filter((key) => !triangleEdges.has(key));
}

// ─── 制約エッジ保護（実フィクスチャ） ─────────────────────────────────────────
//
// エッジ中間ノードを含む制約エッジは properties.target.index が "e52" のような
// 文字列になる。strict モードの resolveOverlaps はこれらを制約エッジと認識できず、
// フリップで破壊していた（配列位置の名前空間と index の名前空間の取り違え）。

describe("strict mode keeps constrained edges (with edge intermediate nodes)", () => {
  (["uno_bus_gtfs_error", "uno_bus_gtfs_loose"] as const).forEach((key) => {
    (
      [
        { label: "v3", useV2: false },
        { label: "v2", useV2: true },
      ] as const
    ).forEach(({ label, useV2 }) => {
      it(`${key} (${label}): every constrained edge survives as a TIN edge`, () => {
        const tin = buildTin(key, Tin.MODE_STRICT, useV2);

        // フィクスチャの前提: エッジ中間ノードを含む制約エッジが存在すること
        const hasEdgeNode = tin
          .pointsSet!.edges.some((edge) =>
            [edge[0], edge[1]].some((position) =>
              indexOfPosition(tin, position).startsWith("e"),
            ),
          );
        expect(hasEdgeNode).toBe(true);

        expect(missingConstraintEdges(tin)).toEqual([]);
      });
    });
  });

  it("uno_bus_gtfs_error (loose): constrained edges survive as a baseline", () => {
    // loose モードは resolveOverlaps を通らないため、元々壊れていない。
    const tin = buildTin("uno_bus_gtfs_error", Tin.MODE_LOOSE);
    expect(missingConstraintEdges(tin)).toEqual([]);
  });
});

// ─── 制約エッジ上の点の変換 ──────────────────────────────────────────────────
//
// 制約エッジが TIN の辺として保たれていれば、その辺上の点は TIN の区分アフィン
// 変換によって対応する bakw 側の線分上へ正確に写る。
// （tin.transform() は重みバッファ補正が入るため、ここでは TIN 変換カーネル
//   そのものである transformArr を使う。）

/** 制約エッジの中点を forw TIN で変換し、bakw 線分の中点からのずれを返す */
function edgeMidpointDeviations(tin: Tin): number[] {
  const features = tin.pointsSet!.forw.features;
  return tin.pointsSet!.edges.map((edge) => {
    const [start, end] = [edge[0], edge[1]].map((position) => ({
      forw: features[position].geometry!.coordinates as Position,
      bakw: features[position].properties!.target.geom as Position,
    }));
    const midForw: Position = [
      (start.forw[0] + end.forw[0]) / 2,
      (start.forw[1] + end.forw[1]) / 2,
    ];
    const expectedBakw: Position = [
      (start.bakw[0] + end.bakw[0]) / 2,
      (start.bakw[1] + end.bakw[1]) / 2,
    ];
    const actual = transformArr(point(midForw), tin.tins!.forw!) as Position;
    return Math.hypot(actual[0] - expectedBakw[0], actual[1] - expectedBakw[1]);
  });
}

describe("points on constrained edges map onto the corresponding segment", () => {
  (
    [
      { label: "v3", useV2: false },
      { label: "v2", useV2: true },
    ] as const
  ).forEach(({ label, useV2 }) => {
    it(`naramachi_yasui_bunko (strict, ${label}): edge midpoints land on the bakw segment`, () => {
      const tin = buildTin("naramachi_yasui_bunko", Tin.MODE_STRICT, useV2);
      // bakw は web mercator（値域 ~1e7）。1e-6 m 未満なら浮動小数点誤差の範囲。
      expect(Math.max(...edgeMidpointDeviations(tin))).toBeLessThan(1e-6);
    });
  });

  it("uno_bus_gtfs_error (loose): edge midpoints land on the bakw segment", () => {
    // loose は resolveOverlaps を通らない基準ケース。
    const tin = buildTin("uno_bus_gtfs_error", Tin.MODE_LOOSE);
    expect(Math.max(...edgeMidpointDeviations(tin))).toBeLessThan(1e-6);
  });
});

// ─── resolveOverlaps 単体: 配列位置と頂点 index の名前空間の対応 ──────────────

describe("resolveOverlaps constraint protection", () => {
  function createTriPair(
    forward: [number, number][],
    backward: [number, number][],
    indices: string[],
  ): { forw: Tri; bakw: Tri } {
    const closedForw = [...forward, forward[0]];
    const properties = ("abc".split("") as PropertyTriKey[]).reduce(
      (acc, key, idx) => {
        acc[key] = { geom: backward[idx], index: indices[idx] };
        return acc;
      },
      {} as Record<PropertyTriKey, { geom: [number, number]; index: string }>,
    );
    const forwTri = polygon([closedForw], properties) as Tri;
    return { forw: forwTri, bakw: counterTri(forwTri) };
  }

  /**
   * 共有辺 (index "0", "e0") を持つ重なり合う三角形ペア。
   * pointsSet 内の配列位置は 0/1/2/3 で、位置 2 の頂点 index が "e0"。
   * 制約エッジは配列位置で [0, 2] と与えられる。
   */
  function buildOverlappingPair() {
    const triPairA = createTriPair(
      [
        [0, 0],
        [2, 0],
        [0, 2],
      ],
      [
        [0, 0],
        [2, 0],
        [0, 2],
      ],
      ["0", "e0", "1"],
    );
    const triPairB = createTriPair(
      [
        [0, 0],
        [2, 0],
        [2, 2],
      ],
      [
        [0, 0],
        [2, 0],
        [1, 1],
      ],
      ["0", "e0", "2"],
    );
    // insertSearchIndex が features へ push するため、空の FeatureCollection から始める
    const tinsBD = {
      forw: featureCollection([]) as unknown as Tins,
      bakw: featureCollection([]) as unknown as Tins,
    };
    const searchIndex: SearchIndex = {};
    insertSearchIndex(searchIndex, triPairA, tinsBD);
    insertSearchIndex(searchIndex, triPairB, tinsBD);
    return { tinsBD, searchIndex };
  }

  // 配列位置 → 頂点 index。位置 2 が "e0"（配列位置と index が一致しない）。
  const pointIndices = [0, 1, "e0", 2];

  it("flips the shared edge when it is not constrained", () => {
    const { tinsBD, searchIndex } = buildOverlappingPair();
    const repaired = resolveOverlaps(tinsBD, searchIndex, [], pointIndices);
    expect(repaired).toBe(true);
  });

  it("protects a constrained edge whose endpoint is an edge intermediate node", () => {
    const { tinsBD, searchIndex } = buildOverlappingPair();
    // 配列位置ペア [0, 2] = 頂点 index ("0", "e0") の制約エッジ
    const repaired = resolveOverlaps(tinsBD, searchIndex, [[0, 2]], pointIndices);
    expect(repaired).toBe(false);

    const combos = tinsBD.bakw.features.map((tri) =>
      ("abc".split("") as PropertyTriKey[])
        .map((key) => `${tri.properties![key].index}`)
        .sort()
        .join("-"),
    );
    expect(combos).toEqual(["0-1-e0", "0-2-e0"]);
  });
});
