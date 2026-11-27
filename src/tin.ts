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
  searchBoundary,
  type BoundaryCandidate,
  type SearchCache,
  type BoundaryDiagnostics,
} from "./boundary-search.ts";
import { interpolateEdgeNodes } from "./edge-nodes.ts";
import type { EdgeNodeItem } from "./edge-nodes.ts";
import {
  calculateBirdeyeVertices,
  calculatePlainVertices,
  calculateWorldFileVertices,
  type BoundaryVerticesParams,
} from "./boundary-vertices.ts";
import { findIntersectionsUpTo, MAX_KINKS_PER_DIRECTION } from "./kinks.ts";
import { insertSearchIndex } from "./searchutils.ts";
import { counterPoint, createPoint, vertexCalc } from "./vertexutils.ts";
import { resolveOverlaps } from "./strict-overlap.ts";
import { findHullCulprits } from "./hull-culprits.ts";
import { hullEdgeKey } from "./hull-edges.ts";
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

type RawPointsSet = { forw: Feature<Point>[]; bakw: Feature<Point>[]; edges: Edge[] };
/** 補完点の一覧を持つ compiled（Transform の型には無い項目。読み手は無視してよい）。 */
export type CompiledWithSupplement = CompiledTransformData & { supplementPairs?: SupplementPairRecord[] };
type CompiledOuter = Pick<CompiledWorldFileOuter, "outerTransform" | "worldFile" | "vertices_points"> |
  { outerTransform: "extrapolate" };

/** 三角網を組んだ結果の状態。 */
interface BuildState {
  tins: Tin["tins"];
  pointsSet: Tin["pointsSet"];
  strict_status: Tin["strict_status"];
  kinks: Tin["kinks"];
}

/** strict を壊した凸包の辺を外して組み直す回数の上限。 */
const MAX_HULL_REFINEMENTS = 12;

/** 補完点の組み直しが手間の上限を超えたことを知らせる（`buildWithSupplements` の中だけで投げて捕まえる）。 */
const OUT_OF_BUDGET = Symbol("supplement pairs out of budget");

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
  private requestedWorldFile?: WorldFile;
  private compiledOuter?: CompiledOuter;

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
    if (this.yaxisMode === Tin.YAXIS_FOLLOW) {
      points = points.map((point) => [
        point[0],
        [point[1][0], -1 * point[1][1]],
      ]);
    }
    this.points = points;
    this.tins = undefined;
    this.indexedTins = undefined;
  }

  /**
   * エッジ（制約線）を設定します。
   * 制約線を正規化した上で、依存するキャッシュをリセットします。
   */
  setEdges(edges: EdgeSet[] | EdgeSetLegacy[] = []): void {
    this.edges = normalizeEdges(edges);
    this.edgeNodes = undefined;
    this.tins = undefined;
    this.indexedTins = undefined;
  }

  /**
   * 境界ポリゴンを設定します
   */
  setBounds(bounds: Position[]): void {
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

  /**
   * 現在の設定を永続化可能な形式にコンパイルします
   */
  getCompiled(): CompiledWithSupplement {
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
    return compiled;
  }

  /** コンパイルされた設定を基底クラスで復元し、外周方式を次の生成にも引き継ぐ。 */
  override setCompiled(compiled: CompiledTransformData | CompiledLegacy): void {
    const outer = "outerTransform" in compiled ? compiled : undefined;
    if (outer?.outerTransform === "worldFile" && this.useV2Algorithm) {
      throw new Error("V2 では world file 外周を使えません");
    }
    const replacesWorldFile = this.outerTransform === "worldFile" || outer?.outerTransform === "worldFile";
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
  }

  /**
   * 幅と高さを設定します
   */
  setWh(wh?: number[]): void {
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
    this.vertexMode = mode;
    this.tins = undefined;
    this.indexedTins = undefined;
  }

  /**
   * 厳密性モードを設定します
   */
  setStrictMode(mode: StrictMode): void {
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

      // Generate edge nodes
      interpolateEdgeNodes(illstNodes, mercNodes)
        .map((item: EdgeNodeItem, index: number, arr: EdgeNodeItem[]) => {
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
    this.lastBoundaryDiagnostics = undefined;
    // 補完点は保存しない入力。前回の結果は読まず、人間の対応点だけから毎回作り直す
    this.supplementRecords = [];
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

    if (worldFile) {
      this.stateTriangle = undefined;
      // follow では、GCP と同様に外部 CRS の Y を反転して三角網に入れる。
      // world file 自体は反転前の係数を保存する。
      const follow = this.yaxisMode === Tin.YAXIS_FOLLOW;
      const orientation = follow ? 1 : -1;
      const { boundary } = this.buildWithSupplements(strict, rawPointsSet, allGcps, (cache, mode, measureOnly) =>
        (excludedHull) => ({ boundary: searchBoundary(
          boundaryParams,
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
    if (isV3) {
      ({ boundary, verticesList } = this.buildWithSupplements(strict, rawPointsSet, allGcps, (cache, mode, measureOnly) =>
        (excludedHull) => {
          const found = searchBoundary(
            boundaryParams,
            calculateVertices,
            rawPointsSet,
            this.points.length,
            undefined,
            excludedHull,
            cache,
          );
          return {
            boundary: found,
            verticesList: this.buildTin(
              rawPointsSet,
              found?.vertices ?? calculateVertices(boundaryParams, false),
              mode,
              found,
              excludedHull.size > 0,
              measureOnly,
            ),
          };
        }));
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
    this.lastBoundaryDiagnostics = boundary?.diagnostics;
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
