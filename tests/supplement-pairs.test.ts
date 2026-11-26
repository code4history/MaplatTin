import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { booleanPointInPolygon, convex, featureCollection, point, polygon } from "@turf/turf";
import { describe, expect, it } from "vitest";
import { Transform, type WorldFile } from "@maplat/transform";
import { MAX_SUPPLEMENT_PAIR_ROUNDS, MAX_SUPPLEMENT_PAIRS } from "../src/supplement-pairs.ts";
import { Tin, type CompiledWithSupplement as Compiled, type Options } from "../src/index.ts";
import { REAL_DATA_TIMEOUT_MS } from "./timeouts.ts";
import { intrusionFraction } from "./hull-intrusion.ts";
import baseline from "./supplement-pairs-baseline.json";
import {
  buildFixture,
  cachedFixture,
  fixtureOptions,
  loadMapFixture,
  orientationFlips
} from "./supplement-fixtures.ts";

// #89: strict と両立しない凸包の辺に、システムが補完点（supplementPairs）を足す。
// 受け入れ条件の番号は、設計書（2026-11-26-jan27-tin-89-auxiliary-pairs-design.md）の §9。

/** 補完点が付く 6 枚。[地図, 補完点の数の上限（設計書 §9 の 3）] */
const SIX_MAPS = [
  ["1932_nobeoka", 4],
  ["tatebayashi_castle_akimoto", 4],
  ["naramachi_yasui_bunko", 6],
  ["miesan_ginza_map", 3],
  ["tatebayashi_kaei_jokamachi", 2],
  ["fushimijo_maplat", 1]
] as const;
const MODES = [Tin.MODE_AUTO, Tin.MODE_STRICT] as const;
const ALL_MODES = [Tin.MODE_AUTO, Tin.MODE_STRICT, Tin.MODE_LOOSE] as const;

const digest = (compiled: Compiled) =>
  createHash("sha256").update(JSON.stringify(compiled)).digest("hex").slice(0, 16);

describe.each(SIX_MAPS)("%s（補完点の上限 %i 点）", (name, limit) => {
  describe.each(MODES)("strictMode=%s", (mode) => {
    const tin = cachedFixture(name, mode);

    // 受け入れ条件 1・2
    it(
      "紙の面の食い込みが 0.01% 以下で、strict を保ち、反転が 0",
      () => {
        expect(tin.strict_status).toBe(Tin.STATUS_STRICT);
        expect(orientationFlips(tin)).toBe(0);
        expect(intrusionFraction(tin, 0)).toBeLessThanOrEqual(1e-4);
      },
      REAL_DATA_TIMEOUT_MS
    );

    // 受け入れ条件 3
    it("補完点の数が上限以下で、1 辺に 1 点", () => {
      const pairs = tin.supplementPairs;
      expect(pairs.length).toBeLessThanOrEqual(limit);
      expect(pairs.length).toBeLessThanOrEqual(MAX_SUPPLEMENT_PAIRS);
      const edges = pairs.map(({ edge }) => `${edge[0]}|${edge[1]}`);
      expect(new Set(edges).size).toBe(edges.length);
    });

    // 受け入れ条件 7・10
    it("compiled: 補完点は edgeNodes の末尾にあり、points・edges には入らない", () => {
      const compiled = tin.getCompiled();
      const pairs = compiled.supplementPairs!;
      expect(pairs.length).toBe(tin.supplementPairs.length);
      expect(pairs.length).toBeGreaterThan(0);
      const nodes = compiled.edgeNodes!;
      const first = nodes.length - pairs.length;
      expect(pairs.map(({ node }) => node)).toEqual(pairs.map((_, i) => first + i));
      expect(pairs.every(({ kind }) => kind === "hullEdge")).toBe(true);
      // 添字は、数・"c"・"b{n}"・"e{n}" だけ。補完点は "e{n}" で指す
      const valid = (index: unknown) =>
        typeof index === "number" || (typeof index === "string" && /^(c|b\d+|e\d+)$/.test(index));
      for (const triangle of compiled.tins_points.flat()) for (const index of triangle) expect(valid(index)).toBe(true);
      for (const { node } of pairs) {
        expect(compiled.tins_points[0].flat()).toContain(`e${node}`);
      }
      // 人間の対応点・必須エッジは入力のまま
      const input = fixtureOptions(name, mode);
      expect(compiled.points).toEqual(input.points);
      expect(compiled.edges).toEqual(tin.edges);
      expect(tin.points).toEqual(input.points);
    });
  });
});

// 受け入れ条件 8: 同じ入力から同じ結果・溜まらない
describe("決定性と作り直し", () => {
  const name = "tatebayashi_castle_akimoto";

  it("同じ入力で 2 回 updateTin() しても getCompiled() が一致する", () => {
    const tin = buildFixture(name, Tin.MODE_AUTO);
    const first = JSON.stringify(tin.getCompiled());
    tin.updateTin();
    expect(JSON.stringify(tin.getCompiled())).toBe(first);
    expect(JSON.stringify(buildFixture(name, Tin.MODE_AUTO).getCompiled())).toBe(first);
  }, REAL_DATA_TIMEOUT_MS);

  it("対応点を足して引いて元に戻すと、getCompiled() が元と一致する（補完点が溜まらない）", () => {
    const options = fixtureOptions(name, Tin.MODE_AUTO);
    const tin = new Tin(options);
    tin.updateTin();
    const original = JSON.stringify(tin.getCompiled());
    const points = options.points!;
    const extra = [[points[0][0][0] + 5, points[0][0][1] + 5], points[0][1]] as [number[], number[]];
    tin.setPoints([...points, extra]);
    tin.updateTin();
    expect(JSON.stringify(tin.getCompiled())).not.toBe(original);
    tin.setPoints(points);
    tin.updateTin();
    expect(JSON.stringify(tin.getCompiled())).toBe(original);
  }, REAL_DATA_TIMEOUT_MS);
});

// 受け入れ条件 8: 人間が同じ位置に対応点を打つと、補完点は 0 になる
describe.each(["1932_nobeoka", "tatebayashi_castle_akimoto", "naramachi_yasui_bunko"])(
  "人間が補完点と同じ位置に対応点を打つ: %s",
  (name) => {
    it(
      "補完点が 0 で、strict のまま、食い込みが 0.01% 以下",
      () => {
        const auto = cachedFixture(name, Tin.MODE_AUTO);
        const follow = auto.yaxisMode === Tin.YAXIS_FOLLOW;
        const options = fixtureOptions(name, Tin.MODE_AUTO);
        const human = auto.supplementPairs.map(({ forw, bakw }) => [forw, follow ? [bakw[0], -bakw[1]] : bakw]);
        expect(human.length).toBeGreaterThan(0);
        const tin = new Tin({ ...options, points: [...options.points!, ...human] as Options["points"] });
        tin.updateTin();
        expect(tin.supplementPairs).toHaveLength(0);
        expect(tin.strict_status).toBe(Tin.STATUS_STRICT);
        expect(intrusionFraction(tin, 0)).toBeLessThanOrEqual(1e-4);
      },
      REAL_DATA_TIMEOUT_MS
    );
  }
);

// 受け入れ条件 4・12: 足さない場合・切り替えで #91 の時点と変わらない
describe("supplementPairs: false と、外れた辺が無い場合", () => {
  const names = [...new Set(Object.keys(baseline.v3).map((key) => key.split(":")[0]))];
  describe.each(names)("%s", (name) => {
    it.each(ALL_MODES)(
      "strictMode=%s: false なら #91 の getCompiled() と 1 ビットも変わらない",
      (mode) => {
        const tin = buildFixture(name, mode, { supplementPairs: false });
        expect(tin.supplementPairs).toHaveLength(0);
        const compiled = tin.getCompiled();
        expect(compiled.supplementPairs).toBeUndefined();
        expect(digest(compiled)).toBe(baseline.v3[`${name}:${mode}` as keyof typeof baseline.v3]);
      },
      REAL_DATA_TIMEOUT_MS
    );

    it.each(ALL_MODES)(
      "strictMode=%s: 補完点が無いなら、既定でも #91 の getCompiled() と一致する",
      (mode) => {
        const tin = cachedFixture(name, mode);
        if (tin.supplementPairs.length > 0) return;
        expect(tin.getCompiled().supplementPairs).toBeUndefined();
        expect(digest(tin.getCompiled())).toBe(baseline.v3[`${name}:${mode}` as keyof typeof baseline.v3]);
      },
      REAL_DATA_TIMEOUT_MS
    );
  });
});

// 受け入れ条件 4: 外れた辺が無い入力（#88 の格子の試験の入力）は、補完の手順に入らず、結果が変わらない
const W = 2048;
const merc = ([lon, lat]: number[]): number[] => [
  (6378137 * lon * Math.PI) / 180,
  6378137 * Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360))
];
const pixelToLonLat = ([x, y]: number[]): number[] => [125 + (25 / W) * (x - 0.5), 50 - (25 / W) * (y - 0.5)];
function bentGrid(n: number, lo: number, hi: number, k: number): NonNullable<Options["points"]> {
  const values = Array.from({ length: n }, (_, i) => lo + ((hi - lo) * i) / (n - 1));
  return values.flatMap((y) =>
    values.map((x) => {
      const u = (x - (lo + hi) / 2) / ((hi - lo) / 2);
      const [lon, lat] = pixelToLonLat([x, y]);
      return [[x, y], merc([lon, lat + k * u * u])] as [number[], number[]];
    })
  );
}
const rectangle = (deg: number): { wh: number[]; points: NonNullable<Options["points"]> } => {
  const h = 1000;
  const w = h * Math.tan((deg * Math.PI) / 180);
  const xy = [
    [0, 0], [w, 0], [w, h], [0, h], [w / 2, h / 2],
    [w * 0.75, h * 0.25], [w * 0.25, h * 0.75], [w * 0.75, h * 0.75], [w * 0.25, h * 0.25]
  ];
  return { wh: [w, h], points: xy.map(([x, y]) => [[x, y], [x, -y]] as [number[], number[]]) };
};
const noDroppedInputs: [string, Options][] = [
  ...[0, 0.001, 0.0122, 0.1, -0.0122].flatMap((k) =>
    [[3, W * 0.35, W * 0.65], [5, W * 0.2, W * 0.8]].flatMap(([n, lo, hi]) =>
      MODES.map((mode): [string, Options] => [
        `${n}×${n} の格子 k=${k} strictMode=${mode}`,
        { wh: [W, W], yaxisMode: "invert", points: bentGrid(n, lo, hi, k), strictMode: mode }
      ])
    )
  ),
  ...[50, 40, 60, 30].map((deg): [string, Options] => [
    `隅が ${deg}° の矩形`,
    { ...rectangle(deg), strictMode: Tin.MODE_AUTO }
  ])
];
describe("外れた辺が無い入力", () => {
  it.each(noDroppedInputs)("%s: 補完点 0・三角網を組み直さず、supplementPairs: false と同じ", (_, options) => {
    const tin = new Tin(options);
    tin.updateTin();
    expect(tin.supplementPairs).toHaveLength(0);
    expect(tin.strict_status).toBe(Tin.STATUS_STRICT);
    expect(tin.supplementDiagnostics).toBeUndefined();
    const without = new Tin({ ...options, supplementPairs: false });
    without.updateTin();
    expect(JSON.stringify(tin.getCompiled())).toBe(JSON.stringify(without.getCompiled()));
  });
});

// 受け入れ条件 9: world file 外周（`outerTransform: "worldFile"`）でも、外れた辺に補完点が付く
function fitWorldFile(points: NonNullable<Options["points"]>): WorldFile {
  const mean = (side: 0 | 1, axis: number) =>
    points.reduce((sum, pair) => sum + pair[side][axis], 0) / points.length;
  const xMean = mean(0, 0);
  const yMean = mean(0, 1);
  const rows = points.map(([[x, y], crs]) => [x - xMean, y - yMean, ...crs]);
  const dot = (a: number, b: number) => rows.reduce((sum, row) => sum + row[a] * row[b], 0);
  const xx = dot(0, 0), xy = dot(0, 1), yy = dot(1, 1);
  const det = xx * yy - xy * xy;
  // 中心化した最小二乗で大域アフィンを求め、左上画素の中心の座標を原点にする
  const fit = (axis: number) => {
    const x = (yy * dot(0, axis + 2) - xy * dot(1, axis + 2)) / det;
    const y = (xx * dot(1, axis + 2) - xy * dot(0, axis + 2)) / det;
    return [x, y, mean(1, axis) + x * (0.5 - xMean) + y * (0.5 - yMean)];
  };
  const [xScale, xSkew, xOrigin] = fit(0);
  const [ySkew, yScale, yOrigin] = fit(1);
  return { xScale, xSkew, xOrigin, ySkew, yScale, yOrigin };
}

describe.each(["1932_nobeoka", "tatebayashi_castle_akimoto", "miesan_ginza_map"])("world file 外周: %s", (name) => {
  const options = fixtureOptions(name, Tin.MODE_STRICT);
  const worldFile = fitWorldFile(options.points!);
  const build = (extra: Partial<Options>) => {
    const tin = new Tin({ ...options, outerTransform: "worldFile", worldFile, ...extra });
    tin.updateTin();
    return tin;
  };

  it(
    "strict を保って外れた辺に補完点が付き、紙の面の食い込みが減る",
    () => {
      const without = build({ supplementPairs: false });
      const tin = build({});
      expect(tin.boundaryDiagnostics).toMatchObject({ outerTransform: "worldFile" });
      expect(tin.strict_status).toBe(Tin.STATUS_STRICT);
      expect(tin.supplementPairs.length).toBeGreaterThan(0);
      expect(orientationFlips(tin)).toBe(0);
      expect(intrusionFraction(without, 0)).toBeGreaterThan(1e-4);
      expect(intrusionFraction(tin, 0)).toBeLessThanOrEqual(1e-4);
    },
    REAL_DATA_TIMEOUT_MS
  );

  it("compiled は world file の形で補完点を edgeNodes の末尾に持ち、Transform で読んで一致する", () => {
    const tin = build({});
    const compiled = JSON.parse(JSON.stringify(tin.getCompiled())) as Compiled;
    expect(compiled).toHaveProperty("outerTransform", "worldFile");
    const first = compiled.edgeNodes!.length - compiled.supplementPairs!.length;
    expect(compiled.supplementPairs!.map(({ node }) => node)).toEqual(compiled.supplementPairs!.map((_, i) => first + i));
    const reader = new Transform();
    reader.setCompiled(compiled);
    for (const { forw } of tin.supplementPairs) {
      const expected = tin.transform(forw, false) as number[];
      const actual = reader.transform(forw, false) as number[];
      expect(Math.hypot(expected[0] - actual[0], expected[1] - actual[1])).toBeLessThanOrEqual(1e-6);
    }
  });

  it("supplementPairs: false なら、補完点が無く、同じ入力の #91 の三角網のまま", () => {
    const without = build({ supplementPairs: false });
    expect(without.supplementPairs).toHaveLength(0);
    expect(without.getCompiled().supplementPairs).toBeUndefined();
  });
});

// 設計書 §10: 「まとめて」が通らず、辺ごとに試す経路・何も採用しない経路を、実データの GCP の部分集合で通す。
// 部分集合は、seed 付きの乱数（mulberry32）の Fisher–Yates で決まる（地図・seed・点数は、この経路を通ることを探して固定した）。
function subsetPoints(name: string, seed: number, size: number): NonNullable<Options["points"]> {
  let state = seed | 0;
  const random = () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  random(); // 探したときに、地図の選択と点数の決定に使った 2 回分
  random();
  const all = [...fixtureOptions(name, Tin.MODE_AUTO).points!];
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all.slice(0, size);
}

describe("部分集合の入力で、手間の上限に達して諦める経路を通す", () => {
  const build = (name: string, seed: number, size: number, extra: Partial<Options> = {}) => {
    const tin = new Tin({ ...fixtureOptions(name, Tin.MODE_AUTO), points: subsetPoints(name, seed, size), edges: [], ...extra });
    tin.updateTin();
    return tin;
  };

  it.each([
    ["tatebayashi_kaei_jokamachi", 38, 70],
    ["1932_nobeoka", 579, 44],
    ["tatebayashi_kaei_jokamachi", 83, 35]
  ] as const)(
    "%s（seed %i・%i 点）: まとめては不採用で、手間が上限に届いて諦め、補完点を使わない結果と 1 ビットも変わらない",
    (name, seed, size) => {
      const tin = build(name, seed, size);
      const diagnostics = tin.supplementDiagnostics!;
      expect(diagnostics).toMatchObject({ rounds: 1, batches: 0, perEdge: 0, multiPoint: 0 });
      expect(diagnostics.cost).toBeGreaterThanOrEqual(diagnostics.budget);
      expect(diagnostics.cost).toBeLessThanOrEqual(diagnostics.budget + 1);
      expect(tin.supplementPairs).toHaveLength(0);
      const without = build(name, seed, size, { supplementPairs: false });
      expect(JSON.stringify(tin.getCompiled())).toBe(JSON.stringify(without.getCompiled()));
    }
  );
});

// 受け入れ条件 14（M1）: 辺の近くに対応点が並ぶ入力（格子に揺らぎを付けたもの）でも、時間が補完点なしの 3.5 倍以下で、
// 諦めても strict を保ち、補完点を使わない結果（#91）より悪くならない
function jitteredGrid(n: number, seed: number, geoJitter: number): { wh: number[]; points: NonNullable<Options["points"]> } {
  let state = seed | 0;
  const random = () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const points: NonNullable<Options["points"]> = [];
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      const x = 100 * i + 50;
      const y = 100 * j + 50;
      const paper = [x + random() * 6 - 3, y + random() * 6 - 3];
      points.push([paper, [x + (random() * 2 - 1) * geoJitter, -y + (random() * 2 - 1) * geoJitter]]);
    }
  }
  return { wh: [100 * n + 100, 100 * n + 100], points };
}

describe.each([
  [31, 3, 3],
  [31, 2, 3],
  [21, 2, 3],
  [21, 1, 3],
  [15, 1, 0],
  [11, 4, 3]
] as const)("揺らぎを付けた格子 n=%i seed=%i 地理の揺らぎ %i m", (n, seed, geoJitter) => {
  const input = jitteredGrid(n, seed, geoJitter);
  const make = (extra: Partial<Options>) => new Tin({ ...input, strictMode: Tin.MODE_AUTO, ...extra });

  it(
    "strict を保ち、補完点を使わない結果より悪くならず、手間が上限を 1 以上は超えない",
    () => {
      const without = make({ supplementPairs: false });
      without.updateTin();
      const tin = make({});
      tin.updateTin();
      expect(tin.strict_status).toBe(without.strict_status);
      expect(orientationFlips(tin)).toBeLessThanOrEqual(orientationFlips(without));
      expect(intrusionFraction(tin, 0)).toBeLessThanOrEqual(intrusionFraction(without, 0) + 1e-12);
      const diagnostics = tin.supplementDiagnostics;
      if (diagnostics) expect(diagnostics.cost).toBeLessThanOrEqual(diagnostics.budget + 1);
    },
    REAL_DATA_TIMEOUT_MS * 2
  );

  // 時間は代表の 2 件だけ（全件は時間がかかり、基準が数十 ms の小さい入力は測定の揺れが大きい）
  it.skipIf(![[31, 3], [21, 2]].some(([a, b]) => a === n && b === seed))(
    "updateTin() の時間が、補完点なしの 3.5 倍以下",
    () => {
      const off = make({ supplementPairs: false });
      const on = make({});
      const best = (tin: Tin) => {
        let fastest = Infinity;
        for (let i = 0; i < 3; i++) {
          const start = performance.now();
          tin.updateTin();
          fastest = Math.min(fastest, performance.now() - start);
        }
        return fastest;
      };
      const tOff = best(off);
      const tOn = best(on);
      expect(tOn / tOff).toBeLessThanOrEqual(3.5);
    },
    REAL_DATA_TIMEOUT_MS * 4
  );
});

// 受け入れ条件 5: strict に戻せない地図は足さない
describe("uno_bus_gtfs_error（strict に戻せない）", () => {
  it(
    "補完点 0・loose のまま・食い込み 0.05% 以下",
    () => {
      const tin = cachedFixture("uno_bus_gtfs_error", Tin.MODE_AUTO);
      expect(tin.strict_status).toBe(Tin.STATUS_LOOSE);
      expect(tin.supplementPairs).toHaveLength(0);
      expect(intrusionFraction(tin, 0)).toBeLessThanOrEqual(5e-4);
    },
    REAL_DATA_TIMEOUT_MS
  );
});

// 受け入れ条件 6: V2 は変えない
describe("V2", () => {
  const names = [...new Set(Object.keys(baseline.v2).map((key) => key.split(":")[0]))];
  describe.each(names)("%s", (name) => {
    it.each(MODES)(
      "strictMode=%s: useV2Algorithm の getCompiled() が #91 の時点から 1 ビットも変わらず、補完点が無い",
      (mode) => {
        const tin = buildFixture(name, mode, { useV2Algorithm: true });
        const compiled = tin.getCompiled();
        expect(compiled.supplementPairs).toBeUndefined();
        expect(tin.supplementPairs).toHaveLength(0);
        expect(digest(compiled)).toBe(baseline.v2[`${name}:${mode}` as keyof typeof baseline.v2]);
      },
      REAL_DATA_TIMEOUT_MS
    );
  });
});

// 受け入れ条件 11: Transform で読める（公開済みの 1.1.0 と、node_modules の版の両方）
const PUBLISHED = resolve(
  import.meta.dirname,
  "../node_modules/.pnpm/@maplat+transform@1.1.0/node_modules/@maplat/transform/dist/maplat_transform.js"
);
const transformers: [string, () => Promise<typeof Transform>][] = [
  ["node_modules の @maplat/transform", async () => Transform],
  [
    "公開済みの @maplat/transform 1.1.0",
    async () => (await import(/* @vite-ignore */ pathToFileURL(PUBLISHED).href)).Transform
  ]
];

describe.each(["1932_nobeoka", "tatebayashi_castle_akimoto", "naramachi_yasui_bunko"])(
  "compiled を Transform で読む: %s",
  (name) => {
    it.each(transformers)(
      "%s: 補完点を含む三角形の中の点で、Tin との差が 1e-6 以下、往復の差が 1e-6 画素以下",
      async (label, load) => {
        if (label.startsWith("公開済み") && !existsSync(PUBLISHED)) return;
        const tin = cachedFixture(name, Tin.MODE_AUTO);
        const compiled = JSON.parse(JSON.stringify(tin.getCompiled())) as Compiled;
        const supplement = new Set(compiled.supplementPairs!.map(({ node }) => `e${node}`));
        const Reader = await load();
        const reader = new Reader();
        reader.setCompiled(compiled);

        const samples: number[][] = tin.supplementPairs.map(({ forw }) => forw);
        for (const triangle of tin.tins!.forw!.features) {
          const { a, b, c } = triangle.properties!;
          if (![a, b, c].some(({ index }) => supplement.has(String(index)))) continue;
          const [p, q, r] = triangle.geometry!.coordinates[0];
          samples.push([(p[0] + q[0] + r[0]) / 3, (p[1] + q[1] + r[1]) / 3]);
        }
        expect(samples.length).toBeGreaterThan(tin.supplementPairs.length);
        let maxDiff = 0;
        let maxRoundTrip = 0;
        for (const xy of samples) {
          const expected = tin.transform(xy, false) as number[];
          const actual = reader.transform(xy, false) as number[];
          maxDiff = Math.max(maxDiff, Math.hypot(expected[0] - actual[0], expected[1] - actual[1]));
          const back = reader.transform(actual, true) as number[];
          maxRoundTrip = Math.max(maxRoundTrip, Math.hypot(back[0] - xy[0], back[1] - xy[1]));
        }
        expect(maxDiff).toBeLessThanOrEqual(1e-6);
        expect(maxRoundTrip).toBeLessThanOrEqual(1e-6);
      },
      REAL_DATA_TIMEOUT_MS
    );
  }
);

describe("Tin.setCompiled() で読んだ補完点", () => {
  it("getCompiled() が元と一致し、supplementPairs の一覧が復元される", () => {
    const tin = cachedFixture("1932_nobeoka", Tin.MODE_AUTO);
    const compiled = JSON.parse(JSON.stringify(tin.getCompiled())) as Compiled;
    const loaded = new Tin();
    loaded.setCompiled(compiled);
    expect(loaded.supplementPairs).toEqual(tin.supplementPairs);
    expect(JSON.parse(JSON.stringify(loaded.getCompiled()))).toEqual(compiled);
  });
});

// loose 指定には補完点を足さない（MaplatTin#95）。出力は #91 と 1 ビットも変わらない
describe.each(["1932_nobeoka", "tatebayashi_castle_akimoto", "naramachi_yasui_bunko", "miesan_ginza_map", "uno_bus_gtfs_error"])(
  "loose 指定: %s",
  (name) => {
    it(
      "補完点が 0 で、getCompiled() が #91 と一致する",
      () => {
        const tin = buildFixture(name, Tin.MODE_LOOSE);
        expect(tin.strict_status).toBe(Tin.STATUS_LOOSE);
        expect(tin.supplementPairs).toHaveLength(0);
        expect(tin.supplementDiagnostics).toBeUndefined();
        expect(tin.getCompiled().supplementPairs).toBeUndefined();
        expect(digest(tin.getCompiled())).toBe(baseline.v3[`${name}:loose` as keyof typeof baseline.v3]);
      },
      REAL_DATA_TIMEOUT_MS
    );
  }
);

// 設計書 §10: サブマップ（bounds あり）。V3 は bounds を対応点の内外の検査にしか使わないので、
// bounds の外へ出る補完点があっても害は無いはず。
describe("サブマップ（bounds あり）", () => {
  it("延岡のサブマップ（1932_nobeoka_sub0）は strict に戻せず、補完の手順に入らない（#91 と同じ）", () => {
    const compiled = loadMapFixture("1932_nobeoka").sub_maps![0].compiled!;
    const options: Options = {
      bounds: compiled.bounds as [number, number][],
      strictMode: Tin.MODE_AUTO,
      vertexMode: compiled.vertexMode,
      points: compiled.points,
      edges: compiled.edges
    };
    const tin = new Tin(options);
    tin.updateTin();
    expect(tin.strict_status).toBe(Tin.STATUS_LOOSE);
    expect(tin.supplementPairs).toHaveLength(0);
    const without = new Tin({ ...options, supplementPairs: false });
    without.updateTin();
    expect(JSON.stringify(tin.getCompiled())).toBe(JSON.stringify(without.getCompiled()));
  });

  it(
    "bounds を対応点の凸包にぴったり合わせると、補完点は bounds の外へ出るが、strict を保って組め、読み直せる",
    () => {
      const points = fixtureOptions("1932_nobeoka", Tin.MODE_AUTO).points!;
      const hull = convex(featureCollection(points.map(([forw]) => point(forw))))!.geometry.coordinates[0];
      const options: Options = { bounds: hull, strictMode: Tin.MODE_AUTO, points };
      const tin = new Tin(options);
      tin.updateTin();
      expect(tin.strict_status).toBe(Tin.STATUS_STRICT);
      expect(orientationFlips(tin)).toBe(0);
      expect(tin.supplementPairs.length).toBeGreaterThan(0);
      const polygonOfBounds = polygon([hull]);
      expect(tin.supplementPairs.some(({ forw }) => !booleanPointInPolygon(forw, polygonOfBounds))).toBe(true);
      const wire = JSON.parse(JSON.stringify(tin.getCompiled())) as Compiled;
      const reader = new Tin();
      reader.setCompiled(wire);
      expect(reader.supplementPairs).toEqual(tin.supplementPairs);
    },
    REAL_DATA_TIMEOUT_MS
  );
});

// 受け入れ条件 14: 時間
describe("時間", () => {
  const best = (run: () => void, times = 3) => {
    let fastest = Infinity;
    for (let i = 0; i < times; i++) {
      const start = performance.now();
      run();
      fastest = Math.min(fastest, performance.now() - start);
    }
    return fastest;
  };

  it.each(SIX_MAPS.map(([name]) => name))(
    "%s: 補完点を足しても、updateTin() の時間が補完点なしの 3.5 倍以下",
    (name) => {
      const withPairs = new Tin(fixtureOptions(name, Tin.MODE_AUTO));
      const without = new Tin({ ...fixtureOptions(name, Tin.MODE_AUTO), supplementPairs: false });
      const tWithout = best(() => without.updateTin());
      const tWith = best(() => withPairs.updateTin());
      expect(tWith / tWithout).toBeLessThanOrEqual(3.5);
    },
    REAL_DATA_TIMEOUT_MS * 3
  );

});

describe("上限の定数", () => {
  it("回数 4・点数 32", () => {
    expect(MAX_SUPPLEMENT_PAIR_ROUNDS).toBe(4);
    expect(MAX_SUPPLEMENT_PAIRS).toBe(32);
  });
});
