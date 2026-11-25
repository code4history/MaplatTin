import { counterTri as An, Transform as Yn, validateWorldFile as Rn, normalizeEdges as Ln, transformArr as ie, rotateVerticesTriangle as Le, worldFileToCrs as Vn } from "@maplat/transform";
function Zt(i, t, e = {}) {
  const n = { type: "Feature" };
  return (e.id === 0 || e.id) && (n.id = e.id), e.bbox && (n.bbox = e.bbox), n.properties = t || {}, n.geometry = i, n;
}
function Nt(i, t, e = {}) {
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
function Ne(i, t, e) {
  if (i !== null)
    for (var n, s, r, o, a, f, c, h = 0, l = 0, u, m = i.type, y = m === "FeatureCollection", x = m === "Feature", O = y ? i.features.length : 1, B = 0; B < O; B++) {
      c = y ? (
        // @ts-expect-error: Known type conflict
        i.features[B].geometry
      ) : x ? (
        // @ts-expect-error: Known type conflict
        i.geometry
      ) : i, u = c ? c.type === "GeometryCollection" : !1, a = u ? c.geometries.length : 1;
      for (var p = 0; p < a; p++) {
        var w = 0, d = 0;
        if (o = u ? c.geometries[p] : c, o !== null) {
          f = o.coordinates;
          var b = o.type;
          switch (h = e && (b === "Polygon" || b === "MultiPolygon") ? 1 : 0, b) {
            case null:
              break;
            case "Point":
              if (
                // @ts-expect-error: Known type conflict
                t(
                  f,
                  l,
                  B,
                  w,
                  d
                ) === !1
              )
                return !1;
              l++, w++;
              break;
            case "LineString":
            case "MultiPoint":
              for (n = 0; n < f.length; n++) {
                if (
                  // @ts-expect-error: Known type conflict
                  t(
                    f[n],
                    l,
                    B,
                    w,
                    d
                  ) === !1
                )
                  return !1;
                l++, b === "MultiPoint" && w++;
              }
              b === "LineString" && w++;
              break;
            case "Polygon":
            case "MultiLineString":
              for (n = 0; n < f.length; n++) {
                for (s = 0; s < f[n].length - h; s++) {
                  if (
                    // @ts-expect-error: Known type conflict
                    t(
                      f[n][s],
                      l,
                      B,
                      w,
                      d
                    ) === !1
                  )
                    return !1;
                  l++;
                }
                b === "MultiLineString" && w++, b === "Polygon" && d++;
              }
              b === "Polygon" && w++;
              break;
            case "MultiPolygon":
              for (n = 0; n < f.length; n++) {
                for (d = 0, s = 0; s < f[n].length; s++) {
                  for (r = 0; r < f[n][s].length - h; r++) {
                    if (
                      // @ts-expect-error: Known type conflict
                      t(
                        f[n][s][r],
                        l,
                        B,
                        w,
                        d
                      ) === !1
                    )
                      return !1;
                    l++;
                  }
                  d++;
                }
                w++;
              }
              break;
            case "GeometryCollection":
              for (n = 0; n < o.geometries.length; n++)
                if (
                  // @ts-expect-error: Known type conflict
                  Ne(o.geometries[n], t, e) === !1
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
  let r, o, a, f, c = t[0], h = n[0], l = 0, u = 0;
  h > c == h > -c ? (r = c, c = t[++l]) : (r = h, h = n[++u]);
  let m = 0;
  if (l < i && u < e)
    for (h > c == h > -c ? (o = c + r, a = r - (o - c), c = t[++l]) : (o = h + r, a = r - (o - h), h = n[++u]), r = o, a !== 0 && (s[m++] = a); l < i && u < e; )
      h > c == h > -c ? (o = r + c, f = o - r, a = r - (o - f) + (c - f), c = t[++l]) : (o = r + h, f = o - r, a = r - (o - f) + (h - f), h = n[++u]), r = o, a !== 0 && (s[m++] = a);
  for (; l < i; )
    o = r + c, f = o - r, a = r - (o - f) + (c - f), c = t[++l], r = o, a !== 0 && (s[m++] = a);
  for (; u < e; )
    o = r + h, f = o - r, a = r - (o - f) + (h - f), h = n[++u], r = o, a !== 0 && (s[m++] = a);
  return (r !== 0 || m === 0) && (s[m++] = r), m;
}
function _t(i, t, e, n, s, r, o, a) {
  return ht(ht(i, t, e, n, o), o, s, r, a);
}
function R(i, t, e, n) {
  let s, r, o, a, f, c, h, l, u, m, y;
  h = U * e, m = h - (h - e), y = e - m;
  let x = t[0];
  s = x * e, h = U * x, l = h - (h - x), u = x - l, o = u * y - (s - l * m - u * m - l * y);
  let O = 0;
  o !== 0 && (n[O++] = o);
  for (let B = 1; B < i; B++)
    x = t[B], a = x * e, h = U * x, l = h - (h - x), u = x - l, f = u * y - (a - l * m - u * m - l * y), r = s + f, c = r - s, o = s - (r - c) + (f - c), o !== 0 && (n[O++] = o), s = a + r, o = r - (s - a), o !== 0 && (n[O++] = o);
  return (s !== 0 || O === 0) && (n[O++] = s), O;
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
  let a, f, c, h, l, u, m, y, x, O, B, p, w, d, b, M, S, A;
  const E = i - s, T = e - s, I = t - r, P = n - r;
  d = E * P, u = U * E, m = u - (u - E), y = E - m, u = U * P, x = u - (u - P), O = P - x, b = y * O - (d - m * x - y * x - m * O), M = I * T, u = U * I, m = u - (u - I), y = I - m, u = U * T, x = u - (u - T), O = T - x, S = y * O - (M - m * x - y * x - m * O), B = b - S, l = b - B, Lt[0] = b - (B + l) + (l - S), p = d + B, l = p - d, w = d - (p - l) + (B - l), B = w - M, l = w - B, Lt[1] = w - (B + l) + (l - M), A = p + B, l = A - p, Lt[2] = p - (A - l) + (B - l), Lt[3] = A;
  let X = Bn(4, Lt), g = zn * o;
  if (X >= g || -X >= g || (l = i - E, a = i - (E + l) + (l - s), l = e - T, c = e - (T + l) + (l - s), l = t - I, f = t - (I + l) + (l - r), l = n - P, h = n - (P + l) + (l - r), a === 0 && f === 0 && c === 0 && h === 0) || (g = Gn * o + In * Math.abs(X), X += E * h + P * a - (I * c + T * f), X >= g || -X >= g)) return X;
  d = a * P, u = U * a, m = u - (u - a), y = a - m, u = U * P, x = u - (u - P), O = P - x, b = y * O - (d - m * x - y * x - m * O), M = f * T, u = U * f, m = u - (u - f), y = f - m, u = U * T, x = u - (u - T), O = T - x, S = y * O - (M - m * x - y * x - m * O), B = b - S, l = b - B, pt[0] = b - (B + l) + (l - S), p = d + B, l = p - d, w = d - (p - l) + (B - l), B = w - M, l = w - B, pt[1] = w - (B + l) + (l - M), A = p + B, l = A - p, pt[2] = p - (A - l) + (B - l), pt[3] = A;
  const k = ht(4, Lt, 4, pt, je);
  d = E * h, u = U * E, m = u - (u - E), y = E - m, u = U * h, x = u - (u - h), O = h - x, b = y * O - (d - m * x - y * x - m * O), M = I * c, u = U * I, m = u - (u - I), y = I - m, u = U * c, x = u - (u - c), O = c - x, S = y * O - (M - m * x - y * x - m * O), B = b - S, l = b - B, pt[0] = b - (B + l) + (l - S), p = d + B, l = p - d, w = d - (p - l) + (B - l), B = w - M, l = w - B, pt[1] = w - (B + l) + (l - M), A = p + B, l = A - p, pt[2] = p - (A - l) + (B - l), pt[3] = A;
  const _ = ht(k, je, 4, pt, Ue);
  d = a * h, u = U * a, m = u - (u - a), y = a - m, u = U * h, x = u - (u - h), O = h - x, b = y * O - (d - m * x - y * x - m * O), M = f * c, u = U * f, m = u - (u - f), y = f - m, u = U * c, x = u - (u - c), O = c - x, S = y * O - (M - m * x - y * x - m * O), B = b - S, l = b - B, pt[0] = b - (B + l) + (l - S), p = d + B, l = p - d, w = d - (p - l) + (B - l), B = w - M, l = w - B, pt[1] = w - (B + l) + (l - M), A = p + B, l = A - p, pt[2] = p - (A - l) + (B - l), pt[3] = A;
  const F = ht(_, Ue, 4, pt, ze);
  return ze[F - 1];
}
function Mt(i, t, e, n, s, r) {
  const o = (t - r) * (e - s), a = (i - s) * (n - r), f = o - a, c = Math.abs(o + a);
  return Math.abs(f) >= Un * c ? f : -Kn(i, t, e, n, s, r, c);
}
const Jn = (10 + 96 * dt) * dt, Qn = (4 + 48 * dt) * dt, Wn = (44 + 576 * dt) * dt * dt, Ft = tt(4), Tt = tt(4), Ct = tt(4), St = tt(4), kt = tt(4), Et = tt(4), mt = tt(4), gt = tt(4), _e = tt(8), Me = tt(8), Se = tt(8), ke = tt(8), Ee = tt(8), Ae = tt(8), se = tt(8), oe = tt(8), ae = tt(8), Xt = tt(4), $t = tt(4), Yt = tt(4), z = tt(8), J = tt(16), nt = tt(16), rt = tt(16), et = tt(32), Dt = tt(32), at = tt(48), vt = tt(64);
let jt = tt(1152), Ie = tt(1152);
function ct(i, t, e) {
  i = ht(i, jt, t, e, Ie);
  const n = jt;
  return jt = Ie, Ie = n, i;
}
function Hn(i, t, e, n, s, r, o, a, f) {
  let c, h, l, u, m, y, x, O, B, p, w, d, b, M, S, A, E, T, I, P, X, g, k, _, F, D, N, v, C, $, Y, L, V, j, q;
  const K = i - o, G = e - o, Q = s - o, W = t - a, Z = n - a, H = r - a;
  Y = G * H, k = U * G, _ = k - (k - G), F = G - _, k = U * H, D = k - (k - H), N = H - D, L = F * N - (Y - _ * D - F * D - _ * N), V = Q * Z, k = U * Q, _ = k - (k - Q), F = Q - _, k = U * Z, D = k - (k - Z), N = Z - D, j = F * N - (V - _ * D - F * D - _ * N), v = L - j, g = L - v, Ft[0] = L - (v + g) + (g - j), C = Y + v, g = C - Y, $ = Y - (C - g) + (v - g), v = $ - V, g = $ - v, Ft[1] = $ - (v + g) + (g - V), q = C + v, g = q - C, Ft[2] = C - (q - g) + (v - g), Ft[3] = q, Y = Q * W, k = U * Q, _ = k - (k - Q), F = Q - _, k = U * W, D = k - (k - W), N = W - D, L = F * N - (Y - _ * D - F * D - _ * N), V = K * H, k = U * K, _ = k - (k - K), F = K - _, k = U * H, D = k - (k - H), N = H - D, j = F * N - (V - _ * D - F * D - _ * N), v = L - j, g = L - v, Tt[0] = L - (v + g) + (g - j), C = Y + v, g = C - Y, $ = Y - (C - g) + (v - g), v = $ - V, g = $ - v, Tt[1] = $ - (v + g) + (g - V), q = C + v, g = q - C, Tt[2] = C - (q - g) + (v - g), Tt[3] = q, Y = K * Z, k = U * K, _ = k - (k - K), F = K - _, k = U * Z, D = k - (k - Z), N = Z - D, L = F * N - (Y - _ * D - F * D - _ * N), V = G * W, k = U * G, _ = k - (k - G), F = G - _, k = U * W, D = k - (k - W), N = W - D, j = F * N - (V - _ * D - F * D - _ * N), v = L - j, g = L - v, Ct[0] = L - (v + g) + (g - j), C = Y + v, g = C - Y, $ = Y - (C - g) + (v - g), v = $ - V, g = $ - v, Ct[1] = $ - (v + g) + (g - V), q = C + v, g = q - C, Ct[2] = C - (q - g) + (v - g), Ct[3] = q, c = ht(
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
  let ot = Bn(c, jt), ft = Qn * f;
  if (ot >= ft || -ot >= ft || (g = i - K, h = i - (K + g) + (g - o), g = t - W, m = t - (W + g) + (g - a), g = e - G, l = e - (G + g) + (g - o), g = n - Z, y = n - (Z + g) + (g - a), g = s - Q, u = s - (Q + g) + (g - o), g = r - H, x = r - (H + g) + (g - a), h === 0 && l === 0 && u === 0 && m === 0 && y === 0 && x === 0) || (ft = Wn * f + In * Math.abs(ot), ot += (K * K + W * W) * (G * x + H * l - (Z * u + Q * y)) + 2 * (K * h + W * m) * (G * H - Z * Q) + ((G * G + Z * Z) * (Q * m + W * u - (H * h + K * x)) + 2 * (G * l + Z * y) * (Q * W - H * K)) + ((Q * Q + H * H) * (K * y + Z * h - (W * l + G * m)) + 2 * (Q * u + H * x) * (K * Z - W * G)), ot >= ft || -ot >= ft))
    return ot;
  if ((l !== 0 || y !== 0 || u !== 0 || x !== 0) && (Y = K * K, k = U * K, _ = k - (k - K), F = K - _, L = F * F - (Y - _ * _ - (_ + _) * F), V = W * W, k = U * W, _ = k - (k - W), F = W - _, j = F * F - (V - _ * _ - (_ + _) * F), v = L + j, g = v - L, St[0] = L - (v - g) + (j - g), C = Y + v, g = C - Y, $ = Y - (C - g) + (v - g), v = $ + V, g = v - $, St[1] = $ - (v - g) + (V - g), q = C + v, g = q - C, St[2] = C - (q - g) + (v - g), St[3] = q), (u !== 0 || x !== 0 || h !== 0 || m !== 0) && (Y = G * G, k = U * G, _ = k - (k - G), F = G - _, L = F * F - (Y - _ * _ - (_ + _) * F), V = Z * Z, k = U * Z, _ = k - (k - Z), F = Z - _, j = F * F - (V - _ * _ - (_ + _) * F), v = L + j, g = v - L, kt[0] = L - (v - g) + (j - g), C = Y + v, g = C - Y, $ = Y - (C - g) + (v - g), v = $ + V, g = v - $, kt[1] = $ - (v - g) + (V - g), q = C + v, g = q - C, kt[2] = C - (q - g) + (v - g), kt[3] = q), (h !== 0 || m !== 0 || l !== 0 || y !== 0) && (Y = Q * Q, k = U * Q, _ = k - (k - Q), F = Q - _, L = F * F - (Y - _ * _ - (_ + _) * F), V = H * H, k = U * H, _ = k - (k - H), F = H - _, j = F * F - (V - _ * _ - (_ + _) * F), v = L + j, g = v - L, Et[0] = L - (v - g) + (j - g), C = Y + v, g = C - Y, $ = Y - (C - g) + (v - g), v = $ + V, g = v - $, Et[1] = $ - (v - g) + (V - g), q = C + v, g = q - C, Et[2] = C - (q - g) + (v - g), Et[3] = q), h !== 0 && (O = R(4, Ft, h, _e), c = ct(c, _t(
    R(O, _e, 2 * K, J),
    J,
    R(R(4, Et, h, z), z, Z, nt),
    nt,
    R(R(4, kt, h, z), z, -H, rt),
    rt,
    et,
    at
  ), at)), m !== 0 && (B = R(4, Ft, m, Me), c = ct(c, _t(
    R(B, Me, 2 * W, J),
    J,
    R(R(4, kt, m, z), z, Q, nt),
    nt,
    R(R(4, Et, m, z), z, -G, rt),
    rt,
    et,
    at
  ), at)), l !== 0 && (p = R(4, Tt, l, Se), c = ct(c, _t(
    R(p, Se, 2 * G, J),
    J,
    R(R(4, St, l, z), z, H, nt),
    nt,
    R(R(4, Et, l, z), z, -W, rt),
    rt,
    et,
    at
  ), at)), y !== 0 && (w = R(4, Tt, y, ke), c = ct(c, _t(
    R(w, ke, 2 * Z, J),
    J,
    R(R(4, Et, y, z), z, K, nt),
    nt,
    R(R(4, St, y, z), z, -Q, rt),
    rt,
    et,
    at
  ), at)), u !== 0 && (d = R(4, Ct, u, Ee), c = ct(c, _t(
    R(d, Ee, 2 * Q, J),
    J,
    R(R(4, kt, u, z), z, W, nt),
    nt,
    R(R(4, St, u, z), z, -Z, rt),
    rt,
    et,
    at
  ), at)), x !== 0 && (b = R(4, Ct, x, Ae), c = ct(c, _t(
    R(b, Ae, 2 * H, J),
    J,
    R(R(4, St, x, z), z, G, nt),
    nt,
    R(R(4, kt, x, z), z, -K, rt),
    rt,
    et,
    at
  ), at)), h !== 0 || m !== 0) {
    if (l !== 0 || y !== 0 || u !== 0 || x !== 0 ? (Y = l * H, k = U * l, _ = k - (k - l), F = l - _, k = U * H, D = k - (k - H), N = H - D, L = F * N - (Y - _ * D - F * D - _ * N), V = G * x, k = U * G, _ = k - (k - G), F = G - _, k = U * x, D = k - (k - x), N = x - D, j = F * N - (V - _ * D - F * D - _ * N), v = L + j, g = v - L, mt[0] = L - (v - g) + (j - g), C = Y + v, g = C - Y, $ = Y - (C - g) + (v - g), v = $ + V, g = v - $, mt[1] = $ - (v - g) + (V - g), q = C + v, g = q - C, mt[2] = C - (q - g) + (v - g), mt[3] = q, Y = u * -Z, k = U * u, _ = k - (k - u), F = u - _, k = U * -Z, D = k - (k - -Z), N = -Z - D, L = F * N - (Y - _ * D - F * D - _ * N), V = Q * -y, k = U * Q, _ = k - (k - Q), F = Q - _, k = U * -y, D = k - (k - -y), N = -y - D, j = F * N - (V - _ * D - F * D - _ * N), v = L + j, g = v - L, gt[0] = L - (v - g) + (j - g), C = Y + v, g = C - Y, $ = Y - (C - g) + (v - g), v = $ + V, g = v - $, gt[1] = $ - (v - g) + (V - g), q = C + v, g = q - C, gt[2] = C - (q - g) + (v - g), gt[3] = q, S = ht(4, mt, 4, gt, oe), Y = l * x, k = U * l, _ = k - (k - l), F = l - _, k = U * x, D = k - (k - x), N = x - D, L = F * N - (Y - _ * D - F * D - _ * N), V = u * y, k = U * u, _ = k - (k - u), F = u - _, k = U * y, D = k - (k - y), N = y - D, j = F * N - (V - _ * D - F * D - _ * N), v = L - j, g = L - v, $t[0] = L - (v + g) + (g - j), C = Y + v, g = C - Y, $ = Y - (C - g) + (v - g), v = $ - V, g = $ - v, $t[1] = $ - (v + g) + (g - V), q = C + v, g = q - C, $t[2] = C - (q - g) + (v - g), $t[3] = q, T = 4) : (oe[0] = 0, S = 1, $t[0] = 0, T = 1), h !== 0) {
      const it = R(S, oe, h, rt);
      c = ct(c, ht(
        R(O, _e, h, J),
        J,
        R(it, rt, 2 * K, et),
        et,
        at
      ), at);
      const st = R(T, $t, h, z);
      c = ct(c, _t(
        R(st, z, 2 * K, J),
        J,
        R(st, z, h, nt),
        nt,
        R(it, rt, h, et),
        et,
        Dt,
        vt
      ), vt), y !== 0 && (c = ct(c, R(R(4, Et, h, z), z, y, J), J)), x !== 0 && (c = ct(c, R(R(4, kt, -h, z), z, x, J), J));
    }
    if (m !== 0) {
      const it = R(S, oe, m, rt);
      c = ct(c, ht(
        R(B, Me, m, J),
        J,
        R(it, rt, 2 * W, et),
        et,
        at
      ), at);
      const st = R(T, $t, m, z);
      c = ct(c, _t(
        R(st, z, 2 * W, J),
        J,
        R(st, z, m, nt),
        nt,
        R(it, rt, m, et),
        et,
        Dt,
        vt
      ), vt);
    }
  }
  if (l !== 0 || y !== 0) {
    if (u !== 0 || x !== 0 || h !== 0 || m !== 0 ? (Y = u * W, k = U * u, _ = k - (k - u), F = u - _, k = U * W, D = k - (k - W), N = W - D, L = F * N - (Y - _ * D - F * D - _ * N), V = Q * m, k = U * Q, _ = k - (k - Q), F = Q - _, k = U * m, D = k - (k - m), N = m - D, j = F * N - (V - _ * D - F * D - _ * N), v = L + j, g = v - L, mt[0] = L - (v - g) + (j - g), C = Y + v, g = C - Y, $ = Y - (C - g) + (v - g), v = $ + V, g = v - $, mt[1] = $ - (v - g) + (V - g), q = C + v, g = q - C, mt[2] = C - (q - g) + (v - g), mt[3] = q, P = -H, X = -x, Y = h * P, k = U * h, _ = k - (k - h), F = h - _, k = U * P, D = k - (k - P), N = P - D, L = F * N - (Y - _ * D - F * D - _ * N), V = K * X, k = U * K, _ = k - (k - K), F = K - _, k = U * X, D = k - (k - X), N = X - D, j = F * N - (V - _ * D - F * D - _ * N), v = L + j, g = v - L, gt[0] = L - (v - g) + (j - g), C = Y + v, g = C - Y, $ = Y - (C - g) + (v - g), v = $ + V, g = v - $, gt[1] = $ - (v - g) + (V - g), q = C + v, g = q - C, gt[2] = C - (q - g) + (v - g), gt[3] = q, A = ht(4, mt, 4, gt, ae), Y = u * m, k = U * u, _ = k - (k - u), F = u - _, k = U * m, D = k - (k - m), N = m - D, L = F * N - (Y - _ * D - F * D - _ * N), V = h * x, k = U * h, _ = k - (k - h), F = h - _, k = U * x, D = k - (k - x), N = x - D, j = F * N - (V - _ * D - F * D - _ * N), v = L - j, g = L - v, Yt[0] = L - (v + g) + (g - j), C = Y + v, g = C - Y, $ = Y - (C - g) + (v - g), v = $ - V, g = $ - v, Yt[1] = $ - (v + g) + (g - V), q = C + v, g = q - C, Yt[2] = C - (q - g) + (v - g), Yt[3] = q, I = 4) : (ae[0] = 0, A = 1, Yt[0] = 0, I = 1), l !== 0) {
      const it = R(A, ae, l, rt);
      c = ct(c, ht(
        R(p, Se, l, J),
        J,
        R(it, rt, 2 * G, et),
        et,
        at
      ), at);
      const st = R(I, Yt, l, z);
      c = ct(c, _t(
        R(st, z, 2 * G, J),
        J,
        R(st, z, l, nt),
        nt,
        R(it, rt, l, et),
        et,
        Dt,
        vt
      ), vt), x !== 0 && (c = ct(c, R(R(4, St, l, z), z, x, J), J)), m !== 0 && (c = ct(c, R(R(4, Et, -l, z), z, m, J), J));
    }
    if (y !== 0) {
      const it = R(A, ae, y, rt);
      c = ct(c, ht(
        R(w, ke, y, J),
        J,
        R(it, rt, 2 * Z, et),
        et,
        at
      ), at);
      const st = R(I, Yt, y, z);
      c = ct(c, _t(
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
  if (u !== 0 || x !== 0) {
    if (h !== 0 || m !== 0 || l !== 0 || y !== 0 ? (Y = h * Z, k = U * h, _ = k - (k - h), F = h - _, k = U * Z, D = k - (k - Z), N = Z - D, L = F * N - (Y - _ * D - F * D - _ * N), V = K * y, k = U * K, _ = k - (k - K), F = K - _, k = U * y, D = k - (k - y), N = y - D, j = F * N - (V - _ * D - F * D - _ * N), v = L + j, g = v - L, mt[0] = L - (v - g) + (j - g), C = Y + v, g = C - Y, $ = Y - (C - g) + (v - g), v = $ + V, g = v - $, mt[1] = $ - (v - g) + (V - g), q = C + v, g = q - C, mt[2] = C - (q - g) + (v - g), mt[3] = q, P = -W, X = -m, Y = l * P, k = U * l, _ = k - (k - l), F = l - _, k = U * P, D = k - (k - P), N = P - D, L = F * N - (Y - _ * D - F * D - _ * N), V = G * X, k = U * G, _ = k - (k - G), F = G - _, k = U * X, D = k - (k - X), N = X - D, j = F * N - (V - _ * D - F * D - _ * N), v = L + j, g = v - L, gt[0] = L - (v - g) + (j - g), C = Y + v, g = C - Y, $ = Y - (C - g) + (v - g), v = $ + V, g = v - $, gt[1] = $ - (v - g) + (V - g), q = C + v, g = q - C, gt[2] = C - (q - g) + (v - g), gt[3] = q, M = ht(4, mt, 4, gt, se), Y = h * y, k = U * h, _ = k - (k - h), F = h - _, k = U * y, D = k - (k - y), N = y - D, L = F * N - (Y - _ * D - F * D - _ * N), V = l * m, k = U * l, _ = k - (k - l), F = l - _, k = U * m, D = k - (k - m), N = m - D, j = F * N - (V - _ * D - F * D - _ * N), v = L - j, g = L - v, Xt[0] = L - (v + g) + (g - j), C = Y + v, g = C - Y, $ = Y - (C - g) + (v - g), v = $ - V, g = $ - v, Xt[1] = $ - (v + g) + (g - V), q = C + v, g = q - C, Xt[2] = C - (q - g) + (v - g), Xt[3] = q, E = 4) : (se[0] = 0, M = 1, Xt[0] = 0, E = 1), u !== 0) {
      const it = R(M, se, u, rt);
      c = ct(c, ht(
        R(d, Ee, u, J),
        J,
        R(it, rt, 2 * Q, et),
        et,
        at
      ), at);
      const st = R(E, Xt, u, z);
      c = ct(c, _t(
        R(st, z, 2 * Q, J),
        J,
        R(st, z, u, nt),
        nt,
        R(it, rt, u, et),
        et,
        Dt,
        vt
      ), vt), m !== 0 && (c = ct(c, R(R(4, kt, u, z), z, m, J), J)), y !== 0 && (c = ct(c, R(R(4, St, -u, z), z, y, J), J));
    }
    if (x !== 0) {
      const it = R(M, se, x, rt);
      c = ct(c, ht(
        R(b, Ae, x, J),
        J,
        R(it, rt, 2 * H, et),
        et,
        at
      ), at);
      const st = R(E, Xt, x, z);
      c = ct(c, _t(
        R(st, z, 2 * H, J),
        J,
        R(st, z, x, nt),
        nt,
        R(it, rt, x, et),
        et,
        Dt,
        vt
      ), vt);
    }
  }
  return jt[c - 1];
}
function Zn(i, t, e, n, s, r, o, a) {
  const f = i - o, c = e - o, h = s - o, l = t - a, u = n - a, m = r - a, y = c * m, x = h * u, O = f * f + l * l, B = h * l, p = f * m, w = c * c + u * u, d = f * u, b = c * l, M = h * h + m * m, S = O * (y - x) + w * (B - p) + M * (d - b), A = (Math.abs(y) + Math.abs(x)) * O + (Math.abs(B) + Math.abs(p)) * w + (Math.abs(d) + Math.abs(b)) * M, E = Jn * A;
  return S > E || -S > E ? S : Hn(i, t, e, n, s, r, o, a, A);
}
function tr(i, t) {
  var e, n, s = 0, r, o, a, f, c, h, l, u = i[0], m = i[1], y = t.length;
  for (e = 0; e < y; e++) {
    n = 0;
    var x = t[e], O = x.length - 1;
    if (h = x[0], h[0] !== x[O][0] && h[1] !== x[O][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (o = h[0] - u, a = h[1] - m, n; n < O; n++) {
      if (l = x[n + 1], f = l[0] - u, c = l[1] - m, a === 0 && c === 0) {
        if (f <= 0 && o >= 0 || o <= 0 && f >= 0)
          return 0;
      } else if (c >= 0 && a <= 0 || c <= 0 && a >= 0) {
        if (r = Mt(o, f, a, c, 0, 0), r === 0)
          return 0;
        (r > 0 && c > 0 && a <= 0 || r < 0 && c <= 0 && a > 0) && s++;
      }
      h = l, a = c, o = f;
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
  for (var f = 0; f < a.length; ++f) {
    const c = tr(n, a[f]);
    if (c === 0 && !e.ignoreBoundary) return !0;
    if (c) return !0;
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
      const f = o + 1;
      if (f < this.length && n(e[f], a) < 0 && (o = f, a = e[f]), n(a, r) >= 0) break;
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
  let r, o, a, f, c = t[0], h = n[0], l = 0, u = 0;
  h > c == h > -c ? (r = c, c = t[++l]) : (r = h, h = n[++u]);
  let m = 0;
  if (l < i && u < e)
    for (h > c == h > -c ? (o = c + r, a = r - (o - c), c = t[++l]) : (o = h + r, a = r - (o - h), h = n[++u]), r = o, a !== 0 && (s[m++] = a); l < i && u < e; )
      h > c == h > -c ? (o = r + c, f = o - r, a = r - (o - f) + (c - f), c = t[++l]) : (o = r + h, f = o - r, a = r - (o - f) + (h - f), h = n[++u]), r = o, a !== 0 && (s[m++] = a);
  for (; l < i; )
    o = r + c, f = o - r, a = r - (o - f) + (c - f), c = t[++l], r = o, a !== 0 && (s[m++] = a);
  for (; u < e; )
    o = r + h, f = o - r, a = r - (o - f) + (h - f), h = n[++u], r = o, a !== 0 && (s[m++] = a);
  return (r !== 0 || m === 0) && (s[m++] = r), m;
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
  let a, f, c, h, l, u, m, y, x, O, B, p, w, d, b, M, S, A;
  const E = i - s, T = e - s, I = t - r, P = n - r;
  d = E * P, u = ut * E, m = u - (u - E), y = E - m, u = ut * P, x = u - (u - P), O = P - x, b = y * O - (d - m * x - y * x - m * O), M = I * T, u = ut * I, m = u - (u - I), y = I - m, u = ut * T, x = u - (u - T), O = T - x, S = y * O - (M - m * x - y * x - m * O), B = b - S, l = b - B, Vt[0] = b - (B + l) + (l - S), p = d + B, l = p - d, w = d - (p - l) + (B - l), B = w - M, l = w - B, Vt[1] = w - (B + l) + (l - M), A = p + B, l = A - p, Vt[2] = p - (A - l) + (B - l), Vt[3] = A;
  let X = sr(4, Vt), g = ar * o;
  if (X >= g || -X >= g || (l = i - E, a = i - (E + l) + (l - s), l = e - T, c = e - (T + l) + (l - s), l = t - I, f = t - (I + l) + (l - r), l = n - P, h = n - (P + l) + (l - r), a === 0 && f === 0 && c === 0 && h === 0) || (g = cr * o + ir * Math.abs(X), X += E * h + P * a - (I * c + T * f), X >= g || -X >= g)) return X;
  d = a * P, u = ut * a, m = u - (u - a), y = a - m, u = ut * P, x = u - (u - P), O = P - x, b = y * O - (d - m * x - y * x - m * O), M = f * T, u = ut * f, m = u - (u - f), y = f - m, u = ut * T, x = u - (u - T), O = T - x, S = y * O - (M - m * x - y * x - m * O), B = b - S, l = b - B, wt[0] = b - (B + l) + (l - S), p = d + B, l = p - d, w = d - (p - l) + (B - l), B = w - M, l = w - B, wt[1] = w - (B + l) + (l - M), A = p + B, l = A - p, wt[2] = p - (A - l) + (B - l), wt[3] = A;
  const k = Oe(4, Vt, 4, wt, Ge);
  d = E * h, u = ut * E, m = u - (u - E), y = E - m, u = ut * h, x = u - (u - h), O = h - x, b = y * O - (d - m * x - y * x - m * O), M = I * c, u = ut * I, m = u - (u - I), y = I - m, u = ut * c, x = u - (u - c), O = c - x, S = y * O - (M - m * x - y * x - m * O), B = b - S, l = b - B, wt[0] = b - (B + l) + (l - S), p = d + B, l = p - d, w = d - (p - l) + (B - l), B = w - M, l = w - B, wt[1] = w - (B + l) + (l - M), A = p + B, l = A - p, wt[2] = p - (A - l) + (B - l), wt[3] = A;
  const _ = Oe(k, Ge, 4, wt, Ke);
  d = a * h, u = ut * a, m = u - (u - a), y = a - m, u = ut * h, x = u - (u - h), O = h - x, b = y * O - (d - m * x - y * x - m * O), M = f * c, u = ut * f, m = u - (u - f), y = f - m, u = ut * c, x = u - (u - c), O = c - x, S = y * O - (M - m * x - y * x - m * O), B = b - S, l = b - B, wt[0] = b - (B + l) + (l - S), p = d + B, l = p - d, w = d - (p - l) + (B - l), B = w - M, l = w - B, wt[1] = w - (B + l) + (l - M), A = p + B, l = A - p, wt[2] = p - (A - l) + (B - l), wt[3] = A;
  const F = Oe(_, Ke, 4, wt, Je);
  return Je[F - 1];
}
function Qe(i, t, e, n, s, r) {
  const o = (t - r) * (e - s), a = (i - s) * (n - r), f = o - a;
  if (o === 0 || a === 0 || o > 0 != a > 0) return f;
  const c = Math.abs(o + a);
  return Math.abs(f) >= or * c ? f : -lr(i, t, e, n, s, r, c);
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
      for (let f = 0; f < n[s][r].length - 1; f++) {
        a = n[s][r][f + 1];
        const c = new He(o, ce, le, fe), h = new He(a, ce, le, fe + 1);
        c.otherEvent = h, h.otherEvent = c, On(c, h) > 0 ? (h.isLeftEndpoint = !0, c.isLeftEndpoint = !1) : (c.isLeftEndpoint = !0, h.isLeftEndpoint = !1), t.push(c), t.push(h), o = a, fe = fe + 1;
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
        const f = mr(r, a);
        f !== !1 && e.push(f);
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
  const e = i.leftSweepEvent.p.x, n = i.leftSweepEvent.p.y, s = i.rightSweepEvent.p.x, r = i.rightSweepEvent.p.y, o = t.leftSweepEvent.p.x, a = t.leftSweepEvent.p.y, f = t.rightSweepEvent.p.x, c = t.rightSweepEvent.p.y, h = Qe(e, n, s, r, o, a), l = Qe(e, n, s, r, f, c);
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
  const u = (c - a) * (s - e) - (f - o) * (r - n), m = (f - o) * (n - a) - (c - a) * (e - o), y = (s - e) * (n - a) - (r - n) * (e - o);
  if (u === 0)
    return !1;
  const x = m / u, O = y / u;
  if (x >= 0 && x <= 1 && O >= 0 && O <= 1) {
    const B = e + x * (s - e), p = n + x * (r - n);
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
    const f = {};
    o.forEach((c) => {
      const h = c.join(",");
      f[h] || (f[h] = !0, a.push(c));
    });
  } else
    a = o;
  return bt(a.map((f) => Nt(f)));
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
  return Ne(
    i,
    function(r) {
      e += r[0], n += r[1], s++;
    },
    !0
  ), Nt([e / s, n / s], t.properties);
}
var he = { exports: {} }, we = { exports: {} }, br = we.exports, Ze;
function xr() {
  return Ze || (Ze = 1, (function(i, t) {
    (function(e, n) {
      i.exports = n();
    })(br, function() {
      function e(p, w, d, b, M) {
        (function S(A, E, T, I, P) {
          for (; I > T; ) {
            if (I - T > 600) {
              var X = I - T + 1, g = E - T + 1, k = Math.log(X), _ = 0.5 * Math.exp(2 * k / 3), F = 0.5 * Math.sqrt(k * _ * (X - _) / X) * (g - X / 2 < 0 ? -1 : 1), D = Math.max(T, Math.floor(E - g * _ / X + F)), N = Math.min(I, Math.floor(E + (X - g) * _ / X + F));
              S(A, E, D, N, P);
            }
            var v = A[E], C = T, $ = I;
            for (n(A, T, E), P(A[I], v) > 0 && n(A, T, I); C < $; ) {
              for (n(A, C, $), C++, $--; P(A[C], v) < 0; ) C++;
              for (; P(A[$], v) > 0; ) $--;
            }
            P(A[T], v) === 0 ? n(A, T, $) : n(A, ++$, I), $ <= E && (T = $ + 1), E <= $ && (I = $ - 1);
          }
        })(p, w, d || 0, b || p.length - 1, M || s);
      }
      function n(p, w, d) {
        var b = p[w];
        p[w] = p[d], p[d] = b;
      }
      function s(p, w) {
        return p < w ? -1 : p > w ? 1 : 0;
      }
      var r = function(p) {
        p === void 0 && (p = 9), this._maxEntries = Math.max(4, p), this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries)), this.clear();
      };
      function o(p, w, d) {
        if (!d) return w.indexOf(p);
        for (var b = 0; b < w.length; b++) if (d(p, w[b])) return b;
        return -1;
      }
      function a(p, w) {
        f(p, 0, p.children.length, w, p);
      }
      function f(p, w, d, b, M) {
        M || (M = O(null)), M.minX = 1 / 0, M.minY = 1 / 0, M.maxX = -1 / 0, M.maxY = -1 / 0;
        for (var S = w; S < d; S++) {
          var A = p.children[S];
          c(M, p.leaf ? b(A) : A);
        }
        return M;
      }
      function c(p, w) {
        return p.minX = Math.min(p.minX, w.minX), p.minY = Math.min(p.minY, w.minY), p.maxX = Math.max(p.maxX, w.maxX), p.maxY = Math.max(p.maxY, w.maxY), p;
      }
      function h(p, w) {
        return p.minX - w.minX;
      }
      function l(p, w) {
        return p.minY - w.minY;
      }
      function u(p) {
        return (p.maxX - p.minX) * (p.maxY - p.minY);
      }
      function m(p) {
        return p.maxX - p.minX + (p.maxY - p.minY);
      }
      function y(p, w) {
        return p.minX <= w.minX && p.minY <= w.minY && w.maxX <= p.maxX && w.maxY <= p.maxY;
      }
      function x(p, w) {
        return w.minX <= p.maxX && w.minY <= p.maxY && w.maxX >= p.minX && w.maxY >= p.minY;
      }
      function O(p) {
        return { children: p, height: 1, leaf: !0, minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
      }
      function B(p, w, d, b, M) {
        for (var S = [w, d]; S.length; ) if (!((d = S.pop()) - (w = S.pop()) <= b)) {
          var A = w + Math.ceil((d - w) / b / 2) * b;
          e(p, A, w, d, M), S.push(w, A, A, d);
        }
      }
      return r.prototype.all = function() {
        return this._all(this.data, []);
      }, r.prototype.search = function(p) {
        var w = this.data, d = [];
        if (!x(p, w)) return d;
        for (var b = this.toBBox, M = []; w; ) {
          for (var S = 0; S < w.children.length; S++) {
            var A = w.children[S], E = w.leaf ? b(A) : A;
            x(p, E) && (w.leaf ? d.push(A) : y(p, E) ? this._all(A, d) : M.push(A));
          }
          w = M.pop();
        }
        return d;
      }, r.prototype.collides = function(p) {
        var w = this.data;
        if (!x(p, w)) return !1;
        for (var d = []; w; ) {
          for (var b = 0; b < w.children.length; b++) {
            var M = w.children[b], S = w.leaf ? this.toBBox(M) : M;
            if (x(p, S)) {
              if (w.leaf || y(p, S)) return !0;
              d.push(M);
            }
          }
          w = d.pop();
        }
        return !1;
      }, r.prototype.load = function(p) {
        if (!p || !p.length) return this;
        if (p.length < this._minEntries) {
          for (var w = 0; w < p.length; w++) this.insert(p[w]);
          return this;
        }
        var d = this._build(p.slice(), 0, p.length - 1, 0);
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
      }, r.prototype.insert = function(p) {
        return p && this._insert(p, this.data.height - 1), this;
      }, r.prototype.clear = function() {
        return this.data = O([]), this;
      }, r.prototype.remove = function(p, w) {
        if (!p) return this;
        for (var d, b, M, S = this.data, A = this.toBBox(p), E = [], T = []; S || E.length; ) {
          if (S || (S = E.pop(), b = E[E.length - 1], d = T.pop(), M = !0), S.leaf) {
            var I = o(p, S.children, w);
            if (I !== -1) return S.children.splice(I, 1), E.push(S), this._condense(E), this;
          }
          M || S.leaf || !y(S, A) ? b ? (d++, S = b.children[d], M = !1) : S = null : (E.push(S), T.push(d), d = 0, b = S, S = S.children[0]);
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
        for (var d = []; p; ) p.leaf ? w.push.apply(w, p.children) : d.push.apply(d, p.children), p = d.pop();
        return w;
      }, r.prototype._build = function(p, w, d, b) {
        var M, S = d - w + 1, A = this._maxEntries;
        if (S <= A) return a(M = O(p.slice(w, d + 1)), this.toBBox), M;
        b || (b = Math.ceil(Math.log(S) / Math.log(A)), A = Math.ceil(S / Math.pow(A, b - 1))), (M = O([])).leaf = !1, M.height = b;
        var E = Math.ceil(S / A), T = E * Math.ceil(Math.sqrt(A));
        B(p, w, d, T, this.compareMinX);
        for (var I = w; I <= d; I += T) {
          var P = Math.min(I + T - 1, d);
          B(p, I, P, E, this.compareMinY);
          for (var X = I; X <= P; X += E) {
            var g = Math.min(X + E - 1, P);
            M.children.push(this._build(p, X, g, b - 1));
          }
        }
        return a(M, this.toBBox), M;
      }, r.prototype._chooseSubtree = function(p, w, d, b) {
        for (; b.push(w), !w.leaf && b.length - 1 !== d; ) {
          for (var M = 1 / 0, S = 1 / 0, A = void 0, E = 0; E < w.children.length; E++) {
            var T = w.children[E], I = u(T), P = (X = p, g = T, (Math.max(g.maxX, X.maxX) - Math.min(g.minX, X.minX)) * (Math.max(g.maxY, X.maxY) - Math.min(g.minY, X.minY)) - I);
            P < S ? (S = P, M = I < M ? I : M, A = T) : P === S && I < M && (M = I, A = T);
          }
          w = A || w.children[0];
        }
        var X, g;
        return w;
      }, r.prototype._insert = function(p, w, d) {
        var b = d ? p : this.toBBox(p), M = [], S = this._chooseSubtree(b, this.data, w, M);
        for (S.children.push(p), c(S, b); w >= 0 && M[w].children.length > this._maxEntries; ) this._split(M, w), w--;
        this._adjustParentBBoxes(b, M, w);
      }, r.prototype._split = function(p, w) {
        var d = p[w], b = d.children.length, M = this._minEntries;
        this._chooseSplitAxis(d, M, b);
        var S = this._chooseSplitIndex(d, M, b), A = O(d.children.splice(S, d.children.length - S));
        A.height = d.height, A.leaf = d.leaf, a(d, this.toBBox), a(A, this.toBBox), w ? p[w - 1].children.push(A) : this._splitRoot(d, A);
      }, r.prototype._splitRoot = function(p, w) {
        this.data = O([p, w]), this.data.height = p.height + 1, this.data.leaf = !1, a(this.data, this.toBBox);
      }, r.prototype._chooseSplitIndex = function(p, w, d) {
        for (var b, M, S, A, E, T, I, P = 1 / 0, X = 1 / 0, g = w; g <= d - w; g++) {
          var k = f(p, 0, g, this.toBBox), _ = f(p, g, d, this.toBBox), F = (M = k, S = _, A = void 0, E = void 0, T = void 0, I = void 0, A = Math.max(M.minX, S.minX), E = Math.max(M.minY, S.minY), T = Math.min(M.maxX, S.maxX), I = Math.min(M.maxY, S.maxY), Math.max(0, T - A) * Math.max(0, I - E)), D = u(k) + u(_);
          F < P ? (P = F, b = g, X = D < X ? D : X) : F === P && D < X && (X = D, b = g);
        }
        return b || d - w;
      }, r.prototype._chooseSplitAxis = function(p, w, d) {
        var b = p.leaf ? this.compareMinX : h, M = p.leaf ? this.compareMinY : l;
        this._allDistMargin(p, w, d, b) < this._allDistMargin(p, w, d, M) && p.children.sort(b);
      }, r.prototype._allDistMargin = function(p, w, d, b) {
        p.children.sort(b);
        for (var M = this.toBBox, S = f(p, 0, w, M), A = f(p, d - w, d, M), E = m(S) + m(A), T = w; T < d - w; T++) {
          var I = p.children[T];
          c(S, p.leaf ? M(I) : I), E += m(S);
        }
        for (var P = d - w - 1; P >= w; P--) {
          var X = p.children[P];
          c(A, p.leaf ? M(X) : X), E += m(A);
        }
        return E;
      }, r.prototype._adjustParentBBoxes = function(p, w, d) {
        for (var b = d; b >= 0; b--) c(w[b], p);
      }, r.prototype._condense = function(p) {
        for (var w = p.length - 1, d = void 0; w >= 0; w--) p[w].children.length === 0 ? w > 0 ? (d = p[w - 1].children).splice(d.indexOf(p[w]), 1) : this.clear() : a(p[w], this.toBBox);
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
    for (var f = (s - n) / 2, c = 0, h = f - 1; c < f; h = c++) {
      var l = e[n + c * 2 + 0], u = e[n + c * 2 + 1], m = e[n + h * 2 + 0], y = e[n + h * 2 + 1], x = u > o != y > o && r < (m - l) * (o - u) / (y - u) + l;
      x && (a = !a);
    }
    return a;
  }), Fe;
}
var Te, en;
function Sr() {
  return en || (en = 1, Te = function(t, e, n, s) {
    var r = t[0], o = t[1], a = !1;
    n === void 0 && (n = 0), s === void 0 && (s = e.length);
    for (var f = s - n, c = 0, h = f - 1; c < f; h = c++) {
      var l = e[c + n][0], u = e[c + n][1], m = e[h + n][0], y = e[h + n][1], x = u > o != y > o && r < (m - l) * (o - u) / (y - u) + l;
      x && (a = !a);
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
      function r(x, O, B, p, w) {
        let d, b, M, S, A = O[0], E = p[0], T = 0, I = 0;
        E > A == E > -A ? (d = A, A = O[++T]) : (d = E, E = p[++I]);
        let P = 0;
        if (T < x && I < B) for (E > A == E > -A ? (M = d - ((b = A + d) - A), A = O[++T]) : (M = d - ((b = E + d) - E), E = p[++I]), d = b, M !== 0 && (w[P++] = M); T < x && I < B; ) E > A == E > -A ? (M = d - ((b = d + A) - (S = b - d)) + (A - S), A = O[++T]) : (M = d - ((b = d + E) - (S = b - d)) + (E - S), E = p[++I]), d = b, M !== 0 && (w[P++] = M);
        for (; T < x; ) M = d - ((b = d + A) - (S = b - d)) + (A - S), A = O[++T], d = b, M !== 0 && (w[P++] = M);
        for (; I < B; ) M = d - ((b = d + E) - (S = b - d)) + (E - S), E = p[++I], d = b, M !== 0 && (w[P++] = M);
        return d === 0 && P !== 0 || (w[P++] = d), P;
      }
      function o(x) {
        return new Float64Array(x);
      }
      const a = 33306690738754716e-32, f = 22204460492503146e-32, c = 11093356479670487e-47, h = o(4), l = o(8), u = o(12), m = o(16), y = o(4);
      e.orient2d = function(x, O, B, p, w, d) {
        const b = (O - d) * (B - w), M = (x - w) * (p - d), S = b - M;
        if (b === 0 || M === 0 || b > 0 != M > 0) return S;
        const A = Math.abs(b + M);
        return Math.abs(S) >= a * A ? S : -(function(E, T, I, P, X, g, k) {
          let _, F, D, N, v, C, $, Y, L, V, j, q, K, G, Q, W, Z, H;
          const ot = E - X, ft = I - X, it = T - g, st = P - g;
          v = (Q = (Y = ot - ($ = (C = 134217729 * ot) - (C - ot))) * (V = st - (L = (C = 134217729 * st) - (C - st))) - ((G = ot * st) - $ * L - Y * L - $ * V)) - (j = Q - (Z = (Y = it - ($ = (C = 134217729 * it) - (C - it))) * (V = ft - (L = (C = 134217729 * ft) - (C - ft))) - ((W = it * ft) - $ * L - Y * L - $ * V))), h[0] = Q - (j + v) + (v - Z), v = (K = G - ((q = G + j) - (v = q - G)) + (j - v)) - (j = K - W), h[1] = K - (j + v) + (v - W), v = (H = q + j) - q, h[2] = q - (H - v) + (j - v), h[3] = H;
          let Ot = (function($n, Ye) {
            let Re = Ye[0];
            for (let xe = 1; xe < $n; xe++) Re += Ye[xe];
            return Re;
          })(4, h), Ut = f * k;
          if (Ot >= Ut || -Ot >= Ut || (_ = E - (ot + (v = E - ot)) + (v - X), D = I - (ft + (v = I - ft)) + (v - X), F = T - (it + (v = T - it)) + (v - g), N = P - (st + (v = P - st)) + (v - g), _ === 0 && F === 0 && D === 0 && N === 0) || (Ut = c * k + s * Math.abs(Ot), (Ot += ot * N + st * _ - (it * D + ft * F)) >= Ut || -Ot >= Ut)) return Ot;
          v = (Q = (Y = _ - ($ = (C = 134217729 * _) - (C - _))) * (V = st - (L = (C = 134217729 * st) - (C - st))) - ((G = _ * st) - $ * L - Y * L - $ * V)) - (j = Q - (Z = (Y = F - ($ = (C = 134217729 * F) - (C - F))) * (V = ft - (L = (C = 134217729 * ft) - (C - ft))) - ((W = F * ft) - $ * L - Y * L - $ * V))), y[0] = Q - (j + v) + (v - Z), v = (K = G - ((q = G + j) - (v = q - G)) + (j - v)) - (j = K - W), y[1] = K - (j + v) + (v - W), v = (H = q + j) - q, y[2] = q - (H - v) + (j - v), y[3] = H;
          const Pn = r(4, h, 4, y, l);
          v = (Q = (Y = ot - ($ = (C = 134217729 * ot) - (C - ot))) * (V = N - (L = (C = 134217729 * N) - (C - N))) - ((G = ot * N) - $ * L - Y * L - $ * V)) - (j = Q - (Z = (Y = it - ($ = (C = 134217729 * it) - (C - it))) * (V = D - (L = (C = 134217729 * D) - (C - D))) - ((W = it * D) - $ * L - Y * L - $ * V))), y[0] = Q - (j + v) + (v - Z), v = (K = G - ((q = G + j) - (v = q - G)) + (j - v)) - (j = K - W), y[1] = K - (j + v) + (v - W), v = (H = q + j) - q, y[2] = q - (H - v) + (j - v), y[3] = H;
          const Nn = r(Pn, l, 4, y, u);
          v = (Q = (Y = _ - ($ = (C = 134217729 * _) - (C - _))) * (V = N - (L = (C = 134217729 * N) - (C - N))) - ((G = _ * N) - $ * L - Y * L - $ * V)) - (j = Q - (Z = (Y = F - ($ = (C = 134217729 * F) - (C - F))) * (V = D - (L = (C = 134217729 * D) - (C - D))) - ((W = F * D) - $ * L - Y * L - $ * V))), y[0] = Q - (j + v) + (v - Z), v = (K = G - ((q = G + j) - (v = q - G)) + (j - v)) - (j = K - W), y[1] = K - (j + v) + (v - W), v = (H = q + j) - q, y[2] = q - (H - v) + (j - v), y[3] = H;
          const Xn = r(Nn, u, 4, y, m);
          return m[Xn - 1];
        })(x, O, B, p, w, d, A);
      }, e.orient2dfast = function(x, O, B, p, w, d) {
        return (O - d) * (B - w) - (x - w) * (p - d);
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
  function s(d, b, M) {
    b = Math.max(0, b === void 0 ? 2 : b), M = M || 0;
    var S = m(d), A = new i(16);
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
    }, A.load(d);
    for (var E = [], T = 0, I; T < S.length; T++) {
      var P = S[T];
      A.remove(P), I = y(P, I), E.push(I);
    }
    var X = new i(16);
    for (T = 0; T < E.length; T++) X.insert(u(E[T]));
    for (var g = b * b, k = M * M; E.length; ) {
      var _ = E.shift(), F = _.p, D = _.next.p, N = x(F, D);
      if (!(N < k)) {
        var v = N / g;
        P = r(A, _.prev.p, F, D, _.next.next.p, v, X), P && Math.min(x(P, F), x(P, D)) <= v && (E.push(_), E.push(y(P, _)), A.remove(P), X.remove(_), X.insert(u(_)), X.insert(u(_.next)));
      }
    }
    _ = I;
    var C = [];
    do
      C.push(_.p), _ = _.next;
    while (_ !== I);
    return C.push(_.p), C;
  }
  function r(d, b, M, S, A, E, T) {
    for (var I = new t([], o), P = d.data; P; ) {
      for (var X = 0; X < P.children.length; X++) {
        var g = P.children[X], k = P.leaf ? O(g, M, S) : a(M, S, g);
        k > E || I.push({
          node: g,
          dist: k
        });
      }
      for (; I.length && !I.peek().node.children; ) {
        var _ = I.pop(), F = _.node, D = O(F, b, M), N = O(F, S, A);
        if (_.dist < D && _.dist < N && c(M, F, T) && c(S, F, T)) return F;
      }
      P = I.pop(), P && (P = P.node);
    }
    return null;
  }
  function o(d, b) {
    return d.dist - b.dist;
  }
  function a(d, b, M) {
    if (f(d, M) || f(b, M)) return 0;
    var S = B(d[0], d[1], b[0], b[1], M.minX, M.minY, M.maxX, M.minY);
    if (S === 0) return 0;
    var A = B(d[0], d[1], b[0], b[1], M.minX, M.minY, M.minX, M.maxY);
    if (A === 0) return 0;
    var E = B(d[0], d[1], b[0], b[1], M.maxX, M.minY, M.maxX, M.maxY);
    if (E === 0) return 0;
    var T = B(d[0], d[1], b[0], b[1], M.minX, M.maxY, M.maxX, M.maxY);
    return T === 0 ? 0 : Math.min(S, A, E, T);
  }
  function f(d, b) {
    return d[0] >= b.minX && d[0] <= b.maxX && d[1] >= b.minY && d[1] <= b.maxY;
  }
  function c(d, b, M) {
    for (var S = Math.min(d[0], b[0]), A = Math.min(d[1], b[1]), E = Math.max(d[0], b[0]), T = Math.max(d[1], b[1]), I = M.search({ minX: S, minY: A, maxX: E, maxY: T }), P = 0; P < I.length; P++)
      if (l(I[P].p, I[P].next.p, d, b)) return !1;
    return !0;
  }
  function h(d, b, M) {
    return n(d[0], d[1], b[0], b[1], M[0], M[1]);
  }
  function l(d, b, M, S) {
    return d !== S && b !== M && h(d, b, M) > 0 != h(d, b, S) > 0 && h(M, S, d) > 0 != h(M, S, b) > 0;
  }
  function u(d) {
    var b = d.p, M = d.next.p;
    return d.minX = Math.min(b[0], M[0]), d.minY = Math.min(b[1], M[1]), d.maxX = Math.max(b[0], M[0]), d.maxY = Math.max(b[1], M[1]), d;
  }
  function m(d) {
    for (var b = d[0], M = d[0], S = d[0], A = d[0], E = 0; E < d.length; E++) {
      var T = d[E];
      T[0] < b[0] && (b = T), T[0] > S[0] && (S = T), T[1] < M[1] && (M = T), T[1] > A[1] && (A = T);
    }
    var I = [b, M, S, A], P = I.slice();
    for (E = 0; E < d.length; E++)
      e(d[E], I) || P.push(d[E]);
    return w(P);
  }
  function y(d, b) {
    var M = {
      p: d,
      prev: null,
      next: null,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };
    return b ? (M.next = b.next, M.prev = b, b.next.prev = M, b.next = M) : (M.prev = M, M.next = M), M;
  }
  function x(d, b) {
    var M = d[0] - b[0], S = d[1] - b[1];
    return M * M + S * S;
  }
  function O(d, b, M) {
    var S = b[0], A = b[1], E = M[0] - S, T = M[1] - A;
    if (E !== 0 || T !== 0) {
      var I = ((d[0] - S) * E + (d[1] - A) * T) / (E * E + T * T);
      I > 1 ? (S = M[0], A = M[1]) : I > 0 && (S += E * I, A += T * I);
    }
    return E = d[0] - S, T = d[1] - A, E * E + T * T;
  }
  function B(d, b, M, S, A, E, T, I) {
    var P = M - d, X = S - b, g = T - A, k = I - E, _ = d - A, F = b - E, D = P * P + X * X, N = P * g + X * k, v = g * g + k * k, C = P * _ + X * F, $ = g * _ + k * F, Y = D * v - N * N, L, V, j, q, K = Y, G = Y;
    Y === 0 ? (V = 0, K = 1, q = $, G = v) : (V = N * $ - v * C, q = D * $ - N * C, V < 0 ? (V = 0, q = $, G = v) : V > K && (V = K, q = $ + N, G = v)), q < 0 ? (q = 0, -C < 0 ? V = 0 : -C > D ? V = K : (V = -C, K = D)) : q > G && (q = G, -C + N < 0 ? V = 0 : -C + N > D ? V = K : (V = -C + N, K = D)), L = V === 0 ? 0 : V / K, j = q === 0 ? 0 : q / G;
    var Q = (1 - L) * d + L * M, W = (1 - L) * b + L * S, Z = (1 - j) * A + j * T, H = (1 - j) * E + j * I, ot = Z - Q, ft = H - W;
    return ot * ot + ft * ft;
  }
  function p(d, b) {
    return d[0] === b[0] ? d[1] - b[1] : d[0] - b[0];
  }
  function w(d) {
    d.sort(p);
    for (var b = [], M = 0; M < d.length; M++) {
      for (; b.length >= 2 && h(b[b.length - 2], b[b.length - 1], d[M]) <= 0; )
        b.pop();
      b.push(d[M]);
    }
    for (var S = [], A = d.length - 1; A >= 0; A--) {
      for (; S.length >= 2 && h(S[S.length - 2], S[S.length - 1], d[A]) <= 0; )
        S.pop();
      S.push(d[A]);
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
  if (Ne(i, (s) => {
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
  static from(t, e = Pr, n = Nr) {
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
    let a = 1 / 0, f = 1 / 0, c = -1 / 0, h = -1 / 0;
    for (let E = 0; E < o; E++) {
      const T = t[2 * E], I = t[2 * E + 1];
      T < a && (a = T), I < f && (f = I), T > c && (c = T), I > h && (h = I), this._ids[E] = E;
    }
    const l = (a + c) / 2, u = (f + h) / 2;
    let m = 0, y = 0, x = 0;
    for (let E = 0, T = 1 / 0; E < o; E++) {
      const I = Ce(l, u, t[2 * E], t[2 * E + 1]);
      I < T && (m = E, T = I);
    }
    const O = t[2 * m], B = t[2 * m + 1];
    for (let E = 0, T = 1 / 0; E < o; E++) {
      if (E === m) continue;
      const I = Ce(O, B, t[2 * E], t[2 * E + 1]);
      I < T && I > 0 && (y = E, T = I);
    }
    let p = t[2 * y], w = t[2 * y + 1], d = 1 / 0;
    for (let E = 0; E < o; E++) {
      if (E === m || E === y) continue;
      const T = Cr(O, B, p, w, t[2 * E], t[2 * E + 1]);
      T < d && (x = E, d = T);
    }
    let b = t[2 * x], M = t[2 * x + 1];
    if (d === 1 / 0) {
      for (let I = 0; I < o; I++)
        this._dists[I] = t[2 * I] - t[0] || t[2 * I + 1] - t[1];
      qt(this._ids, this._dists, 0, o - 1);
      const E = new Uint32Array(o);
      let T = 0;
      for (let I = 0, P = -1 / 0; I < o; I++) {
        const X = this._ids[I], g = this._dists[X];
        g > P && (E[T++] = X, P = g);
      }
      this.hull = E.subarray(0, T), this.triangles = new Uint32Array(0), this.halfedges = new Int32Array(0);
      return;
    }
    if (Mt(O, B, p, w, b, M) < 0) {
      const E = y, T = p, I = w;
      y = x, p = b, w = M, x = E, b = T, M = I;
    }
    const S = Dr(O, B, p, w, b, M);
    this._cx = S.x, this._cy = S.y;
    for (let E = 0; E < o; E++)
      this._dists[E] = Ce(t[2 * E], t[2 * E + 1], S.x, S.y);
    qt(this._ids, this._dists, 0, o - 1), this._hullStart = m;
    let A = 3;
    n[m] = e[x] = y, n[y] = e[m] = x, n[x] = e[y] = m, s[m] = 0, s[y] = 1, s[x] = 2, r.fill(-1), r[this._hashKey(O, B)] = m, r[this._hashKey(p, w)] = y, r[this._hashKey(b, M)] = x, this.trianglesLen = 0, this._addTriangle(m, y, x, -1, -1, -1);
    for (let E = 0, T = 0, I = 0; E < this._ids.length; E++) {
      const P = this._ids[E], X = t[2 * P], g = t[2 * P + 1];
      if (E > 0 && Math.abs(X - T) <= an && Math.abs(g - I) <= an || (T = X, I = g, P === m || P === y || P === x)) continue;
      let k = 0;
      for (let v = 0, C = this._hashKey(X, g); v < this._hashSize && (k = r[(C + v) % this._hashSize], !(k !== -1 && k !== n[k])); v++)
        ;
      k = e[k];
      let _ = k, F;
      for (; F = n[_], Mt(X, g, t[2 * _], t[2 * _ + 1], t[2 * F], t[2 * F + 1]) >= 0; )
        if (_ = F, _ === k) {
          _ = -1;
          break;
        }
      if (_ === -1) continue;
      let D = this._addTriangle(_, P, n[_], -1, -1, s[_]);
      s[P] = this._legalize(D + 2), s[_] = D, A++;
      let N = n[_];
      for (; F = n[N], Mt(X, g, t[2 * N], t[2 * N + 1], t[2 * F], t[2 * F + 1]) < 0; )
        D = this._addTriangle(N, P, F, s[P], -1, s[N]), s[P] = this._legalize(D + 2), n[N] = N, A--, N = F;
      if (_ === k)
        for (; F = e[_], Mt(X, g, t[2 * F], t[2 * F + 1], t[2 * _], t[2 * _ + 1]) < 0; )
          D = this._addTriangle(F, P, _, -1, s[_], s[F]), this._legalize(D + 2), s[F] = D, n[_] = _, A--, _ = F;
      this._hullStart = e[P] = _, n[_] = e[N] = P, n[P] = N, r[this._hashKey(X, g)] = P, r[this._hashKey(t[2 * _], t[2 * _ + 1])] = _;
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
    const { _triangles: e, _halfedges: n, coords: s } = this;
    let r = 0, o = 0;
    for (; ; ) {
      const a = n[t], f = t - t % 3;
      if (o = f + (t + 2) % 3, a === -1) {
        if (r === 0) break;
        t = ue[--r];
        continue;
      }
      const c = a - a % 3, h = f + (t + 1) % 3, l = c + (a + 2) % 3, u = e[o], m = e[t], y = e[h], x = e[l];
      if (Tr(
        s[2 * u],
        s[2 * u + 1],
        s[2 * m],
        s[2 * m + 1],
        s[2 * y],
        s[2 * y + 1],
        s[2 * x],
        s[2 * x + 1]
      )) {
        e[t] = x, e[a] = u;
        const B = n[l];
        if (B === -1) {
          let w = this._hullStart;
          do {
            if (this._hullTri[w] === l) {
              this._hullTri[w] = t;
              break;
            }
            w = this._hullPrev[w];
          } while (w !== this._hullStart);
        }
        this._link(t, B), this._link(a, n[o]), this._link(o, l);
        const p = c + (a + 1) % 3;
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
  const f = i - o, c = t - a, h = e - o, l = n - a, u = s - o, m = r - a, y = f * f + c * c, x = h * h + l * l, O = u * u + m * m;
  return f * (l * O - x * m) - c * (h * O - x * u) + y * (h * m - l * u) < 0;
}
function Cr(i, t, e, n, s, r) {
  const o = e - i, a = n - t, f = s - i, c = r - t, h = o * o + a * a, l = f * f + c * c, u = 0.5 / (o * c - a * f), m = (c * h - a * l) * u, y = (o * l - f * h) * u;
  return m * m + y * y;
}
function Dr(i, t, e, n, s, r) {
  const o = e - i, a = n - t, f = s - i, c = r - t, h = o * o + a * a, l = f * f + c * c, u = 0.5 / (o * c - a * f), m = i + (c * h - a * l) * u, y = t + (o * l - f * h) * u;
  return { x: m, y };
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
    const a = i[r], f = t[a];
    for (; ; ) {
      do
        r++;
      while (t[i[r]] < f);
      do
        o--;
      while (t[i[o]] > f);
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
function Pr(i) {
  return i[0];
}
function Nr(i) {
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
  const f = Mt(i, t, s, r, o, a), c = Mt(e, n, s, r, o, a);
  if (f > 0 && c > 0 || f < 0 && c < 0)
    return !1;
  const h = Mt(s, r, i, t, e, n), l = Mt(o, a, i, t, e, n);
  return h > 0 && l > 0 || h < 0 && l < 0 ? !1 : f === 0 && c === 0 && h === 0 && l === 0 ? !(Math.max(s, o) < Math.min(i, e) || Math.max(i, e) < Math.min(s, o) || Math.max(r, a) < Math.min(t, n) || Math.max(t, n) < Math.min(r, a)) : !0;
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
    let a = 0, f = r;
    do {
      if (++a > o)
        throw new Error(
          `Constraining edge [${t}, ${e}] exceeded the iteration limit`
        );
      const l = n[f], u = At(f);
      if (l === e)
        return this.protect(f);
      const m = xt(f), y = n[m];
      if (y === e)
        return this.protect(u), u;
      if (this.intersectSegments(t, e, y, l)) {
        f = m;
        break;
      }
      f = s[u];
    } while (f !== -1 && f !== r);
    let c = f, h = -1;
    for (; f !== -1; ) {
      if (++a > o)
        throw new Error(
          `Constraining edge [${t}, ${e}] exceeded the iteration limit`
        );
      const l = s[f], u = xt(f), m = xt(l), y = At(l);
      if (l === -1)
        throw new Error("Constraining edge exited the hull");
      if (this.consd.has(f))
        throw new Error("Edge intersects already constrained edge");
      if (this.isCollinear(t, e, n[f]) || this.isCollinear(t, e, n[l]))
        throw new Error("Constraining edge intersects point");
      if (!this.intersectSegments(
        n[f],
        n[l],
        n[u],
        n[m]
      )) {
        if (h === -1 && (h = f), n[m] === e) {
          if (f === h)
            throw new Error("Infinite loop: non-convex quadrilateral");
          f = h, h = -1;
          continue;
        }
        if (this.intersectSegments(
          t,
          e,
          n[m],
          n[l]
        ))
          f = m;
        else if (this.intersectSegments(
          t,
          e,
          n[y],
          n[m]
        ))
          f = y;
        else if (h === f)
          throw new Error("Infinite loop: no further intersect after non-convex");
        continue;
      }
      if (this.flipDiagonal(f), this.intersectSegments(
        t,
        e,
        n[u],
        n[m]
      ) && (h === -1 && (h = u), h === u))
        throw new Error("Infinite loop: flipped diagonal still intersects");
      n[m] === e ? (c = m, f = h, h = -1) : this.intersectSegments(
        t,
        e,
        n[y],
        n[m]
      ) && (f = y);
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
        const f = e[a];
        f !== -1 && (n.delete(f), this.isDelaunay(a) || (this.flipDiagonal(a), o++));
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
    const { triangles: n, halfedges: s } = this.del, r = n.length / 3, o = (y, x, O) => {
      const B = t(x), p = t(O);
      return t(y).some((w) => B.includes(w) && p.includes(w));
    }, a = (y) => o(n[y * 3], n[y * 3 + 1], n[y * 3 + 2]), f = (y, x, O, B) => Math.sign(Mt(y[x * 2], y[x * 2 + 1], y[O * 2], y[O * 2 + 1], y[B * 2], y[B * 2 + 1])), c = e.map((y) => {
      let x = 0;
      for (let O = 0; O < r; O++) x += f(y, n[O * 3], n[O * 3 + 1], n[O * 3 + 2]);
      return x < 0 ? -1 : 1;
    }), h = (y) => {
      if (this.consd.has(y)) return !1;
      const x = s[y];
      if (x === -1) return !1;
      const O = n[y], B = n[At(y)], p = n[xt(y)], w = n[xt(x)];
      return e.every((d, b) => f(d, p, O, w) === c[b] && f(d, w, B, p) === c[b]);
    };
    let l = 0, u = !0;
    for (; u; ) {
      u = !1;
      for (let y = 0; y < r; y++)
        if (a(y))
          for (let x = 0; x < 3; x++) {
            const O = y * 3 + x;
            if (!h(O)) continue;
            const B = s[O], p = n[O], w = n[At(O)], d = n[xt(O)], b = n[xt(B)];
            if (!(o(d, p, b) && o(b, w, d))) {
              this.protect(this.flipDiagonal(O)), l++, u = !0;
              break;
            }
          }
    }
    let m = 0;
    for (let y = 0; y < r; y++) a(y) && m++;
    return { flips: l, remaining: m };
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
    let o = n, a, f = 0;
    do {
      if (++f > s.length)
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
    const { triangles: e, halfedges: n } = this.del, s = this.flips, r = this.consd, o = n[t], a = xt(t), f = At(t), c = xt(o), h = At(o), l = n[a], u = n[c];
    if (r.has(t))
      throw new Error("Trying to flip a constrained edge");
    return e[t] = e[c], n[t] = u, s.set(t, s.has(c)) || r.set(t, r.has(c)), u !== -1 && (n[u] = t), n[a] = c, e[o] = e[a], n[o] = l, s.set(o, s.has(a)) || r.set(o, r.has(a)), l !== -1 && (n[l] = o), n[c] = a, this.markFlip(t), this.markFlip(f), this.markFlip(o), this.markFlip(h), s.add(a), r.delete(a), s.add(c), r.delete(c), this.updateVert(t), this.updateVert(f), this.updateVert(o), this.updateVert(h), a;
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
    const r = e[xt(t)], o = e[t], a = e[At(t)], f = e[xt(s)];
    return !this.inCircle(r, o, a, f);
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
    (l) => l.geometry.coordinates
  );
  let r = ve.from(s), o = 0, a;
  if (r.triangles.length !== 0 && (t.length !== 0 || n)) {
    let l = new fn(r);
    try {
      l.constrainAll(t);
    } catch (u) {
      if (!n?.allowUnusableBoundary) throw u;
      return { tin: bt([]), remaining: 0, hasBoundary: !1 };
    }
    n?.boundary && (a = Yr(l, n.boundary), a || (r = ve.from(s), l = new fn(r, t))), n && ({ remaining: o } = l.forbidGroupTriangles(
      n.groupsOf,
      n.planes
    ), o -= a?.size ?? 0);
  }
  const f = [];
  for (let l = 0; l < r.triangles.length; l += 3)
    a?.has(l / 3) || f.push([r.triangles[l], r.triangles[l + 1], r.triangles[l + 2]]);
  const c = ["a", "b", "c"];
  return { tin: bt(
    f.map((l) => {
      const u = {}, m = l.map((y, x) => {
        const O = i.features[y], B = O.geometry.coordinates, p = [B[0], B[1]];
        return B.length === 3 ? p[2] = B[2] : u[c[x]] = O.properties[e], p;
      });
      return m[3] = m[0], ne([m], u);
    })
  ), remaining: o, hasBoundary: a !== void 0 };
}
function Yr(i, t) {
  try {
    i.constrainAll(t);
  } catch {
    return;
  }
  const e = new Map(t), { triangles: n, halfedges: s } = i.del, r = (c) => {
    const h = n[c], l = n[At(c)];
    return e.get(h) === l || e.get(l) === h;
  }, o = /* @__PURE__ */ new Set(), a = [], f = (c) => {
    const h = Math.floor(c / 3);
    o.has(h) || (o.add(h), a.push(h));
  };
  for (let c = 0; c < s.length; c++)
    s[c] === -1 && !r(c) && f(c);
  for (let c = 0; c < a.length; c++)
    for (let h = a[c] * 3; h < a[c] * 3 + 3; h++) {
      if (!e.has(n[h])) return;
      s[h] !== -1 && !r(h) && f(s[h]);
    }
  return o;
}
function Jt(i, t, e) {
  return Nt(i, { target: { geom: t, index: e } });
}
function Qt(i) {
  return Nt(i.properties.target.geom, {
    target: {
      geom: i.geometry.coordinates,
      index: i.properties.target.index
    }
  });
}
function hn(i, t) {
  const e = i.length, n = t.geometry.coordinates;
  return Array.from({ length: e }, (s, r) => r).map((s) => {
    const r = (s + 1) % e, o = i[s], a = i[r], f = o.geometry.coordinates, c = Math.atan2(
      f[0] - n[0],
      f[1] - n[1]
    ), h = [t, o, a, t].map(
      (m) => m.geometry.coordinates
    ), l = {
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
      ne([h], l)
    ]);
    return [c, u];
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
      ({ index: l }) => typeof l == "string" && l.startsWith("b")
    ))
      continue;
    const [a, f, c] = n.geometry.coordinates[0];
    un(a, f, c) * un(s.geom, r.geom, o.geom) * t <= 0 && e++;
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
    const f = (e * (n[(o + 1) % n.length] - n[o]) + s) % s;
    if (!(f > 0 && f < Math.PI)) return !1;
    r += f;
  }
  return Math.abs(r - s) < 1e-6;
}
function pn(i, t, e, n, s) {
  const { minx: r, maxx: o, miny: a, maxy: f, centroid: c } = i, h = o - r, l = f - a, u = e.forw.length, m = Array.from({ length: u }, () => []);
  let y = 1;
  for (const [p, w] of e.edges)
    p < n && m[p].push(y), m[w].push(y), w < n && y++;
  const x = [0], O = (p) => p >= u ? x : m[p];
  let B;
  for (const p of Rr) {
    const w = t(
      {
        ...i,
        minx: r - p * h,
        maxx: o + p * h,
        miny: a - p * l,
        maxy: f + p * l
      },
      !0
    );
    if (s && (w.length < 4 || !w.every(({ bakw: D }) => D.every(Number.isFinite)))) continue;
    const d = w.map(
      ({ forw: D, bakw: N }, v) => Jt(D, N, `b${v}`)
    ), b = bt([...e.forw, ...d]), M = bt([
      ...e.bakw,
      ...d.map(Qt)
    ]), S = [b, M].map(
      ({ features: D }) => Float64Array.from(
        D.flatMap(
          ({
            geometry: {
              coordinates: [N, v]
            }
          }) => [N, v]
        )
      )
    ), E = s !== void 0 || dn(
      w.map((D) => D.forw),
      c.forw,
      -1
    ) && dn(
      w.map((D) => D.bakw),
      c.bakw,
      1
    ) ? w.map((D, N) => [
      u + N,
      u + (N + 1) % w.length
    ]) : void 0, T = { groupsOf: O, planes: S, boundary: E, allowUnusableBoundary: s !== void 0 }, I = De(
      b,
      e.edges,
      "target",
      T
    ), P = De(
      M,
      e.edges,
      "target",
      T
    ), X = I.tin, g = P.tin, k = s?.orientation ?? -1, _ = ye(X, k) + ye(g, k), F = {
      vertices: w,
      forw: X,
      bakw: g,
      diagnostics: {
        margin: p,
        boundaryTriangleFlips: _,
        remainingForbiddenTriangles: I.remaining + P.remaining
      },
      hasMapBoundary: I.hasBoundary,
      hasBoundary: I.hasBoundary && P.hasBoundary
    };
    if (s) {
      if (s.accept(F)) return F;
      continue;
    }
    if (_ === 0 && F.hasBoundary)
      return F;
    Lr(F, B) && (B = F);
  }
  return B;
}
function Vr(i, t) {
  const e = [[], [], [], []], n = [];
  return Object.keys(i).forEach((s) => {
    const r = i[s], o = r.forw, a = r.bakw, f = [
      o[0] - t.forw[0],
      o[1] - t.forw[1]
    ], c = [
      a[0] - t.bakw[0],
      t.bakw[1] - a[1]
    ], h = { forw: f, bakw: c };
    if (n.push(h), f[0] === 0 || f[1] === 0)
      return;
    let l = 0;
    f[0] > 0 && (l += 1), f[1] > 0 && (l += 2), e[l].push(h);
  }), { perQuad: e, aggregate: n };
}
function qr(i) {
  let t = 1 / 0, e = 0, n = 0;
  return i.forEach((s) => {
    const { forw: r, bakw: o } = s, a = Math.hypot(r[0], r[1]), f = Math.hypot(o[0], o[1]);
    if (f === 0) return;
    const c = a / f, h = Math.atan2(r[0], r[1]) - Math.atan2(o[0], o[1]);
    t = Math.min(t, c), e += Math.cos(h), n += Math.sin(h);
  }), isFinite(t) ? [t, Math.atan2(n, e)] : [1, 0];
}
function jr(i, t, e) {
  const { perQuad: n, aggregate: s } = Vr(i, t), r = n.every((f) => f.length > 0), a = (e === "birdeye" ? r ? n : [s] : [s]).map((f) => qr(f));
  return a.length === 1 ? [a[0], a[0], a[0], a[0]] : a;
}
function Ur(i, t) {
  let e = 0;
  return i[0] > t[0] && (e += 1), i[1] > t[1] && (e += 2), e;
}
function zr(i, t, e) {
  const n = [
    i[0] - t.forw[0],
    i[1] - t.forw[1]
  ], r = Math.sqrt(n[0] ** 2 + n[1] ** 2) / e[0], o = Math.atan2(n[0], n[1]) - e[1];
  return [
    t.bakw[0] + r * Math.sin(o),
    t.bakw[1] - r * Math.cos(o)
  ];
}
function Gr(i, t, e, n) {
  const s = t[0] - i[0], r = t[1] - i[1];
  if (Math.abs(s) < 1e-12 && Math.abs(r) < 1e-12) return null;
  const o = n[0] - e[0], a = n[1] - e[1], f = e[0] - i[0], c = e[1] - i[1], h = s * a - r * o;
  if (Math.abs(h) < 1e-12) return null;
  const l = (f * a - c * o) / h, u = (f * r - c * s) / h;
  return l <= 1e-10 || u < -1e-10 || u > 1 + 1e-10 ? null : { t: l, point: [i[0] + l * s, i[1] + l * r] };
}
function Kr(i, t, e) {
  const n = e.length;
  let s = -1 / 0, r = null;
  for (let o = 0; o < n; o++) {
    const a = (o + 1) % n, f = Gr(
      i,
      t,
      e[o].bakw,
      e[a].bakw
    );
    f && f.t > s && (s = f.t, r = f.point);
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
  const f = [];
  if (o !== 0)
    for (const h of [e, n]) {
      const l = (h - i[0]) / o;
      if (l > 0) {
        const u = i[1] + l * a;
        u >= s && u <= r && f.push({ t: l, x: h, y: u });
      }
    }
  if (a !== 0)
    for (const h of [s, r]) {
      const l = (h - i[1]) / a;
      if (l > 0) {
        const u = i[0] + l * o;
        u >= e && u <= n && f.push({ t: l, x: u, y: h });
      }
    }
  if (f.length === 0) return null;
  f.sort((h, l) => h.t - l.t);
  const c = f[0];
  return [c.x, c.y];
}
function wn(i, t, e) {
  const n = i.length, s = new Array(n).fill(1);
  for (const r of t)
    for (let o = 0; o < n; o++) {
      const a = (o + 1) % n, f = Ve([i[o].bakw, i[a].bakw]), c = Ve([e.bakw, r.bakw]), h = gr(f, c);
      if (h.features.length > 0 && h.features[0].geometry) {
        const l = h.features[0], u = Math.sqrt(
          Math.pow(r.bakw[0] - e.bakw[0], 2) + Math.pow(r.bakw[1] - e.bakw[1], 2)
        ), m = Math.sqrt(
          Math.pow(l.geometry.coordinates[0] - e.bakw[0], 2) + Math.pow(l.geometry.coordinates[1] - e.bakw[1], 2)
        ), y = u / m;
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
  const { convexBuf: s, centroid: r, allGcps: o, minx: a, maxx: f, miny: c, maxy: h } = i, l = n ? void 0 : jr(s, r, t), m = [
    [a, c],
    [f, c],
    [f, h],
    [a, h]
  ].map((S) => ({
    forw: S,
    bakw: n ? n(S) : zr(
      S,
      r,
      l[Ur(S, r.forw)]
    )
  }));
  if (m.sort(
    (S, A) => Math.atan2(S.forw[0] - r.forw[0], S.forw[1] - r.forw[1]) - Math.atan2(A.forw[0] - r.forw[0], A.forw[1] - r.forw[1])
  ), n || wn(m, o, r), !e) return m;
  const y = 4, x = m.map(
    (S) => Math.atan2(S.forw[0] - r.forw[0], S.forw[1] - r.forw[1])
  ), O = m.map(
    (S) => Math.atan2(
      S.bakw[0] - r.bakw[0],
      -(S.bakw[1] - r.bakw[1])
    )
  );
  function B(S) {
    for (let A = 0; A < y; A++) {
      const E = (A + 1) % y, T = x[A], I = A < y - 1 ? x[E] : x[E] + 2 * Math.PI;
      let P = S;
      for (; P < T; ) P += 2 * Math.PI;
      for (; P >= T + 2 * Math.PI; ) P -= 2 * Math.PI;
      if (P >= T && P < I)
        return { i: A, j: E, frac: (P - T) / (I - T) };
    }
    return { i: 0, j: 1, frac: 0 };
  }
  function p(S) {
    const { i: A, j: E, frac: T } = B(S), I = O[A];
    let X = O[E] - I;
    for (; X > Math.PI; ) X -= 2 * Math.PI;
    for (; X < -Math.PI; ) X += 2 * Math.PI;
    return I + T * X;
  }
  const w = new Set(
    m.map(
      (S) => Math.floor(mn(S.forw, r.forw) / 10) % 36
    )
  ), d = o.map((S) => ({
    forw: S.forw,
    bakw: S.bakw,
    angleDeg: mn(S.forw, r.forw),
    forwDist: Math.hypot(S.forw[0] - r.forw[0], S.forw[1] - r.forw[1])
  })), b = [];
  for (let S = 0; S < 36; S++) {
    if (w.has(S)) continue;
    const A = S * 10, E = d.filter(
      (_) => _.angleDeg >= A && _.angleDeg < A + 10
    );
    let T = null;
    if (E.length > 0) {
      const _ = E.reduce((F, D) => D.forwDist > F.forwDist ? D : F);
      T = gn(r.forw, _.forw, a, f, c, h);
    }
    if (!T) {
      const _ = (A + 5) % 360 * (Math.PI / 180), F = [
        r.forw[0] + Math.sin(_),
        r.forw[1] + Math.cos(_)
      ];
      T = gn(r.forw, F, a, f, c, h);
    }
    if (!T) continue;
    if (n) {
      b.push({ forw: T, bakw: n(T) });
      continue;
    }
    const I = [T[0] - r.forw[0], T[1] - r.forw[1]], P = Math.atan2(I[0], I[1]), X = p(P), g = [
      r.bakw[0] + Math.sin(X),
      r.bakw[1] - Math.cos(X)
    ], k = Kr(r.bakw, g, m);
    k && b.push({ forw: T, bakw: k });
  }
  const M = [...m, ...b];
  return M.sort(
    (S, A) => Math.atan2(S.forw[0] - r.forw[0], S.forw[1] - r.forw[1]) - Math.atan2(A.forw[0] - r.forw[0], A.forw[1] - r.forw[1])
  ), n || wn(M, o, r), M;
}
function Jr(i, t = !1) {
  return $e(i, "plain", t);
}
function Qr(i, t = !1) {
  return $e(i, "birdeye", t);
}
function Wr(i, t) {
  const e = /* @__PURE__ */ new Set();
  return $e(i, "plain", !0, t).filter(({ forw: [n, s] }) => {
    const r = `${n}:${s}`;
    return e.has(r) ? !1 : (e.add(r), !0);
  });
}
function Fi(i) {
  return Fn(i, 1 / 0);
}
const vn = 1e5, Hr = 16;
function Fn(i, t) {
  return Zr(i), new ti(i).findSegmentIntersections(t).map(
    (s) => Nt([s.x, s.y])
  );
}
function Zr(i) {
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
class ti {
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
    (r != this._xx.length || this._xx.length != this._yy.length) && Rt("ArcCollection#initXYData() Counting error"), this.initBounds(), this._arcIter = new bi(this._xx, this._yy);
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
    let a = 0, f, c, h;
    for (let l = 0; l < s; l++)
      f = n[l], f > 0 && (c = l * 4, h = xi(t, e, a, f), r[c++] = h[0], r[c++] = h[1], r[c++] = h[2], r[c] = h[3], a += f, o.mergeBounds(h));
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
    let f = n ? this._ii[s] : this._ii[s] + o - 1, c = f, h = 0;
    for (let l = 1; l < o; l++)
      c += a, (r === 0 || this._zz[c] >= r) && (e(f, c, this._xx, this._yy), f = c, h++);
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
    const e = this.getBounds(), n = e.ymin || 0, s = (e.ymax || 0) - n, r = this.calcSegmentIntersectionStripeCount(), o = new Uint32Array(r), a = r > 1 ? (w) => Math.floor((r - 1) * (w - n) / s) : () => 0, f = r + 1;
    let c;
    this.forEachSegment(
      (w, d, b, M) => {
        let S = a(M[w]);
        const A = a(M[d]);
        let E = 0;
        for (; o[S] = o[S] + 2, S != A; )
          E++, E > f && Rt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${r}`,
            `s1=${S}`,
            `s2=${A}`
          ), S += A > S ? 1 : -1;
      }
    );
    const h = this.getUint32Array(ri(o));
    let l = 0;
    const u = [];
    ii(o, (w) => {
      const d = l;
      l += w, u.push(h.subarray(d, l));
    }), si(o, 0), this.forEachSegment(
      (w, d, b, M) => {
        let S = a(M[w]);
        const A = a(M[d]);
        let E, T, I = 0;
        for (; E = o[S], o[S] = E + 2, T = u[S], T[E] = w, T[E + 1] = d, S != A; )
          I++, I > f && Rt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${r}`,
            `s1=${S}`,
            `s2=${A}`
          ), S += A > S ? 1 : -1;
      }
    );
    const m = this.getVertexData(), y = t * Hr;
    let x = 0;
    const O = /* @__PURE__ */ new Set(), B = /* @__PURE__ */ new Map(), p = (w) => {
      x++;
      const d = yi(w);
      return O.has(d) || (O.add(d), B.set(`${w.x}:${w.y}`, w)), B.size >= t || x >= y;
    };
    if (m.xx && m.yy)
      for (c = 0; c < r && !oi(u[c], m.xx, m.yy, p); c++)
        ;
    return Array.from(B.values());
  }
}
function Rt(...i) {
  const t = i.join(" ");
  throw new Error(t);
}
function te(i) {
  return i ? ni(i) ? !0 : ei(i) ? !1 : i.length === 0 ? !0 : i.length > 0 : !1;
}
function ei(i) {
  return i != null && i.toString === String.prototype.toString;
}
function ni(i) {
  return Array.isArray(i);
}
function ri(i, t) {
  te(i) || Rt("utils.sum() expects an array, received:", i);
  let e = 0, n;
  for (let s = 0, r = i.length; s < r; s++)
    n = i[s], n && (e += n);
  return e;
}
function ii(i, t, e) {
  if (!te(i))
    throw new Error(`#forEach() takes an array-like argument. ${i}`);
  for (let n = 0, s = i.length; n < s; n++)
    t.call(e, i[n], n);
}
function si(i, t) {
  for (let e = 0, n = i.length; e < n; e++)
    i[e] = t;
  return i;
}
function oi(i, t, e, n) {
  const s = i.length - 2;
  let r, o, a, f, c, h, l, u, m, y, x, O, B, p, w, d, b;
  for (gi(t, i), d = 0; d < s; ) {
    for (r = i[d], o = i[d + 1], c = t[r], h = t[o], m = e[r], y = e[o], b = d; b < s && (b += 2, a = i[b], l = t[a], !(h < l)); ) {
      if (x = e[a], f = i[b + 1], u = t[f], O = e[f], m >= x) {
        if (m > O && y > x && y > O) continue;
      } else if (m < O && y < x && y < O) continue;
      if (!(r == a || r == f || o == a || o == f) && (B = ai(
        c,
        m,
        h,
        y,
        l,
        x,
        u,
        O
      ), B && (p = [r, o], w = [a, f], n(bn(B, p, w, t, e)) || B.length == 4 && n(bn(B.slice(2), p, w, t, e)))))
        return !0;
    }
    d += 2;
  }
  return !1;
}
function ai(i, t, e, n, s, r, o, a) {
  const f = ci(i, t, e, n, s, r, o, a);
  let c = null;
  return f && (c = li(i, t, e, n, s, r, o, a), c ? mi(i, t, e, n, s, r, o, a) && (c = null) : c = pi(i, t, e, n, s, r, o, a)), c;
}
function ci(i, t, e, n, s, r, o, a) {
  return Wt(i, t, e, n, s, r) * Wt(i, t, e, n, o, a) <= 0 && Wt(s, r, o, a, i, t) * Wt(s, r, o, a, e, n) <= 0;
}
function Wt(i, t, e, n, s, r) {
  return Tn(i - s, t - r, e - s, n - r);
}
function Tn(i, t, e, n) {
  return i * n - t * e;
}
function li(i, t, e, n, s, r, o, a) {
  let f = pe(i, t, e, n, s, r, o, a), c;
  return f && (c = hi(f[0], f[1], i, t, e, n, s, r, o, a), c == 1 ? f = pe(e, n, i, t, s, r, o, a) : c == 2 ? f = pe(s, r, o, a, i, t, e, n) : c == 3 && (f = pe(o, a, s, r, i, t, e, n))), f && di(f, i, t, e, n, s, r, o, a), f;
}
function pe(i, t, e, n, s, r, o, a) {
  const f = Tn(e - i, n - t, o - s, a - r), c = 1e-18;
  let h;
  if (f === 0) return null;
  const l = Wt(s, r, o, a, i, t) / f;
  return f <= c && f >= -c ? h = fi(i, t, e, n, s, r, o, a) : h = [i + l * (e - i), t + l * (n - t)], h;
}
function fi(i, t, e, n, s, r, o, a) {
  let f = null;
  return !It(i, s, o) && !It(t, r, a) ? f = [i, t] : !It(e, s, o) && !It(n, r, a) ? f = [e, n] : !It(s, i, e) && !It(r, t, n) ? f = [s, r] : !It(o, i, e) && !It(a, t, n) && (f = [o, a]), f;
}
function It(i, t, e) {
  let n;
  return t < e ? n = i < t || i > e : t > e ? n = i > t || i < e : n = i != t, n;
}
function hi(i, t, ...e) {
  let n = -1, s = 1 / 0, r;
  for (let o = 0, a = 0, f = e.length; a < f; o++, a += 2)
    r = ui(i, t, e[a], e[a + 1]), r < s && (s = r, n = o);
  return n;
}
function ui(i, t, e, n) {
  const s = i - e, r = t - n;
  return s * s + r * r;
}
function di(i, t, e, n, s, r, o, a, f) {
  let c = i[0], h = i[1];
  c = me(c, t, n), c = me(c, r, a), h = me(h, e, s), h = me(h, o, f), i[0] = c, i[1] = h;
}
function me(i, t, e) {
  let n;
  return It(i, t, e) && (n = Math.abs(i - t) < Math.abs(i - e) ? t : e, i = n), i;
}
function pi(i, t, e, n, s, r, o, a) {
  const f = Math.min(i, e, s, o), c = Math.max(i, e, s, o), h = Math.min(t, n, r, a), l = Math.max(t, n, r, a), u = l - h > c - f;
  let m = [];
  return (u ? Pt(t, h, l) : Pt(i, f, c)) && m.push(i, t), (u ? Pt(n, h, l) : Pt(e, f, c)) && m.push(e, n), (u ? Pt(r, h, l) : Pt(s, f, c)) && m.push(s, r), (u ? Pt(a, h, l) : Pt(o, f, c)) && m.push(o, a), (m.length != 2 && m.length != 4 || m.length == 4 && m[0] == m[2] && m[1] == m[3]) && (m = null), m;
}
function mi(i, t, e, n, s, r, o, a) {
  return i == s && t == r || i == o && t == a || e == s && n == r || e == o && n == a;
}
function Pt(i, t, e) {
  return i > t && i < e;
}
function gi(i, t) {
  wi(i, t), Cn(i, t, 0, t.length - 2);
}
function wi(i, t) {
  for (let e = 0, n = t.length; e < n; e += 2)
    i[t[e]] > i[t[e + 1]] && vi(t, e, e + 1);
}
function vi(i, t, e) {
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
  const a = t[0] < e[0] ? t : e, f = a == t ? e : t;
  return { x: r, y: o, a, b: f };
}
function xn(i, t, e, n, s, r) {
  let o = e < n ? e : n, a = o === e ? n : e;
  return s[o] == i && r[o] == t ? a = o : s[a] == i && r[a] == t && (o = a), [o, a];
}
function yi(i) {
  return `${i.a.join(",")};${i.b.join(",")}`;
}
class bi {
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
function xi(i, t, e, n) {
  let s = e | 0;
  const r = isNaN(n) ? i.length - s : n + s;
  let o, a, f, c, h, l;
  if (r > 0)
    f = h = i[s], c = l = t[s];
  else return [void 0, void 0, void 0, void 0];
  for (s++; s < r; s++)
    o = i[s], a = t[s], o < f && (f = o), o > h && (h = o), a < c && (c = a), a > l && (l = a);
  return [f, c, h, l];
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
    let r, o, a, f;
    if (arguments.length == 1)
      if (te(t)) {
        const c = t;
        r = c[0], o = c[1], a = c[2], f = c[3];
      } else {
        const c = t;
        r = c.xmin, o = c.ymin, a = c.xmax, f = c.ymax;
      }
    else
      r = t, o = e, a = n, f = s;
    return this.xmin = r, this.ymin = o, this.xmax = a, this.ymax = f, (r > a || o > f) && this.update(), this;
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
    const a = o.filter((f) => f !== t);
    a.length === 0 ? delete i[r] : i[r] = a;
  }), e) {
    const r = (o, a) => {
      !o || !a || (o.features = o.features.filter((f) => f !== a));
    };
    r(e.forw, t.forw), r(e.bakw, t.bakw);
  }
}
function ge(i, t = 1e-6) {
  const [e, n] = i[0], [s, r] = i[1], [o, a] = i[2];
  return Math.abs((s - e) * (a - n) - (o - e) * (r - n)) < t;
}
function _i(i, t) {
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
const Mi = 10;
function Si(i, t, e, n, s, r) {
  if (!i && !t) return !1;
  const o = i ? 0 : 1, a = 1 - o, f = e[o], c = e[a];
  if (!f || !c) return !1;
  const h = yt(c.geom);
  let l = !1, u = !1;
  for (let m = 0; m <= 1; m++) {
    const y = n[m];
    if (!y) continue;
    const x = [String(y.prop.index), String(f.prop.index)].sort().join("-"), O = s[x];
    if (!O || O.length < 2) continue;
    const B = O.find(
      (I) => I.bakw !== r[o].bakw
    );
    if (!B) continue;
    const w = Ht(B.bakw).find(
      (I) => String(I.prop.index) !== String(y.prop.index) && String(I.prop.index) !== String(f.prop.index)
    );
    if (!w) continue;
    l = !0;
    const d = yt(w.geom), b = yt(y.geom), M = yt(f.geom), S = M[0] - b[0], A = M[1] - b[1], E = S * (h[1] - b[1]) - A * (h[0] - b[0]), T = S * (d[1] - b[1]) - A * (d[0] - b[0]);
    if (E * T > 0) {
      u = !0;
      break;
    }
  }
  return l && !u;
}
function ki(i, t, e, n) {
  if (!i && !t) return !1;
  if (e[0] && e[1] && n[0] && n[1]) {
    const s = n.map((h) => yt(h.geom)), r = e.map((h) => yt(h.geom)), o = s[1][0] - s[0][0], a = s[1][1] - s[0][1], f = o * (r[0][1] - s[0][1]) - a * (r[0][0] - s[0][0]), c = o * (r[1][1] - s[0][1]) - a * (r[1][0] - s[0][0]);
    return f * c < 0;
  }
  return !1;
}
function Ei(i, t, e, n) {
  const s = _i(e, n), r = /* @__PURE__ */ new Set();
  let o = !1;
  for (let a = 0; a < Mi; a++) {
    let f = !1;
    for (const c of Object.keys(t)) {
      if (r.has(c)) continue;
      r.add(c);
      const h = t[c];
      if (!h || h.length < 2) continue;
      const l = c.split("-");
      if (l.length !== 2 || s.has(c)) continue;
      const u = Ht(h[0].bakw), m = Ht(h[1].bakw), y = Ht(h[0].forw), x = Ht(h[1].forw), O = l.map(
        (v) => u.find((C) => `${C.prop.index}` === v) || m.find((C) => `${C.prop.index}` === v)
      ), B = l.map(
        (v) => y.find((C) => `${C.prop.index}` === v) || x.find((C) => `${C.prop.index}` === v)
      );
      if (O.some((v) => !v) || B.some((v) => !v))
        continue;
      const p = [u, m].map(
        (v) => v.find((C) => !l.includes(`${C.prop.index}`))
      ), w = [y, x].map(
        (v) => v.find((C) => !l.includes(`${C.prop.index}`))
      );
      if (p.some((v) => !v) || w.some((v) => !v))
        continue;
      const d = h[0].bakw.geometry.coordinates[0].slice(0, 3).map((v) => yt(v)), b = h[1].bakw.geometry.coordinates[0].slice(0, 3).map((v) => yt(v)), M = h[0].forw.geometry.coordinates[0].slice(0, 3).map((v) => yt(v)), S = h[1].forw.geometry.coordinates[0].slice(0, 3).map((v) => yt(v)), A = ge(d), E = ge(b), T = ge(M), I = ge(S), P = Si(
        A,
        E,
        p,
        O,
        t,
        h
      ), X = ki(
        T,
        I,
        p,
        O
      );
      if (!(P || X || Mn(
        yt(p[0].geom),
        b
      ) || Mn(
        yt(p[1].geom),
        d
      )))
        continue;
      const k = B.map(
        (v) => yt(v.geom)
      ), _ = w.map(
        (v) => yt(v.geom)
      ), F = Ai([
        ...k,
        ..._
      ]), D = Ii(F), N = Sn(
        k[0],
        k[1],
        _[0]
      ) + Sn(
        k[0],
        k[1],
        _[1]
      );
      Pe(D, N) && (_n(t, h[0], i), _n(t, h[1], i), O.forEach((v) => {
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
      }), f = !0, o = !0);
    }
    if (!f) break;
  }
  return o;
}
function yt(i) {
  return [i[0], i[1]];
}
function Mn(i, t) {
  const [e, n] = t[0], [s, r] = t[1], [o, a] = t[2], f = o - e, c = a - n, h = s - e, l = r - n, u = i[0] - e, m = i[1] - n, y = f * f + c * c, x = f * h + c * l, O = f * u + c * m, B = h * h + l * l, p = h * u + l * m, w = y * B - x * x;
  if (w === 0) return !1;
  const d = 1 / w, b = (B * O - x * p) * d, M = (y * p - x * O) * d, S = 1e-9;
  return b >= -S && M >= -S && b + M <= 1 + S;
}
function Ai(i) {
  const t = i.map((o) => o.slice()).filter(
    (o, a, f) => f.findIndex(
      (c) => Pe(c[0], o[0]) && Pe(c[1], o[1])
    ) === a
  );
  if (t.length <= 1) return t;
  const e = t.sort(
    (o, a) => o[0] === a[0] ? o[1] - a[1] : o[0] - a[0]
  ), n = (o, a, f) => (a[0] - o[0]) * (f[1] - o[1]) - (a[1] - o[1]) * (f[0] - o[0]), s = [];
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
function Ii(i) {
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
function Pe(i, t, e = 1e-9) {
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
      const f = t[a];
      f[0] < e && (e = f[0]), f[0] > n && (n = f[0]), f[1] < s && (s = f[1]), f[1] > r && (r = f[1]), o.push(f);
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
      const f = this.tins.bakw.features[a];
      Dn(n, { forw: o, bakw: f });
    });
    const s = (this.pointsSet?.forw.features ?? []).map(
      (o) => o.properties.target.index
    );
    Ei(
      this.tins,
      n,
      this.pointsSet?.edges || [],
      s
    );
    const r = ["forw", "bakw"].map((o) => {
      const a = this.tins[o].features.map(
        (f) => f.geometry.coordinates[0]
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
      if (Bi(r, this.points.length, s), o.length === 0 && a.length === 0) {
        e.push(r);
        continue;
      }
      o.unshift(this.points[r[0]][0]), o.push(this.points[r[1]][0]), a.unshift(this.points[r[0]][1]), a.push(this.points[r[1]][1]);
      const f = [o, a].map((c) => {
        const h = c.map((u, m, y) => {
          if (m === 0) return 0;
          const x = y[m - 1];
          return Math.sqrt(
            Math.pow(u[0] - x[0], 2) + Math.pow(u[1] - x[1], 2)
          );
        }), l = h.reduce((u, m, y) => y === 0 ? [0] : (u.push(u[y - 1] + m), u), []);
        return l.map((u, m, y) => {
          const x = u / y[y.length - 1];
          return [c[m], h[m], l[m], x];
        });
      });
      f.map((c, h) => {
        const l = f[h ? 0 : 1];
        return c.filter((u, m) => !(m === 0 || m === c.length - 1 || u[4] === "handled")).flatMap((u) => {
          const m = u[0], y = u[3], x = l.reduce(
            (O, B, p, w) => {
              if (O) return O;
              const d = w[p + 1];
              if (B[3] === y)
                return B[4] = "handled", [B];
              if (B[3] < y && d && d[3] > y)
                return [B, d];
            },
            void 0
          );
          if (x && x.length === 1)
            return h === 0 ? [[m, x[0][0], y]] : [[x[0][0], m, y]];
          if (x && x.length === 2) {
            const O = x[0], B = x[1], p = (y - O[3]) / (B[3] - O[3]), w = [
              (B[0][0] - O[0][0]) * p + O[0][0],
              (B[0][1] - O[0][1]) * p + O[0][1]
            ];
            return h === 0 ? [[m, w, y]] : [[w, m, y]];
          }
          return [];
        });
      }).reduce((c, h) => c.concat(h), []).sort((c, h) => c[2] < h[2] ? -1 : 1).map((c, h, l) => {
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
        ]), h === l.length - 1 && e.push([t.forw.length - 1, r[1]]);
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
    if (!this.points.reduce((f, c) => f && (r ? Be(c[0], r) : c[0][0] >= t && c[0][0] <= e && c[0][1] >= n && c[0][1] <= s), !0))
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
    let s, r, o, a, f;
    if (e) {
      if (this.bounds) {
        const I = this.boundsPolygon;
        if (!I) throw new Error("Internal error: bounds is set but boundsPolygon is missing");
        if (!this.points.every(
          (X) => Be(X[0], I)
        )) throw "SOME POINTS OUTSIDE";
      }
      s = this.generatePointsSet(), { minx: r, maxx: o, miny: a, maxy: f } = this.computeGcpBbox();
    } else {
      const I = this.validateAndPrepareInputs();
      s = I.pointsSet, r = I.minx, o = I.maxx, a = I.miny, f = I.maxy;
    }
    const c = {
      forw: bt(s.forw),
      bakw: bt(s.bakw)
    }, h = de(
      c.forw,
      s.edges,
      "target"
    ), l = de(
      c.bakw,
      s.edges,
      "target"
    );
    if (h.features.length === 0 || l.features.length === 0)
      throw "TOO LINEAR1";
    const u = yr(c.forw), m = on(c.forw);
    if (!m) throw "TOO LINEAR2";
    const y = {}, x = m.geometry.coordinates[0];
    let O;
    try {
      O = x.map((I) => ({
        forw: I,
        bakw: ie(Nt(I), h)
      })), O.forEach((I) => {
        y[`${I.forw[0]}:${I.forw[1]}`] = I;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const B = on(c.bakw);
    if (!B) throw "TOO LINEAR2";
    const p = B.geometry.coordinates[0];
    try {
      O = p.map((I) => ({
        bakw: I,
        forw: ie(Nt(I), l)
      })), O.forEach((I) => {
        y[`${I.forw[0]}:${I.forw[1]}`] = I;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    let w;
    if (e) {
      const I = u.geometry.coordinates, P = h.features.find(
        (X) => Be(
          Nt(I),
          X
        )
      );
      if (P) {
        const X = P.geometry.coordinates[0], g = P.properties.a.geom, k = P.properties.b.geom, _ = P.properties.c.geom;
        w = {
          forw: [
            (X[0][0] + X[1][0] + X[2][0]) / 3,
            (X[0][1] + X[1][1] + X[2][1]) / 3
          ],
          bakw: [
            (g[0] + k[0] + _[0]) / 3,
            (g[1] + k[1] + _[1]) / 3
          ]
        };
      } else
        w = {
          forw: I,
          bakw: ie(u, h)
        };
    } else
      w = {
        forw: u.geometry.coordinates,
        bakw: ie(u, h)
      };
    const d = Jt(w.forw, w.bakw, "c");
    this.centroid = {
      forw: d,
      bakw: Qt(d)
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
      maxy: f
    };
    if (n) {
      this.stateTriangle = void 0;
      const I = this.yaxisMode === lt.YAXIS_FOLLOW, P = I ? 1 : -1, X = pn(
        M,
        (g) => Wr(g, (k) => {
          const [_, F] = Vn(n, k);
          return [_, I ? -F : F];
        }),
        s,
        this.points.length,
        {
          orientation: P,
          accept: (g) => g.hasMapBoundary ? (this.buildTin(s, g.vertices, t, g), (this.strict_status !== lt.STATUS_LOOSE || g.hasBoundary) && ye(this.tins.forw, P) === 0 && ye(this.tins.bakw, P) === 0) : !1
        }
      );
      if (X) {
        this.compiledOuter = {
          outerTransform: "worldFile",
          worldFile: n,
          vertices_points: X.vertices.map(({ forw: D, bakw: N }) => [D, N])
        };
        const { centroid: g, xy: k, wh: _, kinks: F } = this;
        super.setCompiled(this.getCompiled()), Object.assign(this, { centroid: g, xy: k, wh: _, kinks: F }), this.lastBoundaryDiagnostics = {
          ...X.diagnostics,
          requestedOuterTransform: "worldFile",
          outerTransform: "worldFile"
        };
        return;
      }
      this.compiledOuter = { outerTransform: "extrapolate" }, this.outerTransform = "extrapolate", this.worldFile = void 0;
    }
    const S = this.vertexMode === lt.VERTEX_BIRDEYE ? Qr : Jr, A = e ? pn(M, S, s, this.points.length) : void 0, E = A?.vertices ?? S(M, !1), T = this.buildTin(s, E, t, A);
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
  buildTin(t, e, n, s) {
    const r = {
      forw: [],
      bakw: []
    };
    for (let o = 0; o < e.length; o++) {
      const a = e[o].forw, f = e[o].bakw, c = Jt(a, f, `b${o}`), h = Qt(c);
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
function Bi(i, t, e) {
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
  Fi as findIntersections,
  kn as format_version,
  Dn as insertSearchIndex,
  hn as vertexCalc
};
