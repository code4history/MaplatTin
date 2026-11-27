import { Position } from 'geojson';
import { IncrementalMesh, PointId, ReplaceFailure } from "./mesh.js";
import { MeshModel } from "./model.js";
/** 範囲を広げる回数の上限。 */
export declare const MAX_GROW = 3;
export type EditFailure = ReplaceFailure
/** 第 1 週の対象でない編集 */
 | "unsupported"
/** 同じ位置に、既に頂点がある */
 | "duplicate" | "unknownPoint" | "idInUse";
export type EditResult = {
    ok: true;
    /** "moved" は座標だけ（接続は変わらない）。"replaced" は範囲を差し替えた */
    mode: "moved" | "replaced";
    removed: number[];
    added: number[];
    /** 範囲を広げた回数と、差し替えた範囲の三角形の数 */
    grown: number;
    size: number;
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
 * 対応点を動かす。紙の面が変わらなければ、接続を変えずに星の三角形を判定し直す（§4.3）。
 * 変わるなら、R0 = 星 ∪（新しい位置が星の外なら）そこまでに通る三角形 ∪ 新しい位置の空洞。
 */
export declare function movePoint(model: MeshModel, id: PointId, to: {
    forw?: Position;
    bakw?: Position;
}): EditResult;
/** 対応点を足す。R0 は、点の空洞。 */
export declare function insertPoint(model: MeshModel, id: PointId, forw: Position, bakw: Position, position?: number): EditResult;
/** 対応点を消す。R0 は、点の星。必須エッジの端点は、先に必須エッジを外す（第 2 週）。 */
export declare function removePoint(model: MeshModel, id: PointId): EditResult;
