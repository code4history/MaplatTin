import { Position } from 'geojson';
/** Editor が振る、対応点の安定した id（配列位置ではない）。`setPoints` で入れた点は、その時点の添字。 */
export type PointId = number;
/** Editor が振る、必須エッジの安定した id。`setEdges` で入れた必須エッジは、その時点の添字。 */
export type EdgeId = number;
/** 頂点の指し方。配列位置ではなく、種類と安定した id。 */
export type VertexRef = {
    kind: "gcp";
    id: PointId;
}
/** 必須エッジの中継点（その必須エッジの中での順） */
 | {
    kind: "edgeNode";
    edge: EdgeId;
    order: number;
}
/** 補完点 */
 | {
    kind: "supplement";
    key: string;
}
/** 補助頂点（輪の中での順） */
 | {
    kind: "boundary";
    order: number;
};
/** 網の頂点。座標は網の内部の座標系（compiled と同じ。follow では地理面の Y が反転済み）。 */
export interface MeshVertex {
    ref: VertexRef;
    forw: Position;
    bakw: Position;
    /** 禁止制約の群の番号（{@link BOUNDARY_GROUP} は補助頂点の全体。必須エッジは {@link edgeGroupOf}）。 */
    groups: number[];
}
/** 補助頂点の全体の群。 */
export declare const BOUNDARY_GROUP = 0;
/** 必須エッジ（端点と中継点）の群。 */
export declare const edgeGroupOf: (edge: EdgeId) => number;
/** 辺の属性（別々に持つ。1 つの「制約」にまとめない）。 */
export declare const EDGE_REQUIRED = 1;
export declare const EDGE_HULL = 2;
export declare const EDGE_PROTECT = 4;
/** 新しく作る三角形の 2×面積の下限（今の `isDegenerate` と同じ閾値。素の float64 で計算する）。 */
export declare const MIN_DOUBLE_AREA = 0.000001;
/** 範囲 R が網の三角形のこの割合を超えたら、組み直す前に諦める。 */
export declare const MAX_REPLACE_FRACTION = 0.2;
export type ReplaceFailure = "tooLarge" | "notDisk" | "constraint" | "pointOutside" | "count" | "notStrict" | "forbidden" | "boundary";
/** 磨き（§5.3）で調べる辺の数の上限（差し替えた範囲の輪の辺の数の何倍か）。 */
export declare const POLISH_FACTOR = 4;
export declare const INCIRCLE_INSIDE: number;
/** 差し替えと一緒に行う頂点の編集。 */
export interface ReplaceEdit {
    /** 座標を変える頂点（R の内側の頂点に限る。輪の頂点は動かせない） */
    move?: ReadonlyMap<number, {
        forw: Position;
        bakw: Position;
    }>;
    /** R の内側に置く新しい頂点（{@link IncrementalMesh#addVertex} で頂点表に入れてあること） */
    add?: readonly number[];
    /** 消す頂点（星が全部 R に入っていること） */
    remove?: readonly number[];
    /** 新しく張る辺（頂点の id の組と、付ける属性） */
    constrain?: readonly (readonly [number, number, number])[];
    /** required の印を外す辺（張り直さない。必須エッジを外す・区間を張り替えるとき） */
    release?: readonly (readonly [number, number])[];
    /** 差し替えの後の磨き（§5.3）をしない */
    noPolish?: boolean;
}
export type ReplaceResult = {
    ok: true;
    removed: number[];
    added: number[];
    /** 重なりの解消・禁止制約の解消・磨きで反転した辺の数 */
    flips: {
        overlap: number;
        forbidden: number;
        polish: number;
    };
} | {
    ok: false;
    reason: ReplaceFailure;
};
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
/** 辺の鍵（向きによらない）。 */
export declare function edgeKey(a: number, b: number): number;
type Triangle = [number, number, number];
export declare class IncrementalMesh {
    readonly vertices: Map<number, MeshVertex>;
    readonly triangles: Map<number, Triangle>;
    /** 頂点 → その頂点を持つ三角形 */
    readonly byVertex: Map<number, Set<number>>;
    /** 辺 → その辺を持つ三角形（1 つなら網の外周の辺） */
    readonly byEdge: Map<number, number[]>;
    /** 辺の属性（{@link EDGE_REQUIRED}・{@link EDGE_HULL}・{@link EDGE_PROTECT} の和） */
    readonly edgeFlags: Map<number, number>;
    /** ok でない三角形 */
    readonly bad: Set<number>;
    /** 外周 ∂M が 1 本の輪で、両面とも単純か */
    boundarySimple: boolean;
    /** 禁止制約の三角形の数（補助頂点だけの三角形・同じ必須エッジの点だけの三角形） */
    forbiddenBoundary: number;
    forbiddenEdge: number;
    /** 差し替えを当てた回数 */
    revision: number;
    private nextVertex;
    private nextTriangle;
    /** 網の向き（紙の面の向きの符号 × 地理面の向きの符号） */
    readonly sigma: -1 | 1;
    /** 新しく作る三角形の、紙の面での頂点の並びの向き（取り込んだ網の多数決） */
    readonly forwSign: -1 | 1;
    constructor(sigma: -1 | 1, forwSign: -1 | 1);
    addVertex(ref: VertexRef, forw: Position, bakw: Position, groups?: number[]): number;
    /** 三角形を 1 つも持たない頂点を消す。 */
    dropVertex(id: number): void;
    addTriangle(a: number, b: number, c: number): number;
    removeTriangle(id: number): void;
    hasEdge(a: number, b: number): boolean;
    flagsOf(a: number, b: number): number;
    setFlag(a: number, b: number, flag: number): void;
    clearFlag(a: number, b: number, flag: number): void;
    /** 三角形の合格（S1）: 両面の向きの積が σ に等しい。面積 0 は不合格。向きは厳密な述語で取る。 */
    ok(a: number, b: number, c: number, at?: (id: number) => MeshVertex): boolean;
    /** 新しく作る三角形の合格: ok に加えて、両面とも 2×面積が閾値以上。 */
    okNew(a: number, b: number, c: number, at?: (id: number) => MeshVertex): boolean;
    /** 3 頂点が同じ群に属するなら、その群の番号（禁止制約の違反）。属さなければ undefined。 */
    forbiddenGroup(a: number, b: number, c: number): number | undefined;
    /** strict か（S1 と S2）。`bad` が空なだけでは足りない。 */
    isStrict(): boolean;
    private vertexAt;
    /** 頂点の星（その頂点を持つ三角形の全部）。 */
    star(vertex: number): Set<number>;
    /** 範囲に、頂点で接する三角形を 1 周足す。 */
    grow(range: ReadonlySet<number>): Set<number>;
    /** 三角形の頂点を、紙の面で正の向き（orient2d > 0）に並べ直す。面積 0 なら undefined。 */
    positive(id: number): Triangle | undefined;
    /**
     * 範囲の外周の輪を、有向の辺の列（範囲の内側が、紙の面で正の向きの側）で取る。
     * 範囲が円板でなければ（同じ頂点を 2 回通る・穴がある・離れている）undefined。
     */
    ringOf(range: ReadonlySet<number>): number[] | undefined;
    /**
     * 範囲 R の外周の輪を固定して、内側だけを三角形分割し直す（設計書 §5.1）。
     * 失敗したときは、網を変えない。
     *
     * 新しい三角形に okNew でないものがあれば、R' の中の辺の反転で直す（重なりの解消。§5.2）。禁止制約の
     * 三角形が増えたら、違反の三角形の所だけ反転で直し、反転した辺に protect を付ける。それでも残れば
     * "notStrict"・"forbidden" で失敗する。差し替えの後に、輪の辺を上限つきで磨く（§5.3）。
     */
    replace(range: ReadonlySet<number>, edit?: ReplaceEdit): ReplaceResult;
    /**
     * 辺を共有する 2 つの三角形の対角線を入れ替える。新しい 2 つの三角形が、紙の面で正しい向き（凸な四辺形）で、
     * 両方 okNew で、禁止制約の違反を増やさないときだけ行う。行ったら、四辺形の外周の 4 辺を返す。
     */
    flipEdge(u: number, v: number, gone?: Set<number>, born?: Set<number>): [number, number][] | undefined;
    /**
     * 磨き（§5.3）: 与えた辺から始めて、制約（required・hull・protect）でなく、外接円の条件を満たさない辺を
     * 反転する。反転したら、四辺形の外周の 4 辺を調べ直す。調べる辺の数の上限で止める（全体を回らない）。
     * 外接円の判定は厳密な不等号（同じ円の上の 4 点では反転しない。往復して止まらなくなるのを防ぐ）。
     *
     * @returns 反転した辺の数
     */
    polish(seeds: readonly (readonly [number, number])[], limit: number, gone?: Set<number>, born?: Set<number>): number;
    /**
     * 接続を変えずに、頂点の座標だけを変える（地理面だけの移動。設計書 §4.3）。星の三角形の `bad` を
     * 判定し直す。採ってよいかどうか（星の三角形が全部 okNew か）は、呼び出し側が先に確かめる。
     */
    relocate(vertex: number, forw: Position, bakw: Position): void;
    /** 網の外周 ∂M（対の無い辺）を、輪の頂点の列で取る。1 本の輪でなければ undefined。 */
    boundaryRing(): number[] | undefined;
    /** 外周 ∂M が 1 本の輪で、両面とも単純な多角形か（S2）を計算し直す。 */
    computeBoundarySimple(): boolean;
    audit(): MeshAudit;
}
export {};
