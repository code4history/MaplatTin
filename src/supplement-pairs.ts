/**
 * 補完点（supplementPairs）: strict のために制約から外した凸包の辺に、システムが足す対応点（#89）。
 *
 * 凸包の辺 A–B を制約にすると strict が壊れるとき、A–B を辺にする内側の三角形（A・B・P）が地理の面で
 * 裏返っている。紙の面の辺の上に点 Q を 1 つ置き、地理の面の位置 Q′ を「Q を頂点にする三角形が全部
 * 正しい向きに見える範囲（核）」の中に決めると、A–Q・Q–B を制約にしても strict を保てる。補助頂点の
 * 三角形が凸包の内側へ食い込むのは、この辺を制約にできなかったことが原因なので、これで解ける。
 *
 * このファイルは、点の置き場所の計算（`proposeSupplementCandidate`・`fitToKernel`）と、候補を試す
 * 手順（`addSupplementPairs`）を持つ。三角網の組み立て・状態の保存は呼び出し側（`Tin`）が
 * `SupplementHost` として渡す。
 */
import { orient2d } from "robust-predicates";
import type { Feature, Point, Position } from "geojson";
import type { Edge, Tins } from "@maplat/transform";

/** 候補を試す回の数の上限。 */
export const MAX_SUPPLEMENT_PAIR_ROUNDS = 4;
/** 補完点の合計の上限。 */
export const MAX_SUPPLEMENT_PAIRS = 32;
/**
 * 補完点の手順に使ってよい手間の上限（最初の三角網の組み立て 1 回分に対する倍数）。辺の近くに対応点が
 * 並ぶ入力では、辺ごとの組み直しが膨らんで時間が桁違いになるので、ここで諦める（諦めたときは、補完点を
 * 足す前の結果）。普通の入力は、まとめて試す 1 回（測る 2 回＋組む 1 回 = 約 1.8）で終わる。
 */
export const SUPPLEMENT_BUDGET_FACTOR = 1;
/** 置き場所を測る試行 1 回の手間（組み立て 1 回を 1 とする。交差を調べず、探索の入れ物も使い回すので軽い）。 */
export const SUPPLEMENT_MEASURE_COST = 0.4;
/** 地理の面の高さを核の中に決め直す繰り返しの上限。 */
export const MAX_KERNEL_FIT_ITERATIONS = 4;
/** 紙の面で、弦の長さに対して外へ出す割合（弦の上のちょうどには置けない）。 */
export const SUPPLEMENT_EPSILON = 1e-4;
/** 地理の面で、出っ張りの高さ（核の下限）に足す割合。 */
export const SUPPLEMENT_LAMBDA = 0.25;
/** 地理の面で、弦の長さに対する高さの余裕の下限の割合（出っ張りが無いときに三角形がつぶれない）。 */
export const SUPPLEMENT_MU = 0.01;

/** 三角形の頂点の添字（GCP は数、中継点・補完点は "e12"、補助頂点は "b3"）。 */
export type VertexId = number | string;

/** compiled に書く補完点の一覧の 1 件。座標は `edgeNodes[node]` に 1 か所だけ持つ。 */
export interface SupplementPairRecord {
  /** `edgeNodes` の中の位置。三角形の頂点からは `"e{node}"` で指す。 */
  node: number;
  /** 補完点を足した理由。今は凸包の辺だけ。 */
  kind: "hullEdge";
  /** 足した凸包の辺の両端（対応点は数、中継点・補完点は "e12"）。 */
  edge: [VertexId, VertexId];
  /** いちばん凹んだ所の点の添字（弦の範囲に外へ出る点が無いときは省く）。 */
  anchor?: VertexId;
}

/** 座標を付けた補完点（`Tin#supplementPairs`）。座標は内部の座標（`edgeNodes` と同じ）。 */
export interface SupplementPair extends SupplementPairRecord {
  /** 紙の面の座標 */
  forw: Position;
  /** 地理の面の座標 */
  bakw: Position;
}

/** 補完の手順の診断（試験・調査用）。 */
export interface SupplementDiagnostics {
  /** 候補を試した回の数 */
  rounds: number;
  /** 三角網を組んだ回数（測る試行と採否の試行の合計） */
  builds: number;
  /** 使った手間（`measure` 1 回 = `SUPPLEMENT_MEASURE_COST`、`build` は組んだ試行の数） */
  cost: number;
  /** 手間の上限（最初の組み立ての手間 × `SUPPLEMENT_BUDGET_FACTOR`）。使った手間は、これに高々 1 を足した値まで */
  budget: number;
  /** 外れた辺をまとめて試して採用した回数 */
  batches: number;
  /** 外れた辺ごとに試して採用した回数（1 点の案と複数点の案の合計） */
  perEdge: number;
  /** 複数点の案を採用した回数 */
  multiPoint: number;
}

interface MeshPoint {
  id: VertexId;
  paper: Position;
  geo: Position;
}

interface MeshTriangle {
  ids: string[];
  paper: Position[];
  geo: Position[];
  /** 紙の面の向き × 地理の面の向き */
  sign: number;
}

/** 採用した（または測った）三角網の読み取り。 */
export interface MeshAnalysis {
  /** 補助頂点を除いた点（GCP・中継点・補完点）。`hullEdges` の添字はこの並びで引く。 */
  points: MeshPoint[];
  triangles: MeshTriangle[];
  /** 向きの積の多数派（食い違う三角形はこれと違うもの） */
  majority: 1 | -1;
  /** 紙の面の凸包の辺（`points` の添字の組） */
  hullEdges: Edge[];
  /** 凸包の辺のうち、三角網の辺になっていないもの */
  dropped: Edge[];
}

const meshKey = (a: VertexId, b: VertexId) => (String(a) < String(b) ? `${a}|${b}` : `${b}|${a}`);

/**
 * 三角網 `forw`（地図面）を読む。`features` は三角網を組んだ点（補助頂点は末尾）、`hullEdges` は
 * 紙の面の凸包の辺の全部（その添字で `features` を引く。測るだけのときは空でよい）。
 */
export function analyzeMesh(tins: Tins, features: Feature<Point>[], hullEdges: Edge[]): MeshAnalysis {
  const points: MeshPoint[] = features
    .filter((feature) => !String(feature.properties!.target.index).startsWith("b"))
    .map((feature) => ({
      id: feature.properties!.target.index as VertexId,
      paper: feature.geometry.coordinates,
      geo: feature.properties!.target.geom as Position
    }));
  const meshEdges = new Set<string>();
  let positive = 0;
  let negative = 0;
  const triangles = tins.features.map((triangle): MeshTriangle => {
    const { a, b, c } = triangle.properties!;
    const [p, q, r] = triangle.geometry!.coordinates[0];
    meshEdges.add(meshKey(a.index, b.index));
    meshEdges.add(meshKey(a.index, c.index));
    meshEdges.add(meshKey(b.index, c.index));
    const sign =
      Math.sign(orient2d(p[0], p[1], q[0], q[1], r[0], r[1])) *
      Math.sign(orient2d(a.geom[0], a.geom[1], b.geom[0], b.geom[1], c.geom[0], c.geom[1]));
    if (sign > 0) positive++;
    else if (sign < 0) negative++;
    return {
      ids: [String(a.index), String(b.index), String(c.index)],
      paper: [p, q, r],
      geo: [a.geom, b.geom, c.geom],
      sign
    };
  });
  const dropped = hullEdges.filter(([i, j]) => !meshEdges.has(meshKey(points[i].id, points[j].id)));
  return { points, triangles, majority: positive >= negative ? 1 : -1, hullEdges, dropped };
}

/** 地理の面の半直線 `foot + height · normal` の上に置く点。紙の面の位置は固定。 */
export interface SupplementRay {
  /** 紙の面の位置 */
  paper: Position;
  /** 半直線の始点（P\* から弦 A′–B′ へ下ろした足、または弦の中点） */
  foot: Position;
  /** 外向きの単位法線（地理の面） */
  normal: Position;
  /** 始点からの高さ */
  height: number;
  /** 弦 A′–B′ の長さ */
  chord: number;
  /** いちばん凹んだ所の出っ張りの高さ */
  protrusion: number;
  /** その点を置く理由になった点の添字 */
  anchor?: VertexId;
}

/** 半直線の上の、地理の面の位置。 */
export function rayGeo(ray: SupplementRay): Position {
  return [ray.foot[0] + ray.height * ray.normal[0], ray.foot[1] + ray.height * ray.normal[1]];
}

/** 外れた凸包の辺 1 本に対する候補。 */
export interface SupplementCandidate {
  edge: [VertexId, VertexId];
  /** 試す案。先頭は 1 点の案。弦の範囲で 2 か所以上が出っ張るときは、複数点の案が続く。 */
  variants: SupplementRay[][];
}

/**
 * 外れた凸包の辺 A–B に足す点の候補を決める（設計書 §2.2）。
 * 地理の面で A′–B′ の外へ出る点の集まり S から、いちばん凹んだ所 P\* を取り、P\* から弦へ下ろした足の
 * 紙の面の位置を、弦の長さ × ε だけ外へ出して Q にする。S が空なら弦の中点。
 */
export function proposeSupplementCandidate(
  analysis: MeshAnalysis,
  [i, j]: Edge,
  { lambda = SUPPLEMENT_LAMBDA, epsilon = SUPPLEMENT_EPSILON } = {}
): SupplementCandidate | undefined {
  const { points, majority } = analysis;
  const A = points[i];
  const B = points[j];
  const cx = points.reduce((sum, v) => sum + v.paper[0], 0) / points.length;
  const cy = points.reduce((sum, v) => sum + v.paper[1], 0) / points.length;
  const side = Math.sign(orient2d(A.paper[0], A.paper[1], B.paper[0], B.paper[1], cx, cy));
  if (side === 0) return undefined;
  // 地理の面で内側の点が持つ向き
  const innerSide = side * majority;
  const dp = [B.paper[0] - A.paper[0], B.paper[1] - A.paper[1]];
  const dg = [B.geo[0] - A.geo[0], B.geo[1] - A.geo[1]];
  const Lp = Math.hypot(dp[0], dp[1]);
  const Lg = Math.hypot(dg[0], dg[1]);
  if (!(Lp > 0 && Lg > 0)) return undefined;

  interface Protrusion {
    id?: VertexId;
    /** 弦の上の位置（地理の面） */
    u: number;
    /** 弦の上の位置（紙の面） */
    t: number;
    /** 地理の面で弦から外へ出た距離 */
    d: number;
  }
  const outside: Protrusion[] = [];
  for (const P of points) {
    if (P === A || P === B) continue;
    const o = orient2d(A.geo[0], A.geo[1], B.geo[0], B.geo[1], P.geo[0], P.geo[1]);
    if (o * innerSide >= 0) continue; // 地理の面で内側（または線上）
    const u = ((P.geo[0] - A.geo[0]) * dg[0] + (P.geo[1] - A.geo[1]) * dg[1]) / (Lg * Lg);
    const t = ((P.paper[0] - A.paper[0]) * dp[0] + (P.paper[1] - A.paper[1]) * dp[1]) / (Lp * Lp);
    if (!(u > 0 && u < 1 && t > 0 && t < 1)) continue;
    outside.push({ id: P.id, u, t, d: Math.abs(o) / Lg });
  }
  // 地理の面で外へ出る点が弦の範囲に無いとき: 弦の中点に置き、高さは核で決める
  const anchored = outside.length > 0;
  if (!anchored) outside.push({ u: 0.5, t: 0.5, d: 0 });
  const top = outside.reduce((m, s) => (s.d > m.d ? s : m));
  let height = 0;
  for (const s of outside) {
    height = Math.max(height, s.u <= top.u ? (s.d * top.u) / s.u : (s.d * (1 - top.u)) / (1 - s.u));
  }
  height *= 1 + lambda;
  // 外向きの法線。robust-predicates の orient2d は標準の外積と符号が逆（左の法線 (-dy, dx) の側が負）
  const np = [(-dp[1] / Lp) * side, (dp[0] / Lp) * side];
  const ng = [(-dg[1] / Lg) * innerSide, (dg[0] / Lg) * innerSide];
  const paperAt = (t: number): Position => [
    A.paper[0] + t * dp[0] + epsilon * Lp * np[0],
    A.paper[1] + t * dp[1] + epsilon * Lp * np[1]
  ];
  const ray = (t: number, u: number, h: number, anchor: VertexId | undefined): SupplementRay => ({
    paper: paperAt(t),
    foot: [A.geo[0] + u * dg[0], A.geo[1] + u * dg[1]],
    normal: ng,
    height: h,
    chord: Lg,
    protrusion: top.d,
    ...(anchor === undefined ? {} : { anchor })
  });
  const single = [ray(top.t, top.u, height, anchored ? top.id : undefined)];

  // 複数点の案: (u, d) の上側の凸包を取り、その頂点ごとに 1 点。地理の面は一律に δ = λ·最大の深さ だけ外へ
  const sorted = [...outside].sort((a, b) => a.u - b.u);
  const chain: { u: number; d: number; t?: number; id?: VertexId }[] = [{ u: 0, d: 0 }];
  const cross = (o: { u: number; d: number }, a: { u: number; d: number }, b: { u: number; d: number }) =>
    (a.u - o.u) * (b.d - o.d) - (a.d - o.d) * (b.u - o.u);
  for (const s of [...sorted, { u: 1, d: 0 }]) {
    while (chain.length >= 2 && cross(chain[chain.length - 2], chain[chain.length - 1], s) >= 0) chain.pop();
    chain.push(s);
  }
  const delta = lambda * top.d;
  const multi: SupplementRay[] = [];
  let lastT = 0;
  for (const s of chain.slice(1, -1)) {
    if (s.t === undefined || !(s.t > lastT)) continue; // 紙の面で並びが逆になる点は使わない
    lastT = s.t;
    multi.push(ray(s.t, s.u, s.d + delta, anchored ? s.id : undefined));
  }
  return {
    edge: [A.id, B.id],
    variants: anchored && multi.length > 1 ? [single, multi] : [single]
  };
}

/**
 * 補完点の地理の位置を、紙の面でその点を囲む輪（その点を頂点にする三角形の対辺）の核の中に決め直す
 * （設計書 §2.3）。半直線 `foot + s·normal` の上で、輪の辺ごとの半平面の共通部分 `[lo, hi]` を求め、
 * 下限から少し外の高さを選ぶ。位置が変わると輪が変わるので、変わらなくなるまで（最大
 * `maxIterations` 回、既定は `MAX_KERNEL_FIT_ITERATIONS`）繰り返す。`maxIterations: 1` なら、1 回測って
 * 高さを決めるだけ（確かめの測り直しをしない。決めた高さで組んで通れば、それで足りる）。
 *
 * 核が空の点は、その点だけを外して、残りで続ける（1 点のために全部を捨てて、辺ごとの組み直しに回さない）。
 * 外した点があれば輪が変わるので、続きがあれば測り直す。残りが無ければ undefined。
 *
 * @param rays 決め直す点（紙の面は固定）
 * @param firstNode 先頭の点の `edgeNodes` の位置（`"e{n}"` の n）
 * @param measure 採用済みの補完点に、この点を足して、凸包の辺を全部制約にした三角網を組み、読んだ結果を返す
 * @returns 決まった点と、それが `rays` の何番目か
 */
export function fitToKernel(
  rays: readonly SupplementRay[],
  firstNode: number,
  measure: (pairs: Position[][]) => MeshAnalysis | undefined,
  { lambda = SUPPLEMENT_LAMBDA, mu = SUPPLEMENT_MU, maxIterations = MAX_KERNEL_FIT_ITERATIONS } = {}
): { rays: SupplementRay[]; kept: number[] } | undefined {
  let current = rays.map((ray, index) => ({ ray: { ...ray }, index }));
  for (let iteration = 0; iteration < maxIterations && current.length > 0; iteration++) {
    const analysis = measure(current.map(({ ray }) => [ray.paper, rayGeo(ray)]));
    if (!analysis) return undefined;
    let changed = false;
    const empty = new Set<number>();
    for (const [k, { ray }] of current.entries()) {
      const id = `e${firstNode + k}`;
      let lo = -Infinity;
      let hi = Infinity;
      let flipped = 0;
      for (const triangle of analysis.triangles) {
        const at = triangle.ids.indexOf(id);
        if (at < 0) continue;
        if (triangle.sign !== analysis.majority) flipped++;
        const N1 = triangle.geo[(at + 1) % 3];
        const N2 = triangle.geo[(at + 2) % 3];
        const paper = Math.sign(
          orient2d(
            triangle.paper[at][0], triangle.paper[at][1],
            triangle.paper[(at + 1) % 3][0], triangle.paper[(at + 1) % 3][1],
            triangle.paper[(at + 2) % 3][0], triangle.paper[(at + 2) % 3][1]
          )
        );
        // f(s) = orient(foot + s·normal, N1, N2) = f0 + s·f1 が、paper × majority と同じ符号であること
        const f0 = orient2d(ray.foot[0], ray.foot[1], N1[0], N1[1], N2[0], N2[1]);
        const f1 =
          orient2d(ray.foot[0] + ray.normal[0], ray.foot[1] + ray.normal[1], N1[0], N1[1], N2[0], N2[1]) - f0;
        const want = paper * analysis.majority;
        if (f1 === 0) {
          if (f0 * want <= 0) lo = Infinity;
          continue;
        }
        const crossing = -f0 / f1;
        if (f1 * want > 0) lo = Math.max(lo, crossing);
        else hi = Math.min(hi, crossing);
      }
      if (!(lo < hi)) {
        empty.add(k);
        continue;
      }
      const margin = Math.min(Math.max(lambda * Math.max(lo, ray.protrusion), mu * ray.chord), (hi - lo) / 2);
      const next = Math.max(lo, 0) + margin;
      const moved = Math.abs(next - ray.height) > 1e-9 * ray.chord;
      if (flipped > 0 || moved) {
        if (moved) changed = true;
        ray.height = next;
      }
    }
    if (empty.size > 0) {
      // 核が空の点を外す。残りの点の輪が変わるので、もう一度測る
      current = current.filter((_, k) => !empty.has(k));
      changed = true;
    }
    if (!changed) break;
  }
  if (current.length === 0) return undefined;
  return { rays: current.map(({ ray }) => ray), kept: current.map(({ index }) => index) };
}

/**
 * 足した補完点（`firstNode` 以降の "e{n}"）のうち、効いていないものの `edgeNodes` の位置。
 * 効いている = 紙の面の凸包の頂点で、その点に付く凸包の辺が全部、三角網の辺になっている。
 */
export function ineffectiveSupplements(analysis: MeshAnalysis, firstNode: number): Set<number> {
  const nodeOf = (id: VertexId) =>
    typeof id === "string" && id.startsWith("e") && Number(id.slice(1)) >= firstNode ? Number(id.slice(1)) : undefined;
  const meshEdges = new Set<string>();
  for (const { ids } of analysis.triangles) {
    meshEdges.add(meshKey(ids[0], ids[1]));
    meshEdges.add(meshKey(ids[0], ids[2]));
    meshEdges.add(meshKey(ids[1], ids[2]));
  }
  const bad = new Set<number>();
  const onHull = new Set<number>();
  for (const [i, j] of analysis.hullEdges) {
    const present = meshEdges.has(meshKey(analysis.points[i].id, analysis.points[j].id));
    for (const k of [i, j]) {
      const node = nodeOf(analysis.points[k].id);
      if (node === undefined) continue;
      onHull.add(node);
      if (!present) bad.add(node);
    }
  }
  for (const point of analysis.points) {
    const node = nodeOf(point.id);
    if (node !== undefined && !onHull.has(node)) bad.add(node);
  }
  return bad;
}

/** 足した補完点が全部効いているか（`ineffectiveSupplements` が空）。 */
export function supplementsTakeEffect(analysis: MeshAnalysis, firstNode: number): boolean {
  return ineffectiveSupplements(analysis, firstNode).size === 0;
}

/** 呼び出し側（Tin）が持つ、三角網の組み立てと状態の保存。 */
export interface SupplementHost<T, H> {
  /** `edgeNodes` の、補完点を除いた数（最初の補完点の `node`） */
  edgeBase: number;
  /** 最初の三角網（補完点を足す前）の組み立ての手間（三角網を組んだ試行の数）。手間の上限の基準 */
  baseCost: number;
  /** `build` に使った手間の合計（三角網を組んだ試行の数）。呼ぶたびに増える */
  buildCost(): number;
  /** 今の三角網の状態と補完点の並びを控える */
  snapshot(): H;
  /** 控えた状態に戻す */
  restore(handle: H): void;
  /**
   * 補完点 `pairs`（`[紙, 地理][]`、採用済みを含む全部）で、凸包の辺を全部制約にした最初の三角網を組んで読む。
   * 外周が見つからなければ undefined。
   */
  measure(pairs: Position[][]): MeshAnalysis | undefined;
  /**
   * 補完点 `pairs`（採用済みを含む全部）で三角網を組み直し（凸包の辺を外して strict を探す）、strict に
   * なったときだけ、結果と読んだ三角網を返す。strict にならなければ undefined。
   * 三角網を組む試行が `maxAttempts` 回を超えたら、そこで諦めて undefined を返す（手間の上限）。
   */
  build(pairs: Position[][], maxAttempts: number): { result: T; analysis: MeshAnalysis } | undefined;
}

export interface SupplementOutcome<T> {
  /** 採用した補完点（`[紙, 地理]`） */
  pairs: Position[][];
  records: SupplementPairRecord[];
  /** 採用した試行の結果（補完点が無ければ、渡された最初の結果） */
  result: T;
  diagnostics: SupplementDiagnostics;
}

/**
 * 外れた凸包の辺に補完点を足して、strict の三角網を組み直す（設計書 §2.4）。
 *
 * 1. 外れた辺ごとの候補（各 1 点）を全部足して試す。strict になり、足した点が全部効いていれば採用。
 * 2. だめなら辺ごとに、1 点の案・複数点の案の順に試し、条件を満たした案を採る。
 * 3. 採用後も外れた辺が残れば、同じ手順を繰り返す。
 *
 * 終わることの保証: 回は最大 `MAX_SUPPLEMENT_PAIR_ROUNDS`、1 本の辺（両端の紙の座標）は一度しか試さず、
 * 補完点の合計は最大 `MAX_SUPPLEMENT_PAIRS`。採用は strict で足した点が全部効くときだけなので、strict を
 * 失うことは無い。何も採用しなかったときは、渡された状態へ戻す。
 *
 * @param initial 補完点を足す前の結果（strict）と、その三角網の読み取り（`dropped` が空でないこと）
 */
export function addSupplementPairs<T, H>(
  host: SupplementHost<T, H>,
  initial: { result: T; analysis: MeshAnalysis }
): SupplementOutcome<T> {
  const diagnostics: SupplementDiagnostics = { rounds: 0, builds: 0, cost: 0, budget: 0, batches: 0, perEdge: 0, multiPoint: 0 };
  let adopted: Position[][] = [];
  let records: SupplementPairRecord[] = [];
  let current = initial;
  let handle = host.snapshot();
  const tried = new Set<string>();
  const budget = SUPPLEMENT_BUDGET_FACTOR * host.baseCost;
  diagnostics.budget = budget;
  const startCost = host.buildCost();
  /** 手間の上限に達した（辺ごとの試行が膨らむ入力で、ここで諦める） */
  let measures = 0;
  const spent = () => measures * SUPPLEMENT_MEASURE_COST + host.buildCost() - startCost;
  const exhausted = () => spent() >= budget;

  const measure = (pairs: Position[][]) => {
    if (exhausted()) return undefined;
    diagnostics.builds++;
    measures++;
    return host.measure(pairs);
  };
  const toPair = (ray: SupplementRay): Position[] => [ray.paper, rayGeo(ray)];

  type Owned = { ray: SupplementRay; edge: [VertexId, VertexId] };
  /** `items` の点の地理の位置を核の中に決める（核が空の点は外す）。残りが無ければ undefined。 */
  const fit = (items: Owned[], first: number, maxIterations: number): Owned[] | undefined => {
    const fitted = fitToKernel(
      items.map(({ ray }) => ray),
      first,
      (extra) => measure([...adopted, ...extra]),
      { maxIterations }
    );
    return fitted?.rays.map((ray, k) => ({ ray, edge: items[fitted.kept[k]].edge }));
  };
  const sameFit = (a: Owned[], b: Owned[]) =>
    a.length === b.length &&
    a.every(({ ray }, k) => Math.abs(ray.height - b[k].ray.height) <= 1e-9 * ray.chord);

  /**
   * `owned` の点を、採用済みに足して組み直す。採用したら true。
   *
   * 1 回測って高さを決め、すぐ組む（確かめの測り直しはしない）。組んだ結果が
   * - strict で、一部の点だけ効いていないなら、その点を外してもう一度まとめて組む。
   * - strict にならない（または全部効かない）なら、一度だけ測り直して高さを決め直し、変わったときだけ組み直す。
   */
  const tryAdd = (owned: Owned[]): boolean => {
    if (owned.length === 0 || adopted.length + owned.length > MAX_SUPPLEMENT_PAIRS) return false;
    const first = host.edgeBase + adopted.length;
    let items = fit(owned, first, 1);
    let refitted = false;
    while (items && items.length > 0 && !exhausted()) {
      const all = [...adopted, ...items.map(({ ray }) => toPair(ray))];
      diagnostics.builds++;
      const built = host.build(all, Math.max(1, Math.ceil(budget - spent())));
      const bad = built ? ineffectiveSupplements(built.analysis, first) : undefined;
      if (built && bad!.size === 0) {
        records = records.concat(
          items.map(({ ray, edge }, k) => ({
            node: first + k,
            kind: "hullEdge" as const,
            edge,
            ...(ray.anchor === undefined ? {} : { anchor: ray.anchor })
          }))
        );
        adopted = all;
        current = built;
        handle = host.snapshot();
        return true;
      }
      host.restore(handle);
      if (built && bad!.size < items.length) {
        // strict で、一部の点だけ効いていない: その点を外して、もう一度まとめて組む
        items = items.filter((_, k) => !bad!.has(first + k));
        continue;
      }
      if (refitted) return false;
      // strict にならない（全部効かない）: 一度だけ、測り直して高さを決め直す。変わらないなら組み直さない
      refitted = true;
      const again = fit(items, first, MAX_KERNEL_FIT_ITERATIONS);
      if (!again || sameFit(again, items)) return false;
      items = again;
    }
    return false;
  };

  for (let round = 1; round <= MAX_SUPPLEMENT_PAIR_ROUNDS && !exhausted(); round++) {
    const { analysis } = current;
    const candidates: SupplementCandidate[] = [];
    for (const edge of analysis.dropped) {
      // 同じ辺（両端の紙の座標で見分ける）は、一度しか試さない
      const key = edge.map((k) => analysis.points[k].paper.join(",")).join("|");
      if (tried.has(key)) continue;
      tried.add(key);
      if (adopted.length + candidates.length + 1 > MAX_SUPPLEMENT_PAIRS) continue;
      const candidate = proposeSupplementCandidate(analysis, edge);
      if (candidate) candidates.push(candidate);
    }
    if (candidates.length === 0) break;
    diagnostics.rounds = round;

    // 1. まとめて試す（外れた辺ごとに 1 点。核が空の点は外す）
    const own = (candidate: SupplementCandidate, variant: SupplementRay[]) =>
      variant.map((ray) => ({ ray, edge: candidate.edge }));
    if (tryAdd(candidates.flatMap((candidate) => own(candidate, candidate.variants[0])))) {
      diagnostics.batches++;
      continue;
    }

    // 2. だめなら辺ごとに、1 点の案・複数点の案の順に試す（三角網を組む回数の上限まで）
    for (const candidate of candidates) {
      for (const [v, variant] of candidate.variants.entries()) {
        if (exhausted()) break;
        if (!tryAdd(own(candidate, variant))) continue;
        diagnostics.perEdge++;
        if (v > 0) diagnostics.multiPoint++;
        break;
      }
    }
  }

  host.restore(handle);
  diagnostics.cost = spent();
  return { pairs: adopted, records, result: current.result, diagnostics };
}
