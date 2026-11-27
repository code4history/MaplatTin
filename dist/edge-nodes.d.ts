import { Position } from 'geojson';
/** [紙の面の位置, 地理面の位置, 折れ線の全長に対する比] */
export type EdgeNodeItem = [Position, Position, number];
/**
 * 両面の折れ点を「同じ位置」とみなす累積長比の許容幅のうち、座標によらない固定の分。
 *
 * 比は 0 以上 1 以下なので絶対許容幅で足りる。`Math.sqrt` と加算・除算の丸めだけで
 * 生じる比のずれは理論上 (2n+12)×Number.EPSILON（n は片側のセグメント数、実測では
 * 最大 2×Number.EPSILON）に収まるため、実測値の 128 倍・理論値（n=122）を覆う
 * 256×Number.EPSILON を採る。座標そのものの量子化によるずれは、この固定の分では
 * 覆えないので、折れ線ごとに {@link edgeNodeMatchTolerance} で足す。
 *
 * 正当に別の位置にある折れ点の比の間隔は、tests/compiled の実地図 2 件（折れ点つきの辺 272 本。
 * 奈良町の 220 本と延岡の 52 本）で、両面の折れ点の比の差が最小 5.8e-5、同じ面の隣り合う折れ点の
 * 間隔が最小 1.1e-2 だった。合成の悪条件（全長 1e7 で折れ点間 0.1mm）でも 1e-11 ある。
 * 固定の分はそれより十分に小さいので、誤って結びつかない。
 */
export declare const RATIO_MATCH_TOLERANCE: number;
/**
 * 座標の量子化によるずれを許容幅へ足すときの係数 k。
 *
 * 許容幅 = {@link RATIO_MATCH_TOLERANCE} + k × (ulp(紙の面の最大絶対座標) ÷ 紙の面の折れ線の全長
 * + ulp(地理面の最大絶対座標) ÷ 地理面の折れ線の全長)。
 * 座標が大きく辺が短いほど、座標の ULP ÷ 折れ線の全長が大きくなり、比のずれがその分だけ増える。
 * 係数は Issue #106 の条件（紙面 2000〜14000 px・倍率 50〜150・地理面 1.5e7 付近・辺は 30 px 以内と
 * 数千 px、各 4000 回。30 px 以内は折れ点 1・2〜5・6〜20 個の 3 通り）の実測で決めた。k=1 と 2 では
 * 例外こそ 0 件だが、折れ点 6〜20 個で対応する折れ点が 2 つに割れる試行が残り（k=1 で 1123 件、
 * k=2 で 41 件）、k=4 で例外・割れ・誤ってまとめた折れ点がすべて 0 件になる。
 * k=4 でも、別の折れ点を誤ってまとめるのは、折れ点どうしが紙面距離 1.3e-10 px 以下しか離れていない
 * ときだけで、紙面距離 1e-3 px 以上離れた折れ点を誤ってまとめた試行は k=8 まで 0 件だった。
 */
export declare const ULP_TOLERANCE_FACTOR = 4;
/**
 * 許容幅（比）の上限。
 *
 * 量子化の項は ULP ÷ 折れ線の全長なので、片方の面の折れ線が極端に短いと（座標が大きいまま全長が
 * 数 μm など）いくらでも大きくなり、もう片方の面の、はっきり別の折れ点まで 1 つにまとめてしまう。
 * Issue #106 の最悪の比のずれは約 65536 EPS ≈ 1.5e-11、k=4 でも 6e-11 なので、その 16 倍の余裕を
 * 見て 1e-9 を上限にする。全長 1000 px の折れ線なら 1e-6 px より離れた折れ点はまとめない。
 * 上限に当たったときは、例外にせず上限の値を使う。
 */
export declare const MAX_RATIO_MATCH_TOLERANCE = 1e-9;
/** |x| の 1 ULP（|x| と次に大きい倍精度数との差）。x が 0 のときは最小の非正規数。 */
export declare function ulp(x: number): number;
/**
 * 1 つの必須エッジについて、両面の折れ点の比を「同じ位置」とみなす許容幅を返す。
 * 面ごとの「座標の ULP ÷ 折れ線の全長」を足すので、座標が大きく辺が短いときだけ広がる。
 * 広がる幅は {@link MAX_RATIO_MATCH_TOLERANCE} で頭打ちにする。
 *
 * @param illstNodes 紙の面の折れ線（始点・折れ点・終点）
 * @param mercNodes 地理面の折れ線（始点・折れ点・終点）
 * @param factor 量子化の項の係数 k
 */
export declare function edgeNodeMatchTolerance(illstNodes: Position[], mercNodes: Position[], factor?: number): number;
/**
 * 必須エッジの中継点を作る。両面の折れ線（端点を含む）を、累積長の比で突き合わせ、片方の面の折れ点を
 * 相手の面へ写す。比の順に並べて返す。
 *
 * 比が許容幅内に一致する折れ点同士は、比の順序を保ったまま 1 つの中継点へまとめ、どちらの面の折れ点の
 * 位置もそのまま使う。許容幅は {@link edgeNodeMatchTolerance} で折れ線ごとに決める。
 * 一致する相手が無ければ、相手面の該当する区間を線形補間する。丸めで比がわずかにずれただけの
 * 対応する折れ点を 2 つに分けて作らせないため、範囲チェックより前に許容幅内の相手を探す。
 *
 * 突き合わせで余った折れ点が、相手面の折れ点と許容幅内で一致するとき（同じ面の 2 つの折れ点が
 * 同じ相手の許容幅に入る退化した入力）は、許容幅の中の余りなので同じ位置とみなし、中継点を作らない。
 * 作ると、ほぼ同じ位置の中継点が 2 つでき、三角網から外れて構築に失敗するため。許容幅には上限
 * （{@link MAX_RATIO_MATCH_TOLERANCE}）があるので、はっきり別の折れ点をこの経路で消すことはない。
 *
 * `Tin#generatePointsSet`（全部組み直し）と、局所更新（必須エッジの端点・折れ点の編集）が、同じ関数を使う。
 *
 * @param illstNodes 紙の面の折れ線（始点・折れ点・終点）
 * @param mercNodes 地理面の折れ線（始点・折れ点・終点）
 * @param factor 許容幅の量子化の項の係数（既定は {@link ULP_TOLERANCE_FACTOR}。試験・実測用）
 */
export declare function interpolateEdgeNodes(illstNodes: Position[], mercNodes: Position[], factor?: number): EdgeNodeItem[];
