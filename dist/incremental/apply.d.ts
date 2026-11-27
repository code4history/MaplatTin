import { EdgeSet, PointSet, VertexMode } from '@maplat/transform';
import { EdgeId, PointId } from "./mesh.js";
import { MeshModel } from "./model.js";
import { TinEdit, TinPatch, TinPatchFallback } from "./types.js";
/** 対応点と必須エッジ（座標は内部の座標系）と、その id の並び。 */
export interface TinInputs {
    points: PointSet[];
    edges: EdgeSet[];
    pointIds: PointId[];
    edgeIds: EdgeId[];
}
/**
 * 編集を入力に当てた結果を返す（もとの入力は変えない）。id が無い・既に使われている、などの
 * 当てられない編集は、何も変えずに例外を投げる。
 */
export declare function applyToInputs(inputs: TinInputs, edits: readonly TinEdit[], follow: boolean): TinInputs;
/**
 * 編集の列を、網に順に当てる。1 つでも局所で済まなければ、理由を返す（網は途中まで変わっているので、
 * 呼び出し側は網を捨てて全部組み直す）。全部が済めば、差分を返す。
 *
 * 編集 1 つは、それに関わる必須エッジの区間と中継点を、1 回の差し替えで同時に張り替える（途中の状態を
 * 網にしない）。編集どうしは、順に当てる（どの時点の網も、その時点までの入力の strict な網である）。
 *
 * `band` を渡すと、帯（補助頂点・重心）に触れる編集も当てる: 点の編集を当てた後に、帯を 1 回差し替える。
 * 帯の差し替えが成り立たなければ "bandFailed"・"bandNotAnnulus" を返す。
 */
export declare function applyToMesh(model: MeshModel, edits: readonly TinEdit[], follow: boolean, band?: {
    vertexMode: VertexMode | undefined;
}, 
/** 編集が帯に触れなくても、帯を差し替える（保存の直前に、帯を最新にするとき） */
forceBand?: boolean): {
    ok: true;
    patch: Omit<TinPatch, "revision" | "mode" | "boundaryStale">;
    refreshed: boolean;
} | {
    ok: false;
    reason: TinPatchFallback;
};
