/**
 * 局所更新の網と、compiled の間の取り込み・書き出し（MaplatTin#100 の第 1 段 a。設計書 §9.2）。
 *
 * 網の中では、頂点を安定した id で持つ。compiled の番号（対応点の添字・`e{n}`・`b{n}`）は配列位置なので、
 * 書き出すときに 1 回だけ振り直す。
 */
import type { Position } from "geojson";
import { worldFileToCrs, type Edge, type EdgeSet, type PointSet, type WorldFile } from "@maplat/transform";
import { orient2d } from "robust-predicates";
import { convexHullEdges } from "../hull-edges.ts";
import { BandStats } from "./band.ts";
import type { SupplementPair, SupplementPairRecord } from "../supplement-pairs.ts";
import type { CompiledWithSupplement } from "../tin.ts";
import {
  BOUNDARY_GROUP,
  copyPosition,
  EDGE_HULL,
  EDGE_REQUIRED,
  edgeGroupOf,
  IncrementalMesh,
  type EdgeId,
  type PointId
} from "./mesh.ts";

/** 網を取り込めない理由。 */
export type ImportFailure =
  /** V2 のアルゴリズムの網（補助頂点が四隅だけ） */
  | "v2"
  /** loose の網（両面で独立の三角網） */
  | "loose"
  /** 網の向きが、設定から決まる向きと合わない */
  | "orientation"
  /** compiled の中身が食い違っている（三角形が、無い頂点を指している、など） */
  | "inconsistent";

/** 必須エッジ（人間の入力）と、その中継点。 */
export interface MeshEdge {
  id: EdgeId;
  start: number;
  end: number;
  forwNodes: Position[];
  bakwNodes: Position[];
  /** 中継点の頂点の id（必須エッジの中での順） */
  nodes: number[];
}

/** 補完点（システムが足した点）と、足した理由。頂点は網の id で持つ。 */
export interface MeshSupplement {
  vertex: number;
  kind: SupplementPairRecord["kind"];
  edge: [number, number];
  anchor?: number;
}

/** 網からは決まらない、compiled の項目（取り込んだときの値）。 */
interface MeshContext {
  version: CompiledWithSupplement["version"];
  yaxisMode: CompiledWithSupplement["yaxisMode"];
  vertexMode: CompiledWithSupplement["vertexMode"];
  strictMode: CompiledWithSupplement["strictMode"];
  bounds: CompiledWithSupplement["bounds"];
  boundsPolygon: CompiledWithSupplement["boundsPolygon"];
  xy: CompiledWithSupplement["xy"];
  wh: CompiledWithSupplement["wh"];
  hasXy: boolean;
  hasWh: boolean;
  outer:
    | { outerTransform: "worldFile"; worldFile: unknown }
    | { outerTransform: "extrapolate" }
    | undefined;
  /** 取り込んだときの strict の状態と交差（網を編集するまでは、これを書き出す） */
  strict_status: CompiledWithSupplement["strict_status"];
  kinks_points: CompiledWithSupplement["kinks_points"];
}

type VertexIndex = number | string;

const sign2 = (p: Position, q: Position, r: Position): number =>
  Math.sign(orient2d(p[0], p[1], q[0], q[1], r[0], r[1]));

/** 局所更新の網と、compiled を書き出すのに要る表。 */
export class MeshModel {
  /** 対応点の頂点の id（compiled の `points` の並び） */
  gcps: number[] = [];
  /** 対応点の id（`PointId`）から、頂点の id を引く表 */
  pointVertex = new Map<PointId, number>();
  /** 必須エッジ（compiled の `edges` の並び） */
  edges: MeshEdge[] = [];
  /** 補完点（compiled の `edgeNodes` の、中継点の後ろの並び） */
  supplements: MeshSupplement[] = [];
  /** 補助頂点の頂点の id（輪の中の順） */
  ring: number[] = [];
  /** 扇形の中心（最後に帯を作ったときの値。world file 外周では持たない） */
  centroid?: { forw: Position; bakw: Position };
  /** 補完点の鍵の続き番号 */
  nextSupplement = 0;
  private bandStats?: BandStats | null;

  /**
   * 帯（補助頂点・重心）を更新しなくてよいかを判定するための量（設計書 §6.3）。最初に要るときに 1 回だけ作る。
   * 判定できない網（world file 外周・補助頂点の輪が閉じなかった網）では null。
   */
  band(): BandStats | null {
    if (this.bandStats === undefined) this.bandStats = BandStats.of(this);
    return this.bandStats;
  }

  /** world file 外周の網か（補助頂点の地理面の位置を、world file から直接決める。扇形の中心を持たない）。 */
  get isWorldFile(): boolean {
    return this.context.outer?.outerTransform === "worldFile";
  }

  /**
   * world file 外周の網の、紙の面から地理面（網の内部の座標系）への写像。world file 外周でなければ undefined。
   * follow では、GCP と同じく、地理面の Y を反転する。
   */
  worldFileProjection(): ((forw: Position) => Position) | undefined {
    const outer = this.context.outer;
    if (outer?.outerTransform !== "worldFile") return undefined;
    const worldFile = outer.worldFile as WorldFile;
    const follow = this.context.yaxisMode === "follow";
    return (forw) => {
      const [x, y] = worldFileToCrs(worldFile, forw);
      return [x, follow ? -y : y];
    };
  }

  /**
   * world file 外周の網で、地理面の位置が world file の値（`worldFileProjection()(forw)`）と違う補助頂点の数。
   * world file 外周でなければ 0。全部組み直した compiled では、差は 0（同じ式で計算した値を、そのまま持つ）。
   */
  worldFileMismatches(): number {
    const project = this.worldFileProjection();
    if (!project) return 0;
    let count = 0;
    for (const vertex of this.ring) {
      const { forw, bakw } = this.mesh.vertices.get(vertex)!;
      const expected = project(forw);
      if (expected[0] !== bakw[0] || expected[1] !== bakw[1]) count++;
    }
    return count;
  }

  /** 補完点の一覧（compiled の `supplementPairs` に、座標を付けたもの。`Tin#supplementPairs` と同じ形）。 */
  supplementPairs(): SupplementPair[] {
    const index = this.indexTable();
    return this.supplements.map((supplement) => {
      const { forw, bakw } = this.mesh.vertices.get(supplement.vertex)!;
      return {
        node: Number((index.get(supplement.vertex) as string).slice(1)),
        kind: supplement.kind,
        edge: supplement.edge.map((vertex) => index.get(vertex)!) as SupplementPair["edge"],
        ...(supplement.anchor === undefined ? {} : { anchor: index.get(supplement.anchor)! }),
        forw: copyPosition(forw),
        bakw: copyPosition(bakw)
      };
    });
  }

  /** 帯の判定のための量を捨てる（帯・凸包が変わったとき。次に要るときに作り直す）。 */
  resetBand(): void {
    this.bandStats = undefined;
  }

  /** 補助頂点の扇形の角度（compiled の `vertices_params`。紙の面・地理面）。world file 外周では undefined。 */
  verticesParams(): number[][] | undefined {
    const centroid = this.centroid;
    if (!centroid) return undefined;
    return (["forw", "bakw"] as const).map((plane) =>
      this.ring.map((vertex) => {
        const coord = this.mesh.vertices.get(vertex)![plane];
        return Math.atan2(
          coord[0] - centroid[plane][0],
          coord[1] - centroid[plane][1]
        );
      })
    );
  }

  /** 対応点と必須エッジ（`setPoints`・`setEdges` に入れる形。座標は内部の座標系）と、その id の並び。 */
  inputs(): {
    points: PointSet[];
    edges: EdgeSet[];
    pointIds: PointId[];
    edgeIds: EdgeId[];
  } {
    const at = (vertex: number) => this.mesh.vertices.get(vertex)!;
    const index = new Map(this.gcps.map((vertex, i) => [vertex, i]));
    return {
      points: this.gcps.map((vertex) => [
        copyPosition(at(vertex).forw),
        copyPosition(at(vertex).bakw)
      ]),
      edges: this.edges.map((edge) => [
        edge.forwNodes.map(copyPosition),
        edge.bakwNodes.map(copyPosition),
        [index.get(edge.start)!, index.get(edge.end)!]
      ]),
      pointIds: this.gcps.map(
        (vertex) => (at(vertex).ref as { id: PointId }).id
      ),
      edgeIds: this.edges.map((edge) => edge.id)
    };
  }

  readonly mesh: IncrementalMesh;
  private readonly context: MeshContext;

  constructor(mesh: IncrementalMesh, context: MeshContext) {
    this.mesh = mesh;
    this.context = context;
  }

  /** 中継点と補完点の頂点の id（compiled の `edgeNodes` の並び）。 */
  nodeOrder(): number[] {
    return [
      ...this.edges.flatMap((edge) => edge.nodes),
      ...this.supplements.map((supplement) => supplement.vertex)
    ];
  }

  /** 頂点の id から、compiled の番号（対応点は添字、中継点・補完点は `e{n}`、補助頂点は `b{n}`）を引く表。 */
  indexTable(): Map<number, VertexIndex> {
    const table = new Map<number, VertexIndex>();
    this.gcps.forEach((vertex, i) => table.set(vertex, i));
    this.nodeOrder().forEach((vertex, i) => table.set(vertex, `e${i}`));
    this.ring.forEach((vertex, i) => table.set(vertex, `b${i}`));
    return table;
  }

  /** 網から compiled を書き出す（項目の並びは `Tin#getCompiled` と同じ）。 */
  toCompiled(): CompiledWithSupplement {
    const { mesh, context } = this;
    const at = (vertex: number) => mesh.vertices.get(vertex)!;
    // 座標は写しを返す（返した compiled を書き換えても、網は変わらない）
    const pair = (vertex: number): PointSet => [
      copyPosition(at(vertex).forw),
      copyPosition(at(vertex).bakw)
    ];
    const index = this.indexTable();
    const compiled = {} as Record<string, unknown>;
    compiled.version = context.version;
    compiled.points = this.gcps.map(pair);
    compiled.weight_buffer = {};
    const verticesPoints = this.ring.map(pair);
    if (context.outer?.outerTransform === "worldFile") {
      compiled.outerTransform = "worldFile";
      compiled.worldFile = context.outer.worldFile;
      compiled.vertices_points = verticesPoints;
    } else {
      const centroid = this.centroid!;
      compiled.centroid_point = [
        copyPosition(centroid.forw),
        copyPosition(centroid.bakw)
      ];
      // 網の b{n} の座標・vertices_points・vertices_params は、必ず同じ帯から書く
      compiled.vertices_params = this.verticesParams();
      compiled.vertices_points = verticesPoints;
    }
    // 編集するまでは、取り込んだときの状態を書く。編集した後は、網の不変条件で読む
    // （strict でない網の交差の一覧は、清書が作り直す。設計書 §3.4）
    const edited = mesh.revision > 0;
    const status = edited
      ? mesh.isStrict()
        ? "strict"
        : "strict_error"
      : context.strict_status;
    compiled.strict_status = status;
    compiled.tins_points = [
      [...mesh.triangles.values()].map((triangle) =>
        triangle.map((vertex) => index.get(vertex)!)
      )
    ];
    if (!edited && status === "strict_error" && context.kinks_points) {
      compiled.kinks_points = context.kinks_points;
    }
    compiled.yaxisMode = context.yaxisMode;
    compiled.vertexMode = context.vertexMode;
    compiled.strictMode = context.strictMode;
    if (context.bounds) {
      compiled.bounds = context.bounds;
      compiled.boundsPolygon = context.boundsPolygon;
      if (context.hasXy) compiled.xy = context.xy;
      if (context.hasWh) compiled.wh = context.wh;
    } else {
      compiled.wh = context.wh;
    }
    compiled.edges = this.edges.map(
      (edge): EdgeSet => [
        edge.forwNodes.map(copyPosition),
        edge.bakwNodes.map(copyPosition),
        [index.get(edge.start) as number, index.get(edge.end) as number]
      ]
    );
    compiled.edgeNodes = this.nodeOrder().map(pair);
    if (this.supplements.length > 0) {
      compiled.supplementPairs = this.supplements.map((supplement) => ({
        node: Number((index.get(supplement.vertex) as string).slice(1)),
        kind: supplement.kind,
        edge: supplement.edge.map((vertex) => index.get(vertex)!),
        ...(supplement.anchor === undefined
          ? {}
          : { anchor: index.get(supplement.anchor)! })
      }));
    }
    if (context.outer?.outerTransform === "extrapolate") {
      compiled.outerTransform = "extrapolate";
    }
    return compiled as unknown as CompiledWithSupplement;
  }
}

/**
 * 全部組み直した結果（compiled）から、局所更新の網を作る。三角形分割はしない
 * （三角形の頂点の番号から、頂点表と索引を作るだけ）。
 *
 * - 座標は、compiled の値を反転せずにそのまま入れる（compiled は内部の座標系で書かれている）。
 * - 網の向き σ は、設定から決まる向き（扇形の外挿は −1、world file 外周は follow なら 1）にし、
 *   全部の三角形の符号の多数決と合わなければ取り込まない（最初の三角形 1 つからは取らない）。
 * - `hull` の印は、内側の点（対応点・中継点・補完点）の紙の面の凸包の辺のうち、網の辺にあるものに付ける
 *   （compiled には、どの凸包の辺を制約にしたかが残らない。制約から外した辺でも、網の辺に残っていれば
 *   印が付く。strict には影響せず、差し替えの自由度が少し減るだけ）。
 * - `protect` の印は付けない（compiled に残らない。差し替えの範囲の中では、もともと外して組み直す印）。
 *
 * @param compiled 全部組み直した結果
 * @param segments 必須エッジの区間（`pointsSet.edges`。点群の配列位置の組。対応点が先、その後ろに中継点と補完点）
 * @param ids 対応点・必須エッジの id（compiled の並び）。省略時は、配列の添字を id にする
 */
export function meshFromCompiled(
  compiled: CompiledWithSupplement,
  segments: readonly Edge[],
  ids: { points?: readonly PointId[]; edges?: readonly EdgeId[] } = {}
): { model: MeshModel } | { reason: ImportFailure } {
  if (compiled.version !== undefined && compiled.version < 3)
    return { reason: "v2" };
  if (compiled.strict_status === "loose" || compiled.tins_points.length !== 1) {
    return { reason: "loose" };
  }
  const outerKind = (compiled as { outerTransform?: string }).outerTransform;
  const expected: -1 | 1 =
    outerKind === "worldFile" && compiled.yaxisMode === "follow" ? 1 : -1;

  const points = compiled.points;
  const nodes = (compiled.edgeNodes ?? []) as PointSet[];
  const ringPoints = compiled.vertices_points ?? [];
  const gcpCount = points.length;

  // 多数決で、網の向きと、紙の面での頂点の並びの向きを取る
  const coordOf = (index: VertexIndex): PointSet | undefined => {
    if (typeof index === "number") return points[index];
    const n = Number(index.slice(1));
    return index.startsWith("e")
      ? nodes[n]
      : index.startsWith("b")
        ? ringPoints[n]
        : undefined;
  };
  let product = 0;
  let forwSum = 0;
  for (const triangle of compiled.tins_points[0]) {
    const [p, q, r] = triangle.map(coordOf);
    if (!p || !q || !r) return { reason: "inconsistent" };
    const forw = sign2(p[0], q[0], r[0]);
    forwSum += forw;
    product += forw * sign2(p[1], q[1], r[1]);
  }
  if ((product < 0 ? -1 : 1) !== expected) return { reason: "orientation" };

  const mesh = new IncrementalMesh(expected, forwSum < 0 ? -1 : 1);
  const model = new MeshModel(mesh, {
    version: compiled.version,
    yaxisMode: compiled.yaxisMode,
    vertexMode: compiled.vertexMode,
    strictMode: compiled.strictMode,
    bounds: compiled.bounds,
    boundsPolygon: compiled.boundsPolygon,
    xy: compiled.xy,
    wh: compiled.wh,
    hasXy: "xy" in compiled,
    hasWh: "wh" in compiled,
    outer:
      outerKind === "worldFile"
        ? {
            outerTransform: "worldFile",
            worldFile: (compiled as { worldFile?: unknown }).worldFile
          }
        : outerKind === "extrapolate"
          ? { outerTransform: "extrapolate" }
          : undefined,
    strict_status: compiled.strict_status,
    kinks_points: compiled.kinks_points
  });

  // 頂点表。対応点 → 中継点・補完点 → 補助頂点の順に入れる
  const byIndex = new Map<VertexIndex, number>();
  points.forEach(([forw, bakw], i) => {
    const id = ids.points?.[i] ?? i;
    const vertex = mesh.addVertex({ kind: "gcp", id }, forw, bakw);
    model.gcps.push(vertex);
    model.pointVertex.set(id, vertex);
    byIndex.set(i, vertex);
  });
  const sourceEdges = compiled.edges ?? [];
  model.edges = sourceEdges.map(
    ([forwNodes, bakwNodes, [start, end]], i): MeshEdge => ({
      id: ids.edges?.[i] ?? i,
      start: byIndex.get(start)!,
      end: byIndex.get(end)!,
      forwNodes: forwNodes.map(copyPosition),
      bakwNodes: bakwNodes.map(copyPosition),
      nodes: []
    })
  );
  if (model.edges.some(({ start, end }) => start === undefined || end === undefined)) {
    return { reason: "inconsistent" };
  }
  // 必須エッジの区間は生成された順に並び、対応点に着いたところで次の必須エッジになる
  const nodeOwner = new Map<number, number>();
  {
    let current = 0;
    for (const [, b] of segments) {
      if (b >= gcpCount) {
        if (!nodeOwner.has(b - gcpCount)) nodeOwner.set(b - gcpCount, current);
      } else current++;
    }
    if (current !== model.edges.length) return { reason: "inconsistent" };
  }
  nodes.forEach(([forw, bakw], n) => {
    const owner = nodeOwner.get(n);
    let vertex: number;
    if (owner !== undefined) {
      const edge = model.edges[owner];
      vertex = mesh.addVertex(
        { kind: "edgeNode", edge: edge.id, order: edge.nodes.length },
        forw,
        bakw,
        [edgeGroupOf(edge.id)]
      );
      edge.nodes.push(vertex);
    } else {
      vertex = mesh.addVertex(
        { kind: "supplement", key: `s${model.nextSupplement++}` },
        forw,
        bakw
      );
    }
    byIndex.set(`e${n}`, vertex);
  });
  for (const edge of model.edges) {
    const group = edgeGroupOf(edge.id);
    mesh.vertices.get(edge.start)!.groups.push(group);
    mesh.vertices.get(edge.end)!.groups.push(group);
  }
  ringPoints.forEach(([forw, bakw], i) => {
    const vertex = mesh.addVertex({ kind: "boundary", order: i }, forw, bakw, [
      BOUNDARY_GROUP
    ]);
    model.ring.push(vertex);
    byIndex.set(`b${i}`, vertex);
  });
  // 補完点の一覧（理由つき）。一覧に無い「辺を持たない点」は、理由なしの補完点として持つ
  const records = new Map(
    (compiled.supplementPairs ?? []).map((record) => [record.node, record])
  );
  for (let n = 0; n < nodes.length; n++) {
    if (nodeOwner.has(n)) continue;
    const record = records.get(n);
    const edge = record?.edge.map((index) => byIndex.get(index));
    if (!record || !edge || edge.some((vertex) => vertex === undefined)) {
      return { reason: "inconsistent" };
    }
    if (record.anchor !== undefined && byIndex.get(record.anchor) === undefined) {
      return { reason: "inconsistent" };
    }
    model.supplements.push({
      vertex: byIndex.get(`e${n}`)!,
      kind: record.kind,
      edge: edge as [number, number],
      ...(record.anchor === undefined
        ? {}
        : { anchor: byIndex.get(record.anchor) })
    });
  }
  if (compiled.centroid_point) {
    model.centroid = {
      forw: copyPosition(compiled.centroid_point[0]),
      bakw: copyPosition(compiled.centroid_point[1])
    };
  } else if (outerKind !== "worldFile") return { reason: "inconsistent" };

  // 三角形（compiled の並びのまま）
  for (const triangle of compiled.tins_points[0]) {
    const [a, b, c] = triangle.map((index) => byIndex.get(index)!);
    mesh.addTriangle(a, b, c);
  }

  // 辺の属性
  const positionToVertex = (position: number): number | undefined =>
    position < gcpCount
      ? byIndex.get(position)
      : byIndex.get(`e${position - gcpCount}`);
  for (const [a, b] of segments) {
    const u = positionToVertex(a),
      v = positionToVertex(b);
    if (u === undefined || v === undefined) return { reason: "inconsistent" };
    mesh.setFlag(u, v, EDGE_REQUIRED);
  }
  const interior = [...model.gcps, ...model.nodeOrder()];
  const hull = convexHullEdges(
    interior.map((vertex) => mesh.vertices.get(vertex)!.forw)
  );
  for (const [a, b] of hull) {
    if (mesh.hasEdge(interior[a], interior[b]))
      mesh.setFlag(interior[a], interior[b], EDGE_HULL);
  }
  mesh.boundarySimple = mesh.computeBoundarySimple();
  return { model };
}
