import { counterTri as Pn, Transform as Gn, validateWorldFile as Jn, normalizeEdges as Qn, transformArr as Me, rotateVerticesTriangle as Ve, worldFileToCrs as Zn } from "@maplat/transform";
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
function je(r, t, e = {}) {
  if (r.length < 2)
    throw new Error("coordinates must be an array of two or more positions");
  return ee({
    type: "LineString",
    coordinates: r
  }, t, e);
}
function St(r, t = {}) {
  const e = { type: "FeatureCollection" };
  return t.id && (e.id = t.id), t.bbox && (e.bbox = t.bbox), e.features = r, e;
}
function ze(r) {
  return !isNaN(r) && r !== null && !Array.isArray(r);
}
function ti(r) {
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
function ei(r) {
  return r.type === "Feature" ? r.geometry : r;
}
function $e(r, t, e) {
  if (r !== null)
    for (var n, s, o, i, a, c, l, u = 0, f = 0, d, y = r.type, w = y === "FeatureCollection", p = y === "Feature", _ = w ? r.features.length : 1, I = 0; I < _; I++) {
      l = w ? (
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
          var v = i.type;
          switch (u = e && (v === "Polygon" || v === "MultiPolygon") ? 1 : 0, v) {
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
                f++, v === "MultiPoint" && m++;
              }
              v === "LineString" && m++;
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
                v === "MultiLineString" && m++, v === "Polygon" && h++;
              }
              v === "Polygon" && m++;
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
const pt = 11102230246251565e-32, j = 134217729, Cn = (3 + 8 * pt) * pt;
function ht(r, t, e, n, s) {
  let o, i, a, c, l = t[0], u = n[0], f = 0, d = 0;
  u > l == u > -l ? (o = l, l = t[++f]) : (o = u, u = n[++d]);
  let y = 0;
  if (f < r && d < e)
    for (u > l == u > -l ? (i = l + o, a = o - (i - l), l = t[++f]) : (i = u + o, a = o - (i - u), u = n[++d]), o = i, a !== 0 && (s[y++] = a); f < r && d < e; )
      u > l == u > -l ? (i = o + l, c = i - o, a = o - (i - c) + (l - c), l = t[++f]) : (i = o + u, c = i - o, a = o - (i - c) + (u - c), u = n[++d]), o = i, a !== 0 && (s[y++] = a);
  for (; f < r; )
    i = o + l, c = i - o, a = o - (i - c) + (l - c), l = t[++f], o = i, a !== 0 && (s[y++] = a);
  for (; d < e; )
    i = o + u, c = i - o, a = o - (i - c) + (u - c), u = n[++d], o = i, a !== 0 && (s[y++] = a);
  return (o !== 0 || y === 0) && (s[y++] = o), y;
}
function Mt(r, t, e, n, s, o, i, a) {
  return ht(ht(r, t, e, n, i), i, s, o, a);
}
function Y(r, t, e, n) {
  let s, o, i, a, c, l, u, f, d, y, w;
  u = j * e, y = u - (u - e), w = e - y;
  let p = t[0];
  s = p * e, u = j * p, f = u - (u - p), d = p - f, i = d * w - (s - f * y - d * y - f * w);
  let _ = 0;
  i !== 0 && (n[_++] = i);
  for (let I = 1; I < r; I++)
    p = t[I], a = p * e, u = j * p, f = u - (u - p), d = p - f, c = d * w - (a - f * y - d * y - f * w), o = s + c, l = o - s, i = s - (o - l) + (c - l), i !== 0 && (n[_++] = i), s = a + o, i = o - (s - a), i !== 0 && (n[_++] = i);
  return (s !== 0 || _ === 0) && (n[_++] = s), _;
}
function Dn(r, t) {
  let e = t[0];
  for (let n = 1; n < r; n++) e += t[n];
  return e;
}
function tt(r) {
  return new Float64Array(r);
}
const ni = (3 + 16 * pt) * pt, ii = (2 + 12 * pt) * pt, ri = (9 + 64 * pt) * pt * pt, qt = tt(4), Ke = tt(8), He = tt(12), We = tt(16), gt = tt(4);
function si(r, t, e, n, s, o, i) {
  let a, c, l, u, f, d, y, w, p, _, I, g, m, h, v, b, A, E;
  const k = r - s, B = e - s, O = t - o, C = n - o;
  h = k * C, d = j * k, y = d - (d - k), w = k - y, d = j * C, p = d - (d - C), _ = C - p, v = w * _ - (h - y * p - w * p - y * _), b = O * B, d = j * O, y = d - (d - O), w = O - y, d = j * B, p = d - (d - B), _ = B - p, A = w * _ - (b - y * p - w * p - y * _), I = v - A, f = v - I, qt[0] = v - (I + f) + (f - A), g = h + I, f = g - h, m = h - (g - f) + (I - f), I = m - b, f = m - I, qt[1] = m - (I + f) + (f - b), E = g + I, f = E - g, qt[2] = g - (E - f) + (I - f), qt[3] = E;
  let $ = Dn(4, qt), S = ii * i;
  if ($ >= S || -$ >= S || (f = r - k, a = r - (k + f) + (f - s), f = e - B, l = e - (B + f) + (f - s), f = t - O, c = t - (O + f) + (f - o), f = n - C, u = n - (C + f) + (f - o), a === 0 && c === 0 && l === 0 && u === 0) || (S = ri * i + Cn * Math.abs($), $ += k * u + C * a - (O * l + B * c), $ >= S || -$ >= S)) return $;
  h = a * C, d = j * a, y = d - (d - a), w = a - y, d = j * C, p = d - (d - C), _ = C - p, v = w * _ - (h - y * p - w * p - y * _), b = c * B, d = j * c, y = d - (d - c), w = c - y, d = j * B, p = d - (d - B), _ = B - p, A = w * _ - (b - y * p - w * p - y * _), I = v - A, f = v - I, gt[0] = v - (I + f) + (f - A), g = h + I, f = g - h, m = h - (g - f) + (I - f), I = m - b, f = m - I, gt[1] = m - (I + f) + (f - b), E = g + I, f = E - g, gt[2] = g - (E - f) + (I - f), gt[3] = E;
  const T = ht(4, qt, 4, gt, Ke);
  h = k * u, d = j * k, y = d - (d - k), w = k - y, d = j * u, p = d - (d - u), _ = u - p, v = w * _ - (h - y * p - w * p - y * _), b = O * l, d = j * O, y = d - (d - O), w = O - y, d = j * l, p = d - (d - l), _ = l - p, A = w * _ - (b - y * p - w * p - y * _), I = v - A, f = v - I, gt[0] = v - (I + f) + (f - A), g = h + I, f = g - h, m = h - (g - f) + (I - f), I = m - b, f = m - I, gt[1] = m - (I + f) + (f - b), E = g + I, f = E - g, gt[2] = g - (E - f) + (I - f), gt[3] = E;
  const M = ht(T, Ke, 4, gt, He);
  h = a * u, d = j * a, y = d - (d - a), w = a - y, d = j * u, p = d - (d - u), _ = u - p, v = w * _ - (h - y * p - w * p - y * _), b = c * l, d = j * c, y = d - (d - c), w = c - y, d = j * l, p = d - (d - l), _ = l - p, A = w * _ - (b - y * p - w * p - y * _), I = v - A, f = v - I, gt[0] = v - (I + f) + (f - A), g = h + I, f = g - h, m = h - (g - f) + (I - f), I = m - b, f = m - I, gt[1] = m - (I + f) + (f - b), E = g + I, f = E - g, gt[2] = g - (E - f) + (I - f), gt[3] = E;
  const N = ht(M, He, 4, gt, We);
  return We[N - 1];
}
function ft(r, t, e, n, s, o) {
  const i = (t - o) * (e - s), a = (r - s) * (n - o), c = i - a, l = Math.abs(i + a);
  return Math.abs(c) >= ni * l ? c : -si(r, t, e, n, s, o, l);
}
const oi = (10 + 96 * pt) * pt, ai = (4 + 48 * pt) * pt, ci = (44 + 576 * pt) * pt * pt, Ot = tt(4), Nt = tt(4), Ft = tt(4), _t = tt(4), Et = tt(4), kt = tt(4), mt = tt(4), wt = tt(4), _e = tt(8), Ee = tt(8), ke = tt(8), Ae = tt(8), Ie = tt(8), Be = tt(8), oe = tt(8), ae = tt(8), ce = tt(8), Rt = tt(4), $t = tt(4), Xt = tt(4), z = tt(8), W = tt(16), nt = tt(16), it = tt(16), et = tt(32), Pt = tt(32), ct = tt(48), vt = tt(64);
let Kt = tt(1152), Te = tt(1152);
function lt(r, t, e) {
  r = ht(r, Kt, t, e, Te);
  const n = Kt;
  return Kt = Te, Te = n, r;
}
function li(r, t, e, n, s, o, i, a, c) {
  let l, u, f, d, y, w, p, _, I, g, m, h, v, b, A, E, k, B, O, C, $, S, T, M, N, P, D, x, F, R, X, q, L, V, U;
  const H = r - i, K = e - i, G = s - i, J = t - a, Z = n - a, Q = o - a;
  X = K * Q, T = j * K, M = T - (T - K), N = K - M, T = j * Q, P = T - (T - Q), D = Q - P, q = N * D - (X - M * P - N * P - M * D), L = G * Z, T = j * G, M = T - (T - G), N = G - M, T = j * Z, P = T - (T - Z), D = Z - P, V = N * D - (L - M * P - N * P - M * D), x = q - V, S = q - x, Ot[0] = q - (x + S) + (S - V), F = X + x, S = F - X, R = X - (F - S) + (x - S), x = R - L, S = R - x, Ot[1] = R - (x + S) + (S - L), U = F + x, S = U - F, Ot[2] = F - (U - S) + (x - S), Ot[3] = U, X = G * J, T = j * G, M = T - (T - G), N = G - M, T = j * J, P = T - (T - J), D = J - P, q = N * D - (X - M * P - N * P - M * D), L = H * Q, T = j * H, M = T - (T - H), N = H - M, T = j * Q, P = T - (T - Q), D = Q - P, V = N * D - (L - M * P - N * P - M * D), x = q - V, S = q - x, Nt[0] = q - (x + S) + (S - V), F = X + x, S = F - X, R = X - (F - S) + (x - S), x = R - L, S = R - x, Nt[1] = R - (x + S) + (S - L), U = F + x, S = U - F, Nt[2] = F - (U - S) + (x - S), Nt[3] = U, X = H * Z, T = j * H, M = T - (T - H), N = H - M, T = j * Z, P = T - (T - Z), D = Z - P, q = N * D - (X - M * P - N * P - M * D), L = K * J, T = j * K, M = T - (T - K), N = K - M, T = j * J, P = T - (T - J), D = J - P, V = N * D - (L - M * P - N * P - M * D), x = q - V, S = q - x, Ft[0] = q - (x + S) + (S - V), F = X + x, S = F - X, R = X - (F - S) + (x - S), x = R - L, S = R - x, Ft[1] = R - (x + S) + (S - L), U = F + x, S = U - F, Ft[2] = F - (U - S) + (x - S), Ft[3] = U, l = ht(
    ht(
      ht(
        Y(Y(4, Ot, H, z), z, H, W),
        W,
        Y(Y(4, Ot, J, z), z, J, nt),
        nt,
        et
      ),
      et,
      ht(
        Y(Y(4, Nt, K, z), z, K, W),
        W,
        Y(Y(4, Nt, Z, z), z, Z, nt),
        nt,
        Pt
      ),
      Pt,
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
    Kt
  );
  let at = Dn(l, Kt), ut = ai * c;
  if (at >= ut || -at >= ut || (S = r - H, u = r - (H + S) + (S - i), S = t - J, y = t - (J + S) + (S - a), S = e - K, f = e - (K + S) + (S - i), S = n - Z, w = n - (Z + S) + (S - a), S = s - G, d = s - (G + S) + (S - i), S = o - Q, p = o - (Q + S) + (S - a), u === 0 && f === 0 && d === 0 && y === 0 && w === 0 && p === 0) || (ut = ci * c + Cn * Math.abs(at), at += (H * H + J * J) * (K * p + Q * f - (Z * d + G * w)) + 2 * (H * u + J * y) * (K * Q - Z * G) + ((K * K + Z * Z) * (G * y + J * d - (Q * u + H * p)) + 2 * (K * f + Z * w) * (G * J - Q * H)) + ((G * G + Q * Q) * (H * w + Z * u - (J * f + K * y)) + 2 * (G * d + Q * p) * (H * Z - J * K)), at >= ut || -at >= ut))
    return at;
  if ((f !== 0 || w !== 0 || d !== 0 || p !== 0) && (X = H * H, T = j * H, M = T - (T - H), N = H - M, q = N * N - (X - M * M - (M + M) * N), L = J * J, T = j * J, M = T - (T - J), N = J - M, V = N * N - (L - M * M - (M + M) * N), x = q + V, S = x - q, _t[0] = q - (x - S) + (V - S), F = X + x, S = F - X, R = X - (F - S) + (x - S), x = R + L, S = x - R, _t[1] = R - (x - S) + (L - S), U = F + x, S = U - F, _t[2] = F - (U - S) + (x - S), _t[3] = U), (d !== 0 || p !== 0 || u !== 0 || y !== 0) && (X = K * K, T = j * K, M = T - (T - K), N = K - M, q = N * N - (X - M * M - (M + M) * N), L = Z * Z, T = j * Z, M = T - (T - Z), N = Z - M, V = N * N - (L - M * M - (M + M) * N), x = q + V, S = x - q, Et[0] = q - (x - S) + (V - S), F = X + x, S = F - X, R = X - (F - S) + (x - S), x = R + L, S = x - R, Et[1] = R - (x - S) + (L - S), U = F + x, S = U - F, Et[2] = F - (U - S) + (x - S), Et[3] = U), (u !== 0 || y !== 0 || f !== 0 || w !== 0) && (X = G * G, T = j * G, M = T - (T - G), N = G - M, q = N * N - (X - M * M - (M + M) * N), L = Q * Q, T = j * Q, M = T - (T - Q), N = Q - M, V = N * N - (L - M * M - (M + M) * N), x = q + V, S = x - q, kt[0] = q - (x - S) + (V - S), F = X + x, S = F - X, R = X - (F - S) + (x - S), x = R + L, S = x - R, kt[1] = R - (x - S) + (L - S), U = F + x, S = U - F, kt[2] = F - (U - S) + (x - S), kt[3] = U), u !== 0 && (_ = Y(4, Ot, u, _e), l = lt(l, Mt(
    Y(_, _e, 2 * H, W),
    W,
    Y(Y(4, kt, u, z), z, Z, nt),
    nt,
    Y(Y(4, Et, u, z), z, -Q, it),
    it,
    et,
    ct
  ), ct)), y !== 0 && (I = Y(4, Ot, y, Ee), l = lt(l, Mt(
    Y(I, Ee, 2 * J, W),
    W,
    Y(Y(4, Et, y, z), z, G, nt),
    nt,
    Y(Y(4, kt, y, z), z, -K, it),
    it,
    et,
    ct
  ), ct)), f !== 0 && (g = Y(4, Nt, f, ke), l = lt(l, Mt(
    Y(g, ke, 2 * K, W),
    W,
    Y(Y(4, _t, f, z), z, Q, nt),
    nt,
    Y(Y(4, kt, f, z), z, -J, it),
    it,
    et,
    ct
  ), ct)), w !== 0 && (m = Y(4, Nt, w, Ae), l = lt(l, Mt(
    Y(m, Ae, 2 * Z, W),
    W,
    Y(Y(4, kt, w, z), z, H, nt),
    nt,
    Y(Y(4, _t, w, z), z, -G, it),
    it,
    et,
    ct
  ), ct)), d !== 0 && (h = Y(4, Ft, d, Ie), l = lt(l, Mt(
    Y(h, Ie, 2 * G, W),
    W,
    Y(Y(4, Et, d, z), z, J, nt),
    nt,
    Y(Y(4, _t, d, z), z, -Z, it),
    it,
    et,
    ct
  ), ct)), p !== 0 && (v = Y(4, Ft, p, Be), l = lt(l, Mt(
    Y(v, Be, 2 * Q, W),
    W,
    Y(Y(4, _t, p, z), z, K, nt),
    nt,
    Y(Y(4, Et, p, z), z, -H, it),
    it,
    et,
    ct
  ), ct)), u !== 0 || y !== 0) {
    if (f !== 0 || w !== 0 || d !== 0 || p !== 0 ? (X = f * Q, T = j * f, M = T - (T - f), N = f - M, T = j * Q, P = T - (T - Q), D = Q - P, q = N * D - (X - M * P - N * P - M * D), L = K * p, T = j * K, M = T - (T - K), N = K - M, T = j * p, P = T - (T - p), D = p - P, V = N * D - (L - M * P - N * P - M * D), x = q + V, S = x - q, mt[0] = q - (x - S) + (V - S), F = X + x, S = F - X, R = X - (F - S) + (x - S), x = R + L, S = x - R, mt[1] = R - (x - S) + (L - S), U = F + x, S = U - F, mt[2] = F - (U - S) + (x - S), mt[3] = U, X = d * -Z, T = j * d, M = T - (T - d), N = d - M, T = j * -Z, P = T - (T - -Z), D = -Z - P, q = N * D - (X - M * P - N * P - M * D), L = G * -w, T = j * G, M = T - (T - G), N = G - M, T = j * -w, P = T - (T - -w), D = -w - P, V = N * D - (L - M * P - N * P - M * D), x = q + V, S = x - q, wt[0] = q - (x - S) + (V - S), F = X + x, S = F - X, R = X - (F - S) + (x - S), x = R + L, S = x - R, wt[1] = R - (x - S) + (L - S), U = F + x, S = U - F, wt[2] = F - (U - S) + (x - S), wt[3] = U, A = ht(4, mt, 4, wt, ae), X = f * p, T = j * f, M = T - (T - f), N = f - M, T = j * p, P = T - (T - p), D = p - P, q = N * D - (X - M * P - N * P - M * D), L = d * w, T = j * d, M = T - (T - d), N = d - M, T = j * w, P = T - (T - w), D = w - P, V = N * D - (L - M * P - N * P - M * D), x = q - V, S = q - x, $t[0] = q - (x + S) + (S - V), F = X + x, S = F - X, R = X - (F - S) + (x - S), x = R - L, S = R - x, $t[1] = R - (x + S) + (S - L), U = F + x, S = U - F, $t[2] = F - (U - S) + (x - S), $t[3] = U, B = 4) : (ae[0] = 0, A = 1, $t[0] = 0, B = 1), u !== 0) {
      const st = Y(A, ae, u, it);
      l = lt(l, ht(
        Y(_, _e, u, W),
        W,
        Y(st, it, 2 * H, et),
        et,
        ct
      ), ct);
      const ot = Y(B, $t, u, z);
      l = lt(l, Mt(
        Y(ot, z, 2 * H, W),
        W,
        Y(ot, z, u, nt),
        nt,
        Y(st, it, u, et),
        et,
        Pt,
        vt
      ), vt), w !== 0 && (l = lt(l, Y(Y(4, kt, u, z), z, w, W), W)), p !== 0 && (l = lt(l, Y(Y(4, Et, -u, z), z, p, W), W));
    }
    if (y !== 0) {
      const st = Y(A, ae, y, it);
      l = lt(l, ht(
        Y(I, Ee, y, W),
        W,
        Y(st, it, 2 * J, et),
        et,
        ct
      ), ct);
      const ot = Y(B, $t, y, z);
      l = lt(l, Mt(
        Y(ot, z, 2 * J, W),
        W,
        Y(ot, z, y, nt),
        nt,
        Y(st, it, y, et),
        et,
        Pt,
        vt
      ), vt);
    }
  }
  if (f !== 0 || w !== 0) {
    if (d !== 0 || p !== 0 || u !== 0 || y !== 0 ? (X = d * J, T = j * d, M = T - (T - d), N = d - M, T = j * J, P = T - (T - J), D = J - P, q = N * D - (X - M * P - N * P - M * D), L = G * y, T = j * G, M = T - (T - G), N = G - M, T = j * y, P = T - (T - y), D = y - P, V = N * D - (L - M * P - N * P - M * D), x = q + V, S = x - q, mt[0] = q - (x - S) + (V - S), F = X + x, S = F - X, R = X - (F - S) + (x - S), x = R + L, S = x - R, mt[1] = R - (x - S) + (L - S), U = F + x, S = U - F, mt[2] = F - (U - S) + (x - S), mt[3] = U, C = -Q, $ = -p, X = u * C, T = j * u, M = T - (T - u), N = u - M, T = j * C, P = T - (T - C), D = C - P, q = N * D - (X - M * P - N * P - M * D), L = H * $, T = j * H, M = T - (T - H), N = H - M, T = j * $, P = T - (T - $), D = $ - P, V = N * D - (L - M * P - N * P - M * D), x = q + V, S = x - q, wt[0] = q - (x - S) + (V - S), F = X + x, S = F - X, R = X - (F - S) + (x - S), x = R + L, S = x - R, wt[1] = R - (x - S) + (L - S), U = F + x, S = U - F, wt[2] = F - (U - S) + (x - S), wt[3] = U, E = ht(4, mt, 4, wt, ce), X = d * y, T = j * d, M = T - (T - d), N = d - M, T = j * y, P = T - (T - y), D = y - P, q = N * D - (X - M * P - N * P - M * D), L = u * p, T = j * u, M = T - (T - u), N = u - M, T = j * p, P = T - (T - p), D = p - P, V = N * D - (L - M * P - N * P - M * D), x = q - V, S = q - x, Xt[0] = q - (x + S) + (S - V), F = X + x, S = F - X, R = X - (F - S) + (x - S), x = R - L, S = R - x, Xt[1] = R - (x + S) + (S - L), U = F + x, S = U - F, Xt[2] = F - (U - S) + (x - S), Xt[3] = U, O = 4) : (ce[0] = 0, E = 1, Xt[0] = 0, O = 1), f !== 0) {
      const st = Y(E, ce, f, it);
      l = lt(l, ht(
        Y(g, ke, f, W),
        W,
        Y(st, it, 2 * K, et),
        et,
        ct
      ), ct);
      const ot = Y(O, Xt, f, z);
      l = lt(l, Mt(
        Y(ot, z, 2 * K, W),
        W,
        Y(ot, z, f, nt),
        nt,
        Y(st, it, f, et),
        et,
        Pt,
        vt
      ), vt), p !== 0 && (l = lt(l, Y(Y(4, _t, f, z), z, p, W), W)), y !== 0 && (l = lt(l, Y(Y(4, kt, -f, z), z, y, W), W));
    }
    if (w !== 0) {
      const st = Y(E, ce, w, it);
      l = lt(l, ht(
        Y(m, Ae, w, W),
        W,
        Y(st, it, 2 * Z, et),
        et,
        ct
      ), ct);
      const ot = Y(O, Xt, w, z);
      l = lt(l, Mt(
        Y(ot, z, 2 * Z, W),
        W,
        Y(ot, z, w, nt),
        nt,
        Y(st, it, w, et),
        et,
        Pt,
        vt
      ), vt);
    }
  }
  if (d !== 0 || p !== 0) {
    if (u !== 0 || y !== 0 || f !== 0 || w !== 0 ? (X = u * Z, T = j * u, M = T - (T - u), N = u - M, T = j * Z, P = T - (T - Z), D = Z - P, q = N * D - (X - M * P - N * P - M * D), L = H * w, T = j * H, M = T - (T - H), N = H - M, T = j * w, P = T - (T - w), D = w - P, V = N * D - (L - M * P - N * P - M * D), x = q + V, S = x - q, mt[0] = q - (x - S) + (V - S), F = X + x, S = F - X, R = X - (F - S) + (x - S), x = R + L, S = x - R, mt[1] = R - (x - S) + (L - S), U = F + x, S = U - F, mt[2] = F - (U - S) + (x - S), mt[3] = U, C = -J, $ = -y, X = f * C, T = j * f, M = T - (T - f), N = f - M, T = j * C, P = T - (T - C), D = C - P, q = N * D - (X - M * P - N * P - M * D), L = K * $, T = j * K, M = T - (T - K), N = K - M, T = j * $, P = T - (T - $), D = $ - P, V = N * D - (L - M * P - N * P - M * D), x = q + V, S = x - q, wt[0] = q - (x - S) + (V - S), F = X + x, S = F - X, R = X - (F - S) + (x - S), x = R + L, S = x - R, wt[1] = R - (x - S) + (L - S), U = F + x, S = U - F, wt[2] = F - (U - S) + (x - S), wt[3] = U, b = ht(4, mt, 4, wt, oe), X = u * w, T = j * u, M = T - (T - u), N = u - M, T = j * w, P = T - (T - w), D = w - P, q = N * D - (X - M * P - N * P - M * D), L = f * y, T = j * f, M = T - (T - f), N = f - M, T = j * y, P = T - (T - y), D = y - P, V = N * D - (L - M * P - N * P - M * D), x = q - V, S = q - x, Rt[0] = q - (x + S) + (S - V), F = X + x, S = F - X, R = X - (F - S) + (x - S), x = R - L, S = R - x, Rt[1] = R - (x + S) + (S - L), U = F + x, S = U - F, Rt[2] = F - (U - S) + (x - S), Rt[3] = U, k = 4) : (oe[0] = 0, b = 1, Rt[0] = 0, k = 1), d !== 0) {
      const st = Y(b, oe, d, it);
      l = lt(l, ht(
        Y(h, Ie, d, W),
        W,
        Y(st, it, 2 * G, et),
        et,
        ct
      ), ct);
      const ot = Y(k, Rt, d, z);
      l = lt(l, Mt(
        Y(ot, z, 2 * G, W),
        W,
        Y(ot, z, d, nt),
        nt,
        Y(st, it, d, et),
        et,
        Pt,
        vt
      ), vt), y !== 0 && (l = lt(l, Y(Y(4, Et, d, z), z, y, W), W)), w !== 0 && (l = lt(l, Y(Y(4, _t, -d, z), z, w, W), W));
    }
    if (p !== 0) {
      const st = Y(b, oe, p, it);
      l = lt(l, ht(
        Y(v, Be, p, W),
        W,
        Y(st, it, 2 * Q, et),
        et,
        ct
      ), ct);
      const ot = Y(k, Rt, p, z);
      l = lt(l, Mt(
        Y(ot, z, 2 * Q, W),
        W,
        Y(ot, z, p, nt),
        nt,
        Y(st, it, p, et),
        et,
        Pt,
        vt
      ), vt);
    }
  }
  return Kt[l - 1];
}
function fi(r, t, e, n, s, o, i, a) {
  const c = r - i, l = e - i, u = s - i, f = t - a, d = n - a, y = o - a, w = l * y, p = u * d, _ = c * c + f * f, I = u * f, g = c * y, m = l * l + d * d, h = c * d, v = l * f, b = u * u + y * y, A = _ * (w - p) + m * (I - g) + b * (h - v), E = (Math.abs(w) + Math.abs(p)) * _ + (Math.abs(I) + Math.abs(g)) * m + (Math.abs(h) + Math.abs(v)) * b, k = oi * E;
  return A > k || -A > k ? A : li(r, t, e, n, s, o, i, a, E);
}
function ui(r, t) {
  var e, n, s = 0, o, i, a, c, l, u, f, d = r[0], y = r[1], w = t.length;
  for (e = 0; e < w; e++) {
    n = 0;
    var p = t[e], _ = p.length - 1;
    if (u = p[0], u[0] !== p[_][0] && u[1] !== p[_][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (i = u[0] - d, a = u[1] - y, n; n < _; n++) {
      if (f = p[n + 1], c = f[0] - d, l = f[1] - y, a === 0 && l === 0) {
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
  const n = ti(r), s = ei(t), o = s.type, i = t.bbox;
  let a = s.coordinates;
  if (i && hi(n, i) === !1)
    return !1;
  o === "Polygon" && (a = [a]);
  for (var c = 0; c < a.length; ++c) {
    const l = ui(n, a[c]);
    if (l === 0 && !e.ignoreBoundary) return !0;
    if (l) return !0;
  }
  return !1;
}
function hi(r, t) {
  return t[0] <= r[0] && t[1] <= r[1] && t[2] >= r[0] && t[3] >= r[1];
}
class Xe {
  constructor(t = [], e = di) {
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
function di(r, t) {
  return r < t ? -1 : r > t ? 1 : 0;
}
const pi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Xe
}, Symbol.toStringTag, { value: "Module" })), Bt = 11102230246251565e-32, dt = 134217729, gi = (3 + 8 * Bt) * Bt;
function Oe(r, t, e, n, s) {
  let o, i, a, c, l = t[0], u = n[0], f = 0, d = 0;
  u > l == u > -l ? (o = l, l = t[++f]) : (o = u, u = n[++d]);
  let y = 0;
  if (f < r && d < e)
    for (u > l == u > -l ? (i = l + o, a = o - (i - l), l = t[++f]) : (i = u + o, a = o - (i - u), u = n[++d]), o = i, a !== 0 && (s[y++] = a); f < r && d < e; )
      u > l == u > -l ? (i = o + l, c = i - o, a = o - (i - c) + (l - c), l = t[++f]) : (i = o + u, c = i - o, a = o - (i - c) + (u - c), u = n[++d]), o = i, a !== 0 && (s[y++] = a);
  for (; f < r; )
    i = o + l, c = i - o, a = o - (i - c) + (l - c), l = t[++f], o = i, a !== 0 && (s[y++] = a);
  for (; d < e; )
    i = o + u, c = i - o, a = o - (i - c) + (u - c), u = n[++d], o = i, a !== 0 && (s[y++] = a);
  return (o !== 0 || y === 0) && (s[y++] = o), y;
}
function mi(r, t) {
  let e = t[0];
  for (let n = 1; n < r; n++) e += t[n];
  return e;
}
function se(r) {
  return new Float64Array(r);
}
const wi = (3 + 16 * Bt) * Bt, yi = (2 + 12 * Bt) * Bt, vi = (9 + 64 * Bt) * Bt * Bt, Ut = se(4), Je = se(8), Qe = se(12), Ze = se(16), yt = se(4);
function bi(r, t, e, n, s, o, i) {
  let a, c, l, u, f, d, y, w, p, _, I, g, m, h, v, b, A, E;
  const k = r - s, B = e - s, O = t - o, C = n - o;
  h = k * C, d = dt * k, y = d - (d - k), w = k - y, d = dt * C, p = d - (d - C), _ = C - p, v = w * _ - (h - y * p - w * p - y * _), b = O * B, d = dt * O, y = d - (d - O), w = O - y, d = dt * B, p = d - (d - B), _ = B - p, A = w * _ - (b - y * p - w * p - y * _), I = v - A, f = v - I, Ut[0] = v - (I + f) + (f - A), g = h + I, f = g - h, m = h - (g - f) + (I - f), I = m - b, f = m - I, Ut[1] = m - (I + f) + (f - b), E = g + I, f = E - g, Ut[2] = g - (E - f) + (I - f), Ut[3] = E;
  let $ = mi(4, Ut), S = yi * i;
  if ($ >= S || -$ >= S || (f = r - k, a = r - (k + f) + (f - s), f = e - B, l = e - (B + f) + (f - s), f = t - O, c = t - (O + f) + (f - o), f = n - C, u = n - (C + f) + (f - o), a === 0 && c === 0 && l === 0 && u === 0) || (S = vi * i + gi * Math.abs($), $ += k * u + C * a - (O * l + B * c), $ >= S || -$ >= S)) return $;
  h = a * C, d = dt * a, y = d - (d - a), w = a - y, d = dt * C, p = d - (d - C), _ = C - p, v = w * _ - (h - y * p - w * p - y * _), b = c * B, d = dt * c, y = d - (d - c), w = c - y, d = dt * B, p = d - (d - B), _ = B - p, A = w * _ - (b - y * p - w * p - y * _), I = v - A, f = v - I, yt[0] = v - (I + f) + (f - A), g = h + I, f = g - h, m = h - (g - f) + (I - f), I = m - b, f = m - I, yt[1] = m - (I + f) + (f - b), E = g + I, f = E - g, yt[2] = g - (E - f) + (I - f), yt[3] = E;
  const T = Oe(4, Ut, 4, yt, Je);
  h = k * u, d = dt * k, y = d - (d - k), w = k - y, d = dt * u, p = d - (d - u), _ = u - p, v = w * _ - (h - y * p - w * p - y * _), b = O * l, d = dt * O, y = d - (d - O), w = O - y, d = dt * l, p = d - (d - l), _ = l - p, A = w * _ - (b - y * p - w * p - y * _), I = v - A, f = v - I, yt[0] = v - (I + f) + (f - A), g = h + I, f = g - h, m = h - (g - f) + (I - f), I = m - b, f = m - I, yt[1] = m - (I + f) + (f - b), E = g + I, f = E - g, yt[2] = g - (E - f) + (I - f), yt[3] = E;
  const M = Oe(T, Je, 4, yt, Qe);
  h = a * u, d = dt * a, y = d - (d - a), w = a - y, d = dt * u, p = d - (d - u), _ = u - p, v = w * _ - (h - y * p - w * p - y * _), b = c * l, d = dt * c, y = d - (d - c), w = c - y, d = dt * l, p = d - (d - l), _ = l - p, A = w * _ - (b - y * p - w * p - y * _), I = v - A, f = v - I, yt[0] = v - (I + f) + (f - A), g = h + I, f = g - h, m = h - (g - f) + (I - f), I = m - b, f = m - I, yt[1] = m - (I + f) + (f - b), E = g + I, f = E - g, yt[2] = g - (E - f) + (I - f), yt[3] = E;
  const N = Oe(M, Qe, 4, yt, Ze);
  return Ze[N - 1];
}
function tn(r, t, e, n, s, o) {
  const i = (t - o) * (e - s), a = (r - s) * (n - o), c = i - a;
  if (i === 0 || a === 0 || i > 0 != a > 0) return c;
  const l = Math.abs(i + a);
  return Math.abs(c) >= wi * l ? c : -bi(r, t, e, n, s, o, l);
}
function Si(r, t) {
  const e = new Xe([], Rn);
  return Mi(r, e), _i(e, t);
}
function Rn(r, t) {
  return r.p.x > t.p.x ? 1 : r.p.x < t.p.x || r.p.x === t.p.x && (r.featureId !== t.featureId || r.ringId !== t.ringId) && r.isLeftEndpoint && !t.isLeftEndpoint ? -1 : r.p.y !== t.p.y ? r.p.y > t.p.y ? 1 : -1 : 1;
}
function xi(r, t) {
  return r.rightSweepEvent.p.x > t.rightSweepEvent.p.x ? 1 : r.rightSweepEvent.p.x < t.rightSweepEvent.p.x ? -1 : r.rightSweepEvent.p.y !== t.rightSweepEvent.p.y ? r.rightSweepEvent.p.y < t.rightSweepEvent.p.y ? 1 : -1 : 1;
}
function Mi(r, t) {
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
function _i(r, t = !1) {
  const e = [], n = new Xe([], xi);
  for (; r.length; ) {
    const s = r.pop();
    if (s.isLeftEndpoint) {
      const o = new Ei(s);
      for (let i = 0; i < n.data.length; i++) {
        const a = n.data[i];
        if (t && a.leftSweepEvent.featureId === s.featureId)
          continue;
        const c = ki(o, a);
        c !== !1 && e.push(c);
      }
      n.push(o);
    } else s.isLeftEndpoint === !1 && n.pop();
  }
  return e;
}
var Ei = class {
  /** @param event must have otherEvent non-null */
  constructor(r) {
    this.leftSweepEvent = r, this.rightSweepEvent = r.otherEvent;
  }
};
function ki(r, t) {
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
  const d = (l - a) * (s - e) - (c - i) * (o - n), y = (c - i) * (n - a) - (l - a) * (e - i), w = (s - e) * (n - a) - (o - n) * (e - i);
  if (d === 0)
    return !1;
  const p = y / d, _ = w / d;
  if (p >= 0 && p <= 1 && _ >= 0 && _ <= 1) {
    const I = e + p * (s - e), g = n + p * (o - n);
    return [I, g];
  }
  return !1;
}
function Ai(r, t, e = {}) {
  const { removeDuplicates: n = !0, ignoreSelfIntersections: s = !0 } = e;
  let o = [];
  r.type === "FeatureCollection" ? o = o.concat(r.features) : r.type === "Feature" ? o.push(r) : (r.type === "LineString" || r.type === "Polygon" || r.type === "MultiLineString" || r.type === "MultiPolygon") && o.push(ee(r)), t.type === "FeatureCollection" ? o = o.concat(t.features) : t.type === "Feature" ? o.push(t) : (t.type === "LineString" || t.type === "Polygon" || t.type === "MultiLineString" || t.type === "MultiPolygon") && o.push(ee(t));
  const i = Si(
    St(o),
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
  return St(a.map((c) => Yt(c)));
}
function Ii(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
function Bi(r) {
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
function Ti(r, t = {}) {
  let e = 0, n = 0, s = 0;
  return $e(
    r,
    function(o) {
      e += o[0], n += o[1], s++;
    },
    !0
  ), Yt([e / s, n / s], t.properties);
}
var he = { exports: {} }, ye = { exports: {} }, Oi = ye.exports, rn;
function Ni() {
  return rn || (rn = 1, (function(r, t) {
    (function(e, n) {
      r.exports = n();
    })(Oi, function() {
      function e(g, m, h, v, b) {
        (function A(E, k, B, O, C) {
          for (; O > B; ) {
            if (O - B > 600) {
              var $ = O - B + 1, S = k - B + 1, T = Math.log($), M = 0.5 * Math.exp(2 * T / 3), N = 0.5 * Math.sqrt(T * M * ($ - M) / $) * (S - $ / 2 < 0 ? -1 : 1), P = Math.max(B, Math.floor(k - S * M / $ + N)), D = Math.min(O, Math.floor(k + ($ - S) * M / $ + N));
              A(E, k, P, D, C);
            }
            var x = E[k], F = B, R = O;
            for (n(E, B, k), C(E[O], x) > 0 && n(E, B, O); F < R; ) {
              for (n(E, F, R), F++, R--; C(E[F], x) < 0; ) F++;
              for (; C(E[R], x) > 0; ) R--;
            }
            C(E[B], x) === 0 ? n(E, B, R) : n(E, ++R, O), R <= k && (B = R + 1), k <= R && (O = R - 1);
          }
        })(g, m, h || 0, v || g.length - 1, b || s);
      }
      function n(g, m, h) {
        var v = g[m];
        g[m] = g[h], g[h] = v;
      }
      function s(g, m) {
        return g < m ? -1 : g > m ? 1 : 0;
      }
      var o = function(g) {
        g === void 0 && (g = 9), this._maxEntries = Math.max(4, g), this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries)), this.clear();
      };
      function i(g, m, h) {
        if (!h) return m.indexOf(g);
        for (var v = 0; v < m.length; v++) if (h(g, m[v])) return v;
        return -1;
      }
      function a(g, m) {
        c(g, 0, g.children.length, m, g);
      }
      function c(g, m, h, v, b) {
        b || (b = _(null)), b.minX = 1 / 0, b.minY = 1 / 0, b.maxX = -1 / 0, b.maxY = -1 / 0;
        for (var A = m; A < h; A++) {
          var E = g.children[A];
          l(b, g.leaf ? v(E) : E);
        }
        return b;
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
      function y(g) {
        return g.maxX - g.minX + (g.maxY - g.minY);
      }
      function w(g, m) {
        return g.minX <= m.minX && g.minY <= m.minY && m.maxX <= g.maxX && m.maxY <= g.maxY;
      }
      function p(g, m) {
        return m.minX <= g.maxX && m.minY <= g.maxY && m.maxX >= g.minX && m.maxY >= g.minY;
      }
      function _(g) {
        return { children: g, height: 1, leaf: !0, minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
      }
      function I(g, m, h, v, b) {
        for (var A = [m, h]; A.length; ) if (!((h = A.pop()) - (m = A.pop()) <= v)) {
          var E = m + Math.ceil((h - m) / v / 2) * v;
          e(g, E, m, h, b), A.push(m, E, E, h);
        }
      }
      return o.prototype.all = function() {
        return this._all(this.data, []);
      }, o.prototype.search = function(g) {
        var m = this.data, h = [];
        if (!p(g, m)) return h;
        for (var v = this.toBBox, b = []; m; ) {
          for (var A = 0; A < m.children.length; A++) {
            var E = m.children[A], k = m.leaf ? v(E) : E;
            p(g, k) && (m.leaf ? h.push(E) : w(g, k) ? this._all(E, h) : b.push(E));
          }
          m = b.pop();
        }
        return h;
      }, o.prototype.collides = function(g) {
        var m = this.data;
        if (!p(g, m)) return !1;
        for (var h = []; m; ) {
          for (var v = 0; v < m.children.length; v++) {
            var b = m.children[v], A = m.leaf ? this.toBBox(b) : b;
            if (p(g, A)) {
              if (m.leaf || w(g, A)) return !0;
              h.push(b);
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
            var v = this.data;
            this.data = h, h = v;
          }
          this._insert(h, this.data.height - h.height - 1, !0);
        }
        else this.data = h;
        return this;
      }, o.prototype.insert = function(g) {
        return g && this._insert(g, this.data.height - 1), this;
      }, o.prototype.clear = function() {
        return this.data = _([]), this;
      }, o.prototype.remove = function(g, m) {
        if (!g) return this;
        for (var h, v, b, A = this.data, E = this.toBBox(g), k = [], B = []; A || k.length; ) {
          if (A || (A = k.pop(), v = k[k.length - 1], h = B.pop(), b = !0), A.leaf) {
            var O = i(g, A.children, m);
            if (O !== -1) return A.children.splice(O, 1), k.push(A), this._condense(k), this;
          }
          b || A.leaf || !w(A, E) ? v ? (h++, A = v.children[h], b = !1) : A = null : (k.push(A), B.push(h), h = 0, v = A, A = A.children[0]);
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
      }, o.prototype._build = function(g, m, h, v) {
        var b, A = h - m + 1, E = this._maxEntries;
        if (A <= E) return a(b = _(g.slice(m, h + 1)), this.toBBox), b;
        v || (v = Math.ceil(Math.log(A) / Math.log(E)), E = Math.ceil(A / Math.pow(E, v - 1))), (b = _([])).leaf = !1, b.height = v;
        var k = Math.ceil(A / E), B = k * Math.ceil(Math.sqrt(E));
        I(g, m, h, B, this.compareMinX);
        for (var O = m; O <= h; O += B) {
          var C = Math.min(O + B - 1, h);
          I(g, O, C, k, this.compareMinY);
          for (var $ = O; $ <= C; $ += k) {
            var S = Math.min($ + k - 1, C);
            b.children.push(this._build(g, $, S, v - 1));
          }
        }
        return a(b, this.toBBox), b;
      }, o.prototype._chooseSubtree = function(g, m, h, v) {
        for (; v.push(m), !m.leaf && v.length - 1 !== h; ) {
          for (var b = 1 / 0, A = 1 / 0, E = void 0, k = 0; k < m.children.length; k++) {
            var B = m.children[k], O = d(B), C = ($ = g, S = B, (Math.max(S.maxX, $.maxX) - Math.min(S.minX, $.minX)) * (Math.max(S.maxY, $.maxY) - Math.min(S.minY, $.minY)) - O);
            C < A ? (A = C, b = O < b ? O : b, E = B) : C === A && O < b && (b = O, E = B);
          }
          m = E || m.children[0];
        }
        var $, S;
        return m;
      }, o.prototype._insert = function(g, m, h) {
        var v = h ? g : this.toBBox(g), b = [], A = this._chooseSubtree(v, this.data, m, b);
        for (A.children.push(g), l(A, v); m >= 0 && b[m].children.length > this._maxEntries; ) this._split(b, m), m--;
        this._adjustParentBBoxes(v, b, m);
      }, o.prototype._split = function(g, m) {
        var h = g[m], v = h.children.length, b = this._minEntries;
        this._chooseSplitAxis(h, b, v);
        var A = this._chooseSplitIndex(h, b, v), E = _(h.children.splice(A, h.children.length - A));
        E.height = h.height, E.leaf = h.leaf, a(h, this.toBBox), a(E, this.toBBox), m ? g[m - 1].children.push(E) : this._splitRoot(h, E);
      }, o.prototype._splitRoot = function(g, m) {
        this.data = _([g, m]), this.data.height = g.height + 1, this.data.leaf = !1, a(this.data, this.toBBox);
      }, o.prototype._chooseSplitIndex = function(g, m, h) {
        for (var v, b, A, E, k, B, O, C = 1 / 0, $ = 1 / 0, S = m; S <= h - m; S++) {
          var T = c(g, 0, S, this.toBBox), M = c(g, S, h, this.toBBox), N = (b = T, A = M, E = void 0, k = void 0, B = void 0, O = void 0, E = Math.max(b.minX, A.minX), k = Math.max(b.minY, A.minY), B = Math.min(b.maxX, A.maxX), O = Math.min(b.maxY, A.maxY), Math.max(0, B - E) * Math.max(0, O - k)), P = d(T) + d(M);
          N < C ? (C = N, v = S, $ = P < $ ? P : $) : N === C && P < $ && ($ = P, v = S);
        }
        return v || h - m;
      }, o.prototype._chooseSplitAxis = function(g, m, h) {
        var v = g.leaf ? this.compareMinX : u, b = g.leaf ? this.compareMinY : f;
        this._allDistMargin(g, m, h, v) < this._allDistMargin(g, m, h, b) && g.children.sort(v);
      }, o.prototype._allDistMargin = function(g, m, h, v) {
        g.children.sort(v);
        for (var b = this.toBBox, A = c(g, 0, m, b), E = c(g, h - m, h, b), k = y(A) + y(E), B = m; B < h - m; B++) {
          var O = g.children[B];
          l(A, g.leaf ? b(O) : O), k += y(A);
        }
        for (var C = h - m - 1; C >= m; C--) {
          var $ = g.children[C];
          l(E, g.leaf ? b($) : $), k += y(E);
        }
        return k;
      }, o.prototype._adjustParentBBoxes = function(g, m, h) {
        for (var v = h; v >= 0; v--) l(m[v], g);
      }, o.prototype._condense = function(g) {
        for (var m = g.length - 1, h = void 0; m >= 0; m--) g[m].children.length === 0 ? m > 0 ? (h = g[m - 1].children).splice(h.indexOf(g[m]), 1) : this.clear() : a(g[m], this.toBBox);
      }, o;
    });
  })(ye)), ye.exports;
}
const Fi = /* @__PURE__ */ Bi(pi);
var Wt = { exports: {} }, Ne, sn;
function Pi() {
  return sn || (sn = 1, Ne = function(t, e, n, s) {
    var o = t[0], i = t[1], a = !1;
    n === void 0 && (n = 0), s === void 0 && (s = e.length);
    for (var c = (s - n) / 2, l = 0, u = c - 1; l < c; u = l++) {
      var f = e[n + l * 2 + 0], d = e[n + l * 2 + 1], y = e[n + u * 2 + 0], w = e[n + u * 2 + 1], p = d > i != w > i && o < (y - f) * (i - d) / (w - d) + f;
      p && (a = !a);
    }
    return a;
  }), Ne;
}
var Fe, on;
function Ci() {
  return on || (on = 1, Fe = function(t, e, n, s) {
    var o = t[0], i = t[1], a = !1;
    n === void 0 && (n = 0), s === void 0 && (s = e.length);
    for (var c = s - n, l = 0, u = c - 1; l < c; u = l++) {
      var f = e[l + n][0], d = e[l + n][1], y = e[u + n][0], w = e[u + n][1], p = d > i != w > i && o < (y - f) * (i - d) / (w - d) + f;
      p && (a = !a);
    }
    return a;
  }), Fe;
}
var an;
function Di() {
  if (an) return Wt.exports;
  an = 1;
  var r = Pi(), t = Ci();
  return Wt.exports = function(n, s, o, i) {
    return s.length > 0 && Array.isArray(s[0]) ? t(n, s, o, i) : r(n, s, o, i);
  }, Wt.exports.nested = t, Wt.exports.flat = r, Wt.exports;
}
var Jt = { exports: {} }, Ri = Jt.exports, cn;
function $i() {
  return cn || (cn = 1, (function(r, t) {
    (function(e, n) {
      n(t);
    })(Ri, function(e) {
      const s = 33306690738754706e-32;
      function o(p, _, I, g, m) {
        let h, v, b, A, E = _[0], k = g[0], B = 0, O = 0;
        k > E == k > -E ? (h = E, E = _[++B]) : (h = k, k = g[++O]);
        let C = 0;
        if (B < p && O < I) for (k > E == k > -E ? (b = h - ((v = E + h) - E), E = _[++B]) : (b = h - ((v = k + h) - k), k = g[++O]), h = v, b !== 0 && (m[C++] = b); B < p && O < I; ) k > E == k > -E ? (b = h - ((v = h + E) - (A = v - h)) + (E - A), E = _[++B]) : (b = h - ((v = h + k) - (A = v - h)) + (k - A), k = g[++O]), h = v, b !== 0 && (m[C++] = b);
        for (; B < p; ) b = h - ((v = h + E) - (A = v - h)) + (E - A), E = _[++B], h = v, b !== 0 && (m[C++] = b);
        for (; O < I; ) b = h - ((v = h + k) - (A = v - h)) + (k - A), k = g[++O], h = v, b !== 0 && (m[C++] = b);
        return h === 0 && C !== 0 || (m[C++] = h), C;
      }
      function i(p) {
        return new Float64Array(p);
      }
      const a = 33306690738754716e-32, c = 22204460492503146e-32, l = 11093356479670487e-47, u = i(4), f = i(8), d = i(12), y = i(16), w = i(4);
      e.orient2d = function(p, _, I, g, m, h) {
        const v = (_ - h) * (I - m), b = (p - m) * (g - h), A = v - b;
        if (v === 0 || b === 0 || v > 0 != b > 0) return A;
        const E = Math.abs(v + b);
        return Math.abs(A) >= a * E ? A : -(function(k, B, O, C, $, S, T) {
          let M, N, P, D, x, F, R, X, q, L, V, U, H, K, G, J, Z, Q;
          const at = k - $, ut = O - $, st = B - S, ot = C - S;
          x = (G = (X = at - (R = (F = 134217729 * at) - (F - at))) * (L = ot - (q = (F = 134217729 * ot) - (F - ot))) - ((K = at * ot) - R * q - X * q - R * L)) - (V = G - (Z = (X = st - (R = (F = 134217729 * st) - (F - st))) * (L = ut - (q = (F = 134217729 * ut) - (F - ut))) - ((J = st * ut) - R * q - X * q - R * L))), u[0] = G - (V + x) + (x - Z), x = (H = K - ((U = K + V) - (x = U - K)) + (V - x)) - (V = H - J), u[1] = H - (V + x) + (x - J), x = (Q = U + V) - U, u[2] = U - (Q - x) + (V - x), u[3] = Q;
          let Tt = (function(Wn, qe) {
            let Ue = qe[0];
            for (let xe = 1; xe < Wn; xe++) Ue += qe[xe];
            return Ue;
          })(4, u), Ht = c * T;
          if (Tt >= Ht || -Tt >= Ht || (M = k - (at + (x = k - at)) + (x - $), P = O - (ut + (x = O - ut)) + (x - $), N = B - (st + (x = B - st)) + (x - S), D = C - (ot + (x = C - ot)) + (x - S), M === 0 && N === 0 && P === 0 && D === 0) || (Ht = l * T + s * Math.abs(Tt), (Tt += at * D + ot * M - (st * P + ut * N)) >= Ht || -Tt >= Ht)) return Tt;
          x = (G = (X = M - (R = (F = 134217729 * M) - (F - M))) * (L = ot - (q = (F = 134217729 * ot) - (F - ot))) - ((K = M * ot) - R * q - X * q - R * L)) - (V = G - (Z = (X = N - (R = (F = 134217729 * N) - (F - N))) * (L = ut - (q = (F = 134217729 * ut) - (F - ut))) - ((J = N * ut) - R * q - X * q - R * L))), w[0] = G - (V + x) + (x - Z), x = (H = K - ((U = K + V) - (x = U - K)) + (V - x)) - (V = H - J), w[1] = H - (V + x) + (x - J), x = (Q = U + V) - U, w[2] = U - (Q - x) + (V - x), w[3] = Q;
          const zn = o(4, u, 4, w, f);
          x = (G = (X = at - (R = (F = 134217729 * at) - (F - at))) * (L = D - (q = (F = 134217729 * D) - (F - D))) - ((K = at * D) - R * q - X * q - R * L)) - (V = G - (Z = (X = st - (R = (F = 134217729 * st) - (F - st))) * (L = P - (q = (F = 134217729 * P) - (F - P))) - ((J = st * P) - R * q - X * q - R * L))), w[0] = G - (V + x) + (x - Z), x = (H = K - ((U = K + V) - (x = U - K)) + (V - x)) - (V = H - J), w[1] = H - (V + x) + (x - J), x = (Q = U + V) - U, w[2] = U - (Q - x) + (V - x), w[3] = Q;
          const Kn = o(zn, f, 4, w, d);
          x = (G = (X = M - (R = (F = 134217729 * M) - (F - M))) * (L = D - (q = (F = 134217729 * D) - (F - D))) - ((K = M * D) - R * q - X * q - R * L)) - (V = G - (Z = (X = N - (R = (F = 134217729 * N) - (F - N))) * (L = P - (q = (F = 134217729 * P) - (F - P))) - ((J = N * P) - R * q - X * q - R * L))), w[0] = G - (V + x) + (x - Z), x = (H = K - ((U = K + V) - (x = U - K)) + (V - x)) - (V = H - J), w[1] = H - (V + x) + (x - J), x = (Q = U + V) - U, w[2] = U - (Q - x) + (V - x), w[3] = Q;
          const Hn = o(Kn, d, 4, w, y);
          return y[Hn - 1];
        })(p, _, I, g, m, h, E);
      }, e.orient2dfast = function(p, _, I, g, m, h) {
        return (_ - h) * (I - m) - (p - m) * (g - h);
      }, Object.defineProperty(e, "__esModule", { value: !0 });
    });
  })(Jt, Jt.exports)), Jt.exports;
}
var ln;
function Xi() {
  if (ln) return he.exports;
  ln = 1;
  var r = Ni(), t = Fi, e = Di(), n = $i().orient2d;
  t.default && (t = t.default), he.exports = s, he.exports.default = s;
  function s(h, v, b) {
    v = Math.max(0, v === void 0 ? 2 : v), b = b || 0;
    var A = y(h), E = new r(16);
    E.toBBox = function(R) {
      return {
        minX: R[0],
        minY: R[1],
        maxX: R[0],
        maxY: R[1]
      };
    }, E.compareMinX = function(R, X) {
      return R[0] - X[0];
    }, E.compareMinY = function(R, X) {
      return R[1] - X[1];
    }, E.load(h);
    for (var k = [], B = 0, O; B < A.length; B++) {
      var C = A[B];
      E.remove(C), O = w(C, O), k.push(O);
    }
    var $ = new r(16);
    for (B = 0; B < k.length; B++) $.insert(d(k[B]));
    for (var S = v * v, T = b * b; k.length; ) {
      var M = k.shift(), N = M.p, P = M.next.p, D = p(N, P);
      if (!(D < T)) {
        var x = D / S;
        C = o(E, M.prev.p, N, P, M.next.next.p, x, $), C && Math.min(p(C, N), p(C, P)) <= x && (k.push(M), k.push(w(C, M)), E.remove(C), $.remove(M), $.insert(d(M)), $.insert(d(M.next)));
      }
    }
    M = O;
    var F = [];
    do
      F.push(M.p), M = M.next;
    while (M !== O);
    return F.push(M.p), F;
  }
  function o(h, v, b, A, E, k, B) {
    for (var O = new t([], i), C = h.data; C; ) {
      for (var $ = 0; $ < C.children.length; $++) {
        var S = C.children[$], T = C.leaf ? _(S, b, A) : a(b, A, S);
        T > k || O.push({
          node: S,
          dist: T
        });
      }
      for (; O.length && !O.peek().node.children; ) {
        var M = O.pop(), N = M.node, P = _(N, v, b), D = _(N, A, E);
        if (M.dist < P && M.dist < D && l(b, N, B) && l(A, N, B)) return N;
      }
      C = O.pop(), C && (C = C.node);
    }
    return null;
  }
  function i(h, v) {
    return h.dist - v.dist;
  }
  function a(h, v, b) {
    if (c(h, b) || c(v, b)) return 0;
    var A = I(h[0], h[1], v[0], v[1], b.minX, b.minY, b.maxX, b.minY);
    if (A === 0) return 0;
    var E = I(h[0], h[1], v[0], v[1], b.minX, b.minY, b.minX, b.maxY);
    if (E === 0) return 0;
    var k = I(h[0], h[1], v[0], v[1], b.maxX, b.minY, b.maxX, b.maxY);
    if (k === 0) return 0;
    var B = I(h[0], h[1], v[0], v[1], b.minX, b.maxY, b.maxX, b.maxY);
    return B === 0 ? 0 : Math.min(A, E, k, B);
  }
  function c(h, v) {
    return h[0] >= v.minX && h[0] <= v.maxX && h[1] >= v.minY && h[1] <= v.maxY;
  }
  function l(h, v, b) {
    for (var A = Math.min(h[0], v[0]), E = Math.min(h[1], v[1]), k = Math.max(h[0], v[0]), B = Math.max(h[1], v[1]), O = b.search({ minX: A, minY: E, maxX: k, maxY: B }), C = 0; C < O.length; C++)
      if (f(O[C].p, O[C].next.p, h, v)) return !1;
    return !0;
  }
  function u(h, v, b) {
    return n(h[0], h[1], v[0], v[1], b[0], b[1]);
  }
  function f(h, v, b, A) {
    return h !== A && v !== b && u(h, v, b) > 0 != u(h, v, A) > 0 && u(b, A, h) > 0 != u(b, A, v) > 0;
  }
  function d(h) {
    var v = h.p, b = h.next.p;
    return h.minX = Math.min(v[0], b[0]), h.minY = Math.min(v[1], b[1]), h.maxX = Math.max(v[0], b[0]), h.maxY = Math.max(v[1], b[1]), h;
  }
  function y(h) {
    for (var v = h[0], b = h[0], A = h[0], E = h[0], k = 0; k < h.length; k++) {
      var B = h[k];
      B[0] < v[0] && (v = B), B[0] > A[0] && (A = B), B[1] < b[1] && (b = B), B[1] > E[1] && (E = B);
    }
    var O = [v, b, A, E], C = O.slice();
    for (k = 0; k < h.length; k++)
      e(h[k], O) || C.push(h[k]);
    return m(C);
  }
  function w(h, v) {
    var b = {
      p: h,
      prev: null,
      next: null,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };
    return v ? (b.next = v.next, b.prev = v, v.next.prev = b, v.next = b) : (b.prev = b, b.next = b), b;
  }
  function p(h, v) {
    var b = h[0] - v[0], A = h[1] - v[1];
    return b * b + A * A;
  }
  function _(h, v, b) {
    var A = v[0], E = v[1], k = b[0] - A, B = b[1] - E;
    if (k !== 0 || B !== 0) {
      var O = ((h[0] - A) * k + (h[1] - E) * B) / (k * k + B * B);
      O > 1 ? (A = b[0], E = b[1]) : O > 0 && (A += k * O, E += B * O);
    }
    return k = h[0] - A, B = h[1] - E, k * k + B * B;
  }
  function I(h, v, b, A, E, k, B, O) {
    var C = b - h, $ = A - v, S = B - E, T = O - k, M = h - E, N = v - k, P = C * C + $ * $, D = C * S + $ * T, x = S * S + T * T, F = C * M + $ * N, R = S * M + T * N, X = P * x - D * D, q, L, V, U, H = X, K = X;
    X === 0 ? (L = 0, H = 1, U = R, K = x) : (L = D * R - x * F, U = P * R - D * F, L < 0 ? (L = 0, U = R, K = x) : L > H && (L = H, U = R + D, K = x)), U < 0 ? (U = 0, -F < 0 ? L = 0 : -F > P ? L = H : (L = -F, H = P)) : U > K && (U = K, -F + D < 0 ? L = 0 : -F + D > P ? L = H : (L = -F + D, H = P)), q = L === 0 ? 0 : L / H, V = U === 0 ? 0 : U / K;
    var G = (1 - q) * h + q * b, J = (1 - q) * v + q * A, Z = (1 - V) * E + V * B, Q = (1 - V) * k + V * O, at = Z - G, ut = Q - J;
    return at * at + ut * ut;
  }
  function g(h, v) {
    return h[0] === v[0] ? h[1] - v[1] : h[0] - v[0];
  }
  function m(h) {
    h.sort(g);
    for (var v = [], b = 0; b < h.length; b++) {
      for (; v.length >= 2 && u(v[v.length - 2], v[v.length - 1], h[b]) <= 0; )
        v.pop();
      v.push(h[b]);
    }
    for (var A = [], E = h.length - 1; E >= 0; E--) {
      for (; A.length >= 2 && u(A[A.length - 2], A[A.length - 1], h[E]) <= 0; )
        A.pop();
      A.push(h[E]);
    }
    return A.pop(), v.pop(), v.concat(A);
  }
  return he.exports;
}
var Li = Xi();
const Yi = /* @__PURE__ */ Ii(Li);
function fn(r, t = {}) {
  t.concavity = t.concavity || 1 / 0;
  const e = [];
  if ($e(r, (s) => {
    e.push([s[0], s[1]]);
  }), !e.length)
    return null;
  const n = Yi(e, t.concavity);
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
  static from(t, e = zi, n = Ki) {
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
    for (let k = 0; k < i; k++) {
      const B = t[2 * k], O = t[2 * k + 1];
      B < a && (a = B), O < c && (c = O), B > l && (l = B), O > u && (u = O), this._ids[k] = k;
    }
    const f = (a + l) / 2, d = (c + u) / 2;
    let y = 0, w = 0, p = 0;
    for (let k = 0, B = 1 / 0; k < i; k++) {
      const O = Pe(f, d, t[2 * k], t[2 * k + 1]);
      O < B && (y = k, B = O);
    }
    const _ = t[2 * y], I = t[2 * y + 1];
    for (let k = 0, B = 1 / 0; k < i; k++) {
      if (k === y) continue;
      const O = Pe(_, I, t[2 * k], t[2 * k + 1]);
      O < B && O > 0 && (w = k, B = O);
    }
    let g = t[2 * w], m = t[2 * w + 1], h = 1 / 0;
    for (let k = 0; k < i; k++) {
      if (k === y || k === w) continue;
      const B = Vi(_, I, g, m, t[2 * k], t[2 * k + 1]);
      B < h && (p = k, h = B);
    }
    let v = t[2 * p], b = t[2 * p + 1];
    if (h === 1 / 0) {
      for (let O = 0; O < i; O++)
        this._dists[O] = t[2 * O] - t[0] || t[2 * O + 1] - t[1];
      zt(this._ids, this._dists, 0, i - 1);
      const k = new Uint32Array(i);
      let B = 0;
      for (let O = 0, C = -1 / 0; O < i; O++) {
        const $ = this._ids[O], S = this._dists[$];
        S > C && (k[B++] = $, C = S);
      }
      this.hull = k.subarray(0, B), this.triangles = new Uint32Array(0), this.halfedges = new Int32Array(0);
      return;
    }
    if (ft(_, I, g, m, v, b) < 0) {
      const k = w, B = g, O = m;
      w = p, g = v, m = b, p = k, v = B, b = O;
    }
    const A = ji(_, I, g, m, v, b);
    this._cx = A.x, this._cy = A.y;
    for (let k = 0; k < i; k++)
      this._dists[k] = Pe(t[2 * k], t[2 * k + 1], A.x, A.y);
    zt(this._ids, this._dists, 0, i - 1), this._hullStart = y;
    let E = 3;
    n[y] = e[p] = w, n[w] = e[y] = p, n[p] = e[w] = y, s[y] = 0, s[w] = 1, s[p] = 2, o.fill(-1), o[this._hashKey(_, I)] = y, o[this._hashKey(g, m)] = w, o[this._hashKey(v, b)] = p, this.trianglesLen = 0, this._addTriangle(y, w, p, -1, -1, -1);
    for (let k = 0, B = 0, O = 0; k < this._ids.length; k++) {
      const C = this._ids[k], $ = t[2 * C], S = t[2 * C + 1];
      if (k > 0 && Math.abs($ - B) <= un && Math.abs(S - O) <= un || (B = $, O = S, C === y || C === w || C === p)) continue;
      let T = 0;
      for (let x = 0, F = this._hashKey($, S); x < this._hashSize && (T = o[(F + x) % this._hashSize], !(T !== -1 && T !== n[T])); x++)
        ;
      T = e[T];
      let M = T, N;
      for (; N = n[M], ft($, S, t[2 * M], t[2 * M + 1], t[2 * N], t[2 * N + 1]) >= 0; )
        if (M = N, M === T) {
          M = -1;
          break;
        }
      if (M === -1) continue;
      let P = this._addTriangle(M, C, n[M], -1, -1, s[M]);
      s[C] = this._legalize(P + 2), s[M] = P, E++;
      let D = n[M];
      for (; N = n[D], ft($, S, t[2 * D], t[2 * D + 1], t[2 * N], t[2 * N + 1]) < 0; )
        P = this._addTriangle(D, C, N, s[C], -1, s[D]), s[C] = this._legalize(P + 2), n[D] = D, E--, D = N;
      if (M === T)
        for (; N = e[M], ft($, S, t[2 * N], t[2 * N + 1], t[2 * M], t[2 * M + 1]) < 0; )
          P = this._addTriangle(N, C, M, -1, s[M], s[N]), this._legalize(P + 2), s[N] = P, n[M] = M, E--, M = N;
      this._hullStart = e[C] = M, n[M] = e[D] = C, n[C] = D, o[this._hashKey($, S)] = C, o[this._hashKey(t[2 * M], t[2 * M + 1])] = M;
    }
    this.hull = new Uint32Array(E);
    for (let k = 0, B = this._hullStart; k < E; k++)
      this.hull[k] = B, B = n[B];
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
    return Math.floor(qi(t - this._cx, e - this._cy) * this._hashSize) % this._hashSize;
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
      const l = a - a % 3, u = c + (t + 1) % 3, f = l + (a + 2) % 3, d = e[i], y = e[t], w = e[u], p = e[f];
      if (Ui(
        s[2 * d],
        s[2 * d + 1],
        s[2 * y],
        s[2 * y + 1],
        s[2 * w],
        s[2 * w + 1],
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
function qi(r, t) {
  const e = r / (Math.abs(r) + Math.abs(t));
  return (t > 0 ? 3 - e : 1 + e) / 4;
}
function Pe(r, t, e, n) {
  const s = r - e, o = t - n;
  return s * s + o * o;
}
function Ui(r, t, e, n, s, o, i, a) {
  const c = r - i, l = t - a, u = e - i, f = n - a, d = s - i, y = o - a, w = c * c + l * l, p = u * u + f * f, _ = d * d + y * y;
  return c * (f * _ - p * y) - l * (u * _ - p * d) + w * (u * y - f * d) < 0;
}
function Vi(r, t, e, n, s, o) {
  const i = e - r, a = n - t, c = s - r, l = o - t, u = i * i + a * a, f = c * c + l * l, d = 0.5 / (i * l - a * c), y = (l * u - a * f) * d, w = (i * f - c * u) * d;
  return y * y + w * w;
}
function ji(r, t, e, n, s, o) {
  const i = e - r, a = n - t, c = s - r, l = o - t, u = i * i + a * a, f = c * c + l * l, d = 0.5 / (i * l - a * c), y = r + (l * u - a * f) * d, w = t + (i * f - c * u) * d;
  return { x: y, y: w };
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
function zi(r) {
  return r[0];
}
function Ki(r) {
  return r[1];
}
class Hi {
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
class hn extends Hi {
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
class Wi {
  /**
   * The triangulation object from Delaunator.
   */
  del;
  constructor(t) {
    this.del = t;
  }
}
class te extends Wi {
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
      const y = xt(c), w = n[y];
      if (w === e)
        return this.protect(d), d;
      if (this.intersectSegments(t, e, w, f)) {
        c = y;
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
      const f = s[c], d = xt(c), y = xt(f), w = At(f);
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
        n[y]
      )) {
        if (u === -1 && (u = c), n[y] === e) {
          if (c === u)
            throw new Error("Infinite loop: non-convex quadrilateral");
          c = u, u = -1;
          continue;
        }
        if (this.intersectSegments(
          t,
          e,
          n[y],
          n[f]
        ))
          c = y;
        else if (this.intersectSegments(
          t,
          e,
          n[w],
          n[y]
        ))
          c = w;
        else if (u === c)
          throw new Error("Infinite loop: no further intersect after non-convex");
        continue;
      }
      if (this.flipDiagonal(c), this.intersectSegments(
        t,
        e,
        n[d],
        n[y]
      ) && (u === -1 && (u = d), u === d))
        throw new Error("Infinite loop: flipped diagonal still intersects");
      n[y] === e ? (l = y, c = u, u = -1) : this.intersectSegments(
        t,
        e,
        n[w],
        n[y]
      ) && (c = w);
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
    const { triangles: n, halfedges: s } = this.del, o = n.length / 3, i = (w, p, _) => {
      const I = t(p), g = t(_);
      return t(w).some((m) => I.includes(m) && g.includes(m));
    }, a = (w) => i(n[w * 3], n[w * 3 + 1], n[w * 3 + 2]), c = (w, p, _, I) => Math.sign(ft(w[p * 2], w[p * 2 + 1], w[_ * 2], w[_ * 2 + 1], w[I * 2], w[I * 2 + 1])), l = e.map((w) => {
      let p = 0;
      for (let _ = 0; _ < o; _++) p += c(w, n[_ * 3], n[_ * 3 + 1], n[_ * 3 + 2]);
      return p < 0 ? -1 : 1;
    }), u = (w) => {
      if (this.consd.has(w)) return !1;
      const p = s[w];
      if (p === -1) return !1;
      const _ = n[w], I = n[At(w)], g = n[xt(w)], m = n[xt(p)];
      return e.every((h, v) => c(h, g, _, m) === l[v] && c(h, m, I, g) === l[v]);
    };
    let f = 0, d = !0;
    for (; d; ) {
      d = !1;
      for (let w = 0; w < o; w++)
        if (a(w))
          for (let p = 0; p < 3; p++) {
            const _ = w * 3 + p;
            if (!u(_)) continue;
            const I = s[_], g = n[_], m = n[At(_)], h = n[xt(_)], v = n[xt(I)];
            if (!(i(h, g, v) && i(v, m, h))) {
              this.protect(this.flipDiagonal(_)), f++, d = !0;
              break;
            }
          }
    }
    let y = 0;
    for (let w = 0; w < o; w++) a(w) && y++;
    return { flips: f, remaining: y };
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
    return fi(
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
        return { tin: St([]), remaining: 0, hasBoundary: !1, hull: [] };
      }
      s && (s.snapshot = i.snapshot());
    }
    const p = n ? s?.snapshot ?? i.snapshot() : void 0, _ = (I) => {
      const g = te.restore(p);
      return g.constrainAll(I), g;
    };
    for (const I of n?.hull ?? [])
      try {
        i.constrainOne(I[0], I[1]), f.push(I);
      } catch {
        i = _(f);
      }
    n?.boundary && (u = Gi(i, n.boundary), u || (i = _(f))), n && ({ remaining: l } = i.forbidGroupTriangles(
      n.groupsOf,
      n.planes
    ), l -= u?.size ?? 0), c = i.del;
  }
  const d = [];
  for (let p = 0; p < c.triangles.length; p += 3)
    u?.has(p / 3) || d.push([c.triangles[p], c.triangles[p + 1], c.triangles[p + 2]]);
  const y = ["a", "b", "c"];
  return { tin: St(
    d.map((p) => {
      const _ = {}, I = p.map((g, m) => {
        const h = r.features[g], v = h.geometry.coordinates, b = [v[0], v[1]];
        return v.length === 3 ? b[2] = v[2] : _[y[m]] = h.properties[e], b;
      });
      return I[3] = I[0], re([I], _);
    })
  ), remaining: l, hasBoundary: u !== void 0, hull: f };
}
function Gi(r, t) {
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
    const l = i[c], u = i[(c + 1) % i.length], f = u.x - l.x, d = u.y - l.y, y = f * f + d * d, w = e.filter((_) => _ !== l && _ !== u && n(l, u, _) === 0).map((_) => ({ r: _, t: ((_.x - l.x) * f + (_.y - l.y) * d) / y })).filter(({ t: _ }) => _ > 0 && _ < 1).sort((_, I) => _.t - I.t).map(({ r: _ }) => _), p = [l, ...w, u];
    for (let _ = 0; _ + 1 < p.length; _++) a.push([p[_].i, p[_ + 1].i]);
  }
  return a;
}
function ve([r, t]) {
  return r < t ? `${r}-${t}` : `${t}-${r}`;
}
function Vt(r, t, e) {
  return Yt(r, { target: { geom: t, index: e } });
}
function jt(r) {
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
      (y) => y.geometry.coordinates
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
    }, d = St([
      re([u], f)
    ]);
    return [l, d];
  }).reduce(
    (s, o) => (s[0].push(o[0]), s[1].push(o[1]), s),
    [[], []]
  );
}
const Ji = [0.1, 0.15, 0.225, 0.34, 0.5];
function Qi(r, t) {
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
function Zi(r, t) {
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
  const { minx: a, maxx: c, miny: l, maxy: u, centroid: f } = r, d = c - a, y = u - l, w = e.forw.length, p = Array.from({ length: w }, () => []);
  let _ = 1;
  for (const [A, E] of e.edges)
    A < n && p[A].push(_), p[E].push(_), E < n && _++;
  const I = (A) => A.slice(0, w).map(({ geometry: E }) => E.coordinates), g = pn(I(e.forw)), m = {
    forw: g.filter((A) => !o.has(ve(A))),
    bakw: pn(I(e.bakw))
  }, h = [0], v = (A) => A >= w ? h : p[A];
  let b;
  for (const A of Ji) {
    const E = i?.get(A) ?? { forwReuse: {} };
    i?.set(A, E);
    const k = E.vertices ?? (E.vertices = Zi(
      t(
        {
          ...r,
          minx: a - A * d,
          maxx: c + A * d,
          miny: l - A * y,
          maxy: u + A * y
        },
        !0
      ),
      e
    ));
    if (s && (k.length < 4 || !k.every(({ bakw: L }) => L.every(Number.isFinite)))) continue;
    const B = k.map(
      ({ forw: L, bakw: V }, U) => Vt(L, V, `b${U}`)
    ), O = St([...e.forw, ...B]), C = St([
      ...e.bakw,
      ...B.map(jt)
    ]), $ = [O, C].map(
      ({ features: L }) => Float64Array.from(
        L.flatMap(
          ({
            geometry: {
              coordinates: [V, U]
            }
          }) => [V, U]
        )
      )
    ), T = s !== void 0 || wn(
      k.map((L) => L.forw),
      f.forw,
      -1
    ) && wn(
      k.map((L) => L.bakw),
      f.bakw,
      1
    ) ? k.map((L, V) => [
      w + V,
      w + (V + 1) % k.length
    ]) : void 0, M = { groupsOf: v, planes: $, boundary: T, allowUnusableBoundary: s !== void 0 }, N = s?.orientation ?? -1, P = De(
      O,
      e.edges,
      "target",
      { ...M, hull: m.forw },
      E.forwReuse
    ), D = E.geographic ?? (E.geographic = (() => {
      const L = De(C, e.edges, "target", {
        ...M,
        hull: m.bakw
      });
      return { built: L, flips: be(L.tin, N) };
    })()), x = D.built, F = P.tin, R = {
      ...x.tin,
      features: [...x.tin.features]
    }, X = be(F, N) + D.flips, q = {
      vertices: k,
      forw: F,
      bakw: R,
      diagnostics: {
        margin: A,
        boundaryTriangleFlips: X,
        remainingForbiddenTriangles: P.remaining + x.remaining
      },
      hasMapBoundary: P.hasBoundary,
      hasBoundary: P.hasBoundary && x.hasBoundary,
      forwHull: { all: g, applied: P.hull }
    };
    if (s) {
      if (s.accept(q)) return q;
      continue;
    }
    if (X === 0 && q.hasBoundary)
      return q;
    Qi(q, b) && (b = q);
  }
  return b;
}
const tr = 256 * Number.EPSILON;
function er(r, t) {
  const e = [r, t].map((s) => {
    const o = s.map((a, c, l) => {
      if (c === 0) return 0;
      const u = l[c - 1];
      return Math.sqrt(
        Math.pow(a[0] - u[0], 2) + Math.pow(a[1] - u[1], 2)
      );
    }), i = o.reduce((a, c, l) => l === 0 ? [0] : (a.push(a[l - 1] + c), a), []);
    return i.map((a, c, l) => {
      const u = a / l[l.length - 1];
      return [s[c], o[c], i[c], u];
    });
  }), n = [];
  return e.forEach((s, o) => {
    const i = e[o ? 0 : 1];
    s.forEach((a, c) => {
      if (c === 0 || c === s.length - 1 || a[4] === "handled")
        return;
      const l = a[0], u = a[3];
      let f, d = 1 / 0;
      for (let y = 1; y < i.length - 1; y++) {
        const w = i[y];
        if (w[4] === "handled") continue;
        const p = Math.abs(w[3] - u);
        p <= tr && p < d && (f = w, d = p);
      }
      if (f) {
        f[4] = "handled", a[4] = "handled", n.push(
          o === 0 ? [l, f[0], u] : [f[0], l, u]
        );
        return;
      }
      for (let y = 0; y < i.length - 1; y++) {
        const w = i[y], p = i[y + 1], _ = w[3], I = p[3];
        if (_ < u && I > u) {
          const g = (u - _) / (I - _), m = [
            (p[0][0] - w[0][0]) * g + w[0][0],
            (p[0][1] - w[0][1]) * g + w[0][1]
          ];
          n.push(
            o === 0 ? [l, m, u] : [m, l, u]
          );
          return;
        }
      }
    });
  }), n.sort((s, o) => s[2] - o[2]);
}
const vn = 1e-9;
function nr(r, t) {
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
function $n(r) {
  let t = 1 / 0, e = 0, n = 0;
  return r.forEach((s) => {
    const { forw: o, bakw: i } = s, a = Math.hypot(o[0], o[1]), c = Math.hypot(i[0], i[1]);
    if (c === 0) return;
    const l = a / c, u = Math.atan2(o[0], o[1]) - Math.atan2(i[0], i[1]);
    t = Math.min(t, l), e += Math.cos(u), n += Math.sin(u);
  }), isFinite(t) ? [t, Math.atan2(n, e)] : [1, 0];
}
const ir = 0.6, rr = 3, sr = 0.5;
function or(r) {
  let t = 0, e = 0, n = 0, s = 0;
  if (r.forEach(({ forw: i, bakw: a }) => {
    t += i[1] * a[1] + i[0] * a[0], e += i[0] * a[1] - i[1] * a[0], n += a[0] * a[0] + a[1] * a[1], s += i[0] * i[0] + i[1] * i[1];
  }), !(!(n > 0 && s > 0) || !(Math.hypot(t, e) / Math.sqrt(s * n) >= sr)))
    return [Math.hypot(t, e) / n, Math.atan2(e, t)];
}
function ar(r) {
  const t = (s) => Math.hypot(s.forw[0], s.forw[1]), e = Math.max(...r.map(t)), n = r.filter((s) => t(s) >= ir * e);
  return or(n.length >= rr ? n : r) ?? $n(r);
}
function cr(r, t, e, n) {
  const { perQuad: s, aggregate: o } = nr(r, t), i = s.every((u) => u.length > 0), a = e === "birdeye" ? i ? s : [o] : [o], c = n === "farLsq" ? ar : $n, l = a.map((u) => c(u));
  return l.length === 1 ? [l[0], l[0], l[0], l[0]] : l;
}
function lr(r, t) {
  let e = 0;
  return r[0] > t[0] && (e += 1), r[1] > t[1] && (e += 2), e;
}
function fr(r, t, e) {
  const n = [
    r[0] - t.forw[0],
    r[1] - t.forw[1]
  ], o = Math.sqrt(n[0] ** 2 + n[1] ** 2) / e[0], i = Math.atan2(n[0], n[1]) - e[1];
  return [
    t.bakw[0] + o * Math.sin(i),
    t.bakw[1] - o * Math.cos(i)
  ];
}
function ur(r, t, e, n) {
  const s = t[0] - r[0], o = t[1] - r[1];
  if (Math.abs(s) < 1e-12 && Math.abs(o) < 1e-12) return null;
  const i = n[0] - e[0], a = n[1] - e[1], c = e[0] - r[0], l = e[1] - r[1], u = s * a - o * i;
  if (Math.abs(u) < 1e-12) return null;
  const f = (c * a - l * i) / u, d = (c * o - l * s) / u;
  return f <= 1e-10 || d < -1e-10 || d > 1 + 1e-10 ? null : { t: f, point: [r[0] + f * s, r[1] + f * o] };
}
function hr(r, t, e) {
  const n = e.length;
  let s = -1 / 0, o = null;
  for (let i = 0; i < n; i++) {
    const a = (i + 1) % n, c = ur(
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
function Sn(r, t, e, n, s, o) {
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
      const a = (i + 1) % n, c = je([r[i].bakw, r[a].bakw]), l = je([e.bakw, o.bakw]), u = Ai(c, l);
      if (u.features.length > 0 && u.features[0].geometry) {
        const f = u.features[0], d = Math.sqrt(
          Math.pow(o.bakw[0] - e.bakw[0], 2) + Math.pow(o.bakw[1] - e.bakw[1], 2)
        ), y = Math.sqrt(
          Math.pow(f.geometry.coordinates[0] - e.bakw[0], 2) + Math.pow(f.geometry.coordinates[1] - e.bakw[1], 2)
        ), w = d / y;
        w > s[i] && (s[i] = w), w > s[a] && (s[a] = w);
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
  const { convexBuf: o, centroid: i, allGcps: a, minx: c, maxx: l, miny: u, maxy: f } = r, d = s ? void 0 : cr(o, i, t, n), w = [
    [c, u],
    [l, u],
    [l, f],
    [c, f]
  ].map((E) => ({
    forw: E,
    bakw: s ? s(E) : fr(
      E,
      i,
      d[lr(E, i.forw)]
    )
  }));
  if (w.sort(
    (E, k) => Math.atan2(E.forw[0] - i.forw[0], E.forw[1] - i.forw[1]) - Math.atan2(k.forw[0] - i.forw[0], k.forw[1] - i.forw[1])
  ), s || xn(w, a, i), !e) return w;
  const p = 4, _ = w.map(
    (E) => Math.atan2(E.forw[0] - i.forw[0], E.forw[1] - i.forw[1])
  ), I = w.map(
    (E) => Math.atan2(
      E.bakw[0] - i.bakw[0],
      -(E.bakw[1] - i.bakw[1])
    )
  );
  function g(E) {
    for (let k = 0; k < p; k++) {
      const B = (k + 1) % p, O = _[k], C = k < p - 1 ? _[B] : _[B] + 2 * Math.PI;
      let $ = E;
      for (; $ < O; ) $ += 2 * Math.PI;
      for (; $ >= O + 2 * Math.PI; ) $ -= 2 * Math.PI;
      if ($ >= O && $ < C)
        return { i: k, j: B, frac: ($ - O) / (C - O) };
    }
    return { i: 0, j: 1, frac: 0 };
  }
  function m(E) {
    const { i: k, j: B, frac: O } = g(E), C = I[k];
    let S = I[B] - C;
    for (; S > Math.PI; ) S -= 2 * Math.PI;
    for (; S < -Math.PI; ) S += 2 * Math.PI;
    return C + O * S;
  }
  const h = new Set(
    w.map(
      (E) => Math.floor(bn(E.forw, i.forw) / 10) % 36
    )
  ), v = a.map((E) => ({
    forw: E.forw,
    bakw: E.bakw,
    angleDeg: bn(E.forw, i.forw),
    forwDist: Math.hypot(E.forw[0] - i.forw[0], E.forw[1] - i.forw[1])
  })), b = [];
  for (let E = 0; E < 36; E++) {
    if (h.has(E)) continue;
    const k = E * 10, B = v.filter((x) => {
      if (x.forwDist === 0) return !1;
      const F = ((x.angleDeg - k) % 360 + 360) % 360;
      return F < 10 + vn || F > 360 - vn;
    });
    let O = null;
    if (B.length > 0) {
      const x = B.reduce((F, R) => R.forwDist > F.forwDist ? R : F);
      O = Sn(i.forw, x.forw, c, l, u, f);
    }
    if (!O) {
      const x = (k + 5) % 360 * (Math.PI / 180), F = [
        i.forw[0] + Math.sin(x),
        i.forw[1] + Math.cos(x)
      ];
      O = Sn(i.forw, F, c, l, u, f);
    }
    if (!O) continue;
    const [C, $] = O, S = 1e-9 * Math.max(l - c, f - u);
    if ([...w, ...b].some(
      (x) => Math.abs(x.forw[0] - C) <= S && Math.abs(x.forw[1] - $) <= S
    )) continue;
    if (s) {
      b.push({ forw: O, bakw: s(O) });
      continue;
    }
    const T = [O[0] - i.forw[0], O[1] - i.forw[1]], M = Math.atan2(T[0], T[1]), N = m(M), P = [
      i.bakw[0] + Math.sin(N),
      i.bakw[1] - Math.cos(N)
    ], D = hr(i.bakw, P, w);
    D && b.push({ forw: O, bakw: D });
  }
  const A = [...w, ...b];
  return A.sort(
    (E, k) => Math.atan2(E.forw[0] - i.forw[0], E.forw[1] - i.forw[1]) - Math.atan2(k.forw[0] - i.forw[0], k.forw[1] - i.forw[1])
  ), s || xn(A, a, i), A;
}
function dr(r, t = !1) {
  return Ye(r, "plain", t, t ? "farLsq" : "min");
}
function pr(r, t = !1) {
  return Ye(r, "birdeye", t, "min");
}
function gr(r, t) {
  const e = /* @__PURE__ */ new Set();
  return Ye(r, "plain", !0, "min", t).filter(({ forw: [n, s] }) => {
    const o = `${n}:${s}`;
    return e.has(o) ? !1 : (e.add(o), !0);
  });
}
function ls(r) {
  return Xn(r, 1 / 0);
}
const Mn = 1e5, mr = 16;
function Xn(r, t) {
  return wr(r), new yr(r).findSegmentIntersections(t).map(
    (s) => Yt([s.x, s.y])
  );
}
function wr(r) {
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
class yr {
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
    (o != this._xx.length || this._xx.length != this._yy.length) && Lt("ArcCollection#initXYData() Counting error"), this.initBounds(), this._arcIter = new $r(this._xx, this._yy);
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
      c = n[f], c > 0 && (l = f * 4, u = Xr(t, e, a, c), o[l++] = u[0], o[l++] = u[1], o[l++] = u[2], o[l] = u[3], a += c, i.mergeBounds(u));
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
      (m, h, v, b) => {
        let A = a(b[m]);
        const E = a(b[h]);
        let k = 0;
        for (; i[A] = i[A] + 2, A != E; )
          k++, k > c && Lt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${o}`,
            `s1=${A}`,
            `s2=${E}`
          ), A += E > A ? 1 : -1;
      }
    );
    const u = this.getUint32Array(Sr(i));
    let f = 0;
    const d = [];
    xr(i, (m) => {
      const h = f;
      f += m, d.push(u.subarray(h, f));
    }), Mr(i, 0), this.forEachSegment(
      (m, h, v, b) => {
        let A = a(b[m]);
        const E = a(b[h]);
        let k, B, O = 0;
        for (; k = i[A], i[A] = k + 2, B = d[A], B[k] = m, B[k + 1] = h, A != E; )
          O++, O > c && Lt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${o}`,
            `s1=${A}`,
            `s2=${E}`
          ), A += E > A ? 1 : -1;
      }
    );
    const y = this.getVertexData(), w = t * mr;
    let p = 0;
    const _ = /* @__PURE__ */ new Set(), I = /* @__PURE__ */ new Map(), g = (m) => {
      p++;
      const h = Rr(m);
      return _.has(h) || (_.add(h), I.set(`${m.x}:${m.y}`, m)), I.size >= t || p >= w;
    };
    if (y.xx && y.yy)
      for (l = 0; l < o && !_r(d[l], y.xx, y.yy, g); l++)
        ;
    return Array.from(I.values());
  }
}
function Lt(...r) {
  const t = r.join(" ");
  throw new Error(t);
}
function ne(r) {
  return r ? br(r) ? !0 : vr(r) ? !1 : r.length === 0 ? !0 : r.length > 0 : !1;
}
function vr(r) {
  return r != null && r.toString === String.prototype.toString;
}
function br(r) {
  return Array.isArray(r);
}
function Sr(r, t) {
  ne(r) || Lt("utils.sum() expects an array, received:", r);
  let e = 0, n;
  for (let s = 0, o = r.length; s < o; s++)
    n = r[s], n && (e += n);
  return e;
}
function xr(r, t, e) {
  if (!ne(r))
    throw new Error(`#forEach() takes an array-like argument. ${r}`);
  for (let n = 0, s = r.length; n < s; n++)
    t.call(e, r[n], n);
}
function Mr(r, t) {
  for (let e = 0, n = r.length; e < n; e++)
    r[e] = t;
  return r;
}
function _r(r, t, e, n) {
  const s = r.length - 2;
  let o, i, a, c, l, u, f, d, y, w, p, _, I, g, m, h, v;
  for (Pr(t, r), h = 0; h < s; ) {
    for (o = r[h], i = r[h + 1], l = t[o], u = t[i], y = e[o], w = e[i], v = h; v < s && (v += 2, a = r[v], f = t[a], !(u < f)); ) {
      if (p = e[a], c = r[v + 1], d = t[c], _ = e[c], y >= p) {
        if (y > _ && w > p && w > _) continue;
      } else if (y < _ && w < p && w < _) continue;
      if (!(o == a || o == c || i == a || i == c) && (I = Er(
        l,
        y,
        u,
        w,
        f,
        p,
        d,
        _
      ), I && (g = [o, i], m = [a, c], n(En(I, g, m, t, e)) || I.length == 4 && n(En(I.slice(2), g, m, t, e)))))
        return !0;
    }
    h += 2;
  }
  return !1;
}
function Er(r, t, e, n, s, o, i, a) {
  const c = kr(r, t, e, n, s, o, i, a);
  let l = null;
  return c && (l = Ar(r, t, e, n, s, o, i, a), l ? Fr(r, t, e, n, s, o, i, a) && (l = null) : l = Nr(r, t, e, n, s, o, i, a)), l;
}
function kr(r, t, e, n, s, o, i, a) {
  return Qt(r, t, e, n, s, o) * Qt(r, t, e, n, i, a) <= 0 && Qt(s, o, i, a, r, t) * Qt(s, o, i, a, e, n) <= 0;
}
function Qt(r, t, e, n, s, o) {
  return Ln(r - s, t - o, e - s, n - o);
}
function Ln(r, t, e, n) {
  return r * n - t * e;
}
function Ar(r, t, e, n, s, o, i, a) {
  let c = ge(r, t, e, n, s, o, i, a), l;
  return c && (l = Br(c[0], c[1], r, t, e, n, s, o, i, a), l == 1 ? c = ge(e, n, r, t, s, o, i, a) : l == 2 ? c = ge(s, o, i, a, r, t, e, n) : l == 3 && (c = ge(i, a, s, o, r, t, e, n))), c && Or(c, r, t, e, n, s, o, i, a), c;
}
function ge(r, t, e, n, s, o, i, a) {
  const c = Ln(e - r, n - t, i - s, a - o), l = 1e-18;
  let u;
  if (c === 0) return null;
  const f = Qt(s, o, i, a, r, t) / c;
  return c <= l && c >= -l ? u = Ir(r, t, e, n, s, o, i, a) : u = [r + f * (e - r), t + f * (n - t)], u;
}
function Ir(r, t, e, n, s, o, i, a) {
  let c = null;
  return !It(r, s, i) && !It(t, o, a) ? c = [r, t] : !It(e, s, i) && !It(n, o, a) ? c = [e, n] : !It(s, r, e) && !It(o, t, n) ? c = [s, o] : !It(i, r, e) && !It(a, t, n) && (c = [i, a]), c;
}
function It(r, t, e) {
  let n;
  return t < e ? n = r < t || r > e : t > e ? n = r > t || r < e : n = r != t, n;
}
function Br(r, t, ...e) {
  let n = -1, s = 1 / 0, o;
  for (let i = 0, a = 0, c = e.length; a < c; i++, a += 2)
    o = Tr(r, t, e[a], e[a + 1]), o < s && (s = o, n = i);
  return n;
}
function Tr(r, t, e, n) {
  const s = r - e, o = t - n;
  return s * s + o * o;
}
function Or(r, t, e, n, s, o, i, a, c) {
  let l = r[0], u = r[1];
  l = me(l, t, n), l = me(l, o, a), u = me(u, e, s), u = me(u, i, c), r[0] = l, r[1] = u;
}
function me(r, t, e) {
  let n;
  return It(r, t, e) && (n = Math.abs(r - t) < Math.abs(r - e) ? t : e, r = n), r;
}
function Nr(r, t, e, n, s, o, i, a) {
  const c = Math.min(r, e, s, i), l = Math.max(r, e, s, i), u = Math.min(t, n, o, a), f = Math.max(t, n, o, a), d = f - u > l - c;
  let y = [];
  return (d ? Ct(t, u, f) : Ct(r, c, l)) && y.push(r, t), (d ? Ct(n, u, f) : Ct(e, c, l)) && y.push(e, n), (d ? Ct(o, u, f) : Ct(s, c, l)) && y.push(s, o), (d ? Ct(a, u, f) : Ct(i, c, l)) && y.push(i, a), (y.length != 2 && y.length != 4 || y.length == 4 && y[0] == y[2] && y[1] == y[3]) && (y = null), y;
}
function Fr(r, t, e, n, s, o, i, a) {
  return r == s && t == o || r == i && t == a || e == s && n == o || e == i && n == a;
}
function Ct(r, t, e) {
  return r > t && r < e;
}
function Pr(r, t) {
  Cr(r, t), Yn(r, t, 0, t.length - 2);
}
function Cr(r, t) {
  for (let e = 0, n = t.length; e < n; e += 2)
    r[t[e]] > r[t[e + 1]] && Dr(t, e, e + 1);
}
function Dr(r, t, e) {
  const n = r[t];
  r[t] = r[e], r[e] = n;
}
function Yn(r, t, e, n) {
  let s = e, o = n, i, a;
  for (; s < n; ) {
    for (i = r[t[e + n >> 2 << 1]]; s <= o; ) {
      for (; r[t[s]] < i; ) s += 2;
      for (; r[t[o]] > i; ) o -= 2;
      s <= o && (a = t[s], t[s] = t[o], t[o] = a, a = t[s + 1], t[s + 1] = t[o + 1], t[o + 1] = a, s += 2, o -= 2);
    }
    if (o - e < 40 ? _n(r, t, e, o) : Yn(r, t, e, o), n - s < 40) {
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
function Rr(r) {
  return `${r.a.join(",")};${r.b.join(",")}`;
}
class $r {
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
function Xr(r, t, e, n) {
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
function Se(r) {
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
function qn(r, t, e) {
  const n = Se(t.forw), s = Se(t.bakw);
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
  const n = Se(t.forw), s = Se(t.bakw);
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
function Lr(r, t) {
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
const Yr = 10;
function qr(r, t, e, n, s, o) {
  if (!r && !t) return !1;
  const i = r ? 0 : 1, a = 1 - i, c = e[i], l = e[a];
  if (!c || !l) return !1;
  const u = bt(l.geom);
  let f = !1, d = !1;
  for (let y = 0; y <= 1; y++) {
    const w = n[y];
    if (!w) continue;
    const p = [String(w.prop.index), String(c.prop.index)].sort().join("-"), _ = s[p];
    if (!_ || _.length < 2) continue;
    const I = _.find(
      (O) => O.bakw !== o[i].bakw
    );
    if (!I) continue;
    const m = Zt(I.bakw).find(
      (O) => String(O.prop.index) !== String(w.prop.index) && String(O.prop.index) !== String(c.prop.index)
    );
    if (!m) continue;
    f = !0;
    const h = bt(m.geom), v = bt(w.geom), b = bt(c.geom), A = b[0] - v[0], E = b[1] - v[1], k = A * (u[1] - v[1]) - E * (u[0] - v[0]), B = A * (h[1] - v[1]) - E * (h[0] - v[0]);
    if (k * B > 0) {
      d = !0;
      break;
    }
  }
  return f && !d;
}
function Ur(r, t, e, n) {
  if (!r && !t) return !1;
  if (e[0] && e[1] && n[0] && n[1]) {
    const s = n.map((u) => bt(u.geom)), o = e.map((u) => bt(u.geom)), i = s[1][0] - s[0][0], a = s[1][1] - s[0][1], c = i * (o[0][1] - s[0][1]) - a * (o[0][0] - s[0][0]), l = i * (o[1][1] - s[0][1]) - a * (o[1][0] - s[0][0]);
    return c * l < 0;
  }
  return !1;
}
function Vr(r, t, e, n) {
  const s = Lr(e, n), o = /* @__PURE__ */ new Set();
  let i = !1;
  for (let a = 0; a < Yr; a++) {
    let c = !1;
    for (const l of Object.keys(t)) {
      if (o.has(l)) continue;
      o.add(l);
      const u = t[l];
      if (!u || u.length < 2) continue;
      const f = l.split("-");
      if (f.length !== 2 || s.has(l)) continue;
      const d = Zt(u[0].bakw), y = Zt(u[1].bakw), w = Zt(u[0].forw), p = Zt(u[1].forw), _ = f.map(
        (x) => d.find((F) => `${F.prop.index}` === x) || y.find((F) => `${F.prop.index}` === x)
      ), I = f.map(
        (x) => w.find((F) => `${F.prop.index}` === x) || p.find((F) => `${F.prop.index}` === x)
      );
      if (_.some((x) => !x) || I.some((x) => !x))
        continue;
      const g = [d, y].map(
        (x) => x.find((F) => !f.includes(`${F.prop.index}`))
      ), m = [w, p].map(
        (x) => x.find((F) => !f.includes(`${F.prop.index}`))
      );
      if (g.some((x) => !x) || m.some((x) => !x))
        continue;
      const h = u[0].bakw.geometry.coordinates[0].slice(0, 3).map((x) => bt(x)), v = u[1].bakw.geometry.coordinates[0].slice(0, 3).map((x) => bt(x)), b = u[0].forw.geometry.coordinates[0].slice(0, 3).map((x) => bt(x)), A = u[1].forw.geometry.coordinates[0].slice(0, 3).map((x) => bt(x)), E = we(h), k = we(v), B = we(b), O = we(A), C = qr(
        E,
        k,
        g,
        _,
        t,
        u
      ), $ = Ur(
        B,
        O,
        g,
        _
      );
      if (!(C || $ || In(
        bt(g[0].geom),
        v
      ) || In(
        bt(g[1].geom),
        h
      )))
        continue;
      const T = I.map(
        (x) => bt(x.geom)
      ), M = m.map(
        (x) => bt(x.geom)
      ), N = jr([
        ...T,
        ...M
      ]), P = zr(N), D = Bn(
        T[0],
        T[1],
        M[0]
      ) + Bn(
        T[0],
        T[1],
        M[1]
      );
      Re(P, D) && (An(t, u[0], r), An(t, u[1], r), _.forEach((x) => {
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
        }, X = re([F], R), q = Pn(X);
        qn(t, {
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
  const [e, n] = t[0], [s, o] = t[1], [i, a] = t[2], c = i - e, l = a - n, u = s - e, f = o - n, d = r[0] - e, y = r[1] - n, w = c * c + l * l, p = c * u + l * f, _ = c * d + l * y, I = u * u + f * f, g = u * d + f * y, m = w * I - p * p;
  if (m === 0) return !1;
  const h = 1 / m, v = (I * _ - p * g) * h, b = (w * g - p * _) * h, A = 1e-9;
  return v >= -A && b >= -A && v + b <= 1 + A;
}
function jr(r) {
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
function zr(r) {
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
const Kr = (r) => typeof r == "string" && r.startsWith("b");
function Hr(r, t) {
  const e = (n, s) => {
    for (let o = 0; o < 3; o++) {
      const i = n.g[o], a = n.g[(o + 1) % 3];
      if (s.g.every((c) => n.sign * ft(i[0], i[1], a[0], a[1], c[0], c[1]) <= 0)) return !0;
    }
    return !1;
  };
  return !e(r, t) && !e(t, r);
}
function Wr(r, t, e) {
  if (t.length === 0) return [];
  const n = r.features.map((p) => {
    const { a: _, b: I, c: g } = p.properties, m = [_.geom, I.geom, g.geom], [h, v, b] = p.geometry.coordinates[0], A = m.map(([O]) => O), E = m.map(([, O]) => O), k = Math.sign(ft(h[0], h[1], v[0], v[1], b[0], b[1])), B = Math.sign(ft(m[0][0], m[0][1], m[1][0], m[1][1], m[2][0], m[2][1]));
    return {
      ids: [_.index, I.index, g.index].map(String),
      g: m,
      sign: B,
      ratio: k * B,
      aux: [_.index, I.index, g.index].some(Kr),
      minx: Math.min(...A),
      maxx: Math.max(...A),
      miny: Math.min(...E),
      maxy: Math.max(...E)
    };
  }), s = n.map((p) => p.ratio), o = s.reduce((p, _) => p + _, 0) < 0 ? -1 : 1, i = (p, _) => p < _ ? `${p}|${_}` : `${_}|${p}`, a = /* @__PURE__ */ new Map();
  n.forEach((p, _) => {
    for (let I = 0; I < 3; I++) {
      const g = i(p.ids[I], p.ids[(I + 1) % 3]), m = a.get(g);
      m ? m.push(_) : a.set(g, [_]);
    }
  });
  const c = ([p, _]) => i(String(e[p]), String(e[_])), l = /* @__PURE__ */ new Set();
  for (const p of t) for (const _ of a.get(c(p)) ?? []) l.add(_);
  const u = (p) => n[p].aux || l.has(p), f = /* @__PURE__ */ new Set();
  n.forEach((p, _) => {
    u(_) && (s[_] === 0 || s[_] !== o) && f.add(_);
  });
  const d = n.map((p, _) => _).sort((p, _) => n[p].minx - n[_].minx);
  for (let p = 0; p < d.length; p++) {
    const _ = n[d[p]];
    if (_.sign !== 0)
      for (let I = p + 1; I < d.length; I++) {
        const g = n[d[I]];
        if (g.minx >= _.maxx) break;
        g.sign === 0 || g.miny >= _.maxy || _.miny >= g.maxy || !u(d[p]) && !u(d[I]) || Hr(_, g) && (f.add(d[p]), f.add(d[I]));
      }
  }
  if (f.size === 0) return [];
  const y = t.filter((p) => (a.get(c(p)) ?? []).some((_) => f.has(_)));
  if (y.length > 0) return y;
  const w = /* @__PURE__ */ new Set();
  for (const p of f) for (const _ of n[p].ids) _.startsWith("b") || w.add(_);
  return t.filter(
    ([p, _]) => w.has(String(e[p])) || w.has(String(e[_]))
  );
}
const Gr = 4, Tn = 32, Jr = 1, Qr = 0.4, Un = 4, Zr = 1e-4, Vn = 0.25, ts = 0.01, Dt = (r, t) => String(r) < String(t) ? `${r}|${t}` : `${t}|${r}`;
function Ce(r, t, e) {
  const n = t.filter((l) => !String(l.properties.target.index).startsWith("b")).map((l) => ({
    id: l.properties.target.index,
    paper: l.geometry.coordinates,
    geo: l.properties.target.geom
  })), s = /* @__PURE__ */ new Set();
  let o = 0, i = 0;
  const a = r.features.map((l) => {
    const { a: u, b: f, c: d } = l.properties, [y, w, p] = l.geometry.coordinates[0];
    s.add(Dt(u.index, f.index)), s.add(Dt(u.index, d.index)), s.add(Dt(f.index, d.index));
    const _ = Math.sign(ft(y[0], y[1], w[0], w[1], p[0], p[1])) * Math.sign(ft(u.geom[0], u.geom[1], f.geom[0], f.geom[1], d.geom[0], d.geom[1]));
    return _ > 0 ? o++ : _ < 0 && i++, {
      ids: [String(u.index), String(f.index), String(d.index)],
      paper: [y, w, p],
      geo: [u.geom, f.geom, d.geom],
      sign: _
    };
  }), c = e.filter(([l, u]) => !s.has(Dt(n[l].id, n[u].id)));
  return { points: n, triangles: a, majority: o >= i ? 1 : -1, hullEdges: e, dropped: c };
}
function jn(r) {
  return [r.foot[0] + r.height * r.normal[0], r.foot[1] + r.height * r.normal[1]];
}
function es(r, [t, e], { lambda: n = Vn, epsilon: s = Zr } = {}) {
  const { points: o, majority: i } = r, a = o[t], c = o[e], l = o.reduce((M, N) => M + N.paper[0], 0) / o.length, u = o.reduce((M, N) => M + N.paper[1], 0) / o.length, f = Math.sign(ft(a.paper[0], a.paper[1], c.paper[0], c.paper[1], l, u));
  if (f === 0) return;
  const d = f * i, y = [c.paper[0] - a.paper[0], c.paper[1] - a.paper[1]], w = [c.geo[0] - a.geo[0], c.geo[1] - a.geo[1]], p = Math.hypot(y[0], y[1]), _ = Math.hypot(w[0], w[1]);
  if (!(p > 0 && _ > 0)) return;
  const I = [];
  for (const M of o) {
    if (M === a || M === c) continue;
    const N = ft(a.geo[0], a.geo[1], c.geo[0], c.geo[1], M.geo[0], M.geo[1]);
    if (N * d >= 0) continue;
    const P = ((M.geo[0] - a.geo[0]) * w[0] + (M.geo[1] - a.geo[1]) * w[1]) / (_ * _), D = ((M.paper[0] - a.paper[0]) * y[0] + (M.paper[1] - a.paper[1]) * y[1]) / (p * p);
    P > 0 && P < 1 && D > 0 && D < 1 && I.push({ id: M.id, u: P, t: D, d: Math.abs(N) / _ });
  }
  const g = I.length > 0;
  g || I.push({ u: 0.5, t: 0.5, d: 0 });
  const m = I.reduce((M, N) => N.d > M.d ? N : M);
  let h = 0;
  for (const M of I)
    h = Math.max(h, M.u <= m.u ? M.d * m.u / M.u : M.d * (1 - m.u) / (1 - M.u));
  h *= 1 + n;
  const v = [-y[1] / p * f, y[0] / p * f], b = [-w[1] / _ * d, w[0] / _ * d], A = (M) => [
    a.paper[0] + M * y[0] + s * p * v[0],
    a.paper[1] + M * y[1] + s * p * v[1]
  ], E = (M, N, P, D) => ({
    paper: A(M),
    foot: [a.geo[0] + N * w[0], a.geo[1] + N * w[1]],
    normal: b,
    height: P,
    chord: _,
    protrusion: m.d,
    ...D === void 0 ? {} : { anchor: D }
  }), k = [E(m.t, m.u, h, g ? m.id : void 0)], B = [...I].sort((M, N) => M.u - N.u), O = [{ u: 0, d: 0 }], C = (M, N, P) => (N.u - M.u) * (P.d - M.d) - (N.d - M.d) * (P.u - M.u);
  for (const M of [...B, { u: 1, d: 0 }]) {
    for (; O.length >= 2 && C(O[O.length - 2], O[O.length - 1], M) >= 0; ) O.pop();
    O.push(M);
  }
  const $ = n * m.d, S = [];
  let T = 0;
  for (const M of O.slice(1, -1))
    M.t === void 0 || !(M.t > T) || (T = M.t, S.push(E(M.t, M.u, M.d + $, g ? M.id : void 0)));
  return {
    edge: [a.id, c.id],
    variants: g && S.length > 1 ? [k, S] : [k]
  };
}
function ns(r, t, e, { lambda: n = Vn, mu: s = ts, maxIterations: o = Un } = {}) {
  let i = r.map((a, c) => ({ ray: { ...a }, index: c }));
  for (let a = 0; a < o && i.length > 0; a++) {
    const c = e(i.map(({ ray: f }) => [f.paper, jn(f)]));
    if (!c) return;
    let l = !1;
    const u = /* @__PURE__ */ new Set();
    for (const [f, { ray: d }] of i.entries()) {
      const y = `e${t + f}`;
      let w = -1 / 0, p = 1 / 0, _ = 0;
      for (const h of c.triangles) {
        const v = h.ids.indexOf(y);
        if (v < 0) continue;
        h.sign !== c.majority && _++;
        const b = h.geo[(v + 1) % 3], A = h.geo[(v + 2) % 3], E = Math.sign(
          ft(
            h.paper[v][0],
            h.paper[v][1],
            h.paper[(v + 1) % 3][0],
            h.paper[(v + 1) % 3][1],
            h.paper[(v + 2) % 3][0],
            h.paper[(v + 2) % 3][1]
          )
        ), k = ft(d.foot[0], d.foot[1], b[0], b[1], A[0], A[1]), B = ft(d.foot[0] + d.normal[0], d.foot[1] + d.normal[1], b[0], b[1], A[0], A[1]) - k, O = E * c.majority;
        if (B === 0) {
          k * O <= 0 && (w = 1 / 0);
          continue;
        }
        const C = -k / B;
        B * O > 0 ? w = Math.max(w, C) : p = Math.min(p, C);
      }
      if (!(w < p)) {
        u.add(f);
        continue;
      }
      const I = Math.min(Math.max(n * Math.max(w, d.protrusion), s * d.chord), (p - w) / 2), g = Math.max(w, 0) + I, m = Math.abs(g - d.height) > 1e-9 * d.chord;
      (_ > 0 || m) && (m && (l = !0), d.height = g);
    }
    if (u.size > 0 && (i = i.filter((f, d) => !u.has(d)), l = !0), !l) break;
  }
  if (i.length !== 0)
    return { rays: i.map(({ ray: a }) => a), kept: i.map(({ index: a }) => a) };
}
function is(r, t) {
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
function rs(r, t) {
  const e = { rounds: 0, builds: 0, cost: 0, budget: 0, batches: 0, perEdge: 0, multiPoint: 0 };
  let n = [], s = [], o = t, i = r.snapshot();
  const a = /* @__PURE__ */ new Set(), c = Jr * r.baseCost;
  e.budget = c;
  const l = r.buildCost();
  let u = 0;
  const f = () => u * Qr + r.buildCost() - l, d = () => f() >= c, y = (g) => {
    if (!d())
      return e.builds++, u++, r.measure(g);
  }, w = (g) => [g.paper, jn(g)], p = (g, m, h) => {
    const v = ns(
      g.map(({ ray: b }) => b),
      m,
      (b) => y([...n, ...b]),
      { maxIterations: h }
    );
    return v?.rays.map((b, A) => ({ ray: b, edge: g[v.kept[A]].edge }));
  }, _ = (g, m) => g.length === m.length && g.every(({ ray: h }, v) => Math.abs(h.height - m[v].ray.height) <= 1e-9 * h.chord), I = (g) => {
    if (g.length === 0 || n.length + g.length > Tn) return !1;
    const m = r.edgeBase + n.length;
    let h = p(g, m, 1), v = !1;
    for (; h && h.length > 0 && !d(); ) {
      const b = [...n, ...h.map(({ ray: B }) => w(B))];
      e.builds++;
      const A = r.build(b, Math.max(1, Math.ceil(c - f()))), E = A ? is(A.analysis, m) : void 0;
      if (A && E.size === 0)
        return s = s.concat(
          h.map(({ ray: B, edge: O }, C) => ({
            node: m + C,
            kind: "hullEdge",
            edge: O,
            ...B.anchor === void 0 ? {} : { anchor: B.anchor }
          }))
        ), n = b, o = A, i = r.snapshot(), !0;
      if (r.restore(i), A && E.size < h.length) {
        h = h.filter((B, O) => !E.has(m + O));
        continue;
      }
      if (v) return !1;
      v = !0;
      const k = p(h, m, Un);
      if (!k || _(k, h)) return !1;
      h = k;
    }
    return !1;
  };
  for (let g = 1; g <= Gr && !d(); g++) {
    const { analysis: m } = o, h = [];
    for (const b of m.dropped) {
      const A = b.map((k) => m.points[k].paper.join(",")).join("|");
      if (a.has(A) || (a.add(A), n.length + h.length + 1 > Tn)) continue;
      const E = es(m, b);
      E && h.push(E);
    }
    if (h.length === 0) break;
    e.rounds = g;
    const v = (b, A) => A.map((E) => ({ ray: E, edge: b.edge }));
    if (I(h.flatMap((b) => v(b, b.variants[0])))) {
      e.batches++;
      continue;
    }
    for (const b of h)
      for (const [A, E] of b.variants.entries()) {
        if (d()) break;
        if (I(v(b, E))) {
          e.perEdge++, A > 0 && e.multiPoint++;
          break;
        }
      }
  }
  return r.restore(i), e.cost = f(), { pairs: n, records: s, result: o.result, diagnostics: e };
}
const On = 2.00704, Nn = 3.00001, ss = 12, Fn = /* @__PURE__ */ Symbol("supplement pairs out of budget"), os = 24;
class rt extends Gn {
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
      Jn(t.worldFile), this.requestedWorldFile = { ...t.worldFile };
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
    this.edges = Qn(t), this.edgeNodes = void 0, this.tins = void 0, this.indexedTins = void 0;
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
  calculateStrictTin(t = Mn) {
    this.resolveStrictOverlaps(), this.detectStrictKinks(t);
  }
  /**
   * 順三角網から逆三角網を写し、重なりを辺の反転で解消する（`calculateStrictTin` の前半）。
   * 交差の判定（`strict_status`・`kinks`）はしない。補完点の置き場所を測る試行は、三角網の向きを読むだけなので
   * これだけを呼ぶ。
   */
  resolveStrictOverlaps() {
    const t = this.tins.forw.features.map(
      (s) => Pn(s)
    );
    this.tins.bakw = St(t);
    const e = {};
    this.tins.forw.features.forEach((s, o) => {
      const i = this.tins.bakw.features[o];
      qn(e, { forw: s, bakw: i });
    });
    const n = (this.pointsSet?.forw.features ?? []).map(
      (s) => s.properties.target.index
    );
    Vr(
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
      return Xn(s, t);
    });
    e[0].length === 0 && e[1].length === 0 ? (this.strict_status = rt.STATUS_STRICT, delete this.kinks) : (this.strict_status = rt.STATUS_ERROR, this.kinks = {
      forw: St(e[0]),
      bakw: St(e[1])
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
      const o = this.points[s][0], i = this.points[s][1], a = Vt(o, i, s);
      t.forw.push(a), t.bakw.push(jt(a));
    }
    const e = [];
    let n = 0;
    this.edgeNodes = [], this.edges || (this.edges = []);
    for (let s = 0; s < this.edges.length; s++) {
      const o = this.edges[s][2], i = Object.assign([], this.edges[s][0]), a = Object.assign([], this.edges[s][1]);
      if (as(o, this.points.length, s), i.length === 0 && a.length === 0) {
        e.push(o);
        continue;
      }
      i.unshift(this.points[o[0]][0]), i.push(this.points[o[1]][0]), a.unshift(this.points[o[0]][1]), a.push(this.points[o[1]][1]), er(i, a).map((c, l, u) => {
        this.edgeNodes[n] = [
          c[0],
          c[1]
        ];
        const f = Vt(
          c[0],
          c[1],
          `e${n}`
        );
        n++, t.forw.push(f), t.bakw.push(jt(f)), l === 0 ? e.push([o[0], t.forw.length - 1]) : e.push([
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
          (C) => Ge(C[0], B)
        )) throw "SOME POINTS OUTSIDE";
      }
      s = this.generatePointsSet(), { minx: o, maxx: i, miny: a, maxy: c } = this.computeGcpBbox();
    } else {
      const B = this.validateAndPrepareInputs();
      s = B.pointsSet, o = B.minx, i = B.maxx, a = B.miny, c = B.maxy;
    }
    const l = {
      forw: St([...s.forw]),
      bakw: St([...s.bakw])
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
    const d = Ti(l.forw), y = fn(l.forw);
    if (!y) throw "TOO LINEAR2";
    const w = {}, p = y.geometry.coordinates[0];
    let _;
    try {
      _ = p.map((B) => ({
        forw: B,
        bakw: Me(Yt(B), u)
      })), _.forEach((B) => {
        w[`${B.forw[0]}:${B.forw[1]}`] = B;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const I = fn(l.bakw);
    if (!I) throw "TOO LINEAR2";
    const g = I.geometry.coordinates[0];
    try {
      _ = g.map((B) => ({
        bakw: B,
        forw: Me(Yt(B), f)
      })), _.forEach((B) => {
        w[`${B.forw[0]}:${B.forw[1]}`] = B;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const m = {
      forw: d.geometry.coordinates,
      bakw: Me(d, u)
    }, h = Vt(m.forw, m.bakw, "c");
    this.centroid = {
      forw: h,
      bakw: jt(h)
    };
    const v = [
      ...this.points.map((B) => ({ forw: B[0], bakw: B[1] })),
      ...(this.edgeNodes ?? []).map((B) => ({ forw: B[0], bakw: B[1] }))
    ], b = {
      convexBuf: w,
      centroid: m,
      allGcps: v,
      minx: o,
      maxx: i,
      miny: a,
      maxy: c
    };
    if (n) {
      this.stateTriangle = void 0;
      const B = this.yaxisMode === rt.YAXIS_FOLLOW, O = B ? 1 : -1, { boundary: C } = this.buildWithSupplements(t, s, v, ($, S, T) => (M) => ({ boundary: yn(
        b,
        (N) => gr(N, (P) => {
          const [D, x] = Zn(n, P);
          return [D, B ? -x : x];
        }),
        s,
        this.points.length,
        {
          orientation: O,
          accept: (N) => N.hasMapBoundary ? (this.buildTin(s, N.vertices, S, N, M.size > 0, T), (this.strict_status !== rt.STATUS_LOOSE || N.hasBoundary) && be(this.tins.forw, O) === 0 && be(this.tins.bakw, O) === 0) : !1
        },
        M,
        $
      ) }));
      if (C) {
        this.compiledOuter = {
          outerTransform: "worldFile",
          worldFile: n,
          vertices_points: C.vertices.map(({ forw: N, bakw: P }) => [N, P])
        };
        const { centroid: $, xy: S, wh: T, kinks: M } = this;
        super.setCompiled(this.getCompiled()), Object.assign(this, { centroid: $, xy: S, wh: T, kinks: M }), this.lastBoundaryDiagnostics = {
          ...C.diagnostics,
          requestedOuterTransform: "worldFile",
          outerTransform: "worldFile"
        };
        return;
      }
      this.compiledOuter = { outerTransform: "extrapolate" }, this.outerTransform = "extrapolate", this.worldFile = void 0;
    }
    const A = this.vertexMode === rt.VERTEX_BIRDEYE ? pr : dr;
    let E, k;
    e ? { boundary: E, verticesList: k } = this.buildWithSupplements(t, s, v, (B, O, C) => ($) => {
      const S = yn(
        b,
        A,
        s,
        this.points.length,
        void 0,
        $,
        B
      );
      return {
        boundary: S,
        verticesList: this.buildTin(
          s,
          S?.vertices ?? A(b, !1),
          O,
          S,
          $.size > 0,
          C
        )
      };
    }) : k = this.buildTin(
      s,
      A(b, !1),
      t,
      void 0
    ), this.vertices_params = {
      forw: gn(k.forw, this.centroid.forw),
      bakw: gn(k.bakw, this.centroid.bakw)
    }, this.addIndexedTin(), this.pointsWeightBuffer = {}, this.lastBoundaryDiagnostics = E?.diagnostics, n && this.lastBoundaryDiagnostics && (this.lastBoundaryDiagnostics = {
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
    const i = (b, A, E) => {
      const k = s(b, A, E);
      return (B) => (o++, k(B));
    }, a = (b) => this.buildWithHull(b, i(/* @__PURE__ */ new Map(), b, !1));
    if (!this.useSupplementPairs || this.useV2Algorithm || t === rt.MODE_LOOSE) return a(t);
    const c = t, l = a(c), u = o;
    let f = 0;
    if (!l.boundary || this.strict_status !== rt.STATUS_STRICT) return l;
    const d = Ce(this.tins.forw, this.pointsSet.forw.features, l.boundary.forwHull.all);
    if (d.dropped.length === 0) return l;
    const y = this.edgeNodes.length, w = e.forw.length, p = n.length;
    let _ = [], I;
    const g = (b, A) => b.length === A.length && b.every((E, k) => E.every((B, O) => B[0] === A[k][O][0] && B[1] === A[k][O][1])), m = (b) => {
      e.forw.length = w, e.bakw.length = w, n.length = p, this.edgeNodes.length = y;
      for (const [A, E] of b) {
        const k = Vt(A, E, `e${this.edgeNodes.length}`);
        this.edgeNodes.push([A, E]), e.forw.push(k), e.bakw.push(jt(k)), n.push({ forw: A, bakw: E });
      }
      _ = b;
    }, v = rs({
      edgeBase: y,
      baseCost: u,
      buildCost: () => f,
      snapshot: () => ({ pairs: _, state: this.captureBuild() }),
      restore: ({ pairs: b, state: A }) => {
        m(b), this.restoreBuild(A);
      },
      measure: (b) => {
        m(b);
        const A = this.captureBuild();
        try {
          const E = /* @__PURE__ */ new Map();
          I = { pairs: b, cache: E };
          const { boundary: k } = s(E, rt.MODE_STRICT, !0)(/* @__PURE__ */ new Set());
          return k ? Ce(this.tins.forw, this.pointsSet.forw.features, []) : void 0;
        } finally {
          this.restoreBuild(A);
        }
      },
      build: (b, A) => {
        m(b);
        const E = I && g(I.pairs, b) ? I.cache : /* @__PURE__ */ new Map(), k = o;
        let B;
        try {
          B = this.buildWithHull(c, (O) => {
            if (o - k >= A) throw Fn;
            return i(E, c, !1)(O);
          });
        } catch (O) {
          if (O !== Fn) throw O;
          f += o - k;
          return;
        }
        if (f += o - k, !(!B.boundary || this.strict_status !== rt.STATUS_STRICT))
          return {
            result: B,
            analysis: Ce(this.tins.forw, this.pointsSet.forw.features, B.boundary.forwHull.all)
          };
      }
    }, { result: l, analysis: d });
    return this.supplementRecords = v.records, this.lastSupplementDiagnostics = v.diagnostics, v.result;
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
    const o = (p) => [...p].sort().join(","), i = (p, _ = !1) => {
      const I = o(p), g = n.get(I);
      if (g) return g;
      const m = e(p), h = {
        value: m,
        strict: m.boundary !== void 0 && this.strict_status === rt.STATUS_STRICT
      };
      return (h.strict || _) && (h.state = this.captureBuild()), n.set(I, h), s = h, h;
    }, a = (p) => (s !== p && this.restoreBuild(p.state), s = p, p.value), c = i(/* @__PURE__ */ new Set(), !0);
    if (!(t === rt.MODE_STRICT || t === rt.MODE_AUTO) || !c.value.boundary || c.strict) return c.value;
    const u = new Set(c.value.boundary.forwHull.all.map(ve)), f = () => this.pointsSet.forw.features.map(
      (p) => p.properties.target.index
    ), d = /* @__PURE__ */ new Set();
    let y = c, w;
    for (let p = 0; p < ss; p++) {
      const _ = Wr(
        this.tins.forw,
        y.value.boundary.forwHull.applied,
        f()
      ).filter((I) => !d.has(ve(I)));
      if (_.length === 0) break;
      for (const I of _) d.add(ve(I));
      if (y = i(d), !y.value.boundary) break;
      if (y.strict) {
        w = y;
        break;
      }
    }
    if (w) {
      let p = w;
      for (const _ of [...d].slice(0, os)) {
        const I = new Set(d);
        I.delete(_);
        const g = i(I);
        g.strict && (d.delete(_), p = g);
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
      const l = e[c].forw, u = e[c].bakw, f = Vt(l, u, `b${c}`), d = jt(f);
      a.forw.push(f), a.bakw.push(d);
    }
    return this.pointsSet = {
      forw: St([...t.forw, ...a.forw]),
      bakw: St([...t.bakw, ...a.bakw]),
      edges: t.edges
    }, this.tins = {
      forw: Ve(
        s?.forw ?? pe(this.pointsSet.forw, t.edges, "target")
      )
    }, (n === rt.MODE_STRICT || n === rt.MODE_AUTO) && (i ? this.resolveStrictOverlaps() : this.calculateStrictTin(
      n === rt.MODE_AUTO || o ? 1 : Mn
    )), (n === rt.MODE_LOOSE || n === rt.MODE_AUTO && this.strict_status === rt.STATUS_ERROR) && (this.tins.bakw = Ve(
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
function as(r, t, e) {
  const n = (s) => Number.isInteger(s) && s >= 0 && s < t;
  if (!Array.isArray(r) || !n(r[0]) || !n(r[1]))
    throw new Error(
      `Invalid edge at edges[${e}]: start/end ${JSON.stringify(r)} must be integer indices of points (0 to ${t - 1})`
    );
}
export {
  rt as Tin,
  pe as constrainedTin,
  jt as counterPoint,
  Vt as createPoint,
  rt as default,
  ls as findIntersections,
  On as format_version,
  qn as insertSearchIndex,
  gn as vertexCalc
};
