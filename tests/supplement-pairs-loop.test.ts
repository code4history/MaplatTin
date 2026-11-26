import { describe, expect, it } from "vitest";
import type { Edge } from "@maplat/transform";
import type { Position } from "geojson";
import {
  addSupplementPairs,
  SUPPLEMENT_BUDGET_FACTOR,
  SUPPLEMENT_MEASURE_COST,
  fitToKernel,
  MAX_SUPPLEMENT_PAIR_ROUNDS,
  MAX_SUPPLEMENT_PAIRS,
  proposeSupplementCandidate,
  supplementsTakeEffect,
  type MeshAnalysis,
  type SupplementHost
} from "../src/supplement-pairs.ts";

// 補完点の試行の繰り返し（設計書 §2.4）を、三角網を組まない偽の host で確かめる。
// 実データでは通りにくい経路（回数・点数の上限、同じ辺を 2 度試さない、不採用で戻す）を決定的に通す。

/** 円周上の n 角形（紙・地理とも同じ位置）。凸包の辺は全部、三角網の辺ではない（外れた辺）。 */
function polygonAnalysis(n: number, radius = 100, offset = 0): MeshAnalysis {
  const points = Array.from({ length: n }, (_, i) => {
    const angle = (2 * Math.PI * i) / n + offset;
    const position: Position = [radius * Math.cos(angle), radius * Math.sin(angle)];
    return { id: i, paper: position, geo: position };
  });
  const hullEdges: Edge[] = points.map((_, i) => [i, (i + 1) % n]);
  return { points, triangles: [], majority: 1, hullEdges, dropped: hullEdges };
}

interface Trace {
  measures: Position[][][];
  builds: Position[][][];
  /** build に渡された手間の上限（試行の数） */
  limits: number[];
  restores: number;
}

/** 呼ばれた引数を記録する host。`next` が採否と、採用後の三角網（外れた辺）を決める。 */
function fakeHost(
  next: (pairs: Position[][], builds: number) => MeshAnalysis | undefined,
  trace: Trace,
  { baseCost = 1000, attemptsPerBuild = 1 } = {}
) {
  const state = { pairs: [] as Position[][] };
  const host: SupplementHost<number, Position[][]> = {
    edgeBase: 100,
    baseCost,
    buildCost: () => trace.builds.length * attemptsPerBuild,
    snapshot: () => state.pairs,
    restore: (pairs) => {
      trace.restores++;
      state.pairs = pairs;
    },
    measure: (pairs) => {
      trace.measures.push(pairs);
      return { points: [], triangles: [], majority: 1, hullEdges: [], dropped: [] };
    },
    build: (pairs, maxAttempts) => {
      trace.builds.push(pairs);
      trace.limits.push(maxAttempts);
      const analysis = next(pairs, trace.builds.length);
      if (!analysis) return undefined;
      state.pairs = pairs;
      return { result: pairs.length, analysis };
    }
  };
  return host;
}
const newTrace = (): Trace => ({ measures: [], builds: [], limits: [], restores: 0 });
const resolved = (): MeshAnalysis => ({ points: [], triangles: [], majority: 1, hullEdges: [], dropped: [] });

describe("addSupplementPairs: 試行の繰り返し", () => {
  it("外れた辺ごとに 1 点をまとめて足し、採用されたら記録する（1 回で終わる）", () => {
    const trace = newTrace();
    const initial = polygonAnalysis(5);
    const outcome = addSupplementPairs(fakeHost(() => resolved(), trace), { result: 0, analysis: initial });
    expect(outcome.pairs).toHaveLength(5);
    expect(outcome.records.map(({ node }) => node)).toEqual([100, 101, 102, 103, 104]);
    expect(outcome.records.every(({ kind }) => kind === "hullEdge")).toBe(true);
    expect(outcome.records.map(({ edge }) => edge)).toEqual([[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]]);
    expect(outcome.diagnostics).toMatchObject({ rounds: 1, batches: 1, perEdge: 0, multiPoint: 0 });
    expect(trace.builds).toHaveLength(1);
  });

  it(`補完点の合計は ${MAX_SUPPLEMENT_PAIRS} 点まで（超える候補は試さない）`, () => {
    const trace = newTrace();
    const outcome = addSupplementPairs(fakeHost(() => resolved(), trace), {
      result: 0,
      analysis: polygonAnalysis(40)
    });
    expect(outcome.pairs).toHaveLength(MAX_SUPPLEMENT_PAIRS);
    expect(trace.builds.every((pairs) => pairs.length <= MAX_SUPPLEMENT_PAIRS)).toBe(true);
    expect(trace.measures.every((pairs) => pairs.length <= MAX_SUPPLEMENT_PAIRS)).toBe(true);
  });

  it(`採用後も外れた辺が残る限り繰り返すが、回は最大 ${MAX_SUPPLEMENT_PAIR_ROUNDS}`, () => {
    const trace = newTrace();
    // 採用のたびに、別の位置の外れた辺が 1 本ずつ出てくる（終わらない入力）
    const outcome = addSupplementPairs(
      fakeHost((_, builds) => polygonAnalysis(3, 100 + builds * 10, builds), trace),
      { result: 0, analysis: polygonAnalysis(3) }
    );
    expect(outcome.diagnostics.rounds).toBe(MAX_SUPPLEMENT_PAIR_ROUNDS);
    expect(outcome.diagnostics.batches).toBe(MAX_SUPPLEMENT_PAIR_ROUNDS);
    expect(outcome.pairs).toHaveLength(3 * MAX_SUPPLEMENT_PAIR_ROUNDS);
  });

  it("同じ辺（両端の紙の座標）は一度しか試さない", () => {
    const trace = newTrace();
    // 採用しても、同じ辺が外れたままの結果を返す
    const initial = polygonAnalysis(4);
    const outcome = addSupplementPairs(fakeHost(() => polygonAnalysis(4), trace), { result: 0, analysis: initial });
    expect(outcome.diagnostics.rounds).toBe(1);
    expect(outcome.pairs).toHaveLength(4);
    expect(trace.builds).toHaveLength(1);
  });

  it("まとめて試して不採用なら、辺ごとに試し、採用できた辺だけ足す。何も採用できなければ、足す前へ戻す", () => {
    const trace = newTrace();
    // まとめて（4 点）は不採用、辺ごと（1 点）は 2 本目だけ採用
    let single = 0;
    const host = fakeHost((pairs) => {
      if (pairs.length > 1) return undefined;
      single++;
      return single === 2 ? resolved() : undefined;
    }, trace);
    const outcome = addSupplementPairs(host, { result: 0, analysis: polygonAnalysis(4) });
    expect(outcome.pairs).toHaveLength(1);
    expect(outcome.records.map(({ edge }) => edge)).toEqual([[1, 2]]);
    expect(outcome.records[0].node).toBe(100);
    expect(outcome.diagnostics).toMatchObject({ batches: 0, perEdge: 1, multiPoint: 0 });
    expect(trace.restores).toBeGreaterThanOrEqual(5); // 不採用 4 回（まとめて 1・辺ごと 3）＋最後の戻し

    const none = newTrace();
    const outcome2 = addSupplementPairs(
      fakeHost(() => undefined, none),
      { result: 7, analysis: polygonAnalysis(4) }
    );
    expect(outcome2.pairs).toHaveLength(0);
    expect(outcome2.records).toHaveLength(0);
    expect(outcome2.result).toBe(7);
  });

  it("1 点の案が不採用で、複数点の案があれば、複数点の案を試して採用する", () => {
    // 弦 A–B の途中の 2 か所が地理の面で外へ出る（上側の凸包の頂点が 2 つ）
    const points = [
      { id: 0, paper: [0, 0], geo: [0, 0] },
      { id: 1, paper: [100, 0], geo: [100, 0] },
      { id: 2, paper: [50, 100], geo: [50, 100] },
      { id: 3, paper: [20, 10], geo: [20, -4] },
      { id: 4, paper: [80, 10], geo: [80, -4] }
    ];
    const hullEdges: Edge[] = [[0, 1], [1, 2], [2, 0]];
    const analysis: MeshAnalysis = { points, triangles: [], majority: 1, hullEdges, dropped: [[0, 1]] };
    const candidate = proposeSupplementCandidate(analysis, [0, 1]);
    expect(candidate!.variants.map((variant) => variant.length)).toEqual([1, 2]);
    expect(candidate!.variants[1].map(({ anchor }) => anchor)).toEqual([3, 4]);

    const trace = newTrace();
    const outcome = addSupplementPairs(
      fakeHost((pairs) => (pairs.length === 2 ? resolved() : undefined), trace),
      { result: 0, analysis }
    );
    expect(outcome.pairs).toHaveLength(2);
    expect(outcome.records.map(({ edge, anchor }) => [edge, anchor])).toEqual([[[0, 1], 3], [[0, 1], 4]]);
    expect(outcome.diagnostics).toMatchObject({ batches: 0, perEdge: 1, multiPoint: 1 });
  });
});

describe("proposeSupplementCandidate", () => {
  const square = (dent: Position): MeshAnalysis => ({
    points: [
      { id: 0, paper: [0, 0], geo: [0, 0] },
      { id: 1, paper: [100, 0], geo: [100, 0] },
      { id: 2, paper: [100, 100], geo: [100, 100] },
      { id: 3, paper: [0, 100], geo: [0, 100] },
      { id: 4, paper: [40, 20], geo: dent }
    ],
    triangles: [],
    majority: 1,
    hullEdges: [[0, 1], [1, 2], [2, 3], [3, 0]],
    dropped: [[0, 1]]
  });

  it("いちばん凹んだ点の真上の弦の外（弦の長さ × 1e-4）に紙の位置を置き、地理の位置は外へ出た側に取る", () => {
    const candidate = proposeSupplementCandidate(square([40, -5]), [0, 1])!;
    const [ray] = candidate.variants[0];
    expect(ray.anchor).toBe(4);
    expect(ray.paper[0]).toBeCloseTo(40 * 1, 6); // 地理の弦への足（u = 0.4）の、紙の弦の上の比
    expect(ray.paper[1]).toBeCloseTo(-0.01, 9); // 紙の面で凸包の外（y < 0）へ 100 × 1e-4
    expect(ray.height).toBeCloseTo(5 * 1.25, 9);
    expect(ray.foot).toEqual([40, 0]);
    expect(ray.normal[1]).toBe(-1);
  });

  it("弦の範囲に外へ出る点が無いとき（S が空）は、弦の中点に置く（出っ張り 0・anchor 無し）", () => {
    const candidate = proposeSupplementCandidate(square([40, 5]), [0, 1])!;
    const [ray] = candidate.variants[0];
    expect(ray.anchor).toBeUndefined();
    expect(ray.paper[0]).toBeCloseTo(50, 9);
    expect(ray.protrusion).toBe(0);
    expect(ray.height).toBe(0);
  });
});

describe("fitToKernel", () => {
  it("核が空（下限が上限以上）なら undefined。向きの条件を入れ替えて核が空でなくなれば、高さが決まる", () => {
    // Q = e0 の地理の位置は、半直線 (0, s) の上。三角形 1 は、s = 0 の線を越える向きを、三角形 2 は、
    // s = -1 の線を越える向きを要求する。紙の面の向きで、下限になるか上限になるかが決まる
    const analysisOf = (flip: boolean): MeshAnalysis => {
      const forward = [[0, 0], [1, 0], [0, 1]];
      const backward = [[0, 0], [0, 1], [1, 0]];
      const triangles = [
        { ids: ["e0", "p", "q"], paper: flip ? backward : forward, geo: [[0, 0], [0, 0], [1, 0]], sign: 1 },
        { ids: ["e0", "q", "r"], paper: flip ? forward : backward, geo: [[0, 0], [0, -1], [1, -1]], sign: 1 }
      ] as MeshAnalysis["triangles"];
      return { points: [], triangles, majority: 1, hullEdges: [], dropped: [] };
    };
    const ray = { paper: [0, 0], foot: [0, 0], normal: [0, 1], height: 0, chord: 1, protrusion: 0.1 };
    const results = [false, true].map((flip) => fitToKernel([ray], 0, () => analysisOf(flip)));
    expect(results.filter((fitted) => fitted === undefined)).toHaveLength(1);
    const fitted = results.find((r) => r !== undefined)!;
    expect(fitted.kept).toEqual([0]);
    expect(Number.isFinite(fitted.rays[0].height)).toBe(true);
    expect(fitToKernel([ray], 0, () => undefined)).toBeUndefined();
  });

  it("三角形が無ければ、出っ張りの 0.25 倍（弦の 0.01 倍が下限）の高さに決まり、2 回目で止まる", () => {
    let calls = 0;
    const ray = { paper: [0, 0], foot: [0, 0], normal: [0, 1], height: 0, chord: 100, protrusion: 8 };
    const fitted = fitToKernel([ray], 0, () => {
      calls++;
      return { points: [], triangles: [], majority: 1, hullEdges: [], dropped: [] };
    })!;
    expect(fitted.rays[0].height).toBeCloseTo(2, 12);
    expect(fitted.kept).toEqual([0]);
    expect(calls).toBe(2);
  });

  it("核が空の点だけを外して、残りで続ける（測り直す）", () => {
    // e0 は核が空（上の「核が空」と同じ三角形）、e1 は三角形が無くて制約なし
    const empty = (flip: boolean) => {
      const forward = [[0, 0], [1, 0], [0, 1]];
      const backward = [[0, 0], [0, 1], [1, 0]];
      return [
        { ids: ["e0", "p", "q"], paper: flip ? backward : forward, geo: [[0, 0], [0, 0], [1, 0]], sign: 1 },
        { ids: ["e0", "q", "r"], paper: flip ? forward : backward, geo: [[0, 0], [0, -1], [1, -1]], sign: 1 }
      ] as MeshAnalysis["triangles"];
    };
    const ray = (x: number) => ({ paper: [x, 0], foot: [0, 0], normal: [0, 1], height: 0, chord: 1, protrusion: 0.1 });
    for (const flip of [false, true]) {
      const seen: number[] = [];
      const fitted = fitToKernel([ray(0), ray(1)], 0, (pairs) => {
        seen.push(pairs.length);
        // 2 点のうちに e0 の三角形があるときだけ、e0 の核が決まる（空か空でないかは flip で決まる）
        return { points: [], triangles: pairs.length === 2 ? empty(flip) : [], majority: 1, hullEdges: [], dropped: [] };
      });
      if (seen.includes(1)) {
        // e0 の核が空だったので外し、1 点で測り直した
        expect(fitted!.kept).toEqual([1]);
        expect(seen[0]).toBe(2);
        return;
      }
    }
    throw new Error("核が空になる向きが見つからなかった");
  });
});

describe("supplementsTakeEffect", () => {
  it("足した点が凸包の頂点で、付く凸包の辺が両方とも三角網の辺のときだけ true", () => {
    const base = {
      points: [
        { id: 0, paper: [0, 0], geo: [0, 0] },
        { id: "e5", paper: [5, -1], geo: [5, -1] },
        { id: 1, paper: [10, 0], geo: [10, 0] }
      ],
      majority: 1 as const,
      hullEdges: [[0, 1], [1, 2]] as Edge[],
      dropped: [] as Edge[]
    };
    const tri = (ids: string[]) => ({ ids, paper: [], geo: [], sign: 1 });
    expect(supplementsTakeEffect({ ...base, triangles: [tri(["0", "e5", "1"])] }, 5)).toBe(true);
    // A–Q が三角網の辺でない
    expect(supplementsTakeEffect({ ...base, triangles: [tri(["0", "1", "x"]), tri(["e5", "1", "x"])] }, 5)).toBe(false);
    // 足した点が凸包の頂点になっていない
    expect(supplementsTakeEffect({ ...base, hullEdges: [], triangles: [tri(["0", "e5", "1"])] }, 5)).toBe(false);
    // 前の回に採用した点（番号が first 未満）は見ない
    expect(supplementsTakeEffect({ ...base, hullEdges: [], triangles: [] }, 6)).toBe(true);
  });
});

describe("手間の上限（時間の保証）", () => {
  it("まとめて試して不採用になると、手間が上限に届き、辺ごとの組み直しへ進まない（上限は最初の組み立て × 係数）", () => {
    const trace = newTrace();
    const outcome = addSupplementPairs(
      fakeHost(() => undefined, trace, { baseCost: 1 }),
      { result: 7, analysis: polygonAnalysis(6) }
    );
    expect(outcome.pairs).toHaveLength(0);
    expect(outcome.result).toBe(7);
    expect(outcome.diagnostics.budget).toBe(SUPPLEMENT_BUDGET_FACTOR * 1);
    // 測る 2 回（0.4 ずつ）と、組み直し 1 回（上限 1 回の試行）で、上限に達する
    expect(trace.measures).toHaveLength(2);
    expect(trace.builds).toHaveLength(1);
    expect(trace.limits[0]).toBe(1);
    expect(outcome.diagnostics.cost).toBeLessThanOrEqual(outcome.diagnostics.budget + 1);
    expect(2 * SUPPLEMENT_MEASURE_COST + 1).toBeGreaterThan(outcome.diagnostics.budget);
  });

  it("組み直しの試行の数に上限（残りの手間）が渡る。最初の組み立てが重いほど大きい", () => {
    const trace = newTrace();
    addSupplementPairs(fakeHost(() => undefined, trace, { baseCost: 10 }), {
      result: 0,
      analysis: polygonAnalysis(6)
    });
    expect(trace.limits[0]).toBe(Math.ceil(10 * SUPPLEMENT_BUDGET_FACTOR - 2 * SUPPLEMENT_MEASURE_COST));
  });

  it("上限に達しても、足した分だけは残り、状態を戻す", () => {
    const trace = newTrace();
    // 1 回目は採用（外れた辺が残る）、そのあとは手間が尽きる
    const outcome = addSupplementPairs(
      fakeHost((_, builds) => (builds === 1 ? polygonAnalysis(3, 150, 1) : undefined), trace, {
        baseCost: 2,
        attemptsPerBuild: 1
      }),
      { result: 0, analysis: polygonAnalysis(3) }
    );
    expect(outcome.pairs).toHaveLength(3);
    expect(outcome.diagnostics.batches).toBe(1);
    expect(trace.restores).toBeGreaterThanOrEqual(1);
  });
});
