import { counterTri as Bn, Transform as Ln, validateWorldFile as Vn, normalizeEdges as qn, transformArr as xe, rotateVerticesTriangle as Le, worldFileToCrs as jn } from "@maplat/transform";
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
  if (!qe(i[0]) || !qe(i[1]))
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
function bt(i, t = {}) {
  const e = { type: "FeatureCollection" };
  return t.id && (e.id = t.id), t.bbox && (e.bbox = t.bbox), e.features = i, e;
}
function qe(i) {
  return !isNaN(i) && i !== null && !Array.isArray(i);
}
function Un(i) {
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
function zn(i) {
  return i.type === "Feature" ? i.geometry : i;
}
function Pe(i, t, e) {
  if (i !== null)
    for (var n, s, r, o, a, l, c, h = 0, f = 0, u, p = i.type, v = p === "FeatureCollection", x = p === "Feature", A = v ? i.features.length : 1, B = 0; B < A; B++) {
      c = v ? (
        // @ts-expect-error: Known type conflict
        i.features[B].geometry
      ) : x ? (
        // @ts-expect-error: Known type conflict
        i.geometry
      ) : i, u = c ? c.type === "GeometryCollection" : !1, a = u ? c.geometries.length : 1;
      for (var g = 0; g < a; g++) {
        var b = 0, d = 0;
        if (o = u ? c.geometries[g] : c, o !== null) {
          l = o.coordinates;
          var y = o.type;
          switch (h = e && (y === "Polygon" || y === "MultiPolygon") ? 1 : 0, y) {
            case null:
              break;
            case "Point":
              if (
                // @ts-expect-error: Known type conflict
                t(
                  l,
                  f,
                  B,
                  b,
                  d
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
                    B,
                    b,
                    d
                  ) === !1
                )
                  return !1;
                f++, y === "MultiPoint" && b++;
              }
              y === "LineString" && b++;
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
                      B,
                      b,
                      d
                    ) === !1
                  )
                    return !1;
                  f++;
                }
                y === "MultiLineString" && b++, y === "Polygon" && d++;
              }
              y === "Polygon" && b++;
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
                        B,
                        b,
                        d
                      ) === !1
                    )
                      return !1;
                    f++;
                  }
                  d++;
                }
                b++;
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
const dt = 11102230246251565e-32, U = 134217729, On = (3 + 8 * dt) * dt;
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
function Mt(i, t, e, n, s, r, o, a) {
  return ht(ht(i, t, e, n, o), o, s, r, a);
}
function R(i, t, e, n) {
  let s, r, o, a, l, c, h, f, u, p, v;
  h = U * e, p = h - (h - e), v = e - p;
  let x = t[0];
  s = x * e, h = U * x, f = h - (h - x), u = x - f, o = u * v - (s - f * p - u * p - f * v);
  let A = 0;
  o !== 0 && (n[A++] = o);
  for (let B = 1; B < i; B++)
    x = t[B], a = x * e, h = U * x, f = h - (h - x), u = x - f, l = u * v - (a - f * p - u * p - f * v), r = s + l, c = r - s, o = s - (r - c) + (l - c), o !== 0 && (n[A++] = o), s = a + r, o = r - (s - a), o !== 0 && (n[A++] = o);
  return (s !== 0 || A === 0) && (n[A++] = s), A;
}
function Fn(i, t) {
  let e = t[0];
  for (let n = 1; n < i; n++) e += t[n];
  return e;
}
function tt(i) {
  return new Float64Array(i);
}
const Gn = (3 + 16 * dt) * dt, Kn = (2 + 12 * dt) * dt, Jn = (9 + 64 * dt) * dt * dt, Lt = tt(4), je = tt(8), Ue = tt(12), ze = tt(16), pt = tt(4);
function Qn(i, t, e, n, s, r, o) {
  let a, l, c, h, f, u, p, v, x, A, B, g, b, d, y, _, S, I;
  const E = i - s, T = e - s, O = t - r, N = n - r;
  d = E * N, u = U * E, p = u - (u - E), v = E - p, u = U * N, x = u - (u - N), A = N - x, y = v * A - (d - p * x - v * x - p * A), _ = O * T, u = U * O, p = u - (u - O), v = O - p, u = U * T, x = u - (u - T), A = T - x, S = v * A - (_ - p * x - v * x - p * A), B = y - S, f = y - B, Lt[0] = y - (B + f) + (f - S), g = d + B, f = g - d, b = d - (g - f) + (B - f), B = b - _, f = b - B, Lt[1] = b - (B + f) + (f - _), I = g + B, f = I - g, Lt[2] = g - (I - f) + (B - f), Lt[3] = I;
  let $ = Fn(4, Lt), m = Kn * o;
  if ($ >= m || -$ >= m || (f = i - E, a = i - (E + f) + (f - s), f = e - T, c = e - (T + f) + (f - s), f = t - O, l = t - (O + f) + (f - r), f = n - N, h = n - (N + f) + (f - r), a === 0 && l === 0 && c === 0 && h === 0) || (m = Jn * o + On * Math.abs($), $ += E * h + N * a - (O * c + T * l), $ >= m || -$ >= m)) return $;
  d = a * N, u = U * a, p = u - (u - a), v = a - p, u = U * N, x = u - (u - N), A = N - x, y = v * A - (d - p * x - v * x - p * A), _ = l * T, u = U * l, p = u - (u - l), v = l - p, u = U * T, x = u - (u - T), A = T - x, S = v * A - (_ - p * x - v * x - p * A), B = y - S, f = y - B, pt[0] = y - (B + f) + (f - S), g = d + B, f = g - d, b = d - (g - f) + (B - f), B = b - _, f = b - B, pt[1] = b - (B + f) + (f - _), I = g + B, f = I - g, pt[2] = g - (I - f) + (B - f), pt[3] = I;
  const k = ht(4, Lt, 4, pt, je);
  d = E * h, u = U * E, p = u - (u - E), v = E - p, u = U * h, x = u - (u - h), A = h - x, y = v * A - (d - p * x - v * x - p * A), _ = O * c, u = U * O, p = u - (u - O), v = O - p, u = U * c, x = u - (u - c), A = c - x, S = v * A - (_ - p * x - v * x - p * A), B = y - S, f = y - B, pt[0] = y - (B + f) + (f - S), g = d + B, f = g - d, b = d - (g - f) + (B - f), B = b - _, f = b - B, pt[1] = b - (B + f) + (f - _), I = g + B, f = I - g, pt[2] = g - (I - f) + (B - f), pt[3] = I;
  const M = ht(k, je, 4, pt, Ue);
  d = a * h, u = U * a, p = u - (u - a), v = a - p, u = U * h, x = u - (u - h), A = h - x, y = v * A - (d - p * x - v * x - p * A), _ = l * c, u = U * l, p = u - (u - l), v = l - p, u = U * c, x = u - (u - c), A = c - x, S = v * A - (_ - p * x - v * x - p * A), B = y - S, f = y - B, pt[0] = y - (B + f) + (f - S), g = d + B, f = g - d, b = d - (g - f) + (B - f), B = b - _, f = b - B, pt[1] = b - (B + f) + (f - _), I = g + B, f = I - g, pt[2] = g - (I - f) + (B - f), pt[3] = I;
  const D = ht(M, Ue, 4, pt, ze);
  return ze[D - 1];
}
function xt(i, t, e, n, s, r) {
  const o = (t - r) * (e - s), a = (i - s) * (n - r), l = o - a, c = Math.abs(o + a);
  return Math.abs(l) >= Gn * c ? l : -Qn(i, t, e, n, s, r, c);
}
const Wn = (10 + 96 * dt) * dt, Hn = (4 + 48 * dt) * dt, Zn = (44 + 576 * dt) * dt * dt, Ft = tt(4), Tt = tt(4), Dt = tt(4), St = tt(4), kt = tt(4), Et = tt(4), mt = tt(4), gt = tt(4), _e = tt(8), Me = tt(8), Se = tt(8), ke = tt(8), Ee = tt(8), Ae = tt(8), se = tt(8), oe = tt(8), ae = tt(8), Pt = tt(4), Xt = tt(4), $t = tt(4), z = tt(8), J = tt(16), nt = tt(16), rt = tt(16), et = tt(32), Ct = tt(32), at = tt(48), yt = tt(64);
let jt = tt(1152), Ie = tt(1152);
function ct(i, t, e) {
  i = ht(i, jt, t, e, Ie);
  const n = jt;
  return jt = Ie, Ie = n, i;
}
function tr(i, t, e, n, s, r, o, a, l) {
  let c, h, f, u, p, v, x, A, B, g, b, d, y, _, S, I, E, T, O, N, $, m, k, M, D, C, X, w, F, P, Y, L, V, j, q;
  const K = i - o, G = e - o, Q = s - o, W = t - a, Z = n - a, H = r - a;
  Y = G * H, k = U * G, M = k - (k - G), D = G - M, k = U * H, C = k - (k - H), X = H - C, L = D * X - (Y - M * C - D * C - M * X), V = Q * Z, k = U * Q, M = k - (k - Q), D = Q - M, k = U * Z, C = k - (k - Z), X = Z - C, j = D * X - (V - M * C - D * C - M * X), w = L - j, m = L - w, Ft[0] = L - (w + m) + (m - j), F = Y + w, m = F - Y, P = Y - (F - m) + (w - m), w = P - V, m = P - w, Ft[1] = P - (w + m) + (m - V), q = F + w, m = q - F, Ft[2] = F - (q - m) + (w - m), Ft[3] = q, Y = Q * W, k = U * Q, M = k - (k - Q), D = Q - M, k = U * W, C = k - (k - W), X = W - C, L = D * X - (Y - M * C - D * C - M * X), V = K * H, k = U * K, M = k - (k - K), D = K - M, k = U * H, C = k - (k - H), X = H - C, j = D * X - (V - M * C - D * C - M * X), w = L - j, m = L - w, Tt[0] = L - (w + m) + (m - j), F = Y + w, m = F - Y, P = Y - (F - m) + (w - m), w = P - V, m = P - w, Tt[1] = P - (w + m) + (m - V), q = F + w, m = q - F, Tt[2] = F - (q - m) + (w - m), Tt[3] = q, Y = K * Z, k = U * K, M = k - (k - K), D = K - M, k = U * Z, C = k - (k - Z), X = Z - C, L = D * X - (Y - M * C - D * C - M * X), V = G * W, k = U * G, M = k - (k - G), D = G - M, k = U * W, C = k - (k - W), X = W - C, j = D * X - (V - M * C - D * C - M * X), w = L - j, m = L - w, Dt[0] = L - (w + m) + (m - j), F = Y + w, m = F - Y, P = Y - (F - m) + (w - m), w = P - V, m = P - w, Dt[1] = P - (w + m) + (m - V), q = F + w, m = q - F, Dt[2] = F - (q - m) + (w - m), Dt[3] = q, c = ht(
    ht(
      ht(
        R(R(4, Ft, K, z), z, K, J),
        J,
        R(R(4, Ft, W, z), z, W, nt),
        nt,
        et
      ),
      et,
      ht(
        R(R(4, Tt, G, z), z, G, J),
        J,
        R(R(4, Tt, Z, z), z, Z, nt),
        nt,
        Ct
      ),
      Ct,
      yt
    ),
    yt,
    ht(
      R(R(4, Dt, Q, z), z, Q, J),
      J,
      R(R(4, Dt, H, z), z, H, nt),
      nt,
      et
    ),
    et,
    jt
  );
  let ot = Fn(c, jt), ft = Hn * l;
  if (ot >= ft || -ot >= ft || (m = i - K, h = i - (K + m) + (m - o), m = t - W, p = t - (W + m) + (m - a), m = e - G, f = e - (G + m) + (m - o), m = n - Z, v = n - (Z + m) + (m - a), m = s - Q, u = s - (Q + m) + (m - o), m = r - H, x = r - (H + m) + (m - a), h === 0 && f === 0 && u === 0 && p === 0 && v === 0 && x === 0) || (ft = Zn * l + On * Math.abs(ot), ot += (K * K + W * W) * (G * x + H * f - (Z * u + Q * v)) + 2 * (K * h + W * p) * (G * H - Z * Q) + ((G * G + Z * Z) * (Q * p + W * u - (H * h + K * x)) + 2 * (G * f + Z * v) * (Q * W - H * K)) + ((Q * Q + H * H) * (K * v + Z * h - (W * f + G * p)) + 2 * (Q * u + H * x) * (K * Z - W * G)), ot >= ft || -ot >= ft))
    return ot;
  if ((f !== 0 || v !== 0 || u !== 0 || x !== 0) && (Y = K * K, k = U * K, M = k - (k - K), D = K - M, L = D * D - (Y - M * M - (M + M) * D), V = W * W, k = U * W, M = k - (k - W), D = W - M, j = D * D - (V - M * M - (M + M) * D), w = L + j, m = w - L, St[0] = L - (w - m) + (j - m), F = Y + w, m = F - Y, P = Y - (F - m) + (w - m), w = P + V, m = w - P, St[1] = P - (w - m) + (V - m), q = F + w, m = q - F, St[2] = F - (q - m) + (w - m), St[3] = q), (u !== 0 || x !== 0 || h !== 0 || p !== 0) && (Y = G * G, k = U * G, M = k - (k - G), D = G - M, L = D * D - (Y - M * M - (M + M) * D), V = Z * Z, k = U * Z, M = k - (k - Z), D = Z - M, j = D * D - (V - M * M - (M + M) * D), w = L + j, m = w - L, kt[0] = L - (w - m) + (j - m), F = Y + w, m = F - Y, P = Y - (F - m) + (w - m), w = P + V, m = w - P, kt[1] = P - (w - m) + (V - m), q = F + w, m = q - F, kt[2] = F - (q - m) + (w - m), kt[3] = q), (h !== 0 || p !== 0 || f !== 0 || v !== 0) && (Y = Q * Q, k = U * Q, M = k - (k - Q), D = Q - M, L = D * D - (Y - M * M - (M + M) * D), V = H * H, k = U * H, M = k - (k - H), D = H - M, j = D * D - (V - M * M - (M + M) * D), w = L + j, m = w - L, Et[0] = L - (w - m) + (j - m), F = Y + w, m = F - Y, P = Y - (F - m) + (w - m), w = P + V, m = w - P, Et[1] = P - (w - m) + (V - m), q = F + w, m = q - F, Et[2] = F - (q - m) + (w - m), Et[3] = q), h !== 0 && (A = R(4, Ft, h, _e), c = ct(c, Mt(
    R(A, _e, 2 * K, J),
    J,
    R(R(4, Et, h, z), z, Z, nt),
    nt,
    R(R(4, kt, h, z), z, -H, rt),
    rt,
    et,
    at
  ), at)), p !== 0 && (B = R(4, Ft, p, Me), c = ct(c, Mt(
    R(B, Me, 2 * W, J),
    J,
    R(R(4, kt, p, z), z, Q, nt),
    nt,
    R(R(4, Et, p, z), z, -G, rt),
    rt,
    et,
    at
  ), at)), f !== 0 && (g = R(4, Tt, f, Se), c = ct(c, Mt(
    R(g, Se, 2 * G, J),
    J,
    R(R(4, St, f, z), z, H, nt),
    nt,
    R(R(4, Et, f, z), z, -W, rt),
    rt,
    et,
    at
  ), at)), v !== 0 && (b = R(4, Tt, v, ke), c = ct(c, Mt(
    R(b, ke, 2 * Z, J),
    J,
    R(R(4, Et, v, z), z, K, nt),
    nt,
    R(R(4, St, v, z), z, -Q, rt),
    rt,
    et,
    at
  ), at)), u !== 0 && (d = R(4, Dt, u, Ee), c = ct(c, Mt(
    R(d, Ee, 2 * Q, J),
    J,
    R(R(4, kt, u, z), z, W, nt),
    nt,
    R(R(4, St, u, z), z, -Z, rt),
    rt,
    et,
    at
  ), at)), x !== 0 && (y = R(4, Dt, x, Ae), c = ct(c, Mt(
    R(y, Ae, 2 * H, J),
    J,
    R(R(4, St, x, z), z, G, nt),
    nt,
    R(R(4, kt, x, z), z, -K, rt),
    rt,
    et,
    at
  ), at)), h !== 0 || p !== 0) {
    if (f !== 0 || v !== 0 || u !== 0 || x !== 0 ? (Y = f * H, k = U * f, M = k - (k - f), D = f - M, k = U * H, C = k - (k - H), X = H - C, L = D * X - (Y - M * C - D * C - M * X), V = G * x, k = U * G, M = k - (k - G), D = G - M, k = U * x, C = k - (k - x), X = x - C, j = D * X - (V - M * C - D * C - M * X), w = L + j, m = w - L, mt[0] = L - (w - m) + (j - m), F = Y + w, m = F - Y, P = Y - (F - m) + (w - m), w = P + V, m = w - P, mt[1] = P - (w - m) + (V - m), q = F + w, m = q - F, mt[2] = F - (q - m) + (w - m), mt[3] = q, Y = u * -Z, k = U * u, M = k - (k - u), D = u - M, k = U * -Z, C = k - (k - -Z), X = -Z - C, L = D * X - (Y - M * C - D * C - M * X), V = Q * -v, k = U * Q, M = k - (k - Q), D = Q - M, k = U * -v, C = k - (k - -v), X = -v - C, j = D * X - (V - M * C - D * C - M * X), w = L + j, m = w - L, gt[0] = L - (w - m) + (j - m), F = Y + w, m = F - Y, P = Y - (F - m) + (w - m), w = P + V, m = w - P, gt[1] = P - (w - m) + (V - m), q = F + w, m = q - F, gt[2] = F - (q - m) + (w - m), gt[3] = q, S = ht(4, mt, 4, gt, oe), Y = f * x, k = U * f, M = k - (k - f), D = f - M, k = U * x, C = k - (k - x), X = x - C, L = D * X - (Y - M * C - D * C - M * X), V = u * v, k = U * u, M = k - (k - u), D = u - M, k = U * v, C = k - (k - v), X = v - C, j = D * X - (V - M * C - D * C - M * X), w = L - j, m = L - w, Xt[0] = L - (w + m) + (m - j), F = Y + w, m = F - Y, P = Y - (F - m) + (w - m), w = P - V, m = P - w, Xt[1] = P - (w + m) + (m - V), q = F + w, m = q - F, Xt[2] = F - (q - m) + (w - m), Xt[3] = q, T = 4) : (oe[0] = 0, S = 1, Xt[0] = 0, T = 1), h !== 0) {
      const it = R(S, oe, h, rt);
      c = ct(c, ht(
        R(A, _e, h, J),
        J,
        R(it, rt, 2 * K, et),
        et,
        at
      ), at);
      const st = R(T, Xt, h, z);
      c = ct(c, Mt(
        R(st, z, 2 * K, J),
        J,
        R(st, z, h, nt),
        nt,
        R(it, rt, h, et),
        et,
        Ct,
        yt
      ), yt), v !== 0 && (c = ct(c, R(R(4, Et, h, z), z, v, J), J)), x !== 0 && (c = ct(c, R(R(4, kt, -h, z), z, x, J), J));
    }
    if (p !== 0) {
      const it = R(S, oe, p, rt);
      c = ct(c, ht(
        R(B, Me, p, J),
        J,
        R(it, rt, 2 * W, et),
        et,
        at
      ), at);
      const st = R(T, Xt, p, z);
      c = ct(c, Mt(
        R(st, z, 2 * W, J),
        J,
        R(st, z, p, nt),
        nt,
        R(it, rt, p, et),
        et,
        Ct,
        yt
      ), yt);
    }
  }
  if (f !== 0 || v !== 0) {
    if (u !== 0 || x !== 0 || h !== 0 || p !== 0 ? (Y = u * W, k = U * u, M = k - (k - u), D = u - M, k = U * W, C = k - (k - W), X = W - C, L = D * X - (Y - M * C - D * C - M * X), V = Q * p, k = U * Q, M = k - (k - Q), D = Q - M, k = U * p, C = k - (k - p), X = p - C, j = D * X - (V - M * C - D * C - M * X), w = L + j, m = w - L, mt[0] = L - (w - m) + (j - m), F = Y + w, m = F - Y, P = Y - (F - m) + (w - m), w = P + V, m = w - P, mt[1] = P - (w - m) + (V - m), q = F + w, m = q - F, mt[2] = F - (q - m) + (w - m), mt[3] = q, N = -H, $ = -x, Y = h * N, k = U * h, M = k - (k - h), D = h - M, k = U * N, C = k - (k - N), X = N - C, L = D * X - (Y - M * C - D * C - M * X), V = K * $, k = U * K, M = k - (k - K), D = K - M, k = U * $, C = k - (k - $), X = $ - C, j = D * X - (V - M * C - D * C - M * X), w = L + j, m = w - L, gt[0] = L - (w - m) + (j - m), F = Y + w, m = F - Y, P = Y - (F - m) + (w - m), w = P + V, m = w - P, gt[1] = P - (w - m) + (V - m), q = F + w, m = q - F, gt[2] = F - (q - m) + (w - m), gt[3] = q, I = ht(4, mt, 4, gt, ae), Y = u * p, k = U * u, M = k - (k - u), D = u - M, k = U * p, C = k - (k - p), X = p - C, L = D * X - (Y - M * C - D * C - M * X), V = h * x, k = U * h, M = k - (k - h), D = h - M, k = U * x, C = k - (k - x), X = x - C, j = D * X - (V - M * C - D * C - M * X), w = L - j, m = L - w, $t[0] = L - (w + m) + (m - j), F = Y + w, m = F - Y, P = Y - (F - m) + (w - m), w = P - V, m = P - w, $t[1] = P - (w + m) + (m - V), q = F + w, m = q - F, $t[2] = F - (q - m) + (w - m), $t[3] = q, O = 4) : (ae[0] = 0, I = 1, $t[0] = 0, O = 1), f !== 0) {
      const it = R(I, ae, f, rt);
      c = ct(c, ht(
        R(g, Se, f, J),
        J,
        R(it, rt, 2 * G, et),
        et,
        at
      ), at);
      const st = R(O, $t, f, z);
      c = ct(c, Mt(
        R(st, z, 2 * G, J),
        J,
        R(st, z, f, nt),
        nt,
        R(it, rt, f, et),
        et,
        Ct,
        yt
      ), yt), x !== 0 && (c = ct(c, R(R(4, St, f, z), z, x, J), J)), p !== 0 && (c = ct(c, R(R(4, Et, -f, z), z, p, J), J));
    }
    if (v !== 0) {
      const it = R(I, ae, v, rt);
      c = ct(c, ht(
        R(b, ke, v, J),
        J,
        R(it, rt, 2 * Z, et),
        et,
        at
      ), at);
      const st = R(O, $t, v, z);
      c = ct(c, Mt(
        R(st, z, 2 * Z, J),
        J,
        R(st, z, v, nt),
        nt,
        R(it, rt, v, et),
        et,
        Ct,
        yt
      ), yt);
    }
  }
  if (u !== 0 || x !== 0) {
    if (h !== 0 || p !== 0 || f !== 0 || v !== 0 ? (Y = h * Z, k = U * h, M = k - (k - h), D = h - M, k = U * Z, C = k - (k - Z), X = Z - C, L = D * X - (Y - M * C - D * C - M * X), V = K * v, k = U * K, M = k - (k - K), D = K - M, k = U * v, C = k - (k - v), X = v - C, j = D * X - (V - M * C - D * C - M * X), w = L + j, m = w - L, mt[0] = L - (w - m) + (j - m), F = Y + w, m = F - Y, P = Y - (F - m) + (w - m), w = P + V, m = w - P, mt[1] = P - (w - m) + (V - m), q = F + w, m = q - F, mt[2] = F - (q - m) + (w - m), mt[3] = q, N = -W, $ = -p, Y = f * N, k = U * f, M = k - (k - f), D = f - M, k = U * N, C = k - (k - N), X = N - C, L = D * X - (Y - M * C - D * C - M * X), V = G * $, k = U * G, M = k - (k - G), D = G - M, k = U * $, C = k - (k - $), X = $ - C, j = D * X - (V - M * C - D * C - M * X), w = L + j, m = w - L, gt[0] = L - (w - m) + (j - m), F = Y + w, m = F - Y, P = Y - (F - m) + (w - m), w = P + V, m = w - P, gt[1] = P - (w - m) + (V - m), q = F + w, m = q - F, gt[2] = F - (q - m) + (w - m), gt[3] = q, _ = ht(4, mt, 4, gt, se), Y = h * v, k = U * h, M = k - (k - h), D = h - M, k = U * v, C = k - (k - v), X = v - C, L = D * X - (Y - M * C - D * C - M * X), V = f * p, k = U * f, M = k - (k - f), D = f - M, k = U * p, C = k - (k - p), X = p - C, j = D * X - (V - M * C - D * C - M * X), w = L - j, m = L - w, Pt[0] = L - (w + m) + (m - j), F = Y + w, m = F - Y, P = Y - (F - m) + (w - m), w = P - V, m = P - w, Pt[1] = P - (w + m) + (m - V), q = F + w, m = q - F, Pt[2] = F - (q - m) + (w - m), Pt[3] = q, E = 4) : (se[0] = 0, _ = 1, Pt[0] = 0, E = 1), u !== 0) {
      const it = R(_, se, u, rt);
      c = ct(c, ht(
        R(d, Ee, u, J),
        J,
        R(it, rt, 2 * Q, et),
        et,
        at
      ), at);
      const st = R(E, Pt, u, z);
      c = ct(c, Mt(
        R(st, z, 2 * Q, J),
        J,
        R(st, z, u, nt),
        nt,
        R(it, rt, u, et),
        et,
        Ct,
        yt
      ), yt), p !== 0 && (c = ct(c, R(R(4, kt, u, z), z, p, J), J)), v !== 0 && (c = ct(c, R(R(4, St, -u, z), z, v, J), J));
    }
    if (x !== 0) {
      const it = R(_, se, x, rt);
      c = ct(c, ht(
        R(y, Ae, x, J),
        J,
        R(it, rt, 2 * H, et),
        et,
        at
      ), at);
      const st = R(E, Pt, x, z);
      c = ct(c, Mt(
        R(st, z, 2 * H, J),
        J,
        R(st, z, x, nt),
        nt,
        R(it, rt, x, et),
        et,
        Ct,
        yt
      ), yt);
    }
  }
  return jt[c - 1];
}
function er(i, t, e, n, s, r, o, a) {
  const l = i - o, c = e - o, h = s - o, f = t - a, u = n - a, p = r - a, v = c * p, x = h * u, A = l * l + f * f, B = h * f, g = l * p, b = c * c + u * u, d = l * u, y = c * f, _ = h * h + p * p, S = A * (v - x) + b * (B - g) + _ * (d - y), I = (Math.abs(v) + Math.abs(x)) * A + (Math.abs(B) + Math.abs(g)) * b + (Math.abs(d) + Math.abs(y)) * _, E = Wn * I;
  return S > E || -S > E ? S : tr(i, t, e, n, s, r, o, a, I);
}
function nr(i, t) {
  var e, n, s = 0, r, o, a, l, c, h, f, u = i[0], p = i[1], v = t.length;
  for (e = 0; e < v; e++) {
    n = 0;
    var x = t[e], A = x.length - 1;
    if (h = x[0], h[0] !== x[A][0] && h[1] !== x[A][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (o = h[0] - u, a = h[1] - p, n; n < A; n++) {
      if (f = x[n + 1], l = f[0] - u, c = f[1] - p, a === 0 && c === 0) {
        if (l <= 0 && o >= 0 || o <= 0 && l >= 0)
          return 0;
      } else if (c >= 0 && a <= 0 || c <= 0 && a >= 0) {
        if (r = xt(o, l, a, c, 0, 0), r === 0)
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
  const n = Un(i), s = zn(t), r = s.type, o = t.bbox;
  let a = s.coordinates;
  if (o && rr(n, o) === !1)
    return !1;
  r === "Polygon" && (a = [a]);
  for (var l = 0; l < a.length; ++l) {
    const c = nr(n, a[l]);
    if (c === 0 && !e.ignoreBoundary) return !0;
    if (c) return !0;
  }
  return !1;
}
function rr(i, t) {
  return t[0] <= i[0] && t[1] <= i[1] && t[2] >= i[0] && t[3] >= i[1];
}
class Xe {
  constructor(t = [], e = ir) {
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
function ir(i, t) {
  return i < t ? -1 : i > t ? 1 : 0;
}
const sr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Xe
}, Symbol.toStringTag, { value: "Module" })), Bt = 11102230246251565e-32, ut = 134217729, or = (3 + 8 * Bt) * Bt;
function Be(i, t, e, n, s) {
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
function ar(i, t) {
  let e = t[0];
  for (let n = 1; n < i; n++) e += t[n];
  return e;
}
function ie(i) {
  return new Float64Array(i);
}
const cr = (3 + 16 * Bt) * Bt, lr = (2 + 12 * Bt) * Bt, fr = (9 + 64 * Bt) * Bt * Bt, Vt = ie(4), Ke = ie(8), Je = ie(12), Qe = ie(16), wt = ie(4);
function hr(i, t, e, n, s, r, o) {
  let a, l, c, h, f, u, p, v, x, A, B, g, b, d, y, _, S, I;
  const E = i - s, T = e - s, O = t - r, N = n - r;
  d = E * N, u = ut * E, p = u - (u - E), v = E - p, u = ut * N, x = u - (u - N), A = N - x, y = v * A - (d - p * x - v * x - p * A), _ = O * T, u = ut * O, p = u - (u - O), v = O - p, u = ut * T, x = u - (u - T), A = T - x, S = v * A - (_ - p * x - v * x - p * A), B = y - S, f = y - B, Vt[0] = y - (B + f) + (f - S), g = d + B, f = g - d, b = d - (g - f) + (B - f), B = b - _, f = b - B, Vt[1] = b - (B + f) + (f - _), I = g + B, f = I - g, Vt[2] = g - (I - f) + (B - f), Vt[3] = I;
  let $ = ar(4, Vt), m = lr * o;
  if ($ >= m || -$ >= m || (f = i - E, a = i - (E + f) + (f - s), f = e - T, c = e - (T + f) + (f - s), f = t - O, l = t - (O + f) + (f - r), f = n - N, h = n - (N + f) + (f - r), a === 0 && l === 0 && c === 0 && h === 0) || (m = fr * o + or * Math.abs($), $ += E * h + N * a - (O * c + T * l), $ >= m || -$ >= m)) return $;
  d = a * N, u = ut * a, p = u - (u - a), v = a - p, u = ut * N, x = u - (u - N), A = N - x, y = v * A - (d - p * x - v * x - p * A), _ = l * T, u = ut * l, p = u - (u - l), v = l - p, u = ut * T, x = u - (u - T), A = T - x, S = v * A - (_ - p * x - v * x - p * A), B = y - S, f = y - B, wt[0] = y - (B + f) + (f - S), g = d + B, f = g - d, b = d - (g - f) + (B - f), B = b - _, f = b - B, wt[1] = b - (B + f) + (f - _), I = g + B, f = I - g, wt[2] = g - (I - f) + (B - f), wt[3] = I;
  const k = Be(4, Vt, 4, wt, Ke);
  d = E * h, u = ut * E, p = u - (u - E), v = E - p, u = ut * h, x = u - (u - h), A = h - x, y = v * A - (d - p * x - v * x - p * A), _ = O * c, u = ut * O, p = u - (u - O), v = O - p, u = ut * c, x = u - (u - c), A = c - x, S = v * A - (_ - p * x - v * x - p * A), B = y - S, f = y - B, wt[0] = y - (B + f) + (f - S), g = d + B, f = g - d, b = d - (g - f) + (B - f), B = b - _, f = b - B, wt[1] = b - (B + f) + (f - _), I = g + B, f = I - g, wt[2] = g - (I - f) + (B - f), wt[3] = I;
  const M = Be(k, Ke, 4, wt, Je);
  d = a * h, u = ut * a, p = u - (u - a), v = a - p, u = ut * h, x = u - (u - h), A = h - x, y = v * A - (d - p * x - v * x - p * A), _ = l * c, u = ut * l, p = u - (u - l), v = l - p, u = ut * c, x = u - (u - c), A = c - x, S = v * A - (_ - p * x - v * x - p * A), B = y - S, f = y - B, wt[0] = y - (B + f) + (f - S), g = d + B, f = g - d, b = d - (g - f) + (B - f), B = b - _, f = b - B, wt[1] = b - (B + f) + (f - _), I = g + B, f = I - g, wt[2] = g - (I - f) + (B - f), wt[3] = I;
  const D = Be(M, Je, 4, wt, Qe);
  return Qe[D - 1];
}
function We(i, t, e, n, s, r) {
  const o = (t - r) * (e - s), a = (i - s) * (n - r), l = o - a;
  if (o === 0 || a === 0 || o > 0 != a > 0) return l;
  const c = Math.abs(o + a);
  return Math.abs(l) >= cr * c ? l : -hr(i, t, e, n, s, r, c);
}
function ur(i, t) {
  const e = new Xe([], Tn);
  return pr(i, e), mr(e, t);
}
function Tn(i, t) {
  return i.p.x > t.p.x ? 1 : i.p.x < t.p.x || i.p.x === t.p.x && (i.featureId !== t.featureId || i.ringId !== t.ringId) && i.isLeftEndpoint && !t.isLeftEndpoint ? -1 : i.p.y !== t.p.y ? i.p.y > t.p.y ? 1 : -1 : 1;
}
function dr(i, t) {
  return i.rightSweepEvent.p.x > t.rightSweepEvent.p.x ? 1 : i.rightSweepEvent.p.x < t.rightSweepEvent.p.x ? -1 : i.rightSweepEvent.p.y !== t.rightSweepEvent.p.y ? i.rightSweepEvent.p.y < t.rightSweepEvent.p.y ? 1 : -1 : 1;
}
function pr(i, t) {
  if (i.type === "FeatureCollection") {
    const e = i.features;
    for (let n = 0; n < e.length; n++)
      He(e[n], t);
  } else
    He(i, t);
}
var ce = 0, le = 0, fe = 0;
function He(i, t) {
  const e = i.type === "Feature" ? i.geometry : i;
  let n = e.coordinates;
  (e.type === "Polygon" || e.type === "MultiLineString") && (n = [n]), e.type === "LineString" && (n = [[n]]);
  for (let s = 0; s < n.length; s++)
    for (let r = 0; r < n[s].length; r++) {
      let o = n[s][r][0], a = null;
      le = le + 1;
      for (let l = 0; l < n[s][r].length - 1; l++) {
        a = n[s][r][l + 1];
        const c = new Ze(o, ce, le, fe), h = new Ze(a, ce, le, fe + 1);
        c.otherEvent = h, h.otherEvent = c, Tn(c, h) > 0 ? (h.isLeftEndpoint = !0, c.isLeftEndpoint = !1) : (c.isLeftEndpoint = !0, h.isLeftEndpoint = !1), t.push(c), t.push(h), o = a, fe = fe + 1;
      }
    }
  ce = ce + 1;
}
var Ze = class {
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
function mr(i, t = !1) {
  const e = [], n = new Xe([], dr);
  for (; i.length; ) {
    const s = i.pop();
    if (s.isLeftEndpoint) {
      const r = new gr(s);
      for (let o = 0; o < n.data.length; o++) {
        const a = n.data[o];
        if (t && a.leftSweepEvent.featureId === s.featureId)
          continue;
        const l = wr(r, a);
        l !== !1 && e.push(l);
      }
      n.push(r);
    } else s.isLeftEndpoint === !1 && n.pop();
  }
  return e;
}
var gr = class {
  /** @param event must have otherEvent non-null */
  constructor(i) {
    this.leftSweepEvent = i, this.rightSweepEvent = i.otherEvent;
  }
};
function wr(i, t) {
  if (i === null || t === null) return !1;
  const e = i.leftSweepEvent.p.x, n = i.leftSweepEvent.p.y, s = i.rightSweepEvent.p.x, r = i.rightSweepEvent.p.y, o = t.leftSweepEvent.p.x, a = t.leftSweepEvent.p.y, l = t.rightSweepEvent.p.x, c = t.rightSweepEvent.p.y, h = We(e, n, s, r, o, a), f = We(e, n, s, r, l, c);
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
  const u = (c - a) * (s - e) - (l - o) * (r - n), p = (l - o) * (n - a) - (c - a) * (e - o), v = (s - e) * (n - a) - (r - n) * (e - o);
  if (u === 0)
    return !1;
  const x = p / u, A = v / u;
  if (x >= 0 && x <= 1 && A >= 0 && A <= 1) {
    const B = e + x * (s - e), g = n + x * (r - n);
    return [B, g];
  }
  return !1;
}
function yr(i, t, e = {}) {
  const { removeDuplicates: n = !0, ignoreSelfIntersections: s = !0 } = e;
  let r = [];
  i.type === "FeatureCollection" ? r = r.concat(i.features) : i.type === "Feature" ? r.push(i) : (i.type === "LineString" || i.type === "Polygon" || i.type === "MultiLineString" || i.type === "MultiPolygon") && r.push(te(i)), t.type === "FeatureCollection" ? r = r.concat(t.features) : t.type === "Feature" ? r.push(t) : (t.type === "LineString" || t.type === "Polygon" || t.type === "MultiLineString" || t.type === "MultiPolygon") && r.push(te(t));
  const o = ur(
    bt(r),
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
  return bt(a.map((l) => Rt(l)));
}
function vr(i) {
  return i && i.__esModule && Object.prototype.hasOwnProperty.call(i, "default") ? i.default : i;
}
function br(i) {
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
function xr(i, t = {}) {
  let e = 0, n = 0, s = 0;
  return Pe(
    i,
    function(r) {
      e += r[0], n += r[1], s++;
    },
    !0
  ), Rt([e / s, n / s], t.properties);
}
var he = { exports: {} }, we = { exports: {} }, _r = we.exports, tn;
function Mr() {
  return tn || (tn = 1, (function(i, t) {
    (function(e, n) {
      i.exports = n();
    })(_r, function() {
      function e(g, b, d, y, _) {
        (function S(I, E, T, O, N) {
          for (; O > T; ) {
            if (O - T > 600) {
              var $ = O - T + 1, m = E - T + 1, k = Math.log($), M = 0.5 * Math.exp(2 * k / 3), D = 0.5 * Math.sqrt(k * M * ($ - M) / $) * (m - $ / 2 < 0 ? -1 : 1), C = Math.max(T, Math.floor(E - m * M / $ + D)), X = Math.min(O, Math.floor(E + ($ - m) * M / $ + D));
              S(I, E, C, X, N);
            }
            var w = I[E], F = T, P = O;
            for (n(I, T, E), N(I[O], w) > 0 && n(I, T, O); F < P; ) {
              for (n(I, F, P), F++, P--; N(I[F], w) < 0; ) F++;
              for (; N(I[P], w) > 0; ) P--;
            }
            N(I[T], w) === 0 ? n(I, T, P) : n(I, ++P, O), P <= E && (T = P + 1), E <= P && (O = P - 1);
          }
        })(g, b, d || 0, y || g.length - 1, _ || s);
      }
      function n(g, b, d) {
        var y = g[b];
        g[b] = g[d], g[d] = y;
      }
      function s(g, b) {
        return g < b ? -1 : g > b ? 1 : 0;
      }
      var r = function(g) {
        g === void 0 && (g = 9), this._maxEntries = Math.max(4, g), this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries)), this.clear();
      };
      function o(g, b, d) {
        if (!d) return b.indexOf(g);
        for (var y = 0; y < b.length; y++) if (d(g, b[y])) return y;
        return -1;
      }
      function a(g, b) {
        l(g, 0, g.children.length, b, g);
      }
      function l(g, b, d, y, _) {
        _ || (_ = A(null)), _.minX = 1 / 0, _.minY = 1 / 0, _.maxX = -1 / 0, _.maxY = -1 / 0;
        for (var S = b; S < d; S++) {
          var I = g.children[S];
          c(_, g.leaf ? y(I) : I);
        }
        return _;
      }
      function c(g, b) {
        return g.minX = Math.min(g.minX, b.minX), g.minY = Math.min(g.minY, b.minY), g.maxX = Math.max(g.maxX, b.maxX), g.maxY = Math.max(g.maxY, b.maxY), g;
      }
      function h(g, b) {
        return g.minX - b.minX;
      }
      function f(g, b) {
        return g.minY - b.minY;
      }
      function u(g) {
        return (g.maxX - g.minX) * (g.maxY - g.minY);
      }
      function p(g) {
        return g.maxX - g.minX + (g.maxY - g.minY);
      }
      function v(g, b) {
        return g.minX <= b.minX && g.minY <= b.minY && b.maxX <= g.maxX && b.maxY <= g.maxY;
      }
      function x(g, b) {
        return b.minX <= g.maxX && b.minY <= g.maxY && b.maxX >= g.minX && b.maxY >= g.minY;
      }
      function A(g) {
        return { children: g, height: 1, leaf: !0, minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
      }
      function B(g, b, d, y, _) {
        for (var S = [b, d]; S.length; ) if (!((d = S.pop()) - (b = S.pop()) <= y)) {
          var I = b + Math.ceil((d - b) / y / 2) * y;
          e(g, I, b, d, _), S.push(b, I, I, d);
        }
      }
      return r.prototype.all = function() {
        return this._all(this.data, []);
      }, r.prototype.search = function(g) {
        var b = this.data, d = [];
        if (!x(g, b)) return d;
        for (var y = this.toBBox, _ = []; b; ) {
          for (var S = 0; S < b.children.length; S++) {
            var I = b.children[S], E = b.leaf ? y(I) : I;
            x(g, E) && (b.leaf ? d.push(I) : v(g, E) ? this._all(I, d) : _.push(I));
          }
          b = _.pop();
        }
        return d;
      }, r.prototype.collides = function(g) {
        var b = this.data;
        if (!x(g, b)) return !1;
        for (var d = []; b; ) {
          for (var y = 0; y < b.children.length; y++) {
            var _ = b.children[y], S = b.leaf ? this.toBBox(_) : _;
            if (x(g, S)) {
              if (b.leaf || v(g, S)) return !0;
              d.push(_);
            }
          }
          b = d.pop();
        }
        return !1;
      }, r.prototype.load = function(g) {
        if (!g || !g.length) return this;
        if (g.length < this._minEntries) {
          for (var b = 0; b < g.length; b++) this.insert(g[b]);
          return this;
        }
        var d = this._build(g.slice(), 0, g.length - 1, 0);
        if (this.data.children.length) if (this.data.height === d.height) this._splitRoot(this.data, d);
        else {
          if (this.data.height < d.height) {
            var y = this.data;
            this.data = d, d = y;
          }
          this._insert(d, this.data.height - d.height - 1, !0);
        }
        else this.data = d;
        return this;
      }, r.prototype.insert = function(g) {
        return g && this._insert(g, this.data.height - 1), this;
      }, r.prototype.clear = function() {
        return this.data = A([]), this;
      }, r.prototype.remove = function(g, b) {
        if (!g) return this;
        for (var d, y, _, S = this.data, I = this.toBBox(g), E = [], T = []; S || E.length; ) {
          if (S || (S = E.pop(), y = E[E.length - 1], d = T.pop(), _ = !0), S.leaf) {
            var O = o(g, S.children, b);
            if (O !== -1) return S.children.splice(O, 1), E.push(S), this._condense(E), this;
          }
          _ || S.leaf || !v(S, I) ? y ? (d++, S = y.children[d], _ = !1) : S = null : (E.push(S), T.push(d), d = 0, y = S, S = S.children[0]);
        }
        return this;
      }, r.prototype.toBBox = function(g) {
        return g;
      }, r.prototype.compareMinX = function(g, b) {
        return g.minX - b.minX;
      }, r.prototype.compareMinY = function(g, b) {
        return g.minY - b.minY;
      }, r.prototype.toJSON = function() {
        return this.data;
      }, r.prototype.fromJSON = function(g) {
        return this.data = g, this;
      }, r.prototype._all = function(g, b) {
        for (var d = []; g; ) g.leaf ? b.push.apply(b, g.children) : d.push.apply(d, g.children), g = d.pop();
        return b;
      }, r.prototype._build = function(g, b, d, y) {
        var _, S = d - b + 1, I = this._maxEntries;
        if (S <= I) return a(_ = A(g.slice(b, d + 1)), this.toBBox), _;
        y || (y = Math.ceil(Math.log(S) / Math.log(I)), I = Math.ceil(S / Math.pow(I, y - 1))), (_ = A([])).leaf = !1, _.height = y;
        var E = Math.ceil(S / I), T = E * Math.ceil(Math.sqrt(I));
        B(g, b, d, T, this.compareMinX);
        for (var O = b; O <= d; O += T) {
          var N = Math.min(O + T - 1, d);
          B(g, O, N, E, this.compareMinY);
          for (var $ = O; $ <= N; $ += E) {
            var m = Math.min($ + E - 1, N);
            _.children.push(this._build(g, $, m, y - 1));
          }
        }
        return a(_, this.toBBox), _;
      }, r.prototype._chooseSubtree = function(g, b, d, y) {
        for (; y.push(b), !b.leaf && y.length - 1 !== d; ) {
          for (var _ = 1 / 0, S = 1 / 0, I = void 0, E = 0; E < b.children.length; E++) {
            var T = b.children[E], O = u(T), N = ($ = g, m = T, (Math.max(m.maxX, $.maxX) - Math.min(m.minX, $.minX)) * (Math.max(m.maxY, $.maxY) - Math.min(m.minY, $.minY)) - O);
            N < S ? (S = N, _ = O < _ ? O : _, I = T) : N === S && O < _ && (_ = O, I = T);
          }
          b = I || b.children[0];
        }
        var $, m;
        return b;
      }, r.prototype._insert = function(g, b, d) {
        var y = d ? g : this.toBBox(g), _ = [], S = this._chooseSubtree(y, this.data, b, _);
        for (S.children.push(g), c(S, y); b >= 0 && _[b].children.length > this._maxEntries; ) this._split(_, b), b--;
        this._adjustParentBBoxes(y, _, b);
      }, r.prototype._split = function(g, b) {
        var d = g[b], y = d.children.length, _ = this._minEntries;
        this._chooseSplitAxis(d, _, y);
        var S = this._chooseSplitIndex(d, _, y), I = A(d.children.splice(S, d.children.length - S));
        I.height = d.height, I.leaf = d.leaf, a(d, this.toBBox), a(I, this.toBBox), b ? g[b - 1].children.push(I) : this._splitRoot(d, I);
      }, r.prototype._splitRoot = function(g, b) {
        this.data = A([g, b]), this.data.height = g.height + 1, this.data.leaf = !1, a(this.data, this.toBBox);
      }, r.prototype._chooseSplitIndex = function(g, b, d) {
        for (var y, _, S, I, E, T, O, N = 1 / 0, $ = 1 / 0, m = b; m <= d - b; m++) {
          var k = l(g, 0, m, this.toBBox), M = l(g, m, d, this.toBBox), D = (_ = k, S = M, I = void 0, E = void 0, T = void 0, O = void 0, I = Math.max(_.minX, S.minX), E = Math.max(_.minY, S.minY), T = Math.min(_.maxX, S.maxX), O = Math.min(_.maxY, S.maxY), Math.max(0, T - I) * Math.max(0, O - E)), C = u(k) + u(M);
          D < N ? (N = D, y = m, $ = C < $ ? C : $) : D === N && C < $ && ($ = C, y = m);
        }
        return y || d - b;
      }, r.prototype._chooseSplitAxis = function(g, b, d) {
        var y = g.leaf ? this.compareMinX : h, _ = g.leaf ? this.compareMinY : f;
        this._allDistMargin(g, b, d, y) < this._allDistMargin(g, b, d, _) && g.children.sort(y);
      }, r.prototype._allDistMargin = function(g, b, d, y) {
        g.children.sort(y);
        for (var _ = this.toBBox, S = l(g, 0, b, _), I = l(g, d - b, d, _), E = p(S) + p(I), T = b; T < d - b; T++) {
          var O = g.children[T];
          c(S, g.leaf ? _(O) : O), E += p(S);
        }
        for (var N = d - b - 1; N >= b; N--) {
          var $ = g.children[N];
          c(I, g.leaf ? _($) : $), E += p(I);
        }
        return E;
      }, r.prototype._adjustParentBBoxes = function(g, b, d) {
        for (var y = d; y >= 0; y--) c(b[y], g);
      }, r.prototype._condense = function(g) {
        for (var b = g.length - 1, d = void 0; b >= 0; b--) g[b].children.length === 0 ? b > 0 ? (d = g[b - 1].children).splice(d.indexOf(g[b]), 1) : this.clear() : a(g[b], this.toBBox);
      }, r;
    });
  })(we)), we.exports;
}
const Sr = /* @__PURE__ */ br(sr);
var zt = { exports: {} }, Oe, en;
function kr() {
  return en || (en = 1, Oe = function(t, e, n, s) {
    var r = t[0], o = t[1], a = !1;
    n === void 0 && (n = 0), s === void 0 && (s = e.length);
    for (var l = (s - n) / 2, c = 0, h = l - 1; c < l; h = c++) {
      var f = e[n + c * 2 + 0], u = e[n + c * 2 + 1], p = e[n + h * 2 + 0], v = e[n + h * 2 + 1], x = u > o != v > o && r < (p - f) * (o - u) / (v - u) + f;
      x && (a = !a);
    }
    return a;
  }), Oe;
}
var Fe, nn;
function Er() {
  return nn || (nn = 1, Fe = function(t, e, n, s) {
    var r = t[0], o = t[1], a = !1;
    n === void 0 && (n = 0), s === void 0 && (s = e.length);
    for (var l = s - n, c = 0, h = l - 1; c < l; h = c++) {
      var f = e[c + n][0], u = e[c + n][1], p = e[h + n][0], v = e[h + n][1], x = u > o != v > o && r < (p - f) * (o - u) / (v - u) + f;
      x && (a = !a);
    }
    return a;
  }), Fe;
}
var rn;
function Ar() {
  if (rn) return zt.exports;
  rn = 1;
  var i = kr(), t = Er();
  return zt.exports = function(n, s, r, o) {
    return s.length > 0 && Array.isArray(s[0]) ? t(n, s, r, o) : i(n, s, r, o);
  }, zt.exports.nested = t, zt.exports.flat = i, zt.exports;
}
var Kt = { exports: {} }, Ir = Kt.exports, sn;
function Br() {
  return sn || (sn = 1, (function(i, t) {
    (function(e, n) {
      n(t);
    })(Ir, function(e) {
      const s = 33306690738754706e-32;
      function r(x, A, B, g, b) {
        let d, y, _, S, I = A[0], E = g[0], T = 0, O = 0;
        E > I == E > -I ? (d = I, I = A[++T]) : (d = E, E = g[++O]);
        let N = 0;
        if (T < x && O < B) for (E > I == E > -I ? (_ = d - ((y = I + d) - I), I = A[++T]) : (_ = d - ((y = E + d) - E), E = g[++O]), d = y, _ !== 0 && (b[N++] = _); T < x && O < B; ) E > I == E > -I ? (_ = d - ((y = d + I) - (S = y - d)) + (I - S), I = A[++T]) : (_ = d - ((y = d + E) - (S = y - d)) + (E - S), E = g[++O]), d = y, _ !== 0 && (b[N++] = _);
        for (; T < x; ) _ = d - ((y = d + I) - (S = y - d)) + (I - S), I = A[++T], d = y, _ !== 0 && (b[N++] = _);
        for (; O < B; ) _ = d - ((y = d + E) - (S = y - d)) + (E - S), E = g[++O], d = y, _ !== 0 && (b[N++] = _);
        return d === 0 && N !== 0 || (b[N++] = d), N;
      }
      function o(x) {
        return new Float64Array(x);
      }
      const a = 33306690738754716e-32, l = 22204460492503146e-32, c = 11093356479670487e-47, h = o(4), f = o(8), u = o(12), p = o(16), v = o(4);
      e.orient2d = function(x, A, B, g, b, d) {
        const y = (A - d) * (B - b), _ = (x - b) * (g - d), S = y - _;
        if (y === 0 || _ === 0 || y > 0 != _ > 0) return S;
        const I = Math.abs(y + _);
        return Math.abs(S) >= a * I ? S : -(function(E, T, O, N, $, m, k) {
          let M, D, C, X, w, F, P, Y, L, V, j, q, K, G, Q, W, Z, H;
          const ot = E - $, ft = O - $, it = T - m, st = N - m;
          w = (Q = (Y = ot - (P = (F = 134217729 * ot) - (F - ot))) * (V = st - (L = (F = 134217729 * st) - (F - st))) - ((G = ot * st) - P * L - Y * L - P * V)) - (j = Q - (Z = (Y = it - (P = (F = 134217729 * it) - (F - it))) * (V = ft - (L = (F = 134217729 * ft) - (F - ft))) - ((W = it * ft) - P * L - Y * L - P * V))), h[0] = Q - (j + w) + (w - Z), w = (K = G - ((q = G + j) - (w = q - G)) + (j - w)) - (j = K - W), h[1] = K - (j + w) + (w - W), w = (H = q + j) - q, h[2] = q - (H - w) + (j - w), h[3] = H;
          let Ot = (function(Rn, Ye) {
            let Re = Ye[0];
            for (let be = 1; be < Rn; be++) Re += Ye[be];
            return Re;
          })(4, h), Ut = l * k;
          if (Ot >= Ut || -Ot >= Ut || (M = E - (ot + (w = E - ot)) + (w - $), C = O - (ft + (w = O - ft)) + (w - $), D = T - (it + (w = T - it)) + (w - m), X = N - (st + (w = N - st)) + (w - m), M === 0 && D === 0 && C === 0 && X === 0) || (Ut = c * k + s * Math.abs(Ot), (Ot += ot * X + st * M - (it * C + ft * D)) >= Ut || -Ot >= Ut)) return Ot;
          w = (Q = (Y = M - (P = (F = 134217729 * M) - (F - M))) * (V = st - (L = (F = 134217729 * st) - (F - st))) - ((G = M * st) - P * L - Y * L - P * V)) - (j = Q - (Z = (Y = D - (P = (F = 134217729 * D) - (F - D))) * (V = ft - (L = (F = 134217729 * ft) - (F - ft))) - ((W = D * ft) - P * L - Y * L - P * V))), v[0] = Q - (j + w) + (w - Z), w = (K = G - ((q = G + j) - (w = q - G)) + (j - w)) - (j = K - W), v[1] = K - (j + w) + (w - W), w = (H = q + j) - q, v[2] = q - (H - w) + (j - w), v[3] = H;
          const Xn = r(4, h, 4, v, f);
          w = (Q = (Y = ot - (P = (F = 134217729 * ot) - (F - ot))) * (V = X - (L = (F = 134217729 * X) - (F - X))) - ((G = ot * X) - P * L - Y * L - P * V)) - (j = Q - (Z = (Y = it - (P = (F = 134217729 * it) - (F - it))) * (V = C - (L = (F = 134217729 * C) - (F - C))) - ((W = it * C) - P * L - Y * L - P * V))), v[0] = Q - (j + w) + (w - Z), w = (K = G - ((q = G + j) - (w = q - G)) + (j - w)) - (j = K - W), v[1] = K - (j + w) + (w - W), w = (H = q + j) - q, v[2] = q - (H - w) + (j - w), v[3] = H;
          const $n = r(Xn, f, 4, v, u);
          w = (Q = (Y = M - (P = (F = 134217729 * M) - (F - M))) * (V = X - (L = (F = 134217729 * X) - (F - X))) - ((G = M * X) - P * L - Y * L - P * V)) - (j = Q - (Z = (Y = D - (P = (F = 134217729 * D) - (F - D))) * (V = C - (L = (F = 134217729 * C) - (F - C))) - ((W = D * C) - P * L - Y * L - P * V))), v[0] = Q - (j + w) + (w - Z), w = (K = G - ((q = G + j) - (w = q - G)) + (j - w)) - (j = K - W), v[1] = K - (j + w) + (w - W), w = (H = q + j) - q, v[2] = q - (H - w) + (j - w), v[3] = H;
          const Yn = r($n, u, 4, v, p);
          return p[Yn - 1];
        })(x, A, B, g, b, d, I);
      }, e.orient2dfast = function(x, A, B, g, b, d) {
        return (A - d) * (B - b) - (x - b) * (g - d);
      }, Object.defineProperty(e, "__esModule", { value: !0 });
    });
  })(Kt, Kt.exports)), Kt.exports;
}
var on;
function Or() {
  if (on) return he.exports;
  on = 1;
  var i = Mr(), t = Sr, e = Ar(), n = Br().orient2d;
  t.default && (t = t.default), he.exports = s, he.exports.default = s;
  function s(d, y, _) {
    y = Math.max(0, y === void 0 ? 2 : y), _ = _ || 0;
    var S = p(d), I = new i(16);
    I.toBBox = function(P) {
      return {
        minX: P[0],
        minY: P[1],
        maxX: P[0],
        maxY: P[1]
      };
    }, I.compareMinX = function(P, Y) {
      return P[0] - Y[0];
    }, I.compareMinY = function(P, Y) {
      return P[1] - Y[1];
    }, I.load(d);
    for (var E = [], T = 0, O; T < S.length; T++) {
      var N = S[T];
      I.remove(N), O = v(N, O), E.push(O);
    }
    var $ = new i(16);
    for (T = 0; T < E.length; T++) $.insert(u(E[T]));
    for (var m = y * y, k = _ * _; E.length; ) {
      var M = E.shift(), D = M.p, C = M.next.p, X = x(D, C);
      if (!(X < k)) {
        var w = X / m;
        N = r(I, M.prev.p, D, C, M.next.next.p, w, $), N && Math.min(x(N, D), x(N, C)) <= w && (E.push(M), E.push(v(N, M)), I.remove(N), $.remove(M), $.insert(u(M)), $.insert(u(M.next)));
      }
    }
    M = O;
    var F = [];
    do
      F.push(M.p), M = M.next;
    while (M !== O);
    return F.push(M.p), F;
  }
  function r(d, y, _, S, I, E, T) {
    for (var O = new t([], o), N = d.data; N; ) {
      for (var $ = 0; $ < N.children.length; $++) {
        var m = N.children[$], k = N.leaf ? A(m, _, S) : a(_, S, m);
        k > E || O.push({
          node: m,
          dist: k
        });
      }
      for (; O.length && !O.peek().node.children; ) {
        var M = O.pop(), D = M.node, C = A(D, y, _), X = A(D, S, I);
        if (M.dist < C && M.dist < X && c(_, D, T) && c(S, D, T)) return D;
      }
      N = O.pop(), N && (N = N.node);
    }
    return null;
  }
  function o(d, y) {
    return d.dist - y.dist;
  }
  function a(d, y, _) {
    if (l(d, _) || l(y, _)) return 0;
    var S = B(d[0], d[1], y[0], y[1], _.minX, _.minY, _.maxX, _.minY);
    if (S === 0) return 0;
    var I = B(d[0], d[1], y[0], y[1], _.minX, _.minY, _.minX, _.maxY);
    if (I === 0) return 0;
    var E = B(d[0], d[1], y[0], y[1], _.maxX, _.minY, _.maxX, _.maxY);
    if (E === 0) return 0;
    var T = B(d[0], d[1], y[0], y[1], _.minX, _.maxY, _.maxX, _.maxY);
    return T === 0 ? 0 : Math.min(S, I, E, T);
  }
  function l(d, y) {
    return d[0] >= y.minX && d[0] <= y.maxX && d[1] >= y.minY && d[1] <= y.maxY;
  }
  function c(d, y, _) {
    for (var S = Math.min(d[0], y[0]), I = Math.min(d[1], y[1]), E = Math.max(d[0], y[0]), T = Math.max(d[1], y[1]), O = _.search({ minX: S, minY: I, maxX: E, maxY: T }), N = 0; N < O.length; N++)
      if (f(O[N].p, O[N].next.p, d, y)) return !1;
    return !0;
  }
  function h(d, y, _) {
    return n(d[0], d[1], y[0], y[1], _[0], _[1]);
  }
  function f(d, y, _, S) {
    return d !== S && y !== _ && h(d, y, _) > 0 != h(d, y, S) > 0 && h(_, S, d) > 0 != h(_, S, y) > 0;
  }
  function u(d) {
    var y = d.p, _ = d.next.p;
    return d.minX = Math.min(y[0], _[0]), d.minY = Math.min(y[1], _[1]), d.maxX = Math.max(y[0], _[0]), d.maxY = Math.max(y[1], _[1]), d;
  }
  function p(d) {
    for (var y = d[0], _ = d[0], S = d[0], I = d[0], E = 0; E < d.length; E++) {
      var T = d[E];
      T[0] < y[0] && (y = T), T[0] > S[0] && (S = T), T[1] < _[1] && (_ = T), T[1] > I[1] && (I = T);
    }
    var O = [y, _, S, I], N = O.slice();
    for (E = 0; E < d.length; E++)
      e(d[E], O) || N.push(d[E]);
    return b(N);
  }
  function v(d, y) {
    var _ = {
      p: d,
      prev: null,
      next: null,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };
    return y ? (_.next = y.next, _.prev = y, y.next.prev = _, y.next = _) : (_.prev = _, _.next = _), _;
  }
  function x(d, y) {
    var _ = d[0] - y[0], S = d[1] - y[1];
    return _ * _ + S * S;
  }
  function A(d, y, _) {
    var S = y[0], I = y[1], E = _[0] - S, T = _[1] - I;
    if (E !== 0 || T !== 0) {
      var O = ((d[0] - S) * E + (d[1] - I) * T) / (E * E + T * T);
      O > 1 ? (S = _[0], I = _[1]) : O > 0 && (S += E * O, I += T * O);
    }
    return E = d[0] - S, T = d[1] - I, E * E + T * T;
  }
  function B(d, y, _, S, I, E, T, O) {
    var N = _ - d, $ = S - y, m = T - I, k = O - E, M = d - I, D = y - E, C = N * N + $ * $, X = N * m + $ * k, w = m * m + k * k, F = N * M + $ * D, P = m * M + k * D, Y = C * w - X * X, L, V, j, q, K = Y, G = Y;
    Y === 0 ? (V = 0, K = 1, q = P, G = w) : (V = X * P - w * F, q = C * P - X * F, V < 0 ? (V = 0, q = P, G = w) : V > K && (V = K, q = P + X, G = w)), q < 0 ? (q = 0, -F < 0 ? V = 0 : -F > C ? V = K : (V = -F, K = C)) : q > G && (q = G, -F + X < 0 ? V = 0 : -F + X > C ? V = K : (V = -F + X, K = C)), L = V === 0 ? 0 : V / K, j = q === 0 ? 0 : q / G;
    var Q = (1 - L) * d + L * _, W = (1 - L) * y + L * S, Z = (1 - j) * I + j * T, H = (1 - j) * E + j * O, ot = Z - Q, ft = H - W;
    return ot * ot + ft * ft;
  }
  function g(d, y) {
    return d[0] === y[0] ? d[1] - y[1] : d[0] - y[0];
  }
  function b(d) {
    d.sort(g);
    for (var y = [], _ = 0; _ < d.length; _++) {
      for (; y.length >= 2 && h(y[y.length - 2], y[y.length - 1], d[_]) <= 0; )
        y.pop();
      y.push(d[_]);
    }
    for (var S = [], I = d.length - 1; I >= 0; I--) {
      for (; S.length >= 2 && h(S[S.length - 2], S[S.length - 1], d[I]) <= 0; )
        S.pop();
      S.push(d[I]);
    }
    return S.pop(), y.pop(), y.concat(S);
  }
  return he.exports;
}
var Fr = Or();
const Tr = /* @__PURE__ */ vr(Fr);
function an(i, t = {}) {
  t.concavity = t.concavity || 1 / 0;
  const e = [];
  if (Pe(i, (s) => {
    e.push([s[0], s[1]]);
  }), !e.length)
    return null;
  const n = Tr(e, t.concavity);
  return n.length > 3 ? re([n], t.properties) : null;
}
const cn = Math.pow(2, -52), ue = new Uint32Array(512);
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
  static from(t, e = Xr, n = $r) {
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
    for (let E = 0; E < o; E++) {
      const T = t[2 * E], O = t[2 * E + 1];
      T < a && (a = T), O < l && (l = O), T > c && (c = T), O > h && (h = O), this._ids[E] = E;
    }
    const f = (a + c) / 2, u = (l + h) / 2;
    let p = 0, v = 0, x = 0;
    for (let E = 0, T = 1 / 0; E < o; E++) {
      const O = Te(f, u, t[2 * E], t[2 * E + 1]);
      O < T && (p = E, T = O);
    }
    const A = t[2 * p], B = t[2 * p + 1];
    for (let E = 0, T = 1 / 0; E < o; E++) {
      if (E === p) continue;
      const O = Te(A, B, t[2 * E], t[2 * E + 1]);
      O < T && O > 0 && (v = E, T = O);
    }
    let g = t[2 * v], b = t[2 * v + 1], d = 1 / 0;
    for (let E = 0; E < o; E++) {
      if (E === p || E === v) continue;
      const T = Nr(A, B, g, b, t[2 * E], t[2 * E + 1]);
      T < d && (x = E, d = T);
    }
    let y = t[2 * x], _ = t[2 * x + 1];
    if (d === 1 / 0) {
      for (let O = 0; O < o; O++)
        this._dists[O] = t[2 * O] - t[0] || t[2 * O + 1] - t[1];
      qt(this._ids, this._dists, 0, o - 1);
      const E = new Uint32Array(o);
      let T = 0;
      for (let O = 0, N = -1 / 0; O < o; O++) {
        const $ = this._ids[O], m = this._dists[$];
        m > N && (E[T++] = $, N = m);
      }
      this.hull = E.subarray(0, T), this.triangles = new Uint32Array(0), this.halfedges = new Int32Array(0);
      return;
    }
    if (xt(A, B, g, b, y, _) < 0) {
      const E = v, T = g, O = b;
      v = x, g = y, b = _, x = E, y = T, _ = O;
    }
    const S = Pr(A, B, g, b, y, _);
    this._cx = S.x, this._cy = S.y;
    for (let E = 0; E < o; E++)
      this._dists[E] = Te(t[2 * E], t[2 * E + 1], S.x, S.y);
    qt(this._ids, this._dists, 0, o - 1), this._hullStart = p;
    let I = 3;
    n[p] = e[x] = v, n[v] = e[p] = x, n[x] = e[v] = p, s[p] = 0, s[v] = 1, s[x] = 2, r.fill(-1), r[this._hashKey(A, B)] = p, r[this._hashKey(g, b)] = v, r[this._hashKey(y, _)] = x, this.trianglesLen = 0, this._addTriangle(p, v, x, -1, -1, -1);
    for (let E = 0, T = 0, O = 0; E < this._ids.length; E++) {
      const N = this._ids[E], $ = t[2 * N], m = t[2 * N + 1];
      if (E > 0 && Math.abs($ - T) <= cn && Math.abs(m - O) <= cn || (T = $, O = m, N === p || N === v || N === x)) continue;
      let k = 0;
      for (let w = 0, F = this._hashKey($, m); w < this._hashSize && (k = r[(F + w) % this._hashSize], !(k !== -1 && k !== n[k])); w++)
        ;
      k = e[k];
      let M = k, D;
      for (; D = n[M], xt($, m, t[2 * M], t[2 * M + 1], t[2 * D], t[2 * D + 1]) >= 0; )
        if (M = D, M === k) {
          M = -1;
          break;
        }
      if (M === -1) continue;
      let C = this._addTriangle(M, N, n[M], -1, -1, s[M]);
      s[N] = this._legalize(C + 2), s[M] = C, I++;
      let X = n[M];
      for (; D = n[X], xt($, m, t[2 * X], t[2 * X + 1], t[2 * D], t[2 * D + 1]) < 0; )
        C = this._addTriangle(X, N, D, s[N], -1, s[X]), s[N] = this._legalize(C + 2), n[X] = X, I--, X = D;
      if (M === k)
        for (; D = e[M], xt($, m, t[2 * D], t[2 * D + 1], t[2 * M], t[2 * M + 1]) < 0; )
          C = this._addTriangle(D, N, M, -1, s[M], s[D]), this._legalize(C + 2), s[D] = C, n[M] = M, I--, M = D;
      this._hullStart = e[N] = M, n[M] = e[X] = N, n[N] = X, r[this._hashKey($, m)] = N, r[this._hashKey(t[2 * M], t[2 * M + 1])] = M;
    }
    this.hull = new Uint32Array(I);
    for (let E = 0, T = this._hullStart; E < I; E++)
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
      const c = a - a % 3, h = l + (t + 1) % 3, f = c + (a + 2) % 3, u = e[o], p = e[t], v = e[h], x = e[f];
      if (Cr(
        s[2 * u],
        s[2 * u + 1],
        s[2 * p],
        s[2 * p + 1],
        s[2 * v],
        s[2 * v + 1],
        s[2 * x],
        s[2 * x + 1]
      )) {
        e[t] = x, e[a] = u;
        const B = n[f];
        if (B === -1) {
          let b = this._hullStart;
          do {
            if (this._hullTri[b] === f) {
              this._hullTri[b] = t;
              break;
            }
            b = this._hullPrev[b];
          } while (b !== this._hullStart);
        }
        this._link(t, B), this._link(a, n[o]), this._link(o, f);
        const g = c + (a + 1) % 3;
        r < ue.length && (ue[r++] = g);
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
function Te(i, t, e, n) {
  const s = i - e, r = t - n;
  return s * s + r * r;
}
function Cr(i, t, e, n, s, r, o, a) {
  const l = i - o, c = t - a, h = e - o, f = n - a, u = s - o, p = r - a, v = l * l + c * c, x = h * h + f * f, A = u * u + p * p;
  return l * (f * A - x * p) - c * (h * A - x * u) + v * (h * p - f * u) < 0;
}
function Nr(i, t, e, n, s, r) {
  const o = e - i, a = n - t, l = s - i, c = r - t, h = o * o + a * a, f = l * l + c * c, u = 0.5 / (o * c - a * l), p = (c * h - a * f) * u, v = (o * f - l * h) * u;
  return p * p + v * v;
}
function Pr(i, t, e, n, s, r) {
  const o = e - i, a = n - t, l = s - i, c = r - t, h = o * o + a * a, f = l * l + c * c, u = 0.5 / (o * c - a * l), p = i + (c * h - a * f) * u, v = t + (o * f - l * h) * u;
  return { x: p, y: v };
}
function qt(i, t, e, n) {
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
    Gt(i, s, r), t[i[e]] > t[i[n]] && Gt(i, e, n), t[i[r]] > t[i[n]] && Gt(i, r, n), t[i[e]] > t[i[r]] && Gt(i, e, r);
    const a = i[r], l = t[a];
    for (; ; ) {
      do
        r++;
      while (t[i[r]] < l);
      do
        o--;
      while (t[i[o]] > l);
      if (o < r) break;
      Gt(i, r, o);
    }
    i[e + 1] = i[o], i[o] = a, n - r + 1 >= o - e ? (qt(i, t, r, n), qt(i, t, e, o - 1)) : (qt(i, t, e, o - 1), qt(i, t, r, n));
  }
}
function Gt(i, t, e) {
  const n = i[t];
  i[t] = i[e], i[e] = n;
}
function Xr(i) {
  return i[0];
}
function $r(i) {
  return i[1];
}
class Yr {
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
class ln extends Yr {
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
function fn(i, t, e, n, s, r, o, a) {
  const l = xt(i, t, s, r, o, a), c = xt(e, n, s, r, o, a);
  if (l > 0 && c > 0 || l < 0 && c < 0)
    return !1;
  const h = xt(s, r, i, t, e, n), f = xt(o, a, i, t, e, n);
  return h > 0 && f > 0 || h < 0 && f < 0 ? !1 : l === 0 && c === 0 && h === 0 && f === 0 ? !(Math.max(s, o) < Math.min(i, e) || Math.max(i, e) < Math.min(s, o) || Math.max(r, a) < Math.min(t, n) || Math.max(t, n) < Math.min(r, a)) : !0;
}
class Rr {
  /**
   * The triangulation object from Delaunator.
   */
  del;
  constructor(t) {
    this.del = t;
  }
}
class De extends Rr {
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
    this.vertMap = new Uint32Array(s).fill(n), this.flips = new ln(r), this.consd = new ln(r);
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
      const p = _t(l), v = n[p];
      if (v === e)
        return this.protect(u), u;
      if (this.intersectSegments(t, e, v, f)) {
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
      const f = s[l], u = _t(l), p = _t(f), v = At(f);
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
          n[v],
          n[p]
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
        n[p]
      ) && (h === -1 && (h = u), h === u))
        throw new Error("Infinite loop: flipped diagonal still intersects");
      n[p] === e ? (c = p, l = h, h = -1) : this.intersectSegments(
        t,
        e,
        n[v],
        n[p]
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
    const { triangles: n, halfedges: s } = this.del, r = n.length / 3, o = (v, x, A) => {
      const B = t(x), g = t(A);
      return t(v).some((b) => B.includes(b) && g.includes(b));
    }, a = (v) => o(n[v * 3], n[v * 3 + 1], n[v * 3 + 2]), l = (v, x, A, B) => Math.sign(xt(v[x * 2], v[x * 2 + 1], v[A * 2], v[A * 2 + 1], v[B * 2], v[B * 2 + 1])), c = e.map((v) => {
      let x = 0;
      for (let A = 0; A < r; A++) x += l(v, n[A * 3], n[A * 3 + 1], n[A * 3 + 2]);
      return x < 0 ? -1 : 1;
    }), h = (v) => {
      if (this.consd.has(v)) return !1;
      const x = s[v];
      if (x === -1) return !1;
      const A = n[v], B = n[At(v)], g = n[_t(v)], b = n[_t(x)];
      return e.every((d, y) => l(d, g, A, b) === c[y] && l(d, b, B, g) === c[y]);
    };
    let f = 0, u = !0;
    for (; u; ) {
      u = !1;
      for (let v = 0; v < r; v++)
        if (a(v))
          for (let x = 0; x < 3; x++) {
            const A = v * 3 + x;
            if (!h(A)) continue;
            const B = s[A], g = n[A], b = n[At(A)], d = n[_t(A)], y = n[_t(B)];
            if (!(o(d, g, y) && o(y, b, d))) {
              this.protect(this.flipDiagonal(A)), f++, u = !0;
              break;
            }
          }
    }
    let p = 0;
    for (let v = 0; v < r; v++) a(v) && p++;
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
    return xt(
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
    return er(
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
    return t === n || t === s || e === n || e === s ? !1 : fn(
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
  static intersectSegments = fn;
}
function de(i, t, e) {
  return Ce(i, t, e).tin;
}
function Ce(i, t, e, n) {
  if (t || (t = []), typeof i != "object" || i.type !== "FeatureCollection")
    throw "Argument points must be FeatureCollection";
  if (!Array.isArray(t)) throw "Argument points must be Array of Array";
  const s = i.features.map(
    (f) => f.geometry.coordinates
  );
  let r = Zt.from(s), o = 0, a;
  if (r.triangles.length !== 0 && (t.length !== 0 || n)) {
    let f = new De(r);
    try {
      f.constrainAll(t);
    } catch (p) {
      if (!n?.allowUnusableBoundary) throw p;
      return { tin: bt([]), remaining: 0, hasBoundary: !1 };
    }
    const u = [];
    for (const p of n?.hull ?? [])
      try {
        f.constrainOne(p[0], p[1]), u.push(p);
      } catch {
        r = Zt.from(s), f = new De(r, [...t, ...u]);
      }
    n?.boundary && (a = Lr(f, n.boundary), a || (r = Zt.from(s), f = new De(r, [...t, ...u]))), n && ({ remaining: o } = f.forbidGroupTriangles(
      n.groupsOf,
      n.planes
    ), o -= a?.size ?? 0);
  }
  const l = [];
  for (let f = 0; f < r.triangles.length; f += 3)
    a?.has(f / 3) || l.push([r.triangles[f], r.triangles[f + 1], r.triangles[f + 2]]);
  const c = ["a", "b", "c"];
  return { tin: bt(
    l.map((f) => {
      const u = {}, p = f.map((v, x) => {
        const A = i.features[v], B = A.geometry.coordinates, g = [B[0], B[1]];
        return B.length === 3 ? g[2] = B[2] : u[c[x]] = A.properties[e], g;
      });
      return p[3] = p[0], re([p], u);
    })
  ), remaining: o, hasBoundary: a !== void 0 };
}
function Lr(i, t) {
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
function Vr(i) {
  const t = /* @__PURE__ */ new Set(), e = [];
  if (i.forEach(([l, c], h) => {
    const f = `${l}:${c}`;
    t.has(f) || (t.add(f), e.push({ i: h, x: l, y: c }));
  }), e.length < 3) return [];
  const n = (l, c, h) => xt(l.x, l.y, c.x, c.y, h.x, h.y), s = [...e].sort((l, c) => l.x - c.x || l.y - c.y), r = (l) => {
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
    const c = o[l], h = o[(l + 1) % o.length], f = h.x - c.x, u = h.y - c.y, p = f * f + u * u, v = e.filter((A) => A !== c && A !== h && n(c, h, A) === 0).map((A) => ({ r: A, t: ((A.x - c.x) * f + (A.y - c.y) * u) / p })).filter(({ t: A }) => A > 0 && A < 1).sort((A, B) => A.t - B.t).map(({ r: A }) => A), x = [c, ...v, h];
    for (let A = 0; A + 1 < x.length; A++) a.push([x[A].i, x[A + 1].i]);
  }
  return a;
}
function hn(i, t) {
  const e = ([n, s]) => {
    const [r, o] = t[n], [a, l] = t[s];
    if (r === a && o === l) return !1;
    let c = 0;
    for (const [h, f] of t) {
      const u = Math.sign(xt(r, o, a, l, h, f));
      if (u !== 0) {
        if (c === 0) c = u;
        else if (u !== c) return !1;
      }
    }
    return !0;
  };
  return Vr(i).filter(e);
}
function Jt(i, t, e) {
  return Rt(i, { target: { geom: t, index: e } });
}
function Qt(i) {
  return Rt(i.properties.target.geom, {
    target: {
      geom: i.geometry.coordinates,
      index: i.properties.target.index
    }
  });
}
function un(i, t) {
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
    }, u = bt([
      re([h], f)
    ]);
    return [c, u];
  }).reduce(
    (s, r) => (s[0].push(r[0]), s[1].push(r[1]), s),
    [[], []]
  );
}
const qr = [0.1, 0.15, 0.225, 0.34, 0.5];
function jr(i, t) {
  return t ? i.hasBoundary !== t.hasBoundary ? i.hasBoundary : i.diagnostics.boundaryTriangleFlips < t.diagnostics.boundaryTriangleFlips : !0;
}
function dn(i, t, e) {
  return Math.sign(xt(i[0], i[1], t[0], t[1], e[0], e[1]));
}
function ye(i, t = -1) {
  let e = 0;
  for (const n of i.features) {
    const { a: s, b: r, c: o } = n.properties;
    if (![s, r, o].some(
      ({ index: f }) => typeof f == "string" && f.startsWith("b")
    ))
      continue;
    const [a, l, c] = n.geometry.coordinates[0];
    dn(a, l, c) * dn(s.geom, r.geom, o.geom) * t <= 0 && e++;
  }
  return e;
}
function pn(i, t, e) {
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
function mn(i, t, e, n, s) {
  const { minx: r, maxx: o, miny: a, maxy: l, centroid: c } = i, h = o - r, f = l - a, u = e.forw.length, p = Array.from({ length: u }, () => []);
  let v = 1;
  for (const [y, _] of e.edges)
    y < n && p[y].push(v), p[_].push(v), _ < n && v++;
  const x = (y) => y.slice(0, u).map(({ geometry: _ }) => _.coordinates), A = {
    forw: x(e.forw),
    bakw: x(e.bakw)
  }, B = {
    forw: hn(A.forw, A.bakw),
    bakw: hn(A.bakw, A.forw)
  }, g = [0], b = (y) => y >= u ? g : p[y];
  let d;
  for (const y of qr) {
    const _ = t(
      {
        ...i,
        minx: r - y * h,
        maxx: o + y * h,
        miny: a - y * f,
        maxy: l + y * f
      },
      !0
    );
    if (s && (_.length < 4 || !_.every(({ bakw: F }) => F.every(Number.isFinite)))) continue;
    const S = _.map(
      ({ forw: F, bakw: P }, Y) => Jt(F, P, `b${Y}`)
    ), I = bt([...e.forw, ...S]), E = bt([
      ...e.bakw,
      ...S.map(Qt)
    ]), T = [I, E].map(
      ({ features: F }) => Float64Array.from(
        F.flatMap(
          ({
            geometry: {
              coordinates: [P, Y]
            }
          }) => [P, Y]
        )
      )
    ), N = s !== void 0 || pn(
      _.map((F) => F.forw),
      c.forw,
      -1
    ) && pn(
      _.map((F) => F.bakw),
      c.bakw,
      1
    ) ? _.map((F, P) => [
      u + P,
      u + (P + 1) % _.length
    ]) : void 0, $ = { groupsOf: b, planes: T, boundary: N, allowUnusableBoundary: s !== void 0 }, m = Ce(I, e.edges, "target", {
      ...$,
      hull: B.forw
    }), k = Ce(E, e.edges, "target", {
      ...$,
      hull: B.bakw
    }), M = m.tin, D = k.tin, C = s?.orientation ?? -1, X = ye(M, C) + ye(D, C), w = {
      vertices: _,
      forw: M,
      bakw: D,
      diagnostics: {
        margin: y,
        boundaryTriangleFlips: X,
        remainingForbiddenTriangles: m.remaining + k.remaining
      },
      hasMapBoundary: m.hasBoundary,
      hasBoundary: m.hasBoundary && k.hasBoundary
    };
    if (s) {
      if (s.accept(w)) return w;
      continue;
    }
    if (X === 0 && w.hasBoundary)
      return w;
    jr(w, d) && (d = w);
  }
  return d;
}
const gn = 1e-9;
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
function Gr(i, t, e) {
  const { perQuad: n, aggregate: s } = Ur(i, t), r = n.every((l) => l.length > 0), a = (e === "birdeye" ? r ? n : [s] : [s]).map((l) => zr(l));
  return a.length === 1 ? [a[0], a[0], a[0], a[0]] : a;
}
function Kr(i, t) {
  let e = 0;
  return i[0] > t[0] && (e += 1), i[1] > t[1] && (e += 2), e;
}
function Jr(i, t, e) {
  const n = [
    i[0] - t.forw[0],
    i[1] - t.forw[1]
  ], r = Math.sqrt(n[0] ** 2 + n[1] ** 2) / e[0], o = Math.atan2(n[0], n[1]) - e[1];
  return [
    t.bakw[0] + r * Math.sin(o),
    t.bakw[1] - r * Math.cos(o)
  ];
}
function Qr(i, t, e, n) {
  const s = t[0] - i[0], r = t[1] - i[1];
  if (Math.abs(s) < 1e-12 && Math.abs(r) < 1e-12) return null;
  const o = n[0] - e[0], a = n[1] - e[1], l = e[0] - i[0], c = e[1] - i[1], h = s * a - r * o;
  if (Math.abs(h) < 1e-12) return null;
  const f = (l * a - c * o) / h, u = (l * r - c * s) / h;
  return f <= 1e-10 || u < -1e-10 || u > 1 + 1e-10 ? null : { t: f, point: [i[0] + f * s, i[1] + f * r] };
}
function Wr(i, t, e) {
  const n = e.length;
  let s = -1 / 0, r = null;
  for (let o = 0; o < n; o++) {
    const a = (o + 1) % n, l = Qr(
      i,
      t,
      e[o].bakw,
      e[a].bakw
    );
    l && l.t > s && (s = l.t, r = l.point);
  }
  return r;
}
function wn(i, t) {
  const n = Math.atan2(i[0] - t[0], i[1] - t[1]) * (180 / Math.PI);
  return n < 0 ? n + 360 : n;
}
function yn(i, t, e, n, s, r) {
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
function vn(i, t, e) {
  const n = i.length, s = new Array(n).fill(1);
  for (const r of t)
    for (let o = 0; o < n; o++) {
      const a = (o + 1) % n, l = Ve([i[o].bakw, i[a].bakw]), c = Ve([e.bakw, r.bakw]), h = yr(l, c);
      if (h.features.length > 0 && h.features[0].geometry) {
        const f = h.features[0], u = Math.sqrt(
          Math.pow(r.bakw[0] - e.bakw[0], 2) + Math.pow(r.bakw[1] - e.bakw[1], 2)
        ), p = Math.sqrt(
          Math.pow(f.geometry.coordinates[0] - e.bakw[0], 2) + Math.pow(f.geometry.coordinates[1] - e.bakw[1], 2)
        ), v = u / p;
        v > s[o] && (s[o] = v), v > s[a] && (s[a] = v);
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
function $e(i, t, e, n) {
  const { convexBuf: s, centroid: r, allGcps: o, minx: a, maxx: l, miny: c, maxy: h } = i, f = n ? void 0 : Gr(s, r, t), p = [
    [a, c],
    [l, c],
    [l, h],
    [a, h]
  ].map((S) => ({
    forw: S,
    bakw: n ? n(S) : Jr(
      S,
      r,
      f[Kr(S, r.forw)]
    )
  }));
  if (p.sort(
    (S, I) => Math.atan2(S.forw[0] - r.forw[0], S.forw[1] - r.forw[1]) - Math.atan2(I.forw[0] - r.forw[0], I.forw[1] - r.forw[1])
  ), n || vn(p, o, r), !e) return p;
  const v = 4, x = p.map(
    (S) => Math.atan2(S.forw[0] - r.forw[0], S.forw[1] - r.forw[1])
  ), A = p.map(
    (S) => Math.atan2(
      S.bakw[0] - r.bakw[0],
      -(S.bakw[1] - r.bakw[1])
    )
  );
  function B(S) {
    for (let I = 0; I < v; I++) {
      const E = (I + 1) % v, T = x[I], O = I < v - 1 ? x[E] : x[E] + 2 * Math.PI;
      let N = S;
      for (; N < T; ) N += 2 * Math.PI;
      for (; N >= T + 2 * Math.PI; ) N -= 2 * Math.PI;
      if (N >= T && N < O)
        return { i: I, j: E, frac: (N - T) / (O - T) };
    }
    return { i: 0, j: 1, frac: 0 };
  }
  function g(S) {
    const { i: I, j: E, frac: T } = B(S), O = A[I];
    let $ = A[E] - O;
    for (; $ > Math.PI; ) $ -= 2 * Math.PI;
    for (; $ < -Math.PI; ) $ += 2 * Math.PI;
    return O + T * $;
  }
  const b = new Set(
    p.map(
      (S) => Math.floor(wn(S.forw, r.forw) / 10) % 36
    )
  ), d = o.map((S) => ({
    forw: S.forw,
    bakw: S.bakw,
    angleDeg: wn(S.forw, r.forw),
    forwDist: Math.hypot(S.forw[0] - r.forw[0], S.forw[1] - r.forw[1])
  })), y = [];
  for (let S = 0; S < 36; S++) {
    if (b.has(S)) continue;
    const I = S * 10, E = d.filter((M) => {
      if (M.forwDist === 0) return !1;
      const D = ((M.angleDeg - I) % 360 + 360) % 360;
      return D < 10 + gn || D > 360 - gn;
    });
    let T = null;
    if (E.length > 0) {
      const M = E.reduce((D, C) => C.forwDist > D.forwDist ? C : D);
      T = yn(r.forw, M.forw, a, l, c, h);
    }
    if (!T) {
      const M = (I + 5) % 360 * (Math.PI / 180), D = [
        r.forw[0] + Math.sin(M),
        r.forw[1] + Math.cos(M)
      ];
      T = yn(r.forw, D, a, l, c, h);
    }
    if (!T || y.some((M) => M.forw[0] === T[0] && M.forw[1] === T[1])) continue;
    if (n) {
      y.push({ forw: T, bakw: n(T) });
      continue;
    }
    const O = [T[0] - r.forw[0], T[1] - r.forw[1]], N = Math.atan2(O[0], O[1]), $ = g(N), m = [
      r.bakw[0] + Math.sin($),
      r.bakw[1] - Math.cos($)
    ], k = Wr(r.bakw, m, p);
    k && y.push({ forw: T, bakw: k });
  }
  const _ = [...p, ...y];
  return _.sort(
    (S, I) => Math.atan2(S.forw[0] - r.forw[0], S.forw[1] - r.forw[1]) - Math.atan2(I.forw[0] - r.forw[0], I.forw[1] - r.forw[1])
  ), n || vn(_, o, r), _;
}
function Hr(i, t = !1) {
  return $e(i, "plain", t);
}
function Zr(i, t = !1) {
  return $e(i, "birdeye", t);
}
function ti(i, t) {
  const e = /* @__PURE__ */ new Set();
  return $e(i, "plain", !0, t).filter(({ forw: [n, s] }) => {
    const r = `${n}:${s}`;
    return e.has(r) ? !1 : (e.add(r), !0);
  });
}
function Ci(i) {
  return Dn(i, 1 / 0);
}
const bn = 1e5, ei = 16;
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
    (r != this._xx.length || this._xx.length != this._yy.length) && Yt("ArcCollection#initXYData() Counting error"), this.initBounds(), this._arcIter = new Mi(this._xx, this._yy);
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
      l = n[f], l > 0 && (c = f * 4, h = Si(t, e, a, l), r[c++] = h[0], r[c++] = h[1], r[c++] = h[2], r[c] = h[3], a += l, o.mergeBounds(h));
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
    const e = this.getBounds(), n = e.ymin || 0, s = (e.ymax || 0) - n, r = this.calcSegmentIntersectionStripeCount(), o = new Uint32Array(r), a = r > 1 ? (b) => Math.floor((r - 1) * (b - n) / s) : () => 0, l = r + 1;
    let c;
    this.forEachSegment(
      (b, d, y, _) => {
        let S = a(_[b]);
        const I = a(_[d]);
        let E = 0;
        for (; o[S] = o[S] + 2, S != I; )
          E++, E > l && Yt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${r}`,
            `s1=${S}`,
            `s2=${I}`
          ), S += I > S ? 1 : -1;
      }
    );
    const h = this.getUint32Array(oi(o));
    let f = 0;
    const u = [];
    ai(o, (b) => {
      const d = f;
      f += b, u.push(h.subarray(d, f));
    }), ci(o, 0), this.forEachSegment(
      (b, d, y, _) => {
        let S = a(_[b]);
        const I = a(_[d]);
        let E, T, O = 0;
        for (; E = o[S], o[S] = E + 2, T = u[S], T[E] = b, T[E + 1] = d, S != I; )
          O++, O > l && Yt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${r}`,
            `s1=${S}`,
            `s2=${I}`
          ), S += I > S ? 1 : -1;
      }
    );
    const p = this.getVertexData(), v = t * ei;
    let x = 0;
    const A = /* @__PURE__ */ new Set(), B = /* @__PURE__ */ new Map(), g = (b) => {
      x++;
      const d = _i(b);
      return A.has(d) || (A.add(d), B.set(`${b.x}:${b.y}`, b)), B.size >= t || x >= v;
    };
    if (p.xx && p.yy)
      for (c = 0; c < r && !li(u[c], p.xx, p.yy, g); c++)
        ;
    return Array.from(B.values());
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
  let r, o, a, l, c, h, f, u, p, v, x, A, B, g, b, d, y;
  for (vi(t, i), d = 0; d < s; ) {
    for (r = i[d], o = i[d + 1], c = t[r], h = t[o], p = e[r], v = e[o], y = d; y < s && (y += 2, a = i[y], f = t[a], !(h < f)); ) {
      if (x = e[a], l = i[y + 1], u = t[l], A = e[l], p >= x) {
        if (p > A && v > x && v > A) continue;
      } else if (p < A && v < x && v < A) continue;
      if (!(r == a || r == l || o == a || o == l) && (B = fi(
        c,
        p,
        h,
        v,
        f,
        x,
        u,
        A
      ), B && (g = [r, o], b = [a, l], n(_n(B, g, b, t, e)) || B.length == 4 && n(_n(B.slice(2), g, b, t, e)))))
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
  return Wt(i, t, e, n, s, r) * Wt(i, t, e, n, o, a) <= 0 && Wt(s, r, o, a, i, t) * Wt(s, r, o, a, e, n) <= 0;
}
function Wt(i, t, e, n, s, r) {
  return Cn(i - s, t - r, e - s, n - r);
}
function Cn(i, t, e, n) {
  return i * n - t * e;
}
function ui(i, t, e, n, s, r, o, a) {
  let l = pe(i, t, e, n, s, r, o, a), c;
  return l && (c = pi(l[0], l[1], i, t, e, n, s, r, o, a), c == 1 ? l = pe(e, n, i, t, s, r, o, a) : c == 2 ? l = pe(s, r, o, a, i, t, e, n) : c == 3 && (l = pe(o, a, s, r, i, t, e, n))), l && gi(l, i, t, e, n, s, r, o, a), l;
}
function pe(i, t, e, n, s, r, o, a) {
  const l = Cn(e - i, n - t, o - s, a - r), c = 1e-18;
  let h;
  if (l === 0) return null;
  const f = Wt(s, r, o, a, i, t) / l;
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
  bi(i, t), Nn(i, t, 0, t.length - 2);
}
function bi(i, t) {
  for (let e = 0, n = t.length; e < n; e += 2)
    i[t[e]] > i[t[e + 1]] && xi(t, e, e + 1);
}
function xi(i, t, e) {
  const n = i[t];
  i[t] = i[e], i[e] = n;
}
function Nn(i, t, e, n) {
  let s = e, r = n, o, a;
  for (; s < n; ) {
    for (o = i[t[e + n >> 2 << 1]]; s <= r; ) {
      for (; i[t[s]] < o; ) s += 2;
      for (; i[t[r]] > o; ) r -= 2;
      s <= r && (a = t[s], t[s] = t[r], t[r] = a, a = t[s + 1], t[s + 1] = t[r + 1], t[r + 1] = a, s += 2, r -= 2);
    }
    if (r - e < 40 ? xn(i, t, e, r) : Nn(i, t, e, r), n - s < 40) {
      xn(i, t, s, n);
      return;
    }
    e = s, r = n;
  }
}
function xn(i, t, e, n) {
  let s, r;
  for (let o = e + 2; o <= n; o += 2) {
    s = t[o], r = t[o + 1];
    let a;
    for (a = o - 2; a >= e && i[s] < i[t[a]]; a -= 2)
      t[a + 2] = t[a], t[a + 3] = t[a + 1];
    t[a + 2] = s, t[a + 3] = r;
  }
}
function _n(i, t, e, n, s) {
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
class Mi {
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
function Si(i, t, e, n) {
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
function ve(i) {
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
  const n = ve(t.forw), s = ve(t.bakw);
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
function Sn(i, t, e) {
  const n = ve(t.forw), s = ve(t.bakw);
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
function Ht(i) {
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
  const h = vt(c.geom);
  let f = !1, u = !1;
  for (let p = 0; p <= 1; p++) {
    const v = n[p];
    if (!v) continue;
    const x = [String(v.prop.index), String(l.prop.index)].sort().join("-"), A = s[x];
    if (!A || A.length < 2) continue;
    const B = A.find(
      (O) => O.bakw !== r[o].bakw
    );
    if (!B) continue;
    const b = Ht(B.bakw).find(
      (O) => String(O.prop.index) !== String(v.prop.index) && String(O.prop.index) !== String(l.prop.index)
    );
    if (!b) continue;
    f = !0;
    const d = vt(b.geom), y = vt(v.geom), _ = vt(l.geom), S = _[0] - y[0], I = _[1] - y[1], E = S * (h[1] - y[1]) - I * (h[0] - y[0]), T = S * (d[1] - y[1]) - I * (d[0] - y[0]);
    if (E * T > 0) {
      u = !0;
      break;
    }
  }
  return f && !u;
}
function Ii(i, t, e, n) {
  if (!i && !t) return !1;
  if (e[0] && e[1] && n[0] && n[1]) {
    const s = n.map((h) => vt(h.geom)), r = e.map((h) => vt(h.geom)), o = s[1][0] - s[0][0], a = s[1][1] - s[0][1], l = o * (r[0][1] - s[0][1]) - a * (r[0][0] - s[0][0]), c = o * (r[1][1] - s[0][1]) - a * (r[1][0] - s[0][0]);
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
      const u = Ht(h[0].bakw), p = Ht(h[1].bakw), v = Ht(h[0].forw), x = Ht(h[1].forw), A = f.map(
        (w) => u.find((F) => `${F.prop.index}` === w) || p.find((F) => `${F.prop.index}` === w)
      ), B = f.map(
        (w) => v.find((F) => `${F.prop.index}` === w) || x.find((F) => `${F.prop.index}` === w)
      );
      if (A.some((w) => !w) || B.some((w) => !w))
        continue;
      const g = [u, p].map(
        (w) => w.find((F) => !f.includes(`${F.prop.index}`))
      ), b = [v, x].map(
        (w) => w.find((F) => !f.includes(`${F.prop.index}`))
      );
      if (g.some((w) => !w) || b.some((w) => !w))
        continue;
      const d = h[0].bakw.geometry.coordinates[0].slice(0, 3).map((w) => vt(w)), y = h[1].bakw.geometry.coordinates[0].slice(0, 3).map((w) => vt(w)), _ = h[0].forw.geometry.coordinates[0].slice(0, 3).map((w) => vt(w)), S = h[1].forw.geometry.coordinates[0].slice(0, 3).map((w) => vt(w)), I = ge(d), E = ge(y), T = ge(_), O = ge(S), N = Ai(
        I,
        E,
        g,
        A,
        t,
        h
      ), $ = Ii(
        T,
        O,
        g,
        A
      );
      if (!(N || $ || kn(
        vt(g[0].geom),
        y
      ) || kn(
        vt(g[1].geom),
        d
      )))
        continue;
      const k = B.map(
        (w) => vt(w.geom)
      ), M = b.map(
        (w) => vt(w.geom)
      ), D = Oi([
        ...k,
        ...M
      ]), C = Fi(D), X = En(
        k[0],
        k[1],
        M[0]
      ) + En(
        k[0],
        k[1],
        M[1]
      );
      Ne(C, X) && (Sn(t, h[0], i), Sn(t, h[1], i), A.forEach((w) => {
        if (!w) return;
        const F = [
          w.geom,
          g[0].geom,
          g[1].geom,
          w.geom
        ], P = {
          a: w.prop,
          b: g[0].prop,
          c: g[1].prop
        }, Y = re([F], P), L = Bn(Y);
        Pn(t, {
          forw: L,
          bakw: Y
        }, i);
      }), l = !0, o = !0);
    }
    if (!l) break;
  }
  return o;
}
function vt(i) {
  return [i[0], i[1]];
}
function kn(i, t) {
  const [e, n] = t[0], [s, r] = t[1], [o, a] = t[2], l = o - e, c = a - n, h = s - e, f = r - n, u = i[0] - e, p = i[1] - n, v = l * l + c * c, x = l * h + c * f, A = l * u + c * p, B = h * h + f * f, g = h * u + f * p, b = v * B - x * x;
  if (b === 0) return !1;
  const d = 1 / b, y = (B * A - x * g) * d, _ = (v * g - x * A) * d, S = 1e-9;
  return y >= -S && _ >= -S && y + _ <= 1 + S;
}
function Oi(i) {
  const t = i.map((o) => o.slice()).filter(
    (o, a, l) => l.findIndex(
      (c) => Ne(c[0], o[0]) && Ne(c[1], o[1])
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
function Fi(i) {
  if (i.length < 3) return 0;
  let t = 0;
  for (let e = 0; e < i.length; e++) {
    const [n, s] = i[e], [r, o] = i[(e + 1) % i.length];
    t += n * o - r * s;
  }
  return Math.abs(t) / 2;
}
function En(i, t, e) {
  return Math.abs(
    (i[0] * (t[1] - e[1]) + t[0] * (e[1] - i[1]) + e[0] * (i[1] - t[1])) / 2
  );
}
function Ne(i, t, e = 1e-9) {
  return Math.abs(i - t) <= e;
}
const An = 2.00704, In = 3.00001;
class lt extends Ln {
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
    if (super(), t.bounds ? this.setBounds(t.bounds) : (this.setWh(t.wh), this.vertexMode = t.vertexMode || lt.VERTEX_PLAIN), this.strictMode = t.strictMode || lt.MODE_AUTO, this.yaxisMode = t.yaxisMode || lt.YAXIS_INVERT, this.importance = t.importance || 0, this.priority = t.priority || 0, this.stateFull = t.stateFull || !1, this.useV2Algorithm = t.useV2Algorithm ?? !1, t.outerTransform === "worldFile") {
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
    return this.useV2Algorithm ? An : In;
  }
  /**
   * 制御点（GCP: Ground Control Points）を設定します。
   * 指定した点群に合わせて内部のTINキャッシュをリセットします。
   */
  setPoints(t) {
    this.yaxisMode === lt.YAXIS_FOLLOW && (t = t.map((e) => [
      e[0],
      [e[1][0], -1 * e[1][1]]
    ])), this.points = t, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * エッジ（制約線）を設定します。
   * 制約線を正規化した上で、依存するキャッシュをリセットします。
   */
  setEdges(t = []) {
    this.edges = qn(t), this.edgeNodes = void 0, this.tins = void 0, this.indexedTins = void 0;
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
    o.push(t[0]), this.boundsPolygon = re([o]), this.xy = [e, s], this.wh = [n - e, r - s], this.vertexMode = lt.VERTEX_PLAIN, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 現在の設定を永続化可能な形式にコンパイルします
   */
  getCompiled() {
    const t = {};
    if (t.version = this.useV2Algorithm ? An : In, t.points = this.points, t.weight_buffer = {}, this.compiledOuter?.outerTransform === "worldFile")
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
    }), this.strict_status === lt.STATUS_LOOSE ? (t.tins_points[1] = [], this.tins.bakw.features.map((e) => {
      t.tins_points[1].push(
        ["a", "b", "c"].map(
          (n) => e.properties[n].index
        )
      );
    })) : this.strict_status === lt.STATUS_ERROR && this.kinks?.bakw && (t.kinks_points = this.kinks.bakw.features.map(
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
  calculateStrictTin(t = bn) {
    const e = this.tins.forw.features.map(
      (o) => Bn(o)
    );
    this.tins.bakw = bt(e);
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
    r[0].length === 0 && r[1].length === 0 ? (this.strict_status = lt.STATUS_STRICT, delete this.kinks) : (this.strict_status = lt.STATUS_ERROR, this.kinks = {
      forw: bt(r[0]),
      bakw: bt(r[1])
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
      const r = this.points[s][0], o = this.points[s][1], a = Jt(r, o, s);
      t.forw.push(a), t.bakw.push(Qt(a));
    }
    const e = [];
    let n = 0;
    this.edgeNodes = [], this.edges || (this.edges = []);
    for (let s = 0; s < this.edges.length; s++) {
      const r = this.edges[s][2], o = Object.assign([], this.edges[s][0]), a = Object.assign([], this.edges[s][1]);
      if (Ti(r, this.points.length, s), o.length === 0 && a.length === 0) {
        e.push(r);
        continue;
      }
      o.unshift(this.points[r[0]][0]), o.push(this.points[r[1]][0]), a.unshift(this.points[r[0]][1]), a.push(this.points[r[1]][1]);
      const l = [o, a].map((c) => {
        const h = c.map((u, p, v) => {
          if (p === 0) return 0;
          const x = v[p - 1];
          return Math.sqrt(
            Math.pow(u[0] - x[0], 2) + Math.pow(u[1] - x[1], 2)
          );
        }), f = h.reduce((u, p, v) => v === 0 ? [0] : (u.push(u[v - 1] + p), u), []);
        return f.map((u, p, v) => {
          const x = u / v[v.length - 1];
          return [c[p], h[p], f[p], x];
        });
      });
      l.map((c, h) => {
        const f = l[h ? 0 : 1];
        return c.filter((u, p) => !(p === 0 || p === c.length - 1 || u[4] === "handled")).flatMap((u) => {
          const p = u[0], v = u[3], x = f.reduce(
            (A, B, g, b) => {
              if (A) return A;
              const d = b[g + 1];
              if (B[3] === v)
                return B[4] = "handled", [B];
              if (B[3] < v && d && d[3] > v)
                return [B, d];
            },
            void 0
          );
          if (x && x.length === 1)
            return h === 0 ? [[p, x[0][0], v]] : [[x[0][0], p, v]];
          if (x && x.length === 2) {
            const A = x[0], B = x[1], g = (v - A[3]) / (B[3] - A[3]), b = [
              (B[0][0] - A[0][0]) * g + A[0][0],
              (B[0][1] - A[0][1]) * g + A[0][1]
            ];
            return h === 0 ? [[p, b, v]] : [[b, p, v]];
          }
          return [];
        });
      }).reduce((c, h) => c.concat(h), []).sort((c, h) => c[2] < h[2] ? -1 : 1).map((c, h, f) => {
        this.edgeNodes[n] = [
          c[0],
          c[1]
        ];
        const u = Jt(
          c[0],
          c[1],
          `e${n}`
        );
        n++, t.forw.push(u), t.bakw.push(Qt(u)), h === 0 ? e.push([r[0], t.forw.length - 1]) : e.push([
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
    t !== lt.MODE_STRICT && t !== lt.MODE_LOOSE && (t = lt.MODE_AUTO);
    const e = !this.useV2Algorithm, n = this.requestedWorldFile;
    if (n && !e) throw new Error("V2 では world file 外周を使えません");
    let s, r, o, a, l;
    if (e) {
      if (this.bounds) {
        const O = this.boundsPolygon;
        if (!O) throw new Error("Internal error: bounds is set but boundsPolygon is missing");
        if (!this.points.every(
          ($) => Ge($[0], O)
        )) throw "SOME POINTS OUTSIDE";
      }
      s = this.generatePointsSet(), { minx: r, maxx: o, miny: a, maxy: l } = this.computeGcpBbox();
    } else {
      const O = this.validateAndPrepareInputs();
      s = O.pointsSet, r = O.minx, o = O.maxx, a = O.miny, l = O.maxy;
    }
    const c = {
      forw: bt(s.forw),
      bakw: bt(s.bakw)
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
    const u = xr(c.forw), p = an(c.forw);
    if (!p) throw "TOO LINEAR2";
    const v = {}, x = p.geometry.coordinates[0];
    let A;
    try {
      A = x.map((O) => ({
        forw: O,
        bakw: xe(Rt(O), h)
      })), A.forEach((O) => {
        v[`${O.forw[0]}:${O.forw[1]}`] = O;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const B = an(c.bakw);
    if (!B) throw "TOO LINEAR2";
    const g = B.geometry.coordinates[0];
    try {
      A = g.map((O) => ({
        bakw: O,
        forw: xe(Rt(O), f)
      })), A.forEach((O) => {
        v[`${O.forw[0]}:${O.forw[1]}`] = O;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const b = {
      forw: u.geometry.coordinates,
      bakw: xe(u, h)
    }, d = Jt(b.forw, b.bakw, "c");
    this.centroid = {
      forw: d,
      bakw: Qt(d)
    };
    const y = [
      ...this.points.map((O) => ({ forw: O[0], bakw: O[1] })),
      ...(this.edgeNodes ?? []).map((O) => ({ forw: O[0], bakw: O[1] }))
    ], _ = {
      convexBuf: v,
      centroid: b,
      allGcps: y,
      minx: r,
      maxx: o,
      miny: a,
      maxy: l
    };
    if (n) {
      this.stateTriangle = void 0;
      const O = this.yaxisMode === lt.YAXIS_FOLLOW, N = O ? 1 : -1, $ = mn(
        _,
        (m) => ti(m, (k) => {
          const [M, D] = jn(n, k);
          return [M, O ? -D : D];
        }),
        s,
        this.points.length,
        {
          orientation: N,
          accept: (m) => m.hasMapBoundary ? (this.buildTin(s, m.vertices, t, m), (this.strict_status !== lt.STATUS_LOOSE || m.hasBoundary) && ye(this.tins.forw, N) === 0 && ye(this.tins.bakw, N) === 0) : !1
        }
      );
      if ($) {
        this.compiledOuter = {
          outerTransform: "worldFile",
          worldFile: n,
          vertices_points: $.vertices.map(({ forw: C, bakw: X }) => [C, X])
        };
        const { centroid: m, xy: k, wh: M, kinks: D } = this;
        super.setCompiled(this.getCompiled()), Object.assign(this, { centroid: m, xy: k, wh: M, kinks: D }), this.lastBoundaryDiagnostics = {
          ...$.diagnostics,
          requestedOuterTransform: "worldFile",
          outerTransform: "worldFile"
        };
        return;
      }
      this.compiledOuter = { outerTransform: "extrapolate" }, this.outerTransform = "extrapolate", this.worldFile = void 0;
    }
    const S = this.vertexMode === lt.VERTEX_BIRDEYE ? Zr : Hr, I = e ? mn(_, S, s, this.points.length) : void 0, E = I?.vertices ?? S(_, !1), T = this.buildTin(s, E, t, I);
    this.vertices_params = {
      forw: un(T.forw, this.centroid.forw),
      bakw: un(T.bakw, this.centroid.bakw)
    }, this.addIndexedTin(), this.pointsWeightBuffer = {}, this.lastBoundaryDiagnostics = I?.diagnostics, n && this.lastBoundaryDiagnostics && (this.lastBoundaryDiagnostics = {
      ...this.lastBoundaryDiagnostics,
      requestedOuterTransform: "worldFile",
      outerTransform: "extrapolate",
      fallbackReason: "boundaryFlips"
    });
  }
  /** 補助頂点を含め、strictMode に従って実際に使う両方向の三角網を組む。 */
  buildTin(t, e, n, s) {
    const r = {
      forw: [],
      bakw: []
    };
    for (let o = 0; o < e.length; o++) {
      const a = e[o].forw, l = e[o].bakw, c = Jt(a, l, `b${o}`), h = Qt(c);
      r.forw.push(c), r.bakw.push(h);
    }
    return this.pointsSet = {
      forw: bt([...t.forw, ...r.forw]),
      bakw: bt([...t.bakw, ...r.bakw]),
      edges: t.edges
    }, this.tins = {
      forw: Le(
        s?.forw ?? de(this.pointsSet.forw, t.edges, "target")
      )
    }, (n === lt.MODE_STRICT || n === lt.MODE_AUTO) && this.calculateStrictTin(
      n === lt.MODE_AUTO ? 1 : bn
    ), (n === lt.MODE_LOOSE || n === lt.MODE_AUTO && this.strict_status === lt.STATUS_ERROR) && (this.tins.bakw = Le(
      s?.bakw ?? de(this.pointsSet.bakw, t.edges, "target")
    ), delete this.kinks, this.strict_status = lt.STATUS_LOOSE), r;
  }
  /**
   * 非同期ラッパーを提供します。
   * 互換性のために Promise ベースの API を維持しますが、内部処理は同期的です。
   */
  async updateTinAsync() {
    this.updateTin();
  }
}
function Ti(i, t, e) {
  const n = (s) => Number.isInteger(s) && s >= 0 && s < t;
  if (!Array.isArray(i) || !n(i[0]) || !n(i[1]))
    throw new Error(
      `Invalid edge at edges[${e}]: start/end ${JSON.stringify(i)} must be integer indices of points (0 to ${t - 1})`
    );
}
export {
  lt as Tin,
  de as constrainedTin,
  Qt as counterPoint,
  Jt as createPoint,
  lt as default,
  Ci as findIntersections,
  An as format_version,
  Pn as insertSearchIndex,
  un as vertexCalc
};
