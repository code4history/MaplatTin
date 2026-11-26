import { counterTri as Fn, Transform as Wn, validateWorldFile as Gn, normalizeEdges as Jn, transformArr as Me, rotateVerticesTriangle as Ve, worldFileToCrs as Qn } from "@maplat/transform";
function ee(i, t, e = {}) {
  const n = { type: "Feature" };
  return (e.id === 0 || e.id) && (n.id = e.id), e.bbox && (n.bbox = e.bbox), n.properties = t || {}, n.geometry = i, n;
}
function Yt(i, t, e = {}) {
  if (!i)
    throw new Error("coordinates is required");
  if (!Array.isArray(i))
    throw new Error("coordinates must be an Array");
  if (i.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!ze(i[0]) || !ze(i[1]))
    throw new Error("coordinates must contain numbers");
  return ee({
    type: "Point",
    coordinates: i
  }, t, e);
}
function re(i, t, e = {}) {
  for (const o of i) {
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
  return ee({
    type: "Polygon",
    coordinates: i
  }, t, e);
}
function je(i, t, e = {}) {
  if (i.length < 2)
    throw new Error("coordinates must be an array of two or more positions");
  return ee({
    type: "LineString",
    coordinates: i
  }, t, e);
}
function xt(i, t = {}) {
  const e = { type: "FeatureCollection" };
  return t.id && (e.id = t.id), t.bbox && (e.bbox = t.bbox), e.features = i, e;
}
function ze(i) {
  return !isNaN(i) && i !== null && !Array.isArray(i);
}
function Zn(i) {
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
function ti(i) {
  return i.type === "Feature" ? i.geometry : i;
}
function $e(i, t, e) {
  if (i !== null)
    for (var n, o, r, s, a, l, c, u = 0, f = 0, d, m = i.type, y = m === "FeatureCollection", p = m === "Feature", S = y ? i.features.length : 1, A = 0; A < S; A++) {
      c = y ? (
        // @ts-expect-error: Known type conflict
        i.features[A].geometry
      ) : p ? (
        // @ts-expect-error: Known type conflict
        i.geometry
      ) : i, d = c ? c.type === "GeometryCollection" : !1, a = d ? c.geometries.length : 1;
      for (var g = 0; g < a; g++) {
        var w = 0, h = 0;
        if (s = d ? c.geometries[g] : c, s !== null) {
          l = s.coordinates;
          var v = s.type;
          switch (u = e && (v === "Polygon" || v === "MultiPolygon") ? 1 : 0, v) {
            case null:
              break;
            case "Point":
              if (
                // @ts-expect-error: Known type conflict
                t(
                  l,
                  f,
                  A,
                  w,
                  h
                ) === !1
              )
                return !1;
              f++, w++;
              break;
            case "LineString":
            case "MultiPoint":
              for (n = 0; n < l.length; n++) {
                if (
                  // @ts-expect-error: Known type conflict
                  t(
                    l[n],
                    f,
                    A,
                    w,
                    h
                  ) === !1
                )
                  return !1;
                f++, v === "MultiPoint" && w++;
              }
              v === "LineString" && w++;
              break;
            case "Polygon":
            case "MultiLineString":
              for (n = 0; n < l.length; n++) {
                for (o = 0; o < l[n].length - u; o++) {
                  if (
                    // @ts-expect-error: Known type conflict
                    t(
                      l[n][o],
                      f,
                      A,
                      w,
                      h
                    ) === !1
                  )
                    return !1;
                  f++;
                }
                v === "MultiLineString" && w++, v === "Polygon" && h++;
              }
              v === "Polygon" && w++;
              break;
            case "MultiPolygon":
              for (n = 0; n < l.length; n++) {
                for (h = 0, o = 0; o < l[n].length; o++) {
                  for (r = 0; r < l[n][o].length - u; r++) {
                    if (
                      // @ts-expect-error: Known type conflict
                      t(
                        l[n][o][r],
                        f,
                        A,
                        w,
                        h
                      ) === !1
                    )
                      return !1;
                    f++;
                  }
                  h++;
                }
                w++;
              }
              break;
            case "GeometryCollection":
              for (n = 0; n < s.geometries.length; n++)
                if (
                  // @ts-expect-error: Known type conflict
                  $e(s.geometries[n], t, e) === !1
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
function ht(i, t, e, n, o) {
  let r, s, a, l, c = t[0], u = n[0], f = 0, d = 0;
  u > c == u > -c ? (r = c, c = t[++f]) : (r = u, u = n[++d]);
  let m = 0;
  if (f < i && d < e)
    for (u > c == u > -c ? (s = c + r, a = r - (s - c), c = t[++f]) : (s = u + r, a = r - (s - u), u = n[++d]), r = s, a !== 0 && (o[m++] = a); f < i && d < e; )
      u > c == u > -c ? (s = r + c, l = s - r, a = r - (s - l) + (c - l), c = t[++f]) : (s = r + u, l = s - r, a = r - (s - l) + (u - l), u = n[++d]), r = s, a !== 0 && (o[m++] = a);
  for (; f < i; )
    s = r + c, l = s - r, a = r - (s - l) + (c - l), c = t[++f], r = s, a !== 0 && (o[m++] = a);
  for (; d < e; )
    s = r + u, l = s - r, a = r - (s - l) + (u - l), u = n[++d], r = s, a !== 0 && (o[m++] = a);
  return (r !== 0 || m === 0) && (o[m++] = r), m;
}
function Mt(i, t, e, n, o, r, s, a) {
  return ht(ht(i, t, e, n, s), s, o, r, a);
}
function Y(i, t, e, n) {
  let o, r, s, a, l, c, u, f, d, m, y;
  u = j * e, m = u - (u - e), y = e - m;
  let p = t[0];
  o = p * e, u = j * p, f = u - (u - p), d = p - f, s = d * y - (o - f * m - d * m - f * y);
  let S = 0;
  s !== 0 && (n[S++] = s);
  for (let A = 1; A < i; A++)
    p = t[A], a = p * e, u = j * p, f = u - (u - p), d = p - f, l = d * y - (a - f * m - d * m - f * y), r = o + l, c = r - o, s = o - (r - c) + (l - c), s !== 0 && (n[S++] = s), o = a + r, s = r - (o - a), s !== 0 && (n[S++] = s);
  return (o !== 0 || S === 0) && (n[S++] = o), S;
}
function Dn(i, t) {
  let e = t[0];
  for (let n = 1; n < i; n++) e += t[n];
  return e;
}
function tt(i) {
  return new Float64Array(i);
}
const ei = (3 + 16 * pt) * pt, ni = (2 + 12 * pt) * pt, ii = (9 + 64 * pt) * pt * pt, qt = tt(4), Ke = tt(8), He = tt(12), We = tt(16), gt = tt(4);
function ri(i, t, e, n, o, r, s) {
  let a, l, c, u, f, d, m, y, p, S, A, g, w, h, v, M, I, k;
  const E = i - o, T = e - o, O = t - r, C = n - r;
  h = E * C, d = j * E, m = d - (d - E), y = E - m, d = j * C, p = d - (d - C), S = C - p, v = y * S - (h - m * p - y * p - m * S), M = O * T, d = j * O, m = d - (d - O), y = O - m, d = j * T, p = d - (d - T), S = T - p, I = y * S - (M - m * p - y * p - m * S), A = v - I, f = v - A, qt[0] = v - (A + f) + (f - I), g = h + A, f = g - h, w = h - (g - f) + (A - f), A = w - M, f = w - A, qt[1] = w - (A + f) + (f - M), k = g + A, f = k - g, qt[2] = g - (k - f) + (A - f), qt[3] = k;
  let $ = Dn(4, qt), b = ni * s;
  if ($ >= b || -$ >= b || (f = i - E, a = i - (E + f) + (f - o), f = e - T, c = e - (T + f) + (f - o), f = t - O, l = t - (O + f) + (f - r), f = n - C, u = n - (C + f) + (f - r), a === 0 && l === 0 && c === 0 && u === 0) || (b = ii * s + Cn * Math.abs($), $ += E * u + C * a - (O * c + T * l), $ >= b || -$ >= b)) return $;
  h = a * C, d = j * a, m = d - (d - a), y = a - m, d = j * C, p = d - (d - C), S = C - p, v = y * S - (h - m * p - y * p - m * S), M = l * T, d = j * l, m = d - (d - l), y = l - m, d = j * T, p = d - (d - T), S = T - p, I = y * S - (M - m * p - y * p - m * S), A = v - I, f = v - A, gt[0] = v - (A + f) + (f - I), g = h + A, f = g - h, w = h - (g - f) + (A - f), A = w - M, f = w - A, gt[1] = w - (A + f) + (f - M), k = g + A, f = k - g, gt[2] = g - (k - f) + (A - f), gt[3] = k;
  const B = ht(4, qt, 4, gt, Ke);
  h = E * u, d = j * E, m = d - (d - E), y = E - m, d = j * u, p = d - (d - u), S = u - p, v = y * S - (h - m * p - y * p - m * S), M = O * c, d = j * O, m = d - (d - O), y = O - m, d = j * c, p = d - (d - c), S = c - p, I = y * S - (M - m * p - y * p - m * S), A = v - I, f = v - A, gt[0] = v - (A + f) + (f - I), g = h + A, f = g - h, w = h - (g - f) + (A - f), A = w - M, f = w - A, gt[1] = w - (A + f) + (f - M), k = g + A, f = k - g, gt[2] = g - (k - f) + (A - f), gt[3] = k;
  const _ = ht(B, Ke, 4, gt, He);
  h = a * u, d = j * a, m = d - (d - a), y = a - m, d = j * u, p = d - (d - u), S = u - p, v = y * S - (h - m * p - y * p - m * S), M = l * c, d = j * l, m = d - (d - l), y = l - m, d = j * c, p = d - (d - c), S = c - p, I = y * S - (M - m * p - y * p - m * S), A = v - I, f = v - A, gt[0] = v - (A + f) + (f - I), g = h + A, f = g - h, w = h - (g - f) + (A - f), A = w - M, f = w - A, gt[1] = w - (A + f) + (f - M), k = g + A, f = k - g, gt[2] = g - (k - f) + (A - f), gt[3] = k;
  const N = ht(_, He, 4, gt, We);
  return We[N - 1];
}
function ft(i, t, e, n, o, r) {
  const s = (t - r) * (e - o), a = (i - o) * (n - r), l = s - a, c = Math.abs(s + a);
  return Math.abs(l) >= ei * c ? l : -ri(i, t, e, n, o, r, c);
}
const si = (10 + 96 * pt) * pt, oi = (4 + 48 * pt) * pt, ai = (44 + 576 * pt) * pt * pt, Ot = tt(4), Nt = tt(4), Pt = tt(4), _t = tt(4), Et = tt(4), kt = tt(4), mt = tt(4), wt = tt(4), _e = tt(8), Ee = tt(8), ke = tt(8), Ae = tt(8), Ie = tt(8), Be = tt(8), oe = tt(8), ae = tt(8), ce = tt(8), Rt = tt(4), $t = tt(4), Xt = tt(4), z = tt(8), W = tt(16), nt = tt(16), it = tt(16), et = tt(32), Ft = tt(32), ct = tt(48), vt = tt(64);
let Kt = tt(1152), Te = tt(1152);
function lt(i, t, e) {
  i = ht(i, Kt, t, e, Te);
  const n = Kt;
  return Kt = Te, Te = n, i;
}
function ci(i, t, e, n, o, r, s, a, l) {
  let c, u, f, d, m, y, p, S, A, g, w, h, v, M, I, k, E, T, O, C, $, b, B, _, N, F, D, x, P, R, X, q, L, V, U;
  const H = i - s, K = e - s, G = o - s, J = t - a, Z = n - a, Q = r - a;
  X = K * Q, B = j * K, _ = B - (B - K), N = K - _, B = j * Q, F = B - (B - Q), D = Q - F, q = N * D - (X - _ * F - N * F - _ * D), L = G * Z, B = j * G, _ = B - (B - G), N = G - _, B = j * Z, F = B - (B - Z), D = Z - F, V = N * D - (L - _ * F - N * F - _ * D), x = q - V, b = q - x, Ot[0] = q - (x + b) + (b - V), P = X + x, b = P - X, R = X - (P - b) + (x - b), x = R - L, b = R - x, Ot[1] = R - (x + b) + (b - L), U = P + x, b = U - P, Ot[2] = P - (U - b) + (x - b), Ot[3] = U, X = G * J, B = j * G, _ = B - (B - G), N = G - _, B = j * J, F = B - (B - J), D = J - F, q = N * D - (X - _ * F - N * F - _ * D), L = H * Q, B = j * H, _ = B - (B - H), N = H - _, B = j * Q, F = B - (B - Q), D = Q - F, V = N * D - (L - _ * F - N * F - _ * D), x = q - V, b = q - x, Nt[0] = q - (x + b) + (b - V), P = X + x, b = P - X, R = X - (P - b) + (x - b), x = R - L, b = R - x, Nt[1] = R - (x + b) + (b - L), U = P + x, b = U - P, Nt[2] = P - (U - b) + (x - b), Nt[3] = U, X = H * Z, B = j * H, _ = B - (B - H), N = H - _, B = j * Z, F = B - (B - Z), D = Z - F, q = N * D - (X - _ * F - N * F - _ * D), L = K * J, B = j * K, _ = B - (B - K), N = K - _, B = j * J, F = B - (B - J), D = J - F, V = N * D - (L - _ * F - N * F - _ * D), x = q - V, b = q - x, Pt[0] = q - (x + b) + (b - V), P = X + x, b = P - X, R = X - (P - b) + (x - b), x = R - L, b = R - x, Pt[1] = R - (x + b) + (b - L), U = P + x, b = U - P, Pt[2] = P - (U - b) + (x - b), Pt[3] = U, c = ht(
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
        Ft
      ),
      Ft,
      vt
    ),
    vt,
    ht(
      Y(Y(4, Pt, G, z), z, G, W),
      W,
      Y(Y(4, Pt, Q, z), z, Q, nt),
      nt,
      et
    ),
    et,
    Kt
  );
  let at = Dn(c, Kt), ut = oi * l;
  if (at >= ut || -at >= ut || (b = i - H, u = i - (H + b) + (b - s), b = t - J, m = t - (J + b) + (b - a), b = e - K, f = e - (K + b) + (b - s), b = n - Z, y = n - (Z + b) + (b - a), b = o - G, d = o - (G + b) + (b - s), b = r - Q, p = r - (Q + b) + (b - a), u === 0 && f === 0 && d === 0 && m === 0 && y === 0 && p === 0) || (ut = ai * l + Cn * Math.abs(at), at += (H * H + J * J) * (K * p + Q * f - (Z * d + G * y)) + 2 * (H * u + J * m) * (K * Q - Z * G) + ((K * K + Z * Z) * (G * m + J * d - (Q * u + H * p)) + 2 * (K * f + Z * y) * (G * J - Q * H)) + ((G * G + Q * Q) * (H * y + Z * u - (J * f + K * m)) + 2 * (G * d + Q * p) * (H * Z - J * K)), at >= ut || -at >= ut))
    return at;
  if ((f !== 0 || y !== 0 || d !== 0 || p !== 0) && (X = H * H, B = j * H, _ = B - (B - H), N = H - _, q = N * N - (X - _ * _ - (_ + _) * N), L = J * J, B = j * J, _ = B - (B - J), N = J - _, V = N * N - (L - _ * _ - (_ + _) * N), x = q + V, b = x - q, _t[0] = q - (x - b) + (V - b), P = X + x, b = P - X, R = X - (P - b) + (x - b), x = R + L, b = x - R, _t[1] = R - (x - b) + (L - b), U = P + x, b = U - P, _t[2] = P - (U - b) + (x - b), _t[3] = U), (d !== 0 || p !== 0 || u !== 0 || m !== 0) && (X = K * K, B = j * K, _ = B - (B - K), N = K - _, q = N * N - (X - _ * _ - (_ + _) * N), L = Z * Z, B = j * Z, _ = B - (B - Z), N = Z - _, V = N * N - (L - _ * _ - (_ + _) * N), x = q + V, b = x - q, Et[0] = q - (x - b) + (V - b), P = X + x, b = P - X, R = X - (P - b) + (x - b), x = R + L, b = x - R, Et[1] = R - (x - b) + (L - b), U = P + x, b = U - P, Et[2] = P - (U - b) + (x - b), Et[3] = U), (u !== 0 || m !== 0 || f !== 0 || y !== 0) && (X = G * G, B = j * G, _ = B - (B - G), N = G - _, q = N * N - (X - _ * _ - (_ + _) * N), L = Q * Q, B = j * Q, _ = B - (B - Q), N = Q - _, V = N * N - (L - _ * _ - (_ + _) * N), x = q + V, b = x - q, kt[0] = q - (x - b) + (V - b), P = X + x, b = P - X, R = X - (P - b) + (x - b), x = R + L, b = x - R, kt[1] = R - (x - b) + (L - b), U = P + x, b = U - P, kt[2] = P - (U - b) + (x - b), kt[3] = U), u !== 0 && (S = Y(4, Ot, u, _e), c = lt(c, Mt(
    Y(S, _e, 2 * H, W),
    W,
    Y(Y(4, kt, u, z), z, Z, nt),
    nt,
    Y(Y(4, Et, u, z), z, -Q, it),
    it,
    et,
    ct
  ), ct)), m !== 0 && (A = Y(4, Ot, m, Ee), c = lt(c, Mt(
    Y(A, Ee, 2 * J, W),
    W,
    Y(Y(4, Et, m, z), z, G, nt),
    nt,
    Y(Y(4, kt, m, z), z, -K, it),
    it,
    et,
    ct
  ), ct)), f !== 0 && (g = Y(4, Nt, f, ke), c = lt(c, Mt(
    Y(g, ke, 2 * K, W),
    W,
    Y(Y(4, _t, f, z), z, Q, nt),
    nt,
    Y(Y(4, kt, f, z), z, -J, it),
    it,
    et,
    ct
  ), ct)), y !== 0 && (w = Y(4, Nt, y, Ae), c = lt(c, Mt(
    Y(w, Ae, 2 * Z, W),
    W,
    Y(Y(4, kt, y, z), z, H, nt),
    nt,
    Y(Y(4, _t, y, z), z, -G, it),
    it,
    et,
    ct
  ), ct)), d !== 0 && (h = Y(4, Pt, d, Ie), c = lt(c, Mt(
    Y(h, Ie, 2 * G, W),
    W,
    Y(Y(4, Et, d, z), z, J, nt),
    nt,
    Y(Y(4, _t, d, z), z, -Z, it),
    it,
    et,
    ct
  ), ct)), p !== 0 && (v = Y(4, Pt, p, Be), c = lt(c, Mt(
    Y(v, Be, 2 * Q, W),
    W,
    Y(Y(4, _t, p, z), z, K, nt),
    nt,
    Y(Y(4, Et, p, z), z, -H, it),
    it,
    et,
    ct
  ), ct)), u !== 0 || m !== 0) {
    if (f !== 0 || y !== 0 || d !== 0 || p !== 0 ? (X = f * Q, B = j * f, _ = B - (B - f), N = f - _, B = j * Q, F = B - (B - Q), D = Q - F, q = N * D - (X - _ * F - N * F - _ * D), L = K * p, B = j * K, _ = B - (B - K), N = K - _, B = j * p, F = B - (B - p), D = p - F, V = N * D - (L - _ * F - N * F - _ * D), x = q + V, b = x - q, mt[0] = q - (x - b) + (V - b), P = X + x, b = P - X, R = X - (P - b) + (x - b), x = R + L, b = x - R, mt[1] = R - (x - b) + (L - b), U = P + x, b = U - P, mt[2] = P - (U - b) + (x - b), mt[3] = U, X = d * -Z, B = j * d, _ = B - (B - d), N = d - _, B = j * -Z, F = B - (B - -Z), D = -Z - F, q = N * D - (X - _ * F - N * F - _ * D), L = G * -y, B = j * G, _ = B - (B - G), N = G - _, B = j * -y, F = B - (B - -y), D = -y - F, V = N * D - (L - _ * F - N * F - _ * D), x = q + V, b = x - q, wt[0] = q - (x - b) + (V - b), P = X + x, b = P - X, R = X - (P - b) + (x - b), x = R + L, b = x - R, wt[1] = R - (x - b) + (L - b), U = P + x, b = U - P, wt[2] = P - (U - b) + (x - b), wt[3] = U, I = ht(4, mt, 4, wt, ae), X = f * p, B = j * f, _ = B - (B - f), N = f - _, B = j * p, F = B - (B - p), D = p - F, q = N * D - (X - _ * F - N * F - _ * D), L = d * y, B = j * d, _ = B - (B - d), N = d - _, B = j * y, F = B - (B - y), D = y - F, V = N * D - (L - _ * F - N * F - _ * D), x = q - V, b = q - x, $t[0] = q - (x + b) + (b - V), P = X + x, b = P - X, R = X - (P - b) + (x - b), x = R - L, b = R - x, $t[1] = R - (x + b) + (b - L), U = P + x, b = U - P, $t[2] = P - (U - b) + (x - b), $t[3] = U, T = 4) : (ae[0] = 0, I = 1, $t[0] = 0, T = 1), u !== 0) {
      const st = Y(I, ae, u, it);
      c = lt(c, ht(
        Y(S, _e, u, W),
        W,
        Y(st, it, 2 * H, et),
        et,
        ct
      ), ct);
      const ot = Y(T, $t, u, z);
      c = lt(c, Mt(
        Y(ot, z, 2 * H, W),
        W,
        Y(ot, z, u, nt),
        nt,
        Y(st, it, u, et),
        et,
        Ft,
        vt
      ), vt), y !== 0 && (c = lt(c, Y(Y(4, kt, u, z), z, y, W), W)), p !== 0 && (c = lt(c, Y(Y(4, Et, -u, z), z, p, W), W));
    }
    if (m !== 0) {
      const st = Y(I, ae, m, it);
      c = lt(c, ht(
        Y(A, Ee, m, W),
        W,
        Y(st, it, 2 * J, et),
        et,
        ct
      ), ct);
      const ot = Y(T, $t, m, z);
      c = lt(c, Mt(
        Y(ot, z, 2 * J, W),
        W,
        Y(ot, z, m, nt),
        nt,
        Y(st, it, m, et),
        et,
        Ft,
        vt
      ), vt);
    }
  }
  if (f !== 0 || y !== 0) {
    if (d !== 0 || p !== 0 || u !== 0 || m !== 0 ? (X = d * J, B = j * d, _ = B - (B - d), N = d - _, B = j * J, F = B - (B - J), D = J - F, q = N * D - (X - _ * F - N * F - _ * D), L = G * m, B = j * G, _ = B - (B - G), N = G - _, B = j * m, F = B - (B - m), D = m - F, V = N * D - (L - _ * F - N * F - _ * D), x = q + V, b = x - q, mt[0] = q - (x - b) + (V - b), P = X + x, b = P - X, R = X - (P - b) + (x - b), x = R + L, b = x - R, mt[1] = R - (x - b) + (L - b), U = P + x, b = U - P, mt[2] = P - (U - b) + (x - b), mt[3] = U, C = -Q, $ = -p, X = u * C, B = j * u, _ = B - (B - u), N = u - _, B = j * C, F = B - (B - C), D = C - F, q = N * D - (X - _ * F - N * F - _ * D), L = H * $, B = j * H, _ = B - (B - H), N = H - _, B = j * $, F = B - (B - $), D = $ - F, V = N * D - (L - _ * F - N * F - _ * D), x = q + V, b = x - q, wt[0] = q - (x - b) + (V - b), P = X + x, b = P - X, R = X - (P - b) + (x - b), x = R + L, b = x - R, wt[1] = R - (x - b) + (L - b), U = P + x, b = U - P, wt[2] = P - (U - b) + (x - b), wt[3] = U, k = ht(4, mt, 4, wt, ce), X = d * m, B = j * d, _ = B - (B - d), N = d - _, B = j * m, F = B - (B - m), D = m - F, q = N * D - (X - _ * F - N * F - _ * D), L = u * p, B = j * u, _ = B - (B - u), N = u - _, B = j * p, F = B - (B - p), D = p - F, V = N * D - (L - _ * F - N * F - _ * D), x = q - V, b = q - x, Xt[0] = q - (x + b) + (b - V), P = X + x, b = P - X, R = X - (P - b) + (x - b), x = R - L, b = R - x, Xt[1] = R - (x + b) + (b - L), U = P + x, b = U - P, Xt[2] = P - (U - b) + (x - b), Xt[3] = U, O = 4) : (ce[0] = 0, k = 1, Xt[0] = 0, O = 1), f !== 0) {
      const st = Y(k, ce, f, it);
      c = lt(c, ht(
        Y(g, ke, f, W),
        W,
        Y(st, it, 2 * K, et),
        et,
        ct
      ), ct);
      const ot = Y(O, Xt, f, z);
      c = lt(c, Mt(
        Y(ot, z, 2 * K, W),
        W,
        Y(ot, z, f, nt),
        nt,
        Y(st, it, f, et),
        et,
        Ft,
        vt
      ), vt), p !== 0 && (c = lt(c, Y(Y(4, _t, f, z), z, p, W), W)), m !== 0 && (c = lt(c, Y(Y(4, kt, -f, z), z, m, W), W));
    }
    if (y !== 0) {
      const st = Y(k, ce, y, it);
      c = lt(c, ht(
        Y(w, Ae, y, W),
        W,
        Y(st, it, 2 * Z, et),
        et,
        ct
      ), ct);
      const ot = Y(O, Xt, y, z);
      c = lt(c, Mt(
        Y(ot, z, 2 * Z, W),
        W,
        Y(ot, z, y, nt),
        nt,
        Y(st, it, y, et),
        et,
        Ft,
        vt
      ), vt);
    }
  }
  if (d !== 0 || p !== 0) {
    if (u !== 0 || m !== 0 || f !== 0 || y !== 0 ? (X = u * Z, B = j * u, _ = B - (B - u), N = u - _, B = j * Z, F = B - (B - Z), D = Z - F, q = N * D - (X - _ * F - N * F - _ * D), L = H * y, B = j * H, _ = B - (B - H), N = H - _, B = j * y, F = B - (B - y), D = y - F, V = N * D - (L - _ * F - N * F - _ * D), x = q + V, b = x - q, mt[0] = q - (x - b) + (V - b), P = X + x, b = P - X, R = X - (P - b) + (x - b), x = R + L, b = x - R, mt[1] = R - (x - b) + (L - b), U = P + x, b = U - P, mt[2] = P - (U - b) + (x - b), mt[3] = U, C = -J, $ = -m, X = f * C, B = j * f, _ = B - (B - f), N = f - _, B = j * C, F = B - (B - C), D = C - F, q = N * D - (X - _ * F - N * F - _ * D), L = K * $, B = j * K, _ = B - (B - K), N = K - _, B = j * $, F = B - (B - $), D = $ - F, V = N * D - (L - _ * F - N * F - _ * D), x = q + V, b = x - q, wt[0] = q - (x - b) + (V - b), P = X + x, b = P - X, R = X - (P - b) + (x - b), x = R + L, b = x - R, wt[1] = R - (x - b) + (L - b), U = P + x, b = U - P, wt[2] = P - (U - b) + (x - b), wt[3] = U, M = ht(4, mt, 4, wt, oe), X = u * y, B = j * u, _ = B - (B - u), N = u - _, B = j * y, F = B - (B - y), D = y - F, q = N * D - (X - _ * F - N * F - _ * D), L = f * m, B = j * f, _ = B - (B - f), N = f - _, B = j * m, F = B - (B - m), D = m - F, V = N * D - (L - _ * F - N * F - _ * D), x = q - V, b = q - x, Rt[0] = q - (x + b) + (b - V), P = X + x, b = P - X, R = X - (P - b) + (x - b), x = R - L, b = R - x, Rt[1] = R - (x + b) + (b - L), U = P + x, b = U - P, Rt[2] = P - (U - b) + (x - b), Rt[3] = U, E = 4) : (oe[0] = 0, M = 1, Rt[0] = 0, E = 1), d !== 0) {
      const st = Y(M, oe, d, it);
      c = lt(c, ht(
        Y(h, Ie, d, W),
        W,
        Y(st, it, 2 * G, et),
        et,
        ct
      ), ct);
      const ot = Y(E, Rt, d, z);
      c = lt(c, Mt(
        Y(ot, z, 2 * G, W),
        W,
        Y(ot, z, d, nt),
        nt,
        Y(st, it, d, et),
        et,
        Ft,
        vt
      ), vt), m !== 0 && (c = lt(c, Y(Y(4, Et, d, z), z, m, W), W)), y !== 0 && (c = lt(c, Y(Y(4, _t, -d, z), z, y, W), W));
    }
    if (p !== 0) {
      const st = Y(M, oe, p, it);
      c = lt(c, ht(
        Y(v, Be, p, W),
        W,
        Y(st, it, 2 * Q, et),
        et,
        ct
      ), ct);
      const ot = Y(E, Rt, p, z);
      c = lt(c, Mt(
        Y(ot, z, 2 * Q, W),
        W,
        Y(ot, z, p, nt),
        nt,
        Y(st, it, p, et),
        et,
        Ft,
        vt
      ), vt);
    }
  }
  return Kt[c - 1];
}
function li(i, t, e, n, o, r, s, a) {
  const l = i - s, c = e - s, u = o - s, f = t - a, d = n - a, m = r - a, y = c * m, p = u * d, S = l * l + f * f, A = u * f, g = l * m, w = c * c + d * d, h = l * d, v = c * f, M = u * u + m * m, I = S * (y - p) + w * (A - g) + M * (h - v), k = (Math.abs(y) + Math.abs(p)) * S + (Math.abs(A) + Math.abs(g)) * w + (Math.abs(h) + Math.abs(v)) * M, E = si * k;
  return I > E || -I > E ? I : ci(i, t, e, n, o, r, s, a, k);
}
function fi(i, t) {
  var e, n, o = 0, r, s, a, l, c, u, f, d = i[0], m = i[1], y = t.length;
  for (e = 0; e < y; e++) {
    n = 0;
    var p = t[e], S = p.length - 1;
    if (u = p[0], u[0] !== p[S][0] && u[1] !== p[S][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (s = u[0] - d, a = u[1] - m, n; n < S; n++) {
      if (f = p[n + 1], l = f[0] - d, c = f[1] - m, a === 0 && c === 0) {
        if (l <= 0 && s >= 0 || s <= 0 && l >= 0)
          return 0;
      } else if (c >= 0 && a <= 0 || c <= 0 && a >= 0) {
        if (r = ft(s, l, a, c, 0, 0), r === 0)
          return 0;
        (r > 0 && c > 0 && a <= 0 || r < 0 && c <= 0 && a > 0) && o++;
      }
      u = f, a = c, s = l;
    }
  }
  return o % 2 !== 0;
}
function Ge(i, t, e = {}) {
  if (!i)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const n = Zn(i), o = ti(t), r = o.type, s = t.bbox;
  let a = o.coordinates;
  if (s && ui(n, s) === !1)
    return !1;
  r === "Polygon" && (a = [a]);
  for (var l = 0; l < a.length; ++l) {
    const c = fi(n, a[l]);
    if (c === 0 && !e.ignoreBoundary) return !0;
    if (c) return !0;
  }
  return !1;
}
function ui(i, t) {
  return t[0] <= i[0] && t[1] <= i[1] && t[2] >= i[0] && t[3] >= i[1];
}
class Xe {
  constructor(t = [], e = hi) {
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
    const { data: e, compare: n } = this, o = e[t];
    for (; t > 0; ) {
      const r = t - 1 >> 1, s = e[r];
      if (n(o, s) >= 0) break;
      e[t] = s, t = r;
    }
    e[t] = o;
  }
  _down(t) {
    const { data: e, compare: n } = this, o = this.length >> 1, r = e[t];
    for (; t < o; ) {
      let s = (t << 1) + 1, a = e[s];
      const l = s + 1;
      if (l < this.length && n(e[l], a) < 0 && (s = l, a = e[l]), n(a, r) >= 0) break;
      e[t] = a, t = s;
    }
    e[t] = r;
  }
}
function hi(i, t) {
  return i < t ? -1 : i > t ? 1 : 0;
}
const di = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Xe
}, Symbol.toStringTag, { value: "Module" })), Bt = 11102230246251565e-32, dt = 134217729, pi = (3 + 8 * Bt) * Bt;
function Oe(i, t, e, n, o) {
  let r, s, a, l, c = t[0], u = n[0], f = 0, d = 0;
  u > c == u > -c ? (r = c, c = t[++f]) : (r = u, u = n[++d]);
  let m = 0;
  if (f < i && d < e)
    for (u > c == u > -c ? (s = c + r, a = r - (s - c), c = t[++f]) : (s = u + r, a = r - (s - u), u = n[++d]), r = s, a !== 0 && (o[m++] = a); f < i && d < e; )
      u > c == u > -c ? (s = r + c, l = s - r, a = r - (s - l) + (c - l), c = t[++f]) : (s = r + u, l = s - r, a = r - (s - l) + (u - l), u = n[++d]), r = s, a !== 0 && (o[m++] = a);
  for (; f < i; )
    s = r + c, l = s - r, a = r - (s - l) + (c - l), c = t[++f], r = s, a !== 0 && (o[m++] = a);
  for (; d < e; )
    s = r + u, l = s - r, a = r - (s - l) + (u - l), u = n[++d], r = s, a !== 0 && (o[m++] = a);
  return (r !== 0 || m === 0) && (o[m++] = r), m;
}
function gi(i, t) {
  let e = t[0];
  for (let n = 1; n < i; n++) e += t[n];
  return e;
}
function se(i) {
  return new Float64Array(i);
}
const mi = (3 + 16 * Bt) * Bt, wi = (2 + 12 * Bt) * Bt, yi = (9 + 64 * Bt) * Bt * Bt, Ut = se(4), Je = se(8), Qe = se(12), Ze = se(16), yt = se(4);
function vi(i, t, e, n, o, r, s) {
  let a, l, c, u, f, d, m, y, p, S, A, g, w, h, v, M, I, k;
  const E = i - o, T = e - o, O = t - r, C = n - r;
  h = E * C, d = dt * E, m = d - (d - E), y = E - m, d = dt * C, p = d - (d - C), S = C - p, v = y * S - (h - m * p - y * p - m * S), M = O * T, d = dt * O, m = d - (d - O), y = O - m, d = dt * T, p = d - (d - T), S = T - p, I = y * S - (M - m * p - y * p - m * S), A = v - I, f = v - A, Ut[0] = v - (A + f) + (f - I), g = h + A, f = g - h, w = h - (g - f) + (A - f), A = w - M, f = w - A, Ut[1] = w - (A + f) + (f - M), k = g + A, f = k - g, Ut[2] = g - (k - f) + (A - f), Ut[3] = k;
  let $ = gi(4, Ut), b = wi * s;
  if ($ >= b || -$ >= b || (f = i - E, a = i - (E + f) + (f - o), f = e - T, c = e - (T + f) + (f - o), f = t - O, l = t - (O + f) + (f - r), f = n - C, u = n - (C + f) + (f - r), a === 0 && l === 0 && c === 0 && u === 0) || (b = yi * s + pi * Math.abs($), $ += E * u + C * a - (O * c + T * l), $ >= b || -$ >= b)) return $;
  h = a * C, d = dt * a, m = d - (d - a), y = a - m, d = dt * C, p = d - (d - C), S = C - p, v = y * S - (h - m * p - y * p - m * S), M = l * T, d = dt * l, m = d - (d - l), y = l - m, d = dt * T, p = d - (d - T), S = T - p, I = y * S - (M - m * p - y * p - m * S), A = v - I, f = v - A, yt[0] = v - (A + f) + (f - I), g = h + A, f = g - h, w = h - (g - f) + (A - f), A = w - M, f = w - A, yt[1] = w - (A + f) + (f - M), k = g + A, f = k - g, yt[2] = g - (k - f) + (A - f), yt[3] = k;
  const B = Oe(4, Ut, 4, yt, Je);
  h = E * u, d = dt * E, m = d - (d - E), y = E - m, d = dt * u, p = d - (d - u), S = u - p, v = y * S - (h - m * p - y * p - m * S), M = O * c, d = dt * O, m = d - (d - O), y = O - m, d = dt * c, p = d - (d - c), S = c - p, I = y * S - (M - m * p - y * p - m * S), A = v - I, f = v - A, yt[0] = v - (A + f) + (f - I), g = h + A, f = g - h, w = h - (g - f) + (A - f), A = w - M, f = w - A, yt[1] = w - (A + f) + (f - M), k = g + A, f = k - g, yt[2] = g - (k - f) + (A - f), yt[3] = k;
  const _ = Oe(B, Je, 4, yt, Qe);
  h = a * u, d = dt * a, m = d - (d - a), y = a - m, d = dt * u, p = d - (d - u), S = u - p, v = y * S - (h - m * p - y * p - m * S), M = l * c, d = dt * l, m = d - (d - l), y = l - m, d = dt * c, p = d - (d - c), S = c - p, I = y * S - (M - m * p - y * p - m * S), A = v - I, f = v - A, yt[0] = v - (A + f) + (f - I), g = h + A, f = g - h, w = h - (g - f) + (A - f), A = w - M, f = w - A, yt[1] = w - (A + f) + (f - M), k = g + A, f = k - g, yt[2] = g - (k - f) + (A - f), yt[3] = k;
  const N = Oe(_, Qe, 4, yt, Ze);
  return Ze[N - 1];
}
function tn(i, t, e, n, o, r) {
  const s = (t - r) * (e - o), a = (i - o) * (n - r), l = s - a;
  if (s === 0 || a === 0 || s > 0 != a > 0) return l;
  const c = Math.abs(s + a);
  return Math.abs(l) >= mi * c ? l : -vi(i, t, e, n, o, r, c);
}
function bi(i, t) {
  const e = new Xe([], Rn);
  return Si(i, e), Mi(e, t);
}
function Rn(i, t) {
  return i.p.x > t.p.x ? 1 : i.p.x < t.p.x || i.p.x === t.p.x && (i.featureId !== t.featureId || i.ringId !== t.ringId) && i.isLeftEndpoint && !t.isLeftEndpoint ? -1 : i.p.y !== t.p.y ? i.p.y > t.p.y ? 1 : -1 : 1;
}
function xi(i, t) {
  return i.rightSweepEvent.p.x > t.rightSweepEvent.p.x ? 1 : i.rightSweepEvent.p.x < t.rightSweepEvent.p.x ? -1 : i.rightSweepEvent.p.y !== t.rightSweepEvent.p.y ? i.rightSweepEvent.p.y < t.rightSweepEvent.p.y ? 1 : -1 : 1;
}
function Si(i, t) {
  if (i.type === "FeatureCollection") {
    const e = i.features;
    for (let n = 0; n < e.length; n++)
      en(e[n], t);
  } else
    en(i, t);
}
var le = 0, fe = 0, ue = 0;
function en(i, t) {
  const e = i.type === "Feature" ? i.geometry : i;
  let n = e.coordinates;
  (e.type === "Polygon" || e.type === "MultiLineString") && (n = [n]), e.type === "LineString" && (n = [[n]]);
  for (let o = 0; o < n.length; o++)
    for (let r = 0; r < n[o].length; r++) {
      let s = n[o][r][0], a = null;
      fe = fe + 1;
      for (let l = 0; l < n[o][r].length - 1; l++) {
        a = n[o][r][l + 1];
        const c = new nn(s, le, fe, ue), u = new nn(a, le, fe, ue + 1);
        c.otherEvent = u, u.otherEvent = c, Rn(c, u) > 0 ? (u.isLeftEndpoint = !0, c.isLeftEndpoint = !1) : (c.isLeftEndpoint = !0, u.isLeftEndpoint = !1), t.push(c), t.push(u), s = a, ue = ue + 1;
      }
    }
  le = le + 1;
}
var nn = class {
  constructor(i, t, e, n) {
    this.p = {
      x: i[0],
      y: i[1]
    }, this.featureId = t, this.ringId = e, this.eventId = n, this.otherEvent = null, this.isLeftEndpoint = null;
  }
  isSamePoint(i) {
    return this.p.x === i.p.x && this.p.y === i.p.y;
  }
  asNewXY() {
    return [this.p.x, this.p.y];
  }
};
function Mi(i, t = !1) {
  const e = [], n = new Xe([], xi);
  for (; i.length; ) {
    const o = i.pop();
    if (o.isLeftEndpoint) {
      const r = new _i(o);
      for (let s = 0; s < n.data.length; s++) {
        const a = n.data[s];
        if (t && a.leftSweepEvent.featureId === o.featureId)
          continue;
        const l = Ei(r, a);
        l !== !1 && e.push(l);
      }
      n.push(r);
    } else o.isLeftEndpoint === !1 && n.pop();
  }
  return e;
}
var _i = class {
  /** @param event must have otherEvent non-null */
  constructor(i) {
    this.leftSweepEvent = i, this.rightSweepEvent = i.otherEvent;
  }
};
function Ei(i, t) {
  if (i === null || t === null) return !1;
  const e = i.leftSweepEvent.p.x, n = i.leftSweepEvent.p.y, o = i.rightSweepEvent.p.x, r = i.rightSweepEvent.p.y, s = t.leftSweepEvent.p.x, a = t.leftSweepEvent.p.y, l = t.rightSweepEvent.p.x, c = t.rightSweepEvent.p.y, u = tn(e, n, o, r, s, a), f = tn(e, n, o, r, l, c);
  if (u > 0 && f > 0) return !1;
  if (u < 0 && f < 0) return !1;
  if (i.leftSweepEvent.ringId === t.leftSweepEvent.ringId) {
    if (i.rightSweepEvent.isSamePoint(t.leftSweepEvent) || i.rightSweepEvent.isSamePoint(t.rightSweepEvent) || i.leftSweepEvent.isSamePoint(t.leftSweepEvent) || i.leftSweepEvent.isSamePoint(t.rightSweepEvent))
      return !1;
  } else {
    if (i.rightSweepEvent.isSamePoint(t.leftSweepEvent))
      return t.leftSweepEvent.asNewXY();
    if (i.rightSweepEvent.isSamePoint(t.rightSweepEvent))
      return t.rightSweepEvent.asNewXY();
    if (i.leftSweepEvent.isSamePoint(t.leftSweepEvent))
      return t.leftSweepEvent.asNewXY();
    if (i.leftSweepEvent.isSamePoint(t.rightSweepEvent))
      return t.rightSweepEvent.asNewXY();
  }
  const d = (c - a) * (o - e) - (l - s) * (r - n), m = (l - s) * (n - a) - (c - a) * (e - s), y = (o - e) * (n - a) - (r - n) * (e - s);
  if (d === 0)
    return !1;
  const p = m / d, S = y / d;
  if (p >= 0 && p <= 1 && S >= 0 && S <= 1) {
    const A = e + p * (o - e), g = n + p * (r - n);
    return [A, g];
  }
  return !1;
}
function ki(i, t, e = {}) {
  const { removeDuplicates: n = !0, ignoreSelfIntersections: o = !0 } = e;
  let r = [];
  i.type === "FeatureCollection" ? r = r.concat(i.features) : i.type === "Feature" ? r.push(i) : (i.type === "LineString" || i.type === "Polygon" || i.type === "MultiLineString" || i.type === "MultiPolygon") && r.push(ee(i)), t.type === "FeatureCollection" ? r = r.concat(t.features) : t.type === "Feature" ? r.push(t) : (t.type === "LineString" || t.type === "Polygon" || t.type === "MultiLineString" || t.type === "MultiPolygon") && r.push(ee(t));
  const s = bi(
    xt(r),
    o
  );
  let a = [];
  if (n) {
    const l = {};
    s.forEach((c) => {
      const u = c.join(",");
      l[u] || (l[u] = !0, a.push(c));
    });
  } else
    a = s;
  return xt(a.map((l) => Yt(l)));
}
function Ai(i) {
  return i && i.__esModule && Object.prototype.hasOwnProperty.call(i, "default") ? i.default : i;
}
function Ii(i) {
  if (Object.prototype.hasOwnProperty.call(i, "__esModule")) return i;
  var t = i.default;
  if (typeof t == "function") {
    var e = function n() {
      var o = !1;
      try {
        o = this instanceof n;
      } catch {
      }
      return o ? Reflect.construct(t, arguments, this.constructor) : t.apply(this, arguments);
    };
    e.prototype = t.prototype;
  } else e = {};
  return Object.defineProperty(e, "__esModule", { value: !0 }), Object.keys(i).forEach(function(n) {
    var o = Object.getOwnPropertyDescriptor(i, n);
    Object.defineProperty(e, n, o.get ? o : {
      enumerable: !0,
      get: function() {
        return i[n];
      }
    });
  }), e;
}
function Bi(i, t = {}) {
  let e = 0, n = 0, o = 0;
  return $e(
    i,
    function(r) {
      e += r[0], n += r[1], o++;
    },
    !0
  ), Yt([e / o, n / o], t.properties);
}
var he = { exports: {} }, ye = { exports: {} }, Ti = ye.exports, rn;
function Oi() {
  return rn || (rn = 1, (function(i, t) {
    (function(e, n) {
      i.exports = n();
    })(Ti, function() {
      function e(g, w, h, v, M) {
        (function I(k, E, T, O, C) {
          for (; O > T; ) {
            if (O - T > 600) {
              var $ = O - T + 1, b = E - T + 1, B = Math.log($), _ = 0.5 * Math.exp(2 * B / 3), N = 0.5 * Math.sqrt(B * _ * ($ - _) / $) * (b - $ / 2 < 0 ? -1 : 1), F = Math.max(T, Math.floor(E - b * _ / $ + N)), D = Math.min(O, Math.floor(E + ($ - b) * _ / $ + N));
              I(k, E, F, D, C);
            }
            var x = k[E], P = T, R = O;
            for (n(k, T, E), C(k[O], x) > 0 && n(k, T, O); P < R; ) {
              for (n(k, P, R), P++, R--; C(k[P], x) < 0; ) P++;
              for (; C(k[R], x) > 0; ) R--;
            }
            C(k[T], x) === 0 ? n(k, T, R) : n(k, ++R, O), R <= E && (T = R + 1), E <= R && (O = R - 1);
          }
        })(g, w, h || 0, v || g.length - 1, M || o);
      }
      function n(g, w, h) {
        var v = g[w];
        g[w] = g[h], g[h] = v;
      }
      function o(g, w) {
        return g < w ? -1 : g > w ? 1 : 0;
      }
      var r = function(g) {
        g === void 0 && (g = 9), this._maxEntries = Math.max(4, g), this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries)), this.clear();
      };
      function s(g, w, h) {
        if (!h) return w.indexOf(g);
        for (var v = 0; v < w.length; v++) if (h(g, w[v])) return v;
        return -1;
      }
      function a(g, w) {
        l(g, 0, g.children.length, w, g);
      }
      function l(g, w, h, v, M) {
        M || (M = S(null)), M.minX = 1 / 0, M.minY = 1 / 0, M.maxX = -1 / 0, M.maxY = -1 / 0;
        for (var I = w; I < h; I++) {
          var k = g.children[I];
          c(M, g.leaf ? v(k) : k);
        }
        return M;
      }
      function c(g, w) {
        return g.minX = Math.min(g.minX, w.minX), g.minY = Math.min(g.minY, w.minY), g.maxX = Math.max(g.maxX, w.maxX), g.maxY = Math.max(g.maxY, w.maxY), g;
      }
      function u(g, w) {
        return g.minX - w.minX;
      }
      function f(g, w) {
        return g.minY - w.minY;
      }
      function d(g) {
        return (g.maxX - g.minX) * (g.maxY - g.minY);
      }
      function m(g) {
        return g.maxX - g.minX + (g.maxY - g.minY);
      }
      function y(g, w) {
        return g.minX <= w.minX && g.minY <= w.minY && w.maxX <= g.maxX && w.maxY <= g.maxY;
      }
      function p(g, w) {
        return w.minX <= g.maxX && w.minY <= g.maxY && w.maxX >= g.minX && w.maxY >= g.minY;
      }
      function S(g) {
        return { children: g, height: 1, leaf: !0, minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
      }
      function A(g, w, h, v, M) {
        for (var I = [w, h]; I.length; ) if (!((h = I.pop()) - (w = I.pop()) <= v)) {
          var k = w + Math.ceil((h - w) / v / 2) * v;
          e(g, k, w, h, M), I.push(w, k, k, h);
        }
      }
      return r.prototype.all = function() {
        return this._all(this.data, []);
      }, r.prototype.search = function(g) {
        var w = this.data, h = [];
        if (!p(g, w)) return h;
        for (var v = this.toBBox, M = []; w; ) {
          for (var I = 0; I < w.children.length; I++) {
            var k = w.children[I], E = w.leaf ? v(k) : k;
            p(g, E) && (w.leaf ? h.push(k) : y(g, E) ? this._all(k, h) : M.push(k));
          }
          w = M.pop();
        }
        return h;
      }, r.prototype.collides = function(g) {
        var w = this.data;
        if (!p(g, w)) return !1;
        for (var h = []; w; ) {
          for (var v = 0; v < w.children.length; v++) {
            var M = w.children[v], I = w.leaf ? this.toBBox(M) : M;
            if (p(g, I)) {
              if (w.leaf || y(g, I)) return !0;
              h.push(M);
            }
          }
          w = h.pop();
        }
        return !1;
      }, r.prototype.load = function(g) {
        if (!g || !g.length) return this;
        if (g.length < this._minEntries) {
          for (var w = 0; w < g.length; w++) this.insert(g[w]);
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
      }, r.prototype.insert = function(g) {
        return g && this._insert(g, this.data.height - 1), this;
      }, r.prototype.clear = function() {
        return this.data = S([]), this;
      }, r.prototype.remove = function(g, w) {
        if (!g) return this;
        for (var h, v, M, I = this.data, k = this.toBBox(g), E = [], T = []; I || E.length; ) {
          if (I || (I = E.pop(), v = E[E.length - 1], h = T.pop(), M = !0), I.leaf) {
            var O = s(g, I.children, w);
            if (O !== -1) return I.children.splice(O, 1), E.push(I), this._condense(E), this;
          }
          M || I.leaf || !y(I, k) ? v ? (h++, I = v.children[h], M = !1) : I = null : (E.push(I), T.push(h), h = 0, v = I, I = I.children[0]);
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
        for (var h = []; g; ) g.leaf ? w.push.apply(w, g.children) : h.push.apply(h, g.children), g = h.pop();
        return w;
      }, r.prototype._build = function(g, w, h, v) {
        var M, I = h - w + 1, k = this._maxEntries;
        if (I <= k) return a(M = S(g.slice(w, h + 1)), this.toBBox), M;
        v || (v = Math.ceil(Math.log(I) / Math.log(k)), k = Math.ceil(I / Math.pow(k, v - 1))), (M = S([])).leaf = !1, M.height = v;
        var E = Math.ceil(I / k), T = E * Math.ceil(Math.sqrt(k));
        A(g, w, h, T, this.compareMinX);
        for (var O = w; O <= h; O += T) {
          var C = Math.min(O + T - 1, h);
          A(g, O, C, E, this.compareMinY);
          for (var $ = O; $ <= C; $ += E) {
            var b = Math.min($ + E - 1, C);
            M.children.push(this._build(g, $, b, v - 1));
          }
        }
        return a(M, this.toBBox), M;
      }, r.prototype._chooseSubtree = function(g, w, h, v) {
        for (; v.push(w), !w.leaf && v.length - 1 !== h; ) {
          for (var M = 1 / 0, I = 1 / 0, k = void 0, E = 0; E < w.children.length; E++) {
            var T = w.children[E], O = d(T), C = ($ = g, b = T, (Math.max(b.maxX, $.maxX) - Math.min(b.minX, $.minX)) * (Math.max(b.maxY, $.maxY) - Math.min(b.minY, $.minY)) - O);
            C < I ? (I = C, M = O < M ? O : M, k = T) : C === I && O < M && (M = O, k = T);
          }
          w = k || w.children[0];
        }
        var $, b;
        return w;
      }, r.prototype._insert = function(g, w, h) {
        var v = h ? g : this.toBBox(g), M = [], I = this._chooseSubtree(v, this.data, w, M);
        for (I.children.push(g), c(I, v); w >= 0 && M[w].children.length > this._maxEntries; ) this._split(M, w), w--;
        this._adjustParentBBoxes(v, M, w);
      }, r.prototype._split = function(g, w) {
        var h = g[w], v = h.children.length, M = this._minEntries;
        this._chooseSplitAxis(h, M, v);
        var I = this._chooseSplitIndex(h, M, v), k = S(h.children.splice(I, h.children.length - I));
        k.height = h.height, k.leaf = h.leaf, a(h, this.toBBox), a(k, this.toBBox), w ? g[w - 1].children.push(k) : this._splitRoot(h, k);
      }, r.prototype._splitRoot = function(g, w) {
        this.data = S([g, w]), this.data.height = g.height + 1, this.data.leaf = !1, a(this.data, this.toBBox);
      }, r.prototype._chooseSplitIndex = function(g, w, h) {
        for (var v, M, I, k, E, T, O, C = 1 / 0, $ = 1 / 0, b = w; b <= h - w; b++) {
          var B = l(g, 0, b, this.toBBox), _ = l(g, b, h, this.toBBox), N = (M = B, I = _, k = void 0, E = void 0, T = void 0, O = void 0, k = Math.max(M.minX, I.minX), E = Math.max(M.minY, I.minY), T = Math.min(M.maxX, I.maxX), O = Math.min(M.maxY, I.maxY), Math.max(0, T - k) * Math.max(0, O - E)), F = d(B) + d(_);
          N < C ? (C = N, v = b, $ = F < $ ? F : $) : N === C && F < $ && ($ = F, v = b);
        }
        return v || h - w;
      }, r.prototype._chooseSplitAxis = function(g, w, h) {
        var v = g.leaf ? this.compareMinX : u, M = g.leaf ? this.compareMinY : f;
        this._allDistMargin(g, w, h, v) < this._allDistMargin(g, w, h, M) && g.children.sort(v);
      }, r.prototype._allDistMargin = function(g, w, h, v) {
        g.children.sort(v);
        for (var M = this.toBBox, I = l(g, 0, w, M), k = l(g, h - w, h, M), E = m(I) + m(k), T = w; T < h - w; T++) {
          var O = g.children[T];
          c(I, g.leaf ? M(O) : O), E += m(I);
        }
        for (var C = h - w - 1; C >= w; C--) {
          var $ = g.children[C];
          c(k, g.leaf ? M($) : $), E += m(k);
        }
        return E;
      }, r.prototype._adjustParentBBoxes = function(g, w, h) {
        for (var v = h; v >= 0; v--) c(w[v], g);
      }, r.prototype._condense = function(g) {
        for (var w = g.length - 1, h = void 0; w >= 0; w--) g[w].children.length === 0 ? w > 0 ? (h = g[w - 1].children).splice(h.indexOf(g[w]), 1) : this.clear() : a(g[w], this.toBBox);
      }, r;
    });
  })(ye)), ye.exports;
}
const Ni = /* @__PURE__ */ Ii(di);
var Wt = { exports: {} }, Ne, sn;
function Pi() {
  return sn || (sn = 1, Ne = function(t, e, n, o) {
    var r = t[0], s = t[1], a = !1;
    n === void 0 && (n = 0), o === void 0 && (o = e.length);
    for (var l = (o - n) / 2, c = 0, u = l - 1; c < l; u = c++) {
      var f = e[n + c * 2 + 0], d = e[n + c * 2 + 1], m = e[n + u * 2 + 0], y = e[n + u * 2 + 1], p = d > s != y > s && r < (m - f) * (s - d) / (y - d) + f;
      p && (a = !a);
    }
    return a;
  }), Ne;
}
var Pe, on;
function Fi() {
  return on || (on = 1, Pe = function(t, e, n, o) {
    var r = t[0], s = t[1], a = !1;
    n === void 0 && (n = 0), o === void 0 && (o = e.length);
    for (var l = o - n, c = 0, u = l - 1; c < l; u = c++) {
      var f = e[c + n][0], d = e[c + n][1], m = e[u + n][0], y = e[u + n][1], p = d > s != y > s && r < (m - f) * (s - d) / (y - d) + f;
      p && (a = !a);
    }
    return a;
  }), Pe;
}
var an;
function Ci() {
  if (an) return Wt.exports;
  an = 1;
  var i = Pi(), t = Fi();
  return Wt.exports = function(n, o, r, s) {
    return o.length > 0 && Array.isArray(o[0]) ? t(n, o, r, s) : i(n, o, r, s);
  }, Wt.exports.nested = t, Wt.exports.flat = i, Wt.exports;
}
var Jt = { exports: {} }, Di = Jt.exports, cn;
function Ri() {
  return cn || (cn = 1, (function(i, t) {
    (function(e, n) {
      n(t);
    })(Di, function(e) {
      const o = 33306690738754706e-32;
      function r(p, S, A, g, w) {
        let h, v, M, I, k = S[0], E = g[0], T = 0, O = 0;
        E > k == E > -k ? (h = k, k = S[++T]) : (h = E, E = g[++O]);
        let C = 0;
        if (T < p && O < A) for (E > k == E > -k ? (M = h - ((v = k + h) - k), k = S[++T]) : (M = h - ((v = E + h) - E), E = g[++O]), h = v, M !== 0 && (w[C++] = M); T < p && O < A; ) E > k == E > -k ? (M = h - ((v = h + k) - (I = v - h)) + (k - I), k = S[++T]) : (M = h - ((v = h + E) - (I = v - h)) + (E - I), E = g[++O]), h = v, M !== 0 && (w[C++] = M);
        for (; T < p; ) M = h - ((v = h + k) - (I = v - h)) + (k - I), k = S[++T], h = v, M !== 0 && (w[C++] = M);
        for (; O < A; ) M = h - ((v = h + E) - (I = v - h)) + (E - I), E = g[++O], h = v, M !== 0 && (w[C++] = M);
        return h === 0 && C !== 0 || (w[C++] = h), C;
      }
      function s(p) {
        return new Float64Array(p);
      }
      const a = 33306690738754716e-32, l = 22204460492503146e-32, c = 11093356479670487e-47, u = s(4), f = s(8), d = s(12), m = s(16), y = s(4);
      e.orient2d = function(p, S, A, g, w, h) {
        const v = (S - h) * (A - w), M = (p - w) * (g - h), I = v - M;
        if (v === 0 || M === 0 || v > 0 != M > 0) return I;
        const k = Math.abs(v + M);
        return Math.abs(I) >= a * k ? I : -(function(E, T, O, C, $, b, B) {
          let _, N, F, D, x, P, R, X, q, L, V, U, H, K, G, J, Z, Q;
          const at = E - $, ut = O - $, st = T - b, ot = C - b;
          x = (G = (X = at - (R = (P = 134217729 * at) - (P - at))) * (L = ot - (q = (P = 134217729 * ot) - (P - ot))) - ((K = at * ot) - R * q - X * q - R * L)) - (V = G - (Z = (X = st - (R = (P = 134217729 * st) - (P - st))) * (L = ut - (q = (P = 134217729 * ut) - (P - ut))) - ((J = st * ut) - R * q - X * q - R * L))), u[0] = G - (V + x) + (x - Z), x = (H = K - ((U = K + V) - (x = U - K)) + (V - x)) - (V = H - J), u[1] = H - (V + x) + (x - J), x = (Q = U + V) - U, u[2] = U - (Q - x) + (V - x), u[3] = Q;
          let Tt = (function(Hn, qe) {
            let Ue = qe[0];
            for (let Se = 1; Se < Hn; Se++) Ue += qe[Se];
            return Ue;
          })(4, u), Ht = l * B;
          if (Tt >= Ht || -Tt >= Ht || (_ = E - (at + (x = E - at)) + (x - $), F = O - (ut + (x = O - ut)) + (x - $), N = T - (st + (x = T - st)) + (x - b), D = C - (ot + (x = C - ot)) + (x - b), _ === 0 && N === 0 && F === 0 && D === 0) || (Ht = c * B + o * Math.abs(Tt), (Tt += at * D + ot * _ - (st * F + ut * N)) >= Ht || -Tt >= Ht)) return Tt;
          x = (G = (X = _ - (R = (P = 134217729 * _) - (P - _))) * (L = ot - (q = (P = 134217729 * ot) - (P - ot))) - ((K = _ * ot) - R * q - X * q - R * L)) - (V = G - (Z = (X = N - (R = (P = 134217729 * N) - (P - N))) * (L = ut - (q = (P = 134217729 * ut) - (P - ut))) - ((J = N * ut) - R * q - X * q - R * L))), y[0] = G - (V + x) + (x - Z), x = (H = K - ((U = K + V) - (x = U - K)) + (V - x)) - (V = H - J), y[1] = H - (V + x) + (x - J), x = (Q = U + V) - U, y[2] = U - (Q - x) + (V - x), y[3] = Q;
          const jn = r(4, u, 4, y, f);
          x = (G = (X = at - (R = (P = 134217729 * at) - (P - at))) * (L = D - (q = (P = 134217729 * D) - (P - D))) - ((K = at * D) - R * q - X * q - R * L)) - (V = G - (Z = (X = st - (R = (P = 134217729 * st) - (P - st))) * (L = F - (q = (P = 134217729 * F) - (P - F))) - ((J = st * F) - R * q - X * q - R * L))), y[0] = G - (V + x) + (x - Z), x = (H = K - ((U = K + V) - (x = U - K)) + (V - x)) - (V = H - J), y[1] = H - (V + x) + (x - J), x = (Q = U + V) - U, y[2] = U - (Q - x) + (V - x), y[3] = Q;
          const zn = r(jn, f, 4, y, d);
          x = (G = (X = _ - (R = (P = 134217729 * _) - (P - _))) * (L = D - (q = (P = 134217729 * D) - (P - D))) - ((K = _ * D) - R * q - X * q - R * L)) - (V = G - (Z = (X = N - (R = (P = 134217729 * N) - (P - N))) * (L = F - (q = (P = 134217729 * F) - (P - F))) - ((J = N * F) - R * q - X * q - R * L))), y[0] = G - (V + x) + (x - Z), x = (H = K - ((U = K + V) - (x = U - K)) + (V - x)) - (V = H - J), y[1] = H - (V + x) + (x - J), x = (Q = U + V) - U, y[2] = U - (Q - x) + (V - x), y[3] = Q;
          const Kn = r(zn, d, 4, y, m);
          return m[Kn - 1];
        })(p, S, A, g, w, h, k);
      }, e.orient2dfast = function(p, S, A, g, w, h) {
        return (S - h) * (A - w) - (p - w) * (g - h);
      }, Object.defineProperty(e, "__esModule", { value: !0 });
    });
  })(Jt, Jt.exports)), Jt.exports;
}
var ln;
function $i() {
  if (ln) return he.exports;
  ln = 1;
  var i = Oi(), t = Ni, e = Ci(), n = Ri().orient2d;
  t.default && (t = t.default), he.exports = o, he.exports.default = o;
  function o(h, v, M) {
    v = Math.max(0, v === void 0 ? 2 : v), M = M || 0;
    var I = m(h), k = new i(16);
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
    for (var E = [], T = 0, O; T < I.length; T++) {
      var C = I[T];
      k.remove(C), O = y(C, O), E.push(O);
    }
    var $ = new i(16);
    for (T = 0; T < E.length; T++) $.insert(d(E[T]));
    for (var b = v * v, B = M * M; E.length; ) {
      var _ = E.shift(), N = _.p, F = _.next.p, D = p(N, F);
      if (!(D < B)) {
        var x = D / b;
        C = r(k, _.prev.p, N, F, _.next.next.p, x, $), C && Math.min(p(C, N), p(C, F)) <= x && (E.push(_), E.push(y(C, _)), k.remove(C), $.remove(_), $.insert(d(_)), $.insert(d(_.next)));
      }
    }
    _ = O;
    var P = [];
    do
      P.push(_.p), _ = _.next;
    while (_ !== O);
    return P.push(_.p), P;
  }
  function r(h, v, M, I, k, E, T) {
    for (var O = new t([], s), C = h.data; C; ) {
      for (var $ = 0; $ < C.children.length; $++) {
        var b = C.children[$], B = C.leaf ? S(b, M, I) : a(M, I, b);
        B > E || O.push({
          node: b,
          dist: B
        });
      }
      for (; O.length && !O.peek().node.children; ) {
        var _ = O.pop(), N = _.node, F = S(N, v, M), D = S(N, I, k);
        if (_.dist < F && _.dist < D && c(M, N, T) && c(I, N, T)) return N;
      }
      C = O.pop(), C && (C = C.node);
    }
    return null;
  }
  function s(h, v) {
    return h.dist - v.dist;
  }
  function a(h, v, M) {
    if (l(h, M) || l(v, M)) return 0;
    var I = A(h[0], h[1], v[0], v[1], M.minX, M.minY, M.maxX, M.minY);
    if (I === 0) return 0;
    var k = A(h[0], h[1], v[0], v[1], M.minX, M.minY, M.minX, M.maxY);
    if (k === 0) return 0;
    var E = A(h[0], h[1], v[0], v[1], M.maxX, M.minY, M.maxX, M.maxY);
    if (E === 0) return 0;
    var T = A(h[0], h[1], v[0], v[1], M.minX, M.maxY, M.maxX, M.maxY);
    return T === 0 ? 0 : Math.min(I, k, E, T);
  }
  function l(h, v) {
    return h[0] >= v.minX && h[0] <= v.maxX && h[1] >= v.minY && h[1] <= v.maxY;
  }
  function c(h, v, M) {
    for (var I = Math.min(h[0], v[0]), k = Math.min(h[1], v[1]), E = Math.max(h[0], v[0]), T = Math.max(h[1], v[1]), O = M.search({ minX: I, minY: k, maxX: E, maxY: T }), C = 0; C < O.length; C++)
      if (f(O[C].p, O[C].next.p, h, v)) return !1;
    return !0;
  }
  function u(h, v, M) {
    return n(h[0], h[1], v[0], v[1], M[0], M[1]);
  }
  function f(h, v, M, I) {
    return h !== I && v !== M && u(h, v, M) > 0 != u(h, v, I) > 0 && u(M, I, h) > 0 != u(M, I, v) > 0;
  }
  function d(h) {
    var v = h.p, M = h.next.p;
    return h.minX = Math.min(v[0], M[0]), h.minY = Math.min(v[1], M[1]), h.maxX = Math.max(v[0], M[0]), h.maxY = Math.max(v[1], M[1]), h;
  }
  function m(h) {
    for (var v = h[0], M = h[0], I = h[0], k = h[0], E = 0; E < h.length; E++) {
      var T = h[E];
      T[0] < v[0] && (v = T), T[0] > I[0] && (I = T), T[1] < M[1] && (M = T), T[1] > k[1] && (k = T);
    }
    var O = [v, M, I, k], C = O.slice();
    for (E = 0; E < h.length; E++)
      e(h[E], O) || C.push(h[E]);
    return w(C);
  }
  function y(h, v) {
    var M = {
      p: h,
      prev: null,
      next: null,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };
    return v ? (M.next = v.next, M.prev = v, v.next.prev = M, v.next = M) : (M.prev = M, M.next = M), M;
  }
  function p(h, v) {
    var M = h[0] - v[0], I = h[1] - v[1];
    return M * M + I * I;
  }
  function S(h, v, M) {
    var I = v[0], k = v[1], E = M[0] - I, T = M[1] - k;
    if (E !== 0 || T !== 0) {
      var O = ((h[0] - I) * E + (h[1] - k) * T) / (E * E + T * T);
      O > 1 ? (I = M[0], k = M[1]) : O > 0 && (I += E * O, k += T * O);
    }
    return E = h[0] - I, T = h[1] - k, E * E + T * T;
  }
  function A(h, v, M, I, k, E, T, O) {
    var C = M - h, $ = I - v, b = T - k, B = O - E, _ = h - k, N = v - E, F = C * C + $ * $, D = C * b + $ * B, x = b * b + B * B, P = C * _ + $ * N, R = b * _ + B * N, X = F * x - D * D, q, L, V, U, H = X, K = X;
    X === 0 ? (L = 0, H = 1, U = R, K = x) : (L = D * R - x * P, U = F * R - D * P, L < 0 ? (L = 0, U = R, K = x) : L > H && (L = H, U = R + D, K = x)), U < 0 ? (U = 0, -P < 0 ? L = 0 : -P > F ? L = H : (L = -P, H = F)) : U > K && (U = K, -P + D < 0 ? L = 0 : -P + D > F ? L = H : (L = -P + D, H = F)), q = L === 0 ? 0 : L / H, V = U === 0 ? 0 : U / K;
    var G = (1 - q) * h + q * M, J = (1 - q) * v + q * I, Z = (1 - V) * k + V * T, Q = (1 - V) * E + V * O, at = Z - G, ut = Q - J;
    return at * at + ut * ut;
  }
  function g(h, v) {
    return h[0] === v[0] ? h[1] - v[1] : h[0] - v[0];
  }
  function w(h) {
    h.sort(g);
    for (var v = [], M = 0; M < h.length; M++) {
      for (; v.length >= 2 && u(v[v.length - 2], v[v.length - 1], h[M]) <= 0; )
        v.pop();
      v.push(h[M]);
    }
    for (var I = [], k = h.length - 1; k >= 0; k--) {
      for (; I.length >= 2 && u(I[I.length - 2], I[I.length - 1], h[k]) <= 0; )
        I.pop();
      I.push(h[k]);
    }
    return I.pop(), v.pop(), v.concat(I);
  }
  return he.exports;
}
var Xi = $i();
const Li = /* @__PURE__ */ Ai(Xi);
function fn(i, t = {}) {
  t.concavity = t.concavity || 1 / 0;
  const e = [];
  if ($e(i, (o) => {
    e.push([o[0], o[1]]);
  }), !e.length)
    return null;
  const n = Li(e, t.concavity);
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
  static from(t, e = ji, n = zi) {
    const o = t.length, r = new Float64Array(o * 2);
    for (let s = 0; s < o; s++) {
      const a = t[s];
      r[2 * s] = e(a), r[2 * s + 1] = n(a);
    }
    return new Le(r);
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
    const { coords: t, _hullPrev: e, _hullNext: n, _hullTri: o, _hullHash: r } = this, s = t.length >> 1;
    let a = 1 / 0, l = 1 / 0, c = -1 / 0, u = -1 / 0;
    for (let E = 0; E < s; E++) {
      const T = t[2 * E], O = t[2 * E + 1];
      T < a && (a = T), O < l && (l = O), T > c && (c = T), O > u && (u = O), this._ids[E] = E;
    }
    const f = (a + c) / 2, d = (l + u) / 2;
    let m = 0, y = 0, p = 0;
    for (let E = 0, T = 1 / 0; E < s; E++) {
      const O = Fe(f, d, t[2 * E], t[2 * E + 1]);
      O < T && (m = E, T = O);
    }
    const S = t[2 * m], A = t[2 * m + 1];
    for (let E = 0, T = 1 / 0; E < s; E++) {
      if (E === m) continue;
      const O = Fe(S, A, t[2 * E], t[2 * E + 1]);
      O < T && O > 0 && (y = E, T = O);
    }
    let g = t[2 * y], w = t[2 * y + 1], h = 1 / 0;
    for (let E = 0; E < s; E++) {
      if (E === m || E === y) continue;
      const T = Ui(S, A, g, w, t[2 * E], t[2 * E + 1]);
      T < h && (p = E, h = T);
    }
    let v = t[2 * p], M = t[2 * p + 1];
    if (h === 1 / 0) {
      for (let O = 0; O < s; O++)
        this._dists[O] = t[2 * O] - t[0] || t[2 * O + 1] - t[1];
      zt(this._ids, this._dists, 0, s - 1);
      const E = new Uint32Array(s);
      let T = 0;
      for (let O = 0, C = -1 / 0; O < s; O++) {
        const $ = this._ids[O], b = this._dists[$];
        b > C && (E[T++] = $, C = b);
      }
      this.hull = E.subarray(0, T), this.triangles = new Uint32Array(0), this.halfedges = new Int32Array(0);
      return;
    }
    if (ft(S, A, g, w, v, M) < 0) {
      const E = y, T = g, O = w;
      y = p, g = v, w = M, p = E, v = T, M = O;
    }
    const I = Vi(S, A, g, w, v, M);
    this._cx = I.x, this._cy = I.y;
    for (let E = 0; E < s; E++)
      this._dists[E] = Fe(t[2 * E], t[2 * E + 1], I.x, I.y);
    zt(this._ids, this._dists, 0, s - 1), this._hullStart = m;
    let k = 3;
    n[m] = e[p] = y, n[y] = e[m] = p, n[p] = e[y] = m, o[m] = 0, o[y] = 1, o[p] = 2, r.fill(-1), r[this._hashKey(S, A)] = m, r[this._hashKey(g, w)] = y, r[this._hashKey(v, M)] = p, this.trianglesLen = 0, this._addTriangle(m, y, p, -1, -1, -1);
    for (let E = 0, T = 0, O = 0; E < this._ids.length; E++) {
      const C = this._ids[E], $ = t[2 * C], b = t[2 * C + 1];
      if (E > 0 && Math.abs($ - T) <= un && Math.abs(b - O) <= un || (T = $, O = b, C === m || C === y || C === p)) continue;
      let B = 0;
      for (let x = 0, P = this._hashKey($, b); x < this._hashSize && (B = r[(P + x) % this._hashSize], !(B !== -1 && B !== n[B])); x++)
        ;
      B = e[B];
      let _ = B, N;
      for (; N = n[_], ft($, b, t[2 * _], t[2 * _ + 1], t[2 * N], t[2 * N + 1]) >= 0; )
        if (_ = N, _ === B) {
          _ = -1;
          break;
        }
      if (_ === -1) continue;
      let F = this._addTriangle(_, C, n[_], -1, -1, o[_]);
      o[C] = this._legalize(F + 2), o[_] = F, k++;
      let D = n[_];
      for (; N = n[D], ft($, b, t[2 * D], t[2 * D + 1], t[2 * N], t[2 * N + 1]) < 0; )
        F = this._addTriangle(D, C, N, o[C], -1, o[D]), o[C] = this._legalize(F + 2), n[D] = D, k--, D = N;
      if (_ === B)
        for (; N = e[_], ft($, b, t[2 * N], t[2 * N + 1], t[2 * _], t[2 * _ + 1]) < 0; )
          F = this._addTriangle(N, C, _, -1, o[_], o[N]), this._legalize(F + 2), o[N] = F, n[_] = _, k--, _ = N;
      this._hullStart = e[C] = _, n[_] = e[D] = C, n[C] = D, r[this._hashKey($, b)] = C, r[this._hashKey(t[2 * _], t[2 * _ + 1])] = _;
    }
    this.hull = new Uint32Array(k);
    for (let E = 0, T = this._hullStart; E < k; E++)
      this.hull[E] = T, T = n[T];
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
    return Math.floor(Yi(t - this._cx, e - this._cy) * this._hashSize) % this._hashSize;
  }
  /**
   * Flip an edge in a pair of triangles if it doesn't satisfy the Delaunay condition.
   *
   * @param {number} a
   * @private
   */
  _legalize(t) {
    const { _triangles: e, _halfedges: n, coords: o } = this;
    let r = 0, s = 0;
    for (; ; ) {
      const a = n[t], l = t - t % 3;
      if (s = l + (t + 2) % 3, a === -1) {
        if (r === 0) break;
        t = de[--r];
        continue;
      }
      const c = a - a % 3, u = l + (t + 1) % 3, f = c + (a + 2) % 3, d = e[s], m = e[t], y = e[u], p = e[f];
      if (qi(
        o[2 * d],
        o[2 * d + 1],
        o[2 * m],
        o[2 * m + 1],
        o[2 * y],
        o[2 * y + 1],
        o[2 * p],
        o[2 * p + 1]
      )) {
        e[t] = p, e[a] = d;
        const A = n[f];
        if (A === -1) {
          let w = this._hullStart;
          do {
            if (this._hullTri[w] === f) {
              this._hullTri[w] = t;
              break;
            }
            w = this._hullPrev[w];
          } while (w !== this._hullStart);
        }
        this._link(t, A), this._link(a, n[s]), this._link(s, f);
        const g = c + (a + 1) % 3;
        r < de.length && (de[r++] = g);
      } else {
        if (r === 0) break;
        t = de[--r];
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
  _addTriangle(t, e, n, o, r, s) {
    const a = this.trianglesLen;
    return this._triangles[a] = t, this._triangles[a + 1] = e, this._triangles[a + 2] = n, this._link(a, o), this._link(a + 1, r), this._link(a + 2, s), this.trianglesLen += 3, a;
  }
}
function Yi(i, t) {
  const e = i / (Math.abs(i) + Math.abs(t));
  return (t > 0 ? 3 - e : 1 + e) / 4;
}
function Fe(i, t, e, n) {
  const o = i - e, r = t - n;
  return o * o + r * r;
}
function qi(i, t, e, n, o, r, s, a) {
  const l = i - s, c = t - a, u = e - s, f = n - a, d = o - s, m = r - a, y = l * l + c * c, p = u * u + f * f, S = d * d + m * m;
  return l * (f * S - p * m) - c * (u * S - p * d) + y * (u * m - f * d) < 0;
}
function Ui(i, t, e, n, o, r) {
  const s = e - i, a = n - t, l = o - i, c = r - t, u = s * s + a * a, f = l * l + c * c, d = 0.5 / (s * c - a * l), m = (c * u - a * f) * d, y = (s * f - l * u) * d;
  return m * m + y * y;
}
function Vi(i, t, e, n, o, r) {
  const s = e - i, a = n - t, l = o - i, c = r - t, u = s * s + a * a, f = l * l + c * c, d = 0.5 / (s * c - a * l), m = i + (c * u - a * f) * d, y = t + (s * f - l * u) * d;
  return { x: m, y };
}
function zt(i, t, e, n) {
  if (n - e <= 20)
    for (let o = e + 1; o <= n; o++) {
      const r = i[o], s = t[r];
      let a = o - 1;
      for (; a >= e && t[i[a]] > s; ) i[a + 1] = i[a--];
      i[a + 1] = r;
    }
  else {
    const o = e + n >> 1;
    let r = e + 1, s = n;
    Gt(i, o, r), t[i[e]] > t[i[n]] && Gt(i, e, n), t[i[r]] > t[i[n]] && Gt(i, r, n), t[i[e]] > t[i[r]] && Gt(i, e, r);
    const a = i[r], l = t[a];
    for (; ; ) {
      do
        r++;
      while (t[i[r]] < l);
      do
        s--;
      while (t[i[s]] > l);
      if (s < r) break;
      Gt(i, r, s);
    }
    i[e + 1] = i[s], i[s] = a, n - r + 1 >= s - e ? (zt(i, t, r, n), zt(i, t, e, s - 1)) : (zt(i, t, e, s - 1), zt(i, t, r, n));
  }
}
function Gt(i, t, e) {
  const n = i[t];
  i[t] = i[e], i[e] = n;
}
function ji(i) {
  return i[0];
}
function zi(i) {
  return i[1];
}
class Ki {
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
    const n = Math.floor(t / this.width), r = 1 << t % this.width;
    return this.bs[n] ^= (-Number(e) ^ this.bs[n]) & r, e;
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
      let o = 0;
      for (; this.bs[n] && o < this.width; )
        this.bs[n] & 1 << o && t(n * this.width + o), o++;
    }
    return this;
  }
}
class hn extends Ki {
  constructor(t) {
    super(8, new Uint8Array(Math.ceil(t / 8)).fill(0));
  }
}
function At(i) {
  return i % 3 === 2 ? i - 2 : i + 1;
}
function St(i) {
  return i % 3 === 0 ? i + 2 : i - 1;
}
function dn(i, t, e, n, o, r, s, a) {
  const l = ft(i, t, o, r, s, a), c = ft(e, n, o, r, s, a);
  if (l > 0 && c > 0 || l < 0 && c < 0)
    return !1;
  const u = ft(o, r, i, t, e, n), f = ft(s, a, i, t, e, n);
  return u > 0 && f > 0 || u < 0 && f < 0 ? !1 : l === 0 && c === 0 && u === 0 && f === 0 ? !(Math.max(o, s) < Math.min(i, e) || Math.max(i, e) < Math.min(o, s) || Math.max(r, a) < Math.min(t, n) || Math.max(t, n) < Math.min(r, a)) : !0;
}
class Hi {
  /**
   * The triangulation object from Delaunator.
   */
  del;
  constructor(t) {
    this.del = t;
  }
}
class te extends Hi {
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
    const n = 2 ** 32 - 1, o = t.coords.length >> 1, r = t.triangles.length;
    this.vertMap = new Uint32Array(o).fill(n), this.flips = new hn(r), this.consd = new hn(r);
    for (let s = 0; s < r; s++) {
      const a = t.triangles[s];
      this.vertMap[a] === n && this.updateVert(s);
    }
    e && this.constrainAll(e);
  }
  /** 現在の三角網と制約の状態を控える（三角網の配列は複製する）。 */
  snapshot() {
    const { coords: t, hull: e, triangles: n, halfedges: o } = this.del;
    return {
      coords: t,
      hull: e,
      triangles: Uint32Array.from(n),
      halfedges: Int32Array.from(o),
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
    const { triangles: n, halfedges: o } = this.del;
    this.assertVertex(t, t, e), this.assertVertex(e, t, e), this.assertInTriangulation(t, t, e), this.assertInTriangulation(e, t, e);
    const r = this.vertMap[t], s = this.maxConstrainSteps();
    let a = 0, l = r;
    do {
      if (++a > s)
        throw new Error(
          `Constraining edge [${t}, ${e}] exceeded the iteration limit`
        );
      const f = n[l], d = At(l);
      if (f === e)
        return this.protect(l);
      const m = St(l), y = n[m];
      if (y === e)
        return this.protect(d), d;
      if (this.intersectSegments(t, e, y, f)) {
        l = m;
        break;
      }
      l = o[d];
    } while (l !== -1 && l !== r);
    let c = l, u = -1;
    for (; l !== -1; ) {
      if (++a > s)
        throw new Error(
          `Constraining edge [${t}, ${e}] exceeded the iteration limit`
        );
      const f = o[l], d = St(l), m = St(f), y = At(f);
      if (f === -1)
        throw new Error("Constraining edge exited the hull");
      if (this.consd.has(l))
        throw new Error("Edge intersects already constrained edge");
      if (this.isCollinear(t, e, n[l]) || this.isCollinear(t, e, n[f]))
        throw new Error("Constraining edge intersects point");
      if (!this.intersectSegments(
        n[l],
        n[f],
        n[d],
        n[m]
      )) {
        if (u === -1 && (u = l), n[m] === e) {
          if (l === u)
            throw new Error("Infinite loop: non-convex quadrilateral");
          l = u, u = -1;
          continue;
        }
        if (this.intersectSegments(
          t,
          e,
          n[m],
          n[f]
        ))
          l = m;
        else if (this.intersectSegments(
          t,
          e,
          n[y],
          n[m]
        ))
          l = y;
        else if (u === l)
          throw new Error("Infinite loop: no further intersect after non-convex");
        continue;
      }
      if (this.flipDiagonal(l), this.intersectSegments(
        t,
        e,
        n[d],
        n[m]
      ) && (u === -1 && (u = d), u === d))
        throw new Error("Infinite loop: flipped diagonal still intersects");
      n[m] === e ? (c = m, l = u, u = -1) : this.intersectSegments(
        t,
        e,
        n[y],
        n[m]
      ) && (l = y);
    }
    return this.protect(c), this.delaunify(!0), this.findEdge(t, e);
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
    const o = this.vertMap.length;
    if (!Number.isInteger(t) || t < 0 || t >= o)
      throw new Error(
        `Invalid edge [${String(e)}, ${String(n)}]: vertex ids must be integers from 0 to ${o - 1}`
      );
  }
  /**
   * Fix the Delaunay condition.
   */
  delaunify(t = !1) {
    const { halfedges: e } = this.del, n = this.flips, o = this.consd, r = e.length;
    let s;
    do {
      s = 0;
      for (let a = 0; a < r; a++) {
        if (o.has(a))
          continue;
        n.delete(a);
        const l = e[a];
        l !== -1 && (n.delete(l), this.isDelaunay(a) || (this.flipDiagonal(a), s++));
      }
    } while (t && s > 0);
    return this;
  }
  /**
   * Call constrainOne on each edge.
   */
  constrainAll(t) {
    const e = t.length;
    for (let n = 0; n < e; n++) {
      const o = t[n];
      this.constrainOne(o[0], o[1]);
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
    const { triangles: n, halfedges: o } = this.del, r = n.length / 3, s = (y, p, S) => {
      const A = t(p), g = t(S);
      return t(y).some((w) => A.includes(w) && g.includes(w));
    }, a = (y) => s(n[y * 3], n[y * 3 + 1], n[y * 3 + 2]), l = (y, p, S, A) => Math.sign(ft(y[p * 2], y[p * 2 + 1], y[S * 2], y[S * 2 + 1], y[A * 2], y[A * 2 + 1])), c = e.map((y) => {
      let p = 0;
      for (let S = 0; S < r; S++) p += l(y, n[S * 3], n[S * 3 + 1], n[S * 3 + 2]);
      return p < 0 ? -1 : 1;
    }), u = (y) => {
      if (this.consd.has(y)) return !1;
      const p = o[y];
      if (p === -1) return !1;
      const S = n[y], A = n[At(y)], g = n[St(y)], w = n[St(p)];
      return e.every((h, v) => l(h, g, S, w) === c[v] && l(h, w, A, g) === c[v]);
    };
    let f = 0, d = !0;
    for (; d; ) {
      d = !1;
      for (let y = 0; y < r; y++)
        if (a(y))
          for (let p = 0; p < 3; p++) {
            const S = y * 3 + p;
            if (!u(S)) continue;
            const A = o[S], g = n[S], w = n[At(S)], h = n[St(S)], v = n[St(A)];
            if (!(s(h, g, v) && s(v, w, h))) {
              this.protect(this.flipDiagonal(S)), f++, d = !0;
              break;
            }
          }
    }
    let m = 0;
    for (let y = 0; y < r; y++) a(y) && m++;
    return { flips: f, remaining: m };
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
    const n = this.vertMap[e], { triangles: o, halfedges: r } = this.del;
    if (!(n < o.length))
      return 1 / 0;
    let s = n, a, l = 0;
    do {
      if (++l > o.length)
        throw new Error(
          `Looking up edge [${t}, ${e}] exceeded the iteration limit`
        );
      if (o[s] === t)
        return s;
      a = At(s), s = r[a];
    } while (s !== -1 && s !== n);
    return o[At(a)] === t ? -a : 1 / 0;
  }
  /**
   * Mark an edge as constrained, i.e. should not be touched by `delaunify`.
   */
  protect(t) {
    const e = this.del.halfedges[t], n = this.flips, o = this.consd;
    return n.delete(t), o.add(t), e !== -1 ? (n.delete(e), o.add(e), e) : -t;
  }
  /**
   * Mark an edge as flipped unless constrained.
   */
  markFlip(t) {
    const e = this.del.halfedges, n = this.flips;
    if (this.consd.has(t))
      return !1;
    const r = e[t];
    return r !== -1 && (n.add(t), n.add(r)), !0;
  }
  /**
   * Flip the edge shared by two triangles.
   */
  flipDiagonal(t) {
    const { triangles: e, halfedges: n } = this.del, o = this.flips, r = this.consd, s = n[t], a = St(t), l = At(t), c = St(s), u = At(s), f = n[a], d = n[c];
    if (r.has(t))
      throw new Error("Trying to flip a constrained edge");
    return e[t] = e[c], n[t] = d, o.set(t, o.has(c)) || r.set(t, r.has(c)), d !== -1 && (n[d] = t), n[a] = c, e[s] = e[a], n[s] = f, o.set(s, o.has(a)) || r.set(s, r.has(a)), f !== -1 && (n[f] = s), n[c] = a, this.markFlip(t), this.markFlip(l), this.markFlip(s), this.markFlip(u), o.add(a), r.delete(a), o.add(c), r.delete(c), this.updateVert(t), this.updateVert(l), this.updateVert(s), this.updateVert(u), a;
  }
  /**
   * Whether point p1, p2, and p are collinear.
   */
  isCollinear(t, e, n) {
    const o = this.del.coords;
    return ft(
      o[t * 2],
      o[t * 2 + 1],
      o[e * 2],
      o[e * 2 + 1],
      o[n * 2],
      o[n * 2 + 1]
    ) === 0;
  }
  /**
   * Whether the triangle formed by p1, p2, p3 keeps px outside the circumcircle.
   */
  inCircle(t, e, n, o) {
    const r = this.del.coords;
    return li(
      r[t * 2],
      r[t * 2 + 1],
      r[e * 2],
      r[e * 2 + 1],
      r[n * 2],
      r[n * 2 + 1],
      r[o * 2],
      r[o * 2 + 1]
    ) < 0;
  }
  /**
   * Whether the triangles sharing edg conform to the Delaunay condition.
   */
  isDelaunay(t) {
    const { triangles: e, halfedges: n } = this.del, o = n[t];
    if (o === -1)
      return !0;
    const r = e[St(t)], s = e[t], a = e[At(t)], l = e[St(o)];
    return !this.inCircle(r, s, a, l);
  }
  /**
   * Update the vertex -> incoming edge map.
   */
  updateVert(t) {
    const { triangles: e, halfedges: n } = this.del, o = this.vertMap, r = e[t];
    let s = St(t), a = n[s];
    for (; a !== -1 && a !== t; )
      s = St(a), a = n[s];
    return o[r] = s, s;
  }
  /**
   * Whether the segments between vertices intersect.
   */
  intersectSegments(t, e, n, o) {
    const r = this.del.coords;
    return t === n || t === o || e === n || e === o ? !1 : dn(
      r[t * 2],
      r[t * 2 + 1],
      r[e * 2],
      r[e * 2 + 1],
      r[n * 2],
      r[n * 2 + 1],
      r[o * 2],
      r[o * 2 + 1]
    );
  }
  static intersectSegments = dn;
}
function pe(i, t, e) {
  return De(i, t, e).tin;
}
function De(i, t, e, n, o) {
  if (t || (t = []), typeof i != "object" || i.type !== "FeatureCollection")
    throw "Argument points must be FeatureCollection";
  if (!Array.isArray(t)) throw "Argument points must be Array of Array";
  const r = i.features.map(
    (p) => p.geometry.coordinates
  );
  let s = o?.snapshot ? te.restore(o.snapshot) : void 0;
  const a = s ? void 0 : Le.from(r);
  let l = s ? s.del : a, c = 0, u;
  const f = [];
  if (l.triangles.length !== 0 && (t.length !== 0 || n)) {
    if (!s) {
      s = new te(l);
      try {
        s.constrainAll(t);
      } catch (A) {
        if (!n?.allowUnusableBoundary) throw A;
        return { tin: xt([]), remaining: 0, hasBoundary: !1, hull: [] };
      }
      o && (o.snapshot = s.snapshot());
    }
    const p = n ? o?.snapshot ?? s.snapshot() : void 0, S = (A) => {
      const g = te.restore(p);
      return g.constrainAll(A), g;
    };
    for (const A of n?.hull ?? [])
      try {
        s.constrainOne(A[0], A[1]), f.push(A);
      } catch {
        s = S(f);
      }
    n?.boundary && (u = Wi(s, n.boundary), u || (s = S(f))), n && ({ remaining: c } = s.forbidGroupTriangles(
      n.groupsOf,
      n.planes
    ), c -= u?.size ?? 0), l = s.del;
  }
  const d = [];
  for (let p = 0; p < l.triangles.length; p += 3)
    u?.has(p / 3) || d.push([l.triangles[p], l.triangles[p + 1], l.triangles[p + 2]]);
  const m = ["a", "b", "c"];
  return { tin: xt(
    d.map((p) => {
      const S = {}, A = p.map((g, w) => {
        const h = i.features[g], v = h.geometry.coordinates, M = [v[0], v[1]];
        return v.length === 3 ? M[2] = v[2] : S[m[w]] = h.properties[e], M;
      });
      return A[3] = A[0], re([A], S);
    })
  ), remaining: c, hasBoundary: u !== void 0, hull: f };
}
function Wi(i, t) {
  try {
    i.constrainAll(t);
  } catch {
    return;
  }
  const e = new Map(t), { triangles: n, halfedges: o } = i.del, r = (c) => {
    const u = n[c], f = n[At(c)];
    return e.get(u) === f || e.get(f) === u;
  }, s = /* @__PURE__ */ new Set(), a = [], l = (c) => {
    const u = Math.floor(c / 3);
    s.has(u) || (s.add(u), a.push(u));
  };
  for (let c = 0; c < o.length; c++)
    o[c] === -1 && !r(c) && l(c);
  for (let c = 0; c < a.length; c++)
    for (let u = a[c] * 3; u < a[c] * 3 + 3; u++) {
      if (!e.has(n[u])) return;
      o[u] !== -1 && !r(u) && l(o[u]);
    }
  return s;
}
function pn(i) {
  const t = /* @__PURE__ */ new Set(), e = [];
  if (i.forEach(([l, c], u) => {
    const f = `${l}:${c}`;
    t.has(f) || (t.add(f), e.push({ i: u, x: l, y: c }));
  }), e.length < 3) return [];
  const n = (l, c, u) => ft(l.x, l.y, c.x, c.y, u.x, u.y), o = [...e].sort((l, c) => l.x - c.x || l.y - c.y), r = (l) => {
    const c = [];
    for (const u of l) {
      for (; c.length >= 2 && n(c[c.length - 2], c[c.length - 1], u) <= 0; ) c.pop();
      c.push(u);
    }
    return c.pop(), c;
  }, s = [...r(o), ...r([...o].reverse())];
  if (s.length < 3) return [];
  const a = [];
  for (let l = 0; l < s.length; l++) {
    const c = s[l], u = s[(l + 1) % s.length], f = u.x - c.x, d = u.y - c.y, m = f * f + d * d, y = e.filter((S) => S !== c && S !== u && n(c, u, S) === 0).map((S) => ({ r: S, t: ((S.x - c.x) * f + (S.y - c.y) * d) / m })).filter(({ t: S }) => S > 0 && S < 1).sort((S, A) => S.t - A.t).map(({ r: S }) => S), p = [c, ...y, u];
    for (let S = 0; S + 1 < p.length; S++) a.push([p[S].i, p[S + 1].i]);
  }
  return a;
}
function ve([i, t]) {
  return i < t ? `${i}-${t}` : `${t}-${i}`;
}
function Vt(i, t, e) {
  return Yt(i, { target: { geom: t, index: e } });
}
function jt(i) {
  return Yt(i.properties.target.geom, {
    target: {
      geom: i.geometry.coordinates,
      index: i.properties.target.index
    }
  });
}
function gn(i, t) {
  const e = i.length, n = t.geometry.coordinates;
  return Array.from({ length: e }, (o, r) => r).map((o) => {
    const r = (o + 1) % e, s = i[o], a = i[r], l = s.geometry.coordinates, c = Math.atan2(
      l[0] - n[0],
      l[1] - n[1]
    ), u = [t, s, a, t].map(
      (m) => m.geometry.coordinates
    ), f = {
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
    }, d = xt([
      re([u], f)
    ]);
    return [c, d];
  }).reduce(
    (o, r) => (o[0].push(r[0]), o[1].push(r[1]), o),
    [[], []]
  );
}
const Gi = [0.1, 0.15, 0.225, 0.34, 0.5];
function Ji(i, t) {
  return t ? i.hasBoundary !== t.hasBoundary ? i.hasBoundary : i.diagnostics.boundaryTriangleFlips < t.diagnostics.boundaryTriangleFlips : !0;
}
function mn(i, t, e) {
  return Math.sign(ft(i[0], i[1], t[0], t[1], e[0], e[1]));
}
function be(i, t = -1) {
  let e = 0;
  for (const n of i.features) {
    const { a: o, b: r, c: s } = n.properties;
    if (![o, r, s].some(
      ({ index: f }) => typeof f == "string" && f.startsWith("b")
    ))
      continue;
    const [a, l, c] = n.geometry.coordinates[0];
    mn(a, l, c) * mn(o.geom, r.geom, s.geom) * t <= 0 && e++;
  }
  return e;
}
function wn(i, t, e) {
  if (i.some(([s, a]) => s === t[0] && a === t[1])) return !1;
  const n = i.map(
    ([s, a]) => Math.atan2(a - t[1], s - t[0])
  ), o = 2 * Math.PI;
  let r = 0;
  for (let s = 0; s < n.length; s++) {
    const l = (e * (n[(s + 1) % n.length] - n[s]) + o) % o;
    if (!(l > 0 && l < Math.PI)) return !1;
    r += l;
  }
  return Math.abs(r - o) < 1e-6;
}
function yn(i, t, e, n, o, r = /* @__PURE__ */ new Set(), s) {
  const { minx: a, maxx: l, miny: c, maxy: u, centroid: f } = i, d = l - a, m = u - c, y = e.forw.length, p = Array.from({ length: y }, () => []);
  let S = 1;
  for (const [I, k] of e.edges)
    I < n && p[I].push(S), p[k].push(S), k < n && S++;
  const A = (I) => I.slice(0, y).map(({ geometry: k }) => k.coordinates), g = pn(A(e.forw)), w = {
    forw: g.filter((I) => !r.has(ve(I))),
    bakw: pn(A(e.bakw))
  }, h = [0], v = (I) => I >= y ? h : p[I];
  let M;
  for (const I of Gi) {
    const k = s?.get(I) ?? { forwReuse: {} };
    s?.set(I, k);
    const E = k.vertices ?? (k.vertices = t(
      {
        ...i,
        minx: a - I * d,
        maxx: l + I * d,
        miny: c - I * m,
        maxy: u + I * m
      },
      !0
    ));
    if (o && (E.length < 4 || !E.every(({ bakw: L }) => L.every(Number.isFinite)))) continue;
    const T = E.map(
      ({ forw: L, bakw: V }, U) => Vt(L, V, `b${U}`)
    ), O = xt([...e.forw, ...T]), C = xt([
      ...e.bakw,
      ...T.map(jt)
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
    ), B = o !== void 0 || wn(
      E.map((L) => L.forw),
      f.forw,
      -1
    ) && wn(
      E.map((L) => L.bakw),
      f.bakw,
      1
    ) ? E.map((L, V) => [
      y + V,
      y + (V + 1) % E.length
    ]) : void 0, _ = { groupsOf: v, planes: $, boundary: B, allowUnusableBoundary: o !== void 0 }, N = o?.orientation ?? -1, F = De(
      O,
      e.edges,
      "target",
      { ..._, hull: w.forw },
      k.forwReuse
    ), D = k.geographic ?? (k.geographic = (() => {
      const L = De(C, e.edges, "target", {
        ..._,
        hull: w.bakw
      });
      return { built: L, flips: be(L.tin, N) };
    })()), x = D.built, P = F.tin, R = {
      ...x.tin,
      features: [...x.tin.features]
    }, X = be(P, N) + D.flips, q = {
      vertices: E,
      forw: P,
      bakw: R,
      diagnostics: {
        margin: I,
        boundaryTriangleFlips: X,
        remainingForbiddenTriangles: F.remaining + x.remaining
      },
      hasMapBoundary: F.hasBoundary,
      hasBoundary: F.hasBoundary && x.hasBoundary,
      forwHull: { all: g, applied: F.hull }
    };
    if (o) {
      if (o.accept(q)) return q;
      continue;
    }
    if (X === 0 && q.hasBoundary)
      return q;
    Ji(q, M) && (M = q);
  }
  return M;
}
const vn = 1e-9;
function Qi(i, t) {
  const e = [[], [], [], []], n = [];
  return Object.keys(i).forEach((o) => {
    const r = i[o], s = r.forw, a = r.bakw, l = [
      s[0] - t.forw[0],
      s[1] - t.forw[1]
    ], c = [
      a[0] - t.bakw[0],
      t.bakw[1] - a[1]
    ], u = { forw: l, bakw: c };
    if (n.push(u), l[0] === 0 || l[1] === 0)
      return;
    let f = 0;
    l[0] > 0 && (f += 1), l[1] > 0 && (f += 2), e[f].push(u);
  }), { perQuad: e, aggregate: n };
}
function $n(i) {
  let t = 1 / 0, e = 0, n = 0;
  return i.forEach((o) => {
    const { forw: r, bakw: s } = o, a = Math.hypot(r[0], r[1]), l = Math.hypot(s[0], s[1]);
    if (l === 0) return;
    const c = a / l, u = Math.atan2(r[0], r[1]) - Math.atan2(s[0], s[1]);
    t = Math.min(t, c), e += Math.cos(u), n += Math.sin(u);
  }), isFinite(t) ? [t, Math.atan2(n, e)] : [1, 0];
}
const Zi = 0.6, tr = 3, er = 0.5;
function nr(i) {
  let t = 0, e = 0, n = 0, o = 0;
  if (i.forEach(({ forw: s, bakw: a }) => {
    t += s[1] * a[1] + s[0] * a[0], e += s[0] * a[1] - s[1] * a[0], n += a[0] * a[0] + a[1] * a[1], o += s[0] * s[0] + s[1] * s[1];
  }), !(!(n > 0 && o > 0) || !(Math.hypot(t, e) / Math.sqrt(o * n) >= er)))
    return [Math.hypot(t, e) / n, Math.atan2(e, t)];
}
function ir(i) {
  const t = (o) => Math.hypot(o.forw[0], o.forw[1]), e = Math.max(...i.map(t)), n = i.filter((o) => t(o) >= Zi * e);
  return nr(n.length >= tr ? n : i) ?? $n(i);
}
function rr(i, t, e, n) {
  const { perQuad: o, aggregate: r } = Qi(i, t), s = o.every((u) => u.length > 0), a = e === "birdeye" ? s ? o : [r] : [r], l = n === "farLsq" ? ir : $n, c = a.map((u) => l(u));
  return c.length === 1 ? [c[0], c[0], c[0], c[0]] : c;
}
function sr(i, t) {
  let e = 0;
  return i[0] > t[0] && (e += 1), i[1] > t[1] && (e += 2), e;
}
function or(i, t, e) {
  const n = [
    i[0] - t.forw[0],
    i[1] - t.forw[1]
  ], r = Math.sqrt(n[0] ** 2 + n[1] ** 2) / e[0], s = Math.atan2(n[0], n[1]) - e[1];
  return [
    t.bakw[0] + r * Math.sin(s),
    t.bakw[1] - r * Math.cos(s)
  ];
}
function ar(i, t, e, n) {
  const o = t[0] - i[0], r = t[1] - i[1];
  if (Math.abs(o) < 1e-12 && Math.abs(r) < 1e-12) return null;
  const s = n[0] - e[0], a = n[1] - e[1], l = e[0] - i[0], c = e[1] - i[1], u = o * a - r * s;
  if (Math.abs(u) < 1e-12) return null;
  const f = (l * a - c * s) / u, d = (l * r - c * o) / u;
  return f <= 1e-10 || d < -1e-10 || d > 1 + 1e-10 ? null : { t: f, point: [i[0] + f * o, i[1] + f * r] };
}
function cr(i, t, e) {
  const n = e.length;
  let o = -1 / 0, r = null;
  for (let s = 0; s < n; s++) {
    const a = (s + 1) % n, l = ar(
      i,
      t,
      e[s].bakw,
      e[a].bakw
    );
    l && l.t > o && (o = l.t, r = l.point);
  }
  return r;
}
function bn(i, t) {
  const n = Math.atan2(i[0] - t[0], i[1] - t[1]) * (180 / Math.PI);
  return n < 0 ? n + 360 : n;
}
function xn(i, t, e, n, o, r) {
  const s = t[0] - i[0], a = t[1] - i[1];
  if (s === 0 && a === 0) return null;
  const l = [];
  if (s !== 0)
    for (const u of [e, n]) {
      const f = (u - i[0]) / s;
      if (f > 0) {
        const d = i[1] + f * a;
        d >= o && d <= r && l.push({ t: f, x: u, y: d });
      }
    }
  if (a !== 0)
    for (const u of [o, r]) {
      const f = (u - i[1]) / a;
      if (f > 0) {
        const d = i[0] + f * s;
        d >= e && d <= n && l.push({ t: f, x: d, y: u });
      }
    }
  if (l.length === 0) return null;
  l.sort((u, f) => u.t - f.t);
  const c = l[0];
  return [c.x, c.y];
}
function Sn(i, t, e) {
  const n = i.length, o = new Array(n).fill(1);
  for (const r of t)
    for (let s = 0; s < n; s++) {
      const a = (s + 1) % n, l = je([i[s].bakw, i[a].bakw]), c = je([e.bakw, r.bakw]), u = ki(l, c);
      if (u.features.length > 0 && u.features[0].geometry) {
        const f = u.features[0], d = Math.sqrt(
          Math.pow(r.bakw[0] - e.bakw[0], 2) + Math.pow(r.bakw[1] - e.bakw[1], 2)
        ), m = Math.sqrt(
          Math.pow(f.geometry.coordinates[0] - e.bakw[0], 2) + Math.pow(f.geometry.coordinates[1] - e.bakw[1], 2)
        ), y = d / m;
        y > o[s] && (o[s] = y), y > o[a] && (o[a] = y);
      }
    }
  i.forEach((r, s) => {
    const a = o[s];
    r.bakw = [
      (r.bakw[0] - e.bakw[0]) * a + e.bakw[0],
      (r.bakw[1] - e.bakw[1]) * a + e.bakw[1]
    ];
  });
}
function Ye(i, t, e, n, o) {
  const { convexBuf: r, centroid: s, allGcps: a, minx: l, maxx: c, miny: u, maxy: f } = i, d = o ? void 0 : rr(r, s, t, n), y = [
    [l, u],
    [c, u],
    [c, f],
    [l, f]
  ].map((k) => ({
    forw: k,
    bakw: o ? o(k) : or(
      k,
      s,
      d[sr(k, s.forw)]
    )
  }));
  if (y.sort(
    (k, E) => Math.atan2(k.forw[0] - s.forw[0], k.forw[1] - s.forw[1]) - Math.atan2(E.forw[0] - s.forw[0], E.forw[1] - s.forw[1])
  ), o || Sn(y, a, s), !e) return y;
  const p = 4, S = y.map(
    (k) => Math.atan2(k.forw[0] - s.forw[0], k.forw[1] - s.forw[1])
  ), A = y.map(
    (k) => Math.atan2(
      k.bakw[0] - s.bakw[0],
      -(k.bakw[1] - s.bakw[1])
    )
  );
  function g(k) {
    for (let E = 0; E < p; E++) {
      const T = (E + 1) % p, O = S[E], C = E < p - 1 ? S[T] : S[T] + 2 * Math.PI;
      let $ = k;
      for (; $ < O; ) $ += 2 * Math.PI;
      for (; $ >= O + 2 * Math.PI; ) $ -= 2 * Math.PI;
      if ($ >= O && $ < C)
        return { i: E, j: T, frac: ($ - O) / (C - O) };
    }
    return { i: 0, j: 1, frac: 0 };
  }
  function w(k) {
    const { i: E, j: T, frac: O } = g(k), C = A[E];
    let b = A[T] - C;
    for (; b > Math.PI; ) b -= 2 * Math.PI;
    for (; b < -Math.PI; ) b += 2 * Math.PI;
    return C + O * b;
  }
  const h = new Set(
    y.map(
      (k) => Math.floor(bn(k.forw, s.forw) / 10) % 36
    )
  ), v = a.map((k) => ({
    forw: k.forw,
    bakw: k.bakw,
    angleDeg: bn(k.forw, s.forw),
    forwDist: Math.hypot(k.forw[0] - s.forw[0], k.forw[1] - s.forw[1])
  })), M = [];
  for (let k = 0; k < 36; k++) {
    if (h.has(k)) continue;
    const E = k * 10, T = v.filter((x) => {
      if (x.forwDist === 0) return !1;
      const P = ((x.angleDeg - E) % 360 + 360) % 360;
      return P < 10 + vn || P > 360 - vn;
    });
    let O = null;
    if (T.length > 0) {
      const x = T.reduce((P, R) => R.forwDist > P.forwDist ? R : P);
      O = xn(s.forw, x.forw, l, c, u, f);
    }
    if (!O) {
      const x = (E + 5) % 360 * (Math.PI / 180), P = [
        s.forw[0] + Math.sin(x),
        s.forw[1] + Math.cos(x)
      ];
      O = xn(s.forw, P, l, c, u, f);
    }
    if (!O) continue;
    const [C, $] = O, b = 1e-9 * Math.max(c - l, f - u);
    if ([...y, ...M].some(
      (x) => Math.abs(x.forw[0] - C) <= b && Math.abs(x.forw[1] - $) <= b
    )) continue;
    if (o) {
      M.push({ forw: O, bakw: o(O) });
      continue;
    }
    const B = [O[0] - s.forw[0], O[1] - s.forw[1]], _ = Math.atan2(B[0], B[1]), N = w(_), F = [
      s.bakw[0] + Math.sin(N),
      s.bakw[1] - Math.cos(N)
    ], D = cr(s.bakw, F, y);
    D && M.push({ forw: O, bakw: D });
  }
  const I = [...y, ...M];
  return I.sort(
    (k, E) => Math.atan2(k.forw[0] - s.forw[0], k.forw[1] - s.forw[1]) - Math.atan2(E.forw[0] - s.forw[0], E.forw[1] - s.forw[1])
  ), o || Sn(I, a, s), I;
}
function lr(i, t = !1) {
  return Ye(i, "plain", t, t ? "farLsq" : "min");
}
function fr(i, t = !1) {
  return Ye(i, "birdeye", t, "min");
}
function ur(i, t) {
  const e = /* @__PURE__ */ new Set();
  return Ye(i, "plain", !0, "min", t).filter(({ forw: [n, o] }) => {
    const r = `${n}:${o}`;
    return e.has(r) ? !1 : (e.add(r), !0);
  });
}
function os(i) {
  return Xn(i, 1 / 0);
}
const Mn = 1e5, hr = 16;
function Xn(i, t) {
  return dr(i), new pr(i).findSegmentIntersections(t).map(
    (o) => Yt([o.x, o.y])
  );
}
function dr(i) {
  for (let t = 0, e = i.length; t < e; t++) {
    const n = i[t];
    ne(n) || Lt(
      "findIntersections() received invalid coordinates:",
      `line=${t}`,
      `points=${n}`
    );
    for (let o = 0, r = n.length; o < r; o++) {
      const s = n[o];
      (!ne(s) || !Number.isFinite(s[0]) || !Number.isFinite(s[1])) && Lt(
        "findIntersections() received non-finite coordinates:",
        `line=${t}`,
        `point=${o}`,
        `coordinates=${JSON.stringify(s)}`
      );
    }
  }
}
class pr {
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
    const e = [], n = [], o = t.map((r) => {
      const s = r ? r.length : 0;
      for (let a = 0; a < s; a++)
        e.push(r[a][0]), n.push(r[a][1]);
      return s;
    });
    this.initXYData(o, e, n);
  }
  initXYData(t, e, n) {
    const o = t.length;
    this._xx = new Float64Array(e), this._yy = new Float64Array(n), this._nn = new Uint32Array(t), this._zz = null, this._zlimit = 0, this._filteredArcIter = null, this._ii = new Uint32Array(o);
    let r = 0;
    for (let s = 0; s < o; s++)
      this._ii[s] = r, r += t[s];
    (r != this._xx.length || this._xx.length != this._yy.length) && Lt("ArcCollection#initXYData() Counting error"), this.initBounds(), this._arcIter = new Fr(this._xx, this._yy);
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
    const o = n.length, r = new Float64Array(o * 4), s = new ie();
    let a = 0, l, c, u;
    for (let f = 0; f < o; f++)
      l = n[f], l > 0 && (c = f * 4, u = Cr(t, e, a, l), r[c++] = u[0], r[c++] = u[1], r[c++] = u[2], r[c] = u[3], a += l, s.mergeBounds(u));
    return {
      bb: r,
      bounds: s
    };
  }
  getBounds() {
    return this._allBounds ? this._allBounds.clone() : new ie();
  }
  // @cb function(i, j, xx, yy)
  forEachSegment(t) {
    let e = 0;
    for (let n = 0, o = this.size(); n < o; n++)
      e += this.forEachArcSegment(n, t);
    return e;
  }
  size() {
    return this._ii && this._ii.length || 0;
  }
  // @cb function(i, j, xx, yy)
  forEachArcSegment(t, e) {
    const n = t >= 0, o = n ? t : ~t, r = this.getRetainedInterval(), s = this._nn[o], a = n ? 1 : -1;
    let l = n ? this._ii[o] : this._ii[o] + s - 1, c = l, u = 0;
    for (let f = 1; f < s; f++)
      c += a, (r === 0 || this._zz[c] >= r) && (e(l, c, this._xx, this._yy), l = c, u++);
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
      (o, r, s, a) => {
        t += Math.abs(s[o] - s[r]), e += Math.abs(a[o] - a[r]);
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
    const e = this.getBounds(), n = e.ymin || 0, o = (e.ymax || 0) - n, r = this.calcSegmentIntersectionStripeCount(), s = new Uint32Array(r), a = r > 1 ? (w) => Math.floor((r - 1) * (w - n) / o) : () => 0, l = r + 1;
    let c;
    this.forEachSegment(
      (w, h, v, M) => {
        let I = a(M[w]);
        const k = a(M[h]);
        let E = 0;
        for (; s[I] = s[I] + 2, I != k; )
          E++, E > l && Lt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${r}`,
            `s1=${I}`,
            `s2=${k}`
          ), I += k > I ? 1 : -1;
      }
    );
    const u = this.getUint32Array(wr(s));
    let f = 0;
    const d = [];
    yr(s, (w) => {
      const h = f;
      f += w, d.push(u.subarray(h, f));
    }), vr(s, 0), this.forEachSegment(
      (w, h, v, M) => {
        let I = a(M[w]);
        const k = a(M[h]);
        let E, T, O = 0;
        for (; E = s[I], s[I] = E + 2, T = d[I], T[E] = w, T[E + 1] = h, I != k; )
          O++, O > l && Lt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${r}`,
            `s1=${I}`,
            `s2=${k}`
          ), I += k > I ? 1 : -1;
      }
    );
    const m = this.getVertexData(), y = t * hr;
    let p = 0;
    const S = /* @__PURE__ */ new Set(), A = /* @__PURE__ */ new Map(), g = (w) => {
      p++;
      const h = Pr(w);
      return S.has(h) || (S.add(h), A.set(`${w.x}:${w.y}`, w)), A.size >= t || p >= y;
    };
    if (m.xx && m.yy)
      for (c = 0; c < r && !br(d[c], m.xx, m.yy, g); c++)
        ;
    return Array.from(A.values());
  }
}
function Lt(...i) {
  const t = i.join(" ");
  throw new Error(t);
}
function ne(i) {
  return i ? mr(i) ? !0 : gr(i) ? !1 : i.length === 0 ? !0 : i.length > 0 : !1;
}
function gr(i) {
  return i != null && i.toString === String.prototype.toString;
}
function mr(i) {
  return Array.isArray(i);
}
function wr(i, t) {
  ne(i) || Lt("utils.sum() expects an array, received:", i);
  let e = 0, n;
  for (let o = 0, r = i.length; o < r; o++)
    n = i[o], n && (e += n);
  return e;
}
function yr(i, t, e) {
  if (!ne(i))
    throw new Error(`#forEach() takes an array-like argument. ${i}`);
  for (let n = 0, o = i.length; n < o; n++)
    t.call(e, i[n], n);
}
function vr(i, t) {
  for (let e = 0, n = i.length; e < n; e++)
    i[e] = t;
  return i;
}
function br(i, t, e, n) {
  const o = i.length - 2;
  let r, s, a, l, c, u, f, d, m, y, p, S, A, g, w, h, v;
  for (Tr(t, i), h = 0; h < o; ) {
    for (r = i[h], s = i[h + 1], c = t[r], u = t[s], m = e[r], y = e[s], v = h; v < o && (v += 2, a = i[v], f = t[a], !(u < f)); ) {
      if (p = e[a], l = i[v + 1], d = t[l], S = e[l], m >= p) {
        if (m > S && y > p && y > S) continue;
      } else if (m < S && y < p && y < S) continue;
      if (!(r == a || r == l || s == a || s == l) && (A = xr(
        c,
        m,
        u,
        y,
        f,
        p,
        d,
        S
      ), A && (g = [r, s], w = [a, l], n(En(A, g, w, t, e)) || A.length == 4 && n(En(A.slice(2), g, w, t, e)))))
        return !0;
    }
    h += 2;
  }
  return !1;
}
function xr(i, t, e, n, o, r, s, a) {
  const l = Sr(i, t, e, n, o, r, s, a);
  let c = null;
  return l && (c = Mr(i, t, e, n, o, r, s, a), c ? Br(i, t, e, n, o, r, s, a) && (c = null) : c = Ir(i, t, e, n, o, r, s, a)), c;
}
function Sr(i, t, e, n, o, r, s, a) {
  return Qt(i, t, e, n, o, r) * Qt(i, t, e, n, s, a) <= 0 && Qt(o, r, s, a, i, t) * Qt(o, r, s, a, e, n) <= 0;
}
function Qt(i, t, e, n, o, r) {
  return Ln(i - o, t - r, e - o, n - r);
}
function Ln(i, t, e, n) {
  return i * n - t * e;
}
function Mr(i, t, e, n, o, r, s, a) {
  let l = ge(i, t, e, n, o, r, s, a), c;
  return l && (c = Er(l[0], l[1], i, t, e, n, o, r, s, a), c == 1 ? l = ge(e, n, i, t, o, r, s, a) : c == 2 ? l = ge(o, r, s, a, i, t, e, n) : c == 3 && (l = ge(s, a, o, r, i, t, e, n))), l && Ar(l, i, t, e, n, o, r, s, a), l;
}
function ge(i, t, e, n, o, r, s, a) {
  const l = Ln(e - i, n - t, s - o, a - r), c = 1e-18;
  let u;
  if (l === 0) return null;
  const f = Qt(o, r, s, a, i, t) / l;
  return l <= c && l >= -c ? u = _r(i, t, e, n, o, r, s, a) : u = [i + f * (e - i), t + f * (n - t)], u;
}
function _r(i, t, e, n, o, r, s, a) {
  let l = null;
  return !It(i, o, s) && !It(t, r, a) ? l = [i, t] : !It(e, o, s) && !It(n, r, a) ? l = [e, n] : !It(o, i, e) && !It(r, t, n) ? l = [o, r] : !It(s, i, e) && !It(a, t, n) && (l = [s, a]), l;
}
function It(i, t, e) {
  let n;
  return t < e ? n = i < t || i > e : t > e ? n = i > t || i < e : n = i != t, n;
}
function Er(i, t, ...e) {
  let n = -1, o = 1 / 0, r;
  for (let s = 0, a = 0, l = e.length; a < l; s++, a += 2)
    r = kr(i, t, e[a], e[a + 1]), r < o && (o = r, n = s);
  return n;
}
function kr(i, t, e, n) {
  const o = i - e, r = t - n;
  return o * o + r * r;
}
function Ar(i, t, e, n, o, r, s, a, l) {
  let c = i[0], u = i[1];
  c = me(c, t, n), c = me(c, r, a), u = me(u, e, o), u = me(u, s, l), i[0] = c, i[1] = u;
}
function me(i, t, e) {
  let n;
  return It(i, t, e) && (n = Math.abs(i - t) < Math.abs(i - e) ? t : e, i = n), i;
}
function Ir(i, t, e, n, o, r, s, a) {
  const l = Math.min(i, e, o, s), c = Math.max(i, e, o, s), u = Math.min(t, n, r, a), f = Math.max(t, n, r, a), d = f - u > c - l;
  let m = [];
  return (d ? Ct(t, u, f) : Ct(i, l, c)) && m.push(i, t), (d ? Ct(n, u, f) : Ct(e, l, c)) && m.push(e, n), (d ? Ct(r, u, f) : Ct(o, l, c)) && m.push(o, r), (d ? Ct(a, u, f) : Ct(s, l, c)) && m.push(s, a), (m.length != 2 && m.length != 4 || m.length == 4 && m[0] == m[2] && m[1] == m[3]) && (m = null), m;
}
function Br(i, t, e, n, o, r, s, a) {
  return i == o && t == r || i == s && t == a || e == o && n == r || e == s && n == a;
}
function Ct(i, t, e) {
  return i > t && i < e;
}
function Tr(i, t) {
  Or(i, t), Yn(i, t, 0, t.length - 2);
}
function Or(i, t) {
  for (let e = 0, n = t.length; e < n; e += 2)
    i[t[e]] > i[t[e + 1]] && Nr(t, e, e + 1);
}
function Nr(i, t, e) {
  const n = i[t];
  i[t] = i[e], i[e] = n;
}
function Yn(i, t, e, n) {
  let o = e, r = n, s, a;
  for (; o < n; ) {
    for (s = i[t[e + n >> 2 << 1]]; o <= r; ) {
      for (; i[t[o]] < s; ) o += 2;
      for (; i[t[r]] > s; ) r -= 2;
      o <= r && (a = t[o], t[o] = t[r], t[r] = a, a = t[o + 1], t[o + 1] = t[r + 1], t[r + 1] = a, o += 2, r -= 2);
    }
    if (r - e < 40 ? _n(i, t, e, r) : Yn(i, t, e, r), n - o < 40) {
      _n(i, t, o, n);
      return;
    }
    e = o, r = n;
  }
}
function _n(i, t, e, n) {
  let o, r;
  for (let s = e + 2; s <= n; s += 2) {
    o = t[s], r = t[s + 1];
    let a;
    for (a = s - 2; a >= e && i[o] < i[t[a]]; a -= 2)
      t[a + 2] = t[a], t[a + 3] = t[a + 1];
    t[a + 2] = o, t[a + 3] = r;
  }
}
function En(i, t, e, n, o) {
  const r = i[0], s = i[1];
  t = kn(r, s, t[0], t[1], n, o), e = kn(r, s, e[0], e[1], n, o);
  const a = t[0] < e[0] ? t : e, l = a == t ? e : t;
  return { x: r, y: s, a, b: l };
}
function kn(i, t, e, n, o, r) {
  let s = e < n ? e : n, a = s === e ? n : e;
  return o[s] == i && r[s] == t ? a = s : o[a] == i && r[a] == t && (s = a), [s, a];
}
function Pr(i) {
  return `${i.a.join(",")};${i.b.join(",")}`;
}
class Fr {
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
function Cr(i, t, e, n) {
  let o = e | 0;
  const r = isNaN(n) ? i.length - o : n + o;
  let s, a, l, c, u, f;
  if (r > 0)
    l = u = i[o], c = f = t[o];
  else return [void 0, void 0, void 0, void 0];
  for (o++; o < r; o++)
    s = i[o], a = t[o], s < l && (l = s), s > u && (u = s), a < c && (c = a), a > f && (f = a);
  return [l, c, u, f];
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
  setBounds(t, e, n, o) {
    let r, s, a, l;
    if (arguments.length == 1)
      if (ne(t)) {
        const c = t;
        r = c[0], s = c[1], a = c[2], l = c[3];
      } else {
        const c = t;
        r = c.xmin, s = c.ymin, a = c.xmax, l = c.ymax;
      }
    else
      r = t, s = e, a = n, l = o;
    return this.xmin = r, this.ymin = s, this.xmax = a, this.ymax = l, (r > a || s > l) && this.update(), this;
  }
  update() {
    let t;
    this.xmin > this.xmax && (t = this.xmin, this.xmin = this.xmax, this.xmax = t), this.ymin > this.ymax && (t = this.ymin, this.ymin = this.ymax, this.ymax = t);
  }
  mergeBounds(t, ...e) {
    let n, o, r, s;
    return t instanceof ie ? (n = t.xmin, o = t.ymin, r = t.xmax, s = t.ymax) : e.length == 3 ? (n = t, o = e[0], r = e[1], s = e[2]) : t.length == 4 ? (n = t[0], o = t[1], r = t[2], s = t[3]) : Lt("Bounds#mergeBounds() invalid argument:", t), this.xmin === void 0 ? this.setBounds(n, o, r, s) : (n < this.xmin && (this.xmin = n), o < this.ymin && (this.ymin = o), r > this.xmax && (this.xmax = r), s > this.ymax && (this.ymax = s)), this;
  }
}
function xe(i) {
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
function qn(i, t, e) {
  const n = xe(t.forw), o = xe(t.bakw);
  if (JSON.stringify(n) != JSON.stringify(o))
    throw `${JSON.stringify(t, null, 2)}
${JSON.stringify(
      n
    )}
${JSON.stringify(o)}`;
  for (let r = 0; r < n.length; r++) {
    const s = n[r];
    i[s] || (i[s] = []), i[s].push(t);
  }
  e && (e.forw.features.push(t.forw), e.bakw.features.push(t.bakw));
}
function An(i, t, e) {
  const n = xe(t.forw), o = xe(t.bakw);
  if (JSON.stringify(n) != JSON.stringify(o))
    throw `${JSON.stringify(t, null, 2)}
${JSON.stringify(n)}
${JSON.stringify(o)}`;
  if (n.forEach((r) => {
    const s = i[r];
    if (!s) return;
    const a = s.filter((l) => l !== t);
    a.length === 0 ? delete i[r] : i[r] = a;
  }), e) {
    const r = (s, a) => {
      !s || !a || (s.features = s.features.filter((l) => l !== a));
    };
    r(e.forw, t.forw), r(e.bakw, t.bakw);
  }
}
function we(i, t = 1e-6) {
  const [e, n] = i[0], [o, r] = i[1], [s, a] = i[2];
  return Math.abs((o - e) * (a - n) - (s - e) * (r - n)) < t;
}
function Dr(i, t) {
  const e = /* @__PURE__ */ new Set();
  return i.forEach((n) => {
    if (n.length !== 2) return;
    const o = n.map((r) => `${t?.[r] ?? r}`);
    e.add(o.sort().join("-"));
  }), e;
}
function Zt(i) {
  return ["a", "b", "c"].map((t, e) => ({
    prop: i.properties[t],
    geom: i.geometry.coordinates[0][e]
  }));
}
const Rr = 10;
function $r(i, t, e, n, o, r) {
  if (!i && !t) return !1;
  const s = i ? 0 : 1, a = 1 - s, l = e[s], c = e[a];
  if (!l || !c) return !1;
  const u = bt(c.geom);
  let f = !1, d = !1;
  for (let m = 0; m <= 1; m++) {
    const y = n[m];
    if (!y) continue;
    const p = [String(y.prop.index), String(l.prop.index)].sort().join("-"), S = o[p];
    if (!S || S.length < 2) continue;
    const A = S.find(
      (O) => O.bakw !== r[s].bakw
    );
    if (!A) continue;
    const w = Zt(A.bakw).find(
      (O) => String(O.prop.index) !== String(y.prop.index) && String(O.prop.index) !== String(l.prop.index)
    );
    if (!w) continue;
    f = !0;
    const h = bt(w.geom), v = bt(y.geom), M = bt(l.geom), I = M[0] - v[0], k = M[1] - v[1], E = I * (u[1] - v[1]) - k * (u[0] - v[0]), T = I * (h[1] - v[1]) - k * (h[0] - v[0]);
    if (E * T > 0) {
      d = !0;
      break;
    }
  }
  return f && !d;
}
function Xr(i, t, e, n) {
  if (!i && !t) return !1;
  if (e[0] && e[1] && n[0] && n[1]) {
    const o = n.map((u) => bt(u.geom)), r = e.map((u) => bt(u.geom)), s = o[1][0] - o[0][0], a = o[1][1] - o[0][1], l = s * (r[0][1] - o[0][1]) - a * (r[0][0] - o[0][0]), c = s * (r[1][1] - o[0][1]) - a * (r[1][0] - o[0][0]);
    return l * c < 0;
  }
  return !1;
}
function Lr(i, t, e, n) {
  const o = Dr(e, n), r = /* @__PURE__ */ new Set();
  let s = !1;
  for (let a = 0; a < Rr; a++) {
    let l = !1;
    for (const c of Object.keys(t)) {
      if (r.has(c)) continue;
      r.add(c);
      const u = t[c];
      if (!u || u.length < 2) continue;
      const f = c.split("-");
      if (f.length !== 2 || o.has(c)) continue;
      const d = Zt(u[0].bakw), m = Zt(u[1].bakw), y = Zt(u[0].forw), p = Zt(u[1].forw), S = f.map(
        (x) => d.find((P) => `${P.prop.index}` === x) || m.find((P) => `${P.prop.index}` === x)
      ), A = f.map(
        (x) => y.find((P) => `${P.prop.index}` === x) || p.find((P) => `${P.prop.index}` === x)
      );
      if (S.some((x) => !x) || A.some((x) => !x))
        continue;
      const g = [d, m].map(
        (x) => x.find((P) => !f.includes(`${P.prop.index}`))
      ), w = [y, p].map(
        (x) => x.find((P) => !f.includes(`${P.prop.index}`))
      );
      if (g.some((x) => !x) || w.some((x) => !x))
        continue;
      const h = u[0].bakw.geometry.coordinates[0].slice(0, 3).map((x) => bt(x)), v = u[1].bakw.geometry.coordinates[0].slice(0, 3).map((x) => bt(x)), M = u[0].forw.geometry.coordinates[0].slice(0, 3).map((x) => bt(x)), I = u[1].forw.geometry.coordinates[0].slice(0, 3).map((x) => bt(x)), k = we(h), E = we(v), T = we(M), O = we(I), C = $r(
        k,
        E,
        g,
        S,
        t,
        u
      ), $ = Xr(
        T,
        O,
        g,
        S
      );
      if (!(C || $ || In(
        bt(g[0].geom),
        v
      ) || In(
        bt(g[1].geom),
        h
      )))
        continue;
      const B = A.map(
        (x) => bt(x.geom)
      ), _ = w.map(
        (x) => bt(x.geom)
      ), N = Yr([
        ...B,
        ..._
      ]), F = qr(N), D = Bn(
        B[0],
        B[1],
        _[0]
      ) + Bn(
        B[0],
        B[1],
        _[1]
      );
      Re(F, D) && (An(t, u[0], i), An(t, u[1], i), S.forEach((x) => {
        if (!x) return;
        const P = [
          x.geom,
          g[0].geom,
          g[1].geom,
          x.geom
        ], R = {
          a: x.prop,
          b: g[0].prop,
          c: g[1].prop
        }, X = re([P], R), q = Fn(X);
        qn(t, {
          forw: q,
          bakw: X
        }, i);
      }), l = !0, s = !0);
    }
    if (!l) break;
  }
  return s;
}
function bt(i) {
  return [i[0], i[1]];
}
function In(i, t) {
  const [e, n] = t[0], [o, r] = t[1], [s, a] = t[2], l = s - e, c = a - n, u = o - e, f = r - n, d = i[0] - e, m = i[1] - n, y = l * l + c * c, p = l * u + c * f, S = l * d + c * m, A = u * u + f * f, g = u * d + f * m, w = y * A - p * p;
  if (w === 0) return !1;
  const h = 1 / w, v = (A * S - p * g) * h, M = (y * g - p * S) * h, I = 1e-9;
  return v >= -I && M >= -I && v + M <= 1 + I;
}
function Yr(i) {
  const t = i.map((s) => s.slice()).filter(
    (s, a, l) => l.findIndex(
      (c) => Re(c[0], s[0]) && Re(c[1], s[1])
    ) === a
  );
  if (t.length <= 1) return t;
  const e = t.sort(
    (s, a) => s[0] === a[0] ? s[1] - a[1] : s[0] - a[0]
  ), n = (s, a, l) => (a[0] - s[0]) * (l[1] - s[1]) - (a[1] - s[1]) * (l[0] - s[0]), o = [];
  for (const s of e) {
    for (; o.length >= 2 && n(
      o[o.length - 2],
      o[o.length - 1],
      s
    ) <= 0; )
      o.pop();
    o.push(s);
  }
  const r = [];
  for (let s = e.length - 1; s >= 0; s--) {
    const a = e[s];
    for (; r.length >= 2 && n(
      r[r.length - 2],
      r[r.length - 1],
      a
    ) <= 0; )
      r.pop();
    r.push(a);
  }
  return r.pop(), o.pop(), o.concat(r);
}
function qr(i) {
  if (i.length < 3) return 0;
  let t = 0;
  for (let e = 0; e < i.length; e++) {
    const [n, o] = i[e], [r, s] = i[(e + 1) % i.length];
    t += n * s - r * o;
  }
  return Math.abs(t) / 2;
}
function Bn(i, t, e) {
  return Math.abs(
    (i[0] * (t[1] - e[1]) + t[0] * (e[1] - i[1]) + e[0] * (i[1] - t[1])) / 2
  );
}
function Re(i, t, e = 1e-9) {
  return Math.abs(i - t) <= e;
}
const Ur = (i) => typeof i == "string" && i.startsWith("b");
function Vr(i, t) {
  const e = (n, o) => {
    for (let r = 0; r < 3; r++) {
      const s = n.g[r], a = n.g[(r + 1) % 3];
      if (o.g.every((l) => n.sign * ft(s[0], s[1], a[0], a[1], l[0], l[1]) <= 0)) return !0;
    }
    return !1;
  };
  return !e(i, t) && !e(t, i);
}
function jr(i, t, e) {
  if (t.length === 0) return [];
  const n = i.features.map((p) => {
    const { a: S, b: A, c: g } = p.properties, w = [S.geom, A.geom, g.geom], [h, v, M] = p.geometry.coordinates[0], I = w.map(([O]) => O), k = w.map(([, O]) => O), E = Math.sign(ft(h[0], h[1], v[0], v[1], M[0], M[1])), T = Math.sign(ft(w[0][0], w[0][1], w[1][0], w[1][1], w[2][0], w[2][1]));
    return {
      ids: [S.index, A.index, g.index].map(String),
      g: w,
      sign: T,
      ratio: E * T,
      aux: [S.index, A.index, g.index].some(Ur),
      minx: Math.min(...I),
      maxx: Math.max(...I),
      miny: Math.min(...k),
      maxy: Math.max(...k)
    };
  }), o = n.map((p) => p.ratio), r = o.reduce((p, S) => p + S, 0) < 0 ? -1 : 1, s = (p, S) => p < S ? `${p}|${S}` : `${S}|${p}`, a = /* @__PURE__ */ new Map();
  n.forEach((p, S) => {
    for (let A = 0; A < 3; A++) {
      const g = s(p.ids[A], p.ids[(A + 1) % 3]), w = a.get(g);
      w ? w.push(S) : a.set(g, [S]);
    }
  });
  const l = ([p, S]) => s(String(e[p]), String(e[S])), c = /* @__PURE__ */ new Set();
  for (const p of t) for (const S of a.get(l(p)) ?? []) c.add(S);
  const u = (p) => n[p].aux || c.has(p), f = /* @__PURE__ */ new Set();
  n.forEach((p, S) => {
    u(S) && (o[S] === 0 || o[S] !== r) && f.add(S);
  });
  const d = n.map((p, S) => S).sort((p, S) => n[p].minx - n[S].minx);
  for (let p = 0; p < d.length; p++) {
    const S = n[d[p]];
    if (S.sign !== 0)
      for (let A = p + 1; A < d.length; A++) {
        const g = n[d[A]];
        if (g.minx >= S.maxx) break;
        g.sign === 0 || g.miny >= S.maxy || S.miny >= g.maxy || !u(d[p]) && !u(d[A]) || Vr(S, g) && (f.add(d[p]), f.add(d[A]));
      }
  }
  if (f.size === 0) return [];
  const m = t.filter((p) => (a.get(l(p)) ?? []).some((S) => f.has(S)));
  if (m.length > 0) return m;
  const y = /* @__PURE__ */ new Set();
  for (const p of f) for (const S of n[p].ids) S.startsWith("b") || y.add(S);
  return t.filter(
    ([p, S]) => y.has(String(e[p])) || y.has(String(e[S]))
  );
}
const zr = 4, Tn = 32, Kr = 1, Hr = 0.4, Wr = 4, Gr = 1e-4, Un = 0.25, Jr = 0.01, Dt = (i, t) => String(i) < String(t) ? `${i}|${t}` : `${t}|${i}`;
function Ce(i, t, e) {
  const n = t.filter((c) => !String(c.properties.target.index).startsWith("b")).map((c) => ({
    id: c.properties.target.index,
    paper: c.geometry.coordinates,
    geo: c.properties.target.geom
  })), o = /* @__PURE__ */ new Set();
  let r = 0, s = 0;
  const a = i.features.map((c) => {
    const { a: u, b: f, c: d } = c.properties, [m, y, p] = c.geometry.coordinates[0];
    o.add(Dt(u.index, f.index)), o.add(Dt(u.index, d.index)), o.add(Dt(f.index, d.index));
    const S = Math.sign(ft(m[0], m[1], y[0], y[1], p[0], p[1])) * Math.sign(ft(u.geom[0], u.geom[1], f.geom[0], f.geom[1], d.geom[0], d.geom[1]));
    return S > 0 ? r++ : S < 0 && s++, {
      ids: [String(u.index), String(f.index), String(d.index)],
      paper: [m, y, p],
      geo: [u.geom, f.geom, d.geom],
      sign: S
    };
  }), l = e.filter(([c, u]) => !o.has(Dt(n[c].id, n[u].id)));
  return { points: n, triangles: a, majority: r >= s ? 1 : -1, hullEdges: e, dropped: l };
}
function Vn(i) {
  return [i.foot[0] + i.height * i.normal[0], i.foot[1] + i.height * i.normal[1]];
}
function Qr(i, [t, e], { lambda: n = Un, epsilon: o = Gr } = {}) {
  const { points: r, majority: s } = i, a = r[t], l = r[e], c = r.reduce((_, N) => _ + N.paper[0], 0) / r.length, u = r.reduce((_, N) => _ + N.paper[1], 0) / r.length, f = Math.sign(ft(a.paper[0], a.paper[1], l.paper[0], l.paper[1], c, u));
  if (f === 0) return;
  const d = f * s, m = [l.paper[0] - a.paper[0], l.paper[1] - a.paper[1]], y = [l.geo[0] - a.geo[0], l.geo[1] - a.geo[1]], p = Math.hypot(m[0], m[1]), S = Math.hypot(y[0], y[1]);
  if (!(p > 0 && S > 0)) return;
  const A = [];
  for (const _ of r) {
    if (_ === a || _ === l) continue;
    const N = ft(a.geo[0], a.geo[1], l.geo[0], l.geo[1], _.geo[0], _.geo[1]);
    if (N * d >= 0) continue;
    const F = ((_.geo[0] - a.geo[0]) * y[0] + (_.geo[1] - a.geo[1]) * y[1]) / (S * S), D = ((_.paper[0] - a.paper[0]) * m[0] + (_.paper[1] - a.paper[1]) * m[1]) / (p * p);
    F > 0 && F < 1 && D > 0 && D < 1 && A.push({ id: _.id, u: F, t: D, d: Math.abs(N) / S });
  }
  const g = A.length > 0;
  g || A.push({ u: 0.5, t: 0.5, d: 0 });
  const w = A.reduce((_, N) => N.d > _.d ? N : _);
  let h = 0;
  for (const _ of A)
    h = Math.max(h, _.u <= w.u ? _.d * w.u / _.u : _.d * (1 - w.u) / (1 - _.u));
  h *= 1 + n;
  const v = [-m[1] / p * f, m[0] / p * f], M = [-y[1] / S * d, y[0] / S * d], I = (_) => [
    a.paper[0] + _ * m[0] + o * p * v[0],
    a.paper[1] + _ * m[1] + o * p * v[1]
  ], k = (_, N, F, D) => ({
    paper: I(_),
    foot: [a.geo[0] + N * y[0], a.geo[1] + N * y[1]],
    normal: M,
    height: F,
    chord: S,
    protrusion: w.d,
    ...D === void 0 ? {} : { anchor: D }
  }), E = [k(w.t, w.u, h, g ? w.id : void 0)], T = [...A].sort((_, N) => _.u - N.u), O = [{ u: 0, d: 0 }], C = (_, N, F) => (N.u - _.u) * (F.d - _.d) - (N.d - _.d) * (F.u - _.u);
  for (const _ of [...T, { u: 1, d: 0 }]) {
    for (; O.length >= 2 && C(O[O.length - 2], O[O.length - 1], _) >= 0; ) O.pop();
    O.push(_);
  }
  const $ = n * w.d, b = [];
  let B = 0;
  for (const _ of O.slice(1, -1))
    _.t === void 0 || !(_.t > B) || (B = _.t, b.push(k(_.t, _.u, _.d + $, g ? _.id : void 0)));
  return {
    edge: [a.id, l.id],
    variants: g && b.length > 1 ? [E, b] : [E]
  };
}
function Zr(i, t, e, { lambda: n = Un, mu: o = Jr } = {}) {
  let r = i.map((s, a) => ({ ray: { ...s }, index: a }));
  for (let s = 0; s < Wr && r.length > 0; s++) {
    const a = e(r.map(({ ray: u }) => [u.paper, Vn(u)]));
    if (!a) return;
    let l = !1;
    const c = /* @__PURE__ */ new Set();
    for (const [u, { ray: f }] of r.entries()) {
      const d = `e${t + u}`;
      let m = -1 / 0, y = 1 / 0, p = 0;
      for (const w of a.triangles) {
        const h = w.ids.indexOf(d);
        if (h < 0) continue;
        w.sign !== a.majority && p++;
        const v = w.geo[(h + 1) % 3], M = w.geo[(h + 2) % 3], I = Math.sign(
          ft(
            w.paper[h][0],
            w.paper[h][1],
            w.paper[(h + 1) % 3][0],
            w.paper[(h + 1) % 3][1],
            w.paper[(h + 2) % 3][0],
            w.paper[(h + 2) % 3][1]
          )
        ), k = ft(f.foot[0], f.foot[1], v[0], v[1], M[0], M[1]), E = ft(f.foot[0] + f.normal[0], f.foot[1] + f.normal[1], v[0], v[1], M[0], M[1]) - k, T = I * a.majority;
        if (E === 0) {
          k * T <= 0 && (m = 1 / 0);
          continue;
        }
        const O = -k / E;
        E * T > 0 ? m = Math.max(m, O) : y = Math.min(y, O);
      }
      if (!(m < y)) {
        c.add(u);
        continue;
      }
      const S = Math.min(Math.max(n * Math.max(m, f.protrusion), o * f.chord), (y - m) / 2), A = Math.max(m, 0) + S, g = Math.abs(A - f.height) > 1e-9 * f.chord;
      (p > 0 || g) && (g && (l = !0), f.height = A);
    }
    if (c.size > 0 && (r = r.filter((u, f) => !c.has(f)), l = !0), !l) break;
  }
  if (r.length !== 0)
    return { rays: r.map(({ ray: s }) => s), kept: r.map(({ index: s }) => s) };
}
function ts(i, t) {
  const e = (r) => typeof r == "string" && r.startsWith("e") && Number(r.slice(1)) >= t, n = /* @__PURE__ */ new Set();
  for (const { ids: r } of i.triangles)
    n.add(Dt(r[0], r[1])), n.add(Dt(r[0], r[2])), n.add(Dt(r[1], r[2]));
  const o = /* @__PURE__ */ new Set();
  for (const [r, s] of i.hullEdges)
    for (const a of [r, s])
      if (e(i.points[a].id)) {
        if (!n.has(Dt(i.points[r].id, i.points[s].id))) return !1;
        o.add(a);
      }
  return i.points.every((r, s) => !e(r.id) || o.has(s));
}
function es(i, t) {
  const e = { rounds: 0, builds: 0, cost: 0, budget: 0, batches: 0, perEdge: 0, multiPoint: 0 };
  let n = [], o = [], r = t, s = i.snapshot();
  const a = /* @__PURE__ */ new Set(), l = Kr * i.baseCost;
  e.budget = l;
  const c = i.buildCost();
  let u = 0;
  const f = () => u * Hr + i.buildCost() - c, d = () => f() >= l, m = (S) => {
    if (!d())
      return e.builds++, u++, i.measure(S);
  }, y = (S) => [S.paper, Vn(S)], p = (S) => {
    if (S.length === 0 || n.length + S.length > Tn) return !1;
    const A = i.edgeBase + n.length, g = Zr(
      S.map(({ ray: v }) => v),
      A,
      (v) => m([...n, ...v])
    );
    if (!g || d()) return !1;
    const w = [...n, ...g.rays.map(y)];
    e.builds++;
    const h = i.build(w, Math.max(1, Math.ceil(l - f())));
    return !h || !ts(h.analysis, A) ? (i.restore(s), !1) : (o = o.concat(
      g.rays.map((v, M) => ({
        node: A + M,
        kind: "hullEdge",
        edge: S[g.kept[M]].edge,
        ...v.anchor === void 0 ? {} : { anchor: v.anchor }
      }))
    ), n = w, r = h, s = i.snapshot(), !0);
  };
  for (let S = 1; S <= zr && !d(); S++) {
    const { analysis: A } = r, g = [];
    for (const h of A.dropped) {
      const v = h.map((I) => A.points[I].paper.join(",")).join("|");
      if (a.has(v) || (a.add(v), n.length + g.length + 1 > Tn)) continue;
      const M = Qr(A, h);
      M && g.push(M);
    }
    if (g.length === 0) break;
    e.rounds = S;
    const w = (h, v) => v.map((M) => ({ ray: M, edge: h.edge }));
    if (p(g.flatMap((h) => w(h, h.variants[0])))) {
      e.batches++;
      continue;
    }
    for (const h of g)
      for (const [v, M] of h.variants.entries()) {
        if (d()) break;
        if (p(w(h, M))) {
          e.perEdge++, v > 0 && e.multiPoint++;
          break;
        }
      }
  }
  return i.restore(s), e.cost = f(), { pairs: n, records: o, result: r.result, diagnostics: e };
}
const On = 2.00704, Nn = 3.00001, ns = 12, Pn = /* @__PURE__ */ Symbol("supplement pairs out of budget"), is = 24;
class rt extends Wn {
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
      Gn(t.worldFile), this.requestedWorldFile = { ...t.worldFile };
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
    this.edges = Jn(t), this.edgeNodes = void 0, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 境界ポリゴンを設定します
   */
  setBounds(t) {
    this.bounds = t;
    let e = t[0][0], n = e, o = t[0][1], r = o;
    const s = [t[0]];
    for (let a = 1; a < t.length; a++) {
      const l = t[a];
      l[0] < e && (e = l[0]), l[0] > n && (n = l[0]), l[1] < o && (o = l[1]), l[1] > r && (r = l[1]), s.push(l);
    }
    s.push(t[0]), this.boundsPolygon = re([s]), this.xy = [e, o], this.wh = [n - e, r - o], this.vertexMode = rt.VERTEX_PLAIN, this.tins = void 0, this.indexedTins = void 0;
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
          const o = e[n].features[0], r = o.geometry.coordinates[0][1], s = o.properties.b.geom;
          t.vertices_points[n] = [r, s];
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
    super.setCompiled(t), this.supplementRecords = (t.supplementPairs ?? []).map((o) => ({
      ...o,
      edge: [...o.edge]
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
      (o) => Fn(o)
    );
    this.tins.bakw = xt(t);
    const e = {};
    this.tins.forw.features.forEach((o, r) => {
      const s = this.tins.bakw.features[r];
      qn(e, { forw: o, bakw: s });
    });
    const n = (this.pointsSet?.forw.features ?? []).map(
      (o) => o.properties.target.index
    );
    Lr(
      this.tins,
      e,
      this.pointsSet?.edges || [],
      n
    );
  }
  /** `calculateStrictTin` の後半: 両面の交差を数え、`strict_status` と `kinks` を決める。 */
  detectStrictKinks(t) {
    const e = ["forw", "bakw"].map((n) => {
      const o = this.tins[n].features.map(
        (r) => r.geometry.coordinates[0]
      );
      return Xn(o, t);
    });
    e[0].length === 0 && e[1].length === 0 ? (this.strict_status = rt.STATUS_STRICT, delete this.kinks) : (this.strict_status = rt.STATUS_ERROR, this.kinks = {
      forw: xt(e[0]),
      bakw: xt(e[1])
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
      const r = this.points[o][0], s = this.points[o][1], a = Vt(r, s, o);
      t.forw.push(a), t.bakw.push(jt(a));
    }
    const e = [];
    let n = 0;
    this.edgeNodes = [], this.edges || (this.edges = []);
    for (let o = 0; o < this.edges.length; o++) {
      const r = this.edges[o][2], s = Object.assign([], this.edges[o][0]), a = Object.assign([], this.edges[o][1]);
      if (rs(r, this.points.length, o), s.length === 0 && a.length === 0) {
        e.push(r);
        continue;
      }
      s.unshift(this.points[r[0]][0]), s.push(this.points[r[1]][0]), a.unshift(this.points[r[0]][1]), a.push(this.points[r[1]][1]);
      const l = [s, a].map((c) => {
        const u = c.map((d, m, y) => {
          if (m === 0) return 0;
          const p = y[m - 1];
          return Math.sqrt(
            Math.pow(d[0] - p[0], 2) + Math.pow(d[1] - p[1], 2)
          );
        }), f = u.reduce((d, m, y) => y === 0 ? [0] : (d.push(d[y - 1] + m), d), []);
        return f.map((d, m, y) => {
          const p = d / y[y.length - 1];
          return [c[m], u[m], f[m], p];
        });
      });
      l.map((c, u) => {
        const f = l[u ? 0 : 1];
        return c.filter((d, m) => !(m === 0 || m === c.length - 1 || d[4] === "handled")).flatMap((d) => {
          const m = d[0], y = d[3], p = f.reduce(
            (S, A, g, w) => {
              if (S) return S;
              const h = w[g + 1];
              if (A[3] === y)
                return A[4] = "handled", [A];
              if (A[3] < y && h && h[3] > y)
                return [A, h];
            },
            void 0
          );
          if (p && p.length === 1)
            return u === 0 ? [[m, p[0][0], y]] : [[p[0][0], m, y]];
          if (p && p.length === 2) {
            const S = p[0], A = p[1], g = (y - S[3]) / (A[3] - S[3]), w = [
              (A[0][0] - S[0][0]) * g + S[0][0],
              (A[0][1] - S[0][1]) * g + S[0][1]
            ];
            return u === 0 ? [[m, w, y]] : [[w, m, y]];
          }
          return [];
        });
      }).reduce((c, u) => c.concat(u), []).sort((c, u) => c[2] < u[2] ? -1 : 1).map((c, u, f) => {
        this.edgeNodes[n] = [
          c[0],
          c[1]
        ];
        const d = Vt(
          c[0],
          c[1],
          `e${n}`
        );
        n++, t.forw.push(d), t.bakw.push(jt(d)), u === 0 ? e.push([r[0], t.forw.length - 1]) : e.push([
          t.forw.length - 2,
          t.forw.length - 1
        ]), u === f.length - 1 && e.push([t.forw.length - 1, r[1]]);
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
    const t = this.xy[0] - 0.05 * this.wh[0], e = this.xy[0] + 1.05 * this.wh[0], n = this.xy[1] - 0.05 * this.wh[1], o = this.xy[1] + 1.05 * this.wh[1];
    if (this.bounds && !this.boundsPolygon) throw new Error("Internal error: bounds is set but boundsPolygon is missing");
    const r = this.bounds ? this.boundsPolygon : void 0;
    if (!this.points.reduce((l, c) => l && (r ? Ge(c[0], r) : c[0][0] >= t && c[0][0] <= e && c[0][1] >= n && c[0][1] <= o), !0))
      throw "SOME POINTS OUTSIDE";
    let a = [];
    return this.wh && (a = [[t, n], [e, n], [t, o], [e, o]]), {
      pointsSet: this.generatePointsSet(),
      bbox: a,
      minx: t,
      maxx: e,
      miny: n,
      maxy: o
    };
  }
  /** 余白を加える前の GCP の外接矩形を求める。 */
  computeGcpBbox() {
    let t = 1 / 0, e = -1 / 0, n = 1 / 0, o = -1 / 0;
    for (const r of this.points) {
      const s = r[0][0], a = r[0][1];
      s < t && (t = s), s > e && (e = s), a < n && (n = a), a > o && (o = a);
    }
    return { minx: t, maxx: e, miny: n, maxy: o };
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
    let o, r, s, a, l;
    if (e) {
      if (this.bounds) {
        const T = this.boundsPolygon;
        if (!T) throw new Error("Internal error: bounds is set but boundsPolygon is missing");
        if (!this.points.every(
          (C) => Ge(C[0], T)
        )) throw "SOME POINTS OUTSIDE";
      }
      o = this.generatePointsSet(), { minx: r, maxx: s, miny: a, maxy: l } = this.computeGcpBbox();
    } else {
      const T = this.validateAndPrepareInputs();
      o = T.pointsSet, r = T.minx, s = T.maxx, a = T.miny, l = T.maxy;
    }
    const c = {
      forw: xt([...o.forw]),
      bakw: xt([...o.bakw])
    }, u = pe(
      c.forw,
      o.edges,
      "target"
    ), f = pe(
      c.bakw,
      o.edges,
      "target"
    );
    if (u.features.length === 0 || f.features.length === 0)
      throw "TOO LINEAR1";
    const d = Bi(c.forw), m = fn(c.forw);
    if (!m) throw "TOO LINEAR2";
    const y = {}, p = m.geometry.coordinates[0];
    let S;
    try {
      S = p.map((T) => ({
        forw: T,
        bakw: Me(Yt(T), u)
      })), S.forEach((T) => {
        y[`${T.forw[0]}:${T.forw[1]}`] = T;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const A = fn(c.bakw);
    if (!A) throw "TOO LINEAR2";
    const g = A.geometry.coordinates[0];
    try {
      S = g.map((T) => ({
        bakw: T,
        forw: Me(Yt(T), f)
      })), S.forEach((T) => {
        y[`${T.forw[0]}:${T.forw[1]}`] = T;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const w = {
      forw: d.geometry.coordinates,
      bakw: Me(d, u)
    }, h = Vt(w.forw, w.bakw, "c");
    this.centroid = {
      forw: h,
      bakw: jt(h)
    };
    const v = [
      ...this.points.map((T) => ({ forw: T[0], bakw: T[1] })),
      ...(this.edgeNodes ?? []).map((T) => ({ forw: T[0], bakw: T[1] }))
    ], M = {
      convexBuf: y,
      centroid: w,
      allGcps: v,
      minx: r,
      maxx: s,
      miny: a,
      maxy: l
    };
    if (n) {
      this.stateTriangle = void 0;
      const T = this.yaxisMode === rt.YAXIS_FOLLOW, O = T ? 1 : -1, { boundary: C } = this.buildWithSupplements(t, o, v, ($, b, B) => (_) => ({ boundary: yn(
        M,
        (N) => ur(N, (F) => {
          const [D, x] = Qn(n, F);
          return [D, T ? -x : x];
        }),
        o,
        this.points.length,
        {
          orientation: O,
          accept: (N) => N.hasMapBoundary ? (this.buildTin(o, N.vertices, b, N, _.size > 0, B), (this.strict_status !== rt.STATUS_LOOSE || N.hasBoundary) && be(this.tins.forw, O) === 0 && be(this.tins.bakw, O) === 0) : !1
        },
        _,
        $
      ) }));
      if (C) {
        this.compiledOuter = {
          outerTransform: "worldFile",
          worldFile: n,
          vertices_points: C.vertices.map(({ forw: N, bakw: F }) => [N, F])
        };
        const { centroid: $, xy: b, wh: B, kinks: _ } = this;
        super.setCompiled(this.getCompiled()), Object.assign(this, { centroid: $, xy: b, wh: B, kinks: _ }), this.lastBoundaryDiagnostics = {
          ...C.diagnostics,
          requestedOuterTransform: "worldFile",
          outerTransform: "worldFile"
        };
        return;
      }
      this.compiledOuter = { outerTransform: "extrapolate" }, this.outerTransform = "extrapolate", this.worldFile = void 0;
    }
    const I = this.vertexMode === rt.VERTEX_BIRDEYE ? fr : lr;
    let k, E;
    e ? { boundary: k, verticesList: E } = this.buildWithSupplements(t, o, v, (T, O, C) => ($) => {
      const b = yn(
        M,
        I,
        o,
        this.points.length,
        void 0,
        $,
        T
      );
      return {
        boundary: b,
        verticesList: this.buildTin(
          o,
          b?.vertices ?? I(M, !1),
          O,
          b,
          $.size > 0,
          C
        )
      };
    }) : E = this.buildTin(
      o,
      I(M, !1),
      t,
      void 0
    ), this.vertices_params = {
      forw: gn(E.forw, this.centroid.forw),
      bakw: gn(E.bakw, this.centroid.bakw)
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
  buildWithSupplements(t, e, n, o) {
    let r = 0;
    const s = (M, I, k) => {
      const E = o(M, I, k);
      return (T) => (r++, E(T));
    }, a = (M) => this.buildWithHull(M, s(/* @__PURE__ */ new Map(), M, !1));
    if (!this.useSupplementPairs || this.useV2Algorithm || t === rt.MODE_LOOSE) return a(t);
    const l = t, c = a(l), u = r;
    let f = 0;
    if (!c.boundary || this.strict_status !== rt.STATUS_STRICT) return c;
    const d = Ce(this.tins.forw, this.pointsSet.forw.features, c.boundary.forwHull.all);
    if (d.dropped.length === 0) return c;
    const m = this.edgeNodes.length, y = e.forw.length, p = n.length;
    let S = [], A;
    const g = (M, I) => M.length === I.length && M.every((k, E) => k.every((T, O) => T[0] === I[E][O][0] && T[1] === I[E][O][1])), w = (M) => {
      e.forw.length = y, e.bakw.length = y, n.length = p, this.edgeNodes.length = m;
      for (const [I, k] of M) {
        const E = Vt(I, k, `e${this.edgeNodes.length}`);
        this.edgeNodes.push([I, k]), e.forw.push(E), e.bakw.push(jt(E)), n.push({ forw: I, bakw: k });
      }
      S = M;
    }, v = es({
      edgeBase: m,
      baseCost: u,
      buildCost: () => f,
      snapshot: () => ({ pairs: S, state: this.captureBuild() }),
      restore: ({ pairs: M, state: I }) => {
        w(M), this.restoreBuild(I);
      },
      measure: (M) => {
        w(M);
        const I = this.captureBuild();
        try {
          const k = /* @__PURE__ */ new Map();
          A = { pairs: M, cache: k };
          const { boundary: E } = o(k, rt.MODE_STRICT, !0)(/* @__PURE__ */ new Set());
          return E ? Ce(this.tins.forw, this.pointsSet.forw.features, []) : void 0;
        } finally {
          this.restoreBuild(I);
        }
      },
      build: (M, I) => {
        w(M);
        const k = A && g(A.pairs, M) ? A.cache : /* @__PURE__ */ new Map(), E = r;
        let T;
        try {
          T = this.buildWithHull(l, (O) => {
            if (r - E >= I) throw Pn;
            return s(k, l, !1)(O);
          });
        } catch (O) {
          if (O !== Pn) throw O;
          f += r - E;
          return;
        }
        if (f += r - E, !(!T.boundary || this.strict_status !== rt.STATUS_STRICT))
          return {
            result: T,
            analysis: Ce(this.tins.forw, this.pointsSet.forw.features, T.boundary.forwHull.all)
          };
      }
    }, { result: c, analysis: d });
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
    let o;
    const r = (p) => [...p].sort().join(","), s = (p, S = !1) => {
      const A = r(p), g = n.get(A);
      if (g) return g;
      const w = e(p), h = {
        value: w,
        strict: w.boundary !== void 0 && this.strict_status === rt.STATUS_STRICT
      };
      return (h.strict || S) && (h.state = this.captureBuild()), n.set(A, h), o = h, h;
    }, a = (p) => (o !== p && this.restoreBuild(p.state), o = p, p.value), l = s(/* @__PURE__ */ new Set(), !0);
    if (!(t === rt.MODE_STRICT || t === rt.MODE_AUTO) || !l.value.boundary || l.strict) return l.value;
    const u = new Set(l.value.boundary.forwHull.all.map(ve)), f = () => this.pointsSet.forw.features.map(
      (p) => p.properties.target.index
    ), d = /* @__PURE__ */ new Set();
    let m = l, y;
    for (let p = 0; p < ns; p++) {
      const S = jr(
        this.tins.forw,
        m.value.boundary.forwHull.applied,
        f()
      ).filter((A) => !d.has(ve(A)));
      if (S.length === 0) break;
      for (const A of S) d.add(ve(A));
      if (m = s(d), !m.value.boundary) break;
      if (m.strict) {
        y = m;
        break;
      }
    }
    if (y) {
      let p = y;
      for (const S of [...d].slice(0, is)) {
        const A = new Set(d);
        A.delete(S);
        const g = s(A);
        g.strict && (d.delete(S), p = g);
      }
      return a(p);
    }
    if (d.size < u.size) {
      const p = s(u);
      if (p.strict) return a(p);
    }
    return a(l);
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
  buildTin(t, e, n, o, r = !1, s = !1) {
    const a = {
      forw: [],
      bakw: []
    };
    for (let l = 0; l < e.length; l++) {
      const c = e[l].forw, u = e[l].bakw, f = Vt(c, u, `b${l}`), d = jt(f);
      a.forw.push(f), a.bakw.push(d);
    }
    return this.pointsSet = {
      forw: xt([...t.forw, ...a.forw]),
      bakw: xt([...t.bakw, ...a.bakw]),
      edges: t.edges
    }, this.tins = {
      forw: Ve(
        o?.forw ?? pe(this.pointsSet.forw, t.edges, "target")
      )
    }, (n === rt.MODE_STRICT || n === rt.MODE_AUTO) && (s ? this.resolveStrictOverlaps() : this.calculateStrictTin(
      n === rt.MODE_AUTO || r ? 1 : Mn
    )), (n === rt.MODE_LOOSE || n === rt.MODE_AUTO && this.strict_status === rt.STATUS_ERROR) && (this.tins.bakw = Ve(
      o?.bakw ?? pe(this.pointsSet.bakw, t.edges, "target")
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
function rs(i, t, e) {
  const n = (o) => Number.isInteger(o) && o >= 0 && o < t;
  if (!Array.isArray(i) || !n(i[0]) || !n(i[1]))
    throw new Error(
      `Invalid edge at edges[${e}]: start/end ${JSON.stringify(i)} must be integer indices of points (0 to ${t - 1})`
    );
}
export {
  rt as Tin,
  pe as constrainedTin,
  jt as counterPoint,
  Vt as createPoint,
  rt as default,
  os as findIntersections,
  On as format_version,
  qn as insertSearchIndex,
  gn as vertexCalc
};
