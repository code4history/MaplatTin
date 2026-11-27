import { counterTri as An, Transform as Rn, validateWorldFile as Ln, normalizeEdges as Vn, transformArr as ie, rotateVerticesTriangle as Le, worldFileToCrs as qn } from "@maplat/transform";
function Zt(i, t, e = {}) {
  const n = { type: "Feature" };
  return (e.id === 0 || e.id) && (n.id = e.id), e.bbox && (n.bbox = e.bbox), n.properties = t || {}, n.geometry = i, n;
}
function Pt(i, t, e = {}) {
  if (!i)
    throw new Error("coordinates is required");
  if (!Array.isArray(i))
    throw new Error("coordinates must be an Array");
  if (i.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!qe(i[0]) || !qe(i[1]))
    throw new Error("coordinates must contain numbers");
  return Zt({
    type: "Point",
    coordinates: i
  }, t, e);
}
function ne(i, t, e = {}) {
  for (const o of i) {
    if (o.length < 4)
      throw new Error(
        "Each LinearRing of a Polygon must have 4 or more Positions."
      );
    if (o[o.length - 1].length !== o[0].length)
      throw new Error("First and last Position are not equivalent.");
    for (let r = 0; r < o[o.length - 1].length; r++)
      if (o[o.length - 1][r] !== o[0][r])
        throw new Error("First and last Position are not equivalent.");
  }
  return Zt({
    type: "Polygon",
    coordinates: i
  }, t, e);
}
function Ve(i, t, e = {}) {
  if (i.length < 2)
    throw new Error("coordinates must be an array of two or more positions");
  return Zt({
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
function jn(i) {
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
function Un(i) {
  return i.type === "Feature" ? i.geometry : i;
}
function Pe(i, t, e) {
  if (i !== null)
    for (var n, o, r, s, a, c, f, h = 0, l = 0, d, g = i.type, b = g === "FeatureCollection", M = g === "Feature", B = b ? i.features.length : 1, O = 0; O < B; O++) {
      f = b ? (
        // @ts-expect-error: Known type conflict
        i.features[O].geometry
      ) : M ? (
        // @ts-expect-error: Known type conflict
        i.geometry
      ) : i, d = f ? f.type === "GeometryCollection" : !1, a = d ? f.geometries.length : 1;
      for (var m = 0; m < a; m++) {
        var w = 0, u = 0;
        if (s = d ? f.geometries[m] : f, s !== null) {
          c = s.coordinates;
          var v = s.type;
          switch (h = e && (v === "Polygon" || v === "MultiPolygon") ? 1 : 0, v) {
            case null:
              break;
            case "Point":
              if (
                // @ts-expect-error: Known type conflict
                t(
                  c,
                  l,
                  O,
                  w,
                  u
                ) === !1
              )
                return !1;
              l++, w++;
              break;
            case "LineString":
            case "MultiPoint":
              for (n = 0; n < c.length; n++) {
                if (
                  // @ts-expect-error: Known type conflict
                  t(
                    c[n],
                    l,
                    O,
                    w,
                    u
                  ) === !1
                )
                  return !1;
                l++, v === "MultiPoint" && w++;
              }
              v === "LineString" && w++;
              break;
            case "Polygon":
            case "MultiLineString":
              for (n = 0; n < c.length; n++) {
                for (o = 0; o < c[n].length - h; o++) {
                  if (
                    // @ts-expect-error: Known type conflict
                    t(
                      c[n][o],
                      l,
                      O,
                      w,
                      u
                    ) === !1
                  )
                    return !1;
                  l++;
                }
                v === "MultiLineString" && w++, v === "Polygon" && u++;
              }
              v === "Polygon" && w++;
              break;
            case "MultiPolygon":
              for (n = 0; n < c.length; n++) {
                for (u = 0, o = 0; o < c[n].length; o++) {
                  for (r = 0; r < c[n][o].length - h; r++) {
                    if (
                      // @ts-expect-error: Known type conflict
                      t(
                        c[n][o][r],
                        l,
                        O,
                        w,
                        u
                      ) === !1
                    )
                      return !1;
                    l++;
                  }
                  u++;
                }
                w++;
              }
              break;
            case "GeometryCollection":
              for (n = 0; n < s.geometries.length; n++)
                if (
                  // @ts-expect-error: Known type conflict
                  Pe(s.geometries[n], t, e) === !1
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
const dt = 11102230246251565e-32, U = 134217729, In = (3 + 8 * dt) * dt;
function ht(i, t, e, n, o) {
  let r, s, a, c, f = t[0], h = n[0], l = 0, d = 0;
  h > f == h > -f ? (r = f, f = t[++l]) : (r = h, h = n[++d]);
  let g = 0;
  if (l < i && d < e)
    for (h > f == h > -f ? (s = f + r, a = r - (s - f), f = t[++l]) : (s = h + r, a = r - (s - h), h = n[++d]), r = s, a !== 0 && (o[g++] = a); l < i && d < e; )
      h > f == h > -f ? (s = r + f, c = s - r, a = r - (s - c) + (f - c), f = t[++l]) : (s = r + h, c = s - r, a = r - (s - c) + (h - c), h = n[++d]), r = s, a !== 0 && (o[g++] = a);
  for (; l < i; )
    s = r + f, c = s - r, a = r - (s - c) + (f - c), f = t[++l], r = s, a !== 0 && (o[g++] = a);
  for (; d < e; )
    s = r + h, c = s - r, a = r - (s - c) + (h - c), h = n[++d], r = s, a !== 0 && (o[g++] = a);
  return (r !== 0 || g === 0) && (o[g++] = r), g;
}
function Mt(i, t, e, n, o, r, s, a) {
  return ht(ht(i, t, e, n, s), s, o, r, a);
}
function R(i, t, e, n) {
  let o, r, s, a, c, f, h, l, d, g, b;
  h = U * e, g = h - (h - e), b = e - g;
  let M = t[0];
  o = M * e, h = U * M, l = h - (h - M), d = M - l, s = d * b - (o - l * g - d * g - l * b);
  let B = 0;
  s !== 0 && (n[B++] = s);
  for (let O = 1; O < i; O++)
    M = t[O], a = M * e, h = U * M, l = h - (h - M), d = M - l, c = d * b - (a - l * g - d * g - l * b), r = o + c, f = r - o, s = o - (r - f) + (c - f), s !== 0 && (n[B++] = s), o = a + r, s = r - (o - a), s !== 0 && (n[B++] = s);
  return (o !== 0 || B === 0) && (n[B++] = o), B;
}
function Bn(i, t) {
  let e = t[0];
  for (let n = 1; n < i; n++) e += t[n];
  return e;
}
function tt(i) {
  return new Float64Array(i);
}
const zn = (3 + 16 * dt) * dt, Gn = (2 + 12 * dt) * dt, Kn = (9 + 64 * dt) * dt * dt, Lt = tt(4), je = tt(8), Ue = tt(12), ze = tt(16), mt = tt(4);
function Jn(i, t, e, n, o, r, s) {
  let a, c, f, h, l, d, g, b, M, B, O, m, w, u, v, x, _, A;
  const E = i - o, T = e - o, I = t - r, D = n - r;
  u = E * D, d = U * E, g = d - (d - E), b = E - g, d = U * D, M = d - (d - D), B = D - M, v = b * B - (u - g * M - b * M - g * B), x = I * T, d = U * I, g = d - (d - I), b = I - g, d = U * T, M = d - (d - T), B = T - M, _ = b * B - (x - g * M - b * M - g * B), O = v - _, l = v - O, Lt[0] = v - (O + l) + (l - _), m = u + O, l = m - u, w = u - (m - l) + (O - l), O = w - x, l = w - O, Lt[1] = w - (O + l) + (l - x), A = m + O, l = A - m, Lt[2] = m - (A - l) + (O - l), Lt[3] = A;
  let X = Bn(4, Lt), p = Gn * s;
  if (X >= p || -X >= p || (l = i - E, a = i - (E + l) + (l - o), l = e - T, f = e - (T + l) + (l - o), l = t - I, c = t - (I + l) + (l - r), l = n - D, h = n - (D + l) + (l - r), a === 0 && c === 0 && f === 0 && h === 0) || (p = Kn * s + In * Math.abs(X), X += E * h + D * a - (I * f + T * c), X >= p || -X >= p)) return X;
  u = a * D, d = U * a, g = d - (d - a), b = a - g, d = U * D, M = d - (d - D), B = D - M, v = b * B - (u - g * M - b * M - g * B), x = c * T, d = U * c, g = d - (d - c), b = c - g, d = U * T, M = d - (d - T), B = T - M, _ = b * B - (x - g * M - b * M - g * B), O = v - _, l = v - O, mt[0] = v - (O + l) + (l - _), m = u + O, l = m - u, w = u - (m - l) + (O - l), O = w - x, l = w - O, mt[1] = w - (O + l) + (l - x), A = m + O, l = A - m, mt[2] = m - (A - l) + (O - l), mt[3] = A;
  const k = ht(4, Lt, 4, mt, je);
  u = E * h, d = U * E, g = d - (d - E), b = E - g, d = U * h, M = d - (d - h), B = h - M, v = b * B - (u - g * M - b * M - g * B), x = I * f, d = U * I, g = d - (d - I), b = I - g, d = U * f, M = d - (d - f), B = f - M, _ = b * B - (x - g * M - b * M - g * B), O = v - _, l = v - O, mt[0] = v - (O + l) + (l - _), m = u + O, l = m - u, w = u - (m - l) + (O - l), O = w - x, l = w - O, mt[1] = w - (O + l) + (l - x), A = m + O, l = A - m, mt[2] = m - (A - l) + (O - l), mt[3] = A;
  const S = ht(k, je, 4, mt, Ue);
  u = a * h, d = U * a, g = d - (d - a), b = a - g, d = U * h, M = d - (d - h), B = h - M, v = b * B - (u - g * M - b * M - g * B), x = c * f, d = U * c, g = d - (d - c), b = c - g, d = U * f, M = d - (d - f), B = f - M, _ = b * B - (x - g * M - b * M - g * B), O = v - _, l = v - O, mt[0] = v - (O + l) + (l - _), m = u + O, l = m - u, w = u - (m - l) + (O - l), O = w - x, l = w - O, mt[1] = w - (O + l) + (l - x), A = m + O, l = A - m, mt[2] = m - (A - l) + (O - l), mt[3] = A;
  const F = ht(S, Ue, 4, mt, ze);
  return ze[F - 1];
}
function _t(i, t, e, n, o, r) {
  const s = (t - r) * (e - o), a = (i - o) * (n - r), c = s - a, f = Math.abs(s + a);
  return Math.abs(c) >= zn * f ? c : -Jn(i, t, e, n, o, r, f);
}
const Hn = (10 + 96 * dt) * dt, Qn = (4 + 48 * dt) * dt, Wn = (44 + 576 * dt) * dt * dt, Tt = tt(4), Ft = tt(4), Ct = tt(4), St = tt(4), kt = tt(4), Et = tt(4), pt = tt(4), gt = tt(4), Me = tt(8), _e = tt(8), Se = tt(8), ke = tt(8), Ee = tt(8), Ae = tt(8), oe = tt(8), se = tt(8), ae = tt(8), Xt = tt(4), $t = tt(4), Yt = tt(4), z = tt(8), J = tt(16), nt = tt(16), rt = tt(16), et = tt(32), Nt = tt(32), at = tt(48), vt = tt(64);
let jt = tt(1152), Ie = tt(1152);
function ct(i, t, e) {
  i = ht(i, jt, t, e, Ie);
  const n = jt;
  return jt = Ie, Ie = n, i;
}
function Zn(i, t, e, n, o, r, s, a, c) {
  let f, h, l, d, g, b, M, B, O, m, w, u, v, x, _, A, E, T, I, D, X, p, k, S, F, N, P, y, C, $, Y, L, V, j, q;
  const K = i - s, G = e - s, H = o - s, Q = t - a, Z = n - a, W = r - a;
  Y = G * W, k = U * G, S = k - (k - G), F = G - S, k = U * W, N = k - (k - W), P = W - N, L = F * P - (Y - S * N - F * N - S * P), V = H * Z, k = U * H, S = k - (k - H), F = H - S, k = U * Z, N = k - (k - Z), P = Z - N, j = F * P - (V - S * N - F * N - S * P), y = L - j, p = L - y, Tt[0] = L - (y + p) + (p - j), C = Y + y, p = C - Y, $ = Y - (C - p) + (y - p), y = $ - V, p = $ - y, Tt[1] = $ - (y + p) + (p - V), q = C + y, p = q - C, Tt[2] = C - (q - p) + (y - p), Tt[3] = q, Y = H * Q, k = U * H, S = k - (k - H), F = H - S, k = U * Q, N = k - (k - Q), P = Q - N, L = F * P - (Y - S * N - F * N - S * P), V = K * W, k = U * K, S = k - (k - K), F = K - S, k = U * W, N = k - (k - W), P = W - N, j = F * P - (V - S * N - F * N - S * P), y = L - j, p = L - y, Ft[0] = L - (y + p) + (p - j), C = Y + y, p = C - Y, $ = Y - (C - p) + (y - p), y = $ - V, p = $ - y, Ft[1] = $ - (y + p) + (p - V), q = C + y, p = q - C, Ft[2] = C - (q - p) + (y - p), Ft[3] = q, Y = K * Z, k = U * K, S = k - (k - K), F = K - S, k = U * Z, N = k - (k - Z), P = Z - N, L = F * P - (Y - S * N - F * N - S * P), V = G * Q, k = U * G, S = k - (k - G), F = G - S, k = U * Q, N = k - (k - Q), P = Q - N, j = F * P - (V - S * N - F * N - S * P), y = L - j, p = L - y, Ct[0] = L - (y + p) + (p - j), C = Y + y, p = C - Y, $ = Y - (C - p) + (y - p), y = $ - V, p = $ - y, Ct[1] = $ - (y + p) + (p - V), q = C + y, p = q - C, Ct[2] = C - (q - p) + (y - p), Ct[3] = q, f = ht(
    ht(
      ht(
        R(R(4, Tt, K, z), z, K, J),
        J,
        R(R(4, Tt, Q, z), z, Q, nt),
        nt,
        et
      ),
      et,
      ht(
        R(R(4, Ft, G, z), z, G, J),
        J,
        R(R(4, Ft, Z, z), z, Z, nt),
        nt,
        Nt
      ),
      Nt,
      vt
    ),
    vt,
    ht(
      R(R(4, Ct, H, z), z, H, J),
      J,
      R(R(4, Ct, W, z), z, W, nt),
      nt,
      et
    ),
    et,
    jt
  );
  let st = Bn(f, jt), ft = Qn * c;
  if (st >= ft || -st >= ft || (p = i - K, h = i - (K + p) + (p - s), p = t - Q, g = t - (Q + p) + (p - a), p = e - G, l = e - (G + p) + (p - s), p = n - Z, b = n - (Z + p) + (p - a), p = o - H, d = o - (H + p) + (p - s), p = r - W, M = r - (W + p) + (p - a), h === 0 && l === 0 && d === 0 && g === 0 && b === 0 && M === 0) || (ft = Wn * c + In * Math.abs(st), st += (K * K + Q * Q) * (G * M + W * l - (Z * d + H * b)) + 2 * (K * h + Q * g) * (G * W - Z * H) + ((G * G + Z * Z) * (H * g + Q * d - (W * h + K * M)) + 2 * (G * l + Z * b) * (H * Q - W * K)) + ((H * H + W * W) * (K * b + Z * h - (Q * l + G * g)) + 2 * (H * d + W * M) * (K * Z - Q * G)), st >= ft || -st >= ft))
    return st;
  if ((l !== 0 || b !== 0 || d !== 0 || M !== 0) && (Y = K * K, k = U * K, S = k - (k - K), F = K - S, L = F * F - (Y - S * S - (S + S) * F), V = Q * Q, k = U * Q, S = k - (k - Q), F = Q - S, j = F * F - (V - S * S - (S + S) * F), y = L + j, p = y - L, St[0] = L - (y - p) + (j - p), C = Y + y, p = C - Y, $ = Y - (C - p) + (y - p), y = $ + V, p = y - $, St[1] = $ - (y - p) + (V - p), q = C + y, p = q - C, St[2] = C - (q - p) + (y - p), St[3] = q), (d !== 0 || M !== 0 || h !== 0 || g !== 0) && (Y = G * G, k = U * G, S = k - (k - G), F = G - S, L = F * F - (Y - S * S - (S + S) * F), V = Z * Z, k = U * Z, S = k - (k - Z), F = Z - S, j = F * F - (V - S * S - (S + S) * F), y = L + j, p = y - L, kt[0] = L - (y - p) + (j - p), C = Y + y, p = C - Y, $ = Y - (C - p) + (y - p), y = $ + V, p = y - $, kt[1] = $ - (y - p) + (V - p), q = C + y, p = q - C, kt[2] = C - (q - p) + (y - p), kt[3] = q), (h !== 0 || g !== 0 || l !== 0 || b !== 0) && (Y = H * H, k = U * H, S = k - (k - H), F = H - S, L = F * F - (Y - S * S - (S + S) * F), V = W * W, k = U * W, S = k - (k - W), F = W - S, j = F * F - (V - S * S - (S + S) * F), y = L + j, p = y - L, Et[0] = L - (y - p) + (j - p), C = Y + y, p = C - Y, $ = Y - (C - p) + (y - p), y = $ + V, p = y - $, Et[1] = $ - (y - p) + (V - p), q = C + y, p = q - C, Et[2] = C - (q - p) + (y - p), Et[3] = q), h !== 0 && (B = R(4, Tt, h, Me), f = ct(f, Mt(
    R(B, Me, 2 * K, J),
    J,
    R(R(4, Et, h, z), z, Z, nt),
    nt,
    R(R(4, kt, h, z), z, -W, rt),
    rt,
    et,
    at
  ), at)), g !== 0 && (O = R(4, Tt, g, _e), f = ct(f, Mt(
    R(O, _e, 2 * Q, J),
    J,
    R(R(4, kt, g, z), z, H, nt),
    nt,
    R(R(4, Et, g, z), z, -G, rt),
    rt,
    et,
    at
  ), at)), l !== 0 && (m = R(4, Ft, l, Se), f = ct(f, Mt(
    R(m, Se, 2 * G, J),
    J,
    R(R(4, St, l, z), z, W, nt),
    nt,
    R(R(4, Et, l, z), z, -Q, rt),
    rt,
    et,
    at
  ), at)), b !== 0 && (w = R(4, Ft, b, ke), f = ct(f, Mt(
    R(w, ke, 2 * Z, J),
    J,
    R(R(4, Et, b, z), z, K, nt),
    nt,
    R(R(4, St, b, z), z, -H, rt),
    rt,
    et,
    at
  ), at)), d !== 0 && (u = R(4, Ct, d, Ee), f = ct(f, Mt(
    R(u, Ee, 2 * H, J),
    J,
    R(R(4, kt, d, z), z, Q, nt),
    nt,
    R(R(4, St, d, z), z, -Z, rt),
    rt,
    et,
    at
  ), at)), M !== 0 && (v = R(4, Ct, M, Ae), f = ct(f, Mt(
    R(v, Ae, 2 * W, J),
    J,
    R(R(4, St, M, z), z, G, nt),
    nt,
    R(R(4, kt, M, z), z, -K, rt),
    rt,
    et,
    at
  ), at)), h !== 0 || g !== 0) {
    if (l !== 0 || b !== 0 || d !== 0 || M !== 0 ? (Y = l * W, k = U * l, S = k - (k - l), F = l - S, k = U * W, N = k - (k - W), P = W - N, L = F * P - (Y - S * N - F * N - S * P), V = G * M, k = U * G, S = k - (k - G), F = G - S, k = U * M, N = k - (k - M), P = M - N, j = F * P - (V - S * N - F * N - S * P), y = L + j, p = y - L, pt[0] = L - (y - p) + (j - p), C = Y + y, p = C - Y, $ = Y - (C - p) + (y - p), y = $ + V, p = y - $, pt[1] = $ - (y - p) + (V - p), q = C + y, p = q - C, pt[2] = C - (q - p) + (y - p), pt[3] = q, Y = d * -Z, k = U * d, S = k - (k - d), F = d - S, k = U * -Z, N = k - (k - -Z), P = -Z - N, L = F * P - (Y - S * N - F * N - S * P), V = H * -b, k = U * H, S = k - (k - H), F = H - S, k = U * -b, N = k - (k - -b), P = -b - N, j = F * P - (V - S * N - F * N - S * P), y = L + j, p = y - L, gt[0] = L - (y - p) + (j - p), C = Y + y, p = C - Y, $ = Y - (C - p) + (y - p), y = $ + V, p = y - $, gt[1] = $ - (y - p) + (V - p), q = C + y, p = q - C, gt[2] = C - (q - p) + (y - p), gt[3] = q, _ = ht(4, pt, 4, gt, se), Y = l * M, k = U * l, S = k - (k - l), F = l - S, k = U * M, N = k - (k - M), P = M - N, L = F * P - (Y - S * N - F * N - S * P), V = d * b, k = U * d, S = k - (k - d), F = d - S, k = U * b, N = k - (k - b), P = b - N, j = F * P - (V - S * N - F * N - S * P), y = L - j, p = L - y, $t[0] = L - (y + p) + (p - j), C = Y + y, p = C - Y, $ = Y - (C - p) + (y - p), y = $ - V, p = $ - y, $t[1] = $ - (y + p) + (p - V), q = C + y, p = q - C, $t[2] = C - (q - p) + (y - p), $t[3] = q, T = 4) : (se[0] = 0, _ = 1, $t[0] = 0, T = 1), h !== 0) {
      const it = R(_, se, h, rt);
      f = ct(f, ht(
        R(B, Me, h, J),
        J,
        R(it, rt, 2 * K, et),
        et,
        at
      ), at);
      const ot = R(T, $t, h, z);
      f = ct(f, Mt(
        R(ot, z, 2 * K, J),
        J,
        R(ot, z, h, nt),
        nt,
        R(it, rt, h, et),
        et,
        Nt,
        vt
      ), vt), b !== 0 && (f = ct(f, R(R(4, Et, h, z), z, b, J), J)), M !== 0 && (f = ct(f, R(R(4, kt, -h, z), z, M, J), J));
    }
    if (g !== 0) {
      const it = R(_, se, g, rt);
      f = ct(f, ht(
        R(O, _e, g, J),
        J,
        R(it, rt, 2 * Q, et),
        et,
        at
      ), at);
      const ot = R(T, $t, g, z);
      f = ct(f, Mt(
        R(ot, z, 2 * Q, J),
        J,
        R(ot, z, g, nt),
        nt,
        R(it, rt, g, et),
        et,
        Nt,
        vt
      ), vt);
    }
  }
  if (l !== 0 || b !== 0) {
    if (d !== 0 || M !== 0 || h !== 0 || g !== 0 ? (Y = d * Q, k = U * d, S = k - (k - d), F = d - S, k = U * Q, N = k - (k - Q), P = Q - N, L = F * P - (Y - S * N - F * N - S * P), V = H * g, k = U * H, S = k - (k - H), F = H - S, k = U * g, N = k - (k - g), P = g - N, j = F * P - (V - S * N - F * N - S * P), y = L + j, p = y - L, pt[0] = L - (y - p) + (j - p), C = Y + y, p = C - Y, $ = Y - (C - p) + (y - p), y = $ + V, p = y - $, pt[1] = $ - (y - p) + (V - p), q = C + y, p = q - C, pt[2] = C - (q - p) + (y - p), pt[3] = q, D = -W, X = -M, Y = h * D, k = U * h, S = k - (k - h), F = h - S, k = U * D, N = k - (k - D), P = D - N, L = F * P - (Y - S * N - F * N - S * P), V = K * X, k = U * K, S = k - (k - K), F = K - S, k = U * X, N = k - (k - X), P = X - N, j = F * P - (V - S * N - F * N - S * P), y = L + j, p = y - L, gt[0] = L - (y - p) + (j - p), C = Y + y, p = C - Y, $ = Y - (C - p) + (y - p), y = $ + V, p = y - $, gt[1] = $ - (y - p) + (V - p), q = C + y, p = q - C, gt[2] = C - (q - p) + (y - p), gt[3] = q, A = ht(4, pt, 4, gt, ae), Y = d * g, k = U * d, S = k - (k - d), F = d - S, k = U * g, N = k - (k - g), P = g - N, L = F * P - (Y - S * N - F * N - S * P), V = h * M, k = U * h, S = k - (k - h), F = h - S, k = U * M, N = k - (k - M), P = M - N, j = F * P - (V - S * N - F * N - S * P), y = L - j, p = L - y, Yt[0] = L - (y + p) + (p - j), C = Y + y, p = C - Y, $ = Y - (C - p) + (y - p), y = $ - V, p = $ - y, Yt[1] = $ - (y + p) + (p - V), q = C + y, p = q - C, Yt[2] = C - (q - p) + (y - p), Yt[3] = q, I = 4) : (ae[0] = 0, A = 1, Yt[0] = 0, I = 1), l !== 0) {
      const it = R(A, ae, l, rt);
      f = ct(f, ht(
        R(m, Se, l, J),
        J,
        R(it, rt, 2 * G, et),
        et,
        at
      ), at);
      const ot = R(I, Yt, l, z);
      f = ct(f, Mt(
        R(ot, z, 2 * G, J),
        J,
        R(ot, z, l, nt),
        nt,
        R(it, rt, l, et),
        et,
        Nt,
        vt
      ), vt), M !== 0 && (f = ct(f, R(R(4, St, l, z), z, M, J), J)), g !== 0 && (f = ct(f, R(R(4, Et, -l, z), z, g, J), J));
    }
    if (b !== 0) {
      const it = R(A, ae, b, rt);
      f = ct(f, ht(
        R(w, ke, b, J),
        J,
        R(it, rt, 2 * Z, et),
        et,
        at
      ), at);
      const ot = R(I, Yt, b, z);
      f = ct(f, Mt(
        R(ot, z, 2 * Z, J),
        J,
        R(ot, z, b, nt),
        nt,
        R(it, rt, b, et),
        et,
        Nt,
        vt
      ), vt);
    }
  }
  if (d !== 0 || M !== 0) {
    if (h !== 0 || g !== 0 || l !== 0 || b !== 0 ? (Y = h * Z, k = U * h, S = k - (k - h), F = h - S, k = U * Z, N = k - (k - Z), P = Z - N, L = F * P - (Y - S * N - F * N - S * P), V = K * b, k = U * K, S = k - (k - K), F = K - S, k = U * b, N = k - (k - b), P = b - N, j = F * P - (V - S * N - F * N - S * P), y = L + j, p = y - L, pt[0] = L - (y - p) + (j - p), C = Y + y, p = C - Y, $ = Y - (C - p) + (y - p), y = $ + V, p = y - $, pt[1] = $ - (y - p) + (V - p), q = C + y, p = q - C, pt[2] = C - (q - p) + (y - p), pt[3] = q, D = -Q, X = -g, Y = l * D, k = U * l, S = k - (k - l), F = l - S, k = U * D, N = k - (k - D), P = D - N, L = F * P - (Y - S * N - F * N - S * P), V = G * X, k = U * G, S = k - (k - G), F = G - S, k = U * X, N = k - (k - X), P = X - N, j = F * P - (V - S * N - F * N - S * P), y = L + j, p = y - L, gt[0] = L - (y - p) + (j - p), C = Y + y, p = C - Y, $ = Y - (C - p) + (y - p), y = $ + V, p = y - $, gt[1] = $ - (y - p) + (V - p), q = C + y, p = q - C, gt[2] = C - (q - p) + (y - p), gt[3] = q, x = ht(4, pt, 4, gt, oe), Y = h * b, k = U * h, S = k - (k - h), F = h - S, k = U * b, N = k - (k - b), P = b - N, L = F * P - (Y - S * N - F * N - S * P), V = l * g, k = U * l, S = k - (k - l), F = l - S, k = U * g, N = k - (k - g), P = g - N, j = F * P - (V - S * N - F * N - S * P), y = L - j, p = L - y, Xt[0] = L - (y + p) + (p - j), C = Y + y, p = C - Y, $ = Y - (C - p) + (y - p), y = $ - V, p = $ - y, Xt[1] = $ - (y + p) + (p - V), q = C + y, p = q - C, Xt[2] = C - (q - p) + (y - p), Xt[3] = q, E = 4) : (oe[0] = 0, x = 1, Xt[0] = 0, E = 1), d !== 0) {
      const it = R(x, oe, d, rt);
      f = ct(f, ht(
        R(u, Ee, d, J),
        J,
        R(it, rt, 2 * H, et),
        et,
        at
      ), at);
      const ot = R(E, Xt, d, z);
      f = ct(f, Mt(
        R(ot, z, 2 * H, J),
        J,
        R(ot, z, d, nt),
        nt,
        R(it, rt, d, et),
        et,
        Nt,
        vt
      ), vt), g !== 0 && (f = ct(f, R(R(4, kt, d, z), z, g, J), J)), b !== 0 && (f = ct(f, R(R(4, St, -d, z), z, b, J), J));
    }
    if (M !== 0) {
      const it = R(x, oe, M, rt);
      f = ct(f, ht(
        R(v, Ae, M, J),
        J,
        R(it, rt, 2 * W, et),
        et,
        at
      ), at);
      const ot = R(E, Xt, M, z);
      f = ct(f, Mt(
        R(ot, z, 2 * W, J),
        J,
        R(ot, z, M, nt),
        nt,
        R(it, rt, M, et),
        et,
        Nt,
        vt
      ), vt);
    }
  }
  return jt[f - 1];
}
function tr(i, t, e, n, o, r, s, a) {
  const c = i - s, f = e - s, h = o - s, l = t - a, d = n - a, g = r - a, b = f * g, M = h * d, B = c * c + l * l, O = h * l, m = c * g, w = f * f + d * d, u = c * d, v = f * l, x = h * h + g * g, _ = B * (b - M) + w * (O - m) + x * (u - v), A = (Math.abs(b) + Math.abs(M)) * B + (Math.abs(O) + Math.abs(m)) * w + (Math.abs(u) + Math.abs(v)) * x, E = Hn * A;
  return _ > E || -_ > E ? _ : Zn(i, t, e, n, o, r, s, a, A);
}
function er(i, t) {
  var e, n, o = 0, r, s, a, c, f, h, l, d = i[0], g = i[1], b = t.length;
  for (e = 0; e < b; e++) {
    n = 0;
    var M = t[e], B = M.length - 1;
    if (h = M[0], h[0] !== M[B][0] && h[1] !== M[B][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (s = h[0] - d, a = h[1] - g, n; n < B; n++) {
      if (l = M[n + 1], c = l[0] - d, f = l[1] - g, a === 0 && f === 0) {
        if (c <= 0 && s >= 0 || s <= 0 && c >= 0)
          return 0;
      } else if (f >= 0 && a <= 0 || f <= 0 && a >= 0) {
        if (r = _t(s, c, a, f, 0, 0), r === 0)
          return 0;
        (r > 0 && f > 0 && a <= 0 || r < 0 && f <= 0 && a > 0) && o++;
      }
      h = l, a = f, s = c;
    }
  }
  return o % 2 !== 0;
}
function Be(i, t, e = {}) {
  if (!i)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const n = jn(i), o = Un(t), r = o.type, s = t.bbox;
  let a = o.coordinates;
  if (s && nr(n, s) === !1)
    return !1;
  r === "Polygon" && (a = [a]);
  for (var c = 0; c < a.length; ++c) {
    const f = er(n, a[c]);
    if (f === 0 && !e.ignoreBoundary) return !0;
    if (f) return !0;
  }
  return !1;
}
function nr(i, t) {
  return t[0] <= i[0] && t[1] <= i[1] && t[2] >= i[0] && t[3] >= i[1];
}
class Xe {
  constructor(t = [], e = rr) {
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
      const r = t - 1 >> 1, s = e[r];
      if (n(o, s) >= 0) break;
      e[t] = s, t = r;
    }
    e[t] = o;
  }
  _down(t) {
    const { data: e, compare: n } = this, o = this.length >> 1, r = e[t];
    for (; t < o; ) {
      let s = (t << 1) + 1, a = e[s];
      const c = s + 1;
      if (c < this.length && n(e[c], a) < 0 && (s = c, a = e[c]), n(a, r) >= 0) break;
      e[t] = a, t = s;
    }
    e[t] = r;
  }
}
function rr(i, t) {
  return i < t ? -1 : i > t ? 1 : 0;
}
const ir = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Xe
}, Symbol.toStringTag, { value: "Module" })), Bt = 11102230246251565e-32, ut = 134217729, or = (3 + 8 * Bt) * Bt;
function Oe(i, t, e, n, o) {
  let r, s, a, c, f = t[0], h = n[0], l = 0, d = 0;
  h > f == h > -f ? (r = f, f = t[++l]) : (r = h, h = n[++d]);
  let g = 0;
  if (l < i && d < e)
    for (h > f == h > -f ? (s = f + r, a = r - (s - f), f = t[++l]) : (s = h + r, a = r - (s - h), h = n[++d]), r = s, a !== 0 && (o[g++] = a); l < i && d < e; )
      h > f == h > -f ? (s = r + f, c = s - r, a = r - (s - c) + (f - c), f = t[++l]) : (s = r + h, c = s - r, a = r - (s - c) + (h - c), h = n[++d]), r = s, a !== 0 && (o[g++] = a);
  for (; l < i; )
    s = r + f, c = s - r, a = r - (s - c) + (f - c), f = t[++l], r = s, a !== 0 && (o[g++] = a);
  for (; d < e; )
    s = r + h, c = s - r, a = r - (s - c) + (h - c), h = n[++d], r = s, a !== 0 && (o[g++] = a);
  return (r !== 0 || g === 0) && (o[g++] = r), g;
}
function sr(i, t) {
  let e = t[0];
  for (let n = 1; n < i; n++) e += t[n];
  return e;
}
function re(i) {
  return new Float64Array(i);
}
const ar = (3 + 16 * Bt) * Bt, cr = (2 + 12 * Bt) * Bt, lr = (9 + 64 * Bt) * Bt * Bt, Vt = re(4), Ge = re(8), Ke = re(12), Je = re(16), wt = re(4);
function fr(i, t, e, n, o, r, s) {
  let a, c, f, h, l, d, g, b, M, B, O, m, w, u, v, x, _, A;
  const E = i - o, T = e - o, I = t - r, D = n - r;
  u = E * D, d = ut * E, g = d - (d - E), b = E - g, d = ut * D, M = d - (d - D), B = D - M, v = b * B - (u - g * M - b * M - g * B), x = I * T, d = ut * I, g = d - (d - I), b = I - g, d = ut * T, M = d - (d - T), B = T - M, _ = b * B - (x - g * M - b * M - g * B), O = v - _, l = v - O, Vt[0] = v - (O + l) + (l - _), m = u + O, l = m - u, w = u - (m - l) + (O - l), O = w - x, l = w - O, Vt[1] = w - (O + l) + (l - x), A = m + O, l = A - m, Vt[2] = m - (A - l) + (O - l), Vt[3] = A;
  let X = sr(4, Vt), p = cr * s;
  if (X >= p || -X >= p || (l = i - E, a = i - (E + l) + (l - o), l = e - T, f = e - (T + l) + (l - o), l = t - I, c = t - (I + l) + (l - r), l = n - D, h = n - (D + l) + (l - r), a === 0 && c === 0 && f === 0 && h === 0) || (p = lr * s + or * Math.abs(X), X += E * h + D * a - (I * f + T * c), X >= p || -X >= p)) return X;
  u = a * D, d = ut * a, g = d - (d - a), b = a - g, d = ut * D, M = d - (d - D), B = D - M, v = b * B - (u - g * M - b * M - g * B), x = c * T, d = ut * c, g = d - (d - c), b = c - g, d = ut * T, M = d - (d - T), B = T - M, _ = b * B - (x - g * M - b * M - g * B), O = v - _, l = v - O, wt[0] = v - (O + l) + (l - _), m = u + O, l = m - u, w = u - (m - l) + (O - l), O = w - x, l = w - O, wt[1] = w - (O + l) + (l - x), A = m + O, l = A - m, wt[2] = m - (A - l) + (O - l), wt[3] = A;
  const k = Oe(4, Vt, 4, wt, Ge);
  u = E * h, d = ut * E, g = d - (d - E), b = E - g, d = ut * h, M = d - (d - h), B = h - M, v = b * B - (u - g * M - b * M - g * B), x = I * f, d = ut * I, g = d - (d - I), b = I - g, d = ut * f, M = d - (d - f), B = f - M, _ = b * B - (x - g * M - b * M - g * B), O = v - _, l = v - O, wt[0] = v - (O + l) + (l - _), m = u + O, l = m - u, w = u - (m - l) + (O - l), O = w - x, l = w - O, wt[1] = w - (O + l) + (l - x), A = m + O, l = A - m, wt[2] = m - (A - l) + (O - l), wt[3] = A;
  const S = Oe(k, Ge, 4, wt, Ke);
  u = a * h, d = ut * a, g = d - (d - a), b = a - g, d = ut * h, M = d - (d - h), B = h - M, v = b * B - (u - g * M - b * M - g * B), x = c * f, d = ut * c, g = d - (d - c), b = c - g, d = ut * f, M = d - (d - f), B = f - M, _ = b * B - (x - g * M - b * M - g * B), O = v - _, l = v - O, wt[0] = v - (O + l) + (l - _), m = u + O, l = m - u, w = u - (m - l) + (O - l), O = w - x, l = w - O, wt[1] = w - (O + l) + (l - x), A = m + O, l = A - m, wt[2] = m - (A - l) + (O - l), wt[3] = A;
  const F = Oe(S, Ke, 4, wt, Je);
  return Je[F - 1];
}
function He(i, t, e, n, o, r) {
  const s = (t - r) * (e - o), a = (i - o) * (n - r), c = s - a;
  if (s === 0 || a === 0 || s > 0 != a > 0) return c;
  const f = Math.abs(s + a);
  return Math.abs(c) >= ar * f ? c : -fr(i, t, e, n, o, r, f);
}
function hr(i, t) {
  const e = new Xe([], On);
  return dr(i, e), mr(e, t);
}
function On(i, t) {
  return i.p.x > t.p.x ? 1 : i.p.x < t.p.x || i.p.x === t.p.x && (i.featureId !== t.featureId || i.ringId !== t.ringId) && i.isLeftEndpoint && !t.isLeftEndpoint ? -1 : i.p.y !== t.p.y ? i.p.y > t.p.y ? 1 : -1 : 1;
}
function ur(i, t) {
  return i.rightSweepEvent.p.x > t.rightSweepEvent.p.x ? 1 : i.rightSweepEvent.p.x < t.rightSweepEvent.p.x ? -1 : i.rightSweepEvent.p.y !== t.rightSweepEvent.p.y ? i.rightSweepEvent.p.y < t.rightSweepEvent.p.y ? 1 : -1 : 1;
}
function dr(i, t) {
  if (i.type === "FeatureCollection") {
    const e = i.features;
    for (let n = 0; n < e.length; n++)
      Qe(e[n], t);
  } else
    Qe(i, t);
}
var ce = 0, le = 0, fe = 0;
function Qe(i, t) {
  const e = i.type === "Feature" ? i.geometry : i;
  let n = e.coordinates;
  (e.type === "Polygon" || e.type === "MultiLineString") && (n = [n]), e.type === "LineString" && (n = [[n]]);
  for (let o = 0; o < n.length; o++)
    for (let r = 0; r < n[o].length; r++) {
      let s = n[o][r][0], a = null;
      le = le + 1;
      for (let c = 0; c < n[o][r].length - 1; c++) {
        a = n[o][r][c + 1];
        const f = new We(s, ce, le, fe), h = new We(a, ce, le, fe + 1);
        f.otherEvent = h, h.otherEvent = f, On(f, h) > 0 ? (h.isLeftEndpoint = !0, f.isLeftEndpoint = !1) : (f.isLeftEndpoint = !0, h.isLeftEndpoint = !1), t.push(f), t.push(h), s = a, fe = fe + 1;
      }
    }
  ce = ce + 1;
}
var We = class {
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
  const e = [], n = new Xe([], ur);
  for (; i.length; ) {
    const o = i.pop();
    if (o.isLeftEndpoint) {
      const r = new pr(o);
      for (let s = 0; s < n.data.length; s++) {
        const a = n.data[s];
        if (t && a.leftSweepEvent.featureId === o.featureId)
          continue;
        const c = gr(r, a);
        c !== !1 && e.push(c);
      }
      n.push(r);
    } else o.isLeftEndpoint === !1 && n.pop();
  }
  return e;
}
var pr = class {
  /** @param event must have otherEvent non-null */
  constructor(i) {
    this.leftSweepEvent = i, this.rightSweepEvent = i.otherEvent;
  }
};
function gr(i, t) {
  if (i === null || t === null) return !1;
  const e = i.leftSweepEvent.p.x, n = i.leftSweepEvent.p.y, o = i.rightSweepEvent.p.x, r = i.rightSweepEvent.p.y, s = t.leftSweepEvent.p.x, a = t.leftSweepEvent.p.y, c = t.rightSweepEvent.p.x, f = t.rightSweepEvent.p.y, h = He(e, n, o, r, s, a), l = He(e, n, o, r, c, f);
  if (h > 0 && l > 0) return !1;
  if (h < 0 && l < 0) return !1;
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
  const d = (f - a) * (o - e) - (c - s) * (r - n), g = (c - s) * (n - a) - (f - a) * (e - s), b = (o - e) * (n - a) - (r - n) * (e - s);
  if (d === 0)
    return !1;
  const M = g / d, B = b / d;
  if (M >= 0 && M <= 1 && B >= 0 && B <= 1) {
    const O = e + M * (o - e), m = n + M * (r - n);
    return [O, m];
  }
  return !1;
}
function wr(i, t, e = {}) {
  const { removeDuplicates: n = !0, ignoreSelfIntersections: o = !0 } = e;
  let r = [];
  i.type === "FeatureCollection" ? r = r.concat(i.features) : i.type === "Feature" ? r.push(i) : (i.type === "LineString" || i.type === "Polygon" || i.type === "MultiLineString" || i.type === "MultiPolygon") && r.push(Zt(i)), t.type === "FeatureCollection" ? r = r.concat(t.features) : t.type === "Feature" ? r.push(t) : (t.type === "LineString" || t.type === "Polygon" || t.type === "MultiLineString" || t.type === "MultiPolygon") && r.push(Zt(t));
  const s = hr(
    bt(r),
    o
  );
  let a = [];
  if (n) {
    const c = {};
    s.forEach((f) => {
      const h = f.join(",");
      c[h] || (c[h] = !0, a.push(f));
    });
  } else
    a = s;
  return bt(a.map((c) => Pt(c)));
}
function vr(i) {
  return i && i.__esModule && Object.prototype.hasOwnProperty.call(i, "default") ? i.default : i;
}
function yr(i) {
  if (Object.prototype.hasOwnProperty.call(i, "__esModule")) return i;
  var t = i.default;
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
  return Object.defineProperty(e, "__esModule", { value: !0 }), Object.keys(i).forEach(function(n) {
    var o = Object.getOwnPropertyDescriptor(i, n);
    Object.defineProperty(e, n, o.get ? o : {
      enumerable: !0,
      get: function() {
        return i[n];
      }
    });
  }), e;
}
function br(i, t = {}) {
  let e = 0, n = 0, o = 0;
  return Pe(
    i,
    function(r) {
      e += r[0], n += r[1], o++;
    },
    !0
  ), Pt([e / o, n / o], t.properties);
}
var he = { exports: {} }, we = { exports: {} }, xr = we.exports, Ze;
function Mr() {
  return Ze || (Ze = 1, (function(i, t) {
    (function(e, n) {
      i.exports = n();
    })(xr, function() {
      function e(m, w, u, v, x) {
        (function _(A, E, T, I, D) {
          for (; I > T; ) {
            if (I - T > 600) {
              var X = I - T + 1, p = E - T + 1, k = Math.log(X), S = 0.5 * Math.exp(2 * k / 3), F = 0.5 * Math.sqrt(k * S * (X - S) / X) * (p - X / 2 < 0 ? -1 : 1), N = Math.max(T, Math.floor(E - p * S / X + F)), P = Math.min(I, Math.floor(E + (X - p) * S / X + F));
              _(A, E, N, P, D);
            }
            var y = A[E], C = T, $ = I;
            for (n(A, T, E), D(A[I], y) > 0 && n(A, T, I); C < $; ) {
              for (n(A, C, $), C++, $--; D(A[C], y) < 0; ) C++;
              for (; D(A[$], y) > 0; ) $--;
            }
            D(A[T], y) === 0 ? n(A, T, $) : n(A, ++$, I), $ <= E && (T = $ + 1), E <= $ && (I = $ - 1);
          }
        })(m, w, u || 0, v || m.length - 1, x || o);
      }
      function n(m, w, u) {
        var v = m[w];
        m[w] = m[u], m[u] = v;
      }
      function o(m, w) {
        return m < w ? -1 : m > w ? 1 : 0;
      }
      var r = function(m) {
        m === void 0 && (m = 9), this._maxEntries = Math.max(4, m), this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries)), this.clear();
      };
      function s(m, w, u) {
        if (!u) return w.indexOf(m);
        for (var v = 0; v < w.length; v++) if (u(m, w[v])) return v;
        return -1;
      }
      function a(m, w) {
        c(m, 0, m.children.length, w, m);
      }
      function c(m, w, u, v, x) {
        x || (x = B(null)), x.minX = 1 / 0, x.minY = 1 / 0, x.maxX = -1 / 0, x.maxY = -1 / 0;
        for (var _ = w; _ < u; _++) {
          var A = m.children[_];
          f(x, m.leaf ? v(A) : A);
        }
        return x;
      }
      function f(m, w) {
        return m.minX = Math.min(m.minX, w.minX), m.minY = Math.min(m.minY, w.minY), m.maxX = Math.max(m.maxX, w.maxX), m.maxY = Math.max(m.maxY, w.maxY), m;
      }
      function h(m, w) {
        return m.minX - w.minX;
      }
      function l(m, w) {
        return m.minY - w.minY;
      }
      function d(m) {
        return (m.maxX - m.minX) * (m.maxY - m.minY);
      }
      function g(m) {
        return m.maxX - m.minX + (m.maxY - m.minY);
      }
      function b(m, w) {
        return m.minX <= w.minX && m.minY <= w.minY && w.maxX <= m.maxX && w.maxY <= m.maxY;
      }
      function M(m, w) {
        return w.minX <= m.maxX && w.minY <= m.maxY && w.maxX >= m.minX && w.maxY >= m.minY;
      }
      function B(m) {
        return { children: m, height: 1, leaf: !0, minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
      }
      function O(m, w, u, v, x) {
        for (var _ = [w, u]; _.length; ) if (!((u = _.pop()) - (w = _.pop()) <= v)) {
          var A = w + Math.ceil((u - w) / v / 2) * v;
          e(m, A, w, u, x), _.push(w, A, A, u);
        }
      }
      return r.prototype.all = function() {
        return this._all(this.data, []);
      }, r.prototype.search = function(m) {
        var w = this.data, u = [];
        if (!M(m, w)) return u;
        for (var v = this.toBBox, x = []; w; ) {
          for (var _ = 0; _ < w.children.length; _++) {
            var A = w.children[_], E = w.leaf ? v(A) : A;
            M(m, E) && (w.leaf ? u.push(A) : b(m, E) ? this._all(A, u) : x.push(A));
          }
          w = x.pop();
        }
        return u;
      }, r.prototype.collides = function(m) {
        var w = this.data;
        if (!M(m, w)) return !1;
        for (var u = []; w; ) {
          for (var v = 0; v < w.children.length; v++) {
            var x = w.children[v], _ = w.leaf ? this.toBBox(x) : x;
            if (M(m, _)) {
              if (w.leaf || b(m, _)) return !0;
              u.push(x);
            }
          }
          w = u.pop();
        }
        return !1;
      }, r.prototype.load = function(m) {
        if (!m || !m.length) return this;
        if (m.length < this._minEntries) {
          for (var w = 0; w < m.length; w++) this.insert(m[w]);
          return this;
        }
        var u = this._build(m.slice(), 0, m.length - 1, 0);
        if (this.data.children.length) if (this.data.height === u.height) this._splitRoot(this.data, u);
        else {
          if (this.data.height < u.height) {
            var v = this.data;
            this.data = u, u = v;
          }
          this._insert(u, this.data.height - u.height - 1, !0);
        }
        else this.data = u;
        return this;
      }, r.prototype.insert = function(m) {
        return m && this._insert(m, this.data.height - 1), this;
      }, r.prototype.clear = function() {
        return this.data = B([]), this;
      }, r.prototype.remove = function(m, w) {
        if (!m) return this;
        for (var u, v, x, _ = this.data, A = this.toBBox(m), E = [], T = []; _ || E.length; ) {
          if (_ || (_ = E.pop(), v = E[E.length - 1], u = T.pop(), x = !0), _.leaf) {
            var I = s(m, _.children, w);
            if (I !== -1) return _.children.splice(I, 1), E.push(_), this._condense(E), this;
          }
          x || _.leaf || !b(_, A) ? v ? (u++, _ = v.children[u], x = !1) : _ = null : (E.push(_), T.push(u), u = 0, v = _, _ = _.children[0]);
        }
        return this;
      }, r.prototype.toBBox = function(m) {
        return m;
      }, r.prototype.compareMinX = function(m, w) {
        return m.minX - w.minX;
      }, r.prototype.compareMinY = function(m, w) {
        return m.minY - w.minY;
      }, r.prototype.toJSON = function() {
        return this.data;
      }, r.prototype.fromJSON = function(m) {
        return this.data = m, this;
      }, r.prototype._all = function(m, w) {
        for (var u = []; m; ) m.leaf ? w.push.apply(w, m.children) : u.push.apply(u, m.children), m = u.pop();
        return w;
      }, r.prototype._build = function(m, w, u, v) {
        var x, _ = u - w + 1, A = this._maxEntries;
        if (_ <= A) return a(x = B(m.slice(w, u + 1)), this.toBBox), x;
        v || (v = Math.ceil(Math.log(_) / Math.log(A)), A = Math.ceil(_ / Math.pow(A, v - 1))), (x = B([])).leaf = !1, x.height = v;
        var E = Math.ceil(_ / A), T = E * Math.ceil(Math.sqrt(A));
        O(m, w, u, T, this.compareMinX);
        for (var I = w; I <= u; I += T) {
          var D = Math.min(I + T - 1, u);
          O(m, I, D, E, this.compareMinY);
          for (var X = I; X <= D; X += E) {
            var p = Math.min(X + E - 1, D);
            x.children.push(this._build(m, X, p, v - 1));
          }
        }
        return a(x, this.toBBox), x;
      }, r.prototype._chooseSubtree = function(m, w, u, v) {
        for (; v.push(w), !w.leaf && v.length - 1 !== u; ) {
          for (var x = 1 / 0, _ = 1 / 0, A = void 0, E = 0; E < w.children.length; E++) {
            var T = w.children[E], I = d(T), D = (X = m, p = T, (Math.max(p.maxX, X.maxX) - Math.min(p.minX, X.minX)) * (Math.max(p.maxY, X.maxY) - Math.min(p.minY, X.minY)) - I);
            D < _ ? (_ = D, x = I < x ? I : x, A = T) : D === _ && I < x && (x = I, A = T);
          }
          w = A || w.children[0];
        }
        var X, p;
        return w;
      }, r.prototype._insert = function(m, w, u) {
        var v = u ? m : this.toBBox(m), x = [], _ = this._chooseSubtree(v, this.data, w, x);
        for (_.children.push(m), f(_, v); w >= 0 && x[w].children.length > this._maxEntries; ) this._split(x, w), w--;
        this._adjustParentBBoxes(v, x, w);
      }, r.prototype._split = function(m, w) {
        var u = m[w], v = u.children.length, x = this._minEntries;
        this._chooseSplitAxis(u, x, v);
        var _ = this._chooseSplitIndex(u, x, v), A = B(u.children.splice(_, u.children.length - _));
        A.height = u.height, A.leaf = u.leaf, a(u, this.toBBox), a(A, this.toBBox), w ? m[w - 1].children.push(A) : this._splitRoot(u, A);
      }, r.prototype._splitRoot = function(m, w) {
        this.data = B([m, w]), this.data.height = m.height + 1, this.data.leaf = !1, a(this.data, this.toBBox);
      }, r.prototype._chooseSplitIndex = function(m, w, u) {
        for (var v, x, _, A, E, T, I, D = 1 / 0, X = 1 / 0, p = w; p <= u - w; p++) {
          var k = c(m, 0, p, this.toBBox), S = c(m, p, u, this.toBBox), F = (x = k, _ = S, A = void 0, E = void 0, T = void 0, I = void 0, A = Math.max(x.minX, _.minX), E = Math.max(x.minY, _.minY), T = Math.min(x.maxX, _.maxX), I = Math.min(x.maxY, _.maxY), Math.max(0, T - A) * Math.max(0, I - E)), N = d(k) + d(S);
          F < D ? (D = F, v = p, X = N < X ? N : X) : F === D && N < X && (X = N, v = p);
        }
        return v || u - w;
      }, r.prototype._chooseSplitAxis = function(m, w, u) {
        var v = m.leaf ? this.compareMinX : h, x = m.leaf ? this.compareMinY : l;
        this._allDistMargin(m, w, u, v) < this._allDistMargin(m, w, u, x) && m.children.sort(v);
      }, r.prototype._allDistMargin = function(m, w, u, v) {
        m.children.sort(v);
        for (var x = this.toBBox, _ = c(m, 0, w, x), A = c(m, u - w, u, x), E = g(_) + g(A), T = w; T < u - w; T++) {
          var I = m.children[T];
          f(_, m.leaf ? x(I) : I), E += g(_);
        }
        for (var D = u - w - 1; D >= w; D--) {
          var X = m.children[D];
          f(A, m.leaf ? x(X) : X), E += g(A);
        }
        return E;
      }, r.prototype._adjustParentBBoxes = function(m, w, u) {
        for (var v = u; v >= 0; v--) f(w[v], m);
      }, r.prototype._condense = function(m) {
        for (var w = m.length - 1, u = void 0; w >= 0; w--) m[w].children.length === 0 ? w > 0 ? (u = m[w - 1].children).splice(u.indexOf(m[w]), 1) : this.clear() : a(m[w], this.toBBox);
      }, r;
    });
  })(we)), we.exports;
}
const _r = /* @__PURE__ */ yr(ir);
var zt = { exports: {} }, Te, tn;
function Sr() {
  return tn || (tn = 1, Te = function(t, e, n, o) {
    var r = t[0], s = t[1], a = !1;
    n === void 0 && (n = 0), o === void 0 && (o = e.length);
    for (var c = (o - n) / 2, f = 0, h = c - 1; f < c; h = f++) {
      var l = e[n + f * 2 + 0], d = e[n + f * 2 + 1], g = e[n + h * 2 + 0], b = e[n + h * 2 + 1], M = d > s != b > s && r < (g - l) * (s - d) / (b - d) + l;
      M && (a = !a);
    }
    return a;
  }), Te;
}
var Fe, en;
function kr() {
  return en || (en = 1, Fe = function(t, e, n, o) {
    var r = t[0], s = t[1], a = !1;
    n === void 0 && (n = 0), o === void 0 && (o = e.length);
    for (var c = o - n, f = 0, h = c - 1; f < c; h = f++) {
      var l = e[f + n][0], d = e[f + n][1], g = e[h + n][0], b = e[h + n][1], M = d > s != b > s && r < (g - l) * (s - d) / (b - d) + l;
      M && (a = !a);
    }
    return a;
  }), Fe;
}
var nn;
function Er() {
  if (nn) return zt.exports;
  nn = 1;
  var i = Sr(), t = kr();
  return zt.exports = function(n, o, r, s) {
    return o.length > 0 && Array.isArray(o[0]) ? t(n, o, r, s) : i(n, o, r, s);
  }, zt.exports.nested = t, zt.exports.flat = i, zt.exports;
}
var Kt = { exports: {} }, Ar = Kt.exports, rn;
function Ir() {
  return rn || (rn = 1, (function(i, t) {
    (function(e, n) {
      n(t);
    })(Ar, function(e) {
      const o = 33306690738754706e-32;
      function r(M, B, O, m, w) {
        let u, v, x, _, A = B[0], E = m[0], T = 0, I = 0;
        E > A == E > -A ? (u = A, A = B[++T]) : (u = E, E = m[++I]);
        let D = 0;
        if (T < M && I < O) for (E > A == E > -A ? (x = u - ((v = A + u) - A), A = B[++T]) : (x = u - ((v = E + u) - E), E = m[++I]), u = v, x !== 0 && (w[D++] = x); T < M && I < O; ) E > A == E > -A ? (x = u - ((v = u + A) - (_ = v - u)) + (A - _), A = B[++T]) : (x = u - ((v = u + E) - (_ = v - u)) + (E - _), E = m[++I]), u = v, x !== 0 && (w[D++] = x);
        for (; T < M; ) x = u - ((v = u + A) - (_ = v - u)) + (A - _), A = B[++T], u = v, x !== 0 && (w[D++] = x);
        for (; I < O; ) x = u - ((v = u + E) - (_ = v - u)) + (E - _), E = m[++I], u = v, x !== 0 && (w[D++] = x);
        return u === 0 && D !== 0 || (w[D++] = u), D;
      }
      function s(M) {
        return new Float64Array(M);
      }
      const a = 33306690738754716e-32, c = 22204460492503146e-32, f = 11093356479670487e-47, h = s(4), l = s(8), d = s(12), g = s(16), b = s(4);
      e.orient2d = function(M, B, O, m, w, u) {
        const v = (B - u) * (O - w), x = (M - w) * (m - u), _ = v - x;
        if (v === 0 || x === 0 || v > 0 != x > 0) return _;
        const A = Math.abs(v + x);
        return Math.abs(_) >= a * A ? _ : -(function(E, T, I, D, X, p, k) {
          let S, F, N, P, y, C, $, Y, L, V, j, q, K, G, H, Q, Z, W;
          const st = E - X, ft = I - X, it = T - p, ot = D - p;
          y = (H = (Y = st - ($ = (C = 134217729 * st) - (C - st))) * (V = ot - (L = (C = 134217729 * ot) - (C - ot))) - ((G = st * ot) - $ * L - Y * L - $ * V)) - (j = H - (Z = (Y = it - ($ = (C = 134217729 * it) - (C - it))) * (V = ft - (L = (C = 134217729 * ft) - (C - ft))) - ((Q = it * ft) - $ * L - Y * L - $ * V))), h[0] = H - (j + y) + (y - Z), y = (K = G - ((q = G + j) - (y = q - G)) + (j - y)) - (j = K - Q), h[1] = K - (j + y) + (y - Q), y = (W = q + j) - q, h[2] = q - (W - y) + (j - y), h[3] = W;
          let Ot = (function(Yn, Ye) {
            let Re = Ye[0];
            for (let xe = 1; xe < Yn; xe++) Re += Ye[xe];
            return Re;
          })(4, h), Ut = c * k;
          if (Ot >= Ut || -Ot >= Ut || (S = E - (st + (y = E - st)) + (y - X), N = I - (ft + (y = I - ft)) + (y - X), F = T - (it + (y = T - it)) + (y - p), P = D - (ot + (y = D - ot)) + (y - p), S === 0 && F === 0 && N === 0 && P === 0) || (Ut = f * k + o * Math.abs(Ot), (Ot += st * P + ot * S - (it * N + ft * F)) >= Ut || -Ot >= Ut)) return Ot;
          y = (H = (Y = S - ($ = (C = 134217729 * S) - (C - S))) * (V = ot - (L = (C = 134217729 * ot) - (C - ot))) - ((G = S * ot) - $ * L - Y * L - $ * V)) - (j = H - (Z = (Y = F - ($ = (C = 134217729 * F) - (C - F))) * (V = ft - (L = (C = 134217729 * ft) - (C - ft))) - ((Q = F * ft) - $ * L - Y * L - $ * V))), b[0] = H - (j + y) + (y - Z), y = (K = G - ((q = G + j) - (y = q - G)) + (j - y)) - (j = K - Q), b[1] = K - (j + y) + (y - Q), y = (W = q + j) - q, b[2] = q - (W - y) + (j - y), b[3] = W;
          const Pn = r(4, h, 4, b, l);
          y = (H = (Y = st - ($ = (C = 134217729 * st) - (C - st))) * (V = P - (L = (C = 134217729 * P) - (C - P))) - ((G = st * P) - $ * L - Y * L - $ * V)) - (j = H - (Z = (Y = it - ($ = (C = 134217729 * it) - (C - it))) * (V = N - (L = (C = 134217729 * N) - (C - N))) - ((Q = it * N) - $ * L - Y * L - $ * V))), b[0] = H - (j + y) + (y - Z), y = (K = G - ((q = G + j) - (y = q - G)) + (j - y)) - (j = K - Q), b[1] = K - (j + y) + (y - Q), y = (W = q + j) - q, b[2] = q - (W - y) + (j - y), b[3] = W;
          const Xn = r(Pn, l, 4, b, d);
          y = (H = (Y = S - ($ = (C = 134217729 * S) - (C - S))) * (V = P - (L = (C = 134217729 * P) - (C - P))) - ((G = S * P) - $ * L - Y * L - $ * V)) - (j = H - (Z = (Y = F - ($ = (C = 134217729 * F) - (C - F))) * (V = N - (L = (C = 134217729 * N) - (C - N))) - ((Q = F * N) - $ * L - Y * L - $ * V))), b[0] = H - (j + y) + (y - Z), y = (K = G - ((q = G + j) - (y = q - G)) + (j - y)) - (j = K - Q), b[1] = K - (j + y) + (y - Q), y = (W = q + j) - q, b[2] = q - (W - y) + (j - y), b[3] = W;
          const $n = r(Xn, d, 4, b, g);
          return g[$n - 1];
        })(M, B, O, m, w, u, A);
      }, e.orient2dfast = function(M, B, O, m, w, u) {
        return (B - u) * (O - w) - (M - w) * (m - u);
      }, Object.defineProperty(e, "__esModule", { value: !0 });
    });
  })(Kt, Kt.exports)), Kt.exports;
}
var on;
function Br() {
  if (on) return he.exports;
  on = 1;
  var i = Mr(), t = _r, e = Er(), n = Ir().orient2d;
  t.default && (t = t.default), he.exports = o, he.exports.default = o;
  function o(u, v, x) {
    v = Math.max(0, v === void 0 ? 2 : v), x = x || 0;
    var _ = g(u), A = new i(16);
    A.toBBox = function($) {
      return {
        minX: $[0],
        minY: $[1],
        maxX: $[0],
        maxY: $[1]
      };
    }, A.compareMinX = function($, Y) {
      return $[0] - Y[0];
    }, A.compareMinY = function($, Y) {
      return $[1] - Y[1];
    }, A.load(u);
    for (var E = [], T = 0, I; T < _.length; T++) {
      var D = _[T];
      A.remove(D), I = b(D, I), E.push(I);
    }
    var X = new i(16);
    for (T = 0; T < E.length; T++) X.insert(d(E[T]));
    for (var p = v * v, k = x * x; E.length; ) {
      var S = E.shift(), F = S.p, N = S.next.p, P = M(F, N);
      if (!(P < k)) {
        var y = P / p;
        D = r(A, S.prev.p, F, N, S.next.next.p, y, X), D && Math.min(M(D, F), M(D, N)) <= y && (E.push(S), E.push(b(D, S)), A.remove(D), X.remove(S), X.insert(d(S)), X.insert(d(S.next)));
      }
    }
    S = I;
    var C = [];
    do
      C.push(S.p), S = S.next;
    while (S !== I);
    return C.push(S.p), C;
  }
  function r(u, v, x, _, A, E, T) {
    for (var I = new t([], s), D = u.data; D; ) {
      for (var X = 0; X < D.children.length; X++) {
        var p = D.children[X], k = D.leaf ? B(p, x, _) : a(x, _, p);
        k > E || I.push({
          node: p,
          dist: k
        });
      }
      for (; I.length && !I.peek().node.children; ) {
        var S = I.pop(), F = S.node, N = B(F, v, x), P = B(F, _, A);
        if (S.dist < N && S.dist < P && f(x, F, T) && f(_, F, T)) return F;
      }
      D = I.pop(), D && (D = D.node);
    }
    return null;
  }
  function s(u, v) {
    return u.dist - v.dist;
  }
  function a(u, v, x) {
    if (c(u, x) || c(v, x)) return 0;
    var _ = O(u[0], u[1], v[0], v[1], x.minX, x.minY, x.maxX, x.minY);
    if (_ === 0) return 0;
    var A = O(u[0], u[1], v[0], v[1], x.minX, x.minY, x.minX, x.maxY);
    if (A === 0) return 0;
    var E = O(u[0], u[1], v[0], v[1], x.maxX, x.minY, x.maxX, x.maxY);
    if (E === 0) return 0;
    var T = O(u[0], u[1], v[0], v[1], x.minX, x.maxY, x.maxX, x.maxY);
    return T === 0 ? 0 : Math.min(_, A, E, T);
  }
  function c(u, v) {
    return u[0] >= v.minX && u[0] <= v.maxX && u[1] >= v.minY && u[1] <= v.maxY;
  }
  function f(u, v, x) {
    for (var _ = Math.min(u[0], v[0]), A = Math.min(u[1], v[1]), E = Math.max(u[0], v[0]), T = Math.max(u[1], v[1]), I = x.search({ minX: _, minY: A, maxX: E, maxY: T }), D = 0; D < I.length; D++)
      if (l(I[D].p, I[D].next.p, u, v)) return !1;
    return !0;
  }
  function h(u, v, x) {
    return n(u[0], u[1], v[0], v[1], x[0], x[1]);
  }
  function l(u, v, x, _) {
    return u !== _ && v !== x && h(u, v, x) > 0 != h(u, v, _) > 0 && h(x, _, u) > 0 != h(x, _, v) > 0;
  }
  function d(u) {
    var v = u.p, x = u.next.p;
    return u.minX = Math.min(v[0], x[0]), u.minY = Math.min(v[1], x[1]), u.maxX = Math.max(v[0], x[0]), u.maxY = Math.max(v[1], x[1]), u;
  }
  function g(u) {
    for (var v = u[0], x = u[0], _ = u[0], A = u[0], E = 0; E < u.length; E++) {
      var T = u[E];
      T[0] < v[0] && (v = T), T[0] > _[0] && (_ = T), T[1] < x[1] && (x = T), T[1] > A[1] && (A = T);
    }
    var I = [v, x, _, A], D = I.slice();
    for (E = 0; E < u.length; E++)
      e(u[E], I) || D.push(u[E]);
    return w(D);
  }
  function b(u, v) {
    var x = {
      p: u,
      prev: null,
      next: null,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };
    return v ? (x.next = v.next, x.prev = v, v.next.prev = x, v.next = x) : (x.prev = x, x.next = x), x;
  }
  function M(u, v) {
    var x = u[0] - v[0], _ = u[1] - v[1];
    return x * x + _ * _;
  }
  function B(u, v, x) {
    var _ = v[0], A = v[1], E = x[0] - _, T = x[1] - A;
    if (E !== 0 || T !== 0) {
      var I = ((u[0] - _) * E + (u[1] - A) * T) / (E * E + T * T);
      I > 1 ? (_ = x[0], A = x[1]) : I > 0 && (_ += E * I, A += T * I);
    }
    return E = u[0] - _, T = u[1] - A, E * E + T * T;
  }
  function O(u, v, x, _, A, E, T, I) {
    var D = x - u, X = _ - v, p = T - A, k = I - E, S = u - A, F = v - E, N = D * D + X * X, P = D * p + X * k, y = p * p + k * k, C = D * S + X * F, $ = p * S + k * F, Y = N * y - P * P, L, V, j, q, K = Y, G = Y;
    Y === 0 ? (V = 0, K = 1, q = $, G = y) : (V = P * $ - y * C, q = N * $ - P * C, V < 0 ? (V = 0, q = $, G = y) : V > K && (V = K, q = $ + P, G = y)), q < 0 ? (q = 0, -C < 0 ? V = 0 : -C > N ? V = K : (V = -C, K = N)) : q > G && (q = G, -C + P < 0 ? V = 0 : -C + P > N ? V = K : (V = -C + P, K = N)), L = V === 0 ? 0 : V / K, j = q === 0 ? 0 : q / G;
    var H = (1 - L) * u + L * x, Q = (1 - L) * v + L * _, Z = (1 - j) * A + j * T, W = (1 - j) * E + j * I, st = Z - H, ft = W - Q;
    return st * st + ft * ft;
  }
  function m(u, v) {
    return u[0] === v[0] ? u[1] - v[1] : u[0] - v[0];
  }
  function w(u) {
    u.sort(m);
    for (var v = [], x = 0; x < u.length; x++) {
      for (; v.length >= 2 && h(v[v.length - 2], v[v.length - 1], u[x]) <= 0; )
        v.pop();
      v.push(u[x]);
    }
    for (var _ = [], A = u.length - 1; A >= 0; A--) {
      for (; _.length >= 2 && h(_[_.length - 2], _[_.length - 1], u[A]) <= 0; )
        _.pop();
      _.push(u[A]);
    }
    return _.pop(), v.pop(), v.concat(_);
  }
  return he.exports;
}
var Or = Br();
const Tr = /* @__PURE__ */ vr(Or);
function sn(i, t = {}) {
  t.concavity = t.concavity || 1 / 0;
  const e = [];
  if (Pe(i, (o) => {
    e.push([o[0], o[1]]);
  }), !e.length)
    return null;
  const n = Tr(e, t.concavity);
  return n.length > 3 ? ne([n], t.properties) : null;
}
const an = Math.pow(2, -52), ue = new Uint32Array(512);
class ve {
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
  static from(t, e = Pr, n = Xr) {
    const o = t.length, r = new Float64Array(o * 2);
    for (let s = 0; s < o; s++) {
      const a = t[s];
      r[2 * s] = e(a), r[2 * s + 1] = n(a);
    }
    return new ve(r);
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
    const { coords: t, _hullPrev: e, _hullNext: n, _hullTri: o, _hullHash: r } = this, s = t.length >> 1;
    let a = 1 / 0, c = 1 / 0, f = -1 / 0, h = -1 / 0;
    for (let E = 0; E < s; E++) {
      const T = t[2 * E], I = t[2 * E + 1];
      T < a && (a = T), I < c && (c = I), T > f && (f = T), I > h && (h = I), this._ids[E] = E;
    }
    const l = (a + f) / 2, d = (c + h) / 2;
    let g = 0, b = 0, M = 0;
    for (let E = 0, T = 1 / 0; E < s; E++) {
      const I = Ce(l, d, t[2 * E], t[2 * E + 1]);
      I < T && (g = E, T = I);
    }
    const B = t[2 * g], O = t[2 * g + 1];
    for (let E = 0, T = 1 / 0; E < s; E++) {
      if (E === g) continue;
      const I = Ce(B, O, t[2 * E], t[2 * E + 1]);
      I < T && I > 0 && (b = E, T = I);
    }
    let m = t[2 * b], w = t[2 * b + 1], u = 1 / 0;
    for (let E = 0; E < s; E++) {
      if (E === g || E === b) continue;
      const T = Nr(B, O, m, w, t[2 * E], t[2 * E + 1]);
      T < u && (M = E, u = T);
    }
    let v = t[2 * M], x = t[2 * M + 1];
    if (u === 1 / 0) {
      for (let I = 0; I < s; I++)
        this._dists[I] = t[2 * I] - t[0] || t[2 * I + 1] - t[1];
      qt(this._ids, this._dists, 0, s - 1);
      const E = new Uint32Array(s);
      let T = 0;
      for (let I = 0, D = -1 / 0; I < s; I++) {
        const X = this._ids[I], p = this._dists[X];
        p > D && (E[T++] = X, D = p);
      }
      this.hull = E.subarray(0, T), this.triangles = new Uint32Array(0), this.halfedges = new Int32Array(0);
      return;
    }
    if (_t(B, O, m, w, v, x) < 0) {
      const E = b, T = m, I = w;
      b = M, m = v, w = x, M = E, v = T, x = I;
    }
    const _ = Dr(B, O, m, w, v, x);
    this._cx = _.x, this._cy = _.y;
    for (let E = 0; E < s; E++)
      this._dists[E] = Ce(t[2 * E], t[2 * E + 1], _.x, _.y);
    qt(this._ids, this._dists, 0, s - 1), this._hullStart = g;
    let A = 3;
    n[g] = e[M] = b, n[b] = e[g] = M, n[M] = e[b] = g, o[g] = 0, o[b] = 1, o[M] = 2, r.fill(-1), r[this._hashKey(B, O)] = g, r[this._hashKey(m, w)] = b, r[this._hashKey(v, x)] = M, this.trianglesLen = 0, this._addTriangle(g, b, M, -1, -1, -1);
    for (let E = 0, T = 0, I = 0; E < this._ids.length; E++) {
      const D = this._ids[E], X = t[2 * D], p = t[2 * D + 1];
      if (E > 0 && Math.abs(X - T) <= an && Math.abs(p - I) <= an || (T = X, I = p, D === g || D === b || D === M)) continue;
      let k = 0;
      for (let y = 0, C = this._hashKey(X, p); y < this._hashSize && (k = r[(C + y) % this._hashSize], !(k !== -1 && k !== n[k])); y++)
        ;
      k = e[k];
      let S = k, F;
      for (; F = n[S], _t(X, p, t[2 * S], t[2 * S + 1], t[2 * F], t[2 * F + 1]) >= 0; )
        if (S = F, S === k) {
          S = -1;
          break;
        }
      if (S === -1) continue;
      let N = this._addTriangle(S, D, n[S], -1, -1, o[S]);
      o[D] = this._legalize(N + 2), o[S] = N, A++;
      let P = n[S];
      for (; F = n[P], _t(X, p, t[2 * P], t[2 * P + 1], t[2 * F], t[2 * F + 1]) < 0; )
        N = this._addTriangle(P, D, F, o[D], -1, o[P]), o[D] = this._legalize(N + 2), n[P] = P, A--, P = F;
      if (S === k)
        for (; F = e[S], _t(X, p, t[2 * F], t[2 * F + 1], t[2 * S], t[2 * S + 1]) < 0; )
          N = this._addTriangle(F, D, S, -1, o[S], o[F]), this._legalize(N + 2), o[F] = N, n[S] = S, A--, S = F;
      this._hullStart = e[D] = S, n[S] = e[P] = D, n[D] = P, r[this._hashKey(X, p)] = D, r[this._hashKey(t[2 * S], t[2 * S + 1])] = S;
    }
    this.hull = new Uint32Array(A);
    for (let E = 0, T = this._hullStart; E < A; E++)
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
    return Math.floor(Fr(t - this._cx, e - this._cy) * this._hashSize) % this._hashSize;
  }
  /**
   * Flip an edge in a pair of triangles if it doesn't satisfy the Delaunay condition.
   *
   * @param {number} a
   * @private
   */
  _legalize(t) {
    const { _triangles: e, _halfedges: n, coords: o } = this;
    let r = 0, s = 0;
    for (; ; ) {
      const a = n[t], c = t - t % 3;
      if (s = c + (t + 2) % 3, a === -1) {
        if (r === 0) break;
        t = ue[--r];
        continue;
      }
      const f = a - a % 3, h = c + (t + 1) % 3, l = f + (a + 2) % 3, d = e[s], g = e[t], b = e[h], M = e[l];
      if (Cr(
        o[2 * d],
        o[2 * d + 1],
        o[2 * g],
        o[2 * g + 1],
        o[2 * b],
        o[2 * b + 1],
        o[2 * M],
        o[2 * M + 1]
      )) {
        e[t] = M, e[a] = d;
        const O = n[l];
        if (O === -1) {
          let w = this._hullStart;
          do {
            if (this._hullTri[w] === l) {
              this._hullTri[w] = t;
              break;
            }
            w = this._hullPrev[w];
          } while (w !== this._hullStart);
        }
        this._link(t, O), this._link(a, n[s]), this._link(s, l);
        const m = f + (a + 1) % 3;
        r < ue.length && (ue[r++] = m);
      } else {
        if (r === 0) break;
        t = ue[--r];
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
  _addTriangle(t, e, n, o, r, s) {
    const a = this.trianglesLen;
    return this._triangles[a] = t, this._triangles[a + 1] = e, this._triangles[a + 2] = n, this._link(a, o), this._link(a + 1, r), this._link(a + 2, s), this.trianglesLen += 3, a;
  }
}
function Fr(i, t) {
  const e = i / (Math.abs(i) + Math.abs(t));
  return (t > 0 ? 3 - e : 1 + e) / 4;
}
function Ce(i, t, e, n) {
  const o = i - e, r = t - n;
  return o * o + r * r;
}
function Cr(i, t, e, n, o, r, s, a) {
  const c = i - s, f = t - a, h = e - s, l = n - a, d = o - s, g = r - a, b = c * c + f * f, M = h * h + l * l, B = d * d + g * g;
  return c * (l * B - M * g) - f * (h * B - M * d) + b * (h * g - l * d) < 0;
}
function Nr(i, t, e, n, o, r) {
  const s = e - i, a = n - t, c = o - i, f = r - t, h = s * s + a * a, l = c * c + f * f, d = 0.5 / (s * f - a * c), g = (f * h - a * l) * d, b = (s * l - c * h) * d;
  return g * g + b * b;
}
function Dr(i, t, e, n, o, r) {
  const s = e - i, a = n - t, c = o - i, f = r - t, h = s * s + a * a, l = c * c + f * f, d = 0.5 / (s * f - a * c), g = i + (f * h - a * l) * d, b = t + (s * l - c * h) * d;
  return { x: g, y: b };
}
function qt(i, t, e, n) {
  if (n - e <= 20)
    for (let o = e + 1; o <= n; o++) {
      const r = i[o], s = t[r];
      let a = o - 1;
      for (; a >= e && t[i[a]] > s; ) i[a + 1] = i[a--];
      i[a + 1] = r;
    }
  else {
    const o = e + n >> 1;
    let r = e + 1, s = n;
    Gt(i, o, r), t[i[e]] > t[i[n]] && Gt(i, e, n), t[i[r]] > t[i[n]] && Gt(i, r, n), t[i[e]] > t[i[r]] && Gt(i, e, r);
    const a = i[r], c = t[a];
    for (; ; ) {
      do
        r++;
      while (t[i[r]] < c);
      do
        s--;
      while (t[i[s]] > c);
      if (s < r) break;
      Gt(i, r, s);
    }
    i[e + 1] = i[s], i[s] = a, n - r + 1 >= s - e ? (qt(i, t, r, n), qt(i, t, e, s - 1)) : (qt(i, t, e, s - 1), qt(i, t, r, n));
  }
}
function Gt(i, t, e) {
  const n = i[t];
  i[t] = i[e], i[e] = n;
}
function Pr(i) {
  return i[0];
}
function Xr(i) {
  return i[1];
}
class $r {
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
      let o = 0;
      for (; this.bs[n] && o < this.width; )
        this.bs[n] & 1 << o && t(n * this.width + o), o++;
    }
    return this;
  }
}
class cn extends $r {
  constructor(t) {
    super(8, new Uint8Array(Math.ceil(t / 8)).fill(0));
  }
}
function At(i) {
  return i % 3 === 2 ? i - 2 : i + 1;
}
function xt(i) {
  return i % 3 === 0 ? i + 2 : i - 1;
}
function ln(i, t, e, n, o, r, s, a) {
  const c = _t(i, t, o, r, s, a), f = _t(e, n, o, r, s, a);
  if (c > 0 && f > 0 || c < 0 && f < 0)
    return !1;
  const h = _t(o, r, i, t, e, n), l = _t(s, a, i, t, e, n);
  return h > 0 && l > 0 || h < 0 && l < 0 ? !1 : c === 0 && f === 0 && h === 0 && l === 0 ? !(Math.max(o, s) < Math.min(i, e) || Math.max(i, e) < Math.min(o, s) || Math.max(r, a) < Math.min(t, n) || Math.max(t, n) < Math.min(r, a)) : !0;
}
class Yr {
  /**
   * The triangulation object from Delaunator.
   */
  del;
  constructor(t) {
    this.del = t;
  }
}
class fn extends Yr {
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
    const n = 2 ** 32 - 1, o = t.coords.length >> 1, r = t.triangles.length;
    this.vertMap = new Uint32Array(o).fill(n), this.flips = new cn(r), this.consd = new cn(r);
    for (let s = 0; s < r; s++) {
      const a = t.triangles[s];
      this.vertMap[a] === n && this.updateVert(s);
    }
    e && this.constrainAll(e);
  }
  /**
   * Constrain the triangulation such that there is an edge between p1 and p2.
   */
  constrainOne(t, e) {
    const { triangles: n, halfedges: o } = this.del;
    this.assertVertex(t, t, e), this.assertVertex(e, t, e), this.assertInTriangulation(t, t, e), this.assertInTriangulation(e, t, e);
    const r = this.vertMap[t], s = this.maxConstrainSteps();
    let a = 0, c = r;
    do {
      if (++a > s)
        throw new Error(
          `Constraining edge [${t}, ${e}] exceeded the iteration limit`
        );
      const l = n[c], d = At(c);
      if (l === e)
        return this.protect(c);
      const g = xt(c), b = n[g];
      if (b === e)
        return this.protect(d), d;
      if (this.intersectSegments(t, e, b, l)) {
        c = g;
        break;
      }
      c = o[d];
    } while (c !== -1 && c !== r);
    let f = c, h = -1;
    for (; c !== -1; ) {
      if (++a > s)
        throw new Error(
          `Constraining edge [${t}, ${e}] exceeded the iteration limit`
        );
      const l = o[c], d = xt(c), g = xt(l), b = At(l);
      if (l === -1)
        throw new Error("Constraining edge exited the hull");
      if (this.consd.has(c))
        throw new Error("Edge intersects already constrained edge");
      if (this.isCollinear(t, e, n[c]) || this.isCollinear(t, e, n[l]))
        throw new Error("Constraining edge intersects point");
      if (!this.intersectSegments(
        n[c],
        n[l],
        n[d],
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
          n[l]
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
        n[d],
        n[g]
      ) && (h === -1 && (h = d), h === d))
        throw new Error("Infinite loop: flipped diagonal still intersects");
      n[g] === e ? (f = g, c = h, h = -1) : this.intersectSegments(
        t,
        e,
        n[b],
        n[g]
      ) && (c = b);
    }
    return this.protect(f), this.delaunify(!0), this.findEdge(t, e);
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
    const { halfedges: e } = this.del, n = this.flips, o = this.consd, r = e.length;
    let s;
    do {
      s = 0;
      for (let a = 0; a < r; a++) {
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
    const { triangles: n, halfedges: o } = this.del, r = n.length / 3, s = (b, M, B) => {
      const O = t(M), m = t(B);
      return t(b).some((w) => O.includes(w) && m.includes(w));
    }, a = (b) => s(n[b * 3], n[b * 3 + 1], n[b * 3 + 2]), c = (b, M, B, O) => Math.sign(_t(b[M * 2], b[M * 2 + 1], b[B * 2], b[B * 2 + 1], b[O * 2], b[O * 2 + 1])), f = e.map((b) => {
      let M = 0;
      for (let B = 0; B < r; B++) M += c(b, n[B * 3], n[B * 3 + 1], n[B * 3 + 2]);
      return M < 0 ? -1 : 1;
    }), h = (b) => {
      if (this.consd.has(b)) return !1;
      const M = o[b];
      if (M === -1) return !1;
      const B = n[b], O = n[At(b)], m = n[xt(b)], w = n[xt(M)];
      return e.every((u, v) => c(u, m, B, w) === f[v] && c(u, w, O, m) === f[v]);
    };
    let l = 0, d = !0;
    for (; d; ) {
      d = !1;
      for (let b = 0; b < r; b++)
        if (a(b))
          for (let M = 0; M < 3; M++) {
            const B = b * 3 + M;
            if (!h(B)) continue;
            const O = o[B], m = n[B], w = n[At(B)], u = n[xt(B)], v = n[xt(O)];
            if (!(s(u, m, v) && s(v, w, u))) {
              this.protect(this.flipDiagonal(B)), l++, d = !0;
              break;
            }
          }
    }
    let g = 0;
    for (let b = 0; b < r; b++) a(b) && g++;
    return { flips: l, remaining: g };
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
    const n = this.vertMap[e], { triangles: o, halfedges: r } = this.del;
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
      a = At(s), s = r[a];
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
    const r = e[t];
    return r !== -1 && (n.add(t), n.add(r)), !0;
  }
  /**
   * Flip the edge shared by two triangles.
   */
  flipDiagonal(t) {
    const { triangles: e, halfedges: n } = this.del, o = this.flips, r = this.consd, s = n[t], a = xt(t), c = At(t), f = xt(s), h = At(s), l = n[a], d = n[f];
    if (r.has(t))
      throw new Error("Trying to flip a constrained edge");
    return e[t] = e[f], n[t] = d, o.set(t, o.has(f)) || r.set(t, r.has(f)), d !== -1 && (n[d] = t), n[a] = f, e[s] = e[a], n[s] = l, o.set(s, o.has(a)) || r.set(s, r.has(a)), l !== -1 && (n[l] = s), n[f] = a, this.markFlip(t), this.markFlip(c), this.markFlip(s), this.markFlip(h), o.add(a), r.delete(a), o.add(f), r.delete(f), this.updateVert(t), this.updateVert(c), this.updateVert(s), this.updateVert(h), a;
  }
  /**
   * Whether point p1, p2, and p are collinear.
   */
  isCollinear(t, e, n) {
    const o = this.del.coords;
    return _t(
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
    const r = this.del.coords;
    return tr(
      r[t * 2],
      r[t * 2 + 1],
      r[e * 2],
      r[e * 2 + 1],
      r[n * 2],
      r[n * 2 + 1],
      r[o * 2],
      r[o * 2 + 1]
    ) < 0;
  }
  /**
   * Whether the triangles sharing edg conform to the Delaunay condition.
   */
  isDelaunay(t) {
    const { triangles: e, halfedges: n } = this.del, o = n[t];
    if (o === -1)
      return !0;
    const r = e[xt(t)], s = e[t], a = e[At(t)], c = e[xt(o)];
    return !this.inCircle(r, s, a, c);
  }
  /**
   * Update the vertex -> incoming edge map.
   */
  updateVert(t) {
    const { triangles: e, halfedges: n } = this.del, o = this.vertMap, r = e[t];
    let s = xt(t), a = n[s];
    for (; a !== -1 && a !== t; )
      s = xt(a), a = n[s];
    return o[r] = s, s;
  }
  /**
   * Whether the segments between vertices intersect.
   */
  intersectSegments(t, e, n, o) {
    const r = this.del.coords;
    return t === n || t === o || e === n || e === o ? !1 : ln(
      r[t * 2],
      r[t * 2 + 1],
      r[e * 2],
      r[e * 2 + 1],
      r[n * 2],
      r[n * 2 + 1],
      r[o * 2],
      r[o * 2 + 1]
    );
  }
  static intersectSegments = ln;
}
function de(i, t, e) {
  return Ne(i, t, e).tin;
}
function Ne(i, t, e, n) {
  if (t || (t = []), typeof i != "object" || i.type !== "FeatureCollection")
    throw "Argument points must be FeatureCollection";
  if (!Array.isArray(t)) throw "Argument points must be Array of Array";
  const o = i.features.map(
    (l) => l.geometry.coordinates
  );
  let r = ve.from(o), s = 0, a;
  if (r.triangles.length !== 0 && (t.length !== 0 || n)) {
    let l = new fn(r);
    try {
      l.constrainAll(t);
    } catch (d) {
      if (!n?.allowUnusableBoundary) throw d;
      return { tin: bt([]), remaining: 0, hasBoundary: !1 };
    }
    n?.boundary && (a = Rr(l, n.boundary), a || (r = ve.from(o), l = new fn(r, t))), n && ({ remaining: s } = l.forbidGroupTriangles(
      n.groupsOf,
      n.planes
    ), s -= a?.size ?? 0);
  }
  const c = [];
  for (let l = 0; l < r.triangles.length; l += 3)
    a?.has(l / 3) || c.push([r.triangles[l], r.triangles[l + 1], r.triangles[l + 2]]);
  const f = ["a", "b", "c"];
  return { tin: bt(
    c.map((l) => {
      const d = {}, g = l.map((b, M) => {
        const B = i.features[b], O = B.geometry.coordinates, m = [O[0], O[1]];
        return O.length === 3 ? m[2] = O[2] : d[f[M]] = B.properties[e], m;
      });
      return g[3] = g[0], ne([g], d);
    })
  ), remaining: s, hasBoundary: a !== void 0 };
}
function Rr(i, t) {
  try {
    i.constrainAll(t);
  } catch {
    return;
  }
  const e = new Map(t), { triangles: n, halfedges: o } = i.del, r = (f) => {
    const h = n[f], l = n[At(f)];
    return e.get(h) === l || e.get(l) === h;
  }, s = /* @__PURE__ */ new Set(), a = [], c = (f) => {
    const h = Math.floor(f / 3);
    s.has(h) || (s.add(h), a.push(h));
  };
  for (let f = 0; f < o.length; f++)
    o[f] === -1 && !r(f) && c(f);
  for (let f = 0; f < a.length; f++)
    for (let h = a[f] * 3; h < a[f] * 3 + 3; h++) {
      if (!e.has(n[h])) return;
      o[h] !== -1 && !r(h) && c(o[h]);
    }
  return s;
}
function Jt(i, t, e) {
  return Pt(i, { target: { geom: t, index: e } });
}
function Ht(i) {
  return Pt(i.properties.target.geom, {
    target: {
      geom: i.geometry.coordinates,
      index: i.properties.target.index
    }
  });
}
function hn(i, t) {
  const e = i.length, n = t.geometry.coordinates;
  return Array.from({ length: e }, (o, r) => r).map((o) => {
    const r = (o + 1) % e, s = i[o], a = i[r], c = s.geometry.coordinates, f = Math.atan2(
      c[0] - n[0],
      c[1] - n[1]
    ), h = [t, s, a, t].map(
      (g) => g.geometry.coordinates
    ), l = {
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
    }, d = bt([
      ne([h], l)
    ]);
    return [f, d];
  }).reduce(
    (o, r) => (o[0].push(r[0]), o[1].push(r[1]), o),
    [[], []]
  );
}
const Lr = [0.1, 0.15, 0.225, 0.34, 0.5];
function Vr(i, t) {
  return t ? i.hasBoundary !== t.hasBoundary ? i.hasBoundary : i.diagnostics.boundaryTriangleFlips < t.diagnostics.boundaryTriangleFlips : !0;
}
function un(i, t, e) {
  return Math.sign(_t(i[0], i[1], t[0], t[1], e[0], e[1]));
}
function ye(i, t = -1) {
  let e = 0;
  for (const n of i.features) {
    const { a: o, b: r, c: s } = n.properties;
    if (![o, r, s].some(
      ({ index: l }) => typeof l == "string" && l.startsWith("b")
    ))
      continue;
    const [a, c, f] = n.geometry.coordinates[0];
    un(a, c, f) * un(o.geom, r.geom, s.geom) * t <= 0 && e++;
  }
  return e;
}
function dn(i, t, e) {
  if (i.some(([s, a]) => s === t[0] && a === t[1])) return !1;
  const n = i.map(
    ([s, a]) => Math.atan2(a - t[1], s - t[0])
  ), o = 2 * Math.PI;
  let r = 0;
  for (let s = 0; s < n.length; s++) {
    const c = (e * (n[(s + 1) % n.length] - n[s]) + o) % o;
    if (!(c > 0 && c < Math.PI)) return !1;
    r += c;
  }
  return Math.abs(r - o) < 1e-6;
}
function qr(i, t) {
  const e = new Set(
    t.forw.map(({ geometry: o }) => String(o.coordinates))
  ), n = new Set(
    t.bakw.map(({ geometry: o }) => String(o.coordinates))
  );
  return i.filter(({ forw: o, bakw: r }) => {
    const s = String(o), a = String(r);
    return e.has(s) || n.has(a) ? !1 : (e.add(s), n.add(a), !0);
  });
}
function mn(i, t, e, n, o) {
  const { minx: r, maxx: s, miny: a, maxy: c, centroid: f } = i, h = s - r, l = c - a, d = e.forw.length, g = Array.from({ length: d }, () => []);
  let b = 1;
  for (const [m, w] of e.edges)
    m < n && g[m].push(b), g[w].push(b), w < n && b++;
  const M = [0], B = (m) => m >= d ? M : g[m];
  let O;
  for (const m of Lr) {
    const w = qr(
      t(
        {
          ...i,
          minx: r - m * h,
          maxx: s + m * h,
          miny: a - m * l,
          maxy: c + m * l
        },
        !0
      ),
      e
    );
    if (o && (w.length < 4 || !w.every(({ bakw: N }) => N.every(Number.isFinite)))) continue;
    const u = w.map(
      ({ forw: N, bakw: P }, y) => Jt(N, P, `b${y}`)
    ), v = bt([...e.forw, ...u]), x = bt([
      ...e.bakw,
      ...u.map(Ht)
    ]), _ = [v, x].map(
      ({ features: N }) => Float64Array.from(
        N.flatMap(
          ({
            geometry: {
              coordinates: [P, y]
            }
          }) => [P, y]
        )
      )
    ), E = o !== void 0 || dn(
      w.map((N) => N.forw),
      f.forw,
      -1
    ) && dn(
      w.map((N) => N.bakw),
      f.bakw,
      1
    ) ? w.map((N, P) => [
      d + P,
      d + (P + 1) % w.length
    ]) : void 0, T = { groupsOf: B, planes: _, boundary: E, allowUnusableBoundary: o !== void 0 }, I = Ne(
      v,
      e.edges,
      "target",
      T
    ), D = Ne(
      x,
      e.edges,
      "target",
      T
    ), X = I.tin, p = D.tin, k = o?.orientation ?? -1, S = ye(X, k) + ye(p, k), F = {
      vertices: w,
      forw: X,
      bakw: p,
      diagnostics: {
        margin: m,
        boundaryTriangleFlips: S,
        remainingForbiddenTriangles: I.remaining + D.remaining
      },
      hasMapBoundary: I.hasBoundary,
      hasBoundary: I.hasBoundary && D.hasBoundary
    };
    if (o) {
      if (o.accept(F)) return F;
      continue;
    }
    if (S === 0 && F.hasBoundary)
      return F;
    Vr(F, O) && (O = F);
  }
  return O;
}
const jr = 256 * Number.EPSILON, Tn = 4, Ur = 1e-9;
function zr(i) {
  const t = Math.abs(i);
  if (!Number.isFinite(t)) return NaN;
  const e = new DataView(new ArrayBuffer(8));
  e.setFloat64(0, t);
  const n = e.getUint32(0) >>> 20 & 2047;
  return Math.pow(2, Math.max(n, 1) - 1023 - 52);
}
function Gr(i) {
  let t = 0;
  for (const e of i)
    t = Math.max(t, Math.abs(e[0]), Math.abs(e[1]));
  return t;
}
function Kr(i, t, e = Tn) {
  const n = (r) => {
    let s = 0;
    for (let c = 1; c < r.length; c++)
      s += Math.sqrt(
        Math.pow(r[c][0] - r[c - 1][0], 2) + Math.pow(r[c][1] - r[c - 1][1], 2)
      );
    const a = zr(Gr(r)) / s;
    return Number.isFinite(a) ? a : 0;
  }, o = jr + e * (n(i) + n(t));
  return Math.min(o, Ur);
}
function Jr(i, t, e) {
  const n = new Int32Array(i.length).fill(-1), o = new Int32Array(t.length).fill(-1), r = i.length - 2, s = t.length - 2;
  if (r < 1 || s < 1) return { illstToMerc: n, mercToIllst: o };
  const a = (v, x) => Math.abs(t[x + 1][3] - i[v + 1][3]) <= e;
  let c = r, f = -1, h = s, l = -1;
  for (let v = 0; v < r; v++)
    for (let x = 0; x < s; x++)
      a(v, x) && (c = Math.min(c, v), f = Math.max(f, v), h = Math.min(h, x), l = Math.max(l, x));
  if (f < 0) return { illstToMerc: n, mercToIllst: o };
  const d = f - c + 1, g = l - h + 1, b = g + 1, M = new Int32Array((d + 1) * b), B = new Float64Array((d + 1) * b), O = new Uint8Array((d + 1) * b), m = (v, x, _, A) => v > _ || v === _ && x < A;
  for (let v = 1; v <= d; v++)
    for (let x = 1; x <= g; x++) {
      const _ = v * b + x, A = _ - b, E = _ - 1;
      let T = M[A], I = B[A], D = 0;
      m(M[E], B[E], T, I) && (T = M[E], I = B[E], D = 1);
      const X = c + v - 1, p = h + x - 1;
      if (a(X, p)) {
        const k = A - 1, S = M[k] + 1, F = B[k] + Math.abs(t[p + 1][3] - i[X + 1][3]);
        m(S, F, T, I) && (T = S, I = F, D = 2);
      }
      M[_] = T, B[_] = I, O[_] = D;
    }
  let w = d, u = g;
  for (; w > 0 && u > 0; ) {
    const v = O[w * b + u];
    if (v === 2) {
      const x = c + w - 1 + 1, _ = h + u - 1 + 1;
      n[x] = _, o[_] = x, w--, u--;
    } else v === 0 ? w-- : u--;
  }
  return { illstToMerc: n, mercToIllst: o };
}
function Hr(i, t, e = Tn) {
  const n = Kr(i, t, e), o = [i, t].map((h) => {
    const l = h.map((g, b, M) => {
      if (b === 0) return 0;
      const B = M[b - 1];
      return Math.sqrt(
        Math.pow(g[0] - B[0], 2) + Math.pow(g[1] - B[1], 2)
      );
    }), d = l.reduce((g, b, M) => M === 0 ? [0] : (g.push(g[M - 1] + b), g), []);
    return d.map((g, b, M) => {
      const B = g / M[M.length - 1];
      return [h[b], l[b], d[b], B];
    });
  }), { illstToMerc: r, mercToIllst: s } = Jr(o[0], o[1], n), a = [r, s], c = (h, l) => {
    for (let d = 1; d < l.length - 1; d++)
      if (Math.abs(l[d][3] - h) <= n) return !0;
    return !1;
  }, f = [];
  return o.forEach((h, l) => {
    const d = o[l ? 0 : 1];
    h.forEach((g, b) => {
      if (b === 0 || b === h.length - 1) return;
      const M = g[0], B = g[3], O = a[l][b];
      if (O >= 0) {
        l === 0 && f.push([M, d[O][0], B]);
        return;
      }
      if (!c(B, d))
        for (let m = 0; m < d.length - 1; m++) {
          const w = d[m], u = d[m + 1], v = w[3], x = u[3];
          if (v < B && x > B) {
            const _ = (B - v) / (x - v), A = [
              (u[0][0] - w[0][0]) * _ + w[0][0],
              (u[0][1] - w[0][1]) * _ + w[0][1]
            ];
            f.push(
              l === 0 ? [M, A, B] : [A, M, B]
            );
            return;
          }
        }
    });
  }), f.sort((h, l) => h[2] - l[2]);
}
function Qr(i, t) {
  const e = [[], [], [], []], n = [];
  return Object.keys(i).forEach((o) => {
    const r = i[o], s = r.forw, a = r.bakw, c = [
      s[0] - t.forw[0],
      s[1] - t.forw[1]
    ], f = [
      a[0] - t.bakw[0],
      t.bakw[1] - a[1]
    ], h = { forw: c, bakw: f };
    if (n.push(h), c[0] === 0 || c[1] === 0)
      return;
    let l = 0;
    c[0] > 0 && (l += 1), c[1] > 0 && (l += 2), e[l].push(h);
  }), { perQuad: e, aggregate: n };
}
function Wr(i) {
  let t = 1 / 0, e = 0, n = 0;
  return i.forEach((o) => {
    const { forw: r, bakw: s } = o, a = Math.hypot(r[0], r[1]), c = Math.hypot(s[0], s[1]);
    if (c === 0) return;
    const f = a / c, h = Math.atan2(r[0], r[1]) - Math.atan2(s[0], s[1]);
    t = Math.min(t, f), e += Math.cos(h), n += Math.sin(h);
  }), isFinite(t) ? [t, Math.atan2(n, e)] : [1, 0];
}
function Zr(i, t, e) {
  const { perQuad: n, aggregate: o } = Qr(i, t), r = n.every((c) => c.length > 0), a = (e === "birdeye" ? r ? n : [o] : [o]).map((c) => Wr(c));
  return a.length === 1 ? [a[0], a[0], a[0], a[0]] : a;
}
function ti(i, t) {
  let e = 0;
  return i[0] > t[0] && (e += 1), i[1] > t[1] && (e += 2), e;
}
function ei(i, t, e) {
  const n = [
    i[0] - t.forw[0],
    i[1] - t.forw[1]
  ], r = Math.sqrt(n[0] ** 2 + n[1] ** 2) / e[0], s = Math.atan2(n[0], n[1]) - e[1];
  return [
    t.bakw[0] + r * Math.sin(s),
    t.bakw[1] - r * Math.cos(s)
  ];
}
function ni(i, t, e, n) {
  const o = t[0] - i[0], r = t[1] - i[1];
  if (Math.abs(o) < 1e-12 && Math.abs(r) < 1e-12) return null;
  const s = n[0] - e[0], a = n[1] - e[1], c = e[0] - i[0], f = e[1] - i[1], h = o * a - r * s;
  if (Math.abs(h) < 1e-12) return null;
  const l = (c * a - f * s) / h, d = (c * r - f * o) / h;
  return l <= 1e-10 || d < -1e-10 || d > 1 + 1e-10 ? null : { t: l, point: [i[0] + l * o, i[1] + l * r] };
}
function ri(i, t, e) {
  const n = e.length;
  let o = -1 / 0, r = null;
  for (let s = 0; s < n; s++) {
    const a = (s + 1) % n, c = ni(
      i,
      t,
      e[s].bakw,
      e[a].bakw
    );
    c && c.t > o && (o = c.t, r = c.point);
  }
  return r;
}
function pn(i, t) {
  const n = Math.atan2(i[0] - t[0], i[1] - t[1]) * (180 / Math.PI);
  return n < 0 ? n + 360 : n;
}
function gn(i, t, e, n, o, r) {
  const s = t[0] - i[0], a = t[1] - i[1];
  if (s === 0 && a === 0) return null;
  const c = [];
  if (s !== 0)
    for (const h of [e, n]) {
      const l = (h - i[0]) / s;
      if (l > 0) {
        const d = i[1] + l * a;
        d >= o && d <= r && c.push({ t: l, x: h, y: d });
      }
    }
  if (a !== 0)
    for (const h of [o, r]) {
      const l = (h - i[1]) / a;
      if (l > 0) {
        const d = i[0] + l * s;
        d >= e && d <= n && c.push({ t: l, x: d, y: h });
      }
    }
  if (c.length === 0) return null;
  c.sort((h, l) => h.t - l.t);
  const f = c[0];
  return [f.x, f.y];
}
function wn(i, t, e) {
  const n = i.length, o = new Array(n).fill(1);
  for (const r of t)
    for (let s = 0; s < n; s++) {
      const a = (s + 1) % n, c = Ve([i[s].bakw, i[a].bakw]), f = Ve([e.bakw, r.bakw]), h = wr(c, f);
      if (h.features.length > 0 && h.features[0].geometry) {
        const l = h.features[0], d = Math.sqrt(
          Math.pow(r.bakw[0] - e.bakw[0], 2) + Math.pow(r.bakw[1] - e.bakw[1], 2)
        ), g = Math.sqrt(
          Math.pow(l.geometry.coordinates[0] - e.bakw[0], 2) + Math.pow(l.geometry.coordinates[1] - e.bakw[1], 2)
        ), b = d / g;
        b > o[s] && (o[s] = b), b > o[a] && (o[a] = b);
      }
    }
  i.forEach((r, s) => {
    const a = o[s];
    r.bakw = [
      (r.bakw[0] - e.bakw[0]) * a + e.bakw[0],
      (r.bakw[1] - e.bakw[1]) * a + e.bakw[1]
    ];
  });
}
function $e(i, t, e, n) {
  const { convexBuf: o, centroid: r, allGcps: s, minx: a, maxx: c, miny: f, maxy: h } = i, l = n ? void 0 : Zr(o, r, t), g = [
    [a, f],
    [c, f],
    [c, h],
    [a, h]
  ].map((_) => ({
    forw: _,
    bakw: n ? n(_) : ei(
      _,
      r,
      l[ti(_, r.forw)]
    )
  }));
  if (g.sort(
    (_, A) => Math.atan2(_.forw[0] - r.forw[0], _.forw[1] - r.forw[1]) - Math.atan2(A.forw[0] - r.forw[0], A.forw[1] - r.forw[1])
  ), n || wn(g, s, r), !e) return g;
  const b = 4, M = g.map(
    (_) => Math.atan2(_.forw[0] - r.forw[0], _.forw[1] - r.forw[1])
  ), B = g.map(
    (_) => Math.atan2(
      _.bakw[0] - r.bakw[0],
      -(_.bakw[1] - r.bakw[1])
    )
  );
  function O(_) {
    for (let A = 0; A < b; A++) {
      const E = (A + 1) % b, T = M[A], I = A < b - 1 ? M[E] : M[E] + 2 * Math.PI;
      let D = _;
      for (; D < T; ) D += 2 * Math.PI;
      for (; D >= T + 2 * Math.PI; ) D -= 2 * Math.PI;
      if (D >= T && D < I)
        return { i: A, j: E, frac: (D - T) / (I - T) };
    }
    return { i: 0, j: 1, frac: 0 };
  }
  function m(_) {
    const { i: A, j: E, frac: T } = O(_), I = B[A];
    let X = B[E] - I;
    for (; X > Math.PI; ) X -= 2 * Math.PI;
    for (; X < -Math.PI; ) X += 2 * Math.PI;
    return I + T * X;
  }
  const w = new Set(
    g.map(
      (_) => Math.floor(pn(_.forw, r.forw) / 10) % 36
    )
  ), u = s.map((_) => ({
    forw: _.forw,
    bakw: _.bakw,
    angleDeg: pn(_.forw, r.forw),
    forwDist: Math.hypot(_.forw[0] - r.forw[0], _.forw[1] - r.forw[1])
  })), v = [];
  for (let _ = 0; _ < 36; _++) {
    if (w.has(_)) continue;
    const A = _ * 10, E = u.filter(
      (S) => S.angleDeg >= A && S.angleDeg < A + 10
    );
    let T = null;
    if (E.length > 0) {
      const S = E.reduce((F, N) => N.forwDist > F.forwDist ? N : F);
      T = gn(r.forw, S.forw, a, c, f, h);
    }
    if (!T) {
      const S = (A + 5) % 360 * (Math.PI / 180), F = [
        r.forw[0] + Math.sin(S),
        r.forw[1] + Math.cos(S)
      ];
      T = gn(r.forw, F, a, c, f, h);
    }
    if (!T) continue;
    if (n) {
      v.push({ forw: T, bakw: n(T) });
      continue;
    }
    const I = [T[0] - r.forw[0], T[1] - r.forw[1]], D = Math.atan2(I[0], I[1]), X = m(D), p = [
      r.bakw[0] + Math.sin(X),
      r.bakw[1] - Math.cos(X)
    ], k = ri(r.bakw, p, g);
    k && v.push({ forw: T, bakw: k });
  }
  const x = [...g, ...v];
  return x.sort(
    (_, A) => Math.atan2(_.forw[0] - r.forw[0], _.forw[1] - r.forw[1]) - Math.atan2(A.forw[0] - r.forw[0], A.forw[1] - r.forw[1])
  ), n || wn(x, s, r), x;
}
function ii(i, t = !1) {
  return $e(i, "plain", t);
}
function oi(i, t = !1) {
  return $e(i, "birdeye", t);
}
function si(i, t) {
  const e = /* @__PURE__ */ new Set();
  return $e(i, "plain", !0, t).filter(({ forw: [n, o] }) => {
    const r = `${n}:${o}`;
    return e.has(r) ? !1 : (e.add(r), !0);
  });
}
function Ri(i) {
  return Fn(i, 1 / 0);
}
const vn = 1e5, ai = 16;
function Fn(i, t) {
  return ci(i), new li(i).findSegmentIntersections(t).map(
    (o) => Pt([o.x, o.y])
  );
}
function ci(i) {
  for (let t = 0, e = i.length; t < e; t++) {
    const n = i[t];
    te(n) || Rt(
      "findIntersections() received invalid coordinates:",
      `line=${t}`,
      `points=${n}`
    );
    for (let o = 0, r = n.length; o < r; o++) {
      const s = n[o];
      (!te(s) || !Number.isFinite(s[0]) || !Number.isFinite(s[1])) && Rt(
        "findIntersections() received non-finite coordinates:",
        `line=${t}`,
        `point=${o}`,
        `coordinates=${JSON.stringify(s)}`
      );
    }
  }
}
class li {
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
    const e = [], n = [], o = t.map((r) => {
      const s = r ? r.length : 0;
      for (let a = 0; a < s; a++)
        e.push(r[a][0]), n.push(r[a][1]);
      return s;
    });
    this.initXYData(o, e, n);
  }
  initXYData(t, e, n) {
    const o = t.length;
    this._xx = new Float64Array(e), this._yy = new Float64Array(n), this._nn = new Uint32Array(t), this._zz = null, this._zlimit = 0, this._filteredArcIter = null, this._ii = new Uint32Array(o);
    let r = 0;
    for (let s = 0; s < o; s++)
      this._ii[s] = r, r += t[s];
    (r != this._xx.length || this._xx.length != this._yy.length) && Rt("ArcCollection#initXYData() Counting error"), this.initBounds(), this._arcIter = new Bi(this._xx, this._yy);
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
    const o = n.length, r = new Float64Array(o * 4), s = new ee();
    let a = 0, c, f, h;
    for (let l = 0; l < o; l++)
      c = n[l], c > 0 && (f = l * 4, h = Oi(t, e, a, c), r[f++] = h[0], r[f++] = h[1], r[f++] = h[2], r[f] = h[3], a += c, s.mergeBounds(h));
    return {
      bb: r,
      bounds: s
    };
  }
  getBounds() {
    return this._allBounds ? this._allBounds.clone() : new ee();
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
    const n = t >= 0, o = n ? t : ~t, r = this.getRetainedInterval(), s = this._nn[o], a = n ? 1 : -1;
    let c = n ? this._ii[o] : this._ii[o] + s - 1, f = c, h = 0;
    for (let l = 1; l < s; l++)
      f += a, (r === 0 || this._zz[f] >= r) && (e(c, f, this._xx, this._yy), c = f, h++);
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
      (o, r, s, a) => {
        t += Math.abs(s[o] - s[r]), e += Math.abs(a[o] - a[r]);
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
    const e = this.getBounds(), n = e.ymin || 0, o = (e.ymax || 0) - n, r = this.calcSegmentIntersectionStripeCount(), s = new Uint32Array(r), a = r > 1 ? (w) => Math.floor((r - 1) * (w - n) / o) : () => 0, c = r + 1;
    let f;
    this.forEachSegment(
      (w, u, v, x) => {
        let _ = a(x[w]);
        const A = a(x[u]);
        let E = 0;
        for (; s[_] = s[_] + 2, _ != A; )
          E++, E > c && Rt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${r}`,
            `s1=${_}`,
            `s2=${A}`
          ), _ += A > _ ? 1 : -1;
      }
    );
    const h = this.getUint32Array(ui(s));
    let l = 0;
    const d = [];
    di(s, (w) => {
      const u = l;
      l += w, d.push(h.subarray(u, l));
    }), mi(s, 0), this.forEachSegment(
      (w, u, v, x) => {
        let _ = a(x[w]);
        const A = a(x[u]);
        let E, T, I = 0;
        for (; E = s[_], s[_] = E + 2, T = d[_], T[E] = w, T[E + 1] = u, _ != A; )
          I++, I > c && Rt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${r}`,
            `s1=${_}`,
            `s2=${A}`
          ), _ += A > _ ? 1 : -1;
      }
    );
    const g = this.getVertexData(), b = t * ai;
    let M = 0;
    const B = /* @__PURE__ */ new Set(), O = /* @__PURE__ */ new Map(), m = (w) => {
      M++;
      const u = Ii(w);
      return B.has(u) || (B.add(u), O.set(`${w.x}:${w.y}`, w)), O.size >= t || M >= b;
    };
    if (g.xx && g.yy)
      for (f = 0; f < r && !pi(d[f], g.xx, g.yy, m); f++)
        ;
    return Array.from(O.values());
  }
}
function Rt(...i) {
  const t = i.join(" ");
  throw new Error(t);
}
function te(i) {
  return i ? hi(i) ? !0 : fi(i) ? !1 : i.length === 0 ? !0 : i.length > 0 : !1;
}
function fi(i) {
  return i != null && i.toString === String.prototype.toString;
}
function hi(i) {
  return Array.isArray(i);
}
function ui(i, t) {
  te(i) || Rt("utils.sum() expects an array, received:", i);
  let e = 0, n;
  for (let o = 0, r = i.length; o < r; o++)
    n = i[o], n && (e += n);
  return e;
}
function di(i, t, e) {
  if (!te(i))
    throw new Error(`#forEach() takes an array-like argument. ${i}`);
  for (let n = 0, o = i.length; n < o; n++)
    t.call(e, i[n], n);
}
function mi(i, t) {
  for (let e = 0, n = i.length; e < n; e++)
    i[e] = t;
  return i;
}
function pi(i, t, e, n) {
  const o = i.length - 2;
  let r, s, a, c, f, h, l, d, g, b, M, B, O, m, w, u, v;
  for (ki(t, i), u = 0; u < o; ) {
    for (r = i[u], s = i[u + 1], f = t[r], h = t[s], g = e[r], b = e[s], v = u; v < o && (v += 2, a = i[v], l = t[a], !(h < l)); ) {
      if (M = e[a], c = i[v + 1], d = t[c], B = e[c], g >= M) {
        if (g > B && b > M && b > B) continue;
      } else if (g < B && b < M && b < B) continue;
      if (!(r == a || r == c || s == a || s == c) && (O = gi(
        f,
        g,
        h,
        b,
        l,
        M,
        d,
        B
      ), O && (m = [r, s], w = [a, c], n(bn(O, m, w, t, e)) || O.length == 4 && n(bn(O.slice(2), m, w, t, e)))))
        return !0;
    }
    u += 2;
  }
  return !1;
}
function gi(i, t, e, n, o, r, s, a) {
  const c = wi(i, t, e, n, o, r, s, a);
  let f = null;
  return c && (f = vi(i, t, e, n, o, r, s, a), f ? Si(i, t, e, n, o, r, s, a) && (f = null) : f = _i(i, t, e, n, o, r, s, a)), f;
}
function wi(i, t, e, n, o, r, s, a) {
  return Qt(i, t, e, n, o, r) * Qt(i, t, e, n, s, a) <= 0 && Qt(o, r, s, a, i, t) * Qt(o, r, s, a, e, n) <= 0;
}
function Qt(i, t, e, n, o, r) {
  return Cn(i - o, t - r, e - o, n - r);
}
function Cn(i, t, e, n) {
  return i * n - t * e;
}
function vi(i, t, e, n, o, r, s, a) {
  let c = me(i, t, e, n, o, r, s, a), f;
  return c && (f = bi(c[0], c[1], i, t, e, n, o, r, s, a), f == 1 ? c = me(e, n, i, t, o, r, s, a) : f == 2 ? c = me(o, r, s, a, i, t, e, n) : f == 3 && (c = me(s, a, o, r, i, t, e, n))), c && Mi(c, i, t, e, n, o, r, s, a), c;
}
function me(i, t, e, n, o, r, s, a) {
  const c = Cn(e - i, n - t, s - o, a - r), f = 1e-18;
  let h;
  if (c === 0) return null;
  const l = Qt(o, r, s, a, i, t) / c;
  return c <= f && c >= -f ? h = yi(i, t, e, n, o, r, s, a) : h = [i + l * (e - i), t + l * (n - t)], h;
}
function yi(i, t, e, n, o, r, s, a) {
  let c = null;
  return !It(i, o, s) && !It(t, r, a) ? c = [i, t] : !It(e, o, s) && !It(n, r, a) ? c = [e, n] : !It(o, i, e) && !It(r, t, n) ? c = [o, r] : !It(s, i, e) && !It(a, t, n) && (c = [s, a]), c;
}
function It(i, t, e) {
  let n;
  return t < e ? n = i < t || i > e : t > e ? n = i > t || i < e : n = i != t, n;
}
function bi(i, t, ...e) {
  let n = -1, o = 1 / 0, r;
  for (let s = 0, a = 0, c = e.length; a < c; s++, a += 2)
    r = xi(i, t, e[a], e[a + 1]), r < o && (o = r, n = s);
  return n;
}
function xi(i, t, e, n) {
  const o = i - e, r = t - n;
  return o * o + r * r;
}
function Mi(i, t, e, n, o, r, s, a, c) {
  let f = i[0], h = i[1];
  f = pe(f, t, n), f = pe(f, r, a), h = pe(h, e, o), h = pe(h, s, c), i[0] = f, i[1] = h;
}
function pe(i, t, e) {
  let n;
  return It(i, t, e) && (n = Math.abs(i - t) < Math.abs(i - e) ? t : e, i = n), i;
}
function _i(i, t, e, n, o, r, s, a) {
  const c = Math.min(i, e, o, s), f = Math.max(i, e, o, s), h = Math.min(t, n, r, a), l = Math.max(t, n, r, a), d = l - h > f - c;
  let g = [];
  return (d ? Dt(t, h, l) : Dt(i, c, f)) && g.push(i, t), (d ? Dt(n, h, l) : Dt(e, c, f)) && g.push(e, n), (d ? Dt(r, h, l) : Dt(o, c, f)) && g.push(o, r), (d ? Dt(a, h, l) : Dt(s, c, f)) && g.push(s, a), (g.length != 2 && g.length != 4 || g.length == 4 && g[0] == g[2] && g[1] == g[3]) && (g = null), g;
}
function Si(i, t, e, n, o, r, s, a) {
  return i == o && t == r || i == s && t == a || e == o && n == r || e == s && n == a;
}
function Dt(i, t, e) {
  return i > t && i < e;
}
function ki(i, t) {
  Ei(i, t), Nn(i, t, 0, t.length - 2);
}
function Ei(i, t) {
  for (let e = 0, n = t.length; e < n; e += 2)
    i[t[e]] > i[t[e + 1]] && Ai(t, e, e + 1);
}
function Ai(i, t, e) {
  const n = i[t];
  i[t] = i[e], i[e] = n;
}
function Nn(i, t, e, n) {
  let o = e, r = n, s, a;
  for (; o < n; ) {
    for (s = i[t[e + n >> 2 << 1]]; o <= r; ) {
      for (; i[t[o]] < s; ) o += 2;
      for (; i[t[r]] > s; ) r -= 2;
      o <= r && (a = t[o], t[o] = t[r], t[r] = a, a = t[o + 1], t[o + 1] = t[r + 1], t[r + 1] = a, o += 2, r -= 2);
    }
    if (r - e < 40 ? yn(i, t, e, r) : Nn(i, t, e, r), n - o < 40) {
      yn(i, t, o, n);
      return;
    }
    e = o, r = n;
  }
}
function yn(i, t, e, n) {
  let o, r;
  for (let s = e + 2; s <= n; s += 2) {
    o = t[s], r = t[s + 1];
    let a;
    for (a = s - 2; a >= e && i[o] < i[t[a]]; a -= 2)
      t[a + 2] = t[a], t[a + 3] = t[a + 1];
    t[a + 2] = o, t[a + 3] = r;
  }
}
function bn(i, t, e, n, o) {
  const r = i[0], s = i[1];
  t = xn(r, s, t[0], t[1], n, o), e = xn(r, s, e[0], e[1], n, o);
  const a = t[0] < e[0] ? t : e, c = a == t ? e : t;
  return { x: r, y: s, a, b: c };
}
function xn(i, t, e, n, o, r) {
  let s = e < n ? e : n, a = s === e ? n : e;
  return o[s] == i && r[s] == t ? a = s : o[a] == i && r[a] == t && (s = a), [s, a];
}
function Ii(i) {
  return `${i.a.join(",")};${i.b.join(",")}`;
}
class Bi {
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
function Oi(i, t, e, n) {
  let o = e | 0;
  const r = isNaN(n) ? i.length - o : n + o;
  let s, a, c, f, h, l;
  if (r > 0)
    c = h = i[o], f = l = t[o];
  else return [void 0, void 0, void 0, void 0];
  for (o++; o < r; o++)
    s = i[o], a = t[o], s < c && (c = s), s > h && (h = s), a < f && (f = a), a > l && (l = a);
  return [c, f, h, l];
}
class ee {
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
    return new ee(
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
    let r, s, a, c;
    if (arguments.length == 1)
      if (te(t)) {
        const f = t;
        r = f[0], s = f[1], a = f[2], c = f[3];
      } else {
        const f = t;
        r = f.xmin, s = f.ymin, a = f.xmax, c = f.ymax;
      }
    else
      r = t, s = e, a = n, c = o;
    return this.xmin = r, this.ymin = s, this.xmax = a, this.ymax = c, (r > a || s > c) && this.update(), this;
  }
  update() {
    let t;
    this.xmin > this.xmax && (t = this.xmin, this.xmin = this.xmax, this.xmax = t), this.ymin > this.ymax && (t = this.ymin, this.ymin = this.ymax, this.ymax = t);
  }
  mergeBounds(t, ...e) {
    let n, o, r, s;
    return t instanceof ee ? (n = t.xmin, o = t.ymin, r = t.xmax, s = t.ymax) : e.length == 3 ? (n = t, o = e[0], r = e[1], s = e[2]) : t.length == 4 ? (n = t[0], o = t[1], r = t[2], s = t[3]) : Rt("Bounds#mergeBounds() invalid argument:", t), this.xmin === void 0 ? this.setBounds(n, o, r, s) : (n < this.xmin && (this.xmin = n), o < this.ymin && (this.ymin = o), r > this.xmax && (this.xmax = r), s > this.ymax && (this.ymax = s)), this;
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
function Dn(i, t, e) {
  const n = be(t.forw), o = be(t.bakw);
  if (JSON.stringify(n) != JSON.stringify(o))
    throw `${JSON.stringify(t, null, 2)}
${JSON.stringify(
      n
    )}
${JSON.stringify(o)}`;
  for (let r = 0; r < n.length; r++) {
    const s = n[r];
    i[s] || (i[s] = []), i[s].push(t);
  }
  e && (e.forw.features.push(t.forw), e.bakw.features.push(t.bakw));
}
function Mn(i, t, e) {
  const n = be(t.forw), o = be(t.bakw);
  if (JSON.stringify(n) != JSON.stringify(o))
    throw `${JSON.stringify(t, null, 2)}
${JSON.stringify(n)}
${JSON.stringify(o)}`;
  if (n.forEach((r) => {
    const s = i[r];
    if (!s) return;
    const a = s.filter((c) => c !== t);
    a.length === 0 ? delete i[r] : i[r] = a;
  }), e) {
    const r = (s, a) => {
      !s || !a || (s.features = s.features.filter((c) => c !== a));
    };
    r(e.forw, t.forw), r(e.bakw, t.bakw);
  }
}
function ge(i, t = 1e-6) {
  const [e, n] = i[0], [o, r] = i[1], [s, a] = i[2];
  return Math.abs((o - e) * (a - n) - (s - e) * (r - n)) < t;
}
function Ti(i, t) {
  const e = /* @__PURE__ */ new Set();
  return i.forEach((n) => {
    if (n.length !== 2) return;
    const o = n.map((r) => `${t?.[r] ?? r}`);
    e.add(o.sort().join("-"));
  }), e;
}
function Wt(i) {
  return ["a", "b", "c"].map((t, e) => ({
    prop: i.properties[t],
    geom: i.geometry.coordinates[0][e]
  }));
}
const Fi = 10;
function Ci(i, t, e, n, o, r) {
  if (!i && !t) return !1;
  const s = i ? 0 : 1, a = 1 - s, c = e[s], f = e[a];
  if (!c || !f) return !1;
  const h = yt(f.geom);
  let l = !1, d = !1;
  for (let g = 0; g <= 1; g++) {
    const b = n[g];
    if (!b) continue;
    const M = [String(b.prop.index), String(c.prop.index)].sort().join("-"), B = o[M];
    if (!B || B.length < 2) continue;
    const O = B.find(
      (I) => I.bakw !== r[s].bakw
    );
    if (!O) continue;
    const w = Wt(O.bakw).find(
      (I) => String(I.prop.index) !== String(b.prop.index) && String(I.prop.index) !== String(c.prop.index)
    );
    if (!w) continue;
    l = !0;
    const u = yt(w.geom), v = yt(b.geom), x = yt(c.geom), _ = x[0] - v[0], A = x[1] - v[1], E = _ * (h[1] - v[1]) - A * (h[0] - v[0]), T = _ * (u[1] - v[1]) - A * (u[0] - v[0]);
    if (E * T > 0) {
      d = !0;
      break;
    }
  }
  return l && !d;
}
function Ni(i, t, e, n) {
  if (!i && !t) return !1;
  if (e[0] && e[1] && n[0] && n[1]) {
    const o = n.map((h) => yt(h.geom)), r = e.map((h) => yt(h.geom)), s = o[1][0] - o[0][0], a = o[1][1] - o[0][1], c = s * (r[0][1] - o[0][1]) - a * (r[0][0] - o[0][0]), f = s * (r[1][1] - o[0][1]) - a * (r[1][0] - o[0][0]);
    return c * f < 0;
  }
  return !1;
}
function Di(i, t, e, n) {
  const o = Ti(e, n), r = /* @__PURE__ */ new Set();
  let s = !1;
  for (let a = 0; a < Fi; a++) {
    let c = !1;
    for (const f of Object.keys(t)) {
      if (r.has(f)) continue;
      r.add(f);
      const h = t[f];
      if (!h || h.length < 2) continue;
      const l = f.split("-");
      if (l.length !== 2 || o.has(f)) continue;
      const d = Wt(h[0].bakw), g = Wt(h[1].bakw), b = Wt(h[0].forw), M = Wt(h[1].forw), B = l.map(
        (y) => d.find((C) => `${C.prop.index}` === y) || g.find((C) => `${C.prop.index}` === y)
      ), O = l.map(
        (y) => b.find((C) => `${C.prop.index}` === y) || M.find((C) => `${C.prop.index}` === y)
      );
      if (B.some((y) => !y) || O.some((y) => !y))
        continue;
      const m = [d, g].map(
        (y) => y.find((C) => !l.includes(`${C.prop.index}`))
      ), w = [b, M].map(
        (y) => y.find((C) => !l.includes(`${C.prop.index}`))
      );
      if (m.some((y) => !y) || w.some((y) => !y))
        continue;
      const u = h[0].bakw.geometry.coordinates[0].slice(0, 3).map((y) => yt(y)), v = h[1].bakw.geometry.coordinates[0].slice(0, 3).map((y) => yt(y)), x = h[0].forw.geometry.coordinates[0].slice(0, 3).map((y) => yt(y)), _ = h[1].forw.geometry.coordinates[0].slice(0, 3).map((y) => yt(y)), A = ge(u), E = ge(v), T = ge(x), I = ge(_), D = Ci(
        A,
        E,
        m,
        B,
        t,
        h
      ), X = Ni(
        T,
        I,
        m,
        B
      );
      if (!(D || X || _n(
        yt(m[0].geom),
        v
      ) || _n(
        yt(m[1].geom),
        u
      )))
        continue;
      const k = O.map(
        (y) => yt(y.geom)
      ), S = w.map(
        (y) => yt(y.geom)
      ), F = Pi([
        ...k,
        ...S
      ]), N = Xi(F), P = Sn(
        k[0],
        k[1],
        S[0]
      ) + Sn(
        k[0],
        k[1],
        S[1]
      );
      De(N, P) && (Mn(t, h[0], i), Mn(t, h[1], i), B.forEach((y) => {
        if (!y) return;
        const C = [
          y.geom,
          m[0].geom,
          m[1].geom,
          y.geom
        ], $ = {
          a: y.prop,
          b: m[0].prop,
          c: m[1].prop
        }, Y = ne([C], $), L = An(Y);
        Dn(t, {
          forw: L,
          bakw: Y
        }, i);
      }), c = !0, s = !0);
    }
    if (!c) break;
  }
  return s;
}
function yt(i) {
  return [i[0], i[1]];
}
function _n(i, t) {
  const [e, n] = t[0], [o, r] = t[1], [s, a] = t[2], c = s - e, f = a - n, h = o - e, l = r - n, d = i[0] - e, g = i[1] - n, b = c * c + f * f, M = c * h + f * l, B = c * d + f * g, O = h * h + l * l, m = h * d + l * g, w = b * O - M * M;
  if (w === 0) return !1;
  const u = 1 / w, v = (O * B - M * m) * u, x = (b * m - M * B) * u, _ = 1e-9;
  return v >= -_ && x >= -_ && v + x <= 1 + _;
}
function Pi(i) {
  const t = i.map((s) => s.slice()).filter(
    (s, a, c) => c.findIndex(
      (f) => De(f[0], s[0]) && De(f[1], s[1])
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
  const r = [];
  for (let s = e.length - 1; s >= 0; s--) {
    const a = e[s];
    for (; r.length >= 2 && n(
      r[r.length - 2],
      r[r.length - 1],
      a
    ) <= 0; )
      r.pop();
    r.push(a);
  }
  return r.pop(), o.pop(), o.concat(r);
}
function Xi(i) {
  if (i.length < 3) return 0;
  let t = 0;
  for (let e = 0; e < i.length; e++) {
    const [n, o] = i[e], [r, s] = i[(e + 1) % i.length];
    t += n * s - r * o;
  }
  return Math.abs(t) / 2;
}
function Sn(i, t, e) {
  return Math.abs(
    (i[0] * (t[1] - e[1]) + t[0] * (e[1] - i[1]) + e[0] * (i[1] - t[1])) / 2
  );
}
function De(i, t, e = 1e-9) {
  return Math.abs(i - t) <= e;
}
const kn = 2.00704, En = 3.00001;
class lt extends Rn {
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
      Ln(t.worldFile), this.requestedWorldFile = { ...t.worldFile };
    }
    t.points && this.setPoints(t.points), t.edges && this.setEdges(t.edges);
  }
  /**
   * フォーマットバージョンを取得します
   */
  getFormatVersion() {
    return this.useV2Algorithm ? kn : En;
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
    this.edges = Vn(t), this.edgeNodes = void 0, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 境界ポリゴンを設定します
   */
  setBounds(t) {
    this.bounds = t;
    let e = t[0][0], n = e, o = t[0][1], r = o;
    const s = [t[0]];
    for (let a = 1; a < t.length; a++) {
      const c = t[a];
      c[0] < e && (e = c[0]), c[0] > n && (n = c[0]), c[1] < o && (o = c[1]), c[1] > r && (r = c[1]), s.push(c);
    }
    s.push(t[0]), this.boundsPolygon = ne([s]), this.xy = [e, o], this.wh = [n - e, r - o], this.vertexMode = lt.VERTEX_PLAIN, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 現在の設定を永続化可能な形式にコンパイルします
   */
  getCompiled() {
    const t = {};
    if (t.version = this.useV2Algorithm ? kn : En, t.points = this.points, t.weight_buffer = {}, this.compiledOuter?.outerTransform === "worldFile")
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
          const o = e[n].features[0], r = o.geometry.coordinates[0][1], s = o.properties.b.geom;
          t.vertices_points[n] = [r, s];
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
  calculateStrictTin(t = vn) {
    const e = this.tins.forw.features.map(
      (s) => An(s)
    );
    this.tins.bakw = bt(e);
    const n = {};
    this.tins.forw.features.forEach((s, a) => {
      const c = this.tins.bakw.features[a];
      Dn(n, { forw: s, bakw: c });
    });
    const o = (this.pointsSet?.forw.features ?? []).map(
      (s) => s.properties.target.index
    );
    Di(
      this.tins,
      n,
      this.pointsSet?.edges || [],
      o
    );
    const r = ["forw", "bakw"].map((s) => {
      const a = this.tins[s].features.map(
        (c) => c.geometry.coordinates[0]
      );
      return Fn(a, t);
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
    for (let o = 0; o < this.points.length; o++) {
      const r = this.points[o][0], s = this.points[o][1], a = Jt(r, s, o);
      t.forw.push(a), t.bakw.push(Ht(a));
    }
    const e = [];
    let n = 0;
    this.edgeNodes = [], this.edges || (this.edges = []);
    for (let o = 0; o < this.edges.length; o++) {
      const r = this.edges[o][2], s = Object.assign([], this.edges[o][0]), a = Object.assign([], this.edges[o][1]);
      if ($i(r, this.points.length, o), s.length === 0 && a.length === 0) {
        e.push(r);
        continue;
      }
      s.unshift(this.points[r[0]][0]), s.push(this.points[r[1]][0]), a.unshift(this.points[r[0]][1]), a.push(this.points[r[1]][1]), Hr(s, a).map((c, f, h) => {
        this.edgeNodes[n] = [
          c[0],
          c[1]
        ];
        const l = Jt(
          c[0],
          c[1],
          `e${n}`
        );
        n++, t.forw.push(l), t.bakw.push(Ht(l)), f === 0 ? e.push([r[0], t.forw.length - 1]) : e.push([
          t.forw.length - 2,
          t.forw.length - 1
        ]), f === h.length - 1 && e.push([t.forw.length - 1, r[1]]);
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
    const r = this.bounds ? this.boundsPolygon : void 0;
    if (!this.points.reduce((c, f) => c && (r ? Be(f[0], r) : f[0][0] >= t && f[0][0] <= e && f[0][1] >= n && f[0][1] <= o), !0))
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
    for (const r of this.points) {
      const s = r[0][0], a = r[0][1];
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
    t !== lt.MODE_STRICT && t !== lt.MODE_LOOSE && (t = lt.MODE_AUTO);
    const e = !this.useV2Algorithm, n = this.requestedWorldFile;
    if (n && !e) throw new Error("V2 では world file 外周を使えません");
    let o, r, s, a, c;
    if (e) {
      if (this.bounds) {
        const I = this.boundsPolygon;
        if (!I) throw new Error("Internal error: bounds is set but boundsPolygon is missing");
        if (!this.points.every(
          (X) => Be(X[0], I)
        )) throw "SOME POINTS OUTSIDE";
      }
      o = this.generatePointsSet(), { minx: r, maxx: s, miny: a, maxy: c } = this.computeGcpBbox();
    } else {
      const I = this.validateAndPrepareInputs();
      o = I.pointsSet, r = I.minx, s = I.maxx, a = I.miny, c = I.maxy;
    }
    const f = {
      forw: bt(o.forw),
      bakw: bt(o.bakw)
    }, h = de(
      f.forw,
      o.edges,
      "target"
    ), l = de(
      f.bakw,
      o.edges,
      "target"
    );
    if (h.features.length === 0 || l.features.length === 0)
      throw "TOO LINEAR1";
    const d = br(f.forw), g = sn(f.forw);
    if (!g) throw "TOO LINEAR2";
    const b = {}, M = g.geometry.coordinates[0];
    let B;
    try {
      B = M.map((I) => ({
        forw: I,
        bakw: ie(Pt(I), h)
      })), B.forEach((I) => {
        b[`${I.forw[0]}:${I.forw[1]}`] = I;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const O = sn(f.bakw);
    if (!O) throw "TOO LINEAR2";
    const m = O.geometry.coordinates[0];
    try {
      B = m.map((I) => ({
        bakw: I,
        forw: ie(Pt(I), l)
      })), B.forEach((I) => {
        b[`${I.forw[0]}:${I.forw[1]}`] = I;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    let w;
    if (e) {
      const I = d.geometry.coordinates, D = h.features.find(
        (X) => Be(
          Pt(I),
          X
        )
      );
      if (D) {
        const X = D.geometry.coordinates[0], p = D.properties.a.geom, k = D.properties.b.geom, S = D.properties.c.geom;
        w = {
          forw: [
            (X[0][0] + X[1][0] + X[2][0]) / 3,
            (X[0][1] + X[1][1] + X[2][1]) / 3
          ],
          bakw: [
            (p[0] + k[0] + S[0]) / 3,
            (p[1] + k[1] + S[1]) / 3
          ]
        };
      } else
        w = {
          forw: I,
          bakw: ie(d, h)
        };
    } else
      w = {
        forw: d.geometry.coordinates,
        bakw: ie(d, h)
      };
    const u = Jt(w.forw, w.bakw, "c");
    this.centroid = {
      forw: u,
      bakw: Ht(u)
    };
    const v = [
      ...this.points.map((I) => ({ forw: I[0], bakw: I[1] })),
      ...(this.edgeNodes ?? []).map((I) => ({ forw: I[0], bakw: I[1] }))
    ], x = {
      convexBuf: b,
      centroid: w,
      allGcps: v,
      minx: r,
      maxx: s,
      miny: a,
      maxy: c
    };
    if (n) {
      this.stateTriangle = void 0;
      const I = this.yaxisMode === lt.YAXIS_FOLLOW, D = I ? 1 : -1, X = mn(
        x,
        (p) => si(p, (k) => {
          const [S, F] = qn(n, k);
          return [S, I ? -F : F];
        }),
        o,
        this.points.length,
        {
          orientation: D,
          accept: (p) => p.hasMapBoundary ? (this.buildTin(o, p.vertices, t, p), (this.strict_status !== lt.STATUS_LOOSE || p.hasBoundary) && ye(this.tins.forw, D) === 0 && ye(this.tins.bakw, D) === 0) : !1
        }
      );
      if (X) {
        this.compiledOuter = {
          outerTransform: "worldFile",
          worldFile: n,
          vertices_points: X.vertices.map(({ forw: N, bakw: P }) => [N, P])
        };
        const { centroid: p, xy: k, wh: S, kinks: F } = this;
        super.setCompiled(this.getCompiled()), Object.assign(this, { centroid: p, xy: k, wh: S, kinks: F }), this.lastBoundaryDiagnostics = {
          ...X.diagnostics,
          requestedOuterTransform: "worldFile",
          outerTransform: "worldFile"
        };
        return;
      }
      this.compiledOuter = { outerTransform: "extrapolate" }, this.outerTransform = "extrapolate", this.worldFile = void 0;
    }
    const _ = this.vertexMode === lt.VERTEX_BIRDEYE ? oi : ii, A = e ? mn(x, _, o, this.points.length) : void 0, E = A?.vertices ?? _(x, !1), T = this.buildTin(o, E, t, A);
    this.vertices_params = {
      forw: hn(T.forw, this.centroid.forw),
      bakw: hn(T.bakw, this.centroid.bakw)
    }, this.addIndexedTin(), this.pointsWeightBuffer = {}, this.lastBoundaryDiagnostics = A?.diagnostics, n && this.lastBoundaryDiagnostics && (this.lastBoundaryDiagnostics = {
      ...this.lastBoundaryDiagnostics,
      requestedOuterTransform: "worldFile",
      outerTransform: "extrapolate",
      fallbackReason: "boundaryFlips"
    });
  }
  /** 補助頂点を含め、strictMode に従って実際に使う両方向の三角網を組む。 */
  buildTin(t, e, n, o) {
    const r = {
      forw: [],
      bakw: []
    };
    for (let s = 0; s < e.length; s++) {
      const a = e[s].forw, c = e[s].bakw, f = Jt(a, c, `b${s}`), h = Ht(f);
      r.forw.push(f), r.bakw.push(h);
    }
    return this.pointsSet = {
      forw: bt([...t.forw, ...r.forw]),
      bakw: bt([...t.bakw, ...r.bakw]),
      edges: t.edges
    }, this.tins = {
      forw: Le(
        o?.forw ?? de(this.pointsSet.forw, t.edges, "target")
      )
    }, (n === lt.MODE_STRICT || n === lt.MODE_AUTO) && this.calculateStrictTin(
      n === lt.MODE_AUTO ? 1 : vn
    ), (n === lt.MODE_LOOSE || n === lt.MODE_AUTO && this.strict_status === lt.STATUS_ERROR) && (this.tins.bakw = Le(
      o?.bakw ?? de(this.pointsSet.bakw, t.edges, "target")
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
function $i(i, t, e) {
  const n = (o) => Number.isInteger(o) && o >= 0 && o < t;
  if (!Array.isArray(i) || !n(i[0]) || !n(i[1]))
    throw new Error(
      `Invalid edge at edges[${e}]: start/end ${JSON.stringify(i)} must be integer indices of points (0 to ${t - 1})`
    );
}
export {
  lt as Tin,
  de as constrainedTin,
  Ht as counterPoint,
  Jt as createPoint,
  lt as default,
  Ri as findIntersections,
  kn as format_version,
  Dn as insertSearchIndex,
  hn as vertexCalc
};
