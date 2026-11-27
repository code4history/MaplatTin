/**
 * 編集の列を、入力（対応点・必須エッジ）と、局所更新の網に当てる（MaplatTin#100 の第 2 段 a。設計書 §9.2）。
 */
import type { Position } from "geojson";
import type { EdgeSet, PointSet } from "@maplat/transform";
import {
  insertEdge,
  insertPoint,
  movePoint,
  removeEdge,
  removePoint,
  replaceEdgeNodes,
  type EditFailure,
  type EditResult
} from "./edits.ts";
import type { EdgeId, PointId, VertexRef } from "./mesh.ts";
import type { MeshModel } from "./model.ts";
import type { TinEdit, TinPatch, TinPatchFallback } from "./types.ts";

/** 対応点と必須エッジ（座標は内部の座標系）と、その id の並び。 */
export interface TinInputs {
  points: PointSet[];
  edges: EdgeSet[];
  pointIds: PointId[];
  edgeIds: EdgeId[];
}

/** 外の座標系の地理面の座標を、内部の座標系へ（`setPoints` と同じ規則。follow では Y を反転する）。 */
const inward = (bakw: Position, follow: boolean): Position =>
  follow ? [bakw[0], -1 * bakw[1]] : bakw;

/**
 * 編集を入力に当てた結果を返す（もとの入力は変えない）。id が無い・既に使われている、などの
 * 当てられない編集は、何も変えずに例外を投げる。
 */
export function applyToInputs(
  inputs: TinInputs,
  edits: readonly TinEdit[],
  follow: boolean
): TinInputs {
  const points = inputs.points.slice();
  const pointIds = inputs.pointIds.slice();
  // 必須エッジの端点は、対応点の id で持って編集し、最後に添字へ戻す
  const edges = inputs.edges.map(
    ([forwNodes, bakwNodes, [start, end]]) =>
      ({ forwNodes, bakwNodes, start: inputs.pointIds[start], end: inputs.pointIds[end] })
  );
  const edgeIds = inputs.edgeIds.slice();
  const pointAt = (id: PointId): number => {
    const index = pointIds.indexOf(id);
    if (index === -1) throw new Error(`applyEdits: 対応点 ${id} がありません`);
    return index;
  };
  const edgeAt = (id: EdgeId): number => {
    const index = edgeIds.indexOf(id);
    if (index === -1) throw new Error(`applyEdits: 必須エッジ ${id} がありません`);
    return index;
  };
  const insertAt = (position: number | undefined, length: number): number => {
    if (position === undefined) return length;
    if (!Number.isInteger(position) || position < 0 || position > length) {
      throw new Error(`applyEdits: position ${position} が範囲の外です`);
    }
    return position;
  };
  const finite = (...positions: Position[]) => {
    for (const position of positions) {
      if (!Array.isArray(position) || !Number.isFinite(position[0]) || !Number.isFinite(position[1])) {
        throw new Error("applyEdits: 座標が有限の数ではありません");
      }
    }
  };
  for (const edit of edits) {
    switch (edit.type) {
      case "addPoint": {
        if (!Number.isInteger(edit.id) || pointIds.includes(edit.id)) {
          throw new Error(`applyEdits: 対応点の id ${edit.id} は使えません`);
        }
        finite(edit.forw, edit.bakw);
        const at = insertAt(edit.position, points.length);
        points.splice(at, 0, [edit.forw, inward(edit.bakw, follow)]);
        pointIds.splice(at, 0, edit.id);
        break;
      }
      case "removePoint": {
        const at = pointAt(edit.id);
        if (edges.some((edge) => edge.start === edit.id || edge.end === edit.id)) {
          throw new Error(`applyEdits: 対応点 ${edit.id} は必須エッジの端点です（先に必須エッジを外してください）`);
        }
        points.splice(at, 1);
        pointIds.splice(at, 1);
        break;
      }
      case "movePoint": {
        const at = pointAt(edit.id);
        if (edit.forw) finite(edit.forw);
        if (edit.bakw) finite(edit.bakw);
        points[at] = [
          edit.forw ?? points[at][0],
          edit.bakw ? inward(edit.bakw, follow) : points[at][1]
        ];
        break;
      }
      case "addEdge": {
        if (!Number.isInteger(edit.id) || edgeIds.includes(edit.id)) {
          throw new Error(`applyEdits: 必須エッジの id ${edit.id} は使えません`);
        }
        pointAt(edit.start);
        pointAt(edit.end);
        if (edit.start === edit.end) throw new Error("applyEdits: 必須エッジの両端が同じ対応点です");
        finite(...edit.forwNodes, ...edit.bakwNodes);
        const at = insertAt(edit.position, edges.length);
        // 折れ点は、setEdges と同じく、反転しない
        edges.splice(at, 0, { forwNodes: edit.forwNodes, bakwNodes: edit.bakwNodes, start: edit.start, end: edit.end });
        edgeIds.splice(at, 0, edit.id);
        break;
      }
      case "removeEdge": {
        const at = edgeAt(edit.id);
        edges.splice(at, 1);
        edgeIds.splice(at, 1);
        break;
      }
      case "replaceEdgeNodes": {
        const at = edgeAt(edit.id);
        finite(...edit.forwNodes, ...edit.bakwNodes);
        edges[at] = { ...edges[at], forwNodes: edit.forwNodes, bakwNodes: edit.bakwNodes };
        break;
      }
      default:
        throw new Error(`applyEdits: 編集の種類 ${(edit as { type: string }).type} は扱えません`);
    }
  }
  const indexOf = new Map(pointIds.map((id, index) => [id, index]));
  return {
    points,
    pointIds,
    edges: edges.map((edge): EdgeSet => [
      edge.forwNodes,
      edge.bakwNodes,
      [indexOf.get(edge.start)!, indexOf.get(edge.end)!]
    ]),
    edgeIds
  };
}

const fallbackOf = (reason: EditFailure): TinPatchFallback =>
  reason === "duplicate" || reason === "unknownPoint" || reason === "unknownEdge" || reason === "idInUse"
    ? "unsupported"
    : reason;

/**
 * 編集の列を、網に順に当てる。1 つでも局所で済まなければ、理由を返す（網は途中まで変わっているので、
 * 呼び出し側は網を捨てて全部組み直す）。全部が済めば、差分を返す。
 *
 * 編集 1 つは、それに関わる必須エッジの区間と中継点を、1 回の差し替えで同時に張り替える（途中の状態を
 * 網にしない）。編集どうしは、順に当てる（どの時点の網も、その時点までの入力の strict な網である）。
 */
export function applyToMesh(
  model: MeshModel,
  edits: readonly TinEdit[],
  follow: boolean
): { ok: true; patch: Omit<TinPatch, "revision" | "mode" | "boundaryStale"> } | { ok: false; reason: TinPatchFallback } {
  const { mesh } = model;
  const badBefore = [...mesh.bad].sort((a, b) => a - b);
  const removedTriangles = new Set<number>();
  const addedTriangles = new Set<number>();
  const refKey = (ref: VertexRef) => JSON.stringify(ref);
  const removedRefs = new Map<string, VertexRef>();
  const addedVertices = new Set<number>();
  const movedVertices = new Set<number>();
  for (const edit of edits) {
    let result: EditResult;
    switch (edit.type) {
      case "addPoint":
        result = insertPoint(model, edit.id, edit.forw, inward(edit.bakw, follow), edit.position);
        break;
      case "removePoint":
        result = removePoint(model, edit.id);
        break;
      case "movePoint":
        result = movePoint(model, edit.id, {
          forw: edit.forw,
          bakw: edit.bakw ? inward(edit.bakw, follow) : undefined
        });
        break;
      case "addEdge":
        result = insertEdge(model, edit.id, edit.start, edit.end, edit.forwNodes, edit.bakwNodes, edit.position);
        break;
      case "removeEdge":
        result = removeEdge(model, edit.id);
        break;
      case "replaceEdgeNodes":
        result = replaceEdgeNodes(model, edit.id, edit.forwNodes, edit.bakwNodes);
        break;
    }
    if (!result.ok) return { ok: false, reason: fallbackOf(result.reason) };
    for (const id of result.removed) {
      if (!addedTriangles.delete(id)) removedTriangles.add(id);
    }
    for (const id of result.added) addedTriangles.add(id);
    for (const ref of result.vertices.removed) removedRefs.set(refKey(ref), ref);
    for (const vertex of result.vertices.added) addedVertices.add(vertex);
    for (const vertex of result.vertices.moved) movedVertices.add(vertex);
  }

  // 頂点の差分。同じ指し方（VertexRef）で消えて増えた頂点は、座標が変わった頂点として返す
  const moved = new Map<string, { ref: VertexRef; forw: Position; bakw: Position }>();
  const added: { ref: VertexRef; forw: Position; bakw: Position }[] = [];
  for (const vertex of movedVertices) {
    const item = mesh.vertices.get(vertex);
    if (item && !addedVertices.has(vertex)) moved.set(refKey(item.ref), { ref: item.ref, forw: item.forw, bakw: item.bakw });
  }
  for (const vertex of addedVertices) {
    const item = mesh.vertices.get(vertex);
    // 足した後に、同じ呼び出しの中で消えた頂点
    if (!item) continue;
    const key = refKey(item.ref);
    const entry = { ref: item.ref, forw: item.forw, bakw: item.bakw };
    if (removedRefs.delete(key)) moved.set(key, entry);
    else added.push(entry);
  }
  // 消えた頂点のうち、今は無いもの（指し方が同じ頂点が残っていれば、上で moved にした）
  const alive = new Set<string>();
  for (const key of removedRefs.keys()) {
    if (moved.has(key)) alive.add(key);
  }
  for (const key of alive) removedRefs.delete(key);

  let dirty: [number, number, number, number] | undefined;
  const grow = (forw: Position) => {
    dirty = dirty
      ? [Math.min(dirty[0], forw[0]), Math.min(dirty[1], forw[1]), Math.max(dirty[2], forw[0]), Math.max(dirty[3], forw[1])]
      : [forw[0], forw[1], forw[0], forw[1]];
  };
  const triangles: NonNullable<TinPatch["addedTriangles"]> = [];
  for (const id of addedTriangles) {
    const triangle = mesh.triangles.get(id);
    if (!triangle) continue;
    const refs = triangle.map((vertex) => {
      const item = mesh.vertices.get(vertex)!;
      grow(item.forw);
      return item.ref;
    }) as [VertexRef, VertexRef, VertexRef];
    triangles.push({ id, vertices: refs });
  }
  for (const { forw } of moved.values()) grow(forw);

  const badAfter = [...mesh.bad].sort((a, b) => a - b);
  const badChanged = badAfter.length !== badBefore.length || badAfter.some((id, i) => id !== badBefore[i]);
  return {
    ok: true,
    patch: {
      strict_status: mesh.isStrict() ? "strict" : "strict_error",
      ...(moved.size > 0 ? { movedVertices: [...moved.values()] } : {}),
      ...(removedRefs.size > 0 ? { removedVertices: [...removedRefs.values()] } : {}),
      ...(added.length > 0 ? { addedVertices: added } : {}),
      removedTriangles: [...removedTriangles],
      addedTriangles: triangles,
      ...(badChanged ? { badTriangles: badAfter } : {}),
      ...(dirty ? { dirtyBounds: dirty } : {})
    }
  };
}
