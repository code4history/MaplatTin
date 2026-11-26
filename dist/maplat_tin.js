import { counterTri as Fn, Transform as Kn, validateWorldFile as Wn, normalizeEdges as Gn, transformArr as Me, rotateVerticesTriangle as je, worldFileToCrs as Jn } from "@maplat/transform";
function ee(r, t, e = {}) {
  const n = { type: "Feature" };
  return (e.id === 0 || e.id) && (n.id = e.id), e.bbox && (n.bbox = e.bbox), n.properties = t || {}, n.geometry = r, n;
}
function Lt(r, t, e = {}) {
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
  for (const o of r) {
    if (o.length < 4)
      throw new Error(
        "Each LinearRing of a Polygon must have 4 or more Positions."
      );
    if (o[o.length - 1].length !== o[0].length)
      throw new Error("First and last Position are not equivalent.");
    for (let s = 0; s < o[o.length - 1].length; s++)
      if (o[o.length - 1][s] !== o[0][s])
        throw new Error("First and last Position are not equivalent.");
  }
  return ee({
    type: "Polygon",
    coordinates: r
  }, t, e);
}
function Ue(r, t, e = {}) {
  if (r.length < 2)
    throw new Error("coordinates must be an array of two or more positions");
  return ee({
    type: "LineString",
    coordinates: r
  }, t, e);
}
function xt(r, t = {}) {
  const e = { type: "FeatureCollection" };
  return t.id && (e.id = t.id), t.bbox && (e.bbox = t.bbox), e.features = r, e;
}
function ze(r) {
  return !isNaN(r) && r !== null && !Array.isArray(r);
}
function Qn(r) {
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
function Zn(r) {
  return r.type === "Feature" ? r.geometry : r;
}
function $e(r, t, e) {
  if (r !== null)
    for (var n, o, s, i, a, l, c, u = 0, f = 0, h, m = r.type, y = m === "FeatureCollection", d = m === "Feature", b = y ? r.features.length : 1, E = 0; E < b; E++) {
      c = y ? (
        // @ts-expect-error: Known type conflict
        r.features[E].geometry
      ) : d ? (
        // @ts-expect-error: Known type conflict
        r.geometry
      ) : r, h = c ? c.type === "GeometryCollection" : !1, a = h ? c.geometries.length : 1;
      for (var g = 0; g < a; g++) {
        var w = 0, p = 0;
        if (i = h ? c.geometries[g] : c, i !== null) {
          l = i.coordinates;
          var S = i.type;
          switch (u = e && (S === "Polygon" || S === "MultiPolygon") ? 1 : 0, S) {
            case null:
              break;
            case "Point":
              if (
                // @ts-expect-error: Known type conflict
                t(
                  l,
                  f,
                  E,
                  w,
                  p
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
                    E,
                    w,
                    p
                  ) === !1
                )
                  return !1;
                f++, S === "MultiPoint" && w++;
              }
              S === "LineString" && w++;
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
                      E,
                      w,
                      p
                    ) === !1
                  )
                    return !1;
                  f++;
                }
                S === "MultiLineString" && w++, S === "Polygon" && p++;
              }
              S === "Polygon" && w++;
              break;
            case "MultiPolygon":
              for (n = 0; n < l.length; n++) {
                for (p = 0, o = 0; o < l[n].length; o++) {
                  for (s = 0; s < l[n][o].length - u; s++) {
                    if (
                      // @ts-expect-error: Known type conflict
                      t(
                        l[n][o][s],
                        f,
                        E,
                        w,
                        p
                      ) === !1
                    )
                      return !1;
                    f++;
                  }
                  p++;
                }
                w++;
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
const pt = 11102230246251565e-32, U = 134217729, Pn = (3 + 8 * pt) * pt;
function ht(r, t, e, n, o) {
  let s, i, a, l, c = t[0], u = n[0], f = 0, h = 0;
  u > c == u > -c ? (s = c, c = t[++f]) : (s = u, u = n[++h]);
  let m = 0;
  if (f < r && h < e)
    for (u > c == u > -c ? (i = c + s, a = s - (i - c), c = t[++f]) : (i = u + s, a = s - (i - u), u = n[++h]), s = i, a !== 0 && (o[m++] = a); f < r && h < e; )
      u > c == u > -c ? (i = s + c, l = i - s, a = s - (i - l) + (c - l), c = t[++f]) : (i = s + u, l = i - s, a = s - (i - l) + (u - l), u = n[++h]), s = i, a !== 0 && (o[m++] = a);
  for (; f < r; )
    i = s + c, l = i - s, a = s - (i - l) + (c - l), c = t[++f], s = i, a !== 0 && (o[m++] = a);
  for (; h < e; )
    i = s + u, l = i - s, a = s - (i - l) + (u - l), u = n[++h], s = i, a !== 0 && (o[m++] = a);
  return (s !== 0 || m === 0) && (o[m++] = s), m;
}
function Mt(r, t, e, n, o, s, i, a) {
  return ht(ht(r, t, e, n, i), i, o, s, a);
}
function L(r, t, e, n) {
  let o, s, i, a, l, c, u, f, h, m, y;
  u = U * e, m = u - (u - e), y = e - m;
  let d = t[0];
  o = d * e, u = U * d, f = u - (u - d), h = d - f, i = h * y - (o - f * m - h * m - f * y);
  let b = 0;
  i !== 0 && (n[b++] = i);
  for (let E = 1; E < r; E++)
    d = t[E], a = d * e, u = U * d, f = u - (u - d), h = d - f, l = h * y - (a - f * m - h * m - f * y), s = o + l, c = s - o, i = o - (s - c) + (l - c), i !== 0 && (n[b++] = i), o = a + s, i = s - (o - a), i !== 0 && (n[b++] = i);
  return (o !== 0 || b === 0) && (n[b++] = o), b;
}
function Dn(r, t) {
  let e = t[0];
  for (let n = 1; n < r; n++) e += t[n];
  return e;
}
function tt(r) {
  return new Float64Array(r);
}
const ti = (3 + 16 * pt) * pt, ei = (2 + 12 * pt) * pt, ni = (9 + 64 * pt) * pt * pt, qt = tt(4), He = tt(8), Ke = tt(12), We = tt(16), gt = tt(4);
function ii(r, t, e, n, o, s, i) {
  let a, l, c, u, f, h, m, y, d, b, E, g, w, p, S, _, I, k;
  const A = r - o, O = e - o, N = t - s, D = n - s;
  p = A * D, h = U * A, m = h - (h - A), y = A - m, h = U * D, d = h - (h - D), b = D - d, S = y * b - (p - m * d - y * d - m * b), _ = N * O, h = U * N, m = h - (h - N), y = N - m, h = U * O, d = h - (h - O), b = O - d, I = y * b - (_ - m * d - y * d - m * b), E = S - I, f = S - E, qt[0] = S - (E + f) + (f - I), g = p + E, f = g - p, w = p - (g - f) + (E - f), E = w - _, f = w - E, qt[1] = w - (E + f) + (f - _), k = g + E, f = k - g, qt[2] = g - (k - f) + (E - f), qt[3] = k;
  let $ = Dn(4, qt), v = ei * i;
  if ($ >= v || -$ >= v || (f = r - A, a = r - (A + f) + (f - o), f = e - O, c = e - (O + f) + (f - o), f = t - N, l = t - (N + f) + (f - s), f = n - D, u = n - (D + f) + (f - s), a === 0 && l === 0 && c === 0 && u === 0) || (v = ni * i + Pn * Math.abs($), $ += A * u + D * a - (N * c + O * l), $ >= v || -$ >= v)) return $;
  p = a * D, h = U * a, m = h - (h - a), y = a - m, h = U * D, d = h - (h - D), b = D - d, S = y * b - (p - m * d - y * d - m * b), _ = l * O, h = U * l, m = h - (h - l), y = l - m, h = U * O, d = h - (h - O), b = O - d, I = y * b - (_ - m * d - y * d - m * b), E = S - I, f = S - E, gt[0] = S - (E + f) + (f - I), g = p + E, f = g - p, w = p - (g - f) + (E - f), E = w - _, f = w - E, gt[1] = w - (E + f) + (f - _), k = g + E, f = k - g, gt[2] = g - (k - f) + (E - f), gt[3] = k;
  const B = ht(4, qt, 4, gt, He);
  p = A * u, h = U * A, m = h - (h - A), y = A - m, h = U * u, d = h - (h - u), b = u - d, S = y * b - (p - m * d - y * d - m * b), _ = N * c, h = U * N, m = h - (h - N), y = N - m, h = U * c, d = h - (h - c), b = c - d, I = y * b - (_ - m * d - y * d - m * b), E = S - I, f = S - E, gt[0] = S - (E + f) + (f - I), g = p + E, f = g - p, w = p - (g - f) + (E - f), E = w - _, f = w - E, gt[1] = w - (E + f) + (f - _), k = g + E, f = k - g, gt[2] = g - (k - f) + (E - f), gt[3] = k;
  const M = ht(B, He, 4, gt, Ke);
  p = a * u, h = U * a, m = h - (h - a), y = a - m, h = U * u, d = h - (h - u), b = u - d, S = y * b - (p - m * d - y * d - m * b), _ = l * c, h = U * l, m = h - (h - l), y = l - m, h = U * c, d = h - (h - c), b = c - d, I = y * b - (_ - m * d - y * d - m * b), E = S - I, f = S - E, gt[0] = S - (E + f) + (f - I), g = p + E, f = g - p, w = p - (g - f) + (E - f), E = w - _, f = w - E, gt[1] = w - (E + f) + (f - _), k = g + E, f = k - g, gt[2] = g - (k - f) + (E - f), gt[3] = k;
  const T = ht(M, Ke, 4, gt, We);
  return We[T - 1];
}
function ft(r, t, e, n, o, s) {
  const i = (t - s) * (e - o), a = (r - o) * (n - s), l = i - a, c = Math.abs(i + a);
  return Math.abs(l) >= ti * c ? l : -ii(r, t, e, n, o, s, c);
}
const ri = (10 + 96 * pt) * pt, si = (4 + 48 * pt) * pt, oi = (44 + 576 * pt) * pt * pt, Tt = tt(4), Nt = tt(4), Ft = tt(4), _t = tt(4), Et = tt(4), kt = tt(4), mt = tt(4), wt = tt(4), _e = tt(8), Ee = tt(8), ke = tt(8), Ae = tt(8), Ie = tt(8), Be = tt(8), oe = tt(8), ae = tt(8), ce = tt(8), Rt = tt(4), $t = tt(4), Xt = tt(4), z = tt(8), W = tt(16), it = tt(16), rt = tt(16), et = tt(32), Pt = tt(32), ct = tt(48), vt = tt(64);
let Ht = tt(1152), Oe = tt(1152);
function lt(r, t, e) {
  r = ht(r, Ht, t, e, Oe);
  const n = Ht;
  return Ht = Oe, Oe = n, r;
}
function ai(r, t, e, n, o, s, i, a, l) {
  let c, u, f, h, m, y, d, b, E, g, w, p, S, _, I, k, A, O, N, D, $, v, B, M, T, P, C, x, F, R, X, q, Y, j, V;
  const K = r - i, H = e - i, G = o - i, J = t - a, Z = n - a, Q = s - a;
  X = H * Q, B = U * H, M = B - (B - H), T = H - M, B = U * Q, P = B - (B - Q), C = Q - P, q = T * C - (X - M * P - T * P - M * C), Y = G * Z, B = U * G, M = B - (B - G), T = G - M, B = U * Z, P = B - (B - Z), C = Z - P, j = T * C - (Y - M * P - T * P - M * C), x = q - j, v = q - x, Tt[0] = q - (x + v) + (v - j), F = X + x, v = F - X, R = X - (F - v) + (x - v), x = R - Y, v = R - x, Tt[1] = R - (x + v) + (v - Y), V = F + x, v = V - F, Tt[2] = F - (V - v) + (x - v), Tt[3] = V, X = G * J, B = U * G, M = B - (B - G), T = G - M, B = U * J, P = B - (B - J), C = J - P, q = T * C - (X - M * P - T * P - M * C), Y = K * Q, B = U * K, M = B - (B - K), T = K - M, B = U * Q, P = B - (B - Q), C = Q - P, j = T * C - (Y - M * P - T * P - M * C), x = q - j, v = q - x, Nt[0] = q - (x + v) + (v - j), F = X + x, v = F - X, R = X - (F - v) + (x - v), x = R - Y, v = R - x, Nt[1] = R - (x + v) + (v - Y), V = F + x, v = V - F, Nt[2] = F - (V - v) + (x - v), Nt[3] = V, X = K * Z, B = U * K, M = B - (B - K), T = K - M, B = U * Z, P = B - (B - Z), C = Z - P, q = T * C - (X - M * P - T * P - M * C), Y = H * J, B = U * H, M = B - (B - H), T = H - M, B = U * J, P = B - (B - J), C = J - P, j = T * C - (Y - M * P - T * P - M * C), x = q - j, v = q - x, Ft[0] = q - (x + v) + (v - j), F = X + x, v = F - X, R = X - (F - v) + (x - v), x = R - Y, v = R - x, Ft[1] = R - (x + v) + (v - Y), V = F + x, v = V - F, Ft[2] = F - (V - v) + (x - v), Ft[3] = V, c = ht(
    ht(
      ht(
        L(L(4, Tt, K, z), z, K, W),
        W,
        L(L(4, Tt, J, z), z, J, it),
        it,
        et
      ),
      et,
      ht(
        L(L(4, Nt, H, z), z, H, W),
        W,
        L(L(4, Nt, Z, z), z, Z, it),
        it,
        Pt
      ),
      Pt,
      vt
    ),
    vt,
    ht(
      L(L(4, Ft, G, z), z, G, W),
      W,
      L(L(4, Ft, Q, z), z, Q, it),
      it,
      et
    ),
    et,
    Ht
  );
  let at = Dn(c, Ht), ut = si * l;
  if (at >= ut || -at >= ut || (v = r - K, u = r - (K + v) + (v - i), v = t - J, m = t - (J + v) + (v - a), v = e - H, f = e - (H + v) + (v - i), v = n - Z, y = n - (Z + v) + (v - a), v = o - G, h = o - (G + v) + (v - i), v = s - Q, d = s - (Q + v) + (v - a), u === 0 && f === 0 && h === 0 && m === 0 && y === 0 && d === 0) || (ut = oi * l + Pn * Math.abs(at), at += (K * K + J * J) * (H * d + Q * f - (Z * h + G * y)) + 2 * (K * u + J * m) * (H * Q - Z * G) + ((H * H + Z * Z) * (G * m + J * h - (Q * u + K * d)) + 2 * (H * f + Z * y) * (G * J - Q * K)) + ((G * G + Q * Q) * (K * y + Z * u - (J * f + H * m)) + 2 * (G * h + Q * d) * (K * Z - J * H)), at >= ut || -at >= ut))
    return at;
  if ((f !== 0 || y !== 0 || h !== 0 || d !== 0) && (X = K * K, B = U * K, M = B - (B - K), T = K - M, q = T * T - (X - M * M - (M + M) * T), Y = J * J, B = U * J, M = B - (B - J), T = J - M, j = T * T - (Y - M * M - (M + M) * T), x = q + j, v = x - q, _t[0] = q - (x - v) + (j - v), F = X + x, v = F - X, R = X - (F - v) + (x - v), x = R + Y, v = x - R, _t[1] = R - (x - v) + (Y - v), V = F + x, v = V - F, _t[2] = F - (V - v) + (x - v), _t[3] = V), (h !== 0 || d !== 0 || u !== 0 || m !== 0) && (X = H * H, B = U * H, M = B - (B - H), T = H - M, q = T * T - (X - M * M - (M + M) * T), Y = Z * Z, B = U * Z, M = B - (B - Z), T = Z - M, j = T * T - (Y - M * M - (M + M) * T), x = q + j, v = x - q, Et[0] = q - (x - v) + (j - v), F = X + x, v = F - X, R = X - (F - v) + (x - v), x = R + Y, v = x - R, Et[1] = R - (x - v) + (Y - v), V = F + x, v = V - F, Et[2] = F - (V - v) + (x - v), Et[3] = V), (u !== 0 || m !== 0 || f !== 0 || y !== 0) && (X = G * G, B = U * G, M = B - (B - G), T = G - M, q = T * T - (X - M * M - (M + M) * T), Y = Q * Q, B = U * Q, M = B - (B - Q), T = Q - M, j = T * T - (Y - M * M - (M + M) * T), x = q + j, v = x - q, kt[0] = q - (x - v) + (j - v), F = X + x, v = F - X, R = X - (F - v) + (x - v), x = R + Y, v = x - R, kt[1] = R - (x - v) + (Y - v), V = F + x, v = V - F, kt[2] = F - (V - v) + (x - v), kt[3] = V), u !== 0 && (b = L(4, Tt, u, _e), c = lt(c, Mt(
    L(b, _e, 2 * K, W),
    W,
    L(L(4, kt, u, z), z, Z, it),
    it,
    L(L(4, Et, u, z), z, -Q, rt),
    rt,
    et,
    ct
  ), ct)), m !== 0 && (E = L(4, Tt, m, Ee), c = lt(c, Mt(
    L(E, Ee, 2 * J, W),
    W,
    L(L(4, Et, m, z), z, G, it),
    it,
    L(L(4, kt, m, z), z, -H, rt),
    rt,
    et,
    ct
  ), ct)), f !== 0 && (g = L(4, Nt, f, ke), c = lt(c, Mt(
    L(g, ke, 2 * H, W),
    W,
    L(L(4, _t, f, z), z, Q, it),
    it,
    L(L(4, kt, f, z), z, -J, rt),
    rt,
    et,
    ct
  ), ct)), y !== 0 && (w = L(4, Nt, y, Ae), c = lt(c, Mt(
    L(w, Ae, 2 * Z, W),
    W,
    L(L(4, kt, y, z), z, K, it),
    it,
    L(L(4, _t, y, z), z, -G, rt),
    rt,
    et,
    ct
  ), ct)), h !== 0 && (p = L(4, Ft, h, Ie), c = lt(c, Mt(
    L(p, Ie, 2 * G, W),
    W,
    L(L(4, Et, h, z), z, J, it),
    it,
    L(L(4, _t, h, z), z, -Z, rt),
    rt,
    et,
    ct
  ), ct)), d !== 0 && (S = L(4, Ft, d, Be), c = lt(c, Mt(
    L(S, Be, 2 * Q, W),
    W,
    L(L(4, _t, d, z), z, H, it),
    it,
    L(L(4, Et, d, z), z, -K, rt),
    rt,
    et,
    ct
  ), ct)), u !== 0 || m !== 0) {
    if (f !== 0 || y !== 0 || h !== 0 || d !== 0 ? (X = f * Q, B = U * f, M = B - (B - f), T = f - M, B = U * Q, P = B - (B - Q), C = Q - P, q = T * C - (X - M * P - T * P - M * C), Y = H * d, B = U * H, M = B - (B - H), T = H - M, B = U * d, P = B - (B - d), C = d - P, j = T * C - (Y - M * P - T * P - M * C), x = q + j, v = x - q, mt[0] = q - (x - v) + (j - v), F = X + x, v = F - X, R = X - (F - v) + (x - v), x = R + Y, v = x - R, mt[1] = R - (x - v) + (Y - v), V = F + x, v = V - F, mt[2] = F - (V - v) + (x - v), mt[3] = V, X = h * -Z, B = U * h, M = B - (B - h), T = h - M, B = U * -Z, P = B - (B - -Z), C = -Z - P, q = T * C - (X - M * P - T * P - M * C), Y = G * -y, B = U * G, M = B - (B - G), T = G - M, B = U * -y, P = B - (B - -y), C = -y - P, j = T * C - (Y - M * P - T * P - M * C), x = q + j, v = x - q, wt[0] = q - (x - v) + (j - v), F = X + x, v = F - X, R = X - (F - v) + (x - v), x = R + Y, v = x - R, wt[1] = R - (x - v) + (Y - v), V = F + x, v = V - F, wt[2] = F - (V - v) + (x - v), wt[3] = V, I = ht(4, mt, 4, wt, ae), X = f * d, B = U * f, M = B - (B - f), T = f - M, B = U * d, P = B - (B - d), C = d - P, q = T * C - (X - M * P - T * P - M * C), Y = h * y, B = U * h, M = B - (B - h), T = h - M, B = U * y, P = B - (B - y), C = y - P, j = T * C - (Y - M * P - T * P - M * C), x = q - j, v = q - x, $t[0] = q - (x + v) + (v - j), F = X + x, v = F - X, R = X - (F - v) + (x - v), x = R - Y, v = R - x, $t[1] = R - (x + v) + (v - Y), V = F + x, v = V - F, $t[2] = F - (V - v) + (x - v), $t[3] = V, O = 4) : (ae[0] = 0, I = 1, $t[0] = 0, O = 1), u !== 0) {
      const st = L(I, ae, u, rt);
      c = lt(c, ht(
        L(b, _e, u, W),
        W,
        L(st, rt, 2 * K, et),
        et,
        ct
      ), ct);
      const ot = L(O, $t, u, z);
      c = lt(c, Mt(
        L(ot, z, 2 * K, W),
        W,
        L(ot, z, u, it),
        it,
        L(st, rt, u, et),
        et,
        Pt,
        vt
      ), vt), y !== 0 && (c = lt(c, L(L(4, kt, u, z), z, y, W), W)), d !== 0 && (c = lt(c, L(L(4, Et, -u, z), z, d, W), W));
    }
    if (m !== 0) {
      const st = L(I, ae, m, rt);
      c = lt(c, ht(
        L(E, Ee, m, W),
        W,
        L(st, rt, 2 * J, et),
        et,
        ct
      ), ct);
      const ot = L(O, $t, m, z);
      c = lt(c, Mt(
        L(ot, z, 2 * J, W),
        W,
        L(ot, z, m, it),
        it,
        L(st, rt, m, et),
        et,
        Pt,
        vt
      ), vt);
    }
  }
  if (f !== 0 || y !== 0) {
    if (h !== 0 || d !== 0 || u !== 0 || m !== 0 ? (X = h * J, B = U * h, M = B - (B - h), T = h - M, B = U * J, P = B - (B - J), C = J - P, q = T * C - (X - M * P - T * P - M * C), Y = G * m, B = U * G, M = B - (B - G), T = G - M, B = U * m, P = B - (B - m), C = m - P, j = T * C - (Y - M * P - T * P - M * C), x = q + j, v = x - q, mt[0] = q - (x - v) + (j - v), F = X + x, v = F - X, R = X - (F - v) + (x - v), x = R + Y, v = x - R, mt[1] = R - (x - v) + (Y - v), V = F + x, v = V - F, mt[2] = F - (V - v) + (x - v), mt[3] = V, D = -Q, $ = -d, X = u * D, B = U * u, M = B - (B - u), T = u - M, B = U * D, P = B - (B - D), C = D - P, q = T * C - (X - M * P - T * P - M * C), Y = K * $, B = U * K, M = B - (B - K), T = K - M, B = U * $, P = B - (B - $), C = $ - P, j = T * C - (Y - M * P - T * P - M * C), x = q + j, v = x - q, wt[0] = q - (x - v) + (j - v), F = X + x, v = F - X, R = X - (F - v) + (x - v), x = R + Y, v = x - R, wt[1] = R - (x - v) + (Y - v), V = F + x, v = V - F, wt[2] = F - (V - v) + (x - v), wt[3] = V, k = ht(4, mt, 4, wt, ce), X = h * m, B = U * h, M = B - (B - h), T = h - M, B = U * m, P = B - (B - m), C = m - P, q = T * C - (X - M * P - T * P - M * C), Y = u * d, B = U * u, M = B - (B - u), T = u - M, B = U * d, P = B - (B - d), C = d - P, j = T * C - (Y - M * P - T * P - M * C), x = q - j, v = q - x, Xt[0] = q - (x + v) + (v - j), F = X + x, v = F - X, R = X - (F - v) + (x - v), x = R - Y, v = R - x, Xt[1] = R - (x + v) + (v - Y), V = F + x, v = V - F, Xt[2] = F - (V - v) + (x - v), Xt[3] = V, N = 4) : (ce[0] = 0, k = 1, Xt[0] = 0, N = 1), f !== 0) {
      const st = L(k, ce, f, rt);
      c = lt(c, ht(
        L(g, ke, f, W),
        W,
        L(st, rt, 2 * H, et),
        et,
        ct
      ), ct);
      const ot = L(N, Xt, f, z);
      c = lt(c, Mt(
        L(ot, z, 2 * H, W),
        W,
        L(ot, z, f, it),
        it,
        L(st, rt, f, et),
        et,
        Pt,
        vt
      ), vt), d !== 0 && (c = lt(c, L(L(4, _t, f, z), z, d, W), W)), m !== 0 && (c = lt(c, L(L(4, kt, -f, z), z, m, W), W));
    }
    if (y !== 0) {
      const st = L(k, ce, y, rt);
      c = lt(c, ht(
        L(w, Ae, y, W),
        W,
        L(st, rt, 2 * Z, et),
        et,
        ct
      ), ct);
      const ot = L(N, Xt, y, z);
      c = lt(c, Mt(
        L(ot, z, 2 * Z, W),
        W,
        L(ot, z, y, it),
        it,
        L(st, rt, y, et),
        et,
        Pt,
        vt
      ), vt);
    }
  }
  if (h !== 0 || d !== 0) {
    if (u !== 0 || m !== 0 || f !== 0 || y !== 0 ? (X = u * Z, B = U * u, M = B - (B - u), T = u - M, B = U * Z, P = B - (B - Z), C = Z - P, q = T * C - (X - M * P - T * P - M * C), Y = K * y, B = U * K, M = B - (B - K), T = K - M, B = U * y, P = B - (B - y), C = y - P, j = T * C - (Y - M * P - T * P - M * C), x = q + j, v = x - q, mt[0] = q - (x - v) + (j - v), F = X + x, v = F - X, R = X - (F - v) + (x - v), x = R + Y, v = x - R, mt[1] = R - (x - v) + (Y - v), V = F + x, v = V - F, mt[2] = F - (V - v) + (x - v), mt[3] = V, D = -J, $ = -m, X = f * D, B = U * f, M = B - (B - f), T = f - M, B = U * D, P = B - (B - D), C = D - P, q = T * C - (X - M * P - T * P - M * C), Y = H * $, B = U * H, M = B - (B - H), T = H - M, B = U * $, P = B - (B - $), C = $ - P, j = T * C - (Y - M * P - T * P - M * C), x = q + j, v = x - q, wt[0] = q - (x - v) + (j - v), F = X + x, v = F - X, R = X - (F - v) + (x - v), x = R + Y, v = x - R, wt[1] = R - (x - v) + (Y - v), V = F + x, v = V - F, wt[2] = F - (V - v) + (x - v), wt[3] = V, _ = ht(4, mt, 4, wt, oe), X = u * y, B = U * u, M = B - (B - u), T = u - M, B = U * y, P = B - (B - y), C = y - P, q = T * C - (X - M * P - T * P - M * C), Y = f * m, B = U * f, M = B - (B - f), T = f - M, B = U * m, P = B - (B - m), C = m - P, j = T * C - (Y - M * P - T * P - M * C), x = q - j, v = q - x, Rt[0] = q - (x + v) + (v - j), F = X + x, v = F - X, R = X - (F - v) + (x - v), x = R - Y, v = R - x, Rt[1] = R - (x + v) + (v - Y), V = F + x, v = V - F, Rt[2] = F - (V - v) + (x - v), Rt[3] = V, A = 4) : (oe[0] = 0, _ = 1, Rt[0] = 0, A = 1), h !== 0) {
      const st = L(_, oe, h, rt);
      c = lt(c, ht(
        L(p, Ie, h, W),
        W,
        L(st, rt, 2 * G, et),
        et,
        ct
      ), ct);
      const ot = L(A, Rt, h, z);
      c = lt(c, Mt(
        L(ot, z, 2 * G, W),
        W,
        L(ot, z, h, it),
        it,
        L(st, rt, h, et),
        et,
        Pt,
        vt
      ), vt), m !== 0 && (c = lt(c, L(L(4, Et, h, z), z, m, W), W)), y !== 0 && (c = lt(c, L(L(4, _t, -h, z), z, y, W), W));
    }
    if (d !== 0) {
      const st = L(_, oe, d, rt);
      c = lt(c, ht(
        L(S, Be, d, W),
        W,
        L(st, rt, 2 * Q, et),
        et,
        ct
      ), ct);
      const ot = L(A, Rt, d, z);
      c = lt(c, Mt(
        L(ot, z, 2 * Q, W),
        W,
        L(ot, z, d, it),
        it,
        L(st, rt, d, et),
        et,
        Pt,
        vt
      ), vt);
    }
  }
  return Ht[c - 1];
}
function ci(r, t, e, n, o, s, i, a) {
  const l = r - i, c = e - i, u = o - i, f = t - a, h = n - a, m = s - a, y = c * m, d = u * h, b = l * l + f * f, E = u * f, g = l * m, w = c * c + h * h, p = l * h, S = c * f, _ = u * u + m * m, I = b * (y - d) + w * (E - g) + _ * (p - S), k = (Math.abs(y) + Math.abs(d)) * b + (Math.abs(E) + Math.abs(g)) * w + (Math.abs(p) + Math.abs(S)) * _, A = ri * k;
  return I > A || -I > A ? I : ai(r, t, e, n, o, s, i, a, k);
}
function li(r, t) {
  var e, n, o = 0, s, i, a, l, c, u, f, h = r[0], m = r[1], y = t.length;
  for (e = 0; e < y; e++) {
    n = 0;
    var d = t[e], b = d.length - 1;
    if (u = d[0], u[0] !== d[b][0] && u[1] !== d[b][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (i = u[0] - h, a = u[1] - m, n; n < b; n++) {
      if (f = d[n + 1], l = f[0] - h, c = f[1] - m, a === 0 && c === 0) {
        if (l <= 0 && i >= 0 || i <= 0 && l >= 0)
          return 0;
      } else if (c >= 0 && a <= 0 || c <= 0 && a >= 0) {
        if (s = ft(i, l, a, c, 0, 0), s === 0)
          return 0;
        (s > 0 && c > 0 && a <= 0 || s < 0 && c <= 0 && a > 0) && o++;
      }
      u = f, a = c, i = l;
    }
  }
  return o % 2 !== 0;
}
function Ge(r, t, e = {}) {
  if (!r)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const n = Qn(r), o = Zn(t), s = o.type, i = t.bbox;
  let a = o.coordinates;
  if (i && fi(n, i) === !1)
    return !1;
  s === "Polygon" && (a = [a]);
  for (var l = 0; l < a.length; ++l) {
    const c = li(n, a[l]);
    if (c === 0 && !e.ignoreBoundary) return !0;
    if (c) return !0;
  }
  return !1;
}
function fi(r, t) {
  return t[0] <= r[0] && t[1] <= r[1] && t[2] >= r[0] && t[3] >= r[1];
}
class Xe {
  constructor(t = [], e = ui) {
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
      const s = t - 1 >> 1, i = e[s];
      if (n(o, i) >= 0) break;
      e[t] = i, t = s;
    }
    e[t] = o;
  }
  _down(t) {
    const { data: e, compare: n } = this, o = this.length >> 1, s = e[t];
    for (; t < o; ) {
      let i = (t << 1) + 1, a = e[i];
      const l = i + 1;
      if (l < this.length && n(e[l], a) < 0 && (i = l, a = e[l]), n(a, s) >= 0) break;
      e[t] = a, t = i;
    }
    e[t] = s;
  }
}
function ui(r, t) {
  return r < t ? -1 : r > t ? 1 : 0;
}
const hi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Xe
}, Symbol.toStringTag, { value: "Module" })), Bt = 11102230246251565e-32, dt = 134217729, di = (3 + 8 * Bt) * Bt;
function Te(r, t, e, n, o) {
  let s, i, a, l, c = t[0], u = n[0], f = 0, h = 0;
  u > c == u > -c ? (s = c, c = t[++f]) : (s = u, u = n[++h]);
  let m = 0;
  if (f < r && h < e)
    for (u > c == u > -c ? (i = c + s, a = s - (i - c), c = t[++f]) : (i = u + s, a = s - (i - u), u = n[++h]), s = i, a !== 0 && (o[m++] = a); f < r && h < e; )
      u > c == u > -c ? (i = s + c, l = i - s, a = s - (i - l) + (c - l), c = t[++f]) : (i = s + u, l = i - s, a = s - (i - l) + (u - l), u = n[++h]), s = i, a !== 0 && (o[m++] = a);
  for (; f < r; )
    i = s + c, l = i - s, a = s - (i - l) + (c - l), c = t[++f], s = i, a !== 0 && (o[m++] = a);
  for (; h < e; )
    i = s + u, l = i - s, a = s - (i - l) + (u - l), u = n[++h], s = i, a !== 0 && (o[m++] = a);
  return (s !== 0 || m === 0) && (o[m++] = s), m;
}
function pi(r, t) {
  let e = t[0];
  for (let n = 1; n < r; n++) e += t[n];
  return e;
}
function se(r) {
  return new Float64Array(r);
}
const gi = (3 + 16 * Bt) * Bt, mi = (2 + 12 * Bt) * Bt, wi = (9 + 64 * Bt) * Bt * Bt, Vt = se(4), Je = se(8), Qe = se(12), Ze = se(16), yt = se(4);
function yi(r, t, e, n, o, s, i) {
  let a, l, c, u, f, h, m, y, d, b, E, g, w, p, S, _, I, k;
  const A = r - o, O = e - o, N = t - s, D = n - s;
  p = A * D, h = dt * A, m = h - (h - A), y = A - m, h = dt * D, d = h - (h - D), b = D - d, S = y * b - (p - m * d - y * d - m * b), _ = N * O, h = dt * N, m = h - (h - N), y = N - m, h = dt * O, d = h - (h - O), b = O - d, I = y * b - (_ - m * d - y * d - m * b), E = S - I, f = S - E, Vt[0] = S - (E + f) + (f - I), g = p + E, f = g - p, w = p - (g - f) + (E - f), E = w - _, f = w - E, Vt[1] = w - (E + f) + (f - _), k = g + E, f = k - g, Vt[2] = g - (k - f) + (E - f), Vt[3] = k;
  let $ = pi(4, Vt), v = mi * i;
  if ($ >= v || -$ >= v || (f = r - A, a = r - (A + f) + (f - o), f = e - O, c = e - (O + f) + (f - o), f = t - N, l = t - (N + f) + (f - s), f = n - D, u = n - (D + f) + (f - s), a === 0 && l === 0 && c === 0 && u === 0) || (v = wi * i + di * Math.abs($), $ += A * u + D * a - (N * c + O * l), $ >= v || -$ >= v)) return $;
  p = a * D, h = dt * a, m = h - (h - a), y = a - m, h = dt * D, d = h - (h - D), b = D - d, S = y * b - (p - m * d - y * d - m * b), _ = l * O, h = dt * l, m = h - (h - l), y = l - m, h = dt * O, d = h - (h - O), b = O - d, I = y * b - (_ - m * d - y * d - m * b), E = S - I, f = S - E, yt[0] = S - (E + f) + (f - I), g = p + E, f = g - p, w = p - (g - f) + (E - f), E = w - _, f = w - E, yt[1] = w - (E + f) + (f - _), k = g + E, f = k - g, yt[2] = g - (k - f) + (E - f), yt[3] = k;
  const B = Te(4, Vt, 4, yt, Je);
  p = A * u, h = dt * A, m = h - (h - A), y = A - m, h = dt * u, d = h - (h - u), b = u - d, S = y * b - (p - m * d - y * d - m * b), _ = N * c, h = dt * N, m = h - (h - N), y = N - m, h = dt * c, d = h - (h - c), b = c - d, I = y * b - (_ - m * d - y * d - m * b), E = S - I, f = S - E, yt[0] = S - (E + f) + (f - I), g = p + E, f = g - p, w = p - (g - f) + (E - f), E = w - _, f = w - E, yt[1] = w - (E + f) + (f - _), k = g + E, f = k - g, yt[2] = g - (k - f) + (E - f), yt[3] = k;
  const M = Te(B, Je, 4, yt, Qe);
  p = a * u, h = dt * a, m = h - (h - a), y = a - m, h = dt * u, d = h - (h - u), b = u - d, S = y * b - (p - m * d - y * d - m * b), _ = l * c, h = dt * l, m = h - (h - l), y = l - m, h = dt * c, d = h - (h - c), b = c - d, I = y * b - (_ - m * d - y * d - m * b), E = S - I, f = S - E, yt[0] = S - (E + f) + (f - I), g = p + E, f = g - p, w = p - (g - f) + (E - f), E = w - _, f = w - E, yt[1] = w - (E + f) + (f - _), k = g + E, f = k - g, yt[2] = g - (k - f) + (E - f), yt[3] = k;
  const T = Te(M, Qe, 4, yt, Ze);
  return Ze[T - 1];
}
function tn(r, t, e, n, o, s) {
  const i = (t - s) * (e - o), a = (r - o) * (n - s), l = i - a;
  if (i === 0 || a === 0 || i > 0 != a > 0) return l;
  const c = Math.abs(i + a);
  return Math.abs(l) >= gi * c ? l : -yi(r, t, e, n, o, s, c);
}
function vi(r, t) {
  const e = new Xe([], Cn);
  return xi(r, e), Si(e, t);
}
function Cn(r, t) {
  return r.p.x > t.p.x ? 1 : r.p.x < t.p.x || r.p.x === t.p.x && (r.featureId !== t.featureId || r.ringId !== t.ringId) && r.isLeftEndpoint && !t.isLeftEndpoint ? -1 : r.p.y !== t.p.y ? r.p.y > t.p.y ? 1 : -1 : 1;
}
function bi(r, t) {
  return r.rightSweepEvent.p.x > t.rightSweepEvent.p.x ? 1 : r.rightSweepEvent.p.x < t.rightSweepEvent.p.x ? -1 : r.rightSweepEvent.p.y !== t.rightSweepEvent.p.y ? r.rightSweepEvent.p.y < t.rightSweepEvent.p.y ? 1 : -1 : 1;
}
function xi(r, t) {
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
  for (let o = 0; o < n.length; o++)
    for (let s = 0; s < n[o].length; s++) {
      let i = n[o][s][0], a = null;
      fe = fe + 1;
      for (let l = 0; l < n[o][s].length - 1; l++) {
        a = n[o][s][l + 1];
        const c = new nn(i, le, fe, ue), u = new nn(a, le, fe, ue + 1);
        c.otherEvent = u, u.otherEvent = c, Cn(c, u) > 0 ? (u.isLeftEndpoint = !0, c.isLeftEndpoint = !1) : (c.isLeftEndpoint = !0, u.isLeftEndpoint = !1), t.push(c), t.push(u), i = a, ue = ue + 1;
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
function Si(r, t = !1) {
  const e = [], n = new Xe([], bi);
  for (; r.length; ) {
    const o = r.pop();
    if (o.isLeftEndpoint) {
      const s = new Mi(o);
      for (let i = 0; i < n.data.length; i++) {
        const a = n.data[i];
        if (t && a.leftSweepEvent.featureId === o.featureId)
          continue;
        const l = _i(s, a);
        l !== !1 && e.push(l);
      }
      n.push(s);
    } else o.isLeftEndpoint === !1 && n.pop();
  }
  return e;
}
var Mi = class {
  /** @param event must have otherEvent non-null */
  constructor(r) {
    this.leftSweepEvent = r, this.rightSweepEvent = r.otherEvent;
  }
};
function _i(r, t) {
  if (r === null || t === null) return !1;
  const e = r.leftSweepEvent.p.x, n = r.leftSweepEvent.p.y, o = r.rightSweepEvent.p.x, s = r.rightSweepEvent.p.y, i = t.leftSweepEvent.p.x, a = t.leftSweepEvent.p.y, l = t.rightSweepEvent.p.x, c = t.rightSweepEvent.p.y, u = tn(e, n, o, s, i, a), f = tn(e, n, o, s, l, c);
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
  const h = (c - a) * (o - e) - (l - i) * (s - n), m = (l - i) * (n - a) - (c - a) * (e - i), y = (o - e) * (n - a) - (s - n) * (e - i);
  if (h === 0)
    return !1;
  const d = m / h, b = y / h;
  if (d >= 0 && d <= 1 && b >= 0 && b <= 1) {
    const E = e + d * (o - e), g = n + d * (s - n);
    return [E, g];
  }
  return !1;
}
function Ei(r, t, e = {}) {
  const { removeDuplicates: n = !0, ignoreSelfIntersections: o = !0 } = e;
  let s = [];
  r.type === "FeatureCollection" ? s = s.concat(r.features) : r.type === "Feature" ? s.push(r) : (r.type === "LineString" || r.type === "Polygon" || r.type === "MultiLineString" || r.type === "MultiPolygon") && s.push(ee(r)), t.type === "FeatureCollection" ? s = s.concat(t.features) : t.type === "Feature" ? s.push(t) : (t.type === "LineString" || t.type === "Polygon" || t.type === "MultiLineString" || t.type === "MultiPolygon") && s.push(ee(t));
  const i = vi(
    xt(s),
    o
  );
  let a = [];
  if (n) {
    const l = {};
    i.forEach((c) => {
      const u = c.join(",");
      l[u] || (l[u] = !0, a.push(c));
    });
  } else
    a = i;
  return xt(a.map((l) => Lt(l)));
}
function ki(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
function Ai(r) {
  if (Object.prototype.hasOwnProperty.call(r, "__esModule")) return r;
  var t = r.default;
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
  return Object.defineProperty(e, "__esModule", { value: !0 }), Object.keys(r).forEach(function(n) {
    var o = Object.getOwnPropertyDescriptor(r, n);
    Object.defineProperty(e, n, o.get ? o : {
      enumerable: !0,
      get: function() {
        return r[n];
      }
    });
  }), e;
}
function Ii(r, t = {}) {
  let e = 0, n = 0, o = 0;
  return $e(
    r,
    function(s) {
      e += s[0], n += s[1], o++;
    },
    !0
  ), Lt([e / o, n / o], t.properties);
}
var he = { exports: {} }, ye = { exports: {} }, Bi = ye.exports, rn;
function Oi() {
  return rn || (rn = 1, (function(r, t) {
    (function(e, n) {
      r.exports = n();
    })(Bi, function() {
      function e(g, w, p, S, _) {
        (function I(k, A, O, N, D) {
          for (; N > O; ) {
            if (N - O > 600) {
              var $ = N - O + 1, v = A - O + 1, B = Math.log($), M = 0.5 * Math.exp(2 * B / 3), T = 0.5 * Math.sqrt(B * M * ($ - M) / $) * (v - $ / 2 < 0 ? -1 : 1), P = Math.max(O, Math.floor(A - v * M / $ + T)), C = Math.min(N, Math.floor(A + ($ - v) * M / $ + T));
              I(k, A, P, C, D);
            }
            var x = k[A], F = O, R = N;
            for (n(k, O, A), D(k[N], x) > 0 && n(k, O, N); F < R; ) {
              for (n(k, F, R), F++, R--; D(k[F], x) < 0; ) F++;
              for (; D(k[R], x) > 0; ) R--;
            }
            D(k[O], x) === 0 ? n(k, O, R) : n(k, ++R, N), R <= A && (O = R + 1), A <= R && (N = R - 1);
          }
        })(g, w, p || 0, S || g.length - 1, _ || o);
      }
      function n(g, w, p) {
        var S = g[w];
        g[w] = g[p], g[p] = S;
      }
      function o(g, w) {
        return g < w ? -1 : g > w ? 1 : 0;
      }
      var s = function(g) {
        g === void 0 && (g = 9), this._maxEntries = Math.max(4, g), this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries)), this.clear();
      };
      function i(g, w, p) {
        if (!p) return w.indexOf(g);
        for (var S = 0; S < w.length; S++) if (p(g, w[S])) return S;
        return -1;
      }
      function a(g, w) {
        l(g, 0, g.children.length, w, g);
      }
      function l(g, w, p, S, _) {
        _ || (_ = b(null)), _.minX = 1 / 0, _.minY = 1 / 0, _.maxX = -1 / 0, _.maxY = -1 / 0;
        for (var I = w; I < p; I++) {
          var k = g.children[I];
          c(_, g.leaf ? S(k) : k);
        }
        return _;
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
      function h(g) {
        return (g.maxX - g.minX) * (g.maxY - g.minY);
      }
      function m(g) {
        return g.maxX - g.minX + (g.maxY - g.minY);
      }
      function y(g, w) {
        return g.minX <= w.minX && g.minY <= w.minY && w.maxX <= g.maxX && w.maxY <= g.maxY;
      }
      function d(g, w) {
        return w.minX <= g.maxX && w.minY <= g.maxY && w.maxX >= g.minX && w.maxY >= g.minY;
      }
      function b(g) {
        return { children: g, height: 1, leaf: !0, minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
      }
      function E(g, w, p, S, _) {
        for (var I = [w, p]; I.length; ) if (!((p = I.pop()) - (w = I.pop()) <= S)) {
          var k = w + Math.ceil((p - w) / S / 2) * S;
          e(g, k, w, p, _), I.push(w, k, k, p);
        }
      }
      return s.prototype.all = function() {
        return this._all(this.data, []);
      }, s.prototype.search = function(g) {
        var w = this.data, p = [];
        if (!d(g, w)) return p;
        for (var S = this.toBBox, _ = []; w; ) {
          for (var I = 0; I < w.children.length; I++) {
            var k = w.children[I], A = w.leaf ? S(k) : k;
            d(g, A) && (w.leaf ? p.push(k) : y(g, A) ? this._all(k, p) : _.push(k));
          }
          w = _.pop();
        }
        return p;
      }, s.prototype.collides = function(g) {
        var w = this.data;
        if (!d(g, w)) return !1;
        for (var p = []; w; ) {
          for (var S = 0; S < w.children.length; S++) {
            var _ = w.children[S], I = w.leaf ? this.toBBox(_) : _;
            if (d(g, I)) {
              if (w.leaf || y(g, I)) return !0;
              p.push(_);
            }
          }
          w = p.pop();
        }
        return !1;
      }, s.prototype.load = function(g) {
        if (!g || !g.length) return this;
        if (g.length < this._minEntries) {
          for (var w = 0; w < g.length; w++) this.insert(g[w]);
          return this;
        }
        var p = this._build(g.slice(), 0, g.length - 1, 0);
        if (this.data.children.length) if (this.data.height === p.height) this._splitRoot(this.data, p);
        else {
          if (this.data.height < p.height) {
            var S = this.data;
            this.data = p, p = S;
          }
          this._insert(p, this.data.height - p.height - 1, !0);
        }
        else this.data = p;
        return this;
      }, s.prototype.insert = function(g) {
        return g && this._insert(g, this.data.height - 1), this;
      }, s.prototype.clear = function() {
        return this.data = b([]), this;
      }, s.prototype.remove = function(g, w) {
        if (!g) return this;
        for (var p, S, _, I = this.data, k = this.toBBox(g), A = [], O = []; I || A.length; ) {
          if (I || (I = A.pop(), S = A[A.length - 1], p = O.pop(), _ = !0), I.leaf) {
            var N = i(g, I.children, w);
            if (N !== -1) return I.children.splice(N, 1), A.push(I), this._condense(A), this;
          }
          _ || I.leaf || !y(I, k) ? S ? (p++, I = S.children[p], _ = !1) : I = null : (A.push(I), O.push(p), p = 0, S = I, I = I.children[0]);
        }
        return this;
      }, s.prototype.toBBox = function(g) {
        return g;
      }, s.prototype.compareMinX = function(g, w) {
        return g.minX - w.minX;
      }, s.prototype.compareMinY = function(g, w) {
        return g.minY - w.minY;
      }, s.prototype.toJSON = function() {
        return this.data;
      }, s.prototype.fromJSON = function(g) {
        return this.data = g, this;
      }, s.prototype._all = function(g, w) {
        for (var p = []; g; ) g.leaf ? w.push.apply(w, g.children) : p.push.apply(p, g.children), g = p.pop();
        return w;
      }, s.prototype._build = function(g, w, p, S) {
        var _, I = p - w + 1, k = this._maxEntries;
        if (I <= k) return a(_ = b(g.slice(w, p + 1)), this.toBBox), _;
        S || (S = Math.ceil(Math.log(I) / Math.log(k)), k = Math.ceil(I / Math.pow(k, S - 1))), (_ = b([])).leaf = !1, _.height = S;
        var A = Math.ceil(I / k), O = A * Math.ceil(Math.sqrt(k));
        E(g, w, p, O, this.compareMinX);
        for (var N = w; N <= p; N += O) {
          var D = Math.min(N + O - 1, p);
          E(g, N, D, A, this.compareMinY);
          for (var $ = N; $ <= D; $ += A) {
            var v = Math.min($ + A - 1, D);
            _.children.push(this._build(g, $, v, S - 1));
          }
        }
        return a(_, this.toBBox), _;
      }, s.prototype._chooseSubtree = function(g, w, p, S) {
        for (; S.push(w), !w.leaf && S.length - 1 !== p; ) {
          for (var _ = 1 / 0, I = 1 / 0, k = void 0, A = 0; A < w.children.length; A++) {
            var O = w.children[A], N = h(O), D = ($ = g, v = O, (Math.max(v.maxX, $.maxX) - Math.min(v.minX, $.minX)) * (Math.max(v.maxY, $.maxY) - Math.min(v.minY, $.minY)) - N);
            D < I ? (I = D, _ = N < _ ? N : _, k = O) : D === I && N < _ && (_ = N, k = O);
          }
          w = k || w.children[0];
        }
        var $, v;
        return w;
      }, s.prototype._insert = function(g, w, p) {
        var S = p ? g : this.toBBox(g), _ = [], I = this._chooseSubtree(S, this.data, w, _);
        for (I.children.push(g), c(I, S); w >= 0 && _[w].children.length > this._maxEntries; ) this._split(_, w), w--;
        this._adjustParentBBoxes(S, _, w);
      }, s.prototype._split = function(g, w) {
        var p = g[w], S = p.children.length, _ = this._minEntries;
        this._chooseSplitAxis(p, _, S);
        var I = this._chooseSplitIndex(p, _, S), k = b(p.children.splice(I, p.children.length - I));
        k.height = p.height, k.leaf = p.leaf, a(p, this.toBBox), a(k, this.toBBox), w ? g[w - 1].children.push(k) : this._splitRoot(p, k);
      }, s.prototype._splitRoot = function(g, w) {
        this.data = b([g, w]), this.data.height = g.height + 1, this.data.leaf = !1, a(this.data, this.toBBox);
      }, s.prototype._chooseSplitIndex = function(g, w, p) {
        for (var S, _, I, k, A, O, N, D = 1 / 0, $ = 1 / 0, v = w; v <= p - w; v++) {
          var B = l(g, 0, v, this.toBBox), M = l(g, v, p, this.toBBox), T = (_ = B, I = M, k = void 0, A = void 0, O = void 0, N = void 0, k = Math.max(_.minX, I.minX), A = Math.max(_.minY, I.minY), O = Math.min(_.maxX, I.maxX), N = Math.min(_.maxY, I.maxY), Math.max(0, O - k) * Math.max(0, N - A)), P = h(B) + h(M);
          T < D ? (D = T, S = v, $ = P < $ ? P : $) : T === D && P < $ && ($ = P, S = v);
        }
        return S || p - w;
      }, s.prototype._chooseSplitAxis = function(g, w, p) {
        var S = g.leaf ? this.compareMinX : u, _ = g.leaf ? this.compareMinY : f;
        this._allDistMargin(g, w, p, S) < this._allDistMargin(g, w, p, _) && g.children.sort(S);
      }, s.prototype._allDistMargin = function(g, w, p, S) {
        g.children.sort(S);
        for (var _ = this.toBBox, I = l(g, 0, w, _), k = l(g, p - w, p, _), A = m(I) + m(k), O = w; O < p - w; O++) {
          var N = g.children[O];
          c(I, g.leaf ? _(N) : N), A += m(I);
        }
        for (var D = p - w - 1; D >= w; D--) {
          var $ = g.children[D];
          c(k, g.leaf ? _($) : $), A += m(k);
        }
        return A;
      }, s.prototype._adjustParentBBoxes = function(g, w, p) {
        for (var S = p; S >= 0; S--) c(w[S], g);
      }, s.prototype._condense = function(g) {
        for (var w = g.length - 1, p = void 0; w >= 0; w--) g[w].children.length === 0 ? w > 0 ? (p = g[w - 1].children).splice(p.indexOf(g[w]), 1) : this.clear() : a(g[w], this.toBBox);
      }, s;
    });
  })(ye)), ye.exports;
}
const Ti = /* @__PURE__ */ Ai(hi);
var Wt = { exports: {} }, Ne, sn;
function Ni() {
  return sn || (sn = 1, Ne = function(t, e, n, o) {
    var s = t[0], i = t[1], a = !1;
    n === void 0 && (n = 0), o === void 0 && (o = e.length);
    for (var l = (o - n) / 2, c = 0, u = l - 1; c < l; u = c++) {
      var f = e[n + c * 2 + 0], h = e[n + c * 2 + 1], m = e[n + u * 2 + 0], y = e[n + u * 2 + 1], d = h > i != y > i && s < (m - f) * (i - h) / (y - h) + f;
      d && (a = !a);
    }
    return a;
  }), Ne;
}
var Fe, on;
function Fi() {
  return on || (on = 1, Fe = function(t, e, n, o) {
    var s = t[0], i = t[1], a = !1;
    n === void 0 && (n = 0), o === void 0 && (o = e.length);
    for (var l = o - n, c = 0, u = l - 1; c < l; u = c++) {
      var f = e[c + n][0], h = e[c + n][1], m = e[u + n][0], y = e[u + n][1], d = h > i != y > i && s < (m - f) * (i - h) / (y - h) + f;
      d && (a = !a);
    }
    return a;
  }), Fe;
}
var an;
function Pi() {
  if (an) return Wt.exports;
  an = 1;
  var r = Ni(), t = Fi();
  return Wt.exports = function(n, o, s, i) {
    return o.length > 0 && Array.isArray(o[0]) ? t(n, o, s, i) : r(n, o, s, i);
  }, Wt.exports.nested = t, Wt.exports.flat = r, Wt.exports;
}
var Jt = { exports: {} }, Di = Jt.exports, cn;
function Ci() {
  return cn || (cn = 1, (function(r, t) {
    (function(e, n) {
      n(t);
    })(Di, function(e) {
      const o = 33306690738754706e-32;
      function s(d, b, E, g, w) {
        let p, S, _, I, k = b[0], A = g[0], O = 0, N = 0;
        A > k == A > -k ? (p = k, k = b[++O]) : (p = A, A = g[++N]);
        let D = 0;
        if (O < d && N < E) for (A > k == A > -k ? (_ = p - ((S = k + p) - k), k = b[++O]) : (_ = p - ((S = A + p) - A), A = g[++N]), p = S, _ !== 0 && (w[D++] = _); O < d && N < E; ) A > k == A > -k ? (_ = p - ((S = p + k) - (I = S - p)) + (k - I), k = b[++O]) : (_ = p - ((S = p + A) - (I = S - p)) + (A - I), A = g[++N]), p = S, _ !== 0 && (w[D++] = _);
        for (; O < d; ) _ = p - ((S = p + k) - (I = S - p)) + (k - I), k = b[++O], p = S, _ !== 0 && (w[D++] = _);
        for (; N < E; ) _ = p - ((S = p + A) - (I = S - p)) + (A - I), A = g[++N], p = S, _ !== 0 && (w[D++] = _);
        return p === 0 && D !== 0 || (w[D++] = p), D;
      }
      function i(d) {
        return new Float64Array(d);
      }
      const a = 33306690738754716e-32, l = 22204460492503146e-32, c = 11093356479670487e-47, u = i(4), f = i(8), h = i(12), m = i(16), y = i(4);
      e.orient2d = function(d, b, E, g, w, p) {
        const S = (b - p) * (E - w), _ = (d - w) * (g - p), I = S - _;
        if (S === 0 || _ === 0 || S > 0 != _ > 0) return I;
        const k = Math.abs(S + _);
        return Math.abs(I) >= a * k ? I : -(function(A, O, N, D, $, v, B) {
          let M, T, P, C, x, F, R, X, q, Y, j, V, K, H, G, J, Z, Q;
          const at = A - $, ut = N - $, st = O - v, ot = D - v;
          x = (G = (X = at - (R = (F = 134217729 * at) - (F - at))) * (Y = ot - (q = (F = 134217729 * ot) - (F - ot))) - ((H = at * ot) - R * q - X * q - R * Y)) - (j = G - (Z = (X = st - (R = (F = 134217729 * st) - (F - st))) * (Y = ut - (q = (F = 134217729 * ut) - (F - ut))) - ((J = st * ut) - R * q - X * q - R * Y))), u[0] = G - (j + x) + (x - Z), x = (K = H - ((V = H + j) - (x = V - H)) + (j - x)) - (j = K - J), u[1] = K - (j + x) + (x - J), x = (Q = V + j) - V, u[2] = V - (Q - x) + (j - x), u[3] = Q;
          let Ot = (function(Hn, qe) {
            let Ve = qe[0];
            for (let Se = 1; Se < Hn; Se++) Ve += qe[Se];
            return Ve;
          })(4, u), Kt = l * B;
          if (Ot >= Kt || -Ot >= Kt || (M = A - (at + (x = A - at)) + (x - $), P = N - (ut + (x = N - ut)) + (x - $), T = O - (st + (x = O - st)) + (x - v), C = D - (ot + (x = D - ot)) + (x - v), M === 0 && T === 0 && P === 0 && C === 0) || (Kt = c * B + o * Math.abs(Ot), (Ot += at * C + ot * M - (st * P + ut * T)) >= Kt || -Ot >= Kt)) return Ot;
          x = (G = (X = M - (R = (F = 134217729 * M) - (F - M))) * (Y = ot - (q = (F = 134217729 * ot) - (F - ot))) - ((H = M * ot) - R * q - X * q - R * Y)) - (j = G - (Z = (X = T - (R = (F = 134217729 * T) - (F - T))) * (Y = ut - (q = (F = 134217729 * ut) - (F - ut))) - ((J = T * ut) - R * q - X * q - R * Y))), y[0] = G - (j + x) + (x - Z), x = (K = H - ((V = H + j) - (x = V - H)) + (j - x)) - (j = K - J), y[1] = K - (j + x) + (x - J), x = (Q = V + j) - V, y[2] = V - (Q - x) + (j - x), y[3] = Q;
          const jn = s(4, u, 4, y, f);
          x = (G = (X = at - (R = (F = 134217729 * at) - (F - at))) * (Y = C - (q = (F = 134217729 * C) - (F - C))) - ((H = at * C) - R * q - X * q - R * Y)) - (j = G - (Z = (X = st - (R = (F = 134217729 * st) - (F - st))) * (Y = P - (q = (F = 134217729 * P) - (F - P))) - ((J = st * P) - R * q - X * q - R * Y))), y[0] = G - (j + x) + (x - Z), x = (K = H - ((V = H + j) - (x = V - H)) + (j - x)) - (j = K - J), y[1] = K - (j + x) + (x - J), x = (Q = V + j) - V, y[2] = V - (Q - x) + (j - x), y[3] = Q;
          const Un = s(jn, f, 4, y, h);
          x = (G = (X = M - (R = (F = 134217729 * M) - (F - M))) * (Y = C - (q = (F = 134217729 * C) - (F - C))) - ((H = M * C) - R * q - X * q - R * Y)) - (j = G - (Z = (X = T - (R = (F = 134217729 * T) - (F - T))) * (Y = P - (q = (F = 134217729 * P) - (F - P))) - ((J = T * P) - R * q - X * q - R * Y))), y[0] = G - (j + x) + (x - Z), x = (K = H - ((V = H + j) - (x = V - H)) + (j - x)) - (j = K - J), y[1] = K - (j + x) + (x - J), x = (Q = V + j) - V, y[2] = V - (Q - x) + (j - x), y[3] = Q;
          const zn = s(Un, h, 4, y, m);
          return m[zn - 1];
        })(d, b, E, g, w, p, k);
      }, e.orient2dfast = function(d, b, E, g, w, p) {
        return (b - p) * (E - w) - (d - w) * (g - p);
      }, Object.defineProperty(e, "__esModule", { value: !0 });
    });
  })(Jt, Jt.exports)), Jt.exports;
}
var ln;
function Ri() {
  if (ln) return he.exports;
  ln = 1;
  var r = Oi(), t = Ti, e = Pi(), n = Ci().orient2d;
  t.default && (t = t.default), he.exports = o, he.exports.default = o;
  function o(p, S, _) {
    S = Math.max(0, S === void 0 ? 2 : S), _ = _ || 0;
    var I = m(p), k = new r(16);
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
    }, k.load(p);
    for (var A = [], O = 0, N; O < I.length; O++) {
      var D = I[O];
      k.remove(D), N = y(D, N), A.push(N);
    }
    var $ = new r(16);
    for (O = 0; O < A.length; O++) $.insert(h(A[O]));
    for (var v = S * S, B = _ * _; A.length; ) {
      var M = A.shift(), T = M.p, P = M.next.p, C = d(T, P);
      if (!(C < B)) {
        var x = C / v;
        D = s(k, M.prev.p, T, P, M.next.next.p, x, $), D && Math.min(d(D, T), d(D, P)) <= x && (A.push(M), A.push(y(D, M)), k.remove(D), $.remove(M), $.insert(h(M)), $.insert(h(M.next)));
      }
    }
    M = N;
    var F = [];
    do
      F.push(M.p), M = M.next;
    while (M !== N);
    return F.push(M.p), F;
  }
  function s(p, S, _, I, k, A, O) {
    for (var N = new t([], i), D = p.data; D; ) {
      for (var $ = 0; $ < D.children.length; $++) {
        var v = D.children[$], B = D.leaf ? b(v, _, I) : a(_, I, v);
        B > A || N.push({
          node: v,
          dist: B
        });
      }
      for (; N.length && !N.peek().node.children; ) {
        var M = N.pop(), T = M.node, P = b(T, S, _), C = b(T, I, k);
        if (M.dist < P && M.dist < C && c(_, T, O) && c(I, T, O)) return T;
      }
      D = N.pop(), D && (D = D.node);
    }
    return null;
  }
  function i(p, S) {
    return p.dist - S.dist;
  }
  function a(p, S, _) {
    if (l(p, _) || l(S, _)) return 0;
    var I = E(p[0], p[1], S[0], S[1], _.minX, _.minY, _.maxX, _.minY);
    if (I === 0) return 0;
    var k = E(p[0], p[1], S[0], S[1], _.minX, _.minY, _.minX, _.maxY);
    if (k === 0) return 0;
    var A = E(p[0], p[1], S[0], S[1], _.maxX, _.minY, _.maxX, _.maxY);
    if (A === 0) return 0;
    var O = E(p[0], p[1], S[0], S[1], _.minX, _.maxY, _.maxX, _.maxY);
    return O === 0 ? 0 : Math.min(I, k, A, O);
  }
  function l(p, S) {
    return p[0] >= S.minX && p[0] <= S.maxX && p[1] >= S.minY && p[1] <= S.maxY;
  }
  function c(p, S, _) {
    for (var I = Math.min(p[0], S[0]), k = Math.min(p[1], S[1]), A = Math.max(p[0], S[0]), O = Math.max(p[1], S[1]), N = _.search({ minX: I, minY: k, maxX: A, maxY: O }), D = 0; D < N.length; D++)
      if (f(N[D].p, N[D].next.p, p, S)) return !1;
    return !0;
  }
  function u(p, S, _) {
    return n(p[0], p[1], S[0], S[1], _[0], _[1]);
  }
  function f(p, S, _, I) {
    return p !== I && S !== _ && u(p, S, _) > 0 != u(p, S, I) > 0 && u(_, I, p) > 0 != u(_, I, S) > 0;
  }
  function h(p) {
    var S = p.p, _ = p.next.p;
    return p.minX = Math.min(S[0], _[0]), p.minY = Math.min(S[1], _[1]), p.maxX = Math.max(S[0], _[0]), p.maxY = Math.max(S[1], _[1]), p;
  }
  function m(p) {
    for (var S = p[0], _ = p[0], I = p[0], k = p[0], A = 0; A < p.length; A++) {
      var O = p[A];
      O[0] < S[0] && (S = O), O[0] > I[0] && (I = O), O[1] < _[1] && (_ = O), O[1] > k[1] && (k = O);
    }
    var N = [S, _, I, k], D = N.slice();
    for (A = 0; A < p.length; A++)
      e(p[A], N) || D.push(p[A]);
    return w(D);
  }
  function y(p, S) {
    var _ = {
      p,
      prev: null,
      next: null,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };
    return S ? (_.next = S.next, _.prev = S, S.next.prev = _, S.next = _) : (_.prev = _, _.next = _), _;
  }
  function d(p, S) {
    var _ = p[0] - S[0], I = p[1] - S[1];
    return _ * _ + I * I;
  }
  function b(p, S, _) {
    var I = S[0], k = S[1], A = _[0] - I, O = _[1] - k;
    if (A !== 0 || O !== 0) {
      var N = ((p[0] - I) * A + (p[1] - k) * O) / (A * A + O * O);
      N > 1 ? (I = _[0], k = _[1]) : N > 0 && (I += A * N, k += O * N);
    }
    return A = p[0] - I, O = p[1] - k, A * A + O * O;
  }
  function E(p, S, _, I, k, A, O, N) {
    var D = _ - p, $ = I - S, v = O - k, B = N - A, M = p - k, T = S - A, P = D * D + $ * $, C = D * v + $ * B, x = v * v + B * B, F = D * M + $ * T, R = v * M + B * T, X = P * x - C * C, q, Y, j, V, K = X, H = X;
    X === 0 ? (Y = 0, K = 1, V = R, H = x) : (Y = C * R - x * F, V = P * R - C * F, Y < 0 ? (Y = 0, V = R, H = x) : Y > K && (Y = K, V = R + C, H = x)), V < 0 ? (V = 0, -F < 0 ? Y = 0 : -F > P ? Y = K : (Y = -F, K = P)) : V > H && (V = H, -F + C < 0 ? Y = 0 : -F + C > P ? Y = K : (Y = -F + C, K = P)), q = Y === 0 ? 0 : Y / K, j = V === 0 ? 0 : V / H;
    var G = (1 - q) * p + q * _, J = (1 - q) * S + q * I, Z = (1 - j) * k + j * O, Q = (1 - j) * A + j * N, at = Z - G, ut = Q - J;
    return at * at + ut * ut;
  }
  function g(p, S) {
    return p[0] === S[0] ? p[1] - S[1] : p[0] - S[0];
  }
  function w(p) {
    p.sort(g);
    for (var S = [], _ = 0; _ < p.length; _++) {
      for (; S.length >= 2 && u(S[S.length - 2], S[S.length - 1], p[_]) <= 0; )
        S.pop();
      S.push(p[_]);
    }
    for (var I = [], k = p.length - 1; k >= 0; k--) {
      for (; I.length >= 2 && u(I[I.length - 2], I[I.length - 1], p[k]) <= 0; )
        I.pop();
      I.push(p[k]);
    }
    return I.pop(), S.pop(), S.concat(I);
  }
  return he.exports;
}
var $i = Ri();
const Xi = /* @__PURE__ */ ki($i);
function fn(r, t = {}) {
  t.concavity = t.concavity || 1 / 0;
  const e = [];
  if ($e(r, (o) => {
    e.push([o[0], o[1]]);
  }), !e.length)
    return null;
  const n = Xi(e, t.concavity);
  return n.length > 3 ? re([n], t.properties) : null;
}
const un = Math.pow(2, -52), de = new Uint32Array(512);
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
  static from(t, e = ji, n = Ui) {
    const o = t.length, s = new Float64Array(o * 2);
    for (let i = 0; i < o; i++) {
      const a = t[i];
      s[2 * i] = e(a), s[2 * i + 1] = n(a);
    }
    return new Ye(s);
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
    const { coords: t, _hullPrev: e, _hullNext: n, _hullTri: o, _hullHash: s } = this, i = t.length >> 1;
    let a = 1 / 0, l = 1 / 0, c = -1 / 0, u = -1 / 0;
    for (let A = 0; A < i; A++) {
      const O = t[2 * A], N = t[2 * A + 1];
      O < a && (a = O), N < l && (l = N), O > c && (c = O), N > u && (u = N), this._ids[A] = A;
    }
    const f = (a + c) / 2, h = (l + u) / 2;
    let m = 0, y = 0, d = 0;
    for (let A = 0, O = 1 / 0; A < i; A++) {
      const N = Pe(f, h, t[2 * A], t[2 * A + 1]);
      N < O && (m = A, O = N);
    }
    const b = t[2 * m], E = t[2 * m + 1];
    for (let A = 0, O = 1 / 0; A < i; A++) {
      if (A === m) continue;
      const N = Pe(b, E, t[2 * A], t[2 * A + 1]);
      N < O && N > 0 && (y = A, O = N);
    }
    let g = t[2 * y], w = t[2 * y + 1], p = 1 / 0;
    for (let A = 0; A < i; A++) {
      if (A === m || A === y) continue;
      const O = qi(b, E, g, w, t[2 * A], t[2 * A + 1]);
      O < p && (d = A, p = O);
    }
    let S = t[2 * d], _ = t[2 * d + 1];
    if (p === 1 / 0) {
      for (let N = 0; N < i; N++)
        this._dists[N] = t[2 * N] - t[0] || t[2 * N + 1] - t[1];
      zt(this._ids, this._dists, 0, i - 1);
      const A = new Uint32Array(i);
      let O = 0;
      for (let N = 0, D = -1 / 0; N < i; N++) {
        const $ = this._ids[N], v = this._dists[$];
        v > D && (A[O++] = $, D = v);
      }
      this.hull = A.subarray(0, O), this.triangles = new Uint32Array(0), this.halfedges = new Int32Array(0);
      return;
    }
    if (ft(b, E, g, w, S, _) < 0) {
      const A = y, O = g, N = w;
      y = d, g = S, w = _, d = A, S = O, _ = N;
    }
    const I = Vi(b, E, g, w, S, _);
    this._cx = I.x, this._cy = I.y;
    for (let A = 0; A < i; A++)
      this._dists[A] = Pe(t[2 * A], t[2 * A + 1], I.x, I.y);
    zt(this._ids, this._dists, 0, i - 1), this._hullStart = m;
    let k = 3;
    n[m] = e[d] = y, n[y] = e[m] = d, n[d] = e[y] = m, o[m] = 0, o[y] = 1, o[d] = 2, s.fill(-1), s[this._hashKey(b, E)] = m, s[this._hashKey(g, w)] = y, s[this._hashKey(S, _)] = d, this.trianglesLen = 0, this._addTriangle(m, y, d, -1, -1, -1);
    for (let A = 0, O = 0, N = 0; A < this._ids.length; A++) {
      const D = this._ids[A], $ = t[2 * D], v = t[2 * D + 1];
      if (A > 0 && Math.abs($ - O) <= un && Math.abs(v - N) <= un || (O = $, N = v, D === m || D === y || D === d)) continue;
      let B = 0;
      for (let x = 0, F = this._hashKey($, v); x < this._hashSize && (B = s[(F + x) % this._hashSize], !(B !== -1 && B !== n[B])); x++)
        ;
      B = e[B];
      let M = B, T;
      for (; T = n[M], ft($, v, t[2 * M], t[2 * M + 1], t[2 * T], t[2 * T + 1]) >= 0; )
        if (M = T, M === B) {
          M = -1;
          break;
        }
      if (M === -1) continue;
      let P = this._addTriangle(M, D, n[M], -1, -1, o[M]);
      o[D] = this._legalize(P + 2), o[M] = P, k++;
      let C = n[M];
      for (; T = n[C], ft($, v, t[2 * C], t[2 * C + 1], t[2 * T], t[2 * T + 1]) < 0; )
        P = this._addTriangle(C, D, T, o[D], -1, o[C]), o[D] = this._legalize(P + 2), n[C] = C, k--, C = T;
      if (M === B)
        for (; T = e[M], ft($, v, t[2 * T], t[2 * T + 1], t[2 * M], t[2 * M + 1]) < 0; )
          P = this._addTriangle(T, D, M, -1, o[M], o[T]), this._legalize(P + 2), o[T] = P, n[M] = M, k--, M = T;
      this._hullStart = e[D] = M, n[M] = e[C] = D, n[D] = C, s[this._hashKey($, v)] = D, s[this._hashKey(t[2 * M], t[2 * M + 1])] = M;
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
    let s = 0, i = 0;
    for (; ; ) {
      const a = n[t], l = t - t % 3;
      if (i = l + (t + 2) % 3, a === -1) {
        if (s === 0) break;
        t = de[--s];
        continue;
      }
      const c = a - a % 3, u = l + (t + 1) % 3, f = c + (a + 2) % 3, h = e[i], m = e[t], y = e[u], d = e[f];
      if (Li(
        o[2 * h],
        o[2 * h + 1],
        o[2 * m],
        o[2 * m + 1],
        o[2 * y],
        o[2 * y + 1],
        o[2 * d],
        o[2 * d + 1]
      )) {
        e[t] = d, e[a] = h;
        const E = n[f];
        if (E === -1) {
          let w = this._hullStart;
          do {
            if (this._hullTri[w] === f) {
              this._hullTri[w] = t;
              break;
            }
            w = this._hullPrev[w];
          } while (w !== this._hullStart);
        }
        this._link(t, E), this._link(a, n[i]), this._link(i, f);
        const g = c + (a + 1) % 3;
        s < de.length && (de[s++] = g);
      } else {
        if (s === 0) break;
        t = de[--s];
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
  _addTriangle(t, e, n, o, s, i) {
    const a = this.trianglesLen;
    return this._triangles[a] = t, this._triangles[a + 1] = e, this._triangles[a + 2] = n, this._link(a, o), this._link(a + 1, s), this._link(a + 2, i), this.trianglesLen += 3, a;
  }
}
function Yi(r, t) {
  const e = r / (Math.abs(r) + Math.abs(t));
  return (t > 0 ? 3 - e : 1 + e) / 4;
}
function Pe(r, t, e, n) {
  const o = r - e, s = t - n;
  return o * o + s * s;
}
function Li(r, t, e, n, o, s, i, a) {
  const l = r - i, c = t - a, u = e - i, f = n - a, h = o - i, m = s - a, y = l * l + c * c, d = u * u + f * f, b = h * h + m * m;
  return l * (f * b - d * m) - c * (u * b - d * h) + y * (u * m - f * h) < 0;
}
function qi(r, t, e, n, o, s) {
  const i = e - r, a = n - t, l = o - r, c = s - t, u = i * i + a * a, f = l * l + c * c, h = 0.5 / (i * c - a * l), m = (c * u - a * f) * h, y = (i * f - l * u) * h;
  return m * m + y * y;
}
function Vi(r, t, e, n, o, s) {
  const i = e - r, a = n - t, l = o - r, c = s - t, u = i * i + a * a, f = l * l + c * c, h = 0.5 / (i * c - a * l), m = r + (c * u - a * f) * h, y = t + (i * f - l * u) * h;
  return { x: m, y };
}
function zt(r, t, e, n) {
  if (n - e <= 20)
    for (let o = e + 1; o <= n; o++) {
      const s = r[o], i = t[s];
      let a = o - 1;
      for (; a >= e && t[r[a]] > i; ) r[a + 1] = r[a--];
      r[a + 1] = s;
    }
  else {
    const o = e + n >> 1;
    let s = e + 1, i = n;
    Gt(r, o, s), t[r[e]] > t[r[n]] && Gt(r, e, n), t[r[s]] > t[r[n]] && Gt(r, s, n), t[r[e]] > t[r[s]] && Gt(r, e, s);
    const a = r[s], l = t[a];
    for (; ; ) {
      do
        s++;
      while (t[r[s]] < l);
      do
        i--;
      while (t[r[i]] > l);
      if (i < s) break;
      Gt(r, s, i);
    }
    r[e + 1] = r[i], r[i] = a, n - s + 1 >= i - e ? (zt(r, t, s, n), zt(r, t, e, i - 1)) : (zt(r, t, e, i - 1), zt(r, t, s, n));
  }
}
function Gt(r, t, e) {
  const n = r[t];
  r[t] = r[e], r[e] = n;
}
function ji(r) {
  return r[0];
}
function Ui(r) {
  return r[1];
}
class zi {
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
    const n = Math.floor(t / this.width), s = 1 << t % this.width;
    return this.bs[n] ^= (-Number(e) ^ this.bs[n]) & s, e;
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
class hn extends zi {
  constructor(t) {
    super(8, new Uint8Array(Math.ceil(t / 8)).fill(0));
  }
}
function At(r) {
  return r % 3 === 2 ? r - 2 : r + 1;
}
function St(r) {
  return r % 3 === 0 ? r + 2 : r - 1;
}
function dn(r, t, e, n, o, s, i, a) {
  const l = ft(r, t, o, s, i, a), c = ft(e, n, o, s, i, a);
  if (l > 0 && c > 0 || l < 0 && c < 0)
    return !1;
  const u = ft(o, s, r, t, e, n), f = ft(i, a, r, t, e, n);
  return u > 0 && f > 0 || u < 0 && f < 0 ? !1 : l === 0 && c === 0 && u === 0 && f === 0 ? !(Math.max(o, i) < Math.min(r, e) || Math.max(r, e) < Math.min(o, i) || Math.max(s, a) < Math.min(t, n) || Math.max(t, n) < Math.min(s, a)) : !0;
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
    const n = 2 ** 32 - 1, o = t.coords.length >> 1, s = t.triangles.length;
    this.vertMap = new Uint32Array(o).fill(n), this.flips = new hn(s), this.consd = new hn(s);
    for (let i = 0; i < s; i++) {
      const a = t.triangles[i];
      this.vertMap[a] === n && this.updateVert(i);
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
    const s = this.vertMap[t], i = this.maxConstrainSteps();
    let a = 0, l = s;
    do {
      if (++a > i)
        throw new Error(
          `Constraining edge [${t}, ${e}] exceeded the iteration limit`
        );
      const f = n[l], h = At(l);
      if (f === e)
        return this.protect(l);
      const m = St(l), y = n[m];
      if (y === e)
        return this.protect(h), h;
      if (this.intersectSegments(t, e, y, f)) {
        l = m;
        break;
      }
      l = o[h];
    } while (l !== -1 && l !== s);
    let c = l, u = -1;
    for (; l !== -1; ) {
      if (++a > i)
        throw new Error(
          `Constraining edge [${t}, ${e}] exceeded the iteration limit`
        );
      const f = o[l], h = St(l), m = St(f), y = At(f);
      if (f === -1)
        throw new Error("Constraining edge exited the hull");
      if (this.consd.has(l))
        throw new Error("Edge intersects already constrained edge");
      if (this.isCollinear(t, e, n[l]) || this.isCollinear(t, e, n[f]))
        throw new Error("Constraining edge intersects point");
      if (!this.intersectSegments(
        n[l],
        n[f],
        n[h],
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
        n[h],
        n[m]
      ) && (u === -1 && (u = h), u === h))
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
    const { halfedges: e } = this.del, n = this.flips, o = this.consd, s = e.length;
    let i;
    do {
      i = 0;
      for (let a = 0; a < s; a++) {
        if (o.has(a))
          continue;
        n.delete(a);
        const l = e[a];
        l !== -1 && (n.delete(l), this.isDelaunay(a) || (this.flipDiagonal(a), i++));
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
    const { triangles: n, halfedges: o } = this.del, s = n.length / 3, i = (y, d, b) => {
      const E = t(d), g = t(b);
      return t(y).some((w) => E.includes(w) && g.includes(w));
    }, a = (y) => i(n[y * 3], n[y * 3 + 1], n[y * 3 + 2]), l = (y, d, b, E) => Math.sign(ft(y[d * 2], y[d * 2 + 1], y[b * 2], y[b * 2 + 1], y[E * 2], y[E * 2 + 1])), c = e.map((y) => {
      let d = 0;
      for (let b = 0; b < s; b++) d += l(y, n[b * 3], n[b * 3 + 1], n[b * 3 + 2]);
      return d < 0 ? -1 : 1;
    }), u = (y) => {
      if (this.consd.has(y)) return !1;
      const d = o[y];
      if (d === -1) return !1;
      const b = n[y], E = n[At(y)], g = n[St(y)], w = n[St(d)];
      return e.every((p, S) => l(p, g, b, w) === c[S] && l(p, w, E, g) === c[S]);
    };
    let f = 0, h = !0;
    for (; h; ) {
      h = !1;
      for (let y = 0; y < s; y++)
        if (a(y))
          for (let d = 0; d < 3; d++) {
            const b = y * 3 + d;
            if (!u(b)) continue;
            const E = o[b], g = n[b], w = n[At(b)], p = n[St(b)], S = n[St(E)];
            if (!(i(p, g, S) && i(S, w, p))) {
              this.protect(this.flipDiagonal(b)), f++, h = !0;
              break;
            }
          }
    }
    let m = 0;
    for (let y = 0; y < s; y++) a(y) && m++;
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
    const n = this.vertMap[e], { triangles: o, halfedges: s } = this.del;
    if (!(n < o.length))
      return 1 / 0;
    let i = n, a, l = 0;
    do {
      if (++l > o.length)
        throw new Error(
          `Looking up edge [${t}, ${e}] exceeded the iteration limit`
        );
      if (o[i] === t)
        return i;
      a = At(i), i = s[a];
    } while (i !== -1 && i !== n);
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
    const s = e[t];
    return s !== -1 && (n.add(t), n.add(s)), !0;
  }
  /**
   * Flip the edge shared by two triangles.
   */
  flipDiagonal(t) {
    const { triangles: e, halfedges: n } = this.del, o = this.flips, s = this.consd, i = n[t], a = St(t), l = At(t), c = St(i), u = At(i), f = n[a], h = n[c];
    if (s.has(t))
      throw new Error("Trying to flip a constrained edge");
    return e[t] = e[c], n[t] = h, o.set(t, o.has(c)) || s.set(t, s.has(c)), h !== -1 && (n[h] = t), n[a] = c, e[i] = e[a], n[i] = f, o.set(i, o.has(a)) || s.set(i, s.has(a)), f !== -1 && (n[f] = i), n[c] = a, this.markFlip(t), this.markFlip(l), this.markFlip(i), this.markFlip(u), o.add(a), s.delete(a), o.add(c), s.delete(c), this.updateVert(t), this.updateVert(l), this.updateVert(i), this.updateVert(u), a;
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
    const s = this.del.coords;
    return ci(
      s[t * 2],
      s[t * 2 + 1],
      s[e * 2],
      s[e * 2 + 1],
      s[n * 2],
      s[n * 2 + 1],
      s[o * 2],
      s[o * 2 + 1]
    ) < 0;
  }
  /**
   * Whether the triangles sharing edg conform to the Delaunay condition.
   */
  isDelaunay(t) {
    const { triangles: e, halfedges: n } = this.del, o = n[t];
    if (o === -1)
      return !0;
    const s = e[St(t)], i = e[t], a = e[At(t)], l = e[St(o)];
    return !this.inCircle(s, i, a, l);
  }
  /**
   * Update the vertex -> incoming edge map.
   */
  updateVert(t) {
    const { triangles: e, halfedges: n } = this.del, o = this.vertMap, s = e[t];
    let i = St(t), a = n[i];
    for (; a !== -1 && a !== t; )
      i = St(a), a = n[i];
    return o[s] = i, i;
  }
  /**
   * Whether the segments between vertices intersect.
   */
  intersectSegments(t, e, n, o) {
    const s = this.del.coords;
    return t === n || t === o || e === n || e === o ? !1 : dn(
      s[t * 2],
      s[t * 2 + 1],
      s[e * 2],
      s[e * 2 + 1],
      s[n * 2],
      s[n * 2 + 1],
      s[o * 2],
      s[o * 2 + 1]
    );
  }
  static intersectSegments = dn;
}
function pe(r, t, e) {
  return Ce(r, t, e).tin;
}
function Ce(r, t, e, n, o) {
  if (t || (t = []), typeof r != "object" || r.type !== "FeatureCollection")
    throw "Argument points must be FeatureCollection";
  if (!Array.isArray(t)) throw "Argument points must be Array of Array";
  const s = r.features.map(
    (d) => d.geometry.coordinates
  );
  let i = o?.snapshot ? te.restore(o.snapshot) : void 0;
  const a = i ? void 0 : Ye.from(s);
  let l = i ? i.del : a, c = 0, u;
  const f = [];
  if (l.triangles.length !== 0 && (t.length !== 0 || n)) {
    if (!i) {
      i = new te(l);
      try {
        i.constrainAll(t);
      } catch (E) {
        if (!n?.allowUnusableBoundary) throw E;
        return { tin: xt([]), remaining: 0, hasBoundary: !1, hull: [] };
      }
      o && (o.snapshot = i.snapshot());
    }
    const d = n ? o?.snapshot ?? i.snapshot() : void 0, b = (E) => {
      const g = te.restore(d);
      return g.constrainAll(E), g;
    };
    for (const E of n?.hull ?? [])
      try {
        i.constrainOne(E[0], E[1]), f.push(E);
      } catch {
        i = b(f);
      }
    n?.boundary && (u = Ki(i, n.boundary), u || (i = b(f))), n && ({ remaining: c } = i.forbidGroupTriangles(
      n.groupsOf,
      n.planes
    ), c -= u?.size ?? 0), l = i.del;
  }
  const h = [];
  for (let d = 0; d < l.triangles.length; d += 3)
    u?.has(d / 3) || h.push([l.triangles[d], l.triangles[d + 1], l.triangles[d + 2]]);
  const m = ["a", "b", "c"];
  return { tin: xt(
    h.map((d) => {
      const b = {}, E = d.map((g, w) => {
        const p = r.features[g], S = p.geometry.coordinates, _ = [S[0], S[1]];
        return S.length === 3 ? _[2] = S[2] : b[m[w]] = p.properties[e], _;
      });
      return E[3] = E[0], re([E], b);
    })
  ), remaining: c, hasBoundary: u !== void 0, hull: f };
}
function Ki(r, t) {
  try {
    r.constrainAll(t);
  } catch {
    return;
  }
  const e = new Map(t), { triangles: n, halfedges: o } = r.del, s = (c) => {
    const u = n[c], f = n[At(c)];
    return e.get(u) === f || e.get(f) === u;
  }, i = /* @__PURE__ */ new Set(), a = [], l = (c) => {
    const u = Math.floor(c / 3);
    i.has(u) || (i.add(u), a.push(u));
  };
  for (let c = 0; c < o.length; c++)
    o[c] === -1 && !s(c) && l(c);
  for (let c = 0; c < a.length; c++)
    for (let u = a[c] * 3; u < a[c] * 3 + 3; u++) {
      if (!e.has(n[u])) return;
      o[u] !== -1 && !s(u) && l(o[u]);
    }
  return i;
}
function pn(r) {
  const t = /* @__PURE__ */ new Set(), e = [];
  if (r.forEach(([l, c], u) => {
    const f = `${l}:${c}`;
    t.has(f) || (t.add(f), e.push({ i: u, x: l, y: c }));
  }), e.length < 3) return [];
  const n = (l, c, u) => ft(l.x, l.y, c.x, c.y, u.x, u.y), o = [...e].sort((l, c) => l.x - c.x || l.y - c.y), s = (l) => {
    const c = [];
    for (const u of l) {
      for (; c.length >= 2 && n(c[c.length - 2], c[c.length - 1], u) <= 0; ) c.pop();
      c.push(u);
    }
    return c.pop(), c;
  }, i = [...s(o), ...s([...o].reverse())];
  if (i.length < 3) return [];
  const a = [];
  for (let l = 0; l < i.length; l++) {
    const c = i[l], u = i[(l + 1) % i.length], f = u.x - c.x, h = u.y - c.y, m = f * f + h * h, y = e.filter((b) => b !== c && b !== u && n(c, u, b) === 0).map((b) => ({ r: b, t: ((b.x - c.x) * f + (b.y - c.y) * h) / m })).filter(({ t: b }) => b > 0 && b < 1).sort((b, E) => b.t - E.t).map(({ r: b }) => b), d = [c, ...y, u];
    for (let b = 0; b + 1 < d.length; b++) a.push([d[b].i, d[b + 1].i]);
  }
  return a;
}
function ve([r, t]) {
  return r < t ? `${r}-${t}` : `${t}-${r}`;
}
function jt(r, t, e) {
  return Lt(r, { target: { geom: t, index: e } });
}
function Ut(r) {
  return Lt(r.properties.target.geom, {
    target: {
      geom: r.geometry.coordinates,
      index: r.properties.target.index
    }
  });
}
function gn(r, t) {
  const e = r.length, n = t.geometry.coordinates;
  return Array.from({ length: e }, (o, s) => s).map((o) => {
    const s = (o + 1) % e, i = r[o], a = r[s], l = i.geometry.coordinates, c = Math.atan2(
      l[0] - n[0],
      l[1] - n[1]
    ), u = [t, i, a, t].map(
      (m) => m.geometry.coordinates
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
    }, h = xt([
      re([u], f)
    ]);
    return [c, h];
  }).reduce(
    (o, s) => (o[0].push(s[0]), o[1].push(s[1]), o),
    [[], []]
  );
}
const Wi = [0.1, 0.15, 0.225, 0.34, 0.5];
function Gi(r, t) {
  return t ? r.hasBoundary !== t.hasBoundary ? r.hasBoundary : r.diagnostics.boundaryTriangleFlips < t.diagnostics.boundaryTriangleFlips : !0;
}
function mn(r, t, e) {
  return Math.sign(ft(r[0], r[1], t[0], t[1], e[0], e[1]));
}
function be(r, t = -1) {
  let e = 0;
  for (const n of r.features) {
    const { a: o, b: s, c: i } = n.properties;
    if (![o, s, i].some(
      ({ index: f }) => typeof f == "string" && f.startsWith("b")
    ))
      continue;
    const [a, l, c] = n.geometry.coordinates[0];
    mn(a, l, c) * mn(o.geom, s.geom, i.geom) * t <= 0 && e++;
  }
  return e;
}
function wn(r, t, e) {
  if (r.some(([i, a]) => i === t[0] && a === t[1])) return !1;
  const n = r.map(
    ([i, a]) => Math.atan2(a - t[1], i - t[0])
  ), o = 2 * Math.PI;
  let s = 0;
  for (let i = 0; i < n.length; i++) {
    const l = (e * (n[(i + 1) % n.length] - n[i]) + o) % o;
    if (!(l > 0 && l < Math.PI)) return !1;
    s += l;
  }
  return Math.abs(s - o) < 1e-6;
}
function yn(r, t, e, n, o, s = /* @__PURE__ */ new Set(), i) {
  const { minx: a, maxx: l, miny: c, maxy: u, centroid: f } = r, h = l - a, m = u - c, y = e.forw.length, d = Array.from({ length: y }, () => []);
  let b = 1;
  for (const [I, k] of e.edges)
    I < n && d[I].push(b), d[k].push(b), k < n && b++;
  const E = (I) => I.slice(0, y).map(({ geometry: k }) => k.coordinates), g = pn(E(e.forw)), w = {
    forw: g.filter((I) => !s.has(ve(I))),
    bakw: pn(E(e.bakw))
  }, p = [0], S = (I) => I >= y ? p : d[I];
  let _;
  for (const I of Wi) {
    const k = i?.get(I) ?? { forwReuse: {} };
    i?.set(I, k);
    const A = k.vertices ?? (k.vertices = t(
      {
        ...r,
        minx: a - I * h,
        maxx: l + I * h,
        miny: c - I * m,
        maxy: u + I * m
      },
      !0
    ));
    if (o && (A.length < 4 || !A.every(({ bakw: Y }) => Y.every(Number.isFinite)))) continue;
    const O = A.map(
      ({ forw: Y, bakw: j }, V) => jt(Y, j, `b${V}`)
    ), N = xt([...e.forw, ...O]), D = xt([
      ...e.bakw,
      ...O.map(Ut)
    ]), $ = [N, D].map(
      ({ features: Y }) => Float64Array.from(
        Y.flatMap(
          ({
            geometry: {
              coordinates: [j, V]
            }
          }) => [j, V]
        )
      )
    ), B = o !== void 0 || wn(
      A.map((Y) => Y.forw),
      f.forw,
      -1
    ) && wn(
      A.map((Y) => Y.bakw),
      f.bakw,
      1
    ) ? A.map((Y, j) => [
      y + j,
      y + (j + 1) % A.length
    ]) : void 0, M = { groupsOf: S, planes: $, boundary: B, allowUnusableBoundary: o !== void 0 }, T = o?.orientation ?? -1, P = Ce(
      N,
      e.edges,
      "target",
      { ...M, hull: w.forw },
      k.forwReuse
    ), C = k.geographic ?? (k.geographic = (() => {
      const Y = Ce(D, e.edges, "target", {
        ...M,
        hull: w.bakw
      });
      return { built: Y, flips: be(Y.tin, T) };
    })()), x = C.built, F = P.tin, R = {
      ...x.tin,
      features: [...x.tin.features]
    }, X = be(F, T) + C.flips, q = {
      vertices: A,
      forw: F,
      bakw: R,
      diagnostics: {
        margin: I,
        boundaryTriangleFlips: X,
        remainingForbiddenTriangles: P.remaining + x.remaining
      },
      hasMapBoundary: P.hasBoundary,
      hasBoundary: P.hasBoundary && x.hasBoundary,
      forwHull: { all: g, applied: P.hull }
    };
    if (o) {
      if (o.accept(q)) return q;
      continue;
    }
    if (X === 0 && q.hasBoundary)
      return q;
    Gi(q, _) && (_ = q);
  }
  return _;
}
const vn = 1e-9;
function Ji(r, t) {
  const e = [[], [], [], []], n = [];
  return Object.keys(r).forEach((o) => {
    const s = r[o], i = s.forw, a = s.bakw, l = [
      i[0] - t.forw[0],
      i[1] - t.forw[1]
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
function Rn(r) {
  let t = 1 / 0, e = 0, n = 0;
  return r.forEach((o) => {
    const { forw: s, bakw: i } = o, a = Math.hypot(s[0], s[1]), l = Math.hypot(i[0], i[1]);
    if (l === 0) return;
    const c = a / l, u = Math.atan2(s[0], s[1]) - Math.atan2(i[0], i[1]);
    t = Math.min(t, c), e += Math.cos(u), n += Math.sin(u);
  }), isFinite(t) ? [t, Math.atan2(n, e)] : [1, 0];
}
const Qi = 0.6, Zi = 3, tr = 0.5;
function er(r) {
  let t = 0, e = 0, n = 0, o = 0;
  if (r.forEach(({ forw: i, bakw: a }) => {
    t += i[1] * a[1] + i[0] * a[0], e += i[0] * a[1] - i[1] * a[0], n += a[0] * a[0] + a[1] * a[1], o += i[0] * i[0] + i[1] * i[1];
  }), !(!(n > 0 && o > 0) || !(Math.hypot(t, e) / Math.sqrt(o * n) >= tr)))
    return [Math.hypot(t, e) / n, Math.atan2(e, t)];
}
function nr(r) {
  const t = (o) => Math.hypot(o.forw[0], o.forw[1]), e = Math.max(...r.map(t)), n = r.filter((o) => t(o) >= Qi * e);
  return er(n.length >= Zi ? n : r) ?? Rn(r);
}
function ir(r, t, e, n) {
  const { perQuad: o, aggregate: s } = Ji(r, t), i = o.every((u) => u.length > 0), a = e === "birdeye" ? i ? o : [s] : [s], l = n === "farLsq" ? nr : Rn, c = a.map((u) => l(u));
  return c.length === 1 ? [c[0], c[0], c[0], c[0]] : c;
}
function rr(r, t) {
  let e = 0;
  return r[0] > t[0] && (e += 1), r[1] > t[1] && (e += 2), e;
}
function sr(r, t, e) {
  const n = [
    r[0] - t.forw[0],
    r[1] - t.forw[1]
  ], s = Math.sqrt(n[0] ** 2 + n[1] ** 2) / e[0], i = Math.atan2(n[0], n[1]) - e[1];
  return [
    t.bakw[0] + s * Math.sin(i),
    t.bakw[1] - s * Math.cos(i)
  ];
}
function or(r, t, e, n) {
  const o = t[0] - r[0], s = t[1] - r[1];
  if (Math.abs(o) < 1e-12 && Math.abs(s) < 1e-12) return null;
  const i = n[0] - e[0], a = n[1] - e[1], l = e[0] - r[0], c = e[1] - r[1], u = o * a - s * i;
  if (Math.abs(u) < 1e-12) return null;
  const f = (l * a - c * i) / u, h = (l * s - c * o) / u;
  return f <= 1e-10 || h < -1e-10 || h > 1 + 1e-10 ? null : { t: f, point: [r[0] + f * o, r[1] + f * s] };
}
function ar(r, t, e) {
  const n = e.length;
  let o = -1 / 0, s = null;
  for (let i = 0; i < n; i++) {
    const a = (i + 1) % n, l = or(
      r,
      t,
      e[i].bakw,
      e[a].bakw
    );
    l && l.t > o && (o = l.t, s = l.point);
  }
  return s;
}
function bn(r, t) {
  const n = Math.atan2(r[0] - t[0], r[1] - t[1]) * (180 / Math.PI);
  return n < 0 ? n + 360 : n;
}
function xn(r, t, e, n, o, s) {
  const i = t[0] - r[0], a = t[1] - r[1];
  if (i === 0 && a === 0) return null;
  const l = [];
  if (i !== 0)
    for (const u of [e, n]) {
      const f = (u - r[0]) / i;
      if (f > 0) {
        const h = r[1] + f * a;
        h >= o && h <= s && l.push({ t: f, x: u, y: h });
      }
    }
  if (a !== 0)
    for (const u of [o, s]) {
      const f = (u - r[1]) / a;
      if (f > 0) {
        const h = r[0] + f * i;
        h >= e && h <= n && l.push({ t: f, x: h, y: u });
      }
    }
  if (l.length === 0) return null;
  l.sort((u, f) => u.t - f.t);
  const c = l[0];
  return [c.x, c.y];
}
function Sn(r, t, e) {
  const n = r.length, o = new Array(n).fill(1);
  for (const s of t)
    for (let i = 0; i < n; i++) {
      const a = (i + 1) % n, l = Ue([r[i].bakw, r[a].bakw]), c = Ue([e.bakw, s.bakw]), u = Ei(l, c);
      if (u.features.length > 0 && u.features[0].geometry) {
        const f = u.features[0], h = Math.sqrt(
          Math.pow(s.bakw[0] - e.bakw[0], 2) + Math.pow(s.bakw[1] - e.bakw[1], 2)
        ), m = Math.sqrt(
          Math.pow(f.geometry.coordinates[0] - e.bakw[0], 2) + Math.pow(f.geometry.coordinates[1] - e.bakw[1], 2)
        ), y = h / m;
        y > o[i] && (o[i] = y), y > o[a] && (o[a] = y);
      }
    }
  r.forEach((s, i) => {
    const a = o[i];
    s.bakw = [
      (s.bakw[0] - e.bakw[0]) * a + e.bakw[0],
      (s.bakw[1] - e.bakw[1]) * a + e.bakw[1]
    ];
  });
}
function Le(r, t, e, n, o) {
  const { convexBuf: s, centroid: i, allGcps: a, minx: l, maxx: c, miny: u, maxy: f } = r, h = o ? void 0 : ir(s, i, t, n), y = [
    [l, u],
    [c, u],
    [c, f],
    [l, f]
  ].map((k) => ({
    forw: k,
    bakw: o ? o(k) : sr(
      k,
      i,
      h[rr(k, i.forw)]
    )
  }));
  if (y.sort(
    (k, A) => Math.atan2(k.forw[0] - i.forw[0], k.forw[1] - i.forw[1]) - Math.atan2(A.forw[0] - i.forw[0], A.forw[1] - i.forw[1])
  ), o || Sn(y, a, i), !e) return y;
  const d = 4, b = y.map(
    (k) => Math.atan2(k.forw[0] - i.forw[0], k.forw[1] - i.forw[1])
  ), E = y.map(
    (k) => Math.atan2(
      k.bakw[0] - i.bakw[0],
      -(k.bakw[1] - i.bakw[1])
    )
  );
  function g(k) {
    for (let A = 0; A < d; A++) {
      const O = (A + 1) % d, N = b[A], D = A < d - 1 ? b[O] : b[O] + 2 * Math.PI;
      let $ = k;
      for (; $ < N; ) $ += 2 * Math.PI;
      for (; $ >= N + 2 * Math.PI; ) $ -= 2 * Math.PI;
      if ($ >= N && $ < D)
        return { i: A, j: O, frac: ($ - N) / (D - N) };
    }
    return { i: 0, j: 1, frac: 0 };
  }
  function w(k) {
    const { i: A, j: O, frac: N } = g(k), D = E[A];
    let v = E[O] - D;
    for (; v > Math.PI; ) v -= 2 * Math.PI;
    for (; v < -Math.PI; ) v += 2 * Math.PI;
    return D + N * v;
  }
  const p = new Set(
    y.map(
      (k) => Math.floor(bn(k.forw, i.forw) / 10) % 36
    )
  ), S = a.map((k) => ({
    forw: k.forw,
    bakw: k.bakw,
    angleDeg: bn(k.forw, i.forw),
    forwDist: Math.hypot(k.forw[0] - i.forw[0], k.forw[1] - i.forw[1])
  })), _ = [];
  for (let k = 0; k < 36; k++) {
    if (p.has(k)) continue;
    const A = k * 10, O = S.filter((x) => {
      if (x.forwDist === 0) return !1;
      const F = ((x.angleDeg - A) % 360 + 360) % 360;
      return F < 10 + vn || F > 360 - vn;
    });
    let N = null;
    if (O.length > 0) {
      const x = O.reduce((F, R) => R.forwDist > F.forwDist ? R : F);
      N = xn(i.forw, x.forw, l, c, u, f);
    }
    if (!N) {
      const x = (A + 5) % 360 * (Math.PI / 180), F = [
        i.forw[0] + Math.sin(x),
        i.forw[1] + Math.cos(x)
      ];
      N = xn(i.forw, F, l, c, u, f);
    }
    if (!N) continue;
    const [D, $] = N, v = 1e-9 * Math.max(c - l, f - u);
    if ([...y, ..._].some(
      (x) => Math.abs(x.forw[0] - D) <= v && Math.abs(x.forw[1] - $) <= v
    )) continue;
    if (o) {
      _.push({ forw: N, bakw: o(N) });
      continue;
    }
    const B = [N[0] - i.forw[0], N[1] - i.forw[1]], M = Math.atan2(B[0], B[1]), T = w(M), P = [
      i.bakw[0] + Math.sin(T),
      i.bakw[1] - Math.cos(T)
    ], C = ar(i.bakw, P, y);
    C && _.push({ forw: N, bakw: C });
  }
  const I = [...y, ..._];
  return I.sort(
    (k, A) => Math.atan2(k.forw[0] - i.forw[0], k.forw[1] - i.forw[1]) - Math.atan2(A.forw[0] - i.forw[0], A.forw[1] - i.forw[1])
  ), o || Sn(I, a, i), I;
}
function cr(r, t = !1) {
  return Le(r, "plain", t, t ? "farLsq" : "min");
}
function lr(r, t = !1) {
  return Le(r, "birdeye", t, "min");
}
function fr(r, t) {
  const e = /* @__PURE__ */ new Set();
  return Le(r, "plain", !0, "min", t).filter(({ forw: [n, o] }) => {
    const s = `${n}:${o}`;
    return e.has(s) ? !1 : (e.add(s), !0);
  });
}
function is(r) {
  return $n(r, 1 / 0);
}
const Mn = 1e5, ur = 16;
function $n(r, t) {
  return hr(r), new dr(r).findSegmentIntersections(t).map(
    (o) => Lt([o.x, o.y])
  );
}
function hr(r) {
  for (let t = 0, e = r.length; t < e; t++) {
    const n = r[t];
    ne(n) || Yt(
      "findIntersections() received invalid coordinates:",
      `line=${t}`,
      `points=${n}`
    );
    for (let o = 0, s = n.length; o < s; o++) {
      const i = n[o];
      (!ne(i) || !Number.isFinite(i[0]) || !Number.isFinite(i[1])) && Yt(
        "findIntersections() received non-finite coordinates:",
        `line=${t}`,
        `point=${o}`,
        `coordinates=${JSON.stringify(i)}`
      );
    }
  }
}
class dr {
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
    const e = [], n = [], o = t.map((s) => {
      const i = s ? s.length : 0;
      for (let a = 0; a < i; a++)
        e.push(s[a][0]), n.push(s[a][1]);
      return i;
    });
    this.initXYData(o, e, n);
  }
  initXYData(t, e, n) {
    const o = t.length;
    this._xx = new Float64Array(e), this._yy = new Float64Array(n), this._nn = new Uint32Array(t), this._zz = null, this._zlimit = 0, this._filteredArcIter = null, this._ii = new Uint32Array(o);
    let s = 0;
    for (let i = 0; i < o; i++)
      this._ii[i] = s, s += t[i];
    (s != this._xx.length || this._xx.length != this._yy.length) && Yt("ArcCollection#initXYData() Counting error"), this.initBounds(), this._arcIter = new Fr(this._xx, this._yy);
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
    const o = n.length, s = new Float64Array(o * 4), i = new ie();
    let a = 0, l, c, u;
    for (let f = 0; f < o; f++)
      l = n[f], l > 0 && (c = f * 4, u = Pr(t, e, a, l), s[c++] = u[0], s[c++] = u[1], s[c++] = u[2], s[c] = u[3], a += l, i.mergeBounds(u));
    return {
      bb: s,
      bounds: i
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
    const n = t >= 0, o = n ? t : ~t, s = this.getRetainedInterval(), i = this._nn[o], a = n ? 1 : -1;
    let l = n ? this._ii[o] : this._ii[o] + i - 1, c = l, u = 0;
    for (let f = 1; f < i; f++)
      c += a, (s === 0 || this._zz[c] >= s) && (e(l, c, this._xx, this._yy), l = c, u++);
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
      (o, s, i, a) => {
        t += Math.abs(i[o] - i[s]), e += Math.abs(a[o] - a[s]);
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
    const e = this.getBounds(), n = e.ymin || 0, o = (e.ymax || 0) - n, s = this.calcSegmentIntersectionStripeCount(), i = new Uint32Array(s), a = s > 1 ? (w) => Math.floor((s - 1) * (w - n) / o) : () => 0, l = s + 1;
    let c;
    this.forEachSegment(
      (w, p, S, _) => {
        let I = a(_[w]);
        const k = a(_[p]);
        let A = 0;
        for (; i[I] = i[I] + 2, I != k; )
          A++, A > l && Yt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${s}`,
            `s1=${I}`,
            `s2=${k}`
          ), I += k > I ? 1 : -1;
      }
    );
    const u = this.getUint32Array(mr(i));
    let f = 0;
    const h = [];
    wr(i, (w) => {
      const p = f;
      f += w, h.push(u.subarray(p, f));
    }), yr(i, 0), this.forEachSegment(
      (w, p, S, _) => {
        let I = a(_[w]);
        const k = a(_[p]);
        let A, O, N = 0;
        for (; A = i[I], i[I] = A + 2, O = h[I], O[A] = w, O[A + 1] = p, I != k; )
          N++, N > l && Yt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${s}`,
            `s1=${I}`,
            `s2=${k}`
          ), I += k > I ? 1 : -1;
      }
    );
    const m = this.getVertexData(), y = t * ur;
    let d = 0;
    const b = /* @__PURE__ */ new Set(), E = /* @__PURE__ */ new Map(), g = (w) => {
      d++;
      const p = Nr(w);
      return b.has(p) || (b.add(p), E.set(`${w.x}:${w.y}`, w)), E.size >= t || d >= y;
    };
    if (m.xx && m.yy)
      for (c = 0; c < s && !vr(h[c], m.xx, m.yy, g); c++)
        ;
    return Array.from(E.values());
  }
}
function Yt(...r) {
  const t = r.join(" ");
  throw new Error(t);
}
function ne(r) {
  return r ? gr(r) ? !0 : pr(r) ? !1 : r.length === 0 ? !0 : r.length > 0 : !1;
}
function pr(r) {
  return r != null && r.toString === String.prototype.toString;
}
function gr(r) {
  return Array.isArray(r);
}
function mr(r, t) {
  ne(r) || Yt("utils.sum() expects an array, received:", r);
  let e = 0, n;
  for (let o = 0, s = r.length; o < s; o++)
    n = r[o], n && (e += n);
  return e;
}
function wr(r, t, e) {
  if (!ne(r))
    throw new Error(`#forEach() takes an array-like argument. ${r}`);
  for (let n = 0, o = r.length; n < o; n++)
    t.call(e, r[n], n);
}
function yr(r, t) {
  for (let e = 0, n = r.length; e < n; e++)
    r[e] = t;
  return r;
}
function vr(r, t, e, n) {
  const o = r.length - 2;
  let s, i, a, l, c, u, f, h, m, y, d, b, E, g, w, p, S;
  for (Br(t, r), p = 0; p < o; ) {
    for (s = r[p], i = r[p + 1], c = t[s], u = t[i], m = e[s], y = e[i], S = p; S < o && (S += 2, a = r[S], f = t[a], !(u < f)); ) {
      if (d = e[a], l = r[S + 1], h = t[l], b = e[l], m >= d) {
        if (m > b && y > d && y > b) continue;
      } else if (m < b && y < d && y < b) continue;
      if (!(s == a || s == l || i == a || i == l) && (E = br(
        c,
        m,
        u,
        y,
        f,
        d,
        h,
        b
      ), E && (g = [s, i], w = [a, l], n(En(E, g, w, t, e)) || E.length == 4 && n(En(E.slice(2), g, w, t, e)))))
        return !0;
    }
    p += 2;
  }
  return !1;
}
function br(r, t, e, n, o, s, i, a) {
  const l = xr(r, t, e, n, o, s, i, a);
  let c = null;
  return l && (c = Sr(r, t, e, n, o, s, i, a), c ? Ir(r, t, e, n, o, s, i, a) && (c = null) : c = Ar(r, t, e, n, o, s, i, a)), c;
}
function xr(r, t, e, n, o, s, i, a) {
  return Qt(r, t, e, n, o, s) * Qt(r, t, e, n, i, a) <= 0 && Qt(o, s, i, a, r, t) * Qt(o, s, i, a, e, n) <= 0;
}
function Qt(r, t, e, n, o, s) {
  return Xn(r - o, t - s, e - o, n - s);
}
function Xn(r, t, e, n) {
  return r * n - t * e;
}
function Sr(r, t, e, n, o, s, i, a) {
  let l = ge(r, t, e, n, o, s, i, a), c;
  return l && (c = _r(l[0], l[1], r, t, e, n, o, s, i, a), c == 1 ? l = ge(e, n, r, t, o, s, i, a) : c == 2 ? l = ge(o, s, i, a, r, t, e, n) : c == 3 && (l = ge(i, a, o, s, r, t, e, n))), l && kr(l, r, t, e, n, o, s, i, a), l;
}
function ge(r, t, e, n, o, s, i, a) {
  const l = Xn(e - r, n - t, i - o, a - s), c = 1e-18;
  let u;
  if (l === 0) return null;
  const f = Qt(o, s, i, a, r, t) / l;
  return l <= c && l >= -c ? u = Mr(r, t, e, n, o, s, i, a) : u = [r + f * (e - r), t + f * (n - t)], u;
}
function Mr(r, t, e, n, o, s, i, a) {
  let l = null;
  return !It(r, o, i) && !It(t, s, a) ? l = [r, t] : !It(e, o, i) && !It(n, s, a) ? l = [e, n] : !It(o, r, e) && !It(s, t, n) ? l = [o, s] : !It(i, r, e) && !It(a, t, n) && (l = [i, a]), l;
}
function It(r, t, e) {
  let n;
  return t < e ? n = r < t || r > e : t > e ? n = r > t || r < e : n = r != t, n;
}
function _r(r, t, ...e) {
  let n = -1, o = 1 / 0, s;
  for (let i = 0, a = 0, l = e.length; a < l; i++, a += 2)
    s = Er(r, t, e[a], e[a + 1]), s < o && (o = s, n = i);
  return n;
}
function Er(r, t, e, n) {
  const o = r - e, s = t - n;
  return o * o + s * s;
}
function kr(r, t, e, n, o, s, i, a, l) {
  let c = r[0], u = r[1];
  c = me(c, t, n), c = me(c, s, a), u = me(u, e, o), u = me(u, i, l), r[0] = c, r[1] = u;
}
function me(r, t, e) {
  let n;
  return It(r, t, e) && (n = Math.abs(r - t) < Math.abs(r - e) ? t : e, r = n), r;
}
function Ar(r, t, e, n, o, s, i, a) {
  const l = Math.min(r, e, o, i), c = Math.max(r, e, o, i), u = Math.min(t, n, s, a), f = Math.max(t, n, s, a), h = f - u > c - l;
  let m = [];
  return (h ? Dt(t, u, f) : Dt(r, l, c)) && m.push(r, t), (h ? Dt(n, u, f) : Dt(e, l, c)) && m.push(e, n), (h ? Dt(s, u, f) : Dt(o, l, c)) && m.push(o, s), (h ? Dt(a, u, f) : Dt(i, l, c)) && m.push(i, a), (m.length != 2 && m.length != 4 || m.length == 4 && m[0] == m[2] && m[1] == m[3]) && (m = null), m;
}
function Ir(r, t, e, n, o, s, i, a) {
  return r == o && t == s || r == i && t == a || e == o && n == s || e == i && n == a;
}
function Dt(r, t, e) {
  return r > t && r < e;
}
function Br(r, t) {
  Or(r, t), Yn(r, t, 0, t.length - 2);
}
function Or(r, t) {
  for (let e = 0, n = t.length; e < n; e += 2)
    r[t[e]] > r[t[e + 1]] && Tr(t, e, e + 1);
}
function Tr(r, t, e) {
  const n = r[t];
  r[t] = r[e], r[e] = n;
}
function Yn(r, t, e, n) {
  let o = e, s = n, i, a;
  for (; o < n; ) {
    for (i = r[t[e + n >> 2 << 1]]; o <= s; ) {
      for (; r[t[o]] < i; ) o += 2;
      for (; r[t[s]] > i; ) s -= 2;
      o <= s && (a = t[o], t[o] = t[s], t[s] = a, a = t[o + 1], t[o + 1] = t[s + 1], t[s + 1] = a, o += 2, s -= 2);
    }
    if (s - e < 40 ? _n(r, t, e, s) : Yn(r, t, e, s), n - o < 40) {
      _n(r, t, o, n);
      return;
    }
    e = o, s = n;
  }
}
function _n(r, t, e, n) {
  let o, s;
  for (let i = e + 2; i <= n; i += 2) {
    o = t[i], s = t[i + 1];
    let a;
    for (a = i - 2; a >= e && r[o] < r[t[a]]; a -= 2)
      t[a + 2] = t[a], t[a + 3] = t[a + 1];
    t[a + 2] = o, t[a + 3] = s;
  }
}
function En(r, t, e, n, o) {
  const s = r[0], i = r[1];
  t = kn(s, i, t[0], t[1], n, o), e = kn(s, i, e[0], e[1], n, o);
  const a = t[0] < e[0] ? t : e, l = a == t ? e : t;
  return { x: s, y: i, a, b: l };
}
function kn(r, t, e, n, o, s) {
  let i = e < n ? e : n, a = i === e ? n : e;
  return o[i] == r && s[i] == t ? a = i : o[a] == r && s[a] == t && (i = a), [i, a];
}
function Nr(r) {
  return `${r.a.join(",")};${r.b.join(",")}`;
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
function Pr(r, t, e, n) {
  let o = e | 0;
  const s = isNaN(n) ? r.length - o : n + o;
  let i, a, l, c, u, f;
  if (s > 0)
    l = u = r[o], c = f = t[o];
  else return [void 0, void 0, void 0, void 0];
  for (o++; o < s; o++)
    i = r[o], a = t[o], i < l && (l = i), i > u && (u = i), a < c && (c = a), a > f && (f = a);
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
    let s, i, a, l;
    if (arguments.length == 1)
      if (ne(t)) {
        const c = t;
        s = c[0], i = c[1], a = c[2], l = c[3];
      } else {
        const c = t;
        s = c.xmin, i = c.ymin, a = c.xmax, l = c.ymax;
      }
    else
      s = t, i = e, a = n, l = o;
    return this.xmin = s, this.ymin = i, this.xmax = a, this.ymax = l, (s > a || i > l) && this.update(), this;
  }
  update() {
    let t;
    this.xmin > this.xmax && (t = this.xmin, this.xmin = this.xmax, this.xmax = t), this.ymin > this.ymax && (t = this.ymin, this.ymin = this.ymax, this.ymax = t);
  }
  mergeBounds(t, ...e) {
    let n, o, s, i;
    return t instanceof ie ? (n = t.xmin, o = t.ymin, s = t.xmax, i = t.ymax) : e.length == 3 ? (n = t, o = e[0], s = e[1], i = e[2]) : t.length == 4 ? (n = t[0], o = t[1], s = t[2], i = t[3]) : Yt("Bounds#mergeBounds() invalid argument:", t), this.xmin === void 0 ? this.setBounds(n, o, s, i) : (n < this.xmin && (this.xmin = n), o < this.ymin && (this.ymin = o), s > this.xmax && (this.xmax = s), i > this.ymax && (this.ymax = i)), this;
  }
}
function xe(r) {
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
function Ln(r, t, e) {
  const n = xe(t.forw), o = xe(t.bakw);
  if (JSON.stringify(n) != JSON.stringify(o))
    throw `${JSON.stringify(t, null, 2)}
${JSON.stringify(
      n
    )}
${JSON.stringify(o)}`;
  for (let s = 0; s < n.length; s++) {
    const i = n[s];
    r[i] || (r[i] = []), r[i].push(t);
  }
  e && (e.forw.features.push(t.forw), e.bakw.features.push(t.bakw));
}
function An(r, t, e) {
  const n = xe(t.forw), o = xe(t.bakw);
  if (JSON.stringify(n) != JSON.stringify(o))
    throw `${JSON.stringify(t, null, 2)}
${JSON.stringify(n)}
${JSON.stringify(o)}`;
  if (n.forEach((s) => {
    const i = r[s];
    if (!i) return;
    const a = i.filter((l) => l !== t);
    a.length === 0 ? delete r[s] : r[s] = a;
  }), e) {
    const s = (i, a) => {
      !i || !a || (i.features = i.features.filter((l) => l !== a));
    };
    s(e.forw, t.forw), s(e.bakw, t.bakw);
  }
}
function we(r, t = 1e-6) {
  const [e, n] = r[0], [o, s] = r[1], [i, a] = r[2];
  return Math.abs((o - e) * (a - n) - (i - e) * (s - n)) < t;
}
function Dr(r, t) {
  const e = /* @__PURE__ */ new Set();
  return r.forEach((n) => {
    if (n.length !== 2) return;
    const o = n.map((s) => `${t?.[s] ?? s}`);
    e.add(o.sort().join("-"));
  }), e;
}
function Zt(r) {
  return ["a", "b", "c"].map((t, e) => ({
    prop: r.properties[t],
    geom: r.geometry.coordinates[0][e]
  }));
}
const Cr = 10;
function Rr(r, t, e, n, o, s) {
  if (!r && !t) return !1;
  const i = r ? 0 : 1, a = 1 - i, l = e[i], c = e[a];
  if (!l || !c) return !1;
  const u = bt(c.geom);
  let f = !1, h = !1;
  for (let m = 0; m <= 1; m++) {
    const y = n[m];
    if (!y) continue;
    const d = [String(y.prop.index), String(l.prop.index)].sort().join("-"), b = o[d];
    if (!b || b.length < 2) continue;
    const E = b.find(
      (N) => N.bakw !== s[i].bakw
    );
    if (!E) continue;
    const w = Zt(E.bakw).find(
      (N) => String(N.prop.index) !== String(y.prop.index) && String(N.prop.index) !== String(l.prop.index)
    );
    if (!w) continue;
    f = !0;
    const p = bt(w.geom), S = bt(y.geom), _ = bt(l.geom), I = _[0] - S[0], k = _[1] - S[1], A = I * (u[1] - S[1]) - k * (u[0] - S[0]), O = I * (p[1] - S[1]) - k * (p[0] - S[0]);
    if (A * O > 0) {
      h = !0;
      break;
    }
  }
  return f && !h;
}
function $r(r, t, e, n) {
  if (!r && !t) return !1;
  if (e[0] && e[1] && n[0] && n[1]) {
    const o = n.map((u) => bt(u.geom)), s = e.map((u) => bt(u.geom)), i = o[1][0] - o[0][0], a = o[1][1] - o[0][1], l = i * (s[0][1] - o[0][1]) - a * (s[0][0] - o[0][0]), c = i * (s[1][1] - o[0][1]) - a * (s[1][0] - o[0][0]);
    return l * c < 0;
  }
  return !1;
}
function Xr(r, t, e, n) {
  const o = Dr(e, n), s = /* @__PURE__ */ new Set();
  let i = !1;
  for (let a = 0; a < Cr; a++) {
    let l = !1;
    for (const c of Object.keys(t)) {
      if (s.has(c)) continue;
      s.add(c);
      const u = t[c];
      if (!u || u.length < 2) continue;
      const f = c.split("-");
      if (f.length !== 2 || o.has(c)) continue;
      const h = Zt(u[0].bakw), m = Zt(u[1].bakw), y = Zt(u[0].forw), d = Zt(u[1].forw), b = f.map(
        (x) => h.find((F) => `${F.prop.index}` === x) || m.find((F) => `${F.prop.index}` === x)
      ), E = f.map(
        (x) => y.find((F) => `${F.prop.index}` === x) || d.find((F) => `${F.prop.index}` === x)
      );
      if (b.some((x) => !x) || E.some((x) => !x))
        continue;
      const g = [h, m].map(
        (x) => x.find((F) => !f.includes(`${F.prop.index}`))
      ), w = [y, d].map(
        (x) => x.find((F) => !f.includes(`${F.prop.index}`))
      );
      if (g.some((x) => !x) || w.some((x) => !x))
        continue;
      const p = u[0].bakw.geometry.coordinates[0].slice(0, 3).map((x) => bt(x)), S = u[1].bakw.geometry.coordinates[0].slice(0, 3).map((x) => bt(x)), _ = u[0].forw.geometry.coordinates[0].slice(0, 3).map((x) => bt(x)), I = u[1].forw.geometry.coordinates[0].slice(0, 3).map((x) => bt(x)), k = we(p), A = we(S), O = we(_), N = we(I), D = Rr(
        k,
        A,
        g,
        b,
        t,
        u
      ), $ = $r(
        O,
        N,
        g,
        b
      );
      if (!(D || $ || In(
        bt(g[0].geom),
        S
      ) || In(
        bt(g[1].geom),
        p
      )))
        continue;
      const B = E.map(
        (x) => bt(x.geom)
      ), M = w.map(
        (x) => bt(x.geom)
      ), T = Yr([
        ...B,
        ...M
      ]), P = Lr(T), C = Bn(
        B[0],
        B[1],
        M[0]
      ) + Bn(
        B[0],
        B[1],
        M[1]
      );
      Re(P, C) && (An(t, u[0], r), An(t, u[1], r), b.forEach((x) => {
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
        }, X = re([F], R), q = Fn(X);
        Ln(t, {
          forw: q,
          bakw: X
        }, r);
      }), l = !0, i = !0);
    }
    if (!l) break;
  }
  return i;
}
function bt(r) {
  return [r[0], r[1]];
}
function In(r, t) {
  const [e, n] = t[0], [o, s] = t[1], [i, a] = t[2], l = i - e, c = a - n, u = o - e, f = s - n, h = r[0] - e, m = r[1] - n, y = l * l + c * c, d = l * u + c * f, b = l * h + c * m, E = u * u + f * f, g = u * h + f * m, w = y * E - d * d;
  if (w === 0) return !1;
  const p = 1 / w, S = (E * b - d * g) * p, _ = (y * g - d * b) * p, I = 1e-9;
  return S >= -I && _ >= -I && S + _ <= 1 + I;
}
function Yr(r) {
  const t = r.map((i) => i.slice()).filter(
    (i, a, l) => l.findIndex(
      (c) => Re(c[0], i[0]) && Re(c[1], i[1])
    ) === a
  );
  if (t.length <= 1) return t;
  const e = t.sort(
    (i, a) => i[0] === a[0] ? i[1] - a[1] : i[0] - a[0]
  ), n = (i, a, l) => (a[0] - i[0]) * (l[1] - i[1]) - (a[1] - i[1]) * (l[0] - i[0]), o = [];
  for (const i of e) {
    for (; o.length >= 2 && n(
      o[o.length - 2],
      o[o.length - 1],
      i
    ) <= 0; )
      o.pop();
    o.push(i);
  }
  const s = [];
  for (let i = e.length - 1; i >= 0; i--) {
    const a = e[i];
    for (; s.length >= 2 && n(
      s[s.length - 2],
      s[s.length - 1],
      a
    ) <= 0; )
      s.pop();
    s.push(a);
  }
  return s.pop(), o.pop(), o.concat(s);
}
function Lr(r) {
  if (r.length < 3) return 0;
  let t = 0;
  for (let e = 0; e < r.length; e++) {
    const [n, o] = r[e], [s, i] = r[(e + 1) % r.length];
    t += n * i - s * o;
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
const qr = (r) => typeof r == "string" && r.startsWith("b");
function Vr(r, t) {
  const e = (n, o) => {
    for (let s = 0; s < 3; s++) {
      const i = n.g[s], a = n.g[(s + 1) % 3];
      if (o.g.every((l) => n.sign * ft(i[0], i[1], a[0], a[1], l[0], l[1]) <= 0)) return !0;
    }
    return !1;
  };
  return !e(r, t) && !e(t, r);
}
function jr(r, t, e) {
  if (t.length === 0) return [];
  const n = r.features.map((d) => {
    const { a: b, b: E, c: g } = d.properties, w = [b.geom, E.geom, g.geom], [p, S, _] = d.geometry.coordinates[0], I = w.map(([N]) => N), k = w.map(([, N]) => N), A = Math.sign(ft(p[0], p[1], S[0], S[1], _[0], _[1])), O = Math.sign(ft(w[0][0], w[0][1], w[1][0], w[1][1], w[2][0], w[2][1]));
    return {
      ids: [b.index, E.index, g.index].map(String),
      g: w,
      sign: O,
      ratio: A * O,
      aux: [b.index, E.index, g.index].some(qr),
      minx: Math.min(...I),
      maxx: Math.max(...I),
      miny: Math.min(...k),
      maxy: Math.max(...k)
    };
  }), o = n.map((d) => d.ratio), s = o.reduce((d, b) => d + b, 0) < 0 ? -1 : 1, i = (d, b) => d < b ? `${d}|${b}` : `${b}|${d}`, a = /* @__PURE__ */ new Map();
  n.forEach((d, b) => {
    for (let E = 0; E < 3; E++) {
      const g = i(d.ids[E], d.ids[(E + 1) % 3]), w = a.get(g);
      w ? w.push(b) : a.set(g, [b]);
    }
  });
  const l = ([d, b]) => i(String(e[d]), String(e[b])), c = /* @__PURE__ */ new Set();
  for (const d of t) for (const b of a.get(l(d)) ?? []) c.add(b);
  const u = (d) => n[d].aux || c.has(d), f = /* @__PURE__ */ new Set();
  n.forEach((d, b) => {
    u(b) && (o[b] === 0 || o[b] !== s) && f.add(b);
  });
  const h = n.map((d, b) => b).sort((d, b) => n[d].minx - n[b].minx);
  for (let d = 0; d < h.length; d++) {
    const b = n[h[d]];
    if (b.sign !== 0)
      for (let E = d + 1; E < h.length; E++) {
        const g = n[h[E]];
        if (g.minx >= b.maxx) break;
        g.sign === 0 || g.miny >= b.maxy || b.miny >= g.maxy || !u(h[d]) && !u(h[E]) || Vr(b, g) && (f.add(h[d]), f.add(h[E]));
      }
  }
  if (f.size === 0) return [];
  const m = t.filter((d) => (a.get(l(d)) ?? []).some((b) => f.has(b)));
  if (m.length > 0) return m;
  const y = /* @__PURE__ */ new Set();
  for (const d of f) for (const b of n[d].ids) b.startsWith("b") || y.add(b);
  return t.filter(
    ([d, b]) => y.has(String(e[d])) || y.has(String(e[b]))
  );
}
const Ur = 4, On = 32, zr = 4, Hr = 1e-4, qn = 0.25, Kr = 0.01, Ct = (r, t) => String(r) < String(t) ? `${r}|${t}` : `${t}|${r}`;
function De(r, t, e) {
  const n = t.filter((c) => !String(c.properties.target.index).startsWith("b")).map((c) => ({
    id: c.properties.target.index,
    paper: c.geometry.coordinates,
    geo: c.properties.target.geom
  })), o = /* @__PURE__ */ new Set();
  let s = 0, i = 0;
  const a = r.features.map((c) => {
    const { a: u, b: f, c: h } = c.properties, [m, y, d] = c.geometry.coordinates[0];
    o.add(Ct(u.index, f.index)), o.add(Ct(u.index, h.index)), o.add(Ct(f.index, h.index));
    const b = Math.sign(ft(m[0], m[1], y[0], y[1], d[0], d[1])) * Math.sign(ft(u.geom[0], u.geom[1], f.geom[0], f.geom[1], h.geom[0], h.geom[1]));
    return b > 0 ? s++ : b < 0 && i++, {
      ids: [String(u.index), String(f.index), String(h.index)],
      paper: [m, y, d],
      geo: [u.geom, f.geom, h.geom],
      sign: b
    };
  }), l = e.filter(([c, u]) => !o.has(Ct(n[c].id, n[u].id)));
  return { points: n, triangles: a, majority: s >= i ? 1 : -1, hullEdges: e, dropped: l };
}
function Vn(r) {
  return [r.foot[0] + r.height * r.normal[0], r.foot[1] + r.height * r.normal[1]];
}
function Wr(r, [t, e], { lambda: n = qn, epsilon: o = Hr } = {}) {
  const { points: s, majority: i } = r, a = s[t], l = s[e], c = s.reduce((M, T) => M + T.paper[0], 0) / s.length, u = s.reduce((M, T) => M + T.paper[1], 0) / s.length, f = Math.sign(ft(a.paper[0], a.paper[1], l.paper[0], l.paper[1], c, u));
  if (f === 0) return;
  const h = f * i, m = [l.paper[0] - a.paper[0], l.paper[1] - a.paper[1]], y = [l.geo[0] - a.geo[0], l.geo[1] - a.geo[1]], d = Math.hypot(m[0], m[1]), b = Math.hypot(y[0], y[1]);
  if (!(d > 0 && b > 0)) return;
  const E = [];
  for (const M of s) {
    if (M === a || M === l) continue;
    const T = ft(a.geo[0], a.geo[1], l.geo[0], l.geo[1], M.geo[0], M.geo[1]);
    if (T * h >= 0) continue;
    const P = ((M.geo[0] - a.geo[0]) * y[0] + (M.geo[1] - a.geo[1]) * y[1]) / (b * b), C = ((M.paper[0] - a.paper[0]) * m[0] + (M.paper[1] - a.paper[1]) * m[1]) / (d * d);
    P > 0 && P < 1 && C > 0 && C < 1 && E.push({ id: M.id, u: P, t: C, d: Math.abs(T) / b });
  }
  const g = E.length > 0;
  g || E.push({ u: 0.5, t: 0.5, d: 0 });
  const w = E.reduce((M, T) => T.d > M.d ? T : M);
  let p = 0;
  for (const M of E)
    p = Math.max(p, M.u <= w.u ? M.d * w.u / M.u : M.d * (1 - w.u) / (1 - M.u));
  p *= 1 + n;
  const S = [-m[1] / d * f, m[0] / d * f], _ = [-y[1] / b * h, y[0] / b * h], I = (M) => [
    a.paper[0] + M * m[0] + o * d * S[0],
    a.paper[1] + M * m[1] + o * d * S[1]
  ], k = (M, T, P, C) => ({
    paper: I(M),
    foot: [a.geo[0] + T * y[0], a.geo[1] + T * y[1]],
    normal: _,
    height: P,
    chord: b,
    protrusion: w.d,
    ...C === void 0 ? {} : { anchor: C }
  }), A = [k(w.t, w.u, p, g ? w.id : void 0)], O = [...E].sort((M, T) => M.u - T.u), N = [{ u: 0, d: 0 }], D = (M, T, P) => (T.u - M.u) * (P.d - M.d) - (T.d - M.d) * (P.u - M.u);
  for (const M of [...O, { u: 1, d: 0 }]) {
    for (; N.length >= 2 && D(N[N.length - 2], N[N.length - 1], M) >= 0; ) N.pop();
    N.push(M);
  }
  const $ = n * w.d, v = [];
  let B = 0;
  for (const M of N.slice(1, -1))
    M.t === void 0 || !(M.t > B) || (B = M.t, v.push(k(M.t, M.u, M.d + $, g ? M.id : void 0)));
  return {
    edge: [a.id, l.id],
    variants: g && v.length > 1 ? [A, v] : [A]
  };
}
function Gr(r, t, e, { lambda: n = qn, mu: o = Kr } = {}) {
  const s = r.map((i) => ({ ...i }));
  for (let i = 0; i < zr; i++) {
    const a = e(s.map((c) => [c.paper, Vn(c)]));
    if (!a) return;
    let l = !1;
    for (const [c, u] of s.entries()) {
      const f = `e${t + c}`;
      let h = -1 / 0, m = 1 / 0, y = 0;
      for (const g of a.triangles) {
        const w = g.ids.indexOf(f);
        if (w < 0) continue;
        g.sign !== a.majority && y++;
        const p = g.geo[(w + 1) % 3], S = g.geo[(w + 2) % 3], _ = Math.sign(
          ft(
            g.paper[w][0],
            g.paper[w][1],
            g.paper[(w + 1) % 3][0],
            g.paper[(w + 1) % 3][1],
            g.paper[(w + 2) % 3][0],
            g.paper[(w + 2) % 3][1]
          )
        ), I = ft(u.foot[0], u.foot[1], p[0], p[1], S[0], S[1]), k = ft(u.foot[0] + u.normal[0], u.foot[1] + u.normal[1], p[0], p[1], S[0], S[1]) - I, A = _ * a.majority;
        if (k === 0) {
          I * A <= 0 && (h = 1 / 0);
          continue;
        }
        const O = -I / k;
        k * A > 0 ? h = Math.max(h, O) : m = Math.min(m, O);
      }
      if (!(h < m)) return;
      const d = Math.min(Math.max(n * Math.max(h, u.protrusion), o * u.chord), (m - h) / 2), b = Math.max(h, 0) + d, E = Math.abs(b - u.height) > 1e-9 * u.chord;
      (y > 0 || E) && (E && (l = !0), u.height = b);
    }
    if (!l) return s;
  }
  return s;
}
function Jr(r, t) {
  const e = (s) => typeof s == "string" && s.startsWith("e") && Number(s.slice(1)) >= t, n = /* @__PURE__ */ new Set();
  for (const { ids: s } of r.triangles)
    n.add(Ct(s[0], s[1])), n.add(Ct(s[0], s[2])), n.add(Ct(s[1], s[2]));
  const o = /* @__PURE__ */ new Set();
  for (const [s, i] of r.hullEdges)
    for (const a of [s, i])
      if (e(r.points[a].id)) {
        if (!n.has(Ct(r.points[s].id, r.points[i].id))) return !1;
        o.add(a);
      }
  return r.points.every((s, i) => !e(s.id) || o.has(i));
}
function Qr(r, t) {
  const e = { rounds: 0, builds: 0, batches: 0, perEdge: 0, multiPoint: 0 };
  let n = [], o = [], s = t, i = r.snapshot();
  const a = /* @__PURE__ */ new Set(), l = (f) => (e.builds++, r.measure(f)), c = (f) => [f.paper, Vn(f)], u = (f) => {
    if (f.length === 0 || n.length + f.length > On) return !1;
    const h = r.edgeBase + n.length, m = Gr(
      f.map(({ ray: b }) => b),
      h,
      (b) => l([...n, ...b])
    );
    if (!m) return !1;
    const y = [...n, ...m.map(c)];
    e.builds++;
    const d = r.build(y);
    return !d || !Jr(d.analysis, h) ? (r.restore(i), !1) : (o = o.concat(
      m.map((b, E) => ({
        node: h + E,
        kind: "hullEdge",
        edge: f[E].edge,
        ...b.anchor === void 0 ? {} : { anchor: b.anchor }
      }))
    ), n = y, s = d, i = r.snapshot(), !0);
  };
  for (let f = 1; f <= Ur; f++) {
    const { analysis: h } = s, m = [];
    for (const d of h.dropped) {
      const b = d.map((g) => h.points[g].paper.join(",")).join("|");
      if (a.has(b) || (a.add(b), n.length + m.length + 1 > On)) continue;
      const E = Wr(h, d);
      E && m.push(E);
    }
    if (m.length === 0) break;
    e.rounds = f;
    const y = (d, b) => b.map((E) => ({ ray: E, edge: d.edge }));
    if (u(m.flatMap((d) => y(d, d.variants[0])))) {
      e.batches++;
      continue;
    }
    for (const d of m)
      for (const [b, E] of d.variants.entries())
        if (u(y(d, E))) {
          e.perEdge++, b > 0 && e.multiPoint++;
          break;
        }
  }
  return r.restore(i), { pairs: n, records: o, result: s.result, diagnostics: e };
}
const Tn = 2.00704, Nn = 3.00001, Zr = 12, ts = 24;
class nt extends Kn {
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
    if (super(), t.bounds ? this.setBounds(t.bounds) : (this.setWh(t.wh), this.vertexMode = t.vertexMode || nt.VERTEX_PLAIN), this.strictMode = t.strictMode || nt.MODE_AUTO, this.yaxisMode = t.yaxisMode || nt.YAXIS_INVERT, this.importance = t.importance || 0, this.priority = t.priority || 0, this.stateFull = t.stateFull || !1, this.useV2Algorithm = t.useV2Algorithm ?? !1, this.useSupplementPairs = t.supplementPairs ?? !0, t.outerTransform === "worldFile") {
      if (this.useV2Algorithm) throw new Error("V2 では world file 外周を使えません");
      if (!t.worldFile) throw new Error("worldFile が必要です");
      Wn(t.worldFile), this.requestedWorldFile = { ...t.worldFile };
    }
    t.points && this.setPoints(t.points), t.edges && this.setEdges(t.edges);
  }
  /**
   * フォーマットバージョンを取得します
   */
  getFormatVersion() {
    return this.useV2Algorithm ? Tn : Nn;
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
    this.edges = Gn(t), this.edgeNodes = void 0, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 境界ポリゴンを設定します
   */
  setBounds(t) {
    this.bounds = t;
    let e = t[0][0], n = e, o = t[0][1], s = o;
    const i = [t[0]];
    for (let a = 1; a < t.length; a++) {
      const l = t[a];
      l[0] < e && (e = l[0]), l[0] > n && (n = l[0]), l[1] < o && (o = l[1]), l[1] > s && (s = l[1]), i.push(l);
    }
    i.push(t[0]), this.boundsPolygon = re([i]), this.xy = [e, o], this.wh = [n - e, s - o], this.vertexMode = nt.VERTEX_PLAIN, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 現在の設定を永続化可能な形式にコンパイルします
   */
  getCompiled() {
    const t = {};
    if (t.version = this.useV2Algorithm ? Tn : Nn, t.points = this.points, t.weight_buffer = {}, this.compiledOuter?.outerTransform === "worldFile")
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
          const o = e[n].features[0], s = o.geometry.coordinates[0][1], i = o.properties.b.geom;
          t.vertices_points[n] = [s, i];
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
   *   （同じ位置の交差を 1 件に数えた件数）。届いた時点で数え上げをやめます。
   *   0 のときは交差を調べず、`strict_status` と `kinks` も変えません（重なりの解消だけを行い、
   *   三角網の向きを読むための内部用）
   */
  calculateStrictTin(t = Mn) {
    const e = this.tins.forw.features.map(
      (i) => Fn(i)
    );
    this.tins.bakw = xt(e);
    const n = {};
    this.tins.forw.features.forEach((i, a) => {
      const l = this.tins.bakw.features[a];
      Ln(n, { forw: i, bakw: l });
    });
    const o = (this.pointsSet?.forw.features ?? []).map(
      (i) => i.properties.target.index
    );
    if (Xr(
      this.tins,
      n,
      this.pointsSet?.edges || [],
      o
    ), t <= 0) return;
    const s = ["forw", "bakw"].map((i) => {
      const a = this.tins[i].features.map(
        (l) => l.geometry.coordinates[0]
      );
      return $n(a, t);
    });
    s[0].length === 0 && s[1].length === 0 ? (this.strict_status = nt.STATUS_STRICT, delete this.kinks) : (this.strict_status = nt.STATUS_ERROR, this.kinks = {
      forw: xt(s[0]),
      bakw: xt(s[1])
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
      const s = this.points[o][0], i = this.points[o][1], a = jt(s, i, o);
      t.forw.push(a), t.bakw.push(Ut(a));
    }
    const e = [];
    let n = 0;
    this.edgeNodes = [], this.edges || (this.edges = []);
    for (let o = 0; o < this.edges.length; o++) {
      const s = this.edges[o][2], i = Object.assign([], this.edges[o][0]), a = Object.assign([], this.edges[o][1]);
      if (es(s, this.points.length, o), i.length === 0 && a.length === 0) {
        e.push(s);
        continue;
      }
      i.unshift(this.points[s[0]][0]), i.push(this.points[s[1]][0]), a.unshift(this.points[s[0]][1]), a.push(this.points[s[1]][1]);
      const l = [i, a].map((c) => {
        const u = c.map((h, m, y) => {
          if (m === 0) return 0;
          const d = y[m - 1];
          return Math.sqrt(
            Math.pow(h[0] - d[0], 2) + Math.pow(h[1] - d[1], 2)
          );
        }), f = u.reduce((h, m, y) => y === 0 ? [0] : (h.push(h[y - 1] + m), h), []);
        return f.map((h, m, y) => {
          const d = h / y[y.length - 1];
          return [c[m], u[m], f[m], d];
        });
      });
      l.map((c, u) => {
        const f = l[u ? 0 : 1];
        return c.filter((h, m) => !(m === 0 || m === c.length - 1 || h[4] === "handled")).flatMap((h) => {
          const m = h[0], y = h[3], d = f.reduce(
            (b, E, g, w) => {
              if (b) return b;
              const p = w[g + 1];
              if (E[3] === y)
                return E[4] = "handled", [E];
              if (E[3] < y && p && p[3] > y)
                return [E, p];
            },
            void 0
          );
          if (d && d.length === 1)
            return u === 0 ? [[m, d[0][0], y]] : [[d[0][0], m, y]];
          if (d && d.length === 2) {
            const b = d[0], E = d[1], g = (y - b[3]) / (E[3] - b[3]), w = [
              (E[0][0] - b[0][0]) * g + b[0][0],
              (E[0][1] - b[0][1]) * g + b[0][1]
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
        const h = jt(
          c[0],
          c[1],
          `e${n}`
        );
        n++, t.forw.push(h), t.bakw.push(Ut(h)), u === 0 ? e.push([s[0], t.forw.length - 1]) : e.push([
          t.forw.length - 2,
          t.forw.length - 1
        ]), u === f.length - 1 && e.push([t.forw.length - 1, s[1]]);
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
    const s = this.bounds ? this.boundsPolygon : void 0;
    if (!this.points.reduce((l, c) => l && (s ? Ge(c[0], s) : c[0][0] >= t && c[0][0] <= e && c[0][1] >= n && c[0][1] <= o), !0))
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
    for (const s of this.points) {
      const i = s[0][0], a = s[0][1];
      i < t && (t = i), i > e && (e = i), a < n && (n = a), a > o && (o = a);
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
    t !== nt.MODE_STRICT && t !== nt.MODE_LOOSE && (t = nt.MODE_AUTO);
    const e = !this.useV2Algorithm, n = this.requestedWorldFile;
    if (n && !e) throw new Error("V2 では world file 外周を使えません");
    let o, s, i, a, l;
    if (e) {
      if (this.bounds) {
        const O = this.boundsPolygon;
        if (!O) throw new Error("Internal error: bounds is set but boundsPolygon is missing");
        if (!this.points.every(
          (D) => Ge(D[0], O)
        )) throw "SOME POINTS OUTSIDE";
      }
      o = this.generatePointsSet(), { minx: s, maxx: i, miny: a, maxy: l } = this.computeGcpBbox();
    } else {
      const O = this.validateAndPrepareInputs();
      o = O.pointsSet, s = O.minx, i = O.maxx, a = O.miny, l = O.maxy;
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
    const h = Ii(c.forw), m = fn(c.forw);
    if (!m) throw "TOO LINEAR2";
    const y = {}, d = m.geometry.coordinates[0];
    let b;
    try {
      b = d.map((O) => ({
        forw: O,
        bakw: Me(Lt(O), u)
      })), b.forEach((O) => {
        y[`${O.forw[0]}:${O.forw[1]}`] = O;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const E = fn(c.bakw);
    if (!E) throw "TOO LINEAR2";
    const g = E.geometry.coordinates[0];
    try {
      b = g.map((O) => ({
        bakw: O,
        forw: Me(Lt(O), f)
      })), b.forEach((O) => {
        y[`${O.forw[0]}:${O.forw[1]}`] = O;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const w = {
      forw: h.geometry.coordinates,
      bakw: Me(h, u)
    }, p = jt(w.forw, w.bakw, "c");
    this.centroid = {
      forw: p,
      bakw: Ut(p)
    };
    const S = [
      ...this.points.map((O) => ({ forw: O[0], bakw: O[1] })),
      ...(this.edgeNodes ?? []).map((O) => ({ forw: O[0], bakw: O[1] }))
    ], _ = {
      convexBuf: y,
      centroid: w,
      allGcps: S,
      minx: s,
      maxx: i,
      miny: a,
      maxy: l
    };
    if (n) {
      this.stateTriangle = void 0;
      const O = this.yaxisMode === nt.YAXIS_FOLLOW, N = O ? 1 : -1, { boundary: D } = this.buildWithSupplements(t, o, S, ($, v, B) => (M) => ({ boundary: yn(
        _,
        (T) => fr(T, (P) => {
          const [C, x] = Jn(n, P);
          return [C, O ? -x : x];
        }),
        o,
        this.points.length,
        {
          orientation: N,
          accept: (T) => T.hasMapBoundary ? (this.buildTin(o, T.vertices, v, T, M.size > 0, B), (this.strict_status !== nt.STATUS_LOOSE || T.hasBoundary) && be(this.tins.forw, N) === 0 && be(this.tins.bakw, N) === 0) : !1
        },
        M,
        $
      ) }));
      if (D) {
        this.compiledOuter = {
          outerTransform: "worldFile",
          worldFile: n,
          vertices_points: D.vertices.map(({ forw: T, bakw: P }) => [T, P])
        };
        const { centroid: $, xy: v, wh: B, kinks: M } = this;
        super.setCompiled(this.getCompiled()), Object.assign(this, { centroid: $, xy: v, wh: B, kinks: M }), this.lastBoundaryDiagnostics = {
          ...D.diagnostics,
          requestedOuterTransform: "worldFile",
          outerTransform: "worldFile"
        };
        return;
      }
      this.compiledOuter = { outerTransform: "extrapolate" }, this.outerTransform = "extrapolate", this.worldFile = void 0;
    }
    const I = this.vertexMode === nt.VERTEX_BIRDEYE ? lr : cr;
    let k, A;
    e ? { boundary: k, verticesList: A } = this.buildWithSupplements(t, o, S, (O, N, D) => ($) => {
      const v = yn(
        _,
        I,
        o,
        this.points.length,
        void 0,
        $,
        O
      );
      return {
        boundary: v,
        verticesList: this.buildTin(
          o,
          v?.vertices ?? I(_, !1),
          N,
          v,
          $.size > 0,
          D
        )
      };
    }) : A = this.buildTin(
      o,
      I(_, !1),
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
   * 続き番号）。重心・扇形外挿の推定（pointsSetFC・convexBuf）には入れない。loose 指定では、内部で
   * strict の手順を 1 回走らせて補完点を決め、それを足して loose で組む。
   *
   * @param makeAttempt 点群ごとの探索の入れ物と strict の方式・「三角網の向きを読むだけ」（交差を調べない）を
   *   受け取り、`buildWithHull` に渡す試行を返す
   */
  buildWithSupplements(t, e, n, o) {
    const s = (w) => this.buildWithHull(w, o(/* @__PURE__ */ new Map(), w, !1));
    if (!this.useSupplementPairs || this.useV2Algorithm) return s(t);
    const i = t === nt.MODE_LOOSE ? nt.MODE_STRICT : t, a = s(i), l = () => t === nt.MODE_LOOSE ? s(t) : a;
    if (!a.boundary || this.strict_status !== nt.STATUS_STRICT) return l();
    const c = De(this.tins.forw, this.pointsSet.forw.features, a.boundary.forwHull.all);
    if (c.dropped.length === 0) return l();
    const u = this.edgeNodes.length, f = e.forw.length, h = n.length;
    let m = [], y;
    const d = (w, p) => w.length === p.length && w.every((S, _) => S.every((I, k) => I[0] === p[_][k][0] && I[1] === p[_][k][1])), b = (w) => {
      e.forw.length = f, e.bakw.length = f, n.length = h, this.edgeNodes.length = u;
      for (const [p, S] of w) {
        const _ = jt(p, S, `e${this.edgeNodes.length}`);
        this.edgeNodes.push([p, S]), e.forw.push(_), e.bakw.push(Ut(_)), n.push({ forw: p, bakw: S });
      }
      m = w;
    }, g = Qr({
      edgeBase: u,
      snapshot: () => ({ pairs: m, state: this.captureBuild() }),
      restore: ({ pairs: w, state: p }) => {
        b(w), this.restoreBuild(p);
      },
      measure: (w) => {
        b(w);
        const p = this.captureBuild();
        try {
          const S = /* @__PURE__ */ new Map();
          y = { pairs: w, cache: S };
          const { boundary: _ } = o(S, nt.MODE_STRICT, !0)(/* @__PURE__ */ new Set());
          return _ ? De(this.tins.forw, this.pointsSet.forw.features, []) : void 0;
        } finally {
          this.restoreBuild(p);
        }
      },
      build: (w) => {
        b(w);
        const p = y && d(y.pairs, w) ? y.cache : /* @__PURE__ */ new Map(), S = this.buildWithHull(i, o(p, i, !1));
        if (!(!S.boundary || this.strict_status !== nt.STATUS_STRICT))
          return {
            result: S,
            analysis: De(this.tins.forw, this.pointsSet.forw.features, S.boundary.forwHull.all)
          };
      }
    }, { result: a, analysis: c });
    return this.supplementRecords = g.records, this.lastSupplementDiagnostics = g.diagnostics, t === nt.MODE_LOOSE ? (b(g.pairs), s(t)) : g.result;
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
    const s = (d) => [...d].sort().join(","), i = (d, b = !1) => {
      const E = s(d), g = n.get(E);
      if (g) return g;
      const w = e(d), p = {
        value: w,
        strict: w.boundary !== void 0 && this.strict_status === nt.STATUS_STRICT
      };
      return (p.strict || b) && (p.state = this.captureBuild()), n.set(E, p), o = p, p;
    }, a = (d) => (o !== d && this.restoreBuild(d.state), o = d, d.value), l = i(/* @__PURE__ */ new Set(), !0);
    if (!(t === nt.MODE_STRICT || t === nt.MODE_AUTO) || !l.value.boundary || l.strict) return l.value;
    const u = new Set(l.value.boundary.forwHull.all.map(ve)), f = () => this.pointsSet.forw.features.map(
      (d) => d.properties.target.index
    ), h = /* @__PURE__ */ new Set();
    let m = l, y;
    for (let d = 0; d < Zr; d++) {
      const b = jr(
        this.tins.forw,
        m.value.boundary.forwHull.applied,
        f()
      ).filter((E) => !h.has(ve(E)));
      if (b.length === 0) break;
      for (const E of b) h.add(ve(E));
      if (m = i(h), !m.value.boundary) break;
      if (m.strict) {
        y = m;
        break;
      }
    }
    if (y) {
      let d = y;
      for (const b of [...h].slice(0, ts)) {
        const E = new Set(h);
        E.delete(b);
        const g = i(E);
        g.strict && (h.delete(b), d = g);
      }
      return a(d);
    }
    if (h.size < u.size) {
      const d = i(u);
      if (d.strict) return a(d);
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
  buildTin(t, e, n, o, s = !1, i = !1) {
    const a = {
      forw: [],
      bakw: []
    };
    for (let l = 0; l < e.length; l++) {
      const c = e[l].forw, u = e[l].bakw, f = jt(c, u, `b${l}`), h = Ut(f);
      a.forw.push(f), a.bakw.push(h);
    }
    return this.pointsSet = {
      forw: xt([...t.forw, ...a.forw]),
      bakw: xt([...t.bakw, ...a.bakw]),
      edges: t.edges
    }, this.tins = {
      forw: je(
        o?.forw ?? pe(this.pointsSet.forw, t.edges, "target")
      )
    }, (n === nt.MODE_STRICT || n === nt.MODE_AUTO) && this.calculateStrictTin(
      i ? 0 : n === nt.MODE_AUTO || s ? 1 : Mn
    ), (n === nt.MODE_LOOSE || n === nt.MODE_AUTO && this.strict_status === nt.STATUS_ERROR) && (this.tins.bakw = je(
      o?.bakw ?? pe(this.pointsSet.bakw, t.edges, "target")
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
function es(r, t, e) {
  const n = (o) => Number.isInteger(o) && o >= 0 && o < t;
  if (!Array.isArray(r) || !n(r[0]) || !n(r[1]))
    throw new Error(
      `Invalid edge at edges[${e}]: start/end ${JSON.stringify(r)} must be integer indices of points (0 to ${t - 1})`
    );
}
export {
  nt as Tin,
  pe as constrainedTin,
  Ut as counterPoint,
  jt as createPoint,
  nt as default,
  is as findIntersections,
  Tn as format_version,
  Ln as insertSearchIndex,
  gn as vertexCalc
};
