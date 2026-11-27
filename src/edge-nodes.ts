import type { Position } from "geojson";

type EdgeSegmentItem = [Position, number, number, number, string?];
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
  return segments
    .map((segment: EdgeSegmentItem[], idx: number) => {
      const otherSegment = segments[idx ? 0 : 1];
      return segment
        .filter((item: EdgeSegmentItem, index: number) => {
          return !(
            index === 0 ||
            index === segment.length - 1 ||
            item[4] === "handled"
          );
        })
        .flatMap((item: EdgeSegmentItem): EdgeNodeItem[] => {
          const node = item[0];
          const ratio = item[3];

          const counterpart = otherSegment.reduce(
            (prev: EdgeSegmentItem[] | undefined, curr: EdgeSegmentItem, currIdx: number, arr: EdgeSegmentItem[]) => {
              if (prev) return prev;
              const nextItem = arr[currIdx + 1];
              if (curr[3] === ratio) {
                curr[4] = "handled";
                return [curr];
              }
              if (
                curr[3] < ratio && nextItem &&
                nextItem[3] > ratio
              ) {
                return [curr, nextItem];
              }
              return undefined;
            },
            undefined as EdgeSegmentItem[] | undefined,
          );

          if (counterpart && counterpart.length === 1) {
            return idx === 0
              ? [[node, counterpart[0][0], ratio]]
              : [[counterpart[0][0], node, ratio]];
          }

          if (counterpart && counterpart.length === 2) {
            const curr = counterpart[0];
            const next = counterpart[1];
            const ratioInSegment = (ratio - (curr[3] as number)) /
              ((next[3] as number) - (curr[3] as number));
            const interpNode: Position = [
              (next[0][0] - curr[0][0]) *
              ratioInSegment + curr[0][0],
              (next[0][1] - curr[0][1]) *
              ratioInSegment + curr[0][1],
            ];
            return idx === 0
              ? [[node, interpNode, ratio]]
              : [[interpNode, node, ratio]];
          }

          return [];
        });
    })
    .reduce((prev: EdgeNodeItem[], curr: EdgeNodeItem[]) => prev.concat(curr), [])
    .sort((a: EdgeNodeItem, b: EdgeNodeItem) => a[2] < b[2] ? -1 : 1);
}
