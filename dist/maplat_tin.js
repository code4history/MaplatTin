import un from "@turf/boolean-point-in-polygon";
import dn from "@turf/centroid";
import ve from "@turf/convex";
import { featureCollection as Ot, polygon as le, lineString as Ee, point as Kt } from "@turf/helpers";
import gn from "@turf/line-intersect";
var pn = Object.defineProperty, wn = (o, t, e) => t in o ? pn(o, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : o[t] = e, it = (o, t, e) => wn(o, typeof t != "symbol" ? t + "" : t, e);
const Tt = 11102230246251565e-32, lt = 134217729, mn = (3 + 8 * Tt) * Tt;
function ue(o, t, e, n, r) {
  let s, i, c, f, h = t[0], u = n[0], a = 0, l = 0;
  u > h == u > -h ? (s = h, h = t[++a]) : (s = u, u = n[++l]);
  let d = 0;
  if (a < o && l < e)
    for (u > h == u > -h ? (i = h + s, c = s - (i - h), h = t[++a]) : (i = u + s, c = s - (i - u), u = n[++l]), s = i, c !== 0 && (r[d++] = c); a < o && l < e; )
      u > h == u > -h ? (i = s + h, f = i - s, c = s - (i - f) + (h - f), h = t[++a]) : (i = s + u, f = i - s, c = s - (i - f) + (u - f), u = n[++l]), s = i, c !== 0 && (r[d++] = c);
  for (; a < o; )
    i = s + h, f = i - s, c = s - (i - f) + (h - f), h = t[++a], s = i, c !== 0 && (r[d++] = c);
  for (; l < e; )
    i = s + u, f = i - s, c = s - (i - f) + (u - f), u = n[++l], s = i, c !== 0 && (r[d++] = c);
  return (s !== 0 || d === 0) && (r[d++] = s), d;
}
function bn(o, t) {
  let e = t[0];
  for (let n = 1; n < o; n++) e += t[n];
  return e;
}
function Qt(o) {
  return new Float64Array(o);
}
const yn = (3 + 16 * Tt) * Tt, _n = (2 + 12 * Tt) * Tt, kn = (9 + 64 * Tt) * Tt * Tt, Lt = Qt(4), Oe = Qt(8), Ie = Qt(12), Te = Qt(16), dt = Qt(4);
function xn(o, t, e, n, r, s, i) {
  let c, f, h, u, a, l, d, m, g, b, w, S, v, I, C, N, j, q;
  const E = o - r, V = e - r, L = t - s, z = n - s;
  I = E * z, l = lt * E, d = l - (l - E), m = E - d, l = lt * z, g = l - (l - z), b = z - g, C = m * b - (I - d * g - m * g - d * b), N = L * V, l = lt * L, d = l - (l - L), m = L - d, l = lt * V, g = l - (l - V), b = V - g, j = m * b - (N - d * g - m * g - d * b), w = C - j, a = C - w, Lt[0] = C - (w + a) + (a - j), S = I + w, a = S - I, v = I - (S - a) + (w - a), w = v - N, a = v - w, Lt[1] = v - (w + a) + (a - N), q = S + w, a = q - S, Lt[2] = S - (q - a) + (w - a), Lt[3] = q;
  let W = bn(4, Lt), p = _n * i;
  if (W >= p || -W >= p || (a = o - E, c = o - (E + a) + (a - r), a = e - V, h = e - (V + a) + (a - r), a = t - L, f = t - (L + a) + (a - s), a = n - z, u = n - (z + a) + (a - s), c === 0 && f === 0 && h === 0 && u === 0) || (p = kn * i + mn * Math.abs(W), W += E * u + z * c - (L * h + V * f), W >= p || -W >= p)) return W;
  I = c * z, l = lt * c, d = l - (l - c), m = c - d, l = lt * z, g = l - (l - z), b = z - g, C = m * b - (I - d * g - m * g - d * b), N = f * V, l = lt * f, d = l - (l - f), m = f - d, l = lt * V, g = l - (l - V), b = V - g, j = m * b - (N - d * g - m * g - d * b), w = C - j, a = C - w, dt[0] = C - (w + a) + (a - j), S = I + w, a = S - I, v = I - (S - a) + (w - a), w = v - N, a = v - w, dt[1] = v - (w + a) + (a - N), q = S + w, a = q - S, dt[2] = S - (q - a) + (w - a), dt[3] = q;
  const y = ue(4, Lt, 4, dt, Oe);
  I = E * u, l = lt * E, d = l - (l - E), m = E - d, l = lt * u, g = l - (l - u), b = u - g, C = m * b - (I - d * g - m * g - d * b), N = L * h, l = lt * L, d = l - (l - L), m = L - d, l = lt * h, g = l - (l - h), b = h - g, j = m * b - (N - d * g - m * g - d * b), w = C - j, a = C - w, dt[0] = C - (w + a) + (a - j), S = I + w, a = S - I, v = I - (S - a) + (w - a), w = v - N, a = v - w, dt[1] = v - (w + a) + (a - N), q = S + w, a = q - S, dt[2] = S - (q - a) + (w - a), dt[3] = q;
  const _ = ue(y, Oe, 4, dt, Ie);
  I = c * u, l = lt * c, d = l - (l - c), m = c - d, l = lt * u, g = l - (l - u), b = u - g, C = m * b - (I - d * g - m * g - d * b), N = f * h, l = lt * f, d = l - (l - f), m = f - d, l = lt * h, g = l - (l - h), b = h - g, j = m * b - (N - d * g - m * g - d * b), w = C - j, a = C - w, dt[0] = C - (w + a) + (a - j), S = I + w, a = S - I, v = I - (S - a) + (w - a), w = v - N, a = v - w, dt[1] = v - (w + a) + (a - N), q = S + w, a = q - S, dt[2] = S - (q - a) + (w - a), dt[3] = q;
  const x = ue(_, Ie, 4, dt, Te);
  return Te[x - 1];
}
function Sn(o, t, e, n, r, s) {
  const i = (t - s) * (e - r), c = (o - r) * (n - s), f = i - c, h = Math.abs(i + c);
  return Math.abs(f) >= yn * h ? f : -xn(o, t, e, n, r, s, h);
}
function Mn(o, t) {
  var e, n, r = 0, s, i, c, f, h, u, a, l = o[0], d = o[1], m = t.length;
  for (e = 0; e < m; e++) {
    n = 0;
    var g = t[e], b = g.length - 1;
    if (u = g[0], u[0] !== g[b][0] && u[1] !== g[b][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (i = u[0] - l, c = u[1] - d, n; n < b; n++) {
      if (a = g[n + 1], f = a[0] - l, h = a[1] - d, c === 0 && h === 0) {
        if (f <= 0 && i >= 0 || i <= 0 && f >= 0)
          return 0;
      } else if (h >= 0 && c <= 0 || h <= 0 && c >= 0) {
        if (s = Sn(i, f, c, h, 0, 0), s === 0)
          return 0;
        (s > 0 && h > 0 && c <= 0 || s < 0 && h <= 0 && c > 0) && r++;
      }
      u = a, c = h, i = f;
    }
  }
  return r % 2 !== 0;
}
function Qe(o, t, e = {}) {
  const n = { type: "Feature" };
  return (e.id === 0 || e.id) && (n.id = e.id), e.bbox && (n.bbox = e.bbox), n.properties = t || {}, n.geometry = o, n;
}
function Yt(o, t, e = {}) {
  if (!o)
    throw new Error("coordinates is required");
  if (!Array.isArray(o))
    throw new Error("coordinates must be an Array");
  if (o.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!Ne(o[0]) || !Ne(o[1]))
    throw new Error("coordinates must contain numbers");
  return Qe({
    type: "Point",
    coordinates: o
  }, t, e);
}
function Ge(o, t, e = {}) {
  for (const n of o) {
    if (n.length < 4)
      throw new Error(
        "Each LinearRing of a Polygon must have 4 or more Positions."
      );
    if (n[n.length - 1].length !== n[0].length)
      throw new Error("First and last Position are not equivalent.");
    for (let r = 0; r < n[n.length - 1].length; r++)
      if (n[n.length - 1][r] !== n[0][r])
        throw new Error("First and last Position are not equivalent.");
  }
  return Qe({
    type: "Polygon",
    coordinates: o
  }, t, e);
}
function Ft(o, t = {}) {
  const e = { type: "FeatureCollection" };
  return t.id && (e.id = t.id), t.bbox && (e.bbox = t.bbox), e.features = o, e;
}
function Ne(o) {
  return !isNaN(o) && o !== null && !Array.isArray(o);
}
function An(o) {
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
function Re(o) {
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
function vn(o) {
  return o.type === "Feature" ? o.geometry : o;
}
function En(o, t, e = {}) {
  if (!o)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const n = An(o), r = vn(t), s = r.type, i = t.bbox;
  let c = r.coordinates;
  if (i && On(n, i) === !1)
    return !1;
  s === "Polygon" && (c = [c]);
  let f = !1;
  for (var h = 0; h < c.length; ++h) {
    const u = Mn(n, c[h]);
    if (u === 0) return !e.ignoreBoundary;
    u && (f = !0);
  }
  return f;
}
function On(o, t) {
  return t[0] <= o[0] && t[1] <= o[1] && t[2] >= o[0] && t[3] >= o[1];
}
var ke = En;
function Ce(o) {
  const t = o.features;
  for (let e = 0; e < t.length; e++) {
    const n = t[e];
    `${n.properties.a.index}`.substring(0, 1) === "b" && `${n.properties.b.index}`.substring(0, 1) === "b" ? t[e] = {
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            n.geometry.coordinates[0][2],
            n.geometry.coordinates[0][0],
            n.geometry.coordinates[0][1],
            n.geometry.coordinates[0][2]
          ]
        ]
      },
      properties: {
        a: {
          geom: n.properties.c.geom,
          index: n.properties.c.index
        },
        b: {
          geom: n.properties.a.geom,
          index: n.properties.a.index
        },
        c: {
          geom: n.properties.b.geom,
          index: n.properties.b.index
        }
      },
      type: "Feature"
    } : `${n.properties.c.index}`.substring(0, 1) === "b" && `${n.properties.a.index}`.substring(0, 1) === "b" && (t[e] = {
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            n.geometry.coordinates[0][1],
            n.geometry.coordinates[0][2],
            n.geometry.coordinates[0][0],
            n.geometry.coordinates[0][1]
          ]
        ]
      },
      properties: {
        a: {
          geom: n.properties.b.geom,
          index: n.properties.b.index
        },
        b: {
          geom: n.properties.c.geom,
          index: n.properties.c.index
        },
        c: {
          geom: n.properties.a.geom,
          index: n.properties.a.index
        }
      },
      type: "Feature"
    });
  }
  return o;
}
function He(o) {
  const t = ["a", "b", "c", "a"].map(
    (s) => o.properties[s].geom
  ), e = o.geometry.coordinates[0], n = o.properties, r = {
    a: { geom: e[0], index: n.a.index },
    b: { geom: e[1], index: n.b.index },
    c: { geom: e[2], index: n.c.index }
  };
  return Ge([t], r);
}
function In(o) {
  const t = [0, 1, 2, 0].map((n) => o[n][0][0]), e = {
    a: { geom: o[0][0][1], index: o[0][1] },
    b: { geom: o[1][0][1], index: o[1][1] },
    c: { geom: o[2][0][1], index: o[2][1] }
  };
  return Ge([t], e);
}
function Gt(o, t, e, n, r, s = !1, i) {
  const c = o.map(
    (f) => {
      (!i || i < 2.00703) && (f = Ze(f));
      const h = isFinite(f) ? t[f] : f === "c" ? n : f === "b0" ? r[0] : f === "b1" ? r[1] : f === "b2" ? r[2] : f === "b3" ? r[3] : (function() {
        const u = f.match(/e(\d+)/);
        if (u) {
          const a = parseInt(u[1]);
          return e[a];
        }
        throw "Bad index value for indexesToTri";
      })();
      return s ? [[h[1], h[0]], f] : [[h[0], h[1]], f];
    }
  );
  return In(c);
}
function Ze(o) {
  return typeof o == "number" ? o : o.replace(/^(c|e|b)(?:ent|dgeNode|box)(\d+)?$/, "$1$2");
}
function tn(o, t) {
  return t && t >= 2.00703 || Array.isArray(o[0]) ? o : o.map((e) => [
    e.illstNodes,
    e.mercNodes,
    e.startEnd
  ]);
}
function Be(o, t) {
  for (let e = 0; e < t.features.length; e++)
    if (ke(o, t.features[e]))
      return t.features[e];
}
function en(o, t, e) {
  const n = t.geometry.coordinates[0][0], r = t.geometry.coordinates[0][1], s = t.geometry.coordinates[0][2], i = o.geometry.coordinates, c = t.properties.a.geom, f = t.properties.b.geom, h = t.properties.c.geom, u = [r[0] - n[0], r[1] - n[1]], a = [s[0] - n[0], s[1] - n[1]], l = [i[0] - n[0], i[1] - n[1]], d = [f[0] - c[0], f[1] - c[1]], m = [h[0] - c[0], h[1] - c[1]];
  let g = (a[1] * l[0] - a[0] * l[1]) / (u[0] * a[1] - u[1] * a[0]), b = (u[0] * l[1] - u[1] * l[0]) / (u[0] * a[1] - u[1] * a[0]);
  if (e) {
    const w = e[t.properties.a.index], S = e[t.properties.b.index], v = e[t.properties.c.index];
    let I;
    if (g < 0 || b < 0 || 1 - g - b < 0) {
      const C = g / (g + b), N = b / (g + b);
      I = g / S / (C / S + N / v), b = b / v / (C / S + N / v);
    } else
      I = g / S / (g / S + b / v + (1 - g - b) / w), b = b / v / (g / S + b / v + (1 - g - b) / w);
    g = I;
  }
  return [
    g * d[0] + b * m[0] + c[0],
    g * d[1] + b * m[1] + c[1]
  ];
}
function Tn(o, t, e, n) {
  const r = o.geometry.coordinates, s = e.geometry.coordinates, i = Math.atan2(r[0] - s[0], r[1] - s[1]), c = Nn(i, t[0]);
  if (c === void 0)
    throw new Error("Unable to determine vertex index");
  const f = t[1][c];
  return en(o, f.features[0], n);
}
function ae(o, t, e, n, r, s, i, c) {
  let f;
  if (i && (f = Be(o, Ft([i]))), !f) {
    if (e) {
      const h = o.geometry.coordinates, u = e.gridNum, a = e.xOrigin, l = e.yOrigin, d = e.xUnit, m = e.yUnit, g = e.gridCache, b = Mt(h[0], a, d, u), w = Mt(h[1], l, m, u), S = g[b] ? g[b][w] ? g[b][w] : [] : [];
      t = Ft(S.map((v) => t.features[v]));
    }
    f = Be(o, t);
  }
  return c && c(f), f ? en(o, f, s) : Tn(o, n, r, s);
}
function Mt(o, t, e, n) {
  let r = Math.floor((o - t) / e);
  return r >= n && (r = n - 1), r;
}
function Nn(o, t) {
  let e = Ue(o - t[0]), n = Math.PI * 2, r;
  for (let s = 0; s < t.length; s++) {
    const i = (s + 1) % t.length, c = Ue(o - t[i]), f = Math.min(Math.abs(e), Math.abs(c));
    e * c <= 0 && f < n && (n = f, r = s), e = c;
  }
  return r;
}
function Ue(o, t = !1) {
  const e = t ? function(n) {
    return !(n >= 0 && n < Math.PI * 2);
  } : function(n) {
    return !(n > -1 * Math.PI && n <= Math.PI);
  };
  for (; e(o); )
    o = o + 2 * Math.PI * (o > 0 ? -1 : 1);
  return o;
}
const xe = 2.00703, yt = class _t {
  constructor() {
    it(this, "points", []), it(this, "pointsWeightBuffer"), it(this, "strict_status"), it(this, "vertices_params"), it(this, "centroid"), it(this, "edgeNodes"), it(this, "edges"), it(this, "tins"), it(this, "kinks"), it(this, "yaxisMode", _t.YAXIS_INVERT), it(this, "strictMode", _t.MODE_AUTO), it(this, "vertexMode", _t.VERTEX_PLAIN), it(this, "bounds"), it(this, "boundsPolygon"), it(this, "wh"), it(this, "xy"), it(this, "indexedTins"), it(this, "stateFull", !1), it(this, "stateTriangle"), it(this, "stateBackward");
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
      this.points = t.points, this.pointsWeightBuffer = !t.version || t.version < 2.00703 ? ["forw", "bakw"].reduce((n, r) => {
        const s = t.weight_buffer[r];
        return s && (n[r] = Object.keys(s).reduce((i, c) => {
          const f = Ze(c);
          return i[f] = s[c], i;
        }, {})), n;
      }, {}) : t.weight_buffer, t.strict_status ? this.strict_status = t.strict_status : t.kinks_points ? this.strict_status = _t.STATUS_ERROR : t.tins_points.length == 2 ? this.strict_status = _t.STATUS_LOOSE : this.strict_status = _t.STATUS_STRICT, this.vertices_params = {
        forw: [t.vertices_params[0]],
        bakw: [t.vertices_params[1]]
      }, this.vertices_params.forw[1] = [0, 1, 2, 3].map((n) => {
        const r = (n + 1) % 4, s = Gt(
          ["c", `b${n}`, `b${r}`],
          t.points,
          t.edgeNodes || [],
          t.centroid_point,
          t.vertices_points,
          !1,
          xe
        );
        return Ft([s]);
      }), this.vertices_params.bakw[1] = [0, 1, 2, 3].map((n) => {
        const r = (n + 1) % 4, s = Gt(
          ["c", `b${n}`, `b${r}`],
          t.points,
          t.edgeNodes || [],
          t.centroid_point,
          t.vertices_points,
          !0,
          xe
        );
        return Ft([s]);
      }), this.centroid = {
        forw: Yt(t.centroid_point[0], {
          target: {
            geom: t.centroid_point[1],
            index: "c"
          }
        }),
        bakw: Yt(t.centroid_point[1], {
          target: {
            geom: t.centroid_point[0],
            index: "c"
          }
        })
      }, this.edges = tn(t.edges || []), this.edgeNodes = t.edgeNodes || [];
      const e = t.tins_points.length == 1 ? 0 : 1;
      this.tins = {
        forw: Ft(
          t.tins_points[0].map(
            (n) => Gt(
              n,
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
          t.tins_points[e].map(
            (n) => Gt(
              n,
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
          t.kinks_points.map((n) => Yt(n))
        )
      }), t.yaxisMode ? this.yaxisMode = t.yaxisMode : this.yaxisMode = _t.YAXIS_INVERT, t.vertexMode && (this.vertexMode = t.vertexMode), t.strictMode && (this.strictMode = t.strictMode), t.bounds ? (this.bounds = t.bounds, this.boundsPolygon = t.boundsPolygon, this.xy = t.xy, this.wh = t.wh) : (this.xy = [0, 0], t.wh && (this.wh = t.wh), this.bounds = void 0, this.boundsPolygon = void 0);
    } else {
      t = JSON.parse(
        JSON.stringify(t).replace('"cent"', '"c"').replace(/"bbox(\d+)"/g, '"b$1"')
      ), this.tins = t.tins, this.addIndexedTin(), this.strict_status = t.strict_status, this.pointsWeightBuffer = t.weight_buffer, this.vertices_params = t.vertices_params, this.centroid = t.centroid, this.kinks = t.kinks;
      const e = [];
      for (let n = 0; n < this.tins.forw.features.length; n++) {
        const r = this.tins.forw.features[n];
        ["a", "b", "c"].map((s, i) => {
          const c = r.geometry.coordinates[0][i], f = r.properties[s].geom, h = r.properties[s].index;
          typeof h == "number" && (e[h] = [c, f]);
        });
      }
      this.points = e;
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
    const t = this.tins, e = t.forw, n = t.bakw, r = Math.ceil(Math.sqrt(e.features.length));
    if (r < 3) {
      this.indexedTins = void 0;
      return;
    }
    let s = [], i = [];
    const c = e.features.map((g) => {
      let b = [];
      return Re(g)[0].map((w) => {
        s.length === 0 ? s = [Array.from(w), Array.from(w)] : (w[0] < s[0][0] && (s[0][0] = w[0]), w[0] > s[1][0] && (s[1][0] = w[0]), w[1] < s[0][1] && (s[0][1] = w[1]), w[1] > s[1][1] && (s[1][1] = w[1])), b.length === 0 ? b = [Array.from(w), Array.from(w)] : (w[0] < b[0][0] && (b[0][0] = w[0]), w[0] > b[1][0] && (b[1][0] = w[0]), w[1] < b[0][1] && (b[0][1] = w[1]), w[1] > b[1][1] && (b[1][1] = w[1]));
      }), b;
    }), f = (s[1][0] - s[0][0]) / r, h = (s[1][1] - s[0][1]) / r, u = c.reduce(
      (g, b, w) => {
        const S = Mt(
          b[0][0],
          s[0][0],
          f,
          r
        ), v = Mt(
          b[1][0],
          s[0][0],
          f,
          r
        ), I = Mt(
          b[0][1],
          s[0][1],
          h,
          r
        ), C = Mt(
          b[1][1],
          s[0][1],
          h,
          r
        );
        for (let N = S; N <= v; N++) {
          g[N] || (g[N] = []);
          for (let j = I; j <= C; j++)
            g[N][j] || (g[N][j] = []), g[N][j].push(w);
        }
        return g;
      },
      []
    ), a = n.features.map((g) => {
      let b = [];
      return Re(g)[0].map((w) => {
        i.length === 0 ? i = [Array.from(w), Array.from(w)] : (w[0] < i[0][0] && (i[0][0] = w[0]), w[0] > i[1][0] && (i[1][0] = w[0]), w[1] < i[0][1] && (i[0][1] = w[1]), w[1] > i[1][1] && (i[1][1] = w[1])), b.length === 0 ? b = [Array.from(w), Array.from(w)] : (w[0] < b[0][0] && (b[0][0] = w[0]), w[0] > b[1][0] && (b[1][0] = w[0]), w[1] < b[0][1] && (b[0][1] = w[1]), w[1] > b[1][1] && (b[1][1] = w[1]));
      }), b;
    }), l = (i[1][0] - i[0][0]) / r, d = (i[1][1] - i[0][1]) / r, m = a.reduce(
      (g, b, w) => {
        const S = Mt(
          b[0][0],
          i[0][0],
          l,
          r
        ), v = Mt(
          b[1][0],
          i[0][0],
          l,
          r
        ), I = Mt(
          b[0][1],
          i[0][1],
          d,
          r
        ), C = Mt(
          b[1][1],
          i[0][1],
          d,
          r
        );
        for (let N = S; N <= v; N++) {
          g[N] || (g[N] = []);
          for (let j = I; j <= C; j++)
            g[N][j] || (g[N][j] = []), g[N][j].push(w);
        }
        return g;
      },
      []
    );
    this.indexedTins = {
      forw: {
        gridNum: r,
        xOrigin: s[0][0],
        yOrigin: s[0][1],
        xUnit: f,
        yUnit: h,
        gridCache: u
      },
      bakw: {
        gridNum: r,
        xOrigin: i[0][0],
        yOrigin: i[0][1],
        xUnit: l,
        yUnit: d,
        gridCache: m
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
  transform(t, e, n) {
    if (e && this.strict_status == _t.STATUS_ERROR)
      throw 'Backward transform is not allowed if strict_status == "strict_error"';
    this.yaxisMode == _t.YAXIS_FOLLOW && e && (t = [t[0], -1 * t[1]]);
    const r = Yt(t);
    if (this.bounds && !e && !n && !ke(r, this.boundsPolygon))
      return !1;
    const s = e ? this.tins.bakw : this.tins.forw, i = e ? this.indexedTins.bakw : this.indexedTins.forw, c = e ? this.vertices_params.bakw : this.vertices_params.forw, f = e ? this.centroid.bakw : this.centroid.forw, h = e ? this.pointsWeightBuffer.bakw : this.pointsWeightBuffer.forw;
    let u, a;
    this.stateFull && (this.stateBackward == e ? u = this.stateTriangle : (this.stateBackward = e, this.stateTriangle = void 0), a = (d) => {
      this.stateTriangle = d;
    });
    let l = ae(
      r,
      s,
      i,
      c,
      f,
      h,
      u,
      a
    );
    if (this.bounds && e && !n) {
      const d = Yt(l);
      if (!ke(d, this.boundsPolygon)) return !1;
    } else this.yaxisMode == _t.YAXIS_FOLLOW && !e && (l = [l[0], -1 * l[1]]);
    return l;
  }
};
it(yt, "VERTEX_PLAIN", "plain"), it(yt, "VERTEX_BIRDEYE", "birdeye"), it(yt, "MODE_STRICT", "strict"), it(yt, "MODE_AUTO", "auto"), it(yt, "MODE_LOOSE", "loose"), it(yt, "STATUS_STRICT", "strict"), it(yt, "STATUS_ERROR", "strict_error"), it(yt, "STATUS_LOOSE", "loose"), it(yt, "YAXIS_FOLLOW", "follow"), it(yt, "YAXIS_INVERT", "invert");
let Rn = yt;
const ut = 11102230246251565e-32, B = 134217729, nn = (3 + 8 * ut) * ut;
function at(o, t, e, n, r) {
  let s, i, c, f, h = t[0], u = n[0], a = 0, l = 0;
  u > h == u > -h ? (s = h, h = t[++a]) : (s = u, u = n[++l]);
  let d = 0;
  if (a < o && l < e)
    for (u > h == u > -h ? (i = h + s, c = s - (i - h), h = t[++a]) : (i = u + s, c = s - (i - u), u = n[++l]), s = i, c !== 0 && (r[d++] = c); a < o && l < e; )
      u > h == u > -h ? (i = s + h, f = i - s, c = s - (i - f) + (h - f), h = t[++a]) : (i = s + u, f = i - s, c = s - (i - f) + (u - f), u = n[++l]), s = i, c !== 0 && (r[d++] = c);
  for (; a < o; )
    i = s + h, f = i - s, c = s - (i - f) + (h - f), h = t[++a], s = i, c !== 0 && (r[d++] = c);
  for (; l < e; )
    i = s + u, f = i - s, c = s - (i - f) + (u - f), u = n[++l], s = i, c !== 0 && (r[d++] = c);
  return (s !== 0 || d === 0) && (r[d++] = s), d;
}
function bt(o, t, e, n, r, s, i, c) {
  return at(at(o, t, e, n, i), i, r, s, c);
}
function A(o, t, e, n) {
  let r, s, i, c, f, h, u, a, l, d, m;
  u = B * e, d = u - (u - e), m = e - d;
  let g = t[0];
  r = g * e, u = B * g, a = u - (u - g), l = g - a, i = l * m - (r - a * d - l * d - a * m);
  let b = 0;
  i !== 0 && (n[b++] = i);
  for (let w = 1; w < o; w++)
    g = t[w], c = g * e, u = B * g, a = u - (u - g), l = g - a, f = l * m - (c - a * d - l * d - a * m), s = r + f, h = s - r, i = r - (s - h) + (f - h), i !== 0 && (n[b++] = i), r = c + s, i = s - (r - c), i !== 0 && (n[b++] = i);
  return (r !== 0 || b === 0) && (n[b++] = r), b;
}
function sn(o, t) {
  let e = t[0];
  for (let n = 1; n < o; n++) e += t[n];
  return e;
}
function H(o) {
  return new Float64Array(o);
}
const Cn = (3 + 16 * ut) * ut, Bn = (2 + 12 * ut) * ut, Un = (9 + 64 * ut) * ut * ut, zt = H(4), je = H(8), De = H(12), Pe = H(16), gt = H(4);
function jn(o, t, e, n, r, s, i) {
  let c, f, h, u, a, l, d, m, g, b, w, S, v, I, C, N, j, q;
  const E = o - r, V = e - r, L = t - s, z = n - s;
  I = E * z, l = B * E, d = l - (l - E), m = E - d, l = B * z, g = l - (l - z), b = z - g, C = m * b - (I - d * g - m * g - d * b), N = L * V, l = B * L, d = l - (l - L), m = L - d, l = B * V, g = l - (l - V), b = V - g, j = m * b - (N - d * g - m * g - d * b), w = C - j, a = C - w, zt[0] = C - (w + a) + (a - j), S = I + w, a = S - I, v = I - (S - a) + (w - a), w = v - N, a = v - w, zt[1] = v - (w + a) + (a - N), q = S + w, a = q - S, zt[2] = S - (q - a) + (w - a), zt[3] = q;
  let W = sn(4, zt), p = Bn * i;
  if (W >= p || -W >= p || (a = o - E, c = o - (E + a) + (a - r), a = e - V, h = e - (V + a) + (a - r), a = t - L, f = t - (L + a) + (a - s), a = n - z, u = n - (z + a) + (a - s), c === 0 && f === 0 && h === 0 && u === 0) || (p = Un * i + nn * Math.abs(W), W += E * u + z * c - (L * h + V * f), W >= p || -W >= p)) return W;
  I = c * z, l = B * c, d = l - (l - c), m = c - d, l = B * z, g = l - (l - z), b = z - g, C = m * b - (I - d * g - m * g - d * b), N = f * V, l = B * f, d = l - (l - f), m = f - d, l = B * V, g = l - (l - V), b = V - g, j = m * b - (N - d * g - m * g - d * b), w = C - j, a = C - w, gt[0] = C - (w + a) + (a - j), S = I + w, a = S - I, v = I - (S - a) + (w - a), w = v - N, a = v - w, gt[1] = v - (w + a) + (a - N), q = S + w, a = q - S, gt[2] = S - (q - a) + (w - a), gt[3] = q;
  const y = at(4, zt, 4, gt, je);
  I = E * u, l = B * E, d = l - (l - E), m = E - d, l = B * u, g = l - (l - u), b = u - g, C = m * b - (I - d * g - m * g - d * b), N = L * h, l = B * L, d = l - (l - L), m = L - d, l = B * h, g = l - (l - h), b = h - g, j = m * b - (N - d * g - m * g - d * b), w = C - j, a = C - w, gt[0] = C - (w + a) + (a - j), S = I + w, a = S - I, v = I - (S - a) + (w - a), w = v - N, a = v - w, gt[1] = v - (w + a) + (a - N), q = S + w, a = q - S, gt[2] = S - (q - a) + (w - a), gt[3] = q;
  const _ = at(y, je, 4, gt, De);
  I = c * u, l = B * c, d = l - (l - c), m = c - d, l = B * u, g = l - (l - u), b = u - g, C = m * b - (I - d * g - m * g - d * b), N = f * h, l = B * f, d = l - (l - f), m = f - d, l = B * h, g = l - (l - h), b = h - g, j = m * b - (N - d * g - m * g - d * b), w = C - j, a = C - w, gt[0] = C - (w + a) + (a - j), S = I + w, a = S - I, v = I - (S - a) + (w - a), w = v - N, a = v - w, gt[1] = v - (w + a) + (a - N), q = S + w, a = q - S, gt[2] = S - (q - a) + (w - a), gt[3] = q;
  const x = at(_, De, 4, gt, Pe);
  return Pe[x - 1];
}
function It(o, t, e, n, r, s) {
  const i = (t - s) * (e - r), c = (o - r) * (n - s), f = i - c, h = Math.abs(i + c);
  return Math.abs(f) >= Cn * h ? f : -jn(o, t, e, n, r, s, h);
}
const Dn = (10 + 96 * ut) * ut, Pn = (4 + 48 * ut) * ut, $n = (44 + 576 * ut) * ut * ut, Nt = H(4), Rt = H(4), Ct = H(4), kt = H(4), xt = H(4), St = H(4), pt = H(4), wt = H(4), de = H(8), ge = H(8), pe = H(8), we = H(8), me = H(8), be = H(8), Ht = H(8), Zt = H(8), te = H(8), jt = H(4), Dt = H(4), Pt = H(4), U = H(8), X = H(16), nt = H(16), st = H(16), et = H(32), Bt = H(32), rt = H(48), mt = H(64);
let Xt = H(1152), ye = H(1152);
function ot(o, t, e) {
  o = at(o, Xt, t, e, ye);
  const n = Xt;
  return Xt = ye, ye = n, o;
}
function Fn(o, t, e, n, r, s, i, c, f) {
  let h, u, a, l, d, m, g, b, w, S, v, I, C, N, j, q, E, V, L, z, W, p, y, _, x, M, T, k, O, D, R, P, $, Y, F;
  const J = o - i, K = e - i, Q = r - i, Z = t - c, G = n - c, tt = s - c;
  R = K * tt, y = B * K, _ = y - (y - K), x = K - _, y = B * tt, M = y - (y - tt), T = tt - M, P = x * T - (R - _ * M - x * M - _ * T), $ = Q * G, y = B * Q, _ = y - (y - Q), x = Q - _, y = B * G, M = y - (y - G), T = G - M, Y = x * T - ($ - _ * M - x * M - _ * T), k = P - Y, p = P - k, Nt[0] = P - (k + p) + (p - Y), O = R + k, p = O - R, D = R - (O - p) + (k - p), k = D - $, p = D - k, Nt[1] = D - (k + p) + (p - $), F = O + k, p = F - O, Nt[2] = O - (F - p) + (k - p), Nt[3] = F, R = Q * Z, y = B * Q, _ = y - (y - Q), x = Q - _, y = B * Z, M = y - (y - Z), T = Z - M, P = x * T - (R - _ * M - x * M - _ * T), $ = J * tt, y = B * J, _ = y - (y - J), x = J - _, y = B * tt, M = y - (y - tt), T = tt - M, Y = x * T - ($ - _ * M - x * M - _ * T), k = P - Y, p = P - k, Rt[0] = P - (k + p) + (p - Y), O = R + k, p = O - R, D = R - (O - p) + (k - p), k = D - $, p = D - k, Rt[1] = D - (k + p) + (p - $), F = O + k, p = F - O, Rt[2] = O - (F - p) + (k - p), Rt[3] = F, R = J * G, y = B * J, _ = y - (y - J), x = J - _, y = B * G, M = y - (y - G), T = G - M, P = x * T - (R - _ * M - x * M - _ * T), $ = K * Z, y = B * K, _ = y - (y - K), x = K - _, y = B * Z, M = y - (y - Z), T = Z - M, Y = x * T - ($ - _ * M - x * M - _ * T), k = P - Y, p = P - k, Ct[0] = P - (k + p) + (p - Y), O = R + k, p = O - R, D = R - (O - p) + (k - p), k = D - $, p = D - k, Ct[1] = D - (k + p) + (p - $), F = O + k, p = F - O, Ct[2] = O - (F - p) + (k - p), Ct[3] = F, h = at(
    at(
      at(
        A(A(4, Nt, J, U), U, J, X),
        X,
        A(A(4, Nt, Z, U), U, Z, nt),
        nt,
        et
      ),
      et,
      at(
        A(A(4, Rt, K, U), U, K, X),
        X,
        A(A(4, Rt, G, U), U, G, nt),
        nt,
        Bt
      ),
      Bt,
      mt
    ),
    mt,
    at(
      A(A(4, Ct, Q, U), U, Q, X),
      X,
      A(A(4, Ct, tt, U), U, tt, nt),
      nt,
      et
    ),
    et,
    Xt
  );
  let At = sn(h, Xt), qt = Pn * f;
  if (At >= qt || -At >= qt || (p = o - J, u = o - (J + p) + (p - i), p = t - Z, d = t - (Z + p) + (p - c), p = e - K, a = e - (K + p) + (p - i), p = n - G, m = n - (G + p) + (p - c), p = r - Q, l = r - (Q + p) + (p - i), p = s - tt, g = s - (tt + p) + (p - c), u === 0 && a === 0 && l === 0 && d === 0 && m === 0 && g === 0) || (qt = $n * f + nn * Math.abs(At), At += (J * J + Z * Z) * (K * g + tt * a - (G * l + Q * m)) + 2 * (J * u + Z * d) * (K * tt - G * Q) + ((K * K + G * G) * (Q * d + Z * l - (tt * u + J * g)) + 2 * (K * a + G * m) * (Q * Z - tt * J)) + ((Q * Q + tt * tt) * (J * m + G * u - (Z * a + K * d)) + 2 * (Q * l + tt * g) * (J * G - Z * K)), At >= qt || -At >= qt))
    return At;
  if ((a !== 0 || m !== 0 || l !== 0 || g !== 0) && (R = J * J, y = B * J, _ = y - (y - J), x = J - _, P = x * x - (R - _ * _ - (_ + _) * x), $ = Z * Z, y = B * Z, _ = y - (y - Z), x = Z - _, Y = x * x - ($ - _ * _ - (_ + _) * x), k = P + Y, p = k - P, kt[0] = P - (k - p) + (Y - p), O = R + k, p = O - R, D = R - (O - p) + (k - p), k = D + $, p = k - D, kt[1] = D - (k - p) + ($ - p), F = O + k, p = F - O, kt[2] = O - (F - p) + (k - p), kt[3] = F), (l !== 0 || g !== 0 || u !== 0 || d !== 0) && (R = K * K, y = B * K, _ = y - (y - K), x = K - _, P = x * x - (R - _ * _ - (_ + _) * x), $ = G * G, y = B * G, _ = y - (y - G), x = G - _, Y = x * x - ($ - _ * _ - (_ + _) * x), k = P + Y, p = k - P, xt[0] = P - (k - p) + (Y - p), O = R + k, p = O - R, D = R - (O - p) + (k - p), k = D + $, p = k - D, xt[1] = D - (k - p) + ($ - p), F = O + k, p = F - O, xt[2] = O - (F - p) + (k - p), xt[3] = F), (u !== 0 || d !== 0 || a !== 0 || m !== 0) && (R = Q * Q, y = B * Q, _ = y - (y - Q), x = Q - _, P = x * x - (R - _ * _ - (_ + _) * x), $ = tt * tt, y = B * tt, _ = y - (y - tt), x = tt - _, Y = x * x - ($ - _ * _ - (_ + _) * x), k = P + Y, p = k - P, St[0] = P - (k - p) + (Y - p), O = R + k, p = O - R, D = R - (O - p) + (k - p), k = D + $, p = k - D, St[1] = D - (k - p) + ($ - p), F = O + k, p = F - O, St[2] = O - (F - p) + (k - p), St[3] = F), u !== 0 && (b = A(4, Nt, u, de), h = ot(h, bt(
    A(b, de, 2 * J, X),
    X,
    A(A(4, St, u, U), U, G, nt),
    nt,
    A(A(4, xt, u, U), U, -tt, st),
    st,
    et,
    rt
  ), rt)), d !== 0 && (w = A(4, Nt, d, ge), h = ot(h, bt(
    A(w, ge, 2 * Z, X),
    X,
    A(A(4, xt, d, U), U, Q, nt),
    nt,
    A(A(4, St, d, U), U, -K, st),
    st,
    et,
    rt
  ), rt)), a !== 0 && (S = A(4, Rt, a, pe), h = ot(h, bt(
    A(S, pe, 2 * K, X),
    X,
    A(A(4, kt, a, U), U, tt, nt),
    nt,
    A(A(4, St, a, U), U, -Z, st),
    st,
    et,
    rt
  ), rt)), m !== 0 && (v = A(4, Rt, m, we), h = ot(h, bt(
    A(v, we, 2 * G, X),
    X,
    A(A(4, St, m, U), U, J, nt),
    nt,
    A(A(4, kt, m, U), U, -Q, st),
    st,
    et,
    rt
  ), rt)), l !== 0 && (I = A(4, Ct, l, me), h = ot(h, bt(
    A(I, me, 2 * Q, X),
    X,
    A(A(4, xt, l, U), U, Z, nt),
    nt,
    A(A(4, kt, l, U), U, -G, st),
    st,
    et,
    rt
  ), rt)), g !== 0 && (C = A(4, Ct, g, be), h = ot(h, bt(
    A(C, be, 2 * tt, X),
    X,
    A(A(4, kt, g, U), U, K, nt),
    nt,
    A(A(4, xt, g, U), U, -J, st),
    st,
    et,
    rt
  ), rt)), u !== 0 || d !== 0) {
    if (a !== 0 || m !== 0 || l !== 0 || g !== 0 ? (R = a * tt, y = B * a, _ = y - (y - a), x = a - _, y = B * tt, M = y - (y - tt), T = tt - M, P = x * T - (R - _ * M - x * M - _ * T), $ = K * g, y = B * K, _ = y - (y - K), x = K - _, y = B * g, M = y - (y - g), T = g - M, Y = x * T - ($ - _ * M - x * M - _ * T), k = P + Y, p = k - P, pt[0] = P - (k - p) + (Y - p), O = R + k, p = O - R, D = R - (O - p) + (k - p), k = D + $, p = k - D, pt[1] = D - (k - p) + ($ - p), F = O + k, p = F - O, pt[2] = O - (F - p) + (k - p), pt[3] = F, R = l * -G, y = B * l, _ = y - (y - l), x = l - _, y = B * -G, M = y - (y - -G), T = -G - M, P = x * T - (R - _ * M - x * M - _ * T), $ = Q * -m, y = B * Q, _ = y - (y - Q), x = Q - _, y = B * -m, M = y - (y - -m), T = -m - M, Y = x * T - ($ - _ * M - x * M - _ * T), k = P + Y, p = k - P, wt[0] = P - (k - p) + (Y - p), O = R + k, p = O - R, D = R - (O - p) + (k - p), k = D + $, p = k - D, wt[1] = D - (k - p) + ($ - p), F = O + k, p = F - O, wt[2] = O - (F - p) + (k - p), wt[3] = F, j = at(4, pt, 4, wt, Zt), R = a * g, y = B * a, _ = y - (y - a), x = a - _, y = B * g, M = y - (y - g), T = g - M, P = x * T - (R - _ * M - x * M - _ * T), $ = l * m, y = B * l, _ = y - (y - l), x = l - _, y = B * m, M = y - (y - m), T = m - M, Y = x * T - ($ - _ * M - x * M - _ * T), k = P - Y, p = P - k, Dt[0] = P - (k + p) + (p - Y), O = R + k, p = O - R, D = R - (O - p) + (k - p), k = D - $, p = D - k, Dt[1] = D - (k + p) + (p - $), F = O + k, p = F - O, Dt[2] = O - (F - p) + (k - p), Dt[3] = F, V = 4) : (Zt[0] = 0, j = 1, Dt[0] = 0, V = 1), u !== 0) {
      const ht = A(j, Zt, u, st);
      h = ot(h, at(
        A(b, de, u, X),
        X,
        A(ht, st, 2 * J, et),
        et,
        rt
      ), rt);
      const ft = A(V, Dt, u, U);
      h = ot(h, bt(
        A(ft, U, 2 * J, X),
        X,
        A(ft, U, u, nt),
        nt,
        A(ht, st, u, et),
        et,
        Bt,
        mt
      ), mt), m !== 0 && (h = ot(h, A(A(4, St, u, U), U, m, X), X)), g !== 0 && (h = ot(h, A(A(4, xt, -u, U), U, g, X), X));
    }
    if (d !== 0) {
      const ht = A(j, Zt, d, st);
      h = ot(h, at(
        A(w, ge, d, X),
        X,
        A(ht, st, 2 * Z, et),
        et,
        rt
      ), rt);
      const ft = A(V, Dt, d, U);
      h = ot(h, bt(
        A(ft, U, 2 * Z, X),
        X,
        A(ft, U, d, nt),
        nt,
        A(ht, st, d, et),
        et,
        Bt,
        mt
      ), mt);
    }
  }
  if (a !== 0 || m !== 0) {
    if (l !== 0 || g !== 0 || u !== 0 || d !== 0 ? (R = l * Z, y = B * l, _ = y - (y - l), x = l - _, y = B * Z, M = y - (y - Z), T = Z - M, P = x * T - (R - _ * M - x * M - _ * T), $ = Q * d, y = B * Q, _ = y - (y - Q), x = Q - _, y = B * d, M = y - (y - d), T = d - M, Y = x * T - ($ - _ * M - x * M - _ * T), k = P + Y, p = k - P, pt[0] = P - (k - p) + (Y - p), O = R + k, p = O - R, D = R - (O - p) + (k - p), k = D + $, p = k - D, pt[1] = D - (k - p) + ($ - p), F = O + k, p = F - O, pt[2] = O - (F - p) + (k - p), pt[3] = F, z = -tt, W = -g, R = u * z, y = B * u, _ = y - (y - u), x = u - _, y = B * z, M = y - (y - z), T = z - M, P = x * T - (R - _ * M - x * M - _ * T), $ = J * W, y = B * J, _ = y - (y - J), x = J - _, y = B * W, M = y - (y - W), T = W - M, Y = x * T - ($ - _ * M - x * M - _ * T), k = P + Y, p = k - P, wt[0] = P - (k - p) + (Y - p), O = R + k, p = O - R, D = R - (O - p) + (k - p), k = D + $, p = k - D, wt[1] = D - (k - p) + ($ - p), F = O + k, p = F - O, wt[2] = O - (F - p) + (k - p), wt[3] = F, q = at(4, pt, 4, wt, te), R = l * d, y = B * l, _ = y - (y - l), x = l - _, y = B * d, M = y - (y - d), T = d - M, P = x * T - (R - _ * M - x * M - _ * T), $ = u * g, y = B * u, _ = y - (y - u), x = u - _, y = B * g, M = y - (y - g), T = g - M, Y = x * T - ($ - _ * M - x * M - _ * T), k = P - Y, p = P - k, Pt[0] = P - (k + p) + (p - Y), O = R + k, p = O - R, D = R - (O - p) + (k - p), k = D - $, p = D - k, Pt[1] = D - (k + p) + (p - $), F = O + k, p = F - O, Pt[2] = O - (F - p) + (k - p), Pt[3] = F, L = 4) : (te[0] = 0, q = 1, Pt[0] = 0, L = 1), a !== 0) {
      const ht = A(q, te, a, st);
      h = ot(h, at(
        A(S, pe, a, X),
        X,
        A(ht, st, 2 * K, et),
        et,
        rt
      ), rt);
      const ft = A(L, Pt, a, U);
      h = ot(h, bt(
        A(ft, U, 2 * K, X),
        X,
        A(ft, U, a, nt),
        nt,
        A(ht, st, a, et),
        et,
        Bt,
        mt
      ), mt), g !== 0 && (h = ot(h, A(A(4, kt, a, U), U, g, X), X)), d !== 0 && (h = ot(h, A(A(4, St, -a, U), U, d, X), X));
    }
    if (m !== 0) {
      const ht = A(q, te, m, st);
      h = ot(h, at(
        A(v, we, m, X),
        X,
        A(ht, st, 2 * G, et),
        et,
        rt
      ), rt);
      const ft = A(L, Pt, m, U);
      h = ot(h, bt(
        A(ft, U, 2 * G, X),
        X,
        A(ft, U, m, nt),
        nt,
        A(ht, st, m, et),
        et,
        Bt,
        mt
      ), mt);
    }
  }
  if (l !== 0 || g !== 0) {
    if (u !== 0 || d !== 0 || a !== 0 || m !== 0 ? (R = u * G, y = B * u, _ = y - (y - u), x = u - _, y = B * G, M = y - (y - G), T = G - M, P = x * T - (R - _ * M - x * M - _ * T), $ = J * m, y = B * J, _ = y - (y - J), x = J - _, y = B * m, M = y - (y - m), T = m - M, Y = x * T - ($ - _ * M - x * M - _ * T), k = P + Y, p = k - P, pt[0] = P - (k - p) + (Y - p), O = R + k, p = O - R, D = R - (O - p) + (k - p), k = D + $, p = k - D, pt[1] = D - (k - p) + ($ - p), F = O + k, p = F - O, pt[2] = O - (F - p) + (k - p), pt[3] = F, z = -Z, W = -d, R = a * z, y = B * a, _ = y - (y - a), x = a - _, y = B * z, M = y - (y - z), T = z - M, P = x * T - (R - _ * M - x * M - _ * T), $ = K * W, y = B * K, _ = y - (y - K), x = K - _, y = B * W, M = y - (y - W), T = W - M, Y = x * T - ($ - _ * M - x * M - _ * T), k = P + Y, p = k - P, wt[0] = P - (k - p) + (Y - p), O = R + k, p = O - R, D = R - (O - p) + (k - p), k = D + $, p = k - D, wt[1] = D - (k - p) + ($ - p), F = O + k, p = F - O, wt[2] = O - (F - p) + (k - p), wt[3] = F, N = at(4, pt, 4, wt, Ht), R = u * m, y = B * u, _ = y - (y - u), x = u - _, y = B * m, M = y - (y - m), T = m - M, P = x * T - (R - _ * M - x * M - _ * T), $ = a * d, y = B * a, _ = y - (y - a), x = a - _, y = B * d, M = y - (y - d), T = d - M, Y = x * T - ($ - _ * M - x * M - _ * T), k = P - Y, p = P - k, jt[0] = P - (k + p) + (p - Y), O = R + k, p = O - R, D = R - (O - p) + (k - p), k = D - $, p = D - k, jt[1] = D - (k + p) + (p - $), F = O + k, p = F - O, jt[2] = O - (F - p) + (k - p), jt[3] = F, E = 4) : (Ht[0] = 0, N = 1, jt[0] = 0, E = 1), l !== 0) {
      const ht = A(N, Ht, l, st);
      h = ot(h, at(
        A(I, me, l, X),
        X,
        A(ht, st, 2 * Q, et),
        et,
        rt
      ), rt);
      const ft = A(E, jt, l, U);
      h = ot(h, bt(
        A(ft, U, 2 * Q, X),
        X,
        A(ft, U, l, nt),
        nt,
        A(ht, st, l, et),
        et,
        Bt,
        mt
      ), mt), d !== 0 && (h = ot(h, A(A(4, xt, l, U), U, d, X), X)), m !== 0 && (h = ot(h, A(A(4, kt, -l, U), U, m, X), X));
    }
    if (g !== 0) {
      const ht = A(N, Ht, g, st);
      h = ot(h, at(
        A(C, be, g, X),
        X,
        A(ht, st, 2 * tt, et),
        et,
        rt
      ), rt);
      const ft = A(E, jt, g, U);
      h = ot(h, bt(
        A(ft, U, 2 * tt, X),
        X,
        A(ft, U, g, nt),
        nt,
        A(ht, st, g, et),
        et,
        Bt,
        mt
      ), mt);
    }
  }
  return Xt[h - 1];
}
function Ln(o, t, e, n, r, s, i, c) {
  const f = o - i, h = e - i, u = r - i, a = t - c, l = n - c, d = s - c, m = h * d, g = u * l, b = f * f + a * a, w = u * a, S = f * d, v = h * h + l * l, I = f * l, C = h * a, N = u * u + d * d, j = b * (m - g) + v * (w - S) + N * (I - C), q = (Math.abs(m) + Math.abs(g)) * b + (Math.abs(w) + Math.abs(S)) * v + (Math.abs(I) + Math.abs(C)) * N, E = Dn * q;
  return j > E || -j > E ? j : Fn(o, t, e, n, r, s, i, c, q);
}
const $e = Math.pow(2, -52), ee = new Uint32Array(512);
class Se {
  static from(t, e = Yn, n = Wn) {
    const r = t.length, s = new Float64Array(r * 2);
    for (let i = 0; i < r; i++) {
      const c = t[i];
      s[2 * i] = e(c), s[2 * i + 1] = n(c);
    }
    return new Se(s);
  }
  constructor(t) {
    const e = t.length >> 1;
    if (e > 0 && typeof t[0] != "number") throw new Error("Expected coords to contain numbers.");
    this.coords = t;
    const n = Math.max(2 * e - 5, 0);
    this._triangles = new Uint32Array(n * 3), this._halfedges = new Int32Array(n * 3), this._hashSize = Math.ceil(Math.sqrt(e)), this._hullPrev = new Uint32Array(e), this._hullNext = new Uint32Array(e), this._hullTri = new Uint32Array(e), this._hullHash = new Int32Array(this._hashSize), this._ids = new Uint32Array(e), this._dists = new Float64Array(e), this.update();
  }
  update() {
    const { coords: t, _hullPrev: e, _hullNext: n, _hullTri: r, _hullHash: s } = this, i = t.length >> 1;
    let c = 1 / 0, f = 1 / 0, h = -1 / 0, u = -1 / 0;
    for (let E = 0; E < i; E++) {
      const V = t[2 * E], L = t[2 * E + 1];
      V < c && (c = V), L < f && (f = L), V > h && (h = V), L > u && (u = L), this._ids[E] = E;
    }
    const a = (c + h) / 2, l = (f + u) / 2;
    let d, m, g;
    for (let E = 0, V = 1 / 0; E < i; E++) {
      const L = _e(a, l, t[2 * E], t[2 * E + 1]);
      L < V && (d = E, V = L);
    }
    const b = t[2 * d], w = t[2 * d + 1];
    for (let E = 0, V = 1 / 0; E < i; E++) {
      if (E === d) continue;
      const L = _e(b, w, t[2 * E], t[2 * E + 1]);
      L < V && L > 0 && (m = E, V = L);
    }
    let S = t[2 * m], v = t[2 * m + 1], I = 1 / 0;
    for (let E = 0; E < i; E++) {
      if (E === d || E === m) continue;
      const V = Xn(b, w, S, v, t[2 * E], t[2 * E + 1]);
      V < I && (g = E, I = V);
    }
    let C = t[2 * g], N = t[2 * g + 1];
    if (I === 1 / 0) {
      for (let L = 0; L < i; L++)
        this._dists[L] = t[2 * L] - t[0] || t[2 * L + 1] - t[1];
      Vt(this._ids, this._dists, 0, i - 1);
      const E = new Uint32Array(i);
      let V = 0;
      for (let L = 0, z = -1 / 0; L < i; L++) {
        const W = this._ids[L], p = this._dists[W];
        p > z && (E[V++] = W, z = p);
      }
      this.hull = E.subarray(0, V), this.triangles = new Uint32Array(0), this.halfedges = new Uint32Array(0);
      return;
    }
    if (It(b, w, S, v, C, N) < 0) {
      const E = m, V = S, L = v;
      m = g, S = C, v = N, g = E, C = V, N = L;
    }
    const j = qn(b, w, S, v, C, N);
    this._cx = j.x, this._cy = j.y;
    for (let E = 0; E < i; E++)
      this._dists[E] = _e(t[2 * E], t[2 * E + 1], j.x, j.y);
    Vt(this._ids, this._dists, 0, i - 1), this._hullStart = d;
    let q = 3;
    n[d] = e[g] = m, n[m] = e[d] = g, n[g] = e[m] = d, r[d] = 0, r[m] = 1, r[g] = 2, s.fill(-1), s[this._hashKey(b, w)] = d, s[this._hashKey(S, v)] = m, s[this._hashKey(C, N)] = g, this.trianglesLen = 0, this._addTriangle(d, m, g, -1, -1, -1);
    for (let E = 0, V, L; E < this._ids.length; E++) {
      const z = this._ids[E], W = t[2 * z], p = t[2 * z + 1];
      if (E > 0 && Math.abs(W - V) <= $e && Math.abs(p - L) <= $e || (V = W, L = p, z === d || z === m || z === g)) continue;
      let y = 0;
      for (let k = 0, O = this._hashKey(W, p); k < this._hashSize && (y = s[(O + k) % this._hashSize], !(y !== -1 && y !== n[y])); k++)
        ;
      y = e[y];
      let _ = y, x;
      for (; x = n[_], It(W, p, t[2 * _], t[2 * _ + 1], t[2 * x], t[2 * x + 1]) >= 0; )
        if (_ = x, _ === y) {
          _ = -1;
          break;
        }
      if (_ === -1) continue;
      let M = this._addTriangle(_, z, n[_], -1, -1, r[_]);
      r[z] = this._legalize(M + 2), r[_] = M, q++;
      let T = n[_];
      for (; x = n[T], It(W, p, t[2 * T], t[2 * T + 1], t[2 * x], t[2 * x + 1]) < 0; )
        M = this._addTriangle(T, z, x, r[z], -1, r[T]), r[z] = this._legalize(M + 2), n[T] = T, q--, T = x;
      if (_ === y)
        for (; x = e[_], It(W, p, t[2 * x], t[2 * x + 1], t[2 * _], t[2 * _ + 1]) < 0; )
          M = this._addTriangle(x, z, _, -1, r[_], r[x]), this._legalize(M + 2), r[x] = M, n[_] = _, q--, _ = x;
      this._hullStart = e[z] = _, n[_] = e[T] = z, n[z] = T, s[this._hashKey(W, p)] = z, s[this._hashKey(t[2 * _], t[2 * _ + 1])] = _;
    }
    this.hull = new Uint32Array(q);
    for (let E = 0, V = this._hullStart; E < q; E++)
      this.hull[E] = V, V = n[V];
    this.triangles = this._triangles.subarray(0, this.trianglesLen), this.halfedges = this._halfedges.subarray(0, this.trianglesLen);
  }
  _hashKey(t, e) {
    return Math.floor(zn(t - this._cx, e - this._cy) * this._hashSize) % this._hashSize;
  }
  _legalize(t) {
    const { _triangles: e, _halfedges: n, coords: r } = this;
    let s = 0, i = 0;
    for (; ; ) {
      const c = n[t], f = t - t % 3;
      if (i = f + (t + 2) % 3, c === -1) {
        if (s === 0) break;
        t = ee[--s];
        continue;
      }
      const h = c - c % 3, u = f + (t + 1) % 3, a = h + (c + 2) % 3, l = e[i], d = e[t], m = e[u], g = e[a];
      if (Vn(
        r[2 * l],
        r[2 * l + 1],
        r[2 * d],
        r[2 * d + 1],
        r[2 * m],
        r[2 * m + 1],
        r[2 * g],
        r[2 * g + 1]
      )) {
        e[t] = g, e[c] = l;
        const w = n[a];
        if (w === -1) {
          let v = this._hullStart;
          do {
            if (this._hullTri[v] === a) {
              this._hullTri[v] = t;
              break;
            }
            v = this._hullPrev[v];
          } while (v !== this._hullStart);
        }
        this._link(t, w), this._link(c, n[i]), this._link(i, a);
        const S = h + (c + 1) % 3;
        s < ee.length && (ee[s++] = S);
      } else {
        if (s === 0) break;
        t = ee[--s];
      }
    }
    return i;
  }
  _link(t, e) {
    this._halfedges[t] = e, e !== -1 && (this._halfedges[e] = t);
  }
  // add a new triangle given vertex indices and adjacent half-edge ids
  _addTriangle(t, e, n, r, s, i) {
    const c = this.trianglesLen;
    return this._triangles[c] = t, this._triangles[c + 1] = e, this._triangles[c + 2] = n, this._link(c, r), this._link(c + 1, s), this._link(c + 2, i), this.trianglesLen += 3, c;
  }
}
function zn(o, t) {
  const e = o / (Math.abs(o) + Math.abs(t));
  return (t > 0 ? 3 - e : 1 + e) / 4;
}
function _e(o, t, e, n) {
  const r = o - e, s = t - n;
  return r * r + s * s;
}
function Vn(o, t, e, n, r, s, i, c) {
  const f = o - i, h = t - c, u = e - i, a = n - c, l = r - i, d = s - c, m = f * f + h * h, g = u * u + a * a, b = l * l + d * d;
  return f * (a * b - g * d) - h * (u * b - g * l) + m * (u * d - a * l) < 0;
}
function Xn(o, t, e, n, r, s) {
  const i = e - o, c = n - t, f = r - o, h = s - t, u = i * i + c * c, a = f * f + h * h, l = 0.5 / (i * h - c * f), d = (h * u - c * a) * l, m = (i * a - f * u) * l;
  return d * d + m * m;
}
function qn(o, t, e, n, r, s) {
  const i = e - o, c = n - t, f = r - o, h = s - t, u = i * i + c * c, a = f * f + h * h, l = 0.5 / (i * h - c * f), d = o + (h * u - c * a) * l, m = t + (i * a - f * u) * l;
  return { x: d, y: m };
}
function Vt(o, t, e, n) {
  if (n - e <= 20)
    for (let r = e + 1; r <= n; r++) {
      const s = o[r], i = t[s];
      let c = r - 1;
      for (; c >= e && t[o[c]] > i; ) o[c + 1] = o[c--];
      o[c + 1] = s;
    }
  else {
    const r = e + n >> 1;
    let s = e + 1, i = n;
    Wt(o, r, s), t[o[e]] > t[o[n]] && Wt(o, e, n), t[o[s]] > t[o[n]] && Wt(o, s, n), t[o[e]] > t[o[s]] && Wt(o, e, s);
    const c = o[s], f = t[c];
    for (; ; ) {
      do
        s++;
      while (t[o[s]] < f);
      do
        i--;
      while (t[o[i]] > f);
      if (i < s) break;
      Wt(o, s, i);
    }
    o[e + 1] = o[i], o[i] = c, n - s + 1 >= i - e ? (Vt(o, t, s, n), Vt(o, t, e, i - 1)) : (Vt(o, t, e, i - 1), Vt(o, t, s, n));
  }
}
function Wt(o, t, e) {
  const n = o[t];
  o[t] = o[e], o[e] = n;
}
function Yn(o) {
  return o[0];
}
function Wn(o) {
  return o[1];
}
class Jn {
  bs;
  width;
  constructor(t, e) {
    this.width = t, this.bs = e;
  }
  /**
   * Add a number to the set.
   *
   * @param idx The number to add. Must be 0 <= idx < len.
   */
  add(t) {
    const e = Math.floor(t / this.width), n = t % this.width;
    return this.bs[e] |= 1 << n, this;
  }
  /**
   * Delete a number from the set.
   *
   * @param idx The number to delete. Must be 0 <= idx < len.
   */
  delete(t) {
    const e = Math.floor(t / this.width), n = t % this.width;
    return this.bs[e] &= ~(1 << n), this;
  }
  /**
   * Add or delete a number in the set, depending on the second argument.
   *
   * @param idx The number to add or delete. Must be 0 <= idx < len.
   * @param val If true, add the number, otherwise delete.
   */
  set(t, e) {
    const n = Math.floor(t / this.width), s = 1 << t % this.width;
    return this.bs[n] ^= (-Number(e) ^ this.bs[n]) & s, e;
  }
  /**
   * Whether the number is in the set.
   *
   * @param idx The number to test. Must be 0 <= idx < len.
   */
  has(t) {
    const e = Math.floor(t / this.width), n = t % this.width;
    return (this.bs[e] & 1 << n) !== 0;
  }
  /**
   * Iterate over the numbers that are in the set.
   */
  forEach(t) {
    const e = this.bs.length;
    for (let n = 0; n < e; n++) {
      let r = 0;
      for (; this.bs[n] && r < this.width; )
        this.bs[n] & 1 << r && t(n * this.width + r), r++;
    }
    return this;
  }
}
class Fe extends Jn {
  constructor(t) {
    super(8, new Uint8Array(Math.ceil(t / 8)).fill(0));
  }
}
function $t(o) {
  return o % 3 === 2 ? o - 2 : o + 1;
}
function vt(o) {
  return o % 3 === 0 ? o + 2 : o - 1;
}
function Le(o, t, e, n, r, s, i, c) {
  const f = It(o, t, r, s, i, c), h = It(e, n, r, s, i, c);
  if (f > 0 && h > 0 || f < 0 && h < 0)
    return !1;
  const u = It(r, s, o, t, e, n), a = It(i, c, o, t, e, n);
  return u > 0 && a > 0 || u < 0 && a < 0 ? !1 : f === 0 && h === 0 && u === 0 && a === 0 ? !(Math.max(r, i) < Math.min(o, e) || Math.max(o, e) < Math.min(r, i) || Math.max(s, c) < Math.min(t, n) || Math.max(t, n) < Math.min(s, c)) : !0;
}
class Kn {
  /**
   * The triangulation object from Delaunator.
   */
  del;
  constructor(t) {
    this.del = t;
  }
}
class Qn extends Kn {
  vertMap;
  flips;
  consd;
  /**
   * Create a Constrain instance.
   *
   * @param del The triangulation output from Delaunator.
   * @param edges If provided, constrain these edges via constrainAll.
   */
  constructor(t, e) {
    if (!t || typeof t != "object" || !t.triangles || !t.halfedges || !t.coords)
      throw new Error("Expected an object with Delaunator output");
    if (t.triangles.length % 3 || t.halfedges.length !== t.triangles.length || t.coords.length % 2)
      throw new Error("Delaunator output appears inconsistent");
    if (t.triangles.length < 3)
      throw new Error("No edges in triangulation");
    super(t);
    const n = 2 ** 32 - 1, r = t.coords.length >> 1, s = t.triangles.length;
    this.vertMap = new Uint32Array(r).fill(n), this.flips = new Fe(s), this.consd = new Fe(s);
    for (let i = 0; i < s; i++) {
      const c = t.triangles[i];
      this.vertMap[c] === n && this.updateVert(i);
    }
    e && this.constrainAll(e);
  }
  /**
   * Constrain the triangulation such that there is an edge between p1 and p2.
   */
  constrainOne(t, e) {
    const { triangles: n, halfedges: r } = this.del, s = this.vertMap[t];
    let i = s;
    do {
      const h = n[i], u = $t(i);
      if (h === e)
        return this.protect(i);
      const a = vt(i), l = n[a];
      if (l === e)
        return this.protect(u), u;
      if (this.intersectSegments(t, e, l, h)) {
        i = a;
        break;
      }
      i = r[u];
    } while (i !== -1 && i !== s);
    let c = i, f = -1;
    for (; i !== -1; ) {
      const h = r[i], u = vt(i), a = vt(h), l = $t(h);
      if (h === -1)
        throw new Error("Constraining edge exited the hull");
      if (this.consd.has(i))
        throw new Error("Edge intersects already constrained edge");
      if (this.isCollinear(t, e, n[i]) || this.isCollinear(t, e, n[h]))
        throw new Error("Constraining edge intersects point");
      if (!this.intersectSegments(
        n[i],
        n[h],
        n[u],
        n[a]
      )) {
        if (f === -1 && (f = i), n[a] === e) {
          if (i === f)
            throw new Error("Infinite loop: non-convex quadrilateral");
          i = f, f = -1;
          continue;
        }
        if (this.intersectSegments(
          t,
          e,
          n[a],
          n[h]
        ))
          i = a;
        else if (this.intersectSegments(
          t,
          e,
          n[l],
          n[a]
        ))
          i = l;
        else if (f === i)
          throw new Error("Infinite loop: no further intersect after non-convex");
        continue;
      }
      if (this.flipDiagonal(i), this.intersectSegments(
        t,
        e,
        n[u],
        n[a]
      ) && (f === -1 && (f = u), f === u))
        throw new Error("Infinite loop: flipped diagonal still intersects");
      n[a] === e ? (c = a, i = f, f = -1) : this.intersectSegments(
        t,
        e,
        n[l],
        n[a]
      ) && (i = l);
    }
    return this.protect(c), this.delaunify(!0), this.findEdge(t, e);
  }
  /**
   * Fix the Delaunay condition.
   */
  delaunify(t = !1) {
    const { halfedges: e } = this.del, n = this.flips, r = this.consd, s = e.length;
    let i;
    do {
      i = 0;
      for (let c = 0; c < s; c++) {
        if (r.has(c))
          continue;
        n.delete(c);
        const f = e[c];
        f !== -1 && (n.delete(f), this.isDelaunay(c) || (this.flipDiagonal(c), i++));
      }
    } while (t && i > 0);
    return this;
  }
  /**
   * Call constrainOne on each edge.
   */
  constrainAll(t) {
    const e = t.length;
    for (let n = 0; n < e; n++) {
      const r = t[n];
      this.constrainOne(r[0], r[1]);
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
  findEdge(t, e) {
    const n = this.vertMap[e], { triangles: r, halfedges: s } = this.del;
    let i = n, c = -1;
    do {
      if (r[i] === t)
        return i;
      c = $t(i), i = s[c];
    } while (i !== -1 && i !== n);
    return r[$t(c)] === t ? -c : 1 / 0;
  }
  /**
   * Mark an edge as constrained, i.e. should not be touched by `delaunify`.
   */
  protect(t) {
    const e = this.del.halfedges[t], n = this.flips, r = this.consd;
    return n.delete(t), r.add(t), e !== -1 ? (n.delete(e), r.add(e), e) : -t;
  }
  /**
   * Mark an edge as flipped unless constrained.
   */
  markFlip(t) {
    const e = this.del.halfedges, n = this.flips;
    if (this.consd.has(t))
      return !1;
    const s = e[t];
    return s !== -1 && (n.add(t), n.add(s)), !0;
  }
  /**
   * Flip the edge shared by two triangles.
   */
  flipDiagonal(t) {
    const { triangles: e, halfedges: n } = this.del, r = this.flips, s = this.consd, i = n[t], c = vt(t), f = $t(t), h = vt(i), u = $t(i), a = n[c], l = n[h];
    if (s.has(t))
      throw new Error("Trying to flip a constrained edge");
    return e[t] = e[h], n[t] = l, r.set(t, r.has(h)) || s.set(t, s.has(h)), l !== -1 && (n[l] = t), n[c] = h, e[i] = e[c], n[i] = a, r.set(i, r.has(c)) || s.set(i, s.has(c)), a !== -1 && (n[a] = i), n[h] = c, this.markFlip(t), this.markFlip(f), this.markFlip(i), this.markFlip(u), r.add(c), s.delete(c), r.add(h), s.delete(h), this.updateVert(t), this.updateVert(f), this.updateVert(i), this.updateVert(u), c;
  }
  /**
   * Whether point p1, p2, and p are collinear.
   */
  isCollinear(t, e, n) {
    const r = this.del.coords;
    return It(
      r[t * 2],
      r[t * 2 + 1],
      r[e * 2],
      r[e * 2 + 1],
      r[n * 2],
      r[n * 2 + 1]
    ) === 0;
  }
  /**
   * Whether the triangle formed by p1, p2, p3 keeps px outside the circumcircle.
   */
  inCircle(t, e, n, r) {
    const s = this.del.coords;
    return Ln(
      s[t * 2],
      s[t * 2 + 1],
      s[e * 2],
      s[e * 2 + 1],
      s[n * 2],
      s[n * 2 + 1],
      s[r * 2],
      s[r * 2 + 1]
    ) < 0;
  }
  /**
   * Whether the triangles sharing edg conform to the Delaunay condition.
   */
  isDelaunay(t) {
    const { triangles: e, halfedges: n } = this.del, r = n[t];
    if (r === -1)
      return !0;
    const s = e[vt(t)], i = e[t], c = e[$t(t)], f = e[vt(r)];
    return !this.inCircle(s, i, c, f);
  }
  /**
   * Update the vertex -> incoming edge map.
   */
  updateVert(t) {
    const { triangles: e, halfedges: n } = this.del, r = this.vertMap, s = e[t];
    let i = vt(t), c = n[i];
    for (; c !== -1 && c !== t; )
      i = vt(c), c = n[i];
    return r[s] = i, i;
  }
  /**
   * Whether the segments between vertices intersect.
   */
  intersectSegments(t, e, n, r) {
    const s = this.del.coords;
    return t === n || t === r || e === n || e === r ? !1 : Le(
      s[t * 2],
      s[t * 2 + 1],
      s[e * 2],
      s[e * 2 + 1],
      s[n * 2],
      s[n * 2 + 1],
      s[r * 2],
      s[r * 2 + 1]
    );
  }
  static intersectSegments = Le;
}
function ne(o, t, e) {
  if (t || (t = []), typeof o != "object" || o.type !== "FeatureCollection")
    throw "Argument points must be FeatureCollection";
  if (!Array.isArray(t)) throw "Argument points must be Array of Array";
  const n = o.features.map(
    (f) => f.geometry.coordinates
  ), r = Se.from(n);
  let s;
  const i = [];
  r.triangles.length !== 0 && t.length !== 0 && (s = new Qn(r), s.constrainAll(t));
  for (let f = 0; f < r.triangles.length; f += 3)
    i.push([r.triangles[f], r.triangles[f + 1], r.triangles[f + 2]]);
  const c = ["a", "b", "c"];
  return Ot(
    i.map((f) => {
      const h = {}, u = f.map((a, l) => {
        const d = o.features[a], m = d.geometry.coordinates, g = [m[0], m[1]];
        return m.length === 3 ? g[2] = m[2] : h[c[l]] = d.properties[e], g;
      });
      return u[3] = u[0], le([u], h);
    })
  );
}
function rn(o, t, e, n, r, s) {
  return Object.keys(o).reduce((i, c) => {
    const f = o[c], h = f.forw, u = f.bakw, a = {
      forw: [h[0] - t.forw[0], h[1] - t.forw[1]],
      bakw: [u[0] - t.bakw[0], u[1] - t.bakw[1]]
    }, l = a.forw[0] === 0 ? 1 / 0 : ((a.forw[0] < 0 ? e : n) - t.forw[0]) / a.forw[0], d = a.forw[1] === 0 ? 1 / 0 : ((a.forw[1] < 0 ? r : s) - t.forw[1]) / a.forw[1];
    if (Math.abs(l) / Math.abs(d) < 1.1) {
      const m = {
        forw: [
          a.forw[0] * l + t.forw[0],
          a.forw[1] * l + t.forw[1]
        ],
        bakw: [
          a.bakw[0] * l + t.bakw[0],
          a.bakw[1] * l + t.bakw[1]
        ]
      };
      a.forw[0] < 0 ? i[3].push(m) : i[1].push(m);
    }
    if (Math.abs(d) / Math.abs(l) < 1.1) {
      const m = {
        forw: [
          a.forw[0] * d + t.forw[0],
          a.forw[1] * d + t.forw[1]
        ],
        bakw: [
          a.bakw[0] * d + t.bakw[0],
          a.bakw[1] * d + t.bakw[1]
        ]
      };
      a.forw[1] < 0 ? i[0].push(m) : i[2].push(m);
    }
    return i;
  }, [[], [], [], []]);
}
function Gn(o, t) {
  const e = [[], [], [], []], n = [];
  return Object.keys(o).forEach((r) => {
    const s = o[r], i = s.forw, c = s.bakw, f = [
      i[0] - t.forw[0],
      i[1] - t.forw[1]
    ], h = [
      c[0] - t.bakw[0],
      t.bakw[1] - c[1]
    ], u = { forw: f, bakw: h };
    if (n.push(u), f[0] === 0 || f[1] === 0)
      return;
    let a = 0;
    f[0] > 0 && (a += 1), f[1] > 0 && (a += 2), e[a].push(u);
  }), { perQuad: e, aggregate: n };
}
function Hn(o) {
  let t = 1 / 0, e = 0, n = 0;
  return o.forEach((r) => {
    const { forw: s, bakw: i } = r, c = Math.hypot(s[0], s[1]), f = Math.hypot(i[0], i[1]);
    if (f === 0) return;
    const h = c / f, u = Math.atan2(s[0], s[1]) - Math.atan2(i[0], i[1]);
    t = Math.min(t, h), e += Math.cos(u), n += Math.sin(u);
  }), isFinite(t) ? [t, Math.atan2(n, e)] : [1, 0];
}
function on(o, t, e) {
  const { perQuad: n, aggregate: r } = Gn(o, t), s = n.every((f) => f.length > 0);
  let i;
  e === "birdeye" && s ? i = n : e === "birdeye" ? i = [r] : s ? i = n : i = [r];
  const c = i.map((f) => Hn(f));
  return c.length === 1 ? [c[0], c[0], c[0], c[0]] : c;
}
function Zn(o, t, e) {
  const n = [1, 1, 1, 1];
  for (let r = 0; r < 4; r++) {
    const s = (r + 1) % 4, i = Ee([o[r].bakw, o[s].bakw]);
    t[r].map((c) => {
      const f = Ee([e.bakw, c.bakw]), h = gn(i, f);
      if (h.features.length > 0 && h.features[0].geometry) {
        const u = h.features[0], a = Math.sqrt(
          Math.pow(c.bakw[0] - e.bakw[0], 2) + Math.pow(c.bakw[1] - e.bakw[1], 2)
        ), l = Math.sqrt(
          Math.pow(
            u.geometry.coordinates[0] - e.bakw[0],
            2
          ) + Math.pow(
            u.geometry.coordinates[1] - e.bakw[1],
            2
          )
        ), d = a / l;
        d > n[r] && (n[r] = d), d > n[s] && (n[s] = d);
      }
    });
  }
  o.forEach((r, s) => {
    const i = n[s], c = [
      (r.bakw[0] - e.bakw[0]) * i + e.bakw[0],
      (r.bakw[1] - e.bakw[1]) * i + e.bakw[1]
    ];
    r.bakw = c;
  });
}
function cn(o, t, e, n) {
  const r = o.map((i, c) => {
    const f = t[c], h = [
      f[0] - e.forw[0],
      f[1] - e.forw[1]
    ], a = Math.sqrt(
      Math.pow(h[0], 2) + Math.pow(h[1], 2)
    ) / i[0], l = Math.atan2(h[0], h[1]) - i[1], d = [
      e.bakw[0] + a * Math.sin(l),
      e.bakw[1] - a * Math.cos(l)
    ];
    return { forw: f, bakw: d };
  }), s = r[2];
  return r[2] = r[3], r[3] = s, Zn(r, n, e), r;
}
function ts(o) {
  const { convexBuf: t, centroid: e, bbox: n, minx: r, maxx: s, miny: i, maxy: c } = o, f = rn(t, e, r, s, i, c), h = on(t, e, "plain");
  return cn(h, n, e, f);
}
function es(o) {
  const { convexBuf: t, centroid: e, bbox: n, minx: r, maxx: s, miny: i, maxy: c } = o, f = rn(t, e, r, s, i, c), h = on(t, e, "birdeye");
  return cn(h, n, e, f);
}
function ns(o) {
  const e = new ss(o).findSegmentIntersections();
  return fn(e).reduce(
    (n, r, s, i) => Array.isArray(n) || (n || (n = {}), n[`${r.x}:${r.y}`] = r, s != i.length - 1) ? n : Object.keys(n).map((c) => Kt([n[c].x, n[c].y])),
    {}
  );
}
class ss {
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
    const e = [], n = [], r = t.map((s) => {
      const i = s ? s.length : 0;
      for (let c = 0; c < i; c++)
        e.push(s[c][0]), n.push(s[c][1]);
      return i;
    });
    this.initXYData(r, e, n);
  }
  initXYData(t, e, n) {
    const r = t.length;
    this._xx = new Float64Array(e), this._yy = new Float64Array(n), this._nn = new Uint32Array(t), this._zz = null, this._zlimit = 0, this._filteredArcIter = null, this._ii = new Uint32Array(r);
    let s = 0;
    for (let i = 0; i < r; i++)
      this._ii[i] = s, s += t[i];
    (s != this._xx.length || this._xx.length != this._yy.length) && Me("ArcCollection#initXYData() Counting error"), this.initBounds(), this._arcIter = new Ss(this._xx, this._yy);
  }
  initBounds() {
    const t = this.calcArcBounds_(this._xx, this._yy, this._nn);
    this._bb = t.bb, this._allBounds = t.bounds;
  }
  /**
   * データの境界を計算
   * @returns バウンディングボックス情報
   */
  calcArcBounds_(t, e, n) {
    const r = n.length, s = new Float64Array(r * 4), i = new he();
    let c = 0, f, h, u;
    for (let a = 0; a < r; a++)
      f = n[a], f > 0 && (h = a * 4, u = Ms(t, e, c, f), s[h++] = u[0], s[h++] = u[1], s[h++] = u[2], s[h] = u[3], c += f, i.mergeBounds(u));
    return {
      bb: s,
      bounds: i
    };
  }
  getBounds() {
    return this._allBounds.clone();
  }
  // @cb function(i, j, xx, yy)
  forEachSegment(t) {
    let e = 0;
    for (let n = 0, r = this.size(); n < r; n++)
      e += this.forEachArcSegment(n, t);
    return e;
  }
  size() {
    return this._ii && this._ii.length || 0;
  }
  // @cb function(i, j, xx, yy)
  forEachArcSegment(t, e) {
    const n = t >= 0, r = n ? t : ~t, s = this.getRetainedInterval(), i = this._nn[r], c = n ? 1 : -1;
    let f = n ? this._ii[r] : this._ii[r] + i - 1, h = f, u = 0;
    for (let a = 1; a < i; a++)
      h += c, (s === 0 || this._zz[h] >= s) && (e(f, h, this._xx, this._yy), f = h, u++);
    return u;
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
    const e = t * 4;
    return (!this.buf || this.buf.byteLength < e) && (this.buf = new ArrayBuffer(e)), new Uint32Array(this.buf, 0, t);
  }
  // Return average magnitudes of dx, dy (with simplification)
  getAvgSegment2() {
    let t = 0, e = 0;
    const n = this.forEachSegment(
      (r, s, i, c) => {
        t += Math.abs(i[r] - i[s]), e += Math.abs(c[r] - c[s]);
      }
    );
    return [t / n || 0, e / n || 0];
  }
  /**
   * 交差判定のためのストライプ数を計算
   * 線分の平均長さに基づいて最適な分割数を決定
   */
  calcSegmentIntersectionStripeCount() {
    const t = this.getBounds().height(), e = this.getAvgSegment2()[1];
    let n = 1;
    return e > 0 && t > 0 && (n = Math.ceil(t / e / 20)), n || 1;
  }
  /**
   * 線分の交差を検出
   * ストライプ分割による効率的な判定を実装
   *
   * @returns 検出された交差点の配列
   */
  findSegmentIntersections() {
    const t = this.getBounds(), e = t.ymin, n = t.ymax - e, r = this.calcSegmentIntersectionStripeCount(), s = new Uint32Array(r), i = r > 1 ? (g) => Math.floor((r - 1) * (g - e) / n) : () => 0;
    let c, f;
    this.forEachSegment(
      (g, b, w, S) => {
        let v = i(S[g]);
        const I = i(S[b]);
        for (; s[v] = s[v] + 2, v != I; )
          v += I > v ? 1 : -1;
      }
    );
    const h = this.getUint32Array(os(s));
    let u = 0;
    const a = [];
    cs(s, (g) => {
      const b = u;
      u += g, a.push(h.subarray(b, u));
    }), as(s, 0), this.forEachSegment(
      (g, b, w, S) => {
        let v = i(S[g]);
        const I = i(S[b]);
        let C, N;
        for (; C = s[v], s[v] = C + 2, N = a[v], N[C] = g, N[C + 1] = b, v != I; )
          v += I > v ? 1 : -1;
      }
    );
    const l = this.getVertexData(), d = [];
    let m;
    for (c = 0; c < r; c++)
      for (m = hs(a[c], l.xx, l.yy), f = 0; f < m.length; f++)
        d.push(m[f]);
    return fn(d);
  }
}
function Me(...o) {
  const t = o.join(" ");
  throw new Error(t);
}
function Ae(o) {
  return o ? rs(o) ? !0 : is(o) ? !1 : o.length === 0 ? !0 : o.length > 0 : !1;
}
function is(o) {
  return o != null && o.toString === String.prototype.toString;
}
function rs(o) {
  return Array.isArray(o);
}
function os(o, t) {
  Ae(o) || Me("utils.sum() expects an array, received:", o);
  let e = 0, n;
  for (let r = 0, s = o.length; r < s; r++)
    n = o[r], n && (e += n);
  return e;
}
function cs(o, t, e) {
  if (!Ae(o))
    throw new Error(`#forEach() takes an array-like argument. ${o}`);
  for (let n = 0, r = o.length; n < r; n++)
    t.call(e, o[n], n);
}
function as(o, t) {
  for (let e = 0, n = o.length; e < n; e++)
    o[e] = t;
  return o;
}
function hs(o, t, e) {
  const n = o.length - 2, r = [];
  let s, i, c, f, h, u, a, l, d, m, g, b, w, S, v, I, C;
  for (ys(t, o), I = 0; I < n; ) {
    for (s = o[I], i = o[I + 1], h = t[s], u = t[i], d = e[s], m = e[i], C = I; C < n && (C += 2, c = o[C], a = t[c], !(u < a)); ) {
      if (g = e[c], f = o[C + 1], l = t[f], b = e[f], d >= g) {
        if (d > b && m > g && m > b) continue;
      } else if (d < b && m < g && m < b) continue;
      s == c || s == f || i == c || i == f || (w = fs(
        h,
        d,
        u,
        m,
        a,
        g,
        l,
        b
      ), w && (S = [s, i], v = [c, f], r.push(Ve(w, S, v, t, e)), w.length == 4 && r.push(
        Ve(w.slice(2), S, v, t, e)
      )));
    }
    I += 2;
  }
  return r;
}
function fs(o, t, e, n, r, s, i, c) {
  const f = ls(o, t, e, n, r, s, i, c);
  let h = null;
  return f && (h = us(o, t, e, n, r, s, i, c), h ? bs(o, t, e, n, r, s, i, c) && (h = null) : h = ms(o, t, e, n, r, s, i, c)), h;
}
function ls(o, t, e, n, r, s, i, c) {
  return Jt(o, t, e, n, r, s) * Jt(o, t, e, n, i, c) <= 0 && Jt(r, s, i, c, o, t) * Jt(r, s, i, c, e, n) <= 0;
}
function Jt(o, t, e, n, r, s) {
  return an(o - r, t - s, e - r, n - s);
}
function an(o, t, e, n) {
  return o * n - t * e;
}
function us(o, t, e, n, r, s, i, c) {
  let f = se(o, t, e, n, r, s, i, c), h;
  return f && (h = gs(f[0], f[1], o, t, e, n, r, s, i, c), h == 1 ? f = se(e, n, o, t, r, s, i, c) : h == 2 ? f = se(r, s, i, c, o, t, e, n) : h == 3 && (f = se(i, c, r, s, o, t, e, n))), f && ws(f, o, t, e, n, r, s, i, c), f;
}
function se(o, t, e, n, r, s, i, c) {
  const f = an(e - o, n - t, i - r, c - s), h = 1e-18;
  let u;
  if (f === 0) return null;
  const a = Jt(r, s, i, c, o, t) / f;
  return f <= h && f >= -h ? u = ds(o, t, e, n, r, s, i, c) : u = [o + a * (e - o), t + a * (n - t)], u;
}
function ds(o, t, e, n, r, s, i, c) {
  let f = null;
  return !Et(o, r, i) && !Et(t, s, c) ? f = [o, t] : !Et(e, r, i) && !Et(n, s, c) ? f = [e, n] : !Et(r, o, e) && !Et(s, t, n) ? f = [r, s] : !Et(i, o, e) && !Et(c, t, n) && (f = [i, c]), f;
}
function Et(o, t, e) {
  let n;
  return t < e ? n = o < t || o > e : t > e ? n = o > t || o < e : n = o != t, n;
}
function gs(o, t, ...e) {
  let n = -1, r = 1 / 0, s;
  for (let i = 0, c = 0, f = e.length; c < f; i++, c += 2)
    s = ps(o, t, e[c], e[c + 1]), s < r && (r = s, n = i);
  return n;
}
function ps(o, t, e, n) {
  const r = o - e, s = t - n;
  return r * r + s * s;
}
function ws(o, t, e, n, r, s, i, c, f) {
  let h = o[0], u = o[1];
  h = ie(h, t, n), h = ie(h, s, c), u = ie(u, e, r), u = ie(u, i, f), o[0] = h, o[1] = u;
}
function ie(o, t, e) {
  let n;
  return Et(o, t, e) && (n = Math.abs(o - t) < Math.abs(o - e) ? t : e, o = n), o;
}
function ms(o, t, e, n, r, s, i, c) {
  const f = Math.min(o, e, r, i), h = Math.max(o, e, r, i), u = Math.min(t, n, s, c), a = Math.max(t, n, s, c), l = a - u > h - f;
  let d = [];
  return (l ? Ut(t, u, a) : Ut(o, f, h)) && d.push(o, t), (l ? Ut(n, u, a) : Ut(e, f, h)) && d.push(e, n), (l ? Ut(s, u, a) : Ut(r, f, h)) && d.push(r, s), (l ? Ut(c, u, a) : Ut(i, f, h)) && d.push(i, c), (d.length != 2 && d.length != 4 || d.length == 4 && d[0] == d[2] && d[1] == d[3]) && (d = null), d;
}
function bs(o, t, e, n, r, s, i, c) {
  return o == r && t == s || o == i && t == c || e == r && n == s || e == i && n == c;
}
function Ut(o, t, e) {
  return o > t && o < e;
}
function ys(o, t) {
  _s(o, t), hn(o, t, 0, t.length - 2);
}
function _s(o, t) {
  for (let e = 0, n = t.length; e < n; e += 2)
    o[t[e]] > o[t[e + 1]] && ks(t, e, e + 1);
}
function ks(o, t, e) {
  const n = o[t];
  o[t] = o[e], o[e] = n;
}
function hn(o, t, e, n) {
  let r = e, s = n, i, c;
  for (; r < n; ) {
    for (i = o[t[e + n >> 2 << 1]]; r <= s; ) {
      for (; o[t[r]] < i; ) r += 2;
      for (; o[t[s]] > i; ) s -= 2;
      r <= s && (c = t[r], t[r] = t[s], t[s] = c, c = t[r + 1], t[r + 1] = t[s + 1], t[s + 1] = c, r += 2, s -= 2);
    }
    if (s - e < 40 ? ze(o, t, e, s) : hn(o, t, e, s), n - r < 40) {
      ze(o, t, r, n);
      return;
    }
    e = r, s = n;
  }
}
function ze(o, t, e, n) {
  let r, s;
  for (let i = e + 2; i <= n; i += 2) {
    r = t[i], s = t[i + 1];
    let c;
    for (c = i - 2; c >= e && o[r] < o[t[c]]; c -= 2)
      t[c + 2] = t[c], t[c + 3] = t[c + 1];
    t[c + 2] = r, t[c + 3] = s;
  }
}
function Ve(o, t, e, n, r) {
  const s = o[0], i = o[1];
  t = Xe(s, i, t[0], t[1], n, r), e = Xe(s, i, e[0], e[1], n, r);
  const c = t[0] < e[0] ? t : e, f = c == t ? e : t;
  return { x: s, y: i, a: c, b: f };
}
function Xe(o, t, e, n, r, s) {
  let i = e < n ? e : n, c = i === e ? n : e;
  return r[i] == o && s[i] == t ? c = i : r[c] == o && s[c] == t && (i = c), [i, c];
}
function fn(o) {
  const t = {};
  return o.filter((e) => {
    const n = xs(e);
    return n in t ? !1 : (t[n] = !0, !0);
  });
}
function xs(o) {
  return `${o.a.join(",")};${o.b.join(",")}`;
}
class Ss {
  _i = 0;
  _n = 0;
  _inc = 1;
  _xx;
  _yy;
  i = 0;
  x = 0;
  y = 0;
  constructor(t, e) {
    this._xx = t, this._yy = e;
  }
}
function Ms(o, t, e, n) {
  let r = e | 0;
  const s = isNaN(n) ? o.length - r : n + r;
  let i, c, f, h, u, a;
  if (s > 0)
    f = u = o[r], h = a = t[r];
  else return [void 0, void 0, void 0, void 0];
  for (r++; r < s; r++)
    i = o[r], c = t[r], i < f && (f = i), i > u && (u = i), c < h && (h = c), c > a && (a = c);
  return [f, h, u, a];
}
class he {
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
    return new he(this.xmin, this.ymin, this.xmax, this.ymax);
  }
  width() {
    return this.xmax - this.xmin || 0;
  }
  height() {
    return this.ymax - this.ymin || 0;
  }
  setBounds(t, e, n, r) {
    return arguments.length == 1 && (Ae(t) ? (e = t[1], n = t[2], r = t[3], t = t[0]) : (e = t.ymin, n = t.xmax, r = t.ymax, t = t.xmin)), this.xmin = t, this.ymin = e, this.xmax = n, this.ymax = r, (t > n || e > r) && this.update(), this;
  }
  update() {
    let t;
    this.xmin > this.xmax && (t = this.xmin, this.xmin = this.xmax, this.xmax = t), this.ymin > this.ymax && (t = this.ymin, this.ymin = this.ymax, this.ymax = t);
  }
  mergeBounds(t, ...e) {
    let n, r, s, i;
    return t instanceof he ? (n = t.xmin, r = t.ymin, s = t.xmax, i = t.ymax) : e.length == 3 ? (n = t, r = e[0], s = e[1], i = e[2]) : t.length == 4 ? (n = t[0], r = t[1], s = t[2], i = t[3]) : Me("Bounds#mergeBounds() invalid argument:", t), this.xmin === void 0 ? this.setBounds(n, r, s, i) : (n < this.xmin && (this.xmin = n), r < this.ymin && (this.ymin = r), s > this.xmax && (this.xmax = s), i > this.ymax && (this.ymax = i)), this;
  }
}
function fe(o) {
  const t = ["a", "b", "c"].map(
    (e) => o.properties[e].index
  );
  return [
    [0, 1],
    [0, 2],
    [1, 2],
    [0, 1, 2]
  ].map(
    (e) => e.map((n) => t[n]).sort().join("-")
  ).sort();
}
function ln(o, t, e) {
  const n = fe(t.forw), r = fe(t.bakw);
  if (JSON.stringify(n) != JSON.stringify(r))
    throw `${JSON.stringify(t, null, 2)}
${JSON.stringify(
      n
    )}
${JSON.stringify(r)}`;
  for (let s = 0; s < n.length; s++) {
    const i = n[s];
    o[i] || (o[i] = []), o[i].push(t);
  }
  e && (e.forw.features.push(t.forw), e.bakw.features.push(t.bakw));
}
function qe(o, t, e) {
  const n = fe(t.forw), r = fe(t.bakw);
  if (JSON.stringify(n) != JSON.stringify(r))
    throw `${JSON.stringify(t, null, 2)}
${JSON.stringify(n)}
${JSON.stringify(r)}`;
  if (n.forEach((s) => {
    const i = o[s];
    if (!i) return;
    const c = i.filter((f) => f !== t);
    c.length === 0 ? delete o[s] : o[s] = c;
  }), e) {
    const s = (i, c) => {
      !i || !c || (i.features = i.features.filter((f) => f !== c));
    };
    s(e.forw, t.forw), s(e.bakw, t.bakw);
  }
}
function re(o, t, e) {
  return Kt(o, { target: { geom: t, index: e } });
}
function oe(o) {
  return Kt(o.properties.target.geom, {
    target: {
      geom: o.geometry.coordinates,
      index: o.properties.target.index
    }
  });
}
function Ye(o, t) {
  const e = t.geometry.coordinates;
  return [0, 1, 2, 3].map((n) => {
    const r = (n + 1) % 4, s = o[n], i = o[r], c = s.geometry.coordinates, f = Math.atan2(
      c[0] - e[0],
      c[1] - e[1]
    ), h = [t, s, i, t].map(
      (l) => l.geometry.coordinates
    ), u = {
      a: {
        geom: t.properties.target.geom,
        index: t.properties.target.index
      },
      b: {
        geom: s.properties.target.geom,
        index: s.properties.target.index
      },
      c: {
        geom: i.properties.target.geom,
        index: i.properties.target.index
      }
    }, a = Ot([
      le([h], u)
    ]);
    return [f, a];
  }).reduce(
    (n, r) => (n[0].push(r[0]), n[1].push(r[1]), n),
    [[], []]
  );
}
function As(o) {
  const { tins: t, targets: e, includeReciprocals: n } = o, r = {};
  e.forEach((i) => {
    const c = t[i];
    if (!c || !c.features) return;
    r[i] = {};
    const f = {};
    c.features.forEach((h) => {
      const u = ["a", "b", "c"];
      for (let a = 0; a < 3; a++) {
        const l = (a + 1) % 3, d = u[a], m = u[l], g = h.properties[d].index, b = h.properties[m].index, w = [g, b].sort().join("-");
        if (f[w]) continue;
        f[w] = !0;
        const S = h.geometry.coordinates[0][a], v = h.geometry.coordinates[0][l], I = h.properties[d].geom, C = h.properties[m].geom, N = Math.sqrt(
          Math.pow(I[0] - C[0], 2) + Math.pow(I[1] - C[1], 2)
        ) / Math.sqrt(
          Math.pow(S[0] - v[0], 2) + Math.pow(S[1] - v[1], 2)
        ), j = r[i];
        j[`${g}:${w}`] = N, j[`${b}:${w}`] = N;
      }
    });
  });
  const s = {};
  return n && (s.bakw = {}), e.forEach((i) => {
    const c = r[i];
    if (s[i] = {}, !c)
      return;
    const f = {};
    Object.keys(c).forEach((u) => {
      const [a] = u.split(":");
      f[a] || (f[a] = []), f[a].push(c[u]);
    }), Object.keys(f).forEach((u) => {
      const a = f[u], l = a.reduce((d, m) => d + m, 0) / a.length;
      s[i][u] = l, n && s.bakw && (s.bakw[u] = 1 / l);
    });
    let h = 0;
    for (let u = 0; u < 4; u++) {
      const a = `b${u}`, l = s[i][a] || 0;
      h += l;
    }
    s[i].c = h / 4, n && s.bakw && (s.bakw.c = 1 / s[i].c);
  }), s;
}
function vs(o, t) {
  const e = o.split("-");
  if (e.length !== 2 || !e.every((s) => /^-?\d+$/.test(s))) return !1;
  const [n, r] = e.map((s) => parseInt(s, 10)).sort((s, i) => s - i);
  return t.some((s) => {
    if (s.length !== 2) return !1;
    const i = s.map((f) => parseInt(`${f}`, 10));
    if (i.some((f) => Number.isNaN(f))) return !1;
    const c = i.sort((f, h) => f - h);
    return c[0] === n && c[1] === r;
  });
}
function We(o) {
  return ["a", "b", "c"].map((t, e) => ({
    prop: o.properties[t],
    geom: o.geometry.coordinates[0][e]
  }));
}
function Es(o, t, e) {
  let n = !1, r = !0;
  for (; r; ) {
    r = !1;
    const s = Object.keys(t);
    for (const i of s) {
      const c = t[i];
      if (!c || c.length < 2 || vs(i, e)) continue;
      const f = i.split("-"), h = We(c[0].bakw), u = We(c[1].bakw), a = f.map(
        (b) => h.find((w) => `${w.prop.index}` === b) || u.find((w) => `${w.prop.index}` === b)
      );
      if (a.some((b) => !b))
        continue;
      const l = [h, u].map(
        (b) => b.find((w) => !f.includes(`${w.prop.index}`))
      );
      if (l.some((b) => !b))
        continue;
      const d = c[0].bakw.geometry.coordinates[0].slice(0, 3).map((b) => ce(b)), m = c[1].bakw.geometry.coordinates[0].slice(0, 3).map((b) => ce(b));
      if (Je(ce(l[0].geom), m) || Je(ce(l[1].geom), d)) {
        qe(t, c[0], o), qe(t, c[1], o), a.forEach((b) => {
          if (!b) return;
          const w = [
            b.geom,
            l[0].geom,
            l[1].geom,
            b.geom
          ], S = {
            a: b.prop,
            b: l[0].prop,
            c: l[1].prop
          }, v = le([w], S), I = He(v);
          ln(t, { forw: I, bakw: v }, o);
        }), n = !0, r = !0;
        break;
      }
    }
  }
  return n;
}
function ce(o) {
  return [o[0], o[1]];
}
function Je(o, t) {
  const [e, n] = t[0], [r, s] = t[1], [i, c] = t[2], f = i - e, h = c - n, u = r - e, a = s - n, l = o[0] - e, d = o[1] - n, m = f * f + h * h, g = f * u + h * a, b = f * l + h * d, w = u * u + a * a, S = u * l + a * d, v = m * w - g * g;
  if (v === 0) return !1;
  const I = 1 / v, C = (w * b - g * S) * I, N = (m * S - g * b) * I, j = 1e-9;
  return C >= -j && N >= -j && C + N <= 1 + j;
}
const Ke = xe;
class ct extends Rn {
  importance;
  priority;
  pointsSet;
  /**
   * Tinクラスのインスタンスを生成します
   * @param options - 初期化オプション
   */
  constructor(t = {}) {
    super(), t.bounds ? this.setBounds(t.bounds) : (this.setWh(t.wh), this.vertexMode = t.vertexMode || ct.VERTEX_PLAIN), this.strictMode = t.strictMode || ct.MODE_AUTO, this.yaxisMode = t.yaxisMode || ct.YAXIS_INVERT, this.importance = t.importance || 0, this.priority = t.priority || 0, this.stateFull = t.stateFull || !1, t.points && this.setPoints(t.points), t.edges && this.setEdges(t.edges);
  }
  /**
   * フォーマットバージョンを取得します
   */
  getFormatVersion() {
    return Ke;
  }
  /**
   * 制御点（GCP: Ground Control Points）を設定します。
   * 指定した点群に合わせて内部のTINキャッシュをリセットします。
   */
  setPoints(t) {
    this.yaxisMode === ct.YAXIS_FOLLOW && (t = t.map((e) => [
      e[0],
      [e[1][0], -1 * e[1][1]]
    ])), this.points = t, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * エッジ（制約線）を設定します。
   * 制約線を正規化した上で、依存するキャッシュをリセットします。
   */
  setEdges(t = []) {
    this.edges = tn(t), this.edgeNodes = void 0, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 境界ポリゴンを設定します
   */
  setBounds(t) {
    this.bounds = t;
    let e = t[0][0], n = e, r = t[0][1], s = r;
    const i = [t[0]];
    for (let c = 1; c < t.length; c++) {
      const f = t[c];
      f[0] < e && (e = f[0]), f[0] > n && (n = f[0]), f[1] < r && (r = f[1]), f[1] > s && (s = f[1]), i.push(f);
    }
    i.push(t[0]), this.boundsPolygon = le([i]), this.xy = [e, r], this.wh = [n - e, s - r], this.vertexMode = ct.VERTEX_PLAIN, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 現在の設定を永続化可能な形式にコンパイルします
   */
  getCompiled() {
    const t = {};
    t.version = Ke, t.points = this.points, t.weight_buffer = this.pointsWeightBuffer, t.centroid_point = [
      this.centroid.forw.geometry.coordinates,
      this.centroid.forw.properties.target.geom
    ], t.vertices_params = [
      this.vertices_params.forw[0],
      this.vertices_params.bakw[0]
    ], t.vertices_points = [];
    const e = this.vertices_params.forw[1];
    return e && [0, 1, 2, 3].map((n) => {
      const r = e[n].features[0], s = r.geometry.coordinates[0][1], i = r.properties.b.geom;
      t.vertices_points[n] = [s, i];
    }), t.strict_status = this.strict_status, t.tins_points = [[]], this.tins.forw.features.map((n) => {
      t.tins_points[0].push(
        ["a", "b", "c"].map(
          (r) => n.properties[r].index
        )
      );
    }), this.strict_status === ct.STATUS_LOOSE ? (t.tins_points[1] = [], this.tins.bakw.features.map((n) => {
      t.tins_points[1].push(
        ["a", "b", "c"].map(
          (r) => n.properties[r].index
        )
      );
    })) : this.strict_status === ct.STATUS_ERROR && this.kinks?.bakw && (t.kinks_points = this.kinks.bakw.features.map(
      (n) => n.geometry.coordinates
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
      (r) => He(r)
    );
    this.tins.bakw = Ot(t);
    const e = {};
    this.tins.forw.features.forEach((r, s) => {
      const i = this.tins.bakw.features[s];
      ln(e, { forw: r, bakw: i });
    }), Es(
      this.tins,
      e,
      this.pointsSet?.edges || []
    );
    const n = ["forw", "bakw"].map((r) => {
      const s = this.tins[r].features.map(
        (i) => i.geometry.coordinates[0]
      );
      return ns(s);
    });
    n[0].length === 0 && n[1].length === 0 ? (this.strict_status = ct.STATUS_STRICT, delete this.kinks) : (this.strict_status = ct.STATUS_ERROR, this.kinks = {}, n[0].length > 0 && (this.kinks.forw = Ot(n[0])), n[1].length > 0 && (this.kinks.bakw = Ot(n[1])));
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
    for (let r = 0; r < this.points.length; r++) {
      const s = this.points[r][0], i = this.points[r][1], c = re(s, i, r);
      t.forw.push(c), t.bakw.push(oe(c));
    }
    const e = [];
    let n = 0;
    this.edgeNodes = [], this.edges || (this.edges = []);
    for (let r = 0; r < this.edges.length; r++) {
      const s = this.edges[r][2], i = Object.assign([], this.edges[r][0]), c = Object.assign([], this.edges[r][1]);
      if (i.length === 0 && c.length === 0) {
        e.push(s);
        continue;
      }
      i.unshift(this.points[s[0]][0]), i.push(this.points[s[1]][0]), c.unshift(this.points[s[0]][1]), c.push(this.points[s[1]][1]);
      const f = [i, c].map((h) => {
        const u = h.map((l, d, m) => {
          if (d === 0) return 0;
          const g = m[d - 1];
          return Math.sqrt(
            Math.pow(l[0] - g[0], 2) + Math.pow(l[1] - g[1], 2)
          );
        }), a = u.reduce((l, d, m) => m === 0 ? [0] : (l.push(l[m - 1] + d), l), []);
        return a.map((l, d, m) => {
          const g = l / m[m.length - 1];
          return [h[d], u[d], a[d], g];
        });
      });
      f.map((h, u) => {
        const a = f[u ? 0 : 1];
        return h.filter((l, d) => !(d === 0 || d === h.length - 1 || l[4] === "handled")).map((l) => {
          const d = l[0], m = l[3], g = a.reduce(
            (b, w, S, v) => {
              if (b) return b;
              const I = v[S + 1];
              if (w[3] === m)
                return w[4] = "handled", [w];
              if (w[3] < m && I && I[3] > m)
                return [w, I];
            },
            void 0
          );
          if (g && g.length === 1)
            return u === 0 ? [d, g[0][0], m] : [g[0][0], d, m];
          if (g && g.length === 2) {
            const b = g[0], w = g[1], S = (m - b[3]) / (w[3] - b[3]), v = [
              (w[0][0] - b[0][0]) * S + b[0][0],
              (w[0][1] - b[0][1]) * S + b[0][1]
            ];
            return u === 0 ? [d, v, m] : [v, d, m];
          }
          return [];
        });
      }).reduce((h, u) => h.concat(u), []).sort((h, u) => h[2] < u[2] ? -1 : 1).map((h, u, a) => {
        this.edgeNodes[n] = [
          h[0],
          h[1]
        ];
        const l = re(
          h[0],
          h[1],
          `e${n}`
        );
        n++, t.forw.push(l), t.bakw.push(oe(l)), u === 0 ? e.push([s[0], t.forw.length - 1]) : e.push([
          t.forw.length - 2,
          t.forw.length - 1
        ]), u === a.length - 1 && e.push([t.forw.length - 1, s[1]]);
      });
    }
    return {
      forw: t.forw,
      bakw: t.bakw,
      edges: e
    };
  }
  /**
   * 入力データの検証と初期データの準備
   */
  validateAndPrepareInputs() {
    const t = this.xy[0] - 0.05 * this.wh[0], e = this.xy[0] + 1.05 * this.wh[0], n = this.xy[1] - 0.05 * this.wh[1], r = this.xy[1] + 1.05 * this.wh[1];
    if (!this.points.reduce((c, f) => c && (this.bounds ? un(f[0], this.boundsPolygon) : f[0][0] >= t && f[0][0] <= e && f[0][1] >= n && f[0][1] <= r), !0))
      throw "SOME POINTS OUTSIDE";
    let i = [];
    return this.wh && (i = [[t, n], [e, n], [t, r], [e, r]]), {
      pointsSet: this.generatePointsSet(),
      bbox: i,
      minx: t,
      maxx: e,
      miny: n,
      maxy: r
    };
  }
  /**
   * TINネットワークを同期的に更新し、座標変換の準備を行います。
   * 重めの計算を伴うため、呼び出し側が非同期制御を行いたい場合は
   * {@link updateTinAsync} を利用してください。
   */
  updateTin() {
    let t = this.strictMode;
    t !== ct.MODE_STRICT && t !== ct.MODE_LOOSE && (t = ct.MODE_AUTO);
    const { pointsSet: e, bbox: n, minx: r, maxx: s, miny: i, maxy: c } = this.validateAndPrepareInputs(), f = {
      forw: Ot(e.forw),
      bakw: Ot(e.bakw)
    }, h = ne(
      f.forw,
      e.edges,
      "target"
    ), u = ne(
      f.bakw,
      e.edges,
      "target"
    );
    if (h.features.length === 0 || u.features.length === 0)
      throw "TOO LINEAR1";
    const a = dn(f.forw), l = ve(f.forw);
    if (!l) throw "TOO LINEAR2";
    const d = {}, m = l.geometry.coordinates[0];
    let g;
    try {
      g = m.map((E) => ({
        forw: E,
        bakw: ae(Kt(E), h)
      })), g.forEach((E) => {
        d[`${E.forw[0]}:${E.forw[1]}`] = E;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const b = ve(f.bakw);
    if (!b) throw "TOO LINEAR2";
    const w = b.geometry.coordinates[0];
    try {
      g = w.map((E) => ({
        bakw: E,
        forw: ae(Kt(E), u)
      })), g.forEach((E) => {
        d[`${E.forw[0]}:${E.forw[1]}`] = E;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const S = {
      forw: a.geometry.coordinates,
      bakw: ae(a, h)
    }, v = re(S.forw, S.bakw, "c");
    this.centroid = {
      forw: v,
      bakw: oe(v)
    };
    const I = {
      convexBuf: d,
      centroid: S,
      bbox: n,
      minx: r,
      maxx: s,
      miny: i,
      maxy: c
    }, C = this.vertexMode === ct.VERTEX_BIRDEYE ? es(I) : ts(I), N = {
      forw: [],
      bakw: []
    };
    for (let E = 0; E < C.length; E++) {
      const V = C[E].forw, L = C[E].bakw, z = re(V, L, `b${E}`), W = oe(z);
      e.forw.push(z), e.bakw.push(W), N.forw.push(z), N.bakw.push(W);
    }
    this.pointsSet = {
      forw: Ot(e.forw),
      bakw: Ot(e.bakw),
      edges: e.edges
    }, this.tins = {
      forw: Ce(
        ne(
          this.pointsSet.forw,
          e.edges,
          "target"
        )
      )
    }, (t === ct.MODE_STRICT || t === ct.MODE_AUTO) && this.calcurateStrictTin(), (t === ct.MODE_LOOSE || t === ct.MODE_AUTO && this.strict_status === ct.STATUS_ERROR) && (this.tins.bakw = Ce(
      ne(
        this.pointsSet.bakw,
        e.edges,
        "target"
      )
    ), delete this.kinks, this.strict_status = ct.STATUS_LOOSE), this.vertices_params = {
      forw: Ye(N.forw, this.centroid.forw),
      bakw: Ye(N.bakw, this.centroid.bakw)
    }, this.addIndexedTin();
    const j = ["forw"];
    this.strict_status === ct.STATUS_LOOSE && j.push("bakw");
    const q = this.strict_status === ct.STATUS_STRICT;
    this.pointsWeightBuffer = As({
      tins: this.tins,
      targets: j,
      includeReciprocals: q
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
  ct as Tin,
  ne as constrainedTin,
  oe as counterPoint,
  re as createPoint,
  ns as findIntersections,
  xe as format_version,
  ln as insertSearchIndex,
  Ye as vertexCalc
};
