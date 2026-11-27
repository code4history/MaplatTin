/**
 * 局所更新の、内側の編集（MaplatTin#100 の第 1 段 a。設計書 §4.1・§4.4・§5.1 の update）。
 *
 * 最初の範囲 R0 を Delaunay の性質から決め、差し替え（`IncrementalMesh#replace`）が成り立たなければ
 * 範囲を 1 周ずつ広げる。回数の上限を超えたら失敗を返し、網は変えない（全部組み直しへ落とすのは呼び出し側）。
 *
 * 対応点の追加・削除・移動（必須エッジの端点を含む）、必須エッジの追加・削除、折れ点の差し替えを扱う。
 * 必須エッジに関わる編集は、その必須エッジの全部の区間と全部の中継点を、1 回の差し替えで同時に張り替える
 * （§4.4。途中の状態を網にしない）。
 *
 * 帯（補助頂点・重心）を更新しなくてよい条件（§6.3 の C1〜C7）を満たさない編集は "unsupported" を返す
 * （帯の差し替えは第 1 段 b）。座標は、網の内部の座標系（follow の反転は、呼び出し側で済ませる）。
 */
import type { Position } from "geojson";
import { incircle, orient2d } from "robust-predicates";
import { intersectSegments } from "../edgebound/base.ts";
import { interpolateEdgeNodes } from "../edge-nodes.ts";
import type { BandChange } from "./band.ts";
import {
  copyPosition,
  EDGE_HULL,
  EDGE_REQUIRED,
  edgeGroupOf,
  edgeKey,
  INCIRCLE_INSIDE,
  type EdgeId,
  type IncrementalMesh,
  type PointId,
  type ReplaceEdit,
  type ReplaceFailure,
  type VertexRef
} from "./mesh.ts";
import type { MeshEdge, MeshModel } from "./model.ts";

/** 範囲を広げる回数の上限。 */
export const MAX_GROW = 3;

export type EditFailure =
  | ReplaceFailure
  /** 局所更新の対象でない編集（帯に触れる・world file 外周の網、など） */
  | "unsupported"
  /** 同じ位置に、既に頂点がある */
  | "duplicate"
  | "unknownPoint"
  | "unknownEdge"
  | "idInUse";

/** 編集で変わった頂点。 */
export interface VertexChanges {
  /** 増えた頂点の id */
  added: number[];
  /** 消えた頂点の指し方 */
  removed: VertexRef[];
  /** 座標が変わった頂点の id */
  moved: number[];
}

export type EditResult =
  | {
      ok: true;
      /** "moved" は座標・辺の属性だけ（接続は変わらない）。"replaced" は範囲を差し替えた */
      mode: "moved" | "replaced";
      /** 消えた三角形・増えた三角形の id（磨きの分を含む） */
      removed: number[];
      added: number[];
      /** 範囲を広げた回数と、差し替えた範囲の三角形の数 */
      grown: number;
      size: number;
      /** 重なりの解消・禁止制約の解消・磨きで反転した辺の数 */
      flips: { overlap: number; forbidden: number; polish: number };
      vertices: VertexChanges;
    }
  | { ok: false; reason: EditFailure };

const fail = (reason: EditFailure): EditResult => ({ ok: false, reason });
const NO_FLIPS = { overlap: 0, forbidden: 0, polish: 0 };

const side = (p: Position, q: Position, r: Position): number =>
  orient2d(p[0], p[1], q[0], q[1], r[0], r[1]);

const samePosition = (a: Position, b: Position): boolean =>
  a[0] === b[0] && a[1] === b[1];

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
        if (inside * INCIRCLE_INSIDE > 0) {
          out.add(other);
          queue.push(other);
        }
      }
    }
  }
  return out;
}

/**
 * 線分 ab が触れる三角形（線分が通る三角形と、端点・途中の頂点で触れるだけの三角形）。
 * a を含む三角形から、線分に触れる三角形を辺づたいにたどる。a が網の外なら undefined。
 */
export function crossed(
  mesh: IncrementalMesh,
  a: Position,
  b: Position,
  hint: number
): Set<number> | undefined {
  const found = locate(mesh, a, hint);
  if (!found) return undefined;
  const forw = (vertex: number) => mesh.vertices.get(vertex)!.forw;
  const touches = (id: number): boolean => {
    const tri = mesh.triangles.get(id)!;
    for (let k = 0; k < 3; k++) {
      const p = forw(tri[k]),
        q = forw(tri[(k + 1) % 3]);
      if (intersectSegments(a[0], a[1], b[0], b[1], p[0], p[1], q[0], q[1]))
        return true;
    }
    return false;
  };
  const out = new Set([found.triangle]);
  const queue = [found.triangle];
  for (let i = 0; i < queue.length; i++) {
    const tri = mesh.triangles.get(queue[i])!;
    for (let k = 0; k < 3; k++) {
      for (const other of mesh.byEdge.get(edgeKey(tri[k], tri[(k + 1) % 3]))!) {
        if (out.has(other) || !touches(other)) continue;
        out.add(other);
        queue.push(other);
      }
    }
  }
  return out;
}

/** 編集の関数に共通の指定。 */
export interface EditOptions {
  /**
   * 帯を更新しなくてよい条件（§6.3）を見ない。当てた後に、呼び出し側が帯を差し替えること
   * （`refreshBand`）。帯に触れる編集を、「点の編集」と「帯の差し替え」の 2 回の差し替えで当てるときに使う。
   */
  force?: boolean;
}

/** 帯を更新しなくてよい編集かを判定する。よければ、当てた後に呼ぶ関数を返す。 */
function bandGate(
  model: MeshModel,
  changes: readonly BandChange[],
  options?: EditOptions
): (() => void) | undefined {
  if (options?.force) return () => model.resetBand();
  const band = model.band();
  const totals = band?.keeps(model, changes);
  if (!band || !totals) return undefined;
  return () => band.commit(totals);
}

/** 範囲を差し替える。成り立たなければ 1 周ずつ広げる。 */
function update(
  mesh: IncrementalMesh,
  start: Set<number>,
  edit: ReplaceEdit,
  vertices: VertexChanges
): EditResult {
  let range = start;
  // 失敗の理由は、最初の範囲 R0 でのもの（広げた後の理由は、広げた範囲の形に依る）
  let reason: ReplaceFailure | undefined;
  for (let grown = 0; grown <= MAX_GROW; grown++) {
    const result = mesh.replace(range, edit);
    if (result.ok) {
      return {
        ok: true,
        mode: "replaced",
        removed: result.removed,
        added: result.added,
        grown,
        size: range.size,
        flips: result.flips,
        vertices
      };
    }
    reason ??= result.reason;
    if (result.reason === "tooLarge") break;
    range = mesh.grow(range);
  }
  return fail(reason ?? "notDisk");
}

/** 張り替える必須エッジ。 */
interface EdgeSpec {
  edge: MeshEdge;
  /** 新しく足す必須エッジ（古い区間が無い） */
  fresh: boolean;
  /** 外す必須エッジ（新しい区間が無い） */
  drop: boolean;
  /** 張り替えた後の折れ点 */
  forwNodes: Position[];
  bakwNodes: Position[];
}

/**
 * 必須エッジの張り替えと、対応点の移動を、1 回の差し替えで行う（§4.4）。
 *
 * R0 = 動かす点の星 ∪ 張り替える必須エッジの、古い中継点の星・古い直線の区間の両側の三角形・
 *      新しい区間が触れる三角形 ∪（新しい位置が星の外なら）そこまでに通る三角形と空洞
 */
function reshape(
  model: MeshModel,
  specs: EdgeSpec[],
  move?: { vertex: number; forw: Position; bakw: Position },
  options?: EditOptions
): EditResult {
  const { mesh } = model;
  const at = (vertex: number) =>
    move && vertex === move.vertex ? move : mesh.vertices.get(vertex)!;
  const seeds = new Set<number>();
  const changes: BandChange[] = [];
  const removed: number[] = [];
  const release: [number, number][] = [];
  const hint = mesh.triangles.keys().next().value;
  if (hint === undefined) return fail("unsupported");

  if (move) {
    const star = mesh.star(move.vertex);
    if (star.size === 0) return fail("unsupported");
    changes.push({ vertex: move.vertex, to: move, gcp: true, counted: true });
    for (const t of star) seeds.add(t);
    const current = mesh.vertices.get(move.vertex)!;
    if (!samePosition(move.forw, current.forw)) {
      const found = locate(mesh, move.forw, star.values().next().value as number);
      if (!found) return fail("pointOutside");
      // ほかの頂点と同じ位置へは動かせない
      if (
        mesh.triangles
          .get(found.triangle)!
          .some((v) => v !== move.vertex && samePosition(mesh.vertices.get(v)!.forw, move.forw))
      )
        return fail("duplicate");
      if (!star.has(found.triangle)) {
        for (const t of found.path) seeds.add(t);
        for (const t of cavity(mesh, move.forw, found.triangle)) seeds.add(t);
      }
    }
  }

  // 動かす点に付く、中継点の無い必須エッジ: 新しい線分が触れる三角形を R0 に入れる（§4.4）
  if (move) {
    const retied = new Set(specs.map((spec) => spec.edge));
    for (const edge of model.edges) {
      if (retied.has(edge) || edge.nodes.length > 0) continue;
      if (edge.start !== move.vertex && edge.end !== move.vertex) continue;
      const other = edge.start === move.vertex ? edge.end : edge.start;
      const touched = crossed(mesh, mesh.vertices.get(other)!.forw, move.forw, hint);
      if (!touched) return fail("pointOutside");
      for (const t of touched) seeds.add(t);
    }
  }

  // 新しい中継点の位置と、新しい区間の列
  const layouts: { spec: EdgeSpec; nodes: [Position, Position][] }[] = [];
  for (const spec of specs) {
    const { edge } = spec;
    if (!spec.fresh) {
      const chain = [edge.start, ...edge.nodes, edge.end];
      for (let i = 0; i + 1 < chain.length; i++) release.push([chain[i], chain[i + 1]]);
      if (edge.nodes.length === 0) {
        for (const t of mesh.byEdge.get(edgeKey(edge.start, edge.end)) ?? []) seeds.add(t);
      }
      for (const node of edge.nodes) {
        for (const t of mesh.byVertex.get(node)!) seeds.add(t);
        removed.push(node);
        changes.push({ vertex: node, gcp: false, counted: true });
      }
    }
    if (spec.drop) continue;
    const start = at(edge.start),
      end = at(edge.end);
    const hasNodes = spec.forwNodes.length > 0 || spec.bakwNodes.length > 0;
    const nodes = hasNodes
      ? interpolateEdgeNodes(
          [start.forw, ...spec.forwNodes, end.forw],
          [start.bakw, ...spec.bakwNodes, end.bakw]
        ).map(([forw, bakw]): [Position, Position] => [forw, bakw])
      : [];
    // 折れ点があるのに中継点が 1 つも作れない入力は、全部組み直しでも必須エッジにならない。局所では扱わない
    if (hasNodes && nodes.length === 0) return fail("unsupported");
    // 折れ点は写して持つ（呼び出し側の配列を、網の中で持ち続けない）
    spec.forwNodes = spec.forwNodes.map(copyPosition);
    spec.bakwNodes = spec.bakwNodes.map(copyPosition);
    layouts.push({ spec, nodes });
    for (const [forw, bakw] of nodes) {
      changes.push({ to: { forw, bakw }, gcp: false, counted: true });
    }
    const line = [start.forw, ...nodes.map(([forw]) => forw), end.forw];
    for (let i = 0; i + 1 < line.length; i++) {
      const touched = crossed(mesh, line[i], line[i + 1], hint);
      if (!touched) return fail("pointOutside");
      for (const t of touched) seeds.add(t);
    }
  }

  // 帯を更新しなくてよい編集か（C1〜C7）
  const commitBand = bandGate(model, changes, options);
  if (!commitBand) return fail("unsupported");

  // 頂点と群を用意する（失敗したら戻す）
  const removedRefs = removed.map((vertex) => mesh.vertices.get(vertex)!.ref);
  const added: number[] = [];
  const constrain: [number, number, number][] = [];
  const grouped: { vertex: number; group: number }[] = [];
  const chains = new Map<EdgeSpec, number[]>();
  for (const { spec, nodes } of layouts) {
    const { edge } = spec;
    const group = edgeGroupOf(edge.id);
    if (spec.fresh) {
      for (const vertex of [edge.start, edge.end]) {
        const { groups } = mesh.vertices.get(vertex)!;
        if (!groups.includes(group)) {
          groups.push(group);
          grouped.push({ vertex, group });
        }
      }
    }
    const created = nodes.map(([forw, bakw], order) =>
      mesh.addVertex({ kind: "edgeNode", edge: edge.id, order }, forw, bakw, [group])
    );
    added.push(...created);
    chains.set(spec, created);
    const chain = [edge.start, ...created, edge.end];
    for (let i = 0; i + 1 < chain.length; i++) {
      constrain.push([chain[i], chain[i + 1], EDGE_REQUIRED]);
    }
  }
  const vertices: VertexChanges = {
    added,
    removed: removedRefs,
    moved: move ? [move.vertex] : []
  };

  let result: EditResult;
  if (seeds.size === 0) {
    // 三角形が変わらない（張る辺が、既に網の辺にある）。印を付け替えるだけ
    if (!constrain.every(([u, v]) => mesh.hasEdge(u, v))) {
      result = fail("constraint");
    } else {
      for (const [u, v] of release) mesh.clearFlag(u, v, EDGE_REQUIRED);
      for (const [u, v, flag] of constrain) mesh.setFlag(u, v, flag);
      mesh.revision++;
      result = { ok: true, mode: "moved", removed: [], added: [], grown: 0, size: 0, flips: NO_FLIPS, vertices };
    }
  } else {
    result = update(
      mesh,
      seeds,
      {
        move: move ? new Map([[move.vertex, { forw: move.forw, bakw: move.bakw }]]) : undefined,
        add: added,
        remove: removed,
        release,
        constrain
      },
      vertices
    );
  }
  if (!result.ok) {
    for (const vertex of added) mesh.dropVertex(vertex);
    for (const { vertex, group } of grouped) {
      const { groups } = mesh.vertices.get(vertex)!;
      groups.splice(groups.indexOf(group), 1);
    }
    return result;
  }
  commitBand();
  for (const spec of specs) {
    const { edge } = spec;
    if (spec.drop) {
      // 端点の群を外す（中継点は消えたので、この群だけの三角形はもう無い）
      const group = edgeGroupOf(edge.id);
      for (const vertex of [edge.start, edge.end]) {
        const { groups } = mesh.vertices.get(vertex)!;
        const index = groups.indexOf(group);
        if (index !== -1) groups.splice(index, 1);
      }
      edge.nodes = [];
      continue;
    }
    edge.nodes = chains.get(spec)!;
    edge.forwNodes = spec.forwNodes;
    edge.bakwNodes = spec.bakwNodes;
  }
  return result;
}

/**
 * 対応点を動かす。
 *
 * - 中継点のある必須エッジの端点は、その必須エッジの中継点が全部動く（片方の面だけを動かした場合も）。
 *   付いている必須エッジの全部を、1 回の差し替えで同時に張り替える（§4.4）。
 * - それ以外で、紙の面が変わらなければ、接続を変えずに星の三角形を判定し直す（§4.3）。
 */
export function movePoint(
  model: MeshModel,
  id: PointId,
  to: { forw?: Position; bakw?: Position },
  options?: EditOptions
): EditResult {
  const { mesh } = model;
  const vertex = model.pointVertex.get(id);
  if (vertex === undefined) return fail("unknownPoint");
  const current = mesh.vertices.get(vertex)!;
  const forw = copyPosition(to.forw ?? current.forw);
  const bakw = copyPosition(to.bakw ?? current.bakw);
  const attached = model.edges.filter(
    (edge) => edge.start === vertex || edge.end === vertex
  );
  const specs = attached
    .filter((edge) => edge.nodes.length > 0)
    .map(
      (edge): EdgeSpec => ({
        edge,
        fresh: false,
        drop: false,
        forwNodes: edge.forwNodes,
        bakwNodes: edge.bakwNodes
      })
    );
  if (specs.length === 0 && samePosition(forw, current.forw)) {
    const commitBand = bandGate(
      model,
      [{ vertex, to: { forw, bakw }, gcp: true, counted: true }],
      options
    );
    if (!commitBand) return fail("unsupported");
    const star = mesh.star(vertex);
    if (star.size === 0) return fail("unsupported");
    const at = (v: number) =>
      v === vertex ? { ...current, bakw } : mesh.vertices.get(v)!;
    const keeps = [...star].every((t) => {
      const [a, b, c] = mesh.triangles.get(t)!;
      return mesh.okNew(a, b, c, at);
    });
    if (keeps) {
      mesh.relocate(vertex, forw, bakw);
      commitBand();
      return {
        ok: true,
        mode: "moved",
        removed: [],
        added: [],
        grown: 0,
        size: star.size,
        flips: NO_FLIPS,
        vertices: { added: [], removed: [], moved: [vertex] }
      };
    }
  }
  return reshape(model, specs, { vertex, forw, bakw }, options);
}

/** 対応点を足す。R0 は、点の空洞。 */
export function insertPoint(
  model: MeshModel,
  id: PointId,
  forw: Position,
  bakw: Position,
  position?: number,
  options?: EditOptions
): EditResult {
  const { mesh } = model;
  if (model.pointVertex.has(id)) return fail("idInUse");
  const hint = mesh.triangles.keys().next().value;
  if (hint === undefined) return fail("unsupported");
  const commitBand = bandGate(
    model,
    [{ to: { forw, bakw }, gcp: true, counted: true }],
    options
  );
  if (!commitBand) return fail("unsupported");
  const found = locate(mesh, forw, hint);
  if (!found) return fail("pointOutside");
  const corners = mesh.triangles.get(found.triangle)!;
  if (corners.some((v) => samePosition(mesh.vertices.get(v)!.forw, forw)))
    return fail("duplicate");
  const vertex = mesh.addVertex({ kind: "gcp", id }, forw, bakw);
  const result = update(
    mesh,
    cavity(mesh, forw, found.triangle),
    { add: [vertex] },
    { added: [vertex], removed: [], moved: [] }
  );
  if (!result.ok) {
    mesh.dropVertex(vertex);
    return result;
  }
  commitBand();
  model.gcps.splice(position ?? model.gcps.length, 0, vertex);
  model.pointVertex.set(id, vertex);
  return result;
}

/** 対応点を消す。R0 は、点の星。必須エッジの端点は、先に必須エッジを外すこと。 */
export function removePoint(
  model: MeshModel,
  id: PointId,
  options?: EditOptions
): EditResult {
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
  const commitBand = bandGate(
    model,
    [{ vertex, gcp: true, counted: true }],
    options
  );
  if (!commitBand) return fail("unsupported");
  const star = mesh.star(vertex);
  if (star.size === 0) return fail("unsupported");
  const ref = mesh.vertices.get(vertex)!.ref;
  const result = update(
    mesh,
    star,
    { remove: [vertex] },
    { added: [], removed: [ref], moved: [] }
  );
  if (!result.ok) return result;
  commitBand();
  model.gcps.splice(model.gcps.indexOf(vertex), 1);
  model.pointVertex.delete(id);
  return result;
}

/**
 * 必須エッジを足す。R0 は、新しい区間が触れる三角形（線分が既に網の辺なら、印を付けるだけ）。
 * 折れ点があれば、両面の折れ線を累積長の比で突き合わせて、中継点を作る。
 */
export function insertEdge(
  model: MeshModel,
  id: EdgeId,
  start: PointId,
  end: PointId,
  forwNodes: Position[] = [],
  bakwNodes: Position[] = [],
  position?: number,
  options?: EditOptions
): EditResult {
  if (model.edges.some((edge) => edge.id === id)) return fail("idInUse");
  const from = model.pointVertex.get(start);
  const to = model.pointVertex.get(end);
  if (from === undefined || to === undefined || from === to)
    return fail("unknownPoint");
  const edge: MeshEdge = {
    id, start: from, end: to, forwNodes: forwNodes.map(copyPosition), bakwNodes: bakwNodes.map(copyPosition), nodes: []
  };
  const result = reshape(
    model,
    [{ edge, fresh: true, drop: false, forwNodes, bakwNodes }],
    undefined,
    options
  );
  if (result.ok) model.edges.splice(position ?? model.edges.length, 0, edge);
  return result;
}

/** 必須エッジを外す。中継点は消える。R0 は、中継点の星（直線なら、辺の両側の 2 つの三角形）。 */
export function removeEdge(
  model: MeshModel,
  id: EdgeId,
  options?: EditOptions
): EditResult {
  const edge = model.edges.find((item) => item.id === id);
  if (!edge) return fail("unknownEdge");
  const result = reshape(
    model,
    [{ edge, fresh: false, drop: true, forwNodes: [], bakwNodes: [] }],
    undefined,
    options
  );
  if (result.ok) model.edges.splice(model.edges.indexOf(edge), 1);
  return result;
}

/** 必須エッジの折れ点を差し替える（足す・消す・動かす）。全部の区間と全部の中継点を張り替える。 */
export function replaceEdgeNodes(
  model: MeshModel,
  id: EdgeId,
  forwNodes: Position[],
  bakwNodes: Position[],
  options?: EditOptions
): EditResult {
  const edge = model.edges.find((item) => item.id === id);
  if (!edge) return fail("unknownEdge");
  return reshape(
    model,
    [{ edge, fresh: false, drop: false, forwNodes, bakwNodes }],
    undefined,
    options
  );
}
