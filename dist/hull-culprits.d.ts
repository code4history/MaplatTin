import { Edge, Tins } from '@maplat/transform';
type VertexId = number | string;
/**
 * strict を壊した凸包の辺を特定する。
 *
 * 地図面の三角網 `forw` を地理面へ写した三角形（逆変換用）のうち、向きが他と食い違う（反転・面積 0）か、
 * 内部が他の三角形と重なるものを探す。補助頂点を含む三角形か、凸包の辺に接する三角形が関わるものだけを
 * 数える（GCP だけの三角形どうしの重なりは、凸包の辺では直らない）。
 *
 * 原因の辺は、次の順で選ぶ。
 * 1. 反転・重なりに関わる三角形が接している凸包の辺
 * 2. 1 が無いとき、関わる三角形の GCP の頂点を端点にする凸包の辺
 *
 * @param forw 地図面の三角網
 * @param hull 制約にした地図面の凸包の辺（`pointIndices` で引く位置の組）
 * @param pointIndices 位置から頂点の添字（GCP は数、中継点は "e12"）への対応
 */
export declare function findHullCulprits(forw: Tins, hull: readonly Edge[], pointIndices: readonly VertexId[]): Edge[];
export {};
