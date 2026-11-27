import type { Position } from "geojson";

type EdgeSegmentItem = [Position, number, number, number];
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
export const RATIO_MATCH_TOLERANCE = 256 * Number.EPSILON;

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
export const ULP_TOLERANCE_FACTOR = 4;

/**
 * 許容幅（比）の上限。
 *
 * 量子化の項は ULP ÷ 折れ線の全長なので、片方の面の折れ線が極端に短いと（座標が大きいまま全長が
 * 数 μm など）いくらでも大きくなり、もう片方の面の、はっきり別の折れ点まで 1 つにまとめてしまう。
 * Issue #106 の最悪の比のずれは約 65536 EPS ≈ 1.5e-11、k=4 でも 6e-11 なので、その 16 倍の余裕を
 * 見て 1e-9 を上限にする。全長 1000 px の折れ線なら 1e-6 px より離れた折れ点はまとめない。
 * 上限に当たったときは、例外にせず上限の値を使う。
 */
export const MAX_RATIO_MATCH_TOLERANCE = 1e-9;

/** |x| の 1 ULP（|x| と次に大きい倍精度数との差）。x が 0 のときは最小の非正規数。 */
export function ulp(x: number): number {
  const abs = Math.abs(x);
  if (!Number.isFinite(abs)) return NaN;
  const view = new DataView(new ArrayBuffer(8));
  view.setFloat64(0, abs);
  const exponentField = (view.getUint32(0) >>> 20) & 0x7ff;
  // 非正規数と 0 は 2^-1074、それ以外は 2^(指数部 - 1023 - 52)
  return Math.pow(2, Math.max(exponentField, 1) - 1023 - 52);
}

function maxAbsCoordinate(nodes: Position[]): number {
  let max = 0;
  for (const node of nodes) {
    max = Math.max(max, Math.abs(node[0]), Math.abs(node[1]));
  }
  return max;
}

/**
 * 1 つの必須エッジについて、両面の折れ点の比を「同じ位置」とみなす許容幅を返す。
 * 面ごとの「座標の ULP ÷ 折れ線の全長」を足すので、座標が大きく辺が短いときだけ広がる。
 * 広がる幅は {@link MAX_RATIO_MATCH_TOLERANCE} で頭打ちにする。
 *
 * @param illstNodes 紙の面の折れ線（始点・折れ点・終点）
 * @param mercNodes 地理面の折れ線（始点・折れ点・終点）
 * @param factor 量子化の項の係数 k
 */
export function edgeNodeMatchTolerance(
  illstNodes: Position[],
  mercNodes: Position[],
  factor: number = ULP_TOLERANCE_FACTOR,
): number {
  const quantization = (nodes: Position[]): number => {
    let length = 0;
    for (let i = 1; i < nodes.length; i++) {
      length += Math.sqrt(
        Math.pow(nodes[i][0] - nodes[i - 1][0], 2) +
        Math.pow(nodes[i][1] - nodes[i - 1][1], 2),
      );
    }
    // 全長 0 の折れ線は比が定義できず突き合わせが起きないので、項を足さない
    const term = ulp(maxAbsCoordinate(nodes)) / length;
    return Number.isFinite(term) ? term : 0;
  };
  const tolerance =
    RATIO_MATCH_TOLERANCE + factor * (quantization(illstNodes) + quantization(mercNodes));
  return Math.min(tolerance, MAX_RATIO_MATCH_TOLERANCE);
}

/**
 * 両面の折れ点を、比の順序を保ったまま 1 対 1 に突き合わせる。
 *
 * 比の差が許容幅以内の折れ点どうしだけを対応づけられる。対応づけられる数が最大になる突き合わせの
 * うち、比の差の合計が最小のものを採る（相手が 1 つなら従来の最寄りの突き合わせと同じ）。
 * 許容幅内の折れ点が両面に 2 個以上あっても、対応が交差して地理面の折れ線が逆戻りすることはない。
 *
 * @returns 紙の面の各折れ点に対応する地理面の添字（無ければ -1）と、その逆
 */
function matchBends(
  illst: EdgeSegmentItem[],
  merc: EdgeSegmentItem[],
  tolerance: number,
): { illstToMerc: Int32Array; mercToIllst: Int32Array } {
  const illstToMerc = new Int32Array(illst.length).fill(-1);
  const mercToIllst = new Int32Array(merc.length).fill(-1);

  // 端点（GCP と同じ位置）は対象外にし、端点付近の内点と GCP が重なるのを防ぐ
  const rows = illst.length - 2;
  const cols = merc.length - 2;
  if (rows < 1 || cols < 1) return { illstToMerc, mercToIllst };

  const near = (i: number, j: number): boolean =>
    Math.abs((merc[j + 1][3]) - (illst[i + 1][3])) <= tolerance;

  // 対応づけられる組が 1 つも無いときと、組のある範囲の外は動的計画法に入れない
  let iLo = rows;
  let iHi = -1;
  let jLo = cols;
  let jHi = -1;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (!near(i, j)) continue;
      iLo = Math.min(iLo, i);
      iHi = Math.max(iHi, i);
      jLo = Math.min(jLo, j);
      jHi = Math.max(jHi, j);
    }
  }
  if (iHi < 0) return { illstToMerc, mercToIllst };

  const h = iHi - iLo + 1;
  const w = jHi - jLo + 1;
  const stride = w + 1;
  // 表の添字は (i - iLo + 1, j - jLo + 1)。0 行・0 列は「何も使っていない」状態
  const count = new Int32Array((h + 1) * stride);
  const cost = new Float64Array((h + 1) * stride);
  // 0: 紙の面の折れ点を飛ばす / 1: 地理面の折れ点を飛ばす / 2: 対応づける
  const move = new Uint8Array((h + 1) * stride);

  const better = (c1: number, d1: number, c2: number, d2: number): boolean =>
    c1 > c2 || (c1 === c2 && d1 < d2);

  for (let r = 1; r <= h; r++) {
    for (let c = 1; c <= w; c++) {
      const here = r * stride + c;
      const up = here - stride;
      const left = here - 1;
      let bestCount = count[up];
      let bestCost = cost[up];
      let bestMove = 0;
      if (better(count[left], cost[left], bestCount, bestCost)) {
        bestCount = count[left];
        bestCost = cost[left];
        bestMove = 1;
      }
      const i = iLo + r - 1;
      const j = jLo + c - 1;
      if (near(i, j)) {
        const diag = up - 1;
        const diagCount = count[diag] + 1;
        const diagCost = cost[diag] +
          Math.abs(merc[j + 1][3] - illst[i + 1][3]);
        if (better(diagCount, diagCost, bestCount, bestCost)) {
          bestCount = diagCount;
          bestCost = diagCost;
          bestMove = 2;
        }
      }
      count[here] = bestCount;
      cost[here] = bestCost;
      move[here] = bestMove;
    }
  }

  let r = h;
  let c = w;
  while (r > 0 && c > 0) {
    const m = move[r * stride + c];
    if (m === 2) {
      const i = iLo + r - 1 + 1;
      const j = jLo + c - 1 + 1;
      illstToMerc[i] = j;
      mercToIllst[j] = i;
      r--;
      c--;
    } else if (m === 0) {
      r--;
    } else {
      c--;
    }
  }
  return { illstToMerc, mercToIllst };
}

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
 * `Tin#generatePointsSet` がこの関数を使う。
 *
 * @param illstNodes 紙の面の折れ線（始点・折れ点・終点）
 * @param mercNodes 地理面の折れ線（始点・折れ点・終点）
 * @param factor 許容幅の量子化の項の係数（既定は {@link ULP_TOLERANCE_FACTOR}。試験・実測用）
 */
export function interpolateEdgeNodes(
  illstNodes: Position[],
  mercNodes: Position[],
  factor: number = ULP_TOLERANCE_FACTOR,
): EdgeNodeItem[] {
  const tolerance = edgeNodeMatchTolerance(illstNodes, mercNodes, factor);

  // Calculate edge segments
  const segments = [illstNodes, mercNodes].map((nodes: Position[]): EdgeSegmentItem[] => {
    const lengths = nodes.map((node: Position, index: number, arr: Position[]) => {
      if (index === 0) return 0;
      const prev = arr[index - 1];
      return Math.sqrt(
        Math.pow(node[0] - prev[0], 2) + Math.pow(node[1] - prev[1], 2),
      );
    });

    const accumLengths = lengths.reduce((acc: number[], len: number, idx: number) => {
      if (idx === 0) return [0];
      acc.push(acc[idx - 1] + len);
      return acc;
    }, [] as number[]);

    return accumLengths.map((accum: number, idx: number, arr: number[]): EdgeSegmentItem => {
      const ratio = accum / arr[arr.length - 1];
      return [nodes[idx], lengths[idx], accumLengths[idx], ratio];
    });
  });

  const { illstToMerc, mercToIllst } = matchBends(segments[0], segments[1], tolerance);
  const matchedTo = [illstToMerc, mercToIllst];

  // 突き合わせで余った折れ点が、相手面のいずれかの折れ点と許容幅内で一致するか。許容幅は上限つきなので、
  // 一致するのは同じ位置とみなせる折れ点だけ
  const absorbed = (ratio: number, otherSegment: EdgeSegmentItem[]): boolean => {
    for (let i = 1; i < otherSegment.length - 1; i++) {
      if (Math.abs((otherSegment[i][3]) - ratio) <= tolerance) return true;
    }
    return false;
  };

  // Generate edge nodes
  const edgeNodes: EdgeNodeItem[] = [];
  segments.forEach((segment: EdgeSegmentItem[], idx: number) => {
    const otherSegment = segments[idx ? 0 : 1];
    segment.forEach((item: EdgeSegmentItem, index: number) => {
      // 端点（GCP と同じ位置）からは中継点を作らない
      if (index === 0 || index === segment.length - 1) return;

      const node = item[0];
      const ratio = item[3];
      const matched = matchedTo[idx][index];

      if (matched >= 0) {
        // 対応する折れ点は紙の面の走査で 1 つにまとめて作る。地理面の走査では作り直さない
        if (idx === 0) {
          edgeNodes.push([node, otherSegment[matched][0], ratio]);
        }
        return;
      }

      // 許容幅の中の余りは、同じ位置とみなして作らない（上限があるので、別の折れ点を消すことはない）
      if (absorbed(ratio, otherSegment)) return;

      // 一致する折れ点が無ければ、比が入る区間を線形補間する
      for (let i = 0; i < otherSegment.length - 1; i++) {
        const curr = otherSegment[i];
        const next = otherSegment[i + 1];
        const currRatio = curr[3];
        const nextRatio = next[3];
        if (currRatio < ratio && nextRatio > ratio) {
          const ratioInSegment = (ratio - currRatio) / (nextRatio - currRatio);
          const interpNode: Position = [
            (next[0][0] - curr[0][0]) *
            ratioInSegment + curr[0][0],
            (next[0][1] - curr[0][1]) *
            ratioInSegment + curr[0][1],
          ];
          edgeNodes.push(
            idx === 0
              ? [node, interpNode, ratio]
              : [interpNode, node, ratio],
          );
          return;
        }
      }

      // 比がどの区間にも入らない（比が端点と一致するなどの退化した入力）ときは中継点を作らない
    });
  });

  // 比の順に並べる。同値のときは作成順（stable sort）を保つ
  return edgeNodes.sort((a: EdgeNodeItem, b: EdgeNodeItem) => a[2] - b[2]);
}
