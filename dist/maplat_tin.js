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
function Et(e, t = {}) {
  const n = { type: "FeatureCollection" };
  return t.id && (n.id = t.id), t.bbox && (n.bbox = t.bbox), n.features = e, n;
}
function We(e) {
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
function ze(e, t, n) {
  if (e !== null)
    for (var i, o, r, s, a, l, f, h = 0, c = 0, u, d = e.type, _ = d === "FeatureCollection", w = d === "Feature", O = _ ? e.features.length : 1, M = 0; M < O; M++) {
      f = _ ? (
        // @ts-expect-error: Known type conflict
        e.features[M].geometry
      ) : w ? (
        // @ts-expect-error: Known type conflict
        e.geometry
      ) : e, u = f ? f.type === "GeometryCollection" : !1, a = u ? f.geometries.length : 1;
      for (var m = 0; m < a; m++) {
        var v = 0, p = 0;
        if (s = u ? f.geometries[m] : f, s !== null) {
          l = s.coordinates;
          var b = s.type;
          switch (h = n && (b === "Polygon" || b === "MultiPolygon") ? 1 : 0, b) {
            case null:
              break;
            case "Point":
              if (
                // @ts-expect-error: Known type conflict
                t(
                  l,
                  c,
                  M,
                  v,
                  p
                ) === !1
              )
                return !1;
              c++, v++;
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
                    v,
                    p
                  ) === !1
                )
                  return !1;
                c++, b === "MultiPoint" && v++;
              }
              b === "LineString" && v++;
              break;
            case "Polygon":
            case "MultiLineString":
              for (i = 0; i < l.length; i++) {
                for (o = 0; o < l[i].length - h; o++) {
                  if (
                    // @ts-expect-error: Known type conflict
                    t(
                      l[i][o],
                      c,
                      M,
                      v,
                      p
                    ) === !1
                  )
                    return !1;
                  c++;
                }
                b === "MultiLineString" && v++, b === "Polygon" && p++;
              }
              b === "Polygon" && v++;
              break;
            case "MultiPolygon":
              for (i = 0; i < l.length; i++) {
                for (p = 0, o = 0; o < l[i].length; o++) {
                  for (r = 0; r < l[i][o].length - h; r++) {
                    if (
                      // @ts-expect-error: Known type conflict
                      t(
                        l[i][o][r],
                        c,
                        M,
                        v,
                        p
                      ) === !1
                    )
                      return !1;
                    c++;
                  }
                  p++;
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
const pt = 11102230246251565e-32, q = 134217729, Ln = (3 + 8 * pt) * pt;
function ht(e, t, n, i, o) {
  let r, s, a, l, f = t[0], h = i[0], c = 0, u = 0;
  h > f == h > -f ? (r = f, f = t[++c]) : (r = h, h = i[++u]);
  let d = 0;
  if (c < e && u < n)
    for (h > f == h > -f ? (s = f + r, a = r - (s - f), f = t[++c]) : (s = h + r, a = r - (s - h), h = i[++u]), r = s, a !== 0 && (o[d++] = a); c < e && u < n; )
      h > f == h > -f ? (s = r + f, l = s - r, a = r - (s - l) + (f - l), f = t[++c]) : (s = r + h, l = s - r, a = r - (s - l) + (h - l), h = i[++u]), r = s, a !== 0 && (o[d++] = a);
  for (; c < e; )
    s = r + f, l = s - r, a = r - (s - l) + (f - l), f = t[++c], r = s, a !== 0 && (o[d++] = a);
  for (; u < n; )
    s = r + h, l = s - r, a = r - (s - l) + (h - l), h = i[++u], r = s, a !== 0 && (o[d++] = a);
  return (r !== 0 || d === 0) && (o[d++] = r), d;
}
function Mt(e, t, n, i, o, r, s, a) {
  return ht(ht(e, t, n, i, s), s, o, r, a);
}
function R(e, t, n, i) {
  let o, r, s, a, l, f, h, c, u, d, _;
  h = q * n, d = h - (h - n), _ = n - d;
  let w = t[0];
  o = w * n, h = q * w, c = h - (h - w), u = w - c, s = u * _ - (o - c * d - u * d - c * _);
  let O = 0;
  s !== 0 && (i[O++] = s);
  for (let M = 1; M < e; M++)
    w = t[M], a = w * n, h = q * w, c = h - (h - w), u = w - c, l = u * _ - (a - c * d - u * d - c * _), r = o + l, f = r - o, s = o - (r - f) + (l - f), s !== 0 && (i[O++] = s), o = a + r, s = r - (o - a), s !== 0 && (i[O++] = s);
  return (o !== 0 || O === 0) && (i[O++] = o), O;
}
function Vn(e, t) {
  let n = t[0];
  for (let i = 1; i < e; i++) n += t[i];
  return n;
}
function tt(e) {
  return new Float64Array(e);
}
const ai = (3 + 16 * pt) * pt, ci = (2 + 12 * pt) * pt, li = (9 + 64 * pt) * pt * pt, zt = tt(4), Ze = tt(8), tn = tt(12), en = tt(16), mt = tt(4);
function fi(e, t, n, i, o, r, s) {
  let a, l, f, h, c, u, d, _, w, O, M, m, v, p, b, g, E, S;
  const k = e - o, P = n - o, N = t - r, C = i - r;
  p = k * C, u = q * k, d = u - (u - k), _ = k - d, u = q * C, w = u - (u - C), O = C - w, b = _ * O - (p - d * w - _ * w - d * O), g = N * P, u = q * N, d = u - (u - N), _ = N - d, u = q * P, w = u - (u - P), O = P - w, E = _ * O - (g - d * w - _ * w - d * O), M = b - E, c = b - M, zt[0] = b - (M + c) + (c - E), m = p + M, c = m - p, v = p - (m - c) + (M - c), M = v - g, c = v - M, zt[1] = v - (M + c) + (c - g), S = m + M, c = S - m, zt[2] = m - (S - c) + (M - c), zt[3] = S;
  let F = Vn(4, zt), y = ci * s;
  if (F >= y || -F >= y || (c = e - k, a = e - (k + c) + (c - o), c = n - P, f = n - (P + c) + (c - o), c = t - N, l = t - (N + c) + (c - r), c = i - C, h = i - (C + c) + (c - r), a === 0 && l === 0 && f === 0 && h === 0) || (y = li * s + Ln * Math.abs(F), F += k * h + C * a - (N * f + P * l), F >= y || -F >= y)) return F;
  p = a * C, u = q * a, d = u - (u - a), _ = a - d, u = q * C, w = u - (u - C), O = C - w, b = _ * O - (p - d * w - _ * w - d * O), g = l * P, u = q * l, d = u - (u - l), _ = l - d, u = q * P, w = u - (u - P), O = P - w, E = _ * O - (g - d * w - _ * w - d * O), M = b - E, c = b - M, mt[0] = b - (M + c) + (c - E), m = p + M, c = m - p, v = p - (m - c) + (M - c), M = v - g, c = v - M, mt[1] = v - (M + c) + (c - g), S = m + M, c = S - m, mt[2] = m - (S - c) + (M - c), mt[3] = S;
  const I = ht(4, zt, 4, mt, Ze);
  p = k * h, u = q * k, d = u - (u - k), _ = k - d, u = q * h, w = u - (u - h), O = h - w, b = _ * O - (p - d * w - _ * w - d * O), g = N * f, u = q * N, d = u - (u - N), _ = N - d, u = q * f, w = u - (u - f), O = f - w, E = _ * O - (g - d * w - _ * w - d * O), M = b - E, c = b - M, mt[0] = b - (M + c) + (c - E), m = p + M, c = m - p, v = p - (m - c) + (M - c), M = v - g, c = v - M, mt[1] = v - (M + c) + (c - g), S = m + M, c = S - m, mt[2] = m - (S - c) + (M - c), mt[3] = S;
  const A = ht(I, Ze, 4, mt, tn);
  p = a * h, u = q * a, d = u - (u - a), _ = a - d, u = q * h, w = u - (u - h), O = h - w, b = _ * O - (p - d * w - _ * w - d * O), g = l * f, u = q * l, d = u - (u - l), _ = l - d, u = q * f, w = u - (u - f), O = f - w, E = _ * O - (g - d * w - _ * w - d * O), M = b - E, c = b - M, mt[0] = b - (M + c) + (c - E), m = p + M, c = m - p, v = p - (m - c) + (M - c), M = v - g, c = v - M, mt[1] = v - (M + c) + (c - g), S = m + M, c = S - m, mt[2] = m - (S - c) + (M - c), mt[3] = S;
  const T = ht(A, tn, 4, mt, en);
  return en[T - 1];
}
function Ot(e, t, n, i, o, r) {
  const s = (t - r) * (n - o), a = (e - o) * (i - r), l = s - a, f = Math.abs(s + a);
  return Math.abs(l) >= ai * f ? l : -fi(e, t, n, i, o, r, f);
}
const hi = (10 + 96 * pt) * pt, ui = (4 + 48 * pt) * pt, di = (44 + 576 * pt) * pt * pt, Xt = tt(4), $t = tt(4), Dt = tt(4), kt = tt(4), At = tt(4), It = tt(4), gt = tt(4), wt = tt(4), Oe = tt(8), Pe = tt(8), Ne = tt(8), Be = tt(8), Te = tt(8), Ce = tt(8), ue = tt(8), de = tt(8), pe = tt(8), Lt = tt(4), Vt = tt(4), Ut = tt(4), z = tt(8), K = tt(16), nt = tt(16), it = tt(16), et = tt(32), Ft = tt(32), at = tt(48), bt = tt(64);
let Qt = tt(1152), Xe = tt(1152);
function ct(e, t, n) {
  e = ht(e, Qt, t, n, Xe);
  const i = Qt;
  return Qt = Xe, Xe = i, e;
}
function pi(e, t, n, i, o, r, s, a, l) {
  let f, h, c, u, d, _, w, O, M, m, v, p, b, g, E, S, k, P, N, C, F, y, I, A, T, X, D, x, B, $, Y, L, V, j, U;
  const G = e - s, J = n - s, Q = o - s, H = t - a, Z = i - a, W = r - a;
  Y = J * W, I = q * J, A = I - (I - J), T = J - A, I = q * W, X = I - (I - W), D = W - X, L = T * D - (Y - A * X - T * X - A * D), V = Q * Z, I = q * Q, A = I - (I - Q), T = Q - A, I = q * Z, X = I - (I - Z), D = Z - X, j = T * D - (V - A * X - T * X - A * D), x = L - j, y = L - x, Xt[0] = L - (x + y) + (y - j), B = Y + x, y = B - Y, $ = Y - (B - y) + (x - y), x = $ - V, y = $ - x, Xt[1] = $ - (x + y) + (y - V), U = B + x, y = U - B, Xt[2] = B - (U - y) + (x - y), Xt[3] = U, Y = Q * H, I = q * Q, A = I - (I - Q), T = Q - A, I = q * H, X = I - (I - H), D = H - X, L = T * D - (Y - A * X - T * X - A * D), V = G * W, I = q * G, A = I - (I - G), T = G - A, I = q * W, X = I - (I - W), D = W - X, j = T * D - (V - A * X - T * X - A * D), x = L - j, y = L - x, $t[0] = L - (x + y) + (y - j), B = Y + x, y = B - Y, $ = Y - (B - y) + (x - y), x = $ - V, y = $ - x, $t[1] = $ - (x + y) + (y - V), U = B + x, y = U - B, $t[2] = B - (U - y) + (x - y), $t[3] = U, Y = G * Z, I = q * G, A = I - (I - G), T = G - A, I = q * Z, X = I - (I - Z), D = Z - X, L = T * D - (Y - A * X - T * X - A * D), V = J * H, I = q * J, A = I - (I - J), T = J - A, I = q * H, X = I - (I - H), D = H - X, j = T * D - (V - A * X - T * X - A * D), x = L - j, y = L - x, Dt[0] = L - (x + y) + (y - j), B = Y + x, y = B - Y, $ = Y - (B - y) + (x - y), x = $ - V, y = $ - x, Dt[1] = $ - (x + y) + (y - V), U = B + x, y = U - B, Dt[2] = B - (U - y) + (x - y), Dt[3] = U, f = ht(
    ht(
      ht(
        R(R(4, Xt, G, z), z, G, K),
        K,
        R(R(4, Xt, H, z), z, H, nt),
        nt,
        et
      ),
      et,
      ht(
        R(R(4, $t, J, z), z, J, K),
        K,
        R(R(4, $t, Z, z), z, Z, nt),
        nt,
        Ft
      ),
      Ft,
      bt
    ),
    bt,
    ht(
      R(R(4, Dt, Q, z), z, Q, K),
      K,
      R(R(4, Dt, W, z), z, W, nt),
      nt,
      et
    ),
    et,
    Qt
  );
  let st = Vn(f, Qt), ft = ui * l;
  if (st >= ft || -st >= ft || (y = e - G, h = e - (G + y) + (y - s), y = t - H, d = t - (H + y) + (y - a), y = n - J, c = n - (J + y) + (y - s), y = i - Z, _ = i - (Z + y) + (y - a), y = o - Q, u = o - (Q + y) + (y - s), y = r - W, w = r - (W + y) + (y - a), h === 0 && c === 0 && u === 0 && d === 0 && _ === 0 && w === 0) || (ft = di * l + Ln * Math.abs(st), st += (G * G + H * H) * (J * w + W * c - (Z * u + Q * _)) + 2 * (G * h + H * d) * (J * W - Z * Q) + ((J * J + Z * Z) * (Q * d + H * u - (W * h + G * w)) + 2 * (J * c + Z * _) * (Q * H - W * G)) + ((Q * Q + W * W) * (G * _ + Z * h - (H * c + J * d)) + 2 * (Q * u + W * w) * (G * Z - H * J)), st >= ft || -st >= ft))
    return st;
  if ((c !== 0 || _ !== 0 || u !== 0 || w !== 0) && (Y = G * G, I = q * G, A = I - (I - G), T = G - A, L = T * T - (Y - A * A - (A + A) * T), V = H * H, I = q * H, A = I - (I - H), T = H - A, j = T * T - (V - A * A - (A + A) * T), x = L + j, y = x - L, kt[0] = L - (x - y) + (j - y), B = Y + x, y = B - Y, $ = Y - (B - y) + (x - y), x = $ + V, y = x - $, kt[1] = $ - (x - y) + (V - y), U = B + x, y = U - B, kt[2] = B - (U - y) + (x - y), kt[3] = U), (u !== 0 || w !== 0 || h !== 0 || d !== 0) && (Y = J * J, I = q * J, A = I - (I - J), T = J - A, L = T * T - (Y - A * A - (A + A) * T), V = Z * Z, I = q * Z, A = I - (I - Z), T = Z - A, j = T * T - (V - A * A - (A + A) * T), x = L + j, y = x - L, At[0] = L - (x - y) + (j - y), B = Y + x, y = B - Y, $ = Y - (B - y) + (x - y), x = $ + V, y = x - $, At[1] = $ - (x - y) + (V - y), U = B + x, y = U - B, At[2] = B - (U - y) + (x - y), At[3] = U), (h !== 0 || d !== 0 || c !== 0 || _ !== 0) && (Y = Q * Q, I = q * Q, A = I - (I - Q), T = Q - A, L = T * T - (Y - A * A - (A + A) * T), V = W * W, I = q * W, A = I - (I - W), T = W - A, j = T * T - (V - A * A - (A + A) * T), x = L + j, y = x - L, It[0] = L - (x - y) + (j - y), B = Y + x, y = B - Y, $ = Y - (B - y) + (x - y), x = $ + V, y = x - $, It[1] = $ - (x - y) + (V - y), U = B + x, y = U - B, It[2] = B - (U - y) + (x - y), It[3] = U), h !== 0 && (O = R(4, Xt, h, Oe), f = ct(f, Mt(
    R(O, Oe, 2 * G, K),
    K,
    R(R(4, It, h, z), z, Z, nt),
    nt,
    R(R(4, At, h, z), z, -W, it),
    it,
    et,
    at
  ), at)), d !== 0 && (M = R(4, Xt, d, Pe), f = ct(f, Mt(
    R(M, Pe, 2 * H, K),
    K,
    R(R(4, At, d, z), z, Q, nt),
    nt,
    R(R(4, It, d, z), z, -J, it),
    it,
    et,
    at
  ), at)), c !== 0 && (m = R(4, $t, c, Ne), f = ct(f, Mt(
    R(m, Ne, 2 * J, K),
    K,
    R(R(4, kt, c, z), z, W, nt),
    nt,
    R(R(4, It, c, z), z, -H, it),
    it,
    et,
    at
  ), at)), _ !== 0 && (v = R(4, $t, _, Be), f = ct(f, Mt(
    R(v, Be, 2 * Z, K),
    K,
    R(R(4, It, _, z), z, G, nt),
    nt,
    R(R(4, kt, _, z), z, -Q, it),
    it,
    et,
    at
  ), at)), u !== 0 && (p = R(4, Dt, u, Te), f = ct(f, Mt(
    R(p, Te, 2 * Q, K),
    K,
    R(R(4, At, u, z), z, H, nt),
    nt,
    R(R(4, kt, u, z), z, -Z, it),
    it,
    et,
    at
  ), at)), w !== 0 && (b = R(4, Dt, w, Ce), f = ct(f, Mt(
    R(b, Ce, 2 * W, K),
    K,
    R(R(4, kt, w, z), z, J, nt),
    nt,
    R(R(4, At, w, z), z, -G, it),
    it,
    et,
    at
  ), at)), h !== 0 || d !== 0) {
    if (c !== 0 || _ !== 0 || u !== 0 || w !== 0 ? (Y = c * W, I = q * c, A = I - (I - c), T = c - A, I = q * W, X = I - (I - W), D = W - X, L = T * D - (Y - A * X - T * X - A * D), V = J * w, I = q * J, A = I - (I - J), T = J - A, I = q * w, X = I - (I - w), D = w - X, j = T * D - (V - A * X - T * X - A * D), x = L + j, y = x - L, gt[0] = L - (x - y) + (j - y), B = Y + x, y = B - Y, $ = Y - (B - y) + (x - y), x = $ + V, y = x - $, gt[1] = $ - (x - y) + (V - y), U = B + x, y = U - B, gt[2] = B - (U - y) + (x - y), gt[3] = U, Y = u * -Z, I = q * u, A = I - (I - u), T = u - A, I = q * -Z, X = I - (I - -Z), D = -Z - X, L = T * D - (Y - A * X - T * X - A * D), V = Q * -_, I = q * Q, A = I - (I - Q), T = Q - A, I = q * -_, X = I - (I - -_), D = -_ - X, j = T * D - (V - A * X - T * X - A * D), x = L + j, y = x - L, wt[0] = L - (x - y) + (j - y), B = Y + x, y = B - Y, $ = Y - (B - y) + (x - y), x = $ + V, y = x - $, wt[1] = $ - (x - y) + (V - y), U = B + x, y = U - B, wt[2] = B - (U - y) + (x - y), wt[3] = U, E = ht(4, gt, 4, wt, de), Y = c * w, I = q * c, A = I - (I - c), T = c - A, I = q * w, X = I - (I - w), D = w - X, L = T * D - (Y - A * X - T * X - A * D), V = u * _, I = q * u, A = I - (I - u), T = u - A, I = q * _, X = I - (I - _), D = _ - X, j = T * D - (V - A * X - T * X - A * D), x = L - j, y = L - x, Vt[0] = L - (x + y) + (y - j), B = Y + x, y = B - Y, $ = Y - (B - y) + (x - y), x = $ - V, y = $ - x, Vt[1] = $ - (x + y) + (y - V), U = B + x, y = U - B, Vt[2] = B - (U - y) + (x - y), Vt[3] = U, P = 4) : (de[0] = 0, E = 1, Vt[0] = 0, P = 1), h !== 0) {
      const rt = R(E, de, h, it);
      f = ct(f, ht(
        R(O, Oe, h, K),
        K,
        R(rt, it, 2 * G, et),
        et,
        at
      ), at);
      const ot = R(P, Vt, h, z);
      f = ct(f, Mt(
        R(ot, z, 2 * G, K),
        K,
        R(ot, z, h, nt),
        nt,
        R(rt, it, h, et),
        et,
        Ft,
        bt
      ), bt), _ !== 0 && (f = ct(f, R(R(4, It, h, z), z, _, K), K)), w !== 0 && (f = ct(f, R(R(4, At, -h, z), z, w, K), K));
    }
    if (d !== 0) {
      const rt = R(E, de, d, it);
      f = ct(f, ht(
        R(M, Pe, d, K),
        K,
        R(rt, it, 2 * H, et),
        et,
        at
      ), at);
      const ot = R(P, Vt, d, z);
      f = ct(f, Mt(
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
  if (c !== 0 || _ !== 0) {
    if (u !== 0 || w !== 0 || h !== 0 || d !== 0 ? (Y = u * H, I = q * u, A = I - (I - u), T = u - A, I = q * H, X = I - (I - H), D = H - X, L = T * D - (Y - A * X - T * X - A * D), V = Q * d, I = q * Q, A = I - (I - Q), T = Q - A, I = q * d, X = I - (I - d), D = d - X, j = T * D - (V - A * X - T * X - A * D), x = L + j, y = x - L, gt[0] = L - (x - y) + (j - y), B = Y + x, y = B - Y, $ = Y - (B - y) + (x - y), x = $ + V, y = x - $, gt[1] = $ - (x - y) + (V - y), U = B + x, y = U - B, gt[2] = B - (U - y) + (x - y), gt[3] = U, C = -W, F = -w, Y = h * C, I = q * h, A = I - (I - h), T = h - A, I = q * C, X = I - (I - C), D = C - X, L = T * D - (Y - A * X - T * X - A * D), V = G * F, I = q * G, A = I - (I - G), T = G - A, I = q * F, X = I - (I - F), D = F - X, j = T * D - (V - A * X - T * X - A * D), x = L + j, y = x - L, wt[0] = L - (x - y) + (j - y), B = Y + x, y = B - Y, $ = Y - (B - y) + (x - y), x = $ + V, y = x - $, wt[1] = $ - (x - y) + (V - y), U = B + x, y = U - B, wt[2] = B - (U - y) + (x - y), wt[3] = U, S = ht(4, gt, 4, wt, pe), Y = u * d, I = q * u, A = I - (I - u), T = u - A, I = q * d, X = I - (I - d), D = d - X, L = T * D - (Y - A * X - T * X - A * D), V = h * w, I = q * h, A = I - (I - h), T = h - A, I = q * w, X = I - (I - w), D = w - X, j = T * D - (V - A * X - T * X - A * D), x = L - j, y = L - x, Ut[0] = L - (x + y) + (y - j), B = Y + x, y = B - Y, $ = Y - (B - y) + (x - y), x = $ - V, y = $ - x, Ut[1] = $ - (x + y) + (y - V), U = B + x, y = U - B, Ut[2] = B - (U - y) + (x - y), Ut[3] = U, N = 4) : (pe[0] = 0, S = 1, Ut[0] = 0, N = 1), c !== 0) {
      const rt = R(S, pe, c, it);
      f = ct(f, ht(
        R(m, Ne, c, K),
        K,
        R(rt, it, 2 * J, et),
        et,
        at
      ), at);
      const ot = R(N, Ut, c, z);
      f = ct(f, Mt(
        R(ot, z, 2 * J, K),
        K,
        R(ot, z, c, nt),
        nt,
        R(rt, it, c, et),
        et,
        Ft,
        bt
      ), bt), w !== 0 && (f = ct(f, R(R(4, kt, c, z), z, w, K), K)), d !== 0 && (f = ct(f, R(R(4, It, -c, z), z, d, K), K));
    }
    if (_ !== 0) {
      const rt = R(S, pe, _, it);
      f = ct(f, ht(
        R(v, Be, _, K),
        K,
        R(rt, it, 2 * Z, et),
        et,
        at
      ), at);
      const ot = R(N, Ut, _, z);
      f = ct(f, Mt(
        R(ot, z, 2 * Z, K),
        K,
        R(ot, z, _, nt),
        nt,
        R(rt, it, _, et),
        et,
        Ft,
        bt
      ), bt);
    }
  }
  if (u !== 0 || w !== 0) {
    if (h !== 0 || d !== 0 || c !== 0 || _ !== 0 ? (Y = h * Z, I = q * h, A = I - (I - h), T = h - A, I = q * Z, X = I - (I - Z), D = Z - X, L = T * D - (Y - A * X - T * X - A * D), V = G * _, I = q * G, A = I - (I - G), T = G - A, I = q * _, X = I - (I - _), D = _ - X, j = T * D - (V - A * X - T * X - A * D), x = L + j, y = x - L, gt[0] = L - (x - y) + (j - y), B = Y + x, y = B - Y, $ = Y - (B - y) + (x - y), x = $ + V, y = x - $, gt[1] = $ - (x - y) + (V - y), U = B + x, y = U - B, gt[2] = B - (U - y) + (x - y), gt[3] = U, C = -H, F = -d, Y = c * C, I = q * c, A = I - (I - c), T = c - A, I = q * C, X = I - (I - C), D = C - X, L = T * D - (Y - A * X - T * X - A * D), V = J * F, I = q * J, A = I - (I - J), T = J - A, I = q * F, X = I - (I - F), D = F - X, j = T * D - (V - A * X - T * X - A * D), x = L + j, y = x - L, wt[0] = L - (x - y) + (j - y), B = Y + x, y = B - Y, $ = Y - (B - y) + (x - y), x = $ + V, y = x - $, wt[1] = $ - (x - y) + (V - y), U = B + x, y = U - B, wt[2] = B - (U - y) + (x - y), wt[3] = U, g = ht(4, gt, 4, wt, ue), Y = h * _, I = q * h, A = I - (I - h), T = h - A, I = q * _, X = I - (I - _), D = _ - X, L = T * D - (Y - A * X - T * X - A * D), V = c * d, I = q * c, A = I - (I - c), T = c - A, I = q * d, X = I - (I - d), D = d - X, j = T * D - (V - A * X - T * X - A * D), x = L - j, y = L - x, Lt[0] = L - (x + y) + (y - j), B = Y + x, y = B - Y, $ = Y - (B - y) + (x - y), x = $ - V, y = $ - x, Lt[1] = $ - (x + y) + (y - V), U = B + x, y = U - B, Lt[2] = B - (U - y) + (x - y), Lt[3] = U, k = 4) : (ue[0] = 0, g = 1, Lt[0] = 0, k = 1), u !== 0) {
      const rt = R(g, ue, u, it);
      f = ct(f, ht(
        R(p, Te, u, K),
        K,
        R(rt, it, 2 * Q, et),
        et,
        at
      ), at);
      const ot = R(k, Lt, u, z);
      f = ct(f, Mt(
        R(ot, z, 2 * Q, K),
        K,
        R(ot, z, u, nt),
        nt,
        R(rt, it, u, et),
        et,
        Ft,
        bt
      ), bt), d !== 0 && (f = ct(f, R(R(4, At, u, z), z, d, K), K)), _ !== 0 && (f = ct(f, R(R(4, kt, -u, z), z, _, K), K));
    }
    if (w !== 0) {
      const rt = R(g, ue, w, it);
      f = ct(f, ht(
        R(b, Ce, w, K),
        K,
        R(rt, it, 2 * W, et),
        et,
        at
      ), at);
      const ot = R(k, Lt, w, z);
      f = ct(f, Mt(
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
  return Qt[f - 1];
}
function mi(e, t, n, i, o, r, s, a) {
  const l = e - s, f = n - s, h = o - s, c = t - a, u = i - a, d = r - a, _ = f * d, w = h * u, O = l * l + c * c, M = h * c, m = l * d, v = f * f + u * u, p = l * u, b = f * c, g = h * h + d * d, E = O * (_ - w) + v * (M - m) + g * (p - b), S = (Math.abs(_) + Math.abs(w)) * O + (Math.abs(M) + Math.abs(m)) * v + (Math.abs(p) + Math.abs(b)) * g, k = hi * S;
  return E > k || -E > k ? E : pi(e, t, n, i, o, r, s, a, S);
}
function gi(e, t) {
  var n, i, o = 0, r, s, a, l, f, h, c, u = e[0], d = e[1], _ = t.length;
  for (n = 0; n < _; n++) {
    i = 0;
    var w = t[n], O = w.length - 1;
    if (h = w[0], h[0] !== w[O][0] && h[1] !== w[O][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (s = h[0] - u, a = h[1] - d, i; i < O; i++) {
      if (c = w[i + 1], l = c[0] - u, f = c[1] - d, a === 0 && f === 0) {
        if (l <= 0 && s >= 0 || s <= 0 && l >= 0)
          return 0;
      } else if (f >= 0 && a <= 0 || f <= 0 && a >= 0) {
        if (r = Ot(s, l, a, f, 0, 0), r === 0)
          return 0;
        (r > 0 && f > 0 && a <= 0 || r < 0 && f <= 0 && a > 0) && o++;
      }
      h = c, a = f, s = l;
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
    const f = gi(i, a[l]);
    if (f === 0 && !n.ignoreBoundary) return !0;
    if (f) return !0;
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
function De(e, t, n, i, o) {
  let r, s, a, l, f = t[0], h = i[0], c = 0, u = 0;
  h > f == h > -f ? (r = f, f = t[++c]) : (r = h, h = i[++u]);
  let d = 0;
  if (c < e && u < n)
    for (h > f == h > -f ? (s = f + r, a = r - (s - f), f = t[++c]) : (s = h + r, a = r - (s - h), h = i[++u]), r = s, a !== 0 && (o[d++] = a); c < e && u < n; )
      h > f == h > -f ? (s = r + f, l = s - r, a = r - (s - l) + (f - l), f = t[++c]) : (s = r + h, l = s - r, a = r - (s - l) + (h - l), h = i[++u]), r = s, a !== 0 && (o[d++] = a);
  for (; c < e; )
    s = r + f, l = s - r, a = r - (s - l) + (f - l), f = t[++c], r = s, a !== 0 && (o[d++] = a);
  for (; u < n; )
    s = r + h, l = s - r, a = r - (s - l) + (h - l), h = i[++u], r = s, a !== 0 && (o[d++] = a);
  return (r !== 0 || d === 0) && (o[d++] = r), d;
}
function xi(e, t) {
  let n = t[0];
  for (let i = 1; i < e; i++) n += t[i];
  return n;
}
function fe(e) {
  return new Float64Array(e);
}
const _i = (3 + 16 * Bt) * Bt, Mi = (2 + 12 * Bt) * Bt, Si = (9 + 64 * Bt) * Bt * Bt, Jt = fe(4), nn = fe(8), rn = fe(12), on = fe(16), yt = fe(4);
function Ei(e, t, n, i, o, r, s) {
  let a, l, f, h, c, u, d, _, w, O, M, m, v, p, b, g, E, S;
  const k = e - o, P = n - o, N = t - r, C = i - r;
  p = k * C, u = ut * k, d = u - (u - k), _ = k - d, u = ut * C, w = u - (u - C), O = C - w, b = _ * O - (p - d * w - _ * w - d * O), g = N * P, u = ut * N, d = u - (u - N), _ = N - d, u = ut * P, w = u - (u - P), O = P - w, E = _ * O - (g - d * w - _ * w - d * O), M = b - E, c = b - M, Jt[0] = b - (M + c) + (c - E), m = p + M, c = m - p, v = p - (m - c) + (M - c), M = v - g, c = v - M, Jt[1] = v - (M + c) + (c - g), S = m + M, c = S - m, Jt[2] = m - (S - c) + (M - c), Jt[3] = S;
  let F = xi(4, Jt), y = Mi * s;
  if (F >= y || -F >= y || (c = e - k, a = e - (k + c) + (c - o), c = n - P, f = n - (P + c) + (c - o), c = t - N, l = t - (N + c) + (c - r), c = i - C, h = i - (C + c) + (c - r), a === 0 && l === 0 && f === 0 && h === 0) || (y = Si * s + bi * Math.abs(F), F += k * h + C * a - (N * f + P * l), F >= y || -F >= y)) return F;
  p = a * C, u = ut * a, d = u - (u - a), _ = a - d, u = ut * C, w = u - (u - C), O = C - w, b = _ * O - (p - d * w - _ * w - d * O), g = l * P, u = ut * l, d = u - (u - l), _ = l - d, u = ut * P, w = u - (u - P), O = P - w, E = _ * O - (g - d * w - _ * w - d * O), M = b - E, c = b - M, yt[0] = b - (M + c) + (c - E), m = p + M, c = m - p, v = p - (m - c) + (M - c), M = v - g, c = v - M, yt[1] = v - (M + c) + (c - g), S = m + M, c = S - m, yt[2] = m - (S - c) + (M - c), yt[3] = S;
  const I = De(4, Jt, 4, yt, nn);
  p = k * h, u = ut * k, d = u - (u - k), _ = k - d, u = ut * h, w = u - (u - h), O = h - w, b = _ * O - (p - d * w - _ * w - d * O), g = N * f, u = ut * N, d = u - (u - N), _ = N - d, u = ut * f, w = u - (u - f), O = f - w, E = _ * O - (g - d * w - _ * w - d * O), M = b - E, c = b - M, yt[0] = b - (M + c) + (c - E), m = p + M, c = m - p, v = p - (m - c) + (M - c), M = v - g, c = v - M, yt[1] = v - (M + c) + (c - g), S = m + M, c = S - m, yt[2] = m - (S - c) + (M - c), yt[3] = S;
  const A = De(I, nn, 4, yt, rn);
  p = a * h, u = ut * a, d = u - (u - a), _ = a - d, u = ut * h, w = u - (u - h), O = h - w, b = _ * O - (p - d * w - _ * w - d * O), g = l * f, u = ut * l, d = u - (u - l), _ = l - d, u = ut * f, w = u - (u - f), O = f - w, E = _ * O - (g - d * w - _ * w - d * O), M = b - E, c = b - M, yt[0] = b - (M + c) + (c - E), m = p + M, c = m - p, v = p - (m - c) + (M - c), M = v - g, c = v - M, yt[1] = v - (M + c) + (c - g), S = m + M, c = S - m, yt[2] = m - (S - c) + (M - c), yt[3] = S;
  const T = De(A, rn, 4, yt, on);
  return on[T - 1];
}
function sn(e, t, n, i, o, r) {
  const s = (t - r) * (n - o), a = (e - o) * (i - r), l = s - a;
  if (s === 0 || a === 0 || s > 0 != a > 0) return l;
  const f = Math.abs(s + a);
  return Math.abs(l) >= _i * f ? l : -Ei(e, t, n, i, o, r, f);
}
function ki(e, t) {
  const n = new Je([], Un);
  return Ii(e, n), Oi(n, t);
}
function Un(e, t) {
  return e.p.x > t.p.x ? 1 : e.p.x < t.p.x || e.p.x === t.p.x && (e.featureId !== t.featureId || e.ringId !== t.ringId) && e.isLeftEndpoint && !t.isLeftEndpoint ? -1 : e.p.y !== t.p.y ? e.p.y > t.p.y ? 1 : -1 : 1;
}
function Ai(e, t) {
  return e.rightSweepEvent.p.x > t.rightSweepEvent.p.x ? 1 : e.rightSweepEvent.p.x < t.rightSweepEvent.p.x ? -1 : e.rightSweepEvent.p.y !== t.rightSweepEvent.p.y ? e.rightSweepEvent.p.y < t.rightSweepEvent.p.y ? 1 : -1 : 1;
}
function Ii(e, t) {
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
        const f = new cn(s, me, ge, we), h = new cn(a, me, ge, we + 1);
        f.otherEvent = h, h.otherEvent = f, Un(f, h) > 0 ? (h.isLeftEndpoint = !0, f.isLeftEndpoint = !1) : (f.isLeftEndpoint = !0, h.isLeftEndpoint = !1), t.push(f), t.push(h), s = a, we = we + 1;
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
function Oi(e, t = !1) {
  const n = [], i = new Je([], Ai);
  for (; e.length; ) {
    const o = e.pop();
    if (o.isLeftEndpoint) {
      const r = new Pi(o);
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
var Pi = class {
  /** @param event must have otherEvent non-null */
  constructor(e) {
    this.leftSweepEvent = e, this.rightSweepEvent = e.otherEvent;
  }
};
function Ni(e, t) {
  if (e === null || t === null) return !1;
  const n = e.leftSweepEvent.p.x, i = e.leftSweepEvent.p.y, o = e.rightSweepEvent.p.x, r = e.rightSweepEvent.p.y, s = t.leftSweepEvent.p.x, a = t.leftSweepEvent.p.y, l = t.rightSweepEvent.p.x, f = t.rightSweepEvent.p.y, h = sn(n, i, o, r, s, a), c = sn(n, i, o, r, l, f);
  if (h > 0 && c > 0) return !1;
  if (h < 0 && c < 0) return !1;
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
  const u = (f - a) * (o - n) - (l - s) * (r - i), d = (l - s) * (i - a) - (f - a) * (n - s), _ = (o - n) * (i - a) - (r - i) * (n - s);
  if (u === 0)
    return !1;
  const w = d / u, O = _ / u;
  if (w >= 0 && w <= 1 && O >= 0 && O <= 1) {
    const M = n + w * (o - n), m = i + w * (r - i);
    return [M, m];
  }
  return !1;
}
function Bi(e, t, n = {}) {
  const { removeDuplicates: i = !0, ignoreSelfIntersections: o = !0 } = n;
  let r = [];
  e.type === "FeatureCollection" ? r = r.concat(e.features) : e.type === "Feature" ? r.push(e) : (e.type === "LineString" || e.type === "Polygon" || e.type === "MultiLineString" || e.type === "MultiPolygon") && r.push(oe(e)), t.type === "FeatureCollection" ? r = r.concat(t.features) : t.type === "Feature" ? r.push(t) : (t.type === "LineString" || t.type === "Polygon" || t.type === "MultiLineString" || t.type === "MultiPolygon") && r.push(oe(t));
  const s = ki(
    Et(r),
    o
  );
  let a = [];
  if (i) {
    const l = {};
    s.forEach((f) => {
      const h = f.join(",");
      l[h] || (l[h] = !0, a.push(f));
    });
  } else
    a = s;
  return Et(a.map((l) => Rt(l)));
}
function Ti(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function Ci(e) {
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
function Xi(e, t = {}) {
  let n = 0, i = 0, o = 0;
  return ze(
    e,
    function(r) {
      n += r[0], i += r[1], o++;
    },
    !0
  ), Rt([n / o, i / o], t.properties);
}
var ye = { exports: {} }, ke = { exports: {} }, $i = ke.exports, ln;
function Di() {
  return ln || (ln = 1, (function(e, t) {
    (function(n, i) {
      e.exports = i();
    })($i, function() {
      function n(m, v, p, b, g) {
        (function E(S, k, P, N, C) {
          for (; N > P; ) {
            if (N - P > 600) {
              var F = N - P + 1, y = k - P + 1, I = Math.log(F), A = 0.5 * Math.exp(2 * I / 3), T = 0.5 * Math.sqrt(I * A * (F - A) / F) * (y - F / 2 < 0 ? -1 : 1), X = Math.max(P, Math.floor(k - y * A / F + T)), D = Math.min(N, Math.floor(k + (F - y) * A / F + T));
              E(S, k, X, D, C);
            }
            var x = S[k], B = P, $ = N;
            for (i(S, P, k), C(S[N], x) > 0 && i(S, P, N); B < $; ) {
              for (i(S, B, $), B++, $--; C(S[B], x) < 0; ) B++;
              for (; C(S[$], x) > 0; ) $--;
            }
            C(S[P], x) === 0 ? i(S, P, $) : i(S, ++$, N), $ <= k && (P = $ + 1), k <= $ && (N = $ - 1);
          }
        })(m, v, p || 0, b || m.length - 1, g || o);
      }
      function i(m, v, p) {
        var b = m[v];
        m[v] = m[p], m[p] = b;
      }
      function o(m, v) {
        return m < v ? -1 : m > v ? 1 : 0;
      }
      var r = function(m) {
        m === void 0 && (m = 9), this._maxEntries = Math.max(4, m), this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries)), this.clear();
      };
      function s(m, v, p) {
        if (!p) return v.indexOf(m);
        for (var b = 0; b < v.length; b++) if (p(m, v[b])) return b;
        return -1;
      }
      function a(m, v) {
        l(m, 0, m.children.length, v, m);
      }
      function l(m, v, p, b, g) {
        g || (g = O(null)), g.minX = 1 / 0, g.minY = 1 / 0, g.maxX = -1 / 0, g.maxY = -1 / 0;
        for (var E = v; E < p; E++) {
          var S = m.children[E];
          f(g, m.leaf ? b(S) : S);
        }
        return g;
      }
      function f(m, v) {
        return m.minX = Math.min(m.minX, v.minX), m.minY = Math.min(m.minY, v.minY), m.maxX = Math.max(m.maxX, v.maxX), m.maxY = Math.max(m.maxY, v.maxY), m;
      }
      function h(m, v) {
        return m.minX - v.minX;
      }
      function c(m, v) {
        return m.minY - v.minY;
      }
      function u(m) {
        return (m.maxX - m.minX) * (m.maxY - m.minY);
      }
      function d(m) {
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
      function M(m, v, p, b, g) {
        for (var E = [v, p]; E.length; ) if (!((p = E.pop()) - (v = E.pop()) <= b)) {
          var S = v + Math.ceil((p - v) / b / 2) * b;
          n(m, S, v, p, g), E.push(v, S, S, p);
        }
      }
      return r.prototype.all = function() {
        return this._all(this.data, []);
      }, r.prototype.search = function(m) {
        var v = this.data, p = [];
        if (!w(m, v)) return p;
        for (var b = this.toBBox, g = []; v; ) {
          for (var E = 0; E < v.children.length; E++) {
            var S = v.children[E], k = v.leaf ? b(S) : S;
            w(m, k) && (v.leaf ? p.push(S) : _(m, k) ? this._all(S, p) : g.push(S));
          }
          v = g.pop();
        }
        return p;
      }, r.prototype.collides = function(m) {
        var v = this.data;
        if (!w(m, v)) return !1;
        for (var p = []; v; ) {
          for (var b = 0; b < v.children.length; b++) {
            var g = v.children[b], E = v.leaf ? this.toBBox(g) : g;
            if (w(m, E)) {
              if (v.leaf || _(m, E)) return !0;
              p.push(g);
            }
          }
          v = p.pop();
        }
        return !1;
      }, r.prototype.load = function(m) {
        if (!m || !m.length) return this;
        if (m.length < this._minEntries) {
          for (var v = 0; v < m.length; v++) this.insert(m[v]);
          return this;
        }
        var p = this._build(m.slice(), 0, m.length - 1, 0);
        if (this.data.children.length) if (this.data.height === p.height) this._splitRoot(this.data, p);
        else {
          if (this.data.height < p.height) {
            var b = this.data;
            this.data = p, p = b;
          }
          this._insert(p, this.data.height - p.height - 1, !0);
        }
        else this.data = p;
        return this;
      }, r.prototype.insert = function(m) {
        return m && this._insert(m, this.data.height - 1), this;
      }, r.prototype.clear = function() {
        return this.data = O([]), this;
      }, r.prototype.remove = function(m, v) {
        if (!m) return this;
        for (var p, b, g, E = this.data, S = this.toBBox(m), k = [], P = []; E || k.length; ) {
          if (E || (E = k.pop(), b = k[k.length - 1], p = P.pop(), g = !0), E.leaf) {
            var N = s(m, E.children, v);
            if (N !== -1) return E.children.splice(N, 1), k.push(E), this._condense(k), this;
          }
          g || E.leaf || !_(E, S) ? b ? (p++, E = b.children[p], g = !1) : E = null : (k.push(E), P.push(p), p = 0, b = E, E = E.children[0]);
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
        for (var p = []; m; ) m.leaf ? v.push.apply(v, m.children) : p.push.apply(p, m.children), m = p.pop();
        return v;
      }, r.prototype._build = function(m, v, p, b) {
        var g, E = p - v + 1, S = this._maxEntries;
        if (E <= S) return a(g = O(m.slice(v, p + 1)), this.toBBox), g;
        b || (b = Math.ceil(Math.log(E) / Math.log(S)), S = Math.ceil(E / Math.pow(S, b - 1))), (g = O([])).leaf = !1, g.height = b;
        var k = Math.ceil(E / S), P = k * Math.ceil(Math.sqrt(S));
        M(m, v, p, P, this.compareMinX);
        for (var N = v; N <= p; N += P) {
          var C = Math.min(N + P - 1, p);
          M(m, N, C, k, this.compareMinY);
          for (var F = N; F <= C; F += k) {
            var y = Math.min(F + k - 1, C);
            g.children.push(this._build(m, F, y, b - 1));
          }
        }
        return a(g, this.toBBox), g;
      }, r.prototype._chooseSubtree = function(m, v, p, b) {
        for (; b.push(v), !v.leaf && b.length - 1 !== p; ) {
          for (var g = 1 / 0, E = 1 / 0, S = void 0, k = 0; k < v.children.length; k++) {
            var P = v.children[k], N = u(P), C = (F = m, y = P, (Math.max(y.maxX, F.maxX) - Math.min(y.minX, F.minX)) * (Math.max(y.maxY, F.maxY) - Math.min(y.minY, F.minY)) - N);
            C < E ? (E = C, g = N < g ? N : g, S = P) : C === E && N < g && (g = N, S = P);
          }
          v = S || v.children[0];
        }
        var F, y;
        return v;
      }, r.prototype._insert = function(m, v, p) {
        var b = p ? m : this.toBBox(m), g = [], E = this._chooseSubtree(b, this.data, v, g);
        for (E.children.push(m), f(E, b); v >= 0 && g[v].children.length > this._maxEntries; ) this._split(g, v), v--;
        this._adjustParentBBoxes(b, g, v);
      }, r.prototype._split = function(m, v) {
        var p = m[v], b = p.children.length, g = this._minEntries;
        this._chooseSplitAxis(p, g, b);
        var E = this._chooseSplitIndex(p, g, b), S = O(p.children.splice(E, p.children.length - E));
        S.height = p.height, S.leaf = p.leaf, a(p, this.toBBox), a(S, this.toBBox), v ? m[v - 1].children.push(S) : this._splitRoot(p, S);
      }, r.prototype._splitRoot = function(m, v) {
        this.data = O([m, v]), this.data.height = m.height + 1, this.data.leaf = !1, a(this.data, this.toBBox);
      }, r.prototype._chooseSplitIndex = function(m, v, p) {
        for (var b, g, E, S, k, P, N, C = 1 / 0, F = 1 / 0, y = v; y <= p - v; y++) {
          var I = l(m, 0, y, this.toBBox), A = l(m, y, p, this.toBBox), T = (g = I, E = A, S = void 0, k = void 0, P = void 0, N = void 0, S = Math.max(g.minX, E.minX), k = Math.max(g.minY, E.minY), P = Math.min(g.maxX, E.maxX), N = Math.min(g.maxY, E.maxY), Math.max(0, P - S) * Math.max(0, N - k)), X = u(I) + u(A);
          T < C ? (C = T, b = y, F = X < F ? X : F) : T === C && X < F && (F = X, b = y);
        }
        return b || p - v;
      }, r.prototype._chooseSplitAxis = function(m, v, p) {
        var b = m.leaf ? this.compareMinX : h, g = m.leaf ? this.compareMinY : c;
        this._allDistMargin(m, v, p, b) < this._allDistMargin(m, v, p, g) && m.children.sort(b);
      }, r.prototype._allDistMargin = function(m, v, p, b) {
        m.children.sort(b);
        for (var g = this.toBBox, E = l(m, 0, v, g), S = l(m, p - v, p, g), k = d(E) + d(S), P = v; P < p - v; P++) {
          var N = m.children[P];
          f(E, m.leaf ? g(N) : N), k += d(E);
        }
        for (var C = p - v - 1; C >= v; C--) {
          var F = m.children[C];
          f(S, m.leaf ? g(F) : F), k += d(S);
        }
        return k;
      }, r.prototype._adjustParentBBoxes = function(m, v, p) {
        for (var b = p; b >= 0; b--) f(v[b], m);
      }, r.prototype._condense = function(m) {
        for (var v = m.length - 1, p = void 0; v >= 0; v--) m[v].children.length === 0 ? v > 0 ? (p = m[v - 1].children).splice(p.indexOf(m[v]), 1) : this.clear() : a(m[v], this.toBBox);
      }, r;
    });
  })(ke)), ke.exports;
}
const Fi = /* @__PURE__ */ Ci(vi);
var Zt = { exports: {} }, Fe, fn;
function Yi() {
  return fn || (fn = 1, Fe = function(t, n, i, o) {
    var r = t[0], s = t[1], a = !1;
    i === void 0 && (i = 0), o === void 0 && (o = n.length);
    for (var l = (o - i) / 2, f = 0, h = l - 1; f < l; h = f++) {
      var c = n[i + f * 2 + 0], u = n[i + f * 2 + 1], d = n[i + h * 2 + 0], _ = n[i + h * 2 + 1], w = u > s != _ > s && r < (d - c) * (s - u) / (_ - u) + c;
      w && (a = !a);
    }
    return a;
  }), Fe;
}
var Ye, hn;
function Ri() {
  return hn || (hn = 1, Ye = function(t, n, i, o) {
    var r = t[0], s = t[1], a = !1;
    i === void 0 && (i = 0), o === void 0 && (o = n.length);
    for (var l = o - i, f = 0, h = l - 1; f < l; h = f++) {
      var c = n[f + i][0], u = n[f + i][1], d = n[h + i][0], _ = n[h + i][1], w = u > s != _ > s && r < (d - c) * (s - u) / (_ - u) + c;
      w && (a = !a);
    }
    return a;
  }), Ye;
}
var un;
function Li() {
  if (un) return Zt.exports;
  un = 1;
  var e = Yi(), t = Ri();
  return Zt.exports = function(i, o, r, s) {
    return o.length > 0 && Array.isArray(o[0]) ? t(i, o, r, s) : e(i, o, r, s);
  }, Zt.exports.nested = t, Zt.exports.flat = e, Zt.exports;
}
var ee = { exports: {} }, Vi = ee.exports, dn;
function Ui() {
  return dn || (dn = 1, (function(e, t) {
    (function(n, i) {
      i(t);
    })(Vi, function(n) {
      const o = 33306690738754706e-32;
      function r(w, O, M, m, v) {
        let p, b, g, E, S = O[0], k = m[0], P = 0, N = 0;
        k > S == k > -S ? (p = S, S = O[++P]) : (p = k, k = m[++N]);
        let C = 0;
        if (P < w && N < M) for (k > S == k > -S ? (g = p - ((b = S + p) - S), S = O[++P]) : (g = p - ((b = k + p) - k), k = m[++N]), p = b, g !== 0 && (v[C++] = g); P < w && N < M; ) k > S == k > -S ? (g = p - ((b = p + S) - (E = b - p)) + (S - E), S = O[++P]) : (g = p - ((b = p + k) - (E = b - p)) + (k - E), k = m[++N]), p = b, g !== 0 && (v[C++] = g);
        for (; P < w; ) g = p - ((b = p + S) - (E = b - p)) + (S - E), S = O[++P], p = b, g !== 0 && (v[C++] = g);
        for (; N < M; ) g = p - ((b = p + k) - (E = b - p)) + (k - E), k = m[++N], p = b, g !== 0 && (v[C++] = g);
        return p === 0 && C !== 0 || (v[C++] = p), C;
      }
      function s(w) {
        return new Float64Array(w);
      }
      const a = 33306690738754716e-32, l = 22204460492503146e-32, f = 11093356479670487e-47, h = s(4), c = s(8), u = s(12), d = s(16), _ = s(4);
      n.orient2d = function(w, O, M, m, v, p) {
        const b = (O - p) * (M - v), g = (w - v) * (m - p), E = b - g;
        if (b === 0 || g === 0 || b > 0 != g > 0) return E;
        const S = Math.abs(b + g);
        return Math.abs(E) >= a * S ? E : -(function(k, P, N, C, F, y, I) {
          let A, T, X, D, x, B, $, Y, L, V, j, U, G, J, Q, H, Z, W;
          const st = k - F, ft = N - F, rt = P - y, ot = C - y;
          x = (Q = (Y = st - ($ = (B = 134217729 * st) - (B - st))) * (V = ot - (L = (B = 134217729 * ot) - (B - ot))) - ((J = st * ot) - $ * L - Y * L - $ * V)) - (j = Q - (Z = (Y = rt - ($ = (B = 134217729 * rt) - (B - rt))) * (V = ft - (L = (B = 134217729 * ft) - (B - ft))) - ((H = rt * ft) - $ * L - Y * L - $ * V))), h[0] = Q - (j + x) + (x - Z), x = (G = J - ((U = J + j) - (x = U - J)) + (j - x)) - (j = G - H), h[1] = G - (j + x) + (x - H), x = (W = U + j) - U, h[2] = U - (W - x) + (j - x), h[3] = W;
          let Ct = (function(ri, Ke) {
            let Qe = Ke[0];
            for (let Ie = 1; Ie < ri; Ie++) Qe += Ke[Ie];
            return Qe;
          })(4, h), Wt = l * I;
          if (Ct >= Wt || -Ct >= Wt || (A = k - (st + (x = k - st)) + (x - F), X = N - (ft + (x = N - ft)) + (x - F), T = P - (rt + (x = P - rt)) + (x - y), D = C - (ot + (x = C - ot)) + (x - y), A === 0 && T === 0 && X === 0 && D === 0) || (Wt = f * I + o * Math.abs(Ct), (Ct += st * D + ot * A - (rt * X + ft * T)) >= Wt || -Ct >= Wt)) return Ct;
          x = (Q = (Y = A - ($ = (B = 134217729 * A) - (B - A))) * (V = ot - (L = (B = 134217729 * ot) - (B - ot))) - ((J = A * ot) - $ * L - Y * L - $ * V)) - (j = Q - (Z = (Y = T - ($ = (B = 134217729 * T) - (B - T))) * (V = ft - (L = (B = 134217729 * ft) - (B - ft))) - ((H = T * ft) - $ * L - Y * L - $ * V))), _[0] = Q - (j + x) + (x - Z), x = (G = J - ((U = J + j) - (x = U - J)) + (j - x)) - (j = G - H), _[1] = G - (j + x) + (x - H), x = (W = U + j) - U, _[2] = U - (W - x) + (j - x), _[3] = W;
          const ei = r(4, h, 4, _, c);
          x = (Q = (Y = st - ($ = (B = 134217729 * st) - (B - st))) * (V = D - (L = (B = 134217729 * D) - (B - D))) - ((J = st * D) - $ * L - Y * L - $ * V)) - (j = Q - (Z = (Y = rt - ($ = (B = 134217729 * rt) - (B - rt))) * (V = X - (L = (B = 134217729 * X) - (B - X))) - ((H = rt * X) - $ * L - Y * L - $ * V))), _[0] = Q - (j + x) + (x - Z), x = (G = J - ((U = J + j) - (x = U - J)) + (j - x)) - (j = G - H), _[1] = G - (j + x) + (x - H), x = (W = U + j) - U, _[2] = U - (W - x) + (j - x), _[3] = W;
          const ni = r(ei, c, 4, _, u);
          x = (Q = (Y = A - ($ = (B = 134217729 * A) - (B - A))) * (V = D - (L = (B = 134217729 * D) - (B - D))) - ((J = A * D) - $ * L - Y * L - $ * V)) - (j = Q - (Z = (Y = T - ($ = (B = 134217729 * T) - (B - T))) * (V = X - (L = (B = 134217729 * X) - (B - X))) - ((H = T * X) - $ * L - Y * L - $ * V))), _[0] = Q - (j + x) + (x - Z), x = (G = J - ((U = J + j) - (x = U - J)) + (j - x)) - (j = G - H), _[1] = G - (j + x) + (x - H), x = (W = U + j) - U, _[2] = U - (W - x) + (j - x), _[3] = W;
          const ii = r(ni, u, 4, _, d);
          return d[ii - 1];
        })(w, O, M, m, v, p, S);
      }, n.orient2dfast = function(w, O, M, m, v, p) {
        return (O - p) * (M - v) - (w - v) * (m - p);
      }, Object.defineProperty(n, "__esModule", { value: !0 });
    });
  })(ee, ee.exports)), ee.exports;
}
var pn;
function ji() {
  if (pn) return ye.exports;
  pn = 1;
  var e = Di(), t = Fi, n = Li(), i = Ui().orient2d;
  t.default && (t = t.default), ye.exports = o, ye.exports.default = o;
  function o(p, b, g) {
    b = Math.max(0, b === void 0 ? 2 : b), g = g || 0;
    var E = d(p), S = new e(16);
    S.toBBox = function($) {
      return {
        minX: $[0],
        minY: $[1],
        maxX: $[0],
        maxY: $[1]
      };
    }, S.compareMinX = function($, Y) {
      return $[0] - Y[0];
    }, S.compareMinY = function($, Y) {
      return $[1] - Y[1];
    }, S.load(p);
    for (var k = [], P = 0, N; P < E.length; P++) {
      var C = E[P];
      S.remove(C), N = _(C, N), k.push(N);
    }
    var F = new e(16);
    for (P = 0; P < k.length; P++) F.insert(u(k[P]));
    for (var y = b * b, I = g * g; k.length; ) {
      var A = k.shift(), T = A.p, X = A.next.p, D = w(T, X);
      if (!(D < I)) {
        var x = D / y;
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
  function r(p, b, g, E, S, k, P) {
    for (var N = new t([], s), C = p.data; C; ) {
      for (var F = 0; F < C.children.length; F++) {
        var y = C.children[F], I = C.leaf ? O(y, g, E) : a(g, E, y);
        I > k || N.push({
          node: y,
          dist: I
        });
      }
      for (; N.length && !N.peek().node.children; ) {
        var A = N.pop(), T = A.node, X = O(T, b, g), D = O(T, E, S);
        if (A.dist < X && A.dist < D && f(g, T, P) && f(E, T, P)) return T;
      }
      C = N.pop(), C && (C = C.node);
    }
    return null;
  }
  function s(p, b) {
    return p.dist - b.dist;
  }
  function a(p, b, g) {
    if (l(p, g) || l(b, g)) return 0;
    var E = M(p[0], p[1], b[0], b[1], g.minX, g.minY, g.maxX, g.minY);
    if (E === 0) return 0;
    var S = M(p[0], p[1], b[0], b[1], g.minX, g.minY, g.minX, g.maxY);
    if (S === 0) return 0;
    var k = M(p[0], p[1], b[0], b[1], g.maxX, g.minY, g.maxX, g.maxY);
    if (k === 0) return 0;
    var P = M(p[0], p[1], b[0], b[1], g.minX, g.maxY, g.maxX, g.maxY);
    return P === 0 ? 0 : Math.min(E, S, k, P);
  }
  function l(p, b) {
    return p[0] >= b.minX && p[0] <= b.maxX && p[1] >= b.minY && p[1] <= b.maxY;
  }
  function f(p, b, g) {
    for (var E = Math.min(p[0], b[0]), S = Math.min(p[1], b[1]), k = Math.max(p[0], b[0]), P = Math.max(p[1], b[1]), N = g.search({ minX: E, minY: S, maxX: k, maxY: P }), C = 0; C < N.length; C++)
      if (c(N[C].p, N[C].next.p, p, b)) return !1;
    return !0;
  }
  function h(p, b, g) {
    return i(p[0], p[1], b[0], b[1], g[0], g[1]);
  }
  function c(p, b, g, E) {
    return p !== E && b !== g && h(p, b, g) > 0 != h(p, b, E) > 0 && h(g, E, p) > 0 != h(g, E, b) > 0;
  }
  function u(p) {
    var b = p.p, g = p.next.p;
    return p.minX = Math.min(b[0], g[0]), p.minY = Math.min(b[1], g[1]), p.maxX = Math.max(b[0], g[0]), p.maxY = Math.max(b[1], g[1]), p;
  }
  function d(p) {
    for (var b = p[0], g = p[0], E = p[0], S = p[0], k = 0; k < p.length; k++) {
      var P = p[k];
      P[0] < b[0] && (b = P), P[0] > E[0] && (E = P), P[1] < g[1] && (g = P), P[1] > S[1] && (S = P);
    }
    var N = [b, g, E, S], C = N.slice();
    for (k = 0; k < p.length; k++)
      n(p[k], N) || C.push(p[k]);
    return v(C);
  }
  function _(p, b) {
    var g = {
      p,
      prev: null,
      next: null,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };
    return b ? (g.next = b.next, g.prev = b, b.next.prev = g, b.next = g) : (g.prev = g, g.next = g), g;
  }
  function w(p, b) {
    var g = p[0] - b[0], E = p[1] - b[1];
    return g * g + E * E;
  }
  function O(p, b, g) {
    var E = b[0], S = b[1], k = g[0] - E, P = g[1] - S;
    if (k !== 0 || P !== 0) {
      var N = ((p[0] - E) * k + (p[1] - S) * P) / (k * k + P * P);
      N > 1 ? (E = g[0], S = g[1]) : N > 0 && (E += k * N, S += P * N);
    }
    return k = p[0] - E, P = p[1] - S, k * k + P * P;
  }
  function M(p, b, g, E, S, k, P, N) {
    var C = g - p, F = E - b, y = P - S, I = N - k, A = p - S, T = b - k, X = C * C + F * F, D = C * y + F * I, x = y * y + I * I, B = C * A + F * T, $ = y * A + I * T, Y = X * x - D * D, L, V, j, U, G = Y, J = Y;
    Y === 0 ? (V = 0, G = 1, U = $, J = x) : (V = D * $ - x * B, U = X * $ - D * B, V < 0 ? (V = 0, U = $, J = x) : V > G && (V = G, U = $ + D, J = x)), U < 0 ? (U = 0, -B < 0 ? V = 0 : -B > X ? V = G : (V = -B, G = X)) : U > J && (U = J, -B + D < 0 ? V = 0 : -B + D > X ? V = G : (V = -B + D, G = X)), L = V === 0 ? 0 : V / G, j = U === 0 ? 0 : U / J;
    var Q = (1 - L) * p + L * g, H = (1 - L) * b + L * E, Z = (1 - j) * S + j * P, W = (1 - j) * k + j * N, st = Z - Q, ft = W - H;
    return st * st + ft * ft;
  }
  function m(p, b) {
    return p[0] === b[0] ? p[1] - b[1] : p[0] - b[0];
  }
  function v(p) {
    p.sort(m);
    for (var b = [], g = 0; g < p.length; g++) {
      for (; b.length >= 2 && h(b[b.length - 2], b[b.length - 1], p[g]) <= 0; )
        b.pop();
      b.push(p[g]);
    }
    for (var E = [], S = p.length - 1; S >= 0; S--) {
      for (; E.length >= 2 && h(E[E.length - 2], E[E.length - 1], p[S]) <= 0; )
        E.pop();
      E.push(p[S]);
    }
    return E.pop(), b.pop(), b.concat(E);
  }
  return ye.exports;
}
var qi = ji();
const zi = /* @__PURE__ */ Ti(qi);
function mn(e, t = {}) {
  t.concavity = t.concavity || 1 / 0;
  const n = [];
  if (ze(e, (o) => {
    n.push([o[0], o[1]]);
  }), !n.length)
    return null;
  const i = zi(n, t.concavity);
  return i.length > 3 ? le([i], t.properties) : null;
}
function jn(e, t, n = {}) {
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
  return jn({
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
  return jn({
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
function Ji(e) {
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
function Gi(e) {
  return e.type === "Feature" ? e.geometry : e;
}
const Tt = 11102230246251565e-32, dt = 134217729, Ki = (3 + 8 * Tt) * Tt;
function Re(e, t, n, i, o) {
  let r, s, a, l, f = t[0], h = i[0], c = 0, u = 0;
  h > f == h > -f ? (r = f, f = t[++c]) : (r = h, h = i[++u]);
  let d = 0;
  if (c < e && u < n)
    for (h > f == h > -f ? (s = f + r, a = r - (s - f), f = t[++c]) : (s = h + r, a = r - (s - h), h = i[++u]), r = s, a !== 0 && (o[d++] = a); c < e && u < n; )
      h > f == h > -f ? (s = r + f, l = s - r, a = r - (s - l) + (f - l), f = t[++c]) : (s = r + h, l = s - r, a = r - (s - l) + (h - l), h = i[++u]), r = s, a !== 0 && (o[d++] = a);
  for (; c < e; )
    s = r + f, l = s - r, a = r - (s - l) + (f - l), f = t[++c], r = s, a !== 0 && (o[d++] = a);
  for (; u < n; )
    s = r + h, l = s - r, a = r - (s - l) + (h - l), h = i[++u], r = s, a !== 0 && (o[d++] = a);
  return (r !== 0 || d === 0) && (o[d++] = r), d;
}
function Qi(e, t) {
  let n = t[0];
  for (let i = 1; i < e; i++) n += t[i];
  return n;
}
function he(e) {
  return new Float64Array(e);
}
const Hi = (3 + 16 * Tt) * Tt, Wi = (2 + 12 * Tt) * Tt, Zi = (9 + 64 * Tt) * Tt * Tt, Gt = he(4), yn = he(8), vn = he(12), bn = he(16), vt = he(4);
function tr(e, t, n, i, o, r, s) {
  let a, l, f, h, c, u, d, _, w, O, M, m, v, p, b, g, E, S;
  const k = e - o, P = n - o, N = t - r, C = i - r;
  p = k * C, u = dt * k, d = u - (u - k), _ = k - d, u = dt * C, w = u - (u - C), O = C - w, b = _ * O - (p - d * w - _ * w - d * O), g = N * P, u = dt * N, d = u - (u - N), _ = N - d, u = dt * P, w = u - (u - P), O = P - w, E = _ * O - (g - d * w - _ * w - d * O), M = b - E, c = b - M, Gt[0] = b - (M + c) + (c - E), m = p + M, c = m - p, v = p - (m - c) + (M - c), M = v - g, c = v - M, Gt[1] = v - (M + c) + (c - g), S = m + M, c = S - m, Gt[2] = m - (S - c) + (M - c), Gt[3] = S;
  let F = Qi(4, Gt), y = Wi * s;
  if (F >= y || -F >= y || (c = e - k, a = e - (k + c) + (c - o), c = n - P, f = n - (P + c) + (c - o), c = t - N, l = t - (N + c) + (c - r), c = i - C, h = i - (C + c) + (c - r), a === 0 && l === 0 && f === 0 && h === 0) || (y = Zi * s + Ki * Math.abs(F), F += k * h + C * a - (N * f + P * l), F >= y || -F >= y)) return F;
  p = a * C, u = dt * a, d = u - (u - a), _ = a - d, u = dt * C, w = u - (u - C), O = C - w, b = _ * O - (p - d * w - _ * w - d * O), g = l * P, u = dt * l, d = u - (u - l), _ = l - d, u = dt * P, w = u - (u - P), O = P - w, E = _ * O - (g - d * w - _ * w - d * O), M = b - E, c = b - M, vt[0] = b - (M + c) + (c - E), m = p + M, c = m - p, v = p - (m - c) + (M - c), M = v - g, c = v - M, vt[1] = v - (M + c) + (c - g), S = m + M, c = S - m, vt[2] = m - (S - c) + (M - c), vt[3] = S;
  const I = Re(4, Gt, 4, vt, yn);
  p = k * h, u = dt * k, d = u - (u - k), _ = k - d, u = dt * h, w = u - (u - h), O = h - w, b = _ * O - (p - d * w - _ * w - d * O), g = N * f, u = dt * N, d = u - (u - N), _ = N - d, u = dt * f, w = u - (u - f), O = f - w, E = _ * O - (g - d * w - _ * w - d * O), M = b - E, c = b - M, vt[0] = b - (M + c) + (c - E), m = p + M, c = m - p, v = p - (m - c) + (M - c), M = v - g, c = v - M, vt[1] = v - (M + c) + (c - g), S = m + M, c = S - m, vt[2] = m - (S - c) + (M - c), vt[3] = S;
  const A = Re(I, yn, 4, vt, vn);
  p = a * h, u = dt * a, d = u - (u - a), _ = a - d, u = dt * h, w = u - (u - h), O = h - w, b = _ * O - (p - d * w - _ * w - d * O), g = l * f, u = dt * l, d = u - (u - l), _ = l - d, u = dt * f, w = u - (u - f), O = f - w, E = _ * O - (g - d * w - _ * w - d * O), M = b - E, c = b - M, vt[0] = b - (M + c) + (c - E), m = p + M, c = m - p, v = p - (m - c) + (M - c), M = v - g, c = v - M, vt[1] = v - (M + c) + (c - g), S = m + M, c = S - m, vt[2] = m - (S - c) + (M - c), vt[3] = S;
  const T = Re(A, vn, 4, vt, bn);
  return bn[T - 1];
}
function er(e, t, n, i, o, r) {
  const s = (t - r) * (n - o), a = (e - o) * (i - r), l = s - a, f = Math.abs(s + a);
  return Math.abs(l) >= Hi * f ? l : -tr(e, t, n, i, o, r, f);
}
function nr(e, t) {
  var n, i, o = 0, r, s, a, l, f, h, c, u = e[0], d = e[1], _ = t.length;
  for (n = 0; n < _; n++) {
    i = 0;
    var w = t[n], O = w.length - 1;
    if (h = w[0], h[0] !== w[O][0] && h[1] !== w[O][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (s = h[0] - u, a = h[1] - d, i; i < O; i++) {
      if (c = w[i + 1], l = c[0] - u, f = c[1] - d, a === 0 && f === 0) {
        if (l <= 0 && s >= 0 || s <= 0 && l >= 0)
          return 0;
      } else if (f >= 0 && a <= 0 || f <= 0 && a >= 0) {
        if (r = er(s, l, a, f, 0, 0), r === 0)
          return 0;
        (r > 0 && f > 0 && a <= 0 || r < 0 && f <= 0 && a > 0) && o++;
      }
      h = c, a = f, s = l;
    }
  }
  return o % 2 !== 0;
}
function Ue(e, t, n = {}) {
  if (!e)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const i = Ji(e), o = Gi(t), r = o.type, s = t.bbox;
  let a = o.coordinates;
  if (s && ir(i, s) === !1)
    return !1;
  r === "Polygon" && (a = [a]);
  for (var l = 0; l < a.length; ++l) {
    const f = nr(i, a[l]);
    if (f === 0 && !n.ignoreBoundary || f) return !0;
  }
  return !1;
}
function ir(e, t) {
  return t[0] <= e[0] && t[1] <= e[1] && t[2] >= e[0] && t[3] >= e[1];
}
function Le(e, t) {
  for (let n = 0; n < t.features.length; n++)
    if (Ue(e, t.features[n]))
      return t.features[n];
}
function zn(e, t) {
  const n = t.geometry.coordinates[0][0], i = t.geometry.coordinates[0][1], o = t.geometry.coordinates[0][2], r = e.geometry.coordinates, s = t.properties.a.geom, a = t.properties.b.geom, l = t.properties.c.geom, f = [i[0] - n[0], i[1] - n[1]], h = [o[0] - n[0], o[1] - n[1]], c = [r[0] - n[0], r[1] - n[1]], u = [a[0] - s[0], a[1] - s[1]], d = [l[0] - s[0], l[1] - s[1]], _ = (h[1] * c[0] - h[0] * c[1]) / (f[0] * h[1] - f[1] * h[0]), w = (f[0] * c[1] - f[1] * c[0]) / (f[0] * h[1] - f[1] * h[0]);
  return [
    _ * u[0] + w * d[0] + s[0],
    _ * u[1] + w * d[1] + s[1]
  ];
}
function rr(e, t, n) {
  const i = e.geometry.coordinates, o = n.geometry.coordinates, r = Math.atan2(i[0] - o[0], i[1] - o[1]), s = sr(r, t[0]);
  if (s === void 0)
    throw new Error("Unable to determine vertex index");
  const a = t[1][s];
  return zn(e, a.features[0]);
}
function ne(e, t, n, i, o, r, s, a) {
  let l;
  if (s && (l = Le(e, Ht([s]))), !l)
    if (n) {
      const f = e.geometry.coordinates, h = n.gridNum, c = n.xOrigin, u = n.yOrigin, d = n.xUnit, _ = n.yUnit, w = n.gridCache, O = xt(f[0], c, d, h), M = xt(f[1], u, _, h), m = w[O] ? w[O][M] ? w[O][M] : [] : [], v = Ht(m.map((p) => t.features[p]));
      l = Le(e, v);
    } else
      l = Le(e, t);
  return a && a(l), l ? zn(e, l) : rr(e, i, o);
}
function xt(e, t, n, i) {
  let o = Math.floor((e - t) / n);
  return o < 0 && (o = 0), o >= i && (o = i - 1), o;
}
const or = 36;
function xn(e, t, n) {
  const i = (t[1][0] - t[0][0]) / n, o = (t[1][1] - t[0][1]) / n;
  return e.reduce((r, s) => {
    const a = xt(s[0][0], t[0][0], i, n), l = xt(s[1][0], t[0][0], i, n), f = xt(s[0][1], t[0][1], o, n), h = xt(s[1][1], t[0][1], o, n), c = (l - a + 1) * (h - f + 1);
    return c > 0 ? r + c : r;
  }, 0);
}
function sr(e, t) {
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
function Jn(e) {
  const t = ["a", "b", "c", "a"].map(
    (r) => e.properties[r].geom
  ), n = e.geometry.coordinates[0], i = e.properties, o = {
    a: { geom: n[0], index: i.a.index },
    b: { geom: n[1], index: i.b.index },
    c: { geom: n[2], index: i.c.index }
  };
  return qn([t], o);
}
function ar(e) {
  const t = [0, 1, 2, 0].map((i) => e[i][0][0]), n = {
    a: { geom: e[0][0][1], index: e[0][1] },
    b: { geom: e[1][0][1], index: e[1][1] },
    c: { geom: e[2][0][1], index: e[2][1] }
  };
  return qn([t], n);
}
function je(e, t, n, i, o, r = !1, s) {
  const a = e.map(
    (l) => {
      (!s || s < 2.00703) && (l = cr(l));
      const f = isFinite(l) ? t[l] : l === "c" ? i : (function() {
        const h = l.match(/^b(\d+)$/);
        if (h) return o[parseInt(h[1])];
        const c = l.match(/^e(\d+)$/);
        if (c) return n[parseInt(c[1])];
        throw new Error("Bad index value for indexesToTri");
      })();
      return r ? [[f[1], f[0]], l] : [[f[0], f[1]], l];
    }
  );
  return ar(a);
}
function cr(e) {
  return typeof e == "number" ? e : e.replace(/^(c|e|b)(?:ent|dgeNode|box)(\d+)?$/, "$1$2");
}
function Gn(e, t) {
  return t && t >= 2.00703 || Array.isArray(e[0]) ? e : e.map((n) => [
    n.illstNodes,
    n.mercNodes,
    n.startEnd
  ]);
}
const lr = 2.00704;
function fr(e) {
  return !!(e.version !== void 0 || !e.tins && e.points && e.tins_points);
}
function hr(e) {
  return {
    points: e.points,
    strictStatus: dr(e),
    verticesParams: pr(e),
    centroid: mr(e),
    edges: Gn(e.edges || []),
    edgeNodes: e.edgeNodes || [],
    tins: gr(e),
    kinks: wr(e.kinks_points),
    yaxisMode: e.yaxisMode ?? "invert",
    strictMode: e.strictMode ?? "auto",
    vertexMode: e.vertexMode,
    bounds: e.bounds,
    boundsPolygon: e.boundsPolygon,
    wh: e.wh,
    xy: e.xy ?? [0, 0]
  };
}
function ur(e) {
  const t = yr(e), n = t.tins, i = t.vertices_params;
  return i != null && Kn(i), {
    compiled: t,
    tins: n,
    points: vr(n),
    strictStatus: t.strict_status,
    verticesParams: i,
    centroid: t.centroid,
    kinks: t.kinks
  };
}
function dr(e) {
  return e.strict_status ? e.strict_status : e.kinks_points ? "strict_error" : e.tins_points.length === 2 ? "loose" : "strict";
}
function pr(e) {
  if (!Array.isArray(e.vertices_params) || !Array.isArray(e.vertices_points))
    throw new Error(
      "Invalid compiled data: vertices_params and vertices_points must be arrays"
    );
  const t = {
    forw: [e.vertices_params[0]],
    bakw: [e.vertices_params[1]]
  };
  return t.forw[1] = Sn(e, !1), t.bakw[1] = Sn(e, !0), Kn(t), t;
}
function Kn(e) {
  if (typeof e != "object")
    throw new Error("Invalid compiled data: vertices_params has a wrong shape");
  ["forw", "bakw"].forEach((t) => {
    const n = e[t];
    if (n == null) return;
    const i = `vertices_params.${t}`, o = n[0], r = n[1];
    if (!Array.isArray(o) || !Array.isArray(r))
      throw new Error(`Invalid compiled data: ${i} must hold two arrays`);
    if (o.length !== r.length)
      throw new Error(
        `Invalid compiled data: ${i} must have one angle per vertex`
      );
    for (let s = 0; s < o.length; s++)
      if (typeof o[s] != "number" || !Number.isFinite(o[s]))
        throw new Error(
          `Invalid compiled data: ${i} must contain only finite numbers`
        );
  });
}
function Sn(e, t) {
  const n = e.vertices_points.length;
  return Array.from({ length: n }, (i, o) => {
    const r = (o + 1) % n, s = je(
      ["c", `b${o}`, `b${r}`],
      e.points,
      e.edgeNodes || [],
      e.centroid_point,
      e.vertices_points,
      t,
      lr
    );
    return Ht([s]);
  });
}
function mr(e) {
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
function gr(e) {
  const t = e.tins_points.length === 1 ? 0 : 1;
  return {
    forw: Ht(
      e.tins_points[0].map(
        (n) => je(
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
        (n) => je(
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
function wr(e) {
  if (e)
    return {
      bakw: Ht(
        e.map((t) => se(t))
      )
    };
}
function yr(e) {
  return JSON.parse(
    JSON.stringify(e).replace('"cent"', '"c"').replace(/"bbox(\d+)"/g, '"b$1"')
  );
}
function vr(e) {
  const t = [], n = e.forw.features;
  for (let i = 0; i < n.length; i++) {
    const o = n[i];
    ["a", "b", "c"].forEach((r, s) => {
      const a = o.geometry.coordinates[0][s], l = o.properties[r].geom, f = o.properties[r].index;
      typeof f == "number" && (t[f] = [a, l]);
    });
  }
  return t;
}
class St {
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
  /** @deprecated 2.00704 以降、Transform はこのプロパティを設定も参照もしない。サブクラス（MaplatTin）は、旧 @maplat/transform と組まれたときの互換のため {} を入れる */
  pointsWeightBuffer;
  strict_status;
  vertices_params;
  centroid;
  edgeNodes;
  edges;
  tins;
  kinks;
  yaxisMode = St.YAXIS_INVERT;
  strictMode = St.MODE_AUTO;
  vertexMode = St.VERTEX_PLAIN;
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
    if (fr(t)) {
      this.applyModernState(hr(t));
      return;
    }
    this.applyLegacyState(ur(t));
  }
  applyModernState(t) {
    this.points = t.points, this.strict_status = t.strictStatus, this.vertices_params = t.verticesParams, this.centroid = t.centroid, this.edges = t.edges, this.edgeNodes = t.edgeNodes || [], this.tins = t.tins, this.addIndexedTin(), this.kinks = t.kinks, this.yaxisMode = t.yaxisMode ?? St.YAXIS_INVERT, this.vertexMode = t.vertexMode ?? St.VERTEX_PLAIN, this.strictMode = t.strictMode ?? St.MODE_AUTO, t.bounds ? (this.bounds = t.bounds, this.boundsPolygon = t.boundsPolygon, this.xy = t.xy, this.wh = t.wh) : (this.bounds = void 0, this.boundsPolygon = void 0, this.xy = t.xy ?? [0, 0], t.wh && (this.wh = t.wh));
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
   * セル数が MAX_INDEX_CELLS_PER_TRIANGLE で決まる上限を超えるデータは
   * 索引を作らず、変換時に全三角形を線形に探します。
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
    }), l = i.features.map((w) => {
      let O = [];
      return wn(w)[0].map((M) => {
        s.length === 0 ? s = [Array.from(M), Array.from(M)] : (M[0] < s[0][0] && (s[0][0] = M[0]), M[0] > s[1][0] && (s[1][0] = M[0]), M[1] < s[0][1] && (s[0][1] = M[1]), M[1] > s[1][1] && (s[1][1] = M[1])), O.length === 0 ? O = [Array.from(M), Array.from(M)] : (M[0] < O[0][0] && (O[0][0] = M[0]), M[0] > O[1][0] && (O[1][0] = M[0]), M[1] < O[0][1] && (O[0][1] = M[1]), M[1] > O[1][1] && (O[1][1] = M[1]));
      }), O;
    });
    if (Math.max(
      xn(a, r, o),
      xn(l, s, o)
    ) > or * n.features.length) {
      this.indexedTins = void 0;
      return;
    }
    const f = (r[1][0] - r[0][0]) / o, h = (r[1][1] - r[0][1]) / o, c = a.reduce(
      (w, O, M) => {
        const m = xt(O[0][0], r[0][0], f, o), v = xt(O[1][0], r[0][0], f, o), p = xt(O[0][1], r[0][1], h, o), b = xt(O[1][1], r[0][1], h, o);
        for (let g = m; g <= v; g++) {
          w[g] || (w[g] = []);
          for (let E = p; E <= b; E++)
            w[g][E] || (w[g][E] = []), w[g][E].push(M);
        }
        return w;
      },
      []
    ), u = (s[1][0] - s[0][0]) / o, d = (s[1][1] - s[0][1]) / o, _ = l.reduce(
      (w, O, M) => {
        const m = xt(O[0][0], s[0][0], u, o), v = xt(O[1][0], s[0][0], u, o), p = xt(O[0][1], s[0][1], d, o), b = xt(O[1][1], s[0][1], d, o);
        for (let g = m; g <= v; g++) {
          w[g] || (w[g] = []);
          for (let E = p; E <= b; E++)
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
        xUnit: f,
        yUnit: h,
        gridCache: c
      },
      bakw: {
        gridNum: o,
        xOrigin: s[0][0],
        yOrigin: s[0][1],
        xUnit: u,
        yUnit: d,
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
    if (n && this.strict_status == St.STATUS_ERROR)
      throw new Error('Backward transform is not allowed if strict_status == "strict_error"');
    this.yaxisMode == St.YAXIS_FOLLOW && n && (t = [t[0], -1 * t[1]]);
    const o = se(t);
    if (this.bounds && !n && !i && !Ue(o, this.boundsPolygon))
      return !1;
    const r = n ? this.tins.bakw : this.tins.forw, s = n ? this.indexedTins?.bakw : this.indexedTins?.forw, a = n ? this.vertices_params.bakw : this.vertices_params.forw, l = n ? this.centroid.bakw : this.centroid.forw;
    let f, h;
    this.stateFull && (this.stateBackward == n ? f = this.stateTriangle : (this.stateBackward = n, this.stateTriangle = void 0), h = (u) => {
      this.stateTriangle = u;
    });
    let c = ne(
      o,
      r,
      s,
      a,
      l,
      void 0,
      f,
      h
    );
    if (this.bounds && n && !i) {
      const u = se(c);
      if (!Ue(u, this.boundsPolygon)) return !1;
    } else this.yaxisMode == St.YAXIS_FOLLOW && !n && (c = [c[0], -1 * c[1]]);
    return c;
  }
}
const En = Math.pow(2, -52), ve = new Uint32Array(512);
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
  static from(t, n = Sr, i = Er) {
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
    let a = 1 / 0, l = 1 / 0, f = -1 / 0, h = -1 / 0;
    for (let k = 0; k < s; k++) {
      const P = t[2 * k], N = t[2 * k + 1];
      P < a && (a = P), N < l && (l = N), P > f && (f = P), N > h && (h = N), this._ids[k] = k;
    }
    const c = (a + f) / 2, u = (l + h) / 2;
    let d = 0, _ = 0, w = 0;
    for (let k = 0, P = 1 / 0; k < s; k++) {
      const N = Ve(c, u, t[2 * k], t[2 * k + 1]);
      N < P && (d = k, P = N);
    }
    const O = t[2 * d], M = t[2 * d + 1];
    for (let k = 0, P = 1 / 0; k < s; k++) {
      if (k === d) continue;
      const N = Ve(O, M, t[2 * k], t[2 * k + 1]);
      N < P && N > 0 && (_ = k, P = N);
    }
    let m = t[2 * _], v = t[2 * _ + 1], p = 1 / 0;
    for (let k = 0; k < s; k++) {
      if (k === d || k === _) continue;
      const P = _r(O, M, m, v, t[2 * k], t[2 * k + 1]);
      P < p && (w = k, p = P);
    }
    let b = t[2 * w], g = t[2 * w + 1];
    if (p === 1 / 0) {
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
    const E = Mr(O, M, m, v, b, g);
    this._cx = E.x, this._cy = E.y;
    for (let k = 0; k < s; k++)
      this._dists[k] = Ve(t[2 * k], t[2 * k + 1], E.x, E.y);
    Kt(this._ids, this._dists, 0, s - 1), this._hullStart = d;
    let S = 3;
    i[d] = n[w] = _, i[_] = n[d] = w, i[w] = n[_] = d, o[d] = 0, o[_] = 1, o[w] = 2, r.fill(-1), r[this._hashKey(O, M)] = d, r[this._hashKey(m, v)] = _, r[this._hashKey(b, g)] = w, this.trianglesLen = 0, this._addTriangle(d, _, w, -1, -1, -1);
    for (let k = 0, P = 0, N = 0; k < this._ids.length; k++) {
      const C = this._ids[k], F = t[2 * C], y = t[2 * C + 1];
      if (k > 0 && Math.abs(F - P) <= En && Math.abs(y - N) <= En || (P = F, N = y, C === d || C === _ || C === w)) continue;
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
      let D = i[A];
      for (; T = i[D], Ot(F, y, t[2 * D], t[2 * D + 1], t[2 * T], t[2 * T + 1]) < 0; )
        X = this._addTriangle(D, C, T, o[C], -1, o[D]), o[C] = this._legalize(X + 2), i[D] = D, S--, D = T;
      if (A === I)
        for (; T = n[A], Ot(F, y, t[2 * T], t[2 * T + 1], t[2 * A], t[2 * A + 1]) < 0; )
          X = this._addTriangle(T, C, A, -1, o[A], o[T]), this._legalize(X + 2), o[T] = X, i[A] = A, S--, A = T;
      this._hullStart = n[C] = A, i[A] = n[D] = C, i[C] = D, r[this._hashKey(F, y)] = C, r[this._hashKey(t[2 * A], t[2 * A + 1])] = A;
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
    return Math.floor(br(t - this._cx, n - this._cy) * this._hashSize) % this._hashSize;
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
      const f = a - a % 3, h = l + (t + 1) % 3, c = f + (a + 2) % 3, u = n[s], d = n[t], _ = n[h], w = n[c];
      if (xr(
        o[2 * u],
        o[2 * u + 1],
        o[2 * d],
        o[2 * d + 1],
        o[2 * _],
        o[2 * _ + 1],
        o[2 * w],
        o[2 * w + 1]
      )) {
        n[t] = w, n[a] = u;
        const M = i[c];
        if (M === -1) {
          let v = this._hullStart;
          do {
            if (this._hullTri[v] === c) {
              this._hullTri[v] = t;
              break;
            }
            v = this._hullPrev[v];
          } while (v !== this._hullStart);
        }
        this._link(t, M), this._link(a, i[s]), this._link(s, c);
        const m = f + (a + 1) % 3;
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
function br(e, t) {
  const n = e / (Math.abs(e) + Math.abs(t));
  return (t > 0 ? 3 - n : 1 + n) / 4;
}
function Ve(e, t, n, i) {
  const o = e - n, r = t - i;
  return o * o + r * r;
}
function xr(e, t, n, i, o, r, s, a) {
  const l = e - s, f = t - a, h = n - s, c = i - a, u = o - s, d = r - a, _ = l * l + f * f, w = h * h + c * c, O = u * u + d * d;
  return l * (c * O - w * d) - f * (h * O - w * u) + _ * (h * d - c * u) < 0;
}
function _r(e, t, n, i, o, r) {
  const s = n - e, a = i - t, l = o - e, f = r - t, h = s * s + a * a, c = l * l + f * f, u = 0.5 / (s * f - a * l), d = (f * h - a * c) * u, _ = (s * c - l * h) * u;
  return d * d + _ * _;
}
function Mr(e, t, n, i, o, r) {
  const s = n - e, a = i - t, l = o - e, f = r - t, h = s * s + a * a, c = l * l + f * f, u = 0.5 / (s * f - a * l), d = e + (f * h - a * c) * u, _ = t + (s * c - l * h) * u;
  return { x: d, y: _ };
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
function Sr(e) {
  return e[0];
}
function Er(e) {
  return e[1];
}
class kr {
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
class kn extends kr {
  constructor(t) {
    super(8, new Uint8Array(Math.ceil(t / 8)).fill(0));
  }
}
function jt(e) {
  return e % 3 === 2 ? e - 2 : e + 1;
}
function Pt(e) {
  return e % 3 === 0 ? e + 2 : e - 1;
}
function An(e, t, n, i, o, r, s, a) {
  const l = Ot(e, t, o, r, s, a), f = Ot(n, i, o, r, s, a);
  if (l > 0 && f > 0 || l < 0 && f < 0)
    return !1;
  const h = Ot(o, r, e, t, n, i), c = Ot(s, a, e, t, n, i);
  return h > 0 && c > 0 || h < 0 && c < 0 ? !1 : l === 0 && f === 0 && h === 0 && c === 0 ? !(Math.max(o, s) < Math.min(e, n) || Math.max(e, n) < Math.min(o, s) || Math.max(r, a) < Math.min(t, i) || Math.max(t, i) < Math.min(r, a)) : !0;
}
class Ar {
  /**
   * The triangulation object from Delaunator.
   */
  del;
  constructor(t) {
    this.del = t;
  }
}
class Ir extends Ar {
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
    this.assertVertex(t, t, n), this.assertVertex(n, t, n), this.assertInTriangulation(t, t, n), this.assertInTriangulation(n, t, n);
    const r = this.vertMap[t], s = this.maxConstrainSteps();
    let a = 0, l = r;
    do {
      if (++a > s)
        throw new Error(
          `Constraining edge [${t}, ${n}] exceeded the iteration limit`
        );
      const c = i[l], u = jt(l);
      if (c === n)
        return this.protect(l);
      const d = Pt(l), _ = i[d];
      if (_ === n)
        return this.protect(u), u;
      if (this.intersectSegments(t, n, _, c)) {
        l = d;
        break;
      }
      l = o[u];
    } while (l !== -1 && l !== r);
    let f = l, h = -1;
    for (; l !== -1; ) {
      if (++a > s)
        throw new Error(
          `Constraining edge [${t}, ${n}] exceeded the iteration limit`
        );
      const c = o[l], u = Pt(l), d = Pt(c), _ = jt(c);
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
        if (h === -1 && (h = l), i[d] === n) {
          if (l === h)
            throw new Error("Infinite loop: non-convex quadrilateral");
          l = h, h = -1;
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
          i[_],
          i[d]
        ))
          l = _;
        else if (h === l)
          throw new Error("Infinite loop: no further intersect after non-convex");
        continue;
      }
      if (this.flipDiagonal(l), this.intersectSegments(
        t,
        n,
        i[u],
        i[d]
      ) && (h === -1 && (h = u), h === u))
        throw new Error("Infinite loop: flipped diagonal still intersects");
      i[d] === n ? (f = d, l = h, h = -1) : this.intersectSegments(
        t,
        n,
        i[_],
        i[d]
      ) && (l = _);
    }
    return this.protect(f), this.delaunify(!0), this.findEdge(t, n);
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
    if (!(i < o.length))
      return 1 / 0;
    let s = i, a, l = 0;
    do {
      if (++l > o.length)
        throw new Error(
          `Looking up edge [${t}, ${n}] exceeded the iteration limit`
        );
      if (o[s] === t)
        return s;
      a = jt(s), s = r[a];
    } while (s !== -1 && s !== i);
    return o[jt(a)] === t ? -a : 1 / 0;
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
    const { triangles: n, halfedges: i } = this.del, o = this.flips, r = this.consd, s = i[t], a = Pt(t), l = jt(t), f = Pt(s), h = jt(s), c = i[a], u = i[f];
    if (r.has(t))
      throw new Error("Trying to flip a constrained edge");
    return n[t] = n[f], i[t] = u, o.set(t, o.has(f)) || r.set(t, r.has(f)), u !== -1 && (i[u] = t), i[a] = f, n[s] = n[a], i[s] = c, o.set(s, o.has(a)) || r.set(s, r.has(a)), c !== -1 && (i[c] = s), i[f] = a, this.markFlip(t), this.markFlip(l), this.markFlip(s), this.markFlip(h), o.add(a), r.delete(a), o.add(f), r.delete(f), this.updateVert(t), this.updateVert(l), this.updateVert(s), this.updateVert(h), a;
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
    const r = n[Pt(t)], s = n[t], a = n[jt(t)], l = n[Pt(o)];
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
  ), o = Ge.from(i);
  let r;
  const s = [];
  o.triangles.length !== 0 && t.length !== 0 && (r = new Ir(o), r.constrainAll(t));
  for (let l = 0; l < o.triangles.length; l += 3)
    s.push([o.triangles[l], o.triangles[l + 1], o.triangles[l + 2]]);
  const a = ["a", "b", "c"];
  return Et(
    s.map((l) => {
      const f = {}, h = l.map((c, u) => {
        const d = e.features[c], _ = d.geometry.coordinates, w = [_[0], _[1]];
        return _.length === 3 ? w[2] = _[2] : f[a[u]] = d.properties[n], w;
      });
      return h[3] = h[0], le([h], f);
    })
  );
}
function Or(e, t) {
  const n = [[], [], [], []], i = [];
  return Object.keys(e).forEach((o) => {
    const r = e[o], s = r.forw, a = r.bakw, l = [
      s[0] - t.forw[0],
      s[1] - t.forw[1]
    ], f = [
      a[0] - t.bakw[0],
      t.bakw[1] - a[1]
    ], h = { forw: l, bakw: f };
    if (i.push(h), l[0] === 0 || l[1] === 0)
      return;
    let c = 0;
    l[0] > 0 && (c += 1), l[1] > 0 && (c += 2), n[c].push(h);
  }), { perQuad: n, aggregate: i };
}
function Pr(e) {
  let t = 1 / 0, n = 0, i = 0;
  return e.forEach((o) => {
    const { forw: r, bakw: s } = o, a = Math.hypot(r[0], r[1]), l = Math.hypot(s[0], s[1]);
    if (l === 0) return;
    const f = a / l, h = Math.atan2(r[0], r[1]) - Math.atan2(s[0], s[1]);
    t = Math.min(t, f), n += Math.cos(h), i += Math.sin(h);
  }), isFinite(t) ? [t, Math.atan2(i, n)] : [1, 0];
}
function Nr(e, t, n) {
  const { perQuad: i, aggregate: o } = Or(e, t), r = i.every((l) => l.length > 0), a = (n === "birdeye" ? r ? i : [o] : [o]).map((l) => Pr(l));
  return a.length === 1 ? [a[0], a[0], a[0], a[0]] : a;
}
function Br(e, t) {
  let n = 0;
  return e[0] > t[0] && (n += 1), e[1] > t[1] && (n += 2), n;
}
function Tr(e, t, n) {
  const i = [
    e[0] - t.forw[0],
    e[1] - t.forw[1]
  ], r = Math.sqrt(i[0] ** 2 + i[1] ** 2) / n[0], s = Math.atan2(i[0], i[1]) - n[1];
  return [
    t.bakw[0] + r * Math.sin(s),
    t.bakw[1] - r * Math.cos(s)
  ];
}
function Cr(e, t, n, i) {
  const o = t[0] - e[0], r = t[1] - e[1];
  if (Math.abs(o) < 1e-12 && Math.abs(r) < 1e-12) return null;
  const s = i[0] - n[0], a = i[1] - n[1], l = n[0] - e[0], f = n[1] - e[1], h = o * a - r * s;
  if (Math.abs(h) < 1e-12) return null;
  const c = (l * a - f * s) / h, u = (l * r - f * o) / h;
  return c <= 1e-10 || u < -1e-10 || u > 1 + 1e-10 ? null : { t: c, point: [e[0] + c * o, e[1] + c * r] };
}
function Xr(e, t, n) {
  const i = n.length;
  let o = -1 / 0, r = null;
  for (let s = 0; s < i; s++) {
    const a = (s + 1) % i, l = Cr(
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
function On(e, t, n, i, o, r) {
  const s = t[0] - e[0], a = t[1] - e[1];
  if (s === 0 && a === 0) return null;
  const l = [];
  if (s !== 0)
    for (const h of [n, i]) {
      const c = (h - e[0]) / s;
      if (c > 0) {
        const u = e[1] + c * a;
        u >= o && u <= r && l.push({ t: c, x: h, y: u });
      }
    }
  if (a !== 0)
    for (const h of [o, r]) {
      const c = (h - e[1]) / a;
      if (c > 0) {
        const u = e[0] + c * s;
        u >= n && u <= i && l.push({ t: c, x: u, y: h });
      }
    }
  if (l.length === 0) return null;
  l.sort((h, c) => h.t - c.t);
  const f = l[0];
  return [f.x, f.y];
}
function Pn(e, t, n) {
  const i = e.length, o = new Array(i).fill(1);
  for (const r of t)
    for (let s = 0; s < i; s++) {
      const a = (s + 1) % i, l = He([e[s].bakw, e[a].bakw]), f = He([n.bakw, r.bakw]), h = Bi(l, f);
      if (h.features.length > 0 && h.features[0].geometry) {
        const c = h.features[0], u = Math.sqrt(
          Math.pow(r.bakw[0] - n.bakw[0], 2) + Math.pow(r.bakw[1] - n.bakw[1], 2)
        ), d = Math.sqrt(
          Math.pow(c.geometry.coordinates[0] - n.bakw[0], 2) + Math.pow(c.geometry.coordinates[1] - n.bakw[1], 2)
        ), _ = u / d;
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
function Qn(e, t, n) {
  const { convexBuf: i, centroid: o, allGcps: r, minx: s, maxx: a, miny: l, maxy: f } = e, h = Nr(i, o, t), u = [
    [s, l],
    [a, l],
    [a, f],
    [s, f]
  ].map((g) => ({
    forw: g,
    bakw: Tr(
      g,
      o,
      h[Br(g, o.forw)]
    )
  }));
  if (u.sort(
    (g, E) => Math.atan2(g.forw[0] - o.forw[0], g.forw[1] - o.forw[1]) - Math.atan2(E.forw[0] - o.forw[0], E.forw[1] - o.forw[1])
  ), Pn(u, r, o), !n) return u;
  const d = 4, _ = u.map(
    (g) => Math.atan2(g.forw[0] - o.forw[0], g.forw[1] - o.forw[1])
  ), w = u.map(
    (g) => Math.atan2(
      g.bakw[0] - o.bakw[0],
      -(g.bakw[1] - o.bakw[1])
    )
  );
  function O(g) {
    for (let E = 0; E < d; E++) {
      const S = (E + 1) % d, k = _[E], P = E < d - 1 ? _[S] : _[S] + 2 * Math.PI;
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
      (g) => Math.floor(In(g.forw, o.forw) / 10) % 36
    )
  ), v = r.map((g) => ({
    forw: g.forw,
    bakw: g.bakw,
    angleDeg: In(g.forw, o.forw),
    forwDist: Math.hypot(g.forw[0] - o.forw[0], g.forw[1] - o.forw[1])
  })), p = [];
  for (let g = 0; g < 36; g++) {
    if (m.has(g)) continue;
    const E = g * 10, S = v.filter(
      (I) => I.angleDeg >= E && I.angleDeg < E + 10
    );
    let k = null;
    if (S.length > 0) {
      const I = S.reduce((A, T) => T.forwDist > A.forwDist ? T : A);
      k = On(o.forw, I.forw, s, a, l, f);
    }
    if (!k) {
      const I = (E + 5) % 360 * (Math.PI / 180), A = [
        o.forw[0] + Math.sin(I),
        o.forw[1] + Math.cos(I)
      ];
      k = On(o.forw, A, s, a, l, f);
    }
    if (!k) continue;
    const P = [k[0] - o.forw[0], k[1] - o.forw[1]], N = Math.atan2(P[0], P[1]), C = M(N), F = [
      o.bakw[0] + Math.sin(C),
      o.bakw[1] - Math.cos(C)
    ], y = Xr(o.bakw, F, u);
    y && p.push({ forw: k, bakw: y });
  }
  const b = [...u, ...p];
  return b.sort(
    (g, E) => Math.atan2(g.forw[0] - o.forw[0], g.forw[1] - o.forw[1]) - Math.atan2(E.forw[0] - o.forw[0], E.forw[1] - o.forw[1])
  ), Pn(b, r, o), b;
}
function $r(e, t = !1) {
  return Qn(e, "plain", t);
}
function Dr(e, t = !1) {
  return Qn(e, "birdeye", t);
}
function wo(e) {
  return Hn(e, 1 / 0);
}
const Nn = 1e5, Fr = 16;
function Hn(e, t) {
  return Yr(e), new Rr(e).findSegmentIntersections(t).map(
    (o) => Rt([o.x, o.y])
  );
}
function Yr(e) {
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
    (r != this._xx.length || this._xx.length != this._yy.length) && qt("ArcCollection#initXYData() Counting error"), this.initBounds(), this._arcIter = new so(this._xx, this._yy);
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
    let a = 0, l, f, h;
    for (let c = 0; c < o; c++)
      l = i[c], l > 0 && (f = c * 4, h = ao(t, n, a, l), r[f++] = h[0], r[f++] = h[1], r[f++] = h[2], r[f] = h[3], a += l, s.mergeBounds(h));
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
    let l = i ? this._ii[o] : this._ii[o] + s - 1, f = l, h = 0;
    for (let c = 1; c < s; c++)
      f += a, (r === 0 || this._zz[f] >= r) && (n(l, f, this._xx, this._yy), l = f, h++);
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
    const n = this.getBounds(), i = n.ymin || 0, o = (n.ymax || 0) - i, r = this.calcSegmentIntersectionStripeCount(), s = new Uint32Array(r), a = r > 1 ? (v) => Math.floor((r - 1) * (v - i) / o) : () => 0, l = r + 1;
    let f;
    this.forEachSegment(
      (v, p, b, g) => {
        let E = a(g[v]);
        const S = a(g[p]);
        let k = 0;
        for (; s[E] = s[E] + 2, E != S; )
          k++, k > l && qt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${r}`,
            `s1=${E}`,
            `s2=${S}`
          ), E += S > E ? 1 : -1;
      }
    );
    const h = this.getUint32Array(Ur(s));
    let c = 0;
    const u = [];
    jr(s, (v) => {
      const p = c;
      c += v, u.push(h.subarray(p, c));
    }), qr(s, 0), this.forEachSegment(
      (v, p, b, g) => {
        let E = a(g[v]);
        const S = a(g[p]);
        let k, P, N = 0;
        for (; k = s[E], s[E] = k + 2, P = u[E], P[k] = v, P[k + 1] = p, E != S; )
          N++, N > l && qt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${r}`,
            `s1=${E}`,
            `s2=${S}`
          ), E += S > E ? 1 : -1;
      }
    );
    const d = this.getVertexData(), _ = t * Fr;
    let w = 0;
    const O = /* @__PURE__ */ new Set(), M = /* @__PURE__ */ new Map(), m = (v) => {
      w++;
      const p = oo(v);
      return O.has(p) || (O.add(p), M.set(`${v.x}:${v.y}`, v)), M.size >= t || w >= _;
    };
    if (d.xx && d.yy)
      for (f = 0; f < r && !zr(u[f], d.xx, d.yy, m); f++)
        ;
    return Array.from(M.values());
  }
}
function qt(...e) {
  const t = e.join(" ");
  throw new Error(t);
}
function ae(e) {
  return e ? Vr(e) ? !0 : Lr(e) ? !1 : e.length === 0 ? !0 : e.length > 0 : !1;
}
function Lr(e) {
  return e != null && e.toString === String.prototype.toString;
}
function Vr(e) {
  return Array.isArray(e);
}
function Ur(e, t) {
  ae(e) || qt("utils.sum() expects an array, received:", e);
  let n = 0, i;
  for (let o = 0, r = e.length; o < r; o++)
    i = e[o], i && (n += i);
  return n;
}
function jr(e, t, n) {
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
function zr(e, t, n, i) {
  const o = e.length - 2;
  let r, s, a, l, f, h, c, u, d, _, w, O, M, m, v, p, b;
  for (no(t, e), p = 0; p < o; ) {
    for (r = e[p], s = e[p + 1], f = t[r], h = t[s], d = n[r], _ = n[s], b = p; b < o && (b += 2, a = e[b], c = t[a], !(h < c)); ) {
      if (w = n[a], l = e[b + 1], u = t[l], O = n[l], d >= w) {
        if (d > O && _ > w && _ > O) continue;
      } else if (d < O && _ < w && _ < O) continue;
      if (!(r == a || r == l || s == a || s == l) && (M = Jr(
        f,
        d,
        h,
        _,
        c,
        w,
        u,
        O
      ), M && (m = [r, s], v = [a, l], i(Tn(M, m, v, t, n)) || M.length == 4 && i(Tn(M.slice(2), m, v, t, n)))))
        return !0;
    }
    p += 2;
  }
  return !1;
}
function Jr(e, t, n, i, o, r, s, a) {
  const l = Gr(e, t, n, i, o, r, s, a);
  let f = null;
  return l && (f = Kr(e, t, n, i, o, r, s, a), f ? eo(e, t, n, i, o, r, s, a) && (f = null) : f = to(e, t, n, i, o, r, s, a)), f;
}
function Gr(e, t, n, i, o, r, s, a) {
  return ie(e, t, n, i, o, r) * ie(e, t, n, i, s, a) <= 0 && ie(o, r, s, a, e, t) * ie(o, r, s, a, n, i) <= 0;
}
function ie(e, t, n, i, o, r) {
  return Wn(e - o, t - r, n - o, i - r);
}
function Wn(e, t, n, i) {
  return e * i - t * n;
}
function Kr(e, t, n, i, o, r, s, a) {
  let l = xe(e, t, n, i, o, r, s, a), f;
  return l && (f = Hr(l[0], l[1], e, t, n, i, o, r, s, a), f == 1 ? l = xe(n, i, e, t, o, r, s, a) : f == 2 ? l = xe(o, r, s, a, e, t, n, i) : f == 3 && (l = xe(s, a, o, r, e, t, n, i))), l && Zr(l, e, t, n, i, o, r, s, a), l;
}
function xe(e, t, n, i, o, r, s, a) {
  const l = Wn(n - e, i - t, s - o, a - r), f = 1e-18;
  let h;
  if (l === 0) return null;
  const c = ie(o, r, s, a, e, t) / l;
  return l <= f && l >= -f ? h = Qr(e, t, n, i, o, r, s, a) : h = [e + c * (n - e), t + c * (i - t)], h;
}
function Qr(e, t, n, i, o, r, s, a) {
  let l = null;
  return !Nt(e, o, s) && !Nt(t, r, a) ? l = [e, t] : !Nt(n, o, s) && !Nt(i, r, a) ? l = [n, i] : !Nt(o, e, n) && !Nt(r, t, i) ? l = [o, r] : !Nt(s, e, n) && !Nt(a, t, i) && (l = [s, a]), l;
}
function Nt(e, t, n) {
  let i;
  return t < n ? i = e < t || e > n : t > n ? i = e > t || e < n : i = e != t, i;
}
function Hr(e, t, ...n) {
  let i = -1, o = 1 / 0, r;
  for (let s = 0, a = 0, l = n.length; a < l; s++, a += 2)
    r = Wr(e, t, n[a], n[a + 1]), r < o && (o = r, i = s);
  return i;
}
function Wr(e, t, n, i) {
  const o = e - n, r = t - i;
  return o * o + r * r;
}
function Zr(e, t, n, i, o, r, s, a, l) {
  let f = e[0], h = e[1];
  f = _e(f, t, i), f = _e(f, r, a), h = _e(h, n, o), h = _e(h, s, l), e[0] = f, e[1] = h;
}
function _e(e, t, n) {
  let i;
  return Nt(e, t, n) && (i = Math.abs(e - t) < Math.abs(e - n) ? t : n, e = i), e;
}
function to(e, t, n, i, o, r, s, a) {
  const l = Math.min(e, n, o, s), f = Math.max(e, n, o, s), h = Math.min(t, i, r, a), c = Math.max(t, i, r, a), u = c - h > f - l;
  let d = [];
  return (u ? Yt(t, h, c) : Yt(e, l, f)) && d.push(e, t), (u ? Yt(i, h, c) : Yt(n, l, f)) && d.push(n, i), (u ? Yt(r, h, c) : Yt(o, l, f)) && d.push(o, r), (u ? Yt(a, h, c) : Yt(s, l, f)) && d.push(s, a), (d.length != 2 && d.length != 4 || d.length == 4 && d[0] == d[2] && d[1] == d[3]) && (d = null), d;
}
function eo(e, t, n, i, o, r, s, a) {
  return e == o && t == r || e == s && t == a || n == o && i == r || n == s && i == a;
}
function Yt(e, t, n) {
  return e > t && e < n;
}
function no(e, t) {
  io(e, t), Zn(e, t, 0, t.length - 2);
}
function io(e, t) {
  for (let n = 0, i = t.length; n < i; n += 2)
    e[t[n]] > e[t[n + 1]] && ro(t, n, n + 1);
}
function ro(e, t, n) {
  const i = e[t];
  e[t] = e[n], e[n] = i;
}
function Zn(e, t, n, i) {
  let o = n, r = i, s, a;
  for (; o < i; ) {
    for (s = e[t[n + i >> 2 << 1]]; o <= r; ) {
      for (; e[t[o]] < s; ) o += 2;
      for (; e[t[r]] > s; ) r -= 2;
      o <= r && (a = t[o], t[o] = t[r], t[r] = a, a = t[o + 1], t[o + 1] = t[r + 1], t[r + 1] = a, o += 2, r -= 2);
    }
    if (r - n < 40 ? Bn(e, t, n, r) : Zn(e, t, n, r), i - o < 40) {
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
  t = Cn(r, s, t[0], t[1], i, o), n = Cn(r, s, n[0], n[1], i, o);
  const a = t[0] < n[0] ? t : n, l = a == t ? n : t;
  return { x: r, y: s, a, b: l };
}
function Cn(e, t, n, i, o, r) {
  let s = n < i ? n : i, a = s === n ? i : n;
  return o[s] == e && r[s] == t ? a = s : o[a] == e && r[a] == t && (s = a), [s, a];
}
function oo(e) {
  return `${e.a.join(",")};${e.b.join(",")}`;
}
class so {
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
function ao(e, t, n, i) {
  let o = n | 0;
  const r = isNaN(i) ? e.length - o : i + o;
  let s, a, l, f, h, c;
  if (r > 0)
    l = h = e[o], f = c = t[o];
  else return [void 0, void 0, void 0, void 0];
  for (o++; o < r; o++)
    s = e[o], a = t[o], s < l && (l = s), s > h && (h = s), a < f && (f = a), a > c && (c = a);
  return [l, f, h, c];
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
        const f = t;
        r = f[0], s = f[1], a = f[2], l = f[3];
      } else {
        const f = t;
        r = f.xmin, s = f.ymin, a = f.xmax, l = f.ymax;
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
function ti(e, t, n) {
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
function Xn(e, t, n) {
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
function $n(e, t) {
  const n = e.length, i = t.geometry.coordinates;
  return Array.from({ length: n }, (o, r) => r).map((o) => {
    const r = (o + 1) % n, s = e[o], a = e[r], l = s.geometry.coordinates, f = Math.atan2(
      l[0] - i[0],
      l[1] - i[1]
    ), h = [t, s, a, t].map(
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
    }, u = Et([
      le([h], c)
    ]);
    return [f, u];
  }).reduce(
    (o, r) => (o[0].push(r[0]), o[1].push(r[1]), o),
    [[], []]
  );
}
function Ee(e, t = 1e-6) {
  const [n, i] = e[0], [o, r] = e[1], [s, a] = e[2];
  return Math.abs((o - n) * (a - i) - (s - n) * (r - i)) < t;
}
function co(e, t) {
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
const lo = 10;
function fo(e, t, n, i, o, r) {
  if (!e && !t) return !1;
  const s = e ? 0 : 1, a = 1 - s, l = n[s], f = n[a];
  if (!l || !f) return !1;
  const h = _t(f.geom);
  let c = !1, u = !1;
  for (let d = 0; d <= 1; d++) {
    const _ = i[d];
    if (!_) continue;
    const w = [String(_.prop.index), String(l.prop.index)].sort().join("-"), O = o[w];
    if (!O || O.length < 2) continue;
    const M = O.find(
      (N) => N.bakw !== r[s].bakw
    );
    if (!M) continue;
    const v = re(M.bakw).find(
      (N) => String(N.prop.index) !== String(_.prop.index) && String(N.prop.index) !== String(l.prop.index)
    );
    if (!v) continue;
    c = !0;
    const p = _t(v.geom), b = _t(_.geom), g = _t(l.geom), E = g[0] - b[0], S = g[1] - b[1], k = E * (h[1] - b[1]) - S * (h[0] - b[0]), P = E * (p[1] - b[1]) - S * (p[0] - b[0]);
    if (k * P > 0) {
      u = !0;
      break;
    }
  }
  return c && !u;
}
function ho(e, t, n, i) {
  if (!e && !t) return !1;
  if (n[0] && n[1] && i[0] && i[1]) {
    const o = i.map((h) => _t(h.geom)), r = n.map((h) => _t(h.geom)), s = o[1][0] - o[0][0], a = o[1][1] - o[0][1], l = s * (r[0][1] - o[0][1]) - a * (r[0][0] - o[0][0]), f = s * (r[1][1] - o[0][1]) - a * (r[1][0] - o[0][0]);
    return l * f < 0;
  }
  return !1;
}
function uo(e, t, n, i) {
  const o = co(n, i), r = /* @__PURE__ */ new Set();
  let s = !1;
  for (let a = 0; a < lo; a++) {
    let l = !1;
    for (const f of Object.keys(t)) {
      if (r.has(f)) continue;
      r.add(f);
      const h = t[f];
      if (!h || h.length < 2) continue;
      const c = f.split("-");
      if (c.length !== 2 || o.has(f)) continue;
      const u = re(h[0].bakw), d = re(h[1].bakw), _ = re(h[0].forw), w = re(h[1].forw), O = c.map(
        (x) => u.find((B) => `${B.prop.index}` === x) || d.find((B) => `${B.prop.index}` === x)
      ), M = c.map(
        (x) => _.find((B) => `${B.prop.index}` === x) || w.find((B) => `${B.prop.index}` === x)
      );
      if (O.some((x) => !x) || M.some((x) => !x))
        continue;
      const m = [u, d].map(
        (x) => x.find((B) => !c.includes(`${B.prop.index}`))
      ), v = [_, w].map(
        (x) => x.find((B) => !c.includes(`${B.prop.index}`))
      );
      if (m.some((x) => !x) || v.some((x) => !x))
        continue;
      const p = h[0].bakw.geometry.coordinates[0].slice(0, 3).map((x) => _t(x)), b = h[1].bakw.geometry.coordinates[0].slice(0, 3).map((x) => _t(x)), g = h[0].forw.geometry.coordinates[0].slice(0, 3).map((x) => _t(x)), E = h[1].forw.geometry.coordinates[0].slice(0, 3).map((x) => _t(x)), S = Ee(p), k = Ee(b), P = Ee(g), N = Ee(E), C = fo(
        S,
        k,
        m,
        O,
        t,
        h
      ), F = ho(
        P,
        N,
        m,
        O
      );
      if (!(C || F || Dn(
        _t(m[0].geom),
        b
      ) || Dn(
        _t(m[1].geom),
        p
      )))
        continue;
      const I = M.map(
        (x) => _t(x.geom)
      ), A = v.map(
        (x) => _t(x.geom)
      ), T = po([
        ...I,
        ...A
      ]), X = mo(T), D = Fn(
        I[0],
        I[1],
        A[0]
      ) + Fn(
        I[0],
        I[1],
        A[1]
      );
      qe(X, D) && (Xn(t, h[0], e), Xn(t, h[1], e), O.forEach((x) => {
        if (!x) return;
        const B = [
          x.geom,
          m[0].geom,
          m[1].geom,
          x.geom
        ], $ = {
          a: x.prop,
          b: m[0].prop,
          c: m[1].prop
        }, Y = le([B], $), L = Jn(Y);
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
function _t(e) {
  return [e[0], e[1]];
}
function Dn(e, t) {
  const [n, i] = t[0], [o, r] = t[1], [s, a] = t[2], l = s - n, f = a - i, h = o - n, c = r - i, u = e[0] - n, d = e[1] - i, _ = l * l + f * f, w = l * h + f * c, O = l * u + f * d, M = h * h + c * c, m = h * u + c * d, v = _ * M - w * w;
  if (v === 0) return !1;
  const p = 1 / v, b = (M * O - w * m) * p, g = (_ * m - w * O) * p, E = 1e-9;
  return b >= -E && g >= -E && b + g <= 1 + E;
}
function po(e) {
  const t = e.map((s) => s.slice()).filter(
    (s, a, l) => l.findIndex(
      (f) => qe(f[0], s[0]) && qe(f[1], s[1])
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
function mo(e) {
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
function qe(e, t, n = 1e-9) {
  return Math.abs(e - t) <= n;
}
const Yn = 2.00704, Rn = 3.00001;
class lt extends St {
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
    this.edges = Gn(t), this.edgeNodes = void 0, this.tins = void 0, this.indexedTins = void 0;
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
   * @param kinkLimit - forw / bakw それぞれで残す交差（kinks）の件数の上限
   *   （同じ位置の交差を 1 件に数えた件数）。届いた時点で数え上げをやめます
   */
  calculateStrictTin(t = Nn) {
    const n = this.tins.forw.features.map(
      (s) => Jn(s)
    );
    this.tins.bakw = Et(n);
    const i = {};
    this.tins.forw.features.forEach((s, a) => {
      const l = this.tins.bakw.features[a];
      ti(i, { forw: s, bakw: l });
    });
    const o = (this.pointsSet?.forw.features ?? []).map(
      (s) => s.properties.target.index
    );
    uo(
      this.tins,
      i,
      this.pointsSet?.edges || [],
      o
    );
    const r = ["forw", "bakw"].map((s) => {
      const a = this.tins[s].features.map(
        (l) => l.geometry.coordinates[0]
      );
      return Hn(a, t);
    });
    r[0].length === 0 && r[1].length === 0 ? (this.strict_status = lt.STATUS_STRICT, delete this.kinks) : (this.strict_status = lt.STATUS_ERROR, this.kinks = {
      forw: Et(r[0]),
      bakw: Et(r[1])
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
      if (go(r, this.points.length, o), s.length === 0 && a.length === 0) {
        n.push(r);
        continue;
      }
      s.unshift(this.points[r[0]][0]), s.push(this.points[r[1]][0]), a.unshift(this.points[r[0]][1]), a.push(this.points[r[1]][1]);
      const l = [s, a].map((f) => {
        const h = f.map((u, d, _) => {
          if (d === 0) return 0;
          const w = _[d - 1];
          return Math.sqrt(
            Math.pow(u[0] - w[0], 2) + Math.pow(u[1] - w[1], 2)
          );
        }), c = h.reduce((u, d, _) => _ === 0 ? [0] : (u.push(u[_ - 1] + d), u), []);
        return c.map((u, d, _) => {
          const w = u / _[_.length - 1];
          return [f[d], h[d], c[d], w];
        });
      });
      l.map((f, h) => {
        const c = l[h ? 0 : 1];
        return f.filter((u, d) => !(d === 0 || d === f.length - 1 || u[4] === "handled")).flatMap((u) => {
          const d = u[0], _ = u[3], w = c.reduce(
            (O, M, m, v) => {
              if (O) return O;
              const p = v[m + 1];
              if (M[3] === _)
                return M[4] = "handled", [M];
              if (M[3] < _ && p && p[3] > _)
                return [M, p];
            },
            void 0
          );
          if (w && w.length === 1)
            return h === 0 ? [[d, w[0][0], _]] : [[w[0][0], d, _]];
          if (w && w.length === 2) {
            const O = w[0], M = w[1], m = (_ - O[3]) / (M[3] - O[3]), v = [
              (M[0][0] - O[0][0]) * m + O[0][0],
              (M[0][1] - O[0][1]) * m + O[0][1]
            ];
            return h === 0 ? [[d, v, _]] : [[v, d, _]];
          }
          return [];
        });
      }).reduce((f, h) => f.concat(h), []).sort((f, h) => f[2] < h[2] ? -1 : 1).map((f, h, c) => {
        this.edgeNodes[i] = [
          f[0],
          f[1]
        ];
        const u = Me(
          f[0],
          f[1],
          `e${i}`
        );
        i++, t.forw.push(u), t.bakw.push(Se(u)), h === 0 ? n.push([r[0], t.forw.length - 1]) : n.push([
          t.forw.length - 2,
          t.forw.length - 1
        ]), h === c.length - 1 && n.push([t.forw.length - 1, r[1]]);
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
    if (!this.points.reduce((l, f) => l && (r ? $e(f[0], r) : f[0][0] >= t && f[0][0] <= n && f[0][1] >= i && f[0][1] <= o), !0))
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
      const l = a[0][0], f = a[0][1];
      l < t && (t = l), l > n && (n = l), f < i && (i = f), f > o && (o = f);
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
          (P) => $e(P[0], S)
        )) throw "SOME POINTS OUTSIDE";
      }
      i = this.generatePointsSet(), { minx: o, maxx: r, miny: s, maxy: a } = this.computeGcpBbox();
    } else {
      const S = this.validateAndPrepareInputs();
      i = S.pointsSet, o = S.minx, r = S.maxx, s = S.miny, a = S.maxy;
    }
    const l = {
      forw: Et(i.forw),
      bakw: Et(i.bakw)
    }, f = be(
      l.forw,
      i.edges,
      "target"
    ), h = be(
      l.bakw,
      i.edges,
      "target"
    );
    if (f.features.length === 0 || h.features.length === 0)
      throw "TOO LINEAR1";
    const c = Xi(l.forw), u = mn(l.forw);
    if (!u) throw "TOO LINEAR2";
    const d = {}, _ = u.geometry.coordinates[0];
    let w;
    try {
      w = _.map((S) => ({
        forw: S,
        bakw: ne(Rt(S), f)
      })), w.forEach((S) => {
        d[`${S.forw[0]}:${S.forw[1]}`] = S;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const O = mn(l.bakw);
    if (!O) throw "TOO LINEAR2";
    const M = O.geometry.coordinates[0];
    try {
      w = M.map((S) => ({
        bakw: S,
        forw: ne(Rt(S), h)
      })), w.forEach((S) => {
        d[`${S.forw[0]}:${S.forw[1]}`] = S;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    let m;
    if (n) {
      const S = c.geometry.coordinates, k = f.features.find(
        (P) => $e(
          Rt(S),
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
          bakw: ne(c, f)
        };
    } else
      m = {
        forw: c.geometry.coordinates,
        bakw: ne(c, f)
      };
    const v = Me(m.forw, m.bakw, "c");
    this.centroid = {
      forw: v,
      bakw: Se(v)
    };
    const p = [
      ...this.points.map((S) => ({ forw: S[0], bakw: S[1] })),
      ...(this.edgeNodes ?? []).map((S) => ({ forw: S[0], bakw: S[1] }))
    ], b = {
      convexBuf: d,
      centroid: m,
      allGcps: p,
      minx: o,
      maxx: r,
      miny: s,
      maxy: a
    }, g = this.vertexMode === lt.VERTEX_BIRDEYE ? Dr(b, n) : $r(b, n), E = {
      forw: [],
      bakw: []
    };
    for (let S = 0; S < g.length; S++) {
      const k = g[S].forw, P = g[S].bakw, N = Me(k, P, `b${S}`), C = Se(N);
      i.forw.push(N), i.bakw.push(C), E.forw.push(N), E.bakw.push(C);
    }
    this.pointsSet = {
      forw: Et(i.forw),
      bakw: Et(i.bakw),
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
      forw: $n(E.forw, this.centroid.forw),
      bakw: $n(E.bakw, this.centroid.bakw)
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
function go(e, t, n) {
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
  wo as findIntersections,
  Yn as format_version,
  ti as insertSearchIndex,
  $n as vertexCalc
};
