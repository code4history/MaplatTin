/**
 * 全部組み直しの中の、組み直しの繰り返しを、網への局所の操作に置き換えるための部品
 * （MaplatTin#100 の第 1 段 b。設計書 §6.2・§8.2）。
 *
 * - 最初の 1 回だけ、今の手順で三角網を組み、その結果を網へ取り込む（{@link buildMeshFromTins}）。
 * - 2 回目からの試行（外す凸包の辺・補完点・補助頂点の輪が違う）は、取り込んだ網を複製して、
 *   帯（補助頂点を含む三角形）だけを差し替える（{@link replaceBand}）。内側の網は、そのまま使う。
 * - 試行の結果は、今の解析（strict を壊す凸包の辺・補完点の置き場所・strict を壊す補助頂点）が読める形
 *   （GeoJSON の三角網）へ書き出す（{@link tinsFromMesh}）。
 */
import type { Feature, Point, Position } from "geojson";
import type { Edge, Tins, Tri } from "@maplat/transform";
import { orient2d } from "robust-predicates";
import type { VertexPosition } from "../types/tin.ts";
import {
  BOUNDARY_GROUP,
  EDGE_HULL,
  EDGE_REQUIRED,
  edgeKey,
  IncrementalMesh,
  type ReplaceEdit,
  type ReplaceFailure
} from "./mesh.ts";

type VertexIndex = number | string;

/** 全部組み直しの途中の網と、compiled の番号との対応。 */
export interface BuildMesh {
  mesh: IncrementalMesh;
  /** 頂点の id → 番号（対応点は数、中継点・補完点は `e{n}`、補助頂点は `b{n}`） */
  indexOf: Map<number, VertexIndex>;
  /** 内側の点（対応点・中継点・補完点）の頂点の id。点群の配列位置の順 */
  interior: number[];
  /** 補助頂点の頂点の id（輪の中の順） */
  ring: number[];
}

const sign2 = (p: Position, q: Position, r: Position): number =>
  Math.sign(orient2d(p[0], p[1], q[0], q[1], r[0], r[1]));

/**
 * 今の手順で組んだ三角網（紙の面）から、網を作る。
 *
 * @param points 点群（内側の点の後ろに補助頂点。`pointsSet.forw.features`）
 * @param tins 紙の面の三角網
 * @param segments 必須エッジの区間（点群の配列位置の組）
 * @param gcpCount 対応点の数
 * @param sigma 網の向き。全部の三角形の多数決と合わなければ undefined を返す
 */
export function buildMeshFromTins(
  points: readonly Feature<Point>[],
  tins: Tins,
  segments: readonly Edge[],
  gcpCount: number,
  sigma: -1 | 1
): BuildMesh | undefined {
  const at = new Map<VertexIndex, { forw: Position; bakw: Position }>();
  for (const feature of points) {
    const { index, geom } = feature.properties!.target;
    at.set(index, { forw: feature.geometry.coordinates, bakw: geom });
  }
  let product = 0;
  let forwSum = 0;
  for (const tri of tins.features) {
    const { a, b, c } = tri.properties!;
    const [p, q, r] = [a, b, c].map(({ index }) => at.get(index));
    if (!p || !q || !r) return undefined;
    const forw = sign2(p.forw, q.forw, r.forw);
    forwSum += forw;
    product += forw * sign2(p.bakw, q.bakw, r.bakw);
  }
  if ((product < 0 ? -1 : 1) !== sigma) return undefined;

  const mesh = new IncrementalMesh(sigma, forwSum < 0 ? -1 : 1);
  const build: BuildMesh = { mesh, indexOf: new Map(), interior: [], ring: [] };
  const vertexOf = new Map<VertexIndex, number>();
  // 必須エッジの各区間は生成された順に並び、対応点に着いたところで次の群になる（searchBoundary と同じ）
  const groups: number[][] = points.map(() => []);
  let group = 1;
  for (const [a, b] of segments) {
    if (a < gcpCount) groups[a].push(group);
    groups[b].push(group);
    if (b < gcpCount) group++;
  }
  points.forEach((feature, position) => {
    const { index, geom } = feature.properties!.target;
    const boundary = typeof index === "string" && index.startsWith("b");
    const vertex = mesh.addVertex(
      boundary
        ? { kind: "boundary", order: build.ring.length }
        : typeof index === "number"
          ? { kind: "gcp", id: index }
          : { kind: "edgeNode", edge: -1, order: position },
      feature.geometry.coordinates,
      geom,
      boundary ? [BOUNDARY_GROUP] : groups[position]
    );
    vertexOf.set(index, vertex);
    build.indexOf.set(vertex, index);
    (boundary ? build.ring : build.interior).push(vertex);
  });
  for (const tri of tins.features) {
    const { a, b, c } = tri.properties!;
    mesh.addTriangle(vertexOf.get(a.index)!, vertexOf.get(b.index)!, vertexOf.get(c.index)!);
  }
  for (const [a, b] of segments) {
    mesh.setFlag(build.interior[a], build.interior[b], EDGE_REQUIRED);
  }
  mesh.boundarySimple = mesh.computeBoundarySimple();
  return build;
}

/** 網を複製する（頂点の表の中身は共有する。試行は、今ある頂点を動かさない）。 */
export function cloneBuildMesh(build: BuildMesh): BuildMesh {
  return {
    mesh: build.mesh.clone(true),
    indexOf: new Map(build.indexOf),
    interior: [...build.interior],
    ring: [...build.ring]
  };
}

/** 網を、紙の面の三角網（GeoJSON。頂点の属性に地理面の座標と番号）へ書き出す。 */
export function tinsFromMesh(build: BuildMesh): Tins {
  const { mesh, indexOf } = build;
  const features: Tri[] = [];
  for (const triangle of mesh.triangles.values()) {
    const [a, b, c] = triangle.map((vertex) => mesh.vertices.get(vertex)!);
    features.push({
      type: "Feature",
      properties: {
        a: { geom: a.bakw, index: indexOf.get(triangle[0])! },
        b: { geom: b.bakw, index: indexOf.get(triangle[1])! },
        c: { geom: c.bakw, index: indexOf.get(triangle[2])! }
      },
      geometry: { type: "Polygon", coordinates: [[a.forw, b.forw, c.forw, a.forw]] }
    } as Tri);
  }
  return { type: "FeatureCollection", features } as Tins;
}

export interface BandReplacement {
  /** 新しい補助頂点（輪の中の順） */
  vertices: readonly VertexPosition[];
  /** 帯に足す内側の点（補完点）。点群の末尾に足す */
  addPoints?: readonly { index: VertexIndex; forw: Position; bakw: Position }[];
  /** 制約にしたい凸包の辺（内側の点の配列位置の組。足す点は、今の内側の点の後ろ） */
  hull: readonly Edge[];
  /** 帯と一緒に差し替える三角形（外す凸包の辺の両側の三角形・点の編集の範囲） */
  extra?: Iterable<number>;
  /** okNew でない三角形が残っても採る（全部組み直しの中の試行だけ） */
  allowBad?: boolean;
  /** 紙の面だけで組む（全部組み直しの中の試行だけ。重なりの解消は、差し替えの後に別に行う） */
  forwOnly?: boolean;
  /** 一緒に行う頂点の編集（点の編集と帯の差し替えを 1 回で行うとき） */
  edit?: Pick<ReplaceEdit, "move" | "add" | "remove" | "release" | "constrain">;
}

export type BandFailure = ReplaceFailure | "bandNotAnnulus";

/**
 * 帯（補助頂点を 1 つ以上含む三角形の全部）を差し替える（設計書 §6.2）。
 *
 * 古い補助頂点を消し、新しい補助頂点の輪を網の外周にする。帯の内側の境（内側の網と共有する辺）は固定する。
 * 凸包の辺は「張れたら張る辺」で、必須エッジなどと両立しなければ外す。失敗したときは、網を変えない。
 *
 * @returns 成功したら、制約にできた（網の辺にある）凸包の辺
 */
export function replaceBand(
  build: BuildMesh,
  options: BandReplacement
): { ok: true; applied: Edge[]; removed: number[]; added: number[] } | { ok: false; reason: BandFailure } {
  const { mesh } = build;
  // 補助頂点の輪が、網の外周そのものであること（輪が閉じなかった網は扱わない）。輪の辺が全部、
  // 三角形 1 つだけに属し、網の外周の辺の数が、輪の辺の数に等しい
  const count = build.ring.length;
  for (let i = 0; i < count; i++) {
    if (mesh.byEdge.get(edgeKey(build.ring[i], build.ring[(i + 1) % count]))?.length !== 1) {
      return { ok: false, reason: "bandNotAnnulus" };
    }
  }
  for (const vertex of build.ring) {
    // 補助頂点から出る網の外周の辺は、輪の隣の頂点への 2 本だけ
    let outer = 0;
    for (const t of mesh.byVertex.get(vertex)!) {
      const tri = mesh.triangles.get(t)!;
      for (let k = 0; k < 3; k++) {
        const u = tri[k],
          v = tri[(k + 1) % 3];
        if ((u === vertex || v === vertex) && mesh.byEdge.get(edgeKey(u, v))!.length === 1) outer++;
      }
    }
    if (outer !== 2) return { ok: false, reason: "bandNotAnnulus" };
  }
  const range = new Set<number>(options.extra ?? []);
  for (const vertex of build.ring) {
    for (const t of mesh.byVertex.get(vertex)!) range.add(t);
  }

  // 新しい頂点
  const points = (options.addPoints ?? []).map(({ index, forw, bakw }) => ({
    index,
    vertex: mesh.addVertex({ kind: "edgeNode", edge: -1, order: -1 }, forw, bakw)
  }));
  const ring = options.vertices.map(({ forw, bakw }, order) =>
    mesh.addVertex({ kind: "boundary", order }, forw, bakw, [BOUNDARY_GROUP])
  );
  const interior = [...build.interior, ...points.map(({ vertex }) => vertex)];
  const removedByEdit = new Set(options.edit?.remove ?? []);

  // 凸包の辺の印を付け直す。範囲の外に残る辺は、先に印を付ける（固定する辺。磨きで反転させない）。
  // 範囲の中の辺は、張れたら張る辺にする
  const saved: [number, number][] = [];
  for (const [key, flags] of mesh.edgeFlags) {
    if (flags & EDGE_HULL) saved.push([key, flags]);
  }
  for (const [key, flags] of saved) {
    if (flags & ~EDGE_HULL) mesh.edgeFlags.set(key, flags & ~EDGE_HULL);
    else mesh.edgeFlags.delete(key);
  }
  const wanted: [number, number][] = [];
  const soft: [number, number, number][] = [];
  for (const [a, b] of options.hull) {
    const u = interior[a],
      v = interior[b];
    if (u === undefined || v === undefined || removedByEdit.has(u) || removedByEdit.has(v)) continue;
    wanted.push([u, v]);
    const owners = mesh.byEdge.get(edgeKey(u, v));
    if (owners && !owners.every((t) => range.has(t))) mesh.setFlag(u, v, EDGE_HULL);
    else soft.push([u, v, EDGE_HULL]);
  }

  const result = mesh.replace(range, {
    ...options.edit,
    remove: [...build.ring, ...(options.edit?.remove ?? [])],
    add: [...ring, ...points.map(({ vertex }) => vertex), ...(options.edit?.add ?? [])],
    outerRing: ring,
    replacesWholeBoundary: true,
    soft,
    allowBad: options.allowBad,
    forwOnly: options.forwOnly,
    unlimited: true
  });
  if (!result.ok) {
    for (const vertex of [...ring].reverse()) mesh.dropVertex(vertex);
    for (const { vertex } of [...points].reverse()) mesh.dropVertex(vertex);
    for (const [key, flags] of mesh.edgeFlags) {
      if (flags & EDGE_HULL) {
        if (flags & ~EDGE_HULL) mesh.edgeFlags.set(key, flags & ~EDGE_HULL);
        else mesh.edgeFlags.delete(key);
      }
    }
    for (const [key, flags] of saved) mesh.edgeFlags.set(key, (mesh.edgeFlags.get(key) ?? 0) | flags);
    return result;
  }
  for (const vertex of build.ring) build.indexOf.delete(vertex);
  ring.forEach((vertex, i) => build.indexOf.set(vertex, `b${i}`));
  for (const { index, vertex } of points) build.indexOf.set(vertex, index);
  build.ring = ring;
  build.interior = interior;
  // 制約にできた凸包の辺（網の辺にあるもの）
  const position = new Map(interior.map((vertex, i) => [vertex, i]));
  const applied: Edge[] = [];
  for (const [u, v] of wanted) {
    if (!mesh.hasEdge(u, v)) continue;
    mesh.setFlag(u, v, EDGE_HULL);
    applied.push([position.get(u)!, position.get(v)!]);
  }
  return { ok: true, applied, removed: result.removed, added: result.added };
}

/** 補助頂点を含む三角形のうち、ok でないものの数（今の `boundaryTriangleFlips` に当たる）。 */
export function countBadBandTriangles(build: BuildMesh): number {
  const { mesh } = build;
  let count = 0;
  for (const id of mesh.bad) {
    const triangle = mesh.triangles.get(id)!;
    if (triangle.some((vertex) => mesh.vertices.get(vertex)!.ref.kind === "boundary")) count++;
  }
  return count;
}
