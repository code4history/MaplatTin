import { Position } from 'geojson';
import { EdgeId, IncrementalMesh, PointId, ReplaceFailure, VertexRef } from "./mesh.js";
import { MeshModel } from "./model.js";
/** 範囲を広げる回数の上限。 */
export declare const MAX_GROW = 3;
export type EditFailure = ReplaceFailure
/** 局所更新の対象でない編集（帯に触れる・world file 外周の網、など） */
 | "unsupported"
/** 同じ位置に、既に頂点がある */
 | "duplicate" | "unknownPoint" | "unknownEdge" | "idInUse";
/** 編集で変わった頂点。 */
export interface VertexChanges {
    /** 増えた頂点の id */
    added: number[];
    /** 消えた頂点の指し方 */
    removed: VertexRef[];
    /** 座標が変わった頂点の id */
    moved: number[];
}
export type EditResult = {
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
    flips: {
        overlap: number;
        forbidden: number;
        polish: number;
    };
    vertices: VertexChanges;
} | {
    ok: false;
    reason: EditFailure;
};
/** 点を含む三角形を、近くの三角形から歩いて探す。途中で通った三角形も返す。網の外なら undefined。 */
export declare function locate(mesh: IncrementalMesh, point: Position, hint: number): {
    triangle: number;
    path: number[];
} | undefined;
/**
 * 点を足したときに壊れる三角形（空洞）: 点を含む三角形から、制約の辺（必須エッジ・凸包の辺）を越えずに
 * たどれる三角形のうち、外接円が点を含むもの。
 */
export declare function cavity(mesh: IncrementalMesh, point: Position, start: number): Set<number>;
/**
 * 線分 ab が触れる三角形（線分が通る三角形と、端点・途中の頂点で触れるだけの三角形）。
 * a を含む三角形から、線分に触れる三角形を辺づたいにたどる。a が網の外なら undefined。
 */
export declare function crossed(mesh: IncrementalMesh, a: Position, b: Position, hint: number): Set<number> | undefined;
/** 編集の関数に共通の指定。 */
export interface EditOptions {
    /**
     * 帯を更新しなくてよい条件（§6.3）を見ない。当てた後に、呼び出し側が帯を差し替えること
     * （`refreshBand`）。帯に触れる編集を、「点の編集」と「帯の差し替え」の 2 回の差し替えで当てるときに使う。
     */
    force?: boolean;
}
/**
 * 対応点を動かす。
 *
 * - 中継点のある必須エッジの端点は、その必須エッジの中継点が全部動く（片方の面だけを動かした場合も）。
 *   付いている必須エッジの全部を、1 回の差し替えで同時に張り替える（§4.4）。
 * - それ以外で、紙の面が変わらなければ、接続を変えずに星の三角形を判定し直す（§4.3）。
 */
export declare function movePoint(model: MeshModel, id: PointId, to: {
    forw?: Position;
    bakw?: Position;
}, options?: EditOptions): EditResult;
/** 対応点を足す。R0 は、点の空洞。 */
export declare function insertPoint(model: MeshModel, id: PointId, forw: Position, bakw: Position, position?: number, options?: EditOptions): EditResult;
/** 対応点を消す。R0 は、点の星。必須エッジの端点は、先に必須エッジを外すこと。 */
export declare function removePoint(model: MeshModel, id: PointId, options?: EditOptions): EditResult;
/**
 * 対応点に付いた補完点（その点を、凸包の辺の端点か、凹みの点にしている補完点）を消す。
 * 補完点は、凸包の辺の所に足した「辺を持たない点」なので、星を差し替えるだけで消える。消した後は、
 * 呼び出し側が帯を差し替えること（補完点は、重心・凸包の計算には入らないが、帯の内側の輪を変える）。
 */
export declare function removeSupplementsOf(model: MeshModel, id: PointId): EditResult[];
/**
 * 必須エッジを足す。R0 は、新しい区間が触れる三角形（線分が既に網の辺なら、印を付けるだけ）。
 * 折れ点があれば、両面の折れ線を累積長の比で突き合わせて、中継点を作る。
 */
export declare function insertEdge(model: MeshModel, id: EdgeId, start: PointId, end: PointId, forwNodes?: Position[], bakwNodes?: Position[], position?: number, options?: EditOptions): EditResult;
/** 必須エッジを外す。中継点は消える。R0 は、中継点の星（直線なら、辺の両側の 2 つの三角形）。 */
export declare function removeEdge(model: MeshModel, id: EdgeId, options?: EditOptions): EditResult;
/** 必須エッジの折れ点を差し替える（足す・消す・動かす）。全部の区間と全部の中継点を張り替える。 */
export declare function replaceEdgeNodes(model: MeshModel, id: EdgeId, forwNodes: Position[], bakwNodes: Position[], options?: EditOptions): EditResult;
