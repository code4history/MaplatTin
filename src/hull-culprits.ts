import { orient2d } from "robust-predicates";
import type { Position } from "geojson";
import type { Edge, Tins } from "@maplat/transform";

type VertexId = number | string;

interface Item {
  ids: string[];
  /** 地理面での頂点（逆変換用の三角形） */
  g: Position[];
  /** 地理面での向き */
  sign: number;
  /** 地図面での向きと地理面での向きの積 */
  ratio: number;
  aux: boolean;
  minx: number;
  maxx: number;
  miny: number;
  maxy: number;
}

const isAuxiliary = (id: VertexId) => typeof id === "string" && id.startsWith("b");

/** 三角形 a と b の内部が重なるか（辺が接するだけ、頂点が接するだけなら重ならない）。 */
function overlaps(a: Item, b: Item): boolean {
  const separates = (t: Item, u: Item) => {
    for (let k = 0; k < 3; k++) {
      const p = t.g[k];
      const q = t.g[(k + 1) % 3];
      if (u.g.every((r) => t.sign * orient2d(p[0], p[1], q[0], q[1], r[0], r[1]) <= 0)) return true;
    }
    return false;
  };
  return !separates(a, b) && !separates(b, a);
}

/**
 * strict を壊した凸包の辺を特定する。
 *
 * 地図面の三角網 `forw` を地理面へ写した三角形（逆変換用）のうち、向きが他と食い違う（反転・面積 0）か、
 * 内部が他の三角形と重なるものを探す。補助頂点を含む三角形か、凸包の辺に接する三角形が関わるものだけを
 * 数える（GCP だけの三角形どうしの重なりは、凸包の辺では直らない）。
 *
 * 原因の辺は、次の順で選ぶ。
 * 1. 反転・重なりに関わる三角形が接している凸包の辺
 * 2. 1 が無いとき、関わる三角形の GCP の頂点を端点にする凸包の辺
 *
 * @param forw 地図面の三角網
 * @param hull 制約にした地図面の凸包の辺（`pointIndices` で引く位置の組）
 * @param pointIndices 位置から頂点の添字（GCP は数、中継点は "e12"）への対応
 */
export function findHullCulprits(
  forw: Tins,
  hull: readonly Edge[],
  pointIndices: readonly VertexId[]
): Edge[] {
  if (hull.length === 0) return [];
  const items: Item[] = forw.features.map((tri) => {
    const { a, b, c } = tri.properties!;
    const g = [a.geom, b.geom, c.geom] as Position[];
    const [p, q, r] = tri.geometry!.coordinates[0];
    const xs = g.map(([x]) => x);
    const ys = g.map(([, y]) => y);
    const forwSign = Math.sign(orient2d(p[0], p[1], q[0], q[1], r[0], r[1]));
    const bakwSign = Math.sign(orient2d(g[0][0], g[0][1], g[1][0], g[1][1], g[2][0], g[2][1]));
    return {
      ids: [a.index, b.index, c.index].map(String),
      g,
      sign: bakwSign,
      ratio: forwSign * bakwSign,
      aux: [a.index, b.index, c.index].some(isAuxiliary),
      minx: Math.min(...xs),
      maxx: Math.max(...xs),
      miny: Math.min(...ys),
      maxy: Math.max(...ys)
    };
  });
  // 向きの積が多数派と違うものを反転とする（面積 0 は積が 0 になる）
  const ratios = items.map((t) => t.ratio);
  const majority = ratios.reduce((sum, r) => sum + r, 0) < 0 ? -1 : 1;

  // 凸包の辺に接する三角形
  const triangleKey = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`);
  const adjacent = new Map<string, number[]>();
  items.forEach((item, t) => {
    for (let k = 0; k < 3; k++) {
      const key = triangleKey(item.ids[k], item.ids[(k + 1) % 3]);
      const list = adjacent.get(key);
      if (list) list.push(t);
      else adjacent.set(key, [t]);
    }
  });
  const hullKey = ([a, b]: Edge) => triangleKey(String(pointIndices[a]), String(pointIndices[b]));
  const hullTriangles = new Set<number>();
  for (const edge of hull) for (const t of adjacent.get(hullKey(edge)) ?? []) hullTriangles.add(t);
  const relevant = (t: number) => items[t].aux || hullTriangles.has(t);

  const bad = new Set<number>();
  items.forEach((_, t) => {
    if (relevant(t) && (ratios[t] === 0 || ratios[t] !== majority)) bad.add(t);
  });
  // 内部の重なり（地理面の外接矩形の左端の順に走査する）
  const order = items.map((_, t) => t).sort((s, t) => items[s].minx - items[t].minx);
  for (let i = 0; i < order.length; i++) {
    const a = items[order[i]];
    if (a.sign === 0) continue;
    for (let j = i + 1; j < order.length; j++) {
      const b = items[order[j]];
      if (b.minx >= a.maxx) break;
      if (b.sign === 0 || b.miny >= a.maxy || a.miny >= b.maxy) continue;
      if (!relevant(order[i]) && !relevant(order[j])) continue;
      if (overlaps(a, b)) {
        bad.add(order[i]);
        bad.add(order[j]);
      }
    }
  }
  if (bad.size === 0) return [];

  const direct = hull.filter((edge) => (adjacent.get(hullKey(edge)) ?? []).some((t) => bad.has(t)));
  if (direct.length > 0) return direct;

  const touched = new Set<string>();
  for (const t of bad) for (const id of items[t].ids) if (!id.startsWith("b")) touched.add(id);
  return hull.filter(
    ([a, b]) => touched.has(String(pointIndices[a])) || touched.has(String(pointIndices[b]))
  );
}
