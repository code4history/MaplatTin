import { lineString, lineIntersect } from "@turf/turf";
import type { Position } from "geojson";
import type { VertexPosition } from "./types/tin.d.ts";

interface ConvexEntry {
  forw: Position;
  bakw: Position;
}

interface BoundaryVerticesParams {
  convexBuf: Record<string, ConvexEntry>;
  centroid: { forw: Position; bakw: Position };
  bbox: Position[];
  minx: number;
  maxx: number;
  miny: number;
  maxy: number;
}

type EdgeRayBuckets = Array<Array<ConvexEntry>>;
type SamplePair = {
  forw: [number, number];
  bakw: [number, number];
};

function buildEdgeBuckets(
  convexBuf: Record<string, ConvexEntry>,
  centroid: { forw: Position; bakw: Position },
  minx: number,
  maxx: number,
  miny: number,
  maxy: number,
): EdgeRayBuckets {
  return Object.keys(convexBuf).reduce((prev, key) => {
    const item = convexBuf[key];
    const forw = item.forw;
    const bakw = item.bakw;

    const vec = {
      forw: [forw[0] - centroid.forw[0], forw[1] - centroid.forw[1]],
      bakw: [bakw[0] - centroid.bakw[0], bakw[1] - centroid.bakw[1]],
    };

    const xRate = vec.forw[0] === 0
      ? Infinity
      : ((vec.forw[0] < 0 ? minx : maxx) - centroid.forw[0]) / vec.forw[0];
    const yRate = vec.forw[1] === 0
      ? Infinity
      : ((vec.forw[1] < 0 ? miny : maxy) - centroid.forw[1]) / vec.forw[1];

    if (Math.abs(xRate) / Math.abs(yRate) < 1.1) {
      const node = {
        forw: [
          vec.forw[0] * xRate + centroid.forw[0],
          vec.forw[1] * xRate + centroid.forw[1],
        ] as Position,
        bakw: [
          vec.bakw[0] * xRate + centroid.bakw[0],
          vec.bakw[1] * xRate + centroid.bakw[1],
        ] as Position,
      };
      if (vec.forw[0] < 0) {
        prev[3].push(node);
      } else {
        prev[1].push(node);
      }
    }

    if (Math.abs(yRate) / Math.abs(xRate) < 1.1) {
      const node = {
        forw: [
          vec.forw[0] * yRate + centroid.forw[0],
          vec.forw[1] * yRate + centroid.forw[1],
        ] as Position,
        bakw: [
          vec.bakw[0] * yRate + centroid.bakw[0],
          vec.bakw[1] * yRate + centroid.bakw[1],
        ] as Position,
      };
      if (vec.forw[1] < 0) {
        prev[0].push(node);
      } else {
        prev[2].push(node);
      }
    }

    return prev;
  }, [[], [], [], []] as EdgeRayBuckets);
}

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

function checkAndAdjustVertices(
  vertices: VertexPosition[],
  edgeNodes: EdgeRayBuckets,
  centroid: { forw: Position; bakw: Position },
): void {
  const expandRatio = [1, 1, 1, 1];

  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4;
    const side = lineString([vertices[i].bakw, vertices[j].bakw]);

    edgeNodes[i].map((node) => {
      const line = lineString([centroid.bakw, node.bakw]);
      const intersect = lineIntersect(side, line);

      if (intersect.features.length > 0 && intersect.features[0].geometry) {
        const intersectPt = intersect.features[0];
        const distance = Math.sqrt(
          Math.pow(node.bakw[0] - centroid.bakw[0], 2) +
          Math.pow(node.bakw[1] - centroid.bakw[1], 2),
        );
        const intDistance = Math.sqrt(
          Math.pow(
            intersectPt.geometry.coordinates[0] - centroid.bakw[0],
            2,
          ) +
          Math.pow(
            intersectPt.geometry.coordinates[1] - centroid.bakw[1],
            2,
          ),
        );
        const ratio = distance / intDistance;

        if (ratio > expandRatio[i]) expandRatio[i] = ratio;
        if (ratio > expandRatio[j]) expandRatio[j] = ratio;
      }
    });
  }

  vertices.forEach((vertex, i) => {
    const ratio = expandRatio[i];
    const bakw: Position = [
      (vertex.bakw[0] - centroid.bakw[0]) * ratio + centroid.bakw[0],
      (vertex.bakw[1] - centroid.bakw[1]) * ratio + centroid.bakw[1],
    ];
    vertex.bakw = bakw;
  });
}

function finalizeVertices(
  vertexRatio: Array<[number, number]>,
  bbox: Position[],
  centroid: { forw: Position; bakw: Position },
  edgeNodes: EdgeRayBuckets,
): VertexPosition[] {
  const vertices = vertexRatio.map((ratio, index) => {
    const forVertex = bbox[index];
    const forDelta = [
      forVertex[0] - centroid.forw[0],
      forVertex[1] - centroid.forw[1],
    ];
    const forDistance = Math.sqrt(
      Math.pow(forDelta[0], 2) + Math.pow(forDelta[1], 2),
    );
    const bakDistance = forDistance / ratio[0];
    const bakTheta = Math.atan2(forDelta[0], forDelta[1]) - ratio[1];
    const bakw: Position = [
      centroid.bakw[0] + bakDistance * Math.sin(bakTheta),
      centroid.bakw[1] - bakDistance * Math.cos(bakTheta),
    ];

    return { forw: forVertex, bakw };
  });

  const swap = vertices[2];
  vertices[2] = vertices[3];
  vertices[3] = swap;

  checkAndAdjustVertices(vertices, edgeNodes, centroid);

  return vertices;
}

/**
 * Calculate the standard four boundary vertices around the centroid.
 */
export function calculatePlainVertices(
  params: BoundaryVerticesParams,
): VertexPosition[] {
  const { convexBuf, centroid, bbox, minx, maxx, miny, maxy } = params;

  const edgeNodes = buildEdgeBuckets(convexBuf, centroid, minx, maxx, miny, maxy);
  const vertexRatio = buildVertexRatio(convexBuf, centroid, "plain");

  return finalizeVertices(vertexRatio, bbox, centroid, edgeNodes);
}

/**
 * Calculate boundary vertices for bird's-eye mode using quadrant-aware ratios.
 */
export function calculateBirdeyeVertices(
  params: BoundaryVerticesParams,
): VertexPosition[] {
  const { convexBuf, centroid, bbox, minx, maxx, miny, maxy } = params;
  const edgeNodes = buildEdgeBuckets(convexBuf, centroid, minx, maxx, miny, maxy);
  const vertexRatio = buildVertexRatio(convexBuf, centroid, "birdeye");

  return finalizeVertices(vertexRatio, bbox, centroid, edgeNodes);
}

// ─────────────────────────────────────────────────────────────────────────────
// Format version 3 – plain-mode boundary vertices (N vertices)
// ─────────────────────────────────────────────────────────────────────────────

export interface BoundaryVerticesV3Params {
  convexBuf: Record<string, ConvexEntry>;
  centroid: { forw: Position; bakw: Position };
  /** All GCPs as { forw, bakw } pairs — used for bin-based selection. */
  allGcps: Array<{ forw: Position; bakw: Position }>;
  minx: number;
  maxx: number;
  miny: number;
  maxy: number;
}


/**
 * Find the first intersection of the ray from `centroid` THROUGH `vertex` with
 * the axis-aligned bbox defined by [minx,maxx] × [miny,maxy].
 * Returns null if the ray does not intersect the bbox in the forward direction.
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
 * Compute the bakw position for a given forw position using the centroid
 * and aggregate [scale, rotation] ratio.
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

/** Convert a position to [0, 360) degrees using the atan2(Δx, Δy) convention. */
function toAngleDeg360(pos: Position, centroid: Position): number {
  const rawRad = Math.atan2(pos[0] - centroid[0], pos[1] - centroid[1]);
  const deg = rawRad * (180 / Math.PI);
  return deg < 0 ? deg + 360 : deg;
}

/**
 * Find the intersection of the ray from `centroid` through `rayDir` (and beyond)
 * with the segment [segStart, segEnd].
 * Returns { t, point } where t > 0 is the parameter along the ray, or null if no
 * valid intersection exists (wrong direction, parallel, or outside segment).
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
  if (Math.abs(denom) < 1e-12) return null; // parallel

  const t = (fx * ey - fy * ex) / denom;
  const s = (fx * dy - fy * dx) / denom;

  if (t <= 1e-10) return null; // behind or at centroid
  if (s < -1e-10 || s > 1 + 1e-10) return null; // outside segment

  return { t, point: [centroid[0] + t * dx, centroid[1] + t * dy] };
}

/**
 * Find the intersection of the ray from `centroid` through `rayDir` with the
 * bakw quadrilateral defined by `corners` (angularly sorted VertexPosition[]).
 * For a convex quad with centroid inside, returns the exit intersection (largest t).
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

/**
 * Generalised checkAndAdjustVertices for N boundary vertices.
 *
 * For each edge node, tests all N bakw quad sides to find the one the node
 * exits through (for convex quads, exactly one side is found if the node is
 * outside). Expands the two endpoints of that side so the bakw quad encloses
 * every edge node's bakw position.
 *
 * Testing all sides (instead of only the forw-angle-assigned side) ensures
 * correctness even when the forw→bakw transformation has significant rotation.
 */
function checkAndAdjustVerticesN(
  vertices: VertexPosition[],
  allEdgeNodes: Array<{ forw: Position; bakw: Position }>,
  centroid: { forw: Position; bakw: Position },
): void {
  const N = vertices.length;
  const expandRatio = new Array<number>(N).fill(1);

  for (const node of allEdgeNodes) {
    // Try every bakw quad side — for a convex quad with centroid inside,
    // the segment [centroid → node.bakw] crosses at most one side.
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

/**
 * Calculate boundary vertices for Format Version 3 plain mode.
 *
 * Algorithm: "10°-Uniform Bins + Corner Priority"
 *  - 36 bins of 10° each uniformly partition the 360° around the centroid.
 *  - The 4 bbox corners each claim the bin they fall into (up to 4 corner bins).
 *  - Each remaining bin selects the most-exterior GCP (max forw distance from
 *    centroid) in that angular range.
 *  - forw edge point = centroid_forw → selected_GCP_forw ray ∩ forw bbox
 *  - bakw edge point = centroid_bakw → selected_GCP_bakw ray ∩ bakw quad
 *    (computed independently — NOT via transform()).
 *  - Allocation per side is automatically proportional to each side's arc span.
 *
 * @returns Sorted list of up to 36 boundary vertices.
 */
export function calculatePlainVerticesV3(
  params: BoundaryVerticesV3Params,
): VertexPosition[] {
  const { convexBuf, centroid, allGcps, minx, maxx, miny, maxy } = params;

  // ── Phase 1: aggregate [scale, rotation] ratio ───────────────────────────
  const { aggregate } = collectSamples(convexBuf, centroid);
  const ratio = reduceSamples(aggregate);

  // ── Phase 2: 4 bbox corner vertices (forw + extrapolated bakw) ───────────
  const bboxCornerForws: Position[] = [
    [minx, miny],
    [maxx, miny],
    [maxx, maxy],
    [minx, maxy],
  ];
  const cornerVertices: VertexPosition[] = bboxCornerForws.map((forw) => ({
    forw,
    bakw: computeVertexBakwFromRatio(forw, centroid, ratio),
  }));

  // Sort corners ascending by atan2(Δx, Δy)
  cornerVertices.sort((a, b) =>
    Math.atan2(a.forw[0] - centroid.forw[0], a.forw[1] - centroid.forw[1]) -
    Math.atan2(b.forw[0] - centroid.forw[0], b.forw[1] - centroid.forw[1])
  );

  // Expand bakw corners so all GCP bakw positions are enclosed.
  // checkAndAdjustVerticesN uses forw angles to assign GCPs to bakw segments,
  // then ensures the bakw quad side encompasses each GCP's bakw position.
  checkAndAdjustVerticesN(cornerVertices, allGcps, centroid);

  // ── Phase 3: 36-bin GCP selection ────────────────────────────────────────
  // Determine which 10° bin each corner occupies
  const cornerBins = new Set<number>(
    cornerVertices.map((cv) => Math.floor(toAngleDeg360(cv.forw, centroid.forw) / 10) % 36),
  );

  // Build GCP info: angle in [0, 360), distance from centroid_forw
  type GcpInfo = { forw: Position; bakw: Position; angleDeg: number; dist: number };
  const gcpInfos: GcpInfo[] = allGcps.map((gcp) => ({
    forw: gcp.forw,
    bakw: gcp.bakw,
    angleDeg: toAngleDeg360(gcp.forw, centroid.forw),
    dist: Math.hypot(gcp.forw[0] - centroid.forw[0], gcp.forw[1] - centroid.forw[1]),
  }));

  const edgeVertices: VertexPosition[] = [];

  for (let bin = 0; bin < 36; bin++) {
    if (cornerBins.has(bin)) continue; // corner occupies this bin

    const binStart = bin * 10;
    const binEnd = binStart + 10;

    // GCPs whose angle falls in [binStart, binEnd)
    const inBin = gcpInfos.filter((g) => g.angleDeg >= binStart && g.angleDeg < binEnd);

    let forwEdge: Position | null = null;

    if (inBin.length > 0) {
      // Select the most exterior GCP (largest distance from centroid_forw)
      const sel = inBin.reduce((best, g) => g.dist > best.dist ? g : best);
      // forw edge point: centroid_forw → GCP_forw ray ∩ forw bbox
      forwEdge = findRayBboxIntersection(centroid.forw, sel.forw, minx, maxx, miny, maxy);
    }

    // Fallback: no GCP in bin → use bin-center direction
    if (!forwEdge) {
      const binCenterRad = ((binStart + 5) % 360) * (Math.PI / 180);
      // atan2(Δx,Δy) convention: direction = (sin(angle), cos(angle))
      const fallbackDir: Position = [
        centroid.forw[0] + Math.sin(binCenterRad),
        centroid.forw[1] + Math.cos(binCenterRad),
      ];
      forwEdge = findRayBboxIntersection(centroid.forw, fallbackDir, minx, maxx, miny, maxy);
    }

    if (!forwEdge) continue;

    // bakw edge point: transform the forw direction via aggregate ratio, then
    // find its intersection with the bakw quad side.
    // Using ratio-based direction (NOT GCP_bakw directly) avoids collinearity
    // with constrained edges that could cause triangulation failures.
    const forDelta = [forwEdge[0] - centroid.forw[0], forwEdge[1] - centroid.forw[1]];
    const bakwTheta = Math.atan2(forDelta[0], forDelta[1]) - ratio[1];
    const bakwDirPt: Position = [
      centroid.bakw[0] + Math.sin(bakwTheta),
      centroid.bakw[1] - Math.cos(bakwTheta),
    ];
    const bakwEdge = findRayQuadIntersection(centroid.bakw, bakwDirPt, cornerVertices);

    if (bakwEdge) {
      edgeVertices.push({ forw: forwEdge, bakw: bakwEdge });
    }
  }

  // ── Phase 4: Combine corners + edge points, sort by angle ────────────────
  const allVertices: VertexPosition[] = [...cornerVertices, ...edgeVertices];
  allVertices.sort((a, b) =>
    Math.atan2(a.forw[0] - centroid.forw[0], a.forw[1] - centroid.forw[1]) -
    Math.atan2(b.forw[0] - centroid.forw[0], b.forw[1] - centroid.forw[1])
  );

  return allVertices;
}
