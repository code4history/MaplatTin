import { Position } from "geojson";

/**
 * エッジの終点を表す型
 * [始点のインデックス, 終点のインデックス]
 */
export type Edge = [number, number];

/**
 * エッジセットの型
 * [始点と終点の間の中間点群（地図座標系）, 
 *  始点と終点の間の中間点群（変換先座標系）,
 *  始点と終点のインデックスペア]
 */
export type EdgeSet = [Position[], Position[], Edge];

/**
 * 古いバージョンのエッジセット型
 * @deprecated 2.00703以降は EdgeSet を使用
 */
export type EdgeSetLegacy = {
  illstNodes: Position[];
  mercNodes: Position[];
  startEnd: Edge;
};

/**
 * エッジセットを正規化する
 * 古いバージョンのフォーマットを新しいフォーマットに変換する
 * 
 * @param edges エッジセット配列
 * @param version バージョン番号（オプション）
 * @returns 正規化されたエッジセット配列
 */
function normalizeEdges(
  edges: EdgeSet[] | EdgeSetLegacy[],
  version?: number
): EdgeSet[] {
  if ((version && version >= 2.00703) || Array.isArray(edges[0]))
    return edges as EdgeSet[];
  return (edges as EdgeSetLegacy[]).map(edge => [
    edge.illstNodes,
    edge.mercNodes,
    edge.startEnd
  ]);
}

export { normalizeEdges };