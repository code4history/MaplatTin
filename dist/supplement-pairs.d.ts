import { Feature, Point, Position } from 'geojson';
import { Edge, Tins } from '@maplat/transform';
/** 候補を試す回の数の上限。 */
export declare const MAX_SUPPLEMENT_PAIR_ROUNDS = 4;
/** 補完点の合計の上限。 */
export declare const MAX_SUPPLEMENT_PAIRS = 32;
/** 地理の面の高さを核の中に決め直す繰り返しの上限。 */
export declare const MAX_KERNEL_FIT_ITERATIONS = 4;
/** 紙の面で、弦の長さに対して外へ出す割合（弦の上のちょうどには置けない）。 */
export declare const SUPPLEMENT_EPSILON = 0.0001;
/** 地理の面で、出っ張りの高さ（核の下限）に足す割合。 */
export declare const SUPPLEMENT_LAMBDA = 0.25;
/** 地理の面で、弦の長さに対する高さの余裕の下限の割合（出っ張りが無いときに三角形がつぶれない）。 */
export declare const SUPPLEMENT_MU = 0.01;
/** 三角形の頂点の添字（GCP は数、中継点・補完点は "e12"、補助頂点は "b3"）。 */
export type VertexId = number | string;
/** compiled に書く補完点の一覧の 1 件。座標は `edgeNodes[node]` に 1 か所だけ持つ。 */
export interface SupplementPairRecord {
    /** `edgeNodes` の中の位置。三角形の頂点からは `"e{node}"` で指す。 */
    node: number;
    /** 補完点を足した理由。今は凸包の辺だけ。 */
    kind: "hullEdge";
    /** 足した凸包の辺の両端（対応点は数、中継点・補完点は "e12"）。 */
    edge: [VertexId, VertexId];
    /** いちばん凹んだ所の点の添字（弦の範囲に外へ出る点が無いときは省く）。 */
    anchor?: VertexId;
}
/** 座標を付けた補完点（`Tin#supplementPairs`）。座標は内部の座標（`edgeNodes` と同じ）。 */
export interface SupplementPair extends SupplementPairRecord {
    /** 紙の面の座標 */
    forw: Position;
    /** 地理の面の座標 */
    bakw: Position;
}
/** 補完の手順の診断（試験・調査用）。 */
export interface SupplementDiagnostics {
    /** 候補を試した回の数 */
    rounds: number;
    /** 三角網を組んだ回数（測る試行と採否の試行の合計） */
    builds: number;
    /** 外れた辺をまとめて試して採用した回数 */
    batches: number;
    /** 外れた辺ごとに試して採用した回数（1 点の案と複数点の案の合計） */
    perEdge: number;
    /** 複数点の案を採用した回数 */
    multiPoint: number;
}
interface MeshPoint {
    id: VertexId;
    paper: Position;
    geo: Position;
}
interface MeshTriangle {
    ids: string[];
    paper: Position[];
    geo: Position[];
    /** 紙の面の向き × 地理の面の向き */
    sign: number;
}
/** 採用した（または測った）三角網の読み取り。 */
export interface MeshAnalysis {
    /** 補助頂点を除いた点（GCP・中継点・補完点）。`hullEdges` の添字はこの並びで引く。 */
    points: MeshPoint[];
    triangles: MeshTriangle[];
    /** 向きの積の多数派（食い違う三角形はこれと違うもの） */
    majority: 1 | -1;
    /** 紙の面の凸包の辺（`points` の添字の組） */
    hullEdges: Edge[];
    /** 凸包の辺のうち、三角網の辺になっていないもの */
    dropped: Edge[];
}
/**
 * 三角網 `forw`（地図面）を読む。`features` は三角網を組んだ点（補助頂点は末尾）、`hullEdges` は
 * 紙の面の凸包の辺の全部（その添字で `features` を引く。測るだけのときは空でよい）。
 */
export declare function analyzeMesh(tins: Tins, features: Feature<Point>[], hullEdges: Edge[]): MeshAnalysis;
/** 地理の面の半直線 `foot + height · normal` の上に置く点。紙の面の位置は固定。 */
export interface SupplementRay {
    /** 紙の面の位置 */
    paper: Position;
    /** 半直線の始点（P\* から弦 A′–B′ へ下ろした足、または弦の中点） */
    foot: Position;
    /** 外向きの単位法線（地理の面） */
    normal: Position;
    /** 始点からの高さ */
    height: number;
    /** 弦 A′–B′ の長さ */
    chord: number;
    /** いちばん凹んだ所の出っ張りの高さ */
    protrusion: number;
    /** その点を置く理由になった点の添字 */
    anchor?: VertexId;
}
/** 半直線の上の、地理の面の位置。 */
export declare function rayGeo(ray: SupplementRay): Position;
/** 外れた凸包の辺 1 本に対する候補。 */
export interface SupplementCandidate {
    edge: [VertexId, VertexId];
    /** 試す案。先頭は 1 点の案。弦の範囲で 2 か所以上が出っ張るときは、複数点の案が続く。 */
    variants: SupplementRay[][];
}
/**
 * 外れた凸包の辺 A–B に足す点の候補を決める（設計書 §2.2）。
 * 地理の面で A′–B′ の外へ出る点の集まり S から、いちばん凹んだ所 P\* を取り、P\* から弦へ下ろした足の
 * 紙の面の位置を、弦の長さ × ε だけ外へ出して Q にする。S が空なら弦の中点。
 */
export declare function proposeSupplementCandidate(analysis: MeshAnalysis, [i, j]: Edge, { lambda, epsilon }?: {
    lambda?: number | undefined;
    epsilon?: number | undefined;
}): SupplementCandidate | undefined;
/**
 * 補完点の地理の位置を、紙の面でその点を囲む輪（その点を頂点にする三角形の対辺）の核の中に決め直す
 * （設計書 §2.3）。半直線 `foot + s·normal` の上で、輪の辺ごとの半平面の共通部分 `[lo, hi]` を求め、
 * 下限から少し外の高さを選ぶ。位置が変わると輪が変わるので、変わらなくなるまで（最大
 * `MAX_KERNEL_FIT_ITERATIONS` 回）繰り返す。核が空なら undefined。
 *
 * @param rays 決め直す点（紙の面は固定）
 * @param firstNode 先頭の点の `edgeNodes` の位置（`"e{n}"` の n）
 * @param measure 採用済みの補完点に、この点を足して、凸包の辺を全部制約にした三角網を組み、読んだ結果を返す
 */
export declare function fitToKernel(rays: readonly SupplementRay[], firstNode: number, measure: (pairs: Position[][]) => MeshAnalysis | undefined, { lambda, mu }?: {
    lambda?: number | undefined;
    mu?: number | undefined;
}): SupplementRay[] | undefined;
/**
 * 足した補完点（`firstNode` 以降の "e{n}"）が全部効いているか: 紙の面の凸包の頂点で、その点に付く
 * 凸包の辺が全部、三角網の辺になっている。
 */
export declare function supplementsTakeEffect(analysis: MeshAnalysis, firstNode: number): boolean;
/** 呼び出し側（Tin）が持つ、三角網の組み立てと状態の保存。 */
export interface SupplementHost<T, H> {
    /** `edgeNodes` の、補完点を除いた数（最初の補完点の `node`） */
    edgeBase: number;
    /** 今の三角網の状態と補完点の並びを控える */
    snapshot(): H;
    /** 控えた状態に戻す */
    restore(handle: H): void;
    /**
     * 補完点 `pairs`（`[紙, 地理][]`、採用済みを含む全部）で、凸包の辺を全部制約にした最初の三角網を組んで読む。
     * 外周が見つからなければ undefined。
     */
    measure(pairs: Position[][]): MeshAnalysis | undefined;
    /**
     * 補完点 `pairs`（採用済みを含む全部）で三角網を組み直し（凸包の辺を外して strict を探す）、strict に
     * なったときだけ、結果と読んだ三角網を返す。strict にならなければ undefined。
     */
    build(pairs: Position[][]): {
        result: T;
        analysis: MeshAnalysis;
    } | undefined;
}
export interface SupplementOutcome<T> {
    /** 採用した補完点（`[紙, 地理]`） */
    pairs: Position[][];
    records: SupplementPairRecord[];
    /** 採用した試行の結果（補完点が無ければ、渡された最初の結果） */
    result: T;
    diagnostics: SupplementDiagnostics;
}
/**
 * 外れた凸包の辺に補完点を足して、strict の三角網を組み直す（設計書 §2.4）。
 *
 * 1. 外れた辺ごとの候補（各 1 点）を全部足して試す。strict になり、足した点が全部効いていれば採用。
 * 2. だめなら辺ごとに、1 点の案・複数点の案の順に試し、条件を満たした案を採る。
 * 3. 採用後も外れた辺が残れば、同じ手順を繰り返す。
 *
 * 終わることの保証: 回は最大 `MAX_SUPPLEMENT_PAIR_ROUNDS`、1 本の辺（両端の紙の座標）は一度しか試さず、
 * 補完点の合計は最大 `MAX_SUPPLEMENT_PAIRS`。採用は strict で足した点が全部効くときだけなので、strict を
 * 失うことは無い。何も採用しなかったときは、渡された状態へ戻す。
 *
 * @param initial 補完点を足す前の結果（strict）と、その三角網の読み取り（`dropped` が空でないこと）
 */
export declare function addSupplementPairs<T, H>(host: SupplementHost<T, H>, initial: {
    result: T;
    analysis: MeshAnalysis;
}): SupplementOutcome<T>;
export {};
