import { polygon } from "@turf/helpers";
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
  let repaired = false;
  let mutated = true;

  while (mutated) {
    mutated = false;

    const keys = Object.keys(searchIndex);
    for (const key of keys) {
      const trises = searchIndex[key];
      if (!trises || trises.length < 2) continue;

      if (isConstraintEdge(key, edges)) continue;

      const sharedKeys = key.split("-");
      const tri0Vertices = extractVertices(trises[0].bakw);
      const tri1Vertices = extractVertices(trises[1].bakw);

      const sharedVertices = sharedKeys.map((vertexKey) =>
        tri0Vertices.find((info) => `${info.prop.index}` === vertexKey) ||
          tri1Vertices.find((info) => `${info.prop.index}` === vertexKey),
      );

      if (sharedVertices.some((vertex) => !vertex)) {
        continue;
      }

      const nonSharedVertices = [tri0Vertices, tri1Vertices].map((vertices) =>
        vertices.find((info) => !sharedKeys.includes(`${info.prop.index}`)),
      );

      if (nonSharedVertices.some((vertex) => !vertex)) {
        continue;
      }

      const triangle0 = trises[0].bakw.geometry!.coordinates[0]
        .slice(0, 3)
        .map((coord) => toXY(coord as Position)) as [number, number][];
      const triangle1 = trises[1].bakw.geometry!.coordinates[0]
        .slice(0, 3)
        .map((coord) => toXY(coord as Position)) as [number, number][];

      const overlaps =
        pointInTriangle(toXY(nonSharedVertices[0]!.geom as Position), triangle1) ||
        pointInTriangle(toXY(nonSharedVertices[1]!.geom as Position), triangle0);

      if (!overlaps) {
        continue;
      }

      removeSearchIndex(searchIndex, trises[0], tins);
      removeSearchIndex(searchIndex, trises[1], tins);

      sharedVertices.forEach((shared) => {
        if (!shared) return;
        const newCoords = [
          shared.geom,
          nonSharedVertices[0]!.geom,
          nonSharedVertices[1]!.geom,
          shared.geom,
        ];
        const newProps = {
          a: shared.prop,
          b: nonSharedVertices[0]!.prop,
          c: nonSharedVertices[1]!.prop,
        } as Tri["properties"];
        const newBakTri = polygon([newCoords], newProps) as Tri;
        const newForTri = counterTri(newBakTri);

        insertSearchIndex(searchIndex, { forw: newForTri, bakw: newBakTri }, tins);
      });

      repaired = true;
      mutated = true;
      break;
    }
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
