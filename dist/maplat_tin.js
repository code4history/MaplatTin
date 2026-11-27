import { counterTri as $n, Transform as ei, validateWorldFile as ni, normalizeEdges as ii, transformArr as Me, rotateVerticesTriangle as Ve, worldFileToCrs as ri } from "@maplat/transform";
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
  if (!Ge(i[0]) || !Ge(i[1]))
    throw new Error("coordinates must contain numbers");
  return ee({
    type: "Point",
    coordinates: i
  }, t, e);
}
function re(i, t, e = {}) {
  for (const s of i) {
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
    coordinates: i
  }, t, e);
}
function ze(i, t, e = {}) {
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
function Ge(i) {
  return !isNaN(i) && i !== null && !Array.isArray(i);
}
function si(i) {
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
function oi(i) {
  return i.type === "Feature" ? i.geometry : i;
}
function Xe(i, t, e) {
  if (i !== null)
    for (var n, s, o, r, a, c, l, f = 0, u = 0, h, b = i.type, y = b === "FeatureCollection", p = b === "Feature", M = y ? i.features.length : 1, I = 0; I < M; I++) {
      l = y ? (
        // @ts-expect-error: Known type conflict
        i.features[I].geometry
      ) : p ? (
        // @ts-expect-error: Known type conflict
        i.geometry
      ) : i, h = l ? l.type === "GeometryCollection" : !1, a = h ? l.geometries.length : 1;
      for (var g = 0; g < a; g++) {
        var w = 0, d = 0;
        if (r = h ? l.geometries[g] : l, r !== null) {
          c = r.coordinates;
          var m = r.type;
          switch (f = e && (m === "Polygon" || m === "MultiPolygon") ? 1 : 0, m) {
            case null:
              break;
            case "Point":
              if (
                // @ts-expect-error: Known type conflict
                t(
                  c,
                  u,
                  I,
                  w,
                  d
                ) === !1
              )
                return !1;
              u++, w++;
              break;
            case "LineString":
            case "MultiPoint":
              for (n = 0; n < c.length; n++) {
                if (
                  // @ts-expect-error: Known type conflict
                  t(
                    c[n],
                    u,
                    I,
                    w,
                    d
                  ) === !1
                )
                  return !1;
                u++, m === "MultiPoint" && w++;
              }
              m === "LineString" && w++;
              break;
            case "Polygon":
            case "MultiLineString":
              for (n = 0; n < c.length; n++) {
                for (s = 0; s < c[n].length - f; s++) {
                  if (
                    // @ts-expect-error: Known type conflict
                    t(
                      c[n][s],
                      u,
                      I,
                      w,
                      d
                    ) === !1
                  )
                    return !1;
                  u++;
                }
                m === "MultiLineString" && w++, m === "Polygon" && d++;
              }
              m === "Polygon" && w++;
              break;
            case "MultiPolygon":
              for (n = 0; n < c.length; n++) {
                for (d = 0, s = 0; s < c[n].length; s++) {
                  for (o = 0; o < c[n][s].length - f; o++) {
                    if (
                      // @ts-expect-error: Known type conflict
                      t(
                        c[n][s][o],
                        u,
                        I,
                        w,
                        d
                      ) === !1
                    )
                      return !1;
                    u++;
                  }
                  d++;
                }
                w++;
              }
              break;
            case "GeometryCollection":
              for (n = 0; n < r.geometries.length; n++)
                if (
                  // @ts-expect-error: Known type conflict
                  Xe(r.geometries[n], t, e) === !1
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
const pt = 11102230246251565e-32, V = 134217729, Xn = (3 + 8 * pt) * pt;
function ht(i, t, e, n, s) {
  let o, r, a, c, l = t[0], f = n[0], u = 0, h = 0;
  f > l == f > -l ? (o = l, l = t[++u]) : (o = f, f = n[++h]);
  let b = 0;
  if (u < i && h < e)
    for (f > l == f > -l ? (r = l + o, a = o - (r - l), l = t[++u]) : (r = f + o, a = o - (r - f), f = n[++h]), o = r, a !== 0 && (s[b++] = a); u < i && h < e; )
      f > l == f > -l ? (r = o + l, c = r - o, a = o - (r - c) + (l - c), l = t[++u]) : (r = o + f, c = r - o, a = o - (r - c) + (f - c), f = n[++h]), o = r, a !== 0 && (s[b++] = a);
  for (; u < i; )
    r = o + l, c = r - o, a = o - (r - c) + (l - c), l = t[++u], o = r, a !== 0 && (s[b++] = a);
  for (; h < e; )
    r = o + f, c = r - o, a = o - (r - c) + (f - c), f = n[++h], o = r, a !== 0 && (s[b++] = a);
  return (o !== 0 || b === 0) && (s[b++] = o), b;
}
function Mt(i, t, e, n, s, o, r, a) {
  return ht(ht(i, t, e, n, r), r, s, o, a);
}
function q(i, t, e, n) {
  let s, o, r, a, c, l, f, u, h, b, y;
  f = V * e, b = f - (f - e), y = e - b;
  let p = t[0];
  s = p * e, f = V * p, u = f - (f - p), h = p - u, r = h * y - (s - u * b - h * b - u * y);
  let M = 0;
  r !== 0 && (n[M++] = r);
  for (let I = 1; I < i; I++)
    p = t[I], a = p * e, f = V * p, u = f - (f - p), h = p - u, c = h * y - (a - u * b - h * b - u * y), o = s + c, l = o - s, r = s - (o - l) + (c - l), r !== 0 && (n[M++] = r), s = a + o, r = o - (s - a), r !== 0 && (n[M++] = r);
  return (s !== 0 || M === 0) && (n[M++] = s), M;
}
function Ln(i, t) {
  let e = t[0];
  for (let n = 1; n < i; n++) e += t[n];
  return e;
}
function tt(i) {
  return new Float64Array(i);
}
const ai = (3 + 16 * pt) * pt, ci = (2 + 12 * pt) * pt, li = (9 + 64 * pt) * pt * pt, Ut = tt(4), He = tt(8), Ke = tt(12), We = tt(16), gt = tt(4);
function ui(i, t, e, n, s, o, r) {
  let a, c, l, f, u, h, b, y, p, M, I, g, w, d, m, v, E, k;
  const A = i - s, O = e - s, B = t - o, D = n - o;
  d = A * D, h = V * A, b = h - (h - A), y = A - b, h = V * D, p = h - (h - D), M = D - p, m = y * M - (d - b * p - y * p - b * M), v = B * O, h = V * B, b = h - (h - B), y = B - b, h = V * O, p = h - (h - O), M = O - p, E = y * M - (v - b * p - y * p - b * M), I = m - E, u = m - I, Ut[0] = m - (I + u) + (u - E), g = d + I, u = g - d, w = d - (g - u) + (I - u), I = w - v, u = w - I, Ut[1] = w - (I + u) + (u - v), k = g + I, u = k - g, Ut[2] = g - (k - u) + (I - u), Ut[3] = k;
  let C = Ln(4, Ut), x = ci * r;
  if (C >= x || -C >= x || (u = i - A, a = i - (A + u) + (u - s), u = e - O, l = e - (O + u) + (u - s), u = t - B, c = t - (B + u) + (u - o), u = n - D, f = n - (D + u) + (u - o), a === 0 && c === 0 && l === 0 && f === 0) || (x = li * r + Xn * Math.abs(C), C += A * f + D * a - (B * l + O * c), C >= x || -C >= x)) return C;
  d = a * D, h = V * a, b = h - (h - a), y = a - b, h = V * D, p = h - (h - D), M = D - p, m = y * M - (d - b * p - y * p - b * M), v = c * O, h = V * c, b = h - (h - c), y = c - b, h = V * O, p = h - (h - O), M = O - p, E = y * M - (v - b * p - y * p - b * M), I = m - E, u = m - I, gt[0] = m - (I + u) + (u - E), g = d + I, u = g - d, w = d - (g - u) + (I - u), I = w - v, u = w - I, gt[1] = w - (I + u) + (u - v), k = g + I, u = k - g, gt[2] = g - (k - u) + (I - u), gt[3] = k;
  const T = ht(4, Ut, 4, gt, He);
  d = A * f, h = V * A, b = h - (h - A), y = A - b, h = V * f, p = h - (h - f), M = f - p, m = y * M - (d - b * p - y * p - b * M), v = B * l, h = V * B, b = h - (h - B), y = B - b, h = V * l, p = h - (h - l), M = l - p, E = y * M - (v - b * p - y * p - b * M), I = m - E, u = m - I, gt[0] = m - (I + u) + (u - E), g = d + I, u = g - d, w = d - (g - u) + (I - u), I = w - v, u = w - I, gt[1] = w - (I + u) + (u - v), k = g + I, u = k - g, gt[2] = g - (k - u) + (I - u), gt[3] = k;
  const _ = ht(T, He, 4, gt, Ke);
  d = a * f, h = V * a, b = h - (h - a), y = a - b, h = V * f, p = h - (h - f), M = f - p, m = y * M - (d - b * p - y * p - b * M), v = c * l, h = V * c, b = h - (h - c), y = c - b, h = V * l, p = h - (h - l), M = l - p, E = y * M - (v - b * p - y * p - b * M), I = m - E, u = m - I, gt[0] = m - (I + u) + (u - E), g = d + I, u = g - d, w = d - (g - u) + (I - u), I = w - v, u = w - I, gt[1] = w - (I + u) + (u - v), k = g + I, u = k - g, gt[2] = g - (k - u) + (I - u), gt[3] = k;
  const N = ht(_, Ke, 4, gt, We);
  return We[N - 1];
}
function lt(i, t, e, n, s, o) {
  const r = (t - o) * (e - s), a = (i - s) * (n - o), c = r - a, l = Math.abs(r + a);
  return Math.abs(c) >= ai * l ? c : -ui(i, t, e, n, s, o, l);
}
const fi = (10 + 96 * pt) * pt, hi = (4 + 48 * pt) * pt, di = (44 + 576 * pt) * pt * pt, Ot = tt(4), Nt = tt(4), Ft = tt(4), _t = tt(4), Et = tt(4), kt = tt(4), mt = tt(4), wt = tt(4), _e = tt(8), Ee = tt(8), ke = tt(8), Ae = tt(8), Ie = tt(8), Te = tt(8), oe = tt(8), ae = tt(8), ce = tt(8), Pt = tt(4), $t = tt(4), Xt = tt(4), H = tt(8), Z = tt(16), it = tt(16), rt = tt(16), et = tt(32), Rt = tt(32), ut = tt(48), vt = tt(64);
let Gt = tt(1152), Be = tt(1152);
function ft(i, t, e) {
  i = ht(i, Gt, t, e, Be);
  const n = Gt;
  return Gt = Be, Be = n, i;
}
function pi(i, t, e, n, s, o, r, a, c) {
  let l, f, u, h, b, y, p, M, I, g, w, d, m, v, E, k, A, O, B, D, C, x, T, _, N, R, P, S, F, $, L, j, Y, X, U;
  const G = i - r, z = e - r, K = s - r, W = t - a, Q = n - a, J = o - a;
  L = z * J, T = V * z, _ = T - (T - z), N = z - _, T = V * J, R = T - (T - J), P = J - R, j = N * P - (L - _ * R - N * R - _ * P), Y = K * Q, T = V * K, _ = T - (T - K), N = K - _, T = V * Q, R = T - (T - Q), P = Q - R, X = N * P - (Y - _ * R - N * R - _ * P), S = j - X, x = j - S, Ot[0] = j - (S + x) + (x - X), F = L + S, x = F - L, $ = L - (F - x) + (S - x), S = $ - Y, x = $ - S, Ot[1] = $ - (S + x) + (x - Y), U = F + S, x = U - F, Ot[2] = F - (U - x) + (S - x), Ot[3] = U, L = K * W, T = V * K, _ = T - (T - K), N = K - _, T = V * W, R = T - (T - W), P = W - R, j = N * P - (L - _ * R - N * R - _ * P), Y = G * J, T = V * G, _ = T - (T - G), N = G - _, T = V * J, R = T - (T - J), P = J - R, X = N * P - (Y - _ * R - N * R - _ * P), S = j - X, x = j - S, Nt[0] = j - (S + x) + (x - X), F = L + S, x = F - L, $ = L - (F - x) + (S - x), S = $ - Y, x = $ - S, Nt[1] = $ - (S + x) + (x - Y), U = F + S, x = U - F, Nt[2] = F - (U - x) + (S - x), Nt[3] = U, L = G * Q, T = V * G, _ = T - (T - G), N = G - _, T = V * Q, R = T - (T - Q), P = Q - R, j = N * P - (L - _ * R - N * R - _ * P), Y = z * W, T = V * z, _ = T - (T - z), N = z - _, T = V * W, R = T - (T - W), P = W - R, X = N * P - (Y - _ * R - N * R - _ * P), S = j - X, x = j - S, Ft[0] = j - (S + x) + (x - X), F = L + S, x = F - L, $ = L - (F - x) + (S - x), S = $ - Y, x = $ - S, Ft[1] = $ - (S + x) + (x - Y), U = F + S, x = U - F, Ft[2] = F - (U - x) + (S - x), Ft[3] = U, l = ht(
    ht(
      ht(
        q(q(4, Ot, G, H), H, G, Z),
        Z,
        q(q(4, Ot, W, H), H, W, it),
        it,
        et
      ),
      et,
      ht(
        q(q(4, Nt, z, H), H, z, Z),
        Z,
        q(q(4, Nt, Q, H), H, Q, it),
        it,
        Rt
      ),
      Rt,
      vt
    ),
    vt,
    ht(
      q(q(4, Ft, K, H), H, K, Z),
      Z,
      q(q(4, Ft, J, H), H, J, it),
      it,
      et
    ),
    et,
    Gt
  );
  let at = Ln(l, Gt), ct = hi * c;
  if (at >= ct || -at >= ct || (x = i - G, f = i - (G + x) + (x - r), x = t - W, b = t - (W + x) + (x - a), x = e - z, u = e - (z + x) + (x - r), x = n - Q, y = n - (Q + x) + (x - a), x = s - K, h = s - (K + x) + (x - r), x = o - J, p = o - (J + x) + (x - a), f === 0 && u === 0 && h === 0 && b === 0 && y === 0 && p === 0) || (ct = di * c + Xn * Math.abs(at), at += (G * G + W * W) * (z * p + J * u - (Q * h + K * y)) + 2 * (G * f + W * b) * (z * J - Q * K) + ((z * z + Q * Q) * (K * b + W * h - (J * f + G * p)) + 2 * (z * u + Q * y) * (K * W - J * G)) + ((K * K + J * J) * (G * y + Q * f - (W * u + z * b)) + 2 * (K * h + J * p) * (G * Q - W * z)), at >= ct || -at >= ct))
    return at;
  if ((u !== 0 || y !== 0 || h !== 0 || p !== 0) && (L = G * G, T = V * G, _ = T - (T - G), N = G - _, j = N * N - (L - _ * _ - (_ + _) * N), Y = W * W, T = V * W, _ = T - (T - W), N = W - _, X = N * N - (Y - _ * _ - (_ + _) * N), S = j + X, x = S - j, _t[0] = j - (S - x) + (X - x), F = L + S, x = F - L, $ = L - (F - x) + (S - x), S = $ + Y, x = S - $, _t[1] = $ - (S - x) + (Y - x), U = F + S, x = U - F, _t[2] = F - (U - x) + (S - x), _t[3] = U), (h !== 0 || p !== 0 || f !== 0 || b !== 0) && (L = z * z, T = V * z, _ = T - (T - z), N = z - _, j = N * N - (L - _ * _ - (_ + _) * N), Y = Q * Q, T = V * Q, _ = T - (T - Q), N = Q - _, X = N * N - (Y - _ * _ - (_ + _) * N), S = j + X, x = S - j, Et[0] = j - (S - x) + (X - x), F = L + S, x = F - L, $ = L - (F - x) + (S - x), S = $ + Y, x = S - $, Et[1] = $ - (S - x) + (Y - x), U = F + S, x = U - F, Et[2] = F - (U - x) + (S - x), Et[3] = U), (f !== 0 || b !== 0 || u !== 0 || y !== 0) && (L = K * K, T = V * K, _ = T - (T - K), N = K - _, j = N * N - (L - _ * _ - (_ + _) * N), Y = J * J, T = V * J, _ = T - (T - J), N = J - _, X = N * N - (Y - _ * _ - (_ + _) * N), S = j + X, x = S - j, kt[0] = j - (S - x) + (X - x), F = L + S, x = F - L, $ = L - (F - x) + (S - x), S = $ + Y, x = S - $, kt[1] = $ - (S - x) + (Y - x), U = F + S, x = U - F, kt[2] = F - (U - x) + (S - x), kt[3] = U), f !== 0 && (M = q(4, Ot, f, _e), l = ft(l, Mt(
    q(M, _e, 2 * G, Z),
    Z,
    q(q(4, kt, f, H), H, Q, it),
    it,
    q(q(4, Et, f, H), H, -J, rt),
    rt,
    et,
    ut
  ), ut)), b !== 0 && (I = q(4, Ot, b, Ee), l = ft(l, Mt(
    q(I, Ee, 2 * W, Z),
    Z,
    q(q(4, Et, b, H), H, K, it),
    it,
    q(q(4, kt, b, H), H, -z, rt),
    rt,
    et,
    ut
  ), ut)), u !== 0 && (g = q(4, Nt, u, ke), l = ft(l, Mt(
    q(g, ke, 2 * z, Z),
    Z,
    q(q(4, _t, u, H), H, J, it),
    it,
    q(q(4, kt, u, H), H, -W, rt),
    rt,
    et,
    ut
  ), ut)), y !== 0 && (w = q(4, Nt, y, Ae), l = ft(l, Mt(
    q(w, Ae, 2 * Q, Z),
    Z,
    q(q(4, kt, y, H), H, G, it),
    it,
    q(q(4, _t, y, H), H, -K, rt),
    rt,
    et,
    ut
  ), ut)), h !== 0 && (d = q(4, Ft, h, Ie), l = ft(l, Mt(
    q(d, Ie, 2 * K, Z),
    Z,
    q(q(4, Et, h, H), H, W, it),
    it,
    q(q(4, _t, h, H), H, -Q, rt),
    rt,
    et,
    ut
  ), ut)), p !== 0 && (m = q(4, Ft, p, Te), l = ft(l, Mt(
    q(m, Te, 2 * J, Z),
    Z,
    q(q(4, _t, p, H), H, z, it),
    it,
    q(q(4, Et, p, H), H, -G, rt),
    rt,
    et,
    ut
  ), ut)), f !== 0 || b !== 0) {
    if (u !== 0 || y !== 0 || h !== 0 || p !== 0 ? (L = u * J, T = V * u, _ = T - (T - u), N = u - _, T = V * J, R = T - (T - J), P = J - R, j = N * P - (L - _ * R - N * R - _ * P), Y = z * p, T = V * z, _ = T - (T - z), N = z - _, T = V * p, R = T - (T - p), P = p - R, X = N * P - (Y - _ * R - N * R - _ * P), S = j + X, x = S - j, mt[0] = j - (S - x) + (X - x), F = L + S, x = F - L, $ = L - (F - x) + (S - x), S = $ + Y, x = S - $, mt[1] = $ - (S - x) + (Y - x), U = F + S, x = U - F, mt[2] = F - (U - x) + (S - x), mt[3] = U, L = h * -Q, T = V * h, _ = T - (T - h), N = h - _, T = V * -Q, R = T - (T - -Q), P = -Q - R, j = N * P - (L - _ * R - N * R - _ * P), Y = K * -y, T = V * K, _ = T - (T - K), N = K - _, T = V * -y, R = T - (T - -y), P = -y - R, X = N * P - (Y - _ * R - N * R - _ * P), S = j + X, x = S - j, wt[0] = j - (S - x) + (X - x), F = L + S, x = F - L, $ = L - (F - x) + (S - x), S = $ + Y, x = S - $, wt[1] = $ - (S - x) + (Y - x), U = F + S, x = U - F, wt[2] = F - (U - x) + (S - x), wt[3] = U, E = ht(4, mt, 4, wt, ae), L = u * p, T = V * u, _ = T - (T - u), N = u - _, T = V * p, R = T - (T - p), P = p - R, j = N * P - (L - _ * R - N * R - _ * P), Y = h * y, T = V * h, _ = T - (T - h), N = h - _, T = V * y, R = T - (T - y), P = y - R, X = N * P - (Y - _ * R - N * R - _ * P), S = j - X, x = j - S, $t[0] = j - (S + x) + (x - X), F = L + S, x = F - L, $ = L - (F - x) + (S - x), S = $ - Y, x = $ - S, $t[1] = $ - (S + x) + (x - Y), U = F + S, x = U - F, $t[2] = F - (U - x) + (S - x), $t[3] = U, O = 4) : (ae[0] = 0, E = 1, $t[0] = 0, O = 1), f !== 0) {
      const st = q(E, ae, f, rt);
      l = ft(l, ht(
        q(M, _e, f, Z),
        Z,
        q(st, rt, 2 * G, et),
        et,
        ut
      ), ut);
      const ot = q(O, $t, f, H);
      l = ft(l, Mt(
        q(ot, H, 2 * G, Z),
        Z,
        q(ot, H, f, it),
        it,
        q(st, rt, f, et),
        et,
        Rt,
        vt
      ), vt), y !== 0 && (l = ft(l, q(q(4, kt, f, H), H, y, Z), Z)), p !== 0 && (l = ft(l, q(q(4, Et, -f, H), H, p, Z), Z));
    }
    if (b !== 0) {
      const st = q(E, ae, b, rt);
      l = ft(l, ht(
        q(I, Ee, b, Z),
        Z,
        q(st, rt, 2 * W, et),
        et,
        ut
      ), ut);
      const ot = q(O, $t, b, H);
      l = ft(l, Mt(
        q(ot, H, 2 * W, Z),
        Z,
        q(ot, H, b, it),
        it,
        q(st, rt, b, et),
        et,
        Rt,
        vt
      ), vt);
    }
  }
  if (u !== 0 || y !== 0) {
    if (h !== 0 || p !== 0 || f !== 0 || b !== 0 ? (L = h * W, T = V * h, _ = T - (T - h), N = h - _, T = V * W, R = T - (T - W), P = W - R, j = N * P - (L - _ * R - N * R - _ * P), Y = K * b, T = V * K, _ = T - (T - K), N = K - _, T = V * b, R = T - (T - b), P = b - R, X = N * P - (Y - _ * R - N * R - _ * P), S = j + X, x = S - j, mt[0] = j - (S - x) + (X - x), F = L + S, x = F - L, $ = L - (F - x) + (S - x), S = $ + Y, x = S - $, mt[1] = $ - (S - x) + (Y - x), U = F + S, x = U - F, mt[2] = F - (U - x) + (S - x), mt[3] = U, D = -J, C = -p, L = f * D, T = V * f, _ = T - (T - f), N = f - _, T = V * D, R = T - (T - D), P = D - R, j = N * P - (L - _ * R - N * R - _ * P), Y = G * C, T = V * G, _ = T - (T - G), N = G - _, T = V * C, R = T - (T - C), P = C - R, X = N * P - (Y - _ * R - N * R - _ * P), S = j + X, x = S - j, wt[0] = j - (S - x) + (X - x), F = L + S, x = F - L, $ = L - (F - x) + (S - x), S = $ + Y, x = S - $, wt[1] = $ - (S - x) + (Y - x), U = F + S, x = U - F, wt[2] = F - (U - x) + (S - x), wt[3] = U, k = ht(4, mt, 4, wt, ce), L = h * b, T = V * h, _ = T - (T - h), N = h - _, T = V * b, R = T - (T - b), P = b - R, j = N * P - (L - _ * R - N * R - _ * P), Y = f * p, T = V * f, _ = T - (T - f), N = f - _, T = V * p, R = T - (T - p), P = p - R, X = N * P - (Y - _ * R - N * R - _ * P), S = j - X, x = j - S, Xt[0] = j - (S + x) + (x - X), F = L + S, x = F - L, $ = L - (F - x) + (S - x), S = $ - Y, x = $ - S, Xt[1] = $ - (S + x) + (x - Y), U = F + S, x = U - F, Xt[2] = F - (U - x) + (S - x), Xt[3] = U, B = 4) : (ce[0] = 0, k = 1, Xt[0] = 0, B = 1), u !== 0) {
      const st = q(k, ce, u, rt);
      l = ft(l, ht(
        q(g, ke, u, Z),
        Z,
        q(st, rt, 2 * z, et),
        et,
        ut
      ), ut);
      const ot = q(B, Xt, u, H);
      l = ft(l, Mt(
        q(ot, H, 2 * z, Z),
        Z,
        q(ot, H, u, it),
        it,
        q(st, rt, u, et),
        et,
        Rt,
        vt
      ), vt), p !== 0 && (l = ft(l, q(q(4, _t, u, H), H, p, Z), Z)), b !== 0 && (l = ft(l, q(q(4, kt, -u, H), H, b, Z), Z));
    }
    if (y !== 0) {
      const st = q(k, ce, y, rt);
      l = ft(l, ht(
        q(w, Ae, y, Z),
        Z,
        q(st, rt, 2 * Q, et),
        et,
        ut
      ), ut);
      const ot = q(B, Xt, y, H);
      l = ft(l, Mt(
        q(ot, H, 2 * Q, Z),
        Z,
        q(ot, H, y, it),
        it,
        q(st, rt, y, et),
        et,
        Rt,
        vt
      ), vt);
    }
  }
  if (h !== 0 || p !== 0) {
    if (f !== 0 || b !== 0 || u !== 0 || y !== 0 ? (L = f * Q, T = V * f, _ = T - (T - f), N = f - _, T = V * Q, R = T - (T - Q), P = Q - R, j = N * P - (L - _ * R - N * R - _ * P), Y = G * y, T = V * G, _ = T - (T - G), N = G - _, T = V * y, R = T - (T - y), P = y - R, X = N * P - (Y - _ * R - N * R - _ * P), S = j + X, x = S - j, mt[0] = j - (S - x) + (X - x), F = L + S, x = F - L, $ = L - (F - x) + (S - x), S = $ + Y, x = S - $, mt[1] = $ - (S - x) + (Y - x), U = F + S, x = U - F, mt[2] = F - (U - x) + (S - x), mt[3] = U, D = -W, C = -b, L = u * D, T = V * u, _ = T - (T - u), N = u - _, T = V * D, R = T - (T - D), P = D - R, j = N * P - (L - _ * R - N * R - _ * P), Y = z * C, T = V * z, _ = T - (T - z), N = z - _, T = V * C, R = T - (T - C), P = C - R, X = N * P - (Y - _ * R - N * R - _ * P), S = j + X, x = S - j, wt[0] = j - (S - x) + (X - x), F = L + S, x = F - L, $ = L - (F - x) + (S - x), S = $ + Y, x = S - $, wt[1] = $ - (S - x) + (Y - x), U = F + S, x = U - F, wt[2] = F - (U - x) + (S - x), wt[3] = U, v = ht(4, mt, 4, wt, oe), L = f * y, T = V * f, _ = T - (T - f), N = f - _, T = V * y, R = T - (T - y), P = y - R, j = N * P - (L - _ * R - N * R - _ * P), Y = u * b, T = V * u, _ = T - (T - u), N = u - _, T = V * b, R = T - (T - b), P = b - R, X = N * P - (Y - _ * R - N * R - _ * P), S = j - X, x = j - S, Pt[0] = j - (S + x) + (x - X), F = L + S, x = F - L, $ = L - (F - x) + (S - x), S = $ - Y, x = $ - S, Pt[1] = $ - (S + x) + (x - Y), U = F + S, x = U - F, Pt[2] = F - (U - x) + (S - x), Pt[3] = U, A = 4) : (oe[0] = 0, v = 1, Pt[0] = 0, A = 1), h !== 0) {
      const st = q(v, oe, h, rt);
      l = ft(l, ht(
        q(d, Ie, h, Z),
        Z,
        q(st, rt, 2 * K, et),
        et,
        ut
      ), ut);
      const ot = q(A, Pt, h, H);
      l = ft(l, Mt(
        q(ot, H, 2 * K, Z),
        Z,
        q(ot, H, h, it),
        it,
        q(st, rt, h, et),
        et,
        Rt,
        vt
      ), vt), b !== 0 && (l = ft(l, q(q(4, Et, h, H), H, b, Z), Z)), y !== 0 && (l = ft(l, q(q(4, _t, -h, H), H, y, Z), Z));
    }
    if (p !== 0) {
      const st = q(v, oe, p, rt);
      l = ft(l, ht(
        q(m, Te, p, Z),
        Z,
        q(st, rt, 2 * J, et),
        et,
        ut
      ), ut);
      const ot = q(A, Pt, p, H);
      l = ft(l, Mt(
        q(ot, H, 2 * J, Z),
        Z,
        q(ot, H, p, it),
        it,
        q(st, rt, p, et),
        et,
        Rt,
        vt
      ), vt);
    }
  }
  return Gt[l - 1];
}
function gi(i, t, e, n, s, o, r, a) {
  const c = i - r, l = e - r, f = s - r, u = t - a, h = n - a, b = o - a, y = l * b, p = f * h, M = c * c + u * u, I = f * u, g = c * b, w = l * l + h * h, d = c * h, m = l * u, v = f * f + b * b, E = M * (y - p) + w * (I - g) + v * (d - m), k = (Math.abs(y) + Math.abs(p)) * M + (Math.abs(I) + Math.abs(g)) * w + (Math.abs(d) + Math.abs(m)) * v, A = fi * k;
  return E > A || -E > A ? E : pi(i, t, e, n, s, o, r, a, k);
}
function mi(i, t) {
  var e, n, s = 0, o, r, a, c, l, f, u, h = i[0], b = i[1], y = t.length;
  for (e = 0; e < y; e++) {
    n = 0;
    var p = t[e], M = p.length - 1;
    if (f = p[0], f[0] !== p[M][0] && f[1] !== p[M][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (r = f[0] - h, a = f[1] - b, n; n < M; n++) {
      if (u = p[n + 1], c = u[0] - h, l = u[1] - b, a === 0 && l === 0) {
        if (c <= 0 && r >= 0 || r <= 0 && c >= 0)
          return 0;
      } else if (l >= 0 && a <= 0 || l <= 0 && a >= 0) {
        if (o = lt(r, c, a, l, 0, 0), o === 0)
          return 0;
        (o > 0 && l > 0 && a <= 0 || o < 0 && l <= 0 && a > 0) && s++;
      }
      f = u, a = l, r = c;
    }
  }
  return s % 2 !== 0;
}
function Je(i, t, e = {}) {
  if (!i)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const n = si(i), s = oi(t), o = s.type, r = t.bbox;
  let a = s.coordinates;
  if (r && wi(n, r) === !1)
    return !1;
  o === "Polygon" && (a = [a]);
  for (var c = 0; c < a.length; ++c) {
    const l = mi(n, a[c]);
    if (l === 0 && !e.ignoreBoundary) return !0;
    if (l) return !0;
  }
  return !1;
}
function wi(i, t) {
  return t[0] <= i[0] && t[1] <= i[1] && t[2] >= i[0] && t[3] >= i[1];
}
class Le {
  constructor(t = [], e = yi) {
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
      const o = t - 1 >> 1, r = e[o];
      if (n(s, r) >= 0) break;
      e[t] = r, t = o;
    }
    e[t] = s;
  }
  _down(t) {
    const { data: e, compare: n } = this, s = this.length >> 1, o = e[t];
    for (; t < s; ) {
      let r = (t << 1) + 1, a = e[r];
      const c = r + 1;
      if (c < this.length && n(e[c], a) < 0 && (r = c, a = e[c]), n(a, o) >= 0) break;
      e[t] = a, t = r;
    }
    e[t] = o;
  }
}
function yi(i, t) {
  return i < t ? -1 : i > t ? 1 : 0;
}
const vi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Le
}, Symbol.toStringTag, { value: "Module" })), Tt = 11102230246251565e-32, dt = 134217729, bi = (3 + 8 * Tt) * Tt;
function Oe(i, t, e, n, s) {
  let o, r, a, c, l = t[0], f = n[0], u = 0, h = 0;
  f > l == f > -l ? (o = l, l = t[++u]) : (o = f, f = n[++h]);
  let b = 0;
  if (u < i && h < e)
    for (f > l == f > -l ? (r = l + o, a = o - (r - l), l = t[++u]) : (r = f + o, a = o - (r - f), f = n[++h]), o = r, a !== 0 && (s[b++] = a); u < i && h < e; )
      f > l == f > -l ? (r = o + l, c = r - o, a = o - (r - c) + (l - c), l = t[++u]) : (r = o + f, c = r - o, a = o - (r - c) + (f - c), f = n[++h]), o = r, a !== 0 && (s[b++] = a);
  for (; u < i; )
    r = o + l, c = r - o, a = o - (r - c) + (l - c), l = t[++u], o = r, a !== 0 && (s[b++] = a);
  for (; h < e; )
    r = o + f, c = r - o, a = o - (r - c) + (f - c), f = n[++h], o = r, a !== 0 && (s[b++] = a);
  return (o !== 0 || b === 0) && (s[b++] = o), b;
}
function xi(i, t) {
  let e = t[0];
  for (let n = 1; n < i; n++) e += t[n];
  return e;
}
function se(i) {
  return new Float64Array(i);
}
const Si = (3 + 16 * Tt) * Tt, Mi = (2 + 12 * Tt) * Tt, _i = (9 + 64 * Tt) * Tt * Tt, jt = se(4), Qe = se(8), Ze = se(12), tn = se(16), yt = se(4);
function Ei(i, t, e, n, s, o, r) {
  let a, c, l, f, u, h, b, y, p, M, I, g, w, d, m, v, E, k;
  const A = i - s, O = e - s, B = t - o, D = n - o;
  d = A * D, h = dt * A, b = h - (h - A), y = A - b, h = dt * D, p = h - (h - D), M = D - p, m = y * M - (d - b * p - y * p - b * M), v = B * O, h = dt * B, b = h - (h - B), y = B - b, h = dt * O, p = h - (h - O), M = O - p, E = y * M - (v - b * p - y * p - b * M), I = m - E, u = m - I, jt[0] = m - (I + u) + (u - E), g = d + I, u = g - d, w = d - (g - u) + (I - u), I = w - v, u = w - I, jt[1] = w - (I + u) + (u - v), k = g + I, u = k - g, jt[2] = g - (k - u) + (I - u), jt[3] = k;
  let C = xi(4, jt), x = Mi * r;
  if (C >= x || -C >= x || (u = i - A, a = i - (A + u) + (u - s), u = e - O, l = e - (O + u) + (u - s), u = t - B, c = t - (B + u) + (u - o), u = n - D, f = n - (D + u) + (u - o), a === 0 && c === 0 && l === 0 && f === 0) || (x = _i * r + bi * Math.abs(C), C += A * f + D * a - (B * l + O * c), C >= x || -C >= x)) return C;
  d = a * D, h = dt * a, b = h - (h - a), y = a - b, h = dt * D, p = h - (h - D), M = D - p, m = y * M - (d - b * p - y * p - b * M), v = c * O, h = dt * c, b = h - (h - c), y = c - b, h = dt * O, p = h - (h - O), M = O - p, E = y * M - (v - b * p - y * p - b * M), I = m - E, u = m - I, yt[0] = m - (I + u) + (u - E), g = d + I, u = g - d, w = d - (g - u) + (I - u), I = w - v, u = w - I, yt[1] = w - (I + u) + (u - v), k = g + I, u = k - g, yt[2] = g - (k - u) + (I - u), yt[3] = k;
  const T = Oe(4, jt, 4, yt, Qe);
  d = A * f, h = dt * A, b = h - (h - A), y = A - b, h = dt * f, p = h - (h - f), M = f - p, m = y * M - (d - b * p - y * p - b * M), v = B * l, h = dt * B, b = h - (h - B), y = B - b, h = dt * l, p = h - (h - l), M = l - p, E = y * M - (v - b * p - y * p - b * M), I = m - E, u = m - I, yt[0] = m - (I + u) + (u - E), g = d + I, u = g - d, w = d - (g - u) + (I - u), I = w - v, u = w - I, yt[1] = w - (I + u) + (u - v), k = g + I, u = k - g, yt[2] = g - (k - u) + (I - u), yt[3] = k;
  const _ = Oe(T, Qe, 4, yt, Ze);
  d = a * f, h = dt * a, b = h - (h - a), y = a - b, h = dt * f, p = h - (h - f), M = f - p, m = y * M - (d - b * p - y * p - b * M), v = c * l, h = dt * c, b = h - (h - c), y = c - b, h = dt * l, p = h - (h - l), M = l - p, E = y * M - (v - b * p - y * p - b * M), I = m - E, u = m - I, yt[0] = m - (I + u) + (u - E), g = d + I, u = g - d, w = d - (g - u) + (I - u), I = w - v, u = w - I, yt[1] = w - (I + u) + (u - v), k = g + I, u = k - g, yt[2] = g - (k - u) + (I - u), yt[3] = k;
  const N = Oe(_, Ze, 4, yt, tn);
  return tn[N - 1];
}
function en(i, t, e, n, s, o) {
  const r = (t - o) * (e - s), a = (i - s) * (n - o), c = r - a;
  if (r === 0 || a === 0 || r > 0 != a > 0) return c;
  const l = Math.abs(r + a);
  return Math.abs(c) >= Si * l ? c : -Ei(i, t, e, n, s, o, l);
}
function ki(i, t) {
  const e = new Le([], Yn);
  return Ii(i, e), Ti(e, t);
}
function Yn(i, t) {
  return i.p.x > t.p.x ? 1 : i.p.x < t.p.x || i.p.x === t.p.x && (i.featureId !== t.featureId || i.ringId !== t.ringId) && i.isLeftEndpoint && !t.isLeftEndpoint ? -1 : i.p.y !== t.p.y ? i.p.y > t.p.y ? 1 : -1 : 1;
}
function Ai(i, t) {
  return i.rightSweepEvent.p.x > t.rightSweepEvent.p.x ? 1 : i.rightSweepEvent.p.x < t.rightSweepEvent.p.x ? -1 : i.rightSweepEvent.p.y !== t.rightSweepEvent.p.y ? i.rightSweepEvent.p.y < t.rightSweepEvent.p.y ? 1 : -1 : 1;
}
function Ii(i, t) {
  if (i.type === "FeatureCollection") {
    const e = i.features;
    for (let n = 0; n < e.length; n++)
      nn(e[n], t);
  } else
    nn(i, t);
}
var le = 0, ue = 0, fe = 0;
function nn(i, t) {
  const e = i.type === "Feature" ? i.geometry : i;
  let n = e.coordinates;
  (e.type === "Polygon" || e.type === "MultiLineString") && (n = [n]), e.type === "LineString" && (n = [[n]]);
  for (let s = 0; s < n.length; s++)
    for (let o = 0; o < n[s].length; o++) {
      let r = n[s][o][0], a = null;
      ue = ue + 1;
      for (let c = 0; c < n[s][o].length - 1; c++) {
        a = n[s][o][c + 1];
        const l = new rn(r, le, ue, fe), f = new rn(a, le, ue, fe + 1);
        l.otherEvent = f, f.otherEvent = l, Yn(l, f) > 0 ? (f.isLeftEndpoint = !0, l.isLeftEndpoint = !1) : (l.isLeftEndpoint = !0, f.isLeftEndpoint = !1), t.push(l), t.push(f), r = a, fe = fe + 1;
      }
    }
  le = le + 1;
}
var rn = class {
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
function Ti(i, t = !1) {
  const e = [], n = new Le([], Ai);
  for (; i.length; ) {
    const s = i.pop();
    if (s.isLeftEndpoint) {
      const o = new Bi(s);
      for (let r = 0; r < n.data.length; r++) {
        const a = n.data[r];
        if (t && a.leftSweepEvent.featureId === s.featureId)
          continue;
        const c = Oi(o, a);
        c !== !1 && e.push(c);
      }
      n.push(o);
    } else s.isLeftEndpoint === !1 && n.pop();
  }
  return e;
}
var Bi = class {
  /** @param event must have otherEvent non-null */
  constructor(i) {
    this.leftSweepEvent = i, this.rightSweepEvent = i.otherEvent;
  }
};
function Oi(i, t) {
  if (i === null || t === null) return !1;
  const e = i.leftSweepEvent.p.x, n = i.leftSweepEvent.p.y, s = i.rightSweepEvent.p.x, o = i.rightSweepEvent.p.y, r = t.leftSweepEvent.p.x, a = t.leftSweepEvent.p.y, c = t.rightSweepEvent.p.x, l = t.rightSweepEvent.p.y, f = en(e, n, s, o, r, a), u = en(e, n, s, o, c, l);
  if (f > 0 && u > 0) return !1;
  if (f < 0 && u < 0) return !1;
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
  const h = (l - a) * (s - e) - (c - r) * (o - n), b = (c - r) * (n - a) - (l - a) * (e - r), y = (s - e) * (n - a) - (o - n) * (e - r);
  if (h === 0)
    return !1;
  const p = b / h, M = y / h;
  if (p >= 0 && p <= 1 && M >= 0 && M <= 1) {
    const I = e + p * (s - e), g = n + p * (o - n);
    return [I, g];
  }
  return !1;
}
function Ni(i, t, e = {}) {
  const { removeDuplicates: n = !0, ignoreSelfIntersections: s = !0 } = e;
  let o = [];
  i.type === "FeatureCollection" ? o = o.concat(i.features) : i.type === "Feature" ? o.push(i) : (i.type === "LineString" || i.type === "Polygon" || i.type === "MultiLineString" || i.type === "MultiPolygon") && o.push(ee(i)), t.type === "FeatureCollection" ? o = o.concat(t.features) : t.type === "Feature" ? o.push(t) : (t.type === "LineString" || t.type === "Polygon" || t.type === "MultiLineString" || t.type === "MultiPolygon") && o.push(ee(t));
  const r = ki(
    xt(o),
    s
  );
  let a = [];
  if (n) {
    const c = {};
    r.forEach((l) => {
      const f = l.join(",");
      c[f] || (c[f] = !0, a.push(l));
    });
  } else
    a = r;
  return xt(a.map((c) => Yt(c)));
}
function Fi(i) {
  return i && i.__esModule && Object.prototype.hasOwnProperty.call(i, "default") ? i.default : i;
}
function Ri(i) {
  if (Object.prototype.hasOwnProperty.call(i, "__esModule")) return i;
  var t = i.default;
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
  return Object.defineProperty(e, "__esModule", { value: !0 }), Object.keys(i).forEach(function(n) {
    var s = Object.getOwnPropertyDescriptor(i, n);
    Object.defineProperty(e, n, s.get ? s : {
      enumerable: !0,
      get: function() {
        return i[n];
      }
    });
  }), e;
}
function Ci(i, t = {}) {
  let e = 0, n = 0, s = 0;
  return Xe(
    i,
    function(o) {
      e += o[0], n += o[1], s++;
    },
    !0
  ), Yt([e / s, n / s], t.properties);
}
var he = { exports: {} }, ye = { exports: {} }, Di = ye.exports, sn;
function Pi() {
  return sn || (sn = 1, (function(i, t) {
    (function(e, n) {
      i.exports = n();
    })(Di, function() {
      function e(g, w, d, m, v) {
        (function E(k, A, O, B, D) {
          for (; B > O; ) {
            if (B - O > 600) {
              var C = B - O + 1, x = A - O + 1, T = Math.log(C), _ = 0.5 * Math.exp(2 * T / 3), N = 0.5 * Math.sqrt(T * _ * (C - _) / C) * (x - C / 2 < 0 ? -1 : 1), R = Math.max(O, Math.floor(A - x * _ / C + N)), P = Math.min(B, Math.floor(A + (C - x) * _ / C + N));
              E(k, A, R, P, D);
            }
            var S = k[A], F = O, $ = B;
            for (n(k, O, A), D(k[B], S) > 0 && n(k, O, B); F < $; ) {
              for (n(k, F, $), F++, $--; D(k[F], S) < 0; ) F++;
              for (; D(k[$], S) > 0; ) $--;
            }
            D(k[O], S) === 0 ? n(k, O, $) : n(k, ++$, B), $ <= A && (O = $ + 1), A <= $ && (B = $ - 1);
          }
        })(g, w, d || 0, m || g.length - 1, v || s);
      }
      function n(g, w, d) {
        var m = g[w];
        g[w] = g[d], g[d] = m;
      }
      function s(g, w) {
        return g < w ? -1 : g > w ? 1 : 0;
      }
      var o = function(g) {
        g === void 0 && (g = 9), this._maxEntries = Math.max(4, g), this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries)), this.clear();
      };
      function r(g, w, d) {
        if (!d) return w.indexOf(g);
        for (var m = 0; m < w.length; m++) if (d(g, w[m])) return m;
        return -1;
      }
      function a(g, w) {
        c(g, 0, g.children.length, w, g);
      }
      function c(g, w, d, m, v) {
        v || (v = M(null)), v.minX = 1 / 0, v.minY = 1 / 0, v.maxX = -1 / 0, v.maxY = -1 / 0;
        for (var E = w; E < d; E++) {
          var k = g.children[E];
          l(v, g.leaf ? m(k) : k);
        }
        return v;
      }
      function l(g, w) {
        return g.minX = Math.min(g.minX, w.minX), g.minY = Math.min(g.minY, w.minY), g.maxX = Math.max(g.maxX, w.maxX), g.maxY = Math.max(g.maxY, w.maxY), g;
      }
      function f(g, w) {
        return g.minX - w.minX;
      }
      function u(g, w) {
        return g.minY - w.minY;
      }
      function h(g) {
        return (g.maxX - g.minX) * (g.maxY - g.minY);
      }
      function b(g) {
        return g.maxX - g.minX + (g.maxY - g.minY);
      }
      function y(g, w) {
        return g.minX <= w.minX && g.minY <= w.minY && w.maxX <= g.maxX && w.maxY <= g.maxY;
      }
      function p(g, w) {
        return w.minX <= g.maxX && w.minY <= g.maxY && w.maxX >= g.minX && w.maxY >= g.minY;
      }
      function M(g) {
        return { children: g, height: 1, leaf: !0, minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
      }
      function I(g, w, d, m, v) {
        for (var E = [w, d]; E.length; ) if (!((d = E.pop()) - (w = E.pop()) <= m)) {
          var k = w + Math.ceil((d - w) / m / 2) * m;
          e(g, k, w, d, v), E.push(w, k, k, d);
        }
      }
      return o.prototype.all = function() {
        return this._all(this.data, []);
      }, o.prototype.search = function(g) {
        var w = this.data, d = [];
        if (!p(g, w)) return d;
        for (var m = this.toBBox, v = []; w; ) {
          for (var E = 0; E < w.children.length; E++) {
            var k = w.children[E], A = w.leaf ? m(k) : k;
            p(g, A) && (w.leaf ? d.push(k) : y(g, A) ? this._all(k, d) : v.push(k));
          }
          w = v.pop();
        }
        return d;
      }, o.prototype.collides = function(g) {
        var w = this.data;
        if (!p(g, w)) return !1;
        for (var d = []; w; ) {
          for (var m = 0; m < w.children.length; m++) {
            var v = w.children[m], E = w.leaf ? this.toBBox(v) : v;
            if (p(g, E)) {
              if (w.leaf || y(g, E)) return !0;
              d.push(v);
            }
          }
          w = d.pop();
        }
        return !1;
      }, o.prototype.load = function(g) {
        if (!g || !g.length) return this;
        if (g.length < this._minEntries) {
          for (var w = 0; w < g.length; w++) this.insert(g[w]);
          return this;
        }
        var d = this._build(g.slice(), 0, g.length - 1, 0);
        if (this.data.children.length) if (this.data.height === d.height) this._splitRoot(this.data, d);
        else {
          if (this.data.height < d.height) {
            var m = this.data;
            this.data = d, d = m;
          }
          this._insert(d, this.data.height - d.height - 1, !0);
        }
        else this.data = d;
        return this;
      }, o.prototype.insert = function(g) {
        return g && this._insert(g, this.data.height - 1), this;
      }, o.prototype.clear = function() {
        return this.data = M([]), this;
      }, o.prototype.remove = function(g, w) {
        if (!g) return this;
        for (var d, m, v, E = this.data, k = this.toBBox(g), A = [], O = []; E || A.length; ) {
          if (E || (E = A.pop(), m = A[A.length - 1], d = O.pop(), v = !0), E.leaf) {
            var B = r(g, E.children, w);
            if (B !== -1) return E.children.splice(B, 1), A.push(E), this._condense(A), this;
          }
          v || E.leaf || !y(E, k) ? m ? (d++, E = m.children[d], v = !1) : E = null : (A.push(E), O.push(d), d = 0, m = E, E = E.children[0]);
        }
        return this;
      }, o.prototype.toBBox = function(g) {
        return g;
      }, o.prototype.compareMinX = function(g, w) {
        return g.minX - w.minX;
      }, o.prototype.compareMinY = function(g, w) {
        return g.minY - w.minY;
      }, o.prototype.toJSON = function() {
        return this.data;
      }, o.prototype.fromJSON = function(g) {
        return this.data = g, this;
      }, o.prototype._all = function(g, w) {
        for (var d = []; g; ) g.leaf ? w.push.apply(w, g.children) : d.push.apply(d, g.children), g = d.pop();
        return w;
      }, o.prototype._build = function(g, w, d, m) {
        var v, E = d - w + 1, k = this._maxEntries;
        if (E <= k) return a(v = M(g.slice(w, d + 1)), this.toBBox), v;
        m || (m = Math.ceil(Math.log(E) / Math.log(k)), k = Math.ceil(E / Math.pow(k, m - 1))), (v = M([])).leaf = !1, v.height = m;
        var A = Math.ceil(E / k), O = A * Math.ceil(Math.sqrt(k));
        I(g, w, d, O, this.compareMinX);
        for (var B = w; B <= d; B += O) {
          var D = Math.min(B + O - 1, d);
          I(g, B, D, A, this.compareMinY);
          for (var C = B; C <= D; C += A) {
            var x = Math.min(C + A - 1, D);
            v.children.push(this._build(g, C, x, m - 1));
          }
        }
        return a(v, this.toBBox), v;
      }, o.prototype._chooseSubtree = function(g, w, d, m) {
        for (; m.push(w), !w.leaf && m.length - 1 !== d; ) {
          for (var v = 1 / 0, E = 1 / 0, k = void 0, A = 0; A < w.children.length; A++) {
            var O = w.children[A], B = h(O), D = (C = g, x = O, (Math.max(x.maxX, C.maxX) - Math.min(x.minX, C.minX)) * (Math.max(x.maxY, C.maxY) - Math.min(x.minY, C.minY)) - B);
            D < E ? (E = D, v = B < v ? B : v, k = O) : D === E && B < v && (v = B, k = O);
          }
          w = k || w.children[0];
        }
        var C, x;
        return w;
      }, o.prototype._insert = function(g, w, d) {
        var m = d ? g : this.toBBox(g), v = [], E = this._chooseSubtree(m, this.data, w, v);
        for (E.children.push(g), l(E, m); w >= 0 && v[w].children.length > this._maxEntries; ) this._split(v, w), w--;
        this._adjustParentBBoxes(m, v, w);
      }, o.prototype._split = function(g, w) {
        var d = g[w], m = d.children.length, v = this._minEntries;
        this._chooseSplitAxis(d, v, m);
        var E = this._chooseSplitIndex(d, v, m), k = M(d.children.splice(E, d.children.length - E));
        k.height = d.height, k.leaf = d.leaf, a(d, this.toBBox), a(k, this.toBBox), w ? g[w - 1].children.push(k) : this._splitRoot(d, k);
      }, o.prototype._splitRoot = function(g, w) {
        this.data = M([g, w]), this.data.height = g.height + 1, this.data.leaf = !1, a(this.data, this.toBBox);
      }, o.prototype._chooseSplitIndex = function(g, w, d) {
        for (var m, v, E, k, A, O, B, D = 1 / 0, C = 1 / 0, x = w; x <= d - w; x++) {
          var T = c(g, 0, x, this.toBBox), _ = c(g, x, d, this.toBBox), N = (v = T, E = _, k = void 0, A = void 0, O = void 0, B = void 0, k = Math.max(v.minX, E.minX), A = Math.max(v.minY, E.minY), O = Math.min(v.maxX, E.maxX), B = Math.min(v.maxY, E.maxY), Math.max(0, O - k) * Math.max(0, B - A)), R = h(T) + h(_);
          N < D ? (D = N, m = x, C = R < C ? R : C) : N === D && R < C && (C = R, m = x);
        }
        return m || d - w;
      }, o.prototype._chooseSplitAxis = function(g, w, d) {
        var m = g.leaf ? this.compareMinX : f, v = g.leaf ? this.compareMinY : u;
        this._allDistMargin(g, w, d, m) < this._allDistMargin(g, w, d, v) && g.children.sort(m);
      }, o.prototype._allDistMargin = function(g, w, d, m) {
        g.children.sort(m);
        for (var v = this.toBBox, E = c(g, 0, w, v), k = c(g, d - w, d, v), A = b(E) + b(k), O = w; O < d - w; O++) {
          var B = g.children[O];
          l(E, g.leaf ? v(B) : B), A += b(E);
        }
        for (var D = d - w - 1; D >= w; D--) {
          var C = g.children[D];
          l(k, g.leaf ? v(C) : C), A += b(k);
        }
        return A;
      }, o.prototype._adjustParentBBoxes = function(g, w, d) {
        for (var m = d; m >= 0; m--) l(w[m], g);
      }, o.prototype._condense = function(g) {
        for (var w = g.length - 1, d = void 0; w >= 0; w--) g[w].children.length === 0 ? w > 0 ? (d = g[w - 1].children).splice(d.indexOf(g[w]), 1) : this.clear() : a(g[w], this.toBBox);
      }, o;
    });
  })(ye)), ye.exports;
}
const $i = /* @__PURE__ */ Ri(vi);
var Kt = { exports: {} }, Ne, on;
function Xi() {
  return on || (on = 1, Ne = function(t, e, n, s) {
    var o = t[0], r = t[1], a = !1;
    n === void 0 && (n = 0), s === void 0 && (s = e.length);
    for (var c = (s - n) / 2, l = 0, f = c - 1; l < c; f = l++) {
      var u = e[n + l * 2 + 0], h = e[n + l * 2 + 1], b = e[n + f * 2 + 0], y = e[n + f * 2 + 1], p = h > r != y > r && o < (b - u) * (r - h) / (y - h) + u;
      p && (a = !a);
    }
    return a;
  }), Ne;
}
var Fe, an;
function Li() {
  return an || (an = 1, Fe = function(t, e, n, s) {
    var o = t[0], r = t[1], a = !1;
    n === void 0 && (n = 0), s === void 0 && (s = e.length);
    for (var c = s - n, l = 0, f = c - 1; l < c; f = l++) {
      var u = e[l + n][0], h = e[l + n][1], b = e[f + n][0], y = e[f + n][1], p = h > r != y > r && o < (b - u) * (r - h) / (y - h) + u;
      p && (a = !a);
    }
    return a;
  }), Fe;
}
var cn;
function Yi() {
  if (cn) return Kt.exports;
  cn = 1;
  var i = Xi(), t = Li();
  return Kt.exports = function(n, s, o, r) {
    return s.length > 0 && Array.isArray(s[0]) ? t(n, s, o, r) : i(n, s, o, r);
  }, Kt.exports.nested = t, Kt.exports.flat = i, Kt.exports;
}
var Jt = { exports: {} }, Ui = Jt.exports, ln;
function ji() {
  return ln || (ln = 1, (function(i, t) {
    (function(e, n) {
      n(t);
    })(Ui, function(e) {
      const s = 33306690738754706e-32;
      function o(p, M, I, g, w) {
        let d, m, v, E, k = M[0], A = g[0], O = 0, B = 0;
        A > k == A > -k ? (d = k, k = M[++O]) : (d = A, A = g[++B]);
        let D = 0;
        if (O < p && B < I) for (A > k == A > -k ? (v = d - ((m = k + d) - k), k = M[++O]) : (v = d - ((m = A + d) - A), A = g[++B]), d = m, v !== 0 && (w[D++] = v); O < p && B < I; ) A > k == A > -k ? (v = d - ((m = d + k) - (E = m - d)) + (k - E), k = M[++O]) : (v = d - ((m = d + A) - (E = m - d)) + (A - E), A = g[++B]), d = m, v !== 0 && (w[D++] = v);
        for (; O < p; ) v = d - ((m = d + k) - (E = m - d)) + (k - E), k = M[++O], d = m, v !== 0 && (w[D++] = v);
        for (; B < I; ) v = d - ((m = d + A) - (E = m - d)) + (A - E), A = g[++B], d = m, v !== 0 && (w[D++] = v);
        return d === 0 && D !== 0 || (w[D++] = d), D;
      }
      function r(p) {
        return new Float64Array(p);
      }
      const a = 33306690738754716e-32, c = 22204460492503146e-32, l = 11093356479670487e-47, f = r(4), u = r(8), h = r(12), b = r(16), y = r(4);
      e.orient2d = function(p, M, I, g, w, d) {
        const m = (M - d) * (I - w), v = (p - w) * (g - d), E = m - v;
        if (m === 0 || v === 0 || m > 0 != v > 0) return E;
        const k = Math.abs(m + v);
        return Math.abs(E) >= a * k ? E : -(function(A, O, B, D, C, x, T) {
          let _, N, R, P, S, F, $, L, j, Y, X, U, G, z, K, W, Q, J;
          const at = A - C, ct = B - C, st = O - x, ot = D - x;
          S = (K = (L = at - ($ = (F = 134217729 * at) - (F - at))) * (Y = ot - (j = (F = 134217729 * ot) - (F - ot))) - ((z = at * ot) - $ * j - L * j - $ * Y)) - (X = K - (Q = (L = st - ($ = (F = 134217729 * st) - (F - st))) * (Y = ct - (j = (F = 134217729 * ct) - (F - ct))) - ((W = st * ct) - $ * j - L * j - $ * Y))), f[0] = K - (X + S) + (S - Q), S = (G = z - ((U = z + X) - (S = U - z)) + (X - S)) - (X = G - W), f[1] = G - (X + S) + (S - W), S = (J = U + X) - U, f[2] = U - (J - S) + (X - S), f[3] = J;
          let Bt = (function(ti, je) {
            let qe = je[0];
            for (let Se = 1; Se < ti; Se++) qe += je[Se];
            return qe;
          })(4, f), Ht = c * T;
          if (Bt >= Ht || -Bt >= Ht || (_ = A - (at + (S = A - at)) + (S - C), R = B - (ct + (S = B - ct)) + (S - C), N = O - (st + (S = O - st)) + (S - x), P = D - (ot + (S = D - ot)) + (S - x), _ === 0 && N === 0 && R === 0 && P === 0) || (Ht = l * T + s * Math.abs(Bt), (Bt += at * P + ot * _ - (st * R + ct * N)) >= Ht || -Bt >= Ht)) return Bt;
          S = (K = (L = _ - ($ = (F = 134217729 * _) - (F - _))) * (Y = ot - (j = (F = 134217729 * ot) - (F - ot))) - ((z = _ * ot) - $ * j - L * j - $ * Y)) - (X = K - (Q = (L = N - ($ = (F = 134217729 * N) - (F - N))) * (Y = ct - (j = (F = 134217729 * ct) - (F - ct))) - ((W = N * ct) - $ * j - L * j - $ * Y))), y[0] = K - (X + S) + (S - Q), S = (G = z - ((U = z + X) - (S = U - z)) + (X - S)) - (X = G - W), y[1] = G - (X + S) + (S - W), S = (J = U + X) - U, y[2] = U - (J - S) + (X - S), y[3] = J;
          const Jn = o(4, f, 4, y, u);
          S = (K = (L = at - ($ = (F = 134217729 * at) - (F - at))) * (Y = P - (j = (F = 134217729 * P) - (F - P))) - ((z = at * P) - $ * j - L * j - $ * Y)) - (X = K - (Q = (L = st - ($ = (F = 134217729 * st) - (F - st))) * (Y = R - (j = (F = 134217729 * R) - (F - R))) - ((W = st * R) - $ * j - L * j - $ * Y))), y[0] = K - (X + S) + (S - Q), S = (G = z - ((U = z + X) - (S = U - z)) + (X - S)) - (X = G - W), y[1] = G - (X + S) + (S - W), S = (J = U + X) - U, y[2] = U - (J - S) + (X - S), y[3] = J;
          const Qn = o(Jn, u, 4, y, h);
          S = (K = (L = _ - ($ = (F = 134217729 * _) - (F - _))) * (Y = P - (j = (F = 134217729 * P) - (F - P))) - ((z = _ * P) - $ * j - L * j - $ * Y)) - (X = K - (Q = (L = N - ($ = (F = 134217729 * N) - (F - N))) * (Y = R - (j = (F = 134217729 * R) - (F - R))) - ((W = N * R) - $ * j - L * j - $ * Y))), y[0] = K - (X + S) + (S - Q), S = (G = z - ((U = z + X) - (S = U - z)) + (X - S)) - (X = G - W), y[1] = G - (X + S) + (S - W), S = (J = U + X) - U, y[2] = U - (J - S) + (X - S), y[3] = J;
          const Zn = o(Qn, h, 4, y, b);
          return b[Zn - 1];
        })(p, M, I, g, w, d, k);
      }, e.orient2dfast = function(p, M, I, g, w, d) {
        return (M - d) * (I - w) - (p - w) * (g - d);
      }, Object.defineProperty(e, "__esModule", { value: !0 });
    });
  })(Jt, Jt.exports)), Jt.exports;
}
var un;
function qi() {
  if (un) return he.exports;
  un = 1;
  var i = Pi(), t = $i, e = Yi(), n = ji().orient2d;
  t.default && (t = t.default), he.exports = s, he.exports.default = s;
  function s(d, m, v) {
    m = Math.max(0, m === void 0 ? 2 : m), v = v || 0;
    var E = b(d), k = new i(16);
    k.toBBox = function($) {
      return {
        minX: $[0],
        minY: $[1],
        maxX: $[0],
        maxY: $[1]
      };
    }, k.compareMinX = function($, L) {
      return $[0] - L[0];
    }, k.compareMinY = function($, L) {
      return $[1] - L[1];
    }, k.load(d);
    for (var A = [], O = 0, B; O < E.length; O++) {
      var D = E[O];
      k.remove(D), B = y(D, B), A.push(B);
    }
    var C = new i(16);
    for (O = 0; O < A.length; O++) C.insert(h(A[O]));
    for (var x = m * m, T = v * v; A.length; ) {
      var _ = A.shift(), N = _.p, R = _.next.p, P = p(N, R);
      if (!(P < T)) {
        var S = P / x;
        D = o(k, _.prev.p, N, R, _.next.next.p, S, C), D && Math.min(p(D, N), p(D, R)) <= S && (A.push(_), A.push(y(D, _)), k.remove(D), C.remove(_), C.insert(h(_)), C.insert(h(_.next)));
      }
    }
    _ = B;
    var F = [];
    do
      F.push(_.p), _ = _.next;
    while (_ !== B);
    return F.push(_.p), F;
  }
  function o(d, m, v, E, k, A, O) {
    for (var B = new t([], r), D = d.data; D; ) {
      for (var C = 0; C < D.children.length; C++) {
        var x = D.children[C], T = D.leaf ? M(x, v, E) : a(v, E, x);
        T > A || B.push({
          node: x,
          dist: T
        });
      }
      for (; B.length && !B.peek().node.children; ) {
        var _ = B.pop(), N = _.node, R = M(N, m, v), P = M(N, E, k);
        if (_.dist < R && _.dist < P && l(v, N, O) && l(E, N, O)) return N;
      }
      D = B.pop(), D && (D = D.node);
    }
    return null;
  }
  function r(d, m) {
    return d.dist - m.dist;
  }
  function a(d, m, v) {
    if (c(d, v) || c(m, v)) return 0;
    var E = I(d[0], d[1], m[0], m[1], v.minX, v.minY, v.maxX, v.minY);
    if (E === 0) return 0;
    var k = I(d[0], d[1], m[0], m[1], v.minX, v.minY, v.minX, v.maxY);
    if (k === 0) return 0;
    var A = I(d[0], d[1], m[0], m[1], v.maxX, v.minY, v.maxX, v.maxY);
    if (A === 0) return 0;
    var O = I(d[0], d[1], m[0], m[1], v.minX, v.maxY, v.maxX, v.maxY);
    return O === 0 ? 0 : Math.min(E, k, A, O);
  }
  function c(d, m) {
    return d[0] >= m.minX && d[0] <= m.maxX && d[1] >= m.minY && d[1] <= m.maxY;
  }
  function l(d, m, v) {
    for (var E = Math.min(d[0], m[0]), k = Math.min(d[1], m[1]), A = Math.max(d[0], m[0]), O = Math.max(d[1], m[1]), B = v.search({ minX: E, minY: k, maxX: A, maxY: O }), D = 0; D < B.length; D++)
      if (u(B[D].p, B[D].next.p, d, m)) return !1;
    return !0;
  }
  function f(d, m, v) {
    return n(d[0], d[1], m[0], m[1], v[0], v[1]);
  }
  function u(d, m, v, E) {
    return d !== E && m !== v && f(d, m, v) > 0 != f(d, m, E) > 0 && f(v, E, d) > 0 != f(v, E, m) > 0;
  }
  function h(d) {
    var m = d.p, v = d.next.p;
    return d.minX = Math.min(m[0], v[0]), d.minY = Math.min(m[1], v[1]), d.maxX = Math.max(m[0], v[0]), d.maxY = Math.max(m[1], v[1]), d;
  }
  function b(d) {
    for (var m = d[0], v = d[0], E = d[0], k = d[0], A = 0; A < d.length; A++) {
      var O = d[A];
      O[0] < m[0] && (m = O), O[0] > E[0] && (E = O), O[1] < v[1] && (v = O), O[1] > k[1] && (k = O);
    }
    var B = [m, v, E, k], D = B.slice();
    for (A = 0; A < d.length; A++)
      e(d[A], B) || D.push(d[A]);
    return w(D);
  }
  function y(d, m) {
    var v = {
      p: d,
      prev: null,
      next: null,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };
    return m ? (v.next = m.next, v.prev = m, m.next.prev = v, m.next = v) : (v.prev = v, v.next = v), v;
  }
  function p(d, m) {
    var v = d[0] - m[0], E = d[1] - m[1];
    return v * v + E * E;
  }
  function M(d, m, v) {
    var E = m[0], k = m[1], A = v[0] - E, O = v[1] - k;
    if (A !== 0 || O !== 0) {
      var B = ((d[0] - E) * A + (d[1] - k) * O) / (A * A + O * O);
      B > 1 ? (E = v[0], k = v[1]) : B > 0 && (E += A * B, k += O * B);
    }
    return A = d[0] - E, O = d[1] - k, A * A + O * O;
  }
  function I(d, m, v, E, k, A, O, B) {
    var D = v - d, C = E - m, x = O - k, T = B - A, _ = d - k, N = m - A, R = D * D + C * C, P = D * x + C * T, S = x * x + T * T, F = D * _ + C * N, $ = x * _ + T * N, L = R * S - P * P, j, Y, X, U, G = L, z = L;
    L === 0 ? (Y = 0, G = 1, U = $, z = S) : (Y = P * $ - S * F, U = R * $ - P * F, Y < 0 ? (Y = 0, U = $, z = S) : Y > G && (Y = G, U = $ + P, z = S)), U < 0 ? (U = 0, -F < 0 ? Y = 0 : -F > R ? Y = G : (Y = -F, G = R)) : U > z && (U = z, -F + P < 0 ? Y = 0 : -F + P > R ? Y = G : (Y = -F + P, G = R)), j = Y === 0 ? 0 : Y / G, X = U === 0 ? 0 : U / z;
    var K = (1 - j) * d + j * v, W = (1 - j) * m + j * E, Q = (1 - X) * k + X * O, J = (1 - X) * A + X * B, at = Q - K, ct = J - W;
    return at * at + ct * ct;
  }
  function g(d, m) {
    return d[0] === m[0] ? d[1] - m[1] : d[0] - m[0];
  }
  function w(d) {
    d.sort(g);
    for (var m = [], v = 0; v < d.length; v++) {
      for (; m.length >= 2 && f(m[m.length - 2], m[m.length - 1], d[v]) <= 0; )
        m.pop();
      m.push(d[v]);
    }
    for (var E = [], k = d.length - 1; k >= 0; k--) {
      for (; E.length >= 2 && f(E[E.length - 2], E[E.length - 1], d[k]) <= 0; )
        E.pop();
      E.push(d[k]);
    }
    return E.pop(), m.pop(), m.concat(E);
  }
  return he.exports;
}
var Vi = qi();
const zi = /* @__PURE__ */ Fi(Vi);
function fn(i, t = {}) {
  t.concavity = t.concavity || 1 / 0;
  const e = [];
  if (Xe(i, (s) => {
    e.push([s[0], s[1]]);
  }), !e.length)
    return null;
  const n = zi(e, t.concavity);
  return n.length > 3 ? re([n], t.properties) : null;
}
const hn = Math.pow(2, -52), de = new Uint32Array(512);
class Ye {
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
  static from(t, e = Ji, n = Qi) {
    const s = t.length, o = new Float64Array(s * 2);
    for (let r = 0; r < s; r++) {
      const a = t[r];
      o[2 * r] = e(a), o[2 * r + 1] = n(a);
    }
    return new Ye(o);
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
    const { coords: t, _hullPrev: e, _hullNext: n, _hullTri: s, _hullHash: o } = this, r = t.length >> 1;
    let a = 1 / 0, c = 1 / 0, l = -1 / 0, f = -1 / 0;
    for (let A = 0; A < r; A++) {
      const O = t[2 * A], B = t[2 * A + 1];
      O < a && (a = O), B < c && (c = B), O > l && (l = O), B > f && (f = B), this._ids[A] = A;
    }
    const u = (a + l) / 2, h = (c + f) / 2;
    let b = 0, y = 0, p = 0;
    for (let A = 0, O = 1 / 0; A < r; A++) {
      const B = Re(u, h, t[2 * A], t[2 * A + 1]);
      B < O && (b = A, O = B);
    }
    const M = t[2 * b], I = t[2 * b + 1];
    for (let A = 0, O = 1 / 0; A < r; A++) {
      if (A === b) continue;
      const B = Re(M, I, t[2 * A], t[2 * A + 1]);
      B < O && B > 0 && (y = A, O = B);
    }
    let g = t[2 * y], w = t[2 * y + 1], d = 1 / 0;
    for (let A = 0; A < r; A++) {
      if (A === b || A === y) continue;
      const O = Ki(M, I, g, w, t[2 * A], t[2 * A + 1]);
      O < d && (p = A, d = O);
    }
    let m = t[2 * p], v = t[2 * p + 1];
    if (d === 1 / 0) {
      for (let B = 0; B < r; B++)
        this._dists[B] = t[2 * B] - t[0] || t[2 * B + 1] - t[1];
      zt(this._ids, this._dists, 0, r - 1);
      const A = new Uint32Array(r);
      let O = 0;
      for (let B = 0, D = -1 / 0; B < r; B++) {
        const C = this._ids[B], x = this._dists[C];
        x > D && (A[O++] = C, D = x);
      }
      this.hull = A.subarray(0, O), this.triangles = new Uint32Array(0), this.halfedges = new Int32Array(0);
      return;
    }
    if (lt(M, I, g, w, m, v) < 0) {
      const A = y, O = g, B = w;
      y = p, g = m, w = v, p = A, m = O, v = B;
    }
    const E = Wi(M, I, g, w, m, v);
    this._cx = E.x, this._cy = E.y;
    for (let A = 0; A < r; A++)
      this._dists[A] = Re(t[2 * A], t[2 * A + 1], E.x, E.y);
    zt(this._ids, this._dists, 0, r - 1), this._hullStart = b;
    let k = 3;
    n[b] = e[p] = y, n[y] = e[b] = p, n[p] = e[y] = b, s[b] = 0, s[y] = 1, s[p] = 2, o.fill(-1), o[this._hashKey(M, I)] = b, o[this._hashKey(g, w)] = y, o[this._hashKey(m, v)] = p, this.trianglesLen = 0, this._addTriangle(b, y, p, -1, -1, -1);
    for (let A = 0, O = 0, B = 0; A < this._ids.length; A++) {
      const D = this._ids[A], C = t[2 * D], x = t[2 * D + 1];
      if (A > 0 && Math.abs(C - O) <= hn && Math.abs(x - B) <= hn || (O = C, B = x, D === b || D === y || D === p)) continue;
      let T = 0;
      for (let S = 0, F = this._hashKey(C, x); S < this._hashSize && (T = o[(F + S) % this._hashSize], !(T !== -1 && T !== n[T])); S++)
        ;
      T = e[T];
      let _ = T, N;
      for (; N = n[_], lt(C, x, t[2 * _], t[2 * _ + 1], t[2 * N], t[2 * N + 1]) >= 0; )
        if (_ = N, _ === T) {
          _ = -1;
          break;
        }
      if (_ === -1) continue;
      let R = this._addTriangle(_, D, n[_], -1, -1, s[_]);
      s[D] = this._legalize(R + 2), s[_] = R, k++;
      let P = n[_];
      for (; N = n[P], lt(C, x, t[2 * P], t[2 * P + 1], t[2 * N], t[2 * N + 1]) < 0; )
        R = this._addTriangle(P, D, N, s[D], -1, s[P]), s[D] = this._legalize(R + 2), n[P] = P, k--, P = N;
      if (_ === T)
        for (; N = e[_], lt(C, x, t[2 * N], t[2 * N + 1], t[2 * _], t[2 * _ + 1]) < 0; )
          R = this._addTriangle(N, D, _, -1, s[_], s[N]), this._legalize(R + 2), s[N] = R, n[_] = _, k--, _ = N;
      this._hullStart = e[D] = _, n[_] = e[P] = D, n[D] = P, o[this._hashKey(C, x)] = D, o[this._hashKey(t[2 * _], t[2 * _ + 1])] = _;
    }
    this.hull = new Uint32Array(k);
    for (let A = 0, O = this._hullStart; A < k; A++)
      this.hull[A] = O, O = n[O];
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
    return Math.floor(Gi(t - this._cx, e - this._cy) * this._hashSize) % this._hashSize;
  }
  /**
   * Flip an edge in a pair of triangles if it doesn't satisfy the Delaunay condition.
   *
   * @param {number} a
   * @private
   */
  _legalize(t) {
    const { _triangles: e, _halfedges: n, coords: s } = this;
    let o = 0, r = 0;
    for (; ; ) {
      const a = n[t], c = t - t % 3;
      if (r = c + (t + 2) % 3, a === -1) {
        if (o === 0) break;
        t = de[--o];
        continue;
      }
      const l = a - a % 3, f = c + (t + 1) % 3, u = l + (a + 2) % 3, h = e[r], b = e[t], y = e[f], p = e[u];
      if (Hi(
        s[2 * h],
        s[2 * h + 1],
        s[2 * b],
        s[2 * b + 1],
        s[2 * y],
        s[2 * y + 1],
        s[2 * p],
        s[2 * p + 1]
      )) {
        e[t] = p, e[a] = h;
        const I = n[u];
        if (I === -1) {
          let w = this._hullStart;
          do {
            if (this._hullTri[w] === u) {
              this._hullTri[w] = t;
              break;
            }
            w = this._hullPrev[w];
          } while (w !== this._hullStart);
        }
        this._link(t, I), this._link(a, n[r]), this._link(r, u);
        const g = l + (a + 1) % 3;
        o < de.length && (de[o++] = g);
      } else {
        if (o === 0) break;
        t = de[--o];
      }
    }
    return r;
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
  _addTriangle(t, e, n, s, o, r) {
    const a = this.trianglesLen;
    return this._triangles[a] = t, this._triangles[a + 1] = e, this._triangles[a + 2] = n, this._link(a, s), this._link(a + 1, o), this._link(a + 2, r), this.trianglesLen += 3, a;
  }
}
function Gi(i, t) {
  const e = i / (Math.abs(i) + Math.abs(t));
  return (t > 0 ? 3 - e : 1 + e) / 4;
}
function Re(i, t, e, n) {
  const s = i - e, o = t - n;
  return s * s + o * o;
}
function Hi(i, t, e, n, s, o, r, a) {
  const c = i - r, l = t - a, f = e - r, u = n - a, h = s - r, b = o - a, y = c * c + l * l, p = f * f + u * u, M = h * h + b * b;
  return c * (u * M - p * b) - l * (f * M - p * h) + y * (f * b - u * h) < 0;
}
function Ki(i, t, e, n, s, o) {
  const r = e - i, a = n - t, c = s - i, l = o - t, f = r * r + a * a, u = c * c + l * l, h = 0.5 / (r * l - a * c), b = (l * f - a * u) * h, y = (r * u - c * f) * h;
  return b * b + y * y;
}
function Wi(i, t, e, n, s, o) {
  const r = e - i, a = n - t, c = s - i, l = o - t, f = r * r + a * a, u = c * c + l * l, h = 0.5 / (r * l - a * c), b = i + (l * f - a * u) * h, y = t + (r * u - c * f) * h;
  return { x: b, y };
}
function zt(i, t, e, n) {
  if (n - e <= 20)
    for (let s = e + 1; s <= n; s++) {
      const o = i[s], r = t[o];
      let a = s - 1;
      for (; a >= e && t[i[a]] > r; ) i[a + 1] = i[a--];
      i[a + 1] = o;
    }
  else {
    const s = e + n >> 1;
    let o = e + 1, r = n;
    Wt(i, s, o), t[i[e]] > t[i[n]] && Wt(i, e, n), t[i[o]] > t[i[n]] && Wt(i, o, n), t[i[e]] > t[i[o]] && Wt(i, e, o);
    const a = i[o], c = t[a];
    for (; ; ) {
      do
        o++;
      while (t[i[o]] < c);
      do
        r--;
      while (t[i[r]] > c);
      if (r < o) break;
      Wt(i, o, r);
    }
    i[e + 1] = i[r], i[r] = a, n - o + 1 >= r - e ? (zt(i, t, o, n), zt(i, t, e, r - 1)) : (zt(i, t, e, r - 1), zt(i, t, o, n));
  }
}
function Wt(i, t, e) {
  const n = i[t];
  i[t] = i[e], i[e] = n;
}
function Ji(i) {
  return i[0];
}
function Qi(i) {
  return i[1];
}
class Zi {
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
class dn extends Zi {
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
function pn(i, t, e, n, s, o, r, a) {
  const c = lt(i, t, s, o, r, a), l = lt(e, n, s, o, r, a);
  if (c > 0 && l > 0 || c < 0 && l < 0)
    return !1;
  const f = lt(s, o, i, t, e, n), u = lt(r, a, i, t, e, n);
  return f > 0 && u > 0 || f < 0 && u < 0 ? !1 : c === 0 && l === 0 && f === 0 && u === 0 ? !(Math.max(s, r) < Math.min(i, e) || Math.max(i, e) < Math.min(s, r) || Math.max(o, a) < Math.min(t, n) || Math.max(t, n) < Math.min(o, a)) : !0;
}
class tr {
  /**
   * The triangulation object from Delaunator.
   */
  del;
  constructor(t) {
    this.del = t;
  }
}
class te extends tr {
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
    this.vertMap = new Uint32Array(s).fill(n), this.flips = new dn(o), this.consd = new dn(o);
    for (let r = 0; r < o; r++) {
      const a = t.triangles[r];
      this.vertMap[a] === n && this.updateVert(r);
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
    const o = this.vertMap[t], r = this.maxConstrainSteps();
    let a = 0, c = o;
    do {
      if (++a > r)
        throw new Error(
          `Constraining edge [${t}, ${e}] exceeded the iteration limit`
        );
      const u = n[c], h = At(c);
      if (u === e)
        return this.protect(c);
      const b = St(c), y = n[b];
      if (y === e)
        return this.protect(h), h;
      if (this.intersectSegments(t, e, y, u)) {
        c = b;
        break;
      }
      c = s[h];
    } while (c !== -1 && c !== o);
    let l = c, f = -1;
    for (; c !== -1; ) {
      if (++a > r)
        throw new Error(
          `Constraining edge [${t}, ${e}] exceeded the iteration limit`
        );
      const u = s[c], h = St(c), b = St(u), y = At(u);
      if (u === -1)
        throw new Error("Constraining edge exited the hull");
      if (this.consd.has(c))
        throw new Error("Edge intersects already constrained edge");
      if (this.isCollinear(t, e, n[c]) || this.isCollinear(t, e, n[u]))
        throw new Error("Constraining edge intersects point");
      if (!this.intersectSegments(
        n[c],
        n[u],
        n[h],
        n[b]
      )) {
        if (f === -1 && (f = c), n[b] === e) {
          if (c === f)
            throw new Error("Infinite loop: non-convex quadrilateral");
          c = f, f = -1;
          continue;
        }
        if (this.intersectSegments(
          t,
          e,
          n[b],
          n[u]
        ))
          c = b;
        else if (this.intersectSegments(
          t,
          e,
          n[y],
          n[b]
        ))
          c = y;
        else if (f === c)
          throw new Error("Infinite loop: no further intersect after non-convex");
        continue;
      }
      if (this.flipDiagonal(c), this.intersectSegments(
        t,
        e,
        n[h],
        n[b]
      ) && (f === -1 && (f = h), f === h))
        throw new Error("Infinite loop: flipped diagonal still intersects");
      n[b] === e ? (l = b, c = f, f = -1) : this.intersectSegments(
        t,
        e,
        n[y],
        n[b]
      ) && (c = y);
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
    let r;
    do {
      r = 0;
      for (let a = 0; a < o; a++) {
        if (s.has(a))
          continue;
        n.delete(a);
        const c = e[a];
        c !== -1 && (n.delete(c), this.isDelaunay(a) || (this.flipDiagonal(a), r++));
      }
    } while (t && r > 0);
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
    const { triangles: n, halfedges: s } = this.del, o = n.length / 3, r = (y, p, M) => {
      const I = t(p), g = t(M);
      return t(y).some((w) => I.includes(w) && g.includes(w));
    }, a = (y) => r(n[y * 3], n[y * 3 + 1], n[y * 3 + 2]), c = (y, p, M, I) => Math.sign(lt(y[p * 2], y[p * 2 + 1], y[M * 2], y[M * 2 + 1], y[I * 2], y[I * 2 + 1])), l = e.map((y) => {
      let p = 0;
      for (let M = 0; M < o; M++) p += c(y, n[M * 3], n[M * 3 + 1], n[M * 3 + 2]);
      return p < 0 ? -1 : 1;
    }), f = (y) => {
      if (this.consd.has(y)) return !1;
      const p = s[y];
      if (p === -1) return !1;
      const M = n[y], I = n[At(y)], g = n[St(y)], w = n[St(p)];
      return e.every((d, m) => c(d, g, M, w) === l[m] && c(d, w, I, g) === l[m]);
    };
    let u = 0, h = !0;
    for (; h; ) {
      h = !1;
      for (let y = 0; y < o; y++)
        if (a(y))
          for (let p = 0; p < 3; p++) {
            const M = y * 3 + p;
            if (!f(M)) continue;
            const I = s[M], g = n[M], w = n[At(M)], d = n[St(M)], m = n[St(I)];
            if (!(r(d, g, m) && r(m, w, d))) {
              this.protect(this.flipDiagonal(M)), u++, h = !0;
              break;
            }
          }
    }
    let b = 0;
    for (let y = 0; y < o; y++) a(y) && b++;
    return { flips: u, remaining: b };
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
    let r = n, a, c = 0;
    do {
      if (++c > s.length)
        throw new Error(
          `Looking up edge [${t}, ${e}] exceeded the iteration limit`
        );
      if (s[r] === t)
        return r;
      a = At(r), r = o[a];
    } while (r !== -1 && r !== n);
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
    const { triangles: e, halfedges: n } = this.del, s = this.flips, o = this.consd, r = n[t], a = St(t), c = At(t), l = St(r), f = At(r), u = n[a], h = n[l];
    if (o.has(t))
      throw new Error("Trying to flip a constrained edge");
    return e[t] = e[l], n[t] = h, s.set(t, s.has(l)) || o.set(t, o.has(l)), h !== -1 && (n[h] = t), n[a] = l, e[r] = e[a], n[r] = u, s.set(r, s.has(a)) || o.set(r, o.has(a)), u !== -1 && (n[u] = r), n[l] = a, this.markFlip(t), this.markFlip(c), this.markFlip(r), this.markFlip(f), s.add(a), o.delete(a), s.add(l), o.delete(l), this.updateVert(t), this.updateVert(c), this.updateVert(r), this.updateVert(f), a;
  }
  /**
   * Whether point p1, p2, and p are collinear.
   */
  isCollinear(t, e, n) {
    const s = this.del.coords;
    return lt(
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
    return gi(
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
    const o = e[St(t)], r = e[t], a = e[At(t)], c = e[St(s)];
    return !this.inCircle(o, r, a, c);
  }
  /**
   * Update the vertex -> incoming edge map.
   */
  updateVert(t) {
    const { triangles: e, halfedges: n } = this.del, s = this.vertMap, o = e[t];
    let r = St(t), a = n[r];
    for (; a !== -1 && a !== t; )
      r = St(a), a = n[r];
    return s[o] = r, r;
  }
  /**
   * Whether the segments between vertices intersect.
   */
  intersectSegments(t, e, n, s) {
    const o = this.del.coords;
    return t === n || t === s || e === n || e === s ? !1 : pn(
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
  static intersectSegments = pn;
}
function pe(i, t, e) {
  return De(i, t, e).tin;
}
function De(i, t, e, n, s) {
  if (t || (t = []), typeof i != "object" || i.type !== "FeatureCollection")
    throw "Argument points must be FeatureCollection";
  if (!Array.isArray(t)) throw "Argument points must be Array of Array";
  const o = i.features.map(
    (p) => p.geometry.coordinates
  );
  let r = s?.snapshot ? te.restore(s.snapshot) : void 0;
  const a = r ? void 0 : Ye.from(o);
  let c = r ? r.del : a, l = 0, f;
  const u = [];
  if (c.triangles.length !== 0 && (t.length !== 0 || n)) {
    if (!r) {
      r = new te(c);
      try {
        r.constrainAll(t);
      } catch (I) {
        if (!n?.allowUnusableBoundary) throw I;
        return { tin: xt([]), remaining: 0, hasBoundary: !1, hull: [] };
      }
      s && (s.snapshot = r.snapshot());
    }
    const p = n ? s?.snapshot ?? r.snapshot() : void 0, M = (I) => {
      const g = te.restore(p);
      return g.constrainAll(I), g;
    };
    for (const I of n?.hull ?? [])
      try {
        r.constrainOne(I[0], I[1]), u.push(I);
      } catch {
        r = M(u);
      }
    n?.boundary && (f = er(r, n.boundary), f || (r = M(u))), n && ({ remaining: l } = r.forbidGroupTriangles(
      n.groupsOf,
      n.planes
    ), l -= f?.size ?? 0), c = r.del;
  }
  const h = [];
  for (let p = 0; p < c.triangles.length; p += 3)
    f?.has(p / 3) || h.push([c.triangles[p], c.triangles[p + 1], c.triangles[p + 2]]);
  const b = ["a", "b", "c"];
  return { tin: xt(
    h.map((p) => {
      const M = {}, I = p.map((g, w) => {
        const d = i.features[g], m = d.geometry.coordinates, v = [m[0], m[1]];
        return m.length === 3 ? v[2] = m[2] : M[b[w]] = d.properties[e], v;
      });
      return I[3] = I[0], re([I], M);
    })
  ), remaining: l, hasBoundary: f !== void 0, hull: u };
}
function er(i, t) {
  try {
    i.constrainAll(t);
  } catch {
    return;
  }
  const e = new Map(t), { triangles: n, halfedges: s } = i.del, o = (l) => {
    const f = n[l], u = n[At(l)];
    return e.get(f) === u || e.get(u) === f;
  }, r = /* @__PURE__ */ new Set(), a = [], c = (l) => {
    const f = Math.floor(l / 3);
    r.has(f) || (r.add(f), a.push(f));
  };
  for (let l = 0; l < s.length; l++)
    s[l] === -1 && !o(l) && c(l);
  for (let l = 0; l < a.length; l++)
    for (let f = a[l] * 3; f < a[l] * 3 + 3; f++) {
      if (!e.has(n[f])) return;
      s[f] !== -1 && !o(f) && c(s[f]);
    }
  return r;
}
function gn(i) {
  const t = /* @__PURE__ */ new Set(), e = [];
  if (i.forEach(([c, l], f) => {
    const u = `${c}:${l}`;
    t.has(u) || (t.add(u), e.push({ i: f, x: c, y: l }));
  }), e.length < 3) return [];
  const n = (c, l, f) => lt(c.x, c.y, l.x, l.y, f.x, f.y), s = [...e].sort((c, l) => c.x - l.x || c.y - l.y), o = (c) => {
    const l = [];
    for (const f of c) {
      for (; l.length >= 2 && n(l[l.length - 2], l[l.length - 1], f) <= 0; ) l.pop();
      l.push(f);
    }
    return l.pop(), l;
  }, r = [...o(s), ...o([...s].reverse())];
  if (r.length < 3) return [];
  const a = [];
  for (let c = 0; c < r.length; c++) {
    const l = r[c], f = r[(c + 1) % r.length], u = f.x - l.x, h = f.y - l.y, b = u * u + h * h, y = e.filter((M) => M !== l && M !== f && n(l, f, M) === 0).map((M) => ({ r: M, t: ((M.x - l.x) * u + (M.y - l.y) * h) / b })).filter(({ t: M }) => M > 0 && M < 1).sort((M, I) => M.t - I.t).map(({ r: M }) => M), p = [l, ...y, f];
    for (let M = 0; M + 1 < p.length; M++) a.push([p[M].i, p[M + 1].i]);
  }
  return a;
}
function ve([i, t]) {
  return i < t ? `${i}-${t}` : `${t}-${i}`;
}
function qt(i, t, e) {
  return Yt(i, { target: { geom: t, index: e } });
}
function Vt(i) {
  return Yt(i.properties.target.geom, {
    target: {
      geom: i.geometry.coordinates,
      index: i.properties.target.index
    }
  });
}
function mn(i, t) {
  const e = i.length, n = t.geometry.coordinates;
  return Array.from({ length: e }, (s, o) => o).map((s) => {
    const o = (s + 1) % e, r = i[s], a = i[o], c = r.geometry.coordinates, l = Math.atan2(
      c[0] - n[0],
      c[1] - n[1]
    ), f = [t, r, a, t].map(
      (b) => b.geometry.coordinates
    ), u = {
      a: {
        geom: t.properties.target.geom,
        index: t.properties.target.index
      },
      b: {
        geom: r.properties.target.geom,
        index: r.properties.target.index
      },
      c: {
        geom: a.properties.target.geom,
        index: a.properties.target.index
      }
    }, h = xt([
      re([f], u)
    ]);
    return [l, h];
  }).reduce(
    (s, o) => (s[0].push(o[0]), s[1].push(o[1]), s),
    [[], []]
  );
}
const nr = [0.1, 0.15, 0.225, 0.34, 0.5];
function ir(i, t) {
  return t ? i.hasBoundary !== t.hasBoundary ? i.hasBoundary : i.diagnostics.boundaryTriangleFlips < t.diagnostics.boundaryTriangleFlips : !0;
}
function wn(i, t, e) {
  return Math.sign(lt(i[0], i[1], t[0], t[1], e[0], e[1]));
}
function be(i, t = -1) {
  let e = 0;
  for (const n of i.features) {
    const { a: s, b: o, c: r } = n.properties;
    if (![s, o, r].some(
      ({ index: u }) => typeof u == "string" && u.startsWith("b")
    ))
      continue;
    const [a, c, l] = n.geometry.coordinates[0];
    wn(a, c, l) * wn(s.geom, o.geom, r.geom) * t <= 0 && e++;
  }
  return e;
}
function yn(i, t, e) {
  if (i.some(([r, a]) => r === t[0] && a === t[1])) return !1;
  const n = i.map(
    ([r, a]) => Math.atan2(a - t[1], r - t[0])
  ), s = 2 * Math.PI;
  let o = 0;
  for (let r = 0; r < n.length; r++) {
    const c = (e * (n[(r + 1) % n.length] - n[r]) + s) % s;
    if (!(c > 0 && c < Math.PI)) return !1;
    o += c;
  }
  return Math.abs(o - s) < 1e-6;
}
function rr(i, t) {
  const e = new Set(
    t.forw.map(({ geometry: s }) => String(s.coordinates))
  ), n = new Set(
    t.bakw.map(({ geometry: s }) => String(s.coordinates))
  );
  return i.filter(({ forw: s, bakw: o }) => {
    const r = String(s), a = String(o);
    return e.has(r) || n.has(a) ? !1 : (e.add(r), n.add(a), !0);
  });
}
function vn(i, t, e, n, s, o = /* @__PURE__ */ new Set(), r) {
  const { minx: a, maxx: c, miny: l, maxy: f, centroid: u } = i, h = c - a, b = f - l, y = e.forw.length, p = Array.from({ length: y }, () => []);
  let M = 1;
  for (const [E, k] of e.edges)
    E < n && p[E].push(M), p[k].push(M), k < n && M++;
  const I = (E) => E.slice(0, y).map(({ geometry: k }) => k.coordinates), g = gn(I(e.forw)), w = {
    forw: g.filter((E) => !o.has(ve(E))),
    bakw: gn(I(e.bakw))
  }, d = [0], m = (E) => E >= y ? d : p[E];
  let v;
  for (const E of nr) {
    const k = r?.get(E) ?? { forwReuse: {} };
    r?.set(E, k);
    const A = k.vertices ?? (k.vertices = rr(
      t(
        {
          ...i,
          minx: a - E * h,
          maxx: c + E * h,
          miny: l - E * b,
          maxy: f + E * b
        },
        !0
      ),
      e
    ));
    if (s && (A.length < 4 || !A.every(({ bakw: Y }) => Y.every(Number.isFinite)))) continue;
    const O = A.map(
      ({ forw: Y, bakw: X }, U) => qt(Y, X, `b${U}`)
    ), B = xt([...e.forw, ...O]), D = xt([
      ...e.bakw,
      ...O.map(Vt)
    ]), C = [B, D].map(
      ({ features: Y }) => Float64Array.from(
        Y.flatMap(
          ({
            geometry: {
              coordinates: [X, U]
            }
          }) => [X, U]
        )
      )
    ), T = s !== void 0 || yn(
      A.map((Y) => Y.forw),
      u.forw,
      -1
    ) && yn(
      A.map((Y) => Y.bakw),
      u.bakw,
      1
    ) ? A.map((Y, X) => [
      y + X,
      y + (X + 1) % A.length
    ]) : void 0, _ = { groupsOf: m, planes: C, boundary: T, allowUnusableBoundary: s !== void 0 }, N = s?.orientation ?? -1, R = De(
      B,
      e.edges,
      "target",
      { ..._, hull: w.forw },
      k.forwReuse
    ), P = k.geographic ?? (k.geographic = (() => {
      const Y = De(D, e.edges, "target", {
        ..._,
        hull: w.bakw
      });
      return { built: Y, flips: be(Y.tin, N) };
    })()), S = P.built, F = R.tin, $ = {
      ...S.tin,
      features: [...S.tin.features]
    }, L = be(F, N) + P.flips, j = {
      vertices: A,
      forw: F,
      bakw: $,
      diagnostics: {
        margin: E,
        boundaryTriangleFlips: L,
        remainingForbiddenTriangles: R.remaining + S.remaining
      },
      hasMapBoundary: R.hasBoundary,
      hasBoundary: R.hasBoundary && S.hasBoundary,
      forwHull: { all: g, applied: R.hull }
    };
    if (s) {
      if (s.accept(j)) return j;
      continue;
    }
    if (L === 0 && j.hasBoundary)
      return j;
    ir(j, v) && (v = j);
  }
  return v;
}
const sr = 256 * Number.EPSILON, Un = 4, or = 1e-9;
function ar(i) {
  const t = Math.abs(i);
  if (!Number.isFinite(t)) return NaN;
  const e = new DataView(new ArrayBuffer(8));
  e.setFloat64(0, t);
  const n = e.getUint32(0) >>> 20 & 2047;
  return Math.pow(2, Math.max(n, 1) - 1023 - 52);
}
function cr(i) {
  let t = 0;
  for (const e of i)
    t = Math.max(t, Math.abs(e[0]), Math.abs(e[1]));
  return t;
}
function lr(i, t, e = Un) {
  const n = (o) => {
    let r = 0;
    for (let c = 1; c < o.length; c++)
      r += Math.sqrt(
        Math.pow(o[c][0] - o[c - 1][0], 2) + Math.pow(o[c][1] - o[c - 1][1], 2)
      );
    const a = ar(cr(o)) / r;
    return Number.isFinite(a) ? a : 0;
  }, s = sr + e * (n(i) + n(t));
  return Math.min(s, or);
}
function ur(i, t, e) {
  const n = new Int32Array(i.length).fill(-1), s = new Int32Array(t.length).fill(-1), o = i.length - 2, r = t.length - 2;
  if (o < 1 || r < 1) return { illstToMerc: n, mercToIllst: s };
  const a = (m, v) => Math.abs(t[v + 1][3] - i[m + 1][3]) <= e;
  let c = o, l = -1, f = r, u = -1;
  for (let m = 0; m < o; m++)
    for (let v = 0; v < r; v++)
      a(m, v) && (c = Math.min(c, m), l = Math.max(l, m), f = Math.min(f, v), u = Math.max(u, v));
  if (l < 0) return { illstToMerc: n, mercToIllst: s };
  const h = l - c + 1, b = u - f + 1, y = b + 1, p = new Int32Array((h + 1) * y), M = new Float64Array((h + 1) * y), I = new Uint8Array((h + 1) * y), g = (m, v, E, k) => m > E || m === E && v < k;
  for (let m = 1; m <= h; m++)
    for (let v = 1; v <= b; v++) {
      const E = m * y + v, k = E - y, A = E - 1;
      let O = p[k], B = M[k], D = 0;
      g(p[A], M[A], O, B) && (O = p[A], B = M[A], D = 1);
      const C = c + m - 1, x = f + v - 1;
      if (a(C, x)) {
        const T = k - 1, _ = p[T] + 1, N = M[T] + Math.abs(t[x + 1][3] - i[C + 1][3]);
        g(_, N, O, B) && (O = _, B = N, D = 2);
      }
      p[E] = O, M[E] = B, I[E] = D;
    }
  let w = h, d = b;
  for (; w > 0 && d > 0; ) {
    const m = I[w * y + d];
    if (m === 2) {
      const v = c + w - 1 + 1, E = f + d - 1 + 1;
      n[v] = E, s[E] = v, w--, d--;
    } else m === 0 ? w-- : d--;
  }
  return { illstToMerc: n, mercToIllst: s };
}
function fr(i, t, e = Un) {
  const n = lr(i, t, e), s = [i, t].map((f) => {
    const u = f.map((b, y, p) => {
      if (y === 0) return 0;
      const M = p[y - 1];
      return Math.sqrt(
        Math.pow(b[0] - M[0], 2) + Math.pow(b[1] - M[1], 2)
      );
    }), h = u.reduce((b, y, p) => p === 0 ? [0] : (b.push(b[p - 1] + y), b), []);
    return h.map((b, y, p) => {
      const M = b / p[p.length - 1];
      return [f[y], u[y], h[y], M];
    });
  }), { illstToMerc: o, mercToIllst: r } = ur(s[0], s[1], n), a = [o, r], c = (f, u) => {
    for (let h = 1; h < u.length - 1; h++)
      if (Math.abs(u[h][3] - f) <= n) return !0;
    return !1;
  }, l = [];
  return s.forEach((f, u) => {
    const h = s[u ? 0 : 1];
    f.forEach((b, y) => {
      if (y === 0 || y === f.length - 1) return;
      const p = b[0], M = b[3], I = a[u][y];
      if (I >= 0) {
        u === 0 && l.push([p, h[I][0], M]);
        return;
      }
      if (!c(M, h))
        for (let g = 0; g < h.length - 1; g++) {
          const w = h[g], d = h[g + 1], m = w[3], v = d[3];
          if (m < M && v > M) {
            const E = (M - m) / (v - m), k = [
              (d[0][0] - w[0][0]) * E + w[0][0],
              (d[0][1] - w[0][1]) * E + w[0][1]
            ];
            l.push(
              u === 0 ? [p, k, M] : [k, p, M]
            );
            return;
          }
        }
    });
  }), l.sort((f, u) => f[2] - u[2]);
}
const bn = 1e-9;
function hr(i, t) {
  const e = [[], [], [], []], n = [];
  return Object.keys(i).forEach((s) => {
    const o = i[s], r = o.forw, a = o.bakw, c = [
      r[0] - t.forw[0],
      r[1] - t.forw[1]
    ], l = [
      a[0] - t.bakw[0],
      t.bakw[1] - a[1]
    ], f = { forw: c, bakw: l };
    if (n.push(f), c[0] === 0 || c[1] === 0)
      return;
    let u = 0;
    c[0] > 0 && (u += 1), c[1] > 0 && (u += 2), e[u].push(f);
  }), { perQuad: e, aggregate: n };
}
function jn(i) {
  let t = 1 / 0, e = 0, n = 0;
  return i.forEach((s) => {
    const { forw: o, bakw: r } = s, a = Math.hypot(o[0], o[1]), c = Math.hypot(r[0], r[1]);
    if (c === 0) return;
    const l = a / c, f = Math.atan2(o[0], o[1]) - Math.atan2(r[0], r[1]);
    t = Math.min(t, l), e += Math.cos(f), n += Math.sin(f);
  }), isFinite(t) ? [t, Math.atan2(n, e)] : [1, 0];
}
const dr = 0.6, pr = 3, gr = 0.5;
function mr(i) {
  let t = 0, e = 0, n = 0, s = 0;
  if (i.forEach(({ forw: r, bakw: a }) => {
    t += r[1] * a[1] + r[0] * a[0], e += r[0] * a[1] - r[1] * a[0], n += a[0] * a[0] + a[1] * a[1], s += r[0] * r[0] + r[1] * r[1];
  }), !(!(n > 0 && s > 0) || !(Math.hypot(t, e) / Math.sqrt(s * n) >= gr)))
    return [Math.hypot(t, e) / n, Math.atan2(e, t)];
}
function wr(i) {
  const t = (s) => Math.hypot(s.forw[0], s.forw[1]), e = Math.max(...i.map(t)), n = i.filter((s) => t(s) >= dr * e);
  return mr(n.length >= pr ? n : i) ?? jn(i);
}
function yr(i, t, e, n) {
  const { perQuad: s, aggregate: o } = hr(i, t), r = s.every((f) => f.length > 0), a = e === "birdeye" ? r ? s : [o] : [o], c = n === "farLsq" ? wr : jn, l = a.map((f) => c(f));
  return l.length === 1 ? [l[0], l[0], l[0], l[0]] : l;
}
function vr(i, t) {
  let e = 0;
  return i[0] > t[0] && (e += 1), i[1] > t[1] && (e += 2), e;
}
function br(i, t, e) {
  const n = [
    i[0] - t.forw[0],
    i[1] - t.forw[1]
  ], o = Math.sqrt(n[0] ** 2 + n[1] ** 2) / e[0], r = Math.atan2(n[0], n[1]) - e[1];
  return [
    t.bakw[0] + o * Math.sin(r),
    t.bakw[1] - o * Math.cos(r)
  ];
}
function xr(i, t, e, n) {
  const s = t[0] - i[0], o = t[1] - i[1];
  if (Math.abs(s) < 1e-12 && Math.abs(o) < 1e-12) return null;
  const r = n[0] - e[0], a = n[1] - e[1], c = e[0] - i[0], l = e[1] - i[1], f = s * a - o * r;
  if (Math.abs(f) < 1e-12) return null;
  const u = (c * a - l * r) / f, h = (c * o - l * s) / f;
  return u <= 1e-10 || h < -1e-10 || h > 1 + 1e-10 ? null : { t: u, point: [i[0] + u * s, i[1] + u * o] };
}
function Sr(i, t, e) {
  const n = e.length;
  let s = -1 / 0, o = null;
  for (let r = 0; r < n; r++) {
    const a = (r + 1) % n, c = xr(
      i,
      t,
      e[r].bakw,
      e[a].bakw
    );
    c && c.t > s && (s = c.t, o = c.point);
  }
  return o;
}
function xn(i, t) {
  return Math.floor(Pe(i, t) / 10) % 36;
}
function Pe(i, t) {
  const n = Math.atan2(i[0] - t[0], i[1] - t[1]) * (180 / Math.PI);
  return n < 0 ? n + 360 : n;
}
function Sn(i, t, e, n, s, o) {
  const r = t[0] - i[0], a = t[1] - i[1];
  if (r === 0 && a === 0) return null;
  const c = [];
  if (r !== 0)
    for (const f of [e, n]) {
      const u = (f - i[0]) / r;
      if (u > 0) {
        const h = i[1] + u * a;
        h >= s && h <= o && c.push({ t: u, x: f, y: h });
      }
    }
  if (a !== 0)
    for (const f of [s, o]) {
      const u = (f - i[1]) / a;
      if (u > 0) {
        const h = i[0] + u * r;
        h >= e && h <= n && c.push({ t: u, x: h, y: f });
      }
    }
  if (c.length === 0) return null;
  c.sort((f, u) => f.t - u.t);
  const l = c[0];
  return [l.x, l.y];
}
function Mn(i, t, e) {
  const n = i.length, s = new Array(n).fill(1);
  for (const o of t)
    for (let r = 0; r < n; r++) {
      const a = (r + 1) % n, c = ze([i[r].bakw, i[a].bakw]), l = ze([e.bakw, o.bakw]), f = Ni(c, l);
      if (f.features.length > 0 && f.features[0].geometry) {
        const u = f.features[0], h = Math.sqrt(
          Math.pow(o.bakw[0] - e.bakw[0], 2) + Math.pow(o.bakw[1] - e.bakw[1], 2)
        ), b = Math.sqrt(
          Math.pow(u.geometry.coordinates[0] - e.bakw[0], 2) + Math.pow(u.geometry.coordinates[1] - e.bakw[1], 2)
        ), y = h / b;
        y > s[r] && (s[r] = y), y > s[a] && (s[a] = y);
      }
    }
  i.forEach((o, r) => {
    const a = s[r];
    o.bakw = [
      (o.bakw[0] - e.bakw[0]) * a + e.bakw[0],
      (o.bakw[1] - e.bakw[1]) * a + e.bakw[1]
    ];
  });
}
function Ue(i, t, e, n, s) {
  const { convexBuf: o, centroid: r, allGcps: a, minx: c, maxx: l, miny: f, maxy: u } = i, h = s ? void 0 : yr(o, r, t, n), y = [
    [c, f],
    [l, f],
    [l, u],
    [c, u]
  ].map((k) => ({
    forw: k,
    bakw: s ? s(k) : br(
      k,
      r,
      h[vr(k, r.forw)]
    )
  }));
  if (y.sort(
    (k, A) => Math.atan2(k.forw[0] - r.forw[0], k.forw[1] - r.forw[1]) - Math.atan2(A.forw[0] - r.forw[0], A.forw[1] - r.forw[1])
  ), s || Mn(y, a, r), !e || i.ring?.cornersOnly) return y;
  const p = 4, M = y.map(
    (k) => Math.atan2(k.forw[0] - r.forw[0], k.forw[1] - r.forw[1])
  ), I = y.map(
    (k) => Math.atan2(
      k.bakw[0] - r.bakw[0],
      -(k.bakw[1] - r.bakw[1])
    )
  );
  function g(k) {
    for (let A = 0; A < p; A++) {
      const O = (A + 1) % p, B = M[A], D = A < p - 1 ? M[O] : M[O] + 2 * Math.PI;
      let C = k;
      for (; C < B; ) C += 2 * Math.PI;
      for (; C >= B + 2 * Math.PI; ) C -= 2 * Math.PI;
      if (C >= B && C < D)
        return { i: A, j: O, frac: (C - B) / (D - B) };
    }
    return { i: 0, j: 1, frac: 0 };
  }
  function w(k) {
    const { i: A, j: O, frac: B } = g(k), D = I[A];
    let x = I[O] - D;
    for (; x > Math.PI; ) x -= 2 * Math.PI;
    for (; x < -Math.PI; ) x += 2 * Math.PI;
    return D + B * x;
  }
  const d = new Set(
    y.map(
      (k) => Math.floor(Pe(k.forw, r.forw) / 10) % 36
    )
  ), m = a.map((k) => ({
    forw: k.forw,
    bakw: k.bakw,
    angleDeg: Pe(k.forw, r.forw),
    forwDist: Math.hypot(k.forw[0] - r.forw[0], k.forw[1] - r.forw[1])
  })), v = [];
  for (let k = 0; k < 36; k++) {
    if (d.has(k) || i.ring?.skipBins?.has(k)) continue;
    const A = k * 10, O = m.filter((S) => {
      if (S.forwDist === 0) return !1;
      const F = ((S.angleDeg - A) % 360 + 360) % 360;
      return F < 10 + bn || F > 360 - bn;
    });
    let B = null;
    if (O.length > 0) {
      const S = O.reduce((F, $) => $.forwDist > F.forwDist ? $ : F);
      B = Sn(r.forw, S.forw, c, l, f, u);
    }
    if (!B) {
      const S = (A + 5) % 360 * (Math.PI / 180), F = [
        r.forw[0] + Math.sin(S),
        r.forw[1] + Math.cos(S)
      ];
      B = Sn(r.forw, F, c, l, f, u);
    }
    if (!B) continue;
    const [D, C] = B, x = 1e-9 * Math.max(l - c, u - f);
    if ([...y, ...v].some(
      (S) => Math.abs(S.forw[0] - D) <= x && Math.abs(S.forw[1] - C) <= x
    )) continue;
    if (s) {
      v.push({ forw: B, bakw: s(B) });
      continue;
    }
    const T = [B[0] - r.forw[0], B[1] - r.forw[1]], _ = Math.atan2(T[0], T[1]), N = w(_), R = [
      r.bakw[0] + Math.sin(N),
      r.bakw[1] - Math.cos(N)
    ], P = Sr(r.bakw, R, y);
    P && v.push({ forw: B, bakw: P });
  }
  const E = [...y, ...v];
  return E.sort(
    (k, A) => Math.atan2(k.forw[0] - r.forw[0], k.forw[1] - r.forw[1]) - Math.atan2(A.forw[0] - r.forw[0], A.forw[1] - r.forw[1])
  ), s || Mn(E, a, r), E;
}
function Mr(i, t = !1) {
  return Ue(i, "plain", t, t ? "farLsq" : "min");
}
function _r(i, t = !1) {
  return Ue(i, "birdeye", t, "min");
}
function Er(i, t) {
  const e = /* @__PURE__ */ new Set();
  return Ue(i, "plain", !0, "min", t).filter(({ forw: [n, s] }) => {
    const o = `${n}:${s}`;
    return e.has(o) ? !1 : (e.add(o), !0);
  });
}
const _n = (i) => typeof i == "string" && i.startsWith("b");
function kr(i, t) {
  const e = (n, s) => {
    for (let o = 0; o < 3; o++) {
      const r = n.g[o], a = n.g[(o + 1) % 3];
      if (s.g.every((c) => n.sign * lt(r[0], r[1], a[0], a[1], c[0], c[1]) <= 0)) return !0;
    }
    return !1;
  };
  return !e(i, t) && !e(t, i);
}
function Ar(i) {
  const t = i.features.map((a) => {
    const { a: c, b: l, c: f } = a.properties, u = [c.geom, l.geom, f.geom], h = a.geometry.coordinates[0].slice(0, 3), b = u.map(([I]) => I), y = u.map(([, I]) => I), p = Math.sign(lt(h[0][0], h[0][1], h[1][0], h[1][1], h[2][0], h[2][1])), M = Math.sign(lt(u[0][0], u[0][1], u[1][0], u[1][1], u[2][0], u[2][1]));
    return {
      ids: [c.index, l.index, f.index],
      f: h,
      g: u,
      sign: M,
      ratio: p * M,
      aux: [c.index, l.index, f.index].some(_n),
      minx: Math.min(...b),
      maxx: Math.max(...b),
      miny: Math.min(...y),
      maxy: Math.max(...y)
    };
  }), e = t.map((a) => a.ratio), n = e.reduce((a, c) => a + c, 0) < 0 ? -1 : 1, s = /* @__PURE__ */ new Set();
  t.forEach((a, c) => {
    a.aux && (e[c] === 0 || e[c] !== n) && s.add(c);
  });
  const o = t.map((a, c) => c).sort((a, c) => t[a].minx - t[c].minx);
  for (let a = 0; a < o.length; a++) {
    const c = t[o[a]];
    if (c.sign !== 0)
      for (let l = a + 1; l < o.length; l++) {
        const f = t[o[l]];
        if (f.minx >= c.maxx) break;
        f.sign === 0 || f.miny >= c.maxy || c.miny >= f.maxy || !c.aux && !f.aux || kr(c, f) && (s.add(o[a]), s.add(o[l]));
      }
  }
  const r = /* @__PURE__ */ new Map();
  for (const a of s)
    t[a].ids.forEach((c, l) => {
      _n(c) && r.set(String(c), t[a].f[l]);
    });
  return [...r.values()];
}
function Es(i) {
  return qn(i, 1 / 0);
}
const En = 1e5, Ir = 16;
function qn(i, t) {
  return Tr(i), new Br(i).findSegmentIntersections(t).map(
    (s) => Yt([s.x, s.y])
  );
}
function Tr(i) {
  for (let t = 0, e = i.length; t < e; t++) {
    const n = i[t];
    ne(n) || Lt(
      "findIntersections() received invalid coordinates:",
      `line=${t}`,
      `points=${n}`
    );
    for (let s = 0, o = n.length; s < o; s++) {
      const r = n[s];
      (!ne(r) || !Number.isFinite(r[0]) || !Number.isFinite(r[1])) && Lt(
        "findIntersections() received non-finite coordinates:",
        `line=${t}`,
        `point=${s}`,
        `coordinates=${JSON.stringify(r)}`
      );
    }
  }
}
class Br {
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
      const r = o ? o.length : 0;
      for (let a = 0; a < r; a++)
        e.push(o[a][0]), n.push(o[a][1]);
      return r;
    });
    this.initXYData(s, e, n);
  }
  initXYData(t, e, n) {
    const s = t.length;
    this._xx = new Float64Array(e), this._yy = new Float64Array(n), this._nn = new Uint32Array(t), this._zz = null, this._zlimit = 0, this._filteredArcIter = null, this._ii = new Uint32Array(s);
    let o = 0;
    for (let r = 0; r < s; r++)
      this._ii[r] = o, o += t[r];
    (o != this._xx.length || this._xx.length != this._yy.length) && Lt("ArcCollection#initXYData() Counting error"), this.initBounds(), this._arcIter = new Wr(this._xx, this._yy);
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
    const s = n.length, o = new Float64Array(s * 4), r = new ie();
    let a = 0, c, l, f;
    for (let u = 0; u < s; u++)
      c = n[u], c > 0 && (l = u * 4, f = Jr(t, e, a, c), o[l++] = f[0], o[l++] = f[1], o[l++] = f[2], o[l] = f[3], a += c, r.mergeBounds(f));
    return {
      bb: o,
      bounds: r
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
    const n = t >= 0, s = n ? t : ~t, o = this.getRetainedInterval(), r = this._nn[s], a = n ? 1 : -1;
    let c = n ? this._ii[s] : this._ii[s] + r - 1, l = c, f = 0;
    for (let u = 1; u < r; u++)
      l += a, (o === 0 || this._zz[l] >= o) && (e(c, l, this._xx, this._yy), c = l, f++);
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
    const e = t * 4;
    return (!this.buf || this.buf.byteLength < e) && (this.buf = new ArrayBuffer(e)), new Uint32Array(this.buf, 0, t);
  }
  // Return average magnitudes of dx, dy (with simplification)
  getAvgSegment2() {
    let t = 0, e = 0;
    const n = this.forEachSegment(
      (s, o, r, a) => {
        t += Math.abs(r[s] - r[o]), e += Math.abs(a[s] - a[o]);
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
    const e = this.getBounds(), n = e.ymin || 0, s = (e.ymax || 0) - n, o = this.calcSegmentIntersectionStripeCount(), r = new Uint32Array(o), a = o > 1 ? (w) => Math.floor((o - 1) * (w - n) / s) : () => 0, c = o + 1;
    let l;
    this.forEachSegment(
      (w, d, m, v) => {
        let E = a(v[w]);
        const k = a(v[d]);
        let A = 0;
        for (; r[E] = r[E] + 2, E != k; )
          A++, A > c && Lt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${o}`,
            `s1=${E}`,
            `s2=${k}`
          ), E += k > E ? 1 : -1;
      }
    );
    const f = this.getUint32Array(Fr(r));
    let u = 0;
    const h = [];
    Rr(r, (w) => {
      const d = u;
      u += w, h.push(f.subarray(d, u));
    }), Cr(r, 0), this.forEachSegment(
      (w, d, m, v) => {
        let E = a(v[w]);
        const k = a(v[d]);
        let A, O, B = 0;
        for (; A = r[E], r[E] = A + 2, O = h[E], O[A] = w, O[A + 1] = d, E != k; )
          B++, B > c && Lt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${o}`,
            `s1=${E}`,
            `s2=${k}`
          ), E += k > E ? 1 : -1;
      }
    );
    const b = this.getVertexData(), y = t * Ir;
    let p = 0;
    const M = /* @__PURE__ */ new Set(), I = /* @__PURE__ */ new Map(), g = (w) => {
      p++;
      const d = Kr(w);
      return M.has(d) || (M.add(d), I.set(`${w.x}:${w.y}`, w)), I.size >= t || p >= y;
    };
    if (b.xx && b.yy)
      for (l = 0; l < o && !Dr(h[l], b.xx, b.yy, g); l++)
        ;
    return Array.from(I.values());
  }
}
function Lt(...i) {
  const t = i.join(" ");
  throw new Error(t);
}
function ne(i) {
  return i ? Nr(i) ? !0 : Or(i) ? !1 : i.length === 0 ? !0 : i.length > 0 : !1;
}
function Or(i) {
  return i != null && i.toString === String.prototype.toString;
}
function Nr(i) {
  return Array.isArray(i);
}
function Fr(i, t) {
  ne(i) || Lt("utils.sum() expects an array, received:", i);
  let e = 0, n;
  for (let s = 0, o = i.length; s < o; s++)
    n = i[s], n && (e += n);
  return e;
}
function Rr(i, t, e) {
  if (!ne(i))
    throw new Error(`#forEach() takes an array-like argument. ${i}`);
  for (let n = 0, s = i.length; n < s; n++)
    t.call(e, i[n], n);
}
function Cr(i, t) {
  for (let e = 0, n = i.length; e < n; e++)
    i[e] = t;
  return i;
}
function Dr(i, t, e, n) {
  const s = i.length - 2;
  let o, r, a, c, l, f, u, h, b, y, p, M, I, g, w, d, m;
  for (zr(t, i), d = 0; d < s; ) {
    for (o = i[d], r = i[d + 1], l = t[o], f = t[r], b = e[o], y = e[r], m = d; m < s && (m += 2, a = i[m], u = t[a], !(f < u)); ) {
      if (p = e[a], c = i[m + 1], h = t[c], M = e[c], b >= p) {
        if (b > M && y > p && y > M) continue;
      } else if (b < M && y < p && y < M) continue;
      if (!(o == a || o == c || r == a || r == c) && (I = Pr(
        l,
        b,
        f,
        y,
        u,
        p,
        h,
        M
      ), I && (g = [o, r], w = [a, c], n(An(I, g, w, t, e)) || I.length == 4 && n(An(I.slice(2), g, w, t, e)))))
        return !0;
    }
    d += 2;
  }
  return !1;
}
function Pr(i, t, e, n, s, o, r, a) {
  const c = $r(i, t, e, n, s, o, r, a);
  let l = null;
  return c && (l = Xr(i, t, e, n, s, o, r, a), l ? Vr(i, t, e, n, s, o, r, a) && (l = null) : l = qr(i, t, e, n, s, o, r, a)), l;
}
function $r(i, t, e, n, s, o, r, a) {
  return Qt(i, t, e, n, s, o) * Qt(i, t, e, n, r, a) <= 0 && Qt(s, o, r, a, i, t) * Qt(s, o, r, a, e, n) <= 0;
}
function Qt(i, t, e, n, s, o) {
  return Vn(i - s, t - o, e - s, n - o);
}
function Vn(i, t, e, n) {
  return i * n - t * e;
}
function Xr(i, t, e, n, s, o, r, a) {
  let c = ge(i, t, e, n, s, o, r, a), l;
  return c && (l = Yr(c[0], c[1], i, t, e, n, s, o, r, a), l == 1 ? c = ge(e, n, i, t, s, o, r, a) : l == 2 ? c = ge(s, o, r, a, i, t, e, n) : l == 3 && (c = ge(r, a, s, o, i, t, e, n))), c && jr(c, i, t, e, n, s, o, r, a), c;
}
function ge(i, t, e, n, s, o, r, a) {
  const c = Vn(e - i, n - t, r - s, a - o), l = 1e-18;
  let f;
  if (c === 0) return null;
  const u = Qt(s, o, r, a, i, t) / c;
  return c <= l && c >= -l ? f = Lr(i, t, e, n, s, o, r, a) : f = [i + u * (e - i), t + u * (n - t)], f;
}
function Lr(i, t, e, n, s, o, r, a) {
  let c = null;
  return !It(i, s, r) && !It(t, o, a) ? c = [i, t] : !It(e, s, r) && !It(n, o, a) ? c = [e, n] : !It(s, i, e) && !It(o, t, n) ? c = [s, o] : !It(r, i, e) && !It(a, t, n) && (c = [r, a]), c;
}
function It(i, t, e) {
  let n;
  return t < e ? n = i < t || i > e : t > e ? n = i > t || i < e : n = i != t, n;
}
function Yr(i, t, ...e) {
  let n = -1, s = 1 / 0, o;
  for (let r = 0, a = 0, c = e.length; a < c; r++, a += 2)
    o = Ur(i, t, e[a], e[a + 1]), o < s && (s = o, n = r);
  return n;
}
function Ur(i, t, e, n) {
  const s = i - e, o = t - n;
  return s * s + o * o;
}
function jr(i, t, e, n, s, o, r, a, c) {
  let l = i[0], f = i[1];
  l = me(l, t, n), l = me(l, o, a), f = me(f, e, s), f = me(f, r, c), i[0] = l, i[1] = f;
}
function me(i, t, e) {
  let n;
  return It(i, t, e) && (n = Math.abs(i - t) < Math.abs(i - e) ? t : e, i = n), i;
}
function qr(i, t, e, n, s, o, r, a) {
  const c = Math.min(i, e, s, r), l = Math.max(i, e, s, r), f = Math.min(t, n, o, a), u = Math.max(t, n, o, a), h = u - f > l - c;
  let b = [];
  return (h ? Ct(t, f, u) : Ct(i, c, l)) && b.push(i, t), (h ? Ct(n, f, u) : Ct(e, c, l)) && b.push(e, n), (h ? Ct(o, f, u) : Ct(s, c, l)) && b.push(s, o), (h ? Ct(a, f, u) : Ct(r, c, l)) && b.push(r, a), (b.length != 2 && b.length != 4 || b.length == 4 && b[0] == b[2] && b[1] == b[3]) && (b = null), b;
}
function Vr(i, t, e, n, s, o, r, a) {
  return i == s && t == o || i == r && t == a || e == s && n == o || e == r && n == a;
}
function Ct(i, t, e) {
  return i > t && i < e;
}
function zr(i, t) {
  Gr(i, t), zn(i, t, 0, t.length - 2);
}
function Gr(i, t) {
  for (let e = 0, n = t.length; e < n; e += 2)
    i[t[e]] > i[t[e + 1]] && Hr(t, e, e + 1);
}
function Hr(i, t, e) {
  const n = i[t];
  i[t] = i[e], i[e] = n;
}
function zn(i, t, e, n) {
  let s = e, o = n, r, a;
  for (; s < n; ) {
    for (r = i[t[e + n >> 2 << 1]]; s <= o; ) {
      for (; i[t[s]] < r; ) s += 2;
      for (; i[t[o]] > r; ) o -= 2;
      s <= o && (a = t[s], t[s] = t[o], t[o] = a, a = t[s + 1], t[s + 1] = t[o + 1], t[o + 1] = a, s += 2, o -= 2);
    }
    if (o - e < 40 ? kn(i, t, e, o) : zn(i, t, e, o), n - s < 40) {
      kn(i, t, s, n);
      return;
    }
    e = s, o = n;
  }
}
function kn(i, t, e, n) {
  let s, o;
  for (let r = e + 2; r <= n; r += 2) {
    s = t[r], o = t[r + 1];
    let a;
    for (a = r - 2; a >= e && i[s] < i[t[a]]; a -= 2)
      t[a + 2] = t[a], t[a + 3] = t[a + 1];
    t[a + 2] = s, t[a + 3] = o;
  }
}
function An(i, t, e, n, s) {
  const o = i[0], r = i[1];
  t = In(o, r, t[0], t[1], n, s), e = In(o, r, e[0], e[1], n, s);
  const a = t[0] < e[0] ? t : e, c = a == t ? e : t;
  return { x: o, y: r, a, b: c };
}
function In(i, t, e, n, s, o) {
  let r = e < n ? e : n, a = r === e ? n : e;
  return s[r] == i && o[r] == t ? a = r : s[a] == i && o[a] == t && (r = a), [r, a];
}
function Kr(i) {
  return `${i.a.join(",")};${i.b.join(",")}`;
}
class Wr {
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
function Jr(i, t, e, n) {
  let s = e | 0;
  const o = isNaN(n) ? i.length - s : n + s;
  let r, a, c, l, f, u;
  if (o > 0)
    c = f = i[s], l = u = t[s];
  else return [void 0, void 0, void 0, void 0];
  for (s++; s < o; s++)
    r = i[s], a = t[s], r < c && (c = r), r > f && (f = r), a < l && (l = a), a > u && (u = a);
  return [c, l, f, u];
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
    let o, r, a, c;
    if (arguments.length == 1)
      if (ne(t)) {
        const l = t;
        o = l[0], r = l[1], a = l[2], c = l[3];
      } else {
        const l = t;
        o = l.xmin, r = l.ymin, a = l.xmax, c = l.ymax;
      }
    else
      o = t, r = e, a = n, c = s;
    return this.xmin = o, this.ymin = r, this.xmax = a, this.ymax = c, (o > a || r > c) && this.update(), this;
  }
  update() {
    let t;
    this.xmin > this.xmax && (t = this.xmin, this.xmin = this.xmax, this.xmax = t), this.ymin > this.ymax && (t = this.ymin, this.ymin = this.ymax, this.ymax = t);
  }
  mergeBounds(t, ...e) {
    let n, s, o, r;
    return t instanceof ie ? (n = t.xmin, s = t.ymin, o = t.xmax, r = t.ymax) : e.length == 3 ? (n = t, s = e[0], o = e[1], r = e[2]) : t.length == 4 ? (n = t[0], s = t[1], o = t[2], r = t[3]) : Lt("Bounds#mergeBounds() invalid argument:", t), this.xmin === void 0 ? this.setBounds(n, s, o, r) : (n < this.xmin && (this.xmin = n), s < this.ymin && (this.ymin = s), o > this.xmax && (this.xmax = o), r > this.ymax && (this.ymax = r)), this;
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
function Gn(i, t, e) {
  const n = xe(t.forw), s = xe(t.bakw);
  if (JSON.stringify(n) != JSON.stringify(s))
    throw `${JSON.stringify(t, null, 2)}
${JSON.stringify(
      n
    )}
${JSON.stringify(s)}`;
  for (let o = 0; o < n.length; o++) {
    const r = n[o];
    i[r] || (i[r] = []), i[r].push(t);
  }
  e && (e.forw.features.push(t.forw), e.bakw.features.push(t.bakw));
}
function Tn(i, t, e) {
  const n = xe(t.forw), s = xe(t.bakw);
  if (JSON.stringify(n) != JSON.stringify(s))
    throw `${JSON.stringify(t, null, 2)}
${JSON.stringify(n)}
${JSON.stringify(s)}`;
  if (n.forEach((o) => {
    const r = i[o];
    if (!r) return;
    const a = r.filter((c) => c !== t);
    a.length === 0 ? delete i[o] : i[o] = a;
  }), e) {
    const o = (r, a) => {
      !r || !a || (r.features = r.features.filter((c) => c !== a));
    };
    o(e.forw, t.forw), o(e.bakw, t.bakw);
  }
}
function we(i, t = 1e-6) {
  const [e, n] = i[0], [s, o] = i[1], [r, a] = i[2];
  return Math.abs((s - e) * (a - n) - (r - e) * (o - n)) < t;
}
function Qr(i, t) {
  const e = /* @__PURE__ */ new Set();
  return i.forEach((n) => {
    if (n.length !== 2) return;
    const s = n.map((o) => `${t?.[o] ?? o}`);
    e.add(s.sort().join("-"));
  }), e;
}
function Zt(i) {
  return ["a", "b", "c"].map((t, e) => ({
    prop: i.properties[t],
    geom: i.geometry.coordinates[0][e]
  }));
}
const Zr = 10;
function ts(i, t, e, n, s, o) {
  if (!i && !t) return !1;
  const r = i ? 0 : 1, a = 1 - r, c = e[r], l = e[a];
  if (!c || !l) return !1;
  const f = bt(l.geom);
  let u = !1, h = !1;
  for (let b = 0; b <= 1; b++) {
    const y = n[b];
    if (!y) continue;
    const p = [String(y.prop.index), String(c.prop.index)].sort().join("-"), M = s[p];
    if (!M || M.length < 2) continue;
    const I = M.find(
      (B) => B.bakw !== o[r].bakw
    );
    if (!I) continue;
    const w = Zt(I.bakw).find(
      (B) => String(B.prop.index) !== String(y.prop.index) && String(B.prop.index) !== String(c.prop.index)
    );
    if (!w) continue;
    u = !0;
    const d = bt(w.geom), m = bt(y.geom), v = bt(c.geom), E = v[0] - m[0], k = v[1] - m[1], A = E * (f[1] - m[1]) - k * (f[0] - m[0]), O = E * (d[1] - m[1]) - k * (d[0] - m[0]);
    if (A * O > 0) {
      h = !0;
      break;
    }
  }
  return u && !h;
}
function es(i, t, e, n) {
  if (!i && !t) return !1;
  if (e[0] && e[1] && n[0] && n[1]) {
    const s = n.map((f) => bt(f.geom)), o = e.map((f) => bt(f.geom)), r = s[1][0] - s[0][0], a = s[1][1] - s[0][1], c = r * (o[0][1] - s[0][1]) - a * (o[0][0] - s[0][0]), l = r * (o[1][1] - s[0][1]) - a * (o[1][0] - s[0][0]);
    return c * l < 0;
  }
  return !1;
}
function ns(i, t, e, n) {
  const s = Qr(e, n), o = /* @__PURE__ */ new Set();
  let r = !1;
  for (let a = 0; a < Zr; a++) {
    let c = !1;
    for (const l of Object.keys(t)) {
      if (o.has(l)) continue;
      o.add(l);
      const f = t[l];
      if (!f || f.length < 2) continue;
      const u = l.split("-");
      if (u.length !== 2 || s.has(l)) continue;
      const h = Zt(f[0].bakw), b = Zt(f[1].bakw), y = Zt(f[0].forw), p = Zt(f[1].forw), M = u.map(
        (S) => h.find((F) => `${F.prop.index}` === S) || b.find((F) => `${F.prop.index}` === S)
      ), I = u.map(
        (S) => y.find((F) => `${F.prop.index}` === S) || p.find((F) => `${F.prop.index}` === S)
      );
      if (M.some((S) => !S) || I.some((S) => !S))
        continue;
      const g = [h, b].map(
        (S) => S.find((F) => !u.includes(`${F.prop.index}`))
      ), w = [y, p].map(
        (S) => S.find((F) => !u.includes(`${F.prop.index}`))
      );
      if (g.some((S) => !S) || w.some((S) => !S))
        continue;
      const d = f[0].bakw.geometry.coordinates[0].slice(0, 3).map((S) => bt(S)), m = f[1].bakw.geometry.coordinates[0].slice(0, 3).map((S) => bt(S)), v = f[0].forw.geometry.coordinates[0].slice(0, 3).map((S) => bt(S)), E = f[1].forw.geometry.coordinates[0].slice(0, 3).map((S) => bt(S)), k = we(d), A = we(m), O = we(v), B = we(E), D = ts(
        k,
        A,
        g,
        M,
        t,
        f
      ), C = es(
        O,
        B,
        g,
        M
      );
      if (!(D || C || Bn(
        bt(g[0].geom),
        m
      ) || Bn(
        bt(g[1].geom),
        d
      )))
        continue;
      const T = I.map(
        (S) => bt(S.geom)
      ), _ = w.map(
        (S) => bt(S.geom)
      ), N = is([
        ...T,
        ..._
      ]), R = rs(N), P = On(
        T[0],
        T[1],
        _[0]
      ) + On(
        T[0],
        T[1],
        _[1]
      );
      $e(R, P) && (Tn(t, f[0], i), Tn(t, f[1], i), M.forEach((S) => {
        if (!S) return;
        const F = [
          S.geom,
          g[0].geom,
          g[1].geom,
          S.geom
        ], $ = {
          a: S.prop,
          b: g[0].prop,
          c: g[1].prop
        }, L = re([F], $), j = $n(L);
        Gn(t, {
          forw: j,
          bakw: L
        }, i);
      }), c = !0, r = !0);
    }
    if (!c) break;
  }
  return r;
}
function bt(i) {
  return [i[0], i[1]];
}
function Bn(i, t) {
  const [e, n] = t[0], [s, o] = t[1], [r, a] = t[2], c = r - e, l = a - n, f = s - e, u = o - n, h = i[0] - e, b = i[1] - n, y = c * c + l * l, p = c * f + l * u, M = c * h + l * b, I = f * f + u * u, g = f * h + u * b, w = y * I - p * p;
  if (w === 0) return !1;
  const d = 1 / w, m = (I * M - p * g) * d, v = (y * g - p * M) * d, E = 1e-9;
  return m >= -E && v >= -E && m + v <= 1 + E;
}
function is(i) {
  const t = i.map((r) => r.slice()).filter(
    (r, a, c) => c.findIndex(
      (l) => $e(l[0], r[0]) && $e(l[1], r[1])
    ) === a
  );
  if (t.length <= 1) return t;
  const e = t.sort(
    (r, a) => r[0] === a[0] ? r[1] - a[1] : r[0] - a[0]
  ), n = (r, a, c) => (a[0] - r[0]) * (c[1] - r[1]) - (a[1] - r[1]) * (c[0] - r[0]), s = [];
  for (const r of e) {
    for (; s.length >= 2 && n(
      s[s.length - 2],
      s[s.length - 1],
      r
    ) <= 0; )
      s.pop();
    s.push(r);
  }
  const o = [];
  for (let r = e.length - 1; r >= 0; r--) {
    const a = e[r];
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
function rs(i) {
  if (i.length < 3) return 0;
  let t = 0;
  for (let e = 0; e < i.length; e++) {
    const [n, s] = i[e], [o, r] = i[(e + 1) % i.length];
    t += n * r - o * s;
  }
  return Math.abs(t) / 2;
}
function On(i, t, e) {
  return Math.abs(
    (i[0] * (t[1] - e[1]) + t[0] * (e[1] - i[1]) + e[0] * (i[1] - t[1])) / 2
  );
}
function $e(i, t, e = 1e-9) {
  return Math.abs(i - t) <= e;
}
const ss = (i) => typeof i == "string" && i.startsWith("b");
function os(i, t) {
  const e = (n, s) => {
    for (let o = 0; o < 3; o++) {
      const r = n.g[o], a = n.g[(o + 1) % 3];
      if (s.g.every((c) => n.sign * lt(r[0], r[1], a[0], a[1], c[0], c[1]) <= 0)) return !0;
    }
    return !1;
  };
  return !e(i, t) && !e(t, i);
}
function as(i, t, e) {
  if (t.length === 0) return [];
  const n = i.features.map((p) => {
    const { a: M, b: I, c: g } = p.properties, w = [M.geom, I.geom, g.geom], [d, m, v] = p.geometry.coordinates[0], E = w.map(([B]) => B), k = w.map(([, B]) => B), A = Math.sign(lt(d[0], d[1], m[0], m[1], v[0], v[1])), O = Math.sign(lt(w[0][0], w[0][1], w[1][0], w[1][1], w[2][0], w[2][1]));
    return {
      ids: [M.index, I.index, g.index].map(String),
      g: w,
      sign: O,
      ratio: A * O,
      aux: [M.index, I.index, g.index].some(ss),
      minx: Math.min(...E),
      maxx: Math.max(...E),
      miny: Math.min(...k),
      maxy: Math.max(...k)
    };
  }), s = n.map((p) => p.ratio), o = s.reduce((p, M) => p + M, 0) < 0 ? -1 : 1, r = (p, M) => p < M ? `${p}|${M}` : `${M}|${p}`, a = /* @__PURE__ */ new Map();
  n.forEach((p, M) => {
    for (let I = 0; I < 3; I++) {
      const g = r(p.ids[I], p.ids[(I + 1) % 3]), w = a.get(g);
      w ? w.push(M) : a.set(g, [M]);
    }
  });
  const c = ([p, M]) => r(String(e[p]), String(e[M])), l = /* @__PURE__ */ new Set();
  for (const p of t) for (const M of a.get(c(p)) ?? []) l.add(M);
  const f = (p) => n[p].aux || l.has(p), u = /* @__PURE__ */ new Set();
  n.forEach((p, M) => {
    f(M) && (s[M] === 0 || s[M] !== o) && u.add(M);
  });
  const h = n.map((p, M) => M).sort((p, M) => n[p].minx - n[M].minx);
  for (let p = 0; p < h.length; p++) {
    const M = n[h[p]];
    if (M.sign !== 0)
      for (let I = p + 1; I < h.length; I++) {
        const g = n[h[I]];
        if (g.minx >= M.maxx) break;
        g.sign === 0 || g.miny >= M.maxy || M.miny >= g.maxy || !f(h[p]) && !f(h[I]) || os(M, g) && (u.add(h[p]), u.add(h[I]));
      }
  }
  if (u.size === 0) return [];
  const b = t.filter((p) => (a.get(c(p)) ?? []).some((M) => u.has(M)));
  if (b.length > 0) return b;
  const y = /* @__PURE__ */ new Set();
  for (const p of u) for (const M of n[p].ids) M.startsWith("b") || y.add(M);
  return t.filter(
    ([p, M]) => y.has(String(e[p])) || y.has(String(e[M]))
  );
}
const cs = 4, Nn = 32, ls = 1, us = 0.4, Hn = 4, fs = 1e-4, Kn = 0.25, hs = 0.01, Dt = (i, t) => String(i) < String(t) ? `${i}|${t}` : `${t}|${i}`;
function Ce(i, t, e) {
  const n = t.filter((l) => !String(l.properties.target.index).startsWith("b")).map((l) => ({
    id: l.properties.target.index,
    paper: l.geometry.coordinates,
    geo: l.properties.target.geom
  })), s = /* @__PURE__ */ new Set();
  let o = 0, r = 0;
  const a = i.features.map((l) => {
    const { a: f, b: u, c: h } = l.properties, [b, y, p] = l.geometry.coordinates[0];
    s.add(Dt(f.index, u.index)), s.add(Dt(f.index, h.index)), s.add(Dt(u.index, h.index));
    const M = Math.sign(lt(b[0], b[1], y[0], y[1], p[0], p[1])) * Math.sign(lt(f.geom[0], f.geom[1], u.geom[0], u.geom[1], h.geom[0], h.geom[1]));
    return M > 0 ? o++ : M < 0 && r++, {
      ids: [String(f.index), String(u.index), String(h.index)],
      paper: [b, y, p],
      geo: [f.geom, u.geom, h.geom],
      sign: M
    };
  }), c = e.filter(([l, f]) => !s.has(Dt(n[l].id, n[f].id)));
  return { points: n, triangles: a, majority: o >= r ? 1 : -1, hullEdges: e, dropped: c };
}
function Wn(i) {
  return [i.foot[0] + i.height * i.normal[0], i.foot[1] + i.height * i.normal[1]];
}
function ds(i, [t, e], { lambda: n = Kn, epsilon: s = fs } = {}) {
  const { points: o, majority: r } = i, a = o[t], c = o[e], l = o.reduce((_, N) => _ + N.paper[0], 0) / o.length, f = o.reduce((_, N) => _ + N.paper[1], 0) / o.length, u = Math.sign(lt(a.paper[0], a.paper[1], c.paper[0], c.paper[1], l, f));
  if (u === 0) return;
  const h = u * r, b = [c.paper[0] - a.paper[0], c.paper[1] - a.paper[1]], y = [c.geo[0] - a.geo[0], c.geo[1] - a.geo[1]], p = Math.hypot(b[0], b[1]), M = Math.hypot(y[0], y[1]);
  if (!(p > 0 && M > 0)) return;
  const I = [];
  for (const _ of o) {
    if (_ === a || _ === c) continue;
    const N = lt(a.geo[0], a.geo[1], c.geo[0], c.geo[1], _.geo[0], _.geo[1]);
    if (N * h >= 0) continue;
    const R = ((_.geo[0] - a.geo[0]) * y[0] + (_.geo[1] - a.geo[1]) * y[1]) / (M * M), P = ((_.paper[0] - a.paper[0]) * b[0] + (_.paper[1] - a.paper[1]) * b[1]) / (p * p);
    R > 0 && R < 1 && P > 0 && P < 1 && I.push({ id: _.id, u: R, t: P, d: Math.abs(N) / M });
  }
  const g = I.length > 0;
  g || I.push({ u: 0.5, t: 0.5, d: 0 });
  const w = I.reduce((_, N) => N.d > _.d ? N : _);
  let d = 0;
  for (const _ of I)
    d = Math.max(d, _.u <= w.u ? _.d * w.u / _.u : _.d * (1 - w.u) / (1 - _.u));
  d *= 1 + n;
  const m = [-b[1] / p * u, b[0] / p * u], v = [-y[1] / M * h, y[0] / M * h], E = (_) => [
    a.paper[0] + _ * b[0] + s * p * m[0],
    a.paper[1] + _ * b[1] + s * p * m[1]
  ], k = (_, N, R, P) => ({
    paper: E(_),
    foot: [a.geo[0] + N * y[0], a.geo[1] + N * y[1]],
    normal: v,
    height: R,
    chord: M,
    protrusion: w.d,
    ...P === void 0 ? {} : { anchor: P }
  }), A = [k(w.t, w.u, d, g ? w.id : void 0)], O = [...I].sort((_, N) => _.u - N.u), B = [{ u: 0, d: 0 }], D = (_, N, R) => (N.u - _.u) * (R.d - _.d) - (N.d - _.d) * (R.u - _.u);
  for (const _ of [...O, { u: 1, d: 0 }]) {
    for (; B.length >= 2 && D(B[B.length - 2], B[B.length - 1], _) >= 0; ) B.pop();
    B.push(_);
  }
  const C = n * w.d, x = [];
  let T = 0;
  for (const _ of B.slice(1, -1))
    _.t === void 0 || !(_.t > T) || (T = _.t, x.push(k(_.t, _.u, _.d + C, g ? _.id : void 0)));
  return {
    edge: [a.id, c.id],
    variants: g && x.length > 1 ? [A, x] : [A]
  };
}
function ps(i, t, e, { lambda: n = Kn, mu: s = hs, maxIterations: o = Hn } = {}) {
  let r = i.map((a, c) => ({ ray: { ...a }, index: c }));
  for (let a = 0; a < o && r.length > 0; a++) {
    const c = e(r.map(({ ray: u }) => [u.paper, Wn(u)]));
    if (!c) return;
    let l = !1;
    const f = /* @__PURE__ */ new Set();
    for (const [u, { ray: h }] of r.entries()) {
      const b = `e${t + u}`;
      let y = -1 / 0, p = 1 / 0, M = 0;
      for (const d of c.triangles) {
        const m = d.ids.indexOf(b);
        if (m < 0) continue;
        d.sign !== c.majority && M++;
        const v = d.geo[(m + 1) % 3], E = d.geo[(m + 2) % 3], k = Math.sign(
          lt(
            d.paper[m][0],
            d.paper[m][1],
            d.paper[(m + 1) % 3][0],
            d.paper[(m + 1) % 3][1],
            d.paper[(m + 2) % 3][0],
            d.paper[(m + 2) % 3][1]
          )
        ), A = lt(h.foot[0], h.foot[1], v[0], v[1], E[0], E[1]), O = lt(h.foot[0] + h.normal[0], h.foot[1] + h.normal[1], v[0], v[1], E[0], E[1]) - A, B = k * c.majority;
        if (O === 0) {
          A * B <= 0 && (y = 1 / 0);
          continue;
        }
        const D = -A / O;
        O * B > 0 ? y = Math.max(y, D) : p = Math.min(p, D);
      }
      if (!(y < p)) {
        f.add(u);
        continue;
      }
      const I = Math.min(Math.max(n * Math.max(y, h.protrusion), s * h.chord), (p - y) / 2), g = Math.max(y, 0) + I, w = Math.abs(g - h.height) > 1e-9 * h.chord;
      (M > 0 || w) && (w && (l = !0), h.height = g);
    }
    if (f.size > 0 && (r = r.filter((u, h) => !f.has(h)), l = !0), !l) break;
  }
  if (r.length !== 0)
    return { rays: r.map(({ ray: a }) => a), kept: r.map(({ index: a }) => a) };
}
function gs(i, t) {
  const e = (r) => typeof r == "string" && r.startsWith("e") && Number(r.slice(1)) >= t ? Number(r.slice(1)) : void 0, n = /* @__PURE__ */ new Set();
  for (const { ids: r } of i.triangles)
    n.add(Dt(r[0], r[1])), n.add(Dt(r[0], r[2])), n.add(Dt(r[1], r[2]));
  const s = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set();
  for (const [r, a] of i.hullEdges) {
    const c = n.has(Dt(i.points[r].id, i.points[a].id));
    for (const l of [r, a]) {
      const f = e(i.points[l].id);
      f !== void 0 && (o.add(f), c || s.add(f));
    }
  }
  for (const r of i.points) {
    const a = e(r.id);
    a !== void 0 && !o.has(a) && s.add(a);
  }
  return s;
}
function ms(i, t) {
  const e = { rounds: 0, builds: 0, cost: 0, budget: 0, batches: 0, perEdge: 0, multiPoint: 0 };
  let n = [], s = [], o = t, r = i.snapshot();
  const a = /* @__PURE__ */ new Set(), c = ls * i.baseCost;
  e.budget = c;
  const l = i.buildCost();
  let f = 0;
  const u = () => f * us + i.buildCost() - l, h = () => u() >= c, b = (g) => {
    if (!h())
      return e.builds++, f++, i.measure(g);
  }, y = (g) => [g.paper, Wn(g)], p = (g, w, d) => {
    const m = ps(
      g.map(({ ray: v }) => v),
      w,
      (v) => b([...n, ...v]),
      { maxIterations: d }
    );
    return m?.rays.map((v, E) => ({ ray: v, edge: g[m.kept[E]].edge }));
  }, M = (g, w) => g.length === w.length && g.every(({ ray: d }, m) => Math.abs(d.height - w[m].ray.height) <= 1e-9 * d.chord), I = (g) => {
    if (g.length === 0 || n.length + g.length > Nn) return !1;
    const w = i.edgeBase + n.length;
    let d = p(g, w, 1), m = !1;
    for (; d && d.length > 0 && !h(); ) {
      const v = [...n, ...d.map(({ ray: O }) => y(O))];
      e.builds++;
      const E = i.build(v, Math.max(1, Math.ceil(c - u()))), k = E ? gs(E.analysis, w) : void 0;
      if (E && k.size === 0)
        return s = s.concat(
          d.map(({ ray: O, edge: B }, D) => ({
            node: w + D,
            kind: "hullEdge",
            edge: B,
            ...O.anchor === void 0 ? {} : { anchor: O.anchor }
          }))
        ), n = v, o = E, r = i.snapshot(), !0;
      if (i.restore(r), E && k.size < d.length) {
        d = d.filter((O, B) => !k.has(w + B));
        continue;
      }
      if (m) return !1;
      m = !0;
      const A = p(d, w, Hn);
      if (!A || M(A, d)) return !1;
      d = A;
    }
    return !1;
  };
  for (let g = 1; g <= cs && !h(); g++) {
    const { analysis: w } = o, d = [];
    for (const v of w.dropped) {
      const E = v.map((A) => w.points[A].paper.join(",")).join("|");
      if (a.has(E) || (a.add(E), n.length + d.length + 1 > Nn)) continue;
      const k = ds(w, v);
      k && d.push(k);
    }
    if (d.length === 0) break;
    e.rounds = g;
    const m = (v, E) => E.map((k) => ({ ray: k, edge: v.edge }));
    if (I(d.flatMap((v) => m(v, v.variants[0])))) {
      e.batches++;
      continue;
    }
    for (const v of d)
      for (const [E, k] of v.variants.entries()) {
        if (h()) break;
        if (I(m(v, k))) {
          e.perEdge++, E > 0 && e.multiPoint++;
          break;
        }
      }
  }
  return i.restore(r), e.cost = u(), { pairs: n, records: s, result: o.result, diagnostics: e };
}
const Fn = 2.00704, Rn = 3.00001, ws = 12, ys = 4, Cn = 1, Dn = 4, vs = 8, bs = 24;
function xs(i) {
  if (i.size === 0) return [];
  if (i.size >= 36) return [[...i].sort((e, n) => e - n)];
  const t = [];
  for (let e = 0; e < 36; e++) {
    if (!i.has(e) || i.has((e + 35) % 36)) continue;
    const n = [e];
    for (let s = (e + 1) % 36; i.has(s); s = (s + 1) % 36) n.push(s);
    t.push(n);
  }
  return t;
}
const Pn = /* @__PURE__ */ Symbol("supplement pairs out of budget"), Ss = 24;
class nt extends ei {
  importance;
  priority;
  pointsSet;
  useV2Algorithm;
  /** V3 で補完点を足すか（`Options#supplementPairs`）。 */
  useSupplementPairs;
  supplementRecords = [];
  lastSupplementDiagnostics;
  lastBoundaryDiagnostics;
  /** `updateTin()` の中で三角網を組んだ試行の数（補助頂点の手当ての手間の上限に使う）。 */
  attemptTotal = 0;
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
    if (super(), t.bounds ? this.setBounds(t.bounds) : (this.setWh(t.wh), this.vertexMode = t.vertexMode || nt.VERTEX_PLAIN), this.strictMode = t.strictMode || nt.MODE_AUTO, this.yaxisMode = t.yaxisMode || nt.YAXIS_INVERT, this.importance = t.importance || 0, this.priority = t.priority || 0, this.stateFull = t.stateFull || !1, this.useV2Algorithm = t.useV2Algorithm ?? !1, this.useSupplementPairs = t.supplementPairs ?? !0, t.outerTransform === "worldFile") {
      if (this.useV2Algorithm) throw new Error("V2 では world file 外周を使えません");
      if (!t.worldFile) throw new Error("worldFile が必要です");
      ni(t.worldFile), this.requestedWorldFile = { ...t.worldFile };
    }
    t.points && this.setPoints(t.points), t.edges && this.setEdges(t.edges);
  }
  /**
   * フォーマットバージョンを取得します
   */
  getFormatVersion() {
    return this.useV2Algorithm ? Fn : Rn;
  }
  /**
   * 制御点（GCP: Ground Control Points）を設定します。
   * 指定した点群に合わせて内部のTINキャッシュをリセットします。
   */
  setPoints(t) {
    this.yaxisMode === nt.YAXIS_FOLLOW && (t = t.map((e) => [
      e[0],
      [e[1][0], -1 * e[1][1]]
    ])), this.points = t, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * エッジ（制約線）を設定します。
   * 制約線を正規化した上で、依存するキャッシュをリセットします。
   */
  setEdges(t = []) {
    this.edges = ii(t), this.edgeNodes = void 0, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 境界ポリゴンを設定します
   */
  setBounds(t) {
    this.bounds = t;
    let e = t[0][0], n = e, s = t[0][1], o = s;
    const r = [t[0]];
    for (let a = 1; a < t.length; a++) {
      const c = t[a];
      c[0] < e && (e = c[0]), c[0] > n && (n = c[0]), c[1] < s && (s = c[1]), c[1] > o && (o = c[1]), r.push(c);
    }
    r.push(t[0]), this.boundsPolygon = re([r]), this.xy = [e, s], this.wh = [n - e, o - s], this.vertexMode = nt.VERTEX_PLAIN, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 現在の設定を永続化可能な形式にコンパイルします
   */
  getCompiled() {
    const t = {};
    if (t.version = this.useV2Algorithm ? Fn : Rn, t.points = this.points, t.weight_buffer = {}, this.compiledOuter?.outerTransform === "worldFile")
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
          const s = e[n].features[0], o = s.geometry.coordinates[0][1], r = s.properties.b.geom;
          t.vertices_points[n] = [o, r];
        }
    }
    return t.strict_status = this.strict_status, t.tins_points = [[]], this.tins.forw.features.map((e) => {
      t.tins_points[0].push(
        ["a", "b", "c"].map(
          (n) => e.properties[n].index
        )
      );
    }), this.strict_status === nt.STATUS_LOOSE ? (t.tins_points[1] = [], this.tins.bakw.features.map((e) => {
      t.tins_points[1].push(
        ["a", "b", "c"].map(
          (n) => e.properties[n].index
        )
      );
    })) : this.strict_status === nt.STATUS_ERROR && this.kinks?.bakw && (t.kinks_points = this.kinks.bakw.features.map(
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
  calculateStrictTin(t = En) {
    this.resolveStrictOverlaps(), this.detectStrictKinks(t);
  }
  /**
   * 順三角網から逆三角網を写し、重なりを辺の反転で解消する（`calculateStrictTin` の前半）。
   * 交差の判定（`strict_status`・`kinks`）はしない。補完点の置き場所を測る試行は、三角網の向きを読むだけなので
   * これだけを呼ぶ。
   */
  resolveStrictOverlaps() {
    const t = this.tins.forw.features.map(
      (s) => $n(s)
    );
    this.tins.bakw = xt(t);
    const e = {};
    this.tins.forw.features.forEach((s, o) => {
      const r = this.tins.bakw.features[o];
      Gn(e, { forw: s, bakw: r });
    });
    const n = (this.pointsSet?.forw.features ?? []).map(
      (s) => s.properties.target.index
    );
    ns(
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
      return qn(s, t);
    });
    e[0].length === 0 && e[1].length === 0 ? (this.strict_status = nt.STATUS_STRICT, delete this.kinks) : (this.strict_status = nt.STATUS_ERROR, this.kinks = {
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
    for (let s = 0; s < this.points.length; s++) {
      const o = this.points[s][0], r = this.points[s][1], a = qt(o, r, s);
      t.forw.push(a), t.bakw.push(Vt(a));
    }
    const e = [];
    let n = 0;
    this.edgeNodes = [], this.edges || (this.edges = []);
    for (let s = 0; s < this.edges.length; s++) {
      const o = this.edges[s][2], r = Object.assign([], this.edges[s][0]), a = Object.assign([], this.edges[s][1]);
      if (Ms(o, this.points.length, s), r.length === 0 && a.length === 0) {
        e.push(o);
        continue;
      }
      r.unshift(this.points[o[0]][0]), r.push(this.points[o[1]][0]), a.unshift(this.points[o[0]][1]), a.push(this.points[o[1]][1]), fr(r, a).map((c, l, f) => {
        this.edgeNodes[n] = [
          c[0],
          c[1]
        ];
        const u = qt(
          c[0],
          c[1],
          `e${n}`
        );
        n++, t.forw.push(u), t.bakw.push(Vt(u)), l === 0 ? e.push([o[0], t.forw.length - 1]) : e.push([
          t.forw.length - 2,
          t.forw.length - 1
        ]), l === f.length - 1 && e.push([t.forw.length - 1, o[1]]);
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
    if (!this.points.reduce((c, l) => c && (o ? Je(l[0], o) : l[0][0] >= t && l[0][0] <= e && l[0][1] >= n && l[0][1] <= s), !0))
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
      const r = o[0][0], a = o[0][1];
      r < t && (t = r), r > e && (e = r), a < n && (n = a), a > s && (s = a);
    }
    return { minx: t, maxx: e, miny: n, maxy: s };
  }
  /**
   * TINネットワークを同期的に更新し、座標変換の準備を行います。
   * 重めの計算を伴うため、呼び出し側が非同期制御を行いたい場合は
   * {@link updateTinAsync} を利用してください。
   */
  updateTin() {
    this.lastBoundaryDiagnostics = void 0, this.supplementRecords = [], this.attemptTotal = 0, this.lastSupplementDiagnostics = void 0;
    let t = this.strictMode;
    t !== nt.MODE_STRICT && t !== nt.MODE_LOOSE && (t = nt.MODE_AUTO);
    const e = !this.useV2Algorithm, n = this.requestedWorldFile;
    if (n && !e) throw new Error("V2 では world file 外周を使えません");
    let s, o, r, a, c;
    if (e) {
      if (this.bounds) {
        const C = this.boundsPolygon;
        if (!C) throw new Error("Internal error: bounds is set but boundsPolygon is missing");
        if (!this.points.every(
          (T) => Je(T[0], C)
        )) throw "SOME POINTS OUTSIDE";
      }
      s = this.generatePointsSet(), { minx: o, maxx: r, miny: a, maxy: c } = this.computeGcpBbox();
    } else {
      const C = this.validateAndPrepareInputs();
      s = C.pointsSet, o = C.minx, r = C.maxx, a = C.miny, c = C.maxy;
    }
    const l = {
      forw: xt([...s.forw]),
      bakw: xt([...s.bakw])
    }, f = pe(
      l.forw,
      s.edges,
      "target"
    ), u = pe(
      l.bakw,
      s.edges,
      "target"
    );
    if (f.features.length === 0 || u.features.length === 0)
      throw "TOO LINEAR1";
    const h = Ci(l.forw), b = fn(l.forw);
    if (!b) throw "TOO LINEAR2";
    const y = {}, p = b.geometry.coordinates[0];
    let M;
    try {
      M = p.map((C) => ({
        forw: C,
        bakw: Me(Yt(C), f)
      })), M.forEach((C) => {
        y[`${C.forw[0]}:${C.forw[1]}`] = C;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const I = fn(l.bakw);
    if (!I) throw "TOO LINEAR2";
    const g = I.geometry.coordinates[0];
    try {
      M = g.map((C) => ({
        bakw: C,
        forw: Me(Yt(C), u)
      })), M.forEach((C) => {
        y[`${C.forw[0]}:${C.forw[1]}`] = C;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const w = {
      forw: h.geometry.coordinates,
      bakw: Me(h, f)
    }, d = qt(w.forw, w.bakw, "c");
    this.centroid = {
      forw: d,
      bakw: Vt(d)
    };
    const m = [
      ...this.points.map((C) => ({ forw: C[0], bakw: C[1] })),
      ...(this.edgeNodes ?? []).map((C) => ({ forw: C[0], bakw: C[1] }))
    ], v = {
      convexBuf: y,
      centroid: w,
      allGcps: m,
      minx: o,
      maxx: r,
      miny: a,
      maxy: c
    }, E = t === nt.MODE_STRICT || t === nt.MODE_AUTO, k = (C, x, T) => {
      if (!E || this.isStrict() || !C.boundary) return { result: C };
      const _ = () => ({
        build: this.captureBuild(),
        raw: [s.forw.slice(), s.bakw.slice()],
        gcps: m.slice(),
        edgeNodes: this.edgeNodes.slice(),
        supplementRecords: this.supplementRecords,
        supplementDiagnostics: this.lastSupplementDiagnostics
      }), N = (X) => {
        s.forw.splice(0, s.forw.length, ...X.raw[0]), s.bakw.splice(0, s.bakw.length, ...X.raw[1]), m.splice(0, m.length, ...X.gcps), this.edgeNodes.splice(0, this.edgeNodes.length, ...X.edgeNodes), this.restoreBuild(X.build), this.supplementRecords = X.supplementRecords, this.lastSupplementDiagnostics = X.supplementDiagnostics;
      }, R = _(), P = this.attemptTotal, S = () => this.attemptTotal - P, F = (X, U) => {
        const G = U.map(([K]) => K), z = U.map(([, K]) => K);
        return (X[0] === Math.min(...G) || X[0] === Math.max(...G)) && (X[1] === Math.min(...z) || X[1] === Math.max(...z));
      }, $ = (X) => {
        s.forw.splice(0, s.forw.length, ...R.raw[0]), s.bakw.splice(0, s.bakw.length, ...R.raw[1]), m.splice(0, m.length, ...R.gcps), this.edgeNodes.splice(0, this.edgeNodes.length, ...R.edgeNodes), this.supplementRecords = [], this.lastSupplementDiagnostics = void 0;
        const U = T(X);
        return { built: U, strict: U.boundary !== void 0 && this.isStrict() };
      }, L = /* @__PURE__ */ new Set(), j = C.boundary.vertices.map(({ forw: X }) => X), Y = new Set(
        j.filter((X) => !F(X, j)).map((X) => xn(X, w.forw))
      );
      try {
        let X = C;
        for (let U = 0; U < ys && !(S() + x >= Dn * x); U++) {
          const G = X.boundary.vertices.map(({ forw: W }) => W), z = L.size;
          for (const W of Ar(this.tins.forw)) {
            if (F(W, G)) continue;
            const Q = xn(W, w.forw);
            for (let J = -Cn; J <= Cn; J++) L.add((Q + J + 36) % 36);
          }
          if (L.size === z || L.size >= bs) break;
          const K = $({ skipBins: new Set(L) });
          if (!K.built.boundary)
            return N(R), { result: C };
          if (K.strict) {
            let W = { result: K.built, state: _() };
            for (const Q of xs(L)) {
              if (!Q.some((ct) => Y.has(ct))) continue;
              if (S() >= vs * x) break;
              const J = new Set([...L].filter((ct) => !Q.includes(ct))), at = $({ skipBins: J });
              if (at.strict) {
                for (const ct of Q) L.delete(ct);
                W = { result: at.built, state: _() };
              }
            }
            return N(W.state), { result: W.result, kind: "thinned" };
          }
          X = K.built;
        }
        if (S() < Dn * x) {
          const U = $({ cornersOnly: !0 });
          if (U.strict) return { result: U.built, kind: "corners" };
        }
      } catch {
      }
      return N(R), { result: C };
    };
    if (n) {
      this.stateTriangle = void 0;
      const C = this.yaxisMode === nt.YAXIS_FOLLOW, x = C ? 1 : -1, T = (F) => this.buildWithSupplements(t, s, m, ($, L, j) => (Y) => ({ boundary: vn(
        F ? { ...v, ring: F } : v,
        (X) => Er(X, (U) => {
          const [G, z] = ri(n, U);
          return [G, C ? -z : z];
        }),
        s,
        this.points.length,
        {
          orientation: x,
          accept: (X) => X.hasMapBoundary ? (this.buildTin(s, X.vertices, L, X, Y.size > 0, j), (this.strict_status !== nt.STATUS_LOOSE || X.hasBoundary) && be(this.tins.forw, x) === 0 && be(this.tins.bakw, x) === 0) : !1
        },
        Y,
        $
      ) })), _ = this.attemptTotal, N = T(), R = this.attemptTotal - _, { result: { boundary: P }, kind: S } = k(N, R, T);
      if (P) {
        this.compiledOuter = {
          outerTransform: "worldFile",
          worldFile: n,
          vertices_points: P.vertices.map(({ forw: Y, bakw: X }) => [Y, X])
        };
        const { centroid: F, xy: $, wh: L, kinks: j } = this;
        super.setCompiled(this.getCompiled()), Object.assign(this, { centroid: F, xy: $, wh: L, kinks: j }), this.lastBoundaryDiagnostics = {
          ...P.diagnostics,
          ...S ? { ringRescue: S } : {},
          requestedOuterTransform: "worldFile",
          outerTransform: "worldFile"
        };
        return;
      }
      this.compiledOuter = { outerTransform: "extrapolate" }, this.outerTransform = "extrapolate", this.worldFile = void 0;
    }
    const A = this.vertexMode === nt.VERTEX_BIRDEYE ? _r : Mr;
    let O, B, D;
    if (e) {
      const C = (N) => this.buildWithSupplements(t, s, m, (R, P, S) => (F) => {
        const $ = N ? { ...v, ring: N } : v, L = vn(
          $,
          A,
          s,
          this.points.length,
          void 0,
          F,
          R
        );
        return {
          boundary: L,
          verticesList: this.buildTin(
            s,
            L?.vertices ?? A($, !1),
            P,
            L,
            F.size > 0,
            S
          )
        };
      }), x = this.attemptTotal, T = C(), _ = k(T, this.attemptTotal - x, C);
      ({ boundary: O, verticesList: B } = _.result), D = _.kind;
    } else
      B = this.buildTin(
        s,
        A(v, !1),
        t,
        void 0
      );
    this.vertices_params = {
      forw: mn(B.forw, this.centroid.forw),
      bakw: mn(B.bakw, this.centroid.bakw)
    }, this.addIndexedTin(), this.pointsWeightBuffer = {}, this.lastBoundaryDiagnostics = O && D ? { ...O.diagnostics, ringRescue: D } : O?.diagnostics, n && this.lastBoundaryDiagnostics && (this.lastBoundaryDiagnostics = {
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
    const r = (v, E, k) => {
      const A = s(v, E, k);
      return (O) => (o++, this.attemptTotal++, A(O));
    }, a = (v) => this.buildWithHull(v, r(/* @__PURE__ */ new Map(), v, !1));
    if (!this.useSupplementPairs || this.useV2Algorithm || t === nt.MODE_LOOSE) return a(t);
    const c = t, l = a(c), f = o;
    let u = 0;
    if (!l.boundary || this.strict_status !== nt.STATUS_STRICT) return l;
    const h = Ce(this.tins.forw, this.pointsSet.forw.features, l.boundary.forwHull.all);
    if (h.dropped.length === 0) return l;
    const b = this.edgeNodes.length, y = e.forw.length, p = n.length;
    let M = [], I;
    const g = (v, E) => v.length === E.length && v.every((k, A) => k.every((O, B) => O[0] === E[A][B][0] && O[1] === E[A][B][1])), w = (v) => {
      e.forw.length = y, e.bakw.length = y, n.length = p, this.edgeNodes.length = b;
      for (const [E, k] of v) {
        const A = qt(E, k, `e${this.edgeNodes.length}`);
        this.edgeNodes.push([E, k]), e.forw.push(A), e.bakw.push(Vt(A)), n.push({ forw: E, bakw: k });
      }
      M = v;
    }, m = ms({
      edgeBase: b,
      baseCost: f,
      buildCost: () => u,
      snapshot: () => ({ pairs: M, state: this.captureBuild() }),
      restore: ({ pairs: v, state: E }) => {
        w(v), this.restoreBuild(E);
      },
      measure: (v) => {
        w(v);
        const E = this.captureBuild();
        try {
          const k = /* @__PURE__ */ new Map();
          I = { pairs: v, cache: k };
          const { boundary: A } = s(k, nt.MODE_STRICT, !0)(/* @__PURE__ */ new Set());
          return A ? Ce(this.tins.forw, this.pointsSet.forw.features, []) : void 0;
        } finally {
          this.restoreBuild(E);
        }
      },
      build: (v, E) => {
        w(v);
        const k = I && g(I.pairs, v) ? I.cache : /* @__PURE__ */ new Map(), A = o;
        let O;
        try {
          O = this.buildWithHull(c, (B) => {
            if (o - A >= E) throw Pn;
            return r(k, c, !1)(B);
          });
        } catch (B) {
          if (B !== Pn) throw B;
          u += o - A;
          return;
        }
        if (u += o - A, !(!O.boundary || this.strict_status !== nt.STATUS_STRICT))
          return {
            result: O,
            analysis: Ce(this.tins.forw, this.pointsSet.forw.features, O.boundary.forwHull.all)
          };
      }
    }, { result: l, analysis: h });
    return this.supplementRecords = m.records, this.lastSupplementDiagnostics = m.diagnostics, m.result;
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
    const o = (p) => [...p].sort().join(","), r = (p, M = !1) => {
      const I = o(p), g = n.get(I);
      if (g) return g;
      const w = e(p), d = {
        value: w,
        strict: w.boundary !== void 0 && this.strict_status === nt.STATUS_STRICT
      };
      return (d.strict || M) && (d.state = this.captureBuild()), n.set(I, d), s = d, d;
    }, a = (p) => (s !== p && this.restoreBuild(p.state), s = p, p.value), c = r(/* @__PURE__ */ new Set(), !0);
    if (!(t === nt.MODE_STRICT || t === nt.MODE_AUTO) || !c.value.boundary || c.strict) return c.value;
    const f = new Set(c.value.boundary.forwHull.all.map(ve)), u = () => this.pointsSet.forw.features.map(
      (p) => p.properties.target.index
    ), h = /* @__PURE__ */ new Set();
    let b = c, y;
    for (let p = 0; p < ws; p++) {
      const M = as(
        this.tins.forw,
        b.value.boundary.forwHull.applied,
        u()
      ).filter((I) => !h.has(ve(I)));
      if (M.length === 0) break;
      for (const I of M) h.add(ve(I));
      if (b = r(h), !b.value.boundary) break;
      if (b.strict) {
        y = b;
        break;
      }
    }
    if (y) {
      let p = y;
      for (const M of [...h].slice(0, Ss)) {
        const I = new Set(h);
        I.delete(M);
        const g = r(I);
        g.strict && (h.delete(M), p = g);
      }
      return a(p);
    }
    if (h.size < f.size) {
      const p = r(f);
      if (p.strict) return a(p);
    }
    return a(c);
  }
  /** 今の三角網が strict か（組み立ての途中で `strict_status` が変わるので、型の絞り込みを避けて読む）。 */
  isStrict() {
    return this.strict_status === nt.STATUS_STRICT;
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
  buildTin(t, e, n, s, o = !1, r = !1) {
    const a = {
      forw: [],
      bakw: []
    };
    for (let c = 0; c < e.length; c++) {
      const l = e[c].forw, f = e[c].bakw, u = qt(l, f, `b${c}`), h = Vt(u);
      a.forw.push(u), a.bakw.push(h);
    }
    return this.pointsSet = {
      forw: xt([...t.forw, ...a.forw]),
      bakw: xt([...t.bakw, ...a.bakw]),
      edges: t.edges
    }, this.tins = {
      forw: Ve(
        s?.forw ?? pe(this.pointsSet.forw, t.edges, "target")
      )
    }, (n === nt.MODE_STRICT || n === nt.MODE_AUTO) && (r ? this.resolveStrictOverlaps() : this.calculateStrictTin(
      n === nt.MODE_AUTO || o ? 1 : En
    )), (n === nt.MODE_LOOSE || n === nt.MODE_AUTO && this.strict_status === nt.STATUS_ERROR) && (this.tins.bakw = Ve(
      s?.bakw ?? pe(this.pointsSet.bakw, t.edges, "target")
    ), delete this.kinks, this.strict_status = nt.STATUS_LOOSE), a;
  }
  /**
   * 非同期ラッパーを提供します。
   * 互換性のために Promise ベースの API を維持しますが、内部処理は同期的です。
   */
  async updateTinAsync() {
    this.updateTin();
  }
}
function Ms(i, t, e) {
  const n = (s) => Number.isInteger(s) && s >= 0 && s < t;
  if (!Array.isArray(i) || !n(i[0]) || !n(i[1]))
    throw new Error(
      `Invalid edge at edges[${e}]: start/end ${JSON.stringify(i)} must be integer indices of points (0 to ${t - 1})`
    );
}
export {
  nt as Tin,
  pe as constrainedTin,
  Vt as counterPoint,
  qt as createPoint,
  nt as default,
  Es as findIntersections,
  Fn as format_version,
  Gn as insertSearchIndex,
  mn as vertexCalc
};
