import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { featureCollection, point, polygon } from "@turf/turf";
import { counterTri, transformArr } from "@maplat/transform";
import { orient2d } from "robust-predicates";
import type { PropertyTriKey, Tins, Tri } from "@maplat/transform";
import type { Position } from "geojson";
import { Options, Tin } from "../src/index.ts";
import { REAL_DATA_TIMEOUT_MS } from "./timeouts.ts";
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

describe("strict mode keeps constrained edges (with edge intermediate nodes)", { timeout: REAL_DATA_TIMEOUT_MS }, () => {
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
// （2.00704 以降は重み補正は無いが、辺上の検査は補間そのもので行う。）

/**
 * 制約エッジの中点を forw TIN 全体で変換し、bakw 線分の中点からのずれを、エッジの bakw の長さに対する
 * 割合と距離で返す。
 *
 * 制約エッジが TIN の辺なら、中点は辺の上で正確に写る。ただし、必須エッジの中継点が一直線に並ぶ
 * 面積ほぼ 0 の三角形（禁止制約で解消しきれないもの）が辺の隣にあると、丸めで中点が隣の細長い三角形に
 * 入り、補間が大きく外れる。そのずれる辺の数と量は、データごとに上限を固定して見張る。
 */
function edgeMidpointDeviations(tin: Tin): { ratio: number; distance: number }[] {
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
    const distance = Math.hypot(actual[0] - expectedBakw[0], actual[1] - expectedBakw[1]);
    const length = Math.hypot(start.bakw[0] - end.bakw[0], start.bakw[1] - end.bakw[1]) || 1;
    return { ratio: distance / length, distance };
  });
}

/** 地図面（forw）・地理面（bakw）の三角網の、面積がほぼ 0 の三角形の数（2×面積が外接矩形の長辺の 2 乗の 1e-9 未満） */
function sliverCounts(tin: Tin): [number, number] {
  const count = (mesh: Tins | undefined) =>
    mesh
      ? mesh.features.filter((tri) => {
          const [p, q, r] = tri.geometry!.coordinates[0];
          const w = Math.max(p[0], q[0], r[0]) - Math.min(p[0], q[0], r[0]);
          const h = Math.max(p[1], q[1], r[1]) - Math.min(p[1], q[1], r[1]);
          return Math.abs(orient2d(p[0], p[1], q[0], q[1], r[0], r[1])) < 1e-9 * Math.max(w, h) ** 2;
        }).length
      : 0;
  return [count(tin.tins!.forw), count(tin.tins!.bakw)];
}

/** 延岡の副層（bounds を持つ）を作る。 */
function buildNobeokaSub(strictMode: string): Tin {
  const map = loadMap("1932_nobeoka") as { sub_maps: { compiled: Record<string, unknown> }[] };
  const compiled = map.sub_maps[0].compiled;
  const tin = new Tin({
    bounds: compiled.bounds as [number, number][],
    strictMode: strictMode as Options["strictMode"],
    vertexMode: compiled.vertexMode as Options["vertexMode"],
    stateFull: false,
  });
  tin.setPoints(compiled.points as Parameters<Tin["setPoints"]>[0]);
  tin.setEdges(compiled.edges as Parameters<Tin["setEdges"]>[0]);
  tin.updateTin();
  return tin;
}

describe("points on constrained edges map onto the corresponding segment", { timeout: REAL_DATA_TIMEOUT_MS }, () => {
  (
    [
      { label: "v3", useV2: false },
      { label: "v2", useV2: true },
    ] as const
  ).forEach(({ label, useV2 }) => {
    it(`naramachi_yasui_bunko (strict, ${label}): edge midpoints land on the bakw segment`, () => {
      const tin = buildTin("naramachi_yasui_bunko", Tin.MODE_STRICT, useV2);
      // bakw は web mercator（値域 ~1e7）。1e-6 m 未満なら浮動小数点誤差の範囲。
      expect(Math.max(...edgeMidpointDeviations(tin).map((d) => d.distance))).toBeLessThan(1e-6);
    });
  });

  it("uno_bus_gtfs_error (loose): 中点がずれる辺は 1 本で、ずれは 9 m 以下（辺の長さの 5% 以下）", () => {
    // loose は resolveOverlaps を通らない基準ケース。必須エッジは三角網に残っている（上の試験）が、
    // 1 本だけ、辺の隣の面積ほぼ 0 の三角形に中点が入り、8.8 m（辺の長さの 3.9%）ずれる。
    const tin = buildTin("uno_bus_gtfs_error", Tin.MODE_LOOSE);
    const deviating = edgeMidpointDeviations(tin).filter((d) => d.ratio > 1e-6);
    expect(deviating.length).toBeLessThanOrEqual(1);
    expect(Math.max(0, ...deviating.map((d) => d.distance))).toBeLessThanOrEqual(9);
    expect(Math.max(0, ...deviating.map((d) => d.ratio))).toBeLessThanOrEqual(0.05);
  });

  it.each([
    ["strict"],
    ["auto"]
  ] as const)("uno_bus_gtfs_error (%s): 中点がずれる辺は 5 本以下で、ずれは辺の長さの 37% 以下", (mode) => {
    // 元から strict_error のデータ。strict に戻せないので、凸包の辺を全部制約にした三角網を採る。
    // その副作用で、中点がずれる必須エッジが base の 2 本から 5 本に増える。最大のずれ（110 m・辺の
    // 長さの 36%）は base と同じ。
    const tin = buildTin("uno_bus_gtfs_error", mode);
    const deviating = edgeMidpointDeviations(tin).filter((d) => d.ratio > 1e-6);
    expect(deviating.length).toBeLessThanOrEqual(5);
    expect(Math.max(0, ...deviating.map((d) => d.ratio))).toBeLessThanOrEqual(0.37);
  });

  it.each([
    // [モード, ずれる辺の数の上限, ずれの割合の上限]
    ["strict", 0, 0],
    ["auto", 0, 0],
    ["loose", 1, 0.11] // 1 辺が長さの 10% ずれる
  ] as const)("延岡の副層 (%s): 中点がずれる辺は %i 本以下で、ずれは辺の長さの %f 以下", (mode, count, ratio) => {
    const tin = buildNobeokaSub(mode);
    const deviating = edgeMidpointDeviations(tin).filter((d) => d.ratio > 1e-6);
    expect(deviating.length).toBeLessThanOrEqual(count);
    expect(Math.max(0, ...deviating.map((d) => d.ratio))).toBeLessThanOrEqual(ratio);
  });
});

// ─── 面積がほぼ 0 の三角形（延岡の副層） ────────────────────────────────────
//
// 副層は凸包の辺を固定した分、同じ群（必須エッジの中継点）の三角形を解消する反転が減り、禁止制約の
// 残数が増える（6→18）。そのとき地図面に現れる面積ほぼ 0 の三角形の数を固定する
// （凸包の辺を制約にする前は forw・bakw とも 0）。

describe("延岡の副層の面積がほぼ 0 の三角形", { timeout: REAL_DATA_TIMEOUT_MS }, () => {
  it.each([
    ["strict", [1, 2]],
    ["auto", [1, 0]],
    ["loose", [3, 0]]
  ] as const)("%s: forw・bakw は %j 個", (mode, expected) => {
    expect(sliverCounts(buildNobeokaSub(mode))).toEqual(expected);
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
