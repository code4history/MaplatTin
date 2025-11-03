import { lineString } from "@turf/helpers";
import lineIntersect from "@turf/line-intersect";
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
