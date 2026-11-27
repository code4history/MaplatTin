import { counterTri as Cn, Transform as Jn, validateWorldFile as Qn, normalizeEdges as Zn, transformArr as Se, rotateVerticesTriangle as Ue, worldFileToCrs as ti } from "@maplat/transform";
function ee(r, t, e = {}) {
  const n = { type: "Feature" };
  return (e.id === 0 || e.id) && (n.id = e.id), e.bbox && (n.bbox = e.bbox), n.properties = t || {}, n.geometry = r, n;
}
function Yt(r, t, e = {}) {
  if (!r)
    throw new Error("coordinates is required");
  if (!Array.isArray(r))
    throw new Error("coordinates must be an Array");
  if (r.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!ze(r[0]) || !ze(r[1]))
    throw new Error("coordinates must contain numbers");
  return ee({
    type: "Point",
    coordinates: r
  }, t, e);
}
function re(r, t, e = {}) {
  for (const s of r) {
    if (s.length < 4)
      throw new Error(
        "Each LinearRing of a Polygon must have 4 or more Positions."
      );
    if (s[s.length - 1].length !== s[0].length)
      throw new Error("First and last Position are not equivalent.");
    for (let o = 0; o < s[s.length - 1].length; o++)
      if (s[s.length - 1][o] !== s[0][o])
        throw new Error("First and last Position are not equivalent.");
  }
  return ee({
    type: "Polygon",
    coordinates: r
  }, t, e);
}
function Ve(r, t, e = {}) {
  if (r.length < 2)
    throw new Error("coordinates must be an array of two or more positions");
  return ee({
    type: "LineString",
    coordinates: r
  }, t, e);
}
function Mt(r, t = {}) {
  const e = { type: "FeatureCollection" };
  return t.id && (e.id = t.id), t.bbox && (e.bbox = t.bbox), e.features = r, e;
}
function ze(r) {
  return !isNaN(r) && r !== null && !Array.isArray(r);
}
function ei(r) {
  if (!r)
    throw new Error("coord is required");
  if (!Array.isArray(r)) {
    if (r.type === "Feature" && r.geometry !== null && r.geometry.type === "Point")
      return [...r.geometry.coordinates];
    if (r.type === "Point")
      return [...r.coordinates];
  }
  if (Array.isArray(r) && r.length >= 2 && !Array.isArray(r[0]) && !Array.isArray(r[1]))
    return [...r];
  throw new Error("coord must be GeoJSON Point or an Array of numbers");
}
function ni(r) {
  return r.type === "Feature" ? r.geometry : r;
}
function $e(r, t, e) {
  if (r !== null)
    for (var n, s, o, i, a, c, l, u = 0, f = 0, d, b = r.type, v = b === "FeatureCollection", p = b === "Feature", S = v ? r.features.length : 1, I = 0; I < S; I++) {
      l = v ? (
        // @ts-expect-error: Known type conflict
        r.features[I].geometry
      ) : p ? (
        // @ts-expect-error: Known type conflict
        r.geometry
      ) : r, d = l ? l.type === "GeometryCollection" : !1, a = d ? l.geometries.length : 1;
      for (var g = 0; g < a; g++) {
        var m = 0, h = 0;
        if (i = d ? l.geometries[g] : l, i !== null) {
          c = i.coordinates;
          var w = i.type;
          switch (u = e && (w === "Polygon" || w === "MultiPolygon") ? 1 : 0, w) {
            case null:
              break;
            case "Point":
              if (
                // @ts-expect-error: Known type conflict
                t(
                  c,
                  f,
                  I,
                  m,
                  h
                ) === !1
              )
                return !1;
              f++, m++;
              break;
            case "LineString":
            case "MultiPoint":
              for (n = 0; n < c.length; n++) {
                if (
                  // @ts-expect-error: Known type conflict
                  t(
                    c[n],
                    f,
                    I,
                    m,
                    h
                  ) === !1
                )
                  return !1;
                f++, w === "MultiPoint" && m++;
              }
              w === "LineString" && m++;
              break;
            case "Polygon":
            case "MultiLineString":
              for (n = 0; n < c.length; n++) {
                for (s = 0; s < c[n].length - u; s++) {
                  if (
                    // @ts-expect-error: Known type conflict
                    t(
                      c[n][s],
                      f,
                      I,
                      m,
                      h
                    ) === !1
                  )
                    return !1;
                  f++;
                }
                w === "MultiLineString" && m++, w === "Polygon" && h++;
              }
              w === "Polygon" && m++;
              break;
            case "MultiPolygon":
              for (n = 0; n < c.length; n++) {
                for (h = 0, s = 0; s < c[n].length; s++) {
                  for (o = 0; o < c[n][s].length - u; o++) {
                    if (
                      // @ts-expect-error: Known type conflict
                      t(
                        c[n][s][o],
                        f,
                        I,
                        m,
                        h
                      ) === !1
                    )
                      return !1;
                    f++;
                  }
                  h++;
                }
                m++;
              }
              break;
            case "GeometryCollection":
              for (n = 0; n < i.geometries.length; n++)
                if (
                  // @ts-expect-error: Known type conflict
                  $e(i.geometries[n], t, e) === !1
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
const pt = 11102230246251565e-32, V = 134217729, Pn = (3 + 8 * pt) * pt;
function ht(r, t, e, n, s) {
  let o, i, a, c, l = t[0], u = n[0], f = 0, d = 0;
  u > l == u > -l ? (o = l, l = t[++f]) : (o = u, u = n[++d]);
  let b = 0;
  if (f < r && d < e)
    for (u > l == u > -l ? (i = l + o, a = o - (i - l), l = t[++f]) : (i = u + o, a = o - (i - u), u = n[++d]), o = i, a !== 0 && (s[b++] = a); f < r && d < e; )
      u > l == u > -l ? (i = o + l, c = i - o, a = o - (i - c) + (l - c), l = t[++f]) : (i = o + u, c = i - o, a = o - (i - c) + (u - c), u = n[++d]), o = i, a !== 0 && (s[b++] = a);
  for (; f < r; )
    i = o + l, c = i - o, a = o - (i - c) + (l - c), l = t[++f], o = i, a !== 0 && (s[b++] = a);
  for (; d < e; )
    i = o + u, c = i - o, a = o - (i - c) + (u - c), u = n[++d], o = i, a !== 0 && (s[b++] = a);
  return (o !== 0 || b === 0) && (s[b++] = o), b;
}
function St(r, t, e, n, s, o, i, a) {
  return ht(ht(r, t, e, n, i), i, s, o, a);
}
function Y(r, t, e, n) {
  let s, o, i, a, c, l, u, f, d, b, v;
  u = V * e, b = u - (u - e), v = e - b;
  let p = t[0];
  s = p * e, u = V * p, f = u - (u - p), d = p - f, i = d * v - (s - f * b - d * b - f * v);
  let S = 0;
  i !== 0 && (n[S++] = i);
  for (let I = 1; I < r; I++)
    p = t[I], a = p * e, u = V * p, f = u - (u - p), d = p - f, c = d * v - (a - f * b - d * b - f * v), o = s + c, l = o - s, i = s - (o - l) + (c - l), i !== 0 && (n[S++] = i), s = a + o, i = o - (s - a), i !== 0 && (n[S++] = i);
  return (s !== 0 || S === 0) && (n[S++] = s), S;
}
function Dn(r, t) {
  let e = t[0];
  for (let n = 1; n < r; n++) e += t[n];
  return e;
}
function tt(r) {
  return new Float64Array(r);
}
const ii = (3 + 16 * pt) * pt, ri = (2 + 12 * pt) * pt, si = (9 + 64 * pt) * pt * pt, qt = tt(4), He = tt(8), Ke = tt(12), We = tt(16), gt = tt(4);
function oi(r, t, e, n, s, o, i) {
  let a, c, l, u, f, d, b, v, p, S, I, g, m, h, w, y, E, k;
  const A = r - s, B = e - s, O = t - o, P = n - o;
  h = A * P, d = V * A, b = d - (d - A), v = A - b, d = V * P, p = d - (d - P), S = P - p, w = v * S - (h - b * p - v * p - b * S), y = O * B, d = V * O, b = d - (d - O), v = O - b, d = V * B, p = d - (d - B), S = B - p, E = v * S - (y - b * p - v * p - b * S), I = w - E, f = w - I, qt[0] = w - (I + f) + (f - E), g = h + I, f = g - h, m = h - (g - f) + (I - f), I = m - y, f = m - I, qt[1] = m - (I + f) + (f - y), k = g + I, f = k - g, qt[2] = g - (k - f) + (I - f), qt[3] = k;
  let $ = Dn(4, qt), M = ri * i;
  if ($ >= M || -$ >= M || (f = r - A, a = r - (A + f) + (f - s), f = e - B, l = e - (B + f) + (f - s), f = t - O, c = t - (O + f) + (f - o), f = n - P, u = n - (P + f) + (f - o), a === 0 && c === 0 && l === 0 && u === 0) || (M = si * i + Pn * Math.abs($), $ += A * u + P * a - (O * l + B * c), $ >= M || -$ >= M)) return $;
  h = a * P, d = V * a, b = d - (d - a), v = a - b, d = V * P, p = d - (d - P), S = P - p, w = v * S - (h - b * p - v * p - b * S), y = c * B, d = V * c, b = d - (d - c), v = c - b, d = V * B, p = d - (d - B), S = B - p, E = v * S - (y - b * p - v * p - b * S), I = w - E, f = w - I, gt[0] = w - (I + f) + (f - E), g = h + I, f = g - h, m = h - (g - f) + (I - f), I = m - y, f = m - I, gt[1] = m - (I + f) + (f - y), k = g + I, f = k - g, gt[2] = g - (k - f) + (I - f), gt[3] = k;
  const T = ht(4, qt, 4, gt, He);
  h = A * u, d = V * A, b = d - (d - A), v = A - b, d = V * u, p = d - (d - u), S = u - p, w = v * S - (h - b * p - v * p - b * S), y = O * l, d = V * O, b = d - (d - O), v = O - b, d = V * l, p = d - (d - l), S = l - p, E = v * S - (y - b * p - v * p - b * S), I = w - E, f = w - I, gt[0] = w - (I + f) + (f - E), g = h + I, f = g - h, m = h - (g - f) + (I - f), I = m - y, f = m - I, gt[1] = m - (I + f) + (f - y), k = g + I, f = k - g, gt[2] = g - (k - f) + (I - f), gt[3] = k;
  const _ = ht(T, He, 4, gt, Ke);
  h = a * u, d = V * a, b = d - (d - a), v = a - b, d = V * u, p = d - (d - u), S = u - p, w = v * S - (h - b * p - v * p - b * S), y = c * l, d = V * c, b = d - (d - c), v = c - b, d = V * l, p = d - (d - l), S = l - p, E = v * S - (y - b * p - v * p - b * S), I = w - E, f = w - I, gt[0] = w - (I + f) + (f - E), g = h + I, f = g - h, m = h - (g - f) + (I - f), I = m - y, f = m - I, gt[1] = m - (I + f) + (f - y), k = g + I, f = k - g, gt[2] = g - (k - f) + (I - f), gt[3] = k;
  const N = ht(_, Ke, 4, gt, We);
  return We[N - 1];
}
function ft(r, t, e, n, s, o) {
  const i = (t - o) * (e - s), a = (r - s) * (n - o), c = i - a, l = Math.abs(i + a);
  return Math.abs(c) >= ii * l ? c : -oi(r, t, e, n, s, o, l);
}
const ai = (10 + 96 * pt) * pt, ci = (4 + 48 * pt) * pt, li = (44 + 576 * pt) * pt * pt, Ot = tt(4), Nt = tt(4), Ft = tt(4), _t = tt(4), Et = tt(4), kt = tt(4), mt = tt(4), wt = tt(4), _e = tt(8), Ee = tt(8), ke = tt(8), Ae = tt(8), Ie = tt(8), Be = tt(8), oe = tt(8), ae = tt(8), ce = tt(8), Rt = tt(4), $t = tt(4), Xt = tt(4), z = tt(8), W = tt(16), nt = tt(16), it = tt(16), et = tt(32), Ct = tt(32), ct = tt(48), vt = tt(64);
let Ht = tt(1152), Te = tt(1152);
function lt(r, t, e) {
  r = ht(r, Ht, t, e, Te);
  const n = Ht;
  return Ht = Te, Te = n, r;
}
function fi(r, t, e, n, s, o, i, a, c) {
  let l, u, f, d, b, v, p, S, I, g, m, h, w, y, E, k, A, B, O, P, $, M, T, _, N, C, D, x, F, R, X, q, L, U, j;
  const K = r - i, H = e - i, G = s - i, J = t - a, Z = n - a, Q = o - a;
  X = H * Q, T = V * H, _ = T - (T - H), N = H - _, T = V * Q, C = T - (T - Q), D = Q - C, q = N * D - (X - _ * C - N * C - _ * D), L = G * Z, T = V * G, _ = T - (T - G), N = G - _, T = V * Z, C = T - (T - Z), D = Z - C, U = N * D - (L - _ * C - N * C - _ * D), x = q - U, M = q - x, Ot[0] = q - (x + M) + (M - U), F = X + x, M = F - X, R = X - (F - M) + (x - M), x = R - L, M = R - x, Ot[1] = R - (x + M) + (M - L), j = F + x, M = j - F, Ot[2] = F - (j - M) + (x - M), Ot[3] = j, X = G * J, T = V * G, _ = T - (T - G), N = G - _, T = V * J, C = T - (T - J), D = J - C, q = N * D - (X - _ * C - N * C - _ * D), L = K * Q, T = V * K, _ = T - (T - K), N = K - _, T = V * Q, C = T - (T - Q), D = Q - C, U = N * D - (L - _ * C - N * C - _ * D), x = q - U, M = q - x, Nt[0] = q - (x + M) + (M - U), F = X + x, M = F - X, R = X - (F - M) + (x - M), x = R - L, M = R - x, Nt[1] = R - (x + M) + (M - L), j = F + x, M = j - F, Nt[2] = F - (j - M) + (x - M), Nt[3] = j, X = K * Z, T = V * K, _ = T - (T - K), N = K - _, T = V * Z, C = T - (T - Z), D = Z - C, q = N * D - (X - _ * C - N * C - _ * D), L = H * J, T = V * H, _ = T - (T - H), N = H - _, T = V * J, C = T - (T - J), D = J - C, U = N * D - (L - _ * C - N * C - _ * D), x = q - U, M = q - x, Ft[0] = q - (x + M) + (M - U), F = X + x, M = F - X, R = X - (F - M) + (x - M), x = R - L, M = R - x, Ft[1] = R - (x + M) + (M - L), j = F + x, M = j - F, Ft[2] = F - (j - M) + (x - M), Ft[3] = j, l = ht(
    ht(
      ht(
        Y(Y(4, Ot, K, z), z, K, W),
        W,
        Y(Y(4, Ot, J, z), z, J, nt),
        nt,
        et
      ),
      et,
      ht(
        Y(Y(4, Nt, H, z), z, H, W),
        W,
        Y(Y(4, Nt, Z, z), z, Z, nt),
        nt,
        Ct
      ),
      Ct,
      vt
    ),
    vt,
    ht(
      Y(Y(4, Ft, G, z), z, G, W),
      W,
      Y(Y(4, Ft, Q, z), z, Q, nt),
      nt,
      et
    ),
    et,
    Ht
  );
  let at = Dn(l, Ht), ut = ci * c;
  if (at >= ut || -at >= ut || (M = r - K, u = r - (K + M) + (M - i), M = t - J, b = t - (J + M) + (M - a), M = e - H, f = e - (H + M) + (M - i), M = n - Z, v = n - (Z + M) + (M - a), M = s - G, d = s - (G + M) + (M - i), M = o - Q, p = o - (Q + M) + (M - a), u === 0 && f === 0 && d === 0 && b === 0 && v === 0 && p === 0) || (ut = li * c + Pn * Math.abs(at), at += (K * K + J * J) * (H * p + Q * f - (Z * d + G * v)) + 2 * (K * u + J * b) * (H * Q - Z * G) + ((H * H + Z * Z) * (G * b + J * d - (Q * u + K * p)) + 2 * (H * f + Z * v) * (G * J - Q * K)) + ((G * G + Q * Q) * (K * v + Z * u - (J * f + H * b)) + 2 * (G * d + Q * p) * (K * Z - J * H)), at >= ut || -at >= ut))
    return at;
  if ((f !== 0 || v !== 0 || d !== 0 || p !== 0) && (X = K * K, T = V * K, _ = T - (T - K), N = K - _, q = N * N - (X - _ * _ - (_ + _) * N), L = J * J, T = V * J, _ = T - (T - J), N = J - _, U = N * N - (L - _ * _ - (_ + _) * N), x = q + U, M = x - q, _t[0] = q - (x - M) + (U - M), F = X + x, M = F - X, R = X - (F - M) + (x - M), x = R + L, M = x - R, _t[1] = R - (x - M) + (L - M), j = F + x, M = j - F, _t[2] = F - (j - M) + (x - M), _t[3] = j), (d !== 0 || p !== 0 || u !== 0 || b !== 0) && (X = H * H, T = V * H, _ = T - (T - H), N = H - _, q = N * N - (X - _ * _ - (_ + _) * N), L = Z * Z, T = V * Z, _ = T - (T - Z), N = Z - _, U = N * N - (L - _ * _ - (_ + _) * N), x = q + U, M = x - q, Et[0] = q - (x - M) + (U - M), F = X + x, M = F - X, R = X - (F - M) + (x - M), x = R + L, M = x - R, Et[1] = R - (x - M) + (L - M), j = F + x, M = j - F, Et[2] = F - (j - M) + (x - M), Et[3] = j), (u !== 0 || b !== 0 || f !== 0 || v !== 0) && (X = G * G, T = V * G, _ = T - (T - G), N = G - _, q = N * N - (X - _ * _ - (_ + _) * N), L = Q * Q, T = V * Q, _ = T - (T - Q), N = Q - _, U = N * N - (L - _ * _ - (_ + _) * N), x = q + U, M = x - q, kt[0] = q - (x - M) + (U - M), F = X + x, M = F - X, R = X - (F - M) + (x - M), x = R + L, M = x - R, kt[1] = R - (x - M) + (L - M), j = F + x, M = j - F, kt[2] = F - (j - M) + (x - M), kt[3] = j), u !== 0 && (S = Y(4, Ot, u, _e), l = lt(l, St(
    Y(S, _e, 2 * K, W),
    W,
    Y(Y(4, kt, u, z), z, Z, nt),
    nt,
    Y(Y(4, Et, u, z), z, -Q, it),
    it,
    et,
    ct
  ), ct)), b !== 0 && (I = Y(4, Ot, b, Ee), l = lt(l, St(
    Y(I, Ee, 2 * J, W),
    W,
    Y(Y(4, Et, b, z), z, G, nt),
    nt,
    Y(Y(4, kt, b, z), z, -H, it),
    it,
    et,
    ct
  ), ct)), f !== 0 && (g = Y(4, Nt, f, ke), l = lt(l, St(
    Y(g, ke, 2 * H, W),
    W,
    Y(Y(4, _t, f, z), z, Q, nt),
    nt,
    Y(Y(4, kt, f, z), z, -J, it),
    it,
    et,
    ct
  ), ct)), v !== 0 && (m = Y(4, Nt, v, Ae), l = lt(l, St(
    Y(m, Ae, 2 * Z, W),
    W,
    Y(Y(4, kt, v, z), z, K, nt),
    nt,
    Y(Y(4, _t, v, z), z, -G, it),
    it,
    et,
    ct
  ), ct)), d !== 0 && (h = Y(4, Ft, d, Ie), l = lt(l, St(
    Y(h, Ie, 2 * G, W),
    W,
    Y(Y(4, Et, d, z), z, J, nt),
    nt,
    Y(Y(4, _t, d, z), z, -Z, it),
    it,
    et,
    ct
  ), ct)), p !== 0 && (w = Y(4, Ft, p, Be), l = lt(l, St(
    Y(w, Be, 2 * Q, W),
    W,
    Y(Y(4, _t, p, z), z, H, nt),
    nt,
    Y(Y(4, Et, p, z), z, -K, it),
    it,
    et,
    ct
  ), ct)), u !== 0 || b !== 0) {
    if (f !== 0 || v !== 0 || d !== 0 || p !== 0 ? (X = f * Q, T = V * f, _ = T - (T - f), N = f - _, T = V * Q, C = T - (T - Q), D = Q - C, q = N * D - (X - _ * C - N * C - _ * D), L = H * p, T = V * H, _ = T - (T - H), N = H - _, T = V * p, C = T - (T - p), D = p - C, U = N * D - (L - _ * C - N * C - _ * D), x = q + U, M = x - q, mt[0] = q - (x - M) + (U - M), F = X + x, M = F - X, R = X - (F - M) + (x - M), x = R + L, M = x - R, mt[1] = R - (x - M) + (L - M), j = F + x, M = j - F, mt[2] = F - (j - M) + (x - M), mt[3] = j, X = d * -Z, T = V * d, _ = T - (T - d), N = d - _, T = V * -Z, C = T - (T - -Z), D = -Z - C, q = N * D - (X - _ * C - N * C - _ * D), L = G * -v, T = V * G, _ = T - (T - G), N = G - _, T = V * -v, C = T - (T - -v), D = -v - C, U = N * D - (L - _ * C - N * C - _ * D), x = q + U, M = x - q, wt[0] = q - (x - M) + (U - M), F = X + x, M = F - X, R = X - (F - M) + (x - M), x = R + L, M = x - R, wt[1] = R - (x - M) + (L - M), j = F + x, M = j - F, wt[2] = F - (j - M) + (x - M), wt[3] = j, E = ht(4, mt, 4, wt, ae), X = f * p, T = V * f, _ = T - (T - f), N = f - _, T = V * p, C = T - (T - p), D = p - C, q = N * D - (X - _ * C - N * C - _ * D), L = d * v, T = V * d, _ = T - (T - d), N = d - _, T = V * v, C = T - (T - v), D = v - C, U = N * D - (L - _ * C - N * C - _ * D), x = q - U, M = q - x, $t[0] = q - (x + M) + (M - U), F = X + x, M = F - X, R = X - (F - M) + (x - M), x = R - L, M = R - x, $t[1] = R - (x + M) + (M - L), j = F + x, M = j - F, $t[2] = F - (j - M) + (x - M), $t[3] = j, B = 4) : (ae[0] = 0, E = 1, $t[0] = 0, B = 1), u !== 0) {
      const st = Y(E, ae, u, it);
      l = lt(l, ht(
        Y(S, _e, u, W),
        W,
        Y(st, it, 2 * K, et),
        et,
        ct
      ), ct);
      const ot = Y(B, $t, u, z);
      l = lt(l, St(
        Y(ot, z, 2 * K, W),
        W,
        Y(ot, z, u, nt),
        nt,
        Y(st, it, u, et),
        et,
        Ct,
        vt
      ), vt), v !== 0 && (l = lt(l, Y(Y(4, kt, u, z), z, v, W), W)), p !== 0 && (l = lt(l, Y(Y(4, Et, -u, z), z, p, W), W));
    }
    if (b !== 0) {
      const st = Y(E, ae, b, it);
      l = lt(l, ht(
        Y(I, Ee, b, W),
        W,
        Y(st, it, 2 * J, et),
        et,
        ct
      ), ct);
      const ot = Y(B, $t, b, z);
      l = lt(l, St(
        Y(ot, z, 2 * J, W),
        W,
        Y(ot, z, b, nt),
        nt,
        Y(st, it, b, et),
        et,
        Ct,
        vt
      ), vt);
    }
  }
  if (f !== 0 || v !== 0) {
    if (d !== 0 || p !== 0 || u !== 0 || b !== 0 ? (X = d * J, T = V * d, _ = T - (T - d), N = d - _, T = V * J, C = T - (T - J), D = J - C, q = N * D - (X - _ * C - N * C - _ * D), L = G * b, T = V * G, _ = T - (T - G), N = G - _, T = V * b, C = T - (T - b), D = b - C, U = N * D - (L - _ * C - N * C - _ * D), x = q + U, M = x - q, mt[0] = q - (x - M) + (U - M), F = X + x, M = F - X, R = X - (F - M) + (x - M), x = R + L, M = x - R, mt[1] = R - (x - M) + (L - M), j = F + x, M = j - F, mt[2] = F - (j - M) + (x - M), mt[3] = j, P = -Q, $ = -p, X = u * P, T = V * u, _ = T - (T - u), N = u - _, T = V * P, C = T - (T - P), D = P - C, q = N * D - (X - _ * C - N * C - _ * D), L = K * $, T = V * K, _ = T - (T - K), N = K - _, T = V * $, C = T - (T - $), D = $ - C, U = N * D - (L - _ * C - N * C - _ * D), x = q + U, M = x - q, wt[0] = q - (x - M) + (U - M), F = X + x, M = F - X, R = X - (F - M) + (x - M), x = R + L, M = x - R, wt[1] = R - (x - M) + (L - M), j = F + x, M = j - F, wt[2] = F - (j - M) + (x - M), wt[3] = j, k = ht(4, mt, 4, wt, ce), X = d * b, T = V * d, _ = T - (T - d), N = d - _, T = V * b, C = T - (T - b), D = b - C, q = N * D - (X - _ * C - N * C - _ * D), L = u * p, T = V * u, _ = T - (T - u), N = u - _, T = V * p, C = T - (T - p), D = p - C, U = N * D - (L - _ * C - N * C - _ * D), x = q - U, M = q - x, Xt[0] = q - (x + M) + (M - U), F = X + x, M = F - X, R = X - (F - M) + (x - M), x = R - L, M = R - x, Xt[1] = R - (x + M) + (M - L), j = F + x, M = j - F, Xt[2] = F - (j - M) + (x - M), Xt[3] = j, O = 4) : (ce[0] = 0, k = 1, Xt[0] = 0, O = 1), f !== 0) {
      const st = Y(k, ce, f, it);
      l = lt(l, ht(
        Y(g, ke, f, W),
        W,
        Y(st, it, 2 * H, et),
        et,
        ct
      ), ct);
      const ot = Y(O, Xt, f, z);
      l = lt(l, St(
        Y(ot, z, 2 * H, W),
        W,
        Y(ot, z, f, nt),
        nt,
        Y(st, it, f, et),
        et,
        Ct,
        vt
      ), vt), p !== 0 && (l = lt(l, Y(Y(4, _t, f, z), z, p, W), W)), b !== 0 && (l = lt(l, Y(Y(4, kt, -f, z), z, b, W), W));
    }
    if (v !== 0) {
      const st = Y(k, ce, v, it);
      l = lt(l, ht(
        Y(m, Ae, v, W),
        W,
        Y(st, it, 2 * Z, et),
        et,
        ct
      ), ct);
      const ot = Y(O, Xt, v, z);
      l = lt(l, St(
        Y(ot, z, 2 * Z, W),
        W,
        Y(ot, z, v, nt),
        nt,
        Y(st, it, v, et),
        et,
        Ct,
        vt
      ), vt);
    }
  }
  if (d !== 0 || p !== 0) {
    if (u !== 0 || b !== 0 || f !== 0 || v !== 0 ? (X = u * Z, T = V * u, _ = T - (T - u), N = u - _, T = V * Z, C = T - (T - Z), D = Z - C, q = N * D - (X - _ * C - N * C - _ * D), L = K * v, T = V * K, _ = T - (T - K), N = K - _, T = V * v, C = T - (T - v), D = v - C, U = N * D - (L - _ * C - N * C - _ * D), x = q + U, M = x - q, mt[0] = q - (x - M) + (U - M), F = X + x, M = F - X, R = X - (F - M) + (x - M), x = R + L, M = x - R, mt[1] = R - (x - M) + (L - M), j = F + x, M = j - F, mt[2] = F - (j - M) + (x - M), mt[3] = j, P = -J, $ = -b, X = f * P, T = V * f, _ = T - (T - f), N = f - _, T = V * P, C = T - (T - P), D = P - C, q = N * D - (X - _ * C - N * C - _ * D), L = H * $, T = V * H, _ = T - (T - H), N = H - _, T = V * $, C = T - (T - $), D = $ - C, U = N * D - (L - _ * C - N * C - _ * D), x = q + U, M = x - q, wt[0] = q - (x - M) + (U - M), F = X + x, M = F - X, R = X - (F - M) + (x - M), x = R + L, M = x - R, wt[1] = R - (x - M) + (L - M), j = F + x, M = j - F, wt[2] = F - (j - M) + (x - M), wt[3] = j, y = ht(4, mt, 4, wt, oe), X = u * v, T = V * u, _ = T - (T - u), N = u - _, T = V * v, C = T - (T - v), D = v - C, q = N * D - (X - _ * C - N * C - _ * D), L = f * b, T = V * f, _ = T - (T - f), N = f - _, T = V * b, C = T - (T - b), D = b - C, U = N * D - (L - _ * C - N * C - _ * D), x = q - U, M = q - x, Rt[0] = q - (x + M) + (M - U), F = X + x, M = F - X, R = X - (F - M) + (x - M), x = R - L, M = R - x, Rt[1] = R - (x + M) + (M - L), j = F + x, M = j - F, Rt[2] = F - (j - M) + (x - M), Rt[3] = j, A = 4) : (oe[0] = 0, y = 1, Rt[0] = 0, A = 1), d !== 0) {
      const st = Y(y, oe, d, it);
      l = lt(l, ht(
        Y(h, Ie, d, W),
        W,
        Y(st, it, 2 * G, et),
        et,
        ct
      ), ct);
      const ot = Y(A, Rt, d, z);
      l = lt(l, St(
        Y(ot, z, 2 * G, W),
        W,
        Y(ot, z, d, nt),
        nt,
        Y(st, it, d, et),
        et,
        Ct,
        vt
      ), vt), b !== 0 && (l = lt(l, Y(Y(4, Et, d, z), z, b, W), W)), v !== 0 && (l = lt(l, Y(Y(4, _t, -d, z), z, v, W), W));
    }
    if (p !== 0) {
      const st = Y(y, oe, p, it);
      l = lt(l, ht(
        Y(w, Be, p, W),
        W,
        Y(st, it, 2 * Q, et),
        et,
        ct
      ), ct);
      const ot = Y(A, Rt, p, z);
      l = lt(l, St(
        Y(ot, z, 2 * Q, W),
        W,
        Y(ot, z, p, nt),
        nt,
        Y(st, it, p, et),
        et,
        Ct,
        vt
      ), vt);
    }
  }
  return Ht[l - 1];
}
function ui(r, t, e, n, s, o, i, a) {
  const c = r - i, l = e - i, u = s - i, f = t - a, d = n - a, b = o - a, v = l * b, p = u * d, S = c * c + f * f, I = u * f, g = c * b, m = l * l + d * d, h = c * d, w = l * f, y = u * u + b * b, E = S * (v - p) + m * (I - g) + y * (h - w), k = (Math.abs(v) + Math.abs(p)) * S + (Math.abs(I) + Math.abs(g)) * m + (Math.abs(h) + Math.abs(w)) * y, A = ai * k;
  return E > A || -E > A ? E : fi(r, t, e, n, s, o, i, a, k);
}
function hi(r, t) {
  var e, n, s = 0, o, i, a, c, l, u, f, d = r[0], b = r[1], v = t.length;
  for (e = 0; e < v; e++) {
    n = 0;
    var p = t[e], S = p.length - 1;
    if (u = p[0], u[0] !== p[S][0] && u[1] !== p[S][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (i = u[0] - d, a = u[1] - b, n; n < S; n++) {
      if (f = p[n + 1], c = f[0] - d, l = f[1] - b, a === 0 && l === 0) {
        if (c <= 0 && i >= 0 || i <= 0 && c >= 0)
          return 0;
      } else if (l >= 0 && a <= 0 || l <= 0 && a >= 0) {
        if (o = ft(i, c, a, l, 0, 0), o === 0)
          return 0;
        (o > 0 && l > 0 && a <= 0 || o < 0 && l <= 0 && a > 0) && s++;
      }
      u = f, a = l, i = c;
    }
  }
  return s % 2 !== 0;
}
function Ge(r, t, e = {}) {
  if (!r)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const n = ei(r), s = ni(t), o = s.type, i = t.bbox;
  let a = s.coordinates;
  if (i && di(n, i) === !1)
    return !1;
  o === "Polygon" && (a = [a]);
  for (var c = 0; c < a.length; ++c) {
    const l = hi(n, a[c]);
    if (l === 0 && !e.ignoreBoundary) return !0;
    if (l) return !0;
  }
  return !1;
}
function di(r, t) {
  return t[0] <= r[0] && t[1] <= r[1] && t[2] >= r[0] && t[3] >= r[1];
}
class Xe {
  constructor(t = [], e = pi) {
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
    const { data: e, compare: n } = this, s = e[t];
    for (; t > 0; ) {
      const o = t - 1 >> 1, i = e[o];
      if (n(s, i) >= 0) break;
      e[t] = i, t = o;
    }
    e[t] = s;
  }
  _down(t) {
    const { data: e, compare: n } = this, s = this.length >> 1, o = e[t];
    for (; t < s; ) {
      let i = (t << 1) + 1, a = e[i];
      const c = i + 1;
      if (c < this.length && n(e[c], a) < 0 && (i = c, a = e[c]), n(a, o) >= 0) break;
      e[t] = a, t = i;
    }
    e[t] = o;
  }
}
function pi(r, t) {
  return r < t ? -1 : r > t ? 1 : 0;
}
const gi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Xe
}, Symbol.toStringTag, { value: "Module" })), Bt = 11102230246251565e-32, dt = 134217729, mi = (3 + 8 * Bt) * Bt;
function Oe(r, t, e, n, s) {
  let o, i, a, c, l = t[0], u = n[0], f = 0, d = 0;
  u > l == u > -l ? (o = l, l = t[++f]) : (o = u, u = n[++d]);
  let b = 0;
  if (f < r && d < e)
    for (u > l == u > -l ? (i = l + o, a = o - (i - l), l = t[++f]) : (i = u + o, a = o - (i - u), u = n[++d]), o = i, a !== 0 && (s[b++] = a); f < r && d < e; )
      u > l == u > -l ? (i = o + l, c = i - o, a = o - (i - c) + (l - c), l = t[++f]) : (i = o + u, c = i - o, a = o - (i - c) + (u - c), u = n[++d]), o = i, a !== 0 && (s[b++] = a);
  for (; f < r; )
    i = o + l, c = i - o, a = o - (i - c) + (l - c), l = t[++f], o = i, a !== 0 && (s[b++] = a);
  for (; d < e; )
    i = o + u, c = i - o, a = o - (i - c) + (u - c), u = n[++d], o = i, a !== 0 && (s[b++] = a);
  return (o !== 0 || b === 0) && (s[b++] = o), b;
}
function wi(r, t) {
  let e = t[0];
  for (let n = 1; n < r; n++) e += t[n];
  return e;
}
function se(r) {
  return new Float64Array(r);
}
const yi = (3 + 16 * Bt) * Bt, vi = (2 + 12 * Bt) * Bt, bi = (9 + 64 * Bt) * Bt * Bt, jt = se(4), Je = se(8), Qe = se(12), Ze = se(16), yt = se(4);
function Mi(r, t, e, n, s, o, i) {
  let a, c, l, u, f, d, b, v, p, S, I, g, m, h, w, y, E, k;
  const A = r - s, B = e - s, O = t - o, P = n - o;
  h = A * P, d = dt * A, b = d - (d - A), v = A - b, d = dt * P, p = d - (d - P), S = P - p, w = v * S - (h - b * p - v * p - b * S), y = O * B, d = dt * O, b = d - (d - O), v = O - b, d = dt * B, p = d - (d - B), S = B - p, E = v * S - (y - b * p - v * p - b * S), I = w - E, f = w - I, jt[0] = w - (I + f) + (f - E), g = h + I, f = g - h, m = h - (g - f) + (I - f), I = m - y, f = m - I, jt[1] = m - (I + f) + (f - y), k = g + I, f = k - g, jt[2] = g - (k - f) + (I - f), jt[3] = k;
  let $ = wi(4, jt), M = vi * i;
  if ($ >= M || -$ >= M || (f = r - A, a = r - (A + f) + (f - s), f = e - B, l = e - (B + f) + (f - s), f = t - O, c = t - (O + f) + (f - o), f = n - P, u = n - (P + f) + (f - o), a === 0 && c === 0 && l === 0 && u === 0) || (M = bi * i + mi * Math.abs($), $ += A * u + P * a - (O * l + B * c), $ >= M || -$ >= M)) return $;
  h = a * P, d = dt * a, b = d - (d - a), v = a - b, d = dt * P, p = d - (d - P), S = P - p, w = v * S - (h - b * p - v * p - b * S), y = c * B, d = dt * c, b = d - (d - c), v = c - b, d = dt * B, p = d - (d - B), S = B - p, E = v * S - (y - b * p - v * p - b * S), I = w - E, f = w - I, yt[0] = w - (I + f) + (f - E), g = h + I, f = g - h, m = h - (g - f) + (I - f), I = m - y, f = m - I, yt[1] = m - (I + f) + (f - y), k = g + I, f = k - g, yt[2] = g - (k - f) + (I - f), yt[3] = k;
  const T = Oe(4, jt, 4, yt, Je);
  h = A * u, d = dt * A, b = d - (d - A), v = A - b, d = dt * u, p = d - (d - u), S = u - p, w = v * S - (h - b * p - v * p - b * S), y = O * l, d = dt * O, b = d - (d - O), v = O - b, d = dt * l, p = d - (d - l), S = l - p, E = v * S - (y - b * p - v * p - b * S), I = w - E, f = w - I, yt[0] = w - (I + f) + (f - E), g = h + I, f = g - h, m = h - (g - f) + (I - f), I = m - y, f = m - I, yt[1] = m - (I + f) + (f - y), k = g + I, f = k - g, yt[2] = g - (k - f) + (I - f), yt[3] = k;
  const _ = Oe(T, Je, 4, yt, Qe);
  h = a * u, d = dt * a, b = d - (d - a), v = a - b, d = dt * u, p = d - (d - u), S = u - p, w = v * S - (h - b * p - v * p - b * S), y = c * l, d = dt * c, b = d - (d - c), v = c - b, d = dt * l, p = d - (d - l), S = l - p, E = v * S - (y - b * p - v * p - b * S), I = w - E, f = w - I, yt[0] = w - (I + f) + (f - E), g = h + I, f = g - h, m = h - (g - f) + (I - f), I = m - y, f = m - I, yt[1] = m - (I + f) + (f - y), k = g + I, f = k - g, yt[2] = g - (k - f) + (I - f), yt[3] = k;
  const N = Oe(_, Qe, 4, yt, Ze);
  return Ze[N - 1];
}
function tn(r, t, e, n, s, o) {
  const i = (t - o) * (e - s), a = (r - s) * (n - o), c = i - a;
  if (i === 0 || a === 0 || i > 0 != a > 0) return c;
  const l = Math.abs(i + a);
  return Math.abs(c) >= yi * l ? c : -Mi(r, t, e, n, s, o, l);
}
function xi(r, t) {
  const e = new Xe([], Rn);
  return _i(r, e), Ei(e, t);
}
function Rn(r, t) {
  return r.p.x > t.p.x ? 1 : r.p.x < t.p.x || r.p.x === t.p.x && (r.featureId !== t.featureId || r.ringId !== t.ringId) && r.isLeftEndpoint && !t.isLeftEndpoint ? -1 : r.p.y !== t.p.y ? r.p.y > t.p.y ? 1 : -1 : 1;
}
function Si(r, t) {
  return r.rightSweepEvent.p.x > t.rightSweepEvent.p.x ? 1 : r.rightSweepEvent.p.x < t.rightSweepEvent.p.x ? -1 : r.rightSweepEvent.p.y !== t.rightSweepEvent.p.y ? r.rightSweepEvent.p.y < t.rightSweepEvent.p.y ? 1 : -1 : 1;
}
function _i(r, t) {
  if (r.type === "FeatureCollection") {
    const e = r.features;
    for (let n = 0; n < e.length; n++)
      en(e[n], t);
  } else
    en(r, t);
}
var le = 0, fe = 0, ue = 0;
function en(r, t) {
  const e = r.type === "Feature" ? r.geometry : r;
  let n = e.coordinates;
  (e.type === "Polygon" || e.type === "MultiLineString") && (n = [n]), e.type === "LineString" && (n = [[n]]);
  for (let s = 0; s < n.length; s++)
    for (let o = 0; o < n[s].length; o++) {
      let i = n[s][o][0], a = null;
      fe = fe + 1;
      for (let c = 0; c < n[s][o].length - 1; c++) {
        a = n[s][o][c + 1];
        const l = new nn(i, le, fe, ue), u = new nn(a, le, fe, ue + 1);
        l.otherEvent = u, u.otherEvent = l, Rn(l, u) > 0 ? (u.isLeftEndpoint = !0, l.isLeftEndpoint = !1) : (l.isLeftEndpoint = !0, u.isLeftEndpoint = !1), t.push(l), t.push(u), i = a, ue = ue + 1;
      }
    }
  le = le + 1;
}
var nn = class {
  constructor(r, t, e, n) {
    this.p = {
      x: r[0],
      y: r[1]
    }, this.featureId = t, this.ringId = e, this.eventId = n, this.otherEvent = null, this.isLeftEndpoint = null;
  }
  isSamePoint(r) {
    return this.p.x === r.p.x && this.p.y === r.p.y;
  }
  asNewXY() {
    return [this.p.x, this.p.y];
  }
};
function Ei(r, t = !1) {
  const e = [], n = new Xe([], Si);
  for (; r.length; ) {
    const s = r.pop();
    if (s.isLeftEndpoint) {
      const o = new ki(s);
      for (let i = 0; i < n.data.length; i++) {
        const a = n.data[i];
        if (t && a.leftSweepEvent.featureId === s.featureId)
          continue;
        const c = Ai(o, a);
        c !== !1 && e.push(c);
      }
      n.push(o);
    } else s.isLeftEndpoint === !1 && n.pop();
  }
  return e;
}
var ki = class {
  /** @param event must have otherEvent non-null */
  constructor(r) {
    this.leftSweepEvent = r, this.rightSweepEvent = r.otherEvent;
  }
};
function Ai(r, t) {
  if (r === null || t === null) return !1;
  const e = r.leftSweepEvent.p.x, n = r.leftSweepEvent.p.y, s = r.rightSweepEvent.p.x, o = r.rightSweepEvent.p.y, i = t.leftSweepEvent.p.x, a = t.leftSweepEvent.p.y, c = t.rightSweepEvent.p.x, l = t.rightSweepEvent.p.y, u = tn(e, n, s, o, i, a), f = tn(e, n, s, o, c, l);
  if (u > 0 && f > 0) return !1;
  if (u < 0 && f < 0) return !1;
  if (r.leftSweepEvent.ringId === t.leftSweepEvent.ringId) {
    if (r.rightSweepEvent.isSamePoint(t.leftSweepEvent) || r.rightSweepEvent.isSamePoint(t.rightSweepEvent) || r.leftSweepEvent.isSamePoint(t.leftSweepEvent) || r.leftSweepEvent.isSamePoint(t.rightSweepEvent))
      return !1;
  } else {
    if (r.rightSweepEvent.isSamePoint(t.leftSweepEvent))
      return t.leftSweepEvent.asNewXY();
    if (r.rightSweepEvent.isSamePoint(t.rightSweepEvent))
      return t.rightSweepEvent.asNewXY();
    if (r.leftSweepEvent.isSamePoint(t.leftSweepEvent))
      return t.leftSweepEvent.asNewXY();
    if (r.leftSweepEvent.isSamePoint(t.rightSweepEvent))
      return t.rightSweepEvent.asNewXY();
  }
  const d = (l - a) * (s - e) - (c - i) * (o - n), b = (c - i) * (n - a) - (l - a) * (e - i), v = (s - e) * (n - a) - (o - n) * (e - i);
  if (d === 0)
    return !1;
  const p = b / d, S = v / d;
  if (p >= 0 && p <= 1 && S >= 0 && S <= 1) {
    const I = e + p * (s - e), g = n + p * (o - n);
    return [I, g];
  }
  return !1;
}
function Ii(r, t, e = {}) {
  const { removeDuplicates: n = !0, ignoreSelfIntersections: s = !0 } = e;
  let o = [];
  r.type === "FeatureCollection" ? o = o.concat(r.features) : r.type === "Feature" ? o.push(r) : (r.type === "LineString" || r.type === "Polygon" || r.type === "MultiLineString" || r.type === "MultiPolygon") && o.push(ee(r)), t.type === "FeatureCollection" ? o = o.concat(t.features) : t.type === "Feature" ? o.push(t) : (t.type === "LineString" || t.type === "Polygon" || t.type === "MultiLineString" || t.type === "MultiPolygon") && o.push(ee(t));
  const i = xi(
    Mt(o),
    s
  );
  let a = [];
  if (n) {
    const c = {};
    i.forEach((l) => {
      const u = l.join(",");
      c[u] || (c[u] = !0, a.push(l));
    });
  } else
    a = i;
  return Mt(a.map((c) => Yt(c)));
}
function Bi(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
function Ti(r) {
  if (Object.prototype.hasOwnProperty.call(r, "__esModule")) return r;
  var t = r.default;
  if (typeof t == "function") {
    var e = function n() {
      var s = !1;
      try {
        s = this instanceof n;
      } catch {
      }
      return s ? Reflect.construct(t, arguments, this.constructor) : t.apply(this, arguments);
    };
    e.prototype = t.prototype;
  } else e = {};
  return Object.defineProperty(e, "__esModule", { value: !0 }), Object.keys(r).forEach(function(n) {
    var s = Object.getOwnPropertyDescriptor(r, n);
    Object.defineProperty(e, n, s.get ? s : {
      enumerable: !0,
      get: function() {
        return r[n];
      }
    });
  }), e;
}
function Oi(r, t = {}) {
  let e = 0, n = 0, s = 0;
  return $e(
    r,
    function(o) {
      e += o[0], n += o[1], s++;
    },
    !0
  ), Yt([e / s, n / s], t.properties);
}
var he = { exports: {} }, ye = { exports: {} }, Ni = ye.exports, rn;
function Fi() {
  return rn || (rn = 1, (function(r, t) {
    (function(e, n) {
      r.exports = n();
    })(Ni, function() {
      function e(g, m, h, w, y) {
        (function E(k, A, B, O, P) {
          for (; O > B; ) {
            if (O - B > 600) {
              var $ = O - B + 1, M = A - B + 1, T = Math.log($), _ = 0.5 * Math.exp(2 * T / 3), N = 0.5 * Math.sqrt(T * _ * ($ - _) / $) * (M - $ / 2 < 0 ? -1 : 1), C = Math.max(B, Math.floor(A - M * _ / $ + N)), D = Math.min(O, Math.floor(A + ($ - M) * _ / $ + N));
              E(k, A, C, D, P);
            }
            var x = k[A], F = B, R = O;
            for (n(k, B, A), P(k[O], x) > 0 && n(k, B, O); F < R; ) {
              for (n(k, F, R), F++, R--; P(k[F], x) < 0; ) F++;
              for (; P(k[R], x) > 0; ) R--;
            }
            P(k[B], x) === 0 ? n(k, B, R) : n(k, ++R, O), R <= A && (B = R + 1), A <= R && (O = R - 1);
          }
        })(g, m, h || 0, w || g.length - 1, y || s);
      }
      function n(g, m, h) {
        var w = g[m];
        g[m] = g[h], g[h] = w;
      }
      function s(g, m) {
        return g < m ? -1 : g > m ? 1 : 0;
      }
      var o = function(g) {
        g === void 0 && (g = 9), this._maxEntries = Math.max(4, g), this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries)), this.clear();
      };
      function i(g, m, h) {
        if (!h) return m.indexOf(g);
        for (var w = 0; w < m.length; w++) if (h(g, m[w])) return w;
        return -1;
      }
      function a(g, m) {
        c(g, 0, g.children.length, m, g);
      }
      function c(g, m, h, w, y) {
        y || (y = S(null)), y.minX = 1 / 0, y.minY = 1 / 0, y.maxX = -1 / 0, y.maxY = -1 / 0;
        for (var E = m; E < h; E++) {
          var k = g.children[E];
          l(y, g.leaf ? w(k) : k);
        }
        return y;
      }
      function l(g, m) {
        return g.minX = Math.min(g.minX, m.minX), g.minY = Math.min(g.minY, m.minY), g.maxX = Math.max(g.maxX, m.maxX), g.maxY = Math.max(g.maxY, m.maxY), g;
      }
      function u(g, m) {
        return g.minX - m.minX;
      }
      function f(g, m) {
        return g.minY - m.minY;
      }
      function d(g) {
        return (g.maxX - g.minX) * (g.maxY - g.minY);
      }
      function b(g) {
        return g.maxX - g.minX + (g.maxY - g.minY);
      }
      function v(g, m) {
        return g.minX <= m.minX && g.minY <= m.minY && m.maxX <= g.maxX && m.maxY <= g.maxY;
      }
      function p(g, m) {
        return m.minX <= g.maxX && m.minY <= g.maxY && m.maxX >= g.minX && m.maxY >= g.minY;
      }
      function S(g) {
        return { children: g, height: 1, leaf: !0, minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
      }
      function I(g, m, h, w, y) {
        for (var E = [m, h]; E.length; ) if (!((h = E.pop()) - (m = E.pop()) <= w)) {
          var k = m + Math.ceil((h - m) / w / 2) * w;
          e(g, k, m, h, y), E.push(m, k, k, h);
        }
      }
      return o.prototype.all = function() {
        return this._all(this.data, []);
      }, o.prototype.search = function(g) {
        var m = this.data, h = [];
        if (!p(g, m)) return h;
        for (var w = this.toBBox, y = []; m; ) {
          for (var E = 0; E < m.children.length; E++) {
            var k = m.children[E], A = m.leaf ? w(k) : k;
            p(g, A) && (m.leaf ? h.push(k) : v(g, A) ? this._all(k, h) : y.push(k));
          }
          m = y.pop();
        }
        return h;
      }, o.prototype.collides = function(g) {
        var m = this.data;
        if (!p(g, m)) return !1;
        for (var h = []; m; ) {
          for (var w = 0; w < m.children.length; w++) {
            var y = m.children[w], E = m.leaf ? this.toBBox(y) : y;
            if (p(g, E)) {
              if (m.leaf || v(g, E)) return !0;
              h.push(y);
            }
          }
          m = h.pop();
        }
        return !1;
      }, o.prototype.load = function(g) {
        if (!g || !g.length) return this;
        if (g.length < this._minEntries) {
          for (var m = 0; m < g.length; m++) this.insert(g[m]);
          return this;
        }
        var h = this._build(g.slice(), 0, g.length - 1, 0);
        if (this.data.children.length) if (this.data.height === h.height) this._splitRoot(this.data, h);
        else {
          if (this.data.height < h.height) {
            var w = this.data;
            this.data = h, h = w;
          }
          this._insert(h, this.data.height - h.height - 1, !0);
        }
        else this.data = h;
        return this;
      }, o.prototype.insert = function(g) {
        return g && this._insert(g, this.data.height - 1), this;
      }, o.prototype.clear = function() {
        return this.data = S([]), this;
      }, o.prototype.remove = function(g, m) {
        if (!g) return this;
        for (var h, w, y, E = this.data, k = this.toBBox(g), A = [], B = []; E || A.length; ) {
          if (E || (E = A.pop(), w = A[A.length - 1], h = B.pop(), y = !0), E.leaf) {
            var O = i(g, E.children, m);
            if (O !== -1) return E.children.splice(O, 1), A.push(E), this._condense(A), this;
          }
          y || E.leaf || !v(E, k) ? w ? (h++, E = w.children[h], y = !1) : E = null : (A.push(E), B.push(h), h = 0, w = E, E = E.children[0]);
        }
        return this;
      }, o.prototype.toBBox = function(g) {
        return g;
      }, o.prototype.compareMinX = function(g, m) {
        return g.minX - m.minX;
      }, o.prototype.compareMinY = function(g, m) {
        return g.minY - m.minY;
      }, o.prototype.toJSON = function() {
        return this.data;
      }, o.prototype.fromJSON = function(g) {
        return this.data = g, this;
      }, o.prototype._all = function(g, m) {
        for (var h = []; g; ) g.leaf ? m.push.apply(m, g.children) : h.push.apply(h, g.children), g = h.pop();
        return m;
      }, o.prototype._build = function(g, m, h, w) {
        var y, E = h - m + 1, k = this._maxEntries;
        if (E <= k) return a(y = S(g.slice(m, h + 1)), this.toBBox), y;
        w || (w = Math.ceil(Math.log(E) / Math.log(k)), k = Math.ceil(E / Math.pow(k, w - 1))), (y = S([])).leaf = !1, y.height = w;
        var A = Math.ceil(E / k), B = A * Math.ceil(Math.sqrt(k));
        I(g, m, h, B, this.compareMinX);
        for (var O = m; O <= h; O += B) {
          var P = Math.min(O + B - 1, h);
          I(g, O, P, A, this.compareMinY);
          for (var $ = O; $ <= P; $ += A) {
            var M = Math.min($ + A - 1, P);
            y.children.push(this._build(g, $, M, w - 1));
          }
        }
        return a(y, this.toBBox), y;
      }, o.prototype._chooseSubtree = function(g, m, h, w) {
        for (; w.push(m), !m.leaf && w.length - 1 !== h; ) {
          for (var y = 1 / 0, E = 1 / 0, k = void 0, A = 0; A < m.children.length; A++) {
            var B = m.children[A], O = d(B), P = ($ = g, M = B, (Math.max(M.maxX, $.maxX) - Math.min(M.minX, $.minX)) * (Math.max(M.maxY, $.maxY) - Math.min(M.minY, $.minY)) - O);
            P < E ? (E = P, y = O < y ? O : y, k = B) : P === E && O < y && (y = O, k = B);
          }
          m = k || m.children[0];
        }
        var $, M;
        return m;
      }, o.prototype._insert = function(g, m, h) {
        var w = h ? g : this.toBBox(g), y = [], E = this._chooseSubtree(w, this.data, m, y);
        for (E.children.push(g), l(E, w); m >= 0 && y[m].children.length > this._maxEntries; ) this._split(y, m), m--;
        this._adjustParentBBoxes(w, y, m);
      }, o.prototype._split = function(g, m) {
        var h = g[m], w = h.children.length, y = this._minEntries;
        this._chooseSplitAxis(h, y, w);
        var E = this._chooseSplitIndex(h, y, w), k = S(h.children.splice(E, h.children.length - E));
        k.height = h.height, k.leaf = h.leaf, a(h, this.toBBox), a(k, this.toBBox), m ? g[m - 1].children.push(k) : this._splitRoot(h, k);
      }, o.prototype._splitRoot = function(g, m) {
        this.data = S([g, m]), this.data.height = g.height + 1, this.data.leaf = !1, a(this.data, this.toBBox);
      }, o.prototype._chooseSplitIndex = function(g, m, h) {
        for (var w, y, E, k, A, B, O, P = 1 / 0, $ = 1 / 0, M = m; M <= h - m; M++) {
          var T = c(g, 0, M, this.toBBox), _ = c(g, M, h, this.toBBox), N = (y = T, E = _, k = void 0, A = void 0, B = void 0, O = void 0, k = Math.max(y.minX, E.minX), A = Math.max(y.minY, E.minY), B = Math.min(y.maxX, E.maxX), O = Math.min(y.maxY, E.maxY), Math.max(0, B - k) * Math.max(0, O - A)), C = d(T) + d(_);
          N < P ? (P = N, w = M, $ = C < $ ? C : $) : N === P && C < $ && ($ = C, w = M);
        }
        return w || h - m;
      }, o.prototype._chooseSplitAxis = function(g, m, h) {
        var w = g.leaf ? this.compareMinX : u, y = g.leaf ? this.compareMinY : f;
        this._allDistMargin(g, m, h, w) < this._allDistMargin(g, m, h, y) && g.children.sort(w);
      }, o.prototype._allDistMargin = function(g, m, h, w) {
        g.children.sort(w);
        for (var y = this.toBBox, E = c(g, 0, m, y), k = c(g, h - m, h, y), A = b(E) + b(k), B = m; B < h - m; B++) {
          var O = g.children[B];
          l(E, g.leaf ? y(O) : O), A += b(E);
        }
        for (var P = h - m - 1; P >= m; P--) {
          var $ = g.children[P];
          l(k, g.leaf ? y($) : $), A += b(k);
        }
        return A;
      }, o.prototype._adjustParentBBoxes = function(g, m, h) {
        for (var w = h; w >= 0; w--) l(m[w], g);
      }, o.prototype._condense = function(g) {
        for (var m = g.length - 1, h = void 0; m >= 0; m--) g[m].children.length === 0 ? m > 0 ? (h = g[m - 1].children).splice(h.indexOf(g[m]), 1) : this.clear() : a(g[m], this.toBBox);
      }, o;
    });
  })(ye)), ye.exports;
}
const Ci = /* @__PURE__ */ Ti(gi);
var Wt = { exports: {} }, Ne, sn;
function Pi() {
  return sn || (sn = 1, Ne = function(t, e, n, s) {
    var o = t[0], i = t[1], a = !1;
    n === void 0 && (n = 0), s === void 0 && (s = e.length);
    for (var c = (s - n) / 2, l = 0, u = c - 1; l < c; u = l++) {
      var f = e[n + l * 2 + 0], d = e[n + l * 2 + 1], b = e[n + u * 2 + 0], v = e[n + u * 2 + 1], p = d > i != v > i && o < (b - f) * (i - d) / (v - d) + f;
      p && (a = !a);
    }
    return a;
  }), Ne;
}
var Fe, on;
function Di() {
  return on || (on = 1, Fe = function(t, e, n, s) {
    var o = t[0], i = t[1], a = !1;
    n === void 0 && (n = 0), s === void 0 && (s = e.length);
    for (var c = s - n, l = 0, u = c - 1; l < c; u = l++) {
      var f = e[l + n][0], d = e[l + n][1], b = e[u + n][0], v = e[u + n][1], p = d > i != v > i && o < (b - f) * (i - d) / (v - d) + f;
      p && (a = !a);
    }
    return a;
  }), Fe;
}
var an;
function Ri() {
  if (an) return Wt.exports;
  an = 1;
  var r = Pi(), t = Di();
  return Wt.exports = function(n, s, o, i) {
    return s.length > 0 && Array.isArray(s[0]) ? t(n, s, o, i) : r(n, s, o, i);
  }, Wt.exports.nested = t, Wt.exports.flat = r, Wt.exports;
}
var Jt = { exports: {} }, $i = Jt.exports, cn;
function Xi() {
  return cn || (cn = 1, (function(r, t) {
    (function(e, n) {
      n(t);
    })($i, function(e) {
      const s = 33306690738754706e-32;
      function o(p, S, I, g, m) {
        let h, w, y, E, k = S[0], A = g[0], B = 0, O = 0;
        A > k == A > -k ? (h = k, k = S[++B]) : (h = A, A = g[++O]);
        let P = 0;
        if (B < p && O < I) for (A > k == A > -k ? (y = h - ((w = k + h) - k), k = S[++B]) : (y = h - ((w = A + h) - A), A = g[++O]), h = w, y !== 0 && (m[P++] = y); B < p && O < I; ) A > k == A > -k ? (y = h - ((w = h + k) - (E = w - h)) + (k - E), k = S[++B]) : (y = h - ((w = h + A) - (E = w - h)) + (A - E), A = g[++O]), h = w, y !== 0 && (m[P++] = y);
        for (; B < p; ) y = h - ((w = h + k) - (E = w - h)) + (k - E), k = S[++B], h = w, y !== 0 && (m[P++] = y);
        for (; O < I; ) y = h - ((w = h + A) - (E = w - h)) + (A - E), A = g[++O], h = w, y !== 0 && (m[P++] = y);
        return h === 0 && P !== 0 || (m[P++] = h), P;
      }
      function i(p) {
        return new Float64Array(p);
      }
      const a = 33306690738754716e-32, c = 22204460492503146e-32, l = 11093356479670487e-47, u = i(4), f = i(8), d = i(12), b = i(16), v = i(4);
      e.orient2d = function(p, S, I, g, m, h) {
        const w = (S - h) * (I - m), y = (p - m) * (g - h), E = w - y;
        if (w === 0 || y === 0 || w > 0 != y > 0) return E;
        const k = Math.abs(w + y);
        return Math.abs(E) >= a * k ? E : -(function(A, B, O, P, $, M, T) {
          let _, N, C, D, x, F, R, X, q, L, U, j, K, H, G, J, Z, Q;
          const at = A - $, ut = O - $, st = B - M, ot = P - M;
          x = (G = (X = at - (R = (F = 134217729 * at) - (F - at))) * (L = ot - (q = (F = 134217729 * ot) - (F - ot))) - ((H = at * ot) - R * q - X * q - R * L)) - (U = G - (Z = (X = st - (R = (F = 134217729 * st) - (F - st))) * (L = ut - (q = (F = 134217729 * ut) - (F - ut))) - ((J = st * ut) - R * q - X * q - R * L))), u[0] = G - (U + x) + (x - Z), x = (K = H - ((j = H + U) - (x = j - H)) + (U - x)) - (U = K - J), u[1] = K - (U + x) + (x - J), x = (Q = j + U) - j, u[2] = j - (Q - x) + (U - x), u[3] = Q;
          let Tt = (function(Gn, qe) {
            let je = qe[0];
            for (let xe = 1; xe < Gn; xe++) je += qe[xe];
            return je;
          })(4, u), Kt = c * T;
          if (Tt >= Kt || -Tt >= Kt || (_ = A - (at + (x = A - at)) + (x - $), C = O - (ut + (x = O - ut)) + (x - $), N = B - (st + (x = B - st)) + (x - M), D = P - (ot + (x = P - ot)) + (x - M), _ === 0 && N === 0 && C === 0 && D === 0) || (Kt = l * T + s * Math.abs(Tt), (Tt += at * D + ot * _ - (st * C + ut * N)) >= Kt || -Tt >= Kt)) return Tt;
          x = (G = (X = _ - (R = (F = 134217729 * _) - (F - _))) * (L = ot - (q = (F = 134217729 * ot) - (F - ot))) - ((H = _ * ot) - R * q - X * q - R * L)) - (U = G - (Z = (X = N - (R = (F = 134217729 * N) - (F - N))) * (L = ut - (q = (F = 134217729 * ut) - (F - ut))) - ((J = N * ut) - R * q - X * q - R * L))), v[0] = G - (U + x) + (x - Z), x = (K = H - ((j = H + U) - (x = j - H)) + (U - x)) - (U = K - J), v[1] = K - (U + x) + (x - J), x = (Q = j + U) - j, v[2] = j - (Q - x) + (U - x), v[3] = Q;
          const Hn = o(4, u, 4, v, f);
          x = (G = (X = at - (R = (F = 134217729 * at) - (F - at))) * (L = D - (q = (F = 134217729 * D) - (F - D))) - ((H = at * D) - R * q - X * q - R * L)) - (U = G - (Z = (X = st - (R = (F = 134217729 * st) - (F - st))) * (L = C - (q = (F = 134217729 * C) - (F - C))) - ((J = st * C) - R * q - X * q - R * L))), v[0] = G - (U + x) + (x - Z), x = (K = H - ((j = H + U) - (x = j - H)) + (U - x)) - (U = K - J), v[1] = K - (U + x) + (x - J), x = (Q = j + U) - j, v[2] = j - (Q - x) + (U - x), v[3] = Q;
          const Kn = o(Hn, f, 4, v, d);
          x = (G = (X = _ - (R = (F = 134217729 * _) - (F - _))) * (L = D - (q = (F = 134217729 * D) - (F - D))) - ((H = _ * D) - R * q - X * q - R * L)) - (U = G - (Z = (X = N - (R = (F = 134217729 * N) - (F - N))) * (L = C - (q = (F = 134217729 * C) - (F - C))) - ((J = N * C) - R * q - X * q - R * L))), v[0] = G - (U + x) + (x - Z), x = (K = H - ((j = H + U) - (x = j - H)) + (U - x)) - (U = K - J), v[1] = K - (U + x) + (x - J), x = (Q = j + U) - j, v[2] = j - (Q - x) + (U - x), v[3] = Q;
          const Wn = o(Kn, d, 4, v, b);
          return b[Wn - 1];
        })(p, S, I, g, m, h, k);
      }, e.orient2dfast = function(p, S, I, g, m, h) {
        return (S - h) * (I - m) - (p - m) * (g - h);
      }, Object.defineProperty(e, "__esModule", { value: !0 });
    });
  })(Jt, Jt.exports)), Jt.exports;
}
var ln;
function Li() {
  if (ln) return he.exports;
  ln = 1;
  var r = Fi(), t = Ci, e = Ri(), n = Xi().orient2d;
  t.default && (t = t.default), he.exports = s, he.exports.default = s;
  function s(h, w, y) {
    w = Math.max(0, w === void 0 ? 2 : w), y = y || 0;
    var E = b(h), k = new r(16);
    k.toBBox = function(R) {
      return {
        minX: R[0],
        minY: R[1],
        maxX: R[0],
        maxY: R[1]
      };
    }, k.compareMinX = function(R, X) {
      return R[0] - X[0];
    }, k.compareMinY = function(R, X) {
      return R[1] - X[1];
    }, k.load(h);
    for (var A = [], B = 0, O; B < E.length; B++) {
      var P = E[B];
      k.remove(P), O = v(P, O), A.push(O);
    }
    var $ = new r(16);
    for (B = 0; B < A.length; B++) $.insert(d(A[B]));
    for (var M = w * w, T = y * y; A.length; ) {
      var _ = A.shift(), N = _.p, C = _.next.p, D = p(N, C);
      if (!(D < T)) {
        var x = D / M;
        P = o(k, _.prev.p, N, C, _.next.next.p, x, $), P && Math.min(p(P, N), p(P, C)) <= x && (A.push(_), A.push(v(P, _)), k.remove(P), $.remove(_), $.insert(d(_)), $.insert(d(_.next)));
      }
    }
    _ = O;
    var F = [];
    do
      F.push(_.p), _ = _.next;
    while (_ !== O);
    return F.push(_.p), F;
  }
  function o(h, w, y, E, k, A, B) {
    for (var O = new t([], i), P = h.data; P; ) {
      for (var $ = 0; $ < P.children.length; $++) {
        var M = P.children[$], T = P.leaf ? S(M, y, E) : a(y, E, M);
        T > A || O.push({
          node: M,
          dist: T
        });
      }
      for (; O.length && !O.peek().node.children; ) {
        var _ = O.pop(), N = _.node, C = S(N, w, y), D = S(N, E, k);
        if (_.dist < C && _.dist < D && l(y, N, B) && l(E, N, B)) return N;
      }
      P = O.pop(), P && (P = P.node);
    }
    return null;
  }
  function i(h, w) {
    return h.dist - w.dist;
  }
  function a(h, w, y) {
    if (c(h, y) || c(w, y)) return 0;
    var E = I(h[0], h[1], w[0], w[1], y.minX, y.minY, y.maxX, y.minY);
    if (E === 0) return 0;
    var k = I(h[0], h[1], w[0], w[1], y.minX, y.minY, y.minX, y.maxY);
    if (k === 0) return 0;
    var A = I(h[0], h[1], w[0], w[1], y.maxX, y.minY, y.maxX, y.maxY);
    if (A === 0) return 0;
    var B = I(h[0], h[1], w[0], w[1], y.minX, y.maxY, y.maxX, y.maxY);
    return B === 0 ? 0 : Math.min(E, k, A, B);
  }
  function c(h, w) {
    return h[0] >= w.minX && h[0] <= w.maxX && h[1] >= w.minY && h[1] <= w.maxY;
  }
  function l(h, w, y) {
    for (var E = Math.min(h[0], w[0]), k = Math.min(h[1], w[1]), A = Math.max(h[0], w[0]), B = Math.max(h[1], w[1]), O = y.search({ minX: E, minY: k, maxX: A, maxY: B }), P = 0; P < O.length; P++)
      if (f(O[P].p, O[P].next.p, h, w)) return !1;
    return !0;
  }
  function u(h, w, y) {
    return n(h[0], h[1], w[0], w[1], y[0], y[1]);
  }
  function f(h, w, y, E) {
    return h !== E && w !== y && u(h, w, y) > 0 != u(h, w, E) > 0 && u(y, E, h) > 0 != u(y, E, w) > 0;
  }
  function d(h) {
    var w = h.p, y = h.next.p;
    return h.minX = Math.min(w[0], y[0]), h.minY = Math.min(w[1], y[1]), h.maxX = Math.max(w[0], y[0]), h.maxY = Math.max(w[1], y[1]), h;
  }
  function b(h) {
    for (var w = h[0], y = h[0], E = h[0], k = h[0], A = 0; A < h.length; A++) {
      var B = h[A];
      B[0] < w[0] && (w = B), B[0] > E[0] && (E = B), B[1] < y[1] && (y = B), B[1] > k[1] && (k = B);
    }
    var O = [w, y, E, k], P = O.slice();
    for (A = 0; A < h.length; A++)
      e(h[A], O) || P.push(h[A]);
    return m(P);
  }
  function v(h, w) {
    var y = {
      p: h,
      prev: null,
      next: null,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };
    return w ? (y.next = w.next, y.prev = w, w.next.prev = y, w.next = y) : (y.prev = y, y.next = y), y;
  }
  function p(h, w) {
    var y = h[0] - w[0], E = h[1] - w[1];
    return y * y + E * E;
  }
  function S(h, w, y) {
    var E = w[0], k = w[1], A = y[0] - E, B = y[1] - k;
    if (A !== 0 || B !== 0) {
      var O = ((h[0] - E) * A + (h[1] - k) * B) / (A * A + B * B);
      O > 1 ? (E = y[0], k = y[1]) : O > 0 && (E += A * O, k += B * O);
    }
    return A = h[0] - E, B = h[1] - k, A * A + B * B;
  }
  function I(h, w, y, E, k, A, B, O) {
    var P = y - h, $ = E - w, M = B - k, T = O - A, _ = h - k, N = w - A, C = P * P + $ * $, D = P * M + $ * T, x = M * M + T * T, F = P * _ + $ * N, R = M * _ + T * N, X = C * x - D * D, q, L, U, j, K = X, H = X;
    X === 0 ? (L = 0, K = 1, j = R, H = x) : (L = D * R - x * F, j = C * R - D * F, L < 0 ? (L = 0, j = R, H = x) : L > K && (L = K, j = R + D, H = x)), j < 0 ? (j = 0, -F < 0 ? L = 0 : -F > C ? L = K : (L = -F, K = C)) : j > H && (j = H, -F + D < 0 ? L = 0 : -F + D > C ? L = K : (L = -F + D, K = C)), q = L === 0 ? 0 : L / K, U = j === 0 ? 0 : j / H;
    var G = (1 - q) * h + q * y, J = (1 - q) * w + q * E, Z = (1 - U) * k + U * B, Q = (1 - U) * A + U * O, at = Z - G, ut = Q - J;
    return at * at + ut * ut;
  }
  function g(h, w) {
    return h[0] === w[0] ? h[1] - w[1] : h[0] - w[0];
  }
  function m(h) {
    h.sort(g);
    for (var w = [], y = 0; y < h.length; y++) {
      for (; w.length >= 2 && u(w[w.length - 2], w[w.length - 1], h[y]) <= 0; )
        w.pop();
      w.push(h[y]);
    }
    for (var E = [], k = h.length - 1; k >= 0; k--) {
      for (; E.length >= 2 && u(E[E.length - 2], E[E.length - 1], h[k]) <= 0; )
        E.pop();
      E.push(h[k]);
    }
    return E.pop(), w.pop(), w.concat(E);
  }
  return he.exports;
}
var Yi = Li();
const qi = /* @__PURE__ */ Bi(Yi);
function fn(r, t = {}) {
  t.concavity = t.concavity || 1 / 0;
  const e = [];
  if ($e(r, (s) => {
    e.push([s[0], s[1]]);
  }), !e.length)
    return null;
  const n = qi(e, t.concavity);
  return n.length > 3 ? re([n], t.properties) : null;
}
const un = Math.pow(2, -52), de = new Uint32Array(512);
class Le {
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
  static from(t, e = Hi, n = Ki) {
    const s = t.length, o = new Float64Array(s * 2);
    for (let i = 0; i < s; i++) {
      const a = t[i];
      o[2 * i] = e(a), o[2 * i + 1] = n(a);
    }
    return new Le(o);
  }
  /**
   * Constructs a delaunay triangulation object given an array of point coordinates of the form:
   * `[x0, y0, x1, y1, ...]` (use a typed array for best performance). Duplicate points are skipped.
   *
   * @param {T} coords
   */
  constructor(t) {
    const e = t.length >> 1;
    if (e > 0 && typeof t[0] != "number") throw new Error("Expected coords to contain numbers.");
    this.coords = t;
    const n = Math.max(2 * e - 5, 0);
    this._triangles = new Uint32Array(n * 3), this._halfedges = new Int32Array(n * 3), this._hashSize = Math.ceil(Math.sqrt(e)), this._hullPrev = new Uint32Array(e), this._hullNext = new Uint32Array(e), this._hullTri = new Uint32Array(e), this._hullHash = new Int32Array(this._hashSize), this._ids = new Uint32Array(e), this._dists = new Float64Array(e), this.trianglesLen = 0, this._cx = 0, this._cy = 0, this._hullStart = 0, this.hull = this._triangles, this.triangles = this._triangles, this.halfedges = this._halfedges, this.update();
  }
  /**
   * Updates the triangulation if you modified `delaunay.coords` values in place, avoiding expensive memory allocations.
   * Useful for iterative relaxation algorithms such as Lloyd's.
   */
  update() {
    const { coords: t, _hullPrev: e, _hullNext: n, _hullTri: s, _hullHash: o } = this, i = t.length >> 1;
    let a = 1 / 0, c = 1 / 0, l = -1 / 0, u = -1 / 0;
    for (let A = 0; A < i; A++) {
      const B = t[2 * A], O = t[2 * A + 1];
      B < a && (a = B), O < c && (c = O), B > l && (l = B), O > u && (u = O), this._ids[A] = A;
    }
    const f = (a + l) / 2, d = (c + u) / 2;
    let b = 0, v = 0, p = 0;
    for (let A = 0, B = 1 / 0; A < i; A++) {
      const O = Ce(f, d, t[2 * A], t[2 * A + 1]);
      O < B && (b = A, B = O);
    }
    const S = t[2 * b], I = t[2 * b + 1];
    for (let A = 0, B = 1 / 0; A < i; A++) {
      if (A === b) continue;
      const O = Ce(S, I, t[2 * A], t[2 * A + 1]);
      O < B && O > 0 && (v = A, B = O);
    }
    let g = t[2 * v], m = t[2 * v + 1], h = 1 / 0;
    for (let A = 0; A < i; A++) {
      if (A === b || A === v) continue;
      const B = Vi(S, I, g, m, t[2 * A], t[2 * A + 1]);
      B < h && (p = A, h = B);
    }
    let w = t[2 * p], y = t[2 * p + 1];
    if (h === 1 / 0) {
      for (let O = 0; O < i; O++)
        this._dists[O] = t[2 * O] - t[0] || t[2 * O + 1] - t[1];
      zt(this._ids, this._dists, 0, i - 1);
      const A = new Uint32Array(i);
      let B = 0;
      for (let O = 0, P = -1 / 0; O < i; O++) {
        const $ = this._ids[O], M = this._dists[$];
        M > P && (A[B++] = $, P = M);
      }
      this.hull = A.subarray(0, B), this.triangles = new Uint32Array(0), this.halfedges = new Int32Array(0);
      return;
    }
    if (ft(S, I, g, m, w, y) < 0) {
      const A = v, B = g, O = m;
      v = p, g = w, m = y, p = A, w = B, y = O;
    }
    const E = zi(S, I, g, m, w, y);
    this._cx = E.x, this._cy = E.y;
    for (let A = 0; A < i; A++)
      this._dists[A] = Ce(t[2 * A], t[2 * A + 1], E.x, E.y);
    zt(this._ids, this._dists, 0, i - 1), this._hullStart = b;
    let k = 3;
    n[b] = e[p] = v, n[v] = e[b] = p, n[p] = e[v] = b, s[b] = 0, s[v] = 1, s[p] = 2, o.fill(-1), o[this._hashKey(S, I)] = b, o[this._hashKey(g, m)] = v, o[this._hashKey(w, y)] = p, this.trianglesLen = 0, this._addTriangle(b, v, p, -1, -1, -1);
    for (let A = 0, B = 0, O = 0; A < this._ids.length; A++) {
      const P = this._ids[A], $ = t[2 * P], M = t[2 * P + 1];
      if (A > 0 && Math.abs($ - B) <= un && Math.abs(M - O) <= un || (B = $, O = M, P === b || P === v || P === p)) continue;
      let T = 0;
      for (let x = 0, F = this._hashKey($, M); x < this._hashSize && (T = o[(F + x) % this._hashSize], !(T !== -1 && T !== n[T])); x++)
        ;
      T = e[T];
      let _ = T, N;
      for (; N = n[_], ft($, M, t[2 * _], t[2 * _ + 1], t[2 * N], t[2 * N + 1]) >= 0; )
        if (_ = N, _ === T) {
          _ = -1;
          break;
        }
      if (_ === -1) continue;
      let C = this._addTriangle(_, P, n[_], -1, -1, s[_]);
      s[P] = this._legalize(C + 2), s[_] = C, k++;
      let D = n[_];
      for (; N = n[D], ft($, M, t[2 * D], t[2 * D + 1], t[2 * N], t[2 * N + 1]) < 0; )
        C = this._addTriangle(D, P, N, s[P], -1, s[D]), s[P] = this._legalize(C + 2), n[D] = D, k--, D = N;
      if (_ === T)
        for (; N = e[_], ft($, M, t[2 * N], t[2 * N + 1], t[2 * _], t[2 * _ + 1]) < 0; )
          C = this._addTriangle(N, P, _, -1, s[_], s[N]), this._legalize(C + 2), s[N] = C, n[_] = _, k--, _ = N;
      this._hullStart = e[P] = _, n[_] = e[D] = P, n[P] = D, o[this._hashKey($, M)] = P, o[this._hashKey(t[2 * _], t[2 * _ + 1])] = _;
    }
    this.hull = new Uint32Array(k);
    for (let A = 0, B = this._hullStart; A < k; A++)
      this.hull[A] = B, B = n[B];
    this.triangles = this._triangles.subarray(0, this.trianglesLen), this.halfedges = this._halfedges.subarray(0, this.trianglesLen);
  }
  /**
   * Calculate an angle-based key for the edge hash used for advancing convex hull.
   *
   * @param {number} x
   * @param {number} y
   * @private
   */
  _hashKey(t, e) {
    return Math.floor(ji(t - this._cx, e - this._cy) * this._hashSize) % this._hashSize;
  }
  /**
   * Flip an edge in a pair of triangles if it doesn't satisfy the Delaunay condition.
   *
   * @param {number} a
   * @private
   */
  _legalize(t) {
    const { _triangles: e, _halfedges: n, coords: s } = this;
    let o = 0, i = 0;
    for (; ; ) {
      const a = n[t], c = t - t % 3;
      if (i = c + (t + 2) % 3, a === -1) {
        if (o === 0) break;
        t = de[--o];
        continue;
      }
      const l = a - a % 3, u = c + (t + 1) % 3, f = l + (a + 2) % 3, d = e[i], b = e[t], v = e[u], p = e[f];
      if (Ui(
        s[2 * d],
        s[2 * d + 1],
        s[2 * b],
        s[2 * b + 1],
        s[2 * v],
        s[2 * v + 1],
        s[2 * p],
        s[2 * p + 1]
      )) {
        e[t] = p, e[a] = d;
        const I = n[f];
        if (I === -1) {
          let m = this._hullStart;
          do {
            if (this._hullTri[m] === f) {
              this._hullTri[m] = t;
              break;
            }
            m = this._hullPrev[m];
          } while (m !== this._hullStart);
        }
        this._link(t, I), this._link(a, n[i]), this._link(i, f);
        const g = l + (a + 1) % 3;
        o < de.length && (de[o++] = g);
      } else {
        if (o === 0) break;
        t = de[--o];
      }
    }
    return i;
  }
  /**
   * Link two half-edges to each other.
   * @param {number} a
   * @param {number} b
   * @private
   */
  _link(t, e) {
    this._halfedges[t] = e, e !== -1 && (this._halfedges[e] = t);
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
  _addTriangle(t, e, n, s, o, i) {
    const a = this.trianglesLen;
    return this._triangles[a] = t, this._triangles[a + 1] = e, this._triangles[a + 2] = n, this._link(a, s), this._link(a + 1, o), this._link(a + 2, i), this.trianglesLen += 3, a;
  }
}
function ji(r, t) {
  const e = r / (Math.abs(r) + Math.abs(t));
  return (t > 0 ? 3 - e : 1 + e) / 4;
}
function Ce(r, t, e, n) {
  const s = r - e, o = t - n;
  return s * s + o * o;
}
function Ui(r, t, e, n, s, o, i, a) {
  const c = r - i, l = t - a, u = e - i, f = n - a, d = s - i, b = o - a, v = c * c + l * l, p = u * u + f * f, S = d * d + b * b;
  return c * (f * S - p * b) - l * (u * S - p * d) + v * (u * b - f * d) < 0;
}
function Vi(r, t, e, n, s, o) {
  const i = e - r, a = n - t, c = s - r, l = o - t, u = i * i + a * a, f = c * c + l * l, d = 0.5 / (i * l - a * c), b = (l * u - a * f) * d, v = (i * f - c * u) * d;
  return b * b + v * v;
}
function zi(r, t, e, n, s, o) {
  const i = e - r, a = n - t, c = s - r, l = o - t, u = i * i + a * a, f = c * c + l * l, d = 0.5 / (i * l - a * c), b = r + (l * u - a * f) * d, v = t + (i * f - c * u) * d;
  return { x: b, y: v };
}
function zt(r, t, e, n) {
  if (n - e <= 20)
    for (let s = e + 1; s <= n; s++) {
      const o = r[s], i = t[o];
      let a = s - 1;
      for (; a >= e && t[r[a]] > i; ) r[a + 1] = r[a--];
      r[a + 1] = o;
    }
  else {
    const s = e + n >> 1;
    let o = e + 1, i = n;
    Gt(r, s, o), t[r[e]] > t[r[n]] && Gt(r, e, n), t[r[o]] > t[r[n]] && Gt(r, o, n), t[r[e]] > t[r[o]] && Gt(r, e, o);
    const a = r[o], c = t[a];
    for (; ; ) {
      do
        o++;
      while (t[r[o]] < c);
      do
        i--;
      while (t[r[i]] > c);
      if (i < o) break;
      Gt(r, o, i);
    }
    r[e + 1] = r[i], r[i] = a, n - o + 1 >= i - e ? (zt(r, t, o, n), zt(r, t, e, i - 1)) : (zt(r, t, e, i - 1), zt(r, t, o, n));
  }
}
function Gt(r, t, e) {
  const n = r[t];
  r[t] = r[e], r[e] = n;
}
function Hi(r) {
  return r[0];
}
function Ki(r) {
  return r[1];
}
class Wi {
  bs;
  width;
  constructor(t, e) {
    this.width = t, this.bs = e;
  }
  /** Copy of the underlying bits (for restoring the set later with {@link load}). */
  copyBits() {
    return this.bs.slice();
  }
  /** Replace the contents with bits taken by {@link copyBits} from a set of the same length. */
  load(t) {
    return this.bs.set(t), this;
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
    const n = Math.floor(t / this.width), o = 1 << t % this.width;
    return this.bs[n] ^= (-Number(e) ^ this.bs[n]) & o, e;
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
      let s = 0;
      for (; this.bs[n] && s < this.width; )
        this.bs[n] & 1 << s && t(n * this.width + s), s++;
    }
    return this;
  }
}
class hn extends Wi {
  constructor(t) {
    super(8, new Uint8Array(Math.ceil(t / 8)).fill(0));
  }
}
function At(r) {
  return r % 3 === 2 ? r - 2 : r + 1;
}
function xt(r) {
  return r % 3 === 0 ? r + 2 : r - 1;
}
function dn(r, t, e, n, s, o, i, a) {
  const c = ft(r, t, s, o, i, a), l = ft(e, n, s, o, i, a);
  if (c > 0 && l > 0 || c < 0 && l < 0)
    return !1;
  const u = ft(s, o, r, t, e, n), f = ft(i, a, r, t, e, n);
  return u > 0 && f > 0 || u < 0 && f < 0 ? !1 : c === 0 && l === 0 && u === 0 && f === 0 ? !(Math.max(s, i) < Math.min(r, e) || Math.max(r, e) < Math.min(s, i) || Math.max(o, a) < Math.min(t, n) || Math.max(t, n) < Math.min(o, a)) : !0;
}
class Gi {
  /**
   * The triangulation object from Delaunator.
   */
  del;
  constructor(t) {
    this.del = t;
  }
}
class te extends Gi {
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
    const n = 2 ** 32 - 1, s = t.coords.length >> 1, o = t.triangles.length;
    this.vertMap = new Uint32Array(s).fill(n), this.flips = new hn(o), this.consd = new hn(o);
    for (let i = 0; i < o; i++) {
      const a = t.triangles[i];
      this.vertMap[a] === n && this.updateVert(i);
    }
    e && this.constrainAll(e);
  }
  /** 現在の三角網と制約の状態を控える（三角網の配列は複製する）。 */
  snapshot() {
    const { coords: t, hull: e, triangles: n, halfedges: s } = this.del;
    return {
      coords: t,
      hull: e,
      triangles: Uint32Array.from(n),
      halfedges: Int32Array.from(s),
      vertMap: this.vertMap.slice(),
      flips: this.flips.copyBits(),
      consd: this.consd.copyBits()
    };
  }
  /** {@link snapshot} で控えた状態を、新しい配列に複製して復元する（控えは何度でも使える）。 */
  static restore(t) {
    const e = new te({
      coords: t.coords,
      hull: t.hull,
      triangles: t.triangles.slice(),
      halfedges: t.halfedges.slice()
    });
    return e.vertMap.set(t.vertMap), e.flips.load(t.flips), e.consd.load(t.consd), e;
  }
  /**
   * Constrain the triangulation such that there is an edge between p1 and p2.
   */
  constrainOne(t, e) {
    const { triangles: n, halfedges: s } = this.del;
    this.assertVertex(t, t, e), this.assertVertex(e, t, e), this.assertInTriangulation(t, t, e), this.assertInTriangulation(e, t, e);
    const o = this.vertMap[t], i = this.maxConstrainSteps();
    let a = 0, c = o;
    do {
      if (++a > i)
        throw new Error(
          `Constraining edge [${t}, ${e}] exceeded the iteration limit`
        );
      const f = n[c], d = At(c);
      if (f === e)
        return this.protect(c);
      const b = xt(c), v = n[b];
      if (v === e)
        return this.protect(d), d;
      if (this.intersectSegments(t, e, v, f)) {
        c = b;
        break;
      }
      c = s[d];
    } while (c !== -1 && c !== o);
    let l = c, u = -1;
    for (; c !== -1; ) {
      if (++a > i)
        throw new Error(
          `Constraining edge [${t}, ${e}] exceeded the iteration limit`
        );
      const f = s[c], d = xt(c), b = xt(f), v = At(f);
      if (f === -1)
        throw new Error("Constraining edge exited the hull");
      if (this.consd.has(c))
        throw new Error("Edge intersects already constrained edge");
      if (this.isCollinear(t, e, n[c]) || this.isCollinear(t, e, n[f]))
        throw new Error("Constraining edge intersects point");
      if (!this.intersectSegments(
        n[c],
        n[f],
        n[d],
        n[b]
      )) {
        if (u === -1 && (u = c), n[b] === e) {
          if (c === u)
            throw new Error("Infinite loop: non-convex quadrilateral");
          c = u, u = -1;
          continue;
        }
        if (this.intersectSegments(
          t,
          e,
          n[b],
          n[f]
        ))
          c = b;
        else if (this.intersectSegments(
          t,
          e,
          n[v],
          n[b]
        ))
          c = v;
        else if (u === c)
          throw new Error("Infinite loop: no further intersect after non-convex");
        continue;
      }
      if (this.flipDiagonal(c), this.intersectSegments(
        t,
        e,
        n[d],
        n[b]
      ) && (u === -1 && (u = d), u === d))
        throw new Error("Infinite loop: flipped diagonal still intersects");
      n[b] === e ? (l = b, c = u, u = -1) : this.intersectSegments(
        t,
        e,
        n[v],
        n[b]
      ) && (c = v);
    }
    return this.protect(l), this.delaunify(!0), this.findEdge(t, e);
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
  assertInTriangulation(t, e, n) {
    if (this.vertMap[t] >= this.del.triangles.length)
      throw new Error(
        `Invalid edge [${e}, ${n}]: vertex ${t} is not part of the triangulation`
      );
  }
  /**
   * Throw unless `vertex` is an id of a point given to Delaunator.
   */
  assertVertex(t, e, n) {
    const s = this.vertMap.length;
    if (!Number.isInteger(t) || t < 0 || t >= s)
      throw new Error(
        `Invalid edge [${String(e)}, ${String(n)}]: vertex ids must be integers from 0 to ${s - 1}`
      );
  }
  /**
   * Fix the Delaunay condition.
   */
  delaunify(t = !1) {
    const { halfedges: e } = this.del, n = this.flips, s = this.consd, o = e.length;
    let i;
    do {
      i = 0;
      for (let a = 0; a < o; a++) {
        if (s.has(a))
          continue;
        n.delete(a);
        const c = e[a];
        c !== -1 && (n.delete(c), this.isDelaunay(a) || (this.flipDiagonal(a), i++));
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
      const s = t[n];
      this.constrainOne(s[0], s[1]);
    }
    return this;
  }
  /**
   * 同じ群に属する点だけでできた三角形を、制約でない辺の反転で解消する（禁止制約）。
   *
   * 群の例: 四辺形の補助頂点の全体、必須エッジごとの端点と中継点。四辺形では角の前後の補助頂点を
   * 結ぶ弦（角と凸包の GCP の間をせき止める辺）が、必須エッジでは途中の点を飛ばす弦（片方の面で
   * 一直線に並び面積 0 になる三角形の辺）が反転される。
   *
   * 反転は、反転後の 2 つの三角形が `planes` のすべての面で、その面の三角網の向き（三角形の向きの
   * 多数決）と同じ向きの、面積 0 でない三角形になるときだけ行う。制約された辺・外周の辺は反転しない。
   * 違反が無くなるか、1 周して反転が起きなくなったら止める。
   *
   * @param groupsOf 点の番号から、その点が属する群の番号の配列（属さなければ空）
   * @param planes 向きを確かめる面の座標（`coords` と同じ並び）。既定は三角網を作った面だけ
   * @returns 反転した数と、解消できずに残った違反の三角形の数
   */
  forbidGroupTriangles(t, e = [this.del.coords]) {
    const { triangles: n, halfedges: s } = this.del, o = n.length / 3, i = (v, p, S) => {
      const I = t(p), g = t(S);
      return t(v).some((m) => I.includes(m) && g.includes(m));
    }, a = (v) => i(n[v * 3], n[v * 3 + 1], n[v * 3 + 2]), c = (v, p, S, I) => Math.sign(ft(v[p * 2], v[p * 2 + 1], v[S * 2], v[S * 2 + 1], v[I * 2], v[I * 2 + 1])), l = e.map((v) => {
      let p = 0;
      for (let S = 0; S < o; S++) p += c(v, n[S * 3], n[S * 3 + 1], n[S * 3 + 2]);
      return p < 0 ? -1 : 1;
    }), u = (v) => {
      if (this.consd.has(v)) return !1;
      const p = s[v];
      if (p === -1) return !1;
      const S = n[v], I = n[At(v)], g = n[xt(v)], m = n[xt(p)];
      return e.every((h, w) => c(h, g, S, m) === l[w] && c(h, m, I, g) === l[w]);
    };
    let f = 0, d = !0;
    for (; d; ) {
      d = !1;
      for (let v = 0; v < o; v++)
        if (a(v))
          for (let p = 0; p < 3; p++) {
            const S = v * 3 + p;
            if (!u(S)) continue;
            const I = s[S], g = n[S], m = n[At(S)], h = n[xt(S)], w = n[xt(I)];
            if (!(i(h, g, w) && i(w, m, h))) {
              this.protect(this.flipDiagonal(S)), f++, d = !0;
              break;
            }
          }
    }
    let b = 0;
    for (let v = 0; v < o; v++) a(v) && b++;
    return { flips: f, remaining: b };
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
    const n = this.vertMap[e], { triangles: s, halfedges: o } = this.del;
    if (!(n < s.length))
      return 1 / 0;
    let i = n, a, c = 0;
    do {
      if (++c > s.length)
        throw new Error(
          `Looking up edge [${t}, ${e}] exceeded the iteration limit`
        );
      if (s[i] === t)
        return i;
      a = At(i), i = o[a];
    } while (i !== -1 && i !== n);
    return s[At(a)] === t ? -a : 1 / 0;
  }
  /**
   * Mark an edge as constrained, i.e. should not be touched by `delaunify`.
   */
  protect(t) {
    const e = this.del.halfedges[t], n = this.flips, s = this.consd;
    return n.delete(t), s.add(t), e !== -1 ? (n.delete(e), s.add(e), e) : -t;
  }
  /**
   * Mark an edge as flipped unless constrained.
   */
  markFlip(t) {
    const e = this.del.halfedges, n = this.flips;
    if (this.consd.has(t))
      return !1;
    const o = e[t];
    return o !== -1 && (n.add(t), n.add(o)), !0;
  }
  /**
   * Flip the edge shared by two triangles.
   */
  flipDiagonal(t) {
    const { triangles: e, halfedges: n } = this.del, s = this.flips, o = this.consd, i = n[t], a = xt(t), c = At(t), l = xt(i), u = At(i), f = n[a], d = n[l];
    if (o.has(t))
      throw new Error("Trying to flip a constrained edge");
    return e[t] = e[l], n[t] = d, s.set(t, s.has(l)) || o.set(t, o.has(l)), d !== -1 && (n[d] = t), n[a] = l, e[i] = e[a], n[i] = f, s.set(i, s.has(a)) || o.set(i, o.has(a)), f !== -1 && (n[f] = i), n[l] = a, this.markFlip(t), this.markFlip(c), this.markFlip(i), this.markFlip(u), s.add(a), o.delete(a), s.add(l), o.delete(l), this.updateVert(t), this.updateVert(c), this.updateVert(i), this.updateVert(u), a;
  }
  /**
   * Whether point p1, p2, and p are collinear.
   */
  isCollinear(t, e, n) {
    const s = this.del.coords;
    return ft(
      s[t * 2],
      s[t * 2 + 1],
      s[e * 2],
      s[e * 2 + 1],
      s[n * 2],
      s[n * 2 + 1]
    ) === 0;
  }
  /**
   * Whether the triangle formed by p1, p2, p3 keeps px outside the circumcircle.
   */
  inCircle(t, e, n, s) {
    const o = this.del.coords;
    return ui(
      o[t * 2],
      o[t * 2 + 1],
      o[e * 2],
      o[e * 2 + 1],
      o[n * 2],
      o[n * 2 + 1],
      o[s * 2],
      o[s * 2 + 1]
    ) < 0;
  }
  /**
   * Whether the triangles sharing edg conform to the Delaunay condition.
   */
  isDelaunay(t) {
    const { triangles: e, halfedges: n } = this.del, s = n[t];
    if (s === -1)
      return !0;
    const o = e[xt(t)], i = e[t], a = e[At(t)], c = e[xt(s)];
    return !this.inCircle(o, i, a, c);
  }
  /**
   * Update the vertex -> incoming edge map.
   */
  updateVert(t) {
    const { triangles: e, halfedges: n } = this.del, s = this.vertMap, o = e[t];
    let i = xt(t), a = n[i];
    for (; a !== -1 && a !== t; )
      i = xt(a), a = n[i];
    return s[o] = i, i;
  }
  /**
   * Whether the segments between vertices intersect.
   */
  intersectSegments(t, e, n, s) {
    const o = this.del.coords;
    return t === n || t === s || e === n || e === s ? !1 : dn(
      o[t * 2],
      o[t * 2 + 1],
      o[e * 2],
      o[e * 2 + 1],
      o[n * 2],
      o[n * 2 + 1],
      o[s * 2],
      o[s * 2 + 1]
    );
  }
  static intersectSegments = dn;
}
function pe(r, t, e) {
  return De(r, t, e).tin;
}
function De(r, t, e, n, s) {
  if (t || (t = []), typeof r != "object" || r.type !== "FeatureCollection")
    throw "Argument points must be FeatureCollection";
  if (!Array.isArray(t)) throw "Argument points must be Array of Array";
  const o = r.features.map(
    (p) => p.geometry.coordinates
  );
  let i = s?.snapshot ? te.restore(s.snapshot) : void 0;
  const a = i ? void 0 : Le.from(o);
  let c = i ? i.del : a, l = 0, u;
  const f = [];
  if (c.triangles.length !== 0 && (t.length !== 0 || n)) {
    if (!i) {
      i = new te(c);
      try {
        i.constrainAll(t);
      } catch (I) {
        if (!n?.allowUnusableBoundary) throw I;
        return { tin: Mt([]), remaining: 0, hasBoundary: !1, hull: [] };
      }
      s && (s.snapshot = i.snapshot());
    }
    const p = n ? s?.snapshot ?? i.snapshot() : void 0, S = (I) => {
      const g = te.restore(p);
      return g.constrainAll(I), g;
    };
    for (const I of n?.hull ?? [])
      try {
        i.constrainOne(I[0], I[1]), f.push(I);
      } catch {
        i = S(f);
      }
    n?.boundary && (u = Ji(i, n.boundary), u || (i = S(f))), n && ({ remaining: l } = i.forbidGroupTriangles(
      n.groupsOf,
      n.planes
    ), l -= u?.size ?? 0), c = i.del;
  }
  const d = [];
  for (let p = 0; p < c.triangles.length; p += 3)
    u?.has(p / 3) || d.push([c.triangles[p], c.triangles[p + 1], c.triangles[p + 2]]);
  const b = ["a", "b", "c"];
  return { tin: Mt(
    d.map((p) => {
      const S = {}, I = p.map((g, m) => {
        const h = r.features[g], w = h.geometry.coordinates, y = [w[0], w[1]];
        return w.length === 3 ? y[2] = w[2] : S[b[m]] = h.properties[e], y;
      });
      return I[3] = I[0], re([I], S);
    })
  ), remaining: l, hasBoundary: u !== void 0, hull: f };
}
function Ji(r, t) {
  try {
    r.constrainAll(t);
  } catch {
    return;
  }
  const e = new Map(t), { triangles: n, halfedges: s } = r.del, o = (l) => {
    const u = n[l], f = n[At(l)];
    return e.get(u) === f || e.get(f) === u;
  }, i = /* @__PURE__ */ new Set(), a = [], c = (l) => {
    const u = Math.floor(l / 3);
    i.has(u) || (i.add(u), a.push(u));
  };
  for (let l = 0; l < s.length; l++)
    s[l] === -1 && !o(l) && c(l);
  for (let l = 0; l < a.length; l++)
    for (let u = a[l] * 3; u < a[l] * 3 + 3; u++) {
      if (!e.has(n[u])) return;
      s[u] !== -1 && !o(u) && c(s[u]);
    }
  return i;
}
function pn(r) {
  const t = /* @__PURE__ */ new Set(), e = [];
  if (r.forEach(([c, l], u) => {
    const f = `${c}:${l}`;
    t.has(f) || (t.add(f), e.push({ i: u, x: c, y: l }));
  }), e.length < 3) return [];
  const n = (c, l, u) => ft(c.x, c.y, l.x, l.y, u.x, u.y), s = [...e].sort((c, l) => c.x - l.x || c.y - l.y), o = (c) => {
    const l = [];
    for (const u of c) {
      for (; l.length >= 2 && n(l[l.length - 2], l[l.length - 1], u) <= 0; ) l.pop();
      l.push(u);
    }
    return l.pop(), l;
  }, i = [...o(s), ...o([...s].reverse())];
  if (i.length < 3) return [];
  const a = [];
  for (let c = 0; c < i.length; c++) {
    const l = i[c], u = i[(c + 1) % i.length], f = u.x - l.x, d = u.y - l.y, b = f * f + d * d, v = e.filter((S) => S !== l && S !== u && n(l, u, S) === 0).map((S) => ({ r: S, t: ((S.x - l.x) * f + (S.y - l.y) * d) / b })).filter(({ t: S }) => S > 0 && S < 1).sort((S, I) => S.t - I.t).map(({ r: S }) => S), p = [l, ...v, u];
    for (let S = 0; S + 1 < p.length; S++) a.push([p[S].i, p[S + 1].i]);
  }
  return a;
}
function ve([r, t]) {
  return r < t ? `${r}-${t}` : `${t}-${r}`;
}
function Ut(r, t, e) {
  return Yt(r, { target: { geom: t, index: e } });
}
function Vt(r) {
  return Yt(r.properties.target.geom, {
    target: {
      geom: r.geometry.coordinates,
      index: r.properties.target.index
    }
  });
}
function gn(r, t) {
  const e = r.length, n = t.geometry.coordinates;
  return Array.from({ length: e }, (s, o) => o).map((s) => {
    const o = (s + 1) % e, i = r[s], a = r[o], c = i.geometry.coordinates, l = Math.atan2(
      c[0] - n[0],
      c[1] - n[1]
    ), u = [t, i, a, t].map(
      (b) => b.geometry.coordinates
    ), f = {
      a: {
        geom: t.properties.target.geom,
        index: t.properties.target.index
      },
      b: {
        geom: i.properties.target.geom,
        index: i.properties.target.index
      },
      c: {
        geom: a.properties.target.geom,
        index: a.properties.target.index
      }
    }, d = Mt([
      re([u], f)
    ]);
    return [l, d];
  }).reduce(
    (s, o) => (s[0].push(o[0]), s[1].push(o[1]), s),
    [[], []]
  );
}
const Qi = [0.1, 0.15, 0.225, 0.34, 0.5];
function Zi(r, t) {
  return t ? r.hasBoundary !== t.hasBoundary ? r.hasBoundary : r.diagnostics.boundaryTriangleFlips < t.diagnostics.boundaryTriangleFlips : !0;
}
function mn(r, t, e) {
  return Math.sign(ft(r[0], r[1], t[0], t[1], e[0], e[1]));
}
function be(r, t = -1) {
  let e = 0;
  for (const n of r.features) {
    const { a: s, b: o, c: i } = n.properties;
    if (![s, o, i].some(
      ({ index: f }) => typeof f == "string" && f.startsWith("b")
    ))
      continue;
    const [a, c, l] = n.geometry.coordinates[0];
    mn(a, c, l) * mn(s.geom, o.geom, i.geom) * t <= 0 && e++;
  }
  return e;
}
function wn(r, t, e) {
  if (r.some(([i, a]) => i === t[0] && a === t[1])) return !1;
  const n = r.map(
    ([i, a]) => Math.atan2(a - t[1], i - t[0])
  ), s = 2 * Math.PI;
  let o = 0;
  for (let i = 0; i < n.length; i++) {
    const c = (e * (n[(i + 1) % n.length] - n[i]) + s) % s;
    if (!(c > 0 && c < Math.PI)) return !1;
    o += c;
  }
  return Math.abs(o - s) < 1e-6;
}
function tr(r, t) {
  const e = new Set(
    t.forw.map(({ geometry: s }) => String(s.coordinates))
  ), n = new Set(
    t.bakw.map(({ geometry: s }) => String(s.coordinates))
  );
  return r.filter(({ forw: s, bakw: o }) => {
    const i = String(s), a = String(o);
    return e.has(i) || n.has(a) ? !1 : (e.add(i), n.add(a), !0);
  });
}
function yn(r, t, e, n, s, o = /* @__PURE__ */ new Set(), i) {
  const { minx: a, maxx: c, miny: l, maxy: u, centroid: f } = r, d = c - a, b = u - l, v = e.forw.length, p = Array.from({ length: v }, () => []);
  let S = 1;
  for (const [E, k] of e.edges)
    E < n && p[E].push(S), p[k].push(S), k < n && S++;
  const I = (E) => E.slice(0, v).map(({ geometry: k }) => k.coordinates), g = pn(I(e.forw)), m = {
    forw: g.filter((E) => !o.has(ve(E))),
    bakw: pn(I(e.bakw))
  }, h = [0], w = (E) => E >= v ? h : p[E];
  let y;
  for (const E of Qi) {
    const k = i?.get(E) ?? { forwReuse: {} };
    i?.set(E, k);
    const A = k.vertices ?? (k.vertices = tr(
      t(
        {
          ...r,
          minx: a - E * d,
          maxx: c + E * d,
          miny: l - E * b,
          maxy: u + E * b
        },
        !0
      ),
      e
    ));
    if (s && (A.length < 4 || !A.every(({ bakw: L }) => L.every(Number.isFinite)))) continue;
    const B = A.map(
      ({ forw: L, bakw: U }, j) => Ut(L, U, `b${j}`)
    ), O = Mt([...e.forw, ...B]), P = Mt([
      ...e.bakw,
      ...B.map(Vt)
    ]), $ = [O, P].map(
      ({ features: L }) => Float64Array.from(
        L.flatMap(
          ({
            geometry: {
              coordinates: [U, j]
            }
          }) => [U, j]
        )
      )
    ), T = s !== void 0 || wn(
      A.map((L) => L.forw),
      f.forw,
      -1
    ) && wn(
      A.map((L) => L.bakw),
      f.bakw,
      1
    ) ? A.map((L, U) => [
      v + U,
      v + (U + 1) % A.length
    ]) : void 0, _ = { groupsOf: w, planes: $, boundary: T, allowUnusableBoundary: s !== void 0 }, N = s?.orientation ?? -1, C = De(
      O,
      e.edges,
      "target",
      { ..._, hull: m.forw },
      k.forwReuse
    ), D = k.geographic ?? (k.geographic = (() => {
      const L = De(P, e.edges, "target", {
        ..._,
        hull: m.bakw
      });
      return { built: L, flips: be(L.tin, N) };
    })()), x = D.built, F = C.tin, R = {
      ...x.tin,
      features: [...x.tin.features]
    }, X = be(F, N) + D.flips, q = {
      vertices: A,
      forw: F,
      bakw: R,
      diagnostics: {
        margin: E,
        boundaryTriangleFlips: X,
        remainingForbiddenTriangles: C.remaining + x.remaining
      },
      hasMapBoundary: C.hasBoundary,
      hasBoundary: C.hasBoundary && x.hasBoundary,
      forwHull: { all: g, applied: C.hull }
    };
    if (s) {
      if (s.accept(q)) return q;
      continue;
    }
    if (X === 0 && q.hasBoundary)
      return q;
    Zi(q, y) && (y = q);
  }
  return y;
}
const er = 256 * Number.EPSILON, $n = 4, nr = 1e-9;
function ir(r) {
  const t = Math.abs(r);
  if (!Number.isFinite(t)) return NaN;
  const e = new DataView(new ArrayBuffer(8));
  e.setFloat64(0, t);
  const n = e.getUint32(0) >>> 20 & 2047;
  return Math.pow(2, Math.max(n, 1) - 1023 - 52);
}
function rr(r) {
  let t = 0;
  for (const e of r)
    t = Math.max(t, Math.abs(e[0]), Math.abs(e[1]));
  return t;
}
function sr(r, t, e = $n) {
  const n = (o) => {
    let i = 0;
    for (let c = 1; c < o.length; c++)
      i += Math.sqrt(
        Math.pow(o[c][0] - o[c - 1][0], 2) + Math.pow(o[c][1] - o[c - 1][1], 2)
      );
    const a = ir(rr(o)) / i;
    return Number.isFinite(a) ? a : 0;
  }, s = er + e * (n(r) + n(t));
  return Math.min(s, nr);
}
function or(r, t, e) {
  const n = new Int32Array(r.length).fill(-1), s = new Int32Array(t.length).fill(-1), o = r.length - 2, i = t.length - 2;
  if (o < 1 || i < 1) return { illstToMerc: n, mercToIllst: s };
  const a = (w, y) => Math.abs(t[y + 1][3] - r[w + 1][3]) <= e;
  let c = o, l = -1, u = i, f = -1;
  for (let w = 0; w < o; w++)
    for (let y = 0; y < i; y++)
      a(w, y) && (c = Math.min(c, w), l = Math.max(l, w), u = Math.min(u, y), f = Math.max(f, y));
  if (l < 0) return { illstToMerc: n, mercToIllst: s };
  const d = l - c + 1, b = f - u + 1, v = b + 1, p = new Int32Array((d + 1) * v), S = new Float64Array((d + 1) * v), I = new Uint8Array((d + 1) * v), g = (w, y, E, k) => w > E || w === E && y < k;
  for (let w = 1; w <= d; w++)
    for (let y = 1; y <= b; y++) {
      const E = w * v + y, k = E - v, A = E - 1;
      let B = p[k], O = S[k], P = 0;
      g(p[A], S[A], B, O) && (B = p[A], O = S[A], P = 1);
      const $ = c + w - 1, M = u + y - 1;
      if (a($, M)) {
        const T = k - 1, _ = p[T] + 1, N = S[T] + Math.abs(t[M + 1][3] - r[$ + 1][3]);
        g(_, N, B, O) && (B = _, O = N, P = 2);
      }
      p[E] = B, S[E] = O, I[E] = P;
    }
  let m = d, h = b;
  for (; m > 0 && h > 0; ) {
    const w = I[m * v + h];
    if (w === 2) {
      const y = c + m - 1 + 1, E = u + h - 1 + 1;
      n[y] = E, s[E] = y, m--, h--;
    } else w === 0 ? m-- : h--;
  }
  return { illstToMerc: n, mercToIllst: s };
}
function ar(r, t, e = $n) {
  const n = sr(r, t, e), s = [r, t].map((u) => {
    const f = u.map((b, v, p) => {
      if (v === 0) return 0;
      const S = p[v - 1];
      return Math.sqrt(
        Math.pow(b[0] - S[0], 2) + Math.pow(b[1] - S[1], 2)
      );
    }), d = f.reduce((b, v, p) => p === 0 ? [0] : (b.push(b[p - 1] + v), b), []);
    return d.map((b, v, p) => {
      const S = b / p[p.length - 1];
      return [u[v], f[v], d[v], S];
    });
  }), { illstToMerc: o, mercToIllst: i } = or(s[0], s[1], n), a = [o, i], c = (u, f) => {
    for (let d = 1; d < f.length - 1; d++)
      if (Math.abs(f[d][3] - u) <= n) return !0;
    return !1;
  }, l = [];
  return s.forEach((u, f) => {
    const d = s[f ? 0 : 1];
    u.forEach((b, v) => {
      if (v === 0 || v === u.length - 1) return;
      const p = b[0], S = b[3], I = a[f][v];
      if (I >= 0) {
        f === 0 && l.push([p, d[I][0], S]);
        return;
      }
      if (!c(S, d))
        for (let g = 0; g < d.length - 1; g++) {
          const m = d[g], h = d[g + 1], w = m[3], y = h[3];
          if (w < S && y > S) {
            const E = (S - w) / (y - w), k = [
              (h[0][0] - m[0][0]) * E + m[0][0],
              (h[0][1] - m[0][1]) * E + m[0][1]
            ];
            l.push(
              f === 0 ? [p, k, S] : [k, p, S]
            );
            return;
          }
        }
    });
  }), l.sort((u, f) => u[2] - f[2]);
}
const vn = 1e-9;
function cr(r, t) {
  const e = [[], [], [], []], n = [];
  return Object.keys(r).forEach((s) => {
    const o = r[s], i = o.forw, a = o.bakw, c = [
      i[0] - t.forw[0],
      i[1] - t.forw[1]
    ], l = [
      a[0] - t.bakw[0],
      t.bakw[1] - a[1]
    ], u = { forw: c, bakw: l };
    if (n.push(u), c[0] === 0 || c[1] === 0)
      return;
    let f = 0;
    c[0] > 0 && (f += 1), c[1] > 0 && (f += 2), e[f].push(u);
  }), { perQuad: e, aggregate: n };
}
function Xn(r) {
  let t = 1 / 0, e = 0, n = 0;
  return r.forEach((s) => {
    const { forw: o, bakw: i } = s, a = Math.hypot(o[0], o[1]), c = Math.hypot(i[0], i[1]);
    if (c === 0) return;
    const l = a / c, u = Math.atan2(o[0], o[1]) - Math.atan2(i[0], i[1]);
    t = Math.min(t, l), e += Math.cos(u), n += Math.sin(u);
  }), isFinite(t) ? [t, Math.atan2(n, e)] : [1, 0];
}
const lr = 0.6, fr = 3, ur = 0.5;
function hr(r) {
  let t = 0, e = 0, n = 0, s = 0;
  if (r.forEach(({ forw: i, bakw: a }) => {
    t += i[1] * a[1] + i[0] * a[0], e += i[0] * a[1] - i[1] * a[0], n += a[0] * a[0] + a[1] * a[1], s += i[0] * i[0] + i[1] * i[1];
  }), !(!(n > 0 && s > 0) || !(Math.hypot(t, e) / Math.sqrt(s * n) >= ur)))
    return [Math.hypot(t, e) / n, Math.atan2(e, t)];
}
function dr(r) {
  const t = (s) => Math.hypot(s.forw[0], s.forw[1]), e = Math.max(...r.map(t)), n = r.filter((s) => t(s) >= lr * e);
  return hr(n.length >= fr ? n : r) ?? Xn(r);
}
function pr(r, t, e, n) {
  const { perQuad: s, aggregate: o } = cr(r, t), i = s.every((u) => u.length > 0), a = e === "birdeye" ? i ? s : [o] : [o], c = n === "farLsq" ? dr : Xn, l = a.map((u) => c(u));
  return l.length === 1 ? [l[0], l[0], l[0], l[0]] : l;
}
function gr(r, t) {
  let e = 0;
  return r[0] > t[0] && (e += 1), r[1] > t[1] && (e += 2), e;
}
function mr(r, t, e) {
  const n = [
    r[0] - t.forw[0],
    r[1] - t.forw[1]
  ], o = Math.sqrt(n[0] ** 2 + n[1] ** 2) / e[0], i = Math.atan2(n[0], n[1]) - e[1];
  return [
    t.bakw[0] + o * Math.sin(i),
    t.bakw[1] - o * Math.cos(i)
  ];
}
function wr(r, t, e, n) {
  const s = t[0] - r[0], o = t[1] - r[1];
  if (Math.abs(s) < 1e-12 && Math.abs(o) < 1e-12) return null;
  const i = n[0] - e[0], a = n[1] - e[1], c = e[0] - r[0], l = e[1] - r[1], u = s * a - o * i;
  if (Math.abs(u) < 1e-12) return null;
  const f = (c * a - l * i) / u, d = (c * o - l * s) / u;
  return f <= 1e-10 || d < -1e-10 || d > 1 + 1e-10 ? null : { t: f, point: [r[0] + f * s, r[1] + f * o] };
}
function yr(r, t, e) {
  const n = e.length;
  let s = -1 / 0, o = null;
  for (let i = 0; i < n; i++) {
    const a = (i + 1) % n, c = wr(
      r,
      t,
      e[i].bakw,
      e[a].bakw
    );
    c && c.t > s && (s = c.t, o = c.point);
  }
  return o;
}
function bn(r, t) {
  const n = Math.atan2(r[0] - t[0], r[1] - t[1]) * (180 / Math.PI);
  return n < 0 ? n + 360 : n;
}
function Mn(r, t, e, n, s, o) {
  const i = t[0] - r[0], a = t[1] - r[1];
  if (i === 0 && a === 0) return null;
  const c = [];
  if (i !== 0)
    for (const u of [e, n]) {
      const f = (u - r[0]) / i;
      if (f > 0) {
        const d = r[1] + f * a;
        d >= s && d <= o && c.push({ t: f, x: u, y: d });
      }
    }
  if (a !== 0)
    for (const u of [s, o]) {
      const f = (u - r[1]) / a;
      if (f > 0) {
        const d = r[0] + f * i;
        d >= e && d <= n && c.push({ t: f, x: d, y: u });
      }
    }
  if (c.length === 0) return null;
  c.sort((u, f) => u.t - f.t);
  const l = c[0];
  return [l.x, l.y];
}
function xn(r, t, e) {
  const n = r.length, s = new Array(n).fill(1);
  for (const o of t)
    for (let i = 0; i < n; i++) {
      const a = (i + 1) % n, c = Ve([r[i].bakw, r[a].bakw]), l = Ve([e.bakw, o.bakw]), u = Ii(c, l);
      if (u.features.length > 0 && u.features[0].geometry) {
        const f = u.features[0], d = Math.sqrt(
          Math.pow(o.bakw[0] - e.bakw[0], 2) + Math.pow(o.bakw[1] - e.bakw[1], 2)
        ), b = Math.sqrt(
          Math.pow(f.geometry.coordinates[0] - e.bakw[0], 2) + Math.pow(f.geometry.coordinates[1] - e.bakw[1], 2)
        ), v = d / b;
        v > s[i] && (s[i] = v), v > s[a] && (s[a] = v);
      }
    }
  r.forEach((o, i) => {
    const a = s[i];
    o.bakw = [
      (o.bakw[0] - e.bakw[0]) * a + e.bakw[0],
      (o.bakw[1] - e.bakw[1]) * a + e.bakw[1]
    ];
  });
}
function Ye(r, t, e, n, s) {
  const { convexBuf: o, centroid: i, allGcps: a, minx: c, maxx: l, miny: u, maxy: f } = r, d = s ? void 0 : pr(o, i, t, n), v = [
    [c, u],
    [l, u],
    [l, f],
    [c, f]
  ].map((k) => ({
    forw: k,
    bakw: s ? s(k) : mr(
      k,
      i,
      d[gr(k, i.forw)]
    )
  }));
  if (v.sort(
    (k, A) => Math.atan2(k.forw[0] - i.forw[0], k.forw[1] - i.forw[1]) - Math.atan2(A.forw[0] - i.forw[0], A.forw[1] - i.forw[1])
  ), s || xn(v, a, i), !e) return v;
  const p = 4, S = v.map(
    (k) => Math.atan2(k.forw[0] - i.forw[0], k.forw[1] - i.forw[1])
  ), I = v.map(
    (k) => Math.atan2(
      k.bakw[0] - i.bakw[0],
      -(k.bakw[1] - i.bakw[1])
    )
  );
  function g(k) {
    for (let A = 0; A < p; A++) {
      const B = (A + 1) % p, O = S[A], P = A < p - 1 ? S[B] : S[B] + 2 * Math.PI;
      let $ = k;
      for (; $ < O; ) $ += 2 * Math.PI;
      for (; $ >= O + 2 * Math.PI; ) $ -= 2 * Math.PI;
      if ($ >= O && $ < P)
        return { i: A, j: B, frac: ($ - O) / (P - O) };
    }
    return { i: 0, j: 1, frac: 0 };
  }
  function m(k) {
    const { i: A, j: B, frac: O } = g(k), P = I[A];
    let M = I[B] - P;
    for (; M > Math.PI; ) M -= 2 * Math.PI;
    for (; M < -Math.PI; ) M += 2 * Math.PI;
    return P + O * M;
  }
  const h = new Set(
    v.map(
      (k) => Math.floor(bn(k.forw, i.forw) / 10) % 36
    )
  ), w = a.map((k) => ({
    forw: k.forw,
    bakw: k.bakw,
    angleDeg: bn(k.forw, i.forw),
    forwDist: Math.hypot(k.forw[0] - i.forw[0], k.forw[1] - i.forw[1])
  })), y = [];
  for (let k = 0; k < 36; k++) {
    if (h.has(k)) continue;
    const A = k * 10, B = w.filter((x) => {
      if (x.forwDist === 0) return !1;
      const F = ((x.angleDeg - A) % 360 + 360) % 360;
      return F < 10 + vn || F > 360 - vn;
    });
    let O = null;
    if (B.length > 0) {
      const x = B.reduce((F, R) => R.forwDist > F.forwDist ? R : F);
      O = Mn(i.forw, x.forw, c, l, u, f);
    }
    if (!O) {
      const x = (A + 5) % 360 * (Math.PI / 180), F = [
        i.forw[0] + Math.sin(x),
        i.forw[1] + Math.cos(x)
      ];
      O = Mn(i.forw, F, c, l, u, f);
    }
    if (!O) continue;
    const [P, $] = O, M = 1e-9 * Math.max(l - c, f - u);
    if ([...v, ...y].some(
      (x) => Math.abs(x.forw[0] - P) <= M && Math.abs(x.forw[1] - $) <= M
    )) continue;
    if (s) {
      y.push({ forw: O, bakw: s(O) });
      continue;
    }
    const T = [O[0] - i.forw[0], O[1] - i.forw[1]], _ = Math.atan2(T[0], T[1]), N = m(_), C = [
      i.bakw[0] + Math.sin(N),
      i.bakw[1] - Math.cos(N)
    ], D = yr(i.bakw, C, v);
    D && y.push({ forw: O, bakw: D });
  }
  const E = [...v, ...y];
  return E.sort(
    (k, A) => Math.atan2(k.forw[0] - i.forw[0], k.forw[1] - i.forw[1]) - Math.atan2(A.forw[0] - i.forw[0], A.forw[1] - i.forw[1])
  ), s || xn(E, a, i), E;
}
function vr(r, t = !1) {
  return Ye(r, "plain", t, t ? "farLsq" : "min");
}
function br(r, t = !1) {
  return Ye(r, "birdeye", t, "min");
}
function Mr(r, t) {
  const e = /* @__PURE__ */ new Set();
  return Ye(r, "plain", !0, "min", t).filter(({ forw: [n, s] }) => {
    const o = `${n}:${s}`;
    return e.has(o) ? !1 : (e.add(o), !0);
  });
}
function gs(r) {
  return Ln(r, 1 / 0);
}
const Sn = 1e5, xr = 16;
function Ln(r, t) {
  return Sr(r), new _r(r).findSegmentIntersections(t).map(
    (s) => Yt([s.x, s.y])
  );
}
function Sr(r) {
  for (let t = 0, e = r.length; t < e; t++) {
    const n = r[t];
    ne(n) || Lt(
      "findIntersections() received invalid coordinates:",
      `line=${t}`,
      `points=${n}`
    );
    for (let s = 0, o = n.length; s < o; s++) {
      const i = n[s];
      (!ne(i) || !Number.isFinite(i[0]) || !Number.isFinite(i[1])) && Lt(
        "findIntersections() received non-finite coordinates:",
        `line=${t}`,
        `point=${s}`,
        `coordinates=${JSON.stringify(i)}`
      );
    }
  }
}
class _r {
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
    const e = [], n = [], s = t.map((o) => {
      const i = o ? o.length : 0;
      for (let a = 0; a < i; a++)
        e.push(o[a][0]), n.push(o[a][1]);
      return i;
    });
    this.initXYData(s, e, n);
  }
  initXYData(t, e, n) {
    const s = t.length;
    this._xx = new Float64Array(e), this._yy = new Float64Array(n), this._nn = new Uint32Array(t), this._zz = null, this._zlimit = 0, this._filteredArcIter = null, this._ii = new Uint32Array(s);
    let o = 0;
    for (let i = 0; i < s; i++)
      this._ii[i] = o, o += t[i];
    (o != this._xx.length || this._xx.length != this._yy.length) && Lt("ArcCollection#initXYData() Counting error"), this.initBounds(), this._arcIter = new Ur(this._xx, this._yy);
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
    const s = n.length, o = new Float64Array(s * 4), i = new ie();
    let a = 0, c, l, u;
    for (let f = 0; f < s; f++)
      c = n[f], c > 0 && (l = f * 4, u = Vr(t, e, a, c), o[l++] = u[0], o[l++] = u[1], o[l++] = u[2], o[l] = u[3], a += c, i.mergeBounds(u));
    return {
      bb: o,
      bounds: i
    };
  }
  getBounds() {
    return this._allBounds ? this._allBounds.clone() : new ie();
  }
  // @cb function(i, j, xx, yy)
  forEachSegment(t) {
    let e = 0;
    for (let n = 0, s = this.size(); n < s; n++)
      e += this.forEachArcSegment(n, t);
    return e;
  }
  size() {
    return this._ii && this._ii.length || 0;
  }
  // @cb function(i, j, xx, yy)
  forEachArcSegment(t, e) {
    const n = t >= 0, s = n ? t : ~t, o = this.getRetainedInterval(), i = this._nn[s], a = n ? 1 : -1;
    let c = n ? this._ii[s] : this._ii[s] + i - 1, l = c, u = 0;
    for (let f = 1; f < i; f++)
      l += a, (o === 0 || this._zz[l] >= o) && (e(c, l, this._xx, this._yy), c = l, u++);
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
      (s, o, i, a) => {
        t += Math.abs(i[s] - i[o]), e += Math.abs(a[s] - a[o]);
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
   * @param limit - 返す交差点の件数の上限（同じ位置の交差は 1 件に数える）
   * @returns 検出された交差点の配列（同じ位置の重複なし）
   */
  findSegmentIntersections(t = 1 / 0) {
    const e = this.getBounds(), n = e.ymin || 0, s = (e.ymax || 0) - n, o = this.calcSegmentIntersectionStripeCount(), i = new Uint32Array(o), a = o > 1 ? (m) => Math.floor((o - 1) * (m - n) / s) : () => 0, c = o + 1;
    let l;
    this.forEachSegment(
      (m, h, w, y) => {
        let E = a(y[m]);
        const k = a(y[h]);
        let A = 0;
        for (; i[E] = i[E] + 2, E != k; )
          A++, A > c && Lt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${o}`,
            `s1=${E}`,
            `s2=${k}`
          ), E += k > E ? 1 : -1;
      }
    );
    const u = this.getUint32Array(Ar(i));
    let f = 0;
    const d = [];
    Ir(i, (m) => {
      const h = f;
      f += m, d.push(u.subarray(h, f));
    }), Br(i, 0), this.forEachSegment(
      (m, h, w, y) => {
        let E = a(y[m]);
        const k = a(y[h]);
        let A, B, O = 0;
        for (; A = i[E], i[E] = A + 2, B = d[E], B[A] = m, B[A + 1] = h, E != k; )
          O++, O > c && Lt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${o}`,
            `s1=${E}`,
            `s2=${k}`
          ), E += k > E ? 1 : -1;
      }
    );
    const b = this.getVertexData(), v = t * xr;
    let p = 0;
    const S = /* @__PURE__ */ new Set(), I = /* @__PURE__ */ new Map(), g = (m) => {
      p++;
      const h = jr(m);
      return S.has(h) || (S.add(h), I.set(`${m.x}:${m.y}`, m)), I.size >= t || p >= v;
    };
    if (b.xx && b.yy)
      for (l = 0; l < o && !Tr(d[l], b.xx, b.yy, g); l++)
        ;
    return Array.from(I.values());
  }
}
function Lt(...r) {
  const t = r.join(" ");
  throw new Error(t);
}
function ne(r) {
  return r ? kr(r) ? !0 : Er(r) ? !1 : r.length === 0 ? !0 : r.length > 0 : !1;
}
function Er(r) {
  return r != null && r.toString === String.prototype.toString;
}
function kr(r) {
  return Array.isArray(r);
}
function Ar(r, t) {
  ne(r) || Lt("utils.sum() expects an array, received:", r);
  let e = 0, n;
  for (let s = 0, o = r.length; s < o; s++)
    n = r[s], n && (e += n);
  return e;
}
function Ir(r, t, e) {
  if (!ne(r))
    throw new Error(`#forEach() takes an array-like argument. ${r}`);
  for (let n = 0, s = r.length; n < s; n++)
    t.call(e, r[n], n);
}
function Br(r, t) {
  for (let e = 0, n = r.length; e < n; e++)
    r[e] = t;
  return r;
}
function Tr(r, t, e, n) {
  const s = r.length - 2;
  let o, i, a, c, l, u, f, d, b, v, p, S, I, g, m, h, w;
  for (Lr(t, r), h = 0; h < s; ) {
    for (o = r[h], i = r[h + 1], l = t[o], u = t[i], b = e[o], v = e[i], w = h; w < s && (w += 2, a = r[w], f = t[a], !(u < f)); ) {
      if (p = e[a], c = r[w + 1], d = t[c], S = e[c], b >= p) {
        if (b > S && v > p && v > S) continue;
      } else if (b < S && v < p && v < S) continue;
      if (!(o == a || o == c || i == a || i == c) && (I = Or(
        l,
        b,
        u,
        v,
        f,
        p,
        d,
        S
      ), I && (g = [o, i], m = [a, c], n(En(I, g, m, t, e)) || I.length == 4 && n(En(I.slice(2), g, m, t, e)))))
        return !0;
    }
    h += 2;
  }
  return !1;
}
function Or(r, t, e, n, s, o, i, a) {
  const c = Nr(r, t, e, n, s, o, i, a);
  let l = null;
  return c && (l = Fr(r, t, e, n, s, o, i, a), l ? Xr(r, t, e, n, s, o, i, a) && (l = null) : l = $r(r, t, e, n, s, o, i, a)), l;
}
function Nr(r, t, e, n, s, o, i, a) {
  return Qt(r, t, e, n, s, o) * Qt(r, t, e, n, i, a) <= 0 && Qt(s, o, i, a, r, t) * Qt(s, o, i, a, e, n) <= 0;
}
function Qt(r, t, e, n, s, o) {
  return Yn(r - s, t - o, e - s, n - o);
}
function Yn(r, t, e, n) {
  return r * n - t * e;
}
function Fr(r, t, e, n, s, o, i, a) {
  let c = ge(r, t, e, n, s, o, i, a), l;
  return c && (l = Pr(c[0], c[1], r, t, e, n, s, o, i, a), l == 1 ? c = ge(e, n, r, t, s, o, i, a) : l == 2 ? c = ge(s, o, i, a, r, t, e, n) : l == 3 && (c = ge(i, a, s, o, r, t, e, n))), c && Rr(c, r, t, e, n, s, o, i, a), c;
}
function ge(r, t, e, n, s, o, i, a) {
  const c = Yn(e - r, n - t, i - s, a - o), l = 1e-18;
  let u;
  if (c === 0) return null;
  const f = Qt(s, o, i, a, r, t) / c;
  return c <= l && c >= -l ? u = Cr(r, t, e, n, s, o, i, a) : u = [r + f * (e - r), t + f * (n - t)], u;
}
function Cr(r, t, e, n, s, o, i, a) {
  let c = null;
  return !It(r, s, i) && !It(t, o, a) ? c = [r, t] : !It(e, s, i) && !It(n, o, a) ? c = [e, n] : !It(s, r, e) && !It(o, t, n) ? c = [s, o] : !It(i, r, e) && !It(a, t, n) && (c = [i, a]), c;
}
function It(r, t, e) {
  let n;
  return t < e ? n = r < t || r > e : t > e ? n = r > t || r < e : n = r != t, n;
}
function Pr(r, t, ...e) {
  let n = -1, s = 1 / 0, o;
  for (let i = 0, a = 0, c = e.length; a < c; i++, a += 2)
    o = Dr(r, t, e[a], e[a + 1]), o < s && (s = o, n = i);
  return n;
}
function Dr(r, t, e, n) {
  const s = r - e, o = t - n;
  return s * s + o * o;
}
function Rr(r, t, e, n, s, o, i, a, c) {
  let l = r[0], u = r[1];
  l = me(l, t, n), l = me(l, o, a), u = me(u, e, s), u = me(u, i, c), r[0] = l, r[1] = u;
}
function me(r, t, e) {
  let n;
  return It(r, t, e) && (n = Math.abs(r - t) < Math.abs(r - e) ? t : e, r = n), r;
}
function $r(r, t, e, n, s, o, i, a) {
  const c = Math.min(r, e, s, i), l = Math.max(r, e, s, i), u = Math.min(t, n, o, a), f = Math.max(t, n, o, a), d = f - u > l - c;
  let b = [];
  return (d ? Pt(t, u, f) : Pt(r, c, l)) && b.push(r, t), (d ? Pt(n, u, f) : Pt(e, c, l)) && b.push(e, n), (d ? Pt(o, u, f) : Pt(s, c, l)) && b.push(s, o), (d ? Pt(a, u, f) : Pt(i, c, l)) && b.push(i, a), (b.length != 2 && b.length != 4 || b.length == 4 && b[0] == b[2] && b[1] == b[3]) && (b = null), b;
}
function Xr(r, t, e, n, s, o, i, a) {
  return r == s && t == o || r == i && t == a || e == s && n == o || e == i && n == a;
}
function Pt(r, t, e) {
  return r > t && r < e;
}
function Lr(r, t) {
  Yr(r, t), qn(r, t, 0, t.length - 2);
}
function Yr(r, t) {
  for (let e = 0, n = t.length; e < n; e += 2)
    r[t[e]] > r[t[e + 1]] && qr(t, e, e + 1);
}
function qr(r, t, e) {
  const n = r[t];
  r[t] = r[e], r[e] = n;
}
function qn(r, t, e, n) {
  let s = e, o = n, i, a;
  for (; s < n; ) {
    for (i = r[t[e + n >> 2 << 1]]; s <= o; ) {
      for (; r[t[s]] < i; ) s += 2;
      for (; r[t[o]] > i; ) o -= 2;
      s <= o && (a = t[s], t[s] = t[o], t[o] = a, a = t[s + 1], t[s + 1] = t[o + 1], t[o + 1] = a, s += 2, o -= 2);
    }
    if (o - e < 40 ? _n(r, t, e, o) : qn(r, t, e, o), n - s < 40) {
      _n(r, t, s, n);
      return;
    }
    e = s, o = n;
  }
}
function _n(r, t, e, n) {
  let s, o;
  for (let i = e + 2; i <= n; i += 2) {
    s = t[i], o = t[i + 1];
    let a;
    for (a = i - 2; a >= e && r[s] < r[t[a]]; a -= 2)
      t[a + 2] = t[a], t[a + 3] = t[a + 1];
    t[a + 2] = s, t[a + 3] = o;
  }
}
function En(r, t, e, n, s) {
  const o = r[0], i = r[1];
  t = kn(o, i, t[0], t[1], n, s), e = kn(o, i, e[0], e[1], n, s);
  const a = t[0] < e[0] ? t : e, c = a == t ? e : t;
  return { x: o, y: i, a, b: c };
}
function kn(r, t, e, n, s, o) {
  let i = e < n ? e : n, a = i === e ? n : e;
  return s[i] == r && o[i] == t ? a = i : s[a] == r && o[a] == t && (i = a), [i, a];
}
function jr(r) {
  return `${r.a.join(",")};${r.b.join(",")}`;
}
class Ur {
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
function Vr(r, t, e, n) {
  let s = e | 0;
  const o = isNaN(n) ? r.length - s : n + s;
  let i, a, c, l, u, f;
  if (o > 0)
    c = u = r[s], l = f = t[s];
  else return [void 0, void 0, void 0, void 0];
  for (s++; s < o; s++)
    i = r[s], a = t[s], i < c && (c = i), i > u && (u = i), a < l && (l = a), a > f && (f = a);
  return [c, l, u, f];
}
class ie {
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
    return new ie(
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
  setBounds(t, e, n, s) {
    let o, i, a, c;
    if (arguments.length == 1)
      if (ne(t)) {
        const l = t;
        o = l[0], i = l[1], a = l[2], c = l[3];
      } else {
        const l = t;
        o = l.xmin, i = l.ymin, a = l.xmax, c = l.ymax;
      }
    else
      o = t, i = e, a = n, c = s;
    return this.xmin = o, this.ymin = i, this.xmax = a, this.ymax = c, (o > a || i > c) && this.update(), this;
  }
  update() {
    let t;
    this.xmin > this.xmax && (t = this.xmin, this.xmin = this.xmax, this.xmax = t), this.ymin > this.ymax && (t = this.ymin, this.ymin = this.ymax, this.ymax = t);
  }
  mergeBounds(t, ...e) {
    let n, s, o, i;
    return t instanceof ie ? (n = t.xmin, s = t.ymin, o = t.xmax, i = t.ymax) : e.length == 3 ? (n = t, s = e[0], o = e[1], i = e[2]) : t.length == 4 ? (n = t[0], s = t[1], o = t[2], i = t[3]) : Lt("Bounds#mergeBounds() invalid argument:", t), this.xmin === void 0 ? this.setBounds(n, s, o, i) : (n < this.xmin && (this.xmin = n), s < this.ymin && (this.ymin = s), o > this.xmax && (this.xmax = o), i > this.ymax && (this.ymax = i)), this;
  }
}
function Me(r) {
  const t = ["a", "b", "c"].map(
    (e) => r.properties[e].index
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
function jn(r, t, e) {
  const n = Me(t.forw), s = Me(t.bakw);
  if (JSON.stringify(n) != JSON.stringify(s))
    throw `${JSON.stringify(t, null, 2)}
${JSON.stringify(
      n
    )}
${JSON.stringify(s)}`;
  for (let o = 0; o < n.length; o++) {
    const i = n[o];
    r[i] || (r[i] = []), r[i].push(t);
  }
  e && (e.forw.features.push(t.forw), e.bakw.features.push(t.bakw));
}
function An(r, t, e) {
  const n = Me(t.forw), s = Me(t.bakw);
  if (JSON.stringify(n) != JSON.stringify(s))
    throw `${JSON.stringify(t, null, 2)}
${JSON.stringify(n)}
${JSON.stringify(s)}`;
  if (n.forEach((o) => {
    const i = r[o];
    if (!i) return;
    const a = i.filter((c) => c !== t);
    a.length === 0 ? delete r[o] : r[o] = a;
  }), e) {
    const o = (i, a) => {
      !i || !a || (i.features = i.features.filter((c) => c !== a));
    };
    o(e.forw, t.forw), o(e.bakw, t.bakw);
  }
}
function we(r, t = 1e-6) {
  const [e, n] = r[0], [s, o] = r[1], [i, a] = r[2];
  return Math.abs((s - e) * (a - n) - (i - e) * (o - n)) < t;
}
function zr(r, t) {
  const e = /* @__PURE__ */ new Set();
  return r.forEach((n) => {
    if (n.length !== 2) return;
    const s = n.map((o) => `${t?.[o] ?? o}`);
    e.add(s.sort().join("-"));
  }), e;
}
function Zt(r) {
  return ["a", "b", "c"].map((t, e) => ({
    prop: r.properties[t],
    geom: r.geometry.coordinates[0][e]
  }));
}
const Hr = 10;
function Kr(r, t, e, n, s, o) {
  if (!r && !t) return !1;
  const i = r ? 0 : 1, a = 1 - i, c = e[i], l = e[a];
  if (!c || !l) return !1;
  const u = bt(l.geom);
  let f = !1, d = !1;
  for (let b = 0; b <= 1; b++) {
    const v = n[b];
    if (!v) continue;
    const p = [String(v.prop.index), String(c.prop.index)].sort().join("-"), S = s[p];
    if (!S || S.length < 2) continue;
    const I = S.find(
      (O) => O.bakw !== o[i].bakw
    );
    if (!I) continue;
    const m = Zt(I.bakw).find(
      (O) => String(O.prop.index) !== String(v.prop.index) && String(O.prop.index) !== String(c.prop.index)
    );
    if (!m) continue;
    f = !0;
    const h = bt(m.geom), w = bt(v.geom), y = bt(c.geom), E = y[0] - w[0], k = y[1] - w[1], A = E * (u[1] - w[1]) - k * (u[0] - w[0]), B = E * (h[1] - w[1]) - k * (h[0] - w[0]);
    if (A * B > 0) {
      d = !0;
      break;
    }
  }
  return f && !d;
}
function Wr(r, t, e, n) {
  if (!r && !t) return !1;
  if (e[0] && e[1] && n[0] && n[1]) {
    const s = n.map((u) => bt(u.geom)), o = e.map((u) => bt(u.geom)), i = s[1][0] - s[0][0], a = s[1][1] - s[0][1], c = i * (o[0][1] - s[0][1]) - a * (o[0][0] - s[0][0]), l = i * (o[1][1] - s[0][1]) - a * (o[1][0] - s[0][0]);
    return c * l < 0;
  }
  return !1;
}
function Gr(r, t, e, n) {
  const s = zr(e, n), o = /* @__PURE__ */ new Set();
  let i = !1;
  for (let a = 0; a < Hr; a++) {
    let c = !1;
    for (const l of Object.keys(t)) {
      if (o.has(l)) continue;
      o.add(l);
      const u = t[l];
      if (!u || u.length < 2) continue;
      const f = l.split("-");
      if (f.length !== 2 || s.has(l)) continue;
      const d = Zt(u[0].bakw), b = Zt(u[1].bakw), v = Zt(u[0].forw), p = Zt(u[1].forw), S = f.map(
        (x) => d.find((F) => `${F.prop.index}` === x) || b.find((F) => `${F.prop.index}` === x)
      ), I = f.map(
        (x) => v.find((F) => `${F.prop.index}` === x) || p.find((F) => `${F.prop.index}` === x)
      );
      if (S.some((x) => !x) || I.some((x) => !x))
        continue;
      const g = [d, b].map(
        (x) => x.find((F) => !f.includes(`${F.prop.index}`))
      ), m = [v, p].map(
        (x) => x.find((F) => !f.includes(`${F.prop.index}`))
      );
      if (g.some((x) => !x) || m.some((x) => !x))
        continue;
      const h = u[0].bakw.geometry.coordinates[0].slice(0, 3).map((x) => bt(x)), w = u[1].bakw.geometry.coordinates[0].slice(0, 3).map((x) => bt(x)), y = u[0].forw.geometry.coordinates[0].slice(0, 3).map((x) => bt(x)), E = u[1].forw.geometry.coordinates[0].slice(0, 3).map((x) => bt(x)), k = we(h), A = we(w), B = we(y), O = we(E), P = Kr(
        k,
        A,
        g,
        S,
        t,
        u
      ), $ = Wr(
        B,
        O,
        g,
        S
      );
      if (!(P || $ || In(
        bt(g[0].geom),
        w
      ) || In(
        bt(g[1].geom),
        h
      )))
        continue;
      const T = I.map(
        (x) => bt(x.geom)
      ), _ = m.map(
        (x) => bt(x.geom)
      ), N = Jr([
        ...T,
        ..._
      ]), C = Qr(N), D = Bn(
        T[0],
        T[1],
        _[0]
      ) + Bn(
        T[0],
        T[1],
        _[1]
      );
      Re(C, D) && (An(t, u[0], r), An(t, u[1], r), S.forEach((x) => {
        if (!x) return;
        const F = [
          x.geom,
          g[0].geom,
          g[1].geom,
          x.geom
        ], R = {
          a: x.prop,
          b: g[0].prop,
          c: g[1].prop
        }, X = re([F], R), q = Cn(X);
        jn(t, {
          forw: q,
          bakw: X
        }, r);
      }), c = !0, i = !0);
    }
    if (!c) break;
  }
  return i;
}
function bt(r) {
  return [r[0], r[1]];
}
function In(r, t) {
  const [e, n] = t[0], [s, o] = t[1], [i, a] = t[2], c = i - e, l = a - n, u = s - e, f = o - n, d = r[0] - e, b = r[1] - n, v = c * c + l * l, p = c * u + l * f, S = c * d + l * b, I = u * u + f * f, g = u * d + f * b, m = v * I - p * p;
  if (m === 0) return !1;
  const h = 1 / m, w = (I * S - p * g) * h, y = (v * g - p * S) * h, E = 1e-9;
  return w >= -E && y >= -E && w + y <= 1 + E;
}
function Jr(r) {
  const t = r.map((i) => i.slice()).filter(
    (i, a, c) => c.findIndex(
      (l) => Re(l[0], i[0]) && Re(l[1], i[1])
    ) === a
  );
  if (t.length <= 1) return t;
  const e = t.sort(
    (i, a) => i[0] === a[0] ? i[1] - a[1] : i[0] - a[0]
  ), n = (i, a, c) => (a[0] - i[0]) * (c[1] - i[1]) - (a[1] - i[1]) * (c[0] - i[0]), s = [];
  for (const i of e) {
    for (; s.length >= 2 && n(
      s[s.length - 2],
      s[s.length - 1],
      i
    ) <= 0; )
      s.pop();
    s.push(i);
  }
  const o = [];
  for (let i = e.length - 1; i >= 0; i--) {
    const a = e[i];
    for (; o.length >= 2 && n(
      o[o.length - 2],
      o[o.length - 1],
      a
    ) <= 0; )
      o.pop();
    o.push(a);
  }
  return o.pop(), s.pop(), s.concat(o);
}
function Qr(r) {
  if (r.length < 3) return 0;
  let t = 0;
  for (let e = 0; e < r.length; e++) {
    const [n, s] = r[e], [o, i] = r[(e + 1) % r.length];
    t += n * i - o * s;
  }
  return Math.abs(t) / 2;
}
function Bn(r, t, e) {
  return Math.abs(
    (r[0] * (t[1] - e[1]) + t[0] * (e[1] - r[1]) + e[0] * (r[1] - t[1])) / 2
  );
}
function Re(r, t, e = 1e-9) {
  return Math.abs(r - t) <= e;
}
const Zr = (r) => typeof r == "string" && r.startsWith("b");
function ts(r, t) {
  const e = (n, s) => {
    for (let o = 0; o < 3; o++) {
      const i = n.g[o], a = n.g[(o + 1) % 3];
      if (s.g.every((c) => n.sign * ft(i[0], i[1], a[0], a[1], c[0], c[1]) <= 0)) return !0;
    }
    return !1;
  };
  return !e(r, t) && !e(t, r);
}
function es(r, t, e) {
  if (t.length === 0) return [];
  const n = r.features.map((p) => {
    const { a: S, b: I, c: g } = p.properties, m = [S.geom, I.geom, g.geom], [h, w, y] = p.geometry.coordinates[0], E = m.map(([O]) => O), k = m.map(([, O]) => O), A = Math.sign(ft(h[0], h[1], w[0], w[1], y[0], y[1])), B = Math.sign(ft(m[0][0], m[0][1], m[1][0], m[1][1], m[2][0], m[2][1]));
    return {
      ids: [S.index, I.index, g.index].map(String),
      g: m,
      sign: B,
      ratio: A * B,
      aux: [S.index, I.index, g.index].some(Zr),
      minx: Math.min(...E),
      maxx: Math.max(...E),
      miny: Math.min(...k),
      maxy: Math.max(...k)
    };
  }), s = n.map((p) => p.ratio), o = s.reduce((p, S) => p + S, 0) < 0 ? -1 : 1, i = (p, S) => p < S ? `${p}|${S}` : `${S}|${p}`, a = /* @__PURE__ */ new Map();
  n.forEach((p, S) => {
    for (let I = 0; I < 3; I++) {
      const g = i(p.ids[I], p.ids[(I + 1) % 3]), m = a.get(g);
      m ? m.push(S) : a.set(g, [S]);
    }
  });
  const c = ([p, S]) => i(String(e[p]), String(e[S])), l = /* @__PURE__ */ new Set();
  for (const p of t) for (const S of a.get(c(p)) ?? []) l.add(S);
  const u = (p) => n[p].aux || l.has(p), f = /* @__PURE__ */ new Set();
  n.forEach((p, S) => {
    u(S) && (s[S] === 0 || s[S] !== o) && f.add(S);
  });
  const d = n.map((p, S) => S).sort((p, S) => n[p].minx - n[S].minx);
  for (let p = 0; p < d.length; p++) {
    const S = n[d[p]];
    if (S.sign !== 0)
      for (let I = p + 1; I < d.length; I++) {
        const g = n[d[I]];
        if (g.minx >= S.maxx) break;
        g.sign === 0 || g.miny >= S.maxy || S.miny >= g.maxy || !u(d[p]) && !u(d[I]) || ts(S, g) && (f.add(d[p]), f.add(d[I]));
      }
  }
  if (f.size === 0) return [];
  const b = t.filter((p) => (a.get(c(p)) ?? []).some((S) => f.has(S)));
  if (b.length > 0) return b;
  const v = /* @__PURE__ */ new Set();
  for (const p of f) for (const S of n[p].ids) S.startsWith("b") || v.add(S);
  return t.filter(
    ([p, S]) => v.has(String(e[p])) || v.has(String(e[S]))
  );
}
const ns = 4, Tn = 32, is = 1, rs = 0.4, Un = 4, ss = 1e-4, Vn = 0.25, os = 0.01, Dt = (r, t) => String(r) < String(t) ? `${r}|${t}` : `${t}|${r}`;
function Pe(r, t, e) {
  const n = t.filter((l) => !String(l.properties.target.index).startsWith("b")).map((l) => ({
    id: l.properties.target.index,
    paper: l.geometry.coordinates,
    geo: l.properties.target.geom
  })), s = /* @__PURE__ */ new Set();
  let o = 0, i = 0;
  const a = r.features.map((l) => {
    const { a: u, b: f, c: d } = l.properties, [b, v, p] = l.geometry.coordinates[0];
    s.add(Dt(u.index, f.index)), s.add(Dt(u.index, d.index)), s.add(Dt(f.index, d.index));
    const S = Math.sign(ft(b[0], b[1], v[0], v[1], p[0], p[1])) * Math.sign(ft(u.geom[0], u.geom[1], f.geom[0], f.geom[1], d.geom[0], d.geom[1]));
    return S > 0 ? o++ : S < 0 && i++, {
      ids: [String(u.index), String(f.index), String(d.index)],
      paper: [b, v, p],
      geo: [u.geom, f.geom, d.geom],
      sign: S
    };
  }), c = e.filter(([l, u]) => !s.has(Dt(n[l].id, n[u].id)));
  return { points: n, triangles: a, majority: o >= i ? 1 : -1, hullEdges: e, dropped: c };
}
function zn(r) {
  return [r.foot[0] + r.height * r.normal[0], r.foot[1] + r.height * r.normal[1]];
}
function as(r, [t, e], { lambda: n = Vn, epsilon: s = ss } = {}) {
  const { points: o, majority: i } = r, a = o[t], c = o[e], l = o.reduce((_, N) => _ + N.paper[0], 0) / o.length, u = o.reduce((_, N) => _ + N.paper[1], 0) / o.length, f = Math.sign(ft(a.paper[0], a.paper[1], c.paper[0], c.paper[1], l, u));
  if (f === 0) return;
  const d = f * i, b = [c.paper[0] - a.paper[0], c.paper[1] - a.paper[1]], v = [c.geo[0] - a.geo[0], c.geo[1] - a.geo[1]], p = Math.hypot(b[0], b[1]), S = Math.hypot(v[0], v[1]);
  if (!(p > 0 && S > 0)) return;
  const I = [];
  for (const _ of o) {
    if (_ === a || _ === c) continue;
    const N = ft(a.geo[0], a.geo[1], c.geo[0], c.geo[1], _.geo[0], _.geo[1]);
    if (N * d >= 0) continue;
    const C = ((_.geo[0] - a.geo[0]) * v[0] + (_.geo[1] - a.geo[1]) * v[1]) / (S * S), D = ((_.paper[0] - a.paper[0]) * b[0] + (_.paper[1] - a.paper[1]) * b[1]) / (p * p);
    C > 0 && C < 1 && D > 0 && D < 1 && I.push({ id: _.id, u: C, t: D, d: Math.abs(N) / S });
  }
  const g = I.length > 0;
  g || I.push({ u: 0.5, t: 0.5, d: 0 });
  const m = I.reduce((_, N) => N.d > _.d ? N : _);
  let h = 0;
  for (const _ of I)
    h = Math.max(h, _.u <= m.u ? _.d * m.u / _.u : _.d * (1 - m.u) / (1 - _.u));
  h *= 1 + n;
  const w = [-b[1] / p * f, b[0] / p * f], y = [-v[1] / S * d, v[0] / S * d], E = (_) => [
    a.paper[0] + _ * b[0] + s * p * w[0],
    a.paper[1] + _ * b[1] + s * p * w[1]
  ], k = (_, N, C, D) => ({
    paper: E(_),
    foot: [a.geo[0] + N * v[0], a.geo[1] + N * v[1]],
    normal: y,
    height: C,
    chord: S,
    protrusion: m.d,
    ...D === void 0 ? {} : { anchor: D }
  }), A = [k(m.t, m.u, h, g ? m.id : void 0)], B = [...I].sort((_, N) => _.u - N.u), O = [{ u: 0, d: 0 }], P = (_, N, C) => (N.u - _.u) * (C.d - _.d) - (N.d - _.d) * (C.u - _.u);
  for (const _ of [...B, { u: 1, d: 0 }]) {
    for (; O.length >= 2 && P(O[O.length - 2], O[O.length - 1], _) >= 0; ) O.pop();
    O.push(_);
  }
  const $ = n * m.d, M = [];
  let T = 0;
  for (const _ of O.slice(1, -1))
    _.t === void 0 || !(_.t > T) || (T = _.t, M.push(k(_.t, _.u, _.d + $, g ? _.id : void 0)));
  return {
    edge: [a.id, c.id],
    variants: g && M.length > 1 ? [A, M] : [A]
  };
}
function cs(r, t, e, { lambda: n = Vn, mu: s = os, maxIterations: o = Un } = {}) {
  let i = r.map((a, c) => ({ ray: { ...a }, index: c }));
  for (let a = 0; a < o && i.length > 0; a++) {
    const c = e(i.map(({ ray: f }) => [f.paper, zn(f)]));
    if (!c) return;
    let l = !1;
    const u = /* @__PURE__ */ new Set();
    for (const [f, { ray: d }] of i.entries()) {
      const b = `e${t + f}`;
      let v = -1 / 0, p = 1 / 0, S = 0;
      for (const h of c.triangles) {
        const w = h.ids.indexOf(b);
        if (w < 0) continue;
        h.sign !== c.majority && S++;
        const y = h.geo[(w + 1) % 3], E = h.geo[(w + 2) % 3], k = Math.sign(
          ft(
            h.paper[w][0],
            h.paper[w][1],
            h.paper[(w + 1) % 3][0],
            h.paper[(w + 1) % 3][1],
            h.paper[(w + 2) % 3][0],
            h.paper[(w + 2) % 3][1]
          )
        ), A = ft(d.foot[0], d.foot[1], y[0], y[1], E[0], E[1]), B = ft(d.foot[0] + d.normal[0], d.foot[1] + d.normal[1], y[0], y[1], E[0], E[1]) - A, O = k * c.majority;
        if (B === 0) {
          A * O <= 0 && (v = 1 / 0);
          continue;
        }
        const P = -A / B;
        B * O > 0 ? v = Math.max(v, P) : p = Math.min(p, P);
      }
      if (!(v < p)) {
        u.add(f);
        continue;
      }
      const I = Math.min(Math.max(n * Math.max(v, d.protrusion), s * d.chord), (p - v) / 2), g = Math.max(v, 0) + I, m = Math.abs(g - d.height) > 1e-9 * d.chord;
      (S > 0 || m) && (m && (l = !0), d.height = g);
    }
    if (u.size > 0 && (i = i.filter((f, d) => !u.has(d)), l = !0), !l) break;
  }
  if (i.length !== 0)
    return { rays: i.map(({ ray: a }) => a), kept: i.map(({ index: a }) => a) };
}
function ls(r, t) {
  const e = (i) => typeof i == "string" && i.startsWith("e") && Number(i.slice(1)) >= t ? Number(i.slice(1)) : void 0, n = /* @__PURE__ */ new Set();
  for (const { ids: i } of r.triangles)
    n.add(Dt(i[0], i[1])), n.add(Dt(i[0], i[2])), n.add(Dt(i[1], i[2]));
  const s = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set();
  for (const [i, a] of r.hullEdges) {
    const c = n.has(Dt(r.points[i].id, r.points[a].id));
    for (const l of [i, a]) {
      const u = e(r.points[l].id);
      u !== void 0 && (o.add(u), c || s.add(u));
    }
  }
  for (const i of r.points) {
    const a = e(i.id);
    a !== void 0 && !o.has(a) && s.add(a);
  }
  return s;
}
function fs(r, t) {
  const e = { rounds: 0, builds: 0, cost: 0, budget: 0, batches: 0, perEdge: 0, multiPoint: 0 };
  let n = [], s = [], o = t, i = r.snapshot();
  const a = /* @__PURE__ */ new Set(), c = is * r.baseCost;
  e.budget = c;
  const l = r.buildCost();
  let u = 0;
  const f = () => u * rs + r.buildCost() - l, d = () => f() >= c, b = (g) => {
    if (!d())
      return e.builds++, u++, r.measure(g);
  }, v = (g) => [g.paper, zn(g)], p = (g, m, h) => {
    const w = cs(
      g.map(({ ray: y }) => y),
      m,
      (y) => b([...n, ...y]),
      { maxIterations: h }
    );
    return w?.rays.map((y, E) => ({ ray: y, edge: g[w.kept[E]].edge }));
  }, S = (g, m) => g.length === m.length && g.every(({ ray: h }, w) => Math.abs(h.height - m[w].ray.height) <= 1e-9 * h.chord), I = (g) => {
    if (g.length === 0 || n.length + g.length > Tn) return !1;
    const m = r.edgeBase + n.length;
    let h = p(g, m, 1), w = !1;
    for (; h && h.length > 0 && !d(); ) {
      const y = [...n, ...h.map(({ ray: B }) => v(B))];
      e.builds++;
      const E = r.build(y, Math.max(1, Math.ceil(c - f()))), k = E ? ls(E.analysis, m) : void 0;
      if (E && k.size === 0)
        return s = s.concat(
          h.map(({ ray: B, edge: O }, P) => ({
            node: m + P,
            kind: "hullEdge",
            edge: O,
            ...B.anchor === void 0 ? {} : { anchor: B.anchor }
          }))
        ), n = y, o = E, i = r.snapshot(), !0;
      if (r.restore(i), E && k.size < h.length) {
        h = h.filter((B, O) => !k.has(m + O));
        continue;
      }
      if (w) return !1;
      w = !0;
      const A = p(h, m, Un);
      if (!A || S(A, h)) return !1;
      h = A;
    }
    return !1;
  };
  for (let g = 1; g <= ns && !d(); g++) {
    const { analysis: m } = o, h = [];
    for (const y of m.dropped) {
      const E = y.map((A) => m.points[A].paper.join(",")).join("|");
      if (a.has(E) || (a.add(E), n.length + h.length + 1 > Tn)) continue;
      const k = as(m, y);
      k && h.push(k);
    }
    if (h.length === 0) break;
    e.rounds = g;
    const w = (y, E) => E.map((k) => ({ ray: k, edge: y.edge }));
    if (I(h.flatMap((y) => w(y, y.variants[0])))) {
      e.batches++;
      continue;
    }
    for (const y of h)
      for (const [E, k] of y.variants.entries()) {
        if (d()) break;
        if (I(w(y, k))) {
          e.perEdge++, E > 0 && e.multiPoint++;
          break;
        }
      }
  }
  return r.restore(i), e.cost = f(), { pairs: n, records: s, result: o.result, diagnostics: e };
}
const On = 2.00704, Nn = 3.00001, us = 12, Fn = /* @__PURE__ */ Symbol("supplement pairs out of budget"), hs = 24;
class rt extends Jn {
  importance;
  priority;
  pointsSet;
  useV2Algorithm;
  /** V3 で補完点を足すか（`Options#supplementPairs`）。 */
  useSupplementPairs;
  supplementRecords = [];
  lastSupplementDiagnostics;
  lastBoundaryDiagnostics;
  requestedWorldFile;
  compiledOuter;
  /** 現在の三角網を V3 で生成したときの外周の診断。 */
  get boundaryDiagnostics() {
    return this.tins && !this.useV2Algorithm ? this.lastBoundaryDiagnostics : void 0;
  }
  /**
   * システムが足した補完点の一覧（今の三角網のもの）。座標は内部の座標（`edgeNodes` と同じ）。
   * 人間の対応点（`points`）には入らない。`updateTin()` のたびに、対応点だけから作り直される。
   */
  get supplementPairs() {
    if (!this.tins) return [];
    const t = this.edgeNodes ?? [];
    return this.supplementRecords.flatMap((e) => {
      const n = t[e.node];
      return n ? [{ ...e, forw: n[0], bakw: n[1] }] : [];
    });
  }
  /** 直近の `updateTin()` の補完の手順の診断（足す手順に入らなかったときは undefined）。 */
  get supplementDiagnostics() {
    return this.tins && !this.useV2Algorithm ? this.lastSupplementDiagnostics : void 0;
  }
  /**
   * Tinクラスのインスタンスを生成します
   * @param options - 初期化オプション
   */
  constructor(t = {}) {
    if (super(), t.bounds ? this.setBounds(t.bounds) : (this.setWh(t.wh), this.vertexMode = t.vertexMode || rt.VERTEX_PLAIN), this.strictMode = t.strictMode || rt.MODE_AUTO, this.yaxisMode = t.yaxisMode || rt.YAXIS_INVERT, this.importance = t.importance || 0, this.priority = t.priority || 0, this.stateFull = t.stateFull || !1, this.useV2Algorithm = t.useV2Algorithm ?? !1, this.useSupplementPairs = t.supplementPairs ?? !0, t.outerTransform === "worldFile") {
      if (this.useV2Algorithm) throw new Error("V2 では world file 外周を使えません");
      if (!t.worldFile) throw new Error("worldFile が必要です");
      Qn(t.worldFile), this.requestedWorldFile = { ...t.worldFile };
    }
    t.points && this.setPoints(t.points), t.edges && this.setEdges(t.edges);
  }
  /**
   * フォーマットバージョンを取得します
   */
  getFormatVersion() {
    return this.useV2Algorithm ? On : Nn;
  }
  /**
   * 制御点（GCP: Ground Control Points）を設定します。
   * 指定した点群に合わせて内部のTINキャッシュをリセットします。
   */
  setPoints(t) {
    this.yaxisMode === rt.YAXIS_FOLLOW && (t = t.map((e) => [
      e[0],
      [e[1][0], -1 * e[1][1]]
    ])), this.points = t, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * エッジ（制約線）を設定します。
   * 制約線を正規化した上で、依存するキャッシュをリセットします。
   */
  setEdges(t = []) {
    this.edges = Zn(t), this.edgeNodes = void 0, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 境界ポリゴンを設定します
   */
  setBounds(t) {
    this.bounds = t;
    let e = t[0][0], n = e, s = t[0][1], o = s;
    const i = [t[0]];
    for (let a = 1; a < t.length; a++) {
      const c = t[a];
      c[0] < e && (e = c[0]), c[0] > n && (n = c[0]), c[1] < s && (s = c[1]), c[1] > o && (o = c[1]), i.push(c);
    }
    i.push(t[0]), this.boundsPolygon = re([i]), this.xy = [e, s], this.wh = [n - e, o - s], this.vertexMode = rt.VERTEX_PLAIN, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 現在の設定を永続化可能な形式にコンパイルします
   */
  getCompiled() {
    const t = {};
    if (t.version = this.useV2Algorithm ? On : Nn, t.points = this.points, t.weight_buffer = {}, this.compiledOuter?.outerTransform === "worldFile")
      Object.assign(t, this.compiledOuter);
    else {
      t.centroid_point = [
        this.centroid.forw.geometry.coordinates,
        this.centroid.forw.properties.target.geom
      ], t.vertices_params = [
        this.vertices_params.forw[0],
        this.vertices_params.bakw[0]
      ], t.vertices_points = [];
      const e = this.vertices_params.forw[1];
      if (e)
        for (let n = 0; n < e.length; n++) {
          const s = e[n].features[0], o = s.geometry.coordinates[0][1], i = s.properties.b.geom;
          t.vertices_points[n] = [o, i];
        }
    }
    return t.strict_status = this.strict_status, t.tins_points = [[]], this.tins.forw.features.map((e) => {
      t.tins_points[0].push(
        ["a", "b", "c"].map(
          (n) => e.properties[n].index
        )
      );
    }), this.strict_status === rt.STATUS_LOOSE ? (t.tins_points[1] = [], this.tins.bakw.features.map((e) => {
      t.tins_points[1].push(
        ["a", "b", "c"].map(
          (n) => e.properties[n].index
        )
      );
    })) : this.strict_status === rt.STATUS_ERROR && this.kinks?.bakw && (t.kinks_points = this.kinks.bakw.features.map(
      (e) => e.geometry.coordinates
    )), t.yaxisMode = this.yaxisMode, t.vertexMode = this.vertexMode, t.strictMode = this.strictMode, this.bounds ? (t.bounds = this.bounds, t.boundsPolygon = this.boundsPolygon, this.useV2Algorithm && (t.xy = this.xy, t.wh = this.wh)) : t.wh = this.wh, t.edges = this.edges ?? [], t.edgeNodes = this.edgeNodes ?? [], this.supplementRecords.length > 0 && (t.supplementPairs = this.supplementRecords.map((e) => ({
      ...e,
      edge: [...e.edge]
    }))), this.compiledOuter?.outerTransform === "extrapolate" && Object.assign(t, this.compiledOuter), t;
  }
  /** コンパイルされた設定を基底クラスで復元し、外周方式を次の生成にも引き継ぐ。 */
  setCompiled(t) {
    const e = "outerTransform" in t ? t : void 0;
    if (e?.outerTransform === "worldFile" && this.useV2Algorithm)
      throw new Error("V2 では world file 外周を使えません");
    const n = this.outerTransform === "worldFile" || e?.outerTransform === "worldFile";
    super.setCompiled(t), this.supplementRecords = (t.supplementPairs ?? []).map((s) => ({
      ...s,
      edge: [...s.edge]
    })), this.lastSupplementDiagnostics = void 0, n && (this.stateTriangle = void 0), this.requestedWorldFile = void 0, this.compiledOuter = void 0, e?.outerTransform === "worldFile" ? (this.requestedWorldFile = { ...e.worldFile }, this.compiledOuter = {
      outerTransform: "worldFile",
      worldFile: e.worldFile,
      vertices_points: e.vertices_points
    }) : e?.outerTransform === "extrapolate" && (this.compiledOuter = { outerTransform: "extrapolate" }), this.lastBoundaryDiagnostics = void 0;
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
  calculateStrictTin(t = Sn) {
    this.resolveStrictOverlaps(), this.detectStrictKinks(t);
  }
  /**
   * 順三角網から逆三角網を写し、重なりを辺の反転で解消する（`calculateStrictTin` の前半）。
   * 交差の判定（`strict_status`・`kinks`）はしない。補完点の置き場所を測る試行は、三角網の向きを読むだけなので
   * これだけを呼ぶ。
   */
  resolveStrictOverlaps() {
    const t = this.tins.forw.features.map(
      (s) => Cn(s)
    );
    this.tins.bakw = Mt(t);
    const e = {};
    this.tins.forw.features.forEach((s, o) => {
      const i = this.tins.bakw.features[o];
      jn(e, { forw: s, bakw: i });
    });
    const n = (this.pointsSet?.forw.features ?? []).map(
      (s) => s.properties.target.index
    );
    Gr(
      this.tins,
      e,
      this.pointsSet?.edges || [],
      n
    );
  }
  /** `calculateStrictTin` の後半: 両面の交差を数え、`strict_status` と `kinks` を決める。 */
  detectStrictKinks(t) {
    const e = ["forw", "bakw"].map((n) => {
      const s = this.tins[n].features.map(
        (o) => o.geometry.coordinates[0]
      );
      return Ln(s, t);
    });
    e[0].length === 0 && e[1].length === 0 ? (this.strict_status = rt.STATUS_STRICT, delete this.kinks) : (this.strict_status = rt.STATUS_ERROR, this.kinks = {
      forw: Mt(e[0]),
      bakw: Mt(e[1])
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
    for (let s = 0; s < this.points.length; s++) {
      const o = this.points[s][0], i = this.points[s][1], a = Ut(o, i, s);
      t.forw.push(a), t.bakw.push(Vt(a));
    }
    const e = [];
    let n = 0;
    this.edgeNodes = [], this.edges || (this.edges = []);
    for (let s = 0; s < this.edges.length; s++) {
      const o = this.edges[s][2], i = Object.assign([], this.edges[s][0]), a = Object.assign([], this.edges[s][1]);
      if (ds(o, this.points.length, s), i.length === 0 && a.length === 0) {
        e.push(o);
        continue;
      }
      i.unshift(this.points[o[0]][0]), i.push(this.points[o[1]][0]), a.unshift(this.points[o[0]][1]), a.push(this.points[o[1]][1]), ar(i, a).map((c, l, u) => {
        this.edgeNodes[n] = [
          c[0],
          c[1]
        ];
        const f = Ut(
          c[0],
          c[1],
          `e${n}`
        );
        n++, t.forw.push(f), t.bakw.push(Vt(f)), l === 0 ? e.push([o[0], t.forw.length - 1]) : e.push([
          t.forw.length - 2,
          t.forw.length - 1
        ]), l === u.length - 1 && e.push([t.forw.length - 1, o[1]]);
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
    const t = this.xy[0] - 0.05 * this.wh[0], e = this.xy[0] + 1.05 * this.wh[0], n = this.xy[1] - 0.05 * this.wh[1], s = this.xy[1] + 1.05 * this.wh[1];
    if (this.bounds && !this.boundsPolygon) throw new Error("Internal error: bounds is set but boundsPolygon is missing");
    const o = this.bounds ? this.boundsPolygon : void 0;
    if (!this.points.reduce((c, l) => c && (o ? Ge(l[0], o) : l[0][0] >= t && l[0][0] <= e && l[0][1] >= n && l[0][1] <= s), !0))
      throw "SOME POINTS OUTSIDE";
    let a = [];
    return this.wh && (a = [[t, n], [e, n], [t, s], [e, s]]), {
      pointsSet: this.generatePointsSet(),
      bbox: a,
      minx: t,
      maxx: e,
      miny: n,
      maxy: s
    };
  }
  /** 余白を加える前の GCP の外接矩形を求める。 */
  computeGcpBbox() {
    let t = 1 / 0, e = -1 / 0, n = 1 / 0, s = -1 / 0;
    for (const o of this.points) {
      const i = o[0][0], a = o[0][1];
      i < t && (t = i), i > e && (e = i), a < n && (n = a), a > s && (s = a);
    }
    return { minx: t, maxx: e, miny: n, maxy: s };
  }
  /**
   * TINネットワークを同期的に更新し、座標変換の準備を行います。
   * 重めの計算を伴うため、呼び出し側が非同期制御を行いたい場合は
   * {@link updateTinAsync} を利用してください。
   */
  updateTin() {
    this.lastBoundaryDiagnostics = void 0, this.supplementRecords = [], this.lastSupplementDiagnostics = void 0;
    let t = this.strictMode;
    t !== rt.MODE_STRICT && t !== rt.MODE_LOOSE && (t = rt.MODE_AUTO);
    const e = !this.useV2Algorithm, n = this.requestedWorldFile;
    if (n && !e) throw new Error("V2 では world file 外周を使えません");
    let s, o, i, a, c;
    if (e) {
      if (this.bounds) {
        const B = this.boundsPolygon;
        if (!B) throw new Error("Internal error: bounds is set but boundsPolygon is missing");
        if (!this.points.every(
          (P) => Ge(P[0], B)
        )) throw "SOME POINTS OUTSIDE";
      }
      s = this.generatePointsSet(), { minx: o, maxx: i, miny: a, maxy: c } = this.computeGcpBbox();
    } else {
      const B = this.validateAndPrepareInputs();
      s = B.pointsSet, o = B.minx, i = B.maxx, a = B.miny, c = B.maxy;
    }
    const l = {
      forw: Mt([...s.forw]),
      bakw: Mt([...s.bakw])
    }, u = pe(
      l.forw,
      s.edges,
      "target"
    ), f = pe(
      l.bakw,
      s.edges,
      "target"
    );
    if (u.features.length === 0 || f.features.length === 0)
      throw "TOO LINEAR1";
    const d = Oi(l.forw), b = fn(l.forw);
    if (!b) throw "TOO LINEAR2";
    const v = {}, p = b.geometry.coordinates[0];
    let S;
    try {
      S = p.map((B) => ({
        forw: B,
        bakw: Se(Yt(B), u)
      })), S.forEach((B) => {
        v[`${B.forw[0]}:${B.forw[1]}`] = B;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const I = fn(l.bakw);
    if (!I) throw "TOO LINEAR2";
    const g = I.geometry.coordinates[0];
    try {
      S = g.map((B) => ({
        bakw: B,
        forw: Se(Yt(B), f)
      })), S.forEach((B) => {
        v[`${B.forw[0]}:${B.forw[1]}`] = B;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const m = {
      forw: d.geometry.coordinates,
      bakw: Se(d, u)
    }, h = Ut(m.forw, m.bakw, "c");
    this.centroid = {
      forw: h,
      bakw: Vt(h)
    };
    const w = [
      ...this.points.map((B) => ({ forw: B[0], bakw: B[1] })),
      ...(this.edgeNodes ?? []).map((B) => ({ forw: B[0], bakw: B[1] }))
    ], y = {
      convexBuf: v,
      centroid: m,
      allGcps: w,
      minx: o,
      maxx: i,
      miny: a,
      maxy: c
    };
    if (n) {
      this.stateTriangle = void 0;
      const B = this.yaxisMode === rt.YAXIS_FOLLOW, O = B ? 1 : -1, { boundary: P } = this.buildWithSupplements(t, s, w, ($, M, T) => (_) => ({ boundary: yn(
        y,
        (N) => Mr(N, (C) => {
          const [D, x] = ti(n, C);
          return [D, B ? -x : x];
        }),
        s,
        this.points.length,
        {
          orientation: O,
          accept: (N) => N.hasMapBoundary ? (this.buildTin(s, N.vertices, M, N, _.size > 0, T), (this.strict_status !== rt.STATUS_LOOSE || N.hasBoundary) && be(this.tins.forw, O) === 0 && be(this.tins.bakw, O) === 0) : !1
        },
        _,
        $
      ) }));
      if (P) {
        this.compiledOuter = {
          outerTransform: "worldFile",
          worldFile: n,
          vertices_points: P.vertices.map(({ forw: N, bakw: C }) => [N, C])
        };
        const { centroid: $, xy: M, wh: T, kinks: _ } = this;
        super.setCompiled(this.getCompiled()), Object.assign(this, { centroid: $, xy: M, wh: T, kinks: _ }), this.lastBoundaryDiagnostics = {
          ...P.diagnostics,
          requestedOuterTransform: "worldFile",
          outerTransform: "worldFile"
        };
        return;
      }
      this.compiledOuter = { outerTransform: "extrapolate" }, this.outerTransform = "extrapolate", this.worldFile = void 0;
    }
    const E = this.vertexMode === rt.VERTEX_BIRDEYE ? br : vr;
    let k, A;
    e ? { boundary: k, verticesList: A } = this.buildWithSupplements(t, s, w, (B, O, P) => ($) => {
      const M = yn(
        y,
        E,
        s,
        this.points.length,
        void 0,
        $,
        B
      );
      return {
        boundary: M,
        verticesList: this.buildTin(
          s,
          M?.vertices ?? E(y, !1),
          O,
          M,
          $.size > 0,
          P
        )
      };
    }) : A = this.buildTin(
      s,
      E(y, !1),
      t,
      void 0
    ), this.vertices_params = {
      forw: gn(A.forw, this.centroid.forw),
      bakw: gn(A.bakw, this.centroid.bakw)
    }, this.addIndexedTin(), this.pointsWeightBuffer = {}, this.lastBoundaryDiagnostics = k?.diagnostics, n && this.lastBoundaryDiagnostics && (this.lastBoundaryDiagnostics = {
      ...this.lastBoundaryDiagnostics,
      requestedOuterTransform: "worldFile",
      outerTransform: "extrapolate",
      fallbackReason: "boundaryFlips"
    });
  }
  /**
   * `buildWithHull` で三角網を組み、strict のために制約から外した凸包の辺があれば、システムが補完点を
   * 足して組み直す（#89）。外れた辺が無いとき、補完点を使わない指定のとき、V2 のときは、`buildWithHull` の
   * 結果をそのまま返す。
   *
   * 補完点は rawPointsSet と allGcps と edgeNodes の末尾に、添字 `e{n}` で足す（必須エッジの中継点の
   * 続き番号）。重心・扇形外挿の推定（pointsSetFC・convexBuf）には入れない。loose 指定には足さない
   * （MaplatTin#95）。
   *
   * @param makeAttempt 点群ごとの探索の入れ物と strict の方式・「三角網の向きを読むだけ」（交差を調べない）を
   *   受け取り、`buildWithHull` に渡す試行を返す
   */
  buildWithSupplements(t, e, n, s) {
    let o = 0;
    const i = (y, E, k) => {
      const A = s(y, E, k);
      return (B) => (o++, A(B));
    }, a = (y) => this.buildWithHull(y, i(/* @__PURE__ */ new Map(), y, !1));
    if (!this.useSupplementPairs || this.useV2Algorithm || t === rt.MODE_LOOSE) return a(t);
    const c = t, l = a(c), u = o;
    let f = 0;
    if (!l.boundary || this.strict_status !== rt.STATUS_STRICT) return l;
    const d = Pe(this.tins.forw, this.pointsSet.forw.features, l.boundary.forwHull.all);
    if (d.dropped.length === 0) return l;
    const b = this.edgeNodes.length, v = e.forw.length, p = n.length;
    let S = [], I;
    const g = (y, E) => y.length === E.length && y.every((k, A) => k.every((B, O) => B[0] === E[A][O][0] && B[1] === E[A][O][1])), m = (y) => {
      e.forw.length = v, e.bakw.length = v, n.length = p, this.edgeNodes.length = b;
      for (const [E, k] of y) {
        const A = Ut(E, k, `e${this.edgeNodes.length}`);
        this.edgeNodes.push([E, k]), e.forw.push(A), e.bakw.push(Vt(A)), n.push({ forw: E, bakw: k });
      }
      S = y;
    }, w = fs({
      edgeBase: b,
      baseCost: u,
      buildCost: () => f,
      snapshot: () => ({ pairs: S, state: this.captureBuild() }),
      restore: ({ pairs: y, state: E }) => {
        m(y), this.restoreBuild(E);
      },
      measure: (y) => {
        m(y);
        const E = this.captureBuild();
        try {
          const k = /* @__PURE__ */ new Map();
          I = { pairs: y, cache: k };
          const { boundary: A } = s(k, rt.MODE_STRICT, !0)(/* @__PURE__ */ new Set());
          return A ? Pe(this.tins.forw, this.pointsSet.forw.features, []) : void 0;
        } finally {
          this.restoreBuild(E);
        }
      },
      build: (y, E) => {
        m(y);
        const k = I && g(I.pairs, y) ? I.cache : /* @__PURE__ */ new Map(), A = o;
        let B;
        try {
          B = this.buildWithHull(c, (O) => {
            if (o - A >= E) throw Fn;
            return i(k, c, !1)(O);
          });
        } catch (O) {
          if (O !== Fn) throw O;
          f += o - A;
          return;
        }
        if (f += o - A, !(!B.boundary || this.strict_status !== rt.STATUS_STRICT))
          return {
            result: B,
            analysis: Pe(this.tins.forw, this.pointsSet.forw.features, B.boundary.forwHull.all)
          };
      }
    }, { result: l, analysis: d });
    return this.supplementRecords = w.records, this.lastSupplementDiagnostics = w.diagnostics, w.result;
  }
  /**
   * 凸包の辺を全部制約にして三角網を組み、strict を壊したときは、壊した原因の凸包の辺だけを外して
   * 組み直す。strict に戻るか、外す辺が無くなるまで繰り返し（strict を壊さない範囲で、なるべく多くの
   * 凸包の辺を制約にする）、戻ったら、外した辺を 1 本ずつ制約に戻して strict を保てるか試す。
   *
   * strict に戻らないときは、外して得るものが無いので、凸包の辺を全部制約にした最初の三角網を採る。
   * 凸包の辺を全部外した三角網が strict になるときだけは、そちらを採る。
   *
   * 返す結果と `this` の状態（三角網・点群・strict の判定・交差）は、必ず同じ試行から来る。試行の結果は
   * 控えておき、採用する試行の状態を戻す（失敗した試行の状態を残さない）。同じ外す指定の試行は
   * 繰り返さない。strict でも auto でもない（loose の）ときは組み直さない。
   *
   * 外す辺がある試行（最初の試行以外）は、strict になるかどうかだけが要る（採用されるのは、交差が無い
   * strict の試行か、最初の試行だけ）ので、交差の数え上げは 1 件で止める（`buildTin` の onlyDetectKinks）。
   *
   * @param attempt 外す辺の鍵を受け取り、外周を探して `this.tins` などを組み、探索の結果を返す
   */
  buildWithHull(t, e) {
    const n = /* @__PURE__ */ new Map();
    let s;
    const o = (p) => [...p].sort().join(","), i = (p, S = !1) => {
      const I = o(p), g = n.get(I);
      if (g) return g;
      const m = e(p), h = {
        value: m,
        strict: m.boundary !== void 0 && this.strict_status === rt.STATUS_STRICT
      };
      return (h.strict || S) && (h.state = this.captureBuild()), n.set(I, h), s = h, h;
    }, a = (p) => (s !== p && this.restoreBuild(p.state), s = p, p.value), c = i(/* @__PURE__ */ new Set(), !0);
    if (!(t === rt.MODE_STRICT || t === rt.MODE_AUTO) || !c.value.boundary || c.strict) return c.value;
    const u = new Set(c.value.boundary.forwHull.all.map(ve)), f = () => this.pointsSet.forw.features.map(
      (p) => p.properties.target.index
    ), d = /* @__PURE__ */ new Set();
    let b = c, v;
    for (let p = 0; p < us; p++) {
      const S = es(
        this.tins.forw,
        b.value.boundary.forwHull.applied,
        f()
      ).filter((I) => !d.has(ve(I)));
      if (S.length === 0) break;
      for (const I of S) d.add(ve(I));
      if (b = i(d), !b.value.boundary) break;
      if (b.strict) {
        v = b;
        break;
      }
    }
    if (v) {
      let p = v;
      for (const S of [...d].slice(0, hs)) {
        const I = new Set(d);
        I.delete(S);
        const g = i(I);
        g.strict && (d.delete(S), p = g);
      }
      return a(p);
    }
    if (d.size < u.size) {
      const p = i(u);
      if (p.strict) return a(p);
    }
    return a(c);
  }
  /** 三角網を組んだ結果の状態（試行ごとに控え、採用する試行の状態に戻す）。 */
  captureBuild() {
    return {
      tins: this.tins,
      pointsSet: this.pointsSet,
      strict_status: this.strict_status,
      kinks: this.kinks
    };
  }
  restoreBuild(t) {
    this.tins = t.tins, this.pointsSet = t.pointsSet, this.strict_status = t.strict_status, t.kinks ? this.kinks = t.kinks : delete this.kinks;
  }
  /** 補助頂点を含め、strictMode に従って実際に使う両方向の三角網を組む。 */
  buildTin(t, e, n, s, o = !1, i = !1) {
    const a = {
      forw: [],
      bakw: []
    };
    for (let c = 0; c < e.length; c++) {
      const l = e[c].forw, u = e[c].bakw, f = Ut(l, u, `b${c}`), d = Vt(f);
      a.forw.push(f), a.bakw.push(d);
    }
    return this.pointsSet = {
      forw: Mt([...t.forw, ...a.forw]),
      bakw: Mt([...t.bakw, ...a.bakw]),
      edges: t.edges
    }, this.tins = {
      forw: Ue(
        s?.forw ?? pe(this.pointsSet.forw, t.edges, "target")
      )
    }, (n === rt.MODE_STRICT || n === rt.MODE_AUTO) && (i ? this.resolveStrictOverlaps() : this.calculateStrictTin(
      n === rt.MODE_AUTO || o ? 1 : Sn
    )), (n === rt.MODE_LOOSE || n === rt.MODE_AUTO && this.strict_status === rt.STATUS_ERROR) && (this.tins.bakw = Ue(
      s?.bakw ?? pe(this.pointsSet.bakw, t.edges, "target")
    ), delete this.kinks, this.strict_status = rt.STATUS_LOOSE), a;
  }
  /**
   * 非同期ラッパーを提供します。
   * 互換性のために Promise ベースの API を維持しますが、内部処理は同期的です。
   */
  async updateTinAsync() {
    this.updateTin();
  }
}
function ds(r, t, e) {
  const n = (s) => Number.isInteger(s) && s >= 0 && s < t;
  if (!Array.isArray(r) || !n(r[0]) || !n(r[1]))
    throw new Error(
      `Invalid edge at edges[${e}]: start/end ${JSON.stringify(r)} must be integer indices of points (0 to ${t - 1})`
    );
}
export {
  rt as Tin,
  pe as constrainedTin,
  Vt as counterPoint,
  Ut as createPoint,
  rt as default,
  gs as findIntersections,
  On as format_version,
  jn as insertSearchIndex,
  gn as vertexCalc
};
