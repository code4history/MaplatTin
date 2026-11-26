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
  type BoundaryDiagnostics,
} from "./boundary-search.ts";
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
import type { SearchIndex } from "./searchutils.ts";
import type { PointsSetBD, VertexPosition } from "./types/tin.ts";

type RawPointsSet = { forw: Feature<Point>[]; bakw: Feature<Point>[]; edges: Edge[] };
type CompiledOuter = Pick<CompiledWorldFileOuter, "outerTransform" | "worldFile" | "vertices_points"> |
  { outerTransform: "extrapolate" };

/** strict を壊した凸包の辺を外して組み直す回数の上限。 */
const MAX_HULL_REFINEMENTS = 12;

/** 外した凸包の辺を戻して試す回数の上限。 */
const MAX_HULL_RESTORE_TRIALS = 24;

type EdgeSegmentItem = [Position, number, number, number, string?];
type EdgeNodeItem = [Position, Position, number];

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
  private lastBoundaryDiagnostics?: BoundaryDiagnostics;
  private requestedWorldFile?: WorldFile;
  private compiledOuter?: CompiledOuter;

  /** 現在の三角網を V3 で生成したときの外周の診断。 */
  get boundaryDiagnostics(): BoundaryDiagnostics | undefined {
    return this.tins && !this.useV2Algorithm ? this.lastBoundaryDiagnostics : undefined;
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
  getCompiled(): CompiledTransformData {
    const compiled = {} as CompiledTransformData;
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

      // Calculate edge segments
      const segments = [illstNodes, mercNodes].map((nodes: Position[]): EdgeSegmentItem[] => {
        const lengths = nodes.map((node: Position, index: number, arr: Position[]) => {
          if (index === 0) return 0;
          const prev = arr[index - 1];
          return Math.sqrt(
            Math.pow(node[0] - prev[0], 2) + Math.pow(node[1] - prev[1], 2),
          );
        });

        const accumLengths = lengths.reduce((acc: number[], len: number, idx: number) => {
          if (idx === 0) return [0];
          acc.push(acc[idx - 1] + len);
          return acc;
        }, [] as number[]);

        return accumLengths.map((accum: number, idx: number, arr: number[]): EdgeSegmentItem => {
          const ratio = accum / arr[arr.length - 1];
          return [nodes[idx], lengths[idx], accumLengths[idx], ratio];
        });
      });

      // Generate edge nodes
      segments
        .map((segment: EdgeSegmentItem[], idx: number) => {
          const otherSegment = segments[idx ? 0 : 1];
          return segment
            .filter((item: EdgeSegmentItem, index: number) => {
              return !(
                index === 0 ||
                index === segment.length - 1 ||
                item[4] === "handled"
              );
            })
            .flatMap((item: EdgeSegmentItem): EdgeNodeItem[] => {
              const node = item[0];
              const ratio = item[3];

              const counterpart = otherSegment.reduce(
                (prev: EdgeSegmentItem[] | undefined, curr: EdgeSegmentItem, currIdx: number, arr: EdgeSegmentItem[]) => {
                  if (prev) return prev;
                  const nextItem = arr[currIdx + 1];
                  if (curr[3] === ratio) {
                    curr[4] = "handled";
                    return [curr];
                  }
                  if (
                    curr[3] < ratio && nextItem &&
                    nextItem[3] > ratio
                  ) {
                    return [curr, nextItem];
                  }
                  return undefined;
                },
                undefined as EdgeSegmentItem[] | undefined,
              );

              if (counterpart && counterpart.length === 1) {
                return idx === 0
                  ? [[node, counterpart[0][0], ratio]]
                  : [[counterpart[0][0], node, ratio]];
              }

              if (counterpart && counterpart.length === 2) {
                const curr = counterpart[0];
                const next = counterpart[1];
                const ratioInSegment = (ratio - (curr[3] as number)) /
                  ((next[3] as number) - (curr[3] as number));
                const interpNode: Position = [
                  (next[0][0] - curr[0][0]) *
                  ratioInSegment + curr[0][0],
                  (next[0][1] - curr[0][1]) *
                  ratioInSegment + curr[0][1],
                ];
                return idx === 0
                  ? [[node, interpNode, ratio]]
                  : [[interpNode, node, ratio]];
              }

              return [];
            });
        })
        .reduce((prev: EdgeNodeItem[], curr: EdgeNodeItem[]) => prev.concat(curr), [])
        .sort((a: EdgeNodeItem, b: EdgeNodeItem) => a[2] < b[2] ? -1 : 1)
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
    const pointsSetFC = {
      forw: featureCollection(rawPointsSet.forw),
      bakw: featureCollection(rawPointsSet.bakw),
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
      const boundary = this.buildWithHull(strict, (excludedHull) => searchBoundary(
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
            this.buildTin(rawPointsSet, candidate.vertices, strict, candidate);
            // auto の切り替えと strict の重なり解消を経て、採用した三角網で判定する。
            return (this.strict_status !== Tin.STATUS_LOOSE || candidate.hasBoundary) &&
              countBoundaryFlips(this.tins!.forw!, orientation) === 0 &&
              countBoundaryFlips(this.tins!.bakw!, orientation) === 0;
          },
        },
        excludedHull,
      ));
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
    let verticesList!: { forw: Feature<Point>[]; bakw: Feature<Point>[] };
    const boundary = isV3
      ? this.buildWithHull(strict, (excludedHull) => {
          const found = searchBoundary(
            boundaryParams,
            calculateVertices,
            rawPointsSet,
            this.points.length,
            undefined,
            excludedHull,
          );
          verticesList = this.buildTin(
            rawPointsSet,
            found?.vertices ?? calculateVertices(boundaryParams, false),
            strict,
            found,
          );
          return found;
        })
      : undefined;
    if (!isV3) {
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
   * 凸包の辺を全部制約にして三角網を組み、strict を壊したときは、壊した原因の凸包の辺だけを外して
   * 組み直す。strict に戻るか、外す辺が無くなるまで繰り返す（strict を壊さない範囲で、なるべく多くの
   * 凸包の辺を制約にする）。外せるだけ外しても戻らず、凸包の辺を全部外すと strict になるときは、
   * 全部外した三角網を採る。
   *
   * strict でも auto でもない（loose の）ときは組み直さない。
   *
   * @param attempt 外す辺の鍵を受け取り、外周を探して `this.tins` を組み、探索の結果を返す
   */
  private buildWithHull(
    strict: StrictMode,
    attempt: (excludedHull: ReadonlySet<string>) => BoundaryCandidate | undefined,
  ): BoundaryCandidate | undefined {
    const isStrict = () => this.strict_status === Tin.STATUS_STRICT;
    const excluded = new Set<string>();
    let result = attempt(excluded);
    const wantsStrict = strict === Tin.MODE_STRICT || strict === Tin.MODE_AUTO;
    if (!wantsStrict || !result || isStrict()) return result;

    const everyHullEdge = new Set(result.forwHull.all.map(hullEdgeKey));
    for (let i = 0; i < MAX_HULL_REFINEMENTS; i++) {
      const pointIndices = this.pointsSet!.forw.features.map(
        (feature: Feature<Point>) => feature.properties!.target.index as number | string,
      );
      const culprits = findHullCulprits(
        this.tins!.forw!,
        result.forwHull.applied,
        pointIndices,
      ).filter((edge) => !excluded.has(hullEdgeKey(edge)));
      if (culprits.length === 0) break;
      for (const edge of culprits) excluded.add(hullEdgeKey(edge));
      const next = attempt(excluded);
      if (!next) return this.restoreAfterFailure(attempt, excluded, result);
      result = next;
      if (isStrict()) return this.restoreHullEdges(attempt, excluded, result);
    }

    if (excluded.size < everyHullEdge.size) {
      const bare = attempt(everyHullEdge);
      if (bare && isStrict()) return bare;
      return this.restoreAfterFailure(attempt, excluded, result);
    }
    return result;
  }

  /**
   * strict に戻した状態から、外した凸包の辺を 1 本ずつ制約に戻して試し、strict を保てる辺は戻す。
   * 原因の辺の特定は粗い（接する三角形の単位）ので、外しすぎた辺を取り戻す。
   * 最後に試した組み方が採用した外す辺の指定と違うときは、採用した指定で組み直す。
   */
  private restoreHullEdges(
    attempt: (excludedHull: ReadonlySet<string>) => BoundaryCandidate | undefined,
    excluded: Set<string>,
    strictResult: BoundaryCandidate,
  ): BoundaryCandidate {
    let result = strictResult;
    // this.tins が採用した外す辺の指定の三角網でなくなったとき true
    let stale = false;
    for (const key of [...excluded].slice(0, MAX_HULL_RESTORE_TRIALS)) {
      const trial = new Set(excluded);
      trial.delete(key);
      const next = attempt(trial);
      if (next && this.strict_status === Tin.STATUS_STRICT) {
        excluded.delete(key);
        result = next;
        stale = false;
      } else {
        stale = true;
      }
    }
    if (stale) result = attempt(excluded) ?? result;
    return result;
  }

  /** 試した三角網を捨て、外す辺の指定を元に戻して組み直す。 */
  private restoreAfterFailure(
    attempt: (excludedHull: ReadonlySet<string>) => BoundaryCandidate | undefined,
    excluded: ReadonlySet<string>,
    fallback: BoundaryCandidate,
  ): BoundaryCandidate {
    return attempt(excluded) ?? fallback;
  }

  /** 補助頂点を含め、strictMode に従って実際に使う両方向の三角網を組む。 */
  private buildTin(
    rawPointsSet: RawPointsSet,
    verticesSet: VertexPosition[],
    strict: StrictMode,
    boundary?: BoundaryCandidate,
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
      this.calculateStrictTin(
        strict === Tin.MODE_AUTO ? 1 : MAX_KINKS_PER_DIRECTION,
      );
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
