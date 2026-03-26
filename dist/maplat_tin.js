var rr = Object.defineProperty;
var ir = (o, e, t) => e in o ? rr(o, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : o[e] = t;
var vt = (o, e, t) => ir(o, typeof e != "symbol" ? e + "" : e, t);
function Ie(o, e, t = {}) {
  const r = { type: "Feature" };
  return (t.id === 0 || t.id) && (r.id = t.id), t.bbox && (r.bbox = t.bbox), r.properties = e || {}, r.geometry = o, r;
}
function le(o, e, t = {}) {
  if (!o)
    throw new Error("coordinates is required");
  if (!Array.isArray(o))
    throw new Error("coordinates must be an Array");
  if (o.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!gn(o[0]) || !gn(o[1]))
    throw new Error("coordinates must contain numbers");
  return Ie({
    type: "Point",
    coordinates: o
  }, e, t);
}
function Be(o, e, t = {}) {
  for (const i of o) {
    if (i.length < 4)
      throw new Error(
        "Each LinearRing of a Polygon must have 4 or more Positions."
      );
    if (i[i.length - 1].length !== i[0].length)
      throw new Error("First and last Position are not equivalent.");
    for (let n = 0; n < i[i.length - 1].length; n++)
      if (i[i.length - 1][n] !== i[0][n])
        throw new Error("First and last Position are not equivalent.");
  }
  return Ie({
    type: "Polygon",
    coordinates: o
  }, e, t);
}
function mn(o, e, t = {}) {
  if (o.length < 2)
    throw new Error("coordinates must be an array of two or more positions");
  return Ie({
    type: "LineString",
    coordinates: o
  }, e, t);
}
function Qt(o, e = {}) {
  const t = { type: "FeatureCollection" };
  return e.id && (t.id = e.id), e.bbox && (t.bbox = e.bbox), t.features = o, t;
}
function gn(o) {
  return !isNaN(o) && o !== null && !Array.isArray(o);
}
function or(o) {
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
function sr(o) {
  return o.type === "Feature" ? o.geometry : o;
}
function ln(o, e, t) {
  if (o !== null)
    for (var r, i, n, s, a, c, f, h = 0, l = 0, d, v = o.type, M = v === "FeatureCollection", S = v === "Feature", C = M ? o.features.length : 1, F = 0; F < C; F++) {
      f = M ? o.features[F].geometry : S ? o.geometry : o, d = f ? f.type === "GeometryCollection" : !1, a = d ? f.geometries.length : 1;
      for (var m = 0; m < a; m++) {
        var w = 0, u = 0;
        if (s = d ? f.geometries[m] : f, s !== null) {
          c = s.coordinates;
          var y = s.type;
          switch (h = t && (y === "Polygon" || y === "MultiPolygon") ? 1 : 0, y) {
            case null:
              break;
            case "Point":
              if (e(
                c,
                l,
                F,
                w,
                u
              ) === !1)
                return !1;
              l++, w++;
              break;
            case "LineString":
            case "MultiPoint":
              for (r = 0; r < c.length; r++) {
                if (e(
                  c[r],
                  l,
                  F,
                  w,
                  u
                ) === !1)
                  return !1;
                l++, y === "MultiPoint" && w++;
              }
              y === "LineString" && w++;
              break;
            case "Polygon":
            case "MultiLineString":
              for (r = 0; r < c.length; r++) {
                for (i = 0; i < c[r].length - h; i++) {
                  if (e(
                    c[r][i],
                    l,
                    F,
                    w,
                    u
                  ) === !1)
                    return !1;
                  l++;
                }
                y === "MultiLineString" && w++, y === "Polygon" && u++;
              }
              y === "Polygon" && w++;
              break;
            case "MultiPolygon":
              for (r = 0; r < c.length; r++) {
                for (u = 0, i = 0; i < c[r].length; i++) {
                  for (n = 0; n < c[r][i].length - h; n++) {
                    if (e(
                      c[r][i][n],
                      l,
                      F,
                      w,
                      u
                    ) === !1)
                      return !1;
                    l++;
                  }
                  u++;
                }
                w++;
              }
              break;
            case "GeometryCollection":
              for (r = 0; r < s.geometries.length; r++)
                if (ln(s.geometries[r], e, t) === !1)
                  return !1;
              break;
            default:
              throw new Error("Unknown Geometry Type");
          }
        }
      }
    }
}
const Ft = 11102230246251565e-32, rt = 134217729, Vn = (3 + 8 * Ft) * Ft;
function Dt(o, e, t, r, i) {
  let n, s, a, c, f = e[0], h = r[0], l = 0, d = 0;
  h > f == h > -f ? (n = f, f = e[++l]) : (n = h, h = r[++d]);
  let v = 0;
  if (l < o && d < t)
    for (h > f == h > -f ? (s = f + n, a = n - (s - f), f = e[++l]) : (s = h + n, a = n - (s - h), h = r[++d]), n = s, a !== 0 && (i[v++] = a); l < o && d < t; )
      h > f == h > -f ? (s = n + f, c = s - n, a = n - (s - c) + (f - c), f = e[++l]) : (s = n + h, c = s - n, a = n - (s - c) + (h - c), h = r[++d]), n = s, a !== 0 && (i[v++] = a);
  for (; l < o; )
    s = n + f, c = s - n, a = n - (s - c) + (f - c), f = e[++l], n = s, a !== 0 && (i[v++] = a);
  for (; d < t; )
    s = n + h, c = s - n, a = n - (s - c) + (h - c), h = r[++d], n = s, a !== 0 && (i[v++] = a);
  return (n !== 0 || v === 0) && (i[v++] = n), v;
}
function zt(o, e, t, r, i, n, s, a) {
  return Dt(Dt(o, e, t, r, s), s, i, n, a);
}
function V(o, e, t, r) {
  let i, n, s, a, c, f, h, l, d, v, M;
  h = rt * t, v = h - (h - t), M = t - v;
  let S = e[0];
  i = S * t, h = rt * S, l = h - (h - S), d = S - l, s = d * M - (i - l * v - d * v - l * M);
  let C = 0;
  s !== 0 && (r[C++] = s);
  for (let F = 1; F < o; F++)
    S = e[F], a = S * t, h = rt * S, l = h - (h - S), d = S - l, c = d * M - (a - l * v - d * v - l * M), n = i + c, f = n - i, s = i - (n - f) + (c - f), s !== 0 && (r[C++] = s), i = a + n, s = n - (i - a), s !== 0 && (r[C++] = s);
  return (i !== 0 || C === 0) && (r[C++] = i), C;
}
function Un(o, e) {
  let t = e[0];
  for (let r = 1; r < o; r++) t += e[r];
  return t;
}
function bt(o) {
  return new Float64Array(o);
}
const ar = (3 + 16 * Ft) * Ft, cr = (2 + 12 * Ft) * Ft, fr = (9 + 64 * Ft) * Ft * Ft, ye = bt(4), wn = bt(8), yn = bt(12), vn = bt(16), Yt = bt(4);
function hr(o, e, t, r, i, n, s) {
  let a, c, f, h, l, d, v, M, S, C, F, m, w, u, y, g, I, B;
  const E = o - i, X = t - i, A = e - n, D = r - n;
  u = E * D, d = rt * E, v = d - (d - E), M = E - v, d = rt * D, S = d - (d - D), C = D - S, y = M * C - (u - v * S - M * S - v * C), g = A * X, d = rt * A, v = d - (d - A), M = A - v, d = rt * X, S = d - (d - X), C = X - S, I = M * C - (g - v * S - M * S - v * C), F = y - I, l = y - F, ye[0] = y - (F + l) + (l - I), m = u + F, l = m - u, w = u - (m - l) + (F - l), F = w - g, l = w - F, ye[1] = w - (F + l) + (l - g), B = m + F, l = B - m, ye[2] = m - (B - l) + (F - l), ye[3] = B;
  let q = Un(4, ye), p = cr * s;
  if (q >= p || -q >= p || (l = o - E, a = o - (E + l) + (l - i), l = t - X, f = t - (X + l) + (l - i), l = e - A, c = e - (A + l) + (l - n), l = r - D, h = r - (D + l) + (l - n), a === 0 && c === 0 && f === 0 && h === 0) || (p = fr * s + Vn * Math.abs(q), q += E * h + D * a - (A * f + X * c), q >= p || -q >= p)) return q;
  u = a * D, d = rt * a, v = d - (d - a), M = a - v, d = rt * D, S = d - (d - D), C = D - S, y = M * C - (u - v * S - M * S - v * C), g = c * X, d = rt * c, v = d - (d - c), M = c - v, d = rt * X, S = d - (d - X), C = X - S, I = M * C - (g - v * S - M * S - v * C), F = y - I, l = y - F, Yt[0] = y - (F + l) + (l - I), m = u + F, l = m - u, w = u - (m - l) + (F - l), F = w - g, l = w - F, Yt[1] = w - (F + l) + (l - g), B = m + F, l = B - m, Yt[2] = m - (B - l) + (F - l), Yt[3] = B;
  const _ = Dt(4, ye, 4, Yt, wn);
  u = E * h, d = rt * E, v = d - (d - E), M = E - v, d = rt * h, S = d - (d - h), C = h - S, y = M * C - (u - v * S - M * S - v * C), g = A * f, d = rt * A, v = d - (d - A), M = A - v, d = rt * f, S = d - (d - f), C = f - S, I = M * C - (g - v * S - M * S - v * C), F = y - I, l = y - F, Yt[0] = y - (F + l) + (l - I), m = u + F, l = m - u, w = u - (m - l) + (F - l), F = w - g, l = w - F, Yt[1] = w - (F + l) + (l - g), B = m + F, l = B - m, Yt[2] = m - (B - l) + (F - l), Yt[3] = B;
  const x = Dt(_, wn, 4, Yt, yn);
  u = a * h, d = rt * a, v = d - (d - a), M = a - v, d = rt * h, S = d - (d - h), C = h - S, y = M * C - (u - v * S - M * S - v * C), g = c * f, d = rt * c, v = d - (d - c), M = c - v, d = rt * f, S = d - (d - f), C = f - S, I = M * C - (g - v * S - M * S - v * C), F = y - I, l = y - F, Yt[0] = y - (F + l) + (l - I), m = u + F, l = m - u, w = u - (m - l) + (F - l), F = w - g, l = w - F, Yt[1] = w - (F + l) + (l - g), B = m + F, l = B - m, Yt[2] = m - (B - l) + (F - l), Yt[3] = B;
  const T = Dt(x, yn, 4, Yt, vn);
  return vn[T - 1];
}
function re(o, e, t, r, i, n) {
  const s = (e - n) * (t - i), a = (o - i) * (r - n), c = s - a, f = Math.abs(s + a);
  return Math.abs(c) >= ar * f ? c : -hr(o, e, t, r, i, n, f);
}
const lr = (10 + 96 * Ft) * Ft, ur = (4 + 48 * Ft) * Ft, pr = (44 + 576 * Ft) * Ft * Ft, se = bt(4), ae = bt(4), ce = bt(4), Zt = bt(4), te = bt(4), ee = bt(4), Lt = bt(4), $t = bt(4), He = bt(8), Ze = bt(8), tn = bt(8), en = bt(8), nn = bt(8), rn = bt(8), Te = bt(8), Ne = bt(8), Xe = bt(8), de = bt(4), me = bt(4), ge = bt(4), st = bt(8), pt = bt(16), Et = bt(16), At = bt(16), xt = bt(32), fe = bt(32), Ot = bt(48), qt = bt(64);
let be = bt(1152), on = bt(1152);
function Tt(o, e, t) {
  o = Dt(o, be, e, t, on);
  const r = be;
  return be = on, on = r, o;
}
function dr(o, e, t, r, i, n, s, a, c) {
  let f, h, l, d, v, M, S, C, F, m, w, u, y, g, I, B, E, X, A, D, q, p, _, x, T, P, R, b, O, L, j, U, z, Q, W;
  const ft = o - s, ct = t - s, lt = i - s, dt = e - a, gt = r - a, mt = n - a;
  j = ct * mt, _ = rt * ct, x = _ - (_ - ct), T = ct - x, _ = rt * mt, P = _ - (_ - mt), R = mt - P, U = T * R - (j - x * P - T * P - x * R), z = lt * gt, _ = rt * lt, x = _ - (_ - lt), T = lt - x, _ = rt * gt, P = _ - (_ - gt), R = gt - P, Q = T * R - (z - x * P - T * P - x * R), b = U - Q, p = U - b, se[0] = U - (b + p) + (p - Q), O = j + b, p = O - j, L = j - (O - p) + (b - p), b = L - z, p = L - b, se[1] = L - (b + p) + (p - z), W = O + b, p = W - O, se[2] = O - (W - p) + (b - p), se[3] = W, j = lt * dt, _ = rt * lt, x = _ - (_ - lt), T = lt - x, _ = rt * dt, P = _ - (_ - dt), R = dt - P, U = T * R - (j - x * P - T * P - x * R), z = ft * mt, _ = rt * ft, x = _ - (_ - ft), T = ft - x, _ = rt * mt, P = _ - (_ - mt), R = mt - P, Q = T * R - (z - x * P - T * P - x * R), b = U - Q, p = U - b, ae[0] = U - (b + p) + (p - Q), O = j + b, p = O - j, L = j - (O - p) + (b - p), b = L - z, p = L - b, ae[1] = L - (b + p) + (p - z), W = O + b, p = W - O, ae[2] = O - (W - p) + (b - p), ae[3] = W, j = ft * gt, _ = rt * ft, x = _ - (_ - ft), T = ft - x, _ = rt * gt, P = _ - (_ - gt), R = gt - P, U = T * R - (j - x * P - T * P - x * R), z = ct * dt, _ = rt * ct, x = _ - (_ - ct), T = ct - x, _ = rt * dt, P = _ - (_ - dt), R = dt - P, Q = T * R - (z - x * P - T * P - x * R), b = U - Q, p = U - b, ce[0] = U - (b + p) + (p - Q), O = j + b, p = O - j, L = j - (O - p) + (b - p), b = L - z, p = L - b, ce[1] = L - (b + p) + (p - z), W = O + b, p = W - O, ce[2] = O - (W - p) + (b - p), ce[3] = W, f = Dt(
    Dt(
      Dt(
        V(V(4, se, ft, st), st, ft, pt),
        pt,
        V(V(4, se, dt, st), st, dt, Et),
        Et,
        xt
      ),
      xt,
      Dt(
        V(V(4, ae, ct, st), st, ct, pt),
        pt,
        V(V(4, ae, gt, st), st, gt, Et),
        Et,
        fe
      ),
      fe,
      qt
    ),
    qt,
    Dt(
      V(V(4, ce, lt, st), st, lt, pt),
      pt,
      V(V(4, ce, mt, st), st, mt, Et),
      Et,
      xt
    ),
    xt,
    be
  );
  let Pt = Un(f, be), Xt = ur * c;
  if (Pt >= Xt || -Pt >= Xt || (p = o - ft, h = o - (ft + p) + (p - s), p = e - dt, v = e - (dt + p) + (p - a), p = t - ct, l = t - (ct + p) + (p - s), p = r - gt, M = r - (gt + p) + (p - a), p = i - lt, d = i - (lt + p) + (p - s), p = n - mt, S = n - (mt + p) + (p - a), h === 0 && l === 0 && d === 0 && v === 0 && M === 0 && S === 0) || (Xt = pr * c + Vn * Math.abs(Pt), Pt += (ft * ft + dt * dt) * (ct * S + mt * l - (gt * d + lt * M)) + 2 * (ft * h + dt * v) * (ct * mt - gt * lt) + ((ct * ct + gt * gt) * (lt * v + dt * d - (mt * h + ft * S)) + 2 * (ct * l + gt * M) * (lt * dt - mt * ft)) + ((lt * lt + mt * mt) * (ft * M + gt * h - (dt * l + ct * v)) + 2 * (lt * d + mt * S) * (ft * gt - dt * ct)), Pt >= Xt || -Pt >= Xt))
    return Pt;
  if ((l !== 0 || M !== 0 || d !== 0 || S !== 0) && (j = ft * ft, _ = rt * ft, x = _ - (_ - ft), T = ft - x, U = T * T - (j - x * x - (x + x) * T), z = dt * dt, _ = rt * dt, x = _ - (_ - dt), T = dt - x, Q = T * T - (z - x * x - (x + x) * T), b = U + Q, p = b - U, Zt[0] = U - (b - p) + (Q - p), O = j + b, p = O - j, L = j - (O - p) + (b - p), b = L + z, p = b - L, Zt[1] = L - (b - p) + (z - p), W = O + b, p = W - O, Zt[2] = O - (W - p) + (b - p), Zt[3] = W), (d !== 0 || S !== 0 || h !== 0 || v !== 0) && (j = ct * ct, _ = rt * ct, x = _ - (_ - ct), T = ct - x, U = T * T - (j - x * x - (x + x) * T), z = gt * gt, _ = rt * gt, x = _ - (_ - gt), T = gt - x, Q = T * T - (z - x * x - (x + x) * T), b = U + Q, p = b - U, te[0] = U - (b - p) + (Q - p), O = j + b, p = O - j, L = j - (O - p) + (b - p), b = L + z, p = b - L, te[1] = L - (b - p) + (z - p), W = O + b, p = W - O, te[2] = O - (W - p) + (b - p), te[3] = W), (h !== 0 || v !== 0 || l !== 0 || M !== 0) && (j = lt * lt, _ = rt * lt, x = _ - (_ - lt), T = lt - x, U = T * T - (j - x * x - (x + x) * T), z = mt * mt, _ = rt * mt, x = _ - (_ - mt), T = mt - x, Q = T * T - (z - x * x - (x + x) * T), b = U + Q, p = b - U, ee[0] = U - (b - p) + (Q - p), O = j + b, p = O - j, L = j - (O - p) + (b - p), b = L + z, p = b - L, ee[1] = L - (b - p) + (z - p), W = O + b, p = W - O, ee[2] = O - (W - p) + (b - p), ee[3] = W), h !== 0 && (C = V(4, se, h, He), f = Tt(f, zt(
    V(C, He, 2 * ft, pt),
    pt,
    V(V(4, ee, h, st), st, gt, Et),
    Et,
    V(V(4, te, h, st), st, -mt, At),
    At,
    xt,
    Ot
  ), Ot)), v !== 0 && (F = V(4, se, v, Ze), f = Tt(f, zt(
    V(F, Ze, 2 * dt, pt),
    pt,
    V(V(4, te, v, st), st, lt, Et),
    Et,
    V(V(4, ee, v, st), st, -ct, At),
    At,
    xt,
    Ot
  ), Ot)), l !== 0 && (m = V(4, ae, l, tn), f = Tt(f, zt(
    V(m, tn, 2 * ct, pt),
    pt,
    V(V(4, Zt, l, st), st, mt, Et),
    Et,
    V(V(4, ee, l, st), st, -dt, At),
    At,
    xt,
    Ot
  ), Ot)), M !== 0 && (w = V(4, ae, M, en), f = Tt(f, zt(
    V(w, en, 2 * gt, pt),
    pt,
    V(V(4, ee, M, st), st, ft, Et),
    Et,
    V(V(4, Zt, M, st), st, -lt, At),
    At,
    xt,
    Ot
  ), Ot)), d !== 0 && (u = V(4, ce, d, nn), f = Tt(f, zt(
    V(u, nn, 2 * lt, pt),
    pt,
    V(V(4, te, d, st), st, dt, Et),
    Et,
    V(V(4, Zt, d, st), st, -gt, At),
    At,
    xt,
    Ot
  ), Ot)), S !== 0 && (y = V(4, ce, S, rn), f = Tt(f, zt(
    V(y, rn, 2 * mt, pt),
    pt,
    V(V(4, Zt, S, st), st, ct, Et),
    Et,
    V(V(4, te, S, st), st, -ft, At),
    At,
    xt,
    Ot
  ), Ot)), h !== 0 || v !== 0) {
    if (l !== 0 || M !== 0 || d !== 0 || S !== 0 ? (j = l * mt, _ = rt * l, x = _ - (_ - l), T = l - x, _ = rt * mt, P = _ - (_ - mt), R = mt - P, U = T * R - (j - x * P - T * P - x * R), z = ct * S, _ = rt * ct, x = _ - (_ - ct), T = ct - x, _ = rt * S, P = _ - (_ - S), R = S - P, Q = T * R - (z - x * P - T * P - x * R), b = U + Q, p = b - U, Lt[0] = U - (b - p) + (Q - p), O = j + b, p = O - j, L = j - (O - p) + (b - p), b = L + z, p = b - L, Lt[1] = L - (b - p) + (z - p), W = O + b, p = W - O, Lt[2] = O - (W - p) + (b - p), Lt[3] = W, j = d * -gt, _ = rt * d, x = _ - (_ - d), T = d - x, _ = rt * -gt, P = _ - (_ - -gt), R = -gt - P, U = T * R - (j - x * P - T * P - x * R), z = lt * -M, _ = rt * lt, x = _ - (_ - lt), T = lt - x, _ = rt * -M, P = _ - (_ - -M), R = -M - P, Q = T * R - (z - x * P - T * P - x * R), b = U + Q, p = b - U, $t[0] = U - (b - p) + (Q - p), O = j + b, p = O - j, L = j - (O - p) + (b - p), b = L + z, p = b - L, $t[1] = L - (b - p) + (z - p), W = O + b, p = W - O, $t[2] = O - (W - p) + (b - p), $t[3] = W, I = Dt(4, Lt, 4, $t, Ne), j = l * S, _ = rt * l, x = _ - (_ - l), T = l - x, _ = rt * S, P = _ - (_ - S), R = S - P, U = T * R - (j - x * P - T * P - x * R), z = d * M, _ = rt * d, x = _ - (_ - d), T = d - x, _ = rt * M, P = _ - (_ - M), R = M - P, Q = T * R - (z - x * P - T * P - x * R), b = U - Q, p = U - b, me[0] = U - (b + p) + (p - Q), O = j + b, p = O - j, L = j - (O - p) + (b - p), b = L - z, p = L - b, me[1] = L - (b + p) + (p - z), W = O + b, p = W - O, me[2] = O - (W - p) + (b - p), me[3] = W, X = 4) : (Ne[0] = 0, I = 1, me[0] = 0, X = 1), h !== 0) {
      const St = V(I, Ne, h, At);
      f = Tt(f, Dt(
        V(C, He, h, pt),
        pt,
        V(St, At, 2 * ft, xt),
        xt,
        Ot
      ), Ot);
      const Mt = V(X, me, h, st);
      f = Tt(f, zt(
        V(Mt, st, 2 * ft, pt),
        pt,
        V(Mt, st, h, Et),
        Et,
        V(St, At, h, xt),
        xt,
        fe,
        qt
      ), qt), M !== 0 && (f = Tt(f, V(V(4, ee, h, st), st, M, pt), pt)), S !== 0 && (f = Tt(f, V(V(4, te, -h, st), st, S, pt), pt));
    }
    if (v !== 0) {
      const St = V(I, Ne, v, At);
      f = Tt(f, Dt(
        V(F, Ze, v, pt),
        pt,
        V(St, At, 2 * dt, xt),
        xt,
        Ot
      ), Ot);
      const Mt = V(X, me, v, st);
      f = Tt(f, zt(
        V(Mt, st, 2 * dt, pt),
        pt,
        V(Mt, st, v, Et),
        Et,
        V(St, At, v, xt),
        xt,
        fe,
        qt
      ), qt);
    }
  }
  if (l !== 0 || M !== 0) {
    if (d !== 0 || S !== 0 || h !== 0 || v !== 0 ? (j = d * dt, _ = rt * d, x = _ - (_ - d), T = d - x, _ = rt * dt, P = _ - (_ - dt), R = dt - P, U = T * R - (j - x * P - T * P - x * R), z = lt * v, _ = rt * lt, x = _ - (_ - lt), T = lt - x, _ = rt * v, P = _ - (_ - v), R = v - P, Q = T * R - (z - x * P - T * P - x * R), b = U + Q, p = b - U, Lt[0] = U - (b - p) + (Q - p), O = j + b, p = O - j, L = j - (O - p) + (b - p), b = L + z, p = b - L, Lt[1] = L - (b - p) + (z - p), W = O + b, p = W - O, Lt[2] = O - (W - p) + (b - p), Lt[3] = W, D = -mt, q = -S, j = h * D, _ = rt * h, x = _ - (_ - h), T = h - x, _ = rt * D, P = _ - (_ - D), R = D - P, U = T * R - (j - x * P - T * P - x * R), z = ft * q, _ = rt * ft, x = _ - (_ - ft), T = ft - x, _ = rt * q, P = _ - (_ - q), R = q - P, Q = T * R - (z - x * P - T * P - x * R), b = U + Q, p = b - U, $t[0] = U - (b - p) + (Q - p), O = j + b, p = O - j, L = j - (O - p) + (b - p), b = L + z, p = b - L, $t[1] = L - (b - p) + (z - p), W = O + b, p = W - O, $t[2] = O - (W - p) + (b - p), $t[3] = W, B = Dt(4, Lt, 4, $t, Xe), j = d * v, _ = rt * d, x = _ - (_ - d), T = d - x, _ = rt * v, P = _ - (_ - v), R = v - P, U = T * R - (j - x * P - T * P - x * R), z = h * S, _ = rt * h, x = _ - (_ - h), T = h - x, _ = rt * S, P = _ - (_ - S), R = S - P, Q = T * R - (z - x * P - T * P - x * R), b = U - Q, p = U - b, ge[0] = U - (b + p) + (p - Q), O = j + b, p = O - j, L = j - (O - p) + (b - p), b = L - z, p = L - b, ge[1] = L - (b + p) + (p - z), W = O + b, p = W - O, ge[2] = O - (W - p) + (b - p), ge[3] = W, A = 4) : (Xe[0] = 0, B = 1, ge[0] = 0, A = 1), l !== 0) {
      const St = V(B, Xe, l, At);
      f = Tt(f, Dt(
        V(m, tn, l, pt),
        pt,
        V(St, At, 2 * ct, xt),
        xt,
        Ot
      ), Ot);
      const Mt = V(A, ge, l, st);
      f = Tt(f, zt(
        V(Mt, st, 2 * ct, pt),
        pt,
        V(Mt, st, l, Et),
        Et,
        V(St, At, l, xt),
        xt,
        fe,
        qt
      ), qt), S !== 0 && (f = Tt(f, V(V(4, Zt, l, st), st, S, pt), pt)), v !== 0 && (f = Tt(f, V(V(4, ee, -l, st), st, v, pt), pt));
    }
    if (M !== 0) {
      const St = V(B, Xe, M, At);
      f = Tt(f, Dt(
        V(w, en, M, pt),
        pt,
        V(St, At, 2 * gt, xt),
        xt,
        Ot
      ), Ot);
      const Mt = V(A, ge, M, st);
      f = Tt(f, zt(
        V(Mt, st, 2 * gt, pt),
        pt,
        V(Mt, st, M, Et),
        Et,
        V(St, At, M, xt),
        xt,
        fe,
        qt
      ), qt);
    }
  }
  if (d !== 0 || S !== 0) {
    if (h !== 0 || v !== 0 || l !== 0 || M !== 0 ? (j = h * gt, _ = rt * h, x = _ - (_ - h), T = h - x, _ = rt * gt, P = _ - (_ - gt), R = gt - P, U = T * R - (j - x * P - T * P - x * R), z = ft * M, _ = rt * ft, x = _ - (_ - ft), T = ft - x, _ = rt * M, P = _ - (_ - M), R = M - P, Q = T * R - (z - x * P - T * P - x * R), b = U + Q, p = b - U, Lt[0] = U - (b - p) + (Q - p), O = j + b, p = O - j, L = j - (O - p) + (b - p), b = L + z, p = b - L, Lt[1] = L - (b - p) + (z - p), W = O + b, p = W - O, Lt[2] = O - (W - p) + (b - p), Lt[3] = W, D = -dt, q = -v, j = l * D, _ = rt * l, x = _ - (_ - l), T = l - x, _ = rt * D, P = _ - (_ - D), R = D - P, U = T * R - (j - x * P - T * P - x * R), z = ct * q, _ = rt * ct, x = _ - (_ - ct), T = ct - x, _ = rt * q, P = _ - (_ - q), R = q - P, Q = T * R - (z - x * P - T * P - x * R), b = U + Q, p = b - U, $t[0] = U - (b - p) + (Q - p), O = j + b, p = O - j, L = j - (O - p) + (b - p), b = L + z, p = b - L, $t[1] = L - (b - p) + (z - p), W = O + b, p = W - O, $t[2] = O - (W - p) + (b - p), $t[3] = W, g = Dt(4, Lt, 4, $t, Te), j = h * M, _ = rt * h, x = _ - (_ - h), T = h - x, _ = rt * M, P = _ - (_ - M), R = M - P, U = T * R - (j - x * P - T * P - x * R), z = l * v, _ = rt * l, x = _ - (_ - l), T = l - x, _ = rt * v, P = _ - (_ - v), R = v - P, Q = T * R - (z - x * P - T * P - x * R), b = U - Q, p = U - b, de[0] = U - (b + p) + (p - Q), O = j + b, p = O - j, L = j - (O - p) + (b - p), b = L - z, p = L - b, de[1] = L - (b + p) + (p - z), W = O + b, p = W - O, de[2] = O - (W - p) + (b - p), de[3] = W, E = 4) : (Te[0] = 0, g = 1, de[0] = 0, E = 1), d !== 0) {
      const St = V(g, Te, d, At);
      f = Tt(f, Dt(
        V(u, nn, d, pt),
        pt,
        V(St, At, 2 * lt, xt),
        xt,
        Ot
      ), Ot);
      const Mt = V(E, de, d, st);
      f = Tt(f, zt(
        V(Mt, st, 2 * lt, pt),
        pt,
        V(Mt, st, d, Et),
        Et,
        V(St, At, d, xt),
        xt,
        fe,
        qt
      ), qt), v !== 0 && (f = Tt(f, V(V(4, te, d, st), st, v, pt), pt)), M !== 0 && (f = Tt(f, V(V(4, Zt, -d, st), st, M, pt), pt));
    }
    if (S !== 0) {
      const St = V(g, Te, S, At);
      f = Tt(f, Dt(
        V(y, rn, S, pt),
        pt,
        V(St, At, 2 * mt, xt),
        xt,
        Ot
      ), Ot);
      const Mt = V(E, de, S, st);
      f = Tt(f, zt(
        V(Mt, st, 2 * mt, pt),
        pt,
        V(Mt, st, S, Et),
        Et,
        V(St, At, S, xt),
        xt,
        fe,
        qt
      ), qt);
    }
  }
  return be[f - 1];
}
function mr(o, e, t, r, i, n, s, a) {
  const c = o - s, f = t - s, h = i - s, l = e - a, d = r - a, v = n - a, M = f * v, S = h * d, C = c * c + l * l, F = h * l, m = c * v, w = f * f + d * d, u = c * d, y = f * l, g = h * h + v * v, I = C * (M - S) + w * (F - m) + g * (u - y), B = (Math.abs(M) + Math.abs(S)) * C + (Math.abs(F) + Math.abs(m)) * w + (Math.abs(u) + Math.abs(y)) * g, E = lr * B;
  return I > E || -I > E ? I : dr(o, e, t, r, i, n, s, a, B);
}
function gr(o, e) {
  var t, r, i = 0, n, s, a, c, f, h, l, d = o[0], v = o[1], M = e.length;
  for (t = 0; t < M; t++) {
    r = 0;
    var S = e[t], C = S.length - 1;
    if (h = S[0], h[0] !== S[C][0] && h[1] !== S[C][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (s = h[0] - d, a = h[1] - v, r; r < C; r++) {
      if (l = S[r + 1], c = l[0] - d, f = l[1] - v, a === 0 && f === 0) {
        if (c <= 0 && s >= 0 || s <= 0 && c >= 0)
          return 0;
      } else if (f >= 0 && a <= 0 || f <= 0 && a >= 0) {
        if (n = re(s, c, a, f, 0, 0), n === 0)
          return 0;
        (n > 0 && f > 0 && a <= 0 || n < 0 && f <= 0 && a > 0) && i++;
      }
      h = l, a = f, s = c;
    }
  }
  return i % 2 !== 0;
}
function sn(o, e, t = {}) {
  if (!o)
    throw new Error("point is required");
  if (!e)
    throw new Error("polygon is required");
  const r = or(o), i = sr(e), n = i.type, s = e.bbox;
  let a = i.coordinates;
  if (s && wr(r, s) === !1)
    return !1;
  n === "Polygon" && (a = [a]);
  let c = !1;
  for (var f = 0; f < a.length; ++f) {
    const h = gr(r, a[f]);
    if (h === 0) return !t.ignoreBoundary;
    h && (c = !0);
  }
  return c;
}
function wr(o, e) {
  return e[0] <= o[0] && e[1] <= o[1] && e[2] >= o[0] && e[3] >= o[1];
}
let zn = class {
  constructor(e = [], t = yr) {
    if (this.data = e, this.length = this.data.length, this.compare = t, this.length > 0)
      for (let r = (this.length >> 1) - 1; r >= 0; r--) this._down(r);
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
    const { data: t, compare: r } = this, i = t[e];
    for (; e > 0; ) {
      const n = e - 1 >> 1, s = t[n];
      if (r(i, s) >= 0) break;
      t[e] = s, e = n;
    }
    t[e] = i;
  }
  _down(e) {
    const { data: t, compare: r } = this, i = this.length >> 1, n = t[e];
    for (; e < i; ) {
      let s = (e << 1) + 1, a = t[s];
      const c = s + 1;
      if (c < this.length && r(t[c], a) < 0 && (s = c, a = t[c]), r(a, n) >= 0) break;
      t[e] = a, e = s;
    }
    t[e] = n;
  }
};
function yr(o, e) {
  return o < e ? -1 : o > e ? 1 : 0;
}
function Wn(o, e) {
  return o.p.x > e.p.x ? 1 : o.p.x < e.p.x ? -1 : o.p.y !== e.p.y ? o.p.y > e.p.y ? 1 : -1 : 1;
}
function vr(o, e) {
  return o.rightSweepEvent.p.x > e.rightSweepEvent.p.x ? 1 : o.rightSweepEvent.p.x < e.rightSweepEvent.p.x ? -1 : o.rightSweepEvent.p.y !== e.rightSweepEvent.p.y ? o.rightSweepEvent.p.y < e.rightSweepEvent.p.y ? 1 : -1 : 1;
}
class bn {
  constructor(e, t, r, i) {
    this.p = {
      x: e[0],
      y: e[1]
    }, this.featureId = t, this.ringId = r, this.eventId = i, this.otherEvent = null, this.isLeftEndpoint = null;
  }
  isSamePoint(e) {
    return this.p.x === e.p.x && this.p.y === e.p.y;
  }
}
function br(o, e) {
  if (o.type === "FeatureCollection") {
    const t = o.features;
    for (let r = 0; r < t.length; r++)
      xn(t[r], e);
  } else
    xn(o, e);
}
let Ce = 0, De = 0, Re = 0;
function xn(o, e) {
  const t = o.type === "Feature" ? o.geometry : o;
  let r = t.coordinates;
  (t.type === "Polygon" || t.type === "MultiLineString") && (r = [r]), t.type === "LineString" && (r = [[r]]);
  for (let i = 0; i < r.length; i++)
    for (let n = 0; n < r[i].length; n++) {
      let s = r[i][n][0], a = null;
      De = De + 1;
      for (let c = 0; c < r[i][n].length - 1; c++) {
        a = r[i][n][c + 1];
        const f = new bn(s, Ce, De, Re), h = new bn(a, Ce, De, Re + 1);
        f.otherEvent = h, h.otherEvent = f, Wn(f, h) > 0 ? (h.isLeftEndpoint = !0, f.isLeftEndpoint = !1) : (f.isLeftEndpoint = !0, h.isLeftEndpoint = !1), e.push(f), e.push(h), s = a, Re = Re + 1;
      }
    }
  Ce = Ce + 1;
}
class xr {
  constructor(e) {
    this.leftSweepEvent = e, this.rightSweepEvent = e.otherEvent;
  }
}
function _r(o, e) {
  if (o === null || e === null || o.leftSweepEvent.ringId === e.leftSweepEvent.ringId && (o.rightSweepEvent.isSamePoint(e.leftSweepEvent) || o.rightSweepEvent.isSamePoint(e.leftSweepEvent) || o.rightSweepEvent.isSamePoint(e.rightSweepEvent) || o.leftSweepEvent.isSamePoint(e.leftSweepEvent) || o.leftSweepEvent.isSamePoint(e.rightSweepEvent))) return !1;
  const t = o.leftSweepEvent.p.x, r = o.leftSweepEvent.p.y, i = o.rightSweepEvent.p.x, n = o.rightSweepEvent.p.y, s = e.leftSweepEvent.p.x, a = e.leftSweepEvent.p.y, c = e.rightSweepEvent.p.x, f = e.rightSweepEvent.p.y, h = (f - a) * (i - t) - (c - s) * (n - r), l = (c - s) * (r - a) - (f - a) * (t - s), d = (i - t) * (r - a) - (n - r) * (t - s);
  if (h === 0)
    return !1;
  const v = l / h, M = d / h;
  if (v >= 0 && v <= 1 && M >= 0 && M <= 1) {
    const S = t + v * (i - t), C = r + v * (n - r);
    return [S, C];
  }
  return !1;
}
function Mr(o, e) {
  e = e || !1;
  const t = [], r = new zn([], vr);
  for (; o.length; ) {
    const i = o.pop();
    if (i.isLeftEndpoint) {
      const n = new xr(i);
      for (let s = 0; s < r.data.length; s++) {
        const a = r.data[s];
        if (e && a.leftSweepEvent.featureId === i.featureId)
          continue;
        const c = _r(n, a);
        c !== !1 && t.push(c);
      }
      r.push(n);
    } else i.isLeftEndpoint === !1 && r.pop();
  }
  return t;
}
function Sr(o, e) {
  const t = new zn([], Wn);
  return br(o, t), Mr(t, e);
}
var kr = Sr;
function Er(o, e, t = {}) {
  const { removeDuplicates: r = !0, ignoreSelfIntersections: i = !0 } = t;
  let n = [];
  o.type === "FeatureCollection" ? n = n.concat(o.features) : o.type === "Feature" ? n.push(o) : (o.type === "LineString" || o.type === "Polygon" || o.type === "MultiLineString" || o.type === "MultiPolygon") && n.push(Ie(o)), e.type === "FeatureCollection" ? n = n.concat(e.features) : e.type === "Feature" ? n.push(e) : (e.type === "LineString" || e.type === "Polygon" || e.type === "MultiLineString" || e.type === "MultiPolygon") && n.push(Ie(e));
  const s = kr(
    Qt(n),
    i
  );
  let a = [];
  if (r) {
    const c = {};
    s.forEach((f) => {
      const h = f.join(",");
      c[h] || (c[h] = !0, a.push(f));
    });
  } else
    a = s;
  return Qt(a.map((c) => le(c)));
}
function Ar(o) {
  return o && o.__esModule && Object.prototype.hasOwnProperty.call(o, "default") ? o.default : o;
}
function Ir(o) {
  if (Object.prototype.hasOwnProperty.call(o, "__esModule")) return o;
  var e = o.default;
  if (typeof e == "function") {
    var t = function r() {
      return this instanceof r ? Reflect.construct(e, arguments, this.constructor) : e.apply(this, arguments);
    };
    t.prototype = e.prototype;
  } else t = {};
  return Object.defineProperty(t, "__esModule", { value: !0 }), Object.keys(o).forEach(function(r) {
    var i = Object.getOwnPropertyDescriptor(o, r);
    Object.defineProperty(t, r, i.get ? i : {
      enumerable: !0,
      get: function() {
        return o[r];
      }
    });
  }), t;
}
function Pr(o, e = {}) {
  let t = 0, r = 0, i = 0;
  return ln(
    o,
    function(n) {
      t += n[0], r += n[1], i++;
    },
    !0
  ), le([t / i, r / i], e.properties);
}
var Fe = { exports: {} }, ze = { exports: {} }, Br = ze.exports, _n;
function Or() {
  return _n || (_n = 1, (function(o, e) {
    (function(t, r) {
      o.exports = r();
    })(Br, function() {
      function t(m, w, u, y, g) {
        (function I(B, E, X, A, D) {
          for (; A > X; ) {
            if (A - X > 600) {
              var q = A - X + 1, p = E - X + 1, _ = Math.log(q), x = 0.5 * Math.exp(2 * _ / 3), T = 0.5 * Math.sqrt(_ * x * (q - x) / q) * (p - q / 2 < 0 ? -1 : 1), P = Math.max(X, Math.floor(E - p * x / q + T)), R = Math.min(A, Math.floor(E + (q - p) * x / q + T));
              I(B, E, P, R, D);
            }
            var b = B[E], O = X, L = A;
            for (r(B, X, E), D(B[A], b) > 0 && r(B, X, A); O < L; ) {
              for (r(B, O, L), O++, L--; D(B[O], b) < 0; ) O++;
              for (; D(B[L], b) > 0; ) L--;
            }
            D(B[X], b) === 0 ? r(B, X, L) : r(B, ++L, A), L <= E && (X = L + 1), E <= L && (A = L - 1);
          }
        })(m, w, u || 0, y || m.length - 1, g || i);
      }
      function r(m, w, u) {
        var y = m[w];
        m[w] = m[u], m[u] = y;
      }
      function i(m, w) {
        return m < w ? -1 : m > w ? 1 : 0;
      }
      var n = function(m) {
        m === void 0 && (m = 9), this._maxEntries = Math.max(4, m), this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries)), this.clear();
      };
      function s(m, w, u) {
        if (!u) return w.indexOf(m);
        for (var y = 0; y < w.length; y++) if (u(m, w[y])) return y;
        return -1;
      }
      function a(m, w) {
        c(m, 0, m.children.length, w, m);
      }
      function c(m, w, u, y, g) {
        g || (g = C(null)), g.minX = 1 / 0, g.minY = 1 / 0, g.maxX = -1 / 0, g.maxY = -1 / 0;
        for (var I = w; I < u; I++) {
          var B = m.children[I];
          f(g, m.leaf ? y(B) : B);
        }
        return g;
      }
      function f(m, w) {
        return m.minX = Math.min(m.minX, w.minX), m.minY = Math.min(m.minY, w.minY), m.maxX = Math.max(m.maxX, w.maxX), m.maxY = Math.max(m.maxY, w.maxY), m;
      }
      function h(m, w) {
        return m.minX - w.minX;
      }
      function l(m, w) {
        return m.minY - w.minY;
      }
      function d(m) {
        return (m.maxX - m.minX) * (m.maxY - m.minY);
      }
      function v(m) {
        return m.maxX - m.minX + (m.maxY - m.minY);
      }
      function M(m, w) {
        return m.minX <= w.minX && m.minY <= w.minY && w.maxX <= m.maxX && w.maxY <= m.maxY;
      }
      function S(m, w) {
        return w.minX <= m.maxX && w.minY <= m.maxY && w.maxX >= m.minX && w.maxY >= m.minY;
      }
      function C(m) {
        return { children: m, height: 1, leaf: !0, minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
      }
      function F(m, w, u, y, g) {
        for (var I = [w, u]; I.length; ) if (!((u = I.pop()) - (w = I.pop()) <= y)) {
          var B = w + Math.ceil((u - w) / y / 2) * y;
          t(m, B, w, u, g), I.push(w, B, B, u);
        }
      }
      return n.prototype.all = function() {
        return this._all(this.data, []);
      }, n.prototype.search = function(m) {
        var w = this.data, u = [];
        if (!S(m, w)) return u;
        for (var y = this.toBBox, g = []; w; ) {
          for (var I = 0; I < w.children.length; I++) {
            var B = w.children[I], E = w.leaf ? y(B) : B;
            S(m, E) && (w.leaf ? u.push(B) : M(m, E) ? this._all(B, u) : g.push(B));
          }
          w = g.pop();
        }
        return u;
      }, n.prototype.collides = function(m) {
        var w = this.data;
        if (!S(m, w)) return !1;
        for (var u = []; w; ) {
          for (var y = 0; y < w.children.length; y++) {
            var g = w.children[y], I = w.leaf ? this.toBBox(g) : g;
            if (S(m, I)) {
              if (w.leaf || M(m, I)) return !0;
              u.push(g);
            }
          }
          w = u.pop();
        }
        return !1;
      }, n.prototype.load = function(m) {
        if (!m || !m.length) return this;
        if (m.length < this._minEntries) {
          for (var w = 0; w < m.length; w++) this.insert(m[w]);
          return this;
        }
        var u = this._build(m.slice(), 0, m.length - 1, 0);
        if (this.data.children.length) if (this.data.height === u.height) this._splitRoot(this.data, u);
        else {
          if (this.data.height < u.height) {
            var y = this.data;
            this.data = u, u = y;
          }
          this._insert(u, this.data.height - u.height - 1, !0);
        }
        else this.data = u;
        return this;
      }, n.prototype.insert = function(m) {
        return m && this._insert(m, this.data.height - 1), this;
      }, n.prototype.clear = function() {
        return this.data = C([]), this;
      }, n.prototype.remove = function(m, w) {
        if (!m) return this;
        for (var u, y, g, I = this.data, B = this.toBBox(m), E = [], X = []; I || E.length; ) {
          if (I || (I = E.pop(), y = E[E.length - 1], u = X.pop(), g = !0), I.leaf) {
            var A = s(m, I.children, w);
            if (A !== -1) return I.children.splice(A, 1), E.push(I), this._condense(E), this;
          }
          g || I.leaf || !M(I, B) ? y ? (u++, I = y.children[u], g = !1) : I = null : (E.push(I), X.push(u), u = 0, y = I, I = I.children[0]);
        }
        return this;
      }, n.prototype.toBBox = function(m) {
        return m;
      }, n.prototype.compareMinX = function(m, w) {
        return m.minX - w.minX;
      }, n.prototype.compareMinY = function(m, w) {
        return m.minY - w.minY;
      }, n.prototype.toJSON = function() {
        return this.data;
      }, n.prototype.fromJSON = function(m) {
        return this.data = m, this;
      }, n.prototype._all = function(m, w) {
        for (var u = []; m; ) m.leaf ? w.push.apply(w, m.children) : u.push.apply(u, m.children), m = u.pop();
        return w;
      }, n.prototype._build = function(m, w, u, y) {
        var g, I = u - w + 1, B = this._maxEntries;
        if (I <= B) return a(g = C(m.slice(w, u + 1)), this.toBBox), g;
        y || (y = Math.ceil(Math.log(I) / Math.log(B)), B = Math.ceil(I / Math.pow(B, y - 1))), (g = C([])).leaf = !1, g.height = y;
        var E = Math.ceil(I / B), X = E * Math.ceil(Math.sqrt(B));
        F(m, w, u, X, this.compareMinX);
        for (var A = w; A <= u; A += X) {
          var D = Math.min(A + X - 1, u);
          F(m, A, D, E, this.compareMinY);
          for (var q = A; q <= D; q += E) {
            var p = Math.min(q + E - 1, D);
            g.children.push(this._build(m, q, p, y - 1));
          }
        }
        return a(g, this.toBBox), g;
      }, n.prototype._chooseSubtree = function(m, w, u, y) {
        for (; y.push(w), !w.leaf && y.length - 1 !== u; ) {
          for (var g = 1 / 0, I = 1 / 0, B = void 0, E = 0; E < w.children.length; E++) {
            var X = w.children[E], A = d(X), D = (q = m, p = X, (Math.max(p.maxX, q.maxX) - Math.min(p.minX, q.minX)) * (Math.max(p.maxY, q.maxY) - Math.min(p.minY, q.minY)) - A);
            D < I ? (I = D, g = A < g ? A : g, B = X) : D === I && A < g && (g = A, B = X);
          }
          w = B || w.children[0];
        }
        var q, p;
        return w;
      }, n.prototype._insert = function(m, w, u) {
        var y = u ? m : this.toBBox(m), g = [], I = this._chooseSubtree(y, this.data, w, g);
        for (I.children.push(m), f(I, y); w >= 0 && g[w].children.length > this._maxEntries; ) this._split(g, w), w--;
        this._adjustParentBBoxes(y, g, w);
      }, n.prototype._split = function(m, w) {
        var u = m[w], y = u.children.length, g = this._minEntries;
        this._chooseSplitAxis(u, g, y);
        var I = this._chooseSplitIndex(u, g, y), B = C(u.children.splice(I, u.children.length - I));
        B.height = u.height, B.leaf = u.leaf, a(u, this.toBBox), a(B, this.toBBox), w ? m[w - 1].children.push(B) : this._splitRoot(u, B);
      }, n.prototype._splitRoot = function(m, w) {
        this.data = C([m, w]), this.data.height = m.height + 1, this.data.leaf = !1, a(this.data, this.toBBox);
      }, n.prototype._chooseSplitIndex = function(m, w, u) {
        for (var y, g, I, B, E, X, A, D = 1 / 0, q = 1 / 0, p = w; p <= u - w; p++) {
          var _ = c(m, 0, p, this.toBBox), x = c(m, p, u, this.toBBox), T = (g = _, I = x, B = void 0, E = void 0, X = void 0, A = void 0, B = Math.max(g.minX, I.minX), E = Math.max(g.minY, I.minY), X = Math.min(g.maxX, I.maxX), A = Math.min(g.maxY, I.maxY), Math.max(0, X - B) * Math.max(0, A - E)), P = d(_) + d(x);
          T < D ? (D = T, y = p, q = P < q ? P : q) : T === D && P < q && (q = P, y = p);
        }
        return y || u - w;
      }, n.prototype._chooseSplitAxis = function(m, w, u) {
        var y = m.leaf ? this.compareMinX : h, g = m.leaf ? this.compareMinY : l;
        this._allDistMargin(m, w, u, y) < this._allDistMargin(m, w, u, g) && m.children.sort(y);
      }, n.prototype._allDistMargin = function(m, w, u, y) {
        m.children.sort(y);
        for (var g = this.toBBox, I = c(m, 0, w, g), B = c(m, u - w, u, g), E = v(I) + v(B), X = w; X < u - w; X++) {
          var A = m.children[X];
          f(I, m.leaf ? g(A) : A), E += v(I);
        }
        for (var D = u - w - 1; D >= w; D--) {
          var q = m.children[D];
          f(B, m.leaf ? g(q) : q), E += v(B);
        }
        return E;
      }, n.prototype._adjustParentBBoxes = function(m, w, u) {
        for (var y = u; y >= 0; y--) f(w[y], m);
      }, n.prototype._condense = function(m) {
        for (var w = m.length - 1, u = void 0; w >= 0; w--) m[w].children.length === 0 ? w > 0 ? (u = m[w - 1].children).splice(u.indexOf(m[w]), 1) : this.clear() : a(m[w], this.toBBox);
      }, n;
    });
  })(ze)), ze.exports;
}
class Tr {
  constructor(e = [], t = Nr) {
    if (this.data = e, this.length = this.data.length, this.compare = t, this.length > 0)
      for (let r = (this.length >> 1) - 1; r >= 0; r--) this._down(r);
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
    const { data: t, compare: r } = this, i = t[e];
    for (; e > 0; ) {
      const n = e - 1 >> 1, s = t[n];
      if (r(i, s) >= 0) break;
      t[e] = s, e = n;
    }
    t[e] = i;
  }
  _down(e) {
    const { data: t, compare: r } = this, i = this.length >> 1, n = t[e];
    for (; e < i; ) {
      let s = (e << 1) + 1, a = t[s];
      const c = s + 1;
      if (c < this.length && r(t[c], a) < 0 && (s = c, a = t[c]), r(a, n) >= 0) break;
      t[e] = a, e = s;
    }
    t[e] = n;
  }
}
function Nr(o, e) {
  return o < e ? -1 : o > e ? 1 : 0;
}
const Xr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Tr
}, Symbol.toStringTag, { value: "Module" })), Cr = /* @__PURE__ */ Ir(Xr);
var _e = { exports: {} }, an, Mn;
function Dr() {
  return Mn || (Mn = 1, an = function(e, t, r, i) {
    var n = e[0], s = e[1], a = !1;
    r === void 0 && (r = 0), i === void 0 && (i = t.length);
    for (var c = (i - r) / 2, f = 0, h = c - 1; f < c; h = f++) {
      var l = t[r + f * 2 + 0], d = t[r + f * 2 + 1], v = t[r + h * 2 + 0], M = t[r + h * 2 + 1], S = d > s != M > s && n < (v - l) * (s - d) / (M - d) + l;
      S && (a = !a);
    }
    return a;
  }), an;
}
var cn, Sn;
function Rr() {
  return Sn || (Sn = 1, cn = function(e, t, r, i) {
    var n = e[0], s = e[1], a = !1;
    r === void 0 && (r = 0), i === void 0 && (i = t.length);
    for (var c = i - r, f = 0, h = c - 1; f < c; h = f++) {
      var l = t[f + r][0], d = t[f + r][1], v = t[h + r][0], M = t[h + r][1], S = d > s != M > s && n < (v - l) * (s - d) / (M - d) + l;
      S && (a = !a);
    }
    return a;
  }), cn;
}
var kn;
function Fr() {
  if (kn) return _e.exports;
  kn = 1;
  var o = Dr(), e = Rr();
  return _e.exports = function(r, i, n, s) {
    return i.length > 0 && Array.isArray(i[0]) ? e(r, i, n, s) : o(r, i, n, s);
  }, _e.exports.nested = e, _e.exports.flat = o, _e.exports;
}
var Se = { exports: {} }, Yr = Se.exports, En;
function Lr() {
  return En || (En = 1, (function(o, e) {
    (function(t, r) {
      r(e);
    })(Yr, function(t) {
      const i = 33306690738754706e-32;
      function n(S, C, F, m, w) {
        let u, y, g, I, B = C[0], E = m[0], X = 0, A = 0;
        E > B == E > -B ? (u = B, B = C[++X]) : (u = E, E = m[++A]);
        let D = 0;
        if (X < S && A < F) for (E > B == E > -B ? (g = u - ((y = B + u) - B), B = C[++X]) : (g = u - ((y = E + u) - E), E = m[++A]), u = y, g !== 0 && (w[D++] = g); X < S && A < F; ) E > B == E > -B ? (g = u - ((y = u + B) - (I = y - u)) + (B - I), B = C[++X]) : (g = u - ((y = u + E) - (I = y - u)) + (E - I), E = m[++A]), u = y, g !== 0 && (w[D++] = g);
        for (; X < S; ) g = u - ((y = u + B) - (I = y - u)) + (B - I), B = C[++X], u = y, g !== 0 && (w[D++] = g);
        for (; A < F; ) g = u - ((y = u + E) - (I = y - u)) + (E - I), E = m[++A], u = y, g !== 0 && (w[D++] = g);
        return u === 0 && D !== 0 || (w[D++] = u), D;
      }
      function s(S) {
        return new Float64Array(S);
      }
      const a = 33306690738754716e-32, c = 22204460492503146e-32, f = 11093356479670487e-47, h = s(4), l = s(8), d = s(12), v = s(16), M = s(4);
      t.orient2d = function(S, C, F, m, w, u) {
        const y = (C - u) * (F - w), g = (S - w) * (m - u), I = y - g;
        if (y === 0 || g === 0 || y > 0 != g > 0) return I;
        const B = Math.abs(y + g);
        return Math.abs(I) >= a * B ? I : -(function(E, X, A, D, q, p, _) {
          let x, T, P, R, b, O, L, j, U, z, Q, W, ft, ct, lt, dt, gt, mt;
          const Pt = E - q, Xt = A - q, St = X - p, Mt = D - p;
          b = (lt = (j = Pt - (L = (O = 134217729 * Pt) - (O - Pt))) * (z = Mt - (U = (O = 134217729 * Mt) - (O - Mt))) - ((ct = Pt * Mt) - L * U - j * U - L * z)) - (Q = lt - (gt = (j = St - (L = (O = 134217729 * St) - (O - St))) * (z = Xt - (U = (O = 134217729 * Xt) - (O - Xt))) - ((dt = St * Xt) - L * U - j * U - L * z))), h[0] = lt - (Q + b) + (b - gt), b = (ft = ct - ((W = ct + Q) - (b = W - ct)) + (Q - b)) - (Q = ft - dt), h[1] = ft - (Q + b) + (b - dt), b = (mt = W + Q) - W, h[2] = W - (mt - b) + (Q - b), h[3] = mt;
          let Ht = (function(Qe, jt) {
            let Oe = jt[0];
            for (let k = 1; k < Qe; k++) Oe += jt[k];
            return Oe;
          })(4, h), ue = c * _;
          if (Ht >= ue || -Ht >= ue || (x = E - (Pt + (b = E - Pt)) + (b - q), P = A - (Xt + (b = A - Xt)) + (b - q), T = X - (St + (b = X - St)) + (b - p), R = D - (Mt + (b = D - Mt)) + (b - p), x === 0 && T === 0 && P === 0 && R === 0) || (ue = f * _ + i * Math.abs(Ht), (Ht += Pt * R + Mt * x - (St * P + Xt * T)) >= ue || -Ht >= ue)) return Ht;
          b = (lt = (j = x - (L = (O = 134217729 * x) - (O - x))) * (z = Mt - (U = (O = 134217729 * Mt) - (O - Mt))) - ((ct = x * Mt) - L * U - j * U - L * z)) - (Q = lt - (gt = (j = T - (L = (O = 134217729 * T) - (O - T))) * (z = Xt - (U = (O = 134217729 * Xt) - (O - Xt))) - ((dt = T * Xt) - L * U - j * U - L * z))), M[0] = lt - (Q + b) + (b - gt), b = (ft = ct - ((W = ct + Q) - (b = W - ct)) + (Q - b)) - (Q = ft - dt), M[1] = ft - (Q + b) + (b - dt), b = (mt = W + Q) - W, M[2] = W - (mt - b) + (Q - b), M[3] = mt;
          const Ge = n(4, h, 4, M, l);
          b = (lt = (j = Pt - (L = (O = 134217729 * Pt) - (O - Pt))) * (z = R - (U = (O = 134217729 * R) - (O - R))) - ((ct = Pt * R) - L * U - j * U - L * z)) - (Q = lt - (gt = (j = St - (L = (O = 134217729 * St) - (O - St))) * (z = P - (U = (O = 134217729 * P) - (O - P))) - ((dt = St * P) - L * U - j * U - L * z))), M[0] = lt - (Q + b) + (b - gt), b = (ft = ct - ((W = ct + Q) - (b = W - ct)) + (Q - b)) - (Q = ft - dt), M[1] = ft - (Q + b) + (b - dt), b = (mt = W + Q) - W, M[2] = W - (mt - b) + (Q - b), M[3] = mt;
          const Je = n(Ge, l, 4, M, d);
          b = (lt = (j = x - (L = (O = 134217729 * x) - (O - x))) * (z = R - (U = (O = 134217729 * R) - (O - R))) - ((ct = x * R) - L * U - j * U - L * z)) - (Q = lt - (gt = (j = T - (L = (O = 134217729 * T) - (O - T))) * (z = P - (U = (O = 134217729 * P) - (O - P))) - ((dt = T * P) - L * U - j * U - L * z))), M[0] = lt - (Q + b) + (b - gt), b = (ft = ct - ((W = ct + Q) - (b = W - ct)) + (Q - b)) - (Q = ft - dt), M[1] = ft - (Q + b) + (b - dt), b = (mt = W + Q) - W, M[2] = W - (mt - b) + (Q - b), M[3] = mt;
          const Ke = n(Je, d, 4, M, v);
          return v[Ke - 1];
        })(S, C, F, m, w, u, B);
      }, t.orient2dfast = function(S, C, F, m, w, u) {
        return (C - u) * (F - w) - (S - w) * (m - u);
      }, Object.defineProperty(t, "__esModule", { value: !0 });
    });
  })(Se, Se.exports)), Se.exports;
}
var An;
function $r() {
  if (An) return Fe.exports;
  An = 1;
  var o = Or(), e = Cr, t = Fr(), r = Lr().orient2d;
  e.default && (e = e.default), Fe.exports = i, Fe.exports.default = i;
  function i(u, y, g) {
    y = Math.max(0, y === void 0 ? 2 : y), g = g || 0;
    var I = v(u), B = new o(16);
    B.toBBox = function(L) {
      return {
        minX: L[0],
        minY: L[1],
        maxX: L[0],
        maxY: L[1]
      };
    }, B.compareMinX = function(L, j) {
      return L[0] - j[0];
    }, B.compareMinY = function(L, j) {
      return L[1] - j[1];
    }, B.load(u);
    for (var E = [], X = 0, A; X < I.length; X++) {
      var D = I[X];
      B.remove(D), A = M(D, A), E.push(A);
    }
    var q = new o(16);
    for (X = 0; X < E.length; X++) q.insert(d(E[X]));
    for (var p = y * y, _ = g * g; E.length; ) {
      var x = E.shift(), T = x.p, P = x.next.p, R = S(T, P);
      if (!(R < _)) {
        var b = R / p;
        D = n(B, x.prev.p, T, P, x.next.next.p, b, q), D && Math.min(S(D, T), S(D, P)) <= b && (E.push(x), E.push(M(D, x)), B.remove(D), q.remove(x), q.insert(d(x)), q.insert(d(x.next)));
      }
    }
    x = A;
    var O = [];
    do
      O.push(x.p), x = x.next;
    while (x !== A);
    return O.push(x.p), O;
  }
  function n(u, y, g, I, B, E, X) {
    for (var A = new e([], s), D = u.data; D; ) {
      for (var q = 0; q < D.children.length; q++) {
        var p = D.children[q], _ = D.leaf ? C(p, g, I) : a(g, I, p);
        _ > E || A.push({
          node: p,
          dist: _
        });
      }
      for (; A.length && !A.peek().node.children; ) {
        var x = A.pop(), T = x.node, P = C(T, y, g), R = C(T, I, B);
        if (x.dist < P && x.dist < R && f(g, T, X) && f(I, T, X)) return T;
      }
      D = A.pop(), D && (D = D.node);
    }
    return null;
  }
  function s(u, y) {
    return u.dist - y.dist;
  }
  function a(u, y, g) {
    if (c(u, g) || c(y, g)) return 0;
    var I = F(u[0], u[1], y[0], y[1], g.minX, g.minY, g.maxX, g.minY);
    if (I === 0) return 0;
    var B = F(u[0], u[1], y[0], y[1], g.minX, g.minY, g.minX, g.maxY);
    if (B === 0) return 0;
    var E = F(u[0], u[1], y[0], y[1], g.maxX, g.minY, g.maxX, g.maxY);
    if (E === 0) return 0;
    var X = F(u[0], u[1], y[0], y[1], g.minX, g.maxY, g.maxX, g.maxY);
    return X === 0 ? 0 : Math.min(I, B, E, X);
  }
  function c(u, y) {
    return u[0] >= y.minX && u[0] <= y.maxX && u[1] >= y.minY && u[1] <= y.maxY;
  }
  function f(u, y, g) {
    for (var I = Math.min(u[0], y[0]), B = Math.min(u[1], y[1]), E = Math.max(u[0], y[0]), X = Math.max(u[1], y[1]), A = g.search({ minX: I, minY: B, maxX: E, maxY: X }), D = 0; D < A.length; D++)
      if (l(A[D].p, A[D].next.p, u, y)) return !1;
    return !0;
  }
  function h(u, y, g) {
    return r(u[0], u[1], y[0], y[1], g[0], g[1]);
  }
  function l(u, y, g, I) {
    return u !== I && y !== g && h(u, y, g) > 0 != h(u, y, I) > 0 && h(g, I, u) > 0 != h(g, I, y) > 0;
  }
  function d(u) {
    var y = u.p, g = u.next.p;
    return u.minX = Math.min(y[0], g[0]), u.minY = Math.min(y[1], g[1]), u.maxX = Math.max(y[0], g[0]), u.maxY = Math.max(y[1], g[1]), u;
  }
  function v(u) {
    for (var y = u[0], g = u[0], I = u[0], B = u[0], E = 0; E < u.length; E++) {
      var X = u[E];
      X[0] < y[0] && (y = X), X[0] > I[0] && (I = X), X[1] < g[1] && (g = X), X[1] > B[1] && (B = X);
    }
    var A = [y, g, I, B], D = A.slice();
    for (E = 0; E < u.length; E++)
      t(u[E], A) || D.push(u[E]);
    return w(D);
  }
  function M(u, y) {
    var g = {
      p: u,
      prev: null,
      next: null,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };
    return y ? (g.next = y.next, g.prev = y, y.next.prev = g, y.next = g) : (g.prev = g, g.next = g), g;
  }
  function S(u, y) {
    var g = u[0] - y[0], I = u[1] - y[1];
    return g * g + I * I;
  }
  function C(u, y, g) {
    var I = y[0], B = y[1], E = g[0] - I, X = g[1] - B;
    if (E !== 0 || X !== 0) {
      var A = ((u[0] - I) * E + (u[1] - B) * X) / (E * E + X * X);
      A > 1 ? (I = g[0], B = g[1]) : A > 0 && (I += E * A, B += X * A);
    }
    return E = u[0] - I, X = u[1] - B, E * E + X * X;
  }
  function F(u, y, g, I, B, E, X, A) {
    var D = g - u, q = I - y, p = X - B, _ = A - E, x = u - B, T = y - E, P = D * D + q * q, R = D * p + q * _, b = p * p + _ * _, O = D * x + q * T, L = p * x + _ * T, j = P * b - R * R, U, z, Q, W, ft = j, ct = j;
    j === 0 ? (z = 0, ft = 1, W = L, ct = b) : (z = R * L - b * O, W = P * L - R * O, z < 0 ? (z = 0, W = L, ct = b) : z > ft && (z = ft, W = L + R, ct = b)), W < 0 ? (W = 0, -O < 0 ? z = 0 : -O > P ? z = ft : (z = -O, ft = P)) : W > ct && (W = ct, -O + R < 0 ? z = 0 : -O + R > P ? z = ft : (z = -O + R, ft = P)), U = z === 0 ? 0 : z / ft, Q = W === 0 ? 0 : W / ct;
    var lt = (1 - U) * u + U * g, dt = (1 - U) * y + U * I, gt = (1 - Q) * B + Q * X, mt = (1 - Q) * E + Q * A, Pt = gt - lt, Xt = mt - dt;
    return Pt * Pt + Xt * Xt;
  }
  function m(u, y) {
    return u[0] === y[0] ? u[1] - y[1] : u[0] - y[0];
  }
  function w(u) {
    u.sort(m);
    for (var y = [], g = 0; g < u.length; g++) {
      for (; y.length >= 2 && h(y[y.length - 2], y[y.length - 1], u[g]) <= 0; )
        y.pop();
      y.push(u[g]);
    }
    for (var I = [], B = u.length - 1; B >= 0; B--) {
      for (; I.length >= 2 && h(I[I.length - 2], I[I.length - 1], u[B]) <= 0; )
        I.pop();
      I.push(u[B]);
    }
    return I.pop(), y.pop(), y.concat(I);
  }
  return Fe.exports;
}
var jr = $r();
const qr = /* @__PURE__ */ Ar(jr);
function In(o, e = {}) {
  e.concavity = e.concavity || 1 / 0;
  const t = [];
  if (ln(o, (i) => {
    t.push([i[0], i[1]]);
  }), !t.length)
    return null;
  const r = qr(t, e.concavity);
  return r.length > 3 ? Be([r]) : null;
}
var ke = { exports: {} }, Vr = ke.exports, Pn;
function Ur() {
  return Pn || (Pn = 1, (function(o, e) {
    (function(t, r) {
      r(e);
    })(Vr, (function(t) {
      var r = Object.defineProperty, i = (k, N, Y) => N in k ? r(k, N, { enumerable: !0, configurable: !0, writable: !0, value: Y }) : k[N] = Y, n = (k, N, Y) => i(k, typeof N != "symbol" ? N + "" : N, Y);
      function s(k, N, Y = {}) {
        const $ = { type: "Feature" };
        return (Y.id === 0 || Y.id) && ($.id = Y.id), Y.bbox && ($.bbox = Y.bbox), $.properties = N || {}, $.geometry = k, $;
      }
      function a(k, N, Y = {}) {
        if (!k) throw new Error("coordinates is required");
        if (!Array.isArray(k)) throw new Error("coordinates must be an Array");
        if (k.length < 2) throw new Error("coordinates must be at least 2 numbers long");
        if (!h(k[0]) || !h(k[1])) throw new Error("coordinates must contain numbers");
        return s({ type: "Point", coordinates: k }, N, Y);
      }
      function c(k, N, Y = {}) {
        for (const $ of k) {
          if ($.length < 4) throw new Error("Each LinearRing of a Polygon must have 4 or more Positions.");
          if ($[$.length - 1].length !== $[0].length) throw new Error("First and last Position are not equivalent.");
          for (let et = 0; et < $[$.length - 1].length; et++) if ($[$.length - 1][et] !== $[0][et]) throw new Error("First and last Position are not equivalent.");
        }
        return s({ type: "Polygon", coordinates: k }, N, Y);
      }
      function f(k, N = {}) {
        const Y = { type: "FeatureCollection" };
        return N.id && (Y.id = N.id), N.bbox && (Y.bbox = N.bbox), Y.features = k, Y;
      }
      function h(k) {
        return !isNaN(k) && k !== null && !Array.isArray(k);
      }
      function l(k) {
        if (!k) throw new Error("coord is required");
        if (!Array.isArray(k)) {
          if (k.type === "Feature" && k.geometry !== null && k.geometry.type === "Point") return [...k.geometry.coordinates];
          if (k.type === "Point") return [...k.coordinates];
        }
        if (Array.isArray(k) && k.length >= 2 && !Array.isArray(k[0]) && !Array.isArray(k[1])) return [...k];
        throw new Error("coord must be GeoJSON Point or an Array of numbers");
      }
      function d(k) {
        if (Array.isArray(k)) return k;
        if (k.type === "Feature") {
          if (k.geometry !== null) return k.geometry.coordinates;
        } else if (k.coordinates) return k.coordinates;
        throw new Error("coords must be GeoJSON Feature, Geometry Object or an Array");
      }
      function v(k) {
        return k.type === "Feature" ? k.geometry : k;
      }
      const M = 11102230246251565e-32, S = 134217729, C = (3 + 8 * M) * M;
      function F(k, N, Y, $, et) {
        let K, Z, ot, it, at = N[0], ht = $[0], J = 0, tt = 0;
        ht > at == ht > -at ? (K = at, at = N[++J]) : (K = ht, ht = $[++tt]);
        let ut = 0;
        if (J < k && tt < Y) for (ht > at == ht > -at ? (Z = at + K, ot = K - (Z - at), at = N[++J]) : (Z = ht + K, ot = K - (Z - ht), ht = $[++tt]), K = Z, ot !== 0 && (et[ut++] = ot); J < k && tt < Y; ) ht > at == ht > -at ? (Z = K + at, it = Z - K, ot = K - (Z - it) + (at - it), at = N[++J]) : (Z = K + ht, it = Z - K, ot = K - (Z - it) + (ht - it), ht = $[++tt]), K = Z, ot !== 0 && (et[ut++] = ot);
        for (; J < k; ) Z = K + at, it = Z - K, ot = K - (Z - it) + (at - it), at = N[++J], K = Z, ot !== 0 && (et[ut++] = ot);
        for (; tt < Y; ) Z = K + ht, it = Z - K, ot = K - (Z - it) + (ht - it), ht = $[++tt], K = Z, ot !== 0 && (et[ut++] = ot);
        return (K !== 0 || ut === 0) && (et[ut++] = K), ut;
      }
      function m(k, N) {
        let Y = N[0];
        for (let $ = 1; $ < k; $++) Y += N[$];
        return Y;
      }
      function w(k) {
        return new Float64Array(k);
      }
      const u = (3 + 16 * M) * M, y = (2 + 12 * M) * M, g = (9 + 64 * M) * M * M, I = w(4), B = w(8), E = w(12), X = w(16), A = w(4);
      function D(k, N, Y, $, et, K, Z) {
        let ot, it, at, ht, J, tt, ut, _t, nt, H, G, wt, It, kt, Nt, yt, Bt, Rt;
        const Wt = k - et, Gt = Y - et, Jt = N - K, Kt = $ - K;
        kt = Wt * Kt, tt = S * Wt, ut = tt - (tt - Wt), _t = Wt - ut, tt = S * Kt, nt = tt - (tt - Kt), H = Kt - nt, Nt = _t * H - (kt - ut * nt - _t * nt - ut * H), yt = Jt * Gt, tt = S * Jt, ut = tt - (tt - Jt), _t = Jt - ut, tt = S * Gt, nt = tt - (tt - Gt), H = Gt - nt, Bt = _t * H - (yt - ut * nt - _t * nt - ut * H), G = Nt - Bt, J = Nt - G, I[0] = Nt - (G + J) + (J - Bt), wt = kt + G, J = wt - kt, It = kt - (wt - J) + (G - J), G = It - yt, J = It - G, I[1] = It - (G + J) + (J - yt), Rt = wt + G, J = Rt - wt, I[2] = wt - (Rt - J) + (G - J), I[3] = Rt;
        let pe = m(4, I), xe = y * Z;
        if (pe >= xe || -pe >= xe || (J = k - Wt, ot = k - (Wt + J) + (J - et), J = Y - Gt, at = Y - (Gt + J) + (J - et), J = N - Jt, it = N - (Jt + J) + (J - K), J = $ - Kt, ht = $ - (Kt + J) + (J - K), ot === 0 && it === 0 && at === 0 && ht === 0) || (xe = g * Z + C * Math.abs(pe), pe += Wt * ht + Kt * ot - (Jt * at + Gt * it), pe >= xe || -pe >= xe)) return pe;
        kt = ot * Kt, tt = S * ot, ut = tt - (tt - ot), _t = ot - ut, tt = S * Kt, nt = tt - (tt - Kt), H = Kt - nt, Nt = _t * H - (kt - ut * nt - _t * nt - ut * H), yt = it * Gt, tt = S * it, ut = tt - (tt - it), _t = it - ut, tt = S * Gt, nt = tt - (tt - Gt), H = Gt - nt, Bt = _t * H - (yt - ut * nt - _t * nt - ut * H), G = Nt - Bt, J = Nt - G, A[0] = Nt - (G + J) + (J - Bt), wt = kt + G, J = wt - kt, It = kt - (wt - J) + (G - J), G = It - yt, J = It - G, A[1] = It - (G + J) + (J - yt), Rt = wt + G, J = Rt - wt, A[2] = wt - (Rt - J) + (G - J), A[3] = Rt;
        const tr = F(4, I, 4, A, B);
        kt = Wt * ht, tt = S * Wt, ut = tt - (tt - Wt), _t = Wt - ut, tt = S * ht, nt = tt - (tt - ht), H = ht - nt, Nt = _t * H - (kt - ut * nt - _t * nt - ut * H), yt = Jt * at, tt = S * Jt, ut = tt - (tt - Jt), _t = Jt - ut, tt = S * at, nt = tt - (tt - at), H = at - nt, Bt = _t * H - (yt - ut * nt - _t * nt - ut * H), G = Nt - Bt, J = Nt - G, A[0] = Nt - (G + J) + (J - Bt), wt = kt + G, J = wt - kt, It = kt - (wt - J) + (G - J), G = It - yt, J = It - G, A[1] = It - (G + J) + (J - yt), Rt = wt + G, J = Rt - wt, A[2] = wt - (Rt - J) + (G - J), A[3] = Rt;
        const er = F(tr, B, 4, A, E);
        kt = ot * ht, tt = S * ot, ut = tt - (tt - ot), _t = ot - ut, tt = S * ht, nt = tt - (tt - ht), H = ht - nt, Nt = _t * H - (kt - ut * nt - _t * nt - ut * H), yt = it * at, tt = S * it, ut = tt - (tt - it), _t = it - ut, tt = S * at, nt = tt - (tt - at), H = at - nt, Bt = _t * H - (yt - ut * nt - _t * nt - ut * H), G = Nt - Bt, J = Nt - G, A[0] = Nt - (G + J) + (J - Bt), wt = kt + G, J = wt - kt, It = kt - (wt - J) + (G - J), G = It - yt, J = It - G, A[1] = It - (G + J) + (J - yt), Rt = wt + G, J = Rt - wt, A[2] = wt - (Rt - J) + (G - J), A[3] = Rt;
        const nr = F(er, E, 4, A, X);
        return X[nr - 1];
      }
      function q(k, N, Y, $, et, K) {
        const Z = (N - K) * (Y - et), ot = (k - et) * ($ - K), it = Z - ot, at = Math.abs(Z + ot);
        return Math.abs(it) >= u * at ? it : -D(k, N, Y, $, et, K, at);
      }
      function p(k, N) {
        var Y, $, et = 0, K, Z, ot, it, at, ht, J, tt = k[0], ut = k[1], _t = N.length;
        for (Y = 0; Y < _t; Y++) {
          $ = 0;
          var nt = N[Y], H = nt.length - 1;
          if (ht = nt[0], ht[0] !== nt[H][0] && ht[1] !== nt[H][1]) throw new Error("First and last coordinates in a ring must be the same");
          for (Z = ht[0] - tt, ot = ht[1] - ut, $; $ < H; $++) {
            if (J = nt[$ + 1], it = J[0] - tt, at = J[1] - ut, ot === 0 && at === 0) {
              if (it <= 0 && Z >= 0 || Z <= 0 && it >= 0) return 0;
            } else if (at >= 0 && ot <= 0 || at <= 0 && ot >= 0) {
              if (K = q(Z, it, ot, at, 0, 0), K === 0) return 0;
              (K > 0 && at > 0 && ot <= 0 || K < 0 && at <= 0 && ot > 0) && et++;
            }
            ht = J, ot = at, Z = it;
          }
        }
        return et % 2 !== 0;
      }
      function _(k, N, Y = {}) {
        if (!k) throw new Error("point is required");
        if (!N) throw new Error("polygon is required");
        const $ = l(k), et = v(N), K = et.type, Z = N.bbox;
        let ot = et.coordinates;
        if (Z && x($, Z) === !1) return !1;
        K === "Polygon" && (ot = [ot]);
        let it = !1;
        for (var at = 0; at < ot.length; ++at) {
          const ht = p($, ot[at]);
          if (ht === 0) return !Y.ignoreBoundary;
          ht && (it = !0);
        }
        return it;
      }
      function x(k, N) {
        return N[0] <= k[0] && N[1] <= k[1] && N[2] >= k[0] && N[3] >= k[1];
      }
      function T(k, N) {
        for (let Y = 0; Y < N.features.length; Y++) if (_(k, N.features[Y])) return N.features[Y];
      }
      function P(k, N, Y) {
        const $ = N.geometry.coordinates[0][0], et = N.geometry.coordinates[0][1], K = N.geometry.coordinates[0][2], Z = k.geometry.coordinates, ot = N.properties.a.geom, it = N.properties.b.geom, at = N.properties.c.geom, ht = [et[0] - $[0], et[1] - $[1]], J = [K[0] - $[0], K[1] - $[1]], tt = [Z[0] - $[0], Z[1] - $[1]], ut = [it[0] - ot[0], it[1] - ot[1]], _t = [at[0] - ot[0], at[1] - ot[1]];
        let nt = (J[1] * tt[0] - J[0] * tt[1]) / (ht[0] * J[1] - ht[1] * J[0]), H = (ht[0] * tt[1] - ht[1] * tt[0]) / (ht[0] * J[1] - ht[1] * J[0]);
        if (Y) {
          const G = Y[N.properties.a.index], wt = Y[N.properties.b.index], It = Y[N.properties.c.index];
          let kt;
          if (nt < 0 || H < 0 || 1 - nt - H < 0) {
            const Nt = nt / (nt + H), yt = H / (nt + H);
            kt = nt / wt / (Nt / wt + yt / It), H = H / It / (Nt / wt + yt / It);
          } else kt = nt / wt / (nt / wt + H / It + (1 - nt - H) / G), H = H / It / (nt / wt + H / It + (1 - nt - H) / G);
          nt = kt;
        }
        return [nt * ut[0] + H * _t[0] + ot[0], nt * ut[1] + H * _t[1] + ot[1]];
      }
      function R(k, N, Y, $) {
        const et = k.geometry.coordinates, K = Y.geometry.coordinates, Z = Math.atan2(et[0] - K[0], et[1] - K[1]), ot = L(Z, N[0]);
        if (ot === void 0) throw new Error("Unable to determine vertex index");
        const it = N[1][ot];
        return P(k, it.features[0], $);
      }
      function b(k, N, Y, $, et, K, Z, ot) {
        let it;
        if (Z && (it = T(k, f([Z]))), !it) if (Y) {
          const at = k.geometry.coordinates, ht = Y.gridNum, J = Y.xOrigin, tt = Y.yOrigin, ut = Y.xUnit, _t = Y.yUnit, nt = Y.gridCache, H = O(at[0], J, ut, ht), G = O(at[1], tt, _t, ht), wt = nt[H] ? nt[H][G] ? nt[H][G] : [] : [], It = f(wt.map((kt) => N.features[kt]));
          it = T(k, It);
        } else it = T(k, N);
        return ot && ot(it), it ? P(k, it, K) : R(k, $, et, K);
      }
      function O(k, N, Y, $) {
        let et = Math.floor((k - N) / Y);
        return et < 0 && (et = 0), et >= $ && (et = $ - 1), et;
      }
      function L(k, N) {
        let Y = j(k - N[0]), $ = Math.PI * 2, et;
        for (let K = 0; K < N.length; K++) {
          const Z = (K + 1) % N.length, ot = j(k - N[Z]), it = Math.min(Math.abs(Y), Math.abs(ot));
          Y * ot <= 0 && it < $ && ($ = it, et = K), Y = ot;
        }
        return et;
      }
      function j(k, N = !1) {
        const Y = 2 * Math.PI, $ = k - Math.floor(k / Y) * Y;
        return N ? $ : $ > Math.PI ? $ - Y : $;
      }
      function U(k, N) {
        return N && N >= 2.00703 || Array.isArray(k[0]) ? k : k.map((Y) => [Y.illstNodes, Y.mercNodes, Y.startEnd]);
      }
      function z(k) {
        const N = k.features;
        for (let Y = 0; Y < N.length; Y++) {
          const $ = N[Y];
          `${$.properties.a.index}`.substring(0, 1) === "b" && `${$.properties.b.index}`.substring(0, 1) === "b" ? N[Y] = { geometry: { type: "Polygon", coordinates: [[$.geometry.coordinates[0][2], $.geometry.coordinates[0][0], $.geometry.coordinates[0][1], $.geometry.coordinates[0][2]]] }, properties: { a: { geom: $.properties.c.geom, index: $.properties.c.index }, b: { geom: $.properties.a.geom, index: $.properties.a.index }, c: { geom: $.properties.b.geom, index: $.properties.b.index } }, type: "Feature" } : `${$.properties.c.index}`.substring(0, 1) === "b" && `${$.properties.a.index}`.substring(0, 1) === "b" && (N[Y] = { geometry: { type: "Polygon", coordinates: [[$.geometry.coordinates[0][1], $.geometry.coordinates[0][2], $.geometry.coordinates[0][0], $.geometry.coordinates[0][1]]] }, properties: { a: { geom: $.properties.b.geom, index: $.properties.b.index }, b: { geom: $.properties.c.geom, index: $.properties.c.index }, c: { geom: $.properties.a.geom, index: $.properties.a.index } }, type: "Feature" });
        }
        return k;
      }
      function Q(k) {
        const N = ["a", "b", "c", "a"].map((K) => k.properties[K].geom), Y = k.geometry.coordinates[0], $ = k.properties, et = { a: { geom: Y[0], index: $.a.index }, b: { geom: Y[1], index: $.b.index }, c: { geom: Y[2], index: $.c.index } };
        return c([N], et);
      }
      function W(k) {
        const N = [0, 1, 2, 0].map(($) => k[$][0][0]), Y = { a: { geom: k[0][0][1], index: k[0][1] }, b: { geom: k[1][0][1], index: k[1][1] }, c: { geom: k[2][0][1], index: k[2][1] } };
        return c([N], Y);
      }
      function ft(k, N, Y, $, et, K = !1, Z) {
        const ot = k.map((it) => {
          (!Z || Z < 2.00703) && (it = ct(it));
          const at = isFinite(it) ? N[it] : it === "c" ? $ : (function() {
            const ht = it.match(/^b(\d+)$/);
            if (ht) return et[parseInt(ht[1])];
            const J = it.match(/^e(\d+)$/);
            if (J) return Y[parseInt(J[1])];
            throw new Error("Bad index value for indexesToTri");
          })();
          return K ? [[at[1], at[0]], it] : [[at[0], at[1]], it];
        });
        return W(ot);
      }
      function ct(k) {
        return typeof k == "number" ? k : k.replace(/^(c|e|b)(?:ent|dgeNode|box)(\d+)?$/, "$1$2");
      }
      const lt = 2.00703;
      function dt(k) {
        return !!(k.version !== void 0 || !k.tins && k.points && k.tins_points);
      }
      function gt(k) {
        return { points: k.points, pointsWeightBuffer: Pt(k), strictStatus: Xt(k), verticesParams: St(k), centroid: Ht(k), edges: U(k.edges || []), edgeNodes: k.edgeNodes || [], tins: ue(k), kinks: Ge(k.kinks_points), yaxisMode: k.yaxisMode ?? "invert", strictMode: k.strictMode ?? "auto", vertexMode: k.vertexMode, bounds: k.bounds, boundsPolygon: k.boundsPolygon, wh: k.wh, xy: k.xy ?? [0, 0] };
      }
      function mt(k) {
        const N = Je(k), Y = N.tins;
        return { compiled: N, tins: Y, points: Ke(Y), strictStatus: N.strict_status, pointsWeightBuffer: N.weight_buffer, verticesParams: N.vertices_params, centroid: N.centroid, kinks: N.kinks };
      }
      function Pt(k) {
        return !k.version || k.version < lt ? ["forw", "bakw"].reduce((N, Y) => {
          const $ = k.weight_buffer[Y];
          return $ && (N[Y] = Object.keys($).reduce((et, K) => {
            const Z = ct(K);
            return et[Z] = $[K], et;
          }, {})), N;
        }, {}) : k.weight_buffer;
      }
      function Xt(k) {
        return k.strict_status ? k.strict_status : k.kinks_points ? "strict_error" : k.tins_points.length === 2 ? "loose" : "strict";
      }
      function St(k) {
        const N = { forw: [k.vertices_params[0]], bakw: [k.vertices_params[1]] };
        return N.forw[1] = Mt(k, !1), N.bakw[1] = Mt(k, !0), N;
      }
      function Mt(k, N) {
        const Y = k.vertices_points.length;
        return Array.from({ length: Y }, ($, et) => {
          const K = (et + 1) % Y, Z = ft(["c", `b${et}`, `b${K}`], k.points, k.edgeNodes || [], k.centroid_point, k.vertices_points, N, lt);
          return f([Z]);
        });
      }
      function Ht(k) {
        return { forw: a(k.centroid_point[0], { target: { geom: k.centroid_point[1], index: "c" } }), bakw: a(k.centroid_point[1], { target: { geom: k.centroid_point[0], index: "c" } }) };
      }
      function ue(k) {
        const N = k.tins_points.length === 1 ? 0 : 1;
        return { forw: f(k.tins_points[0].map((Y) => ft(Y, k.points, k.edgeNodes || [], k.centroid_point, k.vertices_points, !1, k.version))), bakw: f(k.tins_points[N].map((Y) => ft(Y, k.points, k.edgeNodes || [], k.centroid_point, k.vertices_points, !0, k.version))) };
      }
      function Ge(k) {
        if (k) return { bakw: f(k.map((N) => a(N))) };
      }
      function Je(k) {
        return JSON.parse(JSON.stringify(k).replace('"cent"', '"c"').replace(/"bbox(\d+)"/g, '"b$1"'));
      }
      function Ke(k) {
        const N = [], Y = k.forw.features;
        for (let $ = 0; $ < Y.length; $++) {
          const et = Y[$];
          ["a", "b", "c"].forEach((K, Z) => {
            const ot = et.geometry.coordinates[0][Z], it = et.properties[K].geom, at = et.properties[K].index;
            typeof at == "number" && (N[at] = [ot, it]);
          });
        }
        return N;
      }
      const Qe = lt, jt = class ne {
        constructor() {
          n(this, "points", []), n(this, "pointsWeightBuffer"), n(this, "strict_status"), n(this, "vertices_params"), n(this, "centroid"), n(this, "edgeNodes"), n(this, "edges"), n(this, "tins"), n(this, "kinks"), n(this, "yaxisMode", ne.YAXIS_INVERT), n(this, "strictMode", ne.MODE_AUTO), n(this, "vertexMode", ne.VERTEX_PLAIN), n(this, "bounds"), n(this, "boundsPolygon"), n(this, "wh"), n(this, "xy"), n(this, "indexedTins"), n(this, "stateFull", !1), n(this, "stateTriangle"), n(this, "stateBackward"), n(this, "priority"), n(this, "importance"), n(this, "xyBounds"), n(this, "mercBounds");
        }
        setCompiled(N) {
          if (dt(N)) {
            this.applyModernState(gt(N));
            return;
          }
          this.applyLegacyState(mt(N));
        }
        applyModernState(N) {
          this.points = N.points, this.pointsWeightBuffer = N.pointsWeightBuffer, this.strict_status = N.strictStatus, this.vertices_params = N.verticesParams, this.centroid = N.centroid, this.edges = N.edges, this.edgeNodes = N.edgeNodes || [], this.tins = N.tins, this.addIndexedTin(), this.kinks = N.kinks, this.yaxisMode = N.yaxisMode ?? ne.YAXIS_INVERT, this.vertexMode = N.vertexMode ?? ne.VERTEX_PLAIN, this.strictMode = N.strictMode ?? ne.MODE_AUTO, N.bounds ? (this.bounds = N.bounds, this.boundsPolygon = N.boundsPolygon, this.xy = N.xy, this.wh = N.wh) : (this.bounds = void 0, this.boundsPolygon = void 0, this.xy = N.xy ?? [0, 0], N.wh && (this.wh = N.wh));
        }
        applyLegacyState(N) {
          this.tins = N.tins, this.addIndexedTin(), this.strict_status = N.strictStatus, this.pointsWeightBuffer = N.pointsWeightBuffer, this.vertices_params = N.verticesParams, this.centroid = N.centroid, this.kinks = N.kinks, this.points = N.points;
        }
        addIndexedTin() {
          const N = this.tins, Y = N.forw, $ = N.bakw, et = Math.ceil(Math.sqrt(Y.features.length));
          if (et < 3) {
            this.indexedTins = void 0;
            return;
          }
          let K = [], Z = [];
          const ot = Y.features.map((nt) => {
            let H = [];
            return d(nt)[0].map((G) => {
              K.length === 0 ? K = [Array.from(G), Array.from(G)] : (G[0] < K[0][0] && (K[0][0] = G[0]), G[0] > K[1][0] && (K[1][0] = G[0]), G[1] < K[0][1] && (K[0][1] = G[1]), G[1] > K[1][1] && (K[1][1] = G[1])), H.length === 0 ? H = [Array.from(G), Array.from(G)] : (G[0] < H[0][0] && (H[0][0] = G[0]), G[0] > H[1][0] && (H[1][0] = G[0]), G[1] < H[0][1] && (H[0][1] = G[1]), G[1] > H[1][1] && (H[1][1] = G[1]));
            }), H;
          }), it = (K[1][0] - K[0][0]) / et, at = (K[1][1] - K[0][1]) / et, ht = ot.reduce((nt, H, G) => {
            const wt = O(H[0][0], K[0][0], it, et), It = O(H[1][0], K[0][0], it, et), kt = O(H[0][1], K[0][1], at, et), Nt = O(H[1][1], K[0][1], at, et);
            for (let yt = wt; yt <= It; yt++) {
              nt[yt] || (nt[yt] = []);
              for (let Bt = kt; Bt <= Nt; Bt++) nt[yt][Bt] || (nt[yt][Bt] = []), nt[yt][Bt].push(G);
            }
            return nt;
          }, []), J = $.features.map((nt) => {
            let H = [];
            return d(nt)[0].map((G) => {
              Z.length === 0 ? Z = [Array.from(G), Array.from(G)] : (G[0] < Z[0][0] && (Z[0][0] = G[0]), G[0] > Z[1][0] && (Z[1][0] = G[0]), G[1] < Z[0][1] && (Z[0][1] = G[1]), G[1] > Z[1][1] && (Z[1][1] = G[1])), H.length === 0 ? H = [Array.from(G), Array.from(G)] : (G[0] < H[0][0] && (H[0][0] = G[0]), G[0] > H[1][0] && (H[1][0] = G[0]), G[1] < H[0][1] && (H[0][1] = G[1]), G[1] > H[1][1] && (H[1][1] = G[1]));
            }), H;
          }), tt = (Z[1][0] - Z[0][0]) / et, ut = (Z[1][1] - Z[0][1]) / et, _t = J.reduce((nt, H, G) => {
            const wt = O(H[0][0], Z[0][0], tt, et), It = O(H[1][0], Z[0][0], tt, et), kt = O(H[0][1], Z[0][1], ut, et), Nt = O(H[1][1], Z[0][1], ut, et);
            for (let yt = wt; yt <= It; yt++) {
              nt[yt] || (nt[yt] = []);
              for (let Bt = kt; Bt <= Nt; Bt++) nt[yt][Bt] || (nt[yt][Bt] = []), nt[yt][Bt].push(G);
            }
            return nt;
          }, []);
          this.indexedTins = { forw: { gridNum: et, xOrigin: K[0][0], yOrigin: K[0][1], xUnit: it, yUnit: at, gridCache: ht }, bakw: { gridNum: et, xOrigin: Z[0][0], yOrigin: Z[0][1], xUnit: tt, yUnit: ut, gridCache: _t } };
        }
        transform(N, Y, $) {
          if (!this.tins) throw new Error("setCompiled() must be called before transform()");
          if (Y && this.strict_status == ne.STATUS_ERROR) throw new Error('Backward transform is not allowed if strict_status == "strict_error"');
          this.yaxisMode == ne.YAXIS_FOLLOW && Y && (N = [N[0], -1 * N[1]]);
          const et = a(N);
          if (this.bounds && !Y && !$ && !_(et, this.boundsPolygon)) return !1;
          const K = Y ? this.tins.bakw : this.tins.forw, Z = Y ? this.indexedTins.bakw : this.indexedTins.forw, ot = Y ? this.vertices_params.bakw : this.vertices_params.forw, it = Y ? this.centroid.bakw : this.centroid.forw, at = Y ? this.pointsWeightBuffer.bakw : this.pointsWeightBuffer.forw;
          let ht, J;
          this.stateFull && (this.stateBackward == Y ? ht = this.stateTriangle : (this.stateBackward = Y, this.stateTriangle = void 0), J = (ut) => {
            this.stateTriangle = ut;
          });
          let tt = b(et, K, Z, ot, it, at, ht, J);
          if (this.bounds && Y && !$) {
            const ut = a(tt);
            if (!_(ut, this.boundsPolygon)) return !1;
          } else this.yaxisMode == ne.YAXIS_FOLLOW && !Y && (tt = [tt[0], -1 * tt[1]]);
          return tt;
        }
      };
      n(jt, "VERTEX_PLAIN", "plain"), n(jt, "VERTEX_BIRDEYE", "birdeye"), n(jt, "MODE_STRICT", "strict"), n(jt, "MODE_AUTO", "auto"), n(jt, "MODE_LOOSE", "loose"), n(jt, "STATUS_STRICT", "strict"), n(jt, "STATUS_ERROR", "strict_error"), n(jt, "STATUS_LOOSE", "loose"), n(jt, "YAXIS_FOLLOW", "follow"), n(jt, "YAXIS_INVERT", "invert");
      let Oe = jt;
      t.Transform = Oe, t.counterTri = Q, t.format_version = Qe, t.normalizeEdges = U, t.rotateVerticesTriangle = z, t.transformArr = b, Object.defineProperty(t, Symbol.toStringTag, { value: "Module" });
    }));
  })(ke, ke.exports)), ke.exports;
}
var Ut = Ur();
const Bn = Math.pow(2, -52), Ye = new Uint32Array(512);
class un {
  static from(e, t = Kr, r = Qr) {
    const i = e.length, n = new Float64Array(i * 2);
    for (let s = 0; s < i; s++) {
      const a = e[s];
      n[2 * s] = t(a), n[2 * s + 1] = r(a);
    }
    return new un(n);
  }
  constructor(e) {
    const t = e.length >> 1;
    if (t > 0 && typeof e[0] != "number") throw new Error("Expected coords to contain numbers.");
    this.coords = e;
    const r = Math.max(2 * t - 5, 0);
    this._triangles = new Uint32Array(r * 3), this._halfedges = new Int32Array(r * 3), this._hashSize = Math.ceil(Math.sqrt(t)), this._hullPrev = new Uint32Array(t), this._hullNext = new Uint32Array(t), this._hullTri = new Uint32Array(t), this._hullHash = new Int32Array(this._hashSize), this._ids = new Uint32Array(t), this._dists = new Float64Array(t), this.update();
  }
  update() {
    const { coords: e, _hullPrev: t, _hullNext: r, _hullTri: i, _hullHash: n } = this, s = e.length >> 1;
    let a = 1 / 0, c = 1 / 0, f = -1 / 0, h = -1 / 0;
    for (let E = 0; E < s; E++) {
      const X = e[2 * E], A = e[2 * E + 1];
      X < a && (a = X), A < c && (c = A), X > f && (f = X), A > h && (h = A), this._ids[E] = E;
    }
    const l = (a + f) / 2, d = (c + h) / 2;
    let v, M, S;
    for (let E = 0, X = 1 / 0; E < s; E++) {
      const A = fn(l, d, e[2 * E], e[2 * E + 1]);
      A < X && (v = E, X = A);
    }
    const C = e[2 * v], F = e[2 * v + 1];
    for (let E = 0, X = 1 / 0; E < s; E++) {
      if (E === v) continue;
      const A = fn(C, F, e[2 * E], e[2 * E + 1]);
      A < X && A > 0 && (M = E, X = A);
    }
    let m = e[2 * M], w = e[2 * M + 1], u = 1 / 0;
    for (let E = 0; E < s; E++) {
      if (E === v || E === M) continue;
      const X = Gr(C, F, m, w, e[2 * E], e[2 * E + 1]);
      X < u && (S = E, u = X);
    }
    let y = e[2 * S], g = e[2 * S + 1];
    if (u === 1 / 0) {
      for (let A = 0; A < s; A++)
        this._dists[A] = e[2 * A] - e[0] || e[2 * A + 1] - e[1];
      ve(this._ids, this._dists, 0, s - 1);
      const E = new Uint32Array(s);
      let X = 0;
      for (let A = 0, D = -1 / 0; A < s; A++) {
        const q = this._ids[A], p = this._dists[q];
        p > D && (E[X++] = q, D = p);
      }
      this.hull = E.subarray(0, X), this.triangles = new Uint32Array(0), this.halfedges = new Uint32Array(0);
      return;
    }
    if (re(C, F, m, w, y, g) < 0) {
      const E = M, X = m, A = w;
      M = S, m = y, w = g, S = E, y = X, g = A;
    }
    const I = Jr(C, F, m, w, y, g);
    this._cx = I.x, this._cy = I.y;
    for (let E = 0; E < s; E++)
      this._dists[E] = fn(e[2 * E], e[2 * E + 1], I.x, I.y);
    ve(this._ids, this._dists, 0, s - 1), this._hullStart = v;
    let B = 3;
    r[v] = t[S] = M, r[M] = t[v] = S, r[S] = t[M] = v, i[v] = 0, i[M] = 1, i[S] = 2, n.fill(-1), n[this._hashKey(C, F)] = v, n[this._hashKey(m, w)] = M, n[this._hashKey(y, g)] = S, this.trianglesLen = 0, this._addTriangle(v, M, S, -1, -1, -1);
    for (let E = 0, X, A; E < this._ids.length; E++) {
      const D = this._ids[E], q = e[2 * D], p = e[2 * D + 1];
      if (E > 0 && Math.abs(q - X) <= Bn && Math.abs(p - A) <= Bn || (X = q, A = p, D === v || D === M || D === S)) continue;
      let _ = 0;
      for (let b = 0, O = this._hashKey(q, p); b < this._hashSize && (_ = n[(O + b) % this._hashSize], !(_ !== -1 && _ !== r[_])); b++)
        ;
      _ = t[_];
      let x = _, T;
      for (; T = r[x], re(q, p, e[2 * x], e[2 * x + 1], e[2 * T], e[2 * T + 1]) >= 0; )
        if (x = T, x === _) {
          x = -1;
          break;
        }
      if (x === -1) continue;
      let P = this._addTriangle(x, D, r[x], -1, -1, i[x]);
      i[D] = this._legalize(P + 2), i[x] = P, B++;
      let R = r[x];
      for (; T = r[R], re(q, p, e[2 * R], e[2 * R + 1], e[2 * T], e[2 * T + 1]) < 0; )
        P = this._addTriangle(R, D, T, i[D], -1, i[R]), i[D] = this._legalize(P + 2), r[R] = R, B--, R = T;
      if (x === _)
        for (; T = t[x], re(q, p, e[2 * T], e[2 * T + 1], e[2 * x], e[2 * x + 1]) < 0; )
          P = this._addTriangle(T, D, x, -1, i[x], i[T]), this._legalize(P + 2), i[T] = P, r[x] = x, B--, x = T;
      this._hullStart = t[D] = x, r[x] = t[R] = D, r[D] = R, n[this._hashKey(q, p)] = D, n[this._hashKey(e[2 * x], e[2 * x + 1])] = x;
    }
    this.hull = new Uint32Array(B);
    for (let E = 0, X = this._hullStart; E < B; E++)
      this.hull[E] = X, X = r[X];
    this.triangles = this._triangles.subarray(0, this.trianglesLen), this.halfedges = this._halfedges.subarray(0, this.trianglesLen);
  }
  _hashKey(e, t) {
    return Math.floor(zr(e - this._cx, t - this._cy) * this._hashSize) % this._hashSize;
  }
  _legalize(e) {
    const { _triangles: t, _halfedges: r, coords: i } = this;
    let n = 0, s = 0;
    for (; ; ) {
      const a = r[e], c = e - e % 3;
      if (s = c + (e + 2) % 3, a === -1) {
        if (n === 0) break;
        e = Ye[--n];
        continue;
      }
      const f = a - a % 3, h = c + (e + 1) % 3, l = f + (a + 2) % 3, d = t[s], v = t[e], M = t[h], S = t[l];
      if (Wr(
        i[2 * d],
        i[2 * d + 1],
        i[2 * v],
        i[2 * v + 1],
        i[2 * M],
        i[2 * M + 1],
        i[2 * S],
        i[2 * S + 1]
      )) {
        t[e] = S, t[a] = d;
        const F = r[l];
        if (F === -1) {
          let w = this._hullStart;
          do {
            if (this._hullTri[w] === l) {
              this._hullTri[w] = e;
              break;
            }
            w = this._hullPrev[w];
          } while (w !== this._hullStart);
        }
        this._link(e, F), this._link(a, r[s]), this._link(s, l);
        const m = f + (a + 1) % 3;
        n < Ye.length && (Ye[n++] = m);
      } else {
        if (n === 0) break;
        e = Ye[--n];
      }
    }
    return s;
  }
  _link(e, t) {
    this._halfedges[e] = t, t !== -1 && (this._halfedges[t] = e);
  }
  // add a new triangle given vertex indices and adjacent half-edge ids
  _addTriangle(e, t, r, i, n, s) {
    const a = this.trianglesLen;
    return this._triangles[a] = e, this._triangles[a + 1] = t, this._triangles[a + 2] = r, this._link(a, i), this._link(a + 1, n), this._link(a + 2, s), this.trianglesLen += 3, a;
  }
}
function zr(o, e) {
  const t = o / (Math.abs(o) + Math.abs(e));
  return (e > 0 ? 3 - t : 1 + t) / 4;
}
function fn(o, e, t, r) {
  const i = o - t, n = e - r;
  return i * i + n * n;
}
function Wr(o, e, t, r, i, n, s, a) {
  const c = o - s, f = e - a, h = t - s, l = r - a, d = i - s, v = n - a, M = c * c + f * f, S = h * h + l * l, C = d * d + v * v;
  return c * (l * C - S * v) - f * (h * C - S * d) + M * (h * v - l * d) < 0;
}
function Gr(o, e, t, r, i, n) {
  const s = t - o, a = r - e, c = i - o, f = n - e, h = s * s + a * a, l = c * c + f * f, d = 0.5 / (s * f - a * c), v = (f * h - a * l) * d, M = (s * l - c * h) * d;
  return v * v + M * M;
}
function Jr(o, e, t, r, i, n) {
  const s = t - o, a = r - e, c = i - o, f = n - e, h = s * s + a * a, l = c * c + f * f, d = 0.5 / (s * f - a * c), v = o + (f * h - a * l) * d, M = e + (s * l - c * h) * d;
  return { x: v, y: M };
}
function ve(o, e, t, r) {
  if (r - t <= 20)
    for (let i = t + 1; i <= r; i++) {
      const n = o[i], s = e[n];
      let a = i - 1;
      for (; a >= t && e[o[a]] > s; ) o[a + 1] = o[a--];
      o[a + 1] = n;
    }
  else {
    const i = t + r >> 1;
    let n = t + 1, s = r;
    Me(o, i, n), e[o[t]] > e[o[r]] && Me(o, t, r), e[o[n]] > e[o[r]] && Me(o, n, r), e[o[t]] > e[o[n]] && Me(o, t, n);
    const a = o[n], c = e[a];
    for (; ; ) {
      do
        n++;
      while (e[o[n]] < c);
      do
        s--;
      while (e[o[s]] > c);
      if (s < n) break;
      Me(o, n, s);
    }
    o[t + 1] = o[s], o[s] = a, r - n + 1 >= s - t ? (ve(o, e, n, r), ve(o, e, t, s - 1)) : (ve(o, e, t, s - 1), ve(o, e, n, r));
  }
}
function Me(o, e, t) {
  const r = o[e];
  o[e] = o[t], o[t] = r;
}
function Kr(o) {
  return o[0];
}
function Qr(o) {
  return o[1];
}
class Hr {
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
    const t = Math.floor(e / this.width), r = e % this.width;
    return this.bs[t] |= 1 << r, this;
  }
  /**
   * Delete a number from the set.
   *
   * @param idx The number to delete. Must be 0 <= idx < len.
   */
  delete(e) {
    const t = Math.floor(e / this.width), r = e % this.width;
    return this.bs[t] &= ~(1 << r), this;
  }
  /**
   * Add or delete a number in the set, depending on the second argument.
   *
   * @param idx The number to add or delete. Must be 0 <= idx < len.
   * @param val If true, add the number, otherwise delete.
   */
  set(e, t) {
    const r = Math.floor(e / this.width), n = 1 << e % this.width;
    return this.bs[r] ^= (-Number(t) ^ this.bs[r]) & n, t;
  }
  /**
   * Whether the number is in the set.
   *
   * @param idx The number to test. Must be 0 <= idx < len.
   */
  has(e) {
    const t = Math.floor(e / this.width), r = e % this.width;
    return (this.bs[t] & 1 << r) !== 0;
  }
  /**
   * Iterate over the numbers that are in the set.
   */
  forEach(e) {
    const t = this.bs.length;
    for (let r = 0; r < t; r++) {
      let i = 0;
      for (; this.bs[r] && i < this.width; )
        this.bs[r] & 1 << i && e(r * this.width + i), i++;
    }
    return this;
  }
}
class On extends Hr {
  constructor(e) {
    super(8, new Uint8Array(Math.ceil(e / 8)).fill(0));
  }
}
function we(o) {
  return o % 3 === 2 ? o - 2 : o + 1;
}
function ie(o) {
  return o % 3 === 0 ? o + 2 : o - 1;
}
function Tn(o, e, t, r, i, n, s, a) {
  const c = re(o, e, i, n, s, a), f = re(t, r, i, n, s, a);
  if (c > 0 && f > 0 || c < 0 && f < 0)
    return !1;
  const h = re(i, n, o, e, t, r), l = re(s, a, o, e, t, r);
  return h > 0 && l > 0 || h < 0 && l < 0 ? !1 : c === 0 && f === 0 && h === 0 && l === 0 ? !(Math.max(i, s) < Math.min(o, t) || Math.max(o, t) < Math.min(i, s) || Math.max(n, a) < Math.min(e, r) || Math.max(e, r) < Math.min(n, a)) : !0;
}
class Zr {
  constructor(e) {
    /**
     * The triangulation object from Delaunator.
     */
    vt(this, "del");
    this.del = e;
  }
}
class Gn extends Zr {
  /**
   * Create a Constrain instance.
   *
   * @param del The triangulation output from Delaunator.
   * @param edges If provided, constrain these edges via constrainAll.
   */
  constructor(t, r) {
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
    const i = 2 ** 32 - 1, n = t.coords.length >> 1, s = t.triangles.length;
    this.vertMap = new Uint32Array(n).fill(i), this.flips = new On(s), this.consd = new On(s);
    for (let a = 0; a < s; a++) {
      const c = t.triangles[a];
      this.vertMap[c] === i && this.updateVert(a);
    }
    r && this.constrainAll(r);
  }
  /**
   * Constrain the triangulation such that there is an edge between p1 and p2.
   */
  constrainOne(t, r) {
    const { triangles: i, halfedges: n } = this.del, s = this.vertMap[t];
    let a = s;
    do {
      const h = i[a], l = we(a);
      if (h === r)
        return this.protect(a);
      const d = ie(a), v = i[d];
      if (v === r)
        return this.protect(l), l;
      if (this.intersectSegments(t, r, v, h)) {
        a = d;
        break;
      }
      a = n[l];
    } while (a !== -1 && a !== s);
    let c = a, f = -1;
    for (; a !== -1; ) {
      const h = n[a], l = ie(a), d = ie(h), v = we(h);
      if (h === -1)
        throw new Error("Constraining edge exited the hull");
      if (this.consd.has(a))
        throw new Error("Edge intersects already constrained edge");
      if (this.isCollinear(t, r, i[a]) || this.isCollinear(t, r, i[h]))
        throw new Error("Constraining edge intersects point");
      if (!this.intersectSegments(
        i[a],
        i[h],
        i[l],
        i[d]
      )) {
        if (f === -1 && (f = a), i[d] === r) {
          if (a === f)
            throw new Error("Infinite loop: non-convex quadrilateral");
          a = f, f = -1;
          continue;
        }
        if (this.intersectSegments(
          t,
          r,
          i[d],
          i[h]
        ))
          a = d;
        else if (this.intersectSegments(
          t,
          r,
          i[v],
          i[d]
        ))
          a = v;
        else if (f === a)
          throw new Error("Infinite loop: no further intersect after non-convex");
        continue;
      }
      if (this.flipDiagonal(a), this.intersectSegments(
        t,
        r,
        i[l],
        i[d]
      ) && (f === -1 && (f = l), f === l))
        throw new Error("Infinite loop: flipped diagonal still intersects");
      i[d] === r ? (c = d, a = f, f = -1) : this.intersectSegments(
        t,
        r,
        i[v],
        i[d]
      ) && (a = v);
    }
    return this.protect(c), this.delaunify(!0), this.findEdge(t, r);
  }
  /**
   * Fix the Delaunay condition.
   */
  delaunify(t = !1) {
    const { halfedges: r } = this.del, i = this.flips, n = this.consd, s = r.length;
    let a;
    do {
      a = 0;
      for (let c = 0; c < s; c++) {
        if (n.has(c))
          continue;
        i.delete(c);
        const f = r[c];
        f !== -1 && (i.delete(f), this.isDelaunay(c) || (this.flipDiagonal(c), a++));
      }
    } while (t && a > 0);
    return this;
  }
  /**
   * Call constrainOne on each edge.
   */
  constrainAll(t) {
    const r = t.length;
    for (let i = 0; i < r; i++) {
      const n = t[i];
      this.constrainOne(n[0], n[1]);
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
  findEdge(t, r) {
    const i = this.vertMap[r], { triangles: n, halfedges: s } = this.del;
    let a = i, c = -1;
    do {
      if (n[a] === t)
        return a;
      c = we(a), a = s[c];
    } while (a !== -1 && a !== i);
    return n[we(c)] === t ? -c : 1 / 0;
  }
  /**
   * Mark an edge as constrained, i.e. should not be touched by `delaunify`.
   */
  protect(t) {
    const r = this.del.halfedges[t], i = this.flips, n = this.consd;
    return i.delete(t), n.add(t), r !== -1 ? (i.delete(r), n.add(r), r) : -t;
  }
  /**
   * Mark an edge as flipped unless constrained.
   */
  markFlip(t) {
    const r = this.del.halfedges, i = this.flips;
    if (this.consd.has(t))
      return !1;
    const s = r[t];
    return s !== -1 && (i.add(t), i.add(s)), !0;
  }
  /**
   * Flip the edge shared by two triangles.
   */
  flipDiagonal(t) {
    const { triangles: r, halfedges: i } = this.del, n = this.flips, s = this.consd, a = i[t], c = ie(t), f = we(t), h = ie(a), l = we(a), d = i[c], v = i[h];
    if (s.has(t))
      throw new Error("Trying to flip a constrained edge");
    return r[t] = r[h], i[t] = v, n.set(t, n.has(h)) || s.set(t, s.has(h)), v !== -1 && (i[v] = t), i[c] = h, r[a] = r[c], i[a] = d, n.set(a, n.has(c)) || s.set(a, s.has(c)), d !== -1 && (i[d] = a), i[h] = c, this.markFlip(t), this.markFlip(f), this.markFlip(a), this.markFlip(l), n.add(c), s.delete(c), n.add(h), s.delete(h), this.updateVert(t), this.updateVert(f), this.updateVert(a), this.updateVert(l), c;
  }
  /**
   * Whether point p1, p2, and p are collinear.
   */
  isCollinear(t, r, i) {
    const n = this.del.coords;
    return re(
      n[t * 2],
      n[t * 2 + 1],
      n[r * 2],
      n[r * 2 + 1],
      n[i * 2],
      n[i * 2 + 1]
    ) === 0;
  }
  /**
   * Whether the triangle formed by p1, p2, p3 keeps px outside the circumcircle.
   */
  inCircle(t, r, i, n) {
    const s = this.del.coords;
    return mr(
      s[t * 2],
      s[t * 2 + 1],
      s[r * 2],
      s[r * 2 + 1],
      s[i * 2],
      s[i * 2 + 1],
      s[n * 2],
      s[n * 2 + 1]
    ) < 0;
  }
  /**
   * Whether the triangles sharing edg conform to the Delaunay condition.
   */
  isDelaunay(t) {
    const { triangles: r, halfedges: i } = this.del, n = i[t];
    if (n === -1)
      return !0;
    const s = r[ie(t)], a = r[t], c = r[we(t)], f = r[ie(n)];
    return !this.inCircle(s, a, c, f);
  }
  /**
   * Update the vertex -> incoming edge map.
   */
  updateVert(t) {
    const { triangles: r, halfedges: i } = this.del, n = this.vertMap, s = r[t];
    let a = ie(t), c = i[a];
    for (; c !== -1 && c !== t; )
      a = ie(c), c = i[a];
    return n[s] = a, a;
  }
  /**
   * Whether the segments between vertices intersect.
   */
  intersectSegments(t, r, i, n) {
    const s = this.del.coords;
    return t === i || t === n || r === i || r === n ? !1 : Tn(
      s[t * 2],
      s[t * 2 + 1],
      s[r * 2],
      s[r * 2 + 1],
      s[i * 2],
      s[i * 2 + 1],
      s[n * 2],
      s[n * 2 + 1]
    );
  }
}
vt(Gn, "intersectSegments", Tn);
function Le(o, e, t) {
  if (e || (e = []), typeof o != "object" || o.type !== "FeatureCollection")
    throw "Argument points must be FeatureCollection";
  if (!Array.isArray(e)) throw "Argument points must be Array of Array";
  const r = o.features.map(
    (c) => c.geometry.coordinates
  ), i = un.from(r);
  let n;
  const s = [];
  i.triangles.length !== 0 && e.length !== 0 && (n = new Gn(i), n.constrainAll(e));
  for (let c = 0; c < i.triangles.length; c += 3)
    s.push([i.triangles[c], i.triangles[c + 1], i.triangles[c + 2]]);
  const a = ["a", "b", "c"];
  return Qt(
    s.map((c) => {
      const f = {}, h = c.map((l, d) => {
        const v = o.features[l], M = v.geometry.coordinates, S = [M[0], M[1]];
        return M.length === 3 ? S[2] = M[2] : f[a[d]] = v.properties[t], S;
      });
      return h[3] = h[0], Be([h], f);
    })
  );
}
function ti(o, e) {
  const t = [[], [], [], []], r = [];
  return Object.keys(o).forEach((i) => {
    const n = o[i], s = n.forw, a = n.bakw, c = [
      s[0] - e.forw[0],
      s[1] - e.forw[1]
    ], f = [
      a[0] - e.bakw[0],
      e.bakw[1] - a[1]
    ], h = { forw: c, bakw: f };
    if (r.push(h), c[0] === 0 || c[1] === 0)
      return;
    let l = 0;
    c[0] > 0 && (l += 1), c[1] > 0 && (l += 2), t[l].push(h);
  }), { perQuad: t, aggregate: r };
}
function ei(o) {
  let e = 1 / 0, t = 0, r = 0;
  return o.forEach((i) => {
    const { forw: n, bakw: s } = i, a = Math.hypot(n[0], n[1]), c = Math.hypot(s[0], s[1]);
    if (c === 0) return;
    const f = a / c, h = Math.atan2(n[0], n[1]) - Math.atan2(s[0], s[1]);
    e = Math.min(e, f), t += Math.cos(h), r += Math.sin(h);
  }), isFinite(e) ? [e, Math.atan2(r, t)] : [1, 0];
}
function ni(o, e, t) {
  const { perQuad: r, aggregate: i } = ti(o, e), n = r.every((c) => c.length > 0), a = (t === "birdeye" ? n ? r : [i] : [i]).map((c) => ei(c));
  return a.length === 1 ? [a[0], a[0], a[0], a[0]] : a;
}
function ri(o, e) {
  let t = 0;
  return o[0] > e[0] && (t += 1), o[1] > e[1] && (t += 2), t;
}
function ii(o, e, t) {
  const r = [
    o[0] - e.forw[0],
    o[1] - e.forw[1]
  ], n = Math.sqrt(r[0] ** 2 + r[1] ** 2) / t[0], s = Math.atan2(r[0], r[1]) - t[1];
  return [
    e.bakw[0] + n * Math.sin(s),
    e.bakw[1] - n * Math.cos(s)
  ];
}
function oi(o, e, t, r) {
  const i = e[0] - o[0], n = e[1] - o[1];
  if (Math.abs(i) < 1e-12 && Math.abs(n) < 1e-12) return null;
  const s = r[0] - t[0], a = r[1] - t[1], c = t[0] - o[0], f = t[1] - o[1], h = i * a - n * s;
  if (Math.abs(h) < 1e-12) return null;
  const l = (c * a - f * s) / h, d = (c * n - f * i) / h;
  return l <= 1e-10 || d < -1e-10 || d > 1 + 1e-10 ? null : { t: l, point: [o[0] + l * i, o[1] + l * n] };
}
function si(o, e, t) {
  const r = t.length;
  let i = -1 / 0, n = null;
  for (let s = 0; s < r; s++) {
    const a = (s + 1) % r, c = oi(
      o,
      e,
      t[s].bakw,
      t[a].bakw
    );
    c && c.t > i && (i = c.t, n = c.point);
  }
  return n;
}
function Nn(o, e) {
  const r = Math.atan2(o[0] - e[0], o[1] - e[1]) * (180 / Math.PI);
  return r < 0 ? r + 360 : r;
}
function Xn(o, e, t, r, i, n) {
  const s = e[0] - o[0], a = e[1] - o[1];
  if (s === 0 && a === 0) return null;
  const c = [];
  if (s !== 0)
    for (const h of [t, r]) {
      const l = (h - o[0]) / s;
      if (l > 0) {
        const d = o[1] + l * a;
        d >= i && d <= n && c.push({ t: l, x: h, y: d });
      }
    }
  if (a !== 0)
    for (const h of [i, n]) {
      const l = (h - o[1]) / a;
      if (l > 0) {
        const d = o[0] + l * s;
        d >= t && d <= r && c.push({ t: l, x: d, y: h });
      }
    }
  if (c.length === 0) return null;
  c.sort((h, l) => h.t - l.t);
  const f = c[0];
  return [f.x, f.y];
}
function Cn(o, e, t) {
  const r = o.length, i = new Array(r).fill(1);
  for (const n of e)
    for (let s = 0; s < r; s++) {
      const a = (s + 1) % r, c = mn([o[s].bakw, o[a].bakw]), f = mn([t.bakw, n.bakw]), h = Er(c, f);
      if (h.features.length > 0 && h.features[0].geometry) {
        const l = h.features[0], d = Math.sqrt(
          Math.pow(n.bakw[0] - t.bakw[0], 2) + Math.pow(n.bakw[1] - t.bakw[1], 2)
        ), v = Math.sqrt(
          Math.pow(l.geometry.coordinates[0] - t.bakw[0], 2) + Math.pow(l.geometry.coordinates[1] - t.bakw[1], 2)
        ), M = d / v;
        M > i[s] && (i[s] = M), M > i[a] && (i[a] = M);
      }
    }
  o.forEach((n, s) => {
    const a = i[s];
    n.bakw = [
      (n.bakw[0] - t.bakw[0]) * a + t.bakw[0],
      (n.bakw[1] - t.bakw[1]) * a + t.bakw[1]
    ];
  });
}
function Jn(o, e, t) {
  const { convexBuf: r, centroid: i, allGcps: n, minx: s, maxx: a, miny: c, maxy: f } = o, h = ni(r, i, e), d = [
    [s, c],
    [a, c],
    [a, f],
    [s, f]
  ].map((g) => ({
    forw: g,
    bakw: ii(
      g,
      i,
      h[ri(g, i.forw)]
    )
  }));
  if (d.sort(
    (g, I) => Math.atan2(g.forw[0] - i.forw[0], g.forw[1] - i.forw[1]) - Math.atan2(I.forw[0] - i.forw[0], I.forw[1] - i.forw[1])
  ), Cn(d, n, i), !t) return d;
  const v = 4, M = d.map(
    (g) => Math.atan2(g.forw[0] - i.forw[0], g.forw[1] - i.forw[1])
  ), S = d.map(
    (g) => Math.atan2(
      g.bakw[0] - i.bakw[0],
      -(g.bakw[1] - i.bakw[1])
    )
  );
  function C(g) {
    for (let I = 0; I < v; I++) {
      const B = (I + 1) % v, E = M[I], X = I < v - 1 ? M[B] : M[B] + 2 * Math.PI;
      let A = g;
      for (; A < E; ) A += 2 * Math.PI;
      for (; A >= E + 2 * Math.PI; ) A -= 2 * Math.PI;
      if (A >= E && A < X)
        return { i: I, j: B, frac: (A - E) / (X - E) };
    }
    return { i: 0, j: 1, frac: 0 };
  }
  function F(g) {
    const { i: I, j: B, frac: E } = C(g), X = S[I];
    let D = S[B] - X;
    for (; D > Math.PI; ) D -= 2 * Math.PI;
    for (; D < -Math.PI; ) D += 2 * Math.PI;
    return X + E * D;
  }
  const m = new Set(
    d.map(
      (g) => Math.floor(Nn(g.forw, i.forw) / 10) % 36
    )
  ), w = n.map((g) => ({
    forw: g.forw,
    bakw: g.bakw,
    angleDeg: Nn(g.forw, i.forw),
    forwDist: Math.hypot(g.forw[0] - i.forw[0], g.forw[1] - i.forw[1])
  })), u = [];
  for (let g = 0; g < 36; g++) {
    if (m.has(g)) continue;
    const I = g * 10, B = w.filter(
      (_) => _.angleDeg >= I && _.angleDeg < I + 10
    );
    let E = null;
    if (B.length > 0) {
      const _ = B.reduce((x, T) => T.forwDist > x.forwDist ? T : x);
      E = Xn(i.forw, _.forw, s, a, c, f);
    }
    if (!E) {
      const _ = (I + 5) % 360 * (Math.PI / 180), x = [
        i.forw[0] + Math.sin(_),
        i.forw[1] + Math.cos(_)
      ];
      E = Xn(i.forw, x, s, a, c, f);
    }
    if (!E) continue;
    const X = [E[0] - i.forw[0], E[1] - i.forw[1]], A = Math.atan2(X[0], X[1]), D = F(A), q = [
      i.bakw[0] + Math.sin(D),
      i.bakw[1] - Math.cos(D)
    ], p = si(i.bakw, q, d);
    p && u.push({ forw: E, bakw: p });
  }
  const y = [...d, ...u];
  return y.sort(
    (g, I) => Math.atan2(g.forw[0] - i.forw[0], g.forw[1] - i.forw[1]) - Math.atan2(I.forw[0] - i.forw[0], I.forw[1] - i.forw[1])
  ), Cn(y, n, i), y;
}
function ai(o, e = !1) {
  return Jn(o, "plain", e);
}
function ci(o, e = !1) {
  return Jn(o, "birdeye", e);
}
function fi(o) {
  const t = new hi(o).findSegmentIntersections(), r = Hn(t), i = /* @__PURE__ */ new Map();
  return r.forEach((n) => {
    i.set(`${n.x}:${n.y}`, n);
  }), Array.from(i.values()).map(
    (n) => le([n.x, n.y])
  );
}
class hi {
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
    const t = [], r = [], i = e.map((n) => {
      const s = n ? n.length : 0;
      for (let a = 0; a < s; a++)
        t.push(n[a][0]), r.push(n[a][1]);
      return s;
    });
    this.initXYData(i, t, r);
  }
  initXYData(e, t, r) {
    const i = e.length;
    this._xx = new Float64Array(t), this._yy = new Float64Array(r), this._nn = new Uint32Array(e), this._zz = null, this._zlimit = 0, this._filteredArcIter = null, this._ii = new Uint32Array(i);
    let n = 0;
    for (let s = 0; s < i; s++)
      this._ii[s] = n, n += e[s];
    (n != this._xx.length || this._xx.length != this._yy.length) && pn("ArcCollection#initXYData() Counting error"), this.initBounds(), this._arcIter = new Bi(this._xx, this._yy);
  }
  initBounds() {
    const e = this.calcArcBounds_(this._xx, this._yy, this._nn);
    this._bb = e.bb, this._allBounds = e.bounds;
  }
  /**
   * データの境界を計算
   * @returns バウンディングボックス情報
   */
  calcArcBounds_(e, t, r) {
    const i = r.length, n = new Float64Array(i * 4), s = new Pe();
    let a = 0, c, f, h;
    for (let l = 0; l < i; l++)
      c = r[l], c > 0 && (f = l * 4, h = Oi(e, t, a, c), n[f++] = h[0], n[f++] = h[1], n[f++] = h[2], n[f] = h[3], a += c, s.mergeBounds(h));
    return {
      bb: n,
      bounds: s
    };
  }
  getBounds() {
    return this._allBounds ? this._allBounds.clone() : new Pe();
  }
  // @cb function(i, j, xx, yy)
  forEachSegment(e) {
    let t = 0;
    for (let r = 0, i = this.size(); r < i; r++)
      t += this.forEachArcSegment(r, e);
    return t;
  }
  size() {
    return this._ii && this._ii.length || 0;
  }
  // @cb function(i, j, xx, yy)
  forEachArcSegment(e, t) {
    const r = e >= 0, i = r ? e : ~e, n = this.getRetainedInterval(), s = this._nn[i], a = r ? 1 : -1;
    let c = r ? this._ii[i] : this._ii[i] + s - 1, f = c, h = 0;
    for (let l = 1; l < s; l++)
      f += a, (n === 0 || this._zz[f] >= n) && (t(c, f, this._xx, this._yy), c = f, h++);
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
    const r = this.forEachSegment(
      (i, n, s, a) => {
        e += Math.abs(s[i] - s[n]), t += Math.abs(a[i] - a[n]);
      }
    );
    return [e / r || 0, t / r || 0];
  }
  /**
   * 交差判定のためのストライプ数を計算
   * 線分の平均長さに基づいて最適な分割数を決定
   */
  calcSegmentIntersectionStripeCount() {
    const e = this.getBounds().height(), t = this.getAvgSegment2()[1];
    let r = 1;
    return t > 0 && e > 0 && (r = Math.ceil(e / t / 20)), r || 1;
  }
  /**
   * 線分の交差を検出
   * ストライプ分割による効率的な判定を実装
   *
   * @returns 検出された交差点の配列
   */
  findSegmentIntersections() {
    const e = this.getBounds(), t = e.ymin || 0, r = (e.ymax || 0) - t, i = this.calcSegmentIntersectionStripeCount(), n = new Uint32Array(i), s = i > 1 ? (S) => Math.floor((i - 1) * (S - t) / r) : () => 0;
    let a, c;
    this.forEachSegment(
      (S, C, F, m) => {
        let w = s(m[S]);
        const u = s(m[C]);
        for (; n[w] = n[w] + 2, w != u; )
          w += u > w ? 1 : -1;
      }
    );
    const f = this.getUint32Array(pi(n));
    let h = 0;
    const l = [];
    di(n, (S) => {
      const C = h;
      h += S, l.push(f.subarray(C, h));
    }), mi(n, 0), this.forEachSegment(
      (S, C, F, m) => {
        let w = s(m[S]);
        const u = s(m[C]);
        let y, g;
        for (; y = n[w], n[w] = y + 2, g = l[w], g[y] = S, g[y + 1] = C, w != u; )
          w += u > w ? 1 : -1;
      }
    );
    const d = this.getVertexData(), v = [];
    let M;
    for (a = 0; a < i; a++)
      if (d.xx && d.yy)
        for (M = gi(l[a], d.xx, d.yy), c = 0; c < M.length; c++)
          v.push(M[c]);
    return Hn(v);
  }
}
function pn(...o) {
  const e = o.join(" ");
  throw new Error(e);
}
function dn(o) {
  return o ? ui(o) ? !0 : li(o) ? !1 : o.length === 0 ? !0 : o.length > 0 : !1;
}
function li(o) {
  return o != null && o.toString === String.prototype.toString;
}
function ui(o) {
  return Array.isArray(o);
}
function pi(o, e) {
  dn(o) || pn("utils.sum() expects an array, received:", o);
  let t = 0, r;
  for (let i = 0, n = o.length; i < n; i++)
    r = o[i], r && (t += r);
  return t;
}
function di(o, e, t) {
  if (!dn(o))
    throw new Error(`#forEach() takes an array-like argument. ${o}`);
  for (let r = 0, i = o.length; r < i; r++)
    e.call(t, o[r], r);
}
function mi(o, e) {
  for (let t = 0, r = o.length; t < r; t++)
    o[t] = e;
  return o;
}
function gi(o, e, t) {
  const r = o.length - 2, i = [];
  let n, s, a, c, f, h, l, d, v, M, S, C, F, m, w, u, y;
  for (Ei(e, o), u = 0; u < r; ) {
    for (n = o[u], s = o[u + 1], f = e[n], h = e[s], v = t[n], M = t[s], y = u; y < r && (y += 2, a = o[y], l = e[a], !(h < l)); ) {
      if (S = t[a], c = o[y + 1], d = e[c], C = t[c], v >= S) {
        if (v > C && M > S && M > C) continue;
      } else if (v < C && M < S && M < C) continue;
      n == a || n == c || s == a || s == c || (F = wi(
        f,
        v,
        h,
        M,
        l,
        S,
        d,
        C
      ), F && (m = [n, s], w = [a, c], i.push(Rn(F, m, w, e, t)), F.length == 4 && i.push(
        Rn(F.slice(2), m, w, e, t)
      )));
    }
    u += 2;
  }
  return i;
}
function wi(o, e, t, r, i, n, s, a) {
  const c = yi(o, e, t, r, i, n, s, a);
  let f = null;
  return c && (f = vi(o, e, t, r, i, n, s, a), f ? ki(o, e, t, r, i, n, s, a) && (f = null) : f = Si(o, e, t, r, i, n, s, a)), f;
}
function yi(o, e, t, r, i, n, s, a) {
  return Ee(o, e, t, r, i, n) * Ee(o, e, t, r, s, a) <= 0 && Ee(i, n, s, a, o, e) * Ee(i, n, s, a, t, r) <= 0;
}
function Ee(o, e, t, r, i, n) {
  return Kn(o - i, e - n, t - i, r - n);
}
function Kn(o, e, t, r) {
  return o * r - e * t;
}
function vi(o, e, t, r, i, n, s, a) {
  let c = $e(o, e, t, r, i, n, s, a), f;
  return c && (f = xi(c[0], c[1], o, e, t, r, i, n, s, a), f == 1 ? c = $e(t, r, o, e, i, n, s, a) : f == 2 ? c = $e(i, n, s, a, o, e, t, r) : f == 3 && (c = $e(s, a, i, n, o, e, t, r))), c && Mi(c, o, e, t, r, i, n, s, a), c;
}
function $e(o, e, t, r, i, n, s, a) {
  const c = Kn(t - o, r - e, s - i, a - n), f = 1e-18;
  let h;
  if (c === 0) return null;
  const l = Ee(i, n, s, a, o, e) / c;
  return c <= f && c >= -f ? h = bi(o, e, t, r, i, n, s, a) : h = [o + l * (t - o), e + l * (r - e)], h;
}
function bi(o, e, t, r, i, n, s, a) {
  let c = null;
  return !oe(o, i, s) && !oe(e, n, a) ? c = [o, e] : !oe(t, i, s) && !oe(r, n, a) ? c = [t, r] : !oe(i, o, t) && !oe(n, e, r) ? c = [i, n] : !oe(s, o, t) && !oe(a, e, r) && (c = [s, a]), c;
}
function oe(o, e, t) {
  let r;
  return e < t ? r = o < e || o > t : e > t ? r = o > e || o < t : r = o != e, r;
}
function xi(o, e, ...t) {
  let r = -1, i = 1 / 0, n;
  for (let s = 0, a = 0, c = t.length; a < c; s++, a += 2)
    n = _i(o, e, t[a], t[a + 1]), n < i && (i = n, r = s);
  return r;
}
function _i(o, e, t, r) {
  const i = o - t, n = e - r;
  return i * i + n * n;
}
function Mi(o, e, t, r, i, n, s, a, c) {
  let f = o[0], h = o[1];
  f = je(f, e, r), f = je(f, n, a), h = je(h, t, i), h = je(h, s, c), o[0] = f, o[1] = h;
}
function je(o, e, t) {
  let r;
  return oe(o, e, t) && (r = Math.abs(o - e) < Math.abs(o - t) ? e : t, o = r), o;
}
function Si(o, e, t, r, i, n, s, a) {
  const c = Math.min(o, t, i, s), f = Math.max(o, t, i, s), h = Math.min(e, r, n, a), l = Math.max(e, r, n, a), d = l - h > f - c;
  let v = [];
  return (d ? he(e, h, l) : he(o, c, f)) && v.push(o, e), (d ? he(r, h, l) : he(t, c, f)) && v.push(t, r), (d ? he(n, h, l) : he(i, c, f)) && v.push(i, n), (d ? he(a, h, l) : he(s, c, f)) && v.push(s, a), (v.length != 2 && v.length != 4 || v.length == 4 && v[0] == v[2] && v[1] == v[3]) && (v = null), v;
}
function ki(o, e, t, r, i, n, s, a) {
  return o == i && e == n || o == s && e == a || t == i && r == n || t == s && r == a;
}
function he(o, e, t) {
  return o > e && o < t;
}
function Ei(o, e) {
  Ai(o, e), Qn(o, e, 0, e.length - 2);
}
function Ai(o, e) {
  for (let t = 0, r = e.length; t < r; t += 2)
    o[e[t]] > o[e[t + 1]] && Ii(e, t, t + 1);
}
function Ii(o, e, t) {
  const r = o[e];
  o[e] = o[t], o[t] = r;
}
function Qn(o, e, t, r) {
  let i = t, n = r, s, a;
  for (; i < r; ) {
    for (s = o[e[t + r >> 2 << 1]]; i <= n; ) {
      for (; o[e[i]] < s; ) i += 2;
      for (; o[e[n]] > s; ) n -= 2;
      i <= n && (a = e[i], e[i] = e[n], e[n] = a, a = e[i + 1], e[i + 1] = e[n + 1], e[n + 1] = a, i += 2, n -= 2);
    }
    if (n - t < 40 ? Dn(o, e, t, n) : Qn(o, e, t, n), r - i < 40) {
      Dn(o, e, i, r);
      return;
    }
    t = i, n = r;
  }
}
function Dn(o, e, t, r) {
  let i, n;
  for (let s = t + 2; s <= r; s += 2) {
    i = e[s], n = e[s + 1];
    let a;
    for (a = s - 2; a >= t && o[i] < o[e[a]]; a -= 2)
      e[a + 2] = e[a], e[a + 3] = e[a + 1];
    e[a + 2] = i, e[a + 3] = n;
  }
}
function Rn(o, e, t, r, i) {
  const n = o[0], s = o[1];
  e = Fn(n, s, e[0], e[1], r, i), t = Fn(n, s, t[0], t[1], r, i);
  const a = e[0] < t[0] ? e : t, c = a == e ? t : e;
  return { x: n, y: s, a, b: c };
}
function Fn(o, e, t, r, i, n) {
  let s = t < r ? t : r, a = s === t ? r : t;
  return i[s] == o && n[s] == e ? a = s : i[a] == o && n[a] == e && (s = a), [s, a];
}
function Hn(o) {
  const e = {};
  return o.filter((t) => {
    const r = Pi(t);
    return r in e ? !1 : (e[r] = !0, !0);
  });
}
function Pi(o) {
  return `${o.a.join(",")};${o.b.join(",")}`;
}
class Bi {
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
function Oi(o, e, t, r) {
  let i = t | 0;
  const n = isNaN(r) ? o.length - i : r + i;
  let s, a, c, f, h, l;
  if (n > 0)
    c = h = o[i], f = l = e[i];
  else return [void 0, void 0, void 0, void 0];
  for (i++; i < n; i++)
    s = o[i], a = e[i], s < c && (c = s), s > h && (h = s), a < f && (f = a), a > l && (l = a);
  return [c, f, h, l];
}
class Pe {
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
    return new Pe(
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
  setBounds(e, t, r, i) {
    let n, s, a, c;
    if (arguments.length == 1)
      if (dn(e)) {
        const f = e;
        n = f[0], s = f[1], a = f[2], c = f[3];
      } else {
        const f = e;
        n = f.xmin, s = f.ymin, a = f.xmax, c = f.ymax;
      }
    else
      n = e, s = t, a = r, c = i;
    return this.xmin = n, this.ymin = s, this.xmax = a, this.ymax = c, (n > a || s > c) && this.update(), this;
  }
  update() {
    let e;
    this.xmin > this.xmax && (e = this.xmin, this.xmin = this.xmax, this.xmax = e), this.ymin > this.ymax && (e = this.ymin, this.ymin = this.ymax, this.ymax = e);
  }
  mergeBounds(e, ...t) {
    let r, i, n, s;
    return e instanceof Pe ? (r = e.xmin, i = e.ymin, n = e.xmax, s = e.ymax) : t.length == 3 ? (r = e, i = t[0], n = t[1], s = t[2]) : e.length == 4 ? (r = e[0], i = e[1], n = e[2], s = e[3]) : pn("Bounds#mergeBounds() invalid argument:", e), this.xmin === void 0 ? this.setBounds(r, i, n, s) : (r < this.xmin && (this.xmin = r), i < this.ymin && (this.ymin = i), n > this.xmax && (this.xmax = n), s > this.ymax && (this.ymax = s)), this;
  }
}
function We(o) {
  const e = ["a", "b", "c"].map(
    (t) => o.properties[t].index
  );
  return [
    [0, 1],
    [0, 2],
    [1, 2],
    [0, 1, 2]
  ].map(
    (t) => t.map((r) => e[r]).sort().join("-")
  ).sort();
}
function Zn(o, e, t) {
  const r = We(e.forw), i = We(e.bakw);
  if (JSON.stringify(r) != JSON.stringify(i))
    throw `${JSON.stringify(e, null, 2)}
${JSON.stringify(
      r
    )}
${JSON.stringify(i)}`;
  for (let n = 0; n < r.length; n++) {
    const s = r[n];
    o[s] || (o[s] = []), o[s].push(e);
  }
  t && (t.forw.features.push(e.forw), t.bakw.features.push(e.bakw));
}
function Yn(o, e, t) {
  const r = We(e.forw), i = We(e.bakw);
  if (JSON.stringify(r) != JSON.stringify(i))
    throw `${JSON.stringify(e, null, 2)}
${JSON.stringify(r)}
${JSON.stringify(i)}`;
  if (r.forEach((n) => {
    const s = o[n];
    if (!s) return;
    const a = s.filter((c) => c !== e);
    a.length === 0 ? delete o[n] : o[n] = a;
  }), t) {
    const n = (s, a) => {
      !s || !a || (s.features = s.features.filter((c) => c !== a));
    };
    n(t.forw, e.forw), n(t.bakw, e.bakw);
  }
}
function qe(o, e, t) {
  return le(o, { target: { geom: e, index: t } });
}
function Ve(o) {
  return le(o.properties.target.geom, {
    target: {
      geom: o.geometry.coordinates,
      index: o.properties.target.index
    }
  });
}
function Ln(o, e) {
  const t = o.length, r = e.geometry.coordinates;
  return Array.from({ length: t }, (i, n) => n).map((i) => {
    const n = (i + 1) % t, s = o[i], a = o[n], c = s.geometry.coordinates, f = Math.atan2(
      c[0] - r[0],
      c[1] - r[1]
    ), h = [e, s, a, e].map(
      (v) => v.geometry.coordinates
    ), l = {
      a: {
        geom: e.properties.target.geom,
        index: e.properties.target.index
      },
      b: {
        geom: s.properties.target.geom,
        index: s.properties.target.index
      },
      c: {
        geom: a.properties.target.geom,
        index: a.properties.target.index
      }
    }, d = Qt([
      Be([h], l)
    ]);
    return [f, d];
  }).reduce(
    (i, n) => (i[0].push(n[0]), i[1].push(n[1]), i),
    [[], []]
  );
}
function Ti(o) {
  const { tins: e, targets: t, includeReciprocals: r, numBoundaryVertices: i = 4 } = o, n = {};
  t.forEach((a) => {
    const c = e[a];
    if (!c || !c.features) return;
    n[a] = {};
    const f = {};
    c.features.forEach((h) => {
      const l = ["a", "b", "c"];
      for (let d = 0; d < 3; d++) {
        const v = (d + 1) % 3, M = l[d], S = l[v], C = h.properties[M].index, F = h.properties[S].index, m = [C, F].sort().join("-");
        if (f[m]) continue;
        f[m] = !0;
        const w = h.geometry.coordinates[0][d], u = h.geometry.coordinates[0][v], y = h.properties[M].geom, g = h.properties[S].geom, I = Math.sqrt(
          Math.pow(y[0] - g[0], 2) + Math.pow(y[1] - g[1], 2)
        ) / Math.sqrt(
          Math.pow(w[0] - u[0], 2) + Math.pow(w[1] - u[1], 2)
        ), B = n[a];
        B[`${C}:${m}`] = I, B[`${F}:${m}`] = I;
      }
    });
  });
  const s = {};
  return r && (s.bakw = {}), t.forEach((a) => {
    const c = n[a];
    if (s[a] = {}, !c)
      return;
    const f = {};
    Object.keys(c).forEach((l) => {
      const [d] = l.split(":");
      f[d] || (f[d] = []), f[d].push(c[l]);
    }), Object.keys(f).forEach((l) => {
      const d = f[l], v = d.reduce((M, S) => M + S, 0) / d.length;
      s[a][l] = v, r && s.bakw && (s.bakw[l] = 1 / v);
    });
    let h = 0;
    for (let l = 0; l < i; l++) {
      const d = `b${l}`, v = s[a][d] || 0;
      h += v;
    }
    s[a].c = h / i, r && s.bakw && (s.bakw.c = 1 / s[a].c);
  }), s;
}
function Ue(o, e = 1e-6) {
  const [t, r] = o[0], [i, n] = o[1], [s, a] = o[2];
  return Math.abs((i - t) * (a - r) - (s - t) * (n - r)) < e;
}
function Ni(o, e) {
  const t = o.split("-");
  if (t.length !== 2 || !t.every((n) => /^-?\d+$/.test(n))) return !1;
  const [r, i] = t.map((n) => parseInt(n, 10)).sort((n, s) => n - s);
  return e.some((n) => {
    if (n.length !== 2) return !1;
    const s = n.map((c) => parseInt(`${c}`, 10));
    if (s.some((c) => Number.isNaN(c))) return !1;
    const a = s.sort((c, f) => c - f);
    return a[0] === r && a[1] === i;
  });
}
function Ae(o) {
  return ["a", "b", "c"].map((e, t) => ({
    prop: o.properties[e],
    geom: o.geometry.coordinates[0][t]
  }));
}
const Xi = 10;
function Ci(o, e, t, r, i, n) {
  if (!o && !e) return !1;
  const s = o ? 0 : 1, a = 1 - s, c = t[s], f = t[a];
  if (!c || !f) return !1;
  const h = Vt(f.geom);
  let l = !1, d = !1;
  for (let v = 0; v <= 1; v++) {
    const M = r[v];
    if (!M) continue;
    const S = [String(M.prop.index), String(c.prop.index)].sort().join("-"), C = i[S];
    if (!C || C.length < 2) continue;
    const F = C.find(
      (A) => A.bakw !== n[s].bakw
    );
    if (!F) continue;
    const w = Ae(F.bakw).find(
      (A) => String(A.prop.index) !== String(M.prop.index) && String(A.prop.index) !== String(c.prop.index)
    );
    if (!w) continue;
    l = !0;
    const u = Vt(w.geom), y = Vt(M.geom), g = Vt(c.geom), I = g[0] - y[0], B = g[1] - y[1], E = I * (h[1] - y[1]) - B * (h[0] - y[0]), X = I * (u[1] - y[1]) - B * (u[0] - y[0]);
    if (E * X > 0) {
      d = !0;
      break;
    }
  }
  return l && !d;
}
function Di(o, e, t, r) {
  if (!o && !e) return !1;
  if (t[0] && t[1] && r[0] && r[1]) {
    const i = r.map((h) => Vt(h.geom)), n = t.map((h) => Vt(h.geom)), s = i[1][0] - i[0][0], a = i[1][1] - i[0][1], c = s * (n[0][1] - i[0][1]) - a * (n[0][0] - i[0][0]), f = s * (n[1][1] - i[0][1]) - a * (n[1][0] - i[0][0]);
    return c * f < 0;
  }
  return !1;
}
function Ri(o, e, t) {
  const r = /* @__PURE__ */ new Set();
  let i = !1;
  for (let n = 0; n < Xi; n++) {
    let s = !1;
    for (const a of Object.keys(e)) {
      if (r.has(a)) continue;
      r.add(a);
      const c = e[a];
      if (!c || c.length < 2) continue;
      const f = a.split("-");
      if (f.length !== 2 || Ni(a, t)) continue;
      const h = Ae(c[0].bakw), l = Ae(c[1].bakw), d = Ae(c[0].forw), v = Ae(c[1].forw), M = f.map(
        (P) => h.find((R) => `${R.prop.index}` === P) || l.find((R) => `${R.prop.index}` === P)
      ), S = f.map(
        (P) => d.find((R) => `${R.prop.index}` === P) || v.find((R) => `${R.prop.index}` === P)
      );
      if (M.some((P) => !P) || S.some((P) => !P))
        continue;
      const C = [h, l].map(
        (P) => P.find((R) => !f.includes(`${R.prop.index}`))
      ), F = [d, v].map(
        (P) => P.find((R) => !f.includes(`${R.prop.index}`))
      );
      if (C.some((P) => !P) || F.some((P) => !P))
        continue;
      const m = c[0].bakw.geometry.coordinates[0].slice(0, 3).map((P) => Vt(P)), w = c[1].bakw.geometry.coordinates[0].slice(0, 3).map((P) => Vt(P)), u = c[0].forw.geometry.coordinates[0].slice(0, 3).map((P) => Vt(P)), y = c[1].forw.geometry.coordinates[0].slice(0, 3).map((P) => Vt(P)), g = Ue(m), I = Ue(w), B = Ue(u), E = Ue(y), X = Ci(
        g,
        I,
        C,
        M,
        e,
        c
      ), A = Di(
        B,
        E,
        C,
        M
      );
      if (!(X || A || $n(
        Vt(C[0].geom),
        w
      ) || $n(
        Vt(C[1].geom),
        m
      )))
        continue;
      const q = S.map(
        (P) => Vt(P.geom)
      ), p = F.map(
        (P) => Vt(P.geom)
      ), _ = Fi([
        ...q,
        ...p
      ]), x = Yi(_), T = jn(
        q[0],
        q[1],
        p[0]
      ) + jn(
        q[0],
        q[1],
        p[1]
      );
      hn(x, T) && (Yn(e, c[0], o), Yn(e, c[1], o), M.forEach((P) => {
        if (!P) return;
        const R = [
          P.geom,
          C[0].geom,
          C[1].geom,
          P.geom
        ], b = {
          a: P.prop,
          b: C[0].prop,
          c: C[1].prop
        }, O = Be([R], b), L = Ut.counterTri(O);
        Zn(e, {
          forw: L,
          bakw: O
        }, o);
      }), s = !0, i = !0);
    }
    if (!s) break;
  }
  return i;
}
function Vt(o) {
  return [o[0], o[1]];
}
function $n(o, e) {
  const [t, r] = e[0], [i, n] = e[1], [s, a] = e[2], c = s - t, f = a - r, h = i - t, l = n - r, d = o[0] - t, v = o[1] - r, M = c * c + f * f, S = c * h + f * l, C = c * d + f * v, F = h * h + l * l, m = h * d + l * v, w = M * F - S * S;
  if (w === 0) return !1;
  const u = 1 / w, y = (F * C - S * m) * u, g = (M * m - S * C) * u, I = 1e-9;
  return y >= -I && g >= -I && y + g <= 1 + I;
}
function Fi(o) {
  const e = o.map((s) => s.slice()).filter(
    (s, a, c) => c.findIndex(
      (f) => hn(f[0], s[0]) && hn(f[1], s[1])
    ) === a
  );
  if (e.length <= 1) return e;
  const t = e.sort(
    (s, a) => s[0] === a[0] ? s[1] - a[1] : s[0] - a[0]
  ), r = (s, a, c) => (a[0] - s[0]) * (c[1] - s[1]) - (a[1] - s[1]) * (c[0] - s[0]), i = [];
  for (const s of t) {
    for (; i.length >= 2 && r(
      i[i.length - 2],
      i[i.length - 1],
      s
    ) <= 0; )
      i.pop();
    i.push(s);
  }
  const n = [];
  for (let s = t.length - 1; s >= 0; s--) {
    const a = t[s];
    for (; n.length >= 2 && r(
      n[n.length - 2],
      n[n.length - 1],
      a
    ) <= 0; )
      n.pop();
    n.push(a);
  }
  return n.pop(), i.pop(), i.concat(n);
}
function Yi(o) {
  if (o.length < 3) return 0;
  let e = 0;
  for (let t = 0; t < o.length; t++) {
    const [r, i] = o[t], [n, s] = o[(t + 1) % o.length];
    e += r * s - n * i;
  }
  return Math.abs(e) / 2;
}
function jn(o, e, t) {
  return Math.abs(
    (o[0] * (e[1] - t[1]) + e[0] * (t[1] - o[1]) + t[0] * (o[1] - e[1])) / 2
  );
}
function hn(o, e, t = 1e-9) {
  return Math.abs(o - e) <= t;
}
const qn = 3;
class Ct extends Ut.Transform {
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
    t.bounds ? this.setBounds(t.bounds) : (this.setWh(t.wh), this.vertexMode = t.vertexMode || Ct.VERTEX_PLAIN), this.strictMode = t.strictMode || Ct.MODE_AUTO, this.yaxisMode = t.yaxisMode || Ct.YAXIS_INVERT, this.importance = t.importance || 0, this.priority = t.priority || 0, this.stateFull = t.stateFull || !1, this.useV2Algorithm = t.useV2Algorithm ?? !1, t.points && this.setPoints(t.points), t.edges && this.setEdges(t.edges);
  }
  /**
   * フォーマットバージョンを取得します
   */
  getFormatVersion() {
    return this.useV2Algorithm ? Ut.format_version : qn;
  }
  /**
   * 制御点（GCP: Ground Control Points）を設定します。
   * 指定した点群に合わせて内部のTINキャッシュをリセットします。
   */
  setPoints(t) {
    this.yaxisMode === Ct.YAXIS_FOLLOW && (t = t.map((r) => [
      r[0],
      [r[1][0], -1 * r[1][1]]
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
    let r = t[0][0], i = r, n = t[0][1], s = n;
    const a = [t[0]];
    for (let c = 1; c < t.length; c++) {
      const f = t[c];
      f[0] < r && (r = f[0]), f[0] > i && (i = f[0]), f[1] < n && (n = f[1]), f[1] > s && (s = f[1]), a.push(f);
    }
    a.push(t[0]), this.boundsPolygon = Be([a]), this.xy = [r, n], this.wh = [i - r, s - n], this.vertexMode = Ct.VERTEX_PLAIN, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 現在の設定を永続化可能な形式にコンパイルします
   */
  getCompiled() {
    var i;
    const t = {};
    t.version = this.useV2Algorithm ? Ut.format_version : qn, t.points = this.points, t.weight_buffer = this.pointsWeightBuffer ?? {}, t.centroid_point = [
      this.centroid.forw.geometry.coordinates,
      this.centroid.forw.properties.target.geom
    ], t.vertices_params = [
      this.vertices_params.forw[0],
      this.vertices_params.bakw[0]
    ], t.vertices_points = [];
    const r = this.vertices_params.forw[1];
    if (r)
      for (let n = 0; n < r.length; n++) {
        const s = r[n].features[0], a = s.geometry.coordinates[0][1], c = s.properties.b.geom;
        t.vertices_points[n] = [a, c];
      }
    return t.strict_status = this.strict_status, t.tins_points = [[]], this.tins.forw.features.map((n) => {
      t.tins_points[0].push(
        ["a", "b", "c"].map(
          (s) => n.properties[s].index
        )
      );
    }), this.strict_status === Ct.STATUS_LOOSE ? (t.tins_points[1] = [], this.tins.bakw.features.map((n) => {
      t.tins_points[1].push(
        ["a", "b", "c"].map(
          (s) => n.properties[s].index
        )
      );
    })) : this.strict_status === Ct.STATUS_ERROR && ((i = this.kinks) != null && i.bakw) && (t.kinks_points = this.kinks.bakw.features.map(
      (n) => n.geometry.coordinates
    )), t.yaxisMode = this.yaxisMode, t.vertexMode = this.vertexMode, t.strictMode = this.strictMode, this.bounds ? (t.bounds = this.bounds, t.boundsPolygon = this.boundsPolygon, this.useV2Algorithm && (t.xy = this.xy, t.wh = this.wh)) : t.wh = this.wh, t.edges = this.edges ?? [], t.edgeNodes = this.edgeNodes ?? [], t;
  }
  /**
   * コンパイルされた設定を適用します（v3+フォーマット対応）
   *
   * バージョン3以上のコンパイル済みデータが渡された場合は restoreV3State() を
   * 使用してN頂点対応の復元を行います。それ以外は基底クラスの実装に委譲します。
   */
  setCompiled(t) {
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
    var n;
    const t = this.tins.forw.features.map(
      (s) => Ut.counterTri(s)
    );
    this.tins.bakw = Qt(t);
    const r = {};
    this.tins.forw.features.forEach((s, a) => {
      const c = this.tins.bakw.features[a];
      Zn(r, { forw: s, bakw: c });
    }), Ri(
      this.tins,
      r,
      ((n = this.pointsSet) == null ? void 0 : n.edges) || []
    );
    const i = ["forw", "bakw"].map((s) => {
      const a = this.tins[s].features.map(
        (c) => c.geometry.coordinates[0]
      );
      return fi(a);
    });
    i[0].length === 0 && i[1].length === 0 ? (this.strict_status = Ct.STATUS_STRICT, delete this.kinks) : (this.strict_status = Ct.STATUS_ERROR, this.kinks = {
      forw: Qt(i[0]),
      bakw: Qt(i[1])
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
    for (let n = 0; n < this.points.length; n++) {
      const s = this.points[n][0], a = this.points[n][1], c = qe(s, a, n);
      t.forw.push(c), t.bakw.push(Ve(c));
    }
    const r = [];
    let i = 0;
    this.edgeNodes = [], this.edges || (this.edges = []);
    for (let n = 0; n < this.edges.length; n++) {
      const s = this.edges[n][2], a = Object.assign([], this.edges[n][0]), c = Object.assign([], this.edges[n][1]);
      if (a.length === 0 && c.length === 0) {
        r.push(s);
        continue;
      }
      a.unshift(this.points[s[0]][0]), a.push(this.points[s[1]][0]), c.unshift(this.points[s[0]][1]), c.push(this.points[s[1]][1]);
      const f = [a, c].map((h) => {
        const l = h.map((v, M, S) => {
          if (M === 0) return 0;
          const C = S[M - 1];
          return Math.sqrt(
            Math.pow(v[0] - C[0], 2) + Math.pow(v[1] - C[1], 2)
          );
        }), d = l.reduce((v, M, S) => S === 0 ? [0] : (v.push(v[S - 1] + M), v), []);
        return d.map((v, M, S) => {
          const C = v / S[S.length - 1];
          return [h[M], l[M], d[M], C];
        });
      });
      f.map((h, l) => {
        const d = f[l ? 0 : 1];
        return h.filter((v, M) => !(M === 0 || M === h.length - 1 || v[4] === "handled")).flatMap((v) => {
          const M = v[0], S = v[3], C = d.reduce(
            (F, m, w, u) => {
              if (F) return F;
              const y = u[w + 1];
              if (m[3] === S)
                return m[4] = "handled", [m];
              if (m[3] < S && y && y[3] > S)
                return [m, y];
            },
            void 0
          );
          if (C && C.length === 1)
            return l === 0 ? [[M, C[0][0], S]] : [[C[0][0], M, S]];
          if (C && C.length === 2) {
            const F = C[0], m = C[1], w = (S - F[3]) / (m[3] - F[3]), u = [
              (m[0][0] - F[0][0]) * w + F[0][0],
              (m[0][1] - F[0][1]) * w + F[0][1]
            ];
            return l === 0 ? [[M, u, S]] : [[u, M, S]];
          }
          return [];
        });
      }).reduce((h, l) => h.concat(l), []).sort((h, l) => h[2] < l[2] ? -1 : 1).map((h, l, d) => {
        this.edgeNodes[i] = [
          h[0],
          h[1]
        ];
        const v = qe(
          h[0],
          h[1],
          `e${i}`
        );
        i++, t.forw.push(v), t.bakw.push(Ve(v)), l === 0 ? r.push([s[0], t.forw.length - 1]) : r.push([
          t.forw.length - 2,
          t.forw.length - 1
        ]), l === d.length - 1 && r.push([t.forw.length - 1, s[1]]);
      });
    }
    return {
      forw: t.forw,
      bakw: t.bakw,
      edges: r
    };
  }
  /**
   * 入力データの検証と初期データの準備
   */
  validateAndPrepareInputs() {
    const t = this.xy[0] - 0.05 * this.wh[0], r = this.xy[0] + 1.05 * this.wh[0], i = this.xy[1] - 0.05 * this.wh[1], n = this.xy[1] + 1.05 * this.wh[1];
    if (this.bounds && !this.boundsPolygon) throw new Error("Internal error: bounds is set but boundsPolygon is missing");
    const s = this.bounds ? this.boundsPolygon : void 0;
    if (!this.points.reduce((f, h) => f && (s ? sn(h[0], s) : h[0][0] >= t && h[0][0] <= r && h[0][1] >= i && h[0][1] <= n), !0))
      throw "SOME POINTS OUTSIDE";
    let c = [];
    return this.wh && (c = [[t, i], [r, i], [t, n], [r, n]]), {
      pointsSet: this.generatePointsSet(),
      bbox: c,
      minx: t,
      maxx: r,
      miny: i,
      maxy: n
    };
  }
  /**
   * Compute a bounding box derived from GCP coordinates with a 5% margin.
   * Used in V3 plain mode where no explicit image bounds are available.
   */
  computeGcpBbox() {
    let t = 1 / 0, r = -1 / 0, i = 1 / 0, n = -1 / 0;
    for (const c of this.points) {
      const f = c[0][0], h = c[0][1];
      f < t && (t = f), f > r && (r = f), h < i && (i = h), h > n && (n = h);
    }
    const s = r - t, a = n - i;
    return {
      minx: t - 0.05 * s,
      maxx: r + 0.05 * s,
      miny: i - 0.05 * a,
      maxy: n + 0.05 * a
    };
  }
  /**
   * TINネットワークを同期的に更新し、座標変換の準備を行います。
   * 重めの計算を伴うため、呼び出し側が非同期制御を行いたい場合は
   * {@link updateTinAsync} を利用してください。
   */
  updateTin() {
    let t = this.strictMode;
    t !== Ct.MODE_STRICT && t !== Ct.MODE_LOOSE && (t = Ct.MODE_AUTO);
    const r = !this.useV2Algorithm;
    let i, n, s, a, c;
    if (r) {
      if (this.bounds) {
        const A = this.boundsPolygon;
        if (!A) throw new Error("Internal error: bounds is set but boundsPolygon is missing");
        if (!this.points.every(
          (q) => sn(q[0], A)
        )) throw "SOME POINTS OUTSIDE";
      }
      i = this.generatePointsSet(), { minx: n, maxx: s, miny: a, maxy: c } = this.computeGcpBbox();
    } else {
      const A = this.validateAndPrepareInputs();
      i = A.pointsSet, n = A.minx, s = A.maxx, a = A.miny, c = A.maxy;
    }
    const f = {
      forw: Qt(i.forw),
      bakw: Qt(i.bakw)
    }, h = Le(
      f.forw,
      i.edges,
      "target"
    ), l = Le(
      f.bakw,
      i.edges,
      "target"
    );
    if (h.features.length === 0 || l.features.length === 0)
      throw "TOO LINEAR1";
    const d = Pr(f.forw), v = In(f.forw);
    if (!v) throw "TOO LINEAR2";
    const M = {}, S = v.geometry.coordinates[0];
    let C;
    try {
      C = S.map((A) => ({
        forw: A,
        bakw: Ut.transformArr(le(A), h)
      })), C.forEach((A) => {
        M[`${A.forw[0]}:${A.forw[1]}`] = A;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const F = In(f.bakw);
    if (!F) throw "TOO LINEAR2";
    const m = F.geometry.coordinates[0];
    try {
      C = m.map((A) => ({
        bakw: A,
        forw: Ut.transformArr(le(A), l)
      })), C.forEach((A) => {
        M[`${A.forw[0]}:${A.forw[1]}`] = A;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    let w;
    if (r) {
      const A = d.geometry.coordinates, D = h.features.find(
        (q) => sn(
          le(A),
          q
        )
      );
      if (D) {
        const q = D.geometry.coordinates[0], p = D.properties.a.geom, _ = D.properties.b.geom, x = D.properties.c.geom;
        w = {
          forw: [
            (q[0][0] + q[1][0] + q[2][0]) / 3,
            (q[0][1] + q[1][1] + q[2][1]) / 3
          ],
          bakw: [
            (p[0] + _[0] + x[0]) / 3,
            (p[1] + _[1] + x[1]) / 3
          ]
        };
      } else
        w = {
          forw: A,
          bakw: Ut.transformArr(d, h)
        };
    } else
      w = {
        forw: d.geometry.coordinates,
        bakw: Ut.transformArr(d, h)
      };
    const u = qe(w.forw, w.bakw, "c");
    this.centroid = {
      forw: u,
      bakw: Ve(u)
    };
    const y = [
      ...this.points.map((A) => ({ forw: A[0], bakw: A[1] })),
      ...(this.edgeNodes ?? []).map((A) => ({ forw: A[0], bakw: A[1] }))
    ], g = {
      convexBuf: M,
      centroid: w,
      allGcps: y,
      minx: n,
      maxx: s,
      miny: a,
      maxy: c
    }, I = this.vertexMode === Ct.VERTEX_BIRDEYE ? ci(g, r) : ai(g, r), B = {
      forw: [],
      bakw: []
    };
    for (let A = 0; A < I.length; A++) {
      const D = I[A].forw, q = I[A].bakw, p = qe(D, q, `b${A}`), _ = Ve(p);
      i.forw.push(p), i.bakw.push(_), B.forw.push(p), B.bakw.push(_);
    }
    this.pointsSet = {
      forw: Qt(i.forw),
      bakw: Qt(i.bakw),
      edges: i.edges
    }, this.tins = {
      forw: Ut.rotateVerticesTriangle(
        Le(
          this.pointsSet.forw,
          i.edges,
          "target"
        )
      )
    }, (t === Ct.MODE_STRICT || t === Ct.MODE_AUTO) && this.calcurateStrictTin(), (t === Ct.MODE_LOOSE || t === Ct.MODE_AUTO && this.strict_status === Ct.STATUS_ERROR) && (this.tins.bakw = Ut.rotateVerticesTriangle(
      Le(
        this.pointsSet.bakw,
        i.edges,
        "target"
      )
    ), delete this.kinks, this.strict_status = Ct.STATUS_LOOSE), this.vertices_params = {
      forw: Ln(B.forw, this.centroid.forw),
      bakw: Ln(B.bakw, this.centroid.bakw)
    }, this.addIndexedTin();
    const E = ["forw"];
    this.strict_status === Ct.STATUS_LOOSE && E.push("bakw");
    const X = this.strict_status === Ct.STATUS_STRICT;
    this.pointsWeightBuffer = Ti({
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
const ji = Ut.format_version;
export {
  Ct as Tin,
  Le as constrainedTin,
  Ve as counterPoint,
  qe as createPoint,
  Ct as default,
  fi as findIntersections,
  ji as format_version,
  Zn as insertSearchIndex,
  Ln as vertexCalc
};
