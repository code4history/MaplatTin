import { counterTri as On, Transform as qn, validateWorldFile as Vn, normalizeEdges as jn, transformArr as _e, rotateVerticesTriangle as qe, worldFileToCrs as Un } from "@maplat/transform";
function te(r, t, e = {}) {
  const n = { type: "Feature" };
  return (e.id === 0 || e.id) && (n.id = e.id), e.bbox && (n.bbox = e.bbox), n.properties = t || {}, n.geometry = r, n;
}
function Rt(r, t, e = {}) {
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
function Gn(r) {
  return r.type === "Feature" ? r.geometry : r;
}
function $e(r, t, e) {
  if (r !== null)
    for (var n, o, i, s, a, l, c, h = 0, f = 0, u, g = r.type, b = g === "FeatureCollection", d = g === "Feature", _ = b ? r.features.length : 1, A = 0; A < _; A++) {
      c = b ? (
        // @ts-expect-error: Known type conflict
        r.features[A].geometry
      ) : d ? (
        // @ts-expect-error: Known type conflict
        r.geometry
      ) : r, u = c ? c.type === "GeometryCollection" : !1, a = u ? c.geometries.length : 1;
      for (var m = 0; m < a; m++) {
        var y = 0, p = 0;
        if (s = u ? c.geometries[m] : c, s !== null) {
          l = s.coordinates;
          var x = s.type;
          switch (h = e && (x === "Polygon" || x === "MultiPolygon") ? 1 : 0, x) {
            case null:
              break;
            case "Point":
              if (
                // @ts-expect-error: Known type conflict
                t(
                  l,
                  f,
                  A,
                  y,
                  p
                ) === !1
              )
                return !1;
              f++, y++;
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
                    y,
                    p
                  ) === !1
                )
                  return !1;
                f++, x === "MultiPoint" && y++;
              }
              x === "LineString" && y++;
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
                      A,
                      y,
                      p
                    ) === !1
                  )
                    return !1;
                  f++;
                }
                x === "MultiLineString" && y++, x === "Polygon" && p++;
              }
              x === "Polygon" && y++;
              break;
            case "MultiPolygon":
              for (n = 0; n < l.length; n++) {
                for (p = 0, o = 0; o < l[n].length; o++) {
                  for (i = 0; i < l[n][o].length - h; i++) {
                    if (
                      // @ts-expect-error: Known type conflict
                      t(
                        l[n][o][i],
                        f,
                        A,
                        y,
                        p
                      ) === !1
                    )
                      return !1;
                    f++;
                  }
                  p++;
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
  let i, s, a, l, c = t[0], h = n[0], f = 0, u = 0;
  h > c == h > -c ? (i = c, c = t[++f]) : (i = h, h = n[++u]);
  let g = 0;
  if (f < r && u < e)
    for (h > c == h > -c ? (s = c + i, a = i - (s - c), c = t[++f]) : (s = h + i, a = i - (s - h), h = n[++u]), i = s, a !== 0 && (o[g++] = a); f < r && u < e; )
      h > c == h > -c ? (s = i + c, l = s - i, a = i - (s - l) + (c - l), c = t[++f]) : (s = i + h, l = s - i, a = i - (s - l) + (h - l), h = n[++u]), i = s, a !== 0 && (o[g++] = a);
  for (; f < r; )
    s = i + c, l = s - i, a = i - (s - l) + (c - l), c = t[++f], i = s, a !== 0 && (o[g++] = a);
  for (; u < e; )
    s = i + h, l = s - i, a = i - (s - l) + (h - l), h = n[++u], i = s, a !== 0 && (o[g++] = a);
  return (i !== 0 || g === 0) && (o[g++] = i), g;
}
function St(r, t, e, n, o, i, s, a) {
  return ht(ht(r, t, e, n, s), s, o, i, a);
}
function L(r, t, e, n) {
  let o, i, s, a, l, c, h, f, u, g, b;
  h = U * e, g = h - (h - e), b = e - g;
  let d = t[0];
  o = d * e, h = U * d, f = h - (h - d), u = d - f, s = u * b - (o - f * g - u * g - f * b);
  let _ = 0;
  s !== 0 && (n[_++] = s);
  for (let A = 1; A < r; A++)
    d = t[A], a = d * e, h = U * d, f = h - (h - d), u = d - f, l = u * b - (a - f * g - u * g - f * b), i = o + l, c = i - o, s = o - (i - c) + (l - c), s !== 0 && (n[_++] = s), o = a + i, s = i - (o - a), s !== 0 && (n[_++] = s);
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
const Hn = (3 + 16 * pt) * pt, Kn = (2 + 12 * pt) * pt, Wn = (9 + 64 * pt) * pt * pt, Lt = tt(4), Ue = tt(8), ze = tt(12), Ge = tt(16), mt = tt(4);
function Jn(r, t, e, n, o, i, s) {
  let a, l, c, h, f, u, g, b, d, _, A, m, y, p, x, M, S, B;
  const I = r - o, O = e - o, D = t - i, N = n - i;
  p = I * N, u = U * I, g = u - (u - I), b = I - g, u = U * N, d = u - (u - N), _ = N - d, x = b * _ - (p - g * d - b * d - g * _), M = D * O, u = U * D, g = u - (u - D), b = D - g, u = U * O, d = u - (u - O), _ = O - d, S = b * _ - (M - g * d - b * d - g * _), A = x - S, f = x - A, Lt[0] = x - (A + f) + (f - S), m = p + A, f = m - p, y = p - (m - f) + (A - f), A = y - M, f = y - A, Lt[1] = y - (A + f) + (f - M), B = m + A, f = B - m, Lt[2] = m - (B - f) + (A - f), Lt[3] = B;
  let X = Fn(4, Lt), v = Kn * s;
  if (X >= v || -X >= v || (f = r - I, a = r - (I + f) + (f - o), f = e - O, c = e - (O + f) + (f - o), f = t - D, l = t - (D + f) + (f - i), f = n - N, h = n - (N + f) + (f - i), a === 0 && l === 0 && c === 0 && h === 0) || (v = Wn * s + Tn * Math.abs(X), X += I * h + N * a - (D * c + O * l), X >= v || -X >= v)) return X;
  p = a * N, u = U * a, g = u - (u - a), b = a - g, u = U * N, d = u - (u - N), _ = N - d, x = b * _ - (p - g * d - b * d - g * _), M = l * O, u = U * l, g = u - (u - l), b = l - g, u = U * O, d = u - (u - O), _ = O - d, S = b * _ - (M - g * d - b * d - g * _), A = x - S, f = x - A, mt[0] = x - (A + f) + (f - S), m = p + A, f = m - p, y = p - (m - f) + (A - f), A = y - M, f = y - A, mt[1] = y - (A + f) + (f - M), B = m + A, f = B - m, mt[2] = m - (B - f) + (A - f), mt[3] = B;
  const E = ht(4, Lt, 4, mt, Ue);
  p = I * h, u = U * I, g = u - (u - I), b = I - g, u = U * h, d = u - (u - h), _ = h - d, x = b * _ - (p - g * d - b * d - g * _), M = D * c, u = U * D, g = u - (u - D), b = D - g, u = U * c, d = u - (u - c), _ = c - d, S = b * _ - (M - g * d - b * d - g * _), A = x - S, f = x - A, mt[0] = x - (A + f) + (f - S), m = p + A, f = m - p, y = p - (m - f) + (A - f), A = y - M, f = y - A, mt[1] = y - (A + f) + (f - M), B = m + A, f = B - m, mt[2] = m - (B - f) + (A - f), mt[3] = B;
  const k = ht(E, Ue, 4, mt, ze);
  p = a * h, u = U * a, g = u - (u - a), b = a - g, u = U * h, d = u - (u - h), _ = h - d, x = b * _ - (p - g * d - b * d - g * _), M = l * c, u = U * l, g = u - (u - l), b = l - g, u = U * c, d = u - (u - c), _ = c - d, S = b * _ - (M - g * d - b * d - g * _), A = x - S, f = x - A, mt[0] = x - (A + f) + (f - S), m = p + A, f = m - p, y = p - (m - f) + (A - f), A = y - M, f = y - A, mt[1] = y - (A + f) + (f - M), B = m + A, f = B - m, mt[2] = m - (B - f) + (A - f), mt[3] = B;
  const F = ht(k, ze, 4, mt, Ge);
  return Ge[F - 1];
}
function dt(r, t, e, n, o, i) {
  const s = (t - i) * (e - o), a = (r - o) * (n - i), l = s - a, c = Math.abs(s + a);
  return Math.abs(l) >= Hn * c ? l : -Jn(r, t, e, n, o, i, c);
}
const Qn = (10 + 96 * pt) * pt, Zn = (4 + 48 * pt) * pt, ti = (44 + 576 * pt) * pt * pt, Tt = tt(4), Ft = tt(4), Dt = tt(4), Mt = tt(4), kt = tt(4), Et = tt(4), gt = tt(4), wt = tt(4), Se = tt(8), Me = tt(8), ke = tt(8), Ee = tt(8), Ae = tt(8), Ie = tt(8), se = tt(8), oe = tt(8), ae = tt(8), $t = tt(4), Pt = tt(4), Xt = tt(4), z = tt(8), K = tt(16), nt = tt(16), it = tt(16), et = tt(32), Ct = tt(32), ct = tt(48), vt = tt(64);
let jt = tt(1152), Be = tt(1152);
function lt(r, t, e) {
  r = ht(r, jt, t, e, Be);
  const n = jt;
  return jt = Be, Be = n, r;
}
function ei(r, t, e, n, o, i, s, a, l) {
  let c, h, f, u, g, b, d, _, A, m, y, p, x, M, S, B, I, O, D, N, X, v, E, k, F, C, $, w, T, P, Y, q, R, j, V;
  const H = r - s, G = e - s, W = o - s, J = t - a, Z = n - a, Q = i - a;
  Y = G * Q, E = U * G, k = E - (E - G), F = G - k, E = U * Q, C = E - (E - Q), $ = Q - C, q = F * $ - (Y - k * C - F * C - k * $), R = W * Z, E = U * W, k = E - (E - W), F = W - k, E = U * Z, C = E - (E - Z), $ = Z - C, j = F * $ - (R - k * C - F * C - k * $), w = q - j, v = q - w, Tt[0] = q - (w + v) + (v - j), T = Y + w, v = T - Y, P = Y - (T - v) + (w - v), w = P - R, v = P - w, Tt[1] = P - (w + v) + (v - R), V = T + w, v = V - T, Tt[2] = T - (V - v) + (w - v), Tt[3] = V, Y = W * J, E = U * W, k = E - (E - W), F = W - k, E = U * J, C = E - (E - J), $ = J - C, q = F * $ - (Y - k * C - F * C - k * $), R = H * Q, E = U * H, k = E - (E - H), F = H - k, E = U * Q, C = E - (E - Q), $ = Q - C, j = F * $ - (R - k * C - F * C - k * $), w = q - j, v = q - w, Ft[0] = q - (w + v) + (v - j), T = Y + w, v = T - Y, P = Y - (T - v) + (w - v), w = P - R, v = P - w, Ft[1] = P - (w + v) + (v - R), V = T + w, v = V - T, Ft[2] = T - (V - v) + (w - v), Ft[3] = V, Y = H * Z, E = U * H, k = E - (E - H), F = H - k, E = U * Z, C = E - (E - Z), $ = Z - C, q = F * $ - (Y - k * C - F * C - k * $), R = G * J, E = U * G, k = E - (E - G), F = G - k, E = U * J, C = E - (E - J), $ = J - C, j = F * $ - (R - k * C - F * C - k * $), w = q - j, v = q - w, Dt[0] = q - (w + v) + (v - j), T = Y + w, v = T - Y, P = Y - (T - v) + (w - v), w = P - R, v = P - w, Dt[1] = P - (w + v) + (v - R), V = T + w, v = V - T, Dt[2] = T - (V - v) + (w - v), Dt[3] = V, c = ht(
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
        Ct
      ),
      Ct,
      vt
    ),
    vt,
    ht(
      L(L(4, Dt, W, z), z, W, K),
      K,
      L(L(4, Dt, Q, z), z, Q, nt),
      nt,
      et
    ),
    et,
    jt
  );
  let at = Fn(c, jt), ft = Zn * l;
  if (at >= ft || -at >= ft || (v = r - H, h = r - (H + v) + (v - s), v = t - J, g = t - (J + v) + (v - a), v = e - G, f = e - (G + v) + (v - s), v = n - Z, b = n - (Z + v) + (v - a), v = o - W, u = o - (W + v) + (v - s), v = i - Q, d = i - (Q + v) + (v - a), h === 0 && f === 0 && u === 0 && g === 0 && b === 0 && d === 0) || (ft = ti * l + Tn * Math.abs(at), at += (H * H + J * J) * (G * d + Q * f - (Z * u + W * b)) + 2 * (H * h + J * g) * (G * Q - Z * W) + ((G * G + Z * Z) * (W * g + J * u - (Q * h + H * d)) + 2 * (G * f + Z * b) * (W * J - Q * H)) + ((W * W + Q * Q) * (H * b + Z * h - (J * f + G * g)) + 2 * (W * u + Q * d) * (H * Z - J * G)), at >= ft || -at >= ft))
    return at;
  if ((f !== 0 || b !== 0 || u !== 0 || d !== 0) && (Y = H * H, E = U * H, k = E - (E - H), F = H - k, q = F * F - (Y - k * k - (k + k) * F), R = J * J, E = U * J, k = E - (E - J), F = J - k, j = F * F - (R - k * k - (k + k) * F), w = q + j, v = w - q, Mt[0] = q - (w - v) + (j - v), T = Y + w, v = T - Y, P = Y - (T - v) + (w - v), w = P + R, v = w - P, Mt[1] = P - (w - v) + (R - v), V = T + w, v = V - T, Mt[2] = T - (V - v) + (w - v), Mt[3] = V), (u !== 0 || d !== 0 || h !== 0 || g !== 0) && (Y = G * G, E = U * G, k = E - (E - G), F = G - k, q = F * F - (Y - k * k - (k + k) * F), R = Z * Z, E = U * Z, k = E - (E - Z), F = Z - k, j = F * F - (R - k * k - (k + k) * F), w = q + j, v = w - q, kt[0] = q - (w - v) + (j - v), T = Y + w, v = T - Y, P = Y - (T - v) + (w - v), w = P + R, v = w - P, kt[1] = P - (w - v) + (R - v), V = T + w, v = V - T, kt[2] = T - (V - v) + (w - v), kt[3] = V), (h !== 0 || g !== 0 || f !== 0 || b !== 0) && (Y = W * W, E = U * W, k = E - (E - W), F = W - k, q = F * F - (Y - k * k - (k + k) * F), R = Q * Q, E = U * Q, k = E - (E - Q), F = Q - k, j = F * F - (R - k * k - (k + k) * F), w = q + j, v = w - q, Et[0] = q - (w - v) + (j - v), T = Y + w, v = T - Y, P = Y - (T - v) + (w - v), w = P + R, v = w - P, Et[1] = P - (w - v) + (R - v), V = T + w, v = V - T, Et[2] = T - (V - v) + (w - v), Et[3] = V), h !== 0 && (_ = L(4, Tt, h, Se), c = lt(c, St(
    L(_, Se, 2 * H, K),
    K,
    L(L(4, Et, h, z), z, Z, nt),
    nt,
    L(L(4, kt, h, z), z, -Q, it),
    it,
    et,
    ct
  ), ct)), g !== 0 && (A = L(4, Tt, g, Me), c = lt(c, St(
    L(A, Me, 2 * J, K),
    K,
    L(L(4, kt, g, z), z, W, nt),
    nt,
    L(L(4, Et, g, z), z, -G, it),
    it,
    et,
    ct
  ), ct)), f !== 0 && (m = L(4, Ft, f, ke), c = lt(c, St(
    L(m, ke, 2 * G, K),
    K,
    L(L(4, Mt, f, z), z, Q, nt),
    nt,
    L(L(4, Et, f, z), z, -J, it),
    it,
    et,
    ct
  ), ct)), b !== 0 && (y = L(4, Ft, b, Ee), c = lt(c, St(
    L(y, Ee, 2 * Z, K),
    K,
    L(L(4, Et, b, z), z, H, nt),
    nt,
    L(L(4, Mt, b, z), z, -W, it),
    it,
    et,
    ct
  ), ct)), u !== 0 && (p = L(4, Dt, u, Ae), c = lt(c, St(
    L(p, Ae, 2 * W, K),
    K,
    L(L(4, kt, u, z), z, J, nt),
    nt,
    L(L(4, Mt, u, z), z, -Z, it),
    it,
    et,
    ct
  ), ct)), d !== 0 && (x = L(4, Dt, d, Ie), c = lt(c, St(
    L(x, Ie, 2 * Q, K),
    K,
    L(L(4, Mt, d, z), z, G, nt),
    nt,
    L(L(4, kt, d, z), z, -H, it),
    it,
    et,
    ct
  ), ct)), h !== 0 || g !== 0) {
    if (f !== 0 || b !== 0 || u !== 0 || d !== 0 ? (Y = f * Q, E = U * f, k = E - (E - f), F = f - k, E = U * Q, C = E - (E - Q), $ = Q - C, q = F * $ - (Y - k * C - F * C - k * $), R = G * d, E = U * G, k = E - (E - G), F = G - k, E = U * d, C = E - (E - d), $ = d - C, j = F * $ - (R - k * C - F * C - k * $), w = q + j, v = w - q, gt[0] = q - (w - v) + (j - v), T = Y + w, v = T - Y, P = Y - (T - v) + (w - v), w = P + R, v = w - P, gt[1] = P - (w - v) + (R - v), V = T + w, v = V - T, gt[2] = T - (V - v) + (w - v), gt[3] = V, Y = u * -Z, E = U * u, k = E - (E - u), F = u - k, E = U * -Z, C = E - (E - -Z), $ = -Z - C, q = F * $ - (Y - k * C - F * C - k * $), R = W * -b, E = U * W, k = E - (E - W), F = W - k, E = U * -b, C = E - (E - -b), $ = -b - C, j = F * $ - (R - k * C - F * C - k * $), w = q + j, v = w - q, wt[0] = q - (w - v) + (j - v), T = Y + w, v = T - Y, P = Y - (T - v) + (w - v), w = P + R, v = w - P, wt[1] = P - (w - v) + (R - v), V = T + w, v = V - T, wt[2] = T - (V - v) + (w - v), wt[3] = V, S = ht(4, gt, 4, wt, oe), Y = f * d, E = U * f, k = E - (E - f), F = f - k, E = U * d, C = E - (E - d), $ = d - C, q = F * $ - (Y - k * C - F * C - k * $), R = u * b, E = U * u, k = E - (E - u), F = u - k, E = U * b, C = E - (E - b), $ = b - C, j = F * $ - (R - k * C - F * C - k * $), w = q - j, v = q - w, Pt[0] = q - (w + v) + (v - j), T = Y + w, v = T - Y, P = Y - (T - v) + (w - v), w = P - R, v = P - w, Pt[1] = P - (w + v) + (v - R), V = T + w, v = V - T, Pt[2] = T - (V - v) + (w - v), Pt[3] = V, O = 4) : (oe[0] = 0, S = 1, Pt[0] = 0, O = 1), h !== 0) {
      const rt = L(S, oe, h, it);
      c = lt(c, ht(
        L(_, Se, h, K),
        K,
        L(rt, it, 2 * H, et),
        et,
        ct
      ), ct);
      const st = L(O, Pt, h, z);
      c = lt(c, St(
        L(st, z, 2 * H, K),
        K,
        L(st, z, h, nt),
        nt,
        L(rt, it, h, et),
        et,
        Ct,
        vt
      ), vt), b !== 0 && (c = lt(c, L(L(4, Et, h, z), z, b, K), K)), d !== 0 && (c = lt(c, L(L(4, kt, -h, z), z, d, K), K));
    }
    if (g !== 0) {
      const rt = L(S, oe, g, it);
      c = lt(c, ht(
        L(A, Me, g, K),
        K,
        L(rt, it, 2 * J, et),
        et,
        ct
      ), ct);
      const st = L(O, Pt, g, z);
      c = lt(c, St(
        L(st, z, 2 * J, K),
        K,
        L(st, z, g, nt),
        nt,
        L(rt, it, g, et),
        et,
        Ct,
        vt
      ), vt);
    }
  }
  if (f !== 0 || b !== 0) {
    if (u !== 0 || d !== 0 || h !== 0 || g !== 0 ? (Y = u * J, E = U * u, k = E - (E - u), F = u - k, E = U * J, C = E - (E - J), $ = J - C, q = F * $ - (Y - k * C - F * C - k * $), R = W * g, E = U * W, k = E - (E - W), F = W - k, E = U * g, C = E - (E - g), $ = g - C, j = F * $ - (R - k * C - F * C - k * $), w = q + j, v = w - q, gt[0] = q - (w - v) + (j - v), T = Y + w, v = T - Y, P = Y - (T - v) + (w - v), w = P + R, v = w - P, gt[1] = P - (w - v) + (R - v), V = T + w, v = V - T, gt[2] = T - (V - v) + (w - v), gt[3] = V, N = -Q, X = -d, Y = h * N, E = U * h, k = E - (E - h), F = h - k, E = U * N, C = E - (E - N), $ = N - C, q = F * $ - (Y - k * C - F * C - k * $), R = H * X, E = U * H, k = E - (E - H), F = H - k, E = U * X, C = E - (E - X), $ = X - C, j = F * $ - (R - k * C - F * C - k * $), w = q + j, v = w - q, wt[0] = q - (w - v) + (j - v), T = Y + w, v = T - Y, P = Y - (T - v) + (w - v), w = P + R, v = w - P, wt[1] = P - (w - v) + (R - v), V = T + w, v = V - T, wt[2] = T - (V - v) + (w - v), wt[3] = V, B = ht(4, gt, 4, wt, ae), Y = u * g, E = U * u, k = E - (E - u), F = u - k, E = U * g, C = E - (E - g), $ = g - C, q = F * $ - (Y - k * C - F * C - k * $), R = h * d, E = U * h, k = E - (E - h), F = h - k, E = U * d, C = E - (E - d), $ = d - C, j = F * $ - (R - k * C - F * C - k * $), w = q - j, v = q - w, Xt[0] = q - (w + v) + (v - j), T = Y + w, v = T - Y, P = Y - (T - v) + (w - v), w = P - R, v = P - w, Xt[1] = P - (w + v) + (v - R), V = T + w, v = V - T, Xt[2] = T - (V - v) + (w - v), Xt[3] = V, D = 4) : (ae[0] = 0, B = 1, Xt[0] = 0, D = 1), f !== 0) {
      const rt = L(B, ae, f, it);
      c = lt(c, ht(
        L(m, ke, f, K),
        K,
        L(rt, it, 2 * G, et),
        et,
        ct
      ), ct);
      const st = L(D, Xt, f, z);
      c = lt(c, St(
        L(st, z, 2 * G, K),
        K,
        L(st, z, f, nt),
        nt,
        L(rt, it, f, et),
        et,
        Ct,
        vt
      ), vt), d !== 0 && (c = lt(c, L(L(4, Mt, f, z), z, d, K), K)), g !== 0 && (c = lt(c, L(L(4, Et, -f, z), z, g, K), K));
    }
    if (b !== 0) {
      const rt = L(B, ae, b, it);
      c = lt(c, ht(
        L(y, Ee, b, K),
        K,
        L(rt, it, 2 * Z, et),
        et,
        ct
      ), ct);
      const st = L(D, Xt, b, z);
      c = lt(c, St(
        L(st, z, 2 * Z, K),
        K,
        L(st, z, b, nt),
        nt,
        L(rt, it, b, et),
        et,
        Ct,
        vt
      ), vt);
    }
  }
  if (u !== 0 || d !== 0) {
    if (h !== 0 || g !== 0 || f !== 0 || b !== 0 ? (Y = h * Z, E = U * h, k = E - (E - h), F = h - k, E = U * Z, C = E - (E - Z), $ = Z - C, q = F * $ - (Y - k * C - F * C - k * $), R = H * b, E = U * H, k = E - (E - H), F = H - k, E = U * b, C = E - (E - b), $ = b - C, j = F * $ - (R - k * C - F * C - k * $), w = q + j, v = w - q, gt[0] = q - (w - v) + (j - v), T = Y + w, v = T - Y, P = Y - (T - v) + (w - v), w = P + R, v = w - P, gt[1] = P - (w - v) + (R - v), V = T + w, v = V - T, gt[2] = T - (V - v) + (w - v), gt[3] = V, N = -J, X = -g, Y = f * N, E = U * f, k = E - (E - f), F = f - k, E = U * N, C = E - (E - N), $ = N - C, q = F * $ - (Y - k * C - F * C - k * $), R = G * X, E = U * G, k = E - (E - G), F = G - k, E = U * X, C = E - (E - X), $ = X - C, j = F * $ - (R - k * C - F * C - k * $), w = q + j, v = w - q, wt[0] = q - (w - v) + (j - v), T = Y + w, v = T - Y, P = Y - (T - v) + (w - v), w = P + R, v = w - P, wt[1] = P - (w - v) + (R - v), V = T + w, v = V - T, wt[2] = T - (V - v) + (w - v), wt[3] = V, M = ht(4, gt, 4, wt, se), Y = h * b, E = U * h, k = E - (E - h), F = h - k, E = U * b, C = E - (E - b), $ = b - C, q = F * $ - (Y - k * C - F * C - k * $), R = f * g, E = U * f, k = E - (E - f), F = f - k, E = U * g, C = E - (E - g), $ = g - C, j = F * $ - (R - k * C - F * C - k * $), w = q - j, v = q - w, $t[0] = q - (w + v) + (v - j), T = Y + w, v = T - Y, P = Y - (T - v) + (w - v), w = P - R, v = P - w, $t[1] = P - (w + v) + (v - R), V = T + w, v = V - T, $t[2] = T - (V - v) + (w - v), $t[3] = V, I = 4) : (se[0] = 0, M = 1, $t[0] = 0, I = 1), u !== 0) {
      const rt = L(M, se, u, it);
      c = lt(c, ht(
        L(p, Ae, u, K),
        K,
        L(rt, it, 2 * W, et),
        et,
        ct
      ), ct);
      const st = L(I, $t, u, z);
      c = lt(c, St(
        L(st, z, 2 * W, K),
        K,
        L(st, z, u, nt),
        nt,
        L(rt, it, u, et),
        et,
        Ct,
        vt
      ), vt), g !== 0 && (c = lt(c, L(L(4, kt, u, z), z, g, K), K)), b !== 0 && (c = lt(c, L(L(4, Mt, -u, z), z, b, K), K));
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
      const st = L(I, $t, d, z);
      c = lt(c, St(
        L(st, z, 2 * Q, K),
        K,
        L(st, z, d, nt),
        nt,
        L(rt, it, d, et),
        et,
        Ct,
        vt
      ), vt);
    }
  }
  return jt[c - 1];
}
function ni(r, t, e, n, o, i, s, a) {
  const l = r - s, c = e - s, h = o - s, f = t - a, u = n - a, g = i - a, b = c * g, d = h * u, _ = l * l + f * f, A = h * f, m = l * g, y = c * c + u * u, p = l * u, x = c * f, M = h * h + g * g, S = _ * (b - d) + y * (A - m) + M * (p - x), B = (Math.abs(b) + Math.abs(d)) * _ + (Math.abs(A) + Math.abs(m)) * y + (Math.abs(p) + Math.abs(x)) * M, I = Qn * B;
  return S > I || -S > I ? S : ei(r, t, e, n, o, i, s, a, B);
}
function ii(r, t) {
  var e, n, o = 0, i, s, a, l, c, h, f, u = r[0], g = r[1], b = t.length;
  for (e = 0; e < b; e++) {
    n = 0;
    var d = t[e], _ = d.length - 1;
    if (h = d[0], h[0] !== d[_][0] && h[1] !== d[_][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (s = h[0] - u, a = h[1] - g, n; n < _; n++) {
      if (f = d[n + 1], l = f[0] - u, c = f[1] - g, a === 0 && c === 0) {
        if (l <= 0 && s >= 0 || s <= 0 && l >= 0)
          return 0;
      } else if (c >= 0 && a <= 0 || c <= 0 && a >= 0) {
        if (i = dt(s, l, a, c, 0, 0), i === 0)
          return 0;
        (i > 0 && c > 0 && a <= 0 || i < 0 && c <= 0 && a > 0) && o++;
      }
      h = f, a = c, s = l;
    }
  }
  return o % 2 !== 0;
}
function He(r, t, e = {}) {
  if (!r)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const n = zn(r), o = Gn(t), i = o.type, s = t.bbox;
  let a = o.coordinates;
  if (s && ri(n, s) === !1)
    return !1;
  i === "Polygon" && (a = [a]);
  for (var l = 0; l < a.length; ++l) {
    const c = ii(n, a[l]);
    if (c === 0 && !e.ignoreBoundary) return !0;
    if (c) return !0;
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
      const l = s + 1;
      if (l < this.length && n(e[l], a) < 0 && (s = l, a = e[l]), n(a, i) >= 0) break;
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
  let i, s, a, l, c = t[0], h = n[0], f = 0, u = 0;
  h > c == h > -c ? (i = c, c = t[++f]) : (i = h, h = n[++u]);
  let g = 0;
  if (f < r && u < e)
    for (h > c == h > -c ? (s = c + i, a = i - (s - c), c = t[++f]) : (s = h + i, a = i - (s - h), h = n[++u]), i = s, a !== 0 && (o[g++] = a); f < r && u < e; )
      h > c == h > -c ? (s = i + c, l = s - i, a = i - (s - l) + (c - l), c = t[++f]) : (s = i + h, l = s - i, a = i - (s - l) + (h - l), h = n[++u]), i = s, a !== 0 && (o[g++] = a);
  for (; f < r; )
    s = i + c, l = s - i, a = i - (s - l) + (c - l), c = t[++f], i = s, a !== 0 && (o[g++] = a);
  for (; u < e; )
    s = i + h, l = s - i, a = i - (s - l) + (h - l), h = n[++u], i = s, a !== 0 && (o[g++] = a);
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
  let a, l, c, h, f, u, g, b, d, _, A, m, y, p, x, M, S, B;
  const I = r - o, O = e - o, D = t - i, N = n - i;
  p = I * N, u = ut * I, g = u - (u - I), b = I - g, u = ut * N, d = u - (u - N), _ = N - d, x = b * _ - (p - g * d - b * d - g * _), M = D * O, u = ut * D, g = u - (u - D), b = D - g, u = ut * O, d = u - (u - O), _ = O - d, S = b * _ - (M - g * d - b * d - g * _), A = x - S, f = x - A, qt[0] = x - (A + f) + (f - S), m = p + A, f = m - p, y = p - (m - f) + (A - f), A = y - M, f = y - A, qt[1] = y - (A + f) + (f - M), B = m + A, f = B - m, qt[2] = m - (B - f) + (A - f), qt[3] = B;
  let X = ci(4, qt), v = fi * s;
  if (X >= v || -X >= v || (f = r - I, a = r - (I + f) + (f - o), f = e - O, c = e - (O + f) + (f - o), f = t - D, l = t - (D + f) + (f - i), f = n - N, h = n - (N + f) + (f - i), a === 0 && l === 0 && c === 0 && h === 0) || (v = hi * s + ai * Math.abs(X), X += I * h + N * a - (D * c + O * l), X >= v || -X >= v)) return X;
  p = a * N, u = ut * a, g = u - (u - a), b = a - g, u = ut * N, d = u - (u - N), _ = N - d, x = b * _ - (p - g * d - b * d - g * _), M = l * O, u = ut * l, g = u - (u - l), b = l - g, u = ut * O, d = u - (u - O), _ = O - d, S = b * _ - (M - g * d - b * d - g * _), A = x - S, f = x - A, yt[0] = x - (A + f) + (f - S), m = p + A, f = m - p, y = p - (m - f) + (A - f), A = y - M, f = y - A, yt[1] = y - (A + f) + (f - M), B = m + A, f = B - m, yt[2] = m - (B - f) + (A - f), yt[3] = B;
  const E = Oe(4, qt, 4, yt, Ke);
  p = I * h, u = ut * I, g = u - (u - I), b = I - g, u = ut * h, d = u - (u - h), _ = h - d, x = b * _ - (p - g * d - b * d - g * _), M = D * c, u = ut * D, g = u - (u - D), b = D - g, u = ut * c, d = u - (u - c), _ = c - d, S = b * _ - (M - g * d - b * d - g * _), A = x - S, f = x - A, yt[0] = x - (A + f) + (f - S), m = p + A, f = m - p, y = p - (m - f) + (A - f), A = y - M, f = y - A, yt[1] = y - (A + f) + (f - M), B = m + A, f = B - m, yt[2] = m - (B - f) + (A - f), yt[3] = B;
  const k = Oe(E, Ke, 4, yt, We);
  p = a * h, u = ut * a, g = u - (u - a), b = a - g, u = ut * h, d = u - (u - h), _ = h - d, x = b * _ - (p - g * d - b * d - g * _), M = l * c, u = ut * l, g = u - (u - l), b = l - g, u = ut * c, d = u - (u - c), _ = c - d, S = b * _ - (M - g * d - b * d - g * _), A = x - S, f = x - A, yt[0] = x - (A + f) + (f - S), m = p + A, f = m - p, y = p - (m - f) + (A - f), A = y - M, f = y - A, yt[1] = y - (A + f) + (f - M), B = m + A, f = B - m, yt[2] = m - (B - f) + (A - f), yt[3] = B;
  const F = Oe(k, We, 4, yt, Je);
  return Je[F - 1];
}
function Qe(r, t, e, n, o, i) {
  const s = (t - i) * (e - o), a = (r - o) * (n - i), l = s - a;
  if (s === 0 || a === 0 || s > 0 != a > 0) return l;
  const c = Math.abs(s + a);
  return Math.abs(l) >= li * c ? l : -ui(r, t, e, n, o, i, c);
}
function di(r, t) {
  const e = new Pe([], Dn);
  return mi(r, e), gi(e, t);
}
function Dn(r, t) {
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
      for (let l = 0; l < n[o][i].length - 1; l++) {
        a = n[o][i][l + 1];
        const c = new tn(s, ce, le, fe), h = new tn(a, ce, le, fe + 1);
        c.otherEvent = h, h.otherEvent = c, Dn(c, h) > 0 ? (h.isLeftEndpoint = !0, c.isLeftEndpoint = !1) : (c.isLeftEndpoint = !0, h.isLeftEndpoint = !1), t.push(c), t.push(h), s = a, fe = fe + 1;
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
        const l = yi(i, a);
        l !== !1 && e.push(l);
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
  const e = r.leftSweepEvent.p.x, n = r.leftSweepEvent.p.y, o = r.rightSweepEvent.p.x, i = r.rightSweepEvent.p.y, s = t.leftSweepEvent.p.x, a = t.leftSweepEvent.p.y, l = t.rightSweepEvent.p.x, c = t.rightSweepEvent.p.y, h = Qe(e, n, o, i, s, a), f = Qe(e, n, o, i, l, c);
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
  const u = (c - a) * (o - e) - (l - s) * (i - n), g = (l - s) * (n - a) - (c - a) * (e - s), b = (o - e) * (n - a) - (i - n) * (e - s);
  if (u === 0)
    return !1;
  const d = g / u, _ = b / u;
  if (d >= 0 && d <= 1 && _ >= 0 && _ <= 1) {
    const A = e + d * (o - e), m = n + d * (i - n);
    return [A, m];
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
    const l = {};
    s.forEach((c) => {
      const h = c.join(",");
      l[h] || (l[h] = !0, a.push(c));
    });
  } else
    a = s;
  return xt(a.map((l) => Rt(l)));
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
  ), Rt([e / o, n / o], t.properties);
}
var he = { exports: {} }, we = { exports: {} }, Si = we.exports, en;
function Mi() {
  return en || (en = 1, (function(r, t) {
    (function(e, n) {
      r.exports = n();
    })(Si, function() {
      function e(m, y, p, x, M) {
        (function S(B, I, O, D, N) {
          for (; D > O; ) {
            if (D - O > 600) {
              var X = D - O + 1, v = I - O + 1, E = Math.log(X), k = 0.5 * Math.exp(2 * E / 3), F = 0.5 * Math.sqrt(E * k * (X - k) / X) * (v - X / 2 < 0 ? -1 : 1), C = Math.max(O, Math.floor(I - v * k / X + F)), $ = Math.min(D, Math.floor(I + (X - v) * k / X + F));
              S(B, I, C, $, N);
            }
            var w = B[I], T = O, P = D;
            for (n(B, O, I), N(B[D], w) > 0 && n(B, O, D); T < P; ) {
              for (n(B, T, P), T++, P--; N(B[T], w) < 0; ) T++;
              for (; N(B[P], w) > 0; ) P--;
            }
            N(B[O], w) === 0 ? n(B, O, P) : n(B, ++P, D), P <= I && (O = P + 1), I <= P && (D = P - 1);
          }
        })(m, y, p || 0, x || m.length - 1, M || o);
      }
      function n(m, y, p) {
        var x = m[y];
        m[y] = m[p], m[p] = x;
      }
      function o(m, y) {
        return m < y ? -1 : m > y ? 1 : 0;
      }
      var i = function(m) {
        m === void 0 && (m = 9), this._maxEntries = Math.max(4, m), this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries)), this.clear();
      };
      function s(m, y, p) {
        if (!p) return y.indexOf(m);
        for (var x = 0; x < y.length; x++) if (p(m, y[x])) return x;
        return -1;
      }
      function a(m, y) {
        l(m, 0, m.children.length, y, m);
      }
      function l(m, y, p, x, M) {
        M || (M = _(null)), M.minX = 1 / 0, M.minY = 1 / 0, M.maxX = -1 / 0, M.maxY = -1 / 0;
        for (var S = y; S < p; S++) {
          var B = m.children[S];
          c(M, m.leaf ? x(B) : B);
        }
        return M;
      }
      function c(m, y) {
        return m.minX = Math.min(m.minX, y.minX), m.minY = Math.min(m.minY, y.minY), m.maxX = Math.max(m.maxX, y.maxX), m.maxY = Math.max(m.maxY, y.maxY), m;
      }
      function h(m, y) {
        return m.minX - y.minX;
      }
      function f(m, y) {
        return m.minY - y.minY;
      }
      function u(m) {
        return (m.maxX - m.minX) * (m.maxY - m.minY);
      }
      function g(m) {
        return m.maxX - m.minX + (m.maxY - m.minY);
      }
      function b(m, y) {
        return m.minX <= y.minX && m.minY <= y.minY && y.maxX <= m.maxX && y.maxY <= m.maxY;
      }
      function d(m, y) {
        return y.minX <= m.maxX && y.minY <= m.maxY && y.maxX >= m.minX && y.maxY >= m.minY;
      }
      function _(m) {
        return { children: m, height: 1, leaf: !0, minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
      }
      function A(m, y, p, x, M) {
        for (var S = [y, p]; S.length; ) if (!((p = S.pop()) - (y = S.pop()) <= x)) {
          var B = y + Math.ceil((p - y) / x / 2) * x;
          e(m, B, y, p, M), S.push(y, B, B, p);
        }
      }
      return i.prototype.all = function() {
        return this._all(this.data, []);
      }, i.prototype.search = function(m) {
        var y = this.data, p = [];
        if (!d(m, y)) return p;
        for (var x = this.toBBox, M = []; y; ) {
          for (var S = 0; S < y.children.length; S++) {
            var B = y.children[S], I = y.leaf ? x(B) : B;
            d(m, I) && (y.leaf ? p.push(B) : b(m, I) ? this._all(B, p) : M.push(B));
          }
          y = M.pop();
        }
        return p;
      }, i.prototype.collides = function(m) {
        var y = this.data;
        if (!d(m, y)) return !1;
        for (var p = []; y; ) {
          for (var x = 0; x < y.children.length; x++) {
            var M = y.children[x], S = y.leaf ? this.toBBox(M) : M;
            if (d(m, S)) {
              if (y.leaf || b(m, S)) return !0;
              p.push(M);
            }
          }
          y = p.pop();
        }
        return !1;
      }, i.prototype.load = function(m) {
        if (!m || !m.length) return this;
        if (m.length < this._minEntries) {
          for (var y = 0; y < m.length; y++) this.insert(m[y]);
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
      }, i.prototype.insert = function(m) {
        return m && this._insert(m, this.data.height - 1), this;
      }, i.prototype.clear = function() {
        return this.data = _([]), this;
      }, i.prototype.remove = function(m, y) {
        if (!m) return this;
        for (var p, x, M, S = this.data, B = this.toBBox(m), I = [], O = []; S || I.length; ) {
          if (S || (S = I.pop(), x = I[I.length - 1], p = O.pop(), M = !0), S.leaf) {
            var D = s(m, S.children, y);
            if (D !== -1) return S.children.splice(D, 1), I.push(S), this._condense(I), this;
          }
          M || S.leaf || !b(S, B) ? x ? (p++, S = x.children[p], M = !1) : S = null : (I.push(S), O.push(p), p = 0, x = S, S = S.children[0]);
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
        for (var p = []; m; ) m.leaf ? y.push.apply(y, m.children) : p.push.apply(p, m.children), m = p.pop();
        return y;
      }, i.prototype._build = function(m, y, p, x) {
        var M, S = p - y + 1, B = this._maxEntries;
        if (S <= B) return a(M = _(m.slice(y, p + 1)), this.toBBox), M;
        x || (x = Math.ceil(Math.log(S) / Math.log(B)), B = Math.ceil(S / Math.pow(B, x - 1))), (M = _([])).leaf = !1, M.height = x;
        var I = Math.ceil(S / B), O = I * Math.ceil(Math.sqrt(B));
        A(m, y, p, O, this.compareMinX);
        for (var D = y; D <= p; D += O) {
          var N = Math.min(D + O - 1, p);
          A(m, D, N, I, this.compareMinY);
          for (var X = D; X <= N; X += I) {
            var v = Math.min(X + I - 1, N);
            M.children.push(this._build(m, X, v, x - 1));
          }
        }
        return a(M, this.toBBox), M;
      }, i.prototype._chooseSubtree = function(m, y, p, x) {
        for (; x.push(y), !y.leaf && x.length - 1 !== p; ) {
          for (var M = 1 / 0, S = 1 / 0, B = void 0, I = 0; I < y.children.length; I++) {
            var O = y.children[I], D = u(O), N = (X = m, v = O, (Math.max(v.maxX, X.maxX) - Math.min(v.minX, X.minX)) * (Math.max(v.maxY, X.maxY) - Math.min(v.minY, X.minY)) - D);
            N < S ? (S = N, M = D < M ? D : M, B = O) : N === S && D < M && (M = D, B = O);
          }
          y = B || y.children[0];
        }
        var X, v;
        return y;
      }, i.prototype._insert = function(m, y, p) {
        var x = p ? m : this.toBBox(m), M = [], S = this._chooseSubtree(x, this.data, y, M);
        for (S.children.push(m), c(S, x); y >= 0 && M[y].children.length > this._maxEntries; ) this._split(M, y), y--;
        this._adjustParentBBoxes(x, M, y);
      }, i.prototype._split = function(m, y) {
        var p = m[y], x = p.children.length, M = this._minEntries;
        this._chooseSplitAxis(p, M, x);
        var S = this._chooseSplitIndex(p, M, x), B = _(p.children.splice(S, p.children.length - S));
        B.height = p.height, B.leaf = p.leaf, a(p, this.toBBox), a(B, this.toBBox), y ? m[y - 1].children.push(B) : this._splitRoot(p, B);
      }, i.prototype._splitRoot = function(m, y) {
        this.data = _([m, y]), this.data.height = m.height + 1, this.data.leaf = !1, a(this.data, this.toBBox);
      }, i.prototype._chooseSplitIndex = function(m, y, p) {
        for (var x, M, S, B, I, O, D, N = 1 / 0, X = 1 / 0, v = y; v <= p - y; v++) {
          var E = l(m, 0, v, this.toBBox), k = l(m, v, p, this.toBBox), F = (M = E, S = k, B = void 0, I = void 0, O = void 0, D = void 0, B = Math.max(M.minX, S.minX), I = Math.max(M.minY, S.minY), O = Math.min(M.maxX, S.maxX), D = Math.min(M.maxY, S.maxY), Math.max(0, O - B) * Math.max(0, D - I)), C = u(E) + u(k);
          F < N ? (N = F, x = v, X = C < X ? C : X) : F === N && C < X && (X = C, x = v);
        }
        return x || p - y;
      }, i.prototype._chooseSplitAxis = function(m, y, p) {
        var x = m.leaf ? this.compareMinX : h, M = m.leaf ? this.compareMinY : f;
        this._allDistMargin(m, y, p, x) < this._allDistMargin(m, y, p, M) && m.children.sort(x);
      }, i.prototype._allDistMargin = function(m, y, p, x) {
        m.children.sort(x);
        for (var M = this.toBBox, S = l(m, 0, y, M), B = l(m, p - y, p, M), I = g(S) + g(B), O = y; O < p - y; O++) {
          var D = m.children[O];
          c(S, m.leaf ? M(D) : D), I += g(S);
        }
        for (var N = p - y - 1; N >= y; N--) {
          var X = m.children[N];
          c(B, m.leaf ? M(X) : X), I += g(B);
        }
        return I;
      }, i.prototype._adjustParentBBoxes = function(m, y, p) {
        for (var x = p; x >= 0; x--) c(y[x], m);
      }, i.prototype._condense = function(m) {
        for (var y = m.length - 1, p = void 0; y >= 0; y--) m[y].children.length === 0 ? y > 0 ? (p = m[y - 1].children).splice(p.indexOf(m[y]), 1) : this.clear() : a(m[y], this.toBBox);
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
    for (var l = (o - n) / 2, c = 0, h = l - 1; c < l; h = c++) {
      var f = e[n + c * 2 + 0], u = e[n + c * 2 + 1], g = e[n + h * 2 + 0], b = e[n + h * 2 + 1], d = u > s != b > s && i < (g - f) * (s - u) / (b - u) + f;
      d && (a = !a);
    }
    return a;
  }), Te;
}
var Fe, rn;
function Ai() {
  return rn || (rn = 1, Fe = function(t, e, n, o) {
    var i = t[0], s = t[1], a = !1;
    n === void 0 && (n = 0), o === void 0 && (o = e.length);
    for (var l = o - n, c = 0, h = l - 1; c < l; h = c++) {
      var f = e[c + n][0], u = e[c + n][1], g = e[h + n][0], b = e[h + n][1], d = u > s != b > s && i < (g - f) * (s - u) / (b - u) + f;
      d && (a = !a);
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
var Ht = { exports: {} }, Bi = Ht.exports, on;
function Oi() {
  return on || (on = 1, (function(r, t) {
    (function(e, n) {
      n(t);
    })(Bi, function(e) {
      const o = 33306690738754706e-32;
      function i(d, _, A, m, y) {
        let p, x, M, S, B = _[0], I = m[0], O = 0, D = 0;
        I > B == I > -B ? (p = B, B = _[++O]) : (p = I, I = m[++D]);
        let N = 0;
        if (O < d && D < A) for (I > B == I > -B ? (M = p - ((x = B + p) - B), B = _[++O]) : (M = p - ((x = I + p) - I), I = m[++D]), p = x, M !== 0 && (y[N++] = M); O < d && D < A; ) I > B == I > -B ? (M = p - ((x = p + B) - (S = x - p)) + (B - S), B = _[++O]) : (M = p - ((x = p + I) - (S = x - p)) + (I - S), I = m[++D]), p = x, M !== 0 && (y[N++] = M);
        for (; O < d; ) M = p - ((x = p + B) - (S = x - p)) + (B - S), B = _[++O], p = x, M !== 0 && (y[N++] = M);
        for (; D < A; ) M = p - ((x = p + I) - (S = x - p)) + (I - S), I = m[++D], p = x, M !== 0 && (y[N++] = M);
        return p === 0 && N !== 0 || (y[N++] = p), N;
      }
      function s(d) {
        return new Float64Array(d);
      }
      const a = 33306690738754716e-32, l = 22204460492503146e-32, c = 11093356479670487e-47, h = s(4), f = s(8), u = s(12), g = s(16), b = s(4);
      e.orient2d = function(d, _, A, m, y, p) {
        const x = (_ - p) * (A - y), M = (d - y) * (m - p), S = x - M;
        if (x === 0 || M === 0 || x > 0 != M > 0) return S;
        const B = Math.abs(x + M);
        return Math.abs(S) >= a * B ? S : -(function(I, O, D, N, X, v, E) {
          let k, F, C, $, w, T, P, Y, q, R, j, V, H, G, W, J, Z, Q;
          const at = I - X, ft = D - X, rt = O - v, st = N - v;
          w = (W = (Y = at - (P = (T = 134217729 * at) - (T - at))) * (R = st - (q = (T = 134217729 * st) - (T - st))) - ((G = at * st) - P * q - Y * q - P * R)) - (j = W - (Z = (Y = rt - (P = (T = 134217729 * rt) - (T - rt))) * (R = ft - (q = (T = 134217729 * ft) - (T - ft))) - ((J = rt * ft) - P * q - Y * q - P * R))), h[0] = W - (j + w) + (w - Z), w = (H = G - ((V = G + j) - (w = V - G)) + (j - w)) - (j = H - J), h[1] = H - (j + w) + (w - J), w = (Q = V + j) - V, h[2] = V - (Q - w) + (j - w), h[3] = Q;
          let Ot = (function(Ln, Re) {
            let Le = Re[0];
            for (let xe = 1; xe < Ln; xe++) Le += Re[xe];
            return Le;
          })(4, h), Ut = l * E;
          if (Ot >= Ut || -Ot >= Ut || (k = I - (at + (w = I - at)) + (w - X), C = D - (ft + (w = D - ft)) + (w - X), F = O - (rt + (w = O - rt)) + (w - v), $ = N - (st + (w = N - st)) + (w - v), k === 0 && F === 0 && C === 0 && $ === 0) || (Ut = c * E + o * Math.abs(Ot), (Ot += at * $ + st * k - (rt * C + ft * F)) >= Ut || -Ot >= Ut)) return Ot;
          w = (W = (Y = k - (P = (T = 134217729 * k) - (T - k))) * (R = st - (q = (T = 134217729 * st) - (T - st))) - ((G = k * st) - P * q - Y * q - P * R)) - (j = W - (Z = (Y = F - (P = (T = 134217729 * F) - (T - F))) * (R = ft - (q = (T = 134217729 * ft) - (T - ft))) - ((J = F * ft) - P * q - Y * q - P * R))), b[0] = W - (j + w) + (w - Z), w = (H = G - ((V = G + j) - (w = V - G)) + (j - w)) - (j = H - J), b[1] = H - (j + w) + (w - J), w = (Q = V + j) - V, b[2] = V - (Q - w) + (j - w), b[3] = Q;
          const Xn = i(4, h, 4, b, f);
          w = (W = (Y = at - (P = (T = 134217729 * at) - (T - at))) * (R = $ - (q = (T = 134217729 * $) - (T - $))) - ((G = at * $) - P * q - Y * q - P * R)) - (j = W - (Z = (Y = rt - (P = (T = 134217729 * rt) - (T - rt))) * (R = C - (q = (T = 134217729 * C) - (T - C))) - ((J = rt * C) - P * q - Y * q - P * R))), b[0] = W - (j + w) + (w - Z), w = (H = G - ((V = G + j) - (w = V - G)) + (j - w)) - (j = H - J), b[1] = H - (j + w) + (w - J), w = (Q = V + j) - V, b[2] = V - (Q - w) + (j - w), b[3] = Q;
          const Yn = i(Xn, f, 4, b, u);
          w = (W = (Y = k - (P = (T = 134217729 * k) - (T - k))) * (R = $ - (q = (T = 134217729 * $) - (T - $))) - ((G = k * $) - P * q - Y * q - P * R)) - (j = W - (Z = (Y = F - (P = (T = 134217729 * F) - (T - F))) * (R = C - (q = (T = 134217729 * C) - (T - C))) - ((J = F * C) - P * q - Y * q - P * R))), b[0] = W - (j + w) + (w - Z), w = (H = G - ((V = G + j) - (w = V - G)) + (j - w)) - (j = H - J), b[1] = H - (j + w) + (w - J), w = (Q = V + j) - V, b[2] = V - (Q - w) + (j - w), b[3] = Q;
          const Rn = i(Yn, u, 4, b, g);
          return g[Rn - 1];
        })(d, _, A, m, y, p, B);
      }, e.orient2dfast = function(d, _, A, m, y, p) {
        return (_ - p) * (A - y) - (d - y) * (m - p);
      }, Object.defineProperty(e, "__esModule", { value: !0 });
    });
  })(Ht, Ht.exports)), Ht.exports;
}
var an;
function Ti() {
  if (an) return he.exports;
  an = 1;
  var r = Mi(), t = ki, e = Ii(), n = Oi().orient2d;
  t.default && (t = t.default), he.exports = o, he.exports.default = o;
  function o(p, x, M) {
    x = Math.max(0, x === void 0 ? 2 : x), M = M || 0;
    var S = g(p), B = new r(16);
    B.toBBox = function(P) {
      return {
        minX: P[0],
        minY: P[1],
        maxX: P[0],
        maxY: P[1]
      };
    }, B.compareMinX = function(P, Y) {
      return P[0] - Y[0];
    }, B.compareMinY = function(P, Y) {
      return P[1] - Y[1];
    }, B.load(p);
    for (var I = [], O = 0, D; O < S.length; O++) {
      var N = S[O];
      B.remove(N), D = b(N, D), I.push(D);
    }
    var X = new r(16);
    for (O = 0; O < I.length; O++) X.insert(u(I[O]));
    for (var v = x * x, E = M * M; I.length; ) {
      var k = I.shift(), F = k.p, C = k.next.p, $ = d(F, C);
      if (!($ < E)) {
        var w = $ / v;
        N = i(B, k.prev.p, F, C, k.next.next.p, w, X), N && Math.min(d(N, F), d(N, C)) <= w && (I.push(k), I.push(b(N, k)), B.remove(N), X.remove(k), X.insert(u(k)), X.insert(u(k.next)));
      }
    }
    k = D;
    var T = [];
    do
      T.push(k.p), k = k.next;
    while (k !== D);
    return T.push(k.p), T;
  }
  function i(p, x, M, S, B, I, O) {
    for (var D = new t([], s), N = p.data; N; ) {
      for (var X = 0; X < N.children.length; X++) {
        var v = N.children[X], E = N.leaf ? _(v, M, S) : a(M, S, v);
        E > I || D.push({
          node: v,
          dist: E
        });
      }
      for (; D.length && !D.peek().node.children; ) {
        var k = D.pop(), F = k.node, C = _(F, x, M), $ = _(F, S, B);
        if (k.dist < C && k.dist < $ && c(M, F, O) && c(S, F, O)) return F;
      }
      N = D.pop(), N && (N = N.node);
    }
    return null;
  }
  function s(p, x) {
    return p.dist - x.dist;
  }
  function a(p, x, M) {
    if (l(p, M) || l(x, M)) return 0;
    var S = A(p[0], p[1], x[0], x[1], M.minX, M.minY, M.maxX, M.minY);
    if (S === 0) return 0;
    var B = A(p[0], p[1], x[0], x[1], M.minX, M.minY, M.minX, M.maxY);
    if (B === 0) return 0;
    var I = A(p[0], p[1], x[0], x[1], M.maxX, M.minY, M.maxX, M.maxY);
    if (I === 0) return 0;
    var O = A(p[0], p[1], x[0], x[1], M.minX, M.maxY, M.maxX, M.maxY);
    return O === 0 ? 0 : Math.min(S, B, I, O);
  }
  function l(p, x) {
    return p[0] >= x.minX && p[0] <= x.maxX && p[1] >= x.minY && p[1] <= x.maxY;
  }
  function c(p, x, M) {
    for (var S = Math.min(p[0], x[0]), B = Math.min(p[1], x[1]), I = Math.max(p[0], x[0]), O = Math.max(p[1], x[1]), D = M.search({ minX: S, minY: B, maxX: I, maxY: O }), N = 0; N < D.length; N++)
      if (f(D[N].p, D[N].next.p, p, x)) return !1;
    return !0;
  }
  function h(p, x, M) {
    return n(p[0], p[1], x[0], x[1], M[0], M[1]);
  }
  function f(p, x, M, S) {
    return p !== S && x !== M && h(p, x, M) > 0 != h(p, x, S) > 0 && h(M, S, p) > 0 != h(M, S, x) > 0;
  }
  function u(p) {
    var x = p.p, M = p.next.p;
    return p.minX = Math.min(x[0], M[0]), p.minY = Math.min(x[1], M[1]), p.maxX = Math.max(x[0], M[0]), p.maxY = Math.max(x[1], M[1]), p;
  }
  function g(p) {
    for (var x = p[0], M = p[0], S = p[0], B = p[0], I = 0; I < p.length; I++) {
      var O = p[I];
      O[0] < x[0] && (x = O), O[0] > S[0] && (S = O), O[1] < M[1] && (M = O), O[1] > B[1] && (B = O);
    }
    var D = [x, M, S, B], N = D.slice();
    for (I = 0; I < p.length; I++)
      e(p[I], D) || N.push(p[I]);
    return y(N);
  }
  function b(p, x) {
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
    var M = p[0] - x[0], S = p[1] - x[1];
    return M * M + S * S;
  }
  function _(p, x, M) {
    var S = x[0], B = x[1], I = M[0] - S, O = M[1] - B;
    if (I !== 0 || O !== 0) {
      var D = ((p[0] - S) * I + (p[1] - B) * O) / (I * I + O * O);
      D > 1 ? (S = M[0], B = M[1]) : D > 0 && (S += I * D, B += O * D);
    }
    return I = p[0] - S, O = p[1] - B, I * I + O * O;
  }
  function A(p, x, M, S, B, I, O, D) {
    var N = M - p, X = S - x, v = O - B, E = D - I, k = p - B, F = x - I, C = N * N + X * X, $ = N * v + X * E, w = v * v + E * E, T = N * k + X * F, P = v * k + E * F, Y = C * w - $ * $, q, R, j, V, H = Y, G = Y;
    Y === 0 ? (R = 0, H = 1, V = P, G = w) : (R = $ * P - w * T, V = C * P - $ * T, R < 0 ? (R = 0, V = P, G = w) : R > H && (R = H, V = P + $, G = w)), V < 0 ? (V = 0, -T < 0 ? R = 0 : -T > C ? R = H : (R = -T, H = C)) : V > G && (V = G, -T + $ < 0 ? R = 0 : -T + $ > C ? R = H : (R = -T + $, H = C)), q = R === 0 ? 0 : R / H, j = V === 0 ? 0 : V / G;
    var W = (1 - q) * p + q * M, J = (1 - q) * x + q * S, Z = (1 - j) * B + j * O, Q = (1 - j) * I + j * D, at = Z - W, ft = Q - J;
    return at * at + ft * ft;
  }
  function m(p, x) {
    return p[0] === x[0] ? p[1] - x[1] : p[0] - x[0];
  }
  function y(p) {
    p.sort(m);
    for (var x = [], M = 0; M < p.length; M++) {
      for (; x.length >= 2 && h(x[x.length - 2], x[x.length - 1], p[M]) <= 0; )
        x.pop();
      x.push(p[M]);
    }
    for (var S = [], B = p.length - 1; B >= 0; B--) {
      for (; S.length >= 2 && h(S[S.length - 2], S[S.length - 1], p[B]) <= 0; )
        S.pop();
      S.push(p[B]);
    }
    return S.pop(), x.pop(), x.concat(S);
  }
  return he.exports;
}
var Fi = Ti();
const Di = /* @__PURE__ */ bi(Fi);
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
  static from(t, e = Xi, n = Yi) {
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
    let a = 1 / 0, l = 1 / 0, c = -1 / 0, h = -1 / 0;
    for (let I = 0; I < s; I++) {
      const O = t[2 * I], D = t[2 * I + 1];
      O < a && (a = O), D < l && (l = D), O > c && (c = O), D > h && (h = D), this._ids[I] = I;
    }
    const f = (a + c) / 2, u = (l + h) / 2;
    let g = 0, b = 0, d = 0;
    for (let I = 0, O = 1 / 0; I < s; I++) {
      const D = De(f, u, t[2 * I], t[2 * I + 1]);
      D < O && (g = I, O = D);
    }
    const _ = t[2 * g], A = t[2 * g + 1];
    for (let I = 0, O = 1 / 0; I < s; I++) {
      if (I === g) continue;
      const D = De(_, A, t[2 * I], t[2 * I + 1]);
      D < O && D > 0 && (b = I, O = D);
    }
    let m = t[2 * b], y = t[2 * b + 1], p = 1 / 0;
    for (let I = 0; I < s; I++) {
      if (I === g || I === b) continue;
      const O = $i(_, A, m, y, t[2 * I], t[2 * I + 1]);
      O < p && (d = I, p = O);
    }
    let x = t[2 * d], M = t[2 * d + 1];
    if (p === 1 / 0) {
      for (let D = 0; D < s; D++)
        this._dists[D] = t[2 * D] - t[0] || t[2 * D + 1] - t[1];
      Vt(this._ids, this._dists, 0, s - 1);
      const I = new Uint32Array(s);
      let O = 0;
      for (let D = 0, N = -1 / 0; D < s; D++) {
        const X = this._ids[D], v = this._dists[X];
        v > N && (I[O++] = X, N = v);
      }
      this.hull = I.subarray(0, O), this.triangles = new Uint32Array(0), this.halfedges = new Int32Array(0);
      return;
    }
    if (dt(_, A, m, y, x, M) < 0) {
      const I = b, O = m, D = y;
      b = d, m = x, y = M, d = I, x = O, M = D;
    }
    const S = Pi(_, A, m, y, x, M);
    this._cx = S.x, this._cy = S.y;
    for (let I = 0; I < s; I++)
      this._dists[I] = De(t[2 * I], t[2 * I + 1], S.x, S.y);
    Vt(this._ids, this._dists, 0, s - 1), this._hullStart = g;
    let B = 3;
    n[g] = e[d] = b, n[b] = e[g] = d, n[d] = e[b] = g, o[g] = 0, o[b] = 1, o[d] = 2, i.fill(-1), i[this._hashKey(_, A)] = g, i[this._hashKey(m, y)] = b, i[this._hashKey(x, M)] = d, this.trianglesLen = 0, this._addTriangle(g, b, d, -1, -1, -1);
    for (let I = 0, O = 0, D = 0; I < this._ids.length; I++) {
      const N = this._ids[I], X = t[2 * N], v = t[2 * N + 1];
      if (I > 0 && Math.abs(X - O) <= ln && Math.abs(v - D) <= ln || (O = X, D = v, N === g || N === b || N === d)) continue;
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
      let C = this._addTriangle(k, N, n[k], -1, -1, o[k]);
      o[N] = this._legalize(C + 2), o[k] = C, B++;
      let $ = n[k];
      for (; F = n[$], dt(X, v, t[2 * $], t[2 * $ + 1], t[2 * F], t[2 * F + 1]) < 0; )
        C = this._addTriangle($, N, F, o[N], -1, o[$]), o[N] = this._legalize(C + 2), n[$] = $, B--, $ = F;
      if (k === E)
        for (; F = e[k], dt(X, v, t[2 * F], t[2 * F + 1], t[2 * k], t[2 * k + 1]) < 0; )
          C = this._addTriangle(F, N, k, -1, o[k], o[F]), this._legalize(C + 2), o[F] = C, n[k] = k, B--, k = F;
      this._hullStart = e[N] = k, n[k] = e[$] = N, n[N] = $, i[this._hashKey(X, v)] = N, i[this._hashKey(t[2 * k], t[2 * k + 1])] = k;
    }
    this.hull = new Uint32Array(B);
    for (let I = 0, O = this._hullStart; I < B; I++)
      this.hull[I] = O, O = n[O];
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
    let i = 0, s = 0;
    for (; ; ) {
      const a = n[t], l = t - t % 3;
      if (s = l + (t + 2) % 3, a === -1) {
        if (i === 0) break;
        t = ue[--i];
        continue;
      }
      const c = a - a % 3, h = l + (t + 1) % 3, f = c + (a + 2) % 3, u = e[s], g = e[t], b = e[h], d = e[f];
      if (Ni(
        o[2 * u],
        o[2 * u + 1],
        o[2 * g],
        o[2 * g + 1],
        o[2 * b],
        o[2 * b + 1],
        o[2 * d],
        o[2 * d + 1]
      )) {
        e[t] = d, e[a] = u;
        const A = n[f];
        if (A === -1) {
          let y = this._hullStart;
          do {
            if (this._hullTri[y] === f) {
              this._hullTri[y] = t;
              break;
            }
            y = this._hullPrev[y];
          } while (y !== this._hullStart);
        }
        this._link(t, A), this._link(a, n[s]), this._link(s, f);
        const m = c + (a + 1) % 3;
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
function Ci(r, t) {
  const e = r / (Math.abs(r) + Math.abs(t));
  return (t > 0 ? 3 - e : 1 + e) / 4;
}
function De(r, t, e, n) {
  const o = r - e, i = t - n;
  return o * o + i * i;
}
function Ni(r, t, e, n, o, i, s, a) {
  const l = r - s, c = t - a, h = e - s, f = n - a, u = o - s, g = i - a, b = l * l + c * c, d = h * h + f * f, _ = u * u + g * g;
  return l * (f * _ - d * g) - c * (h * _ - d * u) + b * (h * g - f * u) < 0;
}
function $i(r, t, e, n, o, i) {
  const s = e - r, a = n - t, l = o - r, c = i - t, h = s * s + a * a, f = l * l + c * c, u = 0.5 / (s * c - a * l), g = (c * h - a * f) * u, b = (s * f - l * h) * u;
  return g * g + b * b;
}
function Pi(r, t, e, n, o, i) {
  const s = e - r, a = n - t, l = o - r, c = i - t, h = s * s + a * a, f = l * l + c * c, u = 0.5 / (s * c - a * l), g = r + (c * h - a * f) * u, b = t + (s * f - l * h) * u;
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
    Gt(r, o, i), t[r[e]] > t[r[n]] && Gt(r, e, n), t[r[i]] > t[r[n]] && Gt(r, i, n), t[r[e]] > t[r[i]] && Gt(r, e, i);
    const a = r[i], l = t[a];
    for (; ; ) {
      do
        i++;
      while (t[r[i]] < l);
      do
        s--;
      while (t[r[s]] > l);
      if (s < i) break;
      Gt(r, i, s);
    }
    r[e + 1] = r[s], r[s] = a, n - i + 1 >= s - e ? (Vt(r, t, i, n), Vt(r, t, e, s - 1)) : (Vt(r, t, e, s - 1), Vt(r, t, i, n));
  }
}
function Gt(r, t, e) {
  const n = r[t];
  r[t] = r[e], r[e] = n;
}
function Xi(r) {
  return r[0];
}
function Yi(r) {
  return r[1];
}
class Ri {
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
class fn extends Ri {
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
  const l = dt(r, t, o, i, s, a), c = dt(e, n, o, i, s, a);
  if (l > 0 && c > 0 || l < 0 && c < 0)
    return !1;
  const h = dt(o, i, r, t, e, n), f = dt(s, a, r, t, e, n);
  return h > 0 && f > 0 || h < 0 && f < 0 ? !1 : l === 0 && c === 0 && h === 0 && f === 0 ? !(Math.max(o, s) < Math.min(r, e) || Math.max(r, e) < Math.min(o, s) || Math.max(i, a) < Math.min(t, n) || Math.max(t, n) < Math.min(i, a)) : !0;
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
    let a = 0, l = i;
    do {
      if (++a > s)
        throw new Error(
          `Constraining edge [${t}, ${e}] exceeded the iteration limit`
        );
      const f = n[l], u = At(l);
      if (f === e)
        return this.protect(l);
      const g = _t(l), b = n[g];
      if (b === e)
        return this.protect(u), u;
      if (this.intersectSegments(t, e, b, f)) {
        l = g;
        break;
      }
      l = o[u];
    } while (l !== -1 && l !== i);
    let c = l, h = -1;
    for (; l !== -1; ) {
      if (++a > s)
        throw new Error(
          `Constraining edge [${t}, ${e}] exceeded the iteration limit`
        );
      const f = o[l], u = _t(l), g = _t(f), b = At(f);
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
          n[b],
          n[g]
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
        n[g]
      ) && (h === -1 && (h = u), h === u))
        throw new Error("Infinite loop: flipped diagonal still intersects");
      n[g] === e ? (c = g, l = h, h = -1) : this.intersectSegments(
        t,
        e,
        n[b],
        n[g]
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
    const { triangles: n, halfedges: o } = this.del, i = n.length / 3, s = (b, d, _) => {
      const A = t(d), m = t(_);
      return t(b).some((y) => A.includes(y) && m.includes(y));
    }, a = (b) => s(n[b * 3], n[b * 3 + 1], n[b * 3 + 2]), l = (b, d, _, A) => Math.sign(dt(b[d * 2], b[d * 2 + 1], b[_ * 2], b[_ * 2 + 1], b[A * 2], b[A * 2 + 1])), c = e.map((b) => {
      let d = 0;
      for (let _ = 0; _ < i; _++) d += l(b, n[_ * 3], n[_ * 3 + 1], n[_ * 3 + 2]);
      return d < 0 ? -1 : 1;
    }), h = (b) => {
      if (this.consd.has(b)) return !1;
      const d = o[b];
      if (d === -1) return !1;
      const _ = n[b], A = n[At(b)], m = n[_t(b)], y = n[_t(d)];
      return e.every((p, x) => l(p, m, _, y) === c[x] && l(p, y, A, m) === c[x]);
    };
    let f = 0, u = !0;
    for (; u; ) {
      u = !1;
      for (let b = 0; b < i; b++)
        if (a(b))
          for (let d = 0; d < 3; d++) {
            const _ = b * 3 + d;
            if (!h(_)) continue;
            const A = o[_], m = n[_], y = n[At(_)], p = n[_t(_)], x = n[_t(A)];
            if (!(s(p, m, x) && s(x, y, p))) {
              this.protect(this.flipDiagonal(_)), f++, u = !0;
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
    let s = n, a, l = 0;
    do {
      if (++l > o.length)
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
    const { triangles: e, halfedges: n } = this.del, o = this.flips, i = this.consd, s = n[t], a = _t(t), l = At(t), c = _t(s), h = At(s), f = n[a], u = n[c];
    if (i.has(t))
      throw new Error("Trying to flip a constrained edge");
    return e[t] = e[c], n[t] = u, o.set(t, o.has(c)) || i.set(t, i.has(c)), u !== -1 && (n[u] = t), n[a] = c, e[s] = e[a], n[s] = f, o.set(s, o.has(a)) || i.set(s, i.has(a)), f !== -1 && (n[f] = s), n[c] = a, this.markFlip(t), this.markFlip(l), this.markFlip(s), this.markFlip(h), o.add(a), i.delete(a), o.add(c), i.delete(c), this.updateVert(t), this.updateVert(l), this.updateVert(s), this.updateVert(h), a;
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
    const i = e[_t(t)], s = e[t], a = e[At(t)], l = e[_t(o)];
    return !this.inCircle(i, s, a, l);
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
  return Ce(r, t, e).tin;
}
function Ce(r, t, e, n, o) {
  if (t || (t = []), typeof r != "object" || r.type !== "FeatureCollection")
    throw "Argument points must be FeatureCollection";
  if (!Array.isArray(t)) throw "Argument points must be Array of Array";
  const i = r.features.map(
    (d) => d.geometry.coordinates
  );
  let s = o?.snapshot ? Zt.restore(o.snapshot) : void 0;
  const a = s ? void 0 : Xe.from(i);
  let l = s ? s.del : a, c = 0, h;
  const f = [];
  if (l.triangles.length !== 0 && (t.length !== 0 || n)) {
    if (!s) {
      s = new Zt(l);
      try {
        s.constrainAll(t);
      } catch (A) {
        if (!n?.allowUnusableBoundary) throw A;
        return { tin: xt([]), remaining: 0, hasBoundary: !1, hull: [] };
      }
      o && (o.snapshot = s.snapshot());
    }
    const d = n ? o?.snapshot ?? s.snapshot() : void 0, _ = (A) => {
      const m = Zt.restore(d);
      return m.constrainAll(A), m;
    };
    for (const A of n?.hull ?? [])
      try {
        s.constrainOne(A[0], A[1]), f.push(A);
      } catch {
        s = _(f);
      }
    n?.boundary && (h = qi(s, n.boundary), h || (s = _(f))), n && ({ remaining: c } = s.forbidGroupTriangles(
      n.groupsOf,
      n.planes
    ), c -= h?.size ?? 0), l = s.del;
  }
  const u = [];
  for (let d = 0; d < l.triangles.length; d += 3)
    h?.has(d / 3) || u.push([l.triangles[d], l.triangles[d + 1], l.triangles[d + 2]]);
  const g = ["a", "b", "c"];
  return { tin: xt(
    u.map((d) => {
      const _ = {}, A = d.map((m, y) => {
        const p = r.features[m], x = p.geometry.coordinates, M = [x[0], x[1]];
        return x.length === 3 ? M[2] = x[2] : _[g[y]] = p.properties[e], M;
      });
      return A[3] = A[0], ie([A], _);
    })
  ), remaining: c, hasBoundary: h !== void 0, hull: f };
}
function qi(r, t) {
  try {
    r.constrainAll(t);
  } catch {
    return;
  }
  const e = new Map(t), { triangles: n, halfedges: o } = r.del, i = (c) => {
    const h = n[c], f = n[At(c)];
    return e.get(h) === f || e.get(f) === h;
  }, s = /* @__PURE__ */ new Set(), a = [], l = (c) => {
    const h = Math.floor(c / 3);
    s.has(h) || (s.add(h), a.push(h));
  };
  for (let c = 0; c < o.length; c++)
    o[c] === -1 && !i(c) && l(c);
  for (let c = 0; c < a.length; c++)
    for (let h = a[c] * 3; h < a[c] * 3 + 3; h++) {
      if (!e.has(n[h])) return;
      o[h] !== -1 && !i(h) && l(o[h]);
    }
  return s;
}
function un(r) {
  const t = /* @__PURE__ */ new Set(), e = [];
  if (r.forEach(([l, c], h) => {
    const f = `${l}:${c}`;
    t.has(f) || (t.add(f), e.push({ i: h, x: l, y: c }));
  }), e.length < 3) return [];
  const n = (l, c, h) => dt(l.x, l.y, c.x, c.y, h.x, h.y), o = [...e].sort((l, c) => l.x - c.x || l.y - c.y), i = (l) => {
    const c = [];
    for (const h of l) {
      for (; c.length >= 2 && n(c[c.length - 2], c[c.length - 1], h) <= 0; ) c.pop();
      c.push(h);
    }
    return c.pop(), c;
  }, s = [...i(o), ...i([...o].reverse())];
  if (s.length < 3) return [];
  const a = [];
  for (let l = 0; l < s.length; l++) {
    const c = s[l], h = s[(l + 1) % s.length], f = h.x - c.x, u = h.y - c.y, g = f * f + u * u, b = e.filter((_) => _ !== c && _ !== h && n(c, h, _) === 0).map((_) => ({ r: _, t: ((_.x - c.x) * f + (_.y - c.y) * u) / g })).filter(({ t: _ }) => _ > 0 && _ < 1).sort((_, A) => _.t - A.t).map(({ r: _ }) => _), d = [c, ...b, h];
    for (let _ = 0; _ + 1 < d.length; _++) a.push([d[_].i, d[_ + 1].i]);
  }
  return a;
}
function ye([r, t]) {
  return r < t ? `${r}-${t}` : `${t}-${r}`;
}
function Kt(r, t, e) {
  return Rt(r, { target: { geom: t, index: e } });
}
function Wt(r) {
  return Rt(r.properties.target.geom, {
    target: {
      geom: r.geometry.coordinates,
      index: r.properties.target.index
    }
  });
}
function dn(r, t) {
  const e = r.length, n = t.geometry.coordinates;
  return Array.from({ length: e }, (o, i) => i).map((o) => {
    const i = (o + 1) % e, s = r[o], a = r[i], l = s.geometry.coordinates, c = Math.atan2(
      l[0] - n[0],
      l[1] - n[1]
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
    }, u = xt([
      ie([h], f)
    ]);
    return [c, u];
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
    const [a, l, c] = n.geometry.coordinates[0];
    pn(a, l, c) * pn(o.geom, i.geom, s.geom) * t <= 0 && e++;
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
    const l = (e * (n[(s + 1) % n.length] - n[s]) + o) % o;
    if (!(l > 0 && l < Math.PI)) return !1;
    i += l;
  }
  return Math.abs(i - o) < 1e-6;
}
function gn(r, t, e, n, o, i = /* @__PURE__ */ new Set(), s) {
  const { minx: a, maxx: l, miny: c, maxy: h, centroid: f } = r, u = l - a, g = h - c, b = e.forw.length, d = Array.from({ length: b }, () => []);
  let _ = 1;
  for (const [S, B] of e.edges)
    S < n && d[S].push(_), d[B].push(_), B < n && _++;
  const A = (S) => S.slice(0, b).map(({ geometry: B }) => B.coordinates), m = un(A(e.forw)), y = {
    forw: m.filter((S) => !i.has(ye(S))),
    bakw: un(A(e.bakw))
  }, p = [0], x = (S) => S >= b ? p : d[S];
  let M;
  for (const S of Vi) {
    const B = s?.get(S) ?? { forwReuse: {} };
    s?.set(S, B);
    const I = B.vertices ?? (B.vertices = t(
      {
        ...r,
        minx: a - S * u,
        maxx: l + S * u,
        miny: c - S * g,
        maxy: h + S * g
      },
      !0
    ));
    if (o && (I.length < 4 || !I.every(({ bakw: R }) => R.every(Number.isFinite)))) continue;
    const O = I.map(
      ({ forw: R, bakw: j }, V) => Kt(R, j, `b${V}`)
    ), D = xt([...e.forw, ...O]), N = xt([
      ...e.bakw,
      ...O.map(Wt)
    ]), X = [D, N].map(
      ({ features: R }) => Float64Array.from(
        R.flatMap(
          ({
            geometry: {
              coordinates: [j, V]
            }
          }) => [j, V]
        )
      )
    ), E = o !== void 0 || mn(
      I.map((R) => R.forw),
      f.forw,
      -1
    ) && mn(
      I.map((R) => R.bakw),
      f.bakw,
      1
    ) ? I.map((R, j) => [
      b + j,
      b + (j + 1) % I.length
    ]) : void 0, k = { groupsOf: x, planes: X, boundary: E, allowUnusableBoundary: o !== void 0 }, F = o?.orientation ?? -1, C = Ce(
      D,
      e.edges,
      "target",
      { ...k, hull: y.forw },
      B.forwReuse
    ), $ = B.geographic ?? (B.geographic = (() => {
      const R = Ce(N, e.edges, "target", {
        ...k,
        hull: y.bakw
      });
      return { built: R, flips: ve(R.tin, F) };
    })()), w = $.built, T = C.tin, P = {
      ...w.tin,
      features: [...w.tin.features]
    }, Y = ve(T, F) + $.flips, q = {
      vertices: I,
      forw: T,
      bakw: P,
      diagnostics: {
        margin: S,
        boundaryTriangleFlips: Y,
        remainingForbiddenTriangles: C.remaining + w.remaining
      },
      hasMapBoundary: C.hasBoundary,
      hasBoundary: C.hasBoundary && w.hasBoundary,
      forwHull: { all: m, applied: C.hull }
    };
    if (o) {
      if (o.accept(q)) return q;
      continue;
    }
    if (Y === 0 && q.hasBoundary)
      return q;
    ji(q, M) && (M = q);
  }
  return M;
}
const wn = 1e-9;
function Ui(r, t) {
  const e = [[], [], [], []], n = [];
  return Object.keys(r).forEach((o) => {
    const i = r[o], s = i.forw, a = i.bakw, l = [
      s[0] - t.forw[0],
      s[1] - t.forw[1]
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
function zi(r) {
  let t = 1 / 0, e = 0, n = 0;
  return r.forEach((o) => {
    const { forw: i, bakw: s } = o, a = Math.hypot(i[0], i[1]), l = Math.hypot(s[0], s[1]);
    if (l === 0) return;
    const c = a / l, h = Math.atan2(i[0], i[1]) - Math.atan2(s[0], s[1]);
    t = Math.min(t, c), e += Math.cos(h), n += Math.sin(h);
  }), isFinite(t) ? [t, Math.atan2(n, e)] : [1, 0];
}
function Gi(r, t, e) {
  const { perQuad: n, aggregate: o } = Ui(r, t), i = n.every((l) => l.length > 0), a = (e === "birdeye" ? i ? n : [o] : [o]).map((l) => zi(l));
  return a.length === 1 ? [a[0], a[0], a[0], a[0]] : a;
}
function Hi(r, t) {
  let e = 0;
  return r[0] > t[0] && (e += 1), r[1] > t[1] && (e += 2), e;
}
function Ki(r, t, e) {
  const n = [
    r[0] - t.forw[0],
    r[1] - t.forw[1]
  ], i = Math.sqrt(n[0] ** 2 + n[1] ** 2) / e[0], s = Math.atan2(n[0], n[1]) - e[1];
  return [
    t.bakw[0] + i * Math.sin(s),
    t.bakw[1] - i * Math.cos(s)
  ];
}
function Wi(r, t, e, n) {
  const o = t[0] - r[0], i = t[1] - r[1];
  if (Math.abs(o) < 1e-12 && Math.abs(i) < 1e-12) return null;
  const s = n[0] - e[0], a = n[1] - e[1], l = e[0] - r[0], c = e[1] - r[1], h = o * a - i * s;
  if (Math.abs(h) < 1e-12) return null;
  const f = (l * a - c * s) / h, u = (l * i - c * o) / h;
  return f <= 1e-10 || u < -1e-10 || u > 1 + 1e-10 ? null : { t: f, point: [r[0] + f * o, r[1] + f * i] };
}
function Ji(r, t, e) {
  const n = e.length;
  let o = -1 / 0, i = null;
  for (let s = 0; s < n; s++) {
    const a = (s + 1) % n, l = Wi(
      r,
      t,
      e[s].bakw,
      e[a].bakw
    );
    l && l.t > o && (o = l.t, i = l.point);
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
  const l = [];
  if (s !== 0)
    for (const h of [e, n]) {
      const f = (h - r[0]) / s;
      if (f > 0) {
        const u = r[1] + f * a;
        u >= o && u <= i && l.push({ t: f, x: h, y: u });
      }
    }
  if (a !== 0)
    for (const h of [o, i]) {
      const f = (h - r[1]) / a;
      if (f > 0) {
        const u = r[0] + f * s;
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
  for (const i of t)
    for (let s = 0; s < n; s++) {
      const a = (s + 1) % n, l = Ve([r[s].bakw, r[a].bakw]), c = Ve([e.bakw, i.bakw]), h = vi(l, c);
      if (h.features.length > 0 && h.features[0].geometry) {
        const f = h.features[0], u = Math.sqrt(
          Math.pow(i.bakw[0] - e.bakw[0], 2) + Math.pow(i.bakw[1] - e.bakw[1], 2)
        ), g = Math.sqrt(
          Math.pow(f.geometry.coordinates[0] - e.bakw[0], 2) + Math.pow(f.geometry.coordinates[1] - e.bakw[1], 2)
        ), b = u / g;
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
function Ye(r, t, e, n) {
  const { convexBuf: o, centroid: i, allGcps: s, minx: a, maxx: l, miny: c, maxy: h } = r, f = n ? void 0 : Gi(o, i, t), g = [
    [a, c],
    [l, c],
    [l, h],
    [a, h]
  ].map((S) => ({
    forw: S,
    bakw: n ? n(S) : Ki(
      S,
      i,
      f[Hi(S, i.forw)]
    )
  }));
  if (g.sort(
    (S, B) => Math.atan2(S.forw[0] - i.forw[0], S.forw[1] - i.forw[1]) - Math.atan2(B.forw[0] - i.forw[0], B.forw[1] - i.forw[1])
  ), n || bn(g, s, i), !e) return g;
  const b = 4, d = g.map(
    (S) => Math.atan2(S.forw[0] - i.forw[0], S.forw[1] - i.forw[1])
  ), _ = g.map(
    (S) => Math.atan2(
      S.bakw[0] - i.bakw[0],
      -(S.bakw[1] - i.bakw[1])
    )
  );
  function A(S) {
    for (let B = 0; B < b; B++) {
      const I = (B + 1) % b, O = d[B], D = B < b - 1 ? d[I] : d[I] + 2 * Math.PI;
      let N = S;
      for (; N < O; ) N += 2 * Math.PI;
      for (; N >= O + 2 * Math.PI; ) N -= 2 * Math.PI;
      if (N >= O && N < D)
        return { i: B, j: I, frac: (N - O) / (D - O) };
    }
    return { i: 0, j: 1, frac: 0 };
  }
  function m(S) {
    const { i: B, j: I, frac: O } = A(S), D = _[B];
    let X = _[I] - D;
    for (; X > Math.PI; ) X -= 2 * Math.PI;
    for (; X < -Math.PI; ) X += 2 * Math.PI;
    return D + O * X;
  }
  const y = new Set(
    g.map(
      (S) => Math.floor(yn(S.forw, i.forw) / 10) % 36
    )
  ), p = s.map((S) => ({
    forw: S.forw,
    bakw: S.bakw,
    angleDeg: yn(S.forw, i.forw),
    forwDist: Math.hypot(S.forw[0] - i.forw[0], S.forw[1] - i.forw[1])
  })), x = [];
  for (let S = 0; S < 36; S++) {
    if (y.has(S)) continue;
    const B = S * 10, I = p.filter(($) => {
      if ($.forwDist === 0) return !1;
      const w = (($.angleDeg - B) % 360 + 360) % 360;
      return w < 10 + wn || w > 360 - wn;
    });
    let O = null;
    if (I.length > 0) {
      const $ = I.reduce((w, T) => T.forwDist > w.forwDist ? T : w);
      O = vn(i.forw, $.forw, a, l, c, h);
    }
    if (!O) {
      const $ = (B + 5) % 360 * (Math.PI / 180), w = [
        i.forw[0] + Math.sin($),
        i.forw[1] + Math.cos($)
      ];
      O = vn(i.forw, w, a, l, c, h);
    }
    if (!O) continue;
    const [D, N] = O, X = 1e-9 * Math.max(l - a, h - c);
    if ([...g, ...x].some(
      ($) => Math.abs($.forw[0] - D) <= X && Math.abs($.forw[1] - N) <= X
    )) continue;
    if (n) {
      x.push({ forw: O, bakw: n(O) });
      continue;
    }
    const v = [O[0] - i.forw[0], O[1] - i.forw[1]], E = Math.atan2(v[0], v[1]), k = m(E), F = [
      i.bakw[0] + Math.sin(k),
      i.bakw[1] - Math.cos(k)
    ], C = Ji(i.bakw, F, g);
    C && x.push({ forw: O, bakw: C });
  }
  const M = [...g, ...x];
  return M.sort(
    (S, B) => Math.atan2(S.forw[0] - i.forw[0], S.forw[1] - i.forw[1]) - Math.atan2(B.forw[0] - i.forw[0], B.forw[1] - i.forw[1])
  ), n || bn(M, s, i), M;
}
function Qi(r, t = !1) {
  return Ye(r, "plain", t);
}
function Zi(r, t = !1) {
  return Ye(r, "birdeye", t);
}
function tr(r, t) {
  const e = /* @__PURE__ */ new Set();
  return Ye(r, "plain", !0, t).filter(({ forw: [n, o] }) => {
    const i = `${n}:${o}`;
    return e.has(i) ? !1 : (e.add(i), !0);
  });
}
function Yr(r) {
  return Cn(r, 1 / 0);
}
const xn = 1e5, er = 16;
function Cn(r, t) {
  return nr(r), new ir(r).findSegmentIntersections(t).map(
    (o) => Rt([o.x, o.y])
  );
}
function nr(r) {
  for (let t = 0, e = r.length; t < e; t++) {
    const n = r[t];
    ee(n) || Yt(
      "findIntersections() received invalid coordinates:",
      `line=${t}`,
      `points=${n}`
    );
    for (let o = 0, i = n.length; o < i; o++) {
      const s = n[o];
      (!ee(s) || !Number.isFinite(s[0]) || !Number.isFinite(s[1])) && Yt(
        "findIntersections() received non-finite coordinates:",
        `line=${t}`,
        `point=${o}`,
        `coordinates=${JSON.stringify(s)}`
      );
    }
  }
}
class ir {
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
    (i != this._xx.length || this._xx.length != this._yy.length) && Yt("ArcCollection#initXYData() Counting error"), this.initBounds(), this._arcIter = new Sr(this._xx, this._yy);
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
    let a = 0, l, c, h;
    for (let f = 0; f < o; f++)
      l = n[f], l > 0 && (c = f * 4, h = Mr(t, e, a, l), i[c++] = h[0], i[c++] = h[1], i[c++] = h[2], i[c] = h[3], a += l, s.mergeBounds(h));
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
    let l = n ? this._ii[o] : this._ii[o] + s - 1, c = l, h = 0;
    for (let f = 1; f < s; f++)
      c += a, (i === 0 || this._zz[c] >= i) && (e(l, c, this._xx, this._yy), l = c, h++);
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
    const e = this.getBounds(), n = e.ymin || 0, o = (e.ymax || 0) - n, i = this.calcSegmentIntersectionStripeCount(), s = new Uint32Array(i), a = i > 1 ? (y) => Math.floor((i - 1) * (y - n) / o) : () => 0, l = i + 1;
    let c;
    this.forEachSegment(
      (y, p, x, M) => {
        let S = a(M[y]);
        const B = a(M[p]);
        let I = 0;
        for (; s[S] = s[S] + 2, S != B; )
          I++, I > l && Yt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${i}`,
            `s1=${S}`,
            `s2=${B}`
          ), S += B > S ? 1 : -1;
      }
    );
    const h = this.getUint32Array(or(s));
    let f = 0;
    const u = [];
    ar(s, (y) => {
      const p = f;
      f += y, u.push(h.subarray(p, f));
    }), cr(s, 0), this.forEachSegment(
      (y, p, x, M) => {
        let S = a(M[y]);
        const B = a(M[p]);
        let I, O, D = 0;
        for (; I = s[S], s[S] = I + 2, O = u[S], O[I] = y, O[I + 1] = p, S != B; )
          D++, D > l && Yt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${i}`,
            `s1=${S}`,
            `s2=${B}`
          ), S += B > S ? 1 : -1;
      }
    );
    const g = this.getVertexData(), b = t * er;
    let d = 0;
    const _ = /* @__PURE__ */ new Set(), A = /* @__PURE__ */ new Map(), m = (y) => {
      d++;
      const p = _r(y);
      return _.has(p) || (_.add(p), A.set(`${y.x}:${y.y}`, y)), A.size >= t || d >= b;
    };
    if (g.xx && g.yy)
      for (c = 0; c < i && !lr(u[c], g.xx, g.yy, m); c++)
        ;
    return Array.from(A.values());
  }
}
function Yt(...r) {
  const t = r.join(" ");
  throw new Error(t);
}
function ee(r) {
  return r ? sr(r) ? !0 : rr(r) ? !1 : r.length === 0 ? !0 : r.length > 0 : !1;
}
function rr(r) {
  return r != null && r.toString === String.prototype.toString;
}
function sr(r) {
  return Array.isArray(r);
}
function or(r, t) {
  ee(r) || Yt("utils.sum() expects an array, received:", r);
  let e = 0, n;
  for (let o = 0, i = r.length; o < i; o++)
    n = r[o], n && (e += n);
  return e;
}
function ar(r, t, e) {
  if (!ee(r))
    throw new Error(`#forEach() takes an array-like argument. ${r}`);
  for (let n = 0, o = r.length; n < o; n++)
    t.call(e, r[n], n);
}
function cr(r, t) {
  for (let e = 0, n = r.length; e < n; e++)
    r[e] = t;
  return r;
}
function lr(r, t, e, n) {
  const o = r.length - 2;
  let i, s, a, l, c, h, f, u, g, b, d, _, A, m, y, p, x;
  for (vr(t, r), p = 0; p < o; ) {
    for (i = r[p], s = r[p + 1], c = t[i], h = t[s], g = e[i], b = e[s], x = p; x < o && (x += 2, a = r[x], f = t[a], !(h < f)); ) {
      if (d = e[a], l = r[x + 1], u = t[l], _ = e[l], g >= d) {
        if (g > _ && b > d && b > _) continue;
      } else if (g < _ && b < d && b < _) continue;
      if (!(i == a || i == l || s == a || s == l) && (A = fr(
        c,
        g,
        h,
        b,
        f,
        d,
        u,
        _
      ), A && (m = [i, s], y = [a, l], n(Sn(A, m, y, t, e)) || A.length == 4 && n(Sn(A.slice(2), m, y, t, e)))))
        return !0;
    }
    p += 2;
  }
  return !1;
}
function fr(r, t, e, n, o, i, s, a) {
  const l = hr(r, t, e, n, o, i, s, a);
  let c = null;
  return l && (c = ur(r, t, e, n, o, i, s, a), c ? yr(r, t, e, n, o, i, s, a) && (c = null) : c = wr(r, t, e, n, o, i, s, a)), c;
}
function hr(r, t, e, n, o, i, s, a) {
  return Jt(r, t, e, n, o, i) * Jt(r, t, e, n, s, a) <= 0 && Jt(o, i, s, a, r, t) * Jt(o, i, s, a, e, n) <= 0;
}
function Jt(r, t, e, n, o, i) {
  return Nn(r - o, t - i, e - o, n - i);
}
function Nn(r, t, e, n) {
  return r * n - t * e;
}
function ur(r, t, e, n, o, i, s, a) {
  let l = pe(r, t, e, n, o, i, s, a), c;
  return l && (c = pr(l[0], l[1], r, t, e, n, o, i, s, a), c == 1 ? l = pe(e, n, r, t, o, i, s, a) : c == 2 ? l = pe(o, i, s, a, r, t, e, n) : c == 3 && (l = pe(s, a, o, i, r, t, e, n))), l && gr(l, r, t, e, n, o, i, s, a), l;
}
function pe(r, t, e, n, o, i, s, a) {
  const l = Nn(e - r, n - t, s - o, a - i), c = 1e-18;
  let h;
  if (l === 0) return null;
  const f = Jt(o, i, s, a, r, t) / l;
  return l <= c && l >= -c ? h = dr(r, t, e, n, o, i, s, a) : h = [r + f * (e - r), t + f * (n - t)], h;
}
function dr(r, t, e, n, o, i, s, a) {
  let l = null;
  return !It(r, o, s) && !It(t, i, a) ? l = [r, t] : !It(e, o, s) && !It(n, i, a) ? l = [e, n] : !It(o, r, e) && !It(i, t, n) ? l = [o, i] : !It(s, r, e) && !It(a, t, n) && (l = [s, a]), l;
}
function It(r, t, e) {
  let n;
  return t < e ? n = r < t || r > e : t > e ? n = r > t || r < e : n = r != t, n;
}
function pr(r, t, ...e) {
  let n = -1, o = 1 / 0, i;
  for (let s = 0, a = 0, l = e.length; a < l; s++, a += 2)
    i = mr(r, t, e[a], e[a + 1]), i < o && (o = i, n = s);
  return n;
}
function mr(r, t, e, n) {
  const o = r - e, i = t - n;
  return o * o + i * i;
}
function gr(r, t, e, n, o, i, s, a, l) {
  let c = r[0], h = r[1];
  c = me(c, t, n), c = me(c, i, a), h = me(h, e, o), h = me(h, s, l), r[0] = c, r[1] = h;
}
function me(r, t, e) {
  let n;
  return It(r, t, e) && (n = Math.abs(r - t) < Math.abs(r - e) ? t : e, r = n), r;
}
function wr(r, t, e, n, o, i, s, a) {
  const l = Math.min(r, e, o, s), c = Math.max(r, e, o, s), h = Math.min(t, n, i, a), f = Math.max(t, n, i, a), u = f - h > c - l;
  let g = [];
  return (u ? Nt(t, h, f) : Nt(r, l, c)) && g.push(r, t), (u ? Nt(n, h, f) : Nt(e, l, c)) && g.push(e, n), (u ? Nt(i, h, f) : Nt(o, l, c)) && g.push(o, i), (u ? Nt(a, h, f) : Nt(s, l, c)) && g.push(s, a), (g.length != 2 && g.length != 4 || g.length == 4 && g[0] == g[2] && g[1] == g[3]) && (g = null), g;
}
function yr(r, t, e, n, o, i, s, a) {
  return r == o && t == i || r == s && t == a || e == o && n == i || e == s && n == a;
}
function Nt(r, t, e) {
  return r > t && r < e;
}
function vr(r, t) {
  br(r, t), $n(r, t, 0, t.length - 2);
}
function br(r, t) {
  for (let e = 0, n = t.length; e < n; e += 2)
    r[t[e]] > r[t[e + 1]] && xr(t, e, e + 1);
}
function xr(r, t, e) {
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
  const a = t[0] < e[0] ? t : e, l = a == t ? e : t;
  return { x: i, y: s, a, b: l };
}
function Mn(r, t, e, n, o, i) {
  let s = e < n ? e : n, a = s === e ? n : e;
  return o[s] == r && i[s] == t ? a = s : o[a] == r && i[a] == t && (s = a), [s, a];
}
function _r(r) {
  return `${r.a.join(",")};${r.b.join(",")}`;
}
class Sr {
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
function Mr(r, t, e, n) {
  let o = e | 0;
  const i = isNaN(n) ? r.length - o : n + o;
  let s, a, l, c, h, f;
  if (i > 0)
    l = h = r[o], c = f = t[o];
  else return [void 0, void 0, void 0, void 0];
  for (o++; o < i; o++)
    s = r[o], a = t[o], s < l && (l = s), s > h && (h = s), a < c && (c = a), a > f && (f = a);
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
    let i, s, a, l;
    if (arguments.length == 1)
      if (ee(t)) {
        const c = t;
        i = c[0], s = c[1], a = c[2], l = c[3];
      } else {
        const c = t;
        i = c.xmin, s = c.ymin, a = c.xmax, l = c.ymax;
      }
    else
      i = t, s = e, a = n, l = o;
    return this.xmin = i, this.ymin = s, this.xmax = a, this.ymax = l, (i > a || s > l) && this.update(), this;
  }
  update() {
    let t;
    this.xmin > this.xmax && (t = this.xmin, this.xmin = this.xmax, this.xmax = t), this.ymin > this.ymax && (t = this.ymin, this.ymin = this.ymax, this.ymax = t);
  }
  mergeBounds(t, ...e) {
    let n, o, i, s;
    return t instanceof ne ? (n = t.xmin, o = t.ymin, i = t.xmax, s = t.ymax) : e.length == 3 ? (n = t, o = e[0], i = e[1], s = e[2]) : t.length == 4 ? (n = t[0], o = t[1], i = t[2], s = t[3]) : Yt("Bounds#mergeBounds() invalid argument:", t), this.xmin === void 0 ? this.setBounds(n, o, i, s) : (n < this.xmin && (this.xmin = n), o < this.ymin && (this.ymin = o), i > this.xmax && (this.xmax = i), s > this.ymax && (this.ymax = s)), this;
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
    const a = s.filter((l) => l !== t);
    a.length === 0 ? delete r[i] : r[i] = a;
  }), e) {
    const i = (s, a) => {
      !s || !a || (s.features = s.features.filter((l) => l !== a));
    };
    i(e.forw, t.forw), i(e.bakw, t.bakw);
  }
}
function ge(r, t = 1e-6) {
  const [e, n] = r[0], [o, i] = r[1], [s, a] = r[2];
  return Math.abs((o - e) * (a - n) - (s - e) * (i - n)) < t;
}
function kr(r, t) {
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
const Er = 10;
function Ar(r, t, e, n, o, i) {
  if (!r && !t) return !1;
  const s = r ? 0 : 1, a = 1 - s, l = e[s], c = e[a];
  if (!l || !c) return !1;
  const h = bt(c.geom);
  let f = !1, u = !1;
  for (let g = 0; g <= 1; g++) {
    const b = n[g];
    if (!b) continue;
    const d = [String(b.prop.index), String(l.prop.index)].sort().join("-"), _ = o[d];
    if (!_ || _.length < 2) continue;
    const A = _.find(
      (D) => D.bakw !== i[s].bakw
    );
    if (!A) continue;
    const y = Qt(A.bakw).find(
      (D) => String(D.prop.index) !== String(b.prop.index) && String(D.prop.index) !== String(l.prop.index)
    );
    if (!y) continue;
    f = !0;
    const p = bt(y.geom), x = bt(b.geom), M = bt(l.geom), S = M[0] - x[0], B = M[1] - x[1], I = S * (h[1] - x[1]) - B * (h[0] - x[0]), O = S * (p[1] - x[1]) - B * (p[0] - x[0]);
    if (I * O > 0) {
      u = !0;
      break;
    }
  }
  return f && !u;
}
function Ir(r, t, e, n) {
  if (!r && !t) return !1;
  if (e[0] && e[1] && n[0] && n[1]) {
    const o = n.map((h) => bt(h.geom)), i = e.map((h) => bt(h.geom)), s = o[1][0] - o[0][0], a = o[1][1] - o[0][1], l = s * (i[0][1] - o[0][1]) - a * (i[0][0] - o[0][0]), c = s * (i[1][1] - o[0][1]) - a * (i[1][0] - o[0][0]);
    return l * c < 0;
  }
  return !1;
}
function Br(r, t, e, n) {
  const o = kr(e, n), i = /* @__PURE__ */ new Set();
  let s = !1;
  for (let a = 0; a < Er; a++) {
    let l = !1;
    for (const c of Object.keys(t)) {
      if (i.has(c)) continue;
      i.add(c);
      const h = t[c];
      if (!h || h.length < 2) continue;
      const f = c.split("-");
      if (f.length !== 2 || o.has(c)) continue;
      const u = Qt(h[0].bakw), g = Qt(h[1].bakw), b = Qt(h[0].forw), d = Qt(h[1].forw), _ = f.map(
        (w) => u.find((T) => `${T.prop.index}` === w) || g.find((T) => `${T.prop.index}` === w)
      ), A = f.map(
        (w) => b.find((T) => `${T.prop.index}` === w) || d.find((T) => `${T.prop.index}` === w)
      );
      if (_.some((w) => !w) || A.some((w) => !w))
        continue;
      const m = [u, g].map(
        (w) => w.find((T) => !f.includes(`${T.prop.index}`))
      ), y = [b, d].map(
        (w) => w.find((T) => !f.includes(`${T.prop.index}`))
      );
      if (m.some((w) => !w) || y.some((w) => !w))
        continue;
      const p = h[0].bakw.geometry.coordinates[0].slice(0, 3).map((w) => bt(w)), x = h[1].bakw.geometry.coordinates[0].slice(0, 3).map((w) => bt(w)), M = h[0].forw.geometry.coordinates[0].slice(0, 3).map((w) => bt(w)), S = h[1].forw.geometry.coordinates[0].slice(0, 3).map((w) => bt(w)), B = ge(p), I = ge(x), O = ge(M), D = ge(S), N = Ar(
        B,
        I,
        m,
        _,
        t,
        h
      ), X = Ir(
        O,
        D,
        m,
        _
      );
      if (!(N || X || En(
        bt(m[0].geom),
        x
      ) || En(
        bt(m[1].geom),
        p
      )))
        continue;
      const E = A.map(
        (w) => bt(w.geom)
      ), k = y.map(
        (w) => bt(w.geom)
      ), F = Or([
        ...E,
        ...k
      ]), C = Tr(F), $ = An(
        E[0],
        E[1],
        k[0]
      ) + An(
        E[0],
        E[1],
        k[1]
      );
      Ne(C, $) && (kn(t, h[0], r), kn(t, h[1], r), _.forEach((w) => {
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
        }, Y = ie([T], P), q = On(Y);
        Pn(t, {
          forw: q,
          bakw: Y
        }, r);
      }), l = !0, s = !0);
    }
    if (!l) break;
  }
  return s;
}
function bt(r) {
  return [r[0], r[1]];
}
function En(r, t) {
  const [e, n] = t[0], [o, i] = t[1], [s, a] = t[2], l = s - e, c = a - n, h = o - e, f = i - n, u = r[0] - e, g = r[1] - n, b = l * l + c * c, d = l * h + c * f, _ = l * u + c * g, A = h * h + f * f, m = h * u + f * g, y = b * A - d * d;
  if (y === 0) return !1;
  const p = 1 / y, x = (A * _ - d * m) * p, M = (b * m - d * _) * p, S = 1e-9;
  return x >= -S && M >= -S && x + M <= 1 + S;
}
function Or(r) {
  const t = r.map((s) => s.slice()).filter(
    (s, a, l) => l.findIndex(
      (c) => Ne(c[0], s[0]) && Ne(c[1], s[1])
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
function Tr(r) {
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
const Fr = (r) => typeof r == "string" && r.startsWith("b");
function Dr(r, t) {
  const e = (n, o) => {
    for (let i = 0; i < 3; i++) {
      const s = n.g[i], a = n.g[(i + 1) % 3];
      if (o.g.every((l) => n.sign * dt(s[0], s[1], a[0], a[1], l[0], l[1]) <= 0)) return !0;
    }
    return !1;
  };
  return !e(r, t) && !e(t, r);
}
function Cr(r, t, e) {
  if (t.length === 0) return [];
  const n = r.features.map((d) => {
    const { a: _, b: A, c: m } = d.properties, y = [_.geom, A.geom, m.geom], [p, x, M] = d.geometry.coordinates[0], S = y.map(([D]) => D), B = y.map(([, D]) => D), I = Math.sign(dt(p[0], p[1], x[0], x[1], M[0], M[1])), O = Math.sign(dt(y[0][0], y[0][1], y[1][0], y[1][1], y[2][0], y[2][1]));
    return {
      ids: [_.index, A.index, m.index].map(String),
      g: y,
      sign: O,
      ratio: I * O,
      aux: [_.index, A.index, m.index].some(Fr),
      minx: Math.min(...S),
      maxx: Math.max(...S),
      miny: Math.min(...B),
      maxy: Math.max(...B)
    };
  }), o = n.map((d) => d.ratio), i = o.reduce((d, _) => d + _, 0) < 0 ? -1 : 1, s = (d, _) => d < _ ? `${d}|${_}` : `${_}|${d}`, a = /* @__PURE__ */ new Map();
  n.forEach((d, _) => {
    for (let A = 0; A < 3; A++) {
      const m = s(d.ids[A], d.ids[(A + 1) % 3]), y = a.get(m);
      y ? y.push(_) : a.set(m, [_]);
    }
  });
  const l = ([d, _]) => s(String(e[d]), String(e[_])), c = /* @__PURE__ */ new Set();
  for (const d of t) for (const _ of a.get(l(d)) ?? []) c.add(_);
  const h = (d) => n[d].aux || c.has(d), f = /* @__PURE__ */ new Set();
  n.forEach((d, _) => {
    h(_) && (o[_] === 0 || o[_] !== i) && f.add(_);
  });
  const u = n.map((d, _) => _).sort((d, _) => n[d].minx - n[_].minx);
  for (let d = 0; d < u.length; d++) {
    const _ = n[u[d]];
    if (_.sign !== 0)
      for (let A = d + 1; A < u.length; A++) {
        const m = n[u[A]];
        if (m.minx >= _.maxx) break;
        m.sign === 0 || m.miny >= _.maxy || _.miny >= m.maxy || !h(u[d]) && !h(u[A]) || Dr(_, m) && (f.add(u[d]), f.add(u[A]));
      }
  }
  if (f.size === 0) return [];
  const g = t.filter((d) => (a.get(l(d)) ?? []).some((_) => f.has(_)));
  if (g.length > 0) return g;
  const b = /* @__PURE__ */ new Set();
  for (const d of f) for (const _ of n[d].ids) _.startsWith("b") || b.add(_);
  return t.filter(
    ([d, _]) => b.has(String(e[d])) || b.has(String(e[_]))
  );
}
const In = 2.00704, Bn = 3.00001, Nr = 12, $r = 24;
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
      const l = t[a];
      l[0] < e && (e = l[0]), l[0] > n && (n = l[0]), l[1] < o && (o = l[1]), l[1] > i && (i = l[1]), s.push(l);
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
      const l = this.tins.bakw.features[a];
      Pn(n, { forw: s, bakw: l });
    });
    const o = (this.pointsSet?.forw.features ?? []).map(
      (s) => s.properties.target.index
    );
    Br(
      this.tins,
      n,
      this.pointsSet?.edges || [],
      o
    );
    const i = ["forw", "bakw"].map((s) => {
      const a = this.tins[s].features.map(
        (l) => l.geometry.coordinates[0]
      );
      return Cn(a, t);
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
      if (Pr(i, this.points.length, o), s.length === 0 && a.length === 0) {
        e.push(i);
        continue;
      }
      s.unshift(this.points[i[0]][0]), s.push(this.points[i[1]][0]), a.unshift(this.points[i[0]][1]), a.push(this.points[i[1]][1]);
      const l = [s, a].map((c) => {
        const h = c.map((u, g, b) => {
          if (g === 0) return 0;
          const d = b[g - 1];
          return Math.sqrt(
            Math.pow(u[0] - d[0], 2) + Math.pow(u[1] - d[1], 2)
          );
        }), f = h.reduce((u, g, b) => b === 0 ? [0] : (u.push(u[b - 1] + g), u), []);
        return f.map((u, g, b) => {
          const d = u / b[b.length - 1];
          return [c[g], h[g], f[g], d];
        });
      });
      l.map((c, h) => {
        const f = l[h ? 0 : 1];
        return c.filter((u, g) => !(g === 0 || g === c.length - 1 || u[4] === "handled")).flatMap((u) => {
          const g = u[0], b = u[3], d = f.reduce(
            (_, A, m, y) => {
              if (_) return _;
              const p = y[m + 1];
              if (A[3] === b)
                return A[4] = "handled", [A];
              if (A[3] < b && p && p[3] > b)
                return [A, p];
            },
            void 0
          );
          if (d && d.length === 1)
            return h === 0 ? [[g, d[0][0], b]] : [[d[0][0], g, b]];
          if (d && d.length === 2) {
            const _ = d[0], A = d[1], m = (b - _[3]) / (A[3] - _[3]), y = [
              (A[0][0] - _[0][0]) * m + _[0][0],
              (A[0][1] - _[0][1]) * m + _[0][1]
            ];
            return h === 0 ? [[g, y, b]] : [[y, g, b]];
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
        n++, t.forw.push(u), t.bakw.push(Wt(u)), h === 0 ? e.push([i[0], t.forw.length - 1]) : e.push([
          t.forw.length - 2,
          t.forw.length - 1
        ]), h === f.length - 1 && e.push([t.forw.length - 1, i[1]]);
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
    if (!this.points.reduce((l, c) => l && (i ? He(c[0], i) : c[0][0] >= t && c[0][0] <= e && c[0][1] >= n && c[0][1] <= o), !0))
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
    let o, i, s, a, l;
    if (e) {
      if (this.bounds) {
        const O = this.boundsPolygon;
        if (!O) throw new Error("Internal error: bounds is set but boundsPolygon is missing");
        if (!this.points.every(
          (N) => He(N[0], O)
        )) throw "SOME POINTS OUTSIDE";
      }
      o = this.generatePointsSet(), { minx: i, maxx: s, miny: a, maxy: l } = this.computeGcpBbox();
    } else {
      const O = this.validateAndPrepareInputs();
      o = O.pointsSet, i = O.minx, s = O.maxx, a = O.miny, l = O.maxy;
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
    const u = _i(c.forw), g = cn(c.forw);
    if (!g) throw "TOO LINEAR2";
    const b = {}, d = g.geometry.coordinates[0];
    let _;
    try {
      _ = d.map((O) => ({
        forw: O,
        bakw: _e(Rt(O), h)
      })), _.forEach((O) => {
        b[`${O.forw[0]}:${O.forw[1]}`] = O;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const A = cn(c.bakw);
    if (!A) throw "TOO LINEAR2";
    const m = A.geometry.coordinates[0];
    try {
      _ = m.map((O) => ({
        bakw: O,
        forw: _e(Rt(O), f)
      })), _.forEach((O) => {
        b[`${O.forw[0]}:${O.forw[1]}`] = O;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const y = {
      forw: u.geometry.coordinates,
      bakw: _e(u, h)
    }, p = Kt(y.forw, y.bakw, "c");
    this.centroid = {
      forw: p,
      bakw: Wt(p)
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
      maxy: l
    };
    if (n) {
      this.stateTriangle = void 0;
      const O = this.yaxisMode === ot.YAXIS_FOLLOW, D = O ? 1 : -1, N = /* @__PURE__ */ new Map(), { boundary: X } = this.buildWithHull(t, (v) => ({ boundary: gn(
        M,
        (E) => tr(E, (k) => {
          const [F, C] = Un(n, k);
          return [F, O ? -C : C];
        }),
        o,
        this.points.length,
        {
          orientation: D,
          accept: (E) => E.hasMapBoundary ? (this.buildTin(o, E.vertices, t, E, v.size > 0), (this.strict_status !== ot.STATUS_LOOSE || E.hasBoundary) && ve(this.tins.forw, D) === 0 && ve(this.tins.bakw, D) === 0) : !1
        },
        v,
        N
      ) }));
      if (X) {
        this.compiledOuter = {
          outerTransform: "worldFile",
          worldFile: n,
          vertices_points: X.vertices.map(({ forw: C, bakw: $ }) => [C, $])
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
    const S = this.vertexMode === ot.VERTEX_BIRDEYE ? Zi : Qi;
    let B, I;
    if (e) {
      const O = /* @__PURE__ */ new Map();
      ({ boundary: B, verticesList: I } = this.buildWithHull(t, (D) => {
        const N = gn(
          M,
          S,
          o,
          this.points.length,
          void 0,
          D,
          O
        );
        return {
          boundary: N,
          verticesList: this.buildTin(
            o,
            N?.vertices ?? S(M, !1),
            t,
            N,
            D.size > 0
          )
        };
      }));
    } else
      I = this.buildTin(
        o,
        S(M, !1),
        t,
        void 0
      );
    this.vertices_params = {
      forw: dn(I.forw, this.centroid.forw),
      bakw: dn(I.bakw, this.centroid.bakw)
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
    const i = (d) => [...d].sort().join(","), s = (d, _ = !1) => {
      const A = i(d), m = n.get(A);
      if (m) return m;
      const y = e(d), p = {
        value: y,
        strict: y.boundary !== void 0 && this.strict_status === ot.STATUS_STRICT
      };
      return (p.strict || _) && (p.state = this.captureBuild()), n.set(A, p), o = p, p;
    }, a = (d) => (o !== d && this.restoreBuild(d.state), o = d, d.value), l = s(/* @__PURE__ */ new Set(), !0);
    if (!(t === ot.MODE_STRICT || t === ot.MODE_AUTO) || !l.value.boundary || l.strict) return l.value;
    const h = new Set(l.value.boundary.forwHull.all.map(ye)), f = () => this.pointsSet.forw.features.map(
      (d) => d.properties.target.index
    ), u = /* @__PURE__ */ new Set();
    let g = l, b;
    for (let d = 0; d < Nr; d++) {
      const _ = Cr(
        this.tins.forw,
        g.value.boundary.forwHull.applied,
        f()
      ).filter((A) => !u.has(ye(A)));
      if (_.length === 0) break;
      for (const A of _) u.add(ye(A));
      if (g = s(u), !g.value.boundary) break;
      if (g.strict) {
        b = g;
        break;
      }
    }
    if (b) {
      let d = b;
      for (const _ of [...u].slice(0, $r)) {
        const A = new Set(u);
        A.delete(_);
        const m = s(A);
        m.strict && (u.delete(_), d = m);
      }
      return a(d);
    }
    if (u.size < h.size) {
      const d = s(h);
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
  buildTin(t, e, n, o, i = !1) {
    const s = {
      forw: [],
      bakw: []
    };
    for (let a = 0; a < e.length; a++) {
      const l = e[a].forw, c = e[a].bakw, h = Kt(l, c, `b${a}`), f = Wt(h);
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
function Pr(r, t, e) {
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
  Yr as findIntersections,
  In as format_version,
  Pn as insertSearchIndex,
  dn as vertexCalc
};
