import { Position } from 'geojson';
import { Edge, EdgeSet, PointSet } from '@maplat/transform';
import { BandStats } from "./band.js";
import { SupplementPairRecord } from "../supplement-pairs.js";
import { CompiledWithSupplement } from "../tin.js";
import { IncrementalMesh, EdgeId, PointId } from "./mesh.js";
/** 網を取り込めない理由。 */
export type ImportFailure = 
/** V2 のアルゴリズムの網（補助頂点が四隅だけ） */
"v2"
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
    outer: {
        outerTransform: "worldFile";
        worldFile: unknown;
    } | {
        outerTransform: "extrapolate";
    } | undefined;
    /** 取り込んだときの strict の状態と交差（網を編集するまでは、これを書き出す） */
    strict_status: CompiledWithSupplement["strict_status"];
    kinks_points: CompiledWithSupplement["kinks_points"];
}
type VertexIndex = number | string;
/** 局所更新の網と、compiled を書き出すのに要る表。 */
export declare class MeshModel {
    /** 対応点の頂点の id（compiled の `points` の並び） */
    gcps: number[];
    /** 対応点の id（`PointId`）から、頂点の id を引く表 */
    pointVertex: Map<number, number>;
    /** 必須エッジ（compiled の `edges` の並び） */
    edges: MeshEdge[];
    /** 補完点（compiled の `edgeNodes` の、中継点の後ろの並び） */
    supplements: MeshSupplement[];
    /** 補助頂点の頂点の id（輪の中の順） */
    ring: number[];
    /** 扇形の中心（最後に帯を作ったときの値。world file 外周では持たない） */
    centroid?: {
        forw: Position;
        bakw: Position;
    };
    /** 補完点の鍵の続き番号 */
    nextSupplement: number;
    private bandStats?;
    /**
     * 帯（補助頂点・重心）を更新しなくてよいかを判定するための量（設計書 §6.3）。最初に要るときに 1 回だけ作る。
     * 判定できない網（world file 外周・補助頂点の輪が閉じなかった網）では null。
     */
    band(): BandStats | null;
    /** 対応点と必須エッジ（`setPoints`・`setEdges` に入れる形。座標は内部の座標系）と、その id の並び。 */
    inputs(): {
        points: PointSet[];
        edges: EdgeSet[];
        pointIds: PointId[];
        edgeIds: EdgeId[];
    };
    readonly mesh: IncrementalMesh;
    private readonly context;
    constructor(mesh: IncrementalMesh, context: MeshContext);
    /** 中継点と補完点の頂点の id（compiled の `edgeNodes` の並び）。 */
    nodeOrder(): number[];
    /** 頂点の id から、compiled の番号（対応点は添字、中継点・補完点は `e{n}`、補助頂点は `b{n}`）を引く表。 */
    indexTable(): Map<number, VertexIndex>;
    /** 網から compiled を書き出す（項目の並びは `Tin#getCompiled` と同じ）。 */
    toCompiled(): CompiledWithSupplement;
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
export declare function meshFromCompiled(compiled: CompiledWithSupplement, segments: readonly Edge[], ids?: {
    points?: readonly PointId[];
    edges?: readonly EdgeId[];
}): {
    model: MeshModel;
} | {
    reason: ImportFailure;
};
export {};
