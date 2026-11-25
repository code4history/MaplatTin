function oe(e, t, n = {}) {
  const i = { type: "Feature" };
  return (n.id === 0 || n.id) && (i.id = n.id), n.bbox && (i.bbox = n.bbox), i.properties = t || {}, i.geometry = e, i;
}
function Rt(e, t, n = {}) {
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
    for (var i, o, r, s, a, l, h, u = 0, c = 0, f, d = e.type, x = d === "FeatureCollection", w = d === "Feature", O = x ? e.features.length : 1, b = 0; b < O; b++) {
      h = x ? (
        // @ts-expect-error: Known type conflict
        e.features[b].geometry
      ) : w ? (
        // @ts-expect-error: Known type conflict
        e.geometry
      ) : e, f = h ? h.type === "GeometryCollection" : !1, a = f ? h.geometries.length : 1;
      for (var m = 0; m < a; m++) {
        var M = 0, p = 0;
        if (s = f ? h.geometries[m] : h, s !== null) {
          l = s.coordinates;
          var y = s.type;
          switch (u = n && (y === "Polygon" || y === "MultiPolygon") ? 1 : 0, y) {
            case null:
              break;
            case "Point":
              if (
                // @ts-expect-error: Known type conflict
                t(
                  l,
                  c,
                  b,
                  M,
                  p
                ) === !1
              )
                return !1;
              c++, M++;
              break;
            case "LineString":
            case "MultiPoint":
              for (i = 0; i < l.length; i++) {
                if (
                  // @ts-expect-error: Known type conflict
                  t(
                    l[i],
                    c,
                    b,
                    M,
                    p
                  ) === !1
                )
                  return !1;
                c++, y === "MultiPoint" && M++;
              }
              y === "LineString" && M++;
              break;
            case "Polygon":
            case "MultiLineString":
              for (i = 0; i < l.length; i++) {
                for (o = 0; o < l[i].length - u; o++) {
                  if (
                    // @ts-expect-error: Known type conflict
                    t(
                      l[i][o],
                      c,
                      b,
                      M,
                      p
                    ) === !1
                  )
                    return !1;
                  c++;
                }
                y === "MultiLineString" && M++, y === "Polygon" && p++;
              }
              y === "Polygon" && M++;
              break;
            case "MultiPolygon":
              for (i = 0; i < l.length; i++) {
                for (p = 0, o = 0; o < l[i].length; o++) {
                  for (r = 0; r < l[i][o].length - u; r++) {
                    if (
                      // @ts-expect-error: Known type conflict
                      t(
                        l[i][o][r],
                        c,
                        b,
                        M,
                        p
                      ) === !1
                    )
                      return !1;
                    c++;
                  }
                  p++;
                }
                M++;
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
const pt = 11102230246251565e-32, j = 134217729, Rn = (3 + 8 * pt) * pt;
function ft(e, t, n, i, o) {
  let r, s, a, l, h = t[0], u = i[0], c = 0, f = 0;
  u > h == u > -h ? (r = h, h = t[++c]) : (r = u, u = i[++f]);
  let d = 0;
  if (c < e && f < n)
    for (u > h == u > -h ? (s = h + r, a = r - (s - h), h = t[++c]) : (s = u + r, a = r - (s - u), u = i[++f]), r = s, a !== 0 && (o[d++] = a); c < e && f < n; )
      u > h == u > -h ? (s = r + h, l = s - r, a = r - (s - l) + (h - l), h = t[++c]) : (s = r + u, l = s - r, a = r - (s - l) + (u - l), u = i[++f]), r = s, a !== 0 && (o[d++] = a);
  for (; c < e; )
    s = r + h, l = s - r, a = r - (s - l) + (h - l), h = t[++c], r = s, a !== 0 && (o[d++] = a);
  for (; f < n; )
    s = r + u, l = s - r, a = r - (s - l) + (u - l), u = i[++f], r = s, a !== 0 && (o[d++] = a);
  return (r !== 0 || d === 0) && (o[d++] = r), d;
}
function _t(e, t, n, i, o, r, s, a) {
  return ft(ft(e, t, n, i, s), s, o, r, a);
}
function R(e, t, n, i) {
  let o, r, s, a, l, h, u, c, f, d, x;
  u = j * n, d = u - (u - n), x = n - d;
  let w = t[0];
  o = w * n, u = j * w, c = u - (u - w), f = w - c, s = f * x - (o - c * d - f * d - c * x);
  let O = 0;
  s !== 0 && (i[O++] = s);
  for (let b = 1; b < e; b++)
    w = t[b], a = w * n, u = j * w, c = u - (u - w), f = w - c, l = f * x - (a - c * d - f * d - c * x), r = o + l, h = r - o, s = o - (r - h) + (l - h), s !== 0 && (i[O++] = s), o = a + r, s = r - (o - a), s !== 0 && (i[O++] = s);
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
  let a, l, h, u, c, f, d, x, w, O, b, m, M, p, y, g, E, S;
  const k = e - o, P = n - o, B = t - r, C = i - r;
  p = k * C, f = j * k, d = f - (f - k), x = k - d, f = j * C, w = f - (f - C), O = C - w, y = x * O - (p - d * w - x * w - d * O), g = B * P, f = j * B, d = f - (f - B), x = B - d, f = j * P, w = f - (f - P), O = P - w, E = x * O - (g - d * w - x * w - d * O), b = y - E, c = y - b, zt[0] = y - (b + c) + (c - E), m = p + b, c = m - p, M = p - (m - c) + (b - c), b = M - g, c = M - b, zt[1] = M - (b + c) + (c - g), S = m + b, c = S - m, zt[2] = m - (S - c) + (b - c), zt[3] = S;
  let F = Ln(4, zt), v = si * s;
  if (F >= v || -F >= v || (c = e - k, a = e - (k + c) + (c - o), c = n - P, h = n - (P + c) + (c - o), c = t - B, l = t - (B + c) + (c - r), c = i - C, u = i - (C + c) + (c - r), a === 0 && l === 0 && h === 0 && u === 0) || (v = ai * s + Rn * Math.abs(F), F += k * u + C * a - (B * h + P * l), F >= v || -F >= v)) return F;
  p = a * C, f = j * a, d = f - (f - a), x = a - d, f = j * C, w = f - (f - C), O = C - w, y = x * O - (p - d * w - x * w - d * O), g = l * P, f = j * l, d = f - (f - l), x = l - d, f = j * P, w = f - (f - P), O = P - w, E = x * O - (g - d * w - x * w - d * O), b = y - E, c = y - b, mt[0] = y - (b + c) + (c - E), m = p + b, c = m - p, M = p - (m - c) + (b - c), b = M - g, c = M - b, mt[1] = M - (b + c) + (c - g), S = m + b, c = S - m, mt[2] = m - (S - c) + (b - c), mt[3] = S;
  const I = ft(4, zt, 4, mt, Ze);
  p = k * u, f = j * k, d = f - (f - k), x = k - d, f = j * u, w = f - (f - u), O = u - w, y = x * O - (p - d * w - x * w - d * O), g = B * h, f = j * B, d = f - (f - B), x = B - d, f = j * h, w = f - (f - h), O = h - w, E = x * O - (g - d * w - x * w - d * O), b = y - E, c = y - b, mt[0] = y - (b + c) + (c - E), m = p + b, c = m - p, M = p - (m - c) + (b - c), b = M - g, c = M - b, mt[1] = M - (b + c) + (c - g), S = m + b, c = S - m, mt[2] = m - (S - c) + (b - c), mt[3] = S;
  const A = ft(I, Ze, 4, mt, tn);
  p = a * u, f = j * a, d = f - (f - a), x = a - d, f = j * u, w = f - (f - u), O = u - w, y = x * O - (p - d * w - x * w - d * O), g = l * h, f = j * l, d = f - (f - l), x = l - d, f = j * h, w = f - (f - h), O = h - w, E = x * O - (g - d * w - x * w - d * O), b = y - E, c = y - b, mt[0] = y - (b + c) + (c - E), m = p + b, c = m - p, M = p - (m - c) + (b - c), b = M - g, c = M - b, mt[1] = M - (b + c) + (c - g), S = m + b, c = S - m, mt[2] = m - (S - c) + (b - c), mt[3] = S;
  const T = ft(A, tn, 4, mt, en);
  return en[T - 1];
}
function Ot(e, t, n, i, o, r) {
  const s = (t - r) * (n - o), a = (e - o) * (i - r), l = s - a, h = Math.abs(s + a);
  return Math.abs(l) >= oi * h ? l : -ci(e, t, n, i, o, r, h);
}
const li = (10 + 96 * pt) * pt, hi = (4 + 48 * pt) * pt, fi = (44 + 576 * pt) * pt * pt, Xt = tt(4), Dt = tt(4), $t = tt(4), Et = tt(4), kt = tt(4), At = tt(4), gt = tt(4), wt = tt(4), Oe = tt(8), Pe = tt(8), Be = tt(8), Ne = tt(8), Te = tt(8), Ce = tt(8), ue = tt(8), de = tt(8), pe = tt(8), Lt = tt(4), Vt = tt(4), qt = tt(4), z = tt(8), K = tt(16), nt = tt(16), it = tt(16), et = tt(32), Ft = tt(32), at = tt(48), bt = tt(64);
let Qt = tt(1152), Xe = tt(1152);
function ct(e, t, n) {
  e = ft(e, Qt, t, n, Xe);
  const i = Qt;
  return Qt = Xe, Xe = i, e;
}
function ui(e, t, n, i, o, r, s, a, l) {
  let h, u, c, f, d, x, w, O, b, m, M, p, y, g, E, S, k, P, B, C, F, v, I, A, T, X, $, _, N, D, Y, L, V, U, q;
  const G = e - s, J = n - s, Q = o - s, H = t - a, Z = i - a, W = r - a;
  Y = J * W, I = j * J, A = I - (I - J), T = J - A, I = j * W, X = I - (I - W), $ = W - X, L = T * $ - (Y - A * X - T * X - A * $), V = Q * Z, I = j * Q, A = I - (I - Q), T = Q - A, I = j * Z, X = I - (I - Z), $ = Z - X, U = T * $ - (V - A * X - T * X - A * $), _ = L - U, v = L - _, Xt[0] = L - (_ + v) + (v - U), N = Y + _, v = N - Y, D = Y - (N - v) + (_ - v), _ = D - V, v = D - _, Xt[1] = D - (_ + v) + (v - V), q = N + _, v = q - N, Xt[2] = N - (q - v) + (_ - v), Xt[3] = q, Y = Q * H, I = j * Q, A = I - (I - Q), T = Q - A, I = j * H, X = I - (I - H), $ = H - X, L = T * $ - (Y - A * X - T * X - A * $), V = G * W, I = j * G, A = I - (I - G), T = G - A, I = j * W, X = I - (I - W), $ = W - X, U = T * $ - (V - A * X - T * X - A * $), _ = L - U, v = L - _, Dt[0] = L - (_ + v) + (v - U), N = Y + _, v = N - Y, D = Y - (N - v) + (_ - v), _ = D - V, v = D - _, Dt[1] = D - (_ + v) + (v - V), q = N + _, v = q - N, Dt[2] = N - (q - v) + (_ - v), Dt[3] = q, Y = G * Z, I = j * G, A = I - (I - G), T = G - A, I = j * Z, X = I - (I - Z), $ = Z - X, L = T * $ - (Y - A * X - T * X - A * $), V = J * H, I = j * J, A = I - (I - J), T = J - A, I = j * H, X = I - (I - H), $ = H - X, U = T * $ - (V - A * X - T * X - A * $), _ = L - U, v = L - _, $t[0] = L - (_ + v) + (v - U), N = Y + _, v = N - Y, D = Y - (N - v) + (_ - v), _ = D - V, v = D - _, $t[1] = D - (_ + v) + (v - V), q = N + _, v = q - N, $t[2] = N - (q - v) + (_ - v), $t[3] = q, h = ft(
    ft(
      ft(
        R(R(4, Xt, G, z), z, G, K),
        K,
        R(R(4, Xt, H, z), z, H, nt),
        nt,
        et
      ),
      et,
      ft(
        R(R(4, Dt, J, z), z, J, K),
        K,
        R(R(4, Dt, Z, z), z, Z, nt),
        nt,
        Ft
      ),
      Ft,
      bt
    ),
    bt,
    ft(
      R(R(4, $t, Q, z), z, Q, K),
      K,
      R(R(4, $t, W, z), z, W, nt),
      nt,
      et
    ),
    et,
    Qt
  );
  let st = Ln(h, Qt), ht = hi * l;
  if (st >= ht || -st >= ht || (v = e - G, u = e - (G + v) + (v - s), v = t - H, d = t - (H + v) + (v - a), v = n - J, c = n - (J + v) + (v - s), v = i - Z, x = i - (Z + v) + (v - a), v = o - Q, f = o - (Q + v) + (v - s), v = r - W, w = r - (W + v) + (v - a), u === 0 && c === 0 && f === 0 && d === 0 && x === 0 && w === 0) || (ht = fi * l + Rn * Math.abs(st), st += (G * G + H * H) * (J * w + W * c - (Z * f + Q * x)) + 2 * (G * u + H * d) * (J * W - Z * Q) + ((J * J + Z * Z) * (Q * d + H * f - (W * u + G * w)) + 2 * (J * c + Z * x) * (Q * H - W * G)) + ((Q * Q + W * W) * (G * x + Z * u - (H * c + J * d)) + 2 * (Q * f + W * w) * (G * Z - H * J)), st >= ht || -st >= ht))
    return st;
  if ((c !== 0 || x !== 0 || f !== 0 || w !== 0) && (Y = G * G, I = j * G, A = I - (I - G), T = G - A, L = T * T - (Y - A * A - (A + A) * T), V = H * H, I = j * H, A = I - (I - H), T = H - A, U = T * T - (V - A * A - (A + A) * T), _ = L + U, v = _ - L, Et[0] = L - (_ - v) + (U - v), N = Y + _, v = N - Y, D = Y - (N - v) + (_ - v), _ = D + V, v = _ - D, Et[1] = D - (_ - v) + (V - v), q = N + _, v = q - N, Et[2] = N - (q - v) + (_ - v), Et[3] = q), (f !== 0 || w !== 0 || u !== 0 || d !== 0) && (Y = J * J, I = j * J, A = I - (I - J), T = J - A, L = T * T - (Y - A * A - (A + A) * T), V = Z * Z, I = j * Z, A = I - (I - Z), T = Z - A, U = T * T - (V - A * A - (A + A) * T), _ = L + U, v = _ - L, kt[0] = L - (_ - v) + (U - v), N = Y + _, v = N - Y, D = Y - (N - v) + (_ - v), _ = D + V, v = _ - D, kt[1] = D - (_ - v) + (V - v), q = N + _, v = q - N, kt[2] = N - (q - v) + (_ - v), kt[3] = q), (u !== 0 || d !== 0 || c !== 0 || x !== 0) && (Y = Q * Q, I = j * Q, A = I - (I - Q), T = Q - A, L = T * T - (Y - A * A - (A + A) * T), V = W * W, I = j * W, A = I - (I - W), T = W - A, U = T * T - (V - A * A - (A + A) * T), _ = L + U, v = _ - L, At[0] = L - (_ - v) + (U - v), N = Y + _, v = N - Y, D = Y - (N - v) + (_ - v), _ = D + V, v = _ - D, At[1] = D - (_ - v) + (V - v), q = N + _, v = q - N, At[2] = N - (q - v) + (_ - v), At[3] = q), u !== 0 && (O = R(4, Xt, u, Oe), h = ct(h, _t(
    R(O, Oe, 2 * G, K),
    K,
    R(R(4, At, u, z), z, Z, nt),
    nt,
    R(R(4, kt, u, z), z, -W, it),
    it,
    et,
    at
  ), at)), d !== 0 && (b = R(4, Xt, d, Pe), h = ct(h, _t(
    R(b, Pe, 2 * H, K),
    K,
    R(R(4, kt, d, z), z, Q, nt),
    nt,
    R(R(4, At, d, z), z, -J, it),
    it,
    et,
    at
  ), at)), c !== 0 && (m = R(4, Dt, c, Be), h = ct(h, _t(
    R(m, Be, 2 * J, K),
    K,
    R(R(4, Et, c, z), z, W, nt),
    nt,
    R(R(4, At, c, z), z, -H, it),
    it,
    et,
    at
  ), at)), x !== 0 && (M = R(4, Dt, x, Ne), h = ct(h, _t(
    R(M, Ne, 2 * Z, K),
    K,
    R(R(4, At, x, z), z, G, nt),
    nt,
    R(R(4, Et, x, z), z, -Q, it),
    it,
    et,
    at
  ), at)), f !== 0 && (p = R(4, $t, f, Te), h = ct(h, _t(
    R(p, Te, 2 * Q, K),
    K,
    R(R(4, kt, f, z), z, H, nt),
    nt,
    R(R(4, Et, f, z), z, -Z, it),
    it,
    et,
    at
  ), at)), w !== 0 && (y = R(4, $t, w, Ce), h = ct(h, _t(
    R(y, Ce, 2 * W, K),
    K,
    R(R(4, Et, w, z), z, J, nt),
    nt,
    R(R(4, kt, w, z), z, -G, it),
    it,
    et,
    at
  ), at)), u !== 0 || d !== 0) {
    if (c !== 0 || x !== 0 || f !== 0 || w !== 0 ? (Y = c * W, I = j * c, A = I - (I - c), T = c - A, I = j * W, X = I - (I - W), $ = W - X, L = T * $ - (Y - A * X - T * X - A * $), V = J * w, I = j * J, A = I - (I - J), T = J - A, I = j * w, X = I - (I - w), $ = w - X, U = T * $ - (V - A * X - T * X - A * $), _ = L + U, v = _ - L, gt[0] = L - (_ - v) + (U - v), N = Y + _, v = N - Y, D = Y - (N - v) + (_ - v), _ = D + V, v = _ - D, gt[1] = D - (_ - v) + (V - v), q = N + _, v = q - N, gt[2] = N - (q - v) + (_ - v), gt[3] = q, Y = f * -Z, I = j * f, A = I - (I - f), T = f - A, I = j * -Z, X = I - (I - -Z), $ = -Z - X, L = T * $ - (Y - A * X - T * X - A * $), V = Q * -x, I = j * Q, A = I - (I - Q), T = Q - A, I = j * -x, X = I - (I - -x), $ = -x - X, U = T * $ - (V - A * X - T * X - A * $), _ = L + U, v = _ - L, wt[0] = L - (_ - v) + (U - v), N = Y + _, v = N - Y, D = Y - (N - v) + (_ - v), _ = D + V, v = _ - D, wt[1] = D - (_ - v) + (V - v), q = N + _, v = q - N, wt[2] = N - (q - v) + (_ - v), wt[3] = q, E = ft(4, gt, 4, wt, de), Y = c * w, I = j * c, A = I - (I - c), T = c - A, I = j * w, X = I - (I - w), $ = w - X, L = T * $ - (Y - A * X - T * X - A * $), V = f * x, I = j * f, A = I - (I - f), T = f - A, I = j * x, X = I - (I - x), $ = x - X, U = T * $ - (V - A * X - T * X - A * $), _ = L - U, v = L - _, Vt[0] = L - (_ + v) + (v - U), N = Y + _, v = N - Y, D = Y - (N - v) + (_ - v), _ = D - V, v = D - _, Vt[1] = D - (_ + v) + (v - V), q = N + _, v = q - N, Vt[2] = N - (q - v) + (_ - v), Vt[3] = q, P = 4) : (de[0] = 0, E = 1, Vt[0] = 0, P = 1), u !== 0) {
      const rt = R(E, de, u, it);
      h = ct(h, ft(
        R(O, Oe, u, K),
        K,
        R(rt, it, 2 * G, et),
        et,
        at
      ), at);
      const ot = R(P, Vt, u, z);
      h = ct(h, _t(
        R(ot, z, 2 * G, K),
        K,
        R(ot, z, u, nt),
        nt,
        R(rt, it, u, et),
        et,
        Ft,
        bt
      ), bt), x !== 0 && (h = ct(h, R(R(4, At, u, z), z, x, K), K)), w !== 0 && (h = ct(h, R(R(4, kt, -u, z), z, w, K), K));
    }
    if (d !== 0) {
      const rt = R(E, de, d, it);
      h = ct(h, ft(
        R(b, Pe, d, K),
        K,
        R(rt, it, 2 * H, et),
        et,
        at
      ), at);
      const ot = R(P, Vt, d, z);
      h = ct(h, _t(
        R(ot, z, 2 * H, K),
        K,
        R(ot, z, d, nt),
        nt,
        R(rt, it, d, et),
        et,
        Ft,
        bt
      ), bt);
    }
  }
  if (c !== 0 || x !== 0) {
    if (f !== 0 || w !== 0 || u !== 0 || d !== 0 ? (Y = f * H, I = j * f, A = I - (I - f), T = f - A, I = j * H, X = I - (I - H), $ = H - X, L = T * $ - (Y - A * X - T * X - A * $), V = Q * d, I = j * Q, A = I - (I - Q), T = Q - A, I = j * d, X = I - (I - d), $ = d - X, U = T * $ - (V - A * X - T * X - A * $), _ = L + U, v = _ - L, gt[0] = L - (_ - v) + (U - v), N = Y + _, v = N - Y, D = Y - (N - v) + (_ - v), _ = D + V, v = _ - D, gt[1] = D - (_ - v) + (V - v), q = N + _, v = q - N, gt[2] = N - (q - v) + (_ - v), gt[3] = q, C = -W, F = -w, Y = u * C, I = j * u, A = I - (I - u), T = u - A, I = j * C, X = I - (I - C), $ = C - X, L = T * $ - (Y - A * X - T * X - A * $), V = G * F, I = j * G, A = I - (I - G), T = G - A, I = j * F, X = I - (I - F), $ = F - X, U = T * $ - (V - A * X - T * X - A * $), _ = L + U, v = _ - L, wt[0] = L - (_ - v) + (U - v), N = Y + _, v = N - Y, D = Y - (N - v) + (_ - v), _ = D + V, v = _ - D, wt[1] = D - (_ - v) + (V - v), q = N + _, v = q - N, wt[2] = N - (q - v) + (_ - v), wt[3] = q, S = ft(4, gt, 4, wt, pe), Y = f * d, I = j * f, A = I - (I - f), T = f - A, I = j * d, X = I - (I - d), $ = d - X, L = T * $ - (Y - A * X - T * X - A * $), V = u * w, I = j * u, A = I - (I - u), T = u - A, I = j * w, X = I - (I - w), $ = w - X, U = T * $ - (V - A * X - T * X - A * $), _ = L - U, v = L - _, qt[0] = L - (_ + v) + (v - U), N = Y + _, v = N - Y, D = Y - (N - v) + (_ - v), _ = D - V, v = D - _, qt[1] = D - (_ + v) + (v - V), q = N + _, v = q - N, qt[2] = N - (q - v) + (_ - v), qt[3] = q, B = 4) : (pe[0] = 0, S = 1, qt[0] = 0, B = 1), c !== 0) {
      const rt = R(S, pe, c, it);
      h = ct(h, ft(
        R(m, Be, c, K),
        K,
        R(rt, it, 2 * J, et),
        et,
        at
      ), at);
      const ot = R(B, qt, c, z);
      h = ct(h, _t(
        R(ot, z, 2 * J, K),
        K,
        R(ot, z, c, nt),
        nt,
        R(rt, it, c, et),
        et,
        Ft,
        bt
      ), bt), w !== 0 && (h = ct(h, R(R(4, Et, c, z), z, w, K), K)), d !== 0 && (h = ct(h, R(R(4, At, -c, z), z, d, K), K));
    }
    if (x !== 0) {
      const rt = R(S, pe, x, it);
      h = ct(h, ft(
        R(M, Ne, x, K),
        K,
        R(rt, it, 2 * Z, et),
        et,
        at
      ), at);
      const ot = R(B, qt, x, z);
      h = ct(h, _t(
        R(ot, z, 2 * Z, K),
        K,
        R(ot, z, x, nt),
        nt,
        R(rt, it, x, et),
        et,
        Ft,
        bt
      ), bt);
    }
  }
  if (f !== 0 || w !== 0) {
    if (u !== 0 || d !== 0 || c !== 0 || x !== 0 ? (Y = u * Z, I = j * u, A = I - (I - u), T = u - A, I = j * Z, X = I - (I - Z), $ = Z - X, L = T * $ - (Y - A * X - T * X - A * $), V = G * x, I = j * G, A = I - (I - G), T = G - A, I = j * x, X = I - (I - x), $ = x - X, U = T * $ - (V - A * X - T * X - A * $), _ = L + U, v = _ - L, gt[0] = L - (_ - v) + (U - v), N = Y + _, v = N - Y, D = Y - (N - v) + (_ - v), _ = D + V, v = _ - D, gt[1] = D - (_ - v) + (V - v), q = N + _, v = q - N, gt[2] = N - (q - v) + (_ - v), gt[3] = q, C = -H, F = -d, Y = c * C, I = j * c, A = I - (I - c), T = c - A, I = j * C, X = I - (I - C), $ = C - X, L = T * $ - (Y - A * X - T * X - A * $), V = J * F, I = j * J, A = I - (I - J), T = J - A, I = j * F, X = I - (I - F), $ = F - X, U = T * $ - (V - A * X - T * X - A * $), _ = L + U, v = _ - L, wt[0] = L - (_ - v) + (U - v), N = Y + _, v = N - Y, D = Y - (N - v) + (_ - v), _ = D + V, v = _ - D, wt[1] = D - (_ - v) + (V - v), q = N + _, v = q - N, wt[2] = N - (q - v) + (_ - v), wt[3] = q, g = ft(4, gt, 4, wt, ue), Y = u * x, I = j * u, A = I - (I - u), T = u - A, I = j * x, X = I - (I - x), $ = x - X, L = T * $ - (Y - A * X - T * X - A * $), V = c * d, I = j * c, A = I - (I - c), T = c - A, I = j * d, X = I - (I - d), $ = d - X, U = T * $ - (V - A * X - T * X - A * $), _ = L - U, v = L - _, Lt[0] = L - (_ + v) + (v - U), N = Y + _, v = N - Y, D = Y - (N - v) + (_ - v), _ = D - V, v = D - _, Lt[1] = D - (_ + v) + (v - V), q = N + _, v = q - N, Lt[2] = N - (q - v) + (_ - v), Lt[3] = q, k = 4) : (ue[0] = 0, g = 1, Lt[0] = 0, k = 1), f !== 0) {
      const rt = R(g, ue, f, it);
      h = ct(h, ft(
        R(p, Te, f, K),
        K,
        R(rt, it, 2 * Q, et),
        et,
        at
      ), at);
      const ot = R(k, Lt, f, z);
      h = ct(h, _t(
        R(ot, z, 2 * Q, K),
        K,
        R(ot, z, f, nt),
        nt,
        R(rt, it, f, et),
        et,
        Ft,
        bt
      ), bt), d !== 0 && (h = ct(h, R(R(4, kt, f, z), z, d, K), K)), x !== 0 && (h = ct(h, R(R(4, Et, -f, z), z, x, K), K));
    }
    if (w !== 0) {
      const rt = R(g, ue, w, it);
      h = ct(h, ft(
        R(y, Ce, w, K),
        K,
        R(rt, it, 2 * W, et),
        et,
        at
      ), at);
      const ot = R(k, Lt, w, z);
      h = ct(h, _t(
        R(ot, z, 2 * W, K),
        K,
        R(ot, z, w, nt),
        nt,
        R(rt, it, w, et),
        et,
        Ft,
        bt
      ), bt);
    }
  }
  return Qt[h - 1];
}
function di(e, t, n, i, o, r, s, a) {
  const l = e - s, h = n - s, u = o - s, c = t - a, f = i - a, d = r - a, x = h * d, w = u * f, O = l * l + c * c, b = u * c, m = l * d, M = h * h + f * f, p = l * f, y = h * c, g = u * u + d * d, E = O * (x - w) + M * (b - m) + g * (p - y), S = (Math.abs(x) + Math.abs(w)) * O + (Math.abs(b) + Math.abs(m)) * M + (Math.abs(p) + Math.abs(y)) * g, k = li * S;
  return E > k || -E > k ? E : ui(e, t, n, i, o, r, s, a, S);
}
function pi(e, t) {
  var n, i, o = 0, r, s, a, l, h, u, c, f = e[0], d = e[1], x = t.length;
  for (n = 0; n < x; n++) {
    i = 0;
    var w = t[n], O = w.length - 1;
    if (u = w[0], u[0] !== w[O][0] && u[1] !== w[O][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (s = u[0] - f, a = u[1] - d, i; i < O; i++) {
      if (c = w[i + 1], l = c[0] - f, h = c[1] - d, a === 0 && h === 0) {
        if (l <= 0 && s >= 0 || s <= 0 && l >= 0)
          return 0;
      } else if (h >= 0 && a <= 0 || h <= 0 && a >= 0) {
        if (r = Ot(s, l, a, h, 0, 0), r === 0)
          return 0;
        (r > 0 && h > 0 && a <= 0 || r < 0 && h <= 0 && a > 0) && o++;
      }
      u = c, a = h, s = l;
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
  for (var l = 0; l < a.length; ++l) {
    const h = pi(i, a[l]);
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
      const l = s + 1;
      if (l < this.length && i(n[l], a) < 0 && (s = l, a = n[l]), i(a, r) >= 0) break;
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
}, Symbol.toStringTag, { value: "Module" })), Nt = 11102230246251565e-32, ut = 134217729, yi = (3 + 8 * Nt) * Nt;
function $e(e, t, n, i, o) {
  let r, s, a, l, h = t[0], u = i[0], c = 0, f = 0;
  u > h == u > -h ? (r = h, h = t[++c]) : (r = u, u = i[++f]);
  let d = 0;
  if (c < e && f < n)
    for (u > h == u > -h ? (s = h + r, a = r - (s - h), h = t[++c]) : (s = u + r, a = r - (s - u), u = i[++f]), r = s, a !== 0 && (o[d++] = a); c < e && f < n; )
      u > h == u > -h ? (s = r + h, l = s - r, a = r - (s - l) + (h - l), h = t[++c]) : (s = r + u, l = s - r, a = r - (s - l) + (u - l), u = i[++f]), r = s, a !== 0 && (o[d++] = a);
  for (; c < e; )
    s = r + h, l = s - r, a = r - (s - l) + (h - l), h = t[++c], r = s, a !== 0 && (o[d++] = a);
  for (; f < n; )
    s = r + u, l = s - r, a = r - (s - l) + (u - l), u = i[++f], r = s, a !== 0 && (o[d++] = a);
  return (r !== 0 || d === 0) && (o[d++] = r), d;
}
function vi(e, t) {
  let n = t[0];
  for (let i = 1; i < e; i++) n += t[i];
  return n;
}
function he(e) {
  return new Float64Array(e);
}
const bi = (3 + 16 * Nt) * Nt, xi = (2 + 12 * Nt) * Nt, _i = (9 + 64 * Nt) * Nt * Nt, Jt = he(4), nn = he(8), rn = he(12), on = he(16), yt = he(4);
function Mi(e, t, n, i, o, r, s) {
  let a, l, h, u, c, f, d, x, w, O, b, m, M, p, y, g, E, S;
  const k = e - o, P = n - o, B = t - r, C = i - r;
  p = k * C, f = ut * k, d = f - (f - k), x = k - d, f = ut * C, w = f - (f - C), O = C - w, y = x * O - (p - d * w - x * w - d * O), g = B * P, f = ut * B, d = f - (f - B), x = B - d, f = ut * P, w = f - (f - P), O = P - w, E = x * O - (g - d * w - x * w - d * O), b = y - E, c = y - b, Jt[0] = y - (b + c) + (c - E), m = p + b, c = m - p, M = p - (m - c) + (b - c), b = M - g, c = M - b, Jt[1] = M - (b + c) + (c - g), S = m + b, c = S - m, Jt[2] = m - (S - c) + (b - c), Jt[3] = S;
  let F = vi(4, Jt), v = xi * s;
  if (F >= v || -F >= v || (c = e - k, a = e - (k + c) + (c - o), c = n - P, h = n - (P + c) + (c - o), c = t - B, l = t - (B + c) + (c - r), c = i - C, u = i - (C + c) + (c - r), a === 0 && l === 0 && h === 0 && u === 0) || (v = _i * s + yi * Math.abs(F), F += k * u + C * a - (B * h + P * l), F >= v || -F >= v)) return F;
  p = a * C, f = ut * a, d = f - (f - a), x = a - d, f = ut * C, w = f - (f - C), O = C - w, y = x * O - (p - d * w - x * w - d * O), g = l * P, f = ut * l, d = f - (f - l), x = l - d, f = ut * P, w = f - (f - P), O = P - w, E = x * O - (g - d * w - x * w - d * O), b = y - E, c = y - b, yt[0] = y - (b + c) + (c - E), m = p + b, c = m - p, M = p - (m - c) + (b - c), b = M - g, c = M - b, yt[1] = M - (b + c) + (c - g), S = m + b, c = S - m, yt[2] = m - (S - c) + (b - c), yt[3] = S;
  const I = $e(4, Jt, 4, yt, nn);
  p = k * u, f = ut * k, d = f - (f - k), x = k - d, f = ut * u, w = f - (f - u), O = u - w, y = x * O - (p - d * w - x * w - d * O), g = B * h, f = ut * B, d = f - (f - B), x = B - d, f = ut * h, w = f - (f - h), O = h - w, E = x * O - (g - d * w - x * w - d * O), b = y - E, c = y - b, yt[0] = y - (b + c) + (c - E), m = p + b, c = m - p, M = p - (m - c) + (b - c), b = M - g, c = M - b, yt[1] = M - (b + c) + (c - g), S = m + b, c = S - m, yt[2] = m - (S - c) + (b - c), yt[3] = S;
  const A = $e(I, nn, 4, yt, rn);
  p = a * u, f = ut * a, d = f - (f - a), x = a - d, f = ut * u, w = f - (f - u), O = u - w, y = x * O - (p - d * w - x * w - d * O), g = l * h, f = ut * l, d = f - (f - l), x = l - d, f = ut * h, w = f - (f - h), O = h - w, E = x * O - (g - d * w - x * w - d * O), b = y - E, c = y - b, yt[0] = y - (b + c) + (c - E), m = p + b, c = m - p, M = p - (m - c) + (b - c), b = M - g, c = M - b, yt[1] = M - (b + c) + (c - g), S = m + b, c = S - m, yt[2] = m - (S - c) + (b - c), yt[3] = S;
  const T = $e(A, rn, 4, yt, on);
  return on[T - 1];
}
function sn(e, t, n, i, o, r) {
  const s = (t - r) * (n - o), a = (e - o) * (i - r), l = s - a;
  if (s === 0 || a === 0 || s > 0 != a > 0) return l;
  const h = Math.abs(s + a);
  return Math.abs(l) >= bi * h ? l : -Mi(e, t, n, i, o, r, h);
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
      for (let l = 0; l < i[o][r].length - 1; l++) {
        a = i[o][r][l + 1];
        const h = new cn(s, me, ge, we), u = new cn(a, me, ge, we + 1);
        h.otherEvent = u, u.otherEvent = h, Vn(h, u) > 0 ? (u.isLeftEndpoint = !0, h.isLeftEndpoint = !1) : (h.isLeftEndpoint = !0, u.isLeftEndpoint = !1), t.push(h), t.push(u), s = a, we = we + 1;
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
        const l = Oi(r, a);
        l !== !1 && n.push(l);
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
  const n = e.leftSweepEvent.p.x, i = e.leftSweepEvent.p.y, o = e.rightSweepEvent.p.x, r = e.rightSweepEvent.p.y, s = t.leftSweepEvent.p.x, a = t.leftSweepEvent.p.y, l = t.rightSweepEvent.p.x, h = t.rightSweepEvent.p.y, u = sn(n, i, o, r, s, a), c = sn(n, i, o, r, l, h);
  if (u > 0 && c > 0) return !1;
  if (u < 0 && c < 0) return !1;
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
  const f = (h - a) * (o - n) - (l - s) * (r - i), d = (l - s) * (i - a) - (h - a) * (n - s), x = (o - n) * (i - a) - (r - i) * (n - s);
  if (f === 0)
    return !1;
  const w = d / f, O = x / f;
  if (w >= 0 && w <= 1 && O >= 0 && O <= 1) {
    const b = n + w * (o - n), m = i + w * (r - i);
    return [b, m];
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
    const l = {};
    s.forEach((h) => {
      const u = h.join(",");
      l[u] || (l[u] = !0, a.push(h));
    });
  } else
    a = s;
  return St(a.map((l) => Rt(l)));
}
function Bi(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function Ni(e) {
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
  ), Rt([n / o, i / o], t.properties);
}
var ye = { exports: {} }, ke = { exports: {} }, Ci = ke.exports, ln;
function Xi() {
  return ln || (ln = 1, (function(e, t) {
    (function(n, i) {
      e.exports = i();
    })(Ci, function() {
      function n(m, M, p, y, g) {
        (function E(S, k, P, B, C) {
          for (; B > P; ) {
            if (B - P > 600) {
              var F = B - P + 1, v = k - P + 1, I = Math.log(F), A = 0.5 * Math.exp(2 * I / 3), T = 0.5 * Math.sqrt(I * A * (F - A) / F) * (v - F / 2 < 0 ? -1 : 1), X = Math.max(P, Math.floor(k - v * A / F + T)), $ = Math.min(B, Math.floor(k + (F - v) * A / F + T));
              E(S, k, X, $, C);
            }
            var _ = S[k], N = P, D = B;
            for (i(S, P, k), C(S[B], _) > 0 && i(S, P, B); N < D; ) {
              for (i(S, N, D), N++, D--; C(S[N], _) < 0; ) N++;
              for (; C(S[D], _) > 0; ) D--;
            }
            C(S[P], _) === 0 ? i(S, P, D) : i(S, ++D, B), D <= k && (P = D + 1), k <= D && (B = D - 1);
          }
        })(m, M, p || 0, y || m.length - 1, g || o);
      }
      function i(m, M, p) {
        var y = m[M];
        m[M] = m[p], m[p] = y;
      }
      function o(m, M) {
        return m < M ? -1 : m > M ? 1 : 0;
      }
      var r = function(m) {
        m === void 0 && (m = 9), this._maxEntries = Math.max(4, m), this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries)), this.clear();
      };
      function s(m, M, p) {
        if (!p) return M.indexOf(m);
        for (var y = 0; y < M.length; y++) if (p(m, M[y])) return y;
        return -1;
      }
      function a(m, M) {
        l(m, 0, m.children.length, M, m);
      }
      function l(m, M, p, y, g) {
        g || (g = O(null)), g.minX = 1 / 0, g.minY = 1 / 0, g.maxX = -1 / 0, g.maxY = -1 / 0;
        for (var E = M; E < p; E++) {
          var S = m.children[E];
          h(g, m.leaf ? y(S) : S);
        }
        return g;
      }
      function h(m, M) {
        return m.minX = Math.min(m.minX, M.minX), m.minY = Math.min(m.minY, M.minY), m.maxX = Math.max(m.maxX, M.maxX), m.maxY = Math.max(m.maxY, M.maxY), m;
      }
      function u(m, M) {
        return m.minX - M.minX;
      }
      function c(m, M) {
        return m.minY - M.minY;
      }
      function f(m) {
        return (m.maxX - m.minX) * (m.maxY - m.minY);
      }
      function d(m) {
        return m.maxX - m.minX + (m.maxY - m.minY);
      }
      function x(m, M) {
        return m.minX <= M.minX && m.minY <= M.minY && M.maxX <= m.maxX && M.maxY <= m.maxY;
      }
      function w(m, M) {
        return M.minX <= m.maxX && M.minY <= m.maxY && M.maxX >= m.minX && M.maxY >= m.minY;
      }
      function O(m) {
        return { children: m, height: 1, leaf: !0, minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
      }
      function b(m, M, p, y, g) {
        for (var E = [M, p]; E.length; ) if (!((p = E.pop()) - (M = E.pop()) <= y)) {
          var S = M + Math.ceil((p - M) / y / 2) * y;
          n(m, S, M, p, g), E.push(M, S, S, p);
        }
      }
      return r.prototype.all = function() {
        return this._all(this.data, []);
      }, r.prototype.search = function(m) {
        var M = this.data, p = [];
        if (!w(m, M)) return p;
        for (var y = this.toBBox, g = []; M; ) {
          for (var E = 0; E < M.children.length; E++) {
            var S = M.children[E], k = M.leaf ? y(S) : S;
            w(m, k) && (M.leaf ? p.push(S) : x(m, k) ? this._all(S, p) : g.push(S));
          }
          M = g.pop();
        }
        return p;
      }, r.prototype.collides = function(m) {
        var M = this.data;
        if (!w(m, M)) return !1;
        for (var p = []; M; ) {
          for (var y = 0; y < M.children.length; y++) {
            var g = M.children[y], E = M.leaf ? this.toBBox(g) : g;
            if (w(m, E)) {
              if (M.leaf || x(m, E)) return !0;
              p.push(g);
            }
          }
          M = p.pop();
        }
        return !1;
      }, r.prototype.load = function(m) {
        if (!m || !m.length) return this;
        if (m.length < this._minEntries) {
          for (var M = 0; M < m.length; M++) this.insert(m[M]);
          return this;
        }
        var p = this._build(m.slice(), 0, m.length - 1, 0);
        if (this.data.children.length) if (this.data.height === p.height) this._splitRoot(this.data, p);
        else {
          if (this.data.height < p.height) {
            var y = this.data;
            this.data = p, p = y;
          }
          this._insert(p, this.data.height - p.height - 1, !0);
        }
        else this.data = p;
        return this;
      }, r.prototype.insert = function(m) {
        return m && this._insert(m, this.data.height - 1), this;
      }, r.prototype.clear = function() {
        return this.data = O([]), this;
      }, r.prototype.remove = function(m, M) {
        if (!m) return this;
        for (var p, y, g, E = this.data, S = this.toBBox(m), k = [], P = []; E || k.length; ) {
          if (E || (E = k.pop(), y = k[k.length - 1], p = P.pop(), g = !0), E.leaf) {
            var B = s(m, E.children, M);
            if (B !== -1) return E.children.splice(B, 1), k.push(E), this._condense(k), this;
          }
          g || E.leaf || !x(E, S) ? y ? (p++, E = y.children[p], g = !1) : E = null : (k.push(E), P.push(p), p = 0, y = E, E = E.children[0]);
        }
        return this;
      }, r.prototype.toBBox = function(m) {
        return m;
      }, r.prototype.compareMinX = function(m, M) {
        return m.minX - M.minX;
      }, r.prototype.compareMinY = function(m, M) {
        return m.minY - M.minY;
      }, r.prototype.toJSON = function() {
        return this.data;
      }, r.prototype.fromJSON = function(m) {
        return this.data = m, this;
      }, r.prototype._all = function(m, M) {
        for (var p = []; m; ) m.leaf ? M.push.apply(M, m.children) : p.push.apply(p, m.children), m = p.pop();
        return M;
      }, r.prototype._build = function(m, M, p, y) {
        var g, E = p - M + 1, S = this._maxEntries;
        if (E <= S) return a(g = O(m.slice(M, p + 1)), this.toBBox), g;
        y || (y = Math.ceil(Math.log(E) / Math.log(S)), S = Math.ceil(E / Math.pow(S, y - 1))), (g = O([])).leaf = !1, g.height = y;
        var k = Math.ceil(E / S), P = k * Math.ceil(Math.sqrt(S));
        b(m, M, p, P, this.compareMinX);
        for (var B = M; B <= p; B += P) {
          var C = Math.min(B + P - 1, p);
          b(m, B, C, k, this.compareMinY);
          for (var F = B; F <= C; F += k) {
            var v = Math.min(F + k - 1, C);
            g.children.push(this._build(m, F, v, y - 1));
          }
        }
        return a(g, this.toBBox), g;
      }, r.prototype._chooseSubtree = function(m, M, p, y) {
        for (; y.push(M), !M.leaf && y.length - 1 !== p; ) {
          for (var g = 1 / 0, E = 1 / 0, S = void 0, k = 0; k < M.children.length; k++) {
            var P = M.children[k], B = f(P), C = (F = m, v = P, (Math.max(v.maxX, F.maxX) - Math.min(v.minX, F.minX)) * (Math.max(v.maxY, F.maxY) - Math.min(v.minY, F.minY)) - B);
            C < E ? (E = C, g = B < g ? B : g, S = P) : C === E && B < g && (g = B, S = P);
          }
          M = S || M.children[0];
        }
        var F, v;
        return M;
      }, r.prototype._insert = function(m, M, p) {
        var y = p ? m : this.toBBox(m), g = [], E = this._chooseSubtree(y, this.data, M, g);
        for (E.children.push(m), h(E, y); M >= 0 && g[M].children.length > this._maxEntries; ) this._split(g, M), M--;
        this._adjustParentBBoxes(y, g, M);
      }, r.prototype._split = function(m, M) {
        var p = m[M], y = p.children.length, g = this._minEntries;
        this._chooseSplitAxis(p, g, y);
        var E = this._chooseSplitIndex(p, g, y), S = O(p.children.splice(E, p.children.length - E));
        S.height = p.height, S.leaf = p.leaf, a(p, this.toBBox), a(S, this.toBBox), M ? m[M - 1].children.push(S) : this._splitRoot(p, S);
      }, r.prototype._splitRoot = function(m, M) {
        this.data = O([m, M]), this.data.height = m.height + 1, this.data.leaf = !1, a(this.data, this.toBBox);
      }, r.prototype._chooseSplitIndex = function(m, M, p) {
        for (var y, g, E, S, k, P, B, C = 1 / 0, F = 1 / 0, v = M; v <= p - M; v++) {
          var I = l(m, 0, v, this.toBBox), A = l(m, v, p, this.toBBox), T = (g = I, E = A, S = void 0, k = void 0, P = void 0, B = void 0, S = Math.max(g.minX, E.minX), k = Math.max(g.minY, E.minY), P = Math.min(g.maxX, E.maxX), B = Math.min(g.maxY, E.maxY), Math.max(0, P - S) * Math.max(0, B - k)), X = f(I) + f(A);
          T < C ? (C = T, y = v, F = X < F ? X : F) : T === C && X < F && (F = X, y = v);
        }
        return y || p - M;
      }, r.prototype._chooseSplitAxis = function(m, M, p) {
        var y = m.leaf ? this.compareMinX : u, g = m.leaf ? this.compareMinY : c;
        this._allDistMargin(m, M, p, y) < this._allDistMargin(m, M, p, g) && m.children.sort(y);
      }, r.prototype._allDistMargin = function(m, M, p, y) {
        m.children.sort(y);
        for (var g = this.toBBox, E = l(m, 0, M, g), S = l(m, p - M, p, g), k = d(E) + d(S), P = M; P < p - M; P++) {
          var B = m.children[P];
          h(E, m.leaf ? g(B) : B), k += d(E);
        }
        for (var C = p - M - 1; C >= M; C--) {
          var F = m.children[C];
          h(S, m.leaf ? g(F) : F), k += d(S);
        }
        return k;
      }, r.prototype._adjustParentBBoxes = function(m, M, p) {
        for (var y = p; y >= 0; y--) h(M[y], m);
      }, r.prototype._condense = function(m) {
        for (var M = m.length - 1, p = void 0; M >= 0; M--) m[M].children.length === 0 ? M > 0 ? (p = m[M - 1].children).splice(p.indexOf(m[M]), 1) : this.clear() : a(m[M], this.toBBox);
      }, r;
    });
  })(ke)), ke.exports;
}
const Di = /* @__PURE__ */ Ni(wi);
var Zt = { exports: {} }, Fe, hn;
function $i() {
  return hn || (hn = 1, Fe = function(t, n, i, o) {
    var r = t[0], s = t[1], a = !1;
    i === void 0 && (i = 0), o === void 0 && (o = n.length);
    for (var l = (o - i) / 2, h = 0, u = l - 1; h < l; u = h++) {
      var c = n[i + h * 2 + 0], f = n[i + h * 2 + 1], d = n[i + u * 2 + 0], x = n[i + u * 2 + 1], w = f > s != x > s && r < (d - c) * (s - f) / (x - f) + c;
      w && (a = !a);
    }
    return a;
  }), Fe;
}
var Ye, fn;
function Fi() {
  return fn || (fn = 1, Ye = function(t, n, i, o) {
    var r = t[0], s = t[1], a = !1;
    i === void 0 && (i = 0), o === void 0 && (o = n.length);
    for (var l = o - i, h = 0, u = l - 1; h < l; u = h++) {
      var c = n[h + i][0], f = n[h + i][1], d = n[u + i][0], x = n[u + i][1], w = f > s != x > s && r < (d - c) * (s - f) / (x - f) + c;
      w && (a = !a);
    }
    return a;
  }), Ye;
}
var un;
function Yi() {
  if (un) return Zt.exports;
  un = 1;
  var e = $i(), t = Fi();
  return Zt.exports = function(i, o, r, s) {
    return o.length > 0 && Array.isArray(o[0]) ? t(i, o, r, s) : e(i, o, r, s);
  }, Zt.exports.nested = t, Zt.exports.flat = e, Zt.exports;
}
var ee = { exports: {} }, Ri = ee.exports, dn;
function Li() {
  return dn || (dn = 1, (function(e, t) {
    (function(n, i) {
      i(t);
    })(Ri, function(n) {
      const o = 33306690738754706e-32;
      function r(w, O, b, m, M) {
        let p, y, g, E, S = O[0], k = m[0], P = 0, B = 0;
        k > S == k > -S ? (p = S, S = O[++P]) : (p = k, k = m[++B]);
        let C = 0;
        if (P < w && B < b) for (k > S == k > -S ? (g = p - ((y = S + p) - S), S = O[++P]) : (g = p - ((y = k + p) - k), k = m[++B]), p = y, g !== 0 && (M[C++] = g); P < w && B < b; ) k > S == k > -S ? (g = p - ((y = p + S) - (E = y - p)) + (S - E), S = O[++P]) : (g = p - ((y = p + k) - (E = y - p)) + (k - E), k = m[++B]), p = y, g !== 0 && (M[C++] = g);
        for (; P < w; ) g = p - ((y = p + S) - (E = y - p)) + (S - E), S = O[++P], p = y, g !== 0 && (M[C++] = g);
        for (; B < b; ) g = p - ((y = p + k) - (E = y - p)) + (k - E), k = m[++B], p = y, g !== 0 && (M[C++] = g);
        return p === 0 && C !== 0 || (M[C++] = p), C;
      }
      function s(w) {
        return new Float64Array(w);
      }
      const a = 33306690738754716e-32, l = 22204460492503146e-32, h = 11093356479670487e-47, u = s(4), c = s(8), f = s(12), d = s(16), x = s(4);
      n.orient2d = function(w, O, b, m, M, p) {
        const y = (O - p) * (b - M), g = (w - M) * (m - p), E = y - g;
        if (y === 0 || g === 0 || y > 0 != g > 0) return E;
        const S = Math.abs(y + g);
        return Math.abs(E) >= a * S ? E : -(function(k, P, B, C, F, v, I) {
          let A, T, X, $, _, N, D, Y, L, V, U, q, G, J, Q, H, Z, W;
          const st = k - F, ht = B - F, rt = P - v, ot = C - v;
          _ = (Q = (Y = st - (D = (N = 134217729 * st) - (N - st))) * (V = ot - (L = (N = 134217729 * ot) - (N - ot))) - ((J = st * ot) - D * L - Y * L - D * V)) - (U = Q - (Z = (Y = rt - (D = (N = 134217729 * rt) - (N - rt))) * (V = ht - (L = (N = 134217729 * ht) - (N - ht))) - ((H = rt * ht) - D * L - Y * L - D * V))), u[0] = Q - (U + _) + (_ - Z), _ = (G = J - ((q = J + U) - (_ = q - J)) + (U - _)) - (U = G - H), u[1] = G - (U + _) + (_ - H), _ = (W = q + U) - q, u[2] = q - (W - _) + (U - _), u[3] = W;
          let Ct = (function(ni, Ke) {
            let Qe = Ke[0];
            for (let Ie = 1; Ie < ni; Ie++) Qe += Ke[Ie];
            return Qe;
          })(4, u), Wt = l * I;
          if (Ct >= Wt || -Ct >= Wt || (A = k - (st + (_ = k - st)) + (_ - F), X = B - (ht + (_ = B - ht)) + (_ - F), T = P - (rt + (_ = P - rt)) + (_ - v), $ = C - (ot + (_ = C - ot)) + (_ - v), A === 0 && T === 0 && X === 0 && $ === 0) || (Wt = h * I + o * Math.abs(Ct), (Ct += st * $ + ot * A - (rt * X + ht * T)) >= Wt || -Ct >= Wt)) return Ct;
          _ = (Q = (Y = A - (D = (N = 134217729 * A) - (N - A))) * (V = ot - (L = (N = 134217729 * ot) - (N - ot))) - ((J = A * ot) - D * L - Y * L - D * V)) - (U = Q - (Z = (Y = T - (D = (N = 134217729 * T) - (N - T))) * (V = ht - (L = (N = 134217729 * ht) - (N - ht))) - ((H = T * ht) - D * L - Y * L - D * V))), x[0] = Q - (U + _) + (_ - Z), _ = (G = J - ((q = J + U) - (_ = q - J)) + (U - _)) - (U = G - H), x[1] = G - (U + _) + (_ - H), _ = (W = q + U) - q, x[2] = q - (W - _) + (U - _), x[3] = W;
          const Zn = r(4, u, 4, x, c);
          _ = (Q = (Y = st - (D = (N = 134217729 * st) - (N - st))) * (V = $ - (L = (N = 134217729 * $) - (N - $))) - ((J = st * $) - D * L - Y * L - D * V)) - (U = Q - (Z = (Y = rt - (D = (N = 134217729 * rt) - (N - rt))) * (V = X - (L = (N = 134217729 * X) - (N - X))) - ((H = rt * X) - D * L - Y * L - D * V))), x[0] = Q - (U + _) + (_ - Z), _ = (G = J - ((q = J + U) - (_ = q - J)) + (U - _)) - (U = G - H), x[1] = G - (U + _) + (_ - H), _ = (W = q + U) - q, x[2] = q - (W - _) + (U - _), x[3] = W;
          const ti = r(Zn, c, 4, x, f);
          _ = (Q = (Y = A - (D = (N = 134217729 * A) - (N - A))) * (V = $ - (L = (N = 134217729 * $) - (N - $))) - ((J = A * $) - D * L - Y * L - D * V)) - (U = Q - (Z = (Y = T - (D = (N = 134217729 * T) - (N - T))) * (V = X - (L = (N = 134217729 * X) - (N - X))) - ((H = T * X) - D * L - Y * L - D * V))), x[0] = Q - (U + _) + (_ - Z), _ = (G = J - ((q = J + U) - (_ = q - J)) + (U - _)) - (U = G - H), x[1] = G - (U + _) + (_ - H), _ = (W = q + U) - q, x[2] = q - (W - _) + (U - _), x[3] = W;
          const ei = r(ti, f, 4, x, d);
          return d[ei - 1];
        })(w, O, b, m, M, p, S);
      }, n.orient2dfast = function(w, O, b, m, M, p) {
        return (O - p) * (b - M) - (w - M) * (m - p);
      }, Object.defineProperty(n, "__esModule", { value: !0 });
    });
  })(ee, ee.exports)), ee.exports;
}
var pn;
function Vi() {
  if (pn) return ye.exports;
  pn = 1;
  var e = Xi(), t = Di, n = Yi(), i = Li().orient2d;
  t.default && (t = t.default), ye.exports = o, ye.exports.default = o;
  function o(p, y, g) {
    y = Math.max(0, y === void 0 ? 2 : y), g = g || 0;
    var E = d(p), S = new e(16);
    S.toBBox = function(D) {
      return {
        minX: D[0],
        minY: D[1],
        maxX: D[0],
        maxY: D[1]
      };
    }, S.compareMinX = function(D, Y) {
      return D[0] - Y[0];
    }, S.compareMinY = function(D, Y) {
      return D[1] - Y[1];
    }, S.load(p);
    for (var k = [], P = 0, B; P < E.length; P++) {
      var C = E[P];
      S.remove(C), B = x(C, B), k.push(B);
    }
    var F = new e(16);
    for (P = 0; P < k.length; P++) F.insert(f(k[P]));
    for (var v = y * y, I = g * g; k.length; ) {
      var A = k.shift(), T = A.p, X = A.next.p, $ = w(T, X);
      if (!($ < I)) {
        var _ = $ / v;
        C = r(S, A.prev.p, T, X, A.next.next.p, _, F), C && Math.min(w(C, T), w(C, X)) <= _ && (k.push(A), k.push(x(C, A)), S.remove(C), F.remove(A), F.insert(f(A)), F.insert(f(A.next)));
      }
    }
    A = B;
    var N = [];
    do
      N.push(A.p), A = A.next;
    while (A !== B);
    return N.push(A.p), N;
  }
  function r(p, y, g, E, S, k, P) {
    for (var B = new t([], s), C = p.data; C; ) {
      for (var F = 0; F < C.children.length; F++) {
        var v = C.children[F], I = C.leaf ? O(v, g, E) : a(g, E, v);
        I > k || B.push({
          node: v,
          dist: I
        });
      }
      for (; B.length && !B.peek().node.children; ) {
        var A = B.pop(), T = A.node, X = O(T, y, g), $ = O(T, E, S);
        if (A.dist < X && A.dist < $ && h(g, T, P) && h(E, T, P)) return T;
      }
      C = B.pop(), C && (C = C.node);
    }
    return null;
  }
  function s(p, y) {
    return p.dist - y.dist;
  }
  function a(p, y, g) {
    if (l(p, g) || l(y, g)) return 0;
    var E = b(p[0], p[1], y[0], y[1], g.minX, g.minY, g.maxX, g.minY);
    if (E === 0) return 0;
    var S = b(p[0], p[1], y[0], y[1], g.minX, g.minY, g.minX, g.maxY);
    if (S === 0) return 0;
    var k = b(p[0], p[1], y[0], y[1], g.maxX, g.minY, g.maxX, g.maxY);
    if (k === 0) return 0;
    var P = b(p[0], p[1], y[0], y[1], g.minX, g.maxY, g.maxX, g.maxY);
    return P === 0 ? 0 : Math.min(E, S, k, P);
  }
  function l(p, y) {
    return p[0] >= y.minX && p[0] <= y.maxX && p[1] >= y.minY && p[1] <= y.maxY;
  }
  function h(p, y, g) {
    for (var E = Math.min(p[0], y[0]), S = Math.min(p[1], y[1]), k = Math.max(p[0], y[0]), P = Math.max(p[1], y[1]), B = g.search({ minX: E, minY: S, maxX: k, maxY: P }), C = 0; C < B.length; C++)
      if (c(B[C].p, B[C].next.p, p, y)) return !1;
    return !0;
  }
  function u(p, y, g) {
    return i(p[0], p[1], y[0], y[1], g[0], g[1]);
  }
  function c(p, y, g, E) {
    return p !== E && y !== g && u(p, y, g) > 0 != u(p, y, E) > 0 && u(g, E, p) > 0 != u(g, E, y) > 0;
  }
  function f(p) {
    var y = p.p, g = p.next.p;
    return p.minX = Math.min(y[0], g[0]), p.minY = Math.min(y[1], g[1]), p.maxX = Math.max(y[0], g[0]), p.maxY = Math.max(y[1], g[1]), p;
  }
  function d(p) {
    for (var y = p[0], g = p[0], E = p[0], S = p[0], k = 0; k < p.length; k++) {
      var P = p[k];
      P[0] < y[0] && (y = P), P[0] > E[0] && (E = P), P[1] < g[1] && (g = P), P[1] > S[1] && (S = P);
    }
    var B = [y, g, E, S], C = B.slice();
    for (k = 0; k < p.length; k++)
      n(p[k], B) || C.push(p[k]);
    return M(C);
  }
  function x(p, y) {
    var g = {
      p,
      prev: null,
      next: null,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };
    return y ? (g.next = y.next, g.prev = y, y.next.prev = g, y.next = g) : (g.prev = g, g.next = g), g;
  }
  function w(p, y) {
    var g = p[0] - y[0], E = p[1] - y[1];
    return g * g + E * E;
  }
  function O(p, y, g) {
    var E = y[0], S = y[1], k = g[0] - E, P = g[1] - S;
    if (k !== 0 || P !== 0) {
      var B = ((p[0] - E) * k + (p[1] - S) * P) / (k * k + P * P);
      B > 1 ? (E = g[0], S = g[1]) : B > 0 && (E += k * B, S += P * B);
    }
    return k = p[0] - E, P = p[1] - S, k * k + P * P;
  }
  function b(p, y, g, E, S, k, P, B) {
    var C = g - p, F = E - y, v = P - S, I = B - k, A = p - S, T = y - k, X = C * C + F * F, $ = C * v + F * I, _ = v * v + I * I, N = C * A + F * T, D = v * A + I * T, Y = X * _ - $ * $, L, V, U, q, G = Y, J = Y;
    Y === 0 ? (V = 0, G = 1, q = D, J = _) : (V = $ * D - _ * N, q = X * D - $ * N, V < 0 ? (V = 0, q = D, J = _) : V > G && (V = G, q = D + $, J = _)), q < 0 ? (q = 0, -N < 0 ? V = 0 : -N > X ? V = G : (V = -N, G = X)) : q > J && (q = J, -N + $ < 0 ? V = 0 : -N + $ > X ? V = G : (V = -N + $, G = X)), L = V === 0 ? 0 : V / G, U = q === 0 ? 0 : q / J;
    var Q = (1 - L) * p + L * g, H = (1 - L) * y + L * E, Z = (1 - U) * S + U * P, W = (1 - U) * k + U * B, st = Z - Q, ht = W - H;
    return st * st + ht * ht;
  }
  function m(p, y) {
    return p[0] === y[0] ? p[1] - y[1] : p[0] - y[0];
  }
  function M(p) {
    p.sort(m);
    for (var y = [], g = 0; g < p.length; g++) {
      for (; y.length >= 2 && u(y[y.length - 2], y[y.length - 1], p[g]) <= 0; )
        y.pop();
      y.push(p[g]);
    }
    for (var E = [], S = p.length - 1; S >= 0; S--) {
      for (; E.length >= 2 && u(E[E.length - 2], E[E.length - 1], p[S]) <= 0; )
        E.pop();
      E.push(p[S]);
    }
    return E.pop(), y.pop(), y.concat(E);
  }
  return ye.exports;
}
var qi = Vi();
const Ui = /* @__PURE__ */ Bi(qi);
function mn(e, t = {}) {
  t.concavity = t.concavity || 1 / 0;
  const n = [];
  if (ze(e, (o) => {
    n.push([o[0], o[1]]);
  }), !n.length)
    return null;
  const i = Ui(n, t.concavity);
  return i.length > 3 ? le([i], t.properties) : null;
}
function qn(e, t, n = {}) {
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
  return qn({
    type: "Point",
    coordinates: e
  }, t, n);
}
function Un(e, t, n = {}) {
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
  return qn({
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
function Re(e, t, n, i, o) {
  let r, s, a, l, h = t[0], u = i[0], c = 0, f = 0;
  u > h == u > -h ? (r = h, h = t[++c]) : (r = u, u = i[++f]);
  let d = 0;
  if (c < e && f < n)
    for (u > h == u > -h ? (s = h + r, a = r - (s - h), h = t[++c]) : (s = u + r, a = r - (s - u), u = i[++f]), r = s, a !== 0 && (o[d++] = a); c < e && f < n; )
      u > h == u > -h ? (s = r + h, l = s - r, a = r - (s - l) + (h - l), h = t[++c]) : (s = r + u, l = s - r, a = r - (s - l) + (u - l), u = i[++f]), r = s, a !== 0 && (o[d++] = a);
  for (; c < e; )
    s = r + h, l = s - r, a = r - (s - l) + (h - l), h = t[++c], r = s, a !== 0 && (o[d++] = a);
  for (; f < n; )
    s = r + u, l = s - r, a = r - (s - l) + (u - l), u = i[++f], r = s, a !== 0 && (o[d++] = a);
  return (r !== 0 || d === 0) && (o[d++] = r), d;
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
  let a, l, h, u, c, f, d, x, w, O, b, m, M, p, y, g, E, S;
  const k = e - o, P = n - o, B = t - r, C = i - r;
  p = k * C, f = dt * k, d = f - (f - k), x = k - d, f = dt * C, w = f - (f - C), O = C - w, y = x * O - (p - d * w - x * w - d * O), g = B * P, f = dt * B, d = f - (f - B), x = B - d, f = dt * P, w = f - (f - P), O = P - w, E = x * O - (g - d * w - x * w - d * O), b = y - E, c = y - b, Gt[0] = y - (b + c) + (c - E), m = p + b, c = m - p, M = p - (m - c) + (b - c), b = M - g, c = M - b, Gt[1] = M - (b + c) + (c - g), S = m + b, c = S - m, Gt[2] = m - (S - c) + (b - c), Gt[3] = S;
  let F = Gi(4, Gt), v = Qi * s;
  if (F >= v || -F >= v || (c = e - k, a = e - (k + c) + (c - o), c = n - P, h = n - (P + c) + (c - o), c = t - B, l = t - (B + c) + (c - r), c = i - C, u = i - (C + c) + (c - r), a === 0 && l === 0 && h === 0 && u === 0) || (v = Hi * s + Ji * Math.abs(F), F += k * u + C * a - (B * h + P * l), F >= v || -F >= v)) return F;
  p = a * C, f = dt * a, d = f - (f - a), x = a - d, f = dt * C, w = f - (f - C), O = C - w, y = x * O - (p - d * w - x * w - d * O), g = l * P, f = dt * l, d = f - (f - l), x = l - d, f = dt * P, w = f - (f - P), O = P - w, E = x * O - (g - d * w - x * w - d * O), b = y - E, c = y - b, vt[0] = y - (b + c) + (c - E), m = p + b, c = m - p, M = p - (m - c) + (b - c), b = M - g, c = M - b, vt[1] = M - (b + c) + (c - g), S = m + b, c = S - m, vt[2] = m - (S - c) + (b - c), vt[3] = S;
  const I = Re(4, Gt, 4, vt, yn);
  p = k * u, f = dt * k, d = f - (f - k), x = k - d, f = dt * u, w = f - (f - u), O = u - w, y = x * O - (p - d * w - x * w - d * O), g = B * h, f = dt * B, d = f - (f - B), x = B - d, f = dt * h, w = f - (f - h), O = h - w, E = x * O - (g - d * w - x * w - d * O), b = y - E, c = y - b, vt[0] = y - (b + c) + (c - E), m = p + b, c = m - p, M = p - (m - c) + (b - c), b = M - g, c = M - b, vt[1] = M - (b + c) + (c - g), S = m + b, c = S - m, vt[2] = m - (S - c) + (b - c), vt[3] = S;
  const A = Re(I, yn, 4, vt, vn);
  p = a * u, f = dt * a, d = f - (f - a), x = a - d, f = dt * u, w = f - (f - u), O = u - w, y = x * O - (p - d * w - x * w - d * O), g = l * h, f = dt * l, d = f - (f - l), x = l - d, f = dt * h, w = f - (f - h), O = h - w, E = x * O - (g - d * w - x * w - d * O), b = y - E, c = y - b, vt[0] = y - (b + c) + (c - E), m = p + b, c = m - p, M = p - (m - c) + (b - c), b = M - g, c = M - b, vt[1] = M - (b + c) + (c - g), S = m + b, c = S - m, vt[2] = m - (S - c) + (b - c), vt[3] = S;
  const T = Re(A, vn, 4, vt, bn);
  return bn[T - 1];
}
function Zi(e, t, n, i, o, r) {
  const s = (t - r) * (n - o), a = (e - o) * (i - r), l = s - a, h = Math.abs(s + a);
  return Math.abs(l) >= Ki * h ? l : -Wi(e, t, n, i, o, r, h);
}
function tr(e, t) {
  var n, i, o = 0, r, s, a, l, h, u, c, f = e[0], d = e[1], x = t.length;
  for (n = 0; n < x; n++) {
    i = 0;
    var w = t[n], O = w.length - 1;
    if (u = w[0], u[0] !== w[O][0] && u[1] !== w[O][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (s = u[0] - f, a = u[1] - d, i; i < O; i++) {
      if (c = w[i + 1], l = c[0] - f, h = c[1] - d, a === 0 && h === 0) {
        if (l <= 0 && s >= 0 || s <= 0 && l >= 0)
          return 0;
      } else if (h >= 0 && a <= 0 || h <= 0 && a >= 0) {
        if (r = Zi(s, l, a, h, 0, 0), r === 0)
          return 0;
        (r > 0 && h > 0 && a <= 0 || r < 0 && h <= 0 && a > 0) && o++;
      }
      u = c, a = h, s = l;
    }
  }
  return o % 2 !== 0;
}
function qe(e, t, n = {}) {
  if (!e)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const i = ji(e), o = zi(t), r = o.type, s = t.bbox;
  let a = o.coordinates;
  if (s && er(i, s) === !1)
    return !1;
  r === "Polygon" && (a = [a]);
  for (var l = 0; l < a.length; ++l) {
    const h = tr(i, a[l]);
    if (h === 0 && !n.ignoreBoundary || h) return !0;
  }
  return !1;
}
function er(e, t) {
  return t[0] <= e[0] && t[1] <= e[1] && t[2] >= e[0] && t[3] >= e[1];
}
function Le(e, t) {
  for (let n = 0; n < t.features.length; n++)
    if (qe(e, t.features[n]))
      return t.features[n];
}
function jn(e, t) {
  const n = t.geometry.coordinates[0][0], i = t.geometry.coordinates[0][1], o = t.geometry.coordinates[0][2], r = e.geometry.coordinates, s = t.properties.a.geom, a = t.properties.b.geom, l = t.properties.c.geom, h = [i[0] - n[0], i[1] - n[1]], u = [o[0] - n[0], o[1] - n[1]], c = [r[0] - n[0], r[1] - n[1]], f = [a[0] - s[0], a[1] - s[1]], d = [l[0] - s[0], l[1] - s[1]], x = (u[1] * c[0] - u[0] * c[1]) / (h[0] * u[1] - h[1] * u[0]), w = (h[0] * c[1] - h[1] * c[0]) / (h[0] * u[1] - h[1] * u[0]);
  return [
    x * f[0] + w * d[0] + s[0],
    x * f[1] + w * d[1] + s[1]
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
  let l;
  if (s && (l = Le(e, Ht([s]))), !l)
    if (n) {
      const h = e.geometry.coordinates, u = n.gridNum, c = n.xOrigin, f = n.yOrigin, d = n.xUnit, x = n.yUnit, w = n.gridCache, O = It(h[0], c, d, u), b = It(h[1], f, x, u), m = w[O] ? w[O][b] ? w[O][b] : [] : [], M = Ht(m.map((p) => t.features[p]));
      l = Le(e, M);
    } else
      l = Le(e, t);
  return a && a(l), l ? jn(e, l) : nr(e, i, o);
}
function It(e, t, n, i) {
  let o = Math.floor((e - t) / n);
  return o < 0 && (o = 0), o >= i && (o = i - 1), o;
}
function ir(e, t) {
  let n = xn(e - t[0]), i = Math.PI * 2, o;
  for (let r = 0; r < t.length; r++) {
    const s = (r + 1) % t.length, a = xn(e - t[s]), l = Math.min(Math.abs(n), Math.abs(a));
    n * a <= 0 && l < i && (i = l, o = r), n = a;
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
  return Un([t], o);
}
function rr(e) {
  const t = [0, 1, 2, 0].map((i) => e[i][0][0]), n = {
    a: { geom: e[0][0][1], index: e[0][1] },
    b: { geom: e[1][0][1], index: e[1][1] },
    c: { geom: e[2][0][1], index: e[2][1] }
  };
  return Un([t], n);
}
function Ue(e, t, n, i, o, r = !1, s) {
  const a = e.map(
    (l) => {
      (!s || s < 2.00703) && (l = or(l));
      const h = isFinite(l) ? t[l] : l === "c" ? i : (function() {
        const u = l.match(/^b(\d+)$/);
        if (u) return o[parseInt(u[1])];
        const c = l.match(/^e(\d+)$/);
        if (c) return n[parseInt(c[1])];
        throw new Error("Bad index value for indexesToTri");
      })();
      return r ? [[h[1], h[0]], l] : [[h[0], h[1]], l];
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
    const r = (o + 1) % n, s = Ue(
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
        (n) => Ue(
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
        (n) => Ue(
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
      const a = o.geometry.coordinates[0][s], l = o.properties[r].geom, h = o.properties[r].index;
      typeof h == "number" && (t[h] = [a, l]);
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
      return wn(w)[0].map((b) => {
        r.length === 0 ? r = [Array.from(b), Array.from(b)] : (b[0] < r[0][0] && (r[0][0] = b[0]), b[0] > r[1][0] && (r[1][0] = b[0]), b[1] < r[0][1] && (r[0][1] = b[1]), b[1] > r[1][1] && (r[1][1] = b[1])), O.length === 0 ? O = [Array.from(b), Array.from(b)] : (b[0] < O[0][0] && (O[0][0] = b[0]), b[0] > O[1][0] && (O[1][0] = b[0]), b[1] < O[0][1] && (O[0][1] = b[1]), b[1] > O[1][1] && (O[1][1] = b[1]));
      }), O;
    }), l = (r[1][0] - r[0][0]) / o, h = (r[1][1] - r[0][1]) / o, u = a.reduce(
      (w, O, b) => {
        const m = It(O[0][0], r[0][0], l, o), M = It(O[1][0], r[0][0], l, o), p = It(O[0][1], r[0][1], h, o), y = It(O[1][1], r[0][1], h, o);
        for (let g = m; g <= M; g++) {
          w[g] || (w[g] = []);
          for (let E = p; E <= y; E++)
            w[g][E] || (w[g][E] = []), w[g][E].push(b);
        }
        return w;
      },
      []
    ), c = i.features.map((w) => {
      let O = [];
      return wn(w)[0].map((b) => {
        s.length === 0 ? s = [Array.from(b), Array.from(b)] : (b[0] < s[0][0] && (s[0][0] = b[0]), b[0] > s[1][0] && (s[1][0] = b[0]), b[1] < s[0][1] && (s[0][1] = b[1]), b[1] > s[1][1] && (s[1][1] = b[1])), O.length === 0 ? O = [Array.from(b), Array.from(b)] : (b[0] < O[0][0] && (O[0][0] = b[0]), b[0] > O[1][0] && (O[1][0] = b[0]), b[1] < O[0][1] && (O[0][1] = b[1]), b[1] > O[1][1] && (O[1][1] = b[1]));
      }), O;
    }), f = (s[1][0] - s[0][0]) / o, d = (s[1][1] - s[0][1]) / o, x = c.reduce(
      (w, O, b) => {
        const m = It(O[0][0], s[0][0], f, o), M = It(O[1][0], s[0][0], f, o), p = It(O[0][1], s[0][1], d, o), y = It(O[1][1], s[0][1], d, o);
        for (let g = m; g <= M; g++) {
          w[g] || (w[g] = []);
          for (let E = p; E <= y; E++)
            w[g][E] || (w[g][E] = []), w[g][E].push(b);
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
        xUnit: l,
        yUnit: h,
        gridCache: u
      },
      bakw: {
        gridNum: o,
        xOrigin: s[0][0],
        yOrigin: s[0][1],
        xUnit: f,
        yUnit: d,
        gridCache: x
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
    if (this.bounds && !n && !i && !qe(o, this.boundsPolygon))
      return !1;
    const r = n ? this.tins.bakw : this.tins.forw, s = n ? this.indexedTins.bakw : this.indexedTins.forw, a = n ? this.vertices_params.bakw : this.vertices_params.forw, l = n ? this.centroid.bakw : this.centroid.forw;
    let h, u;
    this.stateFull && (this.stateBackward == n ? h = this.stateTriangle : (this.stateBackward = n, this.stateTriangle = void 0), u = (f) => {
      this.stateTriangle = f;
    });
    let c = ne(
      o,
      r,
      s,
      a,
      l,
      void 0,
      h,
      u
    );
    if (this.bounds && n && !i) {
      const f = se(c);
      if (!qe(f, this.boundsPolygon)) return !1;
    } else this.yaxisMode == Mt.YAXIS_FOLLOW && !n && (c = [c[0], -1 * c[1]]);
    return c;
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
    let a = 1 / 0, l = 1 / 0, h = -1 / 0, u = -1 / 0;
    for (let k = 0; k < s; k++) {
      const P = t[2 * k], B = t[2 * k + 1];
      P < a && (a = P), B < l && (l = B), P > h && (h = P), B > u && (u = B), this._ids[k] = k;
    }
    const c = (a + h) / 2, f = (l + u) / 2;
    let d = 0, x = 0, w = 0;
    for (let k = 0, P = 1 / 0; k < s; k++) {
      const B = Ve(c, f, t[2 * k], t[2 * k + 1]);
      B < P && (d = k, P = B);
    }
    const O = t[2 * d], b = t[2 * d + 1];
    for (let k = 0, P = 1 / 0; k < s; k++) {
      if (k === d) continue;
      const B = Ve(O, b, t[2 * k], t[2 * k + 1]);
      B < P && B > 0 && (x = k, P = B);
    }
    let m = t[2 * x], M = t[2 * x + 1], p = 1 / 0;
    for (let k = 0; k < s; k++) {
      if (k === d || k === x) continue;
      const P = vr(O, b, m, M, t[2 * k], t[2 * k + 1]);
      P < p && (w = k, p = P);
    }
    let y = t[2 * w], g = t[2 * w + 1];
    if (p === 1 / 0) {
      for (let B = 0; B < s; B++)
        this._dists[B] = t[2 * B] - t[0] || t[2 * B + 1] - t[1];
      Kt(this._ids, this._dists, 0, s - 1);
      const k = new Uint32Array(s);
      let P = 0;
      for (let B = 0, C = -1 / 0; B < s; B++) {
        const F = this._ids[B], v = this._dists[F];
        v > C && (k[P++] = F, C = v);
      }
      this.hull = k.subarray(0, P), this.triangles = new Uint32Array(0), this.halfedges = new Int32Array(0);
      return;
    }
    if (Ot(O, b, m, M, y, g) < 0) {
      const k = x, P = m, B = M;
      x = w, m = y, M = g, w = k, y = P, g = B;
    }
    const E = br(O, b, m, M, y, g);
    this._cx = E.x, this._cy = E.y;
    for (let k = 0; k < s; k++)
      this._dists[k] = Ve(t[2 * k], t[2 * k + 1], E.x, E.y);
    Kt(this._ids, this._dists, 0, s - 1), this._hullStart = d;
    let S = 3;
    i[d] = n[w] = x, i[x] = n[d] = w, i[w] = n[x] = d, o[d] = 0, o[x] = 1, o[w] = 2, r.fill(-1), r[this._hashKey(O, b)] = d, r[this._hashKey(m, M)] = x, r[this._hashKey(y, g)] = w, this.trianglesLen = 0, this._addTriangle(d, x, w, -1, -1, -1);
    for (let k = 0, P = 0, B = 0; k < this._ids.length; k++) {
      const C = this._ids[k], F = t[2 * C], v = t[2 * C + 1];
      if (k > 0 && Math.abs(F - P) <= Sn && Math.abs(v - B) <= Sn || (P = F, B = v, C === d || C === x || C === w)) continue;
      let I = 0;
      for (let _ = 0, N = this._hashKey(F, v); _ < this._hashSize && (I = r[(N + _) % this._hashSize], !(I !== -1 && I !== i[I])); _++)
        ;
      I = n[I];
      let A = I, T;
      for (; T = i[A], Ot(F, v, t[2 * A], t[2 * A + 1], t[2 * T], t[2 * T + 1]) >= 0; )
        if (A = T, A === I) {
          A = -1;
          break;
        }
      if (A === -1) continue;
      let X = this._addTriangle(A, C, i[A], -1, -1, o[A]);
      o[C] = this._legalize(X + 2), o[A] = X, S++;
      let $ = i[A];
      for (; T = i[$], Ot(F, v, t[2 * $], t[2 * $ + 1], t[2 * T], t[2 * T + 1]) < 0; )
        X = this._addTriangle($, C, T, o[C], -1, o[$]), o[C] = this._legalize(X + 2), i[$] = $, S--, $ = T;
      if (A === I)
        for (; T = n[A], Ot(F, v, t[2 * T], t[2 * T + 1], t[2 * A], t[2 * A + 1]) < 0; )
          X = this._addTriangle(T, C, A, -1, o[A], o[T]), this._legalize(X + 2), o[T] = X, i[A] = A, S--, A = T;
      this._hullStart = n[C] = A, i[A] = n[$] = C, i[C] = $, r[this._hashKey(F, v)] = C, r[this._hashKey(t[2 * A], t[2 * A + 1])] = A;
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
      const a = i[t], l = t - t % 3;
      if (s = l + (t + 2) % 3, a === -1) {
        if (r === 0) break;
        t = ve[--r];
        continue;
      }
      const h = a - a % 3, u = l + (t + 1) % 3, c = h + (a + 2) % 3, f = n[s], d = n[t], x = n[u], w = n[c];
      if (yr(
        o[2 * f],
        o[2 * f + 1],
        o[2 * d],
        o[2 * d + 1],
        o[2 * x],
        o[2 * x + 1],
        o[2 * w],
        o[2 * w + 1]
      )) {
        n[t] = w, n[a] = f;
        const b = i[c];
        if (b === -1) {
          let M = this._hullStart;
          do {
            if (this._hullTri[M] === c) {
              this._hullTri[M] = t;
              break;
            }
            M = this._hullPrev[M];
          } while (M !== this._hullStart);
        }
        this._link(t, b), this._link(a, i[s]), this._link(s, c);
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
  const l = e - s, h = t - a, u = n - s, c = i - a, f = o - s, d = r - a, x = l * l + h * h, w = u * u + c * c, O = f * f + d * d;
  return l * (c * O - w * d) - h * (u * O - w * f) + x * (u * d - c * f) < 0;
}
function vr(e, t, n, i, o, r) {
  const s = n - e, a = i - t, l = o - e, h = r - t, u = s * s + a * a, c = l * l + h * h, f = 0.5 / (s * h - a * l), d = (h * u - a * c) * f, x = (s * c - l * u) * f;
  return d * d + x * x;
}
function br(e, t, n, i, o, r) {
  const s = n - e, a = i - t, l = o - e, h = r - t, u = s * s + a * a, c = l * l + h * h, f = 0.5 / (s * h - a * l), d = e + (h * u - a * c) * f, x = t + (s * c - l * u) * f;
  return { x: d, y: x };
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
    const a = e[r], l = t[a];
    for (; ; ) {
      do
        r++;
      while (t[e[r]] < l);
      do
        s--;
      while (t[e[s]] > l);
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
function Ut(e) {
  return e % 3 === 2 ? e - 2 : e + 1;
}
function Pt(e) {
  return e % 3 === 0 ? e + 2 : e - 1;
}
function kn(e, t, n, i, o, r, s, a) {
  const l = Ot(e, t, o, r, s, a), h = Ot(n, i, o, r, s, a);
  if (l > 0 && h > 0 || l < 0 && h < 0)
    return !1;
  const u = Ot(o, r, e, t, n, i), c = Ot(s, a, e, t, n, i);
  return u > 0 && c > 0 || u < 0 && c < 0 ? !1 : l === 0 && h === 0 && u === 0 && c === 0 ? !(Math.max(o, s) < Math.min(e, n) || Math.max(e, n) < Math.min(o, s) || Math.max(r, a) < Math.min(t, i) || Math.max(t, i) < Math.min(r, a)) : !0;
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
    this.assertVertex(t, t, n), this.assertVertex(n, t, n);
    const r = this.vertMap[t];
    if (r >= i.length)
      throw new Error(
        `Invalid edge [${t}, ${n}]: vertex ${t} is not part of the triangulation`
      );
    const s = this.maxConstrainSteps();
    let a = 0, l = r;
    do {
      if (++a > s)
        throw new Error(
          `Constraining edge [${t}, ${n}] exceeded the iteration limit`
        );
      const c = i[l], f = Ut(l);
      if (c === n)
        return this.protect(l);
      const d = Pt(l), x = i[d];
      if (x === n)
        return this.protect(f), f;
      if (this.intersectSegments(t, n, x, c)) {
        l = d;
        break;
      }
      l = o[f];
    } while (l !== -1 && l !== r);
    let h = l, u = -1;
    for (; l !== -1; ) {
      if (++a > s)
        throw new Error(
          `Constraining edge [${t}, ${n}] exceeded the iteration limit`
        );
      const c = o[l], f = Pt(l), d = Pt(c), x = Ut(c);
      if (c === -1)
        throw new Error("Constraining edge exited the hull");
      if (this.consd.has(l))
        throw new Error("Edge intersects already constrained edge");
      if (this.isCollinear(t, n, i[l]) || this.isCollinear(t, n, i[c]))
        throw new Error("Constraining edge intersects point");
      if (!this.intersectSegments(
        i[l],
        i[c],
        i[f],
        i[d]
      )) {
        if (u === -1 && (u = l), i[d] === n) {
          if (l === u)
            throw new Error("Infinite loop: non-convex quadrilateral");
          l = u, u = -1;
          continue;
        }
        if (this.intersectSegments(
          t,
          n,
          i[d],
          i[c]
        ))
          l = d;
        else if (this.intersectSegments(
          t,
          n,
          i[x],
          i[d]
        ))
          l = x;
        else if (u === l)
          throw new Error("Infinite loop: no further intersect after non-convex");
        continue;
      }
      if (this.flipDiagonal(l), this.intersectSegments(
        t,
        n,
        i[f],
        i[d]
      ) && (u === -1 && (u = f), u === f))
        throw new Error("Infinite loop: flipped diagonal still intersects");
      i[d] === n ? (h = d, l = u, u = -1) : this.intersectSegments(
        t,
        n,
        i[x],
        i[d]
      ) && (l = x);
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
        const l = n[a];
        l !== -1 && (i.delete(l), this.isDelaunay(a) || (this.flipDiagonal(a), s++));
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
    let s = i, a;
    do {
      if (o[s] === t)
        return s;
      a = Ut(s), s = r[a];
    } while (s !== -1 && s !== i);
    return o[Ut(a)] === t ? -a : 1 / 0;
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
    const { triangles: n, halfedges: i } = this.del, o = this.flips, r = this.consd, s = i[t], a = Pt(t), l = Ut(t), h = Pt(s), u = Ut(s), c = i[a], f = i[h];
    if (r.has(t))
      throw new Error("Trying to flip a constrained edge");
    return n[t] = n[h], i[t] = f, o.set(t, o.has(h)) || r.set(t, r.has(h)), f !== -1 && (i[f] = t), i[a] = h, n[s] = n[a], i[s] = c, o.set(s, o.has(a)) || r.set(s, r.has(a)), c !== -1 && (i[c] = s), i[h] = a, this.markFlip(t), this.markFlip(l), this.markFlip(s), this.markFlip(u), o.add(a), r.delete(a), o.add(h), r.delete(h), this.updateVert(t), this.updateVert(l), this.updateVert(s), this.updateVert(u), a;
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
    const r = n[Pt(t)], s = n[t], a = n[Ut(t)], l = n[Pt(o)];
    return !this.inCircle(r, s, a, l);
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
    (l) => l.geometry.coordinates
  ), o = Ge.from(i);
  let r;
  const s = [];
  o.triangles.length !== 0 && t.length !== 0 && (r = new Er(o), r.constrainAll(t));
  for (let l = 0; l < o.triangles.length; l += 3)
    s.push([o.triangles[l], o.triangles[l + 1], o.triangles[l + 2]]);
  const a = ["a", "b", "c"];
  return St(
    s.map((l) => {
      const h = {}, u = l.map((c, f) => {
        const d = e.features[c], x = d.geometry.coordinates, w = [x[0], x[1]];
        return x.length === 3 ? w[2] = x[2] : h[a[f]] = d.properties[n], w;
      });
      return u[3] = u[0], le([u], h);
    })
  );
}
function kr(e, t) {
  const n = [[], [], [], []], i = [];
  return Object.keys(e).forEach((o) => {
    const r = e[o], s = r.forw, a = r.bakw, l = [
      s[0] - t.forw[0],
      s[1] - t.forw[1]
    ], h = [
      a[0] - t.bakw[0],
      t.bakw[1] - a[1]
    ], u = { forw: l, bakw: h };
    if (i.push(u), l[0] === 0 || l[1] === 0)
      return;
    let c = 0;
    l[0] > 0 && (c += 1), l[1] > 0 && (c += 2), n[c].push(u);
  }), { perQuad: n, aggregate: i };
}
function Ar(e) {
  let t = 1 / 0, n = 0, i = 0;
  return e.forEach((o) => {
    const { forw: r, bakw: s } = o, a = Math.hypot(r[0], r[1]), l = Math.hypot(s[0], s[1]);
    if (l === 0) return;
    const h = a / l, u = Math.atan2(r[0], r[1]) - Math.atan2(s[0], s[1]);
    t = Math.min(t, h), n += Math.cos(u), i += Math.sin(u);
  }), isFinite(t) ? [t, Math.atan2(i, n)] : [1, 0];
}
function Ir(e, t, n) {
  const { perQuad: i, aggregate: o } = kr(e, t), r = i.every((l) => l.length > 0), a = (n === "birdeye" ? r ? i : [o] : [o]).map((l) => Ar(l));
  return a.length === 1 ? [a[0], a[0], a[0], a[0]] : a;
}
function Or(e, t) {
  let n = 0;
  return e[0] > t[0] && (n += 1), e[1] > t[1] && (n += 2), n;
}
function Pr(e, t, n) {
  const i = [
    e[0] - t.forw[0],
    e[1] - t.forw[1]
  ], r = Math.sqrt(i[0] ** 2 + i[1] ** 2) / n[0], s = Math.atan2(i[0], i[1]) - n[1];
  return [
    t.bakw[0] + r * Math.sin(s),
    t.bakw[1] - r * Math.cos(s)
  ];
}
function Br(e, t, n, i) {
  const o = t[0] - e[0], r = t[1] - e[1];
  if (Math.abs(o) < 1e-12 && Math.abs(r) < 1e-12) return null;
  const s = i[0] - n[0], a = i[1] - n[1], l = n[0] - e[0], h = n[1] - e[1], u = o * a - r * s;
  if (Math.abs(u) < 1e-12) return null;
  const c = (l * a - h * s) / u, f = (l * r - h * o) / u;
  return c <= 1e-10 || f < -1e-10 || f > 1 + 1e-10 ? null : { t: c, point: [e[0] + c * o, e[1] + c * r] };
}
function Nr(e, t, n) {
  const i = n.length;
  let o = -1 / 0, r = null;
  for (let s = 0; s < i; s++) {
    const a = (s + 1) % i, l = Br(
      e,
      t,
      n[s].bakw,
      n[a].bakw
    );
    l && l.t > o && (o = l.t, r = l.point);
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
  const l = [];
  if (s !== 0)
    for (const u of [n, i]) {
      const c = (u - e[0]) / s;
      if (c > 0) {
        const f = e[1] + c * a;
        f >= o && f <= r && l.push({ t: c, x: u, y: f });
      }
    }
  if (a !== 0)
    for (const u of [o, r]) {
      const c = (u - e[1]) / a;
      if (c > 0) {
        const f = e[0] + c * s;
        f >= n && f <= i && l.push({ t: c, x: f, y: u });
      }
    }
  if (l.length === 0) return null;
  l.sort((u, c) => u.t - c.t);
  const h = l[0];
  return [h.x, h.y];
}
function On(e, t, n) {
  const i = e.length, o = new Array(i).fill(1);
  for (const r of t)
    for (let s = 0; s < i; s++) {
      const a = (s + 1) % i, l = He([e[s].bakw, e[a].bakw]), h = He([n.bakw, r.bakw]), u = Pi(l, h);
      if (u.features.length > 0 && u.features[0].geometry) {
        const c = u.features[0], f = Math.sqrt(
          Math.pow(r.bakw[0] - n.bakw[0], 2) + Math.pow(r.bakw[1] - n.bakw[1], 2)
        ), d = Math.sqrt(
          Math.pow(c.geometry.coordinates[0] - n.bakw[0], 2) + Math.pow(c.geometry.coordinates[1] - n.bakw[1], 2)
        ), x = f / d;
        x > o[s] && (o[s] = x), x > o[a] && (o[a] = x);
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
  const { convexBuf: i, centroid: o, allGcps: r, minx: s, maxx: a, miny: l, maxy: h } = e, u = Ir(i, o, t), f = [
    [s, l],
    [a, l],
    [a, h],
    [s, h]
  ].map((g) => ({
    forw: g,
    bakw: Pr(
      g,
      o,
      u[Or(g, o.forw)]
    )
  }));
  if (f.sort(
    (g, E) => Math.atan2(g.forw[0] - o.forw[0], g.forw[1] - o.forw[1]) - Math.atan2(E.forw[0] - o.forw[0], E.forw[1] - o.forw[1])
  ), On(f, r, o), !n) return f;
  const d = 4, x = f.map(
    (g) => Math.atan2(g.forw[0] - o.forw[0], g.forw[1] - o.forw[1])
  ), w = f.map(
    (g) => Math.atan2(
      g.bakw[0] - o.bakw[0],
      -(g.bakw[1] - o.bakw[1])
    )
  );
  function O(g) {
    for (let E = 0; E < d; E++) {
      const S = (E + 1) % d, k = x[E], P = E < d - 1 ? x[S] : x[S] + 2 * Math.PI;
      let B = g;
      for (; B < k; ) B += 2 * Math.PI;
      for (; B >= k + 2 * Math.PI; ) B -= 2 * Math.PI;
      if (B >= k && B < P)
        return { i: E, j: S, frac: (B - k) / (P - k) };
    }
    return { i: 0, j: 1, frac: 0 };
  }
  function b(g) {
    const { i: E, j: S, frac: k } = O(g), P = w[E];
    let C = w[S] - P;
    for (; C > Math.PI; ) C -= 2 * Math.PI;
    for (; C < -Math.PI; ) C += 2 * Math.PI;
    return P + k * C;
  }
  const m = new Set(
    f.map(
      (g) => Math.floor(An(g.forw, o.forw) / 10) % 36
    )
  ), M = r.map((g) => ({
    forw: g.forw,
    bakw: g.bakw,
    angleDeg: An(g.forw, o.forw),
    forwDist: Math.hypot(g.forw[0] - o.forw[0], g.forw[1] - o.forw[1])
  })), p = [];
  for (let g = 0; g < 36; g++) {
    if (m.has(g)) continue;
    const E = g * 10, S = M.filter(
      (I) => I.angleDeg >= E && I.angleDeg < E + 10
    );
    let k = null;
    if (S.length > 0) {
      const I = S.reduce((A, T) => T.forwDist > A.forwDist ? T : A);
      k = In(o.forw, I.forw, s, a, l, h);
    }
    if (!k) {
      const I = (E + 5) % 360 * (Math.PI / 180), A = [
        o.forw[0] + Math.sin(I),
        o.forw[1] + Math.cos(I)
      ];
      k = In(o.forw, A, s, a, l, h);
    }
    if (!k) continue;
    const P = [k[0] - o.forw[0], k[1] - o.forw[1]], B = Math.atan2(P[0], P[1]), C = b(B), F = [
      o.bakw[0] + Math.sin(C),
      o.bakw[1] - Math.cos(C)
    ], v = Nr(o.bakw, F, f);
    v && p.push({ forw: k, bakw: v });
  }
  const y = [...f, ...p];
  return y.sort(
    (g, E) => Math.atan2(g.forw[0] - o.forw[0], g.forw[1] - o.forw[1]) - Math.atan2(E.forw[0] - o.forw[0], E.forw[1] - o.forw[1])
  ), On(y, r, o), y;
}
function Tr(e, t = !1) {
  return Gn(e, "plain", t);
}
function Cr(e, t = !1) {
  return Gn(e, "birdeye", t);
}
function uo(e) {
  return Kn(e, 1 / 0);
}
const Pn = 1e5;
function Kn(e, t) {
  return Xr(e), new Dr(e).findSegmentIntersections(t).map(
    (o) => Rt([o.x, o.y])
  );
}
function Xr(e) {
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
class Dr {
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
    (r != this._xx.length || this._xx.length != this._yy.length) && jt("ArcCollection#initXYData() Counting error"), this.initBounds(), this._arcIter = new no(this._xx, this._yy);
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
    let a = 0, l, h, u;
    for (let c = 0; c < o; c++)
      l = i[c], l > 0 && (h = c * 4, u = io(t, n, a, l), r[h++] = u[0], r[h++] = u[1], r[h++] = u[2], r[h] = u[3], a += l, s.mergeBounds(u));
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
    let l = i ? this._ii[o] : this._ii[o] + s - 1, h = l, u = 0;
    for (let c = 1; c < s; c++)
      h += a, (r === 0 || this._zz[h] >= r) && (n(l, h, this._xx, this._yy), l = h, u++);
    return u;
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
    const n = this.getBounds(), i = n.ymin || 0, o = (n.ymax || 0) - i, r = this.calcSegmentIntersectionStripeCount(), s = new Uint32Array(r), a = r > 1 ? (b) => Math.floor((r - 1) * (b - i) / o) : () => 0, l = r + 1;
    let h;
    this.forEachSegment(
      (b, m, M, p) => {
        let y = a(p[b]);
        const g = a(p[m]);
        let E = 0;
        for (; s[y] = s[y] + 2, y != g; )
          E++, E > l && jt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${r}`,
            `s1=${y}`,
            `s2=${g}`
          ), y += g > y ? 1 : -1;
      }
    );
    const u = this.getUint32Array(Yr(s));
    let c = 0;
    const f = [];
    Rr(s, (b) => {
      const m = c;
      c += b, f.push(u.subarray(m, c));
    }), Lr(s, 0), this.forEachSegment(
      (b, m, M, p) => {
        let y = a(p[b]);
        const g = a(p[m]);
        let E, S, k = 0;
        for (; E = s[y], s[y] = E + 2, S = f[y], S[E] = b, S[E + 1] = m, y != g; )
          k++, k > l && jt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${r}`,
            `s1=${y}`,
            `s2=${g}`
          ), y += g > y ? 1 : -1;
      }
    );
    const d = this.getVertexData(), x = /* @__PURE__ */ new Set(), w = /* @__PURE__ */ new Map(), O = (b) => {
      const m = eo(b);
      return x.has(m) || (x.add(m), w.set(`${b.x}:${b.y}`, b)), w.size >= t;
    };
    if (d.xx && d.yy)
      for (h = 0; h < r && !Vr(f[h], d.xx, d.yy, O); h++)
        ;
    return Array.from(w.values());
  }
}
function jt(...e) {
  const t = e.join(" ");
  throw new Error(t);
}
function ae(e) {
  return e ? Fr(e) ? !0 : $r(e) ? !1 : e.length === 0 ? !0 : e.length > 0 : !1;
}
function $r(e) {
  return e != null && e.toString === String.prototype.toString;
}
function Fr(e) {
  return Array.isArray(e);
}
function Yr(e, t) {
  ae(e) || jt("utils.sum() expects an array, received:", e);
  let n = 0, i;
  for (let o = 0, r = e.length; o < r; o++)
    i = e[o], i && (n += i);
  return n;
}
function Rr(e, t, n) {
  if (!ae(e))
    throw new Error(`#forEach() takes an array-like argument. ${e}`);
  for (let i = 0, o = e.length; i < o; i++)
    t.call(n, e[i], i);
}
function Lr(e, t) {
  for (let n = 0, i = e.length; n < i; n++)
    e[n] = t;
  return e;
}
function Vr(e, t, n, i) {
  const o = e.length - 2;
  let r, s, a, l, h, u, c, f, d, x, w, O, b, m, M, p, y;
  for (Wr(t, e), p = 0; p < o; ) {
    for (r = e[p], s = e[p + 1], h = t[r], u = t[s], d = n[r], x = n[s], y = p; y < o && (y += 2, a = e[y], c = t[a], !(u < c)); ) {
      if (w = n[a], l = e[y + 1], f = t[l], O = n[l], d >= w) {
        if (d > O && x > w && x > O) continue;
      } else if (d < O && x < w && x < O) continue;
      if (!(r == a || r == l || s == a || s == l) && (b = qr(
        h,
        d,
        u,
        x,
        c,
        w,
        f,
        O
      ), b && (m = [r, s], M = [a, l], i(Nn(b, m, M, t, n)) || b.length == 4 && i(Nn(b.slice(2), m, M, t, n)))))
        return !0;
    }
    p += 2;
  }
  return !1;
}
function qr(e, t, n, i, o, r, s, a) {
  const l = Ur(e, t, n, i, o, r, s, a);
  let h = null;
  return l && (h = jr(e, t, n, i, o, r, s, a), h ? Hr(e, t, n, i, o, r, s, a) && (h = null) : h = Qr(e, t, n, i, o, r, s, a)), h;
}
function Ur(e, t, n, i, o, r, s, a) {
  return ie(e, t, n, i, o, r) * ie(e, t, n, i, s, a) <= 0 && ie(o, r, s, a, e, t) * ie(o, r, s, a, n, i) <= 0;
}
function ie(e, t, n, i, o, r) {
  return Qn(e - o, t - r, n - o, i - r);
}
function Qn(e, t, n, i) {
  return e * i - t * n;
}
function jr(e, t, n, i, o, r, s, a) {
  let l = xe(e, t, n, i, o, r, s, a), h;
  return l && (h = Jr(l[0], l[1], e, t, n, i, o, r, s, a), h == 1 ? l = xe(n, i, e, t, o, r, s, a) : h == 2 ? l = xe(o, r, s, a, e, t, n, i) : h == 3 && (l = xe(s, a, o, r, e, t, n, i))), l && Kr(l, e, t, n, i, o, r, s, a), l;
}
function xe(e, t, n, i, o, r, s, a) {
  const l = Qn(n - e, i - t, s - o, a - r), h = 1e-18;
  let u;
  if (l === 0) return null;
  const c = ie(o, r, s, a, e, t) / l;
  return l <= h && l >= -h ? u = zr(e, t, n, i, o, r, s, a) : u = [e + c * (n - e), t + c * (i - t)], u;
}
function zr(e, t, n, i, o, r, s, a) {
  let l = null;
  return !Bt(e, o, s) && !Bt(t, r, a) ? l = [e, t] : !Bt(n, o, s) && !Bt(i, r, a) ? l = [n, i] : !Bt(o, e, n) && !Bt(r, t, i) ? l = [o, r] : !Bt(s, e, n) && !Bt(a, t, i) && (l = [s, a]), l;
}
function Bt(e, t, n) {
  let i;
  return t < n ? i = e < t || e > n : t > n ? i = e > t || e < n : i = e != t, i;
}
function Jr(e, t, ...n) {
  let i = -1, o = 1 / 0, r;
  for (let s = 0, a = 0, l = n.length; a < l; s++, a += 2)
    r = Gr(e, t, n[a], n[a + 1]), r < o && (o = r, i = s);
  return i;
}
function Gr(e, t, n, i) {
  const o = e - n, r = t - i;
  return o * o + r * r;
}
function Kr(e, t, n, i, o, r, s, a, l) {
  let h = e[0], u = e[1];
  h = _e(h, t, i), h = _e(h, r, a), u = _e(u, n, o), u = _e(u, s, l), e[0] = h, e[1] = u;
}
function _e(e, t, n) {
  let i;
  return Bt(e, t, n) && (i = Math.abs(e - t) < Math.abs(e - n) ? t : n, e = i), e;
}
function Qr(e, t, n, i, o, r, s, a) {
  const l = Math.min(e, n, o, s), h = Math.max(e, n, o, s), u = Math.min(t, i, r, a), c = Math.max(t, i, r, a), f = c - u > h - l;
  let d = [];
  return (f ? Yt(t, u, c) : Yt(e, l, h)) && d.push(e, t), (f ? Yt(i, u, c) : Yt(n, l, h)) && d.push(n, i), (f ? Yt(r, u, c) : Yt(o, l, h)) && d.push(o, r), (f ? Yt(a, u, c) : Yt(s, l, h)) && d.push(s, a), (d.length != 2 && d.length != 4 || d.length == 4 && d[0] == d[2] && d[1] == d[3]) && (d = null), d;
}
function Hr(e, t, n, i, o, r, s, a) {
  return e == o && t == r || e == s && t == a || n == o && i == r || n == s && i == a;
}
function Yt(e, t, n) {
  return e > t && e < n;
}
function Wr(e, t) {
  Zr(e, t), Hn(e, t, 0, t.length - 2);
}
function Zr(e, t) {
  for (let n = 0, i = t.length; n < i; n += 2)
    e[t[n]] > e[t[n + 1]] && to(t, n, n + 1);
}
function to(e, t, n) {
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
    if (r - n < 40 ? Bn(e, t, n, r) : Hn(e, t, n, r), i - o < 40) {
      Bn(e, t, o, i);
      return;
    }
    n = o, r = i;
  }
}
function Bn(e, t, n, i) {
  let o, r;
  for (let s = n + 2; s <= i; s += 2) {
    o = t[s], r = t[s + 1];
    let a;
    for (a = s - 2; a >= n && e[o] < e[t[a]]; a -= 2)
      t[a + 2] = t[a], t[a + 3] = t[a + 1];
    t[a + 2] = o, t[a + 3] = r;
  }
}
function Nn(e, t, n, i, o) {
  const r = e[0], s = e[1];
  t = Tn(r, s, t[0], t[1], i, o), n = Tn(r, s, n[0], n[1], i, o);
  const a = t[0] < n[0] ? t : n, l = a == t ? n : t;
  return { x: r, y: s, a, b: l };
}
function Tn(e, t, n, i, o, r) {
  let s = n < i ? n : i, a = s === n ? i : n;
  return o[s] == e && r[s] == t ? a = s : o[a] == e && r[a] == t && (s = a), [s, a];
}
function eo(e) {
  return `${e.a.join(",")};${e.b.join(",")}`;
}
class no {
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
function io(e, t, n, i) {
  let o = n | 0;
  const r = isNaN(i) ? e.length - o : i + o;
  let s, a, l, h, u, c;
  if (r > 0)
    l = u = e[o], h = c = t[o];
  else return [void 0, void 0, void 0, void 0];
  for (o++; o < r; o++)
    s = e[o], a = t[o], s < l && (l = s), s > u && (u = s), a < h && (h = a), a > c && (c = a);
  return [l, h, u, c];
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
    let r, s, a, l;
    if (arguments.length == 1)
      if (ae(t)) {
        const h = t;
        r = h[0], s = h[1], a = h[2], l = h[3];
      } else {
        const h = t;
        r = h.xmin, s = h.ymin, a = h.xmax, l = h.ymax;
      }
    else
      r = t, s = n, a = i, l = o;
    return this.xmin = r, this.ymin = s, this.xmax = a, this.ymax = l, (r > a || s > l) && this.update(), this;
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
    const a = s.filter((l) => l !== t);
    a.length === 0 ? delete e[r] : e[r] = a;
  }), n) {
    const r = (s, a) => {
      !s || !a || (s.features = s.features.filter((l) => l !== a));
    };
    r(n.forw, t.forw), r(n.bakw, t.bakw);
  }
}
function Me(e, t, n) {
  return Rt(e, { target: { geom: t, index: n } });
}
function Se(e) {
  return Rt(e.properties.target.geom, {
    target: {
      geom: e.geometry.coordinates,
      index: e.properties.target.index
    }
  });
}
function Xn(e, t) {
  const n = e.length, i = t.geometry.coordinates;
  return Array.from({ length: n }, (o, r) => r).map((o) => {
    const r = (o + 1) % n, s = e[o], a = e[r], l = s.geometry.coordinates, h = Math.atan2(
      l[0] - i[0],
      l[1] - i[1]
    ), u = [t, s, a, t].map(
      (d) => d.geometry.coordinates
    ), c = {
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
    }, f = St([
      le([u], c)
    ]);
    return [h, f];
  }).reduce(
    (o, r) => (o[0].push(r[0]), o[1].push(r[1]), o),
    [[], []]
  );
}
function Ee(e, t = 1e-6) {
  const [n, i] = e[0], [o, r] = e[1], [s, a] = e[2];
  return Math.abs((o - n) * (a - i) - (s - n) * (r - i)) < t;
}
function ro(e, t) {
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
const oo = 10;
function so(e, t, n, i, o, r) {
  if (!e && !t) return !1;
  const s = e ? 0 : 1, a = 1 - s, l = n[s], h = n[a];
  if (!l || !h) return !1;
  const u = xt(h.geom);
  let c = !1, f = !1;
  for (let d = 0; d <= 1; d++) {
    const x = i[d];
    if (!x) continue;
    const w = [String(x.prop.index), String(l.prop.index)].sort().join("-"), O = o[w];
    if (!O || O.length < 2) continue;
    const b = O.find(
      (B) => B.bakw !== r[s].bakw
    );
    if (!b) continue;
    const M = re(b.bakw).find(
      (B) => String(B.prop.index) !== String(x.prop.index) && String(B.prop.index) !== String(l.prop.index)
    );
    if (!M) continue;
    c = !0;
    const p = xt(M.geom), y = xt(x.geom), g = xt(l.geom), E = g[0] - y[0], S = g[1] - y[1], k = E * (u[1] - y[1]) - S * (u[0] - y[0]), P = E * (p[1] - y[1]) - S * (p[0] - y[0]);
    if (k * P > 0) {
      f = !0;
      break;
    }
  }
  return c && !f;
}
function ao(e, t, n, i) {
  if (!e && !t) return !1;
  if (n[0] && n[1] && i[0] && i[1]) {
    const o = i.map((u) => xt(u.geom)), r = n.map((u) => xt(u.geom)), s = o[1][0] - o[0][0], a = o[1][1] - o[0][1], l = s * (r[0][1] - o[0][1]) - a * (r[0][0] - o[0][0]), h = s * (r[1][1] - o[0][1]) - a * (r[1][0] - o[0][0]);
    return l * h < 0;
  }
  return !1;
}
function co(e, t, n, i) {
  const o = ro(n, i), r = /* @__PURE__ */ new Set();
  let s = !1;
  for (let a = 0; a < oo; a++) {
    let l = !1;
    for (const h of Object.keys(t)) {
      if (r.has(h)) continue;
      r.add(h);
      const u = t[h];
      if (!u || u.length < 2) continue;
      const c = h.split("-");
      if (c.length !== 2 || o.has(h)) continue;
      const f = re(u[0].bakw), d = re(u[1].bakw), x = re(u[0].forw), w = re(u[1].forw), O = c.map(
        (_) => f.find((N) => `${N.prop.index}` === _) || d.find((N) => `${N.prop.index}` === _)
      ), b = c.map(
        (_) => x.find((N) => `${N.prop.index}` === _) || w.find((N) => `${N.prop.index}` === _)
      );
      if (O.some((_) => !_) || b.some((_) => !_))
        continue;
      const m = [f, d].map(
        (_) => _.find((N) => !c.includes(`${N.prop.index}`))
      ), M = [x, w].map(
        (_) => _.find((N) => !c.includes(`${N.prop.index}`))
      );
      if (m.some((_) => !_) || M.some((_) => !_))
        continue;
      const p = u[0].bakw.geometry.coordinates[0].slice(0, 3).map((_) => xt(_)), y = u[1].bakw.geometry.coordinates[0].slice(0, 3).map((_) => xt(_)), g = u[0].forw.geometry.coordinates[0].slice(0, 3).map((_) => xt(_)), E = u[1].forw.geometry.coordinates[0].slice(0, 3).map((_) => xt(_)), S = Ee(p), k = Ee(y), P = Ee(g), B = Ee(E), C = so(
        S,
        k,
        m,
        O,
        t,
        u
      ), F = ao(
        P,
        B,
        m,
        O
      );
      if (!(C || F || Dn(
        xt(m[0].geom),
        y
      ) || Dn(
        xt(m[1].geom),
        p
      )))
        continue;
      const I = b.map(
        (_) => xt(_.geom)
      ), A = M.map(
        (_) => xt(_.geom)
      ), T = lo([
        ...I,
        ...A
      ]), X = ho(T), $ = $n(
        I[0],
        I[1],
        A[0]
      ) + $n(
        I[0],
        I[1],
        A[1]
      );
      je(X, $) && (Cn(t, u[0], e), Cn(t, u[1], e), O.forEach((_) => {
        if (!_) return;
        const N = [
          _.geom,
          m[0].geom,
          m[1].geom,
          _.geom
        ], D = {
          a: _.prop,
          b: m[0].prop,
          c: m[1].prop
        }, Y = le([N], D), L = zn(Y);
        Wn(t, {
          forw: L,
          bakw: Y
        }, e);
      }), l = !0, s = !0);
    }
    if (!l) break;
  }
  return s;
}
function xt(e) {
  return [e[0], e[1]];
}
function Dn(e, t) {
  const [n, i] = t[0], [o, r] = t[1], [s, a] = t[2], l = s - n, h = a - i, u = o - n, c = r - i, f = e[0] - n, d = e[1] - i, x = l * l + h * h, w = l * u + h * c, O = l * f + h * d, b = u * u + c * c, m = u * f + c * d, M = x * b - w * w;
  if (M === 0) return !1;
  const p = 1 / M, y = (b * O - w * m) * p, g = (x * m - w * O) * p, E = 1e-9;
  return y >= -E && g >= -E && y + g <= 1 + E;
}
function lo(e) {
  const t = e.map((s) => s.slice()).filter(
    (s, a, l) => l.findIndex(
      (h) => je(h[0], s[0]) && je(h[1], s[1])
    ) === a
  );
  if (t.length <= 1) return t;
  const n = t.sort(
    (s, a) => s[0] === a[0] ? s[1] - a[1] : s[0] - a[0]
  ), i = (s, a, l) => (a[0] - s[0]) * (l[1] - s[1]) - (a[1] - s[1]) * (l[0] - s[0]), o = [];
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
function ho(e) {
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
const Fn = 2.00704, Yn = 3.00001;
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
    return this.useV2Algorithm ? Fn : Yn;
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
      const l = t[a];
      l[0] < n && (n = l[0]), l[0] > i && (i = l[0]), l[1] < o && (o = l[1]), l[1] > r && (r = l[1]), s.push(l);
    }
    s.push(t[0]), this.boundsPolygon = le([s]), this.xy = [n, o], this.wh = [i - n, r - o], this.vertexMode = lt.VERTEX_PLAIN, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 現在の設定を永続化可能な形式にコンパイルします
   */
  getCompiled() {
    const t = {};
    t.version = this.useV2Algorithm ? Fn : Yn, t.points = this.points, t.weight_buffer = {}, t.centroid_point = [
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
      const l = this.tins.bakw.features[a];
      Wn(i, { forw: s, bakw: l });
    });
    const o = (this.pointsSet?.forw.features ?? []).map(
      (s) => s.properties.target.index
    );
    co(
      this.tins,
      i,
      this.pointsSet?.edges || [],
      o
    );
    const r = ["forw", "bakw"].map((s) => {
      const a = this.tins[s].features.map(
        (l) => l.geometry.coordinates[0]
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
      if (fo(r, this.points.length, o), s.length === 0 && a.length === 0) {
        n.push(r);
        continue;
      }
      s.unshift(this.points[r[0]][0]), s.push(this.points[r[1]][0]), a.unshift(this.points[r[0]][1]), a.push(this.points[r[1]][1]);
      const l = [s, a].map((h) => {
        const u = h.map((f, d, x) => {
          if (d === 0) return 0;
          const w = x[d - 1];
          return Math.sqrt(
            Math.pow(f[0] - w[0], 2) + Math.pow(f[1] - w[1], 2)
          );
        }), c = u.reduce((f, d, x) => x === 0 ? [0] : (f.push(f[x - 1] + d), f), []);
        return c.map((f, d, x) => {
          const w = f / x[x.length - 1];
          return [h[d], u[d], c[d], w];
        });
      });
      l.map((h, u) => {
        const c = l[u ? 0 : 1];
        return h.filter((f, d) => !(d === 0 || d === h.length - 1 || f[4] === "handled")).flatMap((f) => {
          const d = f[0], x = f[3], w = c.reduce(
            (O, b, m, M) => {
              if (O) return O;
              const p = M[m + 1];
              if (b[3] === x)
                return b[4] = "handled", [b];
              if (b[3] < x && p && p[3] > x)
                return [b, p];
            },
            void 0
          );
          if (w && w.length === 1)
            return u === 0 ? [[d, w[0][0], x]] : [[w[0][0], d, x]];
          if (w && w.length === 2) {
            const O = w[0], b = w[1], m = (x - O[3]) / (b[3] - O[3]), M = [
              (b[0][0] - O[0][0]) * m + O[0][0],
              (b[0][1] - O[0][1]) * m + O[0][1]
            ];
            return u === 0 ? [[d, M, x]] : [[M, d, x]];
          }
          return [];
        });
      }).reduce((h, u) => h.concat(u), []).sort((h, u) => h[2] < u[2] ? -1 : 1).map((h, u, c) => {
        this.edgeNodes[i] = [
          h[0],
          h[1]
        ];
        const f = Me(
          h[0],
          h[1],
          `e${i}`
        );
        i++, t.forw.push(f), t.bakw.push(Se(f)), u === 0 ? n.push([r[0], t.forw.length - 1]) : n.push([
          t.forw.length - 2,
          t.forw.length - 1
        ]), u === c.length - 1 && n.push([t.forw.length - 1, r[1]]);
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
    if (!this.points.reduce((l, h) => l && (r ? De(h[0], r) : h[0][0] >= t && h[0][0] <= n && h[0][1] >= i && h[0][1] <= o), !0))
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
      const l = a[0][0], h = a[0][1];
      l < t && (t = l), l > n && (n = l), h < i && (i = h), h > o && (o = h);
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
    const l = {
      forw: St(i.forw),
      bakw: St(i.bakw)
    }, h = be(
      l.forw,
      i.edges,
      "target"
    ), u = be(
      l.bakw,
      i.edges,
      "target"
    );
    if (h.features.length === 0 || u.features.length === 0)
      throw "TOO LINEAR1";
    const c = Ti(l.forw), f = mn(l.forw);
    if (!f) throw "TOO LINEAR2";
    const d = {}, x = f.geometry.coordinates[0];
    let w;
    try {
      w = x.map((S) => ({
        forw: S,
        bakw: ne(Rt(S), h)
      })), w.forEach((S) => {
        d[`${S.forw[0]}:${S.forw[1]}`] = S;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const O = mn(l.bakw);
    if (!O) throw "TOO LINEAR2";
    const b = O.geometry.coordinates[0];
    try {
      w = b.map((S) => ({
        bakw: S,
        forw: ne(Rt(S), u)
      })), w.forEach((S) => {
        d[`${S.forw[0]}:${S.forw[1]}`] = S;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    let m;
    if (n) {
      const S = c.geometry.coordinates, k = h.features.find(
        (P) => De(
          Rt(S),
          P
        )
      );
      if (k) {
        const P = k.geometry.coordinates[0], B = k.properties.a.geom, C = k.properties.b.geom, F = k.properties.c.geom;
        m = {
          forw: [
            (P[0][0] + P[1][0] + P[2][0]) / 3,
            (P[0][1] + P[1][1] + P[2][1]) / 3
          ],
          bakw: [
            (B[0] + C[0] + F[0]) / 3,
            (B[1] + C[1] + F[1]) / 3
          ]
        };
      } else
        m = {
          forw: S,
          bakw: ne(c, h)
        };
    } else
      m = {
        forw: c.geometry.coordinates,
        bakw: ne(c, h)
      };
    const M = Me(m.forw, m.bakw, "c");
    this.centroid = {
      forw: M,
      bakw: Se(M)
    };
    const p = [
      ...this.points.map((S) => ({ forw: S[0], bakw: S[1] })),
      ...(this.edgeNodes ?? []).map((S) => ({ forw: S[0], bakw: S[1] }))
    ], y = {
      convexBuf: d,
      centroid: m,
      allGcps: p,
      minx: o,
      maxx: r,
      miny: s,
      maxy: a
    }, g = this.vertexMode === lt.VERTEX_BIRDEYE ? Cr(y, n) : Tr(y, n), E = {
      forw: [],
      bakw: []
    };
    for (let S = 0; S < g.length; S++) {
      const k = g[S].forw, P = g[S].bakw, B = Me(k, P, `b${S}`), C = Se(B);
      i.forw.push(B), i.bakw.push(C), E.forw.push(B), E.bakw.push(C);
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
function fo(e, t, n) {
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
  uo as findIntersections,
  Fn as format_version,
  Wn as insertSearchIndex,
  Xn as vertexCalc
};
