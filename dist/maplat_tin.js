import { counterTri as as, Transform as Is, validateWorldFile as As, normalizeEdges as Ns, transformArr as De, rotateVerticesTriangle as hn, worldFileToCrs as Os } from "@maplat/transform";
function re(r, t, e = {}) {
  const n = { type: "Feature" };
  return (e.id === 0 || e.id) && (n.id = e.id), e.bbox && (n.bbox = e.bbox), n.properties = t || {}, n.geometry = r, n;
}
function qt(r, t, e = {}) {
  if (!r)
    throw new Error("coordinates is required");
  if (!Array.isArray(r))
    throw new Error("coordinates must be an Array");
  if (r.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!dn(r[0]) || !dn(r[1]))
    throw new Error("coordinates must contain numbers");
  return re({
    type: "Point",
    coordinates: r
  }, t, e);
}
function ce(r, t, e = {}) {
  for (const s of r) {
    if (s.length < 4)
      throw new Error(
        "Each LinearRing of a Polygon must have 4 or more Positions."
      );
    if (s[s.length - 1].length !== s[0].length)
      throw new Error("First and last Position are not equivalent.");
    for (let o = 0; o < s[s.length - 1].length; o++)
      if (s[s.length - 1][o] !== s[0][o])
        throw new Error("First and last Position are not equivalent.");
  }
  return re({
    type: "Polygon",
    coordinates: r
  }, t, e);
}
function un(r, t, e = {}) {
  if (r.length < 2)
    throw new Error("coordinates must be an array of two or more positions");
  return re({
    type: "LineString",
    coordinates: r
  }, t, e);
}
function St(r, t = {}) {
  const e = { type: "FeatureCollection" };
  return t.id && (e.id = t.id), t.bbox && (e.bbox = t.bbox), e.features = r, e;
}
function dn(r) {
  return !isNaN(r) && r !== null && !Array.isArray(r);
}
function Ts(r) {
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
function Fs(r) {
  return r.type === "Feature" ? r.geometry : r;
}
function tn(r, t, e) {
  if (r !== null)
    for (var n, s, o, i, a, c, l, f = 0, h = 0, u, p = r.type, b = p === "FeatureCollection", v = p === "Feature", x = b ? r.features.length : 1, A = 0; A < x; A++) {
      l = b ? (
        // @ts-expect-error: Known type conflict
        r.features[A].geometry
      ) : v ? (
        // @ts-expect-error: Known type conflict
        r.geometry
      ) : r, u = l ? l.type === "GeometryCollection" : !1, a = u ? l.geometries.length : 1;
      for (var y = 0; y < a; y++) {
        var m = 0, d = 0;
        if (i = u ? l.geometries[y] : l, i !== null) {
          c = i.coordinates;
          var g = i.type;
          switch (f = e && (g === "Polygon" || g === "MultiPolygon") ? 1 : 0, g) {
            case null:
              break;
            case "Point":
              if (
                // @ts-expect-error: Known type conflict
                t(
                  c,
                  h,
                  A,
                  m,
                  d
                ) === !1
              )
                return !1;
              h++, m++;
              break;
            case "LineString":
            case "MultiPoint":
              for (n = 0; n < c.length; n++) {
                if (
                  // @ts-expect-error: Known type conflict
                  t(
                    c[n],
                    h,
                    A,
                    m,
                    d
                  ) === !1
                )
                  return !1;
                h++, g === "MultiPoint" && m++;
              }
              g === "LineString" && m++;
              break;
            case "Polygon":
            case "MultiLineString":
              for (n = 0; n < c.length; n++) {
                for (s = 0; s < c[n].length - f; s++) {
                  if (
                    // @ts-expect-error: Known type conflict
                    t(
                      c[n][s],
                      h,
                      A,
                      m,
                      d
                    ) === !1
                  )
                    return !1;
                  h++;
                }
                g === "MultiLineString" && m++, g === "Polygon" && d++;
              }
              g === "Polygon" && m++;
              break;
            case "MultiPolygon":
              for (n = 0; n < c.length; n++) {
                for (d = 0, s = 0; s < c[n].length; s++) {
                  for (o = 0; o < c[n][s].length - f; o++) {
                    if (
                      // @ts-expect-error: Known type conflict
                      t(
                        c[n][s][o],
                        h,
                        A,
                        m,
                        d
                      ) === !1
                    )
                      return !1;
                    h++;
                  }
                  d++;
                }
                m++;
              }
              break;
            case "GeometryCollection":
              for (n = 0; n < i.geometries.length; n++)
                if (
                  // @ts-expect-error: Known type conflict
                  tn(i.geometries[n], t, e) === !1
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
const mt = 11102230246251565e-32, W = 134217729, cs = (3 + 8 * mt) * mt;
function gt(r, t, e, n, s) {
  let o, i, a, c, l = t[0], f = n[0], h = 0, u = 0;
  f > l == f > -l ? (o = l, l = t[++h]) : (o = f, f = n[++u]);
  let p = 0;
  if (h < r && u < e)
    for (f > l == f > -l ? (i = l + o, a = o - (i - l), l = t[++h]) : (i = f + o, a = o - (i - f), f = n[++u]), o = i, a !== 0 && (s[p++] = a); h < r && u < e; )
      f > l == f > -l ? (i = o + l, c = i - o, a = o - (i - c) + (l - c), l = t[++h]) : (i = o + f, c = i - o, a = o - (i - c) + (f - c), f = n[++u]), o = i, a !== 0 && (s[p++] = a);
  for (; h < r; )
    i = o + l, c = i - o, a = o - (i - c) + (l - c), l = t[++h], o = i, a !== 0 && (s[p++] = a);
  for (; u < e; )
    i = o + f, c = i - o, a = o - (i - c) + (f - c), f = n[++u], o = i, a !== 0 && (s[p++] = a);
  return (o !== 0 || p === 0) && (s[p++] = o), p;
}
function _t(r, t, e, n, s, o, i, a) {
  return gt(gt(r, t, e, n, i), i, s, o, a);
}
function j(r, t, e, n) {
  let s, o, i, a, c, l, f, h, u, p, b;
  f = W * e, p = f - (f - e), b = e - p;
  let v = t[0];
  s = v * e, f = W * v, h = f - (f - v), u = v - h, i = u * b - (s - h * p - u * p - h * b);
  let x = 0;
  i !== 0 && (n[x++] = i);
  for (let A = 1; A < r; A++)
    v = t[A], a = v * e, f = W * v, h = f - (f - v), u = v - h, c = u * b - (a - h * p - u * p - h * b), o = s + c, l = o - s, i = s - (o - l) + (c - l), i !== 0 && (n[x++] = i), s = a + o, i = o - (s - a), i !== 0 && (n[x++] = i);
  return (s !== 0 || x === 0) && (n[x++] = s), x;
}
function ls(r, t) {
  let e = t[0];
  for (let n = 1; n < r; n++) e += t[n];
  return e;
}
function et(r) {
  return new Float64Array(r);
}
const Bs = (3 + 16 * mt) * mt, Rs = (2 + 12 * mt) * mt, Ps = (9 + 64 * mt) * mt * mt, jt = et(4), gn = et(8), pn = et(12), mn = et(16), wt = et(4);
function Ds(r, t, e, n, s, o, i) {
  let a, c, l, f, h, u, p, b, v, x, A, y, m, d, g, w, k, S;
  const M = r - s, T = e - s, N = t - o, P = n - o;
  d = M * P, u = W * M, p = u - (u - M), b = M - p, u = W * P, v = u - (u - P), x = P - v, g = b * x - (d - p * v - b * v - p * x), w = N * T, u = W * N, p = u - (u - N), b = N - p, u = W * T, v = u - (u - T), x = T - v, k = b * x - (w - p * v - b * v - p * x), A = g - k, h = g - A, jt[0] = g - (A + h) + (h - k), y = d + A, h = y - d, m = d - (y - h) + (A - h), A = m - w, h = m - A, jt[1] = m - (A + h) + (h - w), S = y + A, h = S - y, jt[2] = y - (S - h) + (A - h), jt[3] = S;
  let C = ls(4, jt), _ = Rs * i;
  if (C >= _ || -C >= _ || (h = r - M, a = r - (M + h) + (h - s), h = e - T, l = e - (T + h) + (h - s), h = t - N, c = t - (N + h) + (h - o), h = n - P, f = n - (P + h) + (h - o), a === 0 && c === 0 && l === 0 && f === 0) || (_ = Ps * i + cs * Math.abs(C), C += M * f + P * a - (N * l + T * c), C >= _ || -C >= _)) return C;
  d = a * P, u = W * a, p = u - (u - a), b = a - p, u = W * P, v = u - (u - P), x = P - v, g = b * x - (d - p * v - b * v - p * x), w = c * T, u = W * c, p = u - (u - c), b = c - p, u = W * T, v = u - (u - T), x = T - v, k = b * x - (w - p * v - b * v - p * x), A = g - k, h = g - A, wt[0] = g - (A + h) + (h - k), y = d + A, h = y - d, m = d - (y - h) + (A - h), A = m - w, h = m - A, wt[1] = m - (A + h) + (h - w), S = y + A, h = S - y, wt[2] = y - (S - h) + (A - h), wt[3] = S;
  const O = gt(4, jt, 4, wt, gn);
  d = M * f, u = W * M, p = u - (u - M), b = M - p, u = W * f, v = u - (u - f), x = f - v, g = b * x - (d - p * v - b * v - p * x), w = N * l, u = W * N, p = u - (u - N), b = N - p, u = W * l, v = u - (u - l), x = l - v, k = b * x - (w - p * v - b * v - p * x), A = g - k, h = g - A, wt[0] = g - (A + h) + (h - k), y = d + A, h = y - d, m = d - (y - h) + (A - h), A = m - w, h = m - A, wt[1] = m - (A + h) + (h - w), S = y + A, h = S - y, wt[2] = y - (S - h) + (A - h), wt[3] = S;
  const I = gt(O, gn, 4, wt, pn);
  d = a * f, u = W * a, p = u - (u - a), b = a - p, u = W * f, v = u - (u - f), x = f - v, g = b * x - (d - p * v - b * v - p * x), w = c * l, u = W * c, p = u - (u - c), b = c - p, u = W * l, v = u - (u - l), x = l - v, k = b * x - (w - p * v - b * v - p * x), A = g - k, h = g - A, wt[0] = g - (A + h) + (h - k), y = d + A, h = y - d, m = d - (y - h) + (A - h), A = m - w, h = m - A, wt[1] = m - (A + h) + (h - w), S = y + A, h = S - y, wt[2] = y - (S - h) + (A - h), wt[3] = S;
  const B = gt(I, pn, 4, wt, mn);
  return mn[B - 1];
}
function it(r, t, e, n, s, o) {
  const i = (t - o) * (e - s), a = (r - s) * (n - o), c = i - a, l = Math.abs(i + a);
  return Math.abs(c) >= Bs * l ? c : -Ds(r, t, e, n, s, o, l);
}
const Cs = (10 + 96 * mt) * mt, $s = (4 + 48 * mt) * mt, Vs = (44 + 576 * mt) * mt * mt, Bt = et(4), Rt = et(4), Pt = et(4), It = et(4), At = et(4), Nt = et(4), vt = et(4), yt = et(4), Ce = et(8), $e = et(8), Ve = et(8), Xe = et(8), Le = et(8), ze = et(8), fe = et(8), he = et(8), ue = et(8), Vt = et(4), Xt = et(4), Lt = et(4), J = et(8), Z = et(16), rt = et(16), ot = et(16), nt = et(32), Dt = et(32), ut = et(48), xt = et(64);
let Jt = et(1152), Ye = et(1152);
function dt(r, t, e) {
  r = gt(r, Jt, t, e, Ye);
  const n = Jt;
  return Jt = Ye, Ye = n, r;
}
function Xs(r, t, e, n, s, o, i, a, c) {
  let l, f, h, u, p, b, v, x, A, y, m, d, g, w, k, S, M, T, N, P, C, _, O, I, B, D, $, E, R, X, z, q, Y, L, U;
  const H = r - i, F = e - i, V = s - i, G = t - a, K = n - a, Q = o - a;
  z = F * Q, O = W * F, I = O - (O - F), B = F - I, O = W * Q, D = O - (O - Q), $ = Q - D, q = B * $ - (z - I * D - B * D - I * $), Y = V * K, O = W * V, I = O - (O - V), B = V - I, O = W * K, D = O - (O - K), $ = K - D, L = B * $ - (Y - I * D - B * D - I * $), E = q - L, _ = q - E, Bt[0] = q - (E + _) + (_ - L), R = z + E, _ = R - z, X = z - (R - _) + (E - _), E = X - Y, _ = X - E, Bt[1] = X - (E + _) + (_ - Y), U = R + E, _ = U - R, Bt[2] = R - (U - _) + (E - _), Bt[3] = U, z = V * G, O = W * V, I = O - (O - V), B = V - I, O = W * G, D = O - (O - G), $ = G - D, q = B * $ - (z - I * D - B * D - I * $), Y = H * Q, O = W * H, I = O - (O - H), B = H - I, O = W * Q, D = O - (O - Q), $ = Q - D, L = B * $ - (Y - I * D - B * D - I * $), E = q - L, _ = q - E, Rt[0] = q - (E + _) + (_ - L), R = z + E, _ = R - z, X = z - (R - _) + (E - _), E = X - Y, _ = X - E, Rt[1] = X - (E + _) + (_ - Y), U = R + E, _ = U - R, Rt[2] = R - (U - _) + (E - _), Rt[3] = U, z = H * K, O = W * H, I = O - (O - H), B = H - I, O = W * K, D = O - (O - K), $ = K - D, q = B * $ - (z - I * D - B * D - I * $), Y = F * G, O = W * F, I = O - (O - F), B = F - I, O = W * G, D = O - (O - G), $ = G - D, L = B * $ - (Y - I * D - B * D - I * $), E = q - L, _ = q - E, Pt[0] = q - (E + _) + (_ - L), R = z + E, _ = R - z, X = z - (R - _) + (E - _), E = X - Y, _ = X - E, Pt[1] = X - (E + _) + (_ - Y), U = R + E, _ = U - R, Pt[2] = R - (U - _) + (E - _), Pt[3] = U, l = gt(
    gt(
      gt(
        j(j(4, Bt, H, J), J, H, Z),
        Z,
        j(j(4, Bt, G, J), J, G, rt),
        rt,
        nt
      ),
      nt,
      gt(
        j(j(4, Rt, F, J), J, F, Z),
        Z,
        j(j(4, Rt, K, J), J, K, rt),
        rt,
        Dt
      ),
      Dt,
      xt
    ),
    xt,
    gt(
      j(j(4, Pt, V, J), J, V, Z),
      Z,
      j(j(4, Pt, Q, J), J, Q, rt),
      rt,
      nt
    ),
    nt,
    Jt
  );
  let tt = ls(l, Jt), lt = $s * c;
  if (tt >= lt || -tt >= lt || (_ = r - H, f = r - (H + _) + (_ - i), _ = t - G, p = t - (G + _) + (_ - a), _ = e - F, h = e - (F + _) + (_ - i), _ = n - K, b = n - (K + _) + (_ - a), _ = s - V, u = s - (V + _) + (_ - i), _ = o - Q, v = o - (Q + _) + (_ - a), f === 0 && h === 0 && u === 0 && p === 0 && b === 0 && v === 0) || (lt = Vs * c + cs * Math.abs(tt), tt += (H * H + G * G) * (F * v + Q * h - (K * u + V * b)) + 2 * (H * f + G * p) * (F * Q - K * V) + ((F * F + K * K) * (V * p + G * u - (Q * f + H * v)) + 2 * (F * h + K * b) * (V * G - Q * H)) + ((V * V + Q * Q) * (H * b + K * f - (G * h + F * p)) + 2 * (V * u + Q * v) * (H * K - G * F)), tt >= lt || -tt >= lt))
    return tt;
  if ((h !== 0 || b !== 0 || u !== 0 || v !== 0) && (z = H * H, O = W * H, I = O - (O - H), B = H - I, q = B * B - (z - I * I - (I + I) * B), Y = G * G, O = W * G, I = O - (O - G), B = G - I, L = B * B - (Y - I * I - (I + I) * B), E = q + L, _ = E - q, It[0] = q - (E - _) + (L - _), R = z + E, _ = R - z, X = z - (R - _) + (E - _), E = X + Y, _ = E - X, It[1] = X - (E - _) + (Y - _), U = R + E, _ = U - R, It[2] = R - (U - _) + (E - _), It[3] = U), (u !== 0 || v !== 0 || f !== 0 || p !== 0) && (z = F * F, O = W * F, I = O - (O - F), B = F - I, q = B * B - (z - I * I - (I + I) * B), Y = K * K, O = W * K, I = O - (O - K), B = K - I, L = B * B - (Y - I * I - (I + I) * B), E = q + L, _ = E - q, At[0] = q - (E - _) + (L - _), R = z + E, _ = R - z, X = z - (R - _) + (E - _), E = X + Y, _ = E - X, At[1] = X - (E - _) + (Y - _), U = R + E, _ = U - R, At[2] = R - (U - _) + (E - _), At[3] = U), (f !== 0 || p !== 0 || h !== 0 || b !== 0) && (z = V * V, O = W * V, I = O - (O - V), B = V - I, q = B * B - (z - I * I - (I + I) * B), Y = Q * Q, O = W * Q, I = O - (O - Q), B = Q - I, L = B * B - (Y - I * I - (I + I) * B), E = q + L, _ = E - q, Nt[0] = q - (E - _) + (L - _), R = z + E, _ = R - z, X = z - (R - _) + (E - _), E = X + Y, _ = E - X, Nt[1] = X - (E - _) + (Y - _), U = R + E, _ = U - R, Nt[2] = R - (U - _) + (E - _), Nt[3] = U), f !== 0 && (x = j(4, Bt, f, Ce), l = dt(l, _t(
    j(x, Ce, 2 * H, Z),
    Z,
    j(j(4, Nt, f, J), J, K, rt),
    rt,
    j(j(4, At, f, J), J, -Q, ot),
    ot,
    nt,
    ut
  ), ut)), p !== 0 && (A = j(4, Bt, p, $e), l = dt(l, _t(
    j(A, $e, 2 * G, Z),
    Z,
    j(j(4, At, p, J), J, V, rt),
    rt,
    j(j(4, Nt, p, J), J, -F, ot),
    ot,
    nt,
    ut
  ), ut)), h !== 0 && (y = j(4, Rt, h, Ve), l = dt(l, _t(
    j(y, Ve, 2 * F, Z),
    Z,
    j(j(4, It, h, J), J, Q, rt),
    rt,
    j(j(4, Nt, h, J), J, -G, ot),
    ot,
    nt,
    ut
  ), ut)), b !== 0 && (m = j(4, Rt, b, Xe), l = dt(l, _t(
    j(m, Xe, 2 * K, Z),
    Z,
    j(j(4, Nt, b, J), J, H, rt),
    rt,
    j(j(4, It, b, J), J, -V, ot),
    ot,
    nt,
    ut
  ), ut)), u !== 0 && (d = j(4, Pt, u, Le), l = dt(l, _t(
    j(d, Le, 2 * V, Z),
    Z,
    j(j(4, At, u, J), J, G, rt),
    rt,
    j(j(4, It, u, J), J, -K, ot),
    ot,
    nt,
    ut
  ), ut)), v !== 0 && (g = j(4, Pt, v, ze), l = dt(l, _t(
    j(g, ze, 2 * Q, Z),
    Z,
    j(j(4, It, v, J), J, F, rt),
    rt,
    j(j(4, At, v, J), J, -H, ot),
    ot,
    nt,
    ut
  ), ut)), f !== 0 || p !== 0) {
    if (h !== 0 || b !== 0 || u !== 0 || v !== 0 ? (z = h * Q, O = W * h, I = O - (O - h), B = h - I, O = W * Q, D = O - (O - Q), $ = Q - D, q = B * $ - (z - I * D - B * D - I * $), Y = F * v, O = W * F, I = O - (O - F), B = F - I, O = W * v, D = O - (O - v), $ = v - D, L = B * $ - (Y - I * D - B * D - I * $), E = q + L, _ = E - q, vt[0] = q - (E - _) + (L - _), R = z + E, _ = R - z, X = z - (R - _) + (E - _), E = X + Y, _ = E - X, vt[1] = X - (E - _) + (Y - _), U = R + E, _ = U - R, vt[2] = R - (U - _) + (E - _), vt[3] = U, z = u * -K, O = W * u, I = O - (O - u), B = u - I, O = W * -K, D = O - (O - -K), $ = -K - D, q = B * $ - (z - I * D - B * D - I * $), Y = V * -b, O = W * V, I = O - (O - V), B = V - I, O = W * -b, D = O - (O - -b), $ = -b - D, L = B * $ - (Y - I * D - B * D - I * $), E = q + L, _ = E - q, yt[0] = q - (E - _) + (L - _), R = z + E, _ = R - z, X = z - (R - _) + (E - _), E = X + Y, _ = E - X, yt[1] = X - (E - _) + (Y - _), U = R + E, _ = U - R, yt[2] = R - (U - _) + (E - _), yt[3] = U, k = gt(4, vt, 4, yt, he), z = h * v, O = W * h, I = O - (O - h), B = h - I, O = W * v, D = O - (O - v), $ = v - D, q = B * $ - (z - I * D - B * D - I * $), Y = u * b, O = W * u, I = O - (O - u), B = u - I, O = W * b, D = O - (O - b), $ = b - D, L = B * $ - (Y - I * D - B * D - I * $), E = q - L, _ = q - E, Xt[0] = q - (E + _) + (_ - L), R = z + E, _ = R - z, X = z - (R - _) + (E - _), E = X - Y, _ = X - E, Xt[1] = X - (E + _) + (_ - Y), U = R + E, _ = U - R, Xt[2] = R - (U - _) + (E - _), Xt[3] = U, T = 4) : (he[0] = 0, k = 1, Xt[0] = 0, T = 1), f !== 0) {
      const at = j(k, he, f, ot);
      l = dt(l, gt(
        j(x, Ce, f, Z),
        Z,
        j(at, ot, 2 * H, nt),
        nt,
        ut
      ), ut);
      const ct = j(T, Xt, f, J);
      l = dt(l, _t(
        j(ct, J, 2 * H, Z),
        Z,
        j(ct, J, f, rt),
        rt,
        j(at, ot, f, nt),
        nt,
        Dt,
        xt
      ), xt), b !== 0 && (l = dt(l, j(j(4, Nt, f, J), J, b, Z), Z)), v !== 0 && (l = dt(l, j(j(4, At, -f, J), J, v, Z), Z));
    }
    if (p !== 0) {
      const at = j(k, he, p, ot);
      l = dt(l, gt(
        j(A, $e, p, Z),
        Z,
        j(at, ot, 2 * G, nt),
        nt,
        ut
      ), ut);
      const ct = j(T, Xt, p, J);
      l = dt(l, _t(
        j(ct, J, 2 * G, Z),
        Z,
        j(ct, J, p, rt),
        rt,
        j(at, ot, p, nt),
        nt,
        Dt,
        xt
      ), xt);
    }
  }
  if (h !== 0 || b !== 0) {
    if (u !== 0 || v !== 0 || f !== 0 || p !== 0 ? (z = u * G, O = W * u, I = O - (O - u), B = u - I, O = W * G, D = O - (O - G), $ = G - D, q = B * $ - (z - I * D - B * D - I * $), Y = V * p, O = W * V, I = O - (O - V), B = V - I, O = W * p, D = O - (O - p), $ = p - D, L = B * $ - (Y - I * D - B * D - I * $), E = q + L, _ = E - q, vt[0] = q - (E - _) + (L - _), R = z + E, _ = R - z, X = z - (R - _) + (E - _), E = X + Y, _ = E - X, vt[1] = X - (E - _) + (Y - _), U = R + E, _ = U - R, vt[2] = R - (U - _) + (E - _), vt[3] = U, P = -Q, C = -v, z = f * P, O = W * f, I = O - (O - f), B = f - I, O = W * P, D = O - (O - P), $ = P - D, q = B * $ - (z - I * D - B * D - I * $), Y = H * C, O = W * H, I = O - (O - H), B = H - I, O = W * C, D = O - (O - C), $ = C - D, L = B * $ - (Y - I * D - B * D - I * $), E = q + L, _ = E - q, yt[0] = q - (E - _) + (L - _), R = z + E, _ = R - z, X = z - (R - _) + (E - _), E = X + Y, _ = E - X, yt[1] = X - (E - _) + (Y - _), U = R + E, _ = U - R, yt[2] = R - (U - _) + (E - _), yt[3] = U, S = gt(4, vt, 4, yt, ue), z = u * p, O = W * u, I = O - (O - u), B = u - I, O = W * p, D = O - (O - p), $ = p - D, q = B * $ - (z - I * D - B * D - I * $), Y = f * v, O = W * f, I = O - (O - f), B = f - I, O = W * v, D = O - (O - v), $ = v - D, L = B * $ - (Y - I * D - B * D - I * $), E = q - L, _ = q - E, Lt[0] = q - (E + _) + (_ - L), R = z + E, _ = R - z, X = z - (R - _) + (E - _), E = X - Y, _ = X - E, Lt[1] = X - (E + _) + (_ - Y), U = R + E, _ = U - R, Lt[2] = R - (U - _) + (E - _), Lt[3] = U, N = 4) : (ue[0] = 0, S = 1, Lt[0] = 0, N = 1), h !== 0) {
      const at = j(S, ue, h, ot);
      l = dt(l, gt(
        j(y, Ve, h, Z),
        Z,
        j(at, ot, 2 * F, nt),
        nt,
        ut
      ), ut);
      const ct = j(N, Lt, h, J);
      l = dt(l, _t(
        j(ct, J, 2 * F, Z),
        Z,
        j(ct, J, h, rt),
        rt,
        j(at, ot, h, nt),
        nt,
        Dt,
        xt
      ), xt), v !== 0 && (l = dt(l, j(j(4, It, h, J), J, v, Z), Z)), p !== 0 && (l = dt(l, j(j(4, Nt, -h, J), J, p, Z), Z));
    }
    if (b !== 0) {
      const at = j(S, ue, b, ot);
      l = dt(l, gt(
        j(m, Xe, b, Z),
        Z,
        j(at, ot, 2 * K, nt),
        nt,
        ut
      ), ut);
      const ct = j(N, Lt, b, J);
      l = dt(l, _t(
        j(ct, J, 2 * K, Z),
        Z,
        j(ct, J, b, rt),
        rt,
        j(at, ot, b, nt),
        nt,
        Dt,
        xt
      ), xt);
    }
  }
  if (u !== 0 || v !== 0) {
    if (f !== 0 || p !== 0 || h !== 0 || b !== 0 ? (z = f * K, O = W * f, I = O - (O - f), B = f - I, O = W * K, D = O - (O - K), $ = K - D, q = B * $ - (z - I * D - B * D - I * $), Y = H * b, O = W * H, I = O - (O - H), B = H - I, O = W * b, D = O - (O - b), $ = b - D, L = B * $ - (Y - I * D - B * D - I * $), E = q + L, _ = E - q, vt[0] = q - (E - _) + (L - _), R = z + E, _ = R - z, X = z - (R - _) + (E - _), E = X + Y, _ = E - X, vt[1] = X - (E - _) + (Y - _), U = R + E, _ = U - R, vt[2] = R - (U - _) + (E - _), vt[3] = U, P = -G, C = -p, z = h * P, O = W * h, I = O - (O - h), B = h - I, O = W * P, D = O - (O - P), $ = P - D, q = B * $ - (z - I * D - B * D - I * $), Y = F * C, O = W * F, I = O - (O - F), B = F - I, O = W * C, D = O - (O - C), $ = C - D, L = B * $ - (Y - I * D - B * D - I * $), E = q + L, _ = E - q, yt[0] = q - (E - _) + (L - _), R = z + E, _ = R - z, X = z - (R - _) + (E - _), E = X + Y, _ = E - X, yt[1] = X - (E - _) + (Y - _), U = R + E, _ = U - R, yt[2] = R - (U - _) + (E - _), yt[3] = U, w = gt(4, vt, 4, yt, fe), z = f * b, O = W * f, I = O - (O - f), B = f - I, O = W * b, D = O - (O - b), $ = b - D, q = B * $ - (z - I * D - B * D - I * $), Y = h * p, O = W * h, I = O - (O - h), B = h - I, O = W * p, D = O - (O - p), $ = p - D, L = B * $ - (Y - I * D - B * D - I * $), E = q - L, _ = q - E, Vt[0] = q - (E + _) + (_ - L), R = z + E, _ = R - z, X = z - (R - _) + (E - _), E = X - Y, _ = X - E, Vt[1] = X - (E + _) + (_ - Y), U = R + E, _ = U - R, Vt[2] = R - (U - _) + (E - _), Vt[3] = U, M = 4) : (fe[0] = 0, w = 1, Vt[0] = 0, M = 1), u !== 0) {
      const at = j(w, fe, u, ot);
      l = dt(l, gt(
        j(d, Le, u, Z),
        Z,
        j(at, ot, 2 * V, nt),
        nt,
        ut
      ), ut);
      const ct = j(M, Vt, u, J);
      l = dt(l, _t(
        j(ct, J, 2 * V, Z),
        Z,
        j(ct, J, u, rt),
        rt,
        j(at, ot, u, nt),
        nt,
        Dt,
        xt
      ), xt), p !== 0 && (l = dt(l, j(j(4, At, u, J), J, p, Z), Z)), b !== 0 && (l = dt(l, j(j(4, It, -u, J), J, b, Z), Z));
    }
    if (v !== 0) {
      const at = j(w, fe, v, ot);
      l = dt(l, gt(
        j(g, ze, v, Z),
        Z,
        j(at, ot, 2 * Q, nt),
        nt,
        ut
      ), ut);
      const ct = j(M, Vt, v, J);
      l = dt(l, _t(
        j(ct, J, 2 * Q, Z),
        Z,
        j(ct, J, v, rt),
        rt,
        j(at, ot, v, nt),
        nt,
        Dt,
        xt
      ), xt);
    }
  }
  return Jt[l - 1];
}
function Fe(r, t, e, n, s, o, i, a) {
  const c = r - i, l = e - i, f = s - i, h = t - a, u = n - a, p = o - a, b = l * p, v = f * u, x = c * c + h * h, A = f * h, y = c * p, m = l * l + u * u, d = c * u, g = l * h, w = f * f + p * p, k = x * (b - v) + m * (A - y) + w * (d - g), S = (Math.abs(b) + Math.abs(v)) * x + (Math.abs(A) + Math.abs(y)) * m + (Math.abs(d) + Math.abs(g)) * w, M = Cs * S;
  return k > M || -k > M ? k : Xs(r, t, e, n, s, o, i, a, S);
}
function Ls(r, t) {
  var e, n, s = 0, o, i, a, c, l, f, h, u = r[0], p = r[1], b = t.length;
  for (e = 0; e < b; e++) {
    n = 0;
    var v = t[e], x = v.length - 1;
    if (f = v[0], f[0] !== v[x][0] && f[1] !== v[x][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (i = f[0] - u, a = f[1] - p, n; n < x; n++) {
      if (h = v[n + 1], c = h[0] - u, l = h[1] - p, a === 0 && l === 0) {
        if (c <= 0 && i >= 0 || i <= 0 && c >= 0)
          return 0;
      } else if (l >= 0 && a <= 0 || l <= 0 && a >= 0) {
        if (o = it(i, c, a, l, 0, 0), o === 0)
          return 0;
        (o > 0 && l > 0 && a <= 0 || o < 0 && l <= 0 && a > 0) && s++;
      }
      f = h, a = l, i = c;
    }
  }
  return s % 2 !== 0;
}
function Ue(r, t, e = {}) {
  if (!r)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const n = Ts(r), s = Fs(t), o = s.type, i = t.bbox;
  let a = s.coordinates;
  if (i && zs(n, i) === !1)
    return !1;
  o === "Polygon" && (a = [a]);
  for (var c = 0; c < a.length; ++c) {
    const l = Ls(n, a[c]);
    if (l === 0 && !e.ignoreBoundary) return !0;
    if (l) return !0;
  }
  return !1;
}
function zs(r, t) {
  return t[0] <= r[0] && t[1] <= r[1] && t[2] >= r[0] && t[3] >= r[1];
}
class en {
  constructor(t = [], e = Ys) {
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
      const o = t - 1 >> 1, i = e[o];
      if (n(s, i) >= 0) break;
      e[t] = i, t = o;
    }
    e[t] = s;
  }
  _down(t) {
    const { data: e, compare: n } = this, s = this.length >> 1, o = e[t];
    for (; t < s; ) {
      let i = (t << 1) + 1, a = e[i];
      const c = i + 1;
      if (c < this.length && n(e[c], a) < 0 && (i = c, a = e[c]), n(a, o) >= 0) break;
      e[t] = a, t = i;
    }
    e[t] = o;
  }
}
function Ys(r, t) {
  return r < t ? -1 : r > t ? 1 : 0;
}
const Us = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: en
}, Symbol.toStringTag, { value: "Module" })), Tt = 11102230246251565e-32, pt = 134217729, qs = (3 + 8 * Tt) * Tt;
function qe(r, t, e, n, s) {
  let o, i, a, c, l = t[0], f = n[0], h = 0, u = 0;
  f > l == f > -l ? (o = l, l = t[++h]) : (o = f, f = n[++u]);
  let p = 0;
  if (h < r && u < e)
    for (f > l == f > -l ? (i = l + o, a = o - (i - l), l = t[++h]) : (i = f + o, a = o - (i - f), f = n[++u]), o = i, a !== 0 && (s[p++] = a); h < r && u < e; )
      f > l == f > -l ? (i = o + l, c = i - o, a = o - (i - c) + (l - c), l = t[++h]) : (i = o + f, c = i - o, a = o - (i - c) + (f - c), f = n[++u]), o = i, a !== 0 && (s[p++] = a);
  for (; h < r; )
    i = o + l, c = i - o, a = o - (i - c) + (l - c), l = t[++h], o = i, a !== 0 && (s[p++] = a);
  for (; u < e; )
    i = o + f, c = i - o, a = o - (i - c) + (f - c), f = n[++u], o = i, a !== 0 && (s[p++] = a);
  return (o !== 0 || p === 0) && (s[p++] = o), p;
}
function js(r, t) {
  let e = t[0];
  for (let n = 1; n < r; n++) e += t[n];
  return e;
}
function le(r) {
  return new Float64Array(r);
}
const Gs = (3 + 16 * Tt) * Tt, Ks = (2 + 12 * Tt) * Tt, Ws = (9 + 64 * Tt) * Tt * Tt, Gt = le(4), wn = le(8), vn = le(12), yn = le(16), bt = le(4);
function Hs(r, t, e, n, s, o, i) {
  let a, c, l, f, h, u, p, b, v, x, A, y, m, d, g, w, k, S;
  const M = r - s, T = e - s, N = t - o, P = n - o;
  d = M * P, u = pt * M, p = u - (u - M), b = M - p, u = pt * P, v = u - (u - P), x = P - v, g = b * x - (d - p * v - b * v - p * x), w = N * T, u = pt * N, p = u - (u - N), b = N - p, u = pt * T, v = u - (u - T), x = T - v, k = b * x - (w - p * v - b * v - p * x), A = g - k, h = g - A, Gt[0] = g - (A + h) + (h - k), y = d + A, h = y - d, m = d - (y - h) + (A - h), A = m - w, h = m - A, Gt[1] = m - (A + h) + (h - w), S = y + A, h = S - y, Gt[2] = y - (S - h) + (A - h), Gt[3] = S;
  let C = js(4, Gt), _ = Ks * i;
  if (C >= _ || -C >= _ || (h = r - M, a = r - (M + h) + (h - s), h = e - T, l = e - (T + h) + (h - s), h = t - N, c = t - (N + h) + (h - o), h = n - P, f = n - (P + h) + (h - o), a === 0 && c === 0 && l === 0 && f === 0) || (_ = Ws * i + qs * Math.abs(C), C += M * f + P * a - (N * l + T * c), C >= _ || -C >= _)) return C;
  d = a * P, u = pt * a, p = u - (u - a), b = a - p, u = pt * P, v = u - (u - P), x = P - v, g = b * x - (d - p * v - b * v - p * x), w = c * T, u = pt * c, p = u - (u - c), b = c - p, u = pt * T, v = u - (u - T), x = T - v, k = b * x - (w - p * v - b * v - p * x), A = g - k, h = g - A, bt[0] = g - (A + h) + (h - k), y = d + A, h = y - d, m = d - (y - h) + (A - h), A = m - w, h = m - A, bt[1] = m - (A + h) + (h - w), S = y + A, h = S - y, bt[2] = y - (S - h) + (A - h), bt[3] = S;
  const O = qe(4, Gt, 4, bt, wn);
  d = M * f, u = pt * M, p = u - (u - M), b = M - p, u = pt * f, v = u - (u - f), x = f - v, g = b * x - (d - p * v - b * v - p * x), w = N * l, u = pt * N, p = u - (u - N), b = N - p, u = pt * l, v = u - (u - l), x = l - v, k = b * x - (w - p * v - b * v - p * x), A = g - k, h = g - A, bt[0] = g - (A + h) + (h - k), y = d + A, h = y - d, m = d - (y - h) + (A - h), A = m - w, h = m - A, bt[1] = m - (A + h) + (h - w), S = y + A, h = S - y, bt[2] = y - (S - h) + (A - h), bt[3] = S;
  const I = qe(O, wn, 4, bt, vn);
  d = a * f, u = pt * a, p = u - (u - a), b = a - p, u = pt * f, v = u - (u - f), x = f - v, g = b * x - (d - p * v - b * v - p * x), w = c * l, u = pt * c, p = u - (u - c), b = c - p, u = pt * l, v = u - (u - l), x = l - v, k = b * x - (w - p * v - b * v - p * x), A = g - k, h = g - A, bt[0] = g - (A + h) + (h - k), y = d + A, h = y - d, m = d - (y - h) + (A - h), A = m - w, h = m - A, bt[1] = m - (A + h) + (h - w), S = y + A, h = S - y, bt[2] = y - (S - h) + (A - h), bt[3] = S;
  const B = qe(I, vn, 4, bt, yn);
  return yn[B - 1];
}
function bn(r, t, e, n, s, o) {
  const i = (t - o) * (e - s), a = (r - s) * (n - o), c = i - a;
  if (i === 0 || a === 0 || i > 0 != a > 0) return c;
  const l = Math.abs(i + a);
  return Math.abs(c) >= Gs * l ? c : -Hs(r, t, e, n, s, o, l);
}
function Js(r, t) {
  const e = new en([], fs);
  return Zs(r, e), ti(e, t);
}
function fs(r, t) {
  return r.p.x > t.p.x ? 1 : r.p.x < t.p.x || r.p.x === t.p.x && (r.featureId !== t.featureId || r.ringId !== t.ringId) && r.isLeftEndpoint && !t.isLeftEndpoint ? -1 : r.p.y !== t.p.y ? r.p.y > t.p.y ? 1 : -1 : 1;
}
function Qs(r, t) {
  return r.rightSweepEvent.p.x > t.rightSweepEvent.p.x ? 1 : r.rightSweepEvent.p.x < t.rightSweepEvent.p.x ? -1 : r.rightSweepEvent.p.y !== t.rightSweepEvent.p.y ? r.rightSweepEvent.p.y < t.rightSweepEvent.p.y ? 1 : -1 : 1;
}
function Zs(r, t) {
  if (r.type === "FeatureCollection") {
    const e = r.features;
    for (let n = 0; n < e.length; n++)
      xn(e[n], t);
  } else
    xn(r, t);
}
var de = 0, ge = 0, pe = 0;
function xn(r, t) {
  const e = r.type === "Feature" ? r.geometry : r;
  let n = e.coordinates;
  (e.type === "Polygon" || e.type === "MultiLineString") && (n = [n]), e.type === "LineString" && (n = [[n]]);
  for (let s = 0; s < n.length; s++)
    for (let o = 0; o < n[s].length; o++) {
      let i = n[s][o][0], a = null;
      ge = ge + 1;
      for (let c = 0; c < n[s][o].length - 1; c++) {
        a = n[s][o][c + 1];
        const l = new kn(i, de, ge, pe), f = new kn(a, de, ge, pe + 1);
        l.otherEvent = f, f.otherEvent = l, fs(l, f) > 0 ? (f.isLeftEndpoint = !0, l.isLeftEndpoint = !1) : (l.isLeftEndpoint = !0, f.isLeftEndpoint = !1), t.push(l), t.push(f), i = a, pe = pe + 1;
      }
    }
  de = de + 1;
}
var kn = class {
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
function ti(r, t = !1) {
  const e = [], n = new en([], Qs);
  for (; r.length; ) {
    const s = r.pop();
    if (s.isLeftEndpoint) {
      const o = new ei(s);
      for (let i = 0; i < n.data.length; i++) {
        const a = n.data[i];
        if (t && a.leftSweepEvent.featureId === s.featureId)
          continue;
        const c = ni(o, a);
        c !== !1 && e.push(c);
      }
      n.push(o);
    } else s.isLeftEndpoint === !1 && n.pop();
  }
  return e;
}
var ei = class {
  /** @param event must have otherEvent non-null */
  constructor(r) {
    this.leftSweepEvent = r, this.rightSweepEvent = r.otherEvent;
  }
};
function ni(r, t) {
  if (r === null || t === null) return !1;
  const e = r.leftSweepEvent.p.x, n = r.leftSweepEvent.p.y, s = r.rightSweepEvent.p.x, o = r.rightSweepEvent.p.y, i = t.leftSweepEvent.p.x, a = t.leftSweepEvent.p.y, c = t.rightSweepEvent.p.x, l = t.rightSweepEvent.p.y, f = bn(e, n, s, o, i, a), h = bn(e, n, s, o, c, l);
  if (f > 0 && h > 0) return !1;
  if (f < 0 && h < 0) return !1;
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
  const u = (l - a) * (s - e) - (c - i) * (o - n), p = (c - i) * (n - a) - (l - a) * (e - i), b = (s - e) * (n - a) - (o - n) * (e - i);
  if (u === 0)
    return !1;
  const v = p / u, x = b / u;
  if (v >= 0 && v <= 1 && x >= 0 && x <= 1) {
    const A = e + v * (s - e), y = n + v * (o - n);
    return [A, y];
  }
  return !1;
}
function si(r, t, e = {}) {
  const { removeDuplicates: n = !0, ignoreSelfIntersections: s = !0 } = e;
  let o = [];
  r.type === "FeatureCollection" ? o = o.concat(r.features) : r.type === "Feature" ? o.push(r) : (r.type === "LineString" || r.type === "Polygon" || r.type === "MultiLineString" || r.type === "MultiPolygon") && o.push(re(r)), t.type === "FeatureCollection" ? o = o.concat(t.features) : t.type === "Feature" ? o.push(t) : (t.type === "LineString" || t.type === "Polygon" || t.type === "MultiLineString" || t.type === "MultiPolygon") && o.push(re(t));
  const i = Js(
    St(o),
    s
  );
  let a = [];
  if (n) {
    const c = {};
    i.forEach((l) => {
      const f = l.join(",");
      c[f] || (c[f] = !0, a.push(l));
    });
  } else
    a = i;
  return St(a.map((c) => qt(c)));
}
function ii(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
function ri(r) {
  if (Object.prototype.hasOwnProperty.call(r, "__esModule")) return r;
  var t = r.default;
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
  return Object.defineProperty(e, "__esModule", { value: !0 }), Object.keys(r).forEach(function(n) {
    var s = Object.getOwnPropertyDescriptor(r, n);
    Object.defineProperty(e, n, s.get ? s : {
      enumerable: !0,
      get: function() {
        return r[n];
      }
    });
  }), e;
}
function oi(r, t = {}) {
  let e = 0, n = 0, s = 0;
  return tn(
    r,
    function(o) {
      e += o[0], n += o[1], s++;
    },
    !0
  ), qt([e / s, n / s], t.properties);
}
var me = { exports: {} }, Se = { exports: {} }, ai = Se.exports, Sn;
function ci() {
  return Sn || (Sn = 1, (function(r, t) {
    (function(e, n) {
      r.exports = n();
    })(ai, function() {
      function e(y, m, d, g, w) {
        (function k(S, M, T, N, P) {
          for (; N > T; ) {
            if (N - T > 600) {
              var C = N - T + 1, _ = M - T + 1, O = Math.log(C), I = 0.5 * Math.exp(2 * O / 3), B = 0.5 * Math.sqrt(O * I * (C - I) / C) * (_ - C / 2 < 0 ? -1 : 1), D = Math.max(T, Math.floor(M - _ * I / C + B)), $ = Math.min(N, Math.floor(M + (C - _) * I / C + B));
              k(S, M, D, $, P);
            }
            var E = S[M], R = T, X = N;
            for (n(S, T, M), P(S[N], E) > 0 && n(S, T, N); R < X; ) {
              for (n(S, R, X), R++, X--; P(S[R], E) < 0; ) R++;
              for (; P(S[X], E) > 0; ) X--;
            }
            P(S[T], E) === 0 ? n(S, T, X) : n(S, ++X, N), X <= M && (T = X + 1), M <= X && (N = X - 1);
          }
        })(y, m, d || 0, g || y.length - 1, w || s);
      }
      function n(y, m, d) {
        var g = y[m];
        y[m] = y[d], y[d] = g;
      }
      function s(y, m) {
        return y < m ? -1 : y > m ? 1 : 0;
      }
      var o = function(y) {
        y === void 0 && (y = 9), this._maxEntries = Math.max(4, y), this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries)), this.clear();
      };
      function i(y, m, d) {
        if (!d) return m.indexOf(y);
        for (var g = 0; g < m.length; g++) if (d(y, m[g])) return g;
        return -1;
      }
      function a(y, m) {
        c(y, 0, y.children.length, m, y);
      }
      function c(y, m, d, g, w) {
        w || (w = x(null)), w.minX = 1 / 0, w.minY = 1 / 0, w.maxX = -1 / 0, w.maxY = -1 / 0;
        for (var k = m; k < d; k++) {
          var S = y.children[k];
          l(w, y.leaf ? g(S) : S);
        }
        return w;
      }
      function l(y, m) {
        return y.minX = Math.min(y.minX, m.minX), y.minY = Math.min(y.minY, m.minY), y.maxX = Math.max(y.maxX, m.maxX), y.maxY = Math.max(y.maxY, m.maxY), y;
      }
      function f(y, m) {
        return y.minX - m.minX;
      }
      function h(y, m) {
        return y.minY - m.minY;
      }
      function u(y) {
        return (y.maxX - y.minX) * (y.maxY - y.minY);
      }
      function p(y) {
        return y.maxX - y.minX + (y.maxY - y.minY);
      }
      function b(y, m) {
        return y.minX <= m.minX && y.minY <= m.minY && m.maxX <= y.maxX && m.maxY <= y.maxY;
      }
      function v(y, m) {
        return m.minX <= y.maxX && m.minY <= y.maxY && m.maxX >= y.minX && m.maxY >= y.minY;
      }
      function x(y) {
        return { children: y, height: 1, leaf: !0, minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
      }
      function A(y, m, d, g, w) {
        for (var k = [m, d]; k.length; ) if (!((d = k.pop()) - (m = k.pop()) <= g)) {
          var S = m + Math.ceil((d - m) / g / 2) * g;
          e(y, S, m, d, w), k.push(m, S, S, d);
        }
      }
      return o.prototype.all = function() {
        return this._all(this.data, []);
      }, o.prototype.search = function(y) {
        var m = this.data, d = [];
        if (!v(y, m)) return d;
        for (var g = this.toBBox, w = []; m; ) {
          for (var k = 0; k < m.children.length; k++) {
            var S = m.children[k], M = m.leaf ? g(S) : S;
            v(y, M) && (m.leaf ? d.push(S) : b(y, M) ? this._all(S, d) : w.push(S));
          }
          m = w.pop();
        }
        return d;
      }, o.prototype.collides = function(y) {
        var m = this.data;
        if (!v(y, m)) return !1;
        for (var d = []; m; ) {
          for (var g = 0; g < m.children.length; g++) {
            var w = m.children[g], k = m.leaf ? this.toBBox(w) : w;
            if (v(y, k)) {
              if (m.leaf || b(y, k)) return !0;
              d.push(w);
            }
          }
          m = d.pop();
        }
        return !1;
      }, o.prototype.load = function(y) {
        if (!y || !y.length) return this;
        if (y.length < this._minEntries) {
          for (var m = 0; m < y.length; m++) this.insert(y[m]);
          return this;
        }
        var d = this._build(y.slice(), 0, y.length - 1, 0);
        if (this.data.children.length) if (this.data.height === d.height) this._splitRoot(this.data, d);
        else {
          if (this.data.height < d.height) {
            var g = this.data;
            this.data = d, d = g;
          }
          this._insert(d, this.data.height - d.height - 1, !0);
        }
        else this.data = d;
        return this;
      }, o.prototype.insert = function(y) {
        return y && this._insert(y, this.data.height - 1), this;
      }, o.prototype.clear = function() {
        return this.data = x([]), this;
      }, o.prototype.remove = function(y, m) {
        if (!y) return this;
        for (var d, g, w, k = this.data, S = this.toBBox(y), M = [], T = []; k || M.length; ) {
          if (k || (k = M.pop(), g = M[M.length - 1], d = T.pop(), w = !0), k.leaf) {
            var N = i(y, k.children, m);
            if (N !== -1) return k.children.splice(N, 1), M.push(k), this._condense(M), this;
          }
          w || k.leaf || !b(k, S) ? g ? (d++, k = g.children[d], w = !1) : k = null : (M.push(k), T.push(d), d = 0, g = k, k = k.children[0]);
        }
        return this;
      }, o.prototype.toBBox = function(y) {
        return y;
      }, o.prototype.compareMinX = function(y, m) {
        return y.minX - m.minX;
      }, o.prototype.compareMinY = function(y, m) {
        return y.minY - m.minY;
      }, o.prototype.toJSON = function() {
        return this.data;
      }, o.prototype.fromJSON = function(y) {
        return this.data = y, this;
      }, o.prototype._all = function(y, m) {
        for (var d = []; y; ) y.leaf ? m.push.apply(m, y.children) : d.push.apply(d, y.children), y = d.pop();
        return m;
      }, o.prototype._build = function(y, m, d, g) {
        var w, k = d - m + 1, S = this._maxEntries;
        if (k <= S) return a(w = x(y.slice(m, d + 1)), this.toBBox), w;
        g || (g = Math.ceil(Math.log(k) / Math.log(S)), S = Math.ceil(k / Math.pow(S, g - 1))), (w = x([])).leaf = !1, w.height = g;
        var M = Math.ceil(k / S), T = M * Math.ceil(Math.sqrt(S));
        A(y, m, d, T, this.compareMinX);
        for (var N = m; N <= d; N += T) {
          var P = Math.min(N + T - 1, d);
          A(y, N, P, M, this.compareMinY);
          for (var C = N; C <= P; C += M) {
            var _ = Math.min(C + M - 1, P);
            w.children.push(this._build(y, C, _, g - 1));
          }
        }
        return a(w, this.toBBox), w;
      }, o.prototype._chooseSubtree = function(y, m, d, g) {
        for (; g.push(m), !m.leaf && g.length - 1 !== d; ) {
          for (var w = 1 / 0, k = 1 / 0, S = void 0, M = 0; M < m.children.length; M++) {
            var T = m.children[M], N = u(T), P = (C = y, _ = T, (Math.max(_.maxX, C.maxX) - Math.min(_.minX, C.minX)) * (Math.max(_.maxY, C.maxY) - Math.min(_.minY, C.minY)) - N);
            P < k ? (k = P, w = N < w ? N : w, S = T) : P === k && N < w && (w = N, S = T);
          }
          m = S || m.children[0];
        }
        var C, _;
        return m;
      }, o.prototype._insert = function(y, m, d) {
        var g = d ? y : this.toBBox(y), w = [], k = this._chooseSubtree(g, this.data, m, w);
        for (k.children.push(y), l(k, g); m >= 0 && w[m].children.length > this._maxEntries; ) this._split(w, m), m--;
        this._adjustParentBBoxes(g, w, m);
      }, o.prototype._split = function(y, m) {
        var d = y[m], g = d.children.length, w = this._minEntries;
        this._chooseSplitAxis(d, w, g);
        var k = this._chooseSplitIndex(d, w, g), S = x(d.children.splice(k, d.children.length - k));
        S.height = d.height, S.leaf = d.leaf, a(d, this.toBBox), a(S, this.toBBox), m ? y[m - 1].children.push(S) : this._splitRoot(d, S);
      }, o.prototype._splitRoot = function(y, m) {
        this.data = x([y, m]), this.data.height = y.height + 1, this.data.leaf = !1, a(this.data, this.toBBox);
      }, o.prototype._chooseSplitIndex = function(y, m, d) {
        for (var g, w, k, S, M, T, N, P = 1 / 0, C = 1 / 0, _ = m; _ <= d - m; _++) {
          var O = c(y, 0, _, this.toBBox), I = c(y, _, d, this.toBBox), B = (w = O, k = I, S = void 0, M = void 0, T = void 0, N = void 0, S = Math.max(w.minX, k.minX), M = Math.max(w.minY, k.minY), T = Math.min(w.maxX, k.maxX), N = Math.min(w.maxY, k.maxY), Math.max(0, T - S) * Math.max(0, N - M)), D = u(O) + u(I);
          B < P ? (P = B, g = _, C = D < C ? D : C) : B === P && D < C && (C = D, g = _);
        }
        return g || d - m;
      }, o.prototype._chooseSplitAxis = function(y, m, d) {
        var g = y.leaf ? this.compareMinX : f, w = y.leaf ? this.compareMinY : h;
        this._allDistMargin(y, m, d, g) < this._allDistMargin(y, m, d, w) && y.children.sort(g);
      }, o.prototype._allDistMargin = function(y, m, d, g) {
        y.children.sort(g);
        for (var w = this.toBBox, k = c(y, 0, m, w), S = c(y, d - m, d, w), M = p(k) + p(S), T = m; T < d - m; T++) {
          var N = y.children[T];
          l(k, y.leaf ? w(N) : N), M += p(k);
        }
        for (var P = d - m - 1; P >= m; P--) {
          var C = y.children[P];
          l(S, y.leaf ? w(C) : C), M += p(S);
        }
        return M;
      }, o.prototype._adjustParentBBoxes = function(y, m, d) {
        for (var g = d; g >= 0; g--) l(m[g], y);
      }, o.prototype._condense = function(y) {
        for (var m = y.length - 1, d = void 0; m >= 0; m--) y[m].children.length === 0 ? m > 0 ? (d = y[m - 1].children).splice(d.indexOf(y[m]), 1) : this.clear() : a(y[m], this.toBBox);
      }, o;
    });
  })(Se)), Se.exports;
}
const li = /* @__PURE__ */ ri(Us);
var te = { exports: {} }, je, Mn;
function fi() {
  return Mn || (Mn = 1, je = function(t, e, n, s) {
    var o = t[0], i = t[1], a = !1;
    n === void 0 && (n = 0), s === void 0 && (s = e.length);
    for (var c = (s - n) / 2, l = 0, f = c - 1; l < c; f = l++) {
      var h = e[n + l * 2 + 0], u = e[n + l * 2 + 1], p = e[n + f * 2 + 0], b = e[n + f * 2 + 1], v = u > i != b > i && o < (p - h) * (i - u) / (b - u) + h;
      v && (a = !a);
    }
    return a;
  }), je;
}
var Ge, _n;
function hi() {
  return _n || (_n = 1, Ge = function(t, e, n, s) {
    var o = t[0], i = t[1], a = !1;
    n === void 0 && (n = 0), s === void 0 && (s = e.length);
    for (var c = s - n, l = 0, f = c - 1; l < c; f = l++) {
      var h = e[l + n][0], u = e[l + n][1], p = e[f + n][0], b = e[f + n][1], v = u > i != b > i && o < (p - h) * (i - u) / (b - u) + h;
      v && (a = !a);
    }
    return a;
  }), Ge;
}
var En;
function ui() {
  if (En) return te.exports;
  En = 1;
  var r = fi(), t = hi();
  return te.exports = function(n, s, o, i) {
    return s.length > 0 && Array.isArray(s[0]) ? t(n, s, o, i) : r(n, s, o, i);
  }, te.exports.nested = t, te.exports.flat = r, te.exports;
}
var ne = { exports: {} }, di = ne.exports, In;
function gi() {
  return In || (In = 1, (function(r, t) {
    (function(e, n) {
      n(t);
    })(di, function(e) {
      const s = 33306690738754706e-32;
      function o(v, x, A, y, m) {
        let d, g, w, k, S = x[0], M = y[0], T = 0, N = 0;
        M > S == M > -S ? (d = S, S = x[++T]) : (d = M, M = y[++N]);
        let P = 0;
        if (T < v && N < A) for (M > S == M > -S ? (w = d - ((g = S + d) - S), S = x[++T]) : (w = d - ((g = M + d) - M), M = y[++N]), d = g, w !== 0 && (m[P++] = w); T < v && N < A; ) M > S == M > -S ? (w = d - ((g = d + S) - (k = g - d)) + (S - k), S = x[++T]) : (w = d - ((g = d + M) - (k = g - d)) + (M - k), M = y[++N]), d = g, w !== 0 && (m[P++] = w);
        for (; T < v; ) w = d - ((g = d + S) - (k = g - d)) + (S - k), S = x[++T], d = g, w !== 0 && (m[P++] = w);
        for (; N < A; ) w = d - ((g = d + M) - (k = g - d)) + (M - k), M = y[++N], d = g, w !== 0 && (m[P++] = w);
        return d === 0 && P !== 0 || (m[P++] = d), P;
      }
      function i(v) {
        return new Float64Array(v);
      }
      const a = 33306690738754716e-32, c = 22204460492503146e-32, l = 11093356479670487e-47, f = i(4), h = i(8), u = i(12), p = i(16), b = i(4);
      e.orient2d = function(v, x, A, y, m, d) {
        const g = (x - d) * (A - m), w = (v - m) * (y - d), k = g - w;
        if (g === 0 || w === 0 || g > 0 != w > 0) return k;
        const S = Math.abs(g + w);
        return Math.abs(k) >= a * S ? k : -(function(M, T, N, P, C, _, O) {
          let I, B, D, $, E, R, X, z, q, Y, L, U, H, F, V, G, K, Q;
          const tt = M - C, lt = N - C, at = T - _, ct = P - _;
          E = (V = (z = tt - (X = (R = 134217729 * tt) - (R - tt))) * (Y = ct - (q = (R = 134217729 * ct) - (R - ct))) - ((F = tt * ct) - X * q - z * q - X * Y)) - (L = V - (K = (z = at - (X = (R = 134217729 * at) - (R - at))) * (Y = lt - (q = (R = 134217729 * lt) - (R - lt))) - ((G = at * lt) - X * q - z * q - X * Y))), f[0] = V - (L + E) + (E - K), E = (H = F - ((U = F + L) - (E = U - F)) + (L - E)) - (L = H - G), f[1] = H - (L + E) + (E - G), E = (Q = U + L) - U, f[2] = U - (Q - E) + (L - E), f[3] = Q;
          let Ft = (function(Es, ln) {
            let fn = ln[0];
            for (let Pe = 1; Pe < Es; Pe++) fn += ln[Pe];
            return fn;
          })(4, f), Zt = c * O;
          if (Ft >= Zt || -Ft >= Zt || (I = M - (tt + (E = M - tt)) + (E - C), D = N - (lt + (E = N - lt)) + (E - C), B = T - (at + (E = T - at)) + (E - _), $ = P - (ct + (E = P - ct)) + (E - _), I === 0 && B === 0 && D === 0 && $ === 0) || (Zt = l * O + s * Math.abs(Ft), (Ft += tt * $ + ct * I - (at * D + lt * B)) >= Zt || -Ft >= Zt)) return Ft;
          E = (V = (z = I - (X = (R = 134217729 * I) - (R - I))) * (Y = ct - (q = (R = 134217729 * ct) - (R - ct))) - ((F = I * ct) - X * q - z * q - X * Y)) - (L = V - (K = (z = B - (X = (R = 134217729 * B) - (R - B))) * (Y = lt - (q = (R = 134217729 * lt) - (R - lt))) - ((G = B * lt) - X * q - z * q - X * Y))), b[0] = V - (L + E) + (E - K), E = (H = F - ((U = F + L) - (E = U - F)) + (L - E)) - (L = H - G), b[1] = H - (L + E) + (E - G), E = (Q = U + L) - U, b[2] = U - (Q - E) + (L - E), b[3] = Q;
          const Ss = o(4, f, 4, b, h);
          E = (V = (z = tt - (X = (R = 134217729 * tt) - (R - tt))) * (Y = $ - (q = (R = 134217729 * $) - (R - $))) - ((F = tt * $) - X * q - z * q - X * Y)) - (L = V - (K = (z = at - (X = (R = 134217729 * at) - (R - at))) * (Y = D - (q = (R = 134217729 * D) - (R - D))) - ((G = at * D) - X * q - z * q - X * Y))), b[0] = V - (L + E) + (E - K), E = (H = F - ((U = F + L) - (E = U - F)) + (L - E)) - (L = H - G), b[1] = H - (L + E) + (E - G), E = (Q = U + L) - U, b[2] = U - (Q - E) + (L - E), b[3] = Q;
          const Ms = o(Ss, h, 4, b, u);
          E = (V = (z = I - (X = (R = 134217729 * I) - (R - I))) * (Y = $ - (q = (R = 134217729 * $) - (R - $))) - ((F = I * $) - X * q - z * q - X * Y)) - (L = V - (K = (z = B - (X = (R = 134217729 * B) - (R - B))) * (Y = D - (q = (R = 134217729 * D) - (R - D))) - ((G = B * D) - X * q - z * q - X * Y))), b[0] = V - (L + E) + (E - K), E = (H = F - ((U = F + L) - (E = U - F)) + (L - E)) - (L = H - G), b[1] = H - (L + E) + (E - G), E = (Q = U + L) - U, b[2] = U - (Q - E) + (L - E), b[3] = Q;
          const _s = o(Ms, u, 4, b, p);
          return p[_s - 1];
        })(v, x, A, y, m, d, S);
      }, e.orient2dfast = function(v, x, A, y, m, d) {
        return (x - d) * (A - m) - (v - m) * (y - d);
      }, Object.defineProperty(e, "__esModule", { value: !0 });
    });
  })(ne, ne.exports)), ne.exports;
}
var An;
function pi() {
  if (An) return me.exports;
  An = 1;
  var r = ci(), t = li, e = ui(), n = gi().orient2d;
  t.default && (t = t.default), me.exports = s, me.exports.default = s;
  function s(d, g, w) {
    g = Math.max(0, g === void 0 ? 2 : g), w = w || 0;
    var k = p(d), S = new r(16);
    S.toBBox = function(X) {
      return {
        minX: X[0],
        minY: X[1],
        maxX: X[0],
        maxY: X[1]
      };
    }, S.compareMinX = function(X, z) {
      return X[0] - z[0];
    }, S.compareMinY = function(X, z) {
      return X[1] - z[1];
    }, S.load(d);
    for (var M = [], T = 0, N; T < k.length; T++) {
      var P = k[T];
      S.remove(P), N = b(P, N), M.push(N);
    }
    var C = new r(16);
    for (T = 0; T < M.length; T++) C.insert(u(M[T]));
    for (var _ = g * g, O = w * w; M.length; ) {
      var I = M.shift(), B = I.p, D = I.next.p, $ = v(B, D);
      if (!($ < O)) {
        var E = $ / _;
        P = o(S, I.prev.p, B, D, I.next.next.p, E, C), P && Math.min(v(P, B), v(P, D)) <= E && (M.push(I), M.push(b(P, I)), S.remove(P), C.remove(I), C.insert(u(I)), C.insert(u(I.next)));
      }
    }
    I = N;
    var R = [];
    do
      R.push(I.p), I = I.next;
    while (I !== N);
    return R.push(I.p), R;
  }
  function o(d, g, w, k, S, M, T) {
    for (var N = new t([], i), P = d.data; P; ) {
      for (var C = 0; C < P.children.length; C++) {
        var _ = P.children[C], O = P.leaf ? x(_, w, k) : a(w, k, _);
        O > M || N.push({
          node: _,
          dist: O
        });
      }
      for (; N.length && !N.peek().node.children; ) {
        var I = N.pop(), B = I.node, D = x(B, g, w), $ = x(B, k, S);
        if (I.dist < D && I.dist < $ && l(w, B, T) && l(k, B, T)) return B;
      }
      P = N.pop(), P && (P = P.node);
    }
    return null;
  }
  function i(d, g) {
    return d.dist - g.dist;
  }
  function a(d, g, w) {
    if (c(d, w) || c(g, w)) return 0;
    var k = A(d[0], d[1], g[0], g[1], w.minX, w.minY, w.maxX, w.minY);
    if (k === 0) return 0;
    var S = A(d[0], d[1], g[0], g[1], w.minX, w.minY, w.minX, w.maxY);
    if (S === 0) return 0;
    var M = A(d[0], d[1], g[0], g[1], w.maxX, w.minY, w.maxX, w.maxY);
    if (M === 0) return 0;
    var T = A(d[0], d[1], g[0], g[1], w.minX, w.maxY, w.maxX, w.maxY);
    return T === 0 ? 0 : Math.min(k, S, M, T);
  }
  function c(d, g) {
    return d[0] >= g.minX && d[0] <= g.maxX && d[1] >= g.minY && d[1] <= g.maxY;
  }
  function l(d, g, w) {
    for (var k = Math.min(d[0], g[0]), S = Math.min(d[1], g[1]), M = Math.max(d[0], g[0]), T = Math.max(d[1], g[1]), N = w.search({ minX: k, minY: S, maxX: M, maxY: T }), P = 0; P < N.length; P++)
      if (h(N[P].p, N[P].next.p, d, g)) return !1;
    return !0;
  }
  function f(d, g, w) {
    return n(d[0], d[1], g[0], g[1], w[0], w[1]);
  }
  function h(d, g, w, k) {
    return d !== k && g !== w && f(d, g, w) > 0 != f(d, g, k) > 0 && f(w, k, d) > 0 != f(w, k, g) > 0;
  }
  function u(d) {
    var g = d.p, w = d.next.p;
    return d.minX = Math.min(g[0], w[0]), d.minY = Math.min(g[1], w[1]), d.maxX = Math.max(g[0], w[0]), d.maxY = Math.max(g[1], w[1]), d;
  }
  function p(d) {
    for (var g = d[0], w = d[0], k = d[0], S = d[0], M = 0; M < d.length; M++) {
      var T = d[M];
      T[0] < g[0] && (g = T), T[0] > k[0] && (k = T), T[1] < w[1] && (w = T), T[1] > S[1] && (S = T);
    }
    var N = [g, w, k, S], P = N.slice();
    for (M = 0; M < d.length; M++)
      e(d[M], N) || P.push(d[M]);
    return m(P);
  }
  function b(d, g) {
    var w = {
      p: d,
      prev: null,
      next: null,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };
    return g ? (w.next = g.next, w.prev = g, g.next.prev = w, g.next = w) : (w.prev = w, w.next = w), w;
  }
  function v(d, g) {
    var w = d[0] - g[0], k = d[1] - g[1];
    return w * w + k * k;
  }
  function x(d, g, w) {
    var k = g[0], S = g[1], M = w[0] - k, T = w[1] - S;
    if (M !== 0 || T !== 0) {
      var N = ((d[0] - k) * M + (d[1] - S) * T) / (M * M + T * T);
      N > 1 ? (k = w[0], S = w[1]) : N > 0 && (k += M * N, S += T * N);
    }
    return M = d[0] - k, T = d[1] - S, M * M + T * T;
  }
  function A(d, g, w, k, S, M, T, N) {
    var P = w - d, C = k - g, _ = T - S, O = N - M, I = d - S, B = g - M, D = P * P + C * C, $ = P * _ + C * O, E = _ * _ + O * O, R = P * I + C * B, X = _ * I + O * B, z = D * E - $ * $, q, Y, L, U, H = z, F = z;
    z === 0 ? (Y = 0, H = 1, U = X, F = E) : (Y = $ * X - E * R, U = D * X - $ * R, Y < 0 ? (Y = 0, U = X, F = E) : Y > H && (Y = H, U = X + $, F = E)), U < 0 ? (U = 0, -R < 0 ? Y = 0 : -R > D ? Y = H : (Y = -R, H = D)) : U > F && (U = F, -R + $ < 0 ? Y = 0 : -R + $ > D ? Y = H : (Y = -R + $, H = D)), q = Y === 0 ? 0 : Y / H, L = U === 0 ? 0 : U / F;
    var V = (1 - q) * d + q * w, G = (1 - q) * g + q * k, K = (1 - L) * S + L * T, Q = (1 - L) * M + L * N, tt = K - V, lt = Q - G;
    return tt * tt + lt * lt;
  }
  function y(d, g) {
    return d[0] === g[0] ? d[1] - g[1] : d[0] - g[0];
  }
  function m(d) {
    d.sort(y);
    for (var g = [], w = 0; w < d.length; w++) {
      for (; g.length >= 2 && f(g[g.length - 2], g[g.length - 1], d[w]) <= 0; )
        g.pop();
      g.push(d[w]);
    }
    for (var k = [], S = d.length - 1; S >= 0; S--) {
      for (; k.length >= 2 && f(k[k.length - 2], k[k.length - 1], d[S]) <= 0; )
        k.pop();
      k.push(d[S]);
    }
    return k.pop(), g.pop(), g.concat(k);
  }
  return me.exports;
}
var mi = pi();
const wi = /* @__PURE__ */ ii(mi);
function Nn(r, t = {}) {
  t.concavity = t.concavity || 1 / 0;
  const e = [];
  if (tn(r, (s) => {
    e.push([s[0], s[1]]);
  }), !e.length)
    return null;
  const n = wi(e, t.concavity);
  return n.length > 3 ? ce([n], t.properties) : null;
}
const On = Math.pow(2, -52), we = new Uint32Array(512);
class Be {
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
  static from(t, e = ki, n = Si) {
    const s = t.length, o = new Float64Array(s * 2);
    for (let i = 0; i < s; i++) {
      const a = t[i];
      o[2 * i] = e(a), o[2 * i + 1] = n(a);
    }
    return new Be(o);
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
    const { coords: t, _hullPrev: e, _hullNext: n, _hullTri: s, _hullHash: o } = this, i = t.length >> 1;
    let a = 1 / 0, c = 1 / 0, l = -1 / 0, f = -1 / 0;
    for (let M = 0; M < i; M++) {
      const T = t[2 * M], N = t[2 * M + 1];
      T < a && (a = T), N < c && (c = N), T > l && (l = T), N > f && (f = N), this._ids[M] = M;
    }
    const h = (a + l) / 2, u = (c + f) / 2;
    let p = 0, b = 0, v = 0;
    for (let M = 0, T = 1 / 0; M < i; M++) {
      const N = Ke(h, u, t[2 * M], t[2 * M + 1]);
      N < T && (p = M, T = N);
    }
    const x = t[2 * p], A = t[2 * p + 1];
    for (let M = 0, T = 1 / 0; M < i; M++) {
      if (M === p) continue;
      const N = Ke(x, A, t[2 * M], t[2 * M + 1]);
      N < T && N > 0 && (b = M, T = N);
    }
    let y = t[2 * b], m = t[2 * b + 1], d = 1 / 0;
    for (let M = 0; M < i; M++) {
      if (M === p || M === b) continue;
      const T = bi(x, A, y, m, t[2 * M], t[2 * M + 1]);
      T < d && (v = M, d = T);
    }
    let g = t[2 * v], w = t[2 * v + 1];
    if (d === 1 / 0) {
      for (let N = 0; N < i; N++)
        this._dists[N] = t[2 * N] - t[0] || t[2 * N + 1] - t[1];
      Ht(this._ids, this._dists, 0, i - 1);
      const M = new Uint32Array(i);
      let T = 0;
      for (let N = 0, P = -1 / 0; N < i; N++) {
        const C = this._ids[N], _ = this._dists[C];
        _ > P && (M[T++] = C, P = _);
      }
      this.hull = M.subarray(0, T), this.triangles = new Uint32Array(0), this.halfedges = new Int32Array(0);
      return;
    }
    if (it(x, A, y, m, g, w) < 0) {
      const M = b, T = y, N = m;
      b = v, y = g, m = w, v = M, g = T, w = N;
    }
    const k = xi(x, A, y, m, g, w);
    this._cx = k.x, this._cy = k.y;
    for (let M = 0; M < i; M++)
      this._dists[M] = Ke(t[2 * M], t[2 * M + 1], k.x, k.y);
    Ht(this._ids, this._dists, 0, i - 1), this._hullStart = p;
    let S = 3;
    n[p] = e[v] = b, n[b] = e[p] = v, n[v] = e[b] = p, s[p] = 0, s[b] = 1, s[v] = 2, o.fill(-1), o[this._hashKey(x, A)] = p, o[this._hashKey(y, m)] = b, o[this._hashKey(g, w)] = v, this.trianglesLen = 0, this._addTriangle(p, b, v, -1, -1, -1);
    for (let M = 0, T = 0, N = 0; M < this._ids.length; M++) {
      const P = this._ids[M], C = t[2 * P], _ = t[2 * P + 1];
      if (M > 0 && Math.abs(C - T) <= On && Math.abs(_ - N) <= On || (T = C, N = _, P === p || P === b || P === v)) continue;
      let O = 0;
      for (let E = 0, R = this._hashKey(C, _); E < this._hashSize && (O = o[(R + E) % this._hashSize], !(O !== -1 && O !== n[O])); E++)
        ;
      O = e[O];
      let I = O, B;
      for (; B = n[I], it(C, _, t[2 * I], t[2 * I + 1], t[2 * B], t[2 * B + 1]) >= 0; )
        if (I = B, I === O) {
          I = -1;
          break;
        }
      if (I === -1) continue;
      let D = this._addTriangle(I, P, n[I], -1, -1, s[I]);
      s[P] = this._legalize(D + 2), s[I] = D, S++;
      let $ = n[I];
      for (; B = n[$], it(C, _, t[2 * $], t[2 * $ + 1], t[2 * B], t[2 * B + 1]) < 0; )
        D = this._addTriangle($, P, B, s[P], -1, s[$]), s[P] = this._legalize(D + 2), n[$] = $, S--, $ = B;
      if (I === O)
        for (; B = e[I], it(C, _, t[2 * B], t[2 * B + 1], t[2 * I], t[2 * I + 1]) < 0; )
          D = this._addTriangle(B, P, I, -1, s[I], s[B]), this._legalize(D + 2), s[B] = D, n[I] = I, S--, I = B;
      this._hullStart = e[P] = I, n[I] = e[$] = P, n[P] = $, o[this._hashKey(C, _)] = P, o[this._hashKey(t[2 * I], t[2 * I + 1])] = I;
    }
    this.hull = new Uint32Array(S);
    for (let M = 0, T = this._hullStart; M < S; M++)
      this.hull[M] = T, T = n[T];
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
    return Math.floor(vi(t - this._cx, e - this._cy) * this._hashSize) % this._hashSize;
  }
  /**
   * Flip an edge in a pair of triangles if it doesn't satisfy the Delaunay condition.
   *
   * @param {number} a
   * @private
   */
  _legalize(t) {
    const { _triangles: e, _halfedges: n, coords: s } = this;
    let o = 0, i = 0;
    for (; ; ) {
      const a = n[t], c = t - t % 3;
      if (i = c + (t + 2) % 3, a === -1) {
        if (o === 0) break;
        t = we[--o];
        continue;
      }
      const l = a - a % 3, f = c + (t + 1) % 3, h = l + (a + 2) % 3, u = e[i], p = e[t], b = e[f], v = e[h];
      if (yi(
        s[2 * u],
        s[2 * u + 1],
        s[2 * p],
        s[2 * p + 1],
        s[2 * b],
        s[2 * b + 1],
        s[2 * v],
        s[2 * v + 1]
      )) {
        e[t] = v, e[a] = u;
        const A = n[h];
        if (A === -1) {
          let m = this._hullStart;
          do {
            if (this._hullTri[m] === h) {
              this._hullTri[m] = t;
              break;
            }
            m = this._hullPrev[m];
          } while (m !== this._hullStart);
        }
        this._link(t, A), this._link(a, n[i]), this._link(i, h);
        const y = l + (a + 1) % 3;
        o < we.length && (we[o++] = y);
      } else {
        if (o === 0) break;
        t = we[--o];
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
  _addTriangle(t, e, n, s, o, i) {
    const a = this.trianglesLen;
    return this._triangles[a] = t, this._triangles[a + 1] = e, this._triangles[a + 2] = n, this._link(a, s), this._link(a + 1, o), this._link(a + 2, i), this.trianglesLen += 3, a;
  }
}
function vi(r, t) {
  const e = r / (Math.abs(r) + Math.abs(t));
  return (t > 0 ? 3 - e : 1 + e) / 4;
}
function Ke(r, t, e, n) {
  const s = r - e, o = t - n;
  return s * s + o * o;
}
function yi(r, t, e, n, s, o, i, a) {
  const c = r - i, l = t - a, f = e - i, h = n - a, u = s - i, p = o - a, b = c * c + l * l, v = f * f + h * h, x = u * u + p * p;
  return c * (h * x - v * p) - l * (f * x - v * u) + b * (f * p - h * u) < 0;
}
function bi(r, t, e, n, s, o) {
  const i = e - r, a = n - t, c = s - r, l = o - t, f = i * i + a * a, h = c * c + l * l, u = 0.5 / (i * l - a * c), p = (l * f - a * h) * u, b = (i * h - c * f) * u;
  return p * p + b * b;
}
function xi(r, t, e, n, s, o) {
  const i = e - r, a = n - t, c = s - r, l = o - t, f = i * i + a * a, h = c * c + l * l, u = 0.5 / (i * l - a * c), p = r + (l * f - a * h) * u, b = t + (i * h - c * f) * u;
  return { x: p, y: b };
}
function Ht(r, t, e, n) {
  if (n - e <= 20)
    for (let s = e + 1; s <= n; s++) {
      const o = r[s], i = t[o];
      let a = s - 1;
      for (; a >= e && t[r[a]] > i; ) r[a + 1] = r[a--];
      r[a + 1] = o;
    }
  else {
    const s = e + n >> 1;
    let o = e + 1, i = n;
    ee(r, s, o), t[r[e]] > t[r[n]] && ee(r, e, n), t[r[o]] > t[r[n]] && ee(r, o, n), t[r[e]] > t[r[o]] && ee(r, e, o);
    const a = r[o], c = t[a];
    for (; ; ) {
      do
        o++;
      while (t[r[o]] < c);
      do
        i--;
      while (t[r[i]] > c);
      if (i < o) break;
      ee(r, o, i);
    }
    r[e + 1] = r[i], r[i] = a, n - o + 1 >= i - e ? (Ht(r, t, o, n), Ht(r, t, e, i - 1)) : (Ht(r, t, e, i - 1), Ht(r, t, o, n));
  }
}
function ee(r, t, e) {
  const n = r[t];
  r[t] = r[e], r[e] = n;
}
function ki(r) {
  return r[0];
}
function Si(r) {
  return r[1];
}
class Mi {
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
    const n = Math.floor(t / this.width), o = 1 << t % this.width;
    return this.bs[n] ^= (-Number(e) ^ this.bs[n]) & o, e;
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
class Tn extends Mi {
  constructor(t) {
    super(8, new Uint8Array(Math.ceil(t / 8)).fill(0));
  }
}
function Et(r) {
  return r % 3 === 2 ? r - 2 : r + 1;
}
function Mt(r) {
  return r % 3 === 0 ? r + 2 : r - 1;
}
function Ee(r, t, e, n, s, o, i, a) {
  const c = it(r, t, s, o, i, a), l = it(e, n, s, o, i, a);
  if (c > 0 && l > 0 || c < 0 && l < 0)
    return !1;
  const f = it(s, o, r, t, e, n), h = it(i, a, r, t, e, n);
  return f > 0 && h > 0 || f < 0 && h < 0 ? !1 : c === 0 && l === 0 && f === 0 && h === 0 ? !(Math.max(s, i) < Math.min(r, e) || Math.max(r, e) < Math.min(s, i) || Math.max(o, a) < Math.min(t, n) || Math.max(t, n) < Math.min(o, a)) : !0;
}
class _i {
  /**
   * The triangulation object from Delaunator.
   */
  del;
  constructor(t) {
    this.del = t;
  }
}
class Qt extends _i {
  vertMap;
  flips;
  consd;
  /**
   * 全部の辺を調べる掃除（{@link delaunify} の最初の 1 回）が済んでいるか。済んだ後は、
   * 反転で触った辺（`flips` の印がある辺）だけを調べれば Delaunay 性が保たれる。
   * 掃除は制約を 1 本張るとき（`delaunify(true)`）にしか走らないので、制約を 1 本も張っていない網や、
   * 張った制約がすべて初めからある辺だった網は、まだ済んでいない。
   */
  cleaned = !1;
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
    const n = 2 ** 32 - 1, s = t.coords.length >> 1, o = t.triangles.length;
    this.vertMap = new Uint32Array(s).fill(n), this.flips = new Tn(o), this.consd = new Tn(o);
    for (let i = 0; i < o; i++) {
      const a = t.triangles[i];
      this.vertMap[a] === n && this.updateVert(i);
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
      consd: this.consd.copyBits(),
      cleaned: this.cleaned
    };
  }
  /** {@link snapshot} で控えた状態を、新しい配列に複製して復元する（控えは何度でも使える）。 */
  static restore(t) {
    const e = new Qt({
      coords: t.coords,
      hull: t.hull,
      triangles: t.triangles.slice(),
      halfedges: t.halfedges.slice()
    });
    return e.vertMap.set(t.vertMap), e.flips.load(t.flips), e.consd.load(t.consd), e.cleaned = t.cleaned, e;
  }
  /**
   * Constrain the triangulation such that there is an edge between p1 and p2.
   */
  constrainOne(t, e) {
    const { triangles: n, halfedges: s } = this.del;
    this.assertVertex(t, t, e), this.assertVertex(e, t, e), this.assertInTriangulation(t, t, e), this.assertInTriangulation(e, t, e);
    const o = this.vertMap[t], i = this.maxConstrainSteps();
    let a = 0, c = o;
    do {
      if (++a > i)
        throw new Error(
          `Constraining edge [${t}, ${e}] exceeded the iteration limit`
        );
      const h = n[c], u = Et(c);
      if (h === e)
        return this.protect(c);
      const p = Mt(c), b = n[p];
      if (b === e)
        return this.protect(u), u;
      if (this.intersectSegments(t, e, b, h)) {
        c = p;
        break;
      }
      c = s[u];
    } while (c !== -1 && c !== o);
    let l = c, f = -1;
    for (; c !== -1; ) {
      if (++a > i)
        throw new Error(
          `Constraining edge [${t}, ${e}] exceeded the iteration limit`
        );
      const h = s[c], u = Mt(c), p = Mt(h), b = Et(h);
      if (h === -1)
        throw new Error("Constraining edge exited the hull");
      if (this.consd.has(c))
        throw new Error("Edge intersects already constrained edge");
      if (this.isCollinear(t, e, n[c]) || this.isCollinear(t, e, n[h]))
        throw new Error("Constraining edge intersects point");
      if (!this.intersectSegments(
        n[c],
        n[h],
        n[u],
        n[p]
      )) {
        if (f === -1 && (f = c), n[p] === e) {
          if (c === f)
            throw new Error("Infinite loop: non-convex quadrilateral");
          c = f, f = -1;
          continue;
        }
        if (this.intersectSegments(
          t,
          e,
          n[p],
          n[h]
        ))
          c = p;
        else if (this.intersectSegments(
          t,
          e,
          n[b],
          n[p]
        ))
          c = b;
        else if (f === c)
          throw new Error("Infinite loop: no further intersect after non-convex");
        continue;
      }
      if (this.flipDiagonal(c), this.intersectSegments(
        t,
        e,
        n[u],
        n[p]
      ) && (f === -1 && (f = u), f === u))
        throw new Error("Infinite loop: flipped diagonal still intersects");
      n[p] === e ? (l = p, c = f, f = -1) : this.intersectSegments(
        t,
        e,
        n[b],
        n[p]
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
    const s = this.vertMap.length;
    if (!Number.isInteger(t) || t < 0 || t >= s)
      throw new Error(
        `Invalid edge [${String(e)}, ${String(n)}]: vertex ids must be integers from 0 to ${s - 1}`
      );
  }
  /**
   * Fix the Delaunay condition.
   *
   * 最初の 1 回（`deep` で、まだ掃除が済んでいないとき）だけは、制約でない全部の辺を調べる。
   * Delaunator の外接円の判定は浮動小数点なので、厳密な述語での掃除を 1 回は通すため。
   * その後は、反転で触った辺（`flips` の印がある辺）だけを調べる。掃除の後に Delaunay でなくなりうるのは、
   * 反転で触った辺とその周りだけで、{@link flipDiagonal} はそこに印を付けるから、結果は変わらない。
   */
  delaunify(t = !1) {
    const { halfedges: e } = this.del, n = this.flips, s = this.consd, o = e.length;
    let i, a = !(t && this.cleaned);
    do {
      i = 0;
      for (let c = 0; c < o; c++) {
        if (s.has(c) || !a && !n.has(c))
          continue;
        n.delete(c);
        const l = e[c];
        l !== -1 && (n.delete(l), this.isDelaunay(c) || (this.flipDiagonal(c), i++));
      }
      a = !1;
    } while (t && i > 0);
    return t && (this.cleaned = !0), this;
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
    const { triangles: n, halfedges: s } = this.del, o = n.length / 3, i = (b, v, x) => {
      const A = t(v), y = t(x);
      return t(b).some((m) => A.includes(m) && y.includes(m));
    }, a = (b) => i(n[b * 3], n[b * 3 + 1], n[b * 3 + 2]), c = (b, v, x, A) => Math.sign(it(b[v * 2], b[v * 2 + 1], b[x * 2], b[x * 2 + 1], b[A * 2], b[A * 2 + 1])), l = e.map((b) => {
      let v = 0;
      for (let x = 0; x < o; x++) v += c(b, n[x * 3], n[x * 3 + 1], n[x * 3 + 2]);
      return v < 0 ? -1 : 1;
    }), f = (b) => {
      if (this.consd.has(b)) return !1;
      const v = s[b];
      if (v === -1) return !1;
      const x = n[b], A = n[Et(b)], y = n[Mt(b)], m = n[Mt(v)];
      return e.every((d, g) => c(d, y, x, m) === l[g] && c(d, m, A, y) === l[g]);
    };
    let h = 0, u = !0;
    for (; u; ) {
      u = !1;
      for (let b = 0; b < o; b++)
        if (a(b))
          for (let v = 0; v < 3; v++) {
            const x = b * 3 + v;
            if (!f(x)) continue;
            const A = s[x], y = n[x], m = n[Et(x)], d = n[Mt(x)], g = n[Mt(A)];
            if (!(i(d, y, g) && i(g, m, d))) {
              this.protect(this.flipDiagonal(x)), h++, u = !0;
              break;
            }
          }
    }
    let p = 0;
    for (let b = 0; b < o; b++) a(b) && p++;
    return { flips: h, remaining: p };
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
    const n = this.vertMap[e], { triangles: s, halfedges: o } = this.del;
    if (!(n < s.length))
      return 1 / 0;
    let i = n, a, c = 0;
    do {
      if (++c > s.length)
        throw new Error(
          `Looking up edge [${t}, ${e}] exceeded the iteration limit`
        );
      if (s[i] === t)
        return i;
      a = Et(i), i = o[a];
    } while (i !== -1 && i !== n);
    return s[Et(a)] === t ? -a : 1 / 0;
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
    const o = e[t];
    return o !== -1 && (n.add(t), n.add(o)), !0;
  }
  /**
   * Flip the edge shared by two triangles.
   */
  flipDiagonal(t) {
    const { triangles: e, halfedges: n } = this.del, s = this.flips, o = this.consd, i = n[t], a = Mt(t), c = Et(t), l = Mt(i), f = Et(i), h = n[a], u = n[l];
    if (o.has(t))
      throw new Error("Trying to flip a constrained edge");
    return e[t] = e[l], n[t] = u, s.set(t, s.has(l)) || o.set(t, o.has(l)), u !== -1 && (n[u] = t), n[a] = l, e[i] = e[a], n[i] = h, s.set(i, s.has(a)) || o.set(i, o.has(a)), h !== -1 && (n[h] = i), n[l] = a, this.markFlip(t), this.markFlip(c), this.markFlip(i), this.markFlip(f), s.add(a), o.delete(a), s.add(l), o.delete(l), this.updateVert(t), this.updateVert(c), this.updateVert(i), this.updateVert(f), a;
  }
  /**
   * Whether point p1, p2, and p are collinear.
   */
  isCollinear(t, e, n) {
    const s = this.del.coords;
    return it(
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
    const o = this.del.coords;
    return Fe(
      o[t * 2],
      o[t * 2 + 1],
      o[e * 2],
      o[e * 2 + 1],
      o[n * 2],
      o[n * 2 + 1],
      o[s * 2],
      o[s * 2 + 1]
    ) < 0;
  }
  /**
   * Whether the triangles sharing edg conform to the Delaunay condition.
   */
  isDelaunay(t) {
    const { triangles: e, halfedges: n } = this.del, s = n[t];
    if (s === -1)
      return !0;
    const o = e[Mt(t)], i = e[t], a = e[Et(t)], c = e[Mt(s)];
    return !this.inCircle(o, i, a, c);
  }
  /**
   * Update the vertex -> incoming edge map.
   */
  updateVert(t) {
    const { triangles: e, halfedges: n } = this.del, s = this.vertMap, o = e[t];
    let i = Mt(t), a = n[i];
    for (; a !== -1 && a !== t; )
      i = Mt(a), a = n[i];
    return s[o] = i, i;
  }
  /**
   * Whether the segments between vertices intersect.
   */
  intersectSegments(t, e, n, s) {
    const o = this.del.coords;
    return t === n || t === s || e === n || e === s ? !1 : Ee(
      o[t * 2],
      o[t * 2 + 1],
      o[e * 2],
      o[e * 2 + 1],
      o[n * 2],
      o[n * 2 + 1],
      o[s * 2],
      o[s * 2 + 1]
    );
  }
  static intersectSegments = Ee;
}
function ve(r, t, e) {
  return He(r, t, e).tin;
}
function He(r, t, e, n, s) {
  if (t || (t = []), typeof r != "object" || r.type !== "FeatureCollection")
    throw "Argument points must be FeatureCollection";
  if (!Array.isArray(t)) throw "Argument points must be Array of Array";
  const o = r.features.map(
    (v) => v.geometry.coordinates
  );
  let i = s?.snapshot ? Qt.restore(s.snapshot) : void 0;
  const a = i ? void 0 : Be.from(o);
  let c = i ? i.del : a, l = 0, f;
  const h = [];
  if (c.triangles.length !== 0 && (t.length !== 0 || n)) {
    if (!i) {
      i = new Qt(c);
      try {
        i.constrainAll(t);
      } catch (A) {
        if (!n?.allowUnusableBoundary) throw A;
        return { tin: St([]), remaining: 0, hasBoundary: !1, hull: [] };
      }
      s && (s.snapshot = i.snapshot());
    }
    const v = n ? s?.snapshot ?? i.snapshot() : void 0, x = (A) => {
      const y = Qt.restore(v);
      return y.constrainAll(A), y;
    };
    for (const A of n?.hull ?? [])
      try {
        i.constrainOne(A[0], A[1]), h.push(A);
      } catch {
        i = x(h);
      }
    n?.boundary && (f = Ei(i, n.boundary), f || (i = x(h))), n && ({ remaining: l } = i.forbidGroupTriangles(
      n.groupsOf,
      n.planes
    ), l -= f?.size ?? 0), c = i.del;
  }
  const u = [];
  for (let v = 0; v < c.triangles.length; v += 3)
    f?.has(v / 3) || u.push([c.triangles[v], c.triangles[v + 1], c.triangles[v + 2]]);
  const p = ["a", "b", "c"];
  return { tin: St(
    u.map((v) => {
      const x = {}, A = v.map((y, m) => {
        const d = r.features[y], g = d.geometry.coordinates, w = [g[0], g[1]];
        return g.length === 3 ? w[2] = g[2] : x[p[m]] = d.properties[e], w;
      });
      return A[3] = A[0], ce([A], x);
    })
  ), remaining: l, hasBoundary: f !== void 0, hull: h };
}
function Ei(r, t) {
  try {
    r.constrainAll(t);
  } catch {
    return;
  }
  const e = new Map(t), { triangles: n, halfedges: s } = r.del, o = (l) => {
    const f = n[l], h = n[Et(l)];
    return e.get(f) === h || e.get(h) === f;
  }, i = /* @__PURE__ */ new Set(), a = [], c = (l) => {
    const f = Math.floor(l / 3);
    i.has(f) || (i.add(f), a.push(f));
  };
  for (let l = 0; l < s.length; l++)
    s[l] === -1 && !o(l) && c(l);
  for (let l = 0; l < a.length; l++)
    for (let f = a[l] * 3; f < a[l] * 3 + 3; f++) {
      if (!e.has(n[f])) return;
      s[f] !== -1 && !o(f) && c(s[f]);
    }
  return i;
}
function Ie(r) {
  const t = /* @__PURE__ */ new Set(), e = [];
  if (r.forEach(([c, l], f) => {
    const h = `${c}:${l}`;
    t.has(h) || (t.add(h), e.push({ i: f, x: c, y: l }));
  }), e.length < 3) return [];
  const n = (c, l, f) => it(c.x, c.y, l.x, l.y, f.x, f.y), s = [...e].sort((c, l) => c.x - l.x || c.y - l.y), o = (c) => {
    const l = [];
    for (const f of c) {
      for (; l.length >= 2 && n(l[l.length - 2], l[l.length - 1], f) <= 0; ) l.pop();
      l.push(f);
    }
    return l.pop(), l;
  }, i = [...o(s), ...o([...s].reverse())];
  if (i.length < 3) return [];
  const a = [];
  for (let c = 0; c < i.length; c++) {
    const l = i[c], f = i[(c + 1) % i.length], h = f.x - l.x, u = f.y - l.y, p = h * h + u * u, b = e.filter((x) => x !== l && x !== f && n(l, f, x) === 0).map((x) => ({ r: x, t: ((x.x - l.x) * h + (x.y - l.y) * u) / p })).filter(({ t: x }) => x > 0 && x < 1).sort((x, A) => x.t - A.t).map(({ r: x }) => x), v = [l, ...b, f];
    for (let x = 0; x + 1 < v.length; x++) a.push([v[x].i, v[x + 1].i]);
  }
  return a;
}
function Me([r, t]) {
  return r < t ? `${r}-${t}` : `${t}-${r}`;
}
function Kt(r, t, e) {
  return qt(r, { target: { geom: t, index: e } });
}
function Wt(r) {
  return qt(r.properties.target.geom, {
    target: {
      geom: r.geometry.coordinates,
      index: r.properties.target.index
    }
  });
}
function Fn(r, t) {
  const e = r.length, n = t.geometry.coordinates;
  return Array.from({ length: e }, (s, o) => o).map((s) => {
    const o = (s + 1) % e, i = r[s], a = r[o], c = i.geometry.coordinates, l = Math.atan2(
      c[0] - n[0],
      c[1] - n[1]
    ), f = [t, i, a, t].map(
      (p) => p.geometry.coordinates
    ), h = {
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
    }, u = St([
      ce([f], h)
    ]);
    return [l, u];
  }).reduce(
    (s, o) => (s[0].push(o[0]), s[1].push(o[1]), s),
    [[], []]
  );
}
const Ii = [0.1, 0.15, 0.225, 0.34, 0.5];
function Ai(r, t) {
  return t ? r.hasBoundary !== t.hasBoundary ? r.hasBoundary : r.diagnostics.boundaryTriangleFlips < t.diagnostics.boundaryTriangleFlips : !0;
}
function Bn(r, t, e) {
  return Math.sign(it(r[0], r[1], t[0], t[1], e[0], e[1]));
}
function Ae(r, t = -1) {
  let e = 0;
  for (const n of r.features) {
    const { a: s, b: o, c: i } = n.properties;
    if (![s, o, i].some(
      ({ index: h }) => typeof h == "string" && h.startsWith("b")
    ))
      continue;
    const [a, c, l] = n.geometry.coordinates[0];
    Bn(a, c, l) * Bn(s.geom, o.geom, i.geom) * t <= 0 && e++;
  }
  return e;
}
function Rn(r, t, e) {
  if (r.some(([i, a]) => i === t[0] && a === t[1])) return !1;
  const n = r.map(
    ([i, a]) => Math.atan2(a - t[1], i - t[0])
  ), s = 2 * Math.PI;
  let o = 0;
  for (let i = 0; i < n.length; i++) {
    const c = (e * (n[(i + 1) % n.length] - n[i]) + s) % s;
    if (!(c > 0 && c < Math.PI)) return !1;
    o += c;
  }
  return Math.abs(o - s) < 1e-6;
}
function Pn(r, t, e, n, s, o = /* @__PURE__ */ new Set(), i) {
  const { minx: a, maxx: c, miny: l, maxy: f, centroid: h } = r, u = c - a, p = f - l, b = e.forw.length, v = Array.from({ length: b }, () => []);
  let x = 1;
  for (const [k, S] of e.edges)
    k < n && v[k].push(x), v[S].push(x), S < n && x++;
  const A = (k) => k.slice(0, b).map(({ geometry: S }) => S.coordinates), y = Ie(A(e.forw)), m = {
    forw: y.filter((k) => !o.has(Me(k))),
    bakw: Ie(A(e.bakw))
  }, d = [0], g = (k) => k >= b ? d : v[k];
  let w;
  for (const k of Ii) {
    const S = i?.get(k) ?? { forwReuse: {} };
    i?.set(k, S);
    const M = S.vertices ?? (S.vertices = t(
      {
        ...r,
        minx: a - k * u,
        maxx: c + k * u,
        miny: l - k * p,
        maxy: f + k * p
      },
      !0
    ));
    if (s && (M.length < 4 || !M.every(({ bakw: Y }) => Y.every(Number.isFinite)))) continue;
    const T = M.map(
      ({ forw: Y, bakw: L }, U) => Kt(Y, L, `b${U}`)
    ), N = St([...e.forw, ...T]), P = St([
      ...e.bakw,
      ...T.map(Wt)
    ]), C = [N, P].map(
      ({ features: Y }) => Float64Array.from(
        Y.flatMap(
          ({
            geometry: {
              coordinates: [L, U]
            }
          }) => [L, U]
        )
      )
    ), O = s !== void 0 || Rn(
      M.map((Y) => Y.forw),
      h.forw,
      -1
    ) && Rn(
      M.map((Y) => Y.bakw),
      h.bakw,
      1
    ) ? M.map((Y, L) => [
      b + L,
      b + (L + 1) % M.length
    ]) : void 0, I = { groupsOf: g, planes: C, boundary: O, allowUnusableBoundary: s !== void 0 }, B = s?.orientation ?? -1, D = He(
      N,
      e.edges,
      "target",
      { ...I, hull: m.forw },
      S.forwReuse
    ), $ = S.geographic ?? (S.geographic = (() => {
      const Y = He(P, e.edges, "target", {
        ...I,
        hull: m.bakw
      });
      return { built: Y, flips: Ae(Y.tin, B) };
    })()), E = $.built, R = D.tin, X = {
      ...E.tin,
      features: [...E.tin.features]
    }, z = Ae(R, B) + $.flips, q = {
      vertices: M,
      forw: R,
      bakw: X,
      diagnostics: {
        margin: k,
        boundaryTriangleFlips: z,
        remainingForbiddenTriangles: D.remaining + E.remaining
      },
      hasMapBoundary: D.hasBoundary,
      hasBoundary: D.hasBoundary && E.hasBoundary,
      forwHull: { all: y, applied: D.hull }
    };
    if (s) {
      if (s.accept(q)) return q;
      continue;
    }
    if (z === 0 && q.hasBoundary)
      return q;
    Ai(q, w) && (w = q);
  }
  return w;
}
const Dn = 1e-9;
function Ni(r, t) {
  const e = [[], [], [], []], n = [];
  return Object.keys(r).forEach((s) => {
    const o = r[s], i = o.forw, a = o.bakw, c = [
      i[0] - t.forw[0],
      i[1] - t.forw[1]
    ], l = [
      a[0] - t.bakw[0],
      t.bakw[1] - a[1]
    ], f = { forw: c, bakw: l };
    if (n.push(f), c[0] === 0 || c[1] === 0)
      return;
    let h = 0;
    c[0] > 0 && (h += 1), c[1] > 0 && (h += 2), e[h].push(f);
  }), { perQuad: e, aggregate: n };
}
function hs(r) {
  let t = 1 / 0, e = 0, n = 0;
  return r.forEach((s) => {
    const { forw: o, bakw: i } = s, a = Math.hypot(o[0], o[1]), c = Math.hypot(i[0], i[1]);
    if (c === 0) return;
    const l = a / c, f = Math.atan2(o[0], o[1]) - Math.atan2(i[0], i[1]);
    t = Math.min(t, l), e += Math.cos(f), n += Math.sin(f);
  }), isFinite(t) ? [t, Math.atan2(n, e)] : [1, 0];
}
const Oi = 0.6, Ti = 3, Fi = 0.5;
function Bi(r) {
  let t = 0, e = 0, n = 0, s = 0;
  if (r.forEach(({ forw: i, bakw: a }) => {
    t += i[1] * a[1] + i[0] * a[0], e += i[0] * a[1] - i[1] * a[0], n += a[0] * a[0] + a[1] * a[1], s += i[0] * i[0] + i[1] * i[1];
  }), !(!(n > 0 && s > 0) || !(Math.hypot(t, e) / Math.sqrt(s * n) >= Fi)))
    return [Math.hypot(t, e) / n, Math.atan2(e, t)];
}
function Ri(r) {
  const t = (s) => Math.hypot(s.forw[0], s.forw[1]), e = Math.max(...r.map(t)), n = r.filter((s) => t(s) >= Oi * e);
  return Bi(n.length >= Ti ? n : r) ?? hs(r);
}
function Pi(r, t, e, n) {
  const { perQuad: s, aggregate: o } = Ni(r, t), i = s.every((f) => f.length > 0), a = e === "birdeye" ? i ? s : [o] : [o], c = n === "farLsq" ? Ri : hs, l = a.map((f) => c(f));
  return l.length === 1 ? [l[0], l[0], l[0], l[0]] : l;
}
function Di(r, t) {
  let e = 0;
  return r[0] > t[0] && (e += 1), r[1] > t[1] && (e += 2), e;
}
function Ci(r, t, e) {
  const n = [
    r[0] - t.forw[0],
    r[1] - t.forw[1]
  ], o = Math.sqrt(n[0] ** 2 + n[1] ** 2) / e[0], i = Math.atan2(n[0], n[1]) - e[1];
  return [
    t.bakw[0] + o * Math.sin(i),
    t.bakw[1] - o * Math.cos(i)
  ];
}
function $i(r, t, e, n) {
  const s = t[0] - r[0], o = t[1] - r[1];
  if (Math.abs(s) < 1e-12 && Math.abs(o) < 1e-12) return null;
  const i = n[0] - e[0], a = n[1] - e[1], c = e[0] - r[0], l = e[1] - r[1], f = s * a - o * i;
  if (Math.abs(f) < 1e-12) return null;
  const h = (c * a - l * i) / f, u = (c * o - l * s) / f;
  return h <= 1e-10 || u < -1e-10 || u > 1 + 1e-10 ? null : { t: h, point: [r[0] + h * s, r[1] + h * o] };
}
function Vi(r, t, e) {
  const n = e.length;
  let s = -1 / 0, o = null;
  for (let i = 0; i < n; i++) {
    const a = (i + 1) % n, c = $i(
      r,
      t,
      e[i].bakw,
      e[a].bakw
    );
    c && c.t > s && (s = c.t, o = c.point);
  }
  return o;
}
function Je(r, t) {
  return Math.floor(Qe(r, t) / 10) % 36;
}
function Qe(r, t) {
  const n = Math.atan2(r[0] - t[0], r[1] - t[1]) * (180 / Math.PI);
  return n < 0 ? n + 360 : n;
}
function Cn(r, t, e, n, s, o) {
  const i = t[0] - r[0], a = t[1] - r[1];
  if (i === 0 && a === 0) return null;
  const c = [];
  if (i !== 0)
    for (const f of [e, n]) {
      const h = (f - r[0]) / i;
      if (h > 0) {
        const u = r[1] + h * a;
        u >= s && u <= o && c.push({ t: h, x: f, y: u });
      }
    }
  if (a !== 0)
    for (const f of [s, o]) {
      const h = (f - r[1]) / a;
      if (h > 0) {
        const u = r[0] + h * i;
        u >= e && u <= n && c.push({ t: h, x: u, y: f });
      }
    }
  if (c.length === 0) return null;
  c.sort((f, h) => f.t - h.t);
  const l = c[0];
  return [l.x, l.y];
}
function Xi(r, t, e, n) {
  const s = r[0], o = r[1], i = t[0], a = t[1], c = e[0], l = e[1], f = n[0], h = n[1];
  if (!(Number.isFinite(s) && Number.isFinite(o) && Number.isFinite(i) && Number.isFinite(a) && Number.isFinite(c) && Number.isFinite(l) && Number.isFinite(f) && Number.isFinite(h)) || s === c || s === f || i === c || i === f || s === i && o === a || c === f && l === h) {
    const R = si(un([r, t]), un([e, n]));
    return R.features.length > 0 && R.features[0].geometry ? R.features[0].geometry.coordinates : null;
  }
  const u = s > i || s === i && o > a, p = u ? i : s, b = u ? a : o, v = u ? s : i, x = u ? o : a, A = c > f || c === f && l > h, y = A ? f : c, m = A ? h : l, d = A ? c : f, g = A ? l : h;
  let w, k, S, M, T, N, P, C;
  if (p < y) {
    if (v < y) return null;
    w = y, k = m, S = d, M = g, T = p, N = b, P = v, C = x;
  } else {
    if (d < p) return null;
    w = p, k = b, S = v, M = x, T = y, N = m, P = d, C = g;
  }
  const _ = it(w, k, S, M, T, N), O = it(w, k, S, M, P, C);
  if (_ > 0 && O > 0 || _ < 0 && O < 0) return null;
  const I = (C - N) * (S - w) - (P - T) * (M - k), B = (P - T) * (k - N) - (C - N) * (w - T), D = (S - w) * (k - N) - (M - k) * (w - T);
  if (I === 0) return null;
  const $ = B / I, E = D / I;
  return $ >= 0 && $ <= 1 && E >= 0 && E <= 1 ? [w + $ * (S - w), k + $ * (M - k)] : null;
}
function $n(r, t, e) {
  const n = r.length, s = new Array(n).fill(1);
  for (const o of t)
    for (let i = 0; i < n; i++) {
      const a = (i + 1) % n, c = Xi(
        r[i].bakw,
        r[a].bakw,
        e.bakw,
        o.bakw
      );
      if (c) {
        const l = Math.sqrt(
          Math.pow(o.bakw[0] - e.bakw[0], 2) + Math.pow(o.bakw[1] - e.bakw[1], 2)
        ), f = Math.sqrt(
          Math.pow(c[0] - e.bakw[0], 2) + Math.pow(c[1] - e.bakw[1], 2)
        ), h = l / f;
        h > s[i] && (s[i] = h), h > s[a] && (s[a] = h);
      }
    }
  r.forEach((o, i) => {
    const a = s[i];
    o.bakw = [
      (o.bakw[0] - e.bakw[0]) * a + e.bakw[0],
      (o.bakw[1] - e.bakw[1]) * a + e.bakw[1]
    ];
  });
}
function nn(r, t, e, n, s) {
  const { convexBuf: o, centroid: i, allGcps: a, minx: c, maxx: l, miny: f, maxy: h } = r, u = s ? void 0 : Pi(o, i, t, n), b = [
    [c, f],
    [l, f],
    [l, h],
    [c, h]
  ].map((S) => ({
    forw: S,
    bakw: s ? s(S) : Ci(
      S,
      i,
      u[Di(S, i.forw)]
    )
  }));
  if (b.sort(
    (S, M) => Math.atan2(S.forw[0] - i.forw[0], S.forw[1] - i.forw[1]) - Math.atan2(M.forw[0] - i.forw[0], M.forw[1] - i.forw[1])
  ), s || $n(b, a, i), !e || r.ring?.cornersOnly) return b;
  const v = 4, x = b.map(
    (S) => Math.atan2(S.forw[0] - i.forw[0], S.forw[1] - i.forw[1])
  ), A = b.map(
    (S) => Math.atan2(
      S.bakw[0] - i.bakw[0],
      -(S.bakw[1] - i.bakw[1])
    )
  );
  function y(S) {
    for (let M = 0; M < v; M++) {
      const T = (M + 1) % v, N = x[M], P = M < v - 1 ? x[T] : x[T] + 2 * Math.PI;
      let C = S;
      for (; C < N; ) C += 2 * Math.PI;
      for (; C >= N + 2 * Math.PI; ) C -= 2 * Math.PI;
      if (C >= N && C < P)
        return { i: M, j: T, frac: (C - N) / (P - N) };
    }
    return { i: 0, j: 1, frac: 0 };
  }
  function m(S) {
    const { i: M, j: T, frac: N } = y(S), P = A[M];
    let _ = A[T] - P;
    for (; _ > Math.PI; ) _ -= 2 * Math.PI;
    for (; _ < -Math.PI; ) _ += 2 * Math.PI;
    return P + N * _;
  }
  const d = new Set(
    b.map(
      (S) => Math.floor(Qe(S.forw, i.forw) / 10) % 36
    )
  ), g = a.map((S) => ({
    forw: S.forw,
    bakw: S.bakw,
    angleDeg: Qe(S.forw, i.forw),
    forwDist: Math.hypot(S.forw[0] - i.forw[0], S.forw[1] - i.forw[1])
  })), w = [];
  for (let S = 0; S < 36; S++) {
    if (d.has(S) || r.ring?.skipBins?.has(S)) continue;
    const M = S * 10, T = g.filter((E) => {
      if (E.forwDist === 0) return !1;
      const R = ((E.angleDeg - M) % 360 + 360) % 360;
      return R < 10 + Dn || R > 360 - Dn;
    });
    let N = null;
    if (T.length > 0) {
      const E = T.reduce((R, X) => X.forwDist > R.forwDist ? X : R);
      N = Cn(i.forw, E.forw, c, l, f, h);
    }
    if (!N) {
      const E = (M + 5) % 360 * (Math.PI / 180), R = [
        i.forw[0] + Math.sin(E),
        i.forw[1] + Math.cos(E)
      ];
      N = Cn(i.forw, R, c, l, f, h);
    }
    if (!N) continue;
    const [P, C] = N, _ = 1e-9 * Math.max(l - c, h - f);
    if ([...b, ...w].some(
      (E) => Math.abs(E.forw[0] - P) <= _ && Math.abs(E.forw[1] - C) <= _
    )) continue;
    if (s) {
      w.push({ forw: N, bakw: s(N) });
      continue;
    }
    const O = [N[0] - i.forw[0], N[1] - i.forw[1]], I = Math.atan2(O[0], O[1]), B = m(I), D = [
      i.bakw[0] + Math.sin(B),
      i.bakw[1] - Math.cos(B)
    ], $ = Vi(i.bakw, D, b);
    $ && w.push({ forw: N, bakw: $ });
  }
  const k = [...b, ...w];
  return k.sort(
    (S, M) => Math.atan2(S.forw[0] - i.forw[0], S.forw[1] - i.forw[1]) - Math.atan2(M.forw[0] - i.forw[0], M.forw[1] - i.forw[1])
  ), s || $n(k, a, i), k;
}
function Li(r, t = !1) {
  return nn(r, "plain", t, t ? "farLsq" : "min");
}
function zi(r, t = !1) {
  return nn(r, "birdeye", t, "min");
}
function Yi(r, t) {
  const e = /* @__PURE__ */ new Set();
  return nn(r, "plain", !0, "min", t).filter(({ forw: [n, s] }) => {
    const o = `${n}:${s}`;
    return e.has(o) ? !1 : (e.add(o), !0);
  });
}
const Vn = (r) => typeof r == "string" && r.startsWith("b");
function Ui(r, t) {
  const e = (n, s) => {
    for (let o = 0; o < 3; o++) {
      const i = n.g[o], a = n.g[(o + 1) % 3];
      if (s.g.every((c) => n.sign * it(i[0], i[1], a[0], a[1], c[0], c[1]) <= 0)) return !0;
    }
    return !1;
  };
  return !e(r, t) && !e(t, r);
}
function qi(r) {
  const t = r.features.map((a) => {
    const { a: c, b: l, c: f } = a.properties, h = [c.geom, l.geom, f.geom], u = a.geometry.coordinates[0].slice(0, 3), p = h.map(([A]) => A), b = h.map(([, A]) => A), v = Math.sign(it(u[0][0], u[0][1], u[1][0], u[1][1], u[2][0], u[2][1])), x = Math.sign(it(h[0][0], h[0][1], h[1][0], h[1][1], h[2][0], h[2][1]));
    return {
      ids: [c.index, l.index, f.index],
      f: u,
      g: h,
      sign: x,
      ratio: v * x,
      aux: [c.index, l.index, f.index].some(Vn),
      minx: Math.min(...p),
      maxx: Math.max(...p),
      miny: Math.min(...b),
      maxy: Math.max(...b)
    };
  }), e = t.map((a) => a.ratio), n = e.reduce((a, c) => a + c, 0) < 0 ? -1 : 1, s = /* @__PURE__ */ new Set();
  t.forEach((a, c) => {
    a.aux && (e[c] === 0 || e[c] !== n) && s.add(c);
  });
  const o = t.map((a, c) => c).sort((a, c) => t[a].minx - t[c].minx);
  for (let a = 0; a < o.length; a++) {
    const c = t[o[a]];
    if (c.sign !== 0)
      for (let l = a + 1; l < o.length; l++) {
        const f = t[o[l]];
        if (f.minx >= c.maxx) break;
        f.sign === 0 || f.miny >= c.maxy || c.miny >= f.maxy || !c.aux && !f.aux || Ui(c, f) && (s.add(o[a]), s.add(o[l]));
      }
  }
  const i = /* @__PURE__ */ new Map();
  for (const a of s)
    t[a].ids.forEach((c, l) => {
      Vn(c) && i.set(String(c), t[a].f[l]);
    });
  return [...i.values()];
}
function lo(r) {
  return us(r, 1 / 0);
}
const Xn = 1e5, ji = 16;
function us(r, t) {
  return Gi(r), new Ki(r).findSegmentIntersections(t).map(
    (s) => qt([s.x, s.y])
  );
}
function Gi(r) {
  for (let t = 0, e = r.length; t < e; t++) {
    const n = r[t];
    oe(n) || Yt(
      "findIntersections() received invalid coordinates:",
      `line=${t}`,
      `points=${n}`
    );
    for (let s = 0, o = n.length; s < o; s++) {
      const i = n[s];
      (!oe(i) || !Number.isFinite(i[0]) || !Number.isFinite(i[1])) && Yt(
        "findIntersections() received non-finite coordinates:",
        `line=${t}`,
        `point=${s}`,
        `coordinates=${JSON.stringify(i)}`
      );
    }
  }
}
class Ki {
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
    const e = [], n = [], s = t.map((o) => {
      const i = o ? o.length : 0;
      for (let a = 0; a < i; a++)
        e.push(o[a][0]), n.push(o[a][1]);
      return i;
    });
    this.initXYData(s, e, n);
  }
  initXYData(t, e, n) {
    const s = t.length;
    this._xx = new Float64Array(e), this._yy = new Float64Array(n), this._nn = new Uint32Array(t), this._zz = null, this._zlimit = 0, this._filteredArcIter = null, this._ii = new Uint32Array(s);
    let o = 0;
    for (let i = 0; i < s; i++)
      this._ii[i] = o, o += t[i];
    (o != this._xx.length || this._xx.length != this._yy.length) && Yt("ArcCollection#initXYData() Counting error"), this.initBounds(), this._arcIter = new gr(this._xx, this._yy);
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
    const s = n.length, o = new Float64Array(s * 4), i = new ae();
    let a = 0, c, l, f;
    for (let h = 0; h < s; h++)
      c = n[h], c > 0 && (l = h * 4, f = pr(t, e, a, c), o[l++] = f[0], o[l++] = f[1], o[l++] = f[2], o[l] = f[3], a += c, i.mergeBounds(f));
    return {
      bb: o,
      bounds: i
    };
  }
  getBounds() {
    return this._allBounds ? this._allBounds.clone() : new ae();
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
    const n = t >= 0, s = n ? t : ~t, o = this.getRetainedInterval(), i = this._nn[s], a = n ? 1 : -1;
    let c = n ? this._ii[s] : this._ii[s] + i - 1, l = c, f = 0;
    for (let h = 1; h < i; h++)
      l += a, (o === 0 || this._zz[l] >= o) && (e(c, l, this._xx, this._yy), c = l, f++);
    return f;
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
      (s, o, i, a) => {
        t += Math.abs(i[s] - i[o]), e += Math.abs(a[s] - a[o]);
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
    const e = this.getBounds(), n = e.ymin || 0, s = (e.ymax || 0) - n, o = this.calcSegmentIntersectionStripeCount(), i = new Uint32Array(o), a = o > 1 ? (m) => Math.floor((o - 1) * (m - n) / s) : () => 0, c = o + 1;
    let l;
    this.forEachSegment(
      (m, d, g, w) => {
        let k = a(w[m]);
        const S = a(w[d]);
        let M = 0;
        for (; i[k] = i[k] + 2, k != S; )
          M++, M > c && Yt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${o}`,
            `s1=${k}`,
            `s2=${S}`
          ), k += S > k ? 1 : -1;
      }
    );
    const f = this.getUint32Array(Ji(i));
    let h = 0;
    const u = [];
    Qi(i, (m) => {
      const d = h;
      h += m, u.push(f.subarray(d, h));
    }), Zi(i, 0), this.forEachSegment(
      (m, d, g, w) => {
        let k = a(w[m]);
        const S = a(w[d]);
        let M, T, N = 0;
        for (; M = i[k], i[k] = M + 2, T = u[k], T[M] = m, T[M + 1] = d, k != S; )
          N++, N > c && Yt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${o}`,
            `s1=${k}`,
            `s2=${S}`
          ), k += S > k ? 1 : -1;
      }
    );
    const p = this.getVertexData(), b = t * ji;
    let v = 0;
    const x = /* @__PURE__ */ new Set(), A = /* @__PURE__ */ new Map(), y = (m) => {
      v++;
      const d = dr(m);
      return x.has(d) || (x.add(d), A.set(`${m.x}:${m.y}`, m)), A.size >= t || v >= b;
    };
    if (p.xx && p.yy)
      for (l = 0; l < o && !tr(u[l], p.xx, p.yy, y); l++)
        ;
    return Array.from(A.values());
  }
}
function Yt(...r) {
  const t = r.join(" ");
  throw new Error(t);
}
function oe(r) {
  return r ? Hi(r) ? !0 : Wi(r) ? !1 : r.length === 0 ? !0 : r.length > 0 : !1;
}
function Wi(r) {
  return r != null && r.toString === String.prototype.toString;
}
function Hi(r) {
  return Array.isArray(r);
}
function Ji(r, t) {
  oe(r) || Yt("utils.sum() expects an array, received:", r);
  let e = 0, n;
  for (let s = 0, o = r.length; s < o; s++)
    n = r[s], n && (e += n);
  return e;
}
function Qi(r, t, e) {
  if (!oe(r))
    throw new Error(`#forEach() takes an array-like argument. ${r}`);
  for (let n = 0, s = r.length; n < s; n++)
    t.call(e, r[n], n);
}
function Zi(r, t) {
  for (let e = 0, n = r.length; e < n; e++)
    r[e] = t;
  return r;
}
function tr(r, t, e, n) {
  const s = r.length - 2;
  let o, i, a, c, l, f, h, u, p, b, v, x, A, y, m, d, g;
  for (fr(t, r), d = 0; d < s; ) {
    for (o = r[d], i = r[d + 1], l = t[o], f = t[i], p = e[o], b = e[i], g = d; g < s && (g += 2, a = r[g], h = t[a], !(f < h)); ) {
      if (v = e[a], c = r[g + 1], u = t[c], x = e[c], p >= v) {
        if (p > x && b > v && b > x) continue;
      } else if (p < x && b < v && b < x) continue;
      if (!(o == a || o == c || i == a || i == c) && (A = er(
        l,
        p,
        f,
        b,
        h,
        v,
        u,
        x
      ), A && (y = [o, i], m = [a, c], n(zn(A, y, m, t, e)) || A.length == 4 && n(zn(A.slice(2), y, m, t, e)))))
        return !0;
    }
    d += 2;
  }
  return !1;
}
function er(r, t, e, n, s, o, i, a) {
  const c = nr(r, t, e, n, s, o, i, a);
  let l = null;
  return c && (l = sr(r, t, e, n, s, o, i, a), l ? lr(r, t, e, n, s, o, i, a) && (l = null) : l = cr(r, t, e, n, s, o, i, a)), l;
}
function nr(r, t, e, n, s, o, i, a) {
  return se(r, t, e, n, s, o) * se(r, t, e, n, i, a) <= 0 && se(s, o, i, a, r, t) * se(s, o, i, a, e, n) <= 0;
}
function se(r, t, e, n, s, o) {
  return ds(r - s, t - o, e - s, n - o);
}
function ds(r, t, e, n) {
  return r * n - t * e;
}
function sr(r, t, e, n, s, o, i, a) {
  let c = ye(r, t, e, n, s, o, i, a), l;
  return c && (l = rr(c[0], c[1], r, t, e, n, s, o, i, a), l == 1 ? c = ye(e, n, r, t, s, o, i, a) : l == 2 ? c = ye(s, o, i, a, r, t, e, n) : l == 3 && (c = ye(i, a, s, o, r, t, e, n))), c && ar(c, r, t, e, n, s, o, i, a), c;
}
function ye(r, t, e, n, s, o, i, a) {
  const c = ds(e - r, n - t, i - s, a - o), l = 1e-18;
  let f;
  if (c === 0) return null;
  const h = se(s, o, i, a, r, t) / c;
  return c <= l && c >= -l ? f = ir(r, t, e, n, s, o, i, a) : f = [r + h * (e - r), t + h * (n - t)], f;
}
function ir(r, t, e, n, s, o, i, a) {
  let c = null;
  return !Ot(r, s, i) && !Ot(t, o, a) ? c = [r, t] : !Ot(e, s, i) && !Ot(n, o, a) ? c = [e, n] : !Ot(s, r, e) && !Ot(o, t, n) ? c = [s, o] : !Ot(i, r, e) && !Ot(a, t, n) && (c = [i, a]), c;
}
function Ot(r, t, e) {
  let n;
  return t < e ? n = r < t || r > e : t > e ? n = r > t || r < e : n = r != t, n;
}
function rr(r, t, ...e) {
  let n = -1, s = 1 / 0, o;
  for (let i = 0, a = 0, c = e.length; a < c; i++, a += 2)
    o = or(r, t, e[a], e[a + 1]), o < s && (s = o, n = i);
  return n;
}
function or(r, t, e, n) {
  const s = r - e, o = t - n;
  return s * s + o * o;
}
function ar(r, t, e, n, s, o, i, a, c) {
  let l = r[0], f = r[1];
  l = be(l, t, n), l = be(l, o, a), f = be(f, e, s), f = be(f, i, c), r[0] = l, r[1] = f;
}
function be(r, t, e) {
  let n;
  return Ot(r, t, e) && (n = Math.abs(r - t) < Math.abs(r - e) ? t : e, r = n), r;
}
function cr(r, t, e, n, s, o, i, a) {
  const c = Math.min(r, e, s, i), l = Math.max(r, e, s, i), f = Math.min(t, n, o, a), h = Math.max(t, n, o, a), u = h - f > l - c;
  let p = [];
  return (u ? Ct(t, f, h) : Ct(r, c, l)) && p.push(r, t), (u ? Ct(n, f, h) : Ct(e, c, l)) && p.push(e, n), (u ? Ct(o, f, h) : Ct(s, c, l)) && p.push(s, o), (u ? Ct(a, f, h) : Ct(i, c, l)) && p.push(i, a), (p.length != 2 && p.length != 4 || p.length == 4 && p[0] == p[2] && p[1] == p[3]) && (p = null), p;
}
function lr(r, t, e, n, s, o, i, a) {
  return r == s && t == o || r == i && t == a || e == s && n == o || e == i && n == a;
}
function Ct(r, t, e) {
  return r > t && r < e;
}
function fr(r, t) {
  hr(r, t), gs(r, t, 0, t.length - 2);
}
function hr(r, t) {
  for (let e = 0, n = t.length; e < n; e += 2)
    r[t[e]] > r[t[e + 1]] && ur(t, e, e + 1);
}
function ur(r, t, e) {
  const n = r[t];
  r[t] = r[e], r[e] = n;
}
function gs(r, t, e, n) {
  let s = e, o = n, i, a;
  for (; s < n; ) {
    for (i = r[t[e + n >> 2 << 1]]; s <= o; ) {
      for (; r[t[s]] < i; ) s += 2;
      for (; r[t[o]] > i; ) o -= 2;
      s <= o && (a = t[s], t[s] = t[o], t[o] = a, a = t[s + 1], t[s + 1] = t[o + 1], t[o + 1] = a, s += 2, o -= 2);
    }
    if (o - e < 40 ? Ln(r, t, e, o) : gs(r, t, e, o), n - s < 40) {
      Ln(r, t, s, n);
      return;
    }
    e = s, o = n;
  }
}
function Ln(r, t, e, n) {
  let s, o;
  for (let i = e + 2; i <= n; i += 2) {
    s = t[i], o = t[i + 1];
    let a;
    for (a = i - 2; a >= e && r[s] < r[t[a]]; a -= 2)
      t[a + 2] = t[a], t[a + 3] = t[a + 1];
    t[a + 2] = s, t[a + 3] = o;
  }
}
function zn(r, t, e, n, s) {
  const o = r[0], i = r[1];
  t = Yn(o, i, t[0], t[1], n, s), e = Yn(o, i, e[0], e[1], n, s);
  const a = t[0] < e[0] ? t : e, c = a == t ? e : t;
  return { x: o, y: i, a, b: c };
}
function Yn(r, t, e, n, s, o) {
  let i = e < n ? e : n, a = i === e ? n : e;
  return s[i] == r && o[i] == t ? a = i : s[a] == r && o[a] == t && (i = a), [i, a];
}
function dr(r) {
  return `${r.a.join(",")};${r.b.join(",")}`;
}
class gr {
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
function pr(r, t, e, n) {
  let s = e | 0;
  const o = isNaN(n) ? r.length - s : n + s;
  let i, a, c, l, f, h;
  if (o > 0)
    c = f = r[s], l = h = t[s];
  else return [void 0, void 0, void 0, void 0];
  for (s++; s < o; s++)
    i = r[s], a = t[s], i < c && (c = i), i > f && (f = i), a < l && (l = a), a > h && (h = a);
  return [c, l, f, h];
}
class ae {
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
    return new ae(
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
    let o, i, a, c;
    if (arguments.length == 1)
      if (oe(t)) {
        const l = t;
        o = l[0], i = l[1], a = l[2], c = l[3];
      } else {
        const l = t;
        o = l.xmin, i = l.ymin, a = l.xmax, c = l.ymax;
      }
    else
      o = t, i = e, a = n, c = s;
    return this.xmin = o, this.ymin = i, this.xmax = a, this.ymax = c, (o > a || i > c) && this.update(), this;
  }
  update() {
    let t;
    this.xmin > this.xmax && (t = this.xmin, this.xmin = this.xmax, this.xmax = t), this.ymin > this.ymax && (t = this.ymin, this.ymin = this.ymax, this.ymax = t);
  }
  mergeBounds(t, ...e) {
    let n, s, o, i;
    return t instanceof ae ? (n = t.xmin, s = t.ymin, o = t.xmax, i = t.ymax) : e.length == 3 ? (n = t, s = e[0], o = e[1], i = e[2]) : t.length == 4 ? (n = t[0], s = t[1], o = t[2], i = t[3]) : Yt("Bounds#mergeBounds() invalid argument:", t), this.xmin === void 0 ? this.setBounds(n, s, o, i) : (n < this.xmin && (this.xmin = n), s < this.ymin && (this.ymin = s), o > this.xmax && (this.xmax = o), i > this.ymax && (this.ymax = i)), this;
  }
}
function Ne(r) {
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
function ps(r, t, e) {
  const n = Ne(t.forw), s = Ne(t.bakw);
  if (JSON.stringify(n) != JSON.stringify(s))
    throw `${JSON.stringify(t, null, 2)}
${JSON.stringify(
      n
    )}
${JSON.stringify(s)}`;
  for (let o = 0; o < n.length; o++) {
    const i = n[o];
    r[i] || (r[i] = []), r[i].push(t);
  }
  e && (e.forw.features.push(t.forw), e.bakw.features.push(t.bakw));
}
function Un(r, t, e) {
  const n = Ne(t.forw), s = Ne(t.bakw);
  if (JSON.stringify(n) != JSON.stringify(s))
    throw `${JSON.stringify(t, null, 2)}
${JSON.stringify(n)}
${JSON.stringify(s)}`;
  if (n.forEach((o) => {
    const i = r[o];
    if (!i) return;
    const a = i.filter((c) => c !== t);
    a.length === 0 ? delete r[o] : r[o] = a;
  }), e) {
    const o = (i, a) => {
      !i || !a || (i.features = i.features.filter((c) => c !== a));
    };
    o(e.forw, t.forw), o(e.bakw, t.bakw);
  }
}
function xe(r, t = 1e-6) {
  const [e, n] = r[0], [s, o] = r[1], [i, a] = r[2];
  return Math.abs((s - e) * (a - n) - (i - e) * (o - n)) < t;
}
function mr(r, t) {
  const e = /* @__PURE__ */ new Set();
  return r.forEach((n) => {
    if (n.length !== 2) return;
    const s = n.map((o) => `${t?.[o] ?? o}`);
    e.add(s.sort().join("-"));
  }), e;
}
function ie(r) {
  return ["a", "b", "c"].map((t, e) => ({
    prop: r.properties[t],
    geom: r.geometry.coordinates[0][e]
  }));
}
const wr = 10;
function vr(r, t, e, n, s, o) {
  if (!r && !t) return !1;
  const i = r ? 0 : 1, a = 1 - i, c = e[i], l = e[a];
  if (!c || !l) return !1;
  const f = kt(l.geom);
  let h = !1, u = !1;
  for (let p = 0; p <= 1; p++) {
    const b = n[p];
    if (!b) continue;
    const v = [String(b.prop.index), String(c.prop.index)].sort().join("-"), x = s[v];
    if (!x || x.length < 2) continue;
    const A = x.find(
      (N) => N.bakw !== o[i].bakw
    );
    if (!A) continue;
    const m = ie(A.bakw).find(
      (N) => String(N.prop.index) !== String(b.prop.index) && String(N.prop.index) !== String(c.prop.index)
    );
    if (!m) continue;
    h = !0;
    const d = kt(m.geom), g = kt(b.geom), w = kt(c.geom), k = w[0] - g[0], S = w[1] - g[1], M = k * (f[1] - g[1]) - S * (f[0] - g[0]), T = k * (d[1] - g[1]) - S * (d[0] - g[0]);
    if (M * T > 0) {
      u = !0;
      break;
    }
  }
  return h && !u;
}
function yr(r, t, e, n) {
  if (!r && !t) return !1;
  if (e[0] && e[1] && n[0] && n[1]) {
    const s = n.map((f) => kt(f.geom)), o = e.map((f) => kt(f.geom)), i = s[1][0] - s[0][0], a = s[1][1] - s[0][1], c = i * (o[0][1] - s[0][1]) - a * (o[0][0] - s[0][0]), l = i * (o[1][1] - s[0][1]) - a * (o[1][0] - s[0][0]);
    return c * l < 0;
  }
  return !1;
}
function br(r, t, e, n) {
  const s = mr(e, n), o = /* @__PURE__ */ new Set();
  let i = !1;
  for (let a = 0; a < wr; a++) {
    let c = !1;
    for (const l of Object.keys(t)) {
      if (o.has(l)) continue;
      o.add(l);
      const f = t[l];
      if (!f || f.length < 2) continue;
      const h = l.split("-");
      if (h.length !== 2 || s.has(l)) continue;
      const u = ie(f[0].bakw), p = ie(f[1].bakw), b = ie(f[0].forw), v = ie(f[1].forw), x = h.map(
        (E) => u.find((R) => `${R.prop.index}` === E) || p.find((R) => `${R.prop.index}` === E)
      ), A = h.map(
        (E) => b.find((R) => `${R.prop.index}` === E) || v.find((R) => `${R.prop.index}` === E)
      );
      if (x.some((E) => !E) || A.some((E) => !E))
        continue;
      const y = [u, p].map(
        (E) => E.find((R) => !h.includes(`${R.prop.index}`))
      ), m = [b, v].map(
        (E) => E.find((R) => !h.includes(`${R.prop.index}`))
      );
      if (y.some((E) => !E) || m.some((E) => !E))
        continue;
      const d = f[0].bakw.geometry.coordinates[0].slice(0, 3).map((E) => kt(E)), g = f[1].bakw.geometry.coordinates[0].slice(0, 3).map((E) => kt(E)), w = f[0].forw.geometry.coordinates[0].slice(0, 3).map((E) => kt(E)), k = f[1].forw.geometry.coordinates[0].slice(0, 3).map((E) => kt(E)), S = xe(d), M = xe(g), T = xe(w), N = xe(k), P = vr(
        S,
        M,
        y,
        x,
        t,
        f
      ), C = yr(
        T,
        N,
        y,
        x
      );
      if (!(P || C || qn(
        kt(y[0].geom),
        g
      ) || qn(
        kt(y[1].geom),
        d
      )))
        continue;
      const O = A.map(
        (E) => kt(E.geom)
      ), I = m.map(
        (E) => kt(E.geom)
      ), B = xr([
        ...O,
        ...I
      ]), D = kr(B), $ = jn(
        O[0],
        O[1],
        I[0]
      ) + jn(
        O[0],
        O[1],
        I[1]
      );
      Ze(D, $) && (Un(t, f[0], r), Un(t, f[1], r), x.forEach((E) => {
        if (!E) return;
        const R = [
          E.geom,
          y[0].geom,
          y[1].geom,
          E.geom
        ], X = {
          a: E.prop,
          b: y[0].prop,
          c: y[1].prop
        }, z = ce([R], X), q = as(z);
        ps(t, {
          forw: q,
          bakw: z
        }, r);
      }), c = !0, i = !0);
    }
    if (!c) break;
  }
  return i;
}
function kt(r) {
  return [r[0], r[1]];
}
function qn(r, t) {
  const [e, n] = t[0], [s, o] = t[1], [i, a] = t[2], c = i - e, l = a - n, f = s - e, h = o - n, u = r[0] - e, p = r[1] - n, b = c * c + l * l, v = c * f + l * h, x = c * u + l * p, A = f * f + h * h, y = f * u + h * p, m = b * A - v * v;
  if (m === 0) return !1;
  const d = 1 / m, g = (A * x - v * y) * d, w = (b * y - v * x) * d, k = 1e-9;
  return g >= -k && w >= -k && g + w <= 1 + k;
}
function xr(r) {
  const t = r.map((i) => i.slice()).filter(
    (i, a, c) => c.findIndex(
      (l) => Ze(l[0], i[0]) && Ze(l[1], i[1])
    ) === a
  );
  if (t.length <= 1) return t;
  const e = t.sort(
    (i, a) => i[0] === a[0] ? i[1] - a[1] : i[0] - a[0]
  ), n = (i, a, c) => (a[0] - i[0]) * (c[1] - i[1]) - (a[1] - i[1]) * (c[0] - i[0]), s = [];
  for (const i of e) {
    for (; s.length >= 2 && n(
      s[s.length - 2],
      s[s.length - 1],
      i
    ) <= 0; )
      s.pop();
    s.push(i);
  }
  const o = [];
  for (let i = e.length - 1; i >= 0; i--) {
    const a = e[i];
    for (; o.length >= 2 && n(
      o[o.length - 2],
      o[o.length - 1],
      a
    ) <= 0; )
      o.pop();
    o.push(a);
  }
  return o.pop(), s.pop(), s.concat(o);
}
function kr(r) {
  if (r.length < 3) return 0;
  let t = 0;
  for (let e = 0; e < r.length; e++) {
    const [n, s] = r[e], [o, i] = r[(e + 1) % r.length];
    t += n * i - o * s;
  }
  return Math.abs(t) / 2;
}
function jn(r, t, e) {
  return Math.abs(
    (r[0] * (t[1] - e[1]) + t[0] * (e[1] - r[1]) + e[0] * (r[1] - t[1])) / 2
  );
}
function Ze(r, t, e = 1e-9) {
  return Math.abs(r - t) <= e;
}
const Sr = (r) => typeof r == "string" && r.startsWith("b");
function Mr(r, t) {
  const e = (n, s) => {
    for (let o = 0; o < 3; o++) {
      const i = n.g[o], a = n.g[(o + 1) % 3];
      if (s.g.every((c) => n.sign * it(i[0], i[1], a[0], a[1], c[0], c[1]) <= 0)) return !0;
    }
    return !1;
  };
  return !e(r, t) && !e(t, r);
}
function _r(r, t, e) {
  if (t.length === 0) return [];
  const n = r.features.map((v) => {
    const { a: x, b: A, c: y } = v.properties, m = [x.geom, A.geom, y.geom], [d, g, w] = v.geometry.coordinates[0], k = m.map(([N]) => N), S = m.map(([, N]) => N), M = Math.sign(it(d[0], d[1], g[0], g[1], w[0], w[1])), T = Math.sign(it(m[0][0], m[0][1], m[1][0], m[1][1], m[2][0], m[2][1]));
    return {
      ids: [x.index, A.index, y.index].map(String),
      g: m,
      sign: T,
      ratio: M * T,
      aux: [x.index, A.index, y.index].some(Sr),
      minx: Math.min(...k),
      maxx: Math.max(...k),
      miny: Math.min(...S),
      maxy: Math.max(...S)
    };
  }), s = n.map((v) => v.ratio), o = s.reduce((v, x) => v + x, 0) < 0 ? -1 : 1, i = (v, x) => v < x ? `${v}|${x}` : `${x}|${v}`, a = /* @__PURE__ */ new Map();
  n.forEach((v, x) => {
    for (let A = 0; A < 3; A++) {
      const y = i(v.ids[A], v.ids[(A + 1) % 3]), m = a.get(y);
      m ? m.push(x) : a.set(y, [x]);
    }
  });
  const c = ([v, x]) => i(String(e[v]), String(e[x])), l = /* @__PURE__ */ new Set();
  for (const v of t) for (const x of a.get(c(v)) ?? []) l.add(x);
  const f = (v) => n[v].aux || l.has(v), h = /* @__PURE__ */ new Set();
  n.forEach((v, x) => {
    f(x) && (s[x] === 0 || s[x] !== o) && h.add(x);
  });
  const u = n.map((v, x) => x).sort((v, x) => n[v].minx - n[x].minx);
  for (let v = 0; v < u.length; v++) {
    const x = n[u[v]];
    if (x.sign !== 0)
      for (let A = v + 1; A < u.length; A++) {
        const y = n[u[A]];
        if (y.minx >= x.maxx) break;
        y.sign === 0 || y.miny >= x.maxy || x.miny >= y.maxy || !f(u[v]) && !f(u[A]) || Mr(x, y) && (h.add(u[v]), h.add(u[A]));
      }
  }
  if (h.size === 0) return [];
  const p = t.filter((v) => (a.get(c(v)) ?? []).some((x) => h.has(x)));
  if (p.length > 0) return p;
  const b = /* @__PURE__ */ new Set();
  for (const v of h) for (const x of n[v].ids) x.startsWith("b") || b.add(x);
  return t.filter(
    ([v, x]) => b.has(String(e[v])) || b.has(String(e[x]))
  );
}
const Er = 4, Gn = 32, Ir = 1, Ar = 0.4, ms = 4, Nr = 1e-4, ws = 0.25, Or = 0.01, $t = (r, t) => String(r) < String(t) ? `${r}|${t}` : `${t}|${r}`;
function We(r, t, e) {
  const n = t.filter((l) => !String(l.properties.target.index).startsWith("b")).map((l) => ({
    id: l.properties.target.index,
    paper: l.geometry.coordinates,
    geo: l.properties.target.geom
  })), s = /* @__PURE__ */ new Set();
  let o = 0, i = 0;
  const a = r.features.map((l) => {
    const { a: f, b: h, c: u } = l.properties, [p, b, v] = l.geometry.coordinates[0];
    s.add($t(f.index, h.index)), s.add($t(f.index, u.index)), s.add($t(h.index, u.index));
    const x = Math.sign(it(p[0], p[1], b[0], b[1], v[0], v[1])) * Math.sign(it(f.geom[0], f.geom[1], h.geom[0], h.geom[1], u.geom[0], u.geom[1]));
    return x > 0 ? o++ : x < 0 && i++, {
      ids: [String(f.index), String(h.index), String(u.index)],
      paper: [p, b, v],
      geo: [f.geom, h.geom, u.geom],
      sign: x
    };
  }), c = e.filter(([l, f]) => !s.has($t(n[l].id, n[f].id)));
  return { points: n, triangles: a, majority: o >= i ? 1 : -1, hullEdges: e, dropped: c };
}
function vs(r) {
  return [r.foot[0] + r.height * r.normal[0], r.foot[1] + r.height * r.normal[1]];
}
function Tr(r, [t, e], { lambda: n = ws, epsilon: s = Nr } = {}) {
  const { points: o, majority: i } = r, a = o[t], c = o[e], l = o.reduce((I, B) => I + B.paper[0], 0) / o.length, f = o.reduce((I, B) => I + B.paper[1], 0) / o.length, h = Math.sign(it(a.paper[0], a.paper[1], c.paper[0], c.paper[1], l, f));
  if (h === 0) return;
  const u = h * i, p = [c.paper[0] - a.paper[0], c.paper[1] - a.paper[1]], b = [c.geo[0] - a.geo[0], c.geo[1] - a.geo[1]], v = Math.hypot(p[0], p[1]), x = Math.hypot(b[0], b[1]);
  if (!(v > 0 && x > 0)) return;
  const A = [];
  for (const I of o) {
    if (I === a || I === c) continue;
    const B = it(a.geo[0], a.geo[1], c.geo[0], c.geo[1], I.geo[0], I.geo[1]);
    if (B * u >= 0) continue;
    const D = ((I.geo[0] - a.geo[0]) * b[0] + (I.geo[1] - a.geo[1]) * b[1]) / (x * x), $ = ((I.paper[0] - a.paper[0]) * p[0] + (I.paper[1] - a.paper[1]) * p[1]) / (v * v);
    D > 0 && D < 1 && $ > 0 && $ < 1 && A.push({ id: I.id, u: D, t: $, d: Math.abs(B) / x });
  }
  const y = A.length > 0;
  y || A.push({ u: 0.5, t: 0.5, d: 0 });
  const m = A.reduce((I, B) => B.d > I.d ? B : I);
  let d = 0;
  for (const I of A)
    d = Math.max(d, I.u <= m.u ? I.d * m.u / I.u : I.d * (1 - m.u) / (1 - I.u));
  d *= 1 + n;
  const g = [-p[1] / v * h, p[0] / v * h], w = [-b[1] / x * u, b[0] / x * u], k = (I) => [
    a.paper[0] + I * p[0] + s * v * g[0],
    a.paper[1] + I * p[1] + s * v * g[1]
  ], S = (I, B, D, $) => ({
    paper: k(I),
    foot: [a.geo[0] + B * b[0], a.geo[1] + B * b[1]],
    normal: w,
    height: D,
    chord: x,
    protrusion: m.d,
    ...$ === void 0 ? {} : { anchor: $ }
  }), M = [S(m.t, m.u, d, y ? m.id : void 0)], T = [...A].sort((I, B) => I.u - B.u), N = [{ u: 0, d: 0 }], P = (I, B, D) => (B.u - I.u) * (D.d - I.d) - (B.d - I.d) * (D.u - I.u);
  for (const I of [...T, { u: 1, d: 0 }]) {
    for (; N.length >= 2 && P(N[N.length - 2], N[N.length - 1], I) >= 0; ) N.pop();
    N.push(I);
  }
  const C = n * m.d, _ = [];
  let O = 0;
  for (const I of N.slice(1, -1))
    I.t === void 0 || !(I.t > O) || (O = I.t, _.push(S(I.t, I.u, I.d + C, y ? I.id : void 0)));
  return {
    edge: [a.id, c.id],
    variants: y && _.length > 1 ? [M, _] : [M]
  };
}
function Fr(r, t, e, { lambda: n = ws, mu: s = Or, maxIterations: o = ms } = {}) {
  let i = r.map((a, c) => ({ ray: { ...a }, index: c }));
  for (let a = 0; a < o && i.length > 0; a++) {
    const c = e(i.map(({ ray: h }) => [h.paper, vs(h)]));
    if (!c) return;
    let l = !1;
    const f = /* @__PURE__ */ new Set();
    for (const [h, { ray: u }] of i.entries()) {
      const p = `e${t + h}`;
      let b = -1 / 0, v = 1 / 0, x = 0;
      for (const d of c.triangles) {
        const g = d.ids.indexOf(p);
        if (g < 0) continue;
        d.sign !== c.majority && x++;
        const w = d.geo[(g + 1) % 3], k = d.geo[(g + 2) % 3], S = Math.sign(
          it(
            d.paper[g][0],
            d.paper[g][1],
            d.paper[(g + 1) % 3][0],
            d.paper[(g + 1) % 3][1],
            d.paper[(g + 2) % 3][0],
            d.paper[(g + 2) % 3][1]
          )
        ), M = it(u.foot[0], u.foot[1], w[0], w[1], k[0], k[1]), T = it(u.foot[0] + u.normal[0], u.foot[1] + u.normal[1], w[0], w[1], k[0], k[1]) - M, N = S * c.majority;
        if (T === 0) {
          M * N <= 0 && (b = 1 / 0);
          continue;
        }
        const P = -M / T;
        T * N > 0 ? b = Math.max(b, P) : v = Math.min(v, P);
      }
      if (!(b < v)) {
        f.add(h);
        continue;
      }
      const A = Math.min(Math.max(n * Math.max(b, u.protrusion), s * u.chord), (v - b) / 2), y = Math.max(b, 0) + A, m = Math.abs(y - u.height) > 1e-9 * u.chord;
      (x > 0 || m) && (m && (l = !0), u.height = y);
    }
    if (f.size > 0 && (i = i.filter((h, u) => !f.has(u)), l = !0), !l) break;
  }
  if (i.length !== 0)
    return { rays: i.map(({ ray: a }) => a), kept: i.map(({ index: a }) => a) };
}
function Br(r, t) {
  const e = (i) => typeof i == "string" && i.startsWith("e") && Number(i.slice(1)) >= t ? Number(i.slice(1)) : void 0, n = /* @__PURE__ */ new Set();
  for (const { ids: i } of r.triangles)
    n.add($t(i[0], i[1])), n.add($t(i[0], i[2])), n.add($t(i[1], i[2]));
  const s = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set();
  for (const [i, a] of r.hullEdges) {
    const c = n.has($t(r.points[i].id, r.points[a].id));
    for (const l of [i, a]) {
      const f = e(r.points[l].id);
      f !== void 0 && (o.add(f), c || s.add(f));
    }
  }
  for (const i of r.points) {
    const a = e(i.id);
    a !== void 0 && !o.has(a) && s.add(a);
  }
  return s;
}
function Rr(r, t) {
  const e = { rounds: 0, builds: 0, cost: 0, budget: 0, batches: 0, perEdge: 0, multiPoint: 0 };
  let n = [], s = [], o = t, i = r.snapshot();
  const a = /* @__PURE__ */ new Set(), c = Ir * r.baseCost;
  e.budget = c;
  const l = r.buildCost();
  let f = 0;
  const h = () => f * Ar + r.buildCost() - l, u = () => h() >= c, p = (y) => {
    if (!u())
      return e.builds++, f++, r.measure(y);
  }, b = (y) => [y.paper, vs(y)], v = (y, m, d) => {
    const g = Fr(
      y.map(({ ray: w }) => w),
      m,
      (w) => p([...n, ...w]),
      { maxIterations: d }
    );
    return g?.rays.map((w, k) => ({ ray: w, edge: y[g.kept[k]].edge }));
  }, x = (y, m) => y.length === m.length && y.every(({ ray: d }, g) => Math.abs(d.height - m[g].ray.height) <= 1e-9 * d.chord), A = (y) => {
    if (y.length === 0 || n.length + y.length > Gn) return !1;
    const m = r.edgeBase + n.length;
    let d = v(y, m, 1), g = !1;
    for (; d && d.length > 0 && !u(); ) {
      const w = [...n, ...d.map(({ ray: T }) => b(T))];
      e.builds++;
      const k = r.build(w, Math.max(1, Math.ceil(c - h()))), S = k ? Br(k.analysis, m) : void 0;
      if (k && S.size === 0)
        return s = s.concat(
          d.map(({ ray: T, edge: N }, P) => ({
            node: m + P,
            kind: "hullEdge",
            edge: N,
            ...T.anchor === void 0 ? {} : { anchor: T.anchor }
          }))
        ), n = w, o = k, i = r.snapshot(), !0;
      if (r.restore(i), k && S.size < d.length) {
        d = d.filter((T, N) => !S.has(m + N));
        continue;
      }
      if (g) return !1;
      g = !0;
      const M = v(d, m, ms);
      if (!M || x(M, d)) return !1;
      d = M;
    }
    return !1;
  };
  for (let y = 1; y <= Er && !u(); y++) {
    const { analysis: m } = o, d = [];
    for (const w of m.dropped) {
      const k = w.map((M) => m.points[M].paper.join(",")).join("|");
      if (a.has(k) || (a.add(k), n.length + d.length + 1 > Gn)) continue;
      const S = Tr(m, w);
      S && d.push(S);
    }
    if (d.length === 0) break;
    e.rounds = y;
    const g = (w, k) => k.map((S) => ({ ray: S, edge: w.edge }));
    if (A(d.flatMap((w) => g(w, w.variants[0])))) {
      e.batches++;
      continue;
    }
    for (const w of d)
      for (const [k, S] of w.variants.entries()) {
        if (u()) break;
        if (A(g(w, S))) {
          e.perEdge++, k > 0 && e.multiPoint++;
          break;
        }
      }
  }
  return r.restore(i), e.cost = h(), { pairs: n, records: s, result: o.result, diagnostics: e };
}
function ys(r, t) {
  const e = [r, t].map((n) => {
    const s = n.map((i, a, c) => {
      if (a === 0) return 0;
      const l = c[a - 1];
      return Math.sqrt(
        Math.pow(i[0] - l[0], 2) + Math.pow(i[1] - l[1], 2)
      );
    }), o = s.reduce((i, a, c) => c === 0 ? [0] : (i.push(i[c - 1] + a), i), []);
    return o.map((i, a, c) => {
      const l = i / c[c.length - 1];
      return [n[a], s[a], o[a], l];
    });
  });
  return e.map((n, s) => {
    const o = e[s ? 0 : 1];
    return n.filter((i, a) => !(a === 0 || a === n.length - 1 || i[4] === "handled")).flatMap((i) => {
      const a = i[0], c = i[3], l = o.reduce(
        (f, h, u, p) => {
          if (f) return f;
          const b = p[u + 1];
          if (h[3] === c)
            return h[4] = "handled", [h];
          if (h[3] < c && b && b[3] > c)
            return [h, b];
        },
        void 0
      );
      if (l && l.length === 1)
        return s === 0 ? [[a, l[0][0], c]] : [[l[0][0], a, c]];
      if (l && l.length === 2) {
        const f = l[0], h = l[1], u = (c - f[3]) / (h[3] - f[3]), p = [
          (h[0][0] - f[0][0]) * u + f[0][0],
          (h[0][1] - f[0][1]) * u + f[0][1]
        ];
        return s === 0 ? [[a, p, c]] : [[p, a, c]];
      }
      return [];
    });
  }).reduce((n, s) => n.concat(s), []).sort((n, s) => n[2] < s[2] ? -1 : 1);
}
const Pr = 5e-3, Dr = 0.999, Kn = 1e-9, Cr = (r, t) => {
  const e = Math.atan2(r[0] - t[0], r[1] - t[1]) * (180 / Math.PI);
  return e < 0 ? e + 360 : e;
};
function Wn(r, t) {
  const e = Je(r, t), n = Cr(r, t) - e * 10;
  return n < Kn ? [e, (e + 35) % 36] : n > 10 - Kn ? [e, (e + 1) % 36] : [e];
}
function Hn(r, t) {
  let e = 0;
  for (let n = 0; n < r.length; n++) {
    const s = r[n], o = r[(n + 1) % r.length], i = Math.sign(it(s[0], s[1], o[0], o[1], t[0], t[1]));
    if (i === 0) return !1;
    if (e === 0) e = i;
    else if (i !== e) return !1;
  }
  return e !== 0;
}
class sn {
  /** 両面の凸包（内側の点の全部で取る）と、凸包の辺の上にある頂点 */
  hull;
  hullVertices = /* @__PURE__ */ new Set();
  /** 対応点の外接矩形（紙の面）と、その端を与える頂点 */
  box;
  /** 区分ごとの、最も外側の点までの距離（点が無い区分は −1）と、その頂点 */
  binMax = new Array(36).fill(-1);
  binHolders = /* @__PURE__ */ new Set();
  /** 補助頂点の輪（地理面）と、扇形の中心 */
  ring;
  centroid;
  /** 内側の点（対応点と中継点）の紙の面の座標の和と数。帯を作ったときの平均 */
  sum = [0, 0];
  count = 0;
  mean0;
  diagonal;
  constructor(t) {
    const { mesh: e } = t, n = (f) => e.vertices.get(f);
    this.centroid = t.centroid, this.ring = t.ring.map((f) => n(f).bakw);
    const s = [...t.gcps, ...t.nodeOrder()], o = (f) => {
      const h = Ie(s.map((u) => n(u)[f]));
      for (const [u, p] of h)
        this.hullVertices.add(s[u]), this.hullVertices.add(s[p]);
      return h.map(([u]) => n(s[u])[f]);
    };
    this.hull = { forw: o("forw"), bakw: o("bakw") };
    const i = t.gcps.map((f) => n(f).forw[0]), a = t.gcps.map((f) => n(f).forw[1]);
    this.box = {
      minx: Math.min(...i),
      maxx: Math.max(...i),
      miny: Math.min(...a),
      maxy: Math.max(...a)
    }, this.diagonal = Math.hypot(
      this.box.maxx - this.box.minx,
      this.box.maxy - this.box.miny
    );
    const c = new Array(36).fill(void 0);
    for (const f of s) {
      const { forw: h } = n(f), u = this.forwDistance(h);
      if (u !== 0)
        for (const p of Wn(h, this.centroid.forw))
          u > this.binMax[p] && (this.binMax[p] = u, c[p] = f);
    }
    for (const f of c)
      f !== void 0 && this.binHolders.add(f);
    const l = new Set(t.supplements.map(({ vertex: f }) => f));
    for (const f of s)
      l.has(f) || (this.sum[0] += n(f).forw[0], this.sum[1] += n(f).forw[1], this.count++);
    this.mean0 = [this.sum[0] / this.count, this.sum[1] / this.count];
  }
  /** 判定できない網（world file 外周・補助頂点の輪が網の外周でない網）では null。 */
  static of(t) {
    if (!t.centroid || t.ring.length < 3) return null;
    const e = t.mesh.boundaryRing();
    if (!e || e.length !== t.ring.length) return null;
    const n = new Set(t.ring);
    return e.every((s) => n.has(s)) ? new sn(t) : null;
  }
  forwDistance(t) {
    return Math.hypot(
      t[0] - this.centroid.forw[0],
      t[1] - this.centroid.forw[1]
    );
  }
  /**
   * 地理面で、重心から輪までの距離に対する、重心から点までの距離の比（輪の内側なら 1 未満）。
   * 輪と交わらない方向なら Infinity。
   */
  ringRatio(t) {
    const e = this.centroid.bakw, n = t[0] - e[0], s = t[1] - e[1];
    let o = 1 / 0;
    for (let i = 0; i < this.ring.length; i++) {
      const a = this.ring[i], c = this.ring[(i + 1) % this.ring.length], l = c[0] - a[0], f = c[1] - a[1], h = l * s - f * n;
      if (h === 0) continue;
      const u = (l * (a[1] - e[1]) - f * (a[0] - e[0])) / h, p = (n * (a[1] - e[1]) - s * (a[0] - e[0])) / h;
      u > 0 && p >= 0 && p <= 1 && (o = Math.min(o, 1 / u));
    }
    return o;
  }
  /**
   * 編集が、帯を更新しなくてよい条件（C1〜C7）を全部満たすか。満たすなら、編集の後の座標の和と数を返す
   * （編集を当てた後に {@link commit} へ渡す）。満たさなければ undefined。網を動かす前に呼ぶ。
   */
  keeps(t, e) {
    const { box: n } = this;
    let s = this.sum[0], o = this.sum[1], i = this.count;
    for (const c of e) {
      if (c.vertex !== void 0) {
        const l = c.vertex, { forw: f, bakw: h } = t.mesh.vertices.get(l);
        if (this.hullVertices.has(l) || this.binHolders.has(l) || !(this.ringRatio(h) < Dr) || c.gcp && (f[0] === n.minx || f[0] === n.maxx || f[1] === n.miny || f[1] === n.maxy))
          return;
        c.counted && (s -= f[0], o -= f[1], i--);
      }
      if (c.to) {
        const { forw: l, bakw: f } = c.to;
        if (!Hn(this.hull.forw, l) || !Hn(this.hull.bakw, f) || c.gcp && !(l[0] > n.minx && l[0] < n.maxx && l[1] > n.miny && l[1] < n.maxy))
          return;
        const h = this.forwDistance(l);
        if (h > 0) {
          for (const u of Wn(l, this.centroid.forw))
            if (!(h < this.binMax[u])) return;
        }
        if (!(this.ringRatio(f) < 1)) return;
        c.counted && (s += l[0], o += l[1], i++);
      }
    }
    if (!(i === 0 || !(Math.hypot(
      s / i - this.mean0[0],
      o / i - this.mean0[1]
    ) <= Pr * this.diagonal)))
      return { sum: [s, o], count: i };
  }
  /** 当てた編集を、算術平均に反映する（{@link keeps} が返した値を渡す）。 */
  commit(t) {
    this.sum = t.sum, this.count = t.count;
  }
}
const _e = 0, Oe = (r) => r + 1, Ut = 1, rn = 2, Jn = 4, Qn = 1e-6, $r = 0.2, Vr = 4, bs = Math.sign(
  Fe(0, 0, 1, 0, 0, 1, 0.25, 0.25) * it(0, 0, 1, 0, 0, 1)
), Zn = 2 ** 26;
function ft(r, t) {
  return r < t ? r * Zn + t : t * Zn + r;
}
const zt = (r, t, e) => Math.sign(it(r[0], r[1], t[0], t[1], e[0], e[1])), ke = (r, t, e) => Math.abs((t[0] - r[0]) * (e[1] - r[1]) - (e[0] - r[0]) * (t[1] - r[1]));
class Xr {
  triangles;
  constructor(t) {
    this.triangles = t.map((e) => [...e]);
  }
  /**
   * `wrong` な三角形の辺のうち、固定されていない辺を反転して直す。
   *
   * @param accept 反転の前の 2 つの三角形・後の 2 つの三角形・後の対角線の鍵を受け取り、採るなら、
   *   新しく固定する辺の鍵の配列を返す（採らなければ undefined）
   * @param done 途中で止めてよいか
   * @returns 反転した数
   */
  repair(t, e, n, s = () => !1) {
    let o = 0;
    const i = this.triangles.length * 4 + 8;
    for (let a = 0; a < i && !s() && this.repairOne(t, e, n); a++)
      o++;
    return o;
  }
  repairOne(t, e, n) {
    const s = /* @__PURE__ */ new Map();
    this.triangles.forEach((o, i) => {
      for (let a = 0; a < 3; a++) {
        const c = ft(o[a], o[(a + 1) % 3]), l = s.get(c);
        l ? l.push(i) : s.set(c, [i]);
      }
    });
    for (let o = 0; o < this.triangles.length; o++) {
      const i = this.triangles[o];
      if (t(i))
        for (let a = 0; a < 3; a++) {
          const c = i[a], l = i[(a + 1) % 3], f = i[(a + 2) % 3], h = ft(c, l);
          if (n.has(h)) continue;
          const u = s.get(h);
          if (u.length !== 2) continue;
          const p = u[0] === o ? u[1] : u[0], b = this.triangles[p].find((A) => A !== c && A !== l), v = [
            [c, b, f],
            [b, l, f]
          ], x = e([i, this.triangles[p]], v, ft(f, b));
          if (x) {
            for (const A of x) n.add(A);
            return this.triangles[o] = v[0], this.triangles[p] = v[1], !0;
          }
        }
    }
    return !1;
  }
}
class Lr {
  vertices = /* @__PURE__ */ new Map();
  triangles = /* @__PURE__ */ new Map();
  /** 頂点 → その頂点を持つ三角形 */
  byVertex = /* @__PURE__ */ new Map();
  /** 辺 → その辺を持つ三角形（1 つなら網の外周の辺） */
  byEdge = /* @__PURE__ */ new Map();
  /** 辺の属性（{@link EDGE_REQUIRED}・{@link EDGE_HULL}・{@link EDGE_PROTECT} の和） */
  edgeFlags = /* @__PURE__ */ new Map();
  /** ok でない三角形 */
  bad = /* @__PURE__ */ new Set();
  /** 外周 ∂M が 1 本の輪で、両面とも単純か */
  boundarySimple = !0;
  /** 禁止制約の三角形の数（補助頂点だけの三角形・同じ必須エッジの点だけの三角形） */
  forbiddenBoundary = 0;
  forbiddenEdge = 0;
  /** 差し替えを当てた回数 */
  revision = 0;
  nextVertex = 0;
  nextTriangle = 0;
  /** 網の向き（紙の面の向きの符号 × 地理面の向きの符号） */
  sigma;
  /** 新しく作る三角形の、紙の面での頂点の並びの向き（取り込んだ網の多数決） */
  forwSign;
  constructor(t, e) {
    this.sigma = t, this.forwSign = e;
  }
  // ── 頂点・三角形・辺の表 ──
  addVertex(t, e, n, s = []) {
    const o = this.nextVertex++;
    return this.vertices.set(o, { ref: t, forw: e, bakw: n, groups: s }), this.byVertex.set(o, /* @__PURE__ */ new Set()), o;
  }
  /** 三角形を 1 つも持たない頂点を消す。 */
  dropVertex(t) {
    if (this.byVertex.get(t)?.size)
      throw new Error(`頂点 ${t} は三角形の頂点です`);
    this.vertices.delete(t), this.byVertex.delete(t);
  }
  addTriangle(t, e, n) {
    const s = this.nextTriangle++, o = [t, e, n];
    this.triangles.set(s, o);
    for (let a = 0; a < 3; a++) {
      this.byVertex.get(o[a]).add(s);
      const c = ft(o[a], o[(a + 1) % 3]), l = this.byEdge.get(c);
      l ? l.push(s) : this.byEdge.set(c, [s]);
    }
    this.ok(t, e, n) || this.bad.add(s);
    const i = this.forbiddenGroup(t, e, n);
    return i === _e ? this.forbiddenBoundary++ : i !== void 0 && this.forbiddenEdge++, s;
  }
  removeTriangle(t) {
    const e = this.triangles.get(t);
    this.triangles.delete(t);
    for (let s = 0; s < 3; s++) {
      this.byVertex.get(e[s])?.delete(t);
      const o = ft(e[s], e[(s + 1) % 3]), i = this.byEdge.get(o);
      i.length === 1 ? this.byEdge.delete(o) : i.splice(i.indexOf(t), 1);
    }
    this.bad.delete(t);
    const n = this.forbiddenGroup(e[0], e[1], e[2]);
    n === _e ? this.forbiddenBoundary-- : n !== void 0 && this.forbiddenEdge--;
  }
  hasEdge(t, e) {
    return this.byEdge.has(ft(t, e));
  }
  flagsOf(t, e) {
    return this.edgeFlags.get(ft(t, e)) ?? 0;
  }
  setFlag(t, e, n) {
    const s = ft(t, e);
    this.edgeFlags.set(s, (this.edgeFlags.get(s) ?? 0) | n);
  }
  clearFlag(t, e, n) {
    const s = ft(t, e), o = (this.edgeFlags.get(s) ?? 0) & ~n;
    o ? this.edgeFlags.set(s, o) : this.edgeFlags.delete(s);
  }
  // ── 判定 ──
  /** 三角形の合格（S1）: 両面の向きの積が σ に等しい。面積 0 は不合格。向きは厳密な述語で取る。 */
  ok(t, e, n, s = this.vertexAt) {
    const o = s(t), i = s(e), a = s(n);
    return zt(o.forw, i.forw, a.forw) * zt(o.bakw, i.bakw, a.bakw) === this.sigma;
  }
  /** 新しく作る三角形の合格: ok に加えて、両面とも 2×面積が閾値以上。 */
  okNew(t, e, n, s = this.vertexAt) {
    if (!this.ok(t, e, n, s)) return !1;
    const o = s(t), i = s(e), a = s(n);
    return ke(o.forw, i.forw, a.forw) >= Qn && ke(o.bakw, i.bakw, a.bakw) >= Qn;
  }
  /** 3 頂点が同じ群に属するなら、その群の番号（禁止制約の違反）。属さなければ undefined。 */
  forbiddenGroup(t, e, n) {
    const s = this.vertices.get(e).groups, o = this.vertices.get(n).groups;
    return this.vertices.get(t).groups.find((i) => s.includes(i) && o.includes(i));
  }
  /** strict か（S1 と S2）。`bad` が空なだけでは足りない。 */
  isStrict() {
    return this.bad.size === 0 && this.boundarySimple;
  }
  vertexAt = (t) => this.vertices.get(t);
  // ── 範囲と輪 ──
  /** 頂点の星（その頂点を持つ三角形の全部）。 */
  star(t) {
    return new Set(this.byVertex.get(t));
  }
  /** 範囲に、頂点で接する三角形を 1 周足す。 */
  grow(t) {
    const e = new Set(t);
    for (const n of t)
      for (const s of this.triangles.get(n))
        for (const o of this.byVertex.get(s)) e.add(o);
    return e;
  }
  /** 三角形の頂点を、紙の面で正の向き（orient2d > 0）に並べ直す。面積 0 なら undefined。 */
  positive(t) {
    const [e, n, s] = this.triangles.get(t), o = zt(
      this.vertices.get(e).forw,
      this.vertices.get(n).forw,
      this.vertices.get(s).forw
    );
    if (o !== 0)
      return o > 0 ? [e, n, s] : [e, s, n];
  }
  /**
   * 範囲の外周の輪を、有向の辺の列（範囲の内側が、紙の面で正の向きの側）で取る。
   * 範囲が円板でなければ（同じ頂点を 2 回通る・穴がある・離れている）undefined。
   */
  ringOf(t) {
    const e = /* @__PURE__ */ new Map();
    for (const o of t) {
      const i = this.positive(o);
      if (!i) return;
      for (let a = 0; a < 3; a++) {
        const c = i[a], l = i[(a + 1) % 3], f = this.byEdge.get(ft(c, l));
        if (f.length > 2) return;
        if (!(f.length === 2 && t.has(f[0]) && t.has(f[1]))) {
          if (e.has(c)) return;
          e.set(c, l);
        }
      }
    }
    if (e.size < 3) return;
    const n = e.keys().next().value, s = [n];
    for (let o = e.get(n); o !== n; o = e.get(o)) {
      if (o === void 0 || s.length > e.size) return;
      s.push(o);
    }
    return s.length === e.size ? s : void 0;
  }
  // ── 差し替え ──
  /**
   * 範囲 R の外周の輪を固定して、内側だけを三角形分割し直す（設計書 §5.1）。
   * 失敗したときは、網を変えない。
   *
   * 新しい三角形に okNew でないものがあれば、R' の中の辺の反転で直す（重なりの解消。§5.2）。禁止制約の
   * 三角形が増えたら、違反の三角形の所だけ反転で直し、反転した辺に protect を付ける。それでも残れば
   * "notStrict"・"forbidden" で失敗する。差し替えの後に、輪の辺を上限つきで磨く（§5.3）。
   */
  replace(t, e = {}) {
    const n = (F) => ({
      ok: !1,
      reason: F
    });
    if (t.size > this.triangles.size * $r)
      return n("tooLarge");
    const s = this.ringOf(t);
    if (!s) return n("notDisk");
    const o = s.length, i = new Set(s), a = new Set(e.remove ?? []), c = new Set(e.add ?? []);
    for (const F of t)
      for (const V of this.triangles.get(F))
        !i.has(V) && !a.has(V) && c.add(V);
    for (const F of a) {
      if (i.has(F)) return n("notDisk");
      for (const V of this.byVertex.get(F))
        if (!t.has(V)) return n("notDisk");
    }
    for (const F of e.move?.keys() ?? [])
      if (!c.has(F)) return n("notDisk");
    const l = (F) => {
      const V = e.move?.get(F), G = this.vertices.get(F);
      return V ? { ...G, ...V } : G;
    }, f = [...s, ...c], h = new Map(f.map((F, V) => [F, V])), u = /* @__PURE__ */ new Set();
    for (let F = 0; F < o; F++)
      u.add(ft(s[F], s[(F + 1) % o]));
    const p = s.map((F, V) => [
      V,
      (V + 1) % o
    ]), b = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Set(), x = new Set(
      (e.release ?? []).map(([F, V]) => ft(F, V))
    );
    for (const F of t) {
      const V = this.triangles.get(F);
      for (let G = 0; G < 3; G++) {
        const K = V[G], Q = V[(G + 1) % 3], tt = ft(K, Q);
        u.has(tt) || (v.add(tt), (this.edgeFlags.get(tt) ?? 0) & (Ut | rn) && (a.has(K) || a.has(Q) || x.has(tt) || b.set(tt, [K, Q])));
      }
    }
    for (const [F, V] of e.constrain ?? []) {
      if (!h.has(F) || !h.has(V)) return n("constraint");
      u.has(ft(F, V)) || b.set(ft(F, V), [F, V]);
    }
    for (const [F, V] of b.values())
      p.push([h.get(F), h.get(V)]);
    let A;
    try {
      const F = Be.from(f.map((V) => l(V).forw));
      if (F.triangles.length === 0) return n("constraint");
      A = new Qt(F, p).del;
    } catch {
      return n("constraint");
    }
    const { triangles: y, halfedges: m } = A, d = y.length / 3, g = (F) => l(f[F]).forw;
    let w = 0, k = 0;
    for (let F = 0; F < d; F++) {
      const V = g(y[F * 3]), G = g(y[F * 3 + 1]), K = g(y[F * 3 + 2]), Q = ke(V, G, K);
      if (Q > k) {
        const tt = zt(V, G, K);
        tt !== 0 && (k = Q, w = tt);
      }
    }
    if (w === 0) return n("count");
    const S = /* @__PURE__ */ new Map();
    for (let F = 0; F < y.length; F++)
      S.set(y[F] * f.length + y[Et(F)], F);
    const M = /* @__PURE__ */ new Set();
    for (let F = 0; F < o; F++) {
      const V = F, G = (F + 1) % o, K = S.get(
        w > 0 ? V * f.length + G : G * f.length + V
      );
      if (K === void 0) return n("pointOutside");
      M.add(K);
    }
    const T = /* @__PURE__ */ new Set(), N = [];
    for (const F of M) {
      const V = Math.floor(F / 3);
      T.has(V) || (T.add(V), N.push(V));
    }
    for (let F = 0; F < N.length; F++)
      for (let V = N[F] * 3; V < N[F] * 3 + 3; V++) {
        if (M.has(V)) continue;
        const G = m[V];
        if (G === -1 || M.has(G)) return n("pointOutside");
        const K = Math.floor(G / 3);
        T.has(K) || (T.add(K), N.push(K));
      }
    for (const F of M) {
      const V = m[F];
      if (V !== -1 && T.has(Math.floor(V / 3)))
        return n("pointOutside");
    }
    const P = [], C = /* @__PURE__ */ new Set();
    for (const F of T) {
      const V = f[y[F * 3]], G = f[y[F * 3 + 1]], K = f[y[F * 3 + 2]];
      C.add(V).add(G).add(K), P.push(w === this.forwSign ? [V, G, K] : [V, K, G]);
    }
    for (const F of c) if (!C.has(F)) return n("pointOutside");
    if (P.length !== o - 2 + 2 * c.size) return n("count");
    const _ = /* @__PURE__ */ new Set();
    for (const [F, V, G] of P)
      _.add(ft(F, V)).add(ft(V, G)).add(ft(G, F));
    for (const F of b.keys())
      if (!_.has(F)) return n("constraint");
    const O = /* @__PURE__ */ new Set([...u, ...b.keys()]), I = new Xr(P), B = (F) => zt(l(F[0]).forw, l(F[1]).forw, l(F[2]).forw) === this.forwSign && this.okNew(F[0], F[1], F[2], l), D = (F) => this.forbiddenGroup(F[0], F[1], F[2]) !== void 0, $ = I.repair(
      (F) => !this.okNew(F[0], F[1], F[2], l),
      (F, V) => V.every(B) ? [] : void 0,
      O
    );
    for (const F of I.triangles)
      if (!this.okNew(F[0], F[1], F[2], l)) return n("notStrict");
    let E = 0;
    for (const F of t) {
      const [V, G, K] = this.triangles.get(F);
      this.forbiddenGroup(V, G, K) !== void 0 && E++;
    }
    const R = () => I.triangles.filter(D).length, X = [];
    let z = 0;
    if (R() > E && (z = I.repair(
      D,
      (F, V, G) => {
        if (V.every(B) && !(V.filter(D).length >= F.filter(D).length))
          return X.push(G), [G];
      },
      O,
      () => R() <= E
    ), R() > E))
      return n("forbidden");
    P.splice(0, P.length, ...I.triangles);
    for (const [F, V] of e.move ?? []) {
      const G = this.vertices.get(F);
      G.forw = V.forw, G.bakw = V.bakw;
    }
    const q = [...t];
    for (const F of q) this.removeTriangle(F);
    const Y = P.map(([F, V, G]) => this.addTriangle(F, V, G));
    for (const F of v) {
      const V = (this.edgeFlags.get(F) ?? 0) & ~Jn;
      V && this.byEdge.has(F) ? this.edgeFlags.set(F, V) : this.edgeFlags.delete(F);
    }
    for (const [F, V] of e.release ?? [])
      !a.has(F) && !a.has(V) && this.clearFlag(F, V, Ut);
    for (const [F, V, G] of e.constrain ?? []) this.setFlag(F, V, G);
    for (const F of X)
      this.byEdge.has(F) && this.edgeFlags.set(F, (this.edgeFlags.get(F) ?? 0) | Jn);
    for (const F of a) this.dropVertex(F);
    this.revision++;
    const L = new Set(q), U = new Set(Y);
    let H = 0;
    if (!e.noPolish) {
      const F = s.map((V, G) => [
        V,
        s[(G + 1) % o]
      ]);
      H = this.polish(F, Vr * o, L, U);
    }
    return {
      ok: !0,
      removed: [...L],
      added: [...U],
      flips: {
        overlap: $,
        forbidden: z,
        polish: H
      }
    };
  }
  /**
   * 辺を共有する 2 つの三角形の対角線を入れ替える。新しい 2 つの三角形が、紙の面で正しい向き（凸な四辺形）で、
   * 両方 okNew で、禁止制約の違反を増やさないときだけ行う。行ったら、四辺形の外周の 4 辺を返す。
   */
  flipEdge(t, e, n, s) {
    const o = this.byEdge.get(ft(t, e));
    if (!o || o.length !== 2) return;
    const i = this.positive(o[0]);
    if (!i) return;
    const a = i.findIndex(
      (x, A) => (x === t || x === e) && (i[(A + 1) % 3] === t || i[(A + 1) % 3] === e)
    ), c = i[a], l = i[(a + 1) % 3], f = i[(a + 2) % 3], h = this.triangles.get(o[1]).find((x) => x !== t && x !== e), u = [
      [c, h, f],
      [h, l, f]
    ], p = this.vertexAt;
    for (const [x, A, y] of u)
      if (zt(p(x).forw, p(A).forw, p(y).forw) <= 0 || !this.okNew(x, A, y)) return;
    const b = (x) => x.filter(([A, y, m]) => this.forbiddenGroup(A, y, m) !== void 0).length, v = o.map((x) => this.triangles.get(x));
    if (!(b(u) > b(v))) {
      for (const x of [...o])
        this.removeTriangle(x), s?.has(x) ? s.delete(x) : n?.add(x);
      for (const [x, A, y] of u) {
        const m = this.forwSign > 0 ? this.addTriangle(x, A, y) : this.addTriangle(x, y, A);
        s?.add(m);
      }
      return [
        [c, h],
        [h, l],
        [l, f],
        [f, c]
      ];
    }
  }
  /**
   * 磨き（§5.3）: 与えた辺から始めて、制約（required・hull・protect）でなく、外接円の条件を満たさない辺を
   * 反転する。反転したら、四辺形の外周の 4 辺を調べ直す。調べる辺の数の上限で止める（全体を回らない）。
   * 外接円の判定は厳密な不等号（同じ円の上の 4 点では反転しない。往復して止まらなくなるのを防ぐ）。
   *
   * @returns 反転した辺の数
   */
  polish(t, e, n, s) {
    const o = [...t];
    let i = 0;
    for (let a = 0; a < o.length && a < e; a++) {
      const [c, l] = o[a], f = ft(c, l);
      if ((this.edgeFlags.get(f) ?? 0) !== 0) continue;
      const h = this.byEdge.get(f);
      if (!h || h.length !== 2) continue;
      const u = this.positive(h[0]);
      if (!u) continue;
      const p = this.triangles.get(h[1]).find((m) => m !== c && m !== l), [b, v, x, A] = [...u, p].map((m) => this.vertices.get(m).forw);
      if (Fe(b[0], b[1], v[0], v[1], x[0], x[1], A[0], A[1]) * bs <= 0)
        continue;
      const y = this.flipEdge(c, l, n, s);
      y && (i++, o.push(...y));
    }
    return i > 0 && this.revision++, i;
  }
  /**
   * 接続を変えずに、頂点の座標だけを変える（地理面だけの移動。設計書 §4.3）。星の三角形の `bad` を
   * 判定し直す。採ってよいかどうか（星の三角形が全部 okNew か）は、呼び出し側が先に確かめる。
   */
  relocate(t, e, n) {
    const s = this.vertices.get(t);
    s.forw = e, s.bakw = n;
    for (const o of this.byVertex.get(t)) {
      const [i, a, c] = this.triangles.get(o);
      this.ok(i, a, c) ? this.bad.delete(o) : this.bad.add(o);
    }
    this.revision++;
  }
  // ── 外周 ──
  /** 網の外周 ∂M（対の無い辺）を、輪の頂点の列で取る。1 本の輪でなければ undefined。 */
  boundaryRing() {
    const t = /* @__PURE__ */ new Map();
    for (const [s, o] of this.byEdge) {
      if (o.length !== 1) continue;
      const i = this.positive(o[0]) ?? this.triangles.get(o[0]);
      for (let a = 0; a < 3; a++) {
        const c = i[a], l = i[(a + 1) % 3];
        if (ft(c, l) === s) {
          if (t.has(c)) return;
          t.set(c, l);
        }
      }
    }
    if (t.size < 3) return;
    const e = t.keys().next().value, n = [e];
    for (let s = t.get(e); s !== e; s = t.get(s)) {
      if (s === void 0 || n.length > t.size) return;
      n.push(s);
    }
    return n.length === t.size ? n : void 0;
  }
  /** 外周 ∂M が 1 本の輪で、両面とも単純な多角形か（S2）を計算し直す。 */
  computeBoundarySimple() {
    const t = this.boundaryRing();
    if (!t) return !1;
    const e = t.length;
    for (const n of ["forw", "bakw"]) {
      const s = t.map((o) => this.vertices.get(o)[n]);
      for (let o = 0; o < e; o++) {
        const i = s[o], a = s[(o + 1) % e], c = s[(o + 2) % e];
        if (zt(i, a, c) === 0 && (i[0] - a[0]) * (c[0] - a[0]) + (i[1] - a[1]) * (c[1] - a[1]) > 0)
          return !1;
        for (let l = o + 2; l < e; l++) {
          if (o === 0 && l === e - 1) continue;
          const f = s[l], h = s[(l + 1) % e];
          if (Ee(i[0], i[1], a[0], a[1], f[0], f[1], h[0], h[1]))
            return !1;
        }
      }
    }
    return !0;
  }
  // ── 全部の数え直し（試験用。製品のコードは呼ばない） ──
  audit() {
    const t = [];
    let e = 0, n = 0, s = 0, o = !0;
    const i = /* @__PURE__ */ new Map();
    for (const [f, [h, u, p]] of this.triangles) {
      this.ok(h, u, p) || t.push(f);
      const b = this.forbiddenGroup(h, u, p);
      b === _e ? e++ : b !== void 0 && n++, s += ke(
        this.vertices.get(h).forw,
        this.vertices.get(u).forw,
        this.vertices.get(p).forw
      ) / 2;
      for (const [v, x] of [
        [h, u],
        [u, p],
        [p, h]
      ]) {
        const A = ft(v, x);
        i.set(A, (i.get(A) ?? 0) + 1), this.byEdge.get(A)?.includes(f) || (o = !1), this.byVertex.get(v)?.has(f) || (o = !1);
      }
    }
    let a = 0;
    for (const [f, h] of i)
      h > 2 && a++, this.byEdge.get(f)?.length !== h && (o = !1);
    i.size !== this.byEdge.size && (o = !1);
    let c = 0;
    for (const [f, h] of this.byVertex)
      this.vertices.has(f) || (o = !1), c += h.size;
    c !== this.triangles.size * 3 && (o = !1);
    let l = 0;
    for (const [f, h] of this.edgeFlags)
      h & Ut && !this.byEdge.has(f) && l++;
    return {
      triangles: this.triangles.size,
      bad: t,
      badMatches: t.length === this.bad.size && t.every((f) => this.bad.has(f)),
      indexMatches: o,
      nonManifoldEdges: a,
      boundarySimple: this.computeBoundarySimple(),
      missingRequired: l,
      forbiddenBoundary: e,
      forbiddenEdge: n,
      forbiddenMatches: e === this.forbiddenBoundary && n === this.forbiddenEdge,
      forwArea: s
    };
  }
}
const ts = (r, t, e) => Math.sign(it(r[0], r[1], t[0], t[1], e[0], e[1]));
class zr {
  /** 対応点の頂点の id（compiled の `points` の並び） */
  gcps = [];
  /** 対応点の id（`PointId`）から、頂点の id を引く表 */
  pointVertex = /* @__PURE__ */ new Map();
  /** 必須エッジ（compiled の `edges` の並び） */
  edges = [];
  /** 補完点（compiled の `edgeNodes` の、中継点の後ろの並び） */
  supplements = [];
  /** 補助頂点の頂点の id（輪の中の順） */
  ring = [];
  /** 扇形の中心（最後に帯を作ったときの値。world file 外周では持たない） */
  centroid;
  /** 補完点の鍵の続き番号 */
  nextSupplement = 0;
  bandStats;
  /**
   * 帯（補助頂点・重心）を更新しなくてよいかを判定するための量（設計書 §6.3）。最初に要るときに 1 回だけ作る。
   * 判定できない網（world file 外周・補助頂点の輪が閉じなかった網）では null。
   */
  band() {
    return this.bandStats === void 0 && (this.bandStats = sn.of(this)), this.bandStats;
  }
  /** 対応点と必須エッジ（`setPoints`・`setEdges` に入れる形。座標は内部の座標系）と、その id の並び。 */
  inputs() {
    const t = (n) => this.mesh.vertices.get(n), e = new Map(this.gcps.map((n, s) => [n, s]));
    return {
      points: this.gcps.map((n) => [t(n).forw, t(n).bakw]),
      edges: this.edges.map((n) => [
        n.forwNodes,
        n.bakwNodes,
        [e.get(n.start), e.get(n.end)]
      ]),
      pointIds: this.gcps.map(
        (n) => t(n).ref.id
      ),
      edgeIds: this.edges.map((n) => n.id)
    };
  }
  mesh;
  context;
  constructor(t, e) {
    this.mesh = t, this.context = e;
  }
  /** 中継点と補完点の頂点の id（compiled の `edgeNodes` の並び）。 */
  nodeOrder() {
    return [
      ...this.edges.flatMap((t) => t.nodes),
      ...this.supplements.map((t) => t.vertex)
    ];
  }
  /** 頂点の id から、compiled の番号（対応点は添字、中継点・補完点は `e{n}`、補助頂点は `b{n}`）を引く表。 */
  indexTable() {
    const t = /* @__PURE__ */ new Map();
    return this.gcps.forEach((e, n) => t.set(e, n)), this.nodeOrder().forEach((e, n) => t.set(e, `e${n}`)), this.ring.forEach((e, n) => t.set(e, `b${n}`)), t;
  }
  /** 網から compiled を書き出す（項目の並びは `Tin#getCompiled` と同じ）。 */
  toCompiled() {
    const { mesh: t, context: e } = this, n = (f) => t.vertices.get(f), s = (f) => [
      n(f).forw,
      n(f).bakw
    ], o = this.indexTable(), i = {};
    i.version = e.version, i.points = this.gcps.map(s), i.weight_buffer = {};
    const a = this.ring.map(s);
    if (e.outer?.outerTransform === "worldFile")
      i.outerTransform = "worldFile", i.worldFile = e.outer.worldFile, i.vertices_points = a;
    else {
      const f = this.centroid;
      i.centroid_point = [f.forw, f.bakw], i.vertices_params = ["forw", "bakw"].map(
        (h) => this.ring.map((u) => {
          const p = n(u)[h];
          return Math.atan2(
            p[0] - f[h][0],
            p[1] - f[h][1]
          );
        })
      ), i.vertices_points = a;
    }
    const c = t.revision > 0, l = c ? t.isStrict() ? "strict" : "strict_error" : e.strict_status;
    return i.strict_status = l, i.tins_points = [
      [...t.triangles.values()].map(
        (f) => f.map((h) => o.get(h))
      )
    ], !c && l === "strict_error" && e.kinks_points && (i.kinks_points = e.kinks_points), i.yaxisMode = e.yaxisMode, i.vertexMode = e.vertexMode, i.strictMode = e.strictMode, e.bounds ? (i.bounds = e.bounds, i.boundsPolygon = e.boundsPolygon, e.hasXy && (i.xy = e.xy), e.hasWh && (i.wh = e.wh)) : i.wh = e.wh, i.edges = this.edges.map(
      (f) => [
        f.forwNodes,
        f.bakwNodes,
        [o.get(f.start), o.get(f.end)]
      ]
    ), i.edgeNodes = this.nodeOrder().map(s), this.supplements.length > 0 && (i.supplementPairs = this.supplements.map((f) => ({
      node: Number(o.get(f.vertex).slice(1)),
      kind: f.kind,
      edge: f.edge.map((h) => o.get(h)),
      ...f.anchor === void 0 ? {} : { anchor: o.get(f.anchor) }
    }))), e.outer?.outerTransform === "extrapolate" && (i.outerTransform = "extrapolate"), i;
  }
}
function Yr(r, t, e = {}) {
  if (r.version !== void 0 && r.version < 3)
    return { reason: "v2" };
  if (r.strict_status === "loose" || r.tins_points.length !== 1)
    return { reason: "loose" };
  const n = r.outerTransform, s = n === "worldFile" && r.yaxisMode === "follow" ? 1 : -1, o = r.points, i = r.edgeNodes ?? [], a = r.vertices_points ?? [], c = o.length, l = (g) => {
    if (typeof g == "number") return o[g];
    const w = Number(g.slice(1));
    return g.startsWith("e") ? i[w] : g.startsWith("b") ? a[w] : void 0;
  };
  let f = 0, h = 0;
  for (const g of r.tins_points[0]) {
    const [w, k, S] = g.map(l);
    if (!w || !k || !S) return { reason: "inconsistent" };
    const M = ts(w[0], k[0], S[0]);
    h += M, f += M * ts(w[1], k[1], S[1]);
  }
  if ((f < 0 ? -1 : 1) !== s) return { reason: "orientation" };
  const u = new Lr(s, h < 0 ? -1 : 1), p = new zr(u, {
    version: r.version,
    yaxisMode: r.yaxisMode,
    vertexMode: r.vertexMode,
    strictMode: r.strictMode,
    bounds: r.bounds,
    boundsPolygon: r.boundsPolygon,
    xy: r.xy,
    wh: r.wh,
    hasXy: "xy" in r,
    hasWh: "wh" in r,
    outer: n === "worldFile" ? {
      outerTransform: "worldFile",
      worldFile: r.worldFile
    } : n === "extrapolate" ? { outerTransform: "extrapolate" } : void 0,
    strict_status: r.strict_status,
    kinks_points: r.kinks_points
  }), b = /* @__PURE__ */ new Map();
  o.forEach(([g, w], k) => {
    const S = e.points?.[k] ?? k, M = u.addVertex({ kind: "gcp", id: S }, g, w);
    p.gcps.push(M), p.pointVertex.set(S, M), b.set(k, M);
  });
  const v = r.edges ?? [];
  if (p.edges = v.map(
    ([g, w, [k, S]], M) => ({
      id: e.edges?.[M] ?? M,
      start: b.get(k),
      end: b.get(S),
      forwNodes: g,
      bakwNodes: w,
      nodes: []
    })
  ), p.edges.some(({ start: g, end: w }) => g === void 0 || w === void 0))
    return { reason: "inconsistent" };
  const x = /* @__PURE__ */ new Map();
  {
    let g = 0;
    for (const [, w] of t)
      w >= c ? x.has(w - c) || x.set(w - c, g) : g++;
    if (g !== p.edges.length) return { reason: "inconsistent" };
  }
  i.forEach(([g, w], k) => {
    const S = x.get(k);
    let M;
    if (S !== void 0) {
      const T = p.edges[S];
      M = u.addVertex(
        { kind: "edgeNode", edge: T.id, order: T.nodes.length },
        g,
        w,
        [Oe(T.id)]
      ), T.nodes.push(M);
    } else
      M = u.addVertex(
        { kind: "supplement", key: `s${p.nextSupplement++}` },
        g,
        w
      );
    b.set(`e${k}`, M);
  });
  for (const g of p.edges) {
    const w = Oe(g.id);
    u.vertices.get(g.start).groups.push(w), u.vertices.get(g.end).groups.push(w);
  }
  a.forEach(([g, w], k) => {
    const S = u.addVertex({ kind: "boundary", order: k }, g, w, [
      _e
    ]);
    p.ring.push(S), b.set(`b${k}`, S);
  });
  const A = new Map(
    (r.supplementPairs ?? []).map((g) => [g.node, g])
  );
  for (let g = 0; g < i.length; g++) {
    if (x.has(g)) continue;
    const w = A.get(g), k = w?.edge.map((S) => b.get(S));
    if (!w || !k || k.some((S) => S === void 0))
      return { reason: "inconsistent" };
    p.supplements.push({
      vertex: b.get(`e${g}`),
      kind: w.kind,
      edge: k,
      ...w.anchor === void 0 ? {} : { anchor: b.get(w.anchor) }
    });
  }
  if (r.centroid_point)
    p.centroid = {
      forw: r.centroid_point[0],
      bakw: r.centroid_point[1]
    };
  else if (n !== "worldFile") return { reason: "inconsistent" };
  for (const g of r.tins_points[0]) {
    const [w, k, S] = g.map((M) => b.get(M));
    u.addTriangle(w, k, S);
  }
  const y = (g) => g < c ? b.get(g) : b.get(`e${g - c}`);
  for (const [g, w] of t) {
    const k = y(g), S = y(w);
    if (k === void 0 || S === void 0) return { reason: "inconsistent" };
    u.setFlag(k, S, Ut);
  }
  const m = [...p.gcps, ...p.nodeOrder()], d = Ie(
    m.map((g) => u.vertices.get(g).forw)
  );
  for (const [g, w] of d)
    u.hasEdge(m[g], m[w]) && u.setFlag(m[g], m[w], rn);
  return u.boundarySimple = u.computeBoundarySimple(), { model: p };
}
const Ur = 3, ht = (r) => ({ ok: !1, reason: r }), xs = { overlap: 0, forbidden: 0, polish: 0 }, es = (r, t, e) => it(r[0], r[1], t[0], t[1], e[0], e[1]), on = (r, t) => r[0] === t[0] && r[1] === t[1];
function an(r, t, e) {
  const n = (a) => r.vertices.get(a).forw, s = (a) => {
    const c = r.positive(a);
    return c !== void 0 && c.every((l, f) => es(n(l), n(c[(f + 1) % 3]), t) >= 0);
  }, o = [e];
  let i = e;
  for (let a = 0; a <= r.triangles.size; a++) {
    const c = r.positive(i);
    if (!c) break;
    let l, f = !1;
    for (let h = 0; h < 3 && l === void 0; h++) {
      const u = c[h], p = c[(h + 1) % 3];
      es(n(u), n(p), t) >= 0 || (f = !0, l = r.byEdge.get(ft(u, p)).find((b) => b !== i));
    }
    if (!f) return { triangle: i, path: o };
    if (l === void 0) break;
    i = l, o.push(i);
  }
  for (const a of r.triangles.keys())
    if (s(a)) return { triangle: a, path: [a] };
}
function ks(r, t, e) {
  const n = (i) => r.vertices.get(i).forw, s = /* @__PURE__ */ new Set([e]), o = [e];
  for (let i = 0; i < o.length; i++) {
    const a = r.triangles.get(o[i]);
    for (let c = 0; c < 3; c++) {
      const l = ft(a[c], a[(c + 1) % 3]);
      if (!((r.edgeFlags.get(l) ?? 0) & (Ut | rn)))
        for (const f of r.byEdge.get(l)) {
          if (s.has(f)) continue;
          const h = r.positive(f);
          if (!h) continue;
          const [u, p, b] = h.map(n);
          Fe(
            u[0],
            u[1],
            p[0],
            p[1],
            b[0],
            b[1],
            t[0],
            t[1]
          ) * bs > 0 && (s.add(f), o.push(f));
        }
    }
  }
  return s;
}
function qr(r, t, e, n) {
  const s = an(r, t, n);
  if (!s) return;
  const o = (l) => r.vertices.get(l).forw, i = (l) => {
    const f = r.triangles.get(l);
    for (let h = 0; h < 3; h++) {
      const u = o(f[h]), p = o(f[(h + 1) % 3]);
      if (Ee(t[0], t[1], e[0], e[1], u[0], u[1], p[0], p[1]))
        return !0;
    }
    return !1;
  }, a = /* @__PURE__ */ new Set([s.triangle]), c = [s.triangle];
  for (let l = 0; l < c.length; l++) {
    const f = r.triangles.get(c[l]);
    for (let h = 0; h < 3; h++)
      for (const u of r.byEdge.get(ft(f[h], f[(h + 1) % 3])))
        a.has(u) || !i(u) || (a.add(u), c.push(u));
  }
  return a;
}
function cn(r, t, e, n) {
  let s = t, o;
  for (let i = 0; i <= Ur; i++) {
    const a = r.replace(s, e);
    if (a.ok)
      return {
        ok: !0,
        mode: "replaced",
        removed: a.removed,
        added: a.added,
        grown: i,
        size: s.size,
        flips: a.flips,
        vertices: n
      };
    if (o ??= a.reason, a.reason === "tooLarge") break;
    s = r.grow(s);
  }
  return ht(o ?? "notDisk");
}
function Re(r, t, e) {
  const { mesh: n } = r, s = (d) => e && d === e.vertex ? e : n.vertices.get(d), o = /* @__PURE__ */ new Set(), i = [], a = [], c = [], l = n.triangles.keys().next().value;
  if (l === void 0) return ht("unsupported");
  if (e) {
    const d = n.star(e.vertex);
    if (d.size === 0) return ht("unsupported");
    i.push({ vertex: e.vertex, to: e, gcp: !0, counted: !0 });
    for (const w of d) o.add(w);
    const g = n.vertices.get(e.vertex);
    if (!on(e.forw, g.forw)) {
      const w = an(n, e.forw, d.values().next().value);
      if (!w) return ht("pointOutside");
      if (!d.has(w.triangle)) {
        for (const k of w.path) o.add(k);
        for (const k of ks(n, e.forw, w.triangle)) o.add(k);
      }
    }
  }
  const f = [];
  for (const d of t) {
    const { edge: g } = d;
    if (!d.fresh) {
      const N = [g.start, ...g.nodes, g.end];
      for (let P = 0; P + 1 < N.length; P++) c.push([N[P], N[P + 1]]);
      if (g.nodes.length === 0)
        for (const P of n.byEdge.get(ft(g.start, g.end)) ?? []) o.add(P);
      for (const P of g.nodes) {
        for (const C of n.byVertex.get(P)) o.add(C);
        a.push(P), i.push({ vertex: P, gcp: !1, counted: !0 });
      }
    }
    if (d.drop) continue;
    const w = s(g.start), k = s(g.end), S = d.forwNodes.length > 0 || d.bakwNodes.length > 0, M = S ? ys(
      [w.forw, ...d.forwNodes, k.forw],
      [w.bakw, ...d.bakwNodes, k.bakw]
    ).map(([N, P]) => [N, P]) : [];
    if (S && M.length === 0) return ht("unsupported");
    f.push({ spec: d, nodes: M });
    for (const [N, P] of M)
      i.push({ to: { forw: N, bakw: P }, gcp: !1, counted: !0 });
    const T = [w.forw, ...M.map(([N]) => N), k.forw];
    for (let N = 0; N + 1 < T.length; N++) {
      const P = qr(n, T[N], T[N + 1], l);
      if (!P) return ht("pointOutside");
      for (const C of P) o.add(C);
    }
  }
  const h = r.band(), u = h?.keeps(r, i);
  if (!h || !u) return ht("unsupported");
  const p = a.map((d) => n.vertices.get(d).ref), b = [], v = [], x = [], A = /* @__PURE__ */ new Map();
  for (const { spec: d, nodes: g } of f) {
    const { edge: w } = d, k = Oe(w.id);
    if (d.fresh)
      for (const T of [w.start, w.end]) {
        const { groups: N } = n.vertices.get(T);
        N.includes(k) || (N.push(k), x.push({ vertex: T, group: k }));
      }
    const S = g.map(
      ([T, N], P) => n.addVertex({ kind: "edgeNode", edge: w.id, order: P }, T, N, [k])
    );
    b.push(...S), A.set(d, S);
    const M = [w.start, ...S, w.end];
    for (let T = 0; T + 1 < M.length; T++)
      v.push([M[T], M[T + 1], Ut]);
  }
  const y = {
    added: b,
    removed: p,
    moved: e ? [e.vertex] : []
  };
  let m;
  if (o.size === 0)
    if (!v.every(([d, g]) => n.hasEdge(d, g)))
      m = ht("constraint");
    else {
      for (const [d, g] of c) n.clearFlag(d, g, Ut);
      for (const [d, g, w] of v) n.setFlag(d, g, w);
      n.revision++, m = { ok: !0, mode: "moved", removed: [], added: [], grown: 0, size: 0, flips: xs, vertices: y };
    }
  else
    m = cn(
      n,
      o,
      {
        move: e ? /* @__PURE__ */ new Map([[e.vertex, { forw: e.forw, bakw: e.bakw }]]) : void 0,
        add: b,
        remove: a,
        release: c,
        constrain: v
      },
      y
    );
  if (!m.ok) {
    for (const d of b) n.dropVertex(d);
    for (const { vertex: d, group: g } of x) {
      const { groups: w } = n.vertices.get(d);
      w.splice(w.indexOf(g), 1);
    }
    return m;
  }
  h.commit(u);
  for (const d of t) {
    const { edge: g } = d;
    if (d.drop) {
      const w = Oe(g.id);
      for (const k of [g.start, g.end]) {
        const { groups: S } = n.vertices.get(k), M = S.indexOf(w);
        M !== -1 && S.splice(M, 1);
      }
      g.nodes = [];
      continue;
    }
    g.nodes = A.get(d), g.forwNodes = d.forwNodes, g.bakwNodes = d.bakwNodes;
  }
  return m;
}
function jr(r, t, e) {
  const { mesh: n } = r, s = r.pointVertex.get(t);
  if (s === void 0) return ht("unknownPoint");
  const o = n.vertices.get(s), i = e.forw ?? o.forw, a = e.bakw ?? o.bakw, l = r.edges.filter(
    (f) => f.start === s || f.end === s
  ).filter((f) => f.nodes.length > 0).map(
    (f) => ({
      edge: f,
      fresh: !1,
      drop: !1,
      forwNodes: f.forwNodes,
      bakwNodes: f.bakwNodes
    })
  );
  if (l.length === 0 && on(i, o.forw)) {
    const f = r.band(), h = f?.keeps(r, [
      { vertex: s, to: { forw: i, bakw: a }, gcp: !0, counted: !0 }
    ]);
    if (!f || !h) return ht("unsupported");
    const u = n.star(s);
    if (u.size === 0) return ht("unsupported");
    const p = (v) => v === s ? { ...o, bakw: a } : n.vertices.get(v);
    if ([...u].every((v) => {
      const [x, A, y] = n.triangles.get(v);
      return n.okNew(x, A, y, p);
    }))
      return n.relocate(s, i, a), f.commit(h), {
        ok: !0,
        mode: "moved",
        removed: [],
        added: [],
        grown: 0,
        size: u.size,
        flips: xs,
        vertices: { added: [], removed: [], moved: [s] }
      };
  }
  return Re(r, l, { vertex: s, forw: i, bakw: a });
}
function Gr(r, t, e, n, s) {
  const { mesh: o } = r;
  if (r.pointVertex.has(t)) return ht("idInUse");
  const i = o.triangles.keys().next().value;
  if (i === void 0) return ht("unsupported");
  const a = r.band(), c = a?.keeps(r, [
    { to: { forw: e, bakw: n }, gcp: !0, counted: !0 }
  ]);
  if (!a || !c) return ht("unsupported");
  const l = an(o, e, i);
  if (!l) return ht("pointOutside");
  if (o.triangles.get(l.triangle).some((p) => on(o.vertices.get(p).forw, e)))
    return ht("duplicate");
  const h = o.addVertex({ kind: "gcp", id: t }, e, n), u = cn(
    o,
    ks(o, e, l.triangle),
    { add: [h] },
    { added: [h], removed: [], moved: [] }
  );
  return u.ok ? (a.commit(c), r.gcps.splice(s ?? r.gcps.length, 0, h), r.pointVertex.set(t, h), u) : (o.dropVertex(h), u);
}
function Kr(r, t) {
  const { mesh: e } = r, n = r.pointVertex.get(t);
  if (n === void 0) return ht("unknownPoint");
  if (r.edges.some((l) => l.start === n || l.end === n) || r.supplements.some(
    (l) => l.edge.includes(n) || l.anchor === n
  ))
    return ht("unsupported");
  const s = r.band(), o = s?.keeps(r, [{ vertex: n, gcp: !0, counted: !0 }]);
  if (!s || !o) return ht("unsupported");
  const i = e.star(n);
  if (i.size === 0) return ht("unsupported");
  const a = e.vertices.get(n).ref, c = cn(
    e,
    i,
    { remove: [n] },
    { added: [], removed: [a], moved: [] }
  );
  return c.ok && (s.commit(o), r.gcps.splice(r.gcps.indexOf(n), 1), r.pointVertex.delete(t)), c;
}
function Wr(r, t, e, n, s = [], o = [], i) {
  if (r.edges.some((h) => h.id === t)) return ht("idInUse");
  const a = r.pointVertex.get(e), c = r.pointVertex.get(n);
  if (a === void 0 || c === void 0 || a === c)
    return ht("unknownPoint");
  const l = { id: t, start: a, end: c, forwNodes: s, bakwNodes: o, nodes: [] }, f = Re(r, [
    { edge: l, fresh: !0, drop: !1, forwNodes: s, bakwNodes: o }
  ]);
  return f.ok && r.edges.splice(i ?? r.edges.length, 0, l), f;
}
function Hr(r, t) {
  const e = r.edges.find((s) => s.id === t);
  if (!e) return ht("unknownEdge");
  const n = Re(r, [
    { edge: e, fresh: !1, drop: !0, forwNodes: [], bakwNodes: [] }
  ]);
  return n.ok && r.edges.splice(r.edges.indexOf(e), 1), n;
}
function Jr(r, t, e, n) {
  const s = r.edges.find((o) => o.id === t);
  return s ? Re(r, [
    { edge: s, fresh: !1, drop: !1, forwNodes: e, bakwNodes: n }
  ]) : ht("unknownEdge");
}
const Te = (r, t) => t ? [r[0], -1 * r[1]] : r;
function Qr(r, t, e) {
  const n = r.points.slice(), s = r.pointIds.slice(), o = r.edges.map(
    ([u, p, [b, v]]) => ({ forwNodes: u, bakwNodes: p, start: r.pointIds[b], end: r.pointIds[v] })
  ), i = r.edgeIds.slice(), a = (u) => {
    const p = s.indexOf(u);
    if (p === -1) throw new Error(`applyEdits: 対応点 ${u} がありません`);
    return p;
  }, c = (u) => {
    const p = i.indexOf(u);
    if (p === -1) throw new Error(`applyEdits: 必須エッジ ${u} がありません`);
    return p;
  }, l = (u, p) => {
    if (u === void 0) return p;
    if (!Number.isInteger(u) || u < 0 || u > p)
      throw new Error(`applyEdits: position ${u} が範囲の外です`);
    return u;
  }, f = (...u) => {
    for (const p of u)
      if (!Array.isArray(p) || !Number.isFinite(p[0]) || !Number.isFinite(p[1]))
        throw new Error("applyEdits: 座標が有限の数ではありません");
  };
  for (const u of t)
    switch (u.type) {
      case "addPoint": {
        if (!Number.isInteger(u.id) || s.includes(u.id))
          throw new Error(`applyEdits: 対応点の id ${u.id} は使えません`);
        f(u.forw, u.bakw);
        const p = l(u.position, n.length);
        n.splice(p, 0, [u.forw, Te(u.bakw, e)]), s.splice(p, 0, u.id);
        break;
      }
      case "removePoint": {
        const p = a(u.id);
        if (o.some((b) => b.start === u.id || b.end === u.id))
          throw new Error(`applyEdits: 対応点 ${u.id} は必須エッジの端点です（先に必須エッジを外してください）`);
        n.splice(p, 1), s.splice(p, 1);
        break;
      }
      case "movePoint": {
        const p = a(u.id);
        u.forw && f(u.forw), u.bakw && f(u.bakw), n[p] = [
          u.forw ?? n[p][0],
          u.bakw ? Te(u.bakw, e) : n[p][1]
        ];
        break;
      }
      case "addEdge": {
        if (!Number.isInteger(u.id) || i.includes(u.id))
          throw new Error(`applyEdits: 必須エッジの id ${u.id} は使えません`);
        if (a(u.start), a(u.end), u.start === u.end) throw new Error("applyEdits: 必須エッジの両端が同じ対応点です");
        f(...u.forwNodes, ...u.bakwNodes);
        const p = l(u.position, o.length);
        o.splice(p, 0, { forwNodes: u.forwNodes, bakwNodes: u.bakwNodes, start: u.start, end: u.end }), i.splice(p, 0, u.id);
        break;
      }
      case "removeEdge": {
        const p = c(u.id);
        o.splice(p, 1), i.splice(p, 1);
        break;
      }
      case "replaceEdgeNodes": {
        const p = c(u.id);
        f(...u.forwNodes, ...u.bakwNodes), o[p] = { ...o[p], forwNodes: u.forwNodes, bakwNodes: u.bakwNodes };
        break;
      }
      default:
        throw new Error(`applyEdits: 編集の種類 ${u.type} は扱えません`);
    }
  const h = new Map(s.map((u, p) => [u, p]));
  return {
    points: n,
    pointIds: s,
    edges: o.map((u) => [
      u.forwNodes,
      u.bakwNodes,
      [h.get(u.start), h.get(u.end)]
    ]),
    edgeIds: i
  };
}
const Zr = (r) => r === "duplicate" || r === "unknownPoint" || r === "unknownEdge" || r === "idInUse" ? "unsupported" : r;
function to(r, t, e) {
  const { mesh: n } = r, s = [...n.bad].sort((m, d) => m - d), o = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set(), a = (m) => JSON.stringify(m), c = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Set(), f = /* @__PURE__ */ new Set();
  for (const m of t) {
    let d;
    switch (m.type) {
      case "addPoint":
        d = Gr(r, m.id, m.forw, Te(m.bakw, e), m.position);
        break;
      case "removePoint":
        d = Kr(r, m.id);
        break;
      case "movePoint":
        d = jr(r, m.id, {
          forw: m.forw,
          bakw: m.bakw ? Te(m.bakw, e) : void 0
        });
        break;
      case "addEdge":
        d = Wr(r, m.id, m.start, m.end, m.forwNodes, m.bakwNodes, m.position);
        break;
      case "removeEdge":
        d = Hr(r, m.id);
        break;
      case "replaceEdgeNodes":
        d = Jr(r, m.id, m.forwNodes, m.bakwNodes);
        break;
    }
    if (!d.ok) return { ok: !1, reason: Zr(d.reason) };
    for (const g of d.removed)
      i.delete(g) || o.add(g);
    for (const g of d.added) i.add(g);
    for (const g of d.vertices.removed) c.set(a(g), g);
    for (const g of d.vertices.added) l.add(g);
    for (const g of d.vertices.moved) f.add(g);
  }
  const h = /* @__PURE__ */ new Map(), u = [];
  for (const m of f) {
    const d = n.vertices.get(m);
    d && !l.has(m) && h.set(a(d.ref), { ref: d.ref, forw: d.forw, bakw: d.bakw });
  }
  for (const m of l) {
    const d = n.vertices.get(m);
    if (!d) continue;
    const g = a(d.ref), w = { ref: d.ref, forw: d.forw, bakw: d.bakw };
    c.delete(g) ? h.set(g, w) : u.push(w);
  }
  const p = /* @__PURE__ */ new Set();
  for (const m of c.keys())
    h.has(m) && p.add(m);
  for (const m of p) c.delete(m);
  let b;
  const v = (m) => {
    b = b ? [Math.min(b[0], m[0]), Math.min(b[1], m[1]), Math.max(b[2], m[0]), Math.max(b[3], m[1])] : [m[0], m[1], m[0], m[1]];
  }, x = [];
  for (const m of i) {
    const d = n.triangles.get(m);
    if (!d) continue;
    const g = d.map((w) => {
      const k = n.vertices.get(w);
      return v(k.forw), k.ref;
    });
    x.push({ id: m, vertices: g });
  }
  for (const { forw: m } of h.values()) v(m);
  const A = [...n.bad].sort((m, d) => m - d), y = A.length !== s.length || A.some((m, d) => m !== s[d]);
  return {
    ok: !0,
    patch: {
      strict_status: n.isStrict() ? "strict" : "strict_error",
      ...h.size > 0 ? { movedVertices: [...h.values()] } : {},
      ...c.size > 0 ? { removedVertices: [...c.values()] } : {},
      ...u.length > 0 ? { addedVertices: u } : {},
      removedTriangles: [...o],
      addedTriangles: x,
      ...y ? { badTriangles: A } : {},
      ...b ? { dirtyBounds: b } : {}
    }
  };
}
const ns = 2.00704, ss = 3.00001, eo = 12, no = 4, is = 1, rs = 4, so = 8, io = 24;
function ro(r) {
  if (r.size === 0) return [];
  if (r.size >= 36) return [[...r].sort((e, n) => e - n)];
  const t = [];
  for (let e = 0; e < 36; e++) {
    if (!r.has(e) || r.has((e + 35) % 36)) continue;
    const n = [e];
    for (let s = (e + 1) % 36; r.has(s); s = (s + 1) % 36) n.push(s);
    t.push(n);
  }
  return t;
}
const os = /* @__PURE__ */ Symbol("supplement pairs out of budget"), oo = 24;
class st extends Is {
  importance;
  priority;
  pointsSet;
  useV2Algorithm;
  /** V3 で補完点を足すか（`Options#supplementPairs`）。 */
  useSupplementPairs;
  supplementRecords = [];
  lastSupplementDiagnostics;
  lastBoundaryDiagnostics;
  /** `updateTin()` の中で三角網を組んだ試行の数（補助頂点の手当ての手間の上限に使う）。 */
  attemptTotal = 0;
  requestedWorldFile;
  compiledOuter;
  /** 局所更新のスイッチ（`Options#incremental`）。 */
  incremental;
  mesh;
  meshFailure;
  /** 対応点・必須エッジの id（`points`・`edges` の並び）。undefined は、配列の添字が id。 */
  pointIds;
  edgeIds;
  /** `applyEdits` で進む版の番号。`setPoints` などで入力を入れ直すと 0 に戻る。 */
  editRevision = 0;
  /** 網が、`tins`・`points`・`edges` より先に進んでいる（局所更新を当てた後、まだ書き戻していない）。 */
  meshAhead = !1;
  /** 補助頂点・重心が最新でない（局所更新を当てた後、清書か帯の差し替えをするまで）。 */
  bandStale = !1;
  /**
   * 局所更新の網（今の三角網を取り込んだもの）。スイッチが切れている・三角網が無い・取り込めない網
   * （loose・V2 など。理由は `incrementalFailure`）のときは undefined。
   */
  get incrementalMesh() {
    return this.mesh;
  }
  /** 局所更新の網へ取り込めなかった理由（取り込めた・スイッチが切れているときは undefined）。 */
  get incrementalFailure() {
    return this.meshFailure;
  }
  /** `applyEdits` の版の番号。次の `applyEdits` に、前提として渡す。 */
  get revision() {
    return this.editRevision;
  }
  /** 網と、網から決まる状態を捨てる（入力や設定を入れ直したとき）。 */
  dropMesh() {
    this.mesh = void 0, this.meshFailure = void 0, this.meshAhead = !1, this.bandStale = !1, this.editRevision = 0;
  }
  /**
   * 局所更新を当てた網を、`points`・`edges`・`tins` などへ書き戻す（`transform()`・`getCompiled()` の前に
   * 自動で呼ばれる。全体を作り直すので、編集のたびには呼ばないこと。表示は `TinPatch` で足りる）。
   */
  syncFromMesh() {
    if (!this.meshAhead || !this.mesh) return;
    const t = this.mesh, e = t.toCompiled(), n = t.inputs(), { xy: s, wh: o } = this;
    super.setCompiled(e), Object.assign(this, { xy: s, wh: o }), delete this.kinks, this.pointsSet = void 0, this.pointIds = n.pointIds, this.edgeIds = n.edgeIds, this.supplementRecords = (e.supplementPairs ?? []).map((i) => ({
      ...i,
      edge: [...i.edge]
    })), this.pointsWeightBuffer = {}, this.meshAhead = !1;
  }
  /** 今の入力（対応点・必須エッジ。内部の座標系）と、その id の並び。 */
  currentInputs() {
    return this.meshAhead && this.mesh ? this.mesh.inputs() : {
      points: this.points,
      edges: this.edges ?? [],
      pointIds: this.pointIds ?? this.points.map((t, e) => e),
      edgeIds: this.edgeIds ?? (this.edges ?? []).map((t, e) => e)
    };
  }
  /**
   * 編集を当てる（MaplatTin#100 の第 2 段 a）。局所で済めば、網の差分を返す（`mode: "local"`）。済まなければ、
   * 編集を入力に当てて全部組み直し、その結果を返す（`mode: "full"`。理由は `fallbackReason`）。
   *
   * - `edits` は、全部が当たるか、全部組み直しか、のどちらか（一部だけ当たった網を返さない）。
   * - `baseRevision` が今の版（`revision`）と合わなければ、何も変えずに `"revisionMismatch"` を返す。
   *   呼び出し側は、最新の入力を `setPoints`・`setEdges` で入れ直して、`updateTin()` すること。
   * - 当てられない編集（id が無い・既に使われている・座標が有限でない）は、何も変えずに例外を投げる。
   * - 全部組み直しが例外を投げる入力（必須エッジが交差する・点が一直線、など）では、`updateTin()` と同じ
   *   例外を投げる。入力は編集の後の状態になり、三角網は無い。
   * - 局所で済むのは、スイッチ（`Options#incremental`）が入っていて、strict・strict_error の V3 の網で、
   *   帯（補助頂点・重心）を更新しなくてよい内側の編集だけ。
   * - 座標は、`setPoints` に渡すのと同じ、外の座標系（差分の座標は、compiled と同じ内部の座標系）。
   */
  applyEdits(t, e) {
    if (e !== void 0 && e !== this.editRevision)
      return {
        revision: this.editRevision,
        mode: "full",
        fallbackReason: "revisionMismatch",
        strict_status: this.strict_status,
        boundaryStale: this.bandStale
      };
    const n = this.yaxisMode === st.YAXIS_FOLLOW, s = Qr(this.currentInputs(), t, n);
    let o = "noMesh";
    if (this.mesh) {
      const a = this.bounds ? this.boundsPolygon : void 0;
      if (a && !s.points.every((c) => Ue(c[0], a)))
        o = "unsupported";
      else {
        const c = to(this.mesh, t, n);
        if (c.ok)
          return this.meshAhead = !0, this.bandStale = !0, this.tins = void 0, this.indexedTins = void 0, this.pointsSet = void 0, delete this.kinks, this.strict_status = c.patch.strict_status, this.editRevision++, { revision: this.editRevision, mode: "local", boundaryStale: !0, ...c.patch };
        o = c.reason;
      }
    }
    const i = this.editRevision + 1;
    return this.mesh = void 0, this.meshAhead = !1, this.points = s.points, this.edges = s.edges, this.edgeNodes = void 0, this.pointIds = s.pointIds, this.edgeIds = s.edgeIds, this.tins = void 0, this.indexedTins = void 0, this.editRevision = i, this.updateTin(), {
      revision: i,
      mode: "full",
      fallbackReason: o,
      strict_status: this.strict_status,
      boundaryStale: !1
    };
  }
  /** 紙の面と地理面の間で座標を変換する。局所更新を当てた後は、網から三角網を作り直してから変換する。 */
  transform(t, e, n) {
    return this.syncFromMesh(), super.transform(t, e, n);
  }
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
    if (super(), t.bounds ? this.setBounds(t.bounds) : (this.setWh(t.wh), this.vertexMode = t.vertexMode || st.VERTEX_PLAIN), this.strictMode = t.strictMode || st.MODE_AUTO, this.yaxisMode = t.yaxisMode || st.YAXIS_INVERT, this.importance = t.importance || 0, this.priority = t.priority || 0, this.stateFull = t.stateFull || !1, this.useV2Algorithm = t.useV2Algorithm ?? !1, this.useSupplementPairs = t.supplementPairs ?? !0, this.incremental = t.incremental ?? !1, t.outerTransform === "worldFile") {
      if (this.useV2Algorithm) throw new Error("V2 では world file 外周を使えません");
      if (!t.worldFile) throw new Error("worldFile が必要です");
      As(t.worldFile), this.requestedWorldFile = { ...t.worldFile };
    }
    t.points && this.setPoints(t.points), t.edges && this.setEdges(t.edges);
  }
  /**
   * フォーマットバージョンを取得します
   */
  getFormatVersion() {
    return this.useV2Algorithm ? ns : ss;
  }
  /**
   * 制御点（GCP: Ground Control Points）を設定します。
   * 指定した点群に合わせて内部のTINキャッシュをリセットします。
   */
  setPoints(t) {
    this.syncFromMesh(), this.yaxisMode === st.YAXIS_FOLLOW && (t = t.map((e) => [
      e[0],
      [e[1][0], -1 * e[1][1]]
    ])), this.points = t, this.pointIds = void 0, this.dropMesh(), this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * エッジ（制約線）を設定します。
   * 制約線を正規化した上で、依存するキャッシュをリセットします。
   */
  setEdges(t = []) {
    this.syncFromMesh(), this.edges = Ns(t), this.edgeIds = void 0, this.dropMesh(), this.edgeNodes = void 0, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 境界ポリゴンを設定します
   */
  setBounds(t) {
    this.retireMesh(), this.bounds = t;
    let e = t[0][0], n = e, s = t[0][1], o = s;
    const i = [t[0]];
    for (let a = 1; a < t.length; a++) {
      const c = t[a];
      c[0] < e && (e = c[0]), c[0] > n && (n = c[0]), c[1] < s && (s = c[1]), c[1] > o && (o = c[1]), i.push(c);
    }
    i.push(t[0]), this.boundsPolygon = ce([i]), this.xy = [e, s], this.wh = [n - e, o - s], this.vertexMode = st.VERTEX_PLAIN, this.tins = void 0, this.indexedTins = void 0;
  }
  /** 設定を変える前に、局所更新を当てた網を入力へ書き戻して、網を捨てる（id の並びと版は保つ）。 */
  retireMesh() {
    this.syncFromMesh(), this.mesh = void 0, this.meshFailure = void 0, this.bandStale = !1;
  }
  /**
   * 現在の設定を永続化可能な形式にコンパイルします
   */
  getCompiled() {
    if (this.meshAhead && this.mesh) return this.mesh.toCompiled();
    const t = {};
    if (t.version = this.useV2Algorithm ? ns : ss, t.points = this.points, t.weight_buffer = {}, this.compiledOuter?.outerTransform === "worldFile")
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
          const s = e[n].features[0], o = s.geometry.coordinates[0][1], i = s.properties.b.geom;
          t.vertices_points[n] = [o, i];
        }
    }
    return t.strict_status = this.strict_status, t.tins_points = [[]], this.tins.forw.features.map((e) => {
      t.tins_points[0].push(
        ["a", "b", "c"].map(
          (n) => e.properties[n].index
        )
      );
    }), this.strict_status === st.STATUS_LOOSE ? (t.tins_points[1] = [], this.tins.bakw.features.map((e) => {
      t.tins_points[1].push(
        ["a", "b", "c"].map(
          (n) => e.properties[n].index
        )
      );
    })) : this.strict_status === st.STATUS_ERROR && this.kinks?.bakw && (t.kinks_points = this.kinks.bakw.features.map(
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
    this.dropMesh(), this.pointIds = void 0, this.edgeIds = void 0, super.setCompiled(t), this.supplementRecords = (t.supplementPairs ?? []).map((s) => ({
      ...s,
      edge: [...s.edge]
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
    this.retireMesh(), this.wh = t || [100, 100], this.xy = [0, 0], this.bounds = void 0, this.boundsPolygon = void 0, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 頂点モードを設定します
   */
  setVertexMode(t) {
    this.retireMesh(), this.vertexMode = t, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 厳密性モードを設定します
   */
  setStrictMode(t) {
    this.retireMesh(), this.strictMode = t, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 厳密なTINを計算します
   *
   * @param kinkLimit - forw / bakw それぞれで残す交差（kinks）の件数の上限
   *   （同じ位置の交差を 1 件に数えた件数）。届いた時点で数え上げをやめます
   */
  calculateStrictTin(t = Xn) {
    this.resolveStrictOverlaps(), this.detectStrictKinks(t);
  }
  /**
   * 順三角網から逆三角網を写し、重なりを辺の反転で解消する（`calculateStrictTin` の前半）。
   * 交差の判定（`strict_status`・`kinks`）はしない。補完点の置き場所を測る試行は、三角網の向きを読むだけなので
   * これだけを呼ぶ。
   */
  resolveStrictOverlaps() {
    const t = this.tins.forw.features.map(
      (s) => as(s)
    );
    this.tins.bakw = St(t);
    const e = {};
    this.tins.forw.features.forEach((s, o) => {
      const i = this.tins.bakw.features[o];
      ps(e, { forw: s, bakw: i });
    });
    const n = (this.pointsSet?.forw.features ?? []).map(
      (s) => s.properties.target.index
    );
    br(
      this.tins,
      e,
      this.pointsSet?.edges || [],
      n
    );
  }
  /** `calculateStrictTin` の後半: 両面の交差を数え、`strict_status` と `kinks` を決める。 */
  detectStrictKinks(t) {
    const e = ["forw", "bakw"].map((n) => {
      const s = this.tins[n].features.map(
        (o) => o.geometry.coordinates[0]
      );
      return us(s, t);
    });
    e[0].length === 0 && e[1].length === 0 ? (this.strict_status = st.STATUS_STRICT, delete this.kinks) : (this.strict_status = st.STATUS_ERROR, this.kinks = {
      forw: St(e[0]),
      bakw: St(e[1])
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
      const o = this.points[s][0], i = this.points[s][1], a = Kt(o, i, s);
      t.forw.push(a), t.bakw.push(Wt(a));
    }
    const e = [];
    let n = 0;
    this.edgeNodes = [], this.edges || (this.edges = []);
    for (let s = 0; s < this.edges.length; s++) {
      const o = this.edges[s][2], i = Object.assign([], this.edges[s][0]), a = Object.assign([], this.edges[s][1]);
      if (ao(o, this.points.length, s), i.length === 0 && a.length === 0) {
        e.push(o);
        continue;
      }
      i.unshift(this.points[o[0]][0]), i.push(this.points[o[1]][0]), a.unshift(this.points[o[0]][1]), a.push(this.points[o[1]][1]), ys(i, a).forEach((c, l, f) => {
        this.edgeNodes[n] = [
          c[0],
          c[1]
        ];
        const h = Kt(
          c[0],
          c[1],
          `e${n}`
        );
        n++, t.forw.push(h), t.bakw.push(Wt(h)), l === 0 ? e.push([o[0], t.forw.length - 1]) : e.push([
          t.forw.length - 2,
          t.forw.length - 1
        ]), l === f.length - 1 && e.push([t.forw.length - 1, o[1]]);
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
    const o = this.bounds ? this.boundsPolygon : void 0;
    if (!this.points.reduce((c, l) => c && (o ? Ue(l[0], o) : l[0][0] >= t && l[0][0] <= e && l[0][1] >= n && l[0][1] <= s), !0))
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
    for (const o of this.points) {
      const i = o[0][0], a = o[0][1];
      i < t && (t = i), i > e && (e = i), a < n && (n = a), a > s && (s = a);
    }
    return { minx: t, maxx: e, miny: n, maxy: s };
  }
  /**
   * TINネットワークを同期的に更新し、座標変換の準備を行います。
   * 重めの計算を伴うため、呼び出し側が非同期制御を行いたい場合は
   * {@link updateTinAsync} を利用してください。
   */
  updateTin() {
    if (this.meshAhead && this.mesh) {
      const t = this.mesh.inputs();
      this.points = t.points, this.edges = t.edges, this.pointIds = t.pointIds, this.edgeIds = t.edgeIds, this.edgeNodes = void 0;
    }
    if (this.mesh = void 0, this.meshFailure = void 0, this.meshAhead = !1, this.bandStale = !1, this.rebuildAll(), this.incremental) {
      const t = Yr(this.getCompiled(), this.pointsSet.edges, {
        points: this.pointIds,
        edges: this.edgeIds
      });
      "model" in t ? this.mesh = t.model : this.meshFailure = t.reason;
    }
  }
  /** 三角網を最初から全部組む（`updateTin()` の本体）。 */
  rebuildAll() {
    this.lastBoundaryDiagnostics = void 0, this.supplementRecords = [], this.attemptTotal = 0, this.lastSupplementDiagnostics = void 0;
    let t = this.strictMode;
    t !== st.MODE_STRICT && t !== st.MODE_LOOSE && (t = st.MODE_AUTO);
    const e = !this.useV2Algorithm, n = this.requestedWorldFile;
    if (n && !e) throw new Error("V2 では world file 外周を使えません");
    let s, o, i, a, c;
    if (e) {
      if (this.bounds) {
        const C = this.boundsPolygon;
        if (!C) throw new Error("Internal error: bounds is set but boundsPolygon is missing");
        if (!this.points.every(
          (O) => Ue(O[0], C)
        )) throw "SOME POINTS OUTSIDE";
      }
      s = this.generatePointsSet(), { minx: o, maxx: i, miny: a, maxy: c } = this.computeGcpBbox();
    } else {
      const C = this.validateAndPrepareInputs();
      s = C.pointsSet, o = C.minx, i = C.maxx, a = C.miny, c = C.maxy;
    }
    const l = {
      forw: St([...s.forw]),
      bakw: St([...s.bakw])
    }, f = ve(
      l.forw,
      s.edges,
      "target"
    ), h = ve(
      l.bakw,
      s.edges,
      "target"
    );
    if (f.features.length === 0 || h.features.length === 0)
      throw "TOO LINEAR1";
    const u = oi(l.forw), p = Nn(l.forw);
    if (!p) throw "TOO LINEAR2";
    const b = {}, v = p.geometry.coordinates[0];
    let x;
    try {
      x = v.map((C) => ({
        forw: C,
        bakw: De(qt(C), f)
      })), x.forEach((C) => {
        b[`${C.forw[0]}:${C.forw[1]}`] = C;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const A = Nn(l.bakw);
    if (!A) throw "TOO LINEAR2";
    const y = A.geometry.coordinates[0];
    try {
      x = y.map((C) => ({
        bakw: C,
        forw: De(qt(C), h)
      })), x.forEach((C) => {
        b[`${C.forw[0]}:${C.forw[1]}`] = C;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const m = {
      forw: u.geometry.coordinates,
      bakw: De(u, f)
    }, d = Kt(m.forw, m.bakw, "c");
    this.centroid = {
      forw: d,
      bakw: Wt(d)
    };
    const g = [
      ...this.points.map((C) => ({ forw: C[0], bakw: C[1] })),
      ...(this.edgeNodes ?? []).map((C) => ({ forw: C[0], bakw: C[1] }))
    ], w = {
      convexBuf: b,
      centroid: m,
      allGcps: g,
      minx: o,
      maxx: i,
      miny: a,
      maxy: c
    }, k = t === st.MODE_STRICT || t === st.MODE_AUTO, S = (C, _, O) => {
      if (!k || this.isStrict() || !C.boundary) return { result: C };
      const I = () => ({
        build: this.captureBuild(),
        raw: [s.forw.slice(), s.bakw.slice()],
        gcps: g.slice(),
        edgeNodes: this.edgeNodes.slice(),
        supplementRecords: this.supplementRecords,
        supplementDiagnostics: this.lastSupplementDiagnostics
      }), B = (L) => {
        s.forw.splice(0, s.forw.length, ...L.raw[0]), s.bakw.splice(0, s.bakw.length, ...L.raw[1]), g.splice(0, g.length, ...L.gcps), this.edgeNodes.splice(0, this.edgeNodes.length, ...L.edgeNodes), this.restoreBuild(L.build), this.supplementRecords = L.supplementRecords, this.lastSupplementDiagnostics = L.supplementDiagnostics;
      }, D = I(), $ = this.attemptTotal, E = () => this.attemptTotal - $, R = (L, U) => {
        const H = U.map(([V]) => V), F = U.map(([, V]) => V);
        return (L[0] === Math.min(...H) || L[0] === Math.max(...H)) && (L[1] === Math.min(...F) || L[1] === Math.max(...F));
      }, X = (L) => {
        s.forw.splice(0, s.forw.length, ...D.raw[0]), s.bakw.splice(0, s.bakw.length, ...D.raw[1]), g.splice(0, g.length, ...D.gcps), this.edgeNodes.splice(0, this.edgeNodes.length, ...D.edgeNodes), this.supplementRecords = [];
        const U = O(L);
        return { built: U, strict: U.boundary !== void 0 && this.isStrict() };
      }, z = /* @__PURE__ */ new Set(), q = C.boundary.vertices.map(({ forw: L }) => L), Y = new Set(
        q.filter((L) => !R(L, q)).map((L) => Je(L, m.forw))
      );
      try {
        let L = C;
        for (let U = 0; U < no && !(E() + _ >= rs * _); U++) {
          const H = L.boundary.vertices.map(({ forw: G }) => G), F = z.size;
          for (const G of qi(this.tins.forw)) {
            if (R(G, H)) continue;
            const K = Je(G, m.forw);
            for (let Q = -is; Q <= is; Q++) z.add((K + Q + 36) % 36);
          }
          if (z.size === F || z.size >= io) break;
          const V = X({ skipBins: new Set(z) });
          if (!V.built.boundary)
            return B(D), { result: C };
          if (V.strict) {
            let G = { result: V.built, state: I() };
            for (const K of ro(z)) {
              if (!K.some((lt) => Y.has(lt))) continue;
              if (E() >= so * _) break;
              const Q = new Set([...z].filter((lt) => !K.includes(lt))), tt = X({ skipBins: Q });
              if (tt.strict) {
                for (const lt of K) z.delete(lt);
                G = { result: tt.built, state: I() };
              }
            }
            return B(G.state), { result: G.result, kind: "thinned" };
          }
          L = V.built;
        }
        if (E() < rs * _) {
          const U = X({ cornersOnly: !0 });
          if (U.strict) return { result: U.built, kind: "corners" };
        }
      } catch {
      }
      return B(D), { result: C };
    };
    if (n) {
      this.stateTriangle = void 0;
      const C = this.yaxisMode === st.YAXIS_FOLLOW, _ = C ? 1 : -1, O = (R) => this.buildWithSupplements(t, s, g, (X, z, q) => (Y) => ({ boundary: Pn(
        R ? { ...w, ring: R } : w,
        (L) => Yi(L, (U) => {
          const [H, F] = Os(n, U);
          return [H, C ? -F : F];
        }),
        s,
        this.points.length,
        {
          orientation: _,
          accept: (L) => L.hasMapBoundary ? (this.buildTin(s, L.vertices, z, L, Y.size > 0, q), (this.strict_status !== st.STATUS_LOOSE || L.hasBoundary) && Ae(this.tins.forw, _) === 0 && Ae(this.tins.bakw, _) === 0) : !1
        },
        Y,
        X
      ) })), I = this.attemptTotal, B = O(), D = this.attemptTotal - I, { result: { boundary: $ }, kind: E } = S(B, D, O);
      if ($) {
        this.compiledOuter = {
          outerTransform: "worldFile",
          worldFile: n,
          vertices_points: $.vertices.map(({ forw: Y, bakw: L }) => [Y, L])
        };
        const { centroid: R, xy: X, wh: z, kinks: q } = this;
        super.setCompiled(this.getCompiled()), Object.assign(this, { centroid: R, xy: X, wh: z, kinks: q }), this.lastBoundaryDiagnostics = {
          ...$.diagnostics,
          ...E ? { ringRescue: E } : {},
          requestedOuterTransform: "worldFile",
          outerTransform: "worldFile"
        };
        return;
      }
      this.compiledOuter = { outerTransform: "extrapolate" }, this.outerTransform = "extrapolate", this.worldFile = void 0;
    }
    const M = this.vertexMode === st.VERTEX_BIRDEYE ? zi : Li;
    let T, N, P;
    if (e) {
      const C = (B) => this.buildWithSupplements(t, s, g, (D, $, E) => (R) => {
        const X = B ? { ...w, ring: B } : w, z = Pn(
          X,
          M,
          s,
          this.points.length,
          void 0,
          R,
          D
        );
        return {
          boundary: z,
          verticesList: this.buildTin(
            s,
            z?.vertices ?? M(X, !1),
            $,
            z,
            R.size > 0,
            E
          )
        };
      }), _ = this.attemptTotal, O = C(), I = S(O, this.attemptTotal - _, C);
      ({ boundary: T, verticesList: N } = I.result), P = I.kind;
    } else
      N = this.buildTin(
        s,
        M(w, !1),
        t,
        void 0
      );
    this.vertices_params = {
      forw: Fn(N.forw, this.centroid.forw),
      bakw: Fn(N.bakw, this.centroid.bakw)
    }, this.addIndexedTin(), this.pointsWeightBuffer = {}, this.lastBoundaryDiagnostics = T && P ? { ...T.diagnostics, ringRescue: P } : T?.diagnostics, n && this.lastBoundaryDiagnostics && (this.lastBoundaryDiagnostics = {
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
   * 続き番号）。重心・扇形外挿の推定（pointsSetFC・convexBuf）には入れない。loose 指定には足さない
   * （MaplatTin#95）。
   *
   * @param makeAttempt 点群ごとの探索の入れ物と strict の方式・「三角網の向きを読むだけ」（交差を調べない）を
   *   受け取り、`buildWithHull` に渡す試行を返す
   */
  buildWithSupplements(t, e, n, s) {
    let o = 0;
    const i = (w, k, S) => {
      const M = s(w, k, S);
      return (T) => (o++, this.attemptTotal++, M(T));
    }, a = (w) => this.buildWithHull(w, i(/* @__PURE__ */ new Map(), w, !1));
    if (!this.useSupplementPairs || this.useV2Algorithm || t === st.MODE_LOOSE) return a(t);
    const c = t, l = a(c), f = o;
    let h = 0;
    if (!l.boundary || this.strict_status !== st.STATUS_STRICT) return l;
    const u = We(this.tins.forw, this.pointsSet.forw.features, l.boundary.forwHull.all);
    if (u.dropped.length === 0) return l;
    const p = this.edgeNodes.length, b = e.forw.length, v = n.length;
    let x = [], A;
    const y = (w, k) => w.length === k.length && w.every((S, M) => S.every((T, N) => T[0] === k[M][N][0] && T[1] === k[M][N][1])), m = (w) => {
      e.forw.length = b, e.bakw.length = b, n.length = v, this.edgeNodes.length = p;
      for (const [k, S] of w) {
        const M = Kt(k, S, `e${this.edgeNodes.length}`);
        this.edgeNodes.push([k, S]), e.forw.push(M), e.bakw.push(Wt(M)), n.push({ forw: k, bakw: S });
      }
      x = w;
    }, g = Rr({
      edgeBase: p,
      baseCost: f,
      buildCost: () => h,
      snapshot: () => ({ pairs: x, state: this.captureBuild() }),
      restore: ({ pairs: w, state: k }) => {
        m(w), this.restoreBuild(k);
      },
      measure: (w) => {
        m(w);
        const k = this.captureBuild();
        try {
          const S = /* @__PURE__ */ new Map();
          A = { pairs: w, cache: S };
          const { boundary: M } = s(S, st.MODE_STRICT, !0)(/* @__PURE__ */ new Set());
          return M ? We(this.tins.forw, this.pointsSet.forw.features, []) : void 0;
        } finally {
          this.restoreBuild(k);
        }
      },
      build: (w, k) => {
        m(w);
        const S = A && y(A.pairs, w) ? A.cache : /* @__PURE__ */ new Map(), M = o;
        let T;
        try {
          T = this.buildWithHull(c, (N) => {
            if (o - M >= k) throw os;
            return i(S, c, !1)(N);
          });
        } catch (N) {
          if (N !== os) throw N;
          h += o - M;
          return;
        }
        if (h += o - M, !(!T.boundary || this.strict_status !== st.STATUS_STRICT))
          return {
            result: T,
            analysis: We(this.tins.forw, this.pointsSet.forw.features, T.boundary.forwHull.all)
          };
      }
    }, { result: l, analysis: u });
    return this.supplementRecords = g.records, this.lastSupplementDiagnostics = g.diagnostics, g.result;
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
    const o = (v) => [...v].sort().join(","), i = (v, x = !1) => {
      const A = o(v), y = n.get(A);
      if (y) return y;
      const m = e(v), d = {
        value: m,
        strict: m.boundary !== void 0 && this.strict_status === st.STATUS_STRICT
      };
      return (d.strict || x) && (d.state = this.captureBuild()), n.set(A, d), s = d, d;
    }, a = (v) => (s !== v && this.restoreBuild(v.state), s = v, v.value), c = i(/* @__PURE__ */ new Set(), !0);
    if (!(t === st.MODE_STRICT || t === st.MODE_AUTO) || !c.value.boundary || c.strict) return c.value;
    const f = new Set(c.value.boundary.forwHull.all.map(Me)), h = () => this.pointsSet.forw.features.map(
      (v) => v.properties.target.index
    ), u = /* @__PURE__ */ new Set();
    let p = c, b;
    for (let v = 0; v < eo; v++) {
      const x = _r(
        this.tins.forw,
        p.value.boundary.forwHull.applied,
        h()
      ).filter((A) => !u.has(Me(A)));
      if (x.length === 0) break;
      for (const A of x) u.add(Me(A));
      if (p = i(u), !p.value.boundary) break;
      if (p.strict) {
        b = p;
        break;
      }
    }
    if (b) {
      let v = b;
      for (const x of [...u].slice(0, oo)) {
        const A = new Set(u);
        A.delete(x);
        const y = i(A);
        y.strict && (u.delete(x), v = y);
      }
      return a(v);
    }
    if (u.size < f.size) {
      const v = i(f);
      if (v.strict) return a(v);
    }
    return a(c);
  }
  /** 今の三角網が strict か（組み立ての途中で `strict_status` が変わるので、型の絞り込みを避けて読む）。 */
  isStrict() {
    return this.strict_status === st.STATUS_STRICT;
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
  buildTin(t, e, n, s, o = !1, i = !1) {
    const a = {
      forw: [],
      bakw: []
    };
    for (let c = 0; c < e.length; c++) {
      const l = e[c].forw, f = e[c].bakw, h = Kt(l, f, `b${c}`), u = Wt(h);
      a.forw.push(h), a.bakw.push(u);
    }
    return this.pointsSet = {
      forw: St([...t.forw, ...a.forw]),
      bakw: St([...t.bakw, ...a.bakw]),
      edges: t.edges
    }, this.tins = {
      forw: hn(
        s?.forw ?? ve(this.pointsSet.forw, t.edges, "target")
      )
    }, (n === st.MODE_STRICT || n === st.MODE_AUTO) && (i ? this.resolveStrictOverlaps() : this.calculateStrictTin(
      n === st.MODE_AUTO || o ? 1 : Xn
    )), (n === st.MODE_LOOSE || n === st.MODE_AUTO && this.strict_status === st.STATUS_ERROR) && (this.tins.bakw = hn(
      s?.bakw ?? ve(this.pointsSet.bakw, t.edges, "target")
    ), delete this.kinks, this.strict_status = st.STATUS_LOOSE), a;
  }
  /**
   * 非同期ラッパーを提供します。
   * 互換性のために Promise ベースの API を維持しますが、内部処理は同期的です。
   */
  async updateTinAsync() {
    this.updateTin();
  }
}
function ao(r, t, e) {
  const n = (s) => Number.isInteger(s) && s >= 0 && s < t;
  if (!Array.isArray(r) || !n(r[0]) || !n(r[1]))
    throw new Error(
      `Invalid edge at edges[${e}]: start/end ${JSON.stringify(r)} must be integer indices of points (0 to ${t - 1})`
    );
}
export {
  _e as BOUNDARY_GROUP,
  rn as EDGE_HULL,
  Jn as EDGE_PROTECT,
  Ut as EDGE_REQUIRED,
  Lr as IncrementalMesh,
  zr as MeshModel,
  st as Tin,
  ve as constrainedTin,
  Wt as counterPoint,
  Kt as createPoint,
  st as default,
  lo as findIntersections,
  ns as format_version,
  Wr as insertEdge,
  Gr as insertPoint,
  ps as insertSearchIndex,
  Yr as meshFromCompiled,
  jr as movePoint,
  Hr as removeEdge,
  Kr as removePoint,
  Jr as replaceEdgeNodes,
  Fn as vertexCalc
};
