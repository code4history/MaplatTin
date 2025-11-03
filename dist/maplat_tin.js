import on from "@turf/boolean-point-in-polygon";
import an from "@turf/centroid";
import _e from "@turf/convex";
import { featureCollection as Ot, polygon as ce, lineString as xe, point as Yt } from "@turf/helpers";
import cn from "delaunator";
import fn from "@turf/line-intersect";
var hn = Object.defineProperty, un = (o, t, n) => t in o ? hn(o, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : o[t] = n, it = (o, t, n) => un(o, typeof t != "symbol" ? t + "" : t, n);
const It = 11102230246251565e-32, ut = 134217729, ln = (3 + 8 * It) * It;
function fe(o, t, n, e, i) {
  let s, r, a, h, f = t[0], l = e[0], c = 0, u = 0;
  l > f == l > -f ? (s = f, f = t[++c]) : (s = l, l = e[++u]);
  let d = 0;
  if (c < o && u < n)
    for (l > f == l > -f ? (r = f + s, a = s - (r - f), f = t[++c]) : (r = l + s, a = s - (r - l), l = e[++u]), s = r, a !== 0 && (i[d++] = a); c < o && u < n; )
      l > f == l > -f ? (r = s + f, h = r - s, a = s - (r - h) + (f - h), f = t[++c]) : (r = s + l, h = r - s, a = s - (r - h) + (l - h), l = e[++u]), s = r, a !== 0 && (i[d++] = a);
  for (; c < o; )
    r = s + f, h = r - s, a = s - (r - h) + (f - h), f = t[++c], s = r, a !== 0 && (i[d++] = a);
  for (; u < n; )
    r = s + l, h = r - s, a = s - (r - h) + (l - h), l = e[++u], s = r, a !== 0 && (i[d++] = a);
  return (s !== 0 || d === 0) && (i[d++] = s), d;
}
function dn(o, t) {
  let n = t[0];
  for (let e = 1; e < o; e++) n += t[e];
  return n;
}
function Jt(o) {
  return new Float64Array(o);
}
const pn = (3 + 16 * It) * It, gn = (2 + 12 * It) * It, mn = (9 + 64 * It) * It * It, Ut = Jt(4), Me = Jt(8), Se = Jt(12), ve = Jt(16), dt = Jt(4);
function wn(o, t, n, e, i, s, r) {
  let a, h, f, l, c, u, d, y, g, w, m, S, E, O, C, I, F, z;
  const L = o - i, tt = n - i, et = t - s, X = e - s;
  O = L * X, u = ut * L, d = u - (u - L), y = L - d, u = ut * X, g = u - (u - X), w = X - g, C = y * w - (O - d * g - y * g - d * w), I = et * tt, u = ut * et, d = u - (u - et), y = et - d, u = ut * tt, g = u - (u - tt), w = tt - g, F = y * w - (I - d * g - y * g - d * w), m = C - F, c = C - m, Ut[0] = C - (m + c) + (c - F), S = O + m, c = S - O, E = O - (S - c) + (m - c), m = E - I, c = E - m, Ut[1] = E - (m + c) + (c - I), z = S + m, c = z - S, Ut[2] = S - (z - c) + (m - c), Ut[3] = z;
  let Z = dn(4, Ut), p = gn * r;
  if (Z >= p || -Z >= p || (c = o - L, a = o - (L + c) + (c - i), c = n - tt, f = n - (tt + c) + (c - i), c = t - et, h = t - (et + c) + (c - s), c = e - X, l = e - (X + c) + (c - s), a === 0 && h === 0 && f === 0 && l === 0) || (p = mn * r + ln * Math.abs(Z), Z += L * l + X * a - (et * f + tt * h), Z >= p || -Z >= p)) return Z;
  O = a * X, u = ut * a, d = u - (u - a), y = a - d, u = ut * X, g = u - (u - X), w = X - g, C = y * w - (O - d * g - y * g - d * w), I = h * tt, u = ut * h, d = u - (u - h), y = h - d, u = ut * tt, g = u - (u - tt), w = tt - g, F = y * w - (I - d * g - y * g - d * w), m = C - F, c = C - m, dt[0] = C - (m + c) + (c - F), S = O + m, c = S - O, E = O - (S - c) + (m - c), m = E - I, c = E - m, dt[1] = E - (m + c) + (c - I), z = S + m, c = z - S, dt[2] = S - (z - c) + (m - c), dt[3] = z;
  const b = fe(4, Ut, 4, dt, Me);
  O = L * l, u = ut * L, d = u - (u - L), y = L - d, u = ut * l, g = u - (u - l), w = l - g, C = y * w - (O - d * g - y * g - d * w), I = et * f, u = ut * et, d = u - (u - et), y = et - d, u = ut * f, g = u - (u - f), w = f - g, F = y * w - (I - d * g - y * g - d * w), m = C - F, c = C - m, dt[0] = C - (m + c) + (c - F), S = O + m, c = S - O, E = O - (S - c) + (m - c), m = E - I, c = E - m, dt[1] = E - (m + c) + (c - I), z = S + m, c = z - S, dt[2] = S - (z - c) + (m - c), dt[3] = z;
  const _ = fe(b, Me, 4, dt, Se);
  O = a * l, u = ut * a, d = u - (u - a), y = a - d, u = ut * l, g = u - (u - l), w = l - g, C = y * w - (O - d * g - y * g - d * w), I = h * f, u = ut * h, d = u - (u - h), y = h - d, u = ut * f, g = u - (u - f), w = f - g, F = y * w - (I - d * g - y * g - d * w), m = C - F, c = C - m, dt[0] = C - (m + c) + (c - F), S = O + m, c = S - O, E = O - (S - c) + (m - c), m = E - I, c = E - m, dt[1] = E - (m + c) + (c - I), z = S + m, c = z - S, dt[2] = S - (z - c) + (m - c), dt[3] = z;
  const M = fe(_, Se, 4, dt, ve);
  return ve[M - 1];
}
function bn(o, t, n, e, i, s) {
  const r = (t - s) * (n - i), a = (o - i) * (e - s), h = r - a, f = Math.abs(r + a);
  return Math.abs(h) >= pn * f ? h : -wn(o, t, n, e, i, s, f);
}
function yn(o, t) {
  var n, e, i = 0, s, r, a, h, f, l, c, u = o[0], d = o[1], y = t.length;
  for (n = 0; n < y; n++) {
    e = 0;
    var g = t[n], w = g.length - 1;
    if (l = g[0], l[0] !== g[w][0] && l[1] !== g[w][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (r = l[0] - u, a = l[1] - d, e; e < w; e++) {
      if (c = g[e + 1], h = c[0] - u, f = c[1] - d, a === 0 && f === 0) {
        if (h <= 0 && r >= 0 || r <= 0 && h >= 0)
          return 0;
      } else if (f >= 0 && a <= 0 || f <= 0 && a >= 0) {
        if (s = bn(r, h, a, f, 0, 0), s === 0)
          return 0;
        (s > 0 && f > 0 && a <= 0 || s < 0 && f <= 0 && a > 0) && i++;
      }
      l = c, a = f, r = h;
    }
  }
  return i % 2 !== 0;
}
function Xe(o, t, n = {}) {
  const e = { type: "Feature" };
  return (n.id === 0 || n.id) && (e.id = n.id), n.bbox && (e.bbox = n.bbox), e.properties = t || {}, e.geometry = o, e;
}
function Xt(o, t, n = {}) {
  if (!o)
    throw new Error("coordinates is required");
  if (!Array.isArray(o))
    throw new Error("coordinates must be an Array");
  if (o.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!Ae(o[0]) || !Ae(o[1]))
    throw new Error("coordinates must contain numbers");
  return Xe({
    type: "Point",
    coordinates: o
  }, t, n);
}
function qe(o, t, n = {}) {
  for (const e of o) {
    if (e.length < 4)
      throw new Error(
        "Each LinearRing of a Polygon must have 4 or more Positions."
      );
    if (e[e.length - 1].length !== e[0].length)
      throw new Error("First and last Position are not equivalent.");
    for (let i = 0; i < e[e.length - 1].length; i++)
      if (e[e.length - 1][i] !== e[0][i])
        throw new Error("First and last Position are not equivalent.");
  }
  return Xe({
    type: "Polygon",
    coordinates: o
  }, t, n);
}
function Ft(o, t = {}) {
  const n = { type: "FeatureCollection" };
  return t.id && (n.id = t.id), t.bbox && (n.bbox = t.bbox), n.features = o, n;
}
function Ae(o) {
  return !isNaN(o) && o !== null && !Array.isArray(o);
}
function kn(o) {
  if (!o)
    throw new Error("coord is required");
  if (!Array.isArray(o)) {
    if (o.type === "Feature" && o.geometry !== null && o.geometry.type === "Point")
      return [...o.geometry.coordinates];
    if (o.type === "Point")
      return [...o.coordinates];
  }
  if (Array.isArray(o) && o.length >= 2 && !Array.isArray(o[0]) && !Array.isArray(o[1]))
    return [...o];
  throw new Error("coord must be GeoJSON Point or an Array of numbers");
}
function Ee(o) {
  if (Array.isArray(o))
    return o;
  if (o.type === "Feature") {
    if (o.geometry !== null)
      return o.geometry.coordinates;
  } else if (o.coordinates)
    return o.coordinates;
  throw new Error(
    "coords must be GeoJSON Feature, Geometry Object or an Array"
  );
}
function _n(o) {
  return o.type === "Feature" ? o.geometry : o;
}
function xn(o, t, n = {}) {
  if (!o)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const e = kn(o), i = _n(t), s = i.type, r = t.bbox;
  let a = i.coordinates;
  if (r && Mn(e, r) === !1)
    return !1;
  s === "Polygon" && (a = [a]);
  let h = !1;
  for (var f = 0; f < a.length; ++f) {
    const l = yn(e, a[f]);
    if (l === 0) return !n.ignoreBoundary;
    l && (h = !0);
  }
  return h;
}
function Mn(o, t) {
  return t[0] <= o[0] && t[1] <= o[1] && t[2] >= o[0] && t[3] >= o[1];
}
var we = xn;
function Oe(o) {
  const t = o.features;
  for (let n = 0; n < t.length; n++) {
    const e = t[n];
    `${e.properties.a.index}`.substring(0, 1) === "b" && `${e.properties.b.index}`.substring(0, 1) === "b" ? t[n] = {
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            e.geometry.coordinates[0][2],
            e.geometry.coordinates[0][0],
            e.geometry.coordinates[0][1],
            e.geometry.coordinates[0][2]
          ]
        ]
      },
      properties: {
        a: {
          geom: e.properties.c.geom,
          index: e.properties.c.index
        },
        b: {
          geom: e.properties.a.geom,
          index: e.properties.a.index
        },
        c: {
          geom: e.properties.b.geom,
          index: e.properties.b.index
        }
      },
      type: "Feature"
    } : `${e.properties.c.index}`.substring(0, 1) === "b" && `${e.properties.a.index}`.substring(0, 1) === "b" && (t[n] = {
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            e.geometry.coordinates[0][1],
            e.geometry.coordinates[0][2],
            e.geometry.coordinates[0][0],
            e.geometry.coordinates[0][1]
          ]
        ]
      },
      properties: {
        a: {
          geom: e.properties.b.geom,
          index: e.properties.b.index
        },
        b: {
          geom: e.properties.c.geom,
          index: e.properties.c.index
        },
        c: {
          geom: e.properties.a.geom,
          index: e.properties.a.index
        }
      },
      type: "Feature"
    });
  }
  return o;
}
function We(o) {
  const t = ["a", "b", "c", "a"].map(
    (s) => o.properties[s].geom
  ), n = o.geometry.coordinates[0], e = o.properties, i = {
    a: { geom: n[0], index: e.a.index },
    b: { geom: n[1], index: e.b.index },
    c: { geom: n[2], index: e.c.index }
  };
  return qe([t], i);
}
function Sn(o) {
  const t = [0, 1, 2, 0].map((e) => o[e][0][0]), n = {
    a: { geom: o[0][0][1], index: o[0][1] },
    b: { geom: o[1][0][1], index: o[1][1] },
    c: { geom: o[2][0][1], index: o[2][1] }
  };
  return qe([t], n);
}
function Qt(o, t, n, e, i, s = !1, r) {
  const a = o.map(
    (h) => {
      (!r || r < 2.00703) && (h = Ye(h));
      const f = isFinite(h) ? t[h] : h === "c" ? e : h === "b0" ? i[0] : h === "b1" ? i[1] : h === "b2" ? i[2] : h === "b3" ? i[3] : (function() {
        const l = h.match(/e(\d+)/);
        if (l) {
          const c = parseInt(l[1]);
          return n[c];
        }
        throw "Bad index value for indexesToTri";
      })();
      return s ? [[f[1], f[0]], h] : [[f[0], f[1]], h];
    }
  );
  return Sn(a);
}
function Ye(o) {
  return typeof o == "number" ? o : o.replace(/^(c|e|b)(?:ent|dgeNode|box)(\d+)?$/, "$1$2");
}
function Je(o, t) {
  return t && t >= 2.00703 || Array.isArray(o[0]) ? o : o.map((n) => [
    n.illstNodes,
    n.mercNodes,
    n.startEnd
  ]);
}
function Ie(o, t) {
  for (let n = 0; n < t.features.length; n++)
    if (we(o, t.features[n]))
      return t.features[n];
}
function Qe(o, t, n) {
  const e = t.geometry.coordinates[0][0], i = t.geometry.coordinates[0][1], s = t.geometry.coordinates[0][2], r = o.geometry.coordinates, a = t.properties.a.geom, h = t.properties.b.geom, f = t.properties.c.geom, l = [i[0] - e[0], i[1] - e[1]], c = [s[0] - e[0], s[1] - e[1]], u = [r[0] - e[0], r[1] - e[1]], d = [h[0] - a[0], h[1] - a[1]], y = [f[0] - a[0], f[1] - a[1]];
  let g = (c[1] * u[0] - c[0] * u[1]) / (l[0] * c[1] - l[1] * c[0]), w = (l[0] * u[1] - l[1] * u[0]) / (l[0] * c[1] - l[1] * c[0]);
  if (n) {
    const m = n[t.properties.a.index], S = n[t.properties.b.index], E = n[t.properties.c.index];
    let O;
    if (g < 0 || w < 0 || 1 - g - w < 0) {
      const C = g / (g + w), I = w / (g + w);
      O = g / S / (C / S + I / E), w = w / E / (C / S + I / E);
    } else
      O = g / S / (g / S + w / E + (1 - g - w) / m), w = w / E / (g / S + w / E + (1 - g - w) / m);
    g = O;
  }
  return [
    g * d[0] + w * y[0] + a[0],
    g * d[1] + w * y[1] + a[1]
  ];
}
function vn(o, t, n, e) {
  const i = o.geometry.coordinates, s = n.geometry.coordinates, r = Math.atan2(i[0] - s[0], i[1] - s[1]), a = An(r, t[0]);
  if (a === void 0)
    throw new Error("Unable to determine vertex index");
  const h = t[1][a];
  return Qe(o, h.features[0], e);
}
function re(o, t, n, e, i, s, r, a) {
  let h;
  if (r && (h = Ie(o, Ft([r]))), !h) {
    if (n) {
      const f = o.geometry.coordinates, l = n.gridNum, c = n.xOrigin, u = n.yOrigin, d = n.xUnit, y = n.yUnit, g = n.gridCache, w = St(f[0], c, d, l), m = St(f[1], u, y, l), S = g[w] ? g[w][m] ? g[w][m] : [] : [];
      t = Ft(S.map((E) => t.features[E]));
    }
    h = Ie(o, t);
  }
  return a && a(h), h ? Qe(o, h, s) : vn(o, e, i, s);
}
function St(o, t, n, e) {
  let i = Math.floor((o - t) / n);
  return i >= e && (i = e - 1), i;
}
function An(o, t) {
  let n = Te(o - t[0]), e = Math.PI * 2, i;
  for (let s = 0; s < t.length; s++) {
    const r = (s + 1) % t.length, a = Te(o - t[r]), h = Math.min(Math.abs(n), Math.abs(a));
    n * a <= 0 && h < e && (e = h, i = s), n = a;
  }
  return i;
}
function Te(o, t = !1) {
  const n = t ? function(e) {
    return !(e >= 0 && e < Math.PI * 2);
  } : function(e) {
    return !(e > -1 * Math.PI && e <= Math.PI);
  };
  for (; n(o); )
    o = o + 2 * Math.PI * (o > 0 ? -1 : 1);
  return o;
}
const be = 2.00703, yt = class kt {
  constructor() {
    it(this, "points", []), it(this, "pointsWeightBuffer"), it(this, "strict_status"), it(this, "vertices_params"), it(this, "centroid"), it(this, "edgeNodes"), it(this, "edges"), it(this, "tins"), it(this, "kinks"), it(this, "yaxisMode", kt.YAXIS_INVERT), it(this, "strictMode", kt.MODE_AUTO), it(this, "vertexMode", kt.VERTEX_PLAIN), it(this, "bounds"), it(this, "boundsPolygon"), it(this, "wh"), it(this, "xy"), it(this, "indexedTins"), it(this, "stateFull", !1), it(this, "stateTriangle"), it(this, "stateBackward");
  }
  /**
   * コンパイルされた設定を適用します
   * 
   * @param compiled - コンパイルされた設定オブジェクト
   * @returns 変換に必要な主要なオブジェクトのセット
   * 
   * 以下の処理を行います：
   * 1. バージョンに応じた設定の解釈
   * 2. 各種パラメータの復元
   * 3. TINネットワークの再構築
   * 4. インデックスの作成
   */
  setCompiled(t) {
    if (t.version || !t.tins && t.points && t.tins_points) {
      this.points = t.points, this.pointsWeightBuffer = !t.version || t.version < 2.00703 ? ["forw", "bakw"].reduce((e, i) => {
        const s = t.weight_buffer[i];
        return s && (e[i] = Object.keys(s).reduce((r, a) => {
          const h = Ye(a);
          return r[h] = s[a], r;
        }, {})), e;
      }, {}) : t.weight_buffer, t.strict_status ? this.strict_status = t.strict_status : t.kinks_points ? this.strict_status = kt.STATUS_ERROR : t.tins_points.length == 2 ? this.strict_status = kt.STATUS_LOOSE : this.strict_status = kt.STATUS_STRICT, this.vertices_params = {
        forw: [t.vertices_params[0]],
        bakw: [t.vertices_params[1]]
      }, this.vertices_params.forw[1] = [0, 1, 2, 3].map((e) => {
        const i = (e + 1) % 4, s = Qt(
          ["c", `b${e}`, `b${i}`],
          t.points,
          t.edgeNodes || [],
          t.centroid_point,
          t.vertices_points,
          !1,
          be
        );
        return Ft([s]);
      }), this.vertices_params.bakw[1] = [0, 1, 2, 3].map((e) => {
        const i = (e + 1) % 4, s = Qt(
          ["c", `b${e}`, `b${i}`],
          t.points,
          t.edgeNodes || [],
          t.centroid_point,
          t.vertices_points,
          !0,
          be
        );
        return Ft([s]);
      }), this.centroid = {
        forw: Xt(t.centroid_point[0], {
          target: {
            geom: t.centroid_point[1],
            index: "c"
          }
        }),
        bakw: Xt(t.centroid_point[1], {
          target: {
            geom: t.centroid_point[0],
            index: "c"
          }
        })
      }, this.edges = Je(t.edges || []), this.edgeNodes = t.edgeNodes || [];
      const n = t.tins_points.length == 1 ? 0 : 1;
      this.tins = {
        forw: Ft(
          t.tins_points[0].map(
            (e) => Qt(
              e,
              t.points,
              t.edgeNodes || [],
              t.centroid_point,
              t.vertices_points,
              !1,
              t.version
            )
          )
        ),
        bakw: Ft(
          t.tins_points[n].map(
            (e) => Qt(
              e,
              t.points,
              t.edgeNodes || [],
              t.centroid_point,
              t.vertices_points,
              !0,
              t.version
            )
          )
        )
      }, this.addIndexedTin(), t.kinks_points && (this.kinks = {
        bakw: Ft(
          t.kinks_points.map((e) => Xt(e))
        )
      }), t.yaxisMode ? this.yaxisMode = t.yaxisMode : this.yaxisMode = kt.YAXIS_INVERT, t.vertexMode && (this.vertexMode = t.vertexMode), t.strictMode && (this.strictMode = t.strictMode), t.bounds ? (this.bounds = t.bounds, this.boundsPolygon = t.boundsPolygon, this.xy = t.xy, this.wh = t.wh) : (this.xy = [0, 0], t.wh && (this.wh = t.wh), this.bounds = void 0, this.boundsPolygon = void 0);
    } else {
      t = JSON.parse(
        JSON.stringify(t).replace('"cent"', '"c"').replace(/"bbox(\d+)"/g, '"b$1"')
      ), this.tins = t.tins, this.addIndexedTin(), this.strict_status = t.strict_status, this.pointsWeightBuffer = t.weight_buffer, this.vertices_params = t.vertices_params, this.centroid = t.centroid, this.kinks = t.kinks;
      const n = [];
      for (let e = 0; e < this.tins.forw.features.length; e++) {
        const i = this.tins.forw.features[e];
        ["a", "b", "c"].map((s, r) => {
          const a = i.geometry.coordinates[0][r], h = i.properties[s].geom, f = i.properties[s].index;
          typeof f == "number" && (n[f] = [a, h]);
        });
      }
      this.points = n;
    }
  }
  /**
   * TINネットワークのインデックスを作成します
   * 
   * インデックスは変換処理を高速化するために使用されます。
   * グリッド形式のインデックスを作成し、各グリッドに
   * 含まれる三角形を記録します。
   */
  addIndexedTin() {
    const t = this.tins, n = t.forw, e = t.bakw, i = Math.ceil(Math.sqrt(n.features.length));
    if (i < 3) {
      this.indexedTins = void 0;
      return;
    }
    let s = [], r = [];
    const a = n.features.map((g) => {
      let w = [];
      return Ee(g)[0].map((m) => {
        s.length === 0 ? s = [Array.from(m), Array.from(m)] : (m[0] < s[0][0] && (s[0][0] = m[0]), m[0] > s[1][0] && (s[1][0] = m[0]), m[1] < s[0][1] && (s[0][1] = m[1]), m[1] > s[1][1] && (s[1][1] = m[1])), w.length === 0 ? w = [Array.from(m), Array.from(m)] : (m[0] < w[0][0] && (w[0][0] = m[0]), m[0] > w[1][0] && (w[1][0] = m[0]), m[1] < w[0][1] && (w[0][1] = m[1]), m[1] > w[1][1] && (w[1][1] = m[1]));
      }), w;
    }), h = (s[1][0] - s[0][0]) / i, f = (s[1][1] - s[0][1]) / i, l = a.reduce(
      (g, w, m) => {
        const S = St(
          w[0][0],
          s[0][0],
          h,
          i
        ), E = St(
          w[1][0],
          s[0][0],
          h,
          i
        ), O = St(
          w[0][1],
          s[0][1],
          f,
          i
        ), C = St(
          w[1][1],
          s[0][1],
          f,
          i
        );
        for (let I = S; I <= E; I++) {
          g[I] || (g[I] = []);
          for (let F = O; F <= C; F++)
            g[I][F] || (g[I][F] = []), g[I][F].push(m);
        }
        return g;
      },
      []
    ), c = e.features.map((g) => {
      let w = [];
      return Ee(g)[0].map((m) => {
        r.length === 0 ? r = [Array.from(m), Array.from(m)] : (m[0] < r[0][0] && (r[0][0] = m[0]), m[0] > r[1][0] && (r[1][0] = m[0]), m[1] < r[0][1] && (r[0][1] = m[1]), m[1] > r[1][1] && (r[1][1] = m[1])), w.length === 0 ? w = [Array.from(m), Array.from(m)] : (m[0] < w[0][0] && (w[0][0] = m[0]), m[0] > w[1][0] && (w[1][0] = m[0]), m[1] < w[0][1] && (w[0][1] = m[1]), m[1] > w[1][1] && (w[1][1] = m[1]));
      }), w;
    }), u = (r[1][0] - r[0][0]) / i, d = (r[1][1] - r[0][1]) / i, y = c.reduce(
      (g, w, m) => {
        const S = St(
          w[0][0],
          r[0][0],
          u,
          i
        ), E = St(
          w[1][0],
          r[0][0],
          u,
          i
        ), O = St(
          w[0][1],
          r[0][1],
          d,
          i
        ), C = St(
          w[1][1],
          r[0][1],
          d,
          i
        );
        for (let I = S; I <= E; I++) {
          g[I] || (g[I] = []);
          for (let F = O; F <= C; F++)
            g[I][F] || (g[I][F] = []), g[I][F].push(m);
        }
        return g;
      },
      []
    );
    this.indexedTins = {
      forw: {
        gridNum: i,
        xOrigin: s[0][0],
        yOrigin: s[0][1],
        xUnit: h,
        yUnit: f,
        gridCache: l
      },
      bakw: {
        gridNum: i,
        xOrigin: r[0][0],
        yOrigin: r[0][1],
        xUnit: u,
        yUnit: d,
        gridCache: y
      }
    };
  }
  /**
   * 座標変換を実行します
   * 
   * @param apoint - 変換する座標
   * @param backward - 逆方向の変換かどうか
   * @param ignoreBounds - 境界チェックを無視するかどうか
   * @returns 変換後の座標、または境界外の場合はfalse
   * 
   * @throws {Error} 逆方向変換が許可されていない状態での逆変換時
   */
  transform(t, n, e) {
    if (n && this.strict_status == kt.STATUS_ERROR)
      throw 'Backward transform is not allowed if strict_status == "strict_error"';
    this.yaxisMode == kt.YAXIS_FOLLOW && n && (t = [t[0], -1 * t[1]]);
    const i = Xt(t);
    if (this.bounds && !n && !e && !we(i, this.boundsPolygon))
      return !1;
    const s = n ? this.tins.bakw : this.tins.forw, r = n ? this.indexedTins.bakw : this.indexedTins.forw, a = n ? this.vertices_params.bakw : this.vertices_params.forw, h = n ? this.centroid.bakw : this.centroid.forw, f = n ? this.pointsWeightBuffer.bakw : this.pointsWeightBuffer.forw;
    let l, c;
    this.stateFull && (this.stateBackward == n ? l = this.stateTriangle : (this.stateBackward = n, this.stateTriangle = void 0), c = (d) => {
      this.stateTriangle = d;
    });
    let u = re(
      i,
      s,
      r,
      a,
      h,
      f,
      l,
      c
    );
    if (this.bounds && n && !e) {
      const d = Xt(u);
      if (!we(d, this.boundsPolygon)) return !1;
    } else this.yaxisMode == kt.YAXIS_FOLLOW && !n && (u = [u[0], -1 * u[1]]);
    return u;
  }
};
it(yt, "VERTEX_PLAIN", "plain"), it(yt, "VERTEX_BIRDEYE", "birdeye"), it(yt, "MODE_STRICT", "strict"), it(yt, "MODE_AUTO", "auto"), it(yt, "MODE_LOOSE", "loose"), it(yt, "STATUS_STRICT", "strict"), it(yt, "STATUS_ERROR", "strict_error"), it(yt, "STATUS_LOOSE", "loose"), it(yt, "YAXIS_FOLLOW", "follow"), it(yt, "YAXIS_INVERT", "invert");
let En = yt;
const lt = 11102230246251565e-32, N = 134217729, Ke = (3 + 8 * lt) * lt;
function ct(o, t, n, e, i) {
  let s, r, a, h, f = t[0], l = e[0], c = 0, u = 0;
  l > f == l > -f ? (s = f, f = t[++c]) : (s = l, l = e[++u]);
  let d = 0;
  if (c < o && u < n)
    for (l > f == l > -f ? (r = f + s, a = s - (r - f), f = t[++c]) : (r = l + s, a = s - (r - l), l = e[++u]), s = r, a !== 0 && (i[d++] = a); c < o && u < n; )
      l > f == l > -f ? (r = s + f, h = r - s, a = s - (r - h) + (f - h), f = t[++c]) : (r = s + l, h = r - s, a = s - (r - h) + (l - h), l = e[++u]), s = r, a !== 0 && (i[d++] = a);
  for (; c < o; )
    r = s + f, h = r - s, a = s - (r - h) + (f - h), f = t[++c], s = r, a !== 0 && (i[d++] = a);
  for (; u < n; )
    r = s + l, h = r - s, a = s - (r - h) + (l - h), l = e[++u], s = r, a !== 0 && (i[d++] = a);
  return (s !== 0 || d === 0) && (i[d++] = s), d;
}
function bt(o, t, n, e, i, s, r, a) {
  return ct(ct(o, t, n, e, r), r, i, s, a);
}
function x(o, t, n, e) {
  let i, s, r, a, h, f, l, c, u, d, y;
  l = N * n, d = l - (l - n), y = n - d;
  let g = t[0];
  i = g * n, l = N * g, c = l - (l - g), u = g - c, r = u * y - (i - c * d - u * d - c * y);
  let w = 0;
  r !== 0 && (e[w++] = r);
  for (let m = 1; m < o; m++)
    g = t[m], a = g * n, l = N * g, c = l - (l - g), u = g - c, h = u * y - (a - c * d - u * d - c * y), s = i + h, f = s - i, r = i - (s - f) + (h - f), r !== 0 && (e[w++] = r), i = a + s, r = s - (i - a), r !== 0 && (e[w++] = r);
  return (i !== 0 || w === 0) && (e[w++] = i), w;
}
function Ge(o, t) {
  let n = t[0];
  for (let e = 1; e < o; e++) n += t[e];
  return n;
}
function Q(o) {
  return new Float64Array(o);
}
const On = (3 + 16 * lt) * lt, In = (2 + 12 * lt) * lt, Tn = (9 + 64 * lt) * lt * lt, Lt = Q(4), Ne = Q(8), Re = Q(12), Ce = Q(16), pt = Q(4);
function Nn(o, t, n, e, i, s, r) {
  let a, h, f, l, c, u, d, y, g, w, m, S, E, O, C, I, F, z;
  const L = o - i, tt = n - i, et = t - s, X = e - s;
  O = L * X, u = N * L, d = u - (u - L), y = L - d, u = N * X, g = u - (u - X), w = X - g, C = y * w - (O - d * g - y * g - d * w), I = et * tt, u = N * et, d = u - (u - et), y = et - d, u = N * tt, g = u - (u - tt), w = tt - g, F = y * w - (I - d * g - y * g - d * w), m = C - F, c = C - m, Lt[0] = C - (m + c) + (c - F), S = O + m, c = S - O, E = O - (S - c) + (m - c), m = E - I, c = E - m, Lt[1] = E - (m + c) + (c - I), z = S + m, c = z - S, Lt[2] = S - (z - c) + (m - c), Lt[3] = z;
  let Z = Ge(4, Lt), p = In * r;
  if (Z >= p || -Z >= p || (c = o - L, a = o - (L + c) + (c - i), c = n - tt, f = n - (tt + c) + (c - i), c = t - et, h = t - (et + c) + (c - s), c = e - X, l = e - (X + c) + (c - s), a === 0 && h === 0 && f === 0 && l === 0) || (p = Tn * r + Ke * Math.abs(Z), Z += L * l + X * a - (et * f + tt * h), Z >= p || -Z >= p)) return Z;
  O = a * X, u = N * a, d = u - (u - a), y = a - d, u = N * X, g = u - (u - X), w = X - g, C = y * w - (O - d * g - y * g - d * w), I = h * tt, u = N * h, d = u - (u - h), y = h - d, u = N * tt, g = u - (u - tt), w = tt - g, F = y * w - (I - d * g - y * g - d * w), m = C - F, c = C - m, pt[0] = C - (m + c) + (c - F), S = O + m, c = S - O, E = O - (S - c) + (m - c), m = E - I, c = E - m, pt[1] = E - (m + c) + (c - I), z = S + m, c = z - S, pt[2] = S - (z - c) + (m - c), pt[3] = z;
  const b = ct(4, Lt, 4, pt, Ne);
  O = L * l, u = N * L, d = u - (u - L), y = L - d, u = N * l, g = u - (u - l), w = l - g, C = y * w - (O - d * g - y * g - d * w), I = et * f, u = N * et, d = u - (u - et), y = et - d, u = N * f, g = u - (u - f), w = f - g, F = y * w - (I - d * g - y * g - d * w), m = C - F, c = C - m, pt[0] = C - (m + c) + (c - F), S = O + m, c = S - O, E = O - (S - c) + (m - c), m = E - I, c = E - m, pt[1] = E - (m + c) + (c - I), z = S + m, c = z - S, pt[2] = S - (z - c) + (m - c), pt[3] = z;
  const _ = ct(b, Ne, 4, pt, Re);
  O = a * l, u = N * a, d = u - (u - a), y = a - d, u = N * l, g = u - (u - l), w = l - g, C = y * w - (O - d * g - y * g - d * w), I = h * f, u = N * h, d = u - (u - h), y = h - d, u = N * f, g = u - (u - f), w = f - g, F = y * w - (I - d * g - y * g - d * w), m = C - F, c = C - m, pt[0] = C - (m + c) + (c - F), S = O + m, c = S - O, E = O - (S - c) + (m - c), m = E - I, c = E - m, pt[1] = E - (m + c) + (c - I), z = S + m, c = z - S, pt[2] = S - (z - c) + (m - c), pt[3] = z;
  const M = ct(_, Re, 4, pt, Ce);
  return Ce[M - 1];
}
function qt(o, t, n, e, i, s) {
  const r = (t - s) * (n - i), a = (o - i) * (e - s), h = r - a, f = Math.abs(r + a);
  return Math.abs(h) >= On * f ? h : -Nn(o, t, n, e, i, s, f);
}
const Rn = (10 + 96 * lt) * lt, Cn = (4 + 48 * lt) * lt, Bn = (44 + 576 * lt) * lt * lt, Tt = Q(4), Nt = Q(4), Rt = Q(4), _t = Q(4), xt = Q(4), Mt = Q(4), gt = Q(4), mt = Q(4), he = Q(8), ue = Q(8), le = Q(8), de = Q(8), pe = Q(8), ge = Q(8), Kt = Q(8), Gt = Q(8), Ht = Q(8), jt = Q(4), $t = Q(4), Dt = Q(4), B = Q(8), U = Q(16), nt = Q(16), st = Q(16), H = Q(32), Ct = Q(32), rt = Q(48), wt = Q(64);
let Vt = Q(1152), me = Q(1152);
function ot(o, t, n) {
  o = ct(o, Vt, t, n, me);
  const e = Vt;
  return Vt = me, me = e, o;
}
function jn(o, t, n, e, i, s, r, a, h) {
  let f, l, c, u, d, y, g, w, m, S, E, O, C, I, F, z, L, tt, et, X, Z, p, b, _, M, v, R, k, A, j, T, $, D, V, P;
  const q = o - r, W = n - r, Y = i - r, K = t - a, J = e - a, G = s - a;
  T = W * G, b = N * W, _ = b - (b - W), M = W - _, b = N * G, v = b - (b - G), R = G - v, $ = M * R - (T - _ * v - M * v - _ * R), D = Y * J, b = N * Y, _ = b - (b - Y), M = Y - _, b = N * J, v = b - (b - J), R = J - v, V = M * R - (D - _ * v - M * v - _ * R), k = $ - V, p = $ - k, Tt[0] = $ - (k + p) + (p - V), A = T + k, p = A - T, j = T - (A - p) + (k - p), k = j - D, p = j - k, Tt[1] = j - (k + p) + (p - D), P = A + k, p = P - A, Tt[2] = A - (P - p) + (k - p), Tt[3] = P, T = Y * K, b = N * Y, _ = b - (b - Y), M = Y - _, b = N * K, v = b - (b - K), R = K - v, $ = M * R - (T - _ * v - M * v - _ * R), D = q * G, b = N * q, _ = b - (b - q), M = q - _, b = N * G, v = b - (b - G), R = G - v, V = M * R - (D - _ * v - M * v - _ * R), k = $ - V, p = $ - k, Nt[0] = $ - (k + p) + (p - V), A = T + k, p = A - T, j = T - (A - p) + (k - p), k = j - D, p = j - k, Nt[1] = j - (k + p) + (p - D), P = A + k, p = P - A, Nt[2] = A - (P - p) + (k - p), Nt[3] = P, T = q * J, b = N * q, _ = b - (b - q), M = q - _, b = N * J, v = b - (b - J), R = J - v, $ = M * R - (T - _ * v - M * v - _ * R), D = W * K, b = N * W, _ = b - (b - W), M = W - _, b = N * K, v = b - (b - K), R = K - v, V = M * R - (D - _ * v - M * v - _ * R), k = $ - V, p = $ - k, Rt[0] = $ - (k + p) + (p - V), A = T + k, p = A - T, j = T - (A - p) + (k - p), k = j - D, p = j - k, Rt[1] = j - (k + p) + (p - D), P = A + k, p = P - A, Rt[2] = A - (P - p) + (k - p), Rt[3] = P, f = ct(
    ct(
      ct(
        x(x(4, Tt, q, B), B, q, U),
        U,
        x(x(4, Tt, K, B), B, K, nt),
        nt,
        H
      ),
      H,
      ct(
        x(x(4, Nt, W, B), B, W, U),
        U,
        x(x(4, Nt, J, B), B, J, nt),
        nt,
        Ct
      ),
      Ct,
      wt
    ),
    wt,
    ct(
      x(x(4, Rt, Y, B), B, Y, U),
      U,
      x(x(4, Rt, G, B), B, G, nt),
      nt,
      H
    ),
    H,
    Vt
  );
  let vt = Ge(f, Vt), zt = Cn * h;
  if (vt >= zt || -vt >= zt || (p = o - q, l = o - (q + p) + (p - r), p = t - K, d = t - (K + p) + (p - a), p = n - W, c = n - (W + p) + (p - r), p = e - J, y = e - (J + p) + (p - a), p = i - Y, u = i - (Y + p) + (p - r), p = s - G, g = s - (G + p) + (p - a), l === 0 && c === 0 && u === 0 && d === 0 && y === 0 && g === 0) || (zt = Bn * h + Ke * Math.abs(vt), vt += (q * q + K * K) * (W * g + G * c - (J * u + Y * y)) + 2 * (q * l + K * d) * (W * G - J * Y) + ((W * W + J * J) * (Y * d + K * u - (G * l + q * g)) + 2 * (W * c + J * y) * (Y * K - G * q)) + ((Y * Y + G * G) * (q * y + J * l - (K * c + W * d)) + 2 * (Y * u + G * g) * (q * J - K * W)), vt >= zt || -vt >= zt))
    return vt;
  if ((c !== 0 || y !== 0 || u !== 0 || g !== 0) && (T = q * q, b = N * q, _ = b - (b - q), M = q - _, $ = M * M - (T - _ * _ - (_ + _) * M), D = K * K, b = N * K, _ = b - (b - K), M = K - _, V = M * M - (D - _ * _ - (_ + _) * M), k = $ + V, p = k - $, _t[0] = $ - (k - p) + (V - p), A = T + k, p = A - T, j = T - (A - p) + (k - p), k = j + D, p = k - j, _t[1] = j - (k - p) + (D - p), P = A + k, p = P - A, _t[2] = A - (P - p) + (k - p), _t[3] = P), (u !== 0 || g !== 0 || l !== 0 || d !== 0) && (T = W * W, b = N * W, _ = b - (b - W), M = W - _, $ = M * M - (T - _ * _ - (_ + _) * M), D = J * J, b = N * J, _ = b - (b - J), M = J - _, V = M * M - (D - _ * _ - (_ + _) * M), k = $ + V, p = k - $, xt[0] = $ - (k - p) + (V - p), A = T + k, p = A - T, j = T - (A - p) + (k - p), k = j + D, p = k - j, xt[1] = j - (k - p) + (D - p), P = A + k, p = P - A, xt[2] = A - (P - p) + (k - p), xt[3] = P), (l !== 0 || d !== 0 || c !== 0 || y !== 0) && (T = Y * Y, b = N * Y, _ = b - (b - Y), M = Y - _, $ = M * M - (T - _ * _ - (_ + _) * M), D = G * G, b = N * G, _ = b - (b - G), M = G - _, V = M * M - (D - _ * _ - (_ + _) * M), k = $ + V, p = k - $, Mt[0] = $ - (k - p) + (V - p), A = T + k, p = A - T, j = T - (A - p) + (k - p), k = j + D, p = k - j, Mt[1] = j - (k - p) + (D - p), P = A + k, p = P - A, Mt[2] = A - (P - p) + (k - p), Mt[3] = P), l !== 0 && (w = x(4, Tt, l, he), f = ot(f, bt(
    x(w, he, 2 * q, U),
    U,
    x(x(4, Mt, l, B), B, J, nt),
    nt,
    x(x(4, xt, l, B), B, -G, st),
    st,
    H,
    rt
  ), rt)), d !== 0 && (m = x(4, Tt, d, ue), f = ot(f, bt(
    x(m, ue, 2 * K, U),
    U,
    x(x(4, xt, d, B), B, Y, nt),
    nt,
    x(x(4, Mt, d, B), B, -W, st),
    st,
    H,
    rt
  ), rt)), c !== 0 && (S = x(4, Nt, c, le), f = ot(f, bt(
    x(S, le, 2 * W, U),
    U,
    x(x(4, _t, c, B), B, G, nt),
    nt,
    x(x(4, Mt, c, B), B, -K, st),
    st,
    H,
    rt
  ), rt)), y !== 0 && (E = x(4, Nt, y, de), f = ot(f, bt(
    x(E, de, 2 * J, U),
    U,
    x(x(4, Mt, y, B), B, q, nt),
    nt,
    x(x(4, _t, y, B), B, -Y, st),
    st,
    H,
    rt
  ), rt)), u !== 0 && (O = x(4, Rt, u, pe), f = ot(f, bt(
    x(O, pe, 2 * Y, U),
    U,
    x(x(4, xt, u, B), B, K, nt),
    nt,
    x(x(4, _t, u, B), B, -J, st),
    st,
    H,
    rt
  ), rt)), g !== 0 && (C = x(4, Rt, g, ge), f = ot(f, bt(
    x(C, ge, 2 * G, U),
    U,
    x(x(4, _t, g, B), B, W, nt),
    nt,
    x(x(4, xt, g, B), B, -q, st),
    st,
    H,
    rt
  ), rt)), l !== 0 || d !== 0) {
    if (c !== 0 || y !== 0 || u !== 0 || g !== 0 ? (T = c * G, b = N * c, _ = b - (b - c), M = c - _, b = N * G, v = b - (b - G), R = G - v, $ = M * R - (T - _ * v - M * v - _ * R), D = W * g, b = N * W, _ = b - (b - W), M = W - _, b = N * g, v = b - (b - g), R = g - v, V = M * R - (D - _ * v - M * v - _ * R), k = $ + V, p = k - $, gt[0] = $ - (k - p) + (V - p), A = T + k, p = A - T, j = T - (A - p) + (k - p), k = j + D, p = k - j, gt[1] = j - (k - p) + (D - p), P = A + k, p = P - A, gt[2] = A - (P - p) + (k - p), gt[3] = P, T = u * -J, b = N * u, _ = b - (b - u), M = u - _, b = N * -J, v = b - (b - -J), R = -J - v, $ = M * R - (T - _ * v - M * v - _ * R), D = Y * -y, b = N * Y, _ = b - (b - Y), M = Y - _, b = N * -y, v = b - (b - -y), R = -y - v, V = M * R - (D - _ * v - M * v - _ * R), k = $ + V, p = k - $, mt[0] = $ - (k - p) + (V - p), A = T + k, p = A - T, j = T - (A - p) + (k - p), k = j + D, p = k - j, mt[1] = j - (k - p) + (D - p), P = A + k, p = P - A, mt[2] = A - (P - p) + (k - p), mt[3] = P, F = ct(4, gt, 4, mt, Gt), T = c * g, b = N * c, _ = b - (b - c), M = c - _, b = N * g, v = b - (b - g), R = g - v, $ = M * R - (T - _ * v - M * v - _ * R), D = u * y, b = N * u, _ = b - (b - u), M = u - _, b = N * y, v = b - (b - y), R = y - v, V = M * R - (D - _ * v - M * v - _ * R), k = $ - V, p = $ - k, $t[0] = $ - (k + p) + (p - V), A = T + k, p = A - T, j = T - (A - p) + (k - p), k = j - D, p = j - k, $t[1] = j - (k + p) + (p - D), P = A + k, p = P - A, $t[2] = A - (P - p) + (k - p), $t[3] = P, tt = 4) : (Gt[0] = 0, F = 1, $t[0] = 0, tt = 1), l !== 0) {
      const ft = x(F, Gt, l, st);
      f = ot(f, ct(
        x(w, he, l, U),
        U,
        x(ft, st, 2 * q, H),
        H,
        rt
      ), rt);
      const ht = x(tt, $t, l, B);
      f = ot(f, bt(
        x(ht, B, 2 * q, U),
        U,
        x(ht, B, l, nt),
        nt,
        x(ft, st, l, H),
        H,
        Ct,
        wt
      ), wt), y !== 0 && (f = ot(f, x(x(4, Mt, l, B), B, y, U), U)), g !== 0 && (f = ot(f, x(x(4, xt, -l, B), B, g, U), U));
    }
    if (d !== 0) {
      const ft = x(F, Gt, d, st);
      f = ot(f, ct(
        x(m, ue, d, U),
        U,
        x(ft, st, 2 * K, H),
        H,
        rt
      ), rt);
      const ht = x(tt, $t, d, B);
      f = ot(f, bt(
        x(ht, B, 2 * K, U),
        U,
        x(ht, B, d, nt),
        nt,
        x(ft, st, d, H),
        H,
        Ct,
        wt
      ), wt);
    }
  }
  if (c !== 0 || y !== 0) {
    if (u !== 0 || g !== 0 || l !== 0 || d !== 0 ? (T = u * K, b = N * u, _ = b - (b - u), M = u - _, b = N * K, v = b - (b - K), R = K - v, $ = M * R - (T - _ * v - M * v - _ * R), D = Y * d, b = N * Y, _ = b - (b - Y), M = Y - _, b = N * d, v = b - (b - d), R = d - v, V = M * R - (D - _ * v - M * v - _ * R), k = $ + V, p = k - $, gt[0] = $ - (k - p) + (V - p), A = T + k, p = A - T, j = T - (A - p) + (k - p), k = j + D, p = k - j, gt[1] = j - (k - p) + (D - p), P = A + k, p = P - A, gt[2] = A - (P - p) + (k - p), gt[3] = P, X = -G, Z = -g, T = l * X, b = N * l, _ = b - (b - l), M = l - _, b = N * X, v = b - (b - X), R = X - v, $ = M * R - (T - _ * v - M * v - _ * R), D = q * Z, b = N * q, _ = b - (b - q), M = q - _, b = N * Z, v = b - (b - Z), R = Z - v, V = M * R - (D - _ * v - M * v - _ * R), k = $ + V, p = k - $, mt[0] = $ - (k - p) + (V - p), A = T + k, p = A - T, j = T - (A - p) + (k - p), k = j + D, p = k - j, mt[1] = j - (k - p) + (D - p), P = A + k, p = P - A, mt[2] = A - (P - p) + (k - p), mt[3] = P, z = ct(4, gt, 4, mt, Ht), T = u * d, b = N * u, _ = b - (b - u), M = u - _, b = N * d, v = b - (b - d), R = d - v, $ = M * R - (T - _ * v - M * v - _ * R), D = l * g, b = N * l, _ = b - (b - l), M = l - _, b = N * g, v = b - (b - g), R = g - v, V = M * R - (D - _ * v - M * v - _ * R), k = $ - V, p = $ - k, Dt[0] = $ - (k + p) + (p - V), A = T + k, p = A - T, j = T - (A - p) + (k - p), k = j - D, p = j - k, Dt[1] = j - (k + p) + (p - D), P = A + k, p = P - A, Dt[2] = A - (P - p) + (k - p), Dt[3] = P, et = 4) : (Ht[0] = 0, z = 1, Dt[0] = 0, et = 1), c !== 0) {
      const ft = x(z, Ht, c, st);
      f = ot(f, ct(
        x(S, le, c, U),
        U,
        x(ft, st, 2 * W, H),
        H,
        rt
      ), rt);
      const ht = x(et, Dt, c, B);
      f = ot(f, bt(
        x(ht, B, 2 * W, U),
        U,
        x(ht, B, c, nt),
        nt,
        x(ft, st, c, H),
        H,
        Ct,
        wt
      ), wt), g !== 0 && (f = ot(f, x(x(4, _t, c, B), B, g, U), U)), d !== 0 && (f = ot(f, x(x(4, Mt, -c, B), B, d, U), U));
    }
    if (y !== 0) {
      const ft = x(z, Ht, y, st);
      f = ot(f, ct(
        x(E, de, y, U),
        U,
        x(ft, st, 2 * J, H),
        H,
        rt
      ), rt);
      const ht = x(et, Dt, y, B);
      f = ot(f, bt(
        x(ht, B, 2 * J, U),
        U,
        x(ht, B, y, nt),
        nt,
        x(ft, st, y, H),
        H,
        Ct,
        wt
      ), wt);
    }
  }
  if (u !== 0 || g !== 0) {
    if (l !== 0 || d !== 0 || c !== 0 || y !== 0 ? (T = l * J, b = N * l, _ = b - (b - l), M = l - _, b = N * J, v = b - (b - J), R = J - v, $ = M * R - (T - _ * v - M * v - _ * R), D = q * y, b = N * q, _ = b - (b - q), M = q - _, b = N * y, v = b - (b - y), R = y - v, V = M * R - (D - _ * v - M * v - _ * R), k = $ + V, p = k - $, gt[0] = $ - (k - p) + (V - p), A = T + k, p = A - T, j = T - (A - p) + (k - p), k = j + D, p = k - j, gt[1] = j - (k - p) + (D - p), P = A + k, p = P - A, gt[2] = A - (P - p) + (k - p), gt[3] = P, X = -K, Z = -d, T = c * X, b = N * c, _ = b - (b - c), M = c - _, b = N * X, v = b - (b - X), R = X - v, $ = M * R - (T - _ * v - M * v - _ * R), D = W * Z, b = N * W, _ = b - (b - W), M = W - _, b = N * Z, v = b - (b - Z), R = Z - v, V = M * R - (D - _ * v - M * v - _ * R), k = $ + V, p = k - $, mt[0] = $ - (k - p) + (V - p), A = T + k, p = A - T, j = T - (A - p) + (k - p), k = j + D, p = k - j, mt[1] = j - (k - p) + (D - p), P = A + k, p = P - A, mt[2] = A - (P - p) + (k - p), mt[3] = P, I = ct(4, gt, 4, mt, Kt), T = l * y, b = N * l, _ = b - (b - l), M = l - _, b = N * y, v = b - (b - y), R = y - v, $ = M * R - (T - _ * v - M * v - _ * R), D = c * d, b = N * c, _ = b - (b - c), M = c - _, b = N * d, v = b - (b - d), R = d - v, V = M * R - (D - _ * v - M * v - _ * R), k = $ - V, p = $ - k, jt[0] = $ - (k + p) + (p - V), A = T + k, p = A - T, j = T - (A - p) + (k - p), k = j - D, p = j - k, jt[1] = j - (k + p) + (p - D), P = A + k, p = P - A, jt[2] = A - (P - p) + (k - p), jt[3] = P, L = 4) : (Kt[0] = 0, I = 1, jt[0] = 0, L = 1), u !== 0) {
      const ft = x(I, Kt, u, st);
      f = ot(f, ct(
        x(O, pe, u, U),
        U,
        x(ft, st, 2 * Y, H),
        H,
        rt
      ), rt);
      const ht = x(L, jt, u, B);
      f = ot(f, bt(
        x(ht, B, 2 * Y, U),
        U,
        x(ht, B, u, nt),
        nt,
        x(ft, st, u, H),
        H,
        Ct,
        wt
      ), wt), d !== 0 && (f = ot(f, x(x(4, xt, u, B), B, d, U), U)), y !== 0 && (f = ot(f, x(x(4, _t, -u, B), B, y, U), U));
    }
    if (g !== 0) {
      const ft = x(I, Kt, g, st);
      f = ot(f, ct(
        x(C, ge, g, U),
        U,
        x(ft, st, 2 * G, H),
        H,
        rt
      ), rt);
      const ht = x(L, jt, g, B);
      f = ot(f, bt(
        x(ht, B, 2 * G, U),
        U,
        x(ht, B, g, nt),
        nt,
        x(ft, st, g, H),
        H,
        Ct,
        wt
      ), wt);
    }
  }
  return Vt[f - 1];
}
function $n(o, t, n, e, i, s, r, a) {
  const h = o - r, f = n - r, l = i - r, c = t - a, u = e - a, d = s - a, y = f * d, g = l * u, w = h * h + c * c, m = l * c, S = h * d, E = f * f + u * u, O = h * u, C = f * c, I = l * l + d * d, F = w * (y - g) + E * (m - S) + I * (O - C), z = (Math.abs(y) + Math.abs(g)) * w + (Math.abs(m) + Math.abs(S)) * E + (Math.abs(O) + Math.abs(C)) * I, L = Rn * z;
  return F > L || -F > L ? F : jn(o, t, n, e, i, s, r, a, z);
}
class Dn {
  bs;
  width;
  constructor(t, n) {
    this.width = t, this.bs = n;
  }
  /**
   * Add a number to the set.
   *
   * @param idx The number to add. Must be 0 <= idx < len.
   */
  add(t) {
    const n = Math.floor(t / this.width), e = t % this.width;
    return this.bs[n] |= 1 << e, this;
  }
  /**
   * Delete a number from the set.
   *
   * @param idx The number to delete. Must be 0 <= idx < len.
   */
  delete(t) {
    const n = Math.floor(t / this.width), e = t % this.width;
    return this.bs[n] &= ~(1 << e), this;
  }
  /**
   * Add or delete a number in the set, depending on the second argument.
   *
   * @param idx The number to add or delete. Must be 0 <= idx < len.
   * @param val If true, add the number, otherwise delete.
   */
  set(t, n) {
    const e = Math.floor(t / this.width), s = 1 << t % this.width;
    return this.bs[e] ^= (-Number(n) ^ this.bs[e]) & s, n;
  }
  /**
   * Whether the number is in the set.
   *
   * @param idx The number to test. Must be 0 <= idx < len.
   */
  has(t) {
    const n = Math.floor(t / this.width), e = t % this.width;
    return (this.bs[n] & 1 << e) !== 0;
  }
  /**
   * Iterate over the numbers that are in the set.
   */
  forEach(t) {
    const n = this.bs.length;
    for (let e = 0; e < n; e++) {
      let i = 0;
      for (; this.bs[e] && i < this.width; )
        this.bs[e] & 1 << i && t(e * this.width + i), i++;
    }
    return this;
  }
}
class Be extends Dn {
  constructor(t) {
    super(8, new Uint8Array(Math.ceil(t / 8)).fill(0));
  }
}
function Pt(o) {
  return o % 3 === 2 ? o - 2 : o + 1;
}
function At(o) {
  return o % 3 === 0 ? o + 2 : o - 1;
}
function je(o, t, n, e, i, s, r, a) {
  const h = qt(o, t, i, s, r, a), f = qt(n, e, i, s, r, a);
  if (h > 0 && f > 0 || h < 0 && f < 0)
    return !1;
  const l = qt(i, s, o, t, n, e), c = qt(r, a, o, t, n, e);
  return l > 0 && c > 0 || l < 0 && c < 0 ? !1 : h === 0 && f === 0 && l === 0 && c === 0 ? !(Math.max(i, r) < Math.min(o, n) || Math.max(o, n) < Math.min(i, r) || Math.max(s, a) < Math.min(t, e) || Math.max(t, e) < Math.min(s, a)) : !0;
}
class Pn {
  /**
   * The triangulation object from Delaunator.
   */
  del;
  constructor(t) {
    this.del = t;
  }
}
class Fn extends Pn {
  vertMap;
  flips;
  consd;
  /**
   * Create a Constrain instance.
   *
   * @param del The triangulation output from Delaunator.
   * @param edges If provided, constrain these edges via constrainAll.
   */
  constructor(t, n) {
    if (!t || typeof t != "object" || !t.triangles || !t.halfedges || !t.coords)
      throw new Error("Expected an object with Delaunator output");
    if (t.triangles.length % 3 || t.halfedges.length !== t.triangles.length || t.coords.length % 2)
      throw new Error("Delaunator output appears inconsistent");
    if (t.triangles.length < 3)
      throw new Error("No edges in triangulation");
    super(t);
    const e = 2 ** 32 - 1, i = t.coords.length >> 1, s = t.triangles.length;
    this.vertMap = new Uint32Array(i).fill(e), this.flips = new Be(s), this.consd = new Be(s);
    for (let r = 0; r < s; r++) {
      const a = t.triangles[r];
      this.vertMap[a] === e && this.updateVert(r);
    }
    n && this.constrainAll(n);
  }
  /**
   * Constrain the triangulation such that there is an edge between p1 and p2.
   */
  constrainOne(t, n) {
    const { triangles: e, halfedges: i } = this.del, s = this.vertMap[t];
    let r = s;
    do {
      const f = e[r], l = Pt(r);
      if (f === n)
        return this.protect(r);
      const c = At(r), u = e[c];
      if (u === n)
        return this.protect(l), l;
      if (this.intersectSegments(t, n, u, f)) {
        r = c;
        break;
      }
      r = i[l];
    } while (r !== -1 && r !== s);
    let a = r, h = -1;
    for (; r !== -1; ) {
      const f = i[r], l = At(r), c = At(f), u = Pt(f);
      if (f === -1)
        throw new Error("Constraining edge exited the hull");
      if (this.consd.has(r))
        throw new Error("Edge intersects already constrained edge");
      if (this.isCollinear(t, n, e[r]) || this.isCollinear(t, n, e[f]))
        throw new Error("Constraining edge intersects point");
      if (!this.intersectSegments(
        e[r],
        e[f],
        e[l],
        e[c]
      )) {
        if (h === -1 && (h = r), e[c] === n) {
          if (r === h)
            throw new Error("Infinite loop: non-convex quadrilateral");
          r = h, h = -1;
          continue;
        }
        if (this.intersectSegments(
          t,
          n,
          e[c],
          e[f]
        ))
          r = c;
        else if (this.intersectSegments(
          t,
          n,
          e[u],
          e[c]
        ))
          r = u;
        else if (h === r)
          throw new Error("Infinite loop: no further intersect after non-convex");
        continue;
      }
      if (this.flipDiagonal(r), this.intersectSegments(
        t,
        n,
        e[l],
        e[c]
      ) && (h === -1 && (h = l), h === l))
        throw new Error("Infinite loop: flipped diagonal still intersects");
      e[c] === n ? (a = c, r = h, h = -1) : this.intersectSegments(
        t,
        n,
        e[u],
        e[c]
      ) && (r = u);
    }
    return this.protect(a), this.delaunify(!0), this.findEdge(t, n);
  }
  /**
   * Fix the Delaunay condition.
   */
  delaunify(t = !1) {
    const { halfedges: n } = this.del, e = this.flips, i = this.consd, s = n.length;
    let r;
    do {
      r = 0;
      for (let a = 0; a < s; a++) {
        if (i.has(a))
          continue;
        e.delete(a);
        const h = n[a];
        h !== -1 && (e.delete(h), this.isDelaunay(a) || (this.flipDiagonal(a), r++));
      }
    } while (t && r > 0);
    return this;
  }
  /**
   * Call constrainOne on each edge.
   */
  constrainAll(t) {
    const n = t.length;
    for (let e = 0; e < n; e++) {
      const i = t[e];
      this.constrainOne(i[0], i[1]);
    }
    return this;
  }
  /**
   * Whether an edge is constrained.
   */
  isConstrained(t) {
    return this.consd.has(t);
  }
  /**
   * Find the edge that points from p1 -> p2. If there is only an edge from
   * p2 -> p1 (i.e. it is on the hull), returns the negative id of it.
   */
  findEdge(t, n) {
    const e = this.vertMap[n], { triangles: i, halfedges: s } = this.del;
    let r = e, a = -1;
    do {
      if (i[r] === t)
        return r;
      a = Pt(r), r = s[a];
    } while (r !== -1 && r !== e);
    return i[Pt(a)] === t ? -a : 1 / 0;
  }
  /**
   * Mark an edge as constrained, i.e. should not be touched by `delaunify`.
   */
  protect(t) {
    const n = this.del.halfedges[t], e = this.flips, i = this.consd;
    return e.delete(t), i.add(t), n !== -1 ? (e.delete(n), i.add(n), n) : -t;
  }
  /**
   * Mark an edge as flipped unless constrained.
   */
  markFlip(t) {
    const n = this.del.halfedges, e = this.flips;
    if (this.consd.has(t))
      return !1;
    const s = n[t];
    return s !== -1 && (e.add(t), e.add(s)), !0;
  }
  /**
   * Flip the edge shared by two triangles.
   */
  flipDiagonal(t) {
    const { triangles: n, halfedges: e } = this.del, i = this.flips, s = this.consd, r = e[t], a = At(t), h = Pt(t), f = At(r), l = Pt(r), c = e[a], u = e[f];
    if (s.has(t))
      throw new Error("Trying to flip a constrained edge");
    return n[t] = n[f], e[t] = u, i.set(t, i.has(f)) || s.set(t, s.has(f)), u !== -1 && (e[u] = t), e[a] = f, n[r] = n[a], e[r] = c, i.set(r, i.has(a)) || s.set(r, s.has(a)), c !== -1 && (e[c] = r), e[f] = a, this.markFlip(t), this.markFlip(h), this.markFlip(r), this.markFlip(l), i.add(a), s.delete(a), i.add(f), s.delete(f), this.updateVert(t), this.updateVert(h), this.updateVert(r), this.updateVert(l), a;
  }
  /**
   * Whether point p1, p2, and p are collinear.
   */
  isCollinear(t, n, e) {
    const i = this.del.coords;
    return qt(
      i[t * 2],
      i[t * 2 + 1],
      i[n * 2],
      i[n * 2 + 1],
      i[e * 2],
      i[e * 2 + 1]
    ) === 0;
  }
  /**
   * Whether the triangle formed by p1, p2, p3 keeps px outside the circumcircle.
   */
  inCircle(t, n, e, i) {
    const s = this.del.coords;
    return $n(
      s[t * 2],
      s[t * 2 + 1],
      s[n * 2],
      s[n * 2 + 1],
      s[e * 2],
      s[e * 2 + 1],
      s[i * 2],
      s[i * 2 + 1]
    ) < 0;
  }
  /**
   * Whether the triangles sharing edg conform to the Delaunay condition.
   */
  isDelaunay(t) {
    const { triangles: n, halfedges: e } = this.del, i = e[t];
    if (i === -1)
      return !0;
    const s = n[At(t)], r = n[t], a = n[Pt(t)], h = n[At(i)];
    return !this.inCircle(s, r, a, h);
  }
  /**
   * Update the vertex -> incoming edge map.
   */
  updateVert(t) {
    const { triangles: n, halfedges: e } = this.del, i = this.vertMap, s = n[t];
    let r = At(t), a = e[r];
    for (; a !== -1 && a !== t; )
      r = At(a), a = e[r];
    return i[s] = r, r;
  }
  /**
   * Whether the segments between vertices intersect.
   */
  intersectSegments(t, n, e, i) {
    const s = this.del.coords;
    return t === e || t === i || n === e || n === i ? !1 : je(
      s[t * 2],
      s[t * 2 + 1],
      s[n * 2],
      s[n * 2 + 1],
      s[e * 2],
      s[e * 2 + 1],
      s[i * 2],
      s[i * 2 + 1]
    );
  }
  static intersectSegments = je;
}
function Zt(o, t, n) {
  if (t || (t = []), typeof o != "object" || o.type !== "FeatureCollection")
    throw "Argument points must be FeatureCollection";
  if (!Array.isArray(t)) throw "Argument points must be Array of Array";
  const e = o.features.map(
    (h) => h.geometry.coordinates
  ), i = cn.from(e);
  let s;
  const r = [];
  i.triangles.length !== 0 && t.length !== 0 && (s = new Fn(i), s.constrainAll(t));
  for (let h = 0; h < i.triangles.length; h += 3)
    r.push([i.triangles[h], i.triangles[h + 1], i.triangles[h + 2]]);
  const a = ["a", "b", "c"];
  return Ot(
    r.map((h) => {
      const f = {}, l = h.map((c, u) => {
        const d = o.features[c], y = d.geometry.coordinates, g = [y[0], y[1]];
        return y.length === 3 ? g[2] = y[2] : f[a[u]] = d.properties[n], g;
      });
      return l[3] = l[0], ce([l], f);
    })
  );
}
function He(o, t, n, e, i, s) {
  return Object.keys(o).reduce((r, a) => {
    const h = o[a], f = h.forw, l = h.bakw, c = {
      forw: [f[0] - t.forw[0], f[1] - t.forw[1]],
      bakw: [l[0] - t.bakw[0], l[1] - t.bakw[1]]
    }, u = c.forw[0] === 0 ? 1 / 0 : ((c.forw[0] < 0 ? n : e) - t.forw[0]) / c.forw[0], d = c.forw[1] === 0 ? 1 / 0 : ((c.forw[1] < 0 ? i : s) - t.forw[1]) / c.forw[1];
    if (Math.abs(u) / Math.abs(d) < 1.1) {
      const y = {
        forw: [
          c.forw[0] * u + t.forw[0],
          c.forw[1] * u + t.forw[1]
        ],
        bakw: [
          c.bakw[0] * u + t.bakw[0],
          c.bakw[1] * u + t.bakw[1]
        ]
      };
      c.forw[0] < 0 ? r[3].push(y) : r[1].push(y);
    }
    if (Math.abs(d) / Math.abs(u) < 1.1) {
      const y = {
        forw: [
          c.forw[0] * d + t.forw[0],
          c.forw[1] * d + t.forw[1]
        ],
        bakw: [
          c.bakw[0] * d + t.bakw[0],
          c.bakw[1] * d + t.bakw[1]
        ]
      };
      c.forw[1] < 0 ? r[0].push(y) : r[2].push(y);
    }
    return r;
  }, [[], [], [], []]);
}
function Un(o, t) {
  const n = [[], [], [], []], e = [];
  return Object.keys(o).forEach((i) => {
    const s = o[i], r = s.forw, a = s.bakw, h = [
      r[0] - t.forw[0],
      r[1] - t.forw[1]
    ], f = [
      a[0] - t.bakw[0],
      t.bakw[1] - a[1]
    ], l = { forw: h, bakw: f };
    if (e.push(l), h[0] === 0 || h[1] === 0)
      return;
    let c = 0;
    h[0] > 0 && (c += 1), h[1] > 0 && (c += 2), n[c].push(l);
  }), { perQuad: n, aggregate: e };
}
function Ln(o) {
  let t = 1 / 0, n = 0, e = 0;
  return o.forEach((i) => {
    const { forw: s, bakw: r } = i, a = Math.hypot(s[0], s[1]), h = Math.hypot(r[0], r[1]);
    if (h === 0) return;
    const f = a / h, l = Math.atan2(s[0], s[1]) - Math.atan2(r[0], r[1]);
    t = Math.min(t, f), n += Math.cos(l), e += Math.sin(l);
  }), isFinite(t) ? [t, Math.atan2(e, n)] : [1, 0];
}
function Ze(o, t, n) {
  const { perQuad: e, aggregate: i } = Un(o, t), s = e.every((h) => h.length > 0);
  let r;
  n === "birdeye" && s ? r = e : n === "birdeye" ? r = [i] : s ? r = e : r = [i];
  const a = r.map((h) => Ln(h));
  return a.length === 1 ? [a[0], a[0], a[0], a[0]] : a;
}
function Vn(o, t, n) {
  const e = [1, 1, 1, 1];
  for (let i = 0; i < 4; i++) {
    const s = (i + 1) % 4, r = xe([o[i].bakw, o[s].bakw]);
    t[i].map((a) => {
      const h = xe([n.bakw, a.bakw]), f = fn(r, h);
      if (f.features.length > 0 && f.features[0].geometry) {
        const l = f.features[0], c = Math.sqrt(
          Math.pow(a.bakw[0] - n.bakw[0], 2) + Math.pow(a.bakw[1] - n.bakw[1], 2)
        ), u = Math.sqrt(
          Math.pow(
            l.geometry.coordinates[0] - n.bakw[0],
            2
          ) + Math.pow(
            l.geometry.coordinates[1] - n.bakw[1],
            2
          )
        ), d = c / u;
        d > e[i] && (e[i] = d), d > e[s] && (e[s] = d);
      }
    });
  }
  o.forEach((i, s) => {
    const r = e[s], a = [
      (i.bakw[0] - n.bakw[0]) * r + n.bakw[0],
      (i.bakw[1] - n.bakw[1]) * r + n.bakw[1]
    ];
    i.bakw = a;
  });
}
function tn(o, t, n, e) {
  const i = o.map((r, a) => {
    const h = t[a], f = [
      h[0] - n.forw[0],
      h[1] - n.forw[1]
    ], c = Math.sqrt(
      Math.pow(f[0], 2) + Math.pow(f[1], 2)
    ) / r[0], u = Math.atan2(f[0], f[1]) - r[1], d = [
      n.bakw[0] + c * Math.sin(u),
      n.bakw[1] - c * Math.cos(u)
    ];
    return { forw: h, bakw: d };
  }), s = i[2];
  return i[2] = i[3], i[3] = s, Vn(i, e, n), i;
}
function zn(o) {
  const { convexBuf: t, centroid: n, bbox: e, minx: i, maxx: s, miny: r, maxy: a } = o, h = He(t, n, i, s, r, a), f = Ze(t, n, "plain");
  return tn(f, e, n, h);
}
function Xn(o) {
  const { convexBuf: t, centroid: n, bbox: e, minx: i, maxx: s, miny: r, maxy: a } = o, h = He(t, n, i, s, r, a), f = Ze(t, n, "birdeye");
  return tn(f, e, n, h);
}
function qn(o) {
  const n = new Wn(o).findSegmentIntersections();
  return sn(n).reduce(
    (e, i, s, r) => Array.isArray(e) || (e || (e = {}), e[`${i.x}:${i.y}`] = i, s != r.length - 1) ? e : Object.keys(e).map((a) => Yt([e[a].x, e[a].y])),
    {}
  );
}
class Wn {
  /**
   * 座標データの配列
   * _xx, _yy: Float64Array形式で座標を保持
   * _ii: 各線分の開始インデックス
   * _nn: 各線分の頂点数
   */
  _xx;
  _yy;
  // coordinates data
  _ii;
  _nn;
  // indexes, sizes
  _zz;
  _zlimit = 0;
  // simplification
  _bb;
  _allBounds;
  // bounding boxes
  _arcIter;
  _filteredArcIter;
  // path iterators
  buf;
  /**
   * 線分群からArcCollectionを初期化
   * @param coords - 線分群の座標配列
   */
  constructor(t) {
    this.initArcs(t);
  }
  initArcs(t) {
    const n = [], e = [], i = t.map((s) => {
      const r = s ? s.length : 0;
      for (let a = 0; a < r; a++)
        n.push(s[a][0]), e.push(s[a][1]);
      return r;
    });
    this.initXYData(i, n, e);
  }
  initXYData(t, n, e) {
    const i = t.length;
    this._xx = new Float64Array(n), this._yy = new Float64Array(e), this._nn = new Uint32Array(t), this._zz = null, this._zlimit = 0, this._filteredArcIter = null, this._ii = new Uint32Array(i);
    let s = 0;
    for (let r = 0; r < i; r++)
      this._ii[r] = s, s += t[r];
    (s != this._xx.length || this._xx.length != this._yy.length) && ye("ArcCollection#initXYData() Counting error"), this.initBounds(), this._arcIter = new ls(this._xx, this._yy);
  }
  initBounds() {
    const t = this.calcArcBounds_(this._xx, this._yy, this._nn);
    this._bb = t.bb, this._allBounds = t.bounds;
  }
  /**
   * データの境界を計算
   * @returns バウンディングボックス情報
   */
  calcArcBounds_(t, n, e) {
    const i = e.length, s = new Float64Array(i * 4), r = new oe();
    let a = 0, h, f, l;
    for (let c = 0; c < i; c++)
      h = e[c], h > 0 && (f = c * 4, l = ds(t, n, a, h), s[f++] = l[0], s[f++] = l[1], s[f++] = l[2], s[f] = l[3], a += h, r.mergeBounds(l));
    return {
      bb: s,
      bounds: r
    };
  }
  getBounds() {
    return this._allBounds.clone();
  }
  // @cb function(i, j, xx, yy)
  forEachSegment(t) {
    let n = 0;
    for (let e = 0, i = this.size(); e < i; e++)
      n += this.forEachArcSegment(e, t);
    return n;
  }
  size() {
    return this._ii && this._ii.length || 0;
  }
  // @cb function(i, j, xx, yy)
  forEachArcSegment(t, n) {
    const e = t >= 0, i = e ? t : ~t, s = this.getRetainedInterval(), r = this._nn[i], a = e ? 1 : -1;
    let h = e ? this._ii[i] : this._ii[i] + r - 1, f = h, l = 0;
    for (let c = 1; c < r; c++)
      f += a, (s === 0 || this._zz[f] >= s) && (n(h, f, this._xx, this._yy), h = f, l++);
    return l;
  }
  getRetainedInterval() {
    return this._zlimit;
  }
  // Give access to raw data arrays...
  getVertexData() {
    return {
      xx: this._xx,
      yy: this._yy,
      zz: this._zz,
      bb: this._bb,
      nn: this._nn,
      ii: this._ii
    };
  }
  getUint32Array(t) {
    const n = t * 4;
    return (!this.buf || this.buf.byteLength < n) && (this.buf = new ArrayBuffer(n)), new Uint32Array(this.buf, 0, t);
  }
  // Return average magnitudes of dx, dy (with simplification)
  getAvgSegment2() {
    let t = 0, n = 0;
    const e = this.forEachSegment(
      (i, s, r, a) => {
        t += Math.abs(r[i] - r[s]), n += Math.abs(a[i] - a[s]);
      }
    );
    return [t / e || 0, n / e || 0];
  }
  /**
   * 交差判定のためのストライプ数を計算
   * 線分の平均長さに基づいて最適な分割数を決定
   */
  calcSegmentIntersectionStripeCount() {
    const t = this.getBounds().height(), n = this.getAvgSegment2()[1];
    let e = 1;
    return n > 0 && t > 0 && (e = Math.ceil(t / n / 20)), e || 1;
  }
  /**
   * 線分の交差を検出
   * ストライプ分割による効率的な判定を実装
   *
   * @returns 検出された交差点の配列
   */
  findSegmentIntersections() {
    const t = this.getBounds(), n = t.ymin, e = t.ymax - n, i = this.calcSegmentIntersectionStripeCount(), s = new Uint32Array(i), r = i > 1 ? (g) => Math.floor((i - 1) * (g - n) / e) : () => 0;
    let a, h;
    this.forEachSegment(
      (g, w, m, S) => {
        let E = r(S[g]);
        const O = r(S[w]);
        for (; s[E] = s[E] + 2, E != O; )
          E += O > E ? 1 : -1;
      }
    );
    const f = this.getUint32Array(Qn(s));
    let l = 0;
    const c = [];
    Kn(s, (g) => {
      const w = l;
      l += g, c.push(f.subarray(w, l));
    }), Gn(s, 0), this.forEachSegment(
      (g, w, m, S) => {
        let E = r(S[g]);
        const O = r(S[w]);
        let C, I;
        for (; C = s[E], s[E] = C + 2, I = c[E], I[C] = g, I[C + 1] = w, E != O; )
          E += O > E ? 1 : -1;
      }
    );
    const u = this.getVertexData(), d = [];
    let y;
    for (a = 0; a < i; a++)
      for (y = Hn(c[a], u.xx, u.yy), h = 0; h < y.length; h++)
        d.push(y[h]);
    return sn(d);
  }
}
function ye(...o) {
  const t = o.join(" ");
  throw new Error(t);
}
function ke(o) {
  return o ? Jn(o) ? !0 : Yn(o) ? !1 : o.length === 0 ? !0 : o.length > 0 : !1;
}
function Yn(o) {
  return o != null && o.toString === String.prototype.toString;
}
function Jn(o) {
  return Array.isArray(o);
}
function Qn(o, t) {
  ke(o) || ye("utils.sum() expects an array, received:", o);
  let n = 0, e;
  for (let i = 0, s = o.length; i < s; i++)
    e = o[i], e && (n += e);
  return n;
}
function Kn(o, t, n) {
  if (!ke(o))
    throw new Error(`#forEach() takes an array-like argument. ${o}`);
  for (let e = 0, i = o.length; e < i; e++)
    t.call(n, o[e], e);
}
function Gn(o, t) {
  for (let n = 0, e = o.length; n < e; n++)
    o[n] = t;
  return o;
}
function Hn(o, t, n) {
  const e = o.length - 2, i = [];
  let s, r, a, h, f, l, c, u, d, y, g, w, m, S, E, O, C;
  for (cs(t, o), O = 0; O < e; ) {
    for (s = o[O], r = o[O + 1], f = t[s], l = t[r], d = n[s], y = n[r], C = O; C < e && (C += 2, a = o[C], c = t[a], !(l < c)); ) {
      if (g = n[a], h = o[C + 1], u = t[h], w = n[h], d >= g) {
        if (d > w && y > g && y > w) continue;
      } else if (d < w && y < g && y < w) continue;
      s == a || s == h || r == a || r == h || (m = Zn(
        f,
        d,
        l,
        y,
        c,
        g,
        u,
        w
      ), m && (S = [s, r], E = [a, h], i.push(De(m, S, E, t, n)), m.length == 4 && i.push(
        De(m.slice(2), S, E, t, n)
      )));
    }
    O += 2;
  }
  return i;
}
function Zn(o, t, n, e, i, s, r, a) {
  const h = ts(o, t, n, e, i, s, r, a);
  let f = null;
  return h && (f = es(o, t, n, e, i, s, r, a), f ? as(o, t, n, e, i, s, r, a) && (f = null) : f = os(o, t, n, e, i, s, r, a)), f;
}
function ts(o, t, n, e, i, s, r, a) {
  return Wt(o, t, n, e, i, s) * Wt(o, t, n, e, r, a) <= 0 && Wt(i, s, r, a, o, t) * Wt(i, s, r, a, n, e) <= 0;
}
function Wt(o, t, n, e, i, s) {
  return en(o - i, t - s, n - i, e - s);
}
function en(o, t, n, e) {
  return o * e - t * n;
}
function es(o, t, n, e, i, s, r, a) {
  let h = te(o, t, n, e, i, s, r, a), f;
  return h && (f = ss(h[0], h[1], o, t, n, e, i, s, r, a), f == 1 ? h = te(n, e, o, t, i, s, r, a) : f == 2 ? h = te(i, s, r, a, o, t, n, e) : f == 3 && (h = te(r, a, i, s, o, t, n, e))), h && rs(h, o, t, n, e, i, s, r, a), h;
}
function te(o, t, n, e, i, s, r, a) {
  const h = en(n - o, e - t, r - i, a - s), f = 1e-18;
  let l;
  if (h === 0) return null;
  const c = Wt(i, s, r, a, o, t) / h;
  return h <= f && h >= -f ? l = ns(o, t, n, e, i, s, r, a) : l = [o + c * (n - o), t + c * (e - t)], l;
}
function ns(o, t, n, e, i, s, r, a) {
  let h = null;
  return !Et(o, i, r) && !Et(t, s, a) ? h = [o, t] : !Et(n, i, r) && !Et(e, s, a) ? h = [n, e] : !Et(i, o, n) && !Et(s, t, e) ? h = [i, s] : !Et(r, o, n) && !Et(a, t, e) && (h = [r, a]), h;
}
function Et(o, t, n) {
  let e;
  return t < n ? e = o < t || o > n : t > n ? e = o > t || o < n : e = o != t, e;
}
function ss(o, t, ...n) {
  let e = -1, i = 1 / 0, s;
  for (let r = 0, a = 0, h = n.length; a < h; r++, a += 2)
    s = is(o, t, n[a], n[a + 1]), s < i && (i = s, e = r);
  return e;
}
function is(o, t, n, e) {
  const i = o - n, s = t - e;
  return i * i + s * s;
}
function rs(o, t, n, e, i, s, r, a, h) {
  let f = o[0], l = o[1];
  f = ee(f, t, e), f = ee(f, s, a), l = ee(l, n, i), l = ee(l, r, h), o[0] = f, o[1] = l;
}
function ee(o, t, n) {
  let e;
  return Et(o, t, n) && (e = Math.abs(o - t) < Math.abs(o - n) ? t : n, o = e), o;
}
function os(o, t, n, e, i, s, r, a) {
  const h = Math.min(o, n, i, r), f = Math.max(o, n, i, r), l = Math.min(t, e, s, a), c = Math.max(t, e, s, a), u = c - l > f - h;
  let d = [];
  return (u ? Bt(t, l, c) : Bt(o, h, f)) && d.push(o, t), (u ? Bt(e, l, c) : Bt(n, h, f)) && d.push(n, e), (u ? Bt(s, l, c) : Bt(i, h, f)) && d.push(i, s), (u ? Bt(a, l, c) : Bt(r, h, f)) && d.push(r, a), (d.length != 2 && d.length != 4 || d.length == 4 && d[0] == d[2] && d[1] == d[3]) && (d = null), d;
}
function as(o, t, n, e, i, s, r, a) {
  return o == i && t == s || o == r && t == a || n == i && e == s || n == r && e == a;
}
function Bt(o, t, n) {
  return o > t && o < n;
}
function cs(o, t) {
  fs(o, t), nn(o, t, 0, t.length - 2);
}
function fs(o, t) {
  for (let n = 0, e = t.length; n < e; n += 2)
    o[t[n]] > o[t[n + 1]] && hs(t, n, n + 1);
}
function hs(o, t, n) {
  const e = o[t];
  o[t] = o[n], o[n] = e;
}
function nn(o, t, n, e) {
  let i = n, s = e, r, a;
  for (; i < e; ) {
    for (r = o[t[n + e >> 2 << 1]]; i <= s; ) {
      for (; o[t[i]] < r; ) i += 2;
      for (; o[t[s]] > r; ) s -= 2;
      i <= s && (a = t[i], t[i] = t[s], t[s] = a, a = t[i + 1], t[i + 1] = t[s + 1], t[s + 1] = a, i += 2, s -= 2);
    }
    if (s - n < 40 ? $e(o, t, n, s) : nn(o, t, n, s), e - i < 40) {
      $e(o, t, i, e);
      return;
    }
    n = i, s = e;
  }
}
function $e(o, t, n, e) {
  let i, s;
  for (let r = n + 2; r <= e; r += 2) {
    i = t[r], s = t[r + 1];
    let a;
    for (a = r - 2; a >= n && o[i] < o[t[a]]; a -= 2)
      t[a + 2] = t[a], t[a + 3] = t[a + 1];
    t[a + 2] = i, t[a + 3] = s;
  }
}
function De(o, t, n, e, i) {
  const s = o[0], r = o[1];
  t = Pe(s, r, t[0], t[1], e, i), n = Pe(s, r, n[0], n[1], e, i);
  const a = t[0] < n[0] ? t : n, h = a == t ? n : t;
  return { x: s, y: r, a, b: h };
}
function Pe(o, t, n, e, i, s) {
  let r = n < e ? n : e, a = r === n ? e : n;
  return i[r] == o && s[r] == t ? a = r : i[a] == o && s[a] == t && (r = a), [r, a];
}
function sn(o) {
  const t = {};
  return o.filter((n) => {
    const e = us(n);
    return e in t ? !1 : (t[e] = !0, !0);
  });
}
function us(o) {
  return `${o.a.join(",")};${o.b.join(",")}`;
}
class ls {
  _i = 0;
  _n = 0;
  _inc = 1;
  _xx;
  _yy;
  i = 0;
  x = 0;
  y = 0;
  constructor(t, n) {
    this._xx = t, this._yy = n;
  }
}
function ds(o, t, n, e) {
  let i = n | 0;
  const s = isNaN(e) ? o.length - i : e + i;
  let r, a, h, f, l, c;
  if (s > 0)
    h = l = o[i], f = c = t[i];
  else return [void 0, void 0, void 0, void 0];
  for (i++; i < s; i++)
    r = o[i], a = t[i], r < h && (h = r), r > l && (l = r), a < f && (f = a), a > c && (c = a);
  return [h, f, l, c];
}
class oe {
  xmin;
  ymin;
  xmax;
  ymax;
  constructor(...t) {
    t.length > 0 && this.setBounds(t);
  }
  // Return a bounding box with the same extent as this one.
  cloneBounds() {
    return this.clone();
  }
  clone() {
    return new oe(this.xmin, this.ymin, this.xmax, this.ymax);
  }
  width() {
    return this.xmax - this.xmin || 0;
  }
  height() {
    return this.ymax - this.ymin || 0;
  }
  setBounds(t, n, e, i) {
    return arguments.length == 1 && (ke(t) ? (n = t[1], e = t[2], i = t[3], t = t[0]) : (n = t.ymin, e = t.xmax, i = t.ymax, t = t.xmin)), this.xmin = t, this.ymin = n, this.xmax = e, this.ymax = i, (t > e || n > i) && this.update(), this;
  }
  update() {
    let t;
    this.xmin > this.xmax && (t = this.xmin, this.xmin = this.xmax, this.xmax = t), this.ymin > this.ymax && (t = this.ymin, this.ymin = this.ymax, this.ymax = t);
  }
  mergeBounds(t, ...n) {
    let e, i, s, r;
    return t instanceof oe ? (e = t.xmin, i = t.ymin, s = t.xmax, r = t.ymax) : n.length == 3 ? (e = t, i = n[0], s = n[1], r = n[2]) : t.length == 4 ? (e = t[0], i = t[1], s = t[2], r = t[3]) : ye("Bounds#mergeBounds() invalid argument:", t), this.xmin === void 0 ? this.setBounds(e, i, s, r) : (e < this.xmin && (this.xmin = e), i < this.ymin && (this.ymin = i), s > this.xmax && (this.xmax = s), r > this.ymax && (this.ymax = r)), this;
  }
}
function ae(o) {
  const t = ["a", "b", "c"].map(
    (n) => o.properties[n].index
  );
  return [
    [0, 1],
    [0, 2],
    [1, 2],
    [0, 1, 2]
  ].map(
    (n) => n.map((e) => t[e]).sort().join("-")
  ).sort();
}
function rn(o, t, n) {
  const e = ae(t.forw), i = ae(t.bakw);
  if (JSON.stringify(e) != JSON.stringify(i))
    throw `${JSON.stringify(t, null, 2)}
${JSON.stringify(
      e
    )}
${JSON.stringify(i)}`;
  for (let s = 0; s < e.length; s++) {
    const r = e[s];
    o[r] || (o[r] = []), o[r].push(t);
  }
  n && (n.forw.features.push(t.forw), n.bakw.features.push(t.bakw));
}
function Fe(o, t, n) {
  const e = ae(t.forw), i = ae(t.bakw);
  if (JSON.stringify(e) != JSON.stringify(i))
    throw `${JSON.stringify(t, null, 2)}
${JSON.stringify(e)}
${JSON.stringify(i)}`;
  if (e.forEach((s) => {
    const r = o[s];
    if (!r) return;
    const a = r.filter((h) => h !== t);
    a.length === 0 ? delete o[s] : o[s] = a;
  }), n) {
    const s = (r, a) => {
      !r || !a || (r.features = r.features.filter((h) => h !== a));
    };
    s(n.forw, t.forw), s(n.bakw, t.bakw);
  }
}
function ne(o, t, n) {
  return Yt(o, { target: { geom: t, index: n } });
}
function se(o) {
  return Yt(o.properties.target.geom, {
    target: {
      geom: o.geometry.coordinates,
      index: o.properties.target.index
    }
  });
}
function Ue(o, t) {
  const n = t.geometry.coordinates;
  return [0, 1, 2, 3].map((e) => {
    const i = (e + 1) % 4, s = o[e], r = o[i], a = s.geometry.coordinates, h = Math.atan2(
      a[0] - n[0],
      a[1] - n[1]
    ), f = [t, s, r, t].map(
      (u) => u.geometry.coordinates
    ), l = {
      a: {
        geom: t.properties.target.geom,
        index: t.properties.target.index
      },
      b: {
        geom: s.properties.target.geom,
        index: s.properties.target.index
      },
      c: {
        geom: r.properties.target.geom,
        index: r.properties.target.index
      }
    }, c = Ot([
      ce([f], l)
    ]);
    return [h, c];
  }).reduce(
    (e, i) => (e[0].push(i[0]), e[1].push(i[1]), e),
    [[], []]
  );
}
function ps(o) {
  const { tins: t, targets: n, includeReciprocals: e } = o, i = {};
  n.forEach((r) => {
    const a = t[r];
    if (!a || !a.features) return;
    i[r] = {};
    const h = {};
    a.features.forEach((f) => {
      const l = ["a", "b", "c"];
      for (let c = 0; c < 3; c++) {
        const u = (c + 1) % 3, d = l[c], y = l[u], g = f.properties[d].index, w = f.properties[y].index, m = [g, w].sort().join("-");
        if (h[m]) continue;
        h[m] = !0;
        const S = f.geometry.coordinates[0][c], E = f.geometry.coordinates[0][u], O = f.properties[d].geom, C = f.properties[y].geom, I = Math.sqrt(
          Math.pow(O[0] - C[0], 2) + Math.pow(O[1] - C[1], 2)
        ) / Math.sqrt(
          Math.pow(S[0] - E[0], 2) + Math.pow(S[1] - E[1], 2)
        ), F = i[r];
        F[`${g}:${m}`] = I, F[`${w}:${m}`] = I;
      }
    });
  });
  const s = {};
  return e && (s.bakw = {}), n.forEach((r) => {
    const a = i[r];
    if (s[r] = {}, !a)
      return;
    const h = {};
    Object.keys(a).forEach((l) => {
      const [c] = l.split(":");
      h[c] || (h[c] = []), h[c].push(a[l]);
    }), Object.keys(h).forEach((l) => {
      const c = h[l], u = c.reduce((d, y) => d + y, 0) / c.length;
      s[r][l] = u, e && s.bakw && (s.bakw[l] = 1 / u);
    });
    let f = 0;
    for (let l = 0; l < 4; l++) {
      const c = `b${l}`, u = s[r][c] || 0;
      f += u;
    }
    s[r].c = f / 4, e && s.bakw && (s.bakw.c = 1 / s[r].c);
  }), s;
}
function gs(o, t) {
  const n = o.split("-");
  if (n.length !== 2 || !n.every((s) => /^-?\d+$/.test(s))) return !1;
  const [e, i] = n.map((s) => parseInt(s, 10)).sort((s, r) => s - r);
  return t.some((s) => {
    if (s.length !== 2) return !1;
    const r = s.map((h) => parseInt(`${h}`, 10));
    if (r.some((h) => Number.isNaN(h))) return !1;
    const a = r.sort((h, f) => h - f);
    return a[0] === e && a[1] === i;
  });
}
function Le(o) {
  return ["a", "b", "c"].map((t, n) => ({
    prop: o.properties[t],
    geom: o.geometry.coordinates[0][n]
  }));
}
function ms(o, t, n) {
  let e = !1, i = !0;
  for (; i; ) {
    i = !1;
    const s = Object.keys(t);
    for (const r of s) {
      const a = t[r];
      if (!a || a.length < 2 || gs(r, n)) continue;
      const h = r.split("-"), f = Le(a[0].bakw), l = Le(a[1].bakw), c = h.map(
        (w) => f.find((m) => `${m.prop.index}` === w) || l.find((m) => `${m.prop.index}` === w)
      );
      if (c.some((w) => !w))
        continue;
      const u = [f, l].map(
        (w) => w.find((m) => !h.includes(`${m.prop.index}`))
      );
      if (u.some((w) => !w))
        continue;
      const d = a[0].bakw.geometry.coordinates[0].slice(0, 3).map((w) => ie(w)), y = a[1].bakw.geometry.coordinates[0].slice(0, 3).map((w) => ie(w));
      if (Ve(ie(u[0].geom), y) || Ve(ie(u[1].geom), d)) {
        Fe(t, a[0], o), Fe(t, a[1], o), c.forEach((w) => {
          if (!w) return;
          const m = [
            w.geom,
            u[0].geom,
            u[1].geom,
            w.geom
          ], S = {
            a: w.prop,
            b: u[0].prop,
            c: u[1].prop
          }, E = ce([m], S), O = We(E);
          rn(t, { forw: O, bakw: E }, o);
        }), e = !0, i = !0;
        break;
      }
    }
  }
  return e;
}
function ie(o) {
  return [o[0], o[1]];
}
function Ve(o, t) {
  const [n, e] = t[0], [i, s] = t[1], [r, a] = t[2], h = r - n, f = a - e, l = i - n, c = s - e, u = o[0] - n, d = o[1] - e, y = h * h + f * f, g = h * l + f * c, w = h * u + f * d, m = l * l + c * c, S = l * u + c * d, E = y * m - g * g;
  if (E === 0) return !1;
  const O = 1 / E, C = (m * w - g * S) * O, I = (y * S - g * w) * O, F = 1e-9;
  return C >= -F && I >= -F && C + I <= 1 + F;
}
const ze = be;
class at extends En {
  importance;
  priority;
  pointsSet;
  /**
   * Tinクラスのインスタンスを生成します
   * @param options - 初期化オプション
   */
  constructor(t = {}) {
    super(), t.bounds ? this.setBounds(t.bounds) : (this.setWh(t.wh), this.vertexMode = t.vertexMode || at.VERTEX_PLAIN), this.strictMode = t.strictMode || at.MODE_AUTO, this.yaxisMode = t.yaxisMode || at.YAXIS_INVERT, this.importance = t.importance || 0, this.priority = t.priority || 0, this.stateFull = t.stateFull || !1, t.points && this.setPoints(t.points), t.edges && this.setEdges(t.edges);
  }
  /**
   * フォーマットバージョンを取得します
   */
  getFormatVersion() {
    return ze;
  }
  /**
   * 制御点（GCP: Ground Control Points）を設定します。
   * 指定した点群に合わせて内部のTINキャッシュをリセットします。
   */
  setPoints(t) {
    this.yaxisMode === at.YAXIS_FOLLOW && (t = t.map((n) => [
      n[0],
      [n[1][0], -1 * n[1][1]]
    ])), this.points = t, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * エッジ（制約線）を設定します。
   * 制約線を正規化した上で、依存するキャッシュをリセットします。
   */
  setEdges(t = []) {
    this.edges = Je(t), this.edgeNodes = void 0, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 境界ポリゴンを設定します
   */
  setBounds(t) {
    this.bounds = t;
    let n = t[0][0], e = n, i = t[0][1], s = i;
    const r = [t[0]];
    for (let a = 1; a < t.length; a++) {
      const h = t[a];
      h[0] < n && (n = h[0]), h[0] > e && (e = h[0]), h[1] < i && (i = h[1]), h[1] > s && (s = h[1]), r.push(h);
    }
    r.push(t[0]), this.boundsPolygon = ce([r]), this.xy = [n, i], this.wh = [e - n, s - i], this.vertexMode = at.VERTEX_PLAIN, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 現在の設定を永続化可能な形式にコンパイルします
   */
  getCompiled() {
    const t = {};
    t.version = ze, t.points = this.points, t.weight_buffer = this.pointsWeightBuffer, t.centroid_point = [
      this.centroid.forw.geometry.coordinates,
      this.centroid.forw.properties.target.geom
    ], t.vertices_params = [
      this.vertices_params.forw[0],
      this.vertices_params.bakw[0]
    ], t.vertices_points = [];
    const n = this.vertices_params.forw[1];
    return n && [0, 1, 2, 3].map((e) => {
      const i = n[e].features[0], s = i.geometry.coordinates[0][1], r = i.properties.b.geom;
      t.vertices_points[e] = [s, r];
    }), t.strict_status = this.strict_status, t.tins_points = [[]], this.tins.forw.features.map((e) => {
      t.tins_points[0].push(
        ["a", "b", "c"].map(
          (i) => e.properties[i].index
        )
      );
    }), this.strict_status === at.STATUS_LOOSE ? (t.tins_points[1] = [], this.tins.bakw.features.map((e) => {
      t.tins_points[1].push(
        ["a", "b", "c"].map(
          (i) => e.properties[i].index
        )
      );
    })) : this.strict_status === at.STATUS_ERROR && this.kinks?.bakw && (t.kinks_points = this.kinks.bakw.features.map(
      (e) => e.geometry.coordinates
    )), t.yaxisMode = this.yaxisMode, t.vertexMode = this.vertexMode, t.strictMode = this.strictMode, this.bounds ? (t.bounds = this.bounds, t.boundsPolygon = this.boundsPolygon, t.xy = this.xy, t.wh = this.wh) : t.wh = this.wh, t.edges = this.edges, t.edgeNodes = this.edgeNodes, t;
  }
  /**
   * 幅と高さを設定します
   */
  setWh(t) {
    this.wh = t || [100, 100], this.xy = [0, 0], this.bounds = void 0, this.boundsPolygon = void 0, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 頂点モードを設定します
   */
  setVertexMode(t) {
    this.vertexMode = t, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 厳密性モードを設定します
   */
  setStrictMode(t) {
    this.strictMode = t, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 厳密なTINを計算します
   */
  calcurateStrictTin() {
    const t = this.tins.forw.features.map(
      (i) => We(i)
    );
    this.tins.bakw = Ot(t);
    const n = {};
    this.tins.forw.features.forEach((i, s) => {
      const r = this.tins.bakw.features[s];
      rn(n, { forw: i, bakw: r });
    }), ms(
      this.tins,
      n,
      this.pointsSet?.edges || []
    );
    const e = ["forw", "bakw"].map((i) => {
      const s = this.tins[i].features.map(
        (r) => r.geometry.coordinates[0]
      );
      return qn(s);
    });
    e[0].length === 0 && e[1].length === 0 ? (this.strict_status = at.STATUS_STRICT, delete this.kinks) : (this.strict_status = at.STATUS_ERROR, this.kinks = {}, e[0].length > 0 && (this.kinks.forw = Ot(e[0])), e[1].length > 0 && (this.kinks.bakw = Ot(e[1])));
  }
  /**
   * 点群セットを生成します。
  * GCP と中間エッジノードを GeoJSON Point に変換し、後続の三角分割に備えます。
   */
  generatePointsSet() {
    const t = {
      forw: [],
      bakw: []
    };
    for (let i = 0; i < this.points.length; i++) {
      const s = this.points[i][0], r = this.points[i][1], a = ne(s, r, i);
      t.forw.push(a), t.bakw.push(se(a));
    }
    const n = [];
    let e = 0;
    this.edgeNodes = [], this.edges || (this.edges = []);
    for (let i = 0; i < this.edges.length; i++) {
      const s = this.edges[i][2], r = Object.assign([], this.edges[i][0]), a = Object.assign([], this.edges[i][1]);
      if (r.length === 0 && a.length === 0) {
        n.push(s);
        continue;
      }
      r.unshift(this.points[s[0]][0]), r.push(this.points[s[1]][0]), a.unshift(this.points[s[0]][1]), a.push(this.points[s[1]][1]);
      const h = [r, a].map((f) => {
        const l = f.map((u, d, y) => {
          if (d === 0) return 0;
          const g = y[d - 1];
          return Math.sqrt(
            Math.pow(u[0] - g[0], 2) + Math.pow(u[1] - g[1], 2)
          );
        }), c = l.reduce((u, d, y) => y === 0 ? [0] : (u.push(u[y - 1] + d), u), []);
        return c.map((u, d, y) => {
          const g = u / y[y.length - 1];
          return [f[d], l[d], c[d], g];
        });
      });
      h.map((f, l) => {
        const c = h[l ? 0 : 1];
        return f.filter((u, d) => !(d === 0 || d === f.length - 1 || u[4] === "handled")).map((u) => {
          const d = u[0], y = u[3], g = c.reduce(
            (w, m, S, E) => {
              if (w) return w;
              const O = E[S + 1];
              if (m[3] === y)
                return m[4] = "handled", [m];
              if (m[3] < y && O && O[3] > y)
                return [m, O];
            },
            void 0
          );
          if (g && g.length === 1)
            return l === 0 ? [d, g[0][0], y] : [g[0][0], d, y];
          if (g && g.length === 2) {
            const w = g[0], m = g[1], S = (y - w[3]) / (m[3] - w[3]), E = [
              (m[0][0] - w[0][0]) * S + w[0][0],
              (m[0][1] - w[0][1]) * S + w[0][1]
            ];
            return l === 0 ? [d, E, y] : [E, d, y];
          }
          return [];
        });
      }).reduce((f, l) => f.concat(l), []).sort((f, l) => f[2] < l[2] ? -1 : 1).map((f, l, c) => {
        this.edgeNodes[e] = [
          f[0],
          f[1]
        ];
        const u = ne(
          f[0],
          f[1],
          `e${e}`
        );
        e++, t.forw.push(u), t.bakw.push(se(u)), l === 0 ? n.push([s[0], t.forw.length - 1]) : n.push([
          t.forw.length - 2,
          t.forw.length - 1
        ]), l === c.length - 1 && n.push([t.forw.length - 1, s[1]]);
      });
    }
    return {
      forw: t.forw,
      bakw: t.bakw,
      edges: n
    };
  }
  /**
   * 入力データの検証と初期データの準備
   */
  validateAndPrepareInputs() {
    const t = this.xy[0] - 0.05 * this.wh[0], n = this.xy[0] + 1.05 * this.wh[0], e = this.xy[1] - 0.05 * this.wh[1], i = this.xy[1] + 1.05 * this.wh[1];
    if (!this.points.reduce((a, h) => a && (this.bounds ? on(h[0], this.boundsPolygon) : h[0][0] >= t && h[0][0] <= n && h[0][1] >= e && h[0][1] <= i), !0))
      throw "SOME POINTS OUTSIDE";
    let r = [];
    return this.wh && (r = [[t, e], [n, e], [t, i], [n, i]]), {
      pointsSet: this.generatePointsSet(),
      bbox: r,
      minx: t,
      maxx: n,
      miny: e,
      maxy: i
    };
  }
  /**
   * TINネットワークを同期的に更新し、座標変換の準備を行います。
   * 重めの計算を伴うため、呼び出し側が非同期制御を行いたい場合は
   * {@link updateTinAsync} を利用してください。
   */
  updateTin() {
    let t = this.strictMode;
    t !== at.MODE_STRICT && t !== at.MODE_LOOSE && (t = at.MODE_AUTO);
    const { pointsSet: n, bbox: e, minx: i, maxx: s, miny: r, maxy: a } = this.validateAndPrepareInputs(), h = {
      forw: Ot(n.forw),
      bakw: Ot(n.bakw)
    }, f = Zt(
      h.forw,
      n.edges,
      "target"
    ), l = Zt(
      h.bakw,
      n.edges,
      "target"
    );
    if (f.features.length === 0 || l.features.length === 0)
      throw "TOO LINEAR1";
    const c = an(h.forw), u = _e(h.forw);
    if (!u) throw "TOO LINEAR2";
    const d = {}, y = u.geometry.coordinates[0];
    let g;
    try {
      g = y.map((L) => ({
        forw: L,
        bakw: re(Yt(L), f)
      })), g.forEach((L) => {
        d[`${L.forw[0]}:${L.forw[1]}`] = L;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const w = _e(h.bakw);
    if (!w) throw "TOO LINEAR2";
    const m = w.geometry.coordinates[0];
    try {
      g = m.map((L) => ({
        bakw: L,
        forw: re(Yt(L), l)
      })), g.forEach((L) => {
        d[`${L.forw[0]}:${L.forw[1]}`] = L;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const S = {
      forw: c.geometry.coordinates,
      bakw: re(c, f)
    }, E = ne(S.forw, S.bakw, "c");
    this.centroid = {
      forw: E,
      bakw: se(E)
    };
    const O = {
      convexBuf: d,
      centroid: S,
      bbox: e,
      minx: i,
      maxx: s,
      miny: r,
      maxy: a
    }, C = this.vertexMode === at.VERTEX_BIRDEYE ? Xn(O) : zn(O), I = {
      forw: [],
      bakw: []
    };
    for (let L = 0; L < C.length; L++) {
      const tt = C[L].forw, et = C[L].bakw, X = ne(tt, et, `b${L}`), Z = se(X);
      n.forw.push(X), n.bakw.push(Z), I.forw.push(X), I.bakw.push(Z);
    }
    this.pointsSet = {
      forw: Ot(n.forw),
      bakw: Ot(n.bakw),
      edges: n.edges
    }, this.tins = {
      forw: Oe(
        Zt(
          this.pointsSet.forw,
          n.edges,
          "target"
        )
      )
    }, (t === at.MODE_STRICT || t === at.MODE_AUTO) && this.calcurateStrictTin(), (t === at.MODE_LOOSE || t === at.MODE_AUTO && this.strict_status === at.STATUS_ERROR) && (this.tins.bakw = Oe(
      Zt(
        this.pointsSet.bakw,
        n.edges,
        "target"
      )
    ), delete this.kinks, this.strict_status = at.STATUS_LOOSE), this.vertices_params = {
      forw: Ue(I.forw, this.centroid.forw),
      bakw: Ue(I.bakw, this.centroid.bakw)
    }, this.addIndexedTin();
    const F = ["forw"];
    this.strict_status === at.STATUS_LOOSE && F.push("bakw");
    const z = this.strict_status === at.STATUS_STRICT;
    this.pointsWeightBuffer = ps({
      tins: this.tins,
      targets: F,
      includeReciprocals: z
    });
  }
  /**
   * 非同期ラッパーを提供します。
   * 互換性のために Promise ベースの API を維持しますが、内部処理は同期的です。
   */
  async updateTinAsync() {
    this.updateTin();
  }
}
export {
  at as Tin,
  Zt as constrainedTin,
  se as counterPoint,
  ne as createPoint,
  qn as findIntersections,
  be as format_version,
  rn as insertSearchIndex,
  Ue as vertexCalc
};
