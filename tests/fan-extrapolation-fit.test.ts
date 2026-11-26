import { describe, expect, it } from "vitest";
import {
  calculateBirdeyeVertices,
  calculatePlainVertices,
  type BoundaryVerticesParams
} from "../src/boundary-vertices.ts";
import { Tin } from "../src/index.ts";
import { buildTin, evaluate, lccToPx1, maxOuterDiff, truthOfP1, truthOfP3 } from "./fan-extrapolation-eval.ts";
import { G1C, G3, type Pair } from "./fan-extrapolation-gcps.ts";

// 扇形外挿の縮尺と回転を、凸包の点の最小値ではなく、重心から遠い凸包の点の最小二乗で決める（V3 の plain）。
//
// 素材は Core のデモ（layered-map）の GCP。紙の CRS の線形の画素（P1）に誤差 3 画素の GCP を 24 組打った
// もの（G1C）と、中心を大きく描いた図（P3）に 34 組打ったもの（G3）。真の変換が分かるので、GCP の凸包の外でも
// 正解との差を測れる（tests/fan-extrapolation-eval.ts）。
//
// BASE_* は、この変更の前（844d8b6）の同じ素材の測定値（lcc の平面距離・km）。

/** 変更前: P1・G1C の外側の最大（Core のデモの球面距離では 106 km） */
const BASE_P1_OUTER_MAX_KM = 109.502;
/** 変更前: P3・G3 の外側の二乗平均 */
const BASE_P3_OUTER_RMS_KM = 36.542;

// 誤差の無い GCP: G1C と同じ地点で、紙の画素を真の画素にしたもの
const identity = G1C.map(([, lcc]) => [lccToPx1(lcc), lcc] as Pair);

describe("凸包の外の縮尺と回転（Core のデモの素材）", () => {
  const p1 = buildTin(G1C);
  const p1Eval = evaluate(p1, G1C, truthOfP1());
  const p3 = buildTin(G3);
  const p3Eval = evaluate(p3, G3, truthOfP3(G3));

  it("P1・24 組・誤差 3 画素: 外側の最大が 25 km 以下（変更前は 109.5 km）", () => {
    expect(BASE_P1_OUTER_MAX_KM).toBeGreaterThan(100);
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

  it("2 つの結果の差を測る道具が、同じ結果で 0 を返す", () => {
    expect(maxOuterDiff(p1Eval, p1Eval)).toBe(0);
  });
});

// ── 推定そのものの試験（boundary-vertices の公開口で、角の補助頂点の位置から縮尺と回転を読む）─────────

/** F = z·B（実部が y、虚部が x の複素数）。縮尺は forw/bakw の比なので |z|、回転は arg z。 */
const Z0 = { re: 2 * Math.cos((30 * Math.PI) / 180), im: 2 * Math.sin((30 * Math.PI) / 180) };

function complexParams(
  hull: Array<{ radius: number; angleDeg: number; dBakw?: number }>
): BoundaryVerticesParams {
  const convexBuf: BoundaryVerticesParams["convexBuf"] = {};
  const allGcps: BoundaryVerticesParams["allGcps"] = [];
  hull.forEach(({ radius, angleDeg, dBakw = 1 }, i) => {
    const phi = (angleDeg * Math.PI) / 180;
    const F = { re: radius * Math.cos(phi), im: radius * Math.sin(phi) }; // re=Δy, im=Δx
    // B = F / z0（その後、bakw の距離だけ dBakw 倍にして誤差を入れる）
    const d = Z0.re ** 2 + Z0.im ** 2;
    const B = {
      re: ((F.re * Z0.re + F.im * Z0.im) / d) * dBakw,
      im: ((F.im * Z0.re - F.re * Z0.im) / d) * dBakw
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

// 遠い 8 点は z0 に厳密に従い、近い 4 点（最遠の 0.6 倍未満）は bakw の距離を 10 % 伸ばして誤差を入れる
// （forw/bakw の比が小さく出るので、最小値はこの点を拾う）。
const NEAR_BAD = Array.from({ length: 4 }, (_, k) => ({ radius: 30, angleDeg: 22.5 + 90 * k, dBakw: 1.1 }));
const FAR_EXACT = Array.from({ length: 8 }, (_, k) => ({ radius: 100, angleDeg: 45 * k }));

describe("遠い凸包の点の最小二乗（V3 の plain だけ）", () => {
  const params = complexParams([...FAR_EXACT, ...NEAR_BAD]);

  it("V3 の plain: 近い点の誤差に引かれず、遠い点が従う相似で四隅を置く", () => {
    const vertices = calculatePlainVertices(params, true);
    const corners = vertices.filter(({ forw: [x, y] }) => Math.abs(x) === 120 && Math.abs(y) === 120);
    expect(corners).toHaveLength(4);
    for (const { forw, bakw } of corners) {
      const expected = bakwOf(forw);
      expect(bakw[0]).toBeCloseTo(expected[0], 6);
      expect(bakw[1]).toBeCloseTo(expected[1], 6);
    }
  });

  it("V2（v3 = false）は変わらず、近い点の比の最小値で縮尺を決める", () => {
    const vertices = calculatePlainVertices(params, false);
    expect(vertices).toHaveLength(4);
    // 最小値は近い点の比 2/1.1 → 縮尺が 1.1 分小さく、補助頂点は重心から 1.1 倍遠くなる
    for (const { forw, bakw } of vertices) {
      const expected = bakwOf(forw);
      expect(bakw[0]).toBeCloseTo(expected[0] * 1.1, 6);
      expect(bakw[1]).toBeCloseTo(expected[1] * 1.1, 6);
    }
  });

  it("birdeye は変えない（象限ごとに、近い点の比の最小値）", () => {
    for (const v3 of [false, true]) {
      const vertices = calculateBirdeyeVertices(params, v3);
      const corners = vertices.filter(({ forw: [x, y] }) => Math.abs(x) === 120 && Math.abs(y) === 120);
      expect(corners).toHaveLength(4);
      for (const { forw, bakw } of corners) {
        const expected = bakwOf(forw);
        expect(bakw[0]).toBeCloseTo(expected[0] * 1.1, 6);
        expect(bakw[1]).toBeCloseTo(expected[1] * 1.1, 6);
      }
    }
  });

  it("遠い点が 3 未満のときは、凸包の全点の最小二乗に戻る（下限）", () => {
    // 半径 100 が 1 点・半径 30 が 5 点。最遠の 0.6 倍以上は 1 点だけ。
    const few = complexParams([
      { radius: 100, angleDeg: 10 },
      ...Array.from({ length: 5 }, (_, k) => ({ radius: 30, angleDeg: 80 + 60 * k, dBakw: 1.1 }))
    ]);
    const vertices = calculatePlainVertices(few, true);
    const corners = vertices.filter(({ forw: [x, y] }) => Math.abs(x) === 120 && Math.abs(y) === 120);
    expect(corners).toHaveLength(4);
    // 全点（近い点の bakw は距離 1.1 倍）の最小二乗: z = Σ F conj(B) / Σ |B|²
    let nr = 0, ni = 0, den = 0;
    for (const { forw, bakw } of Object.values(few.convexBuf)) {
      const F = { re: forw[1], im: forw[0] };
      const B = { re: -bakw[1], im: bakw[0] };
      nr += F.re * B.re + F.im * B.im;
      ni += F.im * B.re - F.re * B.im;
      den += B.re ** 2 + B.im ** 2;
    }
    const scale = Math.hypot(nr, ni) / den;
    const rot = Math.atan2(ni, nr);
    for (const { forw, bakw } of corners) {
      const dist = Math.hypot(forw[0], forw[1]) / scale;
      const theta = Math.atan2(forw[0], forw[1]) - rot;
      expect(bakw[0]).toBeCloseTo(dist * Math.sin(theta), 6);
      expect(bakw[1]).toBeCloseTo(-dist * Math.cos(theta), 6);
    }
  });
});
