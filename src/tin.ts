/**
 * Tin (Triangulated Irregular Network) クラス
 * 2つの平面座標系間の同相変換を実現します。
 */

import {
  booleanPointInPolygon,
  centroid as turfCentroid,
  convex,
  featureCollection,
  point,
  polygon,
} from "@turf/turf";
import type { Feature, Point, Position } from "geojson";
import { orient2d } from "robust-predicates";
import {
  counterTri,
  normalizeEdges,
  rotateVerticesTriangle,
  Transform,
  transformArr,
  validateWorldFile,
  worldFileToCrs,
} from "@maplat/transform";

// Tin が書き出す compiled の版。2.00704 / 3.00001 で重みバッファを廃止（空 {} を書く）。
// @maplat/transform の publish 時期に依存させないため Tin が自前で持つ
export const FORMAT_VERSION_V2 = 2.00704;
export const FORMAT_VERSION_V3 = 3.00001;
import type {
  CompiledLegacy,
  CompiledTransformData,
  CompiledWorldFileOuter,
  Edge,
  EdgeSet,
  EdgeSetLegacy,
  PointSet,
  PropertyTriKey,
  StrictMode,
  StrictStatus,
  Tins,
  TinsBD,
  Tri,
  VertexMode,
  WorldFile,
  YaxisMode,
} from "@maplat/transform";
import constrainedTin from "./constrained-tin.ts";
import {
  countBoundaryFlips,
  isStarShaped,
  MARGINS,
  searchBoundary,
  type BoundaryCandidate,
  type SearchCache,
  type BoundaryDiagnostics,
} from "./boundary-search.ts";
import {
  calculateBirdeyeVertices,
  calculatePlainVertices,
  calculateWorldFileVertices,
  ringBinOf,
  type BoundaryVerticesParams,
  type RingOptions,
} from "./boundary-vertices.ts";
import { findRingCulprits } from "./ring-culprits.ts";
import { findIntersectionsUpTo, MAX_KINKS_PER_DIRECTION } from "./kinks.ts";
import { insertSearchIndex } from "./searchutils.ts";
import { counterPoint, createPoint, vertexCalc } from "./vertexutils.ts";
import { resolveOverlaps } from "./strict-overlap.ts";
import { findHullCulprits } from "./hull-culprits.ts";
import { convexHullEdges, hullEdgeKey } from "./hull-edges.ts";
import {
  buildMeshFromTins,
  cloneBuildMesh,
  countBadBandTriangles,
  replaceBand,
  tinsFromMesh,
  type BuildMesh,
} from "./incremental/rebuild.ts";
import {
  addSupplementPairs,
  analyzeMesh,
  type SupplementDiagnostics,
  type SupplementHost,
  type SupplementPair,
  type SupplementPairRecord,
} from "./supplement-pairs.ts";
import type { SearchIndex } from "./searchutils.ts";
import type { PointsSetBD, VertexPosition } from "./types/tin.ts";
import { interpolateEdgeNodes, type EdgeNodeItem } from "./edge-nodes.ts";
import { meshFromCompiled, type ImportFailure, type MeshModel } from "./incremental/model.ts";
import { applyToInputs, applyToMesh, type TinInputs } from "./incremental/apply.ts";
import type { EdgeId, PointId } from "./incremental/mesh.ts";
import type { TinEdit, TinPatch, TinPatchFallback } from "./incremental/types.ts";

type RawPointsSet = { forw: Feature<Point>[]; bakw: Feature<Point>[]; edges: Edge[] };
/** 補完点の一覧を持つ compiled（Transform の型には無い項目。読み手は無視してよい）。 */
export type CompiledWithSupplement = CompiledTransformData & {
  supplementPairs?: SupplementPairRecord[];
  /**
   * 無ければ、全部組み直し（清書）の産物。`"incremental"` は、局所更新の網をそのまま保存した特例
   * （同じ対応点から全部を組み直すと、同じ三角網にならない。MaplatTin#100・設計書 §9.5）。
   * 読み手（MaplatTransform・MaplatCore）は無視してよい。
   */
  meshOrigin?: "incremental";
};

/** `Tin#restoreMesh` が網を戻せなかった理由。 */
export type RestoreFailure =
  | ImportFailure
  /** 局所更新のスイッチ（`Options#incremental`）が切れている */
  | "disabled"
  /** 渡された対応点・必須エッジが、compiled と合わない */
  | "inputMismatch"
  /** compiled の中継点・補完点が、対応点と必須エッジから作り直したものと合わない */
  | "edgeNodes"
  /** ok でない三角形がある（S1） */
  | "notStrict"
  /** 網の外周が、両面で単純な 1 本の輪でない（S2） */
  | "boundary"
  /** 必須エッジが、網の辺に無い（S3） */
  | "requiredEdge"
  /** 補助頂点 3 点だけの三角形がある */
  | "forbidden"
  /** 補助頂点の扇形の角度が、補助頂点と重心から計算し直した値と合わない */
  | "verticesParams";

/** 局所更新の網を保存してよいかの証拠（設計書 §9.5 の条件 (a)(b) と、診断 (d)）。 */
export interface IncrementalEvidence {
  /** 条件を全部満たす（`compiled` を、特例として保存してよい） */
  eligible: boolean;
  /** 満たさなかった条件（`eligible` が true なら空） */
  failed: (
    | "noMesh"
    | "boundaryStale"
    | "badTriangles"
    | "meshShape"
    | "boundary"
    | "requiredEdge"
    | "boundaryOnlyTriangles"
    | "gcpRoundTrip"
    | "sweepKinks"
  )[];
  /** (a) 帯（補助頂点・重心）が最新か */
  boundaryFresh: boolean;
  /** (a) S1: ok でない三角形の数（網の全部を数え直した値。0 が条件） */
  badTriangles: number;
  /** (a) S1: 紙の面で折り返している内側の辺の数（0 が条件） */
  forwFolds: number;
  /** (a) 網の形: 3 つ以上の三角形に属する辺の数（0 が条件）と、索引が三角形の表と一致するか */
  nonManifoldEdges: number;
  indexMatches: boolean;
  /** (a) S2: 網の外周が、両面で単純な 1 本の輪か */
  boundarySimple: boolean;
  /** (a) S3: 網の辺に無い必須エッジの区間の数（0 が条件） */
  missingRequiredEdges: number;
  /** (a) S4: 補助頂点 3 点だけの三角形の数（0 が条件） */
  boundaryOnlyTriangles: number;
  /** (a)(d) 同じ必須エッジの点だけの三角形の数（残っていても保存はする） */
  remainingForbiddenTriangles: number;
  /** (b) 書き出した compiled を Transform で読み直したときの、対応点の往復の誤差の最大（紙 → 地理・地理 → 紙） */
  gcpRoundTrip: { forward: number; backward: number };
  /** (b)(d) 書き出した網へ、今の交差の数え上げを 1 件まで走らせた結果（両面の合計。0 が条件） */
  sweepKinks: number;
  /** (d) 最後の全部組み直し・復元から重ねた、局所更新の回数 */
  editsSinceRebuild: number;
  /** (d) 同じ入力を全部組み直したときの状態と交差の件数（呼び出し側が渡した値） */
  rebuildStatus?: StrictStatus;
  rebuildKinks?: number;
  /** 特例として保存する compiled（`meshOrigin: "incremental"` つき）。`eligible` のときだけ */
  compiled?: CompiledWithSupplement;
}
type CompiledOuter = Pick<CompiledWorldFileOuter, "outerTransform" | "worldFile" | "vertices_points"> |
  { outerTransform: "extrapolate" };

/** `incrementalRebuild` を入れた `updateTin()` の、試行の内訳。 */
export interface RebuildDiagnostics {
  /** 今の手順（全部を組む）で組んだ試行の数 */
  fullAttempts: number;
  /** 帯の差し替えで済ませた試行の数 */
  localAttempts: number;
  /** 帯の差し替えが成り立たず、今の手順で組み直した試行の数（fullAttempts に含む） */
  localFailures: number;
  /** 帯の差し替えの試行に使った時間（ミリ秒） */
  localMs: number;
  /** 採用した三角網が、帯の差し替えの結果か */
  adoptedLocal: boolean;
  /** 採用した局所の結果が、今の交差の数え上げと食い違ったので、今の手順だけで組み直した */
  fellBack: boolean;
}

/** 三角網を組んだ結果の状態。 */
interface BuildState {
  tins: Tin["tins"];
  pointsSet: Tin["pointsSet"];
  strict_status: Tin["strict_status"];
  kinks: Tin["kinks"];
}

/** strict を壊した凸包の辺を外して組み直す回数の上限。 */
const MAX_HULL_REFINEMENTS = 12;
/** strict にならないとき、strict を壊す補助頂点を外して組み直す回数の上限（MaplatTin#98）。 */
const MAX_RING_ROUNDS = 4;
/** 補助頂点を外すとき、壊す補助頂点の両隣の区分もまとめて外す数（回数を減らす）。 */
const RING_SPREAD = 1;
/** 補助頂点の手当ての探索（第 1 段の各回と第 2 段）に使ってよい手間（三角網を組んだ試行の数）の上限。最初の組み立ての試行数の何倍か。 */
const RING_RESCUE_BUDGET = 4;
/** strict になった後に、外した区分を戻す試行を含めた手間の上限（最初の組み立ての試行数の何倍か）。 */
const RING_RESTORE_BUDGET = 8;
/** 外す区分がこの数以上（輪の 2/3）になったら、第 1 段の残りの回を飛ばして四隅だけにする。 */
const RING_GIVE_UP_BINS = 24;

/** 区分の番号（0〜35、輪になっている）の集合を、連続するかたまりに分ける。 */
function clustersOf(bins: ReadonlySet<number>): number[][] {
  if (bins.size === 0) return [];
  if (bins.size >= 36) return [[...bins].sort((a, b) => a - b)];
  // かたまりの先頭（前の区分が無い区分）から順に伸ばす
  const clusters: number[][] = [];
  for (let bin = 0; bin < 36; bin++) {
    if (!bins.has(bin) || bins.has((bin + 35) % 36)) continue;
    const cluster = [bin];
    for (let next = (bin + 1) % 36; bins.has(next); next = (next + 1) % 36) cluster.push(next);
    clusters.push(cluster);
  }
  return clusters;
}

/** 補完点の組み直しが手間の上限を超えたことを知らせる（`buildWithSupplements` の中だけで投げて捕まえる）。 */
const OUT_OF_BUDGET = Symbol("supplement pairs out of budget");

/** 局所の試行で、周りの組み直しで直す、ok でない三角形の数の上限。 */
const MAX_HEAL_TRIANGLES = 32;

/** 特例の保存の条件: 書き出した compiled での、対応点の往復の誤差の上限（地理面はメートル、紙の面は画素）。 */
const GCP_ROUND_TRIP_LIMIT = 1e-6;

/** 外した凸包の辺を戻して試す回数の上限。 */
const MAX_HULL_RESTORE_TRIALS = 24;


/**
 * Tinクラスの初期化オプション
 */
export interface Options {
  bounds?: Position[];
  wh?: number[];
  vertexMode?: VertexMode;
  strictMode?: StrictMode;
  yaxisMode?: YaxisMode;
  importance?: number;
  priority?: number;
  stateFull?: boolean;
  points?: PointSet[];
  edges?: EdgeSet[];
  /** true にすると v2 アルゴリズム（wh bbox・turf 重心・4 境界頂点）で build する */
  useV2Algorithm?: boolean;
  /** V3 の四辺形の外側で使う変換。省略時は従来の扇形外挿。 */
  outerTransform?: "extrapolate" | "worldFile";
  /** 四辺形の外側に使う world file。`outerTransform: "worldFile"` のとき必須。 */
  worldFile?: WorldFile;
  /**
   * V3 だけ。strict のために制約から外した凸包の辺に、システムが補完点（supplementPairs）を足す。
   * 既定は true。false にすると足さない（#91 と同じ結果）。
   */
  supplementPairs?: boolean;
  /**
   * 局所更新（MaplatTin#100）のスイッチ。既定は false で、何も変わらない。true にすると、`updateTin()` の
   * 後に、採用した三角網を局所更新の網（`Tin#incrementalMesh`）へ取り込む。`updateTin()` の結果
   * （`getCompiled()`）は、どちらでも同じ。
   */
  incremental?: boolean;
  /**
   * `updateTin()` の中の組み直しの繰り返し（strict を壊す凸包の辺を外す・補完点を足す・strict を壊す補助頂点を
   * 外す）を、網への局所の操作に置き換える（MaplatTin#100 の第 1 段 b）。既定は false で、何も変わらない。
   * true にすると、最初の 1 回だけ今の手順で組み、2 回目からの試行は、帯（補助頂点を含む三角形）だけを
   * 差し替える。strict になる結果だけを採るので、strict の判定は悪くならないが、三角形の集合は、切った
   * ときと同じとは限らない。world file 外周・loose 指定・V2 では、切ったときと同じ。
   */
  incrementalRebuild?: boolean;
  /**
   * `applyEdits` で、帯（補助頂点・重心）に触れる編集も、帯の差し替えで局所に当てる（MaplatTin#100 の
   * 第 1 段 b の帯の差し替え）。既定は false で、帯に触れる編集は全部組み直しへ落ちる。
   */
  incrementalBand?: boolean;
}

/**
 * Tin (Triangulated Irregular Network) クラス
 * Transformクラスを拡張し、TINネットワークの生成機能を追加
 */
export class Tin extends Transform {
  importance: number;
  priority: number;
  pointsSet: PointsSetBD | undefined;
  useV2Algorithm: boolean;
  /** V3 で補完点を足すか（`Options#supplementPairs`）。 */
  useSupplementPairs: boolean;
  private supplementRecords: SupplementPairRecord[] = [];
  private lastSupplementDiagnostics?: SupplementDiagnostics;
  private lastBoundaryDiagnostics?: BoundaryDiagnostics;
  /** `updateTin()` の中で三角網を組んだ試行の数（補助頂点の手当ての手間の上限に使う）。 */
  private attemptTotal = 0;
  private requestedWorldFile?: WorldFile;
  private compiledOuter?: CompiledOuter;
  /** 局所更新のスイッチ（`Options#incremental`）。 */
  incremental: boolean;
  /** 組み直しの繰り返しを局所の操作に置き換えるスイッチ（`Options#incrementalRebuild`）。 */
  incrementalRebuild: boolean;
  /** 帯に触れる編集を局所に当てるスイッチ（`Options#incrementalBand`）。 */
  incrementalBand: boolean;
  /** 局所の試行で作った三角網（採用したら、地理面の三角網を足して、交差の数え上げで確かめる）。 */
  private localTins = new WeakSet<object>();
  /** 局所の試行の結果が、今の交差の数え上げと食い違ったので、今の手順だけで組み直している。 */
  private localRebuildDisabled = false;
  private lastRebuildDiagnostics?: RebuildDiagnostics;

  /** 直近の `updateTin()` の、試行の内訳（`incrementalRebuild` を入れたときだけ）。 */
  get rebuildDiagnostics(): RebuildDiagnostics | undefined {
    return this.tins ? this.lastRebuildDiagnostics : undefined;
  }
  private mesh?: MeshModel;
  private meshFailure?: ImportFailure;

  /** 対応点・必須エッジの id（`points`・`edges` の並び）。undefined は、配列の添字が id。 */
  private pointIds?: PointId[];
  private edgeIds?: EdgeId[];
  /** `applyEdits` で進む版の番号。`setPoints` などで入力を入れ直すと 0 に戻る。 */
  private editRevision = 0;
  /** 網が、`tins`・`points`・`edges` より先に進んでいる（局所更新を当てた後、まだ書き戻していない）。 */
  private meshAhead = false;
  /** 補助頂点・重心が最新でない（局所更新を当てた後、清書か帯の差し替えをするまで）。 */
  private bandStale = false;
  /** 今の三角網が、局所更新の網をそのまま保存した特例（`meshOrigin: "incremental"`）から来ているか。 */
  private originIncremental = false;
  /** 最後の全部組み直し・復元から重ねた、局所更新の回数。 */
  private localEdits = 0;

  /**
   * 今の三角網の出どころ。`"incremental"` は、局所更新の網をそのまま保存した特例（読み込んだ compiled に
   * 印があった）。全部組み直す（`updateTin()`）と、印は外れる。
   */
  get meshOrigin(): "incremental" | undefined {
    return this.originIncremental ? "incremental" : undefined;
  }

  /**
   * 局所更新の網（今の三角網を取り込んだもの）。スイッチが切れている・三角網が無い・取り込めない網
   * （loose・V2 など。理由は `incrementalFailure`）のときは undefined。
   */
  get incrementalMesh(): MeshModel | undefined {
    return this.mesh;
  }

  /** 局所更新の網へ取り込めなかった理由（取り込めた・スイッチが切れているときは undefined）。 */
  get incrementalFailure(): ImportFailure | undefined {
    return this.meshFailure;
  }

  /** `applyEdits` の版の番号。次の `applyEdits` に、前提として渡す。 */
  get revision(): number {
    return this.editRevision;
  }

  /** 網と、網から決まる状態を捨てる（入力や設定を入れ直したとき）。 */
  private dropMesh(): void {
    this.mesh = undefined;
    this.meshFailure = undefined;
    this.meshAhead = false;
    this.bandStale = false;
    this.editRevision = 0;
    this.localEdits = 0;
  }

  /**
   * 局所更新を当てた網を、`points`・`edges`・`tins` などへ書き戻す（`transform()`・`getCompiled()` の前に
   * 自動で呼ばれる。全体を作り直すので、編集のたびには呼ばないこと。表示は `TinPatch` で足りる）。
   */
  private syncFromMesh(): void {
    if (!this.meshAhead || !this.mesh) return;
    const model = this.mesh;
    const compiled = model.toCompiled();
    const inputs = model.inputs();
    const { xy, wh } = this;
    // Transform の読み込み経路で、三角網・索引・重心・補助頂点の扇形を作り直す
    super.setCompiled(compiled);
    Object.assign(this, { xy, wh });
    delete this.kinks;
    this.pointsSet = undefined;
    this.pointIds = inputs.pointIds;
    this.edgeIds = inputs.edgeIds;
    this.supplementRecords = (compiled.supplementPairs ?? []).map((record) => ({
      ...record,
      edge: [...record.edge] as SupplementPairRecord["edge"],
    }));
    this.pointsWeightBuffer = {};
    this.meshAhead = false;
  }

  /** 今の入力（対応点・必須エッジ。内部の座標系）と、その id の並び。 */
  private currentInputs(): TinInputs {
    if (this.meshAhead && this.mesh) return this.mesh.inputs();
    return {
      points: this.points,
      edges: this.edges ?? [],
      pointIds: this.pointIds ?? this.points.map((_, i) => i),
      edgeIds: this.edgeIds ?? (this.edges ?? []).map((_, i) => i),
    };
  }

  /**
   * 編集を当てる（MaplatTin#100 の第 2 段 a）。局所で済めば、網の差分を返す（`mode: "local"`）。済まなければ、
   * 編集を入力に当てて全部組み直し、その結果を返す（`mode: "full"`。理由は `fallbackReason`）。
   *
   * - `edits` は、全部が当たるか、全部組み直しか、のどちらか（一部だけ当たった網を返さない）。
   * - `baseRevision` が今の版（`revision`）と合わなければ、何も変えずに `"revisionMismatch"` を返す。
   *   呼び出し側は、最新の入力を `setPoints`・`setEdges` で入れ直して、`updateTin()` すること。
   * - 当てられない編集（id が無い・既に使われている・座標が有限でない）は、何も変えずに例外を投げる。
   * - 全部組み直しが例外を投げる入力（必須エッジが交差する・点が一直線、など）では、`updateTin()` と同じ
   *   例外を投げる。入力は編集の後の状態になり、三角網は無い。
   * - 局所で済むのは、スイッチ（`Options#incremental`）が入っていて、strict・strict_error の V3 の網で、
   *   帯（補助頂点・重心）を更新しなくてよい内側の編集だけ。
   * - 座標は、`setPoints` に渡すのと同じ、外の座標系（差分の座標は、compiled と同じ内部の座標系）。
   */
  applyEdits(edits: TinEdit[], baseRevision?: number): TinPatch {
    if (baseRevision !== undefined && baseRevision !== this.editRevision) {
      return {
        revision: this.editRevision,
        mode: "full",
        fallbackReason: "revisionMismatch",
        strict_status: this.strict_status!,
        boundaryStale: this.bandStale,
      };
    }
    const follow = this.yaxisMode === Tin.YAXIS_FOLLOW;
    // 編集を入力に当てる（当てられない編集は、ここで例外になり、何も変わらない）
    const next = applyToInputs(this.currentInputs(), edits, follow);

    let reason: TinPatchFallback = "noMesh";
    if (this.mesh) {
      // サブマップで、点が範囲の多角形の外へ出る・外に足される編集は、全部組み直しへ落とす（同じ例外を返す）
      const bp = this.bounds ? this.boundsPolygon : undefined;
      if (bp && !next.points.every((p) => booleanPointInPolygon(p[0] as Position, bp))) {
        reason = "unsupported";
      } else {
        const applied = applyToMesh(
          this.mesh,
          edits,
          follow,
          this.incrementalBand ? { vertexMode: this.vertexMode } : undefined,
        );
        if (applied.ok) {
          // 帯を差し替えたら最新。差し替えていなければ、前のまま（最新でない）
          // world file 外周の網の補助頂点は、world file から直接決まり、内側の点に依らないので、古くならない
          this.afterLocalEdit(
            applied.patch.strict_status,
            applied.refreshed || this.mesh.isWorldFile ? false : true,
          );
          return { revision: this.editRevision, mode: "local", boundaryStale: this.bandStale, ...applied.patch };
        }
        reason = applied.reason;
      }
    }
    // 全部組み直し。網は途中まで変わっていることがあるので、捨てる
    const revision = this.editRevision + 1;
    this.mesh = undefined;
    this.meshAhead = false;
    this.points = next.points;
    this.edges = next.edges;
    this.edgeNodes = undefined;
    this.pointIds = next.pointIds;
    this.edgeIds = next.edgeIds;
    this.tins = undefined;
    this.indexedTins = undefined;
    this.editRevision = revision;
    this.updateTin();
    return {
      revision,
      mode: "full",
      fallbackReason: reason,
      strict_status: this.strict_status!,
      boundaryStale: false,
    };
  }

  /** 紙の面と地理面の間で座標を変換する。局所更新を当てた後は、網から三角網を作り直してから変換する。 */
  override transform(apoint: number[], backward?: boolean, ignoreBounds?: boolean): number[] | false {
    this.syncFromMesh();
    return super.transform(apoint, backward, ignoreBounds);
  }

  /** 現在の三角網を V3 で生成したときの外周の診断。 */
  get boundaryDiagnostics(): BoundaryDiagnostics | undefined {
    return this.tins && !this.useV2Algorithm ? this.lastBoundaryDiagnostics : undefined;
  }

  /**
   * システムが足した補完点の一覧（今の三角網のもの）。座標は内部の座標（`edgeNodes` と同じ）。
   * 人間の対応点（`points`）には入らない。`updateTin()` のたびに、対応点だけから作り直される。
   */
  get supplementPairs(): SupplementPair[] {
    if (!this.tins) return [];
    const nodes = (this.edgeNodes ?? []) as Position[][];
    return this.supplementRecords.flatMap((record) => {
      const node = nodes[record.node];
      return node ? [{ ...record, forw: node[0], bakw: node[1] }] : [];
    });
  }

  /** 直近の `updateTin()` の補完の手順の診断（足す手順に入らなかったときは undefined）。 */
  get supplementDiagnostics(): SupplementDiagnostics | undefined {
    return this.tins && !this.useV2Algorithm ? this.lastSupplementDiagnostics : undefined;
  }

  /**
   * Tinクラスのインスタンスを生成します
   * @param options - 初期化オプション
   */
  constructor(options: Options = {}) {
    super();

    if (options.bounds) {
      this.setBounds(options.bounds);
    } else {
      this.setWh(options.wh);
      this.vertexMode = options.vertexMode || Tin.VERTEX_PLAIN;
    }

    this.strictMode = options.strictMode || Tin.MODE_AUTO;
    this.yaxisMode = options.yaxisMode || Tin.YAXIS_INVERT;
    this.importance = options.importance || 0;
    this.priority = options.priority || 0;
    this.stateFull = options.stateFull || false;
    this.useV2Algorithm = options.useV2Algorithm ?? false;
    this.useSupplementPairs = options.supplementPairs ?? true;
    this.incremental = options.incremental ?? false;
    this.incrementalRebuild = options.incrementalRebuild ?? false;
    this.incrementalBand = options.incrementalBand ?? false;
    if (options.outerTransform === "worldFile") {
      if (this.useV2Algorithm) throw new Error("V2 では world file 外周を使えません");
      if (!options.worldFile) throw new Error("worldFile が必要です");
      validateWorldFile(options.worldFile);
      this.requestedWorldFile = { ...options.worldFile };
    }

    if (options.points) {
      this.setPoints(options.points);
    }
    if (options.edges) {
      this.setEdges(options.edges);
    }
  }

  /**
   * フォーマットバージョンを取得します
   */
  getFormatVersion(): number {
    return this.useV2Algorithm ? FORMAT_VERSION_V2 : FORMAT_VERSION_V3;
  }

  /**
   * 制御点（GCP: Ground Control Points）を設定します。
   * 指定した点群に合わせて内部のTINキャッシュをリセットします。
   */
  setPoints(points: PointSet[]): void {
    this.syncFromMesh();
    if (this.yaxisMode === Tin.YAXIS_FOLLOW) {
      points = points.map((point) => [
        point[0],
        [point[1][0], -1 * point[1][1]],
      ]);
    }
    this.points = points;
    this.pointIds = undefined;
    // 対応点を入れ直したら、局所更新の網をそのまま保存した特例ではない
    this.originIncremental = false;
    this.dropMesh();
    this.tins = undefined;
    this.indexedTins = undefined;
  }

  /**
   * エッジ（制約線）を設定します。
   * 制約線を正規化した上で、依存するキャッシュをリセットします。
   */
  setEdges(edges: EdgeSet[] | EdgeSetLegacy[] = []): void {
    this.syncFromMesh();
    this.edges = normalizeEdges(edges);
    this.edgeIds = undefined;
    this.dropMesh();
    this.edgeNodes = undefined;
    this.tins = undefined;
    this.indexedTins = undefined;
  }

  /**
   * 境界ポリゴンを設定します
   */
  setBounds(bounds: Position[]): void {
    this.retireMesh();
    this.bounds = bounds;

    let minx = bounds[0][0];
    let maxx = minx;
    let miny = bounds[0][1];
    let maxy = miny;
    const coords = [bounds[0]];

    for (let i = 1; i < bounds.length; i++) {
      const bound = bounds[i];
      if (bound[0] < minx) minx = bound[0];
      if (bound[0] > maxx) maxx = bound[0];
      if (bound[1] < miny) miny = bound[1];
      if (bound[1] > maxy) maxy = bound[1];
      coords.push(bound);
    }
    coords.push(bounds[0]);

    this.boundsPolygon = polygon([coords]);
    this.xy = [minx, miny];
    this.wh = [maxx - minx, maxy - miny];
    this.vertexMode = Tin.VERTEX_PLAIN;
    this.tins = undefined;
    this.indexedTins = undefined;
  }

  /** 設定を変える前に、局所更新を当てた網を入力へ書き戻して、網を捨てる（id の並びと版は保つ）。 */
  private retireMesh(): void {
    this.syncFromMesh();
    this.mesh = undefined;
    this.meshFailure = undefined;
    this.bandStale = false;
  }

  /**
   * 現在の設定を永続化可能な形式にコンパイルします
   */
  getCompiled(): CompiledWithSupplement {
    // 局所更新を当てた後は、網から書き出す（番号の振り直しは、ここで 1 回だけ）
    if (this.meshAhead && this.mesh) {
      const fromMesh = this.mesh.toCompiled();
      if (this.originIncremental) fromMesh.meshOrigin = "incremental";
      return fromMesh;
    }
    const compiled = {} as CompiledWithSupplement;
    compiled.version = this.useV2Algorithm ? FORMAT_VERSION_V2 : FORMAT_VERSION_V3;
    compiled.points = this.points;
    // 重みバッファは廃止（2.00704）。以前の @maplat/transform は compiled に
    // 重みキーが無いと transform() で TypeError になるため、空オブジェクトを必ず書く
    compiled.weight_buffer = {};
    if (this.compiledOuter?.outerTransform === "worldFile") {
      Object.assign(compiled, this.compiledOuter);
    } else {
      compiled.centroid_point = [
        this.centroid!.forw!.geometry!.coordinates,
        this.centroid!.forw!.properties!.target.geom,
      ];
      compiled.vertices_params = [
        this.vertices_params!.forw![0],
        this.vertices_params!.bakw![0],
      ];
      compiled.vertices_points = [];

      const vertices = this.vertices_params!.forw![1];
      if (vertices) {
        for (let i = 0; i < vertices.length; i++) {
          const vertex = vertices[i].features[0];
          const forw = vertex.geometry!.coordinates[0][1];
          const bakw = vertex.properties!.b.geom;
          compiled.vertices_points[i] = [forw, bakw];
        }
      }
    }

    compiled.strict_status = this.strict_status;
    compiled.tins_points = [[]];

    this.tins!.forw!.features.map((tin: Tri) => {
      compiled.tins_points[0].push(
        (["a", "b", "c"] as PropertyTriKey[]).map((key) =>
          tin.properties![key].index
        ),
      );
    });

    if (this.strict_status === Tin.STATUS_LOOSE) {
      compiled.tins_points[1] = [];
      this.tins!.bakw!.features.map((tin: Tri) => {
        compiled.tins_points[1].push(
          (["a", "b", "c"] as PropertyTriKey[]).map((key) =>
            tin.properties![key].index
          ),
        );
      });
    } else if (this.strict_status === Tin.STATUS_ERROR && this.kinks?.bakw) {
      compiled.kinks_points = this.kinks.bakw.features.map(
        (kink) => kink.geometry!.coordinates,
      );
    }

    compiled.yaxisMode = this.yaxisMode;
    compiled.vertexMode = this.vertexMode;
    compiled.strictMode = this.strictMode;

    if (this.bounds) {
      compiled.bounds = this.bounds;
      compiled.boundsPolygon = this.boundsPolygon;
      if (this.useV2Algorithm) {
        // V2 submap: xy/wh define the bbox used for triangulation — must be preserved.
        compiled.xy = this.xy;
        compiled.wh = this.wh;
      }
      // V3 submap: bounds polygon is the envelope; xy/wh are not used for
      // triangulation and are therefore not serialized.
    } else {
      // Main map: wh stores image dimensions for display and V2 bbox calculation.
      compiled.wh = this.wh;
    }

    compiled.edges = this.edges ?? [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    compiled.edgeNodes = (this.edgeNodes ?? []) as any;
    // 補完点は edgeNodes の末尾にあり、ここはその理由の一覧。無ければ項目ごと書かない
    if (this.supplementRecords.length > 0) {
      compiled.supplementPairs = this.supplementRecords.map((record) => ({
        ...record,
        edge: [...record.edge] as SupplementPairRecord["edge"],
      }));
    }

    if (this.compiledOuter?.outerTransform === "extrapolate") {
      Object.assign(compiled, this.compiledOuter);
    }
    // 局所更新の網をそのまま保存した特例の印は、全部組み直すまで引き継ぐ
    if (this.originIncremental) compiled.meshOrigin = "incremental";
    return compiled;
  }

  /** コンパイルされた設定を基底クラスで復元し、外周方式を次の生成にも引き継ぐ。 */
  override setCompiled(compiled: CompiledTransformData | CompiledLegacy): void {
    const outer = "outerTransform" in compiled ? compiled : undefined;
    if (outer?.outerTransform === "worldFile" && this.useV2Algorithm) {
      throw new Error("V2 では world file 外周を使えません");
    }
    const replacesWorldFile = this.outerTransform === "worldFile" || outer?.outerTransform === "worldFile";
    this.dropMesh();
    this.pointIds = undefined;
    this.edgeIds = undefined;
    super.setCompiled(compiled);
    this.supplementRecords = ((compiled as CompiledWithSupplement).supplementPairs ?? []).map((record) => ({
      ...record,
      edge: [...record.edge] as SupplementPairRecord["edge"],
    }));
    this.lastSupplementDiagnostics = undefined;
    if (replacesWorldFile) this.stateTriangle = undefined;
    this.requestedWorldFile = undefined;
    this.compiledOuter = undefined;
    if (outer?.outerTransform === "worldFile") {
      this.requestedWorldFile = { ...outer.worldFile };
      this.compiledOuter = {
        outerTransform: "worldFile",
        worldFile: outer.worldFile,
        vertices_points: outer.vertices_points,
      };
    } else if (outer?.outerTransform === "extrapolate") {
      this.compiledOuter = { outerTransform: "extrapolate" };
    }
    this.lastBoundaryDiagnostics = undefined;
    this.originIncremental = (compiled as CompiledWithSupplement).meshOrigin === "incremental";
  }

  /**
   * 保存した compiled から、三角網と局所更新の網を戻す（MaplatTin#100。設計書 §9.5 (c)）。三角形分割はしない。
   *
   * 局所更新の網をそのまま保存した特例（`meshOrigin: "incremental"`）の地図は、`updateTin()` で開くと、
   * 清書と同じ strict_error に戻る。この口で開けば、保存した strict な網から、局所更新を続けられる。
   * 印の無い（全部組み直しの）compiled も、同じように戻せる（`updateTin()` を待たずに編集を始められる）。
   *
   * 戻すのは、対応点・必須エッジ・中継点と補完点（中継点がどの必須エッジの何番目か）・三角形・補助頂点・
   * 重心・補助頂点の扇形。凸包の辺の印は、内側の点の紙の面の凸包の辺のうち、網の辺にあるものに付け直す。
   * 戻した網で、S1（全部の三角形が ok）・S2（外周が両面で単純）・S3（必須エッジが全部ある）と、
   * 補助頂点 3 点だけの三角形が無いことを、全部を数えて確かめる。
   *
   * 失敗したとき（理由を返す）は、`setCompiled(compiled)` をした状態（変換はできる）で、網は持たない。
   * 呼び出し側は、対応点と必須エッジを入れ直して `updateTin()` すること。
   *
   * @param compiled 保存した compiled（座標は内部の座標系。follow では地理面の Y が反転済み）
   * @param inputs 呼び出し側が持つ対応点・必須エッジ（`setPoints`・`setEdges` に渡すのと同じ、外の座標系）。
   *   渡すと、compiled と合うかを確かめる（follow の反転は、ここで掛ける。呼び出し側で compiled と直接比べないこと）
   */
  restoreMesh(
    compiled: CompiledWithSupplement,
    inputs?: { points?: PointSet[]; edges?: EdgeSet[] | EdgeSetLegacy[] },
  ): { ok: true } | { ok: false; reason: RestoreFailure } {
    const fail = (reason: RestoreFailure) => {
      // 断った compiled の印と strict の判定を、引き継がない（スイッチが切れているときは、setCompiled と同じ）
      if (reason !== "disabled") {
        this.originIncremental = false;
        this.strict_status = undefined;
      }
      return { ok: false as const, reason };
    };
    // この Tin で読めない組み合わせ（V2 の Tin に world file 外周）は、読む前に断る
    if (this.useV2Algorithm && (compiled as { outerTransform?: string }).outerTransform === "worldFile") {
      return fail("v2");
    }
    try {
      this.setCompiled(compiled);
    } catch {
      // 三角形が無い頂点を指しているなど、Transform が読めない compiled
      this.tins = undefined;
      this.indexedTins = undefined;
      return fail("inconsistent");
    }
    if (!this.incremental) return fail("disabled");
    const follow = this.yaxisMode === Tin.YAXIS_FOLLOW;
    if (inputs?.points) {
      const same = inputs.points.length === this.points.length && inputs.points.every(([forw, bakw], i) => {
        const [f, b] = this.points[i];
        return forw[0] === f[0] && forw[1] === f[1] && bakw[0] === b[0] && (follow ? -1 * bakw[1] : bakw[1]) === b[1];
      });
      if (!same) return fail("inputMismatch");
    }
    if (inputs?.edges && JSON.stringify(normalizeEdges(inputs.edges)) !== JSON.stringify(this.edges ?? [])) {
      return fail("inputMismatch");
    }
    // 中継点がどの必須エッジの何番目かは、対応点と必須エッジから、全部組み直しと同じ計算で引き直す。
    // 作り直した中継点が compiled と 1 ビットでも違えば、compiled が外で書き換えられている
    const saved = (this.edgeNodes ?? []) as PointSet[];
    let segments: Edge[];
    try {
      segments = this.generatePointsSet().edges;
    } catch {
      this.edgeNodes = saved;
      return fail("inconsistent");
    }
    const generated = (this.edgeNodes ?? []) as PointSet[];
    this.edgeNodes = saved;
    const sameNodes = generated.length + this.supplementRecords.length === saved.length &&
      generated.every((node, i) => node.every((position, k) => position[0] === saved[i][k][0] && position[1] === saved[i][k][1]));
    if (!sameNodes) return fail("edgeNodes");
    const imported = meshFromCompiled(compiled, segments);
    if (!("model" in imported)) return fail(imported.reason);
    const { model } = imported;
    const audit = model.mesh.audit();
    // 網の形: 辺が 3 つ以上の三角形に属さない（三角形が重なっていない）・全部の頂点が三角形を持つ
    if (audit.nonManifoldEdges > 0 || audit.orphanVertices > 0 || !audit.indexMatches) return fail("inconsistent");
    // S1: 両面の向きの積と、紙の面の折り返し（両面で一緒に裏返った三角形は、積では見えない）
    if (audit.bad.length > 0 || audit.forwFolds > 0) return fail("notStrict");
    if (!audit.boundarySimple) return fail("boundary");
    if (audit.missingRequired > 0) return fail("requiredEdge");
    if (audit.forbiddenBoundary > 0) return fail("forbidden");
    // 網の補助頂点・重心と、compiled の扇形の角度が、同じ帯から来ていること
    const params = model.verticesParams();
    const savedParams = (compiled as { vertices_params?: number[][] }).vertices_params;
    if (params && JSON.stringify(params) !== JSON.stringify(savedParams)) return fail("verticesParams");
    this.mesh = model;
    this.meshFailure = undefined;
    return { ok: true };
  }

  /**
   * 帯（補助頂点・重心）を、今の内側の点から作り直す（保存の直前に、帯を最新にするために呼ぶ。設計書 §9.5 (a)）。
   * スイッチ `incrementalBand` が要る。成り立てば差分を返し、成り立たなければ（スイッチが切れている・網が無い・
   * どの余白でも strict な帯にならない）何も変えずに undefined を返す。
   */
  refreshBand(): TinPatch | undefined {
    if (!this.mesh || !this.incrementalBand) return undefined;
    const applied = applyToMesh(this.mesh, [], this.yaxisMode === Tin.YAXIS_FOLLOW, { vertexMode: this.vertexMode }, true);
    if (!applied.ok) return undefined;
    this.afterLocalEdit(applied.patch.strict_status, false);
    return { revision: this.editRevision, mode: "local", boundaryStale: false, ...applied.patch };
  }

  /** 局所更新を当てた後の、Tin の状態の更新。 */
  private afterLocalEdit(status: StrictStatus, stale: boolean): void {
    this.meshAhead = true;
    this.bandStale = stale;
    this.tins = undefined;
    this.indexedTins = undefined;
    this.pointsSet = undefined;
    delete this.kinks;
    this.strict_status = status;
    this.editRevision++;
    this.localEdits++;
  }

  /**
   * 局所更新の網を、そのまま保存してよいかの証拠を集める（設計書 §9.5 の条件 (a)(b) と診断 (d)）。
   * 清書（別のインスタンスでの全部組み直し）が strict にならず、この網が strict のときに使う。
   *
   * 網の全部を数え直し（差分管理の値を信用しない）、書き出した compiled を Transform で読み直して対応点の往復を
   * 確かめ、今の交差の数え上げを両面で 1 件まで走らせる。全体を回るので、保存のときだけ呼ぶこと。網は変えない。
   * 帯が最新でないと条件を満たさないので、先に `refreshBand()` を呼ぶ。
   *
   * @param rebuild 同じ入力を全部組み直したときの状態と交差の件数（診断に写すだけ）
   */
  collectIncrementalEvidence(rebuild?: { status: StrictStatus; kinks: number }): IncrementalEvidence {
    const evidence: IncrementalEvidence = {
      eligible: false,
      failed: [],
      boundaryFresh: !this.bandStale,
      badTriangles: 0,
      forwFolds: 0,
      nonManifoldEdges: 0,
      indexMatches: false,
      boundarySimple: false,
      missingRequiredEdges: 0,
      boundaryOnlyTriangles: 0,
      remainingForbiddenTriangles: 0,
      gcpRoundTrip: { forward: Infinity, backward: Infinity },
      sweepKinks: 0,
      editsSinceRebuild: this.localEdits,
      ...(rebuild ? { rebuildStatus: rebuild.status, rebuildKinks: rebuild.kinks } : {}),
    };
    const model = this.mesh;
    if (!model) {
      evidence.failed.push("noMesh");
      return evidence;
    }
    const { mesh } = model;
    const audit = mesh.audit();
    evidence.badTriangles = audit.bad.length;
    evidence.forwFolds = audit.forwFolds;
    evidence.nonManifoldEdges = audit.nonManifoldEdges;
    evidence.indexMatches = audit.indexMatches && audit.badMatches && audit.orphanVertices === 0;
    evidence.boundarySimple = audit.boundarySimple;
    evidence.missingRequiredEdges = audit.missingRequired;
    evidence.boundaryOnlyTriangles = audit.forbiddenBoundary;
    evidence.remainingForbiddenTriangles = audit.forbiddenEdge;
    const compiled: CompiledWithSupplement = { ...model.toCompiled(), strict_status: "strict", meshOrigin: "incremental" };
    // (b) 書き出した compiled を読み直して、全部の対応点が往復する
    const reader = new Transform();
    try {
      reader.setCompiled(JSON.parse(JSON.stringify(compiled)));
      let forward = 0;
      let backward = 0;
      // compiled の座標は内部の座標系、transform() の入出力は外の座標系（follow では地理面の Y が逆）
      const follow = compiled.yaxisMode === Tin.YAXIS_FOLLOW;
      for (const [forw, internal] of compiled.points) {
        const bakw = follow ? [internal[0], -1 * internal[1]] : internal;
        const geo = reader.transform(forw, false);
        const paper = reader.transform(bakw, true);
        forward = Math.max(forward, geo ? Math.hypot(geo[0] - bakw[0], geo[1] - bakw[1]) : Infinity);
        backward = Math.max(backward, paper ? Math.hypot(paper[0] - forw[0], paper[1] - forw[1]) : Infinity);
      }
      evidence.gcpRoundTrip = { forward, backward };
    } catch {
      // 読めなければ、往復の誤差は Infinity のまま
    }
    // (b) 今の交差の数え上げ（素の float64）と、局所の判定（厳密な述語）の突き合わせ
    for (const plane of ["forw", "bakw"] as const) {
      const rings = [...mesh.triangles.values()].map((triangle) => {
        const p = triangle.map((vertex) => mesh.vertices.get(vertex)![plane]);
        return [...p, p[0]];
      });
      evidence.sweepKinks += findIntersectionsUpTo(rings, 1).length;
    }
    if (!evidence.boundaryFresh) evidence.failed.push("boundaryStale");
    if (evidence.badTriangles > 0 || evidence.forwFolds > 0) evidence.failed.push("badTriangles");
    if (evidence.nonManifoldEdges > 0 || !evidence.indexMatches) evidence.failed.push("meshShape");
    if (!evidence.boundarySimple) evidence.failed.push("boundary");
    if (evidence.missingRequiredEdges > 0) evidence.failed.push("requiredEdge");
    if (evidence.boundaryOnlyTriangles > 0) evidence.failed.push("boundaryOnlyTriangles");
    if (!(evidence.gcpRoundTrip.forward <= GCP_ROUND_TRIP_LIMIT && evidence.gcpRoundTrip.backward <= GCP_ROUND_TRIP_LIMIT)) {
      evidence.failed.push("gcpRoundTrip");
    }
    if (evidence.sweepKinks > 0) evidence.failed.push("sweepKinks");
    evidence.eligible = evidence.failed.length === 0;
    if (evidence.eligible) evidence.compiled = compiled;
    return evidence;
  }

  /**
   * 幅と高さを設定します
   */
  setWh(wh?: number[]): void {
    this.retireMesh();
    this.wh = wh || [100, 100]; // デフォルト値を設定
    this.xy = [0, 0];
    this.bounds = undefined;
    this.boundsPolygon = undefined;
    this.tins = undefined;
    this.indexedTins = undefined;
  }

  /**
   * 頂点モードを設定します
   */
  setVertexMode(mode: VertexMode): void {
    this.retireMesh();
    this.vertexMode = mode;
    this.tins = undefined;
    this.indexedTins = undefined;
  }

  /**
   * 厳密性モードを設定します
   */
  setStrictMode(mode: StrictMode): void {
    this.retireMesh();
    this.strictMode = mode;
    this.tins = undefined;
    this.indexedTins = undefined;
  }

  /**
   * 厳密なTINを計算します
   *
   * @param kinkLimit - forw / bakw それぞれで残す交差（kinks）の件数の上限
   *   （同じ位置の交差を 1 件に数えた件数）。届いた時点で数え上げをやめます
   */
  calculateStrictTin(kinkLimit: number = MAX_KINKS_PER_DIRECTION): void {
    this.resolveStrictOverlaps();
    this.detectStrictKinks(kinkLimit);
  }

  /**
   * 順三角網から逆三角網を写し、重なりを辺の反転で解消する（`calculateStrictTin` の前半）。
   * 交差の判定（`strict_status`・`kinks`）はしない。補完点の置き場所を測る試行は、三角網の向きを読むだけなので
   * これだけを呼ぶ。
   */
  private resolveStrictOverlaps(): void {
    const bakTins = this.tins!.forw!.features.map((tri: Tri) =>
      counterTri(tri)
    );
    this.tins!.bakw = featureCollection(bakTins);

    const searchIndex: SearchIndex = {};
    this.tins!.forw!.features.forEach((forTri: Tri, index: number) => {
      const bakTri = this.tins!.bakw!.features[index];
      insertSearchIndex(searchIndex, { forw: forTri, bakw: bakTri });
    });

    // pointsSet.edges の要素は pointsSet 内の「配列位置」だが、searchIndex の
    // キーは頂点 index（properties.target.index）で作られている。
    // エッジ中間ノードは配列位置と index（"e58" 等）が一致しないため、
    // 対応表を渡して resolveOverlaps 側でキーを揃えさせる。
    const pointIndices = (this.pointsSet?.forw.features ?? []).map(
      (point: Feature<Point>) => point.properties!.target.index as number | string,
    );

    // 凸包の辺は反転禁止にしない。重なりを直すのに必要な辺だけが反転され、それでも直らないときは
    // buildWithHull が原因の凸包の辺を外して組み直す。
    resolveOverlaps(
      this.tins!,
      searchIndex,
      this.pointsSet?.edges || [],
      pointIndices,
    );
  }

  /** `calculateStrictTin` の後半: 両面の交差を数え、`strict_status` と `kinks` を決める。 */
  private detectStrictKinks(kinkLimit: number): void {
    const kinks = ["forw", "bakw"].map((direction) => {
      const tins = this.tins![direction as keyof TinsBD]!.features.map(
        (tin: Tri) => tin.geometry!.coordinates[0],
      );
      return findIntersectionsUpTo(tins, kinkLimit);
    });

    if (kinks[0].length === 0 && kinks[1].length === 0) {
      this.strict_status = Tin.STATUS_STRICT;
      delete this.kinks;
    } else {
      this.strict_status = Tin.STATUS_ERROR;
      this.kinks = {
        forw: featureCollection(kinks[0]),
        bakw: featureCollection(kinks[1]),
      };
    }
  }

  /**
   * 点群セットを生成します。
  * GCP と中間エッジノードを GeoJSON Point に変換し、後続の三角分割に備えます。
   */
  generatePointsSet(): {
    forw: Feature<Point>[];
    bakw: Feature<Point>[];
    edges: Edge[];
  } {
    const pointsSet: { forw: Feature<Point>[]; bakw: Feature<Point>[] } = {
      forw: [],
      bakw: [],
    };

    // Generate points
    for (let i = 0; i < this.points.length; i++) {
      const forw = this.points[i][0];
      const bakw = this.points[i][1];
      const forPoint = createPoint(forw, bakw, i);
      pointsSet.forw.push(forPoint);
      pointsSet.bakw.push(counterPoint(forPoint));
    }

    // Generate edge nodes
    const edges: Edge[] = [];
    let edgeNodeIndex = 0;
    this.edgeNodes = [];

    if (!this.edges) this.edges = [];

    for (let i = 0; i < this.edges.length; i++) {
      const edge = this.edges[i][2];
      const illstNodes = Object.assign([], this.edges[i][0]);
      const mercNodes = Object.assign([], this.edges[i][1]);

      // 端点は GCP の添字で指す。範囲に無い・整数でない添字は、
      // 以降の計算に渡さずここで止める。
      assertEdgeIndices(edge, this.points.length, i);

      if (illstNodes.length === 0 && mercNodes.length === 0) {
        edges.push(edge);
        continue;
      }

      // Add start and end points
      illstNodes.unshift(this.points[edge[0]][0]);
      illstNodes.push(this.points[edge[1]][0]);
      mercNodes.unshift(this.points[edge[0]][1]);
      mercNodes.push(this.points[edge[1]][1]);

      // 両面の折れ線を累積長の比で突き合わせて、中継点を作る
      interpolateEdgeNodes(illstNodes, mercNodes)
        .forEach((item: EdgeNodeItem, index: number, arr: EdgeNodeItem[]) => {
          this.edgeNodes![edgeNodeIndex] = [
            item[0],
            item[1],
          ];
          const forPoint = createPoint(
            item[0],
            item[1],
            `e${edgeNodeIndex}`,
          );
          edgeNodeIndex++;
          pointsSet.forw!.push(forPoint);
          pointsSet.bakw!.push(counterPoint(forPoint));

          if (index === 0) {
            edges.push([edge[0], pointsSet.forw!.length - 1]);
          } else {
            edges.push([
              pointsSet.forw!.length - 2,
              pointsSet.forw!.length - 1,
            ]);
          }

          if (index === arr.length - 1) {
            edges.push([pointsSet.forw!.length - 1, edge[1]]);
          }
        });
    }

    return {
      forw: pointsSet.forw,
      bakw: pointsSet.bakw,
      edges,
    };
  }

  /**
   * 入力データの検証と初期データの準備
   */
  private validateAndPrepareInputs() {
    const minx = this.xy![0] - 0.05 * this.wh![0];
    const maxx = this.xy![0] + 1.05 * this.wh![0];
    const miny = this.xy![1] - 0.05 * this.wh![1];
    const maxy = this.xy![1] + 1.05 * this.wh![1];

    // Invariant: boundsPolygon is always set when bounds is set (see setBounds / setCompiled).
    if (this.bounds && !this.boundsPolygon) throw new Error("Internal error: bounds is set but boundsPolygon is missing");
    const bp = this.bounds ? this.boundsPolygon : undefined;
    const allPointsInside = this.points.reduce((prev: boolean, point: PointSet) => {
      return prev &&
        (bp
          ? booleanPointInPolygon(point[0] as Position, bp)
          : point[0][0] >= minx && point[0][0] <= maxx &&
          point[0][1] >= miny && point[0][1] <= maxy);
    }, true);

    if (!allPointsInside) {
      throw "SOME POINTS OUTSIDE";
    }

    let bbox: Position[] = [];
    if (this.wh) {
      bbox = [[minx, miny], [maxx, miny], [minx, maxy], [maxx, maxy]];
    }

    return {
      pointsSet: this.generatePointsSet(),
      bbox,
      minx,
      maxx,
      miny,
      maxy,
    };
  }

  /** 余白を加える前の GCP の外接矩形を求める。 */
  private computeGcpBbox(): {
    minx: number; maxx: number; miny: number; maxy: number;
  } {
    let gcpMinx = Infinity, gcpMaxx = -Infinity;
    let gcpMiny = Infinity, gcpMaxy = -Infinity;
    for (const p of this.points) {
      const x = p[0][0] as number, y = p[0][1] as number;
      if (x < gcpMinx) gcpMinx = x;
      if (x > gcpMaxx) gcpMaxx = x;
      if (y < gcpMiny) gcpMiny = y;
      if (y > gcpMaxy) gcpMaxy = y;
    }
    return { minx: gcpMinx, maxx: gcpMaxx, miny: gcpMiny, maxy: gcpMaxy };
  }

  /**
   * TINネットワークを同期的に更新し、座標変換の準備を行います。
   * 重めの計算を伴うため、呼び出し側が非同期制御を行いたい場合は
   * {@link updateTinAsync} を利用してください。
   */
  updateTin(): void {
    // 局所更新を当てた網があれば、その入力（対応点・必須エッジ）から組み直す（清書）
    if (this.meshAhead && this.mesh) {
      const inputs = this.mesh.inputs();
      this.points = inputs.points;
      this.edges = inputs.edges;
      this.pointIds = inputs.pointIds;
      this.edgeIds = inputs.edgeIds;
      this.edgeNodes = undefined;
    }
    this.mesh = undefined;
    this.meshFailure = undefined;
    this.meshAhead = false;
    this.bandStale = false;
    this.rebuildAll();
    // 局所更新のスイッチが入っているときだけ、採用した三角網を取り込む（三角網そのものは変えない）
    if (this.incremental) {
      const imported = meshFromCompiled(this.getCompiled(), this.pointsSet!.edges as Edge[], {
        points: this.pointIds,
        edges: this.edgeIds,
      });
      if ("model" in imported) this.mesh = imported.model;
      else this.meshFailure = imported.reason;
    }
  }

  /** 三角網を最初から全部組む（`updateTin()` の本体）。 */
  private rebuildAll(): void {
    // 全部を組み直した三角網は、局所更新の網をそのまま保存した特例ではない
    this.originIncremental = false;
    this.localEdits = 0;
    this.lastBoundaryDiagnostics = undefined;
    // 補完点は保存しない入力。前回の結果は読まず、人間の対応点だけから毎回作り直す
    this.supplementRecords = [];
    this.attemptTotal = 0;
    this.lastSupplementDiagnostics = undefined;
    let strict = this.strictMode;
    if (strict !== Tin.MODE_STRICT && strict !== Tin.MODE_LOOSE) {
      strict = Tin.MODE_AUTO;
    }

    const isV3 = !this.useV2Algorithm;
    const worldFile = this.requestedWorldFile;
    if (worldFile && !isV3) throw new Error("V2 では world file 外周を使えません");
    let rawPointsSet: RawPointsSet;
    let minx: number, maxx: number, miny: number, maxy: number;

    if (isV3) {
      // V3 (main map and submap): always derive bbox from GCPs.
      // When a bounds polygon (envelope) is provided, validate GCPs are inside it first.
      if (this.bounds) {
        // Invariant: boundsPolygon is always set when bounds is set (see setBounds / setCompiled).
        const bp = this.boundsPolygon;
        if (!bp) throw new Error("Internal error: bounds is set but boundsPolygon is missing");
        const allInsideBounds = this.points.every(
          (p: PointSet) => booleanPointInPolygon(p[0] as Position, bp),
        );
        if (!allInsideBounds) throw "SOME POINTS OUTSIDE";
      }
      rawPointsSet = this.generatePointsSet();
      ({ minx, maxx, miny, maxy } = this.computeGcpBbox());
    } else {
      // V2: use xy/wh bbox with full validation.
      const validated = this.validateAndPrepareInputs();
      rawPointsSet = validated.pointsSet;
      minx = validated.minx;
      maxx = validated.maxx;
      miny = validated.miny;
      maxy = validated.maxy;
    }

    // Create FeatureCollections for use in calculations
    // 後で補完点を rawPointsSet の末尾に足す。重心・扇形外挿の推定は人間の対応点（と必須エッジの中継点）
    // だけで行うので、ここで配列を複製して、足した点が入らないようにする
    const pointsSetFC = {
      forw: featureCollection([...rawPointsSet.forw]),
      bakw: featureCollection([...rawPointsSet.bakw]),
    };

    const tinForw = constrainedTin(
      pointsSetFC.forw,
      rawPointsSet.edges,
      "target",
    );
    const tinBakw = constrainedTin(
      pointsSetFC.bakw,
      rawPointsSet.edges,
      "target",
    );

    if (tinForw.features.length === 0 || tinBakw.features.length === 0) {
      throw "TOO LINEAR1";
    }

    const forCentroid = turfCentroid(pointsSetFC.forw);
    const forwConvex = convex(pointsSetFC.forw);
    if (!forwConvex) throw "TOO LINEAR2";

    const convexBuf: Record<string, { forw: Position; bakw: Position }> = {};
    const forwCoords = forwConvex.geometry!.coordinates[0];

    // Calculate forward convex hull transformation
    let convexCalc;
    try {
      convexCalc = forwCoords.map((coord: Position) => ({
        forw: coord,
        bakw: transformArr(point(coord), tinForw as Tins) as Position,
      }));
      convexCalc.forEach((item: { forw: Position; bakw: Position }) => {
        convexBuf[`${item.forw[0]}:${item.forw[1]}`] = item;
      });
    } catch {
      throw "TOO LINEAR2";
    }

    // Calculate backward convex hull transformation
    const bakwConvex = convex(pointsSetFC.bakw);
    if (!bakwConvex) throw "TOO LINEAR2";

    const bakwCoords = bakwConvex.geometry!.coordinates[0];
    try {
      convexCalc = bakwCoords.map((coord: Position) => ({
        bakw: coord,
        forw: transformArr(point(coord), tinBakw as Tins) as Position,
      }));
      convexCalc.forEach((item: { forw: Position; bakw: Position }) => {
        convexBuf[`${item.forw[0]}:${item.forw[1]}`] = item;
      });
    } catch {
      throw "TOO LINEAR2";
    }

    // Set centroids
    // 扇形の中心は、紙側の GCP の重心そのものにする。地理側は三角網（tinForw）で変換して求める
    // （V2 と同じ。V2 の最初の実装から一貫している）。V3 は一時期、重心を含む三角形の 3 頂点の
    // 平均にしていたが、GCP が対称に並ぶと重心が GCP に一致して、その GCP を頂点とする最初の
    // 三角形が選ばれ、中心が片側へずれた（補助頂点の選び方も片側に詰まる）。
    const centCalc: { forw: Position; bakw: Position } = {
      forw: forCentroid.geometry!.coordinates,
      bakw: transformArr(forCentroid, tinForw as Tins) as Position,
    };

    const centroidPoint = createPoint(centCalc.forw, centCalc.bakw, "c");
    this.centroid = {
      forw: centroidPoint,
      bakw: counterPoint(centroidPoint),
    };

    // Calculate vertices
    // allGcps includes both GCPs and edge intermediate nodes so that
    // checkAndAdjustVerticesN can guarantee all constrained-edge bakw positions
    // are enclosed within the boundary polygon.
    const allGcps: BoundaryVerticesParams["allGcps"] = [
      ...this.points.map((p) => ({ forw: p[0] as Position, bakw: p[1] as Position })),
      ...(this.edgeNodes ?? []).map((n) => ({ forw: n[0] as Position, bakw: n[1] as Position })),
    ];
    const boundaryParams: BoundaryVerticesParams = {
      convexBuf,
      centroid: centCalc,
      allGcps,
      minx,
      maxx,
      miny,
      maxy,
    };

    // strict にならないときの補助頂点の手当て（MaplatTin#98）。strict または auto で、最初の組み立てで外周が
    // 成立したのに strict にならないときだけ、strict を壊す補助頂点（地理面で内側の三角形と重なる、向きが
    // 逆になる）だけを外して組み直し（第 1 段。外す区分は両隣もまとめる）、strict になったら、外した区分を
    // かたまりごとに 1 回ずつ戻して、strict を保てるかを試す。第 1 段で救えないときは、補助頂点を四隅だけにして
    // 組み直す（第 2 段。縮尺と回転の推定は V3 のまま）。どちらも strict になったときだけ採り、ならなければ
    // 最初の結果へ状態ごと戻す。外周が成立しなかった（boundary が無い）ときは、手当てをしない（world file
    // 外周が成立しなくて扇形へ落ちる入力を、四隅だけの world file 外周に変えない）。
    //
    // 手間の上限（三角網を組んだ試行の数）は、最初の組み立ての試行数 `firstCost` の倍数で置く。探索（第 1 段の
    // 各回と第 2 段）は `RING_RESCUE_BUDGET` 倍まで（第 2 段の 1 回分は取っておく）、外した区分を戻す試行は
    // `RING_RESTORE_BUDGET` 倍まで。外す区分が輪の大半になったら、残りの回を飛ばして第 2 段へ進む。
    const wantsStrict = strict === Tin.MODE_STRICT || strict === Tin.MODE_AUTO;
    const rescue = <T extends { boundary?: BoundaryCandidate }>(
      first: T,
      firstCost: number,
      build: (ring: RingOptions) => T,
    ): { result: T; kind?: "thinned" | "corners" } => {
      if (!wantsStrict || this.isStrict() || !first.boundary) return { result: first };
      // 状態（三角網・点群・補完点・必須エッジの中継点）の控え。採る試行へ戻す
      const snapshot = () => ({
        build: this.captureBuild(),
        raw: [rawPointsSet.forw.slice(), rawPointsSet.bakw.slice()],
        gcps: allGcps.slice(),
        edgeNodes: this.edgeNodes!.slice(),
        supplementRecords: this.supplementRecords,
        supplementDiagnostics: this.lastSupplementDiagnostics,
      });
      const apply = (state: ReturnType<typeof snapshot>) => {
        rawPointsSet.forw.splice(0, rawPointsSet.forw.length, ...state.raw[0]);
        rawPointsSet.bakw.splice(0, rawPointsSet.bakw.length, ...state.raw[1]);
        allGcps.splice(0, allGcps.length, ...state.gcps);
        this.edgeNodes!.splice(0, this.edgeNodes!.length, ...state.edgeNodes);
        this.restoreBuild(state.build);
        this.supplementRecords = state.supplementRecords;
        this.lastSupplementDiagnostics = state.supplementDiagnostics;
      };
      const kept = snapshot();
      const start = this.attemptTotal;
      const used = () => this.attemptTotal - start;
      const isCorner = (forw: Position, ring: Position[]) => {
        const xs = ring.map(([x]) => x);
        const ys = ring.map(([, y]) => y);
        return (forw[0] === Math.min(...xs) || forw[0] === Math.max(...xs)) &&
          (forw[1] === Math.min(...ys) || forw[1] === Math.max(...ys));
      };
      /** 三角網を組む。`this` は組んだ三角網の状態になる。 */
      const attempt = (ring: RingOptions) => {
        // 前の試行が足した補完点・中継点は、次の試行の入力に混ぜない（最初の状態の点群から組む）
        rawPointsSet.forw.splice(0, rawPointsSet.forw.length, ...kept.raw[0]);
        rawPointsSet.bakw.splice(0, rawPointsSet.bakw.length, ...kept.raw[1]);
        allGcps.splice(0, allGcps.length, ...kept.gcps);
        this.edgeNodes!.splice(0, this.edgeNodes!.length, ...kept.edgeNodes);
        this.supplementRecords = [];
        const built = build(ring);
        return { built, strict: built.boundary !== undefined && this.isStrict() };
      };
      const skip = new Set<number>();
      // 最初の輪で、外せる補助頂点（四隅以外）のある区分
      const ringVertices = first.boundary.vertices.map(({ forw }) => forw);
      const removable = new Set(
        ringVertices.filter((forw) => !isCorner(forw, ringVertices)).map((forw) => ringBinOf(forw, centCalc.forw)),
      );
      try {
        let current: T = first;
        for (let round = 0; round < MAX_RING_ROUNDS; round++) {
          if (used() + firstCost >= RING_RESCUE_BUDGET * firstCost) break;
          const ring = current.boundary!.vertices.map(({ forw }) => forw);
          const before = skip.size;
          for (const forw of findRingCulprits(this.tins!.forw!)) {
            if (isCorner(forw, ring)) continue;
            const bin = ringBinOf(forw, centCalc.forw);
            for (let d = -RING_SPREAD; d <= RING_SPREAD; d++) skip.add((bin + d + 36) % 36);
          }
          if (skip.size === before) break;
          // 外す区分が輪の大半になったら、四隅だけにする
          if (skip.size >= RING_GIVE_UP_BINS) break;
          const tried = attempt({ skipBins: new Set(skip) });
          // 外して外周が成立しなくなったら、打ち切る（四隅だけの外周も試さない）
          if (!tried.built.boundary) {
            apply(kept);
            return { result: first };
          }
          if (tried.strict) {
            let best = { result: tried.built, state: snapshot() };
            // 外した区分を、かたまりごとに 1 回ずつ戻して、strict を保てるかを試す
            for (const cluster of clustersOf(skip)) {
              if (!cluster.some((bin) => removable.has(bin))) continue;
              if (used() >= RING_RESTORE_BUDGET * firstCost) break;
              const rest = new Set([...skip].filter((bin) => !cluster.includes(bin)));
              const retried = attempt({ skipBins: rest });
              if (retried.strict) {
                for (const bin of cluster) skip.delete(bin);
                best = { result: retried.built, state: snapshot() };
              }
            }
            apply(best.state);
            return { result: best.result, kind: "thinned" };
          }
          // strict にならなかった組み立ての三角網で、次の回の原因を探す（`this` はその状態にある）
          current = tried.built;
        }
        if (used() < RING_RESCUE_BUDGET * firstCost) {
          const tried = attempt({ cornersOnly: true });
          if (tried.strict) return { result: tried.built, kind: "corners" };
        }
      } catch {
        // 手当ての組み直しが失敗しても、最初の結果は有効なので、それを返す
      }
      apply(kept);
      return { result: first };
    };

    if (worldFile) {
      this.stateTriangle = undefined;
      // follow では、GCP と同様に外部 CRS の Y を反転して三角網に入れる。
      // world file 自体は反転前の係数を保存する。
      const follow = this.yaxisMode === Tin.YAXIS_FOLLOW;
      const orientation = follow ? 1 : -1;
      const buildWorldFile = (ring?: RingOptions) =>
        this.buildWithSupplements(strict, rawPointsSet, allGcps, (cache, mode, measureOnly) =>
          (excludedHull) => ({ boundary: searchBoundary(
            ring ? { ...boundaryParams, ring } : boundaryParams,
            (params) => calculateWorldFileVertices(params, (xy) => {
              const [x, y] = worldFileToCrs(worldFile, xy);
              return [x, follow ? -y : y];
            }),
            rawPointsSet,
            this.points.length,
            {
              orientation,
              accept: (candidate) => {
                if (!candidate.hasMapBoundary) return false;
                this.buildTin(rawPointsSet, candidate.vertices, mode, candidate, excludedHull.size > 0, measureOnly);
                // auto の切り替えと strict の重なり解消を経て、採用した三角網で判定する。
                return (this.strict_status !== Tin.STATUS_LOOSE || candidate.hasBoundary) &&
                  countBoundaryFlips(this.tins!.forw!, orientation) === 0 &&
                  countBoundaryFlips(this.tins!.bakw!, orientation) === 0;
              },
            },
            excludedHull,
            cache,
          ) }));
      const worldStart = this.attemptTotal;
      const worldFirst = buildWorldFile();
      const worldCost = this.attemptTotal - worldStart;
      // world file 外周でも、strict にならないときは補助頂点を手当てする。外すのは world file の輪の一部で、
      // `vertices_points` には、採用した輪の補助頂点を全部書く
      const { result: { boundary }, kind: worldRescue } = rescue(worldFirst, worldCost, buildWorldFile);
      if (boundary) {
        this.compiledOuter = {
          outerTransform: "worldFile",
          worldFile,
          vertices_points: boundary.vertices.map(({ forw, bakw }) => [forw, bakw]),
        };
        // Transform と同じ読み込み経路で内外判定用の輪と三角網の索引を作る。
        // 生成時の重心、領域の寸法、両方向の交差は Tin の実行時の値として保つ。
        const { centroid, xy, wh, kinks } = this;
        super.setCompiled(this.getCompiled());
        Object.assign(this, { centroid, xy, wh, kinks });
        this.lastBoundaryDiagnostics = {
          ...boundary.diagnostics,
          ...(worldRescue ? { ringRescue: worldRescue } : {}),
          requestedOuterTransform: "worldFile",
          outerTransform: "worldFile",
        };
        return;
      }
      this.compiledOuter = { outerTransform: "extrapolate" };
      this.outerTransform = "extrapolate";
      this.worldFile = undefined;
    }

    const calculateVertices = this.vertexMode === Tin.VERTEX_BIRDEYE
      ? calculateBirdeyeVertices
      : calculatePlainVertices;
    let boundary: BoundaryCandidate | undefined;
    let verticesList: { forw: Feature<Point>[]; bakw: Feature<Point>[] };
    let ringRescue: "thinned" | "corners" | undefined;
    if (isV3) {
      // 組み直しの繰り返しを局所の操作に置き換える（スイッチ incrementalRebuild）。最初の 1 回だけ今の手順で組み、
      // その網を取り込む。2 回目からの試行は、取り込んだ網を複製して、帯だけを差し替える
      const useLocal = this.incrementalRebuild && !this.localRebuildDisabled && wantsStrict && !worldFile;
      const stats: RebuildDiagnostics = {
        fullAttempts: 0, localAttempts: 0, localFailures: 0, localMs: 0, adoptedLocal: false,
        fellBack: this.localRebuildDisabled,
      };
      this.lastRebuildDiagnostics = this.incrementalRebuild ? stats : undefined;
      let base: BuildMesh | undefined;
      const baseCount = rawPointsSet.forw.length;
      /** 帯の差し替えで試行を作る。成り立たなければ undefined（今の手順で組む）。 */
      const localAttempt = (
        ring: RingOptions | undefined,
        excludedHull: ReadonlySet<string>,
        cache: SearchCache,
      ): { boundary: BoundaryCandidate; verticesList: { forw: Feature<Point>[]; bakw: Feature<Point>[] } } | undefined => {
        const params = ring ? { ...boundaryParams, ring } : boundaryParams;
        const width = maxx - minx;
        const height = maxy - miny;
        const hullAll = convexHullEdges(rawPointsSet.forw.map(({ geometry }) => geometry.coordinates));
        const hull = hullAll.filter((edge) => !excludedHull.has(hullEdgeKey(edge)));

        const addPoints = rawPointsSet.forw.slice(baseCount).map((feature) => ({
          index: feature.properties!.target.index as string,
          forw: feature.geometry.coordinates,
          bakw: feature.properties!.target.geom as Position,
        }));
        let best: { build: BuildMesh; vertices: VertexPosition[]; margin: number; flips: number; applied: Edge[] } | undefined;
        for (const margin of MARGINS) {
          const reuse = cache.get(margin) ?? { forwReuse: {} };
          cache.set(margin, reuse);
          const vertices = reuse.vertices ?? (reuse.vertices = calculateVertices({
            ...params,
            minx: minx - margin * width,
            maxx: maxx + margin * width,
            miny: miny - margin * height,
            maxy: maxy + margin * height,
          }, true));
          // 扇形の境界には、地図面で時計回り、地理面で反時計回りの星形が必要（searchBoundary と同じ）
          if (
            !isStarShaped(vertices.map((v) => v.forw), centCalc.forw, -1) ||
            !isStarShaped(vertices.map((v) => v.bakw), centCalc.bakw, 1)
          ) continue;
          const build = cloneBuildMesh(base!);
          // 今の手順と同じ順で作る: 紙の面の制約付き三角網（制約から外れた凸包の辺は、外接円の条件で反転する）
          // → 重なりの解消（ok でない三角形を、辺の反転と、周りの組み直しで直す）
          const replaced = replaceBand(build, { vertices, addPoints, hull, forwOnly: true });
          if (!replaced.ok) continue;
          build.mesh.repairBad();
          // 反転で直らない所は、周りを組み直す
          // （ok でない三角形が多い網は、もともと strict にならない網。手間を掛けない）
          if (build.mesh.bad.size > 0 && build.mesh.bad.size <= MAX_HEAL_TRIANGLES) build.mesh.healBad();
          const flips = countBadBandTriangles(build);
          if (!best || flips < best.flips) best = { build, vertices, margin, flips, applied: replaced.applied };
          if (flips === 0) break;
        }
        if (!best) return undefined;
        const verticesList = {
          forw: best.vertices.map(({ forw, bakw }, i) => createPoint(forw, bakw, `b${i}`)),
          bakw: [] as Feature<Point>[],
        };
        verticesList.bakw = verticesList.forw.map(counterPoint);
        this.pointsSet = {
          forw: featureCollection([...rawPointsSet.forw, ...verticesList.forw]),
          bakw: featureCollection([...rawPointsSet.bakw, ...verticesList.bakw]),
          edges: rawPointsSet.edges,
        };
        const forw = rotateVerticesTriangle(tinsFromMesh(best.build));
        this.tins = { forw };
        this.localTins.add(this.tins);
        this.strict_status = best.build.mesh.isStrict() ? Tin.STATUS_STRICT : Tin.STATUS_ERROR;
        delete this.kinks;
        const { mesh } = best.build;
        return {
          boundary: {
            vertices: best.vertices,
            forw,
            bakw: forw,
            diagnostics: {
              margin: best.margin,
              boundaryTriangleFlips: best.flips,
              remainingForbiddenTriangles: mesh.forbiddenBoundary + mesh.forbiddenEdge,
            },
            hasMapBoundary: true,
            hasBoundary: true,
            forwHull: { all: hullAll, applied: best.applied },
          },
          verticesList,
        };
      };
      const buildV3 = (ring?: RingOptions) =>
        this.buildWithSupplements(strict, rawPointsSet, allGcps, (cache, mode, measureOnly) =>
          (excludedHull) => {
            if (base) {
              const started = performance.now();
              const local = localAttempt(ring, excludedHull, cache);
              stats.localMs += performance.now() - started;
              if (local) {
                stats.localAttempts++;
                return local;
              }
              stats.localFailures++;
            }
            stats.fullAttempts++;
            const params = ring ? { ...boundaryParams, ring } : boundaryParams;
            const found = searchBoundary(
              params,
              calculateVertices,
              rawPointsSet,
              this.points.length,
              undefined,
              excludedHull,
              cache,
            );
            // 最初の試行（凸包の辺を全部制約にした・補完点なし・輪を間引かない）で、両面で輪が閉じたら、
            // 重なりを解消する前の紙の面の三角網を取り込む（buildTin は、この三角網をその場で書き換える）
            if (
              useLocal && !base && !ring && !measureOnly && excludedHull.size === 0 &&
              rawPointsSet.forw.length === baseCount && found?.hasBoundary
            ) {
              base = buildMeshFromTins(
                [...rawPointsSet.forw, ...found.vertices.map(({ forw, bakw }, i) => createPoint(forw, bakw, `b${i}`))],
                found.forw, rawPointsSet.edges, this.points.length, -1,
              );
            }
            const result = {
              boundary: found,
              verticesList: this.buildTin(
                rawPointsSet,
                found?.vertices ?? calculateVertices(params, false),
                mode,
                found,
                excludedHull.size > 0,
                measureOnly,
              ),
            };
            return result;
          });
      // 扇形に落ちた入力では、world file 外周の試行は数えず、この最初の組み立ての試行数を基準にする
      const v3Start = this.attemptTotal;
      const v3First = buildV3();
      const rescued = rescue(v3First, this.attemptTotal - v3Start, buildV3);
      ({ boundary, verticesList } = rescued.result);
      ringRescue = rescued.kind;
      // 採用した三角網が局所の試行の結果なら、地理面の三角網を写して、今の交差の数え上げで確かめる。
      // 局所の判定（三角形ごとの向きと、外周の単純さ）と食い違ったら、今の手順だけで組み直す
      if (this.localTins.has(this.tins!)) {
        stats.adoptedLocal = true;
        this.tins!.bakw = featureCollection(this.tins!.forw!.features.map((tri: Tri) => counterTri(tri)));
        // 向きが逆・面積 0 の三角形が無いこと（交差の数え上げは、面積 0 の三角形を拾わないことがある）と、交差が無いこと
        const oriented = this.tins!.forw!.features.every((tri: Tri) => {
          const { a, b, c } = tri.properties!;
          const [p, q, r] = tri.geometry!.coordinates[0];
          return Math.sign(orient2d(p[0], p[1], q[0], q[1], r[0], r[1])) *
            Math.sign(orient2d(a.geom[0], a.geom[1], b.geom[0], b.geom[1], c.geom[0], c.geom[1])) === -1;
        });
        const clean = oriented && (["forw", "bakw"] as const).every((direction) =>
          findIntersectionsUpTo(
            this.tins![direction]!.features.map((tri: Tri) => tri.geometry!.coordinates[0]),
            1,
          ).length === 0
        );
        if (!clean || !this.isStrict()) {
          this.localRebuildDisabled = true;
          try {
            this.rebuildAll();
          } finally {
            this.localRebuildDisabled = false;
          }
          return;
        }
      }
    } else {
      verticesList = this.buildTin(
        rawPointsSet,
        calculateVertices(boundaryParams, false),
        strict,
        undefined,
      );
    }

    this.vertices_params = {
      forw: vertexCalc(verticesList.forw, this.centroid.forw!),
      bakw: vertexCalc(verticesList.bakw, this.centroid.bakw!),
    };

    this.addIndexedTin();

    // 旧 @maplat/transform の transform() は、重みバッファの forw／bakw を無条件に読む
    // （旧 transform.ts:304-306）。Tin の CI・手元はその旧版と組まれるので、未設定だと
    // updateTin() 直後の transform() が TypeError になる。{} の .forw は undefined なので
    // 旧版でも純アフィンになる。新 Transform はこの値を読まない。
    this.pointsWeightBuffer = {};
    this.lastBoundaryDiagnostics = boundary && ringRescue
      ? { ...boundary.diagnostics, ringRescue }
      : boundary?.diagnostics;
    if (worldFile && this.lastBoundaryDiagnostics) {
      this.lastBoundaryDiagnostics = {
        ...this.lastBoundaryDiagnostics,
        requestedOuterTransform: "worldFile",
        outerTransform: "extrapolate",
        fallbackReason: "boundaryFlips",
      };
    }
  }

  /**
   * `buildWithHull` で三角網を組み、strict のために制約から外した凸包の辺があれば、システムが補完点を
   * 足して組み直す（#89）。外れた辺が無いとき、補完点を使わない指定のとき、V2 のときは、`buildWithHull` の
   * 結果をそのまま返す。
   *
   * 補完点は rawPointsSet と allGcps と edgeNodes の末尾に、添字 `e{n}` で足す（必須エッジの中継点の
   * 続き番号）。重心・扇形外挿の推定（pointsSetFC・convexBuf）には入れない。loose 指定には足さない
   * （MaplatTin#95）。
   *
   * @param makeAttempt 点群ごとの探索の入れ物と strict の方式・「三角網の向きを読むだけ」（交差を調べない）を
   *   受け取り、`buildWithHull` に渡す試行を返す
   */
  private buildWithSupplements<T extends { boundary?: BoundaryCandidate }>(
    strict: StrictMode,
    rawPointsSet: RawPointsSet,
    allGcps: BoundaryVerticesParams["allGcps"],
    makeAttempt: (
      cache: SearchCache,
      mode: StrictMode,
      measureOnly: boolean,
    ) => (excludedHull: ReadonlySet<string>) => T,
  ): T {
    // 三角網を組んだ試行の数（補完点の手順に使ってよい手間の基準と、使った手間）
    let attempts = 0;
    const counted = (cache: SearchCache, mode: StrictMode, measureOnly: boolean) => {
      const attempt = makeAttempt(cache, mode, measureOnly);
      return (excludedHull: ReadonlySet<string>): T => {
        attempts++;
        this.attemptTotal++;
        return attempt(excludedHull);
      };
    };
    const run = (mode: StrictMode): T => this.buildWithHull(mode, counted(new Map(), mode, false));
    // loose 指定には足さない（strict の手順を先に走らせる分、時間が 4〜14 倍になる。MaplatTin#95）
    if (!this.useSupplementPairs || this.useV2Algorithm || strict === Tin.MODE_LOOSE) return run(strict);

    const trialMode = strict;
    const first = run(trialMode);
    const baseCost = attempts;
    let buildCost = 0;
    if (!first.boundary || this.strict_status !== Tin.STATUS_STRICT) return first;
    const firstAnalysis = analyzeMesh(this.tins!.forw!, this.pointsSet!.forw.features, first.boundary.forwHull.all);
    if (firstAnalysis.dropped.length === 0) return first;

    const edgeBase = this.edgeNodes!.length;
    const rawCount = rawPointsSet.forw.length;
    const gcpCount = allGcps.length;
    let current: Position[][] = [];
    // 直近の測り（点群が同じなら、探索の入れ物を組み直しに使い回す）
    let measured: { pairs: Position[][]; cache: SearchCache } | undefined;
    const samePairs = (a: Position[][], b: Position[][]) =>
      a.length === b.length &&
      a.every((pair, i) => pair.every((position, k) => position[0] === b[i][k][0] && position[1] === b[i][k][1]));
    const setPairs = (pairs: Position[][]) => {
      rawPointsSet.forw.length = rawCount;
      rawPointsSet.bakw.length = rawCount;
      allGcps.length = gcpCount;
      this.edgeNodes!.length = edgeBase;
      for (const [forw, bakw] of pairs) {
        const pt = createPoint(forw, bakw, `e${this.edgeNodes!.length}`);
        this.edgeNodes!.push([forw, bakw]);
        rawPointsSet.forw.push(pt);
        rawPointsSet.bakw.push(counterPoint(pt));
        allGcps.push({ forw, bakw });
      }
      current = pairs;
    };
    const host: SupplementHost<T, { pairs: Position[][]; state: BuildState }> = {
      edgeBase,
      baseCost,
      buildCost: () => buildCost,
      snapshot: () => ({ pairs: current, state: this.captureBuild() }),
      restore: ({ pairs, state }) => {
        setPairs(pairs);
        this.restoreBuild(state);
      },
      measure: (pairs) => {
        setPairs(pairs);
        const saved = this.captureBuild();
        try {
          // 凸包の辺を全部制約にした最初の試行だけ。strict になるかは問わない（向きを読むだけ）
          const cache: SearchCache = new Map();
          measured = { pairs, cache };
          const { boundary } = makeAttempt(cache, Tin.MODE_STRICT, true)(new Set());
          if (!boundary) return undefined;
          return analyzeMesh(this.tins!.forw!, this.pointsSet!.forw.features, []);
        } finally {
          this.restoreBuild(saved);
        }
      },
      build: (pairs, maxAttempts) => {
        setPairs(pairs);
        const cache = measured && samePairs(measured.pairs, pairs) ? measured.cache : new Map();
        const before = attempts;
        let result: T;
        try {
          result = this.buildWithHull(trialMode, (excludedHull) => {
            // 手間の上限を超えたら、この組み直しは諦める（呼び出し側が状態を戻す）
            if (attempts - before >= maxAttempts) throw OUT_OF_BUDGET;
            return counted(cache, trialMode, false)(excludedHull);
          });
        } catch (error) {
          if (error !== OUT_OF_BUDGET) throw error;
          buildCost += attempts - before;
          return undefined;
        }
        buildCost += attempts - before;
        if (!result.boundary || this.strict_status !== Tin.STATUS_STRICT) return undefined;
        return {
          result,
          analysis: analyzeMesh(this.tins!.forw!, this.pointsSet!.forw.features, result.boundary.forwHull.all),
        };
      },
    };
    const outcome = addSupplementPairs(host, { result: first, analysis: firstAnalysis });
    this.supplementRecords = outcome.records;
    this.lastSupplementDiagnostics = outcome.diagnostics;
    return outcome.result;
  }

  /**
   * 凸包の辺を全部制約にして三角網を組み、strict を壊したときは、壊した原因の凸包の辺だけを外して
   * 組み直す。strict に戻るか、外す辺が無くなるまで繰り返し（strict を壊さない範囲で、なるべく多くの
   * 凸包の辺を制約にする）、戻ったら、外した辺を 1 本ずつ制約に戻して strict を保てるか試す。
   *
   * strict に戻らないときは、外して得るものが無いので、凸包の辺を全部制約にした最初の三角網を採る。
   * 凸包の辺を全部外した三角網が strict になるときだけは、そちらを採る。
   *
   * 返す結果と `this` の状態（三角網・点群・strict の判定・交差）は、必ず同じ試行から来る。試行の結果は
   * 控えておき、採用する試行の状態を戻す（失敗した試行の状態を残さない）。同じ外す指定の試行は
   * 繰り返さない。strict でも auto でもない（loose の）ときは組み直さない。
   *
   * 外す辺がある試行（最初の試行以外）は、strict になるかどうかだけが要る（採用されるのは、交差が無い
   * strict の試行か、最初の試行だけ）ので、交差の数え上げは 1 件で止める（`buildTin` の onlyDetectKinks）。
   *
   * @param attempt 外す辺の鍵を受け取り、外周を探して `this.tins` などを組み、探索の結果を返す
   */
  private buildWithHull<T extends { boundary?: BoundaryCandidate }>(
    strict: StrictMode,
    attempt: (excludedHull: ReadonlySet<string>) => T,
  ): T {
    interface Entry {
      value: T;
      strict: boolean;
      /** strict になった試行と、最初の試行だけ控える */
      state?: BuildState;
    }
    const entries = new Map<string, Entry>();
    let live: Entry | undefined; // this に状態がある試行
    const keyOf = (excluded: ReadonlySet<string>) => [...excluded].sort().join(",");
    const run = (excluded: ReadonlySet<string>, keepState = false): Entry => {
      const key = keyOf(excluded);
      const known = entries.get(key);
      if (known) return known;
      const value = attempt(excluded);
      const entry: Entry = {
        value,
        strict: value.boundary !== undefined && this.strict_status === Tin.STATUS_STRICT,
      };
      if (entry.strict || keepState) entry.state = this.captureBuild();
      entries.set(key, entry);
      live = entry;
      return entry;
    };
    /** 採用する試行の状態を this に戻して、その結果を返す。 */
    const adopt = (entry: Entry): T => {
      if (live !== entry) this.restoreBuild(entry.state!);
      live = entry;
      return entry.value;
    };

    const first = run(new Set(), true);
    const wantsStrict = strict === Tin.MODE_STRICT || strict === Tin.MODE_AUTO;
    if (!wantsStrict || !first.value.boundary || first.strict) return first.value;

    const everyHullEdge = new Set(first.value.boundary.forwHull.all.map(hullEdgeKey));
    const pointIndices = () =>
      this.pointsSet!.forw.features.map(
        (feature: Feature<Point>) => feature.properties!.target.index as number | string,
      );

    // 1. 壊した原因の凸包の辺を外していき、strict に戻す
    const excluded = new Set<string>();
    let current = first;
    let recovered: Entry | undefined;
    for (let i = 0; i < MAX_HULL_REFINEMENTS; i++) {
      const culprits = findHullCulprits(
        this.tins!.forw!,
        current.value.boundary!.forwHull.applied,
        pointIndices(),
      ).filter((edge) => !excluded.has(hullEdgeKey(edge)));
      if (culprits.length === 0) break;
      for (const edge of culprits) excluded.add(hullEdgeKey(edge));
      current = run(excluded);
      if (!current.value.boundary) break;
      if (current.strict) {
        recovered = current;
        break;
      }
    }

    // 2. strict に戻ったら、外した辺を 1 本ずつ戻して、strict を保てる辺は制約に戻す
    if (recovered) {
      let best = recovered;
      for (const key of [...excluded].slice(0, MAX_HULL_RESTORE_TRIALS)) {
        const trial = new Set(excluded);
        trial.delete(key);
        const entry = run(trial);
        if (entry.strict) {
          excluded.delete(key);
          best = entry;
        }
      }
      return adopt(best);
    }

    // 3. 戻らないとき: 凸包の辺を全部外すと strict になるならそれを採り、ならなければ最初の三角網に戻す
    if (excluded.size < everyHullEdge.size) {
      const bare = run(everyHullEdge);
      if (bare.strict) return adopt(bare);
    }
    return adopt(first);
  }

  /** 今の三角網が strict か（組み立ての途中で `strict_status` が変わるので、型の絞り込みを避けて読む）。 */
  private isStrict(): boolean {
    return this.strict_status === Tin.STATUS_STRICT;
  }

  /** 三角網を組んだ結果の状態（試行ごとに控え、採用する試行の状態に戻す）。 */
  private captureBuild(): BuildState {
    return {
      tins: this.tins,
      pointsSet: this.pointsSet,
      strict_status: this.strict_status,
      kinks: this.kinks,
    };
  }

  private restoreBuild(state: BuildState): void {
    this.tins = state.tins;
    this.pointsSet = state.pointsSet;
    this.strict_status = state.strict_status;
    if (state.kinks) this.kinks = state.kinks;
    else delete this.kinks;
  }

  /** 補助頂点を含め、strictMode に従って実際に使う両方向の三角網を組む。 */
  private buildTin(
    rawPointsSet: RawPointsSet,
    verticesSet: VertexPosition[],
    strict: StrictMode,
    boundary?: BoundaryCandidate,
    onlyDetectKinks = false,
    measureOnly = false,
  ): { forw: Feature<Point>[]; bakw: Feature<Point>[] } {
    // 補助頂点を生成する。
    const verticesList = {
      forw: [] as Feature<Point>[],
      bakw: [] as Feature<Point>[],
    };
    for (let i = 0; i < verticesSet.length; i++) {
      const forw = verticesSet[i].forw;
      const bakw = verticesSet[i].bakw;
      const forPoint = createPoint(forw, bakw, `b${i}`);
      const bakPoint = counterPoint(forPoint);
      verticesList.forw.push(forPoint);
      verticesList.bakw.push(bakPoint);
    }

    this.pointsSet = {
      forw: featureCollection([...rawPointsSet.forw, ...verticesList.forw]),
      bakw: featureCollection([...rawPointsSet.bakw, ...verticesList.bakw]),
      edges: rawPointsSet.edges,
    };

    // 順変換の三角網を作る。
    this.tins = {
      forw: rotateVerticesTriangle(
        boundary?.forw ?? constrainedTin(this.pointsSet!.forw, rawPointsSet.edges, "target") as Tins,
      ),
    };

    // strict または auto では逆三角網を順三角網から写す。
    if (strict === Tin.MODE_STRICT || strict === Tin.MODE_AUTO) {
      // auto は交差の有無しか使わない（あれば loose に切り替えて kinks を捨てる）
      // ので、1 件見つけた時点で数え上げをやめる。
      // onlyDetectKinks は、strict になるかどうかだけが要る試行（buildWithHull の途中の試行）。
      if (measureOnly) {
        // 三角網の向きを読むだけの試行（補完点の置き場所を測る）。strict かどうかは要らないので交差を調べない
        this.resolveStrictOverlaps();
      } else {
        this.calculateStrictTin(
          strict === Tin.MODE_AUTO || onlyDetectKinks ? 1 : MAX_KINKS_PER_DIRECTION,
        );
      }
    }

    // loose では地理面で独立に三角網を作る。
    if (
      strict === Tin.MODE_LOOSE ||
      (strict === Tin.MODE_AUTO && this.strict_status === Tin.STATUS_ERROR)
    ) {
      this.tins!.bakw = rotateVerticesTriangle(
        boundary?.bakw ?? constrainedTin(this.pointsSet!.bakw, rawPointsSet.edges, "target") as Tins,
      );
      delete this.kinks;
      this.strict_status = Tin.STATUS_LOOSE;
    }

    return verticesList;
  }

  /**
   * 非同期ラッパーを提供します。
   * 互換性のために Promise ベースの API を維持しますが、内部処理は同期的です。
   */
  async updateTinAsync(): Promise<void> {
    this.updateTin();
  }
}

/**
 * edge の両端が GCP の添字（0 以上・GCP の数未満の整数）であることを確かめます。
 *
 * @param edge - 検査する edge の両端（[始点の添字, 終点の添字]）
 * @param pointCount - GCP の数
 * @param edgeIndex - edges の中での位置（エラーメッセージ用）
 * @throws {Error} 添字が整数でない、または GCP の範囲に無い場合
 */
function assertEdgeIndices(
  edge: Edge,
  pointCount: number,
  edgeIndex: number,
): void {
  const isValid = (index: unknown) =>
    Number.isInteger(index) &&
    (index as number) >= 0 &&
    (index as number) < pointCount;
  if (!Array.isArray(edge) || !isValid(edge[0]) || !isValid(edge[1])) {
    throw new Error(
      `Invalid edge at edges[${edgeIndex}]: start/end ${
        JSON.stringify(edge)
      } must be integer indices of points (0 to ${pointCount - 1})`,
    );
  }
}
