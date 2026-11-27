import { describe, expect, it } from "vitest";
import type { Position } from "geojson";
import { featureCollection, point } from "@turf/turf";
import { convexHullEdges, hullEdgeKey } from "../src/hull-edges.ts";
import { buildConstrainedTin } from "../src/constrained-tin.ts";
import type { Edge } from "@maplat/transform";

const sorted = (edges: Edge[]) =>
  edges.map(([a, b]) => (a < b ? [a, b] : [b, a])).sort((p, q) => p[0] - q[0] || p[1] - q[1]);

describe("convexHullEdges", () => {
  it("一直線に並ぶ点を含め、隣り合う点どうしを 1 本ずつの辺にする", () => {
    // 3×3 の格子。添字は y*3+x。凸包の辺の上の点（1, 3, 5, 7）も辺の端点になる
    const grid: Position[] = [0, 1, 2].flatMap((y) => [0, 1, 2].map((x) => [x, y]));
    expect(sorted(convexHullEdges(grid))).toEqual(
      sorted([[0, 1], [1, 2], [2, 5], [5, 8], [8, 7], [7, 6], [6, 3], [3, 0]])
    );
  });

  it("凸包の内側の点（わずかに内側の点を含む）は辺に入れない", () => {
    const points: Position[] = [[0, 0], [10, 0], [10, 10], [0, 10], [5, 5], [5, 0.001]];
    expect(sorted(convexHullEdges(points))).toEqual(sorted([[0, 1], [1, 2], [2, 3], [3, 0]]));
  });

  it("座標が同じ点は最初の添字だけを使い、一直線の点しか無ければ辺を作らない", () => {
    expect(sorted(convexHullEdges([[0, 0], [4, 0], [4, 0], [4, 4], [0, 4]]))).toEqual(
      sorted([[0, 1], [1, 3], [3, 4], [4, 0]])
    );
    expect(convexHullEdges([[0, 0], [1, 1], [2, 2], [3, 3]])).toEqual([]);
    expect(convexHullEdges([[0, 0], [1, 1]])).toEqual([]);
  });
});

describe("hullEdgeKey", () => {
  it("辺の向きによらない鍵になる", () => {
    expect(hullEdgeKey([3, 12])).toBe(hullEdgeKey([12, 3]));
    expect(hullEdgeKey([3, 12])).not.toBe(hullEdgeKey([3, 13]));
  });
});

describe("buildConstrainedTin の凸包の辺", () => {
  const coordinates = [[0, 0], [10, 0], [10, 10], [0, 10], [5, 5], [5, -1], [11, 5]];
  const fc = featureCollection(
    coordinates.map((c, i) => point(c, { target: { index: i, geom: c } }))
  );
  const hasEdge = (tin: ReturnType<typeof buildConstrainedTin>["tin"], a: number, b: number) =>
    tin.features.some(({ properties }) => {
      const idx = [properties!.a, properties!.b, properties!.c].map((p) => p!.index);
      return idx.includes(a) && idx.includes(b);
    });

  it("補助頂点（5, 6）を含む三角形が食い込む配置でも、凸包の辺の両端は 1 本の辺になる", () => {
    const hull: Edge[] = [[0, 1], [1, 2], [2, 3], [3, 0]];
    const { tin } = buildConstrainedTin(fc, [], "target", {
      groupsOf: () => [],
      planes: [],
      hull
    });
    for (const [a, b] of hull) expect(hasEdge(tin, a, b)).toBe(true);
  });

  it("制約にできた凸包の辺を返す", () => {
    const hull: Edge[] = [[0, 1], [1, 2], [2, 3], [3, 0]];
    const result = buildConstrainedTin(fc, [], "target", { groupsOf: () => [], planes: [], hull });
    expect(sorted(result.hull)).toEqual(sorted(hull));
  });

  it("制約にできない凸包の辺（存在しない点）は外し、ほかの辺は制約にする", () => {
    const hull: Edge[] = [[0, 99], [0, 1], [1, 2], [2, 3], [3, 0]];
    const result = buildConstrainedTin(fc, [], "target", {
      groupsOf: () => [],
      planes: [],
      hull
    });
    const { tin } = result;
    for (const [a, b] of hull.slice(1)) expect(hasEdge(tin, a, b)).toBe(true);
    expect(sorted(result.hull)).toEqual(sorted(hull.slice(1)));
  });
});
