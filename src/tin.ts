/**
 * Tin (Triangulated Irregular Network) クラス
 * 2つの平面座標系間の同相変換を実現します。
 */

import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import turfCentroid from "@turf/centroid";
import convex from "@turf/convex";
import { point, featureCollection, polygon, lineString } from "@turf/helpers";
import lineIntersect from "@turf/line-intersect";
import type { Feature, Point, Position } from "geojson";
import { 
  Transform, 
  format_version,
  normalizeEdges,
  counterTri,
  transformArr,
  rotateVerticesTriangle
} from "@maplat/transform";

// Ensure format_version is available
const FALLBACK_FORMAT_VERSION = 2.00703;
const safeFormatVersion = typeof format_version !== 'undefined' ? format_version : FALLBACK_FORMAT_VERSION;
import type {
  Compiled,
  Edge,
  EdgeSet,
  EdgeSetLegacy,
  PointSet,
  StrictMode,
  VertexMode,
  YaxisMode,
  Tri,
  Tins,
  WeightBufferBD,
  TinsBD,
  PropertyTriKey
} from "@maplat/transform";
import constrainedTin from "./constrained-tin.ts";
import findIntersections from "./kinks.ts";
import { insertSearchIndex } from "./searchutils.ts";
import { createPoint, counterPoint, vertexCalc } from "./vertexutils.ts";
import type { SearchIndex } from "./searchutils.ts";
import type { PointsSetBD } from "./types/tin.ts";

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
   * 制御点（GCP: Ground Control Points）を設定します
   */
  setPoints(points: PointSet[]): void {
    if (this.yaxisMode === Tin.YAXIS_FOLLOW) {
      points = points.map(point => [
        point[0],
        [point[1][0], -1 * point[1][1]]
      ]);
    }
    this.points = points;
    this.tins = undefined;
    this.indexedTins = undefined;
  }

  /**
   * エッジ（制約線）を設定します
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
      this.centroid!.forw!.properties!.target.geom
    ];
    compiled.vertices_params = [
      this.vertices_params!.forw![0],
      this.vertices_params!.bakw![0]
    ];
    compiled.vertices_points = [];
    
    const vertices = this.vertices_params!.forw![1];
    if (vertices) {
      [0, 1, 2, 3].map(i => {
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
        (["a", "b", "c"] as PropertyTriKey[]).map(key => tin.properties![key].index)
      );
    });
    
    if (this.strict_status === Tin.STATUS_LOOSE) {
      compiled.tins_points[1] = [];
      this.tins!.bakw!.features.map((tin: Tri) => {
        compiled.tins_points[1].push(
          (["a", "b", "c"] as PropertyTriKey[]).map(key => tin.properties![key].index)
        );
      });
    } else if (this.strict_status === Tin.STATUS_ERROR && this.kinks?.bakw) {
      compiled.kinks_points = this.kinks.bakw.features.map(
        kink => kink.geometry!.coordinates
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
    const bakTins = this.tins!.forw!.features.map((tri: Tri) => counterTri(tri));
    this.tins!.bakw = featureCollection(bakTins);
    
    const searchIndex: SearchIndex = {};
    this.tins!.forw!.features.forEach((forTri: Tri, index: number) => {
      const bakTri = this.tins!.bakw!.features[index];
      insertSearchIndex(searchIndex, { forw: forTri, bakw: bakTri });
    });
    
    const kinks = ["forw", "bakw"].map(direction => {
      const tins = this.tins![direction as keyof TinsBD]!.features.map(
        (tin: Tri) => tin.geometry!.coordinates[0]
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
   * 点群セットを生成します
   */
  generatePointsSet(): {
    forw: Feature<Point>[];
    bakw: Feature<Point>[];
    edges: Edge[];
  } {
    const pointsSet: { forw: Feature<Point>[]; bakw: Feature<Point>[] } = { forw: [], bakw: [] };
    
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
      const segments = [illstNodes, mercNodes].map(nodes => {
        const lengths = nodes.map((node, index, arr) => {
          if (index === 0) return 0;
          const prev = arr[index - 1];
          return Math.sqrt(
            Math.pow(node[0] - prev[0], 2) + Math.pow(node[1] - prev[1], 2)
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
            .map(item => {
              const node = item[0] as unknown as Position;
              const ratio = item[3] as number;
              
              const counterpart = otherSegment.reduce((prev, curr, currIdx, arr) => {
                if (prev) return prev;
                const nextItem = arr[currIdx + 1];
                if ((curr[3] as number) === ratio) {
                  (curr as any)[4] = "handled";
                  return [curr];
                }
                if ((curr[3] as number) < ratio && nextItem && (nextItem[3] as number) > ratio) {
                  return [curr, nextItem];
                }
                return undefined;
              }, undefined as any);
              
              if (counterpart && counterpart.length === 1) {
                return idx === 0
                  ? [node, counterpart[0][0], ratio]
                  : [counterpart[0][0], node, ratio];
              }
              
              if (counterpart && counterpart.length === 2) {
                const curr = counterpart[0];
                const next = counterpart[1];
                const ratioInSegment = (ratio - (curr[3] as number)) / ((next[3] as number) - (curr[3] as number));
                const interpNode: Position = [
                  ((next[0] as Position)[0] - (curr[0] as Position)[0]) * ratioInSegment + (curr[0] as Position)[0],
                  ((next[0] as Position)[1] - (curr[0] as Position)[1]) * ratioInSegment + (curr[0] as Position)[1]
                ];
                return idx === 0 ? [node, interpNode, ratio] : [interpNode, node, ratio];
              }
              
              return [];
            });
        })
        .reduce((prev, curr) => prev.concat(curr), [])
        .sort((a, b) => (a[2] as number) < (b[2] as number) ? -1 : 1)
        .map((item, index, arr) => {
          this.edgeNodes![edgeNodeIndex] = [item[0] as Position, item[1] as Position];
          const forPoint = createPoint(item[0] as Position, item[1] as Position, `e${edgeNodeIndex}`);
          edgeNodeIndex++;
          pointsSet.forw!.push(forPoint);
          pointsSet.bakw!.push(counterPoint(forPoint));
          
          if (index === 0) {
            edges.push([edge[0], pointsSet.forw!.length - 1]);
          } else {
            edges.push([pointsSet.forw!.length - 2, pointsSet.forw!.length - 1]);
          }
          
          if (index === arr.length - 1) {
            edges.push([pointsSet.forw!.length - 1, edge[1]]);
          }
        });
    }
    
    return {
      forw: pointsSet.forw,
      bakw: pointsSet.bakw,
      edges
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
      return prev && (this.bounds
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
      maxy
    };
  }

  /**
   * TINネットワークを更新し、座標変換の準備を行います
   */
  updateTin(): void {
    let strict = this.strictMode;
    if (strict !== Tin.MODE_STRICT && strict !== Tin.MODE_LOOSE) {
      strict = Tin.MODE_AUTO;
    }
    
    const { pointsSet: rawPointsSet, bbox, minx, maxx, miny, maxy } = this.validateAndPrepareInputs();
    
    // Create FeatureCollections for use in calculations
    const pointsSetFC = {
      forw: featureCollection(rawPointsSet.forw),
      bakw: featureCollection(rawPointsSet.bakw)
    };
    
    
    const tinForw = constrainedTin(pointsSetFC.forw, rawPointsSet.edges, "target");
    const tinBakw = constrainedTin(pointsSetFC.bakw, rawPointsSet.edges, "target");
    
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
        bakw: transformArr(point(coord), tinForw as any) as Position
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
        forw: transformArr(point(coord), tinBakw as any) as Position
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
      bakw: transformArr(forCentroid, tinForw as any) as Position
    };
    
    const centroidPoint = createPoint(centCalc.forw, centCalc.bakw, "c");
    this.centroid = {
      forw: centroidPoint,
      bakw: counterPoint(centroidPoint)
    };
    
    // Calculate vertices
    const verticesSet = this.vertexMode === Tin.VERTEX_BIRDEYE 
      ? this.calculateBirdeyeVertices(convexBuf, centCalc, bbox, minx, maxx, miny, maxy)
      : this.calculatePlainVertices(convexBuf, centCalc, bbox, minx, maxx, miny, maxy);
    
    // Add vertices to points set
    const verticesList = { forw: [] as Feature<Point>[], bakw: [] as Feature<Point>[] };
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
      edges: []
    };
    
    // Generate forward TIN
    this.tins = {
      forw: rotateVerticesTriangle(constrainedTin(this.pointsSet!.forw, rawPointsSet.edges, "target") as Tins)
    };
    
    // Calculate strict TIN if needed
    if (strict === Tin.MODE_STRICT || strict === Tin.MODE_AUTO) {
      this.calcurateStrictTin();
    }
    
    // Generate backward TIN if needed
    if (strict === Tin.MODE_LOOSE || 
        (strict === Tin.MODE_AUTO && this.strict_status === Tin.STATUS_ERROR)) {
      this.tins!.bakw = rotateVerticesTriangle(
        constrainedTin(this.pointsSet!.bakw, rawPointsSet.edges, "target") as Tins
      );
      delete this.kinks;
      this.strict_status = Tin.STATUS_LOOSE;
    }
    
    // Calculate vertices parameters
    this.vertices_params = {
      forw: vertexCalc(verticesList.forw, this.centroid.forw!),
      bakw: vertexCalc(verticesList.bakw, this.centroid.bakw!)
    };
    
    this.addIndexedTin();
    this.calculatePointsWeight();
  }

  /**
   * 通常の頂点を計算
   */
  private calculatePlainVertices(
    convexBuf: Record<string, { forw: Position; bakw: Position }>,
    centCalc: { forw: Position; bakw: Position },
    bbox: Position[],
    minx: number,
    maxx: number,
    miny: number,
    maxy: number
  ): Array<{ forw: Position; bakw: Position }> {
    // Calculate edge vertices
    const edgeNodes = Object.keys(convexBuf).reduce((prev, key) => {
      const item = convexBuf[key];
      const forw = item.forw;
      const bakw = item.bakw;
      
      const vec = {
        forw: [forw[0] - centCalc.forw[0], forw[1] - centCalc.forw[1]],
        bakw: [bakw[0] - centCalc.bakw[0], bakw[1] - centCalc.bakw[1]]
      };
      
      const xRate = vec.forw[0] === 0 ? Infinity : 
        ((vec.forw[0] < 0 ? minx : maxx) - centCalc.forw[0]) / vec.forw[0];
      const yRate = vec.forw[1] === 0 ? Infinity : 
        ((vec.forw[1] < 0 ? miny : maxy) - centCalc.forw[1]) / vec.forw[1];
      
      if (Math.abs(xRate) / Math.abs(yRate) < 1.1) {
        const node = {
          forw: [vec.forw[0] * xRate + centCalc.forw[0], vec.forw[1] * xRate + centCalc.forw[1]] as Position,
          bakw: [vec.bakw[0] * xRate + centCalc.bakw[0], vec.bakw[1] * xRate + centCalc.bakw[1]] as Position
        };
        if (vec.forw[0] < 0) {
          prev[3].push(node);
        } else {
          prev[1].push(node);
        }
      }
      
      if (Math.abs(yRate) / Math.abs(xRate) < 1.1) {
        const node = {
          forw: [vec.forw[0] * yRate + centCalc.forw[0], vec.forw[1] * yRate + centCalc.forw[1]] as Position,
          bakw: [vec.bakw[0] * yRate + centCalc.bakw[0], vec.bakw[1] * yRate + centCalc.bakw[1]] as Position
        };
        if (vec.forw[1] < 0) {
          prev[0].push(node);
        } else {
          prev[2].push(node);
        }
      }
      
      return prev;
    }, [[], [], [], []] as Array<Array<{ forw: Position; bakw: Position }>>);
    
    // Calculate vertex angles
    const vertexCalc = Object.keys(convexBuf).reduce((prev, key, index, arr) => {
      const item = convexBuf[key];
      const forw = item.forw;
      const bakw = item.bakw;
      
      const vec = {
        forw: [forw[0] - centCalc.forw[0], forw[1] - centCalc.forw[1]],
        bakw: [bakw[0] - centCalc.bakw[0], centCalc.bakw[1] - bakw[1]]
      };
      
      if (vec.forw[0] === 0 || vec.forw[1] === 0) return prev;
      
      let quad = 0;
      if (vec.forw[0] > 0) quad += 1;
      if (vec.forw[1] > 0) quad += 2;
      
      prev[quad].push([vec.forw, vec.bakw]);
      
      if (index === arr.length - 1) {
        return prev.map(quadArr => {
          return quadArr.reduce((qprev: number[] | undefined, curr: number[][], qindex: number, qarr: number[][][]) => {
            if (!qprev) qprev = [Infinity, 0, 0];
            
            let ratio = Math.sqrt(Math.pow(curr[0][0], 2) + Math.pow(curr[0][1], 2)) /
                       Math.sqrt(Math.pow(curr[1][0], 2) + Math.pow(curr[1][1], 2));
            ratio = ratio < qprev[0] ? ratio : qprev[0];
            
            const theta = Math.atan2(curr[0][0], curr[0][1]) - Math.atan2(curr[1][0], curr[1][1]);
            const sumcos = qprev[1] + Math.cos(theta);
            const sumsin = qprev[2] + Math.sin(theta);
            
            if (qindex === qarr.length - 1) {
              return [ratio, Math.atan2(sumsin, sumcos)];
            }
            return [ratio, sumcos, sumsin];
          }, null as any);
        });
      }
      
      return prev;
    }, [[], [], [], []] as any[]);
    
    let vertexRatio: any[] = vertexCalc;
    if (vertexRatio.length === 1) {
      vertexRatio = [vertexRatio[0], vertexRatio[0], vertexRatio[0], vertexRatio[0]];
    }
    
    // Calculate vertices
    const vertices = vertexRatio.map((ratio: any, index: number) => {
      const forVertex = bbox[index];
      const forDelta = [forVertex[0] - centCalc.forw[0], forVertex[1] - centCalc.forw[1]];
      const forDistance = Math.sqrt(Math.pow(forDelta[0], 2) + Math.pow(forDelta[1], 2));
      const bakDistance = forDistance / ratio[0];
      const bakTheta = Math.atan2(forDelta[0], forDelta[1]) - ratio[1];
      const bakw: Position = [
        centCalc.bakw[0] + bakDistance * Math.sin(bakTheta),
        centCalc.bakw[1] - bakDistance * Math.cos(bakTheta)
      ];
      
      return { forw: forVertex, bakw };
    });
    
    // Swap vertices 2 and 3 for correct ordering
    const swap = vertices[2];
    vertices[2] = vertices[3];
    vertices[3] = swap;
    
    // Check edge intersections
    this.checkAndAdjustVertices(vertices, edgeNodes, centCalc);
    
    return vertices;
  }

  /**
   * 鳥瞰図モードの頂点を計算
   */
  private calculateBirdeyeVertices(
    convexBuf: Record<string, { forw: Position; bakw: Position }>,
    centCalc: { forw: Position; bakw: Position },
    bbox: Position[],
    minx: number,
    maxx: number,
    miny: number,
    maxy: number
  ): Array<{ forw: Position; bakw: Position }> {
    // For birdeye mode, implement special vertex calculation
    // This is a simplified version, actual implementation might be more complex
    return this.calculatePlainVertices(convexBuf, centCalc, bbox, minx, maxx, miny, maxy);
  }

  /**
   * 頂点の位置を調整
   */
  private checkAndAdjustVertices(
    vertices: Array<{ forw: Position; bakw: Position }>,
    edgeNodes: Array<Array<{ forw: Position; bakw: Position }>>,
    centCalc: { forw: Position; bakw: Position }
  ): void {
    const expandRatio = [1, 1, 1, 1];
    
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4;
      const side = lineString([vertices[i].bakw, vertices[j].bakw]);
      
      edgeNodes[i].map(node => {
        const line = lineString([centCalc.bakw, node.bakw]);
        const intersect = lineIntersect(side, line);
        
        if (intersect.features.length > 0 && intersect.features[0].geometry) {
          const intersectPt = intersect.features[0];
          const distance = Math.sqrt(
            Math.pow(node.bakw[0] - centCalc.bakw[0], 2) + 
            Math.pow(node.bakw[1] - centCalc.bakw[1], 2)
          );
          const intDistance = Math.sqrt(
            Math.pow(intersectPt.geometry.coordinates[0] - centCalc.bakw[0], 2) + 
            Math.pow(intersectPt.geometry.coordinates[1] - centCalc.bakw[1], 2)
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
        (vertex.bakw[0] - centCalc.bakw[0]) * ratio + centCalc.bakw[0],
        (vertex.bakw[1] - centCalc.bakw[1]) * ratio + centCalc.bakw[1]
      ];
      vertex.bakw = bakw;
    });
  }

  /**
   * 点の重み付けを計算します
   */
  calculatePointsWeight(): void {
    const calcTargets = ["forw"];
    if (this.strict_status === Tin.STATUS_LOOSE) {
      calcTargets.push("bakw");
    }
    
    const weightBuffer: WeightBufferBD = {};
    
    calcTargets.forEach(target => {
      weightBuffer[target as keyof WeightBufferBD] = {};
      const tin_points: Record<string, number> = {};
      
      this.tins![target as keyof TinsBD]!.features.map((tri: Tri) => {
        const props = ["a", "b", "c"] as PropertyTriKey[];
        for (let i = 0; i < 3; i++) {
          const j = (i + 1) % 3;
          const prop_i = props[i];
          const prop_j = props[j];
          const index_i = tri.properties![prop_i].index;
          const index_j = tri.properties![prop_j].index;
          const key = [index_i, index_j].sort().join("-");
          
          if (!tin_points[key]) {
            const i_xy = tri.geometry!.coordinates[0][i];
            const j_xy = tri.geometry!.coordinates[0][j];
            const i_merc = tri.properties![prop_i].geom;
            const j_merc = tri.properties![prop_j].geom;
            
            tin_points[key] = 1;
            const ratio = Math.sqrt(
              Math.pow(i_merc[0] - j_merc[0], 2) + Math.pow(i_merc[1] - j_merc[1], 2)
            ) / Math.sqrt(
              Math.pow(i_xy[0] - j_xy[0], 2) + Math.pow(i_xy[1] - j_xy[1], 2)
            );
            
            if (!weightBuffer[target as keyof WeightBufferBD]) {
              weightBuffer[target as keyof WeightBufferBD] = {};
            }
            
            const targetBuffer = weightBuffer[target as keyof WeightBufferBD]!;
            targetBuffer[`${index_i}:${key}`] = ratio;
            targetBuffer[`${index_j}:${key}`] = ratio;
          }
        }
      });
    });
    
    // Calculate average weights
    const pointsWeightBuffer: WeightBufferBD = {};
    
    calcTargets.map(target => {
      pointsWeightBuffer[target as keyof WeightBufferBD] = {};
      
      if (this.strict_status === Tin.STATUS_STRICT) {
        pointsWeightBuffer.bakw = {};
      }
      
      const targetBuffer = weightBuffer[target as keyof WeightBufferBD]!;
      const pointWeights: { [pointId: string]: number[] } = {};
      
      // Group weights by point ID
      Object.keys(targetBuffer).forEach(key => {
        const [pointId] = key.split(':');
        if (!pointWeights[pointId]) {
          pointWeights[pointId] = [];
        }
        pointWeights[pointId].push(targetBuffer[key]);
      });
      
      // Calculate average weight for each point
      Object.keys(pointWeights).forEach(pointId => {
        const weights = pointWeights[pointId];
        const avgWeight = weights.reduce((sum, w) => sum + w, 0) / weights.length;
        
        if (!pointsWeightBuffer[target as keyof WeightBufferBD]) {
          pointsWeightBuffer[target as keyof WeightBufferBD] = {};
        }
        pointsWeightBuffer[target as keyof WeightBufferBD]![pointId] = avgWeight;
        
        if (this.strict_status === Tin.STATUS_STRICT) {
          if (!pointsWeightBuffer.bakw) {
            pointsWeightBuffer.bakw = {};
          }
          pointsWeightBuffer.bakw[pointId] = 1 / avgWeight;
        }
      });
      
      // Calculate centroid weight
      let centroidSum = 0;
      for (let i = 0; i < 4; i++) {
        const key = `b${i}`;
        const weight = pointsWeightBuffer[target as keyof WeightBufferBD]![key] || 0;
        centroidSum += weight;
      }
      pointsWeightBuffer[target as keyof WeightBufferBD]!["c"] = centroidSum / 4;
      
      if (this.strict_status === Tin.STATUS_STRICT && pointsWeightBuffer.bakw) {
        pointsWeightBuffer.bakw["c"] = 1 / pointsWeightBuffer[target as keyof WeightBufferBD]!["c"];
      }
    });
    
    this.pointsWeightBuffer = pointsWeightBuffer;
  }
}