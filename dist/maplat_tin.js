var sr = Object.defineProperty;
var or = (n, e, t) => e in n ? sr(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var vt = (n, e, t) => or(n, typeof e != "symbol" ? e + "" : e, t);
function Pe(n, e, t = {}) {
  const s = { type: "Feature" };
  return (t.id === 0 || t.id) && (s.id = t.id), t.bbox && (s.bbox = t.bbox), s.properties = e || {}, s.geometry = n, s;
}
function Ht(n, e, t = {}) {
  if (!n)
    throw new Error("coordinates is required");
  if (!Array.isArray(n))
    throw new Error("coordinates must be an Array");
  if (n.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!wn(n[0]) || !wn(n[1]))
    throw new Error("coordinates must contain numbers");
  return Pe({
    type: "Point",
    coordinates: n
  }, e, t);
}
function xe(n, e, t = {}) {
  for (const i of n) {
    if (i.length < 4)
      throw new Error(
        "Each LinearRing of a Polygon must have 4 or more Positions."
      );
    if (i[i.length - 1].length !== i[0].length)
      throw new Error("First and last Position are not equivalent.");
    for (let r = 0; r < i[i.length - 1].length; r++)
      if (i[i.length - 1][r] !== i[0][r])
        throw new Error("First and last Position are not equivalent.");
  }
  return Pe({
    type: "Polygon",
    coordinates: n
  }, e, t);
}
function mn(n, e, t = {}) {
  if (n.length < 2)
    throw new Error("coordinates must be an array of two or more positions");
  return Pe({
    type: "LineString",
    coordinates: n
  }, e, t);
}
function Vt(n, e = {}) {
  const t = { type: "FeatureCollection" };
  return e.id && (t.id = e.id), e.bbox && (t.bbox = e.bbox), t.features = n, t;
}
function wn(n) {
  return !isNaN(n) && n !== null && !Array.isArray(n);
}
function ar(n) {
  if (!n)
    throw new Error("coord is required");
  if (!Array.isArray(n)) {
    if (n.type === "Feature" && n.geometry !== null && n.geometry.type === "Point")
      return [...n.geometry.coordinates];
    if (n.type === "Point")
      return [...n.coordinates];
  }
  if (Array.isArray(n) && n.length >= 2 && !Array.isArray(n[0]) && !Array.isArray(n[1]))
    return [...n];
  throw new Error("coord must be GeoJSON Point or an Array of numbers");
}
function cr(n) {
  return n.type === "Feature" ? n.geometry : n;
}
function ln(n, e, t) {
  if (n !== null)
    for (var s, i, r, o, a, c, f, h = 0, u = 0, p, v = n.type, M = v === "FeatureCollection", k = v === "Feature", C = M ? n.features.length : 1, F = 0; F < C; F++) {
      f = M ? n.features[F].geometry : k ? n.geometry : n, p = f ? f.type === "GeometryCollection" : !1, a = p ? f.geometries.length : 1;
      for (var g = 0; g < a; g++) {
        var w = 0, l = 0;
        if (o = p ? f.geometries[g] : f, o !== null) {
          c = o.coordinates;
          var y = o.type;
          switch (h = t && (y === "Polygon" || y === "MultiPolygon") ? 1 : 0, y) {
            case null:
              break;
            case "Point":
              if (e(
                c,
                u,
                F,
                w,
                l
              ) === !1)
                return !1;
              u++, w++;
              break;
            case "LineString":
            case "MultiPoint":
              for (s = 0; s < c.length; s++) {
                if (e(
                  c[s],
                  u,
                  F,
                  w,
                  l
                ) === !1)
                  return !1;
                u++, y === "MultiPoint" && w++;
              }
              y === "LineString" && w++;
              break;
            case "Polygon":
            case "MultiLineString":
              for (s = 0; s < c.length; s++) {
                for (i = 0; i < c[s].length - h; i++) {
                  if (e(
                    c[s][i],
                    u,
                    F,
                    w,
                    l
                  ) === !1)
                    return !1;
                  u++;
                }
                y === "MultiLineString" && w++, y === "Polygon" && l++;
              }
              y === "Polygon" && w++;
              break;
            case "MultiPolygon":
              for (s = 0; s < c.length; s++) {
                for (l = 0, i = 0; i < c[s].length; i++) {
                  for (r = 0; r < c[s][i].length - h; r++) {
                    if (e(
                      c[s][i][r],
                      u,
                      F,
                      w,
                      l
                    ) === !1)
                      return !1;
                    u++;
                  }
                  l++;
                }
                w++;
              }
              break;
            case "GeometryCollection":
              for (s = 0; s < o.geometries.length; s++)
                if (ln(o.geometries[s], e, t) === !1)
                  return !1;
              break;
            default:
              throw new Error("Unknown Geometry Type");
          }
        }
      }
    }
}
const Ft = 11102230246251565e-32, rt = 134217729, zn = (3 + 8 * Ft) * Ft;
function Rt(n, e, t, s, i) {
  let r, o, a, c, f = e[0], h = s[0], u = 0, p = 0;
  h > f == h > -f ? (r = f, f = e[++u]) : (r = h, h = s[++p]);
  let v = 0;
  if (u < n && p < t)
    for (h > f == h > -f ? (o = f + r, a = r - (o - f), f = e[++u]) : (o = h + r, a = r - (o - h), h = s[++p]), r = o, a !== 0 && (i[v++] = a); u < n && p < t; )
      h > f == h > -f ? (o = r + f, c = o - r, a = r - (o - c) + (f - c), f = e[++u]) : (o = r + h, c = o - r, a = r - (o - c) + (h - c), h = s[++p]), r = o, a !== 0 && (i[v++] = a);
  for (; u < n; )
    o = r + f, c = o - r, a = r - (o - c) + (f - c), f = e[++u], r = o, a !== 0 && (i[v++] = a);
  for (; p < t; )
    o = r + h, c = o - r, a = r - (o - c) + (h - c), h = s[++p], r = o, a !== 0 && (i[v++] = a);
  return (r !== 0 || v === 0) && (i[v++] = r), v;
}
function Wt(n, e, t, s, i, r, o, a) {
  return Rt(Rt(n, e, t, s, o), o, i, r, a);
}
function q(n, e, t, s) {
  let i, r, o, a, c, f, h, u, p, v, M;
  h = rt * t, v = h - (h - t), M = t - v;
  let k = e[0];
  i = k * t, h = rt * k, u = h - (h - k), p = k - u, o = p * M - (i - u * v - p * v - u * M);
  let C = 0;
  o !== 0 && (s[C++] = o);
  for (let F = 1; F < n; F++)
    k = e[F], a = k * t, h = rt * k, u = h - (h - k), p = k - u, c = p * M - (a - u * v - p * v - u * M), r = i + c, f = r - i, o = i - (r - f) + (c - f), o !== 0 && (s[C++] = o), i = a + r, o = r - (i - a), o !== 0 && (s[C++] = o);
  return (i !== 0 || C === 0) && (s[C++] = i), C;
}
function Wn(n, e) {
  let t = e[0];
  for (let s = 1; s < n; s++) t += e[s];
  return t;
}
function bt(n) {
  return new Float64Array(n);
}
const fr = (3 + 16 * Ft) * Ft, hr = (2 + 12 * Ft) * Ft, ur = (9 + 64 * Ft) * Ft * Ft, ye = bt(4), yn = bt(8), vn = bt(12), bn = bt(16), Yt = bt(4);
function lr(n, e, t, s, i, r, o) {
  let a, c, f, h, u, p, v, M, k, C, F, g, w, l, y, m, I, B;
  const E = n - i, X = t - i, A = e - r, R = s - r;
  l = E * R, p = rt * E, v = p - (p - E), M = E - v, p = rt * R, k = p - (p - R), C = R - k, y = M * C - (l - v * k - M * k - v * C), m = A * X, p = rt * A, v = p - (p - A), M = A - v, p = rt * X, k = p - (p - X), C = X - k, I = M * C - (m - v * k - M * k - v * C), F = y - I, u = y - F, ye[0] = y - (F + u) + (u - I), g = l + F, u = g - l, w = l - (g - u) + (F - u), F = w - m, u = w - F, ye[1] = w - (F + u) + (u - m), B = g + F, u = B - g, ye[2] = g - (B - u) + (F - u), ye[3] = B;
  let j = Wn(4, ye), d = hr * o;
  if (j >= d || -j >= d || (u = n - E, a = n - (E + u) + (u - i), u = t - X, f = t - (X + u) + (u - i), u = e - A, c = e - (A + u) + (u - r), u = s - R, h = s - (R + u) + (u - r), a === 0 && c === 0 && f === 0 && h === 0) || (d = ur * o + zn * Math.abs(j), j += E * h + R * a - (A * f + X * c), j >= d || -j >= d)) return j;
  l = a * R, p = rt * a, v = p - (p - a), M = a - v, p = rt * R, k = p - (p - R), C = R - k, y = M * C - (l - v * k - M * k - v * C), m = c * X, p = rt * c, v = p - (p - c), M = c - v, p = rt * X, k = p - (p - X), C = X - k, I = M * C - (m - v * k - M * k - v * C), F = y - I, u = y - F, Yt[0] = y - (F + u) + (u - I), g = l + F, u = g - l, w = l - (g - u) + (F - u), F = w - m, u = w - F, Yt[1] = w - (F + u) + (u - m), B = g + F, u = B - g, Yt[2] = g - (B - u) + (F - u), Yt[3] = B;
  const _ = Rt(4, ye, 4, Yt, yn);
  l = E * h, p = rt * E, v = p - (p - E), M = E - v, p = rt * h, k = p - (p - h), C = h - k, y = M * C - (l - v * k - M * k - v * C), m = A * f, p = rt * A, v = p - (p - A), M = A - v, p = rt * f, k = p - (p - f), C = f - k, I = M * C - (m - v * k - M * k - v * C), F = y - I, u = y - F, Yt[0] = y - (F + u) + (u - I), g = l + F, u = g - l, w = l - (g - u) + (F - u), F = w - m, u = w - F, Yt[1] = w - (F + u) + (u - m), B = g + F, u = B - g, Yt[2] = g - (B - u) + (F - u), Yt[3] = B;
  const x = Rt(_, yn, 4, Yt, vn);
  l = a * h, p = rt * a, v = p - (p - a), M = a - v, p = rt * h, k = p - (p - h), C = h - k, y = M * C - (l - v * k - M * k - v * C), m = c * f, p = rt * c, v = p - (p - c), M = c - v, p = rt * f, k = p - (p - f), C = f - k, I = M * C - (m - v * k - M * k - v * C), F = y - I, u = y - F, Yt[0] = y - (F + u) + (u - I), g = l + F, u = g - l, w = l - (g - u) + (F - u), F = w - m, u = w - F, Yt[1] = w - (F + u) + (u - m), B = g + F, u = B - g, Yt[2] = g - (B - u) + (F - u), Yt[3] = B;
  const T = Rt(x, vn, 4, Yt, bn);
  return bn[T - 1];
}
function ie(n, e, t, s, i, r) {
  const o = (e - r) * (t - i), a = (n - i) * (s - r), c = o - a, f = Math.abs(o + a);
  return Math.abs(c) >= fr * f ? c : -lr(n, e, t, s, i, r, f);
}
const dr = (10 + 96 * Ft) * Ft, pr = (4 + 48 * Ft) * Ft, gr = (44 + 576 * Ft) * Ft * Ft, ae = bt(4), ce = bt(4), fe = bt(4), te = bt(4), ee = bt(4), ne = bt(4), Lt = bt(4), $t = bt(4), He = bt(8), Ze = bt(8), tn = bt(8), en = bt(8), nn = bt(8), rn = bt(8), Te = bt(8), Ne = bt(8), Xe = bt(8), pe = bt(4), ge = bt(4), me = bt(4), ot = bt(8), dt = bt(16), St = bt(16), Et = bt(16), xt = bt(32), he = bt(32), Tt = bt(48), qt = bt(64);
let be = bt(1152), sn = bt(1152);
function Nt(n, e, t) {
  n = Rt(n, be, e, t, sn);
  const s = be;
  return be = sn, sn = s, n;
}
function mr(n, e, t, s, i, r, o, a, c) {
  let f, h, u, p, v, M, k, C, F, g, w, l, y, m, I, B, E, X, A, R, j, d, _, x, T, P, D, b, O, L, V, U, z, Q, W;
  const ft = n - o, ct = t - o, ut = i - o, pt = e - a, mt = s - a, gt = r - a;
  V = ct * gt, _ = rt * ct, x = _ - (_ - ct), T = ct - x, _ = rt * gt, P = _ - (_ - gt), D = gt - P, U = T * D - (V - x * P - T * P - x * D), z = ut * mt, _ = rt * ut, x = _ - (_ - ut), T = ut - x, _ = rt * mt, P = _ - (_ - mt), D = mt - P, Q = T * D - (z - x * P - T * P - x * D), b = U - Q, d = U - b, ae[0] = U - (b + d) + (d - Q), O = V + b, d = O - V, L = V - (O - d) + (b - d), b = L - z, d = L - b, ae[1] = L - (b + d) + (d - z), W = O + b, d = W - O, ae[2] = O - (W - d) + (b - d), ae[3] = W, V = ut * pt, _ = rt * ut, x = _ - (_ - ut), T = ut - x, _ = rt * pt, P = _ - (_ - pt), D = pt - P, U = T * D - (V - x * P - T * P - x * D), z = ft * gt, _ = rt * ft, x = _ - (_ - ft), T = ft - x, _ = rt * gt, P = _ - (_ - gt), D = gt - P, Q = T * D - (z - x * P - T * P - x * D), b = U - Q, d = U - b, ce[0] = U - (b + d) + (d - Q), O = V + b, d = O - V, L = V - (O - d) + (b - d), b = L - z, d = L - b, ce[1] = L - (b + d) + (d - z), W = O + b, d = W - O, ce[2] = O - (W - d) + (b - d), ce[3] = W, V = ft * mt, _ = rt * ft, x = _ - (_ - ft), T = ft - x, _ = rt * mt, P = _ - (_ - mt), D = mt - P, U = T * D - (V - x * P - T * P - x * D), z = ct * pt, _ = rt * ct, x = _ - (_ - ct), T = ct - x, _ = rt * pt, P = _ - (_ - pt), D = pt - P, Q = T * D - (z - x * P - T * P - x * D), b = U - Q, d = U - b, fe[0] = U - (b + d) + (d - Q), O = V + b, d = O - V, L = V - (O - d) + (b - d), b = L - z, d = L - b, fe[1] = L - (b + d) + (d - z), W = O + b, d = W - O, fe[2] = O - (W - d) + (b - d), fe[3] = W, f = Rt(
    Rt(
      Rt(
        q(q(4, ae, ft, ot), ot, ft, dt),
        dt,
        q(q(4, ae, pt, ot), ot, pt, St),
        St,
        xt
      ),
      xt,
      Rt(
        q(q(4, ce, ct, ot), ot, ct, dt),
        dt,
        q(q(4, ce, mt, ot), ot, mt, St),
        St,
        he
      ),
      he,
      qt
    ),
    qt,
    Rt(
      q(q(4, fe, ut, ot), ot, ut, dt),
      dt,
      q(q(4, fe, gt, ot), ot, gt, St),
      St,
      xt
    ),
    xt,
    be
  );
  let Pt = Wn(f, be), Ct = pr * c;
  if (Pt >= Ct || -Pt >= Ct || (d = n - ft, h = n - (ft + d) + (d - o), d = e - pt, v = e - (pt + d) + (d - a), d = t - ct, u = t - (ct + d) + (d - o), d = s - mt, M = s - (mt + d) + (d - a), d = i - ut, p = i - (ut + d) + (d - o), d = r - gt, k = r - (gt + d) + (d - a), h === 0 && u === 0 && p === 0 && v === 0 && M === 0 && k === 0) || (Ct = gr * c + zn * Math.abs(Pt), Pt += (ft * ft + pt * pt) * (ct * k + gt * u - (mt * p + ut * M)) + 2 * (ft * h + pt * v) * (ct * gt - mt * ut) + ((ct * ct + mt * mt) * (ut * v + pt * p - (gt * h + ft * k)) + 2 * (ct * u + mt * M) * (ut * pt - gt * ft)) + ((ut * ut + gt * gt) * (ft * M + mt * h - (pt * u + ct * v)) + 2 * (ut * p + gt * k) * (ft * mt - pt * ct)), Pt >= Ct || -Pt >= Ct))
    return Pt;
  if ((u !== 0 || M !== 0 || p !== 0 || k !== 0) && (V = ft * ft, _ = rt * ft, x = _ - (_ - ft), T = ft - x, U = T * T - (V - x * x - (x + x) * T), z = pt * pt, _ = rt * pt, x = _ - (_ - pt), T = pt - x, Q = T * T - (z - x * x - (x + x) * T), b = U + Q, d = b - U, te[0] = U - (b - d) + (Q - d), O = V + b, d = O - V, L = V - (O - d) + (b - d), b = L + z, d = b - L, te[1] = L - (b - d) + (z - d), W = O + b, d = W - O, te[2] = O - (W - d) + (b - d), te[3] = W), (p !== 0 || k !== 0 || h !== 0 || v !== 0) && (V = ct * ct, _ = rt * ct, x = _ - (_ - ct), T = ct - x, U = T * T - (V - x * x - (x + x) * T), z = mt * mt, _ = rt * mt, x = _ - (_ - mt), T = mt - x, Q = T * T - (z - x * x - (x + x) * T), b = U + Q, d = b - U, ee[0] = U - (b - d) + (Q - d), O = V + b, d = O - V, L = V - (O - d) + (b - d), b = L + z, d = b - L, ee[1] = L - (b - d) + (z - d), W = O + b, d = W - O, ee[2] = O - (W - d) + (b - d), ee[3] = W), (h !== 0 || v !== 0 || u !== 0 || M !== 0) && (V = ut * ut, _ = rt * ut, x = _ - (_ - ut), T = ut - x, U = T * T - (V - x * x - (x + x) * T), z = gt * gt, _ = rt * gt, x = _ - (_ - gt), T = gt - x, Q = T * T - (z - x * x - (x + x) * T), b = U + Q, d = b - U, ne[0] = U - (b - d) + (Q - d), O = V + b, d = O - V, L = V - (O - d) + (b - d), b = L + z, d = b - L, ne[1] = L - (b - d) + (z - d), W = O + b, d = W - O, ne[2] = O - (W - d) + (b - d), ne[3] = W), h !== 0 && (C = q(4, ae, h, He), f = Nt(f, Wt(
    q(C, He, 2 * ft, dt),
    dt,
    q(q(4, ne, h, ot), ot, mt, St),
    St,
    q(q(4, ee, h, ot), ot, -gt, Et),
    Et,
    xt,
    Tt
  ), Tt)), v !== 0 && (F = q(4, ae, v, Ze), f = Nt(f, Wt(
    q(F, Ze, 2 * pt, dt),
    dt,
    q(q(4, ee, v, ot), ot, ut, St),
    St,
    q(q(4, ne, v, ot), ot, -ct, Et),
    Et,
    xt,
    Tt
  ), Tt)), u !== 0 && (g = q(4, ce, u, tn), f = Nt(f, Wt(
    q(g, tn, 2 * ct, dt),
    dt,
    q(q(4, te, u, ot), ot, gt, St),
    St,
    q(q(4, ne, u, ot), ot, -pt, Et),
    Et,
    xt,
    Tt
  ), Tt)), M !== 0 && (w = q(4, ce, M, en), f = Nt(f, Wt(
    q(w, en, 2 * mt, dt),
    dt,
    q(q(4, ne, M, ot), ot, ft, St),
    St,
    q(q(4, te, M, ot), ot, -ut, Et),
    Et,
    xt,
    Tt
  ), Tt)), p !== 0 && (l = q(4, fe, p, nn), f = Nt(f, Wt(
    q(l, nn, 2 * ut, dt),
    dt,
    q(q(4, ee, p, ot), ot, pt, St),
    St,
    q(q(4, te, p, ot), ot, -mt, Et),
    Et,
    xt,
    Tt
  ), Tt)), k !== 0 && (y = q(4, fe, k, rn), f = Nt(f, Wt(
    q(y, rn, 2 * gt, dt),
    dt,
    q(q(4, te, k, ot), ot, ct, St),
    St,
    q(q(4, ee, k, ot), ot, -ft, Et),
    Et,
    xt,
    Tt
  ), Tt)), h !== 0 || v !== 0) {
    if (u !== 0 || M !== 0 || p !== 0 || k !== 0 ? (V = u * gt, _ = rt * u, x = _ - (_ - u), T = u - x, _ = rt * gt, P = _ - (_ - gt), D = gt - P, U = T * D - (V - x * P - T * P - x * D), z = ct * k, _ = rt * ct, x = _ - (_ - ct), T = ct - x, _ = rt * k, P = _ - (_ - k), D = k - P, Q = T * D - (z - x * P - T * P - x * D), b = U + Q, d = b - U, Lt[0] = U - (b - d) + (Q - d), O = V + b, d = O - V, L = V - (O - d) + (b - d), b = L + z, d = b - L, Lt[1] = L - (b - d) + (z - d), W = O + b, d = W - O, Lt[2] = O - (W - d) + (b - d), Lt[3] = W, V = p * -mt, _ = rt * p, x = _ - (_ - p), T = p - x, _ = rt * -mt, P = _ - (_ - -mt), D = -mt - P, U = T * D - (V - x * P - T * P - x * D), z = ut * -M, _ = rt * ut, x = _ - (_ - ut), T = ut - x, _ = rt * -M, P = _ - (_ - -M), D = -M - P, Q = T * D - (z - x * P - T * P - x * D), b = U + Q, d = b - U, $t[0] = U - (b - d) + (Q - d), O = V + b, d = O - V, L = V - (O - d) + (b - d), b = L + z, d = b - L, $t[1] = L - (b - d) + (z - d), W = O + b, d = W - O, $t[2] = O - (W - d) + (b - d), $t[3] = W, I = Rt(4, Lt, 4, $t, Ne), V = u * k, _ = rt * u, x = _ - (_ - u), T = u - x, _ = rt * k, P = _ - (_ - k), D = k - P, U = T * D - (V - x * P - T * P - x * D), z = p * M, _ = rt * p, x = _ - (_ - p), T = p - x, _ = rt * M, P = _ - (_ - M), D = M - P, Q = T * D - (z - x * P - T * P - x * D), b = U - Q, d = U - b, ge[0] = U - (b + d) + (d - Q), O = V + b, d = O - V, L = V - (O - d) + (b - d), b = L - z, d = L - b, ge[1] = L - (b + d) + (d - z), W = O + b, d = W - O, ge[2] = O - (W - d) + (b - d), ge[3] = W, X = 4) : (Ne[0] = 0, I = 1, ge[0] = 0, X = 1), h !== 0) {
      const kt = q(I, Ne, h, Et);
      f = Nt(f, Rt(
        q(C, He, h, dt),
        dt,
        q(kt, Et, 2 * ft, xt),
        xt,
        Tt
      ), Tt);
      const Mt = q(X, ge, h, ot);
      f = Nt(f, Wt(
        q(Mt, ot, 2 * ft, dt),
        dt,
        q(Mt, ot, h, St),
        St,
        q(kt, Et, h, xt),
        xt,
        he,
        qt
      ), qt), M !== 0 && (f = Nt(f, q(q(4, ne, h, ot), ot, M, dt), dt)), k !== 0 && (f = Nt(f, q(q(4, ee, -h, ot), ot, k, dt), dt));
    }
    if (v !== 0) {
      const kt = q(I, Ne, v, Et);
      f = Nt(f, Rt(
        q(F, Ze, v, dt),
        dt,
        q(kt, Et, 2 * pt, xt),
        xt,
        Tt
      ), Tt);
      const Mt = q(X, ge, v, ot);
      f = Nt(f, Wt(
        q(Mt, ot, 2 * pt, dt),
        dt,
        q(Mt, ot, v, St),
        St,
        q(kt, Et, v, xt),
        xt,
        he,
        qt
      ), qt);
    }
  }
  if (u !== 0 || M !== 0) {
    if (p !== 0 || k !== 0 || h !== 0 || v !== 0 ? (V = p * pt, _ = rt * p, x = _ - (_ - p), T = p - x, _ = rt * pt, P = _ - (_ - pt), D = pt - P, U = T * D - (V - x * P - T * P - x * D), z = ut * v, _ = rt * ut, x = _ - (_ - ut), T = ut - x, _ = rt * v, P = _ - (_ - v), D = v - P, Q = T * D - (z - x * P - T * P - x * D), b = U + Q, d = b - U, Lt[0] = U - (b - d) + (Q - d), O = V + b, d = O - V, L = V - (O - d) + (b - d), b = L + z, d = b - L, Lt[1] = L - (b - d) + (z - d), W = O + b, d = W - O, Lt[2] = O - (W - d) + (b - d), Lt[3] = W, R = -gt, j = -k, V = h * R, _ = rt * h, x = _ - (_ - h), T = h - x, _ = rt * R, P = _ - (_ - R), D = R - P, U = T * D - (V - x * P - T * P - x * D), z = ft * j, _ = rt * ft, x = _ - (_ - ft), T = ft - x, _ = rt * j, P = _ - (_ - j), D = j - P, Q = T * D - (z - x * P - T * P - x * D), b = U + Q, d = b - U, $t[0] = U - (b - d) + (Q - d), O = V + b, d = O - V, L = V - (O - d) + (b - d), b = L + z, d = b - L, $t[1] = L - (b - d) + (z - d), W = O + b, d = W - O, $t[2] = O - (W - d) + (b - d), $t[3] = W, B = Rt(4, Lt, 4, $t, Xe), V = p * v, _ = rt * p, x = _ - (_ - p), T = p - x, _ = rt * v, P = _ - (_ - v), D = v - P, U = T * D - (V - x * P - T * P - x * D), z = h * k, _ = rt * h, x = _ - (_ - h), T = h - x, _ = rt * k, P = _ - (_ - k), D = k - P, Q = T * D - (z - x * P - T * P - x * D), b = U - Q, d = U - b, me[0] = U - (b + d) + (d - Q), O = V + b, d = O - V, L = V - (O - d) + (b - d), b = L - z, d = L - b, me[1] = L - (b + d) + (d - z), W = O + b, d = W - O, me[2] = O - (W - d) + (b - d), me[3] = W, A = 4) : (Xe[0] = 0, B = 1, me[0] = 0, A = 1), u !== 0) {
      const kt = q(B, Xe, u, Et);
      f = Nt(f, Rt(
        q(g, tn, u, dt),
        dt,
        q(kt, Et, 2 * ct, xt),
        xt,
        Tt
      ), Tt);
      const Mt = q(A, me, u, ot);
      f = Nt(f, Wt(
        q(Mt, ot, 2 * ct, dt),
        dt,
        q(Mt, ot, u, St),
        St,
        q(kt, Et, u, xt),
        xt,
        he,
        qt
      ), qt), k !== 0 && (f = Nt(f, q(q(4, te, u, ot), ot, k, dt), dt)), v !== 0 && (f = Nt(f, q(q(4, ne, -u, ot), ot, v, dt), dt));
    }
    if (M !== 0) {
      const kt = q(B, Xe, M, Et);
      f = Nt(f, Rt(
        q(w, en, M, dt),
        dt,
        q(kt, Et, 2 * mt, xt),
        xt,
        Tt
      ), Tt);
      const Mt = q(A, me, M, ot);
      f = Nt(f, Wt(
        q(Mt, ot, 2 * mt, dt),
        dt,
        q(Mt, ot, M, St),
        St,
        q(kt, Et, M, xt),
        xt,
        he,
        qt
      ), qt);
    }
  }
  if (p !== 0 || k !== 0) {
    if (h !== 0 || v !== 0 || u !== 0 || M !== 0 ? (V = h * mt, _ = rt * h, x = _ - (_ - h), T = h - x, _ = rt * mt, P = _ - (_ - mt), D = mt - P, U = T * D - (V - x * P - T * P - x * D), z = ft * M, _ = rt * ft, x = _ - (_ - ft), T = ft - x, _ = rt * M, P = _ - (_ - M), D = M - P, Q = T * D - (z - x * P - T * P - x * D), b = U + Q, d = b - U, Lt[0] = U - (b - d) + (Q - d), O = V + b, d = O - V, L = V - (O - d) + (b - d), b = L + z, d = b - L, Lt[1] = L - (b - d) + (z - d), W = O + b, d = W - O, Lt[2] = O - (W - d) + (b - d), Lt[3] = W, R = -pt, j = -v, V = u * R, _ = rt * u, x = _ - (_ - u), T = u - x, _ = rt * R, P = _ - (_ - R), D = R - P, U = T * D - (V - x * P - T * P - x * D), z = ct * j, _ = rt * ct, x = _ - (_ - ct), T = ct - x, _ = rt * j, P = _ - (_ - j), D = j - P, Q = T * D - (z - x * P - T * P - x * D), b = U + Q, d = b - U, $t[0] = U - (b - d) + (Q - d), O = V + b, d = O - V, L = V - (O - d) + (b - d), b = L + z, d = b - L, $t[1] = L - (b - d) + (z - d), W = O + b, d = W - O, $t[2] = O - (W - d) + (b - d), $t[3] = W, m = Rt(4, Lt, 4, $t, Te), V = h * M, _ = rt * h, x = _ - (_ - h), T = h - x, _ = rt * M, P = _ - (_ - M), D = M - P, U = T * D - (V - x * P - T * P - x * D), z = u * v, _ = rt * u, x = _ - (_ - u), T = u - x, _ = rt * v, P = _ - (_ - v), D = v - P, Q = T * D - (z - x * P - T * P - x * D), b = U - Q, d = U - b, pe[0] = U - (b + d) + (d - Q), O = V + b, d = O - V, L = V - (O - d) + (b - d), b = L - z, d = L - b, pe[1] = L - (b + d) + (d - z), W = O + b, d = W - O, pe[2] = O - (W - d) + (b - d), pe[3] = W, E = 4) : (Te[0] = 0, m = 1, pe[0] = 0, E = 1), p !== 0) {
      const kt = q(m, Te, p, Et);
      f = Nt(f, Rt(
        q(l, nn, p, dt),
        dt,
        q(kt, Et, 2 * ut, xt),
        xt,
        Tt
      ), Tt);
      const Mt = q(E, pe, p, ot);
      f = Nt(f, Wt(
        q(Mt, ot, 2 * ut, dt),
        dt,
        q(Mt, ot, p, St),
        St,
        q(kt, Et, p, xt),
        xt,
        he,
        qt
      ), qt), v !== 0 && (f = Nt(f, q(q(4, ee, p, ot), ot, v, dt), dt)), M !== 0 && (f = Nt(f, q(q(4, te, -p, ot), ot, M, dt), dt));
    }
    if (k !== 0) {
      const kt = q(m, Te, k, Et);
      f = Nt(f, Rt(
        q(y, rn, k, dt),
        dt,
        q(kt, Et, 2 * gt, xt),
        xt,
        Tt
      ), Tt);
      const Mt = q(E, pe, k, ot);
      f = Nt(f, Wt(
        q(Mt, ot, 2 * gt, dt),
        dt,
        q(Mt, ot, k, St),
        St,
        q(kt, Et, k, xt),
        xt,
        he,
        qt
      ), qt);
    }
  }
  return be[f - 1];
}
function wr(n, e, t, s, i, r, o, a) {
  const c = n - o, f = t - o, h = i - o, u = e - a, p = s - a, v = r - a, M = f * v, k = h * p, C = c * c + u * u, F = h * u, g = c * v, w = f * f + p * p, l = c * p, y = f * u, m = h * h + v * v, I = C * (M - k) + w * (F - g) + m * (l - y), B = (Math.abs(M) + Math.abs(k)) * C + (Math.abs(F) + Math.abs(g)) * w + (Math.abs(l) + Math.abs(y)) * m, E = dr * B;
  return I > E || -I > E ? I : mr(n, e, t, s, i, r, o, a, B);
}
function yr(n, e) {
  var t, s, i = 0, r, o, a, c, f, h, u, p = n[0], v = n[1], M = e.length;
  for (t = 0; t < M; t++) {
    s = 0;
    var k = e[t], C = k.length - 1;
    if (h = k[0], h[0] !== k[C][0] && h[1] !== k[C][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (o = h[0] - p, a = h[1] - v, s; s < C; s++) {
      if (u = k[s + 1], c = u[0] - p, f = u[1] - v, a === 0 && f === 0) {
        if (c <= 0 && o >= 0 || o <= 0 && c >= 0)
          return 0;
      } else if (f >= 0 && a <= 0 || f <= 0 && a >= 0) {
        if (r = ie(o, c, a, f, 0, 0), r === 0)
          return 0;
        (r > 0 && f > 0 && a <= 0 || r < 0 && f <= 0 && a > 0) && i++;
      }
      h = u, a = f, o = c;
    }
  }
  return i % 2 !== 0;
}
function on(n, e, t = {}) {
  if (!n)
    throw new Error("point is required");
  if (!e)
    throw new Error("polygon is required");
  const s = ar(n), i = cr(e), r = i.type, o = e.bbox;
  let a = i.coordinates;
  if (o && vr(s, o) === !1)
    return !1;
  r === "Polygon" && (a = [a]);
  let c = !1;
  for (var f = 0; f < a.length; ++f) {
    const h = yr(s, a[f]);
    if (h === 0) return !t.ignoreBoundary;
    h && (c = !0);
  }
  return c;
}
function vr(n, e) {
  return e[0] <= n[0] && e[1] <= n[1] && e[2] >= n[0] && e[3] >= n[1];
}
let Gn = class {
  constructor(e = [], t = br) {
    if (this.data = e, this.length = this.data.length, this.compare = t, this.length > 0)
      for (let s = (this.length >> 1) - 1; s >= 0; s--) this._down(s);
  }
  push(e) {
    this.data.push(e), this.length++, this._up(this.length - 1);
  }
  pop() {
    if (this.length === 0) return;
    const e = this.data[0], t = this.data.pop();
    return this.length--, this.length > 0 && (this.data[0] = t, this._down(0)), e;
  }
  peek() {
    return this.data[0];
  }
  _up(e) {
    const { data: t, compare: s } = this, i = t[e];
    for (; e > 0; ) {
      const r = e - 1 >> 1, o = t[r];
      if (s(i, o) >= 0) break;
      t[e] = o, e = r;
    }
    t[e] = i;
  }
  _down(e) {
    const { data: t, compare: s } = this, i = this.length >> 1, r = t[e];
    for (; e < i; ) {
      let o = (e << 1) + 1, a = t[o];
      const c = o + 1;
      if (c < this.length && s(t[c], a) < 0 && (o = c, a = t[c]), s(a, r) >= 0) break;
      t[e] = a, e = o;
    }
    t[e] = r;
  }
};
function br(n, e) {
  return n < e ? -1 : n > e ? 1 : 0;
}
function Jn(n, e) {
  return n.p.x > e.p.x ? 1 : n.p.x < e.p.x ? -1 : n.p.y !== e.p.y ? n.p.y > e.p.y ? 1 : -1 : 1;
}
function xr(n, e) {
  return n.rightSweepEvent.p.x > e.rightSweepEvent.p.x ? 1 : n.rightSweepEvent.p.x < e.rightSweepEvent.p.x ? -1 : n.rightSweepEvent.p.y !== e.rightSweepEvent.p.y ? n.rightSweepEvent.p.y < e.rightSweepEvent.p.y ? 1 : -1 : 1;
}
class xn {
  constructor(e, t, s, i) {
    this.p = {
      x: e[0],
      y: e[1]
    }, this.featureId = t, this.ringId = s, this.eventId = i, this.otherEvent = null, this.isLeftEndpoint = null;
  }
  isSamePoint(e) {
    return this.p.x === e.p.x && this.p.y === e.p.y;
  }
}
function _r(n, e) {
  if (n.type === "FeatureCollection") {
    const t = n.features;
    for (let s = 0; s < t.length; s++)
      _n(t[s], e);
  } else
    _n(n, e);
}
let Ce = 0, Re = 0, De = 0;
function _n(n, e) {
  const t = n.type === "Feature" ? n.geometry : n;
  let s = t.coordinates;
  (t.type === "Polygon" || t.type === "MultiLineString") && (s = [s]), t.type === "LineString" && (s = [[s]]);
  for (let i = 0; i < s.length; i++)
    for (let r = 0; r < s[i].length; r++) {
      let o = s[i][r][0], a = null;
      Re = Re + 1;
      for (let c = 0; c < s[i][r].length - 1; c++) {
        a = s[i][r][c + 1];
        const f = new xn(o, Ce, Re, De), h = new xn(a, Ce, Re, De + 1);
        f.otherEvent = h, h.otherEvent = f, Jn(f, h) > 0 ? (h.isLeftEndpoint = !0, f.isLeftEndpoint = !1) : (f.isLeftEndpoint = !0, h.isLeftEndpoint = !1), e.push(f), e.push(h), o = a, De = De + 1;
      }
    }
  Ce = Ce + 1;
}
class Mr {
  constructor(e) {
    this.leftSweepEvent = e, this.rightSweepEvent = e.otherEvent;
  }
}
function kr(n, e) {
  if (n === null || e === null || n.leftSweepEvent.ringId === e.leftSweepEvent.ringId && (n.rightSweepEvent.isSamePoint(e.leftSweepEvent) || n.rightSweepEvent.isSamePoint(e.leftSweepEvent) || n.rightSweepEvent.isSamePoint(e.rightSweepEvent) || n.leftSweepEvent.isSamePoint(e.leftSweepEvent) || n.leftSweepEvent.isSamePoint(e.rightSweepEvent))) return !1;
  const t = n.leftSweepEvent.p.x, s = n.leftSweepEvent.p.y, i = n.rightSweepEvent.p.x, r = n.rightSweepEvent.p.y, o = e.leftSweepEvent.p.x, a = e.leftSweepEvent.p.y, c = e.rightSweepEvent.p.x, f = e.rightSweepEvent.p.y, h = (f - a) * (i - t) - (c - o) * (r - s), u = (c - o) * (s - a) - (f - a) * (t - o), p = (i - t) * (s - a) - (r - s) * (t - o);
  if (h === 0)
    return !1;
  const v = u / h, M = p / h;
  if (v >= 0 && v <= 1 && M >= 0 && M <= 1) {
    const k = t + v * (i - t), C = s + v * (r - s);
    return [k, C];
  }
  return !1;
}
function Sr(n, e) {
  e = e || !1;
  const t = [], s = new Gn([], xr);
  for (; n.length; ) {
    const i = n.pop();
    if (i.isLeftEndpoint) {
      const r = new Mr(i);
      for (let o = 0; o < s.data.length; o++) {
        const a = s.data[o];
        if (e && a.leftSweepEvent.featureId === i.featureId)
          continue;
        const c = kr(r, a);
        c !== !1 && t.push(c);
      }
      s.push(r);
    } else i.isLeftEndpoint === !1 && s.pop();
  }
  return t;
}
function Er(n, e) {
  const t = new Gn([], Jn);
  return _r(n, t), Sr(t, e);
}
var Ar = Er;
function Ir(n, e, t = {}) {
  const { removeDuplicates: s = !0, ignoreSelfIntersections: i = !0 } = t;
  let r = [];
  n.type === "FeatureCollection" ? r = r.concat(n.features) : n.type === "Feature" ? r.push(n) : (n.type === "LineString" || n.type === "Polygon" || n.type === "MultiLineString" || n.type === "MultiPolygon") && r.push(Pe(n)), e.type === "FeatureCollection" ? r = r.concat(e.features) : e.type === "Feature" ? r.push(e) : (e.type === "LineString" || e.type === "Polygon" || e.type === "MultiLineString" || e.type === "MultiPolygon") && r.push(Pe(e));
  const o = Ar(
    Vt(r),
    i
  );
  let a = [];
  if (s) {
    const c = {};
    o.forEach((f) => {
      const h = f.join(",");
      c[h] || (c[h] = !0, a.push(f));
    });
  } else
    a = o;
  return Vt(a.map((c) => Ht(c)));
}
function Pr(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
function Br(n) {
  if (Object.prototype.hasOwnProperty.call(n, "__esModule")) return n;
  var e = n.default;
  if (typeof e == "function") {
    var t = function s() {
      return this instanceof s ? Reflect.construct(e, arguments, this.constructor) : e.apply(this, arguments);
    };
    t.prototype = e.prototype;
  } else t = {};
  return Object.defineProperty(t, "__esModule", { value: !0 }), Object.keys(n).forEach(function(s) {
    var i = Object.getOwnPropertyDescriptor(n, s);
    Object.defineProperty(t, s, i.get ? i : {
      enumerable: !0,
      get: function() {
        return n[s];
      }
    });
  }), t;
}
function Or(n, e = {}) {
  let t = 0, s = 0, i = 0;
  return ln(
    n,
    function(r) {
      t += r[0], s += r[1], i++;
    },
    !0
  ), Ht([t / i, s / i], e.properties);
}
var Fe = { exports: {} }, ze = { exports: {} }, Tr = ze.exports, Mn;
function Nr() {
  return Mn || (Mn = 1, (function(n, e) {
    (function(t, s) {
      n.exports = s();
    })(Tr, function() {
      function t(g, w, l, y, m) {
        (function I(B, E, X, A, R) {
          for (; A > X; ) {
            if (A - X > 600) {
              var j = A - X + 1, d = E - X + 1, _ = Math.log(j), x = 0.5 * Math.exp(2 * _ / 3), T = 0.5 * Math.sqrt(_ * x * (j - x) / j) * (d - j / 2 < 0 ? -1 : 1), P = Math.max(X, Math.floor(E - d * x / j + T)), D = Math.min(A, Math.floor(E + (j - d) * x / j + T));
              I(B, E, P, D, R);
            }
            var b = B[E], O = X, L = A;
            for (s(B, X, E), R(B[A], b) > 0 && s(B, X, A); O < L; ) {
              for (s(B, O, L), O++, L--; R(B[O], b) < 0; ) O++;
              for (; R(B[L], b) > 0; ) L--;
            }
            R(B[X], b) === 0 ? s(B, X, L) : s(B, ++L, A), L <= E && (X = L + 1), E <= L && (A = L - 1);
          }
        })(g, w, l || 0, y || g.length - 1, m || i);
      }
      function s(g, w, l) {
        var y = g[w];
        g[w] = g[l], g[l] = y;
      }
      function i(g, w) {
        return g < w ? -1 : g > w ? 1 : 0;
      }
      var r = function(g) {
        g === void 0 && (g = 9), this._maxEntries = Math.max(4, g), this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries)), this.clear();
      };
      function o(g, w, l) {
        if (!l) return w.indexOf(g);
        for (var y = 0; y < w.length; y++) if (l(g, w[y])) return y;
        return -1;
      }
      function a(g, w) {
        c(g, 0, g.children.length, w, g);
      }
      function c(g, w, l, y, m) {
        m || (m = C(null)), m.minX = 1 / 0, m.minY = 1 / 0, m.maxX = -1 / 0, m.maxY = -1 / 0;
        for (var I = w; I < l; I++) {
          var B = g.children[I];
          f(m, g.leaf ? y(B) : B);
        }
        return m;
      }
      function f(g, w) {
        return g.minX = Math.min(g.minX, w.minX), g.minY = Math.min(g.minY, w.minY), g.maxX = Math.max(g.maxX, w.maxX), g.maxY = Math.max(g.maxY, w.maxY), g;
      }
      function h(g, w) {
        return g.minX - w.minX;
      }
      function u(g, w) {
        return g.minY - w.minY;
      }
      function p(g) {
        return (g.maxX - g.minX) * (g.maxY - g.minY);
      }
      function v(g) {
        return g.maxX - g.minX + (g.maxY - g.minY);
      }
      function M(g, w) {
        return g.minX <= w.minX && g.minY <= w.minY && w.maxX <= g.maxX && w.maxY <= g.maxY;
      }
      function k(g, w) {
        return w.minX <= g.maxX && w.minY <= g.maxY && w.maxX >= g.minX && w.maxY >= g.minY;
      }
      function C(g) {
        return { children: g, height: 1, leaf: !0, minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
      }
      function F(g, w, l, y, m) {
        for (var I = [w, l]; I.length; ) if (!((l = I.pop()) - (w = I.pop()) <= y)) {
          var B = w + Math.ceil((l - w) / y / 2) * y;
          t(g, B, w, l, m), I.push(w, B, B, l);
        }
      }
      return r.prototype.all = function() {
        return this._all(this.data, []);
      }, r.prototype.search = function(g) {
        var w = this.data, l = [];
        if (!k(g, w)) return l;
        for (var y = this.toBBox, m = []; w; ) {
          for (var I = 0; I < w.children.length; I++) {
            var B = w.children[I], E = w.leaf ? y(B) : B;
            k(g, E) && (w.leaf ? l.push(B) : M(g, E) ? this._all(B, l) : m.push(B));
          }
          w = m.pop();
        }
        return l;
      }, r.prototype.collides = function(g) {
        var w = this.data;
        if (!k(g, w)) return !1;
        for (var l = []; w; ) {
          for (var y = 0; y < w.children.length; y++) {
            var m = w.children[y], I = w.leaf ? this.toBBox(m) : m;
            if (k(g, I)) {
              if (w.leaf || M(g, I)) return !0;
              l.push(m);
            }
          }
          w = l.pop();
        }
        return !1;
      }, r.prototype.load = function(g) {
        if (!g || !g.length) return this;
        if (g.length < this._minEntries) {
          for (var w = 0; w < g.length; w++) this.insert(g[w]);
          return this;
        }
        var l = this._build(g.slice(), 0, g.length - 1, 0);
        if (this.data.children.length) if (this.data.height === l.height) this._splitRoot(this.data, l);
        else {
          if (this.data.height < l.height) {
            var y = this.data;
            this.data = l, l = y;
          }
          this._insert(l, this.data.height - l.height - 1, !0);
        }
        else this.data = l;
        return this;
      }, r.prototype.insert = function(g) {
        return g && this._insert(g, this.data.height - 1), this;
      }, r.prototype.clear = function() {
        return this.data = C([]), this;
      }, r.prototype.remove = function(g, w) {
        if (!g) return this;
        for (var l, y, m, I = this.data, B = this.toBBox(g), E = [], X = []; I || E.length; ) {
          if (I || (I = E.pop(), y = E[E.length - 1], l = X.pop(), m = !0), I.leaf) {
            var A = o(g, I.children, w);
            if (A !== -1) return I.children.splice(A, 1), E.push(I), this._condense(E), this;
          }
          m || I.leaf || !M(I, B) ? y ? (l++, I = y.children[l], m = !1) : I = null : (E.push(I), X.push(l), l = 0, y = I, I = I.children[0]);
        }
        return this;
      }, r.prototype.toBBox = function(g) {
        return g;
      }, r.prototype.compareMinX = function(g, w) {
        return g.minX - w.minX;
      }, r.prototype.compareMinY = function(g, w) {
        return g.minY - w.minY;
      }, r.prototype.toJSON = function() {
        return this.data;
      }, r.prototype.fromJSON = function(g) {
        return this.data = g, this;
      }, r.prototype._all = function(g, w) {
        for (var l = []; g; ) g.leaf ? w.push.apply(w, g.children) : l.push.apply(l, g.children), g = l.pop();
        return w;
      }, r.prototype._build = function(g, w, l, y) {
        var m, I = l - w + 1, B = this._maxEntries;
        if (I <= B) return a(m = C(g.slice(w, l + 1)), this.toBBox), m;
        y || (y = Math.ceil(Math.log(I) / Math.log(B)), B = Math.ceil(I / Math.pow(B, y - 1))), (m = C([])).leaf = !1, m.height = y;
        var E = Math.ceil(I / B), X = E * Math.ceil(Math.sqrt(B));
        F(g, w, l, X, this.compareMinX);
        for (var A = w; A <= l; A += X) {
          var R = Math.min(A + X - 1, l);
          F(g, A, R, E, this.compareMinY);
          for (var j = A; j <= R; j += E) {
            var d = Math.min(j + E - 1, R);
            m.children.push(this._build(g, j, d, y - 1));
          }
        }
        return a(m, this.toBBox), m;
      }, r.prototype._chooseSubtree = function(g, w, l, y) {
        for (; y.push(w), !w.leaf && y.length - 1 !== l; ) {
          for (var m = 1 / 0, I = 1 / 0, B = void 0, E = 0; E < w.children.length; E++) {
            var X = w.children[E], A = p(X), R = (j = g, d = X, (Math.max(d.maxX, j.maxX) - Math.min(d.minX, j.minX)) * (Math.max(d.maxY, j.maxY) - Math.min(d.minY, j.minY)) - A);
            R < I ? (I = R, m = A < m ? A : m, B = X) : R === I && A < m && (m = A, B = X);
          }
          w = B || w.children[0];
        }
        var j, d;
        return w;
      }, r.prototype._insert = function(g, w, l) {
        var y = l ? g : this.toBBox(g), m = [], I = this._chooseSubtree(y, this.data, w, m);
        for (I.children.push(g), f(I, y); w >= 0 && m[w].children.length > this._maxEntries; ) this._split(m, w), w--;
        this._adjustParentBBoxes(y, m, w);
      }, r.prototype._split = function(g, w) {
        var l = g[w], y = l.children.length, m = this._minEntries;
        this._chooseSplitAxis(l, m, y);
        var I = this._chooseSplitIndex(l, m, y), B = C(l.children.splice(I, l.children.length - I));
        B.height = l.height, B.leaf = l.leaf, a(l, this.toBBox), a(B, this.toBBox), w ? g[w - 1].children.push(B) : this._splitRoot(l, B);
      }, r.prototype._splitRoot = function(g, w) {
        this.data = C([g, w]), this.data.height = g.height + 1, this.data.leaf = !1, a(this.data, this.toBBox);
      }, r.prototype._chooseSplitIndex = function(g, w, l) {
        for (var y, m, I, B, E, X, A, R = 1 / 0, j = 1 / 0, d = w; d <= l - w; d++) {
          var _ = c(g, 0, d, this.toBBox), x = c(g, d, l, this.toBBox), T = (m = _, I = x, B = void 0, E = void 0, X = void 0, A = void 0, B = Math.max(m.minX, I.minX), E = Math.max(m.minY, I.minY), X = Math.min(m.maxX, I.maxX), A = Math.min(m.maxY, I.maxY), Math.max(0, X - B) * Math.max(0, A - E)), P = p(_) + p(x);
          T < R ? (R = T, y = d, j = P < j ? P : j) : T === R && P < j && (j = P, y = d);
        }
        return y || l - w;
      }, r.prototype._chooseSplitAxis = function(g, w, l) {
        var y = g.leaf ? this.compareMinX : h, m = g.leaf ? this.compareMinY : u;
        this._allDistMargin(g, w, l, y) < this._allDistMargin(g, w, l, m) && g.children.sort(y);
      }, r.prototype._allDistMargin = function(g, w, l, y) {
        g.children.sort(y);
        for (var m = this.toBBox, I = c(g, 0, w, m), B = c(g, l - w, l, m), E = v(I) + v(B), X = w; X < l - w; X++) {
          var A = g.children[X];
          f(I, g.leaf ? m(A) : A), E += v(I);
        }
        for (var R = l - w - 1; R >= w; R--) {
          var j = g.children[R];
          f(B, g.leaf ? m(j) : j), E += v(B);
        }
        return E;
      }, r.prototype._adjustParentBBoxes = function(g, w, l) {
        for (var y = l; y >= 0; y--) f(w[y], g);
      }, r.prototype._condense = function(g) {
        for (var w = g.length - 1, l = void 0; w >= 0; w--) g[w].children.length === 0 ? w > 0 ? (l = g[w - 1].children).splice(l.indexOf(g[w]), 1) : this.clear() : a(g[w], this.toBBox);
      }, r;
    });
  })(ze)), ze.exports;
}
class Xr {
  constructor(e = [], t = Cr) {
    if (this.data = e, this.length = this.data.length, this.compare = t, this.length > 0)
      for (let s = (this.length >> 1) - 1; s >= 0; s--) this._down(s);
  }
  push(e) {
    this.data.push(e), this.length++, this._up(this.length - 1);
  }
  pop() {
    if (this.length === 0) return;
    const e = this.data[0], t = this.data.pop();
    return this.length--, this.length > 0 && (this.data[0] = t, this._down(0)), e;
  }
  peek() {
    return this.data[0];
  }
  _up(e) {
    const { data: t, compare: s } = this, i = t[e];
    for (; e > 0; ) {
      const r = e - 1 >> 1, o = t[r];
      if (s(i, o) >= 0) break;
      t[e] = o, e = r;
    }
    t[e] = i;
  }
  _down(e) {
    const { data: t, compare: s } = this, i = this.length >> 1, r = t[e];
    for (; e < i; ) {
      let o = (e << 1) + 1, a = t[o];
      const c = o + 1;
      if (c < this.length && s(t[c], a) < 0 && (o = c, a = t[c]), s(a, r) >= 0) break;
      t[e] = a, e = o;
    }
    t[e] = r;
  }
}
function Cr(n, e) {
  return n < e ? -1 : n > e ? 1 : 0;
}
const Rr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Xr
}, Symbol.toStringTag, { value: "Module" })), Dr = /* @__PURE__ */ Br(Rr);
var Me = { exports: {} }, an, kn;
function Fr() {
  return kn || (kn = 1, an = function(e, t, s, i) {
    var r = e[0], o = e[1], a = !1;
    s === void 0 && (s = 0), i === void 0 && (i = t.length);
    for (var c = (i - s) / 2, f = 0, h = c - 1; f < c; h = f++) {
      var u = t[s + f * 2 + 0], p = t[s + f * 2 + 1], v = t[s + h * 2 + 0], M = t[s + h * 2 + 1], k = p > o != M > o && r < (v - u) * (o - p) / (M - p) + u;
      k && (a = !a);
    }
    return a;
  }), an;
}
var cn, Sn;
function Yr() {
  return Sn || (Sn = 1, cn = function(e, t, s, i) {
    var r = e[0], o = e[1], a = !1;
    s === void 0 && (s = 0), i === void 0 && (i = t.length);
    for (var c = i - s, f = 0, h = c - 1; f < c; h = f++) {
      var u = t[f + s][0], p = t[f + s][1], v = t[h + s][0], M = t[h + s][1], k = p > o != M > o && r < (v - u) * (o - p) / (M - p) + u;
      k && (a = !a);
    }
    return a;
  }), cn;
}
var En;
function Lr() {
  if (En) return Me.exports;
  En = 1;
  var n = Fr(), e = Yr();
  return Me.exports = function(s, i, r, o) {
    return i.length > 0 && Array.isArray(i[0]) ? e(s, i, r, o) : n(s, i, r, o);
  }, Me.exports.nested = e, Me.exports.flat = n, Me.exports;
}
var Se = { exports: {} }, $r = Se.exports, An;
function Vr() {
  return An || (An = 1, (function(n, e) {
    (function(t, s) {
      s(e);
    })($r, function(t) {
      const i = 33306690738754706e-32;
      function r(k, C, F, g, w) {
        let l, y, m, I, B = C[0], E = g[0], X = 0, A = 0;
        E > B == E > -B ? (l = B, B = C[++X]) : (l = E, E = g[++A]);
        let R = 0;
        if (X < k && A < F) for (E > B == E > -B ? (m = l - ((y = B + l) - B), B = C[++X]) : (m = l - ((y = E + l) - E), E = g[++A]), l = y, m !== 0 && (w[R++] = m); X < k && A < F; ) E > B == E > -B ? (m = l - ((y = l + B) - (I = y - l)) + (B - I), B = C[++X]) : (m = l - ((y = l + E) - (I = y - l)) + (E - I), E = g[++A]), l = y, m !== 0 && (w[R++] = m);
        for (; X < k; ) m = l - ((y = l + B) - (I = y - l)) + (B - I), B = C[++X], l = y, m !== 0 && (w[R++] = m);
        for (; A < F; ) m = l - ((y = l + E) - (I = y - l)) + (E - I), E = g[++A], l = y, m !== 0 && (w[R++] = m);
        return l === 0 && R !== 0 || (w[R++] = l), R;
      }
      function o(k) {
        return new Float64Array(k);
      }
      const a = 33306690738754716e-32, c = 22204460492503146e-32, f = 11093356479670487e-47, h = o(4), u = o(8), p = o(12), v = o(16), M = o(4);
      t.orient2d = function(k, C, F, g, w, l) {
        const y = (C - l) * (F - w), m = (k - w) * (g - l), I = y - m;
        if (y === 0 || m === 0 || y > 0 != m > 0) return I;
        const B = Math.abs(y + m);
        return Math.abs(I) >= a * B ? I : -(function(E, X, A, R, j, d, _) {
          let x, T, P, D, b, O, L, V, U, z, Q, W, ft, ct, ut, pt, mt, gt;
          const Pt = E - j, Ct = A - j, kt = X - d, Mt = R - d;
          b = (ut = (V = Pt - (L = (O = 134217729 * Pt) - (O - Pt))) * (z = Mt - (U = (O = 134217729 * Mt) - (O - Mt))) - ((ct = Pt * Mt) - L * U - V * U - L * z)) - (Q = ut - (mt = (V = kt - (L = (O = 134217729 * kt) - (O - kt))) * (z = Ct - (U = (O = 134217729 * Ct) - (O - Ct))) - ((pt = kt * Ct) - L * U - V * U - L * z))), h[0] = ut - (Q + b) + (b - mt), b = (ft = ct - ((W = ct + Q) - (b = W - ct)) + (Q - b)) - (Q = ft - pt), h[1] = ft - (Q + b) + (b - pt), b = (gt = W + Q) - W, h[2] = W - (gt - b) + (Q - b), h[3] = gt;
          let Zt = (function(Qe, jt) {
            let Oe = jt[0];
            for (let S = 1; S < Qe; S++) Oe += jt[S];
            return Oe;
          })(4, h), le = c * _;
          if (Zt >= le || -Zt >= le || (x = E - (Pt + (b = E - Pt)) + (b - j), P = A - (Ct + (b = A - Ct)) + (b - j), T = X - (kt + (b = X - kt)) + (b - d), D = R - (Mt + (b = R - Mt)) + (b - d), x === 0 && T === 0 && P === 0 && D === 0) || (le = f * _ + i * Math.abs(Zt), (Zt += Pt * D + Mt * x - (kt * P + Ct * T)) >= le || -Zt >= le)) return Zt;
          b = (ut = (V = x - (L = (O = 134217729 * x) - (O - x))) * (z = Mt - (U = (O = 134217729 * Mt) - (O - Mt))) - ((ct = x * Mt) - L * U - V * U - L * z)) - (Q = ut - (mt = (V = T - (L = (O = 134217729 * T) - (O - T))) * (z = Ct - (U = (O = 134217729 * Ct) - (O - Ct))) - ((pt = T * Ct) - L * U - V * U - L * z))), M[0] = ut - (Q + b) + (b - mt), b = (ft = ct - ((W = ct + Q) - (b = W - ct)) + (Q - b)) - (Q = ft - pt), M[1] = ft - (Q + b) + (b - pt), b = (gt = W + Q) - W, M[2] = W - (gt - b) + (Q - b), M[3] = gt;
          const Ge = r(4, h, 4, M, u);
          b = (ut = (V = Pt - (L = (O = 134217729 * Pt) - (O - Pt))) * (z = D - (U = (O = 134217729 * D) - (O - D))) - ((ct = Pt * D) - L * U - V * U - L * z)) - (Q = ut - (mt = (V = kt - (L = (O = 134217729 * kt) - (O - kt))) * (z = P - (U = (O = 134217729 * P) - (O - P))) - ((pt = kt * P) - L * U - V * U - L * z))), M[0] = ut - (Q + b) + (b - mt), b = (ft = ct - ((W = ct + Q) - (b = W - ct)) + (Q - b)) - (Q = ft - pt), M[1] = ft - (Q + b) + (b - pt), b = (gt = W + Q) - W, M[2] = W - (gt - b) + (Q - b), M[3] = gt;
          const Je = r(Ge, u, 4, M, p);
          b = (ut = (V = x - (L = (O = 134217729 * x) - (O - x))) * (z = D - (U = (O = 134217729 * D) - (O - D))) - ((ct = x * D) - L * U - V * U - L * z)) - (Q = ut - (mt = (V = T - (L = (O = 134217729 * T) - (O - T))) * (z = P - (U = (O = 134217729 * P) - (O - P))) - ((pt = T * P) - L * U - V * U - L * z))), M[0] = ut - (Q + b) + (b - mt), b = (ft = ct - ((W = ct + Q) - (b = W - ct)) + (Q - b)) - (Q = ft - pt), M[1] = ft - (Q + b) + (b - pt), b = (gt = W + Q) - W, M[2] = W - (gt - b) + (Q - b), M[3] = gt;
          const Ke = r(Je, p, 4, M, v);
          return v[Ke - 1];
        })(k, C, F, g, w, l, B);
      }, t.orient2dfast = function(k, C, F, g, w, l) {
        return (C - l) * (F - w) - (k - w) * (g - l);
      }, Object.defineProperty(t, "__esModule", { value: !0 });
    });
  })(Se, Se.exports)), Se.exports;
}
var In;
function jr() {
  if (In) return Fe.exports;
  In = 1;
  var n = Nr(), e = Dr, t = Lr(), s = Vr().orient2d;
  e.default && (e = e.default), Fe.exports = i, Fe.exports.default = i;
  function i(l, y, m) {
    y = Math.max(0, y === void 0 ? 2 : y), m = m || 0;
    var I = v(l), B = new n(16);
    B.toBBox = function(L) {
      return {
        minX: L[0],
        minY: L[1],
        maxX: L[0],
        maxY: L[1]
      };
    }, B.compareMinX = function(L, V) {
      return L[0] - V[0];
    }, B.compareMinY = function(L, V) {
      return L[1] - V[1];
    }, B.load(l);
    for (var E = [], X = 0, A; X < I.length; X++) {
      var R = I[X];
      B.remove(R), A = M(R, A), E.push(A);
    }
    var j = new n(16);
    for (X = 0; X < E.length; X++) j.insert(p(E[X]));
    for (var d = y * y, _ = m * m; E.length; ) {
      var x = E.shift(), T = x.p, P = x.next.p, D = k(T, P);
      if (!(D < _)) {
        var b = D / d;
        R = r(B, x.prev.p, T, P, x.next.next.p, b, j), R && Math.min(k(R, T), k(R, P)) <= b && (E.push(x), E.push(M(R, x)), B.remove(R), j.remove(x), j.insert(p(x)), j.insert(p(x.next)));
      }
    }
    x = A;
    var O = [];
    do
      O.push(x.p), x = x.next;
    while (x !== A);
    return O.push(x.p), O;
  }
  function r(l, y, m, I, B, E, X) {
    for (var A = new e([], o), R = l.data; R; ) {
      for (var j = 0; j < R.children.length; j++) {
        var d = R.children[j], _ = R.leaf ? C(d, m, I) : a(m, I, d);
        _ > E || A.push({
          node: d,
          dist: _
        });
      }
      for (; A.length && !A.peek().node.children; ) {
        var x = A.pop(), T = x.node, P = C(T, y, m), D = C(T, I, B);
        if (x.dist < P && x.dist < D && f(m, T, X) && f(I, T, X)) return T;
      }
      R = A.pop(), R && (R = R.node);
    }
    return null;
  }
  function o(l, y) {
    return l.dist - y.dist;
  }
  function a(l, y, m) {
    if (c(l, m) || c(y, m)) return 0;
    var I = F(l[0], l[1], y[0], y[1], m.minX, m.minY, m.maxX, m.minY);
    if (I === 0) return 0;
    var B = F(l[0], l[1], y[0], y[1], m.minX, m.minY, m.minX, m.maxY);
    if (B === 0) return 0;
    var E = F(l[0], l[1], y[0], y[1], m.maxX, m.minY, m.maxX, m.maxY);
    if (E === 0) return 0;
    var X = F(l[0], l[1], y[0], y[1], m.minX, m.maxY, m.maxX, m.maxY);
    return X === 0 ? 0 : Math.min(I, B, E, X);
  }
  function c(l, y) {
    return l[0] >= y.minX && l[0] <= y.maxX && l[1] >= y.minY && l[1] <= y.maxY;
  }
  function f(l, y, m) {
    for (var I = Math.min(l[0], y[0]), B = Math.min(l[1], y[1]), E = Math.max(l[0], y[0]), X = Math.max(l[1], y[1]), A = m.search({ minX: I, minY: B, maxX: E, maxY: X }), R = 0; R < A.length; R++)
      if (u(A[R].p, A[R].next.p, l, y)) return !1;
    return !0;
  }
  function h(l, y, m) {
    return s(l[0], l[1], y[0], y[1], m[0], m[1]);
  }
  function u(l, y, m, I) {
    return l !== I && y !== m && h(l, y, m) > 0 != h(l, y, I) > 0 && h(m, I, l) > 0 != h(m, I, y) > 0;
  }
  function p(l) {
    var y = l.p, m = l.next.p;
    return l.minX = Math.min(y[0], m[0]), l.minY = Math.min(y[1], m[1]), l.maxX = Math.max(y[0], m[0]), l.maxY = Math.max(y[1], m[1]), l;
  }
  function v(l) {
    for (var y = l[0], m = l[0], I = l[0], B = l[0], E = 0; E < l.length; E++) {
      var X = l[E];
      X[0] < y[0] && (y = X), X[0] > I[0] && (I = X), X[1] < m[1] && (m = X), X[1] > B[1] && (B = X);
    }
    var A = [y, m, I, B], R = A.slice();
    for (E = 0; E < l.length; E++)
      t(l[E], A) || R.push(l[E]);
    return w(R);
  }
  function M(l, y) {
    var m = {
      p: l,
      prev: null,
      next: null,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };
    return y ? (m.next = y.next, m.prev = y, y.next.prev = m, y.next = m) : (m.prev = m, m.next = m), m;
  }
  function k(l, y) {
    var m = l[0] - y[0], I = l[1] - y[1];
    return m * m + I * I;
  }
  function C(l, y, m) {
    var I = y[0], B = y[1], E = m[0] - I, X = m[1] - B;
    if (E !== 0 || X !== 0) {
      var A = ((l[0] - I) * E + (l[1] - B) * X) / (E * E + X * X);
      A > 1 ? (I = m[0], B = m[1]) : A > 0 && (I += E * A, B += X * A);
    }
    return E = l[0] - I, X = l[1] - B, E * E + X * X;
  }
  function F(l, y, m, I, B, E, X, A) {
    var R = m - l, j = I - y, d = X - B, _ = A - E, x = l - B, T = y - E, P = R * R + j * j, D = R * d + j * _, b = d * d + _ * _, O = R * x + j * T, L = d * x + _ * T, V = P * b - D * D, U, z, Q, W, ft = V, ct = V;
    V === 0 ? (z = 0, ft = 1, W = L, ct = b) : (z = D * L - b * O, W = P * L - D * O, z < 0 ? (z = 0, W = L, ct = b) : z > ft && (z = ft, W = L + D, ct = b)), W < 0 ? (W = 0, -O < 0 ? z = 0 : -O > P ? z = ft : (z = -O, ft = P)) : W > ct && (W = ct, -O + D < 0 ? z = 0 : -O + D > P ? z = ft : (z = -O + D, ft = P)), U = z === 0 ? 0 : z / ft, Q = W === 0 ? 0 : W / ct;
    var ut = (1 - U) * l + U * m, pt = (1 - U) * y + U * I, mt = (1 - Q) * B + Q * X, gt = (1 - Q) * E + Q * A, Pt = mt - ut, Ct = gt - pt;
    return Pt * Pt + Ct * Ct;
  }
  function g(l, y) {
    return l[0] === y[0] ? l[1] - y[1] : l[0] - y[0];
  }
  function w(l) {
    l.sort(g);
    for (var y = [], m = 0; m < l.length; m++) {
      for (; y.length >= 2 && h(y[y.length - 2], y[y.length - 1], l[m]) <= 0; )
        y.pop();
      y.push(l[m]);
    }
    for (var I = [], B = l.length - 1; B >= 0; B--) {
      for (; I.length >= 2 && h(I[I.length - 2], I[I.length - 1], l[B]) <= 0; )
        I.pop();
      I.push(l[B]);
    }
    return I.pop(), y.pop(), y.concat(I);
  }
  return Fe.exports;
}
var qr = jr();
const Ur = /* @__PURE__ */ Pr(qr);
function Pn(n, e = {}) {
  e.concavity = e.concavity || 1 / 0;
  const t = [];
  if (ln(n, (i) => {
    t.push([i[0], i[1]]);
  }), !t.length)
    return null;
  const s = Ur(t, e.concavity);
  return s.length > 3 ? xe([s]) : null;
}
var Ee = { exports: {} }, zr = Ee.exports, Bn;
function Wr() {
  return Bn || (Bn = 1, (function(n, e) {
    (function(t, s) {
      s(e);
    })(zr, (function(t) {
      var s = Object.defineProperty, i = (S, N, Y) => N in S ? s(S, N, { enumerable: !0, configurable: !0, writable: !0, value: Y }) : S[N] = Y, r = (S, N, Y) => i(S, typeof N != "symbol" ? N + "" : N, Y);
      function o(S, N, Y = {}) {
        const $ = { type: "Feature" };
        return (Y.id === 0 || Y.id) && ($.id = Y.id), Y.bbox && ($.bbox = Y.bbox), $.properties = N || {}, $.geometry = S, $;
      }
      function a(S, N, Y = {}) {
        if (!S) throw new Error("coordinates is required");
        if (!Array.isArray(S)) throw new Error("coordinates must be an Array");
        if (S.length < 2) throw new Error("coordinates must be at least 2 numbers long");
        if (!h(S[0]) || !h(S[1])) throw new Error("coordinates must contain numbers");
        return o({ type: "Point", coordinates: S }, N, Y);
      }
      function c(S, N, Y = {}) {
        for (const $ of S) {
          if ($.length < 4) throw new Error("Each LinearRing of a Polygon must have 4 or more Positions.");
          if ($[$.length - 1].length !== $[0].length) throw new Error("First and last Position are not equivalent.");
          for (let tt = 0; tt < $[$.length - 1].length; tt++) if ($[$.length - 1][tt] !== $[0][tt]) throw new Error("First and last Position are not equivalent.");
        }
        return o({ type: "Polygon", coordinates: S }, N, Y);
      }
      function f(S, N = {}) {
        const Y = { type: "FeatureCollection" };
        return N.id && (Y.id = N.id), N.bbox && (Y.bbox = N.bbox), Y.features = S, Y;
      }
      function h(S) {
        return !isNaN(S) && S !== null && !Array.isArray(S);
      }
      function u(S) {
        if (!S) throw new Error("coord is required");
        if (!Array.isArray(S)) {
          if (S.type === "Feature" && S.geometry !== null && S.geometry.type === "Point") return [...S.geometry.coordinates];
          if (S.type === "Point") return [...S.coordinates];
        }
        if (Array.isArray(S) && S.length >= 2 && !Array.isArray(S[0]) && !Array.isArray(S[1])) return [...S];
        throw new Error("coord must be GeoJSON Point or an Array of numbers");
      }
      function p(S) {
        if (Array.isArray(S)) return S;
        if (S.type === "Feature") {
          if (S.geometry !== null) return S.geometry.coordinates;
        } else if (S.coordinates) return S.coordinates;
        throw new Error("coords must be GeoJSON Feature, Geometry Object or an Array");
      }
      function v(S) {
        return S.type === "Feature" ? S.geometry : S;
      }
      const M = 11102230246251565e-32, k = 134217729, C = (3 + 8 * M) * M;
      function F(S, N, Y, $, tt) {
        let K, et, st, it, at = N[0], ht = $[0], J = 0, Z = 0;
        ht > at == ht > -at ? (K = at, at = N[++J]) : (K = ht, ht = $[++Z]);
        let lt = 0;
        if (J < S && Z < Y) for (ht > at == ht > -at ? (et = at + K, st = K - (et - at), at = N[++J]) : (et = ht + K, st = K - (et - ht), ht = $[++Z]), K = et, st !== 0 && (tt[lt++] = st); J < S && Z < Y; ) ht > at == ht > -at ? (et = K + at, it = et - K, st = K - (et - it) + (at - it), at = N[++J]) : (et = K + ht, it = et - K, st = K - (et - it) + (ht - it), ht = $[++Z]), K = et, st !== 0 && (tt[lt++] = st);
        for (; J < S; ) et = K + at, it = et - K, st = K - (et - it) + (at - it), at = N[++J], K = et, st !== 0 && (tt[lt++] = st);
        for (; Z < Y; ) et = K + ht, it = et - K, st = K - (et - it) + (ht - it), ht = $[++Z], K = et, st !== 0 && (tt[lt++] = st);
        return (K !== 0 || lt === 0) && (tt[lt++] = K), lt;
      }
      function g(S, N) {
        let Y = N[0];
        for (let $ = 1; $ < S; $++) Y += N[$];
        return Y;
      }
      function w(S) {
        return new Float64Array(S);
      }
      const l = (3 + 16 * M) * M, y = (2 + 12 * M) * M, m = (9 + 64 * M) * M * M, I = w(4), B = w(8), E = w(12), X = w(16), A = w(4);
      function R(S, N, Y, $, tt, K, et) {
        let st, it, at, ht, J, Z, lt, _t, nt, H, G, wt, At, It, Xt, yt, Ot, Dt;
        const Gt = S - tt, Jt = Y - tt, Kt = N - K, Qt = $ - K;
        It = Gt * Qt, Z = k * Gt, lt = Z - (Z - Gt), _t = Gt - lt, Z = k * Qt, nt = Z - (Z - Qt), H = Qt - nt, Xt = _t * H - (It - lt * nt - _t * nt - lt * H), yt = Kt * Jt, Z = k * Kt, lt = Z - (Z - Kt), _t = Kt - lt, Z = k * Jt, nt = Z - (Z - Jt), H = Jt - nt, Ot = _t * H - (yt - lt * nt - _t * nt - lt * H), G = Xt - Ot, J = Xt - G, I[0] = Xt - (G + J) + (J - Ot), wt = It + G, J = wt - It, At = It - (wt - J) + (G - J), G = At - yt, J = At - G, I[1] = At - (G + J) + (J - yt), Dt = wt + G, J = Dt - wt, I[2] = wt - (Dt - J) + (G - J), I[3] = Dt;
        let de = g(4, I), _e = y * et;
        if (de >= _e || -de >= _e || (J = S - Gt, st = S - (Gt + J) + (J - tt), J = Y - Jt, at = Y - (Jt + J) + (J - tt), J = N - Kt, it = N - (Kt + J) + (J - K), J = $ - Qt, ht = $ - (Qt + J) + (J - K), st === 0 && it === 0 && at === 0 && ht === 0) || (_e = m * et + C * Math.abs(de), de += Gt * ht + Qt * st - (Kt * at + Jt * it), de >= _e || -de >= _e)) return de;
        It = st * Qt, Z = k * st, lt = Z - (Z - st), _t = st - lt, Z = k * Qt, nt = Z - (Z - Qt), H = Qt - nt, Xt = _t * H - (It - lt * nt - _t * nt - lt * H), yt = it * Jt, Z = k * it, lt = Z - (Z - it), _t = it - lt, Z = k * Jt, nt = Z - (Z - Jt), H = Jt - nt, Ot = _t * H - (yt - lt * nt - _t * nt - lt * H), G = Xt - Ot, J = Xt - G, A[0] = Xt - (G + J) + (J - Ot), wt = It + G, J = wt - It, At = It - (wt - J) + (G - J), G = At - yt, J = At - G, A[1] = At - (G + J) + (J - yt), Dt = wt + G, J = Dt - wt, A[2] = wt - (Dt - J) + (G - J), A[3] = Dt;
        const nr = F(4, I, 4, A, B);
        It = Gt * ht, Z = k * Gt, lt = Z - (Z - Gt), _t = Gt - lt, Z = k * ht, nt = Z - (Z - ht), H = ht - nt, Xt = _t * H - (It - lt * nt - _t * nt - lt * H), yt = Kt * at, Z = k * Kt, lt = Z - (Z - Kt), _t = Kt - lt, Z = k * at, nt = Z - (Z - at), H = at - nt, Ot = _t * H - (yt - lt * nt - _t * nt - lt * H), G = Xt - Ot, J = Xt - G, A[0] = Xt - (G + J) + (J - Ot), wt = It + G, J = wt - It, At = It - (wt - J) + (G - J), G = At - yt, J = At - G, A[1] = At - (G + J) + (J - yt), Dt = wt + G, J = Dt - wt, A[2] = wt - (Dt - J) + (G - J), A[3] = Dt;
        const rr = F(nr, B, 4, A, E);
        It = st * ht, Z = k * st, lt = Z - (Z - st), _t = st - lt, Z = k * ht, nt = Z - (Z - ht), H = ht - nt, Xt = _t * H - (It - lt * nt - _t * nt - lt * H), yt = it * at, Z = k * it, lt = Z - (Z - it), _t = it - lt, Z = k * at, nt = Z - (Z - at), H = at - nt, Ot = _t * H - (yt - lt * nt - _t * nt - lt * H), G = Xt - Ot, J = Xt - G, A[0] = Xt - (G + J) + (J - Ot), wt = It + G, J = wt - It, At = It - (wt - J) + (G - J), G = At - yt, J = At - G, A[1] = At - (G + J) + (J - yt), Dt = wt + G, J = Dt - wt, A[2] = wt - (Dt - J) + (G - J), A[3] = Dt;
        const ir = F(rr, E, 4, A, X);
        return X[ir - 1];
      }
      function j(S, N, Y, $, tt, K) {
        const et = (N - K) * (Y - tt), st = (S - tt) * ($ - K), it = et - st, at = Math.abs(et + st);
        return Math.abs(it) >= l * at ? it : -R(S, N, Y, $, tt, K, at);
      }
      function d(S, N) {
        var Y, $, tt = 0, K, et, st, it, at, ht, J, Z = S[0], lt = S[1], _t = N.length;
        for (Y = 0; Y < _t; Y++) {
          $ = 0;
          var nt = N[Y], H = nt.length - 1;
          if (ht = nt[0], ht[0] !== nt[H][0] && ht[1] !== nt[H][1]) throw new Error("First and last coordinates in a ring must be the same");
          for (et = ht[0] - Z, st = ht[1] - lt, $; $ < H; $++) {
            if (J = nt[$ + 1], it = J[0] - Z, at = J[1] - lt, st === 0 && at === 0) {
              if (it <= 0 && et >= 0 || et <= 0 && it >= 0) return 0;
            } else if (at >= 0 && st <= 0 || at <= 0 && st >= 0) {
              if (K = j(et, it, st, at, 0, 0), K === 0) return 0;
              (K > 0 && at > 0 && st <= 0 || K < 0 && at <= 0 && st > 0) && tt++;
            }
            ht = J, st = at, et = it;
          }
        }
        return tt % 2 !== 0;
      }
      function _(S, N, Y = {}) {
        if (!S) throw new Error("point is required");
        if (!N) throw new Error("polygon is required");
        const $ = u(S), tt = v(N), K = tt.type, et = N.bbox;
        let st = tt.coordinates;
        if (et && x($, et) === !1) return !1;
        K === "Polygon" && (st = [st]);
        let it = !1;
        for (var at = 0; at < st.length; ++at) {
          const ht = d($, st[at]);
          if (ht === 0) return !Y.ignoreBoundary;
          ht && (it = !0);
        }
        return it;
      }
      function x(S, N) {
        return N[0] <= S[0] && N[1] <= S[1] && N[2] >= S[0] && N[3] >= S[1];
      }
      function T(S, N) {
        for (let Y = 0; Y < N.features.length; Y++) if (_(S, N.features[Y])) return N.features[Y];
      }
      function P(S, N, Y) {
        const $ = N.geometry.coordinates[0][0], tt = N.geometry.coordinates[0][1], K = N.geometry.coordinates[0][2], et = S.geometry.coordinates, st = N.properties.a.geom, it = N.properties.b.geom, at = N.properties.c.geom, ht = [tt[0] - $[0], tt[1] - $[1]], J = [K[0] - $[0], K[1] - $[1]], Z = [et[0] - $[0], et[1] - $[1]], lt = [it[0] - st[0], it[1] - st[1]], _t = [at[0] - st[0], at[1] - st[1]];
        let nt = (J[1] * Z[0] - J[0] * Z[1]) / (ht[0] * J[1] - ht[1] * J[0]), H = (ht[0] * Z[1] - ht[1] * Z[0]) / (ht[0] * J[1] - ht[1] * J[0]);
        if (Y) {
          const G = Y[N.properties.a.index], wt = Y[N.properties.b.index], At = Y[N.properties.c.index];
          let It;
          if (nt < 0 || H < 0 || 1 - nt - H < 0) {
            const Xt = nt / (nt + H), yt = H / (nt + H);
            It = nt / wt / (Xt / wt + yt / At), H = H / At / (Xt / wt + yt / At);
          } else It = nt / wt / (nt / wt + H / At + (1 - nt - H) / G), H = H / At / (nt / wt + H / At + (1 - nt - H) / G);
          nt = It;
        }
        return [nt * lt[0] + H * _t[0] + st[0], nt * lt[1] + H * _t[1] + st[1]];
      }
      function D(S, N, Y, $) {
        const tt = S.geometry.coordinates, K = Y.geometry.coordinates, et = Math.atan2(tt[0] - K[0], tt[1] - K[1]), st = L(et, N[0]);
        if (st === void 0) throw new Error("Unable to determine vertex index");
        const it = N[1][st];
        return P(S, it.features[0], $);
      }
      function b(S, N, Y, $, tt, K, et, st) {
        let it;
        if (et && (it = T(S, f([et]))), !it) {
          if (Y) {
            const at = S.geometry.coordinates, ht = Y.gridNum, J = Y.xOrigin, Z = Y.yOrigin, lt = Y.xUnit, _t = Y.yUnit, nt = Y.gridCache, H = O(at[0], J, lt, ht), G = O(at[1], Z, _t, ht), wt = nt[H] ? nt[H][G] ? nt[H][G] : [] : [];
            N = f(wt.map((At) => N.features[At]));
          }
          it = T(S, N);
        }
        return st && st(it), it ? P(S, it, K) : D(S, $, tt, K);
      }
      function O(S, N, Y, $) {
        let tt = Math.floor((S - N) / Y);
        return tt >= $ && (tt = $ - 1), tt;
      }
      function L(S, N) {
        let Y = V(S - N[0]), $ = Math.PI * 2, tt;
        for (let K = 0; K < N.length; K++) {
          const et = (K + 1) % N.length, st = V(S - N[et]), it = Math.min(Math.abs(Y), Math.abs(st));
          Y * st <= 0 && it < $ && ($ = it, tt = K), Y = st;
        }
        return tt;
      }
      function V(S, N = !1) {
        const Y = N ? function($) {
          return !($ >= 0 && $ < Math.PI * 2);
        } : function($) {
          return !($ > -1 * Math.PI && $ <= Math.PI);
        };
        for (; Y(S); ) S = S + 2 * Math.PI * (S > 0 ? -1 : 1);
        return S;
      }
      function U(S, N) {
        return N && N >= 2.00703 || Array.isArray(S[0]) ? S : S.map((Y) => [Y.illstNodes, Y.mercNodes, Y.startEnd]);
      }
      function z(S) {
        const N = S.features;
        for (let Y = 0; Y < N.length; Y++) {
          const $ = N[Y];
          `${$.properties.a.index}`.substring(0, 1) === "b" && `${$.properties.b.index}`.substring(0, 1) === "b" ? N[Y] = { geometry: { type: "Polygon", coordinates: [[$.geometry.coordinates[0][2], $.geometry.coordinates[0][0], $.geometry.coordinates[0][1], $.geometry.coordinates[0][2]]] }, properties: { a: { geom: $.properties.c.geom, index: $.properties.c.index }, b: { geom: $.properties.a.geom, index: $.properties.a.index }, c: { geom: $.properties.b.geom, index: $.properties.b.index } }, type: "Feature" } : `${$.properties.c.index}`.substring(0, 1) === "b" && `${$.properties.a.index}`.substring(0, 1) === "b" && (N[Y] = { geometry: { type: "Polygon", coordinates: [[$.geometry.coordinates[0][1], $.geometry.coordinates[0][2], $.geometry.coordinates[0][0], $.geometry.coordinates[0][1]]] }, properties: { a: { geom: $.properties.b.geom, index: $.properties.b.index }, b: { geom: $.properties.c.geom, index: $.properties.c.index }, c: { geom: $.properties.a.geom, index: $.properties.a.index } }, type: "Feature" });
        }
        return S;
      }
      function Q(S) {
        const N = ["a", "b", "c", "a"].map((K) => S.properties[K].geom), Y = S.geometry.coordinates[0], $ = S.properties, tt = { a: { geom: Y[0], index: $.a.index }, b: { geom: Y[1], index: $.b.index }, c: { geom: Y[2], index: $.c.index } };
        return c([N], tt);
      }
      function W(S) {
        const N = [0, 1, 2, 0].map(($) => S[$][0][0]), Y = { a: { geom: S[0][0][1], index: S[0][1] }, b: { geom: S[1][0][1], index: S[1][1] }, c: { geom: S[2][0][1], index: S[2][1] } };
        return c([N], Y);
      }
      function ft(S, N, Y, $, tt, K = !1, et) {
        const st = S.map((it) => {
          (!et || et < 2.00703) && (it = ct(it));
          const at = isFinite(it) ? N[it] : it === "c" ? $ : it === "b0" ? tt[0] : it === "b1" ? tt[1] : it === "b2" ? tt[2] : it === "b3" ? tt[3] : (function() {
            const ht = it.match(/e(\d+)/);
            if (ht) {
              const J = parseInt(ht[1]);
              return Y[J];
            }
            throw "Bad index value for indexesToTri";
          })();
          return K ? [[at[1], at[0]], it] : [[at[0], at[1]], it];
        });
        return W(st);
      }
      function ct(S) {
        return typeof S == "number" ? S : S.replace(/^(c|e|b)(?:ent|dgeNode|box)(\d+)?$/, "$1$2");
      }
      const ut = 2.00703;
      function pt(S) {
        return !!(S.version || !S.tins && S.points && S.tins_points);
      }
      function mt(S) {
        return { points: S.points, pointsWeightBuffer: Pt(S), strictStatus: Ct(S), verticesParams: kt(S), centroid: Zt(S), edges: U(S.edges || []), edgeNodes: S.edgeNodes || [], tins: le(S), kinks: Ge(S.kinks_points), yaxisMode: S.yaxisMode ?? "invert", strictMode: S.strictMode ?? "auto", vertexMode: S.vertexMode, bounds: S.bounds, boundsPolygon: S.boundsPolygon, wh: S.wh, xy: S.bounds ? S.xy : [0, 0] };
      }
      function gt(S) {
        const N = Je(S), Y = N.tins;
        return { compiled: N, tins: Y, points: Ke(Y), strictStatus: N.strict_status, pointsWeightBuffer: N.weight_buffer, verticesParams: N.vertices_params, centroid: N.centroid, kinks: N.kinks };
      }
      function Pt(S) {
        return !S.version || S.version < ut ? ["forw", "bakw"].reduce((N, Y) => {
          const $ = S.weight_buffer[Y];
          return $ && (N[Y] = Object.keys($).reduce((tt, K) => {
            const et = ct(K);
            return tt[et] = $[K], tt;
          }, {})), N;
        }, {}) : S.weight_buffer;
      }
      function Ct(S) {
        return S.strict_status ? S.strict_status : S.kinks_points ? "strict_error" : S.tins_points.length === 2 ? "loose" : "strict";
      }
      function kt(S) {
        const N = { forw: [S.vertices_params[0]], bakw: [S.vertices_params[1]] };
        return N.forw[1] = Mt(S, !1), N.bakw[1] = Mt(S, !0), N;
      }
      function Mt(S, N) {
        return [0, 1, 2, 3].map((Y) => {
          const $ = (Y + 1) % 4, tt = ft(["c", `b${Y}`, `b${$}`], S.points, S.edgeNodes || [], S.centroid_point, S.vertices_points, N, ut);
          return f([tt]);
        });
      }
      function Zt(S) {
        return { forw: a(S.centroid_point[0], { target: { geom: S.centroid_point[1], index: "c" } }), bakw: a(S.centroid_point[1], { target: { geom: S.centroid_point[0], index: "c" } }) };
      }
      function le(S) {
        const N = S.tins_points.length === 1 ? 0 : 1;
        return { forw: f(S.tins_points[0].map((Y) => ft(Y, S.points, S.edgeNodes || [], S.centroid_point, S.vertices_points, !1, S.version))), bakw: f(S.tins_points[N].map((Y) => ft(Y, S.points, S.edgeNodes || [], S.centroid_point, S.vertices_points, !0, S.version))) };
      }
      function Ge(S) {
        if (S) return { bakw: f(S.map((N) => a(N))) };
      }
      function Je(S) {
        return JSON.parse(JSON.stringify(S).replace('"cent"', '"c"').replace(/"bbox(\d+)"/g, '"b$1"'));
      }
      function Ke(S) {
        const N = [], Y = S.forw.features;
        for (let $ = 0; $ < Y.length; $++) {
          const tt = Y[$];
          ["a", "b", "c"].map((K, et) => {
            const st = tt.geometry.coordinates[0][et], it = tt.properties[K].geom, at = tt.properties[K].index;
            typeof at == "number" && (N[at] = [st, it]);
          });
        }
        return N;
      }
      const Qe = ut, jt = class re {
        constructor() {
          r(this, "points", []), r(this, "pointsWeightBuffer"), r(this, "strict_status"), r(this, "vertices_params"), r(this, "centroid"), r(this, "edgeNodes"), r(this, "edges"), r(this, "tins"), r(this, "kinks"), r(this, "yaxisMode", re.YAXIS_INVERT), r(this, "strictMode", re.MODE_AUTO), r(this, "vertexMode", re.VERTEX_PLAIN), r(this, "bounds"), r(this, "boundsPolygon"), r(this, "wh"), r(this, "xy"), r(this, "indexedTins"), r(this, "stateFull", !1), r(this, "stateTriangle"), r(this, "stateBackward"), r(this, "priority"), r(this, "importance"), r(this, "xyBounds"), r(this, "mercBounds");
        }
        setCompiled(N) {
          if (pt(N)) {
            this.applyModernState(mt(N));
            return;
          }
          this.applyLegacyState(gt(N));
        }
        applyModernState(N) {
          this.points = N.points, this.pointsWeightBuffer = N.pointsWeightBuffer, this.strict_status = N.strictStatus, this.vertices_params = N.verticesParams, this.centroid = N.centroid, this.edges = N.edges, this.edgeNodes = N.edgeNodes || [], this.tins = N.tins, this.addIndexedTin(), this.kinks = N.kinks, this.yaxisMode = N.yaxisMode ?? re.YAXIS_INVERT, this.vertexMode = N.vertexMode ?? re.VERTEX_PLAIN, this.strictMode = N.strictMode ?? re.MODE_AUTO, N.bounds ? (this.bounds = N.bounds, this.boundsPolygon = N.boundsPolygon, this.xy = N.xy, this.wh = N.wh) : (this.bounds = void 0, this.boundsPolygon = void 0, this.xy = N.xy ?? [0, 0], N.wh && (this.wh = N.wh));
        }
        applyLegacyState(N) {
          this.tins = N.tins, this.addIndexedTin(), this.strict_status = N.strictStatus, this.pointsWeightBuffer = N.pointsWeightBuffer, this.vertices_params = N.verticesParams, this.centroid = N.centroid, this.kinks = N.kinks, this.points = N.points;
        }
        addIndexedTin() {
          const N = this.tins, Y = N.forw, $ = N.bakw, tt = Math.ceil(Math.sqrt(Y.features.length));
          if (tt < 3) {
            this.indexedTins = void 0;
            return;
          }
          let K = [], et = [];
          const st = Y.features.map((nt) => {
            let H = [];
            return p(nt)[0].map((G) => {
              K.length === 0 ? K = [Array.from(G), Array.from(G)] : (G[0] < K[0][0] && (K[0][0] = G[0]), G[0] > K[1][0] && (K[1][0] = G[0]), G[1] < K[0][1] && (K[0][1] = G[1]), G[1] > K[1][1] && (K[1][1] = G[1])), H.length === 0 ? H = [Array.from(G), Array.from(G)] : (G[0] < H[0][0] && (H[0][0] = G[0]), G[0] > H[1][0] && (H[1][0] = G[0]), G[1] < H[0][1] && (H[0][1] = G[1]), G[1] > H[1][1] && (H[1][1] = G[1]));
            }), H;
          }), it = (K[1][0] - K[0][0]) / tt, at = (K[1][1] - K[0][1]) / tt, ht = st.reduce((nt, H, G) => {
            const wt = O(H[0][0], K[0][0], it, tt), At = O(H[1][0], K[0][0], it, tt), It = O(H[0][1], K[0][1], at, tt), Xt = O(H[1][1], K[0][1], at, tt);
            for (let yt = wt; yt <= At; yt++) {
              nt[yt] || (nt[yt] = []);
              for (let Ot = It; Ot <= Xt; Ot++) nt[yt][Ot] || (nt[yt][Ot] = []), nt[yt][Ot].push(G);
            }
            return nt;
          }, []), J = $.features.map((nt) => {
            let H = [];
            return p(nt)[0].map((G) => {
              et.length === 0 ? et = [Array.from(G), Array.from(G)] : (G[0] < et[0][0] && (et[0][0] = G[0]), G[0] > et[1][0] && (et[1][0] = G[0]), G[1] < et[0][1] && (et[0][1] = G[1]), G[1] > et[1][1] && (et[1][1] = G[1])), H.length === 0 ? H = [Array.from(G), Array.from(G)] : (G[0] < H[0][0] && (H[0][0] = G[0]), G[0] > H[1][0] && (H[1][0] = G[0]), G[1] < H[0][1] && (H[0][1] = G[1]), G[1] > H[1][1] && (H[1][1] = G[1]));
            }), H;
          }), Z = (et[1][0] - et[0][0]) / tt, lt = (et[1][1] - et[0][1]) / tt, _t = J.reduce((nt, H, G) => {
            const wt = O(H[0][0], et[0][0], Z, tt), At = O(H[1][0], et[0][0], Z, tt), It = O(H[0][1], et[0][1], lt, tt), Xt = O(H[1][1], et[0][1], lt, tt);
            for (let yt = wt; yt <= At; yt++) {
              nt[yt] || (nt[yt] = []);
              for (let Ot = It; Ot <= Xt; Ot++) nt[yt][Ot] || (nt[yt][Ot] = []), nt[yt][Ot].push(G);
            }
            return nt;
          }, []);
          this.indexedTins = { forw: { gridNum: tt, xOrigin: K[0][0], yOrigin: K[0][1], xUnit: it, yUnit: at, gridCache: ht }, bakw: { gridNum: tt, xOrigin: et[0][0], yOrigin: et[0][1], xUnit: Z, yUnit: lt, gridCache: _t } };
        }
        transform(N, Y, $) {
          if (Y && this.strict_status == re.STATUS_ERROR) throw 'Backward transform is not allowed if strict_status == "strict_error"';
          this.yaxisMode == re.YAXIS_FOLLOW && Y && (N = [N[0], -1 * N[1]]);
          const tt = a(N);
          if (this.bounds && !Y && !$ && !_(tt, this.boundsPolygon)) return !1;
          const K = Y ? this.tins.bakw : this.tins.forw, et = Y ? this.indexedTins.bakw : this.indexedTins.forw, st = Y ? this.vertices_params.bakw : this.vertices_params.forw, it = Y ? this.centroid.bakw : this.centroid.forw, at = Y ? this.pointsWeightBuffer.bakw : this.pointsWeightBuffer.forw;
          let ht, J;
          this.stateFull && (this.stateBackward == Y ? ht = this.stateTriangle : (this.stateBackward = Y, this.stateTriangle = void 0), J = (lt) => {
            this.stateTriangle = lt;
          });
          let Z = b(tt, K, et, st, it, at, ht, J);
          if (this.bounds && Y && !$) {
            const lt = a(Z);
            if (!_(lt, this.boundsPolygon)) return !1;
          } else this.yaxisMode == re.YAXIS_FOLLOW && !Y && (Z = [Z[0], -1 * Z[1]]);
          return Z;
        }
      };
      r(jt, "VERTEX_PLAIN", "plain"), r(jt, "VERTEX_BIRDEYE", "birdeye"), r(jt, "MODE_STRICT", "strict"), r(jt, "MODE_AUTO", "auto"), r(jt, "MODE_LOOSE", "loose"), r(jt, "STATUS_STRICT", "strict"), r(jt, "STATUS_ERROR", "strict_error"), r(jt, "STATUS_LOOSE", "loose"), r(jt, "YAXIS_FOLLOW", "follow"), r(jt, "YAXIS_INVERT", "invert");
      let Oe = jt;
      t.Transform = Oe, t.counterTri = Q, t.format_version = Qe, t.normalizeEdges = U, t.rotateVerticesTriangle = z, t.transformArr = b, Object.defineProperty(t, Symbol.toStringTag, { value: "Module" });
    }));
  })(Ee, Ee.exports)), Ee.exports;
}
var Ut = Wr();
const On = Math.pow(2, -52), Ye = new Uint32Array(512);
class dn {
  static from(e, t = Hr, s = Zr) {
    const i = e.length, r = new Float64Array(i * 2);
    for (let o = 0; o < i; o++) {
      const a = e[o];
      r[2 * o] = t(a), r[2 * o + 1] = s(a);
    }
    return new dn(r);
  }
  constructor(e) {
    const t = e.length >> 1;
    if (t > 0 && typeof e[0] != "number") throw new Error("Expected coords to contain numbers.");
    this.coords = e;
    const s = Math.max(2 * t - 5, 0);
    this._triangles = new Uint32Array(s * 3), this._halfedges = new Int32Array(s * 3), this._hashSize = Math.ceil(Math.sqrt(t)), this._hullPrev = new Uint32Array(t), this._hullNext = new Uint32Array(t), this._hullTri = new Uint32Array(t), this._hullHash = new Int32Array(this._hashSize), this._ids = new Uint32Array(t), this._dists = new Float64Array(t), this.update();
  }
  update() {
    const { coords: e, _hullPrev: t, _hullNext: s, _hullTri: i, _hullHash: r } = this, o = e.length >> 1;
    let a = 1 / 0, c = 1 / 0, f = -1 / 0, h = -1 / 0;
    for (let E = 0; E < o; E++) {
      const X = e[2 * E], A = e[2 * E + 1];
      X < a && (a = X), A < c && (c = A), X > f && (f = X), A > h && (h = A), this._ids[E] = E;
    }
    const u = (a + f) / 2, p = (c + h) / 2;
    let v, M, k;
    for (let E = 0, X = 1 / 0; E < o; E++) {
      const A = fn(u, p, e[2 * E], e[2 * E + 1]);
      A < X && (v = E, X = A);
    }
    const C = e[2 * v], F = e[2 * v + 1];
    for (let E = 0, X = 1 / 0; E < o; E++) {
      if (E === v) continue;
      const A = fn(C, F, e[2 * E], e[2 * E + 1]);
      A < X && A > 0 && (M = E, X = A);
    }
    let g = e[2 * M], w = e[2 * M + 1], l = 1 / 0;
    for (let E = 0; E < o; E++) {
      if (E === v || E === M) continue;
      const X = Kr(C, F, g, w, e[2 * E], e[2 * E + 1]);
      X < l && (k = E, l = X);
    }
    let y = e[2 * k], m = e[2 * k + 1];
    if (l === 1 / 0) {
      for (let A = 0; A < o; A++)
        this._dists[A] = e[2 * A] - e[0] || e[2 * A + 1] - e[1];
      ve(this._ids, this._dists, 0, o - 1);
      const E = new Uint32Array(o);
      let X = 0;
      for (let A = 0, R = -1 / 0; A < o; A++) {
        const j = this._ids[A], d = this._dists[j];
        d > R && (E[X++] = j, R = d);
      }
      this.hull = E.subarray(0, X), this.triangles = new Uint32Array(0), this.halfedges = new Uint32Array(0);
      return;
    }
    if (ie(C, F, g, w, y, m) < 0) {
      const E = M, X = g, A = w;
      M = k, g = y, w = m, k = E, y = X, m = A;
    }
    const I = Qr(C, F, g, w, y, m);
    this._cx = I.x, this._cy = I.y;
    for (let E = 0; E < o; E++)
      this._dists[E] = fn(e[2 * E], e[2 * E + 1], I.x, I.y);
    ve(this._ids, this._dists, 0, o - 1), this._hullStart = v;
    let B = 3;
    s[v] = t[k] = M, s[M] = t[v] = k, s[k] = t[M] = v, i[v] = 0, i[M] = 1, i[k] = 2, r.fill(-1), r[this._hashKey(C, F)] = v, r[this._hashKey(g, w)] = M, r[this._hashKey(y, m)] = k, this.trianglesLen = 0, this._addTriangle(v, M, k, -1, -1, -1);
    for (let E = 0, X, A; E < this._ids.length; E++) {
      const R = this._ids[E], j = e[2 * R], d = e[2 * R + 1];
      if (E > 0 && Math.abs(j - X) <= On && Math.abs(d - A) <= On || (X = j, A = d, R === v || R === M || R === k)) continue;
      let _ = 0;
      for (let b = 0, O = this._hashKey(j, d); b < this._hashSize && (_ = r[(O + b) % this._hashSize], !(_ !== -1 && _ !== s[_])); b++)
        ;
      _ = t[_];
      let x = _, T;
      for (; T = s[x], ie(j, d, e[2 * x], e[2 * x + 1], e[2 * T], e[2 * T + 1]) >= 0; )
        if (x = T, x === _) {
          x = -1;
          break;
        }
      if (x === -1) continue;
      let P = this._addTriangle(x, R, s[x], -1, -1, i[x]);
      i[R] = this._legalize(P + 2), i[x] = P, B++;
      let D = s[x];
      for (; T = s[D], ie(j, d, e[2 * D], e[2 * D + 1], e[2 * T], e[2 * T + 1]) < 0; )
        P = this._addTriangle(D, R, T, i[R], -1, i[D]), i[R] = this._legalize(P + 2), s[D] = D, B--, D = T;
      if (x === _)
        for (; T = t[x], ie(j, d, e[2 * T], e[2 * T + 1], e[2 * x], e[2 * x + 1]) < 0; )
          P = this._addTriangle(T, R, x, -1, i[x], i[T]), this._legalize(P + 2), i[T] = P, s[x] = x, B--, x = T;
      this._hullStart = t[R] = x, s[x] = t[D] = R, s[R] = D, r[this._hashKey(j, d)] = R, r[this._hashKey(e[2 * x], e[2 * x + 1])] = x;
    }
    this.hull = new Uint32Array(B);
    for (let E = 0, X = this._hullStart; E < B; E++)
      this.hull[E] = X, X = s[X];
    this.triangles = this._triangles.subarray(0, this.trianglesLen), this.halfedges = this._halfedges.subarray(0, this.trianglesLen);
  }
  _hashKey(e, t) {
    return Math.floor(Gr(e - this._cx, t - this._cy) * this._hashSize) % this._hashSize;
  }
  _legalize(e) {
    const { _triangles: t, _halfedges: s, coords: i } = this;
    let r = 0, o = 0;
    for (; ; ) {
      const a = s[e], c = e - e % 3;
      if (o = c + (e + 2) % 3, a === -1) {
        if (r === 0) break;
        e = Ye[--r];
        continue;
      }
      const f = a - a % 3, h = c + (e + 1) % 3, u = f + (a + 2) % 3, p = t[o], v = t[e], M = t[h], k = t[u];
      if (Jr(
        i[2 * p],
        i[2 * p + 1],
        i[2 * v],
        i[2 * v + 1],
        i[2 * M],
        i[2 * M + 1],
        i[2 * k],
        i[2 * k + 1]
      )) {
        t[e] = k, t[a] = p;
        const F = s[u];
        if (F === -1) {
          let w = this._hullStart;
          do {
            if (this._hullTri[w] === u) {
              this._hullTri[w] = e;
              break;
            }
            w = this._hullPrev[w];
          } while (w !== this._hullStart);
        }
        this._link(e, F), this._link(a, s[o]), this._link(o, u);
        const g = f + (a + 1) % 3;
        r < Ye.length && (Ye[r++] = g);
      } else {
        if (r === 0) break;
        e = Ye[--r];
      }
    }
    return o;
  }
  _link(e, t) {
    this._halfedges[e] = t, t !== -1 && (this._halfedges[t] = e);
  }
  // add a new triangle given vertex indices and adjacent half-edge ids
  _addTriangle(e, t, s, i, r, o) {
    const a = this.trianglesLen;
    return this._triangles[a] = e, this._triangles[a + 1] = t, this._triangles[a + 2] = s, this._link(a, i), this._link(a + 1, r), this._link(a + 2, o), this.trianglesLen += 3, a;
  }
}
function Gr(n, e) {
  const t = n / (Math.abs(n) + Math.abs(e));
  return (e > 0 ? 3 - t : 1 + t) / 4;
}
function fn(n, e, t, s) {
  const i = n - t, r = e - s;
  return i * i + r * r;
}
function Jr(n, e, t, s, i, r, o, a) {
  const c = n - o, f = e - a, h = t - o, u = s - a, p = i - o, v = r - a, M = c * c + f * f, k = h * h + u * u, C = p * p + v * v;
  return c * (u * C - k * v) - f * (h * C - k * p) + M * (h * v - u * p) < 0;
}
function Kr(n, e, t, s, i, r) {
  const o = t - n, a = s - e, c = i - n, f = r - e, h = o * o + a * a, u = c * c + f * f, p = 0.5 / (o * f - a * c), v = (f * h - a * u) * p, M = (o * u - c * h) * p;
  return v * v + M * M;
}
function Qr(n, e, t, s, i, r) {
  const o = t - n, a = s - e, c = i - n, f = r - e, h = o * o + a * a, u = c * c + f * f, p = 0.5 / (o * f - a * c), v = n + (f * h - a * u) * p, M = e + (o * u - c * h) * p;
  return { x: v, y: M };
}
function ve(n, e, t, s) {
  if (s - t <= 20)
    for (let i = t + 1; i <= s; i++) {
      const r = n[i], o = e[r];
      let a = i - 1;
      for (; a >= t && e[n[a]] > o; ) n[a + 1] = n[a--];
      n[a + 1] = r;
    }
  else {
    const i = t + s >> 1;
    let r = t + 1, o = s;
    ke(n, i, r), e[n[t]] > e[n[s]] && ke(n, t, s), e[n[r]] > e[n[s]] && ke(n, r, s), e[n[t]] > e[n[r]] && ke(n, t, r);
    const a = n[r], c = e[a];
    for (; ; ) {
      do
        r++;
      while (e[n[r]] < c);
      do
        o--;
      while (e[n[o]] > c);
      if (o < r) break;
      ke(n, r, o);
    }
    n[t + 1] = n[o], n[o] = a, s - r + 1 >= o - t ? (ve(n, e, r, s), ve(n, e, t, o - 1)) : (ve(n, e, t, o - 1), ve(n, e, r, s));
  }
}
function ke(n, e, t) {
  const s = n[e];
  n[e] = n[t], n[t] = s;
}
function Hr(n) {
  return n[0];
}
function Zr(n) {
  return n[1];
}
class ti {
  constructor(e, t) {
    vt(this, "bs");
    vt(this, "width");
    this.width = e, this.bs = t;
  }
  /**
   * Add a number to the set.
   *
   * @param idx The number to add. Must be 0 <= idx < len.
   */
  add(e) {
    const t = Math.floor(e / this.width), s = e % this.width;
    return this.bs[t] |= 1 << s, this;
  }
  /**
   * Delete a number from the set.
   *
   * @param idx The number to delete. Must be 0 <= idx < len.
   */
  delete(e) {
    const t = Math.floor(e / this.width), s = e % this.width;
    return this.bs[t] &= ~(1 << s), this;
  }
  /**
   * Add or delete a number in the set, depending on the second argument.
   *
   * @param idx The number to add or delete. Must be 0 <= idx < len.
   * @param val If true, add the number, otherwise delete.
   */
  set(e, t) {
    const s = Math.floor(e / this.width), r = 1 << e % this.width;
    return this.bs[s] ^= (-Number(t) ^ this.bs[s]) & r, t;
  }
  /**
   * Whether the number is in the set.
   *
   * @param idx The number to test. Must be 0 <= idx < len.
   */
  has(e) {
    const t = Math.floor(e / this.width), s = e % this.width;
    return (this.bs[t] & 1 << s) !== 0;
  }
  /**
   * Iterate over the numbers that are in the set.
   */
  forEach(e) {
    const t = this.bs.length;
    for (let s = 0; s < t; s++) {
      let i = 0;
      for (; this.bs[s] && i < this.width; )
        this.bs[s] & 1 << i && e(s * this.width + i), i++;
    }
    return this;
  }
}
class Tn extends ti {
  constructor(e) {
    super(8, new Uint8Array(Math.ceil(e / 8)).fill(0));
  }
}
function we(n) {
  return n % 3 === 2 ? n - 2 : n + 1;
}
function se(n) {
  return n % 3 === 0 ? n + 2 : n - 1;
}
function Nn(n, e, t, s, i, r, o, a) {
  const c = ie(n, e, i, r, o, a), f = ie(t, s, i, r, o, a);
  if (c > 0 && f > 0 || c < 0 && f < 0)
    return !1;
  const h = ie(i, r, n, e, t, s), u = ie(o, a, n, e, t, s);
  return h > 0 && u > 0 || h < 0 && u < 0 ? !1 : c === 0 && f === 0 && h === 0 && u === 0 ? !(Math.max(i, o) < Math.min(n, t) || Math.max(n, t) < Math.min(i, o) || Math.max(r, a) < Math.min(e, s) || Math.max(e, s) < Math.min(r, a)) : !0;
}
class ei {
  constructor(e) {
    /**
     * The triangulation object from Delaunator.
     */
    vt(this, "del");
    this.del = e;
  }
}
class Kn extends ei {
  /**
   * Create a Constrain instance.
   *
   * @param del The triangulation output from Delaunator.
   * @param edges If provided, constrain these edges via constrainAll.
   */
  constructor(t, s) {
    if (!t || typeof t != "object" || !t.triangles || !t.halfedges || !t.coords)
      throw new Error("Expected an object with Delaunator output");
    if (t.triangles.length % 3 || t.halfedges.length !== t.triangles.length || t.coords.length % 2)
      throw new Error("Delaunator output appears inconsistent");
    if (t.triangles.length < 3)
      throw new Error("No edges in triangulation");
    super(t);
    vt(this, "vertMap");
    vt(this, "flips");
    vt(this, "consd");
    const i = 2 ** 32 - 1, r = t.coords.length >> 1, o = t.triangles.length;
    this.vertMap = new Uint32Array(r).fill(i), this.flips = new Tn(o), this.consd = new Tn(o);
    for (let a = 0; a < o; a++) {
      const c = t.triangles[a];
      this.vertMap[c] === i && this.updateVert(a);
    }
    s && this.constrainAll(s);
  }
  /**
   * Constrain the triangulation such that there is an edge between p1 and p2.
   */
  constrainOne(t, s) {
    const { triangles: i, halfedges: r } = this.del, o = this.vertMap[t];
    let a = o;
    do {
      const h = i[a], u = we(a);
      if (h === s)
        return this.protect(a);
      const p = se(a), v = i[p];
      if (v === s)
        return this.protect(u), u;
      if (this.intersectSegments(t, s, v, h)) {
        a = p;
        break;
      }
      a = r[u];
    } while (a !== -1 && a !== o);
    let c = a, f = -1;
    for (; a !== -1; ) {
      const h = r[a], u = se(a), p = se(h), v = we(h);
      if (h === -1)
        throw new Error("Constraining edge exited the hull");
      if (this.consd.has(a))
        throw new Error("Edge intersects already constrained edge");
      if (this.isCollinear(t, s, i[a]) || this.isCollinear(t, s, i[h]))
        throw new Error("Constraining edge intersects point");
      if (!this.intersectSegments(
        i[a],
        i[h],
        i[u],
        i[p]
      )) {
        if (f === -1 && (f = a), i[p] === s) {
          if (a === f)
            throw new Error("Infinite loop: non-convex quadrilateral");
          a = f, f = -1;
          continue;
        }
        if (this.intersectSegments(
          t,
          s,
          i[p],
          i[h]
        ))
          a = p;
        else if (this.intersectSegments(
          t,
          s,
          i[v],
          i[p]
        ))
          a = v;
        else if (f === a)
          throw new Error("Infinite loop: no further intersect after non-convex");
        continue;
      }
      if (this.flipDiagonal(a), this.intersectSegments(
        t,
        s,
        i[u],
        i[p]
      ) && (f === -1 && (f = u), f === u))
        throw new Error("Infinite loop: flipped diagonal still intersects");
      i[p] === s ? (c = p, a = f, f = -1) : this.intersectSegments(
        t,
        s,
        i[v],
        i[p]
      ) && (a = v);
    }
    return this.protect(c), this.delaunify(!0), this.findEdge(t, s);
  }
  /**
   * Fix the Delaunay condition.
   */
  delaunify(t = !1) {
    const { halfedges: s } = this.del, i = this.flips, r = this.consd, o = s.length;
    let a;
    do {
      a = 0;
      for (let c = 0; c < o; c++) {
        if (r.has(c))
          continue;
        i.delete(c);
        const f = s[c];
        f !== -1 && (i.delete(f), this.isDelaunay(c) || (this.flipDiagonal(c), a++));
      }
    } while (t && a > 0);
    return this;
  }
  /**
   * Call constrainOne on each edge.
   */
  constrainAll(t) {
    const s = t.length;
    for (let i = 0; i < s; i++) {
      const r = t[i];
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
  findEdge(t, s) {
    const i = this.vertMap[s], { triangles: r, halfedges: o } = this.del;
    let a = i, c = -1;
    do {
      if (r[a] === t)
        return a;
      c = we(a), a = o[c];
    } while (a !== -1 && a !== i);
    return r[we(c)] === t ? -c : 1 / 0;
  }
  /**
   * Mark an edge as constrained, i.e. should not be touched by `delaunify`.
   */
  protect(t) {
    const s = this.del.halfedges[t], i = this.flips, r = this.consd;
    return i.delete(t), r.add(t), s !== -1 ? (i.delete(s), r.add(s), s) : -t;
  }
  /**
   * Mark an edge as flipped unless constrained.
   */
  markFlip(t) {
    const s = this.del.halfedges, i = this.flips;
    if (this.consd.has(t))
      return !1;
    const o = s[t];
    return o !== -1 && (i.add(t), i.add(o)), !0;
  }
  /**
   * Flip the edge shared by two triangles.
   */
  flipDiagonal(t) {
    const { triangles: s, halfedges: i } = this.del, r = this.flips, o = this.consd, a = i[t], c = se(t), f = we(t), h = se(a), u = we(a), p = i[c], v = i[h];
    if (o.has(t))
      throw new Error("Trying to flip a constrained edge");
    return s[t] = s[h], i[t] = v, r.set(t, r.has(h)) || o.set(t, o.has(h)), v !== -1 && (i[v] = t), i[c] = h, s[a] = s[c], i[a] = p, r.set(a, r.has(c)) || o.set(a, o.has(c)), p !== -1 && (i[p] = a), i[h] = c, this.markFlip(t), this.markFlip(f), this.markFlip(a), this.markFlip(u), r.add(c), o.delete(c), r.add(h), o.delete(h), this.updateVert(t), this.updateVert(f), this.updateVert(a), this.updateVert(u), c;
  }
  /**
   * Whether point p1, p2, and p are collinear.
   */
  isCollinear(t, s, i) {
    const r = this.del.coords;
    return ie(
      r[t * 2],
      r[t * 2 + 1],
      r[s * 2],
      r[s * 2 + 1],
      r[i * 2],
      r[i * 2 + 1]
    ) === 0;
  }
  /**
   * Whether the triangle formed by p1, p2, p3 keeps px outside the circumcircle.
   */
  inCircle(t, s, i, r) {
    const o = this.del.coords;
    return wr(
      o[t * 2],
      o[t * 2 + 1],
      o[s * 2],
      o[s * 2 + 1],
      o[i * 2],
      o[i * 2 + 1],
      o[r * 2],
      o[r * 2 + 1]
    ) < 0;
  }
  /**
   * Whether the triangles sharing edg conform to the Delaunay condition.
   */
  isDelaunay(t) {
    const { triangles: s, halfedges: i } = this.del, r = i[t];
    if (r === -1)
      return !0;
    const o = s[se(t)], a = s[t], c = s[we(t)], f = s[se(r)];
    return !this.inCircle(o, a, c, f);
  }
  /**
   * Update the vertex -> incoming edge map.
   */
  updateVert(t) {
    const { triangles: s, halfedges: i } = this.del, r = this.vertMap, o = s[t];
    let a = se(t), c = i[a];
    for (; c !== -1 && c !== t; )
      a = se(c), c = i[a];
    return r[o] = a, a;
  }
  /**
   * Whether the segments between vertices intersect.
   */
  intersectSegments(t, s, i, r) {
    const o = this.del.coords;
    return t === i || t === r || s === i || s === r ? !1 : Nn(
      o[t * 2],
      o[t * 2 + 1],
      o[s * 2],
      o[s * 2 + 1],
      o[i * 2],
      o[i * 2 + 1],
      o[r * 2],
      o[r * 2 + 1]
    );
  }
}
vt(Kn, "intersectSegments", Nn);
function Le(n, e, t) {
  if (e || (e = []), typeof n != "object" || n.type !== "FeatureCollection")
    throw "Argument points must be FeatureCollection";
  if (!Array.isArray(e)) throw "Argument points must be Array of Array";
  const s = n.features.map(
    (c) => c.geometry.coordinates
  ), i = dn.from(s);
  let r;
  const o = [];
  i.triangles.length !== 0 && e.length !== 0 && (r = new Kn(i), r.constrainAll(e));
  for (let c = 0; c < i.triangles.length; c += 3)
    o.push([i.triangles[c], i.triangles[c + 1], i.triangles[c + 2]]);
  const a = ["a", "b", "c"];
  return Vt(
    o.map((c) => {
      const f = {}, h = c.map((u, p) => {
        const v = n.features[u], M = v.geometry.coordinates, k = [M[0], M[1]];
        return M.length === 3 ? k[2] = M[2] : f[a[p]] = v.properties[t], k;
      });
      return h[3] = h[0], xe([h], f);
    })
  );
}
function ni(n, e) {
  const t = [[], [], [], []], s = [];
  return Object.keys(n).forEach((i) => {
    const r = n[i], o = r.forw, a = r.bakw, c = [
      o[0] - e.forw[0],
      o[1] - e.forw[1]
    ], f = [
      a[0] - e.bakw[0],
      e.bakw[1] - a[1]
    ], h = { forw: c, bakw: f };
    if (s.push(h), c[0] === 0 || c[1] === 0)
      return;
    let u = 0;
    c[0] > 0 && (u += 1), c[1] > 0 && (u += 2), t[u].push(h);
  }), { perQuad: t, aggregate: s };
}
function ri(n) {
  let e = 1 / 0, t = 0, s = 0;
  return n.forEach((i) => {
    const { forw: r, bakw: o } = i, a = Math.hypot(r[0], r[1]), c = Math.hypot(o[0], o[1]);
    if (c === 0) return;
    const f = a / c, h = Math.atan2(r[0], r[1]) - Math.atan2(o[0], o[1]);
    e = Math.min(e, f), t += Math.cos(h), s += Math.sin(h);
  }), isFinite(e) ? [e, Math.atan2(s, t)] : [1, 0];
}
function ii(n, e, t) {
  const { perQuad: s, aggregate: i } = ni(n, e), r = s.every((c) => c.length > 0), a = (t === "birdeye" ? r ? s : [i] : [i]).map((c) => ri(c));
  return a.length === 1 ? [a[0], a[0], a[0], a[0]] : a;
}
function si(n, e) {
  let t = 0;
  return n[0] > e[0] && (t += 1), n[1] > e[1] && (t += 2), t;
}
function oi(n, e, t) {
  const s = [
    n[0] - e.forw[0],
    n[1] - e.forw[1]
  ], r = Math.sqrt(s[0] ** 2 + s[1] ** 2) / t[0], o = Math.atan2(s[0], s[1]) - t[1];
  return [
    e.bakw[0] + r * Math.sin(o),
    e.bakw[1] - r * Math.cos(o)
  ];
}
function ai(n, e, t, s) {
  const i = e[0] - n[0], r = e[1] - n[1];
  if (Math.abs(i) < 1e-12 && Math.abs(r) < 1e-12) return null;
  const o = s[0] - t[0], a = s[1] - t[1], c = t[0] - n[0], f = t[1] - n[1], h = i * a - r * o;
  if (Math.abs(h) < 1e-12) return null;
  const u = (c * a - f * o) / h, p = (c * r - f * i) / h;
  return u <= 1e-10 || p < -1e-10 || p > 1 + 1e-10 ? null : { t: u, point: [n[0] + u * i, n[1] + u * r] };
}
function ci(n, e, t) {
  const s = t.length;
  let i = -1 / 0, r = null;
  for (let o = 0; o < s; o++) {
    const a = (o + 1) % s, c = ai(
      n,
      e,
      t[o].bakw,
      t[a].bakw
    );
    c && c.t > i && (i = c.t, r = c.point);
  }
  return r;
}
function Xn(n, e) {
  const s = Math.atan2(n[0] - e[0], n[1] - e[1]) * (180 / Math.PI);
  return s < 0 ? s + 360 : s;
}
function Cn(n, e, t, s, i, r) {
  const o = e[0] - n[0], a = e[1] - n[1];
  if (o === 0 && a === 0) return null;
  const c = [];
  if (o !== 0)
    for (const h of [t, s]) {
      const u = (h - n[0]) / o;
      if (u > 0) {
        const p = n[1] + u * a;
        p >= i && p <= r && c.push({ t: u, x: h, y: p });
      }
    }
  if (a !== 0)
    for (const h of [i, r]) {
      const u = (h - n[1]) / a;
      if (u > 0) {
        const p = n[0] + u * o;
        p >= t && p <= s && c.push({ t: u, x: p, y: h });
      }
    }
  if (c.length === 0) return null;
  c.sort((h, u) => h.t - u.t);
  const f = c[0];
  return [f.x, f.y];
}
function Rn(n, e, t) {
  const s = n.length, i = new Array(s).fill(1);
  for (const r of e)
    for (let o = 0; o < s; o++) {
      const a = (o + 1) % s, c = mn([n[o].bakw, n[a].bakw]), f = mn([t.bakw, r.bakw]), h = Ir(c, f);
      if (h.features.length > 0 && h.features[0].geometry) {
        const u = h.features[0], p = Math.sqrt(
          Math.pow(r.bakw[0] - t.bakw[0], 2) + Math.pow(r.bakw[1] - t.bakw[1], 2)
        ), v = Math.sqrt(
          Math.pow(u.geometry.coordinates[0] - t.bakw[0], 2) + Math.pow(u.geometry.coordinates[1] - t.bakw[1], 2)
        ), M = p / v;
        M > i[o] && (i[o] = M), M > i[a] && (i[a] = M);
      }
    }
  n.forEach((r, o) => {
    const a = i[o];
    r.bakw = [
      (r.bakw[0] - t.bakw[0]) * a + t.bakw[0],
      (r.bakw[1] - t.bakw[1]) * a + t.bakw[1]
    ];
  });
}
function Qn(n, e, t) {
  const { convexBuf: s, centroid: i, allGcps: r, minx: o, maxx: a, miny: c, maxy: f } = n, h = ii(s, i, e), p = [
    [o, c],
    [a, c],
    [a, f],
    [o, f]
  ].map((m) => ({
    forw: m,
    bakw: oi(
      m,
      i,
      h[si(m, i.forw)]
    )
  }));
  if (p.sort(
    (m, I) => Math.atan2(m.forw[0] - i.forw[0], m.forw[1] - i.forw[1]) - Math.atan2(I.forw[0] - i.forw[0], I.forw[1] - i.forw[1])
  ), Rn(p, r, i), !t) return p;
  const v = 4, M = p.map(
    (m) => Math.atan2(m.forw[0] - i.forw[0], m.forw[1] - i.forw[1])
  ), k = p.map(
    (m) => Math.atan2(
      m.bakw[0] - i.bakw[0],
      -(m.bakw[1] - i.bakw[1])
    )
  );
  function C(m) {
    for (let I = 0; I < v; I++) {
      const B = (I + 1) % v, E = M[I], X = I < v - 1 ? M[B] : M[B] + 2 * Math.PI;
      let A = m;
      for (; A < E; ) A += 2 * Math.PI;
      for (; A >= E + 2 * Math.PI; ) A -= 2 * Math.PI;
      if (A >= E && A < X)
        return { i: I, j: B, frac: (A - E) / (X - E) };
    }
    return { i: 0, j: 1, frac: 0 };
  }
  function F(m) {
    const { i: I, j: B, frac: E } = C(m), X = k[I];
    let R = k[B] - X;
    for (; R > Math.PI; ) R -= 2 * Math.PI;
    for (; R < -Math.PI; ) R += 2 * Math.PI;
    return X + E * R;
  }
  const g = new Set(
    p.map(
      (m) => Math.floor(Xn(m.forw, i.forw) / 10) % 36
    )
  ), w = r.map((m) => ({
    forw: m.forw,
    bakw: m.bakw,
    angleDeg: Xn(m.forw, i.forw),
    forwDist: Math.hypot(m.forw[0] - i.forw[0], m.forw[1] - i.forw[1])
  })), l = [];
  for (let m = 0; m < 36; m++) {
    if (g.has(m)) continue;
    const I = m * 10, B = w.filter(
      (_) => _.angleDeg >= I && _.angleDeg < I + 10
    );
    let E = null;
    if (B.length > 0) {
      const _ = B.reduce((x, T) => T.forwDist > x.forwDist ? T : x);
      E = Cn(i.forw, _.forw, o, a, c, f);
    }
    if (!E) {
      const _ = (I + 5) % 360 * (Math.PI / 180), x = [
        i.forw[0] + Math.sin(_),
        i.forw[1] + Math.cos(_)
      ];
      E = Cn(i.forw, x, o, a, c, f);
    }
    if (!E) continue;
    const X = [E[0] - i.forw[0], E[1] - i.forw[1]], A = Math.atan2(X[0], X[1]), R = F(A), j = [
      i.bakw[0] + Math.sin(R),
      i.bakw[1] - Math.cos(R)
    ], d = ci(i.bakw, j, p);
    d && l.push({ forw: E, bakw: d });
  }
  const y = [...p, ...l];
  return y.sort(
    (m, I) => Math.atan2(m.forw[0] - i.forw[0], m.forw[1] - i.forw[1]) - Math.atan2(I.forw[0] - i.forw[0], I.forw[1] - i.forw[1])
  ), Rn(y, r, i), y;
}
function fi(n, e = !1) {
  return Qn(n, "plain", e);
}
function hi(n, e = !1) {
  return Qn(n, "birdeye", e);
}
function ui(n, e, t, s, i) {
  if (typeof n == "number" || typeof n == "string" && /^\d+$/.test(n)) {
    const a = typeof n == "number" ? n : parseInt(n, 10);
    return e[a];
  }
  if (n === "c")
    return [s[0], s[1]];
  const r = n.match(/^b(\d+)$/);
  if (r) {
    const a = parseInt(r[1], 10);
    return i[a];
  }
  const o = n.match(/^e(\d+)$/);
  if (o) {
    const a = parseInt(o[1], 10);
    return t[a];
  }
  throw new Error(`Bad index value for v3 triangle builder: ${n}`);
}
function hn(n, e, t, s, i, r = !1) {
  const o = n.map(
    (h) => ui(h, e, t, s, i)
  ), a = [0, 1, 2, 0].map(
    (h) => r ? o[h][1] : o[h][0]
  ), c = [0, 1, 2].map(
    (h) => r ? o[h][0] : o[h][1]
  ), f = {
    a: { geom: c[0], index: n[0] },
    b: { geom: c[1], index: n[1] },
    c: { geom: c[2], index: n[2] }
  };
  return xe([a], f);
}
function Dn(n, e) {
  const t = n.vertices_points.length;
  return Array.from({ length: t }, (s, i) => {
    const r = (i + 1) % t, o = hn(
      ["c", `b${i}`, `b${r}`],
      n.points,
      n.edgeNodes ?? [],
      n.centroid_point,
      n.vertices_points,
      e
    );
    return Vt([o]);
  });
}
function li(n) {
  return n.strict_status ? n.strict_status : n.kinks_points ? "strict_error" : n.tins_points.length === 2 ? "loose" : "strict";
}
function di(n) {
  return {
    forw: Ht(n.centroid_point[0], {
      target: { geom: n.centroid_point[1], index: "c" }
    }),
    bakw: Ht(n.centroid_point[1], {
      target: { geom: n.centroid_point[0], index: "c" }
    })
  };
}
function pi(n) {
  const e = n.tins_points.length === 1 ? 0 : 1;
  return {
    forw: Vt(
      n.tins_points[0].map(
        (t) => hn(
          t,
          n.points,
          n.edgeNodes ?? [],
          n.centroid_point,
          n.vertices_points,
          !1
        )
      )
    ),
    bakw: Vt(
      n.tins_points[e].map(
        (t) => hn(
          t,
          n.points,
          n.edgeNodes ?? [],
          n.centroid_point,
          n.vertices_points,
          !0
        )
      )
    )
  };
}
function gi(n) {
  if (n)
    return {
      bakw: Vt(n.map((e) => Ht(e)))
    };
}
function mi(n) {
  const e = n.vertices_points.length, t = Dn(n, !1), s = Dn(n, !0), i = {
    forw: [n.vertices_params[0], t],
    bakw: [n.vertices_params[1], s]
  };
  if (n.vertices_params[0].length !== e || n.vertices_params[1].length !== e)
    throw new Error(
      `v3 compiled format mismatch: vertices_points has ${e} entries but vertices_params[0] has ${n.vertices_params[0].length} and vertices_params[1] has ${n.vertices_params[1].length}`
    );
  return {
    points: n.points,
    pointsWeightBuffer: n.weight_buffer,
    // v3 keys are already normalized
    strictStatus: li(n),
    verticesParams: i,
    centroid: di(n),
    edges: Ut.normalizeEdges(n.edges ?? []),
    edgeNodes: n.edgeNodes ?? [],
    tins: pi(n),
    kinks: gi(n.kinks_points),
    yaxisMode: n.yaxisMode ?? "invert",
    strictMode: n.strictMode ?? "auto",
    vertexMode: n.vertexMode,
    bounds: n.bounds,
    boundsPolygon: n.boundsPolygon,
    // V3 submap: xy/wh are not serialized (bounds polygon is the envelope).
    // V2 submap and main map: wh is present; xy defaults to [0, 0] when absent.
    wh: n.wh,
    xy: n.xy ?? [0, 0]
  };
}
function wi(n) {
  const t = new yi(n).findSegmentIntersections(), s = tr(t), i = /* @__PURE__ */ new Map();
  return s.forEach((r) => {
    i.set(`${r.x}:${r.y}`, r);
  }), Array.from(i.values()).map(
    (r) => Ht([r.x, r.y])
  );
}
class yi {
  /**
   * 線分群からArcCollectionを初期化
   * @param coords - 線分群の座標配列
   */
  constructor(e) {
    /**
     * 座標データの配列
     * _xx, _yy: Float64Array形式で座標を保持
     * _ii: 各線分の開始インデックス
     * _nn: 各線分の頂点数
     */
    vt(this, "_xx");
    vt(this, "_yy");
    // coordinates data
    vt(this, "_ii");
    vt(this, "_nn");
    // indexes, sizes
    vt(this, "_zz", null);
    vt(this, "_zlimit", 0);
    // simplification
    vt(this, "_bb", null);
    vt(this, "_allBounds", null);
    // bounding boxes
    vt(this, "_arcIter", null);
    vt(this, "_filteredArcIter", null);
    // path iterators
    vt(this, "buf");
    this.initArcs(e);
  }
  initArcs(e) {
    const t = [], s = [], i = e.map((r) => {
      const o = r ? r.length : 0;
      for (let a = 0; a < o; a++)
        t.push(r[a][0]), s.push(r[a][1]);
      return o;
    });
    this.initXYData(i, t, s);
  }
  initXYData(e, t, s) {
    const i = e.length;
    this._xx = new Float64Array(t), this._yy = new Float64Array(s), this._nn = new Uint32Array(e), this._zz = null, this._zlimit = 0, this._filteredArcIter = null, this._ii = new Uint32Array(i);
    let r = 0;
    for (let o = 0; o < i; o++)
      this._ii[o] = r, r += e[o];
    (r != this._xx.length || this._xx.length != this._yy.length) && pn("ArcCollection#initXYData() Counting error"), this.initBounds(), this._arcIter = new Fi(this._xx, this._yy);
  }
  initBounds() {
    const e = this.calcArcBounds_(this._xx, this._yy, this._nn);
    this._bb = e.bb, this._allBounds = e.bounds;
  }
  /**
   * データの境界を計算
   * @returns バウンディングボックス情報
   */
  calcArcBounds_(e, t, s) {
    const i = s.length, r = new Float64Array(i * 4), o = new Be();
    let a = 0, c, f, h;
    for (let u = 0; u < i; u++)
      c = s[u], c > 0 && (f = u * 4, h = Yi(e, t, a, c), r[f++] = h[0], r[f++] = h[1], r[f++] = h[2], r[f] = h[3], a += c, o.mergeBounds(h));
    return {
      bb: r,
      bounds: o
    };
  }
  getBounds() {
    return this._allBounds ? this._allBounds.clone() : new Be();
  }
  // @cb function(i, j, xx, yy)
  forEachSegment(e) {
    let t = 0;
    for (let s = 0, i = this.size(); s < i; s++)
      t += this.forEachArcSegment(s, e);
    return t;
  }
  size() {
    return this._ii && this._ii.length || 0;
  }
  // @cb function(i, j, xx, yy)
  forEachArcSegment(e, t) {
    const s = e >= 0, i = s ? e : ~e, r = this.getRetainedInterval(), o = this._nn[i], a = s ? 1 : -1;
    let c = s ? this._ii[i] : this._ii[i] + o - 1, f = c, h = 0;
    for (let u = 1; u < o; u++)
      f += a, (r === 0 || this._zz[f] >= r) && (t(c, f, this._xx, this._yy), c = f, h++);
    return h;
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
  getUint32Array(e) {
    const t = e * 4;
    return (!this.buf || this.buf.byteLength < t) && (this.buf = new ArrayBuffer(t)), new Uint32Array(this.buf, 0, e);
  }
  // Return average magnitudes of dx, dy (with simplification)
  getAvgSegment2() {
    let e = 0, t = 0;
    const s = this.forEachSegment(
      (i, r, o, a) => {
        e += Math.abs(o[i] - o[r]), t += Math.abs(a[i] - a[r]);
      }
    );
    return [e / s || 0, t / s || 0];
  }
  /**
   * 交差判定のためのストライプ数を計算
   * 線分の平均長さに基づいて最適な分割数を決定
   */
  calcSegmentIntersectionStripeCount() {
    const e = this.getBounds().height(), t = this.getAvgSegment2()[1];
    let s = 1;
    return t > 0 && e > 0 && (s = Math.ceil(e / t / 20)), s || 1;
  }
  /**
   * 線分の交差を検出
   * ストライプ分割による効率的な判定を実装
   *
   * @returns 検出された交差点の配列
   */
  findSegmentIntersections() {
    const e = this.getBounds(), t = e.ymin || 0, s = (e.ymax || 0) - t, i = this.calcSegmentIntersectionStripeCount(), r = new Uint32Array(i), o = i > 1 ? (k) => Math.floor((i - 1) * (k - t) / s) : () => 0;
    let a, c;
    this.forEachSegment(
      (k, C, F, g) => {
        let w = o(g[k]);
        const l = o(g[C]);
        for (; r[w] = r[w] + 2, w != l; )
          w += l > w ? 1 : -1;
      }
    );
    const f = this.getUint32Array(xi(r));
    let h = 0;
    const u = [];
    _i(r, (k) => {
      const C = h;
      h += k, u.push(f.subarray(C, h));
    }), Mi(r, 0), this.forEachSegment(
      (k, C, F, g) => {
        let w = o(g[k]);
        const l = o(g[C]);
        let y, m;
        for (; y = r[w], r[w] = y + 2, m = u[w], m[y] = k, m[y + 1] = C, w != l; )
          w += l > w ? 1 : -1;
      }
    );
    const p = this.getVertexData(), v = [];
    let M;
    for (a = 0; a < i; a++)
      if (p.xx && p.yy)
        for (M = ki(u[a], p.xx, p.yy), c = 0; c < M.length; c++)
          v.push(M[c]);
    return tr(v);
  }
}
function pn(...n) {
  const e = n.join(" ");
  throw new Error(e);
}
function gn(n) {
  return n ? bi(n) ? !0 : vi(n) ? !1 : n.length === 0 ? !0 : n.length > 0 : !1;
}
function vi(n) {
  return n != null && n.toString === String.prototype.toString;
}
function bi(n) {
  return Array.isArray(n);
}
function xi(n, e) {
  gn(n) || pn("utils.sum() expects an array, received:", n);
  let t = 0, s;
  for (let i = 0, r = n.length; i < r; i++)
    s = n[i], s && (t += s);
  return t;
}
function _i(n, e, t) {
  if (!gn(n))
    throw new Error(`#forEach() takes an array-like argument. ${n}`);
  for (let s = 0, i = n.length; s < i; s++)
    e.call(t, n[s], s);
}
function Mi(n, e) {
  for (let t = 0, s = n.length; t < s; t++)
    n[t] = e;
  return n;
}
function ki(n, e, t) {
  const s = n.length - 2, i = [];
  let r, o, a, c, f, h, u, p, v, M, k, C, F, g, w, l, y;
  for (Xi(e, n), l = 0; l < s; ) {
    for (r = n[l], o = n[l + 1], f = e[r], h = e[o], v = t[r], M = t[o], y = l; y < s && (y += 2, a = n[y], u = e[a], !(h < u)); ) {
      if (k = t[a], c = n[y + 1], p = e[c], C = t[c], v >= k) {
        if (v > C && M > k && M > C) continue;
      } else if (v < C && M < k && M < C) continue;
      r == a || r == c || o == a || o == c || (F = Si(
        f,
        v,
        h,
        M,
        u,
        k,
        p,
        C
      ), F && (g = [r, o], w = [a, c], i.push(Yn(F, g, w, e, t)), F.length == 4 && i.push(
        Yn(F.slice(2), g, w, e, t)
      )));
    }
    l += 2;
  }
  return i;
}
function Si(n, e, t, s, i, r, o, a) {
  const c = Ei(n, e, t, s, i, r, o, a);
  let f = null;
  return c && (f = Ai(n, e, t, s, i, r, o, a), f ? Ni(n, e, t, s, i, r, o, a) && (f = null) : f = Ti(n, e, t, s, i, r, o, a)), f;
}
function Ei(n, e, t, s, i, r, o, a) {
  return Ae(n, e, t, s, i, r) * Ae(n, e, t, s, o, a) <= 0 && Ae(i, r, o, a, n, e) * Ae(i, r, o, a, t, s) <= 0;
}
function Ae(n, e, t, s, i, r) {
  return Hn(n - i, e - r, t - i, s - r);
}
function Hn(n, e, t, s) {
  return n * s - e * t;
}
function Ai(n, e, t, s, i, r, o, a) {
  let c = $e(n, e, t, s, i, r, o, a), f;
  return c && (f = Pi(c[0], c[1], n, e, t, s, i, r, o, a), f == 1 ? c = $e(t, s, n, e, i, r, o, a) : f == 2 ? c = $e(i, r, o, a, n, e, t, s) : f == 3 && (c = $e(o, a, i, r, n, e, t, s))), c && Oi(c, n, e, t, s, i, r, o, a), c;
}
function $e(n, e, t, s, i, r, o, a) {
  const c = Hn(t - n, s - e, o - i, a - r), f = 1e-18;
  let h;
  if (c === 0) return null;
  const u = Ae(i, r, o, a, n, e) / c;
  return c <= f && c >= -f ? h = Ii(n, e, t, s, i, r, o, a) : h = [n + u * (t - n), e + u * (s - e)], h;
}
function Ii(n, e, t, s, i, r, o, a) {
  let c = null;
  return !oe(n, i, o) && !oe(e, r, a) ? c = [n, e] : !oe(t, i, o) && !oe(s, r, a) ? c = [t, s] : !oe(i, n, t) && !oe(r, e, s) ? c = [i, r] : !oe(o, n, t) && !oe(a, e, s) && (c = [o, a]), c;
}
function oe(n, e, t) {
  let s;
  return e < t ? s = n < e || n > t : e > t ? s = n > e || n < t : s = n != e, s;
}
function Pi(n, e, ...t) {
  let s = -1, i = 1 / 0, r;
  for (let o = 0, a = 0, c = t.length; a < c; o++, a += 2)
    r = Bi(n, e, t[a], t[a + 1]), r < i && (i = r, s = o);
  return s;
}
function Bi(n, e, t, s) {
  const i = n - t, r = e - s;
  return i * i + r * r;
}
function Oi(n, e, t, s, i, r, o, a, c) {
  let f = n[0], h = n[1];
  f = Ve(f, e, s), f = Ve(f, r, a), h = Ve(h, t, i), h = Ve(h, o, c), n[0] = f, n[1] = h;
}
function Ve(n, e, t) {
  let s;
  return oe(n, e, t) && (s = Math.abs(n - e) < Math.abs(n - t) ? e : t, n = s), n;
}
function Ti(n, e, t, s, i, r, o, a) {
  const c = Math.min(n, t, i, o), f = Math.max(n, t, i, o), h = Math.min(e, s, r, a), u = Math.max(e, s, r, a), p = u - h > f - c;
  let v = [];
  return (p ? ue(e, h, u) : ue(n, c, f)) && v.push(n, e), (p ? ue(s, h, u) : ue(t, c, f)) && v.push(t, s), (p ? ue(r, h, u) : ue(i, c, f)) && v.push(i, r), (p ? ue(a, h, u) : ue(o, c, f)) && v.push(o, a), (v.length != 2 && v.length != 4 || v.length == 4 && v[0] == v[2] && v[1] == v[3]) && (v = null), v;
}
function Ni(n, e, t, s, i, r, o, a) {
  return n == i && e == r || n == o && e == a || t == i && s == r || t == o && s == a;
}
function ue(n, e, t) {
  return n > e && n < t;
}
function Xi(n, e) {
  Ci(n, e), Zn(n, e, 0, e.length - 2);
}
function Ci(n, e) {
  for (let t = 0, s = e.length; t < s; t += 2)
    n[e[t]] > n[e[t + 1]] && Ri(e, t, t + 1);
}
function Ri(n, e, t) {
  const s = n[e];
  n[e] = n[t], n[t] = s;
}
function Zn(n, e, t, s) {
  let i = t, r = s, o, a;
  for (; i < s; ) {
    for (o = n[e[t + s >> 2 << 1]]; i <= r; ) {
      for (; n[e[i]] < o; ) i += 2;
      for (; n[e[r]] > o; ) r -= 2;
      i <= r && (a = e[i], e[i] = e[r], e[r] = a, a = e[i + 1], e[i + 1] = e[r + 1], e[r + 1] = a, i += 2, r -= 2);
    }
    if (r - t < 40 ? Fn(n, e, t, r) : Zn(n, e, t, r), s - i < 40) {
      Fn(n, e, i, s);
      return;
    }
    t = i, r = s;
  }
}
function Fn(n, e, t, s) {
  let i, r;
  for (let o = t + 2; o <= s; o += 2) {
    i = e[o], r = e[o + 1];
    let a;
    for (a = o - 2; a >= t && n[i] < n[e[a]]; a -= 2)
      e[a + 2] = e[a], e[a + 3] = e[a + 1];
    e[a + 2] = i, e[a + 3] = r;
  }
}
function Yn(n, e, t, s, i) {
  const r = n[0], o = n[1];
  e = Ln(r, o, e[0], e[1], s, i), t = Ln(r, o, t[0], t[1], s, i);
  const a = e[0] < t[0] ? e : t, c = a == e ? t : e;
  return { x: r, y: o, a, b: c };
}
function Ln(n, e, t, s, i, r) {
  let o = t < s ? t : s, a = o === t ? s : t;
  return i[o] == n && r[o] == e ? a = o : i[a] == n && r[a] == e && (o = a), [o, a];
}
function tr(n) {
  const e = {};
  return n.filter((t) => {
    const s = Di(t);
    return s in e ? !1 : (e[s] = !0, !0);
  });
}
function Di(n) {
  return `${n.a.join(",")};${n.b.join(",")}`;
}
class Fi {
  constructor(e, t) {
    vt(this, "_i", 0);
    vt(this, "_n", 0);
    vt(this, "_inc", 1);
    vt(this, "_xx");
    vt(this, "_yy");
    vt(this, "i", 0);
    vt(this, "x", 0);
    vt(this, "y", 0);
    this._xx = e, this._yy = t;
  }
}
function Yi(n, e, t, s) {
  let i = t | 0;
  const r = isNaN(s) ? n.length - i : s + i;
  let o, a, c, f, h, u;
  if (r > 0)
    c = h = n[i], f = u = e[i];
  else return [void 0, void 0, void 0, void 0];
  for (i++; i < r; i++)
    o = n[i], a = e[i], o < c && (c = o), o > h && (h = o), a < f && (f = a), a > u && (u = a);
  return [c, f, h, u];
}
class Be {
  constructor(...e) {
    vt(this, "xmin");
    vt(this, "ymin");
    vt(this, "xmax");
    vt(this, "ymax");
    e.length > 0 && this.setBounds(e);
  }
  // Return a bounding box with the same extent as this one.
  cloneBounds() {
    return this.clone();
  }
  clone() {
    return new Be(
      this.xmin,
      this.ymin,
      this.xmax,
      this.ymax
    );
  }
  width() {
    return this.xmax - this.xmin || 0;
  }
  height() {
    return this.ymax - this.ymin || 0;
  }
  setBounds(e, t, s, i) {
    let r, o, a, c;
    if (arguments.length == 1)
      if (gn(e)) {
        const f = e;
        r = f[0], o = f[1], a = f[2], c = f[3];
      } else {
        const f = e;
        r = f.xmin, o = f.ymin, a = f.xmax, c = f.ymax;
      }
    else
      r = e, o = t, a = s, c = i;
    return this.xmin = r, this.ymin = o, this.xmax = a, this.ymax = c, (r > a || o > c) && this.update(), this;
  }
  update() {
    let e;
    this.xmin > this.xmax && (e = this.xmin, this.xmin = this.xmax, this.xmax = e), this.ymin > this.ymax && (e = this.ymin, this.ymin = this.ymax, this.ymax = e);
  }
  mergeBounds(e, ...t) {
    let s, i, r, o;
    return e instanceof Be ? (s = e.xmin, i = e.ymin, r = e.xmax, o = e.ymax) : t.length == 3 ? (s = e, i = t[0], r = t[1], o = t[2]) : e.length == 4 ? (s = e[0], i = e[1], r = e[2], o = e[3]) : pn("Bounds#mergeBounds() invalid argument:", e), this.xmin === void 0 ? this.setBounds(s, i, r, o) : (s < this.xmin && (this.xmin = s), i < this.ymin && (this.ymin = i), r > this.xmax && (this.xmax = r), o > this.ymax && (this.ymax = o)), this;
  }
}
function We(n) {
  const e = ["a", "b", "c"].map(
    (t) => n.properties[t].index
  );
  return [
    [0, 1],
    [0, 2],
    [1, 2],
    [0, 1, 2]
  ].map(
    (t) => t.map((s) => e[s]).sort().join("-")
  ).sort();
}
function er(n, e, t) {
  const s = We(e.forw), i = We(e.bakw);
  if (JSON.stringify(s) != JSON.stringify(i))
    throw `${JSON.stringify(e, null, 2)}
${JSON.stringify(
      s
    )}
${JSON.stringify(i)}`;
  for (let r = 0; r < s.length; r++) {
    const o = s[r];
    n[o] || (n[o] = []), n[o].push(e);
  }
  t && (t.forw.features.push(e.forw), t.bakw.features.push(e.bakw));
}
function $n(n, e, t) {
  const s = We(e.forw), i = We(e.bakw);
  if (JSON.stringify(s) != JSON.stringify(i))
    throw `${JSON.stringify(e, null, 2)}
${JSON.stringify(s)}
${JSON.stringify(i)}`;
  if (s.forEach((r) => {
    const o = n[r];
    if (!o) return;
    const a = o.filter((c) => c !== e);
    a.length === 0 ? delete n[r] : n[r] = a;
  }), t) {
    const r = (o, a) => {
      !o || !a || (o.features = o.features.filter((c) => c !== a));
    };
    r(t.forw, e.forw), r(t.bakw, e.bakw);
  }
}
function je(n, e, t) {
  return Ht(n, { target: { geom: e, index: t } });
}
function qe(n) {
  return Ht(n.properties.target.geom, {
    target: {
      geom: n.geometry.coordinates,
      index: n.properties.target.index
    }
  });
}
function Vn(n, e) {
  const t = n.length, s = e.geometry.coordinates;
  return Array.from({ length: t }, (i, r) => r).map((i) => {
    const r = (i + 1) % t, o = n[i], a = n[r], c = o.geometry.coordinates, f = Math.atan2(
      c[0] - s[0],
      c[1] - s[1]
    ), h = [e, o, a, e].map(
      (v) => v.geometry.coordinates
    ), u = {
      a: {
        geom: e.properties.target.geom,
        index: e.properties.target.index
      },
      b: {
        geom: o.properties.target.geom,
        index: o.properties.target.index
      },
      c: {
        geom: a.properties.target.geom,
        index: a.properties.target.index
      }
    }, p = Vt([
      xe([h], u)
    ]);
    return [f, p];
  }).reduce(
    (i, r) => (i[0].push(r[0]), i[1].push(r[1]), i),
    [[], []]
  );
}
function Li(n) {
  const { tins: e, targets: t, includeReciprocals: s, numBoundaryVertices: i = 4 } = n, r = {};
  t.forEach((a) => {
    const c = e[a];
    if (!c || !c.features) return;
    r[a] = {};
    const f = {};
    c.features.forEach((h) => {
      const u = ["a", "b", "c"];
      for (let p = 0; p < 3; p++) {
        const v = (p + 1) % 3, M = u[p], k = u[v], C = h.properties[M].index, F = h.properties[k].index, g = [C, F].sort().join("-");
        if (f[g]) continue;
        f[g] = !0;
        const w = h.geometry.coordinates[0][p], l = h.geometry.coordinates[0][v], y = h.properties[M].geom, m = h.properties[k].geom, I = Math.sqrt(
          Math.pow(y[0] - m[0], 2) + Math.pow(y[1] - m[1], 2)
        ) / Math.sqrt(
          Math.pow(w[0] - l[0], 2) + Math.pow(w[1] - l[1], 2)
        ), B = r[a];
        B[`${C}:${g}`] = I, B[`${F}:${g}`] = I;
      }
    });
  });
  const o = {};
  return s && (o.bakw = {}), t.forEach((a) => {
    const c = r[a];
    if (o[a] = {}, !c)
      return;
    const f = {};
    Object.keys(c).forEach((u) => {
      const [p] = u.split(":");
      f[p] || (f[p] = []), f[p].push(c[u]);
    }), Object.keys(f).forEach((u) => {
      const p = f[u], v = p.reduce((M, k) => M + k, 0) / p.length;
      o[a][u] = v, s && o.bakw && (o.bakw[u] = 1 / v);
    });
    let h = 0;
    for (let u = 0; u < i; u++) {
      const p = `b${u}`, v = o[a][p] || 0;
      h += v;
    }
    o[a].c = h / i, s && o.bakw && (o.bakw.c = 1 / o[a].c);
  }), o;
}
function Ue(n, e = 1e-6) {
  const [t, s] = n[0], [i, r] = n[1], [o, a] = n[2];
  return Math.abs((i - t) * (a - s) - (o - t) * (r - s)) < e;
}
function $i(n, e) {
  const t = n.split("-");
  if (t.length !== 2 || !t.every((r) => /^-?\d+$/.test(r))) return !1;
  const [s, i] = t.map((r) => parseInt(r, 10)).sort((r, o) => r - o);
  return e.some((r) => {
    if (r.length !== 2) return !1;
    const o = r.map((c) => parseInt(`${c}`, 10));
    if (o.some((c) => Number.isNaN(c))) return !1;
    const a = o.sort((c, f) => c - f);
    return a[0] === s && a[1] === i;
  });
}
function Ie(n) {
  return ["a", "b", "c"].map((e, t) => ({
    prop: n.properties[e],
    geom: n.geometry.coordinates[0][t]
  }));
}
const Vi = 10;
function ji(n, e, t, s, i, r) {
  if (!n && !e) return !1;
  const o = n ? 0 : 1, a = 1 - o, c = t[o], f = t[a];
  if (!c || !f) return !1;
  const h = zt(f.geom);
  let u = !1, p = !1;
  for (let v = 0; v <= 1; v++) {
    const M = s[v];
    if (!M) continue;
    const k = [String(M.prop.index), String(c.prop.index)].sort().join("-"), C = i[k];
    if (!C || C.length < 2) continue;
    const F = C.find(
      (A) => A.bakw !== r[o].bakw
    );
    if (!F) continue;
    const w = Ie(F.bakw).find(
      (A) => String(A.prop.index) !== String(M.prop.index) && String(A.prop.index) !== String(c.prop.index)
    );
    if (!w) continue;
    u = !0;
    const l = zt(w.geom), y = zt(M.geom), m = zt(c.geom), I = m[0] - y[0], B = m[1] - y[1], E = I * (h[1] - y[1]) - B * (h[0] - y[0]), X = I * (l[1] - y[1]) - B * (l[0] - y[0]);
    if (E * X > 0) {
      p = !0;
      break;
    }
  }
  return u && !p;
}
function qi(n, e, t, s) {
  if (!n && !e) return !1;
  if (t[0] && t[1] && s[0] && s[1]) {
    const i = s.map((h) => zt(h.geom)), r = t.map((h) => zt(h.geom)), o = i[1][0] - i[0][0], a = i[1][1] - i[0][1], c = o * (r[0][1] - i[0][1]) - a * (r[0][0] - i[0][0]), f = o * (r[1][1] - i[0][1]) - a * (r[1][0] - i[0][0]);
    return c * f < 0;
  }
  return !1;
}
function Ui(n, e, t) {
  const s = /* @__PURE__ */ new Set();
  let i = !1;
  for (let r = 0; r < Vi; r++) {
    let o = !1;
    for (const a of Object.keys(e)) {
      if (s.has(a)) continue;
      s.add(a);
      const c = e[a];
      if (!c || c.length < 2) continue;
      const f = a.split("-");
      if (f.length !== 2 || $i(a, t)) continue;
      const h = Ie(c[0].bakw), u = Ie(c[1].bakw), p = Ie(c[0].forw), v = Ie(c[1].forw), M = f.map(
        (P) => h.find((D) => `${D.prop.index}` === P) || u.find((D) => `${D.prop.index}` === P)
      ), k = f.map(
        (P) => p.find((D) => `${D.prop.index}` === P) || v.find((D) => `${D.prop.index}` === P)
      );
      if (M.some((P) => !P) || k.some((P) => !P))
        continue;
      const C = [h, u].map(
        (P) => P.find((D) => !f.includes(`${D.prop.index}`))
      ), F = [p, v].map(
        (P) => P.find((D) => !f.includes(`${D.prop.index}`))
      );
      if (C.some((P) => !P) || F.some((P) => !P))
        continue;
      const g = c[0].bakw.geometry.coordinates[0].slice(0, 3).map((P) => zt(P)), w = c[1].bakw.geometry.coordinates[0].slice(0, 3).map((P) => zt(P)), l = c[0].forw.geometry.coordinates[0].slice(0, 3).map((P) => zt(P)), y = c[1].forw.geometry.coordinates[0].slice(0, 3).map((P) => zt(P)), m = Ue(g), I = Ue(w), B = Ue(l), E = Ue(y), X = ji(
        m,
        I,
        C,
        M,
        e,
        c
      ), A = qi(
        B,
        E,
        C,
        M
      );
      if (!(X || A || jn(
        zt(C[0].geom),
        w
      ) || jn(
        zt(C[1].geom),
        g
      )))
        continue;
      const j = k.map(
        (P) => zt(P.geom)
      ), d = F.map(
        (P) => zt(P.geom)
      ), _ = zi([
        ...j,
        ...d
      ]), x = Wi(_), T = qn(
        j[0],
        j[1],
        d[0]
      ) + qn(
        j[0],
        j[1],
        d[1]
      );
      un(x, T) && ($n(e, c[0], n), $n(e, c[1], n), M.forEach((P) => {
        if (!P) return;
        const D = [
          P.geom,
          C[0].geom,
          C[1].geom,
          P.geom
        ], b = {
          a: P.prop,
          b: C[0].prop,
          c: C[1].prop
        }, O = xe([D], b), L = Ut.counterTri(O);
        er(e, {
          forw: L,
          bakw: O
        }, n);
      }), o = !0, i = !0);
    }
    if (!o) break;
  }
  return i;
}
function zt(n) {
  return [n[0], n[1]];
}
function jn(n, e) {
  const [t, s] = e[0], [i, r] = e[1], [o, a] = e[2], c = o - t, f = a - s, h = i - t, u = r - s, p = n[0] - t, v = n[1] - s, M = c * c + f * f, k = c * h + f * u, C = c * p + f * v, F = h * h + u * u, g = h * p + u * v, w = M * F - k * k;
  if (w === 0) return !1;
  const l = 1 / w, y = (F * C - k * g) * l, m = (M * g - k * C) * l, I = 1e-9;
  return y >= -I && m >= -I && y + m <= 1 + I;
}
function zi(n) {
  const e = n.map((o) => o.slice()).filter(
    (o, a, c) => c.findIndex(
      (f) => un(f[0], o[0]) && un(f[1], o[1])
    ) === a
  );
  if (e.length <= 1) return e;
  const t = e.sort(
    (o, a) => o[0] === a[0] ? o[1] - a[1] : o[0] - a[0]
  ), s = (o, a, c) => (a[0] - o[0]) * (c[1] - o[1]) - (a[1] - o[1]) * (c[0] - o[0]), i = [];
  for (const o of t) {
    for (; i.length >= 2 && s(
      i[i.length - 2],
      i[i.length - 1],
      o
    ) <= 0; )
      i.pop();
    i.push(o);
  }
  const r = [];
  for (let o = t.length - 1; o >= 0; o--) {
    const a = t[o];
    for (; r.length >= 2 && s(
      r[r.length - 2],
      r[r.length - 1],
      a
    ) <= 0; )
      r.pop();
    r.push(a);
  }
  return r.pop(), i.pop(), i.concat(r);
}
function Wi(n) {
  if (n.length < 3) return 0;
  let e = 0;
  for (let t = 0; t < n.length; t++) {
    const [s, i] = n[t], [r, o] = n[(t + 1) % n.length];
    e += s * o - r * i;
  }
  return Math.abs(e) / 2;
}
function qn(n, e, t) {
  return Math.abs(
    (n[0] * (e[1] - t[1]) + e[0] * (t[1] - n[1]) + t[0] * (n[1] - e[1])) / 2
  );
}
function un(n, e, t = 1e-9) {
  return Math.abs(n - e) <= t;
}
const Un = 3;
class Bt extends Ut.Transform {
  /**
   * Tinクラスのインスタンスを生成します
   * @param options - 初期化オプション
   */
  constructor(t = {}) {
    super();
    vt(this, "importance");
    vt(this, "priority");
    vt(this, "pointsSet");
    vt(this, "useV2Algorithm");
    t.bounds ? this.setBounds(t.bounds) : (this.setWh(t.wh), this.vertexMode = t.vertexMode || Bt.VERTEX_PLAIN), this.strictMode = t.strictMode || Bt.MODE_AUTO, this.yaxisMode = t.yaxisMode || Bt.YAXIS_INVERT, this.importance = t.importance || 0, this.priority = t.priority || 0, this.stateFull = t.stateFull || !1, this.useV2Algorithm = t.useV2Algorithm ?? !1, t.points && this.setPoints(t.points), t.edges && this.setEdges(t.edges);
  }
  /**
   * フォーマットバージョンを取得します
   */
  getFormatVersion() {
    return this.useV2Algorithm ? Ut.format_version : Un;
  }
  /**
   * 制御点（GCP: Ground Control Points）を設定します。
   * 指定した点群に合わせて内部のTINキャッシュをリセットします。
   */
  setPoints(t) {
    this.yaxisMode === Bt.YAXIS_FOLLOW && (t = t.map((s) => [
      s[0],
      [s[1][0], -1 * s[1][1]]
    ])), this.points = t, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * エッジ（制約線）を設定します。
   * 制約線を正規化した上で、依存するキャッシュをリセットします。
   */
  setEdges(t = []) {
    this.edges = Ut.normalizeEdges(t), this.edgeNodes = void 0, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 境界ポリゴンを設定します
   */
  setBounds(t) {
    this.bounds = t;
    let s = t[0][0], i = s, r = t[0][1], o = r;
    const a = [t[0]];
    for (let c = 1; c < t.length; c++) {
      const f = t[c];
      f[0] < s && (s = f[0]), f[0] > i && (i = f[0]), f[1] < r && (r = f[1]), f[1] > o && (o = f[1]), a.push(f);
    }
    a.push(t[0]), this.boundsPolygon = xe([a]), this.xy = [s, r], this.wh = [i - s, o - r], this.vertexMode = Bt.VERTEX_PLAIN, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 現在の設定を永続化可能な形式にコンパイルします
   */
  getCompiled() {
    var i;
    const t = {};
    t.version = this.useV2Algorithm ? Ut.format_version : Un, t.points = this.points, t.weight_buffer = this.pointsWeightBuffer ?? {}, t.centroid_point = [
      this.centroid.forw.geometry.coordinates,
      this.centroid.forw.properties.target.geom
    ], t.vertices_params = [
      this.vertices_params.forw[0],
      this.vertices_params.bakw[0]
    ], t.vertices_points = [];
    const s = this.vertices_params.forw[1];
    if (s)
      for (let r = 0; r < s.length; r++) {
        const o = s[r].features[0], a = o.geometry.coordinates[0][1], c = o.properties.b.geom;
        t.vertices_points[r] = [a, c];
      }
    return t.strict_status = this.strict_status, t.tins_points = [[]], this.tins.forw.features.map((r) => {
      t.tins_points[0].push(
        ["a", "b", "c"].map(
          (o) => r.properties[o].index
        )
      );
    }), this.strict_status === Bt.STATUS_LOOSE ? (t.tins_points[1] = [], this.tins.bakw.features.map((r) => {
      t.tins_points[1].push(
        ["a", "b", "c"].map(
          (o) => r.properties[o].index
        )
      );
    })) : this.strict_status === Bt.STATUS_ERROR && ((i = this.kinks) != null && i.bakw) && (t.kinks_points = this.kinks.bakw.features.map(
      (r) => r.geometry.coordinates
    )), t.yaxisMode = this.yaxisMode, t.vertexMode = this.vertexMode, t.strictMode = this.strictMode, this.bounds ? (t.bounds = this.bounds, t.boundsPolygon = this.boundsPolygon, this.useV2Algorithm && (t.xy = this.xy, t.wh = this.wh)) : t.wh = this.wh, t.edges = this.edges ?? [], t.edgeNodes = this.edgeNodes ?? [], t;
  }
  /**
   * コンパイルされた設定を適用します（v3+フォーマット対応）
   *
   * バージョン3以上のコンパイル済みデータが渡された場合は restoreV3State() を
   * 使用してN頂点対応の復元を行います。それ以外は基底クラスの実装に委譲します。
   */
  setCompiled(t) {
    const s = t.version;
    if (typeof s == "number" && s >= 3) {
      const i = mi(t);
      this.points = i.points, this.pointsWeightBuffer = i.pointsWeightBuffer, this.strict_status = i.strictStatus, this.vertices_params = i.verticesParams, this.centroid = i.centroid, this.edges = i.edges, this.edgeNodes = i.edgeNodes || [], this.tins = i.tins, this.addIndexedTin(), this.kinks = i.kinks, this.yaxisMode = i.yaxisMode ?? Bt.YAXIS_INVERT, this.vertexMode = i.vertexMode ?? Bt.VERTEX_PLAIN, this.strictMode = i.strictMode ?? Bt.MODE_AUTO, i.bounds ? (this.bounds = i.bounds, this.boundsPolygon = i.boundsPolygon, this.xy = i.xy ?? [0, 0], i.wh && (this.wh = i.wh)) : (this.bounds = void 0, this.boundsPolygon = void 0, this.xy = i.xy ?? [0, 0], i.wh && (this.wh = i.wh));
      return;
    }
    super.setCompiled(t);
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
    var r;
    const t = this.tins.forw.features.map(
      (o) => Ut.counterTri(o)
    );
    this.tins.bakw = Vt(t);
    const s = {};
    this.tins.forw.features.forEach((o, a) => {
      const c = this.tins.bakw.features[a];
      er(s, { forw: o, bakw: c });
    }), Ui(
      this.tins,
      s,
      ((r = this.pointsSet) == null ? void 0 : r.edges) || []
    );
    const i = ["forw", "bakw"].map((o) => {
      const a = this.tins[o].features.map(
        (c) => c.geometry.coordinates[0]
      );
      return wi(a);
    });
    i[0].length === 0 && i[1].length === 0 ? (this.strict_status = Bt.STATUS_STRICT, delete this.kinks) : (this.strict_status = Bt.STATUS_ERROR, this.kinks = {
      forw: Vt(i[0]),
      bakw: Vt(i[1])
    });
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
      const o = this.points[r][0], a = this.points[r][1], c = je(o, a, r);
      t.forw.push(c), t.bakw.push(qe(c));
    }
    const s = [];
    let i = 0;
    this.edgeNodes = [], this.edges || (this.edges = []);
    for (let r = 0; r < this.edges.length; r++) {
      const o = this.edges[r][2], a = Object.assign([], this.edges[r][0]), c = Object.assign([], this.edges[r][1]);
      if (a.length === 0 && c.length === 0) {
        s.push(o);
        continue;
      }
      a.unshift(this.points[o[0]][0]), a.push(this.points[o[1]][0]), c.unshift(this.points[o[0]][1]), c.push(this.points[o[1]][1]);
      const f = [a, c].map((h) => {
        const u = h.map((v, M, k) => {
          if (M === 0) return 0;
          const C = k[M - 1];
          return Math.sqrt(
            Math.pow(v[0] - C[0], 2) + Math.pow(v[1] - C[1], 2)
          );
        }), p = u.reduce((v, M, k) => k === 0 ? [0] : (v.push(v[k - 1] + M), v), []);
        return p.map((v, M, k) => {
          const C = v / k[k.length - 1];
          return [h[M], u[M], p[M], C];
        });
      });
      f.map((h, u) => {
        const p = f[u ? 0 : 1];
        return h.filter((v, M) => !(M === 0 || M === h.length - 1 || v[4] === "handled")).flatMap((v) => {
          const M = v[0], k = v[3], C = p.reduce(
            (F, g, w, l) => {
              if (F) return F;
              const y = l[w + 1];
              if (g[3] === k)
                return g[4] = "handled", [g];
              if (g[3] < k && y && y[3] > k)
                return [g, y];
            },
            void 0
          );
          if (C && C.length === 1)
            return u === 0 ? [[M, C[0][0], k]] : [[C[0][0], M, k]];
          if (C && C.length === 2) {
            const F = C[0], g = C[1], w = (k - F[3]) / (g[3] - F[3]), l = [
              (g[0][0] - F[0][0]) * w + F[0][0],
              (g[0][1] - F[0][1]) * w + F[0][1]
            ];
            return u === 0 ? [[M, l, k]] : [[l, M, k]];
          }
          return [];
        });
      }).reduce((h, u) => h.concat(u), []).sort((h, u) => h[2] < u[2] ? -1 : 1).map((h, u, p) => {
        this.edgeNodes[i] = [
          h[0],
          h[1]
        ];
        const v = je(
          h[0],
          h[1],
          `e${i}`
        );
        i++, t.forw.push(v), t.bakw.push(qe(v)), u === 0 ? s.push([o[0], t.forw.length - 1]) : s.push([
          t.forw.length - 2,
          t.forw.length - 1
        ]), u === p.length - 1 && s.push([t.forw.length - 1, o[1]]);
      });
    }
    return {
      forw: t.forw,
      bakw: t.bakw,
      edges: s
    };
  }
  /**
   * 入力データの検証と初期データの準備
   */
  validateAndPrepareInputs() {
    const t = this.xy[0] - 0.05 * this.wh[0], s = this.xy[0] + 1.05 * this.wh[0], i = this.xy[1] - 0.05 * this.wh[1], r = this.xy[1] + 1.05 * this.wh[1];
    if (this.bounds && !this.boundsPolygon) throw new Error("Internal error: bounds is set but boundsPolygon is missing");
    const o = this.bounds ? this.boundsPolygon : void 0;
    if (!this.points.reduce((f, h) => f && (o ? on(h[0], o) : h[0][0] >= t && h[0][0] <= s && h[0][1] >= i && h[0][1] <= r), !0))
      throw "SOME POINTS OUTSIDE";
    let c = [];
    return this.wh && (c = [[t, i], [s, i], [t, r], [s, r]]), {
      pointsSet: this.generatePointsSet(),
      bbox: c,
      minx: t,
      maxx: s,
      miny: i,
      maxy: r
    };
  }
  /**
   * Compute a bounding box derived from GCP coordinates with a 5% margin.
   * Used in V3 plain mode where no explicit image bounds are available.
   */
  computeGcpBbox() {
    let t = 1 / 0, s = -1 / 0, i = 1 / 0, r = -1 / 0;
    for (const c of this.points) {
      const f = c[0][0], h = c[0][1];
      f < t && (t = f), f > s && (s = f), h < i && (i = h), h > r && (r = h);
    }
    const o = s - t, a = r - i;
    return {
      minx: t - 0.05 * o,
      maxx: s + 0.05 * o,
      miny: i - 0.05 * a,
      maxy: r + 0.05 * a
    };
  }
  /**
   * TINネットワークを同期的に更新し、座標変換の準備を行います。
   * 重めの計算を伴うため、呼び出し側が非同期制御を行いたい場合は
   * {@link updateTinAsync} を利用してください。
   */
  updateTin() {
    let t = this.strictMode;
    t !== Bt.MODE_STRICT && t !== Bt.MODE_LOOSE && (t = Bt.MODE_AUTO);
    const s = !this.useV2Algorithm;
    let i, r, o, a, c;
    if (s) {
      if (this.bounds) {
        const A = this.boundsPolygon;
        if (!A) throw new Error("Internal error: bounds is set but boundsPolygon is missing");
        if (!this.points.every(
          (j) => on(j[0], A)
        )) throw "SOME POINTS OUTSIDE";
      }
      i = this.generatePointsSet(), { minx: r, maxx: o, miny: a, maxy: c } = this.computeGcpBbox();
    } else {
      const A = this.validateAndPrepareInputs();
      i = A.pointsSet, r = A.minx, o = A.maxx, a = A.miny, c = A.maxy;
    }
    const f = {
      forw: Vt(i.forw),
      bakw: Vt(i.bakw)
    }, h = Le(
      f.forw,
      i.edges,
      "target"
    ), u = Le(
      f.bakw,
      i.edges,
      "target"
    );
    if (h.features.length === 0 || u.features.length === 0)
      throw "TOO LINEAR1";
    const p = Or(f.forw), v = Pn(f.forw);
    if (!v) throw "TOO LINEAR2";
    const M = {}, k = v.geometry.coordinates[0];
    let C;
    try {
      C = k.map((A) => ({
        forw: A,
        bakw: Ut.transformArr(Ht(A), h)
      })), C.forEach((A) => {
        M[`${A.forw[0]}:${A.forw[1]}`] = A;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const F = Pn(f.bakw);
    if (!F) throw "TOO LINEAR2";
    const g = F.geometry.coordinates[0];
    try {
      C = g.map((A) => ({
        bakw: A,
        forw: Ut.transformArr(Ht(A), u)
      })), C.forEach((A) => {
        M[`${A.forw[0]}:${A.forw[1]}`] = A;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    let w;
    if (s) {
      const A = p.geometry.coordinates, R = h.features.find(
        (j) => on(
          Ht(A),
          j
        )
      );
      if (R) {
        const j = R.geometry.coordinates[0], d = R.properties.a.geom, _ = R.properties.b.geom, x = R.properties.c.geom;
        w = {
          forw: [
            (j[0][0] + j[1][0] + j[2][0]) / 3,
            (j[0][1] + j[1][1] + j[2][1]) / 3
          ],
          bakw: [
            (d[0] + _[0] + x[0]) / 3,
            (d[1] + _[1] + x[1]) / 3
          ]
        };
      } else
        w = {
          forw: A,
          bakw: Ut.transformArr(p, h)
        };
    } else
      w = {
        forw: p.geometry.coordinates,
        bakw: Ut.transformArr(p, h)
      };
    const l = je(w.forw, w.bakw, "c");
    this.centroid = {
      forw: l,
      bakw: qe(l)
    };
    const y = [
      ...this.points.map((A) => ({ forw: A[0], bakw: A[1] })),
      ...(this.edgeNodes ?? []).map((A) => ({ forw: A[0], bakw: A[1] }))
    ], m = {
      convexBuf: M,
      centroid: w,
      allGcps: y,
      minx: r,
      maxx: o,
      miny: a,
      maxy: c
    }, I = this.vertexMode === Bt.VERTEX_BIRDEYE ? hi(m, s) : fi(m, s), B = {
      forw: [],
      bakw: []
    };
    for (let A = 0; A < I.length; A++) {
      const R = I[A].forw, j = I[A].bakw, d = je(R, j, `b${A}`), _ = qe(d);
      i.forw.push(d), i.bakw.push(_), B.forw.push(d), B.bakw.push(_);
    }
    this.pointsSet = {
      forw: Vt(i.forw),
      bakw: Vt(i.bakw),
      edges: i.edges
    }, this.tins = {
      forw: Ut.rotateVerticesTriangle(
        Le(
          this.pointsSet.forw,
          i.edges,
          "target"
        )
      )
    }, (t === Bt.MODE_STRICT || t === Bt.MODE_AUTO) && this.calcurateStrictTin(), (t === Bt.MODE_LOOSE || t === Bt.MODE_AUTO && this.strict_status === Bt.STATUS_ERROR) && (this.tins.bakw = Ut.rotateVerticesTriangle(
      Le(
        this.pointsSet.bakw,
        i.edges,
        "target"
      )
    ), delete this.kinks, this.strict_status = Bt.STATUS_LOOSE), this.vertices_params = {
      forw: Vn(B.forw, this.centroid.forw),
      bakw: Vn(B.bakw, this.centroid.bakw)
    }, this.addIndexedTin();
    const E = ["forw"];
    this.strict_status === Bt.STATUS_LOOSE && E.push("bakw");
    const X = this.strict_status === Bt.STATUS_STRICT;
    this.pointsWeightBuffer = Li({
      tins: this.tins,
      targets: E,
      includeReciprocals: X,
      numBoundaryVertices: I.length
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
const Ki = Ut.format_version;
export {
  Bt as Tin,
  Le as constrainedTin,
  qe as counterPoint,
  je as createPoint,
  Bt as default,
  wi as findIntersections,
  Ki as format_version,
  er as insertSearchIndex,
  Vn as vertexCalc
};
