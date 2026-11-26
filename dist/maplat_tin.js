import { counterTri as $n, Transform as ti, validateWorldFile as ei, normalizeEdges as ni, transformArr as Me, rotateVerticesTriangle as je, worldFileToCrs as ii } from "@maplat/transform";
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
function ri(i) {
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
function si(i) {
  return i.type === "Feature" ? i.geometry : i;
}
function Xe(i, t, e) {
  if (i !== null)
    for (var n, s, o, r, a, c, l, f = 0, u = 0, h, w = i.type, y = w === "FeatureCollection", p = w === "Feature", _ = y ? i.features.length : 1, I = 0; I < _; I++) {
      l = y ? (
        // @ts-expect-error: Known type conflict
        i.features[I].geometry
      ) : p ? (
        // @ts-expect-error: Known type conflict
        i.geometry
      ) : i, h = l ? l.type === "GeometryCollection" : !1, a = h ? l.geometries.length : 1;
      for (var g = 0; g < a; g++) {
        var m = 0, d = 0;
        if (r = h ? l.geometries[g] : l, r !== null) {
          c = r.coordinates;
          var b = r.type;
          switch (f = e && (b === "Polygon" || b === "MultiPolygon") ? 1 : 0, b) {
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
                u++, b === "MultiPoint" && m++;
              }
              b === "LineString" && m++;
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
                b === "MultiLineString" && m++, b === "Polygon" && d++;
              }
              b === "Polygon" && m++;
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
const pt = 11102230246251565e-32, j = 134217729, Xn = (3 + 8 * pt) * pt;
function ht(i, t, e, n, s) {
  let o, r, a, c, l = t[0], f = n[0], u = 0, h = 0;
  f > l == f > -l ? (o = l, l = t[++u]) : (o = f, f = n[++h]);
  let w = 0;
  if (u < i && h < e)
    for (f > l == f > -l ? (r = l + o, a = o - (r - l), l = t[++u]) : (r = f + o, a = o - (r - f), f = n[++h]), o = r, a !== 0 && (s[w++] = a); u < i && h < e; )
      f > l == f > -l ? (r = o + l, c = r - o, a = o - (r - c) + (l - c), l = t[++u]) : (r = o + f, c = r - o, a = o - (r - c) + (f - c), f = n[++h]), o = r, a !== 0 && (s[w++] = a);
  for (; u < i; )
    r = o + l, c = r - o, a = o - (r - c) + (l - c), l = t[++u], o = r, a !== 0 && (s[w++] = a);
  for (; h < e; )
    r = o + f, c = r - o, a = o - (r - c) + (f - c), f = n[++h], o = r, a !== 0 && (s[w++] = a);
  return (o !== 0 || w === 0) && (s[w++] = o), w;
}
function Mt(i, t, e, n, s, o, r, a) {
  return ht(ht(i, t, e, n, r), r, s, o, a);
}
function V(i, t, e, n) {
  let s, o, r, a, c, l, f, u, h, w, y;
  f = j * e, w = f - (f - e), y = e - w;
  let p = t[0];
  s = p * e, f = j * p, u = f - (f - p), h = p - u, r = h * y - (s - u * w - h * w - u * y);
  let _ = 0;
  r !== 0 && (n[_++] = r);
  for (let I = 1; I < i; I++)
    p = t[I], a = p * e, f = j * p, u = f - (f - p), h = p - u, c = h * y - (a - u * w - h * w - u * y), o = s + c, l = o - s, r = s - (o - l) + (c - l), r !== 0 && (n[_++] = r), s = a + o, r = o - (s - a), r !== 0 && (n[_++] = r);
  return (s !== 0 || _ === 0) && (n[_++] = s), _;
}
function Ln(i, t) {
  let e = t[0];
  for (let n = 1; n < i; n++) e += t[n];
  return e;
}
function tt(i) {
  return new Float64Array(i);
}
const oi = (3 + 16 * pt) * pt, ai = (2 + 12 * pt) * pt, ci = (9 + 64 * pt) * pt * pt, Ut = tt(4), Ke = tt(8), We = tt(12), He = tt(16), gt = tt(4);
function li(i, t, e, n, s, o, r) {
  let a, c, l, f, u, h, w, y, p, _, I, g, m, d, b, v, E, k;
  const A = i - s, O = e - s, T = t - o, R = n - o;
  d = A * R, h = j * A, w = h - (h - A), y = A - w, h = j * R, p = h - (h - R), _ = R - p, b = y * _ - (d - w * p - y * p - w * _), v = T * O, h = j * T, w = h - (h - T), y = T - w, h = j * O, p = h - (h - O), _ = O - p, E = y * _ - (v - w * p - y * p - w * _), I = b - E, u = b - I, Ut[0] = b - (I + u) + (u - E), g = d + I, u = g - d, m = d - (g - u) + (I - u), I = m - v, u = m - I, Ut[1] = m - (I + u) + (u - v), k = g + I, u = k - g, Ut[2] = g - (k - u) + (I - u), Ut[3] = k;
  let P = Ln(4, Ut), x = ai * r;
  if (P >= x || -P >= x || (u = i - A, a = i - (A + u) + (u - s), u = e - O, l = e - (O + u) + (u - s), u = t - T, c = t - (T + u) + (u - o), u = n - R, f = n - (R + u) + (u - o), a === 0 && c === 0 && l === 0 && f === 0) || (x = ci * r + Xn * Math.abs(P), P += A * f + R * a - (T * l + O * c), P >= x || -P >= x)) return P;
  d = a * R, h = j * a, w = h - (h - a), y = a - w, h = j * R, p = h - (h - R), _ = R - p, b = y * _ - (d - w * p - y * p - w * _), v = c * O, h = j * c, w = h - (h - c), y = c - w, h = j * O, p = h - (h - O), _ = O - p, E = y * _ - (v - w * p - y * p - w * _), I = b - E, u = b - I, gt[0] = b - (I + u) + (u - E), g = d + I, u = g - d, m = d - (g - u) + (I - u), I = m - v, u = m - I, gt[1] = m - (I + u) + (u - v), k = g + I, u = k - g, gt[2] = g - (k - u) + (I - u), gt[3] = k;
  const B = ht(4, Ut, 4, gt, Ke);
  d = A * f, h = j * A, w = h - (h - A), y = A - w, h = j * f, p = h - (h - f), _ = f - p, b = y * _ - (d - w * p - y * p - w * _), v = T * l, h = j * T, w = h - (h - T), y = T - w, h = j * l, p = h - (h - l), _ = l - p, E = y * _ - (v - w * p - y * p - w * _), I = b - E, u = b - I, gt[0] = b - (I + u) + (u - E), g = d + I, u = g - d, m = d - (g - u) + (I - u), I = m - v, u = m - I, gt[1] = m - (I + u) + (u - v), k = g + I, u = k - g, gt[2] = g - (k - u) + (I - u), gt[3] = k;
  const M = ht(B, Ke, 4, gt, We);
  d = a * f, h = j * a, w = h - (h - a), y = a - w, h = j * f, p = h - (h - f), _ = f - p, b = y * _ - (d - w * p - y * p - w * _), v = c * l, h = j * c, w = h - (h - c), y = c - w, h = j * l, p = h - (h - l), _ = l - p, E = y * _ - (v - w * p - y * p - w * _), I = b - E, u = b - I, gt[0] = b - (I + u) + (u - E), g = d + I, u = g - d, m = d - (g - u) + (I - u), I = m - v, u = m - I, gt[1] = m - (I + u) + (u - v), k = g + I, u = k - g, gt[2] = g - (k - u) + (I - u), gt[3] = k;
  const N = ht(M, We, 4, gt, He);
  return He[N - 1];
}
function at(i, t, e, n, s, o) {
  const r = (t - o) * (e - s), a = (i - s) * (n - o), c = r - a, l = Math.abs(r + a);
  return Math.abs(c) >= oi * l ? c : -li(i, t, e, n, s, o, l);
}
const ui = (10 + 96 * pt) * pt, fi = (4 + 48 * pt) * pt, hi = (44 + 576 * pt) * pt * pt, Ot = tt(4), Nt = tt(4), Ft = tt(4), _t = tt(4), kt = tt(4), Et = tt(4), mt = tt(4), wt = tt(4), _e = tt(8), ke = tt(8), Ee = tt(8), Ae = tt(8), Ie = tt(8), Be = tt(8), oe = tt(8), ae = tt(8), ce = tt(8), Ct = tt(4), $t = tt(4), Xt = tt(4), K = tt(8), Z = tt(16), it = tt(16), rt = tt(16), et = tt(32), Dt = tt(32), ut = tt(48), vt = tt(64);
let Gt = tt(1152), Te = tt(1152);
function ft(i, t, e) {
  i = ht(i, Gt, t, e, Te);
  const n = Gt;
  return Gt = Te, Te = n, i;
}
function di(i, t, e, n, s, o, r, a, c) {
  let l, f, u, h, w, y, p, _, I, g, m, d, b, v, E, k, A, O, T, R, P, x, B, M, N, D, C, S, F, $, L, q, Y, X, U;
  const G = i - r, z = e - r, W = s - r, H = t - a, Q = n - a, J = o - a;
  L = z * J, B = j * z, M = B - (B - z), N = z - M, B = j * J, D = B - (B - J), C = J - D, q = N * C - (L - M * D - N * D - M * C), Y = W * Q, B = j * W, M = B - (B - W), N = W - M, B = j * Q, D = B - (B - Q), C = Q - D, X = N * C - (Y - M * D - N * D - M * C), S = q - X, x = q - S, Ot[0] = q - (S + x) + (x - X), F = L + S, x = F - L, $ = L - (F - x) + (S - x), S = $ - Y, x = $ - S, Ot[1] = $ - (S + x) + (x - Y), U = F + S, x = U - F, Ot[2] = F - (U - x) + (S - x), Ot[3] = U, L = W * H, B = j * W, M = B - (B - W), N = W - M, B = j * H, D = B - (B - H), C = H - D, q = N * C - (L - M * D - N * D - M * C), Y = G * J, B = j * G, M = B - (B - G), N = G - M, B = j * J, D = B - (B - J), C = J - D, X = N * C - (Y - M * D - N * D - M * C), S = q - X, x = q - S, Nt[0] = q - (S + x) + (x - X), F = L + S, x = F - L, $ = L - (F - x) + (S - x), S = $ - Y, x = $ - S, Nt[1] = $ - (S + x) + (x - Y), U = F + S, x = U - F, Nt[2] = F - (U - x) + (S - x), Nt[3] = U, L = G * Q, B = j * G, M = B - (B - G), N = G - M, B = j * Q, D = B - (B - Q), C = Q - D, q = N * C - (L - M * D - N * D - M * C), Y = z * H, B = j * z, M = B - (B - z), N = z - M, B = j * H, D = B - (B - H), C = H - D, X = N * C - (Y - M * D - N * D - M * C), S = q - X, x = q - S, Ft[0] = q - (S + x) + (x - X), F = L + S, x = F - L, $ = L - (F - x) + (S - x), S = $ - Y, x = $ - S, Ft[1] = $ - (S + x) + (x - Y), U = F + S, x = U - F, Ft[2] = F - (U - x) + (S - x), Ft[3] = U, l = ht(
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
      V(V(4, Ft, W, K), K, W, Z),
      Z,
      V(V(4, Ft, J, K), K, J, it),
      it,
      et
    ),
    et,
    Gt
  );
  let ct = Ln(l, Gt), lt = fi * c;
  if (ct >= lt || -ct >= lt || (x = i - G, f = i - (G + x) + (x - r), x = t - H, w = t - (H + x) + (x - a), x = e - z, u = e - (z + x) + (x - r), x = n - Q, y = n - (Q + x) + (x - a), x = s - W, h = s - (W + x) + (x - r), x = o - J, p = o - (J + x) + (x - a), f === 0 && u === 0 && h === 0 && w === 0 && y === 0 && p === 0) || (lt = hi * c + Xn * Math.abs(ct), ct += (G * G + H * H) * (z * p + J * u - (Q * h + W * y)) + 2 * (G * f + H * w) * (z * J - Q * W) + ((z * z + Q * Q) * (W * w + H * h - (J * f + G * p)) + 2 * (z * u + Q * y) * (W * H - J * G)) + ((W * W + J * J) * (G * y + Q * f - (H * u + z * w)) + 2 * (W * h + J * p) * (G * Q - H * z)), ct >= lt || -ct >= lt))
    return ct;
  if ((u !== 0 || y !== 0 || h !== 0 || p !== 0) && (L = G * G, B = j * G, M = B - (B - G), N = G - M, q = N * N - (L - M * M - (M + M) * N), Y = H * H, B = j * H, M = B - (B - H), N = H - M, X = N * N - (Y - M * M - (M + M) * N), S = q + X, x = S - q, _t[0] = q - (S - x) + (X - x), F = L + S, x = F - L, $ = L - (F - x) + (S - x), S = $ + Y, x = S - $, _t[1] = $ - (S - x) + (Y - x), U = F + S, x = U - F, _t[2] = F - (U - x) + (S - x), _t[3] = U), (h !== 0 || p !== 0 || f !== 0 || w !== 0) && (L = z * z, B = j * z, M = B - (B - z), N = z - M, q = N * N - (L - M * M - (M + M) * N), Y = Q * Q, B = j * Q, M = B - (B - Q), N = Q - M, X = N * N - (Y - M * M - (M + M) * N), S = q + X, x = S - q, kt[0] = q - (S - x) + (X - x), F = L + S, x = F - L, $ = L - (F - x) + (S - x), S = $ + Y, x = S - $, kt[1] = $ - (S - x) + (Y - x), U = F + S, x = U - F, kt[2] = F - (U - x) + (S - x), kt[3] = U), (f !== 0 || w !== 0 || u !== 0 || y !== 0) && (L = W * W, B = j * W, M = B - (B - W), N = W - M, q = N * N - (L - M * M - (M + M) * N), Y = J * J, B = j * J, M = B - (B - J), N = J - M, X = N * N - (Y - M * M - (M + M) * N), S = q + X, x = S - q, Et[0] = q - (S - x) + (X - x), F = L + S, x = F - L, $ = L - (F - x) + (S - x), S = $ + Y, x = S - $, Et[1] = $ - (S - x) + (Y - x), U = F + S, x = U - F, Et[2] = F - (U - x) + (S - x), Et[3] = U), f !== 0 && (_ = V(4, Ot, f, _e), l = ft(l, Mt(
    V(_, _e, 2 * G, Z),
    Z,
    V(V(4, Et, f, K), K, Q, it),
    it,
    V(V(4, kt, f, K), K, -J, rt),
    rt,
    et,
    ut
  ), ut)), w !== 0 && (I = V(4, Ot, w, ke), l = ft(l, Mt(
    V(I, ke, 2 * H, Z),
    Z,
    V(V(4, kt, w, K), K, W, it),
    it,
    V(V(4, Et, w, K), K, -z, rt),
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
  ), ut)), y !== 0 && (m = V(4, Nt, y, Ae), l = ft(l, Mt(
    V(m, Ae, 2 * Q, Z),
    Z,
    V(V(4, Et, y, K), K, G, it),
    it,
    V(V(4, _t, y, K), K, -W, rt),
    rt,
    et,
    ut
  ), ut)), h !== 0 && (d = V(4, Ft, h, Ie), l = ft(l, Mt(
    V(d, Ie, 2 * W, Z),
    Z,
    V(V(4, kt, h, K), K, H, it),
    it,
    V(V(4, _t, h, K), K, -Q, rt),
    rt,
    et,
    ut
  ), ut)), p !== 0 && (b = V(4, Ft, p, Be), l = ft(l, Mt(
    V(b, Be, 2 * J, Z),
    Z,
    V(V(4, _t, p, K), K, z, it),
    it,
    V(V(4, kt, p, K), K, -G, rt),
    rt,
    et,
    ut
  ), ut)), f !== 0 || w !== 0) {
    if (u !== 0 || y !== 0 || h !== 0 || p !== 0 ? (L = u * J, B = j * u, M = B - (B - u), N = u - M, B = j * J, D = B - (B - J), C = J - D, q = N * C - (L - M * D - N * D - M * C), Y = z * p, B = j * z, M = B - (B - z), N = z - M, B = j * p, D = B - (B - p), C = p - D, X = N * C - (Y - M * D - N * D - M * C), S = q + X, x = S - q, mt[0] = q - (S - x) + (X - x), F = L + S, x = F - L, $ = L - (F - x) + (S - x), S = $ + Y, x = S - $, mt[1] = $ - (S - x) + (Y - x), U = F + S, x = U - F, mt[2] = F - (U - x) + (S - x), mt[3] = U, L = h * -Q, B = j * h, M = B - (B - h), N = h - M, B = j * -Q, D = B - (B - -Q), C = -Q - D, q = N * C - (L - M * D - N * D - M * C), Y = W * -y, B = j * W, M = B - (B - W), N = W - M, B = j * -y, D = B - (B - -y), C = -y - D, X = N * C - (Y - M * D - N * D - M * C), S = q + X, x = S - q, wt[0] = q - (S - x) + (X - x), F = L + S, x = F - L, $ = L - (F - x) + (S - x), S = $ + Y, x = S - $, wt[1] = $ - (S - x) + (Y - x), U = F + S, x = U - F, wt[2] = F - (U - x) + (S - x), wt[3] = U, E = ht(4, mt, 4, wt, ae), L = u * p, B = j * u, M = B - (B - u), N = u - M, B = j * p, D = B - (B - p), C = p - D, q = N * C - (L - M * D - N * D - M * C), Y = h * y, B = j * h, M = B - (B - h), N = h - M, B = j * y, D = B - (B - y), C = y - D, X = N * C - (Y - M * D - N * D - M * C), S = q - X, x = q - S, $t[0] = q - (S + x) + (x - X), F = L + S, x = F - L, $ = L - (F - x) + (S - x), S = $ - Y, x = $ - S, $t[1] = $ - (S + x) + (x - Y), U = F + S, x = U - F, $t[2] = F - (U - x) + (S - x), $t[3] = U, O = 4) : (ae[0] = 0, E = 1, $t[0] = 0, O = 1), f !== 0) {
      const st = V(E, ae, f, rt);
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
      ), vt), y !== 0 && (l = ft(l, V(V(4, Et, f, K), K, y, Z), Z)), p !== 0 && (l = ft(l, V(V(4, kt, -f, K), K, p, Z), Z));
    }
    if (w !== 0) {
      const st = V(E, ae, w, rt);
      l = ft(l, ht(
        V(I, ke, w, Z),
        Z,
        V(st, rt, 2 * H, et),
        et,
        ut
      ), ut);
      const ot = V(O, $t, w, K);
      l = ft(l, Mt(
        V(ot, K, 2 * H, Z),
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
  if (u !== 0 || y !== 0) {
    if (h !== 0 || p !== 0 || f !== 0 || w !== 0 ? (L = h * H, B = j * h, M = B - (B - h), N = h - M, B = j * H, D = B - (B - H), C = H - D, q = N * C - (L - M * D - N * D - M * C), Y = W * w, B = j * W, M = B - (B - W), N = W - M, B = j * w, D = B - (B - w), C = w - D, X = N * C - (Y - M * D - N * D - M * C), S = q + X, x = S - q, mt[0] = q - (S - x) + (X - x), F = L + S, x = F - L, $ = L - (F - x) + (S - x), S = $ + Y, x = S - $, mt[1] = $ - (S - x) + (Y - x), U = F + S, x = U - F, mt[2] = F - (U - x) + (S - x), mt[3] = U, R = -J, P = -p, L = f * R, B = j * f, M = B - (B - f), N = f - M, B = j * R, D = B - (B - R), C = R - D, q = N * C - (L - M * D - N * D - M * C), Y = G * P, B = j * G, M = B - (B - G), N = G - M, B = j * P, D = B - (B - P), C = P - D, X = N * C - (Y - M * D - N * D - M * C), S = q + X, x = S - q, wt[0] = q - (S - x) + (X - x), F = L + S, x = F - L, $ = L - (F - x) + (S - x), S = $ + Y, x = S - $, wt[1] = $ - (S - x) + (Y - x), U = F + S, x = U - F, wt[2] = F - (U - x) + (S - x), wt[3] = U, k = ht(4, mt, 4, wt, ce), L = h * w, B = j * h, M = B - (B - h), N = h - M, B = j * w, D = B - (B - w), C = w - D, q = N * C - (L - M * D - N * D - M * C), Y = f * p, B = j * f, M = B - (B - f), N = f - M, B = j * p, D = B - (B - p), C = p - D, X = N * C - (Y - M * D - N * D - M * C), S = q - X, x = q - S, Xt[0] = q - (S + x) + (x - X), F = L + S, x = F - L, $ = L - (F - x) + (S - x), S = $ - Y, x = $ - S, Xt[1] = $ - (S + x) + (x - Y), U = F + S, x = U - F, Xt[2] = F - (U - x) + (S - x), Xt[3] = U, T = 4) : (ce[0] = 0, k = 1, Xt[0] = 0, T = 1), u !== 0) {
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
      ), vt), p !== 0 && (l = ft(l, V(V(4, _t, u, K), K, p, Z), Z)), w !== 0 && (l = ft(l, V(V(4, Et, -u, K), K, w, Z), Z));
    }
    if (y !== 0) {
      const st = V(k, ce, y, rt);
      l = ft(l, ht(
        V(m, Ae, y, Z),
        Z,
        V(st, rt, 2 * Q, et),
        et,
        ut
      ), ut);
      const ot = V(T, Xt, y, K);
      l = ft(l, Mt(
        V(ot, K, 2 * Q, Z),
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
  if (h !== 0 || p !== 0) {
    if (f !== 0 || w !== 0 || u !== 0 || y !== 0 ? (L = f * Q, B = j * f, M = B - (B - f), N = f - M, B = j * Q, D = B - (B - Q), C = Q - D, q = N * C - (L - M * D - N * D - M * C), Y = G * y, B = j * G, M = B - (B - G), N = G - M, B = j * y, D = B - (B - y), C = y - D, X = N * C - (Y - M * D - N * D - M * C), S = q + X, x = S - q, mt[0] = q - (S - x) + (X - x), F = L + S, x = F - L, $ = L - (F - x) + (S - x), S = $ + Y, x = S - $, mt[1] = $ - (S - x) + (Y - x), U = F + S, x = U - F, mt[2] = F - (U - x) + (S - x), mt[3] = U, R = -H, P = -w, L = u * R, B = j * u, M = B - (B - u), N = u - M, B = j * R, D = B - (B - R), C = R - D, q = N * C - (L - M * D - N * D - M * C), Y = z * P, B = j * z, M = B - (B - z), N = z - M, B = j * P, D = B - (B - P), C = P - D, X = N * C - (Y - M * D - N * D - M * C), S = q + X, x = S - q, wt[0] = q - (S - x) + (X - x), F = L + S, x = F - L, $ = L - (F - x) + (S - x), S = $ + Y, x = S - $, wt[1] = $ - (S - x) + (Y - x), U = F + S, x = U - F, wt[2] = F - (U - x) + (S - x), wt[3] = U, v = ht(4, mt, 4, wt, oe), L = f * y, B = j * f, M = B - (B - f), N = f - M, B = j * y, D = B - (B - y), C = y - D, q = N * C - (L - M * D - N * D - M * C), Y = u * w, B = j * u, M = B - (B - u), N = u - M, B = j * w, D = B - (B - w), C = w - D, X = N * C - (Y - M * D - N * D - M * C), S = q - X, x = q - S, Ct[0] = q - (S + x) + (x - X), F = L + S, x = F - L, $ = L - (F - x) + (S - x), S = $ - Y, x = $ - S, Ct[1] = $ - (S + x) + (x - Y), U = F + S, x = U - F, Ct[2] = F - (U - x) + (S - x), Ct[3] = U, A = 4) : (oe[0] = 0, v = 1, Ct[0] = 0, A = 1), h !== 0) {
      const st = V(v, oe, h, rt);
      l = ft(l, ht(
        V(d, Ie, h, Z),
        Z,
        V(st, rt, 2 * W, et),
        et,
        ut
      ), ut);
      const ot = V(A, Ct, h, K);
      l = ft(l, Mt(
        V(ot, K, 2 * W, Z),
        Z,
        V(ot, K, h, it),
        it,
        V(st, rt, h, et),
        et,
        Dt,
        vt
      ), vt), w !== 0 && (l = ft(l, V(V(4, kt, h, K), K, w, Z), Z)), y !== 0 && (l = ft(l, V(V(4, _t, -h, K), K, y, Z), Z));
    }
    if (p !== 0) {
      const st = V(v, oe, p, rt);
      l = ft(l, ht(
        V(b, Be, p, Z),
        Z,
        V(st, rt, 2 * J, et),
        et,
        ut
      ), ut);
      const ot = V(A, Ct, p, K);
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
function pi(i, t, e, n, s, o, r, a) {
  const c = i - r, l = e - r, f = s - r, u = t - a, h = n - a, w = o - a, y = l * w, p = f * h, _ = c * c + u * u, I = f * u, g = c * w, m = l * l + h * h, d = c * h, b = l * u, v = f * f + w * w, E = _ * (y - p) + m * (I - g) + v * (d - b), k = (Math.abs(y) + Math.abs(p)) * _ + (Math.abs(I) + Math.abs(g)) * m + (Math.abs(d) + Math.abs(b)) * v, A = ui * k;
  return E > A || -E > A ? E : di(i, t, e, n, s, o, r, a, k);
}
function gi(i, t) {
  var e, n, s = 0, o, r, a, c, l, f, u, h = i[0], w = i[1], y = t.length;
  for (e = 0; e < y; e++) {
    n = 0;
    var p = t[e], _ = p.length - 1;
    if (f = p[0], f[0] !== p[_][0] && f[1] !== p[_][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (r = f[0] - h, a = f[1] - w, n; n < _; n++) {
      if (u = p[n + 1], c = u[0] - h, l = u[1] - w, a === 0 && l === 0) {
        if (c <= 0 && r >= 0 || r <= 0 && c >= 0)
          return 0;
      } else if (l >= 0 && a <= 0 || l <= 0 && a >= 0) {
        if (o = at(r, c, a, l, 0, 0), o === 0)
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
  const n = ri(i), s = si(t), o = s.type, r = t.bbox;
  let a = s.coordinates;
  if (r && mi(n, r) === !1)
    return !1;
  o === "Polygon" && (a = [a]);
  for (var c = 0; c < a.length; ++c) {
    const l = gi(n, a[c]);
    if (l === 0 && !e.ignoreBoundary) return !0;
    if (l) return !0;
  }
  return !1;
}
function mi(i, t) {
  return t[0] <= i[0] && t[1] <= i[1] && t[2] >= i[0] && t[3] >= i[1];
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
function wi(i, t) {
  return i < t ? -1 : i > t ? 1 : 0;
}
const yi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Le
}, Symbol.toStringTag, { value: "Module" })), Bt = 11102230246251565e-32, dt = 134217729, vi = (3 + 8 * Bt) * Bt;
function Oe(i, t, e, n, s) {
  let o, r, a, c, l = t[0], f = n[0], u = 0, h = 0;
  f > l == f > -l ? (o = l, l = t[++u]) : (o = f, f = n[++h]);
  let w = 0;
  if (u < i && h < e)
    for (f > l == f > -l ? (r = l + o, a = o - (r - l), l = t[++u]) : (r = f + o, a = o - (r - f), f = n[++h]), o = r, a !== 0 && (s[w++] = a); u < i && h < e; )
      f > l == f > -l ? (r = o + l, c = r - o, a = o - (r - c) + (l - c), l = t[++u]) : (r = o + f, c = r - o, a = o - (r - c) + (f - c), f = n[++h]), o = r, a !== 0 && (s[w++] = a);
  for (; u < i; )
    r = o + l, c = r - o, a = o - (r - c) + (l - c), l = t[++u], o = r, a !== 0 && (s[w++] = a);
  for (; h < e; )
    r = o + f, c = r - o, a = o - (r - c) + (f - c), f = n[++h], o = r, a !== 0 && (s[w++] = a);
  return (o !== 0 || w === 0) && (s[w++] = o), w;
}
function bi(i, t) {
  let e = t[0];
  for (let n = 1; n < i; n++) e += t[n];
  return e;
}
function se(i) {
  return new Float64Array(i);
}
const xi = (3 + 16 * Bt) * Bt, Si = (2 + 12 * Bt) * Bt, Mi = (9 + 64 * Bt) * Bt * Bt, qt = se(4), Qe = se(8), Ze = se(12), tn = se(16), yt = se(4);
function _i(i, t, e, n, s, o, r) {
  let a, c, l, f, u, h, w, y, p, _, I, g, m, d, b, v, E, k;
  const A = i - s, O = e - s, T = t - o, R = n - o;
  d = A * R, h = dt * A, w = h - (h - A), y = A - w, h = dt * R, p = h - (h - R), _ = R - p, b = y * _ - (d - w * p - y * p - w * _), v = T * O, h = dt * T, w = h - (h - T), y = T - w, h = dt * O, p = h - (h - O), _ = O - p, E = y * _ - (v - w * p - y * p - w * _), I = b - E, u = b - I, qt[0] = b - (I + u) + (u - E), g = d + I, u = g - d, m = d - (g - u) + (I - u), I = m - v, u = m - I, qt[1] = m - (I + u) + (u - v), k = g + I, u = k - g, qt[2] = g - (k - u) + (I - u), qt[3] = k;
  let P = bi(4, qt), x = Si * r;
  if (P >= x || -P >= x || (u = i - A, a = i - (A + u) + (u - s), u = e - O, l = e - (O + u) + (u - s), u = t - T, c = t - (T + u) + (u - o), u = n - R, f = n - (R + u) + (u - o), a === 0 && c === 0 && l === 0 && f === 0) || (x = Mi * r + vi * Math.abs(P), P += A * f + R * a - (T * l + O * c), P >= x || -P >= x)) return P;
  d = a * R, h = dt * a, w = h - (h - a), y = a - w, h = dt * R, p = h - (h - R), _ = R - p, b = y * _ - (d - w * p - y * p - w * _), v = c * O, h = dt * c, w = h - (h - c), y = c - w, h = dt * O, p = h - (h - O), _ = O - p, E = y * _ - (v - w * p - y * p - w * _), I = b - E, u = b - I, yt[0] = b - (I + u) + (u - E), g = d + I, u = g - d, m = d - (g - u) + (I - u), I = m - v, u = m - I, yt[1] = m - (I + u) + (u - v), k = g + I, u = k - g, yt[2] = g - (k - u) + (I - u), yt[3] = k;
  const B = Oe(4, qt, 4, yt, Qe);
  d = A * f, h = dt * A, w = h - (h - A), y = A - w, h = dt * f, p = h - (h - f), _ = f - p, b = y * _ - (d - w * p - y * p - w * _), v = T * l, h = dt * T, w = h - (h - T), y = T - w, h = dt * l, p = h - (h - l), _ = l - p, E = y * _ - (v - w * p - y * p - w * _), I = b - E, u = b - I, yt[0] = b - (I + u) + (u - E), g = d + I, u = g - d, m = d - (g - u) + (I - u), I = m - v, u = m - I, yt[1] = m - (I + u) + (u - v), k = g + I, u = k - g, yt[2] = g - (k - u) + (I - u), yt[3] = k;
  const M = Oe(B, Qe, 4, yt, Ze);
  d = a * f, h = dt * a, w = h - (h - a), y = a - w, h = dt * f, p = h - (h - f), _ = f - p, b = y * _ - (d - w * p - y * p - w * _), v = c * l, h = dt * c, w = h - (h - c), y = c - w, h = dt * l, p = h - (h - l), _ = l - p, E = y * _ - (v - w * p - y * p - w * _), I = b - E, u = b - I, yt[0] = b - (I + u) + (u - E), g = d + I, u = g - d, m = d - (g - u) + (I - u), I = m - v, u = m - I, yt[1] = m - (I + u) + (u - v), k = g + I, u = k - g, yt[2] = g - (k - u) + (I - u), yt[3] = k;
  const N = Oe(M, Ze, 4, yt, tn);
  return tn[N - 1];
}
function en(i, t, e, n, s, o) {
  const r = (t - o) * (e - s), a = (i - s) * (n - o), c = r - a;
  if (r === 0 || a === 0 || r > 0 != a > 0) return c;
  const l = Math.abs(r + a);
  return Math.abs(c) >= xi * l ? c : -_i(i, t, e, n, s, o, l);
}
function ki(i, t) {
  const e = new Le([], Yn);
  return Ai(i, e), Ii(e, t);
}
function Yn(i, t) {
  return i.p.x > t.p.x ? 1 : i.p.x < t.p.x || i.p.x === t.p.x && (i.featureId !== t.featureId || i.ringId !== t.ringId) && i.isLeftEndpoint && !t.isLeftEndpoint ? -1 : i.p.y !== t.p.y ? i.p.y > t.p.y ? 1 : -1 : 1;
}
function Ei(i, t) {
  return i.rightSweepEvent.p.x > t.rightSweepEvent.p.x ? 1 : i.rightSweepEvent.p.x < t.rightSweepEvent.p.x ? -1 : i.rightSweepEvent.p.y !== t.rightSweepEvent.p.y ? i.rightSweepEvent.p.y < t.rightSweepEvent.p.y ? 1 : -1 : 1;
}
function Ai(i, t) {
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
function Ii(i, t = !1) {
  const e = [], n = new Le([], Ei);
  for (; i.length; ) {
    const s = i.pop();
    if (s.isLeftEndpoint) {
      const o = new Bi(s);
      for (let r = 0; r < n.data.length; r++) {
        const a = n.data[r];
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
  constructor(i) {
    this.leftSweepEvent = i, this.rightSweepEvent = i.otherEvent;
  }
};
function Ti(i, t) {
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
  const h = (l - a) * (s - e) - (c - r) * (o - n), w = (c - r) * (n - a) - (l - a) * (e - r), y = (s - e) * (n - a) - (o - n) * (e - r);
  if (h === 0)
    return !1;
  const p = w / h, _ = y / h;
  if (p >= 0 && p <= 1 && _ >= 0 && _ <= 1) {
    const I = e + p * (s - e), g = n + p * (o - n);
    return [I, g];
  }
  return !1;
}
function Oi(i, t, e = {}) {
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
function Ni(i) {
  return i && i.__esModule && Object.prototype.hasOwnProperty.call(i, "default") ? i.default : i;
}
function Fi(i) {
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
function Di(i, t = {}) {
  let e = 0, n = 0, s = 0;
  return Xe(
    i,
    function(o) {
      e += o[0], n += o[1], s++;
    },
    !0
  ), Yt([e / s, n / s], t.properties);
}
var he = { exports: {} }, ye = { exports: {} }, Pi = ye.exports, sn;
function Ri() {
  return sn || (sn = 1, (function(i, t) {
    (function(e, n) {
      i.exports = n();
    })(Pi, function() {
      function e(g, m, d, b, v) {
        (function E(k, A, O, T, R) {
          for (; T > O; ) {
            if (T - O > 600) {
              var P = T - O + 1, x = A - O + 1, B = Math.log(P), M = 0.5 * Math.exp(2 * B / 3), N = 0.5 * Math.sqrt(B * M * (P - M) / P) * (x - P / 2 < 0 ? -1 : 1), D = Math.max(O, Math.floor(A - x * M / P + N)), C = Math.min(T, Math.floor(A + (P - x) * M / P + N));
              E(k, A, D, C, R);
            }
            var S = k[A], F = O, $ = T;
            for (n(k, O, A), R(k[T], S) > 0 && n(k, O, T); F < $; ) {
              for (n(k, F, $), F++, $--; R(k[F], S) < 0; ) F++;
              for (; R(k[$], S) > 0; ) $--;
            }
            R(k[O], S) === 0 ? n(k, O, $) : n(k, ++$, T), $ <= A && (O = $ + 1), A <= $ && (T = $ - 1);
          }
        })(g, m, d || 0, b || g.length - 1, v || s);
      }
      function n(g, m, d) {
        var b = g[m];
        g[m] = g[d], g[d] = b;
      }
      function s(g, m) {
        return g < m ? -1 : g > m ? 1 : 0;
      }
      var o = function(g) {
        g === void 0 && (g = 9), this._maxEntries = Math.max(4, g), this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries)), this.clear();
      };
      function r(g, m, d) {
        if (!d) return m.indexOf(g);
        for (var b = 0; b < m.length; b++) if (d(g, m[b])) return b;
        return -1;
      }
      function a(g, m) {
        c(g, 0, g.children.length, m, g);
      }
      function c(g, m, d, b, v) {
        v || (v = _(null)), v.minX = 1 / 0, v.minY = 1 / 0, v.maxX = -1 / 0, v.maxY = -1 / 0;
        for (var E = m; E < d; E++) {
          var k = g.children[E];
          l(v, g.leaf ? b(k) : k);
        }
        return v;
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
      function w(g) {
        return g.maxX - g.minX + (g.maxY - g.minY);
      }
      function y(g, m) {
        return g.minX <= m.minX && g.minY <= m.minY && m.maxX <= g.maxX && m.maxY <= g.maxY;
      }
      function p(g, m) {
        return m.minX <= g.maxX && m.minY <= g.maxY && m.maxX >= g.minX && m.maxY >= g.minY;
      }
      function _(g) {
        return { children: g, height: 1, leaf: !0, minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
      }
      function I(g, m, d, b, v) {
        for (var E = [m, d]; E.length; ) if (!((d = E.pop()) - (m = E.pop()) <= b)) {
          var k = m + Math.ceil((d - m) / b / 2) * b;
          e(g, k, m, d, v), E.push(m, k, k, d);
        }
      }
      return o.prototype.all = function() {
        return this._all(this.data, []);
      }, o.prototype.search = function(g) {
        var m = this.data, d = [];
        if (!p(g, m)) return d;
        for (var b = this.toBBox, v = []; m; ) {
          for (var E = 0; E < m.children.length; E++) {
            var k = m.children[E], A = m.leaf ? b(k) : k;
            p(g, A) && (m.leaf ? d.push(k) : y(g, A) ? this._all(k, d) : v.push(k));
          }
          m = v.pop();
        }
        return d;
      }, o.prototype.collides = function(g) {
        var m = this.data;
        if (!p(g, m)) return !1;
        for (var d = []; m; ) {
          for (var b = 0; b < m.children.length; b++) {
            var v = m.children[b], E = m.leaf ? this.toBBox(v) : v;
            if (p(g, E)) {
              if (m.leaf || y(g, E)) return !0;
              d.push(v);
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
            var b = this.data;
            this.data = d, d = b;
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
        for (var d, b, v, E = this.data, k = this.toBBox(g), A = [], O = []; E || A.length; ) {
          if (E || (E = A.pop(), b = A[A.length - 1], d = O.pop(), v = !0), E.leaf) {
            var T = r(g, E.children, m);
            if (T !== -1) return E.children.splice(T, 1), A.push(E), this._condense(A), this;
          }
          v || E.leaf || !y(E, k) ? b ? (d++, E = b.children[d], v = !1) : E = null : (A.push(E), O.push(d), d = 0, b = E, E = E.children[0]);
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
      }, o.prototype._build = function(g, m, d, b) {
        var v, E = d - m + 1, k = this._maxEntries;
        if (E <= k) return a(v = _(g.slice(m, d + 1)), this.toBBox), v;
        b || (b = Math.ceil(Math.log(E) / Math.log(k)), k = Math.ceil(E / Math.pow(k, b - 1))), (v = _([])).leaf = !1, v.height = b;
        var A = Math.ceil(E / k), O = A * Math.ceil(Math.sqrt(k));
        I(g, m, d, O, this.compareMinX);
        for (var T = m; T <= d; T += O) {
          var R = Math.min(T + O - 1, d);
          I(g, T, R, A, this.compareMinY);
          for (var P = T; P <= R; P += A) {
            var x = Math.min(P + A - 1, R);
            v.children.push(this._build(g, P, x, b - 1));
          }
        }
        return a(v, this.toBBox), v;
      }, o.prototype._chooseSubtree = function(g, m, d, b) {
        for (; b.push(m), !m.leaf && b.length - 1 !== d; ) {
          for (var v = 1 / 0, E = 1 / 0, k = void 0, A = 0; A < m.children.length; A++) {
            var O = m.children[A], T = h(O), R = (P = g, x = O, (Math.max(x.maxX, P.maxX) - Math.min(x.minX, P.minX)) * (Math.max(x.maxY, P.maxY) - Math.min(x.minY, P.minY)) - T);
            R < E ? (E = R, v = T < v ? T : v, k = O) : R === E && T < v && (v = T, k = O);
          }
          m = k || m.children[0];
        }
        var P, x;
        return m;
      }, o.prototype._insert = function(g, m, d) {
        var b = d ? g : this.toBBox(g), v = [], E = this._chooseSubtree(b, this.data, m, v);
        for (E.children.push(g), l(E, b); m >= 0 && v[m].children.length > this._maxEntries; ) this._split(v, m), m--;
        this._adjustParentBBoxes(b, v, m);
      }, o.prototype._split = function(g, m) {
        var d = g[m], b = d.children.length, v = this._minEntries;
        this._chooseSplitAxis(d, v, b);
        var E = this._chooseSplitIndex(d, v, b), k = _(d.children.splice(E, d.children.length - E));
        k.height = d.height, k.leaf = d.leaf, a(d, this.toBBox), a(k, this.toBBox), m ? g[m - 1].children.push(k) : this._splitRoot(d, k);
      }, o.prototype._splitRoot = function(g, m) {
        this.data = _([g, m]), this.data.height = g.height + 1, this.data.leaf = !1, a(this.data, this.toBBox);
      }, o.prototype._chooseSplitIndex = function(g, m, d) {
        for (var b, v, E, k, A, O, T, R = 1 / 0, P = 1 / 0, x = m; x <= d - m; x++) {
          var B = c(g, 0, x, this.toBBox), M = c(g, x, d, this.toBBox), N = (v = B, E = M, k = void 0, A = void 0, O = void 0, T = void 0, k = Math.max(v.minX, E.minX), A = Math.max(v.minY, E.minY), O = Math.min(v.maxX, E.maxX), T = Math.min(v.maxY, E.maxY), Math.max(0, O - k) * Math.max(0, T - A)), D = h(B) + h(M);
          N < R ? (R = N, b = x, P = D < P ? D : P) : N === R && D < P && (P = D, b = x);
        }
        return b || d - m;
      }, o.prototype._chooseSplitAxis = function(g, m, d) {
        var b = g.leaf ? this.compareMinX : f, v = g.leaf ? this.compareMinY : u;
        this._allDistMargin(g, m, d, b) < this._allDistMargin(g, m, d, v) && g.children.sort(b);
      }, o.prototype._allDistMargin = function(g, m, d, b) {
        g.children.sort(b);
        for (var v = this.toBBox, E = c(g, 0, m, v), k = c(g, d - m, d, v), A = w(E) + w(k), O = m; O < d - m; O++) {
          var T = g.children[O];
          l(E, g.leaf ? v(T) : T), A += w(E);
        }
        for (var R = d - m - 1; R >= m; R--) {
          var P = g.children[R];
          l(k, g.leaf ? v(P) : P), A += w(k);
        }
        return A;
      }, o.prototype._adjustParentBBoxes = function(g, m, d) {
        for (var b = d; b >= 0; b--) l(m[b], g);
      }, o.prototype._condense = function(g) {
        for (var m = g.length - 1, d = void 0; m >= 0; m--) g[m].children.length === 0 ? m > 0 ? (d = g[m - 1].children).splice(d.indexOf(g[m]), 1) : this.clear() : a(g[m], this.toBBox);
      }, o;
    });
  })(ye)), ye.exports;
}
const Ci = /* @__PURE__ */ Fi(yi);
var Wt = { exports: {} }, Ne, on;
function $i() {
  return on || (on = 1, Ne = function(t, e, n, s) {
    var o = t[0], r = t[1], a = !1;
    n === void 0 && (n = 0), s === void 0 && (s = e.length);
    for (var c = (s - n) / 2, l = 0, f = c - 1; l < c; f = l++) {
      var u = e[n + l * 2 + 0], h = e[n + l * 2 + 1], w = e[n + f * 2 + 0], y = e[n + f * 2 + 1], p = h > r != y > r && o < (w - u) * (r - h) / (y - h) + u;
      p && (a = !a);
    }
    return a;
  }), Ne;
}
var Fe, an;
function Xi() {
  return an || (an = 1, Fe = function(t, e, n, s) {
    var o = t[0], r = t[1], a = !1;
    n === void 0 && (n = 0), s === void 0 && (s = e.length);
    for (var c = s - n, l = 0, f = c - 1; l < c; f = l++) {
      var u = e[l + n][0], h = e[l + n][1], w = e[f + n][0], y = e[f + n][1], p = h > r != y > r && o < (w - u) * (r - h) / (y - h) + u;
      p && (a = !a);
    }
    return a;
  }), Fe;
}
var cn;
function Li() {
  if (cn) return Wt.exports;
  cn = 1;
  var i = $i(), t = Xi();
  return Wt.exports = function(n, s, o, r) {
    return s.length > 0 && Array.isArray(s[0]) ? t(n, s, o, r) : i(n, s, o, r);
  }, Wt.exports.nested = t, Wt.exports.flat = i, Wt.exports;
}
var Jt = { exports: {} }, Yi = Jt.exports, ln;
function Ui() {
  return ln || (ln = 1, (function(i, t) {
    (function(e, n) {
      n(t);
    })(Yi, function(e) {
      const s = 33306690738754706e-32;
      function o(p, _, I, g, m) {
        let d, b, v, E, k = _[0], A = g[0], O = 0, T = 0;
        A > k == A > -k ? (d = k, k = _[++O]) : (d = A, A = g[++T]);
        let R = 0;
        if (O < p && T < I) for (A > k == A > -k ? (v = d - ((b = k + d) - k), k = _[++O]) : (v = d - ((b = A + d) - A), A = g[++T]), d = b, v !== 0 && (m[R++] = v); O < p && T < I; ) A > k == A > -k ? (v = d - ((b = d + k) - (E = b - d)) + (k - E), k = _[++O]) : (v = d - ((b = d + A) - (E = b - d)) + (A - E), A = g[++T]), d = b, v !== 0 && (m[R++] = v);
        for (; O < p; ) v = d - ((b = d + k) - (E = b - d)) + (k - E), k = _[++O], d = b, v !== 0 && (m[R++] = v);
        for (; T < I; ) v = d - ((b = d + A) - (E = b - d)) + (A - E), A = g[++T], d = b, v !== 0 && (m[R++] = v);
        return d === 0 && R !== 0 || (m[R++] = d), R;
      }
      function r(p) {
        return new Float64Array(p);
      }
      const a = 33306690738754716e-32, c = 22204460492503146e-32, l = 11093356479670487e-47, f = r(4), u = r(8), h = r(12), w = r(16), y = r(4);
      e.orient2d = function(p, _, I, g, m, d) {
        const b = (_ - d) * (I - m), v = (p - m) * (g - d), E = b - v;
        if (b === 0 || v === 0 || b > 0 != v > 0) return E;
        const k = Math.abs(b + v);
        return Math.abs(E) >= a * k ? E : -(function(A, O, T, R, P, x, B) {
          let M, N, D, C, S, F, $, L, q, Y, X, U, G, z, W, H, Q, J;
          const ct = A - P, lt = T - P, st = O - x, ot = R - x;
          S = (W = (L = ct - ($ = (F = 134217729 * ct) - (F - ct))) * (Y = ot - (q = (F = 134217729 * ot) - (F - ot))) - ((z = ct * ot) - $ * q - L * q - $ * Y)) - (X = W - (Q = (L = st - ($ = (F = 134217729 * st) - (F - st))) * (Y = lt - (q = (F = 134217729 * lt) - (F - lt))) - ((H = st * lt) - $ * q - L * q - $ * Y))), f[0] = W - (X + S) + (S - Q), S = (G = z - ((U = z + X) - (S = U - z)) + (X - S)) - (X = G - H), f[1] = G - (X + S) + (S - H), S = (J = U + X) - U, f[2] = U - (J - S) + (X - S), f[3] = J;
          let Tt = (function(Zn, qe) {
            let Ve = qe[0];
            for (let Se = 1; Se < Zn; Se++) Ve += qe[Se];
            return Ve;
          })(4, f), Kt = c * B;
          if (Tt >= Kt || -Tt >= Kt || (M = A - (ct + (S = A - ct)) + (S - P), D = T - (lt + (S = T - lt)) + (S - P), N = O - (st + (S = O - st)) + (S - x), C = R - (ot + (S = R - ot)) + (S - x), M === 0 && N === 0 && D === 0 && C === 0) || (Kt = l * B + s * Math.abs(Tt), (Tt += ct * C + ot * M - (st * D + lt * N)) >= Kt || -Tt >= Kt)) return Tt;
          S = (W = (L = M - ($ = (F = 134217729 * M) - (F - M))) * (Y = ot - (q = (F = 134217729 * ot) - (F - ot))) - ((z = M * ot) - $ * q - L * q - $ * Y)) - (X = W - (Q = (L = N - ($ = (F = 134217729 * N) - (F - N))) * (Y = lt - (q = (F = 134217729 * lt) - (F - lt))) - ((H = N * lt) - $ * q - L * q - $ * Y))), y[0] = W - (X + S) + (S - Q), S = (G = z - ((U = z + X) - (S = U - z)) + (X - S)) - (X = G - H), y[1] = G - (X + S) + (S - H), S = (J = U + X) - U, y[2] = U - (J - S) + (X - S), y[3] = J;
          const Hn = o(4, f, 4, y, u);
          S = (W = (L = ct - ($ = (F = 134217729 * ct) - (F - ct))) * (Y = C - (q = (F = 134217729 * C) - (F - C))) - ((z = ct * C) - $ * q - L * q - $ * Y)) - (X = W - (Q = (L = st - ($ = (F = 134217729 * st) - (F - st))) * (Y = D - (q = (F = 134217729 * D) - (F - D))) - ((H = st * D) - $ * q - L * q - $ * Y))), y[0] = W - (X + S) + (S - Q), S = (G = z - ((U = z + X) - (S = U - z)) + (X - S)) - (X = G - H), y[1] = G - (X + S) + (S - H), S = (J = U + X) - U, y[2] = U - (J - S) + (X - S), y[3] = J;
          const Jn = o(Hn, u, 4, y, h);
          S = (W = (L = M - ($ = (F = 134217729 * M) - (F - M))) * (Y = C - (q = (F = 134217729 * C) - (F - C))) - ((z = M * C) - $ * q - L * q - $ * Y)) - (X = W - (Q = (L = N - ($ = (F = 134217729 * N) - (F - N))) * (Y = D - (q = (F = 134217729 * D) - (F - D))) - ((H = N * D) - $ * q - L * q - $ * Y))), y[0] = W - (X + S) + (S - Q), S = (G = z - ((U = z + X) - (S = U - z)) + (X - S)) - (X = G - H), y[1] = G - (X + S) + (S - H), S = (J = U + X) - U, y[2] = U - (J - S) + (X - S), y[3] = J;
          const Qn = o(Jn, h, 4, y, w);
          return w[Qn - 1];
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
  var i = Ri(), t = Ci, e = Li(), n = Ui().orient2d;
  t.default && (t = t.default), he.exports = s, he.exports.default = s;
  function s(d, b, v) {
    b = Math.max(0, b === void 0 ? 2 : b), v = v || 0;
    var E = w(d), k = new i(16);
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
    for (var A = [], O = 0, T; O < E.length; O++) {
      var R = E[O];
      k.remove(R), T = y(R, T), A.push(T);
    }
    var P = new i(16);
    for (O = 0; O < A.length; O++) P.insert(h(A[O]));
    for (var x = b * b, B = v * v; A.length; ) {
      var M = A.shift(), N = M.p, D = M.next.p, C = p(N, D);
      if (!(C < B)) {
        var S = C / x;
        R = o(k, M.prev.p, N, D, M.next.next.p, S, P), R && Math.min(p(R, N), p(R, D)) <= S && (A.push(M), A.push(y(R, M)), k.remove(R), P.remove(M), P.insert(h(M)), P.insert(h(M.next)));
      }
    }
    M = T;
    var F = [];
    do
      F.push(M.p), M = M.next;
    while (M !== T);
    return F.push(M.p), F;
  }
  function o(d, b, v, E, k, A, O) {
    for (var T = new t([], r), R = d.data; R; ) {
      for (var P = 0; P < R.children.length; P++) {
        var x = R.children[P], B = R.leaf ? _(x, v, E) : a(v, E, x);
        B > A || T.push({
          node: x,
          dist: B
        });
      }
      for (; T.length && !T.peek().node.children; ) {
        var M = T.pop(), N = M.node, D = _(N, b, v), C = _(N, E, k);
        if (M.dist < D && M.dist < C && l(v, N, O) && l(E, N, O)) return N;
      }
      R = T.pop(), R && (R = R.node);
    }
    return null;
  }
  function r(d, b) {
    return d.dist - b.dist;
  }
  function a(d, b, v) {
    if (c(d, v) || c(b, v)) return 0;
    var E = I(d[0], d[1], b[0], b[1], v.minX, v.minY, v.maxX, v.minY);
    if (E === 0) return 0;
    var k = I(d[0], d[1], b[0], b[1], v.minX, v.minY, v.minX, v.maxY);
    if (k === 0) return 0;
    var A = I(d[0], d[1], b[0], b[1], v.maxX, v.minY, v.maxX, v.maxY);
    if (A === 0) return 0;
    var O = I(d[0], d[1], b[0], b[1], v.minX, v.maxY, v.maxX, v.maxY);
    return O === 0 ? 0 : Math.min(E, k, A, O);
  }
  function c(d, b) {
    return d[0] >= b.minX && d[0] <= b.maxX && d[1] >= b.minY && d[1] <= b.maxY;
  }
  function l(d, b, v) {
    for (var E = Math.min(d[0], b[0]), k = Math.min(d[1], b[1]), A = Math.max(d[0], b[0]), O = Math.max(d[1], b[1]), T = v.search({ minX: E, minY: k, maxX: A, maxY: O }), R = 0; R < T.length; R++)
      if (u(T[R].p, T[R].next.p, d, b)) return !1;
    return !0;
  }
  function f(d, b, v) {
    return n(d[0], d[1], b[0], b[1], v[0], v[1]);
  }
  function u(d, b, v, E) {
    return d !== E && b !== v && f(d, b, v) > 0 != f(d, b, E) > 0 && f(v, E, d) > 0 != f(v, E, b) > 0;
  }
  function h(d) {
    var b = d.p, v = d.next.p;
    return d.minX = Math.min(b[0], v[0]), d.minY = Math.min(b[1], v[1]), d.maxX = Math.max(b[0], v[0]), d.maxY = Math.max(b[1], v[1]), d;
  }
  function w(d) {
    for (var b = d[0], v = d[0], E = d[0], k = d[0], A = 0; A < d.length; A++) {
      var O = d[A];
      O[0] < b[0] && (b = O), O[0] > E[0] && (E = O), O[1] < v[1] && (v = O), O[1] > k[1] && (k = O);
    }
    var T = [b, v, E, k], R = T.slice();
    for (A = 0; A < d.length; A++)
      e(d[A], T) || R.push(d[A]);
    return m(R);
  }
  function y(d, b) {
    var v = {
      p: d,
      prev: null,
      next: null,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };
    return b ? (v.next = b.next, v.prev = b, b.next.prev = v, b.next = v) : (v.prev = v, v.next = v), v;
  }
  function p(d, b) {
    var v = d[0] - b[0], E = d[1] - b[1];
    return v * v + E * E;
  }
  function _(d, b, v) {
    var E = b[0], k = b[1], A = v[0] - E, O = v[1] - k;
    if (A !== 0 || O !== 0) {
      var T = ((d[0] - E) * A + (d[1] - k) * O) / (A * A + O * O);
      T > 1 ? (E = v[0], k = v[1]) : T > 0 && (E += A * T, k += O * T);
    }
    return A = d[0] - E, O = d[1] - k, A * A + O * O;
  }
  function I(d, b, v, E, k, A, O, T) {
    var R = v - d, P = E - b, x = O - k, B = T - A, M = d - k, N = b - A, D = R * R + P * P, C = R * x + P * B, S = x * x + B * B, F = R * M + P * N, $ = x * M + B * N, L = D * S - C * C, q, Y, X, U, G = L, z = L;
    L === 0 ? (Y = 0, G = 1, U = $, z = S) : (Y = C * $ - S * F, U = D * $ - C * F, Y < 0 ? (Y = 0, U = $, z = S) : Y > G && (Y = G, U = $ + C, z = S)), U < 0 ? (U = 0, -F < 0 ? Y = 0 : -F > D ? Y = G : (Y = -F, G = D)) : U > z && (U = z, -F + C < 0 ? Y = 0 : -F + C > D ? Y = G : (Y = -F + C, G = D)), q = Y === 0 ? 0 : Y / G, X = U === 0 ? 0 : U / z;
    var W = (1 - q) * d + q * v, H = (1 - q) * b + q * E, Q = (1 - X) * k + X * O, J = (1 - X) * A + X * T, ct = Q - W, lt = J - H;
    return ct * ct + lt * lt;
  }
  function g(d, b) {
    return d[0] === b[0] ? d[1] - b[1] : d[0] - b[0];
  }
  function m(d) {
    d.sort(g);
    for (var b = [], v = 0; v < d.length; v++) {
      for (; b.length >= 2 && f(b[b.length - 2], b[b.length - 1], d[v]) <= 0; )
        b.pop();
      b.push(d[v]);
    }
    for (var E = [], k = d.length - 1; k >= 0; k--) {
      for (; E.length >= 2 && f(E[E.length - 2], E[E.length - 1], d[k]) <= 0; )
        E.pop();
      E.push(d[k]);
    }
    return E.pop(), b.pop(), b.concat(E);
  }
  return he.exports;
}
var Vi = qi();
const ji = /* @__PURE__ */ Ni(Vi);
function fn(i, t = {}) {
  t.concavity = t.concavity || 1 / 0;
  const e = [];
  if (Xe(i, (s) => {
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
      const O = t[2 * A], T = t[2 * A + 1];
      O < a && (a = O), T < c && (c = T), O > l && (l = O), T > f && (f = T), this._ids[A] = A;
    }
    const u = (a + l) / 2, h = (c + f) / 2;
    let w = 0, y = 0, p = 0;
    for (let A = 0, O = 1 / 0; A < r; A++) {
      const T = De(u, h, t[2 * A], t[2 * A + 1]);
      T < O && (w = A, O = T);
    }
    const _ = t[2 * w], I = t[2 * w + 1];
    for (let A = 0, O = 1 / 0; A < r; A++) {
      if (A === w) continue;
      const T = De(_, I, t[2 * A], t[2 * A + 1]);
      T < O && T > 0 && (y = A, O = T);
    }
    let g = t[2 * y], m = t[2 * y + 1], d = 1 / 0;
    for (let A = 0; A < r; A++) {
      if (A === w || A === y) continue;
      const O = Ki(_, I, g, m, t[2 * A], t[2 * A + 1]);
      O < d && (p = A, d = O);
    }
    let b = t[2 * p], v = t[2 * p + 1];
    if (d === 1 / 0) {
      for (let T = 0; T < r; T++)
        this._dists[T] = t[2 * T] - t[0] || t[2 * T + 1] - t[1];
      zt(this._ids, this._dists, 0, r - 1);
      const A = new Uint32Array(r);
      let O = 0;
      for (let T = 0, R = -1 / 0; T < r; T++) {
        const P = this._ids[T], x = this._dists[P];
        x > R && (A[O++] = P, R = x);
      }
      this.hull = A.subarray(0, O), this.triangles = new Uint32Array(0), this.halfedges = new Int32Array(0);
      return;
    }
    if (at(_, I, g, m, b, v) < 0) {
      const A = y, O = g, T = m;
      y = p, g = b, m = v, p = A, b = O, v = T;
    }
    const E = Wi(_, I, g, m, b, v);
    this._cx = E.x, this._cy = E.y;
    for (let A = 0; A < r; A++)
      this._dists[A] = De(t[2 * A], t[2 * A + 1], E.x, E.y);
    zt(this._ids, this._dists, 0, r - 1), this._hullStart = w;
    let k = 3;
    n[w] = e[p] = y, n[y] = e[w] = p, n[p] = e[y] = w, s[w] = 0, s[y] = 1, s[p] = 2, o.fill(-1), o[this._hashKey(_, I)] = w, o[this._hashKey(g, m)] = y, o[this._hashKey(b, v)] = p, this.trianglesLen = 0, this._addTriangle(w, y, p, -1, -1, -1);
    for (let A = 0, O = 0, T = 0; A < this._ids.length; A++) {
      const R = this._ids[A], P = t[2 * R], x = t[2 * R + 1];
      if (A > 0 && Math.abs(P - O) <= hn && Math.abs(x - T) <= hn || (O = P, T = x, R === w || R === y || R === p)) continue;
      let B = 0;
      for (let S = 0, F = this._hashKey(P, x); S < this._hashSize && (B = o[(F + S) % this._hashSize], !(B !== -1 && B !== n[B])); S++)
        ;
      B = e[B];
      let M = B, N;
      for (; N = n[M], at(P, x, t[2 * M], t[2 * M + 1], t[2 * N], t[2 * N + 1]) >= 0; )
        if (M = N, M === B) {
          M = -1;
          break;
        }
      if (M === -1) continue;
      let D = this._addTriangle(M, R, n[M], -1, -1, s[M]);
      s[R] = this._legalize(D + 2), s[M] = D, k++;
      let C = n[M];
      for (; N = n[C], at(P, x, t[2 * C], t[2 * C + 1], t[2 * N], t[2 * N + 1]) < 0; )
        D = this._addTriangle(C, R, N, s[R], -1, s[C]), s[R] = this._legalize(D + 2), n[C] = C, k--, C = N;
      if (M === B)
        for (; N = e[M], at(P, x, t[2 * N], t[2 * N + 1], t[2 * M], t[2 * M + 1]) < 0; )
          D = this._addTriangle(N, R, M, -1, s[M], s[N]), this._legalize(D + 2), s[N] = D, n[M] = M, k--, M = N;
      this._hullStart = e[R] = M, n[M] = e[C] = R, n[R] = C, o[this._hashKey(P, x)] = R, o[this._hashKey(t[2 * M], t[2 * M + 1])] = M;
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
    let o = 0, r = 0;
    for (; ; ) {
      const a = n[t], c = t - t % 3;
      if (r = c + (t + 2) % 3, a === -1) {
        if (o === 0) break;
        t = de[--o];
        continue;
      }
      const l = a - a % 3, f = c + (t + 1) % 3, u = l + (a + 2) % 3, h = e[r], w = e[t], y = e[f], p = e[u];
      if (Gi(
        s[2 * h],
        s[2 * h + 1],
        s[2 * w],
        s[2 * w + 1],
        s[2 * y],
        s[2 * y + 1],
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
function zi(i, t) {
  const e = i / (Math.abs(i) + Math.abs(t));
  return (t > 0 ? 3 - e : 1 + e) / 4;
}
function De(i, t, e, n) {
  const s = i - e, o = t - n;
  return s * s + o * o;
}
function Gi(i, t, e, n, s, o, r, a) {
  const c = i - r, l = t - a, f = e - r, u = n - a, h = s - r, w = o - a, y = c * c + l * l, p = f * f + u * u, _ = h * h + w * w;
  return c * (u * _ - p * w) - l * (f * _ - p * h) + y * (f * w - u * h) < 0;
}
function Ki(i, t, e, n, s, o) {
  const r = e - i, a = n - t, c = s - i, l = o - t, f = r * r + a * a, u = c * c + l * l, h = 0.5 / (r * l - a * c), w = (l * f - a * u) * h, y = (r * u - c * f) * h;
  return w * w + y * y;
}
function Wi(i, t, e, n, s, o) {
  const r = e - i, a = n - t, c = s - i, l = o - t, f = r * r + a * a, u = c * c + l * l, h = 0.5 / (r * l - a * c), w = i + (l * f - a * u) * h, y = t + (r * u - c * f) * h;
  return { x: w, y };
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
    Ht(i, s, o), t[i[e]] > t[i[n]] && Ht(i, e, n), t[i[o]] > t[i[n]] && Ht(i, o, n), t[i[e]] > t[i[o]] && Ht(i, e, o);
    const a = i[o], c = t[a];
    for (; ; ) {
      do
        o++;
      while (t[i[o]] < c);
      do
        r--;
      while (t[i[r]] > c);
      if (r < o) break;
      Ht(i, o, r);
    }
    i[e + 1] = i[r], i[r] = a, n - o + 1 >= r - e ? (zt(i, t, o, n), zt(i, t, e, r - 1)) : (zt(i, t, e, r - 1), zt(i, t, o, n));
  }
}
function Ht(i, t, e) {
  const n = i[t];
  i[t] = i[e], i[e] = n;
}
function Hi(i) {
  return i[0];
}
function Ji(i) {
  return i[1];
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
function At(i) {
  return i % 3 === 2 ? i - 2 : i + 1;
}
function St(i) {
  return i % 3 === 0 ? i + 2 : i - 1;
}
function pn(i, t, e, n, s, o, r, a) {
  const c = at(i, t, s, o, r, a), l = at(e, n, s, o, r, a);
  if (c > 0 && l > 0 || c < 0 && l < 0)
    return !1;
  const f = at(s, o, i, t, e, n), u = at(r, a, i, t, e, n);
  return f > 0 && u > 0 || f < 0 && u < 0 ? !1 : c === 0 && l === 0 && f === 0 && u === 0 ? !(Math.max(s, r) < Math.min(i, e) || Math.max(i, e) < Math.min(s, r) || Math.max(o, a) < Math.min(t, n) || Math.max(t, n) < Math.min(o, a)) : !0;
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
   * 全部の辺を調べる掃除（{@link delaunify} の最初の 1 回）が済んでいるか。済んだ後は、
   * 反転で触った辺（`flips` の印がある辺）だけを調べれば Delaunay 性が保たれる。
   * 掃除は制約を 1 本張るとき（`delaunify(true)`）にしか走らないので、制約を 1 本も張っていない網や、
   * 張った制約がすべて初めからある辺だった網は、まだ済んでいない。
   */
  cleaned = !1;
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
      consd: this.consd.copyBits(),
      cleaned: this.cleaned
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
    return e.vertMap.set(t.vertMap), e.flips.load(t.flips), e.consd.load(t.consd), e.cleaned = t.cleaned, e;
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
      const w = St(c), y = n[w];
      if (y === e)
        return this.protect(h), h;
      if (this.intersectSegments(t, e, y, u)) {
        c = w;
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
      const u = s[c], h = St(c), w = St(u), y = At(u);
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
        n[w]
      )) {
        if (f === -1 && (f = c), n[w] === e) {
          if (c === f)
            throw new Error("Infinite loop: non-convex quadrilateral");
          c = f, f = -1;
          continue;
        }
        if (this.intersectSegments(
          t,
          e,
          n[w],
          n[u]
        ))
          c = w;
        else if (this.intersectSegments(
          t,
          e,
          n[y],
          n[w]
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
        n[w]
      ) && (f === -1 && (f = h), f === h))
        throw new Error("Infinite loop: flipped diagonal still intersects");
      n[w] === e ? (l = w, c = f, f = -1) : this.intersectSegments(
        t,
        e,
        n[y],
        n[w]
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
   *
   * 最初の 1 回（`deep` で、まだ掃除が済んでいないとき）だけは、制約でない全部の辺を調べる。
   * Delaunator の外接円の判定は浮動小数点なので、厳密な述語での掃除を 1 回は通すため。
   * その後は、反転で触った辺（`flips` の印がある辺）だけを調べる。掃除の後に Delaunay でなくなりうるのは、
   * 反転で触った辺とその周りだけで、{@link flipDiagonal} はそこに印を付けるから、結果は変わらない。
   */
  delaunify(t = !1) {
    const { halfedges: e } = this.del, n = this.flips, s = this.consd, o = e.length;
    let r, a = !(t && this.cleaned);
    do {
      r = 0;
      for (let c = 0; c < o; c++) {
        if (s.has(c) || !a && !n.has(c))
          continue;
        n.delete(c);
        const l = e[c];
        l !== -1 && (n.delete(l), this.isDelaunay(c) || (this.flipDiagonal(c), r++));
      }
      a = !1;
    } while (t && r > 0);
    return t && (this.cleaned = !0), this;
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
    const { triangles: n, halfedges: s } = this.del, o = n.length / 3, r = (y, p, _) => {
      const I = t(p), g = t(_);
      return t(y).some((m) => I.includes(m) && g.includes(m));
    }, a = (y) => r(n[y * 3], n[y * 3 + 1], n[y * 3 + 2]), c = (y, p, _, I) => Math.sign(at(y[p * 2], y[p * 2 + 1], y[_ * 2], y[_ * 2 + 1], y[I * 2], y[I * 2 + 1])), l = e.map((y) => {
      let p = 0;
      for (let _ = 0; _ < o; _++) p += c(y, n[_ * 3], n[_ * 3 + 1], n[_ * 3 + 2]);
      return p < 0 ? -1 : 1;
    }), f = (y) => {
      if (this.consd.has(y)) return !1;
      const p = s[y];
      if (p === -1) return !1;
      const _ = n[y], I = n[At(y)], g = n[St(y)], m = n[St(p)];
      return e.every((d, b) => c(d, g, _, m) === l[b] && c(d, m, I, g) === l[b]);
    };
    let u = 0, h = !0;
    for (; h; ) {
      h = !1;
      for (let y = 0; y < o; y++)
        if (a(y))
          for (let p = 0; p < 3; p++) {
            const _ = y * 3 + p;
            if (!f(_)) continue;
            const I = s[_], g = n[_], m = n[At(_)], d = n[St(_)], b = n[St(I)];
            if (!(r(d, g, b) && r(b, m, d))) {
              this.protect(this.flipDiagonal(_)), u++, h = !0;
              break;
            }
          }
    }
    let w = 0;
    for (let y = 0; y < o; y++) a(y) && w++;
    return { flips: u, remaining: w };
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
    return at(
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
  return Re(i, t, e).tin;
}
function Re(i, t, e, n, s) {
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
    const p = n ? s?.snapshot ?? r.snapshot() : void 0, _ = (I) => {
      const g = te.restore(p);
      return g.constrainAll(I), g;
    };
    for (const I of n?.hull ?? [])
      try {
        r.constrainOne(I[0], I[1]), u.push(I);
      } catch {
        r = _(u);
      }
    n?.boundary && (f = tr(r, n.boundary), f || (r = _(u))), n && ({ remaining: l } = r.forbidGroupTriangles(
      n.groupsOf,
      n.planes
    ), l -= f?.size ?? 0), c = r.del;
  }
  const h = [];
  for (let p = 0; p < c.triangles.length; p += 3)
    f?.has(p / 3) || h.push([c.triangles[p], c.triangles[p + 1], c.triangles[p + 2]]);
  const w = ["a", "b", "c"];
  return { tin: xt(
    h.map((p) => {
      const _ = {}, I = p.map((g, m) => {
        const d = i.features[g], b = d.geometry.coordinates, v = [b[0], b[1]];
        return b.length === 3 ? v[2] = b[2] : _[w[m]] = d.properties[e], v;
      });
      return I[3] = I[0], re([I], _);
    })
  ), remaining: l, hasBoundary: f !== void 0, hull: u };
}
function tr(i, t) {
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
  const n = (c, l, f) => at(c.x, c.y, l.x, l.y, f.x, f.y), s = [...e].sort((c, l) => c.x - l.x || c.y - l.y), o = (c) => {
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
    const l = r[c], f = r[(c + 1) % r.length], u = f.x - l.x, h = f.y - l.y, w = u * u + h * h, y = e.filter((_) => _ !== l && _ !== f && n(l, f, _) === 0).map((_) => ({ r: _, t: ((_.x - l.x) * u + (_.y - l.y) * h) / w })).filter(({ t: _ }) => _ > 0 && _ < 1).sort((_, I) => _.t - I.t).map(({ r: _ }) => _), p = [l, ...y, f];
    for (let _ = 0; _ + 1 < p.length; _++) a.push([p[_].i, p[_ + 1].i]);
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
function mn(i, t) {
  const e = i.length, n = t.geometry.coordinates;
  return Array.from({ length: e }, (s, o) => o).map((s) => {
    const o = (s + 1) % e, r = i[s], a = i[o], c = r.geometry.coordinates, l = Math.atan2(
      c[0] - n[0],
      c[1] - n[1]
    ), f = [t, r, a, t].map(
      (w) => w.geometry.coordinates
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
const er = [0.1, 0.15, 0.225, 0.34, 0.5];
function nr(i, t) {
  return t ? i.hasBoundary !== t.hasBoundary ? i.hasBoundary : i.diagnostics.boundaryTriangleFlips < t.diagnostics.boundaryTriangleFlips : !0;
}
function wn(i, t, e) {
  return Math.sign(at(i[0], i[1], t[0], t[1], e[0], e[1]));
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
function vn(i, t, e, n, s, o = /* @__PURE__ */ new Set(), r) {
  const { minx: a, maxx: c, miny: l, maxy: f, centroid: u } = i, h = c - a, w = f - l, y = e.forw.length, p = Array.from({ length: y }, () => []);
  let _ = 1;
  for (const [E, k] of e.edges)
    E < n && p[E].push(_), p[k].push(_), k < n && _++;
  const I = (E) => E.slice(0, y).map(({ geometry: k }) => k.coordinates), g = gn(I(e.forw)), m = {
    forw: g.filter((E) => !o.has(ve(E))),
    bakw: gn(I(e.bakw))
  }, d = [0], b = (E) => E >= y ? d : p[E];
  let v;
  for (const E of er) {
    const k = r?.get(E) ?? { forwReuse: {} };
    r?.set(E, k);
    const A = k.vertices ?? (k.vertices = t(
      {
        ...i,
        minx: a - E * h,
        maxx: c + E * h,
        miny: l - E * w,
        maxy: f + E * w
      },
      !0
    ));
    if (s && (A.length < 4 || !A.every(({ bakw: Y }) => Y.every(Number.isFinite)))) continue;
    const O = A.map(
      ({ forw: Y, bakw: X }, U) => Vt(Y, X, `b${U}`)
    ), T = xt([...e.forw, ...O]), R = xt([
      ...e.bakw,
      ...O.map(jt)
    ]), P = [T, R].map(
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
    ]) : void 0, M = { groupsOf: b, planes: P, boundary: B, allowUnusableBoundary: s !== void 0 }, N = s?.orientation ?? -1, D = Re(
      T,
      e.edges,
      "target",
      { ...M, hull: m.forw },
      k.forwReuse
    ), C = k.geographic ?? (k.geographic = (() => {
      const Y = Re(R, e.edges, "target", {
        ...M,
        hull: m.bakw
      });
      return { built: Y, flips: be(Y.tin, N) };
    })()), S = C.built, F = D.tin, $ = {
      ...S.tin,
      features: [...S.tin.features]
    }, L = be(F, N) + C.flips, q = {
      vertices: A,
      forw: F,
      bakw: $,
      diagnostics: {
        margin: E,
        boundaryTriangleFlips: L,
        remainingForbiddenTriangles: D.remaining + S.remaining
      },
      hasMapBoundary: D.hasBoundary,
      hasBoundary: D.hasBoundary && S.hasBoundary,
      forwHull: { all: g, applied: D.hull }
    };
    if (s) {
      if (s.accept(q)) return q;
      continue;
    }
    if (L === 0 && q.hasBoundary)
      return q;
    nr(q, v) && (v = q);
  }
  return v;
}
const bn = 1e-9;
function ir(i, t) {
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
function Un(i) {
  let t = 1 / 0, e = 0, n = 0;
  return i.forEach((s) => {
    const { forw: o, bakw: r } = s, a = Math.hypot(o[0], o[1]), c = Math.hypot(r[0], r[1]);
    if (c === 0) return;
    const l = a / c, f = Math.atan2(o[0], o[1]) - Math.atan2(r[0], r[1]);
    t = Math.min(t, l), e += Math.cos(f), n += Math.sin(f);
  }), isFinite(t) ? [t, Math.atan2(n, e)] : [1, 0];
}
const rr = 0.6, sr = 3, or = 0.5;
function ar(i) {
  let t = 0, e = 0, n = 0, s = 0;
  if (i.forEach(({ forw: r, bakw: a }) => {
    t += r[1] * a[1] + r[0] * a[0], e += r[0] * a[1] - r[1] * a[0], n += a[0] * a[0] + a[1] * a[1], s += r[0] * r[0] + r[1] * r[1];
  }), !(!(n > 0 && s > 0) || !(Math.hypot(t, e) / Math.sqrt(s * n) >= or)))
    return [Math.hypot(t, e) / n, Math.atan2(e, t)];
}
function cr(i) {
  const t = (s) => Math.hypot(s.forw[0], s.forw[1]), e = Math.max(...i.map(t)), n = i.filter((s) => t(s) >= rr * e);
  return ar(n.length >= sr ? n : i) ?? Un(i);
}
function lr(i, t, e, n) {
  const { perQuad: s, aggregate: o } = ir(i, t), r = s.every((f) => f.length > 0), a = e === "birdeye" ? r ? s : [o] : [o], c = n === "farLsq" ? cr : Un, l = a.map((f) => c(f));
  return l.length === 1 ? [l[0], l[0], l[0], l[0]] : l;
}
function ur(i, t) {
  let e = 0;
  return i[0] > t[0] && (e += 1), i[1] > t[1] && (e += 2), e;
}
function fr(i, t, e) {
  const n = [
    i[0] - t.forw[0],
    i[1] - t.forw[1]
  ], o = Math.sqrt(n[0] ** 2 + n[1] ** 2) / e[0], r = Math.atan2(n[0], n[1]) - e[1];
  return [
    t.bakw[0] + o * Math.sin(r),
    t.bakw[1] - o * Math.cos(r)
  ];
}
function hr(i, t, e, n) {
  const s = t[0] - i[0], o = t[1] - i[1];
  if (Math.abs(s) < 1e-12 && Math.abs(o) < 1e-12) return null;
  const r = n[0] - e[0], a = n[1] - e[1], c = e[0] - i[0], l = e[1] - i[1], f = s * a - o * r;
  if (Math.abs(f) < 1e-12) return null;
  const u = (c * a - l * r) / f, h = (c * o - l * s) / f;
  return u <= 1e-10 || h < -1e-10 || h > 1 + 1e-10 ? null : { t: u, point: [i[0] + u * s, i[1] + u * o] };
}
function dr(i, t, e) {
  const n = e.length;
  let s = -1 / 0, o = null;
  for (let r = 0; r < n; r++) {
    const a = (r + 1) % n, c = hr(
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
  return Math.floor(Ce(i, t) / 10) % 36;
}
function Ce(i, t) {
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
function pr(i, t, e, n) {
  const s = i[0], o = i[1], r = t[0], a = t[1], c = e[0], l = e[1], f = n[0], u = n[1];
  if (!(Number.isFinite(s) && Number.isFinite(o) && Number.isFinite(r) && Number.isFinite(a) && Number.isFinite(c) && Number.isFinite(l) && Number.isFinite(f) && Number.isFinite(u)) || s === c || s === f || r === c || r === f || s === r && o === a || c === f && l === u) {
    const F = Oi(ze([i, t]), ze([e, n]));
    return F.features.length > 0 && F.features[0].geometry ? F.features[0].geometry.coordinates : null;
  }
  const h = s > r || s === r && o > a, w = h ? r : s, y = h ? a : o, p = h ? s : r, _ = h ? o : a, I = c > f || c === f && l > u, g = I ? f : c, m = I ? u : l, d = I ? c : f, b = I ? l : u;
  let v, E, k, A, O, T, R, P;
  if (w < g) {
    if (p < g) return null;
    v = g, E = m, k = d, A = b, O = w, T = y, R = p, P = _;
  } else {
    if (d < w) return null;
    v = w, E = y, k = p, A = _, O = g, T = m, R = d, P = b;
  }
  const x = at(v, E, k, A, O, T), B = at(v, E, k, A, R, P);
  if (x > 0 && B > 0 || x < 0 && B < 0) return null;
  const M = (P - T) * (k - v) - (R - O) * (A - E), N = (R - O) * (E - T) - (P - T) * (v - O), D = (k - v) * (E - T) - (A - E) * (v - O);
  if (M === 0) return null;
  const C = N / M, S = D / M;
  return C >= 0 && C <= 1 && S >= 0 && S <= 1 ? [v + C * (k - v), E + C * (A - E)] : null;
}
function Mn(i, t, e) {
  const n = i.length, s = new Array(n).fill(1);
  for (const o of t)
    for (let r = 0; r < n; r++) {
      const a = (r + 1) % n, c = pr(
        i[r].bakw,
        i[a].bakw,
        e.bakw,
        o.bakw
      );
      if (c) {
        const l = Math.sqrt(
          Math.pow(o.bakw[0] - e.bakw[0], 2) + Math.pow(o.bakw[1] - e.bakw[1], 2)
        ), f = Math.sqrt(
          Math.pow(c[0] - e.bakw[0], 2) + Math.pow(c[1] - e.bakw[1], 2)
        ), u = l / f;
        u > s[r] && (s[r] = u), u > s[a] && (s[a] = u);
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
  const { convexBuf: o, centroid: r, allGcps: a, minx: c, maxx: l, miny: f, maxy: u } = i, h = s ? void 0 : lr(o, r, t, n), y = [
    [c, f],
    [l, f],
    [l, u],
    [c, u]
  ].map((k) => ({
    forw: k,
    bakw: s ? s(k) : fr(
      k,
      r,
      h[ur(k, r.forw)]
    )
  }));
  if (y.sort(
    (k, A) => Math.atan2(k.forw[0] - r.forw[0], k.forw[1] - r.forw[1]) - Math.atan2(A.forw[0] - r.forw[0], A.forw[1] - r.forw[1])
  ), s || Mn(y, a, r), !e || i.ring?.cornersOnly) return y;
  const p = 4, _ = y.map(
    (k) => Math.atan2(k.forw[0] - r.forw[0], k.forw[1] - r.forw[1])
  ), I = y.map(
    (k) => Math.atan2(
      k.bakw[0] - r.bakw[0],
      -(k.bakw[1] - r.bakw[1])
    )
  );
  function g(k) {
    for (let A = 0; A < p; A++) {
      const O = (A + 1) % p, T = _[A], R = A < p - 1 ? _[O] : _[O] + 2 * Math.PI;
      let P = k;
      for (; P < T; ) P += 2 * Math.PI;
      for (; P >= T + 2 * Math.PI; ) P -= 2 * Math.PI;
      if (P >= T && P < R)
        return { i: A, j: O, frac: (P - T) / (R - T) };
    }
    return { i: 0, j: 1, frac: 0 };
  }
  function m(k) {
    const { i: A, j: O, frac: T } = g(k), R = I[A];
    let x = I[O] - R;
    for (; x > Math.PI; ) x -= 2 * Math.PI;
    for (; x < -Math.PI; ) x += 2 * Math.PI;
    return R + T * x;
  }
  const d = new Set(
    y.map(
      (k) => Math.floor(Ce(k.forw, r.forw) / 10) % 36
    )
  ), b = a.map((k) => ({
    forw: k.forw,
    bakw: k.bakw,
    angleDeg: Ce(k.forw, r.forw),
    forwDist: Math.hypot(k.forw[0] - r.forw[0], k.forw[1] - r.forw[1])
  })), v = [];
  for (let k = 0; k < 36; k++) {
    if (d.has(k) || i.ring?.skipBins?.has(k)) continue;
    const A = k * 10, O = b.filter((S) => {
      if (S.forwDist === 0) return !1;
      const F = ((S.angleDeg - A) % 360 + 360) % 360;
      return F < 10 + bn || F > 360 - bn;
    });
    let T = null;
    if (O.length > 0) {
      const S = O.reduce((F, $) => $.forwDist > F.forwDist ? $ : F);
      T = Sn(r.forw, S.forw, c, l, f, u);
    }
    if (!T) {
      const S = (A + 5) % 360 * (Math.PI / 180), F = [
        r.forw[0] + Math.sin(S),
        r.forw[1] + Math.cos(S)
      ];
      T = Sn(r.forw, F, c, l, f, u);
    }
    if (!T) continue;
    const [R, P] = T, x = 1e-9 * Math.max(l - c, u - f);
    if ([...y, ...v].some(
      (S) => Math.abs(S.forw[0] - R) <= x && Math.abs(S.forw[1] - P) <= x
    )) continue;
    if (s) {
      v.push({ forw: T, bakw: s(T) });
      continue;
    }
    const B = [T[0] - r.forw[0], T[1] - r.forw[1]], M = Math.atan2(B[0], B[1]), N = m(M), D = [
      r.bakw[0] + Math.sin(N),
      r.bakw[1] - Math.cos(N)
    ], C = dr(r.bakw, D, y);
    C && v.push({ forw: T, bakw: C });
  }
  const E = [...y, ...v];
  return E.sort(
    (k, A) => Math.atan2(k.forw[0] - r.forw[0], k.forw[1] - r.forw[1]) - Math.atan2(A.forw[0] - r.forw[0], A.forw[1] - r.forw[1])
  ), s || Mn(E, a, r), E;
}
function gr(i, t = !1) {
  return Ue(i, "plain", t, t ? "farLsq" : "min");
}
function mr(i, t = !1) {
  return Ue(i, "birdeye", t, "min");
}
function wr(i, t) {
  const e = /* @__PURE__ */ new Set();
  return Ue(i, "plain", !0, "min", t).filter(({ forw: [n, s] }) => {
    const o = `${n}:${s}`;
    return e.has(o) ? !1 : (e.add(o), !0);
  });
}
const _n = (i) => typeof i == "string" && i.startsWith("b");
function yr(i, t) {
  const e = (n, s) => {
    for (let o = 0; o < 3; o++) {
      const r = n.g[o], a = n.g[(o + 1) % 3];
      if (s.g.every((c) => n.sign * at(r[0], r[1], a[0], a[1], c[0], c[1]) <= 0)) return !0;
    }
    return !1;
  };
  return !e(i, t) && !e(t, i);
}
function vr(i) {
  const t = i.features.map((a) => {
    const { a: c, b: l, c: f } = a.properties, u = [c.geom, l.geom, f.geom], h = a.geometry.coordinates[0].slice(0, 3), w = u.map(([I]) => I), y = u.map(([, I]) => I), p = Math.sign(at(h[0][0], h[0][1], h[1][0], h[1][1], h[2][0], h[2][1])), _ = Math.sign(at(u[0][0], u[0][1], u[1][0], u[1][1], u[2][0], u[2][1]));
    return {
      ids: [c.index, l.index, f.index],
      f: h,
      g: u,
      sign: _,
      ratio: p * _,
      aux: [c.index, l.index, f.index].some(_n),
      minx: Math.min(...w),
      maxx: Math.max(...w),
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
        f.sign === 0 || f.miny >= c.maxy || c.miny >= f.maxy || !c.aux && !f.aux || yr(c, f) && (s.add(o[a]), s.add(o[l]));
      }
  }
  const r = /* @__PURE__ */ new Map();
  for (const a of s)
    t[a].ids.forEach((c, l) => {
      _n(c) && r.set(String(c), t[a].f[l]);
    });
  return [...r.values()];
}
function ws(i) {
  return qn(i, 1 / 0);
}
const kn = 1e5, br = 16;
function qn(i, t) {
  return xr(i), new Sr(i).findSegmentIntersections(t).map(
    (s) => Yt([s.x, s.y])
  );
}
function xr(i) {
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
class Sr {
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
    const s = n.length, o = new Float64Array(s * 4), r = new ie();
    let a = 0, c, l, f;
    for (let u = 0; u < s; u++)
      c = n[u], c > 0 && (l = u * 4, f = qr(t, e, a, c), o[l++] = f[0], o[l++] = f[1], o[l++] = f[2], o[l] = f[3], a += c, r.mergeBounds(f));
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
    const e = this.getBounds(), n = e.ymin || 0, s = (e.ymax || 0) - n, o = this.calcSegmentIntersectionStripeCount(), r = new Uint32Array(o), a = o > 1 ? (m) => Math.floor((o - 1) * (m - n) / s) : () => 0, c = o + 1;
    let l;
    this.forEachSegment(
      (m, d, b, v) => {
        let E = a(v[m]);
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
    const f = this.getUint32Array(kr(r));
    let u = 0;
    const h = [];
    Er(r, (m) => {
      const d = u;
      u += m, h.push(f.subarray(d, u));
    }), Ar(r, 0), this.forEachSegment(
      (m, d, b, v) => {
        let E = a(v[m]);
        const k = a(v[d]);
        let A, O, T = 0;
        for (; A = r[E], r[E] = A + 2, O = h[E], O[A] = m, O[A + 1] = d, E != k; )
          T++, T > c && Lt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${o}`,
            `s1=${E}`,
            `s2=${k}`
          ), E += k > E ? 1 : -1;
      }
    );
    const w = this.getVertexData(), y = t * br;
    let p = 0;
    const _ = /* @__PURE__ */ new Set(), I = /* @__PURE__ */ new Map(), g = (m) => {
      p++;
      const d = Yr(m);
      return _.has(d) || (_.add(d), I.set(`${m.x}:${m.y}`, m)), I.size >= t || p >= y;
    };
    if (w.xx && w.yy)
      for (l = 0; l < o && !Ir(h[l], w.xx, w.yy, g); l++)
        ;
    return Array.from(I.values());
  }
}
function Lt(...i) {
  const t = i.join(" ");
  throw new Error(t);
}
function ne(i) {
  return i ? _r(i) ? !0 : Mr(i) ? !1 : i.length === 0 ? !0 : i.length > 0 : !1;
}
function Mr(i) {
  return i != null && i.toString === String.prototype.toString;
}
function _r(i) {
  return Array.isArray(i);
}
function kr(i, t) {
  ne(i) || Lt("utils.sum() expects an array, received:", i);
  let e = 0, n;
  for (let s = 0, o = i.length; s < o; s++)
    n = i[s], n && (e += n);
  return e;
}
function Er(i, t, e) {
  if (!ne(i))
    throw new Error(`#forEach() takes an array-like argument. ${i}`);
  for (let n = 0, s = i.length; n < s; n++)
    t.call(e, i[n], n);
}
function Ar(i, t) {
  for (let e = 0, n = i.length; e < n; e++)
    i[e] = t;
  return i;
}
function Ir(i, t, e, n) {
  const s = i.length - 2;
  let o, r, a, c, l, f, u, h, w, y, p, _, I, g, m, d, b;
  for ($r(t, i), d = 0; d < s; ) {
    for (o = i[d], r = i[d + 1], l = t[o], f = t[r], w = e[o], y = e[r], b = d; b < s && (b += 2, a = i[b], u = t[a], !(f < u)); ) {
      if (p = e[a], c = i[b + 1], h = t[c], _ = e[c], w >= p) {
        if (w > _ && y > p && y > _) continue;
      } else if (w < _ && y < p && y < _) continue;
      if (!(o == a || o == c || r == a || r == c) && (I = Br(
        l,
        w,
        f,
        y,
        u,
        p,
        h,
        _
      ), I && (g = [o, r], m = [a, c], n(An(I, g, m, t, e)) || I.length == 4 && n(An(I.slice(2), g, m, t, e)))))
        return !0;
    }
    d += 2;
  }
  return !1;
}
function Br(i, t, e, n, s, o, r, a) {
  const c = Tr(i, t, e, n, s, o, r, a);
  let l = null;
  return c && (l = Or(i, t, e, n, s, o, r, a), l ? Cr(i, t, e, n, s, o, r, a) && (l = null) : l = Rr(i, t, e, n, s, o, r, a)), l;
}
function Tr(i, t, e, n, s, o, r, a) {
  return Qt(i, t, e, n, s, o) * Qt(i, t, e, n, r, a) <= 0 && Qt(s, o, r, a, i, t) * Qt(s, o, r, a, e, n) <= 0;
}
function Qt(i, t, e, n, s, o) {
  return Vn(i - s, t - o, e - s, n - o);
}
function Vn(i, t, e, n) {
  return i * n - t * e;
}
function Or(i, t, e, n, s, o, r, a) {
  let c = ge(i, t, e, n, s, o, r, a), l;
  return c && (l = Fr(c[0], c[1], i, t, e, n, s, o, r, a), l == 1 ? c = ge(e, n, i, t, s, o, r, a) : l == 2 ? c = ge(s, o, r, a, i, t, e, n) : l == 3 && (c = ge(r, a, s, o, i, t, e, n))), c && Pr(c, i, t, e, n, s, o, r, a), c;
}
function ge(i, t, e, n, s, o, r, a) {
  const c = Vn(e - i, n - t, r - s, a - o), l = 1e-18;
  let f;
  if (c === 0) return null;
  const u = Qt(s, o, r, a, i, t) / c;
  return c <= l && c >= -l ? f = Nr(i, t, e, n, s, o, r, a) : f = [i + u * (e - i), t + u * (n - t)], f;
}
function Nr(i, t, e, n, s, o, r, a) {
  let c = null;
  return !It(i, s, r) && !It(t, o, a) ? c = [i, t] : !It(e, s, r) && !It(n, o, a) ? c = [e, n] : !It(s, i, e) && !It(o, t, n) ? c = [s, o] : !It(r, i, e) && !It(a, t, n) && (c = [r, a]), c;
}
function It(i, t, e) {
  let n;
  return t < e ? n = i < t || i > e : t > e ? n = i > t || i < e : n = i != t, n;
}
function Fr(i, t, ...e) {
  let n = -1, s = 1 / 0, o;
  for (let r = 0, a = 0, c = e.length; a < c; r++, a += 2)
    o = Dr(i, t, e[a], e[a + 1]), o < s && (s = o, n = r);
  return n;
}
function Dr(i, t, e, n) {
  const s = i - e, o = t - n;
  return s * s + o * o;
}
function Pr(i, t, e, n, s, o, r, a, c) {
  let l = i[0], f = i[1];
  l = me(l, t, n), l = me(l, o, a), f = me(f, e, s), f = me(f, r, c), i[0] = l, i[1] = f;
}
function me(i, t, e) {
  let n;
  return It(i, t, e) && (n = Math.abs(i - t) < Math.abs(i - e) ? t : e, i = n), i;
}
function Rr(i, t, e, n, s, o, r, a) {
  const c = Math.min(i, e, s, r), l = Math.max(i, e, s, r), f = Math.min(t, n, o, a), u = Math.max(t, n, o, a), h = u - f > l - c;
  let w = [];
  return (h ? Pt(t, f, u) : Pt(i, c, l)) && w.push(i, t), (h ? Pt(n, f, u) : Pt(e, c, l)) && w.push(e, n), (h ? Pt(o, f, u) : Pt(s, c, l)) && w.push(s, o), (h ? Pt(a, f, u) : Pt(r, c, l)) && w.push(r, a), (w.length != 2 && w.length != 4 || w.length == 4 && w[0] == w[2] && w[1] == w[3]) && (w = null), w;
}
function Cr(i, t, e, n, s, o, r, a) {
  return i == s && t == o || i == r && t == a || e == s && n == o || e == r && n == a;
}
function Pt(i, t, e) {
  return i > t && i < e;
}
function $r(i, t) {
  Xr(i, t), jn(i, t, 0, t.length - 2);
}
function Xr(i, t) {
  for (let e = 0, n = t.length; e < n; e += 2)
    i[t[e]] > i[t[e + 1]] && Lr(t, e, e + 1);
}
function Lr(i, t, e) {
  const n = i[t];
  i[t] = i[e], i[e] = n;
}
function jn(i, t, e, n) {
  let s = e, o = n, r, a;
  for (; s < n; ) {
    for (r = i[t[e + n >> 2 << 1]]; s <= o; ) {
      for (; i[t[s]] < r; ) s += 2;
      for (; i[t[o]] > r; ) o -= 2;
      s <= o && (a = t[s], t[s] = t[o], t[o] = a, a = t[s + 1], t[s + 1] = t[o + 1], t[o + 1] = a, s += 2, o -= 2);
    }
    if (o - e < 40 ? En(i, t, e, o) : jn(i, t, e, o), n - s < 40) {
      En(i, t, s, n);
      return;
    }
    e = s, o = n;
  }
}
function En(i, t, e, n) {
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
function Yr(i) {
  return `${i.a.join(",")};${i.b.join(",")}`;
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
function qr(i, t, e, n) {
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
function zn(i, t, e) {
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
function Bn(i, t, e) {
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
function Vr(i, t) {
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
const jr = 10;
function zr(i, t, e, n, s, o) {
  if (!i && !t) return !1;
  const r = i ? 0 : 1, a = 1 - r, c = e[r], l = e[a];
  if (!c || !l) return !1;
  const f = bt(l.geom);
  let u = !1, h = !1;
  for (let w = 0; w <= 1; w++) {
    const y = n[w];
    if (!y) continue;
    const p = [String(y.prop.index), String(c.prop.index)].sort().join("-"), _ = s[p];
    if (!_ || _.length < 2) continue;
    const I = _.find(
      (T) => T.bakw !== o[r].bakw
    );
    if (!I) continue;
    const m = Zt(I.bakw).find(
      (T) => String(T.prop.index) !== String(y.prop.index) && String(T.prop.index) !== String(c.prop.index)
    );
    if (!m) continue;
    u = !0;
    const d = bt(m.geom), b = bt(y.geom), v = bt(c.geom), E = v[0] - b[0], k = v[1] - b[1], A = E * (f[1] - b[1]) - k * (f[0] - b[0]), O = E * (d[1] - b[1]) - k * (d[0] - b[0]);
    if (A * O > 0) {
      h = !0;
      break;
    }
  }
  return u && !h;
}
function Gr(i, t, e, n) {
  if (!i && !t) return !1;
  if (e[0] && e[1] && n[0] && n[1]) {
    const s = n.map((f) => bt(f.geom)), o = e.map((f) => bt(f.geom)), r = s[1][0] - s[0][0], a = s[1][1] - s[0][1], c = r * (o[0][1] - s[0][1]) - a * (o[0][0] - s[0][0]), l = r * (o[1][1] - s[0][1]) - a * (o[1][0] - s[0][0]);
    return c * l < 0;
  }
  return !1;
}
function Kr(i, t, e, n) {
  const s = Vr(e, n), o = /* @__PURE__ */ new Set();
  let r = !1;
  for (let a = 0; a < jr; a++) {
    let c = !1;
    for (const l of Object.keys(t)) {
      if (o.has(l)) continue;
      o.add(l);
      const f = t[l];
      if (!f || f.length < 2) continue;
      const u = l.split("-");
      if (u.length !== 2 || s.has(l)) continue;
      const h = Zt(f[0].bakw), w = Zt(f[1].bakw), y = Zt(f[0].forw), p = Zt(f[1].forw), _ = u.map(
        (S) => h.find((F) => `${F.prop.index}` === S) || w.find((F) => `${F.prop.index}` === S)
      ), I = u.map(
        (S) => y.find((F) => `${F.prop.index}` === S) || p.find((F) => `${F.prop.index}` === S)
      );
      if (_.some((S) => !S) || I.some((S) => !S))
        continue;
      const g = [h, w].map(
        (S) => S.find((F) => !u.includes(`${F.prop.index}`))
      ), m = [y, p].map(
        (S) => S.find((F) => !u.includes(`${F.prop.index}`))
      );
      if (g.some((S) => !S) || m.some((S) => !S))
        continue;
      const d = f[0].bakw.geometry.coordinates[0].slice(0, 3).map((S) => bt(S)), b = f[1].bakw.geometry.coordinates[0].slice(0, 3).map((S) => bt(S)), v = f[0].forw.geometry.coordinates[0].slice(0, 3).map((S) => bt(S)), E = f[1].forw.geometry.coordinates[0].slice(0, 3).map((S) => bt(S)), k = we(d), A = we(b), O = we(v), T = we(E), R = zr(
        k,
        A,
        g,
        _,
        t,
        f
      ), P = Gr(
        O,
        T,
        g,
        _
      );
      if (!(R || P || Tn(
        bt(g[0].geom),
        b
      ) || Tn(
        bt(g[1].geom),
        d
      )))
        continue;
      const B = I.map(
        (S) => bt(S.geom)
      ), M = m.map(
        (S) => bt(S.geom)
      ), N = Wr([
        ...B,
        ...M
      ]), D = Hr(N), C = On(
        B[0],
        B[1],
        M[0]
      ) + On(
        B[0],
        B[1],
        M[1]
      );
      $e(D, C) && (Bn(t, f[0], i), Bn(t, f[1], i), _.forEach((S) => {
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
        }, L = re([F], $), q = $n(L);
        zn(t, {
          forw: q,
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
function Tn(i, t) {
  const [e, n] = t[0], [s, o] = t[1], [r, a] = t[2], c = r - e, l = a - n, f = s - e, u = o - n, h = i[0] - e, w = i[1] - n, y = c * c + l * l, p = c * f + l * u, _ = c * h + l * w, I = f * f + u * u, g = f * h + u * w, m = y * I - p * p;
  if (m === 0) return !1;
  const d = 1 / m, b = (I * _ - p * g) * d, v = (y * g - p * _) * d, E = 1e-9;
  return b >= -E && v >= -E && b + v <= 1 + E;
}
function Wr(i) {
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
function Hr(i) {
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
const Jr = (i) => typeof i == "string" && i.startsWith("b");
function Qr(i, t) {
  const e = (n, s) => {
    for (let o = 0; o < 3; o++) {
      const r = n.g[o], a = n.g[(o + 1) % 3];
      if (s.g.every((c) => n.sign * at(r[0], r[1], a[0], a[1], c[0], c[1]) <= 0)) return !0;
    }
    return !1;
  };
  return !e(i, t) && !e(t, i);
}
function Zr(i, t, e) {
  if (t.length === 0) return [];
  const n = i.features.map((p) => {
    const { a: _, b: I, c: g } = p.properties, m = [_.geom, I.geom, g.geom], [d, b, v] = p.geometry.coordinates[0], E = m.map(([T]) => T), k = m.map(([, T]) => T), A = Math.sign(at(d[0], d[1], b[0], b[1], v[0], v[1])), O = Math.sign(at(m[0][0], m[0][1], m[1][0], m[1][1], m[2][0], m[2][1]));
    return {
      ids: [_.index, I.index, g.index].map(String),
      g: m,
      sign: O,
      ratio: A * O,
      aux: [_.index, I.index, g.index].some(Jr),
      minx: Math.min(...E),
      maxx: Math.max(...E),
      miny: Math.min(...k),
      maxy: Math.max(...k)
    };
  }), s = n.map((p) => p.ratio), o = s.reduce((p, _) => p + _, 0) < 0 ? -1 : 1, r = (p, _) => p < _ ? `${p}|${_}` : `${_}|${p}`, a = /* @__PURE__ */ new Map();
  n.forEach((p, _) => {
    for (let I = 0; I < 3; I++) {
      const g = r(p.ids[I], p.ids[(I + 1) % 3]), m = a.get(g);
      m ? m.push(_) : a.set(g, [_]);
    }
  });
  const c = ([p, _]) => r(String(e[p]), String(e[_])), l = /* @__PURE__ */ new Set();
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
        g.sign === 0 || g.miny >= _.maxy || _.miny >= g.maxy || !f(h[p]) && !f(h[I]) || Qr(_, g) && (u.add(h[p]), u.add(h[I]));
      }
  }
  if (u.size === 0) return [];
  const w = t.filter((p) => (a.get(c(p)) ?? []).some((_) => u.has(_)));
  if (w.length > 0) return w;
  const y = /* @__PURE__ */ new Set();
  for (const p of u) for (const _ of n[p].ids) _.startsWith("b") || y.add(_);
  return t.filter(
    ([p, _]) => y.has(String(e[p])) || y.has(String(e[_]))
  );
}
const ts = 4, Nn = 32, es = 1, ns = 0.4, Gn = 4, is = 1e-4, Kn = 0.25, rs = 0.01, Rt = (i, t) => String(i) < String(t) ? `${i}|${t}` : `${t}|${i}`;
function Pe(i, t, e) {
  const n = t.filter((l) => !String(l.properties.target.index).startsWith("b")).map((l) => ({
    id: l.properties.target.index,
    paper: l.geometry.coordinates,
    geo: l.properties.target.geom
  })), s = /* @__PURE__ */ new Set();
  let o = 0, r = 0;
  const a = i.features.map((l) => {
    const { a: f, b: u, c: h } = l.properties, [w, y, p] = l.geometry.coordinates[0];
    s.add(Rt(f.index, u.index)), s.add(Rt(f.index, h.index)), s.add(Rt(u.index, h.index));
    const _ = Math.sign(at(w[0], w[1], y[0], y[1], p[0], p[1])) * Math.sign(at(f.geom[0], f.geom[1], u.geom[0], u.geom[1], h.geom[0], h.geom[1]));
    return _ > 0 ? o++ : _ < 0 && r++, {
      ids: [String(f.index), String(u.index), String(h.index)],
      paper: [w, y, p],
      geo: [f.geom, u.geom, h.geom],
      sign: _
    };
  }), c = e.filter(([l, f]) => !s.has(Rt(n[l].id, n[f].id)));
  return { points: n, triangles: a, majority: o >= r ? 1 : -1, hullEdges: e, dropped: c };
}
function Wn(i) {
  return [i.foot[0] + i.height * i.normal[0], i.foot[1] + i.height * i.normal[1]];
}
function ss(i, [t, e], { lambda: n = Kn, epsilon: s = is } = {}) {
  const { points: o, majority: r } = i, a = o[t], c = o[e], l = o.reduce((M, N) => M + N.paper[0], 0) / o.length, f = o.reduce((M, N) => M + N.paper[1], 0) / o.length, u = Math.sign(at(a.paper[0], a.paper[1], c.paper[0], c.paper[1], l, f));
  if (u === 0) return;
  const h = u * r, w = [c.paper[0] - a.paper[0], c.paper[1] - a.paper[1]], y = [c.geo[0] - a.geo[0], c.geo[1] - a.geo[1]], p = Math.hypot(w[0], w[1]), _ = Math.hypot(y[0], y[1]);
  if (!(p > 0 && _ > 0)) return;
  const I = [];
  for (const M of o) {
    if (M === a || M === c) continue;
    const N = at(a.geo[0], a.geo[1], c.geo[0], c.geo[1], M.geo[0], M.geo[1]);
    if (N * h >= 0) continue;
    const D = ((M.geo[0] - a.geo[0]) * y[0] + (M.geo[1] - a.geo[1]) * y[1]) / (_ * _), C = ((M.paper[0] - a.paper[0]) * w[0] + (M.paper[1] - a.paper[1]) * w[1]) / (p * p);
    D > 0 && D < 1 && C > 0 && C < 1 && I.push({ id: M.id, u: D, t: C, d: Math.abs(N) / _ });
  }
  const g = I.length > 0;
  g || I.push({ u: 0.5, t: 0.5, d: 0 });
  const m = I.reduce((M, N) => N.d > M.d ? N : M);
  let d = 0;
  for (const M of I)
    d = Math.max(d, M.u <= m.u ? M.d * m.u / M.u : M.d * (1 - m.u) / (1 - M.u));
  d *= 1 + n;
  const b = [-w[1] / p * u, w[0] / p * u], v = [-y[1] / _ * h, y[0] / _ * h], E = (M) => [
    a.paper[0] + M * w[0] + s * p * b[0],
    a.paper[1] + M * w[1] + s * p * b[1]
  ], k = (M, N, D, C) => ({
    paper: E(M),
    foot: [a.geo[0] + N * y[0], a.geo[1] + N * y[1]],
    normal: v,
    height: D,
    chord: _,
    protrusion: m.d,
    ...C === void 0 ? {} : { anchor: C }
  }), A = [k(m.t, m.u, d, g ? m.id : void 0)], O = [...I].sort((M, N) => M.u - N.u), T = [{ u: 0, d: 0 }], R = (M, N, D) => (N.u - M.u) * (D.d - M.d) - (N.d - M.d) * (D.u - M.u);
  for (const M of [...O, { u: 1, d: 0 }]) {
    for (; T.length >= 2 && R(T[T.length - 2], T[T.length - 1], M) >= 0; ) T.pop();
    T.push(M);
  }
  const P = n * m.d, x = [];
  let B = 0;
  for (const M of T.slice(1, -1))
    M.t === void 0 || !(M.t > B) || (B = M.t, x.push(k(M.t, M.u, M.d + P, g ? M.id : void 0)));
  return {
    edge: [a.id, c.id],
    variants: g && x.length > 1 ? [A, x] : [A]
  };
}
function os(i, t, e, { lambda: n = Kn, mu: s = rs, maxIterations: o = Gn } = {}) {
  let r = i.map((a, c) => ({ ray: { ...a }, index: c }));
  for (let a = 0; a < o && r.length > 0; a++) {
    const c = e(r.map(({ ray: u }) => [u.paper, Wn(u)]));
    if (!c) return;
    let l = !1;
    const f = /* @__PURE__ */ new Set();
    for (const [u, { ray: h }] of r.entries()) {
      const w = `e${t + u}`;
      let y = -1 / 0, p = 1 / 0, _ = 0;
      for (const d of c.triangles) {
        const b = d.ids.indexOf(w);
        if (b < 0) continue;
        d.sign !== c.majority && _++;
        const v = d.geo[(b + 1) % 3], E = d.geo[(b + 2) % 3], k = Math.sign(
          at(
            d.paper[b][0],
            d.paper[b][1],
            d.paper[(b + 1) % 3][0],
            d.paper[(b + 1) % 3][1],
            d.paper[(b + 2) % 3][0],
            d.paper[(b + 2) % 3][1]
          )
        ), A = at(h.foot[0], h.foot[1], v[0], v[1], E[0], E[1]), O = at(h.foot[0] + h.normal[0], h.foot[1] + h.normal[1], v[0], v[1], E[0], E[1]) - A, T = k * c.majority;
        if (O === 0) {
          A * T <= 0 && (y = 1 / 0);
          continue;
        }
        const R = -A / O;
        O * T > 0 ? y = Math.max(y, R) : p = Math.min(p, R);
      }
      if (!(y < p)) {
        f.add(u);
        continue;
      }
      const I = Math.min(Math.max(n * Math.max(y, h.protrusion), s * h.chord), (p - y) / 2), g = Math.max(y, 0) + I, m = Math.abs(g - h.height) > 1e-9 * h.chord;
      (_ > 0 || m) && (m && (l = !0), h.height = g);
    }
    if (f.size > 0 && (r = r.filter((u, h) => !f.has(h)), l = !0), !l) break;
  }
  if (r.length !== 0)
    return { rays: r.map(({ ray: a }) => a), kept: r.map(({ index: a }) => a) };
}
function as(i, t) {
  const e = (r) => typeof r == "string" && r.startsWith("e") && Number(r.slice(1)) >= t ? Number(r.slice(1)) : void 0, n = /* @__PURE__ */ new Set();
  for (const { ids: r } of i.triangles)
    n.add(Rt(r[0], r[1])), n.add(Rt(r[0], r[2])), n.add(Rt(r[1], r[2]));
  const s = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set();
  for (const [r, a] of i.hullEdges) {
    const c = n.has(Rt(i.points[r].id, i.points[a].id));
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
function cs(i, t) {
  const e = { rounds: 0, builds: 0, cost: 0, budget: 0, batches: 0, perEdge: 0, multiPoint: 0 };
  let n = [], s = [], o = t, r = i.snapshot();
  const a = /* @__PURE__ */ new Set(), c = es * i.baseCost;
  e.budget = c;
  const l = i.buildCost();
  let f = 0;
  const u = () => f * ns + i.buildCost() - l, h = () => u() >= c, w = (g) => {
    if (!h())
      return e.builds++, f++, i.measure(g);
  }, y = (g) => [g.paper, Wn(g)], p = (g, m, d) => {
    const b = os(
      g.map(({ ray: v }) => v),
      m,
      (v) => w([...n, ...v]),
      { maxIterations: d }
    );
    return b?.rays.map((v, E) => ({ ray: v, edge: g[b.kept[E]].edge }));
  }, _ = (g, m) => g.length === m.length && g.every(({ ray: d }, b) => Math.abs(d.height - m[b].ray.height) <= 1e-9 * d.chord), I = (g) => {
    if (g.length === 0 || n.length + g.length > Nn) return !1;
    const m = i.edgeBase + n.length;
    let d = p(g, m, 1), b = !1;
    for (; d && d.length > 0 && !h(); ) {
      const v = [...n, ...d.map(({ ray: O }) => y(O))];
      e.builds++;
      const E = i.build(v, Math.max(1, Math.ceil(c - u()))), k = E ? as(E.analysis, m) : void 0;
      if (E && k.size === 0)
        return s = s.concat(
          d.map(({ ray: O, edge: T }, R) => ({
            node: m + R,
            kind: "hullEdge",
            edge: T,
            ...O.anchor === void 0 ? {} : { anchor: O.anchor }
          }))
        ), n = v, o = E, r = i.snapshot(), !0;
      if (i.restore(r), E && k.size < d.length) {
        d = d.filter((O, T) => !k.has(m + T));
        continue;
      }
      if (b) return !1;
      b = !0;
      const A = p(d, m, Gn);
      if (!A || _(A, d)) return !1;
      d = A;
    }
    return !1;
  };
  for (let g = 1; g <= ts && !h(); g++) {
    const { analysis: m } = o, d = [];
    for (const v of m.dropped) {
      const E = v.map((A) => m.points[A].paper.join(",")).join("|");
      if (a.has(E) || (a.add(E), n.length + d.length + 1 > Nn)) continue;
      const k = ss(m, v);
      k && d.push(k);
    }
    if (d.length === 0) break;
    e.rounds = g;
    const b = (v, E) => E.map((k) => ({ ray: k, edge: v.edge }));
    if (I(d.flatMap((v) => b(v, v.variants[0])))) {
      e.batches++;
      continue;
    }
    for (const v of d)
      for (const [E, k] of v.variants.entries()) {
        if (h()) break;
        if (I(b(v, k))) {
          e.perEdge++, E > 0 && e.multiPoint++;
          break;
        }
      }
  }
  return i.restore(r), e.cost = u(), { pairs: n, records: s, result: o.result, diagnostics: e };
}
const Fn = 2.00704, Dn = 3.00001, ls = 12, us = 4, Pn = 1, Rn = 4, fs = 8, hs = 24;
function ds(i) {
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
const Cn = /* @__PURE__ */ Symbol("supplement pairs out of budget"), ps = 24;
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
    return this.useV2Algorithm ? Fn : Dn;
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
    if (t.version = this.useV2Algorithm ? Fn : Dn, t.points = this.points, t.weight_buffer = {}, this.compiledOuter?.outerTransform === "worldFile")
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
    this.tins.bakw = xt(t);
    const e = {};
    this.tins.forw.features.forEach((s, o) => {
      const r = this.tins.bakw.features[o];
      zn(e, { forw: s, bakw: r });
    });
    const n = (this.pointsSet?.forw.features ?? []).map(
      (s) => s.properties.target.index
    );
    Kr(
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
      const o = this.points[s][0], r = this.points[s][1], a = Vt(o, r, s);
      t.forw.push(a), t.bakw.push(jt(a));
    }
    const e = [];
    let n = 0;
    this.edgeNodes = [], this.edges || (this.edges = []);
    for (let s = 0; s < this.edges.length; s++) {
      const o = this.edges[s][2], r = Object.assign([], this.edges[s][0]), a = Object.assign([], this.edges[s][1]);
      if (gs(o, this.points.length, s), r.length === 0 && a.length === 0) {
        e.push(o);
        continue;
      }
      r.unshift(this.points[o[0]][0]), r.push(this.points[o[1]][0]), a.unshift(this.points[o[0]][1]), a.push(this.points[o[1]][1]);
      const c = [r, a].map((l) => {
        const f = l.map((h, w, y) => {
          if (w === 0) return 0;
          const p = y[w - 1];
          return Math.sqrt(
            Math.pow(h[0] - p[0], 2) + Math.pow(h[1] - p[1], 2)
          );
        }), u = f.reduce((h, w, y) => y === 0 ? [0] : (h.push(h[y - 1] + w), h), []);
        return u.map((h, w, y) => {
          const p = h / y[y.length - 1];
          return [l[w], f[w], u[w], p];
        });
      });
      c.map((l, f) => {
        const u = c[f ? 0 : 1];
        return l.filter((h, w) => !(w === 0 || w === l.length - 1 || h[4] === "handled")).flatMap((h) => {
          const w = h[0], y = h[3], p = u.reduce(
            (_, I, g, m) => {
              if (_) return _;
              const d = m[g + 1];
              if (I[3] === y)
                return I[4] = "handled", [I];
              if (I[3] < y && d && d[3] > y)
                return [I, d];
            },
            void 0
          );
          if (p && p.length === 1)
            return f === 0 ? [[w, p[0][0], y]] : [[p[0][0], w, y]];
          if (p && p.length === 2) {
            const _ = p[0], I = p[1], g = (y - _[3]) / (I[3] - _[3]), m = [
              (I[0][0] - _[0][0]) * g + _[0][0],
              (I[0][1] - _[0][1]) * g + _[0][1]
            ];
            return f === 0 ? [[w, m, y]] : [[m, w, y]];
          }
          return [];
        });
      }).reduce((l, f) => l.concat(f), []).sort((l, f) => l[2] < f[2] ? -1 : 1).map((l, f, u) => {
        this.edgeNodes[n] = [
          l[0],
          l[1]
        ];
        const h = Vt(
          l[0],
          l[1],
          `e${n}`
        );
        n++, t.forw.push(h), t.bakw.push(jt(h)), f === 0 ? e.push([o[0], t.forw.length - 1]) : e.push([
          t.forw.length - 2,
          t.forw.length - 1
        ]), f === u.length - 1 && e.push([t.forw.length - 1, o[1]]);
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
        const P = this.boundsPolygon;
        if (!P) throw new Error("Internal error: bounds is set but boundsPolygon is missing");
        if (!this.points.every(
          (B) => Je(B[0], P)
        )) throw "SOME POINTS OUTSIDE";
      }
      s = this.generatePointsSet(), { minx: o, maxx: r, miny: a, maxy: c } = this.computeGcpBbox();
    } else {
      const P = this.validateAndPrepareInputs();
      s = P.pointsSet, o = P.minx, r = P.maxx, a = P.miny, c = P.maxy;
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
    const h = Di(l.forw), w = fn(l.forw);
    if (!w) throw "TOO LINEAR2";
    const y = {}, p = w.geometry.coordinates[0];
    let _;
    try {
      _ = p.map((P) => ({
        forw: P,
        bakw: Me(Yt(P), f)
      })), _.forEach((P) => {
        y[`${P.forw[0]}:${P.forw[1]}`] = P;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const I = fn(l.bakw);
    if (!I) throw "TOO LINEAR2";
    const g = I.geometry.coordinates[0];
    try {
      _ = g.map((P) => ({
        bakw: P,
        forw: Me(Yt(P), u)
      })), _.forEach((P) => {
        y[`${P.forw[0]}:${P.forw[1]}`] = P;
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
    const b = [
      ...this.points.map((P) => ({ forw: P[0], bakw: P[1] })),
      ...(this.edgeNodes ?? []).map((P) => ({ forw: P[0], bakw: P[1] }))
    ], v = {
      convexBuf: y,
      centroid: m,
      allGcps: b,
      minx: o,
      maxx: r,
      miny: a,
      maxy: c
    }, E = t === nt.MODE_STRICT || t === nt.MODE_AUTO, k = (P, x, B) => {
      if (!E || this.isStrict() || !P.boundary) return { result: P };
      const M = () => ({
        build: this.captureBuild(),
        raw: [s.forw.slice(), s.bakw.slice()],
        gcps: b.slice(),
        edgeNodes: this.edgeNodes.slice(),
        supplementRecords: this.supplementRecords,
        supplementDiagnostics: this.lastSupplementDiagnostics
      }), N = (X) => {
        s.forw.splice(0, s.forw.length, ...X.raw[0]), s.bakw.splice(0, s.bakw.length, ...X.raw[1]), b.splice(0, b.length, ...X.gcps), this.edgeNodes.splice(0, this.edgeNodes.length, ...X.edgeNodes), this.restoreBuild(X.build), this.supplementRecords = X.supplementRecords, this.lastSupplementDiagnostics = X.supplementDiagnostics;
      }, D = M(), C = this.attemptTotal, S = () => this.attemptTotal - C, F = (X, U) => {
        const G = U.map(([W]) => W), z = U.map(([, W]) => W);
        return (X[0] === Math.min(...G) || X[0] === Math.max(...G)) && (X[1] === Math.min(...z) || X[1] === Math.max(...z));
      }, $ = (X) => {
        s.forw.splice(0, s.forw.length, ...D.raw[0]), s.bakw.splice(0, s.bakw.length, ...D.raw[1]), b.splice(0, b.length, ...D.gcps), this.edgeNodes.splice(0, this.edgeNodes.length, ...D.edgeNodes), this.supplementRecords = [];
        const U = B(X);
        return { built: U, strict: U.boundary !== void 0 && this.isStrict() };
      }, L = /* @__PURE__ */ new Set(), q = P.boundary.vertices.map(({ forw: X }) => X), Y = new Set(
        q.filter((X) => !F(X, q)).map((X) => xn(X, m.forw))
      );
      try {
        let X = P;
        for (let U = 0; U < us && !(S() + x >= Rn * x); U++) {
          const G = X.boundary.vertices.map(({ forw: H }) => H), z = L.size;
          for (const H of vr(this.tins.forw)) {
            if (F(H, G)) continue;
            const Q = xn(H, m.forw);
            for (let J = -Pn; J <= Pn; J++) L.add((Q + J + 36) % 36);
          }
          if (L.size === z || L.size >= hs) break;
          const W = $({ skipBins: new Set(L) });
          if (!W.built.boundary)
            return N(D), { result: P };
          if (W.strict) {
            let H = { result: W.built, state: M() };
            for (const Q of ds(L)) {
              if (!Q.some((lt) => Y.has(lt))) continue;
              if (S() >= fs * x) break;
              const J = new Set([...L].filter((lt) => !Q.includes(lt))), ct = $({ skipBins: J });
              if (ct.strict) {
                for (const lt of Q) L.delete(lt);
                H = { result: ct.built, state: M() };
              }
            }
            return N(H.state), { result: H.result, kind: "thinned" };
          }
          X = W.built;
        }
        if (S() < Rn * x) {
          const U = $({ cornersOnly: !0 });
          if (U.strict) return { result: U.built, kind: "corners" };
        }
      } catch {
      }
      return N(D), { result: P };
    };
    if (n) {
      this.stateTriangle = void 0;
      const P = this.yaxisMode === nt.YAXIS_FOLLOW, x = P ? 1 : -1, B = (F) => this.buildWithSupplements(t, s, b, ($, L, q) => (Y) => ({ boundary: vn(
        F ? { ...v, ring: F } : v,
        (X) => wr(X, (U) => {
          const [G, z] = ii(n, U);
          return [G, P ? -z : z];
        }),
        s,
        this.points.length,
        {
          orientation: x,
          accept: (X) => X.hasMapBoundary ? (this.buildTin(s, X.vertices, L, X, Y.size > 0, q), (this.strict_status !== nt.STATUS_LOOSE || X.hasBoundary) && be(this.tins.forw, x) === 0 && be(this.tins.bakw, x) === 0) : !1
        },
        Y,
        $
      ) })), M = this.attemptTotal, N = B(), D = this.attemptTotal - M, { result: { boundary: C }, kind: S } = k(N, D, B);
      if (C) {
        this.compiledOuter = {
          outerTransform: "worldFile",
          worldFile: n,
          vertices_points: C.vertices.map(({ forw: Y, bakw: X }) => [Y, X])
        };
        const { centroid: F, xy: $, wh: L, kinks: q } = this;
        super.setCompiled(this.getCompiled()), Object.assign(this, { centroid: F, xy: $, wh: L, kinks: q }), this.lastBoundaryDiagnostics = {
          ...C.diagnostics,
          ...S ? { ringRescue: S } : {},
          requestedOuterTransform: "worldFile",
          outerTransform: "worldFile"
        };
        return;
      }
      this.compiledOuter = { outerTransform: "extrapolate" }, this.outerTransform = "extrapolate", this.worldFile = void 0;
    }
    const A = this.vertexMode === nt.VERTEX_BIRDEYE ? mr : gr;
    let O, T, R;
    if (e) {
      const P = (N) => this.buildWithSupplements(t, s, b, (D, C, S) => (F) => {
        const $ = N ? { ...v, ring: N } : v, L = vn(
          $,
          A,
          s,
          this.points.length,
          void 0,
          F,
          D
        );
        return {
          boundary: L,
          verticesList: this.buildTin(
            s,
            L?.vertices ?? A($, !1),
            C,
            L,
            F.size > 0,
            S
          )
        };
      }), x = this.attemptTotal, B = P(), M = k(B, this.attemptTotal - x, P);
      ({ boundary: O, verticesList: T } = M.result), R = M.kind;
    } else
      T = this.buildTin(
        s,
        A(v, !1),
        t,
        void 0
      );
    this.vertices_params = {
      forw: mn(T.forw, this.centroid.forw),
      bakw: mn(T.bakw, this.centroid.bakw)
    }, this.addIndexedTin(), this.pointsWeightBuffer = {}, this.lastBoundaryDiagnostics = O && R ? { ...O.diagnostics, ringRescue: R } : O?.diagnostics, n && this.lastBoundaryDiagnostics && (this.lastBoundaryDiagnostics = {
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
    const h = Pe(this.tins.forw, this.pointsSet.forw.features, l.boundary.forwHull.all);
    if (h.dropped.length === 0) return l;
    const w = this.edgeNodes.length, y = e.forw.length, p = n.length;
    let _ = [], I;
    const g = (v, E) => v.length === E.length && v.every((k, A) => k.every((O, T) => O[0] === E[A][T][0] && O[1] === E[A][T][1])), m = (v) => {
      e.forw.length = y, e.bakw.length = y, n.length = p, this.edgeNodes.length = w;
      for (const [E, k] of v) {
        const A = Vt(E, k, `e${this.edgeNodes.length}`);
        this.edgeNodes.push([E, k]), e.forw.push(A), e.bakw.push(jt(A)), n.push({ forw: E, bakw: k });
      }
      _ = v;
    }, b = cs({
      edgeBase: w,
      baseCost: f,
      buildCost: () => u,
      snapshot: () => ({ pairs: _, state: this.captureBuild() }),
      restore: ({ pairs: v, state: E }) => {
        m(v), this.restoreBuild(E);
      },
      measure: (v) => {
        m(v);
        const E = this.captureBuild();
        try {
          const k = /* @__PURE__ */ new Map();
          I = { pairs: v, cache: k };
          const { boundary: A } = s(k, nt.MODE_STRICT, !0)(/* @__PURE__ */ new Set());
          return A ? Pe(this.tins.forw, this.pointsSet.forw.features, []) : void 0;
        } finally {
          this.restoreBuild(E);
        }
      },
      build: (v, E) => {
        m(v);
        const k = I && g(I.pairs, v) ? I.cache : /* @__PURE__ */ new Map(), A = o;
        let O;
        try {
          O = this.buildWithHull(c, (T) => {
            if (o - A >= E) throw Cn;
            return r(k, c, !1)(T);
          });
        } catch (T) {
          if (T !== Cn) throw T;
          u += o - A;
          return;
        }
        if (u += o - A, !(!O.boundary || this.strict_status !== nt.STATUS_STRICT))
          return {
            result: O,
            analysis: Pe(this.tins.forw, this.pointsSet.forw.features, O.boundary.forwHull.all)
          };
      }
    }, { result: l, analysis: h });
    return this.supplementRecords = b.records, this.lastSupplementDiagnostics = b.diagnostics, b.result;
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
    const o = (p) => [...p].sort().join(","), r = (p, _ = !1) => {
      const I = o(p), g = n.get(I);
      if (g) return g;
      const m = e(p), d = {
        value: m,
        strict: m.boundary !== void 0 && this.strict_status === nt.STATUS_STRICT
      };
      return (d.strict || _) && (d.state = this.captureBuild()), n.set(I, d), s = d, d;
    }, a = (p) => (s !== p && this.restoreBuild(p.state), s = p, p.value), c = r(/* @__PURE__ */ new Set(), !0);
    if (!(t === nt.MODE_STRICT || t === nt.MODE_AUTO) || !c.value.boundary || c.strict) return c.value;
    const f = new Set(c.value.boundary.forwHull.all.map(ve)), u = () => this.pointsSet.forw.features.map(
      (p) => p.properties.target.index
    ), h = /* @__PURE__ */ new Set();
    let w = c, y;
    for (let p = 0; p < ls; p++) {
      const _ = Zr(
        this.tins.forw,
        w.value.boundary.forwHull.applied,
        u()
      ).filter((I) => !h.has(ve(I)));
      if (_.length === 0) break;
      for (const I of _) h.add(ve(I));
      if (w = r(h), !w.value.boundary) break;
      if (w.strict) {
        y = w;
        break;
      }
    }
    if (y) {
      let p = y;
      for (const _ of [...h].slice(0, ps)) {
        const I = new Set(h);
        I.delete(_);
        const g = r(I);
        g.strict && (h.delete(_), p = g);
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
      const l = e[c].forw, f = e[c].bakw, u = Vt(l, f, `b${c}`), h = jt(u);
      a.forw.push(u), a.bakw.push(h);
    }
    return this.pointsSet = {
      forw: xt([...t.forw, ...a.forw]),
      bakw: xt([...t.bakw, ...a.bakw]),
      edges: t.edges
    }, this.tins = {
      forw: je(
        s?.forw ?? pe(this.pointsSet.forw, t.edges, "target")
      )
    }, (n === nt.MODE_STRICT || n === nt.MODE_AUTO) && (r ? this.resolveStrictOverlaps() : this.calculateStrictTin(
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
function gs(i, t, e) {
  const n = (s) => Number.isInteger(s) && s >= 0 && s < t;
  if (!Array.isArray(i) || !n(i[0]) || !n(i[1]))
    throw new Error(
      `Invalid edge at edges[${e}]: start/end ${JSON.stringify(i)} must be integer indices of points (0 to ${t - 1})`
    );
}
export {
  nt as Tin,
  pe as constrainedTin,
  jt as counterPoint,
  Vt as createPoint,
  nt as default,
  ws as findIntersections,
  Fn as format_version,
  zn as insertSearchIndex,
  mn as vertexCalc
};
