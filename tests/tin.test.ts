import { describe, expect, it } from "vitest";
import { Options, Tin } from "../src/index.ts";
import { toBeDeepCloseTo } from "jest-matcher-deep-close-to";
import { polygon, featureCollection } from "@turf/turf";
import { counterTri } from "@maplat/transform";
import type { Compiled, PropertyTriKey, Tri, Tins } from "@maplat/transform";
import { resolveOverlaps } from "../src/strict-overlap.ts";
import type { SearchIndex } from "../src/searchutils.ts";
import { insertSearchIndex } from "../src/searchutils.ts";
import fs from "node:fs";

expect.extend({ toBeDeepCloseTo });

const loadMap = (filename: string): Record<string, unknown> =>
  JSON.parse(fs.readFileSync(`${__dirname}/maps/${filename}.json`, "utf-8"));

const loadCompiled = (filename: string): Compiled =>
  JSON.parse(fs.readFileSync(`${__dirname}/compiled/${filename}.json`, "utf-8"));

function treeWalk(obj: unknown, depth: number): unknown {
  if (typeof obj === "object" && obj !== null) {
    Object.keys(obj).forEach(
      (key) =>
        ((obj as Record<string, unknown>)[key] = treeWalk(
          (obj as Record<string, unknown>)[key],
          depth,
        )),
    );
  } else if (typeof obj === "number" && !`${obj}`.match(/^\d+$/)) {
    obj = Math.round(obj * Math.pow(10, depth)) / Math.pow(10, depth);
  }
  return obj;
}

function sortTinsPoint(tins_points: number[][]) {
  return tins_points
    .map((points) =>
      points
        .map((key) => `${key}`)
        .sort()
        .join("_"),
    )
    .sort();
}

function sortKinksPoint(kinks_points: number[][]) {
  return (treeWalk(kinks_points, 5) as number[][]).sort((a, b) =>
    a[0] === b[0]
      ? a[1] === b[1]
        ? 0
        : a[1] > b[1]
          ? 1
          : -1
      : a[0] > b[0]
        ? 1
        : -1,
  );
}

// ─── GCP ビルド + compiled 比較テスト ────────────────────────────────────────
// Nara / Fushimi / Miesan × v2 / v3

type BuildDataset = {
  label: string;
  key: string;
  ver: "v2" | "v3";
  useV2: boolean;
  /** map ファイルから GCP を読み込む場合は "map"、compiled.points から読む場合は "compiled_points" */
  gcpSource?: "map" | "compiled_points";
};

function buildFromDataset(dataset: BuildDataset): Compiled {
  const { key, ver, useV2, gcpSource = "map" } = dataset;
  const refCompiled = loadCompiled(`${key}_${ver}`);

  let tinOptions: ConstructorParameters<typeof Tin>[0];
  let gcps: Parameters<Tin["setPoints"]>[0];
  let edges: Parameters<Tin["setEdges"]>[0] | undefined;

  if (gcpSource === "compiled_points") {
    // compiled.points から GCP を復元（pre-compiled マップ用）
    // v2 の GCP ソースを使う（v2/v3 で GCP は同じ）
    const gcpSource2 = loadCompiled(`${key}_v2`);
    tinOptions = {
      wh: gcpSource2.wh as [number, number],
      strictMode: gcpSource2.strictMode as Options["strictMode"],
      vertexMode: gcpSource2.vertexMode as Options["vertexMode"],
      stateFull: false,
      useV2Algorithm: useV2,
    };
    gcps = gcpSource2.points as Parameters<Tin["setPoints"]>[0];
    edges = gcpSource2.edges?.length
      ? (gcpSource2.edges as Parameters<Tin["setEdges"]>[0])
      : undefined;
  } else {
    const load_m = loadMap(key);
    tinOptions = {
      wh: [load_m.width, load_m.height] as [number, number],
      strictMode: load_m.strictMode as Options["strictMode"],
      vertexMode: load_m.vertexMode as Options["vertexMode"],
      stateFull: false,
      useV2Algorithm: useV2,
    };
    gcps = load_m.gcps as Parameters<Tin["setPoints"]>[0];
    edges = load_m.edges as Parameters<Tin["setEdges"]>[0] | undefined;
  }

  const tin = new Tin(tinOptions);
  tin.setPoints(gcps);
  if (edges) tin.setEdges(edges);
  tin.updateTin();

  const built = JSON.parse(JSON.stringify(tin.getCompiled())) as Compiled;

  // setCompiled → getCompiled round-trip
  const lTin = new Tin({ useV2Algorithm: useV2 });
  lTin.setCompiled(refCompiled);
  const loaded = JSON.parse(JSON.stringify(lTin.getCompiled())) as Compiled;

  // Compare build vs reference file
  const ref = JSON.parse(JSON.stringify(refCompiled)) as Compiled;

  [ref, loaded].forEach((target) => {
    expect(treeWalk(built.points, 5)).toEqual(treeWalk(target.points, 5));
    expect(treeWalk(built.edges, 5)).toEqual(treeWalk(target.edges, 5));

    built.tins_points.forEach((built_tins, idx) => {
      expect(sortTinsPoint(built_tins as number[][])).toEqual(
        sortTinsPoint(target.tins_points[idx] as number[][]),
      );
    });

    expect(treeWalk(built.edgeNodes, 5)).toEqual(treeWalk(target.edgeNodes, 5));

    if (built.kinks_points) {
      expect(sortKinksPoint(built.kinks_points as number[][])).toEqual(
        sortKinksPoint(target.kinks_points as number[][]),
      );
    }
  });

  // Metadata
  expect(built.yaxisMode).toEqual(ref.yaxisMode ?? built.yaxisMode);
  expect(built.vertexMode).toEqual(ref.vertexMode);
  expect(built.strictMode).toEqual(ref.strictMode);
  expect(built.strict_status).toEqual(ref.strict_status);
  expect(built.version).toEqual(ref.version);
  expect(loaded.version).toEqual(ref.version);

  return built;
}

const BUILD_DATASETS: BuildDataset[] = [
  { label: "Nara v2",    key: "naramachi_yasui_bunko", ver: "v2", useV2: true  },
  { label: "Nara v3",    key: "naramachi_yasui_bunko", ver: "v3", useV2: false },
  { label: "Fushimi v2", key: "fushimijo_maplat",      ver: "v2", useV2: true  },
  { label: "Fushimi v3", key: "fushimijo_maplat",      ver: "v3", useV2: false },
  { label: "Miesan v2",       key: "miesan_ginza_map",           ver: "v2", useV2: true,  gcpSource: "compiled_points" },
  { label: "Miesan v3",       key: "miesan_ginza_map",           ver: "v3", useV2: false, gcpSource: "compiled_points" },
  { label: "Tatebayashi Castle v2", key: "tatebayashi_castle_akimoto", ver: "v2", useV2: true,  gcpSource: "compiled_points" },
  { label: "Tatebayashi Castle v3", key: "tatebayashi_castle_akimoto", ver: "v3", useV2: false, gcpSource: "compiled_points" },
  { label: "Tatebayashi Jokamachi v2", key: "tatebayashi_kaei_jokamachi", ver: "v2", useV2: true,  gcpSource: "compiled_points" },
  { label: "Tatebayashi Jokamachi v3", key: "tatebayashi_kaei_jokamachi", ver: "v3", useV2: false, gcpSource: "compiled_points" },
];

describe("Tin — build accuracy (GCP maps)", () => {
  BUILD_DATASETS.forEach((dataset) => {
    const { label } = dataset;
    describe(`${label}`, () => {
      it(`builds from GCPs and matches compiled reference (${label})`, () => {
        buildFromDataset(dataset);
      });
    });
  });
});

// ─── v2 と v3 で頂点数・version が異なることを確認 ───────────────────────────

describe("Tin — v2 vs v3 format differences", () => {
  // NOTE: V3 は plain/birdeye を問わず up to 36 頂点（withEdgeVertices=true）。
  // V2 は常に 4 頂点。
  (["fushimijo_maplat", "miesan_ginza_map", "tatebayashi_castle_akimoto", "tatebayashi_kaei_jokamachi"] as const).forEach((key) => {
    const label = key === "fushimijo_maplat" ? "Fushimi" : key === "miesan_ginza_map" ? "Miesan" : key === "tatebayashi_castle_akimoto" ? "Tatebayashi Castle" : "Tatebayashi Jokamachi";
    it(`${label}: v3 has more boundary vertices than v2`, () => {
      const v2 = loadCompiled(`${key}_v2`);
      const v3 = loadCompiled(`${key}_v3`);
      expect(v2.version).toEqual(2.00703);
      expect(v3.version).toEqual(3);
      expect(v3.vertices_points.length).toBeGreaterThan(v2.vertices_points.length);
    });
  });
});

// ─── Uno マップ: strict_status チェック ─────────────────────────────────────

describe("Tin — Uno maps (error/status checks)", () => {
  it("uno_bus_gtfs_loose: builds successfully (strict/loose)", () => {
    const load_m = loadMap("uno_bus_gtfs_loose");
    const tin = new Tin({
      wh: [load_m.width, load_m.height] as [number, number],
      strictMode: load_m.strictMode as Options["strictMode"],
      vertexMode: load_m.vertexMode as Options["vertexMode"],
      stateFull: false,
    });
    tin.setPoints(load_m.gcps as Parameters<Tin["setPoints"]>[0]);
    if (load_m.edges) tin.setEdges(load_m.edges as Parameters<Tin["setEdges"]>[0]);
    tin.updateTin();
    expect(["strict", "loose"]).toContain(tin.strict_status);
  });

  it("uno_bus_gtfs_error: results in strict_error", () => {
    const load_m = loadMap("uno_bus_gtfs_error");
    const tin = new Tin({
      wh: [load_m.width, load_m.height] as [number, number],
      strictMode: load_m.strictMode as Options["strictMode"],
      vertexMode: load_m.vertexMode as Options["vertexMode"],
      stateFull: false,
    });
    tin.setPoints(load_m.gcps as Parameters<Tin["setPoints"]>[0]);
    if (load_m.edges) tin.setEdges(load_m.edges as Parameters<Tin["setEdges"]>[0]);
    tin.updateTin();
    expect(tin.strict_status).toEqual(Tin.STATUS_ERROR);
  });
});

// ─── bounds ハンドリング ──────────────────────────────────────────────────────

describe("bounds handling", () => {
  it("handles strict mode error correctly", () => {
    const tin = new Tin({
      bounds: [
        [0, 0],
        [100, 0],
        [100, 100],
        [0, 100],
      ],
      strictMode: Tin.MODE_STRICT,
      stateFull: false,
    });

    tin.setPoints([
      [[20, 20], [120, 20]],
      [[80, 20], [180, 20]],
      [[80, 80], [180, 80]],
      [[20, 80], [120, 80]],
      [[50, 50], [150, 50]],
    ]);

    tin.updateTin();

    expect(tin.xy).toEqual([0, 0]);
    expect(tin.wh).toEqual([100, 100]);
    expect(tin.strict_status).toEqual(Tin.STATUS_ERROR);

    expect(() => tin.transform([50, 50], true)).toThrow(
      'Backward transform is not allowed if strict_status == "strict_error"',
    );

    const forward = tin.transform([50, 50]);
    expect(forward).toBeDefined();
  });
});

// ─── Birdseye boundary handling ──────────────────────────────────────────────

describe("Birdseye boundary handling", () => {
  it("uses quadrant-specific scaling when enough samples are available", () => {
    const baseOptions: Partial<Options> = {
      wh: [200, 200],
      strictMode: Tin.MODE_AUTO,
    };

    const gcps: Options["points"] = [
      [[0, 0], [0, 0]],
      [[200, 0], [260, -40]],
      [[200, 200], [240, 240]],
      [[0, 200], [-20, 220]],
      [[80, 120], [120, 180]],
    ];

    const plain = new Tin({ ...baseOptions, vertexMode: Tin.VERTEX_PLAIN });
    plain.setPoints(gcps);
    plain.updateTin();

    const bird = new Tin({ ...baseOptions, vertexMode: Tin.VERTEX_BIRDEYE });
    bird.setPoints(gcps);
    bird.updateTin();

    const plainVertices = plain.getCompiled().vertices_points;
    const birdVertices = bird.getCompiled().vertices_points;

    expect(birdVertices).not.toEqual(plainVertices);
  });
});

// ─── Strict overlap remediation ──────────────────────────────────────────────

describe("Strict overlap remediation", () => {
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
    const bakwTri = counterTri(forwTri);
    return { forw: forwTri, bakw: bakwTri };
  }

  it("re-triangulates overlapping shared-edge triangles", () => {
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
      ["0", "1", "2"],
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
      ["0", "1", "3"],
    );

    const tinsBD = {
      forw: featureCollection([triPairA.forw, triPairB.forw]) as Tins,
      bakw: featureCollection([triPairA.bakw, triPairB.bakw]) as Tins,
    };

    const searchIndex: SearchIndex = {};
    insertSearchIndex(searchIndex, triPairA, tinsBD);
    insertSearchIndex(searchIndex, triPairB, tinsBD);

    const repaired = resolveOverlaps(tinsBD, searchIndex, []);
    expect(repaired).toBe(true);

    const combos = tinsBD.bakw.features.map((tri) =>
      ("abc".split("") as PropertyTriKey[])
        .map((key) => `${tri.properties![key].index}`)
        .sort()
        .join("-"),
    );

    expect(combos).toContain("0-2-3");
    expect(combos).toContain("1-2-3");
  });
});
