import { Position } from 'geojson';
/** [紙の面の位置, 地理面の位置, 折れ線の全長に対する比] */
export type EdgeNodeItem = [Position, Position, number];
/**
 * 両面の折れ点を「同じ位置」とみなす累積長比の許容幅。
 *
 * 比は 0 以上 1 以下なので絶対許容幅で足りる。`Math.sqrt` と加算・除算の丸めだけで
 * 生じる比のずれは理論上 (2n+12)×Number.EPSILON（n は片側のセグメント数、実測では
 * 最大 2×Number.EPSILON）に収まるため、実測値の 128 倍・理論値（n=122）を覆う
 * 256×Number.EPSILON を採る。正当に別の位置にある折れ点の比の間隔は実データで
 * 6.9e-3 以上（合成の悪条件でも 1e-11）あるため、この幅では誤って結びつかない。
 */
export declare const RATIO_MATCH_TOLERANCE: number;
/**
 * 必須エッジの中継点を作る。両面の折れ線（端点を含む）を、累積長の比で突き合わせ、片方の面の折れ点を
 * 相手の面へ写す。比の順に並べて返す。
 *
 * 比が許容幅内に一致する折れ点同士は 1 つの中継点へまとめ、どちらの面の折れ点の位置もそのまま使う。
 * 一致する相手が無ければ、相手面の該当する区間を線形補間する。丸めで比がわずかにずれただけの
 * 対応する折れ点を 2 つに分けて作らせないため、範囲チェックより前に許容幅内の最寄りを探す。
 *
 * `Tin#generatePointsSet`（全部組み直し）と、局所更新（必須エッジの端点・折れ点の編集）が、同じ関数を使う。
 *
 * @param illstNodes 紙の面の折れ線（始点・折れ点・終点）
 * @param mercNodes 地理面の折れ線（始点・折れ点・終点）
 */
export declare function interpolateEdgeNodes(illstNodes: Position[], mercNodes: Position[]): EdgeNodeItem[];
