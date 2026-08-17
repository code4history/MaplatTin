import { TinsBD } from '@maplat/transform';
import { SearchIndex } from "./searchutils";
type ConstraintEdges = number[][];
/**
 * pointsSet 内の配列位置 → 頂点 index（properties.target.index）の対応表。
 * GCP は数値、エッジ中間ノードは "e12"、境界頂点は "b3" のような文字列。
 */
export type PointIndices = readonly (number | string)[];
/**
 * 制約エッジを searchIndex のキー形式へ正規化した集合を作る。
 *
 * 二つの名前空間が混在している点に注意すること:
 * - `edges` の要素は **pointsSet 内の配列位置**（数値）
 * - searchIndex のキーは **頂点 index**（properties.target.index。
 *   GCP は数値だがエッジ中間ノードは "e58" のような文字列）
 *
 * GCP は「配列位置 == index」なので偶然一致するが、エッジ中間ノードは
 * 配列位置と `e` の連番が別物であり、対応表なしでは一致しない。
 * そのため pointIndices で配列位置を頂点 index へ引き直してからキー化する。
 *
 * キーの作り方は searchutils.ts の calcSearchKeys と厳密に揃える
 * （String 化 → sort（既定の文字列比較）→ "-" 連結）。
 */
export declare function buildConstraintEdgeKeys(edges: ConstraintEdges, pointIndices?: PointIndices): Set<string>;
export declare function resolveOverlaps(tins: TinsBD, searchIndex: SearchIndex, edges: ConstraintEdges, pointIndices?: PointIndices): boolean;
export {};
