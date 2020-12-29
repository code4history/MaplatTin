"use strict";

import { polygon, featureCollection, point, lineString } from "@turf/helpers";
import union from "@turf/union";
import convex from "@turf/convex";
import difference from "@turf/difference";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import centroid from "@turf/centroid";
import lineIntersect from "@turf/line-intersect";
import intersect from "@turf/intersect";
import { getCoords } from "@turf/invariant";

import internal from "./mapshaper-maplat";
import constrainedTin from "./constrained-tin";

class Tin {
  constructor(options) {
    options = options || {};
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
    this.stateFull = options.stateFull;
    if (options.points) {
      this.setPoints(options.points);
    }
    if (options.edges) {
      this.setEdges(options.edges);
    }
  }

  setPoints(points) {
    if (this.yaxisMode == Tin.YAXIS_FOLLOW) {
      points = points.map(point => {
        [point[0], [point[1][0], -1 * point[1][1]]];
      });
    }
    this.points = points;
    this.tins = undefined;
    this.indexedTins = undefined;
  }

  setEdges(edges) {
    if (!edges) edges = [];
    this.edges = edges;
    this.edgeNodes = undefined;
    this.tins = undefined;
    this.indexedTins = undefined;
  }

  setBounds(bounds) {
    this.bounds = bounds;
    let minx, miny, maxx, maxy, coords;
    for (let i = 0; i < bounds.length; i++) {
      const xy = bounds[i];
      if (i == 0) {
        minx = maxx = xy[0];
        miny = maxy = xy[1];
        coords = [xy];
      } else {
        if (xy[0] < minx) minx = xy[0];
        if (xy[0] > maxx) maxx = xy[0];
        if (xy[1] < miny) miny = xy[1];
        if (xy[1] > maxy) maxy = xy[1];
        coords.push(xy);
      }
    }
    coords.push(bounds[0]);
    this.boundsPolygon = polygon([coords]);
    this.xy = [minx, miny];
    this.wh = [maxx - minx, maxy - miny];
    this.vertexMode = Tin.VERTEX_PLAIN;
    this.tins = undefined;
    this.indexedTins = undefined;
  }

  setCompiled(compiled) {
    if (!compiled.tins && compiled.points && compiled.tins_points) {
      // 新コンパイルロジック
      // pointsはそのままpoints, weightBufferも
      this.points = compiled.points;
      this.pointsWeightBuffer = compiled.weight_buffer;
      // kinksやtinsの存在状況でstrict_statusを判定
      if (compiled.strict_status) {
        this.strict_status = compiled.strict_status;
      } else if (compiled.kinks_points) {
        this.strict_status = Tin.STATUS_ERROR;
      } else if (compiled.tins_points.length == 2) {
        this.strict_status = Tin.STATUS_LOOSE;
      } else {
        this.strict_status = Tin.STATUS_STRICT;
      }
      // vertices_paramsを復元
      this.vertices_params = {
        forw: [compiled.vertices_params[0]],
        bakw: [compiled.vertices_params[1]]
      };
      this.vertices_params.forw[1] = [0, 1, 2, 3].map(idx => {
        const idxNxt = (idx + 1) % 4;
        const tri = indexesToTri(
          ["cent", `bbox${idx}`, `bbox${idxNxt}`],
          compiled.points,
          compiled.edgeNodes || [],
          compiled.centroid_point,
          compiled.vertices_points,
          false
        );
        return featureCollection([tri]);
      });
      this.vertices_params.bakw[1] = [0, 1, 2, 3].map(idx => {
        const idxNxt = (idx + 1) % 4;
        const tri = indexesToTri(
          ["cent", `bbox${idx}`, `bbox${idxNxt}`],
          compiled.points,
          compiled.edgeNodes || [],
          compiled.centroid_point,
          compiled.vertices_points,
          true
        );
        return featureCollection([tri]);
      });
      // centroidを復元
      this.centroid = {
        forw: point(compiled.centroid_point[0], {
          target: {
            geom: compiled.centroid_point[1],
            index: "cent"
          }
        }),
        bakw: point(compiled.centroid_point[1], {
          target: {
            geom: compiled.centroid_point[0],
            index: "cent"
          }
        })
      };
      // edgesを復元
      this.edges = compiled.edges || [];
      this.edgeNodes = compiled.edgeNodes || [];
      // tinsを復元
      const bakwI = compiled.tins_points.length == 1 ? 0 : 1;
      this.tins = {
        forw: featureCollection(
          compiled.tins_points[0].map(idxes =>
            indexesToTri(
              idxes,
              compiled.points,
              compiled.edgeNodes || [],
              compiled.centroid_point,
              compiled.vertices_points,
              false
            )
          )
        ),
        bakw: featureCollection(
          compiled.tins_points[bakwI].map(idxes =>
            indexesToTri(
              idxes,
              compiled.points,
              compiled.edgeNodes || [],
              compiled.centroid_point,
              compiled.vertices_points,
              true
            )
          )
        )
      };
      this.addIndexedTin();
      // kinksを復元
      if (compiled.kinks_points) {
        this.kinks = {
          bakw: featureCollection(
            compiled.kinks_points.map(coord => point(coord))
          )
        };
      }
      // yaxisModeを復元
      if (compiled.yaxisMode) {
        this.yaxisMode = compiled.yaxisMode;
      } else {
        this.yaxisMode = Tin.YAXIS_INVERT;
      }
      // boundsを復元
      if (compiled.bounds) {
        this.bounds = compiled.bounds;
        this.boundsPolygon = compiled.boundsPolygon;
        this.xy = compiled.xy;
        this.wh = compiled.wh;
      } else {
        this.xy = [0, 0];
        if (compiled.xy) this.wh = compiled.wh;
        this.bounds = undefined;
        this.boundsPolygon = undefined;
      }
    } else {
      // 旧コンパイルロジック
      this.tins = compiled.tins;
      this.addIndexedTin();
      this.strict_status = compiled.strict_status;
      this.pointsWeightBuffer = compiled.weight_buffer;
      this.vertices_params = compiled.vertices_params;
      this.centroid = compiled.centroid;
      this.kinks = compiled.kinks;
      const points = [];
      for (let i = 0; i < this.tins.forw.features.length; i++) {
        const tri = this.tins.forw.features[i];
        ["a", "b", "c"].map((key, idx) => {
          const forw = tri.geometry.coordinates[0][idx];
          const bakw = tri.properties[key].geom;
          const pIdx = tri.properties[key].index;
          points[pIdx] = [forw, bakw];
        });
      }
      this.points = points;
    }

    // 翻訳したオブジェクトを返す
    return {
      tins: this.tins,
      strict_status: this.strict_status,
      weight_buffer: this.pointsWeightBuffer,
      vertices_params: this.vertices_params,
      centroid: this.centroid,
      kinks: this.kinks
    };
  }

  getCompiled() {
    const compiled = {};
    /* old logic
        compiled.tins = this.tins;
        compiled.strict_status = this.strict_status;
        compiled.weight_buffer = this.pointsWeightBuffer;
        compiled.vertices_params = this.vertices_params;
        compiled.centroid = this.centroid;
        compiled.kinks = this.kinks;*/

    // 新compileロジック
    // points, weightBufferはそのまま保存
    compiled.points = this.points;
    compiled.weight_buffer = this.pointsWeightBuffer;
    // centroidは座標の対応のみ保存
    compiled.centroid_point = [
      this.centroid.forw.geometry.coordinates,
      this.centroid.forw.properties.target.geom
    ];
    // vertices_paramsの最初の値はそのまま保存
    compiled.vertices_params = [
      this.vertices_params.forw[0],
      this.vertices_params.bakw[0]
    ];
    // vertices_paramsの2番目の値（セントロイドと地図頂点の三角形ポリゴン）は、地図頂点座標のみ記録
    compiled.vertices_points = [];
    const vertices = this.vertices_params.forw[1];
    [0, 1, 2, 3].map(i => {
      const vertex_data = vertices[i].features[0];
      const forw = vertex_data.geometry.coordinates[0][1];
      const bakw = vertex_data.properties.b.geom;
      compiled.vertices_points[i] = [forw, bakw];
    });
    compiled.strict_status = this.strict_status;
    // tinは座標インデックスのみ記録
    compiled.tins_points = [[]];
    this.tins.forw.features.map(tin => {
      compiled.tins_points[0].push(
        ["a", "b", "c"].map(idx => tin.properties[idx].index)
      );
    });
    // 自動モードでエラーがある時（loose）は、逆方向のtinも記録。
    // 厳格モードでエラーがある時（strict_error）は、エラー点情報(kinks)を記録。
    if (this.strict_status == Tin.STATUS_LOOSE) {
      compiled.tins_points[1] = [];
      this.tins.bakw.features.map(tin => {
        compiled.tins_points[1].push(
          ["a", "b", "c"].map(idx => tin.properties[idx].index)
        );
      });
    } else if (this.strict_status == Tin.STATUS_ERROR) {
      compiled.kinks_points = this.kinks.bakw.features.map(
        kink => kink.geometry.coordinates
      );
    }

    // yaxisMode対応
    if (this.yaxisMode == Tin.YAXIS_FOLLOW) {
      compiled.yaxisMode = Tin.YAXIS_FOLLOW;
    }
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
    return compiled;
  }

  addIndexedTin() {
    const tins = this.tins;
    const forw = tins.forw;
    const bakw = tins.bakw;
    const gridNum = Math.ceil(Math.sqrt(forw.features.length));
    if (gridNum < 3) {
      this.indexedTins = undefined;
      return;
    }
    let forwBound = null;
    let bakwBound = null;
    const forwEachBound = forw.features.map(tri => {
      let eachBound = null;
      getCoords(tri)[0].map(point => {
        if (forwBound == null)
          forwBound = [Array.from(point), Array.from(point)];
        else {
          if (point[0] < forwBound[0][0]) forwBound[0][0] = point[0];
          if (point[0] > forwBound[1][0]) forwBound[1][0] = point[0];
          if (point[1] < forwBound[0][1]) forwBound[0][1] = point[1];
          if (point[1] > forwBound[1][1]) forwBound[1][1] = point[1];
        }
        if (eachBound == null)
          eachBound = [Array.from(point), Array.from(point)];
        else {
          if (point[0] < eachBound[0][0]) eachBound[0][0] = point[0];
          if (point[0] > eachBound[1][0]) eachBound[1][0] = point[0];
          if (point[1] < eachBound[0][1]) eachBound[0][1] = point[1];
          if (point[1] > eachBound[1][1]) eachBound[1][1] = point[1];
        }
      });
      return eachBound;
    });
    const forwXUnit = (forwBound[1][0] - forwBound[0][0]) / gridNum;
    const forwYUnit = (forwBound[1][1] - forwBound[0][1]) / gridNum;
    const forwGridCache = forwEachBound.reduce((prev, bound, index) => {
      const normXMin = unitCalc(
        bound[0][0],
        forwBound[0][0],
        forwXUnit,
        gridNum
      );
      const normXMax = unitCalc(
        bound[1][0],
        forwBound[0][0],
        forwXUnit,
        gridNum
      );
      const normYMin = unitCalc(
        bound[0][1],
        forwBound[0][1],
        forwYUnit,
        gridNum
      );
      const normYMax = unitCalc(
        bound[1][1],
        forwBound[0][1],
        forwYUnit,
        gridNum
      );
      for (let cx = normXMin; cx <= normXMax; cx++) {
        if (!prev[cx]) prev[cx] = [];
        for (let cy = normYMin; cy <= normYMax; cy++) {
          if (!prev[cx][cy]) prev[cx][cy] = [];
          prev[cx][cy].push(index);
        }
      }
      return prev;
    }, []);
    const bakwEachBound = bakw.features.map(tri => {
      let eachBound = null;
      getCoords(tri)[0].map(point => {
        if (bakwBound == null)
          bakwBound = [Array.from(point), Array.from(point)];
        else {
          if (point[0] < bakwBound[0][0]) bakwBound[0][0] = point[0];
          if (point[0] > bakwBound[1][0]) bakwBound[1][0] = point[0];
          if (point[1] < bakwBound[0][1]) bakwBound[0][1] = point[1];
          if (point[1] > bakwBound[1][1]) bakwBound[1][1] = point[1];
        }
        if (eachBound == null)
          eachBound = [Array.from(point), Array.from(point)];
        else {
          if (point[0] < eachBound[0][0]) eachBound[0][0] = point[0];
          if (point[0] > eachBound[1][0]) eachBound[1][0] = point[0];
          if (point[1] < eachBound[0][1]) eachBound[0][1] = point[1];
          if (point[1] > eachBound[1][1]) eachBound[1][1] = point[1];
        }
      });
      return eachBound;
    });
    const bakwXUnit = (bakwBound[1][0] - bakwBound[0][0]) / gridNum;
    const bakwYUnit = (bakwBound[1][1] - bakwBound[0][1]) / gridNum;
    const bakwGridCache = bakwEachBound.reduce((prev, bound, index) => {
      const normXMin = unitCalc(
        bound[0][0],
        bakwBound[0][0],
        bakwXUnit,
        gridNum
      );
      const normXMax = unitCalc(
        bound[1][0],
        bakwBound[0][0],
        bakwXUnit,
        gridNum
      );
      const normYMin = unitCalc(
        bound[0][1],
        bakwBound[0][1],
        bakwYUnit,
        gridNum
      );
      const normYMax = unitCalc(
        bound[1][1],
        bakwBound[0][1],
        bakwYUnit,
        gridNum
      );
      for (let cx = normXMin; cx <= normXMax; cx++) {
        if (!prev[cx]) prev[cx] = [];
        for (let cy = normYMin; cy <= normYMax; cy++) {
          if (!prev[cx][cy]) prev[cx][cy] = [];
          prev[cx][cy].push(index);
        }
      }
      return prev;
    }, []);

    this.indexedTins = {
      forw: {
        gridNum,
        xOrigin: forwBound[0][0],
        yOrigin: forwBound[0][1],
        xUnit: forwXUnit,
        yUnit: forwYUnit,
        gridCache: forwGridCache
      },
      bakw: {
        gridNum,
        xOrigin: bakwBound[0][0],
        yOrigin: bakwBound[0][1],
        xUnit: bakwXUnit,
        yUnit: bakwYUnit,
        gridCache: bakwGridCache
      }
    };
  }

  setWh(wh) {
    this.wh = wh;
    this.xy = [0, 0];
    this.bounds = undefined;
    this.boundsPolygon = undefined;
    this.tins = undefined;
    this.indexedTins = undefined;
  }

  setVertexMode(mode) {
    this.vertexMode = mode;
    this.tins = undefined;
    this.indexedTins = undefined;
  }

  setStrictMode(mode) {
    this.strictMode = mode;
    this.tins = undefined;
    this.indexedTins = undefined;
  }

  calcurateStrictTinAsync() {
    const self = this;
    const edges = self.pointsSet.edges;
    return Promise.all(
      self.tins.forw.features.map(tri => Promise.resolve(counterTri(tri)))
    )
      .then(tris => {
        self.tins.bakw = featureCollection(tris);
      })
      .then(() => {
        const searchIndex = {};
        return Promise.all(
          self.tins.forw.features.map((forTri, index) => {
            const bakTri = self.tins.bakw.features[index];
            return Promise.resolve(
              insertSearchIndex(searchIndex, { forw: forTri, bakw: bakTri })
            );
          })
        )
          .then(() => searchIndex)
          .catch(err => {
            throw err;
          });
      })
      .then(searchIndex => [overlapCheckAsync(searchIndex), searchIndex])
      .then(prevResult => {
        const overlapped = prevResult[0];
        const searchIndex = prevResult[1];
        if (overlapped.bakw)
          Object.keys(overlapped.bakw).map(key => {
            if (overlapped.bakw[key] == "Not include case") return;
            const trises = searchIndex[key];
            const forUnion = union(trises[0].forw, trises[1].forw);
            const forConvex = convex(
              featureCollection([trises[0].forw, trises[1].forw])
            );
            const forDiff = difference(forConvex, forUnion);
            if (forDiff) return;
            const splittedKey = key.split("-");
            if (
              splittedKey[0].match(/^[0-9]+$/) &&
              splittedKey[1].match(/^[0-9]+$/)
            ) {
              const numberKey = splittedKey
                .map(key => parseInt(key))
                .sort((a, b) => (a < b ? -1 : 1));
              for (let i = 0; i < edges.length - 1; i++) {
                if (numberKey[0] == edges[i][0] && numberKey[1] == edges[i][1])
                  return;
              }
            }
            const sharedVtx = splittedKey.map(
              val =>
                ["a", "b", "c"]
                  .map((alpha, index) => {
                    const prop = trises[0].bakw.properties[alpha];
                    const geom = trises[0].bakw.geometry.coordinates[0][index];
                    return { geom, prop };
                  })
                  .filter(vtx => vtx.prop.index == val)[0]
            );
            const nonSharedVtx = trises.map(
              tris =>
                ["a", "b", "c"]
                  .map((alpha, index) => {
                    const prop = tris.bakw.properties[alpha];
                    const geom = tris.bakw.geometry.coordinates[0][index];
                    return { geom, prop };
                  })
                  .filter(
                    vtx =>
                      vtx.prop.index != sharedVtx[0].prop.index &&
                      vtx.prop.index != sharedVtx[1].prop.index
                  )[0]
            );
            removeSearchIndex(searchIndex, trises[0], self.tins);
            removeSearchIndex(searchIndex, trises[1], self.tins);
            sharedVtx.map(sVtx => {
              const newTriCoords = [
                sVtx.geom,
                nonSharedVtx[0].geom,
                nonSharedVtx[1].geom,
                sVtx.geom
              ];
              const newTriProp = {
                a: sVtx.prop,
                b: nonSharedVtx[0].prop,
                c: nonSharedVtx[1].prop
              };
              const newBakTri = polygon([newTriCoords], newTriProp);
              const newForTri = counterTri(newBakTri);
              insertSearchIndex(
                searchIndex,
                { forw: newForTri, bakw: newBakTri },
                self.tins
              );
            });
          });

        return Promise.all(
          ["forw", "bakw"].map(direc =>
            new Promise(resolve => {
              const coords = self.tins[direc].features.map(
                poly => poly.geometry.coordinates[0]
              );
              const xy = findIntersections(coords);
              const retXy = internal
                .dedupIntersections(xy)
                .reduce((prev, apoint, index, array) => {
                  if (!prev) prev = {};
                  prev[`${apoint.x}:${apoint.y}`] = apoint;
                  if (index != array.length - 1) return prev;
                  return Object.keys(prev).map(key =>
                    point([prev[key].x, prev[key].y])
                  );
                }, []);
              resolve(retXy);
            }).catch(err => {
              throw err;
            })
          )
        )
          .then(result => {
            if (result[0].length == 0 && result[1].length == 0) {
              self.strict_status = Tin.STATUS_STRICT;
              delete self.kinks;
            } else {
              self.strict_status = Tin.STATUS_ERROR;
              self.kinks = {};
              if (result[0].length > 0)
                self.kinks.forw = featureCollection(result[0]);
              if (result[1].length > 0)
                self.kinks.bakw = featureCollection(result[1]);
            }
          })
          .catch(err => {
            throw err;
          });
      })
      .catch(err => {
        throw err;
      });
  }

  generatePointsSet() {
    const self = this;
    const pointsArray = { forw: [], bakw: [] };
    for (let i = 0; i < self.points.length; i++) {
      const mapxy = self.points[i][0];
      const mercs = self.points[i][1];
      const forPoint = createPoint(mapxy, mercs, i);
      pointsArray.forw.push(forPoint);
      pointsArray.bakw.push(counterPoint(forPoint));
    }
    const edges = [];
    let edgeNodeIndex = 0;
    self.edgeNodes = [];
    if (!self.edges) self.edges = [];
    for (let i = 0; i < self.edges.length; i++) {
      const startEnd = self.edges[i].startEnd;
      const illstNodes = Object.assign([], self.edges[i].illstNodes);
      const mercNodes = Object.assign([], self.edges[i].mercNodes);
      if (illstNodes.length === 0 && mercNodes.length === 0) {
        edges.push(startEnd);
        continue;
      }
      illstNodes.unshift(self.points[startEnd[0]][0]);
      illstNodes.push(self.points[startEnd[1]][0]);
      mercNodes.unshift(self.points[startEnd[0]][1]);
      mercNodes.push(self.points[startEnd[1]][1]);
      const lengths = [illstNodes, mercNodes].map(nodes => {
        const eachLengths = nodes.map((node, index, arr) => {
          if (index === 0) return 0;
          const prev = arr[index - 1];
          return Math.sqrt(
            Math.pow(node[0] - prev[0], 2) + Math.pow(node[1] - prev[1], 2)
          );
        });
        const sumLengths = eachLengths.reduce((prev, node, index) => {
          if (index === 0) return [0];
          prev.push(prev[index - 1] + node);
          return prev;
        }, []);
        return sumLengths.map((eachSum, index, arr) => {
          const ratio = eachSum / arr[arr.length - 1];
          return [nodes[index], eachLengths[index], sumLengths[index], ratio];
        });
      });
      lengths
        .map((thisLengths, i) => {
          const anotherLengths = lengths[i ? 0 : 1];
          return thisLengths
            .filter((val, index) =>
              index === 0 ||
                index === thisLengths.length - 1 ||
                val[4] === "handled"
                ? false
                : true
            )
            .map(lengthItem => {
              const node = lengthItem[0];
              const ratio = lengthItem[3];
              const anotherSets = anotherLengths.reduce(
                (prev, item, index, arr) => {
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
        .sort((a, b) => (a[2] < b[2] ? -1 : 1))
        .map((node, index, arr) => {
          self.edgeNodes[edgeNodeIndex] = [node[0], node[1]];
          const forPoint = createPoint(
            node[0],
            node[1],
            `edgeNode${edgeNodeIndex}`
          );
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

  updateTinAsync() {
    const self = this;
    let strict = this.strictMode;
    const minx = self.xy[0] - 0.05 * self.wh[0];
    const maxx = self.xy[0] + 1.05 * self.wh[0];
    const miny = self.xy[1] - 0.05 * self.wh[1];
    const maxy = self.xy[1] + 1.05 * self.wh[1];

    const insideCheck = this.bounds
      ? xy => booleanPointInPolygon(xy, self.boundsPolygon)
      : xy =>
        xy[0] >= self.xy[0] &&
        xy[0] <= self.xy[0] + self.wh[0] &&
        xy[1] >= self.xy[1] &&
        xy[1] <= self.xy[1] + self.wh[1];
    const inside = this.points.reduce(
      (prev, curr) => prev && insideCheck(curr[0]),
      true
    );
    if (!inside) {
      return new Promise((resolve, reject) => {
        reject("SOME POINTS OUTSIDE");
      });
    }

    return new Promise(resolve => {
      if (strict != Tin.MODE_STRICT && strict != Tin.MODE_LOOSE)
        strict = Tin.MODE_AUTO;

      let bbox = [];
      if (self.wh) {
        bbox = [
          [minx, miny],
          [maxx, miny],
          [minx, maxy],
          [maxx, maxy]
        ];
      }
      const pointsSet = self.generatePointsSet();
      resolve([pointsSet, bbox]);
    })
      .then(prevResults => {
        const pointsSet = prevResults[0];

        // Forward TIN for calcurating Backward Centroid and Backward Vertices
        return Promise.all([
          new Promise(resolve => {
            resolve(constrainedTin(pointsSet.forw, pointsSet.edges, "target"));
          }),
          new Promise(resolve => {
            resolve(constrainedTin(pointsSet.bakw, pointsSet.edges, "target"));
          }),
          new Promise(resolve => {
            resolve(centroid(pointsSet.forw));
          }),
          Promise.resolve(prevResults)
        ]).catch(err => {
          throw err;
        });
      })
      .then(prevResults => {
        const tinForCentroid = prevResults[0];
        const tinBakCentroid = prevResults[1];
        const forCentroidFt = prevResults[2];
        const pointsSetBbox = prevResults[3];
        const pointsSet = pointsSetBbox[0];
        if (
          tinForCentroid.features.length == 0 ||
          tinBakCentroid.features.length == 0
        )
          throw "TOO LINEAR1";

        // Calcurating Forward/Backward Centroid
        const centroid = { forw: forCentroidFt.geometry.coordinates };
        centroid.bakw = transformArr(forCentroidFt, tinForCentroid);
        self.centroid = {
          forw: createPoint(centroid.forw, centroid.bakw, "cent")
        };
        self.centroid.bakw = counterPoint(self.centroid.forw);

        const convexBuf = {};
        return Promise.all([
          new Promise(resolve => {
            const forConvex = convex(pointsSet.forw).geometry.coordinates[0];
            let vconvex;
            try {
              vconvex = forConvex.map(forw => ({
                forw,
                bakw: transformArr(point(forw), tinForCentroid)
              }));
            } catch (e) {
              throw "TOO LINEAR2";
            }
            vconvex.map(vertex => {
              convexBuf[`${vertex.forw[0]}:${vertex.forw[1]}`] = vertex;
            });
            resolve();
          }),
          new Promise(resolve => {
            const bakConvex = convex(pointsSet.bakw).geometry.coordinates[0];
            let vconvex;
            try {
              vconvex = bakConvex.map(bakw => ({
                bakw,
                forw: transformArr(point(bakw), tinBakCentroid)
              }));
            } catch (e) {
              throw "TOO LINEAR2";
            }
            vconvex.map(vertex => {
              convexBuf[`${vertex.forw[0]}:${vertex.forw[1]}`] = vertex;
            });
            resolve();
          })
        ])
          .then(() => [centroid, convexBuf, pointsSetBbox])
          .catch(err => {
            throw err;
          });
      })
      .then(prevResults => {
        const centroid = prevResults[0];
        const convexBuf = prevResults[1];
        const pointsSetBbox = prevResults[2];

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
            vertexDelta.bakw = [
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
                  vertexDelta.bakw[0] * xRate + centroid.bakw[0],
                  vertexDelta.bakw[1] * xRate + centroid.bakw[1]
                ]
              };
              if (vertexDelta.forw[0] < 0) prev[3].push(point);
              else prev[1].push(point);
            }
            if (Math.abs(yRate) / Math.abs(xRate) < 1.1) {
              const point = {
                forw: [
                  vertexDelta.forw[0] * yRate + centroid.forw[0],
                  vertexDelta.forw[1] * yRate + centroid.forw[1]
                ],
                bakw: [
                  vertexDelta.bakw[0] * yRate + centroid.bakw[0],
                  vertexDelta.bakw[1] * yRate + centroid.bakw[1]
                ]
              };
              if (vertexDelta.forw[1] < 0) prev[0].push(point);
              else prev[2].push(point);
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
              vertexDelta.bakw = [
                bakVertex[0] - centroid.bakw[0],
                centroid.bakw[1] - bakVertex[1]
              ];

              if (vertexDelta.forw[0] == 0 || vertexDelta.forw[1] == 0)
                return prev;
              let index = 0;
              if (vertexDelta.forw[0] > 0) index += 1;
              if (vertexDelta.forw[1] > 0) index += 2;
              prev[index].push([vertexDelta.forw, vertexDelta.bakw]);
              if (idx == array.length - 1) {
                // If some orthants have no Convex full polygon's vertices, use same average factor to every orthants
                return prev.length ==
                  prev.filter(val => val.length > 0).length &&
                  self.vertexMode == Tin.VERTEX_BIRDEYE
                  ? prev
                  : prev.reduce(
                    (pre, cur) => {
                      const ret = [pre[0].concat(cur)];
                      return ret;
                    },
                    [[]]
                  );
              }
              return prev;
            },
            [[], [], [], []]
          )
          .map(item =>
            // Finalize calcuration of Average scaling factors and rotation factors
            item.reduce((prev, curr, index, arr) => {
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
            }, null)
          );

        // "Using same average factor to every orthants" case
        if (orthant.length == 1)
          orthant = [orthant[0], orthant[0], orthant[0], orthant[0]];

        return [orthant, centroid, expandConvex, pointsSetBbox];
      })
      .then(prevResults => {
        const orthant = prevResults[0];
        const centroid = prevResults[1];
        const expandConvex = prevResults[2];
        const pointsSet = prevResults[3][0];
        const bbox = prevResults[3][1];

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
          const bakDistance = forDistance / delta[0];

          const forTheta = Math.atan2(forDelta[0], forDelta[1]);
          const bakTheta = forTheta - delta[1];

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
          expands.map(expand => {
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
                  intersect_.geometry.coordinates[0] - centroid.bakw[0],
                  2
                ) +
                Math.pow(
                  intersect_.geometry.coordinates[1] - centroid.bakw[1],
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
        return [verticesSet, pointsSet];
      })
      .then(prevResults => {
        const verticesSet = prevResults[0];
        const pointsSet = prevResults[1];

        const verticesList = { forw: [], bakw: [] };

        for (let i = 0; i < verticesSet.length; i++) {
          const forVertex = verticesSet[i].forw;
          const bakVertex = verticesSet[i].bakw;
          const forVertexFt = createPoint(forVertex, bakVertex, `bbox${i}`);
          const bakVertexFt = counterPoint(forVertexFt);
          pointsSet.forw.features.push(forVertexFt);
          pointsSet.bakw.features.push(bakVertexFt);
          verticesList.forw.push(forVertexFt);
          verticesList.bakw.push(bakVertexFt);
        }

        self.pointsSet = pointsSet;
        self.tins = {
          forw: rotateVerticesTriangle(
            constrainedTin(pointsSet.forw, pointsSet.edges, "target")
          )
        };
        let prom;
        if (strict == Tin.MODE_STRICT || strict == Tin.MODE_AUTO) {
          prom = self.calcurateStrictTinAsync();
        } else {
          prom = Promise.resolve();
        }
        return prom
          .then(() => {
            if (
              strict == Tin.MODE_LOOSE ||
              (strict == Tin.MODE_AUTO &&
                self.strict_status == Tin.STATUS_ERROR)
            ) {
              self.tins.bakw = rotateVerticesTriangle(
                constrainedTin(pointsSet.bakw, pointsSet.edges, "target")
              );
              delete self.kinks;
              self.strict_status = Tin.STATUS_LOOSE;
            }
            self.vertices_params = {
              forw: vertexCalc(verticesList.forw, self.centroid.forw),
              bakw: vertexCalc(verticesList.bakw, self.centroid.bakw)
            };

            self.addIndexedTin();
            return self.calculatePointsWeightAsync();
          })
          .catch(err => {
            throw err;
          });
      })
      .catch(err => {
        throw err;
      });
  }

  transform(apoint, backward, ignoreBounds) {
    if (backward && this.strict_status == Tin.STATUS_ERROR)
      throw 'Backward transform is not allowed if strict_status == "strict_error"';
    // if (!this.tins) this.updateTin();
    if (this.yaxisMode == Tin.YAXIS_FOLLOW && backward) {
      apoint = [apoint[0], -1 * apoint[1]];
    }
    const tpoint = point(apoint);
    if (this.bounds && !backward && !ignoreBounds) {
      if (!booleanPointInPolygon(tpoint, this.boundsPolygon)) return false;
    }
    const tins = backward ? this.tins.bakw : this.tins.forw;
    const indexedTins = backward
      ? this.indexedTins.bakw
      : this.indexedTins.forw;
    const verticesParams = backward
      ? this.vertices_params.bakw
      : this.vertices_params.forw;
    const centroid = backward ? this.centroid.bakw : this.centroid.forw;
    const weightBuffer = backward
      ? this.pointsWeightBuffer.bakw
      : this.pointsWeightBuffer.forw;
    let stateTriangle = undefined,
      stateSetFunc = undefined;
    if (this.stateFull) {
      if (this.stateBackward == backward) {
        stateTriangle = this.stateTriangle;
      } else {
        this.stateBackward = backward;
        this.stateTriangle = undefined;
      }
      stateSetFunc = tri => {
        this.stateTriangle = tri;
      };
    }
    let ret = transformArr(
      tpoint,
      tins,
      indexedTins,
      verticesParams,
      centroid,
      weightBuffer,
      stateTriangle,
      stateSetFunc
    );
    if (this.bounds && backward && !ignoreBounds) {
      const rpoint = point(ret);
      if (!booleanPointInPolygon(rpoint, this.boundsPolygon)) return false;
    } else if (this.yaxisMode == Tin.YAXIS_FOLLOW && !backward) {
      ret = [ret[0], -1 * ret[1]];
    }
    return ret;
  }

  calculatePointsWeightAsync() {
    const self = this;
    const calcTargets = ["forw"];
    if (self.strict_status == Tin.STATUS_LOOSE) calcTargets.push("bakw");
    const weightBuffer = {};
    return Promise.all(
      calcTargets.map(target => {
        weightBuffer[target] = {};
        const alreadyChecked = {};
        const tin = self.tins[target];
        return Promise.all(
          tin.features.map(tri => {
            const vtxes = ["a", "b", "c"];
            return new Promise(resolve => {
              for (let i = 0; i < 3; i++) {
                const j = (i + 1) % 3;
                const vi = vtxes[i];
                const vj = vtxes[j];
                const indexi = tri.properties[vi].index;
                const indexj = tri.properties[vj].index;
                const key = [indexi, indexj].sort().join("-");
                if (!alreadyChecked[key]) {
                  const fromi = tri.geometry.coordinates[0][i];
                  const fromj = tri.geometry.coordinates[0][j];
                  const toi = tri.properties[vi].geom;
                  const toj = tri.properties[vj].geom;
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

                  if (!weightBuffer[target][indexi])
                    weightBuffer[target][indexi] = {};
                  if (!weightBuffer[target][indexj])
                    weightBuffer[target][indexj] = {};
                  weightBuffer[target][indexi][key] = weight;
                  weightBuffer[target][indexj][key] = weight;
                }
              }
              resolve();
            });
          })
        ).catch(err => {
          throw err;
        });
      })
    )
      .then(() => {
        const pointsWeightBuffer = {};
        calcTargets.map(target => {
          pointsWeightBuffer[target] = {};
          if (self.strict_status == Tin.STATUS_STRICT)
            pointsWeightBuffer["bakw"] = {};
          Object.keys(weightBuffer[target]).map(vtx => {
            pointsWeightBuffer[target][vtx] = Object.keys(
              weightBuffer[target][vtx]
            ).reduce((prev, key, idx, arr) => {
              prev = prev + weightBuffer[target][vtx][key];
              return idx == arr.length - 1 ? prev / arr.length : prev;
            }, 0);
            if (self.strict_status == Tin.STATUS_STRICT)
              pointsWeightBuffer["bakw"][vtx] =
                1 / pointsWeightBuffer[target][vtx];
          });
          pointsWeightBuffer[target]["cent"] = [0, 1, 2, 3].reduce(
            (prev, curr) => {
              const key = `bbox${curr}`;
              prev = prev + pointsWeightBuffer[target][key];
              return curr == 3 ? prev / 4 : prev;
            },
            0
          );
          if (self.strict_status == Tin.STATUS_STRICT)
            pointsWeightBuffer["bakw"]["cent"] =
              1 / pointsWeightBuffer[target]["cent"];
        });
        self.pointsWeightBuffer = pointsWeightBuffer;
      })
      .catch(err => {
        throw err;
      });
  }
}

Tin.VERTEX_PLAIN = "plain";
Tin.VERTEX_BIRDEYE = "birdeye";
Tin.MODE_STRICT = "strict";
Tin.MODE_AUTO = "auto";
Tin.MODE_LOOSE = "loose";
Tin.STATUS_STRICT = "strict";
Tin.STATUS_ERROR = "strict_error";
Tin.STATUS_LOOSE = "loose";
Tin.YAXIS_FOLLOW = "follow";
Tin.YAXIS_INVERT = "invert";

function rotateVerticesTriangle(tins) {
  const features = tins.features;
  for (let i = 0; i < features.length; i++) {
    const feature = features[i];
    if (
      `${feature.properties.a.index}`.substring(0, 4) == "bbox" &&
      `${feature.properties.b.index}`.substring(0, 4) == "bbox"
    ) {
      features[i] = {
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              feature.geometry.coordinates[0][2],
              feature.geometry.coordinates[0][0],
              feature.geometry.coordinates[0][1],
              feature.geometry.coordinates[0][2]
            ]
          ]
        },
        properties: {
          a: {
            geom: feature.properties.c.geom,
            index: feature.properties.c.index
          },
          b: {
            geom: feature.properties.a.geom,
            index: feature.properties.a.index
          },
          c: {
            geom: feature.properties.b.geom,
            index: feature.properties.b.index
          }
        },
        type: "Feature"
      };
    } else if (
      `${feature.properties.c.index}`.substring(0, 4) == "bbox" &&
      `${feature.properties.a.index}`.substring(0, 4) == "bbox"
    ) {
      features[i] = {
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              feature.geometry.coordinates[0][1],
              feature.geometry.coordinates[0][2],
              feature.geometry.coordinates[0][0],
              feature.geometry.coordinates[0][1]
            ]
          ]
        },
        properties: {
          a: {
            geom: feature.properties.b.geom,
            index: feature.properties.b.index
          },
          b: {
            geom: feature.properties.c.geom,
            index: feature.properties.c.index
          },
          c: {
            geom: feature.properties.a.geom,
            index: feature.properties.a.index
          }
        },
        type: "Feature"
      };
    }
  }
  return tins;
}

function findIntersections(coords) {
  const arcs = new internal.ArcCollection(coords);
  return internal.findSegmentIntersections(arcs);
}

function vertexCalc(list, centroid) {
  const centCoord = centroid.geometry.coordinates;
  return [0, 1, 2, 3]
    .map(i => {
      const j = (i + 1) % 4;
      const itemi = list[i];
      const itemj = list[j];
      const coord = itemi.geometry.coordinates;
      const radian = Math.atan2(
        coord[0] - centCoord[0],
        coord[1] - centCoord[1]
      );
      const coordinates = [centroid, itemi, itemj, centroid].map(
        point => point.geometry.coordinates
      );
      const properties = {
        a: {
          geom: centroid.properties.target.geom,
          index: centroid.properties.target.index
        },
        b: {
          geom: itemi.properties.target.geom,
          index: itemi.properties.target.index
        },
        c: {
          geom: itemj.properties.target.geom,
          index: itemj.properties.target.index
        }
      };
      const tin = featureCollection([polygon([coordinates], properties)]);

      return [radian, tin];
    })
    .reduce(
      (prev, curr) => {
        prev[0].push(curr[0]);
        prev[1].push(curr[1]);
        return prev;
      },
      [[], []]
    );
}

function normalizeRadian(target, noNegative) {
  const rangeFunc = noNegative
    ? function (val) {
      return !(val >= 0 && val < Math.PI * 2);
    }
    : function (val) {
      return !(val > -1 * Math.PI && val <= Math.PI);
    };
  while (rangeFunc(target)) {
    target = target + 2 * Math.PI * (target > 0 ? -1 : 1);
  }
  return target;
}

function decideUseVertex(radian, radianList) {
  let idel = normalizeRadian(radian - radianList[0]);
  let minTheta = Math.PI * 2;
  let minIndex;
  for (let i = 0; i < radianList.length; i++) {
    const j = (i + 1) % radianList.length;
    const jdel = normalizeRadian(radian - radianList[j]);
    const minDel = Math.min(Math.abs(idel), Math.abs(jdel));
    if (idel * jdel <= 0 && minDel < minTheta) {
      minTheta = minDel;
      minIndex = i;
    }
    idel = jdel;
  }
  return minIndex;
}

function createPoint(xy, geom, index) {
  return point(xy, { target: { geom, index } });
}

function counterPoint(apoint) {
  return point(apoint.properties.target.geom, {
    target: {
      geom: apoint.geometry.coordinates,
      index: apoint.properties.target.index
    }
  });
}

// eslint-disable-next-line no-unused-vars
function transformTin(of, tri, weightBuffer) {
  return point(transformTinArr(of, tri, weightBuffer));
}
function transformTinArr(of, tri, weightBuffer) {
  const a = tri.geometry.coordinates[0][0];
  const b = tri.geometry.coordinates[0][1];
  const c = tri.geometry.coordinates[0][2];
  const o = of.geometry.coordinates;
  const ad = tri.properties.a.geom;
  const bd = tri.properties.b.geom;
  const cd = tri.properties.c.geom;

  const ab = [b[0] - a[0], b[1] - a[1]];
  const ac = [c[0] - a[0], c[1] - a[1]];
  const ao = [o[0] - a[0], o[1] - a[1]];
  const abd = [bd[0] - ad[0], bd[1] - ad[1]];
  const acd = [cd[0] - ad[0], cd[1] - ad[1]];

  let abv = (ac[1] * ao[0] - ac[0] * ao[1]) / (ab[0] * ac[1] - ab[1] * ac[0]);
  let acv = (ab[0] * ao[1] - ab[1] * ao[0]) / (ab[0] * ac[1] - ab[1] * ac[0]);

  // Considering weight
  if (weightBuffer) {
    const aW = weightBuffer[tri.properties.a.index];
    const bW = weightBuffer[tri.properties.b.index];
    const cW = weightBuffer[tri.properties.c.index];

    let nabv;
    if (abv < 0 || acv < 0 || 1 - abv - acv < 0) {
      const normB = abv / (abv + acv);
      const normC = acv / (abv + acv);
      nabv = abv / bW / (normB / bW + normC / cW);
      acv = acv / cW / (normB / bW + normC / cW);
    } else {
      nabv = abv / bW / (abv / bW + acv / cW + (1 - abv - acv) / aW);
      acv = acv / cW / (abv / bW + acv / cW + (1 - abv - acv) / aW);
    }
    abv = nabv;
  }
  const od = [
    abv * abd[0] + acv * acd[0] + ad[0],
    abv * abd[1] + acv * acd[1] + ad[1]
  ];
  return od;
}

// eslint-disable-next-line no-unused-vars
function useVertices(o, verticesParams, centroid, weightBuffer) {
  return point(useVerticesArr(o, verticesParams, centroid, weightBuffer));
}
function useVerticesArr(o, verticesParams, centroid, weightBuffer) {
  const coord = o.geometry.coordinates;
  const centCoord = centroid.geometry.coordinates;
  const radian = Math.atan2(coord[0] - centCoord[0], coord[1] - centCoord[1]);
  const index = decideUseVertex(radian, verticesParams[0]);
  const tin = verticesParams[1][index];
  return transformTinArr(o, tin.features[0], weightBuffer);
}

function hit(point, tins) {
  for (let i = 0; i < tins.features.length; i++) {
    const inside = booleanPointInPolygon(point, tins.features[i]);
    if (inside) {
      return tins.features[i];
    }
  }
}

function unitCalc(coord, origin, unit, gridNum) {
  let normCoord = Math.floor((coord - origin) / unit);
  if (normCoord >= gridNum) normCoord = gridNum - 1;
  return normCoord;
}

// eslint-disable-next-line no-unused-vars
function transform(
  point,
  tins,
  indexedTins,
  verticesParams,
  centroid,
  weightBuffer,
  stateTriangle,
  stateSetFunc
) {
  return point(
    transformArr(
      point,
      tins,
      indexedTins,
      verticesParams,
      centroid,
      weightBuffer,
      stateTriangle,
      stateSetFunc
    )
  );
}
function transformArr(
  point,
  tins,
  indexedTins,
  verticesParams,
  centroid,
  weightBuffer,
  stateTriangle,
  stateSetFunc
) {
  let tin;
  if (stateTriangle) {
    tin = hit(point, { features: [stateTriangle] });
  }
  if (!tin) {
    if (indexedTins) {
      const coords = point.geometry.coordinates;
      const gridNum = indexedTins.gridNum;
      const xOrigin = indexedTins.xOrigin;
      const yOrigin = indexedTins.yOrigin;
      const xUnit = indexedTins.xUnit;
      const yUnit = indexedTins.yUnit;
      const gridCache = indexedTins.gridCache;
      const normX = unitCalc(coords[0], xOrigin, xUnit, gridNum);
      const normY = unitCalc(coords[1], yOrigin, yUnit, gridNum);
      const tinsKey = gridCache[normX]
        ? gridCache[normX][normY]
          ? gridCache[normX][normY]
          : []
        : [];
      tins = { features: tinsKey.map(key => tins.features[key]) };
    }
    tin = hit(point, tins);
  }
  if (stateSetFunc) stateSetFunc(tin);

  return tin
    ? transformTinArr(point, tin, weightBuffer)
    : useVerticesArr(point, verticesParams, centroid, weightBuffer);
}

function counterTri(tri) {
  const coordinates = ["a", "b", "c", "a"].map(key => tri.properties[key].geom);
  const geoms = tri.geometry.coordinates[0];
  const props = tri.properties;
  const properties = {
    a: { geom: geoms[0], index: props["a"].index },
    b: { geom: geoms[1], index: props["b"].index },
    c: { geom: geoms[2], index: props["c"].index }
  };
  return polygon([coordinates], properties);
}

function buildTri(points) {
  const coordinates = [0, 1, 2, 0].map(i => points[i][0][0]);
  const properties = {
    a: { geom: points[0][0][1], index: points[0][1] },
    b: { geom: points[1][0][1], index: points[1][1] },
    c: { geom: points[2][0][1], index: points[2][1] }
  };
  return polygon([coordinates], properties);
}

function indexesToTri(indexes, points, edgeNodes, cent, bboxes, bakw) {
  const points_ = indexes.map(index => {
    const point_base = isFinite(index)
      ? points[index]
      : index == "cent"
        ? cent
        : index == "bbox0"
          ? bboxes[0]
          : index == "bbox1"
            ? bboxes[1]
            : index == "bbox2"
              ? bboxes[2]
              : index == "bbox3"
                ? bboxes[3]
                : (function () {
                  const match = index.match(/edgeNode(\d+)/);
                  if (match) {
                    const nodeIndex = parseInt(match[1]);
                    return edgeNodes[nodeIndex];
                  }
                  return undefined;
                })();
    return bakw
      ? [[point_base[1], point_base[0]], index]
      : [[point_base[0], point_base[1]], index];
  });
  return buildTri(points_);
}

function overlapCheckAsync(searchIndex) {
  const retValue = { forw: {}, bakw: {} };
  return Promise.all(
    Object.keys(searchIndex).map(
      key =>
        new Promise(resolve => {
          const searchResult = searchIndex[key];
          if (searchResult.length < 2) return resolve();
          ["forw", "bakw"].map(dir => {
            const result = intersect(
              searchResult[0][dir],
              searchResult[1][dir]
            );
            if (
              !result ||
              result.geometry.type == "Point" ||
              result.geometry.type == "LineString"
            )
              return resolve();
            //const diff1 = difference(searchResult[0][dir], result);
            //const diff2 = difference(searchResult[1][dir], result);
            /* if (!diff1 || !diff2) {
                    searchResult[dir][key] = 'Include case';
                } else {
                    searchResult[dir][key] = 'Not include case';
                }*/
            resolve();
          });
        })
    )
  )
    .then(() => {
      if (Object.keys(retValue.forw).length == 0) delete retValue.forw;
      if (Object.keys(retValue.bakw).length == 0) delete retValue.bakw;
      return retValue;
    })
    .catch(err => {
      throw err;
    });
}

function insertSearchIndex(searchIndex, tris, tins) {
  const keys = calcSearchKeys(tris.forw);
  const bakKeys = calcSearchKeys(tris.bakw);
  if (JSON.stringify(keys) != JSON.stringify(bakKeys))
    throw `${JSON.stringify(tris, null, 2)}\n${JSON.stringify(
      keys
    )}\n${JSON.stringify(bakKeys)}`;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (!searchIndex[key]) searchIndex[key] = [];
    searchIndex[key].push(tris);
  }
  if (tins) {
    tins.forw.features.push(tris.forw);
    tins.bakw.features.push(tris.bakw);
  }
}

function removeSearchIndex(searchIndex, tris, tins) {
  const keys = calcSearchKeys(tris.forw);
  const bakKeys = calcSearchKeys(tris.bakw);
  if (JSON.stringify(keys) != JSON.stringify(bakKeys))
    throw `${JSON.stringify(tris, null, 2)}\n${JSON.stringify(
      keys
    )}\n${JSON.stringify(bakKeys)}`;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const newArray = searchIndex[key].filter(
      eachTris => eachTris.forw != tris.forw
    );
    if (newArray.length == 0) delete searchIndex[key];
    else searchIndex[key] = newArray;
  }
  if (tins) {
    let newArray = tins.forw.features.filter(eachTri => eachTri != tris.forw);
    tins.forw.features = newArray;
    newArray = tins.bakw.features.filter(eachTri => eachTri != tris.bakw);
    tins.bakw.features = newArray;
  }
}

function calcSearchKeys(tri) {
  const vtx = ["a", "b", "c"].map(key => tri.properties[key].index);
  return [
    [0, 1],
    [0, 2],
    [1, 2],
    [0, 1, 2]
  ]
    .map(set => {
      const index = set
        .map(i => vtx[i])
        .sort()
        .join("-");
      return index;
    })
    .sort();
}

export default Tin;
if (typeof module === "object" && module.exports) {
  module.exports = Tin;
}
