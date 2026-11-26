import { describe, expect, it } from "vitest";
import { Transform } from "@maplat/transform";
import type { Feature, Point, Position } from "geojson";
import { Tin, type Options } from "../src/index.ts";
import { countBoundaryFlips } from "../src/boundary-search.ts";

// 凸包の辺を外して組み直すときの、採用する三角網・補助頂点・診断の整合を、乱数の配置で確かめる。
// 配置は seed から決まる（再現できる）。余白の探索で却下した候補や、原因の辺を足した後に失敗した
// 試行の状態が、採用した結果に残らないこと。

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const worldFile = { xScale: 1, xSkew: 0, xOrigin: 0.5, yScale: -1, ySkew: 0, yOrigin: -0.5 };

function scatter(seed: number, outer: boolean): NonNullable<Options["points"]> {
  const r = rng(seed * 7919 + (outer ? 13 : 0));
  const n = 6 + Math.floor(r() * 30);
  const noise = [2, 10, 30, 60, 120][seed % 5];
  return Array.from({ length: n }, () => {
    const x = 50 + r() * 900;
    const y = 50 + r() * 900;
    return [
      [x, y],
      [x + (r() - 0.5) * noise, -y + (r() - 0.5) * noise]
    ] as [number[], number[]];
  });
}

function build(seed: number, outer: boolean, strictMode: "strict" | "auto"): Tin {
  const tin = new Tin({
    wh: [1000, 1000],
    points: scatter(seed, outer),
    strictMode,
    ...(outer ? { outerTransform: "worldFile" as const, worldFile } : {})
  });
  tin.updateTin();
  return tin;
}

/** 採用した三角網の補助頂点（地図面）。 */
function auxiliaryVertices(tin: Tin): Position[] {
  return tin
    .pointsSet!.forw.features.filter((f: Feature<Point>) =>
      String(f.properties!.target.index).startsWith("b")
    )
    .map((f: Feature<Point>) => f.geometry.coordinates);
}

/** 整合を確かめ、食い違いの説明を返す（整合していれば空）。 */
function inconsistencies(tin: Tin, outer: boolean): string[] {
  const problems: string[] = [];
  const compiled = tin.getCompiled();
  const aux = auxiliaryVertices(tin);
  const vertices = compiled.vertices_points.map(([forw]) => forw);
  // 1. compiled の補助頂点と、採用した三角網の補助頂点が同じ
  const same =
    aux.length === vertices.length &&
    aux.every((a, i) => a[0] === vertices[i][0] && a[1] === vertices[i][1]);
  if (!same) problems.push("補助頂点が三角網と compiled で違う");
  // 2. 診断の余白が、採用した補助頂点の外接矩形から求めた余白と同じ
  const xs = tin.points.map(([forw]) => forw[0]);
  const ys = tin.points.map(([forw]) => forw[1]);
  const width = Math.max(...xs) - Math.min(...xs);
  const height = Math.max(...ys) - Math.min(...ys);
  const margins = [
    (Math.min(...xs) - Math.min(...aux.map(([x]) => x))) / width,
    (Math.max(...aux.map(([x]) => x)) - Math.max(...xs)) / width,
    (Math.min(...ys) - Math.min(...aux.map(([, y]) => y))) / height,
    (Math.max(...aux.map(([, y]) => y)) - Math.max(...ys)) / height
  ];
  const margin = tin.boundaryDiagnostics!.margin;
  if (!margins.every((m) => Math.abs(m - margin) < 1e-9)) {
    problems.push(`診断の余白 ${margin} と補助頂点の余白 ${margins.map((m) => m.toFixed(4))} が違う`);
  }
  // 3. world file 外周を採用したと報告するなら、採用した三角網に反転が無い
  if (outer && tin.boundaryDiagnostics!.outerTransform === "worldFile") {
    const flips =
      countBoundaryFlips(tin.tins!.forw!, -1) + (tin.tins!.bakw ? countBoundaryFlips(tin.tins!.bakw, -1) : 0);
    if (flips !== 0) problems.push(`worldFile と報告したが、採用した三角網に反転が ${flips} 件ある`);
  }
  return problems;
}

// レビューで見つかった seed（world file 外周の組み直しの失敗・strict の取りこぼし）と、範囲の seed
const KNOWN_SEEDS = [327, 359, 383, 224];
const RANGE = Array.from({ length: 150 }, (_, i) => i + 1);
const SEEDS = [...new Set([...KNOWN_SEEDS, ...RANGE])];

describe.each([
  { outer: true, label: "world file 外周" },
  { outer: false, label: "扇形" }
])("$label", ({ outer }) => {
  it.each(["strict", "auto"] as const)(
    "strictMode=%s: 採用した三角網・補助頂点・診断が同じ試行から来る",
    (mode) => {
      const bad: string[] = [];
      for (const seed of SEEDS) {
        const tin = build(seed, outer, mode);
        for (const problem of inconsistencies(tin, outer)) bad.push(`seed ${seed}: ${problem}`);
      }
      expect(bad).toEqual([]);
    },
    120000
  );

  it.each([327, 359, 383])("seed %i は、compiled を読み直した Transform で GCP と補助頂点が往復する", (seed) => {
    for (const mode of ["strict", "auto"] as const) {
      const tin = build(seed, outer, mode);
      const compiled = JSON.parse(JSON.stringify(tin.getCompiled()));
      const reader = new Transform();
      reader.setCompiled(compiled);
      for (const [forw, bakw] of tin.points) {
        const mapped = reader.transform(forw as number[], false) as number[];
        expect(Math.hypot(mapped[0] - bakw[0], mapped[1] - bakw[1])).toBeLessThan(1e-6);
      }
    }
  });
});

// ─── 採用する三角網は、必ずいずれかの試行のもの ──────────────────────────────
// buildWithHull の試行を記録し、扇形の経路で、採用した三角網が試行のものそのものであること、
// strict にならなかったときは、凸包の辺を全部制約にした最初の試行のものであることを確かめる
// （外す辺を足した後の、失敗した試行の三角網を残さない）。
describe("扇形: 採用する三角網の出どころ", () => {
  it.each(["strict", "auto"] as const)("strictMode=%s", (mode) => {
    const bad: string[] = [];
    let recovered = 0;
    let fellBack = 0;
    for (const seed of SEEDS) {
      const tin = new Tin({ wh: [1000, 1000], points: scatter(seed, false), strictMode: mode });
      const runs: { excluded: number; tins: Tin["tins"] }[] = [];
      const internals = tin as unknown as {
        buildWithHull: (strict: unknown, attempt: (excluded: ReadonlySet<string>) => unknown) => unknown;
      };
      const original = internals.buildWithHull.bind(tin);
      internals.buildWithHull = (strict, attempt) =>
        original(strict, (excluded) => {
          const value = attempt(excluded);
          runs.push({ excluded: excluded.size, tins: tin.tins });
          return value;
        });
      tin.updateTin();
      if (!runs.some((run) => run.tins === tin.tins)) bad.push(`seed ${seed}: 採用した三角網がどの試行のものでもない`);
      if (tin.strict_status === Tin.STATUS_STRICT) {
        if (runs.length > 1) recovered++;
      } else {
        if (runs[0].tins !== tin.tins) bad.push(`seed ${seed}: strict でないのに、最初の試行の三角網ではない`);
        if (runs.length > 1) fellBack++;
      }
    }
    expect(bad).toEqual([]);
    // 試験が意味を持つ: 組み直して strict に戻る seed も、戻らず最初の三角網に戻す seed もある
    expect(recovered).toBeGreaterThan(0);
    expect(fellBack).toBeGreaterThan(0);
  }, 120000);
});
