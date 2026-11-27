import { Position } from 'geojson';
/** [紙の面の位置, 地理面の位置, 折れ線の全長に対する比] */
export type EdgeNodeItem = [Position, Position, number];
/**
 * 必須エッジの中継点を作る。両面の折れ線（端点を含む）を、累積長の比で突き合わせ、片方の面の折れ点を
 * 相手の面へ写す。比の順に並べて返す。
 *
 * `Tin#generatePointsSet`（全部組み直し）と、局所更新（必須エッジの端点・折れ点の編集）が、同じ関数を使う。
 *
 * @param illstNodes 紙の面の折れ線（始点・折れ点・終点）
 * @param mercNodes 地理面の折れ線（始点・折れ点・終点）
 */
export declare function interpolateEdgeNodes(illstNodes: Position[], mercNodes: Position[]): EdgeNodeItem[];
