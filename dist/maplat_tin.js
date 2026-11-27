import { counterTri as An, Transform as Yn, validateWorldFile as Rn, normalizeEdges as Ln, transformArr as ie, rotateVerticesTriangle as Le, worldFileToCrs as Vn } from "@maplat/transform";
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
function qn(i) {
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
function jn(i) {
  return i.type === "Feature" ? i.geometry : i;
}
function Pe(i, t, e) {
  if (i !== null)
    for (var n, s, r, o, a, c, l, h = 0, f = 0, d, g = i.type, y = g === "FeatureCollection", _ = g === "Feature", T = y ? i.features.length : 1, B = 0; B < T; B++) {
      l = y ? (
        // @ts-expect-error: Known type conflict
        i.features[B].geometry
      ) : _ ? (
        // @ts-expect-error: Known type conflict
        i.geometry
      ) : i, d = l ? l.type === "GeometryCollection" : !1, a = d ? l.geometries.length : 1;
      for (var p = 0; p < a; p++) {
        var w = 0, u = 0;
        if (o = d ? l.geometries[p] : l, o !== null) {
          c = o.coordinates;
          var b = o.type;
          switch (h = e && (b === "Polygon" || b === "MultiPolygon") ? 1 : 0, b) {
            case null:
              break;
            case "Point":
              if (
                // @ts-expect-error: Known type conflict
                t(
                  c,
                  f,
                  B,
                  w,
                  u
                ) === !1
              )
                return !1;
              f++, w++;
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
                    w,
                    u
                  ) === !1
                )
                  return !1;
                f++, b === "MultiPoint" && w++;
              }
              b === "LineString" && w++;
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
                      w,
                      u
                    ) === !1
                  )
                    return !1;
                  f++;
                }
                b === "MultiLineString" && w++, b === "Polygon" && u++;
              }
              b === "Polygon" && w++;
              break;
            case "MultiPolygon":
              for (n = 0; n < c.length; n++) {
                for (u = 0, s = 0; s < c[n].length; s++) {
                  for (r = 0; r < c[n][s].length - h; r++) {
                    if (
                      // @ts-expect-error: Known type conflict
                      t(
                        c[n][s][r],
                        f,
                        B,
                        w,
                        u
                      ) === !1
                    )
                      return !1;
                    f++;
                  }
                  u++;
                }
                w++;
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
const dt = 11102230246251565e-32, U = 134217729, In = (3 + 8 * dt) * dt;
function ht(i, t, e, n, s) {
  let r, o, a, c, l = t[0], h = n[0], f = 0, d = 0;
  h > l == h > -l ? (r = l, l = t[++f]) : (r = h, h = n[++d]);
  let g = 0;
  if (f < i && d < e)
    for (h > l == h > -l ? (o = l + r, a = r - (o - l), l = t[++f]) : (o = h + r, a = r - (o - h), h = n[++d]), r = o, a !== 0 && (s[g++] = a); f < i && d < e; )
      h > l == h > -l ? (o = r + l, c = o - r, a = r - (o - c) + (l - c), l = t[++f]) : (o = r + h, c = o - r, a = r - (o - c) + (h - c), h = n[++d]), r = o, a !== 0 && (s[g++] = a);
  for (; f < i; )
    o = r + l, c = o - r, a = r - (o - c) + (l - c), l = t[++f], r = o, a !== 0 && (s[g++] = a);
  for (; d < e; )
    o = r + h, c = o - r, a = r - (o - c) + (h - c), h = n[++d], r = o, a !== 0 && (s[g++] = a);
  return (r !== 0 || g === 0) && (s[g++] = r), g;
}
function _t(i, t, e, n, s, r, o, a) {
  return ht(ht(i, t, e, n, o), o, s, r, a);
}
function R(i, t, e, n) {
  let s, r, o, a, c, l, h, f, d, g, y;
  h = U * e, g = h - (h - e), y = e - g;
  let _ = t[0];
  s = _ * e, h = U * _, f = h - (h - _), d = _ - f, o = d * y - (s - f * g - d * g - f * y);
  let T = 0;
  o !== 0 && (n[T++] = o);
  for (let B = 1; B < i; B++)
    _ = t[B], a = _ * e, h = U * _, f = h - (h - _), d = _ - f, c = d * y - (a - f * g - d * g - f * y), r = s + c, l = r - s, o = s - (r - l) + (c - l), o !== 0 && (n[T++] = o), s = a + r, o = r - (s - a), o !== 0 && (n[T++] = o);
  return (s !== 0 || T === 0) && (n[T++] = s), T;
}
function Bn(i, t) {
  let e = t[0];
  for (let n = 1; n < i; n++) e += t[n];
  return e;
}
function tt(i) {
  return new Float64Array(i);
}
const Un = (3 + 16 * dt) * dt, zn = (2 + 12 * dt) * dt, Gn = (9 + 64 * dt) * dt * dt, Lt = tt(4), je = tt(8), Ue = tt(12), ze = tt(16), pt = tt(4);
function Kn(i, t, e, n, s, r, o) {
  let a, c, l, h, f, d, g, y, _, T, B, p, w, u, b, M, S, A;
  const E = i - s, F = e - s, I = t - r, N = n - r;
  u = E * N, d = U * E, g = d - (d - E), y = E - g, d = U * N, _ = d - (d - N), T = N - _, b = y * T - (u - g * _ - y * _ - g * T), M = I * F, d = U * I, g = d - (d - I), y = I - g, d = U * F, _ = d - (d - F), T = F - _, S = y * T - (M - g * _ - y * _ - g * T), B = b - S, f = b - B, Lt[0] = b - (B + f) + (f - S), p = u + B, f = p - u, w = u - (p - f) + (B - f), B = w - M, f = w - B, Lt[1] = w - (B + f) + (f - M), A = p + B, f = A - p, Lt[2] = p - (A - f) + (B - f), Lt[3] = A;
  let X = Bn(4, Lt), m = zn * o;
  if (X >= m || -X >= m || (f = i - E, a = i - (E + f) + (f - s), f = e - F, l = e - (F + f) + (f - s), f = t - I, c = t - (I + f) + (f - r), f = n - N, h = n - (N + f) + (f - r), a === 0 && c === 0 && l === 0 && h === 0) || (m = Gn * o + In * Math.abs(X), X += E * h + N * a - (I * l + F * c), X >= m || -X >= m)) return X;
  u = a * N, d = U * a, g = d - (d - a), y = a - g, d = U * N, _ = d - (d - N), T = N - _, b = y * T - (u - g * _ - y * _ - g * T), M = c * F, d = U * c, g = d - (d - c), y = c - g, d = U * F, _ = d - (d - F), T = F - _, S = y * T - (M - g * _ - y * _ - g * T), B = b - S, f = b - B, pt[0] = b - (B + f) + (f - S), p = u + B, f = p - u, w = u - (p - f) + (B - f), B = w - M, f = w - B, pt[1] = w - (B + f) + (f - M), A = p + B, f = A - p, pt[2] = p - (A - f) + (B - f), pt[3] = A;
  const k = ht(4, Lt, 4, pt, je);
  u = E * h, d = U * E, g = d - (d - E), y = E - g, d = U * h, _ = d - (d - h), T = h - _, b = y * T - (u - g * _ - y * _ - g * T), M = I * l, d = U * I, g = d - (d - I), y = I - g, d = U * l, _ = d - (d - l), T = l - _, S = y * T - (M - g * _ - y * _ - g * T), B = b - S, f = b - B, pt[0] = b - (B + f) + (f - S), p = u + B, f = p - u, w = u - (p - f) + (B - f), B = w - M, f = w - B, pt[1] = w - (B + f) + (f - M), A = p + B, f = A - p, pt[2] = p - (A - f) + (B - f), pt[3] = A;
  const x = ht(k, je, 4, pt, Ue);
  u = a * h, d = U * a, g = d - (d - a), y = a - g, d = U * h, _ = d - (d - h), T = h - _, b = y * T - (u - g * _ - y * _ - g * T), M = c * l, d = U * c, g = d - (d - c), y = c - g, d = U * l, _ = d - (d - l), T = l - _, S = y * T - (M - g * _ - y * _ - g * T), B = b - S, f = b - B, pt[0] = b - (B + f) + (f - S), p = u + B, f = p - u, w = u - (p - f) + (B - f), B = w - M, f = w - B, pt[1] = w - (B + f) + (f - M), A = p + B, f = A - p, pt[2] = p - (A - f) + (B - f), pt[3] = A;
  const O = ht(x, Ue, 4, pt, ze);
  return ze[O - 1];
}
function Mt(i, t, e, n, s, r) {
  const o = (t - r) * (e - s), a = (i - s) * (n - r), c = o - a, l = Math.abs(o + a);
  return Math.abs(c) >= Un * l ? c : -Kn(i, t, e, n, s, r, l);
}
const Jn = (10 + 96 * dt) * dt, Qn = (4 + 48 * dt) * dt, Wn = (44 + 576 * dt) * dt * dt, Ft = tt(4), Tt = tt(4), Ct = tt(4), St = tt(4), kt = tt(4), Et = tt(4), mt = tt(4), gt = tt(4), _e = tt(8), Me = tt(8), Se = tt(8), ke = tt(8), Ee = tt(8), Ae = tt(8), se = tt(8), oe = tt(8), ae = tt(8), Xt = tt(4), $t = tt(4), Yt = tt(4), z = tt(8), J = tt(16), nt = tt(16), rt = tt(16), et = tt(32), Dt = tt(32), at = tt(48), vt = tt(64);
let jt = tt(1152), Ie = tt(1152);
function ct(i, t, e) {
  i = ht(i, jt, t, e, Ie);
  const n = jt;
  return jt = Ie, Ie = n, i;
}
function Hn(i, t, e, n, s, r, o, a, c) {
  let l, h, f, d, g, y, _, T, B, p, w, u, b, M, S, A, E, F, I, N, X, m, k, x, O, D, P, v, C, $, Y, L, V, j, q;
  const K = i - o, G = e - o, Q = s - o, W = t - a, Z = n - a, H = r - a;
  Y = G * H, k = U * G, x = k - (k - G), O = G - x, k = U * H, D = k - (k - H), P = H - D, L = O * P - (Y - x * D - O * D - x * P), V = Q * Z, k = U * Q, x = k - (k - Q), O = Q - x, k = U * Z, D = k - (k - Z), P = Z - D, j = O * P - (V - x * D - O * D - x * P), v = L - j, m = L - v, Ft[0] = L - (v + m) + (m - j), C = Y + v, m = C - Y, $ = Y - (C - m) + (v - m), v = $ - V, m = $ - v, Ft[1] = $ - (v + m) + (m - V), q = C + v, m = q - C, Ft[2] = C - (q - m) + (v - m), Ft[3] = q, Y = Q * W, k = U * Q, x = k - (k - Q), O = Q - x, k = U * W, D = k - (k - W), P = W - D, L = O * P - (Y - x * D - O * D - x * P), V = K * H, k = U * K, x = k - (k - K), O = K - x, k = U * H, D = k - (k - H), P = H - D, j = O * P - (V - x * D - O * D - x * P), v = L - j, m = L - v, Tt[0] = L - (v + m) + (m - j), C = Y + v, m = C - Y, $ = Y - (C - m) + (v - m), v = $ - V, m = $ - v, Tt[1] = $ - (v + m) + (m - V), q = C + v, m = q - C, Tt[2] = C - (q - m) + (v - m), Tt[3] = q, Y = K * Z, k = U * K, x = k - (k - K), O = K - x, k = U * Z, D = k - (k - Z), P = Z - D, L = O * P - (Y - x * D - O * D - x * P), V = G * W, k = U * G, x = k - (k - G), O = G - x, k = U * W, D = k - (k - W), P = W - D, j = O * P - (V - x * D - O * D - x * P), v = L - j, m = L - v, Ct[0] = L - (v + m) + (m - j), C = Y + v, m = C - Y, $ = Y - (C - m) + (v - m), v = $ - V, m = $ - v, Ct[1] = $ - (v + m) + (m - V), q = C + v, m = q - C, Ct[2] = C - (q - m) + (v - m), Ct[3] = q, l = ht(
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
        Dt
      ),
      Dt,
      vt
    ),
    vt,
    ht(
      R(R(4, Ct, Q, z), z, Q, J),
      J,
      R(R(4, Ct, H, z), z, H, nt),
      nt,
      et
    ),
    et,
    jt
  );
  let ot = Bn(l, jt), ft = Qn * c;
  if (ot >= ft || -ot >= ft || (m = i - K, h = i - (K + m) + (m - o), m = t - W, g = t - (W + m) + (m - a), m = e - G, f = e - (G + m) + (m - o), m = n - Z, y = n - (Z + m) + (m - a), m = s - Q, d = s - (Q + m) + (m - o), m = r - H, _ = r - (H + m) + (m - a), h === 0 && f === 0 && d === 0 && g === 0 && y === 0 && _ === 0) || (ft = Wn * c + In * Math.abs(ot), ot += (K * K + W * W) * (G * _ + H * f - (Z * d + Q * y)) + 2 * (K * h + W * g) * (G * H - Z * Q) + ((G * G + Z * Z) * (Q * g + W * d - (H * h + K * _)) + 2 * (G * f + Z * y) * (Q * W - H * K)) + ((Q * Q + H * H) * (K * y + Z * h - (W * f + G * g)) + 2 * (Q * d + H * _) * (K * Z - W * G)), ot >= ft || -ot >= ft))
    return ot;
  if ((f !== 0 || y !== 0 || d !== 0 || _ !== 0) && (Y = K * K, k = U * K, x = k - (k - K), O = K - x, L = O * O - (Y - x * x - (x + x) * O), V = W * W, k = U * W, x = k - (k - W), O = W - x, j = O * O - (V - x * x - (x + x) * O), v = L + j, m = v - L, St[0] = L - (v - m) + (j - m), C = Y + v, m = C - Y, $ = Y - (C - m) + (v - m), v = $ + V, m = v - $, St[1] = $ - (v - m) + (V - m), q = C + v, m = q - C, St[2] = C - (q - m) + (v - m), St[3] = q), (d !== 0 || _ !== 0 || h !== 0 || g !== 0) && (Y = G * G, k = U * G, x = k - (k - G), O = G - x, L = O * O - (Y - x * x - (x + x) * O), V = Z * Z, k = U * Z, x = k - (k - Z), O = Z - x, j = O * O - (V - x * x - (x + x) * O), v = L + j, m = v - L, kt[0] = L - (v - m) + (j - m), C = Y + v, m = C - Y, $ = Y - (C - m) + (v - m), v = $ + V, m = v - $, kt[1] = $ - (v - m) + (V - m), q = C + v, m = q - C, kt[2] = C - (q - m) + (v - m), kt[3] = q), (h !== 0 || g !== 0 || f !== 0 || y !== 0) && (Y = Q * Q, k = U * Q, x = k - (k - Q), O = Q - x, L = O * O - (Y - x * x - (x + x) * O), V = H * H, k = U * H, x = k - (k - H), O = H - x, j = O * O - (V - x * x - (x + x) * O), v = L + j, m = v - L, Et[0] = L - (v - m) + (j - m), C = Y + v, m = C - Y, $ = Y - (C - m) + (v - m), v = $ + V, m = v - $, Et[1] = $ - (v - m) + (V - m), q = C + v, m = q - C, Et[2] = C - (q - m) + (v - m), Et[3] = q), h !== 0 && (T = R(4, Ft, h, _e), l = ct(l, _t(
    R(T, _e, 2 * K, J),
    J,
    R(R(4, Et, h, z), z, Z, nt),
    nt,
    R(R(4, kt, h, z), z, -H, rt),
    rt,
    et,
    at
  ), at)), g !== 0 && (B = R(4, Ft, g, Me), l = ct(l, _t(
    R(B, Me, 2 * W, J),
    J,
    R(R(4, kt, g, z), z, Q, nt),
    nt,
    R(R(4, Et, g, z), z, -G, rt),
    rt,
    et,
    at
  ), at)), f !== 0 && (p = R(4, Tt, f, Se), l = ct(l, _t(
    R(p, Se, 2 * G, J),
    J,
    R(R(4, St, f, z), z, H, nt),
    nt,
    R(R(4, Et, f, z), z, -W, rt),
    rt,
    et,
    at
  ), at)), y !== 0 && (w = R(4, Tt, y, ke), l = ct(l, _t(
    R(w, ke, 2 * Z, J),
    J,
    R(R(4, Et, y, z), z, K, nt),
    nt,
    R(R(4, St, y, z), z, -Q, rt),
    rt,
    et,
    at
  ), at)), d !== 0 && (u = R(4, Ct, d, Ee), l = ct(l, _t(
    R(u, Ee, 2 * Q, J),
    J,
    R(R(4, kt, d, z), z, W, nt),
    nt,
    R(R(4, St, d, z), z, -Z, rt),
    rt,
    et,
    at
  ), at)), _ !== 0 && (b = R(4, Ct, _, Ae), l = ct(l, _t(
    R(b, Ae, 2 * H, J),
    J,
    R(R(4, St, _, z), z, G, nt),
    nt,
    R(R(4, kt, _, z), z, -K, rt),
    rt,
    et,
    at
  ), at)), h !== 0 || g !== 0) {
    if (f !== 0 || y !== 0 || d !== 0 || _ !== 0 ? (Y = f * H, k = U * f, x = k - (k - f), O = f - x, k = U * H, D = k - (k - H), P = H - D, L = O * P - (Y - x * D - O * D - x * P), V = G * _, k = U * G, x = k - (k - G), O = G - x, k = U * _, D = k - (k - _), P = _ - D, j = O * P - (V - x * D - O * D - x * P), v = L + j, m = v - L, mt[0] = L - (v - m) + (j - m), C = Y + v, m = C - Y, $ = Y - (C - m) + (v - m), v = $ + V, m = v - $, mt[1] = $ - (v - m) + (V - m), q = C + v, m = q - C, mt[2] = C - (q - m) + (v - m), mt[3] = q, Y = d * -Z, k = U * d, x = k - (k - d), O = d - x, k = U * -Z, D = k - (k - -Z), P = -Z - D, L = O * P - (Y - x * D - O * D - x * P), V = Q * -y, k = U * Q, x = k - (k - Q), O = Q - x, k = U * -y, D = k - (k - -y), P = -y - D, j = O * P - (V - x * D - O * D - x * P), v = L + j, m = v - L, gt[0] = L - (v - m) + (j - m), C = Y + v, m = C - Y, $ = Y - (C - m) + (v - m), v = $ + V, m = v - $, gt[1] = $ - (v - m) + (V - m), q = C + v, m = q - C, gt[2] = C - (q - m) + (v - m), gt[3] = q, S = ht(4, mt, 4, gt, oe), Y = f * _, k = U * f, x = k - (k - f), O = f - x, k = U * _, D = k - (k - _), P = _ - D, L = O * P - (Y - x * D - O * D - x * P), V = d * y, k = U * d, x = k - (k - d), O = d - x, k = U * y, D = k - (k - y), P = y - D, j = O * P - (V - x * D - O * D - x * P), v = L - j, m = L - v, $t[0] = L - (v + m) + (m - j), C = Y + v, m = C - Y, $ = Y - (C - m) + (v - m), v = $ - V, m = $ - v, $t[1] = $ - (v + m) + (m - V), q = C + v, m = q - C, $t[2] = C - (q - m) + (v - m), $t[3] = q, F = 4) : (oe[0] = 0, S = 1, $t[0] = 0, F = 1), h !== 0) {
      const it = R(S, oe, h, rt);
      l = ct(l, ht(
        R(T, _e, h, J),
        J,
        R(it, rt, 2 * K, et),
        et,
        at
      ), at);
      const st = R(F, $t, h, z);
      l = ct(l, _t(
        R(st, z, 2 * K, J),
        J,
        R(st, z, h, nt),
        nt,
        R(it, rt, h, et),
        et,
        Dt,
        vt
      ), vt), y !== 0 && (l = ct(l, R(R(4, Et, h, z), z, y, J), J)), _ !== 0 && (l = ct(l, R(R(4, kt, -h, z), z, _, J), J));
    }
    if (g !== 0) {
      const it = R(S, oe, g, rt);
      l = ct(l, ht(
        R(B, Me, g, J),
        J,
        R(it, rt, 2 * W, et),
        et,
        at
      ), at);
      const st = R(F, $t, g, z);
      l = ct(l, _t(
        R(st, z, 2 * W, J),
        J,
        R(st, z, g, nt),
        nt,
        R(it, rt, g, et),
        et,
        Dt,
        vt
      ), vt);
    }
  }
  if (f !== 0 || y !== 0) {
    if (d !== 0 || _ !== 0 || h !== 0 || g !== 0 ? (Y = d * W, k = U * d, x = k - (k - d), O = d - x, k = U * W, D = k - (k - W), P = W - D, L = O * P - (Y - x * D - O * D - x * P), V = Q * g, k = U * Q, x = k - (k - Q), O = Q - x, k = U * g, D = k - (k - g), P = g - D, j = O * P - (V - x * D - O * D - x * P), v = L + j, m = v - L, mt[0] = L - (v - m) + (j - m), C = Y + v, m = C - Y, $ = Y - (C - m) + (v - m), v = $ + V, m = v - $, mt[1] = $ - (v - m) + (V - m), q = C + v, m = q - C, mt[2] = C - (q - m) + (v - m), mt[3] = q, N = -H, X = -_, Y = h * N, k = U * h, x = k - (k - h), O = h - x, k = U * N, D = k - (k - N), P = N - D, L = O * P - (Y - x * D - O * D - x * P), V = K * X, k = U * K, x = k - (k - K), O = K - x, k = U * X, D = k - (k - X), P = X - D, j = O * P - (V - x * D - O * D - x * P), v = L + j, m = v - L, gt[0] = L - (v - m) + (j - m), C = Y + v, m = C - Y, $ = Y - (C - m) + (v - m), v = $ + V, m = v - $, gt[1] = $ - (v - m) + (V - m), q = C + v, m = q - C, gt[2] = C - (q - m) + (v - m), gt[3] = q, A = ht(4, mt, 4, gt, ae), Y = d * g, k = U * d, x = k - (k - d), O = d - x, k = U * g, D = k - (k - g), P = g - D, L = O * P - (Y - x * D - O * D - x * P), V = h * _, k = U * h, x = k - (k - h), O = h - x, k = U * _, D = k - (k - _), P = _ - D, j = O * P - (V - x * D - O * D - x * P), v = L - j, m = L - v, Yt[0] = L - (v + m) + (m - j), C = Y + v, m = C - Y, $ = Y - (C - m) + (v - m), v = $ - V, m = $ - v, Yt[1] = $ - (v + m) + (m - V), q = C + v, m = q - C, Yt[2] = C - (q - m) + (v - m), Yt[3] = q, I = 4) : (ae[0] = 0, A = 1, Yt[0] = 0, I = 1), f !== 0) {
      const it = R(A, ae, f, rt);
      l = ct(l, ht(
        R(p, Se, f, J),
        J,
        R(it, rt, 2 * G, et),
        et,
        at
      ), at);
      const st = R(I, Yt, f, z);
      l = ct(l, _t(
        R(st, z, 2 * G, J),
        J,
        R(st, z, f, nt),
        nt,
        R(it, rt, f, et),
        et,
        Dt,
        vt
      ), vt), _ !== 0 && (l = ct(l, R(R(4, St, f, z), z, _, J), J)), g !== 0 && (l = ct(l, R(R(4, Et, -f, z), z, g, J), J));
    }
    if (y !== 0) {
      const it = R(A, ae, y, rt);
      l = ct(l, ht(
        R(w, ke, y, J),
        J,
        R(it, rt, 2 * Z, et),
        et,
        at
      ), at);
      const st = R(I, Yt, y, z);
      l = ct(l, _t(
        R(st, z, 2 * Z, J),
        J,
        R(st, z, y, nt),
        nt,
        R(it, rt, y, et),
        et,
        Dt,
        vt
      ), vt);
    }
  }
  if (d !== 0 || _ !== 0) {
    if (h !== 0 || g !== 0 || f !== 0 || y !== 0 ? (Y = h * Z, k = U * h, x = k - (k - h), O = h - x, k = U * Z, D = k - (k - Z), P = Z - D, L = O * P - (Y - x * D - O * D - x * P), V = K * y, k = U * K, x = k - (k - K), O = K - x, k = U * y, D = k - (k - y), P = y - D, j = O * P - (V - x * D - O * D - x * P), v = L + j, m = v - L, mt[0] = L - (v - m) + (j - m), C = Y + v, m = C - Y, $ = Y - (C - m) + (v - m), v = $ + V, m = v - $, mt[1] = $ - (v - m) + (V - m), q = C + v, m = q - C, mt[2] = C - (q - m) + (v - m), mt[3] = q, N = -W, X = -g, Y = f * N, k = U * f, x = k - (k - f), O = f - x, k = U * N, D = k - (k - N), P = N - D, L = O * P - (Y - x * D - O * D - x * P), V = G * X, k = U * G, x = k - (k - G), O = G - x, k = U * X, D = k - (k - X), P = X - D, j = O * P - (V - x * D - O * D - x * P), v = L + j, m = v - L, gt[0] = L - (v - m) + (j - m), C = Y + v, m = C - Y, $ = Y - (C - m) + (v - m), v = $ + V, m = v - $, gt[1] = $ - (v - m) + (V - m), q = C + v, m = q - C, gt[2] = C - (q - m) + (v - m), gt[3] = q, M = ht(4, mt, 4, gt, se), Y = h * y, k = U * h, x = k - (k - h), O = h - x, k = U * y, D = k - (k - y), P = y - D, L = O * P - (Y - x * D - O * D - x * P), V = f * g, k = U * f, x = k - (k - f), O = f - x, k = U * g, D = k - (k - g), P = g - D, j = O * P - (V - x * D - O * D - x * P), v = L - j, m = L - v, Xt[0] = L - (v + m) + (m - j), C = Y + v, m = C - Y, $ = Y - (C - m) + (v - m), v = $ - V, m = $ - v, Xt[1] = $ - (v + m) + (m - V), q = C + v, m = q - C, Xt[2] = C - (q - m) + (v - m), Xt[3] = q, E = 4) : (se[0] = 0, M = 1, Xt[0] = 0, E = 1), d !== 0) {
      const it = R(M, se, d, rt);
      l = ct(l, ht(
        R(u, Ee, d, J),
        J,
        R(it, rt, 2 * Q, et),
        et,
        at
      ), at);
      const st = R(E, Xt, d, z);
      l = ct(l, _t(
        R(st, z, 2 * Q, J),
        J,
        R(st, z, d, nt),
        nt,
        R(it, rt, d, et),
        et,
        Dt,
        vt
      ), vt), g !== 0 && (l = ct(l, R(R(4, kt, d, z), z, g, J), J)), y !== 0 && (l = ct(l, R(R(4, St, -d, z), z, y, J), J));
    }
    if (_ !== 0) {
      const it = R(M, se, _, rt);
      l = ct(l, ht(
        R(b, Ae, _, J),
        J,
        R(it, rt, 2 * H, et),
        et,
        at
      ), at);
      const st = R(E, Xt, _, z);
      l = ct(l, _t(
        R(st, z, 2 * H, J),
        J,
        R(st, z, _, nt),
        nt,
        R(it, rt, _, et),
        et,
        Dt,
        vt
      ), vt);
    }
  }
  return jt[l - 1];
}
function Zn(i, t, e, n, s, r, o, a) {
  const c = i - o, l = e - o, h = s - o, f = t - a, d = n - a, g = r - a, y = l * g, _ = h * d, T = c * c + f * f, B = h * f, p = c * g, w = l * l + d * d, u = c * d, b = l * f, M = h * h + g * g, S = T * (y - _) + w * (B - p) + M * (u - b), A = (Math.abs(y) + Math.abs(_)) * T + (Math.abs(B) + Math.abs(p)) * w + (Math.abs(u) + Math.abs(b)) * M, E = Jn * A;
  return S > E || -S > E ? S : Hn(i, t, e, n, s, r, o, a, A);
}
function tr(i, t) {
  var e, n, s = 0, r, o, a, c, l, h, f, d = i[0], g = i[1], y = t.length;
  for (e = 0; e < y; e++) {
    n = 0;
    var _ = t[e], T = _.length - 1;
    if (h = _[0], h[0] !== _[T][0] && h[1] !== _[T][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (o = h[0] - d, a = h[1] - g, n; n < T; n++) {
      if (f = _[n + 1], c = f[0] - d, l = f[1] - g, a === 0 && l === 0) {
        if (c <= 0 && o >= 0 || o <= 0 && c >= 0)
          return 0;
      } else if (l >= 0 && a <= 0 || l <= 0 && a >= 0) {
        if (r = Mt(o, c, a, l, 0, 0), r === 0)
          return 0;
        (r > 0 && l > 0 && a <= 0 || r < 0 && l <= 0 && a > 0) && s++;
      }
      h = f, a = l, o = c;
    }
  }
  return s % 2 !== 0;
}
function Be(i, t, e = {}) {
  if (!i)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const n = qn(i), s = jn(t), r = s.type, o = t.bbox;
  let a = s.coordinates;
  if (o && er(n, o) === !1)
    return !1;
  r === "Polygon" && (a = [a]);
  for (var c = 0; c < a.length; ++c) {
    const l = tr(n, a[c]);
    if (l === 0 && !e.ignoreBoundary) return !0;
    if (l) return !0;
  }
  return !1;
}
function er(i, t) {
  return t[0] <= i[0] && t[1] <= i[1] && t[2] >= i[0] && t[3] >= i[1];
}
class Xe {
  constructor(t = [], e = nr) {
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
function nr(i, t) {
  return i < t ? -1 : i > t ? 1 : 0;
}
const rr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Xe
}, Symbol.toStringTag, { value: "Module" })), Bt = 11102230246251565e-32, ut = 134217729, ir = (3 + 8 * Bt) * Bt;
function Oe(i, t, e, n, s) {
  let r, o, a, c, l = t[0], h = n[0], f = 0, d = 0;
  h > l == h > -l ? (r = l, l = t[++f]) : (r = h, h = n[++d]);
  let g = 0;
  if (f < i && d < e)
    for (h > l == h > -l ? (o = l + r, a = r - (o - l), l = t[++f]) : (o = h + r, a = r - (o - h), h = n[++d]), r = o, a !== 0 && (s[g++] = a); f < i && d < e; )
      h > l == h > -l ? (o = r + l, c = o - r, a = r - (o - c) + (l - c), l = t[++f]) : (o = r + h, c = o - r, a = r - (o - c) + (h - c), h = n[++d]), r = o, a !== 0 && (s[g++] = a);
  for (; f < i; )
    o = r + l, c = o - r, a = r - (o - c) + (l - c), l = t[++f], r = o, a !== 0 && (s[g++] = a);
  for (; d < e; )
    o = r + h, c = o - r, a = r - (o - c) + (h - c), h = n[++d], r = o, a !== 0 && (s[g++] = a);
  return (r !== 0 || g === 0) && (s[g++] = r), g;
}
function sr(i, t) {
  let e = t[0];
  for (let n = 1; n < i; n++) e += t[n];
  return e;
}
function re(i) {
  return new Float64Array(i);
}
const or = (3 + 16 * Bt) * Bt, ar = (2 + 12 * Bt) * Bt, cr = (9 + 64 * Bt) * Bt * Bt, Vt = re(4), Ge = re(8), Ke = re(12), Je = re(16), wt = re(4);
function lr(i, t, e, n, s, r, o) {
  let a, c, l, h, f, d, g, y, _, T, B, p, w, u, b, M, S, A;
  const E = i - s, F = e - s, I = t - r, N = n - r;
  u = E * N, d = ut * E, g = d - (d - E), y = E - g, d = ut * N, _ = d - (d - N), T = N - _, b = y * T - (u - g * _ - y * _ - g * T), M = I * F, d = ut * I, g = d - (d - I), y = I - g, d = ut * F, _ = d - (d - F), T = F - _, S = y * T - (M - g * _ - y * _ - g * T), B = b - S, f = b - B, Vt[0] = b - (B + f) + (f - S), p = u + B, f = p - u, w = u - (p - f) + (B - f), B = w - M, f = w - B, Vt[1] = w - (B + f) + (f - M), A = p + B, f = A - p, Vt[2] = p - (A - f) + (B - f), Vt[3] = A;
  let X = sr(4, Vt), m = ar * o;
  if (X >= m || -X >= m || (f = i - E, a = i - (E + f) + (f - s), f = e - F, l = e - (F + f) + (f - s), f = t - I, c = t - (I + f) + (f - r), f = n - N, h = n - (N + f) + (f - r), a === 0 && c === 0 && l === 0 && h === 0) || (m = cr * o + ir * Math.abs(X), X += E * h + N * a - (I * l + F * c), X >= m || -X >= m)) return X;
  u = a * N, d = ut * a, g = d - (d - a), y = a - g, d = ut * N, _ = d - (d - N), T = N - _, b = y * T - (u - g * _ - y * _ - g * T), M = c * F, d = ut * c, g = d - (d - c), y = c - g, d = ut * F, _ = d - (d - F), T = F - _, S = y * T - (M - g * _ - y * _ - g * T), B = b - S, f = b - B, wt[0] = b - (B + f) + (f - S), p = u + B, f = p - u, w = u - (p - f) + (B - f), B = w - M, f = w - B, wt[1] = w - (B + f) + (f - M), A = p + B, f = A - p, wt[2] = p - (A - f) + (B - f), wt[3] = A;
  const k = Oe(4, Vt, 4, wt, Ge);
  u = E * h, d = ut * E, g = d - (d - E), y = E - g, d = ut * h, _ = d - (d - h), T = h - _, b = y * T - (u - g * _ - y * _ - g * T), M = I * l, d = ut * I, g = d - (d - I), y = I - g, d = ut * l, _ = d - (d - l), T = l - _, S = y * T - (M - g * _ - y * _ - g * T), B = b - S, f = b - B, wt[0] = b - (B + f) + (f - S), p = u + B, f = p - u, w = u - (p - f) + (B - f), B = w - M, f = w - B, wt[1] = w - (B + f) + (f - M), A = p + B, f = A - p, wt[2] = p - (A - f) + (B - f), wt[3] = A;
  const x = Oe(k, Ge, 4, wt, Ke);
  u = a * h, d = ut * a, g = d - (d - a), y = a - g, d = ut * h, _ = d - (d - h), T = h - _, b = y * T - (u - g * _ - y * _ - g * T), M = c * l, d = ut * c, g = d - (d - c), y = c - g, d = ut * l, _ = d - (d - l), T = l - _, S = y * T - (M - g * _ - y * _ - g * T), B = b - S, f = b - B, wt[0] = b - (B + f) + (f - S), p = u + B, f = p - u, w = u - (p - f) + (B - f), B = w - M, f = w - B, wt[1] = w - (B + f) + (f - M), A = p + B, f = A - p, wt[2] = p - (A - f) + (B - f), wt[3] = A;
  const O = Oe(x, Ke, 4, wt, Je);
  return Je[O - 1];
}
function Qe(i, t, e, n, s, r) {
  const o = (t - r) * (e - s), a = (i - s) * (n - r), c = o - a;
  if (o === 0 || a === 0 || o > 0 != a > 0) return c;
  const l = Math.abs(o + a);
  return Math.abs(c) >= or * l ? c : -lr(i, t, e, n, s, r, l);
}
function fr(i, t) {
  const e = new Xe([], On);
  return ur(i, e), dr(e, t);
}
function On(i, t) {
  return i.p.x > t.p.x ? 1 : i.p.x < t.p.x || i.p.x === t.p.x && (i.featureId !== t.featureId || i.ringId !== t.ringId) && i.isLeftEndpoint && !t.isLeftEndpoint ? -1 : i.p.y !== t.p.y ? i.p.y > t.p.y ? 1 : -1 : 1;
}
function hr(i, t) {
  return i.rightSweepEvent.p.x > t.rightSweepEvent.p.x ? 1 : i.rightSweepEvent.p.x < t.rightSweepEvent.p.x ? -1 : i.rightSweepEvent.p.y !== t.rightSweepEvent.p.y ? i.rightSweepEvent.p.y < t.rightSweepEvent.p.y ? 1 : -1 : 1;
}
function ur(i, t) {
  if (i.type === "FeatureCollection") {
    const e = i.features;
    for (let n = 0; n < e.length; n++)
      We(e[n], t);
  } else
    We(i, t);
}
var ce = 0, le = 0, fe = 0;
function We(i, t) {
  const e = i.type === "Feature" ? i.geometry : i;
  let n = e.coordinates;
  (e.type === "Polygon" || e.type === "MultiLineString") && (n = [n]), e.type === "LineString" && (n = [[n]]);
  for (let s = 0; s < n.length; s++)
    for (let r = 0; r < n[s].length; r++) {
      let o = n[s][r][0], a = null;
      le = le + 1;
      for (let c = 0; c < n[s][r].length - 1; c++) {
        a = n[s][r][c + 1];
        const l = new He(o, ce, le, fe), h = new He(a, ce, le, fe + 1);
        l.otherEvent = h, h.otherEvent = l, On(l, h) > 0 ? (h.isLeftEndpoint = !0, l.isLeftEndpoint = !1) : (l.isLeftEndpoint = !0, h.isLeftEndpoint = !1), t.push(l), t.push(h), o = a, fe = fe + 1;
      }
    }
  ce = ce + 1;
}
var He = class {
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
function dr(i, t = !1) {
  const e = [], n = new Xe([], hr);
  for (; i.length; ) {
    const s = i.pop();
    if (s.isLeftEndpoint) {
      const r = new pr(s);
      for (let o = 0; o < n.data.length; o++) {
        const a = n.data[o];
        if (t && a.leftSweepEvent.featureId === s.featureId)
          continue;
        const c = mr(r, a);
        c !== !1 && e.push(c);
      }
      n.push(r);
    } else s.isLeftEndpoint === !1 && n.pop();
  }
  return e;
}
var pr = class {
  /** @param event must have otherEvent non-null */
  constructor(i) {
    this.leftSweepEvent = i, this.rightSweepEvent = i.otherEvent;
  }
};
function mr(i, t) {
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
  const d = (l - a) * (s - e) - (c - o) * (r - n), g = (c - o) * (n - a) - (l - a) * (e - o), y = (s - e) * (n - a) - (r - n) * (e - o);
  if (d === 0)
    return !1;
  const _ = g / d, T = y / d;
  if (_ >= 0 && _ <= 1 && T >= 0 && T <= 1) {
    const B = e + _ * (s - e), p = n + _ * (r - n);
    return [B, p];
  }
  return !1;
}
function gr(i, t, e = {}) {
  const { removeDuplicates: n = !0, ignoreSelfIntersections: s = !0 } = e;
  let r = [];
  i.type === "FeatureCollection" ? r = r.concat(i.features) : i.type === "Feature" ? r.push(i) : (i.type === "LineString" || i.type === "Polygon" || i.type === "MultiLineString" || i.type === "MultiPolygon") && r.push(Zt(i)), t.type === "FeatureCollection" ? r = r.concat(t.features) : t.type === "Feature" ? r.push(t) : (t.type === "LineString" || t.type === "Polygon" || t.type === "MultiLineString" || t.type === "MultiPolygon") && r.push(Zt(t));
  const o = fr(
    bt(r),
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
  return bt(a.map((c) => Pt(c)));
}
function wr(i) {
  return i && i.__esModule && Object.prototype.hasOwnProperty.call(i, "default") ? i.default : i;
}
function vr(i) {
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
function yr(i, t = {}) {
  let e = 0, n = 0, s = 0;
  return Pe(
    i,
    function(r) {
      e += r[0], n += r[1], s++;
    },
    !0
  ), Pt([e / s, n / s], t.properties);
}
var he = { exports: {} }, we = { exports: {} }, br = we.exports, Ze;
function xr() {
  return Ze || (Ze = 1, (function(i, t) {
    (function(e, n) {
      i.exports = n();
    })(br, function() {
      function e(p, w, u, b, M) {
        (function S(A, E, F, I, N) {
          for (; I > F; ) {
            if (I - F > 600) {
              var X = I - F + 1, m = E - F + 1, k = Math.log(X), x = 0.5 * Math.exp(2 * k / 3), O = 0.5 * Math.sqrt(k * x * (X - x) / X) * (m - X / 2 < 0 ? -1 : 1), D = Math.max(F, Math.floor(E - m * x / X + O)), P = Math.min(I, Math.floor(E + (X - m) * x / X + O));
              S(A, E, D, P, N);
            }
            var v = A[E], C = F, $ = I;
            for (n(A, F, E), N(A[I], v) > 0 && n(A, F, I); C < $; ) {
              for (n(A, C, $), C++, $--; N(A[C], v) < 0; ) C++;
              for (; N(A[$], v) > 0; ) $--;
            }
            N(A[F], v) === 0 ? n(A, F, $) : n(A, ++$, I), $ <= E && (F = $ + 1), E <= $ && (I = $ - 1);
          }
        })(p, w, u || 0, b || p.length - 1, M || s);
      }
      function n(p, w, u) {
        var b = p[w];
        p[w] = p[u], p[u] = b;
      }
      function s(p, w) {
        return p < w ? -1 : p > w ? 1 : 0;
      }
      var r = function(p) {
        p === void 0 && (p = 9), this._maxEntries = Math.max(4, p), this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries)), this.clear();
      };
      function o(p, w, u) {
        if (!u) return w.indexOf(p);
        for (var b = 0; b < w.length; b++) if (u(p, w[b])) return b;
        return -1;
      }
      function a(p, w) {
        c(p, 0, p.children.length, w, p);
      }
      function c(p, w, u, b, M) {
        M || (M = T(null)), M.minX = 1 / 0, M.minY = 1 / 0, M.maxX = -1 / 0, M.maxY = -1 / 0;
        for (var S = w; S < u; S++) {
          var A = p.children[S];
          l(M, p.leaf ? b(A) : A);
        }
        return M;
      }
      function l(p, w) {
        return p.minX = Math.min(p.minX, w.minX), p.minY = Math.min(p.minY, w.minY), p.maxX = Math.max(p.maxX, w.maxX), p.maxY = Math.max(p.maxY, w.maxY), p;
      }
      function h(p, w) {
        return p.minX - w.minX;
      }
      function f(p, w) {
        return p.minY - w.minY;
      }
      function d(p) {
        return (p.maxX - p.minX) * (p.maxY - p.minY);
      }
      function g(p) {
        return p.maxX - p.minX + (p.maxY - p.minY);
      }
      function y(p, w) {
        return p.minX <= w.minX && p.minY <= w.minY && w.maxX <= p.maxX && w.maxY <= p.maxY;
      }
      function _(p, w) {
        return w.minX <= p.maxX && w.minY <= p.maxY && w.maxX >= p.minX && w.maxY >= p.minY;
      }
      function T(p) {
        return { children: p, height: 1, leaf: !0, minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
      }
      function B(p, w, u, b, M) {
        for (var S = [w, u]; S.length; ) if (!((u = S.pop()) - (w = S.pop()) <= b)) {
          var A = w + Math.ceil((u - w) / b / 2) * b;
          e(p, A, w, u, M), S.push(w, A, A, u);
        }
      }
      return r.prototype.all = function() {
        return this._all(this.data, []);
      }, r.prototype.search = function(p) {
        var w = this.data, u = [];
        if (!_(p, w)) return u;
        for (var b = this.toBBox, M = []; w; ) {
          for (var S = 0; S < w.children.length; S++) {
            var A = w.children[S], E = w.leaf ? b(A) : A;
            _(p, E) && (w.leaf ? u.push(A) : y(p, E) ? this._all(A, u) : M.push(A));
          }
          w = M.pop();
        }
        return u;
      }, r.prototype.collides = function(p) {
        var w = this.data;
        if (!_(p, w)) return !1;
        for (var u = []; w; ) {
          for (var b = 0; b < w.children.length; b++) {
            var M = w.children[b], S = w.leaf ? this.toBBox(M) : M;
            if (_(p, S)) {
              if (w.leaf || y(p, S)) return !0;
              u.push(M);
            }
          }
          w = u.pop();
        }
        return !1;
      }, r.prototype.load = function(p) {
        if (!p || !p.length) return this;
        if (p.length < this._minEntries) {
          for (var w = 0; w < p.length; w++) this.insert(p[w]);
          return this;
        }
        var u = this._build(p.slice(), 0, p.length - 1, 0);
        if (this.data.children.length) if (this.data.height === u.height) this._splitRoot(this.data, u);
        else {
          if (this.data.height < u.height) {
            var b = this.data;
            this.data = u, u = b;
          }
          this._insert(u, this.data.height - u.height - 1, !0);
        }
        else this.data = u;
        return this;
      }, r.prototype.insert = function(p) {
        return p && this._insert(p, this.data.height - 1), this;
      }, r.prototype.clear = function() {
        return this.data = T([]), this;
      }, r.prototype.remove = function(p, w) {
        if (!p) return this;
        for (var u, b, M, S = this.data, A = this.toBBox(p), E = [], F = []; S || E.length; ) {
          if (S || (S = E.pop(), b = E[E.length - 1], u = F.pop(), M = !0), S.leaf) {
            var I = o(p, S.children, w);
            if (I !== -1) return S.children.splice(I, 1), E.push(S), this._condense(E), this;
          }
          M || S.leaf || !y(S, A) ? b ? (u++, S = b.children[u], M = !1) : S = null : (E.push(S), F.push(u), u = 0, b = S, S = S.children[0]);
        }
        return this;
      }, r.prototype.toBBox = function(p) {
        return p;
      }, r.prototype.compareMinX = function(p, w) {
        return p.minX - w.minX;
      }, r.prototype.compareMinY = function(p, w) {
        return p.minY - w.minY;
      }, r.prototype.toJSON = function() {
        return this.data;
      }, r.prototype.fromJSON = function(p) {
        return this.data = p, this;
      }, r.prototype._all = function(p, w) {
        for (var u = []; p; ) p.leaf ? w.push.apply(w, p.children) : u.push.apply(u, p.children), p = u.pop();
        return w;
      }, r.prototype._build = function(p, w, u, b) {
        var M, S = u - w + 1, A = this._maxEntries;
        if (S <= A) return a(M = T(p.slice(w, u + 1)), this.toBBox), M;
        b || (b = Math.ceil(Math.log(S) / Math.log(A)), A = Math.ceil(S / Math.pow(A, b - 1))), (M = T([])).leaf = !1, M.height = b;
        var E = Math.ceil(S / A), F = E * Math.ceil(Math.sqrt(A));
        B(p, w, u, F, this.compareMinX);
        for (var I = w; I <= u; I += F) {
          var N = Math.min(I + F - 1, u);
          B(p, I, N, E, this.compareMinY);
          for (var X = I; X <= N; X += E) {
            var m = Math.min(X + E - 1, N);
            M.children.push(this._build(p, X, m, b - 1));
          }
        }
        return a(M, this.toBBox), M;
      }, r.prototype._chooseSubtree = function(p, w, u, b) {
        for (; b.push(w), !w.leaf && b.length - 1 !== u; ) {
          for (var M = 1 / 0, S = 1 / 0, A = void 0, E = 0; E < w.children.length; E++) {
            var F = w.children[E], I = d(F), N = (X = p, m = F, (Math.max(m.maxX, X.maxX) - Math.min(m.minX, X.minX)) * (Math.max(m.maxY, X.maxY) - Math.min(m.minY, X.minY)) - I);
            N < S ? (S = N, M = I < M ? I : M, A = F) : N === S && I < M && (M = I, A = F);
          }
          w = A || w.children[0];
        }
        var X, m;
        return w;
      }, r.prototype._insert = function(p, w, u) {
        var b = u ? p : this.toBBox(p), M = [], S = this._chooseSubtree(b, this.data, w, M);
        for (S.children.push(p), l(S, b); w >= 0 && M[w].children.length > this._maxEntries; ) this._split(M, w), w--;
        this._adjustParentBBoxes(b, M, w);
      }, r.prototype._split = function(p, w) {
        var u = p[w], b = u.children.length, M = this._minEntries;
        this._chooseSplitAxis(u, M, b);
        var S = this._chooseSplitIndex(u, M, b), A = T(u.children.splice(S, u.children.length - S));
        A.height = u.height, A.leaf = u.leaf, a(u, this.toBBox), a(A, this.toBBox), w ? p[w - 1].children.push(A) : this._splitRoot(u, A);
      }, r.prototype._splitRoot = function(p, w) {
        this.data = T([p, w]), this.data.height = p.height + 1, this.data.leaf = !1, a(this.data, this.toBBox);
      }, r.prototype._chooseSplitIndex = function(p, w, u) {
        for (var b, M, S, A, E, F, I, N = 1 / 0, X = 1 / 0, m = w; m <= u - w; m++) {
          var k = c(p, 0, m, this.toBBox), x = c(p, m, u, this.toBBox), O = (M = k, S = x, A = void 0, E = void 0, F = void 0, I = void 0, A = Math.max(M.minX, S.minX), E = Math.max(M.minY, S.minY), F = Math.min(M.maxX, S.maxX), I = Math.min(M.maxY, S.maxY), Math.max(0, F - A) * Math.max(0, I - E)), D = d(k) + d(x);
          O < N ? (N = O, b = m, X = D < X ? D : X) : O === N && D < X && (X = D, b = m);
        }
        return b || u - w;
      }, r.prototype._chooseSplitAxis = function(p, w, u) {
        var b = p.leaf ? this.compareMinX : h, M = p.leaf ? this.compareMinY : f;
        this._allDistMargin(p, w, u, b) < this._allDistMargin(p, w, u, M) && p.children.sort(b);
      }, r.prototype._allDistMargin = function(p, w, u, b) {
        p.children.sort(b);
        for (var M = this.toBBox, S = c(p, 0, w, M), A = c(p, u - w, u, M), E = g(S) + g(A), F = w; F < u - w; F++) {
          var I = p.children[F];
          l(S, p.leaf ? M(I) : I), E += g(S);
        }
        for (var N = u - w - 1; N >= w; N--) {
          var X = p.children[N];
          l(A, p.leaf ? M(X) : X), E += g(A);
        }
        return E;
      }, r.prototype._adjustParentBBoxes = function(p, w, u) {
        for (var b = u; b >= 0; b--) l(w[b], p);
      }, r.prototype._condense = function(p) {
        for (var w = p.length - 1, u = void 0; w >= 0; w--) p[w].children.length === 0 ? w > 0 ? (u = p[w - 1].children).splice(u.indexOf(p[w]), 1) : this.clear() : a(p[w], this.toBBox);
      }, r;
    });
  })(we)), we.exports;
}
const _r = /* @__PURE__ */ vr(rr);
var zt = { exports: {} }, Fe, tn;
function Mr() {
  return tn || (tn = 1, Fe = function(t, e, n, s) {
    var r = t[0], o = t[1], a = !1;
    n === void 0 && (n = 0), s === void 0 && (s = e.length);
    for (var c = (s - n) / 2, l = 0, h = c - 1; l < c; h = l++) {
      var f = e[n + l * 2 + 0], d = e[n + l * 2 + 1], g = e[n + h * 2 + 0], y = e[n + h * 2 + 1], _ = d > o != y > o && r < (g - f) * (o - d) / (y - d) + f;
      _ && (a = !a);
    }
    return a;
  }), Fe;
}
var Te, en;
function Sr() {
  return en || (en = 1, Te = function(t, e, n, s) {
    var r = t[0], o = t[1], a = !1;
    n === void 0 && (n = 0), s === void 0 && (s = e.length);
    for (var c = s - n, l = 0, h = c - 1; l < c; h = l++) {
      var f = e[l + n][0], d = e[l + n][1], g = e[h + n][0], y = e[h + n][1], _ = d > o != y > o && r < (g - f) * (o - d) / (y - d) + f;
      _ && (a = !a);
    }
    return a;
  }), Te;
}
var nn;
function kr() {
  if (nn) return zt.exports;
  nn = 1;
  var i = Mr(), t = Sr();
  return zt.exports = function(n, s, r, o) {
    return s.length > 0 && Array.isArray(s[0]) ? t(n, s, r, o) : i(n, s, r, o);
  }, zt.exports.nested = t, zt.exports.flat = i, zt.exports;
}
var Kt = { exports: {} }, Er = Kt.exports, rn;
function Ar() {
  return rn || (rn = 1, (function(i, t) {
    (function(e, n) {
      n(t);
    })(Er, function(e) {
      const s = 33306690738754706e-32;
      function r(_, T, B, p, w) {
        let u, b, M, S, A = T[0], E = p[0], F = 0, I = 0;
        E > A == E > -A ? (u = A, A = T[++F]) : (u = E, E = p[++I]);
        let N = 0;
        if (F < _ && I < B) for (E > A == E > -A ? (M = u - ((b = A + u) - A), A = T[++F]) : (M = u - ((b = E + u) - E), E = p[++I]), u = b, M !== 0 && (w[N++] = M); F < _ && I < B; ) E > A == E > -A ? (M = u - ((b = u + A) - (S = b - u)) + (A - S), A = T[++F]) : (M = u - ((b = u + E) - (S = b - u)) + (E - S), E = p[++I]), u = b, M !== 0 && (w[N++] = M);
        for (; F < _; ) M = u - ((b = u + A) - (S = b - u)) + (A - S), A = T[++F], u = b, M !== 0 && (w[N++] = M);
        for (; I < B; ) M = u - ((b = u + E) - (S = b - u)) + (E - S), E = p[++I], u = b, M !== 0 && (w[N++] = M);
        return u === 0 && N !== 0 || (w[N++] = u), N;
      }
      function o(_) {
        return new Float64Array(_);
      }
      const a = 33306690738754716e-32, c = 22204460492503146e-32, l = 11093356479670487e-47, h = o(4), f = o(8), d = o(12), g = o(16), y = o(4);
      e.orient2d = function(_, T, B, p, w, u) {
        const b = (T - u) * (B - w), M = (_ - w) * (p - u), S = b - M;
        if (b === 0 || M === 0 || b > 0 != M > 0) return S;
        const A = Math.abs(b + M);
        return Math.abs(S) >= a * A ? S : -(function(E, F, I, N, X, m, k) {
          let x, O, D, P, v, C, $, Y, L, V, j, q, K, G, Q, W, Z, H;
          const ot = E - X, ft = I - X, it = F - m, st = N - m;
          v = (Q = (Y = ot - ($ = (C = 134217729 * ot) - (C - ot))) * (V = st - (L = (C = 134217729 * st) - (C - st))) - ((G = ot * st) - $ * L - Y * L - $ * V)) - (j = Q - (Z = (Y = it - ($ = (C = 134217729 * it) - (C - it))) * (V = ft - (L = (C = 134217729 * ft) - (C - ft))) - ((W = it * ft) - $ * L - Y * L - $ * V))), h[0] = Q - (j + v) + (v - Z), v = (K = G - ((q = G + j) - (v = q - G)) + (j - v)) - (j = K - W), h[1] = K - (j + v) + (v - W), v = (H = q + j) - q, h[2] = q - (H - v) + (j - v), h[3] = H;
          let Ot = (function($n, Ye) {
            let Re = Ye[0];
            for (let xe = 1; xe < $n; xe++) Re += Ye[xe];
            return Re;
          })(4, h), Ut = c * k;
          if (Ot >= Ut || -Ot >= Ut || (x = E - (ot + (v = E - ot)) + (v - X), D = I - (ft + (v = I - ft)) + (v - X), O = F - (it + (v = F - it)) + (v - m), P = N - (st + (v = N - st)) + (v - m), x === 0 && O === 0 && D === 0 && P === 0) || (Ut = l * k + s * Math.abs(Ot), (Ot += ot * P + st * x - (it * D + ft * O)) >= Ut || -Ot >= Ut)) return Ot;
          v = (Q = (Y = x - ($ = (C = 134217729 * x) - (C - x))) * (V = st - (L = (C = 134217729 * st) - (C - st))) - ((G = x * st) - $ * L - Y * L - $ * V)) - (j = Q - (Z = (Y = O - ($ = (C = 134217729 * O) - (C - O))) * (V = ft - (L = (C = 134217729 * ft) - (C - ft))) - ((W = O * ft) - $ * L - Y * L - $ * V))), y[0] = Q - (j + v) + (v - Z), v = (K = G - ((q = G + j) - (v = q - G)) + (j - v)) - (j = K - W), y[1] = K - (j + v) + (v - W), v = (H = q + j) - q, y[2] = q - (H - v) + (j - v), y[3] = H;
          const Nn = r(4, h, 4, y, f);
          v = (Q = (Y = ot - ($ = (C = 134217729 * ot) - (C - ot))) * (V = P - (L = (C = 134217729 * P) - (C - P))) - ((G = ot * P) - $ * L - Y * L - $ * V)) - (j = Q - (Z = (Y = it - ($ = (C = 134217729 * it) - (C - it))) * (V = D - (L = (C = 134217729 * D) - (C - D))) - ((W = it * D) - $ * L - Y * L - $ * V))), y[0] = Q - (j + v) + (v - Z), v = (K = G - ((q = G + j) - (v = q - G)) + (j - v)) - (j = K - W), y[1] = K - (j + v) + (v - W), v = (H = q + j) - q, y[2] = q - (H - v) + (j - v), y[3] = H;
          const Pn = r(Nn, f, 4, y, d);
          v = (Q = (Y = x - ($ = (C = 134217729 * x) - (C - x))) * (V = P - (L = (C = 134217729 * P) - (C - P))) - ((G = x * P) - $ * L - Y * L - $ * V)) - (j = Q - (Z = (Y = O - ($ = (C = 134217729 * O) - (C - O))) * (V = D - (L = (C = 134217729 * D) - (C - D))) - ((W = O * D) - $ * L - Y * L - $ * V))), y[0] = Q - (j + v) + (v - Z), v = (K = G - ((q = G + j) - (v = q - G)) + (j - v)) - (j = K - W), y[1] = K - (j + v) + (v - W), v = (H = q + j) - q, y[2] = q - (H - v) + (j - v), y[3] = H;
          const Xn = r(Pn, d, 4, y, g);
          return g[Xn - 1];
        })(_, T, B, p, w, u, A);
      }, e.orient2dfast = function(_, T, B, p, w, u) {
        return (T - u) * (B - w) - (_ - w) * (p - u);
      }, Object.defineProperty(e, "__esModule", { value: !0 });
    });
  })(Kt, Kt.exports)), Kt.exports;
}
var sn;
function Ir() {
  if (sn) return he.exports;
  sn = 1;
  var i = xr(), t = _r, e = kr(), n = Ar().orient2d;
  t.default && (t = t.default), he.exports = s, he.exports.default = s;
  function s(u, b, M) {
    b = Math.max(0, b === void 0 ? 2 : b), M = M || 0;
    var S = g(u), A = new i(16);
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
    for (var E = [], F = 0, I; F < S.length; F++) {
      var N = S[F];
      A.remove(N), I = y(N, I), E.push(I);
    }
    var X = new i(16);
    for (F = 0; F < E.length; F++) X.insert(d(E[F]));
    for (var m = b * b, k = M * M; E.length; ) {
      var x = E.shift(), O = x.p, D = x.next.p, P = _(O, D);
      if (!(P < k)) {
        var v = P / m;
        N = r(A, x.prev.p, O, D, x.next.next.p, v, X), N && Math.min(_(N, O), _(N, D)) <= v && (E.push(x), E.push(y(N, x)), A.remove(N), X.remove(x), X.insert(d(x)), X.insert(d(x.next)));
      }
    }
    x = I;
    var C = [];
    do
      C.push(x.p), x = x.next;
    while (x !== I);
    return C.push(x.p), C;
  }
  function r(u, b, M, S, A, E, F) {
    for (var I = new t([], o), N = u.data; N; ) {
      for (var X = 0; X < N.children.length; X++) {
        var m = N.children[X], k = N.leaf ? T(m, M, S) : a(M, S, m);
        k > E || I.push({
          node: m,
          dist: k
        });
      }
      for (; I.length && !I.peek().node.children; ) {
        var x = I.pop(), O = x.node, D = T(O, b, M), P = T(O, S, A);
        if (x.dist < D && x.dist < P && l(M, O, F) && l(S, O, F)) return O;
      }
      N = I.pop(), N && (N = N.node);
    }
    return null;
  }
  function o(u, b) {
    return u.dist - b.dist;
  }
  function a(u, b, M) {
    if (c(u, M) || c(b, M)) return 0;
    var S = B(u[0], u[1], b[0], b[1], M.minX, M.minY, M.maxX, M.minY);
    if (S === 0) return 0;
    var A = B(u[0], u[1], b[0], b[1], M.minX, M.minY, M.minX, M.maxY);
    if (A === 0) return 0;
    var E = B(u[0], u[1], b[0], b[1], M.maxX, M.minY, M.maxX, M.maxY);
    if (E === 0) return 0;
    var F = B(u[0], u[1], b[0], b[1], M.minX, M.maxY, M.maxX, M.maxY);
    return F === 0 ? 0 : Math.min(S, A, E, F);
  }
  function c(u, b) {
    return u[0] >= b.minX && u[0] <= b.maxX && u[1] >= b.minY && u[1] <= b.maxY;
  }
  function l(u, b, M) {
    for (var S = Math.min(u[0], b[0]), A = Math.min(u[1], b[1]), E = Math.max(u[0], b[0]), F = Math.max(u[1], b[1]), I = M.search({ minX: S, minY: A, maxX: E, maxY: F }), N = 0; N < I.length; N++)
      if (f(I[N].p, I[N].next.p, u, b)) return !1;
    return !0;
  }
  function h(u, b, M) {
    return n(u[0], u[1], b[0], b[1], M[0], M[1]);
  }
  function f(u, b, M, S) {
    return u !== S && b !== M && h(u, b, M) > 0 != h(u, b, S) > 0 && h(M, S, u) > 0 != h(M, S, b) > 0;
  }
  function d(u) {
    var b = u.p, M = u.next.p;
    return u.minX = Math.min(b[0], M[0]), u.minY = Math.min(b[1], M[1]), u.maxX = Math.max(b[0], M[0]), u.maxY = Math.max(b[1], M[1]), u;
  }
  function g(u) {
    for (var b = u[0], M = u[0], S = u[0], A = u[0], E = 0; E < u.length; E++) {
      var F = u[E];
      F[0] < b[0] && (b = F), F[0] > S[0] && (S = F), F[1] < M[1] && (M = F), F[1] > A[1] && (A = F);
    }
    var I = [b, M, S, A], N = I.slice();
    for (E = 0; E < u.length; E++)
      e(u[E], I) || N.push(u[E]);
    return w(N);
  }
  function y(u, b) {
    var M = {
      p: u,
      prev: null,
      next: null,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };
    return b ? (M.next = b.next, M.prev = b, b.next.prev = M, b.next = M) : (M.prev = M, M.next = M), M;
  }
  function _(u, b) {
    var M = u[0] - b[0], S = u[1] - b[1];
    return M * M + S * S;
  }
  function T(u, b, M) {
    var S = b[0], A = b[1], E = M[0] - S, F = M[1] - A;
    if (E !== 0 || F !== 0) {
      var I = ((u[0] - S) * E + (u[1] - A) * F) / (E * E + F * F);
      I > 1 ? (S = M[0], A = M[1]) : I > 0 && (S += E * I, A += F * I);
    }
    return E = u[0] - S, F = u[1] - A, E * E + F * F;
  }
  function B(u, b, M, S, A, E, F, I) {
    var N = M - u, X = S - b, m = F - A, k = I - E, x = u - A, O = b - E, D = N * N + X * X, P = N * m + X * k, v = m * m + k * k, C = N * x + X * O, $ = m * x + k * O, Y = D * v - P * P, L, V, j, q, K = Y, G = Y;
    Y === 0 ? (V = 0, K = 1, q = $, G = v) : (V = P * $ - v * C, q = D * $ - P * C, V < 0 ? (V = 0, q = $, G = v) : V > K && (V = K, q = $ + P, G = v)), q < 0 ? (q = 0, -C < 0 ? V = 0 : -C > D ? V = K : (V = -C, K = D)) : q > G && (q = G, -C + P < 0 ? V = 0 : -C + P > D ? V = K : (V = -C + P, K = D)), L = V === 0 ? 0 : V / K, j = q === 0 ? 0 : q / G;
    var Q = (1 - L) * u + L * M, W = (1 - L) * b + L * S, Z = (1 - j) * A + j * F, H = (1 - j) * E + j * I, ot = Z - Q, ft = H - W;
    return ot * ot + ft * ft;
  }
  function p(u, b) {
    return u[0] === b[0] ? u[1] - b[1] : u[0] - b[0];
  }
  function w(u) {
    u.sort(p);
    for (var b = [], M = 0; M < u.length; M++) {
      for (; b.length >= 2 && h(b[b.length - 2], b[b.length - 1], u[M]) <= 0; )
        b.pop();
      b.push(u[M]);
    }
    for (var S = [], A = u.length - 1; A >= 0; A--) {
      for (; S.length >= 2 && h(S[S.length - 2], S[S.length - 1], u[A]) <= 0; )
        S.pop();
      S.push(u[A]);
    }
    return S.pop(), b.pop(), b.concat(S);
  }
  return he.exports;
}
var Br = Ir();
const Or = /* @__PURE__ */ wr(Br);
function on(i, t = {}) {
  t.concavity = t.concavity || 1 / 0;
  const e = [];
  if (Pe(i, (s) => {
    e.push([s[0], s[1]]);
  }), !e.length)
    return null;
  const n = Or(e, t.concavity);
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
  static from(t, e = Nr, n = Pr) {
    const s = t.length, r = new Float64Array(s * 2);
    for (let o = 0; o < s; o++) {
      const a = t[o];
      r[2 * o] = e(a), r[2 * o + 1] = n(a);
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
    const { coords: t, _hullPrev: e, _hullNext: n, _hullTri: s, _hullHash: r } = this, o = t.length >> 1;
    let a = 1 / 0, c = 1 / 0, l = -1 / 0, h = -1 / 0;
    for (let E = 0; E < o; E++) {
      const F = t[2 * E], I = t[2 * E + 1];
      F < a && (a = F), I < c && (c = I), F > l && (l = F), I > h && (h = I), this._ids[E] = E;
    }
    const f = (a + l) / 2, d = (c + h) / 2;
    let g = 0, y = 0, _ = 0;
    for (let E = 0, F = 1 / 0; E < o; E++) {
      const I = Ce(f, d, t[2 * E], t[2 * E + 1]);
      I < F && (g = E, F = I);
    }
    const T = t[2 * g], B = t[2 * g + 1];
    for (let E = 0, F = 1 / 0; E < o; E++) {
      if (E === g) continue;
      const I = Ce(T, B, t[2 * E], t[2 * E + 1]);
      I < F && I > 0 && (y = E, F = I);
    }
    let p = t[2 * y], w = t[2 * y + 1], u = 1 / 0;
    for (let E = 0; E < o; E++) {
      if (E === g || E === y) continue;
      const F = Cr(T, B, p, w, t[2 * E], t[2 * E + 1]);
      F < u && (_ = E, u = F);
    }
    let b = t[2 * _], M = t[2 * _ + 1];
    if (u === 1 / 0) {
      for (let I = 0; I < o; I++)
        this._dists[I] = t[2 * I] - t[0] || t[2 * I + 1] - t[1];
      qt(this._ids, this._dists, 0, o - 1);
      const E = new Uint32Array(o);
      let F = 0;
      for (let I = 0, N = -1 / 0; I < o; I++) {
        const X = this._ids[I], m = this._dists[X];
        m > N && (E[F++] = X, N = m);
      }
      this.hull = E.subarray(0, F), this.triangles = new Uint32Array(0), this.halfedges = new Int32Array(0);
      return;
    }
    if (Mt(T, B, p, w, b, M) < 0) {
      const E = y, F = p, I = w;
      y = _, p = b, w = M, _ = E, b = F, M = I;
    }
    const S = Dr(T, B, p, w, b, M);
    this._cx = S.x, this._cy = S.y;
    for (let E = 0; E < o; E++)
      this._dists[E] = Ce(t[2 * E], t[2 * E + 1], S.x, S.y);
    qt(this._ids, this._dists, 0, o - 1), this._hullStart = g;
    let A = 3;
    n[g] = e[_] = y, n[y] = e[g] = _, n[_] = e[y] = g, s[g] = 0, s[y] = 1, s[_] = 2, r.fill(-1), r[this._hashKey(T, B)] = g, r[this._hashKey(p, w)] = y, r[this._hashKey(b, M)] = _, this.trianglesLen = 0, this._addTriangle(g, y, _, -1, -1, -1);
    for (let E = 0, F = 0, I = 0; E < this._ids.length; E++) {
      const N = this._ids[E], X = t[2 * N], m = t[2 * N + 1];
      if (E > 0 && Math.abs(X - F) <= an && Math.abs(m - I) <= an || (F = X, I = m, N === g || N === y || N === _)) continue;
      let k = 0;
      for (let v = 0, C = this._hashKey(X, m); v < this._hashSize && (k = r[(C + v) % this._hashSize], !(k !== -1 && k !== n[k])); v++)
        ;
      k = e[k];
      let x = k, O;
      for (; O = n[x], Mt(X, m, t[2 * x], t[2 * x + 1], t[2 * O], t[2 * O + 1]) >= 0; )
        if (x = O, x === k) {
          x = -1;
          break;
        }
      if (x === -1) continue;
      let D = this._addTriangle(x, N, n[x], -1, -1, s[x]);
      s[N] = this._legalize(D + 2), s[x] = D, A++;
      let P = n[x];
      for (; O = n[P], Mt(X, m, t[2 * P], t[2 * P + 1], t[2 * O], t[2 * O + 1]) < 0; )
        D = this._addTriangle(P, N, O, s[N], -1, s[P]), s[N] = this._legalize(D + 2), n[P] = P, A--, P = O;
      if (x === k)
        for (; O = e[x], Mt(X, m, t[2 * O], t[2 * O + 1], t[2 * x], t[2 * x + 1]) < 0; )
          D = this._addTriangle(O, N, x, -1, s[x], s[O]), this._legalize(D + 2), s[O] = D, n[x] = x, A--, x = O;
      this._hullStart = e[N] = x, n[x] = e[P] = N, n[N] = P, r[this._hashKey(X, m)] = N, r[this._hashKey(t[2 * x], t[2 * x + 1])] = x;
    }
    this.hull = new Uint32Array(A);
    for (let E = 0, F = this._hullStart; E < A; E++)
      this.hull[E] = F, F = n[F];
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
    const { _triangles: e, _halfedges: n, coords: s } = this;
    let r = 0, o = 0;
    for (; ; ) {
      const a = n[t], c = t - t % 3;
      if (o = c + (t + 2) % 3, a === -1) {
        if (r === 0) break;
        t = ue[--r];
        continue;
      }
      const l = a - a % 3, h = c + (t + 1) % 3, f = l + (a + 2) % 3, d = e[o], g = e[t], y = e[h], _ = e[f];
      if (Tr(
        s[2 * d],
        s[2 * d + 1],
        s[2 * g],
        s[2 * g + 1],
        s[2 * y],
        s[2 * y + 1],
        s[2 * _],
        s[2 * _ + 1]
      )) {
        e[t] = _, e[a] = d;
        const B = n[f];
        if (B === -1) {
          let w = this._hullStart;
          do {
            if (this._hullTri[w] === f) {
              this._hullTri[w] = t;
              break;
            }
            w = this._hullPrev[w];
          } while (w !== this._hullStart);
        }
        this._link(t, B), this._link(a, n[o]), this._link(o, f);
        const p = l + (a + 1) % 3;
        r < ue.length && (ue[r++] = p);
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
function Fr(i, t) {
  const e = i / (Math.abs(i) + Math.abs(t));
  return (t > 0 ? 3 - e : 1 + e) / 4;
}
function Ce(i, t, e, n) {
  const s = i - e, r = t - n;
  return s * s + r * r;
}
function Tr(i, t, e, n, s, r, o, a) {
  const c = i - o, l = t - a, h = e - o, f = n - a, d = s - o, g = r - a, y = c * c + l * l, _ = h * h + f * f, T = d * d + g * g;
  return c * (f * T - _ * g) - l * (h * T - _ * d) + y * (h * g - f * d) < 0;
}
function Cr(i, t, e, n, s, r) {
  const o = e - i, a = n - t, c = s - i, l = r - t, h = o * o + a * a, f = c * c + l * l, d = 0.5 / (o * l - a * c), g = (l * h - a * f) * d, y = (o * f - c * h) * d;
  return g * g + y * y;
}
function Dr(i, t, e, n, s, r) {
  const o = e - i, a = n - t, c = s - i, l = r - t, h = o * o + a * a, f = c * c + l * l, d = 0.5 / (o * l - a * c), g = i + (l * h - a * f) * d, y = t + (o * f - c * h) * d;
  return { x: g, y };
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
    const a = i[r], c = t[a];
    for (; ; ) {
      do
        r++;
      while (t[i[r]] < c);
      do
        o--;
      while (t[i[o]] > c);
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
function Nr(i) {
  return i[0];
}
function Pr(i) {
  return i[1];
}
class Xr {
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
class cn extends Xr {
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
function ln(i, t, e, n, s, r, o, a) {
  const c = Mt(i, t, s, r, o, a), l = Mt(e, n, s, r, o, a);
  if (c > 0 && l > 0 || c < 0 && l < 0)
    return !1;
  const h = Mt(s, r, i, t, e, n), f = Mt(o, a, i, t, e, n);
  return h > 0 && f > 0 || h < 0 && f < 0 ? !1 : c === 0 && l === 0 && h === 0 && f === 0 ? !(Math.max(s, o) < Math.min(i, e) || Math.max(i, e) < Math.min(s, o) || Math.max(r, a) < Math.min(t, n) || Math.max(t, n) < Math.min(r, a)) : !0;
}
class $r {
  /**
   * The triangulation object from Delaunator.
   */
  del;
  constructor(t) {
    this.del = t;
  }
}
class fn extends $r {
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
    this.vertMap = new Uint32Array(s).fill(n), this.flips = new cn(r), this.consd = new cn(r);
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
    let a = 0, c = r;
    do {
      if (++a > o)
        throw new Error(
          `Constraining edge [${t}, ${e}] exceeded the iteration limit`
        );
      const f = n[c], d = At(c);
      if (f === e)
        return this.protect(c);
      const g = xt(c), y = n[g];
      if (y === e)
        return this.protect(d), d;
      if (this.intersectSegments(t, e, y, f)) {
        c = g;
        break;
      }
      c = s[d];
    } while (c !== -1 && c !== r);
    let l = c, h = -1;
    for (; c !== -1; ) {
      if (++a > o)
        throw new Error(
          `Constraining edge [${t}, ${e}] exceeded the iteration limit`
        );
      const f = s[c], d = xt(c), g = xt(f), y = At(f);
      if (f === -1)
        throw new Error("Constraining edge exited the hull");
      if (this.consd.has(c))
        throw new Error("Edge intersects already constrained edge");
      if (this.isCollinear(t, e, n[c]) || this.isCollinear(t, e, n[f]))
        throw new Error("Constraining edge intersects point");
      if (!this.intersectSegments(
        n[c],
        n[f],
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
          n[f]
        ))
          c = g;
        else if (this.intersectSegments(
          t,
          e,
          n[y],
          n[g]
        ))
          c = y;
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
      n[g] === e ? (l = g, c = h, h = -1) : this.intersectSegments(
        t,
        e,
        n[y],
        n[g]
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
    const { triangles: n, halfedges: s } = this.del, r = n.length / 3, o = (y, _, T) => {
      const B = t(_), p = t(T);
      return t(y).some((w) => B.includes(w) && p.includes(w));
    }, a = (y) => o(n[y * 3], n[y * 3 + 1], n[y * 3 + 2]), c = (y, _, T, B) => Math.sign(Mt(y[_ * 2], y[_ * 2 + 1], y[T * 2], y[T * 2 + 1], y[B * 2], y[B * 2 + 1])), l = e.map((y) => {
      let _ = 0;
      for (let T = 0; T < r; T++) _ += c(y, n[T * 3], n[T * 3 + 1], n[T * 3 + 2]);
      return _ < 0 ? -1 : 1;
    }), h = (y) => {
      if (this.consd.has(y)) return !1;
      const _ = s[y];
      if (_ === -1) return !1;
      const T = n[y], B = n[At(y)], p = n[xt(y)], w = n[xt(_)];
      return e.every((u, b) => c(u, p, T, w) === l[b] && c(u, w, B, p) === l[b]);
    };
    let f = 0, d = !0;
    for (; d; ) {
      d = !1;
      for (let y = 0; y < r; y++)
        if (a(y))
          for (let _ = 0; _ < 3; _++) {
            const T = y * 3 + _;
            if (!h(T)) continue;
            const B = s[T], p = n[T], w = n[At(T)], u = n[xt(T)], b = n[xt(B)];
            if (!(o(u, p, b) && o(b, w, u))) {
              this.protect(this.flipDiagonal(T)), f++, d = !0;
              break;
            }
          }
    }
    let g = 0;
    for (let y = 0; y < r; y++) a(y) && g++;
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
    const { triangles: e, halfedges: n } = this.del, s = this.flips, r = this.consd, o = n[t], a = xt(t), c = At(t), l = xt(o), h = At(o), f = n[a], d = n[l];
    if (r.has(t))
      throw new Error("Trying to flip a constrained edge");
    return e[t] = e[l], n[t] = d, s.set(t, s.has(l)) || r.set(t, r.has(l)), d !== -1 && (n[d] = t), n[a] = l, e[o] = e[a], n[o] = f, s.set(o, s.has(a)) || r.set(o, r.has(a)), f !== -1 && (n[f] = o), n[l] = a, this.markFlip(t), this.markFlip(c), this.markFlip(o), this.markFlip(h), s.add(a), r.delete(a), s.add(l), r.delete(l), this.updateVert(t), this.updateVert(c), this.updateVert(o), this.updateVert(h), a;
  }
  /**
   * Whether point p1, p2, and p are collinear.
   */
  isCollinear(t, e, n) {
    const s = this.del.coords;
    return Mt(
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
    return Zn(
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
    const r = e[xt(t)], o = e[t], a = e[At(t)], c = e[xt(s)];
    return !this.inCircle(r, o, a, c);
  }
  /**
   * Update the vertex -> incoming edge map.
   */
  updateVert(t) {
    const { triangles: e, halfedges: n } = this.del, s = this.vertMap, r = e[t];
    let o = xt(t), a = n[o];
    for (; a !== -1 && a !== t; )
      o = xt(a), a = n[o];
    return s[r] = o, o;
  }
  /**
   * Whether the segments between vertices intersect.
   */
  intersectSegments(t, e, n, s) {
    const r = this.del.coords;
    return t === n || t === s || e === n || e === s ? !1 : ln(
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
  static intersectSegments = ln;
}
function de(i, t, e) {
  return De(i, t, e).tin;
}
function De(i, t, e, n) {
  if (t || (t = []), typeof i != "object" || i.type !== "FeatureCollection")
    throw "Argument points must be FeatureCollection";
  if (!Array.isArray(t)) throw "Argument points must be Array of Array";
  const s = i.features.map(
    (f) => f.geometry.coordinates
  );
  let r = ve.from(s), o = 0, a;
  if (r.triangles.length !== 0 && (t.length !== 0 || n)) {
    let f = new fn(r);
    try {
      f.constrainAll(t);
    } catch (d) {
      if (!n?.allowUnusableBoundary) throw d;
      return { tin: bt([]), remaining: 0, hasBoundary: !1 };
    }
    n?.boundary && (a = Yr(f, n.boundary), a || (r = ve.from(s), f = new fn(r, t))), n && ({ remaining: o } = f.forbidGroupTriangles(
      n.groupsOf,
      n.planes
    ), o -= a?.size ?? 0);
  }
  const c = [];
  for (let f = 0; f < r.triangles.length; f += 3)
    a?.has(f / 3) || c.push([r.triangles[f], r.triangles[f + 1], r.triangles[f + 2]]);
  const l = ["a", "b", "c"];
  return { tin: bt(
    c.map((f) => {
      const d = {}, g = f.map((y, _) => {
        const T = i.features[y], B = T.geometry.coordinates, p = [B[0], B[1]];
        return B.length === 3 ? p[2] = B[2] : d[l[_]] = T.properties[e], p;
      });
      return g[3] = g[0], ne([g], d);
    })
  ), remaining: o, hasBoundary: a !== void 0 };
}
function Yr(i, t) {
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
function Jt(i, t, e) {
  return Pt(i, { target: { geom: t, index: e } });
}
function Qt(i) {
  return Pt(i.properties.target.geom, {
    target: {
      geom: i.geometry.coordinates,
      index: i.properties.target.index
    }
  });
}
function hn(i, t) {
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
    }, d = bt([
      ne([h], f)
    ]);
    return [l, d];
  }).reduce(
    (s, r) => (s[0].push(r[0]), s[1].push(r[1]), s),
    [[], []]
  );
}
const Rr = [0.1, 0.15, 0.225, 0.34, 0.5];
function Lr(i, t) {
  return t ? i.hasBoundary !== t.hasBoundary ? i.hasBoundary : i.diagnostics.boundaryTriangleFlips < t.diagnostics.boundaryTriangleFlips : !0;
}
function un(i, t, e) {
  return Math.sign(Mt(i[0], i[1], t[0], t[1], e[0], e[1]));
}
function ye(i, t = -1) {
  let e = 0;
  for (const n of i.features) {
    const { a: s, b: r, c: o } = n.properties;
    if (![s, r, o].some(
      ({ index: f }) => typeof f == "string" && f.startsWith("b")
    ))
      continue;
    const [a, c, l] = n.geometry.coordinates[0];
    un(a, c, l) * un(s.geom, r.geom, o.geom) * t <= 0 && e++;
  }
  return e;
}
function dn(i, t, e) {
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
function Vr(i, t) {
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
function pn(i, t, e, n, s) {
  const { minx: r, maxx: o, miny: a, maxy: c, centroid: l } = i, h = o - r, f = c - a, d = e.forw.length, g = Array.from({ length: d }, () => []);
  let y = 1;
  for (const [p, w] of e.edges)
    p < n && g[p].push(y), g[w].push(y), w < n && y++;
  const _ = [0], T = (p) => p >= d ? _ : g[p];
  let B;
  for (const p of Rr) {
    const w = Vr(
      t(
        {
          ...i,
          minx: r - p * h,
          maxx: o + p * h,
          miny: a - p * f,
          maxy: c + p * f
        },
        !0
      ),
      e
    );
    if (s && (w.length < 4 || !w.every(({ bakw: D }) => D.every(Number.isFinite)))) continue;
    const u = w.map(
      ({ forw: D, bakw: P }, v) => Jt(D, P, `b${v}`)
    ), b = bt([...e.forw, ...u]), M = bt([
      ...e.bakw,
      ...u.map(Qt)
    ]), S = [b, M].map(
      ({ features: D }) => Float64Array.from(
        D.flatMap(
          ({
            geometry: {
              coordinates: [P, v]
            }
          }) => [P, v]
        )
      )
    ), E = s !== void 0 || dn(
      w.map((D) => D.forw),
      l.forw,
      -1
    ) && dn(
      w.map((D) => D.bakw),
      l.bakw,
      1
    ) ? w.map((D, P) => [
      d + P,
      d + (P + 1) % w.length
    ]) : void 0, F = { groupsOf: T, planes: S, boundary: E, allowUnusableBoundary: s !== void 0 }, I = De(
      b,
      e.edges,
      "target",
      F
    ), N = De(
      M,
      e.edges,
      "target",
      F
    ), X = I.tin, m = N.tin, k = s?.orientation ?? -1, x = ye(X, k) + ye(m, k), O = {
      vertices: w,
      forw: X,
      bakw: m,
      diagnostics: {
        margin: p,
        boundaryTriangleFlips: x,
        remainingForbiddenTriangles: I.remaining + N.remaining
      },
      hasMapBoundary: I.hasBoundary,
      hasBoundary: I.hasBoundary && N.hasBoundary
    };
    if (s) {
      if (s.accept(O)) return O;
      continue;
    }
    if (x === 0 && O.hasBoundary)
      return O;
    Lr(O, B) && (B = O);
  }
  return B;
}
const qr = 256 * Number.EPSILON;
function jr(i, t) {
  const e = [i, t].map((s) => {
    const r = s.map((a, c, l) => {
      if (c === 0) return 0;
      const h = l[c - 1];
      return Math.sqrt(
        Math.pow(a[0] - h[0], 2) + Math.pow(a[1] - h[1], 2)
      );
    }), o = r.reduce((a, c, l) => l === 0 ? [0] : (a.push(a[l - 1] + c), a), []);
    return o.map((a, c, l) => {
      const h = a / l[l.length - 1];
      return [s[c], r[c], o[c], h];
    });
  }), n = [];
  return e.forEach((s, r) => {
    const o = e[r ? 0 : 1];
    s.forEach((a, c) => {
      if (c === 0 || c === s.length - 1 || a[4] === "handled")
        return;
      const l = a[0], h = a[3];
      let f, d = 1 / 0;
      for (let g = 1; g < o.length - 1; g++) {
        const y = o[g];
        if (y[4] === "handled") continue;
        const _ = Math.abs(y[3] - h);
        _ <= qr && _ < d && (f = y, d = _);
      }
      if (f) {
        f[4] = "handled", a[4] = "handled", n.push(
          r === 0 ? [l, f[0], h] : [f[0], l, h]
        );
        return;
      }
      for (let g = 0; g < o.length - 1; g++) {
        const y = o[g], _ = o[g + 1], T = y[3], B = _[3];
        if (T < h && B > h) {
          const p = (h - T) / (B - T), w = [
            (_[0][0] - y[0][0]) * p + y[0][0],
            (_[0][1] - y[0][1]) * p + y[0][1]
          ];
          n.push(
            r === 0 ? [l, w, h] : [w, l, h]
          );
          return;
        }
      }
    });
  }), n.sort((s, r) => s[2] - r[2]);
}
function Ur(i, t) {
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
function zr(i) {
  let t = 1 / 0, e = 0, n = 0;
  return i.forEach((s) => {
    const { forw: r, bakw: o } = s, a = Math.hypot(r[0], r[1]), c = Math.hypot(o[0], o[1]);
    if (c === 0) return;
    const l = a / c, h = Math.atan2(r[0], r[1]) - Math.atan2(o[0], o[1]);
    t = Math.min(t, l), e += Math.cos(h), n += Math.sin(h);
  }), isFinite(t) ? [t, Math.atan2(n, e)] : [1, 0];
}
function Gr(i, t, e) {
  const { perQuad: n, aggregate: s } = Ur(i, t), r = n.every((c) => c.length > 0), a = (e === "birdeye" ? r ? n : [s] : [s]).map((c) => zr(c));
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
  const o = n[0] - e[0], a = n[1] - e[1], c = e[0] - i[0], l = e[1] - i[1], h = s * a - r * o;
  if (Math.abs(h) < 1e-12) return null;
  const f = (c * a - l * o) / h, d = (c * r - l * s) / h;
  return f <= 1e-10 || d < -1e-10 || d > 1 + 1e-10 ? null : { t: f, point: [i[0] + f * s, i[1] + f * r] };
}
function Wr(i, t, e) {
  const n = e.length;
  let s = -1 / 0, r = null;
  for (let o = 0; o < n; o++) {
    const a = (o + 1) % n, c = Qr(
      i,
      t,
      e[o].bakw,
      e[a].bakw
    );
    c && c.t > s && (s = c.t, r = c.point);
  }
  return r;
}
function mn(i, t) {
  const n = Math.atan2(i[0] - t[0], i[1] - t[1]) * (180 / Math.PI);
  return n < 0 ? n + 360 : n;
}
function gn(i, t, e, n, s, r) {
  const o = t[0] - i[0], a = t[1] - i[1];
  if (o === 0 && a === 0) return null;
  const c = [];
  if (o !== 0)
    for (const h of [e, n]) {
      const f = (h - i[0]) / o;
      if (f > 0) {
        const d = i[1] + f * a;
        d >= s && d <= r && c.push({ t: f, x: h, y: d });
      }
    }
  if (a !== 0)
    for (const h of [s, r]) {
      const f = (h - i[1]) / a;
      if (f > 0) {
        const d = i[0] + f * o;
        d >= e && d <= n && c.push({ t: f, x: d, y: h });
      }
    }
  if (c.length === 0) return null;
  c.sort((h, f) => h.t - f.t);
  const l = c[0];
  return [l.x, l.y];
}
function wn(i, t, e) {
  const n = i.length, s = new Array(n).fill(1);
  for (const r of t)
    for (let o = 0; o < n; o++) {
      const a = (o + 1) % n, c = Ve([i[o].bakw, i[a].bakw]), l = Ve([e.bakw, r.bakw]), h = gr(c, l);
      if (h.features.length > 0 && h.features[0].geometry) {
        const f = h.features[0], d = Math.sqrt(
          Math.pow(r.bakw[0] - e.bakw[0], 2) + Math.pow(r.bakw[1] - e.bakw[1], 2)
        ), g = Math.sqrt(
          Math.pow(f.geometry.coordinates[0] - e.bakw[0], 2) + Math.pow(f.geometry.coordinates[1] - e.bakw[1], 2)
        ), y = d / g;
        y > s[o] && (s[o] = y), y > s[a] && (s[a] = y);
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
  const { convexBuf: s, centroid: r, allGcps: o, minx: a, maxx: c, miny: l, maxy: h } = i, f = n ? void 0 : Gr(s, r, t), g = [
    [a, l],
    [c, l],
    [c, h],
    [a, h]
  ].map((S) => ({
    forw: S,
    bakw: n ? n(S) : Jr(
      S,
      r,
      f[Kr(S, r.forw)]
    )
  }));
  if (g.sort(
    (S, A) => Math.atan2(S.forw[0] - r.forw[0], S.forw[1] - r.forw[1]) - Math.atan2(A.forw[0] - r.forw[0], A.forw[1] - r.forw[1])
  ), n || wn(g, o, r), !e) return g;
  const y = 4, _ = g.map(
    (S) => Math.atan2(S.forw[0] - r.forw[0], S.forw[1] - r.forw[1])
  ), T = g.map(
    (S) => Math.atan2(
      S.bakw[0] - r.bakw[0],
      -(S.bakw[1] - r.bakw[1])
    )
  );
  function B(S) {
    for (let A = 0; A < y; A++) {
      const E = (A + 1) % y, F = _[A], I = A < y - 1 ? _[E] : _[E] + 2 * Math.PI;
      let N = S;
      for (; N < F; ) N += 2 * Math.PI;
      for (; N >= F + 2 * Math.PI; ) N -= 2 * Math.PI;
      if (N >= F && N < I)
        return { i: A, j: E, frac: (N - F) / (I - F) };
    }
    return { i: 0, j: 1, frac: 0 };
  }
  function p(S) {
    const { i: A, j: E, frac: F } = B(S), I = T[A];
    let X = T[E] - I;
    for (; X > Math.PI; ) X -= 2 * Math.PI;
    for (; X < -Math.PI; ) X += 2 * Math.PI;
    return I + F * X;
  }
  const w = new Set(
    g.map(
      (S) => Math.floor(mn(S.forw, r.forw) / 10) % 36
    )
  ), u = o.map((S) => ({
    forw: S.forw,
    bakw: S.bakw,
    angleDeg: mn(S.forw, r.forw),
    forwDist: Math.hypot(S.forw[0] - r.forw[0], S.forw[1] - r.forw[1])
  })), b = [];
  for (let S = 0; S < 36; S++) {
    if (w.has(S)) continue;
    const A = S * 10, E = u.filter(
      (x) => x.angleDeg >= A && x.angleDeg < A + 10
    );
    let F = null;
    if (E.length > 0) {
      const x = E.reduce((O, D) => D.forwDist > O.forwDist ? D : O);
      F = gn(r.forw, x.forw, a, c, l, h);
    }
    if (!F) {
      const x = (A + 5) % 360 * (Math.PI / 180), O = [
        r.forw[0] + Math.sin(x),
        r.forw[1] + Math.cos(x)
      ];
      F = gn(r.forw, O, a, c, l, h);
    }
    if (!F) continue;
    if (n) {
      b.push({ forw: F, bakw: n(F) });
      continue;
    }
    const I = [F[0] - r.forw[0], F[1] - r.forw[1]], N = Math.atan2(I[0], I[1]), X = p(N), m = [
      r.bakw[0] + Math.sin(X),
      r.bakw[1] - Math.cos(X)
    ], k = Wr(r.bakw, m, g);
    k && b.push({ forw: F, bakw: k });
  }
  const M = [...g, ...b];
  return M.sort(
    (S, A) => Math.atan2(S.forw[0] - r.forw[0], S.forw[1] - r.forw[1]) - Math.atan2(A.forw[0] - r.forw[0], A.forw[1] - r.forw[1])
  ), n || wn(M, o, r), M;
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
function Di(i) {
  return Fn(i, 1 / 0);
}
const vn = 1e5, ei = 16;
function Fn(i, t) {
  return ni(i), new ri(i).findSegmentIntersections(t).map(
    (s) => Pt([s.x, s.y])
  );
}
function ni(i) {
  for (let t = 0, e = i.length; t < e; t++) {
    const n = i[t];
    te(n) || Rt(
      "findIntersections() received invalid coordinates:",
      `line=${t}`,
      `points=${n}`
    );
    for (let s = 0, r = n.length; s < r; s++) {
      const o = n[s];
      (!te(o) || !Number.isFinite(o[0]) || !Number.isFinite(o[1])) && Rt(
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
    (r != this._xx.length || this._xx.length != this._yy.length) && Rt("ArcCollection#initXYData() Counting error"), this.initBounds(), this._arcIter = new Mi(this._xx, this._yy);
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
    const s = n.length, r = new Float64Array(s * 4), o = new ee();
    let a = 0, c, l, h;
    for (let f = 0; f < s; f++)
      c = n[f], c > 0 && (l = f * 4, h = Si(t, e, a, c), r[l++] = h[0], r[l++] = h[1], r[l++] = h[2], r[l] = h[3], a += c, o.mergeBounds(h));
    return {
      bb: r,
      bounds: o
    };
  }
  getBounds() {
    return this._allBounds ? this._allBounds.clone() : new ee();
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
    const e = this.getBounds(), n = e.ymin || 0, s = (e.ymax || 0) - n, r = this.calcSegmentIntersectionStripeCount(), o = new Uint32Array(r), a = r > 1 ? (w) => Math.floor((r - 1) * (w - n) / s) : () => 0, c = r + 1;
    let l;
    this.forEachSegment(
      (w, u, b, M) => {
        let S = a(M[w]);
        const A = a(M[u]);
        let E = 0;
        for (; o[S] = o[S] + 2, S != A; )
          E++, E > c && Rt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${r}`,
            `s1=${S}`,
            `s2=${A}`
          ), S += A > S ? 1 : -1;
      }
    );
    const h = this.getUint32Array(oi(o));
    let f = 0;
    const d = [];
    ai(o, (w) => {
      const u = f;
      f += w, d.push(h.subarray(u, f));
    }), ci(o, 0), this.forEachSegment(
      (w, u, b, M) => {
        let S = a(M[w]);
        const A = a(M[u]);
        let E, F, I = 0;
        for (; E = o[S], o[S] = E + 2, F = d[S], F[E] = w, F[E + 1] = u, S != A; )
          I++, I > c && Rt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${r}`,
            `s1=${S}`,
            `s2=${A}`
          ), S += A > S ? 1 : -1;
      }
    );
    const g = this.getVertexData(), y = t * ei;
    let _ = 0;
    const T = /* @__PURE__ */ new Set(), B = /* @__PURE__ */ new Map(), p = (w) => {
      _++;
      const u = _i(w);
      return T.has(u) || (T.add(u), B.set(`${w.x}:${w.y}`, w)), B.size >= t || _ >= y;
    };
    if (g.xx && g.yy)
      for (l = 0; l < r && !li(d[l], g.xx, g.yy, p); l++)
        ;
    return Array.from(B.values());
  }
}
function Rt(...i) {
  const t = i.join(" ");
  throw new Error(t);
}
function te(i) {
  return i ? si(i) ? !0 : ii(i) ? !1 : i.length === 0 ? !0 : i.length > 0 : !1;
}
function ii(i) {
  return i != null && i.toString === String.prototype.toString;
}
function si(i) {
  return Array.isArray(i);
}
function oi(i, t) {
  te(i) || Rt("utils.sum() expects an array, received:", i);
  let e = 0, n;
  for (let s = 0, r = i.length; s < r; s++)
    n = i[s], n && (e += n);
  return e;
}
function ai(i, t, e) {
  if (!te(i))
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
  let r, o, a, c, l, h, f, d, g, y, _, T, B, p, w, u, b;
  for (yi(t, i), u = 0; u < s; ) {
    for (r = i[u], o = i[u + 1], l = t[r], h = t[o], g = e[r], y = e[o], b = u; b < s && (b += 2, a = i[b], f = t[a], !(h < f)); ) {
      if (_ = e[a], c = i[b + 1], d = t[c], T = e[c], g >= _) {
        if (g > T && y > _ && y > T) continue;
      } else if (g < T && y < _ && y < T) continue;
      if (!(r == a || r == c || o == a || o == c) && (B = fi(
        l,
        g,
        h,
        y,
        f,
        _,
        d,
        T
      ), B && (p = [r, o], w = [a, c], n(bn(B, p, w, t, e)) || B.length == 4 && n(bn(B.slice(2), p, w, t, e)))))
        return !0;
    }
    u += 2;
  }
  return !1;
}
function fi(i, t, e, n, s, r, o, a) {
  const c = hi(i, t, e, n, s, r, o, a);
  let l = null;
  return c && (l = ui(i, t, e, n, s, r, o, a), l ? vi(i, t, e, n, s, r, o, a) && (l = null) : l = wi(i, t, e, n, s, r, o, a)), l;
}
function hi(i, t, e, n, s, r, o, a) {
  return Wt(i, t, e, n, s, r) * Wt(i, t, e, n, o, a) <= 0 && Wt(s, r, o, a, i, t) * Wt(s, r, o, a, e, n) <= 0;
}
function Wt(i, t, e, n, s, r) {
  return Tn(i - s, t - r, e - s, n - r);
}
function Tn(i, t, e, n) {
  return i * n - t * e;
}
function ui(i, t, e, n, s, r, o, a) {
  let c = pe(i, t, e, n, s, r, o, a), l;
  return c && (l = pi(c[0], c[1], i, t, e, n, s, r, o, a), l == 1 ? c = pe(e, n, i, t, s, r, o, a) : l == 2 ? c = pe(s, r, o, a, i, t, e, n) : l == 3 && (c = pe(o, a, s, r, i, t, e, n))), c && gi(c, i, t, e, n, s, r, o, a), c;
}
function pe(i, t, e, n, s, r, o, a) {
  const c = Tn(e - i, n - t, o - s, a - r), l = 1e-18;
  let h;
  if (c === 0) return null;
  const f = Wt(s, r, o, a, i, t) / c;
  return c <= l && c >= -l ? h = di(i, t, e, n, s, r, o, a) : h = [i + f * (e - i), t + f * (n - t)], h;
}
function di(i, t, e, n, s, r, o, a) {
  let c = null;
  return !It(i, s, o) && !It(t, r, a) ? c = [i, t] : !It(e, s, o) && !It(n, r, a) ? c = [e, n] : !It(s, i, e) && !It(r, t, n) ? c = [s, r] : !It(o, i, e) && !It(a, t, n) && (c = [o, a]), c;
}
function It(i, t, e) {
  let n;
  return t < e ? n = i < t || i > e : t > e ? n = i > t || i < e : n = i != t, n;
}
function pi(i, t, ...e) {
  let n = -1, s = 1 / 0, r;
  for (let o = 0, a = 0, c = e.length; a < c; o++, a += 2)
    r = mi(i, t, e[a], e[a + 1]), r < s && (s = r, n = o);
  return n;
}
function mi(i, t, e, n) {
  const s = i - e, r = t - n;
  return s * s + r * r;
}
function gi(i, t, e, n, s, r, o, a, c) {
  let l = i[0], h = i[1];
  l = me(l, t, n), l = me(l, r, a), h = me(h, e, s), h = me(h, o, c), i[0] = l, i[1] = h;
}
function me(i, t, e) {
  let n;
  return It(i, t, e) && (n = Math.abs(i - t) < Math.abs(i - e) ? t : e, i = n), i;
}
function wi(i, t, e, n, s, r, o, a) {
  const c = Math.min(i, e, s, o), l = Math.max(i, e, s, o), h = Math.min(t, n, r, a), f = Math.max(t, n, r, a), d = f - h > l - c;
  let g = [];
  return (d ? Nt(t, h, f) : Nt(i, c, l)) && g.push(i, t), (d ? Nt(n, h, f) : Nt(e, c, l)) && g.push(e, n), (d ? Nt(r, h, f) : Nt(s, c, l)) && g.push(s, r), (d ? Nt(a, h, f) : Nt(o, c, l)) && g.push(o, a), (g.length != 2 && g.length != 4 || g.length == 4 && g[0] == g[2] && g[1] == g[3]) && (g = null), g;
}
function vi(i, t, e, n, s, r, o, a) {
  return i == s && t == r || i == o && t == a || e == s && n == r || e == o && n == a;
}
function Nt(i, t, e) {
  return i > t && i < e;
}
function yi(i, t) {
  bi(i, t), Cn(i, t, 0, t.length - 2);
}
function bi(i, t) {
  for (let e = 0, n = t.length; e < n; e += 2)
    i[t[e]] > i[t[e + 1]] && xi(t, e, e + 1);
}
function xi(i, t, e) {
  const n = i[t];
  i[t] = i[e], i[e] = n;
}
function Cn(i, t, e, n) {
  let s = e, r = n, o, a;
  for (; s < n; ) {
    for (o = i[t[e + n >> 2 << 1]]; s <= r; ) {
      for (; i[t[s]] < o; ) s += 2;
      for (; i[t[r]] > o; ) r -= 2;
      s <= r && (a = t[s], t[s] = t[r], t[r] = a, a = t[s + 1], t[s + 1] = t[r + 1], t[r + 1] = a, s += 2, r -= 2);
    }
    if (r - e < 40 ? yn(i, t, e, r) : Cn(i, t, e, r), n - s < 40) {
      yn(i, t, s, n);
      return;
    }
    e = s, r = n;
  }
}
function yn(i, t, e, n) {
  let s, r;
  for (let o = e + 2; o <= n; o += 2) {
    s = t[o], r = t[o + 1];
    let a;
    for (a = o - 2; a >= e && i[s] < i[t[a]]; a -= 2)
      t[a + 2] = t[a], t[a + 3] = t[a + 1];
    t[a + 2] = s, t[a + 3] = r;
  }
}
function bn(i, t, e, n, s) {
  const r = i[0], o = i[1];
  t = xn(r, o, t[0], t[1], n, s), e = xn(r, o, e[0], e[1], n, s);
  const a = t[0] < e[0] ? t : e, c = a == t ? e : t;
  return { x: r, y: o, a, b: c };
}
function xn(i, t, e, n, s, r) {
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
  let o, a, c, l, h, f;
  if (r > 0)
    c = h = i[s], l = f = t[s];
  else return [void 0, void 0, void 0, void 0];
  for (s++; s < r; s++)
    o = i[s], a = t[s], o < c && (c = o), o > h && (h = o), a < l && (l = a), a > f && (f = a);
  return [c, l, h, f];
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
  setBounds(t, e, n, s) {
    let r, o, a, c;
    if (arguments.length == 1)
      if (te(t)) {
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
    return t instanceof ee ? (n = t.xmin, s = t.ymin, r = t.xmax, o = t.ymax) : e.length == 3 ? (n = t, s = e[0], r = e[1], o = e[2]) : t.length == 4 ? (n = t[0], s = t[1], r = t[2], o = t[3]) : Rt("Bounds#mergeBounds() invalid argument:", t), this.xmin === void 0 ? this.setBounds(n, s, r, o) : (n < this.xmin && (this.xmin = n), s < this.ymin && (this.ymin = s), r > this.xmax && (this.xmax = r), o > this.ymax && (this.ymax = o)), this;
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
function _n(i, t, e) {
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
  const o = i ? 0 : 1, a = 1 - o, c = e[o], l = e[a];
  if (!c || !l) return !1;
  const h = yt(l.geom);
  let f = !1, d = !1;
  for (let g = 0; g <= 1; g++) {
    const y = n[g];
    if (!y) continue;
    const _ = [String(y.prop.index), String(c.prop.index)].sort().join("-"), T = s[_];
    if (!T || T.length < 2) continue;
    const B = T.find(
      (I) => I.bakw !== r[o].bakw
    );
    if (!B) continue;
    const w = Ht(B.bakw).find(
      (I) => String(I.prop.index) !== String(y.prop.index) && String(I.prop.index) !== String(c.prop.index)
    );
    if (!w) continue;
    f = !0;
    const u = yt(w.geom), b = yt(y.geom), M = yt(c.geom), S = M[0] - b[0], A = M[1] - b[1], E = S * (h[1] - b[1]) - A * (h[0] - b[0]), F = S * (u[1] - b[1]) - A * (u[0] - b[0]);
    if (E * F > 0) {
      d = !0;
      break;
    }
  }
  return f && !d;
}
function Ii(i, t, e, n) {
  if (!i && !t) return !1;
  if (e[0] && e[1] && n[0] && n[1]) {
    const s = n.map((h) => yt(h.geom)), r = e.map((h) => yt(h.geom)), o = s[1][0] - s[0][0], a = s[1][1] - s[0][1], c = o * (r[0][1] - s[0][1]) - a * (r[0][0] - s[0][0]), l = o * (r[1][1] - s[0][1]) - a * (r[1][0] - s[0][0]);
    return c * l < 0;
  }
  return !1;
}
function Bi(i, t, e, n) {
  const s = ki(e, n), r = /* @__PURE__ */ new Set();
  let o = !1;
  for (let a = 0; a < Ei; a++) {
    let c = !1;
    for (const l of Object.keys(t)) {
      if (r.has(l)) continue;
      r.add(l);
      const h = t[l];
      if (!h || h.length < 2) continue;
      const f = l.split("-");
      if (f.length !== 2 || s.has(l)) continue;
      const d = Ht(h[0].bakw), g = Ht(h[1].bakw), y = Ht(h[0].forw), _ = Ht(h[1].forw), T = f.map(
        (v) => d.find((C) => `${C.prop.index}` === v) || g.find((C) => `${C.prop.index}` === v)
      ), B = f.map(
        (v) => y.find((C) => `${C.prop.index}` === v) || _.find((C) => `${C.prop.index}` === v)
      );
      if (T.some((v) => !v) || B.some((v) => !v))
        continue;
      const p = [d, g].map(
        (v) => v.find((C) => !f.includes(`${C.prop.index}`))
      ), w = [y, _].map(
        (v) => v.find((C) => !f.includes(`${C.prop.index}`))
      );
      if (p.some((v) => !v) || w.some((v) => !v))
        continue;
      const u = h[0].bakw.geometry.coordinates[0].slice(0, 3).map((v) => yt(v)), b = h[1].bakw.geometry.coordinates[0].slice(0, 3).map((v) => yt(v)), M = h[0].forw.geometry.coordinates[0].slice(0, 3).map((v) => yt(v)), S = h[1].forw.geometry.coordinates[0].slice(0, 3).map((v) => yt(v)), A = ge(u), E = ge(b), F = ge(M), I = ge(S), N = Ai(
        A,
        E,
        p,
        T,
        t,
        h
      ), X = Ii(
        F,
        I,
        p,
        T
      );
      if (!(N || X || Mn(
        yt(p[0].geom),
        b
      ) || Mn(
        yt(p[1].geom),
        u
      )))
        continue;
      const k = B.map(
        (v) => yt(v.geom)
      ), x = w.map(
        (v) => yt(v.geom)
      ), O = Oi([
        ...k,
        ...x
      ]), D = Fi(O), P = Sn(
        k[0],
        k[1],
        x[0]
      ) + Sn(
        k[0],
        k[1],
        x[1]
      );
      Ne(D, P) && (_n(t, h[0], i), _n(t, h[1], i), T.forEach((v) => {
        if (!v) return;
        const C = [
          v.geom,
          p[0].geom,
          p[1].geom,
          v.geom
        ], $ = {
          a: v.prop,
          b: p[0].prop,
          c: p[1].prop
        }, Y = ne([C], $), L = An(Y);
        Dn(t, {
          forw: L,
          bakw: Y
        }, i);
      }), c = !0, o = !0);
    }
    if (!c) break;
  }
  return o;
}
function yt(i) {
  return [i[0], i[1]];
}
function Mn(i, t) {
  const [e, n] = t[0], [s, r] = t[1], [o, a] = t[2], c = o - e, l = a - n, h = s - e, f = r - n, d = i[0] - e, g = i[1] - n, y = c * c + l * l, _ = c * h + l * f, T = c * d + l * g, B = h * h + f * f, p = h * d + f * g, w = y * B - _ * _;
  if (w === 0) return !1;
  const u = 1 / w, b = (B * T - _ * p) * u, M = (y * p - _ * T) * u, S = 1e-9;
  return b >= -S && M >= -S && b + M <= 1 + S;
}
function Oi(i) {
  const t = i.map((o) => o.slice()).filter(
    (o, a, c) => c.findIndex(
      (l) => Ne(l[0], o[0]) && Ne(l[1], o[1])
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
function Fi(i) {
  if (i.length < 3) return 0;
  let t = 0;
  for (let e = 0; e < i.length; e++) {
    const [n, s] = i[e], [r, o] = i[(e + 1) % i.length];
    t += n * o - r * s;
  }
  return Math.abs(t) / 2;
}
function Sn(i, t, e) {
  return Math.abs(
    (i[0] * (t[1] - e[1]) + t[0] * (e[1] - i[1]) + e[0] * (i[1] - t[1])) / 2
  );
}
function Ne(i, t, e = 1e-9) {
  return Math.abs(i - t) <= e;
}
const kn = 2.00704, En = 3.00001;
class lt extends Yn {
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
      Rn(t.worldFile), this.requestedWorldFile = { ...t.worldFile };
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
    this.edges = Ln(t), this.edgeNodes = void 0, this.tins = void 0, this.indexedTins = void 0;
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
    o.push(t[0]), this.boundsPolygon = ne([o]), this.xy = [e, s], this.wh = [n - e, r - s], this.vertexMode = lt.VERTEX_PLAIN, this.tins = void 0, this.indexedTins = void 0;
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
  calculateStrictTin(t = vn) {
    const e = this.tins.forw.features.map(
      (o) => An(o)
    );
    this.tins.bakw = bt(e);
    const n = {};
    this.tins.forw.features.forEach((o, a) => {
      const c = this.tins.bakw.features[a];
      Dn(n, { forw: o, bakw: c });
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
      o.unshift(this.points[r[0]][0]), o.push(this.points[r[1]][0]), a.unshift(this.points[r[0]][1]), a.push(this.points[r[1]][1]), jr(o, a).map((c, l, h) => {
        this.edgeNodes[n] = [
          c[0],
          c[1]
        ];
        const f = Jt(
          c[0],
          c[1],
          `e${n}`
        );
        n++, t.forw.push(f), t.bakw.push(Qt(f)), l === 0 ? e.push([r[0], t.forw.length - 1]) : e.push([
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
    if (!this.points.reduce((c, l) => c && (r ? Be(l[0], r) : l[0][0] >= t && l[0][0] <= e && l[0][1] >= n && l[0][1] <= s), !0))
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
    let s, r, o, a, c;
    if (e) {
      if (this.bounds) {
        const I = this.boundsPolygon;
        if (!I) throw new Error("Internal error: bounds is set but boundsPolygon is missing");
        if (!this.points.every(
          (X) => Be(X[0], I)
        )) throw "SOME POINTS OUTSIDE";
      }
      s = this.generatePointsSet(), { minx: r, maxx: o, miny: a, maxy: c } = this.computeGcpBbox();
    } else {
      const I = this.validateAndPrepareInputs();
      s = I.pointsSet, r = I.minx, o = I.maxx, a = I.miny, c = I.maxy;
    }
    const l = {
      forw: bt(s.forw),
      bakw: bt(s.bakw)
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
    const d = yr(l.forw), g = on(l.forw);
    if (!g) throw "TOO LINEAR2";
    const y = {}, _ = g.geometry.coordinates[0];
    let T;
    try {
      T = _.map((I) => ({
        forw: I,
        bakw: ie(Pt(I), h)
      })), T.forEach((I) => {
        y[`${I.forw[0]}:${I.forw[1]}`] = I;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const B = on(l.bakw);
    if (!B) throw "TOO LINEAR2";
    const p = B.geometry.coordinates[0];
    try {
      T = p.map((I) => ({
        bakw: I,
        forw: ie(Pt(I), f)
      })), T.forEach((I) => {
        y[`${I.forw[0]}:${I.forw[1]}`] = I;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    let w;
    if (e) {
      const I = d.geometry.coordinates, N = h.features.find(
        (X) => Be(
          Pt(I),
          X
        )
      );
      if (N) {
        const X = N.geometry.coordinates[0], m = N.properties.a.geom, k = N.properties.b.geom, x = N.properties.c.geom;
        w = {
          forw: [
            (X[0][0] + X[1][0] + X[2][0]) / 3,
            (X[0][1] + X[1][1] + X[2][1]) / 3
          ],
          bakw: [
            (m[0] + k[0] + x[0]) / 3,
            (m[1] + k[1] + x[1]) / 3
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
      bakw: Qt(u)
    };
    const b = [
      ...this.points.map((I) => ({ forw: I[0], bakw: I[1] })),
      ...(this.edgeNodes ?? []).map((I) => ({ forw: I[0], bakw: I[1] }))
    ], M = {
      convexBuf: y,
      centroid: w,
      allGcps: b,
      minx: r,
      maxx: o,
      miny: a,
      maxy: c
    };
    if (n) {
      this.stateTriangle = void 0;
      const I = this.yaxisMode === lt.YAXIS_FOLLOW, N = I ? 1 : -1, X = pn(
        M,
        (m) => ti(m, (k) => {
          const [x, O] = Vn(n, k);
          return [x, I ? -O : O];
        }),
        s,
        this.points.length,
        {
          orientation: N,
          accept: (m) => m.hasMapBoundary ? (this.buildTin(s, m.vertices, t, m), (this.strict_status !== lt.STATUS_LOOSE || m.hasBoundary) && ye(this.tins.forw, N) === 0 && ye(this.tins.bakw, N) === 0) : !1
        }
      );
      if (X) {
        this.compiledOuter = {
          outerTransform: "worldFile",
          worldFile: n,
          vertices_points: X.vertices.map(({ forw: D, bakw: P }) => [D, P])
        };
        const { centroid: m, xy: k, wh: x, kinks: O } = this;
        super.setCompiled(this.getCompiled()), Object.assign(this, { centroid: m, xy: k, wh: x, kinks: O }), this.lastBoundaryDiagnostics = {
          ...X.diagnostics,
          requestedOuterTransform: "worldFile",
          outerTransform: "worldFile"
        };
        return;
      }
      this.compiledOuter = { outerTransform: "extrapolate" }, this.outerTransform = "extrapolate", this.worldFile = void 0;
    }
    const S = this.vertexMode === lt.VERTEX_BIRDEYE ? Zr : Hr, A = e ? pn(M, S, s, this.points.length) : void 0, E = A?.vertices ?? S(M, !1), F = this.buildTin(s, E, t, A);
    this.vertices_params = {
      forw: hn(F.forw, this.centroid.forw),
      bakw: hn(F.bakw, this.centroid.bakw)
    }, this.addIndexedTin(), this.pointsWeightBuffer = {}, this.lastBoundaryDiagnostics = A?.diagnostics, n && this.lastBoundaryDiagnostics && (this.lastBoundaryDiagnostics = {
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
      const a = e[o].forw, c = e[o].bakw, l = Jt(a, c, `b${o}`), h = Qt(l);
      r.forw.push(l), r.bakw.push(h);
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
      n === lt.MODE_AUTO ? 1 : vn
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
  Di as findIntersections,
  kn as format_version,
  Dn as insertSearchIndex,
  hn as vertexCalc
};
