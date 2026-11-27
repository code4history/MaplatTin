/**
 * 局所更新の、内側の点の編集（MaplatTin#100 の第 1 段 a。設計書 §4.1・§5.1 の update）。
 *
 * 最初の範囲 R0 を Delaunay の性質から決め、差し替え（`IncrementalMesh#replace`）が成り立たなければ
 * 範囲を 1 周ずつ広げる。回数の上限を超えたら失敗を返し、網は変えない（全部組み直しへ落とすのは呼び出し側）。
 *
 * 第 1 週に入っているのは、凸包の内側の対応点の追加・削除・移動だけである。次の編集は "unsupported" を返す
 * （第 2 週以降）: 中継点のある必須エッジの端点の移動（§4.4）・必須エッジの端点の削除・凸包の頂点と
 * 帯に触れる編集（§6.2）。座標は、網の内部の座標系（follow の反転は、呼び出し側で済ませる）。
 */
import type { Position } from "geojson";
import { incircle, orient2d } from "robust-predicates";
import {
  EDGE_HULL,
  EDGE_REQUIRED,
  edgeKey,
  type IncrementalMesh,
  type PointId,
  type ReplaceEdit,
  type ReplaceFailure
} from "./mesh.ts";
import type { MeshModel } from "./model.ts";

/** 範囲を広げる回数の上限。 */
export const MAX_GROW = 3;

export type EditFailure =
  | ReplaceFailure
  /** 第 1 週の対象でない編集 */
  | "unsupported"
  /** 同じ位置に、既に頂点がある */
  | "duplicate"
  | "unknownPoint"
  | "idInUse";

export type EditResult =
  | {
      ok: true;
      /** "moved" は座標だけ（接続は変わらない）。"replaced" は範囲を差し替えた */
      mode: "moved" | "replaced";
      removed: number[];
      added: number[];
      /** 範囲を広げた回数と、差し替えた範囲の三角形の数 */
      grown: number;
      size: number;
    }
  | { ok: false; reason: EditFailure };

const fail = (reason: EditFailure): EditResult => ({ ok: false, reason });

// 紙の面で正の向き（orient2d > 0）の三角形について、点が外接円の内側にあるときの incircle の符号
const INSIDE = Math.sign(
  incircle(0, 0, 1, 0, 0, 1, 0.25, 0.25) * orient2d(0, 0, 1, 0, 0, 1)
);

const side = (p: Position, q: Position, r: Position): number =>
  orient2d(p[0], p[1], q[0], q[1], r[0], r[1]);

/** 点を含む三角形を、近くの三角形から歩いて探す。途中で通った三角形も返す。網の外なら undefined。 */
export function locate(
  mesh: IncrementalMesh,
  point: Position,
  hint: number
): { triangle: number; path: number[] } | undefined {
  const forw = (vertex: number) => mesh.vertices.get(vertex)!.forw;
  const contains = (id: number): boolean => {
    const tri = mesh.positive(id);
    return (
      tri !== undefined &&
      tri.every((u, i) => side(forw(u), forw(tri[(i + 1) % 3]), point) >= 0)
    );
  };
  const path = [hint];
  let current = hint;
  for (let steps = 0; steps <= mesh.triangles.size; steps++) {
    const tri = mesh.positive(current);
    if (!tri) break;
    let next: number | undefined;
    let exits = false;
    for (let i = 0; i < 3 && next === undefined; i++) {
      const u = tri[i],
        v = tri[(i + 1) % 3];
      if (side(forw(u), forw(v), point) >= 0) continue;
      exits = true;
      next = mesh.byEdge.get(edgeKey(u, v))!.find((id) => id !== current);
    }
    if (!exits) return { triangle: current, path };
    // 外周に突き当たった。網が凸でない所では、内側にあることがあるので、総当たりで確かめる
    if (next === undefined) break;
    current = next;
    path.push(current);
  }
  for (const id of mesh.triangles.keys()) {
    if (contains(id)) return { triangle: id, path: [id] };
  }
  return undefined;
}

/**
 * 点を足したときに壊れる三角形（空洞）: 点を含む三角形から、制約の辺（必須エッジ・凸包の辺）を越えずに
 * たどれる三角形のうち、外接円が点を含むもの。
 */
export function cavity(
  mesh: IncrementalMesh,
  point: Position,
  start: number
): Set<number> {
  const forw = (vertex: number) => mesh.vertices.get(vertex)!.forw;
  const out = new Set([start]);
  const queue = [start];
  for (let i = 0; i < queue.length; i++) {
    const tri = mesh.triangles.get(queue[i])!;
    for (let k = 0; k < 3; k++) {
      const key = edgeKey(tri[k], tri[(k + 1) % 3]);
      if ((mesh.edgeFlags.get(key) ?? 0) & (EDGE_REQUIRED | EDGE_HULL)) continue;
      for (const other of mesh.byEdge.get(key)!) {
        if (out.has(other)) continue;
        const positive = mesh.positive(other);
        if (!positive) continue;
        const [a, b, c] = positive.map(forw);
        const inside = incircle(
          a[0], a[1], b[0], b[1], c[0], c[1], point[0], point[1]
        );
        if (inside * INSIDE > 0) {
          out.add(other);
          queue.push(other);
        }
      }
    }
  }
  return out;
}

/** 範囲を差し替える。成り立たなければ 1 周ずつ広げる。 */
function update(
  mesh: IncrementalMesh,
  start: Set<number>,
  edit: ReplaceEdit
): EditResult {
  let range = start;
  let reason: ReplaceFailure = "notDisk";
  for (let grown = 0; grown <= MAX_GROW; grown++) {
    const result = mesh.replace(range, edit);
    if (result.ok) {
      return {
        ok: true,
        mode: "replaced",
        removed: result.removed,
        added: result.added,
        grown,
        size: range.size
      };
    }
    reason = result.reason;
    if (reason === "tooLarge") break;
    range = mesh.grow(range);
  }
  return fail(reason);
}

/** 頂点が、網の外周か、凸包の辺か、補助頂点を含む三角形（帯）に触れているか。 */
function touchesBand(mesh: IncrementalMesh, vertex: number): boolean {
  for (const id of mesh.byVertex.get(vertex)!) {
    const tri = mesh.triangles.get(id)!;
    for (let i = 0; i < 3; i++) {
      const u = tri[i],
        v = tri[(i + 1) % 3];
      if (mesh.vertices.get(u)!.ref.kind === "boundary") return true;
      if (u !== vertex && v !== vertex) continue;
      const key = edgeKey(u, v);
      if (mesh.byEdge.get(key)!.length === 1) return true;
      if ((mesh.edgeFlags.get(key) ?? 0) & EDGE_HULL) return true;
    }
  }
  return false;
}

const hasBoundaryVertex = (mesh: IncrementalMesh, triangle: number): boolean =>
  mesh.triangles
    .get(triangle)!
    .some((vertex) => mesh.vertices.get(vertex)!.ref.kind === "boundary");

const samePosition = (a: Position, b: Position): boolean =>
  a[0] === b[0] && a[1] === b[1];

/**
 * 対応点を動かす。紙の面が変わらなければ、接続を変えずに星の三角形を判定し直す（§4.3）。
 * 変わるなら、R0 = 星 ∪（新しい位置が星の外なら）そこまでに通る三角形 ∪ 新しい位置の空洞。
 */
export function movePoint(
  model: MeshModel,
  id: PointId,
  to: { forw?: Position; bakw?: Position }
): EditResult {
  const { mesh } = model;
  const vertex = model.pointVertex.get(id);
  if (vertex === undefined) return fail("unknownPoint");
  const current = mesh.vertices.get(vertex)!;
  const forw = to.forw ?? current.forw;
  const bakw = to.bakw ?? current.bakw;
  // 中継点のある必須エッジの端点は、中継点が全部動く（§4.4。第 2 週）
  if (
    model.edges.some(
      (edge) =>
        (edge.start === vertex || edge.end === vertex) && edge.nodes.length > 0
    )
  )
    return fail("unsupported");
  if (touchesBand(mesh, vertex)) return fail("unsupported");
  const star = mesh.star(vertex);
  if (star.size === 0) return fail("unsupported");
  const move = new Map([[vertex, { forw, bakw }]]);

  let range = star;
  if (samePosition(forw, current.forw)) {
    const at = (v: number) =>
      v === vertex ? { ...current, bakw } : mesh.vertices.get(v)!;
    const keeps = [...star].every((t) => {
      const [a, b, c] = mesh.triangles.get(t)!;
      return mesh.okNew(a, b, c, at);
    });
    if (keeps) {
      mesh.relocate(vertex, forw, bakw);
      return {
        ok: true,
        mode: "moved",
        removed: [],
        added: [],
        grown: 0,
        size: star.size
      };
    }
  } else {
    const found = locate(mesh, forw, star.values().next().value as number);
    if (!found) return fail("pointOutside");
    if (hasBoundaryVertex(mesh, found.triangle)) return fail("unsupported");
    if (!star.has(found.triangle)) {
      range = new Set(star);
      for (const t of found.path) range.add(t);
      for (const t of cavity(mesh, forw, found.triangle)) range.add(t);
    }
  }
  return update(mesh, range, { move });
}

/** 対応点を足す。R0 は、点の空洞。 */
export function insertPoint(
  model: MeshModel,
  id: PointId,
  forw: Position,
  bakw: Position,
  position?: number
): EditResult {
  const { mesh } = model;
  if (model.pointVertex.has(id)) return fail("idInUse");
  const hint = mesh.triangles.keys().next().value;
  if (hint === undefined) return fail("unsupported");
  const found = locate(mesh, forw, hint);
  if (!found) return fail("pointOutside");
  const corners = mesh.triangles.get(found.triangle)!;
  if (corners.some((v) => samePosition(mesh.vertices.get(v)!.forw, forw)))
    return fail("duplicate");
  if (hasBoundaryVertex(mesh, found.triangle)) return fail("unsupported");
  const vertex = mesh.addVertex({ kind: "gcp", id }, forw, bakw);
  const result = update(mesh, cavity(mesh, forw, found.triangle), {
    add: [vertex]
  });
  if (!result.ok) {
    mesh.dropVertex(vertex);
    return result;
  }
  model.gcps.splice(position ?? model.gcps.length, 0, vertex);
  model.pointVertex.set(id, vertex);
  return result;
}

/** 対応点を消す。R0 は、点の星。必須エッジの端点は、先に必須エッジを外す（第 2 週）。 */
export function removePoint(model: MeshModel, id: PointId): EditResult {
  const { mesh } = model;
  const vertex = model.pointVertex.get(id);
  if (vertex === undefined) return fail("unknownPoint");
  if (model.edges.some((edge) => edge.start === vertex || edge.end === vertex))
    return fail("unsupported");
  if (
    model.supplements.some(
      (supplement) =>
        supplement.edge.includes(vertex) || supplement.anchor === vertex
    )
  )
    return fail("unsupported");
  if (touchesBand(mesh, vertex)) return fail("unsupported");
  const star = mesh.star(vertex);
  if (star.size === 0) return fail("unsupported");
  const result = update(mesh, star, { remove: [vertex] });
  if (!result.ok) return result;
  model.gcps.splice(model.gcps.indexOf(vertex), 1);
  model.pointVertex.delete(id);
  return result;
}
