function oe(e, t, n = {}) {
  const i = { type: "Feature" };
  return (n.id === 0 || n.id) && (i.id = n.id), n.bbox && (i.bbox = n.bbox), i.properties = t || {}, i.geometry = e, i;
}
function Yt(e, t, n = {}) {
  if (!e)
    throw new Error("coordinates is required");
  if (!Array.isArray(e))
    throw new Error("coordinates must be an Array");
  if (e.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!We(e[0]) || !We(e[1]))
    throw new Error("coordinates must contain numbers");
  return oe({
    type: "Point",
    coordinates: e
  }, t, n);
}
function le(e, t, n = {}) {
  for (const o of e) {
    if (o.length < 4)
      throw new Error(
        "Each LinearRing of a Polygon must have 4 or more Positions."
      );
    if (o[o.length - 1].length !== o[0].length)
      throw new Error("First and last Position are not equivalent.");
    for (let r = 0; r < o[o.length - 1].length; r++)
      if (o[o.length - 1][r] !== o[0][r])
        throw new Error("First and last Position are not equivalent.");
  }
  return oe({
    type: "Polygon",
    coordinates: e
  }, t, n);
}
function Qe(e, t, n = {}) {
  if (e.length < 2)
    throw new Error("coordinates must be an array of two or more positions");
  return oe({
    type: "LineString",
    coordinates: e
  }, t, n);
}
function St(e, t = {}) {
  const n = { type: "FeatureCollection" };
  return t.id && (n.id = t.id), t.bbox && (n.bbox = t.bbox), n.features = e, n;
}
function We(e) {
  return !isNaN(e) && e !== null && !Array.isArray(e);
}
function ri(e) {
  if (!e)
    throw new Error("coord is required");
  if (!Array.isArray(e)) {
    if (e.type === "Feature" && e.geometry !== null && e.geometry.type === "Point")
      return [...e.geometry.coordinates];
    if (e.type === "Point")
      return [...e.coordinates];
  }
  if (Array.isArray(e) && e.length >= 2 && !Array.isArray(e[0]) && !Array.isArray(e[1]))
    return [...e];
  throw new Error("coord must be GeoJSON Point or an Array of numbers");
}
function oi(e) {
  return e.type === "Feature" ? e.geometry : e;
}
function ze(e, t, n) {
  if (e !== null)
    for (var i, o, r, s, a, c, h, f = 0, l = 0, u, p = e.type, x = p === "FeatureCollection", w = p === "Feature", I = x ? e.features.length : 1, M = 0; M < I; M++) {
      h = x ? (
        // @ts-expect-error: Known type conflict
        e.features[M].geometry
      ) : w ? (
        // @ts-expect-error: Known type conflict
        e.geometry
      ) : e, u = h ? h.type === "GeometryCollection" : !1, a = u ? h.geometries.length : 1;
      for (var g = 0; g < a; g++) {
        var b = 0, d = 0;
        if (s = u ? h.geometries[g] : h, s !== null) {
          c = s.coordinates;
          var y = s.type;
          switch (f = n && (y === "Polygon" || y === "MultiPolygon") ? 1 : 0, y) {
            case null:
              break;
            case "Point":
              if (
                // @ts-expect-error: Known type conflict
                t(
                  c,
                  l,
                  M,
                  b,
                  d
                ) === !1
              )
                return !1;
              l++, b++;
              break;
            case "LineString":
            case "MultiPoint":
              for (i = 0; i < c.length; i++) {
                if (
                  // @ts-expect-error: Known type conflict
                  t(
                    c[i],
                    l,
                    M,
                    b,
                    d
                  ) === !1
                )
                  return !1;
                l++, y === "MultiPoint" && b++;
              }
              y === "LineString" && b++;
              break;
            case "Polygon":
            case "MultiLineString":
              for (i = 0; i < c.length; i++) {
                for (o = 0; o < c[i].length - f; o++) {
                  if (
                    // @ts-expect-error: Known type conflict
                    t(
                      c[i][o],
                      l,
                      M,
                      b,
                      d
                    ) === !1
                  )
                    return !1;
                  l++;
                }
                y === "MultiLineString" && b++, y === "Polygon" && d++;
              }
              y === "Polygon" && b++;
              break;
            case "MultiPolygon":
              for (i = 0; i < c.length; i++) {
                for (d = 0, o = 0; o < c[i].length; o++) {
                  for (r = 0; r < c[i][o].length - f; r++) {
                    if (
                      // @ts-expect-error: Known type conflict
                      t(
                        c[i][o][r],
                        l,
                        M,
                        b,
                        d
                      ) === !1
                    )
                      return !1;
                    l++;
                  }
                  d++;
                }
                b++;
              }
              break;
            case "GeometryCollection":
              for (i = 0; i < s.geometries.length; i++)
                if (
                  // @ts-expect-error: Known type conflict
                  ze(s.geometries[i], t, n) === !1
                )
                  return !1;
              break;
            default:
              throw new Error("Unknown Geometry Type");
          }
        }
      }
    }
}
const pt = 11102230246251565e-32, q = 134217729, Yn = (3 + 8 * pt) * pt;
function ft(e, t, n, i, o) {
  let r, s, a, c, h = t[0], f = i[0], l = 0, u = 0;
  f > h == f > -h ? (r = h, h = t[++l]) : (r = f, f = i[++u]);
  let p = 0;
  if (l < e && u < n)
    for (f > h == f > -h ? (s = h + r, a = r - (s - h), h = t[++l]) : (s = f + r, a = r - (s - f), f = i[++u]), r = s, a !== 0 && (o[p++] = a); l < e && u < n; )
      f > h == f > -h ? (s = r + h, c = s - r, a = r - (s - c) + (h - c), h = t[++l]) : (s = r + f, c = s - r, a = r - (s - c) + (f - c), f = i[++u]), r = s, a !== 0 && (o[p++] = a);
  for (; l < e; )
    s = r + h, c = s - r, a = r - (s - c) + (h - c), h = t[++l], r = s, a !== 0 && (o[p++] = a);
  for (; u < n; )
    s = r + f, c = s - r, a = r - (s - c) + (f - c), f = i[++u], r = s, a !== 0 && (o[p++] = a);
  return (r !== 0 || p === 0) && (o[p++] = r), p;
}
function _t(e, t, n, i, o, r, s, a) {
  return ft(ft(e, t, n, i, s), s, o, r, a);
}
function Y(e, t, n, i) {
  let o, r, s, a, c, h, f, l, u, p, x;
  f = q * n, p = f - (f - n), x = n - p;
  let w = t[0];
  o = w * n, f = q * w, l = f - (f - w), u = w - l, s = u * x - (o - l * p - u * p - l * x);
  let I = 0;
  s !== 0 && (i[I++] = s);
  for (let M = 1; M < e; M++)
    w = t[M], a = w * n, f = q * w, l = f - (f - w), u = w - l, c = u * x - (a - l * p - u * p - l * x), r = o + c, h = r - o, s = o - (r - h) + (c - h), s !== 0 && (i[I++] = s), o = a + r, s = r - (o - a), s !== 0 && (i[I++] = s);
  return (o !== 0 || I === 0) && (i[I++] = o), I;
}
function Ln(e, t) {
  let n = t[0];
  for (let i = 1; i < e; i++) n += t[i];
  return n;
}
function tt(e) {
  return new Float64Array(e);
}
const si = (3 + 16 * pt) * pt, ai = (2 + 12 * pt) * pt, ci = (9 + 64 * pt) * pt * pt, zt = tt(4), Ze = tt(8), tn = tt(12), en = tt(16), mt = tt(4);
function li(e, t, n, i, o, r, s) {
  let a, c, h, f, l, u, p, x, w, I, M, g, b, d, y, m, S, E;
  const k = e - o, N = n - o, P = t - r, C = i - r;
  d = k * C, u = q * k, p = u - (u - k), x = k - p, u = q * C, w = u - (u - C), I = C - w, y = x * I - (d - p * w - x * w - p * I), m = P * N, u = q * P, p = u - (u - P), x = P - p, u = q * N, w = u - (u - N), I = N - w, S = x * I - (m - p * w - x * w - p * I), M = y - S, l = y - M, zt[0] = y - (M + l) + (l - S), g = d + M, l = g - d, b = d - (g - l) + (M - l), M = b - m, l = b - M, zt[1] = b - (M + l) + (l - m), E = g + M, l = E - g, zt[2] = g - (E - l) + (M - l), zt[3] = E;
  let D = Ln(4, zt), v = ai * s;
  if (D >= v || -D >= v || (l = e - k, a = e - (k + l) + (l - o), l = n - N, h = n - (N + l) + (l - o), l = t - P, c = t - (P + l) + (l - r), l = i - C, f = i - (C + l) + (l - r), a === 0 && c === 0 && h === 0 && f === 0) || (v = ci * s + Yn * Math.abs(D), D += k * f + C * a - (P * h + N * c), D >= v || -D >= v)) return D;
  d = a * C, u = q * a, p = u - (u - a), x = a - p, u = q * C, w = u - (u - C), I = C - w, y = x * I - (d - p * w - x * w - p * I), m = c * N, u = q * c, p = u - (u - c), x = c - p, u = q * N, w = u - (u - N), I = N - w, S = x * I - (m - p * w - x * w - p * I), M = y - S, l = y - M, mt[0] = y - (M + l) + (l - S), g = d + M, l = g - d, b = d - (g - l) + (M - l), M = b - m, l = b - M, mt[1] = b - (M + l) + (l - m), E = g + M, l = E - g, mt[2] = g - (E - l) + (M - l), mt[3] = E;
  const O = ft(4, zt, 4, mt, Ze);
  d = k * f, u = q * k, p = u - (u - k), x = k - p, u = q * f, w = u - (u - f), I = f - w, y = x * I - (d - p * w - x * w - p * I), m = P * h, u = q * P, p = u - (u - P), x = P - p, u = q * h, w = u - (u - h), I = h - w, S = x * I - (m - p * w - x * w - p * I), M = y - S, l = y - M, mt[0] = y - (M + l) + (l - S), g = d + M, l = g - d, b = d - (g - l) + (M - l), M = b - m, l = b - M, mt[1] = b - (M + l) + (l - m), E = g + M, l = E - g, mt[2] = g - (E - l) + (M - l), mt[3] = E;
  const A = ft(O, Ze, 4, mt, tn);
  d = a * f, u = q * a, p = u - (u - a), x = a - p, u = q * f, w = u - (u - f), I = f - w, y = x * I - (d - p * w - x * w - p * I), m = c * h, u = q * c, p = u - (u - c), x = c - p, u = q * h, w = u - (u - h), I = h - w, S = x * I - (m - p * w - x * w - p * I), M = y - S, l = y - M, mt[0] = y - (M + l) + (l - S), g = d + M, l = g - d, b = d - (g - l) + (M - l), M = b - m, l = b - M, mt[1] = b - (M + l) + (l - m), E = g + M, l = E - g, mt[2] = g - (E - l) + (M - l), mt[3] = E;
  const T = ft(A, tn, 4, mt, en);
  return en[T - 1];
}
function Ot(e, t, n, i, o, r) {
  const s = (t - r) * (n - o), a = (e - o) * (i - r), c = s - a, h = Math.abs(s + a);
  return Math.abs(c) >= si * h ? c : -li(e, t, n, i, o, r, h);
}
const hi = (10 + 96 * pt) * pt, fi = (4 + 48 * pt) * pt, ui = (44 + 576 * pt) * pt * pt, Xt = tt(4), Ft = tt(4), Rt = tt(4), Et = tt(4), kt = tt(4), At = tt(4), gt = tt(4), wt = tt(4), Oe = tt(8), Ne = tt(8), Pe = tt(8), Te = tt(8), Be = tt(8), Ce = tt(8), ue = tt(8), de = tt(8), pe = tt(8), Lt = tt(4), Vt = tt(4), jt = tt(4), z = tt(8), K = tt(16), nt = tt(16), it = tt(16), et = tt(32), Dt = tt(32), at = tt(48), bt = tt(64);
let Ht = tt(1152), Xe = tt(1152);
function ct(e, t, n) {
  e = ft(e, Ht, t, n, Xe);
  const i = Ht;
  return Ht = Xe, Xe = i, e;
}
function di(e, t, n, i, o, r, s, a, c) {
  let h, f, l, u, p, x, w, I, M, g, b, d, y, m, S, E, k, N, P, C, D, v, O, A, T, X, R, _, B, F, $, L, V, U, j;
  const G = e - s, J = n - s, H = o - s, Q = t - a, Z = i - a, W = r - a;
  $ = J * W, O = q * J, A = O - (O - J), T = J - A, O = q * W, X = O - (O - W), R = W - X, L = T * R - ($ - A * X - T * X - A * R), V = H * Z, O = q * H, A = O - (O - H), T = H - A, O = q * Z, X = O - (O - Z), R = Z - X, U = T * R - (V - A * X - T * X - A * R), _ = L - U, v = L - _, Xt[0] = L - (_ + v) + (v - U), B = $ + _, v = B - $, F = $ - (B - v) + (_ - v), _ = F - V, v = F - _, Xt[1] = F - (_ + v) + (v - V), j = B + _, v = j - B, Xt[2] = B - (j - v) + (_ - v), Xt[3] = j, $ = H * Q, O = q * H, A = O - (O - H), T = H - A, O = q * Q, X = O - (O - Q), R = Q - X, L = T * R - ($ - A * X - T * X - A * R), V = G * W, O = q * G, A = O - (O - G), T = G - A, O = q * W, X = O - (O - W), R = W - X, U = T * R - (V - A * X - T * X - A * R), _ = L - U, v = L - _, Ft[0] = L - (_ + v) + (v - U), B = $ + _, v = B - $, F = $ - (B - v) + (_ - v), _ = F - V, v = F - _, Ft[1] = F - (_ + v) + (v - V), j = B + _, v = j - B, Ft[2] = B - (j - v) + (_ - v), Ft[3] = j, $ = G * Z, O = q * G, A = O - (O - G), T = G - A, O = q * Z, X = O - (O - Z), R = Z - X, L = T * R - ($ - A * X - T * X - A * R), V = J * Q, O = q * J, A = O - (O - J), T = J - A, O = q * Q, X = O - (O - Q), R = Q - X, U = T * R - (V - A * X - T * X - A * R), _ = L - U, v = L - _, Rt[0] = L - (_ + v) + (v - U), B = $ + _, v = B - $, F = $ - (B - v) + (_ - v), _ = F - V, v = F - _, Rt[1] = F - (_ + v) + (v - V), j = B + _, v = j - B, Rt[2] = B - (j - v) + (_ - v), Rt[3] = j, h = ft(
    ft(
      ft(
        Y(Y(4, Xt, G, z), z, G, K),
        K,
        Y(Y(4, Xt, Q, z), z, Q, nt),
        nt,
        et
      ),
      et,
      ft(
        Y(Y(4, Ft, J, z), z, J, K),
        K,
        Y(Y(4, Ft, Z, z), z, Z, nt),
        nt,
        Dt
      ),
      Dt,
      bt
    ),
    bt,
    ft(
      Y(Y(4, Rt, H, z), z, H, K),
      K,
      Y(Y(4, Rt, W, z), z, W, nt),
      nt,
      et
    ),
    et,
    Ht
  );
  let st = Ln(h, Ht), ht = fi * c;
  if (st >= ht || -st >= ht || (v = e - G, f = e - (G + v) + (v - s), v = t - Q, p = t - (Q + v) + (v - a), v = n - J, l = n - (J + v) + (v - s), v = i - Z, x = i - (Z + v) + (v - a), v = o - H, u = o - (H + v) + (v - s), v = r - W, w = r - (W + v) + (v - a), f === 0 && l === 0 && u === 0 && p === 0 && x === 0 && w === 0) || (ht = ui * c + Yn * Math.abs(st), st += (G * G + Q * Q) * (J * w + W * l - (Z * u + H * x)) + 2 * (G * f + Q * p) * (J * W - Z * H) + ((J * J + Z * Z) * (H * p + Q * u - (W * f + G * w)) + 2 * (J * l + Z * x) * (H * Q - W * G)) + ((H * H + W * W) * (G * x + Z * f - (Q * l + J * p)) + 2 * (H * u + W * w) * (G * Z - Q * J)), st >= ht || -st >= ht))
    return st;
  if ((l !== 0 || x !== 0 || u !== 0 || w !== 0) && ($ = G * G, O = q * G, A = O - (O - G), T = G - A, L = T * T - ($ - A * A - (A + A) * T), V = Q * Q, O = q * Q, A = O - (O - Q), T = Q - A, U = T * T - (V - A * A - (A + A) * T), _ = L + U, v = _ - L, Et[0] = L - (_ - v) + (U - v), B = $ + _, v = B - $, F = $ - (B - v) + (_ - v), _ = F + V, v = _ - F, Et[1] = F - (_ - v) + (V - v), j = B + _, v = j - B, Et[2] = B - (j - v) + (_ - v), Et[3] = j), (u !== 0 || w !== 0 || f !== 0 || p !== 0) && ($ = J * J, O = q * J, A = O - (O - J), T = J - A, L = T * T - ($ - A * A - (A + A) * T), V = Z * Z, O = q * Z, A = O - (O - Z), T = Z - A, U = T * T - (V - A * A - (A + A) * T), _ = L + U, v = _ - L, kt[0] = L - (_ - v) + (U - v), B = $ + _, v = B - $, F = $ - (B - v) + (_ - v), _ = F + V, v = _ - F, kt[1] = F - (_ - v) + (V - v), j = B + _, v = j - B, kt[2] = B - (j - v) + (_ - v), kt[3] = j), (f !== 0 || p !== 0 || l !== 0 || x !== 0) && ($ = H * H, O = q * H, A = O - (O - H), T = H - A, L = T * T - ($ - A * A - (A + A) * T), V = W * W, O = q * W, A = O - (O - W), T = W - A, U = T * T - (V - A * A - (A + A) * T), _ = L + U, v = _ - L, At[0] = L - (_ - v) + (U - v), B = $ + _, v = B - $, F = $ - (B - v) + (_ - v), _ = F + V, v = _ - F, At[1] = F - (_ - v) + (V - v), j = B + _, v = j - B, At[2] = B - (j - v) + (_ - v), At[3] = j), f !== 0 && (I = Y(4, Xt, f, Oe), h = ct(h, _t(
    Y(I, Oe, 2 * G, K),
    K,
    Y(Y(4, At, f, z), z, Z, nt),
    nt,
    Y(Y(4, kt, f, z), z, -W, it),
    it,
    et,
    at
  ), at)), p !== 0 && (M = Y(4, Xt, p, Ne), h = ct(h, _t(
    Y(M, Ne, 2 * Q, K),
    K,
    Y(Y(4, kt, p, z), z, H, nt),
    nt,
    Y(Y(4, At, p, z), z, -J, it),
    it,
    et,
    at
  ), at)), l !== 0 && (g = Y(4, Ft, l, Pe), h = ct(h, _t(
    Y(g, Pe, 2 * J, K),
    K,
    Y(Y(4, Et, l, z), z, W, nt),
    nt,
    Y(Y(4, At, l, z), z, -Q, it),
    it,
    et,
    at
  ), at)), x !== 0 && (b = Y(4, Ft, x, Te), h = ct(h, _t(
    Y(b, Te, 2 * Z, K),
    K,
    Y(Y(4, At, x, z), z, G, nt),
    nt,
    Y(Y(4, Et, x, z), z, -H, it),
    it,
    et,
    at
  ), at)), u !== 0 && (d = Y(4, Rt, u, Be), h = ct(h, _t(
    Y(d, Be, 2 * H, K),
    K,
    Y(Y(4, kt, u, z), z, Q, nt),
    nt,
    Y(Y(4, Et, u, z), z, -Z, it),
    it,
    et,
    at
  ), at)), w !== 0 && (y = Y(4, Rt, w, Ce), h = ct(h, _t(
    Y(y, Ce, 2 * W, K),
    K,
    Y(Y(4, Et, w, z), z, J, nt),
    nt,
    Y(Y(4, kt, w, z), z, -G, it),
    it,
    et,
    at
  ), at)), f !== 0 || p !== 0) {
    if (l !== 0 || x !== 0 || u !== 0 || w !== 0 ? ($ = l * W, O = q * l, A = O - (O - l), T = l - A, O = q * W, X = O - (O - W), R = W - X, L = T * R - ($ - A * X - T * X - A * R), V = J * w, O = q * J, A = O - (O - J), T = J - A, O = q * w, X = O - (O - w), R = w - X, U = T * R - (V - A * X - T * X - A * R), _ = L + U, v = _ - L, gt[0] = L - (_ - v) + (U - v), B = $ + _, v = B - $, F = $ - (B - v) + (_ - v), _ = F + V, v = _ - F, gt[1] = F - (_ - v) + (V - v), j = B + _, v = j - B, gt[2] = B - (j - v) + (_ - v), gt[3] = j, $ = u * -Z, O = q * u, A = O - (O - u), T = u - A, O = q * -Z, X = O - (O - -Z), R = -Z - X, L = T * R - ($ - A * X - T * X - A * R), V = H * -x, O = q * H, A = O - (O - H), T = H - A, O = q * -x, X = O - (O - -x), R = -x - X, U = T * R - (V - A * X - T * X - A * R), _ = L + U, v = _ - L, wt[0] = L - (_ - v) + (U - v), B = $ + _, v = B - $, F = $ - (B - v) + (_ - v), _ = F + V, v = _ - F, wt[1] = F - (_ - v) + (V - v), j = B + _, v = j - B, wt[2] = B - (j - v) + (_ - v), wt[3] = j, S = ft(4, gt, 4, wt, de), $ = l * w, O = q * l, A = O - (O - l), T = l - A, O = q * w, X = O - (O - w), R = w - X, L = T * R - ($ - A * X - T * X - A * R), V = u * x, O = q * u, A = O - (O - u), T = u - A, O = q * x, X = O - (O - x), R = x - X, U = T * R - (V - A * X - T * X - A * R), _ = L - U, v = L - _, Vt[0] = L - (_ + v) + (v - U), B = $ + _, v = B - $, F = $ - (B - v) + (_ - v), _ = F - V, v = F - _, Vt[1] = F - (_ + v) + (v - V), j = B + _, v = j - B, Vt[2] = B - (j - v) + (_ - v), Vt[3] = j, N = 4) : (de[0] = 0, S = 1, Vt[0] = 0, N = 1), f !== 0) {
      const rt = Y(S, de, f, it);
      h = ct(h, ft(
        Y(I, Oe, f, K),
        K,
        Y(rt, it, 2 * G, et),
        et,
        at
      ), at);
      const ot = Y(N, Vt, f, z);
      h = ct(h, _t(
        Y(ot, z, 2 * G, K),
        K,
        Y(ot, z, f, nt),
        nt,
        Y(rt, it, f, et),
        et,
        Dt,
        bt
      ), bt), x !== 0 && (h = ct(h, Y(Y(4, At, f, z), z, x, K), K)), w !== 0 && (h = ct(h, Y(Y(4, kt, -f, z), z, w, K), K));
    }
    if (p !== 0) {
      const rt = Y(S, de, p, it);
      h = ct(h, ft(
        Y(M, Ne, p, K),
        K,
        Y(rt, it, 2 * Q, et),
        et,
        at
      ), at);
      const ot = Y(N, Vt, p, z);
      h = ct(h, _t(
        Y(ot, z, 2 * Q, K),
        K,
        Y(ot, z, p, nt),
        nt,
        Y(rt, it, p, et),
        et,
        Dt,
        bt
      ), bt);
    }
  }
  if (l !== 0 || x !== 0) {
    if (u !== 0 || w !== 0 || f !== 0 || p !== 0 ? ($ = u * Q, O = q * u, A = O - (O - u), T = u - A, O = q * Q, X = O - (O - Q), R = Q - X, L = T * R - ($ - A * X - T * X - A * R), V = H * p, O = q * H, A = O - (O - H), T = H - A, O = q * p, X = O - (O - p), R = p - X, U = T * R - (V - A * X - T * X - A * R), _ = L + U, v = _ - L, gt[0] = L - (_ - v) + (U - v), B = $ + _, v = B - $, F = $ - (B - v) + (_ - v), _ = F + V, v = _ - F, gt[1] = F - (_ - v) + (V - v), j = B + _, v = j - B, gt[2] = B - (j - v) + (_ - v), gt[3] = j, C = -W, D = -w, $ = f * C, O = q * f, A = O - (O - f), T = f - A, O = q * C, X = O - (O - C), R = C - X, L = T * R - ($ - A * X - T * X - A * R), V = G * D, O = q * G, A = O - (O - G), T = G - A, O = q * D, X = O - (O - D), R = D - X, U = T * R - (V - A * X - T * X - A * R), _ = L + U, v = _ - L, wt[0] = L - (_ - v) + (U - v), B = $ + _, v = B - $, F = $ - (B - v) + (_ - v), _ = F + V, v = _ - F, wt[1] = F - (_ - v) + (V - v), j = B + _, v = j - B, wt[2] = B - (j - v) + (_ - v), wt[3] = j, E = ft(4, gt, 4, wt, pe), $ = u * p, O = q * u, A = O - (O - u), T = u - A, O = q * p, X = O - (O - p), R = p - X, L = T * R - ($ - A * X - T * X - A * R), V = f * w, O = q * f, A = O - (O - f), T = f - A, O = q * w, X = O - (O - w), R = w - X, U = T * R - (V - A * X - T * X - A * R), _ = L - U, v = L - _, jt[0] = L - (_ + v) + (v - U), B = $ + _, v = B - $, F = $ - (B - v) + (_ - v), _ = F - V, v = F - _, jt[1] = F - (_ + v) + (v - V), j = B + _, v = j - B, jt[2] = B - (j - v) + (_ - v), jt[3] = j, P = 4) : (pe[0] = 0, E = 1, jt[0] = 0, P = 1), l !== 0) {
      const rt = Y(E, pe, l, it);
      h = ct(h, ft(
        Y(g, Pe, l, K),
        K,
        Y(rt, it, 2 * J, et),
        et,
        at
      ), at);
      const ot = Y(P, jt, l, z);
      h = ct(h, _t(
        Y(ot, z, 2 * J, K),
        K,
        Y(ot, z, l, nt),
        nt,
        Y(rt, it, l, et),
        et,
        Dt,
        bt
      ), bt), w !== 0 && (h = ct(h, Y(Y(4, Et, l, z), z, w, K), K)), p !== 0 && (h = ct(h, Y(Y(4, At, -l, z), z, p, K), K));
    }
    if (x !== 0) {
      const rt = Y(E, pe, x, it);
      h = ct(h, ft(
        Y(b, Te, x, K),
        K,
        Y(rt, it, 2 * Z, et),
        et,
        at
      ), at);
      const ot = Y(P, jt, x, z);
      h = ct(h, _t(
        Y(ot, z, 2 * Z, K),
        K,
        Y(ot, z, x, nt),
        nt,
        Y(rt, it, x, et),
        et,
        Dt,
        bt
      ), bt);
    }
  }
  if (u !== 0 || w !== 0) {
    if (f !== 0 || p !== 0 || l !== 0 || x !== 0 ? ($ = f * Z, O = q * f, A = O - (O - f), T = f - A, O = q * Z, X = O - (O - Z), R = Z - X, L = T * R - ($ - A * X - T * X - A * R), V = G * x, O = q * G, A = O - (O - G), T = G - A, O = q * x, X = O - (O - x), R = x - X, U = T * R - (V - A * X - T * X - A * R), _ = L + U, v = _ - L, gt[0] = L - (_ - v) + (U - v), B = $ + _, v = B - $, F = $ - (B - v) + (_ - v), _ = F + V, v = _ - F, gt[1] = F - (_ - v) + (V - v), j = B + _, v = j - B, gt[2] = B - (j - v) + (_ - v), gt[3] = j, C = -Q, D = -p, $ = l * C, O = q * l, A = O - (O - l), T = l - A, O = q * C, X = O - (O - C), R = C - X, L = T * R - ($ - A * X - T * X - A * R), V = J * D, O = q * J, A = O - (O - J), T = J - A, O = q * D, X = O - (O - D), R = D - X, U = T * R - (V - A * X - T * X - A * R), _ = L + U, v = _ - L, wt[0] = L - (_ - v) + (U - v), B = $ + _, v = B - $, F = $ - (B - v) + (_ - v), _ = F + V, v = _ - F, wt[1] = F - (_ - v) + (V - v), j = B + _, v = j - B, wt[2] = B - (j - v) + (_ - v), wt[3] = j, m = ft(4, gt, 4, wt, ue), $ = f * x, O = q * f, A = O - (O - f), T = f - A, O = q * x, X = O - (O - x), R = x - X, L = T * R - ($ - A * X - T * X - A * R), V = l * p, O = q * l, A = O - (O - l), T = l - A, O = q * p, X = O - (O - p), R = p - X, U = T * R - (V - A * X - T * X - A * R), _ = L - U, v = L - _, Lt[0] = L - (_ + v) + (v - U), B = $ + _, v = B - $, F = $ - (B - v) + (_ - v), _ = F - V, v = F - _, Lt[1] = F - (_ + v) + (v - V), j = B + _, v = j - B, Lt[2] = B - (j - v) + (_ - v), Lt[3] = j, k = 4) : (ue[0] = 0, m = 1, Lt[0] = 0, k = 1), u !== 0) {
      const rt = Y(m, ue, u, it);
      h = ct(h, ft(
        Y(d, Be, u, K),
        K,
        Y(rt, it, 2 * H, et),
        et,
        at
      ), at);
      const ot = Y(k, Lt, u, z);
      h = ct(h, _t(
        Y(ot, z, 2 * H, K),
        K,
        Y(ot, z, u, nt),
        nt,
        Y(rt, it, u, et),
        et,
        Dt,
        bt
      ), bt), p !== 0 && (h = ct(h, Y(Y(4, kt, u, z), z, p, K), K)), x !== 0 && (h = ct(h, Y(Y(4, Et, -u, z), z, x, K), K));
    }
    if (w !== 0) {
      const rt = Y(m, ue, w, it);
      h = ct(h, ft(
        Y(y, Ce, w, K),
        K,
        Y(rt, it, 2 * W, et),
        et,
        at
      ), at);
      const ot = Y(k, Lt, w, z);
      h = ct(h, _t(
        Y(ot, z, 2 * W, K),
        K,
        Y(ot, z, w, nt),
        nt,
        Y(rt, it, w, et),
        et,
        Dt,
        bt
      ), bt);
    }
  }
  return Ht[h - 1];
}
function pi(e, t, n, i, o, r, s, a) {
  const c = e - s, h = n - s, f = o - s, l = t - a, u = i - a, p = r - a, x = h * p, w = f * u, I = c * c + l * l, M = f * l, g = c * p, b = h * h + u * u, d = c * u, y = h * l, m = f * f + p * p, S = I * (x - w) + b * (M - g) + m * (d - y), E = (Math.abs(x) + Math.abs(w)) * I + (Math.abs(M) + Math.abs(g)) * b + (Math.abs(d) + Math.abs(y)) * m, k = hi * E;
  return S > k || -S > k ? S : di(e, t, n, i, o, r, s, a, E);
}
function mi(e, t) {
  var n, i, o = 0, r, s, a, c, h, f, l, u = e[0], p = e[1], x = t.length;
  for (n = 0; n < x; n++) {
    i = 0;
    var w = t[n], I = w.length - 1;
    if (f = w[0], f[0] !== w[I][0] && f[1] !== w[I][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (s = f[0] - u, a = f[1] - p, i; i < I; i++) {
      if (l = w[i + 1], c = l[0] - u, h = l[1] - p, a === 0 && h === 0) {
        if (c <= 0 && s >= 0 || s <= 0 && c >= 0)
          return 0;
      } else if (h >= 0 && a <= 0 || h <= 0 && a >= 0) {
        if (r = Ot(s, c, a, h, 0, 0), r === 0)
          return 0;
        (r > 0 && h > 0 && a <= 0 || r < 0 && h <= 0 && a > 0) && o++;
      }
      f = l, a = h, s = c;
    }
  }
  return o % 2 !== 0;
}
function Fe(e, t, n = {}) {
  if (!e)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const i = ri(e), o = oi(t), r = o.type, s = t.bbox;
  let a = o.coordinates;
  if (s && gi(i, s) === !1)
    return !1;
  r === "Polygon" && (a = [a]);
  for (var c = 0; c < a.length; ++c) {
    const h = mi(i, a[c]);
    if (h === 0 && !n.ignoreBoundary) return !0;
    if (h) return !0;
  }
  return !1;
}
function gi(e, t) {
  return t[0] <= e[0] && t[1] <= e[1] && t[2] >= e[0] && t[3] >= e[1];
}
class Je {
  constructor(t = [], n = wi) {
    if (this.data = t, this.length = this.data.length, this.compare = n, this.length > 0)
      for (let i = (this.length >> 1) - 1; i >= 0; i--) this._down(i);
  }
  push(t) {
    this.data.push(t), this.length++, this._up(this.length - 1);
  }
  pop() {
    if (this.length === 0) return;
    const t = this.data[0], n = this.data.pop();
    return this.length--, this.length > 0 && (this.data[0] = n, this._down(0)), t;
  }
  peek() {
    return this.data[0];
  }
  _up(t) {
    const { data: n, compare: i } = this, o = n[t];
    for (; t > 0; ) {
      const r = t - 1 >> 1, s = n[r];
      if (i(o, s) >= 0) break;
      n[t] = s, t = r;
    }
    n[t] = o;
  }
  _down(t) {
    const { data: n, compare: i } = this, o = this.length >> 1, r = n[t];
    for (; t < o; ) {
      let s = (t << 1) + 1, a = n[s];
      const c = s + 1;
      if (c < this.length && i(n[c], a) < 0 && (s = c, a = n[c]), i(a, r) >= 0) break;
      n[t] = a, t = s;
    }
    n[t] = r;
  }
}
function wi(e, t) {
  return e < t ? -1 : e > t ? 1 : 0;
}
const yi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Je
}, Symbol.toStringTag, { value: "Module" })), Tt = 11102230246251565e-32, ut = 134217729, vi = (3 + 8 * Tt) * Tt;
function Re(e, t, n, i, o) {
  let r, s, a, c, h = t[0], f = i[0], l = 0, u = 0;
  f > h == f > -h ? (r = h, h = t[++l]) : (r = f, f = i[++u]);
  let p = 0;
  if (l < e && u < n)
    for (f > h == f > -h ? (s = h + r, a = r - (s - h), h = t[++l]) : (s = f + r, a = r - (s - f), f = i[++u]), r = s, a !== 0 && (o[p++] = a); l < e && u < n; )
      f > h == f > -h ? (s = r + h, c = s - r, a = r - (s - c) + (h - c), h = t[++l]) : (s = r + f, c = s - r, a = r - (s - c) + (f - c), f = i[++u]), r = s, a !== 0 && (o[p++] = a);
  for (; l < e; )
    s = r + h, c = s - r, a = r - (s - c) + (h - c), h = t[++l], r = s, a !== 0 && (o[p++] = a);
  for (; u < n; )
    s = r + f, c = s - r, a = r - (s - c) + (f - c), f = i[++u], r = s, a !== 0 && (o[p++] = a);
  return (r !== 0 || p === 0) && (o[p++] = r), p;
}
function bi(e, t) {
  let n = t[0];
  for (let i = 1; i < e; i++) n += t[i];
  return n;
}
function he(e) {
  return new Float64Array(e);
}
const xi = (3 + 16 * Tt) * Tt, _i = (2 + 12 * Tt) * Tt, Mi = (9 + 64 * Tt) * Tt * Tt, Jt = he(4), nn = he(8), rn = he(12), on = he(16), yt = he(4);
function Si(e, t, n, i, o, r, s) {
  let a, c, h, f, l, u, p, x, w, I, M, g, b, d, y, m, S, E;
  const k = e - o, N = n - o, P = t - r, C = i - r;
  d = k * C, u = ut * k, p = u - (u - k), x = k - p, u = ut * C, w = u - (u - C), I = C - w, y = x * I - (d - p * w - x * w - p * I), m = P * N, u = ut * P, p = u - (u - P), x = P - p, u = ut * N, w = u - (u - N), I = N - w, S = x * I - (m - p * w - x * w - p * I), M = y - S, l = y - M, Jt[0] = y - (M + l) + (l - S), g = d + M, l = g - d, b = d - (g - l) + (M - l), M = b - m, l = b - M, Jt[1] = b - (M + l) + (l - m), E = g + M, l = E - g, Jt[2] = g - (E - l) + (M - l), Jt[3] = E;
  let D = bi(4, Jt), v = _i * s;
  if (D >= v || -D >= v || (l = e - k, a = e - (k + l) + (l - o), l = n - N, h = n - (N + l) + (l - o), l = t - P, c = t - (P + l) + (l - r), l = i - C, f = i - (C + l) + (l - r), a === 0 && c === 0 && h === 0 && f === 0) || (v = Mi * s + vi * Math.abs(D), D += k * f + C * a - (P * h + N * c), D >= v || -D >= v)) return D;
  d = a * C, u = ut * a, p = u - (u - a), x = a - p, u = ut * C, w = u - (u - C), I = C - w, y = x * I - (d - p * w - x * w - p * I), m = c * N, u = ut * c, p = u - (u - c), x = c - p, u = ut * N, w = u - (u - N), I = N - w, S = x * I - (m - p * w - x * w - p * I), M = y - S, l = y - M, yt[0] = y - (M + l) + (l - S), g = d + M, l = g - d, b = d - (g - l) + (M - l), M = b - m, l = b - M, yt[1] = b - (M + l) + (l - m), E = g + M, l = E - g, yt[2] = g - (E - l) + (M - l), yt[3] = E;
  const O = Re(4, Jt, 4, yt, nn);
  d = k * f, u = ut * k, p = u - (u - k), x = k - p, u = ut * f, w = u - (u - f), I = f - w, y = x * I - (d - p * w - x * w - p * I), m = P * h, u = ut * P, p = u - (u - P), x = P - p, u = ut * h, w = u - (u - h), I = h - w, S = x * I - (m - p * w - x * w - p * I), M = y - S, l = y - M, yt[0] = y - (M + l) + (l - S), g = d + M, l = g - d, b = d - (g - l) + (M - l), M = b - m, l = b - M, yt[1] = b - (M + l) + (l - m), E = g + M, l = E - g, yt[2] = g - (E - l) + (M - l), yt[3] = E;
  const A = Re(O, nn, 4, yt, rn);
  d = a * f, u = ut * a, p = u - (u - a), x = a - p, u = ut * f, w = u - (u - f), I = f - w, y = x * I - (d - p * w - x * w - p * I), m = c * h, u = ut * c, p = u - (u - c), x = c - p, u = ut * h, w = u - (u - h), I = h - w, S = x * I - (m - p * w - x * w - p * I), M = y - S, l = y - M, yt[0] = y - (M + l) + (l - S), g = d + M, l = g - d, b = d - (g - l) + (M - l), M = b - m, l = b - M, yt[1] = b - (M + l) + (l - m), E = g + M, l = E - g, yt[2] = g - (E - l) + (M - l), yt[3] = E;
  const T = Re(A, rn, 4, yt, on);
  return on[T - 1];
}
function sn(e, t, n, i, o, r) {
  const s = (t - r) * (n - o), a = (e - o) * (i - r), c = s - a;
  if (s === 0 || a === 0 || s > 0 != a > 0) return c;
  const h = Math.abs(s + a);
  return Math.abs(c) >= xi * h ? c : -Si(e, t, n, i, o, r, h);
}
function Ei(e, t) {
  const n = new Je([], Vn);
  return Ai(e, n), Ii(n, t);
}
function Vn(e, t) {
  return e.p.x > t.p.x ? 1 : e.p.x < t.p.x || e.p.x === t.p.x && (e.featureId !== t.featureId || e.ringId !== t.ringId) && e.isLeftEndpoint && !t.isLeftEndpoint ? -1 : e.p.y !== t.p.y ? e.p.y > t.p.y ? 1 : -1 : 1;
}
function ki(e, t) {
  return e.rightSweepEvent.p.x > t.rightSweepEvent.p.x ? 1 : e.rightSweepEvent.p.x < t.rightSweepEvent.p.x ? -1 : e.rightSweepEvent.p.y !== t.rightSweepEvent.p.y ? e.rightSweepEvent.p.y < t.rightSweepEvent.p.y ? 1 : -1 : 1;
}
function Ai(e, t) {
  if (e.type === "FeatureCollection") {
    const n = e.features;
    for (let i = 0; i < n.length; i++)
      an(n[i], t);
  } else
    an(e, t);
}
var me = 0, ge = 0, we = 0;
function an(e, t) {
  const n = e.type === "Feature" ? e.geometry : e;
  let i = n.coordinates;
  (n.type === "Polygon" || n.type === "MultiLineString") && (i = [i]), n.type === "LineString" && (i = [[i]]);
  for (let o = 0; o < i.length; o++)
    for (let r = 0; r < i[o].length; r++) {
      let s = i[o][r][0], a = null;
      ge = ge + 1;
      for (let c = 0; c < i[o][r].length - 1; c++) {
        a = i[o][r][c + 1];
        const h = new cn(s, me, ge, we), f = new cn(a, me, ge, we + 1);
        h.otherEvent = f, f.otherEvent = h, Vn(h, f) > 0 ? (f.isLeftEndpoint = !0, h.isLeftEndpoint = !1) : (h.isLeftEndpoint = !0, f.isLeftEndpoint = !1), t.push(h), t.push(f), s = a, we = we + 1;
      }
    }
  me = me + 1;
}
var cn = class {
  constructor(e, t, n, i) {
    this.p = {
      x: e[0],
      y: e[1]
    }, this.featureId = t, this.ringId = n, this.eventId = i, this.otherEvent = null, this.isLeftEndpoint = null;
  }
  isSamePoint(e) {
    return this.p.x === e.p.x && this.p.y === e.p.y;
  }
  asNewXY() {
    return [this.p.x, this.p.y];
  }
};
function Ii(e, t = !1) {
  const n = [], i = new Je([], ki);
  for (; e.length; ) {
    const o = e.pop();
    if (o.isLeftEndpoint) {
      const r = new Oi(o);
      for (let s = 0; s < i.data.length; s++) {
        const a = i.data[s];
        if (t && a.leftSweepEvent.featureId === o.featureId)
          continue;
        const c = Ni(r, a);
        c !== !1 && n.push(c);
      }
      i.push(r);
    } else o.isLeftEndpoint === !1 && i.pop();
  }
  return n;
}
var Oi = class {
  /** @param event must have otherEvent non-null */
  constructor(e) {
    this.leftSweepEvent = e, this.rightSweepEvent = e.otherEvent;
  }
};
function Ni(e, t) {
  if (e === null || t === null) return !1;
  const n = e.leftSweepEvent.p.x, i = e.leftSweepEvent.p.y, o = e.rightSweepEvent.p.x, r = e.rightSweepEvent.p.y, s = t.leftSweepEvent.p.x, a = t.leftSweepEvent.p.y, c = t.rightSweepEvent.p.x, h = t.rightSweepEvent.p.y, f = sn(n, i, o, r, s, a), l = sn(n, i, o, r, c, h);
  if (f > 0 && l > 0) return !1;
  if (f < 0 && l < 0) return !1;
  if (e.leftSweepEvent.ringId === t.leftSweepEvent.ringId) {
    if (e.rightSweepEvent.isSamePoint(t.leftSweepEvent) || e.rightSweepEvent.isSamePoint(t.rightSweepEvent) || e.leftSweepEvent.isSamePoint(t.leftSweepEvent) || e.leftSweepEvent.isSamePoint(t.rightSweepEvent))
      return !1;
  } else {
    if (e.rightSweepEvent.isSamePoint(t.leftSweepEvent))
      return t.leftSweepEvent.asNewXY();
    if (e.rightSweepEvent.isSamePoint(t.rightSweepEvent))
      return t.rightSweepEvent.asNewXY();
    if (e.leftSweepEvent.isSamePoint(t.leftSweepEvent))
      return t.leftSweepEvent.asNewXY();
    if (e.leftSweepEvent.isSamePoint(t.rightSweepEvent))
      return t.rightSweepEvent.asNewXY();
  }
  const u = (h - a) * (o - n) - (c - s) * (r - i), p = (c - s) * (i - a) - (h - a) * (n - s), x = (o - n) * (i - a) - (r - i) * (n - s);
  if (u === 0)
    return !1;
  const w = p / u, I = x / u;
  if (w >= 0 && w <= 1 && I >= 0 && I <= 1) {
    const M = n + w * (o - n), g = i + w * (r - i);
    return [M, g];
  }
  return !1;
}
function Pi(e, t, n = {}) {
  const { removeDuplicates: i = !0, ignoreSelfIntersections: o = !0 } = n;
  let r = [];
  e.type === "FeatureCollection" ? r = r.concat(e.features) : e.type === "Feature" ? r.push(e) : (e.type === "LineString" || e.type === "Polygon" || e.type === "MultiLineString" || e.type === "MultiPolygon") && r.push(oe(e)), t.type === "FeatureCollection" ? r = r.concat(t.features) : t.type === "Feature" ? r.push(t) : (t.type === "LineString" || t.type === "Polygon" || t.type === "MultiLineString" || t.type === "MultiPolygon") && r.push(oe(t));
  const s = Ei(
    St(r),
    o
  );
  let a = [];
  if (i) {
    const c = {};
    s.forEach((h) => {
      const f = h.join(",");
      c[f] || (c[f] = !0, a.push(h));
    });
  } else
    a = s;
  return St(a.map((c) => Yt(c)));
}
function Ti(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function Bi(e) {
  if (Object.prototype.hasOwnProperty.call(e, "__esModule")) return e;
  var t = e.default;
  if (typeof t == "function") {
    var n = function i() {
      var o = !1;
      try {
        o = this instanceof i;
      } catch {
      }
      return o ? Reflect.construct(t, arguments, this.constructor) : t.apply(this, arguments);
    };
    n.prototype = t.prototype;
  } else n = {};
  return Object.defineProperty(n, "__esModule", { value: !0 }), Object.keys(e).forEach(function(i) {
    var o = Object.getOwnPropertyDescriptor(e, i);
    Object.defineProperty(n, i, o.get ? o : {
      enumerable: !0,
      get: function() {
        return e[i];
      }
    });
  }), n;
}
function Ci(e, t = {}) {
  let n = 0, i = 0, o = 0;
  return ze(
    e,
    function(r) {
      n += r[0], i += r[1], o++;
    },
    !0
  ), Yt([n / o, i / o], t.properties);
}
var ye = { exports: {} }, ke = { exports: {} }, Xi = ke.exports, ln;
function Fi() {
  return ln || (ln = 1, (function(e, t) {
    (function(n, i) {
      e.exports = i();
    })(Xi, function() {
      function n(g, b, d, y, m) {
        (function S(E, k, N, P, C) {
          for (; P > N; ) {
            if (P - N > 600) {
              var D = P - N + 1, v = k - N + 1, O = Math.log(D), A = 0.5 * Math.exp(2 * O / 3), T = 0.5 * Math.sqrt(O * A * (D - A) / D) * (v - D / 2 < 0 ? -1 : 1), X = Math.max(N, Math.floor(k - v * A / D + T)), R = Math.min(P, Math.floor(k + (D - v) * A / D + T));
              S(E, k, X, R, C);
            }
            var _ = E[k], B = N, F = P;
            for (i(E, N, k), C(E[P], _) > 0 && i(E, N, P); B < F; ) {
              for (i(E, B, F), B++, F--; C(E[B], _) < 0; ) B++;
              for (; C(E[F], _) > 0; ) F--;
            }
            C(E[N], _) === 0 ? i(E, N, F) : i(E, ++F, P), F <= k && (N = F + 1), k <= F && (P = F - 1);
          }
        })(g, b, d || 0, y || g.length - 1, m || o);
      }
      function i(g, b, d) {
        var y = g[b];
        g[b] = g[d], g[d] = y;
      }
      function o(g, b) {
        return g < b ? -1 : g > b ? 1 : 0;
      }
      var r = function(g) {
        g === void 0 && (g = 9), this._maxEntries = Math.max(4, g), this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries)), this.clear();
      };
      function s(g, b, d) {
        if (!d) return b.indexOf(g);
        for (var y = 0; y < b.length; y++) if (d(g, b[y])) return y;
        return -1;
      }
      function a(g, b) {
        c(g, 0, g.children.length, b, g);
      }
      function c(g, b, d, y, m) {
        m || (m = I(null)), m.minX = 1 / 0, m.minY = 1 / 0, m.maxX = -1 / 0, m.maxY = -1 / 0;
        for (var S = b; S < d; S++) {
          var E = g.children[S];
          h(m, g.leaf ? y(E) : E);
        }
        return m;
      }
      function h(g, b) {
        return g.minX = Math.min(g.minX, b.minX), g.minY = Math.min(g.minY, b.minY), g.maxX = Math.max(g.maxX, b.maxX), g.maxY = Math.max(g.maxY, b.maxY), g;
      }
      function f(g, b) {
        return g.minX - b.minX;
      }
      function l(g, b) {
        return g.minY - b.minY;
      }
      function u(g) {
        return (g.maxX - g.minX) * (g.maxY - g.minY);
      }
      function p(g) {
        return g.maxX - g.minX + (g.maxY - g.minY);
      }
      function x(g, b) {
        return g.minX <= b.minX && g.minY <= b.minY && b.maxX <= g.maxX && b.maxY <= g.maxY;
      }
      function w(g, b) {
        return b.minX <= g.maxX && b.minY <= g.maxY && b.maxX >= g.minX && b.maxY >= g.minY;
      }
      function I(g) {
        return { children: g, height: 1, leaf: !0, minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
      }
      function M(g, b, d, y, m) {
        for (var S = [b, d]; S.length; ) if (!((d = S.pop()) - (b = S.pop()) <= y)) {
          var E = b + Math.ceil((d - b) / y / 2) * y;
          n(g, E, b, d, m), S.push(b, E, E, d);
        }
      }
      return r.prototype.all = function() {
        return this._all(this.data, []);
      }, r.prototype.search = function(g) {
        var b = this.data, d = [];
        if (!w(g, b)) return d;
        for (var y = this.toBBox, m = []; b; ) {
          for (var S = 0; S < b.children.length; S++) {
            var E = b.children[S], k = b.leaf ? y(E) : E;
            w(g, k) && (b.leaf ? d.push(E) : x(g, k) ? this._all(E, d) : m.push(E));
          }
          b = m.pop();
        }
        return d;
      }, r.prototype.collides = function(g) {
        var b = this.data;
        if (!w(g, b)) return !1;
        for (var d = []; b; ) {
          for (var y = 0; y < b.children.length; y++) {
            var m = b.children[y], S = b.leaf ? this.toBBox(m) : m;
            if (w(g, S)) {
              if (b.leaf || x(g, S)) return !0;
              d.push(m);
            }
          }
          b = d.pop();
        }
        return !1;
      }, r.prototype.load = function(g) {
        if (!g || !g.length) return this;
        if (g.length < this._minEntries) {
          for (var b = 0; b < g.length; b++) this.insert(g[b]);
          return this;
        }
        var d = this._build(g.slice(), 0, g.length - 1, 0);
        if (this.data.children.length) if (this.data.height === d.height) this._splitRoot(this.data, d);
        else {
          if (this.data.height < d.height) {
            var y = this.data;
            this.data = d, d = y;
          }
          this._insert(d, this.data.height - d.height - 1, !0);
        }
        else this.data = d;
        return this;
      }, r.prototype.insert = function(g) {
        return g && this._insert(g, this.data.height - 1), this;
      }, r.prototype.clear = function() {
        return this.data = I([]), this;
      }, r.prototype.remove = function(g, b) {
        if (!g) return this;
        for (var d, y, m, S = this.data, E = this.toBBox(g), k = [], N = []; S || k.length; ) {
          if (S || (S = k.pop(), y = k[k.length - 1], d = N.pop(), m = !0), S.leaf) {
            var P = s(g, S.children, b);
            if (P !== -1) return S.children.splice(P, 1), k.push(S), this._condense(k), this;
          }
          m || S.leaf || !x(S, E) ? y ? (d++, S = y.children[d], m = !1) : S = null : (k.push(S), N.push(d), d = 0, y = S, S = S.children[0]);
        }
        return this;
      }, r.prototype.toBBox = function(g) {
        return g;
      }, r.prototype.compareMinX = function(g, b) {
        return g.minX - b.minX;
      }, r.prototype.compareMinY = function(g, b) {
        return g.minY - b.minY;
      }, r.prototype.toJSON = function() {
        return this.data;
      }, r.prototype.fromJSON = function(g) {
        return this.data = g, this;
      }, r.prototype._all = function(g, b) {
        for (var d = []; g; ) g.leaf ? b.push.apply(b, g.children) : d.push.apply(d, g.children), g = d.pop();
        return b;
      }, r.prototype._build = function(g, b, d, y) {
        var m, S = d - b + 1, E = this._maxEntries;
        if (S <= E) return a(m = I(g.slice(b, d + 1)), this.toBBox), m;
        y || (y = Math.ceil(Math.log(S) / Math.log(E)), E = Math.ceil(S / Math.pow(E, y - 1))), (m = I([])).leaf = !1, m.height = y;
        var k = Math.ceil(S / E), N = k * Math.ceil(Math.sqrt(E));
        M(g, b, d, N, this.compareMinX);
        for (var P = b; P <= d; P += N) {
          var C = Math.min(P + N - 1, d);
          M(g, P, C, k, this.compareMinY);
          for (var D = P; D <= C; D += k) {
            var v = Math.min(D + k - 1, C);
            m.children.push(this._build(g, D, v, y - 1));
          }
        }
        return a(m, this.toBBox), m;
      }, r.prototype._chooseSubtree = function(g, b, d, y) {
        for (; y.push(b), !b.leaf && y.length - 1 !== d; ) {
          for (var m = 1 / 0, S = 1 / 0, E = void 0, k = 0; k < b.children.length; k++) {
            var N = b.children[k], P = u(N), C = (D = g, v = N, (Math.max(v.maxX, D.maxX) - Math.min(v.minX, D.minX)) * (Math.max(v.maxY, D.maxY) - Math.min(v.minY, D.minY)) - P);
            C < S ? (S = C, m = P < m ? P : m, E = N) : C === S && P < m && (m = P, E = N);
          }
          b = E || b.children[0];
        }
        var D, v;
        return b;
      }, r.prototype._insert = function(g, b, d) {
        var y = d ? g : this.toBBox(g), m = [], S = this._chooseSubtree(y, this.data, b, m);
        for (S.children.push(g), h(S, y); b >= 0 && m[b].children.length > this._maxEntries; ) this._split(m, b), b--;
        this._adjustParentBBoxes(y, m, b);
      }, r.prototype._split = function(g, b) {
        var d = g[b], y = d.children.length, m = this._minEntries;
        this._chooseSplitAxis(d, m, y);
        var S = this._chooseSplitIndex(d, m, y), E = I(d.children.splice(S, d.children.length - S));
        E.height = d.height, E.leaf = d.leaf, a(d, this.toBBox), a(E, this.toBBox), b ? g[b - 1].children.push(E) : this._splitRoot(d, E);
      }, r.prototype._splitRoot = function(g, b) {
        this.data = I([g, b]), this.data.height = g.height + 1, this.data.leaf = !1, a(this.data, this.toBBox);
      }, r.prototype._chooseSplitIndex = function(g, b, d) {
        for (var y, m, S, E, k, N, P, C = 1 / 0, D = 1 / 0, v = b; v <= d - b; v++) {
          var O = c(g, 0, v, this.toBBox), A = c(g, v, d, this.toBBox), T = (m = O, S = A, E = void 0, k = void 0, N = void 0, P = void 0, E = Math.max(m.minX, S.minX), k = Math.max(m.minY, S.minY), N = Math.min(m.maxX, S.maxX), P = Math.min(m.maxY, S.maxY), Math.max(0, N - E) * Math.max(0, P - k)), X = u(O) + u(A);
          T < C ? (C = T, y = v, D = X < D ? X : D) : T === C && X < D && (D = X, y = v);
        }
        return y || d - b;
      }, r.prototype._chooseSplitAxis = function(g, b, d) {
        var y = g.leaf ? this.compareMinX : f, m = g.leaf ? this.compareMinY : l;
        this._allDistMargin(g, b, d, y) < this._allDistMargin(g, b, d, m) && g.children.sort(y);
      }, r.prototype._allDistMargin = function(g, b, d, y) {
        g.children.sort(y);
        for (var m = this.toBBox, S = c(g, 0, b, m), E = c(g, d - b, d, m), k = p(S) + p(E), N = b; N < d - b; N++) {
          var P = g.children[N];
          h(S, g.leaf ? m(P) : P), k += p(S);
        }
        for (var C = d - b - 1; C >= b; C--) {
          var D = g.children[C];
          h(E, g.leaf ? m(D) : D), k += p(E);
        }
        return k;
      }, r.prototype._adjustParentBBoxes = function(g, b, d) {
        for (var y = d; y >= 0; y--) h(b[y], g);
      }, r.prototype._condense = function(g) {
        for (var b = g.length - 1, d = void 0; b >= 0; b--) g[b].children.length === 0 ? b > 0 ? (d = g[b - 1].children).splice(d.indexOf(g[b]), 1) : this.clear() : a(g[b], this.toBBox);
      }, r;
    });
  })(ke)), ke.exports;
}
const Ri = /* @__PURE__ */ Bi(yi);
var Zt = { exports: {} }, De, hn;
function Di() {
  return hn || (hn = 1, De = function(t, n, i, o) {
    var r = t[0], s = t[1], a = !1;
    i === void 0 && (i = 0), o === void 0 && (o = n.length);
    for (var c = (o - i) / 2, h = 0, f = c - 1; h < c; f = h++) {
      var l = n[i + h * 2 + 0], u = n[i + h * 2 + 1], p = n[i + f * 2 + 0], x = n[i + f * 2 + 1], w = u > s != x > s && r < (p - l) * (s - u) / (x - u) + l;
      w && (a = !a);
    }
    return a;
  }), De;
}
var $e, fn;
function $i() {
  return fn || (fn = 1, $e = function(t, n, i, o) {
    var r = t[0], s = t[1], a = !1;
    i === void 0 && (i = 0), o === void 0 && (o = n.length);
    for (var c = o - i, h = 0, f = c - 1; h < c; f = h++) {
      var l = n[h + i][0], u = n[h + i][1], p = n[f + i][0], x = n[f + i][1], w = u > s != x > s && r < (p - l) * (s - u) / (x - u) + l;
      w && (a = !a);
    }
    return a;
  }), $e;
}
var un;
function Yi() {
  if (un) return Zt.exports;
  un = 1;
  var e = Di(), t = $i();
  return Zt.exports = function(i, o, r, s) {
    return o.length > 0 && Array.isArray(o[0]) ? t(i, o, r, s) : e(i, o, r, s);
  }, Zt.exports.nested = t, Zt.exports.flat = e, Zt.exports;
}
var ee = { exports: {} }, Li = ee.exports, dn;
function Vi() {
  return dn || (dn = 1, (function(e, t) {
    (function(n, i) {
      i(t);
    })(Li, function(n) {
      const o = 33306690738754706e-32;
      function r(w, I, M, g, b) {
        let d, y, m, S, E = I[0], k = g[0], N = 0, P = 0;
        k > E == k > -E ? (d = E, E = I[++N]) : (d = k, k = g[++P]);
        let C = 0;
        if (N < w && P < M) for (k > E == k > -E ? (m = d - ((y = E + d) - E), E = I[++N]) : (m = d - ((y = k + d) - k), k = g[++P]), d = y, m !== 0 && (b[C++] = m); N < w && P < M; ) k > E == k > -E ? (m = d - ((y = d + E) - (S = y - d)) + (E - S), E = I[++N]) : (m = d - ((y = d + k) - (S = y - d)) + (k - S), k = g[++P]), d = y, m !== 0 && (b[C++] = m);
        for (; N < w; ) m = d - ((y = d + E) - (S = y - d)) + (E - S), E = I[++N], d = y, m !== 0 && (b[C++] = m);
        for (; P < M; ) m = d - ((y = d + k) - (S = y - d)) + (k - S), k = g[++P], d = y, m !== 0 && (b[C++] = m);
        return d === 0 && C !== 0 || (b[C++] = d), C;
      }
      function s(w) {
        return new Float64Array(w);
      }
      const a = 33306690738754716e-32, c = 22204460492503146e-32, h = 11093356479670487e-47, f = s(4), l = s(8), u = s(12), p = s(16), x = s(4);
      n.orient2d = function(w, I, M, g, b, d) {
        const y = (I - d) * (M - b), m = (w - b) * (g - d), S = y - m;
        if (y === 0 || m === 0 || y > 0 != m > 0) return S;
        const E = Math.abs(y + m);
        return Math.abs(S) >= a * E ? S : -(function(k, N, P, C, D, v, O) {
          let A, T, X, R, _, B, F, $, L, V, U, j, G, J, H, Q, Z, W;
          const st = k - D, ht = P - D, rt = N - v, ot = C - v;
          _ = (H = ($ = st - (F = (B = 134217729 * st) - (B - st))) * (V = ot - (L = (B = 134217729 * ot) - (B - ot))) - ((J = st * ot) - F * L - $ * L - F * V)) - (U = H - (Z = ($ = rt - (F = (B = 134217729 * rt) - (B - rt))) * (V = ht - (L = (B = 134217729 * ht) - (B - ht))) - ((Q = rt * ht) - F * L - $ * L - F * V))), f[0] = H - (U + _) + (_ - Z), _ = (G = J - ((j = J + U) - (_ = j - J)) + (U - _)) - (U = G - Q), f[1] = G - (U + _) + (_ - Q), _ = (W = j + U) - j, f[2] = j - (W - _) + (U - _), f[3] = W;
          let Ct = (function(ii, Ke) {
            let He = Ke[0];
            for (let Ie = 1; Ie < ii; Ie++) He += Ke[Ie];
            return He;
          })(4, f), Wt = c * O;
          if (Ct >= Wt || -Ct >= Wt || (A = k - (st + (_ = k - st)) + (_ - D), X = P - (ht + (_ = P - ht)) + (_ - D), T = N - (rt + (_ = N - rt)) + (_ - v), R = C - (ot + (_ = C - ot)) + (_ - v), A === 0 && T === 0 && X === 0 && R === 0) || (Wt = h * O + o * Math.abs(Ct), (Ct += st * R + ot * A - (rt * X + ht * T)) >= Wt || -Ct >= Wt)) return Ct;
          _ = (H = ($ = A - (F = (B = 134217729 * A) - (B - A))) * (V = ot - (L = (B = 134217729 * ot) - (B - ot))) - ((J = A * ot) - F * L - $ * L - F * V)) - (U = H - (Z = ($ = T - (F = (B = 134217729 * T) - (B - T))) * (V = ht - (L = (B = 134217729 * ht) - (B - ht))) - ((Q = T * ht) - F * L - $ * L - F * V))), x[0] = H - (U + _) + (_ - Z), _ = (G = J - ((j = J + U) - (_ = j - J)) + (U - _)) - (U = G - Q), x[1] = G - (U + _) + (_ - Q), _ = (W = j + U) - j, x[2] = j - (W - _) + (U - _), x[3] = W;
          const ti = r(4, f, 4, x, l);
          _ = (H = ($ = st - (F = (B = 134217729 * st) - (B - st))) * (V = R - (L = (B = 134217729 * R) - (B - R))) - ((J = st * R) - F * L - $ * L - F * V)) - (U = H - (Z = ($ = rt - (F = (B = 134217729 * rt) - (B - rt))) * (V = X - (L = (B = 134217729 * X) - (B - X))) - ((Q = rt * X) - F * L - $ * L - F * V))), x[0] = H - (U + _) + (_ - Z), _ = (G = J - ((j = J + U) - (_ = j - J)) + (U - _)) - (U = G - Q), x[1] = G - (U + _) + (_ - Q), _ = (W = j + U) - j, x[2] = j - (W - _) + (U - _), x[3] = W;
          const ei = r(ti, l, 4, x, u);
          _ = (H = ($ = A - (F = (B = 134217729 * A) - (B - A))) * (V = R - (L = (B = 134217729 * R) - (B - R))) - ((J = A * R) - F * L - $ * L - F * V)) - (U = H - (Z = ($ = T - (F = (B = 134217729 * T) - (B - T))) * (V = X - (L = (B = 134217729 * X) - (B - X))) - ((Q = T * X) - F * L - $ * L - F * V))), x[0] = H - (U + _) + (_ - Z), _ = (G = J - ((j = J + U) - (_ = j - J)) + (U - _)) - (U = G - Q), x[1] = G - (U + _) + (_ - Q), _ = (W = j + U) - j, x[2] = j - (W - _) + (U - _), x[3] = W;
          const ni = r(ei, u, 4, x, p);
          return p[ni - 1];
        })(w, I, M, g, b, d, E);
      }, n.orient2dfast = function(w, I, M, g, b, d) {
        return (I - d) * (M - b) - (w - b) * (g - d);
      }, Object.defineProperty(n, "__esModule", { value: !0 });
    });
  })(ee, ee.exports)), ee.exports;
}
var pn;
function ji() {
  if (pn) return ye.exports;
  pn = 1;
  var e = Fi(), t = Ri, n = Yi(), i = Vi().orient2d;
  t.default && (t = t.default), ye.exports = o, ye.exports.default = o;
  function o(d, y, m) {
    y = Math.max(0, y === void 0 ? 2 : y), m = m || 0;
    var S = p(d), E = new e(16);
    E.toBBox = function(F) {
      return {
        minX: F[0],
        minY: F[1],
        maxX: F[0],
        maxY: F[1]
      };
    }, E.compareMinX = function(F, $) {
      return F[0] - $[0];
    }, E.compareMinY = function(F, $) {
      return F[1] - $[1];
    }, E.load(d);
    for (var k = [], N = 0, P; N < S.length; N++) {
      var C = S[N];
      E.remove(C), P = x(C, P), k.push(P);
    }
    var D = new e(16);
    for (N = 0; N < k.length; N++) D.insert(u(k[N]));
    for (var v = y * y, O = m * m; k.length; ) {
      var A = k.shift(), T = A.p, X = A.next.p, R = w(T, X);
      if (!(R < O)) {
        var _ = R / v;
        C = r(E, A.prev.p, T, X, A.next.next.p, _, D), C && Math.min(w(C, T), w(C, X)) <= _ && (k.push(A), k.push(x(C, A)), E.remove(C), D.remove(A), D.insert(u(A)), D.insert(u(A.next)));
      }
    }
    A = P;
    var B = [];
    do
      B.push(A.p), A = A.next;
    while (A !== P);
    return B.push(A.p), B;
  }
  function r(d, y, m, S, E, k, N) {
    for (var P = new t([], s), C = d.data; C; ) {
      for (var D = 0; D < C.children.length; D++) {
        var v = C.children[D], O = C.leaf ? I(v, m, S) : a(m, S, v);
        O > k || P.push({
          node: v,
          dist: O
        });
      }
      for (; P.length && !P.peek().node.children; ) {
        var A = P.pop(), T = A.node, X = I(T, y, m), R = I(T, S, E);
        if (A.dist < X && A.dist < R && h(m, T, N) && h(S, T, N)) return T;
      }
      C = P.pop(), C && (C = C.node);
    }
    return null;
  }
  function s(d, y) {
    return d.dist - y.dist;
  }
  function a(d, y, m) {
    if (c(d, m) || c(y, m)) return 0;
    var S = M(d[0], d[1], y[0], y[1], m.minX, m.minY, m.maxX, m.minY);
    if (S === 0) return 0;
    var E = M(d[0], d[1], y[0], y[1], m.minX, m.minY, m.minX, m.maxY);
    if (E === 0) return 0;
    var k = M(d[0], d[1], y[0], y[1], m.maxX, m.minY, m.maxX, m.maxY);
    if (k === 0) return 0;
    var N = M(d[0], d[1], y[0], y[1], m.minX, m.maxY, m.maxX, m.maxY);
    return N === 0 ? 0 : Math.min(S, E, k, N);
  }
  function c(d, y) {
    return d[0] >= y.minX && d[0] <= y.maxX && d[1] >= y.minY && d[1] <= y.maxY;
  }
  function h(d, y, m) {
    for (var S = Math.min(d[0], y[0]), E = Math.min(d[1], y[1]), k = Math.max(d[0], y[0]), N = Math.max(d[1], y[1]), P = m.search({ minX: S, minY: E, maxX: k, maxY: N }), C = 0; C < P.length; C++)
      if (l(P[C].p, P[C].next.p, d, y)) return !1;
    return !0;
  }
  function f(d, y, m) {
    return i(d[0], d[1], y[0], y[1], m[0], m[1]);
  }
  function l(d, y, m, S) {
    return d !== S && y !== m && f(d, y, m) > 0 != f(d, y, S) > 0 && f(m, S, d) > 0 != f(m, S, y) > 0;
  }
  function u(d) {
    var y = d.p, m = d.next.p;
    return d.minX = Math.min(y[0], m[0]), d.minY = Math.min(y[1], m[1]), d.maxX = Math.max(y[0], m[0]), d.maxY = Math.max(y[1], m[1]), d;
  }
  function p(d) {
    for (var y = d[0], m = d[0], S = d[0], E = d[0], k = 0; k < d.length; k++) {
      var N = d[k];
      N[0] < y[0] && (y = N), N[0] > S[0] && (S = N), N[1] < m[1] && (m = N), N[1] > E[1] && (E = N);
    }
    var P = [y, m, S, E], C = P.slice();
    for (k = 0; k < d.length; k++)
      n(d[k], P) || C.push(d[k]);
    return b(C);
  }
  function x(d, y) {
    var m = {
      p: d,
      prev: null,
      next: null,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };
    return y ? (m.next = y.next, m.prev = y, y.next.prev = m, y.next = m) : (m.prev = m, m.next = m), m;
  }
  function w(d, y) {
    var m = d[0] - y[0], S = d[1] - y[1];
    return m * m + S * S;
  }
  function I(d, y, m) {
    var S = y[0], E = y[1], k = m[0] - S, N = m[1] - E;
    if (k !== 0 || N !== 0) {
      var P = ((d[0] - S) * k + (d[1] - E) * N) / (k * k + N * N);
      P > 1 ? (S = m[0], E = m[1]) : P > 0 && (S += k * P, E += N * P);
    }
    return k = d[0] - S, N = d[1] - E, k * k + N * N;
  }
  function M(d, y, m, S, E, k, N, P) {
    var C = m - d, D = S - y, v = N - E, O = P - k, A = d - E, T = y - k, X = C * C + D * D, R = C * v + D * O, _ = v * v + O * O, B = C * A + D * T, F = v * A + O * T, $ = X * _ - R * R, L, V, U, j, G = $, J = $;
    $ === 0 ? (V = 0, G = 1, j = F, J = _) : (V = R * F - _ * B, j = X * F - R * B, V < 0 ? (V = 0, j = F, J = _) : V > G && (V = G, j = F + R, J = _)), j < 0 ? (j = 0, -B < 0 ? V = 0 : -B > X ? V = G : (V = -B, G = X)) : j > J && (j = J, -B + R < 0 ? V = 0 : -B + R > X ? V = G : (V = -B + R, G = X)), L = V === 0 ? 0 : V / G, U = j === 0 ? 0 : j / J;
    var H = (1 - L) * d + L * m, Q = (1 - L) * y + L * S, Z = (1 - U) * E + U * N, W = (1 - U) * k + U * P, st = Z - H, ht = W - Q;
    return st * st + ht * ht;
  }
  function g(d, y) {
    return d[0] === y[0] ? d[1] - y[1] : d[0] - y[0];
  }
  function b(d) {
    d.sort(g);
    for (var y = [], m = 0; m < d.length; m++) {
      for (; y.length >= 2 && f(y[y.length - 2], y[y.length - 1], d[m]) <= 0; )
        y.pop();
      y.push(d[m]);
    }
    for (var S = [], E = d.length - 1; E >= 0; E--) {
      for (; S.length >= 2 && f(S[S.length - 2], S[S.length - 1], d[E]) <= 0; )
        S.pop();
      S.push(d[E]);
    }
    return S.pop(), y.pop(), y.concat(S);
  }
  return ye.exports;
}
var Ui = ji();
const qi = /* @__PURE__ */ Ti(Ui);
function mn(e, t = {}) {
  t.concavity = t.concavity || 1 / 0;
  const n = [];
  if (ze(e, (o) => {
    n.push([o[0], o[1]]);
  }), !n.length)
    return null;
  const i = qi(n, t.concavity);
  return i.length > 3 ? le([i], t.properties) : null;
}
function jn(e, t, n = {}) {
  const i = { type: "Feature" };
  return (n.id === 0 || n.id) && (i.id = n.id), n.bbox && (i.bbox = n.bbox), i.properties = t || {}, i.geometry = e, i;
}
function se(e, t, n = {}) {
  if (!e)
    throw new Error("coordinates is required");
  if (!Array.isArray(e))
    throw new Error("coordinates must be an Array");
  if (e.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!gn(e[0]) || !gn(e[1]))
    throw new Error("coordinates must contain numbers");
  return jn({
    type: "Point",
    coordinates: e
  }, t, n);
}
function Un(e, t, n = {}) {
  for (const i of e) {
    if (i.length < 4)
      throw new Error(
        "Each LinearRing of a Polygon must have 4 or more Positions."
      );
    if (i[i.length - 1].length !== i[0].length)
      throw new Error("First and last Position are not equivalent.");
    for (let o = 0; o < i[i.length - 1].length; o++)
      if (i[i.length - 1][o] !== i[0][o])
        throw new Error("First and last Position are not equivalent.");
  }
  return jn({
    type: "Polygon",
    coordinates: e
  }, t, n);
}
function Qt(e, t = {}) {
  const n = { type: "FeatureCollection" };
  return t.id && (n.id = t.id), t.bbox && (n.bbox = t.bbox), n.features = e, n;
}
function gn(e) {
  return !isNaN(e) && e !== null && !Array.isArray(e);
}
function zi(e) {
  if (!e)
    throw new Error("coord is required");
  if (!Array.isArray(e)) {
    if (e.type === "Feature" && e.geometry !== null && e.geometry.type === "Point")
      return [...e.geometry.coordinates];
    if (e.type === "Point")
      return [...e.coordinates];
  }
  if (Array.isArray(e) && e.length >= 2 && !Array.isArray(e[0]) && !Array.isArray(e[1]))
    return [...e];
  throw new Error("coord must be GeoJSON Point or an Array of numbers");
}
function wn(e) {
  if (Array.isArray(e))
    return e;
  if (e.type === "Feature") {
    if (e.geometry !== null)
      return e.geometry.coordinates;
  } else if (e.coordinates)
    return e.coordinates;
  throw new Error(
    "coords must be GeoJSON Feature, Geometry Object or an Array"
  );
}
function Ji(e) {
  return e.type === "Feature" ? e.geometry : e;
}
const Bt = 11102230246251565e-32, dt = 134217729, Gi = (3 + 8 * Bt) * Bt;
function Ye(e, t, n, i, o) {
  let r, s, a, c, h = t[0], f = i[0], l = 0, u = 0;
  f > h == f > -h ? (r = h, h = t[++l]) : (r = f, f = i[++u]);
  let p = 0;
  if (l < e && u < n)
    for (f > h == f > -h ? (s = h + r, a = r - (s - h), h = t[++l]) : (s = f + r, a = r - (s - f), f = i[++u]), r = s, a !== 0 && (o[p++] = a); l < e && u < n; )
      f > h == f > -h ? (s = r + h, c = s - r, a = r - (s - c) + (h - c), h = t[++l]) : (s = r + f, c = s - r, a = r - (s - c) + (f - c), f = i[++u]), r = s, a !== 0 && (o[p++] = a);
  for (; l < e; )
    s = r + h, c = s - r, a = r - (s - c) + (h - c), h = t[++l], r = s, a !== 0 && (o[p++] = a);
  for (; u < n; )
    s = r + f, c = s - r, a = r - (s - c) + (f - c), f = i[++u], r = s, a !== 0 && (o[p++] = a);
  return (r !== 0 || p === 0) && (o[p++] = r), p;
}
function Ki(e, t) {
  let n = t[0];
  for (let i = 1; i < e; i++) n += t[i];
  return n;
}
function fe(e) {
  return new Float64Array(e);
}
const Hi = (3 + 16 * Bt) * Bt, Qi = (2 + 12 * Bt) * Bt, Wi = (9 + 64 * Bt) * Bt * Bt, Gt = fe(4), yn = fe(8), vn = fe(12), bn = fe(16), vt = fe(4);
function Zi(e, t, n, i, o, r, s) {
  let a, c, h, f, l, u, p, x, w, I, M, g, b, d, y, m, S, E;
  const k = e - o, N = n - o, P = t - r, C = i - r;
  d = k * C, u = dt * k, p = u - (u - k), x = k - p, u = dt * C, w = u - (u - C), I = C - w, y = x * I - (d - p * w - x * w - p * I), m = P * N, u = dt * P, p = u - (u - P), x = P - p, u = dt * N, w = u - (u - N), I = N - w, S = x * I - (m - p * w - x * w - p * I), M = y - S, l = y - M, Gt[0] = y - (M + l) + (l - S), g = d + M, l = g - d, b = d - (g - l) + (M - l), M = b - m, l = b - M, Gt[1] = b - (M + l) + (l - m), E = g + M, l = E - g, Gt[2] = g - (E - l) + (M - l), Gt[3] = E;
  let D = Ki(4, Gt), v = Qi * s;
  if (D >= v || -D >= v || (l = e - k, a = e - (k + l) + (l - o), l = n - N, h = n - (N + l) + (l - o), l = t - P, c = t - (P + l) + (l - r), l = i - C, f = i - (C + l) + (l - r), a === 0 && c === 0 && h === 0 && f === 0) || (v = Wi * s + Gi * Math.abs(D), D += k * f + C * a - (P * h + N * c), D >= v || -D >= v)) return D;
  d = a * C, u = dt * a, p = u - (u - a), x = a - p, u = dt * C, w = u - (u - C), I = C - w, y = x * I - (d - p * w - x * w - p * I), m = c * N, u = dt * c, p = u - (u - c), x = c - p, u = dt * N, w = u - (u - N), I = N - w, S = x * I - (m - p * w - x * w - p * I), M = y - S, l = y - M, vt[0] = y - (M + l) + (l - S), g = d + M, l = g - d, b = d - (g - l) + (M - l), M = b - m, l = b - M, vt[1] = b - (M + l) + (l - m), E = g + M, l = E - g, vt[2] = g - (E - l) + (M - l), vt[3] = E;
  const O = Ye(4, Gt, 4, vt, yn);
  d = k * f, u = dt * k, p = u - (u - k), x = k - p, u = dt * f, w = u - (u - f), I = f - w, y = x * I - (d - p * w - x * w - p * I), m = P * h, u = dt * P, p = u - (u - P), x = P - p, u = dt * h, w = u - (u - h), I = h - w, S = x * I - (m - p * w - x * w - p * I), M = y - S, l = y - M, vt[0] = y - (M + l) + (l - S), g = d + M, l = g - d, b = d - (g - l) + (M - l), M = b - m, l = b - M, vt[1] = b - (M + l) + (l - m), E = g + M, l = E - g, vt[2] = g - (E - l) + (M - l), vt[3] = E;
  const A = Ye(O, yn, 4, vt, vn);
  d = a * f, u = dt * a, p = u - (u - a), x = a - p, u = dt * f, w = u - (u - f), I = f - w, y = x * I - (d - p * w - x * w - p * I), m = c * h, u = dt * c, p = u - (u - c), x = c - p, u = dt * h, w = u - (u - h), I = h - w, S = x * I - (m - p * w - x * w - p * I), M = y - S, l = y - M, vt[0] = y - (M + l) + (l - S), g = d + M, l = g - d, b = d - (g - l) + (M - l), M = b - m, l = b - M, vt[1] = b - (M + l) + (l - m), E = g + M, l = E - g, vt[2] = g - (E - l) + (M - l), vt[3] = E;
  const T = Ye(A, vn, 4, vt, bn);
  return bn[T - 1];
}
function tr(e, t, n, i, o, r) {
  const s = (t - r) * (n - o), a = (e - o) * (i - r), c = s - a, h = Math.abs(s + a);
  return Math.abs(c) >= Hi * h ? c : -Zi(e, t, n, i, o, r, h);
}
function er(e, t) {
  var n, i, o = 0, r, s, a, c, h, f, l, u = e[0], p = e[1], x = t.length;
  for (n = 0; n < x; n++) {
    i = 0;
    var w = t[n], I = w.length - 1;
    if (f = w[0], f[0] !== w[I][0] && f[1] !== w[I][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (s = f[0] - u, a = f[1] - p, i; i < I; i++) {
      if (l = w[i + 1], c = l[0] - u, h = l[1] - p, a === 0 && h === 0) {
        if (c <= 0 && s >= 0 || s <= 0 && c >= 0)
          return 0;
      } else if (h >= 0 && a <= 0 || h <= 0 && a >= 0) {
        if (r = tr(s, c, a, h, 0, 0), r === 0)
          return 0;
        (r > 0 && h > 0 && a <= 0 || r < 0 && h <= 0 && a > 0) && o++;
      }
      f = l, a = h, s = c;
    }
  }
  return o % 2 !== 0;
}
function je(e, t, n = {}) {
  if (!e)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const i = zi(e), o = Ji(t), r = o.type, s = t.bbox;
  let a = o.coordinates;
  if (s && nr(i, s) === !1)
    return !1;
  r === "Polygon" && (a = [a]);
  for (var c = 0; c < a.length; ++c) {
    const h = er(i, a[c]);
    if (h === 0 && !n.ignoreBoundary || h) return !0;
  }
  return !1;
}
function nr(e, t) {
  return t[0] <= e[0] && t[1] <= e[1] && t[2] >= e[0] && t[3] >= e[1];
}
function Le(e, t) {
  for (let n = 0; n < t.features.length; n++)
    if (je(e, t.features[n]))
      return t.features[n];
}
function qn(e, t) {
  const n = t.geometry.coordinates[0][0], i = t.geometry.coordinates[0][1], o = t.geometry.coordinates[0][2], r = e.geometry.coordinates, s = t.properties.a.geom, a = t.properties.b.geom, c = t.properties.c.geom, h = [i[0] - n[0], i[1] - n[1]], f = [o[0] - n[0], o[1] - n[1]], l = [r[0] - n[0], r[1] - n[1]], u = [a[0] - s[0], a[1] - s[1]], p = [c[0] - s[0], c[1] - s[1]], x = (f[1] * l[0] - f[0] * l[1]) / (h[0] * f[1] - h[1] * f[0]), w = (h[0] * l[1] - h[1] * l[0]) / (h[0] * f[1] - h[1] * f[0]);
  return [
    x * u[0] + w * p[0] + s[0],
    x * u[1] + w * p[1] + s[1]
  ];
}
function ir(e, t, n) {
  const i = e.geometry.coordinates, o = n.geometry.coordinates, r = Math.atan2(i[0] - o[0], i[1] - o[1]), s = rr(r, t[0]);
  if (s === void 0)
    throw new Error("Unable to determine vertex index");
  const a = t[1][s];
  return qn(e, a.features[0]);
}
function ne(e, t, n, i, o, r, s, a) {
  let c;
  if (s && (c = Le(e, Qt([s]))), !c)
    if (n) {
      const h = e.geometry.coordinates, f = n.gridNum, l = n.xOrigin, u = n.yOrigin, p = n.xUnit, x = n.yUnit, w = n.gridCache, I = It(h[0], l, p, f), M = It(h[1], u, x, f), g = w[I] ? w[I][M] ? w[I][M] : [] : [], b = Qt(g.map((d) => t.features[d]));
      c = Le(e, b);
    } else
      c = Le(e, t);
  return a && a(c), c ? qn(e, c) : ir(e, i, o);
}
function It(e, t, n, i) {
  let o = Math.floor((e - t) / n);
  return o < 0 && (o = 0), o >= i && (o = i - 1), o;
}
function rr(e, t) {
  let n = xn(e - t[0]), i = Math.PI * 2, o;
  for (let r = 0; r < t.length; r++) {
    const s = (r + 1) % t.length, a = xn(e - t[s]), c = Math.min(Math.abs(n), Math.abs(a));
    n * a <= 0 && c < i && (i = c, o = r), n = a;
  }
  return o;
}
function xn(e, t = !1) {
  const n = 2 * Math.PI, i = e - Math.floor(e / n) * n;
  return t ? i : i > Math.PI ? i - n : i;
}
function _n(e) {
  const t = e.features;
  for (let n = 0; n < t.length; n++) {
    const i = t[n];
    `${i.properties.a.index}`.substring(0, 1) === "b" && `${i.properties.b.index}`.substring(0, 1) === "b" ? t[n] = {
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            i.geometry.coordinates[0][2],
            i.geometry.coordinates[0][0],
            i.geometry.coordinates[0][1],
            i.geometry.coordinates[0][2]
          ]
        ]
      },
      properties: {
        a: {
          geom: i.properties.c.geom,
          index: i.properties.c.index
        },
        b: {
          geom: i.properties.a.geom,
          index: i.properties.a.index
        },
        c: {
          geom: i.properties.b.geom,
          index: i.properties.b.index
        }
      },
      type: "Feature"
    } : `${i.properties.c.index}`.substring(0, 1) === "b" && `${i.properties.a.index}`.substring(0, 1) === "b" && (t[n] = {
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            i.geometry.coordinates[0][1],
            i.geometry.coordinates[0][2],
            i.geometry.coordinates[0][0],
            i.geometry.coordinates[0][1]
          ]
        ]
      },
      properties: {
        a: {
          geom: i.properties.b.geom,
          index: i.properties.b.index
        },
        b: {
          geom: i.properties.c.geom,
          index: i.properties.c.index
        },
        c: {
          geom: i.properties.a.geom,
          index: i.properties.a.index
        }
      },
      type: "Feature"
    });
  }
  return e;
}
function zn(e) {
  const t = ["a", "b", "c", "a"].map(
    (r) => e.properties[r].geom
  ), n = e.geometry.coordinates[0], i = e.properties, o = {
    a: { geom: n[0], index: i.a.index },
    b: { geom: n[1], index: i.b.index },
    c: { geom: n[2], index: i.c.index }
  };
  return Un([t], o);
}
function or(e) {
  const t = [0, 1, 2, 0].map((i) => e[i][0][0]), n = {
    a: { geom: e[0][0][1], index: e[0][1] },
    b: { geom: e[1][0][1], index: e[1][1] },
    c: { geom: e[2][0][1], index: e[2][1] }
  };
  return Un([t], n);
}
function Ue(e, t, n, i, o, r = !1, s) {
  const a = e.map(
    (c) => {
      (!s || s < 2.00703) && (c = sr(c));
      const h = isFinite(c) ? t[c] : c === "c" ? i : (function() {
        const f = c.match(/^b(\d+)$/);
        if (f) return o[parseInt(f[1])];
        const l = c.match(/^e(\d+)$/);
        if (l) return n[parseInt(l[1])];
        throw new Error("Bad index value for indexesToTri");
      })();
      return r ? [[h[1], h[0]], c] : [[h[0], h[1]], c];
    }
  );
  return or(a);
}
function sr(e) {
  return typeof e == "number" ? e : e.replace(/^(c|e|b)(?:ent|dgeNode|box)(\d+)?$/, "$1$2");
}
function Jn(e, t) {
  return t && t >= 2.00703 || Array.isArray(e[0]) ? e : e.map((n) => [
    n.illstNodes,
    n.mercNodes,
    n.startEnd
  ]);
}
const ar = 2.00704;
function cr(e) {
  return !!(e.version !== void 0 || !e.tins && e.points && e.tins_points);
}
function lr(e) {
  return {
    points: e.points,
    strictStatus: fr(e),
    verticesParams: ur(e),
    centroid: dr(e),
    edges: Jn(e.edges || []),
    edgeNodes: e.edgeNodes || [],
    tins: pr(e),
    kinks: mr(e.kinks_points),
    yaxisMode: e.yaxisMode ?? "invert",
    strictMode: e.strictMode ?? "auto",
    vertexMode: e.vertexMode,
    bounds: e.bounds,
    boundsPolygon: e.boundsPolygon,
    wh: e.wh,
    xy: e.xy ?? [0, 0]
  };
}
function hr(e) {
  const t = gr(e), n = t.tins;
  return {
    compiled: t,
    tins: n,
    points: wr(n),
    strictStatus: t.strict_status,
    verticesParams: t.vertices_params,
    centroid: t.centroid,
    kinks: t.kinks
  };
}
function fr(e) {
  return e.strict_status ? e.strict_status : e.kinks_points ? "strict_error" : e.tins_points.length === 2 ? "loose" : "strict";
}
function ur(e) {
  const t = {
    forw: [e.vertices_params[0]],
    bakw: [e.vertices_params[1]]
  };
  return t.forw[1] = Mn(e, !1), t.bakw[1] = Mn(e, !0), t;
}
function Mn(e, t) {
  const n = e.vertices_points.length;
  return Array.from({ length: n }, (i, o) => {
    const r = (o + 1) % n, s = Ue(
      ["c", `b${o}`, `b${r}`],
      e.points,
      e.edgeNodes || [],
      e.centroid_point,
      e.vertices_points,
      t,
      ar
    );
    return Qt([s]);
  });
}
function dr(e) {
  return {
    forw: se(e.centroid_point[0], {
      target: {
        geom: e.centroid_point[1],
        index: "c"
      }
    }),
    bakw: se(e.centroid_point[1], {
      target: {
        geom: e.centroid_point[0],
        index: "c"
      }
    })
  };
}
function pr(e) {
  const t = e.tins_points.length === 1 ? 0 : 1;
  return {
    forw: Qt(
      e.tins_points[0].map(
        (n) => Ue(
          n,
          e.points,
          e.edgeNodes || [],
          e.centroid_point,
          e.vertices_points,
          !1,
          e.version
        )
      )
    ),
    bakw: Qt(
      e.tins_points[t].map(
        (n) => Ue(
          n,
          e.points,
          e.edgeNodes || [],
          e.centroid_point,
          e.vertices_points,
          !0,
          e.version
        )
      )
    )
  };
}
function mr(e) {
  if (e)
    return {
      bakw: Qt(
        e.map((t) => se(t))
      )
    };
}
function gr(e) {
  return JSON.parse(
    JSON.stringify(e).replace('"cent"', '"c"').replace(/"bbox(\d+)"/g, '"b$1"')
  );
}
function wr(e) {
  const t = [], n = e.forw.features;
  for (let i = 0; i < n.length; i++) {
    const o = n[i];
    ["a", "b", "c"].forEach((r, s) => {
      const a = o.geometry.coordinates[0][s], c = o.properties[r].geom, h = o.properties[r].index;
      typeof h == "number" && (t[h] = [a, c]);
    });
  }
  return t;
}
class Mt {
  /**
   * 各種モードの定数定義
   * すべてreadonlyで、型安全性を確保
   */
  static VERTEX_PLAIN = "plain";
  static VERTEX_BIRDEYE = "birdeye";
  static MODE_STRICT = "strict";
  static MODE_AUTO = "auto";
  static MODE_LOOSE = "loose";
  static STATUS_STRICT = "strict";
  static STATUS_ERROR = "strict_error";
  static STATUS_LOOSE = "loose";
  static YAXIS_FOLLOW = "follow";
  static YAXIS_INVERT = "invert";
  points = [];
  /** @deprecated 2.00704 以降、Transform はこのプロパティを設定も参照もしない。サブクラス（MaplatTin）は、旧 @maplat/transform と組まれたときの互換のため {} を入れる（t2 設計 §2.1） */
  pointsWeightBuffer;
  strict_status;
  vertices_params;
  centroid;
  edgeNodes;
  edges;
  tins;
  kinks;
  yaxisMode = Mt.YAXIS_INVERT;
  strictMode = Mt.MODE_AUTO;
  vertexMode = Mt.VERTEX_PLAIN;
  bounds;
  boundsPolygon;
  wh;
  xy;
  indexedTins;
  stateFull = !1;
  stateTriangle;
  stateBackward;
  /**
   * Optional properties for MaplatCore extension
   * These properties allow consuming applications to extend Transform instances
   * with additional metadata without requiring Module Augmentation
   */
  /** Layer priority for rendering order */
  priority;
  /** Layer importance for display decisions */
  importance;
  /** Bounds in XY (source) coordinate system */
  xyBounds;
  /** Bounds in Mercator (Web Mercator) coordinate system */
  mercBounds;
  constructor() {
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
    if (cr(t)) {
      this.applyModernState(lr(t));
      return;
    }
    this.applyLegacyState(hr(t));
  }
  applyModernState(t) {
    this.points = t.points, this.strict_status = t.strictStatus, this.vertices_params = t.verticesParams, this.centroid = t.centroid, this.edges = t.edges, this.edgeNodes = t.edgeNodes || [], this.tins = t.tins, this.addIndexedTin(), this.kinks = t.kinks, this.yaxisMode = t.yaxisMode ?? Mt.YAXIS_INVERT, this.vertexMode = t.vertexMode ?? Mt.VERTEX_PLAIN, this.strictMode = t.strictMode ?? Mt.MODE_AUTO, t.bounds ? (this.bounds = t.bounds, this.boundsPolygon = t.boundsPolygon, this.xy = t.xy, this.wh = t.wh) : (this.bounds = void 0, this.boundsPolygon = void 0, this.xy = t.xy ?? [0, 0], t.wh && (this.wh = t.wh));
  }
  applyLegacyState(t) {
    this.tins = t.tins, this.addIndexedTin(), this.strict_status = t.strictStatus, this.vertices_params = t.verticesParams, this.centroid = t.centroid, this.kinks = t.kinks, this.points = t.points;
  }
  /**
   * TINネットワークのインデックスを作成します
   *
   * インデックスは変換処理を高速化するために使用されます。
   * グリッド形式のインデックスを作成し、各グリッドに
   * 含まれる三角形を記録します。
   */
  addIndexedTin() {
    const t = this.tins, n = t.forw, i = t.bakw, o = Math.ceil(Math.sqrt(n.features.length));
    if (o < 3) {
      this.indexedTins = void 0;
      return;
    }
    let r = [], s = [];
    const a = n.features.map((w) => {
      let I = [];
      return wn(w)[0].map((M) => {
        r.length === 0 ? r = [Array.from(M), Array.from(M)] : (M[0] < r[0][0] && (r[0][0] = M[0]), M[0] > r[1][0] && (r[1][0] = M[0]), M[1] < r[0][1] && (r[0][1] = M[1]), M[1] > r[1][1] && (r[1][1] = M[1])), I.length === 0 ? I = [Array.from(M), Array.from(M)] : (M[0] < I[0][0] && (I[0][0] = M[0]), M[0] > I[1][0] && (I[1][0] = M[0]), M[1] < I[0][1] && (I[0][1] = M[1]), M[1] > I[1][1] && (I[1][1] = M[1]));
      }), I;
    }), c = (r[1][0] - r[0][0]) / o, h = (r[1][1] - r[0][1]) / o, f = a.reduce(
      (w, I, M) => {
        const g = It(I[0][0], r[0][0], c, o), b = It(I[1][0], r[0][0], c, o), d = It(I[0][1], r[0][1], h, o), y = It(I[1][1], r[0][1], h, o);
        for (let m = g; m <= b; m++) {
          w[m] || (w[m] = []);
          for (let S = d; S <= y; S++)
            w[m][S] || (w[m][S] = []), w[m][S].push(M);
        }
        return w;
      },
      []
    ), l = i.features.map((w) => {
      let I = [];
      return wn(w)[0].map((M) => {
        s.length === 0 ? s = [Array.from(M), Array.from(M)] : (M[0] < s[0][0] && (s[0][0] = M[0]), M[0] > s[1][0] && (s[1][0] = M[0]), M[1] < s[0][1] && (s[0][1] = M[1]), M[1] > s[1][1] && (s[1][1] = M[1])), I.length === 0 ? I = [Array.from(M), Array.from(M)] : (M[0] < I[0][0] && (I[0][0] = M[0]), M[0] > I[1][0] && (I[1][0] = M[0]), M[1] < I[0][1] && (I[0][1] = M[1]), M[1] > I[1][1] && (I[1][1] = M[1]));
      }), I;
    }), u = (s[1][0] - s[0][0]) / o, p = (s[1][1] - s[0][1]) / o, x = l.reduce(
      (w, I, M) => {
        const g = It(I[0][0], s[0][0], u, o), b = It(I[1][0], s[0][0], u, o), d = It(I[0][1], s[0][1], p, o), y = It(I[1][1], s[0][1], p, o);
        for (let m = g; m <= b; m++) {
          w[m] || (w[m] = []);
          for (let S = d; S <= y; S++)
            w[m][S] || (w[m][S] = []), w[m][S].push(M);
        }
        return w;
      },
      []
    );
    this.indexedTins = {
      forw: {
        gridNum: o,
        xOrigin: r[0][0],
        yOrigin: r[0][1],
        xUnit: c,
        yUnit: h,
        gridCache: f
      },
      bakw: {
        gridNum: o,
        xOrigin: s[0][0],
        yOrigin: s[0][1],
        xUnit: u,
        yUnit: p,
        gridCache: x
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
  transform(t, n, i) {
    if (!this.tins)
      throw new Error("setCompiled() must be called before transform()");
    if (n && this.strict_status == Mt.STATUS_ERROR)
      throw new Error('Backward transform is not allowed if strict_status == "strict_error"');
    this.yaxisMode == Mt.YAXIS_FOLLOW && n && (t = [t[0], -1 * t[1]]);
    const o = se(t);
    if (this.bounds && !n && !i && !je(o, this.boundsPolygon))
      return !1;
    const r = n ? this.tins.bakw : this.tins.forw, s = n ? this.indexedTins.bakw : this.indexedTins.forw, a = n ? this.vertices_params.bakw : this.vertices_params.forw, c = n ? this.centroid.bakw : this.centroid.forw;
    let h, f;
    this.stateFull && (this.stateBackward == n ? h = this.stateTriangle : (this.stateBackward = n, this.stateTriangle = void 0), f = (u) => {
      this.stateTriangle = u;
    });
    let l = ne(
      o,
      r,
      s,
      a,
      c,
      void 0,
      h,
      f
    );
    if (this.bounds && n && !i) {
      const u = se(l);
      if (!je(u, this.boundsPolygon)) return !1;
    } else this.yaxisMode == Mt.YAXIS_FOLLOW && !n && (l = [l[0], -1 * l[1]]);
    return l;
  }
}
const Sn = Math.pow(2, -52), ve = new Uint32Array(512);
class Ge {
  /**
   * Constructs a delaunay triangulation object given an array of points (`[x, y]` by default).
   * `getX` and `getY` are optional functions of the form `(point) => value` for custom point formats.
   *
   * @template P
   * @param {P[]} points
   * @param {(p: P) => number} [getX]
   * @param {(p: P) => number} [getY]
   */
  // @ts-expect-error TS2322
  static from(t, n = _r, i = Mr) {
    const o = t.length, r = new Float64Array(o * 2);
    for (let s = 0; s < o; s++) {
      const a = t[s];
      r[2 * s] = n(a), r[2 * s + 1] = i(a);
    }
    return new Ge(r);
  }
  /**
   * Constructs a delaunay triangulation object given an array of point coordinates of the form:
   * `[x0, y0, x1, y1, ...]` (use a typed array for best performance). Duplicate points are skipped.
   *
   * @param {T} coords
   */
  constructor(t) {
    const n = t.length >> 1;
    if (n > 0 && typeof t[0] != "number") throw new Error("Expected coords to contain numbers.");
    this.coords = t;
    const i = Math.max(2 * n - 5, 0);
    this._triangles = new Uint32Array(i * 3), this._halfedges = new Int32Array(i * 3), this._hashSize = Math.ceil(Math.sqrt(n)), this._hullPrev = new Uint32Array(n), this._hullNext = new Uint32Array(n), this._hullTri = new Uint32Array(n), this._hullHash = new Int32Array(this._hashSize), this._ids = new Uint32Array(n), this._dists = new Float64Array(n), this.trianglesLen = 0, this._cx = 0, this._cy = 0, this._hullStart = 0, this.hull = this._triangles, this.triangles = this._triangles, this.halfedges = this._halfedges, this.update();
  }
  /**
   * Updates the triangulation if you modified `delaunay.coords` values in place, avoiding expensive memory allocations.
   * Useful for iterative relaxation algorithms such as Lloyd's.
   */
  update() {
    const { coords: t, _hullPrev: n, _hullNext: i, _hullTri: o, _hullHash: r } = this, s = t.length >> 1;
    let a = 1 / 0, c = 1 / 0, h = -1 / 0, f = -1 / 0;
    for (let k = 0; k < s; k++) {
      const N = t[2 * k], P = t[2 * k + 1];
      N < a && (a = N), P < c && (c = P), N > h && (h = N), P > f && (f = P), this._ids[k] = k;
    }
    const l = (a + h) / 2, u = (c + f) / 2;
    let p = 0, x = 0, w = 0;
    for (let k = 0, N = 1 / 0; k < s; k++) {
      const P = Ve(l, u, t[2 * k], t[2 * k + 1]);
      P < N && (p = k, N = P);
    }
    const I = t[2 * p], M = t[2 * p + 1];
    for (let k = 0, N = 1 / 0; k < s; k++) {
      if (k === p) continue;
      const P = Ve(I, M, t[2 * k], t[2 * k + 1]);
      P < N && P > 0 && (x = k, N = P);
    }
    let g = t[2 * x], b = t[2 * x + 1], d = 1 / 0;
    for (let k = 0; k < s; k++) {
      if (k === p || k === x) continue;
      const N = br(I, M, g, b, t[2 * k], t[2 * k + 1]);
      N < d && (w = k, d = N);
    }
    let y = t[2 * w], m = t[2 * w + 1];
    if (d === 1 / 0) {
      for (let P = 0; P < s; P++)
        this._dists[P] = t[2 * P] - t[0] || t[2 * P + 1] - t[1];
      Kt(this._ids, this._dists, 0, s - 1);
      const k = new Uint32Array(s);
      let N = 0;
      for (let P = 0, C = -1 / 0; P < s; P++) {
        const D = this._ids[P], v = this._dists[D];
        v > C && (k[N++] = D, C = v);
      }
      this.hull = k.subarray(0, N), this.triangles = new Uint32Array(0), this.halfedges = new Int32Array(0);
      return;
    }
    if (Ot(I, M, g, b, y, m) < 0) {
      const k = x, N = g, P = b;
      x = w, g = y, b = m, w = k, y = N, m = P;
    }
    const S = xr(I, M, g, b, y, m);
    this._cx = S.x, this._cy = S.y;
    for (let k = 0; k < s; k++)
      this._dists[k] = Ve(t[2 * k], t[2 * k + 1], S.x, S.y);
    Kt(this._ids, this._dists, 0, s - 1), this._hullStart = p;
    let E = 3;
    i[p] = n[w] = x, i[x] = n[p] = w, i[w] = n[x] = p, o[p] = 0, o[x] = 1, o[w] = 2, r.fill(-1), r[this._hashKey(I, M)] = p, r[this._hashKey(g, b)] = x, r[this._hashKey(y, m)] = w, this.trianglesLen = 0, this._addTriangle(p, x, w, -1, -1, -1);
    for (let k = 0, N = 0, P = 0; k < this._ids.length; k++) {
      const C = this._ids[k], D = t[2 * C], v = t[2 * C + 1];
      if (k > 0 && Math.abs(D - N) <= Sn && Math.abs(v - P) <= Sn || (N = D, P = v, C === p || C === x || C === w)) continue;
      let O = 0;
      for (let _ = 0, B = this._hashKey(D, v); _ < this._hashSize && (O = r[(B + _) % this._hashSize], !(O !== -1 && O !== i[O])); _++)
        ;
      O = n[O];
      let A = O, T;
      for (; T = i[A], Ot(D, v, t[2 * A], t[2 * A + 1], t[2 * T], t[2 * T + 1]) >= 0; )
        if (A = T, A === O) {
          A = -1;
          break;
        }
      if (A === -1) continue;
      let X = this._addTriangle(A, C, i[A], -1, -1, o[A]);
      o[C] = this._legalize(X + 2), o[A] = X, E++;
      let R = i[A];
      for (; T = i[R], Ot(D, v, t[2 * R], t[2 * R + 1], t[2 * T], t[2 * T + 1]) < 0; )
        X = this._addTriangle(R, C, T, o[C], -1, o[R]), o[C] = this._legalize(X + 2), i[R] = R, E--, R = T;
      if (A === O)
        for (; T = n[A], Ot(D, v, t[2 * T], t[2 * T + 1], t[2 * A], t[2 * A + 1]) < 0; )
          X = this._addTriangle(T, C, A, -1, o[A], o[T]), this._legalize(X + 2), o[T] = X, i[A] = A, E--, A = T;
      this._hullStart = n[C] = A, i[A] = n[R] = C, i[C] = R, r[this._hashKey(D, v)] = C, r[this._hashKey(t[2 * A], t[2 * A + 1])] = A;
    }
    this.hull = new Uint32Array(E);
    for (let k = 0, N = this._hullStart; k < E; k++)
      this.hull[k] = N, N = i[N];
    this.triangles = this._triangles.subarray(0, this.trianglesLen), this.halfedges = this._halfedges.subarray(0, this.trianglesLen);
  }
  /**
   * Calculate an angle-based key for the edge hash used for advancing convex hull.
   *
   * @param {number} x
   * @param {number} y
   * @private
   */
  _hashKey(t, n) {
    return Math.floor(yr(t - this._cx, n - this._cy) * this._hashSize) % this._hashSize;
  }
  /**
   * Flip an edge in a pair of triangles if it doesn't satisfy the Delaunay condition.
   *
   * @param {number} a
   * @private
   */
  _legalize(t) {
    const { _triangles: n, _halfedges: i, coords: o } = this;
    let r = 0, s = 0;
    for (; ; ) {
      const a = i[t], c = t - t % 3;
      if (s = c + (t + 2) % 3, a === -1) {
        if (r === 0) break;
        t = ve[--r];
        continue;
      }
      const h = a - a % 3, f = c + (t + 1) % 3, l = h + (a + 2) % 3, u = n[s], p = n[t], x = n[f], w = n[l];
      if (vr(
        o[2 * u],
        o[2 * u + 1],
        o[2 * p],
        o[2 * p + 1],
        o[2 * x],
        o[2 * x + 1],
        o[2 * w],
        o[2 * w + 1]
      )) {
        n[t] = w, n[a] = u;
        const M = i[l];
        if (M === -1) {
          let b = this._hullStart;
          do {
            if (this._hullTri[b] === l) {
              this._hullTri[b] = t;
              break;
            }
            b = this._hullPrev[b];
          } while (b !== this._hullStart);
        }
        this._link(t, M), this._link(a, i[s]), this._link(s, l);
        const g = h + (a + 1) % 3;
        r < ve.length && (ve[r++] = g);
      } else {
        if (r === 0) break;
        t = ve[--r];
      }
    }
    return s;
  }
  /**
   * Link two half-edges to each other.
   * @param {number} a
   * @param {number} b
   * @private
   */
  _link(t, n) {
    this._halfedges[t] = n, n !== -1 && (this._halfedges[n] = t);
  }
  /**
   * Add a new triangle given vertex indices and adjacent half-edge ids.
   *
   * @param {number} i0
   * @param {number} i1
   * @param {number} i2
   * @param {number} a
   * @param {number} b
   * @param {number} c
   * @private
   */
  _addTriangle(t, n, i, o, r, s) {
    const a = this.trianglesLen;
    return this._triangles[a] = t, this._triangles[a + 1] = n, this._triangles[a + 2] = i, this._link(a, o), this._link(a + 1, r), this._link(a + 2, s), this.trianglesLen += 3, a;
  }
}
function yr(e, t) {
  const n = e / (Math.abs(e) + Math.abs(t));
  return (t > 0 ? 3 - n : 1 + n) / 4;
}
function Ve(e, t, n, i) {
  const o = e - n, r = t - i;
  return o * o + r * r;
}
function vr(e, t, n, i, o, r, s, a) {
  const c = e - s, h = t - a, f = n - s, l = i - a, u = o - s, p = r - a, x = c * c + h * h, w = f * f + l * l, I = u * u + p * p;
  return c * (l * I - w * p) - h * (f * I - w * u) + x * (f * p - l * u) < 0;
}
function br(e, t, n, i, o, r) {
  const s = n - e, a = i - t, c = o - e, h = r - t, f = s * s + a * a, l = c * c + h * h, u = 0.5 / (s * h - a * c), p = (h * f - a * l) * u, x = (s * l - c * f) * u;
  return p * p + x * x;
}
function xr(e, t, n, i, o, r) {
  const s = n - e, a = i - t, c = o - e, h = r - t, f = s * s + a * a, l = c * c + h * h, u = 0.5 / (s * h - a * c), p = e + (h * f - a * l) * u, x = t + (s * l - c * f) * u;
  return { x: p, y: x };
}
function Kt(e, t, n, i) {
  if (i - n <= 20)
    for (let o = n + 1; o <= i; o++) {
      const r = e[o], s = t[r];
      let a = o - 1;
      for (; a >= n && t[e[a]] > s; ) e[a + 1] = e[a--];
      e[a + 1] = r;
    }
  else {
    const o = n + i >> 1;
    let r = n + 1, s = i;
    te(e, o, r), t[e[n]] > t[e[i]] && te(e, n, i), t[e[r]] > t[e[i]] && te(e, r, i), t[e[n]] > t[e[r]] && te(e, n, r);
    const a = e[r], c = t[a];
    for (; ; ) {
      do
        r++;
      while (t[e[r]] < c);
      do
        s--;
      while (t[e[s]] > c);
      if (s < r) break;
      te(e, r, s);
    }
    e[n + 1] = e[s], e[s] = a, i - r + 1 >= s - n ? (Kt(e, t, r, i), Kt(e, t, n, s - 1)) : (Kt(e, t, n, s - 1), Kt(e, t, r, i));
  }
}
function te(e, t, n) {
  const i = e[t];
  e[t] = e[n], e[n] = i;
}
function _r(e) {
  return e[0];
}
function Mr(e) {
  return e[1];
}
class Sr {
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
    const n = Math.floor(t / this.width), i = t % this.width;
    return this.bs[n] |= 1 << i, this;
  }
  /**
   * Delete a number from the set.
   *
   * @param idx The number to delete. Must be 0 <= idx < len.
   */
  delete(t) {
    const n = Math.floor(t / this.width), i = t % this.width;
    return this.bs[n] &= ~(1 << i), this;
  }
  /**
   * Add or delete a number in the set, depending on the second argument.
   *
   * @param idx The number to add or delete. Must be 0 <= idx < len.
   * @param val If true, add the number, otherwise delete.
   */
  set(t, n) {
    const i = Math.floor(t / this.width), r = 1 << t % this.width;
    return this.bs[i] ^= (-Number(n) ^ this.bs[i]) & r, n;
  }
  /**
   * Whether the number is in the set.
   *
   * @param idx The number to test. Must be 0 <= idx < len.
   */
  has(t) {
    const n = Math.floor(t / this.width), i = t % this.width;
    return (this.bs[n] & 1 << i) !== 0;
  }
  /**
   * Iterate over the numbers that are in the set.
   */
  forEach(t) {
    const n = this.bs.length;
    for (let i = 0; i < n; i++) {
      let o = 0;
      for (; this.bs[i] && o < this.width; )
        this.bs[i] & 1 << o && t(i * this.width + o), o++;
    }
    return this;
  }
}
class En extends Sr {
  constructor(t) {
    super(8, new Uint8Array(Math.ceil(t / 8)).fill(0));
  }
}
function Ut(e) {
  return e % 3 === 2 ? e - 2 : e + 1;
}
function Nt(e) {
  return e % 3 === 0 ? e + 2 : e - 1;
}
function kn(e, t, n, i, o, r, s, a) {
  const c = Ot(e, t, o, r, s, a), h = Ot(n, i, o, r, s, a);
  if (c > 0 && h > 0 || c < 0 && h < 0)
    return !1;
  const f = Ot(o, r, e, t, n, i), l = Ot(s, a, e, t, n, i);
  return f > 0 && l > 0 || f < 0 && l < 0 ? !1 : c === 0 && h === 0 && f === 0 && l === 0 ? !(Math.max(o, s) < Math.min(e, n) || Math.max(e, n) < Math.min(o, s) || Math.max(r, a) < Math.min(t, i) || Math.max(t, i) < Math.min(r, a)) : !0;
}
class Er {
  /**
   * The triangulation object from Delaunator.
   */
  del;
  constructor(t) {
    this.del = t;
  }
}
class kr extends Er {
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
    const i = 2 ** 32 - 1, o = t.coords.length >> 1, r = t.triangles.length;
    this.vertMap = new Uint32Array(o).fill(i), this.flips = new En(r), this.consd = new En(r);
    for (let s = 0; s < r; s++) {
      const a = t.triangles[s];
      this.vertMap[a] === i && this.updateVert(s);
    }
    n && this.constrainAll(n);
  }
  /**
   * Constrain the triangulation such that there is an edge between p1 and p2.
   */
  constrainOne(t, n) {
    const { triangles: i, halfedges: o } = this.del;
    this.assertVertex(t, t, n), this.assertVertex(n, t, n), this.assertInTriangulation(t, t, n), this.assertInTriangulation(n, t, n);
    const r = this.vertMap[t], s = this.maxConstrainSteps();
    let a = 0, c = r;
    do {
      if (++a > s)
        throw new Error(
          `Constraining edge [${t}, ${n}] exceeded the iteration limit`
        );
      const l = i[c], u = Ut(c);
      if (l === n)
        return this.protect(c);
      const p = Nt(c), x = i[p];
      if (x === n)
        return this.protect(u), u;
      if (this.intersectSegments(t, n, x, l)) {
        c = p;
        break;
      }
      c = o[u];
    } while (c !== -1 && c !== r);
    let h = c, f = -1;
    for (; c !== -1; ) {
      if (++a > s)
        throw new Error(
          `Constraining edge [${t}, ${n}] exceeded the iteration limit`
        );
      const l = o[c], u = Nt(c), p = Nt(l), x = Ut(l);
      if (l === -1)
        throw new Error("Constraining edge exited the hull");
      if (this.consd.has(c))
        throw new Error("Edge intersects already constrained edge");
      if (this.isCollinear(t, n, i[c]) || this.isCollinear(t, n, i[l]))
        throw new Error("Constraining edge intersects point");
      if (!this.intersectSegments(
        i[c],
        i[l],
        i[u],
        i[p]
      )) {
        if (f === -1 && (f = c), i[p] === n) {
          if (c === f)
            throw new Error("Infinite loop: non-convex quadrilateral");
          c = f, f = -1;
          continue;
        }
        if (this.intersectSegments(
          t,
          n,
          i[p],
          i[l]
        ))
          c = p;
        else if (this.intersectSegments(
          t,
          n,
          i[x],
          i[p]
        ))
          c = x;
        else if (f === c)
          throw new Error("Infinite loop: no further intersect after non-convex");
        continue;
      }
      if (this.flipDiagonal(c), this.intersectSegments(
        t,
        n,
        i[u],
        i[p]
      ) && (f === -1 && (f = u), f === u))
        throw new Error("Infinite loop: flipped diagonal still intersects");
      i[p] === n ? (h = p, c = f, f = -1) : this.intersectSegments(
        t,
        n,
        i[x],
        i[p]
      ) && (c = x);
    }
    return this.protect(h), this.delaunify(!0), this.findEdge(t, n);
  }
  /**
   * Upper bound for the number of steps taken while constraining one edge.
   *
   * A constraint that crosses k edges is resolved in passes over the crossed
   * edges, so the number of steps can grow with k squared (for example when
   * the crossed edges fan out between two bowed rows of points). k is less
   * than the number of half-edges, so the square of that number is never
   * reached by a walk that terminates. The floor keeps tiny meshes away from
   * the limit.
   */
  maxConstrainSteps() {
    const t = this.del.triangles.length;
    return Math.max(t * t, 4096);
  }
  /**
   * Throw unless `vertex` is part of the triangulation. Delaunator leaves out
   * points that coincide with another point, so a valid point id may have no
   * triangle. An edge cannot start or end at such a point.
   */
  assertInTriangulation(t, n, i) {
    if (this.vertMap[t] >= this.del.triangles.length)
      throw new Error(
        `Invalid edge [${n}, ${i}]: vertex ${t} is not part of the triangulation`
      );
  }
  /**
   * Throw unless `vertex` is an id of a point given to Delaunator.
   */
  assertVertex(t, n, i) {
    const o = this.vertMap.length;
    if (!Number.isInteger(t) || t < 0 || t >= o)
      throw new Error(
        `Invalid edge [${String(n)}, ${String(i)}]: vertex ids must be integers from 0 to ${o - 1}`
      );
  }
  /**
   * Fix the Delaunay condition.
   */
  delaunify(t = !1) {
    const { halfedges: n } = this.del, i = this.flips, o = this.consd, r = n.length;
    let s;
    do {
      s = 0;
      for (let a = 0; a < r; a++) {
        if (o.has(a))
          continue;
        i.delete(a);
        const c = n[a];
        c !== -1 && (i.delete(c), this.isDelaunay(a) || (this.flipDiagonal(a), s++));
      }
    } while (t && s > 0);
    return this;
  }
  /**
   * Call constrainOne on each edge.
   */
  constrainAll(t) {
    const n = t.length;
    for (let i = 0; i < n; i++) {
      const o = t[i];
      this.constrainOne(o[0], o[1]);
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
    const i = this.vertMap[n], { triangles: o, halfedges: r } = this.del;
    if (!(i < o.length))
      return 1 / 0;
    let s = i, a, c = 0;
    do {
      if (++c > o.length)
        throw new Error(
          `Looking up edge [${t}, ${n}] exceeded the iteration limit`
        );
      if (o[s] === t)
        return s;
      a = Ut(s), s = r[a];
    } while (s !== -1 && s !== i);
    return o[Ut(a)] === t ? -a : 1 / 0;
  }
  /**
   * Mark an edge as constrained, i.e. should not be touched by `delaunify`.
   */
  protect(t) {
    const n = this.del.halfedges[t], i = this.flips, o = this.consd;
    return i.delete(t), o.add(t), n !== -1 ? (i.delete(n), o.add(n), n) : -t;
  }
  /**
   * Mark an edge as flipped unless constrained.
   */
  markFlip(t) {
    const n = this.del.halfedges, i = this.flips;
    if (this.consd.has(t))
      return !1;
    const r = n[t];
    return r !== -1 && (i.add(t), i.add(r)), !0;
  }
  /**
   * Flip the edge shared by two triangles.
   */
  flipDiagonal(t) {
    const { triangles: n, halfedges: i } = this.del, o = this.flips, r = this.consd, s = i[t], a = Nt(t), c = Ut(t), h = Nt(s), f = Ut(s), l = i[a], u = i[h];
    if (r.has(t))
      throw new Error("Trying to flip a constrained edge");
    return n[t] = n[h], i[t] = u, o.set(t, o.has(h)) || r.set(t, r.has(h)), u !== -1 && (i[u] = t), i[a] = h, n[s] = n[a], i[s] = l, o.set(s, o.has(a)) || r.set(s, r.has(a)), l !== -1 && (i[l] = s), i[h] = a, this.markFlip(t), this.markFlip(c), this.markFlip(s), this.markFlip(f), o.add(a), r.delete(a), o.add(h), r.delete(h), this.updateVert(t), this.updateVert(c), this.updateVert(s), this.updateVert(f), a;
  }
  /**
   * Whether point p1, p2, and p are collinear.
   */
  isCollinear(t, n, i) {
    const o = this.del.coords;
    return Ot(
      o[t * 2],
      o[t * 2 + 1],
      o[n * 2],
      o[n * 2 + 1],
      o[i * 2],
      o[i * 2 + 1]
    ) === 0;
  }
  /**
   * Whether the triangle formed by p1, p2, p3 keeps px outside the circumcircle.
   */
  inCircle(t, n, i, o) {
    const r = this.del.coords;
    return pi(
      r[t * 2],
      r[t * 2 + 1],
      r[n * 2],
      r[n * 2 + 1],
      r[i * 2],
      r[i * 2 + 1],
      r[o * 2],
      r[o * 2 + 1]
    ) < 0;
  }
  /**
   * Whether the triangles sharing edg conform to the Delaunay condition.
   */
  isDelaunay(t) {
    const { triangles: n, halfedges: i } = this.del, o = i[t];
    if (o === -1)
      return !0;
    const r = n[Nt(t)], s = n[t], a = n[Ut(t)], c = n[Nt(o)];
    return !this.inCircle(r, s, a, c);
  }
  /**
   * Update the vertex -> incoming edge map.
   */
  updateVert(t) {
    const { triangles: n, halfedges: i } = this.del, o = this.vertMap, r = n[t];
    let s = Nt(t), a = i[s];
    for (; a !== -1 && a !== t; )
      s = Nt(a), a = i[s];
    return o[r] = s, s;
  }
  /**
   * Whether the segments between vertices intersect.
   */
  intersectSegments(t, n, i, o) {
    const r = this.del.coords;
    return t === i || t === o || n === i || n === o ? !1 : kn(
      r[t * 2],
      r[t * 2 + 1],
      r[n * 2],
      r[n * 2 + 1],
      r[i * 2],
      r[i * 2 + 1],
      r[o * 2],
      r[o * 2 + 1]
    );
  }
  static intersectSegments = kn;
}
function be(e, t, n) {
  if (t || (t = []), typeof e != "object" || e.type !== "FeatureCollection")
    throw "Argument points must be FeatureCollection";
  if (!Array.isArray(t)) throw "Argument points must be Array of Array";
  const i = e.features.map(
    (c) => c.geometry.coordinates
  ), o = Ge.from(i);
  let r;
  const s = [];
  o.triangles.length !== 0 && t.length !== 0 && (r = new kr(o), r.constrainAll(t));
  for (let c = 0; c < o.triangles.length; c += 3)
    s.push([o.triangles[c], o.triangles[c + 1], o.triangles[c + 2]]);
  const a = ["a", "b", "c"];
  return St(
    s.map((c) => {
      const h = {}, f = c.map((l, u) => {
        const p = e.features[l], x = p.geometry.coordinates, w = [x[0], x[1]];
        return x.length === 3 ? w[2] = x[2] : h[a[u]] = p.properties[n], w;
      });
      return f[3] = f[0], le([f], h);
    })
  );
}
const Ar = 256 * Number.EPSILON, Gn = 4, Ir = 1e-9;
function Or(e) {
  const t = Math.abs(e);
  if (!Number.isFinite(t)) return NaN;
  const n = new DataView(new ArrayBuffer(8));
  n.setFloat64(0, t);
  const i = n.getUint32(0) >>> 20 & 2047;
  return Math.pow(2, Math.max(i, 1) - 1023 - 52);
}
function Nr(e) {
  let t = 0;
  for (const n of e)
    t = Math.max(t, Math.abs(n[0]), Math.abs(n[1]));
  return t;
}
function Pr(e, t, n = Gn) {
  const i = (r) => {
    let s = 0;
    for (let c = 1; c < r.length; c++)
      s += Math.sqrt(
        Math.pow(r[c][0] - r[c - 1][0], 2) + Math.pow(r[c][1] - r[c - 1][1], 2)
      );
    const a = Or(Nr(r)) / s;
    return Number.isFinite(a) ? a : 0;
  }, o = Ar + n * (i(e) + i(t));
  return Math.min(o, Ir);
}
function Tr(e, t, n) {
  const i = new Int32Array(e.length).fill(-1), o = new Int32Array(t.length).fill(-1), r = e.length - 2, s = t.length - 2;
  if (r < 1 || s < 1) return { illstToMerc: i, mercToIllst: o };
  const a = (y, m) => Math.abs(t[m + 1][3] - e[y + 1][3]) <= n;
  let c = r, h = -1, f = s, l = -1;
  for (let y = 0; y < r; y++)
    for (let m = 0; m < s; m++)
      a(y, m) && (c = Math.min(c, y), h = Math.max(h, y), f = Math.min(f, m), l = Math.max(l, m));
  if (h < 0) return { illstToMerc: i, mercToIllst: o };
  const u = h - c + 1, p = l - f + 1, x = p + 1, w = new Int32Array((u + 1) * x), I = new Float64Array((u + 1) * x), M = new Uint8Array((u + 1) * x), g = (y, m, S, E) => y > S || y === S && m < E;
  for (let y = 1; y <= u; y++)
    for (let m = 1; m <= p; m++) {
      const S = y * x + m, E = S - x, k = S - 1;
      let N = w[E], P = I[E], C = 0;
      g(w[k], I[k], N, P) && (N = w[k], P = I[k], C = 1);
      const D = c + y - 1, v = f + m - 1;
      if (a(D, v)) {
        const O = E - 1, A = w[O] + 1, T = I[O] + Math.abs(t[v + 1][3] - e[D + 1][3]);
        g(A, T, N, P) && (N = A, P = T, C = 2);
      }
      w[S] = N, I[S] = P, M[S] = C;
    }
  let b = u, d = p;
  for (; b > 0 && d > 0; ) {
    const y = M[b * x + d];
    if (y === 2) {
      const m = c + b - 1 + 1, S = f + d - 1 + 1;
      i[m] = S, o[S] = m, b--, d--;
    } else y === 0 ? b-- : d--;
  }
  return { illstToMerc: i, mercToIllst: o };
}
function Br(e, t, n = Gn) {
  const i = Pr(e, t, n), o = [e, t].map((f) => {
    const l = f.map((p, x, w) => {
      if (x === 0) return 0;
      const I = w[x - 1];
      return Math.sqrt(
        Math.pow(p[0] - I[0], 2) + Math.pow(p[1] - I[1], 2)
      );
    }), u = l.reduce((p, x, w) => w === 0 ? [0] : (p.push(p[w - 1] + x), p), []);
    return u.map((p, x, w) => {
      const I = p / w[w.length - 1];
      return [f[x], l[x], u[x], I];
    });
  }), { illstToMerc: r, mercToIllst: s } = Tr(o[0], o[1], i), a = [r, s], c = (f, l) => {
    for (let u = 1; u < l.length - 1; u++)
      if (Math.abs(l[u][3] - f) <= i) return !0;
    return !1;
  }, h = [];
  return o.forEach((f, l) => {
    const u = o[l ? 0 : 1];
    f.forEach((p, x) => {
      if (x === 0 || x === f.length - 1) return;
      const w = p[0], I = p[3], M = a[l][x];
      if (M >= 0) {
        l === 0 && h.push([w, u[M][0], I]);
        return;
      }
      if (!c(I, u))
        for (let g = 0; g < u.length - 1; g++) {
          const b = u[g], d = u[g + 1], y = b[3], m = d[3];
          if (y < I && m > I) {
            const S = (I - y) / (m - y), E = [
              (d[0][0] - b[0][0]) * S + b[0][0],
              (d[0][1] - b[0][1]) * S + b[0][1]
            ];
            h.push(
              l === 0 ? [w, E, I] : [E, w, I]
            );
            return;
          }
        }
    });
  }), h.sort((f, l) => f[2] - l[2]);
}
function Cr(e, t) {
  const n = [[], [], [], []], i = [];
  return Object.keys(e).forEach((o) => {
    const r = e[o], s = r.forw, a = r.bakw, c = [
      s[0] - t.forw[0],
      s[1] - t.forw[1]
    ], h = [
      a[0] - t.bakw[0],
      t.bakw[1] - a[1]
    ], f = { forw: c, bakw: h };
    if (i.push(f), c[0] === 0 || c[1] === 0)
      return;
    let l = 0;
    c[0] > 0 && (l += 1), c[1] > 0 && (l += 2), n[l].push(f);
  }), { perQuad: n, aggregate: i };
}
function Xr(e) {
  let t = 1 / 0, n = 0, i = 0;
  return e.forEach((o) => {
    const { forw: r, bakw: s } = o, a = Math.hypot(r[0], r[1]), c = Math.hypot(s[0], s[1]);
    if (c === 0) return;
    const h = a / c, f = Math.atan2(r[0], r[1]) - Math.atan2(s[0], s[1]);
    t = Math.min(t, h), n += Math.cos(f), i += Math.sin(f);
  }), isFinite(t) ? [t, Math.atan2(i, n)] : [1, 0];
}
function Fr(e, t, n) {
  const { perQuad: i, aggregate: o } = Cr(e, t), r = i.every((c) => c.length > 0), a = (n === "birdeye" ? r ? i : [o] : [o]).map((c) => Xr(c));
  return a.length === 1 ? [a[0], a[0], a[0], a[0]] : a;
}
function Rr(e, t) {
  let n = 0;
  return e[0] > t[0] && (n += 1), e[1] > t[1] && (n += 2), n;
}
function Dr(e, t, n) {
  const i = [
    e[0] - t.forw[0],
    e[1] - t.forw[1]
  ], r = Math.sqrt(i[0] ** 2 + i[1] ** 2) / n[0], s = Math.atan2(i[0], i[1]) - n[1];
  return [
    t.bakw[0] + r * Math.sin(s),
    t.bakw[1] - r * Math.cos(s)
  ];
}
function $r(e, t, n, i) {
  const o = t[0] - e[0], r = t[1] - e[1];
  if (Math.abs(o) < 1e-12 && Math.abs(r) < 1e-12) return null;
  const s = i[0] - n[0], a = i[1] - n[1], c = n[0] - e[0], h = n[1] - e[1], f = o * a - r * s;
  if (Math.abs(f) < 1e-12) return null;
  const l = (c * a - h * s) / f, u = (c * r - h * o) / f;
  return l <= 1e-10 || u < -1e-10 || u > 1 + 1e-10 ? null : { t: l, point: [e[0] + l * o, e[1] + l * r] };
}
function Yr(e, t, n) {
  const i = n.length;
  let o = -1 / 0, r = null;
  for (let s = 0; s < i; s++) {
    const a = (s + 1) % i, c = $r(
      e,
      t,
      n[s].bakw,
      n[a].bakw
    );
    c && c.t > o && (o = c.t, r = c.point);
  }
  return r;
}
function An(e, t) {
  const i = Math.atan2(e[0] - t[0], e[1] - t[1]) * (180 / Math.PI);
  return i < 0 ? i + 360 : i;
}
function In(e, t, n, i, o, r) {
  const s = t[0] - e[0], a = t[1] - e[1];
  if (s === 0 && a === 0) return null;
  const c = [];
  if (s !== 0)
    for (const f of [n, i]) {
      const l = (f - e[0]) / s;
      if (l > 0) {
        const u = e[1] + l * a;
        u >= o && u <= r && c.push({ t: l, x: f, y: u });
      }
    }
  if (a !== 0)
    for (const f of [o, r]) {
      const l = (f - e[1]) / a;
      if (l > 0) {
        const u = e[0] + l * s;
        u >= n && u <= i && c.push({ t: l, x: u, y: f });
      }
    }
  if (c.length === 0) return null;
  c.sort((f, l) => f.t - l.t);
  const h = c[0];
  return [h.x, h.y];
}
function On(e, t, n) {
  const i = e.length, o = new Array(i).fill(1);
  for (const r of t)
    for (let s = 0; s < i; s++) {
      const a = (s + 1) % i, c = Qe([e[s].bakw, e[a].bakw]), h = Qe([n.bakw, r.bakw]), f = Pi(c, h);
      if (f.features.length > 0 && f.features[0].geometry) {
        const l = f.features[0], u = Math.sqrt(
          Math.pow(r.bakw[0] - n.bakw[0], 2) + Math.pow(r.bakw[1] - n.bakw[1], 2)
        ), p = Math.sqrt(
          Math.pow(l.geometry.coordinates[0] - n.bakw[0], 2) + Math.pow(l.geometry.coordinates[1] - n.bakw[1], 2)
        ), x = u / p;
        x > o[s] && (o[s] = x), x > o[a] && (o[a] = x);
      }
    }
  e.forEach((r, s) => {
    const a = o[s];
    r.bakw = [
      (r.bakw[0] - n.bakw[0]) * a + n.bakw[0],
      (r.bakw[1] - n.bakw[1]) * a + n.bakw[1]
    ];
  });
}
function Kn(e, t, n) {
  const { convexBuf: i, centroid: o, allGcps: r, minx: s, maxx: a, miny: c, maxy: h } = e, f = Fr(i, o, t), u = [
    [s, c],
    [a, c],
    [a, h],
    [s, h]
  ].map((m) => ({
    forw: m,
    bakw: Dr(
      m,
      o,
      f[Rr(m, o.forw)]
    )
  }));
  if (u.sort(
    (m, S) => Math.atan2(m.forw[0] - o.forw[0], m.forw[1] - o.forw[1]) - Math.atan2(S.forw[0] - o.forw[0], S.forw[1] - o.forw[1])
  ), On(u, r, o), !n) return u;
  const p = 4, x = u.map(
    (m) => Math.atan2(m.forw[0] - o.forw[0], m.forw[1] - o.forw[1])
  ), w = u.map(
    (m) => Math.atan2(
      m.bakw[0] - o.bakw[0],
      -(m.bakw[1] - o.bakw[1])
    )
  );
  function I(m) {
    for (let S = 0; S < p; S++) {
      const E = (S + 1) % p, k = x[S], N = S < p - 1 ? x[E] : x[E] + 2 * Math.PI;
      let P = m;
      for (; P < k; ) P += 2 * Math.PI;
      for (; P >= k + 2 * Math.PI; ) P -= 2 * Math.PI;
      if (P >= k && P < N)
        return { i: S, j: E, frac: (P - k) / (N - k) };
    }
    return { i: 0, j: 1, frac: 0 };
  }
  function M(m) {
    const { i: S, j: E, frac: k } = I(m), N = w[S];
    let C = w[E] - N;
    for (; C > Math.PI; ) C -= 2 * Math.PI;
    for (; C < -Math.PI; ) C += 2 * Math.PI;
    return N + k * C;
  }
  const g = new Set(
    u.map(
      (m) => Math.floor(An(m.forw, o.forw) / 10) % 36
    )
  ), b = r.map((m) => ({
    forw: m.forw,
    bakw: m.bakw,
    angleDeg: An(m.forw, o.forw),
    forwDist: Math.hypot(m.forw[0] - o.forw[0], m.forw[1] - o.forw[1])
  })), d = [];
  for (let m = 0; m < 36; m++) {
    if (g.has(m)) continue;
    const S = m * 10, E = b.filter(
      (O) => O.angleDeg >= S && O.angleDeg < S + 10
    );
    let k = null;
    if (E.length > 0) {
      const O = E.reduce((A, T) => T.forwDist > A.forwDist ? T : A);
      k = In(o.forw, O.forw, s, a, c, h);
    }
    if (!k) {
      const O = (S + 5) % 360 * (Math.PI / 180), A = [
        o.forw[0] + Math.sin(O),
        o.forw[1] + Math.cos(O)
      ];
      k = In(o.forw, A, s, a, c, h);
    }
    if (!k) continue;
    const N = [k[0] - o.forw[0], k[1] - o.forw[1]], P = Math.atan2(N[0], N[1]), C = M(P), D = [
      o.bakw[0] + Math.sin(C),
      o.bakw[1] - Math.cos(C)
    ], v = Yr(o.bakw, D, u);
    v && d.push({ forw: k, bakw: v });
  }
  const y = [...u, ...d];
  return y.sort(
    (m, S) => Math.atan2(m.forw[0] - o.forw[0], m.forw[1] - o.forw[1]) - Math.atan2(S.forw[0] - o.forw[0], S.forw[1] - o.forw[1])
  ), On(y, r, o), y;
}
function Lr(e, t = !1) {
  return Kn(e, "plain", t);
}
function Vr(e, t = !1) {
  return Kn(e, "birdeye", t);
}
function _o(e) {
  return Hn(e, 1 / 0);
}
const Nn = 1e5, jr = 16;
function Hn(e, t) {
  return Ur(e), new qr(e).findSegmentIntersections(t).map(
    (o) => Yt([o.x, o.y])
  );
}
function Ur(e) {
  for (let t = 0, n = e.length; t < n; t++) {
    const i = e[t];
    ae(i) || qt(
      "findIntersections() received invalid coordinates:",
      `line=${t}`,
      `points=${i}`
    );
    for (let o = 0, r = i.length; o < r; o++) {
      const s = i[o];
      (!ae(s) || !Number.isFinite(s[0]) || !Number.isFinite(s[1])) && qt(
        "findIntersections() received non-finite coordinates:",
        `line=${t}`,
        `point=${o}`,
        `coordinates=${JSON.stringify(s)}`
      );
    }
  }
}
class qr {
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
  _zz = null;
  _zlimit = 0;
  // simplification
  _bb = null;
  _allBounds = null;
  // bounding boxes
  _arcIter = null;
  _filteredArcIter = null;
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
    const n = [], i = [], o = t.map((r) => {
      const s = r ? r.length : 0;
      for (let a = 0; a < s; a++)
        n.push(r[a][0]), i.push(r[a][1]);
      return s;
    });
    this.initXYData(o, n, i);
  }
  initXYData(t, n, i) {
    const o = t.length;
    this._xx = new Float64Array(n), this._yy = new Float64Array(i), this._nn = new Uint32Array(t), this._zz = null, this._zlimit = 0, this._filteredArcIter = null, this._ii = new Uint32Array(o);
    let r = 0;
    for (let s = 0; s < o; s++)
      this._ii[s] = r, r += t[s];
    (r != this._xx.length || this._xx.length != this._yy.length) && qt("ArcCollection#initXYData() Counting error"), this.initBounds(), this._arcIter = new fo(this._xx, this._yy);
  }
  initBounds() {
    const t = this.calcArcBounds_(this._xx, this._yy, this._nn);
    this._bb = t.bb, this._allBounds = t.bounds;
  }
  /**
   * データの境界を計算
   * @returns バウンディングボックス情報
   */
  calcArcBounds_(t, n, i) {
    const o = i.length, r = new Float64Array(o * 4), s = new ce();
    let a = 0, c, h, f;
    for (let l = 0; l < o; l++)
      c = i[l], c > 0 && (h = l * 4, f = uo(t, n, a, c), r[h++] = f[0], r[h++] = f[1], r[h++] = f[2], r[h] = f[3], a += c, s.mergeBounds(f));
    return {
      bb: r,
      bounds: s
    };
  }
  getBounds() {
    return this._allBounds ? this._allBounds.clone() : new ce();
  }
  // @cb function(i, j, xx, yy)
  forEachSegment(t) {
    let n = 0;
    for (let i = 0, o = this.size(); i < o; i++)
      n += this.forEachArcSegment(i, t);
    return n;
  }
  size() {
    return this._ii && this._ii.length || 0;
  }
  // @cb function(i, j, xx, yy)
  forEachArcSegment(t, n) {
    const i = t >= 0, o = i ? t : ~t, r = this.getRetainedInterval(), s = this._nn[o], a = i ? 1 : -1;
    let c = i ? this._ii[o] : this._ii[o] + s - 1, h = c, f = 0;
    for (let l = 1; l < s; l++)
      h += a, (r === 0 || this._zz[h] >= r) && (n(c, h, this._xx, this._yy), c = h, f++);
    return f;
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
    const i = this.forEachSegment(
      (o, r, s, a) => {
        t += Math.abs(s[o] - s[r]), n += Math.abs(a[o] - a[r]);
      }
    );
    return [t / i || 0, n / i || 0];
  }
  /**
   * 交差判定のためのストライプ数を計算
   * 線分の平均長さに基づいて最適な分割数を決定
   */
  calcSegmentIntersectionStripeCount() {
    const t = this.getBounds().height(), n = this.getAvgSegment2()[1];
    let i = 1;
    return n > 0 && t > 0 && (i = Math.ceil(t / n / 20)), i || 1;
  }
  /**
   * 線分の交差を検出
   * ストライプ分割による効率的な判定を実装
   *
   * @param limit - 返す交差点の件数の上限（同じ位置の交差は 1 件に数える）
   * @returns 検出された交差点の配列（同じ位置の重複なし）
   */
  findSegmentIntersections(t = 1 / 0) {
    const n = this.getBounds(), i = n.ymin || 0, o = (n.ymax || 0) - i, r = this.calcSegmentIntersectionStripeCount(), s = new Uint32Array(r), a = r > 1 ? (b) => Math.floor((r - 1) * (b - i) / o) : () => 0, c = r + 1;
    let h;
    this.forEachSegment(
      (b, d, y, m) => {
        let S = a(m[b]);
        const E = a(m[d]);
        let k = 0;
        for (; s[S] = s[S] + 2, S != E; )
          k++, k > c && qt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${r}`,
            `s1=${S}`,
            `s2=${E}`
          ), S += E > S ? 1 : -1;
      }
    );
    const f = this.getUint32Array(Gr(s));
    let l = 0;
    const u = [];
    Kr(s, (b) => {
      const d = l;
      l += b, u.push(f.subarray(d, l));
    }), Hr(s, 0), this.forEachSegment(
      (b, d, y, m) => {
        let S = a(m[b]);
        const E = a(m[d]);
        let k, N, P = 0;
        for (; k = s[S], s[S] = k + 2, N = u[S], N[k] = b, N[k + 1] = d, S != E; )
          P++, P > c && qt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${r}`,
            `s1=${S}`,
            `s2=${E}`
          ), S += E > S ? 1 : -1;
      }
    );
    const p = this.getVertexData(), x = t * jr;
    let w = 0;
    const I = /* @__PURE__ */ new Set(), M = /* @__PURE__ */ new Map(), g = (b) => {
      w++;
      const d = ho(b);
      return I.has(d) || (I.add(d), M.set(`${b.x}:${b.y}`, b)), M.size >= t || w >= x;
    };
    if (p.xx && p.yy)
      for (h = 0; h < r && !Qr(u[h], p.xx, p.yy, g); h++)
        ;
    return Array.from(M.values());
  }
}
function qt(...e) {
  const t = e.join(" ");
  throw new Error(t);
}
function ae(e) {
  return e ? Jr(e) ? !0 : zr(e) ? !1 : e.length === 0 ? !0 : e.length > 0 : !1;
}
function zr(e) {
  return e != null && e.toString === String.prototype.toString;
}
function Jr(e) {
  return Array.isArray(e);
}
function Gr(e, t) {
  ae(e) || qt("utils.sum() expects an array, received:", e);
  let n = 0, i;
  for (let o = 0, r = e.length; o < r; o++)
    i = e[o], i && (n += i);
  return n;
}
function Kr(e, t, n) {
  if (!ae(e))
    throw new Error(`#forEach() takes an array-like argument. ${e}`);
  for (let i = 0, o = e.length; i < o; i++)
    t.call(n, e[i], i);
}
function Hr(e, t) {
  for (let n = 0, i = e.length; n < i; n++)
    e[n] = t;
  return e;
}
function Qr(e, t, n, i) {
  const o = e.length - 2;
  let r, s, a, c, h, f, l, u, p, x, w, I, M, g, b, d, y;
  for (ao(t, e), d = 0; d < o; ) {
    for (r = e[d], s = e[d + 1], h = t[r], f = t[s], p = n[r], x = n[s], y = d; y < o && (y += 2, a = e[y], l = t[a], !(f < l)); ) {
      if (w = n[a], c = e[y + 1], u = t[c], I = n[c], p >= w) {
        if (p > I && x > w && x > I) continue;
      } else if (p < I && x < w && x < I) continue;
      if (!(r == a || r == c || s == a || s == c) && (M = Wr(
        h,
        p,
        f,
        x,
        l,
        w,
        u,
        I
      ), M && (g = [r, s], b = [a, c], i(Tn(M, g, b, t, n)) || M.length == 4 && i(Tn(M.slice(2), g, b, t, n)))))
        return !0;
    }
    d += 2;
  }
  return !1;
}
function Wr(e, t, n, i, o, r, s, a) {
  const c = Zr(e, t, n, i, o, r, s, a);
  let h = null;
  return c && (h = to(e, t, n, i, o, r, s, a), h ? so(e, t, n, i, o, r, s, a) && (h = null) : h = oo(e, t, n, i, o, r, s, a)), h;
}
function Zr(e, t, n, i, o, r, s, a) {
  return ie(e, t, n, i, o, r) * ie(e, t, n, i, s, a) <= 0 && ie(o, r, s, a, e, t) * ie(o, r, s, a, n, i) <= 0;
}
function ie(e, t, n, i, o, r) {
  return Qn(e - o, t - r, n - o, i - r);
}
function Qn(e, t, n, i) {
  return e * i - t * n;
}
function to(e, t, n, i, o, r, s, a) {
  let c = xe(e, t, n, i, o, r, s, a), h;
  return c && (h = no(c[0], c[1], e, t, n, i, o, r, s, a), h == 1 ? c = xe(n, i, e, t, o, r, s, a) : h == 2 ? c = xe(o, r, s, a, e, t, n, i) : h == 3 && (c = xe(s, a, o, r, e, t, n, i))), c && ro(c, e, t, n, i, o, r, s, a), c;
}
function xe(e, t, n, i, o, r, s, a) {
  const c = Qn(n - e, i - t, s - o, a - r), h = 1e-18;
  let f;
  if (c === 0) return null;
  const l = ie(o, r, s, a, e, t) / c;
  return c <= h && c >= -h ? f = eo(e, t, n, i, o, r, s, a) : f = [e + l * (n - e), t + l * (i - t)], f;
}
function eo(e, t, n, i, o, r, s, a) {
  let c = null;
  return !Pt(e, o, s) && !Pt(t, r, a) ? c = [e, t] : !Pt(n, o, s) && !Pt(i, r, a) ? c = [n, i] : !Pt(o, e, n) && !Pt(r, t, i) ? c = [o, r] : !Pt(s, e, n) && !Pt(a, t, i) && (c = [s, a]), c;
}
function Pt(e, t, n) {
  let i;
  return t < n ? i = e < t || e > n : t > n ? i = e > t || e < n : i = e != t, i;
}
function no(e, t, ...n) {
  let i = -1, o = 1 / 0, r;
  for (let s = 0, a = 0, c = n.length; a < c; s++, a += 2)
    r = io(e, t, n[a], n[a + 1]), r < o && (o = r, i = s);
  return i;
}
function io(e, t, n, i) {
  const o = e - n, r = t - i;
  return o * o + r * r;
}
function ro(e, t, n, i, o, r, s, a, c) {
  let h = e[0], f = e[1];
  h = _e(h, t, i), h = _e(h, r, a), f = _e(f, n, o), f = _e(f, s, c), e[0] = h, e[1] = f;
}
function _e(e, t, n) {
  let i;
  return Pt(e, t, n) && (i = Math.abs(e - t) < Math.abs(e - n) ? t : n, e = i), e;
}
function oo(e, t, n, i, o, r, s, a) {
  const c = Math.min(e, n, o, s), h = Math.max(e, n, o, s), f = Math.min(t, i, r, a), l = Math.max(t, i, r, a), u = l - f > h - c;
  let p = [];
  return (u ? $t(t, f, l) : $t(e, c, h)) && p.push(e, t), (u ? $t(i, f, l) : $t(n, c, h)) && p.push(n, i), (u ? $t(r, f, l) : $t(o, c, h)) && p.push(o, r), (u ? $t(a, f, l) : $t(s, c, h)) && p.push(s, a), (p.length != 2 && p.length != 4 || p.length == 4 && p[0] == p[2] && p[1] == p[3]) && (p = null), p;
}
function so(e, t, n, i, o, r, s, a) {
  return e == o && t == r || e == s && t == a || n == o && i == r || n == s && i == a;
}
function $t(e, t, n) {
  return e > t && e < n;
}
function ao(e, t) {
  co(e, t), Wn(e, t, 0, t.length - 2);
}
function co(e, t) {
  for (let n = 0, i = t.length; n < i; n += 2)
    e[t[n]] > e[t[n + 1]] && lo(t, n, n + 1);
}
function lo(e, t, n) {
  const i = e[t];
  e[t] = e[n], e[n] = i;
}
function Wn(e, t, n, i) {
  let o = n, r = i, s, a;
  for (; o < i; ) {
    for (s = e[t[n + i >> 2 << 1]]; o <= r; ) {
      for (; e[t[o]] < s; ) o += 2;
      for (; e[t[r]] > s; ) r -= 2;
      o <= r && (a = t[o], t[o] = t[r], t[r] = a, a = t[o + 1], t[o + 1] = t[r + 1], t[r + 1] = a, o += 2, r -= 2);
    }
    if (r - n < 40 ? Pn(e, t, n, r) : Wn(e, t, n, r), i - o < 40) {
      Pn(e, t, o, i);
      return;
    }
    n = o, r = i;
  }
}
function Pn(e, t, n, i) {
  let o, r;
  for (let s = n + 2; s <= i; s += 2) {
    o = t[s], r = t[s + 1];
    let a;
    for (a = s - 2; a >= n && e[o] < e[t[a]]; a -= 2)
      t[a + 2] = t[a], t[a + 3] = t[a + 1];
    t[a + 2] = o, t[a + 3] = r;
  }
}
function Tn(e, t, n, i, o) {
  const r = e[0], s = e[1];
  t = Bn(r, s, t[0], t[1], i, o), n = Bn(r, s, n[0], n[1], i, o);
  const a = t[0] < n[0] ? t : n, c = a == t ? n : t;
  return { x: r, y: s, a, b: c };
}
function Bn(e, t, n, i, o, r) {
  let s = n < i ? n : i, a = s === n ? i : n;
  return o[s] == e && r[s] == t ? a = s : o[a] == e && r[a] == t && (s = a), [s, a];
}
function ho(e) {
  return `${e.a.join(",")};${e.b.join(",")}`;
}
class fo {
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
function uo(e, t, n, i) {
  let o = n | 0;
  const r = isNaN(i) ? e.length - o : i + o;
  let s, a, c, h, f, l;
  if (r > 0)
    c = f = e[o], h = l = t[o];
  else return [void 0, void 0, void 0, void 0];
  for (o++; o < r; o++)
    s = e[o], a = t[o], s < c && (c = s), s > f && (f = s), a < h && (h = a), a > l && (l = a);
  return [c, h, f, l];
}
class ce {
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
    return new ce(
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
  setBounds(t, n, i, o) {
    let r, s, a, c;
    if (arguments.length == 1)
      if (ae(t)) {
        const h = t;
        r = h[0], s = h[1], a = h[2], c = h[3];
      } else {
        const h = t;
        r = h.xmin, s = h.ymin, a = h.xmax, c = h.ymax;
      }
    else
      r = t, s = n, a = i, c = o;
    return this.xmin = r, this.ymin = s, this.xmax = a, this.ymax = c, (r > a || s > c) && this.update(), this;
  }
  update() {
    let t;
    this.xmin > this.xmax && (t = this.xmin, this.xmin = this.xmax, this.xmax = t), this.ymin > this.ymax && (t = this.ymin, this.ymin = this.ymax, this.ymax = t);
  }
  mergeBounds(t, ...n) {
    let i, o, r, s;
    return t instanceof ce ? (i = t.xmin, o = t.ymin, r = t.xmax, s = t.ymax) : n.length == 3 ? (i = t, o = n[0], r = n[1], s = n[2]) : t.length == 4 ? (i = t[0], o = t[1], r = t[2], s = t[3]) : qt("Bounds#mergeBounds() invalid argument:", t), this.xmin === void 0 ? this.setBounds(i, o, r, s) : (i < this.xmin && (this.xmin = i), o < this.ymin && (this.ymin = o), r > this.xmax && (this.xmax = r), s > this.ymax && (this.ymax = s)), this;
  }
}
function Ae(e) {
  const t = ["a", "b", "c"].map(
    (n) => e.properties[n].index
  );
  return [
    [0, 1],
    [0, 2],
    [1, 2],
    [0, 1, 2]
  ].map(
    (n) => n.map((i) => t[i]).sort().join("-")
  ).sort();
}
function Zn(e, t, n) {
  const i = Ae(t.forw), o = Ae(t.bakw);
  if (JSON.stringify(i) != JSON.stringify(o))
    throw `${JSON.stringify(t, null, 2)}
${JSON.stringify(
      i
    )}
${JSON.stringify(o)}`;
  for (let r = 0; r < i.length; r++) {
    const s = i[r];
    e[s] || (e[s] = []), e[s].push(t);
  }
  n && (n.forw.features.push(t.forw), n.bakw.features.push(t.bakw));
}
function Cn(e, t, n) {
  const i = Ae(t.forw), o = Ae(t.bakw);
  if (JSON.stringify(i) != JSON.stringify(o))
    throw `${JSON.stringify(t, null, 2)}
${JSON.stringify(i)}
${JSON.stringify(o)}`;
  if (i.forEach((r) => {
    const s = e[r];
    if (!s) return;
    const a = s.filter((c) => c !== t);
    a.length === 0 ? delete e[r] : e[r] = a;
  }), n) {
    const r = (s, a) => {
      !s || !a || (s.features = s.features.filter((c) => c !== a));
    };
    r(n.forw, t.forw), r(n.bakw, t.bakw);
  }
}
function Me(e, t, n) {
  return Yt(e, { target: { geom: t, index: n } });
}
function Se(e) {
  return Yt(e.properties.target.geom, {
    target: {
      geom: e.geometry.coordinates,
      index: e.properties.target.index
    }
  });
}
function Xn(e, t) {
  const n = e.length, i = t.geometry.coordinates;
  return Array.from({ length: n }, (o, r) => r).map((o) => {
    const r = (o + 1) % n, s = e[o], a = e[r], c = s.geometry.coordinates, h = Math.atan2(
      c[0] - i[0],
      c[1] - i[1]
    ), f = [t, s, a, t].map(
      (p) => p.geometry.coordinates
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
        geom: a.properties.target.geom,
        index: a.properties.target.index
      }
    }, u = St([
      le([f], l)
    ]);
    return [h, u];
  }).reduce(
    (o, r) => (o[0].push(r[0]), o[1].push(r[1]), o),
    [[], []]
  );
}
function Ee(e, t = 1e-6) {
  const [n, i] = e[0], [o, r] = e[1], [s, a] = e[2];
  return Math.abs((o - n) * (a - i) - (s - n) * (r - i)) < t;
}
function po(e, t) {
  const n = /* @__PURE__ */ new Set();
  return e.forEach((i) => {
    if (i.length !== 2) return;
    const o = i.map((r) => `${t?.[r] ?? r}`);
    n.add(o.sort().join("-"));
  }), n;
}
function re(e) {
  return ["a", "b", "c"].map((t, n) => ({
    prop: e.properties[t],
    geom: e.geometry.coordinates[0][n]
  }));
}
const mo = 10;
function go(e, t, n, i, o, r) {
  if (!e && !t) return !1;
  const s = e ? 0 : 1, a = 1 - s, c = n[s], h = n[a];
  if (!c || !h) return !1;
  const f = xt(h.geom);
  let l = !1, u = !1;
  for (let p = 0; p <= 1; p++) {
    const x = i[p];
    if (!x) continue;
    const w = [String(x.prop.index), String(c.prop.index)].sort().join("-"), I = o[w];
    if (!I || I.length < 2) continue;
    const M = I.find(
      (P) => P.bakw !== r[s].bakw
    );
    if (!M) continue;
    const b = re(M.bakw).find(
      (P) => String(P.prop.index) !== String(x.prop.index) && String(P.prop.index) !== String(c.prop.index)
    );
    if (!b) continue;
    l = !0;
    const d = xt(b.geom), y = xt(x.geom), m = xt(c.geom), S = m[0] - y[0], E = m[1] - y[1], k = S * (f[1] - y[1]) - E * (f[0] - y[0]), N = S * (d[1] - y[1]) - E * (d[0] - y[0]);
    if (k * N > 0) {
      u = !0;
      break;
    }
  }
  return l && !u;
}
function wo(e, t, n, i) {
  if (!e && !t) return !1;
  if (n[0] && n[1] && i[0] && i[1]) {
    const o = i.map((f) => xt(f.geom)), r = n.map((f) => xt(f.geom)), s = o[1][0] - o[0][0], a = o[1][1] - o[0][1], c = s * (r[0][1] - o[0][1]) - a * (r[0][0] - o[0][0]), h = s * (r[1][1] - o[0][1]) - a * (r[1][0] - o[0][0]);
    return c * h < 0;
  }
  return !1;
}
function yo(e, t, n, i) {
  const o = po(n, i), r = /* @__PURE__ */ new Set();
  let s = !1;
  for (let a = 0; a < mo; a++) {
    let c = !1;
    for (const h of Object.keys(t)) {
      if (r.has(h)) continue;
      r.add(h);
      const f = t[h];
      if (!f || f.length < 2) continue;
      const l = h.split("-");
      if (l.length !== 2 || o.has(h)) continue;
      const u = re(f[0].bakw), p = re(f[1].bakw), x = re(f[0].forw), w = re(f[1].forw), I = l.map(
        (_) => u.find((B) => `${B.prop.index}` === _) || p.find((B) => `${B.prop.index}` === _)
      ), M = l.map(
        (_) => x.find((B) => `${B.prop.index}` === _) || w.find((B) => `${B.prop.index}` === _)
      );
      if (I.some((_) => !_) || M.some((_) => !_))
        continue;
      const g = [u, p].map(
        (_) => _.find((B) => !l.includes(`${B.prop.index}`))
      ), b = [x, w].map(
        (_) => _.find((B) => !l.includes(`${B.prop.index}`))
      );
      if (g.some((_) => !_) || b.some((_) => !_))
        continue;
      const d = f[0].bakw.geometry.coordinates[0].slice(0, 3).map((_) => xt(_)), y = f[1].bakw.geometry.coordinates[0].slice(0, 3).map((_) => xt(_)), m = f[0].forw.geometry.coordinates[0].slice(0, 3).map((_) => xt(_)), S = f[1].forw.geometry.coordinates[0].slice(0, 3).map((_) => xt(_)), E = Ee(d), k = Ee(y), N = Ee(m), P = Ee(S), C = go(
        E,
        k,
        g,
        I,
        t,
        f
      ), D = wo(
        N,
        P,
        g,
        I
      );
      if (!(C || D || Fn(
        xt(g[0].geom),
        y
      ) || Fn(
        xt(g[1].geom),
        d
      )))
        continue;
      const O = M.map(
        (_) => xt(_.geom)
      ), A = b.map(
        (_) => xt(_.geom)
      ), T = vo([
        ...O,
        ...A
      ]), X = bo(T), R = Rn(
        O[0],
        O[1],
        A[0]
      ) + Rn(
        O[0],
        O[1],
        A[1]
      );
      qe(X, R) && (Cn(t, f[0], e), Cn(t, f[1], e), I.forEach((_) => {
        if (!_) return;
        const B = [
          _.geom,
          g[0].geom,
          g[1].geom,
          _.geom
        ], F = {
          a: _.prop,
          b: g[0].prop,
          c: g[1].prop
        }, $ = le([B], F), L = zn($);
        Zn(t, {
          forw: L,
          bakw: $
        }, e);
      }), c = !0, s = !0);
    }
    if (!c) break;
  }
  return s;
}
function xt(e) {
  return [e[0], e[1]];
}
function Fn(e, t) {
  const [n, i] = t[0], [o, r] = t[1], [s, a] = t[2], c = s - n, h = a - i, f = o - n, l = r - i, u = e[0] - n, p = e[1] - i, x = c * c + h * h, w = c * f + h * l, I = c * u + h * p, M = f * f + l * l, g = f * u + l * p, b = x * M - w * w;
  if (b === 0) return !1;
  const d = 1 / b, y = (M * I - w * g) * d, m = (x * g - w * I) * d, S = 1e-9;
  return y >= -S && m >= -S && y + m <= 1 + S;
}
function vo(e) {
  const t = e.map((s) => s.slice()).filter(
    (s, a, c) => c.findIndex(
      (h) => qe(h[0], s[0]) && qe(h[1], s[1])
    ) === a
  );
  if (t.length <= 1) return t;
  const n = t.sort(
    (s, a) => s[0] === a[0] ? s[1] - a[1] : s[0] - a[0]
  ), i = (s, a, c) => (a[0] - s[0]) * (c[1] - s[1]) - (a[1] - s[1]) * (c[0] - s[0]), o = [];
  for (const s of n) {
    for (; o.length >= 2 && i(
      o[o.length - 2],
      o[o.length - 1],
      s
    ) <= 0; )
      o.pop();
    o.push(s);
  }
  const r = [];
  for (let s = n.length - 1; s >= 0; s--) {
    const a = n[s];
    for (; r.length >= 2 && i(
      r[r.length - 2],
      r[r.length - 1],
      a
    ) <= 0; )
      r.pop();
    r.push(a);
  }
  return r.pop(), o.pop(), o.concat(r);
}
function bo(e) {
  if (e.length < 3) return 0;
  let t = 0;
  for (let n = 0; n < e.length; n++) {
    const [i, o] = e[n], [r, s] = e[(n + 1) % e.length];
    t += i * s - r * o;
  }
  return Math.abs(t) / 2;
}
function Rn(e, t, n) {
  return Math.abs(
    (e[0] * (t[1] - n[1]) + t[0] * (n[1] - e[1]) + n[0] * (e[1] - t[1])) / 2
  );
}
function qe(e, t, n = 1e-9) {
  return Math.abs(e - t) <= n;
}
const Dn = 2.00704, $n = 3.00001;
class lt extends Mt {
  importance;
  priority;
  pointsSet;
  useV2Algorithm;
  /**
   * Tinクラスのインスタンスを生成します
   * @param options - 初期化オプション
   */
  constructor(t = {}) {
    super(), t.bounds ? this.setBounds(t.bounds) : (this.setWh(t.wh), this.vertexMode = t.vertexMode || lt.VERTEX_PLAIN), this.strictMode = t.strictMode || lt.MODE_AUTO, this.yaxisMode = t.yaxisMode || lt.YAXIS_INVERT, this.importance = t.importance || 0, this.priority = t.priority || 0, this.stateFull = t.stateFull || !1, this.useV2Algorithm = t.useV2Algorithm ?? !1, t.points && this.setPoints(t.points), t.edges && this.setEdges(t.edges);
  }
  /**
   * フォーマットバージョンを取得します
   */
  getFormatVersion() {
    return this.useV2Algorithm ? Dn : $n;
  }
  /**
   * 制御点（GCP: Ground Control Points）を設定します。
   * 指定した点群に合わせて内部のTINキャッシュをリセットします。
   */
  setPoints(t) {
    this.yaxisMode === lt.YAXIS_FOLLOW && (t = t.map((n) => [
      n[0],
      [n[1][0], -1 * n[1][1]]
    ])), this.points = t, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * エッジ（制約線）を設定します。
   * 制約線を正規化した上で、依存するキャッシュをリセットします。
   */
  setEdges(t = []) {
    this.edges = Jn(t), this.edgeNodes = void 0, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 境界ポリゴンを設定します
   */
  setBounds(t) {
    this.bounds = t;
    let n = t[0][0], i = n, o = t[0][1], r = o;
    const s = [t[0]];
    for (let a = 1; a < t.length; a++) {
      const c = t[a];
      c[0] < n && (n = c[0]), c[0] > i && (i = c[0]), c[1] < o && (o = c[1]), c[1] > r && (r = c[1]), s.push(c);
    }
    s.push(t[0]), this.boundsPolygon = le([s]), this.xy = [n, o], this.wh = [i - n, r - o], this.vertexMode = lt.VERTEX_PLAIN, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 現在の設定を永続化可能な形式にコンパイルします
   */
  getCompiled() {
    const t = {};
    t.version = this.useV2Algorithm ? Dn : $n, t.points = this.points, t.weight_buffer = {}, t.centroid_point = [
      this.centroid.forw.geometry.coordinates,
      this.centroid.forw.properties.target.geom
    ], t.vertices_params = [
      this.vertices_params.forw[0],
      this.vertices_params.bakw[0]
    ], t.vertices_points = [];
    const n = this.vertices_params.forw[1];
    if (n)
      for (let i = 0; i < n.length; i++) {
        const o = n[i].features[0], r = o.geometry.coordinates[0][1], s = o.properties.b.geom;
        t.vertices_points[i] = [r, s];
      }
    return t.strict_status = this.strict_status, t.tins_points = [[]], this.tins.forw.features.map((i) => {
      t.tins_points[0].push(
        ["a", "b", "c"].map(
          (o) => i.properties[o].index
        )
      );
    }), this.strict_status === lt.STATUS_LOOSE ? (t.tins_points[1] = [], this.tins.bakw.features.map((i) => {
      t.tins_points[1].push(
        ["a", "b", "c"].map(
          (o) => i.properties[o].index
        )
      );
    })) : this.strict_status === lt.STATUS_ERROR && this.kinks?.bakw && (t.kinks_points = this.kinks.bakw.features.map(
      (i) => i.geometry.coordinates
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
   *
   * @param kinkLimit - forw / bakw それぞれで残す交差（kinks）の件数の上限
   *   （同じ位置の交差を 1 件に数えた件数）。届いた時点で数え上げをやめます
   */
  calculateStrictTin(t = Nn) {
    const n = this.tins.forw.features.map(
      (s) => zn(s)
    );
    this.tins.bakw = St(n);
    const i = {};
    this.tins.forw.features.forEach((s, a) => {
      const c = this.tins.bakw.features[a];
      Zn(i, { forw: s, bakw: c });
    });
    const o = (this.pointsSet?.forw.features ?? []).map(
      (s) => s.properties.target.index
    );
    yo(
      this.tins,
      i,
      this.pointsSet?.edges || [],
      o
    );
    const r = ["forw", "bakw"].map((s) => {
      const a = this.tins[s].features.map(
        (c) => c.geometry.coordinates[0]
      );
      return Hn(a, t);
    });
    r[0].length === 0 && r[1].length === 0 ? (this.strict_status = lt.STATUS_STRICT, delete this.kinks) : (this.strict_status = lt.STATUS_ERROR, this.kinks = {
      forw: St(r[0]),
      bakw: St(r[1])
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
    for (let o = 0; o < this.points.length; o++) {
      const r = this.points[o][0], s = this.points[o][1], a = Me(r, s, o);
      t.forw.push(a), t.bakw.push(Se(a));
    }
    const n = [];
    let i = 0;
    this.edgeNodes = [], this.edges || (this.edges = []);
    for (let o = 0; o < this.edges.length; o++) {
      const r = this.edges[o][2], s = Object.assign([], this.edges[o][0]), a = Object.assign([], this.edges[o][1]);
      if (xo(r, this.points.length, o), s.length === 0 && a.length === 0) {
        n.push(r);
        continue;
      }
      s.unshift(this.points[r[0]][0]), s.push(this.points[r[1]][0]), a.unshift(this.points[r[0]][1]), a.push(this.points[r[1]][1]), Br(s, a).map((c, h, f) => {
        this.edgeNodes[i] = [
          c[0],
          c[1]
        ];
        const l = Me(
          c[0],
          c[1],
          `e${i}`
        );
        i++, t.forw.push(l), t.bakw.push(Se(l)), h === 0 ? n.push([r[0], t.forw.length - 1]) : n.push([
          t.forw.length - 2,
          t.forw.length - 1
        ]), h === f.length - 1 && n.push([t.forw.length - 1, r[1]]);
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
    const t = this.xy[0] - 0.05 * this.wh[0], n = this.xy[0] + 1.05 * this.wh[0], i = this.xy[1] - 0.05 * this.wh[1], o = this.xy[1] + 1.05 * this.wh[1];
    if (this.bounds && !this.boundsPolygon) throw new Error("Internal error: bounds is set but boundsPolygon is missing");
    const r = this.bounds ? this.boundsPolygon : void 0;
    if (!this.points.reduce((c, h) => c && (r ? Fe(h[0], r) : h[0][0] >= t && h[0][0] <= n && h[0][1] >= i && h[0][1] <= o), !0))
      throw "SOME POINTS OUTSIDE";
    let a = [];
    return this.wh && (a = [[t, i], [n, i], [t, o], [n, o]]), {
      pointsSet: this.generatePointsSet(),
      bbox: a,
      minx: t,
      maxx: n,
      miny: i,
      maxy: o
    };
  }
  /**
   * Compute a bounding box derived from GCP coordinates with a 5% margin.
   * Used in V3 plain mode where no explicit image bounds are available.
   */
  computeGcpBbox() {
    let t = 1 / 0, n = -1 / 0, i = 1 / 0, o = -1 / 0;
    for (const a of this.points) {
      const c = a[0][0], h = a[0][1];
      c < t && (t = c), c > n && (n = c), h < i && (i = h), h > o && (o = h);
    }
    const r = n - t, s = o - i;
    return {
      minx: t - 0.05 * r,
      maxx: n + 0.05 * r,
      miny: i - 0.05 * s,
      maxy: o + 0.05 * s
    };
  }
  /**
   * TINネットワークを同期的に更新し、座標変換の準備を行います。
   * 重めの計算を伴うため、呼び出し側が非同期制御を行いたい場合は
   * {@link updateTinAsync} を利用してください。
   */
  updateTin() {
    let t = this.strictMode;
    t !== lt.MODE_STRICT && t !== lt.MODE_LOOSE && (t = lt.MODE_AUTO);
    const n = !this.useV2Algorithm;
    let i, o, r, s, a;
    if (n) {
      if (this.bounds) {
        const E = this.boundsPolygon;
        if (!E) throw new Error("Internal error: bounds is set but boundsPolygon is missing");
        if (!this.points.every(
          (N) => Fe(N[0], E)
        )) throw "SOME POINTS OUTSIDE";
      }
      i = this.generatePointsSet(), { minx: o, maxx: r, miny: s, maxy: a } = this.computeGcpBbox();
    } else {
      const E = this.validateAndPrepareInputs();
      i = E.pointsSet, o = E.minx, r = E.maxx, s = E.miny, a = E.maxy;
    }
    const c = {
      forw: St(i.forw),
      bakw: St(i.bakw)
    }, h = be(
      c.forw,
      i.edges,
      "target"
    ), f = be(
      c.bakw,
      i.edges,
      "target"
    );
    if (h.features.length === 0 || f.features.length === 0)
      throw "TOO LINEAR1";
    const l = Ci(c.forw), u = mn(c.forw);
    if (!u) throw "TOO LINEAR2";
    const p = {}, x = u.geometry.coordinates[0];
    let w;
    try {
      w = x.map((E) => ({
        forw: E,
        bakw: ne(Yt(E), h)
      })), w.forEach((E) => {
        p[`${E.forw[0]}:${E.forw[1]}`] = E;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const I = mn(c.bakw);
    if (!I) throw "TOO LINEAR2";
    const M = I.geometry.coordinates[0];
    try {
      w = M.map((E) => ({
        bakw: E,
        forw: ne(Yt(E), f)
      })), w.forEach((E) => {
        p[`${E.forw[0]}:${E.forw[1]}`] = E;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    let g;
    if (n) {
      const E = l.geometry.coordinates, k = h.features.find(
        (N) => Fe(
          Yt(E),
          N
        )
      );
      if (k) {
        const N = k.geometry.coordinates[0], P = k.properties.a.geom, C = k.properties.b.geom, D = k.properties.c.geom;
        g = {
          forw: [
            (N[0][0] + N[1][0] + N[2][0]) / 3,
            (N[0][1] + N[1][1] + N[2][1]) / 3
          ],
          bakw: [
            (P[0] + C[0] + D[0]) / 3,
            (P[1] + C[1] + D[1]) / 3
          ]
        };
      } else
        g = {
          forw: E,
          bakw: ne(l, h)
        };
    } else
      g = {
        forw: l.geometry.coordinates,
        bakw: ne(l, h)
      };
    const b = Me(g.forw, g.bakw, "c");
    this.centroid = {
      forw: b,
      bakw: Se(b)
    };
    const d = [
      ...this.points.map((E) => ({ forw: E[0], bakw: E[1] })),
      ...(this.edgeNodes ?? []).map((E) => ({ forw: E[0], bakw: E[1] }))
    ], y = {
      convexBuf: p,
      centroid: g,
      allGcps: d,
      minx: o,
      maxx: r,
      miny: s,
      maxy: a
    }, m = this.vertexMode === lt.VERTEX_BIRDEYE ? Vr(y, n) : Lr(y, n), S = {
      forw: [],
      bakw: []
    };
    for (let E = 0; E < m.length; E++) {
      const k = m[E].forw, N = m[E].bakw, P = Me(k, N, `b${E}`), C = Se(P);
      i.forw.push(P), i.bakw.push(C), S.forw.push(P), S.bakw.push(C);
    }
    this.pointsSet = {
      forw: St(i.forw),
      bakw: St(i.bakw),
      edges: i.edges
    }, this.tins = {
      forw: _n(
        be(
          this.pointsSet.forw,
          i.edges,
          "target"
        )
      )
    }, (t === lt.MODE_STRICT || t === lt.MODE_AUTO) && this.calculateStrictTin(
      t === lt.MODE_AUTO ? 1 : Nn
    ), (t === lt.MODE_LOOSE || t === lt.MODE_AUTO && this.strict_status === lt.STATUS_ERROR) && (this.tins.bakw = _n(
      be(
        this.pointsSet.bakw,
        i.edges,
        "target"
      )
    ), delete this.kinks, this.strict_status = lt.STATUS_LOOSE), this.vertices_params = {
      forw: Xn(S.forw, this.centroid.forw),
      bakw: Xn(S.bakw, this.centroid.bakw)
    }, this.addIndexedTin(), this.pointsWeightBuffer = {};
  }
  /**
   * 非同期ラッパーを提供します。
   * 互換性のために Promise ベースの API を維持しますが、内部処理は同期的です。
   */
  async updateTinAsync() {
    this.updateTin();
  }
}
function xo(e, t, n) {
  const i = (o) => Number.isInteger(o) && o >= 0 && o < t;
  if (!Array.isArray(e) || !i(e[0]) || !i(e[1]))
    throw new Error(
      `Invalid edge at edges[${n}]: start/end ${JSON.stringify(e)} must be integer indices of points (0 to ${t - 1})`
    );
}
export {
  lt as Tin,
  be as constrainedTin,
  Se as counterPoint,
  Me as createPoint,
  lt as default,
  _o as findIntersections,
  Dn as format_version,
  Zn as insertSearchIndex,
  Xn as vertexCalc
};
