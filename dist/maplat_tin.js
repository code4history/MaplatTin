function oe(e, t, n = {}) {
  const r = { type: "Feature" };
  return (n.id === 0 || n.id) && (r.id = n.id), n.bbox && (r.bbox = n.bbox), r.properties = t || {}, r.geometry = e, r;
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
    for (let i = 0; i < o[o.length - 1].length; i++)
      if (o[o.length - 1][i] !== o[0][i])
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
function Et(e, t = {}) {
  const n = { type: "FeatureCollection" };
  return t.id && (n.id = t.id), t.bbox && (n.bbox = t.bbox), n.features = e, n;
}
function We(e) {
  return !isNaN(e) && e !== null && !Array.isArray(e);
}
function sr(e) {
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
function ar(e) {
  return e.type === "Feature" ? e.geometry : e;
}
function ze(e, t, n) {
  if (e !== null)
    for (var r, o, i, s, a, l, f, h = 0, c = 0, u, p = e.type, x = p === "FeatureCollection", w = p === "Feature", I = x ? e.features.length : 1, M = 0; M < I; M++) {
      f = x ? (
        // @ts-expect-error: Known type conflict
        e.features[M].geometry
      ) : w ? (
        // @ts-expect-error: Known type conflict
        e.geometry
      ) : e, u = f ? f.type === "GeometryCollection" : !1, a = u ? f.geometries.length : 1;
      for (var g = 0; g < a; g++) {
        var b = 0, d = 0;
        if (s = u ? f.geometries[g] : f, s !== null) {
          l = s.coordinates;
          var y = s.type;
          switch (h = n && (y === "Polygon" || y === "MultiPolygon") ? 1 : 0, y) {
            case null:
              break;
            case "Point":
              if (
                // @ts-expect-error: Known type conflict
                t(
                  l,
                  c,
                  M,
                  b,
                  d
                ) === !1
              )
                return !1;
              c++, b++;
              break;
            case "LineString":
            case "MultiPoint":
              for (r = 0; r < l.length; r++) {
                if (
                  // @ts-expect-error: Known type conflict
                  t(
                    l[r],
                    c,
                    M,
                    b,
                    d
                  ) === !1
                )
                  return !1;
                c++, y === "MultiPoint" && b++;
              }
              y === "LineString" && b++;
              break;
            case "Polygon":
            case "MultiLineString":
              for (r = 0; r < l.length; r++) {
                for (o = 0; o < l[r].length - h; o++) {
                  if (
                    // @ts-expect-error: Known type conflict
                    t(
                      l[r][o],
                      c,
                      M,
                      b,
                      d
                    ) === !1
                  )
                    return !1;
                  c++;
                }
                y === "MultiLineString" && b++, y === "Polygon" && d++;
              }
              y === "Polygon" && b++;
              break;
            case "MultiPolygon":
              for (r = 0; r < l.length; r++) {
                for (d = 0, o = 0; o < l[r].length; o++) {
                  for (i = 0; i < l[r][o].length - h; i++) {
                    if (
                      // @ts-expect-error: Known type conflict
                      t(
                        l[r][o][i],
                        c,
                        M,
                        b,
                        d
                      ) === !1
                    )
                      return !1;
                    c++;
                  }
                  d++;
                }
                b++;
              }
              break;
            case "GeometryCollection":
              for (r = 0; r < s.geometries.length; r++)
                if (
                  // @ts-expect-error: Known type conflict
                  ze(s.geometries[r], t, n) === !1
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
const pt = 11102230246251565e-32, q = 134217729, Ln = (3 + 8 * pt) * pt;
function ht(e, t, n, r, o) {
  let i, s, a, l, f = t[0], h = r[0], c = 0, u = 0;
  h > f == h > -f ? (i = f, f = t[++c]) : (i = h, h = r[++u]);
  let p = 0;
  if (c < e && u < n)
    for (h > f == h > -f ? (s = f + i, a = i - (s - f), f = t[++c]) : (s = h + i, a = i - (s - h), h = r[++u]), i = s, a !== 0 && (o[p++] = a); c < e && u < n; )
      h > f == h > -f ? (s = i + f, l = s - i, a = i - (s - l) + (f - l), f = t[++c]) : (s = i + h, l = s - i, a = i - (s - l) + (h - l), h = r[++u]), i = s, a !== 0 && (o[p++] = a);
  for (; c < e; )
    s = i + f, l = s - i, a = i - (s - l) + (f - l), f = t[++c], i = s, a !== 0 && (o[p++] = a);
  for (; u < n; )
    s = i + h, l = s - i, a = i - (s - l) + (h - l), h = r[++u], i = s, a !== 0 && (o[p++] = a);
  return (i !== 0 || p === 0) && (o[p++] = i), p;
}
function Mt(e, t, n, r, o, i, s, a) {
  return ht(ht(e, t, n, r, s), s, o, i, a);
}
function Y(e, t, n, r) {
  let o, i, s, a, l, f, h, c, u, p, x;
  h = q * n, p = h - (h - n), x = n - p;
  let w = t[0];
  o = w * n, h = q * w, c = h - (h - w), u = w - c, s = u * x - (o - c * p - u * p - c * x);
  let I = 0;
  s !== 0 && (r[I++] = s);
  for (let M = 1; M < e; M++)
    w = t[M], a = w * n, h = q * w, c = h - (h - w), u = w - c, l = u * x - (a - c * p - u * p - c * x), i = o + l, f = i - o, s = o - (i - f) + (l - f), s !== 0 && (r[I++] = s), o = a + i, s = i - (o - a), s !== 0 && (r[I++] = s);
  return (o !== 0 || I === 0) && (r[I++] = o), I;
}
function Vn(e, t) {
  let n = t[0];
  for (let r = 1; r < e; r++) n += t[r];
  return n;
}
function tt(e) {
  return new Float64Array(e);
}
const cr = (3 + 16 * pt) * pt, lr = (2 + 12 * pt) * pt, fr = (9 + 64 * pt) * pt * pt, zt = tt(4), Ze = tt(8), tn = tt(12), en = tt(16), mt = tt(4);
function hr(e, t, n, r, o, i, s) {
  let a, l, f, h, c, u, p, x, w, I, M, g, b, d, y, m, S, E;
  const k = e - o, N = n - o, P = t - i, C = r - i;
  d = k * C, u = q * k, p = u - (u - k), x = k - p, u = q * C, w = u - (u - C), I = C - w, y = x * I - (d - p * w - x * w - p * I), m = P * N, u = q * P, p = u - (u - P), x = P - p, u = q * N, w = u - (u - N), I = N - w, S = x * I - (m - p * w - x * w - p * I), M = y - S, c = y - M, zt[0] = y - (M + c) + (c - S), g = d + M, c = g - d, b = d - (g - c) + (M - c), M = b - m, c = b - M, zt[1] = b - (M + c) + (c - m), E = g + M, c = E - g, zt[2] = g - (E - c) + (M - c), zt[3] = E;
  let R = Vn(4, zt), v = lr * s;
  if (R >= v || -R >= v || (c = e - k, a = e - (k + c) + (c - o), c = n - N, f = n - (N + c) + (c - o), c = t - P, l = t - (P + c) + (c - i), c = r - C, h = r - (C + c) + (c - i), a === 0 && l === 0 && f === 0 && h === 0) || (v = fr * s + Ln * Math.abs(R), R += k * h + C * a - (P * f + N * l), R >= v || -R >= v)) return R;
  d = a * C, u = q * a, p = u - (u - a), x = a - p, u = q * C, w = u - (u - C), I = C - w, y = x * I - (d - p * w - x * w - p * I), m = l * N, u = q * l, p = u - (u - l), x = l - p, u = q * N, w = u - (u - N), I = N - w, S = x * I - (m - p * w - x * w - p * I), M = y - S, c = y - M, mt[0] = y - (M + c) + (c - S), g = d + M, c = g - d, b = d - (g - c) + (M - c), M = b - m, c = b - M, mt[1] = b - (M + c) + (c - m), E = g + M, c = E - g, mt[2] = g - (E - c) + (M - c), mt[3] = E;
  const O = ht(4, zt, 4, mt, Ze);
  d = k * h, u = q * k, p = u - (u - k), x = k - p, u = q * h, w = u - (u - h), I = h - w, y = x * I - (d - p * w - x * w - p * I), m = P * f, u = q * P, p = u - (u - P), x = P - p, u = q * f, w = u - (u - f), I = f - w, S = x * I - (m - p * w - x * w - p * I), M = y - S, c = y - M, mt[0] = y - (M + c) + (c - S), g = d + M, c = g - d, b = d - (g - c) + (M - c), M = b - m, c = b - M, mt[1] = b - (M + c) + (c - m), E = g + M, c = E - g, mt[2] = g - (E - c) + (M - c), mt[3] = E;
  const A = ht(O, Ze, 4, mt, tn);
  d = a * h, u = q * a, p = u - (u - a), x = a - p, u = q * h, w = u - (u - h), I = h - w, y = x * I - (d - p * w - x * w - p * I), m = l * f, u = q * l, p = u - (u - l), x = l - p, u = q * f, w = u - (u - f), I = f - w, S = x * I - (m - p * w - x * w - p * I), M = y - S, c = y - M, mt[0] = y - (M + c) + (c - S), g = d + M, c = g - d, b = d - (g - c) + (M - c), M = b - m, c = b - M, mt[1] = b - (M + c) + (c - m), E = g + M, c = E - g, mt[2] = g - (E - c) + (M - c), mt[3] = E;
  const T = ht(A, tn, 4, mt, en);
  return en[T - 1];
}
function Ot(e, t, n, r, o, i) {
  const s = (t - i) * (n - o), a = (e - o) * (r - i), l = s - a, f = Math.abs(s + a);
  return Math.abs(l) >= cr * f ? l : -hr(e, t, n, r, o, i, f);
}
const ur = (10 + 96 * pt) * pt, dr = (4 + 48 * pt) * pt, pr = (44 + 576 * pt) * pt * pt, Xt = tt(4), Ft = tt(4), $t = tt(4), kt = tt(4), At = tt(4), It = tt(4), gt = tt(4), wt = tt(4), Oe = tt(8), Ne = tt(8), Pe = tt(8), Te = tt(8), Be = tt(8), Ce = tt(8), ue = tt(8), de = tt(8), pe = tt(8), Lt = tt(4), Vt = tt(4), jt = tt(4), z = tt(8), K = tt(16), nt = tt(16), rt = tt(16), et = tt(32), Rt = tt(32), at = tt(48), bt = tt(64);
let Ht = tt(1152), Xe = tt(1152);
function ct(e, t, n) {
  e = ht(e, Ht, t, n, Xe);
  const r = Ht;
  return Ht = Xe, Xe = r, e;
}
function mr(e, t, n, r, o, i, s, a, l) {
  let f, h, c, u, p, x, w, I, M, g, b, d, y, m, S, E, k, N, P, C, R, v, O, A, T, X, $, _, B, F, D, L, V, U, j;
  const G = e - s, J = n - s, H = o - s, Q = t - a, Z = r - a, W = i - a;
  D = J * W, O = q * J, A = O - (O - J), T = J - A, O = q * W, X = O - (O - W), $ = W - X, L = T * $ - (D - A * X - T * X - A * $), V = H * Z, O = q * H, A = O - (O - H), T = H - A, O = q * Z, X = O - (O - Z), $ = Z - X, U = T * $ - (V - A * X - T * X - A * $), _ = L - U, v = L - _, Xt[0] = L - (_ + v) + (v - U), B = D + _, v = B - D, F = D - (B - v) + (_ - v), _ = F - V, v = F - _, Xt[1] = F - (_ + v) + (v - V), j = B + _, v = j - B, Xt[2] = B - (j - v) + (_ - v), Xt[3] = j, D = H * Q, O = q * H, A = O - (O - H), T = H - A, O = q * Q, X = O - (O - Q), $ = Q - X, L = T * $ - (D - A * X - T * X - A * $), V = G * W, O = q * G, A = O - (O - G), T = G - A, O = q * W, X = O - (O - W), $ = W - X, U = T * $ - (V - A * X - T * X - A * $), _ = L - U, v = L - _, Ft[0] = L - (_ + v) + (v - U), B = D + _, v = B - D, F = D - (B - v) + (_ - v), _ = F - V, v = F - _, Ft[1] = F - (_ + v) + (v - V), j = B + _, v = j - B, Ft[2] = B - (j - v) + (_ - v), Ft[3] = j, D = G * Z, O = q * G, A = O - (O - G), T = G - A, O = q * Z, X = O - (O - Z), $ = Z - X, L = T * $ - (D - A * X - T * X - A * $), V = J * Q, O = q * J, A = O - (O - J), T = J - A, O = q * Q, X = O - (O - Q), $ = Q - X, U = T * $ - (V - A * X - T * X - A * $), _ = L - U, v = L - _, $t[0] = L - (_ + v) + (v - U), B = D + _, v = B - D, F = D - (B - v) + (_ - v), _ = F - V, v = F - _, $t[1] = F - (_ + v) + (v - V), j = B + _, v = j - B, $t[2] = B - (j - v) + (_ - v), $t[3] = j, f = ht(
    ht(
      ht(
        Y(Y(4, Xt, G, z), z, G, K),
        K,
        Y(Y(4, Xt, Q, z), z, Q, nt),
        nt,
        et
      ),
      et,
      ht(
        Y(Y(4, Ft, J, z), z, J, K),
        K,
        Y(Y(4, Ft, Z, z), z, Z, nt),
        nt,
        Rt
      ),
      Rt,
      bt
    ),
    bt,
    ht(
      Y(Y(4, $t, H, z), z, H, K),
      K,
      Y(Y(4, $t, W, z), z, W, nt),
      nt,
      et
    ),
    et,
    Ht
  );
  let st = Vn(f, Ht), ft = dr * l;
  if (st >= ft || -st >= ft || (v = e - G, h = e - (G + v) + (v - s), v = t - Q, p = t - (Q + v) + (v - a), v = n - J, c = n - (J + v) + (v - s), v = r - Z, x = r - (Z + v) + (v - a), v = o - H, u = o - (H + v) + (v - s), v = i - W, w = i - (W + v) + (v - a), h === 0 && c === 0 && u === 0 && p === 0 && x === 0 && w === 0) || (ft = pr * l + Ln * Math.abs(st), st += (G * G + Q * Q) * (J * w + W * c - (Z * u + H * x)) + 2 * (G * h + Q * p) * (J * W - Z * H) + ((J * J + Z * Z) * (H * p + Q * u - (W * h + G * w)) + 2 * (J * c + Z * x) * (H * Q - W * G)) + ((H * H + W * W) * (G * x + Z * h - (Q * c + J * p)) + 2 * (H * u + W * w) * (G * Z - Q * J)), st >= ft || -st >= ft))
    return st;
  if ((c !== 0 || x !== 0 || u !== 0 || w !== 0) && (D = G * G, O = q * G, A = O - (O - G), T = G - A, L = T * T - (D - A * A - (A + A) * T), V = Q * Q, O = q * Q, A = O - (O - Q), T = Q - A, U = T * T - (V - A * A - (A + A) * T), _ = L + U, v = _ - L, kt[0] = L - (_ - v) + (U - v), B = D + _, v = B - D, F = D - (B - v) + (_ - v), _ = F + V, v = _ - F, kt[1] = F - (_ - v) + (V - v), j = B + _, v = j - B, kt[2] = B - (j - v) + (_ - v), kt[3] = j), (u !== 0 || w !== 0 || h !== 0 || p !== 0) && (D = J * J, O = q * J, A = O - (O - J), T = J - A, L = T * T - (D - A * A - (A + A) * T), V = Z * Z, O = q * Z, A = O - (O - Z), T = Z - A, U = T * T - (V - A * A - (A + A) * T), _ = L + U, v = _ - L, At[0] = L - (_ - v) + (U - v), B = D + _, v = B - D, F = D - (B - v) + (_ - v), _ = F + V, v = _ - F, At[1] = F - (_ - v) + (V - v), j = B + _, v = j - B, At[2] = B - (j - v) + (_ - v), At[3] = j), (h !== 0 || p !== 0 || c !== 0 || x !== 0) && (D = H * H, O = q * H, A = O - (O - H), T = H - A, L = T * T - (D - A * A - (A + A) * T), V = W * W, O = q * W, A = O - (O - W), T = W - A, U = T * T - (V - A * A - (A + A) * T), _ = L + U, v = _ - L, It[0] = L - (_ - v) + (U - v), B = D + _, v = B - D, F = D - (B - v) + (_ - v), _ = F + V, v = _ - F, It[1] = F - (_ - v) + (V - v), j = B + _, v = j - B, It[2] = B - (j - v) + (_ - v), It[3] = j), h !== 0 && (I = Y(4, Xt, h, Oe), f = ct(f, Mt(
    Y(I, Oe, 2 * G, K),
    K,
    Y(Y(4, It, h, z), z, Z, nt),
    nt,
    Y(Y(4, At, h, z), z, -W, rt),
    rt,
    et,
    at
  ), at)), p !== 0 && (M = Y(4, Xt, p, Ne), f = ct(f, Mt(
    Y(M, Ne, 2 * Q, K),
    K,
    Y(Y(4, At, p, z), z, H, nt),
    nt,
    Y(Y(4, It, p, z), z, -J, rt),
    rt,
    et,
    at
  ), at)), c !== 0 && (g = Y(4, Ft, c, Pe), f = ct(f, Mt(
    Y(g, Pe, 2 * J, K),
    K,
    Y(Y(4, kt, c, z), z, W, nt),
    nt,
    Y(Y(4, It, c, z), z, -Q, rt),
    rt,
    et,
    at
  ), at)), x !== 0 && (b = Y(4, Ft, x, Te), f = ct(f, Mt(
    Y(b, Te, 2 * Z, K),
    K,
    Y(Y(4, It, x, z), z, G, nt),
    nt,
    Y(Y(4, kt, x, z), z, -H, rt),
    rt,
    et,
    at
  ), at)), u !== 0 && (d = Y(4, $t, u, Be), f = ct(f, Mt(
    Y(d, Be, 2 * H, K),
    K,
    Y(Y(4, At, u, z), z, Q, nt),
    nt,
    Y(Y(4, kt, u, z), z, -Z, rt),
    rt,
    et,
    at
  ), at)), w !== 0 && (y = Y(4, $t, w, Ce), f = ct(f, Mt(
    Y(y, Ce, 2 * W, K),
    K,
    Y(Y(4, kt, w, z), z, J, nt),
    nt,
    Y(Y(4, At, w, z), z, -G, rt),
    rt,
    et,
    at
  ), at)), h !== 0 || p !== 0) {
    if (c !== 0 || x !== 0 || u !== 0 || w !== 0 ? (D = c * W, O = q * c, A = O - (O - c), T = c - A, O = q * W, X = O - (O - W), $ = W - X, L = T * $ - (D - A * X - T * X - A * $), V = J * w, O = q * J, A = O - (O - J), T = J - A, O = q * w, X = O - (O - w), $ = w - X, U = T * $ - (V - A * X - T * X - A * $), _ = L + U, v = _ - L, gt[0] = L - (_ - v) + (U - v), B = D + _, v = B - D, F = D - (B - v) + (_ - v), _ = F + V, v = _ - F, gt[1] = F - (_ - v) + (V - v), j = B + _, v = j - B, gt[2] = B - (j - v) + (_ - v), gt[3] = j, D = u * -Z, O = q * u, A = O - (O - u), T = u - A, O = q * -Z, X = O - (O - -Z), $ = -Z - X, L = T * $ - (D - A * X - T * X - A * $), V = H * -x, O = q * H, A = O - (O - H), T = H - A, O = q * -x, X = O - (O - -x), $ = -x - X, U = T * $ - (V - A * X - T * X - A * $), _ = L + U, v = _ - L, wt[0] = L - (_ - v) + (U - v), B = D + _, v = B - D, F = D - (B - v) + (_ - v), _ = F + V, v = _ - F, wt[1] = F - (_ - v) + (V - v), j = B + _, v = j - B, wt[2] = B - (j - v) + (_ - v), wt[3] = j, S = ht(4, gt, 4, wt, de), D = c * w, O = q * c, A = O - (O - c), T = c - A, O = q * w, X = O - (O - w), $ = w - X, L = T * $ - (D - A * X - T * X - A * $), V = u * x, O = q * u, A = O - (O - u), T = u - A, O = q * x, X = O - (O - x), $ = x - X, U = T * $ - (V - A * X - T * X - A * $), _ = L - U, v = L - _, Vt[0] = L - (_ + v) + (v - U), B = D + _, v = B - D, F = D - (B - v) + (_ - v), _ = F - V, v = F - _, Vt[1] = F - (_ + v) + (v - V), j = B + _, v = j - B, Vt[2] = B - (j - v) + (_ - v), Vt[3] = j, N = 4) : (de[0] = 0, S = 1, Vt[0] = 0, N = 1), h !== 0) {
      const it = Y(S, de, h, rt);
      f = ct(f, ht(
        Y(I, Oe, h, K),
        K,
        Y(it, rt, 2 * G, et),
        et,
        at
      ), at);
      const ot = Y(N, Vt, h, z);
      f = ct(f, Mt(
        Y(ot, z, 2 * G, K),
        K,
        Y(ot, z, h, nt),
        nt,
        Y(it, rt, h, et),
        et,
        Rt,
        bt
      ), bt), x !== 0 && (f = ct(f, Y(Y(4, It, h, z), z, x, K), K)), w !== 0 && (f = ct(f, Y(Y(4, At, -h, z), z, w, K), K));
    }
    if (p !== 0) {
      const it = Y(S, de, p, rt);
      f = ct(f, ht(
        Y(M, Ne, p, K),
        K,
        Y(it, rt, 2 * Q, et),
        et,
        at
      ), at);
      const ot = Y(N, Vt, p, z);
      f = ct(f, Mt(
        Y(ot, z, 2 * Q, K),
        K,
        Y(ot, z, p, nt),
        nt,
        Y(it, rt, p, et),
        et,
        Rt,
        bt
      ), bt);
    }
  }
  if (c !== 0 || x !== 0) {
    if (u !== 0 || w !== 0 || h !== 0 || p !== 0 ? (D = u * Q, O = q * u, A = O - (O - u), T = u - A, O = q * Q, X = O - (O - Q), $ = Q - X, L = T * $ - (D - A * X - T * X - A * $), V = H * p, O = q * H, A = O - (O - H), T = H - A, O = q * p, X = O - (O - p), $ = p - X, U = T * $ - (V - A * X - T * X - A * $), _ = L + U, v = _ - L, gt[0] = L - (_ - v) + (U - v), B = D + _, v = B - D, F = D - (B - v) + (_ - v), _ = F + V, v = _ - F, gt[1] = F - (_ - v) + (V - v), j = B + _, v = j - B, gt[2] = B - (j - v) + (_ - v), gt[3] = j, C = -W, R = -w, D = h * C, O = q * h, A = O - (O - h), T = h - A, O = q * C, X = O - (O - C), $ = C - X, L = T * $ - (D - A * X - T * X - A * $), V = G * R, O = q * G, A = O - (O - G), T = G - A, O = q * R, X = O - (O - R), $ = R - X, U = T * $ - (V - A * X - T * X - A * $), _ = L + U, v = _ - L, wt[0] = L - (_ - v) + (U - v), B = D + _, v = B - D, F = D - (B - v) + (_ - v), _ = F + V, v = _ - F, wt[1] = F - (_ - v) + (V - v), j = B + _, v = j - B, wt[2] = B - (j - v) + (_ - v), wt[3] = j, E = ht(4, gt, 4, wt, pe), D = u * p, O = q * u, A = O - (O - u), T = u - A, O = q * p, X = O - (O - p), $ = p - X, L = T * $ - (D - A * X - T * X - A * $), V = h * w, O = q * h, A = O - (O - h), T = h - A, O = q * w, X = O - (O - w), $ = w - X, U = T * $ - (V - A * X - T * X - A * $), _ = L - U, v = L - _, jt[0] = L - (_ + v) + (v - U), B = D + _, v = B - D, F = D - (B - v) + (_ - v), _ = F - V, v = F - _, jt[1] = F - (_ + v) + (v - V), j = B + _, v = j - B, jt[2] = B - (j - v) + (_ - v), jt[3] = j, P = 4) : (pe[0] = 0, E = 1, jt[0] = 0, P = 1), c !== 0) {
      const it = Y(E, pe, c, rt);
      f = ct(f, ht(
        Y(g, Pe, c, K),
        K,
        Y(it, rt, 2 * J, et),
        et,
        at
      ), at);
      const ot = Y(P, jt, c, z);
      f = ct(f, Mt(
        Y(ot, z, 2 * J, K),
        K,
        Y(ot, z, c, nt),
        nt,
        Y(it, rt, c, et),
        et,
        Rt,
        bt
      ), bt), w !== 0 && (f = ct(f, Y(Y(4, kt, c, z), z, w, K), K)), p !== 0 && (f = ct(f, Y(Y(4, It, -c, z), z, p, K), K));
    }
    if (x !== 0) {
      const it = Y(E, pe, x, rt);
      f = ct(f, ht(
        Y(b, Te, x, K),
        K,
        Y(it, rt, 2 * Z, et),
        et,
        at
      ), at);
      const ot = Y(P, jt, x, z);
      f = ct(f, Mt(
        Y(ot, z, 2 * Z, K),
        K,
        Y(ot, z, x, nt),
        nt,
        Y(it, rt, x, et),
        et,
        Rt,
        bt
      ), bt);
    }
  }
  if (u !== 0 || w !== 0) {
    if (h !== 0 || p !== 0 || c !== 0 || x !== 0 ? (D = h * Z, O = q * h, A = O - (O - h), T = h - A, O = q * Z, X = O - (O - Z), $ = Z - X, L = T * $ - (D - A * X - T * X - A * $), V = G * x, O = q * G, A = O - (O - G), T = G - A, O = q * x, X = O - (O - x), $ = x - X, U = T * $ - (V - A * X - T * X - A * $), _ = L + U, v = _ - L, gt[0] = L - (_ - v) + (U - v), B = D + _, v = B - D, F = D - (B - v) + (_ - v), _ = F + V, v = _ - F, gt[1] = F - (_ - v) + (V - v), j = B + _, v = j - B, gt[2] = B - (j - v) + (_ - v), gt[3] = j, C = -Q, R = -p, D = c * C, O = q * c, A = O - (O - c), T = c - A, O = q * C, X = O - (O - C), $ = C - X, L = T * $ - (D - A * X - T * X - A * $), V = J * R, O = q * J, A = O - (O - J), T = J - A, O = q * R, X = O - (O - R), $ = R - X, U = T * $ - (V - A * X - T * X - A * $), _ = L + U, v = _ - L, wt[0] = L - (_ - v) + (U - v), B = D + _, v = B - D, F = D - (B - v) + (_ - v), _ = F + V, v = _ - F, wt[1] = F - (_ - v) + (V - v), j = B + _, v = j - B, wt[2] = B - (j - v) + (_ - v), wt[3] = j, m = ht(4, gt, 4, wt, ue), D = h * x, O = q * h, A = O - (O - h), T = h - A, O = q * x, X = O - (O - x), $ = x - X, L = T * $ - (D - A * X - T * X - A * $), V = c * p, O = q * c, A = O - (O - c), T = c - A, O = q * p, X = O - (O - p), $ = p - X, U = T * $ - (V - A * X - T * X - A * $), _ = L - U, v = L - _, Lt[0] = L - (_ + v) + (v - U), B = D + _, v = B - D, F = D - (B - v) + (_ - v), _ = F - V, v = F - _, Lt[1] = F - (_ + v) + (v - V), j = B + _, v = j - B, Lt[2] = B - (j - v) + (_ - v), Lt[3] = j, k = 4) : (ue[0] = 0, m = 1, Lt[0] = 0, k = 1), u !== 0) {
      const it = Y(m, ue, u, rt);
      f = ct(f, ht(
        Y(d, Be, u, K),
        K,
        Y(it, rt, 2 * H, et),
        et,
        at
      ), at);
      const ot = Y(k, Lt, u, z);
      f = ct(f, Mt(
        Y(ot, z, 2 * H, K),
        K,
        Y(ot, z, u, nt),
        nt,
        Y(it, rt, u, et),
        et,
        Rt,
        bt
      ), bt), p !== 0 && (f = ct(f, Y(Y(4, At, u, z), z, p, K), K)), x !== 0 && (f = ct(f, Y(Y(4, kt, -u, z), z, x, K), K));
    }
    if (w !== 0) {
      const it = Y(m, ue, w, rt);
      f = ct(f, ht(
        Y(y, Ce, w, K),
        K,
        Y(it, rt, 2 * W, et),
        et,
        at
      ), at);
      const ot = Y(k, Lt, w, z);
      f = ct(f, Mt(
        Y(ot, z, 2 * W, K),
        K,
        Y(ot, z, w, nt),
        nt,
        Y(it, rt, w, et),
        et,
        Rt,
        bt
      ), bt);
    }
  }
  return Ht[f - 1];
}
function gr(e, t, n, r, o, i, s, a) {
  const l = e - s, f = n - s, h = o - s, c = t - a, u = r - a, p = i - a, x = f * p, w = h * u, I = l * l + c * c, M = h * c, g = l * p, b = f * f + u * u, d = l * u, y = f * c, m = h * h + p * p, S = I * (x - w) + b * (M - g) + m * (d - y), E = (Math.abs(x) + Math.abs(w)) * I + (Math.abs(M) + Math.abs(g)) * b + (Math.abs(d) + Math.abs(y)) * m, k = ur * E;
  return S > k || -S > k ? S : mr(e, t, n, r, o, i, s, a, E);
}
function wr(e, t) {
  var n, r, o = 0, i, s, a, l, f, h, c, u = e[0], p = e[1], x = t.length;
  for (n = 0; n < x; n++) {
    r = 0;
    var w = t[n], I = w.length - 1;
    if (h = w[0], h[0] !== w[I][0] && h[1] !== w[I][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (s = h[0] - u, a = h[1] - p, r; r < I; r++) {
      if (c = w[r + 1], l = c[0] - u, f = c[1] - p, a === 0 && f === 0) {
        if (l <= 0 && s >= 0 || s <= 0 && l >= 0)
          return 0;
      } else if (f >= 0 && a <= 0 || f <= 0 && a >= 0) {
        if (i = Ot(s, l, a, f, 0, 0), i === 0)
          return 0;
        (i > 0 && f > 0 && a <= 0 || i < 0 && f <= 0 && a > 0) && o++;
      }
      h = c, a = f, s = l;
    }
  }
  return o % 2 !== 0;
}
function Fe(e, t, n = {}) {
  if (!e)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const r = sr(e), o = ar(t), i = o.type, s = t.bbox;
  let a = o.coordinates;
  if (s && yr(r, s) === !1)
    return !1;
  i === "Polygon" && (a = [a]);
  for (var l = 0; l < a.length; ++l) {
    const f = wr(r, a[l]);
    if (f === 0 && !n.ignoreBoundary) return !0;
    if (f) return !0;
  }
  return !1;
}
function yr(e, t) {
  return t[0] <= e[0] && t[1] <= e[1] && t[2] >= e[0] && t[3] >= e[1];
}
class Je {
  constructor(t = [], n = vr) {
    if (this.data = t, this.length = this.data.length, this.compare = n, this.length > 0)
      for (let r = (this.length >> 1) - 1; r >= 0; r--) this._down(r);
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
    const { data: n, compare: r } = this, o = n[t];
    for (; t > 0; ) {
      const i = t - 1 >> 1, s = n[i];
      if (r(o, s) >= 0) break;
      n[t] = s, t = i;
    }
    n[t] = o;
  }
  _down(t) {
    const { data: n, compare: r } = this, o = this.length >> 1, i = n[t];
    for (; t < o; ) {
      let s = (t << 1) + 1, a = n[s];
      const l = s + 1;
      if (l < this.length && r(n[l], a) < 0 && (s = l, a = n[l]), r(a, i) >= 0) break;
      n[t] = a, t = s;
    }
    n[t] = i;
  }
}
function vr(e, t) {
  return e < t ? -1 : e > t ? 1 : 0;
}
const br = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Je
}, Symbol.toStringTag, { value: "Module" })), Tt = 11102230246251565e-32, ut = 134217729, xr = (3 + 8 * Tt) * Tt;
function $e(e, t, n, r, o) {
  let i, s, a, l, f = t[0], h = r[0], c = 0, u = 0;
  h > f == h > -f ? (i = f, f = t[++c]) : (i = h, h = r[++u]);
  let p = 0;
  if (c < e && u < n)
    for (h > f == h > -f ? (s = f + i, a = i - (s - f), f = t[++c]) : (s = h + i, a = i - (s - h), h = r[++u]), i = s, a !== 0 && (o[p++] = a); c < e && u < n; )
      h > f == h > -f ? (s = i + f, l = s - i, a = i - (s - l) + (f - l), f = t[++c]) : (s = i + h, l = s - i, a = i - (s - l) + (h - l), h = r[++u]), i = s, a !== 0 && (o[p++] = a);
  for (; c < e; )
    s = i + f, l = s - i, a = i - (s - l) + (f - l), f = t[++c], i = s, a !== 0 && (o[p++] = a);
  for (; u < n; )
    s = i + h, l = s - i, a = i - (s - l) + (h - l), h = r[++u], i = s, a !== 0 && (o[p++] = a);
  return (i !== 0 || p === 0) && (o[p++] = i), p;
}
function _r(e, t) {
  let n = t[0];
  for (let r = 1; r < e; r++) n += t[r];
  return n;
}
function fe(e) {
  return new Float64Array(e);
}
const Mr = (3 + 16 * Tt) * Tt, Sr = (2 + 12 * Tt) * Tt, Er = (9 + 64 * Tt) * Tt * Tt, Jt = fe(4), nn = fe(8), rn = fe(12), on = fe(16), yt = fe(4);
function kr(e, t, n, r, o, i, s) {
  let a, l, f, h, c, u, p, x, w, I, M, g, b, d, y, m, S, E;
  const k = e - o, N = n - o, P = t - i, C = r - i;
  d = k * C, u = ut * k, p = u - (u - k), x = k - p, u = ut * C, w = u - (u - C), I = C - w, y = x * I - (d - p * w - x * w - p * I), m = P * N, u = ut * P, p = u - (u - P), x = P - p, u = ut * N, w = u - (u - N), I = N - w, S = x * I - (m - p * w - x * w - p * I), M = y - S, c = y - M, Jt[0] = y - (M + c) + (c - S), g = d + M, c = g - d, b = d - (g - c) + (M - c), M = b - m, c = b - M, Jt[1] = b - (M + c) + (c - m), E = g + M, c = E - g, Jt[2] = g - (E - c) + (M - c), Jt[3] = E;
  let R = _r(4, Jt), v = Sr * s;
  if (R >= v || -R >= v || (c = e - k, a = e - (k + c) + (c - o), c = n - N, f = n - (N + c) + (c - o), c = t - P, l = t - (P + c) + (c - i), c = r - C, h = r - (C + c) + (c - i), a === 0 && l === 0 && f === 0 && h === 0) || (v = Er * s + xr * Math.abs(R), R += k * h + C * a - (P * f + N * l), R >= v || -R >= v)) return R;
  d = a * C, u = ut * a, p = u - (u - a), x = a - p, u = ut * C, w = u - (u - C), I = C - w, y = x * I - (d - p * w - x * w - p * I), m = l * N, u = ut * l, p = u - (u - l), x = l - p, u = ut * N, w = u - (u - N), I = N - w, S = x * I - (m - p * w - x * w - p * I), M = y - S, c = y - M, yt[0] = y - (M + c) + (c - S), g = d + M, c = g - d, b = d - (g - c) + (M - c), M = b - m, c = b - M, yt[1] = b - (M + c) + (c - m), E = g + M, c = E - g, yt[2] = g - (E - c) + (M - c), yt[3] = E;
  const O = $e(4, Jt, 4, yt, nn);
  d = k * h, u = ut * k, p = u - (u - k), x = k - p, u = ut * h, w = u - (u - h), I = h - w, y = x * I - (d - p * w - x * w - p * I), m = P * f, u = ut * P, p = u - (u - P), x = P - p, u = ut * f, w = u - (u - f), I = f - w, S = x * I - (m - p * w - x * w - p * I), M = y - S, c = y - M, yt[0] = y - (M + c) + (c - S), g = d + M, c = g - d, b = d - (g - c) + (M - c), M = b - m, c = b - M, yt[1] = b - (M + c) + (c - m), E = g + M, c = E - g, yt[2] = g - (E - c) + (M - c), yt[3] = E;
  const A = $e(O, nn, 4, yt, rn);
  d = a * h, u = ut * a, p = u - (u - a), x = a - p, u = ut * h, w = u - (u - h), I = h - w, y = x * I - (d - p * w - x * w - p * I), m = l * f, u = ut * l, p = u - (u - l), x = l - p, u = ut * f, w = u - (u - f), I = f - w, S = x * I - (m - p * w - x * w - p * I), M = y - S, c = y - M, yt[0] = y - (M + c) + (c - S), g = d + M, c = g - d, b = d - (g - c) + (M - c), M = b - m, c = b - M, yt[1] = b - (M + c) + (c - m), E = g + M, c = E - g, yt[2] = g - (E - c) + (M - c), yt[3] = E;
  const T = $e(A, rn, 4, yt, on);
  return on[T - 1];
}
function sn(e, t, n, r, o, i) {
  const s = (t - i) * (n - o), a = (e - o) * (r - i), l = s - a;
  if (s === 0 || a === 0 || s > 0 != a > 0) return l;
  const f = Math.abs(s + a);
  return Math.abs(l) >= Mr * f ? l : -kr(e, t, n, r, o, i, f);
}
function Ar(e, t) {
  const n = new Je([], jn);
  return Or(e, n), Nr(n, t);
}
function jn(e, t) {
  return e.p.x > t.p.x ? 1 : e.p.x < t.p.x || e.p.x === t.p.x && (e.featureId !== t.featureId || e.ringId !== t.ringId) && e.isLeftEndpoint && !t.isLeftEndpoint ? -1 : e.p.y !== t.p.y ? e.p.y > t.p.y ? 1 : -1 : 1;
}
function Ir(e, t) {
  return e.rightSweepEvent.p.x > t.rightSweepEvent.p.x ? 1 : e.rightSweepEvent.p.x < t.rightSweepEvent.p.x ? -1 : e.rightSweepEvent.p.y !== t.rightSweepEvent.p.y ? e.rightSweepEvent.p.y < t.rightSweepEvent.p.y ? 1 : -1 : 1;
}
function Or(e, t) {
  if (e.type === "FeatureCollection") {
    const n = e.features;
    for (let r = 0; r < n.length; r++)
      an(n[r], t);
  } else
    an(e, t);
}
var me = 0, ge = 0, we = 0;
function an(e, t) {
  const n = e.type === "Feature" ? e.geometry : e;
  let r = n.coordinates;
  (n.type === "Polygon" || n.type === "MultiLineString") && (r = [r]), n.type === "LineString" && (r = [[r]]);
  for (let o = 0; o < r.length; o++)
    for (let i = 0; i < r[o].length; i++) {
      let s = r[o][i][0], a = null;
      ge = ge + 1;
      for (let l = 0; l < r[o][i].length - 1; l++) {
        a = r[o][i][l + 1];
        const f = new cn(s, me, ge, we), h = new cn(a, me, ge, we + 1);
        f.otherEvent = h, h.otherEvent = f, jn(f, h) > 0 ? (h.isLeftEndpoint = !0, f.isLeftEndpoint = !1) : (f.isLeftEndpoint = !0, h.isLeftEndpoint = !1), t.push(f), t.push(h), s = a, we = we + 1;
      }
    }
  me = me + 1;
}
var cn = class {
  constructor(e, t, n, r) {
    this.p = {
      x: e[0],
      y: e[1]
    }, this.featureId = t, this.ringId = n, this.eventId = r, this.otherEvent = null, this.isLeftEndpoint = null;
  }
  isSamePoint(e) {
    return this.p.x === e.p.x && this.p.y === e.p.y;
  }
  asNewXY() {
    return [this.p.x, this.p.y];
  }
};
function Nr(e, t = !1) {
  const n = [], r = new Je([], Ir);
  for (; e.length; ) {
    const o = e.pop();
    if (o.isLeftEndpoint) {
      const i = new Pr(o);
      for (let s = 0; s < r.data.length; s++) {
        const a = r.data[s];
        if (t && a.leftSweepEvent.featureId === o.featureId)
          continue;
        const l = Tr(i, a);
        l !== !1 && n.push(l);
      }
      r.push(i);
    } else o.isLeftEndpoint === !1 && r.pop();
  }
  return n;
}
var Pr = class {
  /** @param event must have otherEvent non-null */
  constructor(e) {
    this.leftSweepEvent = e, this.rightSweepEvent = e.otherEvent;
  }
};
function Tr(e, t) {
  if (e === null || t === null) return !1;
  const n = e.leftSweepEvent.p.x, r = e.leftSweepEvent.p.y, o = e.rightSweepEvent.p.x, i = e.rightSweepEvent.p.y, s = t.leftSweepEvent.p.x, a = t.leftSweepEvent.p.y, l = t.rightSweepEvent.p.x, f = t.rightSweepEvent.p.y, h = sn(n, r, o, i, s, a), c = sn(n, r, o, i, l, f);
  if (h > 0 && c > 0) return !1;
  if (h < 0 && c < 0) return !1;
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
  const u = (f - a) * (o - n) - (l - s) * (i - r), p = (l - s) * (r - a) - (f - a) * (n - s), x = (o - n) * (r - a) - (i - r) * (n - s);
  if (u === 0)
    return !1;
  const w = p / u, I = x / u;
  if (w >= 0 && w <= 1 && I >= 0 && I <= 1) {
    const M = n + w * (o - n), g = r + w * (i - r);
    return [M, g];
  }
  return !1;
}
function Br(e, t, n = {}) {
  const { removeDuplicates: r = !0, ignoreSelfIntersections: o = !0 } = n;
  let i = [];
  e.type === "FeatureCollection" ? i = i.concat(e.features) : e.type === "Feature" ? i.push(e) : (e.type === "LineString" || e.type === "Polygon" || e.type === "MultiLineString" || e.type === "MultiPolygon") && i.push(oe(e)), t.type === "FeatureCollection" ? i = i.concat(t.features) : t.type === "Feature" ? i.push(t) : (t.type === "LineString" || t.type === "Polygon" || t.type === "MultiLineString" || t.type === "MultiPolygon") && i.push(oe(t));
  const s = Ar(
    Et(i),
    o
  );
  let a = [];
  if (r) {
    const l = {};
    s.forEach((f) => {
      const h = f.join(",");
      l[h] || (l[h] = !0, a.push(f));
    });
  } else
    a = s;
  return Et(a.map((l) => Yt(l)));
}
function Cr(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function Xr(e) {
  if (Object.prototype.hasOwnProperty.call(e, "__esModule")) return e;
  var t = e.default;
  if (typeof t == "function") {
    var n = function r() {
      var o = !1;
      try {
        o = this instanceof r;
      } catch {
      }
      return o ? Reflect.construct(t, arguments, this.constructor) : t.apply(this, arguments);
    };
    n.prototype = t.prototype;
  } else n = {};
  return Object.defineProperty(n, "__esModule", { value: !0 }), Object.keys(e).forEach(function(r) {
    var o = Object.getOwnPropertyDescriptor(e, r);
    Object.defineProperty(n, r, o.get ? o : {
      enumerable: !0,
      get: function() {
        return e[r];
      }
    });
  }), n;
}
function Fr(e, t = {}) {
  let n = 0, r = 0, o = 0;
  return ze(
    e,
    function(i) {
      n += i[0], r += i[1], o++;
    },
    !0
  ), Yt([n / o, r / o], t.properties);
}
var ye = { exports: {} }, ke = { exports: {} }, $r = ke.exports, ln;
function Rr() {
  return ln || (ln = 1, (function(e, t) {
    (function(n, r) {
      e.exports = r();
    })($r, function() {
      function n(g, b, d, y, m) {
        (function S(E, k, N, P, C) {
          for (; P > N; ) {
            if (P - N > 600) {
              var R = P - N + 1, v = k - N + 1, O = Math.log(R), A = 0.5 * Math.exp(2 * O / 3), T = 0.5 * Math.sqrt(O * A * (R - A) / R) * (v - R / 2 < 0 ? -1 : 1), X = Math.max(N, Math.floor(k - v * A / R + T)), $ = Math.min(P, Math.floor(k + (R - v) * A / R + T));
              S(E, k, X, $, C);
            }
            var _ = E[k], B = N, F = P;
            for (r(E, N, k), C(E[P], _) > 0 && r(E, N, P); B < F; ) {
              for (r(E, B, F), B++, F--; C(E[B], _) < 0; ) B++;
              for (; C(E[F], _) > 0; ) F--;
            }
            C(E[N], _) === 0 ? r(E, N, F) : r(E, ++F, P), F <= k && (N = F + 1), k <= F && (P = F - 1);
          }
        })(g, b, d || 0, y || g.length - 1, m || o);
      }
      function r(g, b, d) {
        var y = g[b];
        g[b] = g[d], g[d] = y;
      }
      function o(g, b) {
        return g < b ? -1 : g > b ? 1 : 0;
      }
      var i = function(g) {
        g === void 0 && (g = 9), this._maxEntries = Math.max(4, g), this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries)), this.clear();
      };
      function s(g, b, d) {
        if (!d) return b.indexOf(g);
        for (var y = 0; y < b.length; y++) if (d(g, b[y])) return y;
        return -1;
      }
      function a(g, b) {
        l(g, 0, g.children.length, b, g);
      }
      function l(g, b, d, y, m) {
        m || (m = I(null)), m.minX = 1 / 0, m.minY = 1 / 0, m.maxX = -1 / 0, m.maxY = -1 / 0;
        for (var S = b; S < d; S++) {
          var E = g.children[S];
          f(m, g.leaf ? y(E) : E);
        }
        return m;
      }
      function f(g, b) {
        return g.minX = Math.min(g.minX, b.minX), g.minY = Math.min(g.minY, b.minY), g.maxX = Math.max(g.maxX, b.maxX), g.maxY = Math.max(g.maxY, b.maxY), g;
      }
      function h(g, b) {
        return g.minX - b.minX;
      }
      function c(g, b) {
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
      return i.prototype.all = function() {
        return this._all(this.data, []);
      }, i.prototype.search = function(g) {
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
      }, i.prototype.collides = function(g) {
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
      }, i.prototype.load = function(g) {
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
      }, i.prototype.insert = function(g) {
        return g && this._insert(g, this.data.height - 1), this;
      }, i.prototype.clear = function() {
        return this.data = I([]), this;
      }, i.prototype.remove = function(g, b) {
        if (!g) return this;
        for (var d, y, m, S = this.data, E = this.toBBox(g), k = [], N = []; S || k.length; ) {
          if (S || (S = k.pop(), y = k[k.length - 1], d = N.pop(), m = !0), S.leaf) {
            var P = s(g, S.children, b);
            if (P !== -1) return S.children.splice(P, 1), k.push(S), this._condense(k), this;
          }
          m || S.leaf || !x(S, E) ? y ? (d++, S = y.children[d], m = !1) : S = null : (k.push(S), N.push(d), d = 0, y = S, S = S.children[0]);
        }
        return this;
      }, i.prototype.toBBox = function(g) {
        return g;
      }, i.prototype.compareMinX = function(g, b) {
        return g.minX - b.minX;
      }, i.prototype.compareMinY = function(g, b) {
        return g.minY - b.minY;
      }, i.prototype.toJSON = function() {
        return this.data;
      }, i.prototype.fromJSON = function(g) {
        return this.data = g, this;
      }, i.prototype._all = function(g, b) {
        for (var d = []; g; ) g.leaf ? b.push.apply(b, g.children) : d.push.apply(d, g.children), g = d.pop();
        return b;
      }, i.prototype._build = function(g, b, d, y) {
        var m, S = d - b + 1, E = this._maxEntries;
        if (S <= E) return a(m = I(g.slice(b, d + 1)), this.toBBox), m;
        y || (y = Math.ceil(Math.log(S) / Math.log(E)), E = Math.ceil(S / Math.pow(E, y - 1))), (m = I([])).leaf = !1, m.height = y;
        var k = Math.ceil(S / E), N = k * Math.ceil(Math.sqrt(E));
        M(g, b, d, N, this.compareMinX);
        for (var P = b; P <= d; P += N) {
          var C = Math.min(P + N - 1, d);
          M(g, P, C, k, this.compareMinY);
          for (var R = P; R <= C; R += k) {
            var v = Math.min(R + k - 1, C);
            m.children.push(this._build(g, R, v, y - 1));
          }
        }
        return a(m, this.toBBox), m;
      }, i.prototype._chooseSubtree = function(g, b, d, y) {
        for (; y.push(b), !b.leaf && y.length - 1 !== d; ) {
          for (var m = 1 / 0, S = 1 / 0, E = void 0, k = 0; k < b.children.length; k++) {
            var N = b.children[k], P = u(N), C = (R = g, v = N, (Math.max(v.maxX, R.maxX) - Math.min(v.minX, R.minX)) * (Math.max(v.maxY, R.maxY) - Math.min(v.minY, R.minY)) - P);
            C < S ? (S = C, m = P < m ? P : m, E = N) : C === S && P < m && (m = P, E = N);
          }
          b = E || b.children[0];
        }
        var R, v;
        return b;
      }, i.prototype._insert = function(g, b, d) {
        var y = d ? g : this.toBBox(g), m = [], S = this._chooseSubtree(y, this.data, b, m);
        for (S.children.push(g), f(S, y); b >= 0 && m[b].children.length > this._maxEntries; ) this._split(m, b), b--;
        this._adjustParentBBoxes(y, m, b);
      }, i.prototype._split = function(g, b) {
        var d = g[b], y = d.children.length, m = this._minEntries;
        this._chooseSplitAxis(d, m, y);
        var S = this._chooseSplitIndex(d, m, y), E = I(d.children.splice(S, d.children.length - S));
        E.height = d.height, E.leaf = d.leaf, a(d, this.toBBox), a(E, this.toBBox), b ? g[b - 1].children.push(E) : this._splitRoot(d, E);
      }, i.prototype._splitRoot = function(g, b) {
        this.data = I([g, b]), this.data.height = g.height + 1, this.data.leaf = !1, a(this.data, this.toBBox);
      }, i.prototype._chooseSplitIndex = function(g, b, d) {
        for (var y, m, S, E, k, N, P, C = 1 / 0, R = 1 / 0, v = b; v <= d - b; v++) {
          var O = l(g, 0, v, this.toBBox), A = l(g, v, d, this.toBBox), T = (m = O, S = A, E = void 0, k = void 0, N = void 0, P = void 0, E = Math.max(m.minX, S.minX), k = Math.max(m.minY, S.minY), N = Math.min(m.maxX, S.maxX), P = Math.min(m.maxY, S.maxY), Math.max(0, N - E) * Math.max(0, P - k)), X = u(O) + u(A);
          T < C ? (C = T, y = v, R = X < R ? X : R) : T === C && X < R && (R = X, y = v);
        }
        return y || d - b;
      }, i.prototype._chooseSplitAxis = function(g, b, d) {
        var y = g.leaf ? this.compareMinX : h, m = g.leaf ? this.compareMinY : c;
        this._allDistMargin(g, b, d, y) < this._allDistMargin(g, b, d, m) && g.children.sort(y);
      }, i.prototype._allDistMargin = function(g, b, d, y) {
        g.children.sort(y);
        for (var m = this.toBBox, S = l(g, 0, b, m), E = l(g, d - b, d, m), k = p(S) + p(E), N = b; N < d - b; N++) {
          var P = g.children[N];
          f(S, g.leaf ? m(P) : P), k += p(S);
        }
        for (var C = d - b - 1; C >= b; C--) {
          var R = g.children[C];
          f(E, g.leaf ? m(R) : R), k += p(E);
        }
        return k;
      }, i.prototype._adjustParentBBoxes = function(g, b, d) {
        for (var y = d; y >= 0; y--) f(b[y], g);
      }, i.prototype._condense = function(g) {
        for (var b = g.length - 1, d = void 0; b >= 0; b--) g[b].children.length === 0 ? b > 0 ? (d = g[b - 1].children).splice(d.indexOf(g[b]), 1) : this.clear() : a(g[b], this.toBBox);
      }, i;
    });
  })(ke)), ke.exports;
}
const Dr = /* @__PURE__ */ Xr(br);
var Zt = { exports: {} }, Re, fn;
function Yr() {
  return fn || (fn = 1, Re = function(t, n, r, o) {
    var i = t[0], s = t[1], a = !1;
    r === void 0 && (r = 0), o === void 0 && (o = n.length);
    for (var l = (o - r) / 2, f = 0, h = l - 1; f < l; h = f++) {
      var c = n[r + f * 2 + 0], u = n[r + f * 2 + 1], p = n[r + h * 2 + 0], x = n[r + h * 2 + 1], w = u > s != x > s && i < (p - c) * (s - u) / (x - u) + c;
      w && (a = !a);
    }
    return a;
  }), Re;
}
var De, hn;
function Lr() {
  return hn || (hn = 1, De = function(t, n, r, o) {
    var i = t[0], s = t[1], a = !1;
    r === void 0 && (r = 0), o === void 0 && (o = n.length);
    for (var l = o - r, f = 0, h = l - 1; f < l; h = f++) {
      var c = n[f + r][0], u = n[f + r][1], p = n[h + r][0], x = n[h + r][1], w = u > s != x > s && i < (p - c) * (s - u) / (x - u) + c;
      w && (a = !a);
    }
    return a;
  }), De;
}
var un;
function Vr() {
  if (un) return Zt.exports;
  un = 1;
  var e = Yr(), t = Lr();
  return Zt.exports = function(r, o, i, s) {
    return o.length > 0 && Array.isArray(o[0]) ? t(r, o, i, s) : e(r, o, i, s);
  }, Zt.exports.nested = t, Zt.exports.flat = e, Zt.exports;
}
var ee = { exports: {} }, jr = ee.exports, dn;
function Ur() {
  return dn || (dn = 1, (function(e, t) {
    (function(n, r) {
      r(t);
    })(jr, function(n) {
      const o = 33306690738754706e-32;
      function i(w, I, M, g, b) {
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
      const a = 33306690738754716e-32, l = 22204460492503146e-32, f = 11093356479670487e-47, h = s(4), c = s(8), u = s(12), p = s(16), x = s(4);
      n.orient2d = function(w, I, M, g, b, d) {
        const y = (I - d) * (M - b), m = (w - b) * (g - d), S = y - m;
        if (y === 0 || m === 0 || y > 0 != m > 0) return S;
        const E = Math.abs(y + m);
        return Math.abs(S) >= a * E ? S : -(function(k, N, P, C, R, v, O) {
          let A, T, X, $, _, B, F, D, L, V, U, j, G, J, H, Q, Z, W;
          const st = k - R, ft = P - R, it = N - v, ot = C - v;
          _ = (H = (D = st - (F = (B = 134217729 * st) - (B - st))) * (V = ot - (L = (B = 134217729 * ot) - (B - ot))) - ((J = st * ot) - F * L - D * L - F * V)) - (U = H - (Z = (D = it - (F = (B = 134217729 * it) - (B - it))) * (V = ft - (L = (B = 134217729 * ft) - (B - ft))) - ((Q = it * ft) - F * L - D * L - F * V))), h[0] = H - (U + _) + (_ - Z), _ = (G = J - ((j = J + U) - (_ = j - J)) + (U - _)) - (U = G - Q), h[1] = G - (U + _) + (_ - Q), _ = (W = j + U) - j, h[2] = j - (W - _) + (U - _), h[3] = W;
          let Ct = (function(or, Ke) {
            let He = Ke[0];
            for (let Ie = 1; Ie < or; Ie++) He += Ke[Ie];
            return He;
          })(4, h), Wt = l * O;
          if (Ct >= Wt || -Ct >= Wt || (A = k - (st + (_ = k - st)) + (_ - R), X = P - (ft + (_ = P - ft)) + (_ - R), T = N - (it + (_ = N - it)) + (_ - v), $ = C - (ot + (_ = C - ot)) + (_ - v), A === 0 && T === 0 && X === 0 && $ === 0) || (Wt = f * O + o * Math.abs(Ct), (Ct += st * $ + ot * A - (it * X + ft * T)) >= Wt || -Ct >= Wt)) return Ct;
          _ = (H = (D = A - (F = (B = 134217729 * A) - (B - A))) * (V = ot - (L = (B = 134217729 * ot) - (B - ot))) - ((J = A * ot) - F * L - D * L - F * V)) - (U = H - (Z = (D = T - (F = (B = 134217729 * T) - (B - T))) * (V = ft - (L = (B = 134217729 * ft) - (B - ft))) - ((Q = T * ft) - F * L - D * L - F * V))), x[0] = H - (U + _) + (_ - Z), _ = (G = J - ((j = J + U) - (_ = j - J)) + (U - _)) - (U = G - Q), x[1] = G - (U + _) + (_ - Q), _ = (W = j + U) - j, x[2] = j - (W - _) + (U - _), x[3] = W;
          const nr = i(4, h, 4, x, c);
          _ = (H = (D = st - (F = (B = 134217729 * st) - (B - st))) * (V = $ - (L = (B = 134217729 * $) - (B - $))) - ((J = st * $) - F * L - D * L - F * V)) - (U = H - (Z = (D = it - (F = (B = 134217729 * it) - (B - it))) * (V = X - (L = (B = 134217729 * X) - (B - X))) - ((Q = it * X) - F * L - D * L - F * V))), x[0] = H - (U + _) + (_ - Z), _ = (G = J - ((j = J + U) - (_ = j - J)) + (U - _)) - (U = G - Q), x[1] = G - (U + _) + (_ - Q), _ = (W = j + U) - j, x[2] = j - (W - _) + (U - _), x[3] = W;
          const rr = i(nr, c, 4, x, u);
          _ = (H = (D = A - (F = (B = 134217729 * A) - (B - A))) * (V = $ - (L = (B = 134217729 * $) - (B - $))) - ((J = A * $) - F * L - D * L - F * V)) - (U = H - (Z = (D = T - (F = (B = 134217729 * T) - (B - T))) * (V = X - (L = (B = 134217729 * X) - (B - X))) - ((Q = T * X) - F * L - D * L - F * V))), x[0] = H - (U + _) + (_ - Z), _ = (G = J - ((j = J + U) - (_ = j - J)) + (U - _)) - (U = G - Q), x[1] = G - (U + _) + (_ - Q), _ = (W = j + U) - j, x[2] = j - (W - _) + (U - _), x[3] = W;
          const ir = i(rr, u, 4, x, p);
          return p[ir - 1];
        })(w, I, M, g, b, d, E);
      }, n.orient2dfast = function(w, I, M, g, b, d) {
        return (I - d) * (M - b) - (w - b) * (g - d);
      }, Object.defineProperty(n, "__esModule", { value: !0 });
    });
  })(ee, ee.exports)), ee.exports;
}
var pn;
function qr() {
  if (pn) return ye.exports;
  pn = 1;
  var e = Rr(), t = Dr, n = Vr(), r = Ur().orient2d;
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
    }, E.compareMinX = function(F, D) {
      return F[0] - D[0];
    }, E.compareMinY = function(F, D) {
      return F[1] - D[1];
    }, E.load(d);
    for (var k = [], N = 0, P; N < S.length; N++) {
      var C = S[N];
      E.remove(C), P = x(C, P), k.push(P);
    }
    var R = new e(16);
    for (N = 0; N < k.length; N++) R.insert(u(k[N]));
    for (var v = y * y, O = m * m; k.length; ) {
      var A = k.shift(), T = A.p, X = A.next.p, $ = w(T, X);
      if (!($ < O)) {
        var _ = $ / v;
        C = i(E, A.prev.p, T, X, A.next.next.p, _, R), C && Math.min(w(C, T), w(C, X)) <= _ && (k.push(A), k.push(x(C, A)), E.remove(C), R.remove(A), R.insert(u(A)), R.insert(u(A.next)));
      }
    }
    A = P;
    var B = [];
    do
      B.push(A.p), A = A.next;
    while (A !== P);
    return B.push(A.p), B;
  }
  function i(d, y, m, S, E, k, N) {
    for (var P = new t([], s), C = d.data; C; ) {
      for (var R = 0; R < C.children.length; R++) {
        var v = C.children[R], O = C.leaf ? I(v, m, S) : a(m, S, v);
        O > k || P.push({
          node: v,
          dist: O
        });
      }
      for (; P.length && !P.peek().node.children; ) {
        var A = P.pop(), T = A.node, X = I(T, y, m), $ = I(T, S, E);
        if (A.dist < X && A.dist < $ && f(m, T, N) && f(S, T, N)) return T;
      }
      C = P.pop(), C && (C = C.node);
    }
    return null;
  }
  function s(d, y) {
    return d.dist - y.dist;
  }
  function a(d, y, m) {
    if (l(d, m) || l(y, m)) return 0;
    var S = M(d[0], d[1], y[0], y[1], m.minX, m.minY, m.maxX, m.minY);
    if (S === 0) return 0;
    var E = M(d[0], d[1], y[0], y[1], m.minX, m.minY, m.minX, m.maxY);
    if (E === 0) return 0;
    var k = M(d[0], d[1], y[0], y[1], m.maxX, m.minY, m.maxX, m.maxY);
    if (k === 0) return 0;
    var N = M(d[0], d[1], y[0], y[1], m.minX, m.maxY, m.maxX, m.maxY);
    return N === 0 ? 0 : Math.min(S, E, k, N);
  }
  function l(d, y) {
    return d[0] >= y.minX && d[0] <= y.maxX && d[1] >= y.minY && d[1] <= y.maxY;
  }
  function f(d, y, m) {
    for (var S = Math.min(d[0], y[0]), E = Math.min(d[1], y[1]), k = Math.max(d[0], y[0]), N = Math.max(d[1], y[1]), P = m.search({ minX: S, minY: E, maxX: k, maxY: N }), C = 0; C < P.length; C++)
      if (c(P[C].p, P[C].next.p, d, y)) return !1;
    return !0;
  }
  function h(d, y, m) {
    return r(d[0], d[1], y[0], y[1], m[0], m[1]);
  }
  function c(d, y, m, S) {
    return d !== S && y !== m && h(d, y, m) > 0 != h(d, y, S) > 0 && h(m, S, d) > 0 != h(m, S, y) > 0;
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
    var C = m - d, R = S - y, v = N - E, O = P - k, A = d - E, T = y - k, X = C * C + R * R, $ = C * v + R * O, _ = v * v + O * O, B = C * A + R * T, F = v * A + O * T, D = X * _ - $ * $, L, V, U, j, G = D, J = D;
    D === 0 ? (V = 0, G = 1, j = F, J = _) : (V = $ * F - _ * B, j = X * F - $ * B, V < 0 ? (V = 0, j = F, J = _) : V > G && (V = G, j = F + $, J = _)), j < 0 ? (j = 0, -B < 0 ? V = 0 : -B > X ? V = G : (V = -B, G = X)) : j > J && (j = J, -B + $ < 0 ? V = 0 : -B + $ > X ? V = G : (V = -B + $, G = X)), L = V === 0 ? 0 : V / G, U = j === 0 ? 0 : j / J;
    var H = (1 - L) * d + L * m, Q = (1 - L) * y + L * S, Z = (1 - U) * E + U * N, W = (1 - U) * k + U * P, st = Z - H, ft = W - Q;
    return st * st + ft * ft;
  }
  function g(d, y) {
    return d[0] === y[0] ? d[1] - y[1] : d[0] - y[0];
  }
  function b(d) {
    d.sort(g);
    for (var y = [], m = 0; m < d.length; m++) {
      for (; y.length >= 2 && h(y[y.length - 2], y[y.length - 1], d[m]) <= 0; )
        y.pop();
      y.push(d[m]);
    }
    for (var S = [], E = d.length - 1; E >= 0; E--) {
      for (; S.length >= 2 && h(S[S.length - 2], S[S.length - 1], d[E]) <= 0; )
        S.pop();
      S.push(d[E]);
    }
    return S.pop(), y.pop(), y.concat(S);
  }
  return ye.exports;
}
var zr = qr();
const Jr = /* @__PURE__ */ Cr(zr);
function mn(e, t = {}) {
  t.concavity = t.concavity || 1 / 0;
  const n = [];
  if (ze(e, (o) => {
    n.push([o[0], o[1]]);
  }), !n.length)
    return null;
  const r = Jr(n, t.concavity);
  return r.length > 3 ? le([r], t.properties) : null;
}
function Un(e, t, n = {}) {
  const r = { type: "Feature" };
  return (n.id === 0 || n.id) && (r.id = n.id), n.bbox && (r.bbox = n.bbox), r.properties = t || {}, r.geometry = e, r;
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
  return Un({
    type: "Point",
    coordinates: e
  }, t, n);
}
function qn(e, t, n = {}) {
  for (const r of e) {
    if (r.length < 4)
      throw new Error(
        "Each LinearRing of a Polygon must have 4 or more Positions."
      );
    if (r[r.length - 1].length !== r[0].length)
      throw new Error("First and last Position are not equivalent.");
    for (let o = 0; o < r[r.length - 1].length; o++)
      if (r[r.length - 1][o] !== r[0][o])
        throw new Error("First and last Position are not equivalent.");
  }
  return Un({
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
function Gr(e) {
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
function Kr(e) {
  return e.type === "Feature" ? e.geometry : e;
}
const Bt = 11102230246251565e-32, dt = 134217729, Hr = (3 + 8 * Bt) * Bt;
function Ye(e, t, n, r, o) {
  let i, s, a, l, f = t[0], h = r[0], c = 0, u = 0;
  h > f == h > -f ? (i = f, f = t[++c]) : (i = h, h = r[++u]);
  let p = 0;
  if (c < e && u < n)
    for (h > f == h > -f ? (s = f + i, a = i - (s - f), f = t[++c]) : (s = h + i, a = i - (s - h), h = r[++u]), i = s, a !== 0 && (o[p++] = a); c < e && u < n; )
      h > f == h > -f ? (s = i + f, l = s - i, a = i - (s - l) + (f - l), f = t[++c]) : (s = i + h, l = s - i, a = i - (s - l) + (h - l), h = r[++u]), i = s, a !== 0 && (o[p++] = a);
  for (; c < e; )
    s = i + f, l = s - i, a = i - (s - l) + (f - l), f = t[++c], i = s, a !== 0 && (o[p++] = a);
  for (; u < n; )
    s = i + h, l = s - i, a = i - (s - l) + (h - l), h = r[++u], i = s, a !== 0 && (o[p++] = a);
  return (i !== 0 || p === 0) && (o[p++] = i), p;
}
function Qr(e, t) {
  let n = t[0];
  for (let r = 1; r < e; r++) n += t[r];
  return n;
}
function he(e) {
  return new Float64Array(e);
}
const Wr = (3 + 16 * Bt) * Bt, Zr = (2 + 12 * Bt) * Bt, ti = (9 + 64 * Bt) * Bt * Bt, Gt = he(4), yn = he(8), vn = he(12), bn = he(16), vt = he(4);
function ei(e, t, n, r, o, i, s) {
  let a, l, f, h, c, u, p, x, w, I, M, g, b, d, y, m, S, E;
  const k = e - o, N = n - o, P = t - i, C = r - i;
  d = k * C, u = dt * k, p = u - (u - k), x = k - p, u = dt * C, w = u - (u - C), I = C - w, y = x * I - (d - p * w - x * w - p * I), m = P * N, u = dt * P, p = u - (u - P), x = P - p, u = dt * N, w = u - (u - N), I = N - w, S = x * I - (m - p * w - x * w - p * I), M = y - S, c = y - M, Gt[0] = y - (M + c) + (c - S), g = d + M, c = g - d, b = d - (g - c) + (M - c), M = b - m, c = b - M, Gt[1] = b - (M + c) + (c - m), E = g + M, c = E - g, Gt[2] = g - (E - c) + (M - c), Gt[3] = E;
  let R = Qr(4, Gt), v = Zr * s;
  if (R >= v || -R >= v || (c = e - k, a = e - (k + c) + (c - o), c = n - N, f = n - (N + c) + (c - o), c = t - P, l = t - (P + c) + (c - i), c = r - C, h = r - (C + c) + (c - i), a === 0 && l === 0 && f === 0 && h === 0) || (v = ti * s + Hr * Math.abs(R), R += k * h + C * a - (P * f + N * l), R >= v || -R >= v)) return R;
  d = a * C, u = dt * a, p = u - (u - a), x = a - p, u = dt * C, w = u - (u - C), I = C - w, y = x * I - (d - p * w - x * w - p * I), m = l * N, u = dt * l, p = u - (u - l), x = l - p, u = dt * N, w = u - (u - N), I = N - w, S = x * I - (m - p * w - x * w - p * I), M = y - S, c = y - M, vt[0] = y - (M + c) + (c - S), g = d + M, c = g - d, b = d - (g - c) + (M - c), M = b - m, c = b - M, vt[1] = b - (M + c) + (c - m), E = g + M, c = E - g, vt[2] = g - (E - c) + (M - c), vt[3] = E;
  const O = Ye(4, Gt, 4, vt, yn);
  d = k * h, u = dt * k, p = u - (u - k), x = k - p, u = dt * h, w = u - (u - h), I = h - w, y = x * I - (d - p * w - x * w - p * I), m = P * f, u = dt * P, p = u - (u - P), x = P - p, u = dt * f, w = u - (u - f), I = f - w, S = x * I - (m - p * w - x * w - p * I), M = y - S, c = y - M, vt[0] = y - (M + c) + (c - S), g = d + M, c = g - d, b = d - (g - c) + (M - c), M = b - m, c = b - M, vt[1] = b - (M + c) + (c - m), E = g + M, c = E - g, vt[2] = g - (E - c) + (M - c), vt[3] = E;
  const A = Ye(O, yn, 4, vt, vn);
  d = a * h, u = dt * a, p = u - (u - a), x = a - p, u = dt * h, w = u - (u - h), I = h - w, y = x * I - (d - p * w - x * w - p * I), m = l * f, u = dt * l, p = u - (u - l), x = l - p, u = dt * f, w = u - (u - f), I = f - w, S = x * I - (m - p * w - x * w - p * I), M = y - S, c = y - M, vt[0] = y - (M + c) + (c - S), g = d + M, c = g - d, b = d - (g - c) + (M - c), M = b - m, c = b - M, vt[1] = b - (M + c) + (c - m), E = g + M, c = E - g, vt[2] = g - (E - c) + (M - c), vt[3] = E;
  const T = Ye(A, vn, 4, vt, bn);
  return bn[T - 1];
}
function ni(e, t, n, r, o, i) {
  const s = (t - i) * (n - o), a = (e - o) * (r - i), l = s - a, f = Math.abs(s + a);
  return Math.abs(l) >= Wr * f ? l : -ei(e, t, n, r, o, i, f);
}
function ri(e, t) {
  var n, r, o = 0, i, s, a, l, f, h, c, u = e[0], p = e[1], x = t.length;
  for (n = 0; n < x; n++) {
    r = 0;
    var w = t[n], I = w.length - 1;
    if (h = w[0], h[0] !== w[I][0] && h[1] !== w[I][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (s = h[0] - u, a = h[1] - p, r; r < I; r++) {
      if (c = w[r + 1], l = c[0] - u, f = c[1] - p, a === 0 && f === 0) {
        if (l <= 0 && s >= 0 || s <= 0 && l >= 0)
          return 0;
      } else if (f >= 0 && a <= 0 || f <= 0 && a >= 0) {
        if (i = ni(s, l, a, f, 0, 0), i === 0)
          return 0;
        (i > 0 && f > 0 && a <= 0 || i < 0 && f <= 0 && a > 0) && o++;
      }
      h = c, a = f, s = l;
    }
  }
  return o % 2 !== 0;
}
function je(e, t, n = {}) {
  if (!e)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const r = Gr(e), o = Kr(t), i = o.type, s = t.bbox;
  let a = o.coordinates;
  if (s && ii(r, s) === !1)
    return !1;
  i === "Polygon" && (a = [a]);
  for (var l = 0; l < a.length; ++l) {
    const f = ri(r, a[l]);
    if (f === 0 && !n.ignoreBoundary || f) return !0;
  }
  return !1;
}
function ii(e, t) {
  return t[0] <= e[0] && t[1] <= e[1] && t[2] >= e[0] && t[3] >= e[1];
}
function Le(e, t) {
  for (let n = 0; n < t.features.length; n++)
    if (je(e, t.features[n]))
      return t.features[n];
}
function zn(e, t) {
  const n = t.geometry.coordinates[0][0], r = t.geometry.coordinates[0][1], o = t.geometry.coordinates[0][2], i = e.geometry.coordinates, s = t.properties.a.geom, a = t.properties.b.geom, l = t.properties.c.geom, f = [r[0] - n[0], r[1] - n[1]], h = [o[0] - n[0], o[1] - n[1]], c = [i[0] - n[0], i[1] - n[1]], u = [a[0] - s[0], a[1] - s[1]], p = [l[0] - s[0], l[1] - s[1]], x = (h[1] * c[0] - h[0] * c[1]) / (f[0] * h[1] - f[1] * h[0]), w = (f[0] * c[1] - f[1] * c[0]) / (f[0] * h[1] - f[1] * h[0]);
  return [
    x * u[0] + w * p[0] + s[0],
    x * u[1] + w * p[1] + s[1]
  ];
}
function oi(e, t, n) {
  const r = e.geometry.coordinates, o = n.geometry.coordinates, i = Math.atan2(r[0] - o[0], r[1] - o[1]), s = ai(i, t[0]);
  if (s === void 0)
    throw new Error("Unable to determine vertex index");
  const a = t[1][s];
  return zn(e, a.features[0]);
}
function ne(e, t, n, r, o, i, s, a) {
  let l;
  if (s && (l = Le(e, Qt([s]))), !l)
    if (n) {
      const f = e.geometry.coordinates, h = n.gridNum, c = n.xOrigin, u = n.yOrigin, p = n.xUnit, x = n.yUnit, w = n.gridCache, I = xt(f[0], c, p, h), M = xt(f[1], u, x, h), g = w[I] ? w[I][M] ? w[I][M] : [] : [], b = Qt(g.map((d) => t.features[d]));
      l = Le(e, b);
    } else
      l = Le(e, t);
  return a && a(l), l ? zn(e, l) : oi(e, r, o);
}
function xt(e, t, n, r) {
  let o = Math.floor((e - t) / n);
  return o < 0 && (o = 0), o >= r && (o = r - 1), o;
}
const si = 36;
function xn(e, t, n) {
  const r = (t[1][0] - t[0][0]) / n, o = (t[1][1] - t[0][1]) / n;
  return e.reduce((i, s) => {
    const a = xt(s[0][0], t[0][0], r, n), l = xt(s[1][0], t[0][0], r, n), f = xt(s[0][1], t[0][1], o, n), h = xt(s[1][1], t[0][1], o, n), c = (l - a + 1) * (h - f + 1);
    return c > 0 ? i + c : i;
  }, 0);
}
function ai(e, t) {
  let n = _n(e - t[0]), r = Math.PI * 2, o;
  for (let i = 0; i < t.length; i++) {
    const s = (i + 1) % t.length, a = _n(e - t[s]), l = Math.min(Math.abs(n), Math.abs(a));
    n * a <= 0 && l < r && (r = l, o = i), n = a;
  }
  return o;
}
function _n(e, t = !1) {
  const n = 2 * Math.PI, r = e - Math.floor(e / n) * n;
  return t ? r : r > Math.PI ? r - n : r;
}
function Mn(e) {
  const t = e.features;
  for (let n = 0; n < t.length; n++) {
    const r = t[n];
    `${r.properties.a.index}`.substring(0, 1) === "b" && `${r.properties.b.index}`.substring(0, 1) === "b" ? t[n] = {
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            r.geometry.coordinates[0][2],
            r.geometry.coordinates[0][0],
            r.geometry.coordinates[0][1],
            r.geometry.coordinates[0][2]
          ]
        ]
      },
      properties: {
        a: {
          geom: r.properties.c.geom,
          index: r.properties.c.index
        },
        b: {
          geom: r.properties.a.geom,
          index: r.properties.a.index
        },
        c: {
          geom: r.properties.b.geom,
          index: r.properties.b.index
        }
      },
      type: "Feature"
    } : `${r.properties.c.index}`.substring(0, 1) === "b" && `${r.properties.a.index}`.substring(0, 1) === "b" && (t[n] = {
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            r.geometry.coordinates[0][1],
            r.geometry.coordinates[0][2],
            r.geometry.coordinates[0][0],
            r.geometry.coordinates[0][1]
          ]
        ]
      },
      properties: {
        a: {
          geom: r.properties.b.geom,
          index: r.properties.b.index
        },
        b: {
          geom: r.properties.c.geom,
          index: r.properties.c.index
        },
        c: {
          geom: r.properties.a.geom,
          index: r.properties.a.index
        }
      },
      type: "Feature"
    });
  }
  return e;
}
function Jn(e) {
  const t = ["a", "b", "c", "a"].map(
    (i) => e.properties[i].geom
  ), n = e.geometry.coordinates[0], r = e.properties, o = {
    a: { geom: n[0], index: r.a.index },
    b: { geom: n[1], index: r.b.index },
    c: { geom: n[2], index: r.c.index }
  };
  return qn([t], o);
}
function ci(e) {
  const t = [0, 1, 2, 0].map((r) => e[r][0][0]), n = {
    a: { geom: e[0][0][1], index: e[0][1] },
    b: { geom: e[1][0][1], index: e[1][1] },
    c: { geom: e[2][0][1], index: e[2][1] }
  };
  return qn([t], n);
}
function Ue(e, t, n, r, o, i = !1, s) {
  const a = e.map(
    (l) => {
      (!s || s < 2.00703) && (l = li(l));
      const f = isFinite(l) ? t[l] : l === "c" ? r : (function() {
        const h = l.match(/^b(\d+)$/);
        if (h) return o[parseInt(h[1])];
        const c = l.match(/^e(\d+)$/);
        if (c) return n[parseInt(c[1])];
        throw new Error("Bad index value for indexesToTri");
      })();
      return i ? [[f[1], f[0]], l] : [[f[0], f[1]], l];
    }
  );
  return ci(a);
}
function li(e) {
  return typeof e == "number" ? e : e.replace(/^(c|e|b)(?:ent|dgeNode|box)(\d+)?$/, "$1$2");
}
function Gn(e, t) {
  return t && t >= 2.00703 || Array.isArray(e[0]) ? e : e.map((n) => [
    n.illstNodes,
    n.mercNodes,
    n.startEnd
  ]);
}
const fi = 2.00704;
function hi(e) {
  return !!(e.version !== void 0 || !e.tins && e.points && e.tins_points);
}
function ui(e) {
  return {
    points: e.points,
    strictStatus: pi(e),
    verticesParams: mi(e),
    centroid: gi(e),
    edges: Gn(e.edges || []),
    edgeNodes: e.edgeNodes || [],
    tins: wi(e),
    kinks: yi(e.kinks_points),
    yaxisMode: e.yaxisMode ?? "invert",
    strictMode: e.strictMode ?? "auto",
    vertexMode: e.vertexMode,
    bounds: e.bounds,
    boundsPolygon: e.boundsPolygon,
    wh: e.wh,
    xy: e.xy ?? [0, 0]
  };
}
function di(e) {
  const t = vi(e), n = t.tins, r = t.vertices_params;
  return r != null && Kn(r), {
    compiled: t,
    tins: n,
    points: bi(n),
    strictStatus: t.strict_status,
    verticesParams: r,
    centroid: t.centroid,
    kinks: t.kinks
  };
}
function pi(e) {
  return e.strict_status ? e.strict_status : e.kinks_points ? "strict_error" : e.tins_points.length === 2 ? "loose" : "strict";
}
function mi(e) {
  if (!Array.isArray(e.vertices_params) || !Array.isArray(e.vertices_points))
    throw new Error(
      "Invalid compiled data: vertices_params and vertices_points must be arrays"
    );
  const t = {
    forw: [e.vertices_params[0]],
    bakw: [e.vertices_params[1]]
  };
  return t.forw[1] = Sn(e, !1), t.bakw[1] = Sn(e, !0), Kn(t), t;
}
function Kn(e) {
  if (typeof e != "object")
    throw new Error("Invalid compiled data: vertices_params has a wrong shape");
  ["forw", "bakw"].forEach((t) => {
    const n = e[t];
    if (n == null) return;
    const r = `vertices_params.${t}`, o = n[0], i = n[1];
    if (!Array.isArray(o) || !Array.isArray(i))
      throw new Error(`Invalid compiled data: ${r} must hold two arrays`);
    if (o.length !== i.length)
      throw new Error(
        `Invalid compiled data: ${r} must have one angle per vertex`
      );
    for (let s = 0; s < o.length; s++)
      if (typeof o[s] != "number" || !Number.isFinite(o[s]))
        throw new Error(
          `Invalid compiled data: ${r} must contain only finite numbers`
        );
  });
}
function Sn(e, t) {
  const n = e.vertices_points.length;
  return Array.from({ length: n }, (r, o) => {
    const i = (o + 1) % n, s = Ue(
      ["c", `b${o}`, `b${i}`],
      e.points,
      e.edgeNodes || [],
      e.centroid_point,
      e.vertices_points,
      t,
      fi
    );
    return Qt([s]);
  });
}
function gi(e) {
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
function wi(e) {
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
function yi(e) {
  if (e)
    return {
      bakw: Qt(
        e.map((t) => se(t))
      )
    };
}
function vi(e) {
  return JSON.parse(
    JSON.stringify(e).replace('"cent"', '"c"').replace(/"bbox(\d+)"/g, '"b$1"')
  );
}
function bi(e) {
  const t = [], n = e.forw.features;
  for (let r = 0; r < n.length; r++) {
    const o = n[r];
    ["a", "b", "c"].forEach((i, s) => {
      const a = o.geometry.coordinates[0][s], l = o.properties[i].geom, f = o.properties[i].index;
      typeof f == "number" && (t[f] = [a, l]);
    });
  }
  return t;
}
class St {
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
  /** @deprecated 2.00704 以降、Transform はこのプロパティを設定も参照もしない。サブクラス（MaplatTin）は、旧 @maplat/transform と組まれたときの互換のため {} を入れる */
  pointsWeightBuffer;
  strict_status;
  vertices_params;
  centroid;
  edgeNodes;
  edges;
  tins;
  kinks;
  yaxisMode = St.YAXIS_INVERT;
  strictMode = St.MODE_AUTO;
  vertexMode = St.VERTEX_PLAIN;
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
    if (hi(t)) {
      this.applyModernState(ui(t));
      return;
    }
    this.applyLegacyState(di(t));
  }
  applyModernState(t) {
    this.points = t.points, this.strict_status = t.strictStatus, this.vertices_params = t.verticesParams, this.centroid = t.centroid, this.edges = t.edges, this.edgeNodes = t.edgeNodes || [], this.tins = t.tins, this.addIndexedTin(), this.kinks = t.kinks, this.yaxisMode = t.yaxisMode ?? St.YAXIS_INVERT, this.vertexMode = t.vertexMode ?? St.VERTEX_PLAIN, this.strictMode = t.strictMode ?? St.MODE_AUTO, t.bounds ? (this.bounds = t.bounds, this.boundsPolygon = t.boundsPolygon, this.xy = t.xy, this.wh = t.wh) : (this.bounds = void 0, this.boundsPolygon = void 0, this.xy = t.xy ?? [0, 0], t.wh && (this.wh = t.wh));
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
   * セル数が MAX_INDEX_CELLS_PER_TRIANGLE で決まる上限を超えるデータは
   * 索引を作らず、変換時に全三角形を線形に探します。
   */
  addIndexedTin() {
    const t = this.tins, n = t.forw, r = t.bakw, o = Math.ceil(Math.sqrt(n.features.length));
    if (o < 3) {
      this.indexedTins = void 0;
      return;
    }
    let i = [], s = [];
    const a = n.features.map((w) => {
      let I = [];
      return wn(w)[0].map((M) => {
        i.length === 0 ? i = [Array.from(M), Array.from(M)] : (M[0] < i[0][0] && (i[0][0] = M[0]), M[0] > i[1][0] && (i[1][0] = M[0]), M[1] < i[0][1] && (i[0][1] = M[1]), M[1] > i[1][1] && (i[1][1] = M[1])), I.length === 0 ? I = [Array.from(M), Array.from(M)] : (M[0] < I[0][0] && (I[0][0] = M[0]), M[0] > I[1][0] && (I[1][0] = M[0]), M[1] < I[0][1] && (I[0][1] = M[1]), M[1] > I[1][1] && (I[1][1] = M[1]));
      }), I;
    }), l = r.features.map((w) => {
      let I = [];
      return wn(w)[0].map((M) => {
        s.length === 0 ? s = [Array.from(M), Array.from(M)] : (M[0] < s[0][0] && (s[0][0] = M[0]), M[0] > s[1][0] && (s[1][0] = M[0]), M[1] < s[0][1] && (s[0][1] = M[1]), M[1] > s[1][1] && (s[1][1] = M[1])), I.length === 0 ? I = [Array.from(M), Array.from(M)] : (M[0] < I[0][0] && (I[0][0] = M[0]), M[0] > I[1][0] && (I[1][0] = M[0]), M[1] < I[0][1] && (I[0][1] = M[1]), M[1] > I[1][1] && (I[1][1] = M[1]));
      }), I;
    });
    if (Math.max(
      xn(a, i, o),
      xn(l, s, o)
    ) > si * n.features.length) {
      this.indexedTins = void 0;
      return;
    }
    const f = (i[1][0] - i[0][0]) / o, h = (i[1][1] - i[0][1]) / o, c = a.reduce(
      (w, I, M) => {
        const g = xt(I[0][0], i[0][0], f, o), b = xt(I[1][0], i[0][0], f, o), d = xt(I[0][1], i[0][1], h, o), y = xt(I[1][1], i[0][1], h, o);
        for (let m = g; m <= b; m++) {
          w[m] || (w[m] = []);
          for (let S = d; S <= y; S++)
            w[m][S] || (w[m][S] = []), w[m][S].push(M);
        }
        return w;
      },
      []
    ), u = (s[1][0] - s[0][0]) / o, p = (s[1][1] - s[0][1]) / o, x = l.reduce(
      (w, I, M) => {
        const g = xt(I[0][0], s[0][0], u, o), b = xt(I[1][0], s[0][0], u, o), d = xt(I[0][1], s[0][1], p, o), y = xt(I[1][1], s[0][1], p, o);
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
        xOrigin: i[0][0],
        yOrigin: i[0][1],
        xUnit: f,
        yUnit: h,
        gridCache: c
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
  transform(t, n, r) {
    if (!this.tins)
      throw new Error("setCompiled() must be called before transform()");
    if (n && this.strict_status == St.STATUS_ERROR)
      throw new Error('Backward transform is not allowed if strict_status == "strict_error"');
    this.yaxisMode == St.YAXIS_FOLLOW && n && (t = [t[0], -1 * t[1]]);
    const o = se(t);
    if (this.bounds && !n && !r && !je(o, this.boundsPolygon))
      return !1;
    const i = n ? this.tins.bakw : this.tins.forw, s = n ? this.indexedTins?.bakw : this.indexedTins?.forw, a = n ? this.vertices_params.bakw : this.vertices_params.forw, l = n ? this.centroid.bakw : this.centroid.forw;
    let f, h;
    this.stateFull && (this.stateBackward == n ? f = this.stateTriangle : (this.stateBackward = n, this.stateTriangle = void 0), h = (u) => {
      this.stateTriangle = u;
    });
    let c = ne(
      o,
      i,
      s,
      a,
      l,
      void 0,
      f,
      h
    );
    if (this.bounds && n && !r) {
      const u = se(c);
      if (!je(u, this.boundsPolygon)) return !1;
    } else this.yaxisMode == St.YAXIS_FOLLOW && !n && (c = [c[0], -1 * c[1]]);
    return c;
  }
}
const En = Math.pow(2, -52), ve = new Uint32Array(512);
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
  static from(t, n = Ei, r = ki) {
    const o = t.length, i = new Float64Array(o * 2);
    for (let s = 0; s < o; s++) {
      const a = t[s];
      i[2 * s] = n(a), i[2 * s + 1] = r(a);
    }
    return new Ge(i);
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
    const r = Math.max(2 * n - 5, 0);
    this._triangles = new Uint32Array(r * 3), this._halfedges = new Int32Array(r * 3), this._hashSize = Math.ceil(Math.sqrt(n)), this._hullPrev = new Uint32Array(n), this._hullNext = new Uint32Array(n), this._hullTri = new Uint32Array(n), this._hullHash = new Int32Array(this._hashSize), this._ids = new Uint32Array(n), this._dists = new Float64Array(n), this.trianglesLen = 0, this._cx = 0, this._cy = 0, this._hullStart = 0, this.hull = this._triangles, this.triangles = this._triangles, this.halfedges = this._halfedges, this.update();
  }
  /**
   * Updates the triangulation if you modified `delaunay.coords` values in place, avoiding expensive memory allocations.
   * Useful for iterative relaxation algorithms such as Lloyd's.
   */
  update() {
    const { coords: t, _hullPrev: n, _hullNext: r, _hullTri: o, _hullHash: i } = this, s = t.length >> 1;
    let a = 1 / 0, l = 1 / 0, f = -1 / 0, h = -1 / 0;
    for (let k = 0; k < s; k++) {
      const N = t[2 * k], P = t[2 * k + 1];
      N < a && (a = N), P < l && (l = P), N > f && (f = N), P > h && (h = P), this._ids[k] = k;
    }
    const c = (a + f) / 2, u = (l + h) / 2;
    let p = 0, x = 0, w = 0;
    for (let k = 0, N = 1 / 0; k < s; k++) {
      const P = Ve(c, u, t[2 * k], t[2 * k + 1]);
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
      const N = Mi(I, M, g, b, t[2 * k], t[2 * k + 1]);
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
        const R = this._ids[P], v = this._dists[R];
        v > C && (k[N++] = R, C = v);
      }
      this.hull = k.subarray(0, N), this.triangles = new Uint32Array(0), this.halfedges = new Int32Array(0);
      return;
    }
    if (Ot(I, M, g, b, y, m) < 0) {
      const k = x, N = g, P = b;
      x = w, g = y, b = m, w = k, y = N, m = P;
    }
    const S = Si(I, M, g, b, y, m);
    this._cx = S.x, this._cy = S.y;
    for (let k = 0; k < s; k++)
      this._dists[k] = Ve(t[2 * k], t[2 * k + 1], S.x, S.y);
    Kt(this._ids, this._dists, 0, s - 1), this._hullStart = p;
    let E = 3;
    r[p] = n[w] = x, r[x] = n[p] = w, r[w] = n[x] = p, o[p] = 0, o[x] = 1, o[w] = 2, i.fill(-1), i[this._hashKey(I, M)] = p, i[this._hashKey(g, b)] = x, i[this._hashKey(y, m)] = w, this.trianglesLen = 0, this._addTriangle(p, x, w, -1, -1, -1);
    for (let k = 0, N = 0, P = 0; k < this._ids.length; k++) {
      const C = this._ids[k], R = t[2 * C], v = t[2 * C + 1];
      if (k > 0 && Math.abs(R - N) <= En && Math.abs(v - P) <= En || (N = R, P = v, C === p || C === x || C === w)) continue;
      let O = 0;
      for (let _ = 0, B = this._hashKey(R, v); _ < this._hashSize && (O = i[(B + _) % this._hashSize], !(O !== -1 && O !== r[O])); _++)
        ;
      O = n[O];
      let A = O, T;
      for (; T = r[A], Ot(R, v, t[2 * A], t[2 * A + 1], t[2 * T], t[2 * T + 1]) >= 0; )
        if (A = T, A === O) {
          A = -1;
          break;
        }
      if (A === -1) continue;
      let X = this._addTriangle(A, C, r[A], -1, -1, o[A]);
      o[C] = this._legalize(X + 2), o[A] = X, E++;
      let $ = r[A];
      for (; T = r[$], Ot(R, v, t[2 * $], t[2 * $ + 1], t[2 * T], t[2 * T + 1]) < 0; )
        X = this._addTriangle($, C, T, o[C], -1, o[$]), o[C] = this._legalize(X + 2), r[$] = $, E--, $ = T;
      if (A === O)
        for (; T = n[A], Ot(R, v, t[2 * T], t[2 * T + 1], t[2 * A], t[2 * A + 1]) < 0; )
          X = this._addTriangle(T, C, A, -1, o[A], o[T]), this._legalize(X + 2), o[T] = X, r[A] = A, E--, A = T;
      this._hullStart = n[C] = A, r[A] = n[$] = C, r[C] = $, i[this._hashKey(R, v)] = C, i[this._hashKey(t[2 * A], t[2 * A + 1])] = A;
    }
    this.hull = new Uint32Array(E);
    for (let k = 0, N = this._hullStart; k < E; k++)
      this.hull[k] = N, N = r[N];
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
    return Math.floor(xi(t - this._cx, n - this._cy) * this._hashSize) % this._hashSize;
  }
  /**
   * Flip an edge in a pair of triangles if it doesn't satisfy the Delaunay condition.
   *
   * @param {number} a
   * @private
   */
  _legalize(t) {
    const { _triangles: n, _halfedges: r, coords: o } = this;
    let i = 0, s = 0;
    for (; ; ) {
      const a = r[t], l = t - t % 3;
      if (s = l + (t + 2) % 3, a === -1) {
        if (i === 0) break;
        t = ve[--i];
        continue;
      }
      const f = a - a % 3, h = l + (t + 1) % 3, c = f + (a + 2) % 3, u = n[s], p = n[t], x = n[h], w = n[c];
      if (_i(
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
        const M = r[c];
        if (M === -1) {
          let b = this._hullStart;
          do {
            if (this._hullTri[b] === c) {
              this._hullTri[b] = t;
              break;
            }
            b = this._hullPrev[b];
          } while (b !== this._hullStart);
        }
        this._link(t, M), this._link(a, r[s]), this._link(s, c);
        const g = f + (a + 1) % 3;
        i < ve.length && (ve[i++] = g);
      } else {
        if (i === 0) break;
        t = ve[--i];
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
  _addTriangle(t, n, r, o, i, s) {
    const a = this.trianglesLen;
    return this._triangles[a] = t, this._triangles[a + 1] = n, this._triangles[a + 2] = r, this._link(a, o), this._link(a + 1, i), this._link(a + 2, s), this.trianglesLen += 3, a;
  }
}
function xi(e, t) {
  const n = e / (Math.abs(e) + Math.abs(t));
  return (t > 0 ? 3 - n : 1 + n) / 4;
}
function Ve(e, t, n, r) {
  const o = e - n, i = t - r;
  return o * o + i * i;
}
function _i(e, t, n, r, o, i, s, a) {
  const l = e - s, f = t - a, h = n - s, c = r - a, u = o - s, p = i - a, x = l * l + f * f, w = h * h + c * c, I = u * u + p * p;
  return l * (c * I - w * p) - f * (h * I - w * u) + x * (h * p - c * u) < 0;
}
function Mi(e, t, n, r, o, i) {
  const s = n - e, a = r - t, l = o - e, f = i - t, h = s * s + a * a, c = l * l + f * f, u = 0.5 / (s * f - a * l), p = (f * h - a * c) * u, x = (s * c - l * h) * u;
  return p * p + x * x;
}
function Si(e, t, n, r, o, i) {
  const s = n - e, a = r - t, l = o - e, f = i - t, h = s * s + a * a, c = l * l + f * f, u = 0.5 / (s * f - a * l), p = e + (f * h - a * c) * u, x = t + (s * c - l * h) * u;
  return { x: p, y: x };
}
function Kt(e, t, n, r) {
  if (r - n <= 20)
    for (let o = n + 1; o <= r; o++) {
      const i = e[o], s = t[i];
      let a = o - 1;
      for (; a >= n && t[e[a]] > s; ) e[a + 1] = e[a--];
      e[a + 1] = i;
    }
  else {
    const o = n + r >> 1;
    let i = n + 1, s = r;
    te(e, o, i), t[e[n]] > t[e[r]] && te(e, n, r), t[e[i]] > t[e[r]] && te(e, i, r), t[e[n]] > t[e[i]] && te(e, n, i);
    const a = e[i], l = t[a];
    for (; ; ) {
      do
        i++;
      while (t[e[i]] < l);
      do
        s--;
      while (t[e[s]] > l);
      if (s < i) break;
      te(e, i, s);
    }
    e[n + 1] = e[s], e[s] = a, r - i + 1 >= s - n ? (Kt(e, t, i, r), Kt(e, t, n, s - 1)) : (Kt(e, t, n, s - 1), Kt(e, t, i, r));
  }
}
function te(e, t, n) {
  const r = e[t];
  e[t] = e[n], e[n] = r;
}
function Ei(e) {
  return e[0];
}
function ki(e) {
  return e[1];
}
class Ai {
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
    const n = Math.floor(t / this.width), r = t % this.width;
    return this.bs[n] |= 1 << r, this;
  }
  /**
   * Delete a number from the set.
   *
   * @param idx The number to delete. Must be 0 <= idx < len.
   */
  delete(t) {
    const n = Math.floor(t / this.width), r = t % this.width;
    return this.bs[n] &= ~(1 << r), this;
  }
  /**
   * Add or delete a number in the set, depending on the second argument.
   *
   * @param idx The number to add or delete. Must be 0 <= idx < len.
   * @param val If true, add the number, otherwise delete.
   */
  set(t, n) {
    const r = Math.floor(t / this.width), i = 1 << t % this.width;
    return this.bs[r] ^= (-Number(n) ^ this.bs[r]) & i, n;
  }
  /**
   * Whether the number is in the set.
   *
   * @param idx The number to test. Must be 0 <= idx < len.
   */
  has(t) {
    const n = Math.floor(t / this.width), r = t % this.width;
    return (this.bs[n] & 1 << r) !== 0;
  }
  /**
   * Iterate over the numbers that are in the set.
   */
  forEach(t) {
    const n = this.bs.length;
    for (let r = 0; r < n; r++) {
      let o = 0;
      for (; this.bs[r] && o < this.width; )
        this.bs[r] & 1 << o && t(r * this.width + o), o++;
    }
    return this;
  }
}
class kn extends Ai {
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
function An(e, t, n, r, o, i, s, a) {
  const l = Ot(e, t, o, i, s, a), f = Ot(n, r, o, i, s, a);
  if (l > 0 && f > 0 || l < 0 && f < 0)
    return !1;
  const h = Ot(o, i, e, t, n, r), c = Ot(s, a, e, t, n, r);
  return h > 0 && c > 0 || h < 0 && c < 0 ? !1 : l === 0 && f === 0 && h === 0 && c === 0 ? !(Math.max(o, s) < Math.min(e, n) || Math.max(e, n) < Math.min(o, s) || Math.max(i, a) < Math.min(t, r) || Math.max(t, r) < Math.min(i, a)) : !0;
}
class Ii {
  /**
   * The triangulation object from Delaunator.
   */
  del;
  constructor(t) {
    this.del = t;
  }
}
class Oi extends Ii {
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
    const r = 2 ** 32 - 1, o = t.coords.length >> 1, i = t.triangles.length;
    this.vertMap = new Uint32Array(o).fill(r), this.flips = new kn(i), this.consd = new kn(i);
    for (let s = 0; s < i; s++) {
      const a = t.triangles[s];
      this.vertMap[a] === r && this.updateVert(s);
    }
    n && this.constrainAll(n);
  }
  /**
   * Constrain the triangulation such that there is an edge between p1 and p2.
   */
  constrainOne(t, n) {
    const { triangles: r, halfedges: o } = this.del;
    this.assertVertex(t, t, n), this.assertVertex(n, t, n), this.assertInTriangulation(t, t, n), this.assertInTriangulation(n, t, n);
    const i = this.vertMap[t], s = this.maxConstrainSteps();
    let a = 0, l = i;
    do {
      if (++a > s)
        throw new Error(
          `Constraining edge [${t}, ${n}] exceeded the iteration limit`
        );
      const c = r[l], u = Ut(l);
      if (c === n)
        return this.protect(l);
      const p = Nt(l), x = r[p];
      if (x === n)
        return this.protect(u), u;
      if (this.intersectSegments(t, n, x, c)) {
        l = p;
        break;
      }
      l = o[u];
    } while (l !== -1 && l !== i);
    let f = l, h = -1;
    for (; l !== -1; ) {
      if (++a > s)
        throw new Error(
          `Constraining edge [${t}, ${n}] exceeded the iteration limit`
        );
      const c = o[l], u = Nt(l), p = Nt(c), x = Ut(c);
      if (c === -1)
        throw new Error("Constraining edge exited the hull");
      if (this.consd.has(l))
        throw new Error("Edge intersects already constrained edge");
      if (this.isCollinear(t, n, r[l]) || this.isCollinear(t, n, r[c]))
        throw new Error("Constraining edge intersects point");
      if (!this.intersectSegments(
        r[l],
        r[c],
        r[u],
        r[p]
      )) {
        if (h === -1 && (h = l), r[p] === n) {
          if (l === h)
            throw new Error("Infinite loop: non-convex quadrilateral");
          l = h, h = -1;
          continue;
        }
        if (this.intersectSegments(
          t,
          n,
          r[p],
          r[c]
        ))
          l = p;
        else if (this.intersectSegments(
          t,
          n,
          r[x],
          r[p]
        ))
          l = x;
        else if (h === l)
          throw new Error("Infinite loop: no further intersect after non-convex");
        continue;
      }
      if (this.flipDiagonal(l), this.intersectSegments(
        t,
        n,
        r[u],
        r[p]
      ) && (h === -1 && (h = u), h === u))
        throw new Error("Infinite loop: flipped diagonal still intersects");
      r[p] === n ? (f = p, l = h, h = -1) : this.intersectSegments(
        t,
        n,
        r[x],
        r[p]
      ) && (l = x);
    }
    return this.protect(f), this.delaunify(!0), this.findEdge(t, n);
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
  assertInTriangulation(t, n, r) {
    if (this.vertMap[t] >= this.del.triangles.length)
      throw new Error(
        `Invalid edge [${n}, ${r}]: vertex ${t} is not part of the triangulation`
      );
  }
  /**
   * Throw unless `vertex` is an id of a point given to Delaunator.
   */
  assertVertex(t, n, r) {
    const o = this.vertMap.length;
    if (!Number.isInteger(t) || t < 0 || t >= o)
      throw new Error(
        `Invalid edge [${String(n)}, ${String(r)}]: vertex ids must be integers from 0 to ${o - 1}`
      );
  }
  /**
   * Fix the Delaunay condition.
   */
  delaunify(t = !1) {
    const { halfedges: n } = this.del, r = this.flips, o = this.consd, i = n.length;
    let s;
    do {
      s = 0;
      for (let a = 0; a < i; a++) {
        if (o.has(a))
          continue;
        r.delete(a);
        const l = n[a];
        l !== -1 && (r.delete(l), this.isDelaunay(a) || (this.flipDiagonal(a), s++));
      }
    } while (t && s > 0);
    return this;
  }
  /**
   * Call constrainOne on each edge.
   */
  constrainAll(t) {
    const n = t.length;
    for (let r = 0; r < n; r++) {
      const o = t[r];
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
    const r = this.vertMap[n], { triangles: o, halfedges: i } = this.del;
    if (!(r < o.length))
      return 1 / 0;
    let s = r, a, l = 0;
    do {
      if (++l > o.length)
        throw new Error(
          `Looking up edge [${t}, ${n}] exceeded the iteration limit`
        );
      if (o[s] === t)
        return s;
      a = Ut(s), s = i[a];
    } while (s !== -1 && s !== r);
    return o[Ut(a)] === t ? -a : 1 / 0;
  }
  /**
   * Mark an edge as constrained, i.e. should not be touched by `delaunify`.
   */
  protect(t) {
    const n = this.del.halfedges[t], r = this.flips, o = this.consd;
    return r.delete(t), o.add(t), n !== -1 ? (r.delete(n), o.add(n), n) : -t;
  }
  /**
   * Mark an edge as flipped unless constrained.
   */
  markFlip(t) {
    const n = this.del.halfedges, r = this.flips;
    if (this.consd.has(t))
      return !1;
    const i = n[t];
    return i !== -1 && (r.add(t), r.add(i)), !0;
  }
  /**
   * Flip the edge shared by two triangles.
   */
  flipDiagonal(t) {
    const { triangles: n, halfedges: r } = this.del, o = this.flips, i = this.consd, s = r[t], a = Nt(t), l = Ut(t), f = Nt(s), h = Ut(s), c = r[a], u = r[f];
    if (i.has(t))
      throw new Error("Trying to flip a constrained edge");
    return n[t] = n[f], r[t] = u, o.set(t, o.has(f)) || i.set(t, i.has(f)), u !== -1 && (r[u] = t), r[a] = f, n[s] = n[a], r[s] = c, o.set(s, o.has(a)) || i.set(s, i.has(a)), c !== -1 && (r[c] = s), r[f] = a, this.markFlip(t), this.markFlip(l), this.markFlip(s), this.markFlip(h), o.add(a), i.delete(a), o.add(f), i.delete(f), this.updateVert(t), this.updateVert(l), this.updateVert(s), this.updateVert(h), a;
  }
  /**
   * Whether point p1, p2, and p are collinear.
   */
  isCollinear(t, n, r) {
    const o = this.del.coords;
    return Ot(
      o[t * 2],
      o[t * 2 + 1],
      o[n * 2],
      o[n * 2 + 1],
      o[r * 2],
      o[r * 2 + 1]
    ) === 0;
  }
  /**
   * Whether the triangle formed by p1, p2, p3 keeps px outside the circumcircle.
   */
  inCircle(t, n, r, o) {
    const i = this.del.coords;
    return gr(
      i[t * 2],
      i[t * 2 + 1],
      i[n * 2],
      i[n * 2 + 1],
      i[r * 2],
      i[r * 2 + 1],
      i[o * 2],
      i[o * 2 + 1]
    ) < 0;
  }
  /**
   * Whether the triangles sharing edg conform to the Delaunay condition.
   */
  isDelaunay(t) {
    const { triangles: n, halfedges: r } = this.del, o = r[t];
    if (o === -1)
      return !0;
    const i = n[Nt(t)], s = n[t], a = n[Ut(t)], l = n[Nt(o)];
    return !this.inCircle(i, s, a, l);
  }
  /**
   * Update the vertex -> incoming edge map.
   */
  updateVert(t) {
    const { triangles: n, halfedges: r } = this.del, o = this.vertMap, i = n[t];
    let s = Nt(t), a = r[s];
    for (; a !== -1 && a !== t; )
      s = Nt(a), a = r[s];
    return o[i] = s, s;
  }
  /**
   * Whether the segments between vertices intersect.
   */
  intersectSegments(t, n, r, o) {
    const i = this.del.coords;
    return t === r || t === o || n === r || n === o ? !1 : An(
      i[t * 2],
      i[t * 2 + 1],
      i[n * 2],
      i[n * 2 + 1],
      i[r * 2],
      i[r * 2 + 1],
      i[o * 2],
      i[o * 2 + 1]
    );
  }
  static intersectSegments = An;
}
function be(e, t, n) {
  if (t || (t = []), typeof e != "object" || e.type !== "FeatureCollection")
    throw "Argument points must be FeatureCollection";
  if (!Array.isArray(t)) throw "Argument points must be Array of Array";
  const r = e.features.map(
    (l) => l.geometry.coordinates
  ), o = Ge.from(r);
  let i;
  const s = [];
  o.triangles.length !== 0 && t.length !== 0 && (i = new Oi(o), i.constrainAll(t));
  for (let l = 0; l < o.triangles.length; l += 3)
    s.push([o.triangles[l], o.triangles[l + 1], o.triangles[l + 2]]);
  const a = ["a", "b", "c"];
  return Et(
    s.map((l) => {
      const f = {}, h = l.map((c, u) => {
        const p = e.features[c], x = p.geometry.coordinates, w = [x[0], x[1]];
        return x.length === 3 ? w[2] = x[2] : f[a[u]] = p.properties[n], w;
      });
      return h[3] = h[0], le([h], f);
    })
  );
}
const Ni = 256 * Number.EPSILON, Hn = 4, Pi = 1e-9;
function Ti(e) {
  const t = Math.abs(e);
  if (!Number.isFinite(t)) return NaN;
  const n = new DataView(new ArrayBuffer(8));
  n.setFloat64(0, t);
  const r = n.getUint32(0) >>> 20 & 2047;
  return Math.pow(2, Math.max(r, 1) - 1023 - 52);
}
function Bi(e) {
  let t = 0;
  for (const n of e)
    t = Math.max(t, Math.abs(n[0]), Math.abs(n[1]));
  return t;
}
function Ci(e, t, n = Hn) {
  const r = (i) => {
    let s = 0;
    for (let l = 1; l < i.length; l++)
      s += Math.sqrt(
        Math.pow(i[l][0] - i[l - 1][0], 2) + Math.pow(i[l][1] - i[l - 1][1], 2)
      );
    const a = Ti(Bi(i)) / s;
    return Number.isFinite(a) ? a : 0;
  }, o = Ni + n * (r(e) + r(t));
  return Math.min(o, Pi);
}
function Xi(e, t, n) {
  const r = new Int32Array(e.length).fill(-1), o = new Int32Array(t.length).fill(-1), i = e.length - 2, s = t.length - 2;
  if (i < 1 || s < 1) return { illstToMerc: r, mercToIllst: o };
  const a = (y, m) => Math.abs(t[m + 1][3] - e[y + 1][3]) <= n;
  let l = i, f = -1, h = s, c = -1;
  for (let y = 0; y < i; y++)
    for (let m = 0; m < s; m++)
      a(y, m) && (l = Math.min(l, y), f = Math.max(f, y), h = Math.min(h, m), c = Math.max(c, m));
  if (f < 0) return { illstToMerc: r, mercToIllst: o };
  const u = f - l + 1, p = c - h + 1, x = p + 1, w = new Int32Array((u + 1) * x), I = new Float64Array((u + 1) * x), M = new Uint8Array((u + 1) * x), g = (y, m, S, E) => y > S || y === S && m < E;
  for (let y = 1; y <= u; y++)
    for (let m = 1; m <= p; m++) {
      const S = y * x + m, E = S - x, k = S - 1;
      let N = w[E], P = I[E], C = 0;
      g(w[k], I[k], N, P) && (N = w[k], P = I[k], C = 1);
      const R = l + y - 1, v = h + m - 1;
      if (a(R, v)) {
        const O = E - 1, A = w[O] + 1, T = I[O] + Math.abs(t[v + 1][3] - e[R + 1][3]);
        g(A, T, N, P) && (N = A, P = T, C = 2);
      }
      w[S] = N, I[S] = P, M[S] = C;
    }
  let b = u, d = p;
  for (; b > 0 && d > 0; ) {
    const y = M[b * x + d];
    if (y === 2) {
      const m = l + b - 1 + 1, S = h + d - 1 + 1;
      r[m] = S, o[S] = m, b--, d--;
    } else y === 0 ? b-- : d--;
  }
  return { illstToMerc: r, mercToIllst: o };
}
function Fi(e, t, n = Hn) {
  const r = Ci(e, t, n), o = [e, t].map((h) => {
    const c = h.map((p, x, w) => {
      if (x === 0) return 0;
      const I = w[x - 1];
      return Math.sqrt(
        Math.pow(p[0] - I[0], 2) + Math.pow(p[1] - I[1], 2)
      );
    }), u = c.reduce((p, x, w) => w === 0 ? [0] : (p.push(p[w - 1] + x), p), []);
    return u.map((p, x, w) => {
      const I = p / w[w.length - 1];
      return [h[x], c[x], u[x], I];
    });
  }), { illstToMerc: i, mercToIllst: s } = Xi(o[0], o[1], r), a = [i, s], l = (h, c) => {
    for (let u = 1; u < c.length - 1; u++)
      if (Math.abs(c[u][3] - h) <= r) return !0;
    return !1;
  }, f = [];
  return o.forEach((h, c) => {
    const u = o[c ? 0 : 1];
    h.forEach((p, x) => {
      if (x === 0 || x === h.length - 1) return;
      const w = p[0], I = p[3], M = a[c][x];
      if (M >= 0) {
        c === 0 && f.push([w, u[M][0], I]);
        return;
      }
      if (!l(I, u))
        for (let g = 0; g < u.length - 1; g++) {
          const b = u[g], d = u[g + 1], y = b[3], m = d[3];
          if (y < I && m > I) {
            const S = (I - y) / (m - y), E = [
              (d[0][0] - b[0][0]) * S + b[0][0],
              (d[0][1] - b[0][1]) * S + b[0][1]
            ];
            f.push(
              c === 0 ? [w, E, I] : [E, w, I]
            );
            return;
          }
        }
    });
  }), f.sort((h, c) => h[2] - c[2]);
}
function $i(e, t) {
  const n = [[], [], [], []], r = [];
  return Object.keys(e).forEach((o) => {
    const i = e[o], s = i.forw, a = i.bakw, l = [
      s[0] - t.forw[0],
      s[1] - t.forw[1]
    ], f = [
      a[0] - t.bakw[0],
      t.bakw[1] - a[1]
    ], h = { forw: l, bakw: f };
    if (r.push(h), l[0] === 0 || l[1] === 0)
      return;
    let c = 0;
    l[0] > 0 && (c += 1), l[1] > 0 && (c += 2), n[c].push(h);
  }), { perQuad: n, aggregate: r };
}
function Ri(e) {
  let t = 1 / 0, n = 0, r = 0;
  return e.forEach((o) => {
    const { forw: i, bakw: s } = o, a = Math.hypot(i[0], i[1]), l = Math.hypot(s[0], s[1]);
    if (l === 0) return;
    const f = a / l, h = Math.atan2(i[0], i[1]) - Math.atan2(s[0], s[1]);
    t = Math.min(t, f), n += Math.cos(h), r += Math.sin(h);
  }), isFinite(t) ? [t, Math.atan2(r, n)] : [1, 0];
}
function Di(e, t, n) {
  const { perQuad: r, aggregate: o } = $i(e, t), i = r.every((l) => l.length > 0), a = (n === "birdeye" ? i ? r : [o] : [o]).map((l) => Ri(l));
  return a.length === 1 ? [a[0], a[0], a[0], a[0]] : a;
}
function Yi(e, t) {
  let n = 0;
  return e[0] > t[0] && (n += 1), e[1] > t[1] && (n += 2), n;
}
function Li(e, t, n) {
  const r = [
    e[0] - t.forw[0],
    e[1] - t.forw[1]
  ], i = Math.sqrt(r[0] ** 2 + r[1] ** 2) / n[0], s = Math.atan2(r[0], r[1]) - n[1];
  return [
    t.bakw[0] + i * Math.sin(s),
    t.bakw[1] - i * Math.cos(s)
  ];
}
function Vi(e, t, n, r) {
  const o = t[0] - e[0], i = t[1] - e[1];
  if (Math.abs(o) < 1e-12 && Math.abs(i) < 1e-12) return null;
  const s = r[0] - n[0], a = r[1] - n[1], l = n[0] - e[0], f = n[1] - e[1], h = o * a - i * s;
  if (Math.abs(h) < 1e-12) return null;
  const c = (l * a - f * s) / h, u = (l * i - f * o) / h;
  return c <= 1e-10 || u < -1e-10 || u > 1 + 1e-10 ? null : { t: c, point: [e[0] + c * o, e[1] + c * i] };
}
function ji(e, t, n) {
  const r = n.length;
  let o = -1 / 0, i = null;
  for (let s = 0; s < r; s++) {
    const a = (s + 1) % r, l = Vi(
      e,
      t,
      n[s].bakw,
      n[a].bakw
    );
    l && l.t > o && (o = l.t, i = l.point);
  }
  return i;
}
function In(e, t) {
  const r = Math.atan2(e[0] - t[0], e[1] - t[1]) * (180 / Math.PI);
  return r < 0 ? r + 360 : r;
}
function On(e, t, n, r, o, i) {
  const s = t[0] - e[0], a = t[1] - e[1];
  if (s === 0 && a === 0) return null;
  const l = [];
  if (s !== 0)
    for (const h of [n, r]) {
      const c = (h - e[0]) / s;
      if (c > 0) {
        const u = e[1] + c * a;
        u >= o && u <= i && l.push({ t: c, x: h, y: u });
      }
    }
  if (a !== 0)
    for (const h of [o, i]) {
      const c = (h - e[1]) / a;
      if (c > 0) {
        const u = e[0] + c * s;
        u >= n && u <= r && l.push({ t: c, x: u, y: h });
      }
    }
  if (l.length === 0) return null;
  l.sort((h, c) => h.t - c.t);
  const f = l[0];
  return [f.x, f.y];
}
function Nn(e, t, n) {
  const r = e.length, o = new Array(r).fill(1);
  for (const i of t)
    for (let s = 0; s < r; s++) {
      const a = (s + 1) % r, l = Qe([e[s].bakw, e[a].bakw]), f = Qe([n.bakw, i.bakw]), h = Br(l, f);
      if (h.features.length > 0 && h.features[0].geometry) {
        const c = h.features[0], u = Math.sqrt(
          Math.pow(i.bakw[0] - n.bakw[0], 2) + Math.pow(i.bakw[1] - n.bakw[1], 2)
        ), p = Math.sqrt(
          Math.pow(c.geometry.coordinates[0] - n.bakw[0], 2) + Math.pow(c.geometry.coordinates[1] - n.bakw[1], 2)
        ), x = u / p;
        x > o[s] && (o[s] = x), x > o[a] && (o[a] = x);
      }
    }
  e.forEach((i, s) => {
    const a = o[s];
    i.bakw = [
      (i.bakw[0] - n.bakw[0]) * a + n.bakw[0],
      (i.bakw[1] - n.bakw[1]) * a + n.bakw[1]
    ];
  });
}
function Qn(e, t, n) {
  const { convexBuf: r, centroid: o, allGcps: i, minx: s, maxx: a, miny: l, maxy: f } = e, h = Di(r, o, t), u = [
    [s, l],
    [a, l],
    [a, f],
    [s, f]
  ].map((m) => ({
    forw: m,
    bakw: Li(
      m,
      o,
      h[Yi(m, o.forw)]
    )
  }));
  if (u.sort(
    (m, S) => Math.atan2(m.forw[0] - o.forw[0], m.forw[1] - o.forw[1]) - Math.atan2(S.forw[0] - o.forw[0], S.forw[1] - o.forw[1])
  ), Nn(u, i, o), !n) return u;
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
      (m) => Math.floor(In(m.forw, o.forw) / 10) % 36
    )
  ), b = i.map((m) => ({
    forw: m.forw,
    bakw: m.bakw,
    angleDeg: In(m.forw, o.forw),
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
      k = On(o.forw, O.forw, s, a, l, f);
    }
    if (!k) {
      const O = (S + 5) % 360 * (Math.PI / 180), A = [
        o.forw[0] + Math.sin(O),
        o.forw[1] + Math.cos(O)
      ];
      k = On(o.forw, A, s, a, l, f);
    }
    if (!k) continue;
    const N = [k[0] - o.forw[0], k[1] - o.forw[1]], P = Math.atan2(N[0], N[1]), C = M(P), R = [
      o.bakw[0] + Math.sin(C),
      o.bakw[1] - Math.cos(C)
    ], v = ji(o.bakw, R, u);
    v && d.push({ forw: k, bakw: v });
  }
  const y = [...u, ...d];
  return y.sort(
    (m, S) => Math.atan2(m.forw[0] - o.forw[0], m.forw[1] - o.forw[1]) - Math.atan2(S.forw[0] - o.forw[0], S.forw[1] - o.forw[1])
  ), Nn(y, i, o), y;
}
function Ui(e, t = !1) {
  return Qn(e, "plain", t);
}
function qi(e, t = !1) {
  return Qn(e, "birdeye", t);
}
function Eo(e) {
  return Wn(e, 1 / 0);
}
const Pn = 1e5, zi = 16;
function Wn(e, t) {
  return Ji(e), new Gi(e).findSegmentIntersections(t).map(
    (o) => Yt([o.x, o.y])
  );
}
function Ji(e) {
  for (let t = 0, n = e.length; t < n; t++) {
    const r = e[t];
    ae(r) || qt(
      "findIntersections() received invalid coordinates:",
      `line=${t}`,
      `points=${r}`
    );
    for (let o = 0, i = r.length; o < i; o++) {
      const s = r[o];
      (!ae(s) || !Number.isFinite(s[0]) || !Number.isFinite(s[1])) && qt(
        "findIntersections() received non-finite coordinates:",
        `line=${t}`,
        `point=${o}`,
        `coordinates=${JSON.stringify(s)}`
      );
    }
  }
}
class Gi {
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
    const n = [], r = [], o = t.map((i) => {
      const s = i ? i.length : 0;
      for (let a = 0; a < s; a++)
        n.push(i[a][0]), r.push(i[a][1]);
      return s;
    });
    this.initXYData(o, n, r);
  }
  initXYData(t, n, r) {
    const o = t.length;
    this._xx = new Float64Array(n), this._yy = new Float64Array(r), this._nn = new Uint32Array(t), this._zz = null, this._zlimit = 0, this._filteredArcIter = null, this._ii = new Uint32Array(o);
    let i = 0;
    for (let s = 0; s < o; s++)
      this._ii[s] = i, i += t[s];
    (i != this._xx.length || this._xx.length != this._yy.length) && qt("ArcCollection#initXYData() Counting error"), this.initBounds(), this._arcIter = new mo(this._xx, this._yy);
  }
  initBounds() {
    const t = this.calcArcBounds_(this._xx, this._yy, this._nn);
    this._bb = t.bb, this._allBounds = t.bounds;
  }
  /**
   * データの境界を計算
   * @returns バウンディングボックス情報
   */
  calcArcBounds_(t, n, r) {
    const o = r.length, i = new Float64Array(o * 4), s = new ce();
    let a = 0, l, f, h;
    for (let c = 0; c < o; c++)
      l = r[c], l > 0 && (f = c * 4, h = go(t, n, a, l), i[f++] = h[0], i[f++] = h[1], i[f++] = h[2], i[f] = h[3], a += l, s.mergeBounds(h));
    return {
      bb: i,
      bounds: s
    };
  }
  getBounds() {
    return this._allBounds ? this._allBounds.clone() : new ce();
  }
  // @cb function(i, j, xx, yy)
  forEachSegment(t) {
    let n = 0;
    for (let r = 0, o = this.size(); r < o; r++)
      n += this.forEachArcSegment(r, t);
    return n;
  }
  size() {
    return this._ii && this._ii.length || 0;
  }
  // @cb function(i, j, xx, yy)
  forEachArcSegment(t, n) {
    const r = t >= 0, o = r ? t : ~t, i = this.getRetainedInterval(), s = this._nn[o], a = r ? 1 : -1;
    let l = r ? this._ii[o] : this._ii[o] + s - 1, f = l, h = 0;
    for (let c = 1; c < s; c++)
      f += a, (i === 0 || this._zz[f] >= i) && (n(l, f, this._xx, this._yy), l = f, h++);
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
  getUint32Array(t) {
    const n = t * 4;
    return (!this.buf || this.buf.byteLength < n) && (this.buf = new ArrayBuffer(n)), new Uint32Array(this.buf, 0, t);
  }
  // Return average magnitudes of dx, dy (with simplification)
  getAvgSegment2() {
    let t = 0, n = 0;
    const r = this.forEachSegment(
      (o, i, s, a) => {
        t += Math.abs(s[o] - s[i]), n += Math.abs(a[o] - a[i]);
      }
    );
    return [t / r || 0, n / r || 0];
  }
  /**
   * 交差判定のためのストライプ数を計算
   * 線分の平均長さに基づいて最適な分割数を決定
   */
  calcSegmentIntersectionStripeCount() {
    const t = this.getBounds().height(), n = this.getAvgSegment2()[1];
    let r = 1;
    return n > 0 && t > 0 && (r = Math.ceil(t / n / 20)), r || 1;
  }
  /**
   * 線分の交差を検出
   * ストライプ分割による効率的な判定を実装
   *
   * @param limit - 返す交差点の件数の上限（同じ位置の交差は 1 件に数える）
   * @returns 検出された交差点の配列（同じ位置の重複なし）
   */
  findSegmentIntersections(t = 1 / 0) {
    const n = this.getBounds(), r = n.ymin || 0, o = (n.ymax || 0) - r, i = this.calcSegmentIntersectionStripeCount(), s = new Uint32Array(i), a = i > 1 ? (b) => Math.floor((i - 1) * (b - r) / o) : () => 0, l = i + 1;
    let f;
    this.forEachSegment(
      (b, d, y, m) => {
        let S = a(m[b]);
        const E = a(m[d]);
        let k = 0;
        for (; s[S] = s[S] + 2, S != E; )
          k++, k > l && qt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${i}`,
            `s1=${S}`,
            `s2=${E}`
          ), S += E > S ? 1 : -1;
      }
    );
    const h = this.getUint32Array(Qi(s));
    let c = 0;
    const u = [];
    Wi(s, (b) => {
      const d = c;
      c += b, u.push(h.subarray(d, c));
    }), Zi(s, 0), this.forEachSegment(
      (b, d, y, m) => {
        let S = a(m[b]);
        const E = a(m[d]);
        let k, N, P = 0;
        for (; k = s[S], s[S] = k + 2, N = u[S], N[k] = b, N[k + 1] = d, S != E; )
          P++, P > l && qt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${i}`,
            `s1=${S}`,
            `s2=${E}`
          ), S += E > S ? 1 : -1;
      }
    );
    const p = this.getVertexData(), x = t * zi;
    let w = 0;
    const I = /* @__PURE__ */ new Set(), M = /* @__PURE__ */ new Map(), g = (b) => {
      w++;
      const d = po(b);
      return I.has(d) || (I.add(d), M.set(`${b.x}:${b.y}`, b)), M.size >= t || w >= x;
    };
    if (p.xx && p.yy)
      for (f = 0; f < i && !to(u[f], p.xx, p.yy, g); f++)
        ;
    return Array.from(M.values());
  }
}
function qt(...e) {
  const t = e.join(" ");
  throw new Error(t);
}
function ae(e) {
  return e ? Hi(e) ? !0 : Ki(e) ? !1 : e.length === 0 ? !0 : e.length > 0 : !1;
}
function Ki(e) {
  return e != null && e.toString === String.prototype.toString;
}
function Hi(e) {
  return Array.isArray(e);
}
function Qi(e, t) {
  ae(e) || qt("utils.sum() expects an array, received:", e);
  let n = 0, r;
  for (let o = 0, i = e.length; o < i; o++)
    r = e[o], r && (n += r);
  return n;
}
function Wi(e, t, n) {
  if (!ae(e))
    throw new Error(`#forEach() takes an array-like argument. ${e}`);
  for (let r = 0, o = e.length; r < o; r++)
    t.call(n, e[r], r);
}
function Zi(e, t) {
  for (let n = 0, r = e.length; n < r; n++)
    e[n] = t;
  return e;
}
function to(e, t, n, r) {
  const o = e.length - 2;
  let i, s, a, l, f, h, c, u, p, x, w, I, M, g, b, d, y;
  for (fo(t, e), d = 0; d < o; ) {
    for (i = e[d], s = e[d + 1], f = t[i], h = t[s], p = n[i], x = n[s], y = d; y < o && (y += 2, a = e[y], c = t[a], !(h < c)); ) {
      if (w = n[a], l = e[y + 1], u = t[l], I = n[l], p >= w) {
        if (p > I && x > w && x > I) continue;
      } else if (p < I && x < w && x < I) continue;
      if (!(i == a || i == l || s == a || s == l) && (M = eo(
        f,
        p,
        h,
        x,
        c,
        w,
        u,
        I
      ), M && (g = [i, s], b = [a, l], r(Bn(M, g, b, t, n)) || M.length == 4 && r(Bn(M.slice(2), g, b, t, n)))))
        return !0;
    }
    d += 2;
  }
  return !1;
}
function eo(e, t, n, r, o, i, s, a) {
  const l = no(e, t, n, r, o, i, s, a);
  let f = null;
  return l && (f = ro(e, t, n, r, o, i, s, a), f ? lo(e, t, n, r, o, i, s, a) && (f = null) : f = co(e, t, n, r, o, i, s, a)), f;
}
function no(e, t, n, r, o, i, s, a) {
  return re(e, t, n, r, o, i) * re(e, t, n, r, s, a) <= 0 && re(o, i, s, a, e, t) * re(o, i, s, a, n, r) <= 0;
}
function re(e, t, n, r, o, i) {
  return Zn(e - o, t - i, n - o, r - i);
}
function Zn(e, t, n, r) {
  return e * r - t * n;
}
function ro(e, t, n, r, o, i, s, a) {
  let l = xe(e, t, n, r, o, i, s, a), f;
  return l && (f = oo(l[0], l[1], e, t, n, r, o, i, s, a), f == 1 ? l = xe(n, r, e, t, o, i, s, a) : f == 2 ? l = xe(o, i, s, a, e, t, n, r) : f == 3 && (l = xe(s, a, o, i, e, t, n, r))), l && ao(l, e, t, n, r, o, i, s, a), l;
}
function xe(e, t, n, r, o, i, s, a) {
  const l = Zn(n - e, r - t, s - o, a - i), f = 1e-18;
  let h;
  if (l === 0) return null;
  const c = re(o, i, s, a, e, t) / l;
  return l <= f && l >= -f ? h = io(e, t, n, r, o, i, s, a) : h = [e + c * (n - e), t + c * (r - t)], h;
}
function io(e, t, n, r, o, i, s, a) {
  let l = null;
  return !Pt(e, o, s) && !Pt(t, i, a) ? l = [e, t] : !Pt(n, o, s) && !Pt(r, i, a) ? l = [n, r] : !Pt(o, e, n) && !Pt(i, t, r) ? l = [o, i] : !Pt(s, e, n) && !Pt(a, t, r) && (l = [s, a]), l;
}
function Pt(e, t, n) {
  let r;
  return t < n ? r = e < t || e > n : t > n ? r = e > t || e < n : r = e != t, r;
}
function oo(e, t, ...n) {
  let r = -1, o = 1 / 0, i;
  for (let s = 0, a = 0, l = n.length; a < l; s++, a += 2)
    i = so(e, t, n[a], n[a + 1]), i < o && (o = i, r = s);
  return r;
}
function so(e, t, n, r) {
  const o = e - n, i = t - r;
  return o * o + i * i;
}
function ao(e, t, n, r, o, i, s, a, l) {
  let f = e[0], h = e[1];
  f = _e(f, t, r), f = _e(f, i, a), h = _e(h, n, o), h = _e(h, s, l), e[0] = f, e[1] = h;
}
function _e(e, t, n) {
  let r;
  return Pt(e, t, n) && (r = Math.abs(e - t) < Math.abs(e - n) ? t : n, e = r), e;
}
function co(e, t, n, r, o, i, s, a) {
  const l = Math.min(e, n, o, s), f = Math.max(e, n, o, s), h = Math.min(t, r, i, a), c = Math.max(t, r, i, a), u = c - h > f - l;
  let p = [];
  return (u ? Dt(t, h, c) : Dt(e, l, f)) && p.push(e, t), (u ? Dt(r, h, c) : Dt(n, l, f)) && p.push(n, r), (u ? Dt(i, h, c) : Dt(o, l, f)) && p.push(o, i), (u ? Dt(a, h, c) : Dt(s, l, f)) && p.push(s, a), (p.length != 2 && p.length != 4 || p.length == 4 && p[0] == p[2] && p[1] == p[3]) && (p = null), p;
}
function lo(e, t, n, r, o, i, s, a) {
  return e == o && t == i || e == s && t == a || n == o && r == i || n == s && r == a;
}
function Dt(e, t, n) {
  return e > t && e < n;
}
function fo(e, t) {
  ho(e, t), tr(e, t, 0, t.length - 2);
}
function ho(e, t) {
  for (let n = 0, r = t.length; n < r; n += 2)
    e[t[n]] > e[t[n + 1]] && uo(t, n, n + 1);
}
function uo(e, t, n) {
  const r = e[t];
  e[t] = e[n], e[n] = r;
}
function tr(e, t, n, r) {
  let o = n, i = r, s, a;
  for (; o < r; ) {
    for (s = e[t[n + r >> 2 << 1]]; o <= i; ) {
      for (; e[t[o]] < s; ) o += 2;
      for (; e[t[i]] > s; ) i -= 2;
      o <= i && (a = t[o], t[o] = t[i], t[i] = a, a = t[o + 1], t[o + 1] = t[i + 1], t[i + 1] = a, o += 2, i -= 2);
    }
    if (i - n < 40 ? Tn(e, t, n, i) : tr(e, t, n, i), r - o < 40) {
      Tn(e, t, o, r);
      return;
    }
    n = o, i = r;
  }
}
function Tn(e, t, n, r) {
  let o, i;
  for (let s = n + 2; s <= r; s += 2) {
    o = t[s], i = t[s + 1];
    let a;
    for (a = s - 2; a >= n && e[o] < e[t[a]]; a -= 2)
      t[a + 2] = t[a], t[a + 3] = t[a + 1];
    t[a + 2] = o, t[a + 3] = i;
  }
}
function Bn(e, t, n, r, o) {
  const i = e[0], s = e[1];
  t = Cn(i, s, t[0], t[1], r, o), n = Cn(i, s, n[0], n[1], r, o);
  const a = t[0] < n[0] ? t : n, l = a == t ? n : t;
  return { x: i, y: s, a, b: l };
}
function Cn(e, t, n, r, o, i) {
  let s = n < r ? n : r, a = s === n ? r : n;
  return o[s] == e && i[s] == t ? a = s : o[a] == e && i[a] == t && (s = a), [s, a];
}
function po(e) {
  return `${e.a.join(",")};${e.b.join(",")}`;
}
class mo {
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
function go(e, t, n, r) {
  let o = n | 0;
  const i = isNaN(r) ? e.length - o : r + o;
  let s, a, l, f, h, c;
  if (i > 0)
    l = h = e[o], f = c = t[o];
  else return [void 0, void 0, void 0, void 0];
  for (o++; o < i; o++)
    s = e[o], a = t[o], s < l && (l = s), s > h && (h = s), a < f && (f = a), a > c && (c = a);
  return [l, f, h, c];
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
  setBounds(t, n, r, o) {
    let i, s, a, l;
    if (arguments.length == 1)
      if (ae(t)) {
        const f = t;
        i = f[0], s = f[1], a = f[2], l = f[3];
      } else {
        const f = t;
        i = f.xmin, s = f.ymin, a = f.xmax, l = f.ymax;
      }
    else
      i = t, s = n, a = r, l = o;
    return this.xmin = i, this.ymin = s, this.xmax = a, this.ymax = l, (i > a || s > l) && this.update(), this;
  }
  update() {
    let t;
    this.xmin > this.xmax && (t = this.xmin, this.xmin = this.xmax, this.xmax = t), this.ymin > this.ymax && (t = this.ymin, this.ymin = this.ymax, this.ymax = t);
  }
  mergeBounds(t, ...n) {
    let r, o, i, s;
    return t instanceof ce ? (r = t.xmin, o = t.ymin, i = t.xmax, s = t.ymax) : n.length == 3 ? (r = t, o = n[0], i = n[1], s = n[2]) : t.length == 4 ? (r = t[0], o = t[1], i = t[2], s = t[3]) : qt("Bounds#mergeBounds() invalid argument:", t), this.xmin === void 0 ? this.setBounds(r, o, i, s) : (r < this.xmin && (this.xmin = r), o < this.ymin && (this.ymin = o), i > this.xmax && (this.xmax = i), s > this.ymax && (this.ymax = s)), this;
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
    (n) => n.map((r) => t[r]).sort().join("-")
  ).sort();
}
function er(e, t, n) {
  const r = Ae(t.forw), o = Ae(t.bakw);
  if (JSON.stringify(r) != JSON.stringify(o))
    throw `${JSON.stringify(t, null, 2)}
${JSON.stringify(
      r
    )}
${JSON.stringify(o)}`;
  for (let i = 0; i < r.length; i++) {
    const s = r[i];
    e[s] || (e[s] = []), e[s].push(t);
  }
  n && (n.forw.features.push(t.forw), n.bakw.features.push(t.bakw));
}
function Xn(e, t, n) {
  const r = Ae(t.forw), o = Ae(t.bakw);
  if (JSON.stringify(r) != JSON.stringify(o))
    throw `${JSON.stringify(t, null, 2)}
${JSON.stringify(r)}
${JSON.stringify(o)}`;
  if (r.forEach((i) => {
    const s = e[i];
    if (!s) return;
    const a = s.filter((l) => l !== t);
    a.length === 0 ? delete e[i] : e[i] = a;
  }), n) {
    const i = (s, a) => {
      !s || !a || (s.features = s.features.filter((l) => l !== a));
    };
    i(n.forw, t.forw), i(n.bakw, t.bakw);
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
function Fn(e, t) {
  const n = e.length, r = t.geometry.coordinates;
  return Array.from({ length: n }, (o, i) => i).map((o) => {
    const i = (o + 1) % n, s = e[o], a = e[i], l = s.geometry.coordinates, f = Math.atan2(
      l[0] - r[0],
      l[1] - r[1]
    ), h = [t, s, a, t].map(
      (p) => p.geometry.coordinates
    ), c = {
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
    }, u = Et([
      le([h], c)
    ]);
    return [f, u];
  }).reduce(
    (o, i) => (o[0].push(i[0]), o[1].push(i[1]), o),
    [[], []]
  );
}
function Ee(e, t = 1e-6) {
  const [n, r] = e[0], [o, i] = e[1], [s, a] = e[2];
  return Math.abs((o - n) * (a - r) - (s - n) * (i - r)) < t;
}
function wo(e, t) {
  const n = /* @__PURE__ */ new Set();
  return e.forEach((r) => {
    if (r.length !== 2) return;
    const o = r.map((i) => `${t?.[i] ?? i}`);
    n.add(o.sort().join("-"));
  }), n;
}
function ie(e) {
  return ["a", "b", "c"].map((t, n) => ({
    prop: e.properties[t],
    geom: e.geometry.coordinates[0][n]
  }));
}
const yo = 10;
function vo(e, t, n, r, o, i) {
  if (!e && !t) return !1;
  const s = e ? 0 : 1, a = 1 - s, l = n[s], f = n[a];
  if (!l || !f) return !1;
  const h = _t(f.geom);
  let c = !1, u = !1;
  for (let p = 0; p <= 1; p++) {
    const x = r[p];
    if (!x) continue;
    const w = [String(x.prop.index), String(l.prop.index)].sort().join("-"), I = o[w];
    if (!I || I.length < 2) continue;
    const M = I.find(
      (P) => P.bakw !== i[s].bakw
    );
    if (!M) continue;
    const b = ie(M.bakw).find(
      (P) => String(P.prop.index) !== String(x.prop.index) && String(P.prop.index) !== String(l.prop.index)
    );
    if (!b) continue;
    c = !0;
    const d = _t(b.geom), y = _t(x.geom), m = _t(l.geom), S = m[0] - y[0], E = m[1] - y[1], k = S * (h[1] - y[1]) - E * (h[0] - y[0]), N = S * (d[1] - y[1]) - E * (d[0] - y[0]);
    if (k * N > 0) {
      u = !0;
      break;
    }
  }
  return c && !u;
}
function bo(e, t, n, r) {
  if (!e && !t) return !1;
  if (n[0] && n[1] && r[0] && r[1]) {
    const o = r.map((h) => _t(h.geom)), i = n.map((h) => _t(h.geom)), s = o[1][0] - o[0][0], a = o[1][1] - o[0][1], l = s * (i[0][1] - o[0][1]) - a * (i[0][0] - o[0][0]), f = s * (i[1][1] - o[0][1]) - a * (i[1][0] - o[0][0]);
    return l * f < 0;
  }
  return !1;
}
function xo(e, t, n, r) {
  const o = wo(n, r), i = /* @__PURE__ */ new Set();
  let s = !1;
  for (let a = 0; a < yo; a++) {
    let l = !1;
    for (const f of Object.keys(t)) {
      if (i.has(f)) continue;
      i.add(f);
      const h = t[f];
      if (!h || h.length < 2) continue;
      const c = f.split("-");
      if (c.length !== 2 || o.has(f)) continue;
      const u = ie(h[0].bakw), p = ie(h[1].bakw), x = ie(h[0].forw), w = ie(h[1].forw), I = c.map(
        (_) => u.find((B) => `${B.prop.index}` === _) || p.find((B) => `${B.prop.index}` === _)
      ), M = c.map(
        (_) => x.find((B) => `${B.prop.index}` === _) || w.find((B) => `${B.prop.index}` === _)
      );
      if (I.some((_) => !_) || M.some((_) => !_))
        continue;
      const g = [u, p].map(
        (_) => _.find((B) => !c.includes(`${B.prop.index}`))
      ), b = [x, w].map(
        (_) => _.find((B) => !c.includes(`${B.prop.index}`))
      );
      if (g.some((_) => !_) || b.some((_) => !_))
        continue;
      const d = h[0].bakw.geometry.coordinates[0].slice(0, 3).map((_) => _t(_)), y = h[1].bakw.geometry.coordinates[0].slice(0, 3).map((_) => _t(_)), m = h[0].forw.geometry.coordinates[0].slice(0, 3).map((_) => _t(_)), S = h[1].forw.geometry.coordinates[0].slice(0, 3).map((_) => _t(_)), E = Ee(d), k = Ee(y), N = Ee(m), P = Ee(S), C = vo(
        E,
        k,
        g,
        I,
        t,
        h
      ), R = bo(
        N,
        P,
        g,
        I
      );
      if (!(C || R || $n(
        _t(g[0].geom),
        y
      ) || $n(
        _t(g[1].geom),
        d
      )))
        continue;
      const O = M.map(
        (_) => _t(_.geom)
      ), A = b.map(
        (_) => _t(_.geom)
      ), T = _o([
        ...O,
        ...A
      ]), X = Mo(T), $ = Rn(
        O[0],
        O[1],
        A[0]
      ) + Rn(
        O[0],
        O[1],
        A[1]
      );
      qe(X, $) && (Xn(t, h[0], e), Xn(t, h[1], e), I.forEach((_) => {
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
        }, D = le([B], F), L = Jn(D);
        er(t, {
          forw: L,
          bakw: D
        }, e);
      }), l = !0, s = !0);
    }
    if (!l) break;
  }
  return s;
}
function _t(e) {
  return [e[0], e[1]];
}
function $n(e, t) {
  const [n, r] = t[0], [o, i] = t[1], [s, a] = t[2], l = s - n, f = a - r, h = o - n, c = i - r, u = e[0] - n, p = e[1] - r, x = l * l + f * f, w = l * h + f * c, I = l * u + f * p, M = h * h + c * c, g = h * u + c * p, b = x * M - w * w;
  if (b === 0) return !1;
  const d = 1 / b, y = (M * I - w * g) * d, m = (x * g - w * I) * d, S = 1e-9;
  return y >= -S && m >= -S && y + m <= 1 + S;
}
function _o(e) {
  const t = e.map((s) => s.slice()).filter(
    (s, a, l) => l.findIndex(
      (f) => qe(f[0], s[0]) && qe(f[1], s[1])
    ) === a
  );
  if (t.length <= 1) return t;
  const n = t.sort(
    (s, a) => s[0] === a[0] ? s[1] - a[1] : s[0] - a[0]
  ), r = (s, a, l) => (a[0] - s[0]) * (l[1] - s[1]) - (a[1] - s[1]) * (l[0] - s[0]), o = [];
  for (const s of n) {
    for (; o.length >= 2 && r(
      o[o.length - 2],
      o[o.length - 1],
      s
    ) <= 0; )
      o.pop();
    o.push(s);
  }
  const i = [];
  for (let s = n.length - 1; s >= 0; s--) {
    const a = n[s];
    for (; i.length >= 2 && r(
      i[i.length - 2],
      i[i.length - 1],
      a
    ) <= 0; )
      i.pop();
    i.push(a);
  }
  return i.pop(), o.pop(), o.concat(i);
}
function Mo(e) {
  if (e.length < 3) return 0;
  let t = 0;
  for (let n = 0; n < e.length; n++) {
    const [r, o] = e[n], [i, s] = e[(n + 1) % e.length];
    t += r * s - i * o;
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
const Dn = 2.00704, Yn = 3.00001;
class lt extends St {
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
    return this.useV2Algorithm ? Dn : Yn;
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
    this.edges = Gn(t), this.edgeNodes = void 0, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 境界ポリゴンを設定します
   */
  setBounds(t) {
    this.bounds = t;
    let n = t[0][0], r = n, o = t[0][1], i = o;
    const s = [t[0]];
    for (let a = 1; a < t.length; a++) {
      const l = t[a];
      l[0] < n && (n = l[0]), l[0] > r && (r = l[0]), l[1] < o && (o = l[1]), l[1] > i && (i = l[1]), s.push(l);
    }
    s.push(t[0]), this.boundsPolygon = le([s]), this.xy = [n, o], this.wh = [r - n, i - o], this.vertexMode = lt.VERTEX_PLAIN, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 現在の設定を永続化可能な形式にコンパイルします
   */
  getCompiled() {
    const t = {};
    t.version = this.useV2Algorithm ? Dn : Yn, t.points = this.points, t.weight_buffer = {}, t.centroid_point = [
      this.centroid.forw.geometry.coordinates,
      this.centroid.forw.properties.target.geom
    ], t.vertices_params = [
      this.vertices_params.forw[0],
      this.vertices_params.bakw[0]
    ], t.vertices_points = [];
    const n = this.vertices_params.forw[1];
    if (n)
      for (let r = 0; r < n.length; r++) {
        const o = n[r].features[0], i = o.geometry.coordinates[0][1], s = o.properties.b.geom;
        t.vertices_points[r] = [i, s];
      }
    return t.strict_status = this.strict_status, t.tins_points = [[]], this.tins.forw.features.map((r) => {
      t.tins_points[0].push(
        ["a", "b", "c"].map(
          (o) => r.properties[o].index
        )
      );
    }), this.strict_status === lt.STATUS_LOOSE ? (t.tins_points[1] = [], this.tins.bakw.features.map((r) => {
      t.tins_points[1].push(
        ["a", "b", "c"].map(
          (o) => r.properties[o].index
        )
      );
    })) : this.strict_status === lt.STATUS_ERROR && this.kinks?.bakw && (t.kinks_points = this.kinks.bakw.features.map(
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
  calculateStrictTin(t = Pn) {
    const n = this.tins.forw.features.map(
      (s) => Jn(s)
    );
    this.tins.bakw = Et(n);
    const r = {};
    this.tins.forw.features.forEach((s, a) => {
      const l = this.tins.bakw.features[a];
      er(r, { forw: s, bakw: l });
    });
    const o = (this.pointsSet?.forw.features ?? []).map(
      (s) => s.properties.target.index
    );
    xo(
      this.tins,
      r,
      this.pointsSet?.edges || [],
      o
    );
    const i = ["forw", "bakw"].map((s) => {
      const a = this.tins[s].features.map(
        (l) => l.geometry.coordinates[0]
      );
      return Wn(a, t);
    });
    i[0].length === 0 && i[1].length === 0 ? (this.strict_status = lt.STATUS_STRICT, delete this.kinks) : (this.strict_status = lt.STATUS_ERROR, this.kinks = {
      forw: Et(i[0]),
      bakw: Et(i[1])
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
      const i = this.points[o][0], s = this.points[o][1], a = Me(i, s, o);
      t.forw.push(a), t.bakw.push(Se(a));
    }
    const n = [];
    let r = 0;
    this.edgeNodes = [], this.edges || (this.edges = []);
    for (let o = 0; o < this.edges.length; o++) {
      const i = this.edges[o][2], s = Object.assign([], this.edges[o][0]), a = Object.assign([], this.edges[o][1]);
      if (So(i, this.points.length, o), s.length === 0 && a.length === 0) {
        n.push(i);
        continue;
      }
      s.unshift(this.points[i[0]][0]), s.push(this.points[i[1]][0]), a.unshift(this.points[i[0]][1]), a.push(this.points[i[1]][1]), Fi(s, a).map((l, f, h) => {
        this.edgeNodes[r] = [
          l[0],
          l[1]
        ];
        const c = Me(
          l[0],
          l[1],
          `e${r}`
        );
        r++, t.forw.push(c), t.bakw.push(Se(c)), f === 0 ? n.push([i[0], t.forw.length - 1]) : n.push([
          t.forw.length - 2,
          t.forw.length - 1
        ]), f === h.length - 1 && n.push([t.forw.length - 1, i[1]]);
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
    const t = this.xy[0] - 0.05 * this.wh[0], n = this.xy[0] + 1.05 * this.wh[0], r = this.xy[1] - 0.05 * this.wh[1], o = this.xy[1] + 1.05 * this.wh[1];
    if (this.bounds && !this.boundsPolygon) throw new Error("Internal error: bounds is set but boundsPolygon is missing");
    const i = this.bounds ? this.boundsPolygon : void 0;
    if (!this.points.reduce((l, f) => l && (i ? Fe(f[0], i) : f[0][0] >= t && f[0][0] <= n && f[0][1] >= r && f[0][1] <= o), !0))
      throw "SOME POINTS OUTSIDE";
    let a = [];
    return this.wh && (a = [[t, r], [n, r], [t, o], [n, o]]), {
      pointsSet: this.generatePointsSet(),
      bbox: a,
      minx: t,
      maxx: n,
      miny: r,
      maxy: o
    };
  }
  /**
   * Compute a bounding box derived from GCP coordinates with a 5% margin.
   * Used in V3 plain mode where no explicit image bounds are available.
   */
  computeGcpBbox() {
    let t = 1 / 0, n = -1 / 0, r = 1 / 0, o = -1 / 0;
    for (const a of this.points) {
      const l = a[0][0], f = a[0][1];
      l < t && (t = l), l > n && (n = l), f < r && (r = f), f > o && (o = f);
    }
    const i = n - t, s = o - r;
    return {
      minx: t - 0.05 * i,
      maxx: n + 0.05 * i,
      miny: r - 0.05 * s,
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
    let r, o, i, s, a;
    if (n) {
      if (this.bounds) {
        const E = this.boundsPolygon;
        if (!E) throw new Error("Internal error: bounds is set but boundsPolygon is missing");
        if (!this.points.every(
          (N) => Fe(N[0], E)
        )) throw "SOME POINTS OUTSIDE";
      }
      r = this.generatePointsSet(), { minx: o, maxx: i, miny: s, maxy: a } = this.computeGcpBbox();
    } else {
      const E = this.validateAndPrepareInputs();
      r = E.pointsSet, o = E.minx, i = E.maxx, s = E.miny, a = E.maxy;
    }
    const l = {
      forw: Et(r.forw),
      bakw: Et(r.bakw)
    }, f = be(
      l.forw,
      r.edges,
      "target"
    ), h = be(
      l.bakw,
      r.edges,
      "target"
    );
    if (f.features.length === 0 || h.features.length === 0)
      throw "TOO LINEAR1";
    const c = Fr(l.forw), u = mn(l.forw);
    if (!u) throw "TOO LINEAR2";
    const p = {}, x = u.geometry.coordinates[0];
    let w;
    try {
      w = x.map((E) => ({
        forw: E,
        bakw: ne(Yt(E), f)
      })), w.forEach((E) => {
        p[`${E.forw[0]}:${E.forw[1]}`] = E;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const I = mn(l.bakw);
    if (!I) throw "TOO LINEAR2";
    const M = I.geometry.coordinates[0];
    try {
      w = M.map((E) => ({
        bakw: E,
        forw: ne(Yt(E), h)
      })), w.forEach((E) => {
        p[`${E.forw[0]}:${E.forw[1]}`] = E;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    let g;
    if (n) {
      const E = c.geometry.coordinates, k = f.features.find(
        (N) => Fe(
          Yt(E),
          N
        )
      );
      if (k) {
        const N = k.geometry.coordinates[0], P = k.properties.a.geom, C = k.properties.b.geom, R = k.properties.c.geom;
        g = {
          forw: [
            (N[0][0] + N[1][0] + N[2][0]) / 3,
            (N[0][1] + N[1][1] + N[2][1]) / 3
          ],
          bakw: [
            (P[0] + C[0] + R[0]) / 3,
            (P[1] + C[1] + R[1]) / 3
          ]
        };
      } else
        g = {
          forw: E,
          bakw: ne(c, f)
        };
    } else
      g = {
        forw: c.geometry.coordinates,
        bakw: ne(c, f)
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
      maxx: i,
      miny: s,
      maxy: a
    }, m = this.vertexMode === lt.VERTEX_BIRDEYE ? qi(y, n) : Ui(y, n), S = {
      forw: [],
      bakw: []
    };
    for (let E = 0; E < m.length; E++) {
      const k = m[E].forw, N = m[E].bakw, P = Me(k, N, `b${E}`), C = Se(P);
      r.forw.push(P), r.bakw.push(C), S.forw.push(P), S.bakw.push(C);
    }
    this.pointsSet = {
      forw: Et(r.forw),
      bakw: Et(r.bakw),
      edges: r.edges
    }, this.tins = {
      forw: Mn(
        be(
          this.pointsSet.forw,
          r.edges,
          "target"
        )
      )
    }, (t === lt.MODE_STRICT || t === lt.MODE_AUTO) && this.calculateStrictTin(
      t === lt.MODE_AUTO ? 1 : Pn
    ), (t === lt.MODE_LOOSE || t === lt.MODE_AUTO && this.strict_status === lt.STATUS_ERROR) && (this.tins.bakw = Mn(
      be(
        this.pointsSet.bakw,
        r.edges,
        "target"
      )
    ), delete this.kinks, this.strict_status = lt.STATUS_LOOSE), this.vertices_params = {
      forw: Fn(S.forw, this.centroid.forw),
      bakw: Fn(S.bakw, this.centroid.bakw)
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
function So(e, t, n) {
  const r = (o) => Number.isInteger(o) && o >= 0 && o < t;
  if (!Array.isArray(e) || !r(e[0]) || !r(e[1]))
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
  Eo as findIntersections,
  Dn as format_version,
  er as insertSearchIndex,
  Fn as vertexCalc
};
