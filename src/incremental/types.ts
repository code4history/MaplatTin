/**
 * 局所更新の受け渡しの型（MaplatTin#100。設計書 §9.2）。第 1 週は型だけを固定する
 * （`Tin#applyEdits` は第 2 週）。Editor の状態つき worker と、表示用の網が、この型を前提にする。
 */
import type { Position } from "geojson";
import type { StrictStatus } from "@maplat/transform";
import type { SupplementPair } from "../supplement-pairs.ts";
import type { EdgeId, PointId, ReplaceFailure, VertexRef } from "./mesh.ts";

/**
 * 編集。座標は、`setPoints` に渡すのと同じ、外の座標系（follow のときも反転しない値）。
 * `position` は、compiled に書くときの並びの中で、何番目に入れるか（省略時は末尾）。
 */
export type TinEdit =
  | {
      type: "addPoint";
      id: PointId;
      forw: Position;
      bakw: Position;
      position?: number;
    }
  | { type: "removePoint"; id: PointId }
  | { type: "movePoint"; id: PointId; forw?: Position; bakw?: Position }
  | {
      type: "addEdge";
      id: EdgeId;
      start: PointId;
      end: PointId;
      forwNodes: Position[];
      bakwNodes: Position[];
      position?: number;
    }
  | { type: "removeEdge"; id: EdgeId }
  | {
      type: "replaceEdgeNodes";
      id: EdgeId;
      forwNodes: Position[];
      bakwNodes: Position[];
    };

/** 全部組み直しへ落ちた理由。 */
export type TinPatchFallback =
  // 差し替えの失敗（範囲を広げても解消しなかったもの）
  | ReplaceFailure
  // 帯の差し替えの失敗
  | "bandNotAnnulus"
  | "bandFailed"
  // 局所更新の対象でない網・編集
  | "unsupported"
  // baseRevision が、網の今の版と合わない。このとき worker の網は古いので、Editor は getCompiled() で
  // 取り直すのではなく、最新の入力（対応点・必須エッジの全部）で rebuild を送り直す
  | "revisionMismatch"
  // 網をまだ持っていない（最初の呼び出し）
  | "noMesh";

/** 編集を当てた結果の差分。座標は、網の内部の座標系（compiled と同じ）。 */
export interface TinPatch {
  /** この差分を当てた後の版。次の applyEdits に、この番号を前提として渡す */
  revision: number;
  /** "local" は局所更新で済んだ。"full" は全部組み直しへ落ちた（理由つき） */
  mode: "local" | "full";
  fallbackReason?: TinPatchFallback;
  strict_status: StrictStatus;
  // mode が "full" なら、下の差分は無い。Editor は getCompiled() で全部を取り直す
  // （"revisionMismatch" だけは、rebuild を送り直す）

  /** 座標が変わった頂点（接続が変わらなくても入る） */
  movedVertices?: { ref: VertexRef; forw: Position; bakw: Position }[];
  removedVertices?: VertexRef[];
  addedVertices?: { ref: VertexRef; forw: Position; bakw: Position }[];
  /** 消えた三角形の id と、増えた三角形。接続が変わらなければ、どちらも空 */
  removedTriangles?: number[];
  addedTriangles?: { id: number; vertices: [VertexRef, VertexRef, VertexRef] }[];
  /** 重心・補助頂点の扇形の値が変わったときだけ入る（帯を差し替えたとき） */
  centroid?: { forw: Position; bakw: Position };
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
