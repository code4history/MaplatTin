import { counterTri as On, Transform as qn, validateWorldFile as Vn, normalizeEdges as jn, transformArr as _e, rotateVerticesTriangle as qe, worldFileToCrs as Un } from "@maplat/transform";
function te(i, t, e = {}) {
  const n = { type: "Feature" };
  return (e.id === 0 || e.id) && (n.id = e.id), e.bbox && (n.bbox = e.bbox), n.properties = t || {}, n.geometry = i, n;
}
function Rt(i, t, e = {}) {
  if (!i)
    throw new Error("coordinates is required");
  if (!Array.isArray(i))
    throw new Error("coordinates must be an Array");
  if (i.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!je(i[0]) || !je(i[1]))
    throw new Error("coordinates must contain numbers");
  return te({
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
    for (let r = 0; r < s[s.length - 1].length; r++)
      if (s[s.length - 1][r] !== s[0][r])
        throw new Error("First and last Position are not equivalent.");
  }
  return te({
    type: "Polygon",
    coordinates: i
  }, t, e);
}
function Ve(i, t, e = {}) {
  if (i.length < 2)
    throw new Error("coordinates must be an array of two or more positions");
  return te({
    type: "LineString",
    coordinates: i
  }, t, e);
}
function xt(i, t = {}) {
  const e = { type: "FeatureCollection" };
  return t.id && (e.id = t.id), t.bbox && (e.bbox = t.bbox), e.features = i, e;
}
function je(i) {
  return !isNaN(i) && i !== null && !Array.isArray(i);
}
function zn(i) {
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
function Hn(i) {
  return i.type === "Feature" ? i.geometry : i;
}
function Pe(i, t, e) {
  if (i !== null)
    for (var n, s, r, o, a, l, c, h = 0, f = 0, u, p = i.type, b = p === "FeatureCollection", g = p === "Feature", M = b ? i.features.length : 1, O = 0; O < M; O++) {
      c = b ? (
        // @ts-expect-error: Known type conflict
        i.features[O].geometry
      ) : g ? (
        // @ts-expect-error: Known type conflict
        i.geometry
      ) : i, u = c ? c.type === "GeometryCollection" : !1, a = u ? c.geometries.length : 1;
      for (var m = 0; m < a; m++) {
        var v = 0, d = 0;
        if (o = u ? c.geometries[m] : c, o !== null) {
          l = o.coordinates;
          var x = o.type;
          switch (h = e && (x === "Polygon" || x === "MultiPolygon") ? 1 : 0, x) {
            case null:
              break;
            case "Point":
              if (
                // @ts-expect-error: Known type conflict
                t(
                  l,
                  f,
                  O,
                  v,
                  d
                ) === !1
              )
                return !1;
              f++, v++;
              break;
            case "LineString":
            case "MultiPoint":
              for (n = 0; n < l.length; n++) {
                if (
                  // @ts-expect-error: Known type conflict
                  t(
                    l[n],
                    f,
                    O,
                    v,
                    d
                  ) === !1
                )
                  return !1;
                f++, x === "MultiPoint" && v++;
              }
              x === "LineString" && v++;
              break;
            case "Polygon":
            case "MultiLineString":
              for (n = 0; n < l.length; n++) {
                for (s = 0; s < l[n].length - h; s++) {
                  if (
                    // @ts-expect-error: Known type conflict
                    t(
                      l[n][s],
                      f,
                      O,
                      v,
                      d
                    ) === !1
                  )
                    return !1;
                  f++;
                }
                x === "MultiLineString" && v++, x === "Polygon" && d++;
              }
              x === "Polygon" && v++;
              break;
            case "MultiPolygon":
              for (n = 0; n < l.length; n++) {
                for (d = 0, s = 0; s < l[n].length; s++) {
                  for (r = 0; r < l[n][s].length - h; r++) {
                    if (
                      // @ts-expect-error: Known type conflict
                      t(
                        l[n][s][r],
                        f,
                        O,
                        v,
                        d
                      ) === !1
                    )
                      return !1;
                    f++;
                  }
                  d++;
                }
                v++;
              }
              break;
            case "GeometryCollection":
              for (n = 0; n < o.geometries.length; n++)
                if (
                  // @ts-expect-error: Known type conflict
                  Pe(o.geometries[n], t, e) === !1
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
function ht(i, t, e, n, s) {
  let r, o, a, l, c = t[0], h = n[0], f = 0, u = 0;
  h > c == h > -c ? (r = c, c = t[++f]) : (r = h, h = n[++u]);
  let p = 0;
  if (f < i && u < e)
    for (h > c == h > -c ? (o = c + r, a = r - (o - c), c = t[++f]) : (o = h + r, a = r - (o - h), h = n[++u]), r = o, a !== 0 && (s[p++] = a); f < i && u < e; )
      h > c == h > -c ? (o = r + c, l = o - r, a = r - (o - l) + (c - l), c = t[++f]) : (o = r + h, l = o - r, a = r - (o - l) + (h - l), h = n[++u]), r = o, a !== 0 && (s[p++] = a);
  for (; f < i; )
    o = r + c, l = o - r, a = r - (o - l) + (c - l), c = t[++f], r = o, a !== 0 && (s[p++] = a);
  for (; u < e; )
    o = r + h, l = o - r, a = r - (o - l) + (h - l), h = n[++u], r = o, a !== 0 && (s[p++] = a);
  return (r !== 0 || p === 0) && (s[p++] = r), p;
}
function St(i, t, e, n, s, r, o, a) {
  return ht(ht(i, t, e, n, o), o, s, r, a);
}
function R(i, t, e, n) {
  let s, r, o, a, l, c, h, f, u, p, b;
  h = U * e, p = h - (h - e), b = e - p;
  let g = t[0];
  s = g * e, h = U * g, f = h - (h - g), u = g - f, o = u * b - (s - f * p - u * p - f * b);
  let M = 0;
  o !== 0 && (n[M++] = o);
  for (let O = 1; O < i; O++)
    g = t[O], a = g * e, h = U * g, f = h - (h - g), u = g - f, l = u * b - (a - f * p - u * p - f * b), r = s + l, c = r - s, o = s - (r - c) + (l - c), o !== 0 && (n[M++] = o), s = a + r, o = r - (s - a), o !== 0 && (n[M++] = o);
  return (s !== 0 || M === 0) && (n[M++] = s), M;
}
function Fn(i, t) {
  let e = t[0];
  for (let n = 1; n < i; n++) e += t[n];
  return e;
}
function tt(i) {
  return new Float64Array(i);
}
const Gn = (3 + 16 * pt) * pt, Kn = (2 + 12 * pt) * pt, Wn = (9 + 64 * pt) * pt * pt, Lt = tt(4), Ue = tt(8), ze = tt(12), He = tt(16), mt = tt(4);
function Jn(i, t, e, n, s, r, o) {
  let a, l, c, h, f, u, p, b, g, M, O, m, v, d, x, _, S, B;
  const A = i - s, I = e - s, C = t - r, N = n - r;
  d = A * N, u = U * A, p = u - (u - A), b = A - p, u = U * N, g = u - (u - N), M = N - g, x = b * M - (d - p * g - b * g - p * M), _ = C * I, u = U * C, p = u - (u - C), b = C - p, u = U * I, g = u - (u - I), M = I - g, S = b * M - (_ - p * g - b * g - p * M), O = x - S, f = x - O, Lt[0] = x - (O + f) + (f - S), m = d + O, f = m - d, v = d - (m - f) + (O - f), O = v - _, f = v - O, Lt[1] = v - (O + f) + (f - _), B = m + O, f = B - m, Lt[2] = m - (B - f) + (O - f), Lt[3] = B;
  let Y = Fn(4, Lt), w = Kn * o;
  if (Y >= w || -Y >= w || (f = i - A, a = i - (A + f) + (f - s), f = e - I, c = e - (I + f) + (f - s), f = t - C, l = t - (C + f) + (f - r), f = n - N, h = n - (N + f) + (f - r), a === 0 && l === 0 && c === 0 && h === 0) || (w = Wn * o + Tn * Math.abs(Y), Y += A * h + N * a - (C * c + I * l), Y >= w || -Y >= w)) return Y;
  d = a * N, u = U * a, p = u - (u - a), b = a - p, u = U * N, g = u - (u - N), M = N - g, x = b * M - (d - p * g - b * g - p * M), _ = l * I, u = U * l, p = u - (u - l), b = l - p, u = U * I, g = u - (u - I), M = I - g, S = b * M - (_ - p * g - b * g - p * M), O = x - S, f = x - O, mt[0] = x - (O + f) + (f - S), m = d + O, f = m - d, v = d - (m - f) + (O - f), O = v - _, f = v - O, mt[1] = v - (O + f) + (f - _), B = m + O, f = B - m, mt[2] = m - (B - f) + (O - f), mt[3] = B;
  const E = ht(4, Lt, 4, mt, Ue);
  d = A * h, u = U * A, p = u - (u - A), b = A - p, u = U * h, g = u - (u - h), M = h - g, x = b * M - (d - p * g - b * g - p * M), _ = C * c, u = U * C, p = u - (u - C), b = C - p, u = U * c, g = u - (u - c), M = c - g, S = b * M - (_ - p * g - b * g - p * M), O = x - S, f = x - O, mt[0] = x - (O + f) + (f - S), m = d + O, f = m - d, v = d - (m - f) + (O - f), O = v - _, f = v - O, mt[1] = v - (O + f) + (f - _), B = m + O, f = B - m, mt[2] = m - (B - f) + (O - f), mt[3] = B;
  const k = ht(E, Ue, 4, mt, ze);
  d = a * h, u = U * a, p = u - (u - a), b = a - p, u = U * h, g = u - (u - h), M = h - g, x = b * M - (d - p * g - b * g - p * M), _ = l * c, u = U * l, p = u - (u - l), b = l - p, u = U * c, g = u - (u - c), M = c - g, S = b * M - (_ - p * g - b * g - p * M), O = x - S, f = x - O, mt[0] = x - (O + f) + (f - S), m = d + O, f = m - d, v = d - (m - f) + (O - f), O = v - _, f = v - O, mt[1] = v - (O + f) + (f - _), B = m + O, f = B - m, mt[2] = m - (B - f) + (O - f), mt[3] = B;
  const F = ht(k, ze, 4, mt, He);
  return He[F - 1];
}
function dt(i, t, e, n, s, r) {
  const o = (t - r) * (e - s), a = (i - s) * (n - r), l = o - a, c = Math.abs(o + a);
  return Math.abs(l) >= Gn * c ? l : -Jn(i, t, e, n, s, r, c);
}
const Qn = (10 + 96 * pt) * pt, Zn = (4 + 48 * pt) * pt, tr = (44 + 576 * pt) * pt * pt, Tt = tt(4), Ft = tt(4), Ct = tt(4), Mt = tt(4), kt = tt(4), Et = tt(4), gt = tt(4), wt = tt(4), Se = tt(8), Me = tt(8), ke = tt(8), Ee = tt(8), Ae = tt(8), Ie = tt(8), se = tt(8), oe = tt(8), ae = tt(8), $t = tt(4), Pt = tt(4), Xt = tt(4), z = tt(8), K = tt(16), nt = tt(16), rt = tt(16), et = tt(32), Dt = tt(32), ct = tt(48), vt = tt(64);
let jt = tt(1152), Be = tt(1152);
function lt(i, t, e) {
  i = ht(i, jt, t, e, Be);
  const n = jt;
  return jt = Be, Be = n, i;
}
function er(i, t, e, n, s, r, o, a, l) {
  let c, h, f, u, p, b, g, M, O, m, v, d, x, _, S, B, A, I, C, N, Y, w, E, k, F, D, $, y, T, P, X, L, q, j, V;
  const G = i - o, H = e - o, W = s - o, J = t - a, Z = n - a, Q = r - a;
  X = H * Q, E = U * H, k = E - (E - H), F = H - k, E = U * Q, D = E - (E - Q), $ = Q - D, L = F * $ - (X - k * D - F * D - k * $), q = W * Z, E = U * W, k = E - (E - W), F = W - k, E = U * Z, D = E - (E - Z), $ = Z - D, j = F * $ - (q - k * D - F * D - k * $), y = L - j, w = L - y, Tt[0] = L - (y + w) + (w - j), T = X + y, w = T - X, P = X - (T - w) + (y - w), y = P - q, w = P - y, Tt[1] = P - (y + w) + (w - q), V = T + y, w = V - T, Tt[2] = T - (V - w) + (y - w), Tt[3] = V, X = W * J, E = U * W, k = E - (E - W), F = W - k, E = U * J, D = E - (E - J), $ = J - D, L = F * $ - (X - k * D - F * D - k * $), q = G * Q, E = U * G, k = E - (E - G), F = G - k, E = U * Q, D = E - (E - Q), $ = Q - D, j = F * $ - (q - k * D - F * D - k * $), y = L - j, w = L - y, Ft[0] = L - (y + w) + (w - j), T = X + y, w = T - X, P = X - (T - w) + (y - w), y = P - q, w = P - y, Ft[1] = P - (y + w) + (w - q), V = T + y, w = V - T, Ft[2] = T - (V - w) + (y - w), Ft[3] = V, X = G * Z, E = U * G, k = E - (E - G), F = G - k, E = U * Z, D = E - (E - Z), $ = Z - D, L = F * $ - (X - k * D - F * D - k * $), q = H * J, E = U * H, k = E - (E - H), F = H - k, E = U * J, D = E - (E - J), $ = J - D, j = F * $ - (q - k * D - F * D - k * $), y = L - j, w = L - y, Ct[0] = L - (y + w) + (w - j), T = X + y, w = T - X, P = X - (T - w) + (y - w), y = P - q, w = P - y, Ct[1] = P - (y + w) + (w - q), V = T + y, w = V - T, Ct[2] = T - (V - w) + (y - w), Ct[3] = V, c = ht(
    ht(
      ht(
        R(R(4, Tt, G, z), z, G, K),
        K,
        R(R(4, Tt, J, z), z, J, nt),
        nt,
        et
      ),
      et,
      ht(
        R(R(4, Ft, H, z), z, H, K),
        K,
        R(R(4, Ft, Z, z), z, Z, nt),
        nt,
        Dt
      ),
      Dt,
      vt
    ),
    vt,
    ht(
      R(R(4, Ct, W, z), z, W, K),
      K,
      R(R(4, Ct, Q, z), z, Q, nt),
      nt,
      et
    ),
    et,
    jt
  );
  let at = Fn(c, jt), ft = Zn * l;
  if (at >= ft || -at >= ft || (w = i - G, h = i - (G + w) + (w - o), w = t - J, p = t - (J + w) + (w - a), w = e - H, f = e - (H + w) + (w - o), w = n - Z, b = n - (Z + w) + (w - a), w = s - W, u = s - (W + w) + (w - o), w = r - Q, g = r - (Q + w) + (w - a), h === 0 && f === 0 && u === 0 && p === 0 && b === 0 && g === 0) || (ft = tr * l + Tn * Math.abs(at), at += (G * G + J * J) * (H * g + Q * f - (Z * u + W * b)) + 2 * (G * h + J * p) * (H * Q - Z * W) + ((H * H + Z * Z) * (W * p + J * u - (Q * h + G * g)) + 2 * (H * f + Z * b) * (W * J - Q * G)) + ((W * W + Q * Q) * (G * b + Z * h - (J * f + H * p)) + 2 * (W * u + Q * g) * (G * Z - J * H)), at >= ft || -at >= ft))
    return at;
  if ((f !== 0 || b !== 0 || u !== 0 || g !== 0) && (X = G * G, E = U * G, k = E - (E - G), F = G - k, L = F * F - (X - k * k - (k + k) * F), q = J * J, E = U * J, k = E - (E - J), F = J - k, j = F * F - (q - k * k - (k + k) * F), y = L + j, w = y - L, Mt[0] = L - (y - w) + (j - w), T = X + y, w = T - X, P = X - (T - w) + (y - w), y = P + q, w = y - P, Mt[1] = P - (y - w) + (q - w), V = T + y, w = V - T, Mt[2] = T - (V - w) + (y - w), Mt[3] = V), (u !== 0 || g !== 0 || h !== 0 || p !== 0) && (X = H * H, E = U * H, k = E - (E - H), F = H - k, L = F * F - (X - k * k - (k + k) * F), q = Z * Z, E = U * Z, k = E - (E - Z), F = Z - k, j = F * F - (q - k * k - (k + k) * F), y = L + j, w = y - L, kt[0] = L - (y - w) + (j - w), T = X + y, w = T - X, P = X - (T - w) + (y - w), y = P + q, w = y - P, kt[1] = P - (y - w) + (q - w), V = T + y, w = V - T, kt[2] = T - (V - w) + (y - w), kt[3] = V), (h !== 0 || p !== 0 || f !== 0 || b !== 0) && (X = W * W, E = U * W, k = E - (E - W), F = W - k, L = F * F - (X - k * k - (k + k) * F), q = Q * Q, E = U * Q, k = E - (E - Q), F = Q - k, j = F * F - (q - k * k - (k + k) * F), y = L + j, w = y - L, Et[0] = L - (y - w) + (j - w), T = X + y, w = T - X, P = X - (T - w) + (y - w), y = P + q, w = y - P, Et[1] = P - (y - w) + (q - w), V = T + y, w = V - T, Et[2] = T - (V - w) + (y - w), Et[3] = V), h !== 0 && (M = R(4, Tt, h, Se), c = lt(c, St(
    R(M, Se, 2 * G, K),
    K,
    R(R(4, Et, h, z), z, Z, nt),
    nt,
    R(R(4, kt, h, z), z, -Q, rt),
    rt,
    et,
    ct
  ), ct)), p !== 0 && (O = R(4, Tt, p, Me), c = lt(c, St(
    R(O, Me, 2 * J, K),
    K,
    R(R(4, kt, p, z), z, W, nt),
    nt,
    R(R(4, Et, p, z), z, -H, rt),
    rt,
    et,
    ct
  ), ct)), f !== 0 && (m = R(4, Ft, f, ke), c = lt(c, St(
    R(m, ke, 2 * H, K),
    K,
    R(R(4, Mt, f, z), z, Q, nt),
    nt,
    R(R(4, Et, f, z), z, -J, rt),
    rt,
    et,
    ct
  ), ct)), b !== 0 && (v = R(4, Ft, b, Ee), c = lt(c, St(
    R(v, Ee, 2 * Z, K),
    K,
    R(R(4, Et, b, z), z, G, nt),
    nt,
    R(R(4, Mt, b, z), z, -W, rt),
    rt,
    et,
    ct
  ), ct)), u !== 0 && (d = R(4, Ct, u, Ae), c = lt(c, St(
    R(d, Ae, 2 * W, K),
    K,
    R(R(4, kt, u, z), z, J, nt),
    nt,
    R(R(4, Mt, u, z), z, -Z, rt),
    rt,
    et,
    ct
  ), ct)), g !== 0 && (x = R(4, Ct, g, Ie), c = lt(c, St(
    R(x, Ie, 2 * Q, K),
    K,
    R(R(4, Mt, g, z), z, H, nt),
    nt,
    R(R(4, kt, g, z), z, -G, rt),
    rt,
    et,
    ct
  ), ct)), h !== 0 || p !== 0) {
    if (f !== 0 || b !== 0 || u !== 0 || g !== 0 ? (X = f * Q, E = U * f, k = E - (E - f), F = f - k, E = U * Q, D = E - (E - Q), $ = Q - D, L = F * $ - (X - k * D - F * D - k * $), q = H * g, E = U * H, k = E - (E - H), F = H - k, E = U * g, D = E - (E - g), $ = g - D, j = F * $ - (q - k * D - F * D - k * $), y = L + j, w = y - L, gt[0] = L - (y - w) + (j - w), T = X + y, w = T - X, P = X - (T - w) + (y - w), y = P + q, w = y - P, gt[1] = P - (y - w) + (q - w), V = T + y, w = V - T, gt[2] = T - (V - w) + (y - w), gt[3] = V, X = u * -Z, E = U * u, k = E - (E - u), F = u - k, E = U * -Z, D = E - (E - -Z), $ = -Z - D, L = F * $ - (X - k * D - F * D - k * $), q = W * -b, E = U * W, k = E - (E - W), F = W - k, E = U * -b, D = E - (E - -b), $ = -b - D, j = F * $ - (q - k * D - F * D - k * $), y = L + j, w = y - L, wt[0] = L - (y - w) + (j - w), T = X + y, w = T - X, P = X - (T - w) + (y - w), y = P + q, w = y - P, wt[1] = P - (y - w) + (q - w), V = T + y, w = V - T, wt[2] = T - (V - w) + (y - w), wt[3] = V, S = ht(4, gt, 4, wt, oe), X = f * g, E = U * f, k = E - (E - f), F = f - k, E = U * g, D = E - (E - g), $ = g - D, L = F * $ - (X - k * D - F * D - k * $), q = u * b, E = U * u, k = E - (E - u), F = u - k, E = U * b, D = E - (E - b), $ = b - D, j = F * $ - (q - k * D - F * D - k * $), y = L - j, w = L - y, Pt[0] = L - (y + w) + (w - j), T = X + y, w = T - X, P = X - (T - w) + (y - w), y = P - q, w = P - y, Pt[1] = P - (y + w) + (w - q), V = T + y, w = V - T, Pt[2] = T - (V - w) + (y - w), Pt[3] = V, I = 4) : (oe[0] = 0, S = 1, Pt[0] = 0, I = 1), h !== 0) {
      const it = R(S, oe, h, rt);
      c = lt(c, ht(
        R(M, Se, h, K),
        K,
        R(it, rt, 2 * G, et),
        et,
        ct
      ), ct);
      const st = R(I, Pt, h, z);
      c = lt(c, St(
        R(st, z, 2 * G, K),
        K,
        R(st, z, h, nt),
        nt,
        R(it, rt, h, et),
        et,
        Dt,
        vt
      ), vt), b !== 0 && (c = lt(c, R(R(4, Et, h, z), z, b, K), K)), g !== 0 && (c = lt(c, R(R(4, kt, -h, z), z, g, K), K));
    }
    if (p !== 0) {
      const it = R(S, oe, p, rt);
      c = lt(c, ht(
        R(O, Me, p, K),
        K,
        R(it, rt, 2 * J, et),
        et,
        ct
      ), ct);
      const st = R(I, Pt, p, z);
      c = lt(c, St(
        R(st, z, 2 * J, K),
        K,
        R(st, z, p, nt),
        nt,
        R(it, rt, p, et),
        et,
        Dt,
        vt
      ), vt);
    }
  }
  if (f !== 0 || b !== 0) {
    if (u !== 0 || g !== 0 || h !== 0 || p !== 0 ? (X = u * J, E = U * u, k = E - (E - u), F = u - k, E = U * J, D = E - (E - J), $ = J - D, L = F * $ - (X - k * D - F * D - k * $), q = W * p, E = U * W, k = E - (E - W), F = W - k, E = U * p, D = E - (E - p), $ = p - D, j = F * $ - (q - k * D - F * D - k * $), y = L + j, w = y - L, gt[0] = L - (y - w) + (j - w), T = X + y, w = T - X, P = X - (T - w) + (y - w), y = P + q, w = y - P, gt[1] = P - (y - w) + (q - w), V = T + y, w = V - T, gt[2] = T - (V - w) + (y - w), gt[3] = V, N = -Q, Y = -g, X = h * N, E = U * h, k = E - (E - h), F = h - k, E = U * N, D = E - (E - N), $ = N - D, L = F * $ - (X - k * D - F * D - k * $), q = G * Y, E = U * G, k = E - (E - G), F = G - k, E = U * Y, D = E - (E - Y), $ = Y - D, j = F * $ - (q - k * D - F * D - k * $), y = L + j, w = y - L, wt[0] = L - (y - w) + (j - w), T = X + y, w = T - X, P = X - (T - w) + (y - w), y = P + q, w = y - P, wt[1] = P - (y - w) + (q - w), V = T + y, w = V - T, wt[2] = T - (V - w) + (y - w), wt[3] = V, B = ht(4, gt, 4, wt, ae), X = u * p, E = U * u, k = E - (E - u), F = u - k, E = U * p, D = E - (E - p), $ = p - D, L = F * $ - (X - k * D - F * D - k * $), q = h * g, E = U * h, k = E - (E - h), F = h - k, E = U * g, D = E - (E - g), $ = g - D, j = F * $ - (q - k * D - F * D - k * $), y = L - j, w = L - y, Xt[0] = L - (y + w) + (w - j), T = X + y, w = T - X, P = X - (T - w) + (y - w), y = P - q, w = P - y, Xt[1] = P - (y + w) + (w - q), V = T + y, w = V - T, Xt[2] = T - (V - w) + (y - w), Xt[3] = V, C = 4) : (ae[0] = 0, B = 1, Xt[0] = 0, C = 1), f !== 0) {
      const it = R(B, ae, f, rt);
      c = lt(c, ht(
        R(m, ke, f, K),
        K,
        R(it, rt, 2 * H, et),
        et,
        ct
      ), ct);
      const st = R(C, Xt, f, z);
      c = lt(c, St(
        R(st, z, 2 * H, K),
        K,
        R(st, z, f, nt),
        nt,
        R(it, rt, f, et),
        et,
        Dt,
        vt
      ), vt), g !== 0 && (c = lt(c, R(R(4, Mt, f, z), z, g, K), K)), p !== 0 && (c = lt(c, R(R(4, Et, -f, z), z, p, K), K));
    }
    if (b !== 0) {
      const it = R(B, ae, b, rt);
      c = lt(c, ht(
        R(v, Ee, b, K),
        K,
        R(it, rt, 2 * Z, et),
        et,
        ct
      ), ct);
      const st = R(C, Xt, b, z);
      c = lt(c, St(
        R(st, z, 2 * Z, K),
        K,
        R(st, z, b, nt),
        nt,
        R(it, rt, b, et),
        et,
        Dt,
        vt
      ), vt);
    }
  }
  if (u !== 0 || g !== 0) {
    if (h !== 0 || p !== 0 || f !== 0 || b !== 0 ? (X = h * Z, E = U * h, k = E - (E - h), F = h - k, E = U * Z, D = E - (E - Z), $ = Z - D, L = F * $ - (X - k * D - F * D - k * $), q = G * b, E = U * G, k = E - (E - G), F = G - k, E = U * b, D = E - (E - b), $ = b - D, j = F * $ - (q - k * D - F * D - k * $), y = L + j, w = y - L, gt[0] = L - (y - w) + (j - w), T = X + y, w = T - X, P = X - (T - w) + (y - w), y = P + q, w = y - P, gt[1] = P - (y - w) + (q - w), V = T + y, w = V - T, gt[2] = T - (V - w) + (y - w), gt[3] = V, N = -J, Y = -p, X = f * N, E = U * f, k = E - (E - f), F = f - k, E = U * N, D = E - (E - N), $ = N - D, L = F * $ - (X - k * D - F * D - k * $), q = H * Y, E = U * H, k = E - (E - H), F = H - k, E = U * Y, D = E - (E - Y), $ = Y - D, j = F * $ - (q - k * D - F * D - k * $), y = L + j, w = y - L, wt[0] = L - (y - w) + (j - w), T = X + y, w = T - X, P = X - (T - w) + (y - w), y = P + q, w = y - P, wt[1] = P - (y - w) + (q - w), V = T + y, w = V - T, wt[2] = T - (V - w) + (y - w), wt[3] = V, _ = ht(4, gt, 4, wt, se), X = h * b, E = U * h, k = E - (E - h), F = h - k, E = U * b, D = E - (E - b), $ = b - D, L = F * $ - (X - k * D - F * D - k * $), q = f * p, E = U * f, k = E - (E - f), F = f - k, E = U * p, D = E - (E - p), $ = p - D, j = F * $ - (q - k * D - F * D - k * $), y = L - j, w = L - y, $t[0] = L - (y + w) + (w - j), T = X + y, w = T - X, P = X - (T - w) + (y - w), y = P - q, w = P - y, $t[1] = P - (y + w) + (w - q), V = T + y, w = V - T, $t[2] = T - (V - w) + (y - w), $t[3] = V, A = 4) : (se[0] = 0, _ = 1, $t[0] = 0, A = 1), u !== 0) {
      const it = R(_, se, u, rt);
      c = lt(c, ht(
        R(d, Ae, u, K),
        K,
        R(it, rt, 2 * W, et),
        et,
        ct
      ), ct);
      const st = R(A, $t, u, z);
      c = lt(c, St(
        R(st, z, 2 * W, K),
        K,
        R(st, z, u, nt),
        nt,
        R(it, rt, u, et),
        et,
        Dt,
        vt
      ), vt), p !== 0 && (c = lt(c, R(R(4, kt, u, z), z, p, K), K)), b !== 0 && (c = lt(c, R(R(4, Mt, -u, z), z, b, K), K));
    }
    if (g !== 0) {
      const it = R(_, se, g, rt);
      c = lt(c, ht(
        R(x, Ie, g, K),
        K,
        R(it, rt, 2 * Q, et),
        et,
        ct
      ), ct);
      const st = R(A, $t, g, z);
      c = lt(c, St(
        R(st, z, 2 * Q, K),
        K,
        R(st, z, g, nt),
        nt,
        R(it, rt, g, et),
        et,
        Dt,
        vt
      ), vt);
    }
  }
  return jt[c - 1];
}
function nr(i, t, e, n, s, r, o, a) {
  const l = i - o, c = e - o, h = s - o, f = t - a, u = n - a, p = r - a, b = c * p, g = h * u, M = l * l + f * f, O = h * f, m = l * p, v = c * c + u * u, d = l * u, x = c * f, _ = h * h + p * p, S = M * (b - g) + v * (O - m) + _ * (d - x), B = (Math.abs(b) + Math.abs(g)) * M + (Math.abs(O) + Math.abs(m)) * v + (Math.abs(d) + Math.abs(x)) * _, A = Qn * B;
  return S > A || -S > A ? S : er(i, t, e, n, s, r, o, a, B);
}
function rr(i, t) {
  var e, n, s = 0, r, o, a, l, c, h, f, u = i[0], p = i[1], b = t.length;
  for (e = 0; e < b; e++) {
    n = 0;
    var g = t[e], M = g.length - 1;
    if (h = g[0], h[0] !== g[M][0] && h[1] !== g[M][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (o = h[0] - u, a = h[1] - p, n; n < M; n++) {
      if (f = g[n + 1], l = f[0] - u, c = f[1] - p, a === 0 && c === 0) {
        if (l <= 0 && o >= 0 || o <= 0 && l >= 0)
          return 0;
      } else if (c >= 0 && a <= 0 || c <= 0 && a >= 0) {
        if (r = dt(o, l, a, c, 0, 0), r === 0)
          return 0;
        (r > 0 && c > 0 && a <= 0 || r < 0 && c <= 0 && a > 0) && s++;
      }
      h = f, a = c, o = l;
    }
  }
  return s % 2 !== 0;
}
function Ge(i, t, e = {}) {
  if (!i)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const n = zn(i), s = Hn(t), r = s.type, o = t.bbox;
  let a = s.coordinates;
  if (o && ir(n, o) === !1)
    return !1;
  r === "Polygon" && (a = [a]);
  for (var l = 0; l < a.length; ++l) {
    const c = rr(n, a[l]);
    if (c === 0 && !e.ignoreBoundary) return !0;
    if (c) return !0;
  }
  return !1;
}
function ir(i, t) {
  return t[0] <= i[0] && t[1] <= i[1] && t[2] >= i[0] && t[3] >= i[1];
}
class Xe {
  constructor(t = [], e = sr) {
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
      const r = t - 1 >> 1, o = e[r];
      if (n(s, o) >= 0) break;
      e[t] = o, t = r;
    }
    e[t] = s;
  }
  _down(t) {
    const { data: e, compare: n } = this, s = this.length >> 1, r = e[t];
    for (; t < s; ) {
      let o = (t << 1) + 1, a = e[o];
      const l = o + 1;
      if (l < this.length && n(e[l], a) < 0 && (o = l, a = e[l]), n(a, r) >= 0) break;
      e[t] = a, t = o;
    }
    e[t] = r;
  }
}
function sr(i, t) {
  return i < t ? -1 : i > t ? 1 : 0;
}
const or = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Xe
}, Symbol.toStringTag, { value: "Module" })), Bt = 11102230246251565e-32, ut = 134217729, ar = (3 + 8 * Bt) * Bt;
function Oe(i, t, e, n, s) {
  let r, o, a, l, c = t[0], h = n[0], f = 0, u = 0;
  h > c == h > -c ? (r = c, c = t[++f]) : (r = h, h = n[++u]);
  let p = 0;
  if (f < i && u < e)
    for (h > c == h > -c ? (o = c + r, a = r - (o - c), c = t[++f]) : (o = h + r, a = r - (o - h), h = n[++u]), r = o, a !== 0 && (s[p++] = a); f < i && u < e; )
      h > c == h > -c ? (o = r + c, l = o - r, a = r - (o - l) + (c - l), c = t[++f]) : (o = r + h, l = o - r, a = r - (o - l) + (h - l), h = n[++u]), r = o, a !== 0 && (s[p++] = a);
  for (; f < i; )
    o = r + c, l = o - r, a = r - (o - l) + (c - l), c = t[++f], r = o, a !== 0 && (s[p++] = a);
  for (; u < e; )
    o = r + h, l = o - r, a = r - (o - l) + (h - l), h = n[++u], r = o, a !== 0 && (s[p++] = a);
  return (r !== 0 || p === 0) && (s[p++] = r), p;
}
function cr(i, t) {
  let e = t[0];
  for (let n = 1; n < i; n++) e += t[n];
  return e;
}
function ie(i) {
  return new Float64Array(i);
}
const lr = (3 + 16 * Bt) * Bt, fr = (2 + 12 * Bt) * Bt, hr = (9 + 64 * Bt) * Bt * Bt, qt = ie(4), Ke = ie(8), We = ie(12), Je = ie(16), yt = ie(4);
function ur(i, t, e, n, s, r, o) {
  let a, l, c, h, f, u, p, b, g, M, O, m, v, d, x, _, S, B;
  const A = i - s, I = e - s, C = t - r, N = n - r;
  d = A * N, u = ut * A, p = u - (u - A), b = A - p, u = ut * N, g = u - (u - N), M = N - g, x = b * M - (d - p * g - b * g - p * M), _ = C * I, u = ut * C, p = u - (u - C), b = C - p, u = ut * I, g = u - (u - I), M = I - g, S = b * M - (_ - p * g - b * g - p * M), O = x - S, f = x - O, qt[0] = x - (O + f) + (f - S), m = d + O, f = m - d, v = d - (m - f) + (O - f), O = v - _, f = v - O, qt[1] = v - (O + f) + (f - _), B = m + O, f = B - m, qt[2] = m - (B - f) + (O - f), qt[3] = B;
  let Y = cr(4, qt), w = fr * o;
  if (Y >= w || -Y >= w || (f = i - A, a = i - (A + f) + (f - s), f = e - I, c = e - (I + f) + (f - s), f = t - C, l = t - (C + f) + (f - r), f = n - N, h = n - (N + f) + (f - r), a === 0 && l === 0 && c === 0 && h === 0) || (w = hr * o + ar * Math.abs(Y), Y += A * h + N * a - (C * c + I * l), Y >= w || -Y >= w)) return Y;
  d = a * N, u = ut * a, p = u - (u - a), b = a - p, u = ut * N, g = u - (u - N), M = N - g, x = b * M - (d - p * g - b * g - p * M), _ = l * I, u = ut * l, p = u - (u - l), b = l - p, u = ut * I, g = u - (u - I), M = I - g, S = b * M - (_ - p * g - b * g - p * M), O = x - S, f = x - O, yt[0] = x - (O + f) + (f - S), m = d + O, f = m - d, v = d - (m - f) + (O - f), O = v - _, f = v - O, yt[1] = v - (O + f) + (f - _), B = m + O, f = B - m, yt[2] = m - (B - f) + (O - f), yt[3] = B;
  const E = Oe(4, qt, 4, yt, Ke);
  d = A * h, u = ut * A, p = u - (u - A), b = A - p, u = ut * h, g = u - (u - h), M = h - g, x = b * M - (d - p * g - b * g - p * M), _ = C * c, u = ut * C, p = u - (u - C), b = C - p, u = ut * c, g = u - (u - c), M = c - g, S = b * M - (_ - p * g - b * g - p * M), O = x - S, f = x - O, yt[0] = x - (O + f) + (f - S), m = d + O, f = m - d, v = d - (m - f) + (O - f), O = v - _, f = v - O, yt[1] = v - (O + f) + (f - _), B = m + O, f = B - m, yt[2] = m - (B - f) + (O - f), yt[3] = B;
  const k = Oe(E, Ke, 4, yt, We);
  d = a * h, u = ut * a, p = u - (u - a), b = a - p, u = ut * h, g = u - (u - h), M = h - g, x = b * M - (d - p * g - b * g - p * M), _ = l * c, u = ut * l, p = u - (u - l), b = l - p, u = ut * c, g = u - (u - c), M = c - g, S = b * M - (_ - p * g - b * g - p * M), O = x - S, f = x - O, yt[0] = x - (O + f) + (f - S), m = d + O, f = m - d, v = d - (m - f) + (O - f), O = v - _, f = v - O, yt[1] = v - (O + f) + (f - _), B = m + O, f = B - m, yt[2] = m - (B - f) + (O - f), yt[3] = B;
  const F = Oe(k, We, 4, yt, Je);
  return Je[F - 1];
}
function Qe(i, t, e, n, s, r) {
  const o = (t - r) * (e - s), a = (i - s) * (n - r), l = o - a;
  if (o === 0 || a === 0 || o > 0 != a > 0) return l;
  const c = Math.abs(o + a);
  return Math.abs(l) >= lr * c ? l : -ur(i, t, e, n, s, r, c);
}
function dr(i, t) {
  const e = new Xe([], Cn);
  return mr(i, e), gr(e, t);
}
function Cn(i, t) {
  return i.p.x > t.p.x ? 1 : i.p.x < t.p.x || i.p.x === t.p.x && (i.featureId !== t.featureId || i.ringId !== t.ringId) && i.isLeftEndpoint && !t.isLeftEndpoint ? -1 : i.p.y !== t.p.y ? i.p.y > t.p.y ? 1 : -1 : 1;
}
function pr(i, t) {
  return i.rightSweepEvent.p.x > t.rightSweepEvent.p.x ? 1 : i.rightSweepEvent.p.x < t.rightSweepEvent.p.x ? -1 : i.rightSweepEvent.p.y !== t.rightSweepEvent.p.y ? i.rightSweepEvent.p.y < t.rightSweepEvent.p.y ? 1 : -1 : 1;
}
function mr(i, t) {
  if (i.type === "FeatureCollection") {
    const e = i.features;
    for (let n = 0; n < e.length; n++)
      Ze(e[n], t);
  } else
    Ze(i, t);
}
var ce = 0, le = 0, fe = 0;
function Ze(i, t) {
  const e = i.type === "Feature" ? i.geometry : i;
  let n = e.coordinates;
  (e.type === "Polygon" || e.type === "MultiLineString") && (n = [n]), e.type === "LineString" && (n = [[n]]);
  for (let s = 0; s < n.length; s++)
    for (let r = 0; r < n[s].length; r++) {
      let o = n[s][r][0], a = null;
      le = le + 1;
      for (let l = 0; l < n[s][r].length - 1; l++) {
        a = n[s][r][l + 1];
        const c = new tn(o, ce, le, fe), h = new tn(a, ce, le, fe + 1);
        c.otherEvent = h, h.otherEvent = c, Cn(c, h) > 0 ? (h.isLeftEndpoint = !0, c.isLeftEndpoint = !1) : (c.isLeftEndpoint = !0, h.isLeftEndpoint = !1), t.push(c), t.push(h), o = a, fe = fe + 1;
      }
    }
  ce = ce + 1;
}
var tn = class {
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
function gr(i, t = !1) {
  const e = [], n = new Xe([], pr);
  for (; i.length; ) {
    const s = i.pop();
    if (s.isLeftEndpoint) {
      const r = new wr(s);
      for (let o = 0; o < n.data.length; o++) {
        const a = n.data[o];
        if (t && a.leftSweepEvent.featureId === s.featureId)
          continue;
        const l = yr(r, a);
        l !== !1 && e.push(l);
      }
      n.push(r);
    } else s.isLeftEndpoint === !1 && n.pop();
  }
  return e;
}
var wr = class {
  /** @param event must have otherEvent non-null */
  constructor(i) {
    this.leftSweepEvent = i, this.rightSweepEvent = i.otherEvent;
  }
};
function yr(i, t) {
  if (i === null || t === null) return !1;
  const e = i.leftSweepEvent.p.x, n = i.leftSweepEvent.p.y, s = i.rightSweepEvent.p.x, r = i.rightSweepEvent.p.y, o = t.leftSweepEvent.p.x, a = t.leftSweepEvent.p.y, l = t.rightSweepEvent.p.x, c = t.rightSweepEvent.p.y, h = Qe(e, n, s, r, o, a), f = Qe(e, n, s, r, l, c);
  if (h > 0 && f > 0) return !1;
  if (h < 0 && f < 0) return !1;
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
  const u = (c - a) * (s - e) - (l - o) * (r - n), p = (l - o) * (n - a) - (c - a) * (e - o), b = (s - e) * (n - a) - (r - n) * (e - o);
  if (u === 0)
    return !1;
  const g = p / u, M = b / u;
  if (g >= 0 && g <= 1 && M >= 0 && M <= 1) {
    const O = e + g * (s - e), m = n + g * (r - n);
    return [O, m];
  }
  return !1;
}
function vr(i, t, e = {}) {
  const { removeDuplicates: n = !0, ignoreSelfIntersections: s = !0 } = e;
  let r = [];
  i.type === "FeatureCollection" ? r = r.concat(i.features) : i.type === "Feature" ? r.push(i) : (i.type === "LineString" || i.type === "Polygon" || i.type === "MultiLineString" || i.type === "MultiPolygon") && r.push(te(i)), t.type === "FeatureCollection" ? r = r.concat(t.features) : t.type === "Feature" ? r.push(t) : (t.type === "LineString" || t.type === "Polygon" || t.type === "MultiLineString" || t.type === "MultiPolygon") && r.push(te(t));
  const o = dr(
    xt(r),
    s
  );
  let a = [];
  if (n) {
    const l = {};
    o.forEach((c) => {
      const h = c.join(",");
      l[h] || (l[h] = !0, a.push(c));
    });
  } else
    a = o;
  return xt(a.map((l) => Rt(l)));
}
function br(i) {
  return i && i.__esModule && Object.prototype.hasOwnProperty.call(i, "default") ? i.default : i;
}
function xr(i) {
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
function _r(i, t = {}) {
  let e = 0, n = 0, s = 0;
  return Pe(
    i,
    function(r) {
      e += r[0], n += r[1], s++;
    },
    !0
  ), Rt([e / s, n / s], t.properties);
}
var he = { exports: {} }, we = { exports: {} }, Sr = we.exports, en;
function Mr() {
  return en || (en = 1, (function(i, t) {
    (function(e, n) {
      i.exports = n();
    })(Sr, function() {
      function e(m, v, d, x, _) {
        (function S(B, A, I, C, N) {
          for (; C > I; ) {
            if (C - I > 600) {
              var Y = C - I + 1, w = A - I + 1, E = Math.log(Y), k = 0.5 * Math.exp(2 * E / 3), F = 0.5 * Math.sqrt(E * k * (Y - k) / Y) * (w - Y / 2 < 0 ? -1 : 1), D = Math.max(I, Math.floor(A - w * k / Y + F)), $ = Math.min(C, Math.floor(A + (Y - w) * k / Y + F));
              S(B, A, D, $, N);
            }
            var y = B[A], T = I, P = C;
            for (n(B, I, A), N(B[C], y) > 0 && n(B, I, C); T < P; ) {
              for (n(B, T, P), T++, P--; N(B[T], y) < 0; ) T++;
              for (; N(B[P], y) > 0; ) P--;
            }
            N(B[I], y) === 0 ? n(B, I, P) : n(B, ++P, C), P <= A && (I = P + 1), A <= P && (C = P - 1);
          }
        })(m, v, d || 0, x || m.length - 1, _ || s);
      }
      function n(m, v, d) {
        var x = m[v];
        m[v] = m[d], m[d] = x;
      }
      function s(m, v) {
        return m < v ? -1 : m > v ? 1 : 0;
      }
      var r = function(m) {
        m === void 0 && (m = 9), this._maxEntries = Math.max(4, m), this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries)), this.clear();
      };
      function o(m, v, d) {
        if (!d) return v.indexOf(m);
        for (var x = 0; x < v.length; x++) if (d(m, v[x])) return x;
        return -1;
      }
      function a(m, v) {
        l(m, 0, m.children.length, v, m);
      }
      function l(m, v, d, x, _) {
        _ || (_ = M(null)), _.minX = 1 / 0, _.minY = 1 / 0, _.maxX = -1 / 0, _.maxY = -1 / 0;
        for (var S = v; S < d; S++) {
          var B = m.children[S];
          c(_, m.leaf ? x(B) : B);
        }
        return _;
      }
      function c(m, v) {
        return m.minX = Math.min(m.minX, v.minX), m.minY = Math.min(m.minY, v.minY), m.maxX = Math.max(m.maxX, v.maxX), m.maxY = Math.max(m.maxY, v.maxY), m;
      }
      function h(m, v) {
        return m.minX - v.minX;
      }
      function f(m, v) {
        return m.minY - v.minY;
      }
      function u(m) {
        return (m.maxX - m.minX) * (m.maxY - m.minY);
      }
      function p(m) {
        return m.maxX - m.minX + (m.maxY - m.minY);
      }
      function b(m, v) {
        return m.minX <= v.minX && m.minY <= v.minY && v.maxX <= m.maxX && v.maxY <= m.maxY;
      }
      function g(m, v) {
        return v.minX <= m.maxX && v.minY <= m.maxY && v.maxX >= m.minX && v.maxY >= m.minY;
      }
      function M(m) {
        return { children: m, height: 1, leaf: !0, minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
      }
      function O(m, v, d, x, _) {
        for (var S = [v, d]; S.length; ) if (!((d = S.pop()) - (v = S.pop()) <= x)) {
          var B = v + Math.ceil((d - v) / x / 2) * x;
          e(m, B, v, d, _), S.push(v, B, B, d);
        }
      }
      return r.prototype.all = function() {
        return this._all(this.data, []);
      }, r.prototype.search = function(m) {
        var v = this.data, d = [];
        if (!g(m, v)) return d;
        for (var x = this.toBBox, _ = []; v; ) {
          for (var S = 0; S < v.children.length; S++) {
            var B = v.children[S], A = v.leaf ? x(B) : B;
            g(m, A) && (v.leaf ? d.push(B) : b(m, A) ? this._all(B, d) : _.push(B));
          }
          v = _.pop();
        }
        return d;
      }, r.prototype.collides = function(m) {
        var v = this.data;
        if (!g(m, v)) return !1;
        for (var d = []; v; ) {
          for (var x = 0; x < v.children.length; x++) {
            var _ = v.children[x], S = v.leaf ? this.toBBox(_) : _;
            if (g(m, S)) {
              if (v.leaf || b(m, S)) return !0;
              d.push(_);
            }
          }
          v = d.pop();
        }
        return !1;
      }, r.prototype.load = function(m) {
        if (!m || !m.length) return this;
        if (m.length < this._minEntries) {
          for (var v = 0; v < m.length; v++) this.insert(m[v]);
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
      }, r.prototype.insert = function(m) {
        return m && this._insert(m, this.data.height - 1), this;
      }, r.prototype.clear = function() {
        return this.data = M([]), this;
      }, r.prototype.remove = function(m, v) {
        if (!m) return this;
        for (var d, x, _, S = this.data, B = this.toBBox(m), A = [], I = []; S || A.length; ) {
          if (S || (S = A.pop(), x = A[A.length - 1], d = I.pop(), _ = !0), S.leaf) {
            var C = o(m, S.children, v);
            if (C !== -1) return S.children.splice(C, 1), A.push(S), this._condense(A), this;
          }
          _ || S.leaf || !b(S, B) ? x ? (d++, S = x.children[d], _ = !1) : S = null : (A.push(S), I.push(d), d = 0, x = S, S = S.children[0]);
        }
        return this;
      }, r.prototype.toBBox = function(m) {
        return m;
      }, r.prototype.compareMinX = function(m, v) {
        return m.minX - v.minX;
      }, r.prototype.compareMinY = function(m, v) {
        return m.minY - v.minY;
      }, r.prototype.toJSON = function() {
        return this.data;
      }, r.prototype.fromJSON = function(m) {
        return this.data = m, this;
      }, r.prototype._all = function(m, v) {
        for (var d = []; m; ) m.leaf ? v.push.apply(v, m.children) : d.push.apply(d, m.children), m = d.pop();
        return v;
      }, r.prototype._build = function(m, v, d, x) {
        var _, S = d - v + 1, B = this._maxEntries;
        if (S <= B) return a(_ = M(m.slice(v, d + 1)), this.toBBox), _;
        x || (x = Math.ceil(Math.log(S) / Math.log(B)), B = Math.ceil(S / Math.pow(B, x - 1))), (_ = M([])).leaf = !1, _.height = x;
        var A = Math.ceil(S / B), I = A * Math.ceil(Math.sqrt(B));
        O(m, v, d, I, this.compareMinX);
        for (var C = v; C <= d; C += I) {
          var N = Math.min(C + I - 1, d);
          O(m, C, N, A, this.compareMinY);
          for (var Y = C; Y <= N; Y += A) {
            var w = Math.min(Y + A - 1, N);
            _.children.push(this._build(m, Y, w, x - 1));
          }
        }
        return a(_, this.toBBox), _;
      }, r.prototype._chooseSubtree = function(m, v, d, x) {
        for (; x.push(v), !v.leaf && x.length - 1 !== d; ) {
          for (var _ = 1 / 0, S = 1 / 0, B = void 0, A = 0; A < v.children.length; A++) {
            var I = v.children[A], C = u(I), N = (Y = m, w = I, (Math.max(w.maxX, Y.maxX) - Math.min(w.minX, Y.minX)) * (Math.max(w.maxY, Y.maxY) - Math.min(w.minY, Y.minY)) - C);
            N < S ? (S = N, _ = C < _ ? C : _, B = I) : N === S && C < _ && (_ = C, B = I);
          }
          v = B || v.children[0];
        }
        var Y, w;
        return v;
      }, r.prototype._insert = function(m, v, d) {
        var x = d ? m : this.toBBox(m), _ = [], S = this._chooseSubtree(x, this.data, v, _);
        for (S.children.push(m), c(S, x); v >= 0 && _[v].children.length > this._maxEntries; ) this._split(_, v), v--;
        this._adjustParentBBoxes(x, _, v);
      }, r.prototype._split = function(m, v) {
        var d = m[v], x = d.children.length, _ = this._minEntries;
        this._chooseSplitAxis(d, _, x);
        var S = this._chooseSplitIndex(d, _, x), B = M(d.children.splice(S, d.children.length - S));
        B.height = d.height, B.leaf = d.leaf, a(d, this.toBBox), a(B, this.toBBox), v ? m[v - 1].children.push(B) : this._splitRoot(d, B);
      }, r.prototype._splitRoot = function(m, v) {
        this.data = M([m, v]), this.data.height = m.height + 1, this.data.leaf = !1, a(this.data, this.toBBox);
      }, r.prototype._chooseSplitIndex = function(m, v, d) {
        for (var x, _, S, B, A, I, C, N = 1 / 0, Y = 1 / 0, w = v; w <= d - v; w++) {
          var E = l(m, 0, w, this.toBBox), k = l(m, w, d, this.toBBox), F = (_ = E, S = k, B = void 0, A = void 0, I = void 0, C = void 0, B = Math.max(_.minX, S.minX), A = Math.max(_.minY, S.minY), I = Math.min(_.maxX, S.maxX), C = Math.min(_.maxY, S.maxY), Math.max(0, I - B) * Math.max(0, C - A)), D = u(E) + u(k);
          F < N ? (N = F, x = w, Y = D < Y ? D : Y) : F === N && D < Y && (Y = D, x = w);
        }
        return x || d - v;
      }, r.prototype._chooseSplitAxis = function(m, v, d) {
        var x = m.leaf ? this.compareMinX : h, _ = m.leaf ? this.compareMinY : f;
        this._allDistMargin(m, v, d, x) < this._allDistMargin(m, v, d, _) && m.children.sort(x);
      }, r.prototype._allDistMargin = function(m, v, d, x) {
        m.children.sort(x);
        for (var _ = this.toBBox, S = l(m, 0, v, _), B = l(m, d - v, d, _), A = p(S) + p(B), I = v; I < d - v; I++) {
          var C = m.children[I];
          c(S, m.leaf ? _(C) : C), A += p(S);
        }
        for (var N = d - v - 1; N >= v; N--) {
          var Y = m.children[N];
          c(B, m.leaf ? _(Y) : Y), A += p(B);
        }
        return A;
      }, r.prototype._adjustParentBBoxes = function(m, v, d) {
        for (var x = d; x >= 0; x--) c(v[x], m);
      }, r.prototype._condense = function(m) {
        for (var v = m.length - 1, d = void 0; v >= 0; v--) m[v].children.length === 0 ? v > 0 ? (d = m[v - 1].children).splice(d.indexOf(m[v]), 1) : this.clear() : a(m[v], this.toBBox);
      }, r;
    });
  })(we)), we.exports;
}
const kr = /* @__PURE__ */ xr(or);
var zt = { exports: {} }, Te, nn;
function Er() {
  return nn || (nn = 1, Te = function(t, e, n, s) {
    var r = t[0], o = t[1], a = !1;
    n === void 0 && (n = 0), s === void 0 && (s = e.length);
    for (var l = (s - n) / 2, c = 0, h = l - 1; c < l; h = c++) {
      var f = e[n + c * 2 + 0], u = e[n + c * 2 + 1], p = e[n + h * 2 + 0], b = e[n + h * 2 + 1], g = u > o != b > o && r < (p - f) * (o - u) / (b - u) + f;
      g && (a = !a);
    }
    return a;
  }), Te;
}
var Fe, rn;
function Ar() {
  return rn || (rn = 1, Fe = function(t, e, n, s) {
    var r = t[0], o = t[1], a = !1;
    n === void 0 && (n = 0), s === void 0 && (s = e.length);
    for (var l = s - n, c = 0, h = l - 1; c < l; h = c++) {
      var f = e[c + n][0], u = e[c + n][1], p = e[h + n][0], b = e[h + n][1], g = u > o != b > o && r < (p - f) * (o - u) / (b - u) + f;
      g && (a = !a);
    }
    return a;
  }), Fe;
}
var sn;
function Ir() {
  if (sn) return zt.exports;
  sn = 1;
  var i = Er(), t = Ar();
  return zt.exports = function(n, s, r, o) {
    return s.length > 0 && Array.isArray(s[0]) ? t(n, s, r, o) : i(n, s, r, o);
  }, zt.exports.nested = t, zt.exports.flat = i, zt.exports;
}
var Gt = { exports: {} }, Br = Gt.exports, on;
function Or() {
  return on || (on = 1, (function(i, t) {
    (function(e, n) {
      n(t);
    })(Br, function(e) {
      const s = 33306690738754706e-32;
      function r(g, M, O, m, v) {
        let d, x, _, S, B = M[0], A = m[0], I = 0, C = 0;
        A > B == A > -B ? (d = B, B = M[++I]) : (d = A, A = m[++C]);
        let N = 0;
        if (I < g && C < O) for (A > B == A > -B ? (_ = d - ((x = B + d) - B), B = M[++I]) : (_ = d - ((x = A + d) - A), A = m[++C]), d = x, _ !== 0 && (v[N++] = _); I < g && C < O; ) A > B == A > -B ? (_ = d - ((x = d + B) - (S = x - d)) + (B - S), B = M[++I]) : (_ = d - ((x = d + A) - (S = x - d)) + (A - S), A = m[++C]), d = x, _ !== 0 && (v[N++] = _);
        for (; I < g; ) _ = d - ((x = d + B) - (S = x - d)) + (B - S), B = M[++I], d = x, _ !== 0 && (v[N++] = _);
        for (; C < O; ) _ = d - ((x = d + A) - (S = x - d)) + (A - S), A = m[++C], d = x, _ !== 0 && (v[N++] = _);
        return d === 0 && N !== 0 || (v[N++] = d), N;
      }
      function o(g) {
        return new Float64Array(g);
      }
      const a = 33306690738754716e-32, l = 22204460492503146e-32, c = 11093356479670487e-47, h = o(4), f = o(8), u = o(12), p = o(16), b = o(4);
      e.orient2d = function(g, M, O, m, v, d) {
        const x = (M - d) * (O - v), _ = (g - v) * (m - d), S = x - _;
        if (x === 0 || _ === 0 || x > 0 != _ > 0) return S;
        const B = Math.abs(x + _);
        return Math.abs(S) >= a * B ? S : -(function(A, I, C, N, Y, w, E) {
          let k, F, D, $, y, T, P, X, L, q, j, V, G, H, W, J, Z, Q;
          const at = A - Y, ft = C - Y, it = I - w, st = N - w;
          y = (W = (X = at - (P = (T = 134217729 * at) - (T - at))) * (q = st - (L = (T = 134217729 * st) - (T - st))) - ((H = at * st) - P * L - X * L - P * q)) - (j = W - (Z = (X = it - (P = (T = 134217729 * it) - (T - it))) * (q = ft - (L = (T = 134217729 * ft) - (T - ft))) - ((J = it * ft) - P * L - X * L - P * q))), h[0] = W - (j + y) + (y - Z), y = (G = H - ((V = H + j) - (y = V - H)) + (j - y)) - (j = G - J), h[1] = G - (j + y) + (y - J), y = (Q = V + j) - V, h[2] = V - (Q - y) + (j - y), h[3] = Q;
          let Ot = (function(Ln, Re) {
            let Le = Re[0];
            for (let xe = 1; xe < Ln; xe++) Le += Re[xe];
            return Le;
          })(4, h), Ut = l * E;
          if (Ot >= Ut || -Ot >= Ut || (k = A - (at + (y = A - at)) + (y - Y), D = C - (ft + (y = C - ft)) + (y - Y), F = I - (it + (y = I - it)) + (y - w), $ = N - (st + (y = N - st)) + (y - w), k === 0 && F === 0 && D === 0 && $ === 0) || (Ut = c * E + s * Math.abs(Ot), (Ot += at * $ + st * k - (it * D + ft * F)) >= Ut || -Ot >= Ut)) return Ot;
          y = (W = (X = k - (P = (T = 134217729 * k) - (T - k))) * (q = st - (L = (T = 134217729 * st) - (T - st))) - ((H = k * st) - P * L - X * L - P * q)) - (j = W - (Z = (X = F - (P = (T = 134217729 * F) - (T - F))) * (q = ft - (L = (T = 134217729 * ft) - (T - ft))) - ((J = F * ft) - P * L - X * L - P * q))), b[0] = W - (j + y) + (y - Z), y = (G = H - ((V = H + j) - (y = V - H)) + (j - y)) - (j = G - J), b[1] = G - (j + y) + (y - J), y = (Q = V + j) - V, b[2] = V - (Q - y) + (j - y), b[3] = Q;
          const Xn = r(4, h, 4, b, f);
          y = (W = (X = at - (P = (T = 134217729 * at) - (T - at))) * (q = $ - (L = (T = 134217729 * $) - (T - $))) - ((H = at * $) - P * L - X * L - P * q)) - (j = W - (Z = (X = it - (P = (T = 134217729 * it) - (T - it))) * (q = D - (L = (T = 134217729 * D) - (T - D))) - ((J = it * D) - P * L - X * L - P * q))), b[0] = W - (j + y) + (y - Z), y = (G = H - ((V = H + j) - (y = V - H)) + (j - y)) - (j = G - J), b[1] = G - (j + y) + (y - J), y = (Q = V + j) - V, b[2] = V - (Q - y) + (j - y), b[3] = Q;
          const Yn = r(Xn, f, 4, b, u);
          y = (W = (X = k - (P = (T = 134217729 * k) - (T - k))) * (q = $ - (L = (T = 134217729 * $) - (T - $))) - ((H = k * $) - P * L - X * L - P * q)) - (j = W - (Z = (X = F - (P = (T = 134217729 * F) - (T - F))) * (q = D - (L = (T = 134217729 * D) - (T - D))) - ((J = F * D) - P * L - X * L - P * q))), b[0] = W - (j + y) + (y - Z), y = (G = H - ((V = H + j) - (y = V - H)) + (j - y)) - (j = G - J), b[1] = G - (j + y) + (y - J), y = (Q = V + j) - V, b[2] = V - (Q - y) + (j - y), b[3] = Q;
          const Rn = r(Yn, u, 4, b, p);
          return p[Rn - 1];
        })(g, M, O, m, v, d, B);
      }, e.orient2dfast = function(g, M, O, m, v, d) {
        return (M - d) * (O - v) - (g - v) * (m - d);
      }, Object.defineProperty(e, "__esModule", { value: !0 });
    });
  })(Gt, Gt.exports)), Gt.exports;
}
var an;
function Tr() {
  if (an) return he.exports;
  an = 1;
  var i = Mr(), t = kr, e = Ir(), n = Or().orient2d;
  t.default && (t = t.default), he.exports = s, he.exports.default = s;
  function s(d, x, _) {
    x = Math.max(0, x === void 0 ? 2 : x), _ = _ || 0;
    var S = p(d), B = new i(16);
    B.toBBox = function(P) {
      return {
        minX: P[0],
        minY: P[1],
        maxX: P[0],
        maxY: P[1]
      };
    }, B.compareMinX = function(P, X) {
      return P[0] - X[0];
    }, B.compareMinY = function(P, X) {
      return P[1] - X[1];
    }, B.load(d);
    for (var A = [], I = 0, C; I < S.length; I++) {
      var N = S[I];
      B.remove(N), C = b(N, C), A.push(C);
    }
    var Y = new i(16);
    for (I = 0; I < A.length; I++) Y.insert(u(A[I]));
    for (var w = x * x, E = _ * _; A.length; ) {
      var k = A.shift(), F = k.p, D = k.next.p, $ = g(F, D);
      if (!($ < E)) {
        var y = $ / w;
        N = r(B, k.prev.p, F, D, k.next.next.p, y, Y), N && Math.min(g(N, F), g(N, D)) <= y && (A.push(k), A.push(b(N, k)), B.remove(N), Y.remove(k), Y.insert(u(k)), Y.insert(u(k.next)));
      }
    }
    k = C;
    var T = [];
    do
      T.push(k.p), k = k.next;
    while (k !== C);
    return T.push(k.p), T;
  }
  function r(d, x, _, S, B, A, I) {
    for (var C = new t([], o), N = d.data; N; ) {
      for (var Y = 0; Y < N.children.length; Y++) {
        var w = N.children[Y], E = N.leaf ? M(w, _, S) : a(_, S, w);
        E > A || C.push({
          node: w,
          dist: E
        });
      }
      for (; C.length && !C.peek().node.children; ) {
        var k = C.pop(), F = k.node, D = M(F, x, _), $ = M(F, S, B);
        if (k.dist < D && k.dist < $ && c(_, F, I) && c(S, F, I)) return F;
      }
      N = C.pop(), N && (N = N.node);
    }
    return null;
  }
  function o(d, x) {
    return d.dist - x.dist;
  }
  function a(d, x, _) {
    if (l(d, _) || l(x, _)) return 0;
    var S = O(d[0], d[1], x[0], x[1], _.minX, _.minY, _.maxX, _.minY);
    if (S === 0) return 0;
    var B = O(d[0], d[1], x[0], x[1], _.minX, _.minY, _.minX, _.maxY);
    if (B === 0) return 0;
    var A = O(d[0], d[1], x[0], x[1], _.maxX, _.minY, _.maxX, _.maxY);
    if (A === 0) return 0;
    var I = O(d[0], d[1], x[0], x[1], _.minX, _.maxY, _.maxX, _.maxY);
    return I === 0 ? 0 : Math.min(S, B, A, I);
  }
  function l(d, x) {
    return d[0] >= x.minX && d[0] <= x.maxX && d[1] >= x.minY && d[1] <= x.maxY;
  }
  function c(d, x, _) {
    for (var S = Math.min(d[0], x[0]), B = Math.min(d[1], x[1]), A = Math.max(d[0], x[0]), I = Math.max(d[1], x[1]), C = _.search({ minX: S, minY: B, maxX: A, maxY: I }), N = 0; N < C.length; N++)
      if (f(C[N].p, C[N].next.p, d, x)) return !1;
    return !0;
  }
  function h(d, x, _) {
    return n(d[0], d[1], x[0], x[1], _[0], _[1]);
  }
  function f(d, x, _, S) {
    return d !== S && x !== _ && h(d, x, _) > 0 != h(d, x, S) > 0 && h(_, S, d) > 0 != h(_, S, x) > 0;
  }
  function u(d) {
    var x = d.p, _ = d.next.p;
    return d.minX = Math.min(x[0], _[0]), d.minY = Math.min(x[1], _[1]), d.maxX = Math.max(x[0], _[0]), d.maxY = Math.max(x[1], _[1]), d;
  }
  function p(d) {
    for (var x = d[0], _ = d[0], S = d[0], B = d[0], A = 0; A < d.length; A++) {
      var I = d[A];
      I[0] < x[0] && (x = I), I[0] > S[0] && (S = I), I[1] < _[1] && (_ = I), I[1] > B[1] && (B = I);
    }
    var C = [x, _, S, B], N = C.slice();
    for (A = 0; A < d.length; A++)
      e(d[A], C) || N.push(d[A]);
    return v(N);
  }
  function b(d, x) {
    var _ = {
      p: d,
      prev: null,
      next: null,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };
    return x ? (_.next = x.next, _.prev = x, x.next.prev = _, x.next = _) : (_.prev = _, _.next = _), _;
  }
  function g(d, x) {
    var _ = d[0] - x[0], S = d[1] - x[1];
    return _ * _ + S * S;
  }
  function M(d, x, _) {
    var S = x[0], B = x[1], A = _[0] - S, I = _[1] - B;
    if (A !== 0 || I !== 0) {
      var C = ((d[0] - S) * A + (d[1] - B) * I) / (A * A + I * I);
      C > 1 ? (S = _[0], B = _[1]) : C > 0 && (S += A * C, B += I * C);
    }
    return A = d[0] - S, I = d[1] - B, A * A + I * I;
  }
  function O(d, x, _, S, B, A, I, C) {
    var N = _ - d, Y = S - x, w = I - B, E = C - A, k = d - B, F = x - A, D = N * N + Y * Y, $ = N * w + Y * E, y = w * w + E * E, T = N * k + Y * F, P = w * k + E * F, X = D * y - $ * $, L, q, j, V, G = X, H = X;
    X === 0 ? (q = 0, G = 1, V = P, H = y) : (q = $ * P - y * T, V = D * P - $ * T, q < 0 ? (q = 0, V = P, H = y) : q > G && (q = G, V = P + $, H = y)), V < 0 ? (V = 0, -T < 0 ? q = 0 : -T > D ? q = G : (q = -T, G = D)) : V > H && (V = H, -T + $ < 0 ? q = 0 : -T + $ > D ? q = G : (q = -T + $, G = D)), L = q === 0 ? 0 : q / G, j = V === 0 ? 0 : V / H;
    var W = (1 - L) * d + L * _, J = (1 - L) * x + L * S, Z = (1 - j) * B + j * I, Q = (1 - j) * A + j * C, at = Z - W, ft = Q - J;
    return at * at + ft * ft;
  }
  function m(d, x) {
    return d[0] === x[0] ? d[1] - x[1] : d[0] - x[0];
  }
  function v(d) {
    d.sort(m);
    for (var x = [], _ = 0; _ < d.length; _++) {
      for (; x.length >= 2 && h(x[x.length - 2], x[x.length - 1], d[_]) <= 0; )
        x.pop();
      x.push(d[_]);
    }
    for (var S = [], B = d.length - 1; B >= 0; B--) {
      for (; S.length >= 2 && h(S[S.length - 2], S[S.length - 1], d[B]) <= 0; )
        S.pop();
      S.push(d[B]);
    }
    return S.pop(), x.pop(), x.concat(S);
  }
  return he.exports;
}
var Fr = Tr();
const Cr = /* @__PURE__ */ br(Fr);
function cn(i, t = {}) {
  t.concavity = t.concavity || 1 / 0;
  const e = [];
  if (Pe(i, (s) => {
    e.push([s[0], s[1]]);
  }), !e.length)
    return null;
  const n = Cr(e, t.concavity);
  return n.length > 3 ? re([n], t.properties) : null;
}
const ln = Math.pow(2, -52), ue = new Uint32Array(512);
class Zt {
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
  static from(t, e = Xr, n = Yr) {
    const s = t.length, r = new Float64Array(s * 2);
    for (let o = 0; o < s; o++) {
      const a = t[o];
      r[2 * o] = e(a), r[2 * o + 1] = n(a);
    }
    return new Zt(r);
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
    const { coords: t, _hullPrev: e, _hullNext: n, _hullTri: s, _hullHash: r } = this, o = t.length >> 1;
    let a = 1 / 0, l = 1 / 0, c = -1 / 0, h = -1 / 0;
    for (let A = 0; A < o; A++) {
      const I = t[2 * A], C = t[2 * A + 1];
      I < a && (a = I), C < l && (l = C), I > c && (c = I), C > h && (h = C), this._ids[A] = A;
    }
    const f = (a + c) / 2, u = (l + h) / 2;
    let p = 0, b = 0, g = 0;
    for (let A = 0, I = 1 / 0; A < o; A++) {
      const C = Ce(f, u, t[2 * A], t[2 * A + 1]);
      C < I && (p = A, I = C);
    }
    const M = t[2 * p], O = t[2 * p + 1];
    for (let A = 0, I = 1 / 0; A < o; A++) {
      if (A === p) continue;
      const C = Ce(M, O, t[2 * A], t[2 * A + 1]);
      C < I && C > 0 && (b = A, I = C);
    }
    let m = t[2 * b], v = t[2 * b + 1], d = 1 / 0;
    for (let A = 0; A < o; A++) {
      if (A === p || A === b) continue;
      const I = $r(M, O, m, v, t[2 * A], t[2 * A + 1]);
      I < d && (g = A, d = I);
    }
    let x = t[2 * g], _ = t[2 * g + 1];
    if (d === 1 / 0) {
      for (let C = 0; C < o; C++)
        this._dists[C] = t[2 * C] - t[0] || t[2 * C + 1] - t[1];
      Vt(this._ids, this._dists, 0, o - 1);
      const A = new Uint32Array(o);
      let I = 0;
      for (let C = 0, N = -1 / 0; C < o; C++) {
        const Y = this._ids[C], w = this._dists[Y];
        w > N && (A[I++] = Y, N = w);
      }
      this.hull = A.subarray(0, I), this.triangles = new Uint32Array(0), this.halfedges = new Int32Array(0);
      return;
    }
    if (dt(M, O, m, v, x, _) < 0) {
      const A = b, I = m, C = v;
      b = g, m = x, v = _, g = A, x = I, _ = C;
    }
    const S = Pr(M, O, m, v, x, _);
    this._cx = S.x, this._cy = S.y;
    for (let A = 0; A < o; A++)
      this._dists[A] = Ce(t[2 * A], t[2 * A + 1], S.x, S.y);
    Vt(this._ids, this._dists, 0, o - 1), this._hullStart = p;
    let B = 3;
    n[p] = e[g] = b, n[b] = e[p] = g, n[g] = e[b] = p, s[p] = 0, s[b] = 1, s[g] = 2, r.fill(-1), r[this._hashKey(M, O)] = p, r[this._hashKey(m, v)] = b, r[this._hashKey(x, _)] = g, this.trianglesLen = 0, this._addTriangle(p, b, g, -1, -1, -1);
    for (let A = 0, I = 0, C = 0; A < this._ids.length; A++) {
      const N = this._ids[A], Y = t[2 * N], w = t[2 * N + 1];
      if (A > 0 && Math.abs(Y - I) <= ln && Math.abs(w - C) <= ln || (I = Y, C = w, N === p || N === b || N === g)) continue;
      let E = 0;
      for (let y = 0, T = this._hashKey(Y, w); y < this._hashSize && (E = r[(T + y) % this._hashSize], !(E !== -1 && E !== n[E])); y++)
        ;
      E = e[E];
      let k = E, F;
      for (; F = n[k], dt(Y, w, t[2 * k], t[2 * k + 1], t[2 * F], t[2 * F + 1]) >= 0; )
        if (k = F, k === E) {
          k = -1;
          break;
        }
      if (k === -1) continue;
      let D = this._addTriangle(k, N, n[k], -1, -1, s[k]);
      s[N] = this._legalize(D + 2), s[k] = D, B++;
      let $ = n[k];
      for (; F = n[$], dt(Y, w, t[2 * $], t[2 * $ + 1], t[2 * F], t[2 * F + 1]) < 0; )
        D = this._addTriangle($, N, F, s[N], -1, s[$]), s[N] = this._legalize(D + 2), n[$] = $, B--, $ = F;
      if (k === E)
        for (; F = e[k], dt(Y, w, t[2 * F], t[2 * F + 1], t[2 * k], t[2 * k + 1]) < 0; )
          D = this._addTriangle(F, N, k, -1, s[k], s[F]), this._legalize(D + 2), s[F] = D, n[k] = k, B--, k = F;
      this._hullStart = e[N] = k, n[k] = e[$] = N, n[N] = $, r[this._hashKey(Y, w)] = N, r[this._hashKey(t[2 * k], t[2 * k + 1])] = k;
    }
    this.hull = new Uint32Array(B);
    for (let A = 0, I = this._hullStart; A < B; A++)
      this.hull[A] = I, I = n[I];
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
    return Math.floor(Dr(t - this._cx, e - this._cy) * this._hashSize) % this._hashSize;
  }
  /**
   * Flip an edge in a pair of triangles if it doesn't satisfy the Delaunay condition.
   *
   * @param {number} a
   * @private
   */
  _legalize(t) {
    const { _triangles: e, _halfedges: n, coords: s } = this;
    let r = 0, o = 0;
    for (; ; ) {
      const a = n[t], l = t - t % 3;
      if (o = l + (t + 2) % 3, a === -1) {
        if (r === 0) break;
        t = ue[--r];
        continue;
      }
      const c = a - a % 3, h = l + (t + 1) % 3, f = c + (a + 2) % 3, u = e[o], p = e[t], b = e[h], g = e[f];
      if (Nr(
        s[2 * u],
        s[2 * u + 1],
        s[2 * p],
        s[2 * p + 1],
        s[2 * b],
        s[2 * b + 1],
        s[2 * g],
        s[2 * g + 1]
      )) {
        e[t] = g, e[a] = u;
        const O = n[f];
        if (O === -1) {
          let v = this._hullStart;
          do {
            if (this._hullTri[v] === f) {
              this._hullTri[v] = t;
              break;
            }
            v = this._hullPrev[v];
          } while (v !== this._hullStart);
        }
        this._link(t, O), this._link(a, n[o]), this._link(o, f);
        const m = c + (a + 1) % 3;
        r < ue.length && (ue[r++] = m);
      } else {
        if (r === 0) break;
        t = ue[--r];
      }
    }
    return o;
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
  _addTriangle(t, e, n, s, r, o) {
    const a = this.trianglesLen;
    return this._triangles[a] = t, this._triangles[a + 1] = e, this._triangles[a + 2] = n, this._link(a, s), this._link(a + 1, r), this._link(a + 2, o), this.trianglesLen += 3, a;
  }
}
function Dr(i, t) {
  const e = i / (Math.abs(i) + Math.abs(t));
  return (t > 0 ? 3 - e : 1 + e) / 4;
}
function Ce(i, t, e, n) {
  const s = i - e, r = t - n;
  return s * s + r * r;
}
function Nr(i, t, e, n, s, r, o, a) {
  const l = i - o, c = t - a, h = e - o, f = n - a, u = s - o, p = r - a, b = l * l + c * c, g = h * h + f * f, M = u * u + p * p;
  return l * (f * M - g * p) - c * (h * M - g * u) + b * (h * p - f * u) < 0;
}
function $r(i, t, e, n, s, r) {
  const o = e - i, a = n - t, l = s - i, c = r - t, h = o * o + a * a, f = l * l + c * c, u = 0.5 / (o * c - a * l), p = (c * h - a * f) * u, b = (o * f - l * h) * u;
  return p * p + b * b;
}
function Pr(i, t, e, n, s, r) {
  const o = e - i, a = n - t, l = s - i, c = r - t, h = o * o + a * a, f = l * l + c * c, u = 0.5 / (o * c - a * l), p = i + (c * h - a * f) * u, b = t + (o * f - l * h) * u;
  return { x: p, y: b };
}
function Vt(i, t, e, n) {
  if (n - e <= 20)
    for (let s = e + 1; s <= n; s++) {
      const r = i[s], o = t[r];
      let a = s - 1;
      for (; a >= e && t[i[a]] > o; ) i[a + 1] = i[a--];
      i[a + 1] = r;
    }
  else {
    const s = e + n >> 1;
    let r = e + 1, o = n;
    Ht(i, s, r), t[i[e]] > t[i[n]] && Ht(i, e, n), t[i[r]] > t[i[n]] && Ht(i, r, n), t[i[e]] > t[i[r]] && Ht(i, e, r);
    const a = i[r], l = t[a];
    for (; ; ) {
      do
        r++;
      while (t[i[r]] < l);
      do
        o--;
      while (t[i[o]] > l);
      if (o < r) break;
      Ht(i, r, o);
    }
    i[e + 1] = i[o], i[o] = a, n - r + 1 >= o - e ? (Vt(i, t, r, n), Vt(i, t, e, o - 1)) : (Vt(i, t, e, o - 1), Vt(i, t, r, n));
  }
}
function Ht(i, t, e) {
  const n = i[t];
  i[t] = i[e], i[e] = n;
}
function Xr(i) {
  return i[0];
}
function Yr(i) {
  return i[1];
}
class Rr {
  bs;
  width;
  constructor(t, e) {
    this.width = t, this.bs = e;
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
      let s = 0;
      for (; this.bs[n] && s < this.width; )
        this.bs[n] & 1 << s && t(n * this.width + s), s++;
    }
    return this;
  }
}
class fn extends Rr {
  constructor(t) {
    super(8, new Uint8Array(Math.ceil(t / 8)).fill(0));
  }
}
function At(i) {
  return i % 3 === 2 ? i - 2 : i + 1;
}
function _t(i) {
  return i % 3 === 0 ? i + 2 : i - 1;
}
function hn(i, t, e, n, s, r, o, a) {
  const l = dt(i, t, s, r, o, a), c = dt(e, n, s, r, o, a);
  if (l > 0 && c > 0 || l < 0 && c < 0)
    return !1;
  const h = dt(s, r, i, t, e, n), f = dt(o, a, i, t, e, n);
  return h > 0 && f > 0 || h < 0 && f < 0 ? !1 : l === 0 && c === 0 && h === 0 && f === 0 ? !(Math.max(s, o) < Math.min(i, e) || Math.max(i, e) < Math.min(s, o) || Math.max(r, a) < Math.min(t, n) || Math.max(t, n) < Math.min(r, a)) : !0;
}
class Lr {
  /**
   * The triangulation object from Delaunator.
   */
  del;
  constructor(t) {
    this.del = t;
  }
}
class De extends Lr {
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
    const n = 2 ** 32 - 1, s = t.coords.length >> 1, r = t.triangles.length;
    this.vertMap = new Uint32Array(s).fill(n), this.flips = new fn(r), this.consd = new fn(r);
    for (let o = 0; o < r; o++) {
      const a = t.triangles[o];
      this.vertMap[a] === n && this.updateVert(o);
    }
    e && this.constrainAll(e);
  }
  /**
   * Constrain the triangulation such that there is an edge between p1 and p2.
   */
  constrainOne(t, e) {
    const { triangles: n, halfedges: s } = this.del;
    this.assertVertex(t, t, e), this.assertVertex(e, t, e), this.assertInTriangulation(t, t, e), this.assertInTriangulation(e, t, e);
    const r = this.vertMap[t], o = this.maxConstrainSteps();
    let a = 0, l = r;
    do {
      if (++a > o)
        throw new Error(
          `Constraining edge [${t}, ${e}] exceeded the iteration limit`
        );
      const f = n[l], u = At(l);
      if (f === e)
        return this.protect(l);
      const p = _t(l), b = n[p];
      if (b === e)
        return this.protect(u), u;
      if (this.intersectSegments(t, e, b, f)) {
        l = p;
        break;
      }
      l = s[u];
    } while (l !== -1 && l !== r);
    let c = l, h = -1;
    for (; l !== -1; ) {
      if (++a > o)
        throw new Error(
          `Constraining edge [${t}, ${e}] exceeded the iteration limit`
        );
      const f = s[l], u = _t(l), p = _t(f), b = At(f);
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
        n[p]
      )) {
        if (h === -1 && (h = l), n[p] === e) {
          if (l === h)
            throw new Error("Infinite loop: non-convex quadrilateral");
          l = h, h = -1;
          continue;
        }
        if (this.intersectSegments(
          t,
          e,
          n[p],
          n[f]
        ))
          l = p;
        else if (this.intersectSegments(
          t,
          e,
          n[b],
          n[p]
        ))
          l = b;
        else if (h === l)
          throw new Error("Infinite loop: no further intersect after non-convex");
        continue;
      }
      if (this.flipDiagonal(l), this.intersectSegments(
        t,
        e,
        n[u],
        n[p]
      ) && (h === -1 && (h = u), h === u))
        throw new Error("Infinite loop: flipped diagonal still intersects");
      n[p] === e ? (c = p, l = h, h = -1) : this.intersectSegments(
        t,
        e,
        n[b],
        n[p]
      ) && (l = b);
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
    const { halfedges: e } = this.del, n = this.flips, s = this.consd, r = e.length;
    let o;
    do {
      o = 0;
      for (let a = 0; a < r; a++) {
        if (s.has(a))
          continue;
        n.delete(a);
        const l = e[a];
        l !== -1 && (n.delete(l), this.isDelaunay(a) || (this.flipDiagonal(a), o++));
      }
    } while (t && o > 0);
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
    const { triangles: n, halfedges: s } = this.del, r = n.length / 3, o = (b, g, M) => {
      const O = t(g), m = t(M);
      return t(b).some((v) => O.includes(v) && m.includes(v));
    }, a = (b) => o(n[b * 3], n[b * 3 + 1], n[b * 3 + 2]), l = (b, g, M, O) => Math.sign(dt(b[g * 2], b[g * 2 + 1], b[M * 2], b[M * 2 + 1], b[O * 2], b[O * 2 + 1])), c = e.map((b) => {
      let g = 0;
      for (let M = 0; M < r; M++) g += l(b, n[M * 3], n[M * 3 + 1], n[M * 3 + 2]);
      return g < 0 ? -1 : 1;
    }), h = (b) => {
      if (this.consd.has(b)) return !1;
      const g = s[b];
      if (g === -1) return !1;
      const M = n[b], O = n[At(b)], m = n[_t(b)], v = n[_t(g)];
      return e.every((d, x) => l(d, m, M, v) === c[x] && l(d, v, O, m) === c[x]);
    };
    let f = 0, u = !0;
    for (; u; ) {
      u = !1;
      for (let b = 0; b < r; b++)
        if (a(b))
          for (let g = 0; g < 3; g++) {
            const M = b * 3 + g;
            if (!h(M)) continue;
            const O = s[M], m = n[M], v = n[At(M)], d = n[_t(M)], x = n[_t(O)];
            if (!(o(d, m, x) && o(x, v, d))) {
              this.protect(this.flipDiagonal(M)), f++, u = !0;
              break;
            }
          }
    }
    let p = 0;
    for (let b = 0; b < r; b++) a(b) && p++;
    return { flips: f, remaining: p };
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
    const n = this.vertMap[e], { triangles: s, halfedges: r } = this.del;
    if (!(n < s.length))
      return 1 / 0;
    let o = n, a, l = 0;
    do {
      if (++l > s.length)
        throw new Error(
          `Looking up edge [${t}, ${e}] exceeded the iteration limit`
        );
      if (s[o] === t)
        return o;
      a = At(o), o = r[a];
    } while (o !== -1 && o !== n);
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
    const r = e[t];
    return r !== -1 && (n.add(t), n.add(r)), !0;
  }
  /**
   * Flip the edge shared by two triangles.
   */
  flipDiagonal(t) {
    const { triangles: e, halfedges: n } = this.del, s = this.flips, r = this.consd, o = n[t], a = _t(t), l = At(t), c = _t(o), h = At(o), f = n[a], u = n[c];
    if (r.has(t))
      throw new Error("Trying to flip a constrained edge");
    return e[t] = e[c], n[t] = u, s.set(t, s.has(c)) || r.set(t, r.has(c)), u !== -1 && (n[u] = t), n[a] = c, e[o] = e[a], n[o] = f, s.set(o, s.has(a)) || r.set(o, r.has(a)), f !== -1 && (n[f] = o), n[c] = a, this.markFlip(t), this.markFlip(l), this.markFlip(o), this.markFlip(h), s.add(a), r.delete(a), s.add(c), r.delete(c), this.updateVert(t), this.updateVert(l), this.updateVert(o), this.updateVert(h), a;
  }
  /**
   * Whether point p1, p2, and p are collinear.
   */
  isCollinear(t, e, n) {
    const s = this.del.coords;
    return dt(
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
    const r = this.del.coords;
    return nr(
      r[t * 2],
      r[t * 2 + 1],
      r[e * 2],
      r[e * 2 + 1],
      r[n * 2],
      r[n * 2 + 1],
      r[s * 2],
      r[s * 2 + 1]
    ) < 0;
  }
  /**
   * Whether the triangles sharing edg conform to the Delaunay condition.
   */
  isDelaunay(t) {
    const { triangles: e, halfedges: n } = this.del, s = n[t];
    if (s === -1)
      return !0;
    const r = e[_t(t)], o = e[t], a = e[At(t)], l = e[_t(s)];
    return !this.inCircle(r, o, a, l);
  }
  /**
   * Update the vertex -> incoming edge map.
   */
  updateVert(t) {
    const { triangles: e, halfedges: n } = this.del, s = this.vertMap, r = e[t];
    let o = _t(t), a = n[o];
    for (; a !== -1 && a !== t; )
      o = _t(a), a = n[o];
    return s[r] = o, o;
  }
  /**
   * Whether the segments between vertices intersect.
   */
  intersectSegments(t, e, n, s) {
    const r = this.del.coords;
    return t === n || t === s || e === n || e === s ? !1 : hn(
      r[t * 2],
      r[t * 2 + 1],
      r[e * 2],
      r[e * 2 + 1],
      r[n * 2],
      r[n * 2 + 1],
      r[s * 2],
      r[s * 2 + 1]
    );
  }
  static intersectSegments = hn;
}
function de(i, t, e) {
  return Ne(i, t, e).tin;
}
function Ne(i, t, e, n) {
  if (t || (t = []), typeof i != "object" || i.type !== "FeatureCollection")
    throw "Argument points must be FeatureCollection";
  if (!Array.isArray(t)) throw "Argument points must be Array of Array";
  const s = i.features.map(
    (u) => u.geometry.coordinates
  );
  let r = Zt.from(s), o = 0, a;
  const l = [];
  if (r.triangles.length !== 0 && (t.length !== 0 || n)) {
    let u = new De(r);
    try {
      u.constrainAll(t);
    } catch (p) {
      if (!n?.allowUnusableBoundary) throw p;
      return { tin: xt([]), remaining: 0, hasBoundary: !1, hull: [] };
    }
    for (const p of n?.hull ?? [])
      try {
        u.constrainOne(p[0], p[1]), l.push(p);
      } catch {
        r = Zt.from(s), u = new De(r, [...t, ...l]);
      }
    n?.boundary && (a = qr(u, n.boundary), a || (r = Zt.from(s), u = new De(r, [...t, ...l]))), n && ({ remaining: o } = u.forbidGroupTriangles(
      n.groupsOf,
      n.planes
    ), o -= a?.size ?? 0);
  }
  const c = [];
  for (let u = 0; u < r.triangles.length; u += 3)
    a?.has(u / 3) || c.push([r.triangles[u], r.triangles[u + 1], r.triangles[u + 2]]);
  const h = ["a", "b", "c"];
  return { tin: xt(
    c.map((u) => {
      const p = {}, b = u.map((g, M) => {
        const O = i.features[g], m = O.geometry.coordinates, v = [m[0], m[1]];
        return m.length === 3 ? v[2] = m[2] : p[h[M]] = O.properties[e], v;
      });
      return b[3] = b[0], re([b], p);
    })
  ), remaining: o, hasBoundary: a !== void 0, hull: l };
}
function qr(i, t) {
  try {
    i.constrainAll(t);
  } catch {
    return;
  }
  const e = new Map(t), { triangles: n, halfedges: s } = i.del, r = (c) => {
    const h = n[c], f = n[At(c)];
    return e.get(h) === f || e.get(f) === h;
  }, o = /* @__PURE__ */ new Set(), a = [], l = (c) => {
    const h = Math.floor(c / 3);
    o.has(h) || (o.add(h), a.push(h));
  };
  for (let c = 0; c < s.length; c++)
    s[c] === -1 && !r(c) && l(c);
  for (let c = 0; c < a.length; c++)
    for (let h = a[c] * 3; h < a[c] * 3 + 3; h++) {
      if (!e.has(n[h])) return;
      s[h] !== -1 && !r(h) && l(s[h]);
    }
  return o;
}
function un(i) {
  const t = /* @__PURE__ */ new Set(), e = [];
  if (i.forEach(([l, c], h) => {
    const f = `${l}:${c}`;
    t.has(f) || (t.add(f), e.push({ i: h, x: l, y: c }));
  }), e.length < 3) return [];
  const n = (l, c, h) => dt(l.x, l.y, c.x, c.y, h.x, h.y), s = [...e].sort((l, c) => l.x - c.x || l.y - c.y), r = (l) => {
    const c = [];
    for (const h of l) {
      for (; c.length >= 2 && n(c[c.length - 2], c[c.length - 1], h) <= 0; ) c.pop();
      c.push(h);
    }
    return c.pop(), c;
  }, o = [...r(s), ...r([...s].reverse())];
  if (o.length < 3) return [];
  const a = [];
  for (let l = 0; l < o.length; l++) {
    const c = o[l], h = o[(l + 1) % o.length], f = h.x - c.x, u = h.y - c.y, p = f * f + u * u, b = e.filter((M) => M !== c && M !== h && n(c, h, M) === 0).map((M) => ({ r: M, t: ((M.x - c.x) * f + (M.y - c.y) * u) / p })).filter(({ t: M }) => M > 0 && M < 1).sort((M, O) => M.t - O.t).map(({ r: M }) => M), g = [c, ...b, h];
    for (let M = 0; M + 1 < g.length; M++) a.push([g[M].i, g[M + 1].i]);
  }
  return a;
}
function ye([i, t]) {
  return i < t ? `${i}-${t}` : `${t}-${i}`;
}
function Kt(i, t, e) {
  return Rt(i, { target: { geom: t, index: e } });
}
function Wt(i) {
  return Rt(i.properties.target.geom, {
    target: {
      geom: i.geometry.coordinates,
      index: i.properties.target.index
    }
  });
}
function dn(i, t) {
  const e = i.length, n = t.geometry.coordinates;
  return Array.from({ length: e }, (s, r) => r).map((s) => {
    const r = (s + 1) % e, o = i[s], a = i[r], l = o.geometry.coordinates, c = Math.atan2(
      l[0] - n[0],
      l[1] - n[1]
    ), h = [t, o, a, t].map(
      (p) => p.geometry.coordinates
    ), f = {
      a: {
        geom: t.properties.target.geom,
        index: t.properties.target.index
      },
      b: {
        geom: o.properties.target.geom,
        index: o.properties.target.index
      },
      c: {
        geom: a.properties.target.geom,
        index: a.properties.target.index
      }
    }, u = xt([
      re([h], f)
    ]);
    return [c, u];
  }).reduce(
    (s, r) => (s[0].push(r[0]), s[1].push(r[1]), s),
    [[], []]
  );
}
const Vr = [0.1, 0.15, 0.225, 0.34, 0.5];
function jr(i, t) {
  return t ? i.hasBoundary !== t.hasBoundary ? i.hasBoundary : i.diagnostics.boundaryTriangleFlips < t.diagnostics.boundaryTriangleFlips : !0;
}
function pn(i, t, e) {
  return Math.sign(dt(i[0], i[1], t[0], t[1], e[0], e[1]));
}
function ve(i, t = -1) {
  let e = 0;
  for (const n of i.features) {
    const { a: s, b: r, c: o } = n.properties;
    if (![s, r, o].some(
      ({ index: f }) => typeof f == "string" && f.startsWith("b")
    ))
      continue;
    const [a, l, c] = n.geometry.coordinates[0];
    pn(a, l, c) * pn(s.geom, r.geom, o.geom) * t <= 0 && e++;
  }
  return e;
}
function mn(i, t, e) {
  if (i.some(([o, a]) => o === t[0] && a === t[1])) return !1;
  const n = i.map(
    ([o, a]) => Math.atan2(a - t[1], o - t[0])
  ), s = 2 * Math.PI;
  let r = 0;
  for (let o = 0; o < n.length; o++) {
    const l = (e * (n[(o + 1) % n.length] - n[o]) + s) % s;
    if (!(l > 0 && l < Math.PI)) return !1;
    r += l;
  }
  return Math.abs(r - s) < 1e-6;
}
function gn(i, t, e, n, s, r = /* @__PURE__ */ new Set()) {
  const { minx: o, maxx: a, miny: l, maxy: c, centroid: h } = i, f = a - o, u = c - l, p = e.forw.length, b = Array.from({ length: p }, () => []);
  let g = 1;
  for (const [_, S] of e.edges)
    _ < n && b[_].push(g), b[S].push(g), S < n && g++;
  const M = (_) => _.slice(0, p).map(({ geometry: S }) => S.coordinates), O = un(M(e.forw)), m = {
    forw: O.filter((_) => !r.has(ye(_))),
    bakw: un(M(e.bakw))
  }, v = [0], d = (_) => _ >= p ? v : b[_];
  let x;
  for (const _ of Vr) {
    const S = t(
      {
        ...i,
        minx: o - _ * f,
        maxx: a + _ * f,
        miny: l - _ * u,
        maxy: c + _ * u
      },
      !0
    );
    if (s && (S.length < 4 || !S.every(({ bakw: P }) => P.every(Number.isFinite)))) continue;
    const B = S.map(
      ({ forw: P, bakw: X }, L) => Kt(P, X, `b${L}`)
    ), A = xt([...e.forw, ...B]), I = xt([
      ...e.bakw,
      ...B.map(Wt)
    ]), C = [A, I].map(
      ({ features: P }) => Float64Array.from(
        P.flatMap(
          ({
            geometry: {
              coordinates: [X, L]
            }
          }) => [X, L]
        )
      )
    ), Y = s !== void 0 || mn(
      S.map((P) => P.forw),
      h.forw,
      -1
    ) && mn(
      S.map((P) => P.bakw),
      h.bakw,
      1
    ) ? S.map((P, X) => [
      p + X,
      p + (X + 1) % S.length
    ]) : void 0, w = { groupsOf: d, planes: C, boundary: Y, allowUnusableBoundary: s !== void 0 }, E = Ne(A, e.edges, "target", {
      ...w,
      hull: m.forw
    }), k = Ne(I, e.edges, "target", {
      ...w,
      hull: m.bakw
    }), F = E.tin, D = k.tin, $ = s?.orientation ?? -1, y = ve(F, $) + ve(D, $), T = {
      vertices: S,
      forw: F,
      bakw: D,
      diagnostics: {
        margin: _,
        boundaryTriangleFlips: y,
        remainingForbiddenTriangles: E.remaining + k.remaining
      },
      hasMapBoundary: E.hasBoundary,
      hasBoundary: E.hasBoundary && k.hasBoundary,
      forwHull: { all: O, applied: E.hull }
    };
    if (s) {
      if (s.accept(T)) return T;
      continue;
    }
    if (y === 0 && T.hasBoundary)
      return T;
    jr(T, x) && (x = T);
  }
  return x;
}
const wn = 1e-9;
function Ur(i, t) {
  const e = [[], [], [], []], n = [];
  return Object.keys(i).forEach((s) => {
    const r = i[s], o = r.forw, a = r.bakw, l = [
      o[0] - t.forw[0],
      o[1] - t.forw[1]
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
function zr(i) {
  let t = 1 / 0, e = 0, n = 0;
  return i.forEach((s) => {
    const { forw: r, bakw: o } = s, a = Math.hypot(r[0], r[1]), l = Math.hypot(o[0], o[1]);
    if (l === 0) return;
    const c = a / l, h = Math.atan2(r[0], r[1]) - Math.atan2(o[0], o[1]);
    t = Math.min(t, c), e += Math.cos(h), n += Math.sin(h);
  }), isFinite(t) ? [t, Math.atan2(n, e)] : [1, 0];
}
function Hr(i, t, e) {
  const { perQuad: n, aggregate: s } = Ur(i, t), r = n.every((l) => l.length > 0), a = (e === "birdeye" ? r ? n : [s] : [s]).map((l) => zr(l));
  return a.length === 1 ? [a[0], a[0], a[0], a[0]] : a;
}
function Gr(i, t) {
  let e = 0;
  return i[0] > t[0] && (e += 1), i[1] > t[1] && (e += 2), e;
}
function Kr(i, t, e) {
  const n = [
    i[0] - t.forw[0],
    i[1] - t.forw[1]
  ], r = Math.sqrt(n[0] ** 2 + n[1] ** 2) / e[0], o = Math.atan2(n[0], n[1]) - e[1];
  return [
    t.bakw[0] + r * Math.sin(o),
    t.bakw[1] - r * Math.cos(o)
  ];
}
function Wr(i, t, e, n) {
  const s = t[0] - i[0], r = t[1] - i[1];
  if (Math.abs(s) < 1e-12 && Math.abs(r) < 1e-12) return null;
  const o = n[0] - e[0], a = n[1] - e[1], l = e[0] - i[0], c = e[1] - i[1], h = s * a - r * o;
  if (Math.abs(h) < 1e-12) return null;
  const f = (l * a - c * o) / h, u = (l * r - c * s) / h;
  return f <= 1e-10 || u < -1e-10 || u > 1 + 1e-10 ? null : { t: f, point: [i[0] + f * s, i[1] + f * r] };
}
function Jr(i, t, e) {
  const n = e.length;
  let s = -1 / 0, r = null;
  for (let o = 0; o < n; o++) {
    const a = (o + 1) % n, l = Wr(
      i,
      t,
      e[o].bakw,
      e[a].bakw
    );
    l && l.t > s && (s = l.t, r = l.point);
  }
  return r;
}
function yn(i, t) {
  const n = Math.atan2(i[0] - t[0], i[1] - t[1]) * (180 / Math.PI);
  return n < 0 ? n + 360 : n;
}
function vn(i, t, e, n, s, r) {
  const o = t[0] - i[0], a = t[1] - i[1];
  if (o === 0 && a === 0) return null;
  const l = [];
  if (o !== 0)
    for (const h of [e, n]) {
      const f = (h - i[0]) / o;
      if (f > 0) {
        const u = i[1] + f * a;
        u >= s && u <= r && l.push({ t: f, x: h, y: u });
      }
    }
  if (a !== 0)
    for (const h of [s, r]) {
      const f = (h - i[1]) / a;
      if (f > 0) {
        const u = i[0] + f * o;
        u >= e && u <= n && l.push({ t: f, x: u, y: h });
      }
    }
  if (l.length === 0) return null;
  l.sort((h, f) => h.t - f.t);
  const c = l[0];
  return [c.x, c.y];
}
function bn(i, t, e) {
  const n = i.length, s = new Array(n).fill(1);
  for (const r of t)
    for (let o = 0; o < n; o++) {
      const a = (o + 1) % n, l = Ve([i[o].bakw, i[a].bakw]), c = Ve([e.bakw, r.bakw]), h = vr(l, c);
      if (h.features.length > 0 && h.features[0].geometry) {
        const f = h.features[0], u = Math.sqrt(
          Math.pow(r.bakw[0] - e.bakw[0], 2) + Math.pow(r.bakw[1] - e.bakw[1], 2)
        ), p = Math.sqrt(
          Math.pow(f.geometry.coordinates[0] - e.bakw[0], 2) + Math.pow(f.geometry.coordinates[1] - e.bakw[1], 2)
        ), b = u / p;
        b > s[o] && (s[o] = b), b > s[a] && (s[a] = b);
      }
    }
  i.forEach((r, o) => {
    const a = s[o];
    r.bakw = [
      (r.bakw[0] - e.bakw[0]) * a + e.bakw[0],
      (r.bakw[1] - e.bakw[1]) * a + e.bakw[1]
    ];
  });
}
function Ye(i, t, e, n) {
  const { convexBuf: s, centroid: r, allGcps: o, minx: a, maxx: l, miny: c, maxy: h } = i, f = n ? void 0 : Hr(s, r, t), p = [
    [a, c],
    [l, c],
    [l, h],
    [a, h]
  ].map((S) => ({
    forw: S,
    bakw: n ? n(S) : Kr(
      S,
      r,
      f[Gr(S, r.forw)]
    )
  }));
  if (p.sort(
    (S, B) => Math.atan2(S.forw[0] - r.forw[0], S.forw[1] - r.forw[1]) - Math.atan2(B.forw[0] - r.forw[0], B.forw[1] - r.forw[1])
  ), n || bn(p, o, r), !e) return p;
  const b = 4, g = p.map(
    (S) => Math.atan2(S.forw[0] - r.forw[0], S.forw[1] - r.forw[1])
  ), M = p.map(
    (S) => Math.atan2(
      S.bakw[0] - r.bakw[0],
      -(S.bakw[1] - r.bakw[1])
    )
  );
  function O(S) {
    for (let B = 0; B < b; B++) {
      const A = (B + 1) % b, I = g[B], C = B < b - 1 ? g[A] : g[A] + 2 * Math.PI;
      let N = S;
      for (; N < I; ) N += 2 * Math.PI;
      for (; N >= I + 2 * Math.PI; ) N -= 2 * Math.PI;
      if (N >= I && N < C)
        return { i: B, j: A, frac: (N - I) / (C - I) };
    }
    return { i: 0, j: 1, frac: 0 };
  }
  function m(S) {
    const { i: B, j: A, frac: I } = O(S), C = M[B];
    let Y = M[A] - C;
    for (; Y > Math.PI; ) Y -= 2 * Math.PI;
    for (; Y < -Math.PI; ) Y += 2 * Math.PI;
    return C + I * Y;
  }
  const v = new Set(
    p.map(
      (S) => Math.floor(yn(S.forw, r.forw) / 10) % 36
    )
  ), d = o.map((S) => ({
    forw: S.forw,
    bakw: S.bakw,
    angleDeg: yn(S.forw, r.forw),
    forwDist: Math.hypot(S.forw[0] - r.forw[0], S.forw[1] - r.forw[1])
  })), x = [];
  for (let S = 0; S < 36; S++) {
    if (v.has(S)) continue;
    const B = S * 10, A = d.filter(($) => {
      if ($.forwDist === 0) return !1;
      const y = (($.angleDeg - B) % 360 + 360) % 360;
      return y < 10 + wn || y > 360 - wn;
    });
    let I = null;
    if (A.length > 0) {
      const $ = A.reduce((y, T) => T.forwDist > y.forwDist ? T : y);
      I = vn(r.forw, $.forw, a, l, c, h);
    }
    if (!I) {
      const $ = (B + 5) % 360 * (Math.PI / 180), y = [
        r.forw[0] + Math.sin($),
        r.forw[1] + Math.cos($)
      ];
      I = vn(r.forw, y, a, l, c, h);
    }
    if (!I) continue;
    const [C, N] = I, Y = 1e-9 * Math.max(l - a, h - c);
    if ([...p, ...x].some(
      ($) => Math.abs($.forw[0] - C) <= Y && Math.abs($.forw[1] - N) <= Y
    )) continue;
    if (n) {
      x.push({ forw: I, bakw: n(I) });
      continue;
    }
    const w = [I[0] - r.forw[0], I[1] - r.forw[1]], E = Math.atan2(w[0], w[1]), k = m(E), F = [
      r.bakw[0] + Math.sin(k),
      r.bakw[1] - Math.cos(k)
    ], D = Jr(r.bakw, F, p);
    D && x.push({ forw: I, bakw: D });
  }
  const _ = [...p, ...x];
  return _.sort(
    (S, B) => Math.atan2(S.forw[0] - r.forw[0], S.forw[1] - r.forw[1]) - Math.atan2(B.forw[0] - r.forw[0], B.forw[1] - r.forw[1])
  ), n || bn(_, o, r), _;
}
function Qr(i, t = !1) {
  return Ye(i, "plain", t);
}
function Zr(i, t = !1) {
  return Ye(i, "birdeye", t);
}
function ti(i, t) {
  const e = /* @__PURE__ */ new Set();
  return Ye(i, "plain", !0, t).filter(({ forw: [n, s] }) => {
    const r = `${n}:${s}`;
    return e.has(r) ? !1 : (e.add(r), !0);
  });
}
function Yi(i) {
  return Dn(i, 1 / 0);
}
const xn = 1e5, ei = 16;
function Dn(i, t) {
  return ni(i), new ri(i).findSegmentIntersections(t).map(
    (s) => Rt([s.x, s.y])
  );
}
function ni(i) {
  for (let t = 0, e = i.length; t < e; t++) {
    const n = i[t];
    ee(n) || Yt(
      "findIntersections() received invalid coordinates:",
      `line=${t}`,
      `points=${n}`
    );
    for (let s = 0, r = n.length; s < r; s++) {
      const o = n[s];
      (!ee(o) || !Number.isFinite(o[0]) || !Number.isFinite(o[1])) && Yt(
        "findIntersections() received non-finite coordinates:",
        `line=${t}`,
        `point=${s}`,
        `coordinates=${JSON.stringify(o)}`
      );
    }
  }
}
class ri {
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
    const e = [], n = [], s = t.map((r) => {
      const o = r ? r.length : 0;
      for (let a = 0; a < o; a++)
        e.push(r[a][0]), n.push(r[a][1]);
      return o;
    });
    this.initXYData(s, e, n);
  }
  initXYData(t, e, n) {
    const s = t.length;
    this._xx = new Float64Array(e), this._yy = new Float64Array(n), this._nn = new Uint32Array(t), this._zz = null, this._zlimit = 0, this._filteredArcIter = null, this._ii = new Uint32Array(s);
    let r = 0;
    for (let o = 0; o < s; o++)
      this._ii[o] = r, r += t[o];
    (r != this._xx.length || this._xx.length != this._yy.length) && Yt("ArcCollection#initXYData() Counting error"), this.initBounds(), this._arcIter = new Si(this._xx, this._yy);
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
    const s = n.length, r = new Float64Array(s * 4), o = new ne();
    let a = 0, l, c, h;
    for (let f = 0; f < s; f++)
      l = n[f], l > 0 && (c = f * 4, h = Mi(t, e, a, l), r[c++] = h[0], r[c++] = h[1], r[c++] = h[2], r[c] = h[3], a += l, o.mergeBounds(h));
    return {
      bb: r,
      bounds: o
    };
  }
  getBounds() {
    return this._allBounds ? this._allBounds.clone() : new ne();
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
    const n = t >= 0, s = n ? t : ~t, r = this.getRetainedInterval(), o = this._nn[s], a = n ? 1 : -1;
    let l = n ? this._ii[s] : this._ii[s] + o - 1, c = l, h = 0;
    for (let f = 1; f < o; f++)
      c += a, (r === 0 || this._zz[c] >= r) && (e(l, c, this._xx, this._yy), l = c, h++);
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
      (s, r, o, a) => {
        t += Math.abs(o[s] - o[r]), e += Math.abs(a[s] - a[r]);
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
    const e = this.getBounds(), n = e.ymin || 0, s = (e.ymax || 0) - n, r = this.calcSegmentIntersectionStripeCount(), o = new Uint32Array(r), a = r > 1 ? (v) => Math.floor((r - 1) * (v - n) / s) : () => 0, l = r + 1;
    let c;
    this.forEachSegment(
      (v, d, x, _) => {
        let S = a(_[v]);
        const B = a(_[d]);
        let A = 0;
        for (; o[S] = o[S] + 2, S != B; )
          A++, A > l && Yt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${r}`,
            `s1=${S}`,
            `s2=${B}`
          ), S += B > S ? 1 : -1;
      }
    );
    const h = this.getUint32Array(oi(o));
    let f = 0;
    const u = [];
    ai(o, (v) => {
      const d = f;
      f += v, u.push(h.subarray(d, f));
    }), ci(o, 0), this.forEachSegment(
      (v, d, x, _) => {
        let S = a(_[v]);
        const B = a(_[d]);
        let A, I, C = 0;
        for (; A = o[S], o[S] = A + 2, I = u[S], I[A] = v, I[A + 1] = d, S != B; )
          C++, C > l && Yt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${r}`,
            `s1=${S}`,
            `s2=${B}`
          ), S += B > S ? 1 : -1;
      }
    );
    const p = this.getVertexData(), b = t * ei;
    let g = 0;
    const M = /* @__PURE__ */ new Set(), O = /* @__PURE__ */ new Map(), m = (v) => {
      g++;
      const d = _i(v);
      return M.has(d) || (M.add(d), O.set(`${v.x}:${v.y}`, v)), O.size >= t || g >= b;
    };
    if (p.xx && p.yy)
      for (c = 0; c < r && !li(u[c], p.xx, p.yy, m); c++)
        ;
    return Array.from(O.values());
  }
}
function Yt(...i) {
  const t = i.join(" ");
  throw new Error(t);
}
function ee(i) {
  return i ? si(i) ? !0 : ii(i) ? !1 : i.length === 0 ? !0 : i.length > 0 : !1;
}
function ii(i) {
  return i != null && i.toString === String.prototype.toString;
}
function si(i) {
  return Array.isArray(i);
}
function oi(i, t) {
  ee(i) || Yt("utils.sum() expects an array, received:", i);
  let e = 0, n;
  for (let s = 0, r = i.length; s < r; s++)
    n = i[s], n && (e += n);
  return e;
}
function ai(i, t, e) {
  if (!ee(i))
    throw new Error(`#forEach() takes an array-like argument. ${i}`);
  for (let n = 0, s = i.length; n < s; n++)
    t.call(e, i[n], n);
}
function ci(i, t) {
  for (let e = 0, n = i.length; e < n; e++)
    i[e] = t;
  return i;
}
function li(i, t, e, n) {
  const s = i.length - 2;
  let r, o, a, l, c, h, f, u, p, b, g, M, O, m, v, d, x;
  for (vi(t, i), d = 0; d < s; ) {
    for (r = i[d], o = i[d + 1], c = t[r], h = t[o], p = e[r], b = e[o], x = d; x < s && (x += 2, a = i[x], f = t[a], !(h < f)); ) {
      if (g = e[a], l = i[x + 1], u = t[l], M = e[l], p >= g) {
        if (p > M && b > g && b > M) continue;
      } else if (p < M && b < g && b < M) continue;
      if (!(r == a || r == l || o == a || o == l) && (O = fi(
        c,
        p,
        h,
        b,
        f,
        g,
        u,
        M
      ), O && (m = [r, o], v = [a, l], n(Sn(O, m, v, t, e)) || O.length == 4 && n(Sn(O.slice(2), m, v, t, e)))))
        return !0;
    }
    d += 2;
  }
  return !1;
}
function fi(i, t, e, n, s, r, o, a) {
  const l = hi(i, t, e, n, s, r, o, a);
  let c = null;
  return l && (c = ui(i, t, e, n, s, r, o, a), c ? yi(i, t, e, n, s, r, o, a) && (c = null) : c = wi(i, t, e, n, s, r, o, a)), c;
}
function hi(i, t, e, n, s, r, o, a) {
  return Jt(i, t, e, n, s, r) * Jt(i, t, e, n, o, a) <= 0 && Jt(s, r, o, a, i, t) * Jt(s, r, o, a, e, n) <= 0;
}
function Jt(i, t, e, n, s, r) {
  return Nn(i - s, t - r, e - s, n - r);
}
function Nn(i, t, e, n) {
  return i * n - t * e;
}
function ui(i, t, e, n, s, r, o, a) {
  let l = pe(i, t, e, n, s, r, o, a), c;
  return l && (c = pi(l[0], l[1], i, t, e, n, s, r, o, a), c == 1 ? l = pe(e, n, i, t, s, r, o, a) : c == 2 ? l = pe(s, r, o, a, i, t, e, n) : c == 3 && (l = pe(o, a, s, r, i, t, e, n))), l && gi(l, i, t, e, n, s, r, o, a), l;
}
function pe(i, t, e, n, s, r, o, a) {
  const l = Nn(e - i, n - t, o - s, a - r), c = 1e-18;
  let h;
  if (l === 0) return null;
  const f = Jt(s, r, o, a, i, t) / l;
  return l <= c && l >= -c ? h = di(i, t, e, n, s, r, o, a) : h = [i + f * (e - i), t + f * (n - t)], h;
}
function di(i, t, e, n, s, r, o, a) {
  let l = null;
  return !It(i, s, o) && !It(t, r, a) ? l = [i, t] : !It(e, s, o) && !It(n, r, a) ? l = [e, n] : !It(s, i, e) && !It(r, t, n) ? l = [s, r] : !It(o, i, e) && !It(a, t, n) && (l = [o, a]), l;
}
function It(i, t, e) {
  let n;
  return t < e ? n = i < t || i > e : t > e ? n = i > t || i < e : n = i != t, n;
}
function pi(i, t, ...e) {
  let n = -1, s = 1 / 0, r;
  for (let o = 0, a = 0, l = e.length; a < l; o++, a += 2)
    r = mi(i, t, e[a], e[a + 1]), r < s && (s = r, n = o);
  return n;
}
function mi(i, t, e, n) {
  const s = i - e, r = t - n;
  return s * s + r * r;
}
function gi(i, t, e, n, s, r, o, a, l) {
  let c = i[0], h = i[1];
  c = me(c, t, n), c = me(c, r, a), h = me(h, e, s), h = me(h, o, l), i[0] = c, i[1] = h;
}
function me(i, t, e) {
  let n;
  return It(i, t, e) && (n = Math.abs(i - t) < Math.abs(i - e) ? t : e, i = n), i;
}
function wi(i, t, e, n, s, r, o, a) {
  const l = Math.min(i, e, s, o), c = Math.max(i, e, s, o), h = Math.min(t, n, r, a), f = Math.max(t, n, r, a), u = f - h > c - l;
  let p = [];
  return (u ? Nt(t, h, f) : Nt(i, l, c)) && p.push(i, t), (u ? Nt(n, h, f) : Nt(e, l, c)) && p.push(e, n), (u ? Nt(r, h, f) : Nt(s, l, c)) && p.push(s, r), (u ? Nt(a, h, f) : Nt(o, l, c)) && p.push(o, a), (p.length != 2 && p.length != 4 || p.length == 4 && p[0] == p[2] && p[1] == p[3]) && (p = null), p;
}
function yi(i, t, e, n, s, r, o, a) {
  return i == s && t == r || i == o && t == a || e == s && n == r || e == o && n == a;
}
function Nt(i, t, e) {
  return i > t && i < e;
}
function vi(i, t) {
  bi(i, t), $n(i, t, 0, t.length - 2);
}
function bi(i, t) {
  for (let e = 0, n = t.length; e < n; e += 2)
    i[t[e]] > i[t[e + 1]] && xi(t, e, e + 1);
}
function xi(i, t, e) {
  const n = i[t];
  i[t] = i[e], i[e] = n;
}
function $n(i, t, e, n) {
  let s = e, r = n, o, a;
  for (; s < n; ) {
    for (o = i[t[e + n >> 2 << 1]]; s <= r; ) {
      for (; i[t[s]] < o; ) s += 2;
      for (; i[t[r]] > o; ) r -= 2;
      s <= r && (a = t[s], t[s] = t[r], t[r] = a, a = t[s + 1], t[s + 1] = t[r + 1], t[r + 1] = a, s += 2, r -= 2);
    }
    if (r - e < 40 ? _n(i, t, e, r) : $n(i, t, e, r), n - s < 40) {
      _n(i, t, s, n);
      return;
    }
    e = s, r = n;
  }
}
function _n(i, t, e, n) {
  let s, r;
  for (let o = e + 2; o <= n; o += 2) {
    s = t[o], r = t[o + 1];
    let a;
    for (a = o - 2; a >= e && i[s] < i[t[a]]; a -= 2)
      t[a + 2] = t[a], t[a + 3] = t[a + 1];
    t[a + 2] = s, t[a + 3] = r;
  }
}
function Sn(i, t, e, n, s) {
  const r = i[0], o = i[1];
  t = Mn(r, o, t[0], t[1], n, s), e = Mn(r, o, e[0], e[1], n, s);
  const a = t[0] < e[0] ? t : e, l = a == t ? e : t;
  return { x: r, y: o, a, b: l };
}
function Mn(i, t, e, n, s, r) {
  let o = e < n ? e : n, a = o === e ? n : e;
  return s[o] == i && r[o] == t ? a = o : s[a] == i && r[a] == t && (o = a), [o, a];
}
function _i(i) {
  return `${i.a.join(",")};${i.b.join(",")}`;
}
class Si {
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
function Mi(i, t, e, n) {
  let s = e | 0;
  const r = isNaN(n) ? i.length - s : n + s;
  let o, a, l, c, h, f;
  if (r > 0)
    l = h = i[s], c = f = t[s];
  else return [void 0, void 0, void 0, void 0];
  for (s++; s < r; s++)
    o = i[s], a = t[s], o < l && (l = o), o > h && (h = o), a < c && (c = a), a > f && (f = a);
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
  setBounds(t, e, n, s) {
    let r, o, a, l;
    if (arguments.length == 1)
      if (ee(t)) {
        const c = t;
        r = c[0], o = c[1], a = c[2], l = c[3];
      } else {
        const c = t;
        r = c.xmin, o = c.ymin, a = c.xmax, l = c.ymax;
      }
    else
      r = t, o = e, a = n, l = s;
    return this.xmin = r, this.ymin = o, this.xmax = a, this.ymax = l, (r > a || o > l) && this.update(), this;
  }
  update() {
    let t;
    this.xmin > this.xmax && (t = this.xmin, this.xmin = this.xmax, this.xmax = t), this.ymin > this.ymax && (t = this.ymin, this.ymin = this.ymax, this.ymax = t);
  }
  mergeBounds(t, ...e) {
    let n, s, r, o;
    return t instanceof ne ? (n = t.xmin, s = t.ymin, r = t.xmax, o = t.ymax) : e.length == 3 ? (n = t, s = e[0], r = e[1], o = e[2]) : t.length == 4 ? (n = t[0], s = t[1], r = t[2], o = t[3]) : Yt("Bounds#mergeBounds() invalid argument:", t), this.xmin === void 0 ? this.setBounds(n, s, r, o) : (n < this.xmin && (this.xmin = n), s < this.ymin && (this.ymin = s), r > this.xmax && (this.xmax = r), o > this.ymax && (this.ymax = o)), this;
  }
}
function be(i) {
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
function Pn(i, t, e) {
  const n = be(t.forw), s = be(t.bakw);
  if (JSON.stringify(n) != JSON.stringify(s))
    throw `${JSON.stringify(t, null, 2)}
${JSON.stringify(
      n
    )}
${JSON.stringify(s)}`;
  for (let r = 0; r < n.length; r++) {
    const o = n[r];
    i[o] || (i[o] = []), i[o].push(t);
  }
  e && (e.forw.features.push(t.forw), e.bakw.features.push(t.bakw));
}
function kn(i, t, e) {
  const n = be(t.forw), s = be(t.bakw);
  if (JSON.stringify(n) != JSON.stringify(s))
    throw `${JSON.stringify(t, null, 2)}
${JSON.stringify(n)}
${JSON.stringify(s)}`;
  if (n.forEach((r) => {
    const o = i[r];
    if (!o) return;
    const a = o.filter((l) => l !== t);
    a.length === 0 ? delete i[r] : i[r] = a;
  }), e) {
    const r = (o, a) => {
      !o || !a || (o.features = o.features.filter((l) => l !== a));
    };
    r(e.forw, t.forw), r(e.bakw, t.bakw);
  }
}
function ge(i, t = 1e-6) {
  const [e, n] = i[0], [s, r] = i[1], [o, a] = i[2];
  return Math.abs((s - e) * (a - n) - (o - e) * (r - n)) < t;
}
function ki(i, t) {
  const e = /* @__PURE__ */ new Set();
  return i.forEach((n) => {
    if (n.length !== 2) return;
    const s = n.map((r) => `${t?.[r] ?? r}`);
    e.add(s.sort().join("-"));
  }), e;
}
function Qt(i) {
  return ["a", "b", "c"].map((t, e) => ({
    prop: i.properties[t],
    geom: i.geometry.coordinates[0][e]
  }));
}
const Ei = 10;
function Ai(i, t, e, n, s, r) {
  if (!i && !t) return !1;
  const o = i ? 0 : 1, a = 1 - o, l = e[o], c = e[a];
  if (!l || !c) return !1;
  const h = bt(c.geom);
  let f = !1, u = !1;
  for (let p = 0; p <= 1; p++) {
    const b = n[p];
    if (!b) continue;
    const g = [String(b.prop.index), String(l.prop.index)].sort().join("-"), M = s[g];
    if (!M || M.length < 2) continue;
    const O = M.find(
      (C) => C.bakw !== r[o].bakw
    );
    if (!O) continue;
    const v = Qt(O.bakw).find(
      (C) => String(C.prop.index) !== String(b.prop.index) && String(C.prop.index) !== String(l.prop.index)
    );
    if (!v) continue;
    f = !0;
    const d = bt(v.geom), x = bt(b.geom), _ = bt(l.geom), S = _[0] - x[0], B = _[1] - x[1], A = S * (h[1] - x[1]) - B * (h[0] - x[0]), I = S * (d[1] - x[1]) - B * (d[0] - x[0]);
    if (A * I > 0) {
      u = !0;
      break;
    }
  }
  return f && !u;
}
function Ii(i, t, e, n) {
  if (!i && !t) return !1;
  if (e[0] && e[1] && n[0] && n[1]) {
    const s = n.map((h) => bt(h.geom)), r = e.map((h) => bt(h.geom)), o = s[1][0] - s[0][0], a = s[1][1] - s[0][1], l = o * (r[0][1] - s[0][1]) - a * (r[0][0] - s[0][0]), c = o * (r[1][1] - s[0][1]) - a * (r[1][0] - s[0][0]);
    return l * c < 0;
  }
  return !1;
}
function Bi(i, t, e, n) {
  const s = ki(e, n), r = /* @__PURE__ */ new Set();
  let o = !1;
  for (let a = 0; a < Ei; a++) {
    let l = !1;
    for (const c of Object.keys(t)) {
      if (r.has(c)) continue;
      r.add(c);
      const h = t[c];
      if (!h || h.length < 2) continue;
      const f = c.split("-");
      if (f.length !== 2 || s.has(c)) continue;
      const u = Qt(h[0].bakw), p = Qt(h[1].bakw), b = Qt(h[0].forw), g = Qt(h[1].forw), M = f.map(
        (y) => u.find((T) => `${T.prop.index}` === y) || p.find((T) => `${T.prop.index}` === y)
      ), O = f.map(
        (y) => b.find((T) => `${T.prop.index}` === y) || g.find((T) => `${T.prop.index}` === y)
      );
      if (M.some((y) => !y) || O.some((y) => !y))
        continue;
      const m = [u, p].map(
        (y) => y.find((T) => !f.includes(`${T.prop.index}`))
      ), v = [b, g].map(
        (y) => y.find((T) => !f.includes(`${T.prop.index}`))
      );
      if (m.some((y) => !y) || v.some((y) => !y))
        continue;
      const d = h[0].bakw.geometry.coordinates[0].slice(0, 3).map((y) => bt(y)), x = h[1].bakw.geometry.coordinates[0].slice(0, 3).map((y) => bt(y)), _ = h[0].forw.geometry.coordinates[0].slice(0, 3).map((y) => bt(y)), S = h[1].forw.geometry.coordinates[0].slice(0, 3).map((y) => bt(y)), B = ge(d), A = ge(x), I = ge(_), C = ge(S), N = Ai(
        B,
        A,
        m,
        M,
        t,
        h
      ), Y = Ii(
        I,
        C,
        m,
        M
      );
      if (!(N || Y || En(
        bt(m[0].geom),
        x
      ) || En(
        bt(m[1].geom),
        d
      )))
        continue;
      const E = O.map(
        (y) => bt(y.geom)
      ), k = v.map(
        (y) => bt(y.geom)
      ), F = Oi([
        ...E,
        ...k
      ]), D = Ti(F), $ = An(
        E[0],
        E[1],
        k[0]
      ) + An(
        E[0],
        E[1],
        k[1]
      );
      $e(D, $) && (kn(t, h[0], i), kn(t, h[1], i), M.forEach((y) => {
        if (!y) return;
        const T = [
          y.geom,
          m[0].geom,
          m[1].geom,
          y.geom
        ], P = {
          a: y.prop,
          b: m[0].prop,
          c: m[1].prop
        }, X = re([T], P), L = On(X);
        Pn(t, {
          forw: L,
          bakw: X
        }, i);
      }), l = !0, o = !0);
    }
    if (!l) break;
  }
  return o;
}
function bt(i) {
  return [i[0], i[1]];
}
function En(i, t) {
  const [e, n] = t[0], [s, r] = t[1], [o, a] = t[2], l = o - e, c = a - n, h = s - e, f = r - n, u = i[0] - e, p = i[1] - n, b = l * l + c * c, g = l * h + c * f, M = l * u + c * p, O = h * h + f * f, m = h * u + f * p, v = b * O - g * g;
  if (v === 0) return !1;
  const d = 1 / v, x = (O * M - g * m) * d, _ = (b * m - g * M) * d, S = 1e-9;
  return x >= -S && _ >= -S && x + _ <= 1 + S;
}
function Oi(i) {
  const t = i.map((o) => o.slice()).filter(
    (o, a, l) => l.findIndex(
      (c) => $e(c[0], o[0]) && $e(c[1], o[1])
    ) === a
  );
  if (t.length <= 1) return t;
  const e = t.sort(
    (o, a) => o[0] === a[0] ? o[1] - a[1] : o[0] - a[0]
  ), n = (o, a, l) => (a[0] - o[0]) * (l[1] - o[1]) - (a[1] - o[1]) * (l[0] - o[0]), s = [];
  for (const o of e) {
    for (; s.length >= 2 && n(
      s[s.length - 2],
      s[s.length - 1],
      o
    ) <= 0; )
      s.pop();
    s.push(o);
  }
  const r = [];
  for (let o = e.length - 1; o >= 0; o--) {
    const a = e[o];
    for (; r.length >= 2 && n(
      r[r.length - 2],
      r[r.length - 1],
      a
    ) <= 0; )
      r.pop();
    r.push(a);
  }
  return r.pop(), s.pop(), s.concat(r);
}
function Ti(i) {
  if (i.length < 3) return 0;
  let t = 0;
  for (let e = 0; e < i.length; e++) {
    const [n, s] = i[e], [r, o] = i[(e + 1) % i.length];
    t += n * o - r * s;
  }
  return Math.abs(t) / 2;
}
function An(i, t, e) {
  return Math.abs(
    (i[0] * (t[1] - e[1]) + t[0] * (e[1] - i[1]) + e[0] * (i[1] - t[1])) / 2
  );
}
function $e(i, t, e = 1e-9) {
  return Math.abs(i - t) <= e;
}
const Fi = (i) => typeof i == "string" && i.startsWith("b");
function Ci(i, t) {
  const e = (n, s) => {
    for (let r = 0; r < 3; r++) {
      const o = n.g[r], a = n.g[(r + 1) % 3];
      if (s.g.every((l) => n.sign * dt(o[0], o[1], a[0], a[1], l[0], l[1]) <= 0)) return !0;
    }
    return !1;
  };
  return !e(i, t) && !e(t, i);
}
function Di(i, t, e) {
  if (t.length === 0) return [];
  const n = i.features.map((g) => {
    const { a: M, b: O, c: m } = g.properties, v = [M.geom, O.geom, m.geom], [d, x, _] = g.geometry.coordinates[0], S = v.map(([C]) => C), B = v.map(([, C]) => C), A = Math.sign(dt(d[0], d[1], x[0], x[1], _[0], _[1])), I = Math.sign(dt(v[0][0], v[0][1], v[1][0], v[1][1], v[2][0], v[2][1]));
    return {
      ids: [M.index, O.index, m.index].map(String),
      g: v,
      sign: I,
      ratio: A * I,
      aux: [M.index, O.index, m.index].some(Fi),
      minx: Math.min(...S),
      maxx: Math.max(...S),
      miny: Math.min(...B),
      maxy: Math.max(...B)
    };
  }), s = n.map((g) => g.ratio), r = s.reduce((g, M) => g + M, 0) < 0 ? -1 : 1, o = (g, M) => g < M ? `${g}|${M}` : `${M}|${g}`, a = /* @__PURE__ */ new Map();
  n.forEach((g, M) => {
    for (let O = 0; O < 3; O++) {
      const m = o(g.ids[O], g.ids[(O + 1) % 3]), v = a.get(m);
      v ? v.push(M) : a.set(m, [M]);
    }
  });
  const l = ([g, M]) => o(String(e[g]), String(e[M])), c = /* @__PURE__ */ new Set();
  for (const g of t) for (const M of a.get(l(g)) ?? []) c.add(M);
  const h = (g) => n[g].aux || c.has(g), f = /* @__PURE__ */ new Set();
  n.forEach((g, M) => {
    h(M) && (s[M] === 0 || s[M] !== r) && f.add(M);
  });
  const u = n.map((g, M) => M).sort((g, M) => n[g].minx - n[M].minx);
  for (let g = 0; g < u.length; g++) {
    const M = n[u[g]];
    if (M.sign !== 0)
      for (let O = g + 1; O < u.length; O++) {
        const m = n[u[O]];
        if (m.minx >= M.maxx) break;
        m.sign === 0 || m.miny >= M.maxy || M.miny >= m.maxy || !h(u[g]) && !h(u[O]) || Ci(M, m) && (f.add(u[g]), f.add(u[O]));
      }
  }
  if (f.size === 0) return [];
  const p = t.filter((g) => (a.get(l(g)) ?? []).some((M) => f.has(M)));
  if (p.length > 0) return p;
  const b = /* @__PURE__ */ new Set();
  for (const g of f) for (const M of n[g].ids) M.startsWith("b") || b.add(M);
  return t.filter(
    ([g, M]) => b.has(String(e[g])) || b.has(String(e[M]))
  );
}
const In = 2.00704, Bn = 3.00001, Ni = 12, $i = 24;
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
    let e = t[0][0], n = e, s = t[0][1], r = s;
    const o = [t[0]];
    for (let a = 1; a < t.length; a++) {
      const l = t[a];
      l[0] < e && (e = l[0]), l[0] > n && (n = l[0]), l[1] < s && (s = l[1]), l[1] > r && (r = l[1]), o.push(l);
    }
    o.push(t[0]), this.boundsPolygon = re([o]), this.xy = [e, s], this.wh = [n - e, r - s], this.vertexMode = ot.VERTEX_PLAIN, this.tins = void 0, this.indexedTins = void 0;
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
          const s = e[n].features[0], r = s.geometry.coordinates[0][1], o = s.properties.b.geom;
          t.vertices_points[n] = [r, o];
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
      (o) => On(o)
    );
    this.tins.bakw = xt(e);
    const n = {};
    this.tins.forw.features.forEach((o, a) => {
      const l = this.tins.bakw.features[a];
      Pn(n, { forw: o, bakw: l });
    });
    const s = (this.pointsSet?.forw.features ?? []).map(
      (o) => o.properties.target.index
    );
    Bi(
      this.tins,
      n,
      this.pointsSet?.edges || [],
      s
    );
    const r = ["forw", "bakw"].map((o) => {
      const a = this.tins[o].features.map(
        (l) => l.geometry.coordinates[0]
      );
      return Dn(a, t);
    });
    r[0].length === 0 && r[1].length === 0 ? (this.strict_status = ot.STATUS_STRICT, delete this.kinks) : (this.strict_status = ot.STATUS_ERROR, this.kinks = {
      forw: xt(r[0]),
      bakw: xt(r[1])
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
      const r = this.points[s][0], o = this.points[s][1], a = Kt(r, o, s);
      t.forw.push(a), t.bakw.push(Wt(a));
    }
    const e = [];
    let n = 0;
    this.edgeNodes = [], this.edges || (this.edges = []);
    for (let s = 0; s < this.edges.length; s++) {
      const r = this.edges[s][2], o = Object.assign([], this.edges[s][0]), a = Object.assign([], this.edges[s][1]);
      if (Pi(r, this.points.length, s), o.length === 0 && a.length === 0) {
        e.push(r);
        continue;
      }
      o.unshift(this.points[r[0]][0]), o.push(this.points[r[1]][0]), a.unshift(this.points[r[0]][1]), a.push(this.points[r[1]][1]);
      const l = [o, a].map((c) => {
        const h = c.map((u, p, b) => {
          if (p === 0) return 0;
          const g = b[p - 1];
          return Math.sqrt(
            Math.pow(u[0] - g[0], 2) + Math.pow(u[1] - g[1], 2)
          );
        }), f = h.reduce((u, p, b) => b === 0 ? [0] : (u.push(u[b - 1] + p), u), []);
        return f.map((u, p, b) => {
          const g = u / b[b.length - 1];
          return [c[p], h[p], f[p], g];
        });
      });
      l.map((c, h) => {
        const f = l[h ? 0 : 1];
        return c.filter((u, p) => !(p === 0 || p === c.length - 1 || u[4] === "handled")).flatMap((u) => {
          const p = u[0], b = u[3], g = f.reduce(
            (M, O, m, v) => {
              if (M) return M;
              const d = v[m + 1];
              if (O[3] === b)
                return O[4] = "handled", [O];
              if (O[3] < b && d && d[3] > b)
                return [O, d];
            },
            void 0
          );
          if (g && g.length === 1)
            return h === 0 ? [[p, g[0][0], b]] : [[g[0][0], p, b]];
          if (g && g.length === 2) {
            const M = g[0], O = g[1], m = (b - M[3]) / (O[3] - M[3]), v = [
              (O[0][0] - M[0][0]) * m + M[0][0],
              (O[0][1] - M[0][1]) * m + M[0][1]
            ];
            return h === 0 ? [[p, v, b]] : [[v, p, b]];
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
        n++, t.forw.push(u), t.bakw.push(Wt(u)), h === 0 ? e.push([r[0], t.forw.length - 1]) : e.push([
          t.forw.length - 2,
          t.forw.length - 1
        ]), h === f.length - 1 && e.push([t.forw.length - 1, r[1]]);
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
    const r = this.bounds ? this.boundsPolygon : void 0;
    if (!this.points.reduce((l, c) => l && (r ? Ge(c[0], r) : c[0][0] >= t && c[0][0] <= e && c[0][1] >= n && c[0][1] <= s), !0))
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
    for (const r of this.points) {
      const o = r[0][0], a = r[0][1];
      o < t && (t = o), o > e && (e = o), a < n && (n = a), a > s && (s = a);
    }
    return { minx: t, maxx: e, miny: n, maxy: s };
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
    let s, r, o, a, l;
    if (e) {
      if (this.bounds) {
        const I = this.boundsPolygon;
        if (!I) throw new Error("Internal error: bounds is set but boundsPolygon is missing");
        if (!this.points.every(
          (N) => Ge(N[0], I)
        )) throw "SOME POINTS OUTSIDE";
      }
      s = this.generatePointsSet(), { minx: r, maxx: o, miny: a, maxy: l } = this.computeGcpBbox();
    } else {
      const I = this.validateAndPrepareInputs();
      s = I.pointsSet, r = I.minx, o = I.maxx, a = I.miny, l = I.maxy;
    }
    const c = {
      forw: xt(s.forw),
      bakw: xt(s.bakw)
    }, h = de(
      c.forw,
      s.edges,
      "target"
    ), f = de(
      c.bakw,
      s.edges,
      "target"
    );
    if (h.features.length === 0 || f.features.length === 0)
      throw "TOO LINEAR1";
    const u = _r(c.forw), p = cn(c.forw);
    if (!p) throw "TOO LINEAR2";
    const b = {}, g = p.geometry.coordinates[0];
    let M;
    try {
      M = g.map((I) => ({
        forw: I,
        bakw: _e(Rt(I), h)
      })), M.forEach((I) => {
        b[`${I.forw[0]}:${I.forw[1]}`] = I;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const O = cn(c.bakw);
    if (!O) throw "TOO LINEAR2";
    const m = O.geometry.coordinates[0];
    try {
      M = m.map((I) => ({
        bakw: I,
        forw: _e(Rt(I), f)
      })), M.forEach((I) => {
        b[`${I.forw[0]}:${I.forw[1]}`] = I;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const v = {
      forw: u.geometry.coordinates,
      bakw: _e(u, h)
    }, d = Kt(v.forw, v.bakw, "c");
    this.centroid = {
      forw: d,
      bakw: Wt(d)
    };
    const x = [
      ...this.points.map((I) => ({ forw: I[0], bakw: I[1] })),
      ...(this.edgeNodes ?? []).map((I) => ({ forw: I[0], bakw: I[1] }))
    ], _ = {
      convexBuf: b,
      centroid: v,
      allGcps: x,
      minx: r,
      maxx: o,
      miny: a,
      maxy: l
    };
    if (n) {
      this.stateTriangle = void 0;
      const I = this.yaxisMode === ot.YAXIS_FOLLOW, C = I ? 1 : -1, N = this.buildWithHull(t, (Y) => gn(
        _,
        (w) => ti(w, (E) => {
          const [k, F] = Un(n, E);
          return [k, I ? -F : F];
        }),
        s,
        this.points.length,
        {
          orientation: C,
          accept: (w) => w.hasMapBoundary ? (this.buildTin(s, w.vertices, t, w), (this.strict_status !== ot.STATUS_LOOSE || w.hasBoundary) && ve(this.tins.forw, C) === 0 && ve(this.tins.bakw, C) === 0) : !1
        },
        Y
      ));
      if (N) {
        this.compiledOuter = {
          outerTransform: "worldFile",
          worldFile: n,
          vertices_points: N.vertices.map(({ forw: F, bakw: D }) => [F, D])
        };
        const { centroid: Y, xy: w, wh: E, kinks: k } = this;
        super.setCompiled(this.getCompiled()), Object.assign(this, { centroid: Y, xy: w, wh: E, kinks: k }), this.lastBoundaryDiagnostics = {
          ...N.diagnostics,
          requestedOuterTransform: "worldFile",
          outerTransform: "worldFile"
        };
        return;
      }
      this.compiledOuter = { outerTransform: "extrapolate" }, this.outerTransform = "extrapolate", this.worldFile = void 0;
    }
    const S = this.vertexMode === ot.VERTEX_BIRDEYE ? Zr : Qr;
    let B;
    const A = e ? this.buildWithHull(t, (I) => {
      const C = gn(
        _,
        S,
        s,
        this.points.length,
        void 0,
        I
      );
      return B = this.buildTin(
        s,
        C?.vertices ?? S(_, !1),
        t,
        C
      ), C;
    }) : void 0;
    e || (B = this.buildTin(
      s,
      S(_, !1),
      t,
      void 0
    )), this.vertices_params = {
      forw: dn(B.forw, this.centroid.forw),
      bakw: dn(B.bakw, this.centroid.bakw)
    }, this.addIndexedTin(), this.pointsWeightBuffer = {}, this.lastBoundaryDiagnostics = A?.diagnostics, n && this.lastBoundaryDiagnostics && (this.lastBoundaryDiagnostics = {
      ...this.lastBoundaryDiagnostics,
      requestedOuterTransform: "worldFile",
      outerTransform: "extrapolate",
      fallbackReason: "boundaryFlips"
    });
  }
  /**
   * 凸包の辺を全部制約にして三角網を組み、strict を壊したときは、壊した原因の凸包の辺だけを外して
   * 組み直す。strict に戻るか、外す辺が無くなるまで繰り返す（strict を壊さない範囲で、なるべく多くの
   * 凸包の辺を制約にする）。外せるだけ外しても戻らず、凸包の辺を全部外すと strict になるときは、
   * 全部外した三角網を採る。
   *
   * strict でも auto でもない（loose の）ときは組み直さない。
   *
   * @param attempt 外す辺の鍵を受け取り、外周を探して `this.tins` を組み、探索の結果を返す
   */
  buildWithHull(t, e) {
    const n = () => this.strict_status === ot.STATUS_STRICT, s = /* @__PURE__ */ new Set();
    let r = e(s);
    if (!(t === ot.MODE_STRICT || t === ot.MODE_AUTO) || !r || n()) return r;
    const a = new Set(r.forwHull.all.map(ye));
    for (let l = 0; l < Ni; l++) {
      const c = this.pointsSet.forw.features.map(
        (u) => u.properties.target.index
      ), h = Di(
        this.tins.forw,
        r.forwHull.applied,
        c
      ).filter((u) => !s.has(ye(u)));
      if (h.length === 0) break;
      for (const u of h) s.add(ye(u));
      const f = e(s);
      if (!f) return this.restoreAfterFailure(e, s, r);
      if (r = f, n()) return this.restoreHullEdges(e, s, r);
    }
    if (s.size < a.size) {
      const l = e(a);
      return l && n() ? l : this.restoreAfterFailure(e, s, r);
    }
    return r;
  }
  /**
   * strict に戻した状態から、外した凸包の辺を 1 本ずつ制約に戻して試し、strict を保てる辺は戻す。
   * 原因の辺の特定は粗い（接する三角形の単位）ので、外しすぎた辺を取り戻す。
   * 最後に試した組み方が採用した外す辺の指定と違うときは、採用した指定で組み直す。
   */
  restoreHullEdges(t, e, n) {
    let s = n, r = !1;
    for (const o of [...e].slice(0, $i)) {
      const a = new Set(e);
      a.delete(o);
      const l = t(a);
      l && this.strict_status === ot.STATUS_STRICT ? (e.delete(o), s = l, r = !1) : r = !0;
    }
    return r && (s = t(e) ?? s), s;
  }
  /** 試した三角網を捨て、外す辺の指定を元に戻して組み直す。 */
  restoreAfterFailure(t, e, n) {
    return t(e) ?? n;
  }
  /** 補助頂点を含め、strictMode に従って実際に使う両方向の三角網を組む。 */
  buildTin(t, e, n, s) {
    const r = {
      forw: [],
      bakw: []
    };
    for (let o = 0; o < e.length; o++) {
      const a = e[o].forw, l = e[o].bakw, c = Kt(a, l, `b${o}`), h = Wt(c);
      r.forw.push(c), r.bakw.push(h);
    }
    return this.pointsSet = {
      forw: xt([...t.forw, ...r.forw]),
      bakw: xt([...t.bakw, ...r.bakw]),
      edges: t.edges
    }, this.tins = {
      forw: qe(
        s?.forw ?? de(this.pointsSet.forw, t.edges, "target")
      )
    }, (n === ot.MODE_STRICT || n === ot.MODE_AUTO) && this.calculateStrictTin(
      n === ot.MODE_AUTO ? 1 : xn
    ), (n === ot.MODE_LOOSE || n === ot.MODE_AUTO && this.strict_status === ot.STATUS_ERROR) && (this.tins.bakw = qe(
      s?.bakw ?? de(this.pointsSet.bakw, t.edges, "target")
    ), delete this.kinks, this.strict_status = ot.STATUS_LOOSE), r;
  }
  /**
   * 非同期ラッパーを提供します。
   * 互換性のために Promise ベースの API を維持しますが、内部処理は同期的です。
   */
  async updateTinAsync() {
    this.updateTin();
  }
}
function Pi(i, t, e) {
  const n = (s) => Number.isInteger(s) && s >= 0 && s < t;
  if (!Array.isArray(i) || !n(i[0]) || !n(i[1]))
    throw new Error(
      `Invalid edge at edges[${e}]: start/end ${JSON.stringify(i)} must be integer indices of points (0 to ${t - 1})`
    );
}
export {
  ot as Tin,
  de as constrainedTin,
  Wt as counterPoint,
  Kt as createPoint,
  ot as default,
  Yi as findIntersections,
  In as format_version,
  Pn as insertSearchIndex,
  dn as vertexCalc
};
