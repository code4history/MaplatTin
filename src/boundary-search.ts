import { featureCollection } from "@turf/turf";
import type { Feature, Point, Position } from "geojson";
import type { Edge, Tins } from "@maplat/transform";
import { orient2d } from "robust-predicates";
import type { BoundaryVerticesParams } from "./boundary-vertices.ts";
import { buildConstrainedTin, type ConstrainedTinReuse } from "./constrained-tin.ts";
import { convexHullEdges, hullEdgeKey } from "./hull-edges.ts";
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
  /**
   * strict にならなかったので、補助頂点の輪を手当てして strict にした。`"thinned"` は strict を壊す
   * 補助頂点（と両隣の区分）だけを外した輪、`"corners"` は四隅だけの輪（縮尺と回転の推定は V3 のまま）。
   * 手当てをしていなければ項目ごと無い。
   */
  readonly ringRescue?: "thinned" | "corners";
  /** world file 外周を指定した場合の要求方式。 */
  readonly requestedOuterTransform?: "worldFile";
  /** world file 外周を指定した場合に、実際に採用した方式。 */
  readonly outerTransform?: "worldFile" | "extrapolate";
  /** 上限までに使える world file 外周が見つからなかった。 */
  readonly fallbackReason?: "boundaryFlips";
}

export interface BoundaryCandidate {
  vertices: VertexPosition[];
  forw: Tins;
  bakw: Tins;
  diagnostics: BoundaryDiagnostics;
  /** 地図面で外周の辺を三角網の境界として確保できたか。 */
  hasMapBoundary: boolean;
  /** 両面で外周の辺を三角網の境界として確保できたか。 */
  hasBoundary: boolean;
  /**
   * 地図面の凸包の辺。`all` は凸包の辺の全部、`applied` は制約にできたもの
   * （外す指定・必須エッジとの衝突で、`all` より少ないことがある）。
   */
  forwHull: { all: Edge[]; applied: Edge[] };
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

export function countBoundaryFlips(tin: Tins, expectedOrientation: -1 | 1 = -1): number {
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
    const orientationProduct = orientation(p, q, r) * orientation(a.geom, b.geom, c.geom);
    if (orientationProduct * expectedOrientation <= 0) count++;
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

/**
 * 外す凸包の辺だけを変えて `searchBoundary` を繰り返すときに、結果が変わらない計算を使い回す入れ物。
 * 同じ点群・同じ外周の方式での呼び出しにだけ使う。余白ごとに、補助頂点の位置・地理面の三角網
 * （凸包の辺は地理面で独立に決まり、外す指定は地図面の凸包の辺にだけ効く）・地図面の必須エッジを
 * 張った状態を控える。
 */
export type SearchCache = Map<
  number,
  {
    vertices?: VertexPosition[];
    geographic?: {
      built: ReturnType<typeof buildConstrainedTin>;
      flips: number;
    };
    forwReuse: ConstrainedTinReuse;
  }
>;

export function searchBoundary(
  params: BoundaryVerticesParams,
  calculateVertices: (
    params: BoundaryVerticesParams,
    v3: boolean
  ) => VertexPosition[],
  points: { forw: Feature<Point>[]; bakw: Feature<Point>[]; edges: Edge[] },
  gcpCount: number,
  worldFile?: {
    orientation: -1 | 1;
    accept: (candidate: BoundaryCandidate) => boolean;
  },
  excludedHull: ReadonlySet<string> = new Set(),
  cache?: SearchCache
): BoundaryCandidate | undefined {
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
  // 凸包の辺は面ごとに作り、全部を制約にする。凸包は GCP と必須エッジの中継点（内側の点）の
  // 全体で取り、中継点が GCP の凸包の外に出る場合も必須エッジが凸包の辺をまたがないようにする。
  // 地図面の凸包の辺のうち excludedHull に鍵があるものは外す（strict を壊す辺を呼び出し側が特定する）。
  const interiorCoordinates = (features: Feature<Point>[]) =>
    features.slice(0, interiorCount).map(({ geometry }) => geometry.coordinates);
  const forwHullAll = convexHullEdges(interiorCoordinates(points.forw));
  const hulls = {
    forw: forwHullAll.filter((edge) => !excludedHull.has(hullEdgeKey(edge))),
    bakw: convexHullEdges(interiorCoordinates(points.bakw))
  };
  const boundaryGroup = [0];
  const groupsOf = (index: number) =>
    index >= interiorCount ? boundaryGroup : groups[index];

  let best: BoundaryCandidate | undefined;
  for (const margin of MARGINS) {
    const reuse = cache?.get(margin) ?? { forwReuse: {} };
    cache?.set(margin, reuse);
    const vertices =
      reuse.vertices ??
      (reuse.vertices = calculateVertices(
        {
          ...params,
          minx: minx - margin * width,
          maxx: maxx + margin * width,
          miny: miny - margin * height,
          maxy: maxy + margin * height
        },
        true
      ));
    if (
      worldFile &&
      (vertices.length < 4 || !vertices.every(({ bakw }) => bakw.every(Number.isFinite)))
    ) continue;
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
    // 扇形の境界には、地図面で時計回り、地理面で反時計回りの星形が必要。
    const canConstrainBoundary = worldFile !== undefined ||
      (isStarShaped(
        vertices.map((v) => v.forw),
        centroid.forw,
        -1
      ) &&
        isStarShaped(
          vertices.map((v) => v.bakw),
          centroid.bakw,
          1
        ));
    const boundary = canConstrainBoundary
      ? vertices.map((_, i): Edge => [
          interiorCount + i,
          interiorCount + ((i + 1) % vertices.length)
        ])
      : undefined;
    const forbidden = { groupsOf, planes, boundary, allowUnusableBoundary: worldFile !== undefined };
    const expectedOrientation = worldFile?.orientation ?? -1;
    const fromMap = buildConstrainedTin(
      forw,
      points.edges,
      "target",
      { ...forbidden, hull: hulls.forw },
      reuse.forwReuse
    );
    // 地理面の三角網は、外す凸包の辺（地図面の凸包の辺）に依らないので、2 回目からは使い回す。
    // 下流で三角形の並びを入れ替える（rotateVerticesTriangle）ので、配列は複製して渡す。
    const geographic =
      reuse.geographic ??
      (reuse.geographic = (() => {
        const built = buildConstrainedTin(bakw, points.edges, "target", {
          ...forbidden,
          hull: hulls.bakw
        });
        return { built, flips: countBoundaryFlips(built.tin as Tins, expectedOrientation) };
      })());
    const fromGeographic = geographic.built;
    const forwTin = fromMap.tin as Tins;
    const bakwTin = {
      ...fromGeographic.tin,
      features: [...fromGeographic.tin.features]
    } as Tins;
    const boundaryTriangleFlips =
      countBoundaryFlips(forwTin, expectedOrientation) + geographic.flips;
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
      hasMapBoundary: fromMap.hasBoundary,
      hasBoundary: fromMap.hasBoundary && fromGeographic.hasBoundary,
      forwHull: { all: forwHullAll, applied: fromMap.hull }
    };

    if (worldFile) {
      if (worldFile.accept(candidate)) return candidate;
      continue;
    }
    if (boundaryTriangleFlips === 0 && candidate.hasBoundary) {
      return candidate;
    }
    if (isBetterBoundaryCandidate(candidate, best)) {
      best = candidate;
    }
  }
  return best;
}
