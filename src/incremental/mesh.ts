/**
 * 局所更新の網（MaplatTin#100 の第 1 段 a）。
 *
 * 採用済みの三角網（strict・auto。接続は両面で共通）を、番号の配列と索引で持ち、範囲 R の外周の輪を
 * 固定して、輪の内側だけを差し替える（{@link IncrementalMesh#replace}）。
 *
 * strict の保証は、次の不変条件で持つ（設計書 §2・§3）。
 * - S1: 全部の三角形が ok（両面の向きの積が網の向き σ に等しい）。`bad` が空であることで読む
 * - S2: 網の外周 ∂M が 1 本の輪で、両面とも単純な多角形。`boundarySimple` で読む
 * - S3: 必須エッジが全部、網の辺にある
 * - S4: 禁止制約に当たる三角形（3 頂点が同じ群に属する三角形）が、差し替えで増えない
 *
 * 判定は差し替えた三角形だけで行い、全体は数え直さない（全体を数え直すのは試験の {@link IncrementalMesh#audit} だけ）。
 */
import Delaunator from "delaunator";
import { orient2d } from "robust-predicates";
import type { Position } from "geojson";
import { Constrain } from "../edgebound/index.ts";
import { intersectSegments, nextEdge } from "../edgebound/base.ts";

/** Editor が振る、対応点の安定した id（配列位置ではない）。`setPoints` で入れた点は、その時点の添字。 */
export type PointId = number;
/** Editor が振る、必須エッジの安定した id。`setEdges` で入れた必須エッジは、その時点の添字。 */
export type EdgeId = number;

/** 頂点の指し方。配列位置ではなく、種類と安定した id。 */
export type VertexRef =
  | { kind: "gcp"; id: PointId }
  /** 必須エッジの中継点（その必須エッジの中での順） */
  | { kind: "edgeNode"; edge: EdgeId; order: number }
  /** 補完点 */
  | { kind: "supplement"; key: string }
  /** 補助頂点（輪の中での順） */
  | { kind: "boundary"; order: number };

/** 網の頂点。座標は網の内部の座標系（compiled と同じ。follow では地理面の Y が反転済み）。 */
export interface MeshVertex {
  ref: VertexRef;
  forw: Position;
  bakw: Position;
  /** 禁止制約の群の番号（{@link BOUNDARY_GROUP} は補助頂点の全体。必須エッジは {@link edgeGroupOf}）。 */
  groups: number[];
}

/** 補助頂点の全体の群。 */
export const BOUNDARY_GROUP = 0;
/** 必須エッジ（端点と中継点）の群。 */
export const edgeGroupOf = (edge: EdgeId): number => edge + 1;

/** 辺の属性（別々に持つ。1 つの「制約」にまとめない）。 */
export const EDGE_REQUIRED = 1;
export const EDGE_HULL = 2;
export const EDGE_PROTECT = 4;

/** 新しく作る三角形の 2×面積の下限（今の `isDegenerate` と同じ閾値。素の float64 で計算する）。 */
export const MIN_DOUBLE_AREA = 1e-6;
/** 範囲 R が網の三角形のこの割合を超えたら、組み直す前に諦める。 */
export const MAX_REPLACE_FRACTION = 0.2;

export type ReplaceFailure =
  | "tooLarge"
  | "notDisk"
  | "constraint"
  | "pointOutside"
  | "count"
  | "notStrict"
  | "forbidden"
  | "boundary";

/** 差し替えと一緒に行う頂点の編集。 */
export interface ReplaceEdit {
  /** 座標を変える頂点（R の内側の頂点に限る。輪の頂点は動かせない） */
  move?: ReadonlyMap<number, { forw: Position; bakw: Position }>;
  /** R の内側に置く新しい頂点（{@link IncrementalMesh#addVertex} で頂点表に入れてあること） */
  add?: readonly number[];
  /** 消す頂点（星が全部 R に入っていること） */
  remove?: readonly number[];
  /** 新しく張る辺（頂点の id の組と、付ける属性） */
  constrain?: readonly (readonly [number, number, number])[];
}

export type ReplaceResult =
  | { ok: true; removed: number[]; added: number[] }
  | { ok: false; reason: ReplaceFailure };

/** {@link IncrementalMesh#audit} の結果（網の全部を数え直した値）。 */
export interface MeshAudit {
  triangles: number;
  /** ok でない三角形の id */
  bad: number[];
  /** `bad` の差分管理が、数え直しと一致するか */
  badMatches: boolean;
  /** 索引（頂点 → 三角形、辺 → 三角形）が、三角形の表と一致するか */
  indexMatches: boolean;
  /** 3 つ以上の三角形に属する辺の数（0 が正常） */
  nonManifoldEdges: number;
  /** 外周が 1 本の輪で、両面とも単純か（数え直し） */
  boundarySimple: boolean;
  /** required の印があるのに、網の辺でない辺の数（0 が正常） */
  missingRequired: number;
  /** 禁止制約の三角形の数（補助頂点だけ・必須エッジ） */
  forbiddenBoundary: number;
  forbiddenEdge: number;
  /** 禁止制約の数の差分管理が、数え直しと一致するか */
  forbiddenMatches: boolean;
  /** 紙の面の三角形の面積の和（網が紙の面を重なりなく覆っていれば、編集の前後で変わらない） */
  forwArea: number;
}

const KEY_BASE = 2 ** 26;

/** 辺の鍵（向きによらない）。 */
export function edgeKey(a: number, b: number): number {
  return a < b ? a * KEY_BASE + b : b * KEY_BASE + a;
}

const sign2 = (p: Position, q: Position, r: Position): number =>
  Math.sign(orient2d(p[0], p[1], q[0], q[1], r[0], r[1]));

const doubleArea = (p: Position, q: Position, r: Position): number =>
  Math.abs((q[0] - p[0]) * (r[1] - p[1]) - (r[0] - p[0]) * (q[1] - p[1]));

type Triangle = [number, number, number];

export class IncrementalMesh {
  readonly vertices = new Map<number, MeshVertex>();
  readonly triangles = new Map<number, Triangle>();
  /** 頂点 → その頂点を持つ三角形 */
  readonly byVertex = new Map<number, Set<number>>();
  /** 辺 → その辺を持つ三角形（1 つなら網の外周の辺） */
  readonly byEdge = new Map<number, number[]>();
  /** 辺の属性（{@link EDGE_REQUIRED}・{@link EDGE_HULL}・{@link EDGE_PROTECT} の和） */
  readonly edgeFlags = new Map<number, number>();
  /** ok でない三角形 */
  readonly bad = new Set<number>();
  /** 外周 ∂M が 1 本の輪で、両面とも単純か */
  boundarySimple = true;
  /** 禁止制約の三角形の数（補助頂点だけの三角形・同じ必須エッジの点だけの三角形） */
  forbiddenBoundary = 0;
  forbiddenEdge = 0;
  /** 差し替えを当てた回数 */
  revision = 0;

  private nextVertex = 0;
  private nextTriangle = 0;

  /** 網の向き（紙の面の向きの符号 × 地理面の向きの符号） */
  readonly sigma: -1 | 1;
  /** 新しく作る三角形の、紙の面での頂点の並びの向き（取り込んだ網の多数決） */
  readonly forwSign: -1 | 1;

  constructor(sigma: -1 | 1, forwSign: -1 | 1) {
    this.sigma = sigma;
    this.forwSign = forwSign;
  }

  // ── 頂点・三角形・辺の表 ──

  addVertex(
    ref: VertexRef,
    forw: Position,
    bakw: Position,
    groups: number[] = []
  ): number {
    const id = this.nextVertex++;
    this.vertices.set(id, { ref, forw, bakw, groups });
    this.byVertex.set(id, new Set());
    return id;
  }

  /** 三角形を 1 つも持たない頂点を消す。 */
  dropVertex(id: number): void {
    if (this.byVertex.get(id)?.size) {
      throw new Error(`頂点 ${id} は三角形の頂点です`);
    }
    this.vertices.delete(id);
    this.byVertex.delete(id);
  }

  addTriangle(a: number, b: number, c: number): number {
    const id = this.nextTriangle++;
    const tri: Triangle = [a, b, c];
    this.triangles.set(id, tri);
    for (let i = 0; i < 3; i++) {
      this.byVertex.get(tri[i])!.add(id);
      const key = edgeKey(tri[i], tri[(i + 1) % 3]);
      const list = this.byEdge.get(key);
      if (list) list.push(id);
      else this.byEdge.set(key, [id]);
    }
    if (!this.ok(a, b, c)) this.bad.add(id);
    const group = this.forbiddenGroup(a, b, c);
    if (group === BOUNDARY_GROUP) this.forbiddenBoundary++;
    else if (group !== undefined) this.forbiddenEdge++;
    return id;
  }

  removeTriangle(id: number): void {
    const tri = this.triangles.get(id)!;
    this.triangles.delete(id);
    for (let i = 0; i < 3; i++) {
      this.byVertex.get(tri[i])?.delete(id);
      const key = edgeKey(tri[i], tri[(i + 1) % 3]);
      const list = this.byEdge.get(key)!;
      if (list.length === 1) this.byEdge.delete(key);
      else list.splice(list.indexOf(id), 1);
    }
    this.bad.delete(id);
    const group = this.forbiddenGroup(tri[0], tri[1], tri[2]);
    if (group === BOUNDARY_GROUP) this.forbiddenBoundary--;
    else if (group !== undefined) this.forbiddenEdge--;
  }

  hasEdge(a: number, b: number): boolean {
    return this.byEdge.has(edgeKey(a, b));
  }

  flagsOf(a: number, b: number): number {
    return this.edgeFlags.get(edgeKey(a, b)) ?? 0;
  }

  setFlag(a: number, b: number, flag: number): void {
    const key = edgeKey(a, b);
    this.edgeFlags.set(key, (this.edgeFlags.get(key) ?? 0) | flag);
  }

  clearFlag(a: number, b: number, flag: number): void {
    const key = edgeKey(a, b);
    const rest = (this.edgeFlags.get(key) ?? 0) & ~flag;
    if (rest) this.edgeFlags.set(key, rest);
    else this.edgeFlags.delete(key);
  }

  // ── 判定 ──

  /** 三角形の合格（S1）: 両面の向きの積が σ に等しい。面積 0 は不合格。向きは厳密な述語で取る。 */
  ok(
    a: number,
    b: number,
    c: number,
    at: (id: number) => MeshVertex = this.vertexAt
  ): boolean {
    const p = at(a),
      q = at(b),
      r = at(c);
    return (
      sign2(p.forw, q.forw, r.forw) * sign2(p.bakw, q.bakw, r.bakw) ===
      this.sigma
    );
  }

  /** 新しく作る三角形の合格: ok に加えて、両面とも 2×面積が閾値以上。 */
  okNew(
    a: number,
    b: number,
    c: number,
    at: (id: number) => MeshVertex = this.vertexAt
  ): boolean {
    if (!this.ok(a, b, c, at)) return false;
    const p = at(a),
      q = at(b),
      r = at(c);
    return (
      doubleArea(p.forw, q.forw, r.forw) >= MIN_DOUBLE_AREA &&
      doubleArea(p.bakw, q.bakw, r.bakw) >= MIN_DOUBLE_AREA
    );
  }

  /** 3 頂点が同じ群に属するなら、その群の番号（禁止制約の違反）。属さなければ undefined。 */
  forbiddenGroup(a: number, b: number, c: number): number | undefined {
    const gb = this.vertices.get(b)!.groups;
    const gc = this.vertices.get(c)!.groups;
    return this.vertices
      .get(a)!
      .groups.find((g) => gb.includes(g) && gc.includes(g));
  }

  /** strict か（S1 と S2）。`bad` が空なだけでは足りない。 */
  isStrict(): boolean {
    return this.bad.size === 0 && this.boundarySimple;
  }

  private vertexAt = (id: number): MeshVertex => this.vertices.get(id)!;

  // ── 範囲と輪 ──

  /** 頂点の星（その頂点を持つ三角形の全部）。 */
  star(vertex: number): Set<number> {
    return new Set(this.byVertex.get(vertex));
  }

  /** 範囲に、頂点で接する三角形を 1 周足す。 */
  grow(range: ReadonlySet<number>): Set<number> {
    const out = new Set(range);
    for (const id of range) {
      for (const v of this.triangles.get(id)!) {
        for (const t of this.byVertex.get(v)!) out.add(t);
      }
    }
    return out;
  }

  /** 三角形の頂点を、紙の面で正の向き（orient2d > 0）に並べ直す。面積 0 なら undefined。 */
  positive(id: number): Triangle | undefined {
    const [a, b, c] = this.triangles.get(id)!;
    const s = sign2(
      this.vertices.get(a)!.forw,
      this.vertices.get(b)!.forw,
      this.vertices.get(c)!.forw
    );
    if (s === 0) return undefined;
    return s > 0 ? [a, b, c] : [a, c, b];
  }

  /**
   * 範囲の外周の輪を、有向の辺の列（範囲の内側が、紙の面で正の向きの側）で取る。
   * 範囲が円板でなければ（同じ頂点を 2 回通る・穴がある・離れている）undefined。
   */
  ringOf(range: ReadonlySet<number>): number[] | undefined {
    const next = new Map<number, number>();
    for (const id of range) {
      const tri = this.positive(id);
      if (!tri) return undefined;
      for (let i = 0; i < 3; i++) {
        const u = tri[i],
          v = tri[(i + 1) % 3];
        const owners = this.byEdge.get(edgeKey(u, v))!;
        if (owners.length > 2) return undefined;
        if (owners.length === 2 && range.has(owners[0]) && range.has(owners[1]))
          continue;
        if (next.has(u)) return undefined;
        next.set(u, v);
      }
    }
    if (next.size < 3) return undefined;
    const start = next.keys().next().value as number;
    const ring = [start];
    for (let v = next.get(start)!; v !== start; v = next.get(v)!) {
      if (v === undefined || ring.length > next.size) return undefined;
      ring.push(v);
    }
    return ring.length === next.size ? ring : undefined;
  }

  // ── 差し替え ──

  /**
   * 範囲 R の外周の輪を固定して、内側だけを三角形分割し直す（設計書 §5.1）。
   * 失敗したときは、網を変えない。
   *
   * 重なりの解消と、禁止制約の局所の解消（§5.2）は、まだ入れていない（第 2 週）。新しい三角形に
   * okNew でないものがあれば "notStrict"、禁止制約が増えれば "forbidden" で失敗する。
   */
  replace(range: ReadonlySet<number>, edit: ReplaceEdit = {}): ReplaceResult {
    const fail = (reason: ReplaceFailure): ReplaceResult => ({
      ok: false,
      reason
    });
    // 0. 大きすぎる範囲は、組み直す前に諦める
    if (range.size > this.triangles.size * MAX_REPLACE_FRACTION)
      return fail("tooLarge");

    // 1. 輪（動かす前の座標で取る）
    const ring = this.ringOf(range);
    if (!ring) return fail("notDisk");
    const n = ring.length;
    const onRing = new Set(ring);

    // 2. 内側の点
    const removed = new Set(edit.remove ?? []);
    const inner = new Set<number>(edit.add ?? []);
    for (const id of range) {
      for (const v of this.triangles.get(id)!) {
        if (!onRing.has(v) && !removed.has(v)) inner.add(v);
      }
    }
    for (const v of removed) {
      if (onRing.has(v)) return fail("notDisk");
      for (const t of this.byVertex.get(v)!) {
        if (!range.has(t)) return fail("notDisk");
      }
    }
    for (const v of edit.move?.keys() ?? []) {
      if (!inner.has(v)) return fail("notDisk");
    }
    const at = (id: number): MeshVertex => {
      const moved = edit.move?.get(id);
      const vertex = this.vertices.get(id)!;
      return moved ? { ...vertex, ...moved } : vertex;
    };

    // 3. 輪と内側の点だけで三角形分割し、制約を張る
    const ids = [...ring, ...inner];
    const local = new Map(ids.map((v, i) => [v, i]));
    const ringKeys = new Set<number>();
    for (let i = 0; i < n; i++)
      ringKeys.add(edgeKey(ring[i], ring[(i + 1) % n]));
    const constraints: [number, number][] = ring.map((_, i) => [
      i,
      (i + 1) % n
    ]);
    // R の中にある required・hull の辺（protect は張らない。§5.2）と、新しく張る辺
    const kept = new Map<number, [number, number]>();
    const interiorKeys = new Set<number>();
    for (const id of range) {
      const tri = this.triangles.get(id)!;
      for (let i = 0; i < 3; i++) {
        const u = tri[i],
          v = tri[(i + 1) % 3];
        const key = edgeKey(u, v);
        if (ringKeys.has(key)) continue;
        interiorKeys.add(key);
        if (!((this.edgeFlags.get(key) ?? 0) & (EDGE_REQUIRED | EDGE_HULL)))
          continue;
        if (removed.has(u) || removed.has(v)) continue;
        kept.set(key, [u, v]);
      }
    }
    for (const [u, v] of edit.constrain ?? []) {
      if (!local.has(u) || !local.has(v)) return fail("constraint");
      if (!ringKeys.has(edgeKey(u, v))) kept.set(edgeKey(u, v), [u, v]);
    }
    for (const [u, v] of kept.values())
      constraints.push([local.get(u)!, local.get(v)!]);

    let del: Constrain["del"];
    try {
      const delaunay = Delaunator.from(ids.map((v) => at(v).forw));
      if (delaunay.triangles.length === 0) return fail("constraint");
      del = new Constrain(delaunay, constraints).del;
    } catch {
      return fail("constraint");
    }
    const { triangles, halfedges } = del;
    const count = triangles.length / 3;
    const coord = (i: number): Position => at(ids[i]).forw;

    // 4. R' を位相的に取り出す（輪の辺を越えずにたどれる三角形）
    // 局所の網の向きは、面積が最大の三角形で 1 回だけ決める（Delaunator の出力は向きがそろっている）
    let localSign = 0;
    let largest = 0;
    for (let t = 0; t < count; t++) {
      const p = coord(triangles[t * 3]),
        q = coord(triangles[t * 3 + 1]),
        r = coord(triangles[t * 3 + 2]);
      const area = doubleArea(p, q, r);
      if (area > largest) {
        const s = sign2(p, q, r);
        if (s !== 0) {
          largest = area;
          localSign = s;
        }
      }
    }
    if (localSign === 0) return fail("count");
    const halfedgeOf = new Map<number, number>();
    for (let e = 0; e < triangles.length; e++) {
      halfedgeOf.set(triangles[e] * ids.length + triangles[nextEdge(e)], e);
    }
    // 輪の辺 a → b の、内側の三角形の半辺。局所の網が正の向きなら a → b、逆なら b → a
    const ringHalfedges = new Set<number>();
    for (let i = 0; i < n; i++) {
      const a = i,
        b = (i + 1) % n;
      const e = halfedgeOf.get(
        localSign > 0 ? a * ids.length + b : b * ids.length + a
      );
      if (e === undefined) return fail("pointOutside");
      ringHalfedges.add(e);
    }
    const picked = new Set<number>();
    const queue: number[] = [];
    for (const e of ringHalfedges) {
      const t = Math.floor(e / 3);
      if (!picked.has(t)) {
        picked.add(t);
        queue.push(t);
      }
    }
    for (let i = 0; i < queue.length; i++) {
      for (let e = queue[i] * 3; e < queue[i] * 3 + 3; e++) {
        if (ringHalfedges.has(e)) continue;
        const adj = halfedges[e];
        // 輪以外の所で、局所の網の外周や、輪の外側へ漏れていない
        if (adj === -1 || ringHalfedges.has(adj)) return fail("pointOutside");
        const t = Math.floor(adj / 3);
        if (!picked.has(t)) {
          picked.add(t);
          queue.push(t);
        }
      }
    }
    // 輪の辺の、内側でない側の三角形は、R' に入っていない
    for (const e of ringHalfedges) {
      const adj = halfedges[e];
      if (adj !== -1 && picked.has(Math.floor(adj / 3)))
        return fail("pointOutside");
    }
    const fresh: Triangle[] = [];
    const used = new Set<number>();
    for (const t of picked) {
      const a = ids[triangles[t * 3]],
        b = ids[triangles[t * 3 + 1]],
        c = ids[triangles[t * 3 + 2]];
      used.add(a).add(b).add(c);
      fresh.push(localSign === this.forwSign ? [a, b, c] : [a, c, b]);
    }
    for (const v of inner) if (!used.has(v)) return fail("pointOutside");
    if (fresh.length !== n - 2 + 2 * inner.size) return fail("count");
    // 張った辺（必須エッジ・凸包の辺）が、R' の辺にある（S3）
    const freshKeys = new Set<number>();
    for (const [a, b, c] of fresh) {
      freshKeys.add(edgeKey(a, b)).add(edgeKey(b, c)).add(edgeKey(c, a));
    }
    for (const key of kept.keys())
      if (!freshKeys.has(key)) return fail("constraint");

    // 5. 新しい三角形が全部 okNew か（S1）
    for (const [a, b, c] of fresh)
      if (!this.okNew(a, b, c, at)) return fail("notStrict");

    // 6. 禁止制約の三角形が増えていないか（S4。群の表を引いて数える）
    let before = 0;
    for (const id of range) {
      const [a, b, c] = this.triangles.get(id)!;
      if (this.forbiddenGroup(a, b, c) !== undefined) before++;
    }
    let after = 0;
    for (const [a, b, c] of fresh)
      if (this.forbiddenGroup(a, b, c) !== undefined) after++;
    if (after > before) return fail("forbidden");

    // 7. 外周 ∂M（S2）。∂M の辺は三角形 1 つにしか属さないので、R の中にあれば必ず輪 ∂R の辺である。
    // 輪の辺と輪の頂点の座標は変えないので、円板の差し替えでは ∂M は変わらず、boundarySimple も変わらない。

    // 8. 差し替える
    for (const [v, position] of edit.move ?? []) {
      const vertex = this.vertices.get(v)!;
      vertex.forw = position.forw;
      vertex.bakw = position.bakw;
    }
    const removedIds = [...range];
    for (const id of removedIds) this.removeTriangle(id);
    const addedIds = fresh.map(([a, b, c]) => this.addTriangle(a, b, c));
    // R の内側にあった辺の属性: protect は外す。無くなった辺の属性は消す
    for (const key of interiorKeys) {
      const flags = (this.edgeFlags.get(key) ?? 0) & ~EDGE_PROTECT;
      if (flags && this.byEdge.has(key)) this.edgeFlags.set(key, flags);
      else this.edgeFlags.delete(key);
    }
    for (const [u, v, flag] of edit.constrain ?? []) this.setFlag(u, v, flag);
    for (const v of removed) this.dropVertex(v);
    this.revision++;
    return { ok: true, removed: removedIds, added: addedIds };
  }

  /**
   * 接続を変えずに、頂点の座標だけを変える（地理面だけの移動。設計書 §4.3）。星の三角形の `bad` を
   * 判定し直す。採ってよいかどうか（星の三角形が全部 okNew か）は、呼び出し側が先に確かめる。
   */
  relocate(vertex: number, forw: Position, bakw: Position): void {
    const target = this.vertices.get(vertex)!;
    target.forw = forw;
    target.bakw = bakw;
    for (const id of this.byVertex.get(vertex)!) {
      const [a, b, c] = this.triangles.get(id)!;
      if (this.ok(a, b, c)) this.bad.delete(id);
      else this.bad.add(id);
    }
    this.revision++;
  }

  // ── 外周 ──

  /** 網の外周 ∂M（対の無い辺）を、輪の頂点の列で取る。1 本の輪でなければ undefined。 */
  boundaryRing(): number[] | undefined {
    const next = new Map<number, number>();
    for (const [key, owners] of this.byEdge) {
      if (owners.length !== 1) continue;
      const tri = this.positive(owners[0]) ?? this.triangles.get(owners[0])!;
      for (let i = 0; i < 3; i++) {
        const u = tri[i],
          v = tri[(i + 1) % 3];
        if (edgeKey(u, v) !== key) continue;
        if (next.has(u)) return undefined;
        next.set(u, v);
      }
    }
    if (next.size < 3) return undefined;
    const start = next.keys().next().value as number;
    const ring = [start];
    for (let v = next.get(start)!; v !== start; v = next.get(v)!) {
      if (v === undefined || ring.length > next.size) return undefined;
      ring.push(v);
    }
    return ring.length === next.size ? ring : undefined;
  }

  /** 外周 ∂M が 1 本の輪で、両面とも単純な多角形か（S2）を計算し直す。 */
  computeBoundarySimple(): boolean {
    const ring = this.boundaryRing();
    if (!ring) return false;
    const n = ring.length;
    for (const plane of ["forw", "bakw"] as const) {
      const p = ring.map((v) => this.vertices.get(v)![plane]);
      for (let i = 0; i < n; i++) {
        const a = p[i],
          b = p[(i + 1) % n];
        // 隣の辺（頂点 b を共有）: 折り返して重なっていない
        const c = p[(i + 2) % n];
        if (
          sign2(a, b, c) === 0 &&
          (a[0] - b[0]) * (c[0] - b[0]) + (a[1] - b[1]) * (c[1] - b[1]) > 0
        )
          return false;
        // 隣でない辺: 触れもしない
        for (let j = i + 2; j < n; j++) {
          if (i === 0 && j === n - 1) continue;
          const d = p[j],
            e = p[(j + 1) % n];
          if (
            intersectSegments(a[0], a[1], b[0], b[1], d[0], d[1], e[0], e[1])
          )
            return false;
        }
      }
    }
    return true;
  }

  // ── 全部の数え直し（試験用。製品のコードは呼ばない） ──

  audit(): MeshAudit {
    const bad: number[] = [];
    let forbiddenBoundary = 0;
    let forbiddenEdge = 0;
    let forwArea = 0;
    let indexMatches = true;
    const edges = new Map<number, number>();
    for (const [id, [a, b, c]] of this.triangles) {
      if (!this.ok(a, b, c)) bad.push(id);
      const group = this.forbiddenGroup(a, b, c);
      if (group === BOUNDARY_GROUP) forbiddenBoundary++;
      else if (group !== undefined) forbiddenEdge++;
      forwArea +=
        doubleArea(
          this.vertices.get(a)!.forw,
          this.vertices.get(b)!.forw,
          this.vertices.get(c)!.forw
        ) / 2;
      for (const [u, v] of [
        [a, b],
        [b, c],
        [c, a]
      ]) {
        const key = edgeKey(u, v);
        edges.set(key, (edges.get(key) ?? 0) + 1);
        if (!this.byEdge.get(key)?.includes(id)) indexMatches = false;
        if (!this.byVertex.get(u)?.has(id)) indexMatches = false;
      }
    }
    let nonManifoldEdges = 0;
    for (const [key, uses] of edges) {
      if (uses > 2) nonManifoldEdges++;
      if (this.byEdge.get(key)?.length !== uses) indexMatches = false;
    }
    if (edges.size !== this.byEdge.size) indexMatches = false;
    let indexed = 0;
    for (const [v, owners] of this.byVertex) {
      if (!this.vertices.has(v)) indexMatches = false;
      indexed += owners.size;
    }
    if (indexed !== this.triangles.size * 3) indexMatches = false;
    let missingRequired = 0;
    for (const [key, flags] of this.edgeFlags) {
      if (flags & EDGE_REQUIRED && !this.byEdge.has(key)) missingRequired++;
    }
    return {
      triangles: this.triangles.size,
      bad,
      badMatches:
        bad.length === this.bad.size && bad.every((id) => this.bad.has(id)),
      indexMatches,
      nonManifoldEdges,
      boundarySimple: this.computeBoundarySimple(),
      missingRequired,
      forbiddenBoundary,
      forbiddenEdge,
      forbiddenMatches:
        forbiddenBoundary === this.forbiddenBoundary &&
        forbiddenEdge === this.forbiddenEdge,
      forwArea
    };
  }
}
