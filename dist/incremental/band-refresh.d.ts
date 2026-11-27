import { VertexMode } from '@maplat/transform';
import { VertexRef } from "./mesh.js";
import { MeshModel } from "./model.js";
export type BandRefresh = {
    ok: true;
    /** 消えた三角形・増えた三角形の id */
    removed: number[];
    added: number[];
    /** 消えた補助頂点の指し方と、増えた補助頂点の id */
    removedVertices: VertexRef[];
    addedVertices: number[];
    /** 採った余白 */
    margin: number;
} | {
    ok: false;
    reason: "bandNotAnnulus" | "bandFailed";
};
/**
 * 帯を差し替える。余白を小さい順に試し、差し替えが成り立った（新しい三角形が全部 okNew・外周が両面で単純・
 * 禁止制約が増えない）最初の余白を採る。どの余白でも成り立たなければ、網を変えずに失敗を返す。
 */
export declare function refreshBand(model: MeshModel, vertexMode: VertexMode | undefined): BandRefresh;
