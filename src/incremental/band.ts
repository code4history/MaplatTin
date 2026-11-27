/**
 * 帯（補助頂点・重心）を更新しなくてよい編集かどうかの判定（MaplatTin#100。設計書 §6.3 の C1〜C7）。
 *
 * 補助頂点の位置は、内側の点の全体量（重心・外接矩形・凸包・区分ごとの最も外側の点・囲みの拡大）から決まる。
 * それらを変えない編集だけを、帯を前のままにして局所で当てる。変える編集は、帯の差し替え（第 1 段 b）か、
 * 全部組み直しへ回す。条件を満たして帯を前のままにしても、網は strict である（strict は差し替えの判定が持つ）。
 * ずれるのは、凸包の外側の外挿だけで、清書で消える。
 */
import type { Position } from "geojson";
import { orient2d } from "robust-predicates";
import { ringBinOf } from "../boundary-vertices.ts";
import { convexHullEdges } from "../hull-edges.ts";
import type { MeshModel } from "./model.ts";

/** C7: 内側の点の算術平均が、帯を作ったときから、外接矩形の対角線のこの割合を超えて動いたら、帯を作り直す。 */
export const CENTROID_DRIFT_LIMIT = 0.005;
/** C6: 重心から輪までの距離に対する、点までの距離の比がこれ以上の点は、囲みの拡大を決めている点とみなす。 */
const EXPANSION_HOLDER_RATIO = 0.999;
/** 区分の境界の方向にある点は、両側の区分に入る（`calculateVerticesCore` と同じ扱い）。 */
const BIN_EDGE_TOLERANCE_DEG = 1e-9;

/** 編集で動く・増える・消える点（中継点を含む。C1）。 */
export interface BandChange {
  /** 今ある頂点（動かす・消す）。足す点では undefined */
  vertex?: number;
  /** 新しい位置（消す点では undefined） */
  to?: { forw: Position; bakw: Position };
  /** 対応点か（外接矩形は対応点だけで取る） */
  gcp: boolean;
  /** 重心（算術平均）に入るか（対応点と中継点。補完点は入らない） */
  counted: boolean;
}

/** 編集の後の、内側の点の紙の面の座標の和と数。 */
export interface BandTotals {
  sum: [number, number];
  count: number;
}

const angleDeg = (position: Position, center: Position): number => {
  const deg =
    Math.atan2(position[0] - center[0], position[1] - center[1]) *
    (180 / Math.PI);
  return deg < 0 ? deg + 360 : deg;
};

/** 点が属する区分（区分の境界の方向にある点は、両側）。 */
function binsOf(position: Position, center: Position): number[] {
  const bin = ringBinOf(position, center);
  const rel = angleDeg(position, center) - bin * 10;
  if (rel < BIN_EDGE_TOLERANCE_DEG) return [bin, (bin + 35) % 36];
  if (rel > 10 - BIN_EDGE_TOLERANCE_DEG) return [bin, (bin + 1) % 36];
  return [bin];
}

/** 凸多角形（頂点の列）の、厳密に内側か。 */
function strictlyInside(polygon: Position[], point: Position): boolean {
  let sign = 0;
  for (let i = 0; i < polygon.length; i++) {
    const a = polygon[i],
      b = polygon[(i + 1) % polygon.length];
    const s = Math.sign(orient2d(a[0], a[1], b[0], b[1], point[0], point[1]));
    if (s === 0) return false;
    if (sign === 0) sign = s;
    else if (s !== sign) return false;
  }
  return sign !== 0;
}

export class BandStats {
  /** 両面の凸包（内側の点の全部で取る）と、凸包の辺の上にある頂点 */
  private hull: { forw: Position[]; bakw: Position[] };
  private hullVertices = new Set<number>();
  /** 対応点の外接矩形（紙の面）と、その端を与える頂点 */
  private box: { minx: number; maxx: number; miny: number; maxy: number };
  /** 区分ごとの、最も外側の点までの距離（点が無い区分は −1）と、その頂点 */
  private binMax: number[] = new Array(36).fill(-1);
  private binHolders = new Set<number>();
  /** 補助頂点の輪（地理面）と、扇形の中心 */
  private ring: Position[];
  private centroid: { forw: Position; bakw: Position };
  /** 内側の点（対応点と中継点）の紙の面の座標の和と数。帯を作ったときの平均 */
  private sum: [number, number] = [0, 0];
  private count = 0;
  private mean0: [number, number];
  private diagonal: number;

  private constructor(model: MeshModel) {
    const { mesh } = model;
    const at = (vertex: number) => mesh.vertices.get(vertex)!;
    this.centroid = model.centroid!;
    this.ring = model.ring.map((vertex) => at(vertex).bakw);
    const interior = [...model.gcps, ...model.nodeOrder()];
    const hullOf = (plane: "forw" | "bakw"): Position[] => {
      const edges = convexHullEdges(interior.map((vertex) => at(vertex)[plane]));
      for (const [a, b] of edges) {
        this.hullVertices.add(interior[a]);
        this.hullVertices.add(interior[b]);
      }
      return edges.map(([a]) => at(interior[a])[plane]);
    };
    this.hull = { forw: hullOf("forw"), bakw: hullOf("bakw") };
    const xs = model.gcps.map((vertex) => at(vertex).forw[0]);
    const ys = model.gcps.map((vertex) => at(vertex).forw[1]);
    this.box = {
      minx: Math.min(...xs),
      maxx: Math.max(...xs),
      miny: Math.min(...ys),
      maxy: Math.max(...ys)
    };
    this.diagonal = Math.hypot(
      this.box.maxx - this.box.minx,
      this.box.maxy - this.box.miny
    );
    const holders = new Array<number | undefined>(36).fill(undefined);
    for (const vertex of interior) {
      const { forw } = at(vertex);
      const distance = this.forwDistance(forw);
      if (distance === 0) continue;
      for (const bin of binsOf(forw, this.centroid.forw)) {
        if (distance > this.binMax[bin]) {
          this.binMax[bin] = distance;
          holders[bin] = vertex;
        }
      }
    }
    for (const holder of holders)
      if (holder !== undefined) this.binHolders.add(holder);
    const supplements = new Set(model.supplements.map(({ vertex }) => vertex));
    for (const vertex of interior) {
      if (supplements.has(vertex)) continue;
      this.sum[0] += at(vertex).forw[0];
      this.sum[1] += at(vertex).forw[1];
      this.count++;
    }
    this.mean0 = [this.sum[0] / this.count, this.sum[1] / this.count];
  }

  /** 判定できない網（world file 外周・補助頂点の輪が網の外周でない網）では null。 */
  static of(model: MeshModel): BandStats | null {
    if (!model.centroid || model.ring.length < 3) return null;
    const boundary = model.mesh.boundaryRing();
    if (!boundary || boundary.length !== model.ring.length) return null;
    const ring = new Set(model.ring);
    if (!boundary.every((vertex) => ring.has(vertex))) return null;
    return new BandStats(model);
  }

  private forwDistance(forw: Position): number {
    return Math.hypot(
      forw[0] - this.centroid.forw[0],
      forw[1] - this.centroid.forw[1]
    );
  }

  /**
   * 地理面で、重心から輪までの距離に対する、重心から点までの距離の比（輪の内側なら 1 未満）。
   * 輪と交わらない方向なら Infinity。
   */
  private ringRatio(bakw: Position): number {
    const c = this.centroid.bakw;
    const dx = bakw[0] - c[0],
      dy = bakw[1] - c[1];
    let ratio = Infinity;
    for (let i = 0; i < this.ring.length; i++) {
      const s = this.ring[i],
        e = this.ring[(i + 1) % this.ring.length];
      const ex = e[0] - s[0],
        ey = e[1] - s[1];
      const det = ex * dy - ey * dx;
      if (det === 0) continue;
      // c + t (p − c) = s + w (e − s)
      const t = (ex * (s[1] - c[1]) - ey * (s[0] - c[0])) / det;
      const w = (dx * (s[1] - c[1]) - dy * (s[0] - c[0])) / det;
      if (t > 0 && w >= 0 && w <= 1) ratio = Math.min(ratio, 1 / t);
    }
    return ratio;
  }

  /**
   * 編集が、帯を更新しなくてよい条件（C1〜C7）を全部満たすか。満たすなら、編集の後の座標の和と数を返す
   * （編集を当てた後に {@link commit} へ渡す）。満たさなければ undefined。網を動かす前に呼ぶ。
   */
  keeps(
    model: MeshModel,
    changes: readonly BandChange[]
  ): BandTotals | undefined {
    const { box } = this;
    let sx = this.sum[0],
      sy = this.sum[1],
      count = this.count;
    for (const change of changes) {
      if (change.vertex !== undefined) {
        const vertex = change.vertex;
        const { forw, bakw } = model.mesh.vertices.get(vertex)!;
        // C2・C4・C6: 凸包の上の点・区分の最も外側の点・囲みの拡大を決めている点は、動かせない・消せない
        if (this.hullVertices.has(vertex) || this.binHolders.has(vertex))
          return undefined;
        if (!(this.ringRatio(bakw) < EXPANSION_HOLDER_RATIO)) return undefined;
        // C3: 外接矩形の端を与える対応点
        if (
          change.gcp &&
          (forw[0] === box.minx ||
            forw[0] === box.maxx ||
            forw[1] === box.miny ||
            forw[1] === box.maxy)
        )
          return undefined;
        if (change.counted) {
          sx -= forw[0];
          sy -= forw[1];
          count--;
        }
      }
      if (change.to) {
        const { forw, bakw } = change.to;
        // C2: 両面とも、凸包の内側
        if (!strictlyInside(this.hull.forw, forw)) return undefined;
        if (!strictlyInside(this.hull.bakw, bakw)) return undefined;
        // C3: 外接矩形の端にならない
        if (
          change.gcp &&
          !(
            forw[0] > box.minx &&
            forw[0] < box.maxx &&
            forw[1] > box.miny &&
            forw[1] < box.maxy
          )
        )
          return undefined;
        // C4: どの区分でも、最も外側にならない
        const distance = this.forwDistance(forw);
        if (distance > 0) {
          for (const bin of binsOf(forw, this.centroid.forw)) {
            if (!(distance < this.binMax[bin])) return undefined;
          }
        }
        // C5: 地理面で、今の輪の内側（囲みの拡大を広げない）
        if (!(this.ringRatio(bakw) < 1)) return undefined;
        if (change.counted) {
          sx += forw[0];
          sy += forw[1];
          count++;
        }
      }
    }
    // C7: 算術平均が、帯を作ったときから動きすぎていない
    if (count === 0) return undefined;
    const drift = Math.hypot(
      sx / count - this.mean0[0],
      sy / count - this.mean0[1]
    );
    if (!(drift <= CENTROID_DRIFT_LIMIT * this.diagonal)) return undefined;
    return { sum: [sx, sy], count };
  }

  /** 当てた編集を、算術平均に反映する（{@link keeps} が返した値を渡す）。 */
  commit(totals: BandTotals): void {
    this.sum = totals.sum;
    this.count = totals.count;
  }
}
