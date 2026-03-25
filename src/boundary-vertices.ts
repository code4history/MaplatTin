import { lineString, lineIntersect } from "@turf/turf";
import type { Position } from "geojson";
import type { VertexPosition } from "./types/tin.d.ts";

interface ConvexEntry {
  forw: Position;
  bakw: Position;
}

/**
 * Unified parameters for all boundary vertex computations (V2 and V3).
 *
 * `allGcps` must include **all** interior points: GCPs from `this.points` **and**
 * edge intermediate nodes from `this.edgeNodes`.  This is necessary so that
 * `checkAndAdjustVerticesN` can guarantee that every constrained-edge vertex in
 * bakw space lies inside the boundary polygon.
 */
export interface BoundaryVerticesParams {
  convexBuf: Record<string, ConvexEntry>;
  centroid: { forw: Position; bakw: Position };
  /** GCPs + edge intermediate nodes */
  allGcps: Array<{ forw: Position; bakw: Position }>;
  minx: number;
  maxx: number;
  miny: number;
  maxy: number;
}

/** Alias kept for backward-compatibility with callers that import this name. */
export type BoundaryVerticesV3Params = BoundaryVerticesParams;

// ─── Internal types ──────────────────────────────────────────────────────────

type SamplePair = {
  forw: [number, number];
  bakw: [number, number];
};

// ─── Ratio helpers ───────────────────────────────────────────────────────────

function collectSamples(
  convexBuf: Record<string, ConvexEntry>,
  centroid: { forw: Position; bakw: Position },
): { perQuad: SamplePair[][]; aggregate: SamplePair[] } {
  const perQuad: SamplePair[][] = [[], [], [], []];
  const aggregate: SamplePair[] = [];

  Object.keys(convexBuf).forEach((key) => {
    const item = convexBuf[key];
    const forw = item.forw;
    const bakw = item.bakw;

    const forwDelta: [number, number] = [
      forw[0] - centroid.forw[0],
      forw[1] - centroid.forw[1],
    ];
    const bakwDelta: [number, number] = [
      bakw[0] - centroid.bakw[0],
      centroid.bakw[1] - bakw[1],
    ];

    const sample: SamplePair = { forw: forwDelta, bakw: bakwDelta };
    aggregate.push(sample);

    if (forwDelta[0] === 0 || forwDelta[1] === 0) {
      return;
    }

    let quad = 0;
    if (forwDelta[0] > 0) quad += 1;
    if (forwDelta[1] > 0) quad += 2;
    perQuad[quad].push(sample);
  });

  return { perQuad, aggregate };
}

function reduceSamples(samples: SamplePair[]): [number, number] {
  let minRatio = Infinity;
  let sumCos = 0;
  let sumSin = 0;

  samples.forEach((sample) => {
    const { forw, bakw } = sample;
    const forwNorm = Math.hypot(forw[0], forw[1]);
    const bakwNorm = Math.hypot(bakw[0], bakw[1]);
    if (bakwNorm === 0) return;

    const ratio = forwNorm / bakwNorm;
    const theta = Math.atan2(forw[0], forw[1]) - Math.atan2(bakw[0], bakw[1]);

    minRatio = Math.min(minRatio, ratio);
    sumCos += Math.cos(theta);
    sumSin += Math.sin(theta);
  });

  if (!isFinite(minRatio)) {
    return [1, 0];
  }

  return [minRatio, Math.atan2(sumSin, sumCos)];
}

function buildVertexRatio(
  convexBuf: Record<string, ConvexEntry>,
  centroid: { forw: Position; bakw: Position },
  mode: "plain" | "birdeye",
): Array<[number, number]> {
  const { perQuad, aggregate } = collectSamples(convexBuf, centroid);
  const hasAllQuadrants = perQuad.every((samples) => samples.length > 0);

  const groups: SamplePair[][] = mode === "birdeye"
    ? (hasAllQuadrants ? perQuad : [aggregate])
    : [aggregate];

  const vertexRatio = groups.map((samples) => reduceSamples(samples));

  if (vertexRatio.length === 1) {
    return [vertexRatio[0], vertexRatio[0], vertexRatio[0], vertexRatio[0]];
  }

  return vertexRatio;
}

// ─── Geometry helpers ────────────────────────────────────────────────────────

/**
 * Return quadrant index (0–3) of `forw` relative to `centroidForw`.
 *
 * Quadrant encoding:
 *   q0: Δx≤0, Δy≤0   q1: Δx>0, Δy≤0
 *   q2: Δx≤0, Δy>0   q3: Δx>0, Δy>0
 */
function forwQuadrant(forw: Position, centroidForw: Position): number {
  let q = 0;
  if (forw[0] > centroidForw[0]) q += 1;
  if (forw[1] > centroidForw[1]) q += 2;
  return q;
}

/**
 * Compute the bakw position for a given forw position using the centroid and
 * an aggregate [scale, rotation] ratio.
 */
function computeVertexBakwFromRatio(
  forwPos: Position,
  centroid: { forw: Position; bakw: Position },
  ratio: [number, number],
): Position {
  const forDelta = [
    forwPos[0] - centroid.forw[0],
    forwPos[1] - centroid.forw[1],
  ];
  const forDistance = Math.sqrt(forDelta[0] ** 2 + forDelta[1] ** 2);
  const bakDistance = forDistance / ratio[0];
  const bakTheta = Math.atan2(forDelta[0], forDelta[1]) - ratio[1];
  return [
    centroid.bakw[0] + bakDistance * Math.sin(bakTheta),
    centroid.bakw[1] - bakDistance * Math.cos(bakTheta),
  ];
}

/**
 * Find the intersection of the ray from `centroid` through `rayDir` with the
 * segment [segStart, segEnd].  Returns {t, point} where t > 0 is the parameter
 * along the ray, or null if no valid intersection.
 */
function findRaySegmentIntersection(
  centroid: Position,
  rayDir: Position,
  segStart: Position,
  segEnd: Position,
): { t: number; point: Position } | null {
  const dx = rayDir[0] - centroid[0];
  const dy = rayDir[1] - centroid[1];
  if (Math.abs(dx) < 1e-12 && Math.abs(dy) < 1e-12) return null;

  const ex = segEnd[0] - segStart[0];
  const ey = segEnd[1] - segStart[1];
  const fx = segStart[0] - centroid[0];
  const fy = segStart[1] - centroid[1];

  const denom = dx * ey - dy * ex;
  if (Math.abs(denom) < 1e-12) return null;

  const t = (fx * ey - fy * ex) / denom;
  const s = (fx * dy - fy * dx) / denom;

  if (t <= 1e-10) return null;
  if (s < -1e-10 || s > 1 + 1e-10) return null;

  return { t, point: [centroid[0] + t * dx, centroid[1] + t * dy] };
}

/**
 * Find the exit intersection of the ray from `centroid` through `rayDir` with
 * the convex polygon formed by `corners` (angularly-sorted VertexPosition[]).
 */
function findRayQuadIntersection(
  centroid: Position,
  rayDir: Position,
  corners: VertexPosition[],
): Position | null {
  const N = corners.length;
  let bestT = -Infinity;
  let bestPoint: Position | null = null;

  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N;
    const result = findRaySegmentIntersection(
      centroid, rayDir, corners[i].bakw, corners[j].bakw,
    );
    if (result && result.t > bestT) {
      bestT = result.t;
      bestPoint = result.point;
    }
  }
  return bestPoint;
}

/** Convert a forw position to [0, 360) degrees using the atan2(Δx, Δy) convention. */
function toAngleDeg360(pos: Position, centroid: Position): number {
  const rawRad = Math.atan2(pos[0] - centroid[0], pos[1] - centroid[1]);
  const deg = rawRad * (180 / Math.PI);
  return deg < 0 ? deg + 360 : deg;
}

/**
 * Find the first intersection of the ray from `centroid` THROUGH `vertex` with
 * the axis-aligned bbox [minx,maxx] × [miny,maxy].
 */
function findRayBboxIntersection(
  centroid: Position,
  vertex: Position,
  minx: number,
  maxx: number,
  miny: number,
  maxy: number,
): Position | null {
  const dx = vertex[0] - centroid[0];
  const dy = vertex[1] - centroid[1];
  if (dx === 0 && dy === 0) return null;

  const candidates: { t: number; x: number; y: number }[] = [];

  if (dx !== 0) {
    for (const bx of [minx, maxx]) {
      const t = (bx - centroid[0]) / dx;
      if (t > 0) {
        const y = centroid[1] + t * dy;
        if (y >= miny && y <= maxy) candidates.push({ t, x: bx, y });
      }
    }
  }
  if (dy !== 0) {
    for (const by of [miny, maxy]) {
      const t = (by - centroid[1]) / dy;
      if (t > 0) {
        const x = centroid[0] + t * dx;
        if (x >= minx && x <= maxx) candidates.push({ t, x, y: by });
      }
    }
  }

  if (candidates.length === 0) return null;
  candidates.sort((a, b) => a.t - b.t);
  const best = candidates[0];
  return [best.x, best.y];
}

/**
 * Expand N boundary vertices radially from `centroid.bakw` so that every point
 * in `allPoints` has its bakw position enclosed inside the polygon formed by
 * `vertices`.
 *
 * For each point, tests all N bakw polygon sides to find where the ray
 * [centroid.bakw → point.bakw] exits.  If the point is outside that side, both
 * endpoints of the side are scaled outward until the point is enclosed.
 */
function checkAndAdjustVerticesN(
  vertices: VertexPosition[],
  allPoints: Array<{ forw: Position; bakw: Position }>,
  centroid: { forw: Position; bakw: Position },
): void {
  const N = vertices.length;
  const expandRatio = new Array<number>(N).fill(1);

  for (const node of allPoints) {
    for (let i = 0; i < N; i++) {
      const j = (i + 1) % N;
      const side = lineString([vertices[i].bakw, vertices[j].bakw]);
      const line = lineString([centroid.bakw, node.bakw]);
      const intersect = lineIntersect(side, line);

      if (intersect.features.length > 0 && intersect.features[0].geometry) {
        const intersectPt = intersect.features[0];
        const distance = Math.sqrt(
          Math.pow(node.bakw[0] - centroid.bakw[0], 2) +
            Math.pow(node.bakw[1] - centroid.bakw[1], 2),
        );
        const intDistance = Math.sqrt(
          Math.pow(intersectPt.geometry.coordinates[0] - centroid.bakw[0], 2) +
            Math.pow(intersectPt.geometry.coordinates[1] - centroid.bakw[1], 2),
        );
        const ratio = distance / intDistance;
        if (ratio > expandRatio[i]) expandRatio[i] = ratio;
        if (ratio > expandRatio[j]) expandRatio[j] = ratio;
      }
    }
  }

  vertices.forEach((vertex, i) => {
    const ratio = expandRatio[i];
    vertex.bakw = [
      (vertex.bakw[0] - centroid.bakw[0]) * ratio + centroid.bakw[0],
      (vertex.bakw[1] - centroid.bakw[1]) * ratio + centroid.bakw[1],
    ];
  });
}

// ─── Unified core ────────────────────────────────────────────────────────────

/**
 * Unified boundary vertex computation shared by V2 (4 corners) and V3 (4 corners
 * + up to 32 edge vertices).
 *
 * ## Algorithm
 *
 * ### Phase 1 – Ratios
 * Compute per-quadrant (birdeye) or aggregate (plain) [minScale, avgRotation]
 * ratios from the convex hull of all GCPs.
 *
 * ### Phase 2 – 4 bbox corners
 * Each bbox corner's bakw position is extrapolated using the ratio for its
 * quadrant.  `checkAndAdjustVerticesN` then expands corners radially so that
 * **every point in `allGcps`** (GCPs + edge intermediate nodes) is enclosed.
 *
 * If `withEdgeVertices` is false the function returns here (V2 path).
 *
 * ### Phase 3 – 36 × 10° bins (V3 only)
 * For each non-corner 10° bin the most-extreme interior point (GCP or edge
 * node) in that angular range is used as a guide:
 *
 * - **bakw direction**: linearly interpolated rotation between the two
 *   bracketing corner bakw rotations → smooth, no discontinuity.
 * - **bakw distance**: the guide point's actual bakw distance from centroid,
 *   scaled up by `forwEdge_dist / forwGuide_dist` (extrapolation to the bbox
 *   boundary).  This gives non-collinear positions independent of the
 *   corner-quad sides and avoids degenerate (zero-area) triangles.
 *
 * Bins with no interior points fall back to the interpolated corner scale.
 *
 * ### Phase 4 – Sort + final adjust
 * All vertices are sorted by forw angle.  `checkAndAdjustVerticesN` is called
 * again on the full set so that the final polygon correctly encloses every
 * interior point.
 */
function calculateVerticesCore(
  params: BoundaryVerticesParams,
  mode: "plain" | "birdeye",
  withEdgeVertices: boolean,
): VertexPosition[] {
  const { convexBuf, centroid, allGcps, minx, maxx, miny, maxy } = params;

  // ── Phase 1 ───────────────────────────────────────────────────────────────
  const cornerRatios = buildVertexRatio(convexBuf, centroid, mode);

  // ── Phase 2: 4 bbox corner vertices ───────────────────────────────────────
  const bboxCornerForws: Position[] = [
    [minx, miny],
    [maxx, miny],
    [maxx, maxy],
    [minx, maxy],
  ];
  const cornerVertices: VertexPosition[] = bboxCornerForws.map((forw) => ({
    forw,
    bakw: computeVertexBakwFromRatio(
      forw,
      centroid,
      cornerRatios[forwQuadrant(forw, centroid.forw)],
    ),
  }));

  // Sort corners CCW by forw angle (atan2(Δx, Δy) convention)
  cornerVertices.sort((a, b) =>
    Math.atan2(a.forw[0] - centroid.forw[0], a.forw[1] - centroid.forw[1]) -
    Math.atan2(b.forw[0] - centroid.forw[0], b.forw[1] - centroid.forw[1])
  );

  // Expand corners to enclose all GCPs + edge nodes in bakw space
  checkAndAdjustVerticesN(cornerVertices, allGcps, centroid);

  if (!withEdgeVertices) return cornerVertices;

  // ── Phase 3 prep: interpolation data from adjusted corners ────────────────
  //
  // For each edge vertex we interpolate the forw→bakw rotation from the two
  // bracketing corner bakw rotations.  At a corner's exact forw direction the
  // interpolated rotation equals that corner's actual bakw rotation, so the
  // boundary is continuous everywhere.
  //
  // The bakw distance is determined by projecting the interpolated direction
  // onto the **corner polygon** sides.  This places every Phase 3 edge vertex
  // exactly on the adjusted corner-polygon boundary, so the 36-vertex bakw
  // polygon is a refinement of (not larger than) the 4-corner polygon.
  const N = 4; // always 4 corners
  const cornerForwAngles = cornerVertices.map((cv) =>
    Math.atan2(cv.forw[0] - centroid.forw[0], cv.forw[1] - centroid.forw[1])
  );
  const cornerBakwThetas = cornerVertices.map((cv) =>
    Math.atan2(
      cv.bakw[0] - centroid.bakw[0],
      -(cv.bakw[1] - centroid.bakw[1]),
    )
  );
  /** Find the angular sector [corners[i], corners[j]) containing theta. */
  function findSector(theta: number): { i: number; j: number; frac: number } {
    for (let i = 0; i < N; i++) {
      const j = (i + 1) % N;
      const ai = cornerForwAngles[i];
      const aj = i < N - 1 ? cornerForwAngles[j] : cornerForwAngles[j] + 2 * Math.PI;
      let t = theta;
      while (t < ai) t += 2 * Math.PI;
      while (t >= ai + 2 * Math.PI) t -= 2 * Math.PI;
      if (t >= ai && t < aj) {
        return { i, j, frac: (t - ai) / (aj - ai) };
      }
    }
    return { i: 0, j: 1, frac: 0 };
  }

  /**
   * Interpolate the bakw angle directly between adjacent corner bakw angles.
   * This avoids the large rotation-delta problem that occurs when the forw→bakw
   * rotation difference between adjacent corners exceeds 180°.
   */
  function interpolateBakwAngle(theta: number): number {
    const { i, j, frac } = findSector(theta);
    const bi = cornerBakwThetas[i];
    const bj = cornerBakwThetas[j];
    let delta = bj - bi;
    while (delta > Math.PI) delta -= 2 * Math.PI;
    while (delta < -Math.PI) delta += 2 * Math.PI;
    return bi + frac * delta;
  }

  // ── Phase 3: 36-bin edge vertices ─────────────────────────────────────────
  const cornerBins = new Set<number>(
    cornerVertices.map(
      (cv) => Math.floor(toAngleDeg360(cv.forw, centroid.forw) / 10) % 36,
    ),
  );

  type GcpInfo = {
    forw: Position;
    bakw: Position;
    angleDeg: number;
    forwDist: number;
  };
  const gcpInfos: GcpInfo[] = allGcps.map((gcp) => ({
    forw: gcp.forw,
    bakw: gcp.bakw,
    angleDeg: toAngleDeg360(gcp.forw, centroid.forw),
    forwDist: Math.hypot(gcp.forw[0] - centroid.forw[0], gcp.forw[1] - centroid.forw[1]),
  }));

  const edgeVertices: VertexPosition[] = [];

  for (let bin = 0; bin < 36; bin++) {
    if (cornerBins.has(bin)) continue;

    const binStart = bin * 10;
    const inBin = gcpInfos.filter(
      (g) => g.angleDeg >= binStart && g.angleDeg < binStart + 10,
    );

    let forwEdge: Position | null = null;

    if (inBin.length > 0) {
      // Most extreme interior point in this angular bin
      const sel = inBin.reduce((best, g) => g.forwDist > best.forwDist ? g : best);
      forwEdge = findRayBboxIntersection(centroid.forw, sel.forw, minx, maxx, miny, maxy);
    }

    if (!forwEdge) {
      const binCenterRad = ((binStart + 5) % 360) * (Math.PI / 180);
      const fallbackDir: Position = [
        centroid.forw[0] + Math.sin(binCenterRad),
        centroid.forw[1] + Math.cos(binCenterRad),
      ];
      forwEdge = findRayBboxIntersection(centroid.forw, fallbackDir, minx, maxx, miny, maxy);
    }

    if (!forwEdge) continue;

    const forDelta = [forwEdge[0] - centroid.forw[0], forwEdge[1] - centroid.forw[1]];
    const forwAngle = Math.atan2(forDelta[0], forDelta[1]);
    const bakwTheta = interpolateBakwAngle(forwAngle);
    const bakwDirPt: Position = [
      centroid.bakw[0] + Math.sin(bakwTheta),
      centroid.bakw[1] - Math.cos(bakwTheta),
    ];
    const bakwEdge = findRayQuadIntersection(centroid.bakw, bakwDirPt, cornerVertices);

    if (bakwEdge) {
      edgeVertices.push({ forw: forwEdge, bakw: bakwEdge });
    }
  }

  // ── Phase 4: Combine, sort, final adjust ──────────────────────────────────
  const allVertices: VertexPosition[] = [...cornerVertices, ...edgeVertices];
  allVertices.sort((a, b) =>
    Math.atan2(a.forw[0] - centroid.forw[0], a.forw[1] - centroid.forw[1]) -
    Math.atan2(b.forw[0] - centroid.forw[0], b.forw[1] - centroid.forw[1])
  );

  // Final expansion: ensure the full polygon encloses all GCPs + edge nodes
  // (some edge vertices may have been placed conservatively via extrapolation;
  // this step corrects any remaining gaps).
  checkAndAdjustVerticesN(allVertices, allGcps, centroid);

  return allVertices;
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Calculate 4 boundary vertices (plain mode, V2 format).
 * Uses a single aggregate [scale, rotation] ratio from all GCPs.
 */
export function calculatePlainVertices(params: BoundaryVerticesParams): VertexPosition[] {
  return calculateVerticesCore(params, "plain", false);
}

/**
 * Calculate 4 boundary vertices (bird's-eye mode, V2 format).
 * Uses per-quadrant [scale, rotation] ratios to capture perspective distortion.
 */
export function calculateBirdeyeVertices(params: BoundaryVerticesParams): VertexPosition[] {
  return calculateVerticesCore(params, "birdeye", false);
}

/**
 * Calculate up to 36 boundary vertices (plain mode, V3 format).
 * 4 bbox corners + up to 32 edge vertices selected from 10° angular bins.
 */
export function calculatePlainVerticesV3(params: BoundaryVerticesParams): VertexPosition[] {
  return calculateVerticesCore(params, "plain", true);
}

/**
 * Calculate up to 36 boundary vertices (bird's-eye mode, V3 format).
 * 4 bbox corners (per-quadrant ratios) + up to 32 edge vertices from 10° angular bins.
 *
 * Like plain V3, birdeye V3 uses the full 36-bin edge vertex pass
 * (withEdgeVertices=true). The difference from plain V3 is that the 4 corner
 * positions are computed using per-quadrant scale/rotation ratios rather than a
 * single aggregate ratio, capturing perspective distortion more faithfully.
 */
export function calculateBirdeyeVerticesV3(params: BoundaryVerticesParams): VertexPosition[] {
  return calculateVerticesCore(params, "birdeye", true);
}
