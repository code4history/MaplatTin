import { counterTri as On, Transform as qn, validateWorldFile as Vn, normalizeEdges as jn, transformArr as _e, rotateVerticesTriangle as qe, worldFileToCrs as Un } from "@maplat/transform";
function te(r, t, e = {}) {
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
  if (!je(r[0]) || !je(r[1]))
    throw new Error("coordinates must contain numbers");
  return te({
    type: "Point",
    coordinates: r
  }, t, e);
}
function ie(r, t, e = {}) {
  for (const o of r) {
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
  return te({
    type: "Polygon",
    coordinates: r
  }, t, e);
}
function Ve(r, t, e = {}) {
  if (r.length < 2)
    throw new Error("coordinates must be an array of two or more positions");
  return te({
    type: "LineString",
    coordinates: r
  }, t, e);
}
function xt(r, t = {}) {
  const e = { type: "FeatureCollection" };
  return t.id && (e.id = t.id), t.bbox && (e.bbox = t.bbox), e.features = r, e;
}
function je(r) {
  return !isNaN(r) && r !== null && !Array.isArray(r);
}
function zn(r) {
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
function Hn(r) {
  return r.type === "Feature" ? r.geometry : r;
}
function $e(r, t, e) {
  if (r !== null)
    for (var n, o, i, s, a, c, l, h = 0, f = 0, p, g = r.type, b = g === "FeatureCollection", u = g === "Feature", S = b ? r.features.length : 1, I = 0; I < S; I++) {
      l = b ? (
        // @ts-expect-error: Known type conflict
        r.features[I].geometry
      ) : u ? (
        // @ts-expect-error: Known type conflict
        r.geometry
      ) : r, p = l ? l.type === "GeometryCollection" : !1, a = p ? l.geometries.length : 1;
      for (var m = 0; m < a; m++) {
        var y = 0, d = 0;
        if (s = p ? l.geometries[m] : l, s !== null) {
          c = s.coordinates;
          var x = s.type;
          switch (h = e && (x === "Polygon" || x === "MultiPolygon") ? 1 : 0, x) {
            case null:
              break;
            case "Point":
              if (
                // @ts-expect-error: Known type conflict
                t(
                  c,
                  f,
                  I,
                  y,
                  d
                ) === !1
              )
                return !1;
              f++, y++;
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
                    y,
                    d
                  ) === !1
                )
                  return !1;
                f++, x === "MultiPoint" && y++;
              }
              x === "LineString" && y++;
              break;
            case "Polygon":
            case "MultiLineString":
              for (n = 0; n < c.length; n++) {
                for (o = 0; o < c[n].length - h; o++) {
                  if (
                    // @ts-expect-error: Known type conflict
                    t(
                      c[n][o],
                      f,
                      I,
                      y,
                      d
                    ) === !1
                  )
                    return !1;
                  f++;
                }
                x === "MultiLineString" && y++, x === "Polygon" && d++;
              }
              x === "Polygon" && y++;
              break;
            case "MultiPolygon":
              for (n = 0; n < c.length; n++) {
                for (d = 0, o = 0; o < c[n].length; o++) {
                  for (i = 0; i < c[n][o].length - h; i++) {
                    if (
                      // @ts-expect-error: Known type conflict
                      t(
                        c[n][o][i],
                        f,
                        I,
                        y,
                        d
                      ) === !1
                    )
                      return !1;
                    f++;
                  }
                  d++;
                }
                y++;
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
const pt = 11102230246251565e-32, U = 134217729, Tn = (3 + 8 * pt) * pt;
function ht(r, t, e, n, o) {
  let i, s, a, c, l = t[0], h = n[0], f = 0, p = 0;
  h > l == h > -l ? (i = l, l = t[++f]) : (i = h, h = n[++p]);
  let g = 0;
  if (f < r && p < e)
    for (h > l == h > -l ? (s = l + i, a = i - (s - l), l = t[++f]) : (s = h + i, a = i - (s - h), h = n[++p]), i = s, a !== 0 && (o[g++] = a); f < r && p < e; )
      h > l == h > -l ? (s = i + l, c = s - i, a = i - (s - c) + (l - c), l = t[++f]) : (s = i + h, c = s - i, a = i - (s - c) + (h - c), h = n[++p]), i = s, a !== 0 && (o[g++] = a);
  for (; f < r; )
    s = i + l, c = s - i, a = i - (s - c) + (l - c), l = t[++f], i = s, a !== 0 && (o[g++] = a);
  for (; p < e; )
    s = i + h, c = s - i, a = i - (s - c) + (h - c), h = n[++p], i = s, a !== 0 && (o[g++] = a);
  return (i !== 0 || g === 0) && (o[g++] = i), g;
}
function St(r, t, e, n, o, i, s, a) {
  return ht(ht(r, t, e, n, s), s, o, i, a);
}
function L(r, t, e, n) {
  let o, i, s, a, c, l, h, f, p, g, b;
  h = U * e, g = h - (h - e), b = e - g;
  let u = t[0];
  o = u * e, h = U * u, f = h - (h - u), p = u - f, s = p * b - (o - f * g - p * g - f * b);
  let S = 0;
  s !== 0 && (n[S++] = s);
  for (let I = 1; I < r; I++)
    u = t[I], a = u * e, h = U * u, f = h - (h - u), p = u - f, c = p * b - (a - f * g - p * g - f * b), i = o + c, l = i - o, s = o - (i - l) + (c - l), s !== 0 && (n[S++] = s), o = a + i, s = i - (o - a), s !== 0 && (n[S++] = s);
  return (o !== 0 || S === 0) && (n[S++] = o), S;
}
function Fn(r, t) {
  let e = t[0];
  for (let n = 1; n < r; n++) e += t[n];
  return e;
}
function tt(r) {
  return new Float64Array(r);
}
const Gn = (3 + 16 * pt) * pt, Kn = (2 + 12 * pt) * pt, Wn = (9 + 64 * pt) * pt * pt, Lt = tt(4), Ue = tt(8), ze = tt(12), He = tt(16), mt = tt(4);
function Jn(r, t, e, n, o, i, s) {
  let a, c, l, h, f, p, g, b, u, S, I, m, y, d, x, M, _, B;
  const A = r - o, O = e - o, C = t - i, N = n - i;
  d = A * N, p = U * A, g = p - (p - A), b = A - g, p = U * N, u = p - (p - N), S = N - u, x = b * S - (d - g * u - b * u - g * S), M = C * O, p = U * C, g = p - (p - C), b = C - g, p = U * O, u = p - (p - O), S = O - u, _ = b * S - (M - g * u - b * u - g * S), I = x - _, f = x - I, Lt[0] = x - (I + f) + (f - _), m = d + I, f = m - d, y = d - (m - f) + (I - f), I = y - M, f = y - I, Lt[1] = y - (I + f) + (f - M), B = m + I, f = B - m, Lt[2] = m - (B - f) + (I - f), Lt[3] = B;
  let X = Fn(4, Lt), v = Kn * s;
  if (X >= v || -X >= v || (f = r - A, a = r - (A + f) + (f - o), f = e - O, l = e - (O + f) + (f - o), f = t - C, c = t - (C + f) + (f - i), f = n - N, h = n - (N + f) + (f - i), a === 0 && c === 0 && l === 0 && h === 0) || (v = Wn * s + Tn * Math.abs(X), X += A * h + N * a - (C * l + O * c), X >= v || -X >= v)) return X;
  d = a * N, p = U * a, g = p - (p - a), b = a - g, p = U * N, u = p - (p - N), S = N - u, x = b * S - (d - g * u - b * u - g * S), M = c * O, p = U * c, g = p - (p - c), b = c - g, p = U * O, u = p - (p - O), S = O - u, _ = b * S - (M - g * u - b * u - g * S), I = x - _, f = x - I, mt[0] = x - (I + f) + (f - _), m = d + I, f = m - d, y = d - (m - f) + (I - f), I = y - M, f = y - I, mt[1] = y - (I + f) + (f - M), B = m + I, f = B - m, mt[2] = m - (B - f) + (I - f), mt[3] = B;
  const E = ht(4, Lt, 4, mt, Ue);
  d = A * h, p = U * A, g = p - (p - A), b = A - g, p = U * h, u = p - (p - h), S = h - u, x = b * S - (d - g * u - b * u - g * S), M = C * l, p = U * C, g = p - (p - C), b = C - g, p = U * l, u = p - (p - l), S = l - u, _ = b * S - (M - g * u - b * u - g * S), I = x - _, f = x - I, mt[0] = x - (I + f) + (f - _), m = d + I, f = m - d, y = d - (m - f) + (I - f), I = y - M, f = y - I, mt[1] = y - (I + f) + (f - M), B = m + I, f = B - m, mt[2] = m - (B - f) + (I - f), mt[3] = B;
  const k = ht(E, Ue, 4, mt, ze);
  d = a * h, p = U * a, g = p - (p - a), b = a - g, p = U * h, u = p - (p - h), S = h - u, x = b * S - (d - g * u - b * u - g * S), M = c * l, p = U * c, g = p - (p - c), b = c - g, p = U * l, u = p - (p - l), S = l - u, _ = b * S - (M - g * u - b * u - g * S), I = x - _, f = x - I, mt[0] = x - (I + f) + (f - _), m = d + I, f = m - d, y = d - (m - f) + (I - f), I = y - M, f = y - I, mt[1] = y - (I + f) + (f - M), B = m + I, f = B - m, mt[2] = m - (B - f) + (I - f), mt[3] = B;
  const F = ht(k, ze, 4, mt, He);
  return He[F - 1];
}
function dt(r, t, e, n, o, i) {
  const s = (t - i) * (e - o), a = (r - o) * (n - i), c = s - a, l = Math.abs(s + a);
  return Math.abs(c) >= Gn * l ? c : -Jn(r, t, e, n, o, i, l);
}
const Qn = (10 + 96 * pt) * pt, Zn = (4 + 48 * pt) * pt, ti = (44 + 576 * pt) * pt * pt, Tt = tt(4), Ft = tt(4), Ct = tt(4), Mt = tt(4), kt = tt(4), Et = tt(4), gt = tt(4), wt = tt(4), Se = tt(8), Me = tt(8), ke = tt(8), Ee = tt(8), Ae = tt(8), Ie = tt(8), se = tt(8), oe = tt(8), ae = tt(8), $t = tt(4), Pt = tt(4), Xt = tt(4), z = tt(8), K = tt(16), nt = tt(16), it = tt(16), et = tt(32), Dt = tt(32), ct = tt(48), vt = tt(64);
let jt = tt(1152), Be = tt(1152);
function lt(r, t, e) {
  r = ht(r, jt, t, e, Be);
  const n = jt;
  return jt = Be, Be = n, r;
}
function ei(r, t, e, n, o, i, s, a, c) {
  let l, h, f, p, g, b, u, S, I, m, y, d, x, M, _, B, A, O, C, N, X, v, E, k, F, D, $, w, T, P, R, q, Y, j, V;
  const G = r - s, H = e - s, W = o - s, J = t - a, Z = n - a, Q = i - a;
  R = H * Q, E = U * H, k = E - (E - H), F = H - k, E = U * Q, D = E - (E - Q), $ = Q - D, q = F * $ - (R - k * D - F * D - k * $), Y = W * Z, E = U * W, k = E - (E - W), F = W - k, E = U * Z, D = E - (E - Z), $ = Z - D, j = F * $ - (Y - k * D - F * D - k * $), w = q - j, v = q - w, Tt[0] = q - (w + v) + (v - j), T = R + w, v = T - R, P = R - (T - v) + (w - v), w = P - Y, v = P - w, Tt[1] = P - (w + v) + (v - Y), V = T + w, v = V - T, Tt[2] = T - (V - v) + (w - v), Tt[3] = V, R = W * J, E = U * W, k = E - (E - W), F = W - k, E = U * J, D = E - (E - J), $ = J - D, q = F * $ - (R - k * D - F * D - k * $), Y = G * Q, E = U * G, k = E - (E - G), F = G - k, E = U * Q, D = E - (E - Q), $ = Q - D, j = F * $ - (Y - k * D - F * D - k * $), w = q - j, v = q - w, Ft[0] = q - (w + v) + (v - j), T = R + w, v = T - R, P = R - (T - v) + (w - v), w = P - Y, v = P - w, Ft[1] = P - (w + v) + (v - Y), V = T + w, v = V - T, Ft[2] = T - (V - v) + (w - v), Ft[3] = V, R = G * Z, E = U * G, k = E - (E - G), F = G - k, E = U * Z, D = E - (E - Z), $ = Z - D, q = F * $ - (R - k * D - F * D - k * $), Y = H * J, E = U * H, k = E - (E - H), F = H - k, E = U * J, D = E - (E - J), $ = J - D, j = F * $ - (Y - k * D - F * D - k * $), w = q - j, v = q - w, Ct[0] = q - (w + v) + (v - j), T = R + w, v = T - R, P = R - (T - v) + (w - v), w = P - Y, v = P - w, Ct[1] = P - (w + v) + (v - Y), V = T + w, v = V - T, Ct[2] = T - (V - v) + (w - v), Ct[3] = V, l = ht(
    ht(
      ht(
        L(L(4, Tt, G, z), z, G, K),
        K,
        L(L(4, Tt, J, z), z, J, nt),
        nt,
        et
      ),
      et,
      ht(
        L(L(4, Ft, H, z), z, H, K),
        K,
        L(L(4, Ft, Z, z), z, Z, nt),
        nt,
        Dt
      ),
      Dt,
      vt
    ),
    vt,
    ht(
      L(L(4, Ct, W, z), z, W, K),
      K,
      L(L(4, Ct, Q, z), z, Q, nt),
      nt,
      et
    ),
    et,
    jt
  );
  let at = Fn(l, jt), ft = Zn * c;
  if (at >= ft || -at >= ft || (v = r - G, h = r - (G + v) + (v - s), v = t - J, g = t - (J + v) + (v - a), v = e - H, f = e - (H + v) + (v - s), v = n - Z, b = n - (Z + v) + (v - a), v = o - W, p = o - (W + v) + (v - s), v = i - Q, u = i - (Q + v) + (v - a), h === 0 && f === 0 && p === 0 && g === 0 && b === 0 && u === 0) || (ft = ti * c + Tn * Math.abs(at), at += (G * G + J * J) * (H * u + Q * f - (Z * p + W * b)) + 2 * (G * h + J * g) * (H * Q - Z * W) + ((H * H + Z * Z) * (W * g + J * p - (Q * h + G * u)) + 2 * (H * f + Z * b) * (W * J - Q * G)) + ((W * W + Q * Q) * (G * b + Z * h - (J * f + H * g)) + 2 * (W * p + Q * u) * (G * Z - J * H)), at >= ft || -at >= ft))
    return at;
  if ((f !== 0 || b !== 0 || p !== 0 || u !== 0) && (R = G * G, E = U * G, k = E - (E - G), F = G - k, q = F * F - (R - k * k - (k + k) * F), Y = J * J, E = U * J, k = E - (E - J), F = J - k, j = F * F - (Y - k * k - (k + k) * F), w = q + j, v = w - q, Mt[0] = q - (w - v) + (j - v), T = R + w, v = T - R, P = R - (T - v) + (w - v), w = P + Y, v = w - P, Mt[1] = P - (w - v) + (Y - v), V = T + w, v = V - T, Mt[2] = T - (V - v) + (w - v), Mt[3] = V), (p !== 0 || u !== 0 || h !== 0 || g !== 0) && (R = H * H, E = U * H, k = E - (E - H), F = H - k, q = F * F - (R - k * k - (k + k) * F), Y = Z * Z, E = U * Z, k = E - (E - Z), F = Z - k, j = F * F - (Y - k * k - (k + k) * F), w = q + j, v = w - q, kt[0] = q - (w - v) + (j - v), T = R + w, v = T - R, P = R - (T - v) + (w - v), w = P + Y, v = w - P, kt[1] = P - (w - v) + (Y - v), V = T + w, v = V - T, kt[2] = T - (V - v) + (w - v), kt[3] = V), (h !== 0 || g !== 0 || f !== 0 || b !== 0) && (R = W * W, E = U * W, k = E - (E - W), F = W - k, q = F * F - (R - k * k - (k + k) * F), Y = Q * Q, E = U * Q, k = E - (E - Q), F = Q - k, j = F * F - (Y - k * k - (k + k) * F), w = q + j, v = w - q, Et[0] = q - (w - v) + (j - v), T = R + w, v = T - R, P = R - (T - v) + (w - v), w = P + Y, v = w - P, Et[1] = P - (w - v) + (Y - v), V = T + w, v = V - T, Et[2] = T - (V - v) + (w - v), Et[3] = V), h !== 0 && (S = L(4, Tt, h, Se), l = lt(l, St(
    L(S, Se, 2 * G, K),
    K,
    L(L(4, Et, h, z), z, Z, nt),
    nt,
    L(L(4, kt, h, z), z, -Q, it),
    it,
    et,
    ct
  ), ct)), g !== 0 && (I = L(4, Tt, g, Me), l = lt(l, St(
    L(I, Me, 2 * J, K),
    K,
    L(L(4, kt, g, z), z, W, nt),
    nt,
    L(L(4, Et, g, z), z, -H, it),
    it,
    et,
    ct
  ), ct)), f !== 0 && (m = L(4, Ft, f, ke), l = lt(l, St(
    L(m, ke, 2 * H, K),
    K,
    L(L(4, Mt, f, z), z, Q, nt),
    nt,
    L(L(4, Et, f, z), z, -J, it),
    it,
    et,
    ct
  ), ct)), b !== 0 && (y = L(4, Ft, b, Ee), l = lt(l, St(
    L(y, Ee, 2 * Z, K),
    K,
    L(L(4, Et, b, z), z, G, nt),
    nt,
    L(L(4, Mt, b, z), z, -W, it),
    it,
    et,
    ct
  ), ct)), p !== 0 && (d = L(4, Ct, p, Ae), l = lt(l, St(
    L(d, Ae, 2 * W, K),
    K,
    L(L(4, kt, p, z), z, J, nt),
    nt,
    L(L(4, Mt, p, z), z, -Z, it),
    it,
    et,
    ct
  ), ct)), u !== 0 && (x = L(4, Ct, u, Ie), l = lt(l, St(
    L(x, Ie, 2 * Q, K),
    K,
    L(L(4, Mt, u, z), z, H, nt),
    nt,
    L(L(4, kt, u, z), z, -G, it),
    it,
    et,
    ct
  ), ct)), h !== 0 || g !== 0) {
    if (f !== 0 || b !== 0 || p !== 0 || u !== 0 ? (R = f * Q, E = U * f, k = E - (E - f), F = f - k, E = U * Q, D = E - (E - Q), $ = Q - D, q = F * $ - (R - k * D - F * D - k * $), Y = H * u, E = U * H, k = E - (E - H), F = H - k, E = U * u, D = E - (E - u), $ = u - D, j = F * $ - (Y - k * D - F * D - k * $), w = q + j, v = w - q, gt[0] = q - (w - v) + (j - v), T = R + w, v = T - R, P = R - (T - v) + (w - v), w = P + Y, v = w - P, gt[1] = P - (w - v) + (Y - v), V = T + w, v = V - T, gt[2] = T - (V - v) + (w - v), gt[3] = V, R = p * -Z, E = U * p, k = E - (E - p), F = p - k, E = U * -Z, D = E - (E - -Z), $ = -Z - D, q = F * $ - (R - k * D - F * D - k * $), Y = W * -b, E = U * W, k = E - (E - W), F = W - k, E = U * -b, D = E - (E - -b), $ = -b - D, j = F * $ - (Y - k * D - F * D - k * $), w = q + j, v = w - q, wt[0] = q - (w - v) + (j - v), T = R + w, v = T - R, P = R - (T - v) + (w - v), w = P + Y, v = w - P, wt[1] = P - (w - v) + (Y - v), V = T + w, v = V - T, wt[2] = T - (V - v) + (w - v), wt[3] = V, _ = ht(4, gt, 4, wt, oe), R = f * u, E = U * f, k = E - (E - f), F = f - k, E = U * u, D = E - (E - u), $ = u - D, q = F * $ - (R - k * D - F * D - k * $), Y = p * b, E = U * p, k = E - (E - p), F = p - k, E = U * b, D = E - (E - b), $ = b - D, j = F * $ - (Y - k * D - F * D - k * $), w = q - j, v = q - w, Pt[0] = q - (w + v) + (v - j), T = R + w, v = T - R, P = R - (T - v) + (w - v), w = P - Y, v = P - w, Pt[1] = P - (w + v) + (v - Y), V = T + w, v = V - T, Pt[2] = T - (V - v) + (w - v), Pt[3] = V, O = 4) : (oe[0] = 0, _ = 1, Pt[0] = 0, O = 1), h !== 0) {
      const rt = L(_, oe, h, it);
      l = lt(l, ht(
        L(S, Se, h, K),
        K,
        L(rt, it, 2 * G, et),
        et,
        ct
      ), ct);
      const st = L(O, Pt, h, z);
      l = lt(l, St(
        L(st, z, 2 * G, K),
        K,
        L(st, z, h, nt),
        nt,
        L(rt, it, h, et),
        et,
        Dt,
        vt
      ), vt), b !== 0 && (l = lt(l, L(L(4, Et, h, z), z, b, K), K)), u !== 0 && (l = lt(l, L(L(4, kt, -h, z), z, u, K), K));
    }
    if (g !== 0) {
      const rt = L(_, oe, g, it);
      l = lt(l, ht(
        L(I, Me, g, K),
        K,
        L(rt, it, 2 * J, et),
        et,
        ct
      ), ct);
      const st = L(O, Pt, g, z);
      l = lt(l, St(
        L(st, z, 2 * J, K),
        K,
        L(st, z, g, nt),
        nt,
        L(rt, it, g, et),
        et,
        Dt,
        vt
      ), vt);
    }
  }
  if (f !== 0 || b !== 0) {
    if (p !== 0 || u !== 0 || h !== 0 || g !== 0 ? (R = p * J, E = U * p, k = E - (E - p), F = p - k, E = U * J, D = E - (E - J), $ = J - D, q = F * $ - (R - k * D - F * D - k * $), Y = W * g, E = U * W, k = E - (E - W), F = W - k, E = U * g, D = E - (E - g), $ = g - D, j = F * $ - (Y - k * D - F * D - k * $), w = q + j, v = w - q, gt[0] = q - (w - v) + (j - v), T = R + w, v = T - R, P = R - (T - v) + (w - v), w = P + Y, v = w - P, gt[1] = P - (w - v) + (Y - v), V = T + w, v = V - T, gt[2] = T - (V - v) + (w - v), gt[3] = V, N = -Q, X = -u, R = h * N, E = U * h, k = E - (E - h), F = h - k, E = U * N, D = E - (E - N), $ = N - D, q = F * $ - (R - k * D - F * D - k * $), Y = G * X, E = U * G, k = E - (E - G), F = G - k, E = U * X, D = E - (E - X), $ = X - D, j = F * $ - (Y - k * D - F * D - k * $), w = q + j, v = w - q, wt[0] = q - (w - v) + (j - v), T = R + w, v = T - R, P = R - (T - v) + (w - v), w = P + Y, v = w - P, wt[1] = P - (w - v) + (Y - v), V = T + w, v = V - T, wt[2] = T - (V - v) + (w - v), wt[3] = V, B = ht(4, gt, 4, wt, ae), R = p * g, E = U * p, k = E - (E - p), F = p - k, E = U * g, D = E - (E - g), $ = g - D, q = F * $ - (R - k * D - F * D - k * $), Y = h * u, E = U * h, k = E - (E - h), F = h - k, E = U * u, D = E - (E - u), $ = u - D, j = F * $ - (Y - k * D - F * D - k * $), w = q - j, v = q - w, Xt[0] = q - (w + v) + (v - j), T = R + w, v = T - R, P = R - (T - v) + (w - v), w = P - Y, v = P - w, Xt[1] = P - (w + v) + (v - Y), V = T + w, v = V - T, Xt[2] = T - (V - v) + (w - v), Xt[3] = V, C = 4) : (ae[0] = 0, B = 1, Xt[0] = 0, C = 1), f !== 0) {
      const rt = L(B, ae, f, it);
      l = lt(l, ht(
        L(m, ke, f, K),
        K,
        L(rt, it, 2 * H, et),
        et,
        ct
      ), ct);
      const st = L(C, Xt, f, z);
      l = lt(l, St(
        L(st, z, 2 * H, K),
        K,
        L(st, z, f, nt),
        nt,
        L(rt, it, f, et),
        et,
        Dt,
        vt
      ), vt), u !== 0 && (l = lt(l, L(L(4, Mt, f, z), z, u, K), K)), g !== 0 && (l = lt(l, L(L(4, Et, -f, z), z, g, K), K));
    }
    if (b !== 0) {
      const rt = L(B, ae, b, it);
      l = lt(l, ht(
        L(y, Ee, b, K),
        K,
        L(rt, it, 2 * Z, et),
        et,
        ct
      ), ct);
      const st = L(C, Xt, b, z);
      l = lt(l, St(
        L(st, z, 2 * Z, K),
        K,
        L(st, z, b, nt),
        nt,
        L(rt, it, b, et),
        et,
        Dt,
        vt
      ), vt);
    }
  }
  if (p !== 0 || u !== 0) {
    if (h !== 0 || g !== 0 || f !== 0 || b !== 0 ? (R = h * Z, E = U * h, k = E - (E - h), F = h - k, E = U * Z, D = E - (E - Z), $ = Z - D, q = F * $ - (R - k * D - F * D - k * $), Y = G * b, E = U * G, k = E - (E - G), F = G - k, E = U * b, D = E - (E - b), $ = b - D, j = F * $ - (Y - k * D - F * D - k * $), w = q + j, v = w - q, gt[0] = q - (w - v) + (j - v), T = R + w, v = T - R, P = R - (T - v) + (w - v), w = P + Y, v = w - P, gt[1] = P - (w - v) + (Y - v), V = T + w, v = V - T, gt[2] = T - (V - v) + (w - v), gt[3] = V, N = -J, X = -g, R = f * N, E = U * f, k = E - (E - f), F = f - k, E = U * N, D = E - (E - N), $ = N - D, q = F * $ - (R - k * D - F * D - k * $), Y = H * X, E = U * H, k = E - (E - H), F = H - k, E = U * X, D = E - (E - X), $ = X - D, j = F * $ - (Y - k * D - F * D - k * $), w = q + j, v = w - q, wt[0] = q - (w - v) + (j - v), T = R + w, v = T - R, P = R - (T - v) + (w - v), w = P + Y, v = w - P, wt[1] = P - (w - v) + (Y - v), V = T + w, v = V - T, wt[2] = T - (V - v) + (w - v), wt[3] = V, M = ht(4, gt, 4, wt, se), R = h * b, E = U * h, k = E - (E - h), F = h - k, E = U * b, D = E - (E - b), $ = b - D, q = F * $ - (R - k * D - F * D - k * $), Y = f * g, E = U * f, k = E - (E - f), F = f - k, E = U * g, D = E - (E - g), $ = g - D, j = F * $ - (Y - k * D - F * D - k * $), w = q - j, v = q - w, $t[0] = q - (w + v) + (v - j), T = R + w, v = T - R, P = R - (T - v) + (w - v), w = P - Y, v = P - w, $t[1] = P - (w + v) + (v - Y), V = T + w, v = V - T, $t[2] = T - (V - v) + (w - v), $t[3] = V, A = 4) : (se[0] = 0, M = 1, $t[0] = 0, A = 1), p !== 0) {
      const rt = L(M, se, p, it);
      l = lt(l, ht(
        L(d, Ae, p, K),
        K,
        L(rt, it, 2 * W, et),
        et,
        ct
      ), ct);
      const st = L(A, $t, p, z);
      l = lt(l, St(
        L(st, z, 2 * W, K),
        K,
        L(st, z, p, nt),
        nt,
        L(rt, it, p, et),
        et,
        Dt,
        vt
      ), vt), g !== 0 && (l = lt(l, L(L(4, kt, p, z), z, g, K), K)), b !== 0 && (l = lt(l, L(L(4, Mt, -p, z), z, b, K), K));
    }
    if (u !== 0) {
      const rt = L(M, se, u, it);
      l = lt(l, ht(
        L(x, Ie, u, K),
        K,
        L(rt, it, 2 * Q, et),
        et,
        ct
      ), ct);
      const st = L(A, $t, u, z);
      l = lt(l, St(
        L(st, z, 2 * Q, K),
        K,
        L(st, z, u, nt),
        nt,
        L(rt, it, u, et),
        et,
        Dt,
        vt
      ), vt);
    }
  }
  return jt[l - 1];
}
function ni(r, t, e, n, o, i, s, a) {
  const c = r - s, l = e - s, h = o - s, f = t - a, p = n - a, g = i - a, b = l * g, u = h * p, S = c * c + f * f, I = h * f, m = c * g, y = l * l + p * p, d = c * p, x = l * f, M = h * h + g * g, _ = S * (b - u) + y * (I - m) + M * (d - x), B = (Math.abs(b) + Math.abs(u)) * S + (Math.abs(I) + Math.abs(m)) * y + (Math.abs(d) + Math.abs(x)) * M, A = Qn * B;
  return _ > A || -_ > A ? _ : ei(r, t, e, n, o, i, s, a, B);
}
function ii(r, t) {
  var e, n, o = 0, i, s, a, c, l, h, f, p = r[0], g = r[1], b = t.length;
  for (e = 0; e < b; e++) {
    n = 0;
    var u = t[e], S = u.length - 1;
    if (h = u[0], h[0] !== u[S][0] && h[1] !== u[S][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (s = h[0] - p, a = h[1] - g, n; n < S; n++) {
      if (f = u[n + 1], c = f[0] - p, l = f[1] - g, a === 0 && l === 0) {
        if (c <= 0 && s >= 0 || s <= 0 && c >= 0)
          return 0;
      } else if (l >= 0 && a <= 0 || l <= 0 && a >= 0) {
        if (i = dt(s, c, a, l, 0, 0), i === 0)
          return 0;
        (i > 0 && l > 0 && a <= 0 || i < 0 && l <= 0 && a > 0) && o++;
      }
      h = f, a = l, s = c;
    }
  }
  return o % 2 !== 0;
}
function Ge(r, t, e = {}) {
  if (!r)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const n = zn(r), o = Hn(t), i = o.type, s = t.bbox;
  let a = o.coordinates;
  if (s && ri(n, s) === !1)
    return !1;
  i === "Polygon" && (a = [a]);
  for (var c = 0; c < a.length; ++c) {
    const l = ii(n, a[c]);
    if (l === 0 && !e.ignoreBoundary) return !0;
    if (l) return !0;
  }
  return !1;
}
function ri(r, t) {
  return t[0] <= r[0] && t[1] <= r[1] && t[2] >= r[0] && t[3] >= r[1];
}
class Pe {
  constructor(t = [], e = si) {
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
      const i = t - 1 >> 1, s = e[i];
      if (n(o, s) >= 0) break;
      e[t] = s, t = i;
    }
    e[t] = o;
  }
  _down(t) {
    const { data: e, compare: n } = this, o = this.length >> 1, i = e[t];
    for (; t < o; ) {
      let s = (t << 1) + 1, a = e[s];
      const c = s + 1;
      if (c < this.length && n(e[c], a) < 0 && (s = c, a = e[c]), n(a, i) >= 0) break;
      e[t] = a, t = s;
    }
    e[t] = i;
  }
}
function si(r, t) {
  return r < t ? -1 : r > t ? 1 : 0;
}
const oi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Pe
}, Symbol.toStringTag, { value: "Module" })), Bt = 11102230246251565e-32, ut = 134217729, ai = (3 + 8 * Bt) * Bt;
function Oe(r, t, e, n, o) {
  let i, s, a, c, l = t[0], h = n[0], f = 0, p = 0;
  h > l == h > -l ? (i = l, l = t[++f]) : (i = h, h = n[++p]);
  let g = 0;
  if (f < r && p < e)
    for (h > l == h > -l ? (s = l + i, a = i - (s - l), l = t[++f]) : (s = h + i, a = i - (s - h), h = n[++p]), i = s, a !== 0 && (o[g++] = a); f < r && p < e; )
      h > l == h > -l ? (s = i + l, c = s - i, a = i - (s - c) + (l - c), l = t[++f]) : (s = i + h, c = s - i, a = i - (s - c) + (h - c), h = n[++p]), i = s, a !== 0 && (o[g++] = a);
  for (; f < r; )
    s = i + l, c = s - i, a = i - (s - c) + (l - c), l = t[++f], i = s, a !== 0 && (o[g++] = a);
  for (; p < e; )
    s = i + h, c = s - i, a = i - (s - c) + (h - c), h = n[++p], i = s, a !== 0 && (o[g++] = a);
  return (i !== 0 || g === 0) && (o[g++] = i), g;
}
function ci(r, t) {
  let e = t[0];
  for (let n = 1; n < r; n++) e += t[n];
  return e;
}
function re(r) {
  return new Float64Array(r);
}
const li = (3 + 16 * Bt) * Bt, fi = (2 + 12 * Bt) * Bt, hi = (9 + 64 * Bt) * Bt * Bt, qt = re(4), Ke = re(8), We = re(12), Je = re(16), yt = re(4);
function ui(r, t, e, n, o, i, s) {
  let a, c, l, h, f, p, g, b, u, S, I, m, y, d, x, M, _, B;
  const A = r - o, O = e - o, C = t - i, N = n - i;
  d = A * N, p = ut * A, g = p - (p - A), b = A - g, p = ut * N, u = p - (p - N), S = N - u, x = b * S - (d - g * u - b * u - g * S), M = C * O, p = ut * C, g = p - (p - C), b = C - g, p = ut * O, u = p - (p - O), S = O - u, _ = b * S - (M - g * u - b * u - g * S), I = x - _, f = x - I, qt[0] = x - (I + f) + (f - _), m = d + I, f = m - d, y = d - (m - f) + (I - f), I = y - M, f = y - I, qt[1] = y - (I + f) + (f - M), B = m + I, f = B - m, qt[2] = m - (B - f) + (I - f), qt[3] = B;
  let X = ci(4, qt), v = fi * s;
  if (X >= v || -X >= v || (f = r - A, a = r - (A + f) + (f - o), f = e - O, l = e - (O + f) + (f - o), f = t - C, c = t - (C + f) + (f - i), f = n - N, h = n - (N + f) + (f - i), a === 0 && c === 0 && l === 0 && h === 0) || (v = hi * s + ai * Math.abs(X), X += A * h + N * a - (C * l + O * c), X >= v || -X >= v)) return X;
  d = a * N, p = ut * a, g = p - (p - a), b = a - g, p = ut * N, u = p - (p - N), S = N - u, x = b * S - (d - g * u - b * u - g * S), M = c * O, p = ut * c, g = p - (p - c), b = c - g, p = ut * O, u = p - (p - O), S = O - u, _ = b * S - (M - g * u - b * u - g * S), I = x - _, f = x - I, yt[0] = x - (I + f) + (f - _), m = d + I, f = m - d, y = d - (m - f) + (I - f), I = y - M, f = y - I, yt[1] = y - (I + f) + (f - M), B = m + I, f = B - m, yt[2] = m - (B - f) + (I - f), yt[3] = B;
  const E = Oe(4, qt, 4, yt, Ke);
  d = A * h, p = ut * A, g = p - (p - A), b = A - g, p = ut * h, u = p - (p - h), S = h - u, x = b * S - (d - g * u - b * u - g * S), M = C * l, p = ut * C, g = p - (p - C), b = C - g, p = ut * l, u = p - (p - l), S = l - u, _ = b * S - (M - g * u - b * u - g * S), I = x - _, f = x - I, yt[0] = x - (I + f) + (f - _), m = d + I, f = m - d, y = d - (m - f) + (I - f), I = y - M, f = y - I, yt[1] = y - (I + f) + (f - M), B = m + I, f = B - m, yt[2] = m - (B - f) + (I - f), yt[3] = B;
  const k = Oe(E, Ke, 4, yt, We);
  d = a * h, p = ut * a, g = p - (p - a), b = a - g, p = ut * h, u = p - (p - h), S = h - u, x = b * S - (d - g * u - b * u - g * S), M = c * l, p = ut * c, g = p - (p - c), b = c - g, p = ut * l, u = p - (p - l), S = l - u, _ = b * S - (M - g * u - b * u - g * S), I = x - _, f = x - I, yt[0] = x - (I + f) + (f - _), m = d + I, f = m - d, y = d - (m - f) + (I - f), I = y - M, f = y - I, yt[1] = y - (I + f) + (f - M), B = m + I, f = B - m, yt[2] = m - (B - f) + (I - f), yt[3] = B;
  const F = Oe(k, We, 4, yt, Je);
  return Je[F - 1];
}
function Qe(r, t, e, n, o, i) {
  const s = (t - i) * (e - o), a = (r - o) * (n - i), c = s - a;
  if (s === 0 || a === 0 || s > 0 != a > 0) return c;
  const l = Math.abs(s + a);
  return Math.abs(c) >= li * l ? c : -ui(r, t, e, n, o, i, l);
}
function di(r, t) {
  const e = new Pe([], Cn);
  return mi(r, e), gi(e, t);
}
function Cn(r, t) {
  return r.p.x > t.p.x ? 1 : r.p.x < t.p.x || r.p.x === t.p.x && (r.featureId !== t.featureId || r.ringId !== t.ringId) && r.isLeftEndpoint && !t.isLeftEndpoint ? -1 : r.p.y !== t.p.y ? r.p.y > t.p.y ? 1 : -1 : 1;
}
function pi(r, t) {
  return r.rightSweepEvent.p.x > t.rightSweepEvent.p.x ? 1 : r.rightSweepEvent.p.x < t.rightSweepEvent.p.x ? -1 : r.rightSweepEvent.p.y !== t.rightSweepEvent.p.y ? r.rightSweepEvent.p.y < t.rightSweepEvent.p.y ? 1 : -1 : 1;
}
function mi(r, t) {
  if (r.type === "FeatureCollection") {
    const e = r.features;
    for (let n = 0; n < e.length; n++)
      Ze(e[n], t);
  } else
    Ze(r, t);
}
var ce = 0, le = 0, fe = 0;
function Ze(r, t) {
  const e = r.type === "Feature" ? r.geometry : r;
  let n = e.coordinates;
  (e.type === "Polygon" || e.type === "MultiLineString") && (n = [n]), e.type === "LineString" && (n = [[n]]);
  for (let o = 0; o < n.length; o++)
    for (let i = 0; i < n[o].length; i++) {
      let s = n[o][i][0], a = null;
      le = le + 1;
      for (let c = 0; c < n[o][i].length - 1; c++) {
        a = n[o][i][c + 1];
        const l = new tn(s, ce, le, fe), h = new tn(a, ce, le, fe + 1);
        l.otherEvent = h, h.otherEvent = l, Cn(l, h) > 0 ? (h.isLeftEndpoint = !0, l.isLeftEndpoint = !1) : (l.isLeftEndpoint = !0, h.isLeftEndpoint = !1), t.push(l), t.push(h), s = a, fe = fe + 1;
      }
    }
  ce = ce + 1;
}
var tn = class {
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
function gi(r, t = !1) {
  const e = [], n = new Pe([], pi);
  for (; r.length; ) {
    const o = r.pop();
    if (o.isLeftEndpoint) {
      const i = new wi(o);
      for (let s = 0; s < n.data.length; s++) {
        const a = n.data[s];
        if (t && a.leftSweepEvent.featureId === o.featureId)
          continue;
        const c = yi(i, a);
        c !== !1 && e.push(c);
      }
      n.push(i);
    } else o.isLeftEndpoint === !1 && n.pop();
  }
  return e;
}
var wi = class {
  /** @param event must have otherEvent non-null */
  constructor(r) {
    this.leftSweepEvent = r, this.rightSweepEvent = r.otherEvent;
  }
};
function yi(r, t) {
  if (r === null || t === null) return !1;
  const e = r.leftSweepEvent.p.x, n = r.leftSweepEvent.p.y, o = r.rightSweepEvent.p.x, i = r.rightSweepEvent.p.y, s = t.leftSweepEvent.p.x, a = t.leftSweepEvent.p.y, c = t.rightSweepEvent.p.x, l = t.rightSweepEvent.p.y, h = Qe(e, n, o, i, s, a), f = Qe(e, n, o, i, c, l);
  if (h > 0 && f > 0) return !1;
  if (h < 0 && f < 0) return !1;
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
  const p = (l - a) * (o - e) - (c - s) * (i - n), g = (c - s) * (n - a) - (l - a) * (e - s), b = (o - e) * (n - a) - (i - n) * (e - s);
  if (p === 0)
    return !1;
  const u = g / p, S = b / p;
  if (u >= 0 && u <= 1 && S >= 0 && S <= 1) {
    const I = e + u * (o - e), m = n + u * (i - n);
    return [I, m];
  }
  return !1;
}
function vi(r, t, e = {}) {
  const { removeDuplicates: n = !0, ignoreSelfIntersections: o = !0 } = e;
  let i = [];
  r.type === "FeatureCollection" ? i = i.concat(r.features) : r.type === "Feature" ? i.push(r) : (r.type === "LineString" || r.type === "Polygon" || r.type === "MultiLineString" || r.type === "MultiPolygon") && i.push(te(r)), t.type === "FeatureCollection" ? i = i.concat(t.features) : t.type === "Feature" ? i.push(t) : (t.type === "LineString" || t.type === "Polygon" || t.type === "MultiLineString" || t.type === "MultiPolygon") && i.push(te(t));
  const s = di(
    xt(i),
    o
  );
  let a = [];
  if (n) {
    const c = {};
    s.forEach((l) => {
      const h = l.join(",");
      c[h] || (c[h] = !0, a.push(l));
    });
  } else
    a = s;
  return xt(a.map((c) => Yt(c)));
}
function bi(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
function xi(r) {
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
function _i(r, t = {}) {
  let e = 0, n = 0, o = 0;
  return $e(
    r,
    function(i) {
      e += i[0], n += i[1], o++;
    },
    !0
  ), Yt([e / o, n / o], t.properties);
}
var he = { exports: {} }, we = { exports: {} }, Si = we.exports, en;
function Mi() {
  return en || (en = 1, (function(r, t) {
    (function(e, n) {
      r.exports = n();
    })(Si, function() {
      function e(m, y, d, x, M) {
        (function _(B, A, O, C, N) {
          for (; C > O; ) {
            if (C - O > 600) {
              var X = C - O + 1, v = A - O + 1, E = Math.log(X), k = 0.5 * Math.exp(2 * E / 3), F = 0.5 * Math.sqrt(E * k * (X - k) / X) * (v - X / 2 < 0 ? -1 : 1), D = Math.max(O, Math.floor(A - v * k / X + F)), $ = Math.min(C, Math.floor(A + (X - v) * k / X + F));
              _(B, A, D, $, N);
            }
            var w = B[A], T = O, P = C;
            for (n(B, O, A), N(B[C], w) > 0 && n(B, O, C); T < P; ) {
              for (n(B, T, P), T++, P--; N(B[T], w) < 0; ) T++;
              for (; N(B[P], w) > 0; ) P--;
            }
            N(B[O], w) === 0 ? n(B, O, P) : n(B, ++P, C), P <= A && (O = P + 1), A <= P && (C = P - 1);
          }
        })(m, y, d || 0, x || m.length - 1, M || o);
      }
      function n(m, y, d) {
        var x = m[y];
        m[y] = m[d], m[d] = x;
      }
      function o(m, y) {
        return m < y ? -1 : m > y ? 1 : 0;
      }
      var i = function(m) {
        m === void 0 && (m = 9), this._maxEntries = Math.max(4, m), this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries)), this.clear();
      };
      function s(m, y, d) {
        if (!d) return y.indexOf(m);
        for (var x = 0; x < y.length; x++) if (d(m, y[x])) return x;
        return -1;
      }
      function a(m, y) {
        c(m, 0, m.children.length, y, m);
      }
      function c(m, y, d, x, M) {
        M || (M = S(null)), M.minX = 1 / 0, M.minY = 1 / 0, M.maxX = -1 / 0, M.maxY = -1 / 0;
        for (var _ = y; _ < d; _++) {
          var B = m.children[_];
          l(M, m.leaf ? x(B) : B);
        }
        return M;
      }
      function l(m, y) {
        return m.minX = Math.min(m.minX, y.minX), m.minY = Math.min(m.minY, y.minY), m.maxX = Math.max(m.maxX, y.maxX), m.maxY = Math.max(m.maxY, y.maxY), m;
      }
      function h(m, y) {
        return m.minX - y.minX;
      }
      function f(m, y) {
        return m.minY - y.minY;
      }
      function p(m) {
        return (m.maxX - m.minX) * (m.maxY - m.minY);
      }
      function g(m) {
        return m.maxX - m.minX + (m.maxY - m.minY);
      }
      function b(m, y) {
        return m.minX <= y.minX && m.minY <= y.minY && y.maxX <= m.maxX && y.maxY <= m.maxY;
      }
      function u(m, y) {
        return y.minX <= m.maxX && y.minY <= m.maxY && y.maxX >= m.minX && y.maxY >= m.minY;
      }
      function S(m) {
        return { children: m, height: 1, leaf: !0, minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
      }
      function I(m, y, d, x, M) {
        for (var _ = [y, d]; _.length; ) if (!((d = _.pop()) - (y = _.pop()) <= x)) {
          var B = y + Math.ceil((d - y) / x / 2) * x;
          e(m, B, y, d, M), _.push(y, B, B, d);
        }
      }
      return i.prototype.all = function() {
        return this._all(this.data, []);
      }, i.prototype.search = function(m) {
        var y = this.data, d = [];
        if (!u(m, y)) return d;
        for (var x = this.toBBox, M = []; y; ) {
          for (var _ = 0; _ < y.children.length; _++) {
            var B = y.children[_], A = y.leaf ? x(B) : B;
            u(m, A) && (y.leaf ? d.push(B) : b(m, A) ? this._all(B, d) : M.push(B));
          }
          y = M.pop();
        }
        return d;
      }, i.prototype.collides = function(m) {
        var y = this.data;
        if (!u(m, y)) return !1;
        for (var d = []; y; ) {
          for (var x = 0; x < y.children.length; x++) {
            var M = y.children[x], _ = y.leaf ? this.toBBox(M) : M;
            if (u(m, _)) {
              if (y.leaf || b(m, _)) return !0;
              d.push(M);
            }
          }
          y = d.pop();
        }
        return !1;
      }, i.prototype.load = function(m) {
        if (!m || !m.length) return this;
        if (m.length < this._minEntries) {
          for (var y = 0; y < m.length; y++) this.insert(m[y]);
          return this;
        }
        var d = this._build(m.slice(), 0, m.length - 1, 0);
        if (this.data.children.length) if (this.data.height === d.height) this._splitRoot(this.data, d);
        else {
          if (this.data.height < d.height) {
            var x = this.data;
            this.data = d, d = x;
          }
          this._insert(d, this.data.height - d.height - 1, !0);
        }
        else this.data = d;
        return this;
      }, i.prototype.insert = function(m) {
        return m && this._insert(m, this.data.height - 1), this;
      }, i.prototype.clear = function() {
        return this.data = S([]), this;
      }, i.prototype.remove = function(m, y) {
        if (!m) return this;
        for (var d, x, M, _ = this.data, B = this.toBBox(m), A = [], O = []; _ || A.length; ) {
          if (_ || (_ = A.pop(), x = A[A.length - 1], d = O.pop(), M = !0), _.leaf) {
            var C = s(m, _.children, y);
            if (C !== -1) return _.children.splice(C, 1), A.push(_), this._condense(A), this;
          }
          M || _.leaf || !b(_, B) ? x ? (d++, _ = x.children[d], M = !1) : _ = null : (A.push(_), O.push(d), d = 0, x = _, _ = _.children[0]);
        }
        return this;
      }, i.prototype.toBBox = function(m) {
        return m;
      }, i.prototype.compareMinX = function(m, y) {
        return m.minX - y.minX;
      }, i.prototype.compareMinY = function(m, y) {
        return m.minY - y.minY;
      }, i.prototype.toJSON = function() {
        return this.data;
      }, i.prototype.fromJSON = function(m) {
        return this.data = m, this;
      }, i.prototype._all = function(m, y) {
        for (var d = []; m; ) m.leaf ? y.push.apply(y, m.children) : d.push.apply(d, m.children), m = d.pop();
        return y;
      }, i.prototype._build = function(m, y, d, x) {
        var M, _ = d - y + 1, B = this._maxEntries;
        if (_ <= B) return a(M = S(m.slice(y, d + 1)), this.toBBox), M;
        x || (x = Math.ceil(Math.log(_) / Math.log(B)), B = Math.ceil(_ / Math.pow(B, x - 1))), (M = S([])).leaf = !1, M.height = x;
        var A = Math.ceil(_ / B), O = A * Math.ceil(Math.sqrt(B));
        I(m, y, d, O, this.compareMinX);
        for (var C = y; C <= d; C += O) {
          var N = Math.min(C + O - 1, d);
          I(m, C, N, A, this.compareMinY);
          for (var X = C; X <= N; X += A) {
            var v = Math.min(X + A - 1, N);
            M.children.push(this._build(m, X, v, x - 1));
          }
        }
        return a(M, this.toBBox), M;
      }, i.prototype._chooseSubtree = function(m, y, d, x) {
        for (; x.push(y), !y.leaf && x.length - 1 !== d; ) {
          for (var M = 1 / 0, _ = 1 / 0, B = void 0, A = 0; A < y.children.length; A++) {
            var O = y.children[A], C = p(O), N = (X = m, v = O, (Math.max(v.maxX, X.maxX) - Math.min(v.minX, X.minX)) * (Math.max(v.maxY, X.maxY) - Math.min(v.minY, X.minY)) - C);
            N < _ ? (_ = N, M = C < M ? C : M, B = O) : N === _ && C < M && (M = C, B = O);
          }
          y = B || y.children[0];
        }
        var X, v;
        return y;
      }, i.prototype._insert = function(m, y, d) {
        var x = d ? m : this.toBBox(m), M = [], _ = this._chooseSubtree(x, this.data, y, M);
        for (_.children.push(m), l(_, x); y >= 0 && M[y].children.length > this._maxEntries; ) this._split(M, y), y--;
        this._adjustParentBBoxes(x, M, y);
      }, i.prototype._split = function(m, y) {
        var d = m[y], x = d.children.length, M = this._minEntries;
        this._chooseSplitAxis(d, M, x);
        var _ = this._chooseSplitIndex(d, M, x), B = S(d.children.splice(_, d.children.length - _));
        B.height = d.height, B.leaf = d.leaf, a(d, this.toBBox), a(B, this.toBBox), y ? m[y - 1].children.push(B) : this._splitRoot(d, B);
      }, i.prototype._splitRoot = function(m, y) {
        this.data = S([m, y]), this.data.height = m.height + 1, this.data.leaf = !1, a(this.data, this.toBBox);
      }, i.prototype._chooseSplitIndex = function(m, y, d) {
        for (var x, M, _, B, A, O, C, N = 1 / 0, X = 1 / 0, v = y; v <= d - y; v++) {
          var E = c(m, 0, v, this.toBBox), k = c(m, v, d, this.toBBox), F = (M = E, _ = k, B = void 0, A = void 0, O = void 0, C = void 0, B = Math.max(M.minX, _.minX), A = Math.max(M.minY, _.minY), O = Math.min(M.maxX, _.maxX), C = Math.min(M.maxY, _.maxY), Math.max(0, O - B) * Math.max(0, C - A)), D = p(E) + p(k);
          F < N ? (N = F, x = v, X = D < X ? D : X) : F === N && D < X && (X = D, x = v);
        }
        return x || d - y;
      }, i.prototype._chooseSplitAxis = function(m, y, d) {
        var x = m.leaf ? this.compareMinX : h, M = m.leaf ? this.compareMinY : f;
        this._allDistMargin(m, y, d, x) < this._allDistMargin(m, y, d, M) && m.children.sort(x);
      }, i.prototype._allDistMargin = function(m, y, d, x) {
        m.children.sort(x);
        for (var M = this.toBBox, _ = c(m, 0, y, M), B = c(m, d - y, d, M), A = g(_) + g(B), O = y; O < d - y; O++) {
          var C = m.children[O];
          l(_, m.leaf ? M(C) : C), A += g(_);
        }
        for (var N = d - y - 1; N >= y; N--) {
          var X = m.children[N];
          l(B, m.leaf ? M(X) : X), A += g(B);
        }
        return A;
      }, i.prototype._adjustParentBBoxes = function(m, y, d) {
        for (var x = d; x >= 0; x--) l(y[x], m);
      }, i.prototype._condense = function(m) {
        for (var y = m.length - 1, d = void 0; y >= 0; y--) m[y].children.length === 0 ? y > 0 ? (d = m[y - 1].children).splice(d.indexOf(m[y]), 1) : this.clear() : a(m[y], this.toBBox);
      }, i;
    });
  })(we)), we.exports;
}
const ki = /* @__PURE__ */ xi(oi);
var zt = { exports: {} }, Te, nn;
function Ei() {
  return nn || (nn = 1, Te = function(t, e, n, o) {
    var i = t[0], s = t[1], a = !1;
    n === void 0 && (n = 0), o === void 0 && (o = e.length);
    for (var c = (o - n) / 2, l = 0, h = c - 1; l < c; h = l++) {
      var f = e[n + l * 2 + 0], p = e[n + l * 2 + 1], g = e[n + h * 2 + 0], b = e[n + h * 2 + 1], u = p > s != b > s && i < (g - f) * (s - p) / (b - p) + f;
      u && (a = !a);
    }
    return a;
  }), Te;
}
var Fe, rn;
function Ai() {
  return rn || (rn = 1, Fe = function(t, e, n, o) {
    var i = t[0], s = t[1], a = !1;
    n === void 0 && (n = 0), o === void 0 && (o = e.length);
    for (var c = o - n, l = 0, h = c - 1; l < c; h = l++) {
      var f = e[l + n][0], p = e[l + n][1], g = e[h + n][0], b = e[h + n][1], u = p > s != b > s && i < (g - f) * (s - p) / (b - p) + f;
      u && (a = !a);
    }
    return a;
  }), Fe;
}
var sn;
function Ii() {
  if (sn) return zt.exports;
  sn = 1;
  var r = Ei(), t = Ai();
  return zt.exports = function(n, o, i, s) {
    return o.length > 0 && Array.isArray(o[0]) ? t(n, o, i, s) : r(n, o, i, s);
  }, zt.exports.nested = t, zt.exports.flat = r, zt.exports;
}
var Gt = { exports: {} }, Bi = Gt.exports, on;
function Oi() {
  return on || (on = 1, (function(r, t) {
    (function(e, n) {
      n(t);
    })(Bi, function(e) {
      const o = 33306690738754706e-32;
      function i(u, S, I, m, y) {
        let d, x, M, _, B = S[0], A = m[0], O = 0, C = 0;
        A > B == A > -B ? (d = B, B = S[++O]) : (d = A, A = m[++C]);
        let N = 0;
        if (O < u && C < I) for (A > B == A > -B ? (M = d - ((x = B + d) - B), B = S[++O]) : (M = d - ((x = A + d) - A), A = m[++C]), d = x, M !== 0 && (y[N++] = M); O < u && C < I; ) A > B == A > -B ? (M = d - ((x = d + B) - (_ = x - d)) + (B - _), B = S[++O]) : (M = d - ((x = d + A) - (_ = x - d)) + (A - _), A = m[++C]), d = x, M !== 0 && (y[N++] = M);
        for (; O < u; ) M = d - ((x = d + B) - (_ = x - d)) + (B - _), B = S[++O], d = x, M !== 0 && (y[N++] = M);
        for (; C < I; ) M = d - ((x = d + A) - (_ = x - d)) + (A - _), A = m[++C], d = x, M !== 0 && (y[N++] = M);
        return d === 0 && N !== 0 || (y[N++] = d), N;
      }
      function s(u) {
        return new Float64Array(u);
      }
      const a = 33306690738754716e-32, c = 22204460492503146e-32, l = 11093356479670487e-47, h = s(4), f = s(8), p = s(12), g = s(16), b = s(4);
      e.orient2d = function(u, S, I, m, y, d) {
        const x = (S - d) * (I - y), M = (u - y) * (m - d), _ = x - M;
        if (x === 0 || M === 0 || x > 0 != M > 0) return _;
        const B = Math.abs(x + M);
        return Math.abs(_) >= a * B ? _ : -(function(A, O, C, N, X, v, E) {
          let k, F, D, $, w, T, P, R, q, Y, j, V, G, H, W, J, Z, Q;
          const at = A - X, ft = C - X, rt = O - v, st = N - v;
          w = (W = (R = at - (P = (T = 134217729 * at) - (T - at))) * (Y = st - (q = (T = 134217729 * st) - (T - st))) - ((H = at * st) - P * q - R * q - P * Y)) - (j = W - (Z = (R = rt - (P = (T = 134217729 * rt) - (T - rt))) * (Y = ft - (q = (T = 134217729 * ft) - (T - ft))) - ((J = rt * ft) - P * q - R * q - P * Y))), h[0] = W - (j + w) + (w - Z), w = (G = H - ((V = H + j) - (w = V - H)) + (j - w)) - (j = G - J), h[1] = G - (j + w) + (w - J), w = (Q = V + j) - V, h[2] = V - (Q - w) + (j - w), h[3] = Q;
          let Ot = (function(Ln, Ye) {
            let Le = Ye[0];
            for (let xe = 1; xe < Ln; xe++) Le += Ye[xe];
            return Le;
          })(4, h), Ut = c * E;
          if (Ot >= Ut || -Ot >= Ut || (k = A - (at + (w = A - at)) + (w - X), D = C - (ft + (w = C - ft)) + (w - X), F = O - (rt + (w = O - rt)) + (w - v), $ = N - (st + (w = N - st)) + (w - v), k === 0 && F === 0 && D === 0 && $ === 0) || (Ut = l * E + o * Math.abs(Ot), (Ot += at * $ + st * k - (rt * D + ft * F)) >= Ut || -Ot >= Ut)) return Ot;
          w = (W = (R = k - (P = (T = 134217729 * k) - (T - k))) * (Y = st - (q = (T = 134217729 * st) - (T - st))) - ((H = k * st) - P * q - R * q - P * Y)) - (j = W - (Z = (R = F - (P = (T = 134217729 * F) - (T - F))) * (Y = ft - (q = (T = 134217729 * ft) - (T - ft))) - ((J = F * ft) - P * q - R * q - P * Y))), b[0] = W - (j + w) + (w - Z), w = (G = H - ((V = H + j) - (w = V - H)) + (j - w)) - (j = G - J), b[1] = G - (j + w) + (w - J), w = (Q = V + j) - V, b[2] = V - (Q - w) + (j - w), b[3] = Q;
          const Xn = i(4, h, 4, b, f);
          w = (W = (R = at - (P = (T = 134217729 * at) - (T - at))) * (Y = $ - (q = (T = 134217729 * $) - (T - $))) - ((H = at * $) - P * q - R * q - P * Y)) - (j = W - (Z = (R = rt - (P = (T = 134217729 * rt) - (T - rt))) * (Y = D - (q = (T = 134217729 * D) - (T - D))) - ((J = rt * D) - P * q - R * q - P * Y))), b[0] = W - (j + w) + (w - Z), w = (G = H - ((V = H + j) - (w = V - H)) + (j - w)) - (j = G - J), b[1] = G - (j + w) + (w - J), w = (Q = V + j) - V, b[2] = V - (Q - w) + (j - w), b[3] = Q;
          const Rn = i(Xn, f, 4, b, p);
          w = (W = (R = k - (P = (T = 134217729 * k) - (T - k))) * (Y = $ - (q = (T = 134217729 * $) - (T - $))) - ((H = k * $) - P * q - R * q - P * Y)) - (j = W - (Z = (R = F - (P = (T = 134217729 * F) - (T - F))) * (Y = D - (q = (T = 134217729 * D) - (T - D))) - ((J = F * D) - P * q - R * q - P * Y))), b[0] = W - (j + w) + (w - Z), w = (G = H - ((V = H + j) - (w = V - H)) + (j - w)) - (j = G - J), b[1] = G - (j + w) + (w - J), w = (Q = V + j) - V, b[2] = V - (Q - w) + (j - w), b[3] = Q;
          const Yn = i(Rn, p, 4, b, g);
          return g[Yn - 1];
        })(u, S, I, m, y, d, B);
      }, e.orient2dfast = function(u, S, I, m, y, d) {
        return (S - d) * (I - y) - (u - y) * (m - d);
      }, Object.defineProperty(e, "__esModule", { value: !0 });
    });
  })(Gt, Gt.exports)), Gt.exports;
}
var an;
function Ti() {
  if (an) return he.exports;
  an = 1;
  var r = Mi(), t = ki, e = Ii(), n = Oi().orient2d;
  t.default && (t = t.default), he.exports = o, he.exports.default = o;
  function o(d, x, M) {
    x = Math.max(0, x === void 0 ? 2 : x), M = M || 0;
    var _ = g(d), B = new r(16);
    B.toBBox = function(P) {
      return {
        minX: P[0],
        minY: P[1],
        maxX: P[0],
        maxY: P[1]
      };
    }, B.compareMinX = function(P, R) {
      return P[0] - R[0];
    }, B.compareMinY = function(P, R) {
      return P[1] - R[1];
    }, B.load(d);
    for (var A = [], O = 0, C; O < _.length; O++) {
      var N = _[O];
      B.remove(N), C = b(N, C), A.push(C);
    }
    var X = new r(16);
    for (O = 0; O < A.length; O++) X.insert(p(A[O]));
    for (var v = x * x, E = M * M; A.length; ) {
      var k = A.shift(), F = k.p, D = k.next.p, $ = u(F, D);
      if (!($ < E)) {
        var w = $ / v;
        N = i(B, k.prev.p, F, D, k.next.next.p, w, X), N && Math.min(u(N, F), u(N, D)) <= w && (A.push(k), A.push(b(N, k)), B.remove(N), X.remove(k), X.insert(p(k)), X.insert(p(k.next)));
      }
    }
    k = C;
    var T = [];
    do
      T.push(k.p), k = k.next;
    while (k !== C);
    return T.push(k.p), T;
  }
  function i(d, x, M, _, B, A, O) {
    for (var C = new t([], s), N = d.data; N; ) {
      for (var X = 0; X < N.children.length; X++) {
        var v = N.children[X], E = N.leaf ? S(v, M, _) : a(M, _, v);
        E > A || C.push({
          node: v,
          dist: E
        });
      }
      for (; C.length && !C.peek().node.children; ) {
        var k = C.pop(), F = k.node, D = S(F, x, M), $ = S(F, _, B);
        if (k.dist < D && k.dist < $ && l(M, F, O) && l(_, F, O)) return F;
      }
      N = C.pop(), N && (N = N.node);
    }
    return null;
  }
  function s(d, x) {
    return d.dist - x.dist;
  }
  function a(d, x, M) {
    if (c(d, M) || c(x, M)) return 0;
    var _ = I(d[0], d[1], x[0], x[1], M.minX, M.minY, M.maxX, M.minY);
    if (_ === 0) return 0;
    var B = I(d[0], d[1], x[0], x[1], M.minX, M.minY, M.minX, M.maxY);
    if (B === 0) return 0;
    var A = I(d[0], d[1], x[0], x[1], M.maxX, M.minY, M.maxX, M.maxY);
    if (A === 0) return 0;
    var O = I(d[0], d[1], x[0], x[1], M.minX, M.maxY, M.maxX, M.maxY);
    return O === 0 ? 0 : Math.min(_, B, A, O);
  }
  function c(d, x) {
    return d[0] >= x.minX && d[0] <= x.maxX && d[1] >= x.minY && d[1] <= x.maxY;
  }
  function l(d, x, M) {
    for (var _ = Math.min(d[0], x[0]), B = Math.min(d[1], x[1]), A = Math.max(d[0], x[0]), O = Math.max(d[1], x[1]), C = M.search({ minX: _, minY: B, maxX: A, maxY: O }), N = 0; N < C.length; N++)
      if (f(C[N].p, C[N].next.p, d, x)) return !1;
    return !0;
  }
  function h(d, x, M) {
    return n(d[0], d[1], x[0], x[1], M[0], M[1]);
  }
  function f(d, x, M, _) {
    return d !== _ && x !== M && h(d, x, M) > 0 != h(d, x, _) > 0 && h(M, _, d) > 0 != h(M, _, x) > 0;
  }
  function p(d) {
    var x = d.p, M = d.next.p;
    return d.minX = Math.min(x[0], M[0]), d.minY = Math.min(x[1], M[1]), d.maxX = Math.max(x[0], M[0]), d.maxY = Math.max(x[1], M[1]), d;
  }
  function g(d) {
    for (var x = d[0], M = d[0], _ = d[0], B = d[0], A = 0; A < d.length; A++) {
      var O = d[A];
      O[0] < x[0] && (x = O), O[0] > _[0] && (_ = O), O[1] < M[1] && (M = O), O[1] > B[1] && (B = O);
    }
    var C = [x, M, _, B], N = C.slice();
    for (A = 0; A < d.length; A++)
      e(d[A], C) || N.push(d[A]);
    return y(N);
  }
  function b(d, x) {
    var M = {
      p: d,
      prev: null,
      next: null,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };
    return x ? (M.next = x.next, M.prev = x, x.next.prev = M, x.next = M) : (M.prev = M, M.next = M), M;
  }
  function u(d, x) {
    var M = d[0] - x[0], _ = d[1] - x[1];
    return M * M + _ * _;
  }
  function S(d, x, M) {
    var _ = x[0], B = x[1], A = M[0] - _, O = M[1] - B;
    if (A !== 0 || O !== 0) {
      var C = ((d[0] - _) * A + (d[1] - B) * O) / (A * A + O * O);
      C > 1 ? (_ = M[0], B = M[1]) : C > 0 && (_ += A * C, B += O * C);
    }
    return A = d[0] - _, O = d[1] - B, A * A + O * O;
  }
  function I(d, x, M, _, B, A, O, C) {
    var N = M - d, X = _ - x, v = O - B, E = C - A, k = d - B, F = x - A, D = N * N + X * X, $ = N * v + X * E, w = v * v + E * E, T = N * k + X * F, P = v * k + E * F, R = D * w - $ * $, q, Y, j, V, G = R, H = R;
    R === 0 ? (Y = 0, G = 1, V = P, H = w) : (Y = $ * P - w * T, V = D * P - $ * T, Y < 0 ? (Y = 0, V = P, H = w) : Y > G && (Y = G, V = P + $, H = w)), V < 0 ? (V = 0, -T < 0 ? Y = 0 : -T > D ? Y = G : (Y = -T, G = D)) : V > H && (V = H, -T + $ < 0 ? Y = 0 : -T + $ > D ? Y = G : (Y = -T + $, G = D)), q = Y === 0 ? 0 : Y / G, j = V === 0 ? 0 : V / H;
    var W = (1 - q) * d + q * M, J = (1 - q) * x + q * _, Z = (1 - j) * B + j * O, Q = (1 - j) * A + j * C, at = Z - W, ft = Q - J;
    return at * at + ft * ft;
  }
  function m(d, x) {
    return d[0] === x[0] ? d[1] - x[1] : d[0] - x[0];
  }
  function y(d) {
    d.sort(m);
    for (var x = [], M = 0; M < d.length; M++) {
      for (; x.length >= 2 && h(x[x.length - 2], x[x.length - 1], d[M]) <= 0; )
        x.pop();
      x.push(d[M]);
    }
    for (var _ = [], B = d.length - 1; B >= 0; B--) {
      for (; _.length >= 2 && h(_[_.length - 2], _[_.length - 1], d[B]) <= 0; )
        _.pop();
      _.push(d[B]);
    }
    return _.pop(), x.pop(), x.concat(_);
  }
  return he.exports;
}
var Fi = Ti();
const Ci = /* @__PURE__ */ bi(Fi);
function cn(r, t = {}) {
  t.concavity = t.concavity || 1 / 0;
  const e = [];
  if ($e(r, (o) => {
    e.push([o[0], o[1]]);
  }), !e.length)
    return null;
  const n = Ci(e, t.concavity);
  return n.length > 3 ? ie([n], t.properties) : null;
}
const ln = Math.pow(2, -52), ue = new Uint32Array(512);
class Xe {
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
  static from(t, e = Xi, n = Ri) {
    const o = t.length, i = new Float64Array(o * 2);
    for (let s = 0; s < o; s++) {
      const a = t[s];
      i[2 * s] = e(a), i[2 * s + 1] = n(a);
    }
    return new Xe(i);
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
    const { coords: t, _hullPrev: e, _hullNext: n, _hullTri: o, _hullHash: i } = this, s = t.length >> 1;
    let a = 1 / 0, c = 1 / 0, l = -1 / 0, h = -1 / 0;
    for (let A = 0; A < s; A++) {
      const O = t[2 * A], C = t[2 * A + 1];
      O < a && (a = O), C < c && (c = C), O > l && (l = O), C > h && (h = C), this._ids[A] = A;
    }
    const f = (a + l) / 2, p = (c + h) / 2;
    let g = 0, b = 0, u = 0;
    for (let A = 0, O = 1 / 0; A < s; A++) {
      const C = Ce(f, p, t[2 * A], t[2 * A + 1]);
      C < O && (g = A, O = C);
    }
    const S = t[2 * g], I = t[2 * g + 1];
    for (let A = 0, O = 1 / 0; A < s; A++) {
      if (A === g) continue;
      const C = Ce(S, I, t[2 * A], t[2 * A + 1]);
      C < O && C > 0 && (b = A, O = C);
    }
    let m = t[2 * b], y = t[2 * b + 1], d = 1 / 0;
    for (let A = 0; A < s; A++) {
      if (A === g || A === b) continue;
      const O = $i(S, I, m, y, t[2 * A], t[2 * A + 1]);
      O < d && (u = A, d = O);
    }
    let x = t[2 * u], M = t[2 * u + 1];
    if (d === 1 / 0) {
      for (let C = 0; C < s; C++)
        this._dists[C] = t[2 * C] - t[0] || t[2 * C + 1] - t[1];
      Vt(this._ids, this._dists, 0, s - 1);
      const A = new Uint32Array(s);
      let O = 0;
      for (let C = 0, N = -1 / 0; C < s; C++) {
        const X = this._ids[C], v = this._dists[X];
        v > N && (A[O++] = X, N = v);
      }
      this.hull = A.subarray(0, O), this.triangles = new Uint32Array(0), this.halfedges = new Int32Array(0);
      return;
    }
    if (dt(S, I, m, y, x, M) < 0) {
      const A = b, O = m, C = y;
      b = u, m = x, y = M, u = A, x = O, M = C;
    }
    const _ = Pi(S, I, m, y, x, M);
    this._cx = _.x, this._cy = _.y;
    for (let A = 0; A < s; A++)
      this._dists[A] = Ce(t[2 * A], t[2 * A + 1], _.x, _.y);
    Vt(this._ids, this._dists, 0, s - 1), this._hullStart = g;
    let B = 3;
    n[g] = e[u] = b, n[b] = e[g] = u, n[u] = e[b] = g, o[g] = 0, o[b] = 1, o[u] = 2, i.fill(-1), i[this._hashKey(S, I)] = g, i[this._hashKey(m, y)] = b, i[this._hashKey(x, M)] = u, this.trianglesLen = 0, this._addTriangle(g, b, u, -1, -1, -1);
    for (let A = 0, O = 0, C = 0; A < this._ids.length; A++) {
      const N = this._ids[A], X = t[2 * N], v = t[2 * N + 1];
      if (A > 0 && Math.abs(X - O) <= ln && Math.abs(v - C) <= ln || (O = X, C = v, N === g || N === b || N === u)) continue;
      let E = 0;
      for (let w = 0, T = this._hashKey(X, v); w < this._hashSize && (E = i[(T + w) % this._hashSize], !(E !== -1 && E !== n[E])); w++)
        ;
      E = e[E];
      let k = E, F;
      for (; F = n[k], dt(X, v, t[2 * k], t[2 * k + 1], t[2 * F], t[2 * F + 1]) >= 0; )
        if (k = F, k === E) {
          k = -1;
          break;
        }
      if (k === -1) continue;
      let D = this._addTriangle(k, N, n[k], -1, -1, o[k]);
      o[N] = this._legalize(D + 2), o[k] = D, B++;
      let $ = n[k];
      for (; F = n[$], dt(X, v, t[2 * $], t[2 * $ + 1], t[2 * F], t[2 * F + 1]) < 0; )
        D = this._addTriangle($, N, F, o[N], -1, o[$]), o[N] = this._legalize(D + 2), n[$] = $, B--, $ = F;
      if (k === E)
        for (; F = e[k], dt(X, v, t[2 * F], t[2 * F + 1], t[2 * k], t[2 * k + 1]) < 0; )
          D = this._addTriangle(F, N, k, -1, o[k], o[F]), this._legalize(D + 2), o[F] = D, n[k] = k, B--, k = F;
      this._hullStart = e[N] = k, n[k] = e[$] = N, n[N] = $, i[this._hashKey(X, v)] = N, i[this._hashKey(t[2 * k], t[2 * k + 1])] = k;
    }
    this.hull = new Uint32Array(B);
    for (let A = 0, O = this._hullStart; A < B; A++)
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
    return Math.floor(Di(t - this._cx, e - this._cy) * this._hashSize) % this._hashSize;
  }
  /**
   * Flip an edge in a pair of triangles if it doesn't satisfy the Delaunay condition.
   *
   * @param {number} a
   * @private
   */
  _legalize(t) {
    const { _triangles: e, _halfedges: n, coords: o } = this;
    let i = 0, s = 0;
    for (; ; ) {
      const a = n[t], c = t - t % 3;
      if (s = c + (t + 2) % 3, a === -1) {
        if (i === 0) break;
        t = ue[--i];
        continue;
      }
      const l = a - a % 3, h = c + (t + 1) % 3, f = l + (a + 2) % 3, p = e[s], g = e[t], b = e[h], u = e[f];
      if (Ni(
        o[2 * p],
        o[2 * p + 1],
        o[2 * g],
        o[2 * g + 1],
        o[2 * b],
        o[2 * b + 1],
        o[2 * u],
        o[2 * u + 1]
      )) {
        e[t] = u, e[a] = p;
        const I = n[f];
        if (I === -1) {
          let y = this._hullStart;
          do {
            if (this._hullTri[y] === f) {
              this._hullTri[y] = t;
              break;
            }
            y = this._hullPrev[y];
          } while (y !== this._hullStart);
        }
        this._link(t, I), this._link(a, n[s]), this._link(s, f);
        const m = l + (a + 1) % 3;
        i < ue.length && (ue[i++] = m);
      } else {
        if (i === 0) break;
        t = ue[--i];
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
  _addTriangle(t, e, n, o, i, s) {
    const a = this.trianglesLen;
    return this._triangles[a] = t, this._triangles[a + 1] = e, this._triangles[a + 2] = n, this._link(a, o), this._link(a + 1, i), this._link(a + 2, s), this.trianglesLen += 3, a;
  }
}
function Di(r, t) {
  const e = r / (Math.abs(r) + Math.abs(t));
  return (t > 0 ? 3 - e : 1 + e) / 4;
}
function Ce(r, t, e, n) {
  const o = r - e, i = t - n;
  return o * o + i * i;
}
function Ni(r, t, e, n, o, i, s, a) {
  const c = r - s, l = t - a, h = e - s, f = n - a, p = o - s, g = i - a, b = c * c + l * l, u = h * h + f * f, S = p * p + g * g;
  return c * (f * S - u * g) - l * (h * S - u * p) + b * (h * g - f * p) < 0;
}
function $i(r, t, e, n, o, i) {
  const s = e - r, a = n - t, c = o - r, l = i - t, h = s * s + a * a, f = c * c + l * l, p = 0.5 / (s * l - a * c), g = (l * h - a * f) * p, b = (s * f - c * h) * p;
  return g * g + b * b;
}
function Pi(r, t, e, n, o, i) {
  const s = e - r, a = n - t, c = o - r, l = i - t, h = s * s + a * a, f = c * c + l * l, p = 0.5 / (s * l - a * c), g = r + (l * h - a * f) * p, b = t + (s * f - c * h) * p;
  return { x: g, y: b };
}
function Vt(r, t, e, n) {
  if (n - e <= 20)
    for (let o = e + 1; o <= n; o++) {
      const i = r[o], s = t[i];
      let a = o - 1;
      for (; a >= e && t[r[a]] > s; ) r[a + 1] = r[a--];
      r[a + 1] = i;
    }
  else {
    const o = e + n >> 1;
    let i = e + 1, s = n;
    Ht(r, o, i), t[r[e]] > t[r[n]] && Ht(r, e, n), t[r[i]] > t[r[n]] && Ht(r, i, n), t[r[e]] > t[r[i]] && Ht(r, e, i);
    const a = r[i], c = t[a];
    for (; ; ) {
      do
        i++;
      while (t[r[i]] < c);
      do
        s--;
      while (t[r[s]] > c);
      if (s < i) break;
      Ht(r, i, s);
    }
    r[e + 1] = r[s], r[s] = a, n - i + 1 >= s - e ? (Vt(r, t, i, n), Vt(r, t, e, s - 1)) : (Vt(r, t, e, s - 1), Vt(r, t, i, n));
  }
}
function Ht(r, t, e) {
  const n = r[t];
  r[t] = r[e], r[e] = n;
}
function Xi(r) {
  return r[0];
}
function Ri(r) {
  return r[1];
}
class Yi {
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
    const n = Math.floor(t / this.width), i = 1 << t % this.width;
    return this.bs[n] ^= (-Number(e) ^ this.bs[n]) & i, e;
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
class fn extends Yi {
  constructor(t) {
    super(8, new Uint8Array(Math.ceil(t / 8)).fill(0));
  }
}
function At(r) {
  return r % 3 === 2 ? r - 2 : r + 1;
}
function _t(r) {
  return r % 3 === 0 ? r + 2 : r - 1;
}
function hn(r, t, e, n, o, i, s, a) {
  const c = dt(r, t, o, i, s, a), l = dt(e, n, o, i, s, a);
  if (c > 0 && l > 0 || c < 0 && l < 0)
    return !1;
  const h = dt(o, i, r, t, e, n), f = dt(s, a, r, t, e, n);
  return h > 0 && f > 0 || h < 0 && f < 0 ? !1 : c === 0 && l === 0 && h === 0 && f === 0 ? !(Math.max(o, s) < Math.min(r, e) || Math.max(r, e) < Math.min(o, s) || Math.max(i, a) < Math.min(t, n) || Math.max(t, n) < Math.min(i, a)) : !0;
}
class Li {
  /**
   * The triangulation object from Delaunator.
   */
  del;
  constructor(t) {
    this.del = t;
  }
}
class Zt extends Li {
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
    const n = 2 ** 32 - 1, o = t.coords.length >> 1, i = t.triangles.length;
    this.vertMap = new Uint32Array(o).fill(n), this.flips = new fn(i), this.consd = new fn(i);
    for (let s = 0; s < i; s++) {
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
    const e = new Zt({
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
    const i = this.vertMap[t], s = this.maxConstrainSteps();
    let a = 0, c = i;
    do {
      if (++a > s)
        throw new Error(
          `Constraining edge [${t}, ${e}] exceeded the iteration limit`
        );
      const f = n[c], p = At(c);
      if (f === e)
        return this.protect(c);
      const g = _t(c), b = n[g];
      if (b === e)
        return this.protect(p), p;
      if (this.intersectSegments(t, e, b, f)) {
        c = g;
        break;
      }
      c = o[p];
    } while (c !== -1 && c !== i);
    let l = c, h = -1;
    for (; c !== -1; ) {
      if (++a > s)
        throw new Error(
          `Constraining edge [${t}, ${e}] exceeded the iteration limit`
        );
      const f = o[c], p = _t(c), g = _t(f), b = At(f);
      if (f === -1)
        throw new Error("Constraining edge exited the hull");
      if (this.consd.has(c))
        throw new Error("Edge intersects already constrained edge");
      if (this.isCollinear(t, e, n[c]) || this.isCollinear(t, e, n[f]))
        throw new Error("Constraining edge intersects point");
      if (!this.intersectSegments(
        n[c],
        n[f],
        n[p],
        n[g]
      )) {
        if (h === -1 && (h = c), n[g] === e) {
          if (c === h)
            throw new Error("Infinite loop: non-convex quadrilateral");
          c = h, h = -1;
          continue;
        }
        if (this.intersectSegments(
          t,
          e,
          n[g],
          n[f]
        ))
          c = g;
        else if (this.intersectSegments(
          t,
          e,
          n[b],
          n[g]
        ))
          c = b;
        else if (h === c)
          throw new Error("Infinite loop: no further intersect after non-convex");
        continue;
      }
      if (this.flipDiagonal(c), this.intersectSegments(
        t,
        e,
        n[p],
        n[g]
      ) && (h === -1 && (h = p), h === p))
        throw new Error("Infinite loop: flipped diagonal still intersects");
      n[g] === e ? (l = g, c = h, h = -1) : this.intersectSegments(
        t,
        e,
        n[b],
        n[g]
      ) && (c = b);
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
    const { halfedges: e } = this.del, n = this.flips, o = this.consd, i = e.length;
    let s;
    do {
      s = 0;
      for (let a = 0; a < i; a++) {
        if (o.has(a))
          continue;
        n.delete(a);
        const c = e[a];
        c !== -1 && (n.delete(c), this.isDelaunay(a) || (this.flipDiagonal(a), s++));
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
    const { triangles: n, halfedges: o } = this.del, i = n.length / 3, s = (b, u, S) => {
      const I = t(u), m = t(S);
      return t(b).some((y) => I.includes(y) && m.includes(y));
    }, a = (b) => s(n[b * 3], n[b * 3 + 1], n[b * 3 + 2]), c = (b, u, S, I) => Math.sign(dt(b[u * 2], b[u * 2 + 1], b[S * 2], b[S * 2 + 1], b[I * 2], b[I * 2 + 1])), l = e.map((b) => {
      let u = 0;
      for (let S = 0; S < i; S++) u += c(b, n[S * 3], n[S * 3 + 1], n[S * 3 + 2]);
      return u < 0 ? -1 : 1;
    }), h = (b) => {
      if (this.consd.has(b)) return !1;
      const u = o[b];
      if (u === -1) return !1;
      const S = n[b], I = n[At(b)], m = n[_t(b)], y = n[_t(u)];
      return e.every((d, x) => c(d, m, S, y) === l[x] && c(d, y, I, m) === l[x]);
    };
    let f = 0, p = !0;
    for (; p; ) {
      p = !1;
      for (let b = 0; b < i; b++)
        if (a(b))
          for (let u = 0; u < 3; u++) {
            const S = b * 3 + u;
            if (!h(S)) continue;
            const I = o[S], m = n[S], y = n[At(S)], d = n[_t(S)], x = n[_t(I)];
            if (!(s(d, m, x) && s(x, y, d))) {
              this.protect(this.flipDiagonal(S)), f++, p = !0;
              break;
            }
          }
    }
    let g = 0;
    for (let b = 0; b < i; b++) a(b) && g++;
    return { flips: f, remaining: g };
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
    const n = this.vertMap[e], { triangles: o, halfedges: i } = this.del;
    if (!(n < o.length))
      return 1 / 0;
    let s = n, a, c = 0;
    do {
      if (++c > o.length)
        throw new Error(
          `Looking up edge [${t}, ${e}] exceeded the iteration limit`
        );
      if (o[s] === t)
        return s;
      a = At(s), s = i[a];
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
    const i = e[t];
    return i !== -1 && (n.add(t), n.add(i)), !0;
  }
  /**
   * Flip the edge shared by two triangles.
   */
  flipDiagonal(t) {
    const { triangles: e, halfedges: n } = this.del, o = this.flips, i = this.consd, s = n[t], a = _t(t), c = At(t), l = _t(s), h = At(s), f = n[a], p = n[l];
    if (i.has(t))
      throw new Error("Trying to flip a constrained edge");
    return e[t] = e[l], n[t] = p, o.set(t, o.has(l)) || i.set(t, i.has(l)), p !== -1 && (n[p] = t), n[a] = l, e[s] = e[a], n[s] = f, o.set(s, o.has(a)) || i.set(s, i.has(a)), f !== -1 && (n[f] = s), n[l] = a, this.markFlip(t), this.markFlip(c), this.markFlip(s), this.markFlip(h), o.add(a), i.delete(a), o.add(l), i.delete(l), this.updateVert(t), this.updateVert(c), this.updateVert(s), this.updateVert(h), a;
  }
  /**
   * Whether point p1, p2, and p are collinear.
   */
  isCollinear(t, e, n) {
    const o = this.del.coords;
    return dt(
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
    const i = this.del.coords;
    return ni(
      i[t * 2],
      i[t * 2 + 1],
      i[e * 2],
      i[e * 2 + 1],
      i[n * 2],
      i[n * 2 + 1],
      i[o * 2],
      i[o * 2 + 1]
    ) < 0;
  }
  /**
   * Whether the triangles sharing edg conform to the Delaunay condition.
   */
  isDelaunay(t) {
    const { triangles: e, halfedges: n } = this.del, o = n[t];
    if (o === -1)
      return !0;
    const i = e[_t(t)], s = e[t], a = e[At(t)], c = e[_t(o)];
    return !this.inCircle(i, s, a, c);
  }
  /**
   * Update the vertex -> incoming edge map.
   */
  updateVert(t) {
    const { triangles: e, halfedges: n } = this.del, o = this.vertMap, i = e[t];
    let s = _t(t), a = n[s];
    for (; a !== -1 && a !== t; )
      s = _t(a), a = n[s];
    return o[i] = s, s;
  }
  /**
   * Whether the segments between vertices intersect.
   */
  intersectSegments(t, e, n, o) {
    const i = this.del.coords;
    return t === n || t === o || e === n || e === o ? !1 : hn(
      i[t * 2],
      i[t * 2 + 1],
      i[e * 2],
      i[e * 2 + 1],
      i[n * 2],
      i[n * 2 + 1],
      i[o * 2],
      i[o * 2 + 1]
    );
  }
  static intersectSegments = hn;
}
function de(r, t, e) {
  return De(r, t, e).tin;
}
function De(r, t, e, n, o) {
  if (t || (t = []), typeof r != "object" || r.type !== "FeatureCollection")
    throw "Argument points must be FeatureCollection";
  if (!Array.isArray(t)) throw "Argument points must be Array of Array";
  const i = r.features.map(
    (u) => u.geometry.coordinates
  );
  let s = o?.snapshot ? Zt.restore(o.snapshot) : void 0;
  const a = s ? void 0 : Xe.from(i);
  let c = s ? s.del : a, l = 0, h;
  const f = [];
  if (c.triangles.length !== 0 && (t.length !== 0 || n)) {
    if (!s) {
      s = new Zt(c);
      try {
        s.constrainAll(t);
      } catch (I) {
        if (!n?.allowUnusableBoundary) throw I;
        return { tin: xt([]), remaining: 0, hasBoundary: !1, hull: [] };
      }
      o && (o.snapshot = s.snapshot());
    }
    const u = n ? o?.snapshot ?? s.snapshot() : void 0, S = (I) => {
      const m = Zt.restore(u);
      return m.constrainAll(I), m;
    };
    for (const I of n?.hull ?? [])
      try {
        s.constrainOne(I[0], I[1]), f.push(I);
      } catch {
        s = S(f);
      }
    n?.boundary && (h = qi(s, n.boundary), h || (s = S(f))), n && ({ remaining: l } = s.forbidGroupTriangles(
      n.groupsOf,
      n.planes
    ), l -= h?.size ?? 0), c = s.del;
  }
  const p = [];
  for (let u = 0; u < c.triangles.length; u += 3)
    h?.has(u / 3) || p.push([c.triangles[u], c.triangles[u + 1], c.triangles[u + 2]]);
  const g = ["a", "b", "c"];
  return { tin: xt(
    p.map((u) => {
      const S = {}, I = u.map((m, y) => {
        const d = r.features[m], x = d.geometry.coordinates, M = [x[0], x[1]];
        return x.length === 3 ? M[2] = x[2] : S[g[y]] = d.properties[e], M;
      });
      return I[3] = I[0], ie([I], S);
    })
  ), remaining: l, hasBoundary: h !== void 0, hull: f };
}
function qi(r, t) {
  try {
    r.constrainAll(t);
  } catch {
    return;
  }
  const e = new Map(t), { triangles: n, halfedges: o } = r.del, i = (l) => {
    const h = n[l], f = n[At(l)];
    return e.get(h) === f || e.get(f) === h;
  }, s = /* @__PURE__ */ new Set(), a = [], c = (l) => {
    const h = Math.floor(l / 3);
    s.has(h) || (s.add(h), a.push(h));
  };
  for (let l = 0; l < o.length; l++)
    o[l] === -1 && !i(l) && c(l);
  for (let l = 0; l < a.length; l++)
    for (let h = a[l] * 3; h < a[l] * 3 + 3; h++) {
      if (!e.has(n[h])) return;
      o[h] !== -1 && !i(h) && c(o[h]);
    }
  return s;
}
function un(r) {
  const t = /* @__PURE__ */ new Set(), e = [];
  if (r.forEach(([c, l], h) => {
    const f = `${c}:${l}`;
    t.has(f) || (t.add(f), e.push({ i: h, x: c, y: l }));
  }), e.length < 3) return [];
  const n = (c, l, h) => dt(c.x, c.y, l.x, l.y, h.x, h.y), o = [...e].sort((c, l) => c.x - l.x || c.y - l.y), i = (c) => {
    const l = [];
    for (const h of c) {
      for (; l.length >= 2 && n(l[l.length - 2], l[l.length - 1], h) <= 0; ) l.pop();
      l.push(h);
    }
    return l.pop(), l;
  }, s = [...i(o), ...i([...o].reverse())];
  if (s.length < 3) return [];
  const a = [];
  for (let c = 0; c < s.length; c++) {
    const l = s[c], h = s[(c + 1) % s.length], f = h.x - l.x, p = h.y - l.y, g = f * f + p * p, b = e.filter((S) => S !== l && S !== h && n(l, h, S) === 0).map((S) => ({ r: S, t: ((S.x - l.x) * f + (S.y - l.y) * p) / g })).filter(({ t: S }) => S > 0 && S < 1).sort((S, I) => S.t - I.t).map(({ r: S }) => S), u = [l, ...b, h];
    for (let S = 0; S + 1 < u.length; S++) a.push([u[S].i, u[S + 1].i]);
  }
  return a;
}
function ye([r, t]) {
  return r < t ? `${r}-${t}` : `${t}-${r}`;
}
function Kt(r, t, e) {
  return Yt(r, { target: { geom: t, index: e } });
}
function Wt(r) {
  return Yt(r.properties.target.geom, {
    target: {
      geom: r.geometry.coordinates,
      index: r.properties.target.index
    }
  });
}
function dn(r, t) {
  const e = r.length, n = t.geometry.coordinates;
  return Array.from({ length: e }, (o, i) => i).map((o) => {
    const i = (o + 1) % e, s = r[o], a = r[i], c = s.geometry.coordinates, l = Math.atan2(
      c[0] - n[0],
      c[1] - n[1]
    ), h = [t, s, a, t].map(
      (g) => g.geometry.coordinates
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
    }, p = xt([
      ie([h], f)
    ]);
    return [l, p];
  }).reduce(
    (o, i) => (o[0].push(i[0]), o[1].push(i[1]), o),
    [[], []]
  );
}
const Vi = [0.1, 0.15, 0.225, 0.34, 0.5];
function ji(r, t) {
  return t ? r.hasBoundary !== t.hasBoundary ? r.hasBoundary : r.diagnostics.boundaryTriangleFlips < t.diagnostics.boundaryTriangleFlips : !0;
}
function pn(r, t, e) {
  return Math.sign(dt(r[0], r[1], t[0], t[1], e[0], e[1]));
}
function ve(r, t = -1) {
  let e = 0;
  for (const n of r.features) {
    const { a: o, b: i, c: s } = n.properties;
    if (![o, i, s].some(
      ({ index: f }) => typeof f == "string" && f.startsWith("b")
    ))
      continue;
    const [a, c, l] = n.geometry.coordinates[0];
    pn(a, c, l) * pn(o.geom, i.geom, s.geom) * t <= 0 && e++;
  }
  return e;
}
function mn(r, t, e) {
  if (r.some(([s, a]) => s === t[0] && a === t[1])) return !1;
  const n = r.map(
    ([s, a]) => Math.atan2(a - t[1], s - t[0])
  ), o = 2 * Math.PI;
  let i = 0;
  for (let s = 0; s < n.length; s++) {
    const c = (e * (n[(s + 1) % n.length] - n[s]) + o) % o;
    if (!(c > 0 && c < Math.PI)) return !1;
    i += c;
  }
  return Math.abs(i - o) < 1e-6;
}
function Ui(r, t) {
  const e = new Set(
    t.forw.map(({ geometry: o }) => String(o.coordinates))
  ), n = new Set(
    t.bakw.map(({ geometry: o }) => String(o.coordinates))
  );
  return r.filter(({ forw: o, bakw: i }) => {
    const s = String(o), a = String(i);
    return e.has(s) || n.has(a) ? !1 : (e.add(s), n.add(a), !0);
  });
}
function gn(r, t, e, n, o, i = /* @__PURE__ */ new Set(), s) {
  const { minx: a, maxx: c, miny: l, maxy: h, centroid: f } = r, p = c - a, g = h - l, b = e.forw.length, u = Array.from({ length: b }, () => []);
  let S = 1;
  for (const [_, B] of e.edges)
    _ < n && u[_].push(S), u[B].push(S), B < n && S++;
  const I = (_) => _.slice(0, b).map(({ geometry: B }) => B.coordinates), m = un(I(e.forw)), y = {
    forw: m.filter((_) => !i.has(ye(_))),
    bakw: un(I(e.bakw))
  }, d = [0], x = (_) => _ >= b ? d : u[_];
  let M;
  for (const _ of Vi) {
    const B = s?.get(_) ?? { forwReuse: {} };
    s?.set(_, B);
    const A = B.vertices ?? (B.vertices = Ui(
      t(
        {
          ...r,
          minx: a - _ * p,
          maxx: c + _ * p,
          miny: l - _ * g,
          maxy: h + _ * g
        },
        !0
      ),
      e
    ));
    if (o && (A.length < 4 || !A.every(({ bakw: Y }) => Y.every(Number.isFinite)))) continue;
    const O = A.map(
      ({ forw: Y, bakw: j }, V) => Kt(Y, j, `b${V}`)
    ), C = xt([...e.forw, ...O]), N = xt([
      ...e.bakw,
      ...O.map(Wt)
    ]), X = [C, N].map(
      ({ features: Y }) => Float64Array.from(
        Y.flatMap(
          ({
            geometry: {
              coordinates: [j, V]
            }
          }) => [j, V]
        )
      )
    ), E = o !== void 0 || mn(
      A.map((Y) => Y.forw),
      f.forw,
      -1
    ) && mn(
      A.map((Y) => Y.bakw),
      f.bakw,
      1
    ) ? A.map((Y, j) => [
      b + j,
      b + (j + 1) % A.length
    ]) : void 0, k = { groupsOf: x, planes: X, boundary: E, allowUnusableBoundary: o !== void 0 }, F = o?.orientation ?? -1, D = De(
      C,
      e.edges,
      "target",
      { ...k, hull: y.forw },
      B.forwReuse
    ), $ = B.geographic ?? (B.geographic = (() => {
      const Y = De(N, e.edges, "target", {
        ...k,
        hull: y.bakw
      });
      return { built: Y, flips: ve(Y.tin, F) };
    })()), w = $.built, T = D.tin, P = {
      ...w.tin,
      features: [...w.tin.features]
    }, R = ve(T, F) + $.flips, q = {
      vertices: A,
      forw: T,
      bakw: P,
      diagnostics: {
        margin: _,
        boundaryTriangleFlips: R,
        remainingForbiddenTriangles: D.remaining + w.remaining
      },
      hasMapBoundary: D.hasBoundary,
      hasBoundary: D.hasBoundary && w.hasBoundary,
      forwHull: { all: m, applied: D.hull }
    };
    if (o) {
      if (o.accept(q)) return q;
      continue;
    }
    if (R === 0 && q.hasBoundary)
      return q;
    ji(q, M) && (M = q);
  }
  return M;
}
const zi = 256 * Number.EPSILON;
function Hi(r, t) {
  const e = [r, t].map((o) => {
    const i = o.map((a, c, l) => {
      if (c === 0) return 0;
      const h = l[c - 1];
      return Math.sqrt(
        Math.pow(a[0] - h[0], 2) + Math.pow(a[1] - h[1], 2)
      );
    }), s = i.reduce((a, c, l) => l === 0 ? [0] : (a.push(a[l - 1] + c), a), []);
    return s.map((a, c, l) => {
      const h = a / l[l.length - 1];
      return [o[c], i[c], s[c], h];
    });
  }), n = [];
  return e.forEach((o, i) => {
    const s = e[i ? 0 : 1];
    o.forEach((a, c) => {
      if (c === 0 || c === o.length - 1 || a[4] === "handled")
        return;
      const l = a[0], h = a[3];
      let f, p = 1 / 0;
      for (let g = 1; g < s.length - 1; g++) {
        const b = s[g];
        if (b[4] === "handled") continue;
        const u = Math.abs(b[3] - h);
        u <= zi && u < p && (f = b, p = u);
      }
      if (f) {
        f[4] = "handled", a[4] = "handled", n.push(
          i === 0 ? [l, f[0], h] : [f[0], l, h]
        );
        return;
      }
      for (let g = 0; g < s.length - 1; g++) {
        const b = s[g], u = s[g + 1], S = b[3], I = u[3];
        if (S < h && I > h) {
          const m = (h - S) / (I - S), y = [
            (u[0][0] - b[0][0]) * m + b[0][0],
            (u[0][1] - b[0][1]) * m + b[0][1]
          ];
          n.push(
            i === 0 ? [l, y, h] : [y, l, h]
          );
          return;
        }
      }
    });
  }), n.sort((o, i) => o[2] - i[2]);
}
const wn = 1e-9;
function Gi(r, t) {
  const e = [[], [], [], []], n = [];
  return Object.keys(r).forEach((o) => {
    const i = r[o], s = i.forw, a = i.bakw, c = [
      s[0] - t.forw[0],
      s[1] - t.forw[1]
    ], l = [
      a[0] - t.bakw[0],
      t.bakw[1] - a[1]
    ], h = { forw: c, bakw: l };
    if (n.push(h), c[0] === 0 || c[1] === 0)
      return;
    let f = 0;
    c[0] > 0 && (f += 1), c[1] > 0 && (f += 2), e[f].push(h);
  }), { perQuad: e, aggregate: n };
}
function Ki(r) {
  let t = 1 / 0, e = 0, n = 0;
  return r.forEach((o) => {
    const { forw: i, bakw: s } = o, a = Math.hypot(i[0], i[1]), c = Math.hypot(s[0], s[1]);
    if (c === 0) return;
    const l = a / c, h = Math.atan2(i[0], i[1]) - Math.atan2(s[0], s[1]);
    t = Math.min(t, l), e += Math.cos(h), n += Math.sin(h);
  }), isFinite(t) ? [t, Math.atan2(n, e)] : [1, 0];
}
function Wi(r, t, e) {
  const { perQuad: n, aggregate: o } = Gi(r, t), i = n.every((c) => c.length > 0), a = (e === "birdeye" ? i ? n : [o] : [o]).map((c) => Ki(c));
  return a.length === 1 ? [a[0], a[0], a[0], a[0]] : a;
}
function Ji(r, t) {
  let e = 0;
  return r[0] > t[0] && (e += 1), r[1] > t[1] && (e += 2), e;
}
function Qi(r, t, e) {
  const n = [
    r[0] - t.forw[0],
    r[1] - t.forw[1]
  ], i = Math.sqrt(n[0] ** 2 + n[1] ** 2) / e[0], s = Math.atan2(n[0], n[1]) - e[1];
  return [
    t.bakw[0] + i * Math.sin(s),
    t.bakw[1] - i * Math.cos(s)
  ];
}
function Zi(r, t, e, n) {
  const o = t[0] - r[0], i = t[1] - r[1];
  if (Math.abs(o) < 1e-12 && Math.abs(i) < 1e-12) return null;
  const s = n[0] - e[0], a = n[1] - e[1], c = e[0] - r[0], l = e[1] - r[1], h = o * a - i * s;
  if (Math.abs(h) < 1e-12) return null;
  const f = (c * a - l * s) / h, p = (c * i - l * o) / h;
  return f <= 1e-10 || p < -1e-10 || p > 1 + 1e-10 ? null : { t: f, point: [r[0] + f * o, r[1] + f * i] };
}
function tr(r, t, e) {
  const n = e.length;
  let o = -1 / 0, i = null;
  for (let s = 0; s < n; s++) {
    const a = (s + 1) % n, c = Zi(
      r,
      t,
      e[s].bakw,
      e[a].bakw
    );
    c && c.t > o && (o = c.t, i = c.point);
  }
  return i;
}
function yn(r, t) {
  const n = Math.atan2(r[0] - t[0], r[1] - t[1]) * (180 / Math.PI);
  return n < 0 ? n + 360 : n;
}
function vn(r, t, e, n, o, i) {
  const s = t[0] - r[0], a = t[1] - r[1];
  if (s === 0 && a === 0) return null;
  const c = [];
  if (s !== 0)
    for (const h of [e, n]) {
      const f = (h - r[0]) / s;
      if (f > 0) {
        const p = r[1] + f * a;
        p >= o && p <= i && c.push({ t: f, x: h, y: p });
      }
    }
  if (a !== 0)
    for (const h of [o, i]) {
      const f = (h - r[1]) / a;
      if (f > 0) {
        const p = r[0] + f * s;
        p >= e && p <= n && c.push({ t: f, x: p, y: h });
      }
    }
  if (c.length === 0) return null;
  c.sort((h, f) => h.t - f.t);
  const l = c[0];
  return [l.x, l.y];
}
function bn(r, t, e) {
  const n = r.length, o = new Array(n).fill(1);
  for (const i of t)
    for (let s = 0; s < n; s++) {
      const a = (s + 1) % n, c = Ve([r[s].bakw, r[a].bakw]), l = Ve([e.bakw, i.bakw]), h = vi(c, l);
      if (h.features.length > 0 && h.features[0].geometry) {
        const f = h.features[0], p = Math.sqrt(
          Math.pow(i.bakw[0] - e.bakw[0], 2) + Math.pow(i.bakw[1] - e.bakw[1], 2)
        ), g = Math.sqrt(
          Math.pow(f.geometry.coordinates[0] - e.bakw[0], 2) + Math.pow(f.geometry.coordinates[1] - e.bakw[1], 2)
        ), b = p / g;
        b > o[s] && (o[s] = b), b > o[a] && (o[a] = b);
      }
    }
  r.forEach((i, s) => {
    const a = o[s];
    i.bakw = [
      (i.bakw[0] - e.bakw[0]) * a + e.bakw[0],
      (i.bakw[1] - e.bakw[1]) * a + e.bakw[1]
    ];
  });
}
function Re(r, t, e, n) {
  const { convexBuf: o, centroid: i, allGcps: s, minx: a, maxx: c, miny: l, maxy: h } = r, f = n ? void 0 : Wi(o, i, t), g = [
    [a, l],
    [c, l],
    [c, h],
    [a, h]
  ].map((_) => ({
    forw: _,
    bakw: n ? n(_) : Qi(
      _,
      i,
      f[Ji(_, i.forw)]
    )
  }));
  if (g.sort(
    (_, B) => Math.atan2(_.forw[0] - i.forw[0], _.forw[1] - i.forw[1]) - Math.atan2(B.forw[0] - i.forw[0], B.forw[1] - i.forw[1])
  ), n || bn(g, s, i), !e) return g;
  const b = 4, u = g.map(
    (_) => Math.atan2(_.forw[0] - i.forw[0], _.forw[1] - i.forw[1])
  ), S = g.map(
    (_) => Math.atan2(
      _.bakw[0] - i.bakw[0],
      -(_.bakw[1] - i.bakw[1])
    )
  );
  function I(_) {
    for (let B = 0; B < b; B++) {
      const A = (B + 1) % b, O = u[B], C = B < b - 1 ? u[A] : u[A] + 2 * Math.PI;
      let N = _;
      for (; N < O; ) N += 2 * Math.PI;
      for (; N >= O + 2 * Math.PI; ) N -= 2 * Math.PI;
      if (N >= O && N < C)
        return { i: B, j: A, frac: (N - O) / (C - O) };
    }
    return { i: 0, j: 1, frac: 0 };
  }
  function m(_) {
    const { i: B, j: A, frac: O } = I(_), C = S[B];
    let X = S[A] - C;
    for (; X > Math.PI; ) X -= 2 * Math.PI;
    for (; X < -Math.PI; ) X += 2 * Math.PI;
    return C + O * X;
  }
  const y = new Set(
    g.map(
      (_) => Math.floor(yn(_.forw, i.forw) / 10) % 36
    )
  ), d = s.map((_) => ({
    forw: _.forw,
    bakw: _.bakw,
    angleDeg: yn(_.forw, i.forw),
    forwDist: Math.hypot(_.forw[0] - i.forw[0], _.forw[1] - i.forw[1])
  })), x = [];
  for (let _ = 0; _ < 36; _++) {
    if (y.has(_)) continue;
    const B = _ * 10, A = d.filter(($) => {
      if ($.forwDist === 0) return !1;
      const w = (($.angleDeg - B) % 360 + 360) % 360;
      return w < 10 + wn || w > 360 - wn;
    });
    let O = null;
    if (A.length > 0) {
      const $ = A.reduce((w, T) => T.forwDist > w.forwDist ? T : w);
      O = vn(i.forw, $.forw, a, c, l, h);
    }
    if (!O) {
      const $ = (B + 5) % 360 * (Math.PI / 180), w = [
        i.forw[0] + Math.sin($),
        i.forw[1] + Math.cos($)
      ];
      O = vn(i.forw, w, a, c, l, h);
    }
    if (!O) continue;
    const [C, N] = O, X = 1e-9 * Math.max(c - a, h - l);
    if ([...g, ...x].some(
      ($) => Math.abs($.forw[0] - C) <= X && Math.abs($.forw[1] - N) <= X
    )) continue;
    if (n) {
      x.push({ forw: O, bakw: n(O) });
      continue;
    }
    const v = [O[0] - i.forw[0], O[1] - i.forw[1]], E = Math.atan2(v[0], v[1]), k = m(E), F = [
      i.bakw[0] + Math.sin(k),
      i.bakw[1] - Math.cos(k)
    ], D = tr(i.bakw, F, g);
    D && x.push({ forw: O, bakw: D });
  }
  const M = [...g, ...x];
  return M.sort(
    (_, B) => Math.atan2(_.forw[0] - i.forw[0], _.forw[1] - i.forw[1]) - Math.atan2(B.forw[0] - i.forw[0], B.forw[1] - i.forw[1])
  ), n || bn(M, s, i), M;
}
function er(r, t = !1) {
  return Re(r, "plain", t);
}
function nr(r, t = !1) {
  return Re(r, "birdeye", t);
}
function ir(r, t) {
  const e = /* @__PURE__ */ new Set();
  return Re(r, "plain", !0, t).filter(({ forw: [n, o] }) => {
    const i = `${n}:${o}`;
    return e.has(i) ? !1 : (e.add(i), !0);
  });
}
function qr(r) {
  return Dn(r, 1 / 0);
}
const xn = 1e5, rr = 16;
function Dn(r, t) {
  return sr(r), new or(r).findSegmentIntersections(t).map(
    (o) => Yt([o.x, o.y])
  );
}
function sr(r) {
  for (let t = 0, e = r.length; t < e; t++) {
    const n = r[t];
    ee(n) || Rt(
      "findIntersections() received invalid coordinates:",
      `line=${t}`,
      `points=${n}`
    );
    for (let o = 0, i = n.length; o < i; o++) {
      const s = n[o];
      (!ee(s) || !Number.isFinite(s[0]) || !Number.isFinite(s[1])) && Rt(
        "findIntersections() received non-finite coordinates:",
        `line=${t}`,
        `point=${o}`,
        `coordinates=${JSON.stringify(s)}`
      );
    }
  }
}
class or {
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
    const e = [], n = [], o = t.map((i) => {
      const s = i ? i.length : 0;
      for (let a = 0; a < s; a++)
        e.push(i[a][0]), n.push(i[a][1]);
      return s;
    });
    this.initXYData(o, e, n);
  }
  initXYData(t, e, n) {
    const o = t.length;
    this._xx = new Float64Array(e), this._yy = new Float64Array(n), this._nn = new Uint32Array(t), this._zz = null, this._zlimit = 0, this._filteredArcIter = null, this._ii = new Uint32Array(o);
    let i = 0;
    for (let s = 0; s < o; s++)
      this._ii[s] = i, i += t[s];
    (i != this._xx.length || this._xx.length != this._yy.length) && Rt("ArcCollection#initXYData() Counting error"), this.initBounds(), this._arcIter = new Er(this._xx, this._yy);
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
    const o = n.length, i = new Float64Array(o * 4), s = new ne();
    let a = 0, c, l, h;
    for (let f = 0; f < o; f++)
      c = n[f], c > 0 && (l = f * 4, h = Ar(t, e, a, c), i[l++] = h[0], i[l++] = h[1], i[l++] = h[2], i[l] = h[3], a += c, s.mergeBounds(h));
    return {
      bb: i,
      bounds: s
    };
  }
  getBounds() {
    return this._allBounds ? this._allBounds.clone() : new ne();
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
    const n = t >= 0, o = n ? t : ~t, i = this.getRetainedInterval(), s = this._nn[o], a = n ? 1 : -1;
    let c = n ? this._ii[o] : this._ii[o] + s - 1, l = c, h = 0;
    for (let f = 1; f < s; f++)
      l += a, (i === 0 || this._zz[l] >= i) && (e(c, l, this._xx, this._yy), c = l, h++);
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
    const e = t * 4;
    return (!this.buf || this.buf.byteLength < e) && (this.buf = new ArrayBuffer(e)), new Uint32Array(this.buf, 0, t);
  }
  // Return average magnitudes of dx, dy (with simplification)
  getAvgSegment2() {
    let t = 0, e = 0;
    const n = this.forEachSegment(
      (o, i, s, a) => {
        t += Math.abs(s[o] - s[i]), e += Math.abs(a[o] - a[i]);
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
    const e = this.getBounds(), n = e.ymin || 0, o = (e.ymax || 0) - n, i = this.calcSegmentIntersectionStripeCount(), s = new Uint32Array(i), a = i > 1 ? (y) => Math.floor((i - 1) * (y - n) / o) : () => 0, c = i + 1;
    let l;
    this.forEachSegment(
      (y, d, x, M) => {
        let _ = a(M[y]);
        const B = a(M[d]);
        let A = 0;
        for (; s[_] = s[_] + 2, _ != B; )
          A++, A > c && Rt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${i}`,
            `s1=${_}`,
            `s2=${B}`
          ), _ += B > _ ? 1 : -1;
      }
    );
    const h = this.getUint32Array(lr(s));
    let f = 0;
    const p = [];
    fr(s, (y) => {
      const d = f;
      f += y, p.push(h.subarray(d, f));
    }), hr(s, 0), this.forEachSegment(
      (y, d, x, M) => {
        let _ = a(M[y]);
        const B = a(M[d]);
        let A, O, C = 0;
        for (; A = s[_], s[_] = A + 2, O = p[_], O[A] = y, O[A + 1] = d, _ != B; )
          C++, C > c && Rt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${i}`,
            `s1=${_}`,
            `s2=${B}`
          ), _ += B > _ ? 1 : -1;
      }
    );
    const g = this.getVertexData(), b = t * rr;
    let u = 0;
    const S = /* @__PURE__ */ new Set(), I = /* @__PURE__ */ new Map(), m = (y) => {
      u++;
      const d = kr(y);
      return S.has(d) || (S.add(d), I.set(`${y.x}:${y.y}`, y)), I.size >= t || u >= b;
    };
    if (g.xx && g.yy)
      for (l = 0; l < i && !ur(p[l], g.xx, g.yy, m); l++)
        ;
    return Array.from(I.values());
  }
}
function Rt(...r) {
  const t = r.join(" ");
  throw new Error(t);
}
function ee(r) {
  return r ? cr(r) ? !0 : ar(r) ? !1 : r.length === 0 ? !0 : r.length > 0 : !1;
}
function ar(r) {
  return r != null && r.toString === String.prototype.toString;
}
function cr(r) {
  return Array.isArray(r);
}
function lr(r, t) {
  ee(r) || Rt("utils.sum() expects an array, received:", r);
  let e = 0, n;
  for (let o = 0, i = r.length; o < i; o++)
    n = r[o], n && (e += n);
  return e;
}
function fr(r, t, e) {
  if (!ee(r))
    throw new Error(`#forEach() takes an array-like argument. ${r}`);
  for (let n = 0, o = r.length; n < o; n++)
    t.call(e, r[n], n);
}
function hr(r, t) {
  for (let e = 0, n = r.length; e < n; e++)
    r[e] = t;
  return r;
}
function ur(r, t, e, n) {
  const o = r.length - 2;
  let i, s, a, c, l, h, f, p, g, b, u, S, I, m, y, d, x;
  for (_r(t, r), d = 0; d < o; ) {
    for (i = r[d], s = r[d + 1], l = t[i], h = t[s], g = e[i], b = e[s], x = d; x < o && (x += 2, a = r[x], f = t[a], !(h < f)); ) {
      if (u = e[a], c = r[x + 1], p = t[c], S = e[c], g >= u) {
        if (g > S && b > u && b > S) continue;
      } else if (g < S && b < u && b < S) continue;
      if (!(i == a || i == c || s == a || s == c) && (I = dr(
        l,
        g,
        h,
        b,
        f,
        u,
        p,
        S
      ), I && (m = [i, s], y = [a, c], n(Sn(I, m, y, t, e)) || I.length == 4 && n(Sn(I.slice(2), m, y, t, e)))))
        return !0;
    }
    d += 2;
  }
  return !1;
}
function dr(r, t, e, n, o, i, s, a) {
  const c = pr(r, t, e, n, o, i, s, a);
  let l = null;
  return c && (l = mr(r, t, e, n, o, i, s, a), l ? xr(r, t, e, n, o, i, s, a) && (l = null) : l = br(r, t, e, n, o, i, s, a)), l;
}
function pr(r, t, e, n, o, i, s, a) {
  return Jt(r, t, e, n, o, i) * Jt(r, t, e, n, s, a) <= 0 && Jt(o, i, s, a, r, t) * Jt(o, i, s, a, e, n) <= 0;
}
function Jt(r, t, e, n, o, i) {
  return Nn(r - o, t - i, e - o, n - i);
}
function Nn(r, t, e, n) {
  return r * n - t * e;
}
function mr(r, t, e, n, o, i, s, a) {
  let c = pe(r, t, e, n, o, i, s, a), l;
  return c && (l = wr(c[0], c[1], r, t, e, n, o, i, s, a), l == 1 ? c = pe(e, n, r, t, o, i, s, a) : l == 2 ? c = pe(o, i, s, a, r, t, e, n) : l == 3 && (c = pe(s, a, o, i, r, t, e, n))), c && vr(c, r, t, e, n, o, i, s, a), c;
}
function pe(r, t, e, n, o, i, s, a) {
  const c = Nn(e - r, n - t, s - o, a - i), l = 1e-18;
  let h;
  if (c === 0) return null;
  const f = Jt(o, i, s, a, r, t) / c;
  return c <= l && c >= -l ? h = gr(r, t, e, n, o, i, s, a) : h = [r + f * (e - r), t + f * (n - t)], h;
}
function gr(r, t, e, n, o, i, s, a) {
  let c = null;
  return !It(r, o, s) && !It(t, i, a) ? c = [r, t] : !It(e, o, s) && !It(n, i, a) ? c = [e, n] : !It(o, r, e) && !It(i, t, n) ? c = [o, i] : !It(s, r, e) && !It(a, t, n) && (c = [s, a]), c;
}
function It(r, t, e) {
  let n;
  return t < e ? n = r < t || r > e : t > e ? n = r > t || r < e : n = r != t, n;
}
function wr(r, t, ...e) {
  let n = -1, o = 1 / 0, i;
  for (let s = 0, a = 0, c = e.length; a < c; s++, a += 2)
    i = yr(r, t, e[a], e[a + 1]), i < o && (o = i, n = s);
  return n;
}
function yr(r, t, e, n) {
  const o = r - e, i = t - n;
  return o * o + i * i;
}
function vr(r, t, e, n, o, i, s, a, c) {
  let l = r[0], h = r[1];
  l = me(l, t, n), l = me(l, i, a), h = me(h, e, o), h = me(h, s, c), r[0] = l, r[1] = h;
}
function me(r, t, e) {
  let n;
  return It(r, t, e) && (n = Math.abs(r - t) < Math.abs(r - e) ? t : e, r = n), r;
}
function br(r, t, e, n, o, i, s, a) {
  const c = Math.min(r, e, o, s), l = Math.max(r, e, o, s), h = Math.min(t, n, i, a), f = Math.max(t, n, i, a), p = f - h > l - c;
  let g = [];
  return (p ? Nt(t, h, f) : Nt(r, c, l)) && g.push(r, t), (p ? Nt(n, h, f) : Nt(e, c, l)) && g.push(e, n), (p ? Nt(i, h, f) : Nt(o, c, l)) && g.push(o, i), (p ? Nt(a, h, f) : Nt(s, c, l)) && g.push(s, a), (g.length != 2 && g.length != 4 || g.length == 4 && g[0] == g[2] && g[1] == g[3]) && (g = null), g;
}
function xr(r, t, e, n, o, i, s, a) {
  return r == o && t == i || r == s && t == a || e == o && n == i || e == s && n == a;
}
function Nt(r, t, e) {
  return r > t && r < e;
}
function _r(r, t) {
  Sr(r, t), $n(r, t, 0, t.length - 2);
}
function Sr(r, t) {
  for (let e = 0, n = t.length; e < n; e += 2)
    r[t[e]] > r[t[e + 1]] && Mr(t, e, e + 1);
}
function Mr(r, t, e) {
  const n = r[t];
  r[t] = r[e], r[e] = n;
}
function $n(r, t, e, n) {
  let o = e, i = n, s, a;
  for (; o < n; ) {
    for (s = r[t[e + n >> 2 << 1]]; o <= i; ) {
      for (; r[t[o]] < s; ) o += 2;
      for (; r[t[i]] > s; ) i -= 2;
      o <= i && (a = t[o], t[o] = t[i], t[i] = a, a = t[o + 1], t[o + 1] = t[i + 1], t[i + 1] = a, o += 2, i -= 2);
    }
    if (i - e < 40 ? _n(r, t, e, i) : $n(r, t, e, i), n - o < 40) {
      _n(r, t, o, n);
      return;
    }
    e = o, i = n;
  }
}
function _n(r, t, e, n) {
  let o, i;
  for (let s = e + 2; s <= n; s += 2) {
    o = t[s], i = t[s + 1];
    let a;
    for (a = s - 2; a >= e && r[o] < r[t[a]]; a -= 2)
      t[a + 2] = t[a], t[a + 3] = t[a + 1];
    t[a + 2] = o, t[a + 3] = i;
  }
}
function Sn(r, t, e, n, o) {
  const i = r[0], s = r[1];
  t = Mn(i, s, t[0], t[1], n, o), e = Mn(i, s, e[0], e[1], n, o);
  const a = t[0] < e[0] ? t : e, c = a == t ? e : t;
  return { x: i, y: s, a, b: c };
}
function Mn(r, t, e, n, o, i) {
  let s = e < n ? e : n, a = s === e ? n : e;
  return o[s] == r && i[s] == t ? a = s : o[a] == r && i[a] == t && (s = a), [s, a];
}
function kr(r) {
  return `${r.a.join(",")};${r.b.join(",")}`;
}
class Er {
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
function Ar(r, t, e, n) {
  let o = e | 0;
  const i = isNaN(n) ? r.length - o : n + o;
  let s, a, c, l, h, f;
  if (i > 0)
    c = h = r[o], l = f = t[o];
  else return [void 0, void 0, void 0, void 0];
  for (o++; o < i; o++)
    s = r[o], a = t[o], s < c && (c = s), s > h && (h = s), a < l && (l = a), a > f && (f = a);
  return [c, l, h, f];
}
class ne {
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
    return new ne(
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
    let i, s, a, c;
    if (arguments.length == 1)
      if (ee(t)) {
        const l = t;
        i = l[0], s = l[1], a = l[2], c = l[3];
      } else {
        const l = t;
        i = l.xmin, s = l.ymin, a = l.xmax, c = l.ymax;
      }
    else
      i = t, s = e, a = n, c = o;
    return this.xmin = i, this.ymin = s, this.xmax = a, this.ymax = c, (i > a || s > c) && this.update(), this;
  }
  update() {
    let t;
    this.xmin > this.xmax && (t = this.xmin, this.xmin = this.xmax, this.xmax = t), this.ymin > this.ymax && (t = this.ymin, this.ymin = this.ymax, this.ymax = t);
  }
  mergeBounds(t, ...e) {
    let n, o, i, s;
    return t instanceof ne ? (n = t.xmin, o = t.ymin, i = t.xmax, s = t.ymax) : e.length == 3 ? (n = t, o = e[0], i = e[1], s = e[2]) : t.length == 4 ? (n = t[0], o = t[1], i = t[2], s = t[3]) : Rt("Bounds#mergeBounds() invalid argument:", t), this.xmin === void 0 ? this.setBounds(n, o, i, s) : (n < this.xmin && (this.xmin = n), o < this.ymin && (this.ymin = o), i > this.xmax && (this.xmax = i), s > this.ymax && (this.ymax = s)), this;
  }
}
function be(r) {
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
function Pn(r, t, e) {
  const n = be(t.forw), o = be(t.bakw);
  if (JSON.stringify(n) != JSON.stringify(o))
    throw `${JSON.stringify(t, null, 2)}
${JSON.stringify(
      n
    )}
${JSON.stringify(o)}`;
  for (let i = 0; i < n.length; i++) {
    const s = n[i];
    r[s] || (r[s] = []), r[s].push(t);
  }
  e && (e.forw.features.push(t.forw), e.bakw.features.push(t.bakw));
}
function kn(r, t, e) {
  const n = be(t.forw), o = be(t.bakw);
  if (JSON.stringify(n) != JSON.stringify(o))
    throw `${JSON.stringify(t, null, 2)}
${JSON.stringify(n)}
${JSON.stringify(o)}`;
  if (n.forEach((i) => {
    const s = r[i];
    if (!s) return;
    const a = s.filter((c) => c !== t);
    a.length === 0 ? delete r[i] : r[i] = a;
  }), e) {
    const i = (s, a) => {
      !s || !a || (s.features = s.features.filter((c) => c !== a));
    };
    i(e.forw, t.forw), i(e.bakw, t.bakw);
  }
}
function ge(r, t = 1e-6) {
  const [e, n] = r[0], [o, i] = r[1], [s, a] = r[2];
  return Math.abs((o - e) * (a - n) - (s - e) * (i - n)) < t;
}
function Ir(r, t) {
  const e = /* @__PURE__ */ new Set();
  return r.forEach((n) => {
    if (n.length !== 2) return;
    const o = n.map((i) => `${t?.[i] ?? i}`);
    e.add(o.sort().join("-"));
  }), e;
}
function Qt(r) {
  return ["a", "b", "c"].map((t, e) => ({
    prop: r.properties[t],
    geom: r.geometry.coordinates[0][e]
  }));
}
const Br = 10;
function Or(r, t, e, n, o, i) {
  if (!r && !t) return !1;
  const s = r ? 0 : 1, a = 1 - s, c = e[s], l = e[a];
  if (!c || !l) return !1;
  const h = bt(l.geom);
  let f = !1, p = !1;
  for (let g = 0; g <= 1; g++) {
    const b = n[g];
    if (!b) continue;
    const u = [String(b.prop.index), String(c.prop.index)].sort().join("-"), S = o[u];
    if (!S || S.length < 2) continue;
    const I = S.find(
      (C) => C.bakw !== i[s].bakw
    );
    if (!I) continue;
    const y = Qt(I.bakw).find(
      (C) => String(C.prop.index) !== String(b.prop.index) && String(C.prop.index) !== String(c.prop.index)
    );
    if (!y) continue;
    f = !0;
    const d = bt(y.geom), x = bt(b.geom), M = bt(c.geom), _ = M[0] - x[0], B = M[1] - x[1], A = _ * (h[1] - x[1]) - B * (h[0] - x[0]), O = _ * (d[1] - x[1]) - B * (d[0] - x[0]);
    if (A * O > 0) {
      p = !0;
      break;
    }
  }
  return f && !p;
}
function Tr(r, t, e, n) {
  if (!r && !t) return !1;
  if (e[0] && e[1] && n[0] && n[1]) {
    const o = n.map((h) => bt(h.geom)), i = e.map((h) => bt(h.geom)), s = o[1][0] - o[0][0], a = o[1][1] - o[0][1], c = s * (i[0][1] - o[0][1]) - a * (i[0][0] - o[0][0]), l = s * (i[1][1] - o[0][1]) - a * (i[1][0] - o[0][0]);
    return c * l < 0;
  }
  return !1;
}
function Fr(r, t, e, n) {
  const o = Ir(e, n), i = /* @__PURE__ */ new Set();
  let s = !1;
  for (let a = 0; a < Br; a++) {
    let c = !1;
    for (const l of Object.keys(t)) {
      if (i.has(l)) continue;
      i.add(l);
      const h = t[l];
      if (!h || h.length < 2) continue;
      const f = l.split("-");
      if (f.length !== 2 || o.has(l)) continue;
      const p = Qt(h[0].bakw), g = Qt(h[1].bakw), b = Qt(h[0].forw), u = Qt(h[1].forw), S = f.map(
        (w) => p.find((T) => `${T.prop.index}` === w) || g.find((T) => `${T.prop.index}` === w)
      ), I = f.map(
        (w) => b.find((T) => `${T.prop.index}` === w) || u.find((T) => `${T.prop.index}` === w)
      );
      if (S.some((w) => !w) || I.some((w) => !w))
        continue;
      const m = [p, g].map(
        (w) => w.find((T) => !f.includes(`${T.prop.index}`))
      ), y = [b, u].map(
        (w) => w.find((T) => !f.includes(`${T.prop.index}`))
      );
      if (m.some((w) => !w) || y.some((w) => !w))
        continue;
      const d = h[0].bakw.geometry.coordinates[0].slice(0, 3).map((w) => bt(w)), x = h[1].bakw.geometry.coordinates[0].slice(0, 3).map((w) => bt(w)), M = h[0].forw.geometry.coordinates[0].slice(0, 3).map((w) => bt(w)), _ = h[1].forw.geometry.coordinates[0].slice(0, 3).map((w) => bt(w)), B = ge(d), A = ge(x), O = ge(M), C = ge(_), N = Or(
        B,
        A,
        m,
        S,
        t,
        h
      ), X = Tr(
        O,
        C,
        m,
        S
      );
      if (!(N || X || En(
        bt(m[0].geom),
        x
      ) || En(
        bt(m[1].geom),
        d
      )))
        continue;
      const E = I.map(
        (w) => bt(w.geom)
      ), k = y.map(
        (w) => bt(w.geom)
      ), F = Cr([
        ...E,
        ...k
      ]), D = Dr(F), $ = An(
        E[0],
        E[1],
        k[0]
      ) + An(
        E[0],
        E[1],
        k[1]
      );
      Ne(D, $) && (kn(t, h[0], r), kn(t, h[1], r), S.forEach((w) => {
        if (!w) return;
        const T = [
          w.geom,
          m[0].geom,
          m[1].geom,
          w.geom
        ], P = {
          a: w.prop,
          b: m[0].prop,
          c: m[1].prop
        }, R = ie([T], P), q = On(R);
        Pn(t, {
          forw: q,
          bakw: R
        }, r);
      }), c = !0, s = !0);
    }
    if (!c) break;
  }
  return s;
}
function bt(r) {
  return [r[0], r[1]];
}
function En(r, t) {
  const [e, n] = t[0], [o, i] = t[1], [s, a] = t[2], c = s - e, l = a - n, h = o - e, f = i - n, p = r[0] - e, g = r[1] - n, b = c * c + l * l, u = c * h + l * f, S = c * p + l * g, I = h * h + f * f, m = h * p + f * g, y = b * I - u * u;
  if (y === 0) return !1;
  const d = 1 / y, x = (I * S - u * m) * d, M = (b * m - u * S) * d, _ = 1e-9;
  return x >= -_ && M >= -_ && x + M <= 1 + _;
}
function Cr(r) {
  const t = r.map((s) => s.slice()).filter(
    (s, a, c) => c.findIndex(
      (l) => Ne(l[0], s[0]) && Ne(l[1], s[1])
    ) === a
  );
  if (t.length <= 1) return t;
  const e = t.sort(
    (s, a) => s[0] === a[0] ? s[1] - a[1] : s[0] - a[0]
  ), n = (s, a, c) => (a[0] - s[0]) * (c[1] - s[1]) - (a[1] - s[1]) * (c[0] - s[0]), o = [];
  for (const s of e) {
    for (; o.length >= 2 && n(
      o[o.length - 2],
      o[o.length - 1],
      s
    ) <= 0; )
      o.pop();
    o.push(s);
  }
  const i = [];
  for (let s = e.length - 1; s >= 0; s--) {
    const a = e[s];
    for (; i.length >= 2 && n(
      i[i.length - 2],
      i[i.length - 1],
      a
    ) <= 0; )
      i.pop();
    i.push(a);
  }
  return i.pop(), o.pop(), o.concat(i);
}
function Dr(r) {
  if (r.length < 3) return 0;
  let t = 0;
  for (let e = 0; e < r.length; e++) {
    const [n, o] = r[e], [i, s] = r[(e + 1) % r.length];
    t += n * s - i * o;
  }
  return Math.abs(t) / 2;
}
function An(r, t, e) {
  return Math.abs(
    (r[0] * (t[1] - e[1]) + t[0] * (e[1] - r[1]) + e[0] * (r[1] - t[1])) / 2
  );
}
function Ne(r, t, e = 1e-9) {
  return Math.abs(r - t) <= e;
}
const Nr = (r) => typeof r == "string" && r.startsWith("b");
function $r(r, t) {
  const e = (n, o) => {
    for (let i = 0; i < 3; i++) {
      const s = n.g[i], a = n.g[(i + 1) % 3];
      if (o.g.every((c) => n.sign * dt(s[0], s[1], a[0], a[1], c[0], c[1]) <= 0)) return !0;
    }
    return !1;
  };
  return !e(r, t) && !e(t, r);
}
function Pr(r, t, e) {
  if (t.length === 0) return [];
  const n = r.features.map((u) => {
    const { a: S, b: I, c: m } = u.properties, y = [S.geom, I.geom, m.geom], [d, x, M] = u.geometry.coordinates[0], _ = y.map(([C]) => C), B = y.map(([, C]) => C), A = Math.sign(dt(d[0], d[1], x[0], x[1], M[0], M[1])), O = Math.sign(dt(y[0][0], y[0][1], y[1][0], y[1][1], y[2][0], y[2][1]));
    return {
      ids: [S.index, I.index, m.index].map(String),
      g: y,
      sign: O,
      ratio: A * O,
      aux: [S.index, I.index, m.index].some(Nr),
      minx: Math.min(..._),
      maxx: Math.max(..._),
      miny: Math.min(...B),
      maxy: Math.max(...B)
    };
  }), o = n.map((u) => u.ratio), i = o.reduce((u, S) => u + S, 0) < 0 ? -1 : 1, s = (u, S) => u < S ? `${u}|${S}` : `${S}|${u}`, a = /* @__PURE__ */ new Map();
  n.forEach((u, S) => {
    for (let I = 0; I < 3; I++) {
      const m = s(u.ids[I], u.ids[(I + 1) % 3]), y = a.get(m);
      y ? y.push(S) : a.set(m, [S]);
    }
  });
  const c = ([u, S]) => s(String(e[u]), String(e[S])), l = /* @__PURE__ */ new Set();
  for (const u of t) for (const S of a.get(c(u)) ?? []) l.add(S);
  const h = (u) => n[u].aux || l.has(u), f = /* @__PURE__ */ new Set();
  n.forEach((u, S) => {
    h(S) && (o[S] === 0 || o[S] !== i) && f.add(S);
  });
  const p = n.map((u, S) => S).sort((u, S) => n[u].minx - n[S].minx);
  for (let u = 0; u < p.length; u++) {
    const S = n[p[u]];
    if (S.sign !== 0)
      for (let I = u + 1; I < p.length; I++) {
        const m = n[p[I]];
        if (m.minx >= S.maxx) break;
        m.sign === 0 || m.miny >= S.maxy || S.miny >= m.maxy || !h(p[u]) && !h(p[I]) || $r(S, m) && (f.add(p[u]), f.add(p[I]));
      }
  }
  if (f.size === 0) return [];
  const g = t.filter((u) => (a.get(c(u)) ?? []).some((S) => f.has(S)));
  if (g.length > 0) return g;
  const b = /* @__PURE__ */ new Set();
  for (const u of f) for (const S of n[u].ids) S.startsWith("b") || b.add(S);
  return t.filter(
    ([u, S]) => b.has(String(e[u])) || b.has(String(e[S]))
  );
}
const In = 2.00704, Bn = 3.00001, Xr = 12, Rr = 24;
class ot extends qn {
  importance;
  priority;
  pointsSet;
  useV2Algorithm;
  lastBoundaryDiagnostics;
  requestedWorldFile;
  compiledOuter;
  /** 現在の三角網を V3 で生成したときの外周の診断。 */
  get boundaryDiagnostics() {
    return this.tins && !this.useV2Algorithm ? this.lastBoundaryDiagnostics : void 0;
  }
  /**
   * Tinクラスのインスタンスを生成します
   * @param options - 初期化オプション
   */
  constructor(t = {}) {
    if (super(), t.bounds ? this.setBounds(t.bounds) : (this.setWh(t.wh), this.vertexMode = t.vertexMode || ot.VERTEX_PLAIN), this.strictMode = t.strictMode || ot.MODE_AUTO, this.yaxisMode = t.yaxisMode || ot.YAXIS_INVERT, this.importance = t.importance || 0, this.priority = t.priority || 0, this.stateFull = t.stateFull || !1, this.useV2Algorithm = t.useV2Algorithm ?? !1, t.outerTransform === "worldFile") {
      if (this.useV2Algorithm) throw new Error("V2 では world file 外周を使えません");
      if (!t.worldFile) throw new Error("worldFile が必要です");
      Vn(t.worldFile), this.requestedWorldFile = { ...t.worldFile };
    }
    t.points && this.setPoints(t.points), t.edges && this.setEdges(t.edges);
  }
  /**
   * フォーマットバージョンを取得します
   */
  getFormatVersion() {
    return this.useV2Algorithm ? In : Bn;
  }
  /**
   * 制御点（GCP: Ground Control Points）を設定します。
   * 指定した点群に合わせて内部のTINキャッシュをリセットします。
   */
  setPoints(t) {
    this.yaxisMode === ot.YAXIS_FOLLOW && (t = t.map((e) => [
      e[0],
      [e[1][0], -1 * e[1][1]]
    ])), this.points = t, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * エッジ（制約線）を設定します。
   * 制約線を正規化した上で、依存するキャッシュをリセットします。
   */
  setEdges(t = []) {
    this.edges = jn(t), this.edgeNodes = void 0, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 境界ポリゴンを設定します
   */
  setBounds(t) {
    this.bounds = t;
    let e = t[0][0], n = e, o = t[0][1], i = o;
    const s = [t[0]];
    for (let a = 1; a < t.length; a++) {
      const c = t[a];
      c[0] < e && (e = c[0]), c[0] > n && (n = c[0]), c[1] < o && (o = c[1]), c[1] > i && (i = c[1]), s.push(c);
    }
    s.push(t[0]), this.boundsPolygon = ie([s]), this.xy = [e, o], this.wh = [n - e, i - o], this.vertexMode = ot.VERTEX_PLAIN, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 現在の設定を永続化可能な形式にコンパイルします
   */
  getCompiled() {
    const t = {};
    if (t.version = this.useV2Algorithm ? In : Bn, t.points = this.points, t.weight_buffer = {}, this.compiledOuter?.outerTransform === "worldFile")
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
          const o = e[n].features[0], i = o.geometry.coordinates[0][1], s = o.properties.b.geom;
          t.vertices_points[n] = [i, s];
        }
    }
    return t.strict_status = this.strict_status, t.tins_points = [[]], this.tins.forw.features.map((e) => {
      t.tins_points[0].push(
        ["a", "b", "c"].map(
          (n) => e.properties[n].index
        )
      );
    }), this.strict_status === ot.STATUS_LOOSE ? (t.tins_points[1] = [], this.tins.bakw.features.map((e) => {
      t.tins_points[1].push(
        ["a", "b", "c"].map(
          (n) => e.properties[n].index
        )
      );
    })) : this.strict_status === ot.STATUS_ERROR && this.kinks?.bakw && (t.kinks_points = this.kinks.bakw.features.map(
      (e) => e.geometry.coordinates
    )), t.yaxisMode = this.yaxisMode, t.vertexMode = this.vertexMode, t.strictMode = this.strictMode, this.bounds ? (t.bounds = this.bounds, t.boundsPolygon = this.boundsPolygon, this.useV2Algorithm && (t.xy = this.xy, t.wh = this.wh)) : t.wh = this.wh, t.edges = this.edges ?? [], t.edgeNodes = this.edgeNodes ?? [], this.compiledOuter?.outerTransform === "extrapolate" && Object.assign(t, this.compiledOuter), t;
  }
  /** コンパイルされた設定を基底クラスで復元し、外周方式を次の生成にも引き継ぐ。 */
  setCompiled(t) {
    const e = "outerTransform" in t ? t : void 0;
    if (e?.outerTransform === "worldFile" && this.useV2Algorithm)
      throw new Error("V2 では world file 外周を使えません");
    const n = this.outerTransform === "worldFile" || e?.outerTransform === "worldFile";
    super.setCompiled(t), n && (this.stateTriangle = void 0), this.requestedWorldFile = void 0, this.compiledOuter = void 0, e?.outerTransform === "worldFile" ? (this.requestedWorldFile = { ...e.worldFile }, this.compiledOuter = {
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
  calculateStrictTin(t = xn) {
    const e = this.tins.forw.features.map(
      (s) => On(s)
    );
    this.tins.bakw = xt(e);
    const n = {};
    this.tins.forw.features.forEach((s, a) => {
      const c = this.tins.bakw.features[a];
      Pn(n, { forw: s, bakw: c });
    });
    const o = (this.pointsSet?.forw.features ?? []).map(
      (s) => s.properties.target.index
    );
    Fr(
      this.tins,
      n,
      this.pointsSet?.edges || [],
      o
    );
    const i = ["forw", "bakw"].map((s) => {
      const a = this.tins[s].features.map(
        (c) => c.geometry.coordinates[0]
      );
      return Dn(a, t);
    });
    i[0].length === 0 && i[1].length === 0 ? (this.strict_status = ot.STATUS_STRICT, delete this.kinks) : (this.strict_status = ot.STATUS_ERROR, this.kinks = {
      forw: xt(i[0]),
      bakw: xt(i[1])
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
      const i = this.points[o][0], s = this.points[o][1], a = Kt(i, s, o);
      t.forw.push(a), t.bakw.push(Wt(a));
    }
    const e = [];
    let n = 0;
    this.edgeNodes = [], this.edges || (this.edges = []);
    for (let o = 0; o < this.edges.length; o++) {
      const i = this.edges[o][2], s = Object.assign([], this.edges[o][0]), a = Object.assign([], this.edges[o][1]);
      if (Yr(i, this.points.length, o), s.length === 0 && a.length === 0) {
        e.push(i);
        continue;
      }
      s.unshift(this.points[i[0]][0]), s.push(this.points[i[1]][0]), a.unshift(this.points[i[0]][1]), a.push(this.points[i[1]][1]), Hi(s, a).map((c, l, h) => {
        this.edgeNodes[n] = [
          c[0],
          c[1]
        ];
        const f = Kt(
          c[0],
          c[1],
          `e${n}`
        );
        n++, t.forw.push(f), t.bakw.push(Wt(f)), l === 0 ? e.push([i[0], t.forw.length - 1]) : e.push([
          t.forw.length - 2,
          t.forw.length - 1
        ]), l === h.length - 1 && e.push([t.forw.length - 1, i[1]]);
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
    const i = this.bounds ? this.boundsPolygon : void 0;
    if (!this.points.reduce((c, l) => c && (i ? Ge(l[0], i) : l[0][0] >= t && l[0][0] <= e && l[0][1] >= n && l[0][1] <= o), !0))
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
    for (const i of this.points) {
      const s = i[0][0], a = i[0][1];
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
    this.lastBoundaryDiagnostics = void 0;
    let t = this.strictMode;
    t !== ot.MODE_STRICT && t !== ot.MODE_LOOSE && (t = ot.MODE_AUTO);
    const e = !this.useV2Algorithm, n = this.requestedWorldFile;
    if (n && !e) throw new Error("V2 では world file 外周を使えません");
    let o, i, s, a, c;
    if (e) {
      if (this.bounds) {
        const O = this.boundsPolygon;
        if (!O) throw new Error("Internal error: bounds is set but boundsPolygon is missing");
        if (!this.points.every(
          (N) => Ge(N[0], O)
        )) throw "SOME POINTS OUTSIDE";
      }
      o = this.generatePointsSet(), { minx: i, maxx: s, miny: a, maxy: c } = this.computeGcpBbox();
    } else {
      const O = this.validateAndPrepareInputs();
      o = O.pointsSet, i = O.minx, s = O.maxx, a = O.miny, c = O.maxy;
    }
    const l = {
      forw: xt(o.forw),
      bakw: xt(o.bakw)
    }, h = de(
      l.forw,
      o.edges,
      "target"
    ), f = de(
      l.bakw,
      o.edges,
      "target"
    );
    if (h.features.length === 0 || f.features.length === 0)
      throw "TOO LINEAR1";
    const p = _i(l.forw), g = cn(l.forw);
    if (!g) throw "TOO LINEAR2";
    const b = {}, u = g.geometry.coordinates[0];
    let S;
    try {
      S = u.map((O) => ({
        forw: O,
        bakw: _e(Yt(O), h)
      })), S.forEach((O) => {
        b[`${O.forw[0]}:${O.forw[1]}`] = O;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const I = cn(l.bakw);
    if (!I) throw "TOO LINEAR2";
    const m = I.geometry.coordinates[0];
    try {
      S = m.map((O) => ({
        bakw: O,
        forw: _e(Yt(O), f)
      })), S.forEach((O) => {
        b[`${O.forw[0]}:${O.forw[1]}`] = O;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const y = {
      forw: p.geometry.coordinates,
      bakw: _e(p, h)
    }, d = Kt(y.forw, y.bakw, "c");
    this.centroid = {
      forw: d,
      bakw: Wt(d)
    };
    const x = [
      ...this.points.map((O) => ({ forw: O[0], bakw: O[1] })),
      ...(this.edgeNodes ?? []).map((O) => ({ forw: O[0], bakw: O[1] }))
    ], M = {
      convexBuf: b,
      centroid: y,
      allGcps: x,
      minx: i,
      maxx: s,
      miny: a,
      maxy: c
    };
    if (n) {
      this.stateTriangle = void 0;
      const O = this.yaxisMode === ot.YAXIS_FOLLOW, C = O ? 1 : -1, N = /* @__PURE__ */ new Map(), { boundary: X } = this.buildWithHull(t, (v) => ({ boundary: gn(
        M,
        (E) => ir(E, (k) => {
          const [F, D] = Un(n, k);
          return [F, O ? -D : D];
        }),
        o,
        this.points.length,
        {
          orientation: C,
          accept: (E) => E.hasMapBoundary ? (this.buildTin(o, E.vertices, t, E, v.size > 0), (this.strict_status !== ot.STATUS_LOOSE || E.hasBoundary) && ve(this.tins.forw, C) === 0 && ve(this.tins.bakw, C) === 0) : !1
        },
        v,
        N
      ) }));
      if (X) {
        this.compiledOuter = {
          outerTransform: "worldFile",
          worldFile: n,
          vertices_points: X.vertices.map(({ forw: D, bakw: $ }) => [D, $])
        };
        const { centroid: v, xy: E, wh: k, kinks: F } = this;
        super.setCompiled(this.getCompiled()), Object.assign(this, { centroid: v, xy: E, wh: k, kinks: F }), this.lastBoundaryDiagnostics = {
          ...X.diagnostics,
          requestedOuterTransform: "worldFile",
          outerTransform: "worldFile"
        };
        return;
      }
      this.compiledOuter = { outerTransform: "extrapolate" }, this.outerTransform = "extrapolate", this.worldFile = void 0;
    }
    const _ = this.vertexMode === ot.VERTEX_BIRDEYE ? nr : er;
    let B, A;
    if (e) {
      const O = /* @__PURE__ */ new Map();
      ({ boundary: B, verticesList: A } = this.buildWithHull(t, (C) => {
        const N = gn(
          M,
          _,
          o,
          this.points.length,
          void 0,
          C,
          O
        );
        return {
          boundary: N,
          verticesList: this.buildTin(
            o,
            N?.vertices ?? _(M, !1),
            t,
            N,
            C.size > 0
          )
        };
      }));
    } else
      A = this.buildTin(
        o,
        _(M, !1),
        t,
        void 0
      );
    this.vertices_params = {
      forw: dn(A.forw, this.centroid.forw),
      bakw: dn(A.bakw, this.centroid.bakw)
    }, this.addIndexedTin(), this.pointsWeightBuffer = {}, this.lastBoundaryDiagnostics = B?.diagnostics, n && this.lastBoundaryDiagnostics && (this.lastBoundaryDiagnostics = {
      ...this.lastBoundaryDiagnostics,
      requestedOuterTransform: "worldFile",
      outerTransform: "extrapolate",
      fallbackReason: "boundaryFlips"
    });
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
    const i = (u) => [...u].sort().join(","), s = (u, S = !1) => {
      const I = i(u), m = n.get(I);
      if (m) return m;
      const y = e(u), d = {
        value: y,
        strict: y.boundary !== void 0 && this.strict_status === ot.STATUS_STRICT
      };
      return (d.strict || S) && (d.state = this.captureBuild()), n.set(I, d), o = d, d;
    }, a = (u) => (o !== u && this.restoreBuild(u.state), o = u, u.value), c = s(/* @__PURE__ */ new Set(), !0);
    if (!(t === ot.MODE_STRICT || t === ot.MODE_AUTO) || !c.value.boundary || c.strict) return c.value;
    const h = new Set(c.value.boundary.forwHull.all.map(ye)), f = () => this.pointsSet.forw.features.map(
      (u) => u.properties.target.index
    ), p = /* @__PURE__ */ new Set();
    let g = c, b;
    for (let u = 0; u < Xr; u++) {
      const S = Pr(
        this.tins.forw,
        g.value.boundary.forwHull.applied,
        f()
      ).filter((I) => !p.has(ye(I)));
      if (S.length === 0) break;
      for (const I of S) p.add(ye(I));
      if (g = s(p), !g.value.boundary) break;
      if (g.strict) {
        b = g;
        break;
      }
    }
    if (b) {
      let u = b;
      for (const S of [...p].slice(0, Rr)) {
        const I = new Set(p);
        I.delete(S);
        const m = s(I);
        m.strict && (p.delete(S), u = m);
      }
      return a(u);
    }
    if (p.size < h.size) {
      const u = s(h);
      if (u.strict) return a(u);
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
  buildTin(t, e, n, o, i = !1) {
    const s = {
      forw: [],
      bakw: []
    };
    for (let a = 0; a < e.length; a++) {
      const c = e[a].forw, l = e[a].bakw, h = Kt(c, l, `b${a}`), f = Wt(h);
      s.forw.push(h), s.bakw.push(f);
    }
    return this.pointsSet = {
      forw: xt([...t.forw, ...s.forw]),
      bakw: xt([...t.bakw, ...s.bakw]),
      edges: t.edges
    }, this.tins = {
      forw: qe(
        o?.forw ?? de(this.pointsSet.forw, t.edges, "target")
      )
    }, (n === ot.MODE_STRICT || n === ot.MODE_AUTO) && this.calculateStrictTin(
      n === ot.MODE_AUTO || i ? 1 : xn
    ), (n === ot.MODE_LOOSE || n === ot.MODE_AUTO && this.strict_status === ot.STATUS_ERROR) && (this.tins.bakw = qe(
      o?.bakw ?? de(this.pointsSet.bakw, t.edges, "target")
    ), delete this.kinks, this.strict_status = ot.STATUS_LOOSE), s;
  }
  /**
   * 非同期ラッパーを提供します。
   * 互換性のために Promise ベースの API を維持しますが、内部処理は同期的です。
   */
  async updateTinAsync() {
    this.updateTin();
  }
}
function Yr(r, t, e) {
  const n = (o) => Number.isInteger(o) && o >= 0 && o < t;
  if (!Array.isArray(r) || !n(r[0]) || !n(r[1]))
    throw new Error(
      `Invalid edge at edges[${e}]: start/end ${JSON.stringify(r)} must be integer indices of points (0 to ${t - 1})`
    );
}
export {
  ot as Tin,
  de as constrainedTin,
  Wt as counterPoint,
  Kt as createPoint,
  ot as default,
  qr as findIntersections,
  In as format_version,
  Pn as insertSearchIndex,
  dn as vertexCalc
};
