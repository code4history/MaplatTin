// 扇形外挿（凸包の外）の精度を測る道具。Core のデモ（layered-map）の素材の作り方を写した。
//
// 紙は 2048 画素四方で、1 画素は 1500 m。紙の CRS は lcc（等角円錐）で、紙の画素と lcc の座標の
// 関係は線形（P1）。中心を大きく描いた図（P3）は、P1 の画素に中心 c0 からの拡大（a・rho）をかけたもの。
// 真の地理座標は P1 の画素から求まるので、凸包の外でも「正解との差」を測れる。
// 差は lcc の平面距離（km）。Core のデモの球面距離（haversine）とは数 % 違う。
import { Tin, type Options } from "../src/index.ts";

export const W = 2048;
const PX = 1500; // 1 画素の大きさ（m）
const C = W / 2;

type Pair = [[number, number], [number, number]];
type Xy = [number, number];

/** P1 の画素 → lcc の座標（m） */
export const px1ToLcc = ([x, y]: Xy): Xy => [PX * (x - C), -PX * (y - C)];
/** lcc の座標（m） → P1 の画素 */
export const lccToPx1 = ([X, Y]: Xy): Xy => [X / PX + C, -Y / PX + C];

/** 中心を大きく描いた見取り図 P3（Core の generate.mjs の makeD3）。P1 の画素 → 紙の画素 */
export function makeP3(c0: Xy, a = 0.5, rho = 235): (p: Xy) => Xy {
  return ([px, py]) => {
    const x = px - c0[0];
    const y = py - c0[1];
    const f = 1 + (a / (1 - a)) * Math.exp(-(x * x + y * y) / (rho * rho));
    return [c0[0] + x * f, c0[1] + y * f];
  };
}

/** 逆変換（ニュートン法。ヤコビアンは差分）。紙の画素 → P1 の画素 */
export function invert(D: (p: Xy) => Xy): (q: Xy) => Xy {
  return (q) => {
    let p: Xy = [q[0], q[1]];
    for (let it = 0; it < 60; it++) {
      const f0 = D(p);
      const e = [f0[0] - q[0], f0[1] - q[1]];
      if (Math.hypot(e[0], e[1]) < 1e-7) break;
      const h = 0.25;
      const fx = D([p[0] + h, p[1]]);
      const fy = D([p[0], p[1] + h]);
      const a = (fx[0] - f0[0]) / h;
      const b = (fy[0] - f0[0]) / h;
      const c = (fx[1] - f0[1]) / h;
      const d = (fy[1] - f0[1]) / h;
      const det = a * d - b * c;
      p = [p[0] - (d * e[0] - b * e[1]) / det, p[1] - (-c * e[0] + a * e[1]) / det];
    }
    return p;
  };
}

/** 紙の画素 → 真の lcc の座標。P3 の中心 c0 は GCP の真の P1 の画素の重心（Core と同じ） */
export function truthOfP1(): (q: Xy) => Xy {
  return (q) => px1ToLcc(q);
}
export function truthOfP3(gcps: Pair[]): (q: Xy) => Xy {
  const px1 = gcps.map(([, lcc]) => lccToPx1(lcc));
  const c0: Xy = [
    px1.reduce((s, p) => s + p[0], 0) / px1.length,
    px1.reduce((s, p) => s + p[1], 0) / px1.length
  ];
  const inv = invert(makeP3(c0));
  return (q) => px1ToLcc(inv(q));
}

function convexHull(points: Xy[]): Xy[] {
  const pts = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: Xy, a: Xy, b: Xy) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: Xy[] = [];
  for (const q of pts) {
    while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop();
    lo.push(q);
  }
  const up: Xy[] = [];
  for (const q of [...pts].reverse()) {
    while (up.length >= 2 && cross(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop();
    up.push(q);
  }
  return [...lo.slice(0, -1), ...up.slice(0, -1)];
}

function inHull(hull: Xy[], p: Xy): boolean {
  let sign = 0;
  for (let i = 0; i < hull.length; i++) {
    const a = hull[i];
    const b = hull[(i + 1) % hull.length];
    const c = (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]);
    if (c !== 0) {
      const s = Math.sign(c);
      if (sign === 0) sign = s;
      else if (s !== sign) return false;
    }
  }
  return true;
}

const N = 65;
const GRID: Xy[] = [];
for (let j = 0; j < N; j++) {
  for (let i = 0; i < N; i++) {
    GRID.push([
      Math.min(W - 0.5, Math.max(0.5, (i / (N - 1)) * W)),
      Math.min(W - 0.5, Math.max(0.5, (j / (N - 1)) * W))
    ]);
  }
}

export interface Stat {
  max: number;
  rms: number;
  n: number;
}
const stat = (e: number[]): Stat => ({
  max: e.length ? Math.max(...e) : 0,
  rms: e.length ? Math.sqrt(e.reduce((s, v) => s + v * v, 0) / e.length) : 0,
  n: e.length
});

/** 紙の全面に 65×65 の格子を置き、GCP の凸包の内側・外側それぞれで、正解との差（km）を測る */
export function evaluate(
  tin: Tin,
  gcps: Pair[],
  truth: (q: Xy) => Xy
): { inner: Stat; outer: Stat; all: Array<{ q: Xy; xy: Xy; km: number; outside: boolean }> } {
  const hull = convexHull(gcps.map(([px]) => px));
  const inner: number[] = [];
  const outer: number[] = [];
  const all: Array<{ q: Xy; xy: Xy; km: number; outside: boolean }> = [];
  for (const q of GRID) {
    const r = tin.transform(q, false, true) as number[] | false;
    if (!r) throw new Error(`変換できない画素: ${q.join(",")}`);
    const t = truth(q);
    const km = Math.hypot(r[0] - t[0], r[1] - t[1]) / 1000;
    const outside = !inHull(hull, q);
    (outside ? outer : inner).push(km);
    all.push({ q, xy: [r[0], r[1]], km, outside });
  }
  return { inner: stat(inner), outer: stat(outer), all };
}

/** GCP から三角網を組む（紙 2048 画素四方・y 軸は north-up） */
export function buildTin(gcps: Pair[], extra: Partial<Options> = {}): Tin {
  const tin = new Tin({ wh: [W, W], yaxisMode: "invert", points: gcps, ...extra });
  tin.updateTin();
  return tin;
}

/** 2 つの結果の、凸包の外側での最大の差（km） */
export function maxOuterDiff(
  a: ReturnType<typeof evaluate>,
  b: ReturnType<typeof evaluate>
): number {
  let m = 0;
  a.all.forEach((s, k) => {
    if (!s.outside) return;
    m = Math.max(m, Math.hypot(s.xy[0] - b.all[k].xy[0], s.xy[1] - b.all[k].xy[1]) / 1000);
  });
  return m;
}
