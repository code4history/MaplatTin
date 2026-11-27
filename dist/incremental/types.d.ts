import { Position } from 'geojson';
import { StrictStatus } from '@maplat/transform';
import { SupplementPair } from "../supplement-pairs.js";
import { EdgeId, PointId, ReplaceFailure, VertexRef } from "./mesh.js";
/**
 * 編集。座標は、`setPoints` に渡すのと同じ、外の座標系（follow のときも反転しない値）。
 * `position` は、compiled に書くときの並びの中で、何番目に入れるか（省略時は末尾）。
 */
export type TinEdit = {
    type: "addPoint";
    id: PointId;
    forw: Position;
    bakw: Position;
    position?: number;
} | {
    type: "removePoint";
    id: PointId;
} | {
    type: "movePoint";
    id: PointId;
    forw?: Position;
    bakw?: Position;
} | {
    type: "addEdge";
    id: EdgeId;
    start: PointId;
    end: PointId;
    forwNodes: Position[];
    bakwNodes: Position[];
    position?: number;
} | {
    type: "removeEdge";
    id: EdgeId;
} | {
    type: "replaceEdgeNodes";
    id: EdgeId;
    forwNodes: Position[];
    bakwNodes: Position[];
};
/** 全部組み直しへ落ちた理由。 */
export type TinPatchFallback = ReplaceFailure | "bandNotAnnulus" | "bandFailed" | "unsupported" | "revisionMismatch" | "noMesh";
/** 編集を当てた結果の差分。座標は、網の内部の座標系（compiled と同じ）。 */
export interface TinPatch {
    /** この差分を当てた後の版。次の applyEdits に、この番号を前提として渡す */
    revision: number;
    /** "local" は局所更新で済んだ。"full" は全部組み直しへ落ちた（理由つき） */
    mode: "local" | "full";
    fallbackReason?: TinPatchFallback;
    strict_status: StrictStatus;
    /** 座標が変わった頂点（接続が変わらなくても入る） */
    movedVertices?: {
        ref: VertexRef;
        forw: Position;
        bakw: Position;
    }[];
    removedVertices?: VertexRef[];
    addedVertices?: {
        ref: VertexRef;
        forw: Position;
        bakw: Position;
    }[];
    /** 消えた三角形の id と、増えた三角形。接続が変わらなければ、どちらも空 */
    removedTriangles?: number[];
    addedTriangles?: {
        id: number;
        vertices: [VertexRef, VertexRef, VertexRef];
    }[];
    /** 重心・補助頂点の扇形の値が変わったときだけ入る（帯を差し替えたとき） */
    centroid?: {
        forw: Position;
        bakw: Position;
    };
    verticesParams?: number[][];
    /** 補完点の一覧が変わったときだけ入る */
    supplementPairs?: SupplementPair[];
    /** ok でない三角形の id（変わったときだけ入る） */
    badTriangles?: number[];
    /** 補助頂点・重心が最新でない。清書か、帯の差し替えで解消する */
    boundaryStale: boolean;
    /** 差し替えた範囲の外接矩形（紙の面） */
    dirtyBounds?: [number, number, number, number];
}
