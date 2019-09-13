'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _helpers = require("@turf/helpers");

var _union = _interopRequireDefault(require("@turf/union"));

var _convex = _interopRequireDefault(require("@turf/convex"));

var _difference = _interopRequireDefault(require("@turf/difference"));

var _booleanPointInPolygon = _interopRequireDefault(require("@turf/boolean-point-in-polygon"));

var _centroid = _interopRequireDefault(require("@turf/centroid"));

var _lineIntersect = _interopRequireDefault(require("@turf/line-intersect"));

var _intersect = _interopRequireDefault(require("@turf/intersect"));

var _mapshaperMaplat = _interopRequireDefault(require("./mapshaper-maplat"));

var _constrainedTin = _interopRequireDefault(require("./constrained-tin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Tin =
/*#__PURE__*/
function () {
  function Tin(options) {
    _classCallCheck(this, Tin);

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

    if (options.points) {
      this.setPoints(options.points);
    }

    if (options.edges) {
      this.setEdges(options.edges);
    }
  }

  _createClass(Tin, [{
    key: "setPoints",
    value: function setPoints(points) {
      if (this.yaxisMode == Tin.YAXIS_FOLLOW) {
        points = points.map(function (point) {
          [point[0], [point[1][0], -1 * point[1][1]]];
        });
      }

      this.points = points;
      this.tins = undefined;
    }
  }, {
    key: "setEdges",
    value: function setEdges(edges) {
      if (!edges) edges = [];
      this.edges = edges;
      this.edgeNodes = undefined;
      this.tins = undefined;
    }
  }, {
    key: "setBounds",
    value: function setBounds(bounds) {
      this.bounds = bounds;
      var minx, miny, maxx, maxy, coords;

      for (var i = 0; i < bounds.length; i++) {
        var xy = bounds[i];

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
      this.boundsPolygon = (0, _helpers.polygon)([coords]);
      this.xy = [minx, miny];
      this.wh = [maxx - minx, maxy - miny];
      this.vertexMode = Tin.VERTEX_PLAIN;
      this.tins = undefined;
    }
  }, {
    key: "setCompiled",
    value: function setCompiled(compiled) {
      var _this = this;

      if (!compiled.tins && compiled.points && compiled.tins_points) {
        // 新コンパイルロジック
        // pointsはそのままpoints, weightBufferも
        this.points = compiled.points;
        this.pointsWeightBuffer = compiled.weight_buffer; // kinksやtinsの存在状況でstrict_statusを判定

        if (compiled.strict_status) {
          this.strict_status = compiled.strict_status;
        } else if (compiled.kinks_points) {
          this.strict_status = Tin.STATUS_ERROR;
        } else if (compiled.tins_points.length == 2) {
          this.strict_status = Tin.STATUS_LOOSE;
        } else {
          this.strict_status = Tin.STATUS_STRICT;
        } // vertices_paramsを復元


        this.vertices_params = {
          'forw': [compiled.vertices_params[0]],
          'bakw': [compiled.vertices_params[1]]
        };
        this.vertices_params.forw[1] = [0, 1, 2, 3].map(function (idx) {
          var idxNxt = (idx + 1) % 4;
          var tri = indexesToTri(['cent', "bbox".concat(idx), "bbox".concat(idxNxt)], compiled.points, compiled.edgeNodes || [], compiled.centroid_point, compiled.vertices_points, false);
          return (0, _helpers.featureCollection)([tri]);
        });
        this.vertices_params.bakw[1] = [0, 1, 2, 3].map(function (idx) {
          var idxNxt = (idx + 1) % 4;
          var tri = indexesToTri(['cent', "bbox".concat(idx), "bbox".concat(idxNxt)], compiled.points, compiled.edgeNodes || [], compiled.centroid_point, compiled.vertices_points, true);
          return (0, _helpers.featureCollection)([tri]);
        }); // centroidを復元

        this.centroid = {
          'forw': (0, _helpers.point)(compiled.centroid_point[0], {
            'target': {
              'geom': compiled.centroid_point[1],
              'index': 'cent'
            }
          }),
          'bakw': (0, _helpers.point)(compiled.centroid_point[1], {
            'target': {
              'geom': compiled.centroid_point[0],
              'index': 'cent'
            }
          })
        }; // edgesを復元

        this.edges = compiled.edges || [];
        this.edgeNodes = compiled.edgeNodes || []; // tinsを復元

        var bakwI = compiled.tins_points.length == 1 ? 0 : 1;
        this.tins = {
          'forw': (0, _helpers.featureCollection)(compiled.tins_points[0].map(function (idxes) {
            return indexesToTri(idxes, compiled.points, compiled.edgeNodes || [], compiled.centroid_point, compiled.vertices_points, false);
          })),
          'bakw': (0, _helpers.featureCollection)(compiled.tins_points[bakwI].map(function (idxes) {
            return indexesToTri(idxes, compiled.points, compiled.edgeNodes || [], compiled.centroid_point, compiled.vertices_points, true);
          })) // kinksを復元

        };

        if (compiled.kinks_points) {
          this.kinks = {
            'bakw': (0, _helpers.featureCollection)(compiled.kinks_points.map(function (coord) {
              return (0, _helpers.point)(coord);
            }))
          };
        } // yaxisModeを復元


        if (compiled.yaxisMode) {
          this.yaxisMode = compiled.yaxisMode;
        } else {
          this.yaxisMode = Tin.YAXIS_INVERT;
        } // boundsを復元


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
        (function () {
          // 旧コンパイルロジック
          _this.tins = compiled.tins;
          _this.strict_status = compiled.strict_status;
          _this.pointsWeightBuffer = compiled.weight_buffer;
          _this.vertices_params = compiled.vertices_params;
          _this.centroid = compiled.centroid;
          _this.kinks = compiled.kinks;
          var points = [];

          var _loop = function _loop(i) {
            var tri = _this.tins.forw.features[i];
            ['a', 'b', 'c'].map(function (key, idx) {
              var forw = tri.geometry.coordinates[0][idx];
              var bakw = tri.properties[key].geom;
              var pIdx = tri.properties[key].index;
              points[pIdx] = [forw, bakw];
            });
          };

          for (var i = 0; i < _this.tins.forw.features.length; i++) {
            _loop(i);
          }

          _this.points = points;
        })();
      } // 翻訳したオブジェクトを返す


      return {
        'tins': this.tins,
        'strict_status': this.strict_status,
        'weight_buffer': this.pointsWeightBuffer,
        'vertices_params': this.vertices_params,
        'centroid': this.centroid,
        'kinks': this.kinks
      };
    }
  }, {
    key: "getCompiled",
    value: function getCompiled() {
      var compiled = {};
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
      compiled.weight_buffer = this.pointsWeightBuffer; // centroidは座標の対応のみ保存

      compiled.centroid_point = [this.centroid.forw.geometry.coordinates, this.centroid.forw.properties.target.geom]; // vertices_paramsの最初の値はそのまま保存

      compiled.vertices_params = [this.vertices_params.forw[0], this.vertices_params.bakw[0]]; // vertices_paramsの2番目の値（セントロイドと地図頂点の三角形ポリゴン）は、地図頂点座標のみ記録

      compiled.vertices_points = [];
      var vertices = this.vertices_params.forw[1];
      [0, 1, 2, 3].map(function (i) {
        var vertex_data = vertices[i].features[0];
        var forw = vertex_data.geometry.coordinates[0][1];
        var bakw = vertex_data.properties.b.geom;
        compiled.vertices_points[i] = [forw, bakw];
      });
      compiled.strict_status = this.strict_status; // tinは座標インデックスのみ記録

      compiled.tins_points = [[]];
      this.tins.forw.features.map(function (tin) {
        compiled.tins_points[0].push(['a', 'b', 'c'].map(function (idx) {
          return tin.properties[idx].index;
        }));
      }); // 自動モードでエラーがある時（loose）は、逆方向のtinも記録。
      // 厳格モードでエラーがある時（strict_error）は、エラー点情報(kinks)を記録。

      if (this.strict_status == Tin.STATUS_LOOSE) {
        compiled.tins_points[1] = [];
        this.tins.bakw.features.map(function (tin) {
          compiled.tins_points[1].push(['a', 'b', 'c'].map(function (idx) {
            return tin.properties[idx].index;
          }));
        });
      } else if (this.strict_status == Tin.STATUS_ERROR) {
        compiled.kinks_points = this.kinks.bakw.features.map(function (kink) {
          return kink.geometry.coordinates;
        });
      } // yaxisMode対応


      if (this.yaxisMode == Tin.YAXIS_FOLLOW) {
        compiled.yaxisMode = Tin.YAXIS_FOLLOW;
      } // bounds対応


      if (this.bounds) {
        compiled.bounds = this.bounds;
        compiled.boundsPolygon = this.boundsPolygon;
        compiled.xy = this.xy;
        compiled.wh = this.wh;
      } else {
        compiled.wh = this.wh;
      } // edge対応


      compiled.edges = this.edges;
      compiled.edgeNodes = this.edgeNodes;
      return compiled;
    }
  }, {
    key: "setWh",
    value: function setWh(wh) {
      this.wh = wh;
      this.xy = [0, 0];
      this.bounds = undefined;
      this.boundsPolygon = undefined;
      this.tins = undefined;
    }
  }, {
    key: "setVertexMode",
    value: function setVertexMode(mode) {
      this.vertexMode = mode;
      this.tins = undefined;
    }
  }, {
    key: "setStrictMode",
    value: function setStrictMode(mode) {
      this.strictMode = mode;
      this.tins = undefined;
    }
  }, {
    key: "calcurateStrictTinAsync",
    value: function calcurateStrictTinAsync() {
      var self = this;
      var edges = self.pointsSet.edges;
      return Promise.all(self.tins.forw.features.map(function (tri) {
        return Promise.resolve(counterTri(tri));
      })).then(function (tris) {
        self.tins.bakw = (0, _helpers.featureCollection)(tris);
      }).then(function () {
        var searchIndex = {};
        return Promise.all(self.tins.forw.features.map(function (forTri, index) {
          var bakTri = self.tins.bakw.features[index];
          return Promise.resolve(insertSearchIndex(searchIndex, {
            forw: forTri,
            bakw: bakTri
          }));
        })).then(function () {
          return searchIndex;
        })["catch"](function (err) {
          throw err;
        });
      }).then(function (searchIndex) {
        return [overlapCheckAsync(searchIndex), searchIndex];
      }).then(function (prevResult) {
        var overlapped = prevResult[0];
        var searchIndex = prevResult[1];
        if (overlapped.bakw) Object.keys(overlapped.bakw).map(function (key) {
          if (overlapped.bakw[key] == 'Not include case') return;
          var trises = searchIndex[key];
          var forUnion = (0, _union["default"])(trises[0].forw, trises[1].forw);
          var forConvex = (0, _convex["default"])((0, _helpers.featureCollection)([trises[0].forw, trises[1].forw]));
          var forDiff = (0, _difference["default"])(forConvex, forUnion);
          if (forDiff) return;
          var splittedKey = key.split('-');

          if (splittedKey[0].match(/^[0-9]+$/) && splittedKey[1].match(/^[0-9]+$/)) {
            var numberKey = splittedKey.map(function (key) {
              return parseInt(key);
            }).sort(function (a, b) {
              return a < b ? -1 : 1;
            });

            for (var i = 0; i < edges.length - 1; i++) {
              if (numberKey[0] == edges[i][0] && numberKey[1] == edges[i][1]) return;
            }
          }

          var sharedVtx = splittedKey.map(function (val) {
            return ['a', 'b', 'c'].map(function (alpha, index) {
              var prop = trises[0].bakw.properties[alpha];
              var geom = trises[0].bakw.geometry.coordinates[0][index];
              return {
                geom: geom,
                prop: prop
              };
            }).filter(function (vtx) {
              return vtx.prop.index == val;
            })[0];
          });
          var nonSharedVtx = trises.map(function (tris) {
            return ['a', 'b', 'c'].map(function (alpha, index) {
              var prop = tris.bakw.properties[alpha];
              var geom = tris.bakw.geometry.coordinates[0][index];
              return {
                geom: geom,
                prop: prop
              };
            }).filter(function (vtx) {
              return vtx.prop.index != sharedVtx[0].prop.index && vtx.prop.index != sharedVtx[1].prop.index;
            })[0];
          });
          removeSearchIndex(searchIndex, trises[0], self.tins);
          removeSearchIndex(searchIndex, trises[1], self.tins);
          sharedVtx.map(function (sVtx) {
            var newTriCoords = [sVtx.geom, nonSharedVtx[0].geom, nonSharedVtx[1].geom, sVtx.geom];
            var newTriProp = {
              a: sVtx.prop,
              b: nonSharedVtx[0].prop,
              c: nonSharedVtx[1].prop
            };
            var newBakTri = (0, _helpers.polygon)([newTriCoords], newTriProp);
            var newForTri = counterTri(newBakTri);
            insertSearchIndex(searchIndex, {
              forw: newForTri,
              bakw: newBakTri
            }, self.tins);
          });
        });
        return Promise.all(['forw', 'bakw'].map(function (direc) {
          return new Promise(function (resolve) {
            var coords = self.tins[direc].features.map(function (poly) {
              return poly.geometry.coordinates[0];
            });
            var xy = findIntersections(coords);

            var retXy = _mapshaperMaplat["default"].dedupIntersections(xy).reduce(function (prev, apoint, index, array) {
              if (!prev) prev = {};
              prev["".concat(apoint.x, ":").concat(apoint.y)] = apoint;
              if (index != array.length - 1) return prev;
              return Object.keys(prev).map(function (key) {
                return (0, _helpers.point)([prev[key].x, prev[key].y]);
              });
            }, []);

            resolve(retXy);
          })["catch"](function (err) {
            throw err;
          });
        })).then(function (result) {
          if (result[0].length == 0 && result[1].length == 0) {
            self.strict_status = Tin.STATUS_STRICT;
            delete self.kinks;
          } else {
            self.strict_status = Tin.STATUS_ERROR;
            self.kinks = {};
            if (result[0].length > 0) self.kinks.forw = (0, _helpers.featureCollection)(result[0]);
            if (result[1].length > 0) self.kinks.bakw = (0, _helpers.featureCollection)(result[1]);
          }
        })["catch"](function (err) {
          throw err;
        });
      })["catch"](function (err) {
        throw err;
      });
    }
  }, {
    key: "generatePointsSet",
    value: function generatePointsSet() {
      var self = this;
      var pointsArray = {
        forw: [],
        bakw: []
      };

      for (var i = 0; i < self.points.length; i++) {
        var mapxy = self.points[i][0];
        var mercs = self.points[i][1];
        var forPoint = createPoint(mapxy, mercs, i);
        pointsArray.forw.push(forPoint);
        pointsArray.bakw.push(counterPoint(forPoint));
      }

      var edges = [];
      var edgeNodeIndex = 0;
      self.edgeNodes = [];
      if (!self.edges) self.edges = [];

      var _loop2 = function _loop2(_i) {
        var startEnd = self.edges[_i].startEnd;
        var illstNodes = Object.assign([], self.edges[_i].illstNodes);
        var mercNodes = Object.assign([], self.edges[_i].mercNodes);

        if (illstNodes.length === 0 && mercNodes.length === 0) {
          edges.push(startEnd);
          return "continue";
        }

        illstNodes.unshift(self.points[startEnd[0]][0]);
        illstNodes.push(self.points[startEnd[1]][0]);
        mercNodes.unshift(self.points[startEnd[0]][1]);
        mercNodes.push(self.points[startEnd[1]][1]);
        var lengths = [illstNodes, mercNodes].map(function (nodes) {
          var eachLengths = nodes.map(function (node, index, arr) {
            if (index === 0) return 0;
            var prev = arr[index - 1];
            return Math.sqrt(Math.pow(node[0] - prev[0], 2) + Math.pow(node[1] - prev[1], 2));
          });
          var sumLengths = eachLengths.reduce(function (prev, node, index) {
            if (index === 0) return [0];
            prev.push(prev[index - 1] + node);
            return prev;
          }, []);
          return sumLengths.map(function (eachSum, index, arr) {
            var ratio = eachSum / arr[arr.length - 1];
            return [nodes[index], eachLengths[index], sumLengths[index], ratio];
          });
        });
        lengths.map(function (thisLengths, i) {
          var anotherLengths = lengths[i ? 0 : 1];
          return thisLengths.filter(function (val, index) {
            return index === 0 || index === thisLengths.length - 1 || val[4] === 'handled' ? false : true;
          }).map(function (lengthItem) {
            var node = lengthItem[0];
            var ratio = lengthItem[3];
            var anotherSets = anotherLengths.reduce(function (prev, item, index, arr) {
              if (prev) return prev;
              var next = arr[index + 1];

              if (item[3] === ratio) {
                item[4] = 'handled';
                return [item];
              }

              if (item[3] < ratio && next[3] > ratio) return [item, next];
              return;
            }, undefined);

            if (anotherSets.length === 1) {
              return i === 0 ? [node, anotherSets[0][0], ratio] : [anotherSets[0][0], node, ratio];
            } else {
              var anotherPrev = anotherSets[0];
              var anotherNext = anotherSets[1];
              var ratioDelta = ratio - anotherPrev[3];
              var ratioAnother = anotherNext[3] - anotherPrev[3];
              var ratioInEdge = ratioDelta / ratioAnother;
              var anotherNode = [(anotherNext[0][0] - anotherPrev[0][0]) * ratioInEdge + anotherPrev[0][0], (anotherNext[0][1] - anotherPrev[0][1]) * ratioInEdge + anotherPrev[0][1]];
              return i === 0 ? [node, anotherNode, ratio] : [anotherNode, node, ratio];
            }
          });
        }).reduce(function (prev, nodes) {
          return prev.concat(nodes);
        }, []).sort(function (a, b) {
          return a[2] < b[2] ? -1 : 1;
        }).map(function (node, index, arr) {
          self.edgeNodes[edgeNodeIndex] = [node[0], node[1]];
          var forPoint = createPoint(node[0], node[1], "edgeNode".concat(edgeNodeIndex));
          edgeNodeIndex++;
          pointsArray.forw.push(forPoint);
          pointsArray.bakw.push(counterPoint(forPoint));

          if (index === 0) {
            edges.push([startEnd[0], pointsArray.forw.length - 1]);
          } else {
            edges.push([pointsArray.forw.length - 2, pointsArray.forw.length - 1]);
          }

          if (index === arr.length - 1) {
            edges.push([pointsArray.forw.length - 1, startEnd[1]]);
          }
        });
      };

      for (var _i = 0; _i < self.edges.length; _i++) {
        var _ret = _loop2(_i);

        if (_ret === "continue") continue;
      }

      return {
        forw: (0, _helpers.featureCollection)(pointsArray.forw),
        bakw: (0, _helpers.featureCollection)(pointsArray.bakw),
        edges: edges
      };
    }
  }, {
    key: "updateTinAsync",
    value: function updateTinAsync() {
      var self = this;
      var strict = this.strictMode;
      var minx = self.xy[0] - 0.05 * self.wh[0];
      var maxx = self.xy[0] + 1.05 * self.wh[0];
      var miny = self.xy[1] - 0.05 * self.wh[1];
      var maxy = self.xy[1] + 1.05 * self.wh[1];
      var insideCheck = this.bounds ? function (xy) {
        return (0, _booleanPointInPolygon["default"])(xy, self.boundsPolygon);
      } : function (xy) {
        return xy[0] >= self.xy[0] && xy[0] <= self.xy[0] + self.wh[0] && xy[1] >= self.xy[1] && xy[1] <= self.xy[1] + self.wh[1];
      };
      var inside = this.points.reduce(function (prev, curr) {
        return prev && insideCheck(curr[0]);
      }, true);

      if (!inside) {
        return new Promise(function (resolve, reject) {
          reject('SOME POINTS OUTSIDE');
        });
      }

      return new Promise(function (resolve) {
        if (strict != Tin.MODE_STRICT && strict != Tin.MODE_LOOSE) strict = Tin.MODE_AUTO;
        var bbox = [];

        if (self.wh) {
          bbox = [[minx, miny], [maxx, miny], [minx, maxy], [maxx, maxy]];
        }

        var pointsSet = self.generatePointsSet();
        resolve([pointsSet, bbox]);
      }).then(function (prevResults) {
        var pointsSet = prevResults[0]; // Forward TIN for calcurating Backward Centroid and Backward Vertices

        return Promise.all([new Promise(function (resolve) {
          resolve((0, _constrainedTin["default"])(pointsSet.forw, pointsSet.edges, 'target'));
        }), new Promise(function (resolve) {
          resolve((0, _constrainedTin["default"])(pointsSet.bakw, pointsSet.edges, 'target'));
        }), new Promise(function (resolve) {
          resolve((0, _centroid["default"])(pointsSet.forw));
        }), Promise.resolve(prevResults)])["catch"](function (err) {
          throw err;
        });
      }).then(function (prevResults) {
        var tinForCentroid = prevResults[0];
        var tinBakCentroid = prevResults[1];
        var forCentroidFt = prevResults[2];
        var pointsSetBbox = prevResults[3];
        var pointsSet = pointsSetBbox[0];
        if (tinForCentroid.features.length == 0 || tinBakCentroid.features.length == 0) throw 'TOO LINEAR1'; // Calcurating Forward/Backward Centroid

        var centroid = {
          forw: forCentroidFt.geometry.coordinates
        };
        centroid.bakw = transformArr(forCentroidFt, tinForCentroid);
        self.centroid = {
          forw: createPoint(centroid.forw, centroid.bakw, 'cent')
        };
        self.centroid.bakw = counterPoint(self.centroid.forw);
        var convexBuf = {};
        return Promise.all([new Promise(function (resolve) {
          var forConvex = (0, _convex["default"])(pointsSet.forw).geometry.coordinates[0];
          var vconvex;

          try {
            vconvex = forConvex.map(function (forw) {
              return {
                forw: forw,
                bakw: transformArr((0, _helpers.point)(forw), tinForCentroid)
              };
            });
          } catch (e) {
            throw 'TOO LINEAR2';
          }

          vconvex.map(function (vertex) {
            convexBuf["".concat(vertex.forw[0], ":").concat(vertex.forw[1])] = vertex;
          });
          resolve();
        }), new Promise(function (resolve) {
          var bakConvex = (0, _convex["default"])(pointsSet.bakw).geometry.coordinates[0];
          var vconvex;

          try {
            vconvex = bakConvex.map(function (bakw) {
              return {
                bakw: bakw,
                forw: transformArr((0, _helpers.point)(bakw), tinBakCentroid)
              };
            });
          } catch (e) {
            throw 'TOO LINEAR2';
          }

          vconvex.map(function (vertex) {
            convexBuf["".concat(vertex.forw[0], ":").concat(vertex.forw[1])] = vertex;
          });
          resolve();
        })]).then(function () {
          return [centroid, convexBuf, pointsSetBbox];
        })["catch"](function (err) {
          throw err;
        });
      }).then(function (prevResults) {
        var centroid = prevResults[0];
        var convexBuf = prevResults[1];
        var pointsSetBbox = prevResults[2]; // Calcurating Convex full to get Convex full polygon's vertices

        var expandConvex = Object.keys(convexBuf).reduce(function (prev, key, _, array) {
          // eslint-disable-line no-unused-vars
          var forVertex = convexBuf[key].forw;
          var bakVertex = convexBuf[key].bakw; // Convexhullの各頂点に対し、重心からの差分を取る

          var vertexDelta = {
            forw: [forVertex[0] - centroid.forw[0], forVertex[1] - centroid.forw[1]]
          };
          vertexDelta.bakw = [bakVertex[0] - centroid.bakw[0], bakVertex[1] - centroid.bakw[1]]; // X軸方向、Y軸方向それぞれに対し、地図外郭XY座標との重心との比を取る

          var xRate = vertexDelta.forw[0] == 0 ? Infinity : ((vertexDelta.forw[0] < 0 ? minx : maxx) - centroid.forw[0]) / vertexDelta.forw[0];
          var yRate = vertexDelta.forw[1] == 0 ? Infinity : ((vertexDelta.forw[1] < 0 ? miny : maxy) - centroid.forw[1]) / vertexDelta.forw[1]; // xRate, yRateが同じ値であれば重心と地図頂点を結ぶ線上に乗る

          if (Math.abs(xRate) / Math.abs(yRate) < 1.1) {
            var _point = {
              forw: [vertexDelta.forw[0] * xRate + centroid.forw[0], vertexDelta.forw[1] * xRate + centroid.forw[1]],
              bakw: [vertexDelta.bakw[0] * xRate + centroid.bakw[0], vertexDelta.bakw[1] * xRate + centroid.bakw[1]]
            };
            if (vertexDelta.forw[0] < 0) prev[3].push(_point);else prev[1].push(_point);
          }

          if (Math.abs(yRate) / Math.abs(xRate) < 1.1) {
            var _point2 = {
              forw: [vertexDelta.forw[0] * yRate + centroid.forw[0], vertexDelta.forw[1] * yRate + centroid.forw[1]],
              bakw: [vertexDelta.bakw[0] * yRate + centroid.bakw[0], vertexDelta.bakw[1] * yRate + centroid.bakw[1]]
            };
            if (vertexDelta.forw[1] < 0) prev[0].push(_point2);else prev[2].push(_point2);
          }

          return prev;
        }, [[], [], [], []]); // Calcurating Average scaling factors and rotation factors per orthants

        var orthant = Object.keys(convexBuf).reduce(function (prev, key, idx, array) {
          var forVertex = convexBuf[key].forw;
          var bakVertex = convexBuf[key].bakw;
          var vertexDelta = {
            forw: [forVertex[0] - centroid.forw[0], forVertex[1] - centroid.forw[1]]
          };
          vertexDelta.bakw = [bakVertex[0] - centroid.bakw[0], centroid.bakw[1] - bakVertex[1]];
          if (vertexDelta.forw[0] == 0 || vertexDelta.forw[1] == 0) return prev;
          var index = 0;
          if (vertexDelta.forw[0] > 0) index += 1;
          if (vertexDelta.forw[1] > 0) index += 2;
          prev[index].push([vertexDelta.forw, vertexDelta.bakw]);

          if (idx == array.length - 1) {
            // If some orthants have no Convex full polygon's vertices, use same average factor to every orthants
            return prev.length == prev.filter(function (val) {
              return val.length > 0;
            }).length && self.vertexMode == Tin.VERTEX_BIRDEYE ? prev : prev.reduce(function (pre, cur) {
              var ret = [pre[0].concat(cur)];
              return ret;
            }, [[]]);
          }

          return prev;
        }, [[], [], [], []]).map(function (item) {
          return (// Finalize calcuration of Average scaling factors and rotation factors
            item.reduce(function (prev, curr, index, arr) {
              if (!prev) prev = [Infinity, 0, 0]; // if (!prev) prev = [0, 0, 0];
              // var distanceSum = prev[0] + Math.sqrt(Math.pow(curr[0][0], 2) + Math.pow(curr[0][1], 2)) /
              //     Math.sqrt(Math.pow(curr[1][0], 2) + Math.pow(curr[1][1], 2));

              var distanceSum = Math.sqrt(Math.pow(curr[0][0], 2) + Math.pow(curr[0][1], 2)) / Math.sqrt(Math.pow(curr[1][0], 2) + Math.pow(curr[1][1], 2));
              distanceSum = distanceSum < prev[0] ? distanceSum : prev[0];
              var thetaDelta = Math.atan2(curr[0][0], curr[0][1]) - Math.atan2(curr[1][0], curr[1][1]);
              var sumThetaX = prev[1] + Math.cos(thetaDelta);
              var sumThetaY = prev[2] + Math.sin(thetaDelta);

              if (index == arr.length - 1) {
                // return [distanceSum / arr.length, Math.atan2(sumThetaY, sumThetaX)];
                return [distanceSum, Math.atan2(sumThetaY, sumThetaX)];
              }

              return [distanceSum, sumThetaX, sumThetaY];
            }, null)
          );
        }); // "Using same average factor to every orthants" case

        if (orthant.length == 1) orthant = [orthant[0], orthant[0], orthant[0], orthant[0]];
        return [orthant, centroid, expandConvex, pointsSetBbox];
      }).then(function (prevResults) {
        var orthant = prevResults[0];
        var centroid = prevResults[1];
        var expandConvex = prevResults[2];
        var pointsSet = prevResults[3][0];
        var bbox = prevResults[3][1]; // Calcurating Backward Bounding box of map

        var verticesSet = orthant.map(function (delta, index) {
          var forVertex = bbox[index];
          var forDelta = [forVertex[0] - centroid.forw[0], forVertex[1] - centroid.forw[1]];
          var forDistance = Math.sqrt(Math.pow(forDelta[0], 2) + Math.pow(forDelta[1], 2));
          var bakDistance = forDistance / delta[0];
          var forTheta = Math.atan2(forDelta[0], forDelta[1]);
          var bakTheta = forTheta - delta[1];
          var bakVertex = [centroid.bakw[0] + bakDistance * Math.sin(bakTheta), centroid.bakw[1] - bakDistance * Math.cos(bakTheta)];
          return {
            forw: forVertex,
            bakw: bakVertex
          };
        });
        var swap = verticesSet[2];
        verticesSet[2] = verticesSet[3];
        verticesSet[3] = swap; // Bounding Boxの頂点を、全てのgcpが内部に入るように引き延ばす

        var expandRate = [1, 1, 1, 1];

        var _loop3 = function _loop3(i) {
          var j = (i + 1) % 4;
          var side = (0, _helpers.lineString)([verticesSet[i].bakw, verticesSet[j].bakw]);
          var expands = expandConvex[i];
          expands.map(function (expand) {
            var expandLine = (0, _helpers.lineString)([centroid.bakw, expand.bakw]);
            var intersect = (0, _lineIntersect["default"])(side, expandLine);

            if (intersect.features.length > 0 && intersect.features[0].geometry) {
              var intersect_ = intersect.features[0];
              var expandDist = Math.sqrt(Math.pow(expand.bakw[0] - centroid.bakw[0], 2) + Math.pow(expand.bakw[1] - centroid.bakw[1], 2));
              var onSideDist = Math.sqrt(Math.pow(intersect_.geometry.coordinates[0] - centroid.bakw[0], 2) + Math.pow(intersect_.geometry.coordinates[1] - centroid.bakw[1], 2));
              var rate = expandDist / onSideDist;
              if (rate > expandRate[i]) expandRate[i] = rate;
              if (rate > expandRate[j]) expandRate[j] = rate;
            }
          });
        };

        for (var i = 0; i < 4; i++) {
          _loop3(i);
        }

        verticesSet = verticesSet.map(function (vertex, index) {
          var rate = expandRate[index];
          var point = [(vertex.bakw[0] - centroid.bakw[0]) * rate + centroid.bakw[0], (vertex.bakw[1] - centroid.bakw[1]) * rate + centroid.bakw[1]];
          return {
            forw: vertex.forw,
            bakw: point
          };
        });
        return [verticesSet, pointsSet];
      }).then(function (prevResults) {
        var verticesSet = prevResults[0];
        var pointsSet = prevResults[1];
        var verticesList = {
          forw: [],
          bakw: []
        };

        for (var i = 0; i < verticesSet.length; i++) {
          var forVertex = verticesSet[i].forw;
          var bakVertex = verticesSet[i].bakw;
          var forVertexFt = createPoint(forVertex, bakVertex, "bbox".concat(i));
          var bakVertexFt = counterPoint(forVertexFt);
          pointsSet.forw.features.push(forVertexFt);
          pointsSet.bakw.features.push(bakVertexFt);
          verticesList.forw.push(forVertexFt);
          verticesList.bakw.push(bakVertexFt);
        }

        self.pointsSet = pointsSet;
        self.tins = {
          forw: rotateVerticesTriangle((0, _constrainedTin["default"])(pointsSet.forw, pointsSet.edges, 'target'))
        };
        var prom;

        if (strict == Tin.MODE_STRICT || strict == Tin.MODE_AUTO) {
          prom = self.calcurateStrictTinAsync();
        } else {
          prom = Promise.resolve();
        }

        return prom.then(function () {
          if (strict == Tin.MODE_LOOSE || strict == Tin.MODE_AUTO && self.strict_status == Tin.STATUS_ERROR) {
            self.tins.bakw = rotateVerticesTriangle((0, _constrainedTin["default"])(pointsSet.bakw, pointsSet.edges, 'target'));
            delete self.kinks;
            self.strict_status = Tin.STATUS_LOOSE;
          }

          self.vertices_params = {
            forw: vertexCalc(verticesList.forw, self.centroid.forw),
            bakw: vertexCalc(verticesList.bakw, self.centroid.bakw)
          };
          return self.calculatePointsWeightAsync();
        })["catch"](function (err) {
          throw err;
        });
      })["catch"](function (err) {
        throw err;
      });
    }
  }, {
    key: "transform",
    value: function transform(apoint, backward, ignoreBounds) {
      if (backward && this.strict_status == Tin.STATUS_ERROR) throw 'Backward transform is not allowed if strict_status == "strict_error"'; // if (!this.tins) this.updateTin();

      if (this.yaxisMode == Tin.YAXIS_FOLLOW && backward) {
        apoint = [apoint[0], -1 * apoint[1]];
      }

      var tpoint = (0, _helpers.point)(apoint);

      if (this.bounds && !backward && !ignoreBounds) {
        if (!(0, _booleanPointInPolygon["default"])(tpoint, this.boundsPolygon)) return false;
      }

      var tins = backward ? this.tins.bakw : this.tins.forw;
      var verticesParams = backward ? this.vertices_params.bakw : this.vertices_params.forw;
      var centroid = backward ? this.centroid.bakw : this.centroid.forw;
      var weightBuffer = backward ? this.pointsWeightBuffer.bakw : this.pointsWeightBuffer.forw;
      var ret = transformArr(tpoint, tins, verticesParams, centroid, weightBuffer);

      if (this.bounds && backward && !ignoreBounds) {
        var rpoint = (0, _helpers.point)(ret);
        if (!(0, _booleanPointInPolygon["default"])(rpoint, this.boundsPolygon)) return false;
      } else if (this.yaxisMode == Tin.YAXIS_FOLLOW && !backward) {
        ret = [ret[0], -1 * ret[1]];
      }

      return ret;
    }
  }, {
    key: "calculatePointsWeightAsync",
    value: function calculatePointsWeightAsync() {
      var self = this;
      var calcTargets = ['forw'];
      if (self.strict_status == Tin.STATUS_LOOSE) calcTargets.push('bakw');
      var weightBuffer = {};
      return Promise.all(calcTargets.map(function (target) {
        weightBuffer[target] = {};
        var alreadyChecked = {};
        var tin = self.tins[target];
        return Promise.all(tin.features.map(function (tri) {
          var vtxes = ['a', 'b', 'c'];
          return new Promise(function (resolve) {
            for (var i = 0; i < 3; i++) {
              var j = (i + 1) % 3;
              var vi = vtxes[i];
              var vj = vtxes[j];
              var indexi = tri.properties[vi].index;
              var indexj = tri.properties[vj].index;
              var key = [indexi, indexj].sort().join('-');

              if (!alreadyChecked[key]) {
                var fromi = tri.geometry.coordinates[0][i];
                var fromj = tri.geometry.coordinates[0][j];
                var toi = tri.properties[vi].geom;
                var toj = tri.properties[vj].geom;
                alreadyChecked[key] = 1;
                var weight = Math.sqrt(Math.pow(toi[0] - toj[0], 2) + Math.pow(toi[1] - toj[1], 2)) / Math.sqrt(Math.pow(fromi[0] - fromj[0], 2) + Math.pow(fromi[1] - fromj[1], 2));
                if (!weightBuffer[target][indexi]) weightBuffer[target][indexi] = {};
                if (!weightBuffer[target][indexj]) weightBuffer[target][indexj] = {};
                weightBuffer[target][indexi][key] = weight;
                weightBuffer[target][indexj][key] = weight;
              }
            }

            resolve();
          });
        }))["catch"](function (err) {
          throw err;
        });
      })).then(function () {
        var pointsWeightBuffer = {};
        calcTargets.map(function (target) {
          pointsWeightBuffer[target] = {};
          if (self.strict_status == Tin.STATUS_STRICT) pointsWeightBuffer['bakw'] = {};
          Object.keys(weightBuffer[target]).map(function (vtx) {
            pointsWeightBuffer[target][vtx] = Object.keys(weightBuffer[target][vtx]).reduce(function (prev, key, idx, arr) {
              prev = prev + weightBuffer[target][vtx][key];
              return idx == arr.length - 1 ? prev / arr.length : prev;
            }, 0);
            if (self.strict_status == Tin.STATUS_STRICT) pointsWeightBuffer['bakw'][vtx] = 1 / pointsWeightBuffer[target][vtx];
          });
          pointsWeightBuffer[target]['cent'] = [0, 1, 2, 3].reduce(function (prev, curr) {
            var key = "bbox".concat(curr);
            prev = prev + pointsWeightBuffer[target][key];
            return curr == 3 ? prev / 4 : prev;
          }, 0);
          if (self.strict_status == Tin.STATUS_STRICT) pointsWeightBuffer['bakw']['cent'] = 1 / pointsWeightBuffer[target]['cent'];
        });
        self.pointsWeightBuffer = pointsWeightBuffer;
      })["catch"](function (err) {
        throw err;
      });
    }
  }]);

  return Tin;
}();

Tin.VERTEX_PLAIN = 'plain';
Tin.VERTEX_BIRDEYE = 'birdeye';
Tin.MODE_STRICT = 'strict';
Tin.MODE_AUTO = 'auto';
Tin.MODE_LOOSE = 'loose';
Tin.STATUS_STRICT = 'strict';
Tin.STATUS_ERROR = 'strict_error';
Tin.STATUS_LOOSE = 'loose';
Tin.YAXIS_FOLLOW = 'follow';
Tin.YAXIS_INVERT = 'invert';

function rotateVerticesTriangle(tins) {
  var features = tins.features;

  for (var i = 0; i < features.length; i++) {
    var feature = features[i];

    if ("".concat(feature.properties.a.index).substring(0, 4) == 'bbox' && "".concat(feature.properties.b.index).substring(0, 4) == 'bbox') {
      features[i] = {
        geometry: {
          type: 'Polygon',
          coordinates: [[feature.geometry.coordinates[0][2], feature.geometry.coordinates[0][0], feature.geometry.coordinates[0][1], feature.geometry.coordinates[0][2]]]
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
        type: 'Feature'
      };
    } else if ("".concat(feature.properties.c.index).substring(0, 4) == 'bbox' && "".concat(feature.properties.a.index).substring(0, 4) == 'bbox') {
      features[i] = {
        geometry: {
          type: 'Polygon',
          coordinates: [[feature.geometry.coordinates[0][1], feature.geometry.coordinates[0][2], feature.geometry.coordinates[0][0], feature.geometry.coordinates[0][1]]]
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
        type: 'Feature'
      };
    }
  }

  return tins;
}

function findIntersections(coords) {
  var arcs = new _mapshaperMaplat["default"].ArcCollection(coords);
  return _mapshaperMaplat["default"].findSegmentIntersections(arcs);
}

function vertexCalc(list, centroid) {
  var centCoord = centroid.geometry.coordinates;
  return [0, 1, 2, 3].map(function (i) {
    var j = (i + 1) % 4;
    var itemi = list[i];
    var itemj = list[j];
    var coord = itemi.geometry.coordinates;
    var radian = Math.atan2(coord[0] - centCoord[0], coord[1] - centCoord[1]);
    var coordinates = [centroid, itemi, itemj, centroid].map(function (point) {
      return point.geometry.coordinates;
    });
    var properties = {
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
    var tin = (0, _helpers.featureCollection)([(0, _helpers.polygon)([coordinates], properties)]);
    return [radian, tin];
  }).reduce(function (prev, curr) {
    prev[0].push(curr[0]);
    prev[1].push(curr[1]);
    return prev;
  }, [[], []]);
}

function normalizeRadian(target, noNegative) {
  var rangeFunc = noNegative ? function (val) {
    return !(val >= 0 && val < Math.PI * 2);
  } : function (val) {
    return !(val > -1 * Math.PI && val <= Math.PI);
  };

  while (rangeFunc(target)) {
    target = target + 2 * Math.PI * (target > 0 ? -1 : 1);
  }

  return target;
}

function decideUseVertex(radian, radianList) {
  var idel = normalizeRadian(radian - radianList[0]);
  var minTheta = Math.PI * 2;
  var minIndex;

  for (var i = 0; i < radianList.length; i++) {
    var j = (i + 1) % radianList.length;
    var jdel = normalizeRadian(radian - radianList[j]);
    var minDel = Math.min(Math.abs(idel), Math.abs(jdel));

    if (idel * jdel <= 0 && minDel < minTheta) {
      minTheta = minDel;
      minIndex = i;
    }

    idel = jdel;
  }

  return minIndex;
}

function createPoint(xy, geom, index) {
  return (0, _helpers.point)(xy, {
    target: {
      geom: geom,
      index: index
    }
  });
}

function counterPoint(apoint) {
  return (0, _helpers.point)(apoint.properties.target.geom, {
    target: {
      geom: apoint.geometry.coordinates,
      index: apoint.properties.target.index
    }
  });
}

function transformTin(of, tri, weightBuffer) {
  // eslint-disable-line no-unused-vars
  return (0, _helpers.point)(transformTinArr(of, tri, weightBuffer));
}

function transformTinArr(of, tri, weightBuffer) {
  var a = tri.geometry.coordinates[0][0];
  var b = tri.geometry.coordinates[0][1];
  var c = tri.geometry.coordinates[0][2];
  var o = of.geometry.coordinates;
  var ad = tri.properties.a.geom;
  var bd = tri.properties.b.geom;
  var cd = tri.properties.c.geom;
  var ab = [b[0] - a[0], b[1] - a[1]];
  var ac = [c[0] - a[0], c[1] - a[1]];
  var ao = [o[0] - a[0], o[1] - a[1]];
  var abd = [bd[0] - ad[0], bd[1] - ad[1]];
  var acd = [cd[0] - ad[0], cd[1] - ad[1]];
  var abv = (ac[1] * ao[0] - ac[0] * ao[1]) / (ab[0] * ac[1] - ab[1] * ac[0]);
  var acv = (ab[0] * ao[1] - ab[1] * ao[0]) / (ab[0] * ac[1] - ab[1] * ac[0]); // Considering weight

  if (weightBuffer) {
    var aW = weightBuffer[tri.properties.a.index];
    var bW = weightBuffer[tri.properties.b.index];
    var cW = weightBuffer[tri.properties.c.index];
    var nabv;

    if (abv < 0 || acv < 0 || 1 - abv - acv < 0) {
      var normB = abv / (abv + acv);
      var normC = acv / (abv + acv);
      nabv = abv / bW / (normB / bW + normC / cW);
      acv = acv / cW / (normB / bW + normC / cW);
    } else {
      nabv = abv / bW / (abv / bW + acv / cW + (1 - abv - acv) / aW);
      acv = acv / cW / (abv / bW + acv / cW + (1 - abv - acv) / aW);
    }

    abv = nabv;
  }

  var od = [abv * abd[0] + acv * acd[0] + ad[0], abv * abd[1] + acv * acd[1] + ad[1]];
  return od;
}

function useVertices(o, verticesParams, centroid, weightBuffer) {
  // eslint-disable-line no-unused-vars
  return (0, _helpers.point)(useVerticesArr(o, verticesParams, centroid, weightBuffer));
}

function useVerticesArr(o, verticesParams, centroid, weightBuffer) {
  var coord = o.geometry.coordinates;
  var centCoord = centroid.geometry.coordinates;
  var radian = Math.atan2(coord[0] - centCoord[0], coord[1] - centCoord[1]);
  var index = decideUseVertex(radian, verticesParams[0]);
  var tin = verticesParams[1][index];
  return transformTinArr(o, tin.features[0], weightBuffer);
}

function hit(point, tins) {
  for (var i = 0; i < tins.features.length; i++) {
    var inside = (0, _booleanPointInPolygon["default"])(point, tins.features[i]);

    if (inside) {
      return tins.features[i];
    }
  }
}

function transform(point, tins, verticesParams, centroid, weightBuffer) {
  // eslint-disable-line no-unused-vars
  return point(transformArr(point, tins, verticesParams, centroid, weightBuffer));
}

function transformArr(point, tins, verticesParams, centroid, weightBuffer) {
  var tin = hit(point, tins);
  return tin ? transformTinArr(point, tin, weightBuffer) : useVerticesArr(point, verticesParams, centroid, weightBuffer);
}

function counterTri(tri) {
  var coordinates = ['a', 'b', 'c', 'a'].map(function (key) {
    return tri.properties[key].geom;
  });
  var geoms = tri.geometry.coordinates[0];
  var props = tri.properties;
  var properties = {
    a: {
      geom: geoms[0],
      index: props['a'].index
    },
    b: {
      geom: geoms[1],
      index: props['b'].index
    },
    c: {
      geom: geoms[2],
      index: props['c'].index
    }
  };
  return (0, _helpers.polygon)([coordinates], properties);
}

function buildTri(points) {
  var coordinates = [0, 1, 2, 0].map(function (i) {
    return points[i][0][0];
  });
  var properties = {
    a: {
      geom: points[0][0][1],
      index: points[0][1]
    },
    b: {
      geom: points[1][0][1],
      index: points[1][1]
    },
    c: {
      geom: points[2][0][1],
      index: points[2][1]
    }
  };
  return (0, _helpers.polygon)([coordinates], properties);
}

function indexesToTri(indexes, points, edgeNodes, cent, bboxes, bakw) {
  var points_ = indexes.map(function (index) {
    var point_base = isFinite(index) ? points[index] : index == 'cent' ? cent : index == 'bbox0' ? bboxes[0] : index == 'bbox1' ? bboxes[1] : index == 'bbox2' ? bboxes[2] : index == 'bbox3' ? bboxes[3] : function () {
      var match = index.match(/edgeNode(\d+)/);

      if (match) {
        var nodeIndex = parseInt(match[1]);
        return edgeNodes[nodeIndex];
      }

      return undefined;
    }();
    return bakw ? [[point_base[1], point_base[0]], index] : [[point_base[0], point_base[1]], index];
  });
  return buildTri(points_);
}

function overlapCheckAsync(searchIndex) {
  var retValue = {
    forw: {},
    bakw: {}
  };
  return Promise.all(Object.keys(searchIndex).map(function (key) {
    return new Promise(function (resolve) {
      var searchResult = searchIndex[key];
      if (searchResult.length < 2) return resolve();
      ['forw', 'bakw'].map(function (dir) {
        var result = (0, _intersect["default"])(searchResult[0][dir], searchResult[1][dir]);
        if (!result || result.geometry.type == 'Point' || result.geometry.type == 'LineString') return resolve(); //const diff1 = difference(searchResult[0][dir], result);
        //const diff2 = difference(searchResult[1][dir], result);

        /* if (!diff1 || !diff2) {
            searchResult[dir][key] = 'Include case';
        } else {
            searchResult[dir][key] = 'Not include case';
        }*/

        resolve();
      });
    });
  })).then(function () {
    if (Object.keys(retValue.forw).length == 0) delete retValue.forw;
    if (Object.keys(retValue.bakw).length == 0) delete retValue.bakw;
    return retValue;
  })["catch"](function (err) {
    throw err;
  });
}

function insertSearchIndex(searchIndex, tris, tins) {
  var keys = calcSearchKeys(tris.forw);
  var bakKeys = calcSearchKeys(tris.bakw);
  if (JSON.stringify(keys) != JSON.stringify(bakKeys)) throw "".concat(JSON.stringify(tris, null, 2), "\n").concat(JSON.stringify(keys), "\n").concat(JSON.stringify(bakKeys));

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!searchIndex[key]) searchIndex[key] = [];
    searchIndex[key].push(tris);
  }

  if (tins) {
    tins.forw.features.push(tris.forw);
    tins.bakw.features.push(tris.bakw);
  }
}

function removeSearchIndex(searchIndex, tris, tins) {
  var keys = calcSearchKeys(tris.forw);
  var bakKeys = calcSearchKeys(tris.bakw);
  if (JSON.stringify(keys) != JSON.stringify(bakKeys)) throw "".concat(JSON.stringify(tris, null, 2), "\n").concat(JSON.stringify(keys), "\n").concat(JSON.stringify(bakKeys));

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var newArray = searchIndex[key].filter(function (eachTris) {
      return eachTris.forw != tris.forw;
    });
    if (newArray.length == 0) delete searchIndex[key];else searchIndex[key] = newArray;
  }

  if (tins) {
    var _newArray = tins.forw.features.filter(function (eachTri) {
      return eachTri != tris.forw;
    });

    tins.forw.features = _newArray;
    _newArray = tins.bakw.features.filter(function (eachTri) {
      return eachTri != tris.bakw;
    });
    tins.bakw.features = _newArray;
  }
}

function calcSearchKeys(tri) {
  var vtx = ['a', 'b', 'c'].map(function (key) {
    return tri.properties[key].index;
  });
  return [[0, 1], [0, 2], [1, 2], [0, 1, 2]].map(function (set) {
    var index = set.map(function (i) {
      return vtx[i];
    }).sort().join('-');
    return index;
  }).sort();
}

var _default = Tin;
exports["default"] = _default;

if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === "object" && module.exports) {
  // eslint-disable-line no-undef
  module.exports = Tin; // eslint-disable-line no-undef
}
//# sourceMappingURL=index.js.map