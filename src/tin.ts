/**
 * Tin (Triangulated Irregular Network) クラス
 * 2つの平面座標系間の同相変換を実現します。
 */

import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import turfCentroid from "@turf/centroid";
import convex from "@turf/convex";
import { featureCollection, point, polygon } from "@turf/helpers";
import type { Feature, Point, Position } from "geojson";
import {
  counterTri,
  format_version,
  normalizeEdges,
  rotateVerticesTriangle,
  Transform,
  transformArr,
} from "@maplat/transform";

// Ensure format_version is available
const FALLBACK_FORMAT_VERSION = 2.00703;
const safeFormatVersion = typeof format_version !== "undefined"
  ? format_version
  : FALLBACK_FORMAT_VERSION;
import type {
  Compiled,
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
  YaxisMode,
} from "@maplat/transform";
import constrainedTin from "./constrained-tin.ts";
import {
  calculateBirdeyeVertices,
  calculatePlainVertices,
} from "./boundary-vertices.ts";
import findIntersections from "./kinks.ts";
import { insertSearchIndex } from "./searchutils.ts";
import { counterPoint, createPoint, vertexCalc } from "./vertexutils.ts";
import { buildPointsWeightBuffer } from "./weight-buffer.ts";
import type { SearchIndex } from "./searchutils.ts";
import type { PointsSetBD } from "./types/tin.d.ts";

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
}

/**
 * Tin (Triangulated Irregular Network) クラス
 * Transformクラスを拡張し、TINネットワークの生成機能を追加
 */
export class Tin extends Transform {
  importance: number;
  priority: number;
  pointsSet: PointsSetBD | undefined;

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
    return safeFormatVersion;
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
  getCompiled(): Compiled {
    const compiled: any = {};
    compiled.version = safeFormatVersion;
    compiled.points = this.points;
    compiled.weight_buffer = this.pointsWeightBuffer;
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
      [0, 1, 2, 3].map((i) => {
        const vertex = vertices[i].features[0];
        const forw = vertex.geometry!.coordinates[0][1];
        const bakw = vertex.properties!.b.geom;
        compiled.vertices_points[i] = [forw, bakw];
      });
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
      compiled.xy = this.xy;
      compiled.wh = this.wh;
    } else {
      compiled.wh = this.wh;
    }

    compiled.edges = this.edges;
    compiled.edgeNodes = this.edgeNodes;

    return compiled;
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
   */
  calcurateStrictTin(): void {
    const bakTins = this.tins!.forw!.features.map((tri: Tri) =>
      counterTri(tri)
    );
    this.tins!.bakw = featureCollection(bakTins);

    const searchIndex: SearchIndex = {};
    this.tins!.forw!.features.forEach((forTri: Tri, index: number) => {
      const bakTri = this.tins!.bakw!.features[index];
      insertSearchIndex(searchIndex, { forw: forTri, bakw: bakTri });
    });

    const kinks = ["forw", "bakw"].map((direction) => {
      const tins = this.tins![direction as keyof TinsBD]!.features.map(
        (tin: Tri) => tin.geometry!.coordinates[0],
      );
      return findIntersections(tins);
    });

    if (kinks[0].length === 0 && kinks[1].length === 0) {
      this.strict_status = Tin.STATUS_STRICT;
      delete this.kinks;
    } else {
      this.strict_status = Tin.STATUS_ERROR;
      this.kinks = {};
      if (kinks[0].length > 0) {
        this.kinks.forw = featureCollection(kinks[0]);
      }
      if (kinks[1].length > 0) {
        this.kinks.bakw = featureCollection(kinks[1]);
      }
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
      const segments = [illstNodes, mercNodes].map((nodes) => {
        const lengths = nodes.map((node, index, arr) => {
          if (index === 0) return 0;
          const prev = arr[index - 1];
          return Math.sqrt(
            Math.pow(node[0] - prev[0], 2) + Math.pow(node[1] - prev[1], 2),
          );
        });

        const accumLengths = lengths.reduce((acc, len, idx) => {
          if (idx === 0) return [0];
          acc.push(acc[idx - 1] + len);
          return acc;
        }, [] as number[]);

        return accumLengths.map((accum, idx, arr) => {
          const ratio = accum / arr[arr.length - 1];
          return [nodes[idx], lengths[idx], accumLengths[idx], ratio];
        });
      });

      // Generate edge nodes
      segments
        .map((segment, idx) => {
          const otherSegment = segments[idx ? 0 : 1];
          return segment
            .filter((item, index) => {
              return !(
                index === 0 ||
                index === segment.length - 1 ||
                (item as any)[4] === "handled"
              );
            })
            .map((item) => {
              const node = item[0] as unknown as Position;
              const ratio = item[3] as number;

              const counterpart = otherSegment.reduce(
                (prev, curr, currIdx, arr) => {
                  if (prev) return prev;
                  const nextItem = arr[currIdx + 1];
                  if ((curr[3] as number) === ratio) {
                    (curr as any)[4] = "handled";
                    return [curr];
                  }
                  if (
                    (curr[3] as number) < ratio && nextItem &&
                    (nextItem[3] as number) > ratio
                  ) {
                    return [curr, nextItem];
                  }
                  return undefined;
                },
                undefined as any,
              );

              if (counterpart && counterpart.length === 1) {
                return idx === 0
                  ? [node, counterpart[0][0], ratio]
                  : [counterpart[0][0], node, ratio];
              }

              if (counterpart && counterpart.length === 2) {
                const curr = counterpart[0];
                const next = counterpart[1];
                const ratioInSegment = (ratio - (curr[3] as number)) /
                  ((next[3] as number) - (curr[3] as number));
                const interpNode: Position = [
                  ((next[0] as Position)[0] - (curr[0] as Position)[0]) *
                    ratioInSegment + (curr[0] as Position)[0],
                  ((next[0] as Position)[1] - (curr[0] as Position)[1]) *
                    ratioInSegment + (curr[0] as Position)[1],
                ];
                return idx === 0
                  ? [node, interpNode, ratio]
                  : [interpNode, node, ratio];
              }

              return [];
            });
        })
        .reduce((prev, curr) => prev.concat(curr), [])
        .sort((a, b) => (a[2] as number) < (b[2] as number) ? -1 : 1)
        .map((item, index, arr) => {
          this.edgeNodes![edgeNodeIndex] = [
            item[0] as Position,
            item[1] as Position,
          ];
          const forPoint = createPoint(
            item[0] as Position,
            item[1] as Position,
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

    const allPointsInside = this.points.reduce((prev, point) => {
      return prev &&
        (this.bounds
          ? booleanPointInPolygon(point[0] as any, this.boundsPolygon!)
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

  /**
   * TINネットワークを同期的に更新し、座標変換の準備を行います。
   * 重めの計算を伴うため、呼び出し側が非同期制御を行いたい場合は
   * {@link updateTinAsync} を利用してください。
   */
  updateTin(): void {
    let strict = this.strictMode;
    if (strict !== Tin.MODE_STRICT && strict !== Tin.MODE_LOOSE) {
      strict = Tin.MODE_AUTO;
    }

    const { pointsSet: rawPointsSet, bbox, minx, maxx, miny, maxy } = this
      .validateAndPrepareInputs();

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
        bakw: transformArr(point(coord), tinForw as any) as Position,
      }));
      convexCalc.forEach((item: any) => {
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
        forw: transformArr(point(coord), tinBakw as any) as Position,
      }));
      convexCalc.forEach((item: any) => {
        convexBuf[`${item.forw[0]}:${item.forw[1]}`] = item;
      });
    } catch {
      throw "TOO LINEAR2";
    }

    // Set centroids
    const centCalc = {
      forw: forCentroid.geometry!.coordinates,
      bakw: transformArr(forCentroid, tinForw as any) as Position,
    };

    const centroidPoint = createPoint(centCalc.forw, centCalc.bakw, "c");
    this.centroid = {
      forw: centroidPoint,
      bakw: counterPoint(centroidPoint),
    };

    // Calculate vertices
    const boundaryParams = {
      convexBuf,
      centroid: centCalc,
      bbox,
      minx,
      maxx,
      miny,
      maxy,
    };
    const verticesSet = this.vertexMode === Tin.VERTEX_BIRDEYE
      ? calculateBirdeyeVertices(boundaryParams)
      : calculatePlainVertices(boundaryParams);

    // Add vertices to points set
    const verticesList = {
      forw: [] as Feature<Point>[],
      bakw: [] as Feature<Point>[],
    };
    for (let i = 0; i < verticesSet.length; i++) {
      const forw = verticesSet[i].forw;
      const bakw = verticesSet[i].bakw;
      const forPoint = createPoint(forw, bakw, `b${i}`);
      const bakPoint = counterPoint(forPoint);
      rawPointsSet.forw.push(forPoint);
      rawPointsSet.bakw.push(bakPoint);
      verticesList.forw.push(forPoint);
      verticesList.bakw.push(bakPoint);
    }

    this.pointsSet = {
      forw: featureCollection(rawPointsSet.forw),
      bakw: featureCollection(rawPointsSet.bakw),
      edges: [],
    };

    // Generate forward TIN
    this.tins = {
      forw: rotateVerticesTriangle(
        constrainedTin(
          this.pointsSet!.forw,
          rawPointsSet.edges,
          "target",
        ) as Tins,
      ),
    };

    // Calculate strict TIN if needed
    if (strict === Tin.MODE_STRICT || strict === Tin.MODE_AUTO) {
      this.calcurateStrictTin();
    }

    // Generate backward TIN if needed
    if (
      strict === Tin.MODE_LOOSE ||
      (strict === Tin.MODE_AUTO && this.strict_status === Tin.STATUS_ERROR)
    ) {
      this.tins!.bakw = rotateVerticesTriangle(
        constrainedTin(
          this.pointsSet!.bakw,
          rawPointsSet.edges,
          "target",
        ) as Tins,
      );
      delete this.kinks;
      this.strict_status = Tin.STATUS_LOOSE;
    }

    // Calculate vertices parameters
    this.vertices_params = {
      forw: vertexCalc(verticesList.forw, this.centroid.forw!),
      bakw: vertexCalc(verticesList.bakw, this.centroid.bakw!),
    };

    this.addIndexedTin();

    const targets: Array<keyof TinsBD> = ["forw"];
    if (this.strict_status === Tin.STATUS_LOOSE) {
      targets.push("bakw");
    }

    const includeReciprocals = this.strict_status === Tin.STATUS_STRICT;
    this.pointsWeightBuffer = buildPointsWeightBuffer({
      tins: this.tins!,
      targets,
      includeReciprocals,
    });
  }

  /**
   * 非同期ラッパーを提供します。
   * 互換性のために Promise ベースの API を維持しますが、内部処理は同期的です。
   */
  async updateTinAsync(): Promise<void> {
    this.updateTin();
  }
}
