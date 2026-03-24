/**
 * Format Version 3 compiled-state restoration helpers.
 *
 * Generalises the v2 compiled-state logic to support N (≥4) boundary vertices
 * (b0 … b(N-1)) instead of the hardcoded 4 used by @maplat/transform.
 *
 * These functions are intended to be called from Tin.setCompiled() when
 * compiled.version >= 3, bypassing the base-class logic that assumes exactly
 * four boundary vertices.
 */

import { featureCollection, point, polygon } from "@turf/turf";
import type { Position } from "geojson";
import type {
  Compiled,
  PointSet,
  StrictStatus,
  WeightBufferBD,
} from "@maplat/transform";
import type { Tins, Tri } from "@maplat/transform";
import { normalizeEdges } from "@maplat/transform";

// ────────────────────────────────────────────────────────────────────────────
// Low-level triangle builder
// ────────────────────────────────────────────────────────────────────────────

/**
 * Resolve a vertex key (number, "c", "bN", "eN") to a [forw, bakw] pair.
 *
 * Unlike the v2 version in @maplat/transform (hardcoded b0–b3), this function
 * handles arbitrary bN indices.
 */
function resolveIndex(
  index: number | string,
  points: PointSet[],
  edgeNodes: PointSet[],
  cent: Position[],
  bboxes: Position[][],
): PointSet {
  if (typeof index === "number" || (typeof index === "string" && /^\d+$/.test(index))) {
    const numIdx = typeof index === "number" ? index : parseInt(index, 10);
    return points[numIdx];
  }
  if (index === "c") {
    return [cent[0], cent[1]] as PointSet;
  }
  const bMatch = (index as string).match(/^b(\d+)$/);
  if (bMatch) {
    const bIdx = parseInt(bMatch[1], 10);
    return bboxes[bIdx] as PointSet;
  }
  const eMatch = (index as string).match(/^e(\d+)$/);
  if (eMatch) {
    const nodeIndex = parseInt(eMatch[1], 10);
    return edgeNodes[nodeIndex];
  }
  throw new Error(`Bad index value for v3 triangle builder: ${index}`);
}

/**
 * Build a Tri from three named vertex indices, supporting arbitrary bN keys.
 */
function indexesToTriV3(
  indexes: (number | string)[],
  points: PointSet[],
  edgeNodes: PointSet[],
  cent: Position[],
  bboxes: Position[][],
  bakw = false,
): Tri {
  const resolved = indexes.map((index) =>
    resolveIndex(index, points, edgeNodes, cent, bboxes)
  );

  const coordinates = [0, 1, 2, 0].map((i) =>
    bakw ? resolved[i][1] : resolved[i][0]
  );
  const geoms = [0, 1, 2].map((i) =>
    bakw ? resolved[i][0] : resolved[i][1]
  );

  const properties = {
    a: { geom: geoms[0] as Position, index: indexes[0] },
    b: { geom: geoms[1] as Position, index: indexes[1] },
    c: { geom: geoms[2] as Position, index: indexes[2] },
  };

  return polygon([coordinates], properties) as unknown as Tri;
}

// ────────────────────────────────────────────────────────────────────────────
// Vertices-params builder (N vertices)
// ────────────────────────────────────────────────────────────────────────────

/**
 * Build an array of N sector Tins for use in useVerticesArr().
 *
 * Sector i = triangle (centroid="c", b_i, b_{(i+1)%N}).
 */
export function buildVertexTinsV3(compiled: Compiled, bakw: boolean): Tins[] {
  const N = compiled.vertices_points.length;
  return Array.from({ length: N }, (_, idx) => {
    const idxNxt = (idx + 1) % N;
    const tri = indexesToTriV3(
      ["c", `b${idx}`, `b${idxNxt}`],
      compiled.points,
      compiled.edgeNodes ?? [],
      compiled.centroid_point,
      compiled.vertices_points,
      bakw,
    );
    return featureCollection([tri]) as Tins;
  });
}

// ────────────────────────────────────────────────────────────────────────────
// Weight-buffer normalisation (same logic as v2 but version-aware)
// ────────────────────────────────────────────────────────────────────────────

function normalizeWeightBufferV3(compiled: Compiled): WeightBufferBD {
  // v3 weight buffers are already in the modern key format.
  return compiled.weight_buffer;
}

// ────────────────────────────────────────────────────────────────────────────
// Strict-status derivation
// ────────────────────────────────────────────────────────────────────────────

function deriveStrictStatusV3(compiled: Compiled): StrictStatus {
  if (compiled.strict_status) return compiled.strict_status;
  if (compiled.kinks_points) return "strict_error";
  if (compiled.tins_points.length === 2) return "loose";
  return "strict";
}

// ────────────────────────────────────────────────────────────────────────────
// Centroid builder
// ────────────────────────────────────────────────────────────────────────────

function buildCentroidV3(compiled: Compiled) {
  return {
    forw: point(compiled.centroid_point[0], {
      target: { geom: compiled.centroid_point[1], index: "c" },
    }),
    bakw: point(compiled.centroid_point[1], {
      target: { geom: compiled.centroid_point[0], index: "c" },
    }),
  };
}

// ────────────────────────────────────────────────────────────────────────────
// TINs builder (same as v2 but delegates bN to our local resolver)
// ────────────────────────────────────────────────────────────────────────────

function buildTinsV3(compiled: Compiled) {
  const bakwIndex = compiled.tins_points.length === 1 ? 0 : 1;
  return {
    forw: featureCollection(
      compiled.tins_points[0].map((idxes) =>
        indexesToTriV3(
          idxes,
          compiled.points,
          compiled.edgeNodes ?? [],
          compiled.centroid_point,
          compiled.vertices_points,
          false,
        )
      ),
    ) as Tins,
    bakw: featureCollection(
      compiled.tins_points[bakwIndex].map((idxes) =>
        indexesToTriV3(
          idxes,
          compiled.points,
          compiled.edgeNodes ?? [],
          compiled.centroid_point,
          compiled.vertices_points,
          true,
        )
      ),
    ) as Tins,
  };
}

// ────────────────────────────────────────────────────────────────────────────
// Kinks builder
// ────────────────────────────────────────────────────────────────────────────

function buildKinksV3(kinksPoints?: Position[]) {
  if (!kinksPoints) return undefined;
  return {
    bakw: featureCollection(kinksPoints.map((coord) => point(coord))),
  };
}

// ────────────────────────────────────────────────────────────────────────────
// Full modern-state restoration for v3
// ────────────────────────────────────────────────────────────────────────────

/**
 * Restore the in-memory state from a v3 (or later) compiled payload.
 *
 * This mirrors restoreModernState() in @maplat/transform but uses N-vertex
 * variants wherever the base implementation is hardcoded to 4.
 */
export function restoreV3State(compiled: Compiled) {
  const N = compiled.vertices_points.length;

  const forwTins = buildVertexTinsV3(compiled, false);
  const bakwTins = buildVertexTinsV3(compiled, true);

  const verticesParams = {
    forw: [compiled.vertices_params[0], forwTins] as [number[], Tins[]],
    bakw: [compiled.vertices_params[1], bakwTins] as [number[], Tins[]],
  };

  // Validate that the radian lists match the number of vertices
  if (
    compiled.vertices_params[0].length !== N ||
    compiled.vertices_params[1].length !== N
  ) {
    throw new Error(
      `v3 compiled format mismatch: vertices_points has ${N} entries but ` +
      `vertices_params[0] has ${compiled.vertices_params[0].length} and ` +
      `vertices_params[1] has ${compiled.vertices_params[1].length}`,
    );
  }

  return {
    points: compiled.points,
    pointsWeightBuffer: normalizeWeightBufferV3(compiled),
    strictStatus: deriveStrictStatusV3(compiled),
    verticesParams,
    centroid: buildCentroidV3(compiled),
    edges: normalizeEdges(compiled.edges ?? []),
    edgeNodes: compiled.edgeNodes ?? [],
    tins: buildTinsV3(compiled),
    kinks: buildKinksV3(compiled.kinks_points),
    yaxisMode: compiled.yaxisMode ?? "invert",
    strictMode: compiled.strictMode ?? "auto",
    vertexMode: compiled.vertexMode,
    bounds: compiled.bounds,
    boundsPolygon: compiled.boundsPolygon,
    wh: compiled.wh,
    xy: compiled.bounds ? compiled.xy : [0, 0],
  };
}
