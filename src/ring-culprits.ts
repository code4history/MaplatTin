import { orient2d } from "robust-predicates";
import type { Position } from "geojson";
import type { Tins } from "@maplat/transform";

type VertexId = number | string;

interface Item {
  ids: VertexId[];
  /** 地図面での頂点 */
  f: Position[];
  /** 地理面での頂点（逆変換用の三角形） */
  g: Position[];
  sign: number;
  ratio: number;
  aux: boolean;
  minx: number;
  maxx: number;
  miny: number;
  maxy: number;
}

const isAuxiliary = (id: VertexId) => typeof id === "string" && id.startsWith("b");

/** 三角形 a と b の内部が地理面で重なるか（辺が接するだけ、頂点が接するだけなら重ならない）。 */
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
 * strict を壊した補助頂点を特定する（MaplatTin#98）。
 *
 * 地図面の三角網 `forw` を地理面へ写した三角形（逆変換用）のうち、向きが他と食い違う（反転・面積 0）か、
 * 内部が他の三角形と重なるものを探し、補助頂点を含む三角形が関わるものについて、その補助頂点の
 * 地図面での位置を返す。GCP だけの三角形どうしの重なりは、補助頂点を外しても直らないので数えない。
 */
export function findRingCulprits(forw: Tins): Position[] {
  const items: Item[] = forw.features.map((tri) => {
    const { a, b, c } = tri.properties!;
    const g = [a.geom, b.geom, c.geom] as Position[];
    const f = tri.geometry!.coordinates[0].slice(0, 3) as Position[];
    const xs = g.map(([x]) => x);
    const ys = g.map(([, y]) => y);
    const forwSign = Math.sign(orient2d(f[0][0], f[0][1], f[1][0], f[1][1], f[2][0], f[2][1]));
    const bakwSign = Math.sign(orient2d(g[0][0], g[0][1], g[1][0], g[1][1], g[2][0], g[2][1]));
    return {
      ids: [a.index, b.index, c.index],
      f,
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

  const bad = new Set<number>();
  items.forEach((item, t) => {
    if (item.aux && (ratios[t] === 0 || ratios[t] !== majority)) bad.add(t);
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
      if (!a.aux && !b.aux) continue;
      if (overlaps(a, b)) {
        bad.add(order[i]);
        bad.add(order[j]);
      }
    }
  }

  const found = new Map<string, Position>();
  for (const t of bad) {
    items[t].ids.forEach((id, k) => {
      if (isAuxiliary(id)) found.set(String(id), items[t].f[k]);
    });
  }
  return [...found.values()];
}
