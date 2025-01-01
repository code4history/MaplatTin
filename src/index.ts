"use strict";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import centroidFunc from "@turf/centroid";
import convex from "@turf/convex";
import { featureCollection, lineString, point, polygon } from "@turf/helpers";

import lineIntersect from "@turf/line-intersect";
import { Feature, Point, Position } from "geojson";
import findIntersections from "./kinks";
import type { EdgeSet, EdgeSetLegacy } from "./edgeutils";

import constrainedTin from "./constrained-tin";
import { transformArr } from "./geometry";
import type { Tri, PropertyTriKey } from "./geometry";
import { rotateVerticesTriangle, counterTri } from "./triangulation";
import { createPoint, counterPoint, vertexCalc } from "./vertexutils";
import { normalizeEdges } from "./edgeutils";
import { insertSearchIndex } from "./searchutils";
import type { SearchIndex } from "./searchutils";
import { Transform, Compiled, format_version } from "./transform";
import type { 
  BiDirectionKey, VertexMode, StrictMode, YaxisMode, PointSet,
  WeightBufferBD
} from "./transform";

export interface Options {
  bounds: Position[];
  wh: number[];
  vertexMode: VertexMode;
  strictMode: StrictMode;
  yaxisMode: YaxisMode;
  importance: number;
  priority: number;
  stateFull: boolean;
  points: PointSet[];
  edges: EdgeSet[];
}

export default class Tin extends Transform {
  importance: number;
  priority: number;
  pointsSet: any;

  constructor(options: Partial<Options> = {} as Options) {
    super();
    if (options.bounds) {
      this.setBounds(options.bounds);
    } else {
      this.setWh(options.wh!);
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
  getFormatVersion() {
    return format_version;
  }
  setPoints(points: PointSet[]) {
    if (this.yaxisMode == Tin.YAXIS_FOLLOW) {
      points = points.map(point => [point[0], [point[1][0], -1 * point[1][1]]]);
    }
    this.points = points;
    this.tins = undefined;
    this.indexedTins = undefined;
  }
  setEdges(edges: EdgeSet[] | EdgeSetLegacy[] = []) {
    this.edges = normalizeEdges(edges);
    this.edgeNodes = undefined;
    this.tins = undefined;
    this.indexedTins = undefined;
  }
  setBounds(bounds: number[][]) {
    this.bounds = bounds;
    let minx = bounds[0][0];
    let maxx = minx;
    let miny = bounds[0][1];
    let maxy = miny;
    const coords = [bounds[0]];
    for (let i = 1; i < bounds.length; i++) {
      const xy = bounds[i];
      if (xy[0] < minx) minx = xy[0];
      if (xy[0] > maxx) maxx = xy[0];
      if (xy[1] < miny) miny = xy[1];
      if (xy[1] > maxy) maxy = xy[1];
      coords.push(xy);
    }
    coords.push(bounds[0]);
    this.boundsPolygon = polygon([coords]);
    this.xy = [minx, miny];
    this.wh = [maxx - minx, maxy - miny];
    this.vertexMode = Tin.VERTEX_PLAIN;
    this.tins = undefined;
    this.indexedTins = undefined;
  }

  getCompiled(): Compiled {
    const compiled: Partial<Compiled> = {};
    // 新compileロジック
    // Formatバージョン
    compiled.version = format_version;
    // points, weightBufferはそのまま保存
    compiled.points = this.points;
    compiled.weight_buffer = this.pointsWeightBuffer;
    // centroidは座標の対応のみ保存
    compiled.centroid_point = [
      this.centroid!.forw!.geometry!.coordinates,
      this.centroid!.forw!.properties!.target.geom
    ];
    // vertices_paramsの最初の値はそのまま保存
    compiled.vertices_params = [
      this.vertices_params!.forw![0],
      this.vertices_params!.bakw![0]
    ];
    // vertices_paramsの2番目の値（セントロイドと地図頂点の三角形ポリゴン）は、地図頂点座標のみ記録
    compiled.vertices_points = [];
    const vertices = this.vertices_params!.forw![1];
    [0, 1, 2, 3].map(i => {
      const vertex_data = vertices![i].features[0];
      const forw = vertex_data.geometry!.coordinates[0][1];
      const bakw = vertex_data.properties!.b.geom;
      compiled.vertices_points![i] = [forw, bakw];
    });
    compiled.strict_status = this.strict_status;
    // tinは座標インデックスのみ記録
    compiled.tins_points = [[]];
    this.tins!.forw!.features.map((tin: Tri) => {
      compiled.tins_points![0].push(
        (["a", "b", "c"] as PropertyTriKey[]).map(
          idx => tin.properties![idx]!.index
        )
      );
    });
    // 自動モードでエラーがある時（loose）は、逆方向のtinも記録。
    // 厳格モードでエラーがある時（strict_error）は、エラー点情報(kinks)を記録。
    if (this.strict_status == Tin.STATUS_LOOSE) {
      compiled.tins_points[1] = [];
      this.tins!.bakw!.features.map((tin: Tri) => {
        compiled.tins_points![1].push(
          (["a", "b", "c"] as PropertyTriKey[]).map(
            idx => tin.properties![idx]!.index
          )
        );
      });
    } else if (this.strict_status == Tin.STATUS_ERROR) {
      compiled.kinks_points = this.kinks!.bakw!.features.map(
        (kink: Feature<Point>) => kink.geometry!.coordinates
      );
    }
    // After 0.7.3: Freeze strict_mode & vertex_mode & Update yAxis logic
    compiled.yaxisMode = this.yaxisMode;
    compiled.vertexMode = this.vertexMode;
    compiled.strictMode = this.strictMode;
    // bounds対応
    if (this.bounds) {
      compiled.bounds = this.bounds;
      compiled.boundsPolygon = this.boundsPolygon;
      compiled.xy = this.xy;
      compiled.wh = this.wh;
    } else {
      compiled.wh = this.wh;
    }
    // edge対応
    compiled.edges = this.edges;
    compiled.edgeNodes = this.edgeNodes;
    return compiled as Compiled;
  }

  setWh(wh: number[]) {
    this.wh = wh;
    this.xy = [0, 0];
    this.bounds = undefined;
    this.boundsPolygon = undefined;
    this.tins = undefined;
    this.indexedTins = undefined;
  }
  setVertexMode(mode: VertexMode) {
    this.vertexMode = mode;
    this.tins = undefined;
    this.indexedTins = undefined;
  }
  setStrictMode(mode: StrictMode) {
    this.strictMode = mode;
    this.tins = undefined;
    this.indexedTins = undefined;
  }
  calcurateStrictTin() {
    const tris = this.tins!.forw!.features.map((tri: Tri) => counterTri(tri));
    this.tins!.bakw = featureCollection(tris);

    const searchIndex: SearchIndex = {};
    this.tins!.forw!.features.forEach((forTri: Tri, index: number) => {
      const bakTri: Tri = this.tins!.bakw!.features[index];
      insertSearchIndex(searchIndex, { forw: forTri, bakw: bakTri });
    });

    const result = (["forw", "bakw"] as BiDirectionKey[]).map(direc => {
      const coords = this.tins![direc]!.features.map(
        poly => poly.geometry!.coordinates[0]
      );
      return findIntersections(coords);
    });

    if (result[0].length == 0 && result[1].length == 0) {
      this.strict_status = Tin.STATUS_STRICT;
      delete this.kinks;
    } else {
      this.strict_status = Tin.STATUS_ERROR;
      this.kinks = {};
      if (result[0].length > 0)
        this.kinks.forw = featureCollection(result[0]);
      if (result[1].length > 0)
        this.kinks.bakw = featureCollection(result[1]);
    }
  }
  generatePointsSet() {
    const pointsArray = { forw: [] as any[], bakw: [] as any[] };
    for (let i = 0; i < this.points.length; i++) {
      const mapxy = this.points[i][0];
      const mercs = this.points[i][1];
      const forPoint = createPoint(mapxy, mercs, i);
      pointsArray.forw.push(forPoint as any);
      pointsArray.bakw.push(counterPoint(forPoint));
    }
    const edges = [];
    let edgeNodeIndex = 0;
    this.edgeNodes = [];
    if (!this.edges) this.edges = [];
    for (let i = 0; i < this.edges.length; i++) {
      const startEnd = this.edges[i][2];
      const illstNodes = Object.assign([], this.edges[i][0]);
      const mercNodes = Object.assign([], this.edges[i][1]);
      if (illstNodes.length === 0 && mercNodes.length === 0) {
        edges.push(startEnd);
        continue;
      }
      illstNodes.unshift(this.points[startEnd[0]][0]);
      illstNodes.push(this.points[startEnd[1]][0]);
      mercNodes.unshift(this.points[startEnd[0]][1]);
      mercNodes.push(this.points[startEnd[1]][1]);
      const lengths = [illstNodes, mercNodes].map(nodes => {
        const eachLengths = nodes.map((node: any, index: any, arr: any) => {
          if (index === 0) return 0;
          const prev = arr[index - 1];
          return Math.sqrt(
            Math.pow(node[0] - prev[0], 2) + Math.pow(node[1] - prev[1], 2)
          );
        });
        const sumLengths = eachLengths.reduce(
          (prev: any, node: any, index: any) => {
            if (index === 0) return [0];
            prev.push(prev[index - 1] + node);
            return prev;
          },
          []
        );
        return sumLengths.map((eachSum: any, index: any, arr: any) => {
          const ratio = eachSum / arr[arr.length - 1];
          return [nodes[index], eachLengths[index], sumLengths[index], ratio];
        });
      });
      lengths
        .map((thisLengths, i) => {
          const anotherLengths = lengths[i ? 0 : 1];
          return thisLengths
            .filter(
              (val: any, index: any) =>
                !(
                  index === 0 ||
                  index === thisLengths.length - 1 ||
                  val[4] === "handled"
                )
            )
            .map((lengthItem: any) => {
              const node = lengthItem[0];
              const ratio = lengthItem[3];
              const anotherSets = anotherLengths.reduce(
                (prev: any, item: any, index: any, arr: any) => {
                  if (prev) return prev;
                  const next = arr[index + 1];
                  if (item[3] === ratio) {
                    item[4] = "handled";
                    return [item];
                  }
                  if (item[3] < ratio && next[3] > ratio) return [item, next];
                  return;
                },
                undefined
              );
              if (anotherSets.length === 1) {
                return i === 0
                  ? [node, anotherSets[0][0], ratio]
                  : [anotherSets[0][0], node, ratio];
              } else {
                const anotherPrev = anotherSets[0];
                const anotherNext = anotherSets[1];
                const ratioDelta = ratio - anotherPrev[3];
                const ratioAnother = anotherNext[3] - anotherPrev[3];
                const ratioInEdge = ratioDelta / ratioAnother;
                const anotherNode = [
                  (anotherNext[0][0] - anotherPrev[0][0]) * ratioInEdge +
                    anotherPrev[0][0],
                  (anotherNext[0][1] - anotherPrev[0][1]) * ratioInEdge +
                    anotherPrev[0][1]
                ];
                return i === 0
                  ? [node, anotherNode, ratio]
                  : [anotherNode, node, ratio];
              }
            });
        })
        .reduce((prev, nodes) => prev.concat(nodes), [])
        .sort((a: any, b: any) => (a[2] < b[2] ? -1 : 1))
        .map((node: any, index: any, arr: any) => {
          this.edgeNodes![edgeNodeIndex] = [node[0], node[1]];
          const forPoint = createPoint(node[0], node[1], `e${edgeNodeIndex}`);
          edgeNodeIndex++;
          pointsArray.forw.push(forPoint);
          pointsArray.bakw.push(counterPoint(forPoint));
          if (index === 0) {
            edges.push([startEnd[0], pointsArray.forw.length - 1]);
          } else {
            edges.push([
              pointsArray.forw.length - 2,
              pointsArray.forw.length - 1
            ]);
          }
          if (index === arr.length - 1) {
            edges.push([pointsArray.forw.length - 1, startEnd[1]]);
          }
        });
    }
    return {
      forw: featureCollection(pointsArray.forw),
      bakw: featureCollection(pointsArray.bakw),
      edges
    };
  }

  /**
   * 入力データの検証と初期データの準備
   * - 境界値のチェック
   * - バッファー付き境界の計算
   * - 点群セットの生成
   * @returns {object} 検証済みの点群セットと境界データ
   * @throws {Error} "SOME POINTS OUTSIDE" 制御点が境界外にある場合
   */
  private validateAndPrepareInputs() {
    // バッファー付き境界の計算
    const minx = this.xy![0] - 0.05 * this.wh![0];
    const maxx = this.xy![0] + 1.05 * this.wh![0];
    const miny = this.xy![1] - 0.05 * this.wh![1];
    const maxy = this.xy![1] + 1.05 * this.wh![1];

    // 境界チェック
    const inside = this.points.reduce(
      (prev: boolean, curr: PointSet) => prev && (
        this.bounds
          ? booleanPointInPolygon(curr[0], this.boundsPolygon!)
          : (
            curr[0][0] >= minx &&
            curr[0][0] <= maxx &&
            curr[0][1] >= miny &&
            curr[0][1] <= maxy
          )
      ),
      true
    );

    if (!inside) {
      throw "SOME POINTS OUTSIDE";
    }

    // 境界ボックスの準備
    let bbox: number[][] = [];
    if (this.wh) {
      bbox = [
        [minx, miny],
        [maxx, miny],
        [minx, maxy],
        [maxx, maxy]
      ];
    }

    // 点群セットの生成
    const pointsSet = this.generatePointsSet();

    return { pointsSet, bbox, minx, maxx, miny, maxy };
  }

  updateTin() {
    let strict = this.strictMode;
    if (strict != Tin.MODE_STRICT && strict != Tin.MODE_LOOSE) {
      strict = Tin.MODE_AUTO;
    }
  
    const { pointsSet, bbox, minx, maxx, miny, maxy } = this.validateAndPrepareInputs();
  
    const tinForCentroid = constrainedTin(pointsSet.forw, pointsSet.edges, "target");
    const tinBakCentroid = constrainedTin(pointsSet.bakw, pointsSet.edges, "target");
    const forCentroidFt = centroidFunc(pointsSet.forw);

    if ( tinForCentroid.features.length == 0 || tinBakCentroid.features.length == 0 ) {
      throw "TOO LINEAR1";
    }

    // Convex Hull（凸包）の計算と変換
    const convexBuf: { [key: string]: { forw: Position; bakw: Position } } = {};

    // Forward方向の凸包計算
    const forConvex = (convex(pointsSet.forw)!.geometry).coordinates[0];
    let vconvex;
    try {
      // Forward方向の頂点の変換
      vconvex = forConvex.map((forw) => ({
        forw,
        bakw: transformArr(point(forw), tinForCentroid)
      }));
      vconvex.forEach(vertex => {
        convexBuf[`${vertex.forw[0]}:${vertex.forw[1]}`] = vertex;
      });
    } catch (_e) {
      throw "TOO LINEAR2";
    }

    // Backward方向の凸包計算
    const bakConvex = (convex(pointsSet.bakw)!.geometry).coordinates[0];
    try {
      // Backward方向の頂点の変換
      vconvex = bakConvex.map((bakw) => ({
        bakw,
        forw: transformArr(point(bakw), tinBakCentroid)
      }));
      vconvex.forEach(vertex => {
        convexBuf[`${vertex.forw[0]}:${vertex.forw[1]}`] = vertex;
      });
    } catch (_e) {
      throw "TOO LINEAR2";
    }

    // Calcurating Forward/Backward Centroid
    const centroid = {
      forw: forCentroidFt.geometry.coordinates,
      bakw: transformArr(forCentroidFt, tinForCentroid)
    };
    const forwBuf = createPoint(centroid.forw, centroid.bakw, "c");
    this.centroid = { forw: forwBuf, bakw: counterPoint(forwBuf) };

    // Calcurating Convex full to get Convex full polygon's vertices
    const expandConvex = Object.keys(convexBuf).reduce(
      (prev, key, _, _array) => {
        const forVertex = convexBuf[key].forw;
        const bakVertex = convexBuf[key].bakw;
        // Convexhullの各頂点に対し、重心からの差分を取る
        const vertexDelta = {
          forw: [
            forVertex[0] - centroid.forw[0],
            forVertex[1] - centroid.forw[1]
          ]
        };
        (vertexDelta as any).bakw = [
          bakVertex[0] - centroid.bakw[0],
          bakVertex[1] - centroid.bakw[1]
        ];
        // X軸方向、Y軸方向それぞれに対し、地図外郭XY座標との重心との比を取る
        const xRate =
          vertexDelta.forw[0] == 0
            ? Infinity
            : ((vertexDelta.forw[0] < 0 ? minx : maxx) - centroid.forw[0]) /
              vertexDelta.forw[0];
        const yRate =
          vertexDelta.forw[1] == 0
            ? Infinity
            : ((vertexDelta.forw[1] < 0 ? miny : maxy) - centroid.forw[1]) /
              vertexDelta.forw[1];
        // xRate, yRateが同じ値であれば重心と地図頂点を結ぶ線上に乗る
        if (Math.abs(xRate) / Math.abs(yRate) < 1.1) {
          const point = {
            forw: [
              vertexDelta.forw[0] * xRate + centroid.forw[0],
              vertexDelta.forw[1] * xRate + centroid.forw[1]
            ],
            bakw: [
              (vertexDelta as any).bakw[0] * xRate + centroid.bakw[0],
              (vertexDelta as any).bakw[1] * xRate + centroid.bakw[1]
            ]
          };
          if (vertexDelta.forw[0] < 0) (prev[3] as any[]).push(point);
          else (prev[1] as any[]).push(point);
        }
        if (Math.abs(yRate) / Math.abs(xRate) < 1.1) {
          const point = {
            forw: [
              vertexDelta.forw[0] * yRate + centroid.forw[0],
              vertexDelta.forw[1] * yRate + centroid.forw[1]
            ],
            bakw: [
              (vertexDelta as any).bakw[0] * yRate + centroid.bakw[0],
              (vertexDelta as any).bakw[1] * yRate + centroid.bakw[1]
            ]
          };
          if (vertexDelta.forw[1] < 0) (prev[0] as any[]).push(point);
          else (prev[2] as any[]).push(point);
        }
        return prev;
      },
      [[], [], [], []]
    );
    
    // Calcurating Average scaling factors and rotation factors per orthants
    let orthant = Object.keys(convexBuf)
      .reduce(
        (prev, key, idx, array) => {
          const forVertex = convexBuf[key].forw;
          const bakVertex = convexBuf[key].bakw;
          const vertexDelta = {
            forw: [
              forVertex[0] - centroid.forw[0],
              forVertex[1] - centroid.forw[1]
            ]
          };
          (vertexDelta as any).bakw = [
            bakVertex[0] - centroid.bakw[0],
            centroid.bakw[1] - bakVertex[1]
          ];
          if (vertexDelta.forw[0] == 0 || vertexDelta.forw[1] == 0)
            return prev;
          let index = 0;
          if (vertexDelta.forw[0] > 0) index += 1;
          if (vertexDelta.forw[1] > 0) index += 2;
          (prev[index] as any[]).push([
            vertexDelta.forw,
            (vertexDelta as any).bakw
          ]);
          if (idx == array.length - 1) {
            // If some orthants have no Convex full polygon's vertices, use same average factor to every orthants
            return prev.length ==
              prev.filter(val => val.length > 0).length &&
              this.vertexMode == Tin.VERTEX_BIRDEYE
              ? prev
              : prev.reduce((pre, cur) => [pre[0].concat(cur)], [[]]);
          }
          return prev;
        },
        [[], [], [], []]
      )
      .map(item =>
        // Finalize calcuration of Average scaling factors and rotation factors
        item.reduce(
          (prev: number[] | null, curr: any, index: number, arr: any[]) => {
            if (!prev) prev = [Infinity, 0, 0];
            // if (!prev) prev = [0, 0, 0];
            // var distanceSum = prev[0] + Math.sqrt(Math.pow(curr[0][0], 2) + Math.pow(curr[0][1], 2)) /
            //     Math.sqrt(Math.pow(curr[1][0], 2) + Math.pow(curr[1][1], 2));
            let distanceSum =
              Math.sqrt(Math.pow(curr[0][0], 2) + Math.pow(curr[0][1], 2)) /
              Math.sqrt(Math.pow(curr[1][0], 2) + Math.pow(curr[1][1], 2));
            distanceSum = distanceSum < prev[0] ? distanceSum : prev[0];
            const thetaDelta =
              Math.atan2(curr[0][0], curr[0][1]) -
              Math.atan2(curr[1][0], curr[1][1]);
            const sumThetaX = prev[1] + Math.cos(thetaDelta);
            const sumThetaY = prev[2] + Math.sin(thetaDelta);
            if (index == arr.length - 1) {
              // return [distanceSum / arr.length, Math.atan2(sumThetaY, sumThetaX)];
              return [distanceSum, Math.atan2(sumThetaY, sumThetaX)];
            }
            return [distanceSum, sumThetaX, sumThetaY];
          },
          null
        )
      );
    // "Using same average factor to every orthants" case
    if (orthant.length == 1)
      orthant = [orthant[0], orthant[0], orthant[0], orthant[0]];

    // Calcurating Backward Bounding box of map
    let verticesSet = orthant.map((delta, index) => {
      const forVertex = bbox[index];
      const forDelta = [
        forVertex[0] - centroid.forw[0],
        forVertex[1] - centroid.forw[1]
      ];
      const forDistance = Math.sqrt(
        Math.pow(forDelta[0], 2) + Math.pow(forDelta[1], 2)
      );
      const bakDistance = forDistance / delta![0];
      const forTheta = Math.atan2(forDelta[0], forDelta[1]);
      const bakTheta = forTheta - delta![1];
      const bakVertex = [
        centroid.bakw[0] + bakDistance * Math.sin(bakTheta),
        centroid.bakw[1] - bakDistance * Math.cos(bakTheta)
      ];
      return { forw: forVertex, bakw: bakVertex };
    });

    const swap = verticesSet[2];
    verticesSet[2] = verticesSet[3];
    verticesSet[3] = swap;
    // Bounding Boxの頂点を、全てのgcpが内部に入るように引き延ばす
    const expandRate = [1, 1, 1, 1];
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4;
      const side = lineString([verticesSet[i].bakw, verticesSet[j].bakw]);
      const expands = expandConvex[i];
      expands.map((expand: any) => {
        const expandLine = lineString([centroid.bakw, expand.bakw]);
        const intersect = lineIntersect(side, expandLine);
        if (
          intersect.features.length > 0 &&
          intersect.features[0].geometry
        ) {
          const intersect_ = intersect.features[0];
          const expandDist = Math.sqrt(
            Math.pow(expand.bakw[0] - centroid.bakw[0], 2) +
              Math.pow(expand.bakw[1] - centroid.bakw[1], 2)
          );
          const onSideDist = Math.sqrt(
            Math.pow(
              (intersect_.geometry as any).coordinates[0] -
                centroid.bakw[0],
              2
            ) +
              Math.pow(
                (intersect_.geometry as any).coordinates[1] -
                  centroid.bakw[1],
                2
              )
          );
          const rate = expandDist / onSideDist;
          if (rate > expandRate[i]) expandRate[i] = rate;
          if (rate > expandRate[j]) expandRate[j] = rate;
        }
      });
    }
    verticesSet = verticesSet.map((vertex, index) => {
      const rate = expandRate[index];
      const point = [
        (vertex.bakw[0] - centroid.bakw[0]) * rate + centroid.bakw[0],
        (vertex.bakw[1] - centroid.bakw[1]) * rate + centroid.bakw[1]
      ];
      return { forw: vertex.forw, bakw: point };
    });

    const verticesList = { forw: [] as any[], bakw: [] as any[] };
    for (let i = 0; i < verticesSet.length; i++) {
      const forVertex = verticesSet[i].forw;
      const bakVertex = verticesSet[i].bakw;
      const forVertexFt = createPoint(forVertex, bakVertex, `b${i}`);
      const bakVertexFt = counterPoint(forVertexFt);
      pointsSet.forw.features.push(forVertexFt);
      pointsSet.bakw.features.push(bakVertexFt);
      verticesList.forw.push(forVertexFt);
      verticesList.bakw.push(bakVertexFt);
    }
    (this as any).pointsSet = pointsSet;
    this.tins = {
      forw: rotateVerticesTriangle(
        constrainedTin(pointsSet.forw, pointsSet.edges, "target")
      )
    };

    if (strict == Tin.MODE_STRICT || strict == Tin.MODE_AUTO) {
      this.calcurateStrictTin();
    }

    if (
      strict == Tin.MODE_LOOSE ||
      (strict == Tin.MODE_AUTO &&
        this.strict_status == Tin.STATUS_ERROR)
    ) {
      this.tins!.bakw = rotateVerticesTriangle(
        constrainedTin(pointsSet.bakw, pointsSet.edges, "target")
      );
      delete this.kinks;
      this.strict_status = Tin.STATUS_LOOSE;
    }
    this.vertices_params = {
      forw: vertexCalc(verticesList.forw, this.centroid!.forw) as any,
      bakw: vertexCalc(verticesList.bakw, this.centroid!.bakw) as any
    };
    this.addIndexedTin();
    this.calculatePointsWeight();
  }

  calculatePointsWeight() {
    const calcTargets: BiDirectionKey[] = ["forw"];
    if (this.strict_status == Tin.STATUS_LOOSE) calcTargets.push("bakw");
    const weightBuffer: any = {}; // Type of this is not WeightBufferBD

    calcTargets.forEach(target => {
      weightBuffer[target] = {};
      const alreadyChecked: any = {};
      const tin = this.tins![target];
      tin!.features.map((tri: Tri) => {
        const vtxes = ["a", "b", "c"] as PropertyTriKey[];
        for (let i = 0; i < 3; i++) {
          const j = (i + 1) % 3;
          const vi = vtxes[i];
          const vj = vtxes[j];
          const indexi = tri.properties![vi].index;
          const indexj = tri.properties![vj].index;
          const key = [indexi, indexj].sort().join("-");
          if (!alreadyChecked[key]) {
            const fromi = tri.geometry!.coordinates[0][i];
            const fromj = tri.geometry!.coordinates[0][j];
            const toi = tri.properties![vi].geom;
            const toj = tri.properties![vj].geom;
            alreadyChecked[key] = 1;
            const weight =
              Math.sqrt(
                Math.pow(toi[0] - toj[0], 2) +
                  Math.pow(toi[1] - toj[1], 2)
              ) /
              Math.sqrt(
                Math.pow(fromi[0] - fromj[0], 2) +
                  Math.pow(fromi[1] - fromj[1], 2)
              );
            if (!weightBuffer[target]![indexi])
              weightBuffer[target][indexi] = {};
            if (!weightBuffer[target]![indexj])
              weightBuffer[target][indexj] = {};
            weightBuffer[target]![indexi][key] = weight;
            weightBuffer[target]![indexj][key] = weight;
          }
        }
      })
    });

    const pointsWeightBuffer: WeightBufferBD = {};
    calcTargets.map(target => {
      pointsWeightBuffer[target] = {};
      if (this.strict_status == Tin.STATUS_STRICT)
        pointsWeightBuffer["bakw"] = {};
      Object.keys(weightBuffer[target]).map(vtx => {
        pointsWeightBuffer[target]![vtx] = Object.keys(
          weightBuffer[target][vtx]
        ).reduce((prev, key, idx, arr) => {
          prev = prev + weightBuffer[target][vtx][key];
          return idx == arr.length - 1 ? prev / arr.length : prev;
        }, 0);
        if (this.strict_status == Tin.STATUS_STRICT)
          pointsWeightBuffer["bakw"]![vtx] =
            1 / pointsWeightBuffer[target]![vtx];
      });
      pointsWeightBuffer[target]!["c"] = [0, 1, 2, 3].reduce(
        (prev, curr) => {
          const key = `b${curr}`;
          prev = prev + pointsWeightBuffer[target]![key];
          return curr == 3 ? prev / 4 : prev;
        },
        0
      );
      if (this.strict_status == Tin.STATUS_STRICT)
        pointsWeightBuffer["bakw"]!["c"] =
          1 / pointsWeightBuffer[target]!["c"];
    });
    this.pointsWeightBuffer = pointsWeightBuffer;
  }
}

// @ts-ignore
if (typeof window !== 'undefined') {
  // ブラウザ環境
  (window as any).Tin = Tin;
} else if (typeof global !== 'undefined') {
  // Node環境
  (global as any).Tin = Tin;
}
