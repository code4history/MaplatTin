import { polygon } from "@turf/turf";
import type { PropertyTriKey, TinsBD, Tri } from "@maplat/transform";
import type { Position } from "geojson";
import { counterTri } from "@maplat/transform";
import type { SearchIndex } from "./searchutils.ts";
import { insertSearchIndex, removeSearchIndex } from "./searchutils.ts";

type ConstraintEdges = number[][];

function isConstraintEdge(key: string, edges: ConstraintEdges): boolean {
  const parts = key.split("-");
  if (parts.length !== 2) return false;
  if (!parts.every((value) => /^-?\d+$/.test(value))) return false;

  const [a, b] = parts.map((value) => parseInt(value, 10)).sort((x, y) => x - y);

  return edges.some((edge) => {
    if (edge.length !== 2) return false;
    const parsed = edge.map((value) => parseInt(`${value}`, 10));
    if (parsed.some((val) => Number.isNaN(val))) return false;
    const sorted = parsed.sort((x, y) => x - y);
    return sorted[0] === a && sorted[1] === b;
  });
}

function extractVertices(tri: Tri) {
  return (["a", "b", "c"] as PropertyTriKey[]).map((key, index) => ({
    prop: tri.properties![key],
    geom: tri.geometry!.coordinates[0][index],
  }));
}

export function resolveOverlaps(
  tins: TinsBD,
  searchIndex: SearchIndex,
  edges: ConstraintEdges,
): boolean {
  const processedKeys = new Set<string>();
  let repaired = false;

  const initialKeys = Object.keys(searchIndex);
  for (const key of initialKeys) {
    if (processedKeys.has(key)) continue;
    processedKeys.add(key);

    const trises = searchIndex[key];
    if (!trises || trises.length < 2) continue;

    const sharedKeys = key.split("-");
    if (sharedKeys.length !== 2) continue;

    if (isConstraintEdge(key, edges)) continue;

    const tri0Bakw = extractVertices(trises[0].bakw);
    const tri1Bakw = extractVertices(trises[1].bakw);
    const tri0Forw = extractVertices(trises[0].forw);
    const tri1Forw = extractVertices(trises[1].forw);

    const sharedBakw = sharedKeys.map((vertexKey) =>
      tri0Bakw.find((info) => `${info.prop.index}` === vertexKey) ||
      tri1Bakw.find((info) => `${info.prop.index}` === vertexKey),
    );
    const sharedForw = sharedKeys.map((vertexKey) =>
      tri0Forw.find((info) => `${info.prop.index}` === vertexKey) ||
      tri1Forw.find((info) => `${info.prop.index}` === vertexKey),
    );

    if (sharedBakw.some((vertex) => !vertex) || sharedForw.some((vertex) => !vertex)) {
      continue;
    }

    const nonSharedBakw = [tri0Bakw, tri1Bakw].map((vertices) =>
      vertices.find((info) => !sharedKeys.includes(`${info.prop.index}`)),
    );
    const nonSharedForw = [tri0Forw, tri1Forw].map((vertices) =>
      vertices.find((info) => !sharedKeys.includes(`${info.prop.index}`)),
    );

    if (
      nonSharedBakw.some((vertex) => !vertex) ||
      nonSharedForw.some((vertex) => !vertex)
    ) {
      continue;
    }

    const triangle0Bakw = trises[0].bakw.geometry!.coordinates[0]
      .slice(0, 3)
      .map((coord) => toXY(coord as Position)) as [number, number][];
    const triangle1Bakw = trises[1].bakw.geometry!.coordinates[0]
      .slice(0, 3)
      .map((coord) => toXY(coord as Position)) as [number, number][];

    const overlaps =
      pointInTriangle(
        toXY(nonSharedBakw[0]!.geom as Position),
        triangle1Bakw,
      ) ||
      pointInTriangle(
        toXY(nonSharedBakw[1]!.geom as Position),
        triangle0Bakw,
      );

    if (!overlaps) {
      continue;
    }

    const sharedForwPositions = sharedForw.map((item) =>
      toXY(item!.geom as Position)
    ) as [number, number][];
    const nonSharedForwPositions = nonSharedForw.map((item) =>
      toXY(item!.geom as Position)
    ) as [number, number][];

    const hull = convexHull([
      ...sharedForwPositions,
      ...nonSharedForwPositions,
    ]);
    const hullArea = polygonArea(hull);
    const unionArea = triangleArea(
      sharedForwPositions[0],
      sharedForwPositions[1],
      nonSharedForwPositions[0],
    ) + triangleArea(
      sharedForwPositions[0],
      sharedForwPositions[1],
      nonSharedForwPositions[1],
    );

    if (!almostEqual(hullArea, unionArea)) {
      continue;
    }

    removeSearchIndex(searchIndex, trises[0], tins);
    removeSearchIndex(searchIndex, trises[1], tins);

    sharedBakw.forEach((shared) => {
      if (!shared) return;
      const newCoords = [
        shared.geom,
        nonSharedBakw[0]!.geom,
        nonSharedBakw[1]!.geom,
        shared.geom,
      ];
      const newProps = {
        a: shared.prop,
        b: nonSharedBakw[0]!.prop,
        c: nonSharedBakw[1]!.prop,
      } as Tri["properties"];
      const newBakTri = polygon([newCoords], newProps) as Tri;
      const newForTri = counterTri(newBakTri);

      insertSearchIndex(searchIndex, {
        forw: newForTri,
        bakw: newBakTri,
      }, tins);
    });

    repaired = true;
  }

  return repaired;
}

function toXY(position: Position): [number, number] {
  return [position[0], position[1]];
}

function pointInTriangle(
  point: [number, number],
  triangle: [number, number][],
): boolean {
  const [ax, ay] = triangle[0];
  const [bx, by] = triangle[1];
  const [cx, cy] = triangle[2];

  const v0x = cx - ax;
  const v0y = cy - ay;
  const v1x = bx - ax;
  const v1y = by - ay;
  const v2x = point[0] - ax;
  const v2y = point[1] - ay;

  const dot00 = v0x * v0x + v0y * v0y;
  const dot01 = v0x * v1x + v0y * v1y;
  const dot02 = v0x * v2x + v0y * v2y;
  const dot11 = v1x * v1x + v1y * v1y;
  const dot12 = v1x * v2x + v1y * v2y;

  const denom = dot00 * dot11 - dot01 * dot01;
  if (denom === 0) return false;

  const invDenom = 1 / denom;
  const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
  const v = (dot00 * dot12 - dot01 * dot02) * invDenom;

  const epsilon = 1e-9;
  return u >= -epsilon && v >= -epsilon && u + v <= 1 + epsilon;
}

function convexHull(points: [number, number][]): [number, number][] {
  const unique = points
    .map((point) => point.slice() as [number, number])
    .filter(
      (point, index, arr) =>
        arr.findIndex(
          (candidate) =>
            almostEqual(candidate[0], point[0]) &&
            almostEqual(candidate[1], point[1]),
        ) === index,
    );

  if (unique.length <= 1) return unique;

  const sorted = unique.sort((a, b) =>
    a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]
  );

  const cross = (
    origin: [number, number],
    p1: [number, number],
    p2: [number, number],
  ) => (p1[0] - origin[0]) * (p2[1] - origin[1]) -
    (p1[1] - origin[1]) * (p2[0] - origin[0]);

  const lower: [number, number][] = [];
  for (const point of sorted) {
    while (lower.length >= 2 && cross(
      lower[lower.length - 2],
      lower[lower.length - 1],
      point,
    ) <= 0) {
      lower.pop();
    }
    lower.push(point);
  }

  const upper: [number, number][] = [];
  for (let i = sorted.length - 1; i >= 0; i--) {
    const point = sorted[i];
    while (upper.length >= 2 && cross(
      upper[upper.length - 2],
      upper[upper.length - 1],
      point,
    ) <= 0) {
      upper.pop();
    }
    upper.push(point);
  }

  upper.pop();
  lower.pop();

  return lower.concat(upper);
}

function polygonArea(points: [number, number][]): number {
  if (points.length < 3) return 0;
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[(i + 1) % points.length];
    area += x1 * y2 - x2 * y1;
  }
  return Math.abs(area) / 2;
}

function triangleArea(
  a: [number, number],
  b: [number, number],
  c: [number, number],
): number {
  return Math.abs(
    (a[0] * (b[1] - c[1]) +
      b[0] * (c[1] - a[1]) +
      c[0] * (a[1] - b[1])) / 2,
  );
}

function almostEqual(a: number, b: number, epsilon = 1e-9): boolean {
  return Math.abs(a - b) <= epsilon;
}
