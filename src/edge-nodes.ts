import type { Position } from "geojson";

type EdgeSegmentItem = [Position, number, number, number, string?];
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
export const RATIO_MATCH_TOLERANCE = 256 * Number.EPSILON;

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
export function interpolateEdgeNodes(illstNodes: Position[], mercNodes: Position[]): EdgeNodeItem[] {
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

  // Generate edge nodes
  const edgeNodes: EdgeNodeItem[] = [];
  segments.forEach((segment: EdgeSegmentItem[], idx: number) => {
    const otherSegment = segments[idx ? 0 : 1];
    segment.forEach((item: EdgeSegmentItem, index: number) => {
      // 端点（GCP と同じ位置）と対応が確定した折れ点からは中継点を作らない
      if (
        index === 0 ||
        index === segment.length - 1 ||
        item[4] === "handled"
      ) {
        return;
      }
      const node = item[0];
      const ratio = item[3] as number;

      // 許容幅内で最も近い相手の折れ点を探す。丸めで比が数 ULP ずれた対応する
      // 折れ点はここで 1 つにまとまる。相手面の端点は GCP の位置そのものなので
      // 対象外にし、端点付近の内点と GCP が重なるのを防ぐ。
      let matched: EdgeSegmentItem | undefined;
      let matchedDiff = Infinity;
      for (let i = 1; i < otherSegment.length - 1; i++) {
        const curr = otherSegment[i];
        if (curr[4] === "handled") continue;
        const diff = Math.abs((curr[3] as number) - ratio);
        if (diff <= RATIO_MATCH_TOLERANCE && diff < matchedDiff) {
          matched = curr;
          matchedDiff = diff;
        }
      }

      if (matched) {
        // 両側を対応確定にして、逆方向の走査でもう一度中継点を作らせない
        matched[4] = "handled";
        item[4] = "handled";
        edgeNodes.push(
          idx === 0
            ? [node, matched[0], ratio]
            : [matched[0], node, ratio],
        );
        return;
      }

      // 一致する折れ点が無ければ、比が入る区間を線形補間する
      for (let i = 0; i < otherSegment.length - 1; i++) {
        const curr = otherSegment[i];
        const next = otherSegment[i + 1];
        const currRatio = curr[3] as number;
        const nextRatio = next[3] as number;
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
