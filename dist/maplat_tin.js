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
  if (!Ze(e[0]) || !Ze(e[1]))
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
function We(e, t, n = {}) {
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
function Ze(e) {
  return !isNaN(e) && e !== null && !Array.isArray(e);
}
function oi(e) {
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
function si(e) {
  return e.type === "Feature" ? e.geometry : e;
}
function Ge(e, t, n) {
  if (e !== null)
    for (var i, o, r, s, a, l, h, f = 0, c = 0, u, d = e.type, b = d === "FeatureCollection", w = d === "Feature", P = b ? e.features.length : 1, M = 0; M < P; M++) {
      h = b ? (
        // @ts-expect-error: Known type conflict
        e.features[M].geometry
      ) : w ? (
        // @ts-expect-error: Known type conflict
        e.geometry
      ) : e, u = h ? h.type === "GeometryCollection" : !1, a = u ? h.geometries.length : 1;
      for (var p = 0; p < a; p++) {
        var _ = 0, m = 0;
        if (s = u ? h.geometries[p] : h, s !== null) {
          l = s.coordinates;
          var v = s.type;
          switch (f = n && (v === "Polygon" || v === "MultiPolygon") ? 1 : 0, v) {
            case null:
              break;
            case "Point":
              if (
                // @ts-expect-error: Known type conflict
                t(
                  l,
                  c,
                  M,
                  _,
                  m
                ) === !1
              )
                return !1;
              c++, _++;
              break;
            case "LineString":
            case "MultiPoint":
              for (i = 0; i < l.length; i++) {
                if (
                  // @ts-expect-error: Known type conflict
                  t(
                    l[i],
                    c,
                    M,
                    _,
                    m
                  ) === !1
                )
                  return !1;
                c++, v === "MultiPoint" && _++;
              }
              v === "LineString" && _++;
              break;
            case "Polygon":
            case "MultiLineString":
              for (i = 0; i < l.length; i++) {
                for (o = 0; o < l[i].length - f; o++) {
                  if (
                    // @ts-expect-error: Known type conflict
                    t(
                      l[i][o],
                      c,
                      M,
                      _,
                      m
                    ) === !1
                  )
                    return !1;
                  c++;
                }
                v === "MultiLineString" && _++, v === "Polygon" && m++;
              }
              v === "Polygon" && _++;
              break;
            case "MultiPolygon":
              for (i = 0; i < l.length; i++) {
                for (m = 0, o = 0; o < l[i].length; o++) {
                  for (r = 0; r < l[i][o].length - f; r++) {
                    if (
                      // @ts-expect-error: Known type conflict
                      t(
                        l[i][o][r],
                        c,
                        M,
                        _,
                        m
                      ) === !1
                    )
                      return !1;
                    c++;
                  }
                  m++;
                }
                _++;
              }
              break;
            case "GeometryCollection":
              for (i = 0; i < s.geometries.length; i++)
                if (
                  // @ts-expect-error: Known type conflict
                  Ge(s.geometries[i], t, n) === !1
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
const pt = 11102230246251565e-32, q = 134217729, Ln = (3 + 8 * pt) * pt;
function ft(e, t, n, i, o) {
  let r, s, a, l, h = t[0], f = i[0], c = 0, u = 0;
  f > h == f > -h ? (r = h, h = t[++c]) : (r = f, f = i[++u]);
  let d = 0;
  if (c < e && u < n)
    for (f > h == f > -h ? (s = h + r, a = r - (s - h), h = t[++c]) : (s = f + r, a = r - (s - f), f = i[++u]), r = s, a !== 0 && (o[d++] = a); c < e && u < n; )
      f > h == f > -h ? (s = r + h, l = s - r, a = r - (s - l) + (h - l), h = t[++c]) : (s = r + f, l = s - r, a = r - (s - l) + (f - l), f = i[++u]), r = s, a !== 0 && (o[d++] = a);
  for (; c < e; )
    s = r + h, l = s - r, a = r - (s - l) + (h - l), h = t[++c], r = s, a !== 0 && (o[d++] = a);
  for (; u < n; )
    s = r + f, l = s - r, a = r - (s - l) + (f - l), f = i[++u], r = s, a !== 0 && (o[d++] = a);
  return (r !== 0 || d === 0) && (o[d++] = r), d;
}
function _t(e, t, n, i, o, r, s, a) {
  return ft(ft(e, t, n, i, s), s, o, r, a);
}
function R(e, t, n, i) {
  let o, r, s, a, l, h, f, c, u, d, b;
  f = q * n, d = f - (f - n), b = n - d;
  let w = t[0];
  o = w * n, f = q * w, c = f - (f - w), u = w - c, s = u * b - (o - c * d - u * d - c * b);
  let P = 0;
  s !== 0 && (i[P++] = s);
  for (let M = 1; M < e; M++)
    w = t[M], a = w * n, f = q * w, c = f - (f - w), u = w - c, l = u * b - (a - c * d - u * d - c * b), r = o + l, h = r - o, s = o - (r - h) + (l - h), s !== 0 && (i[P++] = s), o = a + r, s = r - (o - a), s !== 0 && (i[P++] = s);
  return (o !== 0 || P === 0) && (i[P++] = o), P;
}
function Vn(e, t) {
  let n = t[0];
  for (let i = 1; i < e; i++) n += t[i];
  return n;
}
function tt(e) {
  return new Float64Array(e);
}
const ai = (3 + 16 * pt) * pt, ci = (2 + 12 * pt) * pt, li = (9 + 64 * pt) * pt * pt, zt = tt(4), tn = tt(8), en = tt(12), nn = tt(16), mt = tt(4);
function hi(e, t, n, i, o, r, s) {
  let a, l, h, f, c, u, d, b, w, P, M, p, _, m, v, g, E, S;
  const k = e - o, O = n - o, N = t - r, X = i - r;
  m = k * X, u = q * k, d = u - (u - k), b = k - d, u = q * X, w = u - (u - X), P = X - w, v = b * P - (m - d * w - b * w - d * P), g = N * O, u = q * N, d = u - (u - N), b = N - d, u = q * O, w = u - (u - O), P = O - w, E = b * P - (g - d * w - b * w - d * P), M = v - E, c = v - M, zt[0] = v - (M + c) + (c - E), p = m + M, c = p - m, _ = m - (p - c) + (M - c), M = _ - g, c = _ - M, zt[1] = _ - (M + c) + (c - g), S = p + M, c = S - p, zt[2] = p - (S - c) + (M - c), zt[3] = S;
  let F = Vn(4, zt), y = ci * s;
  if (F >= y || -F >= y || (c = e - k, a = e - (k + c) + (c - o), c = n - O, h = n - (O + c) + (c - o), c = t - N, l = t - (N + c) + (c - r), c = i - X, f = i - (X + c) + (c - r), a === 0 && l === 0 && h === 0 && f === 0) || (y = li * s + Ln * Math.abs(F), F += k * f + X * a - (N * h + O * l), F >= y || -F >= y)) return F;
  m = a * X, u = q * a, d = u - (u - a), b = a - d, u = q * X, w = u - (u - X), P = X - w, v = b * P - (m - d * w - b * w - d * P), g = l * O, u = q * l, d = u - (u - l), b = l - d, u = q * O, w = u - (u - O), P = O - w, E = b * P - (g - d * w - b * w - d * P), M = v - E, c = v - M, mt[0] = v - (M + c) + (c - E), p = m + M, c = p - m, _ = m - (p - c) + (M - c), M = _ - g, c = _ - M, mt[1] = _ - (M + c) + (c - g), S = p + M, c = S - p, mt[2] = p - (S - c) + (M - c), mt[3] = S;
  const I = ft(4, zt, 4, mt, tn);
  m = k * f, u = q * k, d = u - (u - k), b = k - d, u = q * f, w = u - (u - f), P = f - w, v = b * P - (m - d * w - b * w - d * P), g = N * h, u = q * N, d = u - (u - N), b = N - d, u = q * h, w = u - (u - h), P = h - w, E = b * P - (g - d * w - b * w - d * P), M = v - E, c = v - M, mt[0] = v - (M + c) + (c - E), p = m + M, c = p - m, _ = m - (p - c) + (M - c), M = _ - g, c = _ - M, mt[1] = _ - (M + c) + (c - g), S = p + M, c = S - p, mt[2] = p - (S - c) + (M - c), mt[3] = S;
  const A = ft(I, tn, 4, mt, en);
  m = a * f, u = q * a, d = u - (u - a), b = a - d, u = q * f, w = u - (u - f), P = f - w, v = b * P - (m - d * w - b * w - d * P), g = l * h, u = q * l, d = u - (u - l), b = l - d, u = q * h, w = u - (u - h), P = h - w, E = b * P - (g - d * w - b * w - d * P), M = v - E, c = v - M, mt[0] = v - (M + c) + (c - E), p = m + M, c = p - m, _ = m - (p - c) + (M - c), M = _ - g, c = _ - M, mt[1] = _ - (M + c) + (c - g), S = p + M, c = S - p, mt[2] = p - (S - c) + (M - c), mt[3] = S;
  const T = ft(A, en, 4, mt, nn);
  return nn[T - 1];
}
function Pt(e, t, n, i, o, r) {
  const s = (t - r) * (n - o), a = (e - o) * (i - r), l = s - a, h = Math.abs(s + a);
  return Math.abs(l) >= ai * h ? l : -hi(e, t, n, i, o, r, h);
}
const fi = (10 + 96 * pt) * pt, ui = (4 + 48 * pt) * pt, di = (44 + 576 * pt) * pt * pt, Ct = tt(4), Dt = tt(4), $t = tt(4), Et = tt(4), kt = tt(4), At = tt(4), gt = tt(4), wt = tt(4), Oe = tt(8), Ne = tt(8), Be = tt(8), Te = tt(8), Xe = tt(8), Ce = tt(8), ue = tt(8), de = tt(8), pe = tt(8), Lt = tt(4), Vt = tt(4), jt = tt(4), z = tt(8), K = tt(16), nt = tt(16), it = tt(16), et = tt(32), Ft = tt(32), at = tt(48), bt = tt(64);
let Qt = tt(1152), De = tt(1152);
function ct(e, t, n) {
  e = ft(e, Qt, t, n, De);
  const i = Qt;
  return Qt = De, De = i, e;
}
function pi(e, t, n, i, o, r, s, a, l) {
  let h, f, c, u, d, b, w, P, M, p, _, m, v, g, E, S, k, O, N, X, F, y, I, A, T, C, $, x, B, D, Y, L, V, U, j;
  const J = e - s, G = n - s, Q = o - s, H = t - a, Z = i - a, W = r - a;
  Y = G * W, I = q * G, A = I - (I - G), T = G - A, I = q * W, C = I - (I - W), $ = W - C, L = T * $ - (Y - A * C - T * C - A * $), V = Q * Z, I = q * Q, A = I - (I - Q), T = Q - A, I = q * Z, C = I - (I - Z), $ = Z - C, U = T * $ - (V - A * C - T * C - A * $), x = L - U, y = L - x, Ct[0] = L - (x + y) + (y - U), B = Y + x, y = B - Y, D = Y - (B - y) + (x - y), x = D - V, y = D - x, Ct[1] = D - (x + y) + (y - V), j = B + x, y = j - B, Ct[2] = B - (j - y) + (x - y), Ct[3] = j, Y = Q * H, I = q * Q, A = I - (I - Q), T = Q - A, I = q * H, C = I - (I - H), $ = H - C, L = T * $ - (Y - A * C - T * C - A * $), V = J * W, I = q * J, A = I - (I - J), T = J - A, I = q * W, C = I - (I - W), $ = W - C, U = T * $ - (V - A * C - T * C - A * $), x = L - U, y = L - x, Dt[0] = L - (x + y) + (y - U), B = Y + x, y = B - Y, D = Y - (B - y) + (x - y), x = D - V, y = D - x, Dt[1] = D - (x + y) + (y - V), j = B + x, y = j - B, Dt[2] = B - (j - y) + (x - y), Dt[3] = j, Y = J * Z, I = q * J, A = I - (I - J), T = J - A, I = q * Z, C = I - (I - Z), $ = Z - C, L = T * $ - (Y - A * C - T * C - A * $), V = G * H, I = q * G, A = I - (I - G), T = G - A, I = q * H, C = I - (I - H), $ = H - C, U = T * $ - (V - A * C - T * C - A * $), x = L - U, y = L - x, $t[0] = L - (x + y) + (y - U), B = Y + x, y = B - Y, D = Y - (B - y) + (x - y), x = D - V, y = D - x, $t[1] = D - (x + y) + (y - V), j = B + x, y = j - B, $t[2] = B - (j - y) + (x - y), $t[3] = j, h = ft(
    ft(
      ft(
        R(R(4, Ct, J, z), z, J, K),
        K,
        R(R(4, Ct, H, z), z, H, nt),
        nt,
        et
      ),
      et,
      ft(
        R(R(4, Dt, G, z), z, G, K),
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
  let st = Vn(h, Qt), ht = ui * l;
  if (st >= ht || -st >= ht || (y = e - J, f = e - (J + y) + (y - s), y = t - H, d = t - (H + y) + (y - a), y = n - G, c = n - (G + y) + (y - s), y = i - Z, b = i - (Z + y) + (y - a), y = o - Q, u = o - (Q + y) + (y - s), y = r - W, w = r - (W + y) + (y - a), f === 0 && c === 0 && u === 0 && d === 0 && b === 0 && w === 0) || (ht = di * l + Ln * Math.abs(st), st += (J * J + H * H) * (G * w + W * c - (Z * u + Q * b)) + 2 * (J * f + H * d) * (G * W - Z * Q) + ((G * G + Z * Z) * (Q * d + H * u - (W * f + J * w)) + 2 * (G * c + Z * b) * (Q * H - W * J)) + ((Q * Q + W * W) * (J * b + Z * f - (H * c + G * d)) + 2 * (Q * u + W * w) * (J * Z - H * G)), st >= ht || -st >= ht))
    return st;
  if ((c !== 0 || b !== 0 || u !== 0 || w !== 0) && (Y = J * J, I = q * J, A = I - (I - J), T = J - A, L = T * T - (Y - A * A - (A + A) * T), V = H * H, I = q * H, A = I - (I - H), T = H - A, U = T * T - (V - A * A - (A + A) * T), x = L + U, y = x - L, Et[0] = L - (x - y) + (U - y), B = Y + x, y = B - Y, D = Y - (B - y) + (x - y), x = D + V, y = x - D, Et[1] = D - (x - y) + (V - y), j = B + x, y = j - B, Et[2] = B - (j - y) + (x - y), Et[3] = j), (u !== 0 || w !== 0 || f !== 0 || d !== 0) && (Y = G * G, I = q * G, A = I - (I - G), T = G - A, L = T * T - (Y - A * A - (A + A) * T), V = Z * Z, I = q * Z, A = I - (I - Z), T = Z - A, U = T * T - (V - A * A - (A + A) * T), x = L + U, y = x - L, kt[0] = L - (x - y) + (U - y), B = Y + x, y = B - Y, D = Y - (B - y) + (x - y), x = D + V, y = x - D, kt[1] = D - (x - y) + (V - y), j = B + x, y = j - B, kt[2] = B - (j - y) + (x - y), kt[3] = j), (f !== 0 || d !== 0 || c !== 0 || b !== 0) && (Y = Q * Q, I = q * Q, A = I - (I - Q), T = Q - A, L = T * T - (Y - A * A - (A + A) * T), V = W * W, I = q * W, A = I - (I - W), T = W - A, U = T * T - (V - A * A - (A + A) * T), x = L + U, y = x - L, At[0] = L - (x - y) + (U - y), B = Y + x, y = B - Y, D = Y - (B - y) + (x - y), x = D + V, y = x - D, At[1] = D - (x - y) + (V - y), j = B + x, y = j - B, At[2] = B - (j - y) + (x - y), At[3] = j), f !== 0 && (P = R(4, Ct, f, Oe), h = ct(h, _t(
    R(P, Oe, 2 * J, K),
    K,
    R(R(4, At, f, z), z, Z, nt),
    nt,
    R(R(4, kt, f, z), z, -W, it),
    it,
    et,
    at
  ), at)), d !== 0 && (M = R(4, Ct, d, Ne), h = ct(h, _t(
    R(M, Ne, 2 * H, K),
    K,
    R(R(4, kt, d, z), z, Q, nt),
    nt,
    R(R(4, At, d, z), z, -G, it),
    it,
    et,
    at
  ), at)), c !== 0 && (p = R(4, Dt, c, Be), h = ct(h, _t(
    R(p, Be, 2 * G, K),
    K,
    R(R(4, Et, c, z), z, W, nt),
    nt,
    R(R(4, At, c, z), z, -H, it),
    it,
    et,
    at
  ), at)), b !== 0 && (_ = R(4, Dt, b, Te), h = ct(h, _t(
    R(_, Te, 2 * Z, K),
    K,
    R(R(4, At, b, z), z, J, nt),
    nt,
    R(R(4, Et, b, z), z, -Q, it),
    it,
    et,
    at
  ), at)), u !== 0 && (m = R(4, $t, u, Xe), h = ct(h, _t(
    R(m, Xe, 2 * Q, K),
    K,
    R(R(4, kt, u, z), z, H, nt),
    nt,
    R(R(4, Et, u, z), z, -Z, it),
    it,
    et,
    at
  ), at)), w !== 0 && (v = R(4, $t, w, Ce), h = ct(h, _t(
    R(v, Ce, 2 * W, K),
    K,
    R(R(4, Et, w, z), z, G, nt),
    nt,
    R(R(4, kt, w, z), z, -J, it),
    it,
    et,
    at
  ), at)), f !== 0 || d !== 0) {
    if (c !== 0 || b !== 0 || u !== 0 || w !== 0 ? (Y = c * W, I = q * c, A = I - (I - c), T = c - A, I = q * W, C = I - (I - W), $ = W - C, L = T * $ - (Y - A * C - T * C - A * $), V = G * w, I = q * G, A = I - (I - G), T = G - A, I = q * w, C = I - (I - w), $ = w - C, U = T * $ - (V - A * C - T * C - A * $), x = L + U, y = x - L, gt[0] = L - (x - y) + (U - y), B = Y + x, y = B - Y, D = Y - (B - y) + (x - y), x = D + V, y = x - D, gt[1] = D - (x - y) + (V - y), j = B + x, y = j - B, gt[2] = B - (j - y) + (x - y), gt[3] = j, Y = u * -Z, I = q * u, A = I - (I - u), T = u - A, I = q * -Z, C = I - (I - -Z), $ = -Z - C, L = T * $ - (Y - A * C - T * C - A * $), V = Q * -b, I = q * Q, A = I - (I - Q), T = Q - A, I = q * -b, C = I - (I - -b), $ = -b - C, U = T * $ - (V - A * C - T * C - A * $), x = L + U, y = x - L, wt[0] = L - (x - y) + (U - y), B = Y + x, y = B - Y, D = Y - (B - y) + (x - y), x = D + V, y = x - D, wt[1] = D - (x - y) + (V - y), j = B + x, y = j - B, wt[2] = B - (j - y) + (x - y), wt[3] = j, E = ft(4, gt, 4, wt, de), Y = c * w, I = q * c, A = I - (I - c), T = c - A, I = q * w, C = I - (I - w), $ = w - C, L = T * $ - (Y - A * C - T * C - A * $), V = u * b, I = q * u, A = I - (I - u), T = u - A, I = q * b, C = I - (I - b), $ = b - C, U = T * $ - (V - A * C - T * C - A * $), x = L - U, y = L - x, Vt[0] = L - (x + y) + (y - U), B = Y + x, y = B - Y, D = Y - (B - y) + (x - y), x = D - V, y = D - x, Vt[1] = D - (x + y) + (y - V), j = B + x, y = j - B, Vt[2] = B - (j - y) + (x - y), Vt[3] = j, O = 4) : (de[0] = 0, E = 1, Vt[0] = 0, O = 1), f !== 0) {
      const rt = R(E, de, f, it);
      h = ct(h, ft(
        R(P, Oe, f, K),
        K,
        R(rt, it, 2 * J, et),
        et,
        at
      ), at);
      const ot = R(O, Vt, f, z);
      h = ct(h, _t(
        R(ot, z, 2 * J, K),
        K,
        R(ot, z, f, nt),
        nt,
        R(rt, it, f, et),
        et,
        Ft,
        bt
      ), bt), b !== 0 && (h = ct(h, R(R(4, At, f, z), z, b, K), K)), w !== 0 && (h = ct(h, R(R(4, kt, -f, z), z, w, K), K));
    }
    if (d !== 0) {
      const rt = R(E, de, d, it);
      h = ct(h, ft(
        R(M, Ne, d, K),
        K,
        R(rt, it, 2 * H, et),
        et,
        at
      ), at);
      const ot = R(O, Vt, d, z);
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
  if (c !== 0 || b !== 0) {
    if (u !== 0 || w !== 0 || f !== 0 || d !== 0 ? (Y = u * H, I = q * u, A = I - (I - u), T = u - A, I = q * H, C = I - (I - H), $ = H - C, L = T * $ - (Y - A * C - T * C - A * $), V = Q * d, I = q * Q, A = I - (I - Q), T = Q - A, I = q * d, C = I - (I - d), $ = d - C, U = T * $ - (V - A * C - T * C - A * $), x = L + U, y = x - L, gt[0] = L - (x - y) + (U - y), B = Y + x, y = B - Y, D = Y - (B - y) + (x - y), x = D + V, y = x - D, gt[1] = D - (x - y) + (V - y), j = B + x, y = j - B, gt[2] = B - (j - y) + (x - y), gt[3] = j, X = -W, F = -w, Y = f * X, I = q * f, A = I - (I - f), T = f - A, I = q * X, C = I - (I - X), $ = X - C, L = T * $ - (Y - A * C - T * C - A * $), V = J * F, I = q * J, A = I - (I - J), T = J - A, I = q * F, C = I - (I - F), $ = F - C, U = T * $ - (V - A * C - T * C - A * $), x = L + U, y = x - L, wt[0] = L - (x - y) + (U - y), B = Y + x, y = B - Y, D = Y - (B - y) + (x - y), x = D + V, y = x - D, wt[1] = D - (x - y) + (V - y), j = B + x, y = j - B, wt[2] = B - (j - y) + (x - y), wt[3] = j, S = ft(4, gt, 4, wt, pe), Y = u * d, I = q * u, A = I - (I - u), T = u - A, I = q * d, C = I - (I - d), $ = d - C, L = T * $ - (Y - A * C - T * C - A * $), V = f * w, I = q * f, A = I - (I - f), T = f - A, I = q * w, C = I - (I - w), $ = w - C, U = T * $ - (V - A * C - T * C - A * $), x = L - U, y = L - x, jt[0] = L - (x + y) + (y - U), B = Y + x, y = B - Y, D = Y - (B - y) + (x - y), x = D - V, y = D - x, jt[1] = D - (x + y) + (y - V), j = B + x, y = j - B, jt[2] = B - (j - y) + (x - y), jt[3] = j, N = 4) : (pe[0] = 0, S = 1, jt[0] = 0, N = 1), c !== 0) {
      const rt = R(S, pe, c, it);
      h = ct(h, ft(
        R(p, Be, c, K),
        K,
        R(rt, it, 2 * G, et),
        et,
        at
      ), at);
      const ot = R(N, jt, c, z);
      h = ct(h, _t(
        R(ot, z, 2 * G, K),
        K,
        R(ot, z, c, nt),
        nt,
        R(rt, it, c, et),
        et,
        Ft,
        bt
      ), bt), w !== 0 && (h = ct(h, R(R(4, Et, c, z), z, w, K), K)), d !== 0 && (h = ct(h, R(R(4, At, -c, z), z, d, K), K));
    }
    if (b !== 0) {
      const rt = R(S, pe, b, it);
      h = ct(h, ft(
        R(_, Te, b, K),
        K,
        R(rt, it, 2 * Z, et),
        et,
        at
      ), at);
      const ot = R(N, jt, b, z);
      h = ct(h, _t(
        R(ot, z, 2 * Z, K),
        K,
        R(ot, z, b, nt),
        nt,
        R(rt, it, b, et),
        et,
        Ft,
        bt
      ), bt);
    }
  }
  if (u !== 0 || w !== 0) {
    if (f !== 0 || d !== 0 || c !== 0 || b !== 0 ? (Y = f * Z, I = q * f, A = I - (I - f), T = f - A, I = q * Z, C = I - (I - Z), $ = Z - C, L = T * $ - (Y - A * C - T * C - A * $), V = J * b, I = q * J, A = I - (I - J), T = J - A, I = q * b, C = I - (I - b), $ = b - C, U = T * $ - (V - A * C - T * C - A * $), x = L + U, y = x - L, gt[0] = L - (x - y) + (U - y), B = Y + x, y = B - Y, D = Y - (B - y) + (x - y), x = D + V, y = x - D, gt[1] = D - (x - y) + (V - y), j = B + x, y = j - B, gt[2] = B - (j - y) + (x - y), gt[3] = j, X = -H, F = -d, Y = c * X, I = q * c, A = I - (I - c), T = c - A, I = q * X, C = I - (I - X), $ = X - C, L = T * $ - (Y - A * C - T * C - A * $), V = G * F, I = q * G, A = I - (I - G), T = G - A, I = q * F, C = I - (I - F), $ = F - C, U = T * $ - (V - A * C - T * C - A * $), x = L + U, y = x - L, wt[0] = L - (x - y) + (U - y), B = Y + x, y = B - Y, D = Y - (B - y) + (x - y), x = D + V, y = x - D, wt[1] = D - (x - y) + (V - y), j = B + x, y = j - B, wt[2] = B - (j - y) + (x - y), wt[3] = j, g = ft(4, gt, 4, wt, ue), Y = f * b, I = q * f, A = I - (I - f), T = f - A, I = q * b, C = I - (I - b), $ = b - C, L = T * $ - (Y - A * C - T * C - A * $), V = c * d, I = q * c, A = I - (I - c), T = c - A, I = q * d, C = I - (I - d), $ = d - C, U = T * $ - (V - A * C - T * C - A * $), x = L - U, y = L - x, Lt[0] = L - (x + y) + (y - U), B = Y + x, y = B - Y, D = Y - (B - y) + (x - y), x = D - V, y = D - x, Lt[1] = D - (x + y) + (y - V), j = B + x, y = j - B, Lt[2] = B - (j - y) + (x - y), Lt[3] = j, k = 4) : (ue[0] = 0, g = 1, Lt[0] = 0, k = 1), u !== 0) {
      const rt = R(g, ue, u, it);
      h = ct(h, ft(
        R(m, Xe, u, K),
        K,
        R(rt, it, 2 * Q, et),
        et,
        at
      ), at);
      const ot = R(k, Lt, u, z);
      h = ct(h, _t(
        R(ot, z, 2 * Q, K),
        K,
        R(ot, z, u, nt),
        nt,
        R(rt, it, u, et),
        et,
        Ft,
        bt
      ), bt), d !== 0 && (h = ct(h, R(R(4, kt, u, z), z, d, K), K)), b !== 0 && (h = ct(h, R(R(4, Et, -u, z), z, b, K), K));
    }
    if (w !== 0) {
      const rt = R(g, ue, w, it);
      h = ct(h, ft(
        R(v, Ce, w, K),
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
function mi(e, t, n, i, o, r, s, a) {
  const l = e - s, h = n - s, f = o - s, c = t - a, u = i - a, d = r - a, b = h * d, w = f * u, P = l * l + c * c, M = f * c, p = l * d, _ = h * h + u * u, m = l * u, v = h * c, g = f * f + d * d, E = P * (b - w) + _ * (M - p) + g * (m - v), S = (Math.abs(b) + Math.abs(w)) * P + (Math.abs(M) + Math.abs(p)) * _ + (Math.abs(m) + Math.abs(v)) * g, k = fi * S;
  return E > k || -E > k ? E : pi(e, t, n, i, o, r, s, a, S);
}
function gi(e, t) {
  var n, i, o = 0, r, s, a, l, h, f, c, u = e[0], d = e[1], b = t.length;
  for (n = 0; n < b; n++) {
    i = 0;
    var w = t[n], P = w.length - 1;
    if (f = w[0], f[0] !== w[P][0] && f[1] !== w[P][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (s = f[0] - u, a = f[1] - d, i; i < P; i++) {
      if (c = w[i + 1], l = c[0] - u, h = c[1] - d, a === 0 && h === 0) {
        if (l <= 0 && s >= 0 || s <= 0 && l >= 0)
          return 0;
      } else if (h >= 0 && a <= 0 || h <= 0 && a >= 0) {
        if (r = Pt(s, l, a, h, 0, 0), r === 0)
          return 0;
        (r > 0 && h > 0 && a <= 0 || r < 0 && h <= 0 && a > 0) && o++;
      }
      f = c, a = h, s = l;
    }
  }
  return o % 2 !== 0;
}
function $e(e, t, n = {}) {
  if (!e)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const i = oi(e), o = si(t), r = o.type, s = t.bbox;
  let a = o.coordinates;
  if (s && wi(i, s) === !1)
    return !1;
  r === "Polygon" && (a = [a]);
  for (var l = 0; l < a.length; ++l) {
    const h = gi(i, a[l]);
    if (h === 0 && !n.ignoreBoundary) return !0;
    if (h) return !0;
  }
  return !1;
}
function wi(e, t) {
  return t[0] <= e[0] && t[1] <= e[1] && t[2] >= e[0] && t[3] >= e[1];
}
class Je {
  constructor(t = [], n = yi) {
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
function yi(e, t) {
  return e < t ? -1 : e > t ? 1 : 0;
}
const vi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Je
}, Symbol.toStringTag, { value: "Module" })), Bt = 11102230246251565e-32, ut = 134217729, bi = (3 + 8 * Bt) * Bt;
function Fe(e, t, n, i, o) {
  let r, s, a, l, h = t[0], f = i[0], c = 0, u = 0;
  f > h == f > -h ? (r = h, h = t[++c]) : (r = f, f = i[++u]);
  let d = 0;
  if (c < e && u < n)
    for (f > h == f > -h ? (s = h + r, a = r - (s - h), h = t[++c]) : (s = f + r, a = r - (s - f), f = i[++u]), r = s, a !== 0 && (o[d++] = a); c < e && u < n; )
      f > h == f > -h ? (s = r + h, l = s - r, a = r - (s - l) + (h - l), h = t[++c]) : (s = r + f, l = s - r, a = r - (s - l) + (f - l), f = i[++u]), r = s, a !== 0 && (o[d++] = a);
  for (; c < e; )
    s = r + h, l = s - r, a = r - (s - l) + (h - l), h = t[++c], r = s, a !== 0 && (o[d++] = a);
  for (; u < n; )
    s = r + f, l = s - r, a = r - (s - l) + (f - l), f = i[++u], r = s, a !== 0 && (o[d++] = a);
  return (r !== 0 || d === 0) && (o[d++] = r), d;
}
function xi(e, t) {
  let n = t[0];
  for (let i = 1; i < e; i++) n += t[i];
  return n;
}
function he(e) {
  return new Float64Array(e);
}
const _i = (3 + 16 * Bt) * Bt, Mi = (2 + 12 * Bt) * Bt, Si = (9 + 64 * Bt) * Bt * Bt, Gt = he(4), rn = he(8), on = he(12), sn = he(16), yt = he(4);
function Ei(e, t, n, i, o, r, s) {
  let a, l, h, f, c, u, d, b, w, P, M, p, _, m, v, g, E, S;
  const k = e - o, O = n - o, N = t - r, X = i - r;
  m = k * X, u = ut * k, d = u - (u - k), b = k - d, u = ut * X, w = u - (u - X), P = X - w, v = b * P - (m - d * w - b * w - d * P), g = N * O, u = ut * N, d = u - (u - N), b = N - d, u = ut * O, w = u - (u - O), P = O - w, E = b * P - (g - d * w - b * w - d * P), M = v - E, c = v - M, Gt[0] = v - (M + c) + (c - E), p = m + M, c = p - m, _ = m - (p - c) + (M - c), M = _ - g, c = _ - M, Gt[1] = _ - (M + c) + (c - g), S = p + M, c = S - p, Gt[2] = p - (S - c) + (M - c), Gt[3] = S;
  let F = xi(4, Gt), y = Mi * s;
  if (F >= y || -F >= y || (c = e - k, a = e - (k + c) + (c - o), c = n - O, h = n - (O + c) + (c - o), c = t - N, l = t - (N + c) + (c - r), c = i - X, f = i - (X + c) + (c - r), a === 0 && l === 0 && h === 0 && f === 0) || (y = Si * s + bi * Math.abs(F), F += k * f + X * a - (N * h + O * l), F >= y || -F >= y)) return F;
  m = a * X, u = ut * a, d = u - (u - a), b = a - d, u = ut * X, w = u - (u - X), P = X - w, v = b * P - (m - d * w - b * w - d * P), g = l * O, u = ut * l, d = u - (u - l), b = l - d, u = ut * O, w = u - (u - O), P = O - w, E = b * P - (g - d * w - b * w - d * P), M = v - E, c = v - M, yt[0] = v - (M + c) + (c - E), p = m + M, c = p - m, _ = m - (p - c) + (M - c), M = _ - g, c = _ - M, yt[1] = _ - (M + c) + (c - g), S = p + M, c = S - p, yt[2] = p - (S - c) + (M - c), yt[3] = S;
  const I = Fe(4, Gt, 4, yt, rn);
  m = k * f, u = ut * k, d = u - (u - k), b = k - d, u = ut * f, w = u - (u - f), P = f - w, v = b * P - (m - d * w - b * w - d * P), g = N * h, u = ut * N, d = u - (u - N), b = N - d, u = ut * h, w = u - (u - h), P = h - w, E = b * P - (g - d * w - b * w - d * P), M = v - E, c = v - M, yt[0] = v - (M + c) + (c - E), p = m + M, c = p - m, _ = m - (p - c) + (M - c), M = _ - g, c = _ - M, yt[1] = _ - (M + c) + (c - g), S = p + M, c = S - p, yt[2] = p - (S - c) + (M - c), yt[3] = S;
  const A = Fe(I, rn, 4, yt, on);
  m = a * f, u = ut * a, d = u - (u - a), b = a - d, u = ut * f, w = u - (u - f), P = f - w, v = b * P - (m - d * w - b * w - d * P), g = l * h, u = ut * l, d = u - (u - l), b = l - d, u = ut * h, w = u - (u - h), P = h - w, E = b * P - (g - d * w - b * w - d * P), M = v - E, c = v - M, yt[0] = v - (M + c) + (c - E), p = m + M, c = p - m, _ = m - (p - c) + (M - c), M = _ - g, c = _ - M, yt[1] = _ - (M + c) + (c - g), S = p + M, c = S - p, yt[2] = p - (S - c) + (M - c), yt[3] = S;
  const T = Fe(A, on, 4, yt, sn);
  return sn[T - 1];
}
function an(e, t, n, i, o, r) {
  const s = (t - r) * (n - o), a = (e - o) * (i - r), l = s - a;
  if (s === 0 || a === 0 || s > 0 != a > 0) return l;
  const h = Math.abs(s + a);
  return Math.abs(l) >= _i * h ? l : -Ei(e, t, n, i, o, r, h);
}
function ki(e, t) {
  const n = new Je([], jn);
  return Ii(e, n), Pi(n, t);
}
function jn(e, t) {
  return e.p.x > t.p.x ? 1 : e.p.x < t.p.x || e.p.x === t.p.x && (e.featureId !== t.featureId || e.ringId !== t.ringId) && e.isLeftEndpoint && !t.isLeftEndpoint ? -1 : e.p.y !== t.p.y ? e.p.y > t.p.y ? 1 : -1 : 1;
}
function Ai(e, t) {
  return e.rightSweepEvent.p.x > t.rightSweepEvent.p.x ? 1 : e.rightSweepEvent.p.x < t.rightSweepEvent.p.x ? -1 : e.rightSweepEvent.p.y !== t.rightSweepEvent.p.y ? e.rightSweepEvent.p.y < t.rightSweepEvent.p.y ? 1 : -1 : 1;
}
function Ii(e, t) {
  if (e.type === "FeatureCollection") {
    const n = e.features;
    for (let i = 0; i < n.length; i++)
      cn(n[i], t);
  } else
    cn(e, t);
}
var me = 0, ge = 0, we = 0;
function cn(e, t) {
  const n = e.type === "Feature" ? e.geometry : e;
  let i = n.coordinates;
  (n.type === "Polygon" || n.type === "MultiLineString") && (i = [i]), n.type === "LineString" && (i = [[i]]);
  for (let o = 0; o < i.length; o++)
    for (let r = 0; r < i[o].length; r++) {
      let s = i[o][r][0], a = null;
      ge = ge + 1;
      for (let l = 0; l < i[o][r].length - 1; l++) {
        a = i[o][r][l + 1];
        const h = new ln(s, me, ge, we), f = new ln(a, me, ge, we + 1);
        h.otherEvent = f, f.otherEvent = h, jn(h, f) > 0 ? (f.isLeftEndpoint = !0, h.isLeftEndpoint = !1) : (h.isLeftEndpoint = !0, f.isLeftEndpoint = !1), t.push(h), t.push(f), s = a, we = we + 1;
      }
    }
  me = me + 1;
}
var ln = class {
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
function Pi(e, t = !1) {
  const n = [], i = new Je([], Ai);
  for (; e.length; ) {
    const o = e.pop();
    if (o.isLeftEndpoint) {
      const r = new Oi(o);
      for (let s = 0; s < i.data.length; s++) {
        const a = i.data[s];
        if (t && a.leftSweepEvent.featureId === o.featureId)
          continue;
        const l = Ni(r, a);
        l !== !1 && n.push(l);
      }
      i.push(r);
    } else o.isLeftEndpoint === !1 && i.pop();
  }
  return n;
}
var Oi = class {
  /** @param event must have otherEvent non-null */
  constructor(e) {
    this.leftSweepEvent = e, this.rightSweepEvent = e.otherEvent;
  }
};
function Ni(e, t) {
  if (e === null || t === null) return !1;
  const n = e.leftSweepEvent.p.x, i = e.leftSweepEvent.p.y, o = e.rightSweepEvent.p.x, r = e.rightSweepEvent.p.y, s = t.leftSweepEvent.p.x, a = t.leftSweepEvent.p.y, l = t.rightSweepEvent.p.x, h = t.rightSweepEvent.p.y, f = an(n, i, o, r, s, a), c = an(n, i, o, r, l, h);
  if (f > 0 && c > 0) return !1;
  if (f < 0 && c < 0) return !1;
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
  const u = (h - a) * (o - n) - (l - s) * (r - i), d = (l - s) * (i - a) - (h - a) * (n - s), b = (o - n) * (i - a) - (r - i) * (n - s);
  if (u === 0)
    return !1;
  const w = d / u, P = b / u;
  if (w >= 0 && w <= 1 && P >= 0 && P <= 1) {
    const M = n + w * (o - n), p = i + w * (r - i);
    return [M, p];
  }
  return !1;
}
function Bi(e, t, n = {}) {
  const { removeDuplicates: i = !0, ignoreSelfIntersections: o = !0 } = n;
  let r = [];
  e.type === "FeatureCollection" ? r = r.concat(e.features) : e.type === "Feature" ? r.push(e) : (e.type === "LineString" || e.type === "Polygon" || e.type === "MultiLineString" || e.type === "MultiPolygon") && r.push(oe(e)), t.type === "FeatureCollection" ? r = r.concat(t.features) : t.type === "Feature" ? r.push(t) : (t.type === "LineString" || t.type === "Polygon" || t.type === "MultiLineString" || t.type === "MultiPolygon") && r.push(oe(t));
  const s = ki(
    St(r),
    o
  );
  let a = [];
  if (i) {
    const l = {};
    s.forEach((h) => {
      const f = h.join(",");
      l[f] || (l[f] = !0, a.push(h));
    });
  } else
    a = s;
  return St(a.map((l) => Rt(l)));
}
function Ti(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function Xi(e) {
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
function Ci(e, t = {}) {
  let n = 0, i = 0, o = 0;
  return Ge(
    e,
    function(r) {
      n += r[0], i += r[1], o++;
    },
    !0
  ), Rt([n / o, i / o], t.properties);
}
var ye = { exports: {} }, ke = { exports: {} }, Di = ke.exports, hn;
function $i() {
  return hn || (hn = 1, (function(e, t) {
    (function(n, i) {
      e.exports = i();
    })(Di, function() {
      function n(p, _, m, v, g) {
        (function E(S, k, O, N, X) {
          for (; N > O; ) {
            if (N - O > 600) {
              var F = N - O + 1, y = k - O + 1, I = Math.log(F), A = 0.5 * Math.exp(2 * I / 3), T = 0.5 * Math.sqrt(I * A * (F - A) / F) * (y - F / 2 < 0 ? -1 : 1), C = Math.max(O, Math.floor(k - y * A / F + T)), $ = Math.min(N, Math.floor(k + (F - y) * A / F + T));
              E(S, k, C, $, X);
            }
            var x = S[k], B = O, D = N;
            for (i(S, O, k), X(S[N], x) > 0 && i(S, O, N); B < D; ) {
              for (i(S, B, D), B++, D--; X(S[B], x) < 0; ) B++;
              for (; X(S[D], x) > 0; ) D--;
            }
            X(S[O], x) === 0 ? i(S, O, D) : i(S, ++D, N), D <= k && (O = D + 1), k <= D && (N = D - 1);
          }
        })(p, _, m || 0, v || p.length - 1, g || o);
      }
      function i(p, _, m) {
        var v = p[_];
        p[_] = p[m], p[m] = v;
      }
      function o(p, _) {
        return p < _ ? -1 : p > _ ? 1 : 0;
      }
      var r = function(p) {
        p === void 0 && (p = 9), this._maxEntries = Math.max(4, p), this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries)), this.clear();
      };
      function s(p, _, m) {
        if (!m) return _.indexOf(p);
        for (var v = 0; v < _.length; v++) if (m(p, _[v])) return v;
        return -1;
      }
      function a(p, _) {
        l(p, 0, p.children.length, _, p);
      }
      function l(p, _, m, v, g) {
        g || (g = P(null)), g.minX = 1 / 0, g.minY = 1 / 0, g.maxX = -1 / 0, g.maxY = -1 / 0;
        for (var E = _; E < m; E++) {
          var S = p.children[E];
          h(g, p.leaf ? v(S) : S);
        }
        return g;
      }
      function h(p, _) {
        return p.minX = Math.min(p.minX, _.minX), p.minY = Math.min(p.minY, _.minY), p.maxX = Math.max(p.maxX, _.maxX), p.maxY = Math.max(p.maxY, _.maxY), p;
      }
      function f(p, _) {
        return p.minX - _.minX;
      }
      function c(p, _) {
        return p.minY - _.minY;
      }
      function u(p) {
        return (p.maxX - p.minX) * (p.maxY - p.minY);
      }
      function d(p) {
        return p.maxX - p.minX + (p.maxY - p.minY);
      }
      function b(p, _) {
        return p.minX <= _.minX && p.minY <= _.minY && _.maxX <= p.maxX && _.maxY <= p.maxY;
      }
      function w(p, _) {
        return _.minX <= p.maxX && _.minY <= p.maxY && _.maxX >= p.minX && _.maxY >= p.minY;
      }
      function P(p) {
        return { children: p, height: 1, leaf: !0, minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
      }
      function M(p, _, m, v, g) {
        for (var E = [_, m]; E.length; ) if (!((m = E.pop()) - (_ = E.pop()) <= v)) {
          var S = _ + Math.ceil((m - _) / v / 2) * v;
          n(p, S, _, m, g), E.push(_, S, S, m);
        }
      }
      return r.prototype.all = function() {
        return this._all(this.data, []);
      }, r.prototype.search = function(p) {
        var _ = this.data, m = [];
        if (!w(p, _)) return m;
        for (var v = this.toBBox, g = []; _; ) {
          for (var E = 0; E < _.children.length; E++) {
            var S = _.children[E], k = _.leaf ? v(S) : S;
            w(p, k) && (_.leaf ? m.push(S) : b(p, k) ? this._all(S, m) : g.push(S));
          }
          _ = g.pop();
        }
        return m;
      }, r.prototype.collides = function(p) {
        var _ = this.data;
        if (!w(p, _)) return !1;
        for (var m = []; _; ) {
          for (var v = 0; v < _.children.length; v++) {
            var g = _.children[v], E = _.leaf ? this.toBBox(g) : g;
            if (w(p, E)) {
              if (_.leaf || b(p, E)) return !0;
              m.push(g);
            }
          }
          _ = m.pop();
        }
        return !1;
      }, r.prototype.load = function(p) {
        if (!p || !p.length) return this;
        if (p.length < this._minEntries) {
          for (var _ = 0; _ < p.length; _++) this.insert(p[_]);
          return this;
        }
        var m = this._build(p.slice(), 0, p.length - 1, 0);
        if (this.data.children.length) if (this.data.height === m.height) this._splitRoot(this.data, m);
        else {
          if (this.data.height < m.height) {
            var v = this.data;
            this.data = m, m = v;
          }
          this._insert(m, this.data.height - m.height - 1, !0);
        }
        else this.data = m;
        return this;
      }, r.prototype.insert = function(p) {
        return p && this._insert(p, this.data.height - 1), this;
      }, r.prototype.clear = function() {
        return this.data = P([]), this;
      }, r.prototype.remove = function(p, _) {
        if (!p) return this;
        for (var m, v, g, E = this.data, S = this.toBBox(p), k = [], O = []; E || k.length; ) {
          if (E || (E = k.pop(), v = k[k.length - 1], m = O.pop(), g = !0), E.leaf) {
            var N = s(p, E.children, _);
            if (N !== -1) return E.children.splice(N, 1), k.push(E), this._condense(k), this;
          }
          g || E.leaf || !b(E, S) ? v ? (m++, E = v.children[m], g = !1) : E = null : (k.push(E), O.push(m), m = 0, v = E, E = E.children[0]);
        }
        return this;
      }, r.prototype.toBBox = function(p) {
        return p;
      }, r.prototype.compareMinX = function(p, _) {
        return p.minX - _.minX;
      }, r.prototype.compareMinY = function(p, _) {
        return p.minY - _.minY;
      }, r.prototype.toJSON = function() {
        return this.data;
      }, r.prototype.fromJSON = function(p) {
        return this.data = p, this;
      }, r.prototype._all = function(p, _) {
        for (var m = []; p; ) p.leaf ? _.push.apply(_, p.children) : m.push.apply(m, p.children), p = m.pop();
        return _;
      }, r.prototype._build = function(p, _, m, v) {
        var g, E = m - _ + 1, S = this._maxEntries;
        if (E <= S) return a(g = P(p.slice(_, m + 1)), this.toBBox), g;
        v || (v = Math.ceil(Math.log(E) / Math.log(S)), S = Math.ceil(E / Math.pow(S, v - 1))), (g = P([])).leaf = !1, g.height = v;
        var k = Math.ceil(E / S), O = k * Math.ceil(Math.sqrt(S));
        M(p, _, m, O, this.compareMinX);
        for (var N = _; N <= m; N += O) {
          var X = Math.min(N + O - 1, m);
          M(p, N, X, k, this.compareMinY);
          for (var F = N; F <= X; F += k) {
            var y = Math.min(F + k - 1, X);
            g.children.push(this._build(p, F, y, v - 1));
          }
        }
        return a(g, this.toBBox), g;
      }, r.prototype._chooseSubtree = function(p, _, m, v) {
        for (; v.push(_), !_.leaf && v.length - 1 !== m; ) {
          for (var g = 1 / 0, E = 1 / 0, S = void 0, k = 0; k < _.children.length; k++) {
            var O = _.children[k], N = u(O), X = (F = p, y = O, (Math.max(y.maxX, F.maxX) - Math.min(y.minX, F.minX)) * (Math.max(y.maxY, F.maxY) - Math.min(y.minY, F.minY)) - N);
            X < E ? (E = X, g = N < g ? N : g, S = O) : X === E && N < g && (g = N, S = O);
          }
          _ = S || _.children[0];
        }
        var F, y;
        return _;
      }, r.prototype._insert = function(p, _, m) {
        var v = m ? p : this.toBBox(p), g = [], E = this._chooseSubtree(v, this.data, _, g);
        for (E.children.push(p), h(E, v); _ >= 0 && g[_].children.length > this._maxEntries; ) this._split(g, _), _--;
        this._adjustParentBBoxes(v, g, _);
      }, r.prototype._split = function(p, _) {
        var m = p[_], v = m.children.length, g = this._minEntries;
        this._chooseSplitAxis(m, g, v);
        var E = this._chooseSplitIndex(m, g, v), S = P(m.children.splice(E, m.children.length - E));
        S.height = m.height, S.leaf = m.leaf, a(m, this.toBBox), a(S, this.toBBox), _ ? p[_ - 1].children.push(S) : this._splitRoot(m, S);
      }, r.prototype._splitRoot = function(p, _) {
        this.data = P([p, _]), this.data.height = p.height + 1, this.data.leaf = !1, a(this.data, this.toBBox);
      }, r.prototype._chooseSplitIndex = function(p, _, m) {
        for (var v, g, E, S, k, O, N, X = 1 / 0, F = 1 / 0, y = _; y <= m - _; y++) {
          var I = l(p, 0, y, this.toBBox), A = l(p, y, m, this.toBBox), T = (g = I, E = A, S = void 0, k = void 0, O = void 0, N = void 0, S = Math.max(g.minX, E.minX), k = Math.max(g.minY, E.minY), O = Math.min(g.maxX, E.maxX), N = Math.min(g.maxY, E.maxY), Math.max(0, O - S) * Math.max(0, N - k)), C = u(I) + u(A);
          T < X ? (X = T, v = y, F = C < F ? C : F) : T === X && C < F && (F = C, v = y);
        }
        return v || m - _;
      }, r.prototype._chooseSplitAxis = function(p, _, m) {
        var v = p.leaf ? this.compareMinX : f, g = p.leaf ? this.compareMinY : c;
        this._allDistMargin(p, _, m, v) < this._allDistMargin(p, _, m, g) && p.children.sort(v);
      }, r.prototype._allDistMargin = function(p, _, m, v) {
        p.children.sort(v);
        for (var g = this.toBBox, E = l(p, 0, _, g), S = l(p, m - _, m, g), k = d(E) + d(S), O = _; O < m - _; O++) {
          var N = p.children[O];
          h(E, p.leaf ? g(N) : N), k += d(E);
        }
        for (var X = m - _ - 1; X >= _; X--) {
          var F = p.children[X];
          h(S, p.leaf ? g(F) : F), k += d(S);
        }
        return k;
      }, r.prototype._adjustParentBBoxes = function(p, _, m) {
        for (var v = m; v >= 0; v--) h(_[v], p);
      }, r.prototype._condense = function(p) {
        for (var _ = p.length - 1, m = void 0; _ >= 0; _--) p[_].children.length === 0 ? _ > 0 ? (m = p[_ - 1].children).splice(m.indexOf(p[_]), 1) : this.clear() : a(p[_], this.toBBox);
      }, r;
    });
  })(ke)), ke.exports;
}
const Fi = /* @__PURE__ */ Xi(vi);
var Zt = { exports: {} }, Ye, fn;
function Yi() {
  return fn || (fn = 1, Ye = function(t, n, i, o) {
    var r = t[0], s = t[1], a = !1;
    i === void 0 && (i = 0), o === void 0 && (o = n.length);
    for (var l = (o - i) / 2, h = 0, f = l - 1; h < l; f = h++) {
      var c = n[i + h * 2 + 0], u = n[i + h * 2 + 1], d = n[i + f * 2 + 0], b = n[i + f * 2 + 1], w = u > s != b > s && r < (d - c) * (s - u) / (b - u) + c;
      w && (a = !a);
    }
    return a;
  }), Ye;
}
var Re, un;
function Ri() {
  return un || (un = 1, Re = function(t, n, i, o) {
    var r = t[0], s = t[1], a = !1;
    i === void 0 && (i = 0), o === void 0 && (o = n.length);
    for (var l = o - i, h = 0, f = l - 1; h < l; f = h++) {
      var c = n[h + i][0], u = n[h + i][1], d = n[f + i][0], b = n[f + i][1], w = u > s != b > s && r < (d - c) * (s - u) / (b - u) + c;
      w && (a = !a);
    }
    return a;
  }), Re;
}
var dn;
function Li() {
  if (dn) return Zt.exports;
  dn = 1;
  var e = Yi(), t = Ri();
  return Zt.exports = function(i, o, r, s) {
    return o.length > 0 && Array.isArray(o[0]) ? t(i, o, r, s) : e(i, o, r, s);
  }, Zt.exports.nested = t, Zt.exports.flat = e, Zt.exports;
}
var ee = { exports: {} }, Vi = ee.exports, pn;
function ji() {
  return pn || (pn = 1, (function(e, t) {
    (function(n, i) {
      i(t);
    })(Vi, function(n) {
      const o = 33306690738754706e-32;
      function r(w, P, M, p, _) {
        let m, v, g, E, S = P[0], k = p[0], O = 0, N = 0;
        k > S == k > -S ? (m = S, S = P[++O]) : (m = k, k = p[++N]);
        let X = 0;
        if (O < w && N < M) for (k > S == k > -S ? (g = m - ((v = S + m) - S), S = P[++O]) : (g = m - ((v = k + m) - k), k = p[++N]), m = v, g !== 0 && (_[X++] = g); O < w && N < M; ) k > S == k > -S ? (g = m - ((v = m + S) - (E = v - m)) + (S - E), S = P[++O]) : (g = m - ((v = m + k) - (E = v - m)) + (k - E), k = p[++N]), m = v, g !== 0 && (_[X++] = g);
        for (; O < w; ) g = m - ((v = m + S) - (E = v - m)) + (S - E), S = P[++O], m = v, g !== 0 && (_[X++] = g);
        for (; N < M; ) g = m - ((v = m + k) - (E = v - m)) + (k - E), k = p[++N], m = v, g !== 0 && (_[X++] = g);
        return m === 0 && X !== 0 || (_[X++] = m), X;
      }
      function s(w) {
        return new Float64Array(w);
      }
      const a = 33306690738754716e-32, l = 22204460492503146e-32, h = 11093356479670487e-47, f = s(4), c = s(8), u = s(12), d = s(16), b = s(4);
      n.orient2d = function(w, P, M, p, _, m) {
        const v = (P - m) * (M - _), g = (w - _) * (p - m), E = v - g;
        if (v === 0 || g === 0 || v > 0 != g > 0) return E;
        const S = Math.abs(v + g);
        return Math.abs(E) >= a * S ? E : -(function(k, O, N, X, F, y, I) {
          let A, T, C, $, x, B, D, Y, L, V, U, j, J, G, Q, H, Z, W;
          const st = k - F, ht = N - F, rt = O - y, ot = X - y;
          x = (Q = (Y = st - (D = (B = 134217729 * st) - (B - st))) * (V = ot - (L = (B = 134217729 * ot) - (B - ot))) - ((G = st * ot) - D * L - Y * L - D * V)) - (U = Q - (Z = (Y = rt - (D = (B = 134217729 * rt) - (B - rt))) * (V = ht - (L = (B = 134217729 * ht) - (B - ht))) - ((H = rt * ht) - D * L - Y * L - D * V))), f[0] = Q - (U + x) + (x - Z), x = (J = G - ((j = G + U) - (x = j - G)) + (U - x)) - (U = J - H), f[1] = J - (U + x) + (x - H), x = (W = j + U) - j, f[2] = j - (W - x) + (U - x), f[3] = W;
          let Xt = (function(ri, Qe) {
            let He = Qe[0];
            for (let Pe = 1; Pe < ri; Pe++) He += Qe[Pe];
            return He;
          })(4, f), Wt = l * I;
          if (Xt >= Wt || -Xt >= Wt || (A = k - (st + (x = k - st)) + (x - F), C = N - (ht + (x = N - ht)) + (x - F), T = O - (rt + (x = O - rt)) + (x - y), $ = X - (ot + (x = X - ot)) + (x - y), A === 0 && T === 0 && C === 0 && $ === 0) || (Wt = h * I + o * Math.abs(Xt), (Xt += st * $ + ot * A - (rt * C + ht * T)) >= Wt || -Xt >= Wt)) return Xt;
          x = (Q = (Y = A - (D = (B = 134217729 * A) - (B - A))) * (V = ot - (L = (B = 134217729 * ot) - (B - ot))) - ((G = A * ot) - D * L - Y * L - D * V)) - (U = Q - (Z = (Y = T - (D = (B = 134217729 * T) - (B - T))) * (V = ht - (L = (B = 134217729 * ht) - (B - ht))) - ((H = T * ht) - D * L - Y * L - D * V))), b[0] = Q - (U + x) + (x - Z), x = (J = G - ((j = G + U) - (x = j - G)) + (U - x)) - (U = J - H), b[1] = J - (U + x) + (x - H), x = (W = j + U) - j, b[2] = j - (W - x) + (U - x), b[3] = W;
          const ei = r(4, f, 4, b, c);
          x = (Q = (Y = st - (D = (B = 134217729 * st) - (B - st))) * (V = $ - (L = (B = 134217729 * $) - (B - $))) - ((G = st * $) - D * L - Y * L - D * V)) - (U = Q - (Z = (Y = rt - (D = (B = 134217729 * rt) - (B - rt))) * (V = C - (L = (B = 134217729 * C) - (B - C))) - ((H = rt * C) - D * L - Y * L - D * V))), b[0] = Q - (U + x) + (x - Z), x = (J = G - ((j = G + U) - (x = j - G)) + (U - x)) - (U = J - H), b[1] = J - (U + x) + (x - H), x = (W = j + U) - j, b[2] = j - (W - x) + (U - x), b[3] = W;
          const ni = r(ei, c, 4, b, u);
          x = (Q = (Y = A - (D = (B = 134217729 * A) - (B - A))) * (V = $ - (L = (B = 134217729 * $) - (B - $))) - ((G = A * $) - D * L - Y * L - D * V)) - (U = Q - (Z = (Y = T - (D = (B = 134217729 * T) - (B - T))) * (V = C - (L = (B = 134217729 * C) - (B - C))) - ((H = T * C) - D * L - Y * L - D * V))), b[0] = Q - (U + x) + (x - Z), x = (J = G - ((j = G + U) - (x = j - G)) + (U - x)) - (U = J - H), b[1] = J - (U + x) + (x - H), x = (W = j + U) - j, b[2] = j - (W - x) + (U - x), b[3] = W;
          const ii = r(ni, u, 4, b, d);
          return d[ii - 1];
        })(w, P, M, p, _, m, S);
      }, n.orient2dfast = function(w, P, M, p, _, m) {
        return (P - m) * (M - _) - (w - _) * (p - m);
      }, Object.defineProperty(n, "__esModule", { value: !0 });
    });
  })(ee, ee.exports)), ee.exports;
}
var mn;
function Ui() {
  if (mn) return ye.exports;
  mn = 1;
  var e = $i(), t = Fi, n = Li(), i = ji().orient2d;
  t.default && (t = t.default), ye.exports = o, ye.exports.default = o;
  function o(m, v, g) {
    v = Math.max(0, v === void 0 ? 2 : v), g = g || 0;
    var E = d(m), S = new e(16);
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
    }, S.load(m);
    for (var k = [], O = 0, N; O < E.length; O++) {
      var X = E[O];
      S.remove(X), N = b(X, N), k.push(N);
    }
    var F = new e(16);
    for (O = 0; O < k.length; O++) F.insert(u(k[O]));
    for (var y = v * v, I = g * g; k.length; ) {
      var A = k.shift(), T = A.p, C = A.next.p, $ = w(T, C);
      if (!($ < I)) {
        var x = $ / y;
        X = r(S, A.prev.p, T, C, A.next.next.p, x, F), X && Math.min(w(X, T), w(X, C)) <= x && (k.push(A), k.push(b(X, A)), S.remove(X), F.remove(A), F.insert(u(A)), F.insert(u(A.next)));
      }
    }
    A = N;
    var B = [];
    do
      B.push(A.p), A = A.next;
    while (A !== N);
    return B.push(A.p), B;
  }
  function r(m, v, g, E, S, k, O) {
    for (var N = new t([], s), X = m.data; X; ) {
      for (var F = 0; F < X.children.length; F++) {
        var y = X.children[F], I = X.leaf ? P(y, g, E) : a(g, E, y);
        I > k || N.push({
          node: y,
          dist: I
        });
      }
      for (; N.length && !N.peek().node.children; ) {
        var A = N.pop(), T = A.node, C = P(T, v, g), $ = P(T, E, S);
        if (A.dist < C && A.dist < $ && h(g, T, O) && h(E, T, O)) return T;
      }
      X = N.pop(), X && (X = X.node);
    }
    return null;
  }
  function s(m, v) {
    return m.dist - v.dist;
  }
  function a(m, v, g) {
    if (l(m, g) || l(v, g)) return 0;
    var E = M(m[0], m[1], v[0], v[1], g.minX, g.minY, g.maxX, g.minY);
    if (E === 0) return 0;
    var S = M(m[0], m[1], v[0], v[1], g.minX, g.minY, g.minX, g.maxY);
    if (S === 0) return 0;
    var k = M(m[0], m[1], v[0], v[1], g.maxX, g.minY, g.maxX, g.maxY);
    if (k === 0) return 0;
    var O = M(m[0], m[1], v[0], v[1], g.minX, g.maxY, g.maxX, g.maxY);
    return O === 0 ? 0 : Math.min(E, S, k, O);
  }
  function l(m, v) {
    return m[0] >= v.minX && m[0] <= v.maxX && m[1] >= v.minY && m[1] <= v.maxY;
  }
  function h(m, v, g) {
    for (var E = Math.min(m[0], v[0]), S = Math.min(m[1], v[1]), k = Math.max(m[0], v[0]), O = Math.max(m[1], v[1]), N = g.search({ minX: E, minY: S, maxX: k, maxY: O }), X = 0; X < N.length; X++)
      if (c(N[X].p, N[X].next.p, m, v)) return !1;
    return !0;
  }
  function f(m, v, g) {
    return i(m[0], m[1], v[0], v[1], g[0], g[1]);
  }
  function c(m, v, g, E) {
    return m !== E && v !== g && f(m, v, g) > 0 != f(m, v, E) > 0 && f(g, E, m) > 0 != f(g, E, v) > 0;
  }
  function u(m) {
    var v = m.p, g = m.next.p;
    return m.minX = Math.min(v[0], g[0]), m.minY = Math.min(v[1], g[1]), m.maxX = Math.max(v[0], g[0]), m.maxY = Math.max(v[1], g[1]), m;
  }
  function d(m) {
    for (var v = m[0], g = m[0], E = m[0], S = m[0], k = 0; k < m.length; k++) {
      var O = m[k];
      O[0] < v[0] && (v = O), O[0] > E[0] && (E = O), O[1] < g[1] && (g = O), O[1] > S[1] && (S = O);
    }
    var N = [v, g, E, S], X = N.slice();
    for (k = 0; k < m.length; k++)
      n(m[k], N) || X.push(m[k]);
    return _(X);
  }
  function b(m, v) {
    var g = {
      p: m,
      prev: null,
      next: null,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };
    return v ? (g.next = v.next, g.prev = v, v.next.prev = g, v.next = g) : (g.prev = g, g.next = g), g;
  }
  function w(m, v) {
    var g = m[0] - v[0], E = m[1] - v[1];
    return g * g + E * E;
  }
  function P(m, v, g) {
    var E = v[0], S = v[1], k = g[0] - E, O = g[1] - S;
    if (k !== 0 || O !== 0) {
      var N = ((m[0] - E) * k + (m[1] - S) * O) / (k * k + O * O);
      N > 1 ? (E = g[0], S = g[1]) : N > 0 && (E += k * N, S += O * N);
    }
    return k = m[0] - E, O = m[1] - S, k * k + O * O;
  }
  function M(m, v, g, E, S, k, O, N) {
    var X = g - m, F = E - v, y = O - S, I = N - k, A = m - S, T = v - k, C = X * X + F * F, $ = X * y + F * I, x = y * y + I * I, B = X * A + F * T, D = y * A + I * T, Y = C * x - $ * $, L, V, U, j, J = Y, G = Y;
    Y === 0 ? (V = 0, J = 1, j = D, G = x) : (V = $ * D - x * B, j = C * D - $ * B, V < 0 ? (V = 0, j = D, G = x) : V > J && (V = J, j = D + $, G = x)), j < 0 ? (j = 0, -B < 0 ? V = 0 : -B > C ? V = J : (V = -B, J = C)) : j > G && (j = G, -B + $ < 0 ? V = 0 : -B + $ > C ? V = J : (V = -B + $, J = C)), L = V === 0 ? 0 : V / J, U = j === 0 ? 0 : j / G;
    var Q = (1 - L) * m + L * g, H = (1 - L) * v + L * E, Z = (1 - U) * S + U * O, W = (1 - U) * k + U * N, st = Z - Q, ht = W - H;
    return st * st + ht * ht;
  }
  function p(m, v) {
    return m[0] === v[0] ? m[1] - v[1] : m[0] - v[0];
  }
  function _(m) {
    m.sort(p);
    for (var v = [], g = 0; g < m.length; g++) {
      for (; v.length >= 2 && f(v[v.length - 2], v[v.length - 1], m[g]) <= 0; )
        v.pop();
      v.push(m[g]);
    }
    for (var E = [], S = m.length - 1; S >= 0; S--) {
      for (; E.length >= 2 && f(E[E.length - 2], E[E.length - 1], m[S]) <= 0; )
        E.pop();
      E.push(m[S]);
    }
    return E.pop(), v.pop(), v.concat(E);
  }
  return ye.exports;
}
var qi = Ui();
const zi = /* @__PURE__ */ Ti(qi);
function gn(e, t = {}) {
  t.concavity = t.concavity || 1 / 0;
  const n = [];
  if (Ge(e, (o) => {
    n.push([o[0], o[1]]);
  }), !n.length)
    return null;
  const i = zi(n, t.concavity);
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
  if (!wn(e[0]) || !wn(e[1]))
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
function wn(e) {
  return !isNaN(e) && e !== null && !Array.isArray(e);
}
function Gi(e) {
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
function yn(e) {
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
function Ji(e) {
  return e.type === "Feature" ? e.geometry : e;
}
const Tt = 11102230246251565e-32, dt = 134217729, Ki = (3 + 8 * Tt) * Tt;
function Le(e, t, n, i, o) {
  let r, s, a, l, h = t[0], f = i[0], c = 0, u = 0;
  f > h == f > -h ? (r = h, h = t[++c]) : (r = f, f = i[++u]);
  let d = 0;
  if (c < e && u < n)
    for (f > h == f > -h ? (s = h + r, a = r - (s - h), h = t[++c]) : (s = f + r, a = r - (s - f), f = i[++u]), r = s, a !== 0 && (o[d++] = a); c < e && u < n; )
      f > h == f > -h ? (s = r + h, l = s - r, a = r - (s - l) + (h - l), h = t[++c]) : (s = r + f, l = s - r, a = r - (s - l) + (f - l), f = i[++u]), r = s, a !== 0 && (o[d++] = a);
  for (; c < e; )
    s = r + h, l = s - r, a = r - (s - l) + (h - l), h = t[++c], r = s, a !== 0 && (o[d++] = a);
  for (; u < n; )
    s = r + f, l = s - r, a = r - (s - l) + (f - l), f = i[++u], r = s, a !== 0 && (o[d++] = a);
  return (r !== 0 || d === 0) && (o[d++] = r), d;
}
function Qi(e, t) {
  let n = t[0];
  for (let i = 1; i < e; i++) n += t[i];
  return n;
}
function fe(e) {
  return new Float64Array(e);
}
const Hi = (3 + 16 * Tt) * Tt, Wi = (2 + 12 * Tt) * Tt, Zi = (9 + 64 * Tt) * Tt * Tt, Jt = fe(4), vn = fe(8), bn = fe(12), xn = fe(16), vt = fe(4);
function tr(e, t, n, i, o, r, s) {
  let a, l, h, f, c, u, d, b, w, P, M, p, _, m, v, g, E, S;
  const k = e - o, O = n - o, N = t - r, X = i - r;
  m = k * X, u = dt * k, d = u - (u - k), b = k - d, u = dt * X, w = u - (u - X), P = X - w, v = b * P - (m - d * w - b * w - d * P), g = N * O, u = dt * N, d = u - (u - N), b = N - d, u = dt * O, w = u - (u - O), P = O - w, E = b * P - (g - d * w - b * w - d * P), M = v - E, c = v - M, Jt[0] = v - (M + c) + (c - E), p = m + M, c = p - m, _ = m - (p - c) + (M - c), M = _ - g, c = _ - M, Jt[1] = _ - (M + c) + (c - g), S = p + M, c = S - p, Jt[2] = p - (S - c) + (M - c), Jt[3] = S;
  let F = Qi(4, Jt), y = Wi * s;
  if (F >= y || -F >= y || (c = e - k, a = e - (k + c) + (c - o), c = n - O, h = n - (O + c) + (c - o), c = t - N, l = t - (N + c) + (c - r), c = i - X, f = i - (X + c) + (c - r), a === 0 && l === 0 && h === 0 && f === 0) || (y = Zi * s + Ki * Math.abs(F), F += k * f + X * a - (N * h + O * l), F >= y || -F >= y)) return F;
  m = a * X, u = dt * a, d = u - (u - a), b = a - d, u = dt * X, w = u - (u - X), P = X - w, v = b * P - (m - d * w - b * w - d * P), g = l * O, u = dt * l, d = u - (u - l), b = l - d, u = dt * O, w = u - (u - O), P = O - w, E = b * P - (g - d * w - b * w - d * P), M = v - E, c = v - M, vt[0] = v - (M + c) + (c - E), p = m + M, c = p - m, _ = m - (p - c) + (M - c), M = _ - g, c = _ - M, vt[1] = _ - (M + c) + (c - g), S = p + M, c = S - p, vt[2] = p - (S - c) + (M - c), vt[3] = S;
  const I = Le(4, Jt, 4, vt, vn);
  m = k * f, u = dt * k, d = u - (u - k), b = k - d, u = dt * f, w = u - (u - f), P = f - w, v = b * P - (m - d * w - b * w - d * P), g = N * h, u = dt * N, d = u - (u - N), b = N - d, u = dt * h, w = u - (u - h), P = h - w, E = b * P - (g - d * w - b * w - d * P), M = v - E, c = v - M, vt[0] = v - (M + c) + (c - E), p = m + M, c = p - m, _ = m - (p - c) + (M - c), M = _ - g, c = _ - M, vt[1] = _ - (M + c) + (c - g), S = p + M, c = S - p, vt[2] = p - (S - c) + (M - c), vt[3] = S;
  const A = Le(I, vn, 4, vt, bn);
  m = a * f, u = dt * a, d = u - (u - a), b = a - d, u = dt * f, w = u - (u - f), P = f - w, v = b * P - (m - d * w - b * w - d * P), g = l * h, u = dt * l, d = u - (u - l), b = l - d, u = dt * h, w = u - (u - h), P = h - w, E = b * P - (g - d * w - b * w - d * P), M = v - E, c = v - M, vt[0] = v - (M + c) + (c - E), p = m + M, c = p - m, _ = m - (p - c) + (M - c), M = _ - g, c = _ - M, vt[1] = _ - (M + c) + (c - g), S = p + M, c = S - p, vt[2] = p - (S - c) + (M - c), vt[3] = S;
  const T = Le(A, bn, 4, vt, xn);
  return xn[T - 1];
}
function er(e, t, n, i, o, r) {
  const s = (t - r) * (n - o), a = (e - o) * (i - r), l = s - a, h = Math.abs(s + a);
  return Math.abs(l) >= Hi * h ? l : -tr(e, t, n, i, o, r, h);
}
function nr(e, t) {
  var n, i, o = 0, r, s, a, l, h, f, c, u = e[0], d = e[1], b = t.length;
  for (n = 0; n < b; n++) {
    i = 0;
    var w = t[n], P = w.length - 1;
    if (f = w[0], f[0] !== w[P][0] && f[1] !== w[P][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (s = f[0] - u, a = f[1] - d, i; i < P; i++) {
      if (c = w[i + 1], l = c[0] - u, h = c[1] - d, a === 0 && h === 0) {
        if (l <= 0 && s >= 0 || s <= 0 && l >= 0)
          return 0;
      } else if (h >= 0 && a <= 0 || h <= 0 && a >= 0) {
        if (r = er(s, l, a, h, 0, 0), r === 0)
          return 0;
        (r > 0 && h > 0 && a <= 0 || r < 0 && h <= 0 && a > 0) && o++;
      }
      f = c, a = h, s = l;
    }
  }
  return o % 2 !== 0;
}
function Ue(e, t, n = {}) {
  if (!e)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const i = Gi(e), o = Ji(t), r = o.type, s = t.bbox;
  let a = o.coordinates;
  if (s && ir(i, s) === !1)
    return !1;
  r === "Polygon" && (a = [a]);
  for (var l = 0; l < a.length; ++l) {
    const h = nr(i, a[l]);
    if (h === 0 && !n.ignoreBoundary || h) return !0;
  }
  return !1;
}
function ir(e, t) {
  return t[0] <= e[0] && t[1] <= e[1] && t[2] >= e[0] && t[3] >= e[1];
}
function Ve(e, t) {
  for (let n = 0; n < t.features.length; n++)
    if (Ue(e, t.features[n]))
      return t.features[n];
}
function zn(e, t) {
  const n = t.geometry.coordinates[0][0], i = t.geometry.coordinates[0][1], o = t.geometry.coordinates[0][2], r = e.geometry.coordinates, s = t.properties.a.geom, a = t.properties.b.geom, l = t.properties.c.geom, h = [i[0] - n[0], i[1] - n[1]], f = [o[0] - n[0], o[1] - n[1]], c = [r[0] - n[0], r[1] - n[1]], u = [a[0] - s[0], a[1] - s[1]], d = [l[0] - s[0], l[1] - s[1]], b = (f[1] * c[0] - f[0] * c[1]) / (h[0] * f[1] - h[1] * f[0]), w = (h[0] * c[1] - h[1] * c[0]) / (h[0] * f[1] - h[1] * f[0]);
  return [
    b * u[0] + w * d[0] + s[0],
    b * u[1] + w * d[1] + s[1]
  ];
}
function rr(e, t, n) {
  const i = e.geometry.coordinates, o = n.geometry.coordinates, r = Math.atan2(i[0] - o[0], i[1] - o[1]), s = or(r, t[0]);
  if (s === void 0)
    throw new Error("Unable to determine vertex index");
  const a = t[1][s];
  return zn(e, a.features[0]);
}
function ne(e, t, n, i, o, r, s, a) {
  let l;
  if (s && (l = Ve(e, Ht([s]))), !l)
    if (n) {
      const h = e.geometry.coordinates, f = n.gridNum, c = n.xOrigin, u = n.yOrigin, d = n.xUnit, b = n.yUnit, w = n.gridCache, P = It(h[0], c, d, f), M = It(h[1], u, b, f), p = w[P] ? w[P][M] ? w[P][M] : [] : [], _ = Ht(p.map((m) => t.features[m]));
      l = Ve(e, _);
    } else
      l = Ve(e, t);
  return a && a(l), l ? zn(e, l) : rr(e, i, o);
}
function It(e, t, n, i) {
  let o = Math.floor((e - t) / n);
  return o < 0 && (o = 0), o >= i && (o = i - 1), o;
}
function or(e, t) {
  let n = _n(e - t[0]), i = Math.PI * 2, o;
  for (let r = 0; r < t.length; r++) {
    const s = (r + 1) % t.length, a = _n(e - t[s]), l = Math.min(Math.abs(n), Math.abs(a));
    n * a <= 0 && l < i && (i = l, o = r), n = a;
  }
  return o;
}
function _n(e, t = !1) {
  const n = 2 * Math.PI, i = e - Math.floor(e / n) * n;
  return t ? i : i > Math.PI ? i - n : i;
}
function Mn(e) {
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
function Gn(e) {
  const t = ["a", "b", "c", "a"].map(
    (r) => e.properties[r].geom
  ), n = e.geometry.coordinates[0], i = e.properties, o = {
    a: { geom: n[0], index: i.a.index },
    b: { geom: n[1], index: i.b.index },
    c: { geom: n[2], index: i.c.index }
  };
  return qn([t], o);
}
function sr(e) {
  const t = [0, 1, 2, 0].map((i) => e[i][0][0]), n = {
    a: { geom: e[0][0][1], index: e[0][1] },
    b: { geom: e[1][0][1], index: e[1][1] },
    c: { geom: e[2][0][1], index: e[2][1] }
  };
  return qn([t], n);
}
function qe(e, t, n, i, o, r = !1, s) {
  const a = e.map(
    (l) => {
      (!s || s < 2.00703) && (l = ar(l));
      const h = isFinite(l) ? t[l] : l === "c" ? i : (function() {
        const f = l.match(/^b(\d+)$/);
        if (f) return o[parseInt(f[1])];
        const c = l.match(/^e(\d+)$/);
        if (c) return n[parseInt(c[1])];
        throw new Error("Bad index value for indexesToTri");
      })();
      return r ? [[h[1], h[0]], l] : [[h[0], h[1]], l];
    }
  );
  return sr(a);
}
function ar(e) {
  return typeof e == "number" ? e : e.replace(/^(c|e|b)(?:ent|dgeNode|box)(\d+)?$/, "$1$2");
}
function Jn(e, t) {
  return t && t >= 2.00703 || Array.isArray(e[0]) ? e : e.map((n) => [
    n.illstNodes,
    n.mercNodes,
    n.startEnd
  ]);
}
const cr = 2.00704;
function lr(e) {
  return !!(e.version !== void 0 || !e.tins && e.points && e.tins_points);
}
function hr(e) {
  return {
    points: e.points,
    strictStatus: ur(e),
    verticesParams: dr(e),
    centroid: pr(e),
    edges: Jn(e.edges || []),
    edgeNodes: e.edgeNodes || [],
    tins: mr(e),
    kinks: gr(e.kinks_points),
    yaxisMode: e.yaxisMode ?? "invert",
    strictMode: e.strictMode ?? "auto",
    vertexMode: e.vertexMode,
    bounds: e.bounds,
    boundsPolygon: e.boundsPolygon,
    wh: e.wh,
    xy: e.xy ?? [0, 0]
  };
}
function fr(e) {
  const t = wr(e), n = t.tins;
  return {
    compiled: t,
    tins: n,
    points: yr(n),
    strictStatus: t.strict_status,
    verticesParams: t.vertices_params,
    centroid: t.centroid,
    kinks: t.kinks
  };
}
function ur(e) {
  return e.strict_status ? e.strict_status : e.kinks_points ? "strict_error" : e.tins_points.length === 2 ? "loose" : "strict";
}
function dr(e) {
  const t = {
    forw: [e.vertices_params[0]],
    bakw: [e.vertices_params[1]]
  };
  return t.forw[1] = Sn(e, !1), t.bakw[1] = Sn(e, !0), t;
}
function Sn(e, t) {
  const n = e.vertices_points.length;
  return Array.from({ length: n }, (i, o) => {
    const r = (o + 1) % n, s = qe(
      ["c", `b${o}`, `b${r}`],
      e.points,
      e.edgeNodes || [],
      e.centroid_point,
      e.vertices_points,
      t,
      cr
    );
    return Ht([s]);
  });
}
function pr(e) {
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
function mr(e) {
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
function gr(e) {
  if (e)
    return {
      bakw: Ht(
        e.map((t) => se(t))
      )
    };
}
function wr(e) {
  return JSON.parse(
    JSON.stringify(e).replace('"cent"', '"c"').replace(/"bbox(\d+)"/g, '"b$1"')
  );
}
function yr(e) {
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
    if (lr(t)) {
      this.applyModernState(hr(t));
      return;
    }
    this.applyLegacyState(fr(t));
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
      let P = [];
      return yn(w)[0].map((M) => {
        r.length === 0 ? r = [Array.from(M), Array.from(M)] : (M[0] < r[0][0] && (r[0][0] = M[0]), M[0] > r[1][0] && (r[1][0] = M[0]), M[1] < r[0][1] && (r[0][1] = M[1]), M[1] > r[1][1] && (r[1][1] = M[1])), P.length === 0 ? P = [Array.from(M), Array.from(M)] : (M[0] < P[0][0] && (P[0][0] = M[0]), M[0] > P[1][0] && (P[1][0] = M[0]), M[1] < P[0][1] && (P[0][1] = M[1]), M[1] > P[1][1] && (P[1][1] = M[1]));
      }), P;
    }), l = (r[1][0] - r[0][0]) / o, h = (r[1][1] - r[0][1]) / o, f = a.reduce(
      (w, P, M) => {
        const p = It(P[0][0], r[0][0], l, o), _ = It(P[1][0], r[0][0], l, o), m = It(P[0][1], r[0][1], h, o), v = It(P[1][1], r[0][1], h, o);
        for (let g = p; g <= _; g++) {
          w[g] || (w[g] = []);
          for (let E = m; E <= v; E++)
            w[g][E] || (w[g][E] = []), w[g][E].push(M);
        }
        return w;
      },
      []
    ), c = i.features.map((w) => {
      let P = [];
      return yn(w)[0].map((M) => {
        s.length === 0 ? s = [Array.from(M), Array.from(M)] : (M[0] < s[0][0] && (s[0][0] = M[0]), M[0] > s[1][0] && (s[1][0] = M[0]), M[1] < s[0][1] && (s[0][1] = M[1]), M[1] > s[1][1] && (s[1][1] = M[1])), P.length === 0 ? P = [Array.from(M), Array.from(M)] : (M[0] < P[0][0] && (P[0][0] = M[0]), M[0] > P[1][0] && (P[1][0] = M[0]), M[1] < P[0][1] && (P[0][1] = M[1]), M[1] > P[1][1] && (P[1][1] = M[1]));
      }), P;
    }), u = (s[1][0] - s[0][0]) / o, d = (s[1][1] - s[0][1]) / o, b = c.reduce(
      (w, P, M) => {
        const p = It(P[0][0], s[0][0], u, o), _ = It(P[1][0], s[0][0], u, o), m = It(P[0][1], s[0][1], d, o), v = It(P[1][1], s[0][1], d, o);
        for (let g = p; g <= _; g++) {
          w[g] || (w[g] = []);
          for (let E = m; E <= v; E++)
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
        xUnit: l,
        yUnit: h,
        gridCache: f
      },
      bakw: {
        gridNum: o,
        xOrigin: s[0][0],
        yOrigin: s[0][1],
        xUnit: u,
        yUnit: d,
        gridCache: b
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
    const r = n ? this.tins.bakw : this.tins.forw, s = n ? this.indexedTins.bakw : this.indexedTins.forw, a = n ? this.vertices_params.bakw : this.vertices_params.forw, l = n ? this.centroid.bakw : this.centroid.forw;
    let h, f;
    this.stateFull && (this.stateBackward == n ? h = this.stateTriangle : (this.stateBackward = n, this.stateTriangle = void 0), f = (u) => {
      this.stateTriangle = u;
    });
    let c = ne(
      o,
      r,
      s,
      a,
      l,
      void 0,
      h,
      f
    );
    if (this.bounds && n && !i) {
      const u = se(c);
      if (!Ue(u, this.boundsPolygon)) return !1;
    } else this.yaxisMode == Mt.YAXIS_FOLLOW && !n && (c = [c[0], -1 * c[1]]);
    return c;
  }
}
const En = Math.pow(2, -52), ve = new Uint32Array(512);
class Ke {
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
  static from(t, n = Mr, i = Sr) {
    const o = t.length, r = new Float64Array(o * 2);
    for (let s = 0; s < o; s++) {
      const a = t[s];
      r[2 * s] = n(a), r[2 * s + 1] = i(a);
    }
    return new Ke(r);
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
    let a = 1 / 0, l = 1 / 0, h = -1 / 0, f = -1 / 0;
    for (let k = 0; k < s; k++) {
      const O = t[2 * k], N = t[2 * k + 1];
      O < a && (a = O), N < l && (l = N), O > h && (h = O), N > f && (f = N), this._ids[k] = k;
    }
    const c = (a + h) / 2, u = (l + f) / 2;
    let d = 0, b = 0, w = 0;
    for (let k = 0, O = 1 / 0; k < s; k++) {
      const N = je(c, u, t[2 * k], t[2 * k + 1]);
      N < O && (d = k, O = N);
    }
    const P = t[2 * d], M = t[2 * d + 1];
    for (let k = 0, O = 1 / 0; k < s; k++) {
      if (k === d) continue;
      const N = je(P, M, t[2 * k], t[2 * k + 1]);
      N < O && N > 0 && (b = k, O = N);
    }
    let p = t[2 * b], _ = t[2 * b + 1], m = 1 / 0;
    for (let k = 0; k < s; k++) {
      if (k === d || k === b) continue;
      const O = xr(P, M, p, _, t[2 * k], t[2 * k + 1]);
      O < m && (w = k, m = O);
    }
    let v = t[2 * w], g = t[2 * w + 1];
    if (m === 1 / 0) {
      for (let N = 0; N < s; N++)
        this._dists[N] = t[2 * N] - t[0] || t[2 * N + 1] - t[1];
      Kt(this._ids, this._dists, 0, s - 1);
      const k = new Uint32Array(s);
      let O = 0;
      for (let N = 0, X = -1 / 0; N < s; N++) {
        const F = this._ids[N], y = this._dists[F];
        y > X && (k[O++] = F, X = y);
      }
      this.hull = k.subarray(0, O), this.triangles = new Uint32Array(0), this.halfedges = new Int32Array(0);
      return;
    }
    if (Pt(P, M, p, _, v, g) < 0) {
      const k = b, O = p, N = _;
      b = w, p = v, _ = g, w = k, v = O, g = N;
    }
    const E = _r(P, M, p, _, v, g);
    this._cx = E.x, this._cy = E.y;
    for (let k = 0; k < s; k++)
      this._dists[k] = je(t[2 * k], t[2 * k + 1], E.x, E.y);
    Kt(this._ids, this._dists, 0, s - 1), this._hullStart = d;
    let S = 3;
    i[d] = n[w] = b, i[b] = n[d] = w, i[w] = n[b] = d, o[d] = 0, o[b] = 1, o[w] = 2, r.fill(-1), r[this._hashKey(P, M)] = d, r[this._hashKey(p, _)] = b, r[this._hashKey(v, g)] = w, this.trianglesLen = 0, this._addTriangle(d, b, w, -1, -1, -1);
    for (let k = 0, O = 0, N = 0; k < this._ids.length; k++) {
      const X = this._ids[k], F = t[2 * X], y = t[2 * X + 1];
      if (k > 0 && Math.abs(F - O) <= En && Math.abs(y - N) <= En || (O = F, N = y, X === d || X === b || X === w)) continue;
      let I = 0;
      for (let x = 0, B = this._hashKey(F, y); x < this._hashSize && (I = r[(B + x) % this._hashSize], !(I !== -1 && I !== i[I])); x++)
        ;
      I = n[I];
      let A = I, T;
      for (; T = i[A], Pt(F, y, t[2 * A], t[2 * A + 1], t[2 * T], t[2 * T + 1]) >= 0; )
        if (A = T, A === I) {
          A = -1;
          break;
        }
      if (A === -1) continue;
      let C = this._addTriangle(A, X, i[A], -1, -1, o[A]);
      o[X] = this._legalize(C + 2), o[A] = C, S++;
      let $ = i[A];
      for (; T = i[$], Pt(F, y, t[2 * $], t[2 * $ + 1], t[2 * T], t[2 * T + 1]) < 0; )
        C = this._addTriangle($, X, T, o[X], -1, o[$]), o[X] = this._legalize(C + 2), i[$] = $, S--, $ = T;
      if (A === I)
        for (; T = n[A], Pt(F, y, t[2 * T], t[2 * T + 1], t[2 * A], t[2 * A + 1]) < 0; )
          C = this._addTriangle(T, X, A, -1, o[A], o[T]), this._legalize(C + 2), o[T] = C, i[A] = A, S--, A = T;
      this._hullStart = n[X] = A, i[A] = n[$] = X, i[X] = $, r[this._hashKey(F, y)] = X, r[this._hashKey(t[2 * A], t[2 * A + 1])] = A;
    }
    this.hull = new Uint32Array(S);
    for (let k = 0, O = this._hullStart; k < S; k++)
      this.hull[k] = O, O = i[O];
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
    return Math.floor(vr(t - this._cx, n - this._cy) * this._hashSize) % this._hashSize;
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
      const h = a - a % 3, f = l + (t + 1) % 3, c = h + (a + 2) % 3, u = n[s], d = n[t], b = n[f], w = n[c];
      if (br(
        o[2 * u],
        o[2 * u + 1],
        o[2 * d],
        o[2 * d + 1],
        o[2 * b],
        o[2 * b + 1],
        o[2 * w],
        o[2 * w + 1]
      )) {
        n[t] = w, n[a] = u;
        const M = i[c];
        if (M === -1) {
          let _ = this._hullStart;
          do {
            if (this._hullTri[_] === c) {
              this._hullTri[_] = t;
              break;
            }
            _ = this._hullPrev[_];
          } while (_ !== this._hullStart);
        }
        this._link(t, M), this._link(a, i[s]), this._link(s, c);
        const p = h + (a + 1) % 3;
        r < ve.length && (ve[r++] = p);
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
function vr(e, t) {
  const n = e / (Math.abs(e) + Math.abs(t));
  return (t > 0 ? 3 - n : 1 + n) / 4;
}
function je(e, t, n, i) {
  const o = e - n, r = t - i;
  return o * o + r * r;
}
function br(e, t, n, i, o, r, s, a) {
  const l = e - s, h = t - a, f = n - s, c = i - a, u = o - s, d = r - a, b = l * l + h * h, w = f * f + c * c, P = u * u + d * d;
  return l * (c * P - w * d) - h * (f * P - w * u) + b * (f * d - c * u) < 0;
}
function xr(e, t, n, i, o, r) {
  const s = n - e, a = i - t, l = o - e, h = r - t, f = s * s + a * a, c = l * l + h * h, u = 0.5 / (s * h - a * l), d = (h * f - a * c) * u, b = (s * c - l * f) * u;
  return d * d + b * b;
}
function _r(e, t, n, i, o, r) {
  const s = n - e, a = i - t, l = o - e, h = r - t, f = s * s + a * a, c = l * l + h * h, u = 0.5 / (s * h - a * l), d = e + (h * f - a * c) * u, b = t + (s * c - l * f) * u;
  return { x: d, y: b };
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
function Mr(e) {
  return e[0];
}
function Sr(e) {
  return e[1];
}
class Er {
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
class kn extends Er {
  constructor(t) {
    super(8, new Uint8Array(Math.ceil(t / 8)).fill(0));
  }
}
function Ut(e) {
  return e % 3 === 2 ? e - 2 : e + 1;
}
function Ot(e) {
  return e % 3 === 0 ? e + 2 : e - 1;
}
function An(e, t, n, i, o, r, s, a) {
  const l = Pt(e, t, o, r, s, a), h = Pt(n, i, o, r, s, a);
  if (l > 0 && h > 0 || l < 0 && h < 0)
    return !1;
  const f = Pt(o, r, e, t, n, i), c = Pt(s, a, e, t, n, i);
  return f > 0 && c > 0 || f < 0 && c < 0 ? !1 : l === 0 && h === 0 && f === 0 && c === 0 ? !(Math.max(o, s) < Math.min(e, n) || Math.max(e, n) < Math.min(o, s) || Math.max(r, a) < Math.min(t, i) || Math.max(t, i) < Math.min(r, a)) : !0;
}
class kr {
  /**
   * The triangulation object from Delaunator.
   */
  del;
  constructor(t) {
    this.del = t;
  }
}
class Ae extends kr {
  /** See {@link Constrain.maxConstrainSteps}. */
  static MAX_STEPS_PER_EDGE = 64;
  static MIN_MAX_STEPS = 1024;
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
    this.vertMap = new Uint32Array(o).fill(i), this.flips = new kn(r), this.consd = new kn(r);
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
      const c = i[l], u = Ut(l);
      if (c === n)
        return this.protect(l);
      const d = Ot(l), b = i[d];
      if (b === n)
        return this.protect(u), u;
      if (this.intersectSegments(t, n, b, c)) {
        l = d;
        break;
      }
      l = o[u];
    } while (l !== -1 && l !== r);
    let h = l, f = -1;
    for (; l !== -1; ) {
      if (++a > s)
        throw new Error(
          `Constraining edge [${t}, ${n}] exceeded the iteration limit`
        );
      const c = o[l], u = Ot(l), d = Ot(c), b = Ut(c);
      if (c === -1)
        throw new Error("Constraining edge exited the hull");
      if (this.consd.has(l))
        throw new Error("Edge intersects already constrained edge");
      if (this.isCollinear(t, n, i[l]) || this.isCollinear(t, n, i[c]))
        throw new Error("Constraining edge intersects point");
      if (!this.intersectSegments(
        i[l],
        i[c],
        i[u],
        i[d]
      )) {
        if (f === -1 && (f = l), i[d] === n) {
          if (l === f)
            throw new Error("Infinite loop: non-convex quadrilateral");
          l = f, f = -1;
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
          i[b],
          i[d]
        ))
          l = b;
        else if (f === l)
          throw new Error("Infinite loop: no further intersect after non-convex");
        continue;
      }
      if (this.flipDiagonal(l), this.intersectSegments(
        t,
        n,
        i[u],
        i[d]
      ) && (f === -1 && (f = u), f === u))
        throw new Error("Infinite loop: flipped diagonal still intersects");
      i[d] === n ? (h = d, l = f, f = -1) : this.intersectSegments(
        t,
        n,
        i[b],
        i[d]
      ) && (l = b);
    }
    return this.protect(h), this.delaunify(!0), this.findEdge(t, n);
  }
  /**
   * Upper bound for the number of edges visited while constraining one edge.
   */
  maxConstrainSteps() {
    return this.del.triangles.length * Ae.MAX_STEPS_PER_EDGE + Ae.MIN_MAX_STEPS;
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
    const { triangles: n, halfedges: i } = this.del, o = this.flips, r = this.consd, s = i[t], a = Ot(t), l = Ut(t), h = Ot(s), f = Ut(s), c = i[a], u = i[h];
    if (r.has(t))
      throw new Error("Trying to flip a constrained edge");
    return n[t] = n[h], i[t] = u, o.set(t, o.has(h)) || r.set(t, r.has(h)), u !== -1 && (i[u] = t), i[a] = h, n[s] = n[a], i[s] = c, o.set(s, o.has(a)) || r.set(s, r.has(a)), c !== -1 && (i[c] = s), i[h] = a, this.markFlip(t), this.markFlip(l), this.markFlip(s), this.markFlip(f), o.add(a), r.delete(a), o.add(h), r.delete(h), this.updateVert(t), this.updateVert(l), this.updateVert(s), this.updateVert(f), a;
  }
  /**
   * Whether point p1, p2, and p are collinear.
   */
  isCollinear(t, n, i) {
    const o = this.del.coords;
    return Pt(
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
    return mi(
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
    const r = n[Ot(t)], s = n[t], a = n[Ut(t)], l = n[Ot(o)];
    return !this.inCircle(r, s, a, l);
  }
  /**
   * Update the vertex -> incoming edge map.
   */
  updateVert(t) {
    const { triangles: n, halfedges: i } = this.del, o = this.vertMap, r = n[t];
    let s = Ot(t), a = i[s];
    for (; a !== -1 && a !== t; )
      s = Ot(a), a = i[s];
    return o[r] = s, s;
  }
  /**
   * Whether the segments between vertices intersect.
   */
  intersectSegments(t, n, i, o) {
    const r = this.del.coords;
    return t === i || t === o || n === i || n === o ? !1 : An(
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
  static intersectSegments = An;
}
function be(e, t, n) {
  if (t || (t = []), typeof e != "object" || e.type !== "FeatureCollection")
    throw "Argument points must be FeatureCollection";
  if (!Array.isArray(t)) throw "Argument points must be Array of Array";
  const i = e.features.map(
    (l) => l.geometry.coordinates
  ), o = Ke.from(i);
  let r;
  const s = [];
  o.triangles.length !== 0 && t.length !== 0 && (r = new Ae(o), r.constrainAll(t));
  for (let l = 0; l < o.triangles.length; l += 3)
    s.push([o.triangles[l], o.triangles[l + 1], o.triangles[l + 2]]);
  const a = ["a", "b", "c"];
  return St(
    s.map((l) => {
      const h = {}, f = l.map((c, u) => {
        const d = e.features[c], b = d.geometry.coordinates, w = [b[0], b[1]];
        return b.length === 3 ? w[2] = b[2] : h[a[u]] = d.properties[n], w;
      });
      return f[3] = f[0], le([f], h);
    })
  );
}
function Ar(e, t) {
  const n = [[], [], [], []], i = [];
  return Object.keys(e).forEach((o) => {
    const r = e[o], s = r.forw, a = r.bakw, l = [
      s[0] - t.forw[0],
      s[1] - t.forw[1]
    ], h = [
      a[0] - t.bakw[0],
      t.bakw[1] - a[1]
    ], f = { forw: l, bakw: h };
    if (i.push(f), l[0] === 0 || l[1] === 0)
      return;
    let c = 0;
    l[0] > 0 && (c += 1), l[1] > 0 && (c += 2), n[c].push(f);
  }), { perQuad: n, aggregate: i };
}
function Ir(e) {
  let t = 1 / 0, n = 0, i = 0;
  return e.forEach((o) => {
    const { forw: r, bakw: s } = o, a = Math.hypot(r[0], r[1]), l = Math.hypot(s[0], s[1]);
    if (l === 0) return;
    const h = a / l, f = Math.atan2(r[0], r[1]) - Math.atan2(s[0], s[1]);
    t = Math.min(t, h), n += Math.cos(f), i += Math.sin(f);
  }), isFinite(t) ? [t, Math.atan2(i, n)] : [1, 0];
}
function Pr(e, t, n) {
  const { perQuad: i, aggregate: o } = Ar(e, t), r = i.every((l) => l.length > 0), a = (n === "birdeye" ? r ? i : [o] : [o]).map((l) => Ir(l));
  return a.length === 1 ? [a[0], a[0], a[0], a[0]] : a;
}
function Or(e, t) {
  let n = 0;
  return e[0] > t[0] && (n += 1), e[1] > t[1] && (n += 2), n;
}
function Nr(e, t, n) {
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
  const s = i[0] - n[0], a = i[1] - n[1], l = n[0] - e[0], h = n[1] - e[1], f = o * a - r * s;
  if (Math.abs(f) < 1e-12) return null;
  const c = (l * a - h * s) / f, u = (l * r - h * o) / f;
  return c <= 1e-10 || u < -1e-10 || u > 1 + 1e-10 ? null : { t: c, point: [e[0] + c * o, e[1] + c * r] };
}
function Tr(e, t, n) {
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
function In(e, t) {
  const i = Math.atan2(e[0] - t[0], e[1] - t[1]) * (180 / Math.PI);
  return i < 0 ? i + 360 : i;
}
function Pn(e, t, n, i, o, r) {
  const s = t[0] - e[0], a = t[1] - e[1];
  if (s === 0 && a === 0) return null;
  const l = [];
  if (s !== 0)
    for (const f of [n, i]) {
      const c = (f - e[0]) / s;
      if (c > 0) {
        const u = e[1] + c * a;
        u >= o && u <= r && l.push({ t: c, x: f, y: u });
      }
    }
  if (a !== 0)
    for (const f of [o, r]) {
      const c = (f - e[1]) / a;
      if (c > 0) {
        const u = e[0] + c * s;
        u >= n && u <= i && l.push({ t: c, x: u, y: f });
      }
    }
  if (l.length === 0) return null;
  l.sort((f, c) => f.t - c.t);
  const h = l[0];
  return [h.x, h.y];
}
function On(e, t, n) {
  const i = e.length, o = new Array(i).fill(1);
  for (const r of t)
    for (let s = 0; s < i; s++) {
      const a = (s + 1) % i, l = We([e[s].bakw, e[a].bakw]), h = We([n.bakw, r.bakw]), f = Bi(l, h);
      if (f.features.length > 0 && f.features[0].geometry) {
        const c = f.features[0], u = Math.sqrt(
          Math.pow(r.bakw[0] - n.bakw[0], 2) + Math.pow(r.bakw[1] - n.bakw[1], 2)
        ), d = Math.sqrt(
          Math.pow(c.geometry.coordinates[0] - n.bakw[0], 2) + Math.pow(c.geometry.coordinates[1] - n.bakw[1], 2)
        ), b = u / d;
        b > o[s] && (o[s] = b), b > o[a] && (o[a] = b);
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
function Kn(e, t, n) {
  const { convexBuf: i, centroid: o, allGcps: r, minx: s, maxx: a, miny: l, maxy: h } = e, f = Pr(i, o, t), u = [
    [s, l],
    [a, l],
    [a, h],
    [s, h]
  ].map((g) => ({
    forw: g,
    bakw: Nr(
      g,
      o,
      f[Or(g, o.forw)]
    )
  }));
  if (u.sort(
    (g, E) => Math.atan2(g.forw[0] - o.forw[0], g.forw[1] - o.forw[1]) - Math.atan2(E.forw[0] - o.forw[0], E.forw[1] - o.forw[1])
  ), On(u, r, o), !n) return u;
  const d = 4, b = u.map(
    (g) => Math.atan2(g.forw[0] - o.forw[0], g.forw[1] - o.forw[1])
  ), w = u.map(
    (g) => Math.atan2(
      g.bakw[0] - o.bakw[0],
      -(g.bakw[1] - o.bakw[1])
    )
  );
  function P(g) {
    for (let E = 0; E < d; E++) {
      const S = (E + 1) % d, k = b[E], O = E < d - 1 ? b[S] : b[S] + 2 * Math.PI;
      let N = g;
      for (; N < k; ) N += 2 * Math.PI;
      for (; N >= k + 2 * Math.PI; ) N -= 2 * Math.PI;
      if (N >= k && N < O)
        return { i: E, j: S, frac: (N - k) / (O - k) };
    }
    return { i: 0, j: 1, frac: 0 };
  }
  function M(g) {
    const { i: E, j: S, frac: k } = P(g), O = w[E];
    let X = w[S] - O;
    for (; X > Math.PI; ) X -= 2 * Math.PI;
    for (; X < -Math.PI; ) X += 2 * Math.PI;
    return O + k * X;
  }
  const p = new Set(
    u.map(
      (g) => Math.floor(In(g.forw, o.forw) / 10) % 36
    )
  ), _ = r.map((g) => ({
    forw: g.forw,
    bakw: g.bakw,
    angleDeg: In(g.forw, o.forw),
    forwDist: Math.hypot(g.forw[0] - o.forw[0], g.forw[1] - o.forw[1])
  })), m = [];
  for (let g = 0; g < 36; g++) {
    if (p.has(g)) continue;
    const E = g * 10, S = _.filter(
      (I) => I.angleDeg >= E && I.angleDeg < E + 10
    );
    let k = null;
    if (S.length > 0) {
      const I = S.reduce((A, T) => T.forwDist > A.forwDist ? T : A);
      k = Pn(o.forw, I.forw, s, a, l, h);
    }
    if (!k) {
      const I = (E + 5) % 360 * (Math.PI / 180), A = [
        o.forw[0] + Math.sin(I),
        o.forw[1] + Math.cos(I)
      ];
      k = Pn(o.forw, A, s, a, l, h);
    }
    if (!k) continue;
    const O = [k[0] - o.forw[0], k[1] - o.forw[1]], N = Math.atan2(O[0], O[1]), X = M(N), F = [
      o.bakw[0] + Math.sin(X),
      o.bakw[1] - Math.cos(X)
    ], y = Tr(o.bakw, F, u);
    y && m.push({ forw: k, bakw: y });
  }
  const v = [...u, ...m];
  return v.sort(
    (g, E) => Math.atan2(g.forw[0] - o.forw[0], g.forw[1] - o.forw[1]) - Math.atan2(E.forw[0] - o.forw[0], E.forw[1] - o.forw[1])
  ), On(v, r, o), v;
}
function Xr(e, t = !1) {
  return Kn(e, "plain", t);
}
function Cr(e, t = !1) {
  return Kn(e, "birdeye", t);
}
function po(e) {
  return Qn(e, 1 / 0);
}
const Nn = 1e5;
function Qn(e, t) {
  Dr(e);
  const i = new $r(e).findSegmentIntersections(t), o = no(i), r = /* @__PURE__ */ new Map();
  return o.forEach((s) => {
    r.set(`${s.x}:${s.y}`, s);
  }), Array.from(r.values()).map(
    (s) => Rt([s.x, s.y])
  );
}
function Dr(e) {
  for (let t = 0, n = e.length; t < n; t++) {
    const i = e[t];
    ae(i) || qt(
      "findIntersections() received invalid coordinates:",
      `line=${t}`,
      `points=${i}`
    );
    for (let o = 0, r = i.length; o < r; o++) {
      const s = i[o];
      (!ae(s) || !Number.isFinite(s[0]) || !Number.isFinite(s[1])) && qt(
        "findIntersections() received non-finite coordinates:",
        `line=${t}`,
        `point=${o}`,
        `coordinates=${JSON.stringify(s)}`
      );
    }
  }
}
class $r {
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
    (r != this._xx.length || this._xx.length != this._yy.length) && qt("ArcCollection#initXYData() Counting error"), this.initBounds(), this._arcIter = new io(this._xx, this._yy);
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
    let a = 0, l, h, f;
    for (let c = 0; c < o; c++)
      l = i[c], l > 0 && (h = c * 4, f = ro(t, n, a, l), r[h++] = f[0], r[h++] = f[1], r[h++] = f[2], r[h] = f[3], a += l, s.mergeBounds(f));
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
    let l = i ? this._ii[o] : this._ii[o] + s - 1, h = l, f = 0;
    for (let c = 1; c < s; c++)
      h += a, (r === 0 || this._zz[h] >= r) && (n(l, h, this._xx, this._yy), l = h, f++);
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
   * @returns 検出された交差点の配列
   */
  findSegmentIntersections(t = 1 / 0) {
    const n = this.getBounds(), i = n.ymin || 0, o = (n.ymax || 0) - i, r = this.calcSegmentIntersectionStripeCount(), s = new Uint32Array(r), a = r > 1 ? (p) => Math.floor((r - 1) * (p - i) / o) : () => 0, l = r + 1;
    let h, f;
    this.forEachSegment(
      (p, _, m, v) => {
        let g = a(v[p]);
        const E = a(v[_]);
        let S = 0;
        for (; s[g] = s[g] + 2, g != E; )
          S++, S > l && qt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${r}`,
            `s1=${g}`,
            `s2=${E}`
          ), g += E > g ? 1 : -1;
      }
    );
    const c = this.getUint32Array(Rr(s));
    let u = 0;
    const d = [];
    Lr(s, (p) => {
      const _ = u;
      u += p, d.push(c.subarray(_, u));
    }), Vr(s, 0), this.forEachSegment(
      (p, _, m, v) => {
        let g = a(v[p]);
        const E = a(v[_]);
        let S, k, O = 0;
        for (; S = s[g], s[g] = S + 2, k = d[g], k[S] = p, k[S + 1] = _, g != E; )
          O++, O > l && qt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${r}`,
            `s1=${g}`,
            `s2=${E}`
          ), g += E > g ? 1 : -1;
      }
    );
    const b = this.getVertexData(), w = [];
    let P;
    const M = /* @__PURE__ */ new Set();
    for (h = 0; h < r && w.length < t; h++)
      if (b.xx && b.yy)
        for (P = jr(
          d[h],
          b.xx,
          b.yy,
          t - w.length + M.size
        ), f = 0; f < P.length && w.length < t; f++) {
          const p = Zn(P[f]);
          M.has(p) || (M.add(p), w.push(P[f]));
        }
    return w;
  }
}
function qt(...e) {
  const t = e.join(" ");
  throw new Error(t);
}
function ae(e) {
  return e ? Yr(e) ? !0 : Fr(e) ? !1 : e.length === 0 ? !0 : e.length > 0 : !1;
}
function Fr(e) {
  return e != null && e.toString === String.prototype.toString;
}
function Yr(e) {
  return Array.isArray(e);
}
function Rr(e, t) {
  ae(e) || qt("utils.sum() expects an array, received:", e);
  let n = 0, i;
  for (let o = 0, r = e.length; o < r; o++)
    i = e[o], i && (n += i);
  return n;
}
function Lr(e, t, n) {
  if (!ae(e))
    throw new Error(`#forEach() takes an array-like argument. ${e}`);
  for (let i = 0, o = e.length; i < o; i++)
    t.call(n, e[i], i);
}
function Vr(e, t) {
  for (let n = 0, i = e.length; n < i; n++)
    e[n] = t;
  return e;
}
function jr(e, t, n, i = 1 / 0) {
  const o = e.length - 2, r = [];
  let s, a, l, h, f, c, u, d, b, w, P, M, p, _, m, v, g;
  for (Zr(t, e), v = 0; v < o; ) {
    for (s = e[v], a = e[v + 1], f = t[s], c = t[a], b = n[s], w = n[a], g = v; g < o && (g += 2, l = e[g], u = t[l], !(c < u)); ) {
      if (P = n[l], h = e[g + 1], d = t[h], M = n[h], b >= P) {
        if (b > M && w > P && w > M) continue;
      } else if (b < M && w < P && w < M) continue;
      if (!(s == l || s == h || a == l || a == h) && (p = Ur(
        f,
        b,
        c,
        w,
        u,
        P,
        d,
        M
      ), p && (_ = [s, a], m = [l, h], r.push(Tn(p, _, m, t, n)), p.length == 4 && r.push(
        Tn(p.slice(2), _, m, t, n)
      ), r.length >= i)))
        return r;
    }
    v += 2;
  }
  return r;
}
function Ur(e, t, n, i, o, r, s, a) {
  const l = qr(e, t, n, i, o, r, s, a);
  let h = null;
  return l && (h = zr(e, t, n, i, o, r, s, a), h ? Wr(e, t, n, i, o, r, s, a) && (h = null) : h = Hr(e, t, n, i, o, r, s, a)), h;
}
function qr(e, t, n, i, o, r, s, a) {
  return ie(e, t, n, i, o, r) * ie(e, t, n, i, s, a) <= 0 && ie(o, r, s, a, e, t) * ie(o, r, s, a, n, i) <= 0;
}
function ie(e, t, n, i, o, r) {
  return Hn(e - o, t - r, n - o, i - r);
}
function Hn(e, t, n, i) {
  return e * i - t * n;
}
function zr(e, t, n, i, o, r, s, a) {
  let l = xe(e, t, n, i, o, r, s, a), h;
  return l && (h = Jr(l[0], l[1], e, t, n, i, o, r, s, a), h == 1 ? l = xe(n, i, e, t, o, r, s, a) : h == 2 ? l = xe(o, r, s, a, e, t, n, i) : h == 3 && (l = xe(s, a, o, r, e, t, n, i))), l && Qr(l, e, t, n, i, o, r, s, a), l;
}
function xe(e, t, n, i, o, r, s, a) {
  const l = Hn(n - e, i - t, s - o, a - r), h = 1e-18;
  let f;
  if (l === 0) return null;
  const c = ie(o, r, s, a, e, t) / l;
  return l <= h && l >= -h ? f = Gr(e, t, n, i, o, r, s, a) : f = [e + c * (n - e), t + c * (i - t)], f;
}
function Gr(e, t, n, i, o, r, s, a) {
  let l = null;
  return !Nt(e, o, s) && !Nt(t, r, a) ? l = [e, t] : !Nt(n, o, s) && !Nt(i, r, a) ? l = [n, i] : !Nt(o, e, n) && !Nt(r, t, i) ? l = [o, r] : !Nt(s, e, n) && !Nt(a, t, i) && (l = [s, a]), l;
}
function Nt(e, t, n) {
  let i;
  return t < n ? i = e < t || e > n : t > n ? i = e > t || e < n : i = e != t, i;
}
function Jr(e, t, ...n) {
  let i = -1, o = 1 / 0, r;
  for (let s = 0, a = 0, l = n.length; a < l; s++, a += 2)
    r = Kr(e, t, n[a], n[a + 1]), r < o && (o = r, i = s);
  return i;
}
function Kr(e, t, n, i) {
  const o = e - n, r = t - i;
  return o * o + r * r;
}
function Qr(e, t, n, i, o, r, s, a, l) {
  let h = e[0], f = e[1];
  h = _e(h, t, i), h = _e(h, r, a), f = _e(f, n, o), f = _e(f, s, l), e[0] = h, e[1] = f;
}
function _e(e, t, n) {
  let i;
  return Nt(e, t, n) && (i = Math.abs(e - t) < Math.abs(e - n) ? t : n, e = i), e;
}
function Hr(e, t, n, i, o, r, s, a) {
  const l = Math.min(e, n, o, s), h = Math.max(e, n, o, s), f = Math.min(t, i, r, a), c = Math.max(t, i, r, a), u = c - f > h - l;
  let d = [];
  return (u ? Yt(t, f, c) : Yt(e, l, h)) && d.push(e, t), (u ? Yt(i, f, c) : Yt(n, l, h)) && d.push(n, i), (u ? Yt(r, f, c) : Yt(o, l, h)) && d.push(o, r), (u ? Yt(a, f, c) : Yt(s, l, h)) && d.push(s, a), (d.length != 2 && d.length != 4 || d.length == 4 && d[0] == d[2] && d[1] == d[3]) && (d = null), d;
}
function Wr(e, t, n, i, o, r, s, a) {
  return e == o && t == r || e == s && t == a || n == o && i == r || n == s && i == a;
}
function Yt(e, t, n) {
  return e > t && e < n;
}
function Zr(e, t) {
  to(e, t), Wn(e, t, 0, t.length - 2);
}
function to(e, t) {
  for (let n = 0, i = t.length; n < i; n += 2)
    e[t[n]] > e[t[n + 1]] && eo(t, n, n + 1);
}
function eo(e, t, n) {
  const i = e[t];
  e[t] = e[n], e[n] = i;
}
function Wn(e, t, n, i) {
  let o = n, r = i, s, a;
  for (; o < i; ) {
    for (s = e[t[n + i >> 2 << 1]]; o <= r; ) {
      for (; e[t[o]] < s; ) o += 2;
      for (; e[t[r]] > s; ) r -= 2;
      o <= r && (a = t[o], t[o] = t[r], t[r] = a, a = t[o + 1], t[o + 1] = t[r + 1], t[r + 1] = a, o += 2, r -= 2);
    }
    if (r - n < 40 ? Bn(e, t, n, r) : Wn(e, t, n, r), i - o < 40) {
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
function Tn(e, t, n, i, o) {
  const r = e[0], s = e[1];
  t = Xn(r, s, t[0], t[1], i, o), n = Xn(r, s, n[0], n[1], i, o);
  const a = t[0] < n[0] ? t : n, l = a == t ? n : t;
  return { x: r, y: s, a, b: l };
}
function Xn(e, t, n, i, o, r) {
  let s = n < i ? n : i, a = s === n ? i : n;
  return o[s] == e && r[s] == t ? a = s : o[a] == e && r[a] == t && (s = a), [s, a];
}
function no(e) {
  const t = {};
  return e.filter((n) => {
    const i = Zn(n);
    return i in t ? !1 : (t[i] = !0, !0);
  });
}
function Zn(e) {
  return `${e.a.join(",")};${e.b.join(",")}`;
}
class io {
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
function ro(e, t, n, i) {
  let o = n | 0;
  const r = isNaN(i) ? e.length - o : i + o;
  let s, a, l, h, f, c;
  if (r > 0)
    l = f = e[o], h = c = t[o];
  else return [void 0, void 0, void 0, void 0];
  for (o++; o < r; o++)
    s = e[o], a = t[o], s < l && (l = s), s > f && (f = s), a < h && (h = a), a > c && (c = a);
  return [l, h, f, c];
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
    return t instanceof ce ? (i = t.xmin, o = t.ymin, r = t.xmax, s = t.ymax) : n.length == 3 ? (i = t, o = n[0], r = n[1], s = n[2]) : t.length == 4 ? (i = t[0], o = t[1], r = t[2], s = t[3]) : qt("Bounds#mergeBounds() invalid argument:", t), this.xmin === void 0 ? this.setBounds(i, o, r, s) : (i < this.xmin && (this.xmin = i), o < this.ymin && (this.ymin = o), r > this.xmax && (this.xmax = r), s > this.ymax && (this.ymax = s)), this;
  }
}
function Ie(e) {
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
function ti(e, t, n) {
  const i = Ie(t.forw), o = Ie(t.bakw);
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
  const i = Ie(t.forw), o = Ie(t.bakw);
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
function Dn(e, t) {
  const n = e.length, i = t.geometry.coordinates;
  return Array.from({ length: n }, (o, r) => r).map((o) => {
    const r = (o + 1) % n, s = e[o], a = e[r], l = s.geometry.coordinates, h = Math.atan2(
      l[0] - i[0],
      l[1] - i[1]
    ), f = [t, s, a, t].map(
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
    }, u = St([
      le([f], c)
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
function oo(e, t) {
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
const so = 10;
function ao(e, t, n, i, o, r) {
  if (!e && !t) return !1;
  const s = e ? 0 : 1, a = 1 - s, l = n[s], h = n[a];
  if (!l || !h) return !1;
  const f = xt(h.geom);
  let c = !1, u = !1;
  for (let d = 0; d <= 1; d++) {
    const b = i[d];
    if (!b) continue;
    const w = [String(b.prop.index), String(l.prop.index)].sort().join("-"), P = o[w];
    if (!P || P.length < 2) continue;
    const M = P.find(
      (N) => N.bakw !== r[s].bakw
    );
    if (!M) continue;
    const _ = re(M.bakw).find(
      (N) => String(N.prop.index) !== String(b.prop.index) && String(N.prop.index) !== String(l.prop.index)
    );
    if (!_) continue;
    c = !0;
    const m = xt(_.geom), v = xt(b.geom), g = xt(l.geom), E = g[0] - v[0], S = g[1] - v[1], k = E * (f[1] - v[1]) - S * (f[0] - v[0]), O = E * (m[1] - v[1]) - S * (m[0] - v[0]);
    if (k * O > 0) {
      u = !0;
      break;
    }
  }
  return c && !u;
}
function co(e, t, n, i) {
  if (!e && !t) return !1;
  if (n[0] && n[1] && i[0] && i[1]) {
    const o = i.map((f) => xt(f.geom)), r = n.map((f) => xt(f.geom)), s = o[1][0] - o[0][0], a = o[1][1] - o[0][1], l = s * (r[0][1] - o[0][1]) - a * (r[0][0] - o[0][0]), h = s * (r[1][1] - o[0][1]) - a * (r[1][0] - o[0][0]);
    return l * h < 0;
  }
  return !1;
}
function lo(e, t, n, i) {
  const o = oo(n, i), r = /* @__PURE__ */ new Set();
  let s = !1;
  for (let a = 0; a < so; a++) {
    let l = !1;
    for (const h of Object.keys(t)) {
      if (r.has(h)) continue;
      r.add(h);
      const f = t[h];
      if (!f || f.length < 2) continue;
      const c = h.split("-");
      if (c.length !== 2 || o.has(h)) continue;
      const u = re(f[0].bakw), d = re(f[1].bakw), b = re(f[0].forw), w = re(f[1].forw), P = c.map(
        (x) => u.find((B) => `${B.prop.index}` === x) || d.find((B) => `${B.prop.index}` === x)
      ), M = c.map(
        (x) => b.find((B) => `${B.prop.index}` === x) || w.find((B) => `${B.prop.index}` === x)
      );
      if (P.some((x) => !x) || M.some((x) => !x))
        continue;
      const p = [u, d].map(
        (x) => x.find((B) => !c.includes(`${B.prop.index}`))
      ), _ = [b, w].map(
        (x) => x.find((B) => !c.includes(`${B.prop.index}`))
      );
      if (p.some((x) => !x) || _.some((x) => !x))
        continue;
      const m = f[0].bakw.geometry.coordinates[0].slice(0, 3).map((x) => xt(x)), v = f[1].bakw.geometry.coordinates[0].slice(0, 3).map((x) => xt(x)), g = f[0].forw.geometry.coordinates[0].slice(0, 3).map((x) => xt(x)), E = f[1].forw.geometry.coordinates[0].slice(0, 3).map((x) => xt(x)), S = Ee(m), k = Ee(v), O = Ee(g), N = Ee(E), X = ao(
        S,
        k,
        p,
        P,
        t,
        f
      ), F = co(
        O,
        N,
        p,
        P
      );
      if (!(X || F || $n(
        xt(p[0].geom),
        v
      ) || $n(
        xt(p[1].geom),
        m
      )))
        continue;
      const I = M.map(
        (x) => xt(x.geom)
      ), A = _.map(
        (x) => xt(x.geom)
      ), T = ho([
        ...I,
        ...A
      ]), C = fo(T), $ = Fn(
        I[0],
        I[1],
        A[0]
      ) + Fn(
        I[0],
        I[1],
        A[1]
      );
      ze(C, $) && (Cn(t, f[0], e), Cn(t, f[1], e), P.forEach((x) => {
        if (!x) return;
        const B = [
          x.geom,
          p[0].geom,
          p[1].geom,
          x.geom
        ], D = {
          a: x.prop,
          b: p[0].prop,
          c: p[1].prop
        }, Y = le([B], D), L = Gn(Y);
        ti(t, {
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
function $n(e, t) {
  const [n, i] = t[0], [o, r] = t[1], [s, a] = t[2], l = s - n, h = a - i, f = o - n, c = r - i, u = e[0] - n, d = e[1] - i, b = l * l + h * h, w = l * f + h * c, P = l * u + h * d, M = f * f + c * c, p = f * u + c * d, _ = b * M - w * w;
  if (_ === 0) return !1;
  const m = 1 / _, v = (M * P - w * p) * m, g = (b * p - w * P) * m, E = 1e-9;
  return v >= -E && g >= -E && v + g <= 1 + E;
}
function ho(e) {
  const t = e.map((s) => s.slice()).filter(
    (s, a, l) => l.findIndex(
      (h) => ze(h[0], s[0]) && ze(h[1], s[1])
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
function fo(e) {
  if (e.length < 3) return 0;
  let t = 0;
  for (let n = 0; n < e.length; n++) {
    const [i, o] = e[n], [r, s] = e[(n + 1) % e.length];
    t += i * s - r * o;
  }
  return Math.abs(t) / 2;
}
function Fn(e, t, n) {
  return Math.abs(
    (e[0] * (t[1] - n[1]) + t[0] * (n[1] - e[1]) + n[0] * (e[1] - t[1])) / 2
  );
}
function ze(e, t, n = 1e-9) {
  return Math.abs(e - t) <= n;
}
const Yn = 2.00704, Rn = 3.00001;
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
    return this.useV2Algorithm ? Yn : Rn;
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
    t.version = this.useV2Algorithm ? Yn : Rn, t.points = this.points, t.weight_buffer = {}, t.centroid_point = [
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
   * @param kinkLimit - forw / bakw それぞれで数え上げる交差（kinks）の件数の上限。
   *   届いた時点で数え上げをやめ、strict_status は error になります
   */
  calculateStrictTin(t = Nn) {
    const n = this.tins.forw.features.map(
      (s) => Gn(s)
    );
    this.tins.bakw = St(n);
    const i = {};
    this.tins.forw.features.forEach((s, a) => {
      const l = this.tins.bakw.features[a];
      ti(i, { forw: s, bakw: l });
    });
    const o = (this.pointsSet?.forw.features ?? []).map(
      (s) => s.properties.target.index
    );
    lo(
      this.tins,
      i,
      this.pointsSet?.edges || [],
      o
    );
    const r = ["forw", "bakw"].map((s) => {
      const a = this.tins[s].features.map(
        (l) => l.geometry.coordinates[0]
      );
      return Qn(a, t);
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
      if (uo(r, this.points.length, o), s.length === 0 && a.length === 0) {
        n.push(r);
        continue;
      }
      s.unshift(this.points[r[0]][0]), s.push(this.points[r[1]][0]), a.unshift(this.points[r[0]][1]), a.push(this.points[r[1]][1]);
      const l = [s, a].map((h) => {
        const f = h.map((u, d, b) => {
          if (d === 0) return 0;
          const w = b[d - 1];
          return Math.sqrt(
            Math.pow(u[0] - w[0], 2) + Math.pow(u[1] - w[1], 2)
          );
        }), c = f.reduce((u, d, b) => b === 0 ? [0] : (u.push(u[b - 1] + d), u), []);
        return c.map((u, d, b) => {
          const w = u / b[b.length - 1];
          return [h[d], f[d], c[d], w];
        });
      });
      l.map((h, f) => {
        const c = l[f ? 0 : 1];
        return h.filter((u, d) => !(d === 0 || d === h.length - 1 || u[4] === "handled")).flatMap((u) => {
          const d = u[0], b = u[3], w = c.reduce(
            (P, M, p, _) => {
              if (P) return P;
              const m = _[p + 1];
              if (M[3] === b)
                return M[4] = "handled", [M];
              if (M[3] < b && m && m[3] > b)
                return [M, m];
            },
            void 0
          );
          if (w && w.length === 1)
            return f === 0 ? [[d, w[0][0], b]] : [[w[0][0], d, b]];
          if (w && w.length === 2) {
            const P = w[0], M = w[1], p = (b - P[3]) / (M[3] - P[3]), _ = [
              (M[0][0] - P[0][0]) * p + P[0][0],
              (M[0][1] - P[0][1]) * p + P[0][1]
            ];
            return f === 0 ? [[d, _, b]] : [[_, d, b]];
          }
          return [];
        });
      }).reduce((h, f) => h.concat(f), []).sort((h, f) => h[2] < f[2] ? -1 : 1).map((h, f, c) => {
        this.edgeNodes[i] = [
          h[0],
          h[1]
        ];
        const u = Me(
          h[0],
          h[1],
          `e${i}`
        );
        i++, t.forw.push(u), t.bakw.push(Se(u)), f === 0 ? n.push([r[0], t.forw.length - 1]) : n.push([
          t.forw.length - 2,
          t.forw.length - 1
        ]), f === c.length - 1 && n.push([t.forw.length - 1, r[1]]);
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
    if (!this.points.reduce((l, h) => l && (r ? $e(h[0], r) : h[0][0] >= t && h[0][0] <= n && h[0][1] >= i && h[0][1] <= o), !0))
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
          (O) => $e(O[0], S)
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
    ), f = be(
      l.bakw,
      i.edges,
      "target"
    );
    if (h.features.length === 0 || f.features.length === 0)
      throw "TOO LINEAR1";
    const c = Ci(l.forw), u = gn(l.forw);
    if (!u) throw "TOO LINEAR2";
    const d = {}, b = u.geometry.coordinates[0];
    let w;
    try {
      w = b.map((S) => ({
        forw: S,
        bakw: ne(Rt(S), h)
      })), w.forEach((S) => {
        d[`${S.forw[0]}:${S.forw[1]}`] = S;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const P = gn(l.bakw);
    if (!P) throw "TOO LINEAR2";
    const M = P.geometry.coordinates[0];
    try {
      w = M.map((S) => ({
        bakw: S,
        forw: ne(Rt(S), f)
      })), w.forEach((S) => {
        d[`${S.forw[0]}:${S.forw[1]}`] = S;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    let p;
    if (n) {
      const S = c.geometry.coordinates, k = h.features.find(
        (O) => $e(
          Rt(S),
          O
        )
      );
      if (k) {
        const O = k.geometry.coordinates[0], N = k.properties.a.geom, X = k.properties.b.geom, F = k.properties.c.geom;
        p = {
          forw: [
            (O[0][0] + O[1][0] + O[2][0]) / 3,
            (O[0][1] + O[1][1] + O[2][1]) / 3
          ],
          bakw: [
            (N[0] + X[0] + F[0]) / 3,
            (N[1] + X[1] + F[1]) / 3
          ]
        };
      } else
        p = {
          forw: S,
          bakw: ne(c, h)
        };
    } else
      p = {
        forw: c.geometry.coordinates,
        bakw: ne(c, h)
      };
    const _ = Me(p.forw, p.bakw, "c");
    this.centroid = {
      forw: _,
      bakw: Se(_)
    };
    const m = [
      ...this.points.map((S) => ({ forw: S[0], bakw: S[1] })),
      ...(this.edgeNodes ?? []).map((S) => ({ forw: S[0], bakw: S[1] }))
    ], v = {
      convexBuf: d,
      centroid: p,
      allGcps: m,
      minx: o,
      maxx: r,
      miny: s,
      maxy: a
    }, g = this.vertexMode === lt.VERTEX_BIRDEYE ? Cr(v, n) : Xr(v, n), E = {
      forw: [],
      bakw: []
    };
    for (let S = 0; S < g.length; S++) {
      const k = g[S].forw, O = g[S].bakw, N = Me(k, O, `b${S}`), X = Se(N);
      i.forw.push(N), i.bakw.push(X), E.forw.push(N), E.bakw.push(X);
    }
    this.pointsSet = {
      forw: St(i.forw),
      bakw: St(i.bakw),
      edges: i.edges
    }, this.tins = {
      forw: Mn(
        be(
          this.pointsSet.forw,
          i.edges,
          "target"
        )
      )
    }, (t === lt.MODE_STRICT || t === lt.MODE_AUTO) && this.calculateStrictTin(
      t === lt.MODE_AUTO ? 1 : Nn
    ), (t === lt.MODE_LOOSE || t === lt.MODE_AUTO && this.strict_status === lt.STATUS_ERROR) && (this.tins.bakw = Mn(
      be(
        this.pointsSet.bakw,
        i.edges,
        "target"
      )
    ), delete this.kinks, this.strict_status = lt.STATUS_LOOSE), this.vertices_params = {
      forw: Dn(E.forw, this.centroid.forw),
      bakw: Dn(E.bakw, this.centroid.bakw)
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
function uo(e, t, n) {
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
  po as findIntersections,
  Yn as format_version,
  ti as insertSearchIndex,
  Dn as vertexCalc
};
