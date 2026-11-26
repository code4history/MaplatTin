import { counterTri as On, Transform as Vn, validateWorldFile as jn, normalizeEdges as Un, transformArr as _e, rotateVerticesTriangle as qe, worldFileToCrs as zn } from "@maplat/transform";
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
    for (let s = 0; s < o[o.length - 1].length; s++)
      if (o[o.length - 1][s] !== o[0][s])
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
function Gn(r) {
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
    for (var n, o, s, i, a, l, c, h = 0, f = 0, u, g = r.type, v = g === "FeatureCollection", d = g === "Feature", _ = v ? r.features.length : 1, I = 0; I < _; I++) {
      c = v ? (
        // @ts-expect-error: Known type conflict
        r.features[I].geometry
      ) : d ? (
        // @ts-expect-error: Known type conflict
        r.geometry
      ) : r, u = c ? c.type === "GeometryCollection" : !1, a = u ? c.geometries.length : 1;
      for (var m = 0; m < a; m++) {
        var b = 0, p = 0;
        if (i = u ? c.geometries[m] : c, i !== null) {
          l = i.coordinates;
          var x = i.type;
          switch (h = e && (x === "Polygon" || x === "MultiPolygon") ? 1 : 0, x) {
            case null:
              break;
            case "Point":
              if (
                // @ts-expect-error: Known type conflict
                t(
                  l,
                  f,
                  I,
                  b,
                  p
                ) === !1
              )
                return !1;
              f++, b++;
              break;
            case "LineString":
            case "MultiPoint":
              for (n = 0; n < l.length; n++) {
                if (
                  // @ts-expect-error: Known type conflict
                  t(
                    l[n],
                    f,
                    I,
                    b,
                    p
                  ) === !1
                )
                  return !1;
                f++, x === "MultiPoint" && b++;
              }
              x === "LineString" && b++;
              break;
            case "Polygon":
            case "MultiLineString":
              for (n = 0; n < l.length; n++) {
                for (o = 0; o < l[n].length - h; o++) {
                  if (
                    // @ts-expect-error: Known type conflict
                    t(
                      l[n][o],
                      f,
                      I,
                      b,
                      p
                    ) === !1
                  )
                    return !1;
                  f++;
                }
                x === "MultiLineString" && b++, x === "Polygon" && p++;
              }
              x === "Polygon" && b++;
              break;
            case "MultiPolygon":
              for (n = 0; n < l.length; n++) {
                for (p = 0, o = 0; o < l[n].length; o++) {
                  for (s = 0; s < l[n][o].length - h; s++) {
                    if (
                      // @ts-expect-error: Known type conflict
                      t(
                        l[n][o][s],
                        f,
                        I,
                        b,
                        p
                      ) === !1
                    )
                      return !1;
                    f++;
                  }
                  p++;
                }
                b++;
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
const pt = 11102230246251565e-32, U = 134217729, Tn = (3 + 8 * pt) * pt;
function ht(r, t, e, n, o) {
  let s, i, a, l, c = t[0], h = n[0], f = 0, u = 0;
  h > c == h > -c ? (s = c, c = t[++f]) : (s = h, h = n[++u]);
  let g = 0;
  if (f < r && u < e)
    for (h > c == h > -c ? (i = c + s, a = s - (i - c), c = t[++f]) : (i = h + s, a = s - (i - h), h = n[++u]), s = i, a !== 0 && (o[g++] = a); f < r && u < e; )
      h > c == h > -c ? (i = s + c, l = i - s, a = s - (i - l) + (c - l), c = t[++f]) : (i = s + h, l = i - s, a = s - (i - l) + (h - l), h = n[++u]), s = i, a !== 0 && (o[g++] = a);
  for (; f < r; )
    i = s + c, l = i - s, a = s - (i - l) + (c - l), c = t[++f], s = i, a !== 0 && (o[g++] = a);
  for (; u < e; )
    i = s + h, l = i - s, a = s - (i - l) + (h - l), h = n[++u], s = i, a !== 0 && (o[g++] = a);
  return (s !== 0 || g === 0) && (o[g++] = s), g;
}
function Mt(r, t, e, n, o, s, i, a) {
  return ht(ht(r, t, e, n, i), i, o, s, a);
}
function L(r, t, e, n) {
  let o, s, i, a, l, c, h, f, u, g, v;
  h = U * e, g = h - (h - e), v = e - g;
  let d = t[0];
  o = d * e, h = U * d, f = h - (h - d), u = d - f, i = u * v - (o - f * g - u * g - f * v);
  let _ = 0;
  i !== 0 && (n[_++] = i);
  for (let I = 1; I < r; I++)
    d = t[I], a = d * e, h = U * d, f = h - (h - d), u = d - f, l = u * v - (a - f * g - u * g - f * v), s = o + l, c = s - o, i = o - (s - c) + (l - c), i !== 0 && (n[_++] = i), o = a + s, i = s - (o - a), i !== 0 && (n[_++] = i);
  return (o !== 0 || _ === 0) && (n[_++] = o), _;
}
function Fn(r, t) {
  let e = t[0];
  for (let n = 1; n < r; n++) e += t[n];
  return e;
}
function tt(r) {
  return new Float64Array(r);
}
const Kn = (3 + 16 * pt) * pt, Wn = (2 + 12 * pt) * pt, Jn = (9 + 64 * pt) * pt * pt, Lt = tt(4), Ue = tt(8), ze = tt(12), Ge = tt(16), mt = tt(4);
function Qn(r, t, e, n, o, s, i) {
  let a, l, c, h, f, u, g, v, d, _, I, m, b, p, x, M, B, k;
  const S = r - o, O = e - o, T = t - s, C = n - s;
  p = S * C, u = U * S, g = u - (u - S), v = S - g, u = U * C, d = u - (u - C), _ = C - d, x = v * _ - (p - g * d - v * d - g * _), M = T * O, u = U * T, g = u - (u - T), v = T - g, u = U * O, d = u - (u - O), _ = O - d, B = v * _ - (M - g * d - v * d - g * _), I = x - B, f = x - I, Lt[0] = x - (I + f) + (f - B), m = p + I, f = m - p, b = p - (m - f) + (I - f), I = b - M, f = b - I, Lt[1] = b - (I + f) + (f - M), k = m + I, f = k - m, Lt[2] = m - (k - f) + (I - f), Lt[3] = k;
  let X = Fn(4, Lt), w = Wn * i;
  if (X >= w || -X >= w || (f = r - S, a = r - (S + f) + (f - o), f = e - O, c = e - (O + f) + (f - o), f = t - T, l = t - (T + f) + (f - s), f = n - C, h = n - (C + f) + (f - s), a === 0 && l === 0 && c === 0 && h === 0) || (w = Jn * i + Tn * Math.abs(X), X += S * h + C * a - (T * c + O * l), X >= w || -X >= w)) return X;
  p = a * C, u = U * a, g = u - (u - a), v = a - g, u = U * C, d = u - (u - C), _ = C - d, x = v * _ - (p - g * d - v * d - g * _), M = l * O, u = U * l, g = u - (u - l), v = l - g, u = U * O, d = u - (u - O), _ = O - d, B = v * _ - (M - g * d - v * d - g * _), I = x - B, f = x - I, mt[0] = x - (I + f) + (f - B), m = p + I, f = m - p, b = p - (m - f) + (I - f), I = b - M, f = b - I, mt[1] = b - (I + f) + (f - M), k = m + I, f = k - m, mt[2] = m - (k - f) + (I - f), mt[3] = k;
  const A = ht(4, Lt, 4, mt, Ue);
  p = S * h, u = U * S, g = u - (u - S), v = S - g, u = U * h, d = u - (u - h), _ = h - d, x = v * _ - (p - g * d - v * d - g * _), M = T * c, u = U * T, g = u - (u - T), v = T - g, u = U * c, d = u - (u - c), _ = c - d, B = v * _ - (M - g * d - v * d - g * _), I = x - B, f = x - I, mt[0] = x - (I + f) + (f - B), m = p + I, f = m - p, b = p - (m - f) + (I - f), I = b - M, f = b - I, mt[1] = b - (I + f) + (f - M), k = m + I, f = k - m, mt[2] = m - (k - f) + (I - f), mt[3] = k;
  const E = ht(A, Ue, 4, mt, ze);
  p = a * h, u = U * a, g = u - (u - a), v = a - g, u = U * h, d = u - (u - h), _ = h - d, x = v * _ - (p - g * d - v * d - g * _), M = l * c, u = U * l, g = u - (u - l), v = l - g, u = U * c, d = u - (u - c), _ = c - d, B = v * _ - (M - g * d - v * d - g * _), I = x - B, f = x - I, mt[0] = x - (I + f) + (f - B), m = p + I, f = m - p, b = p - (m - f) + (I - f), I = b - M, f = b - I, mt[1] = b - (I + f) + (f - M), k = m + I, f = k - m, mt[2] = m - (k - f) + (I - f), mt[3] = k;
  const N = ht(E, ze, 4, mt, Ge);
  return Ge[N - 1];
}
function dt(r, t, e, n, o, s) {
  const i = (t - s) * (e - o), a = (r - o) * (n - s), l = i - a, c = Math.abs(i + a);
  return Math.abs(l) >= Kn * c ? l : -Qn(r, t, e, n, o, s, c);
}
const Zn = (10 + 96 * pt) * pt, ti = (4 + 48 * pt) * pt, ei = (44 + 576 * pt) * pt * pt, Tt = tt(4), Ft = tt(4), Nt = tt(4), St = tt(4), kt = tt(4), Et = tt(4), gt = tt(4), wt = tt(4), Me = tt(8), Se = tt(8), ke = tt(8), Ee = tt(8), Ae = tt(8), Ie = tt(8), se = tt(8), oe = tt(8), ae = tt(8), $t = tt(4), Pt = tt(4), Xt = tt(4), z = tt(8), K = tt(16), nt = tt(16), it = tt(16), et = tt(32), Dt = tt(32), ct = tt(48), vt = tt(64);
let jt = tt(1152), Be = tt(1152);
function lt(r, t, e) {
  r = ht(r, jt, t, e, Be);
  const n = jt;
  return jt = Be, Be = n, r;
}
function ni(r, t, e, n, o, s, i, a, l) {
  let c, h, f, u, g, v, d, _, I, m, b, p, x, M, B, k, S, O, T, C, X, w, A, E, N, D, $, y, F, P, R, q, Y, j, V;
  const H = r - i, G = e - i, W = o - i, J = t - a, Z = n - a, Q = s - a;
  R = G * Q, A = U * G, E = A - (A - G), N = G - E, A = U * Q, D = A - (A - Q), $ = Q - D, q = N * $ - (R - E * D - N * D - E * $), Y = W * Z, A = U * W, E = A - (A - W), N = W - E, A = U * Z, D = A - (A - Z), $ = Z - D, j = N * $ - (Y - E * D - N * D - E * $), y = q - j, w = q - y, Tt[0] = q - (y + w) + (w - j), F = R + y, w = F - R, P = R - (F - w) + (y - w), y = P - Y, w = P - y, Tt[1] = P - (y + w) + (w - Y), V = F + y, w = V - F, Tt[2] = F - (V - w) + (y - w), Tt[3] = V, R = W * J, A = U * W, E = A - (A - W), N = W - E, A = U * J, D = A - (A - J), $ = J - D, q = N * $ - (R - E * D - N * D - E * $), Y = H * Q, A = U * H, E = A - (A - H), N = H - E, A = U * Q, D = A - (A - Q), $ = Q - D, j = N * $ - (Y - E * D - N * D - E * $), y = q - j, w = q - y, Ft[0] = q - (y + w) + (w - j), F = R + y, w = F - R, P = R - (F - w) + (y - w), y = P - Y, w = P - y, Ft[1] = P - (y + w) + (w - Y), V = F + y, w = V - F, Ft[2] = F - (V - w) + (y - w), Ft[3] = V, R = H * Z, A = U * H, E = A - (A - H), N = H - E, A = U * Z, D = A - (A - Z), $ = Z - D, q = N * $ - (R - E * D - N * D - E * $), Y = G * J, A = U * G, E = A - (A - G), N = G - E, A = U * J, D = A - (A - J), $ = J - D, j = N * $ - (Y - E * D - N * D - E * $), y = q - j, w = q - y, Nt[0] = q - (y + w) + (w - j), F = R + y, w = F - R, P = R - (F - w) + (y - w), y = P - Y, w = P - y, Nt[1] = P - (y + w) + (w - Y), V = F + y, w = V - F, Nt[2] = F - (V - w) + (y - w), Nt[3] = V, c = ht(
    ht(
      ht(
        L(L(4, Tt, H, z), z, H, K),
        K,
        L(L(4, Tt, J, z), z, J, nt),
        nt,
        et
      ),
      et,
      ht(
        L(L(4, Ft, G, z), z, G, K),
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
      L(L(4, Nt, W, z), z, W, K),
      K,
      L(L(4, Nt, Q, z), z, Q, nt),
      nt,
      et
    ),
    et,
    jt
  );
  let at = Fn(c, jt), ft = ti * l;
  if (at >= ft || -at >= ft || (w = r - H, h = r - (H + w) + (w - i), w = t - J, g = t - (J + w) + (w - a), w = e - G, f = e - (G + w) + (w - i), w = n - Z, v = n - (Z + w) + (w - a), w = o - W, u = o - (W + w) + (w - i), w = s - Q, d = s - (Q + w) + (w - a), h === 0 && f === 0 && u === 0 && g === 0 && v === 0 && d === 0) || (ft = ei * l + Tn * Math.abs(at), at += (H * H + J * J) * (G * d + Q * f - (Z * u + W * v)) + 2 * (H * h + J * g) * (G * Q - Z * W) + ((G * G + Z * Z) * (W * g + J * u - (Q * h + H * d)) + 2 * (G * f + Z * v) * (W * J - Q * H)) + ((W * W + Q * Q) * (H * v + Z * h - (J * f + G * g)) + 2 * (W * u + Q * d) * (H * Z - J * G)), at >= ft || -at >= ft))
    return at;
  if ((f !== 0 || v !== 0 || u !== 0 || d !== 0) && (R = H * H, A = U * H, E = A - (A - H), N = H - E, q = N * N - (R - E * E - (E + E) * N), Y = J * J, A = U * J, E = A - (A - J), N = J - E, j = N * N - (Y - E * E - (E + E) * N), y = q + j, w = y - q, St[0] = q - (y - w) + (j - w), F = R + y, w = F - R, P = R - (F - w) + (y - w), y = P + Y, w = y - P, St[1] = P - (y - w) + (Y - w), V = F + y, w = V - F, St[2] = F - (V - w) + (y - w), St[3] = V), (u !== 0 || d !== 0 || h !== 0 || g !== 0) && (R = G * G, A = U * G, E = A - (A - G), N = G - E, q = N * N - (R - E * E - (E + E) * N), Y = Z * Z, A = U * Z, E = A - (A - Z), N = Z - E, j = N * N - (Y - E * E - (E + E) * N), y = q + j, w = y - q, kt[0] = q - (y - w) + (j - w), F = R + y, w = F - R, P = R - (F - w) + (y - w), y = P + Y, w = y - P, kt[1] = P - (y - w) + (Y - w), V = F + y, w = V - F, kt[2] = F - (V - w) + (y - w), kt[3] = V), (h !== 0 || g !== 0 || f !== 0 || v !== 0) && (R = W * W, A = U * W, E = A - (A - W), N = W - E, q = N * N - (R - E * E - (E + E) * N), Y = Q * Q, A = U * Q, E = A - (A - Q), N = Q - E, j = N * N - (Y - E * E - (E + E) * N), y = q + j, w = y - q, Et[0] = q - (y - w) + (j - w), F = R + y, w = F - R, P = R - (F - w) + (y - w), y = P + Y, w = y - P, Et[1] = P - (y - w) + (Y - w), V = F + y, w = V - F, Et[2] = F - (V - w) + (y - w), Et[3] = V), h !== 0 && (_ = L(4, Tt, h, Me), c = lt(c, Mt(
    L(_, Me, 2 * H, K),
    K,
    L(L(4, Et, h, z), z, Z, nt),
    nt,
    L(L(4, kt, h, z), z, -Q, it),
    it,
    et,
    ct
  ), ct)), g !== 0 && (I = L(4, Tt, g, Se), c = lt(c, Mt(
    L(I, Se, 2 * J, K),
    K,
    L(L(4, kt, g, z), z, W, nt),
    nt,
    L(L(4, Et, g, z), z, -G, it),
    it,
    et,
    ct
  ), ct)), f !== 0 && (m = L(4, Ft, f, ke), c = lt(c, Mt(
    L(m, ke, 2 * G, K),
    K,
    L(L(4, St, f, z), z, Q, nt),
    nt,
    L(L(4, Et, f, z), z, -J, it),
    it,
    et,
    ct
  ), ct)), v !== 0 && (b = L(4, Ft, v, Ee), c = lt(c, Mt(
    L(b, Ee, 2 * Z, K),
    K,
    L(L(4, Et, v, z), z, H, nt),
    nt,
    L(L(4, St, v, z), z, -W, it),
    it,
    et,
    ct
  ), ct)), u !== 0 && (p = L(4, Nt, u, Ae), c = lt(c, Mt(
    L(p, Ae, 2 * W, K),
    K,
    L(L(4, kt, u, z), z, J, nt),
    nt,
    L(L(4, St, u, z), z, -Z, it),
    it,
    et,
    ct
  ), ct)), d !== 0 && (x = L(4, Nt, d, Ie), c = lt(c, Mt(
    L(x, Ie, 2 * Q, K),
    K,
    L(L(4, St, d, z), z, G, nt),
    nt,
    L(L(4, kt, d, z), z, -H, it),
    it,
    et,
    ct
  ), ct)), h !== 0 || g !== 0) {
    if (f !== 0 || v !== 0 || u !== 0 || d !== 0 ? (R = f * Q, A = U * f, E = A - (A - f), N = f - E, A = U * Q, D = A - (A - Q), $ = Q - D, q = N * $ - (R - E * D - N * D - E * $), Y = G * d, A = U * G, E = A - (A - G), N = G - E, A = U * d, D = A - (A - d), $ = d - D, j = N * $ - (Y - E * D - N * D - E * $), y = q + j, w = y - q, gt[0] = q - (y - w) + (j - w), F = R + y, w = F - R, P = R - (F - w) + (y - w), y = P + Y, w = y - P, gt[1] = P - (y - w) + (Y - w), V = F + y, w = V - F, gt[2] = F - (V - w) + (y - w), gt[3] = V, R = u * -Z, A = U * u, E = A - (A - u), N = u - E, A = U * -Z, D = A - (A - -Z), $ = -Z - D, q = N * $ - (R - E * D - N * D - E * $), Y = W * -v, A = U * W, E = A - (A - W), N = W - E, A = U * -v, D = A - (A - -v), $ = -v - D, j = N * $ - (Y - E * D - N * D - E * $), y = q + j, w = y - q, wt[0] = q - (y - w) + (j - w), F = R + y, w = F - R, P = R - (F - w) + (y - w), y = P + Y, w = y - P, wt[1] = P - (y - w) + (Y - w), V = F + y, w = V - F, wt[2] = F - (V - w) + (y - w), wt[3] = V, B = ht(4, gt, 4, wt, oe), R = f * d, A = U * f, E = A - (A - f), N = f - E, A = U * d, D = A - (A - d), $ = d - D, q = N * $ - (R - E * D - N * D - E * $), Y = u * v, A = U * u, E = A - (A - u), N = u - E, A = U * v, D = A - (A - v), $ = v - D, j = N * $ - (Y - E * D - N * D - E * $), y = q - j, w = q - y, Pt[0] = q - (y + w) + (w - j), F = R + y, w = F - R, P = R - (F - w) + (y - w), y = P - Y, w = P - y, Pt[1] = P - (y + w) + (w - Y), V = F + y, w = V - F, Pt[2] = F - (V - w) + (y - w), Pt[3] = V, O = 4) : (oe[0] = 0, B = 1, Pt[0] = 0, O = 1), h !== 0) {
      const rt = L(B, oe, h, it);
      c = lt(c, ht(
        L(_, Me, h, K),
        K,
        L(rt, it, 2 * H, et),
        et,
        ct
      ), ct);
      const st = L(O, Pt, h, z);
      c = lt(c, Mt(
        L(st, z, 2 * H, K),
        K,
        L(st, z, h, nt),
        nt,
        L(rt, it, h, et),
        et,
        Dt,
        vt
      ), vt), v !== 0 && (c = lt(c, L(L(4, Et, h, z), z, v, K), K)), d !== 0 && (c = lt(c, L(L(4, kt, -h, z), z, d, K), K));
    }
    if (g !== 0) {
      const rt = L(B, oe, g, it);
      c = lt(c, ht(
        L(I, Se, g, K),
        K,
        L(rt, it, 2 * J, et),
        et,
        ct
      ), ct);
      const st = L(O, Pt, g, z);
      c = lt(c, Mt(
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
  if (f !== 0 || v !== 0) {
    if (u !== 0 || d !== 0 || h !== 0 || g !== 0 ? (R = u * J, A = U * u, E = A - (A - u), N = u - E, A = U * J, D = A - (A - J), $ = J - D, q = N * $ - (R - E * D - N * D - E * $), Y = W * g, A = U * W, E = A - (A - W), N = W - E, A = U * g, D = A - (A - g), $ = g - D, j = N * $ - (Y - E * D - N * D - E * $), y = q + j, w = y - q, gt[0] = q - (y - w) + (j - w), F = R + y, w = F - R, P = R - (F - w) + (y - w), y = P + Y, w = y - P, gt[1] = P - (y - w) + (Y - w), V = F + y, w = V - F, gt[2] = F - (V - w) + (y - w), gt[3] = V, C = -Q, X = -d, R = h * C, A = U * h, E = A - (A - h), N = h - E, A = U * C, D = A - (A - C), $ = C - D, q = N * $ - (R - E * D - N * D - E * $), Y = H * X, A = U * H, E = A - (A - H), N = H - E, A = U * X, D = A - (A - X), $ = X - D, j = N * $ - (Y - E * D - N * D - E * $), y = q + j, w = y - q, wt[0] = q - (y - w) + (j - w), F = R + y, w = F - R, P = R - (F - w) + (y - w), y = P + Y, w = y - P, wt[1] = P - (y - w) + (Y - w), V = F + y, w = V - F, wt[2] = F - (V - w) + (y - w), wt[3] = V, k = ht(4, gt, 4, wt, ae), R = u * g, A = U * u, E = A - (A - u), N = u - E, A = U * g, D = A - (A - g), $ = g - D, q = N * $ - (R - E * D - N * D - E * $), Y = h * d, A = U * h, E = A - (A - h), N = h - E, A = U * d, D = A - (A - d), $ = d - D, j = N * $ - (Y - E * D - N * D - E * $), y = q - j, w = q - y, Xt[0] = q - (y + w) + (w - j), F = R + y, w = F - R, P = R - (F - w) + (y - w), y = P - Y, w = P - y, Xt[1] = P - (y + w) + (w - Y), V = F + y, w = V - F, Xt[2] = F - (V - w) + (y - w), Xt[3] = V, T = 4) : (ae[0] = 0, k = 1, Xt[0] = 0, T = 1), f !== 0) {
      const rt = L(k, ae, f, it);
      c = lt(c, ht(
        L(m, ke, f, K),
        K,
        L(rt, it, 2 * G, et),
        et,
        ct
      ), ct);
      const st = L(T, Xt, f, z);
      c = lt(c, Mt(
        L(st, z, 2 * G, K),
        K,
        L(st, z, f, nt),
        nt,
        L(rt, it, f, et),
        et,
        Dt,
        vt
      ), vt), d !== 0 && (c = lt(c, L(L(4, St, f, z), z, d, K), K)), g !== 0 && (c = lt(c, L(L(4, Et, -f, z), z, g, K), K));
    }
    if (v !== 0) {
      const rt = L(k, ae, v, it);
      c = lt(c, ht(
        L(b, Ee, v, K),
        K,
        L(rt, it, 2 * Z, et),
        et,
        ct
      ), ct);
      const st = L(T, Xt, v, z);
      c = lt(c, Mt(
        L(st, z, 2 * Z, K),
        K,
        L(st, z, v, nt),
        nt,
        L(rt, it, v, et),
        et,
        Dt,
        vt
      ), vt);
    }
  }
  if (u !== 0 || d !== 0) {
    if (h !== 0 || g !== 0 || f !== 0 || v !== 0 ? (R = h * Z, A = U * h, E = A - (A - h), N = h - E, A = U * Z, D = A - (A - Z), $ = Z - D, q = N * $ - (R - E * D - N * D - E * $), Y = H * v, A = U * H, E = A - (A - H), N = H - E, A = U * v, D = A - (A - v), $ = v - D, j = N * $ - (Y - E * D - N * D - E * $), y = q + j, w = y - q, gt[0] = q - (y - w) + (j - w), F = R + y, w = F - R, P = R - (F - w) + (y - w), y = P + Y, w = y - P, gt[1] = P - (y - w) + (Y - w), V = F + y, w = V - F, gt[2] = F - (V - w) + (y - w), gt[3] = V, C = -J, X = -g, R = f * C, A = U * f, E = A - (A - f), N = f - E, A = U * C, D = A - (A - C), $ = C - D, q = N * $ - (R - E * D - N * D - E * $), Y = G * X, A = U * G, E = A - (A - G), N = G - E, A = U * X, D = A - (A - X), $ = X - D, j = N * $ - (Y - E * D - N * D - E * $), y = q + j, w = y - q, wt[0] = q - (y - w) + (j - w), F = R + y, w = F - R, P = R - (F - w) + (y - w), y = P + Y, w = y - P, wt[1] = P - (y - w) + (Y - w), V = F + y, w = V - F, wt[2] = F - (V - w) + (y - w), wt[3] = V, M = ht(4, gt, 4, wt, se), R = h * v, A = U * h, E = A - (A - h), N = h - E, A = U * v, D = A - (A - v), $ = v - D, q = N * $ - (R - E * D - N * D - E * $), Y = f * g, A = U * f, E = A - (A - f), N = f - E, A = U * g, D = A - (A - g), $ = g - D, j = N * $ - (Y - E * D - N * D - E * $), y = q - j, w = q - y, $t[0] = q - (y + w) + (w - j), F = R + y, w = F - R, P = R - (F - w) + (y - w), y = P - Y, w = P - y, $t[1] = P - (y + w) + (w - Y), V = F + y, w = V - F, $t[2] = F - (V - w) + (y - w), $t[3] = V, S = 4) : (se[0] = 0, M = 1, $t[0] = 0, S = 1), u !== 0) {
      const rt = L(M, se, u, it);
      c = lt(c, ht(
        L(p, Ae, u, K),
        K,
        L(rt, it, 2 * W, et),
        et,
        ct
      ), ct);
      const st = L(S, $t, u, z);
      c = lt(c, Mt(
        L(st, z, 2 * W, K),
        K,
        L(st, z, u, nt),
        nt,
        L(rt, it, u, et),
        et,
        Dt,
        vt
      ), vt), g !== 0 && (c = lt(c, L(L(4, kt, u, z), z, g, K), K)), v !== 0 && (c = lt(c, L(L(4, St, -u, z), z, v, K), K));
    }
    if (d !== 0) {
      const rt = L(M, se, d, it);
      c = lt(c, ht(
        L(x, Ie, d, K),
        K,
        L(rt, it, 2 * Q, et),
        et,
        ct
      ), ct);
      const st = L(S, $t, d, z);
      c = lt(c, Mt(
        L(st, z, 2 * Q, K),
        K,
        L(st, z, d, nt),
        nt,
        L(rt, it, d, et),
        et,
        Dt,
        vt
      ), vt);
    }
  }
  return jt[c - 1];
}
function ii(r, t, e, n, o, s, i, a) {
  const l = r - i, c = e - i, h = o - i, f = t - a, u = n - a, g = s - a, v = c * g, d = h * u, _ = l * l + f * f, I = h * f, m = l * g, b = c * c + u * u, p = l * u, x = c * f, M = h * h + g * g, B = _ * (v - d) + b * (I - m) + M * (p - x), k = (Math.abs(v) + Math.abs(d)) * _ + (Math.abs(I) + Math.abs(m)) * b + (Math.abs(p) + Math.abs(x)) * M, S = Zn * k;
  return B > S || -B > S ? B : ni(r, t, e, n, o, s, i, a, k);
}
function ri(r, t) {
  var e, n, o = 0, s, i, a, l, c, h, f, u = r[0], g = r[1], v = t.length;
  for (e = 0; e < v; e++) {
    n = 0;
    var d = t[e], _ = d.length - 1;
    if (h = d[0], h[0] !== d[_][0] && h[1] !== d[_][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (i = h[0] - u, a = h[1] - g, n; n < _; n++) {
      if (f = d[n + 1], l = f[0] - u, c = f[1] - g, a === 0 && c === 0) {
        if (l <= 0 && i >= 0 || i <= 0 && l >= 0)
          return 0;
      } else if (c >= 0 && a <= 0 || c <= 0 && a >= 0) {
        if (s = dt(i, l, a, c, 0, 0), s === 0)
          return 0;
        (s > 0 && c > 0 && a <= 0 || s < 0 && c <= 0 && a > 0) && o++;
      }
      h = f, a = c, i = l;
    }
  }
  return o % 2 !== 0;
}
function He(r, t, e = {}) {
  if (!r)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const n = Gn(r), o = Hn(t), s = o.type, i = t.bbox;
  let a = o.coordinates;
  if (i && si(n, i) === !1)
    return !1;
  s === "Polygon" && (a = [a]);
  for (var l = 0; l < a.length; ++l) {
    const c = ri(n, a[l]);
    if (c === 0 && !e.ignoreBoundary) return !0;
    if (c) return !0;
  }
  return !1;
}
function si(r, t) {
  return t[0] <= r[0] && t[1] <= r[1] && t[2] >= r[0] && t[3] >= r[1];
}
class Pe {
  constructor(t = [], e = oi) {
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
function oi(r, t) {
  return r < t ? -1 : r > t ? 1 : 0;
}
const ai = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Pe
}, Symbol.toStringTag, { value: "Module" })), Bt = 11102230246251565e-32, ut = 134217729, ci = (3 + 8 * Bt) * Bt;
function Oe(r, t, e, n, o) {
  let s, i, a, l, c = t[0], h = n[0], f = 0, u = 0;
  h > c == h > -c ? (s = c, c = t[++f]) : (s = h, h = n[++u]);
  let g = 0;
  if (f < r && u < e)
    for (h > c == h > -c ? (i = c + s, a = s - (i - c), c = t[++f]) : (i = h + s, a = s - (i - h), h = n[++u]), s = i, a !== 0 && (o[g++] = a); f < r && u < e; )
      h > c == h > -c ? (i = s + c, l = i - s, a = s - (i - l) + (c - l), c = t[++f]) : (i = s + h, l = i - s, a = s - (i - l) + (h - l), h = n[++u]), s = i, a !== 0 && (o[g++] = a);
  for (; f < r; )
    i = s + c, l = i - s, a = s - (i - l) + (c - l), c = t[++f], s = i, a !== 0 && (o[g++] = a);
  for (; u < e; )
    i = s + h, l = i - s, a = s - (i - l) + (h - l), h = n[++u], s = i, a !== 0 && (o[g++] = a);
  return (s !== 0 || g === 0) && (o[g++] = s), g;
}
function li(r, t) {
  let e = t[0];
  for (let n = 1; n < r; n++) e += t[n];
  return e;
}
function re(r) {
  return new Float64Array(r);
}
const fi = (3 + 16 * Bt) * Bt, hi = (2 + 12 * Bt) * Bt, ui = (9 + 64 * Bt) * Bt * Bt, qt = re(4), Ke = re(8), We = re(12), Je = re(16), yt = re(4);
function di(r, t, e, n, o, s, i) {
  let a, l, c, h, f, u, g, v, d, _, I, m, b, p, x, M, B, k;
  const S = r - o, O = e - o, T = t - s, C = n - s;
  p = S * C, u = ut * S, g = u - (u - S), v = S - g, u = ut * C, d = u - (u - C), _ = C - d, x = v * _ - (p - g * d - v * d - g * _), M = T * O, u = ut * T, g = u - (u - T), v = T - g, u = ut * O, d = u - (u - O), _ = O - d, B = v * _ - (M - g * d - v * d - g * _), I = x - B, f = x - I, qt[0] = x - (I + f) + (f - B), m = p + I, f = m - p, b = p - (m - f) + (I - f), I = b - M, f = b - I, qt[1] = b - (I + f) + (f - M), k = m + I, f = k - m, qt[2] = m - (k - f) + (I - f), qt[3] = k;
  let X = li(4, qt), w = hi * i;
  if (X >= w || -X >= w || (f = r - S, a = r - (S + f) + (f - o), f = e - O, c = e - (O + f) + (f - o), f = t - T, l = t - (T + f) + (f - s), f = n - C, h = n - (C + f) + (f - s), a === 0 && l === 0 && c === 0 && h === 0) || (w = ui * i + ci * Math.abs(X), X += S * h + C * a - (T * c + O * l), X >= w || -X >= w)) return X;
  p = a * C, u = ut * a, g = u - (u - a), v = a - g, u = ut * C, d = u - (u - C), _ = C - d, x = v * _ - (p - g * d - v * d - g * _), M = l * O, u = ut * l, g = u - (u - l), v = l - g, u = ut * O, d = u - (u - O), _ = O - d, B = v * _ - (M - g * d - v * d - g * _), I = x - B, f = x - I, yt[0] = x - (I + f) + (f - B), m = p + I, f = m - p, b = p - (m - f) + (I - f), I = b - M, f = b - I, yt[1] = b - (I + f) + (f - M), k = m + I, f = k - m, yt[2] = m - (k - f) + (I - f), yt[3] = k;
  const A = Oe(4, qt, 4, yt, Ke);
  p = S * h, u = ut * S, g = u - (u - S), v = S - g, u = ut * h, d = u - (u - h), _ = h - d, x = v * _ - (p - g * d - v * d - g * _), M = T * c, u = ut * T, g = u - (u - T), v = T - g, u = ut * c, d = u - (u - c), _ = c - d, B = v * _ - (M - g * d - v * d - g * _), I = x - B, f = x - I, yt[0] = x - (I + f) + (f - B), m = p + I, f = m - p, b = p - (m - f) + (I - f), I = b - M, f = b - I, yt[1] = b - (I + f) + (f - M), k = m + I, f = k - m, yt[2] = m - (k - f) + (I - f), yt[3] = k;
  const E = Oe(A, Ke, 4, yt, We);
  p = a * h, u = ut * a, g = u - (u - a), v = a - g, u = ut * h, d = u - (u - h), _ = h - d, x = v * _ - (p - g * d - v * d - g * _), M = l * c, u = ut * l, g = u - (u - l), v = l - g, u = ut * c, d = u - (u - c), _ = c - d, B = v * _ - (M - g * d - v * d - g * _), I = x - B, f = x - I, yt[0] = x - (I + f) + (f - B), m = p + I, f = m - p, b = p - (m - f) + (I - f), I = b - M, f = b - I, yt[1] = b - (I + f) + (f - M), k = m + I, f = k - m, yt[2] = m - (k - f) + (I - f), yt[3] = k;
  const N = Oe(E, We, 4, yt, Je);
  return Je[N - 1];
}
function Qe(r, t, e, n, o, s) {
  const i = (t - s) * (e - o), a = (r - o) * (n - s), l = i - a;
  if (i === 0 || a === 0 || i > 0 != a > 0) return l;
  const c = Math.abs(i + a);
  return Math.abs(l) >= fi * c ? l : -di(r, t, e, n, o, s, c);
}
function pi(r, t) {
  const e = new Pe([], Nn);
  return gi(r, e), wi(e, t);
}
function Nn(r, t) {
  return r.p.x > t.p.x ? 1 : r.p.x < t.p.x || r.p.x === t.p.x && (r.featureId !== t.featureId || r.ringId !== t.ringId) && r.isLeftEndpoint && !t.isLeftEndpoint ? -1 : r.p.y !== t.p.y ? r.p.y > t.p.y ? 1 : -1 : 1;
}
function mi(r, t) {
  return r.rightSweepEvent.p.x > t.rightSweepEvent.p.x ? 1 : r.rightSweepEvent.p.x < t.rightSweepEvent.p.x ? -1 : r.rightSweepEvent.p.y !== t.rightSweepEvent.p.y ? r.rightSweepEvent.p.y < t.rightSweepEvent.p.y ? 1 : -1 : 1;
}
function gi(r, t) {
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
    for (let s = 0; s < n[o].length; s++) {
      let i = n[o][s][0], a = null;
      le = le + 1;
      for (let l = 0; l < n[o][s].length - 1; l++) {
        a = n[o][s][l + 1];
        const c = new tn(i, ce, le, fe), h = new tn(a, ce, le, fe + 1);
        c.otherEvent = h, h.otherEvent = c, Nn(c, h) > 0 ? (h.isLeftEndpoint = !0, c.isLeftEndpoint = !1) : (c.isLeftEndpoint = !0, h.isLeftEndpoint = !1), t.push(c), t.push(h), i = a, fe = fe + 1;
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
function wi(r, t = !1) {
  const e = [], n = new Pe([], mi);
  for (; r.length; ) {
    const o = r.pop();
    if (o.isLeftEndpoint) {
      const s = new yi(o);
      for (let i = 0; i < n.data.length; i++) {
        const a = n.data[i];
        if (t && a.leftSweepEvent.featureId === o.featureId)
          continue;
        const l = vi(s, a);
        l !== !1 && e.push(l);
      }
      n.push(s);
    } else o.isLeftEndpoint === !1 && n.pop();
  }
  return e;
}
var yi = class {
  /** @param event must have otherEvent non-null */
  constructor(r) {
    this.leftSweepEvent = r, this.rightSweepEvent = r.otherEvent;
  }
};
function vi(r, t) {
  if (r === null || t === null) return !1;
  const e = r.leftSweepEvent.p.x, n = r.leftSweepEvent.p.y, o = r.rightSweepEvent.p.x, s = r.rightSweepEvent.p.y, i = t.leftSweepEvent.p.x, a = t.leftSweepEvent.p.y, l = t.rightSweepEvent.p.x, c = t.rightSweepEvent.p.y, h = Qe(e, n, o, s, i, a), f = Qe(e, n, o, s, l, c);
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
  const u = (c - a) * (o - e) - (l - i) * (s - n), g = (l - i) * (n - a) - (c - a) * (e - i), v = (o - e) * (n - a) - (s - n) * (e - i);
  if (u === 0)
    return !1;
  const d = g / u, _ = v / u;
  if (d >= 0 && d <= 1 && _ >= 0 && _ <= 1) {
    const I = e + d * (o - e), m = n + d * (s - n);
    return [I, m];
  }
  return !1;
}
function bi(r, t, e = {}) {
  const { removeDuplicates: n = !0, ignoreSelfIntersections: o = !0 } = e;
  let s = [];
  r.type === "FeatureCollection" ? s = s.concat(r.features) : r.type === "Feature" ? s.push(r) : (r.type === "LineString" || r.type === "Polygon" || r.type === "MultiLineString" || r.type === "MultiPolygon") && s.push(te(r)), t.type === "FeatureCollection" ? s = s.concat(t.features) : t.type === "Feature" ? s.push(t) : (t.type === "LineString" || t.type === "Polygon" || t.type === "MultiLineString" || t.type === "MultiPolygon") && s.push(te(t));
  const i = pi(
    xt(s),
    o
  );
  let a = [];
  if (n) {
    const l = {};
    i.forEach((c) => {
      const h = c.join(",");
      l[h] || (l[h] = !0, a.push(c));
    });
  } else
    a = i;
  return xt(a.map((l) => Yt(l)));
}
function xi(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
function _i(r) {
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
function Mi(r, t = {}) {
  let e = 0, n = 0, o = 0;
  return $e(
    r,
    function(s) {
      e += s[0], n += s[1], o++;
    },
    !0
  ), Yt([e / o, n / o], t.properties);
}
var he = { exports: {} }, we = { exports: {} }, Si = we.exports, en;
function ki() {
  return en || (en = 1, (function(r, t) {
    (function(e, n) {
      r.exports = n();
    })(Si, function() {
      function e(m, b, p, x, M) {
        (function B(k, S, O, T, C) {
          for (; T > O; ) {
            if (T - O > 600) {
              var X = T - O + 1, w = S - O + 1, A = Math.log(X), E = 0.5 * Math.exp(2 * A / 3), N = 0.5 * Math.sqrt(A * E * (X - E) / X) * (w - X / 2 < 0 ? -1 : 1), D = Math.max(O, Math.floor(S - w * E / X + N)), $ = Math.min(T, Math.floor(S + (X - w) * E / X + N));
              B(k, S, D, $, C);
            }
            var y = k[S], F = O, P = T;
            for (n(k, O, S), C(k[T], y) > 0 && n(k, O, T); F < P; ) {
              for (n(k, F, P), F++, P--; C(k[F], y) < 0; ) F++;
              for (; C(k[P], y) > 0; ) P--;
            }
            C(k[O], y) === 0 ? n(k, O, P) : n(k, ++P, T), P <= S && (O = P + 1), S <= P && (T = P - 1);
          }
        })(m, b, p || 0, x || m.length - 1, M || o);
      }
      function n(m, b, p) {
        var x = m[b];
        m[b] = m[p], m[p] = x;
      }
      function o(m, b) {
        return m < b ? -1 : m > b ? 1 : 0;
      }
      var s = function(m) {
        m === void 0 && (m = 9), this._maxEntries = Math.max(4, m), this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries)), this.clear();
      };
      function i(m, b, p) {
        if (!p) return b.indexOf(m);
        for (var x = 0; x < b.length; x++) if (p(m, b[x])) return x;
        return -1;
      }
      function a(m, b) {
        l(m, 0, m.children.length, b, m);
      }
      function l(m, b, p, x, M) {
        M || (M = _(null)), M.minX = 1 / 0, M.minY = 1 / 0, M.maxX = -1 / 0, M.maxY = -1 / 0;
        for (var B = b; B < p; B++) {
          var k = m.children[B];
          c(M, m.leaf ? x(k) : k);
        }
        return M;
      }
      function c(m, b) {
        return m.minX = Math.min(m.minX, b.minX), m.minY = Math.min(m.minY, b.minY), m.maxX = Math.max(m.maxX, b.maxX), m.maxY = Math.max(m.maxY, b.maxY), m;
      }
      function h(m, b) {
        return m.minX - b.minX;
      }
      function f(m, b) {
        return m.minY - b.minY;
      }
      function u(m) {
        return (m.maxX - m.minX) * (m.maxY - m.minY);
      }
      function g(m) {
        return m.maxX - m.minX + (m.maxY - m.minY);
      }
      function v(m, b) {
        return m.minX <= b.minX && m.minY <= b.minY && b.maxX <= m.maxX && b.maxY <= m.maxY;
      }
      function d(m, b) {
        return b.minX <= m.maxX && b.minY <= m.maxY && b.maxX >= m.minX && b.maxY >= m.minY;
      }
      function _(m) {
        return { children: m, height: 1, leaf: !0, minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
      }
      function I(m, b, p, x, M) {
        for (var B = [b, p]; B.length; ) if (!((p = B.pop()) - (b = B.pop()) <= x)) {
          var k = b + Math.ceil((p - b) / x / 2) * x;
          e(m, k, b, p, M), B.push(b, k, k, p);
        }
      }
      return s.prototype.all = function() {
        return this._all(this.data, []);
      }, s.prototype.search = function(m) {
        var b = this.data, p = [];
        if (!d(m, b)) return p;
        for (var x = this.toBBox, M = []; b; ) {
          for (var B = 0; B < b.children.length; B++) {
            var k = b.children[B], S = b.leaf ? x(k) : k;
            d(m, S) && (b.leaf ? p.push(k) : v(m, S) ? this._all(k, p) : M.push(k));
          }
          b = M.pop();
        }
        return p;
      }, s.prototype.collides = function(m) {
        var b = this.data;
        if (!d(m, b)) return !1;
        for (var p = []; b; ) {
          for (var x = 0; x < b.children.length; x++) {
            var M = b.children[x], B = b.leaf ? this.toBBox(M) : M;
            if (d(m, B)) {
              if (b.leaf || v(m, B)) return !0;
              p.push(M);
            }
          }
          b = p.pop();
        }
        return !1;
      }, s.prototype.load = function(m) {
        if (!m || !m.length) return this;
        if (m.length < this._minEntries) {
          for (var b = 0; b < m.length; b++) this.insert(m[b]);
          return this;
        }
        var p = this._build(m.slice(), 0, m.length - 1, 0);
        if (this.data.children.length) if (this.data.height === p.height) this._splitRoot(this.data, p);
        else {
          if (this.data.height < p.height) {
            var x = this.data;
            this.data = p, p = x;
          }
          this._insert(p, this.data.height - p.height - 1, !0);
        }
        else this.data = p;
        return this;
      }, s.prototype.insert = function(m) {
        return m && this._insert(m, this.data.height - 1), this;
      }, s.prototype.clear = function() {
        return this.data = _([]), this;
      }, s.prototype.remove = function(m, b) {
        if (!m) return this;
        for (var p, x, M, B = this.data, k = this.toBBox(m), S = [], O = []; B || S.length; ) {
          if (B || (B = S.pop(), x = S[S.length - 1], p = O.pop(), M = !0), B.leaf) {
            var T = i(m, B.children, b);
            if (T !== -1) return B.children.splice(T, 1), S.push(B), this._condense(S), this;
          }
          M || B.leaf || !v(B, k) ? x ? (p++, B = x.children[p], M = !1) : B = null : (S.push(B), O.push(p), p = 0, x = B, B = B.children[0]);
        }
        return this;
      }, s.prototype.toBBox = function(m) {
        return m;
      }, s.prototype.compareMinX = function(m, b) {
        return m.minX - b.minX;
      }, s.prototype.compareMinY = function(m, b) {
        return m.minY - b.minY;
      }, s.prototype.toJSON = function() {
        return this.data;
      }, s.prototype.fromJSON = function(m) {
        return this.data = m, this;
      }, s.prototype._all = function(m, b) {
        for (var p = []; m; ) m.leaf ? b.push.apply(b, m.children) : p.push.apply(p, m.children), m = p.pop();
        return b;
      }, s.prototype._build = function(m, b, p, x) {
        var M, B = p - b + 1, k = this._maxEntries;
        if (B <= k) return a(M = _(m.slice(b, p + 1)), this.toBBox), M;
        x || (x = Math.ceil(Math.log(B) / Math.log(k)), k = Math.ceil(B / Math.pow(k, x - 1))), (M = _([])).leaf = !1, M.height = x;
        var S = Math.ceil(B / k), O = S * Math.ceil(Math.sqrt(k));
        I(m, b, p, O, this.compareMinX);
        for (var T = b; T <= p; T += O) {
          var C = Math.min(T + O - 1, p);
          I(m, T, C, S, this.compareMinY);
          for (var X = T; X <= C; X += S) {
            var w = Math.min(X + S - 1, C);
            M.children.push(this._build(m, X, w, x - 1));
          }
        }
        return a(M, this.toBBox), M;
      }, s.prototype._chooseSubtree = function(m, b, p, x) {
        for (; x.push(b), !b.leaf && x.length - 1 !== p; ) {
          for (var M = 1 / 0, B = 1 / 0, k = void 0, S = 0; S < b.children.length; S++) {
            var O = b.children[S], T = u(O), C = (X = m, w = O, (Math.max(w.maxX, X.maxX) - Math.min(w.minX, X.minX)) * (Math.max(w.maxY, X.maxY) - Math.min(w.minY, X.minY)) - T);
            C < B ? (B = C, M = T < M ? T : M, k = O) : C === B && T < M && (M = T, k = O);
          }
          b = k || b.children[0];
        }
        var X, w;
        return b;
      }, s.prototype._insert = function(m, b, p) {
        var x = p ? m : this.toBBox(m), M = [], B = this._chooseSubtree(x, this.data, b, M);
        for (B.children.push(m), c(B, x); b >= 0 && M[b].children.length > this._maxEntries; ) this._split(M, b), b--;
        this._adjustParentBBoxes(x, M, b);
      }, s.prototype._split = function(m, b) {
        var p = m[b], x = p.children.length, M = this._minEntries;
        this._chooseSplitAxis(p, M, x);
        var B = this._chooseSplitIndex(p, M, x), k = _(p.children.splice(B, p.children.length - B));
        k.height = p.height, k.leaf = p.leaf, a(p, this.toBBox), a(k, this.toBBox), b ? m[b - 1].children.push(k) : this._splitRoot(p, k);
      }, s.prototype._splitRoot = function(m, b) {
        this.data = _([m, b]), this.data.height = m.height + 1, this.data.leaf = !1, a(this.data, this.toBBox);
      }, s.prototype._chooseSplitIndex = function(m, b, p) {
        for (var x, M, B, k, S, O, T, C = 1 / 0, X = 1 / 0, w = b; w <= p - b; w++) {
          var A = l(m, 0, w, this.toBBox), E = l(m, w, p, this.toBBox), N = (M = A, B = E, k = void 0, S = void 0, O = void 0, T = void 0, k = Math.max(M.minX, B.minX), S = Math.max(M.minY, B.minY), O = Math.min(M.maxX, B.maxX), T = Math.min(M.maxY, B.maxY), Math.max(0, O - k) * Math.max(0, T - S)), D = u(A) + u(E);
          N < C ? (C = N, x = w, X = D < X ? D : X) : N === C && D < X && (X = D, x = w);
        }
        return x || p - b;
      }, s.prototype._chooseSplitAxis = function(m, b, p) {
        var x = m.leaf ? this.compareMinX : h, M = m.leaf ? this.compareMinY : f;
        this._allDistMargin(m, b, p, x) < this._allDistMargin(m, b, p, M) && m.children.sort(x);
      }, s.prototype._allDistMargin = function(m, b, p, x) {
        m.children.sort(x);
        for (var M = this.toBBox, B = l(m, 0, b, M), k = l(m, p - b, p, M), S = g(B) + g(k), O = b; O < p - b; O++) {
          var T = m.children[O];
          c(B, m.leaf ? M(T) : T), S += g(B);
        }
        for (var C = p - b - 1; C >= b; C--) {
          var X = m.children[C];
          c(k, m.leaf ? M(X) : X), S += g(k);
        }
        return S;
      }, s.prototype._adjustParentBBoxes = function(m, b, p) {
        for (var x = p; x >= 0; x--) c(b[x], m);
      }, s.prototype._condense = function(m) {
        for (var b = m.length - 1, p = void 0; b >= 0; b--) m[b].children.length === 0 ? b > 0 ? (p = m[b - 1].children).splice(p.indexOf(m[b]), 1) : this.clear() : a(m[b], this.toBBox);
      }, s;
    });
  })(we)), we.exports;
}
const Ei = /* @__PURE__ */ _i(ai);
var zt = { exports: {} }, Te, nn;
function Ai() {
  return nn || (nn = 1, Te = function(t, e, n, o) {
    var s = t[0], i = t[1], a = !1;
    n === void 0 && (n = 0), o === void 0 && (o = e.length);
    for (var l = (o - n) / 2, c = 0, h = l - 1; c < l; h = c++) {
      var f = e[n + c * 2 + 0], u = e[n + c * 2 + 1], g = e[n + h * 2 + 0], v = e[n + h * 2 + 1], d = u > i != v > i && s < (g - f) * (i - u) / (v - u) + f;
      d && (a = !a);
    }
    return a;
  }), Te;
}
var Fe, rn;
function Ii() {
  return rn || (rn = 1, Fe = function(t, e, n, o) {
    var s = t[0], i = t[1], a = !1;
    n === void 0 && (n = 0), o === void 0 && (o = e.length);
    for (var l = o - n, c = 0, h = l - 1; c < l; h = c++) {
      var f = e[c + n][0], u = e[c + n][1], g = e[h + n][0], v = e[h + n][1], d = u > i != v > i && s < (g - f) * (i - u) / (v - u) + f;
      d && (a = !a);
    }
    return a;
  }), Fe;
}
var sn;
function Bi() {
  if (sn) return zt.exports;
  sn = 1;
  var r = Ai(), t = Ii();
  return zt.exports = function(n, o, s, i) {
    return o.length > 0 && Array.isArray(o[0]) ? t(n, o, s, i) : r(n, o, s, i);
  }, zt.exports.nested = t, zt.exports.flat = r, zt.exports;
}
var Ht = { exports: {} }, Oi = Ht.exports, on;
function Ti() {
  return on || (on = 1, (function(r, t) {
    (function(e, n) {
      n(t);
    })(Oi, function(e) {
      const o = 33306690738754706e-32;
      function s(d, _, I, m, b) {
        let p, x, M, B, k = _[0], S = m[0], O = 0, T = 0;
        S > k == S > -k ? (p = k, k = _[++O]) : (p = S, S = m[++T]);
        let C = 0;
        if (O < d && T < I) for (S > k == S > -k ? (M = p - ((x = k + p) - k), k = _[++O]) : (M = p - ((x = S + p) - S), S = m[++T]), p = x, M !== 0 && (b[C++] = M); O < d && T < I; ) S > k == S > -k ? (M = p - ((x = p + k) - (B = x - p)) + (k - B), k = _[++O]) : (M = p - ((x = p + S) - (B = x - p)) + (S - B), S = m[++T]), p = x, M !== 0 && (b[C++] = M);
        for (; O < d; ) M = p - ((x = p + k) - (B = x - p)) + (k - B), k = _[++O], p = x, M !== 0 && (b[C++] = M);
        for (; T < I; ) M = p - ((x = p + S) - (B = x - p)) + (S - B), S = m[++T], p = x, M !== 0 && (b[C++] = M);
        return p === 0 && C !== 0 || (b[C++] = p), C;
      }
      function i(d) {
        return new Float64Array(d);
      }
      const a = 33306690738754716e-32, l = 22204460492503146e-32, c = 11093356479670487e-47, h = i(4), f = i(8), u = i(12), g = i(16), v = i(4);
      e.orient2d = function(d, _, I, m, b, p) {
        const x = (_ - p) * (I - b), M = (d - b) * (m - p), B = x - M;
        if (x === 0 || M === 0 || x > 0 != M > 0) return B;
        const k = Math.abs(x + M);
        return Math.abs(B) >= a * k ? B : -(function(S, O, T, C, X, w, A) {
          let E, N, D, $, y, F, P, R, q, Y, j, V, H, G, W, J, Z, Q;
          const at = S - X, ft = T - X, rt = O - w, st = C - w;
          y = (W = (R = at - (P = (F = 134217729 * at) - (F - at))) * (Y = st - (q = (F = 134217729 * st) - (F - st))) - ((G = at * st) - P * q - R * q - P * Y)) - (j = W - (Z = (R = rt - (P = (F = 134217729 * rt) - (F - rt))) * (Y = ft - (q = (F = 134217729 * ft) - (F - ft))) - ((J = rt * ft) - P * q - R * q - P * Y))), h[0] = W - (j + y) + (y - Z), y = (H = G - ((V = G + j) - (y = V - G)) + (j - y)) - (j = H - J), h[1] = H - (j + y) + (y - J), y = (Q = V + j) - V, h[2] = V - (Q - y) + (j - y), h[3] = Q;
          let Ot = (function(qn, Ye) {
            let Le = Ye[0];
            for (let xe = 1; xe < qn; xe++) Le += Ye[xe];
            return Le;
          })(4, h), Ut = l * A;
          if (Ot >= Ut || -Ot >= Ut || (E = S - (at + (y = S - at)) + (y - X), D = T - (ft + (y = T - ft)) + (y - X), N = O - (rt + (y = O - rt)) + (y - w), $ = C - (st + (y = C - st)) + (y - w), E === 0 && N === 0 && D === 0 && $ === 0) || (Ut = c * A + o * Math.abs(Ot), (Ot += at * $ + st * E - (rt * D + ft * N)) >= Ut || -Ot >= Ut)) return Ot;
          y = (W = (R = E - (P = (F = 134217729 * E) - (F - E))) * (Y = st - (q = (F = 134217729 * st) - (F - st))) - ((G = E * st) - P * q - R * q - P * Y)) - (j = W - (Z = (R = N - (P = (F = 134217729 * N) - (F - N))) * (Y = ft - (q = (F = 134217729 * ft) - (F - ft))) - ((J = N * ft) - P * q - R * q - P * Y))), v[0] = W - (j + y) + (y - Z), y = (H = G - ((V = G + j) - (y = V - G)) + (j - y)) - (j = H - J), v[1] = H - (j + y) + (y - J), y = (Q = V + j) - V, v[2] = V - (Q - y) + (j - y), v[3] = Q;
          const Rn = s(4, h, 4, v, f);
          y = (W = (R = at - (P = (F = 134217729 * at) - (F - at))) * (Y = $ - (q = (F = 134217729 * $) - (F - $))) - ((G = at * $) - P * q - R * q - P * Y)) - (j = W - (Z = (R = rt - (P = (F = 134217729 * rt) - (F - rt))) * (Y = D - (q = (F = 134217729 * D) - (F - D))) - ((J = rt * D) - P * q - R * q - P * Y))), v[0] = W - (j + y) + (y - Z), y = (H = G - ((V = G + j) - (y = V - G)) + (j - y)) - (j = H - J), v[1] = H - (j + y) + (y - J), y = (Q = V + j) - V, v[2] = V - (Q - y) + (j - y), v[3] = Q;
          const Yn = s(Rn, f, 4, v, u);
          y = (W = (R = E - (P = (F = 134217729 * E) - (F - E))) * (Y = $ - (q = (F = 134217729 * $) - (F - $))) - ((G = E * $) - P * q - R * q - P * Y)) - (j = W - (Z = (R = N - (P = (F = 134217729 * N) - (F - N))) * (Y = D - (q = (F = 134217729 * D) - (F - D))) - ((J = N * D) - P * q - R * q - P * Y))), v[0] = W - (j + y) + (y - Z), y = (H = G - ((V = G + j) - (y = V - G)) + (j - y)) - (j = H - J), v[1] = H - (j + y) + (y - J), y = (Q = V + j) - V, v[2] = V - (Q - y) + (j - y), v[3] = Q;
          const Ln = s(Yn, u, 4, v, g);
          return g[Ln - 1];
        })(d, _, I, m, b, p, k);
      }, e.orient2dfast = function(d, _, I, m, b, p) {
        return (_ - p) * (I - b) - (d - b) * (m - p);
      }, Object.defineProperty(e, "__esModule", { value: !0 });
    });
  })(Ht, Ht.exports)), Ht.exports;
}
var an;
function Fi() {
  if (an) return he.exports;
  an = 1;
  var r = ki(), t = Ei, e = Bi(), n = Ti().orient2d;
  t.default && (t = t.default), he.exports = o, he.exports.default = o;
  function o(p, x, M) {
    x = Math.max(0, x === void 0 ? 2 : x), M = M || 0;
    var B = g(p), k = new r(16);
    k.toBBox = function(P) {
      return {
        minX: P[0],
        minY: P[1],
        maxX: P[0],
        maxY: P[1]
      };
    }, k.compareMinX = function(P, R) {
      return P[0] - R[0];
    }, k.compareMinY = function(P, R) {
      return P[1] - R[1];
    }, k.load(p);
    for (var S = [], O = 0, T; O < B.length; O++) {
      var C = B[O];
      k.remove(C), T = v(C, T), S.push(T);
    }
    var X = new r(16);
    for (O = 0; O < S.length; O++) X.insert(u(S[O]));
    for (var w = x * x, A = M * M; S.length; ) {
      var E = S.shift(), N = E.p, D = E.next.p, $ = d(N, D);
      if (!($ < A)) {
        var y = $ / w;
        C = s(k, E.prev.p, N, D, E.next.next.p, y, X), C && Math.min(d(C, N), d(C, D)) <= y && (S.push(E), S.push(v(C, E)), k.remove(C), X.remove(E), X.insert(u(E)), X.insert(u(E.next)));
      }
    }
    E = T;
    var F = [];
    do
      F.push(E.p), E = E.next;
    while (E !== T);
    return F.push(E.p), F;
  }
  function s(p, x, M, B, k, S, O) {
    for (var T = new t([], i), C = p.data; C; ) {
      for (var X = 0; X < C.children.length; X++) {
        var w = C.children[X], A = C.leaf ? _(w, M, B) : a(M, B, w);
        A > S || T.push({
          node: w,
          dist: A
        });
      }
      for (; T.length && !T.peek().node.children; ) {
        var E = T.pop(), N = E.node, D = _(N, x, M), $ = _(N, B, k);
        if (E.dist < D && E.dist < $ && c(M, N, O) && c(B, N, O)) return N;
      }
      C = T.pop(), C && (C = C.node);
    }
    return null;
  }
  function i(p, x) {
    return p.dist - x.dist;
  }
  function a(p, x, M) {
    if (l(p, M) || l(x, M)) return 0;
    var B = I(p[0], p[1], x[0], x[1], M.minX, M.minY, M.maxX, M.minY);
    if (B === 0) return 0;
    var k = I(p[0], p[1], x[0], x[1], M.minX, M.minY, M.minX, M.maxY);
    if (k === 0) return 0;
    var S = I(p[0], p[1], x[0], x[1], M.maxX, M.minY, M.maxX, M.maxY);
    if (S === 0) return 0;
    var O = I(p[0], p[1], x[0], x[1], M.minX, M.maxY, M.maxX, M.maxY);
    return O === 0 ? 0 : Math.min(B, k, S, O);
  }
  function l(p, x) {
    return p[0] >= x.minX && p[0] <= x.maxX && p[1] >= x.minY && p[1] <= x.maxY;
  }
  function c(p, x, M) {
    for (var B = Math.min(p[0], x[0]), k = Math.min(p[1], x[1]), S = Math.max(p[0], x[0]), O = Math.max(p[1], x[1]), T = M.search({ minX: B, minY: k, maxX: S, maxY: O }), C = 0; C < T.length; C++)
      if (f(T[C].p, T[C].next.p, p, x)) return !1;
    return !0;
  }
  function h(p, x, M) {
    return n(p[0], p[1], x[0], x[1], M[0], M[1]);
  }
  function f(p, x, M, B) {
    return p !== B && x !== M && h(p, x, M) > 0 != h(p, x, B) > 0 && h(M, B, p) > 0 != h(M, B, x) > 0;
  }
  function u(p) {
    var x = p.p, M = p.next.p;
    return p.minX = Math.min(x[0], M[0]), p.minY = Math.min(x[1], M[1]), p.maxX = Math.max(x[0], M[0]), p.maxY = Math.max(x[1], M[1]), p;
  }
  function g(p) {
    for (var x = p[0], M = p[0], B = p[0], k = p[0], S = 0; S < p.length; S++) {
      var O = p[S];
      O[0] < x[0] && (x = O), O[0] > B[0] && (B = O), O[1] < M[1] && (M = O), O[1] > k[1] && (k = O);
    }
    var T = [x, M, B, k], C = T.slice();
    for (S = 0; S < p.length; S++)
      e(p[S], T) || C.push(p[S]);
    return b(C);
  }
  function v(p, x) {
    var M = {
      p,
      prev: null,
      next: null,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };
    return x ? (M.next = x.next, M.prev = x, x.next.prev = M, x.next = M) : (M.prev = M, M.next = M), M;
  }
  function d(p, x) {
    var M = p[0] - x[0], B = p[1] - x[1];
    return M * M + B * B;
  }
  function _(p, x, M) {
    var B = x[0], k = x[1], S = M[0] - B, O = M[1] - k;
    if (S !== 0 || O !== 0) {
      var T = ((p[0] - B) * S + (p[1] - k) * O) / (S * S + O * O);
      T > 1 ? (B = M[0], k = M[1]) : T > 0 && (B += S * T, k += O * T);
    }
    return S = p[0] - B, O = p[1] - k, S * S + O * O;
  }
  function I(p, x, M, B, k, S, O, T) {
    var C = M - p, X = B - x, w = O - k, A = T - S, E = p - k, N = x - S, D = C * C + X * X, $ = C * w + X * A, y = w * w + A * A, F = C * E + X * N, P = w * E + A * N, R = D * y - $ * $, q, Y, j, V, H = R, G = R;
    R === 0 ? (Y = 0, H = 1, V = P, G = y) : (Y = $ * P - y * F, V = D * P - $ * F, Y < 0 ? (Y = 0, V = P, G = y) : Y > H && (Y = H, V = P + $, G = y)), V < 0 ? (V = 0, -F < 0 ? Y = 0 : -F > D ? Y = H : (Y = -F, H = D)) : V > G && (V = G, -F + $ < 0 ? Y = 0 : -F + $ > D ? Y = H : (Y = -F + $, H = D)), q = Y === 0 ? 0 : Y / H, j = V === 0 ? 0 : V / G;
    var W = (1 - q) * p + q * M, J = (1 - q) * x + q * B, Z = (1 - j) * k + j * O, Q = (1 - j) * S + j * T, at = Z - W, ft = Q - J;
    return at * at + ft * ft;
  }
  function m(p, x) {
    return p[0] === x[0] ? p[1] - x[1] : p[0] - x[0];
  }
  function b(p) {
    p.sort(m);
    for (var x = [], M = 0; M < p.length; M++) {
      for (; x.length >= 2 && h(x[x.length - 2], x[x.length - 1], p[M]) <= 0; )
        x.pop();
      x.push(p[M]);
    }
    for (var B = [], k = p.length - 1; k >= 0; k--) {
      for (; B.length >= 2 && h(B[B.length - 2], B[B.length - 1], p[k]) <= 0; )
        B.pop();
      B.push(p[k]);
    }
    return B.pop(), x.pop(), x.concat(B);
  }
  return he.exports;
}
var Ni = Fi();
const Di = /* @__PURE__ */ xi(Ni);
function cn(r, t = {}) {
  t.concavity = t.concavity || 1 / 0;
  const e = [];
  if ($e(r, (o) => {
    e.push([o[0], o[1]]);
  }), !e.length)
    return null;
  const n = Di(e, t.concavity);
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
  static from(t, e = Ri, n = Yi) {
    const o = t.length, s = new Float64Array(o * 2);
    for (let i = 0; i < o; i++) {
      const a = t[i];
      s[2 * i] = e(a), s[2 * i + 1] = n(a);
    }
    return new Xe(s);
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
    let a = 1 / 0, l = 1 / 0, c = -1 / 0, h = -1 / 0;
    for (let S = 0; S < i; S++) {
      const O = t[2 * S], T = t[2 * S + 1];
      O < a && (a = O), T < l && (l = T), O > c && (c = O), T > h && (h = T), this._ids[S] = S;
    }
    const f = (a + c) / 2, u = (l + h) / 2;
    let g = 0, v = 0, d = 0;
    for (let S = 0, O = 1 / 0; S < i; S++) {
      const T = Ne(f, u, t[2 * S], t[2 * S + 1]);
      T < O && (g = S, O = T);
    }
    const _ = t[2 * g], I = t[2 * g + 1];
    for (let S = 0, O = 1 / 0; S < i; S++) {
      if (S === g) continue;
      const T = Ne(_, I, t[2 * S], t[2 * S + 1]);
      T < O && T > 0 && (v = S, O = T);
    }
    let m = t[2 * v], b = t[2 * v + 1], p = 1 / 0;
    for (let S = 0; S < i; S++) {
      if (S === g || S === v) continue;
      const O = Pi(_, I, m, b, t[2 * S], t[2 * S + 1]);
      O < p && (d = S, p = O);
    }
    let x = t[2 * d], M = t[2 * d + 1];
    if (p === 1 / 0) {
      for (let T = 0; T < i; T++)
        this._dists[T] = t[2 * T] - t[0] || t[2 * T + 1] - t[1];
      Vt(this._ids, this._dists, 0, i - 1);
      const S = new Uint32Array(i);
      let O = 0;
      for (let T = 0, C = -1 / 0; T < i; T++) {
        const X = this._ids[T], w = this._dists[X];
        w > C && (S[O++] = X, C = w);
      }
      this.hull = S.subarray(0, O), this.triangles = new Uint32Array(0), this.halfedges = new Int32Array(0);
      return;
    }
    if (dt(_, I, m, b, x, M) < 0) {
      const S = v, O = m, T = b;
      v = d, m = x, b = M, d = S, x = O, M = T;
    }
    const B = Xi(_, I, m, b, x, M);
    this._cx = B.x, this._cy = B.y;
    for (let S = 0; S < i; S++)
      this._dists[S] = Ne(t[2 * S], t[2 * S + 1], B.x, B.y);
    Vt(this._ids, this._dists, 0, i - 1), this._hullStart = g;
    let k = 3;
    n[g] = e[d] = v, n[v] = e[g] = d, n[d] = e[v] = g, o[g] = 0, o[v] = 1, o[d] = 2, s.fill(-1), s[this._hashKey(_, I)] = g, s[this._hashKey(m, b)] = v, s[this._hashKey(x, M)] = d, this.trianglesLen = 0, this._addTriangle(g, v, d, -1, -1, -1);
    for (let S = 0, O = 0, T = 0; S < this._ids.length; S++) {
      const C = this._ids[S], X = t[2 * C], w = t[2 * C + 1];
      if (S > 0 && Math.abs(X - O) <= ln && Math.abs(w - T) <= ln || (O = X, T = w, C === g || C === v || C === d)) continue;
      let A = 0;
      for (let y = 0, F = this._hashKey(X, w); y < this._hashSize && (A = s[(F + y) % this._hashSize], !(A !== -1 && A !== n[A])); y++)
        ;
      A = e[A];
      let E = A, N;
      for (; N = n[E], dt(X, w, t[2 * E], t[2 * E + 1], t[2 * N], t[2 * N + 1]) >= 0; )
        if (E = N, E === A) {
          E = -1;
          break;
        }
      if (E === -1) continue;
      let D = this._addTriangle(E, C, n[E], -1, -1, o[E]);
      o[C] = this._legalize(D + 2), o[E] = D, k++;
      let $ = n[E];
      for (; N = n[$], dt(X, w, t[2 * $], t[2 * $ + 1], t[2 * N], t[2 * N + 1]) < 0; )
        D = this._addTriangle($, C, N, o[C], -1, o[$]), o[C] = this._legalize(D + 2), n[$] = $, k--, $ = N;
      if (E === A)
        for (; N = e[E], dt(X, w, t[2 * N], t[2 * N + 1], t[2 * E], t[2 * E + 1]) < 0; )
          D = this._addTriangle(N, C, E, -1, o[E], o[N]), this._legalize(D + 2), o[N] = D, n[E] = E, k--, E = N;
      this._hullStart = e[C] = E, n[E] = e[$] = C, n[C] = $, s[this._hashKey(X, w)] = C, s[this._hashKey(t[2 * E], t[2 * E + 1])] = E;
    }
    this.hull = new Uint32Array(k);
    for (let S = 0, O = this._hullStart; S < k; S++)
      this.hull[S] = O, O = n[O];
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
    return Math.floor(Ci(t - this._cx, e - this._cy) * this._hashSize) % this._hashSize;
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
        t = ue[--s];
        continue;
      }
      const c = a - a % 3, h = l + (t + 1) % 3, f = c + (a + 2) % 3, u = e[i], g = e[t], v = e[h], d = e[f];
      if ($i(
        o[2 * u],
        o[2 * u + 1],
        o[2 * g],
        o[2 * g + 1],
        o[2 * v],
        o[2 * v + 1],
        o[2 * d],
        o[2 * d + 1]
      )) {
        e[t] = d, e[a] = u;
        const I = n[f];
        if (I === -1) {
          let b = this._hullStart;
          do {
            if (this._hullTri[b] === f) {
              this._hullTri[b] = t;
              break;
            }
            b = this._hullPrev[b];
          } while (b !== this._hullStart);
        }
        this._link(t, I), this._link(a, n[i]), this._link(i, f);
        const m = c + (a + 1) % 3;
        s < ue.length && (ue[s++] = m);
      } else {
        if (s === 0) break;
        t = ue[--s];
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
function Ci(r, t) {
  const e = r / (Math.abs(r) + Math.abs(t));
  return (t > 0 ? 3 - e : 1 + e) / 4;
}
function Ne(r, t, e, n) {
  const o = r - e, s = t - n;
  return o * o + s * s;
}
function $i(r, t, e, n, o, s, i, a) {
  const l = r - i, c = t - a, h = e - i, f = n - a, u = o - i, g = s - a, v = l * l + c * c, d = h * h + f * f, _ = u * u + g * g;
  return l * (f * _ - d * g) - c * (h * _ - d * u) + v * (h * g - f * u) < 0;
}
function Pi(r, t, e, n, o, s) {
  const i = e - r, a = n - t, l = o - r, c = s - t, h = i * i + a * a, f = l * l + c * c, u = 0.5 / (i * c - a * l), g = (c * h - a * f) * u, v = (i * f - l * h) * u;
  return g * g + v * v;
}
function Xi(r, t, e, n, o, s) {
  const i = e - r, a = n - t, l = o - r, c = s - t, h = i * i + a * a, f = l * l + c * c, u = 0.5 / (i * c - a * l), g = r + (c * h - a * f) * u, v = t + (i * f - l * h) * u;
  return { x: g, y: v };
}
function Vt(r, t, e, n) {
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
    r[e + 1] = r[i], r[i] = a, n - s + 1 >= i - e ? (Vt(r, t, s, n), Vt(r, t, e, i - 1)) : (Vt(r, t, e, i - 1), Vt(r, t, s, n));
  }
}
function Gt(r, t, e) {
  const n = r[t];
  r[t] = r[e], r[e] = n;
}
function Ri(r) {
  return r[0];
}
function Yi(r) {
  return r[1];
}
class Li {
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
class fn extends Li {
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
function hn(r, t, e, n, o, s, i, a) {
  const l = dt(r, t, o, s, i, a), c = dt(e, n, o, s, i, a);
  if (l > 0 && c > 0 || l < 0 && c < 0)
    return !1;
  const h = dt(o, s, r, t, e, n), f = dt(i, a, r, t, e, n);
  return h > 0 && f > 0 || h < 0 && f < 0 ? !1 : l === 0 && c === 0 && h === 0 && f === 0 ? !(Math.max(o, i) < Math.min(r, e) || Math.max(r, e) < Math.min(o, i) || Math.max(s, a) < Math.min(t, n) || Math.max(t, n) < Math.min(s, a)) : !0;
}
class qi {
  /**
   * The triangulation object from Delaunator.
   */
  del;
  constructor(t) {
    this.del = t;
  }
}
class Zt extends qi {
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
    this.vertMap = new Uint32Array(o).fill(n), this.flips = new fn(s), this.consd = new fn(s);
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
    const s = this.vertMap[t], i = this.maxConstrainSteps();
    let a = 0, l = s;
    do {
      if (++a > i)
        throw new Error(
          `Constraining edge [${t}, ${e}] exceeded the iteration limit`
        );
      const f = n[l], u = At(l);
      if (f === e)
        return this.protect(l);
      const g = _t(l), v = n[g];
      if (v === e)
        return this.protect(u), u;
      if (this.intersectSegments(t, e, v, f)) {
        l = g;
        break;
      }
      l = o[u];
    } while (l !== -1 && l !== s);
    let c = l, h = -1;
    for (; l !== -1; ) {
      if (++a > i)
        throw new Error(
          `Constraining edge [${t}, ${e}] exceeded the iteration limit`
        );
      const f = o[l], u = _t(l), g = _t(f), v = At(f);
      if (f === -1)
        throw new Error("Constraining edge exited the hull");
      if (this.consd.has(l))
        throw new Error("Edge intersects already constrained edge");
      if (this.isCollinear(t, e, n[l]) || this.isCollinear(t, e, n[f]))
        throw new Error("Constraining edge intersects point");
      if (!this.intersectSegments(
        n[l],
        n[f],
        n[u],
        n[g]
      )) {
        if (h === -1 && (h = l), n[g] === e) {
          if (l === h)
            throw new Error("Infinite loop: non-convex quadrilateral");
          l = h, h = -1;
          continue;
        }
        if (this.intersectSegments(
          t,
          e,
          n[g],
          n[f]
        ))
          l = g;
        else if (this.intersectSegments(
          t,
          e,
          n[v],
          n[g]
        ))
          l = v;
        else if (h === l)
          throw new Error("Infinite loop: no further intersect after non-convex");
        continue;
      }
      if (this.flipDiagonal(l), this.intersectSegments(
        t,
        e,
        n[u],
        n[g]
      ) && (h === -1 && (h = u), h === u))
        throw new Error("Infinite loop: flipped diagonal still intersects");
      n[g] === e ? (c = g, l = h, h = -1) : this.intersectSegments(
        t,
        e,
        n[v],
        n[g]
      ) && (l = v);
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
    const { triangles: n, halfedges: o } = this.del, s = n.length / 3, i = (v, d, _) => {
      const I = t(d), m = t(_);
      return t(v).some((b) => I.includes(b) && m.includes(b));
    }, a = (v) => i(n[v * 3], n[v * 3 + 1], n[v * 3 + 2]), l = (v, d, _, I) => Math.sign(dt(v[d * 2], v[d * 2 + 1], v[_ * 2], v[_ * 2 + 1], v[I * 2], v[I * 2 + 1])), c = e.map((v) => {
      let d = 0;
      for (let _ = 0; _ < s; _++) d += l(v, n[_ * 3], n[_ * 3 + 1], n[_ * 3 + 2]);
      return d < 0 ? -1 : 1;
    }), h = (v) => {
      if (this.consd.has(v)) return !1;
      const d = o[v];
      if (d === -1) return !1;
      const _ = n[v], I = n[At(v)], m = n[_t(v)], b = n[_t(d)];
      return e.every((p, x) => l(p, m, _, b) === c[x] && l(p, b, I, m) === c[x]);
    };
    let f = 0, u = !0;
    for (; u; ) {
      u = !1;
      for (let v = 0; v < s; v++)
        if (a(v))
          for (let d = 0; d < 3; d++) {
            const _ = v * 3 + d;
            if (!h(_)) continue;
            const I = o[_], m = n[_], b = n[At(_)], p = n[_t(_)], x = n[_t(I)];
            if (!(i(p, m, x) && i(x, b, p))) {
              this.protect(this.flipDiagonal(_)), f++, u = !0;
              break;
            }
          }
    }
    let g = 0;
    for (let v = 0; v < s; v++) a(v) && g++;
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
    const { triangles: e, halfedges: n } = this.del, o = this.flips, s = this.consd, i = n[t], a = _t(t), l = At(t), c = _t(i), h = At(i), f = n[a], u = n[c];
    if (s.has(t))
      throw new Error("Trying to flip a constrained edge");
    return e[t] = e[c], n[t] = u, o.set(t, o.has(c)) || s.set(t, s.has(c)), u !== -1 && (n[u] = t), n[a] = c, e[i] = e[a], n[i] = f, o.set(i, o.has(a)) || s.set(i, s.has(a)), f !== -1 && (n[f] = i), n[c] = a, this.markFlip(t), this.markFlip(l), this.markFlip(i), this.markFlip(h), o.add(a), s.delete(a), o.add(c), s.delete(c), this.updateVert(t), this.updateVert(l), this.updateVert(i), this.updateVert(h), a;
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
    const s = this.del.coords;
    return ii(
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
    const s = e[_t(t)], i = e[t], a = e[At(t)], l = e[_t(o)];
    return !this.inCircle(s, i, a, l);
  }
  /**
   * Update the vertex -> incoming edge map.
   */
  updateVert(t) {
    const { triangles: e, halfedges: n } = this.del, o = this.vertMap, s = e[t];
    let i = _t(t), a = n[i];
    for (; a !== -1 && a !== t; )
      i = _t(a), a = n[i];
    return o[s] = i, i;
  }
  /**
   * Whether the segments between vertices intersect.
   */
  intersectSegments(t, e, n, o) {
    const s = this.del.coords;
    return t === n || t === o || e === n || e === o ? !1 : hn(
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
  static intersectSegments = hn;
}
function de(r, t, e) {
  return De(r, t, e).tin;
}
function De(r, t, e, n, o) {
  if (t || (t = []), typeof r != "object" || r.type !== "FeatureCollection")
    throw "Argument points must be FeatureCollection";
  if (!Array.isArray(t)) throw "Argument points must be Array of Array";
  const s = r.features.map(
    (d) => d.geometry.coordinates
  );
  let i = o?.snapshot ? Zt.restore(o.snapshot) : void 0;
  const a = i ? void 0 : Xe.from(s);
  let l = i ? i.del : a, c = 0, h;
  const f = [];
  if (l.triangles.length !== 0 && (t.length !== 0 || n)) {
    if (!i) {
      i = new Zt(l);
      try {
        i.constrainAll(t);
      } catch (I) {
        if (!n?.allowUnusableBoundary) throw I;
        return { tin: xt([]), remaining: 0, hasBoundary: !1, hull: [] };
      }
      o && (o.snapshot = i.snapshot());
    }
    const d = n ? o?.snapshot ?? i.snapshot() : void 0, _ = (I) => {
      const m = Zt.restore(d);
      return m.constrainAll(I), m;
    };
    for (const I of n?.hull ?? [])
      try {
        i.constrainOne(I[0], I[1]), f.push(I);
      } catch {
        i = _(f);
      }
    n?.boundary && (h = Vi(i, n.boundary), h || (i = _(f))), n && ({ remaining: c } = i.forbidGroupTriangles(
      n.groupsOf,
      n.planes
    ), c -= h?.size ?? 0), l = i.del;
  }
  const u = [];
  for (let d = 0; d < l.triangles.length; d += 3)
    h?.has(d / 3) || u.push([l.triangles[d], l.triangles[d + 1], l.triangles[d + 2]]);
  const g = ["a", "b", "c"];
  return { tin: xt(
    u.map((d) => {
      const _ = {}, I = d.map((m, b) => {
        const p = r.features[m], x = p.geometry.coordinates, M = [x[0], x[1]];
        return x.length === 3 ? M[2] = x[2] : _[g[b]] = p.properties[e], M;
      });
      return I[3] = I[0], ie([I], _);
    })
  ), remaining: c, hasBoundary: h !== void 0, hull: f };
}
function Vi(r, t) {
  try {
    r.constrainAll(t);
  } catch {
    return;
  }
  const e = new Map(t), { triangles: n, halfedges: o } = r.del, s = (c) => {
    const h = n[c], f = n[At(c)];
    return e.get(h) === f || e.get(f) === h;
  }, i = /* @__PURE__ */ new Set(), a = [], l = (c) => {
    const h = Math.floor(c / 3);
    i.has(h) || (i.add(h), a.push(h));
  };
  for (let c = 0; c < o.length; c++)
    o[c] === -1 && !s(c) && l(c);
  for (let c = 0; c < a.length; c++)
    for (let h = a[c] * 3; h < a[c] * 3 + 3; h++) {
      if (!e.has(n[h])) return;
      o[h] !== -1 && !s(h) && l(o[h]);
    }
  return i;
}
function un(r) {
  const t = /* @__PURE__ */ new Set(), e = [];
  if (r.forEach(([l, c], h) => {
    const f = `${l}:${c}`;
    t.has(f) || (t.add(f), e.push({ i: h, x: l, y: c }));
  }), e.length < 3) return [];
  const n = (l, c, h) => dt(l.x, l.y, c.x, c.y, h.x, h.y), o = [...e].sort((l, c) => l.x - c.x || l.y - c.y), s = (l) => {
    const c = [];
    for (const h of l) {
      for (; c.length >= 2 && n(c[c.length - 2], c[c.length - 1], h) <= 0; ) c.pop();
      c.push(h);
    }
    return c.pop(), c;
  }, i = [...s(o), ...s([...o].reverse())];
  if (i.length < 3) return [];
  const a = [];
  for (let l = 0; l < i.length; l++) {
    const c = i[l], h = i[(l + 1) % i.length], f = h.x - c.x, u = h.y - c.y, g = f * f + u * u, v = e.filter((_) => _ !== c && _ !== h && n(c, h, _) === 0).map((_) => ({ r: _, t: ((_.x - c.x) * f + (_.y - c.y) * u) / g })).filter(({ t: _ }) => _ > 0 && _ < 1).sort((_, I) => _.t - I.t).map(({ r: _ }) => _), d = [c, ...v, h];
    for (let _ = 0; _ + 1 < d.length; _++) a.push([d[_].i, d[_ + 1].i]);
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
  return Array.from({ length: e }, (o, s) => s).map((o) => {
    const s = (o + 1) % e, i = r[o], a = r[s], l = i.geometry.coordinates, c = Math.atan2(
      l[0] - n[0],
      l[1] - n[1]
    ), h = [t, i, a, t].map(
      (g) => g.geometry.coordinates
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
    }, u = xt([
      ie([h], f)
    ]);
    return [c, u];
  }).reduce(
    (o, s) => (o[0].push(s[0]), o[1].push(s[1]), o),
    [[], []]
  );
}
const ji = [0.1, 0.15, 0.225, 0.34, 0.5];
function Ui(r, t) {
  return t ? r.hasBoundary !== t.hasBoundary ? r.hasBoundary : r.diagnostics.boundaryTriangleFlips < t.diagnostics.boundaryTriangleFlips : !0;
}
function pn(r, t, e) {
  return Math.sign(dt(r[0], r[1], t[0], t[1], e[0], e[1]));
}
function ve(r, t = -1) {
  let e = 0;
  for (const n of r.features) {
    const { a: o, b: s, c: i } = n.properties;
    if (![o, s, i].some(
      ({ index: f }) => typeof f == "string" && f.startsWith("b")
    ))
      continue;
    const [a, l, c] = n.geometry.coordinates[0];
    pn(a, l, c) * pn(o.geom, s.geom, i.geom) * t <= 0 && e++;
  }
  return e;
}
function mn(r, t, e) {
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
function gn(r, t, e, n, o, s = /* @__PURE__ */ new Set(), i) {
  const { minx: a, maxx: l, miny: c, maxy: h, centroid: f } = r, u = l - a, g = h - c, v = e.forw.length, d = Array.from({ length: v }, () => []);
  let _ = 1;
  for (const [B, k] of e.edges)
    B < n && d[B].push(_), d[k].push(_), k < n && _++;
  const I = (B) => B.slice(0, v).map(({ geometry: k }) => k.coordinates), m = un(I(e.forw)), b = {
    forw: m.filter((B) => !s.has(ye(B))),
    bakw: un(I(e.bakw))
  }, p = [0], x = (B) => B >= v ? p : d[B];
  let M;
  for (const B of ji) {
    const k = i?.get(B) ?? { forwReuse: {} };
    i?.set(B, k);
    const S = k.vertices ?? (k.vertices = t(
      {
        ...r,
        minx: a - B * u,
        maxx: l + B * u,
        miny: c - B * g,
        maxy: h + B * g
      },
      !0
    ));
    if (o && (S.length < 4 || !S.every(({ bakw: Y }) => Y.every(Number.isFinite)))) continue;
    const O = S.map(
      ({ forw: Y, bakw: j }, V) => Kt(Y, j, `b${V}`)
    ), T = xt([...e.forw, ...O]), C = xt([
      ...e.bakw,
      ...O.map(Wt)
    ]), X = [T, C].map(
      ({ features: Y }) => Float64Array.from(
        Y.flatMap(
          ({
            geometry: {
              coordinates: [j, V]
            }
          }) => [j, V]
        )
      )
    ), A = o !== void 0 || mn(
      S.map((Y) => Y.forw),
      f.forw,
      -1
    ) && mn(
      S.map((Y) => Y.bakw),
      f.bakw,
      1
    ) ? S.map((Y, j) => [
      v + j,
      v + (j + 1) % S.length
    ]) : void 0, E = { groupsOf: x, planes: X, boundary: A, allowUnusableBoundary: o !== void 0 }, N = o?.orientation ?? -1, D = De(
      T,
      e.edges,
      "target",
      { ...E, hull: b.forw },
      k.forwReuse
    ), $ = k.geographic ?? (k.geographic = (() => {
      const Y = De(C, e.edges, "target", {
        ...E,
        hull: b.bakw
      });
      return { built: Y, flips: ve(Y.tin, N) };
    })()), y = $.built, F = D.tin, P = {
      ...y.tin,
      features: [...y.tin.features]
    }, R = ve(F, N) + $.flips, q = {
      vertices: S,
      forw: F,
      bakw: P,
      diagnostics: {
        margin: B,
        boundaryTriangleFlips: R,
        remainingForbiddenTriangles: D.remaining + y.remaining
      },
      hasMapBoundary: D.hasBoundary,
      hasBoundary: D.hasBoundary && y.hasBoundary,
      forwHull: { all: m, applied: D.hull }
    };
    if (o) {
      if (o.accept(q)) return q;
      continue;
    }
    if (R === 0 && q.hasBoundary)
      return q;
    Ui(q, M) && (M = q);
  }
  return M;
}
const wn = 1e-9;
function zi(r, t) {
  const e = [[], [], [], []], n = [];
  return Object.keys(r).forEach((o) => {
    const s = r[o], i = s.forw, a = s.bakw, l = [
      i[0] - t.forw[0],
      i[1] - t.forw[1]
    ], c = [
      a[0] - t.bakw[0],
      t.bakw[1] - a[1]
    ], h = { forw: l, bakw: c };
    if (n.push(h), l[0] === 0 || l[1] === 0)
      return;
    let f = 0;
    l[0] > 0 && (f += 1), l[1] > 0 && (f += 2), e[f].push(h);
  }), { perQuad: e, aggregate: n };
}
function Dn(r) {
  let t = 1 / 0, e = 0, n = 0;
  return r.forEach((o) => {
    const { forw: s, bakw: i } = o, a = Math.hypot(s[0], s[1]), l = Math.hypot(i[0], i[1]);
    if (l === 0) return;
    const c = a / l, h = Math.atan2(s[0], s[1]) - Math.atan2(i[0], i[1]);
    t = Math.min(t, c), e += Math.cos(h), n += Math.sin(h);
  }), isFinite(t) ? [t, Math.atan2(n, e)] : [1, 0];
}
const Gi = 0.6, Hi = 3, Ki = 0.5;
function Wi(r) {
  let t = 0, e = 0, n = 0, o = 0;
  if (r.forEach(({ forw: i, bakw: a }) => {
    t += i[1] * a[1] + i[0] * a[0], e += i[0] * a[1] - i[1] * a[0], n += a[0] * a[0] + a[1] * a[1], o += i[0] * i[0] + i[1] * i[1];
  }), !(!(n > 0 && o > 0) || !(Math.hypot(t, e) / Math.sqrt(o * n) >= Ki)))
    return [Math.hypot(t, e) / n, Math.atan2(e, t)];
}
function Ji(r) {
  const t = (o) => Math.hypot(o.forw[0], o.forw[1]), e = Math.max(...r.map(t)), n = r.filter((o) => t(o) >= Gi * e);
  return Wi(n.length >= Hi ? n : r) ?? Dn(r);
}
function Qi(r, t, e, n) {
  const { perQuad: o, aggregate: s } = zi(r, t), i = o.every((h) => h.length > 0), a = e === "birdeye" ? i ? o : [s] : [s], l = n === "farLsq" ? Ji : Dn, c = a.map((h) => l(h));
  return c.length === 1 ? [c[0], c[0], c[0], c[0]] : c;
}
function Zi(r, t) {
  let e = 0;
  return r[0] > t[0] && (e += 1), r[1] > t[1] && (e += 2), e;
}
function tr(r, t, e) {
  const n = [
    r[0] - t.forw[0],
    r[1] - t.forw[1]
  ], s = Math.sqrt(n[0] ** 2 + n[1] ** 2) / e[0], i = Math.atan2(n[0], n[1]) - e[1];
  return [
    t.bakw[0] + s * Math.sin(i),
    t.bakw[1] - s * Math.cos(i)
  ];
}
function er(r, t, e, n) {
  const o = t[0] - r[0], s = t[1] - r[1];
  if (Math.abs(o) < 1e-12 && Math.abs(s) < 1e-12) return null;
  const i = n[0] - e[0], a = n[1] - e[1], l = e[0] - r[0], c = e[1] - r[1], h = o * a - s * i;
  if (Math.abs(h) < 1e-12) return null;
  const f = (l * a - c * i) / h, u = (l * s - c * o) / h;
  return f <= 1e-10 || u < -1e-10 || u > 1 + 1e-10 ? null : { t: f, point: [r[0] + f * o, r[1] + f * s] };
}
function nr(r, t, e) {
  const n = e.length;
  let o = -1 / 0, s = null;
  for (let i = 0; i < n; i++) {
    const a = (i + 1) % n, l = er(
      r,
      t,
      e[i].bakw,
      e[a].bakw
    );
    l && l.t > o && (o = l.t, s = l.point);
  }
  return s;
}
function yn(r, t) {
  const n = Math.atan2(r[0] - t[0], r[1] - t[1]) * (180 / Math.PI);
  return n < 0 ? n + 360 : n;
}
function vn(r, t, e, n, o, s) {
  const i = t[0] - r[0], a = t[1] - r[1];
  if (i === 0 && a === 0) return null;
  const l = [];
  if (i !== 0)
    for (const h of [e, n]) {
      const f = (h - r[0]) / i;
      if (f > 0) {
        const u = r[1] + f * a;
        u >= o && u <= s && l.push({ t: f, x: h, y: u });
      }
    }
  if (a !== 0)
    for (const h of [o, s]) {
      const f = (h - r[1]) / a;
      if (f > 0) {
        const u = r[0] + f * i;
        u >= e && u <= n && l.push({ t: f, x: u, y: h });
      }
    }
  if (l.length === 0) return null;
  l.sort((h, f) => h.t - f.t);
  const c = l[0];
  return [c.x, c.y];
}
function bn(r, t, e) {
  const n = r.length, o = new Array(n).fill(1);
  for (const s of t)
    for (let i = 0; i < n; i++) {
      const a = (i + 1) % n, l = Ve([r[i].bakw, r[a].bakw]), c = Ve([e.bakw, s.bakw]), h = bi(l, c);
      if (h.features.length > 0 && h.features[0].geometry) {
        const f = h.features[0], u = Math.sqrt(
          Math.pow(s.bakw[0] - e.bakw[0], 2) + Math.pow(s.bakw[1] - e.bakw[1], 2)
        ), g = Math.sqrt(
          Math.pow(f.geometry.coordinates[0] - e.bakw[0], 2) + Math.pow(f.geometry.coordinates[1] - e.bakw[1], 2)
        ), v = u / g;
        v > o[i] && (o[i] = v), v > o[a] && (o[a] = v);
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
function Re(r, t, e, n, o) {
  const { convexBuf: s, centroid: i, allGcps: a, minx: l, maxx: c, miny: h, maxy: f } = r, u = o ? void 0 : Qi(s, i, t, n), v = [
    [l, h],
    [c, h],
    [c, f],
    [l, f]
  ].map((k) => ({
    forw: k,
    bakw: o ? o(k) : tr(
      k,
      i,
      u[Zi(k, i.forw)]
    )
  }));
  if (v.sort(
    (k, S) => Math.atan2(k.forw[0] - i.forw[0], k.forw[1] - i.forw[1]) - Math.atan2(S.forw[0] - i.forw[0], S.forw[1] - i.forw[1])
  ), o || bn(v, a, i), !e) return v;
  const d = 4, _ = v.map(
    (k) => Math.atan2(k.forw[0] - i.forw[0], k.forw[1] - i.forw[1])
  ), I = v.map(
    (k) => Math.atan2(
      k.bakw[0] - i.bakw[0],
      -(k.bakw[1] - i.bakw[1])
    )
  );
  function m(k) {
    for (let S = 0; S < d; S++) {
      const O = (S + 1) % d, T = _[S], C = S < d - 1 ? _[O] : _[O] + 2 * Math.PI;
      let X = k;
      for (; X < T; ) X += 2 * Math.PI;
      for (; X >= T + 2 * Math.PI; ) X -= 2 * Math.PI;
      if (X >= T && X < C)
        return { i: S, j: O, frac: (X - T) / (C - T) };
    }
    return { i: 0, j: 1, frac: 0 };
  }
  function b(k) {
    const { i: S, j: O, frac: T } = m(k), C = I[S];
    let w = I[O] - C;
    for (; w > Math.PI; ) w -= 2 * Math.PI;
    for (; w < -Math.PI; ) w += 2 * Math.PI;
    return C + T * w;
  }
  const p = new Set(
    v.map(
      (k) => Math.floor(yn(k.forw, i.forw) / 10) % 36
    )
  ), x = a.map((k) => ({
    forw: k.forw,
    bakw: k.bakw,
    angleDeg: yn(k.forw, i.forw),
    forwDist: Math.hypot(k.forw[0] - i.forw[0], k.forw[1] - i.forw[1])
  })), M = [];
  for (let k = 0; k < 36; k++) {
    if (p.has(k)) continue;
    const S = k * 10, O = x.filter((y) => {
      if (y.forwDist === 0) return !1;
      const F = ((y.angleDeg - S) % 360 + 360) % 360;
      return F < 10 + wn || F > 360 - wn;
    });
    let T = null;
    if (O.length > 0) {
      const y = O.reduce((F, P) => P.forwDist > F.forwDist ? P : F);
      T = vn(i.forw, y.forw, l, c, h, f);
    }
    if (!T) {
      const y = (S + 5) % 360 * (Math.PI / 180), F = [
        i.forw[0] + Math.sin(y),
        i.forw[1] + Math.cos(y)
      ];
      T = vn(i.forw, F, l, c, h, f);
    }
    if (!T) continue;
    const [C, X] = T, w = 1e-9 * Math.max(c - l, f - h);
    if ([...v, ...M].some(
      (y) => Math.abs(y.forw[0] - C) <= w && Math.abs(y.forw[1] - X) <= w
    )) continue;
    if (o) {
      M.push({ forw: T, bakw: o(T) });
      continue;
    }
    const A = [T[0] - i.forw[0], T[1] - i.forw[1]], E = Math.atan2(A[0], A[1]), N = b(E), D = [
      i.bakw[0] + Math.sin(N),
      i.bakw[1] - Math.cos(N)
    ], $ = nr(i.bakw, D, v);
    $ && M.push({ forw: T, bakw: $ });
  }
  const B = [...v, ...M];
  return B.sort(
    (k, S) => Math.atan2(k.forw[0] - i.forw[0], k.forw[1] - i.forw[1]) - Math.atan2(S.forw[0] - i.forw[0], S.forw[1] - i.forw[1])
  ), o || bn(B, a, i), B;
}
function ir(r, t = !1) {
  return Re(r, "plain", t, t ? "farLsq" : "min");
}
function rr(r, t = !1) {
  return Re(r, "birdeye", t, "min");
}
function sr(r, t) {
  const e = /* @__PURE__ */ new Set();
  return Re(r, "plain", !0, "min", t).filter(({ forw: [n, o] }) => {
    const s = `${n}:${o}`;
    return e.has(s) ? !1 : (e.add(s), !0);
  });
}
function jr(r) {
  return Cn(r, 1 / 0);
}
const xn = 1e5, or = 16;
function Cn(r, t) {
  return ar(r), new cr(r).findSegmentIntersections(t).map(
    (o) => Yt([o.x, o.y])
  );
}
function ar(r) {
  for (let t = 0, e = r.length; t < e; t++) {
    const n = r[t];
    ee(n) || Rt(
      "findIntersections() received invalid coordinates:",
      `line=${t}`,
      `points=${n}`
    );
    for (let o = 0, s = n.length; o < s; o++) {
      const i = n[o];
      (!ee(i) || !Number.isFinite(i[0]) || !Number.isFinite(i[1])) && Rt(
        "findIntersections() received non-finite coordinates:",
        `line=${t}`,
        `point=${o}`,
        `coordinates=${JSON.stringify(i)}`
      );
    }
  }
}
class cr {
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
    (s != this._xx.length || this._xx.length != this._yy.length) && Rt("ArcCollection#initXYData() Counting error"), this.initBounds(), this._arcIter = new Ir(this._xx, this._yy);
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
    const o = n.length, s = new Float64Array(o * 4), i = new ne();
    let a = 0, l, c, h;
    for (let f = 0; f < o; f++)
      l = n[f], l > 0 && (c = f * 4, h = Br(t, e, a, l), s[c++] = h[0], s[c++] = h[1], s[c++] = h[2], s[c] = h[3], a += l, i.mergeBounds(h));
    return {
      bb: s,
      bounds: i
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
    const n = t >= 0, o = n ? t : ~t, s = this.getRetainedInterval(), i = this._nn[o], a = n ? 1 : -1;
    let l = n ? this._ii[o] : this._ii[o] + i - 1, c = l, h = 0;
    for (let f = 1; f < i; f++)
      c += a, (s === 0 || this._zz[c] >= s) && (e(l, c, this._xx, this._yy), l = c, h++);
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
    const e = this.getBounds(), n = e.ymin || 0, o = (e.ymax || 0) - n, s = this.calcSegmentIntersectionStripeCount(), i = new Uint32Array(s), a = s > 1 ? (b) => Math.floor((s - 1) * (b - n) / o) : () => 0, l = s + 1;
    let c;
    this.forEachSegment(
      (b, p, x, M) => {
        let B = a(M[b]);
        const k = a(M[p]);
        let S = 0;
        for (; i[B] = i[B] + 2, B != k; )
          S++, S > l && Rt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${s}`,
            `s1=${B}`,
            `s2=${k}`
          ), B += k > B ? 1 : -1;
      }
    );
    const h = this.getUint32Array(hr(i));
    let f = 0;
    const u = [];
    ur(i, (b) => {
      const p = f;
      f += b, u.push(h.subarray(p, f));
    }), dr(i, 0), this.forEachSegment(
      (b, p, x, M) => {
        let B = a(M[b]);
        const k = a(M[p]);
        let S, O, T = 0;
        for (; S = i[B], i[B] = S + 2, O = u[B], O[S] = b, O[S + 1] = p, B != k; )
          T++, T > l && Rt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${s}`,
            `s1=${B}`,
            `s2=${k}`
          ), B += k > B ? 1 : -1;
      }
    );
    const g = this.getVertexData(), v = t * or;
    let d = 0;
    const _ = /* @__PURE__ */ new Set(), I = /* @__PURE__ */ new Map(), m = (b) => {
      d++;
      const p = Ar(b);
      return _.has(p) || (_.add(p), I.set(`${b.x}:${b.y}`, b)), I.size >= t || d >= v;
    };
    if (g.xx && g.yy)
      for (c = 0; c < s && !pr(u[c], g.xx, g.yy, m); c++)
        ;
    return Array.from(I.values());
  }
}
function Rt(...r) {
  const t = r.join(" ");
  throw new Error(t);
}
function ee(r) {
  return r ? fr(r) ? !0 : lr(r) ? !1 : r.length === 0 ? !0 : r.length > 0 : !1;
}
function lr(r) {
  return r != null && r.toString === String.prototype.toString;
}
function fr(r) {
  return Array.isArray(r);
}
function hr(r, t) {
  ee(r) || Rt("utils.sum() expects an array, received:", r);
  let e = 0, n;
  for (let o = 0, s = r.length; o < s; o++)
    n = r[o], n && (e += n);
  return e;
}
function ur(r, t, e) {
  if (!ee(r))
    throw new Error(`#forEach() takes an array-like argument. ${r}`);
  for (let n = 0, o = r.length; n < o; n++)
    t.call(e, r[n], n);
}
function dr(r, t) {
  for (let e = 0, n = r.length; e < n; e++)
    r[e] = t;
  return r;
}
function pr(r, t, e, n) {
  const o = r.length - 2;
  let s, i, a, l, c, h, f, u, g, v, d, _, I, m, b, p, x;
  for (Sr(t, r), p = 0; p < o; ) {
    for (s = r[p], i = r[p + 1], c = t[s], h = t[i], g = e[s], v = e[i], x = p; x < o && (x += 2, a = r[x], f = t[a], !(h < f)); ) {
      if (d = e[a], l = r[x + 1], u = t[l], _ = e[l], g >= d) {
        if (g > _ && v > d && v > _) continue;
      } else if (g < _ && v < d && v < _) continue;
      if (!(s == a || s == l || i == a || i == l) && (I = mr(
        c,
        g,
        h,
        v,
        f,
        d,
        u,
        _
      ), I && (m = [s, i], b = [a, l], n(Mn(I, m, b, t, e)) || I.length == 4 && n(Mn(I.slice(2), m, b, t, e)))))
        return !0;
    }
    p += 2;
  }
  return !1;
}
function mr(r, t, e, n, o, s, i, a) {
  const l = gr(r, t, e, n, o, s, i, a);
  let c = null;
  return l && (c = wr(r, t, e, n, o, s, i, a), c ? Mr(r, t, e, n, o, s, i, a) && (c = null) : c = _r(r, t, e, n, o, s, i, a)), c;
}
function gr(r, t, e, n, o, s, i, a) {
  return Jt(r, t, e, n, o, s) * Jt(r, t, e, n, i, a) <= 0 && Jt(o, s, i, a, r, t) * Jt(o, s, i, a, e, n) <= 0;
}
function Jt(r, t, e, n, o, s) {
  return $n(r - o, t - s, e - o, n - s);
}
function $n(r, t, e, n) {
  return r * n - t * e;
}
function wr(r, t, e, n, o, s, i, a) {
  let l = pe(r, t, e, n, o, s, i, a), c;
  return l && (c = vr(l[0], l[1], r, t, e, n, o, s, i, a), c == 1 ? l = pe(e, n, r, t, o, s, i, a) : c == 2 ? l = pe(o, s, i, a, r, t, e, n) : c == 3 && (l = pe(i, a, o, s, r, t, e, n))), l && xr(l, r, t, e, n, o, s, i, a), l;
}
function pe(r, t, e, n, o, s, i, a) {
  const l = $n(e - r, n - t, i - o, a - s), c = 1e-18;
  let h;
  if (l === 0) return null;
  const f = Jt(o, s, i, a, r, t) / l;
  return l <= c && l >= -c ? h = yr(r, t, e, n, o, s, i, a) : h = [r + f * (e - r), t + f * (n - t)], h;
}
function yr(r, t, e, n, o, s, i, a) {
  let l = null;
  return !It(r, o, i) && !It(t, s, a) ? l = [r, t] : !It(e, o, i) && !It(n, s, a) ? l = [e, n] : !It(o, r, e) && !It(s, t, n) ? l = [o, s] : !It(i, r, e) && !It(a, t, n) && (l = [i, a]), l;
}
function It(r, t, e) {
  let n;
  return t < e ? n = r < t || r > e : t > e ? n = r > t || r < e : n = r != t, n;
}
function vr(r, t, ...e) {
  let n = -1, o = 1 / 0, s;
  for (let i = 0, a = 0, l = e.length; a < l; i++, a += 2)
    s = br(r, t, e[a], e[a + 1]), s < o && (o = s, n = i);
  return n;
}
function br(r, t, e, n) {
  const o = r - e, s = t - n;
  return o * o + s * s;
}
function xr(r, t, e, n, o, s, i, a, l) {
  let c = r[0], h = r[1];
  c = me(c, t, n), c = me(c, s, a), h = me(h, e, o), h = me(h, i, l), r[0] = c, r[1] = h;
}
function me(r, t, e) {
  let n;
  return It(r, t, e) && (n = Math.abs(r - t) < Math.abs(r - e) ? t : e, r = n), r;
}
function _r(r, t, e, n, o, s, i, a) {
  const l = Math.min(r, e, o, i), c = Math.max(r, e, o, i), h = Math.min(t, n, s, a), f = Math.max(t, n, s, a), u = f - h > c - l;
  let g = [];
  return (u ? Ct(t, h, f) : Ct(r, l, c)) && g.push(r, t), (u ? Ct(n, h, f) : Ct(e, l, c)) && g.push(e, n), (u ? Ct(s, h, f) : Ct(o, l, c)) && g.push(o, s), (u ? Ct(a, h, f) : Ct(i, l, c)) && g.push(i, a), (g.length != 2 && g.length != 4 || g.length == 4 && g[0] == g[2] && g[1] == g[3]) && (g = null), g;
}
function Mr(r, t, e, n, o, s, i, a) {
  return r == o && t == s || r == i && t == a || e == o && n == s || e == i && n == a;
}
function Ct(r, t, e) {
  return r > t && r < e;
}
function Sr(r, t) {
  kr(r, t), Pn(r, t, 0, t.length - 2);
}
function kr(r, t) {
  for (let e = 0, n = t.length; e < n; e += 2)
    r[t[e]] > r[t[e + 1]] && Er(t, e, e + 1);
}
function Er(r, t, e) {
  const n = r[t];
  r[t] = r[e], r[e] = n;
}
function Pn(r, t, e, n) {
  let o = e, s = n, i, a;
  for (; o < n; ) {
    for (i = r[t[e + n >> 2 << 1]]; o <= s; ) {
      for (; r[t[o]] < i; ) o += 2;
      for (; r[t[s]] > i; ) s -= 2;
      o <= s && (a = t[o], t[o] = t[s], t[s] = a, a = t[o + 1], t[o + 1] = t[s + 1], t[s + 1] = a, o += 2, s -= 2);
    }
    if (s - e < 40 ? _n(r, t, e, s) : Pn(r, t, e, s), n - o < 40) {
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
function Mn(r, t, e, n, o) {
  const s = r[0], i = r[1];
  t = Sn(s, i, t[0], t[1], n, o), e = Sn(s, i, e[0], e[1], n, o);
  const a = t[0] < e[0] ? t : e, l = a == t ? e : t;
  return { x: s, y: i, a, b: l };
}
function Sn(r, t, e, n, o, s) {
  let i = e < n ? e : n, a = i === e ? n : e;
  return o[i] == r && s[i] == t ? a = i : o[a] == r && s[a] == t && (i = a), [i, a];
}
function Ar(r) {
  return `${r.a.join(",")};${r.b.join(",")}`;
}
class Ir {
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
function Br(r, t, e, n) {
  let o = e | 0;
  const s = isNaN(n) ? r.length - o : n + o;
  let i, a, l, c, h, f;
  if (s > 0)
    l = h = r[o], c = f = t[o];
  else return [void 0, void 0, void 0, void 0];
  for (o++; o < s; o++)
    i = r[o], a = t[o], i < l && (l = i), i > h && (h = i), a < c && (c = a), a > f && (f = a);
  return [l, c, h, f];
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
    let s, i, a, l;
    if (arguments.length == 1)
      if (ee(t)) {
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
    return t instanceof ne ? (n = t.xmin, o = t.ymin, s = t.xmax, i = t.ymax) : e.length == 3 ? (n = t, o = e[0], s = e[1], i = e[2]) : t.length == 4 ? (n = t[0], o = t[1], s = t[2], i = t[3]) : Rt("Bounds#mergeBounds() invalid argument:", t), this.xmin === void 0 ? this.setBounds(n, o, s, i) : (n < this.xmin && (this.xmin = n), o < this.ymin && (this.ymin = o), s > this.xmax && (this.xmax = s), i > this.ymax && (this.ymax = i)), this;
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
function Xn(r, t, e) {
  const n = be(t.forw), o = be(t.bakw);
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
function kn(r, t, e) {
  const n = be(t.forw), o = be(t.bakw);
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
function ge(r, t = 1e-6) {
  const [e, n] = r[0], [o, s] = r[1], [i, a] = r[2];
  return Math.abs((o - e) * (a - n) - (i - e) * (s - n)) < t;
}
function Or(r, t) {
  const e = /* @__PURE__ */ new Set();
  return r.forEach((n) => {
    if (n.length !== 2) return;
    const o = n.map((s) => `${t?.[s] ?? s}`);
    e.add(o.sort().join("-"));
  }), e;
}
function Qt(r) {
  return ["a", "b", "c"].map((t, e) => ({
    prop: r.properties[t],
    geom: r.geometry.coordinates[0][e]
  }));
}
const Tr = 10;
function Fr(r, t, e, n, o, s) {
  if (!r && !t) return !1;
  const i = r ? 0 : 1, a = 1 - i, l = e[i], c = e[a];
  if (!l || !c) return !1;
  const h = bt(c.geom);
  let f = !1, u = !1;
  for (let g = 0; g <= 1; g++) {
    const v = n[g];
    if (!v) continue;
    const d = [String(v.prop.index), String(l.prop.index)].sort().join("-"), _ = o[d];
    if (!_ || _.length < 2) continue;
    const I = _.find(
      (T) => T.bakw !== s[i].bakw
    );
    if (!I) continue;
    const b = Qt(I.bakw).find(
      (T) => String(T.prop.index) !== String(v.prop.index) && String(T.prop.index) !== String(l.prop.index)
    );
    if (!b) continue;
    f = !0;
    const p = bt(b.geom), x = bt(v.geom), M = bt(l.geom), B = M[0] - x[0], k = M[1] - x[1], S = B * (h[1] - x[1]) - k * (h[0] - x[0]), O = B * (p[1] - x[1]) - k * (p[0] - x[0]);
    if (S * O > 0) {
      u = !0;
      break;
    }
  }
  return f && !u;
}
function Nr(r, t, e, n) {
  if (!r && !t) return !1;
  if (e[0] && e[1] && n[0] && n[1]) {
    const o = n.map((h) => bt(h.geom)), s = e.map((h) => bt(h.geom)), i = o[1][0] - o[0][0], a = o[1][1] - o[0][1], l = i * (s[0][1] - o[0][1]) - a * (s[0][0] - o[0][0]), c = i * (s[1][1] - o[0][1]) - a * (s[1][0] - o[0][0]);
    return l * c < 0;
  }
  return !1;
}
function Dr(r, t, e, n) {
  const o = Or(e, n), s = /* @__PURE__ */ new Set();
  let i = !1;
  for (let a = 0; a < Tr; a++) {
    let l = !1;
    for (const c of Object.keys(t)) {
      if (s.has(c)) continue;
      s.add(c);
      const h = t[c];
      if (!h || h.length < 2) continue;
      const f = c.split("-");
      if (f.length !== 2 || o.has(c)) continue;
      const u = Qt(h[0].bakw), g = Qt(h[1].bakw), v = Qt(h[0].forw), d = Qt(h[1].forw), _ = f.map(
        (y) => u.find((F) => `${F.prop.index}` === y) || g.find((F) => `${F.prop.index}` === y)
      ), I = f.map(
        (y) => v.find((F) => `${F.prop.index}` === y) || d.find((F) => `${F.prop.index}` === y)
      );
      if (_.some((y) => !y) || I.some((y) => !y))
        continue;
      const m = [u, g].map(
        (y) => y.find((F) => !f.includes(`${F.prop.index}`))
      ), b = [v, d].map(
        (y) => y.find((F) => !f.includes(`${F.prop.index}`))
      );
      if (m.some((y) => !y) || b.some((y) => !y))
        continue;
      const p = h[0].bakw.geometry.coordinates[0].slice(0, 3).map((y) => bt(y)), x = h[1].bakw.geometry.coordinates[0].slice(0, 3).map((y) => bt(y)), M = h[0].forw.geometry.coordinates[0].slice(0, 3).map((y) => bt(y)), B = h[1].forw.geometry.coordinates[0].slice(0, 3).map((y) => bt(y)), k = ge(p), S = ge(x), O = ge(M), T = ge(B), C = Fr(
        k,
        S,
        m,
        _,
        t,
        h
      ), X = Nr(
        O,
        T,
        m,
        _
      );
      if (!(C || X || En(
        bt(m[0].geom),
        x
      ) || En(
        bt(m[1].geom),
        p
      )))
        continue;
      const A = I.map(
        (y) => bt(y.geom)
      ), E = b.map(
        (y) => bt(y.geom)
      ), N = Cr([
        ...A,
        ...E
      ]), D = $r(N), $ = An(
        A[0],
        A[1],
        E[0]
      ) + An(
        A[0],
        A[1],
        E[1]
      );
      Ce(D, $) && (kn(t, h[0], r), kn(t, h[1], r), _.forEach((y) => {
        if (!y) return;
        const F = [
          y.geom,
          m[0].geom,
          m[1].geom,
          y.geom
        ], P = {
          a: y.prop,
          b: m[0].prop,
          c: m[1].prop
        }, R = ie([F], P), q = On(R);
        Xn(t, {
          forw: q,
          bakw: R
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
function En(r, t) {
  const [e, n] = t[0], [o, s] = t[1], [i, a] = t[2], l = i - e, c = a - n, h = o - e, f = s - n, u = r[0] - e, g = r[1] - n, v = l * l + c * c, d = l * h + c * f, _ = l * u + c * g, I = h * h + f * f, m = h * u + f * g, b = v * I - d * d;
  if (b === 0) return !1;
  const p = 1 / b, x = (I * _ - d * m) * p, M = (v * m - d * _) * p, B = 1e-9;
  return x >= -B && M >= -B && x + M <= 1 + B;
}
function Cr(r) {
  const t = r.map((i) => i.slice()).filter(
    (i, a, l) => l.findIndex(
      (c) => Ce(c[0], i[0]) && Ce(c[1], i[1])
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
function $r(r) {
  if (r.length < 3) return 0;
  let t = 0;
  for (let e = 0; e < r.length; e++) {
    const [n, o] = r[e], [s, i] = r[(e + 1) % r.length];
    t += n * i - s * o;
  }
  return Math.abs(t) / 2;
}
function An(r, t, e) {
  return Math.abs(
    (r[0] * (t[1] - e[1]) + t[0] * (e[1] - r[1]) + e[0] * (r[1] - t[1])) / 2
  );
}
function Ce(r, t, e = 1e-9) {
  return Math.abs(r - t) <= e;
}
const Pr = (r) => typeof r == "string" && r.startsWith("b");
function Xr(r, t) {
  const e = (n, o) => {
    for (let s = 0; s < 3; s++) {
      const i = n.g[s], a = n.g[(s + 1) % 3];
      if (o.g.every((l) => n.sign * dt(i[0], i[1], a[0], a[1], l[0], l[1]) <= 0)) return !0;
    }
    return !1;
  };
  return !e(r, t) && !e(t, r);
}
function Rr(r, t, e) {
  if (t.length === 0) return [];
  const n = r.features.map((d) => {
    const { a: _, b: I, c: m } = d.properties, b = [_.geom, I.geom, m.geom], [p, x, M] = d.geometry.coordinates[0], B = b.map(([T]) => T), k = b.map(([, T]) => T), S = Math.sign(dt(p[0], p[1], x[0], x[1], M[0], M[1])), O = Math.sign(dt(b[0][0], b[0][1], b[1][0], b[1][1], b[2][0], b[2][1]));
    return {
      ids: [_.index, I.index, m.index].map(String),
      g: b,
      sign: O,
      ratio: S * O,
      aux: [_.index, I.index, m.index].some(Pr),
      minx: Math.min(...B),
      maxx: Math.max(...B),
      miny: Math.min(...k),
      maxy: Math.max(...k)
    };
  }), o = n.map((d) => d.ratio), s = o.reduce((d, _) => d + _, 0) < 0 ? -1 : 1, i = (d, _) => d < _ ? `${d}|${_}` : `${_}|${d}`, a = /* @__PURE__ */ new Map();
  n.forEach((d, _) => {
    for (let I = 0; I < 3; I++) {
      const m = i(d.ids[I], d.ids[(I + 1) % 3]), b = a.get(m);
      b ? b.push(_) : a.set(m, [_]);
    }
  });
  const l = ([d, _]) => i(String(e[d]), String(e[_])), c = /* @__PURE__ */ new Set();
  for (const d of t) for (const _ of a.get(l(d)) ?? []) c.add(_);
  const h = (d) => n[d].aux || c.has(d), f = /* @__PURE__ */ new Set();
  n.forEach((d, _) => {
    h(_) && (o[_] === 0 || o[_] !== s) && f.add(_);
  });
  const u = n.map((d, _) => _).sort((d, _) => n[d].minx - n[_].minx);
  for (let d = 0; d < u.length; d++) {
    const _ = n[u[d]];
    if (_.sign !== 0)
      for (let I = d + 1; I < u.length; I++) {
        const m = n[u[I]];
        if (m.minx >= _.maxx) break;
        m.sign === 0 || m.miny >= _.maxy || _.miny >= m.maxy || !h(u[d]) && !h(u[I]) || Xr(_, m) && (f.add(u[d]), f.add(u[I]));
      }
  }
  if (f.size === 0) return [];
  const g = t.filter((d) => (a.get(l(d)) ?? []).some((_) => f.has(_)));
  if (g.length > 0) return g;
  const v = /* @__PURE__ */ new Set();
  for (const d of f) for (const _ of n[d].ids) _.startsWith("b") || v.add(_);
  return t.filter(
    ([d, _]) => v.has(String(e[d])) || v.has(String(e[_]))
  );
}
const In = 2.00704, Bn = 3.00001, Yr = 12, Lr = 24;
class ot extends Vn {
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
      jn(t.worldFile), this.requestedWorldFile = { ...t.worldFile };
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
    this.edges = Un(t), this.edgeNodes = void 0, this.tins = void 0, this.indexedTins = void 0;
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
    i.push(t[0]), this.boundsPolygon = ie([i]), this.xy = [e, o], this.wh = [n - e, s - o], this.vertexMode = ot.VERTEX_PLAIN, this.tins = void 0, this.indexedTins = void 0;
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
      (i) => On(i)
    );
    this.tins.bakw = xt(e);
    const n = {};
    this.tins.forw.features.forEach((i, a) => {
      const l = this.tins.bakw.features[a];
      Xn(n, { forw: i, bakw: l });
    });
    const o = (this.pointsSet?.forw.features ?? []).map(
      (i) => i.properties.target.index
    );
    Dr(
      this.tins,
      n,
      this.pointsSet?.edges || [],
      o
    );
    const s = ["forw", "bakw"].map((i) => {
      const a = this.tins[i].features.map(
        (l) => l.geometry.coordinates[0]
      );
      return Cn(a, t);
    });
    s[0].length === 0 && s[1].length === 0 ? (this.strict_status = ot.STATUS_STRICT, delete this.kinks) : (this.strict_status = ot.STATUS_ERROR, this.kinks = {
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
      const s = this.points[o][0], i = this.points[o][1], a = Kt(s, i, o);
      t.forw.push(a), t.bakw.push(Wt(a));
    }
    const e = [];
    let n = 0;
    this.edgeNodes = [], this.edges || (this.edges = []);
    for (let o = 0; o < this.edges.length; o++) {
      const s = this.edges[o][2], i = Object.assign([], this.edges[o][0]), a = Object.assign([], this.edges[o][1]);
      if (qr(s, this.points.length, o), i.length === 0 && a.length === 0) {
        e.push(s);
        continue;
      }
      i.unshift(this.points[s[0]][0]), i.push(this.points[s[1]][0]), a.unshift(this.points[s[0]][1]), a.push(this.points[s[1]][1]);
      const l = [i, a].map((c) => {
        const h = c.map((u, g, v) => {
          if (g === 0) return 0;
          const d = v[g - 1];
          return Math.sqrt(
            Math.pow(u[0] - d[0], 2) + Math.pow(u[1] - d[1], 2)
          );
        }), f = h.reduce((u, g, v) => v === 0 ? [0] : (u.push(u[v - 1] + g), u), []);
        return f.map((u, g, v) => {
          const d = u / v[v.length - 1];
          return [c[g], h[g], f[g], d];
        });
      });
      l.map((c, h) => {
        const f = l[h ? 0 : 1];
        return c.filter((u, g) => !(g === 0 || g === c.length - 1 || u[4] === "handled")).flatMap((u) => {
          const g = u[0], v = u[3], d = f.reduce(
            (_, I, m, b) => {
              if (_) return _;
              const p = b[m + 1];
              if (I[3] === v)
                return I[4] = "handled", [I];
              if (I[3] < v && p && p[3] > v)
                return [I, p];
            },
            void 0
          );
          if (d && d.length === 1)
            return h === 0 ? [[g, d[0][0], v]] : [[d[0][0], g, v]];
          if (d && d.length === 2) {
            const _ = d[0], I = d[1], m = (v - _[3]) / (I[3] - _[3]), b = [
              (I[0][0] - _[0][0]) * m + _[0][0],
              (I[0][1] - _[0][1]) * m + _[0][1]
            ];
            return h === 0 ? [[g, b, v]] : [[b, g, v]];
          }
          return [];
        });
      }).reduce((c, h) => c.concat(h), []).sort((c, h) => c[2] < h[2] ? -1 : 1).map((c, h, f) => {
        this.edgeNodes[n] = [
          c[0],
          c[1]
        ];
        const u = Kt(
          c[0],
          c[1],
          `e${n}`
        );
        n++, t.forw.push(u), t.bakw.push(Wt(u)), h === 0 ? e.push([s[0], t.forw.length - 1]) : e.push([
          t.forw.length - 2,
          t.forw.length - 1
        ]), h === f.length - 1 && e.push([t.forw.length - 1, s[1]]);
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
    if (!this.points.reduce((l, c) => l && (s ? He(c[0], s) : c[0][0] >= t && c[0][0] <= e && c[0][1] >= n && c[0][1] <= o), !0))
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
    this.lastBoundaryDiagnostics = void 0;
    let t = this.strictMode;
    t !== ot.MODE_STRICT && t !== ot.MODE_LOOSE && (t = ot.MODE_AUTO);
    const e = !this.useV2Algorithm, n = this.requestedWorldFile;
    if (n && !e) throw new Error("V2 では world file 外周を使えません");
    let o, s, i, a, l;
    if (e) {
      if (this.bounds) {
        const O = this.boundsPolygon;
        if (!O) throw new Error("Internal error: bounds is set but boundsPolygon is missing");
        if (!this.points.every(
          (C) => He(C[0], O)
        )) throw "SOME POINTS OUTSIDE";
      }
      o = this.generatePointsSet(), { minx: s, maxx: i, miny: a, maxy: l } = this.computeGcpBbox();
    } else {
      const O = this.validateAndPrepareInputs();
      o = O.pointsSet, s = O.minx, i = O.maxx, a = O.miny, l = O.maxy;
    }
    const c = {
      forw: xt(o.forw),
      bakw: xt(o.bakw)
    }, h = de(
      c.forw,
      o.edges,
      "target"
    ), f = de(
      c.bakw,
      o.edges,
      "target"
    );
    if (h.features.length === 0 || f.features.length === 0)
      throw "TOO LINEAR1";
    const u = Mi(c.forw), g = cn(c.forw);
    if (!g) throw "TOO LINEAR2";
    const v = {}, d = g.geometry.coordinates[0];
    let _;
    try {
      _ = d.map((O) => ({
        forw: O,
        bakw: _e(Yt(O), h)
      })), _.forEach((O) => {
        v[`${O.forw[0]}:${O.forw[1]}`] = O;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const I = cn(c.bakw);
    if (!I) throw "TOO LINEAR2";
    const m = I.geometry.coordinates[0];
    try {
      _ = m.map((O) => ({
        bakw: O,
        forw: _e(Yt(O), f)
      })), _.forEach((O) => {
        v[`${O.forw[0]}:${O.forw[1]}`] = O;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const b = {
      forw: u.geometry.coordinates,
      bakw: _e(u, h)
    }, p = Kt(b.forw, b.bakw, "c");
    this.centroid = {
      forw: p,
      bakw: Wt(p)
    };
    const x = [
      ...this.points.map((O) => ({ forw: O[0], bakw: O[1] })),
      ...(this.edgeNodes ?? []).map((O) => ({ forw: O[0], bakw: O[1] }))
    ], M = {
      convexBuf: v,
      centroid: b,
      allGcps: x,
      minx: s,
      maxx: i,
      miny: a,
      maxy: l
    };
    if (n) {
      this.stateTriangle = void 0;
      const O = this.yaxisMode === ot.YAXIS_FOLLOW, T = O ? 1 : -1, C = /* @__PURE__ */ new Map(), { boundary: X } = this.buildWithHull(t, (w) => ({ boundary: gn(
        M,
        (A) => sr(A, (E) => {
          const [N, D] = zn(n, E);
          return [N, O ? -D : D];
        }),
        o,
        this.points.length,
        {
          orientation: T,
          accept: (A) => A.hasMapBoundary ? (this.buildTin(o, A.vertices, t, A, w.size > 0), (this.strict_status !== ot.STATUS_LOOSE || A.hasBoundary) && ve(this.tins.forw, T) === 0 && ve(this.tins.bakw, T) === 0) : !1
        },
        w,
        C
      ) }));
      if (X) {
        this.compiledOuter = {
          outerTransform: "worldFile",
          worldFile: n,
          vertices_points: X.vertices.map(({ forw: D, bakw: $ }) => [D, $])
        };
        const { centroid: w, xy: A, wh: E, kinks: N } = this;
        super.setCompiled(this.getCompiled()), Object.assign(this, { centroid: w, xy: A, wh: E, kinks: N }), this.lastBoundaryDiagnostics = {
          ...X.diagnostics,
          requestedOuterTransform: "worldFile",
          outerTransform: "worldFile"
        };
        return;
      }
      this.compiledOuter = { outerTransform: "extrapolate" }, this.outerTransform = "extrapolate", this.worldFile = void 0;
    }
    const B = this.vertexMode === ot.VERTEX_BIRDEYE ? rr : ir;
    let k, S;
    if (e) {
      const O = /* @__PURE__ */ new Map();
      ({ boundary: k, verticesList: S } = this.buildWithHull(t, (T) => {
        const C = gn(
          M,
          B,
          o,
          this.points.length,
          void 0,
          T,
          O
        );
        return {
          boundary: C,
          verticesList: this.buildTin(
            o,
            C?.vertices ?? B(M, !1),
            t,
            C,
            T.size > 0
          )
        };
      }));
    } else
      S = this.buildTin(
        o,
        B(M, !1),
        t,
        void 0
      );
    this.vertices_params = {
      forw: dn(S.forw, this.centroid.forw),
      bakw: dn(S.bakw, this.centroid.bakw)
    }, this.addIndexedTin(), this.pointsWeightBuffer = {}, this.lastBoundaryDiagnostics = k?.diagnostics, n && this.lastBoundaryDiagnostics && (this.lastBoundaryDiagnostics = {
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
    const s = (d) => [...d].sort().join(","), i = (d, _ = !1) => {
      const I = s(d), m = n.get(I);
      if (m) return m;
      const b = e(d), p = {
        value: b,
        strict: b.boundary !== void 0 && this.strict_status === ot.STATUS_STRICT
      };
      return (p.strict || _) && (p.state = this.captureBuild()), n.set(I, p), o = p, p;
    }, a = (d) => (o !== d && this.restoreBuild(d.state), o = d, d.value), l = i(/* @__PURE__ */ new Set(), !0);
    if (!(t === ot.MODE_STRICT || t === ot.MODE_AUTO) || !l.value.boundary || l.strict) return l.value;
    const h = new Set(l.value.boundary.forwHull.all.map(ye)), f = () => this.pointsSet.forw.features.map(
      (d) => d.properties.target.index
    ), u = /* @__PURE__ */ new Set();
    let g = l, v;
    for (let d = 0; d < Yr; d++) {
      const _ = Rr(
        this.tins.forw,
        g.value.boundary.forwHull.applied,
        f()
      ).filter((I) => !u.has(ye(I)));
      if (_.length === 0) break;
      for (const I of _) u.add(ye(I));
      if (g = i(u), !g.value.boundary) break;
      if (g.strict) {
        v = g;
        break;
      }
    }
    if (v) {
      let d = v;
      for (const _ of [...u].slice(0, Lr)) {
        const I = new Set(u);
        I.delete(_);
        const m = i(I);
        m.strict && (u.delete(_), d = m);
      }
      return a(d);
    }
    if (u.size < h.size) {
      const d = i(h);
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
  buildTin(t, e, n, o, s = !1) {
    const i = {
      forw: [],
      bakw: []
    };
    for (let a = 0; a < e.length; a++) {
      const l = e[a].forw, c = e[a].bakw, h = Kt(l, c, `b${a}`), f = Wt(h);
      i.forw.push(h), i.bakw.push(f);
    }
    return this.pointsSet = {
      forw: xt([...t.forw, ...i.forw]),
      bakw: xt([...t.bakw, ...i.bakw]),
      edges: t.edges
    }, this.tins = {
      forw: qe(
        o?.forw ?? de(this.pointsSet.forw, t.edges, "target")
      )
    }, (n === ot.MODE_STRICT || n === ot.MODE_AUTO) && this.calculateStrictTin(
      n === ot.MODE_AUTO || s ? 1 : xn
    ), (n === ot.MODE_LOOSE || n === ot.MODE_AUTO && this.strict_status === ot.STATUS_ERROR) && (this.tins.bakw = qe(
      o?.bakw ?? de(this.pointsSet.bakw, t.edges, "target")
    ), delete this.kinks, this.strict_status = ot.STATUS_LOOSE), i;
  }
  /**
   * 非同期ラッパーを提供します。
   * 互換性のために Promise ベースの API を維持しますが、内部処理は同期的です。
   */
  async updateTinAsync() {
    this.updateTin();
  }
}
function qr(r, t, e) {
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
  jr as findIntersections,
  In as format_version,
  Xn as insertSearchIndex,
  dn as vertexCalc
};
