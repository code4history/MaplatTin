var vn = Object.defineProperty;
var Sn = (i, t, e) => t in i ? vn(i, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : i[t] = e;
var X = (i, t, e) => Sn(i, typeof t != "symbol" ? t + "" : t, e);
import En from "delaunator";
import _n from "@kninnug/constrainautor";
function Mt(i, t, e = {}) {
  const n = { type: "Feature" };
  return (e.id === 0 || e.id) && (n.id = e.id), e.bbox && (n.bbox = e.bbox), n.properties = t || {}, n.geometry = i, n;
}
function at(i, t, e = {}) {
  if (!i)
    throw new Error("coordinates is required");
  if (!Array.isArray(i))
    throw new Error("coordinates must be an Array");
  if (i.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!be(i[0]) || !be(i[1]))
    throw new Error("coordinates must contain numbers");
  return Mt({
    type: "Point",
    coordinates: i
  }, t, e);
}
function mt(i, t, e = {}) {
  for (const r of i) {
    if (r.length < 4)
      throw new Error(
        "Each LinearRing of a Polygon must have 4 or more Positions."
      );
    if (r[r.length - 1].length !== r[0].length)
      throw new Error("First and last Position are not equivalent.");
    for (let s = 0; s < r[r.length - 1].length; s++)
      if (r[r.length - 1][s] !== r[0][s])
        throw new Error("First and last Position are not equivalent.");
  }
  return Mt({
    type: "Polygon",
    coordinates: i
  }, t, e);
}
function Me(i, t, e = {}) {
  if (i.length < 2)
    throw new Error("coordinates must be an array of two or more positions");
  return Mt({
    type: "LineString",
    coordinates: i
  }, t, e);
}
function Q(i, t = {}) {
  const e = { type: "FeatureCollection" };
  return t.id && (e.id = t.id), t.bbox && (e.bbox = t.bbox), e.features = i, e;
}
function de(i, t, e = {}) {
  return Mt({
    type: "MultiPolygon",
    coordinates: i
  }, t, e);
}
function be(i) {
  return !isNaN(i) && i !== null && !Array.isArray(i);
}
function Mn(i) {
  if (!i)
    throw new Error("coord is required");
  if (!Array.isArray(i)) {
    if (i.type === "Feature" && i.geometry !== null && i.geometry.type === "Point")
      return [...i.geometry.coordinates];
    if (i.type === "Point")
      return [...i.coordinates];
  }
  if (Array.isArray(i) && i.length >= 2 && !Array.isArray(i[0]) && !Array.isArray(i[1]))
    return [...i];
  throw new Error("coord must be GeoJSON Point or an Array of numbers");
}
function ke(i) {
  if (Array.isArray(i))
    return i;
  if (i.type === "Feature") {
    if (i.geometry !== null)
      return i.geometry.coordinates;
  } else if (i.coordinates)
    return i.coordinates;
  throw new Error(
    "coords must be GeoJSON Feature, Geometry Object or an Array"
  );
}
function bn(i) {
  return i.type === "Feature" ? i.geometry : i;
}
function Vt(i, t, e = {}) {
  if (!i)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const n = Mn(i), r = bn(t), s = r.type, o = t.bbox;
  let l = r.coordinates;
  if (o && !kn(n, o))
    return !1;
  s === "Polygon" && (l = [l]);
  let f = !1;
  for (let u = 0; u < l.length && !f; u++) {
    const g = Tn(n, l[u]);
    (g === 0 && !e.ignoreBoundary || g) && (f = !0);
  }
  return f;
}
function kn(i, t) {
  return t[0] <= i[0] && t[1] <= i[1] && t[2] >= i[0] && t[3] >= i[1];
}
function Tn(i, t) {
  let e = 0, n = 0, r = 0, s = 0, o = 0, l = 0, f = 0, u = 0, g = null, E = null;
  const b = i[0], O = i[1], T = t.length;
  for (e; e < T; e++) {
    n = 0;
    const P = t[e].length - 1, M = t[e];
    for (g = M[0], o = g[0] - b, l = g[1] - O, n; n < P; n++) {
      if (E = M[n + 1], u = E[1] - O, l < 0 && u < 0 || l > 0 && u > 0) {
        g = E, l = u, o = g[0] - b;
        continue;
      }
      if (f = E[0] - i[0], u > 0 && l <= 0) {
        if (s = o * u - f * l, s > 0) r = r + 1;
        else if (s === 0) return 0;
      } else if (l > 0 && u <= 0) {
        if (s = o * u - f * l, s < 0) r = r + 1;
        else if (s === 0) return 0;
      } else if (u === 0 && l < 0) {
        if (s = o * u - f * l, s === 0) return 0;
      } else if (l === 0 && u < 0) {
        if (s = o * u - f * l, s === 0) return 0;
      } else if (l === 0 && u === 0) {
        if (f <= 0 && o >= 0)
          return 0;
        if (o <= 0 && f >= 0)
          return 0;
      }
      g = E, l = u, o = f;
    }
  }
  return r % 2 !== 0;
}
function we(i, t, e) {
  if (i !== null)
    for (var n, r, s, o, l, f, u, g = 0, E = 0, b, O = i.type, T = O === "FeatureCollection", P = O === "Feature", M = T ? i.features.length : 1, B = 0; B < M; B++) {
      u = T ? i.features[B].geometry : P ? i.geometry : i, b = u ? u.type === "GeometryCollection" : !1, l = b ? u.geometries.length : 1;
      for (var c = 0; c < l; c++) {
        var m = 0, d = 0;
        if (o = b ? u.geometries[c] : u, o !== null) {
          f = o.coordinates;
          var I = o.type;
          switch (g = e && (I === "Polygon" || I === "MultiPolygon") ? 1 : 0, I) {
            case null:
              break;
            case "Point":
              if (t(
                f,
                E,
                B,
                m,
                d
              ) === !1)
                return !1;
              E++, m++;
              break;
            case "LineString":
            case "MultiPoint":
              for (n = 0; n < f.length; n++) {
                if (t(
                  f[n],
                  E,
                  B,
                  m,
                  d
                ) === !1)
                  return !1;
                E++, I === "MultiPoint" && m++;
              }
              I === "LineString" && m++;
              break;
            case "Polygon":
            case "MultiLineString":
              for (n = 0; n < f.length; n++) {
                for (r = 0; r < f[n].length - g; r++) {
                  if (t(
                    f[n][r],
                    E,
                    B,
                    m,
                    d
                  ) === !1)
                    return !1;
                  E++;
                }
                I === "MultiLineString" && m++, I === "Polygon" && d++;
              }
              I === "Polygon" && m++;
              break;
            case "MultiPolygon":
              for (n = 0; n < f.length; n++) {
                for (d = 0, r = 0; r < f[n].length; r++) {
                  for (s = 0; s < f[n][r].length - g; s++) {
                    if (t(
                      f[n][r][s],
                      E,
                      B,
                      m,
                      d
                    ) === !1)
                      return !1;
                    E++;
                  }
                  d++;
                }
                m++;
              }
              break;
            case "GeometryCollection":
              for (n = 0; n < o.geometries.length; n++)
                if (we(o.geometries[n], t, e) === !1)
                  return !1;
              break;
            default:
              throw new Error("Unknown Geometry Type");
          }
        }
      }
    }
}
function ye(i, t) {
  var e, n, r, s, o, l, f, u, g, E, b = 0, O = i.type === "FeatureCollection", T = i.type === "Feature", P = O ? i.features.length : 1;
  for (e = 0; e < P; e++) {
    for (l = O ? i.features[e].geometry : T ? i.geometry : i, u = O ? i.features[e].properties : T ? i.properties : {}, g = O ? i.features[e].bbox : T ? i.bbox : void 0, E = O ? i.features[e].id : T ? i.id : void 0, f = l ? l.type === "GeometryCollection" : !1, o = f ? l.geometries.length : 1, r = 0; r < o; r++) {
      if (s = f ? l.geometries[r] : l, s === null) {
        if (t(
          null,
          b,
          u,
          g,
          E
        ) === !1)
          return !1;
        continue;
      }
      switch (s.type) {
        case "Point":
        case "LineString":
        case "MultiPoint":
        case "Polygon":
        case "MultiLineString":
        case "MultiPolygon": {
          if (t(
            s,
            b,
            u,
            g,
            E
          ) === !1)
            return !1;
          break;
        }
        case "GeometryCollection": {
          for (n = 0; n < s.geometries.length; n++)
            if (t(
              s.geometries[n],
              b,
              u,
              g,
              E
            ) === !1)
              return !1;
          break;
        }
        default:
          throw new Error("Unknown Geometry Type");
      }
    }
    b++;
  }
}
function An(i, t = {}) {
  let e = 0, n = 0, r = 0;
  return we(
    i,
    function(s) {
      e += s[0], n += s[1], r++;
    },
    !0
  ), at([e / r, n / r], t.properties);
}
var On = An, Ze = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Pn(i) {
  return i && i.__esModule && Object.prototype.hasOwnProperty.call(i, "default") ? i.default : i;
}
function In(i) {
  if (i.__esModule) return i;
  var t = i.default;
  if (typeof t == "function") {
    var e = function n() {
      return this instanceof n ? Reflect.construct(t, arguments, this.constructor) : t.apply(this, arguments);
    };
    e.prototype = t.prototype;
  } else e = {};
  return Object.defineProperty(e, "__esModule", { value: !0 }), Object.keys(i).forEach(function(n) {
    var r = Object.getOwnPropertyDescriptor(i, n);
    Object.defineProperty(e, n, r.get ? r : {
      enumerable: !0,
      get: function() {
        return i[n];
      }
    });
  }), e;
}
var xe = { exports: {} }, Qe = { exports: {} };
(function(i, t) {
  (function(e, n) {
    i.exports = n();
  })(Ze, function() {
    function e(c, m, d, I, N) {
      (function R(a, h, p, y, w) {
        for (; y > p; ) {
          if (y - p > 600) {
            var v = y - p + 1, k = h - p + 1, x = Math.log(v), S = 0.5 * Math.exp(2 * x / 3), A = 0.5 * Math.sqrt(x * S * (v - S) / v) * (k - v / 2 < 0 ? -1 : 1), _ = Math.max(p, Math.floor(h - k * S / v + A)), L = Math.min(y, Math.floor(h + (v - k) * S / v + A));
            R(a, h, _, L, w);
          }
          var C = a[h], Y = p, D = y;
          for (n(a, p, h), w(a[y], C) > 0 && n(a, p, y); Y < D; ) {
            for (n(a, Y, D), Y++, D--; w(a[Y], C) < 0; ) Y++;
            for (; w(a[D], C) > 0; ) D--;
          }
          w(a[p], C) === 0 ? n(a, p, D) : n(a, ++D, y), D <= h && (p = D + 1), h <= D && (y = D - 1);
        }
      })(c, m, d || 0, I || c.length - 1, N || r);
    }
    function n(c, m, d) {
      var I = c[m];
      c[m] = c[d], c[d] = I;
    }
    function r(c, m) {
      return c < m ? -1 : c > m ? 1 : 0;
    }
    var s = function(c) {
      c === void 0 && (c = 9), this._maxEntries = Math.max(4, c), this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries)), this.clear();
    };
    function o(c, m, d) {
      if (!d) return m.indexOf(c);
      for (var I = 0; I < m.length; I++) if (d(c, m[I])) return I;
      return -1;
    }
    function l(c, m) {
      f(c, 0, c.children.length, m, c);
    }
    function f(c, m, d, I, N) {
      N || (N = M(null)), N.minX = 1 / 0, N.minY = 1 / 0, N.maxX = -1 / 0, N.maxY = -1 / 0;
      for (var R = m; R < d; R++) {
        var a = c.children[R];
        u(N, c.leaf ? I(a) : a);
      }
      return N;
    }
    function u(c, m) {
      return c.minX = Math.min(c.minX, m.minX), c.minY = Math.min(c.minY, m.minY), c.maxX = Math.max(c.maxX, m.maxX), c.maxY = Math.max(c.maxY, m.maxY), c;
    }
    function g(c, m) {
      return c.minX - m.minX;
    }
    function E(c, m) {
      return c.minY - m.minY;
    }
    function b(c) {
      return (c.maxX - c.minX) * (c.maxY - c.minY);
    }
    function O(c) {
      return c.maxX - c.minX + (c.maxY - c.minY);
    }
    function T(c, m) {
      return c.minX <= m.minX && c.minY <= m.minY && m.maxX <= c.maxX && m.maxY <= c.maxY;
    }
    function P(c, m) {
      return m.minX <= c.maxX && m.minY <= c.maxY && m.maxX >= c.minX && m.maxY >= c.minY;
    }
    function M(c) {
      return { children: c, height: 1, leaf: !0, minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
    }
    function B(c, m, d, I, N) {
      for (var R = [m, d]; R.length; ) if (!((d = R.pop()) - (m = R.pop()) <= I)) {
        var a = m + Math.ceil((d - m) / I / 2) * I;
        e(c, a, m, d, N), R.push(m, a, a, d);
      }
    }
    return s.prototype.all = function() {
      return this._all(this.data, []);
    }, s.prototype.search = function(c) {
      var m = this.data, d = [];
      if (!P(c, m)) return d;
      for (var I = this.toBBox, N = []; m; ) {
        for (var R = 0; R < m.children.length; R++) {
          var a = m.children[R], h = m.leaf ? I(a) : a;
          P(c, h) && (m.leaf ? d.push(a) : T(c, h) ? this._all(a, d) : N.push(a));
        }
        m = N.pop();
      }
      return d;
    }, s.prototype.collides = function(c) {
      var m = this.data;
      if (!P(c, m)) return !1;
      for (var d = []; m; ) {
        for (var I = 0; I < m.children.length; I++) {
          var N = m.children[I], R = m.leaf ? this.toBBox(N) : N;
          if (P(c, R)) {
            if (m.leaf || T(c, R)) return !0;
            d.push(N);
          }
        }
        m = d.pop();
      }
      return !1;
    }, s.prototype.load = function(c) {
      if (!c || !c.length) return this;
      if (c.length < this._minEntries) {
        for (var m = 0; m < c.length; m++) this.insert(c[m]);
        return this;
      }
      var d = this._build(c.slice(), 0, c.length - 1, 0);
      if (this.data.children.length) if (this.data.height === d.height) this._splitRoot(this.data, d);
      else {
        if (this.data.height < d.height) {
          var I = this.data;
          this.data = d, d = I;
        }
        this._insert(d, this.data.height - d.height - 1, !0);
      }
      else this.data = d;
      return this;
    }, s.prototype.insert = function(c) {
      return c && this._insert(c, this.data.height - 1), this;
    }, s.prototype.clear = function() {
      return this.data = M([]), this;
    }, s.prototype.remove = function(c, m) {
      if (!c) return this;
      for (var d, I, N, R = this.data, a = this.toBBox(c), h = [], p = []; R || h.length; ) {
        if (R || (R = h.pop(), I = h[h.length - 1], d = p.pop(), N = !0), R.leaf) {
          var y = o(c, R.children, m);
          if (y !== -1) return R.children.splice(y, 1), h.push(R), this._condense(h), this;
        }
        N || R.leaf || !T(R, a) ? I ? (d++, R = I.children[d], N = !1) : R = null : (h.push(R), p.push(d), d = 0, I = R, R = R.children[0]);
      }
      return this;
    }, s.prototype.toBBox = function(c) {
      return c;
    }, s.prototype.compareMinX = function(c, m) {
      return c.minX - m.minX;
    }, s.prototype.compareMinY = function(c, m) {
      return c.minY - m.minY;
    }, s.prototype.toJSON = function() {
      return this.data;
    }, s.prototype.fromJSON = function(c) {
      return this.data = c, this;
    }, s.prototype._all = function(c, m) {
      for (var d = []; c; ) c.leaf ? m.push.apply(m, c.children) : d.push.apply(d, c.children), c = d.pop();
      return m;
    }, s.prototype._build = function(c, m, d, I) {
      var N, R = d - m + 1, a = this._maxEntries;
      if (R <= a) return l(N = M(c.slice(m, d + 1)), this.toBBox), N;
      I || (I = Math.ceil(Math.log(R) / Math.log(a)), a = Math.ceil(R / Math.pow(a, I - 1))), (N = M([])).leaf = !1, N.height = I;
      var h = Math.ceil(R / a), p = h * Math.ceil(Math.sqrt(a));
      B(c, m, d, p, this.compareMinX);
      for (var y = m; y <= d; y += p) {
        var w = Math.min(y + p - 1, d);
        B(c, y, w, h, this.compareMinY);
        for (var v = y; v <= w; v += h) {
          var k = Math.min(v + h - 1, w);
          N.children.push(this._build(c, v, k, I - 1));
        }
      }
      return l(N, this.toBBox), N;
    }, s.prototype._chooseSubtree = function(c, m, d, I) {
      for (; I.push(m), !m.leaf && I.length - 1 !== d; ) {
        for (var N = 1 / 0, R = 1 / 0, a = void 0, h = 0; h < m.children.length; h++) {
          var p = m.children[h], y = b(p), w = (v = c, k = p, (Math.max(k.maxX, v.maxX) - Math.min(k.minX, v.minX)) * (Math.max(k.maxY, v.maxY) - Math.min(k.minY, v.minY)) - y);
          w < R ? (R = w, N = y < N ? y : N, a = p) : w === R && y < N && (N = y, a = p);
        }
        m = a || m.children[0];
      }
      var v, k;
      return m;
    }, s.prototype._insert = function(c, m, d) {
      var I = d ? c : this.toBBox(c), N = [], R = this._chooseSubtree(I, this.data, m, N);
      for (R.children.push(c), u(R, I); m >= 0 && N[m].children.length > this._maxEntries; ) this._split(N, m), m--;
      this._adjustParentBBoxes(I, N, m);
    }, s.prototype._split = function(c, m) {
      var d = c[m], I = d.children.length, N = this._minEntries;
      this._chooseSplitAxis(d, N, I);
      var R = this._chooseSplitIndex(d, N, I), a = M(d.children.splice(R, d.children.length - R));
      a.height = d.height, a.leaf = d.leaf, l(d, this.toBBox), l(a, this.toBBox), m ? c[m - 1].children.push(a) : this._splitRoot(d, a);
    }, s.prototype._splitRoot = function(c, m) {
      this.data = M([c, m]), this.data.height = c.height + 1, this.data.leaf = !1, l(this.data, this.toBBox);
    }, s.prototype._chooseSplitIndex = function(c, m, d) {
      for (var I, N, R, a, h, p, y, w = 1 / 0, v = 1 / 0, k = m; k <= d - m; k++) {
        var x = f(c, 0, k, this.toBBox), S = f(c, k, d, this.toBBox), A = (N = x, R = S, a = void 0, h = void 0, p = void 0, y = void 0, a = Math.max(N.minX, R.minX), h = Math.max(N.minY, R.minY), p = Math.min(N.maxX, R.maxX), y = Math.min(N.maxY, R.maxY), Math.max(0, p - a) * Math.max(0, y - h)), _ = b(x) + b(S);
        A < w ? (w = A, I = k, v = _ < v ? _ : v) : A === w && _ < v && (v = _, I = k);
      }
      return I || d - m;
    }, s.prototype._chooseSplitAxis = function(c, m, d) {
      var I = c.leaf ? this.compareMinX : g, N = c.leaf ? this.compareMinY : E;
      this._allDistMargin(c, m, d, I) < this._allDistMargin(c, m, d, N) && c.children.sort(I);
    }, s.prototype._allDistMargin = function(c, m, d, I) {
      c.children.sort(I);
      for (var N = this.toBBox, R = f(c, 0, m, N), a = f(c, d - m, d, N), h = O(R) + O(a), p = m; p < d - m; p++) {
        var y = c.children[p];
        u(R, c.leaf ? N(y) : y), h += O(R);
      }
      for (var w = d - m - 1; w >= m; w--) {
        var v = c.children[w];
        u(a, c.leaf ? N(v) : v), h += O(a);
      }
      return h;
    }, s.prototype._adjustParentBBoxes = function(c, m, d) {
      for (var I = d; I >= 0; I--) u(m[I], c);
    }, s.prototype._condense = function(c) {
      for (var m = c.length - 1, d = void 0; m >= 0; m--) c[m].children.length === 0 ? m > 0 ? (d = c[m - 1].children).splice(d.indexOf(c[m]), 1) : this.clear() : l(c[m], this.toBBox);
    }, s;
  });
})(Qe);
var Bn = Qe.exports;
let Nn = class {
  constructor(t = [], e = Rn) {
    if (this.data = t, this.length = this.data.length, this.compare = e, this.length > 0)
      for (let n = (this.length >> 1) - 1; n >= 0; n--) this._down(n);
  }
  push(t) {
    this.data.push(t), this.length++, this._up(this.length - 1);
  }
  pop() {
    if (this.length === 0) return;
    const t = this.data[0], e = this.data.pop();
    return this.length--, this.length > 0 && (this.data[0] = e, this._down(0)), t;
  }
  peek() {
    return this.data[0];
  }
  _up(t) {
    const { data: e, compare: n } = this, r = e[t];
    for (; t > 0; ) {
      const s = t - 1 >> 1, o = e[s];
      if (n(r, o) >= 0) break;
      e[t] = o, t = s;
    }
    e[t] = r;
  }
  _down(t) {
    const { data: e, compare: n } = this, r = this.length >> 1, s = e[t];
    for (; t < r; ) {
      let o = (t << 1) + 1, l = e[o];
      const f = o + 1;
      if (f < this.length && n(e[f], l) < 0 && (o = f, l = e[f]), n(l, s) >= 0) break;
      e[t] = l, t = o;
    }
    e[t] = s;
  }
};
function Rn(i, t) {
  return i < t ? -1 : i > t ? 1 : 0;
}
const Ln = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Nn
}, Symbol.toStringTag, { value: "Module" })), Cn = /* @__PURE__ */ In(Ln);
var ee = { exports: {} }, Xn = function(t, e, n, r) {
  var s = t[0], o = t[1], l = !1;
  n === void 0 && (n = 0), r === void 0 && (r = e.length);
  for (var f = (r - n) / 2, u = 0, g = f - 1; u < f; g = u++) {
    var E = e[n + u * 2 + 0], b = e[n + u * 2 + 1], O = e[n + g * 2 + 0], T = e[n + g * 2 + 1], P = b > o != T > o && s < (O - E) * (o - b) / (T - b) + E;
    P && (l = !l);
  }
  return l;
}, Yn = function(t, e, n, r) {
  var s = t[0], o = t[1], l = !1;
  n === void 0 && (n = 0), r === void 0 && (r = e.length);
  for (var f = r - n, u = 0, g = f - 1; u < f; g = u++) {
    var E = e[u + n][0], b = e[u + n][1], O = e[g + n][0], T = e[g + n][1], P = b > o != T > o && s < (O - E) * (o - b) / (T - b) + E;
    P && (l = !l);
  }
  return l;
}, tn = Xn, en = Yn;
ee.exports = function(t, e, n, r) {
  return e.length > 0 && Array.isArray(e[0]) ? en(t, e, n, r) : tn(t, e, n, r);
};
ee.exports.nested = en;
ee.exports.flat = tn;
var Dn = ee.exports, ue = { exports: {} };
(function(i, t) {
  (function(e, n) {
    n(t);
  })(Ze, function(e) {
    const r = 33306690738754706e-32;
    function s(P, M, B, c, m) {
      let d, I, N, R, a = M[0], h = c[0], p = 0, y = 0;
      h > a == h > -a ? (d = a, a = M[++p]) : (d = h, h = c[++y]);
      let w = 0;
      if (p < P && y < B) for (h > a == h > -a ? (N = d - ((I = a + d) - a), a = M[++p]) : (N = d - ((I = h + d) - h), h = c[++y]), d = I, N !== 0 && (m[w++] = N); p < P && y < B; ) h > a == h > -a ? (N = d - ((I = d + a) - (R = I - d)) + (a - R), a = M[++p]) : (N = d - ((I = d + h) - (R = I - d)) + (h - R), h = c[++y]), d = I, N !== 0 && (m[w++] = N);
      for (; p < P; ) N = d - ((I = d + a) - (R = I - d)) + (a - R), a = M[++p], d = I, N !== 0 && (m[w++] = N);
      for (; y < B; ) N = d - ((I = d + h) - (R = I - d)) + (h - R), h = c[++y], d = I, N !== 0 && (m[w++] = N);
      return d === 0 && w !== 0 || (m[w++] = d), w;
    }
    function o(P) {
      return new Float64Array(P);
    }
    const l = 33306690738754716e-32, f = 22204460492503146e-32, u = 11093356479670487e-47, g = o(4), E = o(8), b = o(12), O = o(16), T = o(4);
    e.orient2d = function(P, M, B, c, m, d) {
      const I = (M - d) * (B - m), N = (P - m) * (c - d), R = I - N;
      if (I === 0 || N === 0 || I > 0 != N > 0) return R;
      const a = Math.abs(I + N);
      return Math.abs(R) >= l * a ? R : -function(h, p, y, w, v, k, x) {
        let S, A, _, L, C, Y, D, z, G, U, F, V, et, Z, nt, J, it, K;
        const W = h - v, j = y - v, ft = p - k, ut = w - k;
        C = (nt = (z = W - (D = (Y = 134217729 * W) - (Y - W))) * (U = ut - (G = (Y = 134217729 * ut) - (Y - ut))) - ((Z = W * ut) - D * G - z * G - D * U)) - (F = nt - (it = (z = ft - (D = (Y = 134217729 * ft) - (Y - ft))) * (U = j - (G = (Y = 134217729 * j) - (Y - j))) - ((J = ft * j) - D * G - z * G - D * U))), g[0] = nt - (F + C) + (C - it), C = (et = Z - ((V = Z + F) - (C = V - Z)) + (F - C)) - (F = et - J), g[1] = et - (F + C) + (C - J), C = (K = V + F) - V, g[2] = V - (K - C) + (F - C), g[3] = K;
        let xt = function(xn, Ee) {
          let _e = Ee[0];
          for (let ne = 1; ne < xn; ne++) _e += Ee[ne];
          return _e;
        }(4, g), bt = f * x;
        if (xt >= bt || -xt >= bt || (S = h - (W + (C = h - W)) + (C - v), _ = y - (j + (C = y - j)) + (C - v), A = p - (ft + (C = p - ft)) + (C - k), L = w - (ut + (C = w - ut)) + (C - k), S === 0 && A === 0 && _ === 0 && L === 0) || (bt = u * x + r * Math.abs(xt), (xt += W * L + ut * S - (ft * _ + j * A)) >= bt || -xt >= bt)) return xt;
        C = (nt = (z = S - (D = (Y = 134217729 * S) - (Y - S))) * (U = ut - (G = (Y = 134217729 * ut) - (Y - ut))) - ((Z = S * ut) - D * G - z * G - D * U)) - (F = nt - (it = (z = A - (D = (Y = 134217729 * A) - (Y - A))) * (U = j - (G = (Y = 134217729 * j) - (Y - j))) - ((J = A * j) - D * G - z * G - D * U))), T[0] = nt - (F + C) + (C - it), C = (et = Z - ((V = Z + F) - (C = V - Z)) + (F - C)) - (F = et - J), T[1] = et - (F + C) + (C - J), C = (K = V + F) - V, T[2] = V - (K - C) + (F - C), T[3] = K;
        const dn = s(4, g, 4, T, E);
        C = (nt = (z = W - (D = (Y = 134217729 * W) - (Y - W))) * (U = L - (G = (Y = 134217729 * L) - (Y - L))) - ((Z = W * L) - D * G - z * G - D * U)) - (F = nt - (it = (z = ft - (D = (Y = 134217729 * ft) - (Y - ft))) * (U = _ - (G = (Y = 134217729 * _) - (Y - _))) - ((J = ft * _) - D * G - z * G - D * U))), T[0] = nt - (F + C) + (C - it), C = (et = Z - ((V = Z + F) - (C = V - Z)) + (F - C)) - (F = et - J), T[1] = et - (F + C) + (C - J), C = (K = V + F) - V, T[2] = V - (K - C) + (F - C), T[3] = K;
        const wn = s(dn, E, 4, T, b);
        C = (nt = (z = S - (D = (Y = 134217729 * S) - (Y - S))) * (U = L - (G = (Y = 134217729 * L) - (Y - L))) - ((Z = S * L) - D * G - z * G - D * U)) - (F = nt - (it = (z = A - (D = (Y = 134217729 * A) - (Y - A))) * (U = _ - (G = (Y = 134217729 * _) - (Y - _))) - ((J = A * _) - D * G - z * G - D * U))), T[0] = nt - (F + C) + (C - it), C = (et = Z - ((V = Z + F) - (C = V - Z)) + (F - C)) - (F = et - J), T[1] = et - (F + C) + (C - J), C = (K = V + F) - V, T[2] = V - (K - C) + (F - C), T[3] = K;
        const yn = s(wn, b, 4, T, O);
        return O[yn - 1];
      }(P, M, B, c, m, d, a);
    }, e.orient2dfast = function(P, M, B, c, m, d) {
      return (M - d) * (B - m) - (P - m) * (c - d);
    }, Object.defineProperty(e, "__esModule", { value: !0 });
  });
})(ue, ue.exports);
var Fn = ue.exports, Te = Bn, jt = Cn, Un = Dn, Gn = Fn.orient2d;
jt.default && (jt = jt.default);
xe.exports = nn;
xe.exports.default = nn;
function nn(i, t, e) {
  t = Math.max(0, t === void 0 ? 2 : t), e = e || 0;
  var n = jn(i), r = new Te(16);
  r.toBBox = function(c) {
    return {
      minX: c[0],
      minY: c[1],
      maxX: c[0],
      maxY: c[1]
    };
  }, r.compareMinX = function(c, m) {
    return c[0] - m[0];
  }, r.compareMinY = function(c, m) {
    return c[1] - m[1];
  }, r.load(i);
  for (var s = [], o = 0, l; o < n.length; o++) {
    var f = n[o];
    r.remove(f), l = Pe(f, l), s.push(l);
  }
  var u = new Te(16);
  for (o = 0; o < s.length; o++) u.insert(ie(s[o]));
  for (var g = t * t, E = e * e; s.length; ) {
    var b = s.shift(), O = b.p, T = b.next.p, P = re(O, T);
    if (!(P < E)) {
      var M = P / g;
      f = qn(r, b.prev.p, O, T, b.next.next.p, M, u), f && Math.min(re(f, O), re(f, T)) <= M && (s.push(b), s.push(Pe(f, b)), r.remove(f), u.remove(b), u.insert(ie(b)), u.insert(ie(b.next)));
    }
  }
  b = l;
  var B = [];
  do
    B.push(b.p), b = b.next;
  while (b !== l);
  return B.push(b.p), B;
}
function qn(i, t, e, n, r, s, o) {
  for (var l = new jt([], $n), f = i.data; f; ) {
    for (var u = 0; u < f.children.length; u++) {
      var g = f.children[u], E = f.leaf ? se(g, e, n) : zn(e, n, g);
      E > s || l.push({
        node: g,
        dist: E
      });
    }
    for (; l.length && !l.peek().node.children; ) {
      var b = l.pop(), O = b.node, T = se(O, t, e), P = se(O, n, r);
      if (b.dist < T && b.dist < P && Oe(e, O, o) && Oe(n, O, o)) return O;
    }
    f = l.pop(), f && (f = f.node);
  }
  return null;
}
function $n(i, t) {
  return i.dist - t.dist;
}
function zn(i, t, e) {
  if (Ae(i, e) || Ae(t, e)) return 0;
  var n = Bt(i[0], i[1], t[0], t[1], e.minX, e.minY, e.maxX, e.minY);
  if (n === 0) return 0;
  var r = Bt(i[0], i[1], t[0], t[1], e.minX, e.minY, e.minX, e.maxY);
  if (r === 0) return 0;
  var s = Bt(i[0], i[1], t[0], t[1], e.maxX, e.minY, e.maxX, e.maxY);
  if (s === 0) return 0;
  var o = Bt(i[0], i[1], t[0], t[1], e.minX, e.maxY, e.maxX, e.maxY);
  return o === 0 ? 0 : Math.min(n, r, s, o);
}
function Ae(i, t) {
  return i[0] >= t.minX && i[0] <= t.maxX && i[1] >= t.minY && i[1] <= t.maxY;
}
function Oe(i, t, e) {
  for (var n = Math.min(i[0], t[0]), r = Math.min(i[1], t[1]), s = Math.max(i[0], t[0]), o = Math.max(i[1], t[1]), l = e.search({ minX: n, minY: r, maxX: s, maxY: o }), f = 0; f < l.length; f++)
    if (Vn(l[f].p, l[f].next.p, i, t)) return !1;
  return !0;
}
function _t(i, t, e) {
  return Gn(i[0], i[1], t[0], t[1], e[0], e[1]);
}
function Vn(i, t, e, n) {
  return i !== n && t !== e && _t(i, t, e) > 0 != _t(i, t, n) > 0 && _t(e, n, i) > 0 != _t(e, n, t) > 0;
}
function ie(i) {
  var t = i.p, e = i.next.p;
  return i.minX = Math.min(t[0], e[0]), i.minY = Math.min(t[1], e[1]), i.maxX = Math.max(t[0], e[0]), i.maxY = Math.max(t[1], e[1]), i;
}
function jn(i) {
  for (var t = i[0], e = i[0], n = i[0], r = i[0], s = 0; s < i.length; s++) {
    var o = i[s];
    o[0] < t[0] && (t = o), o[0] > n[0] && (n = o), o[1] < e[1] && (e = o), o[1] > r[1] && (r = o);
  }
  var l = [t, e, n, r], f = l.slice();
  for (s = 0; s < i.length; s++)
    Un(i[s], l) || f.push(i[s]);
  return Kn(f);
}
function Pe(i, t) {
  var e = {
    p: i,
    prev: null,
    next: null,
    minX: 0,
    minY: 0,
    maxX: 0,
    maxY: 0
  };
  return t ? (e.next = t.next, e.prev = t, t.next.prev = e, t.next = e) : (e.prev = e, e.next = e), e;
}
function re(i, t) {
  var e = i[0] - t[0], n = i[1] - t[1];
  return e * e + n * n;
}
function se(i, t, e) {
  var n = t[0], r = t[1], s = e[0] - n, o = e[1] - r;
  if (s !== 0 || o !== 0) {
    var l = ((i[0] - n) * s + (i[1] - r) * o) / (s * s + o * o);
    l > 1 ? (n = e[0], r = e[1]) : l > 0 && (n += s * l, r += o * l);
  }
  return s = i[0] - n, o = i[1] - r, s * s + o * o;
}
function Bt(i, t, e, n, r, s, o, l) {
  var f = e - i, u = n - t, g = o - r, E = l - s, b = i - r, O = t - s, T = f * f + u * u, P = f * g + u * E, M = g * g + E * E, B = f * b + u * O, c = g * b + E * O, m = T * M - P * P, d, I, N, R, a = m, h = m;
  m === 0 ? (I = 0, a = 1, R = c, h = M) : (I = P * c - M * B, R = T * c - P * B, I < 0 ? (I = 0, R = c, h = M) : I > a && (I = a, R = c + P, h = M)), R < 0 ? (R = 0, -B < 0 ? I = 0 : -B > T ? I = a : (I = -B, a = T)) : R > h && (R = h, -B + P < 0 ? I = 0 : -B + P > T ? I = a : (I = -B + P, a = T)), d = I === 0 ? 0 : I / a, N = R === 0 ? 0 : R / h;
  var p = (1 - d) * i + d * e, y = (1 - d) * t + d * n, w = (1 - N) * r + N * o, v = (1 - N) * s + N * l, k = w - p, x = v - y;
  return k * k + x * x;
}
function Wn(i, t) {
  return i[0] === t[0] ? i[1] - t[1] : i[0] - t[0];
}
function Kn(i) {
  i.sort(Wn);
  for (var t = [], e = 0; e < i.length; e++) {
    for (; t.length >= 2 && _t(t[t.length - 2], t[t.length - 1], i[e]) <= 0; )
      t.pop();
    t.push(i[e]);
  }
  for (var n = [], r = i.length - 1; r >= 0; r--) {
    for (; n.length >= 2 && _t(n[n.length - 2], n[n.length - 1], i[r]) <= 0; )
      n.pop();
    n.push(i[r]);
  }
  return n.pop(), t.pop(), t.concat(n);
}
var Jn = xe.exports;
const Hn = /* @__PURE__ */ Pn(Jn);
function Zn(i, t = {}) {
  t.concavity = t.concavity || 1 / 0;
  const e = [];
  if (we(i, (r) => {
    e.push([r[0], r[1]]);
  }), !e.length)
    return null;
  const n = Hn(e, t.concavity);
  return n.length > 3 ? mt([n]) : null;
}
var oe = Zn, Qn = /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i, le = Math.ceil, ot = Math.floor, rt = "[BigNumber Error] ", Ie = rt + "Number primitive has more than 15 significant digits: ", ht = 1e14, q = 14, ae = 9007199254740991, fe = [1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13], vt = 1e7, tt = 1e9;
function rn(i) {
  var t, e, n, r = c.prototype = { constructor: c, toString: null, valueOf: null }, s = new c(1), o = 20, l = 4, f = -7, u = 21, g = -1e7, E = 1e7, b = !1, O = 1, T = 0, P = {
    prefix: "",
    groupSize: 3,
    secondaryGroupSize: 0,
    groupSeparator: ",",
    decimalSeparator: ".",
    fractionGroupSize: 0,
    fractionGroupSeparator: " ",
    // non-breaking space
    suffix: ""
  }, M = "0123456789abcdefghijklmnopqrstuvwxyz", B = !0;
  function c(a, h) {
    var p, y, w, v, k, x, S, A, _ = this;
    if (!(_ instanceof c)) return new c(a, h);
    if (h == null) {
      if (a && a._isBigNumber === !0) {
        _.s = a.s, !a.c || a.e > E ? _.c = _.e = null : a.e < g ? _.c = [_.e = 0] : (_.e = a.e, _.c = a.c.slice());
        return;
      }
      if ((x = typeof a == "number") && a * 0 == 0) {
        if (_.s = 1 / a < 0 ? (a = -a, -1) : 1, a === ~~a) {
          for (v = 0, k = a; k >= 10; k /= 10, v++) ;
          v > E ? _.c = _.e = null : (_.e = v, _.c = [a]);
          return;
        }
        A = String(a);
      } else {
        if (!Qn.test(A = String(a))) return n(_, A, x);
        _.s = A.charCodeAt(0) == 45 ? (A = A.slice(1), -1) : 1;
      }
      (v = A.indexOf(".")) > -1 && (A = A.replace(".", "")), (k = A.search(/e/i)) > 0 ? (v < 0 && (v = k), v += +A.slice(k + 1), A = A.substring(0, k)) : v < 0 && (v = A.length);
    } else {
      if (H(h, 2, M.length, "Base"), h == 10 && B)
        return _ = new c(a), N(_, o + _.e + 1, l);
      if (A = String(a), x = typeof a == "number") {
        if (a * 0 != 0) return n(_, A, x, h);
        if (_.s = 1 / a < 0 ? (A = A.slice(1), -1) : 1, c.DEBUG && A.replace(/^0\.0*|\./, "").length > 15)
          throw Error(Ie + a);
      } else
        _.s = A.charCodeAt(0) === 45 ? (A = A.slice(1), -1) : 1;
      for (p = M.slice(0, h), v = k = 0, S = A.length; k < S; k++)
        if (p.indexOf(y = A.charAt(k)) < 0) {
          if (y == ".") {
            if (k > v) {
              v = S;
              continue;
            }
          } else if (!w && (A == A.toUpperCase() && (A = A.toLowerCase()) || A == A.toLowerCase() && (A = A.toUpperCase()))) {
            w = !0, k = -1, v = 0;
            continue;
          }
          return n(_, String(a), x, h);
        }
      x = !1, A = e(A, h, 10, _.s), (v = A.indexOf(".")) > -1 ? A = A.replace(".", "") : v = A.length;
    }
    for (k = 0; A.charCodeAt(k) === 48; k++) ;
    for (S = A.length; A.charCodeAt(--S) === 48; ) ;
    if (A = A.slice(k, ++S)) {
      if (S -= k, x && c.DEBUG && S > 15 && (a > ae || a !== ot(a)))
        throw Error(Ie + _.s * a);
      if ((v = v - k - 1) > E)
        _.c = _.e = null;
      else if (v < g)
        _.c = [_.e = 0];
      else {
        if (_.e = v, _.c = [], k = (v + 1) % q, v < 0 && (k += q), k < S) {
          for (k && _.c.push(+A.slice(0, k)), S -= q; k < S; )
            _.c.push(+A.slice(k, k += q));
          k = q - (A = A.slice(k)).length;
        } else
          k -= S;
        for (; k--; A += "0") ;
        _.c.push(+A);
      }
    } else
      _.c = [_.e = 0];
  }
  c.clone = rn, c.ROUND_UP = 0, c.ROUND_DOWN = 1, c.ROUND_CEIL = 2, c.ROUND_FLOOR = 3, c.ROUND_HALF_UP = 4, c.ROUND_HALF_DOWN = 5, c.ROUND_HALF_EVEN = 6, c.ROUND_HALF_CEIL = 7, c.ROUND_HALF_FLOOR = 8, c.EUCLID = 9, c.config = c.set = function(a) {
    var h, p;
    if (a != null)
      if (typeof a == "object") {
        if (a.hasOwnProperty(h = "DECIMAL_PLACES") && (p = a[h], H(p, 0, tt, h), o = p), a.hasOwnProperty(h = "ROUNDING_MODE") && (p = a[h], H(p, 0, 8, h), l = p), a.hasOwnProperty(h = "EXPONENTIAL_AT") && (p = a[h], p && p.pop ? (H(p[0], -tt, 0, h), H(p[1], 0, tt, h), f = p[0], u = p[1]) : (H(p, -tt, tt, h), f = -(u = p < 0 ? -p : p))), a.hasOwnProperty(h = "RANGE"))
          if (p = a[h], p && p.pop)
            H(p[0], -tt, -1, h), H(p[1], 1, tt, h), g = p[0], E = p[1];
          else if (H(p, -tt, tt, h), p)
            g = -(E = p < 0 ? -p : p);
          else
            throw Error(rt + h + " cannot be zero: " + p);
        if (a.hasOwnProperty(h = "CRYPTO"))
          if (p = a[h], p === !!p)
            if (p)
              if (typeof crypto < "u" && crypto && (crypto.getRandomValues || crypto.randomBytes))
                b = p;
              else
                throw b = !p, Error(rt + "crypto unavailable");
            else
              b = p;
          else
            throw Error(rt + h + " not true or false: " + p);
        if (a.hasOwnProperty(h = "MODULO_MODE") && (p = a[h], H(p, 0, 9, h), O = p), a.hasOwnProperty(h = "POW_PRECISION") && (p = a[h], H(p, 0, tt, h), T = p), a.hasOwnProperty(h = "FORMAT"))
          if (p = a[h], typeof p == "object") P = p;
          else throw Error(rt + h + " not an object: " + p);
        if (a.hasOwnProperty(h = "ALPHABET"))
          if (p = a[h], typeof p == "string" && !/^.?$|[+\-.\s]|(.).*\1/.test(p))
            B = p.slice(0, 10) == "0123456789", M = p;
          else
            throw Error(rt + h + " invalid: " + p);
      } else
        throw Error(rt + "Object expected: " + a);
    return {
      DECIMAL_PLACES: o,
      ROUNDING_MODE: l,
      EXPONENTIAL_AT: [f, u],
      RANGE: [g, E],
      CRYPTO: b,
      MODULO_MODE: O,
      POW_PRECISION: T,
      FORMAT: P,
      ALPHABET: M
    };
  }, c.isBigNumber = function(a) {
    if (!a || a._isBigNumber !== !0) return !1;
    if (!c.DEBUG) return !0;
    var h, p, y = a.c, w = a.e, v = a.s;
    t: if ({}.toString.call(y) == "[object Array]") {
      if ((v === 1 || v === -1) && w >= -tt && w <= tt && w === ot(w)) {
        if (y[0] === 0) {
          if (w === 0 && y.length === 1) return !0;
          break t;
        }
        if (h = (w + 1) % q, h < 1 && (h += q), String(y[0]).length == h) {
          for (h = 0; h < y.length; h++)
            if (p = y[h], p < 0 || p >= ht || p !== ot(p)) break t;
          if (p !== 0) return !0;
        }
      }
    } else if (y === null && w === null && (v === null || v === 1 || v === -1))
      return !0;
    throw Error(rt + "Invalid BigNumber: " + a);
  }, c.maximum = c.max = function() {
    return d(arguments, -1);
  }, c.minimum = c.min = function() {
    return d(arguments, 1);
  }, c.random = function() {
    var a = 9007199254740992, h = Math.random() * a & 2097151 ? function() {
      return ot(Math.random() * a);
    } : function() {
      return (Math.random() * 1073741824 | 0) * 8388608 + (Math.random() * 8388608 | 0);
    };
    return function(p) {
      var y, w, v, k, x, S = 0, A = [], _ = new c(s);
      if (p == null ? p = o : H(p, 0, tt), k = le(p / q), b)
        if (crypto.getRandomValues) {
          for (y = crypto.getRandomValues(new Uint32Array(k *= 2)); S < k; )
            x = y[S] * 131072 + (y[S + 1] >>> 11), x >= 9e15 ? (w = crypto.getRandomValues(new Uint32Array(2)), y[S] = w[0], y[S + 1] = w[1]) : (A.push(x % 1e14), S += 2);
          S = k / 2;
        } else if (crypto.randomBytes) {
          for (y = crypto.randomBytes(k *= 7); S < k; )
            x = (y[S] & 31) * 281474976710656 + y[S + 1] * 1099511627776 + y[S + 2] * 4294967296 + y[S + 3] * 16777216 + (y[S + 4] << 16) + (y[S + 5] << 8) + y[S + 6], x >= 9e15 ? crypto.randomBytes(7).copy(y, S) : (A.push(x % 1e14), S += 7);
          S = k / 7;
        } else
          throw b = !1, Error(rt + "crypto unavailable");
      if (!b)
        for (; S < k; )
          x = h(), x < 9e15 && (A[S++] = x % 1e14);
      for (k = A[--S], p %= q, k && p && (x = fe[q - p], A[S] = ot(k / x) * x); A[S] === 0; A.pop(), S--) ;
      if (S < 0)
        A = [v = 0];
      else {
        for (v = -1; A[0] === 0; A.splice(0, 1), v -= q) ;
        for (S = 1, x = A[0]; x >= 10; x /= 10, S++) ;
        S < q && (v -= q - S);
      }
      return _.e = v, _.c = A, _;
    };
  }(), c.sum = function() {
    for (var a = 1, h = arguments, p = new c(h[0]); a < h.length; ) p = p.plus(h[a++]);
    return p;
  }, e = /* @__PURE__ */ function() {
    var a = "0123456789";
    function h(p, y, w, v) {
      for (var k, x = [0], S, A = 0, _ = p.length; A < _; ) {
        for (S = x.length; S--; x[S] *= y) ;
        for (x[0] += v.indexOf(p.charAt(A++)), k = 0; k < x.length; k++)
          x[k] > w - 1 && (x[k + 1] == null && (x[k + 1] = 0), x[k + 1] += x[k] / w | 0, x[k] %= w);
      }
      return x.reverse();
    }
    return function(p, y, w, v, k) {
      var x, S, A, _, L, C, Y, D, z = p.indexOf("."), G = o, U = l;
      for (z >= 0 && (_ = T, T = 0, p = p.replace(".", ""), D = new c(y), C = D.pow(p.length - z), T = _, D.c = h(
        dt(st(C.c), C.e, "0"),
        10,
        w,
        a
      ), D.e = D.c.length), Y = h(p, y, w, k ? (x = M, a) : (x = a, M)), A = _ = Y.length; Y[--_] == 0; Y.pop()) ;
      if (!Y[0]) return x.charAt(0);
      if (z < 0 ? --A : (C.c = Y, C.e = A, C.s = v, C = t(C, D, G, U, w), Y = C.c, L = C.r, A = C.e), S = A + G + 1, z = Y[S], _ = w / 2, L = L || S < 0 || Y[S + 1] != null, L = U < 4 ? (z != null || L) && (U == 0 || U == (C.s < 0 ? 3 : 2)) : z > _ || z == _ && (U == 4 || L || U == 6 && Y[S - 1] & 1 || U == (C.s < 0 ? 8 : 7)), S < 1 || !Y[0])
        p = L ? dt(x.charAt(1), -G, x.charAt(0)) : x.charAt(0);
      else {
        if (Y.length = S, L)
          for (--w; ++Y[--S] > w; )
            Y[S] = 0, S || (++A, Y = [1].concat(Y));
        for (_ = Y.length; !Y[--_]; ) ;
        for (z = 0, p = ""; z <= _; p += x.charAt(Y[z++])) ;
        p = dt(p, A, x.charAt(0));
      }
      return p;
    };
  }(), t = /* @__PURE__ */ function() {
    function a(y, w, v) {
      var k, x, S, A, _ = 0, L = y.length, C = w % vt, Y = w / vt | 0;
      for (y = y.slice(); L--; )
        S = y[L] % vt, A = y[L] / vt | 0, k = Y * S + A * C, x = C * S + k % vt * vt + _, _ = (x / v | 0) + (k / vt | 0) + Y * A, y[L] = x % v;
      return _ && (y = [_].concat(y)), y;
    }
    function h(y, w, v, k) {
      var x, S;
      if (v != k)
        S = v > k ? 1 : -1;
      else
        for (x = S = 0; x < v; x++)
          if (y[x] != w[x]) {
            S = y[x] > w[x] ? 1 : -1;
            break;
          }
      return S;
    }
    function p(y, w, v, k) {
      for (var x = 0; v--; )
        y[v] -= x, x = y[v] < w[v] ? 1 : 0, y[v] = x * k + y[v] - w[v];
      for (; !y[0] && y.length > 1; y.splice(0, 1)) ;
    }
    return function(y, w, v, k, x) {
      var S, A, _, L, C, Y, D, z, G, U, F, V, et, Z, nt, J, it, K = y.s == w.s ? 1 : -1, W = y.c, j = w.c;
      if (!W || !W[0] || !j || !j[0])
        return new c(
          // Return NaN if either NaN, or both Infinity or 0.
          !y.s || !w.s || (W ? j && W[0] == j[0] : !j) ? NaN : (
            // Return ±0 if x is ±0 or y is ±Infinity, or return ±Infinity as y is ±0.
            W && W[0] == 0 || !j ? K * 0 : K / 0
          )
        );
      for (z = new c(K), G = z.c = [], A = y.e - w.e, K = v + A + 1, x || (x = ht, A = lt(y.e / q) - lt(w.e / q), K = K / q | 0), _ = 0; j[_] == (W[_] || 0); _++) ;
      if (j[_] > (W[_] || 0) && A--, K < 0)
        G.push(1), L = !0;
      else {
        for (Z = W.length, J = j.length, _ = 0, K += 2, C = ot(x / (j[0] + 1)), C > 1 && (j = a(j, C, x), W = a(W, C, x), J = j.length, Z = W.length), et = J, U = W.slice(0, J), F = U.length; F < J; U[F++] = 0) ;
        it = j.slice(), it = [0].concat(it), nt = j[0], j[1] >= x / 2 && nt++;
        do {
          if (C = 0, S = h(j, U, J, F), S < 0) {
            if (V = U[0], J != F && (V = V * x + (U[1] || 0)), C = ot(V / nt), C > 1)
              for (C >= x && (C = x - 1), Y = a(j, C, x), D = Y.length, F = U.length; h(Y, U, D, F) == 1; )
                C--, p(Y, J < D ? it : j, D, x), D = Y.length, S = 1;
            else
              C == 0 && (S = C = 1), Y = j.slice(), D = Y.length;
            if (D < F && (Y = [0].concat(Y)), p(U, Y, F, x), F = U.length, S == -1)
              for (; h(j, U, J, F) < 1; )
                C++, p(U, J < F ? it : j, F, x), F = U.length;
          } else S === 0 && (C++, U = [0]);
          G[_++] = C, U[0] ? U[F++] = W[et] || 0 : (U = [W[et]], F = 1);
        } while ((et++ < Z || U[0] != null) && K--);
        L = U[0] != null, G[0] || G.splice(0, 1);
      }
      if (x == ht) {
        for (_ = 1, K = G[0]; K >= 10; K /= 10, _++) ;
        N(z, v + (z.e = _ + A * q - 1) + 1, k, L);
      } else
        z.e = A, z.r = +L;
      return z;
    };
  }();
  function m(a, h, p, y) {
    var w, v, k, x, S;
    if (p == null ? p = l : H(p, 0, 8), !a.c) return a.toString();
    if (w = a.c[0], k = a.e, h == null)
      S = st(a.c), S = y == 1 || y == 2 && (k <= f || k >= u) ? Rt(S, k) : dt(S, k, "0");
    else if (a = N(new c(a), h, p), v = a.e, S = st(a.c), x = S.length, y == 1 || y == 2 && (h <= v || v <= f)) {
      for (; x < h; S += "0", x++) ;
      S = Rt(S, v);
    } else if (h -= k, S = dt(S, v, "0"), v + 1 > x) {
      if (--h > 0) for (S += "."; h--; S += "0") ;
    } else if (h += v - x, h > 0)
      for (v + 1 == x && (S += "."); h--; S += "0") ;
    return a.s < 0 && w ? "-" + S : S;
  }
  function d(a, h) {
    for (var p, y, w = 1, v = new c(a[0]); w < a.length; w++)
      y = new c(a[w]), (!y.s || (p = Et(v, y)) === h || p === 0 && v.s === h) && (v = y);
    return v;
  }
  function I(a, h, p) {
    for (var y = 1, w = h.length; !h[--w]; h.pop()) ;
    for (w = h[0]; w >= 10; w /= 10, y++) ;
    return (p = y + p * q - 1) > E ? a.c = a.e = null : p < g ? a.c = [a.e = 0] : (a.e = p, a.c = h), a;
  }
  n = /* @__PURE__ */ function() {
    var a = /^(-?)0([xbo])(?=\w[\w.]*$)/i, h = /^([^.]+)\.$/, p = /^\.([^.]+)$/, y = /^-?(Infinity|NaN)$/, w = /^\s*\+(?=[\w.])|^\s+|\s+$/g;
    return function(v, k, x, S) {
      var A, _ = x ? k : k.replace(w, "");
      if (y.test(_))
        v.s = isNaN(_) ? null : _ < 0 ? -1 : 1;
      else {
        if (!x && (_ = _.replace(a, function(L, C, Y) {
          return A = (Y = Y.toLowerCase()) == "x" ? 16 : Y == "b" ? 2 : 8, !S || S == A ? C : L;
        }), S && (A = S, _ = _.replace(h, "$1").replace(p, "0.$1")), k != _))
          return new c(_, A);
        if (c.DEBUG)
          throw Error(rt + "Not a" + (S ? " base " + S : "") + " number: " + k);
        v.s = null;
      }
      v.c = v.e = null;
    };
  }();
  function N(a, h, p, y) {
    var w, v, k, x, S, A, _, L = a.c, C = fe;
    if (L) {
      t: {
        for (w = 1, x = L[0]; x >= 10; x /= 10, w++) ;
        if (v = h - w, v < 0)
          v += q, k = h, S = L[A = 0], _ = ot(S / C[w - k - 1] % 10);
        else if (A = le((v + 1) / q), A >= L.length)
          if (y) {
            for (; L.length <= A; L.push(0)) ;
            S = _ = 0, w = 1, v %= q, k = v - q + 1;
          } else
            break t;
        else {
          for (S = x = L[A], w = 1; x >= 10; x /= 10, w++) ;
          v %= q, k = v - q + w, _ = k < 0 ? 0 : ot(S / C[w - k - 1] % 10);
        }
        if (y = y || h < 0 || // Are there any non-zero digits after the rounding digit?
        // The expression  n % pows10[d - j - 1]  returns all digits of n to the right
        // of the digit at j, e.g. if n is 908714 and j is 2, the expression gives 714.
        L[A + 1] != null || (k < 0 ? S : S % C[w - k - 1]), y = p < 4 ? (_ || y) && (p == 0 || p == (a.s < 0 ? 3 : 2)) : _ > 5 || _ == 5 && (p == 4 || y || p == 6 && // Check whether the digit to the left of the rounding digit is odd.
        (v > 0 ? k > 0 ? S / C[w - k] : 0 : L[A - 1]) % 10 & 1 || p == (a.s < 0 ? 8 : 7)), h < 1 || !L[0])
          return L.length = 0, y ? (h -= a.e + 1, L[0] = C[(q - h % q) % q], a.e = -h || 0) : L[0] = a.e = 0, a;
        if (v == 0 ? (L.length = A, x = 1, A--) : (L.length = A + 1, x = C[q - v], L[A] = k > 0 ? ot(S / C[w - k] % C[k]) * x : 0), y)
          for (; ; )
            if (A == 0) {
              for (v = 1, k = L[0]; k >= 10; k /= 10, v++) ;
              for (k = L[0] += x, x = 1; k >= 10; k /= 10, x++) ;
              v != x && (a.e++, L[0] == ht && (L[0] = 1));
              break;
            } else {
              if (L[A] += x, L[A] != ht) break;
              L[A--] = 0, x = 1;
            }
        for (v = L.length; L[--v] === 0; L.pop()) ;
      }
      a.e > E ? a.c = a.e = null : a.e < g && (a.c = [a.e = 0]);
    }
    return a;
  }
  function R(a) {
    var h, p = a.e;
    return p === null ? a.toString() : (h = st(a.c), h = p <= f || p >= u ? Rt(h, p) : dt(h, p, "0"), a.s < 0 ? "-" + h : h);
  }
  return r.absoluteValue = r.abs = function() {
    var a = new c(this);
    return a.s < 0 && (a.s = 1), a;
  }, r.comparedTo = function(a, h) {
    return Et(this, new c(a, h));
  }, r.decimalPlaces = r.dp = function(a, h) {
    var p, y, w, v = this;
    if (a != null)
      return H(a, 0, tt), h == null ? h = l : H(h, 0, 8), N(new c(v), a + v.e + 1, h);
    if (!(p = v.c)) return null;
    if (y = ((w = p.length - 1) - lt(this.e / q)) * q, w = p[w]) for (; w % 10 == 0; w /= 10, y--) ;
    return y < 0 && (y = 0), y;
  }, r.dividedBy = r.div = function(a, h) {
    return t(this, new c(a, h), o, l);
  }, r.dividedToIntegerBy = r.idiv = function(a, h) {
    return t(this, new c(a, h), 0, 1);
  }, r.exponentiatedBy = r.pow = function(a, h) {
    var p, y, w, v, k, x, S, A, _, L = this;
    if (a = new c(a), a.c && !a.isInteger())
      throw Error(rt + "Exponent not an integer: " + R(a));
    if (h != null && (h = new c(h)), x = a.e > 14, !L.c || !L.c[0] || L.c[0] == 1 && !L.e && L.c.length == 1 || !a.c || !a.c[0])
      return _ = new c(Math.pow(+R(L), x ? a.s * (2 - Nt(a)) : +R(a))), h ? _.mod(h) : _;
    if (S = a.s < 0, h) {
      if (h.c ? !h.c[0] : !h.s) return new c(NaN);
      y = !S && L.isInteger() && h.isInteger(), y && (L = L.mod(h));
    } else {
      if (a.e > 9 && (L.e > 0 || L.e < -1 || (L.e == 0 ? L.c[0] > 1 || x && L.c[1] >= 24e7 : L.c[0] < 8e13 || x && L.c[0] <= 9999975e7)))
        return v = L.s < 0 && Nt(a) ? -0 : 0, L.e > -1 && (v = 1 / v), new c(S ? 1 / v : v);
      T && (v = le(T / q + 2));
    }
    for (x ? (p = new c(0.5), S && (a.s = 1), A = Nt(a)) : (w = Math.abs(+R(a)), A = w % 2), _ = new c(s); ; ) {
      if (A) {
        if (_ = _.times(L), !_.c) break;
        v ? _.c.length > v && (_.c.length = v) : y && (_ = _.mod(h));
      }
      if (w) {
        if (w = ot(w / 2), w === 0) break;
        A = w % 2;
      } else if (a = a.times(p), N(a, a.e + 1, 1), a.e > 14)
        A = Nt(a);
      else {
        if (w = +R(a), w === 0) break;
        A = w % 2;
      }
      L = L.times(L), v ? L.c && L.c.length > v && (L.c.length = v) : y && (L = L.mod(h));
    }
    return y ? _ : (S && (_ = s.div(_)), h ? _.mod(h) : v ? N(_, T, l, k) : _);
  }, r.integerValue = function(a) {
    var h = new c(this);
    return a == null ? a = l : H(a, 0, 8), N(h, h.e + 1, a);
  }, r.isEqualTo = r.eq = function(a, h) {
    return Et(this, new c(a, h)) === 0;
  }, r.isFinite = function() {
    return !!this.c;
  }, r.isGreaterThan = r.gt = function(a, h) {
    return Et(this, new c(a, h)) > 0;
  }, r.isGreaterThanOrEqualTo = r.gte = function(a, h) {
    return (h = Et(this, new c(a, h))) === 1 || h === 0;
  }, r.isInteger = function() {
    return !!this.c && lt(this.e / q) > this.c.length - 2;
  }, r.isLessThan = r.lt = function(a, h) {
    return Et(this, new c(a, h)) < 0;
  }, r.isLessThanOrEqualTo = r.lte = function(a, h) {
    return (h = Et(this, new c(a, h))) === -1 || h === 0;
  }, r.isNaN = function() {
    return !this.s;
  }, r.isNegative = function() {
    return this.s < 0;
  }, r.isPositive = function() {
    return this.s > 0;
  }, r.isZero = function() {
    return !!this.c && this.c[0] == 0;
  }, r.minus = function(a, h) {
    var p, y, w, v, k = this, x = k.s;
    if (a = new c(a, h), h = a.s, !x || !h) return new c(NaN);
    if (x != h)
      return a.s = -h, k.plus(a);
    var S = k.e / q, A = a.e / q, _ = k.c, L = a.c;
    if (!S || !A) {
      if (!_ || !L) return _ ? (a.s = -h, a) : new c(L ? k : NaN);
      if (!_[0] || !L[0])
        return L[0] ? (a.s = -h, a) : new c(_[0] ? k : (
          // IEEE 754 (2008) 6.3: n - n = -0 when rounding to -Infinity
          l == 3 ? -0 : 0
        ));
    }
    if (S = lt(S), A = lt(A), _ = _.slice(), x = S - A) {
      for ((v = x < 0) ? (x = -x, w = _) : (A = S, w = L), w.reverse(), h = x; h--; w.push(0)) ;
      w.reverse();
    } else
      for (y = (v = (x = _.length) < (h = L.length)) ? x : h, x = h = 0; h < y; h++)
        if (_[h] != L[h]) {
          v = _[h] < L[h];
          break;
        }
    if (v && (w = _, _ = L, L = w, a.s = -a.s), h = (y = L.length) - (p = _.length), h > 0) for (; h--; _[p++] = 0) ;
    for (h = ht - 1; y > x; ) {
      if (_[--y] < L[y]) {
        for (p = y; p && !_[--p]; _[p] = h) ;
        --_[p], _[y] += ht;
      }
      _[y] -= L[y];
    }
    for (; _[0] == 0; _.splice(0, 1), --A) ;
    return _[0] ? I(a, _, A) : (a.s = l == 3 ? -1 : 1, a.c = [a.e = 0], a);
  }, r.modulo = r.mod = function(a, h) {
    var p, y, w = this;
    return a = new c(a, h), !w.c || !a.s || a.c && !a.c[0] ? new c(NaN) : !a.c || w.c && !w.c[0] ? new c(w) : (O == 9 ? (y = a.s, a.s = 1, p = t(w, a, 0, 3), a.s = y, p.s *= y) : p = t(w, a, 0, O), a = w.minus(p.times(a)), !a.c[0] && O == 1 && (a.s = w.s), a);
  }, r.multipliedBy = r.times = function(a, h) {
    var p, y, w, v, k, x, S, A, _, L, C, Y, D, z, G, U = this, F = U.c, V = (a = new c(a, h)).c;
    if (!F || !V || !F[0] || !V[0])
      return !U.s || !a.s || F && !F[0] && !V || V && !V[0] && !F ? a.c = a.e = a.s = null : (a.s *= U.s, !F || !V ? a.c = a.e = null : (a.c = [0], a.e = 0)), a;
    for (y = lt(U.e / q) + lt(a.e / q), a.s *= U.s, S = F.length, L = V.length, S < L && (D = F, F = V, V = D, w = S, S = L, L = w), w = S + L, D = []; w--; D.push(0)) ;
    for (z = ht, G = vt, w = L; --w >= 0; ) {
      for (p = 0, C = V[w] % G, Y = V[w] / G | 0, k = S, v = w + k; v > w; )
        A = F[--k] % G, _ = F[k] / G | 0, x = Y * A + _ * C, A = C * A + x % G * G + D[v] + p, p = (A / z | 0) + (x / G | 0) + Y * _, D[v--] = A % z;
      D[v] = p;
    }
    return p ? ++y : D.splice(0, 1), I(a, D, y);
  }, r.negated = function() {
    var a = new c(this);
    return a.s = -a.s || null, a;
  }, r.plus = function(a, h) {
    var p, y = this, w = y.s;
    if (a = new c(a, h), h = a.s, !w || !h) return new c(NaN);
    if (w != h)
      return a.s = -h, y.minus(a);
    var v = y.e / q, k = a.e / q, x = y.c, S = a.c;
    if (!v || !k) {
      if (!x || !S) return new c(w / 0);
      if (!x[0] || !S[0]) return S[0] ? a : new c(x[0] ? y : w * 0);
    }
    if (v = lt(v), k = lt(k), x = x.slice(), w = v - k) {
      for (w > 0 ? (k = v, p = S) : (w = -w, p = x), p.reverse(); w--; p.push(0)) ;
      p.reverse();
    }
    for (w = x.length, h = S.length, w - h < 0 && (p = S, S = x, x = p, h = w), w = 0; h; )
      w = (x[--h] = x[h] + S[h] + w) / ht | 0, x[h] = ht === x[h] ? 0 : x[h] % ht;
    return w && (x = [w].concat(x), ++k), I(a, x, k);
  }, r.precision = r.sd = function(a, h) {
    var p, y, w, v = this;
    if (a != null && a !== !!a)
      return H(a, 1, tt), h == null ? h = l : H(h, 0, 8), N(new c(v), a, h);
    if (!(p = v.c)) return null;
    if (w = p.length - 1, y = w * q + 1, w = p[w]) {
      for (; w % 10 == 0; w /= 10, y--) ;
      for (w = p[0]; w >= 10; w /= 10, y++) ;
    }
    return a && v.e + 1 > y && (y = v.e + 1), y;
  }, r.shiftedBy = function(a) {
    return H(a, -ae, ae), this.times("1e" + a);
  }, r.squareRoot = r.sqrt = function() {
    var a, h, p, y, w, v = this, k = v.c, x = v.s, S = v.e, A = o + 4, _ = new c("0.5");
    if (x !== 1 || !k || !k[0])
      return new c(!x || x < 0 && (!k || k[0]) ? NaN : k ? v : 1 / 0);
    if (x = Math.sqrt(+R(v)), x == 0 || x == 1 / 0 ? (h = st(k), (h.length + S) % 2 == 0 && (h += "0"), x = Math.sqrt(+h), S = lt((S + 1) / 2) - (S < 0 || S % 2), x == 1 / 0 ? h = "5e" + S : (h = x.toExponential(), h = h.slice(0, h.indexOf("e") + 1) + S), p = new c(h)) : p = new c(x + ""), p.c[0]) {
      for (S = p.e, x = S + A, x < 3 && (x = 0); ; )
        if (w = p, p = _.times(w.plus(t(v, w, A, 1))), st(w.c).slice(0, x) === (h = st(p.c)).slice(0, x))
          if (p.e < S && --x, h = h.slice(x - 3, x + 1), h == "9999" || !y && h == "4999") {
            if (!y && (N(w, w.e + o + 2, 0), w.times(w).eq(v))) {
              p = w;
              break;
            }
            A += 4, x += 4, y = 1;
          } else {
            (!+h || !+h.slice(1) && h.charAt(0) == "5") && (N(p, p.e + o + 2, 1), a = !p.times(p).eq(v));
            break;
          }
    }
    return N(p, p.e + o + 1, l, a);
  }, r.toExponential = function(a, h) {
    return a != null && (H(a, 0, tt), a++), m(this, a, h, 1);
  }, r.toFixed = function(a, h) {
    return a != null && (H(a, 0, tt), a = a + this.e + 1), m(this, a, h);
  }, r.toFormat = function(a, h, p) {
    var y, w = this;
    if (p == null)
      a != null && h && typeof h == "object" ? (p = h, h = null) : a && typeof a == "object" ? (p = a, a = h = null) : p = P;
    else if (typeof p != "object")
      throw Error(rt + "Argument not an object: " + p);
    if (y = w.toFixed(a, h), w.c) {
      var v, k = y.split("."), x = +p.groupSize, S = +p.secondaryGroupSize, A = p.groupSeparator || "", _ = k[0], L = k[1], C = w.s < 0, Y = C ? _.slice(1) : _, D = Y.length;
      if (S && (v = x, x = S, S = v, D -= v), x > 0 && D > 0) {
        for (v = D % x || x, _ = Y.substr(0, v); v < D; v += x) _ += A + Y.substr(v, x);
        S > 0 && (_ += A + Y.slice(v)), C && (_ = "-" + _);
      }
      y = L ? _ + (p.decimalSeparator || "") + ((S = +p.fractionGroupSize) ? L.replace(
        new RegExp("\\d{" + S + "}\\B", "g"),
        "$&" + (p.fractionGroupSeparator || "")
      ) : L) : _;
    }
    return (p.prefix || "") + y + (p.suffix || "");
  }, r.toFraction = function(a) {
    var h, p, y, w, v, k, x, S, A, _, L, C, Y = this, D = Y.c;
    if (a != null && (x = new c(a), !x.isInteger() && (x.c || x.s !== 1) || x.lt(s)))
      throw Error(rt + "Argument " + (x.isInteger() ? "out of range: " : "not an integer: ") + R(x));
    if (!D) return new c(Y);
    for (h = new c(s), A = p = new c(s), y = S = new c(s), C = st(D), v = h.e = C.length - Y.e - 1, h.c[0] = fe[(k = v % q) < 0 ? q + k : k], a = !a || x.comparedTo(h) > 0 ? v > 0 ? h : A : x, k = E, E = 1 / 0, x = new c(C), S.c[0] = 0; _ = t(x, h, 0, 1), w = p.plus(_.times(y)), w.comparedTo(a) != 1; )
      p = y, y = w, A = S.plus(_.times(w = A)), S = w, h = x.minus(_.times(w = h)), x = w;
    return w = t(a.minus(p), y, 0, 1), S = S.plus(w.times(A)), p = p.plus(w.times(y)), S.s = A.s = Y.s, v = v * 2, L = t(A, y, v, l).minus(Y).abs().comparedTo(
      t(S, p, v, l).minus(Y).abs()
    ) < 1 ? [A, y] : [S, p], E = k, L;
  }, r.toNumber = function() {
    return +R(this);
  }, r.toPrecision = function(a, h) {
    return a != null && H(a, 1, tt), m(this, a, h, 2);
  }, r.toString = function(a) {
    var h, p = this, y = p.s, w = p.e;
    return w === null ? y ? (h = "Infinity", y < 0 && (h = "-" + h)) : h = "NaN" : (a == null ? h = w <= f || w >= u ? Rt(st(p.c), w) : dt(st(p.c), w, "0") : a === 10 && B ? (p = N(new c(p), o + w + 1, l), h = dt(st(p.c), p.e, "0")) : (H(a, 2, M.length, "Base"), h = e(dt(st(p.c), w, "0"), 10, a, y, !0)), y < 0 && p.c[0] && (h = "-" + h)), h;
  }, r.valueOf = r.toJSON = function() {
    return R(this);
  }, r._isBigNumber = !0, r[Symbol.toStringTag] = "BigNumber", r[Symbol.for("nodejs.util.inspect.custom")] = r.valueOf, i != null && c.set(i), c;
}
function lt(i) {
  var t = i | 0;
  return i > 0 || i === t ? t : t - 1;
}
function st(i) {
  for (var t, e, n = 1, r = i.length, s = i[0] + ""; n < r; ) {
    for (t = i[n++] + "", e = q - t.length; e--; t = "0" + t) ;
    s += t;
  }
  for (r = s.length; s.charCodeAt(--r) === 48; ) ;
  return s.slice(0, r + 1 || 1);
}
function Et(i, t) {
  var e, n, r = i.c, s = t.c, o = i.s, l = t.s, f = i.e, u = t.e;
  if (!o || !l) return null;
  if (e = r && !r[0], n = s && !s[0], e || n) return e ? n ? 0 : -l : o;
  if (o != l) return o;
  if (e = o < 0, n = f == u, !r || !s) return n ? 0 : !r ^ e ? 1 : -1;
  if (!n) return f > u ^ e ? 1 : -1;
  for (l = (f = r.length) < (u = s.length) ? f : u, o = 0; o < l; o++) if (r[o] != s[o]) return r[o] > s[o] ^ e ? 1 : -1;
  return f == u ? 0 : f > u ^ e ? 1 : -1;
}
function H(i, t, e, n) {
  if (i < t || i > e || i !== ot(i))
    throw Error(rt + (n || "Argument") + (typeof i == "number" ? i < t || i > e ? " out of range: " : " not an integer: " : " not a primitive number: ") + String(i));
}
function Nt(i) {
  var t = i.c.length - 1;
  return lt(i.e / q) == t && i.c[t] % 2 != 0;
}
function Rt(i, t) {
  return (i.length > 1 ? i.charAt(0) + "." + i.slice(1) : i) + (t < 0 ? "e" : "e+") + t;
}
function dt(i, t, e) {
  var n, r;
  if (t < 0) {
    for (r = e + "."; ++t; r += e) ;
    i = r + i;
  } else if (n = i.length, ++t > n) {
    for (r = e, t -= n; --t; r += e) ;
    i += r;
  } else t < n && (i = i.slice(0, t) + "." + i.slice(t));
  return i;
}
var gt = rn(), ti = class {
  constructor(i) {
    X(this, "key");
    X(this, "left", null);
    X(this, "right", null);
    this.key = i;
  }
}, kt = class extends ti {
  constructor(i) {
    super(i);
  }
}, ei = class {
  constructor() {
    X(this, "size", 0);
    X(this, "modificationCount", 0);
    X(this, "splayCount", 0);
  }
  splay(i) {
    const t = this.root;
    if (t == null)
      return this.compare(i, i), -1;
    let e = null, n = null, r = null, s = null, o = t;
    const l = this.compare;
    let f;
    for (; ; )
      if (f = l(o.key, i), f > 0) {
        let u = o.left;
        if (u == null || (f = l(u.key, i), f > 0 && (o.left = u.right, u.right = o, o = u, u = o.left, u == null)))
          break;
        e == null ? n = o : e.left = o, e = o, o = u;
      } else if (f < 0) {
        let u = o.right;
        if (u == null || (f = l(u.key, i), f < 0 && (o.right = u.left, u.left = o, o = u, u = o.right, u == null)))
          break;
        r == null ? s = o : r.right = o, r = o, o = u;
      } else
        break;
    return r != null && (r.right = o.left, o.left = s), e != null && (e.left = o.right, o.right = n), this.root !== o && (this.root = o, this.splayCount++), f;
  }
  splayMin(i) {
    let t = i, e = t.left;
    for (; e != null; ) {
      const n = e;
      t.left = n.right, n.right = t, t = n, e = t.left;
    }
    return t;
  }
  splayMax(i) {
    let t = i, e = t.right;
    for (; e != null; ) {
      const n = e;
      t.right = n.left, n.left = t, t = n, e = t.right;
    }
    return t;
  }
  _delete(i) {
    if (this.root == null || this.splay(i) != 0) return null;
    let e = this.root;
    const n = e, r = e.left;
    if (this.size--, r == null)
      this.root = e.right;
    else {
      const s = e.right;
      e = this.splayMax(r), e.right = s, this.root = e;
    }
    return this.modificationCount++, n;
  }
  addNewRoot(i, t) {
    this.size++, this.modificationCount++;
    const e = this.root;
    if (e == null) {
      this.root = i;
      return;
    }
    t < 0 ? (i.left = e, i.right = e.right, e.right = null) : (i.right = e, i.left = e.left, e.left = null), this.root = i;
  }
  _first() {
    const i = this.root;
    return i == null ? null : (this.root = this.splayMin(i), this.root);
  }
  _last() {
    const i = this.root;
    return i == null ? null : (this.root = this.splayMax(i), this.root);
  }
  clear() {
    this.root = null, this.size = 0, this.modificationCount++;
  }
  has(i) {
    return this.validKey(i) && this.splay(i) == 0;
  }
  defaultCompare() {
    return (i, t) => i < t ? -1 : i > t ? 1 : 0;
  }
  wrap() {
    return {
      getRoot: () => this.root,
      setRoot: (i) => {
        this.root = i;
      },
      getSize: () => this.size,
      getModificationCount: () => this.modificationCount,
      getSplayCount: () => this.splayCount,
      setSplayCount: (i) => {
        this.splayCount = i;
      },
      splay: (i) => this.splay(i),
      has: (i) => this.has(i)
    };
  }
}, Je, He, Jt = class At extends ei {
  constructor(e, n) {
    super();
    X(this, "root", null);
    X(this, "compare");
    X(this, "validKey");
    X(this, Je, "[object Set]");
    this.compare = e ?? this.defaultCompare(), this.validKey = n ?? ((r) => r != null && r != null);
  }
  delete(e) {
    return this.validKey(e) ? this._delete(e) != null : !1;
  }
  deleteAll(e) {
    for (const n of e)
      this.delete(n);
  }
  forEach(e) {
    const n = this[Symbol.iterator]();
    let r;
    for (; r = n.next(), !r.done; )
      e(r.value, r.value, this);
  }
  add(e) {
    const n = this.splay(e);
    return n != 0 && this.addNewRoot(new kt(e), n), this;
  }
  addAndReturn(e) {
    const n = this.splay(e);
    return n != 0 && this.addNewRoot(new kt(e), n), this.root.key;
  }
  addAll(e) {
    for (const n of e)
      this.add(n);
  }
  isEmpty() {
    return this.root == null;
  }
  isNotEmpty() {
    return this.root != null;
  }
  single() {
    if (this.size == 0) throw "Bad state: No element";
    if (this.size > 1) throw "Bad state: Too many element";
    return this.root.key;
  }
  first() {
    if (this.size == 0) throw "Bad state: No element";
    return this._first().key;
  }
  last() {
    if (this.size == 0) throw "Bad state: No element";
    return this._last().key;
  }
  lastBefore(e) {
    if (e == null) throw "Invalid arguments(s)";
    if (this.root == null) return null;
    if (this.splay(e) < 0) return this.root.key;
    let r = this.root.left;
    if (r == null) return null;
    let s = r.right;
    for (; s != null; )
      r = s, s = r.right;
    return r.key;
  }
  firstAfter(e) {
    if (e == null) throw "Invalid arguments(s)";
    if (this.root == null) return null;
    if (this.splay(e) > 0) return this.root.key;
    let r = this.root.right;
    if (r == null) return null;
    let s = r.left;
    for (; s != null; )
      r = s, s = r.left;
    return r.key;
  }
  retainAll(e) {
    const n = new At(this.compare, this.validKey), r = this.modificationCount;
    for (const s of e) {
      if (r != this.modificationCount)
        throw "Concurrent modification during iteration.";
      this.validKey(s) && this.splay(s) == 0 && n.add(this.root.key);
    }
    n.size != this.size && (this.root = n.root, this.size = n.size, this.modificationCount++);
  }
  lookup(e) {
    return !this.validKey(e) || this.splay(e) != 0 ? null : this.root.key;
  }
  intersection(e) {
    const n = new At(this.compare, this.validKey);
    for (const r of this)
      e.has(r) && n.add(r);
    return n;
  }
  difference(e) {
    const n = new At(this.compare, this.validKey);
    for (const r of this)
      e.has(r) || n.add(r);
    return n;
  }
  union(e) {
    const n = this.clone();
    return n.addAll(e), n;
  }
  clone() {
    const e = new At(this.compare, this.validKey);
    return e.size = this.size, e.root = this.copyNode(this.root), e;
  }
  copyNode(e) {
    if (e == null) return null;
    function n(s, o) {
      let l, f;
      do {
        if (l = s.left, f = s.right, l != null) {
          const u = new kt(l.key);
          o.left = u, n(l, u);
        }
        if (f != null) {
          const u = new kt(f.key);
          o.right = u, s = f, o = u;
        }
      } while (f != null);
    }
    const r = new kt(e.key);
    return n(e, r), r;
  }
  toSet() {
    return this.clone();
  }
  entries() {
    return new ii(this.wrap());
  }
  keys() {
    return this[Symbol.iterator]();
  }
  values() {
    return this[Symbol.iterator]();
  }
  [(He = Symbol.iterator, Je = Symbol.toStringTag, He)]() {
    return new ni(this.wrap());
  }
}, sn = class {
  constructor(i) {
    X(this, "tree");
    X(this, "path", new Array());
    X(this, "modificationCount", null);
    X(this, "splayCount");
    this.tree = i, this.splayCount = i.getSplayCount();
  }
  [Symbol.iterator]() {
    return this;
  }
  next() {
    return this.moveNext() ? { done: !1, value: this.current() } : { done: !0, value: null };
  }
  current() {
    if (!this.path.length) return null;
    const i = this.path[this.path.length - 1];
    return this.getValue(i);
  }
  rebuildPath(i) {
    this.path.splice(0, this.path.length), this.tree.splay(i), this.path.push(this.tree.getRoot()), this.splayCount = this.tree.getSplayCount();
  }
  findLeftMostDescendent(i) {
    for (; i != null; )
      this.path.push(i), i = i.left;
  }
  moveNext() {
    if (this.modificationCount != this.tree.getModificationCount()) {
      if (this.modificationCount == null) {
        this.modificationCount = this.tree.getModificationCount();
        let e = this.tree.getRoot();
        for (; e != null; )
          this.path.push(e), e = e.left;
        return this.path.length > 0;
      }
      throw "Concurrent modification during iteration.";
    }
    if (!this.path.length) return !1;
    this.splayCount != this.tree.getSplayCount() && this.rebuildPath(this.path[this.path.length - 1].key);
    let i = this.path[this.path.length - 1], t = i.right;
    if (t != null) {
      for (; t != null; )
        this.path.push(t), t = t.left;
      return !0;
    }
    for (this.path.pop(); this.path.length && this.path[this.path.length - 1].right === i; )
      i = this.path.pop();
    return this.path.length > 0;
  }
}, ni = class extends sn {
  getValue(i) {
    return i.key;
  }
}, ii = class extends sn {
  getValue(i) {
    return [i.key, i.key];
  }
}, on = (i) => () => i, he = (i) => {
  const t = i ? (e, n) => n.minus(e).abs().isLessThanOrEqualTo(i) : on(!1);
  return (e, n) => t(e, n) ? 0 : e.comparedTo(n);
};
function ri(i) {
  const t = i ? (e, n, r, s, o) => e.exponentiatedBy(2).isLessThanOrEqualTo(
    s.minus(n).exponentiatedBy(2).plus(o.minus(r).exponentiatedBy(2)).times(i)
  ) : on(!1);
  return (e, n, r) => {
    const s = e.x, o = e.y, l = r.x, f = r.y, u = o.minus(f).times(n.x.minus(l)).minus(s.minus(l).times(n.y.minus(f)));
    return t(u, s, o, l, f) ? 0 : u.comparedTo(0);
  };
}
var si = (i) => i, oi = (i) => {
  if (i) {
    const t = new Jt(he(i)), e = new Jt(he(i)), n = (s, o) => o.addAndReturn(s), r = (s) => ({
      x: n(s.x, t),
      y: n(s.y, e)
    });
    return r({ x: new gt(0), y: new gt(0) }), r;
  }
  return si;
}, ce = (i) => ({
  set: (t) => {
    yt = ce(t);
  },
  reset: () => ce(i),
  compare: he(i),
  snap: oi(i),
  orient: ri(i)
}), yt = ce(), Tt = (i, t) => i.ll.x.isLessThanOrEqualTo(t.x) && t.x.isLessThanOrEqualTo(i.ur.x) && i.ll.y.isLessThanOrEqualTo(t.y) && t.y.isLessThanOrEqualTo(i.ur.y), pe = (i, t) => {
  if (t.ur.x.isLessThan(i.ll.x) || i.ur.x.isLessThan(t.ll.x) || t.ur.y.isLessThan(i.ll.y) || i.ur.y.isLessThan(t.ll.y))
    return null;
  const e = i.ll.x.isLessThan(t.ll.x) ? t.ll.x : i.ll.x, n = i.ur.x.isLessThan(t.ur.x) ? i.ur.x : t.ur.x, r = i.ll.y.isLessThan(t.ll.y) ? t.ll.y : i.ll.y, s = i.ur.y.isLessThan(t.ur.y) ? i.ur.y : t.ur.y;
  return { ll: { x: e, y: r }, ur: { x: n, y: s } };
}, Wt = (i, t) => i.x.times(t.y).minus(i.y.times(t.x)), ln = (i, t) => i.x.times(t.x).plus(i.y.times(t.y)), Ht = (i) => ln(i, i).sqrt(), li = (i, t, e) => {
  const n = { x: t.x.minus(i.x), y: t.y.minus(i.y) }, r = { x: e.x.minus(i.x), y: e.y.minus(i.y) };
  return Wt(r, n).div(Ht(r)).div(Ht(n));
}, ai = (i, t, e) => {
  const n = { x: t.x.minus(i.x), y: t.y.minus(i.y) }, r = { x: e.x.minus(i.x), y: e.y.minus(i.y) };
  return ln(r, n).div(Ht(r)).div(Ht(n));
}, Be = (i, t, e) => t.y.isZero() ? null : { x: i.x.plus(t.x.div(t.y).times(e.minus(i.y))), y: e }, Ne = (i, t, e) => t.x.isZero() ? null : { x: e, y: i.y.plus(t.y.div(t.x).times(e.minus(i.x))) }, fi = (i, t, e, n) => {
  if (t.x.isZero()) return Ne(e, n, i.x);
  if (n.x.isZero()) return Ne(i, t, e.x);
  if (t.y.isZero()) return Be(e, n, i.y);
  if (n.y.isZero()) return Be(i, t, e.y);
  const r = Wt(t, n);
  if (r.isZero()) return null;
  const s = { x: e.x.minus(i.x), y: e.y.minus(i.y) }, o = Wt(s, t).div(r), l = Wt(s, n).div(r), f = i.x.plus(l.times(t.x)), u = e.x.plus(o.times(n.x)), g = i.y.plus(l.times(t.y)), E = e.y.plus(o.times(n.y)), b = f.plus(u).div(2), O = g.plus(E).div(2);
  return { x: b, y: O };
}, pt = class an {
  // Warning: 'point' input will be modified and re-used (for performance)
  constructor(t, e) {
    X(this, "point");
    X(this, "isLeft");
    X(this, "segment");
    X(this, "otherSE");
    X(this, "consumedBy");
    t.events === void 0 ? t.events = [this] : t.events.push(this), this.point = t, this.isLeft = e;
  }
  // for ordering sweep events in the sweep event queue
  static compare(t, e) {
    const n = an.comparePoints(t.point, e.point);
    return n !== 0 ? n : (t.point !== e.point && t.link(e), t.isLeft !== e.isLeft ? t.isLeft ? 1 : -1 : Zt.compare(t.segment, e.segment));
  }
  // for ordering points in sweep line order
  static comparePoints(t, e) {
    return t.x.isLessThan(e.x) ? -1 : t.x.isGreaterThan(e.x) ? 1 : t.y.isLessThan(e.y) ? -1 : t.y.isGreaterThan(e.y) ? 1 : 0;
  }
  link(t) {
    if (t.point === this.point)
      throw new Error("Tried to link already linked events");
    const e = t.point.events;
    for (let n = 0, r = e.length; n < r; n++) {
      const s = e[n];
      this.point.events.push(s), s.point = this.point;
    }
    this.checkForConsuming();
  }
  /* Do a pass over our linked events and check to see if any pair
   * of segments match, and should be consumed. */
  checkForConsuming() {
    const t = this.point.events.length;
    for (let e = 0; e < t; e++) {
      const n = this.point.events[e];
      if (n.segment.consumedBy === void 0)
        for (let r = e + 1; r < t; r++) {
          const s = this.point.events[r];
          s.consumedBy === void 0 && n.otherSE.point.events === s.otherSE.point.events && n.segment.consume(s.segment);
        }
    }
  }
  getAvailableLinkedEvents() {
    const t = [];
    for (let e = 0, n = this.point.events.length; e < n; e++) {
      const r = this.point.events[e];
      r !== this && !r.segment.ringOut && r.segment.isInResult() && t.push(r);
    }
    return t;
  }
  /**
   * Returns a comparator function for sorting linked events that will
   * favor the event that will give us the smallest left-side angle.
   * All ring construction starts as low as possible heading to the right,
   * so by always turning left as sharp as possible we'll get polygons
   * without uncessary loops & holes.
   *
   * The comparator function has a compute cache such that it avoids
   * re-computing already-computed values.
   */
  getLeftmostComparator(t) {
    const e = /* @__PURE__ */ new Map(), n = (r) => {
      const s = r.otherSE;
      e.set(r, {
        sine: li(this.point, t.point, s.point),
        cosine: ai(this.point, t.point, s.point)
      });
    };
    return (r, s) => {
      e.has(r) || n(r), e.has(s) || n(s);
      const { sine: o, cosine: l } = e.get(r), { sine: f, cosine: u } = e.get(s);
      return o.isGreaterThanOrEqualTo(0) && f.isGreaterThanOrEqualTo(0) ? l.isLessThan(u) ? 1 : l.isGreaterThan(u) ? -1 : 0 : o.isLessThan(0) && f.isLessThan(0) ? l.isLessThan(u) ? -1 : l.isGreaterThan(u) ? 1 : 0 : f.isLessThan(o) ? -1 : f.isGreaterThan(o) ? 1 : 0;
    };
  }
}, ui = class ge {
  constructor(t) {
    X(this, "events");
    X(this, "poly");
    X(this, "_isExteriorRing");
    X(this, "_enclosingRing");
    this.events = t;
    for (let e = 0, n = t.length; e < n; e++)
      t[e].segment.ringOut = this;
    this.poly = null;
  }
  /* Given the segments from the sweep line pass, compute & return a series
   * of closed rings from all the segments marked to be part of the result */
  static factory(t) {
    const e = [];
    for (let n = 0, r = t.length; n < r; n++) {
      const s = t[n];
      if (!s.isInResult() || s.ringOut) continue;
      let o = null, l = s.leftSE, f = s.rightSE;
      const u = [l], g = l.point, E = [];
      for (; o = l, l = f, u.push(l), l.point !== g; )
        for (; ; ) {
          const b = l.getAvailableLinkedEvents();
          if (b.length === 0) {
            const P = u[0].point, M = u[u.length - 1].point;
            throw new Error(
              `Unable to complete output ring starting at [${P.x}, ${P.y}]. Last matching segment found ends at [${M.x}, ${M.y}].`
            );
          }
          if (b.length === 1) {
            f = b[0].otherSE;
            break;
          }
          let O = null;
          for (let P = 0, M = E.length; P < M; P++)
            if (E[P].point === l.point) {
              O = P;
              break;
            }
          if (O !== null) {
            const P = E.splice(O)[0], M = u.splice(P.index);
            M.unshift(M[0].otherSE), e.push(new ge(M.reverse()));
            continue;
          }
          E.push({
            index: u.length,
            point: l.point
          });
          const T = l.getLeftmostComparator(o);
          f = b.sort(T)[0].otherSE;
          break;
        }
      e.push(new ge(u));
    }
    return e;
  }
  getGeom() {
    let t = this.events[0].point;
    const e = [t];
    for (let u = 1, g = this.events.length - 1; u < g; u++) {
      const E = this.events[u].point, b = this.events[u + 1].point;
      yt.orient(E, t, b) !== 0 && (e.push(E), t = E);
    }
    if (e.length === 1) return null;
    const n = e[0], r = e[1];
    yt.orient(n, t, r) === 0 && e.shift(), e.push(e[0]);
    const s = this.isExteriorRing() ? 1 : -1, o = this.isExteriorRing() ? 0 : e.length - 1, l = this.isExteriorRing() ? e.length : -1, f = [];
    for (let u = o; u != l; u += s)
      f.push([e[u].x.toNumber(), e[u].y.toNumber()]);
    return f;
  }
  isExteriorRing() {
    if (this._isExteriorRing === void 0) {
      const t = this.enclosingRing();
      this._isExteriorRing = t ? !t.isExteriorRing() : !0;
    }
    return this._isExteriorRing;
  }
  enclosingRing() {
    return this._enclosingRing === void 0 && (this._enclosingRing = this._calcEnclosingRing()), this._enclosingRing;
  }
  /* Returns the ring that encloses this one, if any */
  _calcEnclosingRing() {
    var r, s;
    let t = this.events[0];
    for (let o = 1, l = this.events.length; o < l; o++) {
      const f = this.events[o];
      pt.compare(t, f) > 0 && (t = f);
    }
    let e = t.segment.prevInResult(), n = e ? e.prevInResult() : null;
    for (; ; ) {
      if (!e) return null;
      if (!n) return e.ringOut;
      if (n.ringOut !== e.ringOut)
        return ((r = n.ringOut) == null ? void 0 : r.enclosingRing()) !== e.ringOut ? e.ringOut : (s = e.ringOut) == null ? void 0 : s.enclosingRing();
      e = n.prevInResult(), n = e ? e.prevInResult() : null;
    }
  }
}, Re = class {
  constructor(i) {
    X(this, "exteriorRing");
    X(this, "interiorRings");
    this.exteriorRing = i, i.poly = this, this.interiorRings = [];
  }
  addInterior(i) {
    this.interiorRings.push(i), i.poly = this;
  }
  getGeom() {
    const i = this.exteriorRing.getGeom();
    if (i === null) return null;
    const t = [i];
    for (let e = 0, n = this.interiorRings.length; e < n; e++) {
      const r = this.interiorRings[e].getGeom();
      r !== null && t.push(r);
    }
    return t;
  }
}, hi = class {
  constructor(i) {
    X(this, "rings");
    X(this, "polys");
    this.rings = i, this.polys = this._composePolys(i);
  }
  getGeom() {
    const i = [];
    for (let t = 0, e = this.polys.length; t < e; t++) {
      const n = this.polys[t].getGeom();
      n !== null && i.push(n);
    }
    return i;
  }
  _composePolys(i) {
    var e;
    const t = [];
    for (let n = 0, r = i.length; n < r; n++) {
      const s = i[n];
      if (!s.poly)
        if (s.isExteriorRing()) t.push(new Re(s));
        else {
          const o = s.enclosingRing();
          o != null && o.poly || t.push(new Re(o)), (e = o == null ? void 0 : o.poly) == null || e.addInterior(s);
        }
    }
    return t;
  }
}, ci = class {
  constructor(i, t = Zt.compare) {
    X(this, "queue");
    X(this, "tree");
    X(this, "segments");
    this.queue = i, this.tree = new Jt(t), this.segments = [];
  }
  process(i) {
    const t = i.segment, e = [];
    if (i.consumedBy)
      return i.isLeft ? this.queue.delete(i.otherSE) : this.tree.delete(t), e;
    i.isLeft && this.tree.add(t);
    let n = t, r = t;
    do
      n = this.tree.lastBefore(n);
    while (n != null && n.consumedBy != null);
    do
      r = this.tree.firstAfter(r);
    while (r != null && r.consumedBy != null);
    if (i.isLeft) {
      let s = null;
      if (n) {
        const l = n.getIntersection(t);
        if (l !== null && (t.isAnEndpoint(l) || (s = l), !n.isAnEndpoint(l))) {
          const f = this._splitSafely(n, l);
          for (let u = 0, g = f.length; u < g; u++)
            e.push(f[u]);
        }
      }
      let o = null;
      if (r) {
        const l = r.getIntersection(t);
        if (l !== null && (t.isAnEndpoint(l) || (o = l), !r.isAnEndpoint(l))) {
          const f = this._splitSafely(r, l);
          for (let u = 0, g = f.length; u < g; u++)
            e.push(f[u]);
        }
      }
      if (s !== null || o !== null) {
        let l = null;
        s === null ? l = o : o === null ? l = s : l = pt.comparePoints(
          s,
          o
        ) <= 0 ? s : o, this.queue.delete(t.rightSE), e.push(t.rightSE);
        const f = t.split(l);
        for (let u = 0, g = f.length; u < g; u++)
          e.push(f[u]);
      }
      e.length > 0 ? (this.tree.delete(t), e.push(i)) : (this.segments.push(t), t.prev = n);
    } else {
      if (n && r) {
        const s = n.getIntersection(r);
        if (s !== null) {
          if (!n.isAnEndpoint(s)) {
            const o = this._splitSafely(n, s);
            for (let l = 0, f = o.length; l < f; l++)
              e.push(o[l]);
          }
          if (!r.isAnEndpoint(s)) {
            const o = this._splitSafely(r, s);
            for (let l = 0, f = o.length; l < f; l++)
              e.push(o[l]);
          }
        }
      }
      this.tree.delete(t);
    }
    return e;
  }
  /* Safely split a segment that is currently in the datastructures
   * IE - a segment other than the one that is currently being processed. */
  _splitSafely(i, t) {
    this.tree.delete(i);
    const e = i.rightSE;
    this.queue.delete(e);
    const n = i.split(t);
    return n.push(e), i.consumedBy === void 0 && this.tree.add(i), n;
  }
}, pi = class {
  constructor() {
    X(this, "type");
    X(this, "numMultiPolys");
  }
  run(i, t, e) {
    Ot.type = i;
    const n = [new Ce(t, !0)];
    for (let u = 0, g = e.length; u < g; u++)
      n.push(new Ce(e[u], !1));
    if (Ot.numMultiPolys = n.length, Ot.type === "difference") {
      const u = n[0];
      let g = 1;
      for (; g < n.length; )
        pe(n[g].bbox, u.bbox) !== null ? g++ : n.splice(g, 1);
    }
    if (Ot.type === "intersection")
      for (let u = 0, g = n.length; u < g; u++) {
        const E = n[u];
        for (let b = u + 1, O = n.length; b < O; b++)
          if (pe(E.bbox, n[b].bbox) === null) return [];
      }
    const r = new Jt(pt.compare);
    for (let u = 0, g = n.length; u < g; u++) {
      const E = n[u].getSweepEvents();
      for (let b = 0, O = E.length; b < O; b++)
        r.add(E[b]);
    }
    const s = new ci(r);
    let o = null;
    for (r.size != 0 && (o = r.first(), r.delete(o)); o; ) {
      const u = s.process(o);
      for (let g = 0, E = u.length; g < E; g++) {
        const b = u[g];
        b.consumedBy === void 0 && r.add(b);
      }
      r.size != 0 ? (o = r.first(), r.delete(o)) : o = null;
    }
    yt.reset();
    const l = ui.factory(s.segments);
    return new hi(l).getGeom();
  }
}, Ot = new pi(), It = Ot, gi = 0, Zt = class Kt {
  /* Warning: a reference to ringWindings input will be stored,
   *  and possibly will be later modified */
  constructor(t, e, n, r) {
    X(this, "id");
    X(this, "leftSE");
    X(this, "rightSE");
    X(this, "rings");
    X(this, "windings");
    X(this, "ringOut");
    X(this, "consumedBy");
    X(this, "prev");
    X(this, "_prevInResult");
    X(this, "_beforeState");
    X(this, "_afterState");
    X(this, "_isInResult");
    this.id = ++gi, this.leftSE = t, t.segment = this, t.otherSE = e, this.rightSE = e, e.segment = this, e.otherSE = t, this.rings = n, this.windings = r;
  }
  /* This compare() function is for ordering segments in the sweep
   * line tree, and does so according to the following criteria:
   *
   * Consider the vertical line that lies an infinestimal step to the
   * right of the right-more of the two left endpoints of the input
   * segments. Imagine slowly moving a point up from negative infinity
   * in the increasing y direction. Which of the two segments will that
   * point intersect first? That segment comes 'before' the other one.
   *
   * If neither segment would be intersected by such a line, (if one
   * or more of the segments are vertical) then the line to be considered
   * is directly on the right-more of the two left inputs.
   */
  static compare(t, e) {
    const n = t.leftSE.point.x, r = e.leftSE.point.x, s = t.rightSE.point.x, o = e.rightSE.point.x;
    if (o.isLessThan(n)) return 1;
    if (s.isLessThan(r)) return -1;
    const l = t.leftSE.point.y, f = e.leftSE.point.y, u = t.rightSE.point.y, g = e.rightSE.point.y;
    if (n.isLessThan(r)) {
      if (f.isLessThan(l) && f.isLessThan(u)) return 1;
      if (f.isGreaterThan(l) && f.isGreaterThan(u)) return -1;
      const E = t.comparePoint(e.leftSE.point);
      if (E < 0) return 1;
      if (E > 0) return -1;
      const b = e.comparePoint(t.rightSE.point);
      return b !== 0 ? b : -1;
    }
    if (n.isGreaterThan(r)) {
      if (l.isLessThan(f) && l.isLessThan(g)) return -1;
      if (l.isGreaterThan(f) && l.isGreaterThan(g)) return 1;
      const E = e.comparePoint(t.leftSE.point);
      if (E !== 0) return E;
      const b = t.comparePoint(e.rightSE.point);
      return b < 0 ? 1 : b > 0 ? -1 : 1;
    }
    if (l.isLessThan(f)) return -1;
    if (l.isGreaterThan(f)) return 1;
    if (s.isLessThan(o)) {
      const E = e.comparePoint(t.rightSE.point);
      if (E !== 0) return E;
    }
    if (s.isGreaterThan(o)) {
      const E = t.comparePoint(e.rightSE.point);
      if (E < 0) return 1;
      if (E > 0) return -1;
    }
    if (!s.eq(o)) {
      const E = u.minus(l), b = s.minus(n), O = g.minus(f), T = o.minus(r);
      if (E.isGreaterThan(b) && O.isLessThan(T)) return 1;
      if (E.isLessThan(b) && O.isGreaterThan(T)) return -1;
    }
    return s.isGreaterThan(o) ? 1 : s.isLessThan(o) || u.isLessThan(g) ? -1 : u.isGreaterThan(g) ? 1 : t.id < e.id ? -1 : t.id > e.id ? 1 : 0;
  }
  static fromRing(t, e, n) {
    let r, s, o;
    const l = pt.comparePoints(t, e);
    if (l < 0)
      r = t, s = e, o = 1;
    else if (l > 0)
      r = e, s = t, o = -1;
    else
      throw new Error(
        `Tried to create degenerate segment at [${t.x}, ${t.y}]`
      );
    const f = new pt(r, !0), u = new pt(s, !1);
    return new Kt(f, u, [n], [o]);
  }
  /* When a segment is split, the rightSE is replaced with a new sweep event */
  replaceRightSE(t) {
    this.rightSE = t, this.rightSE.segment = this, this.rightSE.otherSE = this.leftSE, this.leftSE.otherSE = this.rightSE;
  }
  bbox() {
    const t = this.leftSE.point.y, e = this.rightSE.point.y;
    return {
      ll: { x: this.leftSE.point.x, y: t.isLessThan(e) ? t : e },
      ur: { x: this.rightSE.point.x, y: t.isGreaterThan(e) ? t : e }
    };
  }
  /* A vector from the left point to the right */
  vector() {
    return {
      x: this.rightSE.point.x.minus(this.leftSE.point.x),
      y: this.rightSE.point.y.minus(this.leftSE.point.y)
    };
  }
  isAnEndpoint(t) {
    return t.x.eq(this.leftSE.point.x) && t.y.eq(this.leftSE.point.y) || t.x.eq(this.rightSE.point.x) && t.y.eq(this.rightSE.point.y);
  }
  /* Compare this segment with a point.
   *
   * A point P is considered to be colinear to a segment if there
   * exists a distance D such that if we travel along the segment
   * from one * endpoint towards the other a distance D, we find
   * ourselves at point P.
   *
   * Return value indicates:
   *
   *   1: point lies above the segment (to the left of vertical)
   *   0: point is colinear to segment
   *  -1: point lies below the segment (to the right of vertical)
   */
  comparePoint(t) {
    return yt.orient(this.leftSE.point, t, this.rightSE.point);
  }
  /**
   * Given another segment, returns the first non-trivial intersection
   * between the two segments (in terms of sweep line ordering), if it exists.
   *
   * A 'non-trivial' intersection is one that will cause one or both of the
   * segments to be split(). As such, 'trivial' vs. 'non-trivial' intersection:
   *
   *   * endpoint of segA with endpoint of segB --> trivial
   *   * endpoint of segA with point along segB --> non-trivial
   *   * endpoint of segB with point along segA --> non-trivial
   *   * point along segA with point along segB --> non-trivial
   *
   * If no non-trivial intersection exists, return null
   * Else, return null.
   */
  getIntersection(t) {
    const e = this.bbox(), n = t.bbox(), r = pe(e, n);
    if (r === null) return null;
    const s = this.leftSE.point, o = this.rightSE.point, l = t.leftSE.point, f = t.rightSE.point, u = Tt(e, l) && this.comparePoint(l) === 0, g = Tt(n, s) && t.comparePoint(s) === 0, E = Tt(e, f) && this.comparePoint(f) === 0, b = Tt(n, o) && t.comparePoint(o) === 0;
    if (g && u)
      return b && !E ? o : !b && E ? f : null;
    if (g)
      return E && s.x.eq(f.x) && s.y.eq(f.y) ? null : s;
    if (u)
      return b && o.x.eq(l.x) && o.y.eq(l.y) ? null : l;
    if (b && E) return null;
    if (b) return o;
    if (E) return f;
    const O = fi(s, this.vector(), l, t.vector());
    return O === null || !Tt(r, O) ? null : yt.snap(O);
  }
  /**
   * Split the given segment into multiple segments on the given points.
   *  * Each existing segment will retain its leftSE and a new rightSE will be
   *    generated for it.
   *  * A new segment will be generated which will adopt the original segment's
   *    rightSE, and a new leftSE will be generated for it.
   *  * If there are more than two points given to split on, new segments
   *    in the middle will be generated with new leftSE and rightSE's.
   *  * An array of the newly generated SweepEvents will be returned.
   *
   * Warning: input array of points is modified
   */
  split(t) {
    const e = [], n = t.events !== void 0, r = new pt(t, !0), s = new pt(t, !1), o = this.rightSE;
    this.replaceRightSE(s), e.push(s), e.push(r);
    const l = new Kt(
      r,
      o,
      this.rings.slice(),
      this.windings.slice()
    );
    return pt.comparePoints(l.leftSE.point, l.rightSE.point) > 0 && l.swapEvents(), pt.comparePoints(this.leftSE.point, this.rightSE.point) > 0 && this.swapEvents(), n && (r.checkForConsuming(), s.checkForConsuming()), e;
  }
  /* Swap which event is left and right */
  swapEvents() {
    const t = this.rightSE;
    this.rightSE = this.leftSE, this.leftSE = t, this.leftSE.isLeft = !0, this.rightSE.isLeft = !1;
    for (let e = 0, n = this.windings.length; e < n; e++)
      this.windings[e] *= -1;
  }
  /* Consume another segment. We take their rings under our wing
   * and mark them as consumed. Use for perfectly overlapping segments */
  consume(t) {
    let e = this, n = t;
    for (; e.consumedBy; ) e = e.consumedBy;
    for (; n.consumedBy; ) n = n.consumedBy;
    const r = Kt.compare(e, n);
    if (r !== 0) {
      if (r > 0) {
        const s = e;
        e = n, n = s;
      }
      if (e.prev === n) {
        const s = e;
        e = n, n = s;
      }
      for (let s = 0, o = n.rings.length; s < o; s++) {
        const l = n.rings[s], f = n.windings[s], u = e.rings.indexOf(l);
        u === -1 ? (e.rings.push(l), e.windings.push(f)) : e.windings[u] += f;
      }
      n.rings = null, n.windings = null, n.consumedBy = e, n.leftSE.consumedBy = e.leftSE, n.rightSE.consumedBy = e.rightSE;
    }
  }
  /* The first segment previous segment chain that is in the result */
  prevInResult() {
    return this._prevInResult !== void 0 ? this._prevInResult : (this.prev ? this.prev.isInResult() ? this._prevInResult = this.prev : this._prevInResult = this.prev.prevInResult() : this._prevInResult = null, this._prevInResult);
  }
  beforeState() {
    if (this._beforeState !== void 0) return this._beforeState;
    if (!this.prev)
      this._beforeState = {
        rings: [],
        windings: [],
        multiPolys: []
      };
    else {
      const t = this.prev.consumedBy || this.prev;
      this._beforeState = t.afterState();
    }
    return this._beforeState;
  }
  afterState() {
    if (this._afterState !== void 0) return this._afterState;
    const t = this.beforeState();
    this._afterState = {
      rings: t.rings.slice(0),
      windings: t.windings.slice(0),
      multiPolys: []
    };
    const e = this._afterState.rings, n = this._afterState.windings, r = this._afterState.multiPolys;
    for (let l = 0, f = this.rings.length; l < f; l++) {
      const u = this.rings[l], g = this.windings[l], E = e.indexOf(u);
      E === -1 ? (e.push(u), n.push(g)) : n[E] += g;
    }
    const s = [], o = [];
    for (let l = 0, f = e.length; l < f; l++) {
      if (n[l] === 0) continue;
      const u = e[l], g = u.poly;
      if (o.indexOf(g) === -1)
        if (u.isExterior) s.push(g);
        else {
          o.indexOf(g) === -1 && o.push(g);
          const E = s.indexOf(u.poly);
          E !== -1 && s.splice(E, 1);
        }
    }
    for (let l = 0, f = s.length; l < f; l++) {
      const u = s[l].multiPoly;
      r.indexOf(u) === -1 && r.push(u);
    }
    return this._afterState;
  }
  /* Is this segment part of the final result? */
  isInResult() {
    if (this.consumedBy) return !1;
    if (this._isInResult !== void 0) return this._isInResult;
    const t = this.beforeState().multiPolys, e = this.afterState().multiPolys;
    switch (It.type) {
      case "union": {
        const n = t.length === 0, r = e.length === 0;
        this._isInResult = n !== r;
        break;
      }
      case "intersection": {
        let n, r;
        t.length < e.length ? (n = t.length, r = e.length) : (n = e.length, r = t.length), this._isInResult = r === It.numMultiPolys && n < r;
        break;
      }
      case "xor": {
        const n = Math.abs(t.length - e.length);
        this._isInResult = n % 2 === 1;
        break;
      }
      case "difference": {
        const n = (r) => r.length === 1 && r[0].isSubject;
        this._isInResult = n(t) !== n(e);
        break;
      }
    }
    return this._isInResult;
  }
}, Le = class {
  constructor(i, t, e) {
    X(this, "poly");
    X(this, "isExterior");
    X(this, "segments");
    X(this, "bbox");
    if (!Array.isArray(i) || i.length === 0)
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    if (this.poly = t, this.isExterior = e, this.segments = [], typeof i[0][0] != "number" || typeof i[0][1] != "number")
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    const n = yt.snap({ x: new gt(i[0][0]), y: new gt(i[0][1]) });
    this.bbox = {
      ll: { x: n.x, y: n.y },
      ur: { x: n.x, y: n.y }
    };
    let r = n;
    for (let s = 1, o = i.length; s < o; s++) {
      if (typeof i[s][0] != "number" || typeof i[s][1] != "number")
        throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
      const l = yt.snap({ x: new gt(i[s][0]), y: new gt(i[s][1]) });
      l.x.eq(r.x) && l.y.eq(r.y) || (this.segments.push(Zt.fromRing(r, l, this)), l.x.isLessThan(this.bbox.ll.x) && (this.bbox.ll.x = l.x), l.y.isLessThan(this.bbox.ll.y) && (this.bbox.ll.y = l.y), l.x.isGreaterThan(this.bbox.ur.x) && (this.bbox.ur.x = l.x), l.y.isGreaterThan(this.bbox.ur.y) && (this.bbox.ur.y = l.y), r = l);
    }
    (!n.x.eq(r.x) || !n.y.eq(r.y)) && this.segments.push(Zt.fromRing(r, n, this));
  }
  getSweepEvents() {
    const i = [];
    for (let t = 0, e = this.segments.length; t < e; t++) {
      const n = this.segments[t];
      i.push(n.leftSE), i.push(n.rightSE);
    }
    return i;
  }
}, mi = class {
  constructor(i, t) {
    X(this, "multiPoly");
    X(this, "exteriorRing");
    X(this, "interiorRings");
    X(this, "bbox");
    if (!Array.isArray(i))
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    this.exteriorRing = new Le(i[0], this, !0), this.bbox = {
      ll: { x: this.exteriorRing.bbox.ll.x, y: this.exteriorRing.bbox.ll.y },
      ur: { x: this.exteriorRing.bbox.ur.x, y: this.exteriorRing.bbox.ur.y }
    }, this.interiorRings = [];
    for (let e = 1, n = i.length; e < n; e++) {
      const r = new Le(i[e], this, !1);
      r.bbox.ll.x.isLessThan(this.bbox.ll.x) && (this.bbox.ll.x = r.bbox.ll.x), r.bbox.ll.y.isLessThan(this.bbox.ll.y) && (this.bbox.ll.y = r.bbox.ll.y), r.bbox.ur.x.isGreaterThan(this.bbox.ur.x) && (this.bbox.ur.x = r.bbox.ur.x), r.bbox.ur.y.isGreaterThan(this.bbox.ur.y) && (this.bbox.ur.y = r.bbox.ur.y), this.interiorRings.push(r);
    }
    this.multiPoly = t;
  }
  getSweepEvents() {
    const i = this.exteriorRing.getSweepEvents();
    for (let t = 0, e = this.interiorRings.length; t < e; t++) {
      const n = this.interiorRings[t].getSweepEvents();
      for (let r = 0, s = n.length; r < s; r++)
        i.push(n[r]);
    }
    return i;
  }
}, Ce = class {
  constructor(i, t) {
    X(this, "isSubject");
    X(this, "polys");
    X(this, "bbox");
    if (!Array.isArray(i))
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    try {
      typeof i[0][0][0] == "number" && (i = [i]);
    } catch {
    }
    this.polys = [], this.bbox = {
      ll: { x: new gt(Number.POSITIVE_INFINITY), y: new gt(Number.POSITIVE_INFINITY) },
      ur: { x: new gt(Number.NEGATIVE_INFINITY), y: new gt(Number.NEGATIVE_INFINITY) }
    };
    for (let e = 0, n = i.length; e < n; e++) {
      const r = new mi(i[e], this);
      r.bbox.ll.x.isLessThan(this.bbox.ll.x) && (this.bbox.ll.x = r.bbox.ll.x), r.bbox.ll.y.isLessThan(this.bbox.ll.y) && (this.bbox.ll.y = r.bbox.ll.y), r.bbox.ur.x.isGreaterThan(this.bbox.ur.x) && (this.bbox.ur.x = r.bbox.ur.x), r.bbox.ur.y.isGreaterThan(this.bbox.ur.y) && (this.bbox.ur.y = r.bbox.ur.y), this.polys.push(r);
    }
    this.isSubject = t;
  }
  getSweepEvents() {
    const i = [];
    for (let t = 0, e = this.polys.length; t < e; t++) {
      const n = this.polys[t].getSweepEvents();
      for (let r = 0, s = n.length; r < s; r++)
        i.push(n[r]);
    }
    return i;
  }
}, di = (i, ...t) => It.run("union", i, t), wi = (i, ...t) => It.run("intersection", i, t), yi = (i, ...t) => It.run("difference", i, t);
yt.set;
function xi(i) {
  const t = [];
  if (ye(i, (r) => {
    t.push(r.coordinates);
  }), t.length < 2)
    throw new Error("Must have at least two features");
  const e = i.features[0].properties || {}, n = yi(t[0], ...t.slice(1));
  return n.length === 0 ? null : n.length === 1 ? mt(n[0], e) : de(n, e);
}
var vi = xi;
function Si(i, t = {}) {
  const e = [];
  if (ye(i, (r) => {
    e.push(r.coordinates);
  }), e.length < 2)
    throw new Error("Must specify at least 2 geometries");
  const n = wi(e[0], ...e.slice(1));
  return n.length === 0 ? null : n.length === 1 ? mt(n[0], t.properties) : de(n, t.properties);
}
var Ei = Si;
class fn {
  constructor(t = [], e = _i) {
    if (this.data = t, this.length = this.data.length, this.compare = e, this.length > 0)
      for (let n = (this.length >> 1) - 1; n >= 0; n--) this._down(n);
  }
  push(t) {
    this.data.push(t), this.length++, this._up(this.length - 1);
  }
  pop() {
    if (this.length === 0) return;
    const t = this.data[0], e = this.data.pop();
    return this.length--, this.length > 0 && (this.data[0] = e, this._down(0)), t;
  }
  peek() {
    return this.data[0];
  }
  _up(t) {
    const { data: e, compare: n } = this, r = e[t];
    for (; t > 0; ) {
      const s = t - 1 >> 1, o = e[s];
      if (n(r, o) >= 0) break;
      e[t] = o, t = s;
    }
    e[t] = r;
  }
  _down(t) {
    const { data: e, compare: n } = this, r = this.length >> 1, s = e[t];
    for (; t < r; ) {
      let o = (t << 1) + 1, l = e[o];
      const f = o + 1;
      if (f < this.length && n(e[f], l) < 0 && (o = f, l = e[f]), n(l, s) >= 0) break;
      e[t] = l, t = o;
    }
    e[t] = s;
  }
}
function _i(i, t) {
  return i < t ? -1 : i > t ? 1 : 0;
}
function un(i, t) {
  return i.p.x > t.p.x ? 1 : i.p.x < t.p.x ? -1 : i.p.y !== t.p.y ? i.p.y > t.p.y ? 1 : -1 : 1;
}
function Mi(i, t) {
  return i.rightSweepEvent.p.x > t.rightSweepEvent.p.x ? 1 : i.rightSweepEvent.p.x < t.rightSweepEvent.p.x ? -1 : i.rightSweepEvent.p.y !== t.rightSweepEvent.p.y ? i.rightSweepEvent.p.y < t.rightSweepEvent.p.y ? 1 : -1 : 1;
}
class Xe {
  constructor(t, e, n, r) {
    this.p = {
      x: t[0],
      y: t[1]
    }, this.featureId = e, this.ringId = n, this.eventId = r, this.otherEvent = null, this.isLeftEndpoint = null;
  }
  isSamePoint(t) {
    return this.p.x === t.p.x && this.p.y === t.p.y;
  }
}
function bi(i, t) {
  if (i.type === "FeatureCollection") {
    const e = i.features;
    for (let n = 0; n < e.length; n++)
      Ye(e[n], t);
  } else
    Ye(i, t);
}
let Lt = 0, Ct = 0, Xt = 0;
function Ye(i, t) {
  const e = i.type === "Feature" ? i.geometry : i;
  let n = e.coordinates;
  (e.type === "Polygon" || e.type === "MultiLineString") && (n = [n]), e.type === "LineString" && (n = [[n]]);
  for (let r = 0; r < n.length; r++)
    for (let s = 0; s < n[r].length; s++) {
      let o = n[r][s][0], l = null;
      Ct = Ct + 1;
      for (let f = 0; f < n[r][s].length - 1; f++) {
        l = n[r][s][f + 1];
        const u = new Xe(o, Lt, Ct, Xt), g = new Xe(l, Lt, Ct, Xt + 1);
        u.otherEvent = g, g.otherEvent = u, un(u, g) > 0 ? (g.isLeftEndpoint = !0, u.isLeftEndpoint = !1) : (u.isLeftEndpoint = !0, g.isLeftEndpoint = !1), t.push(u), t.push(g), o = l, Xt = Xt + 1;
      }
    }
  Lt = Lt + 1;
}
class ki {
  constructor(t) {
    this.leftSweepEvent = t, this.rightSweepEvent = t.otherEvent;
  }
}
function Ti(i, t) {
  if (i === null || t === null || i.leftSweepEvent.ringId === t.leftSweepEvent.ringId && (i.rightSweepEvent.isSamePoint(t.leftSweepEvent) || i.rightSweepEvent.isSamePoint(t.leftSweepEvent) || i.rightSweepEvent.isSamePoint(t.rightSweepEvent) || i.leftSweepEvent.isSamePoint(t.leftSweepEvent) || i.leftSweepEvent.isSamePoint(t.rightSweepEvent))) return !1;
  const e = i.leftSweepEvent.p.x, n = i.leftSweepEvent.p.y, r = i.rightSweepEvent.p.x, s = i.rightSweepEvent.p.y, o = t.leftSweepEvent.p.x, l = t.leftSweepEvent.p.y, f = t.rightSweepEvent.p.x, u = t.rightSweepEvent.p.y, g = (u - l) * (r - e) - (f - o) * (s - n), E = (f - o) * (n - l) - (u - l) * (e - o), b = (r - e) * (n - l) - (s - n) * (e - o);
  if (g === 0)
    return !1;
  const O = E / g, T = b / g;
  if (O >= 0 && O <= 1 && T >= 0 && T <= 1) {
    const P = e + O * (r - e), M = n + O * (s - n);
    return [P, M];
  }
  return !1;
}
function Ai(i, t) {
  t = t || !1;
  const e = [], n = new fn([], Mi);
  for (; i.length; ) {
    const r = i.pop();
    if (r.isLeftEndpoint) {
      const s = new ki(r);
      for (let o = 0; o < n.data.length; o++) {
        const l = n.data[o];
        if (t && l.leftSweepEvent.featureId === r.featureId)
          continue;
        const f = Ti(s, l);
        f !== !1 && e.push(f);
      }
      n.push(s);
    } else r.isLeftEndpoint === !1 && n.pop();
  }
  return e;
}
function Oi(i, t) {
  const e = new fn([], un);
  return bi(i, e), Ai(e, t);
}
var Pi = Oi;
function Ii(i, t, e = {}) {
  const { removeDuplicates: n = !0, ignoreSelfIntersections: r = !0 } = e;
  let s = [];
  i.type === "FeatureCollection" ? s = s.concat(i.features) : i.type === "Feature" ? s.push(i) : (i.type === "LineString" || i.type === "Polygon" || i.type === "MultiLineString" || i.type === "MultiPolygon") && s.push(Mt(i)), t.type === "FeatureCollection" ? s = s.concat(t.features) : t.type === "Feature" ? s.push(t) : (t.type === "LineString" || t.type === "Polygon" || t.type === "MultiLineString" || t.type === "MultiPolygon") && s.push(Mt(t));
  const o = Pi(
    Q(s),
    r
  );
  let l = [];
  if (n) {
    const f = {};
    o.forEach((u) => {
      const g = u.join(",");
      f[g] || (f[g] = !0, l.push(u));
    });
  } else
    l = o;
  return Q(l.map((f) => at(f)));
}
var Bi = Ii;
function Ni(i, t = {}) {
  const e = [];
  if (ye(i, (r) => {
    e.push(r.coordinates);
  }), e.length < 2)
    throw new Error("Must have at least 2 geometries");
  const n = di(e[0], ...e.slice(1));
  return n.length === 0 ? null : n.length === 1 ? mt(n[0], t.properties) : de(n, t.properties);
}
var Ri = Ni;
function Li(i) {
  const e = new Ci(i).findSegmentIntersections();
  return pn(e).reduce(
    (n, r, s, o) => (n || (n = {}), n[`${r.x}:${r.y}`] = r, s != o.length - 1 ? n : Object.keys(n).map((l) => at([n[l].x, n[l].y]))),
    []
  );
}
class Ci {
  constructor(t) {
    X(this, "_xx");
    X(this, "_yy");
    // coordinates data
    X(this, "_ii");
    X(this, "_nn");
    // indexes, sizes
    X(this, "_zz");
    X(this, "_zlimit", 0);
    // simplification
    X(this, "_bb");
    X(this, "_allBounds");
    // bounding boxes
    X(this, "_arcIter");
    X(this, "_filteredArcIter");
    // path iterators
    X(this, "buf");
    this.initArcs(t);
  }
  initArcs(t) {
    const e = [], n = [], r = t.map((s) => {
      const o = s ? s.length : 0;
      for (let l = 0; l < o; l++)
        e.push(s[l][0]), n.push(s[l][1]);
      return o;
    });
    this.initXYData(r, e, n);
  }
  initXYData(t, e, n) {
    const r = t.length;
    this._xx = new Float64Array(e), this._yy = new Float64Array(n), this._nn = new Uint32Array(t), this._zz = null, this._zlimit = 0, this._filteredArcIter = null, this._ii = new Uint32Array(r);
    let s = 0;
    for (let o = 0; o < r; o++)
      this._ii[o] = s, s += t[o];
    (s != this._xx.length || this._xx.length != this._yy.length) && ve("ArcCollection#initXYData() Counting error"), this.initBounds(), this._arcIter = new nr(this._xx, this._yy);
  }
  initBounds() {
    const t = this.calcArcBounds_(this._xx, this._yy, this._nn);
    this._bb = t.bb, this._allBounds = t.bounds;
  }
  calcArcBounds_(t, e, n) {
    const r = n.length, s = new Float64Array(r * 4), o = new Qt();
    let l = 0, f, u, g;
    for (let E = 0; E < r; E++)
      f = n[E], f > 0 && (u = E * 4, g = ir(t, e, l, f), s[u++] = g[0], s[u++] = g[1], s[u++] = g[2], s[u] = g[3], l += f, o.mergeBounds(g));
    return {
      bb: s,
      bounds: o
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
    const n = t >= 0, r = n ? t : ~t, s = this.getRetainedInterval(), o = this._nn[r], l = n ? 1 : -1;
    let f = n ? this._ii[r] : this._ii[r] + o - 1, u = f, g = 0;
    for (let E = 1; E < o; E++)
      u += l, (s === 0 || this._zz[u] >= s) && (e(f, u, this._xx, this._yy), f = u, g++);
    return g;
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
      (r, s, o, l) => {
        t += Math.abs(o[r] - o[s]), e += Math.abs(l[r] - l[s]);
      }
    );
    return [t / n || 0, e / n || 0];
  }
  calcSegmentIntersectionStripeCount() {
    const t = this.getBounds().height(), e = this.getAvgSegment2()[1];
    let n = 1;
    return e > 0 && t > 0 && (n = Math.ceil(t / e / 20)), n || 1;
  }
  findSegmentIntersections() {
    const t = this.getBounds(), e = t.ymin, n = t.ymax - e, r = this.calcSegmentIntersectionStripeCount(), s = new Uint32Array(r), o = r > 1 ? (P) => Math.floor((r - 1) * (P - e) / n) : () => 0;
    let l, f;
    this.forEachSegment(
      (P, M, B, c) => {
        let m = o(c[P]);
        const d = o(c[M]);
        for (; s[m] = s[m] + 2, m != d; )
          m += d > m ? 1 : -1;
      }
    );
    const u = this.getUint32Array(Di(s));
    let g = 0;
    const E = [];
    Fi(s, (P) => {
      const M = g;
      g += P, E.push(u.subarray(M, g));
    }), Ui(s, 0), this.forEachSegment(
      (P, M, B, c) => {
        let m = o(c[P]);
        const d = o(c[M]);
        let I, N;
        for (; I = s[m], s[m] = I + 2, N = E[m], N[I] = P, N[I + 1] = M, m != d; )
          m += d > m ? 1 : -1;
      }
    );
    const b = this.getVertexData(), O = [];
    let T;
    for (l = 0; l < r; l++)
      for (T = Gi(E[l], b.xx, b.yy), f = 0; f < T.length; f++)
        O.push(T[f]);
    return pn(O);
  }
}
function ve(...i) {
  const t = i.join(" ");
  throw new Error(t);
}
function Se(i) {
  return i ? Yi(i) ? !0 : Xi(i) ? !1 : i.length === 0 ? !0 : i.length > 0 : !1;
}
function Xi(i) {
  return i != null && i.toString === String.prototype.toString;
}
function Yi(i) {
  return Array.isArray(i);
}
function Di(i, t) {
  Se(i) || ve("utils.sum() expects an array, received:", i);
  let e = 0, n;
  for (let r = 0, s = i.length; r < s; r++)
    n = i[r], n && (e += n);
  return e;
}
function Fi(i, t, e) {
  if (!Se(i))
    throw new Error(`#forEach() takes an array-like argument. ${i}`);
  for (let n = 0, r = i.length; n < r; n++)
    t.call(e, i[n], n);
}
function Ui(i, t) {
  for (let e = 0, n = i.length; e < n; e++)
    i[e] = t;
  return i;
}
function Gi(i, t, e) {
  const n = i.length - 2, r = [];
  let s, o, l, f, u, g, E, b, O, T, P, M, B, c, m, d, I;
  for (Zi(t, i), d = 0; d < n; ) {
    for (s = i[d], o = i[d + 1], u = t[s], g = t[o], O = e[s], T = e[o], I = d; I < n && (I += 2, l = i[I], E = t[l], !(g < E)); ) {
      if (P = e[l], f = i[I + 1], b = t[f], M = e[f], O >= P) {
        if (O > M && T > P && T > M) continue;
      } else if (O < M && T < P && T < M) continue;
      s == l || s == f || o == l || o == f || (B = qi(
        u,
        O,
        g,
        T,
        E,
        P,
        b,
        M
      ), B && (c = [s, o], m = [l, f], r.push(Fe(B, c, m, t, e)), B.length == 4 && r.push(
        Fe(B.slice(2), c, m, t, e)
      )));
    }
    d += 2;
  }
  return r;
}
function qi(i, t, e, n, r, s, o, l) {
  const f = $i(i, t, e, n, r, s, o, l);
  let u = null;
  return f && (u = zi(i, t, e, n, r, s, o, l), u ? Hi(i, t, e, n, r, s, o, l) && (u = null) : u = Ji(i, t, e, n, r, s, o, l)), u;
}
function $i(i, t, e, n, r, s, o, l) {
  return Pt(i, t, e, n, r, s) * Pt(i, t, e, n, o, l) <= 0 && Pt(r, s, o, l, i, t) * Pt(r, s, o, l, e, n) <= 0;
}
function Pt(i, t, e, n, r, s) {
  return hn(i - r, t - s, e - r, n - s);
}
function hn(i, t, e, n) {
  return i * n - t * e;
}
function zi(i, t, e, n, r, s, o, l) {
  let f = Yt(i, t, e, n, r, s, o, l), u;
  return f && (u = ji(f[0], f[1], i, t, e, n, r, s, o, l), u == 1 ? f = Yt(e, n, i, t, r, s, o, l) : u == 2 ? f = Yt(r, s, o, l, i, t, e, n) : u == 3 && (f = Yt(o, l, r, s, i, t, e, n))), f && Ki(f, i, t, e, n, r, s, o, l), f;
}
function Yt(i, t, e, n, r, s, o, l) {
  const f = hn(e - i, n - t, o - r, l - s), u = 1e-18;
  let g;
  if (f === 0) return null;
  const E = Pt(r, s, o, l, i, t) / f;
  return f <= u && f >= -u ? g = Vi(i, t, e, n, r, s, o, l) : g = [i + E * (e - i), t + E * (n - t)], g;
}
function Vi(i, t, e, n, r, s, o, l) {
  let f = null;
  return !wt(i, r, o) && !wt(t, s, l) ? f = [i, t] : !wt(e, r, o) && !wt(n, s, l) ? f = [e, n] : !wt(r, i, e) && !wt(s, t, n) ? f = [r, s] : !wt(o, i, e) && !wt(l, t, n) && (f = [o, l]), f;
}
function wt(i, t, e) {
  let n;
  return t < e ? n = i < t || i > e : t > e ? n = i > t || i < e : n = i != t, n;
}
function ji(i, t, ...e) {
  let n = -1, r = 1 / 0, s;
  for (let o = 0, l = 0, f = e.length; l < f; o++, l += 2)
    s = Wi(i, t, e[l], e[l + 1]), s < r && (r = s, n = o);
  return n;
}
function Wi(i, t, e, n) {
  const r = i - e, s = t - n;
  return r * r + s * s;
}
function Ki(i, t, e, n, r, s, o, l, f) {
  let u = i[0], g = i[1];
  u = Dt(u, t, n), u = Dt(u, s, l), g = Dt(g, e, r), g = Dt(g, o, f), i[0] = u, i[1] = g;
}
function Dt(i, t, e) {
  let n;
  return wt(i, t, e) && (n = Math.abs(i - t) < Math.abs(i - e) ? t : e, i = n), i;
}
function Ji(i, t, e, n, r, s, o, l) {
  const f = Math.min(i, e, r, o), u = Math.max(i, e, r, o), g = Math.min(t, n, s, l), E = Math.max(t, n, s, l), b = E - g > u - f;
  let O = [];
  return (b ? St(t, g, E) : St(i, f, u)) && O.push(i, t), (b ? St(n, g, E) : St(e, f, u)) && O.push(e, n), (b ? St(s, g, E) : St(r, f, u)) && O.push(r, s), (b ? St(l, g, E) : St(o, f, u)) && O.push(o, l), (O.length != 2 && O.length != 4 || O.length == 4 && O[0] == O[2] && O[1] == O[3]) && (O = null), O;
}
function Hi(i, t, e, n, r, s, o, l) {
  return i == r && t == s || i == o && t == l || e == r && n == s || e == o && n == l;
}
function St(i, t, e) {
  return i > t && i < e;
}
function Zi(i, t) {
  Qi(i, t), cn(i, t, 0, t.length - 2);
}
function Qi(i, t) {
  for (let e = 0, n = t.length; e < n; e += 2)
    i[t[e]] > i[t[e + 1]] && tr(t, e, e + 1);
}
function tr(i, t, e) {
  const n = i[t];
  i[t] = i[e], i[e] = n;
}
function cn(i, t, e, n) {
  let r = e, s = n, o, l;
  for (; r < n; ) {
    for (o = i[t[e + n >> 2 << 1]]; r <= s; ) {
      for (; i[t[r]] < o; ) r += 2;
      for (; i[t[s]] > o; ) s -= 2;
      r <= s && (l = t[r], t[r] = t[s], t[s] = l, l = t[r + 1], t[r + 1] = t[s + 1], t[s + 1] = l, r += 2, s -= 2);
    }
    if (s - e < 40 ? De(i, t, e, s) : cn(i, t, e, s), n - r < 40) {
      De(i, t, r, n);
      return;
    }
    e = r, s = n;
  }
}
function De(i, t, e, n) {
  let r, s;
  for (let o = e + 2; o <= n; o += 2) {
    r = t[o], s = t[o + 1];
    let l;
    for (l = o - 2; l >= e && i[r] < i[t[l]]; l -= 2)
      t[l + 2] = t[l], t[l + 3] = t[l + 1];
    t[l + 2] = r, t[l + 3] = s;
  }
}
function Fe(i, t, e, n, r) {
  const s = i[0], o = i[1];
  t = Ue(s, o, t[0], t[1], n, r), e = Ue(s, o, e[0], e[1], n, r);
  const l = t[0] < e[0] ? t : e, f = l == t ? e : t;
  return { x: s, y: o, a: l, b: f };
}
function Ue(i, t, e, n, r, s) {
  let o = e < n ? e : n, l = o === e ? n : e;
  return r[o] == i && s[o] == t ? l = o : r[l] == i && s[l] == t && (o = l), [o, l];
}
function pn(i) {
  const t = {};
  return i.filter((e) => {
    const n = er(e);
    return n in t ? !1 : (t[n] = !0, !0);
  });
}
function er(i) {
  return `${i.a.join(",")};${i.b.join(",")}`;
}
class nr {
  constructor(t, e) {
    X(this, "_i", 0);
    X(this, "_n", 0);
    X(this, "_inc", 1);
    X(this, "_xx");
    X(this, "_yy");
    X(this, "i", 0);
    X(this, "x", 0);
    X(this, "y", 0);
    this._xx = t, this._yy = e;
  }
}
function ir(i, t, e, n) {
  let r = e | 0;
  const s = isNaN(n) ? i.length - r : n + r;
  let o, l, f, u, g, E;
  if (s > 0)
    f = g = i[r], u = E = t[r];
  else return [void 0, void 0, void 0, void 0];
  for (r++; r < s; r++)
    o = i[r], l = t[r], o < f && (f = o), o > g && (g = o), l < u && (u = l), l > E && (E = l);
  return [f, u, g, E];
}
class Qt {
  constructor(...t) {
    X(this, "xmin");
    X(this, "ymin");
    X(this, "xmax");
    X(this, "ymax");
    t.length > 0 && this.setBounds(t);
  }
  // Return a bounding box with the same extent as this one.
  cloneBounds() {
    return this.clone();
  }
  clone() {
    return new Qt(this.xmin, this.ymin, this.xmax, this.ymax);
  }
  width() {
    return this.xmax - this.xmin || 0;
  }
  height() {
    return this.ymax - this.ymin || 0;
  }
  setBounds(t, e, n, r) {
    return arguments.length == 1 && (Se(t) ? (e = t[1], n = t[2], r = t[3], t = t[0]) : (e = t.ymin, n = t.xmax, r = t.ymax, t = t.xmin)), this.xmin = t, this.ymin = e, this.xmax = n, this.ymax = r, (t > n || e > r) && this.update(), this;
  }
  update() {
    let t;
    this.xmin > this.xmax && (t = this.xmin, this.xmin = this.xmax, this.xmax = t), this.ymin > this.ymax && (t = this.ymin, this.ymin = this.ymax, this.ymax = t);
  }
  mergeBounds(t, ...e) {
    let n, r, s, o;
    return t instanceof Qt ? (n = t.xmin, r = t.ymin, s = t.xmax, o = t.ymax) : e.length == 3 ? (n = t, r = e[0], s = e[1], o = e[2]) : t.length == 4 ? (n = t[0], r = t[1], s = t[2], o = t[3]) : ve("Bounds#mergeBounds() invalid argument:", t), this.xmin === void 0 ? this.setBounds(n, r, s, o) : (n < this.xmin && (this.xmin = n), r < this.ymin && (this.ymin = r), s > this.xmax && (this.xmax = s), o > this.ymax && (this.ymax = o)), this;
  }
}
function Ft(i, t, e) {
  if (t || (t = []), typeof i != "object" || i.type !== "FeatureCollection")
    throw "Argument points must be FeatureCollection";
  if (!Array.isArray(t)) throw "Argument points must be Array of Array";
  const n = i.features.map(
    (f) => f.geometry.coordinates
  ), r = En.from(n);
  let s;
  const o = [];
  r.triangles.length !== 0 && t.length !== 0 && (s = new _n(r), s.constrainAll(t));
  for (let f = 0; f < r.triangles.length; f += 3)
    o.push([r.triangles[f], r.triangles[f + 1], r.triangles[f + 2]]);
  const l = ["a", "b", "c"];
  return Q(
    o.map((f) => {
      const u = {}, g = f.map((E, b) => {
        const O = i.features[E], T = O.geometry.coordinates, P = [T[0], T[1]];
        return T.length === 3 ? P[2] = T[2] : u[l[b]] = O.properties[e], P;
      });
      return g[3] = g[0], mt([g], u);
    })
  );
}
const Ut = 2.00703, $ = class $ {
  constructor(t = {}) {
    X(this, "bounds");
    X(this, "boundsPolygon");
    X(this, "centroid");
    X(this, "edgeNodes");
    X(this, "edges");
    X(this, "importance");
    X(this, "indexedTins");
    X(this, "kinks");
    X(this, "points", []);
    X(this, "pointsWeightBuffer");
    X(this, "priority");
    X(this, "stateBackward");
    X(this, "stateFull");
    X(this, "stateTriangle");
    X(this, "strictMode");
    X(this, "strict_status");
    X(this, "tins");
    X(this, "vertexMode");
    X(this, "vertices_params");
    X(this, "wh");
    X(this, "xy");
    X(this, "yaxisMode");
    X(this, "pointsSet");
    t.bounds ? this.setBounds(t.bounds) : (this.setWh(t.wh), this.vertexMode = t.vertexMode || $.VERTEX_PLAIN), this.strictMode = t.strictMode || $.MODE_AUTO, this.yaxisMode = t.yaxisMode || $.YAXIS_INVERT, this.importance = t.importance || 0, this.priority = t.priority || 0, this.stateFull = t.stateFull || !1, t.points && this.setPoints(t.points), t.edges && this.setEdges(t.edges);
  }
  getFormatVersion() {
    return Ut;
  }
  setPoints(t) {
    this.yaxisMode == $.YAXIS_FOLLOW && (t = t.map((e) => [e[0], [e[1][0], -1 * e[1][1]]])), this.points = t, this.tins = void 0, this.indexedTins = void 0;
  }
  setEdges(t = []) {
    this.edges = je(t), this.edgeNodes = void 0, this.tins = void 0, this.indexedTins = void 0;
  }
  setBounds(t) {
    this.bounds = t;
    let e = t[0][0], n = e, r = t[0][1], s = r;
    const o = [t[0]];
    for (let l = 1; l < t.length; l++) {
      const f = t[l];
      f[0] < e && (e = f[0]), f[0] > n && (n = f[0]), f[1] < r && (r = f[1]), f[1] > s && (s = f[1]), o.push(f);
    }
    o.push(t[0]), this.boundsPolygon = mt([o]), this.xy = [e, r], this.wh = [n - e, s - r], this.vertexMode = $.VERTEX_PLAIN, this.tins = void 0, this.indexedTins = void 0;
  }
  setCompiled(t) {
    if (t.version || !t.tins && t.points && t.tins_points) {
      this.points = t.points, this.pointsWeightBuffer = !t.version || t.version < 2.00703 ? ["forw", "bakw"].reduce((n, r) => {
        const s = t.weight_buffer[r];
        return s && (n[r] = Object.keys(s).reduce((o, l) => {
          const f = mn(l);
          return o[f] = s[l], o;
        }, {})), n;
      }, {}) : t.weight_buffer, t.strict_status ? this.strict_status = t.strict_status : t.kinks_points ? this.strict_status = $.STATUS_ERROR : t.tins_points.length == 2 ? this.strict_status = $.STATUS_LOOSE : this.strict_status = $.STATUS_STRICT, this.vertices_params = {
        forw: [t.vertices_params[0]],
        bakw: [t.vertices_params[1]]
      }, this.vertices_params.forw[1] = [0, 1, 2, 3].map((n) => {
        const r = (n + 1) % 4, s = zt(
          ["c", `b${n}`, `b${r}`],
          t.points,
          t.edgeNodes || [],
          t.centroid_point,
          t.vertices_points,
          !1,
          Ut
        );
        return Q([s]);
      }), this.vertices_params.bakw[1] = [0, 1, 2, 3].map((n) => {
        const r = (n + 1) % 4, s = zt(
          ["c", `b${n}`, `b${r}`],
          t.points,
          t.edgeNodes || [],
          t.centroid_point,
          t.vertices_points,
          !0,
          Ut
        );
        return Q([s]);
      }), this.centroid = {
        forw: at(t.centroid_point[0], {
          target: {
            geom: t.centroid_point[1],
            index: "c"
          }
        }),
        bakw: at(t.centroid_point[1], {
          target: {
            geom: t.centroid_point[0],
            index: "c"
          }
        })
      }, this.edges = je(t.edges || []), this.edgeNodes = t.edgeNodes || [];
      const e = t.tins_points.length == 1 ? 0 : 1;
      this.tins = {
        forw: Q(
          t.tins_points[0].map(
            (n) => zt(
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
        bakw: Q(
          t.tins_points[e].map(
            (n) => zt(
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
        bakw: Q(
          t.kinks_points.map((n) => at(n))
        )
      }), t.yaxisMode ? this.yaxisMode = t.yaxisMode : this.yaxisMode = $.YAXIS_INVERT, t.vertexMode && (this.vertexMode = t.vertexMode), t.strictMode && (this.strictMode = t.strictMode), t.bounds ? (this.bounds = t.bounds, this.boundsPolygon = t.boundsPolygon, this.xy = t.xy, this.wh = t.wh) : (this.xy = [0, 0], t.wh && (this.wh = t.wh), this.bounds = void 0, this.boundsPolygon = void 0);
    } else {
      t = JSON.parse(
        JSON.stringify(t).replace('"cent"', '"c"').replace(/"bbox(\d+)"/g, '"b$1"')
      ), this.tins = t.tins, this.addIndexedTin(), this.strict_status = t.strict_status, this.pointsWeightBuffer = t.weight_buffer, this.vertices_params = t.vertices_params, this.centroid = t.centroid, this.kinks = t.kinks;
      const e = [];
      for (let n = 0; n < this.tins.forw.features.length; n++) {
        const r = this.tins.forw.features[n];
        ["a", "b", "c"].map((s, o) => {
          const l = r.geometry.coordinates[0][o], f = r.properties[s].geom, u = r.properties[s].index;
          e[u] = [l, f];
        });
      }
      this.points = e;
    }
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
    const t = {};
    t.version = Ut, t.points = this.points, t.weight_buffer = this.pointsWeightBuffer, t.centroid_point = [
      this.centroid.forw.geometry.coordinates,
      this.centroid.forw.properties.target.geom
    ], t.vertices_params = [
      this.vertices_params.forw[0],
      this.vertices_params.bakw[0]
    ], t.vertices_points = [];
    const e = this.vertices_params.forw[1];
    return [0, 1, 2, 3].map((n) => {
      const r = e[n].features[0], s = r.geometry.coordinates[0][1], o = r.properties.b.geom;
      t.vertices_points[n] = [s, o];
    }), t.strict_status = this.strict_status, t.tins_points = [[]], this.tins.forw.features.map((n) => {
      t.tins_points[0].push(
        ["a", "b", "c"].map(
          (r) => n.properties[r].index
        )
      );
    }), this.strict_status == $.STATUS_LOOSE ? (t.tins_points[1] = [], this.tins.bakw.features.map((n) => {
      t.tins_points[1].push(
        ["a", "b", "c"].map(
          (r) => n.properties[r].index
        )
      );
    })) : this.strict_status == $.STATUS_ERROR && (t.kinks_points = this.kinks.bakw.features.map(
      (n) => n.geometry.coordinates
    )), t.yaxisMode = this.yaxisMode, t.vertexMode = this.vertexMode, t.strictMode = this.strictMode, this.bounds ? (t.bounds = this.bounds, t.boundsPolygon = this.boundsPolygon, t.xy = this.xy, t.wh = this.wh) : t.wh = this.wh, t.edges = this.edges, t.edgeNodes = this.edgeNodes, t;
  }
  addIndexedTin() {
    const t = this.tins, e = t.forw, n = t.bakw, r = Math.ceil(Math.sqrt(e.features.length));
    if (r < 3) {
      this.indexedTins = void 0;
      return;
    }
    let s = [], o = [];
    const l = e.features.map((P) => {
      let M = [];
      return ke(P)[0].map((B) => {
        s.length === 0 ? s = [Array.from(B), Array.from(B)] : (B[0] < s[0][0] && (s[0][0] = B[0]), B[0] > s[1][0] && (s[1][0] = B[0]), B[1] < s[0][1] && (s[0][1] = B[1]), B[1] > s[1][1] && (s[1][1] = B[1])), M.length === 0 ? M = [Array.from(B), Array.from(B)] : (B[0] < M[0][0] && (M[0][0] = B[0]), B[0] > M[1][0] && (M[1][0] = B[0]), B[1] < M[0][1] && (M[0][1] = B[1]), B[1] > M[1][1] && (M[1][1] = B[1]));
      }), M;
    }), f = (s[1][0] - s[0][0]) / r, u = (s[1][1] - s[0][1]) / r, g = l.reduce(
      (P, M, B) => {
        const c = ct(
          M[0][0],
          s[0][0],
          f,
          r
        ), m = ct(
          M[1][0],
          s[0][0],
          f,
          r
        ), d = ct(
          M[0][1],
          s[0][1],
          u,
          r
        ), I = ct(
          M[1][1],
          s[0][1],
          u,
          r
        );
        for (let N = c; N <= m; N++) {
          P[N] || (P[N] = []);
          for (let R = d; R <= I; R++)
            P[N][R] || (P[N][R] = []), P[N][R].push(B);
        }
        return P;
      },
      []
    ), E = n.features.map((P) => {
      let M = [];
      return ke(P)[0].map((B) => {
        o.length === 0 ? o = [Array.from(B), Array.from(B)] : (B[0] < o[0][0] && (o[0][0] = B[0]), B[0] > o[1][0] && (o[1][0] = B[0]), B[1] < o[0][1] && (o[0][1] = B[1]), B[1] > o[1][1] && (o[1][1] = B[1])), M.length === 0 ? M = [Array.from(B), Array.from(B)] : (B[0] < M[0][0] && (M[0][0] = B[0]), B[0] > M[1][0] && (M[1][0] = B[0]), B[1] < M[0][1] && (M[0][1] = B[1]), B[1] > M[1][1] && (M[1][1] = B[1]));
      }), M;
    }), b = (o[1][0] - o[0][0]) / r, O = (o[1][1] - o[0][1]) / r, T = E.reduce(
      (P, M, B) => {
        const c = ct(
          M[0][0],
          o[0][0],
          b,
          r
        ), m = ct(
          M[1][0],
          o[0][0],
          b,
          r
        ), d = ct(
          M[0][1],
          o[0][1],
          O,
          r
        ), I = ct(
          M[1][1],
          o[0][1],
          O,
          r
        );
        for (let N = c; N <= m; N++) {
          P[N] || (P[N] = []);
          for (let R = d; R <= I; R++)
            P[N][R] || (P[N][R] = []), P[N][R].push(B);
        }
        return P;
      },
      []
    );
    this.indexedTins = {
      forw: {
        gridNum: r,
        xOrigin: s[0][0],
        yOrigin: s[0][1],
        xUnit: f,
        yUnit: u,
        gridCache: g
      },
      bakw: {
        gridNum: r,
        xOrigin: o[0][0],
        yOrigin: o[0][1],
        xUnit: b,
        yUnit: O,
        gridCache: T
      }
    };
  }
  setWh(t) {
    this.wh = t, this.xy = [0, 0], this.bounds = void 0, this.boundsPolygon = void 0, this.tins = void 0, this.indexedTins = void 0;
  }
  setVertexMode(t) {
    this.vertexMode = t, this.tins = void 0, this.indexedTins = void 0;
  }
  setStrictMode(t) {
    this.strictMode = t, this.tins = void 0, this.indexedTins = void 0;
  }
  calcurateStrictTinAsync() {
    const t = this.pointsSet.edges;
    return Promise.all(
      this.tins.forw.features.map(
        (e) => Promise.resolve(Ve(e))
      )
    ).then((e) => {
      this.tins.bakw = Q(e);
    }).then(() => {
      const e = {};
      return Promise.all(
        this.tins.forw.features.map((n, r) => {
          const s = this.tins.bakw.features[r];
          return Promise.resolve(
            We(e, { forw: n, bakw: s })
          );
        })
      ).then(
        () => Promise.all([
          lr(e),
          Promise.resolve(e)
        ])
      ).catch((n) => {
        throw n;
      });
    }).then((e) => {
      const n = e[0], r = e[1];
      return n.bakw && Object.keys(n.bakw).map((s) => {
        if (n.bakw[s] == "Not include case") return;
        const o = r[s], l = Ri(Q([o[0].forw, o[1].forw])), f = oe(Q([o[0].forw, o[1].forw]));
        if (vi(Q([f, l]))) return;
        const g = s.split("-");
        if (g[0].match(/^[0-9]+$/) && g[1].match(/^[0-9]+$/)) {
          const O = g.map((T) => parseInt(T)).sort((T, P) => T < P ? -1 : 1);
          for (let T = 0; T < t.length - 1; T++)
            if (O[0] == t[T][0] && O[1] == t[T][1])
              return;
        }
        const E = g.map(
          (O) => ["a", "b", "c"].map((T, P) => {
            const M = o[0].bakw.properties[T];
            return { geom: o[0].bakw.geometry.coordinates[0][P], prop: M };
          }).filter((T) => T.prop.index == O)[0]
        ), b = o.map(
          (O) => ["a", "b", "c"].map((T, P) => {
            const M = O.bakw.properties[T];
            return { geom: O.bakw.geometry.coordinates[0][P], prop: M };
          }).filter(
            (T) => T.prop.index != E[0].prop.index && T.prop.index != E[1].prop.index
          )[0]
        );
        Ke(r, o[0], this.tins), Ke(r, o[1], this.tins), E.map((O) => {
          const T = [
            O.geom,
            b[0].geom,
            b[1].geom,
            O.geom
          ], P = {
            a: O.prop,
            b: b[0].prop,
            c: b[1].prop
          }, M = mt([T], P), B = Ve(M);
          We(
            r,
            { forw: B, bakw: M },
            this.tins
          );
        });
      }), Promise.all(
        ["forw", "bakw"].map(
          (s) => new Promise((o) => {
            const l = this.tins[s].features.map(
              (f) => f.geometry.coordinates[0]
            );
            o(Li(l));
          }).catch((o) => {
            throw o;
          })
        )
      ).then((s) => {
        s[0].length == 0 && s[1].length == 0 ? (this.strict_status = $.STATUS_STRICT, delete this.kinks) : (this.strict_status = $.STATUS_ERROR, this.kinks = {}, s[0].length > 0 && (this.kinks.forw = Q(s[0])), s[1].length > 0 && (this.kinks.bakw = Q(s[1])));
      }).catch((s) => {
        throw s;
      });
    }).catch((e) => {
      throw e;
    });
  }
  generatePointsSet() {
    const t = { forw: [], bakw: [] };
    for (let r = 0; r < this.points.length; r++) {
      const s = this.points[r][0], o = this.points[r][1], l = Gt(s, o, r);
      t.forw.push(l), t.bakw.push(qt(l));
    }
    const e = [];
    let n = 0;
    this.edgeNodes = [], this.edges || (this.edges = []);
    for (let r = 0; r < this.edges.length; r++) {
      const s = this.edges[r][2], o = Object.assign([], this.edges[r][0]), l = Object.assign([], this.edges[r][1]);
      if (o.length === 0 && l.length === 0) {
        e.push(s);
        continue;
      }
      o.unshift(this.points[s[0]][0]), o.push(this.points[s[1]][0]), l.unshift(this.points[s[0]][1]), l.push(this.points[s[1]][1]);
      const f = [o, l].map((u) => {
        const g = u.map((b, O, T) => {
          if (O === 0) return 0;
          const P = T[O - 1];
          return Math.sqrt(
            Math.pow(b[0] - P[0], 2) + Math.pow(b[1] - P[1], 2)
          );
        }), E = g.reduce(
          (b, O, T) => T === 0 ? [0] : (b.push(b[T - 1] + O), b),
          []
        );
        return E.map((b, O, T) => {
          const P = b / T[T.length - 1];
          return [u[O], g[O], E[O], P];
        });
      });
      f.map((u, g) => {
        const E = f[g ? 0 : 1];
        return u.filter(
          (b, O) => !(O === 0 || O === u.length - 1 || b[4] === "handled")
        ).map((b) => {
          const O = b[0], T = b[3], P = E.reduce(
            (M, B, c, m) => {
              if (M) return M;
              const d = m[c + 1];
              if (B[3] === T)
                return B[4] = "handled", [B];
              if (B[3] < T && d[3] > T) return [B, d];
            },
            void 0
          );
          if (P.length === 1)
            return g === 0 ? [O, P[0][0], T] : [P[0][0], O, T];
          {
            const M = P[0], B = P[1], c = T - M[3], m = B[3] - M[3], d = c / m, I = [
              (B[0][0] - M[0][0]) * d + M[0][0],
              (B[0][1] - M[0][1]) * d + M[0][1]
            ];
            return g === 0 ? [O, I, T] : [I, O, T];
          }
        });
      }).reduce((u, g) => u.concat(g), []).sort((u, g) => u[2] < g[2] ? -1 : 1).map((u, g, E) => {
        this.edgeNodes[n] = [u[0], u[1]];
        const b = Gt(u[0], u[1], `e${n}`);
        n++, t.forw.push(b), t.bakw.push(qt(b)), g === 0 ? e.push([s[0], t.forw.length - 1]) : e.push([
          t.forw.length - 2,
          t.forw.length - 1
        ]), g === E.length - 1 && e.push([t.forw.length - 1, s[1]]);
      });
    }
    return {
      forw: Q(t.forw),
      bakw: Q(t.bakw),
      edges: e
    };
  }
  updateTinAsync() {
    let t = this.strictMode;
    const e = this.xy[0] - 0.05 * this.wh[0], n = this.xy[0] + 1.05 * this.wh[0], r = this.xy[1] - 0.05 * this.wh[1], s = this.xy[1] + 1.05 * this.wh[1], o = this.bounds ? (f) => Vt(f, this.boundsPolygon) : (f) => f[0] >= this.xy[0] && f[0] <= this.xy[0] + this.wh[0] && f[1] >= this.xy[1] && f[1] <= this.xy[1] + this.wh[1];
    return this.points.reduce(
      (f, u) => f && o(u[0]),
      !0
    ) ? new Promise((f) => {
      t != $.MODE_STRICT && t != $.MODE_LOOSE && (t = $.MODE_AUTO);
      let u = [];
      this.wh && (u = [
        [e, r],
        [n, r],
        [e, s],
        [n, s]
      ]);
      const g = this.generatePointsSet();
      f([g, u]);
    }).then((f) => {
      const u = f[0];
      return Promise.all([
        new Promise((g) => {
          g(Ft(u.forw, u.edges, "target"));
        }),
        new Promise((g) => {
          g(Ft(u.bakw, u.edges, "target"));
        }),
        new Promise((g) => {
          g(On(u.forw));
        }),
        Promise.resolve(f)
      ]).catch((g) => {
        throw g;
      });
    }).then((f) => {
      const u = f[0], g = f[1], E = f[2], b = f[3], O = b[0];
      if (u.features.length == 0 || g.features.length == 0)
        throw "TOO LINEAR1";
      const T = {
        forw: E.geometry.coordinates,
        bakw: $t(E, u)
      }, P = Gt(T.forw, T.bakw, "c");
      this.centroid = {
        forw: P,
        bakw: qt(P)
      };
      const M = {};
      return Promise.all([
        new Promise((B) => {
          const c = oe(O.forw).geometry.coordinates[0];
          let m;
          try {
            m = c.map((d) => ({
              forw: d,
              bakw: $t(at(d), u)
            }));
          } catch {
            throw "TOO LINEAR2";
          }
          m.map((d) => {
            M[`${d.forw[0]}:${d.forw[1]}`] = d;
          }), B(void 0);
        }),
        new Promise((B) => {
          const c = oe(O.bakw).geometry.coordinates[0];
          let m;
          try {
            m = c.map((d) => ({
              bakw: d,
              forw: $t(at(d), g)
            }));
          } catch {
            throw "TOO LINEAR2";
          }
          m.map((d) => {
            M[`${d.forw[0]}:${d.forw[1]}`] = d;
          }), B(void 0);
        })
      ]).then(() => [T, M, b]).catch((B) => {
        throw B;
      });
    }).then((f) => {
      const u = f[0], g = f[1], E = f[2], b = Object.keys(g).reduce(
        (T, P, M, B) => {
          const c = g[P].forw, m = g[P].bakw, d = {
            forw: [
              c[0] - u.forw[0],
              c[1] - u.forw[1]
            ]
          };
          d.bakw = [
            m[0] - u.bakw[0],
            m[1] - u.bakw[1]
          ];
          const I = d.forw[0] == 0 ? 1 / 0 : ((d.forw[0] < 0 ? e : n) - u.forw[0]) / d.forw[0], N = d.forw[1] == 0 ? 1 / 0 : ((d.forw[1] < 0 ? r : s) - u.forw[1]) / d.forw[1];
          if (Math.abs(I) / Math.abs(N) < 1.1) {
            const R = {
              forw: [
                d.forw[0] * I + u.forw[0],
                d.forw[1] * I + u.forw[1]
              ],
              bakw: [
                d.bakw[0] * I + u.bakw[0],
                d.bakw[1] * I + u.bakw[1]
              ]
            };
            d.forw[0] < 0 ? T[3].push(R) : T[1].push(R);
          }
          if (Math.abs(N) / Math.abs(I) < 1.1) {
            const R = {
              forw: [
                d.forw[0] * N + u.forw[0],
                d.forw[1] * N + u.forw[1]
              ],
              bakw: [
                d.bakw[0] * N + u.bakw[0],
                d.bakw[1] * N + u.bakw[1]
              ]
            };
            d.forw[1] < 0 ? T[0].push(R) : T[2].push(R);
          }
          return T;
        },
        [[], [], [], []]
      );
      let O = Object.keys(g).reduce(
        (T, P, M, B) => {
          const c = g[P].forw, m = g[P].bakw, d = {
            forw: [
              c[0] - u.forw[0],
              c[1] - u.forw[1]
            ]
          };
          if (d.bakw = [
            m[0] - u.bakw[0],
            u.bakw[1] - m[1]
          ], d.forw[0] == 0 || d.forw[1] == 0)
            return T;
          let I = 0;
          return d.forw[0] > 0 && (I += 1), d.forw[1] > 0 && (I += 2), T[I].push([
            d.forw,
            d.bakw
          ]), M == B.length - 1 ? T.length == T.filter((N) => N.length > 0).length && this.vertexMode == $.VERTEX_BIRDEYE ? T : T.reduce((N, R) => [N[0].concat(R)], [[]]) : T;
        },
        [[], [], [], []]
      ).map(
        (T) => (
          // Finalize calcuration of Average scaling factors and rotation factors
          T.reduce(
            (P, M, B, c) => {
              P || (P = [1 / 0, 0, 0]);
              let m = Math.sqrt(Math.pow(M[0][0], 2) + Math.pow(M[0][1], 2)) / Math.sqrt(Math.pow(M[1][0], 2) + Math.pow(M[1][1], 2));
              m = m < P[0] ? m : P[0];
              const d = Math.atan2(M[0][0], M[0][1]) - Math.atan2(M[1][0], M[1][1]), I = P[1] + Math.cos(d), N = P[2] + Math.sin(d);
              return B == c.length - 1 ? [m, Math.atan2(N, I)] : [m, I, N];
            },
            null
          )
        )
      );
      return O.length == 1 && (O = [O[0], O[0], O[0], O[0]]), [O, u, b, E];
    }).then((f) => {
      const u = f[0], g = f[1], E = f[2], b = f[3][0], O = f[3][1];
      let T = u.map((B, c) => {
        const m = O[c], d = [
          m[0] - g.forw[0],
          m[1] - g.forw[1]
        ], N = Math.sqrt(
          Math.pow(d[0], 2) + Math.pow(d[1], 2)
        ) / B[0], a = Math.atan2(d[0], d[1]) - B[1], h = [
          g.bakw[0] + N * Math.sin(a),
          g.bakw[1] - N * Math.cos(a)
        ];
        return { forw: m, bakw: h };
      });
      const P = T[2];
      T[2] = T[3], T[3] = P;
      const M = [1, 1, 1, 1];
      for (let B = 0; B < 4; B++) {
        const c = (B + 1) % 4, m = Me([T[B].bakw, T[c].bakw]);
        E[B].map((I) => {
          const N = Me([g.bakw, I.bakw]), R = Bi(m, N);
          if (R.features.length > 0 && R.features[0].geometry) {
            const a = R.features[0], h = Math.sqrt(
              Math.pow(I.bakw[0] - g.bakw[0], 2) + Math.pow(I.bakw[1] - g.bakw[1], 2)
            ), p = Math.sqrt(
              Math.pow(
                a.geometry.coordinates[0] - g.bakw[0],
                2
              ) + Math.pow(
                a.geometry.coordinates[1] - g.bakw[1],
                2
              )
            ), y = h / p;
            y > M[B] && (M[B] = y), y > M[c] && (M[c] = y);
          }
        });
      }
      return T = T.map((B, c) => {
        const m = M[c], d = [
          (B.bakw[0] - g.bakw[0]) * m + g.bakw[0],
          (B.bakw[1] - g.bakw[1]) * m + g.bakw[1]
        ];
        return { forw: B.forw, bakw: d };
      }), [T, b];
    }).then((f) => {
      const u = f[0], g = f[1], E = { forw: [], bakw: [] };
      for (let O = 0; O < u.length; O++) {
        const T = u[O].forw, P = u[O].bakw, M = Gt(T, P, `b${O}`), B = qt(M);
        g.forw.features.push(M), g.bakw.features.push(B), E.forw.push(M), E.bakw.push(B);
      }
      this.pointsSet = g, this.tins = {
        forw: Ge(
          Ft(g.forw, g.edges, "target")
        )
      };
      let b;
      return t == $.MODE_STRICT || t == $.MODE_AUTO ? b = this.calcurateStrictTinAsync() : b = Promise.resolve(), b.then(() => ((t == $.MODE_LOOSE || t == $.MODE_AUTO && this.strict_status == $.STATUS_ERROR) && (this.tins.bakw = Ge(
        Ft(g.bakw, g.edges, "target")
      ), delete this.kinks, this.strict_status = $.STATUS_LOOSE), this.vertices_params = {
        forw: qe(E.forw, this.centroid.forw),
        bakw: qe(E.bakw, this.centroid.bakw)
      }, this.addIndexedTin(), this.calculatePointsWeightAsync())).catch((O) => {
        throw O;
      });
    }).catch((f) => {
      throw f;
    }) : new Promise((f, u) => {
      u("SOME POINTS OUTSIDE");
    });
  }
  transform(t, e, n) {
    if (e && this.strict_status == $.STATUS_ERROR)
      throw 'Backward transform is not allowed if strict_status == "strict_error"';
    this.yaxisMode == $.YAXIS_FOLLOW && e && (t = [t[0], -1 * t[1]]);
    const r = at(t);
    if (this.bounds && !e && !n && !Vt(r, this.boundsPolygon))
      return !1;
    const s = e ? this.tins.bakw : this.tins.forw, o = e ? this.indexedTins.bakw : this.indexedTins.forw, l = e ? this.vertices_params.bakw : this.vertices_params.forw, f = e ? this.centroid.bakw : this.centroid.forw, u = e ? this.pointsWeightBuffer.bakw : this.pointsWeightBuffer.forw;
    let g, E;
    this.stateFull && (this.stateBackward == e ? g = this.stateTriangle : (this.stateBackward = e, this.stateTriangle = void 0), E = (O) => {
      this.stateTriangle = O;
    });
    let b = $t(
      r,
      s,
      o,
      l,
      f,
      u,
      g,
      E
    );
    if (this.bounds && e && !n) {
      const O = at(b);
      if (!Vt(O, this.boundsPolygon)) return !1;
    } else this.yaxisMode == $.YAXIS_FOLLOW && !e && (b = [b[0], -1 * b[1]]);
    return b;
  }
  calculatePointsWeightAsync() {
    const t = ["forw"];
    this.strict_status == $.STATUS_LOOSE && t.push("bakw");
    const e = {};
    return Promise.all(
      t.map((n) => {
        e[n] = {};
        const r = {}, s = this.tins[n];
        return Promise.all(
          s.features.map((o) => {
            const l = ["a", "b", "c"];
            return new Promise((f) => {
              for (let u = 0; u < 3; u++) {
                const g = (u + 1) % 3, E = l[u], b = l[g], O = o.properties[E].index, T = o.properties[b].index, P = [O, T].sort().join("-");
                if (!r[P]) {
                  const M = o.geometry.coordinates[0][u], B = o.geometry.coordinates[0][g], c = o.properties[E].geom, m = o.properties[b].geom;
                  r[P] = 1;
                  const d = Math.sqrt(
                    Math.pow(c[0] - m[0], 2) + Math.pow(c[1] - m[1], 2)
                  ) / Math.sqrt(
                    Math.pow(M[0] - B[0], 2) + Math.pow(M[1] - B[1], 2)
                  );
                  e[n][O] || (e[n][O] = {}), e[n][T] || (e[n][T] = {}), e[n][O][P] = d, e[n][T][P] = d;
                }
              }
              f(void 0);
            });
          })
        ).catch((o) => {
          throw o;
        });
      })
    ).then(() => {
      const n = {};
      t.map((r) => {
        n[r] = {}, this.strict_status == $.STATUS_STRICT && (n.bakw = {}), Object.keys(e[r]).map((s) => {
          n[r][s] = Object.keys(
            e[r][s]
          ).reduce((o, l, f, u) => (o = o + e[r][s][l], f == u.length - 1 ? o / u.length : o), 0), this.strict_status == $.STATUS_STRICT && (n.bakw[s] = 1 / n[r][s]);
        }), n[r].c = [0, 1, 2, 3].reduce(
          (s, o) => {
            const l = `b${o}`;
            return s = s + n[r][l], o == 3 ? s / 4 : s;
          },
          0
        ), this.strict_status == $.STATUS_STRICT && (n.bakw.c = 1 / n[r].c);
      }), this.pointsWeightBuffer = n;
    }).catch((n) => {
      throw n;
    });
  }
};
X($, "VERTEX_PLAIN", "plain"), X($, "VERTEX_BIRDEYE", "birdeye"), X($, "MODE_STRICT", "strict"), X($, "MODE_AUTO", "auto"), X($, "MODE_LOOSE", "loose"), X($, "STATUS_STRICT", "strict"), X($, "STATUS_ERROR", "strict_error"), X($, "STATUS_LOOSE", "loose"), X($, "YAXIS_FOLLOW", "follow"), X($, "YAXIS_INVERT", "invert");
let me = $;
function Ge(i) {
  const t = i.features;
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
  return i;
}
function qe(i, t) {
  const e = t.geometry.coordinates;
  return [0, 1, 2, 3].map((n) => {
    const r = (n + 1) % 4, s = i[n], o = i[r], l = s.geometry.coordinates, f = Math.atan2(
      l[0] - e[0],
      l[1] - e[1]
    ), u = [t, s, o, t].map(
      (b) => b.geometry.coordinates
    ), g = {
      a: {
        geom: t.properties.target.geom,
        index: t.properties.target.index
      },
      b: {
        geom: s.properties.target.geom,
        index: s.properties.target.index
      },
      c: {
        geom: o.properties.target.geom,
        index: o.properties.target.index
      }
    }, E = Q([mt([u], g)]);
    return [f, E];
  }).reduce(
    (n, r) => (n[0].push(r[0]), n[1].push(r[1]), n),
    [[], []]
  );
}
function $e(i, t = !1) {
  const e = t ? function(n) {
    return !(n >= 0 && n < Math.PI * 2);
  } : function(n) {
    return !(n > -1 * Math.PI && n <= Math.PI);
  };
  for (; e(i); )
    i = i + 2 * Math.PI * (i > 0 ? -1 : 1);
  return i;
}
function rr(i, t) {
  let e = $e(i - t[0]), n = Math.PI * 2, r;
  for (let s = 0; s < t.length; s++) {
    const o = (s + 1) % t.length, l = $e(i - t[o]), f = Math.min(Math.abs(e), Math.abs(l));
    e * l <= 0 && f < n && (n = f, r = s), e = l;
  }
  return r;
}
function Gt(i, t, e) {
  return at(i, { target: { geom: t, index: e } });
}
function qt(i) {
  return at(i.properties.target.geom, {
    target: {
      geom: i.geometry.coordinates,
      index: i.properties.target.index
    }
  });
}
function gn(i, t, e) {
  const n = t.geometry.coordinates[0][0], r = t.geometry.coordinates[0][1], s = t.geometry.coordinates[0][2], o = i.geometry.coordinates, l = t.properties.a.geom, f = t.properties.b.geom, u = t.properties.c.geom, g = [r[0] - n[0], r[1] - n[1]], E = [s[0] - n[0], s[1] - n[1]], b = [o[0] - n[0], o[1] - n[1]], O = [f[0] - l[0], f[1] - l[1]], T = [u[0] - l[0], u[1] - l[1]];
  let P = (E[1] * b[0] - E[0] * b[1]) / (g[0] * E[1] - g[1] * E[0]), M = (g[0] * b[1] - g[1] * b[0]) / (g[0] * E[1] - g[1] * E[0]);
  if (e) {
    const B = e[t.properties.a.index], c = e[t.properties.b.index], m = e[t.properties.c.index];
    let d;
    if (P < 0 || M < 0 || 1 - P - M < 0) {
      const I = P / (P + M), N = M / (P + M);
      d = P / c / (I / c + N / m), M = M / m / (I / c + N / m);
    } else
      d = P / c / (P / c + M / m + (1 - P - M) / B), M = M / m / (P / c + M / m + (1 - P - M) / B);
    P = d;
  }
  return [
    P * O[0] + M * T[0] + l[0],
    P * O[1] + M * T[1] + l[1]
  ];
}
function sr(i, t, e, n) {
  const r = i.geometry.coordinates, s = e.geometry.coordinates, o = Math.atan2(r[0] - s[0], r[1] - s[1]), l = rr(o, t[0]), f = t[1][l];
  return gn(i, f.features[0], n);
}
function ze(i, t) {
  for (let e = 0; e < t.features.length; e++)
    if (Vt(i, t.features[e]))
      return t.features[e];
}
function ct(i, t, e, n) {
  let r = Math.floor((i - t) / e);
  return r >= n && (r = n - 1), r;
}
function $t(i, t, e, n, r, s, o, l) {
  let f;
  if (o && (f = ze(i, Q([o]))), !f) {
    if (e) {
      const u = i.geometry.coordinates, g = e.gridNum, E = e.xOrigin, b = e.yOrigin, O = e.xUnit, T = e.yUnit, P = e.gridCache, M = ct(u[0], E, O, g), B = ct(u[1], b, T, g), c = P[M] ? P[M][B] ? P[M][B] : [] : [];
      t = Q(c.map((m) => t.features[m]));
    }
    f = ze(i, t);
  }
  return l && l(f), f ? gn(i, f, s) : sr(i, n, r, s);
}
function Ve(i) {
  const t = ["a", "b", "c", "a"].map(
    (s) => i.properties[s].geom
  ), e = i.geometry.coordinates[0], n = i.properties, r = {
    a: { geom: e[0], index: n.a.index },
    b: { geom: e[1], index: n.b.index },
    c: { geom: e[2], index: n.c.index }
  };
  return mt([t], r);
}
function or(i) {
  const t = [0, 1, 2, 0].map((n) => i[n][0][0]), e = {
    a: { geom: i[0][0][1], index: i[0][1] },
    b: { geom: i[1][0][1], index: i[1][1] },
    c: { geom: i[2][0][1], index: i[2][1] }
  };
  return mt([t], e);
}
function zt(i, t, e, n, r, s = !1, o) {
  const l = i.map(
    (f) => {
      (!o || o < 2.00703) && (f = mn(f));
      const u = isFinite(f) ? t[f] : f === "c" ? n : f === "b0" ? r[0] : f === "b1" ? r[1] : f === "b2" ? r[2] : f === "b3" ? r[3] : function() {
        const g = f.match(/e(\d+)/);
        if (g) {
          const E = parseInt(g[1]);
          return e[E];
        }
        throw "Bad index value for indexesToTri";
      }();
      return s ? [[u[1], u[0]], f] : [[u[0], u[1]], f];
    }
  );
  return or(l);
}
function mn(i) {
  return typeof i == "number" ? i : i.replace(/^(c|e|b)(?:ent|dgeNode|box)(\d+)?$/, "$1$2");
}
function je(i, t) {
  return Array.isArray(i[0]) ? i : i.map((e) => [
    e.illstNodes,
    e.mercNodes,
    e.startEnd
  ]);
}
function lr(i) {
  const t = { forw: {}, bakw: {} };
  return Promise.all(
    Object.keys(i).map(
      (e) => new Promise((n) => {
        const r = i[e];
        if (r.length < 2) return n(void 0);
        ["forw", "bakw"].map((s) => {
          const o = Ei(
            Q([r[0][s], r[1][s]])
          );
          if (!o || o.geometry.type == "Point" || o.geometry.type == "LineString")
            return n(void 0);
          n(void 0);
        });
      })
    )
  ).then(() => (Object.keys(t.forw).length == 0 && delete t.forw, Object.keys(t.bakw).length == 0 && delete t.bakw, t)).catch((e) => {
    throw e;
  });
}
function We(i, t, e) {
  const n = te(t.forw), r = te(t.bakw);
  if (JSON.stringify(n) != JSON.stringify(r))
    throw `${JSON.stringify(t, null, 2)}
${JSON.stringify(
      n
    )}
${JSON.stringify(r)}`;
  for (let s = 0; s < n.length; s++) {
    const o = n[s];
    i[o] || (i[o] = []), i[o].push(t);
  }
  e && (e.forw.features.push(t.forw), e.bakw.features.push(t.bakw));
}
function Ke(i, t, e) {
  const n = te(t.forw), r = te(t.bakw);
  if (JSON.stringify(n) != JSON.stringify(r))
    throw `${JSON.stringify(t, null, 2)}
${JSON.stringify(
      n
    )}
${JSON.stringify(r)}`;
  for (let s = 0; s < n.length; s++) {
    const o = n[s], l = i[o].filter(
      (f) => f.forw != t.forw
    );
    l.length == 0 ? delete i[o] : i[o] = l;
  }
  if (e) {
    let s = e.forw.features.filter(
      (o) => o != t.forw
    );
    e.forw.features = s, s = e.bakw.features.filter(
      (o) => o != t.bakw
    ), e.bakw.features = s;
  }
}
function te(i) {
  const t = ["a", "b", "c"].map(
    (e) => i.properties[e].index
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
global.Tin = me;
export {
  me as default
};
