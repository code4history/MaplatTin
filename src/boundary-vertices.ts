import { lineString, lineIntersect } from "@turf/turf";
import type { Position } from "geojson";
import type { VertexPosition } from "./types/tin.ts";

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

/** 10° の区分の境界の方向にある点とみなす角度の許容（度）。 */
const BIN_EDGE_TOLERANCE_DEG = 1e-9;

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

/**
 * 扇形外挿の縮尺と回転の推定方法。
 *
 * - `"min"`: 従来。縮尺は凸包の点の比の最小値、回転は重みなしの平均。V2・birdeye・world file 外周が使う。
 * - `"farLsq"`: 重心から遠い凸包の点の最小二乗（V3 の plain）。当てはまりが悪いときは `"min"` に戻る。
 */
export type RatioEstimator = "min" | "farLsq";

/**
 * 扇形外挿の縮尺と回転を、重心から遠い凸包の点の最小二乗で決める（V3 の plain だけ）。
 *
 * 従来の `reduceSamples` は、縮尺を凸包の点の比の最小値、回転を重みなしの平均で決める。重心に近い凸包の点
 * には、GCP の打ち誤差が「誤差 ÷ 重心からの距離」の割合で乗り、最小値はその極値を拾う。拾った縮尺は紙の隅
 * まで同じ割合で効くので、扇形の外側で増幅される（誤差 3 画素の GCP 24 組で、外側の最大が 106 km）。
 *
 * ここでは、重心からの紙の距離が最遠の点の `FAN_FIT_FAR_RATIO` 倍以上の凸包の点だけを使い、重心を固定した
 * 相似 `F ≈ z·B` を最小二乗で当てはめる。`F`・`B` は重心からの紙・地理の差で、実部を y・虚部を x に取る
 * 複素数（向きの基準は `atan2(Δx, Δy)` に合わせる）。`z = Σ F·conj(B) / Σ |B|²` で、縮尺は `|z|`、回転は
 * `arg z`。重みが `|B|²` になるので、近い点の誤差は効きにくい。
 *
 * 従来の推定へ戻る場合:
 * - 遠い点が `FAN_FIT_MIN_POINTS` 点に満たないとき（GCP が 4〜6 組の図など）は、凸包の全点で同じ最小二乗を
 *   当てはめる（これは戻りではなく、使う点を増やす）。
 * - 当てはめの一致度 `|Σ F·conj(B)| / √(Σ|F|²·Σ|B|²)`（0〜1。相似に完全に乗れば 1）が
 *   `FAN_FIT_MIN_AGREEMENT` に満たないとき。地理側が紙に対して裏返し（鏡像）だと、`Σ F·conj(B)` が
 *   打ち消し合って `|z|` が 0 に近い正の値になり、補助頂点が際限なく遠くへ飛ぶ。このとき相似では
 *   説明できないので、従来の推定（縮尺の最小値）に戻す。
 * - 点が空、または全点が重心と一致して `Σ|F|²` か `Σ|B|²` が 0 のとき。
 */
const FAN_FIT_FAR_RATIO = 0.6;
const FAN_FIT_MIN_POINTS = 3;
// 正常な入力の一致度の実測（凸包の点の相似への乗り方）: Core のデモの素材（P1・P3・打ち間違い入り）は
// 0.9996 以上、実地図（延岡・伏見・三重山・館林 2 枚・宇野バス）は 0.90〜1.00、それらの GCP を間引いた
// 4〜6 組・中心寄りの 40〜80 %（234 件）は最小 0.79・5 % 点 0.93・中央値 0.9986。鏡像は 0 に近い。
// 0.5 なら、一致度が低いまま採っても縮尺は理想の半分（補助頂点が 2 倍遠い）までで、際限なくは飛ばない。
const FAN_FIT_MIN_AGREEMENT = 0.5;

/** 重心固定の相似の最小二乗。当てはまらないとき（退化・一致度が低い）は undefined。 */
function fitSimilarity(samples: SamplePair[]): [number, number] | undefined {
  let re = 0;
  let im = 0;
  let bakwNorm = 0;
  let forwNorm = 0;
  samples.forEach(({ forw, bakw }) => {
    // F = Δy + iΔx、B = Δy + iΔx（collectSamples で bakw の y は反転済み）
    re += forw[1] * bakw[1] + forw[0] * bakw[0];
    im += forw[0] * bakw[1] - forw[1] * bakw[0];
    bakwNorm += bakw[0] * bakw[0] + bakw[1] * bakw[1];
    forwNorm += forw[0] * forw[0] + forw[1] * forw[1];
  });
  if (!(bakwNorm > 0 && forwNorm > 0)) return undefined;
  const agreement = Math.hypot(re, im) / Math.sqrt(forwNorm * bakwNorm);
  if (!(agreement >= FAN_FIT_MIN_AGREEMENT)) return undefined;
  return [Math.hypot(re, im) / bakwNorm, Math.atan2(im, re)];
}

function reduceSamplesFar(samples: SamplePair[]): [number, number] {
  const distance = (s: SamplePair) => Math.hypot(s.forw[0], s.forw[1]);
  const farthest = Math.max(...samples.map(distance));
  const far = samples.filter((s) => distance(s) >= FAN_FIT_FAR_RATIO * farthest);
  return fitSimilarity(far.length >= FAN_FIT_MIN_POINTS ? far : samples) ?? reduceSamples(samples);
}

function buildVertexRatio(
  convexBuf: Record<string, ConvexEntry>,
  centroid: { forw: Position; bakw: Position },
  mode: "plain" | "birdeye",
  estimator: RatioEstimator,
): Array<[number, number]> {
  const { perQuad, aggregate } = collectSamples(convexBuf, centroid);
  const hasAllQuadrants = perQuad.every((samples) => samples.length > 0);

  const groups: SamplePair[][] = mode === "birdeye"
    ? (hasAllQuadrants ? perQuad : [aggregate])
    : [aggregate];

  // "farLsq" は plain の V3 だけ（呼び出し側が選ぶ）。V2・birdeye の象限ごとの推定は従来の最小値のまま
  // （既存の地図の結果を変えない）。
  const reduce = estimator === "farLsq" ? reduceSamplesFar : reduceSamples;
  const vertexRatio = groups.map((samples) => reduce(samples));

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
 * Compute per-quadrant (birdeye) or aggregate (plain) [scale, rotation]
 * ratios from the convex hull of all GCPs.  V2 and birdeye use [minScale,
 * avgRotation]; V3 plain fits a centroid-fixed similarity to the hull points far
 * from the centroid (see `reduceSamplesFar`).
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
  /** 辺の上に補助頂点を作るか（V3）。V2 は四隅だけ。 */
  withEdgeVertices: boolean,
  /** 扇形外挿の縮尺と回転の推定方法。辺の上に補助頂点を作るかとは独立に選ぶ。 */
  estimator: RatioEstimator,
  project?: (forw: Position) => Position,
): VertexPosition[] {
  const { convexBuf, centroid, allGcps, minx, maxx, miny, maxy } = params;

  // ── Phase 1 ───────────────────────────────────────────────────────────────
  const cornerRatios = project ? undefined : buildVertexRatio(convexBuf, centroid, mode, estimator);

  // ── Phase 2: 4 bbox corner vertices ───────────────────────────────────────
  const bboxCornerForws: Position[] = [
    [minx, miny],
    [maxx, miny],
    [maxx, maxy],
    [minx, maxy],
  ];
  const cornerVertices: VertexPosition[] = bboxCornerForws.map((forw) => ({
    forw,
    bakw: project ? project(forw) : computeVertexBakwFromRatio(
      forw,
      centroid,
      cornerRatios![forwQuadrant(forw, centroid.forw)],
    ),
  }));

  // Sort corners CCW by forw angle (atan2(Δx, Δy) convention)
  cornerVertices.sort((a, b) =>
    Math.atan2(a.forw[0] - centroid.forw[0], a.forw[1] - centroid.forw[1]) -
    Math.atan2(b.forw[0] - centroid.forw[0], b.forw[1] - centroid.forw[1])
  );

  // Expand corners to enclose all GCPs + edge nodes in bakw space
  if (!project) checkAndAdjustVerticesN(cornerVertices, allGcps, centroid);

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
    // 区分は半開区間 [binStart, binStart+10) だが、区分の境界の方向（例: 真東の 90°）にある点は
    // 両側の区分に入れる。片側にだけ入れると、GCP が対称に並んでいても補助頂点が対称にならない
    // （真東の点を含む区分は点を通る方向になり、反対側の区分は中心の方向になる）。
    // 中心と一致する点は方向を持たないので、どの区分にも入れない。
    const inBin = gcpInfos.filter((g) => {
      if (g.forwDist === 0) return false;
      const rel = ((g.angleDeg - binStart) % 360 + 360) % 360;
      return rel < 10 + BIN_EDGE_TOLERANCE_DEG || rel > 360 - BIN_EDGE_TOLERANCE_DEG;
    });

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
    // 境界の方向にある点を両側の区分で選ぶと、同じ位置の頂点ができる。1 つにまとめる。
    // 隅の方向が区分の境界にちょうど一致するときは、四隅の頂点とも重なるので、隅とも比べる。
    const [fx, fy] = forwEdge;
    const tolerance = 1e-9 * Math.max(maxx - minx, maxy - miny);
    if (
      [...cornerVertices, ...edgeVertices].some(
        (v) =>
          Math.abs(v.forw[0] - fx) <= tolerance &&
          Math.abs(v.forw[1] - fy) <= tolerance,
      )
    ) continue;
    if (project) {
      edgeVertices.push({ forw: forwEdge, bakw: project(forwEdge) });
      continue;
    }

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
  if (!project) checkAndAdjustVerticesN(allVertices, allGcps, centroid);

  return allVertices;
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Calculate boundary vertices in plain mode.
 *
 * @param params - Input parameters including GCPs, centroid, and bounding box.
 * @param v3 - When true (V3 format), runs the full 36-bin edge vertex pass
 *   (Phase 3) in addition to the 4 bbox corners, producing up to 36 vertices.
 *   When false (V2 format), returns only the 4 bbox corners.
 *
 * Plain mode uses a single aggregate [scale, rotation] ratio from all GCPs.
 * V3 estimates it by a least-squares fit to the hull points far from the
 * centroid; V2 keeps the minimum-ratio estimate.
 */
export function calculatePlainVertices(
  params: BoundaryVerticesParams,
  v3 = false,
): VertexPosition[] {
  return calculateVerticesCore(params, "plain", v3, v3 ? "farLsq" : "min");
}

/**
 * Calculate boundary vertices in bird's-eye mode.
 *
 * @param params - Input parameters including GCPs, centroid, and bounding box.
 * @param v3 - When true (V3 format), runs the full 36-bin edge vertex pass
 *   (Phase 3) in addition to the 4 bbox corners, producing up to 36 vertices.
 *   When false (V2 format), returns only the 4 bbox corners.
 *
 * Birdeye mode uses per-quadrant [scale, rotation] ratios to capture
 * perspective distortion in the 4 corner positions.
 */
export function calculateBirdeyeVertices(
  params: BoundaryVerticesParams,
  v3 = false,
): VertexPosition[] {
  return calculateVerticesCore(params, "birdeye", v3, "min");
}

/** 四隅と辺上の補助頂点を輪の順に並べ、地理側は world file の値で固定する。 */
export function calculateWorldFileVertices(
  params: BoundaryVerticesParams,
  project: (forw: Position) => Position
): VertexPosition[] {
  const seen = new Set<string>();
  return calculateVerticesCore(params, "plain", true, "min", project).filter(({ forw: [x, y] }) => {
    const key = `${x}:${y}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
