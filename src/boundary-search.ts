import { featureCollection } from "@turf/turf";
import type { Feature, Point, Position } from "geojson";
import type { Edge, Tins } from "@maplat/transform";
import { orient2d } from "robust-predicates";
import type { BoundaryVerticesParams } from "./boundary-vertices.ts";
import { buildConstrainedTin } from "./constrained-tin.ts";
import type { VertexPosition } from "./types/tin.ts";
import { counterPoint, createPoint } from "./vertexutils.ts";

const MARGINS = [0.1, 0.15, 0.225, 0.34, 0.5] as const;

/** V3 の境界生成時の診断。件数は地図面と地理面の三角網の合計。 */
export interface BoundaryDiagnostics {
  /** GCP の外接矩形の幅・高さに対する、各辺に加えた余白の割合。 */
  readonly margin: number;
  /**
   * 補助頂点を含む三角形のうち、向きが反転したか、面積が 0 のものの数。地図面で作った三角網と、
   * 地理面で独立に作った三角網（`loose` の経路で使うもの）の合計。`strict` で地理面の三角網を
   * 地図面から写して作る場合も、探索の判定に使った両面の値を返す（実際に使う三角網の反転の数とは
   * 一致しないことがある）。
   */
  readonly boundaryTriangleFlips: number;
  /** 同じ群の点だけででき、辺反転で解消できなかった三角形の数。 */
  readonly remainingForbiddenTriangles: number;
}

interface BoundaryCandidate {
  vertices: VertexPosition[];
  forw: Tins;
  bakw: Tins;
  diagnostics: BoundaryDiagnostics;
  /** 両面で補助頂点の輪が閉じた（扇形が星形で、輪の外に GCP・中継点が無い）か。 */
  hasBoundary: boolean;
}

/**
 * どの余白も合格しなかったときに、候補 a が b より良いか。
 * 両面で輪が閉じた候補を、反転の数より優先する（輪が閉じない候補は扇形の外挿が成り立たない）。
 * 同じ扱いの中では反転の少ない方。同数なら先に試した（小さい余白の）b を残す。
 */
export function isBetterBoundaryCandidate(
  a: { hasBoundary: boolean; diagnostics: Pick<BoundaryDiagnostics, "boundaryTriangleFlips"> },
  b: { hasBoundary: boolean; diagnostics: Pick<BoundaryDiagnostics, "boundaryTriangleFlips"> } | undefined
): boolean {
  if (!b) return true;
  if (a.hasBoundary !== b.hasBoundary) return a.hasBoundary;
  return a.diagnostics.boundaryTriangleFlips < b.diagnostics.boundaryTriangleFlips;
}

function orientation(a: Position, b: Position, c: Position): number {
  return Math.sign(orient2d(a[0], a[1], b[0], b[1], c[0], c[1]));
}

function countBoundaryFlips(tin: Tins): number {
  let count = 0;
  for (const triangle of tin.features) {
    const { a, b, c } = triangle.properties!;
    if (
      ![a, b, c].some(
        ({ index }) => typeof index === "string" && index.startsWith("b")
      )
    )
      continue;
    const [p, q, r] = triangle.geometry!.coordinates[0];
    // 地理面の内部座標は地図面と Y 軸の向きが逆。
    if (orientation(p, q, r) * orientation(a.geom, b.geom, c.geom) >= 0)
      count++;
  }
  return count;
}

function isStarShaped(
  points: Position[],
  center: Position,
  direction: number
): boolean {
  if (points.some(([x, y]) => x === center[0] && y === center[1])) return false;
  const angles = points.map(([x, y]) =>
    Math.atan2(y - center[1], x - center[0])
  );
  const turn = 2 * Math.PI;
  let total = 0;
  for (let i = 0; i < angles.length; i++) {
    const delta = direction * (angles[(i + 1) % angles.length] - angles[i]);
    const gap = (delta + turn) % turn;
    if (!(gap > 0 && gap < Math.PI)) return false;
    total += gap;
  }
  return Math.abs(total - turn) < 1e-6;
}

export function searchBoundary(
  params: BoundaryVerticesParams,
  calculateVertices: (
    params: BoundaryVerticesParams,
    v3: boolean
  ) => VertexPosition[],
  points: { forw: Feature<Point>[]; bakw: Feature<Point>[]; edges: Edge[] },
  gcpCount: number
): BoundaryCandidate {
  const { minx, maxx, miny, maxy, centroid } = params;
  const width = maxx - minx;
  const height = maxy - miny;
  const interiorCount = points.forw.length;
  const groups: number[][] = Array.from({ length: interiorCount }, () => []);
  let edgeGroup = 1;
  // 必須エッジの各区間は生成された順に並び、GCP に着いたところで次の群になる。
  for (const [a, b] of points.edges) {
    if (a < gcpCount) groups[a].push(edgeGroup);
    groups[b].push(edgeGroup);
    if (b < gcpCount) edgeGroup++;
  }
  const boundaryGroup = [0];
  const groupsOf = (index: number) =>
    index >= interiorCount ? boundaryGroup : groups[index];

  let best: BoundaryCandidate | undefined;
  for (const margin of MARGINS) {
    const vertices = calculateVertices(
      {
        ...params,
        minx: minx - margin * width,
        maxx: maxx + margin * width,
        miny: miny - margin * height,
        maxy: maxy + margin * height
      },
      true
    );
    const auxiliary = vertices.map(({ forw, bakw }, i) =>
      createPoint(forw, bakw, `b${i}`)
    );
    const forw = featureCollection([...points.forw, ...auxiliary]);
    const bakw = featureCollection([
      ...points.bakw,
      ...auxiliary.map(counterPoint)
    ]);
    const planes = [forw, bakw].map(({ features }) =>
      Float64Array.from(
        features.flatMap(
          ({
            geometry: {
              coordinates: [x, y]
            }
          }) => [x, y]
        )
      )
    );
    // 境界頂点は地図面で時計回り、地理面で反時計回りに並ぶ。
    const star =
      isStarShaped(
        vertices.map((v) => v.forw),
        centroid.forw,
        -1
      ) &&
      isStarShaped(
        vertices.map((v) => v.bakw),
        centroid.bakw,
        1
      );
    const boundary = star
      ? vertices.map((_, i): Edge => [
          interiorCount + i,
          interiorCount + ((i + 1) % vertices.length)
        ])
      : undefined;
    const forbidden = { groupsOf, planes, boundary };
    const fromMap = buildConstrainedTin(
      forw,
      points.edges,
      "target",
      forbidden
    );
    const fromGeographic = buildConstrainedTin(
      bakw,
      points.edges,
      "target",
      forbidden
    );
    const forwTin = fromMap.tin as Tins;
    const bakwTin = fromGeographic.tin as Tins;
    const boundaryTriangleFlips =
      countBoundaryFlips(forwTin) + countBoundaryFlips(bakwTin);
    const candidate: BoundaryCandidate = {
      vertices,
      forw: forwTin,
      bakw: bakwTin,
      diagnostics: {
        margin,
        boundaryTriangleFlips,
        remainingForbiddenTriangles:
          fromMap.remaining + fromGeographic.remaining
      },
      hasBoundary: fromMap.hasBoundary && fromGeographic.hasBoundary
    };

    if (boundaryTriangleFlips === 0 && candidate.hasBoundary) {
      return candidate;
    }
    if (isBetterBoundaryCandidate(candidate, best)) {
      best = candidate;
    }
  }
  return best!;
}
