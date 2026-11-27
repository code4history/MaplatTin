function oe(e, t, n = {}) {
  const i = { type: "Feature" };
  return (n.id === 0 || n.id) && (i.id = n.id), n.bbox && (i.bbox = n.bbox), i.properties = t || {}, i.geometry = e, i;
}
function Yt(e, t, n = {}) {
  if (!e)
    throw new Error("coordinates is required");
  if (!Array.isArray(e))
    throw new Error("coordinates must be an Array");
  if (e.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!We(e[0]) || !We(e[1]))
    throw new Error("coordinates must contain numbers");
  return oe({
    type: "Point",
    coordinates: e
  }, t, n);
}
function le(e, t, n = {}) {
  for (const o of e) {
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
  return oe({
    type: "Polygon",
    coordinates: e
  }, t, n);
}
function He(e, t, n = {}) {
  if (e.length < 2)
    throw new Error("coordinates must be an array of two or more positions");
  return oe({
    type: "LineString",
    coordinates: e
  }, t, n);
}
function St(e, t = {}) {
  const n = { type: "FeatureCollection" };
  return t.id && (n.id = t.id), t.bbox && (n.bbox = t.bbox), n.features = e, n;
}
function We(e) {
  return !isNaN(e) && e !== null && !Array.isArray(e);
}
function ii(e) {
  if (!e)
    throw new Error("coord is required");
  if (!Array.isArray(e)) {
    if (e.type === "Feature" && e.geometry !== null && e.geometry.type === "Point")
      return [...e.geometry.coordinates];
    if (e.type === "Point")
      return [...e.coordinates];
  }
  if (Array.isArray(e) && e.length >= 2 && !Array.isArray(e[0]) && !Array.isArray(e[1]))
    return [...e];
  throw new Error("coord must be GeoJSON Point or an Array of numbers");
}
function ri(e) {
  return e.type === "Feature" ? e.geometry : e;
}
function ze(e, t, n) {
  if (e !== null)
    for (var i, o, r, s, a, c, h, f = 0, l = 0, u, p = e.type, _ = p === "FeatureCollection", w = p === "Feature", O = _ ? e.features.length : 1, M = 0; M < O; M++) {
      h = _ ? (
        // @ts-expect-error: Known type conflict
        e.features[M].geometry
      ) : w ? (
        // @ts-expect-error: Known type conflict
        e.geometry
      ) : e, u = h ? h.type === "GeometryCollection" : !1, a = u ? h.geometries.length : 1;
      for (var m = 0; m < a; m++) {
        var v = 0, d = 0;
        if (s = u ? h.geometries[m] : h, s !== null) {
          c = s.coordinates;
          var b = s.type;
          switch (f = n && (b === "Polygon" || b === "MultiPolygon") ? 1 : 0, b) {
            case null:
              break;
            case "Point":
              if (
                // @ts-expect-error: Known type conflict
                t(
                  c,
                  l,
                  M,
                  v,
                  d
                ) === !1
              )
                return !1;
              l++, v++;
              break;
            case "LineString":
            case "MultiPoint":
              for (i = 0; i < c.length; i++) {
                if (
                  // @ts-expect-error: Known type conflict
                  t(
                    c[i],
                    l,
                    M,
                    v,
                    d
                  ) === !1
                )
                  return !1;
                l++, b === "MultiPoint" && v++;
              }
              b === "LineString" && v++;
              break;
            case "Polygon":
            case "MultiLineString":
              for (i = 0; i < c.length; i++) {
                for (o = 0; o < c[i].length - f; o++) {
                  if (
                    // @ts-expect-error: Known type conflict
                    t(
                      c[i][o],
                      l,
                      M,
                      v,
                      d
                    ) === !1
                  )
                    return !1;
                  l++;
                }
                b === "MultiLineString" && v++, b === "Polygon" && d++;
              }
              b === "Polygon" && v++;
              break;
            case "MultiPolygon":
              for (i = 0; i < c.length; i++) {
                for (d = 0, o = 0; o < c[i].length; o++) {
                  for (r = 0; r < c[i][o].length - f; r++) {
                    if (
                      // @ts-expect-error: Known type conflict
                      t(
                        c[i][o][r],
                        l,
                        M,
                        v,
                        d
                      ) === !1
                    )
                      return !1;
                    l++;
                  }
                  d++;
                }
                v++;
              }
              break;
            case "GeometryCollection":
              for (i = 0; i < s.geometries.length; i++)
                if (
                  // @ts-expect-error: Known type conflict
                  ze(s.geometries[i], t, n) === !1
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
const pt = 11102230246251565e-32, j = 134217729, Yn = (3 + 8 * pt) * pt;
function ft(e, t, n, i, o) {
  let r, s, a, c, h = t[0], f = i[0], l = 0, u = 0;
  f > h == f > -h ? (r = h, h = t[++l]) : (r = f, f = i[++u]);
  let p = 0;
  if (l < e && u < n)
    for (f > h == f > -h ? (s = h + r, a = r - (s - h), h = t[++l]) : (s = f + r, a = r - (s - f), f = i[++u]), r = s, a !== 0 && (o[p++] = a); l < e && u < n; )
      f > h == f > -h ? (s = r + h, c = s - r, a = r - (s - c) + (h - c), h = t[++l]) : (s = r + f, c = s - r, a = r - (s - c) + (f - c), f = i[++u]), r = s, a !== 0 && (o[p++] = a);
  for (; l < e; )
    s = r + h, c = s - r, a = r - (s - c) + (h - c), h = t[++l], r = s, a !== 0 && (o[p++] = a);
  for (; u < n; )
    s = r + f, c = s - r, a = r - (s - c) + (f - c), f = i[++u], r = s, a !== 0 && (o[p++] = a);
  return (r !== 0 || p === 0) && (o[p++] = r), p;
}
function _t(e, t, n, i, o, r, s, a) {
  return ft(ft(e, t, n, i, s), s, o, r, a);
}
function Y(e, t, n, i) {
  let o, r, s, a, c, h, f, l, u, p, _;
  f = j * n, p = f - (f - n), _ = n - p;
  let w = t[0];
  o = w * n, f = j * w, l = f - (f - w), u = w - l, s = u * _ - (o - l * p - u * p - l * _);
  let O = 0;
  s !== 0 && (i[O++] = s);
  for (let M = 1; M < e; M++)
    w = t[M], a = w * n, f = j * w, l = f - (f - w), u = w - l, c = u * _ - (a - l * p - u * p - l * _), r = o + c, h = r - o, s = o - (r - h) + (c - h), s !== 0 && (i[O++] = s), o = a + r, s = r - (o - a), s !== 0 && (i[O++] = s);
  return (o !== 0 || O === 0) && (i[O++] = o), O;
}
function Ln(e, t) {
  let n = t[0];
  for (let i = 1; i < e; i++) n += t[i];
  return n;
}
function tt(e) {
  return new Float64Array(e);
}
const oi = (3 + 16 * pt) * pt, si = (2 + 12 * pt) * pt, ai = (9 + 64 * pt) * pt * pt, zt = tt(4), Ze = tt(8), tn = tt(12), en = tt(16), mt = tt(4);
function ci(e, t, n, i, o, r, s) {
  let a, c, h, f, l, u, p, _, w, O, M, m, v, d, b, g, E, S;
  const k = e - o, P = n - o, N = t - r, C = i - r;
  d = k * C, u = j * k, p = u - (u - k), _ = k - p, u = j * C, w = u - (u - C), O = C - w, b = _ * O - (d - p * w - _ * w - p * O), g = N * P, u = j * N, p = u - (u - N), _ = N - p, u = j * P, w = u - (u - P), O = P - w, E = _ * O - (g - p * w - _ * w - p * O), M = b - E, l = b - M, zt[0] = b - (M + l) + (l - E), m = d + M, l = m - d, v = d - (m - l) + (M - l), M = v - g, l = v - M, zt[1] = v - (M + l) + (l - g), S = m + M, l = S - m, zt[2] = m - (S - l) + (M - l), zt[3] = S;
  let F = Ln(4, zt), y = si * s;
  if (F >= y || -F >= y || (l = e - k, a = e - (k + l) + (l - o), l = n - P, h = n - (P + l) + (l - o), l = t - N, c = t - (N + l) + (l - r), l = i - C, f = i - (C + l) + (l - r), a === 0 && c === 0 && h === 0 && f === 0) || (y = ai * s + Yn * Math.abs(F), F += k * f + C * a - (N * h + P * c), F >= y || -F >= y)) return F;
  d = a * C, u = j * a, p = u - (u - a), _ = a - p, u = j * C, w = u - (u - C), O = C - w, b = _ * O - (d - p * w - _ * w - p * O), g = c * P, u = j * c, p = u - (u - c), _ = c - p, u = j * P, w = u - (u - P), O = P - w, E = _ * O - (g - p * w - _ * w - p * O), M = b - E, l = b - M, mt[0] = b - (M + l) + (l - E), m = d + M, l = m - d, v = d - (m - l) + (M - l), M = v - g, l = v - M, mt[1] = v - (M + l) + (l - g), S = m + M, l = S - m, mt[2] = m - (S - l) + (M - l), mt[3] = S;
  const I = ft(4, zt, 4, mt, Ze);
  d = k * f, u = j * k, p = u - (u - k), _ = k - p, u = j * f, w = u - (u - f), O = f - w, b = _ * O - (d - p * w - _ * w - p * O), g = N * h, u = j * N, p = u - (u - N), _ = N - p, u = j * h, w = u - (u - h), O = h - w, E = _ * O - (g - p * w - _ * w - p * O), M = b - E, l = b - M, mt[0] = b - (M + l) + (l - E), m = d + M, l = m - d, v = d - (m - l) + (M - l), M = v - g, l = v - M, mt[1] = v - (M + l) + (l - g), S = m + M, l = S - m, mt[2] = m - (S - l) + (M - l), mt[3] = S;
  const A = ft(I, Ze, 4, mt, tn);
  d = a * f, u = j * a, p = u - (u - a), _ = a - p, u = j * f, w = u - (u - f), O = f - w, b = _ * O - (d - p * w - _ * w - p * O), g = c * h, u = j * c, p = u - (u - c), _ = c - p, u = j * h, w = u - (u - h), O = h - w, E = _ * O - (g - p * w - _ * w - p * O), M = b - E, l = b - M, mt[0] = b - (M + l) + (l - E), m = d + M, l = m - d, v = d - (m - l) + (M - l), M = v - g, l = v - M, mt[1] = v - (M + l) + (l - g), S = m + M, l = S - m, mt[2] = m - (S - l) + (M - l), mt[3] = S;
  const T = ft(A, tn, 4, mt, en);
  return en[T - 1];
}
function Ot(e, t, n, i, o, r) {
  const s = (t - r) * (n - o), a = (e - o) * (i - r), c = s - a, h = Math.abs(s + a);
  return Math.abs(c) >= oi * h ? c : -ci(e, t, n, i, o, r, h);
}
const li = (10 + 96 * pt) * pt, hi = (4 + 48 * pt) * pt, fi = (44 + 576 * pt) * pt * pt, Xt = tt(4), Dt = tt(4), $t = tt(4), Et = tt(4), kt = tt(4), At = tt(4), gt = tt(4), wt = tt(4), Oe = tt(8), Pe = tt(8), Ne = tt(8), Be = tt(8), Te = tt(8), Ce = tt(8), ue = tt(8), de = tt(8), pe = tt(8), Lt = tt(4), Vt = tt(4), Ut = tt(4), z = tt(8), K = tt(16), nt = tt(16), it = tt(16), et = tt(32), Ft = tt(32), at = tt(48), bt = tt(64);
let Qt = tt(1152), Xe = tt(1152);
function ct(e, t, n) {
  e = ft(e, Qt, t, n, Xe);
  const i = Qt;
  return Qt = Xe, Xe = i, e;
}
function ui(e, t, n, i, o, r, s, a, c) {
  let h, f, l, u, p, _, w, O, M, m, v, d, b, g, E, S, k, P, N, C, F, y, I, A, T, X, $, x, B, D, R, L, V, q, U;
  const G = e - s, J = n - s, Q = o - s, H = t - a, Z = i - a, W = r - a;
  R = J * W, I = j * J, A = I - (I - J), T = J - A, I = j * W, X = I - (I - W), $ = W - X, L = T * $ - (R - A * X - T * X - A * $), V = Q * Z, I = j * Q, A = I - (I - Q), T = Q - A, I = j * Z, X = I - (I - Z), $ = Z - X, q = T * $ - (V - A * X - T * X - A * $), x = L - q, y = L - x, Xt[0] = L - (x + y) + (y - q), B = R + x, y = B - R, D = R - (B - y) + (x - y), x = D - V, y = D - x, Xt[1] = D - (x + y) + (y - V), U = B + x, y = U - B, Xt[2] = B - (U - y) + (x - y), Xt[3] = U, R = Q * H, I = j * Q, A = I - (I - Q), T = Q - A, I = j * H, X = I - (I - H), $ = H - X, L = T * $ - (R - A * X - T * X - A * $), V = G * W, I = j * G, A = I - (I - G), T = G - A, I = j * W, X = I - (I - W), $ = W - X, q = T * $ - (V - A * X - T * X - A * $), x = L - q, y = L - x, Dt[0] = L - (x + y) + (y - q), B = R + x, y = B - R, D = R - (B - y) + (x - y), x = D - V, y = D - x, Dt[1] = D - (x + y) + (y - V), U = B + x, y = U - B, Dt[2] = B - (U - y) + (x - y), Dt[3] = U, R = G * Z, I = j * G, A = I - (I - G), T = G - A, I = j * Z, X = I - (I - Z), $ = Z - X, L = T * $ - (R - A * X - T * X - A * $), V = J * H, I = j * J, A = I - (I - J), T = J - A, I = j * H, X = I - (I - H), $ = H - X, q = T * $ - (V - A * X - T * X - A * $), x = L - q, y = L - x, $t[0] = L - (x + y) + (y - q), B = R + x, y = B - R, D = R - (B - y) + (x - y), x = D - V, y = D - x, $t[1] = D - (x + y) + (y - V), U = B + x, y = U - B, $t[2] = B - (U - y) + (x - y), $t[3] = U, h = ft(
    ft(
      ft(
        Y(Y(4, Xt, G, z), z, G, K),
        K,
        Y(Y(4, Xt, H, z), z, H, nt),
        nt,
        et
      ),
      et,
      ft(
        Y(Y(4, Dt, J, z), z, J, K),
        K,
        Y(Y(4, Dt, Z, z), z, Z, nt),
        nt,
        Ft
      ),
      Ft,
      bt
    ),
    bt,
    ft(
      Y(Y(4, $t, Q, z), z, Q, K),
      K,
      Y(Y(4, $t, W, z), z, W, nt),
      nt,
      et
    ),
    et,
    Qt
  );
  let st = Ln(h, Qt), ht = hi * c;
  if (st >= ht || -st >= ht || (y = e - G, f = e - (G + y) + (y - s), y = t - H, p = t - (H + y) + (y - a), y = n - J, l = n - (J + y) + (y - s), y = i - Z, _ = i - (Z + y) + (y - a), y = o - Q, u = o - (Q + y) + (y - s), y = r - W, w = r - (W + y) + (y - a), f === 0 && l === 0 && u === 0 && p === 0 && _ === 0 && w === 0) || (ht = fi * c + Yn * Math.abs(st), st += (G * G + H * H) * (J * w + W * l - (Z * u + Q * _)) + 2 * (G * f + H * p) * (J * W - Z * Q) + ((J * J + Z * Z) * (Q * p + H * u - (W * f + G * w)) + 2 * (J * l + Z * _) * (Q * H - W * G)) + ((Q * Q + W * W) * (G * _ + Z * f - (H * l + J * p)) + 2 * (Q * u + W * w) * (G * Z - H * J)), st >= ht || -st >= ht))
    return st;
  if ((l !== 0 || _ !== 0 || u !== 0 || w !== 0) && (R = G * G, I = j * G, A = I - (I - G), T = G - A, L = T * T - (R - A * A - (A + A) * T), V = H * H, I = j * H, A = I - (I - H), T = H - A, q = T * T - (V - A * A - (A + A) * T), x = L + q, y = x - L, Et[0] = L - (x - y) + (q - y), B = R + x, y = B - R, D = R - (B - y) + (x - y), x = D + V, y = x - D, Et[1] = D - (x - y) + (V - y), U = B + x, y = U - B, Et[2] = B - (U - y) + (x - y), Et[3] = U), (u !== 0 || w !== 0 || f !== 0 || p !== 0) && (R = J * J, I = j * J, A = I - (I - J), T = J - A, L = T * T - (R - A * A - (A + A) * T), V = Z * Z, I = j * Z, A = I - (I - Z), T = Z - A, q = T * T - (V - A * A - (A + A) * T), x = L + q, y = x - L, kt[0] = L - (x - y) + (q - y), B = R + x, y = B - R, D = R - (B - y) + (x - y), x = D + V, y = x - D, kt[1] = D - (x - y) + (V - y), U = B + x, y = U - B, kt[2] = B - (U - y) + (x - y), kt[3] = U), (f !== 0 || p !== 0 || l !== 0 || _ !== 0) && (R = Q * Q, I = j * Q, A = I - (I - Q), T = Q - A, L = T * T - (R - A * A - (A + A) * T), V = W * W, I = j * W, A = I - (I - W), T = W - A, q = T * T - (V - A * A - (A + A) * T), x = L + q, y = x - L, At[0] = L - (x - y) + (q - y), B = R + x, y = B - R, D = R - (B - y) + (x - y), x = D + V, y = x - D, At[1] = D - (x - y) + (V - y), U = B + x, y = U - B, At[2] = B - (U - y) + (x - y), At[3] = U), f !== 0 && (O = Y(4, Xt, f, Oe), h = ct(h, _t(
    Y(O, Oe, 2 * G, K),
    K,
    Y(Y(4, At, f, z), z, Z, nt),
    nt,
    Y(Y(4, kt, f, z), z, -W, it),
    it,
    et,
    at
  ), at)), p !== 0 && (M = Y(4, Xt, p, Pe), h = ct(h, _t(
    Y(M, Pe, 2 * H, K),
    K,
    Y(Y(4, kt, p, z), z, Q, nt),
    nt,
    Y(Y(4, At, p, z), z, -J, it),
    it,
    et,
    at
  ), at)), l !== 0 && (m = Y(4, Dt, l, Ne), h = ct(h, _t(
    Y(m, Ne, 2 * J, K),
    K,
    Y(Y(4, Et, l, z), z, W, nt),
    nt,
    Y(Y(4, At, l, z), z, -H, it),
    it,
    et,
    at
  ), at)), _ !== 0 && (v = Y(4, Dt, _, Be), h = ct(h, _t(
    Y(v, Be, 2 * Z, K),
    K,
    Y(Y(4, At, _, z), z, G, nt),
    nt,
    Y(Y(4, Et, _, z), z, -Q, it),
    it,
    et,
    at
  ), at)), u !== 0 && (d = Y(4, $t, u, Te), h = ct(h, _t(
    Y(d, Te, 2 * Q, K),
    K,
    Y(Y(4, kt, u, z), z, H, nt),
    nt,
    Y(Y(4, Et, u, z), z, -Z, it),
    it,
    et,
    at
  ), at)), w !== 0 && (b = Y(4, $t, w, Ce), h = ct(h, _t(
    Y(b, Ce, 2 * W, K),
    K,
    Y(Y(4, Et, w, z), z, J, nt),
    nt,
    Y(Y(4, kt, w, z), z, -G, it),
    it,
    et,
    at
  ), at)), f !== 0 || p !== 0) {
    if (l !== 0 || _ !== 0 || u !== 0 || w !== 0 ? (R = l * W, I = j * l, A = I - (I - l), T = l - A, I = j * W, X = I - (I - W), $ = W - X, L = T * $ - (R - A * X - T * X - A * $), V = J * w, I = j * J, A = I - (I - J), T = J - A, I = j * w, X = I - (I - w), $ = w - X, q = T * $ - (V - A * X - T * X - A * $), x = L + q, y = x - L, gt[0] = L - (x - y) + (q - y), B = R + x, y = B - R, D = R - (B - y) + (x - y), x = D + V, y = x - D, gt[1] = D - (x - y) + (V - y), U = B + x, y = U - B, gt[2] = B - (U - y) + (x - y), gt[3] = U, R = u * -Z, I = j * u, A = I - (I - u), T = u - A, I = j * -Z, X = I - (I - -Z), $ = -Z - X, L = T * $ - (R - A * X - T * X - A * $), V = Q * -_, I = j * Q, A = I - (I - Q), T = Q - A, I = j * -_, X = I - (I - -_), $ = -_ - X, q = T * $ - (V - A * X - T * X - A * $), x = L + q, y = x - L, wt[0] = L - (x - y) + (q - y), B = R + x, y = B - R, D = R - (B - y) + (x - y), x = D + V, y = x - D, wt[1] = D - (x - y) + (V - y), U = B + x, y = U - B, wt[2] = B - (U - y) + (x - y), wt[3] = U, E = ft(4, gt, 4, wt, de), R = l * w, I = j * l, A = I - (I - l), T = l - A, I = j * w, X = I - (I - w), $ = w - X, L = T * $ - (R - A * X - T * X - A * $), V = u * _, I = j * u, A = I - (I - u), T = u - A, I = j * _, X = I - (I - _), $ = _ - X, q = T * $ - (V - A * X - T * X - A * $), x = L - q, y = L - x, Vt[0] = L - (x + y) + (y - q), B = R + x, y = B - R, D = R - (B - y) + (x - y), x = D - V, y = D - x, Vt[1] = D - (x + y) + (y - V), U = B + x, y = U - B, Vt[2] = B - (U - y) + (x - y), Vt[3] = U, P = 4) : (de[0] = 0, E = 1, Vt[0] = 0, P = 1), f !== 0) {
      const rt = Y(E, de, f, it);
      h = ct(h, ft(
        Y(O, Oe, f, K),
        K,
        Y(rt, it, 2 * G, et),
        et,
        at
      ), at);
      const ot = Y(P, Vt, f, z);
      h = ct(h, _t(
        Y(ot, z, 2 * G, K),
        K,
        Y(ot, z, f, nt),
        nt,
        Y(rt, it, f, et),
        et,
        Ft,
        bt
      ), bt), _ !== 0 && (h = ct(h, Y(Y(4, At, f, z), z, _, K), K)), w !== 0 && (h = ct(h, Y(Y(4, kt, -f, z), z, w, K), K));
    }
    if (p !== 0) {
      const rt = Y(E, de, p, it);
      h = ct(h, ft(
        Y(M, Pe, p, K),
        K,
        Y(rt, it, 2 * H, et),
        et,
        at
      ), at);
      const ot = Y(P, Vt, p, z);
      h = ct(h, _t(
        Y(ot, z, 2 * H, K),
        K,
        Y(ot, z, p, nt),
        nt,
        Y(rt, it, p, et),
        et,
        Ft,
        bt
      ), bt);
    }
  }
  if (l !== 0 || _ !== 0) {
    if (u !== 0 || w !== 0 || f !== 0 || p !== 0 ? (R = u * H, I = j * u, A = I - (I - u), T = u - A, I = j * H, X = I - (I - H), $ = H - X, L = T * $ - (R - A * X - T * X - A * $), V = Q * p, I = j * Q, A = I - (I - Q), T = Q - A, I = j * p, X = I - (I - p), $ = p - X, q = T * $ - (V - A * X - T * X - A * $), x = L + q, y = x - L, gt[0] = L - (x - y) + (q - y), B = R + x, y = B - R, D = R - (B - y) + (x - y), x = D + V, y = x - D, gt[1] = D - (x - y) + (V - y), U = B + x, y = U - B, gt[2] = B - (U - y) + (x - y), gt[3] = U, C = -W, F = -w, R = f * C, I = j * f, A = I - (I - f), T = f - A, I = j * C, X = I - (I - C), $ = C - X, L = T * $ - (R - A * X - T * X - A * $), V = G * F, I = j * G, A = I - (I - G), T = G - A, I = j * F, X = I - (I - F), $ = F - X, q = T * $ - (V - A * X - T * X - A * $), x = L + q, y = x - L, wt[0] = L - (x - y) + (q - y), B = R + x, y = B - R, D = R - (B - y) + (x - y), x = D + V, y = x - D, wt[1] = D - (x - y) + (V - y), U = B + x, y = U - B, wt[2] = B - (U - y) + (x - y), wt[3] = U, S = ft(4, gt, 4, wt, pe), R = u * p, I = j * u, A = I - (I - u), T = u - A, I = j * p, X = I - (I - p), $ = p - X, L = T * $ - (R - A * X - T * X - A * $), V = f * w, I = j * f, A = I - (I - f), T = f - A, I = j * w, X = I - (I - w), $ = w - X, q = T * $ - (V - A * X - T * X - A * $), x = L - q, y = L - x, Ut[0] = L - (x + y) + (y - q), B = R + x, y = B - R, D = R - (B - y) + (x - y), x = D - V, y = D - x, Ut[1] = D - (x + y) + (y - V), U = B + x, y = U - B, Ut[2] = B - (U - y) + (x - y), Ut[3] = U, N = 4) : (pe[0] = 0, S = 1, Ut[0] = 0, N = 1), l !== 0) {
      const rt = Y(S, pe, l, it);
      h = ct(h, ft(
        Y(m, Ne, l, K),
        K,
        Y(rt, it, 2 * J, et),
        et,
        at
      ), at);
      const ot = Y(N, Ut, l, z);
      h = ct(h, _t(
        Y(ot, z, 2 * J, K),
        K,
        Y(ot, z, l, nt),
        nt,
        Y(rt, it, l, et),
        et,
        Ft,
        bt
      ), bt), w !== 0 && (h = ct(h, Y(Y(4, Et, l, z), z, w, K), K)), p !== 0 && (h = ct(h, Y(Y(4, At, -l, z), z, p, K), K));
    }
    if (_ !== 0) {
      const rt = Y(S, pe, _, it);
      h = ct(h, ft(
        Y(v, Be, _, K),
        K,
        Y(rt, it, 2 * Z, et),
        et,
        at
      ), at);
      const ot = Y(N, Ut, _, z);
      h = ct(h, _t(
        Y(ot, z, 2 * Z, K),
        K,
        Y(ot, z, _, nt),
        nt,
        Y(rt, it, _, et),
        et,
        Ft,
        bt
      ), bt);
    }
  }
  if (u !== 0 || w !== 0) {
    if (f !== 0 || p !== 0 || l !== 0 || _ !== 0 ? (R = f * Z, I = j * f, A = I - (I - f), T = f - A, I = j * Z, X = I - (I - Z), $ = Z - X, L = T * $ - (R - A * X - T * X - A * $), V = G * _, I = j * G, A = I - (I - G), T = G - A, I = j * _, X = I - (I - _), $ = _ - X, q = T * $ - (V - A * X - T * X - A * $), x = L + q, y = x - L, gt[0] = L - (x - y) + (q - y), B = R + x, y = B - R, D = R - (B - y) + (x - y), x = D + V, y = x - D, gt[1] = D - (x - y) + (V - y), U = B + x, y = U - B, gt[2] = B - (U - y) + (x - y), gt[3] = U, C = -H, F = -p, R = l * C, I = j * l, A = I - (I - l), T = l - A, I = j * C, X = I - (I - C), $ = C - X, L = T * $ - (R - A * X - T * X - A * $), V = J * F, I = j * J, A = I - (I - J), T = J - A, I = j * F, X = I - (I - F), $ = F - X, q = T * $ - (V - A * X - T * X - A * $), x = L + q, y = x - L, wt[0] = L - (x - y) + (q - y), B = R + x, y = B - R, D = R - (B - y) + (x - y), x = D + V, y = x - D, wt[1] = D - (x - y) + (V - y), U = B + x, y = U - B, wt[2] = B - (U - y) + (x - y), wt[3] = U, g = ft(4, gt, 4, wt, ue), R = f * _, I = j * f, A = I - (I - f), T = f - A, I = j * _, X = I - (I - _), $ = _ - X, L = T * $ - (R - A * X - T * X - A * $), V = l * p, I = j * l, A = I - (I - l), T = l - A, I = j * p, X = I - (I - p), $ = p - X, q = T * $ - (V - A * X - T * X - A * $), x = L - q, y = L - x, Lt[0] = L - (x + y) + (y - q), B = R + x, y = B - R, D = R - (B - y) + (x - y), x = D - V, y = D - x, Lt[1] = D - (x + y) + (y - V), U = B + x, y = U - B, Lt[2] = B - (U - y) + (x - y), Lt[3] = U, k = 4) : (ue[0] = 0, g = 1, Lt[0] = 0, k = 1), u !== 0) {
      const rt = Y(g, ue, u, it);
      h = ct(h, ft(
        Y(d, Te, u, K),
        K,
        Y(rt, it, 2 * Q, et),
        et,
        at
      ), at);
      const ot = Y(k, Lt, u, z);
      h = ct(h, _t(
        Y(ot, z, 2 * Q, K),
        K,
        Y(ot, z, u, nt),
        nt,
        Y(rt, it, u, et),
        et,
        Ft,
        bt
      ), bt), p !== 0 && (h = ct(h, Y(Y(4, kt, u, z), z, p, K), K)), _ !== 0 && (h = ct(h, Y(Y(4, Et, -u, z), z, _, K), K));
    }
    if (w !== 0) {
      const rt = Y(g, ue, w, it);
      h = ct(h, ft(
        Y(b, Ce, w, K),
        K,
        Y(rt, it, 2 * W, et),
        et,
        at
      ), at);
      const ot = Y(k, Lt, w, z);
      h = ct(h, _t(
        Y(ot, z, 2 * W, K),
        K,
        Y(ot, z, w, nt),
        nt,
        Y(rt, it, w, et),
        et,
        Ft,
        bt
      ), bt);
    }
  }
  return Qt[h - 1];
}
function di(e, t, n, i, o, r, s, a) {
  const c = e - s, h = n - s, f = o - s, l = t - a, u = i - a, p = r - a, _ = h * p, w = f * u, O = c * c + l * l, M = f * l, m = c * p, v = h * h + u * u, d = c * u, b = h * l, g = f * f + p * p, E = O * (_ - w) + v * (M - m) + g * (d - b), S = (Math.abs(_) + Math.abs(w)) * O + (Math.abs(M) + Math.abs(m)) * v + (Math.abs(d) + Math.abs(b)) * g, k = li * S;
  return E > k || -E > k ? E : ui(e, t, n, i, o, r, s, a, S);
}
function pi(e, t) {
  var n, i, o = 0, r, s, a, c, h, f, l, u = e[0], p = e[1], _ = t.length;
  for (n = 0; n < _; n++) {
    i = 0;
    var w = t[n], O = w.length - 1;
    if (f = w[0], f[0] !== w[O][0] && f[1] !== w[O][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (s = f[0] - u, a = f[1] - p, i; i < O; i++) {
      if (l = w[i + 1], c = l[0] - u, h = l[1] - p, a === 0 && h === 0) {
        if (c <= 0 && s >= 0 || s <= 0 && c >= 0)
          return 0;
      } else if (h >= 0 && a <= 0 || h <= 0 && a >= 0) {
        if (r = Ot(s, c, a, h, 0, 0), r === 0)
          return 0;
        (r > 0 && h > 0 && a <= 0 || r < 0 && h <= 0 && a > 0) && o++;
      }
      f = l, a = h, s = c;
    }
  }
  return o % 2 !== 0;
}
function De(e, t, n = {}) {
  if (!e)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const i = ii(e), o = ri(t), r = o.type, s = t.bbox;
  let a = o.coordinates;
  if (s && mi(i, s) === !1)
    return !1;
  r === "Polygon" && (a = [a]);
  for (var c = 0; c < a.length; ++c) {
    const h = pi(i, a[c]);
    if (h === 0 && !n.ignoreBoundary) return !0;
    if (h) return !0;
  }
  return !1;
}
function mi(e, t) {
  return t[0] <= e[0] && t[1] <= e[1] && t[2] >= e[0] && t[3] >= e[1];
}
class Je {
  constructor(t = [], n = gi) {
    if (this.data = t, this.length = this.data.length, this.compare = n, this.length > 0)
      for (let i = (this.length >> 1) - 1; i >= 0; i--) this._down(i);
  }
  push(t) {
    this.data.push(t), this.length++, this._up(this.length - 1);
  }
  pop() {
    if (this.length === 0) return;
    const t = this.data[0], n = this.data.pop();
    return this.length--, this.length > 0 && (this.data[0] = n, this._down(0)), t;
  }
  peek() {
    return this.data[0];
  }
  _up(t) {
    const { data: n, compare: i } = this, o = n[t];
    for (; t > 0; ) {
      const r = t - 1 >> 1, s = n[r];
      if (i(o, s) >= 0) break;
      n[t] = s, t = r;
    }
    n[t] = o;
  }
  _down(t) {
    const { data: n, compare: i } = this, o = this.length >> 1, r = n[t];
    for (; t < o; ) {
      let s = (t << 1) + 1, a = n[s];
      const c = s + 1;
      if (c < this.length && i(n[c], a) < 0 && (s = c, a = n[c]), i(a, r) >= 0) break;
      n[t] = a, t = s;
    }
    n[t] = r;
  }
}
function gi(e, t) {
  return e < t ? -1 : e > t ? 1 : 0;
}
const wi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Je
}, Symbol.toStringTag, { value: "Module" })), Bt = 11102230246251565e-32, ut = 134217729, yi = (3 + 8 * Bt) * Bt;
function $e(e, t, n, i, o) {
  let r, s, a, c, h = t[0], f = i[0], l = 0, u = 0;
  f > h == f > -h ? (r = h, h = t[++l]) : (r = f, f = i[++u]);
  let p = 0;
  if (l < e && u < n)
    for (f > h == f > -h ? (s = h + r, a = r - (s - h), h = t[++l]) : (s = f + r, a = r - (s - f), f = i[++u]), r = s, a !== 0 && (o[p++] = a); l < e && u < n; )
      f > h == f > -h ? (s = r + h, c = s - r, a = r - (s - c) + (h - c), h = t[++l]) : (s = r + f, c = s - r, a = r - (s - c) + (f - c), f = i[++u]), r = s, a !== 0 && (o[p++] = a);
  for (; l < e; )
    s = r + h, c = s - r, a = r - (s - c) + (h - c), h = t[++l], r = s, a !== 0 && (o[p++] = a);
  for (; u < n; )
    s = r + f, c = s - r, a = r - (s - c) + (f - c), f = i[++u], r = s, a !== 0 && (o[p++] = a);
  return (r !== 0 || p === 0) && (o[p++] = r), p;
}
function vi(e, t) {
  let n = t[0];
  for (let i = 1; i < e; i++) n += t[i];
  return n;
}
function he(e) {
  return new Float64Array(e);
}
const bi = (3 + 16 * Bt) * Bt, xi = (2 + 12 * Bt) * Bt, _i = (9 + 64 * Bt) * Bt * Bt, Jt = he(4), nn = he(8), rn = he(12), on = he(16), yt = he(4);
function Mi(e, t, n, i, o, r, s) {
  let a, c, h, f, l, u, p, _, w, O, M, m, v, d, b, g, E, S;
  const k = e - o, P = n - o, N = t - r, C = i - r;
  d = k * C, u = ut * k, p = u - (u - k), _ = k - p, u = ut * C, w = u - (u - C), O = C - w, b = _ * O - (d - p * w - _ * w - p * O), g = N * P, u = ut * N, p = u - (u - N), _ = N - p, u = ut * P, w = u - (u - P), O = P - w, E = _ * O - (g - p * w - _ * w - p * O), M = b - E, l = b - M, Jt[0] = b - (M + l) + (l - E), m = d + M, l = m - d, v = d - (m - l) + (M - l), M = v - g, l = v - M, Jt[1] = v - (M + l) + (l - g), S = m + M, l = S - m, Jt[2] = m - (S - l) + (M - l), Jt[3] = S;
  let F = vi(4, Jt), y = xi * s;
  if (F >= y || -F >= y || (l = e - k, a = e - (k + l) + (l - o), l = n - P, h = n - (P + l) + (l - o), l = t - N, c = t - (N + l) + (l - r), l = i - C, f = i - (C + l) + (l - r), a === 0 && c === 0 && h === 0 && f === 0) || (y = _i * s + yi * Math.abs(F), F += k * f + C * a - (N * h + P * c), F >= y || -F >= y)) return F;
  d = a * C, u = ut * a, p = u - (u - a), _ = a - p, u = ut * C, w = u - (u - C), O = C - w, b = _ * O - (d - p * w - _ * w - p * O), g = c * P, u = ut * c, p = u - (u - c), _ = c - p, u = ut * P, w = u - (u - P), O = P - w, E = _ * O - (g - p * w - _ * w - p * O), M = b - E, l = b - M, yt[0] = b - (M + l) + (l - E), m = d + M, l = m - d, v = d - (m - l) + (M - l), M = v - g, l = v - M, yt[1] = v - (M + l) + (l - g), S = m + M, l = S - m, yt[2] = m - (S - l) + (M - l), yt[3] = S;
  const I = $e(4, Jt, 4, yt, nn);
  d = k * f, u = ut * k, p = u - (u - k), _ = k - p, u = ut * f, w = u - (u - f), O = f - w, b = _ * O - (d - p * w - _ * w - p * O), g = N * h, u = ut * N, p = u - (u - N), _ = N - p, u = ut * h, w = u - (u - h), O = h - w, E = _ * O - (g - p * w - _ * w - p * O), M = b - E, l = b - M, yt[0] = b - (M + l) + (l - E), m = d + M, l = m - d, v = d - (m - l) + (M - l), M = v - g, l = v - M, yt[1] = v - (M + l) + (l - g), S = m + M, l = S - m, yt[2] = m - (S - l) + (M - l), yt[3] = S;
  const A = $e(I, nn, 4, yt, rn);
  d = a * f, u = ut * a, p = u - (u - a), _ = a - p, u = ut * f, w = u - (u - f), O = f - w, b = _ * O - (d - p * w - _ * w - p * O), g = c * h, u = ut * c, p = u - (u - c), _ = c - p, u = ut * h, w = u - (u - h), O = h - w, E = _ * O - (g - p * w - _ * w - p * O), M = b - E, l = b - M, yt[0] = b - (M + l) + (l - E), m = d + M, l = m - d, v = d - (m - l) + (M - l), M = v - g, l = v - M, yt[1] = v - (M + l) + (l - g), S = m + M, l = S - m, yt[2] = m - (S - l) + (M - l), yt[3] = S;
  const T = $e(A, rn, 4, yt, on);
  return on[T - 1];
}
function sn(e, t, n, i, o, r) {
  const s = (t - r) * (n - o), a = (e - o) * (i - r), c = s - a;
  if (s === 0 || a === 0 || s > 0 != a > 0) return c;
  const h = Math.abs(s + a);
  return Math.abs(c) >= bi * h ? c : -Mi(e, t, n, i, o, r, h);
}
function Si(e, t) {
  const n = new Je([], Vn);
  return ki(e, n), Ai(n, t);
}
function Vn(e, t) {
  return e.p.x > t.p.x ? 1 : e.p.x < t.p.x || e.p.x === t.p.x && (e.featureId !== t.featureId || e.ringId !== t.ringId) && e.isLeftEndpoint && !t.isLeftEndpoint ? -1 : e.p.y !== t.p.y ? e.p.y > t.p.y ? 1 : -1 : 1;
}
function Ei(e, t) {
  return e.rightSweepEvent.p.x > t.rightSweepEvent.p.x ? 1 : e.rightSweepEvent.p.x < t.rightSweepEvent.p.x ? -1 : e.rightSweepEvent.p.y !== t.rightSweepEvent.p.y ? e.rightSweepEvent.p.y < t.rightSweepEvent.p.y ? 1 : -1 : 1;
}
function ki(e, t) {
  if (e.type === "FeatureCollection") {
    const n = e.features;
    for (let i = 0; i < n.length; i++)
      an(n[i], t);
  } else
    an(e, t);
}
var me = 0, ge = 0, we = 0;
function an(e, t) {
  const n = e.type === "Feature" ? e.geometry : e;
  let i = n.coordinates;
  (n.type === "Polygon" || n.type === "MultiLineString") && (i = [i]), n.type === "LineString" && (i = [[i]]);
  for (let o = 0; o < i.length; o++)
    for (let r = 0; r < i[o].length; r++) {
      let s = i[o][r][0], a = null;
      ge = ge + 1;
      for (let c = 0; c < i[o][r].length - 1; c++) {
        a = i[o][r][c + 1];
        const h = new cn(s, me, ge, we), f = new cn(a, me, ge, we + 1);
        h.otherEvent = f, f.otherEvent = h, Vn(h, f) > 0 ? (f.isLeftEndpoint = !0, h.isLeftEndpoint = !1) : (h.isLeftEndpoint = !0, f.isLeftEndpoint = !1), t.push(h), t.push(f), s = a, we = we + 1;
      }
    }
  me = me + 1;
}
var cn = class {
  constructor(e, t, n, i) {
    this.p = {
      x: e[0],
      y: e[1]
    }, this.featureId = t, this.ringId = n, this.eventId = i, this.otherEvent = null, this.isLeftEndpoint = null;
  }
  isSamePoint(e) {
    return this.p.x === e.p.x && this.p.y === e.p.y;
  }
  asNewXY() {
    return [this.p.x, this.p.y];
  }
};
function Ai(e, t = !1) {
  const n = [], i = new Je([], Ei);
  for (; e.length; ) {
    const o = e.pop();
    if (o.isLeftEndpoint) {
      const r = new Ii(o);
      for (let s = 0; s < i.data.length; s++) {
        const a = i.data[s];
        if (t && a.leftSweepEvent.featureId === o.featureId)
          continue;
        const c = Oi(r, a);
        c !== !1 && n.push(c);
      }
      i.push(r);
    } else o.isLeftEndpoint === !1 && i.pop();
  }
  return n;
}
var Ii = class {
  /** @param event must have otherEvent non-null */
  constructor(e) {
    this.leftSweepEvent = e, this.rightSweepEvent = e.otherEvent;
  }
};
function Oi(e, t) {
  if (e === null || t === null) return !1;
  const n = e.leftSweepEvent.p.x, i = e.leftSweepEvent.p.y, o = e.rightSweepEvent.p.x, r = e.rightSweepEvent.p.y, s = t.leftSweepEvent.p.x, a = t.leftSweepEvent.p.y, c = t.rightSweepEvent.p.x, h = t.rightSweepEvent.p.y, f = sn(n, i, o, r, s, a), l = sn(n, i, o, r, c, h);
  if (f > 0 && l > 0) return !1;
  if (f < 0 && l < 0) return !1;
  if (e.leftSweepEvent.ringId === t.leftSweepEvent.ringId) {
    if (e.rightSweepEvent.isSamePoint(t.leftSweepEvent) || e.rightSweepEvent.isSamePoint(t.rightSweepEvent) || e.leftSweepEvent.isSamePoint(t.leftSweepEvent) || e.leftSweepEvent.isSamePoint(t.rightSweepEvent))
      return !1;
  } else {
    if (e.rightSweepEvent.isSamePoint(t.leftSweepEvent))
      return t.leftSweepEvent.asNewXY();
    if (e.rightSweepEvent.isSamePoint(t.rightSweepEvent))
      return t.rightSweepEvent.asNewXY();
    if (e.leftSweepEvent.isSamePoint(t.leftSweepEvent))
      return t.leftSweepEvent.asNewXY();
    if (e.leftSweepEvent.isSamePoint(t.rightSweepEvent))
      return t.rightSweepEvent.asNewXY();
  }
  const u = (h - a) * (o - n) - (c - s) * (r - i), p = (c - s) * (i - a) - (h - a) * (n - s), _ = (o - n) * (i - a) - (r - i) * (n - s);
  if (u === 0)
    return !1;
  const w = p / u, O = _ / u;
  if (w >= 0 && w <= 1 && O >= 0 && O <= 1) {
    const M = n + w * (o - n), m = i + w * (r - i);
    return [M, m];
  }
  return !1;
}
function Pi(e, t, n = {}) {
  const { removeDuplicates: i = !0, ignoreSelfIntersections: o = !0 } = n;
  let r = [];
  e.type === "FeatureCollection" ? r = r.concat(e.features) : e.type === "Feature" ? r.push(e) : (e.type === "LineString" || e.type === "Polygon" || e.type === "MultiLineString" || e.type === "MultiPolygon") && r.push(oe(e)), t.type === "FeatureCollection" ? r = r.concat(t.features) : t.type === "Feature" ? r.push(t) : (t.type === "LineString" || t.type === "Polygon" || t.type === "MultiLineString" || t.type === "MultiPolygon") && r.push(oe(t));
  const s = Si(
    St(r),
    o
  );
  let a = [];
  if (i) {
    const c = {};
    s.forEach((h) => {
      const f = h.join(",");
      c[f] || (c[f] = !0, a.push(h));
    });
  } else
    a = s;
  return St(a.map((c) => Yt(c)));
}
function Ni(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function Bi(e) {
  if (Object.prototype.hasOwnProperty.call(e, "__esModule")) return e;
  var t = e.default;
  if (typeof t == "function") {
    var n = function i() {
      var o = !1;
      try {
        o = this instanceof i;
      } catch {
      }
      return o ? Reflect.construct(t, arguments, this.constructor) : t.apply(this, arguments);
    };
    n.prototype = t.prototype;
  } else n = {};
  return Object.defineProperty(n, "__esModule", { value: !0 }), Object.keys(e).forEach(function(i) {
    var o = Object.getOwnPropertyDescriptor(e, i);
    Object.defineProperty(n, i, o.get ? o : {
      enumerable: !0,
      get: function() {
        return e[i];
      }
    });
  }), n;
}
function Ti(e, t = {}) {
  let n = 0, i = 0, o = 0;
  return ze(
    e,
    function(r) {
      n += r[0], i += r[1], o++;
    },
    !0
  ), Yt([n / o, i / o], t.properties);
}
var ye = { exports: {} }, ke = { exports: {} }, Ci = ke.exports, ln;
function Xi() {
  return ln || (ln = 1, (function(e, t) {
    (function(n, i) {
      e.exports = i();
    })(Ci, function() {
      function n(m, v, d, b, g) {
        (function E(S, k, P, N, C) {
          for (; N > P; ) {
            if (N - P > 600) {
              var F = N - P + 1, y = k - P + 1, I = Math.log(F), A = 0.5 * Math.exp(2 * I / 3), T = 0.5 * Math.sqrt(I * A * (F - A) / F) * (y - F / 2 < 0 ? -1 : 1), X = Math.max(P, Math.floor(k - y * A / F + T)), $ = Math.min(N, Math.floor(k + (F - y) * A / F + T));
              E(S, k, X, $, C);
            }
            var x = S[k], B = P, D = N;
            for (i(S, P, k), C(S[N], x) > 0 && i(S, P, N); B < D; ) {
              for (i(S, B, D), B++, D--; C(S[B], x) < 0; ) B++;
              for (; C(S[D], x) > 0; ) D--;
            }
            C(S[P], x) === 0 ? i(S, P, D) : i(S, ++D, N), D <= k && (P = D + 1), k <= D && (N = D - 1);
          }
        })(m, v, d || 0, b || m.length - 1, g || o);
      }
      function i(m, v, d) {
        var b = m[v];
        m[v] = m[d], m[d] = b;
      }
      function o(m, v) {
        return m < v ? -1 : m > v ? 1 : 0;
      }
      var r = function(m) {
        m === void 0 && (m = 9), this._maxEntries = Math.max(4, m), this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries)), this.clear();
      };
      function s(m, v, d) {
        if (!d) return v.indexOf(m);
        for (var b = 0; b < v.length; b++) if (d(m, v[b])) return b;
        return -1;
      }
      function a(m, v) {
        c(m, 0, m.children.length, v, m);
      }
      function c(m, v, d, b, g) {
        g || (g = O(null)), g.minX = 1 / 0, g.minY = 1 / 0, g.maxX = -1 / 0, g.maxY = -1 / 0;
        for (var E = v; E < d; E++) {
          var S = m.children[E];
          h(g, m.leaf ? b(S) : S);
        }
        return g;
      }
      function h(m, v) {
        return m.minX = Math.min(m.minX, v.minX), m.minY = Math.min(m.minY, v.minY), m.maxX = Math.max(m.maxX, v.maxX), m.maxY = Math.max(m.maxY, v.maxY), m;
      }
      function f(m, v) {
        return m.minX - v.minX;
      }
      function l(m, v) {
        return m.minY - v.minY;
      }
      function u(m) {
        return (m.maxX - m.minX) * (m.maxY - m.minY);
      }
      function p(m) {
        return m.maxX - m.minX + (m.maxY - m.minY);
      }
      function _(m, v) {
        return m.minX <= v.minX && m.minY <= v.minY && v.maxX <= m.maxX && v.maxY <= m.maxY;
      }
      function w(m, v) {
        return v.minX <= m.maxX && v.minY <= m.maxY && v.maxX >= m.minX && v.maxY >= m.minY;
      }
      function O(m) {
        return { children: m, height: 1, leaf: !0, minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
      }
      function M(m, v, d, b, g) {
        for (var E = [v, d]; E.length; ) if (!((d = E.pop()) - (v = E.pop()) <= b)) {
          var S = v + Math.ceil((d - v) / b / 2) * b;
          n(m, S, v, d, g), E.push(v, S, S, d);
        }
      }
      return r.prototype.all = function() {
        return this._all(this.data, []);
      }, r.prototype.search = function(m) {
        var v = this.data, d = [];
        if (!w(m, v)) return d;
        for (var b = this.toBBox, g = []; v; ) {
          for (var E = 0; E < v.children.length; E++) {
            var S = v.children[E], k = v.leaf ? b(S) : S;
            w(m, k) && (v.leaf ? d.push(S) : _(m, k) ? this._all(S, d) : g.push(S));
          }
          v = g.pop();
        }
        return d;
      }, r.prototype.collides = function(m) {
        var v = this.data;
        if (!w(m, v)) return !1;
        for (var d = []; v; ) {
          for (var b = 0; b < v.children.length; b++) {
            var g = v.children[b], E = v.leaf ? this.toBBox(g) : g;
            if (w(m, E)) {
              if (v.leaf || _(m, E)) return !0;
              d.push(g);
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
            var b = this.data;
            this.data = d, d = b;
          }
          this._insert(d, this.data.height - d.height - 1, !0);
        }
        else this.data = d;
        return this;
      }, r.prototype.insert = function(m) {
        return m && this._insert(m, this.data.height - 1), this;
      }, r.prototype.clear = function() {
        return this.data = O([]), this;
      }, r.prototype.remove = function(m, v) {
        if (!m) return this;
        for (var d, b, g, E = this.data, S = this.toBBox(m), k = [], P = []; E || k.length; ) {
          if (E || (E = k.pop(), b = k[k.length - 1], d = P.pop(), g = !0), E.leaf) {
            var N = s(m, E.children, v);
            if (N !== -1) return E.children.splice(N, 1), k.push(E), this._condense(k), this;
          }
          g || E.leaf || !_(E, S) ? b ? (d++, E = b.children[d], g = !1) : E = null : (k.push(E), P.push(d), d = 0, b = E, E = E.children[0]);
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
      }, r.prototype._build = function(m, v, d, b) {
        var g, E = d - v + 1, S = this._maxEntries;
        if (E <= S) return a(g = O(m.slice(v, d + 1)), this.toBBox), g;
        b || (b = Math.ceil(Math.log(E) / Math.log(S)), S = Math.ceil(E / Math.pow(S, b - 1))), (g = O([])).leaf = !1, g.height = b;
        var k = Math.ceil(E / S), P = k * Math.ceil(Math.sqrt(S));
        M(m, v, d, P, this.compareMinX);
        for (var N = v; N <= d; N += P) {
          var C = Math.min(N + P - 1, d);
          M(m, N, C, k, this.compareMinY);
          for (var F = N; F <= C; F += k) {
            var y = Math.min(F + k - 1, C);
            g.children.push(this._build(m, F, y, b - 1));
          }
        }
        return a(g, this.toBBox), g;
      }, r.prototype._chooseSubtree = function(m, v, d, b) {
        for (; b.push(v), !v.leaf && b.length - 1 !== d; ) {
          for (var g = 1 / 0, E = 1 / 0, S = void 0, k = 0; k < v.children.length; k++) {
            var P = v.children[k], N = u(P), C = (F = m, y = P, (Math.max(y.maxX, F.maxX) - Math.min(y.minX, F.minX)) * (Math.max(y.maxY, F.maxY) - Math.min(y.minY, F.minY)) - N);
            C < E ? (E = C, g = N < g ? N : g, S = P) : C === E && N < g && (g = N, S = P);
          }
          v = S || v.children[0];
        }
        var F, y;
        return v;
      }, r.prototype._insert = function(m, v, d) {
        var b = d ? m : this.toBBox(m), g = [], E = this._chooseSubtree(b, this.data, v, g);
        for (E.children.push(m), h(E, b); v >= 0 && g[v].children.length > this._maxEntries; ) this._split(g, v), v--;
        this._adjustParentBBoxes(b, g, v);
      }, r.prototype._split = function(m, v) {
        var d = m[v], b = d.children.length, g = this._minEntries;
        this._chooseSplitAxis(d, g, b);
        var E = this._chooseSplitIndex(d, g, b), S = O(d.children.splice(E, d.children.length - E));
        S.height = d.height, S.leaf = d.leaf, a(d, this.toBBox), a(S, this.toBBox), v ? m[v - 1].children.push(S) : this._splitRoot(d, S);
      }, r.prototype._splitRoot = function(m, v) {
        this.data = O([m, v]), this.data.height = m.height + 1, this.data.leaf = !1, a(this.data, this.toBBox);
      }, r.prototype._chooseSplitIndex = function(m, v, d) {
        for (var b, g, E, S, k, P, N, C = 1 / 0, F = 1 / 0, y = v; y <= d - v; y++) {
          var I = c(m, 0, y, this.toBBox), A = c(m, y, d, this.toBBox), T = (g = I, E = A, S = void 0, k = void 0, P = void 0, N = void 0, S = Math.max(g.minX, E.minX), k = Math.max(g.minY, E.minY), P = Math.min(g.maxX, E.maxX), N = Math.min(g.maxY, E.maxY), Math.max(0, P - S) * Math.max(0, N - k)), X = u(I) + u(A);
          T < C ? (C = T, b = y, F = X < F ? X : F) : T === C && X < F && (F = X, b = y);
        }
        return b || d - v;
      }, r.prototype._chooseSplitAxis = function(m, v, d) {
        var b = m.leaf ? this.compareMinX : f, g = m.leaf ? this.compareMinY : l;
        this._allDistMargin(m, v, d, b) < this._allDistMargin(m, v, d, g) && m.children.sort(b);
      }, r.prototype._allDistMargin = function(m, v, d, b) {
        m.children.sort(b);
        for (var g = this.toBBox, E = c(m, 0, v, g), S = c(m, d - v, d, g), k = p(E) + p(S), P = v; P < d - v; P++) {
          var N = m.children[P];
          h(E, m.leaf ? g(N) : N), k += p(E);
        }
        for (var C = d - v - 1; C >= v; C--) {
          var F = m.children[C];
          h(S, m.leaf ? g(F) : F), k += p(S);
        }
        return k;
      }, r.prototype._adjustParentBBoxes = function(m, v, d) {
        for (var b = d; b >= 0; b--) h(v[b], m);
      }, r.prototype._condense = function(m) {
        for (var v = m.length - 1, d = void 0; v >= 0; v--) m[v].children.length === 0 ? v > 0 ? (d = m[v - 1].children).splice(d.indexOf(m[v]), 1) : this.clear() : a(m[v], this.toBBox);
      }, r;
    });
  })(ke)), ke.exports;
}
const Di = /* @__PURE__ */ Bi(wi);
var Zt = { exports: {} }, Fe, hn;
function $i() {
  return hn || (hn = 1, Fe = function(t, n, i, o) {
    var r = t[0], s = t[1], a = !1;
    i === void 0 && (i = 0), o === void 0 && (o = n.length);
    for (var c = (o - i) / 2, h = 0, f = c - 1; h < c; f = h++) {
      var l = n[i + h * 2 + 0], u = n[i + h * 2 + 1], p = n[i + f * 2 + 0], _ = n[i + f * 2 + 1], w = u > s != _ > s && r < (p - l) * (s - u) / (_ - u) + l;
      w && (a = !a);
    }
    return a;
  }), Fe;
}
var Re, fn;
function Fi() {
  return fn || (fn = 1, Re = function(t, n, i, o) {
    var r = t[0], s = t[1], a = !1;
    i === void 0 && (i = 0), o === void 0 && (o = n.length);
    for (var c = o - i, h = 0, f = c - 1; h < c; f = h++) {
      var l = n[h + i][0], u = n[h + i][1], p = n[f + i][0], _ = n[f + i][1], w = u > s != _ > s && r < (p - l) * (s - u) / (_ - u) + l;
      w && (a = !a);
    }
    return a;
  }), Re;
}
var un;
function Ri() {
  if (un) return Zt.exports;
  un = 1;
  var e = $i(), t = Fi();
  return Zt.exports = function(i, o, r, s) {
    return o.length > 0 && Array.isArray(o[0]) ? t(i, o, r, s) : e(i, o, r, s);
  }, Zt.exports.nested = t, Zt.exports.flat = e, Zt.exports;
}
var ee = { exports: {} }, Yi = ee.exports, dn;
function Li() {
  return dn || (dn = 1, (function(e, t) {
    (function(n, i) {
      i(t);
    })(Yi, function(n) {
      const o = 33306690738754706e-32;
      function r(w, O, M, m, v) {
        let d, b, g, E, S = O[0], k = m[0], P = 0, N = 0;
        k > S == k > -S ? (d = S, S = O[++P]) : (d = k, k = m[++N]);
        let C = 0;
        if (P < w && N < M) for (k > S == k > -S ? (g = d - ((b = S + d) - S), S = O[++P]) : (g = d - ((b = k + d) - k), k = m[++N]), d = b, g !== 0 && (v[C++] = g); P < w && N < M; ) k > S == k > -S ? (g = d - ((b = d + S) - (E = b - d)) + (S - E), S = O[++P]) : (g = d - ((b = d + k) - (E = b - d)) + (k - E), k = m[++N]), d = b, g !== 0 && (v[C++] = g);
        for (; P < w; ) g = d - ((b = d + S) - (E = b - d)) + (S - E), S = O[++P], d = b, g !== 0 && (v[C++] = g);
        for (; N < M; ) g = d - ((b = d + k) - (E = b - d)) + (k - E), k = m[++N], d = b, g !== 0 && (v[C++] = g);
        return d === 0 && C !== 0 || (v[C++] = d), C;
      }
      function s(w) {
        return new Float64Array(w);
      }
      const a = 33306690738754716e-32, c = 22204460492503146e-32, h = 11093356479670487e-47, f = s(4), l = s(8), u = s(12), p = s(16), _ = s(4);
      n.orient2d = function(w, O, M, m, v, d) {
        const b = (O - d) * (M - v), g = (w - v) * (m - d), E = b - g;
        if (b === 0 || g === 0 || b > 0 != g > 0) return E;
        const S = Math.abs(b + g);
        return Math.abs(E) >= a * S ? E : -(function(k, P, N, C, F, y, I) {
          let A, T, X, $, x, B, D, R, L, V, q, U, G, J, Q, H, Z, W;
          const st = k - F, ht = N - F, rt = P - y, ot = C - y;
          x = (Q = (R = st - (D = (B = 134217729 * st) - (B - st))) * (V = ot - (L = (B = 134217729 * ot) - (B - ot))) - ((J = st * ot) - D * L - R * L - D * V)) - (q = Q - (Z = (R = rt - (D = (B = 134217729 * rt) - (B - rt))) * (V = ht - (L = (B = 134217729 * ht) - (B - ht))) - ((H = rt * ht) - D * L - R * L - D * V))), f[0] = Q - (q + x) + (x - Z), x = (G = J - ((U = J + q) - (x = U - J)) + (q - x)) - (q = G - H), f[1] = G - (q + x) + (x - H), x = (W = U + q) - U, f[2] = U - (W - x) + (q - x), f[3] = W;
          let Ct = (function(ni, Ke) {
            let Qe = Ke[0];
            for (let Ie = 1; Ie < ni; Ie++) Qe += Ke[Ie];
            return Qe;
          })(4, f), Wt = c * I;
          if (Ct >= Wt || -Ct >= Wt || (A = k - (st + (x = k - st)) + (x - F), X = N - (ht + (x = N - ht)) + (x - F), T = P - (rt + (x = P - rt)) + (x - y), $ = C - (ot + (x = C - ot)) + (x - y), A === 0 && T === 0 && X === 0 && $ === 0) || (Wt = h * I + o * Math.abs(Ct), (Ct += st * $ + ot * A - (rt * X + ht * T)) >= Wt || -Ct >= Wt)) return Ct;
          x = (Q = (R = A - (D = (B = 134217729 * A) - (B - A))) * (V = ot - (L = (B = 134217729 * ot) - (B - ot))) - ((J = A * ot) - D * L - R * L - D * V)) - (q = Q - (Z = (R = T - (D = (B = 134217729 * T) - (B - T))) * (V = ht - (L = (B = 134217729 * ht) - (B - ht))) - ((H = T * ht) - D * L - R * L - D * V))), _[0] = Q - (q + x) + (x - Z), x = (G = J - ((U = J + q) - (x = U - J)) + (q - x)) - (q = G - H), _[1] = G - (q + x) + (x - H), x = (W = U + q) - U, _[2] = U - (W - x) + (q - x), _[3] = W;
          const Zn = r(4, f, 4, _, l);
          x = (Q = (R = st - (D = (B = 134217729 * st) - (B - st))) * (V = $ - (L = (B = 134217729 * $) - (B - $))) - ((J = st * $) - D * L - R * L - D * V)) - (q = Q - (Z = (R = rt - (D = (B = 134217729 * rt) - (B - rt))) * (V = X - (L = (B = 134217729 * X) - (B - X))) - ((H = rt * X) - D * L - R * L - D * V))), _[0] = Q - (q + x) + (x - Z), x = (G = J - ((U = J + q) - (x = U - J)) + (q - x)) - (q = G - H), _[1] = G - (q + x) + (x - H), x = (W = U + q) - U, _[2] = U - (W - x) + (q - x), _[3] = W;
          const ti = r(Zn, l, 4, _, u);
          x = (Q = (R = A - (D = (B = 134217729 * A) - (B - A))) * (V = $ - (L = (B = 134217729 * $) - (B - $))) - ((J = A * $) - D * L - R * L - D * V)) - (q = Q - (Z = (R = T - (D = (B = 134217729 * T) - (B - T))) * (V = X - (L = (B = 134217729 * X) - (B - X))) - ((H = T * X) - D * L - R * L - D * V))), _[0] = Q - (q + x) + (x - Z), x = (G = J - ((U = J + q) - (x = U - J)) + (q - x)) - (q = G - H), _[1] = G - (q + x) + (x - H), x = (W = U + q) - U, _[2] = U - (W - x) + (q - x), _[3] = W;
          const ei = r(ti, u, 4, _, p);
          return p[ei - 1];
        })(w, O, M, m, v, d, S);
      }, n.orient2dfast = function(w, O, M, m, v, d) {
        return (O - d) * (M - v) - (w - v) * (m - d);
      }, Object.defineProperty(n, "__esModule", { value: !0 });
    });
  })(ee, ee.exports)), ee.exports;
}
var pn;
function Vi() {
  if (pn) return ye.exports;
  pn = 1;
  var e = Xi(), t = Di, n = Ri(), i = Li().orient2d;
  t.default && (t = t.default), ye.exports = o, ye.exports.default = o;
  function o(d, b, g) {
    b = Math.max(0, b === void 0 ? 2 : b), g = g || 0;
    var E = p(d), S = new e(16);
    S.toBBox = function(D) {
      return {
        minX: D[0],
        minY: D[1],
        maxX: D[0],
        maxY: D[1]
      };
    }, S.compareMinX = function(D, R) {
      return D[0] - R[0];
    }, S.compareMinY = function(D, R) {
      return D[1] - R[1];
    }, S.load(d);
    for (var k = [], P = 0, N; P < E.length; P++) {
      var C = E[P];
      S.remove(C), N = _(C, N), k.push(N);
    }
    var F = new e(16);
    for (P = 0; P < k.length; P++) F.insert(u(k[P]));
    for (var y = b * b, I = g * g; k.length; ) {
      var A = k.shift(), T = A.p, X = A.next.p, $ = w(T, X);
      if (!($ < I)) {
        var x = $ / y;
        C = r(S, A.prev.p, T, X, A.next.next.p, x, F), C && Math.min(w(C, T), w(C, X)) <= x && (k.push(A), k.push(_(C, A)), S.remove(C), F.remove(A), F.insert(u(A)), F.insert(u(A.next)));
      }
    }
    A = N;
    var B = [];
    do
      B.push(A.p), A = A.next;
    while (A !== N);
    return B.push(A.p), B;
  }
  function r(d, b, g, E, S, k, P) {
    for (var N = new t([], s), C = d.data; C; ) {
      for (var F = 0; F < C.children.length; F++) {
        var y = C.children[F], I = C.leaf ? O(y, g, E) : a(g, E, y);
        I > k || N.push({
          node: y,
          dist: I
        });
      }
      for (; N.length && !N.peek().node.children; ) {
        var A = N.pop(), T = A.node, X = O(T, b, g), $ = O(T, E, S);
        if (A.dist < X && A.dist < $ && h(g, T, P) && h(E, T, P)) return T;
      }
      C = N.pop(), C && (C = C.node);
    }
    return null;
  }
  function s(d, b) {
    return d.dist - b.dist;
  }
  function a(d, b, g) {
    if (c(d, g) || c(b, g)) return 0;
    var E = M(d[0], d[1], b[0], b[1], g.minX, g.minY, g.maxX, g.minY);
    if (E === 0) return 0;
    var S = M(d[0], d[1], b[0], b[1], g.minX, g.minY, g.minX, g.maxY);
    if (S === 0) return 0;
    var k = M(d[0], d[1], b[0], b[1], g.maxX, g.minY, g.maxX, g.maxY);
    if (k === 0) return 0;
    var P = M(d[0], d[1], b[0], b[1], g.minX, g.maxY, g.maxX, g.maxY);
    return P === 0 ? 0 : Math.min(E, S, k, P);
  }
  function c(d, b) {
    return d[0] >= b.minX && d[0] <= b.maxX && d[1] >= b.minY && d[1] <= b.maxY;
  }
  function h(d, b, g) {
    for (var E = Math.min(d[0], b[0]), S = Math.min(d[1], b[1]), k = Math.max(d[0], b[0]), P = Math.max(d[1], b[1]), N = g.search({ minX: E, minY: S, maxX: k, maxY: P }), C = 0; C < N.length; C++)
      if (l(N[C].p, N[C].next.p, d, b)) return !1;
    return !0;
  }
  function f(d, b, g) {
    return i(d[0], d[1], b[0], b[1], g[0], g[1]);
  }
  function l(d, b, g, E) {
    return d !== E && b !== g && f(d, b, g) > 0 != f(d, b, E) > 0 && f(g, E, d) > 0 != f(g, E, b) > 0;
  }
  function u(d) {
    var b = d.p, g = d.next.p;
    return d.minX = Math.min(b[0], g[0]), d.minY = Math.min(b[1], g[1]), d.maxX = Math.max(b[0], g[0]), d.maxY = Math.max(b[1], g[1]), d;
  }
  function p(d) {
    for (var b = d[0], g = d[0], E = d[0], S = d[0], k = 0; k < d.length; k++) {
      var P = d[k];
      P[0] < b[0] && (b = P), P[0] > E[0] && (E = P), P[1] < g[1] && (g = P), P[1] > S[1] && (S = P);
    }
    var N = [b, g, E, S], C = N.slice();
    for (k = 0; k < d.length; k++)
      n(d[k], N) || C.push(d[k]);
    return v(C);
  }
  function _(d, b) {
    var g = {
      p: d,
      prev: null,
      next: null,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };
    return b ? (g.next = b.next, g.prev = b, b.next.prev = g, b.next = g) : (g.prev = g, g.next = g), g;
  }
  function w(d, b) {
    var g = d[0] - b[0], E = d[1] - b[1];
    return g * g + E * E;
  }
  function O(d, b, g) {
    var E = b[0], S = b[1], k = g[0] - E, P = g[1] - S;
    if (k !== 0 || P !== 0) {
      var N = ((d[0] - E) * k + (d[1] - S) * P) / (k * k + P * P);
      N > 1 ? (E = g[0], S = g[1]) : N > 0 && (E += k * N, S += P * N);
    }
    return k = d[0] - E, P = d[1] - S, k * k + P * P;
  }
  function M(d, b, g, E, S, k, P, N) {
    var C = g - d, F = E - b, y = P - S, I = N - k, A = d - S, T = b - k, X = C * C + F * F, $ = C * y + F * I, x = y * y + I * I, B = C * A + F * T, D = y * A + I * T, R = X * x - $ * $, L, V, q, U, G = R, J = R;
    R === 0 ? (V = 0, G = 1, U = D, J = x) : (V = $ * D - x * B, U = X * D - $ * B, V < 0 ? (V = 0, U = D, J = x) : V > G && (V = G, U = D + $, J = x)), U < 0 ? (U = 0, -B < 0 ? V = 0 : -B > X ? V = G : (V = -B, G = X)) : U > J && (U = J, -B + $ < 0 ? V = 0 : -B + $ > X ? V = G : (V = -B + $, G = X)), L = V === 0 ? 0 : V / G, q = U === 0 ? 0 : U / J;
    var Q = (1 - L) * d + L * g, H = (1 - L) * b + L * E, Z = (1 - q) * S + q * P, W = (1 - q) * k + q * N, st = Z - Q, ht = W - H;
    return st * st + ht * ht;
  }
  function m(d, b) {
    return d[0] === b[0] ? d[1] - b[1] : d[0] - b[0];
  }
  function v(d) {
    d.sort(m);
    for (var b = [], g = 0; g < d.length; g++) {
      for (; b.length >= 2 && f(b[b.length - 2], b[b.length - 1], d[g]) <= 0; )
        b.pop();
      b.push(d[g]);
    }
    for (var E = [], S = d.length - 1; S >= 0; S--) {
      for (; E.length >= 2 && f(E[E.length - 2], E[E.length - 1], d[S]) <= 0; )
        E.pop();
      E.push(d[S]);
    }
    return E.pop(), b.pop(), b.concat(E);
  }
  return ye.exports;
}
var Ui = Vi();
const qi = /* @__PURE__ */ Ni(Ui);
function mn(e, t = {}) {
  t.concavity = t.concavity || 1 / 0;
  const n = [];
  if (ze(e, (o) => {
    n.push([o[0], o[1]]);
  }), !n.length)
    return null;
  const i = qi(n, t.concavity);
  return i.length > 3 ? le([i], t.properties) : null;
}
function Un(e, t, n = {}) {
  const i = { type: "Feature" };
  return (n.id === 0 || n.id) && (i.id = n.id), n.bbox && (i.bbox = n.bbox), i.properties = t || {}, i.geometry = e, i;
}
function se(e, t, n = {}) {
  if (!e)
    throw new Error("coordinates is required");
  if (!Array.isArray(e))
    throw new Error("coordinates must be an Array");
  if (e.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!gn(e[0]) || !gn(e[1]))
    throw new Error("coordinates must contain numbers");
  return Un({
    type: "Point",
    coordinates: e
  }, t, n);
}
function qn(e, t, n = {}) {
  for (const i of e) {
    if (i.length < 4)
      throw new Error(
        "Each LinearRing of a Polygon must have 4 or more Positions."
      );
    if (i[i.length - 1].length !== i[0].length)
      throw new Error("First and last Position are not equivalent.");
    for (let o = 0; o < i[i.length - 1].length; o++)
      if (i[i.length - 1][o] !== i[0][o])
        throw new Error("First and last Position are not equivalent.");
  }
  return Un({
    type: "Polygon",
    coordinates: e
  }, t, n);
}
function Ht(e, t = {}) {
  const n = { type: "FeatureCollection" };
  return t.id && (n.id = t.id), t.bbox && (n.bbox = t.bbox), n.features = e, n;
}
function gn(e) {
  return !isNaN(e) && e !== null && !Array.isArray(e);
}
function ji(e) {
  if (!e)
    throw new Error("coord is required");
  if (!Array.isArray(e)) {
    if (e.type === "Feature" && e.geometry !== null && e.geometry.type === "Point")
      return [...e.geometry.coordinates];
    if (e.type === "Point")
      return [...e.coordinates];
  }
  if (Array.isArray(e) && e.length >= 2 && !Array.isArray(e[0]) && !Array.isArray(e[1]))
    return [...e];
  throw new Error("coord must be GeoJSON Point or an Array of numbers");
}
function wn(e) {
  if (Array.isArray(e))
    return e;
  if (e.type === "Feature") {
    if (e.geometry !== null)
      return e.geometry.coordinates;
  } else if (e.coordinates)
    return e.coordinates;
  throw new Error(
    "coords must be GeoJSON Feature, Geometry Object or an Array"
  );
}
function zi(e) {
  return e.type === "Feature" ? e.geometry : e;
}
const Tt = 11102230246251565e-32, dt = 134217729, Ji = (3 + 8 * Tt) * Tt;
function Ye(e, t, n, i, o) {
  let r, s, a, c, h = t[0], f = i[0], l = 0, u = 0;
  f > h == f > -h ? (r = h, h = t[++l]) : (r = f, f = i[++u]);
  let p = 0;
  if (l < e && u < n)
    for (f > h == f > -h ? (s = h + r, a = r - (s - h), h = t[++l]) : (s = f + r, a = r - (s - f), f = i[++u]), r = s, a !== 0 && (o[p++] = a); l < e && u < n; )
      f > h == f > -h ? (s = r + h, c = s - r, a = r - (s - c) + (h - c), h = t[++l]) : (s = r + f, c = s - r, a = r - (s - c) + (f - c), f = i[++u]), r = s, a !== 0 && (o[p++] = a);
  for (; l < e; )
    s = r + h, c = s - r, a = r - (s - c) + (h - c), h = t[++l], r = s, a !== 0 && (o[p++] = a);
  for (; u < n; )
    s = r + f, c = s - r, a = r - (s - c) + (f - c), f = i[++u], r = s, a !== 0 && (o[p++] = a);
  return (r !== 0 || p === 0) && (o[p++] = r), p;
}
function Gi(e, t) {
  let n = t[0];
  for (let i = 1; i < e; i++) n += t[i];
  return n;
}
function fe(e) {
  return new Float64Array(e);
}
const Ki = (3 + 16 * Tt) * Tt, Qi = (2 + 12 * Tt) * Tt, Hi = (9 + 64 * Tt) * Tt * Tt, Gt = fe(4), yn = fe(8), vn = fe(12), bn = fe(16), vt = fe(4);
function Wi(e, t, n, i, o, r, s) {
  let a, c, h, f, l, u, p, _, w, O, M, m, v, d, b, g, E, S;
  const k = e - o, P = n - o, N = t - r, C = i - r;
  d = k * C, u = dt * k, p = u - (u - k), _ = k - p, u = dt * C, w = u - (u - C), O = C - w, b = _ * O - (d - p * w - _ * w - p * O), g = N * P, u = dt * N, p = u - (u - N), _ = N - p, u = dt * P, w = u - (u - P), O = P - w, E = _ * O - (g - p * w - _ * w - p * O), M = b - E, l = b - M, Gt[0] = b - (M + l) + (l - E), m = d + M, l = m - d, v = d - (m - l) + (M - l), M = v - g, l = v - M, Gt[1] = v - (M + l) + (l - g), S = m + M, l = S - m, Gt[2] = m - (S - l) + (M - l), Gt[3] = S;
  let F = Gi(4, Gt), y = Qi * s;
  if (F >= y || -F >= y || (l = e - k, a = e - (k + l) + (l - o), l = n - P, h = n - (P + l) + (l - o), l = t - N, c = t - (N + l) + (l - r), l = i - C, f = i - (C + l) + (l - r), a === 0 && c === 0 && h === 0 && f === 0) || (y = Hi * s + Ji * Math.abs(F), F += k * f + C * a - (N * h + P * c), F >= y || -F >= y)) return F;
  d = a * C, u = dt * a, p = u - (u - a), _ = a - p, u = dt * C, w = u - (u - C), O = C - w, b = _ * O - (d - p * w - _ * w - p * O), g = c * P, u = dt * c, p = u - (u - c), _ = c - p, u = dt * P, w = u - (u - P), O = P - w, E = _ * O - (g - p * w - _ * w - p * O), M = b - E, l = b - M, vt[0] = b - (M + l) + (l - E), m = d + M, l = m - d, v = d - (m - l) + (M - l), M = v - g, l = v - M, vt[1] = v - (M + l) + (l - g), S = m + M, l = S - m, vt[2] = m - (S - l) + (M - l), vt[3] = S;
  const I = Ye(4, Gt, 4, vt, yn);
  d = k * f, u = dt * k, p = u - (u - k), _ = k - p, u = dt * f, w = u - (u - f), O = f - w, b = _ * O - (d - p * w - _ * w - p * O), g = N * h, u = dt * N, p = u - (u - N), _ = N - p, u = dt * h, w = u - (u - h), O = h - w, E = _ * O - (g - p * w - _ * w - p * O), M = b - E, l = b - M, vt[0] = b - (M + l) + (l - E), m = d + M, l = m - d, v = d - (m - l) + (M - l), M = v - g, l = v - M, vt[1] = v - (M + l) + (l - g), S = m + M, l = S - m, vt[2] = m - (S - l) + (M - l), vt[3] = S;
  const A = Ye(I, yn, 4, vt, vn);
  d = a * f, u = dt * a, p = u - (u - a), _ = a - p, u = dt * f, w = u - (u - f), O = f - w, b = _ * O - (d - p * w - _ * w - p * O), g = c * h, u = dt * c, p = u - (u - c), _ = c - p, u = dt * h, w = u - (u - h), O = h - w, E = _ * O - (g - p * w - _ * w - p * O), M = b - E, l = b - M, vt[0] = b - (M + l) + (l - E), m = d + M, l = m - d, v = d - (m - l) + (M - l), M = v - g, l = v - M, vt[1] = v - (M + l) + (l - g), S = m + M, l = S - m, vt[2] = m - (S - l) + (M - l), vt[3] = S;
  const T = Ye(A, vn, 4, vt, bn);
  return bn[T - 1];
}
function Zi(e, t, n, i, o, r) {
  const s = (t - r) * (n - o), a = (e - o) * (i - r), c = s - a, h = Math.abs(s + a);
  return Math.abs(c) >= Ki * h ? c : -Wi(e, t, n, i, o, r, h);
}
function tr(e, t) {
  var n, i, o = 0, r, s, a, c, h, f, l, u = e[0], p = e[1], _ = t.length;
  for (n = 0; n < _; n++) {
    i = 0;
    var w = t[n], O = w.length - 1;
    if (f = w[0], f[0] !== w[O][0] && f[1] !== w[O][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (s = f[0] - u, a = f[1] - p, i; i < O; i++) {
      if (l = w[i + 1], c = l[0] - u, h = l[1] - p, a === 0 && h === 0) {
        if (c <= 0 && s >= 0 || s <= 0 && c >= 0)
          return 0;
      } else if (h >= 0 && a <= 0 || h <= 0 && a >= 0) {
        if (r = Zi(s, c, a, h, 0, 0), r === 0)
          return 0;
        (r > 0 && h > 0 && a <= 0 || r < 0 && h <= 0 && a > 0) && o++;
      }
      f = l, a = h, s = c;
    }
  }
  return o % 2 !== 0;
}
function Ue(e, t, n = {}) {
  if (!e)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const i = ji(e), o = zi(t), r = o.type, s = t.bbox;
  let a = o.coordinates;
  if (s && er(i, s) === !1)
    return !1;
  r === "Polygon" && (a = [a]);
  for (var c = 0; c < a.length; ++c) {
    const h = tr(i, a[c]);
    if (h === 0 && !n.ignoreBoundary || h) return !0;
  }
  return !1;
}
function er(e, t) {
  return t[0] <= e[0] && t[1] <= e[1] && t[2] >= e[0] && t[3] >= e[1];
}
function Le(e, t) {
  for (let n = 0; n < t.features.length; n++)
    if (Ue(e, t.features[n]))
      return t.features[n];
}
function jn(e, t) {
  const n = t.geometry.coordinates[0][0], i = t.geometry.coordinates[0][1], o = t.geometry.coordinates[0][2], r = e.geometry.coordinates, s = t.properties.a.geom, a = t.properties.b.geom, c = t.properties.c.geom, h = [i[0] - n[0], i[1] - n[1]], f = [o[0] - n[0], o[1] - n[1]], l = [r[0] - n[0], r[1] - n[1]], u = [a[0] - s[0], a[1] - s[1]], p = [c[0] - s[0], c[1] - s[1]], _ = (f[1] * l[0] - f[0] * l[1]) / (h[0] * f[1] - h[1] * f[0]), w = (h[0] * l[1] - h[1] * l[0]) / (h[0] * f[1] - h[1] * f[0]);
  return [
    _ * u[0] + w * p[0] + s[0],
    _ * u[1] + w * p[1] + s[1]
  ];
}
function nr(e, t, n) {
  const i = e.geometry.coordinates, o = n.geometry.coordinates, r = Math.atan2(i[0] - o[0], i[1] - o[1]), s = ir(r, t[0]);
  if (s === void 0)
    throw new Error("Unable to determine vertex index");
  const a = t[1][s];
  return jn(e, a.features[0]);
}
function ne(e, t, n, i, o, r, s, a) {
  let c;
  if (s && (c = Le(e, Ht([s]))), !c)
    if (n) {
      const h = e.geometry.coordinates, f = n.gridNum, l = n.xOrigin, u = n.yOrigin, p = n.xUnit, _ = n.yUnit, w = n.gridCache, O = It(h[0], l, p, f), M = It(h[1], u, _, f), m = w[O] ? w[O][M] ? w[O][M] : [] : [], v = Ht(m.map((d) => t.features[d]));
      c = Le(e, v);
    } else
      c = Le(e, t);
  return a && a(c), c ? jn(e, c) : nr(e, i, o);
}
function It(e, t, n, i) {
  let o = Math.floor((e - t) / n);
  return o < 0 && (o = 0), o >= i && (o = i - 1), o;
}
function ir(e, t) {
  let n = xn(e - t[0]), i = Math.PI * 2, o;
  for (let r = 0; r < t.length; r++) {
    const s = (r + 1) % t.length, a = xn(e - t[s]), c = Math.min(Math.abs(n), Math.abs(a));
    n * a <= 0 && c < i && (i = c, o = r), n = a;
  }
  return o;
}
function xn(e, t = !1) {
  const n = 2 * Math.PI, i = e - Math.floor(e / n) * n;
  return t ? i : i > Math.PI ? i - n : i;
}
function _n(e) {
  const t = e.features;
  for (let n = 0; n < t.length; n++) {
    const i = t[n];
    `${i.properties.a.index}`.substring(0, 1) === "b" && `${i.properties.b.index}`.substring(0, 1) === "b" ? t[n] = {
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            i.geometry.coordinates[0][2],
            i.geometry.coordinates[0][0],
            i.geometry.coordinates[0][1],
            i.geometry.coordinates[0][2]
          ]
        ]
      },
      properties: {
        a: {
          geom: i.properties.c.geom,
          index: i.properties.c.index
        },
        b: {
          geom: i.properties.a.geom,
          index: i.properties.a.index
        },
        c: {
          geom: i.properties.b.geom,
          index: i.properties.b.index
        }
      },
      type: "Feature"
    } : `${i.properties.c.index}`.substring(0, 1) === "b" && `${i.properties.a.index}`.substring(0, 1) === "b" && (t[n] = {
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            i.geometry.coordinates[0][1],
            i.geometry.coordinates[0][2],
            i.geometry.coordinates[0][0],
            i.geometry.coordinates[0][1]
          ]
        ]
      },
      properties: {
        a: {
          geom: i.properties.b.geom,
          index: i.properties.b.index
        },
        b: {
          geom: i.properties.c.geom,
          index: i.properties.c.index
        },
        c: {
          geom: i.properties.a.geom,
          index: i.properties.a.index
        }
      },
      type: "Feature"
    });
  }
  return e;
}
function zn(e) {
  const t = ["a", "b", "c", "a"].map(
    (r) => e.properties[r].geom
  ), n = e.geometry.coordinates[0], i = e.properties, o = {
    a: { geom: n[0], index: i.a.index },
    b: { geom: n[1], index: i.b.index },
    c: { geom: n[2], index: i.c.index }
  };
  return qn([t], o);
}
function rr(e) {
  const t = [0, 1, 2, 0].map((i) => e[i][0][0]), n = {
    a: { geom: e[0][0][1], index: e[0][1] },
    b: { geom: e[1][0][1], index: e[1][1] },
    c: { geom: e[2][0][1], index: e[2][1] }
  };
  return qn([t], n);
}
function qe(e, t, n, i, o, r = !1, s) {
  const a = e.map(
    (c) => {
      (!s || s < 2.00703) && (c = or(c));
      const h = isFinite(c) ? t[c] : c === "c" ? i : (function() {
        const f = c.match(/^b(\d+)$/);
        if (f) return o[parseInt(f[1])];
        const l = c.match(/^e(\d+)$/);
        if (l) return n[parseInt(l[1])];
        throw new Error("Bad index value for indexesToTri");
      })();
      return r ? [[h[1], h[0]], c] : [[h[0], h[1]], c];
    }
  );
  return rr(a);
}
function or(e) {
  return typeof e == "number" ? e : e.replace(/^(c|e|b)(?:ent|dgeNode|box)(\d+)?$/, "$1$2");
}
function Jn(e, t) {
  return t && t >= 2.00703 || Array.isArray(e[0]) ? e : e.map((n) => [
    n.illstNodes,
    n.mercNodes,
    n.startEnd
  ]);
}
const sr = 2.00704;
function ar(e) {
  return !!(e.version !== void 0 || !e.tins && e.points && e.tins_points);
}
function cr(e) {
  return {
    points: e.points,
    strictStatus: hr(e),
    verticesParams: fr(e),
    centroid: ur(e),
    edges: Jn(e.edges || []),
    edgeNodes: e.edgeNodes || [],
    tins: dr(e),
    kinks: pr(e.kinks_points),
    yaxisMode: e.yaxisMode ?? "invert",
    strictMode: e.strictMode ?? "auto",
    vertexMode: e.vertexMode,
    bounds: e.bounds,
    boundsPolygon: e.boundsPolygon,
    wh: e.wh,
    xy: e.xy ?? [0, 0]
  };
}
function lr(e) {
  const t = mr(e), n = t.tins;
  return {
    compiled: t,
    tins: n,
    points: gr(n),
    strictStatus: t.strict_status,
    verticesParams: t.vertices_params,
    centroid: t.centroid,
    kinks: t.kinks
  };
}
function hr(e) {
  return e.strict_status ? e.strict_status : e.kinks_points ? "strict_error" : e.tins_points.length === 2 ? "loose" : "strict";
}
function fr(e) {
  const t = {
    forw: [e.vertices_params[0]],
    bakw: [e.vertices_params[1]]
  };
  return t.forw[1] = Mn(e, !1), t.bakw[1] = Mn(e, !0), t;
}
function Mn(e, t) {
  const n = e.vertices_points.length;
  return Array.from({ length: n }, (i, o) => {
    const r = (o + 1) % n, s = qe(
      ["c", `b${o}`, `b${r}`],
      e.points,
      e.edgeNodes || [],
      e.centroid_point,
      e.vertices_points,
      t,
      sr
    );
    return Ht([s]);
  });
}
function ur(e) {
  return {
    forw: se(e.centroid_point[0], {
      target: {
        geom: e.centroid_point[1],
        index: "c"
      }
    }),
    bakw: se(e.centroid_point[1], {
      target: {
        geom: e.centroid_point[0],
        index: "c"
      }
    })
  };
}
function dr(e) {
  const t = e.tins_points.length === 1 ? 0 : 1;
  return {
    forw: Ht(
      e.tins_points[0].map(
        (n) => qe(
          n,
          e.points,
          e.edgeNodes || [],
          e.centroid_point,
          e.vertices_points,
          !1,
          e.version
        )
      )
    ),
    bakw: Ht(
      e.tins_points[t].map(
        (n) => qe(
          n,
          e.points,
          e.edgeNodes || [],
          e.centroid_point,
          e.vertices_points,
          !0,
          e.version
        )
      )
    )
  };
}
function pr(e) {
  if (e)
    return {
      bakw: Ht(
        e.map((t) => se(t))
      )
    };
}
function mr(e) {
  return JSON.parse(
    JSON.stringify(e).replace('"cent"', '"c"').replace(/"bbox(\d+)"/g, '"b$1"')
  );
}
function gr(e) {
  const t = [], n = e.forw.features;
  for (let i = 0; i < n.length; i++) {
    const o = n[i];
    ["a", "b", "c"].forEach((r, s) => {
      const a = o.geometry.coordinates[0][s], c = o.properties[r].geom, h = o.properties[r].index;
      typeof h == "number" && (t[h] = [a, c]);
    });
  }
  return t;
}
class Mt {
  /**
   * 各種モードの定数定義
   * すべてreadonlyで、型安全性を確保
   */
  static VERTEX_PLAIN = "plain";
  static VERTEX_BIRDEYE = "birdeye";
  static MODE_STRICT = "strict";
  static MODE_AUTO = "auto";
  static MODE_LOOSE = "loose";
  static STATUS_STRICT = "strict";
  static STATUS_ERROR = "strict_error";
  static STATUS_LOOSE = "loose";
  static YAXIS_FOLLOW = "follow";
  static YAXIS_INVERT = "invert";
  points = [];
  /** @deprecated 2.00704 以降、Transform はこのプロパティを設定も参照もしない。サブクラス（MaplatTin）は、旧 @maplat/transform と組まれたときの互換のため {} を入れる（t2 設計 §2.1） */
  pointsWeightBuffer;
  strict_status;
  vertices_params;
  centroid;
  edgeNodes;
  edges;
  tins;
  kinks;
  yaxisMode = Mt.YAXIS_INVERT;
  strictMode = Mt.MODE_AUTO;
  vertexMode = Mt.VERTEX_PLAIN;
  bounds;
  boundsPolygon;
  wh;
  xy;
  indexedTins;
  stateFull = !1;
  stateTriangle;
  stateBackward;
  /**
   * Optional properties for MaplatCore extension
   * These properties allow consuming applications to extend Transform instances
   * with additional metadata without requiring Module Augmentation
   */
  /** Layer priority for rendering order */
  priority;
  /** Layer importance for display decisions */
  importance;
  /** Bounds in XY (source) coordinate system */
  xyBounds;
  /** Bounds in Mercator (Web Mercator) coordinate system */
  mercBounds;
  constructor() {
  }
  /**
   * コンパイルされた設定を適用します
   *
   * @param compiled - コンパイルされた設定オブジェクト
   * @returns 変換に必要な主要なオブジェクトのセット
   *
   * 以下の処理を行います：
   * 1. バージョンに応じた設定の解釈
   * 2. 各種パラメータの復元
   * 3. TINネットワークの再構築
   * 4. インデックスの作成
   */
  setCompiled(t) {
    if (ar(t)) {
      this.applyModernState(cr(t));
      return;
    }
    this.applyLegacyState(lr(t));
  }
  applyModernState(t) {
    this.points = t.points, this.strict_status = t.strictStatus, this.vertices_params = t.verticesParams, this.centroid = t.centroid, this.edges = t.edges, this.edgeNodes = t.edgeNodes || [], this.tins = t.tins, this.addIndexedTin(), this.kinks = t.kinks, this.yaxisMode = t.yaxisMode ?? Mt.YAXIS_INVERT, this.vertexMode = t.vertexMode ?? Mt.VERTEX_PLAIN, this.strictMode = t.strictMode ?? Mt.MODE_AUTO, t.bounds ? (this.bounds = t.bounds, this.boundsPolygon = t.boundsPolygon, this.xy = t.xy, this.wh = t.wh) : (this.bounds = void 0, this.boundsPolygon = void 0, this.xy = t.xy ?? [0, 0], t.wh && (this.wh = t.wh));
  }
  applyLegacyState(t) {
    this.tins = t.tins, this.addIndexedTin(), this.strict_status = t.strictStatus, this.vertices_params = t.verticesParams, this.centroid = t.centroid, this.kinks = t.kinks, this.points = t.points;
  }
  /**
   * TINネットワークのインデックスを作成します
   *
   * インデックスは変換処理を高速化するために使用されます。
   * グリッド形式のインデックスを作成し、各グリッドに
   * 含まれる三角形を記録します。
   */
  addIndexedTin() {
    const t = this.tins, n = t.forw, i = t.bakw, o = Math.ceil(Math.sqrt(n.features.length));
    if (o < 3) {
      this.indexedTins = void 0;
      return;
    }
    let r = [], s = [];
    const a = n.features.map((w) => {
      let O = [];
      return wn(w)[0].map((M) => {
        r.length === 0 ? r = [Array.from(M), Array.from(M)] : (M[0] < r[0][0] && (r[0][0] = M[0]), M[0] > r[1][0] && (r[1][0] = M[0]), M[1] < r[0][1] && (r[0][1] = M[1]), M[1] > r[1][1] && (r[1][1] = M[1])), O.length === 0 ? O = [Array.from(M), Array.from(M)] : (M[0] < O[0][0] && (O[0][0] = M[0]), M[0] > O[1][0] && (O[1][0] = M[0]), M[1] < O[0][1] && (O[0][1] = M[1]), M[1] > O[1][1] && (O[1][1] = M[1]));
      }), O;
    }), c = (r[1][0] - r[0][0]) / o, h = (r[1][1] - r[0][1]) / o, f = a.reduce(
      (w, O, M) => {
        const m = It(O[0][0], r[0][0], c, o), v = It(O[1][0], r[0][0], c, o), d = It(O[0][1], r[0][1], h, o), b = It(O[1][1], r[0][1], h, o);
        for (let g = m; g <= v; g++) {
          w[g] || (w[g] = []);
          for (let E = d; E <= b; E++)
            w[g][E] || (w[g][E] = []), w[g][E].push(M);
        }
        return w;
      },
      []
    ), l = i.features.map((w) => {
      let O = [];
      return wn(w)[0].map((M) => {
        s.length === 0 ? s = [Array.from(M), Array.from(M)] : (M[0] < s[0][0] && (s[0][0] = M[0]), M[0] > s[1][0] && (s[1][0] = M[0]), M[1] < s[0][1] && (s[0][1] = M[1]), M[1] > s[1][1] && (s[1][1] = M[1])), O.length === 0 ? O = [Array.from(M), Array.from(M)] : (M[0] < O[0][0] && (O[0][0] = M[0]), M[0] > O[1][0] && (O[1][0] = M[0]), M[1] < O[0][1] && (O[0][1] = M[1]), M[1] > O[1][1] && (O[1][1] = M[1]));
      }), O;
    }), u = (s[1][0] - s[0][0]) / o, p = (s[1][1] - s[0][1]) / o, _ = l.reduce(
      (w, O, M) => {
        const m = It(O[0][0], s[0][0], u, o), v = It(O[1][0], s[0][0], u, o), d = It(O[0][1], s[0][1], p, o), b = It(O[1][1], s[0][1], p, o);
        for (let g = m; g <= v; g++) {
          w[g] || (w[g] = []);
          for (let E = d; E <= b; E++)
            w[g][E] || (w[g][E] = []), w[g][E].push(M);
        }
        return w;
      },
      []
    );
    this.indexedTins = {
      forw: {
        gridNum: o,
        xOrigin: r[0][0],
        yOrigin: r[0][1],
        xUnit: c,
        yUnit: h,
        gridCache: f
      },
      bakw: {
        gridNum: o,
        xOrigin: s[0][0],
        yOrigin: s[0][1],
        xUnit: u,
        yUnit: p,
        gridCache: _
      }
    };
  }
  /**
   * 座標変換を実行します
   *
   * @param apoint - 変換する座標
   * @param backward - 逆方向の変換かどうか
   * @param ignoreBounds - 境界チェックを無視するかどうか
   * @returns 変換後の座標、または境界外の場合はfalse
   *
   * @throws {Error} 逆方向変換が許可されていない状態での逆変換時
   */
  transform(t, n, i) {
    if (!this.tins)
      throw new Error("setCompiled() must be called before transform()");
    if (n && this.strict_status == Mt.STATUS_ERROR)
      throw new Error('Backward transform is not allowed if strict_status == "strict_error"');
    this.yaxisMode == Mt.YAXIS_FOLLOW && n && (t = [t[0], -1 * t[1]]);
    const o = se(t);
    if (this.bounds && !n && !i && !Ue(o, this.boundsPolygon))
      return !1;
    const r = n ? this.tins.bakw : this.tins.forw, s = n ? this.indexedTins.bakw : this.indexedTins.forw, a = n ? this.vertices_params.bakw : this.vertices_params.forw, c = n ? this.centroid.bakw : this.centroid.forw;
    let h, f;
    this.stateFull && (this.stateBackward == n ? h = this.stateTriangle : (this.stateBackward = n, this.stateTriangle = void 0), f = (u) => {
      this.stateTriangle = u;
    });
    let l = ne(
      o,
      r,
      s,
      a,
      c,
      void 0,
      h,
      f
    );
    if (this.bounds && n && !i) {
      const u = se(l);
      if (!Ue(u, this.boundsPolygon)) return !1;
    } else this.yaxisMode == Mt.YAXIS_FOLLOW && !n && (l = [l[0], -1 * l[1]]);
    return l;
  }
}
const Sn = Math.pow(2, -52), ve = new Uint32Array(512);
class Ge {
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
  static from(t, n = xr, i = _r) {
    const o = t.length, r = new Float64Array(o * 2);
    for (let s = 0; s < o; s++) {
      const a = t[s];
      r[2 * s] = n(a), r[2 * s + 1] = i(a);
    }
    return new Ge(r);
  }
  /**
   * Constructs a delaunay triangulation object given an array of point coordinates of the form:
   * `[x0, y0, x1, y1, ...]` (use a typed array for best performance). Duplicate points are skipped.
   *
   * @param {T} coords
   */
  constructor(t) {
    const n = t.length >> 1;
    if (n > 0 && typeof t[0] != "number") throw new Error("Expected coords to contain numbers.");
    this.coords = t;
    const i = Math.max(2 * n - 5, 0);
    this._triangles = new Uint32Array(i * 3), this._halfedges = new Int32Array(i * 3), this._hashSize = Math.ceil(Math.sqrt(n)), this._hullPrev = new Uint32Array(n), this._hullNext = new Uint32Array(n), this._hullTri = new Uint32Array(n), this._hullHash = new Int32Array(this._hashSize), this._ids = new Uint32Array(n), this._dists = new Float64Array(n), this.trianglesLen = 0, this._cx = 0, this._cy = 0, this._hullStart = 0, this.hull = this._triangles, this.triangles = this._triangles, this.halfedges = this._halfedges, this.update();
  }
  /**
   * Updates the triangulation if you modified `delaunay.coords` values in place, avoiding expensive memory allocations.
   * Useful for iterative relaxation algorithms such as Lloyd's.
   */
  update() {
    const { coords: t, _hullPrev: n, _hullNext: i, _hullTri: o, _hullHash: r } = this, s = t.length >> 1;
    let a = 1 / 0, c = 1 / 0, h = -1 / 0, f = -1 / 0;
    for (let k = 0; k < s; k++) {
      const P = t[2 * k], N = t[2 * k + 1];
      P < a && (a = P), N < c && (c = N), P > h && (h = P), N > f && (f = N), this._ids[k] = k;
    }
    const l = (a + h) / 2, u = (c + f) / 2;
    let p = 0, _ = 0, w = 0;
    for (let k = 0, P = 1 / 0; k < s; k++) {
      const N = Ve(l, u, t[2 * k], t[2 * k + 1]);
      N < P && (p = k, P = N);
    }
    const O = t[2 * p], M = t[2 * p + 1];
    for (let k = 0, P = 1 / 0; k < s; k++) {
      if (k === p) continue;
      const N = Ve(O, M, t[2 * k], t[2 * k + 1]);
      N < P && N > 0 && (_ = k, P = N);
    }
    let m = t[2 * _], v = t[2 * _ + 1], d = 1 / 0;
    for (let k = 0; k < s; k++) {
      if (k === p || k === _) continue;
      const P = vr(O, M, m, v, t[2 * k], t[2 * k + 1]);
      P < d && (w = k, d = P);
    }
    let b = t[2 * w], g = t[2 * w + 1];
    if (d === 1 / 0) {
      for (let N = 0; N < s; N++)
        this._dists[N] = t[2 * N] - t[0] || t[2 * N + 1] - t[1];
      Kt(this._ids, this._dists, 0, s - 1);
      const k = new Uint32Array(s);
      let P = 0;
      for (let N = 0, C = -1 / 0; N < s; N++) {
        const F = this._ids[N], y = this._dists[F];
        y > C && (k[P++] = F, C = y);
      }
      this.hull = k.subarray(0, P), this.triangles = new Uint32Array(0), this.halfedges = new Int32Array(0);
      return;
    }
    if (Ot(O, M, m, v, b, g) < 0) {
      const k = _, P = m, N = v;
      _ = w, m = b, v = g, w = k, b = P, g = N;
    }
    const E = br(O, M, m, v, b, g);
    this._cx = E.x, this._cy = E.y;
    for (let k = 0; k < s; k++)
      this._dists[k] = Ve(t[2 * k], t[2 * k + 1], E.x, E.y);
    Kt(this._ids, this._dists, 0, s - 1), this._hullStart = p;
    let S = 3;
    i[p] = n[w] = _, i[_] = n[p] = w, i[w] = n[_] = p, o[p] = 0, o[_] = 1, o[w] = 2, r.fill(-1), r[this._hashKey(O, M)] = p, r[this._hashKey(m, v)] = _, r[this._hashKey(b, g)] = w, this.trianglesLen = 0, this._addTriangle(p, _, w, -1, -1, -1);
    for (let k = 0, P = 0, N = 0; k < this._ids.length; k++) {
      const C = this._ids[k], F = t[2 * C], y = t[2 * C + 1];
      if (k > 0 && Math.abs(F - P) <= Sn && Math.abs(y - N) <= Sn || (P = F, N = y, C === p || C === _ || C === w)) continue;
      let I = 0;
      for (let x = 0, B = this._hashKey(F, y); x < this._hashSize && (I = r[(B + x) % this._hashSize], !(I !== -1 && I !== i[I])); x++)
        ;
      I = n[I];
      let A = I, T;
      for (; T = i[A], Ot(F, y, t[2 * A], t[2 * A + 1], t[2 * T], t[2 * T + 1]) >= 0; )
        if (A = T, A === I) {
          A = -1;
          break;
        }
      if (A === -1) continue;
      let X = this._addTriangle(A, C, i[A], -1, -1, o[A]);
      o[C] = this._legalize(X + 2), o[A] = X, S++;
      let $ = i[A];
      for (; T = i[$], Ot(F, y, t[2 * $], t[2 * $ + 1], t[2 * T], t[2 * T + 1]) < 0; )
        X = this._addTriangle($, C, T, o[C], -1, o[$]), o[C] = this._legalize(X + 2), i[$] = $, S--, $ = T;
      if (A === I)
        for (; T = n[A], Ot(F, y, t[2 * T], t[2 * T + 1], t[2 * A], t[2 * A + 1]) < 0; )
          X = this._addTriangle(T, C, A, -1, o[A], o[T]), this._legalize(X + 2), o[T] = X, i[A] = A, S--, A = T;
      this._hullStart = n[C] = A, i[A] = n[$] = C, i[C] = $, r[this._hashKey(F, y)] = C, r[this._hashKey(t[2 * A], t[2 * A + 1])] = A;
    }
    this.hull = new Uint32Array(S);
    for (let k = 0, P = this._hullStart; k < S; k++)
      this.hull[k] = P, P = i[P];
    this.triangles = this._triangles.subarray(0, this.trianglesLen), this.halfedges = this._halfedges.subarray(0, this.trianglesLen);
  }
  /**
   * Calculate an angle-based key for the edge hash used for advancing convex hull.
   *
   * @param {number} x
   * @param {number} y
   * @private
   */
  _hashKey(t, n) {
    return Math.floor(wr(t - this._cx, n - this._cy) * this._hashSize) % this._hashSize;
  }
  /**
   * Flip an edge in a pair of triangles if it doesn't satisfy the Delaunay condition.
   *
   * @param {number} a
   * @private
   */
  _legalize(t) {
    const { _triangles: n, _halfedges: i, coords: o } = this;
    let r = 0, s = 0;
    for (; ; ) {
      const a = i[t], c = t - t % 3;
      if (s = c + (t + 2) % 3, a === -1) {
        if (r === 0) break;
        t = ve[--r];
        continue;
      }
      const h = a - a % 3, f = c + (t + 1) % 3, l = h + (a + 2) % 3, u = n[s], p = n[t], _ = n[f], w = n[l];
      if (yr(
        o[2 * u],
        o[2 * u + 1],
        o[2 * p],
        o[2 * p + 1],
        o[2 * _],
        o[2 * _ + 1],
        o[2 * w],
        o[2 * w + 1]
      )) {
        n[t] = w, n[a] = u;
        const M = i[l];
        if (M === -1) {
          let v = this._hullStart;
          do {
            if (this._hullTri[v] === l) {
              this._hullTri[v] = t;
              break;
            }
            v = this._hullPrev[v];
          } while (v !== this._hullStart);
        }
        this._link(t, M), this._link(a, i[s]), this._link(s, l);
        const m = h + (a + 1) % 3;
        r < ve.length && (ve[r++] = m);
      } else {
        if (r === 0) break;
        t = ve[--r];
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
  _link(t, n) {
    this._halfedges[t] = n, n !== -1 && (this._halfedges[n] = t);
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
  _addTriangle(t, n, i, o, r, s) {
    const a = this.trianglesLen;
    return this._triangles[a] = t, this._triangles[a + 1] = n, this._triangles[a + 2] = i, this._link(a, o), this._link(a + 1, r), this._link(a + 2, s), this.trianglesLen += 3, a;
  }
}
function wr(e, t) {
  const n = e / (Math.abs(e) + Math.abs(t));
  return (t > 0 ? 3 - n : 1 + n) / 4;
}
function Ve(e, t, n, i) {
  const o = e - n, r = t - i;
  return o * o + r * r;
}
function yr(e, t, n, i, o, r, s, a) {
  const c = e - s, h = t - a, f = n - s, l = i - a, u = o - s, p = r - a, _ = c * c + h * h, w = f * f + l * l, O = u * u + p * p;
  return c * (l * O - w * p) - h * (f * O - w * u) + _ * (f * p - l * u) < 0;
}
function vr(e, t, n, i, o, r) {
  const s = n - e, a = i - t, c = o - e, h = r - t, f = s * s + a * a, l = c * c + h * h, u = 0.5 / (s * h - a * c), p = (h * f - a * l) * u, _ = (s * l - c * f) * u;
  return p * p + _ * _;
}
function br(e, t, n, i, o, r) {
  const s = n - e, a = i - t, c = o - e, h = r - t, f = s * s + a * a, l = c * c + h * h, u = 0.5 / (s * h - a * c), p = e + (h * f - a * l) * u, _ = t + (s * l - c * f) * u;
  return { x: p, y: _ };
}
function Kt(e, t, n, i) {
  if (i - n <= 20)
    for (let o = n + 1; o <= i; o++) {
      const r = e[o], s = t[r];
      let a = o - 1;
      for (; a >= n && t[e[a]] > s; ) e[a + 1] = e[a--];
      e[a + 1] = r;
    }
  else {
    const o = n + i >> 1;
    let r = n + 1, s = i;
    te(e, o, r), t[e[n]] > t[e[i]] && te(e, n, i), t[e[r]] > t[e[i]] && te(e, r, i), t[e[n]] > t[e[r]] && te(e, n, r);
    const a = e[r], c = t[a];
    for (; ; ) {
      do
        r++;
      while (t[e[r]] < c);
      do
        s--;
      while (t[e[s]] > c);
      if (s < r) break;
      te(e, r, s);
    }
    e[n + 1] = e[s], e[s] = a, i - r + 1 >= s - n ? (Kt(e, t, r, i), Kt(e, t, n, s - 1)) : (Kt(e, t, n, s - 1), Kt(e, t, r, i));
  }
}
function te(e, t, n) {
  const i = e[t];
  e[t] = e[n], e[n] = i;
}
function xr(e) {
  return e[0];
}
function _r(e) {
  return e[1];
}
class Mr {
  bs;
  width;
  constructor(t, n) {
    this.width = t, this.bs = n;
  }
  /**
   * Add a number to the set.
   *
   * @param idx The number to add. Must be 0 <= idx < len.
   */
  add(t) {
    const n = Math.floor(t / this.width), i = t % this.width;
    return this.bs[n] |= 1 << i, this;
  }
  /**
   * Delete a number from the set.
   *
   * @param idx The number to delete. Must be 0 <= idx < len.
   */
  delete(t) {
    const n = Math.floor(t / this.width), i = t % this.width;
    return this.bs[n] &= ~(1 << i), this;
  }
  /**
   * Add or delete a number in the set, depending on the second argument.
   *
   * @param idx The number to add or delete. Must be 0 <= idx < len.
   * @param val If true, add the number, otherwise delete.
   */
  set(t, n) {
    const i = Math.floor(t / this.width), r = 1 << t % this.width;
    return this.bs[i] ^= (-Number(n) ^ this.bs[i]) & r, n;
  }
  /**
   * Whether the number is in the set.
   *
   * @param idx The number to test. Must be 0 <= idx < len.
   */
  has(t) {
    const n = Math.floor(t / this.width), i = t % this.width;
    return (this.bs[n] & 1 << i) !== 0;
  }
  /**
   * Iterate over the numbers that are in the set.
   */
  forEach(t) {
    const n = this.bs.length;
    for (let i = 0; i < n; i++) {
      let o = 0;
      for (; this.bs[i] && o < this.width; )
        this.bs[i] & 1 << o && t(i * this.width + o), o++;
    }
    return this;
  }
}
class En extends Mr {
  constructor(t) {
    super(8, new Uint8Array(Math.ceil(t / 8)).fill(0));
  }
}
function qt(e) {
  return e % 3 === 2 ? e - 2 : e + 1;
}
function Pt(e) {
  return e % 3 === 0 ? e + 2 : e - 1;
}
function kn(e, t, n, i, o, r, s, a) {
  const c = Ot(e, t, o, r, s, a), h = Ot(n, i, o, r, s, a);
  if (c > 0 && h > 0 || c < 0 && h < 0)
    return !1;
  const f = Ot(o, r, e, t, n, i), l = Ot(s, a, e, t, n, i);
  return f > 0 && l > 0 || f < 0 && l < 0 ? !1 : c === 0 && h === 0 && f === 0 && l === 0 ? !(Math.max(o, s) < Math.min(e, n) || Math.max(e, n) < Math.min(o, s) || Math.max(r, a) < Math.min(t, i) || Math.max(t, i) < Math.min(r, a)) : !0;
}
class Sr {
  /**
   * The triangulation object from Delaunator.
   */
  del;
  constructor(t) {
    this.del = t;
  }
}
class Er extends Sr {
  vertMap;
  flips;
  consd;
  /**
   * Create a Constrain instance.
   *
   * @param del The triangulation output from Delaunator.
   * @param edges If provided, constrain these edges via constrainAll.
   */
  constructor(t, n) {
    if (!t || typeof t != "object" || !t.triangles || !t.halfedges || !t.coords)
      throw new Error("Expected an object with Delaunator output");
    if (t.triangles.length % 3 || t.halfedges.length !== t.triangles.length || t.coords.length % 2)
      throw new Error("Delaunator output appears inconsistent");
    if (t.triangles.length < 3)
      throw new Error("No edges in triangulation");
    super(t);
    const i = 2 ** 32 - 1, o = t.coords.length >> 1, r = t.triangles.length;
    this.vertMap = new Uint32Array(o).fill(i), this.flips = new En(r), this.consd = new En(r);
    for (let s = 0; s < r; s++) {
      const a = t.triangles[s];
      this.vertMap[a] === i && this.updateVert(s);
    }
    n && this.constrainAll(n);
  }
  /**
   * Constrain the triangulation such that there is an edge between p1 and p2.
   */
  constrainOne(t, n) {
    const { triangles: i, halfedges: o } = this.del;
    this.assertVertex(t, t, n), this.assertVertex(n, t, n), this.assertInTriangulation(t, t, n), this.assertInTriangulation(n, t, n);
    const r = this.vertMap[t], s = this.maxConstrainSteps();
    let a = 0, c = r;
    do {
      if (++a > s)
        throw new Error(
          `Constraining edge [${t}, ${n}] exceeded the iteration limit`
        );
      const l = i[c], u = qt(c);
      if (l === n)
        return this.protect(c);
      const p = Pt(c), _ = i[p];
      if (_ === n)
        return this.protect(u), u;
      if (this.intersectSegments(t, n, _, l)) {
        c = p;
        break;
      }
      c = o[u];
    } while (c !== -1 && c !== r);
    let h = c, f = -1;
    for (; c !== -1; ) {
      if (++a > s)
        throw new Error(
          `Constraining edge [${t}, ${n}] exceeded the iteration limit`
        );
      const l = o[c], u = Pt(c), p = Pt(l), _ = qt(l);
      if (l === -1)
        throw new Error("Constraining edge exited the hull");
      if (this.consd.has(c))
        throw new Error("Edge intersects already constrained edge");
      if (this.isCollinear(t, n, i[c]) || this.isCollinear(t, n, i[l]))
        throw new Error("Constraining edge intersects point");
      if (!this.intersectSegments(
        i[c],
        i[l],
        i[u],
        i[p]
      )) {
        if (f === -1 && (f = c), i[p] === n) {
          if (c === f)
            throw new Error("Infinite loop: non-convex quadrilateral");
          c = f, f = -1;
          continue;
        }
        if (this.intersectSegments(
          t,
          n,
          i[p],
          i[l]
        ))
          c = p;
        else if (this.intersectSegments(
          t,
          n,
          i[_],
          i[p]
        ))
          c = _;
        else if (f === c)
          throw new Error("Infinite loop: no further intersect after non-convex");
        continue;
      }
      if (this.flipDiagonal(c), this.intersectSegments(
        t,
        n,
        i[u],
        i[p]
      ) && (f === -1 && (f = u), f === u))
        throw new Error("Infinite loop: flipped diagonal still intersects");
      i[p] === n ? (h = p, c = f, f = -1) : this.intersectSegments(
        t,
        n,
        i[_],
        i[p]
      ) && (c = _);
    }
    return this.protect(h), this.delaunify(!0), this.findEdge(t, n);
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
  assertInTriangulation(t, n, i) {
    if (this.vertMap[t] >= this.del.triangles.length)
      throw new Error(
        `Invalid edge [${n}, ${i}]: vertex ${t} is not part of the triangulation`
      );
  }
  /**
   * Throw unless `vertex` is an id of a point given to Delaunator.
   */
  assertVertex(t, n, i) {
    const o = this.vertMap.length;
    if (!Number.isInteger(t) || t < 0 || t >= o)
      throw new Error(
        `Invalid edge [${String(n)}, ${String(i)}]: vertex ids must be integers from 0 to ${o - 1}`
      );
  }
  /**
   * Fix the Delaunay condition.
   */
  delaunify(t = !1) {
    const { halfedges: n } = this.del, i = this.flips, o = this.consd, r = n.length;
    let s;
    do {
      s = 0;
      for (let a = 0; a < r; a++) {
        if (o.has(a))
          continue;
        i.delete(a);
        const c = n[a];
        c !== -1 && (i.delete(c), this.isDelaunay(a) || (this.flipDiagonal(a), s++));
      }
    } while (t && s > 0);
    return this;
  }
  /**
   * Call constrainOne on each edge.
   */
  constrainAll(t) {
    const n = t.length;
    for (let i = 0; i < n; i++) {
      const o = t[i];
      this.constrainOne(o[0], o[1]);
    }
    return this;
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
  findEdge(t, n) {
    const i = this.vertMap[n], { triangles: o, halfedges: r } = this.del;
    if (!(i < o.length))
      return 1 / 0;
    let s = i, a, c = 0;
    do {
      if (++c > o.length)
        throw new Error(
          `Looking up edge [${t}, ${n}] exceeded the iteration limit`
        );
      if (o[s] === t)
        return s;
      a = qt(s), s = r[a];
    } while (s !== -1 && s !== i);
    return o[qt(a)] === t ? -a : 1 / 0;
  }
  /**
   * Mark an edge as constrained, i.e. should not be touched by `delaunify`.
   */
  protect(t) {
    const n = this.del.halfedges[t], i = this.flips, o = this.consd;
    return i.delete(t), o.add(t), n !== -1 ? (i.delete(n), o.add(n), n) : -t;
  }
  /**
   * Mark an edge as flipped unless constrained.
   */
  markFlip(t) {
    const n = this.del.halfedges, i = this.flips;
    if (this.consd.has(t))
      return !1;
    const r = n[t];
    return r !== -1 && (i.add(t), i.add(r)), !0;
  }
  /**
   * Flip the edge shared by two triangles.
   */
  flipDiagonal(t) {
    const { triangles: n, halfedges: i } = this.del, o = this.flips, r = this.consd, s = i[t], a = Pt(t), c = qt(t), h = Pt(s), f = qt(s), l = i[a], u = i[h];
    if (r.has(t))
      throw new Error("Trying to flip a constrained edge");
    return n[t] = n[h], i[t] = u, o.set(t, o.has(h)) || r.set(t, r.has(h)), u !== -1 && (i[u] = t), i[a] = h, n[s] = n[a], i[s] = l, o.set(s, o.has(a)) || r.set(s, r.has(a)), l !== -1 && (i[l] = s), i[h] = a, this.markFlip(t), this.markFlip(c), this.markFlip(s), this.markFlip(f), o.add(a), r.delete(a), o.add(h), r.delete(h), this.updateVert(t), this.updateVert(c), this.updateVert(s), this.updateVert(f), a;
  }
  /**
   * Whether point p1, p2, and p are collinear.
   */
  isCollinear(t, n, i) {
    const o = this.del.coords;
    return Ot(
      o[t * 2],
      o[t * 2 + 1],
      o[n * 2],
      o[n * 2 + 1],
      o[i * 2],
      o[i * 2 + 1]
    ) === 0;
  }
  /**
   * Whether the triangle formed by p1, p2, p3 keeps px outside the circumcircle.
   */
  inCircle(t, n, i, o) {
    const r = this.del.coords;
    return di(
      r[t * 2],
      r[t * 2 + 1],
      r[n * 2],
      r[n * 2 + 1],
      r[i * 2],
      r[i * 2 + 1],
      r[o * 2],
      r[o * 2 + 1]
    ) < 0;
  }
  /**
   * Whether the triangles sharing edg conform to the Delaunay condition.
   */
  isDelaunay(t) {
    const { triangles: n, halfedges: i } = this.del, o = i[t];
    if (o === -1)
      return !0;
    const r = n[Pt(t)], s = n[t], a = n[qt(t)], c = n[Pt(o)];
    return !this.inCircle(r, s, a, c);
  }
  /**
   * Update the vertex -> incoming edge map.
   */
  updateVert(t) {
    const { triangles: n, halfedges: i } = this.del, o = this.vertMap, r = n[t];
    let s = Pt(t), a = i[s];
    for (; a !== -1 && a !== t; )
      s = Pt(a), a = i[s];
    return o[r] = s, s;
  }
  /**
   * Whether the segments between vertices intersect.
   */
  intersectSegments(t, n, i, o) {
    const r = this.del.coords;
    return t === i || t === o || n === i || n === o ? !1 : kn(
      r[t * 2],
      r[t * 2 + 1],
      r[n * 2],
      r[n * 2 + 1],
      r[i * 2],
      r[i * 2 + 1],
      r[o * 2],
      r[o * 2 + 1]
    );
  }
  static intersectSegments = kn;
}
function be(e, t, n) {
  if (t || (t = []), typeof e != "object" || e.type !== "FeatureCollection")
    throw "Argument points must be FeatureCollection";
  if (!Array.isArray(t)) throw "Argument points must be Array of Array";
  const i = e.features.map(
    (c) => c.geometry.coordinates
  ), o = Ge.from(i);
  let r;
  const s = [];
  o.triangles.length !== 0 && t.length !== 0 && (r = new Er(o), r.constrainAll(t));
  for (let c = 0; c < o.triangles.length; c += 3)
    s.push([o.triangles[c], o.triangles[c + 1], o.triangles[c + 2]]);
  const a = ["a", "b", "c"];
  return St(
    s.map((c) => {
      const h = {}, f = c.map((l, u) => {
        const p = e.features[l], _ = p.geometry.coordinates, w = [_[0], _[1]];
        return _.length === 3 ? w[2] = _[2] : h[a[u]] = p.properties[n], w;
      });
      return f[3] = f[0], le([f], h);
    })
  );
}
const kr = 256 * Number.EPSILON;
function Ar(e, t) {
  const n = [e, t].map((o) => {
    const r = o.map((a, c, h) => {
      if (c === 0) return 0;
      const f = h[c - 1];
      return Math.sqrt(
        Math.pow(a[0] - f[0], 2) + Math.pow(a[1] - f[1], 2)
      );
    }), s = r.reduce((a, c, h) => h === 0 ? [0] : (a.push(a[h - 1] + c), a), []);
    return s.map((a, c, h) => {
      const f = a / h[h.length - 1];
      return [o[c], r[c], s[c], f];
    });
  }), i = [];
  return n.forEach((o, r) => {
    const s = n[r ? 0 : 1];
    o.forEach((a, c) => {
      if (c === 0 || c === o.length - 1 || a[4] === "handled")
        return;
      const h = a[0], f = a[3];
      let l, u = 1 / 0;
      for (let p = 1; p < s.length - 1; p++) {
        const _ = s[p];
        if (_[4] === "handled") continue;
        const w = Math.abs(_[3] - f);
        w <= kr && w < u && (l = _, u = w);
      }
      if (l) {
        l[4] = "handled", a[4] = "handled", i.push(
          r === 0 ? [h, l[0], f] : [l[0], h, f]
        );
        return;
      }
      for (let p = 0; p < s.length - 1; p++) {
        const _ = s[p], w = s[p + 1], O = _[3], M = w[3];
        if (O < f && M > f) {
          const m = (f - O) / (M - O), v = [
            (w[0][0] - _[0][0]) * m + _[0][0],
            (w[0][1] - _[0][1]) * m + _[0][1]
          ];
          i.push(
            r === 0 ? [h, v, f] : [v, h, f]
          );
          return;
        }
      }
    });
  }), i.sort((o, r) => o[2] - r[2]);
}
function Ir(e, t) {
  const n = [[], [], [], []], i = [];
  return Object.keys(e).forEach((o) => {
    const r = e[o], s = r.forw, a = r.bakw, c = [
      s[0] - t.forw[0],
      s[1] - t.forw[1]
    ], h = [
      a[0] - t.bakw[0],
      t.bakw[1] - a[1]
    ], f = { forw: c, bakw: h };
    if (i.push(f), c[0] === 0 || c[1] === 0)
      return;
    let l = 0;
    c[0] > 0 && (l += 1), c[1] > 0 && (l += 2), n[l].push(f);
  }), { perQuad: n, aggregate: i };
}
function Or(e) {
  let t = 1 / 0, n = 0, i = 0;
  return e.forEach((o) => {
    const { forw: r, bakw: s } = o, a = Math.hypot(r[0], r[1]), c = Math.hypot(s[0], s[1]);
    if (c === 0) return;
    const h = a / c, f = Math.atan2(r[0], r[1]) - Math.atan2(s[0], s[1]);
    t = Math.min(t, h), n += Math.cos(f), i += Math.sin(f);
  }), isFinite(t) ? [t, Math.atan2(i, n)] : [1, 0];
}
function Pr(e, t, n) {
  const { perQuad: i, aggregate: o } = Ir(e, t), r = i.every((c) => c.length > 0), a = (n === "birdeye" ? r ? i : [o] : [o]).map((c) => Or(c));
  return a.length === 1 ? [a[0], a[0], a[0], a[0]] : a;
}
function Nr(e, t) {
  let n = 0;
  return e[0] > t[0] && (n += 1), e[1] > t[1] && (n += 2), n;
}
function Br(e, t, n) {
  const i = [
    e[0] - t.forw[0],
    e[1] - t.forw[1]
  ], r = Math.sqrt(i[0] ** 2 + i[1] ** 2) / n[0], s = Math.atan2(i[0], i[1]) - n[1];
  return [
    t.bakw[0] + r * Math.sin(s),
    t.bakw[1] - r * Math.cos(s)
  ];
}
function Tr(e, t, n, i) {
  const o = t[0] - e[0], r = t[1] - e[1];
  if (Math.abs(o) < 1e-12 && Math.abs(r) < 1e-12) return null;
  const s = i[0] - n[0], a = i[1] - n[1], c = n[0] - e[0], h = n[1] - e[1], f = o * a - r * s;
  if (Math.abs(f) < 1e-12) return null;
  const l = (c * a - h * s) / f, u = (c * r - h * o) / f;
  return l <= 1e-10 || u < -1e-10 || u > 1 + 1e-10 ? null : { t: l, point: [e[0] + l * o, e[1] + l * r] };
}
function Cr(e, t, n) {
  const i = n.length;
  let o = -1 / 0, r = null;
  for (let s = 0; s < i; s++) {
    const a = (s + 1) % i, c = Tr(
      e,
      t,
      n[s].bakw,
      n[a].bakw
    );
    c && c.t > o && (o = c.t, r = c.point);
  }
  return r;
}
function An(e, t) {
  const i = Math.atan2(e[0] - t[0], e[1] - t[1]) * (180 / Math.PI);
  return i < 0 ? i + 360 : i;
}
function In(e, t, n, i, o, r) {
  const s = t[0] - e[0], a = t[1] - e[1];
  if (s === 0 && a === 0) return null;
  const c = [];
  if (s !== 0)
    for (const f of [n, i]) {
      const l = (f - e[0]) / s;
      if (l > 0) {
        const u = e[1] + l * a;
        u >= o && u <= r && c.push({ t: l, x: f, y: u });
      }
    }
  if (a !== 0)
    for (const f of [o, r]) {
      const l = (f - e[1]) / a;
      if (l > 0) {
        const u = e[0] + l * s;
        u >= n && u <= i && c.push({ t: l, x: u, y: f });
      }
    }
  if (c.length === 0) return null;
  c.sort((f, l) => f.t - l.t);
  const h = c[0];
  return [h.x, h.y];
}
function On(e, t, n) {
  const i = e.length, o = new Array(i).fill(1);
  for (const r of t)
    for (let s = 0; s < i; s++) {
      const a = (s + 1) % i, c = He([e[s].bakw, e[a].bakw]), h = He([n.bakw, r.bakw]), f = Pi(c, h);
      if (f.features.length > 0 && f.features[0].geometry) {
        const l = f.features[0], u = Math.sqrt(
          Math.pow(r.bakw[0] - n.bakw[0], 2) + Math.pow(r.bakw[1] - n.bakw[1], 2)
        ), p = Math.sqrt(
          Math.pow(l.geometry.coordinates[0] - n.bakw[0], 2) + Math.pow(l.geometry.coordinates[1] - n.bakw[1], 2)
        ), _ = u / p;
        _ > o[s] && (o[s] = _), _ > o[a] && (o[a] = _);
      }
    }
  e.forEach((r, s) => {
    const a = o[s];
    r.bakw = [
      (r.bakw[0] - n.bakw[0]) * a + n.bakw[0],
      (r.bakw[1] - n.bakw[1]) * a + n.bakw[1]
    ];
  });
}
function Gn(e, t, n) {
  const { convexBuf: i, centroid: o, allGcps: r, minx: s, maxx: a, miny: c, maxy: h } = e, f = Pr(i, o, t), u = [
    [s, c],
    [a, c],
    [a, h],
    [s, h]
  ].map((g) => ({
    forw: g,
    bakw: Br(
      g,
      o,
      f[Nr(g, o.forw)]
    )
  }));
  if (u.sort(
    (g, E) => Math.atan2(g.forw[0] - o.forw[0], g.forw[1] - o.forw[1]) - Math.atan2(E.forw[0] - o.forw[0], E.forw[1] - o.forw[1])
  ), On(u, r, o), !n) return u;
  const p = 4, _ = u.map(
    (g) => Math.atan2(g.forw[0] - o.forw[0], g.forw[1] - o.forw[1])
  ), w = u.map(
    (g) => Math.atan2(
      g.bakw[0] - o.bakw[0],
      -(g.bakw[1] - o.bakw[1])
    )
  );
  function O(g) {
    for (let E = 0; E < p; E++) {
      const S = (E + 1) % p, k = _[E], P = E < p - 1 ? _[S] : _[S] + 2 * Math.PI;
      let N = g;
      for (; N < k; ) N += 2 * Math.PI;
      for (; N >= k + 2 * Math.PI; ) N -= 2 * Math.PI;
      if (N >= k && N < P)
        return { i: E, j: S, frac: (N - k) / (P - k) };
    }
    return { i: 0, j: 1, frac: 0 };
  }
  function M(g) {
    const { i: E, j: S, frac: k } = O(g), P = w[E];
    let C = w[S] - P;
    for (; C > Math.PI; ) C -= 2 * Math.PI;
    for (; C < -Math.PI; ) C += 2 * Math.PI;
    return P + k * C;
  }
  const m = new Set(
    u.map(
      (g) => Math.floor(An(g.forw, o.forw) / 10) % 36
    )
  ), v = r.map((g) => ({
    forw: g.forw,
    bakw: g.bakw,
    angleDeg: An(g.forw, o.forw),
    forwDist: Math.hypot(g.forw[0] - o.forw[0], g.forw[1] - o.forw[1])
  })), d = [];
  for (let g = 0; g < 36; g++) {
    if (m.has(g)) continue;
    const E = g * 10, S = v.filter(
      (I) => I.angleDeg >= E && I.angleDeg < E + 10
    );
    let k = null;
    if (S.length > 0) {
      const I = S.reduce((A, T) => T.forwDist > A.forwDist ? T : A);
      k = In(o.forw, I.forw, s, a, c, h);
    }
    if (!k) {
      const I = (E + 5) % 360 * (Math.PI / 180), A = [
        o.forw[0] + Math.sin(I),
        o.forw[1] + Math.cos(I)
      ];
      k = In(o.forw, A, s, a, c, h);
    }
    if (!k) continue;
    const P = [k[0] - o.forw[0], k[1] - o.forw[1]], N = Math.atan2(P[0], P[1]), C = M(N), F = [
      o.bakw[0] + Math.sin(C),
      o.bakw[1] - Math.cos(C)
    ], y = Cr(o.bakw, F, u);
    y && d.push({ forw: k, bakw: y });
  }
  const b = [...u, ...d];
  return b.sort(
    (g, E) => Math.atan2(g.forw[0] - o.forw[0], g.forw[1] - o.forw[1]) - Math.atan2(E.forw[0] - o.forw[0], E.forw[1] - o.forw[1])
  ), On(b, r, o), b;
}
function Xr(e, t = !1) {
  return Gn(e, "plain", t);
}
function Dr(e, t = !1) {
  return Gn(e, "birdeye", t);
}
function go(e) {
  return Kn(e, 1 / 0);
}
const Pn = 1e5, $r = 16;
function Kn(e, t) {
  return Fr(e), new Rr(e).findSegmentIntersections(t).map(
    (o) => Yt([o.x, o.y])
  );
}
function Fr(e) {
  for (let t = 0, n = e.length; t < n; t++) {
    const i = e[t];
    ae(i) || jt(
      "findIntersections() received invalid coordinates:",
      `line=${t}`,
      `points=${i}`
    );
    for (let o = 0, r = i.length; o < r; o++) {
      const s = i[o];
      (!ae(s) || !Number.isFinite(s[0]) || !Number.isFinite(s[1])) && jt(
        "findIntersections() received non-finite coordinates:",
        `line=${t}`,
        `point=${o}`,
        `coordinates=${JSON.stringify(s)}`
      );
    }
  }
}
class Rr {
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
    const n = [], i = [], o = t.map((r) => {
      const s = r ? r.length : 0;
      for (let a = 0; a < s; a++)
        n.push(r[a][0]), i.push(r[a][1]);
      return s;
    });
    this.initXYData(o, n, i);
  }
  initXYData(t, n, i) {
    const o = t.length;
    this._xx = new Float64Array(n), this._yy = new Float64Array(i), this._nn = new Uint32Array(t), this._zz = null, this._zlimit = 0, this._filteredArcIter = null, this._ii = new Uint32Array(o);
    let r = 0;
    for (let s = 0; s < o; s++)
      this._ii[s] = r, r += t[s];
    (r != this._xx.length || this._xx.length != this._yy.length) && jt("ArcCollection#initXYData() Counting error"), this.initBounds(), this._arcIter = new oo(this._xx, this._yy);
  }
  initBounds() {
    const t = this.calcArcBounds_(this._xx, this._yy, this._nn);
    this._bb = t.bb, this._allBounds = t.bounds;
  }
  /**
   * データの境界を計算
   * @returns バウンディングボックス情報
   */
  calcArcBounds_(t, n, i) {
    const o = i.length, r = new Float64Array(o * 4), s = new ce();
    let a = 0, c, h, f;
    for (let l = 0; l < o; l++)
      c = i[l], c > 0 && (h = l * 4, f = so(t, n, a, c), r[h++] = f[0], r[h++] = f[1], r[h++] = f[2], r[h] = f[3], a += c, s.mergeBounds(f));
    return {
      bb: r,
      bounds: s
    };
  }
  getBounds() {
    return this._allBounds ? this._allBounds.clone() : new ce();
  }
  // @cb function(i, j, xx, yy)
  forEachSegment(t) {
    let n = 0;
    for (let i = 0, o = this.size(); i < o; i++)
      n += this.forEachArcSegment(i, t);
    return n;
  }
  size() {
    return this._ii && this._ii.length || 0;
  }
  // @cb function(i, j, xx, yy)
  forEachArcSegment(t, n) {
    const i = t >= 0, o = i ? t : ~t, r = this.getRetainedInterval(), s = this._nn[o], a = i ? 1 : -1;
    let c = i ? this._ii[o] : this._ii[o] + s - 1, h = c, f = 0;
    for (let l = 1; l < s; l++)
      h += a, (r === 0 || this._zz[h] >= r) && (n(c, h, this._xx, this._yy), c = h, f++);
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
    const n = t * 4;
    return (!this.buf || this.buf.byteLength < n) && (this.buf = new ArrayBuffer(n)), new Uint32Array(this.buf, 0, t);
  }
  // Return average magnitudes of dx, dy (with simplification)
  getAvgSegment2() {
    let t = 0, n = 0;
    const i = this.forEachSegment(
      (o, r, s, a) => {
        t += Math.abs(s[o] - s[r]), n += Math.abs(a[o] - a[r]);
      }
    );
    return [t / i || 0, n / i || 0];
  }
  /**
   * 交差判定のためのストライプ数を計算
   * 線分の平均長さに基づいて最適な分割数を決定
   */
  calcSegmentIntersectionStripeCount() {
    const t = this.getBounds().height(), n = this.getAvgSegment2()[1];
    let i = 1;
    return n > 0 && t > 0 && (i = Math.ceil(t / n / 20)), i || 1;
  }
  /**
   * 線分の交差を検出
   * ストライプ分割による効率的な判定を実装
   *
   * @param limit - 返す交差点の件数の上限（同じ位置の交差は 1 件に数える）
   * @returns 検出された交差点の配列（同じ位置の重複なし）
   */
  findSegmentIntersections(t = 1 / 0) {
    const n = this.getBounds(), i = n.ymin || 0, o = (n.ymax || 0) - i, r = this.calcSegmentIntersectionStripeCount(), s = new Uint32Array(r), a = r > 1 ? (v) => Math.floor((r - 1) * (v - i) / o) : () => 0, c = r + 1;
    let h;
    this.forEachSegment(
      (v, d, b, g) => {
        let E = a(g[v]);
        const S = a(g[d]);
        let k = 0;
        for (; s[E] = s[E] + 2, E != S; )
          k++, k > c && jt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${r}`,
            `s1=${E}`,
            `s2=${S}`
          ), E += S > E ? 1 : -1;
      }
    );
    const f = this.getUint32Array(Vr(s));
    let l = 0;
    const u = [];
    Ur(s, (v) => {
      const d = l;
      l += v, u.push(f.subarray(d, l));
    }), qr(s, 0), this.forEachSegment(
      (v, d, b, g) => {
        let E = a(g[v]);
        const S = a(g[d]);
        let k, P, N = 0;
        for (; k = s[E], s[E] = k + 2, P = u[E], P[k] = v, P[k + 1] = d, E != S; )
          N++, N > c && jt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${r}`,
            `s1=${E}`,
            `s2=${S}`
          ), E += S > E ? 1 : -1;
      }
    );
    const p = this.getVertexData(), _ = t * $r;
    let w = 0;
    const O = /* @__PURE__ */ new Set(), M = /* @__PURE__ */ new Map(), m = (v) => {
      w++;
      const d = ro(v);
      return O.has(d) || (O.add(d), M.set(`${v.x}:${v.y}`, v)), M.size >= t || w >= _;
    };
    if (p.xx && p.yy)
      for (h = 0; h < r && !jr(u[h], p.xx, p.yy, m); h++)
        ;
    return Array.from(M.values());
  }
}
function jt(...e) {
  const t = e.join(" ");
  throw new Error(t);
}
function ae(e) {
  return e ? Lr(e) ? !0 : Yr(e) ? !1 : e.length === 0 ? !0 : e.length > 0 : !1;
}
function Yr(e) {
  return e != null && e.toString === String.prototype.toString;
}
function Lr(e) {
  return Array.isArray(e);
}
function Vr(e, t) {
  ae(e) || jt("utils.sum() expects an array, received:", e);
  let n = 0, i;
  for (let o = 0, r = e.length; o < r; o++)
    i = e[o], i && (n += i);
  return n;
}
function Ur(e, t, n) {
  if (!ae(e))
    throw new Error(`#forEach() takes an array-like argument. ${e}`);
  for (let i = 0, o = e.length; i < o; i++)
    t.call(n, e[i], i);
}
function qr(e, t) {
  for (let n = 0, i = e.length; n < i; n++)
    e[n] = t;
  return e;
}
function jr(e, t, n, i) {
  const o = e.length - 2;
  let r, s, a, c, h, f, l, u, p, _, w, O, M, m, v, d, b;
  for (eo(t, e), d = 0; d < o; ) {
    for (r = e[d], s = e[d + 1], h = t[r], f = t[s], p = n[r], _ = n[s], b = d; b < o && (b += 2, a = e[b], l = t[a], !(f < l)); ) {
      if (w = n[a], c = e[b + 1], u = t[c], O = n[c], p >= w) {
        if (p > O && _ > w && _ > O) continue;
      } else if (p < O && _ < w && _ < O) continue;
      if (!(r == a || r == c || s == a || s == c) && (M = zr(
        h,
        p,
        f,
        _,
        l,
        w,
        u,
        O
      ), M && (m = [r, s], v = [a, c], i(Bn(M, m, v, t, n)) || M.length == 4 && i(Bn(M.slice(2), m, v, t, n)))))
        return !0;
    }
    d += 2;
  }
  return !1;
}
function zr(e, t, n, i, o, r, s, a) {
  const c = Jr(e, t, n, i, o, r, s, a);
  let h = null;
  return c && (h = Gr(e, t, n, i, o, r, s, a), h ? to(e, t, n, i, o, r, s, a) && (h = null) : h = Zr(e, t, n, i, o, r, s, a)), h;
}
function Jr(e, t, n, i, o, r, s, a) {
  return ie(e, t, n, i, o, r) * ie(e, t, n, i, s, a) <= 0 && ie(o, r, s, a, e, t) * ie(o, r, s, a, n, i) <= 0;
}
function ie(e, t, n, i, o, r) {
  return Qn(e - o, t - r, n - o, i - r);
}
function Qn(e, t, n, i) {
  return e * i - t * n;
}
function Gr(e, t, n, i, o, r, s, a) {
  let c = xe(e, t, n, i, o, r, s, a), h;
  return c && (h = Qr(c[0], c[1], e, t, n, i, o, r, s, a), h == 1 ? c = xe(n, i, e, t, o, r, s, a) : h == 2 ? c = xe(o, r, s, a, e, t, n, i) : h == 3 && (c = xe(s, a, o, r, e, t, n, i))), c && Wr(c, e, t, n, i, o, r, s, a), c;
}
function xe(e, t, n, i, o, r, s, a) {
  const c = Qn(n - e, i - t, s - o, a - r), h = 1e-18;
  let f;
  if (c === 0) return null;
  const l = ie(o, r, s, a, e, t) / c;
  return c <= h && c >= -h ? f = Kr(e, t, n, i, o, r, s, a) : f = [e + l * (n - e), t + l * (i - t)], f;
}
function Kr(e, t, n, i, o, r, s, a) {
  let c = null;
  return !Nt(e, o, s) && !Nt(t, r, a) ? c = [e, t] : !Nt(n, o, s) && !Nt(i, r, a) ? c = [n, i] : !Nt(o, e, n) && !Nt(r, t, i) ? c = [o, r] : !Nt(s, e, n) && !Nt(a, t, i) && (c = [s, a]), c;
}
function Nt(e, t, n) {
  let i;
  return t < n ? i = e < t || e > n : t > n ? i = e > t || e < n : i = e != t, i;
}
function Qr(e, t, ...n) {
  let i = -1, o = 1 / 0, r;
  for (let s = 0, a = 0, c = n.length; a < c; s++, a += 2)
    r = Hr(e, t, n[a], n[a + 1]), r < o && (o = r, i = s);
  return i;
}
function Hr(e, t, n, i) {
  const o = e - n, r = t - i;
  return o * o + r * r;
}
function Wr(e, t, n, i, o, r, s, a, c) {
  let h = e[0], f = e[1];
  h = _e(h, t, i), h = _e(h, r, a), f = _e(f, n, o), f = _e(f, s, c), e[0] = h, e[1] = f;
}
function _e(e, t, n) {
  let i;
  return Nt(e, t, n) && (i = Math.abs(e - t) < Math.abs(e - n) ? t : n, e = i), e;
}
function Zr(e, t, n, i, o, r, s, a) {
  const c = Math.min(e, n, o, s), h = Math.max(e, n, o, s), f = Math.min(t, i, r, a), l = Math.max(t, i, r, a), u = l - f > h - c;
  let p = [];
  return (u ? Rt(t, f, l) : Rt(e, c, h)) && p.push(e, t), (u ? Rt(i, f, l) : Rt(n, c, h)) && p.push(n, i), (u ? Rt(r, f, l) : Rt(o, c, h)) && p.push(o, r), (u ? Rt(a, f, l) : Rt(s, c, h)) && p.push(s, a), (p.length != 2 && p.length != 4 || p.length == 4 && p[0] == p[2] && p[1] == p[3]) && (p = null), p;
}
function to(e, t, n, i, o, r, s, a) {
  return e == o && t == r || e == s && t == a || n == o && i == r || n == s && i == a;
}
function Rt(e, t, n) {
  return e > t && e < n;
}
function eo(e, t) {
  no(e, t), Hn(e, t, 0, t.length - 2);
}
function no(e, t) {
  for (let n = 0, i = t.length; n < i; n += 2)
    e[t[n]] > e[t[n + 1]] && io(t, n, n + 1);
}
function io(e, t, n) {
  const i = e[t];
  e[t] = e[n], e[n] = i;
}
function Hn(e, t, n, i) {
  let o = n, r = i, s, a;
  for (; o < i; ) {
    for (s = e[t[n + i >> 2 << 1]]; o <= r; ) {
      for (; e[t[o]] < s; ) o += 2;
      for (; e[t[r]] > s; ) r -= 2;
      o <= r && (a = t[o], t[o] = t[r], t[r] = a, a = t[o + 1], t[o + 1] = t[r + 1], t[r + 1] = a, o += 2, r -= 2);
    }
    if (r - n < 40 ? Nn(e, t, n, r) : Hn(e, t, n, r), i - o < 40) {
      Nn(e, t, o, i);
      return;
    }
    n = o, r = i;
  }
}
function Nn(e, t, n, i) {
  let o, r;
  for (let s = n + 2; s <= i; s += 2) {
    o = t[s], r = t[s + 1];
    let a;
    for (a = s - 2; a >= n && e[o] < e[t[a]]; a -= 2)
      t[a + 2] = t[a], t[a + 3] = t[a + 1];
    t[a + 2] = o, t[a + 3] = r;
  }
}
function Bn(e, t, n, i, o) {
  const r = e[0], s = e[1];
  t = Tn(r, s, t[0], t[1], i, o), n = Tn(r, s, n[0], n[1], i, o);
  const a = t[0] < n[0] ? t : n, c = a == t ? n : t;
  return { x: r, y: s, a, b: c };
}
function Tn(e, t, n, i, o, r) {
  let s = n < i ? n : i, a = s === n ? i : n;
  return o[s] == e && r[s] == t ? a = s : o[a] == e && r[a] == t && (s = a), [s, a];
}
function ro(e) {
  return `${e.a.join(",")};${e.b.join(",")}`;
}
class oo {
  _i = 0;
  _n = 0;
  _inc = 1;
  _xx;
  _yy;
  i = 0;
  x = 0;
  y = 0;
  constructor(t, n) {
    this._xx = t, this._yy = n;
  }
}
function so(e, t, n, i) {
  let o = n | 0;
  const r = isNaN(i) ? e.length - o : i + o;
  let s, a, c, h, f, l;
  if (r > 0)
    c = f = e[o], h = l = t[o];
  else return [void 0, void 0, void 0, void 0];
  for (o++; o < r; o++)
    s = e[o], a = t[o], s < c && (c = s), s > f && (f = s), a < h && (h = a), a > l && (l = a);
  return [c, h, f, l];
}
class ce {
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
    return new ce(
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
  setBounds(t, n, i, o) {
    let r, s, a, c;
    if (arguments.length == 1)
      if (ae(t)) {
        const h = t;
        r = h[0], s = h[1], a = h[2], c = h[3];
      } else {
        const h = t;
        r = h.xmin, s = h.ymin, a = h.xmax, c = h.ymax;
      }
    else
      r = t, s = n, a = i, c = o;
    return this.xmin = r, this.ymin = s, this.xmax = a, this.ymax = c, (r > a || s > c) && this.update(), this;
  }
  update() {
    let t;
    this.xmin > this.xmax && (t = this.xmin, this.xmin = this.xmax, this.xmax = t), this.ymin > this.ymax && (t = this.ymin, this.ymin = this.ymax, this.ymax = t);
  }
  mergeBounds(t, ...n) {
    let i, o, r, s;
    return t instanceof ce ? (i = t.xmin, o = t.ymin, r = t.xmax, s = t.ymax) : n.length == 3 ? (i = t, o = n[0], r = n[1], s = n[2]) : t.length == 4 ? (i = t[0], o = t[1], r = t[2], s = t[3]) : jt("Bounds#mergeBounds() invalid argument:", t), this.xmin === void 0 ? this.setBounds(i, o, r, s) : (i < this.xmin && (this.xmin = i), o < this.ymin && (this.ymin = o), r > this.xmax && (this.xmax = r), s > this.ymax && (this.ymax = s)), this;
  }
}
function Ae(e) {
  const t = ["a", "b", "c"].map(
    (n) => e.properties[n].index
  );
  return [
    [0, 1],
    [0, 2],
    [1, 2],
    [0, 1, 2]
  ].map(
    (n) => n.map((i) => t[i]).sort().join("-")
  ).sort();
}
function Wn(e, t, n) {
  const i = Ae(t.forw), o = Ae(t.bakw);
  if (JSON.stringify(i) != JSON.stringify(o))
    throw `${JSON.stringify(t, null, 2)}
${JSON.stringify(
      i
    )}
${JSON.stringify(o)}`;
  for (let r = 0; r < i.length; r++) {
    const s = i[r];
    e[s] || (e[s] = []), e[s].push(t);
  }
  n && (n.forw.features.push(t.forw), n.bakw.features.push(t.bakw));
}
function Cn(e, t, n) {
  const i = Ae(t.forw), o = Ae(t.bakw);
  if (JSON.stringify(i) != JSON.stringify(o))
    throw `${JSON.stringify(t, null, 2)}
${JSON.stringify(i)}
${JSON.stringify(o)}`;
  if (i.forEach((r) => {
    const s = e[r];
    if (!s) return;
    const a = s.filter((c) => c !== t);
    a.length === 0 ? delete e[r] : e[r] = a;
  }), n) {
    const r = (s, a) => {
      !s || !a || (s.features = s.features.filter((c) => c !== a));
    };
    r(n.forw, t.forw), r(n.bakw, t.bakw);
  }
}
function Me(e, t, n) {
  return Yt(e, { target: { geom: t, index: n } });
}
function Se(e) {
  return Yt(e.properties.target.geom, {
    target: {
      geom: e.geometry.coordinates,
      index: e.properties.target.index
    }
  });
}
function Xn(e, t) {
  const n = e.length, i = t.geometry.coordinates;
  return Array.from({ length: n }, (o, r) => r).map((o) => {
    const r = (o + 1) % n, s = e[o], a = e[r], c = s.geometry.coordinates, h = Math.atan2(
      c[0] - i[0],
      c[1] - i[1]
    ), f = [t, s, a, t].map(
      (p) => p.geometry.coordinates
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
    }, u = St([
      le([f], l)
    ]);
    return [h, u];
  }).reduce(
    (o, r) => (o[0].push(r[0]), o[1].push(r[1]), o),
    [[], []]
  );
}
function Ee(e, t = 1e-6) {
  const [n, i] = e[0], [o, r] = e[1], [s, a] = e[2];
  return Math.abs((o - n) * (a - i) - (s - n) * (r - i)) < t;
}
function ao(e, t) {
  const n = /* @__PURE__ */ new Set();
  return e.forEach((i) => {
    if (i.length !== 2) return;
    const o = i.map((r) => `${t?.[r] ?? r}`);
    n.add(o.sort().join("-"));
  }), n;
}
function re(e) {
  return ["a", "b", "c"].map((t, n) => ({
    prop: e.properties[t],
    geom: e.geometry.coordinates[0][n]
  }));
}
const co = 10;
function lo(e, t, n, i, o, r) {
  if (!e && !t) return !1;
  const s = e ? 0 : 1, a = 1 - s, c = n[s], h = n[a];
  if (!c || !h) return !1;
  const f = xt(h.geom);
  let l = !1, u = !1;
  for (let p = 0; p <= 1; p++) {
    const _ = i[p];
    if (!_) continue;
    const w = [String(_.prop.index), String(c.prop.index)].sort().join("-"), O = o[w];
    if (!O || O.length < 2) continue;
    const M = O.find(
      (N) => N.bakw !== r[s].bakw
    );
    if (!M) continue;
    const v = re(M.bakw).find(
      (N) => String(N.prop.index) !== String(_.prop.index) && String(N.prop.index) !== String(c.prop.index)
    );
    if (!v) continue;
    l = !0;
    const d = xt(v.geom), b = xt(_.geom), g = xt(c.geom), E = g[0] - b[0], S = g[1] - b[1], k = E * (f[1] - b[1]) - S * (f[0] - b[0]), P = E * (d[1] - b[1]) - S * (d[0] - b[0]);
    if (k * P > 0) {
      u = !0;
      break;
    }
  }
  return l && !u;
}
function ho(e, t, n, i) {
  if (!e && !t) return !1;
  if (n[0] && n[1] && i[0] && i[1]) {
    const o = i.map((f) => xt(f.geom)), r = n.map((f) => xt(f.geom)), s = o[1][0] - o[0][0], a = o[1][1] - o[0][1], c = s * (r[0][1] - o[0][1]) - a * (r[0][0] - o[0][0]), h = s * (r[1][1] - o[0][1]) - a * (r[1][0] - o[0][0]);
    return c * h < 0;
  }
  return !1;
}
function fo(e, t, n, i) {
  const o = ao(n, i), r = /* @__PURE__ */ new Set();
  let s = !1;
  for (let a = 0; a < co; a++) {
    let c = !1;
    for (const h of Object.keys(t)) {
      if (r.has(h)) continue;
      r.add(h);
      const f = t[h];
      if (!f || f.length < 2) continue;
      const l = h.split("-");
      if (l.length !== 2 || o.has(h)) continue;
      const u = re(f[0].bakw), p = re(f[1].bakw), _ = re(f[0].forw), w = re(f[1].forw), O = l.map(
        (x) => u.find((B) => `${B.prop.index}` === x) || p.find((B) => `${B.prop.index}` === x)
      ), M = l.map(
        (x) => _.find((B) => `${B.prop.index}` === x) || w.find((B) => `${B.prop.index}` === x)
      );
      if (O.some((x) => !x) || M.some((x) => !x))
        continue;
      const m = [u, p].map(
        (x) => x.find((B) => !l.includes(`${B.prop.index}`))
      ), v = [_, w].map(
        (x) => x.find((B) => !l.includes(`${B.prop.index}`))
      );
      if (m.some((x) => !x) || v.some((x) => !x))
        continue;
      const d = f[0].bakw.geometry.coordinates[0].slice(0, 3).map((x) => xt(x)), b = f[1].bakw.geometry.coordinates[0].slice(0, 3).map((x) => xt(x)), g = f[0].forw.geometry.coordinates[0].slice(0, 3).map((x) => xt(x)), E = f[1].forw.geometry.coordinates[0].slice(0, 3).map((x) => xt(x)), S = Ee(d), k = Ee(b), P = Ee(g), N = Ee(E), C = lo(
        S,
        k,
        m,
        O,
        t,
        f
      ), F = ho(
        P,
        N,
        m,
        O
      );
      if (!(C || F || Dn(
        xt(m[0].geom),
        b
      ) || Dn(
        xt(m[1].geom),
        d
      )))
        continue;
      const I = M.map(
        (x) => xt(x.geom)
      ), A = v.map(
        (x) => xt(x.geom)
      ), T = uo([
        ...I,
        ...A
      ]), X = po(T), $ = $n(
        I[0],
        I[1],
        A[0]
      ) + $n(
        I[0],
        I[1],
        A[1]
      );
      je(X, $) && (Cn(t, f[0], e), Cn(t, f[1], e), O.forEach((x) => {
        if (!x) return;
        const B = [
          x.geom,
          m[0].geom,
          m[1].geom,
          x.geom
        ], D = {
          a: x.prop,
          b: m[0].prop,
          c: m[1].prop
        }, R = le([B], D), L = zn(R);
        Wn(t, {
          forw: L,
          bakw: R
        }, e);
      }), c = !0, s = !0);
    }
    if (!c) break;
  }
  return s;
}
function xt(e) {
  return [e[0], e[1]];
}
function Dn(e, t) {
  const [n, i] = t[0], [o, r] = t[1], [s, a] = t[2], c = s - n, h = a - i, f = o - n, l = r - i, u = e[0] - n, p = e[1] - i, _ = c * c + h * h, w = c * f + h * l, O = c * u + h * p, M = f * f + l * l, m = f * u + l * p, v = _ * M - w * w;
  if (v === 0) return !1;
  const d = 1 / v, b = (M * O - w * m) * d, g = (_ * m - w * O) * d, E = 1e-9;
  return b >= -E && g >= -E && b + g <= 1 + E;
}
function uo(e) {
  const t = e.map((s) => s.slice()).filter(
    (s, a, c) => c.findIndex(
      (h) => je(h[0], s[0]) && je(h[1], s[1])
    ) === a
  );
  if (t.length <= 1) return t;
  const n = t.sort(
    (s, a) => s[0] === a[0] ? s[1] - a[1] : s[0] - a[0]
  ), i = (s, a, c) => (a[0] - s[0]) * (c[1] - s[1]) - (a[1] - s[1]) * (c[0] - s[0]), o = [];
  for (const s of n) {
    for (; o.length >= 2 && i(
      o[o.length - 2],
      o[o.length - 1],
      s
    ) <= 0; )
      o.pop();
    o.push(s);
  }
  const r = [];
  for (let s = n.length - 1; s >= 0; s--) {
    const a = n[s];
    for (; r.length >= 2 && i(
      r[r.length - 2],
      r[r.length - 1],
      a
    ) <= 0; )
      r.pop();
    r.push(a);
  }
  return r.pop(), o.pop(), o.concat(r);
}
function po(e) {
  if (e.length < 3) return 0;
  let t = 0;
  for (let n = 0; n < e.length; n++) {
    const [i, o] = e[n], [r, s] = e[(n + 1) % e.length];
    t += i * s - r * o;
  }
  return Math.abs(t) / 2;
}
function $n(e, t, n) {
  return Math.abs(
    (e[0] * (t[1] - n[1]) + t[0] * (n[1] - e[1]) + n[0] * (e[1] - t[1])) / 2
  );
}
function je(e, t, n = 1e-9) {
  return Math.abs(e - t) <= n;
}
const Fn = 2.00704, Rn = 3.00001;
class lt extends Mt {
  importance;
  priority;
  pointsSet;
  useV2Algorithm;
  /**
   * Tinクラスのインスタンスを生成します
   * @param options - 初期化オプション
   */
  constructor(t = {}) {
    super(), t.bounds ? this.setBounds(t.bounds) : (this.setWh(t.wh), this.vertexMode = t.vertexMode || lt.VERTEX_PLAIN), this.strictMode = t.strictMode || lt.MODE_AUTO, this.yaxisMode = t.yaxisMode || lt.YAXIS_INVERT, this.importance = t.importance || 0, this.priority = t.priority || 0, this.stateFull = t.stateFull || !1, this.useV2Algorithm = t.useV2Algorithm ?? !1, t.points && this.setPoints(t.points), t.edges && this.setEdges(t.edges);
  }
  /**
   * フォーマットバージョンを取得します
   */
  getFormatVersion() {
    return this.useV2Algorithm ? Fn : Rn;
  }
  /**
   * 制御点（GCP: Ground Control Points）を設定します。
   * 指定した点群に合わせて内部のTINキャッシュをリセットします。
   */
  setPoints(t) {
    this.yaxisMode === lt.YAXIS_FOLLOW && (t = t.map((n) => [
      n[0],
      [n[1][0], -1 * n[1][1]]
    ])), this.points = t, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * エッジ（制約線）を設定します。
   * 制約線を正規化した上で、依存するキャッシュをリセットします。
   */
  setEdges(t = []) {
    this.edges = Jn(t), this.edgeNodes = void 0, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 境界ポリゴンを設定します
   */
  setBounds(t) {
    this.bounds = t;
    let n = t[0][0], i = n, o = t[0][1], r = o;
    const s = [t[0]];
    for (let a = 1; a < t.length; a++) {
      const c = t[a];
      c[0] < n && (n = c[0]), c[0] > i && (i = c[0]), c[1] < o && (o = c[1]), c[1] > r && (r = c[1]), s.push(c);
    }
    s.push(t[0]), this.boundsPolygon = le([s]), this.xy = [n, o], this.wh = [i - n, r - o], this.vertexMode = lt.VERTEX_PLAIN, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 現在の設定を永続化可能な形式にコンパイルします
   */
  getCompiled() {
    const t = {};
    t.version = this.useV2Algorithm ? Fn : Rn, t.points = this.points, t.weight_buffer = {}, t.centroid_point = [
      this.centroid.forw.geometry.coordinates,
      this.centroid.forw.properties.target.geom
    ], t.vertices_params = [
      this.vertices_params.forw[0],
      this.vertices_params.bakw[0]
    ], t.vertices_points = [];
    const n = this.vertices_params.forw[1];
    if (n)
      for (let i = 0; i < n.length; i++) {
        const o = n[i].features[0], r = o.geometry.coordinates[0][1], s = o.properties.b.geom;
        t.vertices_points[i] = [r, s];
      }
    return t.strict_status = this.strict_status, t.tins_points = [[]], this.tins.forw.features.map((i) => {
      t.tins_points[0].push(
        ["a", "b", "c"].map(
          (o) => i.properties[o].index
        )
      );
    }), this.strict_status === lt.STATUS_LOOSE ? (t.tins_points[1] = [], this.tins.bakw.features.map((i) => {
      t.tins_points[1].push(
        ["a", "b", "c"].map(
          (o) => i.properties[o].index
        )
      );
    })) : this.strict_status === lt.STATUS_ERROR && this.kinks?.bakw && (t.kinks_points = this.kinks.bakw.features.map(
      (i) => i.geometry.coordinates
    )), t.yaxisMode = this.yaxisMode, t.vertexMode = this.vertexMode, t.strictMode = this.strictMode, this.bounds ? (t.bounds = this.bounds, t.boundsPolygon = this.boundsPolygon, this.useV2Algorithm && (t.xy = this.xy, t.wh = this.wh)) : t.wh = this.wh, t.edges = this.edges ?? [], t.edgeNodes = this.edgeNodes ?? [], t;
  }
  /**
   * コンパイルされた設定を適用します（v3+フォーマット対応）
   *
   * バージョン3以上のコンパイル済みデータが渡された場合は restoreV3State() を
   * 使用してN頂点対応の復元を行います。それ以外は基底クラスの実装に委譲します。
   */
  setCompiled(t) {
    super.setCompiled(t);
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
  calculateStrictTin(t = Pn) {
    const n = this.tins.forw.features.map(
      (s) => zn(s)
    );
    this.tins.bakw = St(n);
    const i = {};
    this.tins.forw.features.forEach((s, a) => {
      const c = this.tins.bakw.features[a];
      Wn(i, { forw: s, bakw: c });
    });
    const o = (this.pointsSet?.forw.features ?? []).map(
      (s) => s.properties.target.index
    );
    fo(
      this.tins,
      i,
      this.pointsSet?.edges || [],
      o
    );
    const r = ["forw", "bakw"].map((s) => {
      const a = this.tins[s].features.map(
        (c) => c.geometry.coordinates[0]
      );
      return Kn(a, t);
    });
    r[0].length === 0 && r[1].length === 0 ? (this.strict_status = lt.STATUS_STRICT, delete this.kinks) : (this.strict_status = lt.STATUS_ERROR, this.kinks = {
      forw: St(r[0]),
      bakw: St(r[1])
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
      const r = this.points[o][0], s = this.points[o][1], a = Me(r, s, o);
      t.forw.push(a), t.bakw.push(Se(a));
    }
    const n = [];
    let i = 0;
    this.edgeNodes = [], this.edges || (this.edges = []);
    for (let o = 0; o < this.edges.length; o++) {
      const r = this.edges[o][2], s = Object.assign([], this.edges[o][0]), a = Object.assign([], this.edges[o][1]);
      if (mo(r, this.points.length, o), s.length === 0 && a.length === 0) {
        n.push(r);
        continue;
      }
      s.unshift(this.points[r[0]][0]), s.push(this.points[r[1]][0]), a.unshift(this.points[r[0]][1]), a.push(this.points[r[1]][1]), Ar(s, a).map((c, h, f) => {
        this.edgeNodes[i] = [
          c[0],
          c[1]
        ];
        const l = Me(
          c[0],
          c[1],
          `e${i}`
        );
        i++, t.forw.push(l), t.bakw.push(Se(l)), h === 0 ? n.push([r[0], t.forw.length - 1]) : n.push([
          t.forw.length - 2,
          t.forw.length - 1
        ]), h === f.length - 1 && n.push([t.forw.length - 1, r[1]]);
      });
    }
    return {
      forw: t.forw,
      bakw: t.bakw,
      edges: n
    };
  }
  /**
   * 入力データの検証と初期データの準備
   */
  validateAndPrepareInputs() {
    const t = this.xy[0] - 0.05 * this.wh[0], n = this.xy[0] + 1.05 * this.wh[0], i = this.xy[1] - 0.05 * this.wh[1], o = this.xy[1] + 1.05 * this.wh[1];
    if (this.bounds && !this.boundsPolygon) throw new Error("Internal error: bounds is set but boundsPolygon is missing");
    const r = this.bounds ? this.boundsPolygon : void 0;
    if (!this.points.reduce((c, h) => c && (r ? De(h[0], r) : h[0][0] >= t && h[0][0] <= n && h[0][1] >= i && h[0][1] <= o), !0))
      throw "SOME POINTS OUTSIDE";
    let a = [];
    return this.wh && (a = [[t, i], [n, i], [t, o], [n, o]]), {
      pointsSet: this.generatePointsSet(),
      bbox: a,
      minx: t,
      maxx: n,
      miny: i,
      maxy: o
    };
  }
  /**
   * Compute a bounding box derived from GCP coordinates with a 5% margin.
   * Used in V3 plain mode where no explicit image bounds are available.
   */
  computeGcpBbox() {
    let t = 1 / 0, n = -1 / 0, i = 1 / 0, o = -1 / 0;
    for (const a of this.points) {
      const c = a[0][0], h = a[0][1];
      c < t && (t = c), c > n && (n = c), h < i && (i = h), h > o && (o = h);
    }
    const r = n - t, s = o - i;
    return {
      minx: t - 0.05 * r,
      maxx: n + 0.05 * r,
      miny: i - 0.05 * s,
      maxy: o + 0.05 * s
    };
  }
  /**
   * TINネットワークを同期的に更新し、座標変換の準備を行います。
   * 重めの計算を伴うため、呼び出し側が非同期制御を行いたい場合は
   * {@link updateTinAsync} を利用してください。
   */
  updateTin() {
    let t = this.strictMode;
    t !== lt.MODE_STRICT && t !== lt.MODE_LOOSE && (t = lt.MODE_AUTO);
    const n = !this.useV2Algorithm;
    let i, o, r, s, a;
    if (n) {
      if (this.bounds) {
        const S = this.boundsPolygon;
        if (!S) throw new Error("Internal error: bounds is set but boundsPolygon is missing");
        if (!this.points.every(
          (P) => De(P[0], S)
        )) throw "SOME POINTS OUTSIDE";
      }
      i = this.generatePointsSet(), { minx: o, maxx: r, miny: s, maxy: a } = this.computeGcpBbox();
    } else {
      const S = this.validateAndPrepareInputs();
      i = S.pointsSet, o = S.minx, r = S.maxx, s = S.miny, a = S.maxy;
    }
    const c = {
      forw: St(i.forw),
      bakw: St(i.bakw)
    }, h = be(
      c.forw,
      i.edges,
      "target"
    ), f = be(
      c.bakw,
      i.edges,
      "target"
    );
    if (h.features.length === 0 || f.features.length === 0)
      throw "TOO LINEAR1";
    const l = Ti(c.forw), u = mn(c.forw);
    if (!u) throw "TOO LINEAR2";
    const p = {}, _ = u.geometry.coordinates[0];
    let w;
    try {
      w = _.map((S) => ({
        forw: S,
        bakw: ne(Yt(S), h)
      })), w.forEach((S) => {
        p[`${S.forw[0]}:${S.forw[1]}`] = S;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const O = mn(c.bakw);
    if (!O) throw "TOO LINEAR2";
    const M = O.geometry.coordinates[0];
    try {
      w = M.map((S) => ({
        bakw: S,
        forw: ne(Yt(S), f)
      })), w.forEach((S) => {
        p[`${S.forw[0]}:${S.forw[1]}`] = S;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    let m;
    if (n) {
      const S = l.geometry.coordinates, k = h.features.find(
        (P) => De(
          Yt(S),
          P
        )
      );
      if (k) {
        const P = k.geometry.coordinates[0], N = k.properties.a.geom, C = k.properties.b.geom, F = k.properties.c.geom;
        m = {
          forw: [
            (P[0][0] + P[1][0] + P[2][0]) / 3,
            (P[0][1] + P[1][1] + P[2][1]) / 3
          ],
          bakw: [
            (N[0] + C[0] + F[0]) / 3,
            (N[1] + C[1] + F[1]) / 3
          ]
        };
      } else
        m = {
          forw: S,
          bakw: ne(l, h)
        };
    } else
      m = {
        forw: l.geometry.coordinates,
        bakw: ne(l, h)
      };
    const v = Me(m.forw, m.bakw, "c");
    this.centroid = {
      forw: v,
      bakw: Se(v)
    };
    const d = [
      ...this.points.map((S) => ({ forw: S[0], bakw: S[1] })),
      ...(this.edgeNodes ?? []).map((S) => ({ forw: S[0], bakw: S[1] }))
    ], b = {
      convexBuf: p,
      centroid: m,
      allGcps: d,
      minx: o,
      maxx: r,
      miny: s,
      maxy: a
    }, g = this.vertexMode === lt.VERTEX_BIRDEYE ? Dr(b, n) : Xr(b, n), E = {
      forw: [],
      bakw: []
    };
    for (let S = 0; S < g.length; S++) {
      const k = g[S].forw, P = g[S].bakw, N = Me(k, P, `b${S}`), C = Se(N);
      i.forw.push(N), i.bakw.push(C), E.forw.push(N), E.bakw.push(C);
    }
    this.pointsSet = {
      forw: St(i.forw),
      bakw: St(i.bakw),
      edges: i.edges
    }, this.tins = {
      forw: _n(
        be(
          this.pointsSet.forw,
          i.edges,
          "target"
        )
      )
    }, (t === lt.MODE_STRICT || t === lt.MODE_AUTO) && this.calculateStrictTin(
      t === lt.MODE_AUTO ? 1 : Pn
    ), (t === lt.MODE_LOOSE || t === lt.MODE_AUTO && this.strict_status === lt.STATUS_ERROR) && (this.tins.bakw = _n(
      be(
        this.pointsSet.bakw,
        i.edges,
        "target"
      )
    ), delete this.kinks, this.strict_status = lt.STATUS_LOOSE), this.vertices_params = {
      forw: Xn(E.forw, this.centroid.forw),
      bakw: Xn(E.bakw, this.centroid.bakw)
    }, this.addIndexedTin(), this.pointsWeightBuffer = {};
  }
  /**
   * 非同期ラッパーを提供します。
   * 互換性のために Promise ベースの API を維持しますが、内部処理は同期的です。
   */
  async updateTinAsync() {
    this.updateTin();
  }
}
function mo(e, t, n) {
  const i = (o) => Number.isInteger(o) && o >= 0 && o < t;
  if (!Array.isArray(e) || !i(e[0]) || !i(e[1]))
    throw new Error(
      `Invalid edge at edges[${n}]: start/end ${JSON.stringify(e)} must be integer indices of points (0 to ${t - 1})`
    );
}
export {
  lt as Tin,
  be as constrainedTin,
  Se as counterPoint,
  Me as createPoint,
  lt as default,
  go as findIntersections,
  Fn as format_version,
  Wn as insertSearchIndex,
  Xn as vertexCalc
};
