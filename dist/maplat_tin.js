import { counterTri as $n, Transform as ti, validateWorldFile as ei, normalizeEdges as ni, transformArr as Me, rotateVerticesTriangle as je, worldFileToCrs as ii } from "@maplat/transform";
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
  if (!Ge(r[0]) || !Ge(r[1]))
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
function ze(r, t, e = {}) {
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
function Ge(r) {
  return !isNaN(r) && r !== null && !Array.isArray(r);
}
function ri(r) {
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
function si(r) {
  return r.type === "Feature" ? r.geometry : r;
}
function Xe(r, t, e) {
  if (r !== null)
    for (var n, s, o, i, a, c, l, f = 0, u = 0, h, y = r.type, w = y === "FeatureCollection", p = y === "Feature", _ = w ? r.features.length : 1, I = 0; I < _; I++) {
      l = w ? (
        // @ts-expect-error: Known type conflict
        r.features[I].geometry
      ) : p ? (
        // @ts-expect-error: Known type conflict
        r.geometry
      ) : r, h = l ? l.type === "GeometryCollection" : !1, a = h ? l.geometries.length : 1;
      for (var g = 0; g < a; g++) {
        var m = 0, d = 0;
        if (i = h ? l.geometries[g] : l, i !== null) {
          c = i.coordinates;
          var v = i.type;
          switch (f = e && (v === "Polygon" || v === "MultiPolygon") ? 1 : 0, v) {
            case null:
              break;
            case "Point":
              if (
                // @ts-expect-error: Known type conflict
                t(
                  c,
                  u,
                  I,
                  m,
                  d
                ) === !1
              )
                return !1;
              u++, m++;
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
                    m,
                    d
                  ) === !1
                )
                  return !1;
                u++, v === "MultiPoint" && m++;
              }
              v === "LineString" && m++;
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
                      m,
                      d
                    ) === !1
                  )
                    return !1;
                  u++;
                }
                v === "MultiLineString" && m++, v === "Polygon" && d++;
              }
              v === "Polygon" && m++;
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
                        m,
                        d
                      ) === !1
                    )
                      return !1;
                    u++;
                  }
                  d++;
                }
                m++;
              }
              break;
            case "GeometryCollection":
              for (n = 0; n < i.geometries.length; n++)
                if (
                  // @ts-expect-error: Known type conflict
                  Xe(i.geometries[n], t, e) === !1
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
const pt = 11102230246251565e-32, j = 134217729, Xn = (3 + 8 * pt) * pt;
function ht(r, t, e, n, s) {
  let o, i, a, c, l = t[0], f = n[0], u = 0, h = 0;
  f > l == f > -l ? (o = l, l = t[++u]) : (o = f, f = n[++h]);
  let y = 0;
  if (u < r && h < e)
    for (f > l == f > -l ? (i = l + o, a = o - (i - l), l = t[++u]) : (i = f + o, a = o - (i - f), f = n[++h]), o = i, a !== 0 && (s[y++] = a); u < r && h < e; )
      f > l == f > -l ? (i = o + l, c = i - o, a = o - (i - c) + (l - c), l = t[++u]) : (i = o + f, c = i - o, a = o - (i - c) + (f - c), f = n[++h]), o = i, a !== 0 && (s[y++] = a);
  for (; u < r; )
    i = o + l, c = i - o, a = o - (i - c) + (l - c), l = t[++u], o = i, a !== 0 && (s[y++] = a);
  for (; h < e; )
    i = o + f, c = i - o, a = o - (i - c) + (f - c), f = n[++h], o = i, a !== 0 && (s[y++] = a);
  return (o !== 0 || y === 0) && (s[y++] = o), y;
}
function Mt(r, t, e, n, s, o, i, a) {
  return ht(ht(r, t, e, n, i), i, s, o, a);
}
function V(r, t, e, n) {
  let s, o, i, a, c, l, f, u, h, y, w;
  f = j * e, y = f - (f - e), w = e - y;
  let p = t[0];
  s = p * e, f = j * p, u = f - (f - p), h = p - u, i = h * w - (s - u * y - h * y - u * w);
  let _ = 0;
  i !== 0 && (n[_++] = i);
  for (let I = 1; I < r; I++)
    p = t[I], a = p * e, f = j * p, u = f - (f - p), h = p - u, c = h * w - (a - u * y - h * y - u * w), o = s + c, l = o - s, i = s - (o - l) + (c - l), i !== 0 && (n[_++] = i), s = a + o, i = o - (s - a), i !== 0 && (n[_++] = i);
  return (s !== 0 || _ === 0) && (n[_++] = s), _;
}
function Ln(r, t) {
  let e = t[0];
  for (let n = 1; n < r; n++) e += t[n];
  return e;
}
function tt(r) {
  return new Float64Array(r);
}
const oi = (3 + 16 * pt) * pt, ai = (2 + 12 * pt) * pt, ci = (9 + 64 * pt) * pt * pt, Ut = tt(4), Ke = tt(8), We = tt(12), He = tt(16), gt = tt(4);
function li(r, t, e, n, s, o, i) {
  let a, c, l, f, u, h, y, w, p, _, I, g, m, d, v, S, A, k;
  const E = r - s, O = e - s, T = t - o, P = n - o;
  d = E * P, h = j * E, y = h - (h - E), w = E - y, h = j * P, p = h - (h - P), _ = P - p, v = w * _ - (d - y * p - w * p - y * _), S = T * O, h = j * T, y = h - (h - T), w = T - y, h = j * O, p = h - (h - O), _ = O - p, A = w * _ - (S - y * p - w * p - y * _), I = v - A, u = v - I, Ut[0] = v - (I + u) + (u - A), g = d + I, u = g - d, m = d - (g - u) + (I - u), I = m - S, u = m - I, Ut[1] = m - (I + u) + (u - S), k = g + I, u = k - g, Ut[2] = g - (k - u) + (I - u), Ut[3] = k;
  let F = Ln(4, Ut), b = ai * i;
  if (F >= b || -F >= b || (u = r - E, a = r - (E + u) + (u - s), u = e - O, l = e - (O + u) + (u - s), u = t - T, c = t - (T + u) + (u - o), u = n - P, f = n - (P + u) + (u - o), a === 0 && c === 0 && l === 0 && f === 0) || (b = ci * i + Xn * Math.abs(F), F += E * f + P * a - (T * l + O * c), F >= b || -F >= b)) return F;
  d = a * P, h = j * a, y = h - (h - a), w = a - y, h = j * P, p = h - (h - P), _ = P - p, v = w * _ - (d - y * p - w * p - y * _), S = c * O, h = j * c, y = h - (h - c), w = c - y, h = j * O, p = h - (h - O), _ = O - p, A = w * _ - (S - y * p - w * p - y * _), I = v - A, u = v - I, gt[0] = v - (I + u) + (u - A), g = d + I, u = g - d, m = d - (g - u) + (I - u), I = m - S, u = m - I, gt[1] = m - (I + u) + (u - S), k = g + I, u = k - g, gt[2] = g - (k - u) + (I - u), gt[3] = k;
  const B = ht(4, Ut, 4, gt, Ke);
  d = E * f, h = j * E, y = h - (h - E), w = E - y, h = j * f, p = h - (h - f), _ = f - p, v = w * _ - (d - y * p - w * p - y * _), S = T * l, h = j * T, y = h - (h - T), w = T - y, h = j * l, p = h - (h - l), _ = l - p, A = w * _ - (S - y * p - w * p - y * _), I = v - A, u = v - I, gt[0] = v - (I + u) + (u - A), g = d + I, u = g - d, m = d - (g - u) + (I - u), I = m - S, u = m - I, gt[1] = m - (I + u) + (u - S), k = g + I, u = k - g, gt[2] = g - (k - u) + (I - u), gt[3] = k;
  const M = ht(B, Ke, 4, gt, We);
  d = a * f, h = j * a, y = h - (h - a), w = a - y, h = j * f, p = h - (h - f), _ = f - p, v = w * _ - (d - y * p - w * p - y * _), S = c * l, h = j * c, y = h - (h - c), w = c - y, h = j * l, p = h - (h - l), _ = l - p, A = w * _ - (S - y * p - w * p - y * _), I = v - A, u = v - I, gt[0] = v - (I + u) + (u - A), g = d + I, u = g - d, m = d - (g - u) + (I - u), I = m - S, u = m - I, gt[1] = m - (I + u) + (u - S), k = g + I, u = k - g, gt[2] = g - (k - u) + (I - u), gt[3] = k;
  const N = ht(M, We, 4, gt, He);
  return He[N - 1];
}
function lt(r, t, e, n, s, o) {
  const i = (t - o) * (e - s), a = (r - s) * (n - o), c = i - a, l = Math.abs(i + a);
  return Math.abs(c) >= oi * l ? c : -li(r, t, e, n, s, o, l);
}
const ui = (10 + 96 * pt) * pt, fi = (4 + 48 * pt) * pt, hi = (44 + 576 * pt) * pt * pt, Ot = tt(4), Nt = tt(4), Rt = tt(4), _t = tt(4), kt = tt(4), Et = tt(4), mt = tt(4), wt = tt(4), _e = tt(8), ke = tt(8), Ee = tt(8), Ae = tt(8), Ie = tt(8), Be = tt(8), oe = tt(8), ae = tt(8), ce = tt(8), Ct = tt(4), $t = tt(4), Xt = tt(4), K = tt(8), Z = tt(16), it = tt(16), rt = tt(16), et = tt(32), Dt = tt(32), ut = tt(48), vt = tt(64);
let Gt = tt(1152), Te = tt(1152);
function ft(r, t, e) {
  r = ht(r, Gt, t, e, Te);
  const n = Gt;
  return Gt = Te, Te = n, r;
}
function di(r, t, e, n, s, o, i, a, c) {
  let l, f, u, h, y, w, p, _, I, g, m, d, v, S, A, k, E, O, T, P, F, b, B, M, N, D, C, x, R, $, L, q, Y, X, U;
  const G = r - i, z = e - i, W = s - i, H = t - a, Q = n - a, J = o - a;
  L = z * J, B = j * z, M = B - (B - z), N = z - M, B = j * J, D = B - (B - J), C = J - D, q = N * C - (L - M * D - N * D - M * C), Y = W * Q, B = j * W, M = B - (B - W), N = W - M, B = j * Q, D = B - (B - Q), C = Q - D, X = N * C - (Y - M * D - N * D - M * C), x = q - X, b = q - x, Ot[0] = q - (x + b) + (b - X), R = L + x, b = R - L, $ = L - (R - b) + (x - b), x = $ - Y, b = $ - x, Ot[1] = $ - (x + b) + (b - Y), U = R + x, b = U - R, Ot[2] = R - (U - b) + (x - b), Ot[3] = U, L = W * H, B = j * W, M = B - (B - W), N = W - M, B = j * H, D = B - (B - H), C = H - D, q = N * C - (L - M * D - N * D - M * C), Y = G * J, B = j * G, M = B - (B - G), N = G - M, B = j * J, D = B - (B - J), C = J - D, X = N * C - (Y - M * D - N * D - M * C), x = q - X, b = q - x, Nt[0] = q - (x + b) + (b - X), R = L + x, b = R - L, $ = L - (R - b) + (x - b), x = $ - Y, b = $ - x, Nt[1] = $ - (x + b) + (b - Y), U = R + x, b = U - R, Nt[2] = R - (U - b) + (x - b), Nt[3] = U, L = G * Q, B = j * G, M = B - (B - G), N = G - M, B = j * Q, D = B - (B - Q), C = Q - D, q = N * C - (L - M * D - N * D - M * C), Y = z * H, B = j * z, M = B - (B - z), N = z - M, B = j * H, D = B - (B - H), C = H - D, X = N * C - (Y - M * D - N * D - M * C), x = q - X, b = q - x, Rt[0] = q - (x + b) + (b - X), R = L + x, b = R - L, $ = L - (R - b) + (x - b), x = $ - Y, b = $ - x, Rt[1] = $ - (x + b) + (b - Y), U = R + x, b = U - R, Rt[2] = R - (U - b) + (x - b), Rt[3] = U, l = ht(
    ht(
      ht(
        V(V(4, Ot, G, K), K, G, Z),
        Z,
        V(V(4, Ot, H, K), K, H, it),
        it,
        et
      ),
      et,
      ht(
        V(V(4, Nt, z, K), K, z, Z),
        Z,
        V(V(4, Nt, Q, K), K, Q, it),
        it,
        Dt
      ),
      Dt,
      vt
    ),
    vt,
    ht(
      V(V(4, Rt, W, K), K, W, Z),
      Z,
      V(V(4, Rt, J, K), K, J, it),
      it,
      et
    ),
    et,
    Gt
  );
  let at = Ln(l, Gt), ct = fi * c;
  if (at >= ct || -at >= ct || (b = r - G, f = r - (G + b) + (b - i), b = t - H, y = t - (H + b) + (b - a), b = e - z, u = e - (z + b) + (b - i), b = n - Q, w = n - (Q + b) + (b - a), b = s - W, h = s - (W + b) + (b - i), b = o - J, p = o - (J + b) + (b - a), f === 0 && u === 0 && h === 0 && y === 0 && w === 0 && p === 0) || (ct = hi * c + Xn * Math.abs(at), at += (G * G + H * H) * (z * p + J * u - (Q * h + W * w)) + 2 * (G * f + H * y) * (z * J - Q * W) + ((z * z + Q * Q) * (W * y + H * h - (J * f + G * p)) + 2 * (z * u + Q * w) * (W * H - J * G)) + ((W * W + J * J) * (G * w + Q * f - (H * u + z * y)) + 2 * (W * h + J * p) * (G * Q - H * z)), at >= ct || -at >= ct))
    return at;
  if ((u !== 0 || w !== 0 || h !== 0 || p !== 0) && (L = G * G, B = j * G, M = B - (B - G), N = G - M, q = N * N - (L - M * M - (M + M) * N), Y = H * H, B = j * H, M = B - (B - H), N = H - M, X = N * N - (Y - M * M - (M + M) * N), x = q + X, b = x - q, _t[0] = q - (x - b) + (X - b), R = L + x, b = R - L, $ = L - (R - b) + (x - b), x = $ + Y, b = x - $, _t[1] = $ - (x - b) + (Y - b), U = R + x, b = U - R, _t[2] = R - (U - b) + (x - b), _t[3] = U), (h !== 0 || p !== 0 || f !== 0 || y !== 0) && (L = z * z, B = j * z, M = B - (B - z), N = z - M, q = N * N - (L - M * M - (M + M) * N), Y = Q * Q, B = j * Q, M = B - (B - Q), N = Q - M, X = N * N - (Y - M * M - (M + M) * N), x = q + X, b = x - q, kt[0] = q - (x - b) + (X - b), R = L + x, b = R - L, $ = L - (R - b) + (x - b), x = $ + Y, b = x - $, kt[1] = $ - (x - b) + (Y - b), U = R + x, b = U - R, kt[2] = R - (U - b) + (x - b), kt[3] = U), (f !== 0 || y !== 0 || u !== 0 || w !== 0) && (L = W * W, B = j * W, M = B - (B - W), N = W - M, q = N * N - (L - M * M - (M + M) * N), Y = J * J, B = j * J, M = B - (B - J), N = J - M, X = N * N - (Y - M * M - (M + M) * N), x = q + X, b = x - q, Et[0] = q - (x - b) + (X - b), R = L + x, b = R - L, $ = L - (R - b) + (x - b), x = $ + Y, b = x - $, Et[1] = $ - (x - b) + (Y - b), U = R + x, b = U - R, Et[2] = R - (U - b) + (x - b), Et[3] = U), f !== 0 && (_ = V(4, Ot, f, _e), l = ft(l, Mt(
    V(_, _e, 2 * G, Z),
    Z,
    V(V(4, Et, f, K), K, Q, it),
    it,
    V(V(4, kt, f, K), K, -J, rt),
    rt,
    et,
    ut
  ), ut)), y !== 0 && (I = V(4, Ot, y, ke), l = ft(l, Mt(
    V(I, ke, 2 * H, Z),
    Z,
    V(V(4, kt, y, K), K, W, it),
    it,
    V(V(4, Et, y, K), K, -z, rt),
    rt,
    et,
    ut
  ), ut)), u !== 0 && (g = V(4, Nt, u, Ee), l = ft(l, Mt(
    V(g, Ee, 2 * z, Z),
    Z,
    V(V(4, _t, u, K), K, J, it),
    it,
    V(V(4, Et, u, K), K, -H, rt),
    rt,
    et,
    ut
  ), ut)), w !== 0 && (m = V(4, Nt, w, Ae), l = ft(l, Mt(
    V(m, Ae, 2 * Q, Z),
    Z,
    V(V(4, Et, w, K), K, G, it),
    it,
    V(V(4, _t, w, K), K, -W, rt),
    rt,
    et,
    ut
  ), ut)), h !== 0 && (d = V(4, Rt, h, Ie), l = ft(l, Mt(
    V(d, Ie, 2 * W, Z),
    Z,
    V(V(4, kt, h, K), K, H, it),
    it,
    V(V(4, _t, h, K), K, -Q, rt),
    rt,
    et,
    ut
  ), ut)), p !== 0 && (v = V(4, Rt, p, Be), l = ft(l, Mt(
    V(v, Be, 2 * J, Z),
    Z,
    V(V(4, _t, p, K), K, z, it),
    it,
    V(V(4, kt, p, K), K, -G, rt),
    rt,
    et,
    ut
  ), ut)), f !== 0 || y !== 0) {
    if (u !== 0 || w !== 0 || h !== 0 || p !== 0 ? (L = u * J, B = j * u, M = B - (B - u), N = u - M, B = j * J, D = B - (B - J), C = J - D, q = N * C - (L - M * D - N * D - M * C), Y = z * p, B = j * z, M = B - (B - z), N = z - M, B = j * p, D = B - (B - p), C = p - D, X = N * C - (Y - M * D - N * D - M * C), x = q + X, b = x - q, mt[0] = q - (x - b) + (X - b), R = L + x, b = R - L, $ = L - (R - b) + (x - b), x = $ + Y, b = x - $, mt[1] = $ - (x - b) + (Y - b), U = R + x, b = U - R, mt[2] = R - (U - b) + (x - b), mt[3] = U, L = h * -Q, B = j * h, M = B - (B - h), N = h - M, B = j * -Q, D = B - (B - -Q), C = -Q - D, q = N * C - (L - M * D - N * D - M * C), Y = W * -w, B = j * W, M = B - (B - W), N = W - M, B = j * -w, D = B - (B - -w), C = -w - D, X = N * C - (Y - M * D - N * D - M * C), x = q + X, b = x - q, wt[0] = q - (x - b) + (X - b), R = L + x, b = R - L, $ = L - (R - b) + (x - b), x = $ + Y, b = x - $, wt[1] = $ - (x - b) + (Y - b), U = R + x, b = U - R, wt[2] = R - (U - b) + (x - b), wt[3] = U, A = ht(4, mt, 4, wt, ae), L = u * p, B = j * u, M = B - (B - u), N = u - M, B = j * p, D = B - (B - p), C = p - D, q = N * C - (L - M * D - N * D - M * C), Y = h * w, B = j * h, M = B - (B - h), N = h - M, B = j * w, D = B - (B - w), C = w - D, X = N * C - (Y - M * D - N * D - M * C), x = q - X, b = q - x, $t[0] = q - (x + b) + (b - X), R = L + x, b = R - L, $ = L - (R - b) + (x - b), x = $ - Y, b = $ - x, $t[1] = $ - (x + b) + (b - Y), U = R + x, b = U - R, $t[2] = R - (U - b) + (x - b), $t[3] = U, O = 4) : (ae[0] = 0, A = 1, $t[0] = 0, O = 1), f !== 0) {
      const st = V(A, ae, f, rt);
      l = ft(l, ht(
        V(_, _e, f, Z),
        Z,
        V(st, rt, 2 * G, et),
        et,
        ut
      ), ut);
      const ot = V(O, $t, f, K);
      l = ft(l, Mt(
        V(ot, K, 2 * G, Z),
        Z,
        V(ot, K, f, it),
        it,
        V(st, rt, f, et),
        et,
        Dt,
        vt
      ), vt), w !== 0 && (l = ft(l, V(V(4, Et, f, K), K, w, Z), Z)), p !== 0 && (l = ft(l, V(V(4, kt, -f, K), K, p, Z), Z));
    }
    if (y !== 0) {
      const st = V(A, ae, y, rt);
      l = ft(l, ht(
        V(I, ke, y, Z),
        Z,
        V(st, rt, 2 * H, et),
        et,
        ut
      ), ut);
      const ot = V(O, $t, y, K);
      l = ft(l, Mt(
        V(ot, K, 2 * H, Z),
        Z,
        V(ot, K, y, it),
        it,
        V(st, rt, y, et),
        et,
        Dt,
        vt
      ), vt);
    }
  }
  if (u !== 0 || w !== 0) {
    if (h !== 0 || p !== 0 || f !== 0 || y !== 0 ? (L = h * H, B = j * h, M = B - (B - h), N = h - M, B = j * H, D = B - (B - H), C = H - D, q = N * C - (L - M * D - N * D - M * C), Y = W * y, B = j * W, M = B - (B - W), N = W - M, B = j * y, D = B - (B - y), C = y - D, X = N * C - (Y - M * D - N * D - M * C), x = q + X, b = x - q, mt[0] = q - (x - b) + (X - b), R = L + x, b = R - L, $ = L - (R - b) + (x - b), x = $ + Y, b = x - $, mt[1] = $ - (x - b) + (Y - b), U = R + x, b = U - R, mt[2] = R - (U - b) + (x - b), mt[3] = U, P = -J, F = -p, L = f * P, B = j * f, M = B - (B - f), N = f - M, B = j * P, D = B - (B - P), C = P - D, q = N * C - (L - M * D - N * D - M * C), Y = G * F, B = j * G, M = B - (B - G), N = G - M, B = j * F, D = B - (B - F), C = F - D, X = N * C - (Y - M * D - N * D - M * C), x = q + X, b = x - q, wt[0] = q - (x - b) + (X - b), R = L + x, b = R - L, $ = L - (R - b) + (x - b), x = $ + Y, b = x - $, wt[1] = $ - (x - b) + (Y - b), U = R + x, b = U - R, wt[2] = R - (U - b) + (x - b), wt[3] = U, k = ht(4, mt, 4, wt, ce), L = h * y, B = j * h, M = B - (B - h), N = h - M, B = j * y, D = B - (B - y), C = y - D, q = N * C - (L - M * D - N * D - M * C), Y = f * p, B = j * f, M = B - (B - f), N = f - M, B = j * p, D = B - (B - p), C = p - D, X = N * C - (Y - M * D - N * D - M * C), x = q - X, b = q - x, Xt[0] = q - (x + b) + (b - X), R = L + x, b = R - L, $ = L - (R - b) + (x - b), x = $ - Y, b = $ - x, Xt[1] = $ - (x + b) + (b - Y), U = R + x, b = U - R, Xt[2] = R - (U - b) + (x - b), Xt[3] = U, T = 4) : (ce[0] = 0, k = 1, Xt[0] = 0, T = 1), u !== 0) {
      const st = V(k, ce, u, rt);
      l = ft(l, ht(
        V(g, Ee, u, Z),
        Z,
        V(st, rt, 2 * z, et),
        et,
        ut
      ), ut);
      const ot = V(T, Xt, u, K);
      l = ft(l, Mt(
        V(ot, K, 2 * z, Z),
        Z,
        V(ot, K, u, it),
        it,
        V(st, rt, u, et),
        et,
        Dt,
        vt
      ), vt), p !== 0 && (l = ft(l, V(V(4, _t, u, K), K, p, Z), Z)), y !== 0 && (l = ft(l, V(V(4, Et, -u, K), K, y, Z), Z));
    }
    if (w !== 0) {
      const st = V(k, ce, w, rt);
      l = ft(l, ht(
        V(m, Ae, w, Z),
        Z,
        V(st, rt, 2 * Q, et),
        et,
        ut
      ), ut);
      const ot = V(T, Xt, w, K);
      l = ft(l, Mt(
        V(ot, K, 2 * Q, Z),
        Z,
        V(ot, K, w, it),
        it,
        V(st, rt, w, et),
        et,
        Dt,
        vt
      ), vt);
    }
  }
  if (h !== 0 || p !== 0) {
    if (f !== 0 || y !== 0 || u !== 0 || w !== 0 ? (L = f * Q, B = j * f, M = B - (B - f), N = f - M, B = j * Q, D = B - (B - Q), C = Q - D, q = N * C - (L - M * D - N * D - M * C), Y = G * w, B = j * G, M = B - (B - G), N = G - M, B = j * w, D = B - (B - w), C = w - D, X = N * C - (Y - M * D - N * D - M * C), x = q + X, b = x - q, mt[0] = q - (x - b) + (X - b), R = L + x, b = R - L, $ = L - (R - b) + (x - b), x = $ + Y, b = x - $, mt[1] = $ - (x - b) + (Y - b), U = R + x, b = U - R, mt[2] = R - (U - b) + (x - b), mt[3] = U, P = -H, F = -y, L = u * P, B = j * u, M = B - (B - u), N = u - M, B = j * P, D = B - (B - P), C = P - D, q = N * C - (L - M * D - N * D - M * C), Y = z * F, B = j * z, M = B - (B - z), N = z - M, B = j * F, D = B - (B - F), C = F - D, X = N * C - (Y - M * D - N * D - M * C), x = q + X, b = x - q, wt[0] = q - (x - b) + (X - b), R = L + x, b = R - L, $ = L - (R - b) + (x - b), x = $ + Y, b = x - $, wt[1] = $ - (x - b) + (Y - b), U = R + x, b = U - R, wt[2] = R - (U - b) + (x - b), wt[3] = U, S = ht(4, mt, 4, wt, oe), L = f * w, B = j * f, M = B - (B - f), N = f - M, B = j * w, D = B - (B - w), C = w - D, q = N * C - (L - M * D - N * D - M * C), Y = u * y, B = j * u, M = B - (B - u), N = u - M, B = j * y, D = B - (B - y), C = y - D, X = N * C - (Y - M * D - N * D - M * C), x = q - X, b = q - x, Ct[0] = q - (x + b) + (b - X), R = L + x, b = R - L, $ = L - (R - b) + (x - b), x = $ - Y, b = $ - x, Ct[1] = $ - (x + b) + (b - Y), U = R + x, b = U - R, Ct[2] = R - (U - b) + (x - b), Ct[3] = U, E = 4) : (oe[0] = 0, S = 1, Ct[0] = 0, E = 1), h !== 0) {
      const st = V(S, oe, h, rt);
      l = ft(l, ht(
        V(d, Ie, h, Z),
        Z,
        V(st, rt, 2 * W, et),
        et,
        ut
      ), ut);
      const ot = V(E, Ct, h, K);
      l = ft(l, Mt(
        V(ot, K, 2 * W, Z),
        Z,
        V(ot, K, h, it),
        it,
        V(st, rt, h, et),
        et,
        Dt,
        vt
      ), vt), y !== 0 && (l = ft(l, V(V(4, kt, h, K), K, y, Z), Z)), w !== 0 && (l = ft(l, V(V(4, _t, -h, K), K, w, Z), Z));
    }
    if (p !== 0) {
      const st = V(S, oe, p, rt);
      l = ft(l, ht(
        V(v, Be, p, Z),
        Z,
        V(st, rt, 2 * J, et),
        et,
        ut
      ), ut);
      const ot = V(E, Ct, p, K);
      l = ft(l, Mt(
        V(ot, K, 2 * J, Z),
        Z,
        V(ot, K, p, it),
        it,
        V(st, rt, p, et),
        et,
        Dt,
        vt
      ), vt);
    }
  }
  return Gt[l - 1];
}
function pi(r, t, e, n, s, o, i, a) {
  const c = r - i, l = e - i, f = s - i, u = t - a, h = n - a, y = o - a, w = l * y, p = f * h, _ = c * c + u * u, I = f * u, g = c * y, m = l * l + h * h, d = c * h, v = l * u, S = f * f + y * y, A = _ * (w - p) + m * (I - g) + S * (d - v), k = (Math.abs(w) + Math.abs(p)) * _ + (Math.abs(I) + Math.abs(g)) * m + (Math.abs(d) + Math.abs(v)) * S, E = ui * k;
  return A > E || -A > E ? A : di(r, t, e, n, s, o, i, a, k);
}
function gi(r, t) {
  var e, n, s = 0, o, i, a, c, l, f, u, h = r[0], y = r[1], w = t.length;
  for (e = 0; e < w; e++) {
    n = 0;
    var p = t[e], _ = p.length - 1;
    if (f = p[0], f[0] !== p[_][0] && f[1] !== p[_][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (i = f[0] - h, a = f[1] - y, n; n < _; n++) {
      if (u = p[n + 1], c = u[0] - h, l = u[1] - y, a === 0 && l === 0) {
        if (c <= 0 && i >= 0 || i <= 0 && c >= 0)
          return 0;
      } else if (l >= 0 && a <= 0 || l <= 0 && a >= 0) {
        if (o = lt(i, c, a, l, 0, 0), o === 0)
          return 0;
        (o > 0 && l > 0 && a <= 0 || o < 0 && l <= 0 && a > 0) && s++;
      }
      f = u, a = l, i = c;
    }
  }
  return s % 2 !== 0;
}
function Je(r, t, e = {}) {
  if (!r)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const n = ri(r), s = si(t), o = s.type, i = t.bbox;
  let a = s.coordinates;
  if (i && mi(n, i) === !1)
    return !1;
  o === "Polygon" && (a = [a]);
  for (var c = 0; c < a.length; ++c) {
    const l = gi(n, a[c]);
    if (l === 0 && !e.ignoreBoundary) return !0;
    if (l) return !0;
  }
  return !1;
}
function mi(r, t) {
  return t[0] <= r[0] && t[1] <= r[1] && t[2] >= r[0] && t[3] >= r[1];
}
class Le {
  constructor(t = [], e = wi) {
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
function wi(r, t) {
  return r < t ? -1 : r > t ? 1 : 0;
}
const yi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Le
}, Symbol.toStringTag, { value: "Module" })), Bt = 11102230246251565e-32, dt = 134217729, vi = (3 + 8 * Bt) * Bt;
function Oe(r, t, e, n, s) {
  let o, i, a, c, l = t[0], f = n[0], u = 0, h = 0;
  f > l == f > -l ? (o = l, l = t[++u]) : (o = f, f = n[++h]);
  let y = 0;
  if (u < r && h < e)
    for (f > l == f > -l ? (i = l + o, a = o - (i - l), l = t[++u]) : (i = f + o, a = o - (i - f), f = n[++h]), o = i, a !== 0 && (s[y++] = a); u < r && h < e; )
      f > l == f > -l ? (i = o + l, c = i - o, a = o - (i - c) + (l - c), l = t[++u]) : (i = o + f, c = i - o, a = o - (i - c) + (f - c), f = n[++h]), o = i, a !== 0 && (s[y++] = a);
  for (; u < r; )
    i = o + l, c = i - o, a = o - (i - c) + (l - c), l = t[++u], o = i, a !== 0 && (s[y++] = a);
  for (; h < e; )
    i = o + f, c = i - o, a = o - (i - c) + (f - c), f = n[++h], o = i, a !== 0 && (s[y++] = a);
  return (o !== 0 || y === 0) && (s[y++] = o), y;
}
function bi(r, t) {
  let e = t[0];
  for (let n = 1; n < r; n++) e += t[n];
  return e;
}
function se(r) {
  return new Float64Array(r);
}
const Si = (3 + 16 * Bt) * Bt, xi = (2 + 12 * Bt) * Bt, Mi = (9 + 64 * Bt) * Bt * Bt, qt = se(4), Qe = se(8), Ze = se(12), tn = se(16), yt = se(4);
function _i(r, t, e, n, s, o, i) {
  let a, c, l, f, u, h, y, w, p, _, I, g, m, d, v, S, A, k;
  const E = r - s, O = e - s, T = t - o, P = n - o;
  d = E * P, h = dt * E, y = h - (h - E), w = E - y, h = dt * P, p = h - (h - P), _ = P - p, v = w * _ - (d - y * p - w * p - y * _), S = T * O, h = dt * T, y = h - (h - T), w = T - y, h = dt * O, p = h - (h - O), _ = O - p, A = w * _ - (S - y * p - w * p - y * _), I = v - A, u = v - I, qt[0] = v - (I + u) + (u - A), g = d + I, u = g - d, m = d - (g - u) + (I - u), I = m - S, u = m - I, qt[1] = m - (I + u) + (u - S), k = g + I, u = k - g, qt[2] = g - (k - u) + (I - u), qt[3] = k;
  let F = bi(4, qt), b = xi * i;
  if (F >= b || -F >= b || (u = r - E, a = r - (E + u) + (u - s), u = e - O, l = e - (O + u) + (u - s), u = t - T, c = t - (T + u) + (u - o), u = n - P, f = n - (P + u) + (u - o), a === 0 && c === 0 && l === 0 && f === 0) || (b = Mi * i + vi * Math.abs(F), F += E * f + P * a - (T * l + O * c), F >= b || -F >= b)) return F;
  d = a * P, h = dt * a, y = h - (h - a), w = a - y, h = dt * P, p = h - (h - P), _ = P - p, v = w * _ - (d - y * p - w * p - y * _), S = c * O, h = dt * c, y = h - (h - c), w = c - y, h = dt * O, p = h - (h - O), _ = O - p, A = w * _ - (S - y * p - w * p - y * _), I = v - A, u = v - I, yt[0] = v - (I + u) + (u - A), g = d + I, u = g - d, m = d - (g - u) + (I - u), I = m - S, u = m - I, yt[1] = m - (I + u) + (u - S), k = g + I, u = k - g, yt[2] = g - (k - u) + (I - u), yt[3] = k;
  const B = Oe(4, qt, 4, yt, Qe);
  d = E * f, h = dt * E, y = h - (h - E), w = E - y, h = dt * f, p = h - (h - f), _ = f - p, v = w * _ - (d - y * p - w * p - y * _), S = T * l, h = dt * T, y = h - (h - T), w = T - y, h = dt * l, p = h - (h - l), _ = l - p, A = w * _ - (S - y * p - w * p - y * _), I = v - A, u = v - I, yt[0] = v - (I + u) + (u - A), g = d + I, u = g - d, m = d - (g - u) + (I - u), I = m - S, u = m - I, yt[1] = m - (I + u) + (u - S), k = g + I, u = k - g, yt[2] = g - (k - u) + (I - u), yt[3] = k;
  const M = Oe(B, Qe, 4, yt, Ze);
  d = a * f, h = dt * a, y = h - (h - a), w = a - y, h = dt * f, p = h - (h - f), _ = f - p, v = w * _ - (d - y * p - w * p - y * _), S = c * l, h = dt * c, y = h - (h - c), w = c - y, h = dt * l, p = h - (h - l), _ = l - p, A = w * _ - (S - y * p - w * p - y * _), I = v - A, u = v - I, yt[0] = v - (I + u) + (u - A), g = d + I, u = g - d, m = d - (g - u) + (I - u), I = m - S, u = m - I, yt[1] = m - (I + u) + (u - S), k = g + I, u = k - g, yt[2] = g - (k - u) + (I - u), yt[3] = k;
  const N = Oe(M, Ze, 4, yt, tn);
  return tn[N - 1];
}
function en(r, t, e, n, s, o) {
  const i = (t - o) * (e - s), a = (r - s) * (n - o), c = i - a;
  if (i === 0 || a === 0 || i > 0 != a > 0) return c;
  const l = Math.abs(i + a);
  return Math.abs(c) >= Si * l ? c : -_i(r, t, e, n, s, o, l);
}
function ki(r, t) {
  const e = new Le([], Yn);
  return Ai(r, e), Ii(e, t);
}
function Yn(r, t) {
  return r.p.x > t.p.x ? 1 : r.p.x < t.p.x || r.p.x === t.p.x && (r.featureId !== t.featureId || r.ringId !== t.ringId) && r.isLeftEndpoint && !t.isLeftEndpoint ? -1 : r.p.y !== t.p.y ? r.p.y > t.p.y ? 1 : -1 : 1;
}
function Ei(r, t) {
  return r.rightSweepEvent.p.x > t.rightSweepEvent.p.x ? 1 : r.rightSweepEvent.p.x < t.rightSweepEvent.p.x ? -1 : r.rightSweepEvent.p.y !== t.rightSweepEvent.p.y ? r.rightSweepEvent.p.y < t.rightSweepEvent.p.y ? 1 : -1 : 1;
}
function Ai(r, t) {
  if (r.type === "FeatureCollection") {
    const e = r.features;
    for (let n = 0; n < e.length; n++)
      nn(e[n], t);
  } else
    nn(r, t);
}
var le = 0, ue = 0, fe = 0;
function nn(r, t) {
  const e = r.type === "Feature" ? r.geometry : r;
  let n = e.coordinates;
  (e.type === "Polygon" || e.type === "MultiLineString") && (n = [n]), e.type === "LineString" && (n = [[n]]);
  for (let s = 0; s < n.length; s++)
    for (let o = 0; o < n[s].length; o++) {
      let i = n[s][o][0], a = null;
      ue = ue + 1;
      for (let c = 0; c < n[s][o].length - 1; c++) {
        a = n[s][o][c + 1];
        const l = new rn(i, le, ue, fe), f = new rn(a, le, ue, fe + 1);
        l.otherEvent = f, f.otherEvent = l, Yn(l, f) > 0 ? (f.isLeftEndpoint = !0, l.isLeftEndpoint = !1) : (l.isLeftEndpoint = !0, f.isLeftEndpoint = !1), t.push(l), t.push(f), i = a, fe = fe + 1;
      }
    }
  le = le + 1;
}
var rn = class {
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
function Ii(r, t = !1) {
  const e = [], n = new Le([], Ei);
  for (; r.length; ) {
    const s = r.pop();
    if (s.isLeftEndpoint) {
      const o = new Bi(s);
      for (let i = 0; i < n.data.length; i++) {
        const a = n.data[i];
        if (t && a.leftSweepEvent.featureId === s.featureId)
          continue;
        const c = Ti(o, a);
        c !== !1 && e.push(c);
      }
      n.push(o);
    } else s.isLeftEndpoint === !1 && n.pop();
  }
  return e;
}
var Bi = class {
  /** @param event must have otherEvent non-null */
  constructor(r) {
    this.leftSweepEvent = r, this.rightSweepEvent = r.otherEvent;
  }
};
function Ti(r, t) {
  if (r === null || t === null) return !1;
  const e = r.leftSweepEvent.p.x, n = r.leftSweepEvent.p.y, s = r.rightSweepEvent.p.x, o = r.rightSweepEvent.p.y, i = t.leftSweepEvent.p.x, a = t.leftSweepEvent.p.y, c = t.rightSweepEvent.p.x, l = t.rightSweepEvent.p.y, f = en(e, n, s, o, i, a), u = en(e, n, s, o, c, l);
  if (f > 0 && u > 0) return !1;
  if (f < 0 && u < 0) return !1;
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
  const h = (l - a) * (s - e) - (c - i) * (o - n), y = (c - i) * (n - a) - (l - a) * (e - i), w = (s - e) * (n - a) - (o - n) * (e - i);
  if (h === 0)
    return !1;
  const p = y / h, _ = w / h;
  if (p >= 0 && p <= 1 && _ >= 0 && _ <= 1) {
    const I = e + p * (s - e), g = n + p * (o - n);
    return [I, g];
  }
  return !1;
}
function Oi(r, t, e = {}) {
  const { removeDuplicates: n = !0, ignoreSelfIntersections: s = !0 } = e;
  let o = [];
  r.type === "FeatureCollection" ? o = o.concat(r.features) : r.type === "Feature" ? o.push(r) : (r.type === "LineString" || r.type === "Polygon" || r.type === "MultiLineString" || r.type === "MultiPolygon") && o.push(ee(r)), t.type === "FeatureCollection" ? o = o.concat(t.features) : t.type === "Feature" ? o.push(t) : (t.type === "LineString" || t.type === "Polygon" || t.type === "MultiLineString" || t.type === "MultiPolygon") && o.push(ee(t));
  const i = ki(
    St(o),
    s
  );
  let a = [];
  if (n) {
    const c = {};
    i.forEach((l) => {
      const f = l.join(",");
      c[f] || (c[f] = !0, a.push(l));
    });
  } else
    a = i;
  return St(a.map((c) => Yt(c)));
}
function Ni(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
function Ri(r) {
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
function Di(r, t = {}) {
  let e = 0, n = 0, s = 0;
  return Xe(
    r,
    function(o) {
      e += o[0], n += o[1], s++;
    },
    !0
  ), Yt([e / s, n / s], t.properties);
}
var he = { exports: {} }, ye = { exports: {} }, Fi = ye.exports, sn;
function Pi() {
  return sn || (sn = 1, (function(r, t) {
    (function(e, n) {
      r.exports = n();
    })(Fi, function() {
      function e(g, m, d, v, S) {
        (function A(k, E, O, T, P) {
          for (; T > O; ) {
            if (T - O > 600) {
              var F = T - O + 1, b = E - O + 1, B = Math.log(F), M = 0.5 * Math.exp(2 * B / 3), N = 0.5 * Math.sqrt(B * M * (F - M) / F) * (b - F / 2 < 0 ? -1 : 1), D = Math.max(O, Math.floor(E - b * M / F + N)), C = Math.min(T, Math.floor(E + (F - b) * M / F + N));
              A(k, E, D, C, P);
            }
            var x = k[E], R = O, $ = T;
            for (n(k, O, E), P(k[T], x) > 0 && n(k, O, T); R < $; ) {
              for (n(k, R, $), R++, $--; P(k[R], x) < 0; ) R++;
              for (; P(k[$], x) > 0; ) $--;
            }
            P(k[O], x) === 0 ? n(k, O, $) : n(k, ++$, T), $ <= E && (O = $ + 1), E <= $ && (T = $ - 1);
          }
        })(g, m, d || 0, v || g.length - 1, S || s);
      }
      function n(g, m, d) {
        var v = g[m];
        g[m] = g[d], g[d] = v;
      }
      function s(g, m) {
        return g < m ? -1 : g > m ? 1 : 0;
      }
      var o = function(g) {
        g === void 0 && (g = 9), this._maxEntries = Math.max(4, g), this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries)), this.clear();
      };
      function i(g, m, d) {
        if (!d) return m.indexOf(g);
        for (var v = 0; v < m.length; v++) if (d(g, m[v])) return v;
        return -1;
      }
      function a(g, m) {
        c(g, 0, g.children.length, m, g);
      }
      function c(g, m, d, v, S) {
        S || (S = _(null)), S.minX = 1 / 0, S.minY = 1 / 0, S.maxX = -1 / 0, S.maxY = -1 / 0;
        for (var A = m; A < d; A++) {
          var k = g.children[A];
          l(S, g.leaf ? v(k) : k);
        }
        return S;
      }
      function l(g, m) {
        return g.minX = Math.min(g.minX, m.minX), g.minY = Math.min(g.minY, m.minY), g.maxX = Math.max(g.maxX, m.maxX), g.maxY = Math.max(g.maxY, m.maxY), g;
      }
      function f(g, m) {
        return g.minX - m.minX;
      }
      function u(g, m) {
        return g.minY - m.minY;
      }
      function h(g) {
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
      function I(g, m, d, v, S) {
        for (var A = [m, d]; A.length; ) if (!((d = A.pop()) - (m = A.pop()) <= v)) {
          var k = m + Math.ceil((d - m) / v / 2) * v;
          e(g, k, m, d, S), A.push(m, k, k, d);
        }
      }
      return o.prototype.all = function() {
        return this._all(this.data, []);
      }, o.prototype.search = function(g) {
        var m = this.data, d = [];
        if (!p(g, m)) return d;
        for (var v = this.toBBox, S = []; m; ) {
          for (var A = 0; A < m.children.length; A++) {
            var k = m.children[A], E = m.leaf ? v(k) : k;
            p(g, E) && (m.leaf ? d.push(k) : w(g, E) ? this._all(k, d) : S.push(k));
          }
          m = S.pop();
        }
        return d;
      }, o.prototype.collides = function(g) {
        var m = this.data;
        if (!p(g, m)) return !1;
        for (var d = []; m; ) {
          for (var v = 0; v < m.children.length; v++) {
            var S = m.children[v], A = m.leaf ? this.toBBox(S) : S;
            if (p(g, A)) {
              if (m.leaf || w(g, A)) return !0;
              d.push(S);
            }
          }
          m = d.pop();
        }
        return !1;
      }, o.prototype.load = function(g) {
        if (!g || !g.length) return this;
        if (g.length < this._minEntries) {
          for (var m = 0; m < g.length; m++) this.insert(g[m]);
          return this;
        }
        var d = this._build(g.slice(), 0, g.length - 1, 0);
        if (this.data.children.length) if (this.data.height === d.height) this._splitRoot(this.data, d);
        else {
          if (this.data.height < d.height) {
            var v = this.data;
            this.data = d, d = v;
          }
          this._insert(d, this.data.height - d.height - 1, !0);
        }
        else this.data = d;
        return this;
      }, o.prototype.insert = function(g) {
        return g && this._insert(g, this.data.height - 1), this;
      }, o.prototype.clear = function() {
        return this.data = _([]), this;
      }, o.prototype.remove = function(g, m) {
        if (!g) return this;
        for (var d, v, S, A = this.data, k = this.toBBox(g), E = [], O = []; A || E.length; ) {
          if (A || (A = E.pop(), v = E[E.length - 1], d = O.pop(), S = !0), A.leaf) {
            var T = i(g, A.children, m);
            if (T !== -1) return A.children.splice(T, 1), E.push(A), this._condense(E), this;
          }
          S || A.leaf || !w(A, k) ? v ? (d++, A = v.children[d], S = !1) : A = null : (E.push(A), O.push(d), d = 0, v = A, A = A.children[0]);
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
        for (var d = []; g; ) g.leaf ? m.push.apply(m, g.children) : d.push.apply(d, g.children), g = d.pop();
        return m;
      }, o.prototype._build = function(g, m, d, v) {
        var S, A = d - m + 1, k = this._maxEntries;
        if (A <= k) return a(S = _(g.slice(m, d + 1)), this.toBBox), S;
        v || (v = Math.ceil(Math.log(A) / Math.log(k)), k = Math.ceil(A / Math.pow(k, v - 1))), (S = _([])).leaf = !1, S.height = v;
        var E = Math.ceil(A / k), O = E * Math.ceil(Math.sqrt(k));
        I(g, m, d, O, this.compareMinX);
        for (var T = m; T <= d; T += O) {
          var P = Math.min(T + O - 1, d);
          I(g, T, P, E, this.compareMinY);
          for (var F = T; F <= P; F += E) {
            var b = Math.min(F + E - 1, P);
            S.children.push(this._build(g, F, b, v - 1));
          }
        }
        return a(S, this.toBBox), S;
      }, o.prototype._chooseSubtree = function(g, m, d, v) {
        for (; v.push(m), !m.leaf && v.length - 1 !== d; ) {
          for (var S = 1 / 0, A = 1 / 0, k = void 0, E = 0; E < m.children.length; E++) {
            var O = m.children[E], T = h(O), P = (F = g, b = O, (Math.max(b.maxX, F.maxX) - Math.min(b.minX, F.minX)) * (Math.max(b.maxY, F.maxY) - Math.min(b.minY, F.minY)) - T);
            P < A ? (A = P, S = T < S ? T : S, k = O) : P === A && T < S && (S = T, k = O);
          }
          m = k || m.children[0];
        }
        var F, b;
        return m;
      }, o.prototype._insert = function(g, m, d) {
        var v = d ? g : this.toBBox(g), S = [], A = this._chooseSubtree(v, this.data, m, S);
        for (A.children.push(g), l(A, v); m >= 0 && S[m].children.length > this._maxEntries; ) this._split(S, m), m--;
        this._adjustParentBBoxes(v, S, m);
      }, o.prototype._split = function(g, m) {
        var d = g[m], v = d.children.length, S = this._minEntries;
        this._chooseSplitAxis(d, S, v);
        var A = this._chooseSplitIndex(d, S, v), k = _(d.children.splice(A, d.children.length - A));
        k.height = d.height, k.leaf = d.leaf, a(d, this.toBBox), a(k, this.toBBox), m ? g[m - 1].children.push(k) : this._splitRoot(d, k);
      }, o.prototype._splitRoot = function(g, m) {
        this.data = _([g, m]), this.data.height = g.height + 1, this.data.leaf = !1, a(this.data, this.toBBox);
      }, o.prototype._chooseSplitIndex = function(g, m, d) {
        for (var v, S, A, k, E, O, T, P = 1 / 0, F = 1 / 0, b = m; b <= d - m; b++) {
          var B = c(g, 0, b, this.toBBox), M = c(g, b, d, this.toBBox), N = (S = B, A = M, k = void 0, E = void 0, O = void 0, T = void 0, k = Math.max(S.minX, A.minX), E = Math.max(S.minY, A.minY), O = Math.min(S.maxX, A.maxX), T = Math.min(S.maxY, A.maxY), Math.max(0, O - k) * Math.max(0, T - E)), D = h(B) + h(M);
          N < P ? (P = N, v = b, F = D < F ? D : F) : N === P && D < F && (F = D, v = b);
        }
        return v || d - m;
      }, o.prototype._chooseSplitAxis = function(g, m, d) {
        var v = g.leaf ? this.compareMinX : f, S = g.leaf ? this.compareMinY : u;
        this._allDistMargin(g, m, d, v) < this._allDistMargin(g, m, d, S) && g.children.sort(v);
      }, o.prototype._allDistMargin = function(g, m, d, v) {
        g.children.sort(v);
        for (var S = this.toBBox, A = c(g, 0, m, S), k = c(g, d - m, d, S), E = y(A) + y(k), O = m; O < d - m; O++) {
          var T = g.children[O];
          l(A, g.leaf ? S(T) : T), E += y(A);
        }
        for (var P = d - m - 1; P >= m; P--) {
          var F = g.children[P];
          l(k, g.leaf ? S(F) : F), E += y(k);
        }
        return E;
      }, o.prototype._adjustParentBBoxes = function(g, m, d) {
        for (var v = d; v >= 0; v--) l(m[v], g);
      }, o.prototype._condense = function(g) {
        for (var m = g.length - 1, d = void 0; m >= 0; m--) g[m].children.length === 0 ? m > 0 ? (d = g[m - 1].children).splice(d.indexOf(g[m]), 1) : this.clear() : a(g[m], this.toBBox);
      }, o;
    });
  })(ye)), ye.exports;
}
const Ci = /* @__PURE__ */ Ri(yi);
var Wt = { exports: {} }, Ne, on;
function $i() {
  return on || (on = 1, Ne = function(t, e, n, s) {
    var o = t[0], i = t[1], a = !1;
    n === void 0 && (n = 0), s === void 0 && (s = e.length);
    for (var c = (s - n) / 2, l = 0, f = c - 1; l < c; f = l++) {
      var u = e[n + l * 2 + 0], h = e[n + l * 2 + 1], y = e[n + f * 2 + 0], w = e[n + f * 2 + 1], p = h > i != w > i && o < (y - u) * (i - h) / (w - h) + u;
      p && (a = !a);
    }
    return a;
  }), Ne;
}
var Re, an;
function Xi() {
  return an || (an = 1, Re = function(t, e, n, s) {
    var o = t[0], i = t[1], a = !1;
    n === void 0 && (n = 0), s === void 0 && (s = e.length);
    for (var c = s - n, l = 0, f = c - 1; l < c; f = l++) {
      var u = e[l + n][0], h = e[l + n][1], y = e[f + n][0], w = e[f + n][1], p = h > i != w > i && o < (y - u) * (i - h) / (w - h) + u;
      p && (a = !a);
    }
    return a;
  }), Re;
}
var cn;
function Li() {
  if (cn) return Wt.exports;
  cn = 1;
  var r = $i(), t = Xi();
  return Wt.exports = function(n, s, o, i) {
    return s.length > 0 && Array.isArray(s[0]) ? t(n, s, o, i) : r(n, s, o, i);
  }, Wt.exports.nested = t, Wt.exports.flat = r, Wt.exports;
}
var Jt = { exports: {} }, Yi = Jt.exports, ln;
function Ui() {
  return ln || (ln = 1, (function(r, t) {
    (function(e, n) {
      n(t);
    })(Yi, function(e) {
      const s = 33306690738754706e-32;
      function o(p, _, I, g, m) {
        let d, v, S, A, k = _[0], E = g[0], O = 0, T = 0;
        E > k == E > -k ? (d = k, k = _[++O]) : (d = E, E = g[++T]);
        let P = 0;
        if (O < p && T < I) for (E > k == E > -k ? (S = d - ((v = k + d) - k), k = _[++O]) : (S = d - ((v = E + d) - E), E = g[++T]), d = v, S !== 0 && (m[P++] = S); O < p && T < I; ) E > k == E > -k ? (S = d - ((v = d + k) - (A = v - d)) + (k - A), k = _[++O]) : (S = d - ((v = d + E) - (A = v - d)) + (E - A), E = g[++T]), d = v, S !== 0 && (m[P++] = S);
        for (; O < p; ) S = d - ((v = d + k) - (A = v - d)) + (k - A), k = _[++O], d = v, S !== 0 && (m[P++] = S);
        for (; T < I; ) S = d - ((v = d + E) - (A = v - d)) + (E - A), E = g[++T], d = v, S !== 0 && (m[P++] = S);
        return d === 0 && P !== 0 || (m[P++] = d), P;
      }
      function i(p) {
        return new Float64Array(p);
      }
      const a = 33306690738754716e-32, c = 22204460492503146e-32, l = 11093356479670487e-47, f = i(4), u = i(8), h = i(12), y = i(16), w = i(4);
      e.orient2d = function(p, _, I, g, m, d) {
        const v = (_ - d) * (I - m), S = (p - m) * (g - d), A = v - S;
        if (v === 0 || S === 0 || v > 0 != S > 0) return A;
        const k = Math.abs(v + S);
        return Math.abs(A) >= a * k ? A : -(function(E, O, T, P, F, b, B) {
          let M, N, D, C, x, R, $, L, q, Y, X, U, G, z, W, H, Q, J;
          const at = E - F, ct = T - F, st = O - b, ot = P - b;
          x = (W = (L = at - ($ = (R = 134217729 * at) - (R - at))) * (Y = ot - (q = (R = 134217729 * ot) - (R - ot))) - ((z = at * ot) - $ * q - L * q - $ * Y)) - (X = W - (Q = (L = st - ($ = (R = 134217729 * st) - (R - st))) * (Y = ct - (q = (R = 134217729 * ct) - (R - ct))) - ((H = st * ct) - $ * q - L * q - $ * Y))), f[0] = W - (X + x) + (x - Q), x = (G = z - ((U = z + X) - (x = U - z)) + (X - x)) - (X = G - H), f[1] = G - (X + x) + (x - H), x = (J = U + X) - U, f[2] = U - (J - x) + (X - x), f[3] = J;
          let Tt = (function(Zn, qe) {
            let Ve = qe[0];
            for (let xe = 1; xe < Zn; xe++) Ve += qe[xe];
            return Ve;
          })(4, f), Kt = c * B;
          if (Tt >= Kt || -Tt >= Kt || (M = E - (at + (x = E - at)) + (x - F), D = T - (ct + (x = T - ct)) + (x - F), N = O - (st + (x = O - st)) + (x - b), C = P - (ot + (x = P - ot)) + (x - b), M === 0 && N === 0 && D === 0 && C === 0) || (Kt = l * B + s * Math.abs(Tt), (Tt += at * C + ot * M - (st * D + ct * N)) >= Kt || -Tt >= Kt)) return Tt;
          x = (W = (L = M - ($ = (R = 134217729 * M) - (R - M))) * (Y = ot - (q = (R = 134217729 * ot) - (R - ot))) - ((z = M * ot) - $ * q - L * q - $ * Y)) - (X = W - (Q = (L = N - ($ = (R = 134217729 * N) - (R - N))) * (Y = ct - (q = (R = 134217729 * ct) - (R - ct))) - ((H = N * ct) - $ * q - L * q - $ * Y))), w[0] = W - (X + x) + (x - Q), x = (G = z - ((U = z + X) - (x = U - z)) + (X - x)) - (X = G - H), w[1] = G - (X + x) + (x - H), x = (J = U + X) - U, w[2] = U - (J - x) + (X - x), w[3] = J;
          const Hn = o(4, f, 4, w, u);
          x = (W = (L = at - ($ = (R = 134217729 * at) - (R - at))) * (Y = C - (q = (R = 134217729 * C) - (R - C))) - ((z = at * C) - $ * q - L * q - $ * Y)) - (X = W - (Q = (L = st - ($ = (R = 134217729 * st) - (R - st))) * (Y = D - (q = (R = 134217729 * D) - (R - D))) - ((H = st * D) - $ * q - L * q - $ * Y))), w[0] = W - (X + x) + (x - Q), x = (G = z - ((U = z + X) - (x = U - z)) + (X - x)) - (X = G - H), w[1] = G - (X + x) + (x - H), x = (J = U + X) - U, w[2] = U - (J - x) + (X - x), w[3] = J;
          const Jn = o(Hn, u, 4, w, h);
          x = (W = (L = M - ($ = (R = 134217729 * M) - (R - M))) * (Y = C - (q = (R = 134217729 * C) - (R - C))) - ((z = M * C) - $ * q - L * q - $ * Y)) - (X = W - (Q = (L = N - ($ = (R = 134217729 * N) - (R - N))) * (Y = D - (q = (R = 134217729 * D) - (R - D))) - ((H = N * D) - $ * q - L * q - $ * Y))), w[0] = W - (X + x) + (x - Q), x = (G = z - ((U = z + X) - (x = U - z)) + (X - x)) - (X = G - H), w[1] = G - (X + x) + (x - H), x = (J = U + X) - U, w[2] = U - (J - x) + (X - x), w[3] = J;
          const Qn = o(Jn, h, 4, w, y);
          return y[Qn - 1];
        })(p, _, I, g, m, d, k);
      }, e.orient2dfast = function(p, _, I, g, m, d) {
        return (_ - d) * (I - m) - (p - m) * (g - d);
      }, Object.defineProperty(e, "__esModule", { value: !0 });
    });
  })(Jt, Jt.exports)), Jt.exports;
}
var un;
function qi() {
  if (un) return he.exports;
  un = 1;
  var r = Pi(), t = Ci, e = Li(), n = Ui().orient2d;
  t.default && (t = t.default), he.exports = s, he.exports.default = s;
  function s(d, v, S) {
    v = Math.max(0, v === void 0 ? 2 : v), S = S || 0;
    var A = y(d), k = new r(16);
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
    for (var E = [], O = 0, T; O < A.length; O++) {
      var P = A[O];
      k.remove(P), T = w(P, T), E.push(T);
    }
    var F = new r(16);
    for (O = 0; O < E.length; O++) F.insert(h(E[O]));
    for (var b = v * v, B = S * S; E.length; ) {
      var M = E.shift(), N = M.p, D = M.next.p, C = p(N, D);
      if (!(C < B)) {
        var x = C / b;
        P = o(k, M.prev.p, N, D, M.next.next.p, x, F), P && Math.min(p(P, N), p(P, D)) <= x && (E.push(M), E.push(w(P, M)), k.remove(P), F.remove(M), F.insert(h(M)), F.insert(h(M.next)));
      }
    }
    M = T;
    var R = [];
    do
      R.push(M.p), M = M.next;
    while (M !== T);
    return R.push(M.p), R;
  }
  function o(d, v, S, A, k, E, O) {
    for (var T = new t([], i), P = d.data; P; ) {
      for (var F = 0; F < P.children.length; F++) {
        var b = P.children[F], B = P.leaf ? _(b, S, A) : a(S, A, b);
        B > E || T.push({
          node: b,
          dist: B
        });
      }
      for (; T.length && !T.peek().node.children; ) {
        var M = T.pop(), N = M.node, D = _(N, v, S), C = _(N, A, k);
        if (M.dist < D && M.dist < C && l(S, N, O) && l(A, N, O)) return N;
      }
      P = T.pop(), P && (P = P.node);
    }
    return null;
  }
  function i(d, v) {
    return d.dist - v.dist;
  }
  function a(d, v, S) {
    if (c(d, S) || c(v, S)) return 0;
    var A = I(d[0], d[1], v[0], v[1], S.minX, S.minY, S.maxX, S.minY);
    if (A === 0) return 0;
    var k = I(d[0], d[1], v[0], v[1], S.minX, S.minY, S.minX, S.maxY);
    if (k === 0) return 0;
    var E = I(d[0], d[1], v[0], v[1], S.maxX, S.minY, S.maxX, S.maxY);
    if (E === 0) return 0;
    var O = I(d[0], d[1], v[0], v[1], S.minX, S.maxY, S.maxX, S.maxY);
    return O === 0 ? 0 : Math.min(A, k, E, O);
  }
  function c(d, v) {
    return d[0] >= v.minX && d[0] <= v.maxX && d[1] >= v.minY && d[1] <= v.maxY;
  }
  function l(d, v, S) {
    for (var A = Math.min(d[0], v[0]), k = Math.min(d[1], v[1]), E = Math.max(d[0], v[0]), O = Math.max(d[1], v[1]), T = S.search({ minX: A, minY: k, maxX: E, maxY: O }), P = 0; P < T.length; P++)
      if (u(T[P].p, T[P].next.p, d, v)) return !1;
    return !0;
  }
  function f(d, v, S) {
    return n(d[0], d[1], v[0], v[1], S[0], S[1]);
  }
  function u(d, v, S, A) {
    return d !== A && v !== S && f(d, v, S) > 0 != f(d, v, A) > 0 && f(S, A, d) > 0 != f(S, A, v) > 0;
  }
  function h(d) {
    var v = d.p, S = d.next.p;
    return d.minX = Math.min(v[0], S[0]), d.minY = Math.min(v[1], S[1]), d.maxX = Math.max(v[0], S[0]), d.maxY = Math.max(v[1], S[1]), d;
  }
  function y(d) {
    for (var v = d[0], S = d[0], A = d[0], k = d[0], E = 0; E < d.length; E++) {
      var O = d[E];
      O[0] < v[0] && (v = O), O[0] > A[0] && (A = O), O[1] < S[1] && (S = O), O[1] > k[1] && (k = O);
    }
    var T = [v, S, A, k], P = T.slice();
    for (E = 0; E < d.length; E++)
      e(d[E], T) || P.push(d[E]);
    return m(P);
  }
  function w(d, v) {
    var S = {
      p: d,
      prev: null,
      next: null,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };
    return v ? (S.next = v.next, S.prev = v, v.next.prev = S, v.next = S) : (S.prev = S, S.next = S), S;
  }
  function p(d, v) {
    var S = d[0] - v[0], A = d[1] - v[1];
    return S * S + A * A;
  }
  function _(d, v, S) {
    var A = v[0], k = v[1], E = S[0] - A, O = S[1] - k;
    if (E !== 0 || O !== 0) {
      var T = ((d[0] - A) * E + (d[1] - k) * O) / (E * E + O * O);
      T > 1 ? (A = S[0], k = S[1]) : T > 0 && (A += E * T, k += O * T);
    }
    return E = d[0] - A, O = d[1] - k, E * E + O * O;
  }
  function I(d, v, S, A, k, E, O, T) {
    var P = S - d, F = A - v, b = O - k, B = T - E, M = d - k, N = v - E, D = P * P + F * F, C = P * b + F * B, x = b * b + B * B, R = P * M + F * N, $ = b * M + B * N, L = D * x - C * C, q, Y, X, U, G = L, z = L;
    L === 0 ? (Y = 0, G = 1, U = $, z = x) : (Y = C * $ - x * R, U = D * $ - C * R, Y < 0 ? (Y = 0, U = $, z = x) : Y > G && (Y = G, U = $ + C, z = x)), U < 0 ? (U = 0, -R < 0 ? Y = 0 : -R > D ? Y = G : (Y = -R, G = D)) : U > z && (U = z, -R + C < 0 ? Y = 0 : -R + C > D ? Y = G : (Y = -R + C, G = D)), q = Y === 0 ? 0 : Y / G, X = U === 0 ? 0 : U / z;
    var W = (1 - q) * d + q * S, H = (1 - q) * v + q * A, Q = (1 - X) * k + X * O, J = (1 - X) * E + X * T, at = Q - W, ct = J - H;
    return at * at + ct * ct;
  }
  function g(d, v) {
    return d[0] === v[0] ? d[1] - v[1] : d[0] - v[0];
  }
  function m(d) {
    d.sort(g);
    for (var v = [], S = 0; S < d.length; S++) {
      for (; v.length >= 2 && f(v[v.length - 2], v[v.length - 1], d[S]) <= 0; )
        v.pop();
      v.push(d[S]);
    }
    for (var A = [], k = d.length - 1; k >= 0; k--) {
      for (; A.length >= 2 && f(A[A.length - 2], A[A.length - 1], d[k]) <= 0; )
        A.pop();
      A.push(d[k]);
    }
    return A.pop(), v.pop(), v.concat(A);
  }
  return he.exports;
}
var Vi = qi();
const ji = /* @__PURE__ */ Ni(Vi);
function fn(r, t = {}) {
  t.concavity = t.concavity || 1 / 0;
  const e = [];
  if (Xe(r, (s) => {
    e.push([s[0], s[1]]);
  }), !e.length)
    return null;
  const n = ji(e, t.concavity);
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
  static from(t, e = Hi, n = Ji) {
    const s = t.length, o = new Float64Array(s * 2);
    for (let i = 0; i < s; i++) {
      const a = t[i];
      o[2 * i] = e(a), o[2 * i + 1] = n(a);
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
    const { coords: t, _hullPrev: e, _hullNext: n, _hullTri: s, _hullHash: o } = this, i = t.length >> 1;
    let a = 1 / 0, c = 1 / 0, l = -1 / 0, f = -1 / 0;
    for (let E = 0; E < i; E++) {
      const O = t[2 * E], T = t[2 * E + 1];
      O < a && (a = O), T < c && (c = T), O > l && (l = O), T > f && (f = T), this._ids[E] = E;
    }
    const u = (a + l) / 2, h = (c + f) / 2;
    let y = 0, w = 0, p = 0;
    for (let E = 0, O = 1 / 0; E < i; E++) {
      const T = De(u, h, t[2 * E], t[2 * E + 1]);
      T < O && (y = E, O = T);
    }
    const _ = t[2 * y], I = t[2 * y + 1];
    for (let E = 0, O = 1 / 0; E < i; E++) {
      if (E === y) continue;
      const T = De(_, I, t[2 * E], t[2 * E + 1]);
      T < O && T > 0 && (w = E, O = T);
    }
    let g = t[2 * w], m = t[2 * w + 1], d = 1 / 0;
    for (let E = 0; E < i; E++) {
      if (E === y || E === w) continue;
      const O = Ki(_, I, g, m, t[2 * E], t[2 * E + 1]);
      O < d && (p = E, d = O);
    }
    let v = t[2 * p], S = t[2 * p + 1];
    if (d === 1 / 0) {
      for (let T = 0; T < i; T++)
        this._dists[T] = t[2 * T] - t[0] || t[2 * T + 1] - t[1];
      zt(this._ids, this._dists, 0, i - 1);
      const E = new Uint32Array(i);
      let O = 0;
      for (let T = 0, P = -1 / 0; T < i; T++) {
        const F = this._ids[T], b = this._dists[F];
        b > P && (E[O++] = F, P = b);
      }
      this.hull = E.subarray(0, O), this.triangles = new Uint32Array(0), this.halfedges = new Int32Array(0);
      return;
    }
    if (lt(_, I, g, m, v, S) < 0) {
      const E = w, O = g, T = m;
      w = p, g = v, m = S, p = E, v = O, S = T;
    }
    const A = Wi(_, I, g, m, v, S);
    this._cx = A.x, this._cy = A.y;
    for (let E = 0; E < i; E++)
      this._dists[E] = De(t[2 * E], t[2 * E + 1], A.x, A.y);
    zt(this._ids, this._dists, 0, i - 1), this._hullStart = y;
    let k = 3;
    n[y] = e[p] = w, n[w] = e[y] = p, n[p] = e[w] = y, s[y] = 0, s[w] = 1, s[p] = 2, o.fill(-1), o[this._hashKey(_, I)] = y, o[this._hashKey(g, m)] = w, o[this._hashKey(v, S)] = p, this.trianglesLen = 0, this._addTriangle(y, w, p, -1, -1, -1);
    for (let E = 0, O = 0, T = 0; E < this._ids.length; E++) {
      const P = this._ids[E], F = t[2 * P], b = t[2 * P + 1];
      if (E > 0 && Math.abs(F - O) <= hn && Math.abs(b - T) <= hn || (O = F, T = b, P === y || P === w || P === p)) continue;
      let B = 0;
      for (let x = 0, R = this._hashKey(F, b); x < this._hashSize && (B = o[(R + x) % this._hashSize], !(B !== -1 && B !== n[B])); x++)
        ;
      B = e[B];
      let M = B, N;
      for (; N = n[M], lt(F, b, t[2 * M], t[2 * M + 1], t[2 * N], t[2 * N + 1]) >= 0; )
        if (M = N, M === B) {
          M = -1;
          break;
        }
      if (M === -1) continue;
      let D = this._addTriangle(M, P, n[M], -1, -1, s[M]);
      s[P] = this._legalize(D + 2), s[M] = D, k++;
      let C = n[M];
      for (; N = n[C], lt(F, b, t[2 * C], t[2 * C + 1], t[2 * N], t[2 * N + 1]) < 0; )
        D = this._addTriangle(C, P, N, s[P], -1, s[C]), s[P] = this._legalize(D + 2), n[C] = C, k--, C = N;
      if (M === B)
        for (; N = e[M], lt(F, b, t[2 * N], t[2 * N + 1], t[2 * M], t[2 * M + 1]) < 0; )
          D = this._addTriangle(N, P, M, -1, s[M], s[N]), this._legalize(D + 2), s[N] = D, n[M] = M, k--, M = N;
      this._hullStart = e[P] = M, n[M] = e[C] = P, n[P] = C, o[this._hashKey(F, b)] = P, o[this._hashKey(t[2 * M], t[2 * M + 1])] = M;
    }
    this.hull = new Uint32Array(k);
    for (let E = 0, O = this._hullStart; E < k; E++)
      this.hull[E] = O, O = n[O];
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
    return Math.floor(zi(t - this._cx, e - this._cy) * this._hashSize) % this._hashSize;
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
      const l = a - a % 3, f = c + (t + 1) % 3, u = l + (a + 2) % 3, h = e[i], y = e[t], w = e[f], p = e[u];
      if (Gi(
        s[2 * h],
        s[2 * h + 1],
        s[2 * y],
        s[2 * y + 1],
        s[2 * w],
        s[2 * w + 1],
        s[2 * p],
        s[2 * p + 1]
      )) {
        e[t] = p, e[a] = h;
        const I = n[u];
        if (I === -1) {
          let m = this._hullStart;
          do {
            if (this._hullTri[m] === u) {
              this._hullTri[m] = t;
              break;
            }
            m = this._hullPrev[m];
          } while (m !== this._hullStart);
        }
        this._link(t, I), this._link(a, n[i]), this._link(i, u);
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
function zi(r, t) {
  const e = r / (Math.abs(r) + Math.abs(t));
  return (t > 0 ? 3 - e : 1 + e) / 4;
}
function De(r, t, e, n) {
  const s = r - e, o = t - n;
  return s * s + o * o;
}
function Gi(r, t, e, n, s, o, i, a) {
  const c = r - i, l = t - a, f = e - i, u = n - a, h = s - i, y = o - a, w = c * c + l * l, p = f * f + u * u, _ = h * h + y * y;
  return c * (u * _ - p * y) - l * (f * _ - p * h) + w * (f * y - u * h) < 0;
}
function Ki(r, t, e, n, s, o) {
  const i = e - r, a = n - t, c = s - r, l = o - t, f = i * i + a * a, u = c * c + l * l, h = 0.5 / (i * l - a * c), y = (l * f - a * u) * h, w = (i * u - c * f) * h;
  return y * y + w * w;
}
function Wi(r, t, e, n, s, o) {
  const i = e - r, a = n - t, c = s - r, l = o - t, f = i * i + a * a, u = c * c + l * l, h = 0.5 / (i * l - a * c), y = r + (l * f - a * u) * h, w = t + (i * u - c * f) * h;
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
    Ht(r, s, o), t[r[e]] > t[r[n]] && Ht(r, e, n), t[r[o]] > t[r[n]] && Ht(r, o, n), t[r[e]] > t[r[o]] && Ht(r, e, o);
    const a = r[o], c = t[a];
    for (; ; ) {
      do
        o++;
      while (t[r[o]] < c);
      do
        i--;
      while (t[r[i]] > c);
      if (i < o) break;
      Ht(r, o, i);
    }
    r[e + 1] = r[i], r[i] = a, n - o + 1 >= i - e ? (zt(r, t, o, n), zt(r, t, e, i - 1)) : (zt(r, t, e, i - 1), zt(r, t, o, n));
  }
}
function Ht(r, t, e) {
  const n = r[t];
  r[t] = r[e], r[e] = n;
}
function Hi(r) {
  return r[0];
}
function Ji(r) {
  return r[1];
}
class Qi {
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
class dn extends Qi {
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
function pn(r, t, e, n, s, o, i, a) {
  const c = lt(r, t, s, o, i, a), l = lt(e, n, s, o, i, a);
  if (c > 0 && l > 0 || c < 0 && l < 0)
    return !1;
  const f = lt(s, o, r, t, e, n), u = lt(i, a, r, t, e, n);
  return f > 0 && u > 0 || f < 0 && u < 0 ? !1 : c === 0 && l === 0 && f === 0 && u === 0 ? !(Math.max(s, i) < Math.min(r, e) || Math.max(r, e) < Math.min(s, i) || Math.max(o, a) < Math.min(t, n) || Math.max(t, n) < Math.min(o, a)) : !0;
}
class Zi {
  /**
   * The triangulation object from Delaunator.
   */
  del;
  constructor(t) {
    this.del = t;
  }
}
class te extends Zi {
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
      const u = n[c], h = At(c);
      if (u === e)
        return this.protect(c);
      const y = xt(c), w = n[y];
      if (w === e)
        return this.protect(h), h;
      if (this.intersectSegments(t, e, w, u)) {
        c = y;
        break;
      }
      c = s[h];
    } while (c !== -1 && c !== o);
    let l = c, f = -1;
    for (; c !== -1; ) {
      if (++a > i)
        throw new Error(
          `Constraining edge [${t}, ${e}] exceeded the iteration limit`
        );
      const u = s[c], h = xt(c), y = xt(u), w = At(u);
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
        n[y]
      )) {
        if (f === -1 && (f = c), n[y] === e) {
          if (c === f)
            throw new Error("Infinite loop: non-convex quadrilateral");
          c = f, f = -1;
          continue;
        }
        if (this.intersectSegments(
          t,
          e,
          n[y],
          n[u]
        ))
          c = y;
        else if (this.intersectSegments(
          t,
          e,
          n[w],
          n[y]
        ))
          c = w;
        else if (f === c)
          throw new Error("Infinite loop: no further intersect after non-convex");
        continue;
      }
      if (this.flipDiagonal(c), this.intersectSegments(
        t,
        e,
        n[h],
        n[y]
      ) && (f === -1 && (f = h), f === h))
        throw new Error("Infinite loop: flipped diagonal still intersects");
      n[y] === e ? (l = y, c = f, f = -1) : this.intersectSegments(
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
    }, a = (w) => i(n[w * 3], n[w * 3 + 1], n[w * 3 + 2]), c = (w, p, _, I) => Math.sign(lt(w[p * 2], w[p * 2 + 1], w[_ * 2], w[_ * 2 + 1], w[I * 2], w[I * 2 + 1])), l = e.map((w) => {
      let p = 0;
      for (let _ = 0; _ < o; _++) p += c(w, n[_ * 3], n[_ * 3 + 1], n[_ * 3 + 2]);
      return p < 0 ? -1 : 1;
    }), f = (w) => {
      if (this.consd.has(w)) return !1;
      const p = s[w];
      if (p === -1) return !1;
      const _ = n[w], I = n[At(w)], g = n[xt(w)], m = n[xt(p)];
      return e.every((d, v) => c(d, g, _, m) === l[v] && c(d, m, I, g) === l[v]);
    };
    let u = 0, h = !0;
    for (; h; ) {
      h = !1;
      for (let w = 0; w < o; w++)
        if (a(w))
          for (let p = 0; p < 3; p++) {
            const _ = w * 3 + p;
            if (!f(_)) continue;
            const I = s[_], g = n[_], m = n[At(_)], d = n[xt(_)], v = n[xt(I)];
            if (!(i(d, g, v) && i(v, m, d))) {
              this.protect(this.flipDiagonal(_)), u++, h = !0;
              break;
            }
          }
    }
    let y = 0;
    for (let w = 0; w < o; w++) a(w) && y++;
    return { flips: u, remaining: y };
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
    const { triangles: e, halfedges: n } = this.del, s = this.flips, o = this.consd, i = n[t], a = xt(t), c = At(t), l = xt(i), f = At(i), u = n[a], h = n[l];
    if (o.has(t))
      throw new Error("Trying to flip a constrained edge");
    return e[t] = e[l], n[t] = h, s.set(t, s.has(l)) || o.set(t, o.has(l)), h !== -1 && (n[h] = t), n[a] = l, e[i] = e[a], n[i] = u, s.set(i, s.has(a)) || o.set(i, o.has(a)), u !== -1 && (n[u] = i), n[l] = a, this.markFlip(t), this.markFlip(c), this.markFlip(i), this.markFlip(f), s.add(a), o.delete(a), s.add(l), o.delete(l), this.updateVert(t), this.updateVert(c), this.updateVert(i), this.updateVert(f), a;
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
    return pi(
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
function pe(r, t, e) {
  return Pe(r, t, e).tin;
}
function Pe(r, t, e, n, s) {
  if (t || (t = []), typeof r != "object" || r.type !== "FeatureCollection")
    throw "Argument points must be FeatureCollection";
  if (!Array.isArray(t)) throw "Argument points must be Array of Array";
  const o = r.features.map(
    (p) => p.geometry.coordinates
  );
  let i = s?.snapshot ? te.restore(s.snapshot) : void 0;
  const a = i ? void 0 : Ye.from(o);
  let c = i ? i.del : a, l = 0, f;
  const u = [];
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
        i.constrainOne(I[0], I[1]), u.push(I);
      } catch {
        i = _(u);
      }
    n?.boundary && (f = tr(i, n.boundary), f || (i = _(u))), n && ({ remaining: l } = i.forbidGroupTriangles(
      n.groupsOf,
      n.planes
    ), l -= f?.size ?? 0), c = i.del;
  }
  const h = [];
  for (let p = 0; p < c.triangles.length; p += 3)
    f?.has(p / 3) || h.push([c.triangles[p], c.triangles[p + 1], c.triangles[p + 2]]);
  const y = ["a", "b", "c"];
  return { tin: St(
    h.map((p) => {
      const _ = {}, I = p.map((g, m) => {
        const d = r.features[g], v = d.geometry.coordinates, S = [v[0], v[1]];
        return v.length === 3 ? S[2] = v[2] : _[y[m]] = d.properties[e], S;
      });
      return I[3] = I[0], re([I], _);
    })
  ), remaining: l, hasBoundary: f !== void 0, hull: u };
}
function tr(r, t) {
  try {
    r.constrainAll(t);
  } catch {
    return;
  }
  const e = new Map(t), { triangles: n, halfedges: s } = r.del, o = (l) => {
    const f = n[l], u = n[At(l)];
    return e.get(f) === u || e.get(u) === f;
  }, i = /* @__PURE__ */ new Set(), a = [], c = (l) => {
    const f = Math.floor(l / 3);
    i.has(f) || (i.add(f), a.push(f));
  };
  for (let l = 0; l < s.length; l++)
    s[l] === -1 && !o(l) && c(l);
  for (let l = 0; l < a.length; l++)
    for (let f = a[l] * 3; f < a[l] * 3 + 3; f++) {
      if (!e.has(n[f])) return;
      s[f] !== -1 && !o(f) && c(s[f]);
    }
  return i;
}
function gn(r) {
  const t = /* @__PURE__ */ new Set(), e = [];
  if (r.forEach(([c, l], f) => {
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
  }, i = [...o(s), ...o([...s].reverse())];
  if (i.length < 3) return [];
  const a = [];
  for (let c = 0; c < i.length; c++) {
    const l = i[c], f = i[(c + 1) % i.length], u = f.x - l.x, h = f.y - l.y, y = u * u + h * h, w = e.filter((_) => _ !== l && _ !== f && n(l, f, _) === 0).map((_) => ({ r: _, t: ((_.x - l.x) * u + (_.y - l.y) * h) / y })).filter(({ t: _ }) => _ > 0 && _ < 1).sort((_, I) => _.t - I.t).map(({ r: _ }) => _), p = [l, ...w, f];
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
function mn(r, t) {
  const e = r.length, n = t.geometry.coordinates;
  return Array.from({ length: e }, (s, o) => o).map((s) => {
    const o = (s + 1) % e, i = r[s], a = r[o], c = i.geometry.coordinates, l = Math.atan2(
      c[0] - n[0],
      c[1] - n[1]
    ), f = [t, i, a, t].map(
      (y) => y.geometry.coordinates
    ), u = {
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
    }, h = St([
      re([f], u)
    ]);
    return [l, h];
  }).reduce(
    (s, o) => (s[0].push(o[0]), s[1].push(o[1]), s),
    [[], []]
  );
}
const er = [0.1, 0.15, 0.225, 0.34, 0.5];
function nr(r, t) {
  return t ? r.hasBoundary !== t.hasBoundary ? r.hasBoundary : r.diagnostics.boundaryTriangleFlips < t.diagnostics.boundaryTriangleFlips : !0;
}
function wn(r, t, e) {
  return Math.sign(lt(r[0], r[1], t[0], t[1], e[0], e[1]));
}
function be(r, t = -1) {
  let e = 0;
  for (const n of r.features) {
    const { a: s, b: o, c: i } = n.properties;
    if (![s, o, i].some(
      ({ index: u }) => typeof u == "string" && u.startsWith("b")
    ))
      continue;
    const [a, c, l] = n.geometry.coordinates[0];
    wn(a, c, l) * wn(s.geom, o.geom, i.geom) * t <= 0 && e++;
  }
  return e;
}
function yn(r, t, e) {
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
function ir(r, t) {
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
function vn(r, t, e, n, s, o = /* @__PURE__ */ new Set(), i) {
  const { minx: a, maxx: c, miny: l, maxy: f, centroid: u } = r, h = c - a, y = f - l, w = e.forw.length, p = Array.from({ length: w }, () => []);
  let _ = 1;
  for (const [A, k] of e.edges)
    A < n && p[A].push(_), p[k].push(_), k < n && _++;
  const I = (A) => A.slice(0, w).map(({ geometry: k }) => k.coordinates), g = gn(I(e.forw)), m = {
    forw: g.filter((A) => !o.has(ve(A))),
    bakw: gn(I(e.bakw))
  }, d = [0], v = (A) => A >= w ? d : p[A];
  let S;
  for (const A of er) {
    const k = i?.get(A) ?? { forwReuse: {} };
    i?.set(A, k);
    const E = k.vertices ?? (k.vertices = ir(
      t(
        {
          ...r,
          minx: a - A * h,
          maxx: c + A * h,
          miny: l - A * y,
          maxy: f + A * y
        },
        !0
      ),
      e
    ));
    if (s && (E.length < 4 || !E.every(({ bakw: Y }) => Y.every(Number.isFinite)))) continue;
    const O = E.map(
      ({ forw: Y, bakw: X }, U) => Vt(Y, X, `b${U}`)
    ), T = St([...e.forw, ...O]), P = St([
      ...e.bakw,
      ...O.map(jt)
    ]), F = [T, P].map(
      ({ features: Y }) => Float64Array.from(
        Y.flatMap(
          ({
            geometry: {
              coordinates: [X, U]
            }
          }) => [X, U]
        )
      )
    ), B = s !== void 0 || yn(
      E.map((Y) => Y.forw),
      u.forw,
      -1
    ) && yn(
      E.map((Y) => Y.bakw),
      u.bakw,
      1
    ) ? E.map((Y, X) => [
      w + X,
      w + (X + 1) % E.length
    ]) : void 0, M = { groupsOf: v, planes: F, boundary: B, allowUnusableBoundary: s !== void 0 }, N = s?.orientation ?? -1, D = Pe(
      T,
      e.edges,
      "target",
      { ...M, hull: m.forw },
      k.forwReuse
    ), C = k.geographic ?? (k.geographic = (() => {
      const Y = Pe(P, e.edges, "target", {
        ...M,
        hull: m.bakw
      });
      return { built: Y, flips: be(Y.tin, N) };
    })()), x = C.built, R = D.tin, $ = {
      ...x.tin,
      features: [...x.tin.features]
    }, L = be(R, N) + C.flips, q = {
      vertices: E,
      forw: R,
      bakw: $,
      diagnostics: {
        margin: A,
        boundaryTriangleFlips: L,
        remainingForbiddenTriangles: D.remaining + x.remaining
      },
      hasMapBoundary: D.hasBoundary,
      hasBoundary: D.hasBoundary && x.hasBoundary,
      forwHull: { all: g, applied: D.hull }
    };
    if (s) {
      if (s.accept(q)) return q;
      continue;
    }
    if (L === 0 && q.hasBoundary)
      return q;
    nr(q, S) && (S = q);
  }
  return S;
}
const rr = 256 * Number.EPSILON;
function sr(r, t) {
  const e = [r, t].map((s) => {
    const o = s.map((a, c, l) => {
      if (c === 0) return 0;
      const f = l[c - 1];
      return Math.sqrt(
        Math.pow(a[0] - f[0], 2) + Math.pow(a[1] - f[1], 2)
      );
    }), i = o.reduce((a, c, l) => l === 0 ? [0] : (a.push(a[l - 1] + c), a), []);
    return i.map((a, c, l) => {
      const f = a / l[l.length - 1];
      return [s[c], o[c], i[c], f];
    });
  }), n = [];
  return e.forEach((s, o) => {
    const i = e[o ? 0 : 1];
    s.forEach((a, c) => {
      if (c === 0 || c === s.length - 1 || a[4] === "handled")
        return;
      const l = a[0], f = a[3];
      let u, h = 1 / 0;
      for (let y = 1; y < i.length - 1; y++) {
        const w = i[y];
        if (w[4] === "handled") continue;
        const p = Math.abs(w[3] - f);
        p <= rr && p < h && (u = w, h = p);
      }
      if (u) {
        u[4] = "handled", a[4] = "handled", n.push(
          o === 0 ? [l, u[0], f] : [u[0], l, f]
        );
        return;
      }
      for (let y = 0; y < i.length - 1; y++) {
        const w = i[y], p = i[y + 1], _ = w[3], I = p[3];
        if (_ < f && I > f) {
          const g = (f - _) / (I - _), m = [
            (p[0][0] - w[0][0]) * g + w[0][0],
            (p[0][1] - w[0][1]) * g + w[0][1]
          ];
          n.push(
            o === 0 ? [l, m, f] : [m, l, f]
          );
          return;
        }
      }
    });
  }), n.sort((s, o) => s[2] - o[2]);
}
const bn = 1e-9;
function or(r, t) {
  const e = [[], [], [], []], n = [];
  return Object.keys(r).forEach((s) => {
    const o = r[s], i = o.forw, a = o.bakw, c = [
      i[0] - t.forw[0],
      i[1] - t.forw[1]
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
function Un(r) {
  let t = 1 / 0, e = 0, n = 0;
  return r.forEach((s) => {
    const { forw: o, bakw: i } = s, a = Math.hypot(o[0], o[1]), c = Math.hypot(i[0], i[1]);
    if (c === 0) return;
    const l = a / c, f = Math.atan2(o[0], o[1]) - Math.atan2(i[0], i[1]);
    t = Math.min(t, l), e += Math.cos(f), n += Math.sin(f);
  }), isFinite(t) ? [t, Math.atan2(n, e)] : [1, 0];
}
const ar = 0.6, cr = 3, lr = 0.5;
function ur(r) {
  let t = 0, e = 0, n = 0, s = 0;
  if (r.forEach(({ forw: i, bakw: a }) => {
    t += i[1] * a[1] + i[0] * a[0], e += i[0] * a[1] - i[1] * a[0], n += a[0] * a[0] + a[1] * a[1], s += i[0] * i[0] + i[1] * i[1];
  }), !(!(n > 0 && s > 0) || !(Math.hypot(t, e) / Math.sqrt(s * n) >= lr)))
    return [Math.hypot(t, e) / n, Math.atan2(e, t)];
}
function fr(r) {
  const t = (s) => Math.hypot(s.forw[0], s.forw[1]), e = Math.max(...r.map(t)), n = r.filter((s) => t(s) >= ar * e);
  return ur(n.length >= cr ? n : r) ?? Un(r);
}
function hr(r, t, e, n) {
  const { perQuad: s, aggregate: o } = or(r, t), i = s.every((f) => f.length > 0), a = e === "birdeye" ? i ? s : [o] : [o], c = n === "farLsq" ? fr : Un, l = a.map((f) => c(f));
  return l.length === 1 ? [l[0], l[0], l[0], l[0]] : l;
}
function dr(r, t) {
  let e = 0;
  return r[0] > t[0] && (e += 1), r[1] > t[1] && (e += 2), e;
}
function pr(r, t, e) {
  const n = [
    r[0] - t.forw[0],
    r[1] - t.forw[1]
  ], o = Math.sqrt(n[0] ** 2 + n[1] ** 2) / e[0], i = Math.atan2(n[0], n[1]) - e[1];
  return [
    t.bakw[0] + o * Math.sin(i),
    t.bakw[1] - o * Math.cos(i)
  ];
}
function gr(r, t, e, n) {
  const s = t[0] - r[0], o = t[1] - r[1];
  if (Math.abs(s) < 1e-12 && Math.abs(o) < 1e-12) return null;
  const i = n[0] - e[0], a = n[1] - e[1], c = e[0] - r[0], l = e[1] - r[1], f = s * a - o * i;
  if (Math.abs(f) < 1e-12) return null;
  const u = (c * a - l * i) / f, h = (c * o - l * s) / f;
  return u <= 1e-10 || h < -1e-10 || h > 1 + 1e-10 ? null : { t: u, point: [r[0] + u * s, r[1] + u * o] };
}
function mr(r, t, e) {
  const n = e.length;
  let s = -1 / 0, o = null;
  for (let i = 0; i < n; i++) {
    const a = (i + 1) % n, c = gr(
      r,
      t,
      e[i].bakw,
      e[a].bakw
    );
    c && c.t > s && (s = c.t, o = c.point);
  }
  return o;
}
function Sn(r, t) {
  return Math.floor(Ce(r, t) / 10) % 36;
}
function Ce(r, t) {
  const n = Math.atan2(r[0] - t[0], r[1] - t[1]) * (180 / Math.PI);
  return n < 0 ? n + 360 : n;
}
function xn(r, t, e, n, s, o) {
  const i = t[0] - r[0], a = t[1] - r[1];
  if (i === 0 && a === 0) return null;
  const c = [];
  if (i !== 0)
    for (const f of [e, n]) {
      const u = (f - r[0]) / i;
      if (u > 0) {
        const h = r[1] + u * a;
        h >= s && h <= o && c.push({ t: u, x: f, y: h });
      }
    }
  if (a !== 0)
    for (const f of [s, o]) {
      const u = (f - r[1]) / a;
      if (u > 0) {
        const h = r[0] + u * i;
        h >= e && h <= n && c.push({ t: u, x: h, y: f });
      }
    }
  if (c.length === 0) return null;
  c.sort((f, u) => f.t - u.t);
  const l = c[0];
  return [l.x, l.y];
}
function Mn(r, t, e) {
  const n = r.length, s = new Array(n).fill(1);
  for (const o of t)
    for (let i = 0; i < n; i++) {
      const a = (i + 1) % n, c = ze([r[i].bakw, r[a].bakw]), l = ze([e.bakw, o.bakw]), f = Oi(c, l);
      if (f.features.length > 0 && f.features[0].geometry) {
        const u = f.features[0], h = Math.sqrt(
          Math.pow(o.bakw[0] - e.bakw[0], 2) + Math.pow(o.bakw[1] - e.bakw[1], 2)
        ), y = Math.sqrt(
          Math.pow(u.geometry.coordinates[0] - e.bakw[0], 2) + Math.pow(u.geometry.coordinates[1] - e.bakw[1], 2)
        ), w = h / y;
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
function Ue(r, t, e, n, s) {
  const { convexBuf: o, centroid: i, allGcps: a, minx: c, maxx: l, miny: f, maxy: u } = r, h = s ? void 0 : hr(o, i, t, n), w = [
    [c, f],
    [l, f],
    [l, u],
    [c, u]
  ].map((k) => ({
    forw: k,
    bakw: s ? s(k) : pr(
      k,
      i,
      h[dr(k, i.forw)]
    )
  }));
  if (w.sort(
    (k, E) => Math.atan2(k.forw[0] - i.forw[0], k.forw[1] - i.forw[1]) - Math.atan2(E.forw[0] - i.forw[0], E.forw[1] - i.forw[1])
  ), s || Mn(w, a, i), !e || r.ring?.cornersOnly) return w;
  const p = 4, _ = w.map(
    (k) => Math.atan2(k.forw[0] - i.forw[0], k.forw[1] - i.forw[1])
  ), I = w.map(
    (k) => Math.atan2(
      k.bakw[0] - i.bakw[0],
      -(k.bakw[1] - i.bakw[1])
    )
  );
  function g(k) {
    for (let E = 0; E < p; E++) {
      const O = (E + 1) % p, T = _[E], P = E < p - 1 ? _[O] : _[O] + 2 * Math.PI;
      let F = k;
      for (; F < T; ) F += 2 * Math.PI;
      for (; F >= T + 2 * Math.PI; ) F -= 2 * Math.PI;
      if (F >= T && F < P)
        return { i: E, j: O, frac: (F - T) / (P - T) };
    }
    return { i: 0, j: 1, frac: 0 };
  }
  function m(k) {
    const { i: E, j: O, frac: T } = g(k), P = I[E];
    let b = I[O] - P;
    for (; b > Math.PI; ) b -= 2 * Math.PI;
    for (; b < -Math.PI; ) b += 2 * Math.PI;
    return P + T * b;
  }
  const d = new Set(
    w.map(
      (k) => Math.floor(Ce(k.forw, i.forw) / 10) % 36
    )
  ), v = a.map((k) => ({
    forw: k.forw,
    bakw: k.bakw,
    angleDeg: Ce(k.forw, i.forw),
    forwDist: Math.hypot(k.forw[0] - i.forw[0], k.forw[1] - i.forw[1])
  })), S = [];
  for (let k = 0; k < 36; k++) {
    if (d.has(k) || r.ring?.skipBins?.has(k)) continue;
    const E = k * 10, O = v.filter((x) => {
      if (x.forwDist === 0) return !1;
      const R = ((x.angleDeg - E) % 360 + 360) % 360;
      return R < 10 + bn || R > 360 - bn;
    });
    let T = null;
    if (O.length > 0) {
      const x = O.reduce((R, $) => $.forwDist > R.forwDist ? $ : R);
      T = xn(i.forw, x.forw, c, l, f, u);
    }
    if (!T) {
      const x = (E + 5) % 360 * (Math.PI / 180), R = [
        i.forw[0] + Math.sin(x),
        i.forw[1] + Math.cos(x)
      ];
      T = xn(i.forw, R, c, l, f, u);
    }
    if (!T) continue;
    const [P, F] = T, b = 1e-9 * Math.max(l - c, u - f);
    if ([...w, ...S].some(
      (x) => Math.abs(x.forw[0] - P) <= b && Math.abs(x.forw[1] - F) <= b
    )) continue;
    if (s) {
      S.push({ forw: T, bakw: s(T) });
      continue;
    }
    const B = [T[0] - i.forw[0], T[1] - i.forw[1]], M = Math.atan2(B[0], B[1]), N = m(M), D = [
      i.bakw[0] + Math.sin(N),
      i.bakw[1] - Math.cos(N)
    ], C = mr(i.bakw, D, w);
    C && S.push({ forw: T, bakw: C });
  }
  const A = [...w, ...S];
  return A.sort(
    (k, E) => Math.atan2(k.forw[0] - i.forw[0], k.forw[1] - i.forw[1]) - Math.atan2(E.forw[0] - i.forw[0], E.forw[1] - i.forw[1])
  ), s || Mn(A, a, i), A;
}
function wr(r, t = !1) {
  return Ue(r, "plain", t, t ? "farLsq" : "min");
}
function yr(r, t = !1) {
  return Ue(r, "birdeye", t, "min");
}
function vr(r, t) {
  const e = /* @__PURE__ */ new Set();
  return Ue(r, "plain", !0, "min", t).filter(({ forw: [n, s] }) => {
    const o = `${n}:${s}`;
    return e.has(o) ? !1 : (e.add(o), !0);
  });
}
const _n = (r) => typeof r == "string" && r.startsWith("b");
function br(r, t) {
  const e = (n, s) => {
    for (let o = 0; o < 3; o++) {
      const i = n.g[o], a = n.g[(o + 1) % 3];
      if (s.g.every((c) => n.sign * lt(i[0], i[1], a[0], a[1], c[0], c[1]) <= 0)) return !0;
    }
    return !1;
  };
  return !e(r, t) && !e(t, r);
}
function Sr(r) {
  const t = r.features.map((a) => {
    const { a: c, b: l, c: f } = a.properties, u = [c.geom, l.geom, f.geom], h = a.geometry.coordinates[0].slice(0, 3), y = u.map(([I]) => I), w = u.map(([, I]) => I), p = Math.sign(lt(h[0][0], h[0][1], h[1][0], h[1][1], h[2][0], h[2][1])), _ = Math.sign(lt(u[0][0], u[0][1], u[1][0], u[1][1], u[2][0], u[2][1]));
    return {
      ids: [c.index, l.index, f.index],
      f: h,
      g: u,
      sign: _,
      ratio: p * _,
      aux: [c.index, l.index, f.index].some(_n),
      minx: Math.min(...y),
      maxx: Math.max(...y),
      miny: Math.min(...w),
      maxy: Math.max(...w)
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
        f.sign === 0 || f.miny >= c.maxy || c.miny >= f.maxy || !c.aux && !f.aux || br(c, f) && (s.add(o[a]), s.add(o[l]));
      }
  }
  const i = /* @__PURE__ */ new Map();
  for (const a of s)
    t[a].ids.forEach((c, l) => {
      _n(c) && i.set(String(c), t[a].f[l]);
    });
  return [...i.values()];
}
function vs(r) {
  return qn(r, 1 / 0);
}
const kn = 1e5, xr = 16;
function qn(r, t) {
  return Mr(r), new _r(r).findSegmentIntersections(t).map(
    (s) => Yt([s.x, s.y])
  );
}
function Mr(r) {
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
    (o != this._xx.length || this._xx.length != this._yy.length) && Lt("ArcCollection#initXYData() Counting error"), this.initBounds(), this._arcIter = new Vr(this._xx, this._yy);
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
    let a = 0, c, l, f;
    for (let u = 0; u < s; u++)
      c = n[u], c > 0 && (l = u * 4, f = jr(t, e, a, c), o[l++] = f[0], o[l++] = f[1], o[l++] = f[2], o[l] = f[3], a += c, i.mergeBounds(f));
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
    let c = n ? this._ii[s] : this._ii[s] + i - 1, l = c, f = 0;
    for (let u = 1; u < i; u++)
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
      (m, d, v, S) => {
        let A = a(S[m]);
        const k = a(S[d]);
        let E = 0;
        for (; i[A] = i[A] + 2, A != k; )
          E++, E > c && Lt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${o}`,
            `s1=${A}`,
            `s2=${k}`
          ), A += k > A ? 1 : -1;
      }
    );
    const f = this.getUint32Array(Ar(i));
    let u = 0;
    const h = [];
    Ir(i, (m) => {
      const d = u;
      u += m, h.push(f.subarray(d, u));
    }), Br(i, 0), this.forEachSegment(
      (m, d, v, S) => {
        let A = a(S[m]);
        const k = a(S[d]);
        let E, O, T = 0;
        for (; E = i[A], i[A] = E + 2, O = h[A], O[E] = m, O[E + 1] = d, A != k; )
          T++, T > c && Lt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${o}`,
            `s1=${A}`,
            `s2=${k}`
          ), A += k > A ? 1 : -1;
      }
    );
    const y = this.getVertexData(), w = t * xr;
    let p = 0;
    const _ = /* @__PURE__ */ new Set(), I = /* @__PURE__ */ new Map(), g = (m) => {
      p++;
      const d = qr(m);
      return _.has(d) || (_.add(d), I.set(`${m.x}:${m.y}`, m)), I.size >= t || p >= w;
    };
    if (y.xx && y.yy)
      for (l = 0; l < o && !Tr(h[l], y.xx, y.yy, g); l++)
        ;
    return Array.from(I.values());
  }
}
function Lt(...r) {
  const t = r.join(" ");
  throw new Error(t);
}
function ne(r) {
  return r ? Er(r) ? !0 : kr(r) ? !1 : r.length === 0 ? !0 : r.length > 0 : !1;
}
function kr(r) {
  return r != null && r.toString === String.prototype.toString;
}
function Er(r) {
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
  let o, i, a, c, l, f, u, h, y, w, p, _, I, g, m, d, v;
  for (Lr(t, r), d = 0; d < s; ) {
    for (o = r[d], i = r[d + 1], l = t[o], f = t[i], y = e[o], w = e[i], v = d; v < s && (v += 2, a = r[v], u = t[a], !(f < u)); ) {
      if (p = e[a], c = r[v + 1], h = t[c], _ = e[c], y >= p) {
        if (y > _ && w > p && w > _) continue;
      } else if (y < _ && w < p && w < _) continue;
      if (!(o == a || o == c || i == a || i == c) && (I = Or(
        l,
        y,
        f,
        w,
        u,
        p,
        h,
        _
      ), I && (g = [o, i], m = [a, c], n(An(I, g, m, t, e)) || I.length == 4 && n(An(I.slice(2), g, m, t, e)))))
        return !0;
    }
    d += 2;
  }
  return !1;
}
function Or(r, t, e, n, s, o, i, a) {
  const c = Nr(r, t, e, n, s, o, i, a);
  let l = null;
  return c && (l = Rr(r, t, e, n, s, o, i, a), l ? Xr(r, t, e, n, s, o, i, a) && (l = null) : l = $r(r, t, e, n, s, o, i, a)), l;
}
function Nr(r, t, e, n, s, o, i, a) {
  return Qt(r, t, e, n, s, o) * Qt(r, t, e, n, i, a) <= 0 && Qt(s, o, i, a, r, t) * Qt(s, o, i, a, e, n) <= 0;
}
function Qt(r, t, e, n, s, o) {
  return Vn(r - s, t - o, e - s, n - o);
}
function Vn(r, t, e, n) {
  return r * n - t * e;
}
function Rr(r, t, e, n, s, o, i, a) {
  let c = ge(r, t, e, n, s, o, i, a), l;
  return c && (l = Fr(c[0], c[1], r, t, e, n, s, o, i, a), l == 1 ? c = ge(e, n, r, t, s, o, i, a) : l == 2 ? c = ge(s, o, i, a, r, t, e, n) : l == 3 && (c = ge(i, a, s, o, r, t, e, n))), c && Cr(c, r, t, e, n, s, o, i, a), c;
}
function ge(r, t, e, n, s, o, i, a) {
  const c = Vn(e - r, n - t, i - s, a - o), l = 1e-18;
  let f;
  if (c === 0) return null;
  const u = Qt(s, o, i, a, r, t) / c;
  return c <= l && c >= -l ? f = Dr(r, t, e, n, s, o, i, a) : f = [r + u * (e - r), t + u * (n - t)], f;
}
function Dr(r, t, e, n, s, o, i, a) {
  let c = null;
  return !It(r, s, i) && !It(t, o, a) ? c = [r, t] : !It(e, s, i) && !It(n, o, a) ? c = [e, n] : !It(s, r, e) && !It(o, t, n) ? c = [s, o] : !It(i, r, e) && !It(a, t, n) && (c = [i, a]), c;
}
function It(r, t, e) {
  let n;
  return t < e ? n = r < t || r > e : t > e ? n = r > t || r < e : n = r != t, n;
}
function Fr(r, t, ...e) {
  let n = -1, s = 1 / 0, o;
  for (let i = 0, a = 0, c = e.length; a < c; i++, a += 2)
    o = Pr(r, t, e[a], e[a + 1]), o < s && (s = o, n = i);
  return n;
}
function Pr(r, t, e, n) {
  const s = r - e, o = t - n;
  return s * s + o * o;
}
function Cr(r, t, e, n, s, o, i, a, c) {
  let l = r[0], f = r[1];
  l = me(l, t, n), l = me(l, o, a), f = me(f, e, s), f = me(f, i, c), r[0] = l, r[1] = f;
}
function me(r, t, e) {
  let n;
  return It(r, t, e) && (n = Math.abs(r - t) < Math.abs(r - e) ? t : e, r = n), r;
}
function $r(r, t, e, n, s, o, i, a) {
  const c = Math.min(r, e, s, i), l = Math.max(r, e, s, i), f = Math.min(t, n, o, a), u = Math.max(t, n, o, a), h = u - f > l - c;
  let y = [];
  return (h ? Ft(t, f, u) : Ft(r, c, l)) && y.push(r, t), (h ? Ft(n, f, u) : Ft(e, c, l)) && y.push(e, n), (h ? Ft(o, f, u) : Ft(s, c, l)) && y.push(s, o), (h ? Ft(a, f, u) : Ft(i, c, l)) && y.push(i, a), (y.length != 2 && y.length != 4 || y.length == 4 && y[0] == y[2] && y[1] == y[3]) && (y = null), y;
}
function Xr(r, t, e, n, s, o, i, a) {
  return r == s && t == o || r == i && t == a || e == s && n == o || e == i && n == a;
}
function Ft(r, t, e) {
  return r > t && r < e;
}
function Lr(r, t) {
  Yr(r, t), jn(r, t, 0, t.length - 2);
}
function Yr(r, t) {
  for (let e = 0, n = t.length; e < n; e += 2)
    r[t[e]] > r[t[e + 1]] && Ur(t, e, e + 1);
}
function Ur(r, t, e) {
  const n = r[t];
  r[t] = r[e], r[e] = n;
}
function jn(r, t, e, n) {
  let s = e, o = n, i, a;
  for (; s < n; ) {
    for (i = r[t[e + n >> 2 << 1]]; s <= o; ) {
      for (; r[t[s]] < i; ) s += 2;
      for (; r[t[o]] > i; ) o -= 2;
      s <= o && (a = t[s], t[s] = t[o], t[o] = a, a = t[s + 1], t[s + 1] = t[o + 1], t[o + 1] = a, s += 2, o -= 2);
    }
    if (o - e < 40 ? En(r, t, e, o) : jn(r, t, e, o), n - s < 40) {
      En(r, t, s, n);
      return;
    }
    e = s, o = n;
  }
}
function En(r, t, e, n) {
  let s, o;
  for (let i = e + 2; i <= n; i += 2) {
    s = t[i], o = t[i + 1];
    let a;
    for (a = i - 2; a >= e && r[s] < r[t[a]]; a -= 2)
      t[a + 2] = t[a], t[a + 3] = t[a + 1];
    t[a + 2] = s, t[a + 3] = o;
  }
}
function An(r, t, e, n, s) {
  const o = r[0], i = r[1];
  t = In(o, i, t[0], t[1], n, s), e = In(o, i, e[0], e[1], n, s);
  const a = t[0] < e[0] ? t : e, c = a == t ? e : t;
  return { x: o, y: i, a, b: c };
}
function In(r, t, e, n, s, o) {
  let i = e < n ? e : n, a = i === e ? n : e;
  return s[i] == r && o[i] == t ? a = i : s[a] == r && o[a] == t && (i = a), [i, a];
}
function qr(r) {
  return `${r.a.join(",")};${r.b.join(",")}`;
}
class Vr {
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
function jr(r, t, e, n) {
  let s = e | 0;
  const o = isNaN(n) ? r.length - s : n + s;
  let i, a, c, l, f, u;
  if (o > 0)
    c = f = r[s], l = u = t[s];
  else return [void 0, void 0, void 0, void 0];
  for (s++; s < o; s++)
    i = r[s], a = t[s], i < c && (c = i), i > f && (f = i), a < l && (l = a), a > u && (u = a);
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
function zn(r, t, e) {
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
function Bn(r, t, e) {
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
const Gr = 10;
function Kr(r, t, e, n, s, o) {
  if (!r && !t) return !1;
  const i = r ? 0 : 1, a = 1 - i, c = e[i], l = e[a];
  if (!c || !l) return !1;
  const f = bt(l.geom);
  let u = !1, h = !1;
  for (let y = 0; y <= 1; y++) {
    const w = n[y];
    if (!w) continue;
    const p = [String(w.prop.index), String(c.prop.index)].sort().join("-"), _ = s[p];
    if (!_ || _.length < 2) continue;
    const I = _.find(
      (T) => T.bakw !== o[i].bakw
    );
    if (!I) continue;
    const m = Zt(I.bakw).find(
      (T) => String(T.prop.index) !== String(w.prop.index) && String(T.prop.index) !== String(c.prop.index)
    );
    if (!m) continue;
    u = !0;
    const d = bt(m.geom), v = bt(w.geom), S = bt(c.geom), A = S[0] - v[0], k = S[1] - v[1], E = A * (f[1] - v[1]) - k * (f[0] - v[0]), O = A * (d[1] - v[1]) - k * (d[0] - v[0]);
    if (E * O > 0) {
      h = !0;
      break;
    }
  }
  return u && !h;
}
function Wr(r, t, e, n) {
  if (!r && !t) return !1;
  if (e[0] && e[1] && n[0] && n[1]) {
    const s = n.map((f) => bt(f.geom)), o = e.map((f) => bt(f.geom)), i = s[1][0] - s[0][0], a = s[1][1] - s[0][1], c = i * (o[0][1] - s[0][1]) - a * (o[0][0] - s[0][0]), l = i * (o[1][1] - s[0][1]) - a * (o[1][0] - s[0][0]);
    return c * l < 0;
  }
  return !1;
}
function Hr(r, t, e, n) {
  const s = zr(e, n), o = /* @__PURE__ */ new Set();
  let i = !1;
  for (let a = 0; a < Gr; a++) {
    let c = !1;
    for (const l of Object.keys(t)) {
      if (o.has(l)) continue;
      o.add(l);
      const f = t[l];
      if (!f || f.length < 2) continue;
      const u = l.split("-");
      if (u.length !== 2 || s.has(l)) continue;
      const h = Zt(f[0].bakw), y = Zt(f[1].bakw), w = Zt(f[0].forw), p = Zt(f[1].forw), _ = u.map(
        (x) => h.find((R) => `${R.prop.index}` === x) || y.find((R) => `${R.prop.index}` === x)
      ), I = u.map(
        (x) => w.find((R) => `${R.prop.index}` === x) || p.find((R) => `${R.prop.index}` === x)
      );
      if (_.some((x) => !x) || I.some((x) => !x))
        continue;
      const g = [h, y].map(
        (x) => x.find((R) => !u.includes(`${R.prop.index}`))
      ), m = [w, p].map(
        (x) => x.find((R) => !u.includes(`${R.prop.index}`))
      );
      if (g.some((x) => !x) || m.some((x) => !x))
        continue;
      const d = f[0].bakw.geometry.coordinates[0].slice(0, 3).map((x) => bt(x)), v = f[1].bakw.geometry.coordinates[0].slice(0, 3).map((x) => bt(x)), S = f[0].forw.geometry.coordinates[0].slice(0, 3).map((x) => bt(x)), A = f[1].forw.geometry.coordinates[0].slice(0, 3).map((x) => bt(x)), k = we(d), E = we(v), O = we(S), T = we(A), P = Kr(
        k,
        E,
        g,
        _,
        t,
        f
      ), F = Wr(
        O,
        T,
        g,
        _
      );
      if (!(P || F || Tn(
        bt(g[0].geom),
        v
      ) || Tn(
        bt(g[1].geom),
        d
      )))
        continue;
      const B = I.map(
        (x) => bt(x.geom)
      ), M = m.map(
        (x) => bt(x.geom)
      ), N = Jr([
        ...B,
        ...M
      ]), D = Qr(N), C = On(
        B[0],
        B[1],
        M[0]
      ) + On(
        B[0],
        B[1],
        M[1]
      );
      $e(D, C) && (Bn(t, f[0], r), Bn(t, f[1], r), _.forEach((x) => {
        if (!x) return;
        const R = [
          x.geom,
          g[0].geom,
          g[1].geom,
          x.geom
        ], $ = {
          a: x.prop,
          b: g[0].prop,
          c: g[1].prop
        }, L = re([R], $), q = $n(L);
        zn(t, {
          forw: q,
          bakw: L
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
function Tn(r, t) {
  const [e, n] = t[0], [s, o] = t[1], [i, a] = t[2], c = i - e, l = a - n, f = s - e, u = o - n, h = r[0] - e, y = r[1] - n, w = c * c + l * l, p = c * f + l * u, _ = c * h + l * y, I = f * f + u * u, g = f * h + u * y, m = w * I - p * p;
  if (m === 0) return !1;
  const d = 1 / m, v = (I * _ - p * g) * d, S = (w * g - p * _) * d, A = 1e-9;
  return v >= -A && S >= -A && v + S <= 1 + A;
}
function Jr(r) {
  const t = r.map((i) => i.slice()).filter(
    (i, a, c) => c.findIndex(
      (l) => $e(l[0], i[0]) && $e(l[1], i[1])
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
function On(r, t, e) {
  return Math.abs(
    (r[0] * (t[1] - e[1]) + t[0] * (e[1] - r[1]) + e[0] * (r[1] - t[1])) / 2
  );
}
function $e(r, t, e = 1e-9) {
  return Math.abs(r - t) <= e;
}
const Zr = (r) => typeof r == "string" && r.startsWith("b");
function ts(r, t) {
  const e = (n, s) => {
    for (let o = 0; o < 3; o++) {
      const i = n.g[o], a = n.g[(o + 1) % 3];
      if (s.g.every((c) => n.sign * lt(i[0], i[1], a[0], a[1], c[0], c[1]) <= 0)) return !0;
    }
    return !1;
  };
  return !e(r, t) && !e(t, r);
}
function es(r, t, e) {
  if (t.length === 0) return [];
  const n = r.features.map((p) => {
    const { a: _, b: I, c: g } = p.properties, m = [_.geom, I.geom, g.geom], [d, v, S] = p.geometry.coordinates[0], A = m.map(([T]) => T), k = m.map(([, T]) => T), E = Math.sign(lt(d[0], d[1], v[0], v[1], S[0], S[1])), O = Math.sign(lt(m[0][0], m[0][1], m[1][0], m[1][1], m[2][0], m[2][1]));
    return {
      ids: [_.index, I.index, g.index].map(String),
      g: m,
      sign: O,
      ratio: E * O,
      aux: [_.index, I.index, g.index].some(Zr),
      minx: Math.min(...A),
      maxx: Math.max(...A),
      miny: Math.min(...k),
      maxy: Math.max(...k)
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
  const f = (p) => n[p].aux || l.has(p), u = /* @__PURE__ */ new Set();
  n.forEach((p, _) => {
    f(_) && (s[_] === 0 || s[_] !== o) && u.add(_);
  });
  const h = n.map((p, _) => _).sort((p, _) => n[p].minx - n[_].minx);
  for (let p = 0; p < h.length; p++) {
    const _ = n[h[p]];
    if (_.sign !== 0)
      for (let I = p + 1; I < h.length; I++) {
        const g = n[h[I]];
        if (g.minx >= _.maxx) break;
        g.sign === 0 || g.miny >= _.maxy || _.miny >= g.maxy || !f(h[p]) && !f(h[I]) || ts(_, g) && (u.add(h[p]), u.add(h[I]));
      }
  }
  if (u.size === 0) return [];
  const y = t.filter((p) => (a.get(c(p)) ?? []).some((_) => u.has(_)));
  if (y.length > 0) return y;
  const w = /* @__PURE__ */ new Set();
  for (const p of u) for (const _ of n[p].ids) _.startsWith("b") || w.add(_);
  return t.filter(
    ([p, _]) => w.has(String(e[p])) || w.has(String(e[_]))
  );
}
const ns = 4, Nn = 32, is = 1, rs = 0.4, Gn = 4, ss = 1e-4, Kn = 0.25, os = 0.01, Pt = (r, t) => String(r) < String(t) ? `${r}|${t}` : `${t}|${r}`;
function Fe(r, t, e) {
  const n = t.filter((l) => !String(l.properties.target.index).startsWith("b")).map((l) => ({
    id: l.properties.target.index,
    paper: l.geometry.coordinates,
    geo: l.properties.target.geom
  })), s = /* @__PURE__ */ new Set();
  let o = 0, i = 0;
  const a = r.features.map((l) => {
    const { a: f, b: u, c: h } = l.properties, [y, w, p] = l.geometry.coordinates[0];
    s.add(Pt(f.index, u.index)), s.add(Pt(f.index, h.index)), s.add(Pt(u.index, h.index));
    const _ = Math.sign(lt(y[0], y[1], w[0], w[1], p[0], p[1])) * Math.sign(lt(f.geom[0], f.geom[1], u.geom[0], u.geom[1], h.geom[0], h.geom[1]));
    return _ > 0 ? o++ : _ < 0 && i++, {
      ids: [String(f.index), String(u.index), String(h.index)],
      paper: [y, w, p],
      geo: [f.geom, u.geom, h.geom],
      sign: _
    };
  }), c = e.filter(([l, f]) => !s.has(Pt(n[l].id, n[f].id)));
  return { points: n, triangles: a, majority: o >= i ? 1 : -1, hullEdges: e, dropped: c };
}
function Wn(r) {
  return [r.foot[0] + r.height * r.normal[0], r.foot[1] + r.height * r.normal[1]];
}
function as(r, [t, e], { lambda: n = Kn, epsilon: s = ss } = {}) {
  const { points: o, majority: i } = r, a = o[t], c = o[e], l = o.reduce((M, N) => M + N.paper[0], 0) / o.length, f = o.reduce((M, N) => M + N.paper[1], 0) / o.length, u = Math.sign(lt(a.paper[0], a.paper[1], c.paper[0], c.paper[1], l, f));
  if (u === 0) return;
  const h = u * i, y = [c.paper[0] - a.paper[0], c.paper[1] - a.paper[1]], w = [c.geo[0] - a.geo[0], c.geo[1] - a.geo[1]], p = Math.hypot(y[0], y[1]), _ = Math.hypot(w[0], w[1]);
  if (!(p > 0 && _ > 0)) return;
  const I = [];
  for (const M of o) {
    if (M === a || M === c) continue;
    const N = lt(a.geo[0], a.geo[1], c.geo[0], c.geo[1], M.geo[0], M.geo[1]);
    if (N * h >= 0) continue;
    const D = ((M.geo[0] - a.geo[0]) * w[0] + (M.geo[1] - a.geo[1]) * w[1]) / (_ * _), C = ((M.paper[0] - a.paper[0]) * y[0] + (M.paper[1] - a.paper[1]) * y[1]) / (p * p);
    D > 0 && D < 1 && C > 0 && C < 1 && I.push({ id: M.id, u: D, t: C, d: Math.abs(N) / _ });
  }
  const g = I.length > 0;
  g || I.push({ u: 0.5, t: 0.5, d: 0 });
  const m = I.reduce((M, N) => N.d > M.d ? N : M);
  let d = 0;
  for (const M of I)
    d = Math.max(d, M.u <= m.u ? M.d * m.u / M.u : M.d * (1 - m.u) / (1 - M.u));
  d *= 1 + n;
  const v = [-y[1] / p * u, y[0] / p * u], S = [-w[1] / _ * h, w[0] / _ * h], A = (M) => [
    a.paper[0] + M * y[0] + s * p * v[0],
    a.paper[1] + M * y[1] + s * p * v[1]
  ], k = (M, N, D, C) => ({
    paper: A(M),
    foot: [a.geo[0] + N * w[0], a.geo[1] + N * w[1]],
    normal: S,
    height: D,
    chord: _,
    protrusion: m.d,
    ...C === void 0 ? {} : { anchor: C }
  }), E = [k(m.t, m.u, d, g ? m.id : void 0)], O = [...I].sort((M, N) => M.u - N.u), T = [{ u: 0, d: 0 }], P = (M, N, D) => (N.u - M.u) * (D.d - M.d) - (N.d - M.d) * (D.u - M.u);
  for (const M of [...O, { u: 1, d: 0 }]) {
    for (; T.length >= 2 && P(T[T.length - 2], T[T.length - 1], M) >= 0; ) T.pop();
    T.push(M);
  }
  const F = n * m.d, b = [];
  let B = 0;
  for (const M of T.slice(1, -1))
    M.t === void 0 || !(M.t > B) || (B = M.t, b.push(k(M.t, M.u, M.d + F, g ? M.id : void 0)));
  return {
    edge: [a.id, c.id],
    variants: g && b.length > 1 ? [E, b] : [E]
  };
}
function cs(r, t, e, { lambda: n = Kn, mu: s = os, maxIterations: o = Gn } = {}) {
  let i = r.map((a, c) => ({ ray: { ...a }, index: c }));
  for (let a = 0; a < o && i.length > 0; a++) {
    const c = e(i.map(({ ray: u }) => [u.paper, Wn(u)]));
    if (!c) return;
    let l = !1;
    const f = /* @__PURE__ */ new Set();
    for (const [u, { ray: h }] of i.entries()) {
      const y = `e${t + u}`;
      let w = -1 / 0, p = 1 / 0, _ = 0;
      for (const d of c.triangles) {
        const v = d.ids.indexOf(y);
        if (v < 0) continue;
        d.sign !== c.majority && _++;
        const S = d.geo[(v + 1) % 3], A = d.geo[(v + 2) % 3], k = Math.sign(
          lt(
            d.paper[v][0],
            d.paper[v][1],
            d.paper[(v + 1) % 3][0],
            d.paper[(v + 1) % 3][1],
            d.paper[(v + 2) % 3][0],
            d.paper[(v + 2) % 3][1]
          )
        ), E = lt(h.foot[0], h.foot[1], S[0], S[1], A[0], A[1]), O = lt(h.foot[0] + h.normal[0], h.foot[1] + h.normal[1], S[0], S[1], A[0], A[1]) - E, T = k * c.majority;
        if (O === 0) {
          E * T <= 0 && (w = 1 / 0);
          continue;
        }
        const P = -E / O;
        O * T > 0 ? w = Math.max(w, P) : p = Math.min(p, P);
      }
      if (!(w < p)) {
        f.add(u);
        continue;
      }
      const I = Math.min(Math.max(n * Math.max(w, h.protrusion), s * h.chord), (p - w) / 2), g = Math.max(w, 0) + I, m = Math.abs(g - h.height) > 1e-9 * h.chord;
      (_ > 0 || m) && (m && (l = !0), h.height = g);
    }
    if (f.size > 0 && (i = i.filter((u, h) => !f.has(h)), l = !0), !l) break;
  }
  if (i.length !== 0)
    return { rays: i.map(({ ray: a }) => a), kept: i.map(({ index: a }) => a) };
}
function ls(r, t) {
  const e = (i) => typeof i == "string" && i.startsWith("e") && Number(i.slice(1)) >= t ? Number(i.slice(1)) : void 0, n = /* @__PURE__ */ new Set();
  for (const { ids: i } of r.triangles)
    n.add(Pt(i[0], i[1])), n.add(Pt(i[0], i[2])), n.add(Pt(i[1], i[2]));
  const s = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set();
  for (const [i, a] of r.hullEdges) {
    const c = n.has(Pt(r.points[i].id, r.points[a].id));
    for (const l of [i, a]) {
      const f = e(r.points[l].id);
      f !== void 0 && (o.add(f), c || s.add(f));
    }
  }
  for (const i of r.points) {
    const a = e(i.id);
    a !== void 0 && !o.has(a) && s.add(a);
  }
  return s;
}
function us(r, t) {
  const e = { rounds: 0, builds: 0, cost: 0, budget: 0, batches: 0, perEdge: 0, multiPoint: 0 };
  let n = [], s = [], o = t, i = r.snapshot();
  const a = /* @__PURE__ */ new Set(), c = is * r.baseCost;
  e.budget = c;
  const l = r.buildCost();
  let f = 0;
  const u = () => f * rs + r.buildCost() - l, h = () => u() >= c, y = (g) => {
    if (!h())
      return e.builds++, f++, r.measure(g);
  }, w = (g) => [g.paper, Wn(g)], p = (g, m, d) => {
    const v = cs(
      g.map(({ ray: S }) => S),
      m,
      (S) => y([...n, ...S]),
      { maxIterations: d }
    );
    return v?.rays.map((S, A) => ({ ray: S, edge: g[v.kept[A]].edge }));
  }, _ = (g, m) => g.length === m.length && g.every(({ ray: d }, v) => Math.abs(d.height - m[v].ray.height) <= 1e-9 * d.chord), I = (g) => {
    if (g.length === 0 || n.length + g.length > Nn) return !1;
    const m = r.edgeBase + n.length;
    let d = p(g, m, 1), v = !1;
    for (; d && d.length > 0 && !h(); ) {
      const S = [...n, ...d.map(({ ray: O }) => w(O))];
      e.builds++;
      const A = r.build(S, Math.max(1, Math.ceil(c - u()))), k = A ? ls(A.analysis, m) : void 0;
      if (A && k.size === 0)
        return s = s.concat(
          d.map(({ ray: O, edge: T }, P) => ({
            node: m + P,
            kind: "hullEdge",
            edge: T,
            ...O.anchor === void 0 ? {} : { anchor: O.anchor }
          }))
        ), n = S, o = A, i = r.snapshot(), !0;
      if (r.restore(i), A && k.size < d.length) {
        d = d.filter((O, T) => !k.has(m + T));
        continue;
      }
      if (v) return !1;
      v = !0;
      const E = p(d, m, Gn);
      if (!E || _(E, d)) return !1;
      d = E;
    }
    return !1;
  };
  for (let g = 1; g <= ns && !h(); g++) {
    const { analysis: m } = o, d = [];
    for (const S of m.dropped) {
      const A = S.map((E) => m.points[E].paper.join(",")).join("|");
      if (a.has(A) || (a.add(A), n.length + d.length + 1 > Nn)) continue;
      const k = as(m, S);
      k && d.push(k);
    }
    if (d.length === 0) break;
    e.rounds = g;
    const v = (S, A) => A.map((k) => ({ ray: k, edge: S.edge }));
    if (I(d.flatMap((S) => v(S, S.variants[0])))) {
      e.batches++;
      continue;
    }
    for (const S of d)
      for (const [A, k] of S.variants.entries()) {
        if (h()) break;
        if (I(v(S, k))) {
          e.perEdge++, A > 0 && e.multiPoint++;
          break;
        }
      }
  }
  return r.restore(i), e.cost = u(), { pairs: n, records: s, result: o.result, diagnostics: e };
}
const Rn = 2.00704, Dn = 3.00001, fs = 12, hs = 4, Fn = 1, Pn = 4, ds = 8, ps = 24;
function gs(r) {
  if (r.size === 0) return [];
  if (r.size >= 36) return [[...r].sort((e, n) => e - n)];
  const t = [];
  for (let e = 0; e < 36; e++) {
    if (!r.has(e) || r.has((e + 35) % 36)) continue;
    const n = [e];
    for (let s = (e + 1) % 36; r.has(s); s = (s + 1) % 36) n.push(s);
    t.push(n);
  }
  return t;
}
const Cn = /* @__PURE__ */ Symbol("supplement pairs out of budget"), ms = 24;
class nt extends ti {
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
      ei(t.worldFile), this.requestedWorldFile = { ...t.worldFile };
    }
    t.points && this.setPoints(t.points), t.edges && this.setEdges(t.edges);
  }
  /**
   * フォーマットバージョンを取得します
   */
  getFormatVersion() {
    return this.useV2Algorithm ? Rn : Dn;
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
    this.edges = ni(t), this.edgeNodes = void 0, this.tins = void 0, this.indexedTins = void 0;
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
    i.push(t[0]), this.boundsPolygon = re([i]), this.xy = [e, s], this.wh = [n - e, o - s], this.vertexMode = nt.VERTEX_PLAIN, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 現在の設定を永続化可能な形式にコンパイルします
   */
  getCompiled() {
    const t = {};
    if (t.version = this.useV2Algorithm ? Rn : Dn, t.points = this.points, t.weight_buffer = {}, this.compiledOuter?.outerTransform === "worldFile")
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
  calculateStrictTin(t = kn) {
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
    this.tins.bakw = St(t);
    const e = {};
    this.tins.forw.features.forEach((s, o) => {
      const i = this.tins.bakw.features[o];
      zn(e, { forw: s, bakw: i });
    });
    const n = (this.pointsSet?.forw.features ?? []).map(
      (s) => s.properties.target.index
    );
    Hr(
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
      if (ws(o, this.points.length, s), i.length === 0 && a.length === 0) {
        e.push(o);
        continue;
      }
      i.unshift(this.points[o[0]][0]), i.push(this.points[o[1]][0]), a.unshift(this.points[o[0]][1]), a.push(this.points[o[1]][1]), sr(i, a).map((c, l, f) => {
        this.edgeNodes[n] = [
          c[0],
          c[1]
        ];
        const u = Vt(
          c[0],
          c[1],
          `e${n}`
        );
        n++, t.forw.push(u), t.bakw.push(jt(u)), l === 0 ? e.push([o[0], t.forw.length - 1]) : e.push([
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
    this.lastBoundaryDiagnostics = void 0, this.supplementRecords = [], this.attemptTotal = 0, this.lastSupplementDiagnostics = void 0;
    let t = this.strictMode;
    t !== nt.MODE_STRICT && t !== nt.MODE_LOOSE && (t = nt.MODE_AUTO);
    const e = !this.useV2Algorithm, n = this.requestedWorldFile;
    if (n && !e) throw new Error("V2 では world file 外周を使えません");
    let s, o, i, a, c;
    if (e) {
      if (this.bounds) {
        const F = this.boundsPolygon;
        if (!F) throw new Error("Internal error: bounds is set but boundsPolygon is missing");
        if (!this.points.every(
          (B) => Je(B[0], F)
        )) throw "SOME POINTS OUTSIDE";
      }
      s = this.generatePointsSet(), { minx: o, maxx: i, miny: a, maxy: c } = this.computeGcpBbox();
    } else {
      const F = this.validateAndPrepareInputs();
      s = F.pointsSet, o = F.minx, i = F.maxx, a = F.miny, c = F.maxy;
    }
    const l = {
      forw: St([...s.forw]),
      bakw: St([...s.bakw])
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
    const h = Di(l.forw), y = fn(l.forw);
    if (!y) throw "TOO LINEAR2";
    const w = {}, p = y.geometry.coordinates[0];
    let _;
    try {
      _ = p.map((F) => ({
        forw: F,
        bakw: Me(Yt(F), f)
      })), _.forEach((F) => {
        w[`${F.forw[0]}:${F.forw[1]}`] = F;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const I = fn(l.bakw);
    if (!I) throw "TOO LINEAR2";
    const g = I.geometry.coordinates[0];
    try {
      _ = g.map((F) => ({
        bakw: F,
        forw: Me(Yt(F), u)
      })), _.forEach((F) => {
        w[`${F.forw[0]}:${F.forw[1]}`] = F;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const m = {
      forw: h.geometry.coordinates,
      bakw: Me(h, f)
    }, d = Vt(m.forw, m.bakw, "c");
    this.centroid = {
      forw: d,
      bakw: jt(d)
    };
    const v = [
      ...this.points.map((F) => ({ forw: F[0], bakw: F[1] })),
      ...(this.edgeNodes ?? []).map((F) => ({ forw: F[0], bakw: F[1] }))
    ], S = {
      convexBuf: w,
      centroid: m,
      allGcps: v,
      minx: o,
      maxx: i,
      miny: a,
      maxy: c
    }, A = t === nt.MODE_STRICT || t === nt.MODE_AUTO, k = (F, b, B) => {
      if (!A || this.isStrict() || !F.boundary) return { result: F };
      const M = () => ({
        build: this.captureBuild(),
        raw: [s.forw.slice(), s.bakw.slice()],
        gcps: v.slice(),
        edgeNodes: this.edgeNodes.slice(),
        supplementRecords: this.supplementRecords,
        supplementDiagnostics: this.lastSupplementDiagnostics
      }), N = (X) => {
        s.forw.splice(0, s.forw.length, ...X.raw[0]), s.bakw.splice(0, s.bakw.length, ...X.raw[1]), v.splice(0, v.length, ...X.gcps), this.edgeNodes.splice(0, this.edgeNodes.length, ...X.edgeNodes), this.restoreBuild(X.build), this.supplementRecords = X.supplementRecords, this.lastSupplementDiagnostics = X.supplementDiagnostics;
      }, D = M(), C = this.attemptTotal, x = () => this.attemptTotal - C, R = (X, U) => {
        const G = U.map(([W]) => W), z = U.map(([, W]) => W);
        return (X[0] === Math.min(...G) || X[0] === Math.max(...G)) && (X[1] === Math.min(...z) || X[1] === Math.max(...z));
      }, $ = (X) => {
        s.forw.splice(0, s.forw.length, ...D.raw[0]), s.bakw.splice(0, s.bakw.length, ...D.raw[1]), v.splice(0, v.length, ...D.gcps), this.edgeNodes.splice(0, this.edgeNodes.length, ...D.edgeNodes), this.supplementRecords = [], this.lastSupplementDiagnostics = void 0;
        const U = B(X);
        return { built: U, strict: U.boundary !== void 0 && this.isStrict() };
      }, L = /* @__PURE__ */ new Set(), q = F.boundary.vertices.map(({ forw: X }) => X), Y = new Set(
        q.filter((X) => !R(X, q)).map((X) => Sn(X, m.forw))
      );
      try {
        let X = F;
        for (let U = 0; U < hs && !(x() + b >= Pn * b); U++) {
          const G = X.boundary.vertices.map(({ forw: H }) => H), z = L.size;
          for (const H of Sr(this.tins.forw)) {
            if (R(H, G)) continue;
            const Q = Sn(H, m.forw);
            for (let J = -Fn; J <= Fn; J++) L.add((Q + J + 36) % 36);
          }
          if (L.size === z || L.size >= ps) break;
          const W = $({ skipBins: new Set(L) });
          if (!W.built.boundary)
            return N(D), { result: F };
          if (W.strict) {
            let H = { result: W.built, state: M() };
            for (const Q of gs(L)) {
              if (!Q.some((ct) => Y.has(ct))) continue;
              if (x() >= ds * b) break;
              const J = new Set([...L].filter((ct) => !Q.includes(ct))), at = $({ skipBins: J });
              if (at.strict) {
                for (const ct of Q) L.delete(ct);
                H = { result: at.built, state: M() };
              }
            }
            return N(H.state), { result: H.result, kind: "thinned" };
          }
          X = W.built;
        }
        if (x() < Pn * b) {
          const U = $({ cornersOnly: !0 });
          if (U.strict) return { result: U.built, kind: "corners" };
        }
      } catch {
      }
      return N(D), { result: F };
    };
    if (n) {
      this.stateTriangle = void 0;
      const F = this.yaxisMode === nt.YAXIS_FOLLOW, b = F ? 1 : -1, B = (R) => this.buildWithSupplements(t, s, v, ($, L, q) => (Y) => ({ boundary: vn(
        R ? { ...S, ring: R } : S,
        (X) => vr(X, (U) => {
          const [G, z] = ii(n, U);
          return [G, F ? -z : z];
        }),
        s,
        this.points.length,
        {
          orientation: b,
          accept: (X) => X.hasMapBoundary ? (this.buildTin(s, X.vertices, L, X, Y.size > 0, q), (this.strict_status !== nt.STATUS_LOOSE || X.hasBoundary) && be(this.tins.forw, b) === 0 && be(this.tins.bakw, b) === 0) : !1
        },
        Y,
        $
      ) })), M = this.attemptTotal, N = B(), D = this.attemptTotal - M, { result: { boundary: C }, kind: x } = k(N, D, B);
      if (C) {
        this.compiledOuter = {
          outerTransform: "worldFile",
          worldFile: n,
          vertices_points: C.vertices.map(({ forw: Y, bakw: X }) => [Y, X])
        };
        const { centroid: R, xy: $, wh: L, kinks: q } = this;
        super.setCompiled(this.getCompiled()), Object.assign(this, { centroid: R, xy: $, wh: L, kinks: q }), this.lastBoundaryDiagnostics = {
          ...C.diagnostics,
          ...x ? { ringRescue: x } : {},
          requestedOuterTransform: "worldFile",
          outerTransform: "worldFile"
        };
        return;
      }
      this.compiledOuter = { outerTransform: "extrapolate" }, this.outerTransform = "extrapolate", this.worldFile = void 0;
    }
    const E = this.vertexMode === nt.VERTEX_BIRDEYE ? yr : wr;
    let O, T, P;
    if (e) {
      const F = (N) => this.buildWithSupplements(t, s, v, (D, C, x) => (R) => {
        const $ = N ? { ...S, ring: N } : S, L = vn(
          $,
          E,
          s,
          this.points.length,
          void 0,
          R,
          D
        );
        return {
          boundary: L,
          verticesList: this.buildTin(
            s,
            L?.vertices ?? E($, !1),
            C,
            L,
            R.size > 0,
            x
          )
        };
      }), b = this.attemptTotal, B = F(), M = k(B, this.attemptTotal - b, F);
      ({ boundary: O, verticesList: T } = M.result), P = M.kind;
    } else
      T = this.buildTin(
        s,
        E(S, !1),
        t,
        void 0
      );
    this.vertices_params = {
      forw: mn(T.forw, this.centroid.forw),
      bakw: mn(T.bakw, this.centroid.bakw)
    }, this.addIndexedTin(), this.pointsWeightBuffer = {}, this.lastBoundaryDiagnostics = O && P ? { ...O.diagnostics, ringRescue: P } : O?.diagnostics, n && this.lastBoundaryDiagnostics && (this.lastBoundaryDiagnostics = {
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
    const i = (S, A, k) => {
      const E = s(S, A, k);
      return (O) => (o++, this.attemptTotal++, E(O));
    }, a = (S) => this.buildWithHull(S, i(/* @__PURE__ */ new Map(), S, !1));
    if (!this.useSupplementPairs || this.useV2Algorithm || t === nt.MODE_LOOSE) return a(t);
    const c = t, l = a(c), f = o;
    let u = 0;
    if (!l.boundary || this.strict_status !== nt.STATUS_STRICT) return l;
    const h = Fe(this.tins.forw, this.pointsSet.forw.features, l.boundary.forwHull.all);
    if (h.dropped.length === 0) return l;
    const y = this.edgeNodes.length, w = e.forw.length, p = n.length;
    let _ = [], I;
    const g = (S, A) => S.length === A.length && S.every((k, E) => k.every((O, T) => O[0] === A[E][T][0] && O[1] === A[E][T][1])), m = (S) => {
      e.forw.length = w, e.bakw.length = w, n.length = p, this.edgeNodes.length = y;
      for (const [A, k] of S) {
        const E = Vt(A, k, `e${this.edgeNodes.length}`);
        this.edgeNodes.push([A, k]), e.forw.push(E), e.bakw.push(jt(E)), n.push({ forw: A, bakw: k });
      }
      _ = S;
    }, v = us({
      edgeBase: y,
      baseCost: f,
      buildCost: () => u,
      snapshot: () => ({ pairs: _, state: this.captureBuild() }),
      restore: ({ pairs: S, state: A }) => {
        m(S), this.restoreBuild(A);
      },
      measure: (S) => {
        m(S);
        const A = this.captureBuild();
        try {
          const k = /* @__PURE__ */ new Map();
          I = { pairs: S, cache: k };
          const { boundary: E } = s(k, nt.MODE_STRICT, !0)(/* @__PURE__ */ new Set());
          return E ? Fe(this.tins.forw, this.pointsSet.forw.features, []) : void 0;
        } finally {
          this.restoreBuild(A);
        }
      },
      build: (S, A) => {
        m(S);
        const k = I && g(I.pairs, S) ? I.cache : /* @__PURE__ */ new Map(), E = o;
        let O;
        try {
          O = this.buildWithHull(c, (T) => {
            if (o - E >= A) throw Cn;
            return i(k, c, !1)(T);
          });
        } catch (T) {
          if (T !== Cn) throw T;
          u += o - E;
          return;
        }
        if (u += o - E, !(!O.boundary || this.strict_status !== nt.STATUS_STRICT))
          return {
            result: O,
            analysis: Fe(this.tins.forw, this.pointsSet.forw.features, O.boundary.forwHull.all)
          };
      }
    }, { result: l, analysis: h });
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
      const m = e(p), d = {
        value: m,
        strict: m.boundary !== void 0 && this.strict_status === nt.STATUS_STRICT
      };
      return (d.strict || _) && (d.state = this.captureBuild()), n.set(I, d), s = d, d;
    }, a = (p) => (s !== p && this.restoreBuild(p.state), s = p, p.value), c = i(/* @__PURE__ */ new Set(), !0);
    if (!(t === nt.MODE_STRICT || t === nt.MODE_AUTO) || !c.value.boundary || c.strict) return c.value;
    const f = new Set(c.value.boundary.forwHull.all.map(ve)), u = () => this.pointsSet.forw.features.map(
      (p) => p.properties.target.index
    ), h = /* @__PURE__ */ new Set();
    let y = c, w;
    for (let p = 0; p < fs; p++) {
      const _ = es(
        this.tins.forw,
        y.value.boundary.forwHull.applied,
        u()
      ).filter((I) => !h.has(ve(I)));
      if (_.length === 0) break;
      for (const I of _) h.add(ve(I));
      if (y = i(h), !y.value.boundary) break;
      if (y.strict) {
        w = y;
        break;
      }
    }
    if (w) {
      let p = w;
      for (const _ of [...h].slice(0, ms)) {
        const I = new Set(h);
        I.delete(_);
        const g = i(I);
        g.strict && (h.delete(_), p = g);
      }
      return a(p);
    }
    if (h.size < f.size) {
      const p = i(f);
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
  buildTin(t, e, n, s, o = !1, i = !1) {
    const a = {
      forw: [],
      bakw: []
    };
    for (let c = 0; c < e.length; c++) {
      const l = e[c].forw, f = e[c].bakw, u = Vt(l, f, `b${c}`), h = jt(u);
      a.forw.push(u), a.bakw.push(h);
    }
    return this.pointsSet = {
      forw: St([...t.forw, ...a.forw]),
      bakw: St([...t.bakw, ...a.bakw]),
      edges: t.edges
    }, this.tins = {
      forw: je(
        s?.forw ?? pe(this.pointsSet.forw, t.edges, "target")
      )
    }, (n === nt.MODE_STRICT || n === nt.MODE_AUTO) && (i ? this.resolveStrictOverlaps() : this.calculateStrictTin(
      n === nt.MODE_AUTO || o ? 1 : kn
    )), (n === nt.MODE_LOOSE || n === nt.MODE_AUTO && this.strict_status === nt.STATUS_ERROR) && (this.tins.bakw = je(
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
function ws(r, t, e) {
  const n = (s) => Number.isInteger(s) && s >= 0 && s < t;
  if (!Array.isArray(r) || !n(r[0]) || !n(r[1]))
    throw new Error(
      `Invalid edge at edges[${e}]: start/end ${JSON.stringify(r)} must be integer indices of points (0 to ${t - 1})`
    );
}
export {
  nt as Tin,
  pe as constrainedTin,
  jt as counterPoint,
  Vt as createPoint,
  nt as default,
  vs as findIntersections,
  Rn as format_version,
  zn as insertSearchIndex,
  mn as vertexCalc
};
