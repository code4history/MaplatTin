import { counterTri as On, Transform as Vn, validateWorldFile as jn, normalizeEdges as Un, transformArr as Me, rotateVerticesTriangle as qe, worldFileToCrs as zn } from "@maplat/transform";
function te(i, t, e = {}) {
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
function Hn(i) {
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
function Gn(i) {
  return i.type === "Feature" ? i.geometry : i;
}
function Pe(i, t, e) {
  if (i !== null)
    for (var n, s, r, o, a, c, l, h = 0, f = 0, u, g = i.type, x = g === "FeatureCollection", d = g === "Feature", S = x ? i.features.length : 1, B = 0; B < S; B++) {
      l = x ? (
        // @ts-expect-error: Known type conflict
        i.features[B].geometry
      ) : d ? (
        // @ts-expect-error: Known type conflict
        i.geometry
      ) : i, u = l ? l.type === "GeometryCollection" : !1, a = u ? l.geometries.length : 1;
      for (var m = 0; m < a; m++) {
        var y = 0, p = 0;
        if (o = u ? l.geometries[m] : l, o !== null) {
          c = o.coordinates;
          var w = o.type;
          switch (h = e && (w === "Polygon" || w === "MultiPolygon") ? 1 : 0, w) {
            case null:
              break;
            case "Point":
              if (
                // @ts-expect-error: Known type conflict
                t(
                  c,
                  f,
                  B,
                  y,
                  p
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
                    B,
                    y,
                    p
                  ) === !1
                )
                  return !1;
                f++, w === "MultiPoint" && y++;
              }
              w === "LineString" && y++;
              break;
            case "Polygon":
            case "MultiLineString":
              for (n = 0; n < c.length; n++) {
                for (s = 0; s < c[n].length - h; s++) {
                  if (
                    // @ts-expect-error: Known type conflict
                    t(
                      c[n][s],
                      f,
                      B,
                      y,
                      p
                    ) === !1
                  )
                    return !1;
                  f++;
                }
                w === "MultiLineString" && y++, w === "Polygon" && p++;
              }
              w === "Polygon" && y++;
              break;
            case "MultiPolygon":
              for (n = 0; n < c.length; n++) {
                for (p = 0, s = 0; s < c[n].length; s++) {
                  for (r = 0; r < c[n][s].length - h; r++) {
                    if (
                      // @ts-expect-error: Known type conflict
                      t(
                        c[n][s][r],
                        f,
                        B,
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
  let r, o, a, c, l = t[0], h = n[0], f = 0, u = 0;
  h > l == h > -l ? (r = l, l = t[++f]) : (r = h, h = n[++u]);
  let g = 0;
  if (f < i && u < e)
    for (h > l == h > -l ? (o = l + r, a = r - (o - l), l = t[++f]) : (o = h + r, a = r - (o - h), h = n[++u]), r = o, a !== 0 && (s[g++] = a); f < i && u < e; )
      h > l == h > -l ? (o = r + l, c = o - r, a = r - (o - c) + (l - c), l = t[++f]) : (o = r + h, c = o - r, a = r - (o - c) + (h - c), h = n[++u]), r = o, a !== 0 && (s[g++] = a);
  for (; f < i; )
    o = r + l, c = o - r, a = r - (o - c) + (l - c), l = t[++f], r = o, a !== 0 && (s[g++] = a);
  for (; u < e; )
    o = r + h, c = o - r, a = r - (o - c) + (h - c), h = n[++u], r = o, a !== 0 && (s[g++] = a);
  return (r !== 0 || g === 0) && (s[g++] = r), g;
}
function _t(i, t, e, n, s, r, o, a) {
  return ht(ht(i, t, e, n, o), o, s, r, a);
}
function L(i, t, e, n) {
  let s, r, o, a, c, l, h, f, u, g, x;
  h = U * e, g = h - (h - e), x = e - g;
  let d = t[0];
  s = d * e, h = U * d, f = h - (h - d), u = d - f, o = u * x - (s - f * g - u * g - f * x);
  let S = 0;
  o !== 0 && (n[S++] = o);
  for (let B = 1; B < i; B++)
    d = t[B], a = d * e, h = U * d, f = h - (h - d), u = d - f, c = u * x - (a - f * g - u * g - f * x), r = s + c, l = r - s, o = s - (r - l) + (c - l), o !== 0 && (n[S++] = o), s = a + r, o = r - (s - a), o !== 0 && (n[S++] = o);
  return (s !== 0 || S === 0) && (n[S++] = s), S;
}
function Fn(i, t) {
  let e = t[0];
  for (let n = 1; n < i; n++) e += t[n];
  return e;
}
function tt(i) {
  return new Float64Array(i);
}
const Kn = (3 + 16 * pt) * pt, Wn = (2 + 12 * pt) * pt, Jn = (9 + 64 * pt) * pt * pt, Lt = tt(4), Ue = tt(8), ze = tt(12), He = tt(16), mt = tt(4);
function Qn(i, t, e, n, s, r, o) {
  let a, c, l, h, f, u, g, x, d, S, B, m, y, p, w, M, _, I;
  const E = i - s, O = e - s, T = t - r, D = n - r;
  p = E * D, u = U * E, g = u - (u - E), x = E - g, u = U * D, d = u - (u - D), S = D - d, w = x * S - (p - g * d - x * d - g * S), M = T * O, u = U * T, g = u - (u - T), x = T - g, u = U * O, d = u - (u - O), S = O - d, _ = x * S - (M - g * d - x * d - g * S), B = w - _, f = w - B, Lt[0] = w - (B + f) + (f - _), m = p + B, f = m - p, y = p - (m - f) + (B - f), B = y - M, f = y - B, Lt[1] = y - (B + f) + (f - M), I = m + B, f = I - m, Lt[2] = m - (I - f) + (B - f), Lt[3] = I;
  let X = Fn(4, Lt), v = Wn * o;
  if (X >= v || -X >= v || (f = i - E, a = i - (E + f) + (f - s), f = e - O, l = e - (O + f) + (f - s), f = t - T, c = t - (T + f) + (f - r), f = n - D, h = n - (D + f) + (f - r), a === 0 && c === 0 && l === 0 && h === 0) || (v = Jn * o + Tn * Math.abs(X), X += E * h + D * a - (T * l + O * c), X >= v || -X >= v)) return X;
  p = a * D, u = U * a, g = u - (u - a), x = a - g, u = U * D, d = u - (u - D), S = D - d, w = x * S - (p - g * d - x * d - g * S), M = c * O, u = U * c, g = u - (u - c), x = c - g, u = U * O, d = u - (u - O), S = O - d, _ = x * S - (M - g * d - x * d - g * S), B = w - _, f = w - B, mt[0] = w - (B + f) + (f - _), m = p + B, f = m - p, y = p - (m - f) + (B - f), B = y - M, f = y - B, mt[1] = y - (B + f) + (f - M), I = m + B, f = I - m, mt[2] = m - (I - f) + (B - f), mt[3] = I;
  const A = ht(4, Lt, 4, mt, Ue);
  p = E * h, u = U * E, g = u - (u - E), x = E - g, u = U * h, d = u - (u - h), S = h - d, w = x * S - (p - g * d - x * d - g * S), M = T * l, u = U * T, g = u - (u - T), x = T - g, u = U * l, d = u - (u - l), S = l - d, _ = x * S - (M - g * d - x * d - g * S), B = w - _, f = w - B, mt[0] = w - (B + f) + (f - _), m = p + B, f = m - p, y = p - (m - f) + (B - f), B = y - M, f = y - B, mt[1] = y - (B + f) + (f - M), I = m + B, f = I - m, mt[2] = m - (I - f) + (B - f), mt[3] = I;
  const k = ht(A, Ue, 4, mt, ze);
  p = a * h, u = U * a, g = u - (u - a), x = a - g, u = U * h, d = u - (u - h), S = h - d, w = x * S - (p - g * d - x * d - g * S), M = c * l, u = U * c, g = u - (u - c), x = c - g, u = U * l, d = u - (u - l), S = l - d, _ = x * S - (M - g * d - x * d - g * S), B = w - _, f = w - B, mt[0] = w - (B + f) + (f - _), m = p + B, f = m - p, y = p - (m - f) + (B - f), B = y - M, f = y - B, mt[1] = y - (B + f) + (f - M), I = m + B, f = I - m, mt[2] = m - (I - f) + (B - f), mt[3] = I;
  const C = ht(k, ze, 4, mt, He);
  return He[C - 1];
}
function dt(i, t, e, n, s, r) {
  const o = (t - r) * (e - s), a = (i - s) * (n - r), c = o - a, l = Math.abs(o + a);
  return Math.abs(c) >= Kn * l ? c : -Qn(i, t, e, n, s, r, l);
}
const Zn = (10 + 96 * pt) * pt, tr = (4 + 48 * pt) * pt, er = (44 + 576 * pt) * pt * pt, Tt = tt(4), Ft = tt(4), Ct = tt(4), St = tt(4), kt = tt(4), Et = tt(4), gt = tt(4), wt = tt(4), _e = tt(8), Se = tt(8), ke = tt(8), Ee = tt(8), Ae = tt(8), Ie = tt(8), se = tt(8), oe = tt(8), ae = tt(8), Pt = tt(4), $t = tt(4), Xt = tt(4), z = tt(8), K = tt(16), nt = tt(16), rt = tt(16), et = tt(32), Nt = tt(32), ct = tt(48), vt = tt(64);
let jt = tt(1152), Be = tt(1152);
function lt(i, t, e) {
  i = ht(i, jt, t, e, Be);
  const n = jt;
  return jt = Be, Be = n, i;
}
function nr(i, t, e, n, s, r, o, a, c) {
  let l, h, f, u, g, x, d, S, B, m, y, p, w, M, _, I, E, O, T, D, X, v, A, k, C, N, P, b, F, $, R, q, Y, j, V;
  const G = i - o, H = e - o, W = s - o, J = t - a, Z = n - a, Q = r - a;
  R = H * Q, A = U * H, k = A - (A - H), C = H - k, A = U * Q, N = A - (A - Q), P = Q - N, q = C * P - (R - k * N - C * N - k * P), Y = W * Z, A = U * W, k = A - (A - W), C = W - k, A = U * Z, N = A - (A - Z), P = Z - N, j = C * P - (Y - k * N - C * N - k * P), b = q - j, v = q - b, Tt[0] = q - (b + v) + (v - j), F = R + b, v = F - R, $ = R - (F - v) + (b - v), b = $ - Y, v = $ - b, Tt[1] = $ - (b + v) + (v - Y), V = F + b, v = V - F, Tt[2] = F - (V - v) + (b - v), Tt[3] = V, R = W * J, A = U * W, k = A - (A - W), C = W - k, A = U * J, N = A - (A - J), P = J - N, q = C * P - (R - k * N - C * N - k * P), Y = G * Q, A = U * G, k = A - (A - G), C = G - k, A = U * Q, N = A - (A - Q), P = Q - N, j = C * P - (Y - k * N - C * N - k * P), b = q - j, v = q - b, Ft[0] = q - (b + v) + (v - j), F = R + b, v = F - R, $ = R - (F - v) + (b - v), b = $ - Y, v = $ - b, Ft[1] = $ - (b + v) + (v - Y), V = F + b, v = V - F, Ft[2] = F - (V - v) + (b - v), Ft[3] = V, R = G * Z, A = U * G, k = A - (A - G), C = G - k, A = U * Z, N = A - (A - Z), P = Z - N, q = C * P - (R - k * N - C * N - k * P), Y = H * J, A = U * H, k = A - (A - H), C = H - k, A = U * J, N = A - (A - J), P = J - N, j = C * P - (Y - k * N - C * N - k * P), b = q - j, v = q - b, Ct[0] = q - (b + v) + (v - j), F = R + b, v = F - R, $ = R - (F - v) + (b - v), b = $ - Y, v = $ - b, Ct[1] = $ - (b + v) + (v - Y), V = F + b, v = V - F, Ct[2] = F - (V - v) + (b - v), Ct[3] = V, l = ht(
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
        Nt
      ),
      Nt,
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
  let at = Fn(l, jt), ft = tr * c;
  if (at >= ft || -at >= ft || (v = i - G, h = i - (G + v) + (v - o), v = t - J, g = t - (J + v) + (v - a), v = e - H, f = e - (H + v) + (v - o), v = n - Z, x = n - (Z + v) + (v - a), v = s - W, u = s - (W + v) + (v - o), v = r - Q, d = r - (Q + v) + (v - a), h === 0 && f === 0 && u === 0 && g === 0 && x === 0 && d === 0) || (ft = er * c + Tn * Math.abs(at), at += (G * G + J * J) * (H * d + Q * f - (Z * u + W * x)) + 2 * (G * h + J * g) * (H * Q - Z * W) + ((H * H + Z * Z) * (W * g + J * u - (Q * h + G * d)) + 2 * (H * f + Z * x) * (W * J - Q * G)) + ((W * W + Q * Q) * (G * x + Z * h - (J * f + H * g)) + 2 * (W * u + Q * d) * (G * Z - J * H)), at >= ft || -at >= ft))
    return at;
  if ((f !== 0 || x !== 0 || u !== 0 || d !== 0) && (R = G * G, A = U * G, k = A - (A - G), C = G - k, q = C * C - (R - k * k - (k + k) * C), Y = J * J, A = U * J, k = A - (A - J), C = J - k, j = C * C - (Y - k * k - (k + k) * C), b = q + j, v = b - q, St[0] = q - (b - v) + (j - v), F = R + b, v = F - R, $ = R - (F - v) + (b - v), b = $ + Y, v = b - $, St[1] = $ - (b - v) + (Y - v), V = F + b, v = V - F, St[2] = F - (V - v) + (b - v), St[3] = V), (u !== 0 || d !== 0 || h !== 0 || g !== 0) && (R = H * H, A = U * H, k = A - (A - H), C = H - k, q = C * C - (R - k * k - (k + k) * C), Y = Z * Z, A = U * Z, k = A - (A - Z), C = Z - k, j = C * C - (Y - k * k - (k + k) * C), b = q + j, v = b - q, kt[0] = q - (b - v) + (j - v), F = R + b, v = F - R, $ = R - (F - v) + (b - v), b = $ + Y, v = b - $, kt[1] = $ - (b - v) + (Y - v), V = F + b, v = V - F, kt[2] = F - (V - v) + (b - v), kt[3] = V), (h !== 0 || g !== 0 || f !== 0 || x !== 0) && (R = W * W, A = U * W, k = A - (A - W), C = W - k, q = C * C - (R - k * k - (k + k) * C), Y = Q * Q, A = U * Q, k = A - (A - Q), C = Q - k, j = C * C - (Y - k * k - (k + k) * C), b = q + j, v = b - q, Et[0] = q - (b - v) + (j - v), F = R + b, v = F - R, $ = R - (F - v) + (b - v), b = $ + Y, v = b - $, Et[1] = $ - (b - v) + (Y - v), V = F + b, v = V - F, Et[2] = F - (V - v) + (b - v), Et[3] = V), h !== 0 && (S = L(4, Tt, h, _e), l = lt(l, _t(
    L(S, _e, 2 * G, K),
    K,
    L(L(4, Et, h, z), z, Z, nt),
    nt,
    L(L(4, kt, h, z), z, -Q, rt),
    rt,
    et,
    ct
  ), ct)), g !== 0 && (B = L(4, Tt, g, Se), l = lt(l, _t(
    L(B, Se, 2 * J, K),
    K,
    L(L(4, kt, g, z), z, W, nt),
    nt,
    L(L(4, Et, g, z), z, -H, rt),
    rt,
    et,
    ct
  ), ct)), f !== 0 && (m = L(4, Ft, f, ke), l = lt(l, _t(
    L(m, ke, 2 * H, K),
    K,
    L(L(4, St, f, z), z, Q, nt),
    nt,
    L(L(4, Et, f, z), z, -J, rt),
    rt,
    et,
    ct
  ), ct)), x !== 0 && (y = L(4, Ft, x, Ee), l = lt(l, _t(
    L(y, Ee, 2 * Z, K),
    K,
    L(L(4, Et, x, z), z, G, nt),
    nt,
    L(L(4, St, x, z), z, -W, rt),
    rt,
    et,
    ct
  ), ct)), u !== 0 && (p = L(4, Ct, u, Ae), l = lt(l, _t(
    L(p, Ae, 2 * W, K),
    K,
    L(L(4, kt, u, z), z, J, nt),
    nt,
    L(L(4, St, u, z), z, -Z, rt),
    rt,
    et,
    ct
  ), ct)), d !== 0 && (w = L(4, Ct, d, Ie), l = lt(l, _t(
    L(w, Ie, 2 * Q, K),
    K,
    L(L(4, St, d, z), z, H, nt),
    nt,
    L(L(4, kt, d, z), z, -G, rt),
    rt,
    et,
    ct
  ), ct)), h !== 0 || g !== 0) {
    if (f !== 0 || x !== 0 || u !== 0 || d !== 0 ? (R = f * Q, A = U * f, k = A - (A - f), C = f - k, A = U * Q, N = A - (A - Q), P = Q - N, q = C * P - (R - k * N - C * N - k * P), Y = H * d, A = U * H, k = A - (A - H), C = H - k, A = U * d, N = A - (A - d), P = d - N, j = C * P - (Y - k * N - C * N - k * P), b = q + j, v = b - q, gt[0] = q - (b - v) + (j - v), F = R + b, v = F - R, $ = R - (F - v) + (b - v), b = $ + Y, v = b - $, gt[1] = $ - (b - v) + (Y - v), V = F + b, v = V - F, gt[2] = F - (V - v) + (b - v), gt[3] = V, R = u * -Z, A = U * u, k = A - (A - u), C = u - k, A = U * -Z, N = A - (A - -Z), P = -Z - N, q = C * P - (R - k * N - C * N - k * P), Y = W * -x, A = U * W, k = A - (A - W), C = W - k, A = U * -x, N = A - (A - -x), P = -x - N, j = C * P - (Y - k * N - C * N - k * P), b = q + j, v = b - q, wt[0] = q - (b - v) + (j - v), F = R + b, v = F - R, $ = R - (F - v) + (b - v), b = $ + Y, v = b - $, wt[1] = $ - (b - v) + (Y - v), V = F + b, v = V - F, wt[2] = F - (V - v) + (b - v), wt[3] = V, _ = ht(4, gt, 4, wt, oe), R = f * d, A = U * f, k = A - (A - f), C = f - k, A = U * d, N = A - (A - d), P = d - N, q = C * P - (R - k * N - C * N - k * P), Y = u * x, A = U * u, k = A - (A - u), C = u - k, A = U * x, N = A - (A - x), P = x - N, j = C * P - (Y - k * N - C * N - k * P), b = q - j, v = q - b, $t[0] = q - (b + v) + (v - j), F = R + b, v = F - R, $ = R - (F - v) + (b - v), b = $ - Y, v = $ - b, $t[1] = $ - (b + v) + (v - Y), V = F + b, v = V - F, $t[2] = F - (V - v) + (b - v), $t[3] = V, O = 4) : (oe[0] = 0, _ = 1, $t[0] = 0, O = 1), h !== 0) {
      const it = L(_, oe, h, rt);
      l = lt(l, ht(
        L(S, _e, h, K),
        K,
        L(it, rt, 2 * G, et),
        et,
        ct
      ), ct);
      const st = L(O, $t, h, z);
      l = lt(l, _t(
        L(st, z, 2 * G, K),
        K,
        L(st, z, h, nt),
        nt,
        L(it, rt, h, et),
        et,
        Nt,
        vt
      ), vt), x !== 0 && (l = lt(l, L(L(4, Et, h, z), z, x, K), K)), d !== 0 && (l = lt(l, L(L(4, kt, -h, z), z, d, K), K));
    }
    if (g !== 0) {
      const it = L(_, oe, g, rt);
      l = lt(l, ht(
        L(B, Se, g, K),
        K,
        L(it, rt, 2 * J, et),
        et,
        ct
      ), ct);
      const st = L(O, $t, g, z);
      l = lt(l, _t(
        L(st, z, 2 * J, K),
        K,
        L(st, z, g, nt),
        nt,
        L(it, rt, g, et),
        et,
        Nt,
        vt
      ), vt);
    }
  }
  if (f !== 0 || x !== 0) {
    if (u !== 0 || d !== 0 || h !== 0 || g !== 0 ? (R = u * J, A = U * u, k = A - (A - u), C = u - k, A = U * J, N = A - (A - J), P = J - N, q = C * P - (R - k * N - C * N - k * P), Y = W * g, A = U * W, k = A - (A - W), C = W - k, A = U * g, N = A - (A - g), P = g - N, j = C * P - (Y - k * N - C * N - k * P), b = q + j, v = b - q, gt[0] = q - (b - v) + (j - v), F = R + b, v = F - R, $ = R - (F - v) + (b - v), b = $ + Y, v = b - $, gt[1] = $ - (b - v) + (Y - v), V = F + b, v = V - F, gt[2] = F - (V - v) + (b - v), gt[3] = V, D = -Q, X = -d, R = h * D, A = U * h, k = A - (A - h), C = h - k, A = U * D, N = A - (A - D), P = D - N, q = C * P - (R - k * N - C * N - k * P), Y = G * X, A = U * G, k = A - (A - G), C = G - k, A = U * X, N = A - (A - X), P = X - N, j = C * P - (Y - k * N - C * N - k * P), b = q + j, v = b - q, wt[0] = q - (b - v) + (j - v), F = R + b, v = F - R, $ = R - (F - v) + (b - v), b = $ + Y, v = b - $, wt[1] = $ - (b - v) + (Y - v), V = F + b, v = V - F, wt[2] = F - (V - v) + (b - v), wt[3] = V, I = ht(4, gt, 4, wt, ae), R = u * g, A = U * u, k = A - (A - u), C = u - k, A = U * g, N = A - (A - g), P = g - N, q = C * P - (R - k * N - C * N - k * P), Y = h * d, A = U * h, k = A - (A - h), C = h - k, A = U * d, N = A - (A - d), P = d - N, j = C * P - (Y - k * N - C * N - k * P), b = q - j, v = q - b, Xt[0] = q - (b + v) + (v - j), F = R + b, v = F - R, $ = R - (F - v) + (b - v), b = $ - Y, v = $ - b, Xt[1] = $ - (b + v) + (v - Y), V = F + b, v = V - F, Xt[2] = F - (V - v) + (b - v), Xt[3] = V, T = 4) : (ae[0] = 0, I = 1, Xt[0] = 0, T = 1), f !== 0) {
      const it = L(I, ae, f, rt);
      l = lt(l, ht(
        L(m, ke, f, K),
        K,
        L(it, rt, 2 * H, et),
        et,
        ct
      ), ct);
      const st = L(T, Xt, f, z);
      l = lt(l, _t(
        L(st, z, 2 * H, K),
        K,
        L(st, z, f, nt),
        nt,
        L(it, rt, f, et),
        et,
        Nt,
        vt
      ), vt), d !== 0 && (l = lt(l, L(L(4, St, f, z), z, d, K), K)), g !== 0 && (l = lt(l, L(L(4, Et, -f, z), z, g, K), K));
    }
    if (x !== 0) {
      const it = L(I, ae, x, rt);
      l = lt(l, ht(
        L(y, Ee, x, K),
        K,
        L(it, rt, 2 * Z, et),
        et,
        ct
      ), ct);
      const st = L(T, Xt, x, z);
      l = lt(l, _t(
        L(st, z, 2 * Z, K),
        K,
        L(st, z, x, nt),
        nt,
        L(it, rt, x, et),
        et,
        Nt,
        vt
      ), vt);
    }
  }
  if (u !== 0 || d !== 0) {
    if (h !== 0 || g !== 0 || f !== 0 || x !== 0 ? (R = h * Z, A = U * h, k = A - (A - h), C = h - k, A = U * Z, N = A - (A - Z), P = Z - N, q = C * P - (R - k * N - C * N - k * P), Y = G * x, A = U * G, k = A - (A - G), C = G - k, A = U * x, N = A - (A - x), P = x - N, j = C * P - (Y - k * N - C * N - k * P), b = q + j, v = b - q, gt[0] = q - (b - v) + (j - v), F = R + b, v = F - R, $ = R - (F - v) + (b - v), b = $ + Y, v = b - $, gt[1] = $ - (b - v) + (Y - v), V = F + b, v = V - F, gt[2] = F - (V - v) + (b - v), gt[3] = V, D = -J, X = -g, R = f * D, A = U * f, k = A - (A - f), C = f - k, A = U * D, N = A - (A - D), P = D - N, q = C * P - (R - k * N - C * N - k * P), Y = H * X, A = U * H, k = A - (A - H), C = H - k, A = U * X, N = A - (A - X), P = X - N, j = C * P - (Y - k * N - C * N - k * P), b = q + j, v = b - q, wt[0] = q - (b - v) + (j - v), F = R + b, v = F - R, $ = R - (F - v) + (b - v), b = $ + Y, v = b - $, wt[1] = $ - (b - v) + (Y - v), V = F + b, v = V - F, wt[2] = F - (V - v) + (b - v), wt[3] = V, M = ht(4, gt, 4, wt, se), R = h * x, A = U * h, k = A - (A - h), C = h - k, A = U * x, N = A - (A - x), P = x - N, q = C * P - (R - k * N - C * N - k * P), Y = f * g, A = U * f, k = A - (A - f), C = f - k, A = U * g, N = A - (A - g), P = g - N, j = C * P - (Y - k * N - C * N - k * P), b = q - j, v = q - b, Pt[0] = q - (b + v) + (v - j), F = R + b, v = F - R, $ = R - (F - v) + (b - v), b = $ - Y, v = $ - b, Pt[1] = $ - (b + v) + (v - Y), V = F + b, v = V - F, Pt[2] = F - (V - v) + (b - v), Pt[3] = V, E = 4) : (se[0] = 0, M = 1, Pt[0] = 0, E = 1), u !== 0) {
      const it = L(M, se, u, rt);
      l = lt(l, ht(
        L(p, Ae, u, K),
        K,
        L(it, rt, 2 * W, et),
        et,
        ct
      ), ct);
      const st = L(E, Pt, u, z);
      l = lt(l, _t(
        L(st, z, 2 * W, K),
        K,
        L(st, z, u, nt),
        nt,
        L(it, rt, u, et),
        et,
        Nt,
        vt
      ), vt), g !== 0 && (l = lt(l, L(L(4, kt, u, z), z, g, K), K)), x !== 0 && (l = lt(l, L(L(4, St, -u, z), z, x, K), K));
    }
    if (d !== 0) {
      const it = L(M, se, d, rt);
      l = lt(l, ht(
        L(w, Ie, d, K),
        K,
        L(it, rt, 2 * Q, et),
        et,
        ct
      ), ct);
      const st = L(E, Pt, d, z);
      l = lt(l, _t(
        L(st, z, 2 * Q, K),
        K,
        L(st, z, d, nt),
        nt,
        L(it, rt, d, et),
        et,
        Nt,
        vt
      ), vt);
    }
  }
  return jt[l - 1];
}
function rr(i, t, e, n, s, r, o, a) {
  const c = i - o, l = e - o, h = s - o, f = t - a, u = n - a, g = r - a, x = l * g, d = h * u, S = c * c + f * f, B = h * f, m = c * g, y = l * l + u * u, p = c * u, w = l * f, M = h * h + g * g, _ = S * (x - d) + y * (B - m) + M * (p - w), I = (Math.abs(x) + Math.abs(d)) * S + (Math.abs(B) + Math.abs(m)) * y + (Math.abs(p) + Math.abs(w)) * M, E = Zn * I;
  return _ > E || -_ > E ? _ : nr(i, t, e, n, s, r, o, a, I);
}
function ir(i, t) {
  var e, n, s = 0, r, o, a, c, l, h, f, u = i[0], g = i[1], x = t.length;
  for (e = 0; e < x; e++) {
    n = 0;
    var d = t[e], S = d.length - 1;
    if (h = d[0], h[0] !== d[S][0] && h[1] !== d[S][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (o = h[0] - u, a = h[1] - g, n; n < S; n++) {
      if (f = d[n + 1], c = f[0] - u, l = f[1] - g, a === 0 && l === 0) {
        if (c <= 0 && o >= 0 || o <= 0 && c >= 0)
          return 0;
      } else if (l >= 0 && a <= 0 || l <= 0 && a >= 0) {
        if (r = dt(o, c, a, l, 0, 0), r === 0)
          return 0;
        (r > 0 && l > 0 && a <= 0 || r < 0 && l <= 0 && a > 0) && s++;
      }
      h = f, a = l, o = c;
    }
  }
  return s % 2 !== 0;
}
function Ge(i, t, e = {}) {
  if (!i)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const n = Hn(i), s = Gn(t), r = s.type, o = t.bbox;
  let a = s.coordinates;
  if (o && sr(n, o) === !1)
    return !1;
  r === "Polygon" && (a = [a]);
  for (var c = 0; c < a.length; ++c) {
    const l = ir(n, a[c]);
    if (l === 0 && !e.ignoreBoundary) return !0;
    if (l) return !0;
  }
  return !1;
}
function sr(i, t) {
  return t[0] <= i[0] && t[1] <= i[1] && t[2] >= i[0] && t[3] >= i[1];
}
class $e {
  constructor(t = [], e = or) {
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
      const c = o + 1;
      if (c < this.length && n(e[c], a) < 0 && (o = c, a = e[c]), n(a, r) >= 0) break;
      e[t] = a, t = o;
    }
    e[t] = r;
  }
}
function or(i, t) {
  return i < t ? -1 : i > t ? 1 : 0;
}
const ar = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $e
}, Symbol.toStringTag, { value: "Module" })), Bt = 11102230246251565e-32, ut = 134217729, cr = (3 + 8 * Bt) * Bt;
function Oe(i, t, e, n, s) {
  let r, o, a, c, l = t[0], h = n[0], f = 0, u = 0;
  h > l == h > -l ? (r = l, l = t[++f]) : (r = h, h = n[++u]);
  let g = 0;
  if (f < i && u < e)
    for (h > l == h > -l ? (o = l + r, a = r - (o - l), l = t[++f]) : (o = h + r, a = r - (o - h), h = n[++u]), r = o, a !== 0 && (s[g++] = a); f < i && u < e; )
      h > l == h > -l ? (o = r + l, c = o - r, a = r - (o - c) + (l - c), l = t[++f]) : (o = r + h, c = o - r, a = r - (o - c) + (h - c), h = n[++u]), r = o, a !== 0 && (s[g++] = a);
  for (; f < i; )
    o = r + l, c = o - r, a = r - (o - c) + (l - c), l = t[++f], r = o, a !== 0 && (s[g++] = a);
  for (; u < e; )
    o = r + h, c = o - r, a = r - (o - c) + (h - c), h = n[++u], r = o, a !== 0 && (s[g++] = a);
  return (r !== 0 || g === 0) && (s[g++] = r), g;
}
function lr(i, t) {
  let e = t[0];
  for (let n = 1; n < i; n++) e += t[n];
  return e;
}
function ie(i) {
  return new Float64Array(i);
}
const fr = (3 + 16 * Bt) * Bt, hr = (2 + 12 * Bt) * Bt, ur = (9 + 64 * Bt) * Bt * Bt, qt = ie(4), Ke = ie(8), We = ie(12), Je = ie(16), yt = ie(4);
function dr(i, t, e, n, s, r, o) {
  let a, c, l, h, f, u, g, x, d, S, B, m, y, p, w, M, _, I;
  const E = i - s, O = e - s, T = t - r, D = n - r;
  p = E * D, u = ut * E, g = u - (u - E), x = E - g, u = ut * D, d = u - (u - D), S = D - d, w = x * S - (p - g * d - x * d - g * S), M = T * O, u = ut * T, g = u - (u - T), x = T - g, u = ut * O, d = u - (u - O), S = O - d, _ = x * S - (M - g * d - x * d - g * S), B = w - _, f = w - B, qt[0] = w - (B + f) + (f - _), m = p + B, f = m - p, y = p - (m - f) + (B - f), B = y - M, f = y - B, qt[1] = y - (B + f) + (f - M), I = m + B, f = I - m, qt[2] = m - (I - f) + (B - f), qt[3] = I;
  let X = lr(4, qt), v = hr * o;
  if (X >= v || -X >= v || (f = i - E, a = i - (E + f) + (f - s), f = e - O, l = e - (O + f) + (f - s), f = t - T, c = t - (T + f) + (f - r), f = n - D, h = n - (D + f) + (f - r), a === 0 && c === 0 && l === 0 && h === 0) || (v = ur * o + cr * Math.abs(X), X += E * h + D * a - (T * l + O * c), X >= v || -X >= v)) return X;
  p = a * D, u = ut * a, g = u - (u - a), x = a - g, u = ut * D, d = u - (u - D), S = D - d, w = x * S - (p - g * d - x * d - g * S), M = c * O, u = ut * c, g = u - (u - c), x = c - g, u = ut * O, d = u - (u - O), S = O - d, _ = x * S - (M - g * d - x * d - g * S), B = w - _, f = w - B, yt[0] = w - (B + f) + (f - _), m = p + B, f = m - p, y = p - (m - f) + (B - f), B = y - M, f = y - B, yt[1] = y - (B + f) + (f - M), I = m + B, f = I - m, yt[2] = m - (I - f) + (B - f), yt[3] = I;
  const A = Oe(4, qt, 4, yt, Ke);
  p = E * h, u = ut * E, g = u - (u - E), x = E - g, u = ut * h, d = u - (u - h), S = h - d, w = x * S - (p - g * d - x * d - g * S), M = T * l, u = ut * T, g = u - (u - T), x = T - g, u = ut * l, d = u - (u - l), S = l - d, _ = x * S - (M - g * d - x * d - g * S), B = w - _, f = w - B, yt[0] = w - (B + f) + (f - _), m = p + B, f = m - p, y = p - (m - f) + (B - f), B = y - M, f = y - B, yt[1] = y - (B + f) + (f - M), I = m + B, f = I - m, yt[2] = m - (I - f) + (B - f), yt[3] = I;
  const k = Oe(A, Ke, 4, yt, We);
  p = a * h, u = ut * a, g = u - (u - a), x = a - g, u = ut * h, d = u - (u - h), S = h - d, w = x * S - (p - g * d - x * d - g * S), M = c * l, u = ut * c, g = u - (u - c), x = c - g, u = ut * l, d = u - (u - l), S = l - d, _ = x * S - (M - g * d - x * d - g * S), B = w - _, f = w - B, yt[0] = w - (B + f) + (f - _), m = p + B, f = m - p, y = p - (m - f) + (B - f), B = y - M, f = y - B, yt[1] = y - (B + f) + (f - M), I = m + B, f = I - m, yt[2] = m - (I - f) + (B - f), yt[3] = I;
  const C = Oe(k, We, 4, yt, Je);
  return Je[C - 1];
}
function Qe(i, t, e, n, s, r) {
  const o = (t - r) * (e - s), a = (i - s) * (n - r), c = o - a;
  if (o === 0 || a === 0 || o > 0 != a > 0) return c;
  const l = Math.abs(o + a);
  return Math.abs(c) >= fr * l ? c : -dr(i, t, e, n, s, r, l);
}
function pr(i, t) {
  const e = new $e([], Cn);
  return gr(i, e), wr(e, t);
}
function Cn(i, t) {
  return i.p.x > t.p.x ? 1 : i.p.x < t.p.x || i.p.x === t.p.x && (i.featureId !== t.featureId || i.ringId !== t.ringId) && i.isLeftEndpoint && !t.isLeftEndpoint ? -1 : i.p.y !== t.p.y ? i.p.y > t.p.y ? 1 : -1 : 1;
}
function mr(i, t) {
  return i.rightSweepEvent.p.x > t.rightSweepEvent.p.x ? 1 : i.rightSweepEvent.p.x < t.rightSweepEvent.p.x ? -1 : i.rightSweepEvent.p.y !== t.rightSweepEvent.p.y ? i.rightSweepEvent.p.y < t.rightSweepEvent.p.y ? 1 : -1 : 1;
}
function gr(i, t) {
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
      for (let c = 0; c < n[s][r].length - 1; c++) {
        a = n[s][r][c + 1];
        const l = new tn(o, ce, le, fe), h = new tn(a, ce, le, fe + 1);
        l.otherEvent = h, h.otherEvent = l, Cn(l, h) > 0 ? (h.isLeftEndpoint = !0, l.isLeftEndpoint = !1) : (l.isLeftEndpoint = !0, h.isLeftEndpoint = !1), t.push(l), t.push(h), o = a, fe = fe + 1;
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
function wr(i, t = !1) {
  const e = [], n = new $e([], mr);
  for (; i.length; ) {
    const s = i.pop();
    if (s.isLeftEndpoint) {
      const r = new yr(s);
      for (let o = 0; o < n.data.length; o++) {
        const a = n.data[o];
        if (t && a.leftSweepEvent.featureId === s.featureId)
          continue;
        const c = vr(r, a);
        c !== !1 && e.push(c);
      }
      n.push(r);
    } else s.isLeftEndpoint === !1 && n.pop();
  }
  return e;
}
var yr = class {
  /** @param event must have otherEvent non-null */
  constructor(i) {
    this.leftSweepEvent = i, this.rightSweepEvent = i.otherEvent;
  }
};
function vr(i, t) {
  if (i === null || t === null) return !1;
  const e = i.leftSweepEvent.p.x, n = i.leftSweepEvent.p.y, s = i.rightSweepEvent.p.x, r = i.rightSweepEvent.p.y, o = t.leftSweepEvent.p.x, a = t.leftSweepEvent.p.y, c = t.rightSweepEvent.p.x, l = t.rightSweepEvent.p.y, h = Qe(e, n, s, r, o, a), f = Qe(e, n, s, r, c, l);
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
  const u = (l - a) * (s - e) - (c - o) * (r - n), g = (c - o) * (n - a) - (l - a) * (e - o), x = (s - e) * (n - a) - (r - n) * (e - o);
  if (u === 0)
    return !1;
  const d = g / u, S = x / u;
  if (d >= 0 && d <= 1 && S >= 0 && S <= 1) {
    const B = e + d * (s - e), m = n + d * (r - n);
    return [B, m];
  }
  return !1;
}
function br(i, t, e = {}) {
  const { removeDuplicates: n = !0, ignoreSelfIntersections: s = !0 } = e;
  let r = [];
  i.type === "FeatureCollection" ? r = r.concat(i.features) : i.type === "Feature" ? r.push(i) : (i.type === "LineString" || i.type === "Polygon" || i.type === "MultiLineString" || i.type === "MultiPolygon") && r.push(te(i)), t.type === "FeatureCollection" ? r = r.concat(t.features) : t.type === "Feature" ? r.push(t) : (t.type === "LineString" || t.type === "Polygon" || t.type === "MultiLineString" || t.type === "MultiPolygon") && r.push(te(t));
  const o = pr(
    xt(r),
    s
  );
  let a = [];
  if (n) {
    const c = {};
    o.forEach((l) => {
      const h = l.join(",");
      c[h] || (c[h] = !0, a.push(l));
    });
  } else
    a = o;
  return xt(a.map((c) => Yt(c)));
}
function xr(i) {
  return i && i.__esModule && Object.prototype.hasOwnProperty.call(i, "default") ? i.default : i;
}
function Mr(i) {
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
  ), Yt([e / s, n / s], t.properties);
}
var he = { exports: {} }, we = { exports: {} }, Sr = we.exports, en;
function kr() {
  return en || (en = 1, (function(i, t) {
    (function(e, n) {
      i.exports = n();
    })(Sr, function() {
      function e(m, y, p, w, M) {
        (function _(I, E, O, T, D) {
          for (; T > O; ) {
            if (T - O > 600) {
              var X = T - O + 1, v = E - O + 1, A = Math.log(X), k = 0.5 * Math.exp(2 * A / 3), C = 0.5 * Math.sqrt(A * k * (X - k) / X) * (v - X / 2 < 0 ? -1 : 1), N = Math.max(O, Math.floor(E - v * k / X + C)), P = Math.min(T, Math.floor(E + (X - v) * k / X + C));
              _(I, E, N, P, D);
            }
            var b = I[E], F = O, $ = T;
            for (n(I, O, E), D(I[T], b) > 0 && n(I, O, T); F < $; ) {
              for (n(I, F, $), F++, $--; D(I[F], b) < 0; ) F++;
              for (; D(I[$], b) > 0; ) $--;
            }
            D(I[O], b) === 0 ? n(I, O, $) : n(I, ++$, T), $ <= E && (O = $ + 1), E <= $ && (T = $ - 1);
          }
        })(m, y, p || 0, w || m.length - 1, M || s);
      }
      function n(m, y, p) {
        var w = m[y];
        m[y] = m[p], m[p] = w;
      }
      function s(m, y) {
        return m < y ? -1 : m > y ? 1 : 0;
      }
      var r = function(m) {
        m === void 0 && (m = 9), this._maxEntries = Math.max(4, m), this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries)), this.clear();
      };
      function o(m, y, p) {
        if (!p) return y.indexOf(m);
        for (var w = 0; w < y.length; w++) if (p(m, y[w])) return w;
        return -1;
      }
      function a(m, y) {
        c(m, 0, m.children.length, y, m);
      }
      function c(m, y, p, w, M) {
        M || (M = S(null)), M.minX = 1 / 0, M.minY = 1 / 0, M.maxX = -1 / 0, M.maxY = -1 / 0;
        for (var _ = y; _ < p; _++) {
          var I = m.children[_];
          l(M, m.leaf ? w(I) : I);
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
      function u(m) {
        return (m.maxX - m.minX) * (m.maxY - m.minY);
      }
      function g(m) {
        return m.maxX - m.minX + (m.maxY - m.minY);
      }
      function x(m, y) {
        return m.minX <= y.minX && m.minY <= y.minY && y.maxX <= m.maxX && y.maxY <= m.maxY;
      }
      function d(m, y) {
        return y.minX <= m.maxX && y.minY <= m.maxY && y.maxX >= m.minX && y.maxY >= m.minY;
      }
      function S(m) {
        return { children: m, height: 1, leaf: !0, minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
      }
      function B(m, y, p, w, M) {
        for (var _ = [y, p]; _.length; ) if (!((p = _.pop()) - (y = _.pop()) <= w)) {
          var I = y + Math.ceil((p - y) / w / 2) * w;
          e(m, I, y, p, M), _.push(y, I, I, p);
        }
      }
      return r.prototype.all = function() {
        return this._all(this.data, []);
      }, r.prototype.search = function(m) {
        var y = this.data, p = [];
        if (!d(m, y)) return p;
        for (var w = this.toBBox, M = []; y; ) {
          for (var _ = 0; _ < y.children.length; _++) {
            var I = y.children[_], E = y.leaf ? w(I) : I;
            d(m, E) && (y.leaf ? p.push(I) : x(m, E) ? this._all(I, p) : M.push(I));
          }
          y = M.pop();
        }
        return p;
      }, r.prototype.collides = function(m) {
        var y = this.data;
        if (!d(m, y)) return !1;
        for (var p = []; y; ) {
          for (var w = 0; w < y.children.length; w++) {
            var M = y.children[w], _ = y.leaf ? this.toBBox(M) : M;
            if (d(m, _)) {
              if (y.leaf || x(m, _)) return !0;
              p.push(M);
            }
          }
          y = p.pop();
        }
        return !1;
      }, r.prototype.load = function(m) {
        if (!m || !m.length) return this;
        if (m.length < this._minEntries) {
          for (var y = 0; y < m.length; y++) this.insert(m[y]);
          return this;
        }
        var p = this._build(m.slice(), 0, m.length - 1, 0);
        if (this.data.children.length) if (this.data.height === p.height) this._splitRoot(this.data, p);
        else {
          if (this.data.height < p.height) {
            var w = this.data;
            this.data = p, p = w;
          }
          this._insert(p, this.data.height - p.height - 1, !0);
        }
        else this.data = p;
        return this;
      }, r.prototype.insert = function(m) {
        return m && this._insert(m, this.data.height - 1), this;
      }, r.prototype.clear = function() {
        return this.data = S([]), this;
      }, r.prototype.remove = function(m, y) {
        if (!m) return this;
        for (var p, w, M, _ = this.data, I = this.toBBox(m), E = [], O = []; _ || E.length; ) {
          if (_ || (_ = E.pop(), w = E[E.length - 1], p = O.pop(), M = !0), _.leaf) {
            var T = o(m, _.children, y);
            if (T !== -1) return _.children.splice(T, 1), E.push(_), this._condense(E), this;
          }
          M || _.leaf || !x(_, I) ? w ? (p++, _ = w.children[p], M = !1) : _ = null : (E.push(_), O.push(p), p = 0, w = _, _ = _.children[0]);
        }
        return this;
      }, r.prototype.toBBox = function(m) {
        return m;
      }, r.prototype.compareMinX = function(m, y) {
        return m.minX - y.minX;
      }, r.prototype.compareMinY = function(m, y) {
        return m.minY - y.minY;
      }, r.prototype.toJSON = function() {
        return this.data;
      }, r.prototype.fromJSON = function(m) {
        return this.data = m, this;
      }, r.prototype._all = function(m, y) {
        for (var p = []; m; ) m.leaf ? y.push.apply(y, m.children) : p.push.apply(p, m.children), m = p.pop();
        return y;
      }, r.prototype._build = function(m, y, p, w) {
        var M, _ = p - y + 1, I = this._maxEntries;
        if (_ <= I) return a(M = S(m.slice(y, p + 1)), this.toBBox), M;
        w || (w = Math.ceil(Math.log(_) / Math.log(I)), I = Math.ceil(_ / Math.pow(I, w - 1))), (M = S([])).leaf = !1, M.height = w;
        var E = Math.ceil(_ / I), O = E * Math.ceil(Math.sqrt(I));
        B(m, y, p, O, this.compareMinX);
        for (var T = y; T <= p; T += O) {
          var D = Math.min(T + O - 1, p);
          B(m, T, D, E, this.compareMinY);
          for (var X = T; X <= D; X += E) {
            var v = Math.min(X + E - 1, D);
            M.children.push(this._build(m, X, v, w - 1));
          }
        }
        return a(M, this.toBBox), M;
      }, r.prototype._chooseSubtree = function(m, y, p, w) {
        for (; w.push(y), !y.leaf && w.length - 1 !== p; ) {
          for (var M = 1 / 0, _ = 1 / 0, I = void 0, E = 0; E < y.children.length; E++) {
            var O = y.children[E], T = u(O), D = (X = m, v = O, (Math.max(v.maxX, X.maxX) - Math.min(v.minX, X.minX)) * (Math.max(v.maxY, X.maxY) - Math.min(v.minY, X.minY)) - T);
            D < _ ? (_ = D, M = T < M ? T : M, I = O) : D === _ && T < M && (M = T, I = O);
          }
          y = I || y.children[0];
        }
        var X, v;
        return y;
      }, r.prototype._insert = function(m, y, p) {
        var w = p ? m : this.toBBox(m), M = [], _ = this._chooseSubtree(w, this.data, y, M);
        for (_.children.push(m), l(_, w); y >= 0 && M[y].children.length > this._maxEntries; ) this._split(M, y), y--;
        this._adjustParentBBoxes(w, M, y);
      }, r.prototype._split = function(m, y) {
        var p = m[y], w = p.children.length, M = this._minEntries;
        this._chooseSplitAxis(p, M, w);
        var _ = this._chooseSplitIndex(p, M, w), I = S(p.children.splice(_, p.children.length - _));
        I.height = p.height, I.leaf = p.leaf, a(p, this.toBBox), a(I, this.toBBox), y ? m[y - 1].children.push(I) : this._splitRoot(p, I);
      }, r.prototype._splitRoot = function(m, y) {
        this.data = S([m, y]), this.data.height = m.height + 1, this.data.leaf = !1, a(this.data, this.toBBox);
      }, r.prototype._chooseSplitIndex = function(m, y, p) {
        for (var w, M, _, I, E, O, T, D = 1 / 0, X = 1 / 0, v = y; v <= p - y; v++) {
          var A = c(m, 0, v, this.toBBox), k = c(m, v, p, this.toBBox), C = (M = A, _ = k, I = void 0, E = void 0, O = void 0, T = void 0, I = Math.max(M.minX, _.minX), E = Math.max(M.minY, _.minY), O = Math.min(M.maxX, _.maxX), T = Math.min(M.maxY, _.maxY), Math.max(0, O - I) * Math.max(0, T - E)), N = u(A) + u(k);
          C < D ? (D = C, w = v, X = N < X ? N : X) : C === D && N < X && (X = N, w = v);
        }
        return w || p - y;
      }, r.prototype._chooseSplitAxis = function(m, y, p) {
        var w = m.leaf ? this.compareMinX : h, M = m.leaf ? this.compareMinY : f;
        this._allDistMargin(m, y, p, w) < this._allDistMargin(m, y, p, M) && m.children.sort(w);
      }, r.prototype._allDistMargin = function(m, y, p, w) {
        m.children.sort(w);
        for (var M = this.toBBox, _ = c(m, 0, y, M), I = c(m, p - y, p, M), E = g(_) + g(I), O = y; O < p - y; O++) {
          var T = m.children[O];
          l(_, m.leaf ? M(T) : T), E += g(_);
        }
        for (var D = p - y - 1; D >= y; D--) {
          var X = m.children[D];
          l(I, m.leaf ? M(X) : X), E += g(I);
        }
        return E;
      }, r.prototype._adjustParentBBoxes = function(m, y, p) {
        for (var w = p; w >= 0; w--) l(y[w], m);
      }, r.prototype._condense = function(m) {
        for (var y = m.length - 1, p = void 0; y >= 0; y--) m[y].children.length === 0 ? y > 0 ? (p = m[y - 1].children).splice(p.indexOf(m[y]), 1) : this.clear() : a(m[y], this.toBBox);
      }, r;
    });
  })(we)), we.exports;
}
const Er = /* @__PURE__ */ Mr(ar);
var zt = { exports: {} }, Te, nn;
function Ar() {
  return nn || (nn = 1, Te = function(t, e, n, s) {
    var r = t[0], o = t[1], a = !1;
    n === void 0 && (n = 0), s === void 0 && (s = e.length);
    for (var c = (s - n) / 2, l = 0, h = c - 1; l < c; h = l++) {
      var f = e[n + l * 2 + 0], u = e[n + l * 2 + 1], g = e[n + h * 2 + 0], x = e[n + h * 2 + 1], d = u > o != x > o && r < (g - f) * (o - u) / (x - u) + f;
      d && (a = !a);
    }
    return a;
  }), Te;
}
var Fe, rn;
function Ir() {
  return rn || (rn = 1, Fe = function(t, e, n, s) {
    var r = t[0], o = t[1], a = !1;
    n === void 0 && (n = 0), s === void 0 && (s = e.length);
    for (var c = s - n, l = 0, h = c - 1; l < c; h = l++) {
      var f = e[l + n][0], u = e[l + n][1], g = e[h + n][0], x = e[h + n][1], d = u > o != x > o && r < (g - f) * (o - u) / (x - u) + f;
      d && (a = !a);
    }
    return a;
  }), Fe;
}
var sn;
function Br() {
  if (sn) return zt.exports;
  sn = 1;
  var i = Ar(), t = Ir();
  return zt.exports = function(n, s, r, o) {
    return s.length > 0 && Array.isArray(s[0]) ? t(n, s, r, o) : i(n, s, r, o);
  }, zt.exports.nested = t, zt.exports.flat = i, zt.exports;
}
var Gt = { exports: {} }, Or = Gt.exports, on;
function Tr() {
  return on || (on = 1, (function(i, t) {
    (function(e, n) {
      n(t);
    })(Or, function(e) {
      const s = 33306690738754706e-32;
      function r(d, S, B, m, y) {
        let p, w, M, _, I = S[0], E = m[0], O = 0, T = 0;
        E > I == E > -I ? (p = I, I = S[++O]) : (p = E, E = m[++T]);
        let D = 0;
        if (O < d && T < B) for (E > I == E > -I ? (M = p - ((w = I + p) - I), I = S[++O]) : (M = p - ((w = E + p) - E), E = m[++T]), p = w, M !== 0 && (y[D++] = M); O < d && T < B; ) E > I == E > -I ? (M = p - ((w = p + I) - (_ = w - p)) + (I - _), I = S[++O]) : (M = p - ((w = p + E) - (_ = w - p)) + (E - _), E = m[++T]), p = w, M !== 0 && (y[D++] = M);
        for (; O < d; ) M = p - ((w = p + I) - (_ = w - p)) + (I - _), I = S[++O], p = w, M !== 0 && (y[D++] = M);
        for (; T < B; ) M = p - ((w = p + E) - (_ = w - p)) + (E - _), E = m[++T], p = w, M !== 0 && (y[D++] = M);
        return p === 0 && D !== 0 || (y[D++] = p), D;
      }
      function o(d) {
        return new Float64Array(d);
      }
      const a = 33306690738754716e-32, c = 22204460492503146e-32, l = 11093356479670487e-47, h = o(4), f = o(8), u = o(12), g = o(16), x = o(4);
      e.orient2d = function(d, S, B, m, y, p) {
        const w = (S - p) * (B - y), M = (d - y) * (m - p), _ = w - M;
        if (w === 0 || M === 0 || w > 0 != M > 0) return _;
        const I = Math.abs(w + M);
        return Math.abs(_) >= a * I ? _ : -(function(E, O, T, D, X, v, A) {
          let k, C, N, P, b, F, $, R, q, Y, j, V, G, H, W, J, Z, Q;
          const at = E - X, ft = T - X, it = O - v, st = D - v;
          b = (W = (R = at - ($ = (F = 134217729 * at) - (F - at))) * (Y = st - (q = (F = 134217729 * st) - (F - st))) - ((H = at * st) - $ * q - R * q - $ * Y)) - (j = W - (Z = (R = it - ($ = (F = 134217729 * it) - (F - it))) * (Y = ft - (q = (F = 134217729 * ft) - (F - ft))) - ((J = it * ft) - $ * q - R * q - $ * Y))), h[0] = W - (j + b) + (b - Z), b = (G = H - ((V = H + j) - (b = V - H)) + (j - b)) - (j = G - J), h[1] = G - (j + b) + (b - J), b = (Q = V + j) - V, h[2] = V - (Q - b) + (j - b), h[3] = Q;
          let Ot = (function(qn, Ye) {
            let Le = Ye[0];
            for (let xe = 1; xe < qn; xe++) Le += Ye[xe];
            return Le;
          })(4, h), Ut = c * A;
          if (Ot >= Ut || -Ot >= Ut || (k = E - (at + (b = E - at)) + (b - X), N = T - (ft + (b = T - ft)) + (b - X), C = O - (it + (b = O - it)) + (b - v), P = D - (st + (b = D - st)) + (b - v), k === 0 && C === 0 && N === 0 && P === 0) || (Ut = l * A + s * Math.abs(Ot), (Ot += at * P + st * k - (it * N + ft * C)) >= Ut || -Ot >= Ut)) return Ot;
          b = (W = (R = k - ($ = (F = 134217729 * k) - (F - k))) * (Y = st - (q = (F = 134217729 * st) - (F - st))) - ((H = k * st) - $ * q - R * q - $ * Y)) - (j = W - (Z = (R = C - ($ = (F = 134217729 * C) - (F - C))) * (Y = ft - (q = (F = 134217729 * ft) - (F - ft))) - ((J = C * ft) - $ * q - R * q - $ * Y))), x[0] = W - (j + b) + (b - Z), b = (G = H - ((V = H + j) - (b = V - H)) + (j - b)) - (j = G - J), x[1] = G - (j + b) + (b - J), b = (Q = V + j) - V, x[2] = V - (Q - b) + (j - b), x[3] = Q;
          const Rn = r(4, h, 4, x, f);
          b = (W = (R = at - ($ = (F = 134217729 * at) - (F - at))) * (Y = P - (q = (F = 134217729 * P) - (F - P))) - ((H = at * P) - $ * q - R * q - $ * Y)) - (j = W - (Z = (R = it - ($ = (F = 134217729 * it) - (F - it))) * (Y = N - (q = (F = 134217729 * N) - (F - N))) - ((J = it * N) - $ * q - R * q - $ * Y))), x[0] = W - (j + b) + (b - Z), b = (G = H - ((V = H + j) - (b = V - H)) + (j - b)) - (j = G - J), x[1] = G - (j + b) + (b - J), b = (Q = V + j) - V, x[2] = V - (Q - b) + (j - b), x[3] = Q;
          const Yn = r(Rn, f, 4, x, u);
          b = (W = (R = k - ($ = (F = 134217729 * k) - (F - k))) * (Y = P - (q = (F = 134217729 * P) - (F - P))) - ((H = k * P) - $ * q - R * q - $ * Y)) - (j = W - (Z = (R = C - ($ = (F = 134217729 * C) - (F - C))) * (Y = N - (q = (F = 134217729 * N) - (F - N))) - ((J = C * N) - $ * q - R * q - $ * Y))), x[0] = W - (j + b) + (b - Z), b = (G = H - ((V = H + j) - (b = V - H)) + (j - b)) - (j = G - J), x[1] = G - (j + b) + (b - J), b = (Q = V + j) - V, x[2] = V - (Q - b) + (j - b), x[3] = Q;
          const Ln = r(Yn, u, 4, x, g);
          return g[Ln - 1];
        })(d, S, B, m, y, p, I);
      }, e.orient2dfast = function(d, S, B, m, y, p) {
        return (S - p) * (B - y) - (d - y) * (m - p);
      }, Object.defineProperty(e, "__esModule", { value: !0 });
    });
  })(Gt, Gt.exports)), Gt.exports;
}
var an;
function Fr() {
  if (an) return he.exports;
  an = 1;
  var i = kr(), t = Er, e = Br(), n = Tr().orient2d;
  t.default && (t = t.default), he.exports = s, he.exports.default = s;
  function s(p, w, M) {
    w = Math.max(0, w === void 0 ? 2 : w), M = M || 0;
    var _ = g(p), I = new i(16);
    I.toBBox = function($) {
      return {
        minX: $[0],
        minY: $[1],
        maxX: $[0],
        maxY: $[1]
      };
    }, I.compareMinX = function($, R) {
      return $[0] - R[0];
    }, I.compareMinY = function($, R) {
      return $[1] - R[1];
    }, I.load(p);
    for (var E = [], O = 0, T; O < _.length; O++) {
      var D = _[O];
      I.remove(D), T = x(D, T), E.push(T);
    }
    var X = new i(16);
    for (O = 0; O < E.length; O++) X.insert(u(E[O]));
    for (var v = w * w, A = M * M; E.length; ) {
      var k = E.shift(), C = k.p, N = k.next.p, P = d(C, N);
      if (!(P < A)) {
        var b = P / v;
        D = r(I, k.prev.p, C, N, k.next.next.p, b, X), D && Math.min(d(D, C), d(D, N)) <= b && (E.push(k), E.push(x(D, k)), I.remove(D), X.remove(k), X.insert(u(k)), X.insert(u(k.next)));
      }
    }
    k = T;
    var F = [];
    do
      F.push(k.p), k = k.next;
    while (k !== T);
    return F.push(k.p), F;
  }
  function r(p, w, M, _, I, E, O) {
    for (var T = new t([], o), D = p.data; D; ) {
      for (var X = 0; X < D.children.length; X++) {
        var v = D.children[X], A = D.leaf ? S(v, M, _) : a(M, _, v);
        A > E || T.push({
          node: v,
          dist: A
        });
      }
      for (; T.length && !T.peek().node.children; ) {
        var k = T.pop(), C = k.node, N = S(C, w, M), P = S(C, _, I);
        if (k.dist < N && k.dist < P && l(M, C, O) && l(_, C, O)) return C;
      }
      D = T.pop(), D && (D = D.node);
    }
    return null;
  }
  function o(p, w) {
    return p.dist - w.dist;
  }
  function a(p, w, M) {
    if (c(p, M) || c(w, M)) return 0;
    var _ = B(p[0], p[1], w[0], w[1], M.minX, M.minY, M.maxX, M.minY);
    if (_ === 0) return 0;
    var I = B(p[0], p[1], w[0], w[1], M.minX, M.minY, M.minX, M.maxY);
    if (I === 0) return 0;
    var E = B(p[0], p[1], w[0], w[1], M.maxX, M.minY, M.maxX, M.maxY);
    if (E === 0) return 0;
    var O = B(p[0], p[1], w[0], w[1], M.minX, M.maxY, M.maxX, M.maxY);
    return O === 0 ? 0 : Math.min(_, I, E, O);
  }
  function c(p, w) {
    return p[0] >= w.minX && p[0] <= w.maxX && p[1] >= w.minY && p[1] <= w.maxY;
  }
  function l(p, w, M) {
    for (var _ = Math.min(p[0], w[0]), I = Math.min(p[1], w[1]), E = Math.max(p[0], w[0]), O = Math.max(p[1], w[1]), T = M.search({ minX: _, minY: I, maxX: E, maxY: O }), D = 0; D < T.length; D++)
      if (f(T[D].p, T[D].next.p, p, w)) return !1;
    return !0;
  }
  function h(p, w, M) {
    return n(p[0], p[1], w[0], w[1], M[0], M[1]);
  }
  function f(p, w, M, _) {
    return p !== _ && w !== M && h(p, w, M) > 0 != h(p, w, _) > 0 && h(M, _, p) > 0 != h(M, _, w) > 0;
  }
  function u(p) {
    var w = p.p, M = p.next.p;
    return p.minX = Math.min(w[0], M[0]), p.minY = Math.min(w[1], M[1]), p.maxX = Math.max(w[0], M[0]), p.maxY = Math.max(w[1], M[1]), p;
  }
  function g(p) {
    for (var w = p[0], M = p[0], _ = p[0], I = p[0], E = 0; E < p.length; E++) {
      var O = p[E];
      O[0] < w[0] && (w = O), O[0] > _[0] && (_ = O), O[1] < M[1] && (M = O), O[1] > I[1] && (I = O);
    }
    var T = [w, M, _, I], D = T.slice();
    for (E = 0; E < p.length; E++)
      e(p[E], T) || D.push(p[E]);
    return y(D);
  }
  function x(p, w) {
    var M = {
      p,
      prev: null,
      next: null,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };
    return w ? (M.next = w.next, M.prev = w, w.next.prev = M, w.next = M) : (M.prev = M, M.next = M), M;
  }
  function d(p, w) {
    var M = p[0] - w[0], _ = p[1] - w[1];
    return M * M + _ * _;
  }
  function S(p, w, M) {
    var _ = w[0], I = w[1], E = M[0] - _, O = M[1] - I;
    if (E !== 0 || O !== 0) {
      var T = ((p[0] - _) * E + (p[1] - I) * O) / (E * E + O * O);
      T > 1 ? (_ = M[0], I = M[1]) : T > 0 && (_ += E * T, I += O * T);
    }
    return E = p[0] - _, O = p[1] - I, E * E + O * O;
  }
  function B(p, w, M, _, I, E, O, T) {
    var D = M - p, X = _ - w, v = O - I, A = T - E, k = p - I, C = w - E, N = D * D + X * X, P = D * v + X * A, b = v * v + A * A, F = D * k + X * C, $ = v * k + A * C, R = N * b - P * P, q, Y, j, V, G = R, H = R;
    R === 0 ? (Y = 0, G = 1, V = $, H = b) : (Y = P * $ - b * F, V = N * $ - P * F, Y < 0 ? (Y = 0, V = $, H = b) : Y > G && (Y = G, V = $ + P, H = b)), V < 0 ? (V = 0, -F < 0 ? Y = 0 : -F > N ? Y = G : (Y = -F, G = N)) : V > H && (V = H, -F + P < 0 ? Y = 0 : -F + P > N ? Y = G : (Y = -F + P, G = N)), q = Y === 0 ? 0 : Y / G, j = V === 0 ? 0 : V / H;
    var W = (1 - q) * p + q * M, J = (1 - q) * w + q * _, Z = (1 - j) * I + j * O, Q = (1 - j) * E + j * T, at = Z - W, ft = Q - J;
    return at * at + ft * ft;
  }
  function m(p, w) {
    return p[0] === w[0] ? p[1] - w[1] : p[0] - w[0];
  }
  function y(p) {
    p.sort(m);
    for (var w = [], M = 0; M < p.length; M++) {
      for (; w.length >= 2 && h(w[w.length - 2], w[w.length - 1], p[M]) <= 0; )
        w.pop();
      w.push(p[M]);
    }
    for (var _ = [], I = p.length - 1; I >= 0; I--) {
      for (; _.length >= 2 && h(_[_.length - 2], _[_.length - 1], p[I]) <= 0; )
        _.pop();
      _.push(p[I]);
    }
    return _.pop(), w.pop(), w.concat(_);
  }
  return he.exports;
}
var Cr = Fr();
const Nr = /* @__PURE__ */ xr(Cr);
function cn(i, t = {}) {
  t.concavity = t.concavity || 1 / 0;
  const e = [];
  if (Pe(i, (s) => {
    e.push([s[0], s[1]]);
  }), !e.length)
    return null;
  const n = Nr(e, t.concavity);
  return n.length > 3 ? re([n], t.properties) : null;
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
  static from(t, e = Rr, n = Yr) {
    const s = t.length, r = new Float64Array(s * 2);
    for (let o = 0; o < s; o++) {
      const a = t[o];
      r[2 * o] = e(a), r[2 * o + 1] = n(a);
    }
    return new Xe(r);
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
    let a = 1 / 0, c = 1 / 0, l = -1 / 0, h = -1 / 0;
    for (let E = 0; E < o; E++) {
      const O = t[2 * E], T = t[2 * E + 1];
      O < a && (a = O), T < c && (c = T), O > l && (l = O), T > h && (h = T), this._ids[E] = E;
    }
    const f = (a + l) / 2, u = (c + h) / 2;
    let g = 0, x = 0, d = 0;
    for (let E = 0, O = 1 / 0; E < o; E++) {
      const T = Ce(f, u, t[2 * E], t[2 * E + 1]);
      T < O && (g = E, O = T);
    }
    const S = t[2 * g], B = t[2 * g + 1];
    for (let E = 0, O = 1 / 0; E < o; E++) {
      if (E === g) continue;
      const T = Ce(S, B, t[2 * E], t[2 * E + 1]);
      T < O && T > 0 && (x = E, O = T);
    }
    let m = t[2 * x], y = t[2 * x + 1], p = 1 / 0;
    for (let E = 0; E < o; E++) {
      if (E === g || E === x) continue;
      const O = $r(S, B, m, y, t[2 * E], t[2 * E + 1]);
      O < p && (d = E, p = O);
    }
    let w = t[2 * d], M = t[2 * d + 1];
    if (p === 1 / 0) {
      for (let T = 0; T < o; T++)
        this._dists[T] = t[2 * T] - t[0] || t[2 * T + 1] - t[1];
      Vt(this._ids, this._dists, 0, o - 1);
      const E = new Uint32Array(o);
      let O = 0;
      for (let T = 0, D = -1 / 0; T < o; T++) {
        const X = this._ids[T], v = this._dists[X];
        v > D && (E[O++] = X, D = v);
      }
      this.hull = E.subarray(0, O), this.triangles = new Uint32Array(0), this.halfedges = new Int32Array(0);
      return;
    }
    if (dt(S, B, m, y, w, M) < 0) {
      const E = x, O = m, T = y;
      x = d, m = w, y = M, d = E, w = O, M = T;
    }
    const _ = Xr(S, B, m, y, w, M);
    this._cx = _.x, this._cy = _.y;
    for (let E = 0; E < o; E++)
      this._dists[E] = Ce(t[2 * E], t[2 * E + 1], _.x, _.y);
    Vt(this._ids, this._dists, 0, o - 1), this._hullStart = g;
    let I = 3;
    n[g] = e[d] = x, n[x] = e[g] = d, n[d] = e[x] = g, s[g] = 0, s[x] = 1, s[d] = 2, r.fill(-1), r[this._hashKey(S, B)] = g, r[this._hashKey(m, y)] = x, r[this._hashKey(w, M)] = d, this.trianglesLen = 0, this._addTriangle(g, x, d, -1, -1, -1);
    for (let E = 0, O = 0, T = 0; E < this._ids.length; E++) {
      const D = this._ids[E], X = t[2 * D], v = t[2 * D + 1];
      if (E > 0 && Math.abs(X - O) <= ln && Math.abs(v - T) <= ln || (O = X, T = v, D === g || D === x || D === d)) continue;
      let A = 0;
      for (let b = 0, F = this._hashKey(X, v); b < this._hashSize && (A = r[(F + b) % this._hashSize], !(A !== -1 && A !== n[A])); b++)
        ;
      A = e[A];
      let k = A, C;
      for (; C = n[k], dt(X, v, t[2 * k], t[2 * k + 1], t[2 * C], t[2 * C + 1]) >= 0; )
        if (k = C, k === A) {
          k = -1;
          break;
        }
      if (k === -1) continue;
      let N = this._addTriangle(k, D, n[k], -1, -1, s[k]);
      s[D] = this._legalize(N + 2), s[k] = N, I++;
      let P = n[k];
      for (; C = n[P], dt(X, v, t[2 * P], t[2 * P + 1], t[2 * C], t[2 * C + 1]) < 0; )
        N = this._addTriangle(P, D, C, s[D], -1, s[P]), s[D] = this._legalize(N + 2), n[P] = P, I--, P = C;
      if (k === A)
        for (; C = e[k], dt(X, v, t[2 * C], t[2 * C + 1], t[2 * k], t[2 * k + 1]) < 0; )
          N = this._addTriangle(C, D, k, -1, s[k], s[C]), this._legalize(N + 2), s[C] = N, n[k] = k, I--, k = C;
      this._hullStart = e[D] = k, n[k] = e[P] = D, n[D] = P, r[this._hashKey(X, v)] = D, r[this._hashKey(t[2 * k], t[2 * k + 1])] = k;
    }
    this.hull = new Uint32Array(I);
    for (let E = 0, O = this._hullStart; E < I; E++)
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
      const a = n[t], c = t - t % 3;
      if (o = c + (t + 2) % 3, a === -1) {
        if (r === 0) break;
        t = ue[--r];
        continue;
      }
      const l = a - a % 3, h = c + (t + 1) % 3, f = l + (a + 2) % 3, u = e[o], g = e[t], x = e[h], d = e[f];
      if (Pr(
        s[2 * u],
        s[2 * u + 1],
        s[2 * g],
        s[2 * g + 1],
        s[2 * x],
        s[2 * x + 1],
        s[2 * d],
        s[2 * d + 1]
      )) {
        e[t] = d, e[a] = u;
        const B = n[f];
        if (B === -1) {
          let y = this._hullStart;
          do {
            if (this._hullTri[y] === f) {
              this._hullTri[y] = t;
              break;
            }
            y = this._hullPrev[y];
          } while (y !== this._hullStart);
        }
        this._link(t, B), this._link(a, n[o]), this._link(o, f);
        const m = l + (a + 1) % 3;
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
function Pr(i, t, e, n, s, r, o, a) {
  const c = i - o, l = t - a, h = e - o, f = n - a, u = s - o, g = r - a, x = c * c + l * l, d = h * h + f * f, S = u * u + g * g;
  return c * (f * S - d * g) - l * (h * S - d * u) + x * (h * g - f * u) < 0;
}
function $r(i, t, e, n, s, r) {
  const o = e - i, a = n - t, c = s - i, l = r - t, h = o * o + a * a, f = c * c + l * l, u = 0.5 / (o * l - a * c), g = (l * h - a * f) * u, x = (o * f - c * h) * u;
  return g * g + x * x;
}
function Xr(i, t, e, n, s, r) {
  const o = e - i, a = n - t, c = s - i, l = r - t, h = o * o + a * a, f = c * c + l * l, u = 0.5 / (o * l - a * c), g = i + (l * h - a * f) * u, x = t + (o * f - c * h) * u;
  return { x: g, y: x };
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
    const a = i[r], c = t[a];
    for (; ; ) {
      do
        r++;
      while (t[i[r]] < c);
      do
        o--;
      while (t[i[o]] > c);
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
function Rr(i) {
  return i[0];
}
function Yr(i) {
  return i[1];
}
class Lr {
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
      let s = 0;
      for (; this.bs[n] && s < this.width; )
        this.bs[n] & 1 << s && t(n * this.width + s), s++;
    }
    return this;
  }
}
class fn extends Lr {
  constructor(t) {
    super(8, new Uint8Array(Math.ceil(t / 8)).fill(0));
  }
}
function At(i) {
  return i % 3 === 2 ? i - 2 : i + 1;
}
function Mt(i) {
  return i % 3 === 0 ? i + 2 : i - 1;
}
function hn(i, t, e, n, s, r, o, a) {
  const c = dt(i, t, s, r, o, a), l = dt(e, n, s, r, o, a);
  if (c > 0 && l > 0 || c < 0 && l < 0)
    return !1;
  const h = dt(s, r, i, t, e, n), f = dt(o, a, i, t, e, n);
  return h > 0 && f > 0 || h < 0 && f < 0 ? !1 : c === 0 && l === 0 && h === 0 && f === 0 ? !(Math.max(s, o) < Math.min(i, e) || Math.max(i, e) < Math.min(s, o) || Math.max(r, a) < Math.min(t, n) || Math.max(t, n) < Math.min(r, a)) : !0;
}
class qr {
  /**
   * The triangulation object from Delaunator.
   */
  del;
  constructor(t) {
    this.del = t;
  }
}
class Zt extends qr {
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
    const { triangles: n, halfedges: s } = this.del;
    this.assertVertex(t, t, e), this.assertVertex(e, t, e), this.assertInTriangulation(t, t, e), this.assertInTriangulation(e, t, e);
    const r = this.vertMap[t], o = this.maxConstrainSteps();
    let a = 0, c = r;
    do {
      if (++a > o)
        throw new Error(
          `Constraining edge [${t}, ${e}] exceeded the iteration limit`
        );
      const f = n[c], u = At(c);
      if (f === e)
        return this.protect(c);
      const g = Mt(c), x = n[g];
      if (x === e)
        return this.protect(u), u;
      if (this.intersectSegments(t, e, x, f)) {
        c = g;
        break;
      }
      c = s[u];
    } while (c !== -1 && c !== r);
    let l = c, h = -1;
    for (; c !== -1; ) {
      if (++a > o)
        throw new Error(
          `Constraining edge [${t}, ${e}] exceeded the iteration limit`
        );
      const f = s[c], u = Mt(c), g = Mt(f), x = At(f);
      if (f === -1)
        throw new Error("Constraining edge exited the hull");
      if (this.consd.has(c))
        throw new Error("Edge intersects already constrained edge");
      if (this.isCollinear(t, e, n[c]) || this.isCollinear(t, e, n[f]))
        throw new Error("Constraining edge intersects point");
      if (!this.intersectSegments(
        n[c],
        n[f],
        n[u],
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
          n[x],
          n[g]
        ))
          c = x;
        else if (h === c)
          throw new Error("Infinite loop: no further intersect after non-convex");
        continue;
      }
      if (this.flipDiagonal(c), this.intersectSegments(
        t,
        e,
        n[u],
        n[g]
      ) && (h === -1 && (h = u), h === u))
        throw new Error("Infinite loop: flipped diagonal still intersects");
      n[g] === e ? (l = g, c = h, h = -1) : this.intersectSegments(
        t,
        e,
        n[x],
        n[g]
      ) && (c = x);
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
    const { halfedges: e } = this.del, n = this.flips, s = this.consd, r = e.length;
    let o;
    do {
      o = 0;
      for (let a = 0; a < r; a++) {
        if (s.has(a))
          continue;
        n.delete(a);
        const c = e[a];
        c !== -1 && (n.delete(c), this.isDelaunay(a) || (this.flipDiagonal(a), o++));
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
    const { triangles: n, halfedges: s } = this.del, r = n.length / 3, o = (x, d, S) => {
      const B = t(d), m = t(S);
      return t(x).some((y) => B.includes(y) && m.includes(y));
    }, a = (x) => o(n[x * 3], n[x * 3 + 1], n[x * 3 + 2]), c = (x, d, S, B) => Math.sign(dt(x[d * 2], x[d * 2 + 1], x[S * 2], x[S * 2 + 1], x[B * 2], x[B * 2 + 1])), l = e.map((x) => {
      let d = 0;
      for (let S = 0; S < r; S++) d += c(x, n[S * 3], n[S * 3 + 1], n[S * 3 + 2]);
      return d < 0 ? -1 : 1;
    }), h = (x) => {
      if (this.consd.has(x)) return !1;
      const d = s[x];
      if (d === -1) return !1;
      const S = n[x], B = n[At(x)], m = n[Mt(x)], y = n[Mt(d)];
      return e.every((p, w) => c(p, m, S, y) === l[w] && c(p, y, B, m) === l[w]);
    };
    let f = 0, u = !0;
    for (; u; ) {
      u = !1;
      for (let x = 0; x < r; x++)
        if (a(x))
          for (let d = 0; d < 3; d++) {
            const S = x * 3 + d;
            if (!h(S)) continue;
            const B = s[S], m = n[S], y = n[At(S)], p = n[Mt(S)], w = n[Mt(B)];
            if (!(o(p, m, w) && o(w, y, p))) {
              this.protect(this.flipDiagonal(S)), f++, u = !0;
              break;
            }
          }
    }
    let g = 0;
    for (let x = 0; x < r; x++) a(x) && g++;
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
    const n = this.vertMap[e], { triangles: s, halfedges: r } = this.del;
    if (!(n < s.length))
      return 1 / 0;
    let o = n, a, c = 0;
    do {
      if (++c > s.length)
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
    const { triangles: e, halfedges: n } = this.del, s = this.flips, r = this.consd, o = n[t], a = Mt(t), c = At(t), l = Mt(o), h = At(o), f = n[a], u = n[l];
    if (r.has(t))
      throw new Error("Trying to flip a constrained edge");
    return e[t] = e[l], n[t] = u, s.set(t, s.has(l)) || r.set(t, r.has(l)), u !== -1 && (n[u] = t), n[a] = l, e[o] = e[a], n[o] = f, s.set(o, s.has(a)) || r.set(o, r.has(a)), f !== -1 && (n[f] = o), n[l] = a, this.markFlip(t), this.markFlip(c), this.markFlip(o), this.markFlip(h), s.add(a), r.delete(a), s.add(l), r.delete(l), this.updateVert(t), this.updateVert(c), this.updateVert(o), this.updateVert(h), a;
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
    return rr(
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
    const r = e[Mt(t)], o = e[t], a = e[At(t)], c = e[Mt(s)];
    return !this.inCircle(r, o, a, c);
  }
  /**
   * Update the vertex -> incoming edge map.
   */
  updateVert(t) {
    const { triangles: e, halfedges: n } = this.del, s = this.vertMap, r = e[t];
    let o = Mt(t), a = n[o];
    for (; a !== -1 && a !== t; )
      o = Mt(a), a = n[o];
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
function Ne(i, t, e, n, s) {
  if (t || (t = []), typeof i != "object" || i.type !== "FeatureCollection")
    throw "Argument points must be FeatureCollection";
  if (!Array.isArray(t)) throw "Argument points must be Array of Array";
  const r = i.features.map(
    (d) => d.geometry.coordinates
  );
  let o = s?.snapshot ? Zt.restore(s.snapshot) : void 0;
  const a = o ? void 0 : Xe.from(r);
  let c = o ? o.del : a, l = 0, h;
  const f = [];
  if (c.triangles.length !== 0 && (t.length !== 0 || n)) {
    if (!o) {
      o = new Zt(c);
      try {
        o.constrainAll(t);
      } catch (B) {
        if (!n?.allowUnusableBoundary) throw B;
        return { tin: xt([]), remaining: 0, hasBoundary: !1, hull: [] };
      }
      s && (s.snapshot = o.snapshot());
    }
    const d = n ? s?.snapshot ?? o.snapshot() : void 0, S = (B) => {
      const m = Zt.restore(d);
      return m.constrainAll(B), m;
    };
    for (const B of n?.hull ?? [])
      try {
        o.constrainOne(B[0], B[1]), f.push(B);
      } catch {
        o = S(f);
      }
    n?.boundary && (h = Vr(o, n.boundary), h || (o = S(f))), n && ({ remaining: l } = o.forbidGroupTriangles(
      n.groupsOf,
      n.planes
    ), l -= h?.size ?? 0), c = o.del;
  }
  const u = [];
  for (let d = 0; d < c.triangles.length; d += 3)
    h?.has(d / 3) || u.push([c.triangles[d], c.triangles[d + 1], c.triangles[d + 2]]);
  const g = ["a", "b", "c"];
  return { tin: xt(
    u.map((d) => {
      const S = {}, B = d.map((m, y) => {
        const p = i.features[m], w = p.geometry.coordinates, M = [w[0], w[1]];
        return w.length === 3 ? M[2] = w[2] : S[g[y]] = p.properties[e], M;
      });
      return B[3] = B[0], re([B], S);
    })
  ), remaining: l, hasBoundary: h !== void 0, hull: f };
}
function Vr(i, t) {
  try {
    i.constrainAll(t);
  } catch {
    return;
  }
  const e = new Map(t), { triangles: n, halfedges: s } = i.del, r = (l) => {
    const h = n[l], f = n[At(l)];
    return e.get(h) === f || e.get(f) === h;
  }, o = /* @__PURE__ */ new Set(), a = [], c = (l) => {
    const h = Math.floor(l / 3);
    o.has(h) || (o.add(h), a.push(h));
  };
  for (let l = 0; l < s.length; l++)
    s[l] === -1 && !r(l) && c(l);
  for (let l = 0; l < a.length; l++)
    for (let h = a[l] * 3; h < a[l] * 3 + 3; h++) {
      if (!e.has(n[h])) return;
      s[h] !== -1 && !r(h) && c(s[h]);
    }
  return o;
}
function un(i) {
  const t = /* @__PURE__ */ new Set(), e = [];
  if (i.forEach(([c, l], h) => {
    const f = `${c}:${l}`;
    t.has(f) || (t.add(f), e.push({ i: h, x: c, y: l }));
  }), e.length < 3) return [];
  const n = (c, l, h) => dt(c.x, c.y, l.x, l.y, h.x, h.y), s = [...e].sort((c, l) => c.x - l.x || c.y - l.y), r = (c) => {
    const l = [];
    for (const h of c) {
      for (; l.length >= 2 && n(l[l.length - 2], l[l.length - 1], h) <= 0; ) l.pop();
      l.push(h);
    }
    return l.pop(), l;
  }, o = [...r(s), ...r([...s].reverse())];
  if (o.length < 3) return [];
  const a = [];
  for (let c = 0; c < o.length; c++) {
    const l = o[c], h = o[(c + 1) % o.length], f = h.x - l.x, u = h.y - l.y, g = f * f + u * u, x = e.filter((S) => S !== l && S !== h && n(l, h, S) === 0).map((S) => ({ r: S, t: ((S.x - l.x) * f + (S.y - l.y) * u) / g })).filter(({ t: S }) => S > 0 && S < 1).sort((S, B) => S.t - B.t).map(({ r: S }) => S), d = [l, ...x, h];
    for (let S = 0; S + 1 < d.length; S++) a.push([d[S].i, d[S + 1].i]);
  }
  return a;
}
function ye([i, t]) {
  return i < t ? `${i}-${t}` : `${t}-${i}`;
}
function Kt(i, t, e) {
  return Yt(i, { target: { geom: t, index: e } });
}
function Wt(i) {
  return Yt(i.properties.target.geom, {
    target: {
      geom: i.geometry.coordinates,
      index: i.properties.target.index
    }
  });
}
function dn(i, t) {
  const e = i.length, n = t.geometry.coordinates;
  return Array.from({ length: e }, (s, r) => r).map((s) => {
    const r = (s + 1) % e, o = i[s], a = i[r], c = o.geometry.coordinates, l = Math.atan2(
      c[0] - n[0],
      c[1] - n[1]
    ), h = [t, o, a, t].map(
      (g) => g.geometry.coordinates
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
    return [l, u];
  }).reduce(
    (s, r) => (s[0].push(r[0]), s[1].push(r[1]), s),
    [[], []]
  );
}
const jr = [0.1, 0.15, 0.225, 0.34, 0.5];
function Ur(i, t) {
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
    const [a, c, l] = n.geometry.coordinates[0];
    pn(a, c, l) * pn(s.geom, r.geom, o.geom) * t <= 0 && e++;
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
    const c = (e * (n[(o + 1) % n.length] - n[o]) + s) % s;
    if (!(c > 0 && c < Math.PI)) return !1;
    r += c;
  }
  return Math.abs(r - s) < 1e-6;
}
function zr(i, t) {
  const e = new Set(
    t.forw.map(({ geometry: s }) => String(s.coordinates))
  ), n = new Set(
    t.bakw.map(({ geometry: s }) => String(s.coordinates))
  );
  return i.filter(({ forw: s, bakw: r }) => {
    const o = String(s), a = String(r);
    return e.has(o) || n.has(a) ? !1 : (e.add(o), n.add(a), !0);
  });
}
function gn(i, t, e, n, s, r = /* @__PURE__ */ new Set(), o) {
  const { minx: a, maxx: c, miny: l, maxy: h, centroid: f } = i, u = c - a, g = h - l, x = e.forw.length, d = Array.from({ length: x }, () => []);
  let S = 1;
  for (const [_, I] of e.edges)
    _ < n && d[_].push(S), d[I].push(S), I < n && S++;
  const B = (_) => _.slice(0, x).map(({ geometry: I }) => I.coordinates), m = un(B(e.forw)), y = {
    forw: m.filter((_) => !r.has(ye(_))),
    bakw: un(B(e.bakw))
  }, p = [0], w = (_) => _ >= x ? p : d[_];
  let M;
  for (const _ of jr) {
    const I = o?.get(_) ?? { forwReuse: {} };
    o?.set(_, I);
    const E = I.vertices ?? (I.vertices = zr(
      t(
        {
          ...i,
          minx: a - _ * u,
          maxx: c + _ * u,
          miny: l - _ * g,
          maxy: h + _ * g
        },
        !0
      ),
      e
    ));
    if (s && (E.length < 4 || !E.every(({ bakw: Y }) => Y.every(Number.isFinite)))) continue;
    const O = E.map(
      ({ forw: Y, bakw: j }, V) => Kt(Y, j, `b${V}`)
    ), T = xt([...e.forw, ...O]), D = xt([
      ...e.bakw,
      ...O.map(Wt)
    ]), X = [T, D].map(
      ({ features: Y }) => Float64Array.from(
        Y.flatMap(
          ({
            geometry: {
              coordinates: [j, V]
            }
          }) => [j, V]
        )
      )
    ), A = s !== void 0 || mn(
      E.map((Y) => Y.forw),
      f.forw,
      -1
    ) && mn(
      E.map((Y) => Y.bakw),
      f.bakw,
      1
    ) ? E.map((Y, j) => [
      x + j,
      x + (j + 1) % E.length
    ]) : void 0, k = { groupsOf: w, planes: X, boundary: A, allowUnusableBoundary: s !== void 0 }, C = s?.orientation ?? -1, N = Ne(
      T,
      e.edges,
      "target",
      { ...k, hull: y.forw },
      I.forwReuse
    ), P = I.geographic ?? (I.geographic = (() => {
      const Y = Ne(D, e.edges, "target", {
        ...k,
        hull: y.bakw
      });
      return { built: Y, flips: ve(Y.tin, C) };
    })()), b = P.built, F = N.tin, $ = {
      ...b.tin,
      features: [...b.tin.features]
    }, R = ve(F, C) + P.flips, q = {
      vertices: E,
      forw: F,
      bakw: $,
      diagnostics: {
        margin: _,
        boundaryTriangleFlips: R,
        remainingForbiddenTriangles: N.remaining + b.remaining
      },
      hasMapBoundary: N.hasBoundary,
      hasBoundary: N.hasBoundary && b.hasBoundary,
      forwHull: { all: m, applied: N.hull }
    };
    if (s) {
      if (s.accept(q)) return q;
      continue;
    }
    if (R === 0 && q.hasBoundary)
      return q;
    Ur(q, M) && (M = q);
  }
  return M;
}
const Hr = 256 * Number.EPSILON, Nn = 4, Gr = 1e-9;
function Kr(i) {
  const t = Math.abs(i);
  if (!Number.isFinite(t)) return NaN;
  const e = new DataView(new ArrayBuffer(8));
  e.setFloat64(0, t);
  const n = e.getUint32(0) >>> 20 & 2047;
  return Math.pow(2, Math.max(n, 1) - 1023 - 52);
}
function Wr(i) {
  let t = 0;
  for (const e of i)
    t = Math.max(t, Math.abs(e[0]), Math.abs(e[1]));
  return t;
}
function Jr(i, t, e = Nn) {
  const n = (r) => {
    let o = 0;
    for (let c = 1; c < r.length; c++)
      o += Math.sqrt(
        Math.pow(r[c][0] - r[c - 1][0], 2) + Math.pow(r[c][1] - r[c - 1][1], 2)
      );
    const a = Kr(Wr(r)) / o;
    return Number.isFinite(a) ? a : 0;
  }, s = Hr + e * (n(i) + n(t));
  return Math.min(s, Gr);
}
function Qr(i, t, e) {
  const n = new Int32Array(i.length).fill(-1), s = new Int32Array(t.length).fill(-1), r = i.length - 2, o = t.length - 2;
  if (r < 1 || o < 1) return { illstToMerc: n, mercToIllst: s };
  const a = (w, M) => Math.abs(t[M + 1][3] - i[w + 1][3]) <= e;
  let c = r, l = -1, h = o, f = -1;
  for (let w = 0; w < r; w++)
    for (let M = 0; M < o; M++)
      a(w, M) && (c = Math.min(c, w), l = Math.max(l, w), h = Math.min(h, M), f = Math.max(f, M));
  if (l < 0) return { illstToMerc: n, mercToIllst: s };
  const u = l - c + 1, g = f - h + 1, x = g + 1, d = new Int32Array((u + 1) * x), S = new Float64Array((u + 1) * x), B = new Uint8Array((u + 1) * x), m = (w, M, _, I) => w > _ || w === _ && M < I;
  for (let w = 1; w <= u; w++)
    for (let M = 1; M <= g; M++) {
      const _ = w * x + M, I = _ - x, E = _ - 1;
      let O = d[I], T = S[I], D = 0;
      m(d[E], S[E], O, T) && (O = d[E], T = S[E], D = 1);
      const X = c + w - 1, v = h + M - 1;
      if (a(X, v)) {
        const A = I - 1, k = d[A] + 1, C = S[A] + Math.abs(t[v + 1][3] - i[X + 1][3]);
        m(k, C, O, T) && (O = k, T = C, D = 2);
      }
      d[_] = O, S[_] = T, B[_] = D;
    }
  let y = u, p = g;
  for (; y > 0 && p > 0; ) {
    const w = B[y * x + p];
    if (w === 2) {
      const M = c + y - 1 + 1, _ = h + p - 1 + 1;
      n[M] = _, s[_] = M, y--, p--;
    } else w === 0 ? y-- : p--;
  }
  return { illstToMerc: n, mercToIllst: s };
}
function Zr(i, t, e = Nn) {
  const n = Jr(i, t, e), s = [i, t].map((h) => {
    const f = h.map((g, x, d) => {
      if (x === 0) return 0;
      const S = d[x - 1];
      return Math.sqrt(
        Math.pow(g[0] - S[0], 2) + Math.pow(g[1] - S[1], 2)
      );
    }), u = f.reduce((g, x, d) => d === 0 ? [0] : (g.push(g[d - 1] + x), g), []);
    return u.map((g, x, d) => {
      const S = g / d[d.length - 1];
      return [h[x], f[x], u[x], S];
    });
  }), { illstToMerc: r, mercToIllst: o } = Qr(s[0], s[1], n), a = [r, o], c = (h, f) => {
    for (let u = 1; u < f.length - 1; u++)
      if (Math.abs(f[u][3] - h) <= n) return !0;
    return !1;
  }, l = [];
  return s.forEach((h, f) => {
    const u = s[f ? 0 : 1];
    h.forEach((g, x) => {
      if (x === 0 || x === h.length - 1) return;
      const d = g[0], S = g[3], B = a[f][x];
      if (B >= 0) {
        f === 0 && l.push([d, u[B][0], S]);
        return;
      }
      if (!c(S, u))
        for (let m = 0; m < u.length - 1; m++) {
          const y = u[m], p = u[m + 1], w = y[3], M = p[3];
          if (w < S && M > S) {
            const _ = (S - w) / (M - w), I = [
              (p[0][0] - y[0][0]) * _ + y[0][0],
              (p[0][1] - y[0][1]) * _ + y[0][1]
            ];
            l.push(
              f === 0 ? [d, I, S] : [I, d, S]
            );
            return;
          }
        }
    });
  }), l.sort((h, f) => h[2] - f[2]);
}
const wn = 1e-9;
function ti(i, t) {
  const e = [[], [], [], []], n = [];
  return Object.keys(i).forEach((s) => {
    const r = i[s], o = r.forw, a = r.bakw, c = [
      o[0] - t.forw[0],
      o[1] - t.forw[1]
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
function ei(i) {
  let t = 1 / 0, e = 0, n = 0;
  return i.forEach((s) => {
    const { forw: r, bakw: o } = s, a = Math.hypot(r[0], r[1]), c = Math.hypot(o[0], o[1]);
    if (c === 0) return;
    const l = a / c, h = Math.atan2(r[0], r[1]) - Math.atan2(o[0], o[1]);
    t = Math.min(t, l), e += Math.cos(h), n += Math.sin(h);
  }), isFinite(t) ? [t, Math.atan2(n, e)] : [1, 0];
}
function ni(i, t, e) {
  const { perQuad: n, aggregate: s } = ti(i, t), r = n.every((c) => c.length > 0), a = (e === "birdeye" ? r ? n : [s] : [s]).map((c) => ei(c));
  return a.length === 1 ? [a[0], a[0], a[0], a[0]] : a;
}
function ri(i, t) {
  let e = 0;
  return i[0] > t[0] && (e += 1), i[1] > t[1] && (e += 2), e;
}
function ii(i, t, e) {
  const n = [
    i[0] - t.forw[0],
    i[1] - t.forw[1]
  ], r = Math.sqrt(n[0] ** 2 + n[1] ** 2) / e[0], o = Math.atan2(n[0], n[1]) - e[1];
  return [
    t.bakw[0] + r * Math.sin(o),
    t.bakw[1] - r * Math.cos(o)
  ];
}
function si(i, t, e, n) {
  const s = t[0] - i[0], r = t[1] - i[1];
  if (Math.abs(s) < 1e-12 && Math.abs(r) < 1e-12) return null;
  const o = n[0] - e[0], a = n[1] - e[1], c = e[0] - i[0], l = e[1] - i[1], h = s * a - r * o;
  if (Math.abs(h) < 1e-12) return null;
  const f = (c * a - l * o) / h, u = (c * r - l * s) / h;
  return f <= 1e-10 || u < -1e-10 || u > 1 + 1e-10 ? null : { t: f, point: [i[0] + f * s, i[1] + f * r] };
}
function oi(i, t, e) {
  const n = e.length;
  let s = -1 / 0, r = null;
  for (let o = 0; o < n; o++) {
    const a = (o + 1) % n, c = si(
      i,
      t,
      e[o].bakw,
      e[a].bakw
    );
    c && c.t > s && (s = c.t, r = c.point);
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
  const c = [];
  if (o !== 0)
    for (const h of [e, n]) {
      const f = (h - i[0]) / o;
      if (f > 0) {
        const u = i[1] + f * a;
        u >= s && u <= r && c.push({ t: f, x: h, y: u });
      }
    }
  if (a !== 0)
    for (const h of [s, r]) {
      const f = (h - i[1]) / a;
      if (f > 0) {
        const u = i[0] + f * o;
        u >= e && u <= n && c.push({ t: f, x: u, y: h });
      }
    }
  if (c.length === 0) return null;
  c.sort((h, f) => h.t - f.t);
  const l = c[0];
  return [l.x, l.y];
}
function bn(i, t, e) {
  const n = i.length, s = new Array(n).fill(1);
  for (const r of t)
    for (let o = 0; o < n; o++) {
      const a = (o + 1) % n, c = Ve([i[o].bakw, i[a].bakw]), l = Ve([e.bakw, r.bakw]), h = br(c, l);
      if (h.features.length > 0 && h.features[0].geometry) {
        const f = h.features[0], u = Math.sqrt(
          Math.pow(r.bakw[0] - e.bakw[0], 2) + Math.pow(r.bakw[1] - e.bakw[1], 2)
        ), g = Math.sqrt(
          Math.pow(f.geometry.coordinates[0] - e.bakw[0], 2) + Math.pow(f.geometry.coordinates[1] - e.bakw[1], 2)
        ), x = u / g;
        x > s[o] && (s[o] = x), x > s[a] && (s[a] = x);
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
function Re(i, t, e, n) {
  const { convexBuf: s, centroid: r, allGcps: o, minx: a, maxx: c, miny: l, maxy: h } = i, f = n ? void 0 : ni(s, r, t), g = [
    [a, l],
    [c, l],
    [c, h],
    [a, h]
  ].map((_) => ({
    forw: _,
    bakw: n ? n(_) : ii(
      _,
      r,
      f[ri(_, r.forw)]
    )
  }));
  if (g.sort(
    (_, I) => Math.atan2(_.forw[0] - r.forw[0], _.forw[1] - r.forw[1]) - Math.atan2(I.forw[0] - r.forw[0], I.forw[1] - r.forw[1])
  ), n || bn(g, o, r), !e) return g;
  const x = 4, d = g.map(
    (_) => Math.atan2(_.forw[0] - r.forw[0], _.forw[1] - r.forw[1])
  ), S = g.map(
    (_) => Math.atan2(
      _.bakw[0] - r.bakw[0],
      -(_.bakw[1] - r.bakw[1])
    )
  );
  function B(_) {
    for (let I = 0; I < x; I++) {
      const E = (I + 1) % x, O = d[I], T = I < x - 1 ? d[E] : d[E] + 2 * Math.PI;
      let D = _;
      for (; D < O; ) D += 2 * Math.PI;
      for (; D >= O + 2 * Math.PI; ) D -= 2 * Math.PI;
      if (D >= O && D < T)
        return { i: I, j: E, frac: (D - O) / (T - O) };
    }
    return { i: 0, j: 1, frac: 0 };
  }
  function m(_) {
    const { i: I, j: E, frac: O } = B(_), T = S[I];
    let X = S[E] - T;
    for (; X > Math.PI; ) X -= 2 * Math.PI;
    for (; X < -Math.PI; ) X += 2 * Math.PI;
    return T + O * X;
  }
  const y = new Set(
    g.map(
      (_) => Math.floor(yn(_.forw, r.forw) / 10) % 36
    )
  ), p = o.map((_) => ({
    forw: _.forw,
    bakw: _.bakw,
    angleDeg: yn(_.forw, r.forw),
    forwDist: Math.hypot(_.forw[0] - r.forw[0], _.forw[1] - r.forw[1])
  })), w = [];
  for (let _ = 0; _ < 36; _++) {
    if (y.has(_)) continue;
    const I = _ * 10, E = p.filter((P) => {
      if (P.forwDist === 0) return !1;
      const b = ((P.angleDeg - I) % 360 + 360) % 360;
      return b < 10 + wn || b > 360 - wn;
    });
    let O = null;
    if (E.length > 0) {
      const P = E.reduce((b, F) => F.forwDist > b.forwDist ? F : b);
      O = vn(r.forw, P.forw, a, c, l, h);
    }
    if (!O) {
      const P = (I + 5) % 360 * (Math.PI / 180), b = [
        r.forw[0] + Math.sin(P),
        r.forw[1] + Math.cos(P)
      ];
      O = vn(r.forw, b, a, c, l, h);
    }
    if (!O) continue;
    const [T, D] = O, X = 1e-9 * Math.max(c - a, h - l);
    if ([...g, ...w].some(
      (P) => Math.abs(P.forw[0] - T) <= X && Math.abs(P.forw[1] - D) <= X
    )) continue;
    if (n) {
      w.push({ forw: O, bakw: n(O) });
      continue;
    }
    const v = [O[0] - r.forw[0], O[1] - r.forw[1]], A = Math.atan2(v[0], v[1]), k = m(A), C = [
      r.bakw[0] + Math.sin(k),
      r.bakw[1] - Math.cos(k)
    ], N = oi(r.bakw, C, g);
    N && w.push({ forw: O, bakw: N });
  }
  const M = [...g, ...w];
  return M.sort(
    (_, I) => Math.atan2(_.forw[0] - r.forw[0], _.forw[1] - r.forw[1]) - Math.atan2(I.forw[0] - r.forw[0], I.forw[1] - r.forw[1])
  ), n || bn(M, o, r), M;
}
function ai(i, t = !1) {
  return Re(i, "plain", t);
}
function ci(i, t = !1) {
  return Re(i, "birdeye", t);
}
function li(i, t) {
  const e = /* @__PURE__ */ new Set();
  return Re(i, "plain", !0, t).filter(({ forw: [n, s] }) => {
    const r = `${n}:${s}`;
    return e.has(r) ? !1 : (e.add(r), !0);
  });
}
function Gi(i) {
  return Dn(i, 1 / 0);
}
const xn = 1e5, fi = 16;
function Dn(i, t) {
  return hi(i), new ui(i).findSegmentIntersections(t).map(
    (s) => Yt([s.x, s.y])
  );
}
function hi(i) {
  for (let t = 0, e = i.length; t < e; t++) {
    const n = i[t];
    ee(n) || Rt(
      "findIntersections() received invalid coordinates:",
      `line=${t}`,
      `points=${n}`
    );
    for (let s = 0, r = n.length; s < r; s++) {
      const o = n[s];
      (!ee(o) || !Number.isFinite(o[0]) || !Number.isFinite(o[1])) && Rt(
        "findIntersections() received non-finite coordinates:",
        `line=${t}`,
        `point=${s}`,
        `coordinates=${JSON.stringify(o)}`
      );
    }
  }
}
class ui {
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
    (r != this._xx.length || this._xx.length != this._yy.length) && Rt("ArcCollection#initXYData() Counting error"), this.initBounds(), this._arcIter = new Fi(this._xx, this._yy);
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
    let a = 0, c, l, h;
    for (let f = 0; f < s; f++)
      c = n[f], c > 0 && (l = f * 4, h = Ci(t, e, a, c), r[l++] = h[0], r[l++] = h[1], r[l++] = h[2], r[l] = h[3], a += c, o.mergeBounds(h));
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
    let c = n ? this._ii[s] : this._ii[s] + o - 1, l = c, h = 0;
    for (let f = 1; f < o; f++)
      l += a, (r === 0 || this._zz[l] >= r) && (e(c, l, this._xx, this._yy), c = l, h++);
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
    const e = this.getBounds(), n = e.ymin || 0, s = (e.ymax || 0) - n, r = this.calcSegmentIntersectionStripeCount(), o = new Uint32Array(r), a = r > 1 ? (y) => Math.floor((r - 1) * (y - n) / s) : () => 0, c = r + 1;
    let l;
    this.forEachSegment(
      (y, p, w, M) => {
        let _ = a(M[y]);
        const I = a(M[p]);
        let E = 0;
        for (; o[_] = o[_] + 2, _ != I; )
          E++, E > c && Rt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${r}`,
            `s1=${_}`,
            `s2=${I}`
          ), _ += I > _ ? 1 : -1;
      }
    );
    const h = this.getUint32Array(mi(o));
    let f = 0;
    const u = [];
    gi(o, (y) => {
      const p = f;
      f += y, u.push(h.subarray(p, f));
    }), wi(o, 0), this.forEachSegment(
      (y, p, w, M) => {
        let _ = a(M[y]);
        const I = a(M[p]);
        let E, O, T = 0;
        for (; E = o[_], o[_] = E + 2, O = u[_], O[E] = y, O[E + 1] = p, _ != I; )
          T++, T > c && Rt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${r}`,
            `s1=${_}`,
            `s2=${I}`
          ), _ += I > _ ? 1 : -1;
      }
    );
    const g = this.getVertexData(), x = t * fi;
    let d = 0;
    const S = /* @__PURE__ */ new Set(), B = /* @__PURE__ */ new Map(), m = (y) => {
      d++;
      const p = Ti(y);
      return S.has(p) || (S.add(p), B.set(`${y.x}:${y.y}`, y)), B.size >= t || d >= x;
    };
    if (g.xx && g.yy)
      for (l = 0; l < r && !yi(u[l], g.xx, g.yy, m); l++)
        ;
    return Array.from(B.values());
  }
}
function Rt(...i) {
  const t = i.join(" ");
  throw new Error(t);
}
function ee(i) {
  return i ? pi(i) ? !0 : di(i) ? !1 : i.length === 0 ? !0 : i.length > 0 : !1;
}
function di(i) {
  return i != null && i.toString === String.prototype.toString;
}
function pi(i) {
  return Array.isArray(i);
}
function mi(i, t) {
  ee(i) || Rt("utils.sum() expects an array, received:", i);
  let e = 0, n;
  for (let s = 0, r = i.length; s < r; s++)
    n = i[s], n && (e += n);
  return e;
}
function gi(i, t, e) {
  if (!ee(i))
    throw new Error(`#forEach() takes an array-like argument. ${i}`);
  for (let n = 0, s = i.length; n < s; n++)
    t.call(e, i[n], n);
}
function wi(i, t) {
  for (let e = 0, n = i.length; e < n; e++)
    i[e] = t;
  return i;
}
function yi(i, t, e, n) {
  const s = i.length - 2;
  let r, o, a, c, l, h, f, u, g, x, d, S, B, m, y, p, w;
  for (Ii(t, i), p = 0; p < s; ) {
    for (r = i[p], o = i[p + 1], l = t[r], h = t[o], g = e[r], x = e[o], w = p; w < s && (w += 2, a = i[w], f = t[a], !(h < f)); ) {
      if (d = e[a], c = i[w + 1], u = t[c], S = e[c], g >= d) {
        if (g > S && x > d && x > S) continue;
      } else if (g < S && x < d && x < S) continue;
      if (!(r == a || r == c || o == a || o == c) && (B = vi(
        l,
        g,
        h,
        x,
        f,
        d,
        u,
        S
      ), B && (m = [r, o], y = [a, c], n(_n(B, m, y, t, e)) || B.length == 4 && n(_n(B.slice(2), m, y, t, e)))))
        return !0;
    }
    p += 2;
  }
  return !1;
}
function vi(i, t, e, n, s, r, o, a) {
  const c = bi(i, t, e, n, s, r, o, a);
  let l = null;
  return c && (l = xi(i, t, e, n, s, r, o, a), l ? Ai(i, t, e, n, s, r, o, a) && (l = null) : l = Ei(i, t, e, n, s, r, o, a)), l;
}
function bi(i, t, e, n, s, r, o, a) {
  return Jt(i, t, e, n, s, r) * Jt(i, t, e, n, o, a) <= 0 && Jt(s, r, o, a, i, t) * Jt(s, r, o, a, e, n) <= 0;
}
function Jt(i, t, e, n, s, r) {
  return Pn(i - s, t - r, e - s, n - r);
}
function Pn(i, t, e, n) {
  return i * n - t * e;
}
function xi(i, t, e, n, s, r, o, a) {
  let c = pe(i, t, e, n, s, r, o, a), l;
  return c && (l = _i(c[0], c[1], i, t, e, n, s, r, o, a), l == 1 ? c = pe(e, n, i, t, s, r, o, a) : l == 2 ? c = pe(s, r, o, a, i, t, e, n) : l == 3 && (c = pe(o, a, s, r, i, t, e, n))), c && ki(c, i, t, e, n, s, r, o, a), c;
}
function pe(i, t, e, n, s, r, o, a) {
  const c = Pn(e - i, n - t, o - s, a - r), l = 1e-18;
  let h;
  if (c === 0) return null;
  const f = Jt(s, r, o, a, i, t) / c;
  return c <= l && c >= -l ? h = Mi(i, t, e, n, s, r, o, a) : h = [i + f * (e - i), t + f * (n - t)], h;
}
function Mi(i, t, e, n, s, r, o, a) {
  let c = null;
  return !It(i, s, o) && !It(t, r, a) ? c = [i, t] : !It(e, s, o) && !It(n, r, a) ? c = [e, n] : !It(s, i, e) && !It(r, t, n) ? c = [s, r] : !It(o, i, e) && !It(a, t, n) && (c = [o, a]), c;
}
function It(i, t, e) {
  let n;
  return t < e ? n = i < t || i > e : t > e ? n = i > t || i < e : n = i != t, n;
}
function _i(i, t, ...e) {
  let n = -1, s = 1 / 0, r;
  for (let o = 0, a = 0, c = e.length; a < c; o++, a += 2)
    r = Si(i, t, e[a], e[a + 1]), r < s && (s = r, n = o);
  return n;
}
function Si(i, t, e, n) {
  const s = i - e, r = t - n;
  return s * s + r * r;
}
function ki(i, t, e, n, s, r, o, a, c) {
  let l = i[0], h = i[1];
  l = me(l, t, n), l = me(l, r, a), h = me(h, e, s), h = me(h, o, c), i[0] = l, i[1] = h;
}
function me(i, t, e) {
  let n;
  return It(i, t, e) && (n = Math.abs(i - t) < Math.abs(i - e) ? t : e, i = n), i;
}
function Ei(i, t, e, n, s, r, o, a) {
  const c = Math.min(i, e, s, o), l = Math.max(i, e, s, o), h = Math.min(t, n, r, a), f = Math.max(t, n, r, a), u = f - h > l - c;
  let g = [];
  return (u ? Dt(t, h, f) : Dt(i, c, l)) && g.push(i, t), (u ? Dt(n, h, f) : Dt(e, c, l)) && g.push(e, n), (u ? Dt(r, h, f) : Dt(s, c, l)) && g.push(s, r), (u ? Dt(a, h, f) : Dt(o, c, l)) && g.push(o, a), (g.length != 2 && g.length != 4 || g.length == 4 && g[0] == g[2] && g[1] == g[3]) && (g = null), g;
}
function Ai(i, t, e, n, s, r, o, a) {
  return i == s && t == r || i == o && t == a || e == s && n == r || e == o && n == a;
}
function Dt(i, t, e) {
  return i > t && i < e;
}
function Ii(i, t) {
  Bi(i, t), $n(i, t, 0, t.length - 2);
}
function Bi(i, t) {
  for (let e = 0, n = t.length; e < n; e += 2)
    i[t[e]] > i[t[e + 1]] && Oi(t, e, e + 1);
}
function Oi(i, t, e) {
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
    if (r - e < 40 ? Mn(i, t, e, r) : $n(i, t, e, r), n - s < 40) {
      Mn(i, t, s, n);
      return;
    }
    e = s, r = n;
  }
}
function Mn(i, t, e, n) {
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
  t = Sn(r, o, t[0], t[1], n, s), e = Sn(r, o, e[0], e[1], n, s);
  const a = t[0] < e[0] ? t : e, c = a == t ? e : t;
  return { x: r, y: o, a, b: c };
}
function Sn(i, t, e, n, s, r) {
  let o = e < n ? e : n, a = o === e ? n : e;
  return s[o] == i && r[o] == t ? a = o : s[a] == i && r[a] == t && (o = a), [o, a];
}
function Ti(i) {
  return `${i.a.join(",")};${i.b.join(",")}`;
}
class Fi {
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
function Ci(i, t, e, n) {
  let s = e | 0;
  const r = isNaN(n) ? i.length - s : n + s;
  let o, a, c, l, h, f;
  if (r > 0)
    c = h = i[s], l = f = t[s];
  else return [void 0, void 0, void 0, void 0];
  for (s++; s < r; s++)
    o = i[s], a = t[s], o < c && (c = o), o > h && (h = o), a < l && (l = a), a > f && (f = a);
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
  setBounds(t, e, n, s) {
    let r, o, a, c;
    if (arguments.length == 1)
      if (ee(t)) {
        const l = t;
        r = l[0], o = l[1], a = l[2], c = l[3];
      } else {
        const l = t;
        r = l.xmin, o = l.ymin, a = l.xmax, c = l.ymax;
      }
    else
      r = t, o = e, a = n, c = s;
    return this.xmin = r, this.ymin = o, this.xmax = a, this.ymax = c, (r > a || o > c) && this.update(), this;
  }
  update() {
    let t;
    this.xmin > this.xmax && (t = this.xmin, this.xmin = this.xmax, this.xmax = t), this.ymin > this.ymax && (t = this.ymin, this.ymin = this.ymax, this.ymax = t);
  }
  mergeBounds(t, ...e) {
    let n, s, r, o;
    return t instanceof ne ? (n = t.xmin, s = t.ymin, r = t.xmax, o = t.ymax) : e.length == 3 ? (n = t, s = e[0], r = e[1], o = e[2]) : t.length == 4 ? (n = t[0], s = t[1], r = t[2], o = t[3]) : Rt("Bounds#mergeBounds() invalid argument:", t), this.xmin === void 0 ? this.setBounds(n, s, r, o) : (n < this.xmin && (this.xmin = n), s < this.ymin && (this.ymin = s), r > this.xmax && (this.xmax = r), o > this.ymax && (this.ymax = o)), this;
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
function Xn(i, t, e) {
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
    const a = o.filter((c) => c !== t);
    a.length === 0 ? delete i[r] : i[r] = a;
  }), e) {
    const r = (o, a) => {
      !o || !a || (o.features = o.features.filter((c) => c !== a));
    };
    r(e.forw, t.forw), r(e.bakw, t.bakw);
  }
}
function ge(i, t = 1e-6) {
  const [e, n] = i[0], [s, r] = i[1], [o, a] = i[2];
  return Math.abs((s - e) * (a - n) - (o - e) * (r - n)) < t;
}
function Ni(i, t) {
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
const Di = 10;
function Pi(i, t, e, n, s, r) {
  if (!i && !t) return !1;
  const o = i ? 0 : 1, a = 1 - o, c = e[o], l = e[a];
  if (!c || !l) return !1;
  const h = bt(l.geom);
  let f = !1, u = !1;
  for (let g = 0; g <= 1; g++) {
    const x = n[g];
    if (!x) continue;
    const d = [String(x.prop.index), String(c.prop.index)].sort().join("-"), S = s[d];
    if (!S || S.length < 2) continue;
    const B = S.find(
      (T) => T.bakw !== r[o].bakw
    );
    if (!B) continue;
    const y = Qt(B.bakw).find(
      (T) => String(T.prop.index) !== String(x.prop.index) && String(T.prop.index) !== String(c.prop.index)
    );
    if (!y) continue;
    f = !0;
    const p = bt(y.geom), w = bt(x.geom), M = bt(c.geom), _ = M[0] - w[0], I = M[1] - w[1], E = _ * (h[1] - w[1]) - I * (h[0] - w[0]), O = _ * (p[1] - w[1]) - I * (p[0] - w[0]);
    if (E * O > 0) {
      u = !0;
      break;
    }
  }
  return f && !u;
}
function $i(i, t, e, n) {
  if (!i && !t) return !1;
  if (e[0] && e[1] && n[0] && n[1]) {
    const s = n.map((h) => bt(h.geom)), r = e.map((h) => bt(h.geom)), o = s[1][0] - s[0][0], a = s[1][1] - s[0][1], c = o * (r[0][1] - s[0][1]) - a * (r[0][0] - s[0][0]), l = o * (r[1][1] - s[0][1]) - a * (r[1][0] - s[0][0]);
    return c * l < 0;
  }
  return !1;
}
function Xi(i, t, e, n) {
  const s = Ni(e, n), r = /* @__PURE__ */ new Set();
  let o = !1;
  for (let a = 0; a < Di; a++) {
    let c = !1;
    for (const l of Object.keys(t)) {
      if (r.has(l)) continue;
      r.add(l);
      const h = t[l];
      if (!h || h.length < 2) continue;
      const f = l.split("-");
      if (f.length !== 2 || s.has(l)) continue;
      const u = Qt(h[0].bakw), g = Qt(h[1].bakw), x = Qt(h[0].forw), d = Qt(h[1].forw), S = f.map(
        (b) => u.find((F) => `${F.prop.index}` === b) || g.find((F) => `${F.prop.index}` === b)
      ), B = f.map(
        (b) => x.find((F) => `${F.prop.index}` === b) || d.find((F) => `${F.prop.index}` === b)
      );
      if (S.some((b) => !b) || B.some((b) => !b))
        continue;
      const m = [u, g].map(
        (b) => b.find((F) => !f.includes(`${F.prop.index}`))
      ), y = [x, d].map(
        (b) => b.find((F) => !f.includes(`${F.prop.index}`))
      );
      if (m.some((b) => !b) || y.some((b) => !b))
        continue;
      const p = h[0].bakw.geometry.coordinates[0].slice(0, 3).map((b) => bt(b)), w = h[1].bakw.geometry.coordinates[0].slice(0, 3).map((b) => bt(b)), M = h[0].forw.geometry.coordinates[0].slice(0, 3).map((b) => bt(b)), _ = h[1].forw.geometry.coordinates[0].slice(0, 3).map((b) => bt(b)), I = ge(p), E = ge(w), O = ge(M), T = ge(_), D = Pi(
        I,
        E,
        m,
        S,
        t,
        h
      ), X = $i(
        O,
        T,
        m,
        S
      );
      if (!(D || X || En(
        bt(m[0].geom),
        w
      ) || En(
        bt(m[1].geom),
        p
      )))
        continue;
      const A = B.map(
        (b) => bt(b.geom)
      ), k = y.map(
        (b) => bt(b.geom)
      ), C = Ri([
        ...A,
        ...k
      ]), N = Yi(C), P = An(
        A[0],
        A[1],
        k[0]
      ) + An(
        A[0],
        A[1],
        k[1]
      );
      De(N, P) && (kn(t, h[0], i), kn(t, h[1], i), S.forEach((b) => {
        if (!b) return;
        const F = [
          b.geom,
          m[0].geom,
          m[1].geom,
          b.geom
        ], $ = {
          a: b.prop,
          b: m[0].prop,
          c: m[1].prop
        }, R = re([F], $), q = On(R);
        Xn(t, {
          forw: q,
          bakw: R
        }, i);
      }), c = !0, o = !0);
    }
    if (!c) break;
  }
  return o;
}
function bt(i) {
  return [i[0], i[1]];
}
function En(i, t) {
  const [e, n] = t[0], [s, r] = t[1], [o, a] = t[2], c = o - e, l = a - n, h = s - e, f = r - n, u = i[0] - e, g = i[1] - n, x = c * c + l * l, d = c * h + l * f, S = c * u + l * g, B = h * h + f * f, m = h * u + f * g, y = x * B - d * d;
  if (y === 0) return !1;
  const p = 1 / y, w = (B * S - d * m) * p, M = (x * m - d * S) * p, _ = 1e-9;
  return w >= -_ && M >= -_ && w + M <= 1 + _;
}
function Ri(i) {
  const t = i.map((o) => o.slice()).filter(
    (o, a, c) => c.findIndex(
      (l) => De(l[0], o[0]) && De(l[1], o[1])
    ) === a
  );
  if (t.length <= 1) return t;
  const e = t.sort(
    (o, a) => o[0] === a[0] ? o[1] - a[1] : o[0] - a[0]
  ), n = (o, a, c) => (a[0] - o[0]) * (c[1] - o[1]) - (a[1] - o[1]) * (c[0] - o[0]), s = [];
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
function Yi(i) {
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
function De(i, t, e = 1e-9) {
  return Math.abs(i - t) <= e;
}
const Li = (i) => typeof i == "string" && i.startsWith("b");
function qi(i, t) {
  const e = (n, s) => {
    for (let r = 0; r < 3; r++) {
      const o = n.g[r], a = n.g[(r + 1) % 3];
      if (s.g.every((c) => n.sign * dt(o[0], o[1], a[0], a[1], c[0], c[1]) <= 0)) return !0;
    }
    return !1;
  };
  return !e(i, t) && !e(t, i);
}
function Vi(i, t, e) {
  if (t.length === 0) return [];
  const n = i.features.map((d) => {
    const { a: S, b: B, c: m } = d.properties, y = [S.geom, B.geom, m.geom], [p, w, M] = d.geometry.coordinates[0], _ = y.map(([T]) => T), I = y.map(([, T]) => T), E = Math.sign(dt(p[0], p[1], w[0], w[1], M[0], M[1])), O = Math.sign(dt(y[0][0], y[0][1], y[1][0], y[1][1], y[2][0], y[2][1]));
    return {
      ids: [S.index, B.index, m.index].map(String),
      g: y,
      sign: O,
      ratio: E * O,
      aux: [S.index, B.index, m.index].some(Li),
      minx: Math.min(..._),
      maxx: Math.max(..._),
      miny: Math.min(...I),
      maxy: Math.max(...I)
    };
  }), s = n.map((d) => d.ratio), r = s.reduce((d, S) => d + S, 0) < 0 ? -1 : 1, o = (d, S) => d < S ? `${d}|${S}` : `${S}|${d}`, a = /* @__PURE__ */ new Map();
  n.forEach((d, S) => {
    for (let B = 0; B < 3; B++) {
      const m = o(d.ids[B], d.ids[(B + 1) % 3]), y = a.get(m);
      y ? y.push(S) : a.set(m, [S]);
    }
  });
  const c = ([d, S]) => o(String(e[d]), String(e[S])), l = /* @__PURE__ */ new Set();
  for (const d of t) for (const S of a.get(c(d)) ?? []) l.add(S);
  const h = (d) => n[d].aux || l.has(d), f = /* @__PURE__ */ new Set();
  n.forEach((d, S) => {
    h(S) && (s[S] === 0 || s[S] !== r) && f.add(S);
  });
  const u = n.map((d, S) => S).sort((d, S) => n[d].minx - n[S].minx);
  for (let d = 0; d < u.length; d++) {
    const S = n[u[d]];
    if (S.sign !== 0)
      for (let B = d + 1; B < u.length; B++) {
        const m = n[u[B]];
        if (m.minx >= S.maxx) break;
        m.sign === 0 || m.miny >= S.maxy || S.miny >= m.maxy || !h(u[d]) && !h(u[B]) || qi(S, m) && (f.add(u[d]), f.add(u[B]));
      }
  }
  if (f.size === 0) return [];
  const g = t.filter((d) => (a.get(c(d)) ?? []).some((S) => f.has(S)));
  if (g.length > 0) return g;
  const x = /* @__PURE__ */ new Set();
  for (const d of f) for (const S of n[d].ids) S.startsWith("b") || x.add(S);
  return t.filter(
    ([d, S]) => x.has(String(e[d])) || x.has(String(e[S]))
  );
}
const In = 2.00704, Bn = 3.00001, ji = 12, Ui = 24;
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
    let e = t[0][0], n = e, s = t[0][1], r = s;
    const o = [t[0]];
    for (let a = 1; a < t.length; a++) {
      const c = t[a];
      c[0] < e && (e = c[0]), c[0] > n && (n = c[0]), c[1] < s && (s = c[1]), c[1] > r && (r = c[1]), o.push(c);
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
      const c = this.tins.bakw.features[a];
      Xn(n, { forw: o, bakw: c });
    });
    const s = (this.pointsSet?.forw.features ?? []).map(
      (o) => o.properties.target.index
    );
    Xi(
      this.tins,
      n,
      this.pointsSet?.edges || [],
      s
    );
    const r = ["forw", "bakw"].map((o) => {
      const a = this.tins[o].features.map(
        (c) => c.geometry.coordinates[0]
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
      if (zi(r, this.points.length, s), o.length === 0 && a.length === 0) {
        e.push(r);
        continue;
      }
      o.unshift(this.points[r[0]][0]), o.push(this.points[r[1]][0]), a.unshift(this.points[r[0]][1]), a.push(this.points[r[1]][1]), Zr(o, a).map((c, l, h) => {
        this.edgeNodes[n] = [
          c[0],
          c[1]
        ];
        const f = Kt(
          c[0],
          c[1],
          `e${n}`
        );
        n++, t.forw.push(f), t.bakw.push(Wt(f)), l === 0 ? e.push([r[0], t.forw.length - 1]) : e.push([
          t.forw.length - 2,
          t.forw.length - 1
        ]), l === h.length - 1 && e.push([t.forw.length - 1, r[1]]);
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
    if (!this.points.reduce((c, l) => c && (r ? Ge(l[0], r) : l[0][0] >= t && l[0][0] <= e && l[0][1] >= n && l[0][1] <= s), !0))
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
    let s, r, o, a, c;
    if (e) {
      if (this.bounds) {
        const O = this.boundsPolygon;
        if (!O) throw new Error("Internal error: bounds is set but boundsPolygon is missing");
        if (!this.points.every(
          (D) => Ge(D[0], O)
        )) throw "SOME POINTS OUTSIDE";
      }
      s = this.generatePointsSet(), { minx: r, maxx: o, miny: a, maxy: c } = this.computeGcpBbox();
    } else {
      const O = this.validateAndPrepareInputs();
      s = O.pointsSet, r = O.minx, o = O.maxx, a = O.miny, c = O.maxy;
    }
    const l = {
      forw: xt(s.forw),
      bakw: xt(s.bakw)
    }, h = de(
      l.forw,
      s.edges,
      "target"
    ), f = de(
      l.bakw,
      s.edges,
      "target"
    );
    if (h.features.length === 0 || f.features.length === 0)
      throw "TOO LINEAR1";
    const u = _r(l.forw), g = cn(l.forw);
    if (!g) throw "TOO LINEAR2";
    const x = {}, d = g.geometry.coordinates[0];
    let S;
    try {
      S = d.map((O) => ({
        forw: O,
        bakw: Me(Yt(O), h)
      })), S.forEach((O) => {
        x[`${O.forw[0]}:${O.forw[1]}`] = O;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const B = cn(l.bakw);
    if (!B) throw "TOO LINEAR2";
    const m = B.geometry.coordinates[0];
    try {
      S = m.map((O) => ({
        bakw: O,
        forw: Me(Yt(O), f)
      })), S.forEach((O) => {
        x[`${O.forw[0]}:${O.forw[1]}`] = O;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const y = {
      forw: u.geometry.coordinates,
      bakw: Me(u, h)
    }, p = Kt(y.forw, y.bakw, "c");
    this.centroid = {
      forw: p,
      bakw: Wt(p)
    };
    const w = [
      ...this.points.map((O) => ({ forw: O[0], bakw: O[1] })),
      ...(this.edgeNodes ?? []).map((O) => ({ forw: O[0], bakw: O[1] }))
    ], M = {
      convexBuf: x,
      centroid: y,
      allGcps: w,
      minx: r,
      maxx: o,
      miny: a,
      maxy: c
    };
    if (n) {
      this.stateTriangle = void 0;
      const O = this.yaxisMode === ot.YAXIS_FOLLOW, T = O ? 1 : -1, D = /* @__PURE__ */ new Map(), { boundary: X } = this.buildWithHull(t, (v) => ({ boundary: gn(
        M,
        (A) => li(A, (k) => {
          const [C, N] = zn(n, k);
          return [C, O ? -N : N];
        }),
        s,
        this.points.length,
        {
          orientation: T,
          accept: (A) => A.hasMapBoundary ? (this.buildTin(s, A.vertices, t, A, v.size > 0), (this.strict_status !== ot.STATUS_LOOSE || A.hasBoundary) && ve(this.tins.forw, T) === 0 && ve(this.tins.bakw, T) === 0) : !1
        },
        v,
        D
      ) }));
      if (X) {
        this.compiledOuter = {
          outerTransform: "worldFile",
          worldFile: n,
          vertices_points: X.vertices.map(({ forw: N, bakw: P }) => [N, P])
        };
        const { centroid: v, xy: A, wh: k, kinks: C } = this;
        super.setCompiled(this.getCompiled()), Object.assign(this, { centroid: v, xy: A, wh: k, kinks: C }), this.lastBoundaryDiagnostics = {
          ...X.diagnostics,
          requestedOuterTransform: "worldFile",
          outerTransform: "worldFile"
        };
        return;
      }
      this.compiledOuter = { outerTransform: "extrapolate" }, this.outerTransform = "extrapolate", this.worldFile = void 0;
    }
    const _ = this.vertexMode === ot.VERTEX_BIRDEYE ? ci : ai;
    let I, E;
    if (e) {
      const O = /* @__PURE__ */ new Map();
      ({ boundary: I, verticesList: E } = this.buildWithHull(t, (T) => {
        const D = gn(
          M,
          _,
          s,
          this.points.length,
          void 0,
          T,
          O
        );
        return {
          boundary: D,
          verticesList: this.buildTin(
            s,
            D?.vertices ?? _(M, !1),
            t,
            D,
            T.size > 0
          )
        };
      }));
    } else
      E = this.buildTin(
        s,
        _(M, !1),
        t,
        void 0
      );
    this.vertices_params = {
      forw: dn(E.forw, this.centroid.forw),
      bakw: dn(E.bakw, this.centroid.bakw)
    }, this.addIndexedTin(), this.pointsWeightBuffer = {}, this.lastBoundaryDiagnostics = I?.diagnostics, n && this.lastBoundaryDiagnostics && (this.lastBoundaryDiagnostics = {
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
    let s;
    const r = (d) => [...d].sort().join(","), o = (d, S = !1) => {
      const B = r(d), m = n.get(B);
      if (m) return m;
      const y = e(d), p = {
        value: y,
        strict: y.boundary !== void 0 && this.strict_status === ot.STATUS_STRICT
      };
      return (p.strict || S) && (p.state = this.captureBuild()), n.set(B, p), s = p, p;
    }, a = (d) => (s !== d && this.restoreBuild(d.state), s = d, d.value), c = o(/* @__PURE__ */ new Set(), !0);
    if (!(t === ot.MODE_STRICT || t === ot.MODE_AUTO) || !c.value.boundary || c.strict) return c.value;
    const h = new Set(c.value.boundary.forwHull.all.map(ye)), f = () => this.pointsSet.forw.features.map(
      (d) => d.properties.target.index
    ), u = /* @__PURE__ */ new Set();
    let g = c, x;
    for (let d = 0; d < ji; d++) {
      const S = Vi(
        this.tins.forw,
        g.value.boundary.forwHull.applied,
        f()
      ).filter((B) => !u.has(ye(B)));
      if (S.length === 0) break;
      for (const B of S) u.add(ye(B));
      if (g = o(u), !g.value.boundary) break;
      if (g.strict) {
        x = g;
        break;
      }
    }
    if (x) {
      let d = x;
      for (const S of [...u].slice(0, Ui)) {
        const B = new Set(u);
        B.delete(S);
        const m = o(B);
        m.strict && (u.delete(S), d = m);
      }
      return a(d);
    }
    if (u.size < h.size) {
      const d = o(h);
      if (d.strict) return a(d);
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
  buildTin(t, e, n, s, r = !1) {
    const o = {
      forw: [],
      bakw: []
    };
    for (let a = 0; a < e.length; a++) {
      const c = e[a].forw, l = e[a].bakw, h = Kt(c, l, `b${a}`), f = Wt(h);
      o.forw.push(h), o.bakw.push(f);
    }
    return this.pointsSet = {
      forw: xt([...t.forw, ...o.forw]),
      bakw: xt([...t.bakw, ...o.bakw]),
      edges: t.edges
    }, this.tins = {
      forw: qe(
        s?.forw ?? de(this.pointsSet.forw, t.edges, "target")
      )
    }, (n === ot.MODE_STRICT || n === ot.MODE_AUTO) && this.calculateStrictTin(
      n === ot.MODE_AUTO || r ? 1 : xn
    ), (n === ot.MODE_LOOSE || n === ot.MODE_AUTO && this.strict_status === ot.STATUS_ERROR) && (this.tins.bakw = qe(
      s?.bakw ?? de(this.pointsSet.bakw, t.edges, "target")
    ), delete this.kinks, this.strict_status = ot.STATUS_LOOSE), o;
  }
  /**
   * 非同期ラッパーを提供します。
   * 互換性のために Promise ベースの API を維持しますが、内部処理は同期的です。
   */
  async updateTinAsync() {
    this.updateTin();
  }
}
function zi(i, t, e) {
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
  Gi as findIntersections,
  In as format_version,
  Xn as insertSearchIndex,
  dn as vertexCalc
};
