import { describe, expect, it } from "vitest";
import {
  calculateBirdeyeVertices,
  calculatePlainVertices,
  type BoundaryVerticesParams
} from "../src/boundary-vertices.ts";
import { Tin, type Options } from "../src/index.ts";
import { buildTin, evaluate, lccToPx1, truthOfP1, truthOfP3 } from "./fan-extrapolation-eval.ts";
import { G1C, G3, type Pair } from "./fan-extrapolation-gcps.ts";

// 扇形外挿の縮尺と回転を、凸包の点の最小値ではなく、重心から遠い凸包の点の最小二乗で決める（V3 の plain）。
//
// 素材は Core のデモ（layered-map）の GCP。紙の CRS の線形の画素（P1）に誤差 3 画素の GCP を 24 組打った
// もの（G1C）と、中心を大きく描いた図（P3）に 34 組打ったもの（G3）。真の変換が分かるので、GCP の凸包の外でも
// 正解との差を測れる（tests/fan-extrapolation-eval.ts）。
//
// BASE_* は、この変更の前（844d8b6）の同じ素材の測定値（lcc の平面距離・km）。

/** 変更前: P3・G3 の外側の二乗平均 */
const BASE_P3_OUTER_RMS_KM = 36.542;

// 誤差の無い GCP: G1C と同じ地点で、紙の画素を真の画素にしたもの
const identity = G1C.map(([, lcc]) => [lccToPx1(lcc), lcc] as Pair);

describe("凸包の外の縮尺と回転（Core のデモの素材）", () => {
  const p1 = buildTin(G1C);
  const p1Eval = evaluate(p1, G1C, truthOfP1());
  const p3 = buildTin(G3);
  const p3Eval = evaluate(p3, G3, truthOfP3(G3));

  // 変更前の外側の最大は 109.502 km（Core のデモの球面距離では 106 km）
  it("P1・24 組・誤差 3 画素: 外側の最大が 25 km 以下", () => {
    expect(p1Eval.outer.max).toBeLessThanOrEqual(25);
  });

  it("P3（中心を大きく描いた図）: 外側の二乗平均が変更前の 1.2 倍以下", () => {
    expect(p3Eval.outer.rms).toBeLessThanOrEqual(BASE_P3_OUTER_RMS_KM * 1.2);
  });

  it("誤差の無い GCP: 外側の結果が正解と一致する（変更前と変わらない）", () => {
    const tin = buildTin(identity);
    const e = evaluate(tin, identity, truthOfP1());
    expect(e.outer.max).toBeLessThan(0.3);
    expect(e.inner.max).toBeLessThan(0.3);
  });

  it("境界の探索で、補助頂点の三角形の反転が増えず、strict のまま", () => {
    for (const tin of [p1, p3]) {
      expect(tin.boundaryDiagnostics?.boundaryTriangleFlips).toBe(0);
      expect(tin.getCompiled().strict_status).toBe(Tin.STATUS_STRICT);
    }
  });

  it("GCP の内側の結果は、外側の推定の変更で悪化しない", () => {
    // 変更前は P1 で最大 10.2 km・P3 で 175.4 km（三角網そのものの誤差が主）
    expect(p1Eval.inner.max).toBeLessThanOrEqual(10.2 + 0.5);
    expect(p3Eval.inner.max).toBeLessThanOrEqual(175.4 + 0.5);
  });
});

// ── 推定そのものの試験（boundary-vertices の公開口で、角の補助頂点の位置から縮尺と回転を読む）─────────

/** F = z·B（実部が y、虚部が x の複素数）。縮尺は forw/bakw の比なので |z|、回転は arg z。 */
const Z0 = { re: 2 * Math.cos((30 * Math.PI) / 180), im: 2 * Math.sin((30 * Math.PI) / 180) };

interface HullPoint {
  radius: number;
  angleDeg: number;
  /** bakw の距離にかける誤差（既定 1 = z0 に厳密に従う） */
  dBakw?: number;
  /** 地理側を裏返す（x を反転）。相似では説明できなくなる。 */
  mirror?: boolean;
}

function complexParams(hull: HullPoint[]): BoundaryVerticesParams {
  const convexBuf: BoundaryVerticesParams["convexBuf"] = {};
  const allGcps: BoundaryVerticesParams["allGcps"] = [];
  hull.forEach(({ radius, angleDeg, dBakw = 1, mirror = false }, i) => {
    const phi = (angleDeg * Math.PI) / 180;
    const F = { re: radius * Math.cos(phi), im: radius * Math.sin(phi) }; // re=Δy, im=Δx
    // B = F / z0（その後、bakw の距離だけ dBakw 倍にして誤差を入れる）
    const d = Z0.re ** 2 + Z0.im ** 2;
    const B = {
      re: ((F.re * Z0.re + F.im * Z0.im) / d) * dBakw,
      im: ((F.im * Z0.re - F.re * Z0.im) / d) * dBakw * (mirror ? -1 : 1)
    };
    const forw = [F.im, F.re];
    const bakw = [B.im, -B.re]; // collectSamples は bakw の y を反転して差を取る
    convexBuf[`${i}`] = { forw, bakw };
    allGcps.push({ forw, bakw });
  });
  return {
    convexBuf,
    centroid: { forw: [0, 0], bakw: [0, 0] },
    allGcps,
    minx: -120,
    maxx: 120,
    miny: -120,
    maxy: 120
  };
}

/** 重心を固定した相似 z0 で、forw の点を bakw へ写した位置（collectSamples と同じ向き） */
function bakwOf(forw: number[]): number[] {
  const F = { re: forw[1], im: forw[0] };
  const d = Z0.re ** 2 + Z0.im ** 2;
  const B = { re: (F.re * Z0.re + F.im * Z0.im) / d, im: (F.im * Z0.re - F.re * Z0.im) / d };
  return [B.im, -B.re];
}

const isBboxCorner = ({ forw: [x, y] }: { forw: number[] }) => Math.abs(x) === 120 && Math.abs(y) === 120;
const cornersOf = (vertices: ReturnType<typeof calculatePlainVertices>) => vertices.filter(isBboxCorner);

/** 四隅の bakw が、z0 に従う位置（に scale 倍）にあること */
function expectCornersFollowZ0(
  vertices: ReturnType<typeof calculatePlainVertices>,
  factor = 1
): void {
  const corners = cornersOf(vertices);
  expect(corners).toHaveLength(4);
  for (const { forw, bakw } of corners) {
    const expected = bakwOf(forw);
    expect(bakw[0]).toBeCloseTo(expected[0] * factor, 6);
    expect(bakw[1]).toBeCloseTo(expected[1] * factor, 6);
  }
}

/** 従来の推定（V2 の経路）と同じ四隅であること */
function expectCornersSameAsV2(params: BoundaryVerticesParams): void {
  const v3 = cornersOf(calculatePlainVertices(params, true));
  const v2 = calculatePlainVertices(params, false);
  expect(v2).toHaveLength(4);
  expect(v3).toHaveLength(4);
  for (const corner of v3) {
    const same = v2.find(({ forw }) => forw[0] === corner.forw[0] && forw[1] === corner.forw[1])!;
    expect(corner.bakw[0]).toBeCloseTo(same.bakw[0], 9);
    expect(corner.bakw[1]).toBeCloseTo(same.bakw[1], 9);
    expect(Number.isFinite(corner.bakw[0]) && Number.isFinite(corner.bakw[1])).toBe(true);
  }
}

// 遠い 8 点は z0 に厳密に従い、近い 4 点（最遠の 0.6 倍未満）は bakw の距離を 10 % 伸ばして誤差を入れる
// （forw/bakw の比が小さく出るので、最小値はこの点を拾う）。
const NEAR_BAD = Array.from({ length: 4 }, (_, k) => ({ radius: 30, angleDeg: 22.5 + 90 * k, dBakw: 1.1 }));
const FAR_EXACT = Array.from({ length: 8 }, (_, k) => ({ radius: 100, angleDeg: 45 * k }));

describe("遠い凸包の点の最小二乗（V3 の plain だけ）", () => {
  const params = complexParams([...FAR_EXACT, ...NEAR_BAD]);

  it("V3 の plain: 近い点の誤差に引かれず、遠い点が従う相似で四隅を置く", () => {
    expectCornersFollowZ0(calculatePlainVertices(params, true));
  });

  it("V2（v3 = false）は変わらず、近い点の比の最小値で縮尺を決める", () => {
    // 最小値は近い点の比 2/1.1 → 縮尺が 1.1 分小さく、補助頂点は重心から 1.1 倍遠くなる
    const vertices = calculatePlainVertices(params, false);
    expect(vertices).toHaveLength(4);
    expectCornersFollowZ0(vertices, 1.1);
  });

  it("birdeye は変えない（象限ごとに、近い点の比の最小値）", () => {
    for (const v3 of [false, true]) {
      expectCornersFollowZ0(calculateBirdeyeVertices(params, v3), 1.1);
    }
  });
});

describe("遠い点の数と距離の境目", () => {
  // 最遠は 270° の半径 100。0.6 倍の半径 60 の点は、角度 0・90・180° なら成分が厳密で、距離が 60 ちょうどになる。
  const farthest = { radius: 100, angleDeg: 270 };
  const exactly60 = (angleDeg: number): HullPoint => ({ radius: 60, angleDeg });
  const nearBad = (radius: number, angleDeg: number): HullPoint => ({ radius, angleDeg, dBakw: 1.1 });

  it("前提: 半径 60 の点の距離が、最遠の 0.6 倍とちょうど等しい", () => {
    const p = complexParams([farthest, exactly60(0)]).convexBuf;
    const [d100, d60] = Object.values(p).map(({ forw }) => Math.hypot(forw[0], forw[1]));
    expect(d60).toBe(0.6 * d100);
  });

  it("遠い点がちょうど 3 点: その 3 点だけで当てはめる（近い点の誤差を拾わない）", () => {
    const three = complexParams([
      farthest, exactly60(0), exactly60(180),
      nearBad(30, 45), nearBad(30, 135), nearBad(30, 225), nearBad(30, 315)
    ]);
    expectCornersFollowZ0(calculatePlainVertices(three, true));
  });

  it("最遠のちょうど 0.6 倍の点は遠い点に入る（0.6 倍未満は入らない）", () => {
    // 最遠 + 半径 60 の 2 点で 3 点。半径 60 が入らないと 1 点になり、全点（近い点の誤差入り）に戻って結果が変わる
    const included = complexParams([farthest, exactly60(0), exactly60(180), nearBad(30, 45), nearBad(30, 135)]);
    expectCornersFollowZ0(calculatePlainVertices(included, true));
    // 半径 59.999（0.6 倍未満）の誤差入りの点は入らない: 厳密な 3 点はそのまま
    const justBelow = complexParams([farthest, exactly60(0), exactly60(180), nearBad(59.999, 90)]);
    expectCornersFollowZ0(calculatePlainVertices(justBelow, true));
  });

  it("遠い点が 2 点: 凸包の全点の最小二乗に戻る（下限）", () => {
    const two = complexParams([farthest, exactly60(0), nearBad(30, 45), nearBad(30, 135), nearBad(30, 225)]);
    const vertices = calculatePlainVertices(two, true);
    // 全点の最小二乗は、近い点の誤差に引かれて z0 の位置から外れる（遠い点だけの結果とは違う）
    const corner = cornersOf(vertices)[0];
    expect(Math.abs(corner.bakw[0] - bakwOf(corner.forw)[0]) + Math.abs(corner.bakw[1] - bakwOf(corner.forw)[1]))
      .toBeGreaterThan(1e-3);
    // 期待値: z = Σ F conj(B) / Σ |B|²（全点）
    let nr = 0, ni = 0, den = 0;
    for (const { forw, bakw } of Object.values(two.convexBuf)) {
      const F = { re: forw[1], im: forw[0] };
      const B = { re: -bakw[1], im: bakw[0] };
      nr += F.re * B.re + F.im * B.im;
      ni += F.im * B.re - F.re * B.im;
      den += B.re ** 2 + B.im ** 2;
    }
    const scale = Math.hypot(nr, ni) / den;
    const rot = Math.atan2(ni, nr);
    for (const { forw, bakw } of cornersOf(vertices)) {
      const dist = Math.hypot(forw[0], forw[1]) / scale;
      const theta = Math.atan2(forw[0], forw[1]) - rot;
      expect(bakw[0]).toBeCloseTo(dist * Math.sin(theta), 6);
      expect(bakw[1]).toBeCloseTo(-dist * Math.cos(theta), 6);
    }
  });
});

describe("従来の推定（最小値）へ戻る経路", () => {
  it("鏡像: 地理側が紙に対して裏返しで相似に乗らないとき、縮尺が 0 に近づかず従来の推定に戻る", () => {
    // 正八角形の遠い点は、裏返すと Σ F·conj(B) が打ち消し合って |z| ≈ 0 になる（これが際限なく遠くへ飛ぶ原因）
    const mirrored = complexParams(FAR_EXACT.map((p) => ({ ...p, mirror: true })));
    expectCornersSameAsV2(mirrored);
    const maxDistance = Math.max(
      ...calculatePlainVertices(mirrored, true).map(({ bakw }) => Math.hypot(bakw[0], bakw[1]))
    );
    expect(maxDistance).toBeLessThan(1000);
  });

  it("一致度が閾値（0.5）の上と下: 上は最小二乗、下は従来の推定", () => {
    // 遠い 8 点のうち先頭 k 点の地理側を裏返す。一致度（|Σ F·conj(B)| / √(Σ|F|²·Σ|B|²)）は
    // k=2 で 0.92、k=5 で 0.45（正八角形の配置で、別に計算した値）。
    const withMirrored = (k: number) =>
      complexParams(FAR_EXACT.map((p, i) => ({ ...p, mirror: i < k })));
    // 下（0.45）: 従来の推定と同じ四隅
    expectCornersSameAsV2(withMirrored(5));
    // 上（0.92）: 最小二乗を使うので、従来の推定とは別の四隅
    const v2 = calculatePlainVertices(withMirrored(2), false);
    const differs = cornersOf(calculatePlainVertices(withMirrored(2), true)).some(({ forw, bakw }) => {
      const same = v2.find((v) => v.forw[0] === forw[0] && v.forw[1] === forw[1])!;
      return Math.abs(same.bakw[0] - bakw[0]) + Math.abs(same.bakw[1] - bakw[1]) > 1e-3;
    });
    expect(differs).toBe(true);
  });

  it("全点が重心と一致: 当てはめが退化するので従来の推定に戻る（縮尺 1・回転 0）", () => {
    const coincident = complexParams([
      { radius: 0, angleDeg: 0 }, { radius: 0, angleDeg: 90 }, { radius: 0, angleDeg: 180 }
    ]);
    expectCornersSameAsV2(coincident);
    const corner = cornersOf(calculatePlainVertices(coincident, true))[0];
    // 縮尺 1・回転 0: 補助頂点は重心から forw と同じ距離・向きに置かれる（bakw の y は反転）
    expect(corner.bakw[0]).toBeCloseTo(corner.forw[0], 9);
    expect(corner.bakw[1]).toBeCloseTo(-corner.forw[1], 9);
  });

  it("凸包が空: 当てはめが退化するので従来の推定に戻る（NaN にならない）", () => {
    const empty: BoundaryVerticesParams = {
      convexBuf: {},
      centroid: { forw: [0, 0], bakw: [0, 0] },
      allGcps: [{ forw: [0, 0], bakw: [0, 0] }],
      minx: -120,
      maxx: 120,
      miny: -120,
      maxy: 120
    };
    expectCornersSameAsV2(empty);
    for (const { bakw } of calculatePlainVertices(empty, true)) {
      expect(Number.isFinite(bakw[0]) && Number.isFinite(bakw[1])).toBe(true);
    }
  });
});

describe("鏡像に近い GCP の Tin（Fable のレビューの反例）", () => {
  // 紙 100×101 の四隅と中心。bakw を紙と同じ向き（y を反転しない）で渡すので、地理側が紙に対して裏返し。
  // 4 点目の y を 100 + eps にして、ぴったり裏返しの退化（厳密な 0）を避ける。
  const maxVertexDistance = (eps: number): number => {
    const points: Options["points"] = [
      [[0, 0], [0, 0]],
      [[100, 0], [100, 0]],
      [[100, 100], [100, 100]],
      [[0, 100 + eps], [0, 100 + eps]],
      [[50, 50], [50, 50]]
    ];
    const tin = new Tin({ wh: [100, 101], strictMode: "auto", points });
    tin.updateTin();
    return Math.max(...tin.getCompiled().vertices_points.map(([, [x, y]]) => Math.hypot(x, y)));
  };

  // 補助頂点の最大の距離（原点から）は、変更前（844d8b6）で 155.6。最小二乗だけにすると eps=1e-3 で 1.3e7、1e-9 で 1.3e13 まで飛んだ。
  it.each([1e-3, 1e-6, 1e-9])("eps=%s: 補助頂点が際限なく遠くへ飛ばない", (eps) => {
    // 従来の推定に戻るので、変更前と同じ 155.6
    expect(maxVertexDistance(eps)).toBeCloseTo(155.6, 1);
  });
});
