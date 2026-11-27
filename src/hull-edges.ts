import { orient2d } from "robust-predicates";
import type { Position } from "geojson";
import type { Edge } from "@maplat/transform";

/**
 * 点群の凸包の辺を、点の添字の組で返す。凸包の辺の上に一直線に並ぶ点も含め、
 * 隣り合う点どうしの区間を 1 本ずつの辺にする。
 *
 * 座標が同じ点は最初の添字だけを使う。一直線に並ぶ点しか無いとき（凸包が面を持たないとき）は空。
 * 「一直線」は正確な判定（orient2d が 0）で、わずかに内側にある点は辺の途中の点として扱わない
 * （その点は凸包の内側の点で、辺は隣り合う凸包の頂点どうしになる）。
 */
export function convexHullEdges(coordinates: readonly Position[]): Edge[] {
  const seen = new Set<string>();
  const items: { i: number; x: number; y: number }[] = [];
  coordinates.forEach(([x, y], i) => {
    const key = `${x}:${y}`;
    if (seen.has(key)) return;
    seen.add(key);
    items.push({ i, x, y });
  });
  if (items.length < 3) return [];

  const turn = (a: (typeof items)[number], b: (typeof items)[number], c: (typeof items)[number]) =>
    orient2d(a.x, a.y, b.x, b.y, c.x, c.y);

  // 凸包の頂点（一直線上の点を含まない）を単調鎖で求める
  const sorted = [...items].sort((a, b) => a.x - b.x || a.y - b.y);
  const chain = (points: typeof sorted) => {
    const out: typeof sorted = [];
    for (const p of points) {
      while (out.length >= 2 && turn(out[out.length - 2], out[out.length - 1], p) <= 0) out.pop();
      out.push(p);
    }
    out.pop();
    return out;
  };
  const hull = [...chain(sorted), ...chain([...sorted].reverse())];
  if (hull.length < 3) return [];

  const edges: Edge[] = [];
  for (let k = 0; k < hull.length; k++) {
    const p = hull[k];
    const q = hull[(k + 1) % hull.length];
    const dx = q.x - p.x;
    const dy = q.y - p.y;
    const length2 = dx * dx + dy * dy;
    // 辺 p-q の上にある点を、p からの距離の順に並べる
    const between = items
      .filter((r) => r !== p && r !== q && turn(p, q, r) === 0)
      .map((r) => ({ r, t: ((r.x - p.x) * dx + (r.y - p.y) * dy) / length2 }))
      .filter(({ t }) => t > 0 && t < 1)
      .sort((a, b) => a.t - b.t)
      .map(({ r }) => r);
    const line = [p, ...between, q];
    for (let m = 0; m + 1 < line.length; m++) edges.push([line[m].i, line[m + 1].i]);
  }
  return edges;
}

/** 凸包の辺の鍵（向きによらない）。外す辺の集合に使う。 */
export function hullEdgeKey([a, b]: Edge): string {
  return a < b ? `${a}-${b}` : `${b}-${a}`;
}
