function oe(e, t, n = {}) {
  const i = { type: "Feature" };
  return (n.id === 0 || n.id) && (i.id = n.id), n.bbox && (i.bbox = n.bbox), i.properties = t || {}, i.geometry = e, i;
}
function Lt(e, t, n = {}) {
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
    for (var i, o, r, s, a, l, h, u = 0, c = 0, f, p = e.type, w = p === "FeatureCollection", m = p === "Feature", E = w ? e.features.length : 1, _ = 0; _ < E; _++) {
      h = w ? (
        // @ts-expect-error: Known type conflict
        e.features[_].geometry
      ) : m ? (
        // @ts-expect-error: Known type conflict
        e.geometry
      ) : e, f = h ? h.type === "GeometryCollection" : !1, a = f ? h.geometries.length : 1;
      for (var g = 0; g < a; g++) {
        var v = 0, d = 0;
        if (s = f ? h.geometries[g] : h, s !== null) {
          l = s.coordinates;
          var x = s.type;
          switch (u = n && (x === "Polygon" || x === "MultiPolygon") ? 1 : 0, x) {
            case null:
              break;
            case "Point":
              if (
                // @ts-expect-error: Known type conflict
                t(
                  l,
                  c,
                  _,
                  v,
                  d
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
                    _,
                    v,
                    d
                  ) === !1
                )
                  return !1;
                c++, x === "MultiPoint" && v++;
              }
              x === "LineString" && v++;
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
                      _,
                      v,
                      d
                    ) === !1
                  )
                    return !1;
                  c++;
                }
                x === "MultiLineString" && v++, x === "Polygon" && d++;
              }
              x === "Polygon" && v++;
              break;
            case "MultiPolygon":
              for (i = 0; i < l.length; i++) {
                for (d = 0, o = 0; o < l[i].length; o++) {
                  for (r = 0; r < l[i][o].length - u; r++) {
                    if (
                      // @ts-expect-error: Known type conflict
                      t(
                        l[i][o][r],
                        c,
                        _,
                        v,
                        d
                      ) === !1
                    )
                      return !1;
                    c++;
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
const pt = 11102230246251565e-32, U = 134217729, Rn = (3 + 8 * pt) * pt;
function ft(e, t, n, i, o) {
  let r, s, a, l, h = t[0], u = i[0], c = 0, f = 0;
  u > h == u > -h ? (r = h, h = t[++c]) : (r = u, u = i[++f]);
  let p = 0;
  if (c < e && f < n)
    for (u > h == u > -h ? (s = h + r, a = r - (s - h), h = t[++c]) : (s = u + r, a = r - (s - u), u = i[++f]), r = s, a !== 0 && (o[p++] = a); c < e && f < n; )
      u > h == u > -h ? (s = r + h, l = s - r, a = r - (s - l) + (h - l), h = t[++c]) : (s = r + u, l = s - r, a = r - (s - l) + (u - l), u = i[++f]), r = s, a !== 0 && (o[p++] = a);
  for (; c < e; )
    s = r + h, l = s - r, a = r - (s - l) + (h - l), h = t[++c], r = s, a !== 0 && (o[p++] = a);
  for (; f < n; )
    s = r + u, l = s - r, a = r - (s - l) + (u - l), u = i[++f], r = s, a !== 0 && (o[p++] = a);
  return (r !== 0 || p === 0) && (o[p++] = r), p;
}
function Mt(e, t, n, i, o, r, s, a) {
  return ft(ft(e, t, n, i, s), s, o, r, a);
}
function R(e, t, n, i) {
  let o, r, s, a, l, h, u, c, f, p, w;
  u = U * n, p = u - (u - n), w = n - p;
  let m = t[0];
  o = m * n, u = U * m, c = u - (u - m), f = m - c, s = f * w - (o - c * p - f * p - c * w);
  let E = 0;
  s !== 0 && (i[E++] = s);
  for (let _ = 1; _ < e; _++)
    m = t[_], a = m * n, u = U * m, c = u - (u - m), f = m - c, l = f * w - (a - c * p - f * p - c * w), r = o + l, h = r - o, s = o - (r - h) + (l - h), s !== 0 && (i[E++] = s), o = a + r, s = r - (o - a), s !== 0 && (i[E++] = s);
  return (o !== 0 || E === 0) && (i[E++] = o), E;
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
  let a, l, h, u, c, f, p, w, m, E, _, g, v, d, x, y, k, S;
  const A = e - o, P = n - o, N = t - r, C = i - r;
  d = A * C, f = U * A, p = f - (f - A), w = A - p, f = U * C, m = f - (f - C), E = C - m, x = w * E - (d - p * m - w * m - p * E), y = N * P, f = U * N, p = f - (f - N), w = N - p, f = U * P, m = f - (f - P), E = P - m, k = w * E - (y - p * m - w * m - p * E), _ = x - k, c = x - _, zt[0] = x - (_ + c) + (c - k), g = d + _, c = g - d, v = d - (g - c) + (_ - c), _ = v - y, c = v - _, zt[1] = v - (_ + c) + (c - y), S = g + _, c = S - g, zt[2] = g - (S - c) + (_ - c), zt[3] = S;
  let F = Ln(4, zt), b = si * s;
  if (F >= b || -F >= b || (c = e - A, a = e - (A + c) + (c - o), c = n - P, h = n - (P + c) + (c - o), c = t - N, l = t - (N + c) + (c - r), c = i - C, u = i - (C + c) + (c - r), a === 0 && l === 0 && h === 0 && u === 0) || (b = ai * s + Rn * Math.abs(F), F += A * u + C * a - (N * h + P * l), F >= b || -F >= b)) return F;
  d = a * C, f = U * a, p = f - (f - a), w = a - p, f = U * C, m = f - (f - C), E = C - m, x = w * E - (d - p * m - w * m - p * E), y = l * P, f = U * l, p = f - (f - l), w = l - p, f = U * P, m = f - (f - P), E = P - m, k = w * E - (y - p * m - w * m - p * E), _ = x - k, c = x - _, mt[0] = x - (_ + c) + (c - k), g = d + _, c = g - d, v = d - (g - c) + (_ - c), _ = v - y, c = v - _, mt[1] = v - (_ + c) + (c - y), S = g + _, c = S - g, mt[2] = g - (S - c) + (_ - c), mt[3] = S;
  const O = ft(4, zt, 4, mt, Ze);
  d = A * u, f = U * A, p = f - (f - A), w = A - p, f = U * u, m = f - (f - u), E = u - m, x = w * E - (d - p * m - w * m - p * E), y = N * h, f = U * N, p = f - (f - N), w = N - p, f = U * h, m = f - (f - h), E = h - m, k = w * E - (y - p * m - w * m - p * E), _ = x - k, c = x - _, mt[0] = x - (_ + c) + (c - k), g = d + _, c = g - d, v = d - (g - c) + (_ - c), _ = v - y, c = v - _, mt[1] = v - (_ + c) + (c - y), S = g + _, c = S - g, mt[2] = g - (S - c) + (_ - c), mt[3] = S;
  const I = ft(O, Ze, 4, mt, tn);
  d = a * u, f = U * a, p = f - (f - a), w = a - p, f = U * u, m = f - (f - u), E = u - m, x = w * E - (d - p * m - w * m - p * E), y = l * h, f = U * l, p = f - (f - l), w = l - p, f = U * h, m = f - (f - h), E = h - m, k = w * E - (y - p * m - w * m - p * E), _ = x - k, c = x - _, mt[0] = x - (_ + c) + (c - k), g = d + _, c = g - d, v = d - (g - c) + (_ - c), _ = v - y, c = v - _, mt[1] = v - (_ + c) + (c - y), S = g + _, c = S - g, mt[2] = g - (S - c) + (_ - c), mt[3] = S;
  const T = ft(I, tn, 4, mt, en);
  return en[T - 1];
}
function kt(e, t, n, i, o, r) {
  const s = (t - r) * (n - o), a = (e - o) * (i - r), l = s - a, h = Math.abs(s + a);
  return Math.abs(l) >= oi * h ? l : -ci(e, t, n, i, o, r, h);
}
const li = (10 + 96 * pt) * pt, hi = (4 + 48 * pt) * pt, fi = (44 + 576 * pt) * pt * pt, Dt = tt(4), $t = tt(4), Ft = tt(4), At = tt(4), It = tt(4), Ot = tt(4), gt = tt(4), wt = tt(4), Oe = tt(8), Pe = tt(8), Ne = tt(8), Be = tt(8), Te = tt(8), Ce = tt(8), ue = tt(8), de = tt(8), pe = tt(8), Vt = tt(4), qt = tt(4), jt = tt(4), z = tt(8), K = tt(16), nt = tt(16), it = tt(16), et = tt(32), Yt = tt(32), at = tt(48), bt = tt(64);
let Qt = tt(1152), Xe = tt(1152);
function ct(e, t, n) {
  e = ft(e, Qt, t, n, Xe);
  const i = Qt;
  return Qt = Xe, Xe = i, e;
}
function ui(e, t, n, i, o, r, s, a, l) {
  let h, u, c, f, p, w, m, E, _, g, v, d, x, y, k, S, A, P, N, C, F, b, O, I, T, X, $, M, B, D, Y, L, V, j, q;
  const J = e - s, G = n - s, Q = o - s, H = t - a, Z = i - a, W = r - a;
  Y = G * W, O = U * G, I = O - (O - G), T = G - I, O = U * W, X = O - (O - W), $ = W - X, L = T * $ - (Y - I * X - T * X - I * $), V = Q * Z, O = U * Q, I = O - (O - Q), T = Q - I, O = U * Z, X = O - (O - Z), $ = Z - X, j = T * $ - (V - I * X - T * X - I * $), M = L - j, b = L - M, Dt[0] = L - (M + b) + (b - j), B = Y + M, b = B - Y, D = Y - (B - b) + (M - b), M = D - V, b = D - M, Dt[1] = D - (M + b) + (b - V), q = B + M, b = q - B, Dt[2] = B - (q - b) + (M - b), Dt[3] = q, Y = Q * H, O = U * Q, I = O - (O - Q), T = Q - I, O = U * H, X = O - (O - H), $ = H - X, L = T * $ - (Y - I * X - T * X - I * $), V = J * W, O = U * J, I = O - (O - J), T = J - I, O = U * W, X = O - (O - W), $ = W - X, j = T * $ - (V - I * X - T * X - I * $), M = L - j, b = L - M, $t[0] = L - (M + b) + (b - j), B = Y + M, b = B - Y, D = Y - (B - b) + (M - b), M = D - V, b = D - M, $t[1] = D - (M + b) + (b - V), q = B + M, b = q - B, $t[2] = B - (q - b) + (M - b), $t[3] = q, Y = J * Z, O = U * J, I = O - (O - J), T = J - I, O = U * Z, X = O - (O - Z), $ = Z - X, L = T * $ - (Y - I * X - T * X - I * $), V = G * H, O = U * G, I = O - (O - G), T = G - I, O = U * H, X = O - (O - H), $ = H - X, j = T * $ - (V - I * X - T * X - I * $), M = L - j, b = L - M, Ft[0] = L - (M + b) + (b - j), B = Y + M, b = B - Y, D = Y - (B - b) + (M - b), M = D - V, b = D - M, Ft[1] = D - (M + b) + (b - V), q = B + M, b = q - B, Ft[2] = B - (q - b) + (M - b), Ft[3] = q, h = ft(
    ft(
      ft(
        R(R(4, Dt, J, z), z, J, K),
        K,
        R(R(4, Dt, H, z), z, H, nt),
        nt,
        et
      ),
      et,
      ft(
        R(R(4, $t, G, z), z, G, K),
        K,
        R(R(4, $t, Z, z), z, Z, nt),
        nt,
        Yt
      ),
      Yt,
      bt
    ),
    bt,
    ft(
      R(R(4, Ft, Q, z), z, Q, K),
      K,
      R(R(4, Ft, W, z), z, W, nt),
      nt,
      et
    ),
    et,
    Qt
  );
  let st = Ln(h, Qt), ht = hi * l;
  if (st >= ht || -st >= ht || (b = e - J, u = e - (J + b) + (b - s), b = t - H, p = t - (H + b) + (b - a), b = n - G, c = n - (G + b) + (b - s), b = i - Z, w = i - (Z + b) + (b - a), b = o - Q, f = o - (Q + b) + (b - s), b = r - W, m = r - (W + b) + (b - a), u === 0 && c === 0 && f === 0 && p === 0 && w === 0 && m === 0) || (ht = fi * l + Rn * Math.abs(st), st += (J * J + H * H) * (G * m + W * c - (Z * f + Q * w)) + 2 * (J * u + H * p) * (G * W - Z * Q) + ((G * G + Z * Z) * (Q * p + H * f - (W * u + J * m)) + 2 * (G * c + Z * w) * (Q * H - W * J)) + ((Q * Q + W * W) * (J * w + Z * u - (H * c + G * p)) + 2 * (Q * f + W * m) * (J * Z - H * G)), st >= ht || -st >= ht))
    return st;
  if ((c !== 0 || w !== 0 || f !== 0 || m !== 0) && (Y = J * J, O = U * J, I = O - (O - J), T = J - I, L = T * T - (Y - I * I - (I + I) * T), V = H * H, O = U * H, I = O - (O - H), T = H - I, j = T * T - (V - I * I - (I + I) * T), M = L + j, b = M - L, At[0] = L - (M - b) + (j - b), B = Y + M, b = B - Y, D = Y - (B - b) + (M - b), M = D + V, b = M - D, At[1] = D - (M - b) + (V - b), q = B + M, b = q - B, At[2] = B - (q - b) + (M - b), At[3] = q), (f !== 0 || m !== 0 || u !== 0 || p !== 0) && (Y = G * G, O = U * G, I = O - (O - G), T = G - I, L = T * T - (Y - I * I - (I + I) * T), V = Z * Z, O = U * Z, I = O - (O - Z), T = Z - I, j = T * T - (V - I * I - (I + I) * T), M = L + j, b = M - L, It[0] = L - (M - b) + (j - b), B = Y + M, b = B - Y, D = Y - (B - b) + (M - b), M = D + V, b = M - D, It[1] = D - (M - b) + (V - b), q = B + M, b = q - B, It[2] = B - (q - b) + (M - b), It[3] = q), (u !== 0 || p !== 0 || c !== 0 || w !== 0) && (Y = Q * Q, O = U * Q, I = O - (O - Q), T = Q - I, L = T * T - (Y - I * I - (I + I) * T), V = W * W, O = U * W, I = O - (O - W), T = W - I, j = T * T - (V - I * I - (I + I) * T), M = L + j, b = M - L, Ot[0] = L - (M - b) + (j - b), B = Y + M, b = B - Y, D = Y - (B - b) + (M - b), M = D + V, b = M - D, Ot[1] = D - (M - b) + (V - b), q = B + M, b = q - B, Ot[2] = B - (q - b) + (M - b), Ot[3] = q), u !== 0 && (E = R(4, Dt, u, Oe), h = ct(h, Mt(
    R(E, Oe, 2 * J, K),
    K,
    R(R(4, Ot, u, z), z, Z, nt),
    nt,
    R(R(4, It, u, z), z, -W, it),
    it,
    et,
    at
  ), at)), p !== 0 && (_ = R(4, Dt, p, Pe), h = ct(h, Mt(
    R(_, Pe, 2 * H, K),
    K,
    R(R(4, It, p, z), z, Q, nt),
    nt,
    R(R(4, Ot, p, z), z, -G, it),
    it,
    et,
    at
  ), at)), c !== 0 && (g = R(4, $t, c, Ne), h = ct(h, Mt(
    R(g, Ne, 2 * G, K),
    K,
    R(R(4, At, c, z), z, W, nt),
    nt,
    R(R(4, Ot, c, z), z, -H, it),
    it,
    et,
    at
  ), at)), w !== 0 && (v = R(4, $t, w, Be), h = ct(h, Mt(
    R(v, Be, 2 * Z, K),
    K,
    R(R(4, Ot, w, z), z, J, nt),
    nt,
    R(R(4, At, w, z), z, -Q, it),
    it,
    et,
    at
  ), at)), f !== 0 && (d = R(4, Ft, f, Te), h = ct(h, Mt(
    R(d, Te, 2 * Q, K),
    K,
    R(R(4, It, f, z), z, H, nt),
    nt,
    R(R(4, At, f, z), z, -Z, it),
    it,
    et,
    at
  ), at)), m !== 0 && (x = R(4, Ft, m, Ce), h = ct(h, Mt(
    R(x, Ce, 2 * W, K),
    K,
    R(R(4, At, m, z), z, G, nt),
    nt,
    R(R(4, It, m, z), z, -J, it),
    it,
    et,
    at
  ), at)), u !== 0 || p !== 0) {
    if (c !== 0 || w !== 0 || f !== 0 || m !== 0 ? (Y = c * W, O = U * c, I = O - (O - c), T = c - I, O = U * W, X = O - (O - W), $ = W - X, L = T * $ - (Y - I * X - T * X - I * $), V = G * m, O = U * G, I = O - (O - G), T = G - I, O = U * m, X = O - (O - m), $ = m - X, j = T * $ - (V - I * X - T * X - I * $), M = L + j, b = M - L, gt[0] = L - (M - b) + (j - b), B = Y + M, b = B - Y, D = Y - (B - b) + (M - b), M = D + V, b = M - D, gt[1] = D - (M - b) + (V - b), q = B + M, b = q - B, gt[2] = B - (q - b) + (M - b), gt[3] = q, Y = f * -Z, O = U * f, I = O - (O - f), T = f - I, O = U * -Z, X = O - (O - -Z), $ = -Z - X, L = T * $ - (Y - I * X - T * X - I * $), V = Q * -w, O = U * Q, I = O - (O - Q), T = Q - I, O = U * -w, X = O - (O - -w), $ = -w - X, j = T * $ - (V - I * X - T * X - I * $), M = L + j, b = M - L, wt[0] = L - (M - b) + (j - b), B = Y + M, b = B - Y, D = Y - (B - b) + (M - b), M = D + V, b = M - D, wt[1] = D - (M - b) + (V - b), q = B + M, b = q - B, wt[2] = B - (q - b) + (M - b), wt[3] = q, k = ft(4, gt, 4, wt, de), Y = c * m, O = U * c, I = O - (O - c), T = c - I, O = U * m, X = O - (O - m), $ = m - X, L = T * $ - (Y - I * X - T * X - I * $), V = f * w, O = U * f, I = O - (O - f), T = f - I, O = U * w, X = O - (O - w), $ = w - X, j = T * $ - (V - I * X - T * X - I * $), M = L - j, b = L - M, qt[0] = L - (M + b) + (b - j), B = Y + M, b = B - Y, D = Y - (B - b) + (M - b), M = D - V, b = D - M, qt[1] = D - (M + b) + (b - V), q = B + M, b = q - B, qt[2] = B - (q - b) + (M - b), qt[3] = q, P = 4) : (de[0] = 0, k = 1, qt[0] = 0, P = 1), u !== 0) {
      const rt = R(k, de, u, it);
      h = ct(h, ft(
        R(E, Oe, u, K),
        K,
        R(rt, it, 2 * J, et),
        et,
        at
      ), at);
      const ot = R(P, qt, u, z);
      h = ct(h, Mt(
        R(ot, z, 2 * J, K),
        K,
        R(ot, z, u, nt),
        nt,
        R(rt, it, u, et),
        et,
        Yt,
        bt
      ), bt), w !== 0 && (h = ct(h, R(R(4, Ot, u, z), z, w, K), K)), m !== 0 && (h = ct(h, R(R(4, It, -u, z), z, m, K), K));
    }
    if (p !== 0) {
      const rt = R(k, de, p, it);
      h = ct(h, ft(
        R(_, Pe, p, K),
        K,
        R(rt, it, 2 * H, et),
        et,
        at
      ), at);
      const ot = R(P, qt, p, z);
      h = ct(h, Mt(
        R(ot, z, 2 * H, K),
        K,
        R(ot, z, p, nt),
        nt,
        R(rt, it, p, et),
        et,
        Yt,
        bt
      ), bt);
    }
  }
  if (c !== 0 || w !== 0) {
    if (f !== 0 || m !== 0 || u !== 0 || p !== 0 ? (Y = f * H, O = U * f, I = O - (O - f), T = f - I, O = U * H, X = O - (O - H), $ = H - X, L = T * $ - (Y - I * X - T * X - I * $), V = Q * p, O = U * Q, I = O - (O - Q), T = Q - I, O = U * p, X = O - (O - p), $ = p - X, j = T * $ - (V - I * X - T * X - I * $), M = L + j, b = M - L, gt[0] = L - (M - b) + (j - b), B = Y + M, b = B - Y, D = Y - (B - b) + (M - b), M = D + V, b = M - D, gt[1] = D - (M - b) + (V - b), q = B + M, b = q - B, gt[2] = B - (q - b) + (M - b), gt[3] = q, C = -W, F = -m, Y = u * C, O = U * u, I = O - (O - u), T = u - I, O = U * C, X = O - (O - C), $ = C - X, L = T * $ - (Y - I * X - T * X - I * $), V = J * F, O = U * J, I = O - (O - J), T = J - I, O = U * F, X = O - (O - F), $ = F - X, j = T * $ - (V - I * X - T * X - I * $), M = L + j, b = M - L, wt[0] = L - (M - b) + (j - b), B = Y + M, b = B - Y, D = Y - (B - b) + (M - b), M = D + V, b = M - D, wt[1] = D - (M - b) + (V - b), q = B + M, b = q - B, wt[2] = B - (q - b) + (M - b), wt[3] = q, S = ft(4, gt, 4, wt, pe), Y = f * p, O = U * f, I = O - (O - f), T = f - I, O = U * p, X = O - (O - p), $ = p - X, L = T * $ - (Y - I * X - T * X - I * $), V = u * m, O = U * u, I = O - (O - u), T = u - I, O = U * m, X = O - (O - m), $ = m - X, j = T * $ - (V - I * X - T * X - I * $), M = L - j, b = L - M, jt[0] = L - (M + b) + (b - j), B = Y + M, b = B - Y, D = Y - (B - b) + (M - b), M = D - V, b = D - M, jt[1] = D - (M + b) + (b - V), q = B + M, b = q - B, jt[2] = B - (q - b) + (M - b), jt[3] = q, N = 4) : (pe[0] = 0, S = 1, jt[0] = 0, N = 1), c !== 0) {
      const rt = R(S, pe, c, it);
      h = ct(h, ft(
        R(g, Ne, c, K),
        K,
        R(rt, it, 2 * G, et),
        et,
        at
      ), at);
      const ot = R(N, jt, c, z);
      h = ct(h, Mt(
        R(ot, z, 2 * G, K),
        K,
        R(ot, z, c, nt),
        nt,
        R(rt, it, c, et),
        et,
        Yt,
        bt
      ), bt), m !== 0 && (h = ct(h, R(R(4, At, c, z), z, m, K), K)), p !== 0 && (h = ct(h, R(R(4, Ot, -c, z), z, p, K), K));
    }
    if (w !== 0) {
      const rt = R(S, pe, w, it);
      h = ct(h, ft(
        R(v, Be, w, K),
        K,
        R(rt, it, 2 * Z, et),
        et,
        at
      ), at);
      const ot = R(N, jt, w, z);
      h = ct(h, Mt(
        R(ot, z, 2 * Z, K),
        K,
        R(ot, z, w, nt),
        nt,
        R(rt, it, w, et),
        et,
        Yt,
        bt
      ), bt);
    }
  }
  if (f !== 0 || m !== 0) {
    if (u !== 0 || p !== 0 || c !== 0 || w !== 0 ? (Y = u * Z, O = U * u, I = O - (O - u), T = u - I, O = U * Z, X = O - (O - Z), $ = Z - X, L = T * $ - (Y - I * X - T * X - I * $), V = J * w, O = U * J, I = O - (O - J), T = J - I, O = U * w, X = O - (O - w), $ = w - X, j = T * $ - (V - I * X - T * X - I * $), M = L + j, b = M - L, gt[0] = L - (M - b) + (j - b), B = Y + M, b = B - Y, D = Y - (B - b) + (M - b), M = D + V, b = M - D, gt[1] = D - (M - b) + (V - b), q = B + M, b = q - B, gt[2] = B - (q - b) + (M - b), gt[3] = q, C = -H, F = -p, Y = c * C, O = U * c, I = O - (O - c), T = c - I, O = U * C, X = O - (O - C), $ = C - X, L = T * $ - (Y - I * X - T * X - I * $), V = G * F, O = U * G, I = O - (O - G), T = G - I, O = U * F, X = O - (O - F), $ = F - X, j = T * $ - (V - I * X - T * X - I * $), M = L + j, b = M - L, wt[0] = L - (M - b) + (j - b), B = Y + M, b = B - Y, D = Y - (B - b) + (M - b), M = D + V, b = M - D, wt[1] = D - (M - b) + (V - b), q = B + M, b = q - B, wt[2] = B - (q - b) + (M - b), wt[3] = q, y = ft(4, gt, 4, wt, ue), Y = u * w, O = U * u, I = O - (O - u), T = u - I, O = U * w, X = O - (O - w), $ = w - X, L = T * $ - (Y - I * X - T * X - I * $), V = c * p, O = U * c, I = O - (O - c), T = c - I, O = U * p, X = O - (O - p), $ = p - X, j = T * $ - (V - I * X - T * X - I * $), M = L - j, b = L - M, Vt[0] = L - (M + b) + (b - j), B = Y + M, b = B - Y, D = Y - (B - b) + (M - b), M = D - V, b = D - M, Vt[1] = D - (M + b) + (b - V), q = B + M, b = q - B, Vt[2] = B - (q - b) + (M - b), Vt[3] = q, A = 4) : (ue[0] = 0, y = 1, Vt[0] = 0, A = 1), f !== 0) {
      const rt = R(y, ue, f, it);
      h = ct(h, ft(
        R(d, Te, f, K),
        K,
        R(rt, it, 2 * Q, et),
        et,
        at
      ), at);
      const ot = R(A, Vt, f, z);
      h = ct(h, Mt(
        R(ot, z, 2 * Q, K),
        K,
        R(ot, z, f, nt),
        nt,
        R(rt, it, f, et),
        et,
        Yt,
        bt
      ), bt), p !== 0 && (h = ct(h, R(R(4, It, f, z), z, p, K), K)), w !== 0 && (h = ct(h, R(R(4, At, -f, z), z, w, K), K));
    }
    if (m !== 0) {
      const rt = R(y, ue, m, it);
      h = ct(h, ft(
        R(x, Ce, m, K),
        K,
        R(rt, it, 2 * W, et),
        et,
        at
      ), at);
      const ot = R(A, Vt, m, z);
      h = ct(h, Mt(
        R(ot, z, 2 * W, K),
        K,
        R(ot, z, m, nt),
        nt,
        R(rt, it, m, et),
        et,
        Yt,
        bt
      ), bt);
    }
  }
  return Qt[h - 1];
}
function di(e, t, n, i, o, r, s, a) {
  const l = e - s, h = n - s, u = o - s, c = t - a, f = i - a, p = r - a, w = h * p, m = u * f, E = l * l + c * c, _ = u * c, g = l * p, v = h * h + f * f, d = l * f, x = h * c, y = u * u + p * p, k = E * (w - m) + v * (_ - g) + y * (d - x), S = (Math.abs(w) + Math.abs(m)) * E + (Math.abs(_) + Math.abs(g)) * v + (Math.abs(d) + Math.abs(x)) * y, A = li * S;
  return k > A || -k > A ? k : ui(e, t, n, i, o, r, s, a, S);
}
function pi(e, t) {
  var n, i, o = 0, r, s, a, l, h, u, c, f = e[0], p = e[1], w = t.length;
  for (n = 0; n < w; n++) {
    i = 0;
    var m = t[n], E = m.length - 1;
    if (u = m[0], u[0] !== m[E][0] && u[1] !== m[E][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (s = u[0] - f, a = u[1] - p, i; i < E; i++) {
      if (c = m[i + 1], l = c[0] - f, h = c[1] - p, a === 0 && h === 0) {
        if (l <= 0 && s >= 0 || s <= 0 && l >= 0)
          return 0;
      } else if (h >= 0 && a <= 0 || h <= 0 && a >= 0) {
        if (r = kt(s, l, a, h, 0, 0), r === 0)
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
class Ge {
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
  default: Ge
}, Symbol.toStringTag, { value: "Module" })), Tt = 11102230246251565e-32, ut = 134217729, yi = (3 + 8 * Tt) * Tt;
function $e(e, t, n, i, o) {
  let r, s, a, l, h = t[0], u = i[0], c = 0, f = 0;
  u > h == u > -h ? (r = h, h = t[++c]) : (r = u, u = i[++f]);
  let p = 0;
  if (c < e && f < n)
    for (u > h == u > -h ? (s = h + r, a = r - (s - h), h = t[++c]) : (s = u + r, a = r - (s - u), u = i[++f]), r = s, a !== 0 && (o[p++] = a); c < e && f < n; )
      u > h == u > -h ? (s = r + h, l = s - r, a = r - (s - l) + (h - l), h = t[++c]) : (s = r + u, l = s - r, a = r - (s - l) + (u - l), u = i[++f]), r = s, a !== 0 && (o[p++] = a);
  for (; c < e; )
    s = r + h, l = s - r, a = r - (s - l) + (h - l), h = t[++c], r = s, a !== 0 && (o[p++] = a);
  for (; f < n; )
    s = r + u, l = s - r, a = r - (s - l) + (u - l), u = i[++f], r = s, a !== 0 && (o[p++] = a);
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
const bi = (3 + 16 * Tt) * Tt, xi = (2 + 12 * Tt) * Tt, _i = (9 + 64 * Tt) * Tt * Tt, Gt = he(4), nn = he(8), rn = he(12), on = he(16), yt = he(4);
function Mi(e, t, n, i, o, r, s) {
  let a, l, h, u, c, f, p, w, m, E, _, g, v, d, x, y, k, S;
  const A = e - o, P = n - o, N = t - r, C = i - r;
  d = A * C, f = ut * A, p = f - (f - A), w = A - p, f = ut * C, m = f - (f - C), E = C - m, x = w * E - (d - p * m - w * m - p * E), y = N * P, f = ut * N, p = f - (f - N), w = N - p, f = ut * P, m = f - (f - P), E = P - m, k = w * E - (y - p * m - w * m - p * E), _ = x - k, c = x - _, Gt[0] = x - (_ + c) + (c - k), g = d + _, c = g - d, v = d - (g - c) + (_ - c), _ = v - y, c = v - _, Gt[1] = v - (_ + c) + (c - y), S = g + _, c = S - g, Gt[2] = g - (S - c) + (_ - c), Gt[3] = S;
  let F = vi(4, Gt), b = xi * s;
  if (F >= b || -F >= b || (c = e - A, a = e - (A + c) + (c - o), c = n - P, h = n - (P + c) + (c - o), c = t - N, l = t - (N + c) + (c - r), c = i - C, u = i - (C + c) + (c - r), a === 0 && l === 0 && h === 0 && u === 0) || (b = _i * s + yi * Math.abs(F), F += A * u + C * a - (N * h + P * l), F >= b || -F >= b)) return F;
  d = a * C, f = ut * a, p = f - (f - a), w = a - p, f = ut * C, m = f - (f - C), E = C - m, x = w * E - (d - p * m - w * m - p * E), y = l * P, f = ut * l, p = f - (f - l), w = l - p, f = ut * P, m = f - (f - P), E = P - m, k = w * E - (y - p * m - w * m - p * E), _ = x - k, c = x - _, yt[0] = x - (_ + c) + (c - k), g = d + _, c = g - d, v = d - (g - c) + (_ - c), _ = v - y, c = v - _, yt[1] = v - (_ + c) + (c - y), S = g + _, c = S - g, yt[2] = g - (S - c) + (_ - c), yt[3] = S;
  const O = $e(4, Gt, 4, yt, nn);
  d = A * u, f = ut * A, p = f - (f - A), w = A - p, f = ut * u, m = f - (f - u), E = u - m, x = w * E - (d - p * m - w * m - p * E), y = N * h, f = ut * N, p = f - (f - N), w = N - p, f = ut * h, m = f - (f - h), E = h - m, k = w * E - (y - p * m - w * m - p * E), _ = x - k, c = x - _, yt[0] = x - (_ + c) + (c - k), g = d + _, c = g - d, v = d - (g - c) + (_ - c), _ = v - y, c = v - _, yt[1] = v - (_ + c) + (c - y), S = g + _, c = S - g, yt[2] = g - (S - c) + (_ - c), yt[3] = S;
  const I = $e(O, nn, 4, yt, rn);
  d = a * u, f = ut * a, p = f - (f - a), w = a - p, f = ut * u, m = f - (f - u), E = u - m, x = w * E - (d - p * m - w * m - p * E), y = l * h, f = ut * l, p = f - (f - l), w = l - p, f = ut * h, m = f - (f - h), E = h - m, k = w * E - (y - p * m - w * m - p * E), _ = x - k, c = x - _, yt[0] = x - (_ + c) + (c - k), g = d + _, c = g - d, v = d - (g - c) + (_ - c), _ = v - y, c = v - _, yt[1] = v - (_ + c) + (c - y), S = g + _, c = S - g, yt[2] = g - (S - c) + (_ - c), yt[3] = S;
  const T = $e(I, rn, 4, yt, on);
  return on[T - 1];
}
function sn(e, t, n, i, o, r) {
  const s = (t - r) * (n - o), a = (e - o) * (i - r), l = s - a;
  if (s === 0 || a === 0 || s > 0 != a > 0) return l;
  const h = Math.abs(s + a);
  return Math.abs(l) >= bi * h ? l : -Mi(e, t, n, i, o, r, h);
}
function Si(e, t) {
  const n = new Ge([], Vn);
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
  const n = [], i = new Ge([], Ei);
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
  const f = (h - a) * (o - n) - (l - s) * (r - i), p = (l - s) * (i - a) - (h - a) * (n - s), w = (o - n) * (i - a) - (r - i) * (n - s);
  if (f === 0)
    return !1;
  const m = p / f, E = w / f;
  if (m >= 0 && m <= 1 && E >= 0 && E <= 1) {
    const _ = n + m * (o - n), g = i + m * (r - i);
    return [_, g];
  }
  return !1;
}
function Pi(e, t, n = {}) {
  const { removeDuplicates: i = !0, ignoreSelfIntersections: o = !0 } = n;
  let r = [];
  e.type === "FeatureCollection" ? r = r.concat(e.features) : e.type === "Feature" ? r.push(e) : (e.type === "LineString" || e.type === "Polygon" || e.type === "MultiLineString" || e.type === "MultiPolygon") && r.push(oe(e)), t.type === "FeatureCollection" ? r = r.concat(t.features) : t.type === "Feature" ? r.push(t) : (t.type === "LineString" || t.type === "Polygon" || t.type === "MultiLineString" || t.type === "MultiPolygon") && r.push(oe(t));
  const s = Si(
    Et(r),
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
  return Et(a.map((l) => Lt(l)));
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
  ), Lt([n / o, i / o], t.properties);
}
var ye = { exports: {} }, ke = { exports: {} }, Ci = ke.exports, ln;
function Xi() {
  return ln || (ln = 1, (function(e, t) {
    (function(n, i) {
      e.exports = i();
    })(Ci, function() {
      function n(g, v, d, x, y) {
        (function k(S, A, P, N, C) {
          for (; N > P; ) {
            if (N - P > 600) {
              var F = N - P + 1, b = A - P + 1, O = Math.log(F), I = 0.5 * Math.exp(2 * O / 3), T = 0.5 * Math.sqrt(O * I * (F - I) / F) * (b - F / 2 < 0 ? -1 : 1), X = Math.max(P, Math.floor(A - b * I / F + T)), $ = Math.min(N, Math.floor(A + (F - b) * I / F + T));
              k(S, A, X, $, C);
            }
            var M = S[A], B = P, D = N;
            for (i(S, P, A), C(S[N], M) > 0 && i(S, P, N); B < D; ) {
              for (i(S, B, D), B++, D--; C(S[B], M) < 0; ) B++;
              for (; C(S[D], M) > 0; ) D--;
            }
            C(S[P], M) === 0 ? i(S, P, D) : i(S, ++D, N), D <= A && (P = D + 1), A <= D && (N = D - 1);
          }
        })(g, v, d || 0, x || g.length - 1, y || o);
      }
      function i(g, v, d) {
        var x = g[v];
        g[v] = g[d], g[d] = x;
      }
      function o(g, v) {
        return g < v ? -1 : g > v ? 1 : 0;
      }
      var r = function(g) {
        g === void 0 && (g = 9), this._maxEntries = Math.max(4, g), this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries)), this.clear();
      };
      function s(g, v, d) {
        if (!d) return v.indexOf(g);
        for (var x = 0; x < v.length; x++) if (d(g, v[x])) return x;
        return -1;
      }
      function a(g, v) {
        l(g, 0, g.children.length, v, g);
      }
      function l(g, v, d, x, y) {
        y || (y = E(null)), y.minX = 1 / 0, y.minY = 1 / 0, y.maxX = -1 / 0, y.maxY = -1 / 0;
        for (var k = v; k < d; k++) {
          var S = g.children[k];
          h(y, g.leaf ? x(S) : S);
        }
        return y;
      }
      function h(g, v) {
        return g.minX = Math.min(g.minX, v.minX), g.minY = Math.min(g.minY, v.minY), g.maxX = Math.max(g.maxX, v.maxX), g.maxY = Math.max(g.maxY, v.maxY), g;
      }
      function u(g, v) {
        return g.minX - v.minX;
      }
      function c(g, v) {
        return g.minY - v.minY;
      }
      function f(g) {
        return (g.maxX - g.minX) * (g.maxY - g.minY);
      }
      function p(g) {
        return g.maxX - g.minX + (g.maxY - g.minY);
      }
      function w(g, v) {
        return g.minX <= v.minX && g.minY <= v.minY && v.maxX <= g.maxX && v.maxY <= g.maxY;
      }
      function m(g, v) {
        return v.minX <= g.maxX && v.minY <= g.maxY && v.maxX >= g.minX && v.maxY >= g.minY;
      }
      function E(g) {
        return { children: g, height: 1, leaf: !0, minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
      }
      function _(g, v, d, x, y) {
        for (var k = [v, d]; k.length; ) if (!((d = k.pop()) - (v = k.pop()) <= x)) {
          var S = v + Math.ceil((d - v) / x / 2) * x;
          n(g, S, v, d, y), k.push(v, S, S, d);
        }
      }
      return r.prototype.all = function() {
        return this._all(this.data, []);
      }, r.prototype.search = function(g) {
        var v = this.data, d = [];
        if (!m(g, v)) return d;
        for (var x = this.toBBox, y = []; v; ) {
          for (var k = 0; k < v.children.length; k++) {
            var S = v.children[k], A = v.leaf ? x(S) : S;
            m(g, A) && (v.leaf ? d.push(S) : w(g, A) ? this._all(S, d) : y.push(S));
          }
          v = y.pop();
        }
        return d;
      }, r.prototype.collides = function(g) {
        var v = this.data;
        if (!m(g, v)) return !1;
        for (var d = []; v; ) {
          for (var x = 0; x < v.children.length; x++) {
            var y = v.children[x], k = v.leaf ? this.toBBox(y) : y;
            if (m(g, k)) {
              if (v.leaf || w(g, k)) return !0;
              d.push(y);
            }
          }
          v = d.pop();
        }
        return !1;
      }, r.prototype.load = function(g) {
        if (!g || !g.length) return this;
        if (g.length < this._minEntries) {
          for (var v = 0; v < g.length; v++) this.insert(g[v]);
          return this;
        }
        var d = this._build(g.slice(), 0, g.length - 1, 0);
        if (this.data.children.length) if (this.data.height === d.height) this._splitRoot(this.data, d);
        else {
          if (this.data.height < d.height) {
            var x = this.data;
            this.data = d, d = x;
          }
          this._insert(d, this.data.height - d.height - 1, !0);
        }
        else this.data = d;
        return this;
      }, r.prototype.insert = function(g) {
        return g && this._insert(g, this.data.height - 1), this;
      }, r.prototype.clear = function() {
        return this.data = E([]), this;
      }, r.prototype.remove = function(g, v) {
        if (!g) return this;
        for (var d, x, y, k = this.data, S = this.toBBox(g), A = [], P = []; k || A.length; ) {
          if (k || (k = A.pop(), x = A[A.length - 1], d = P.pop(), y = !0), k.leaf) {
            var N = s(g, k.children, v);
            if (N !== -1) return k.children.splice(N, 1), A.push(k), this._condense(A), this;
          }
          y || k.leaf || !w(k, S) ? x ? (d++, k = x.children[d], y = !1) : k = null : (A.push(k), P.push(d), d = 0, x = k, k = k.children[0]);
        }
        return this;
      }, r.prototype.toBBox = function(g) {
        return g;
      }, r.prototype.compareMinX = function(g, v) {
        return g.minX - v.minX;
      }, r.prototype.compareMinY = function(g, v) {
        return g.minY - v.minY;
      }, r.prototype.toJSON = function() {
        return this.data;
      }, r.prototype.fromJSON = function(g) {
        return this.data = g, this;
      }, r.prototype._all = function(g, v) {
        for (var d = []; g; ) g.leaf ? v.push.apply(v, g.children) : d.push.apply(d, g.children), g = d.pop();
        return v;
      }, r.prototype._build = function(g, v, d, x) {
        var y, k = d - v + 1, S = this._maxEntries;
        if (k <= S) return a(y = E(g.slice(v, d + 1)), this.toBBox), y;
        x || (x = Math.ceil(Math.log(k) / Math.log(S)), S = Math.ceil(k / Math.pow(S, x - 1))), (y = E([])).leaf = !1, y.height = x;
        var A = Math.ceil(k / S), P = A * Math.ceil(Math.sqrt(S));
        _(g, v, d, P, this.compareMinX);
        for (var N = v; N <= d; N += P) {
          var C = Math.min(N + P - 1, d);
          _(g, N, C, A, this.compareMinY);
          for (var F = N; F <= C; F += A) {
            var b = Math.min(F + A - 1, C);
            y.children.push(this._build(g, F, b, x - 1));
          }
        }
        return a(y, this.toBBox), y;
      }, r.prototype._chooseSubtree = function(g, v, d, x) {
        for (; x.push(v), !v.leaf && x.length - 1 !== d; ) {
          for (var y = 1 / 0, k = 1 / 0, S = void 0, A = 0; A < v.children.length; A++) {
            var P = v.children[A], N = f(P), C = (F = g, b = P, (Math.max(b.maxX, F.maxX) - Math.min(b.minX, F.minX)) * (Math.max(b.maxY, F.maxY) - Math.min(b.minY, F.minY)) - N);
            C < k ? (k = C, y = N < y ? N : y, S = P) : C === k && N < y && (y = N, S = P);
          }
          v = S || v.children[0];
        }
        var F, b;
        return v;
      }, r.prototype._insert = function(g, v, d) {
        var x = d ? g : this.toBBox(g), y = [], k = this._chooseSubtree(x, this.data, v, y);
        for (k.children.push(g), h(k, x); v >= 0 && y[v].children.length > this._maxEntries; ) this._split(y, v), v--;
        this._adjustParentBBoxes(x, y, v);
      }, r.prototype._split = function(g, v) {
        var d = g[v], x = d.children.length, y = this._minEntries;
        this._chooseSplitAxis(d, y, x);
        var k = this._chooseSplitIndex(d, y, x), S = E(d.children.splice(k, d.children.length - k));
        S.height = d.height, S.leaf = d.leaf, a(d, this.toBBox), a(S, this.toBBox), v ? g[v - 1].children.push(S) : this._splitRoot(d, S);
      }, r.prototype._splitRoot = function(g, v) {
        this.data = E([g, v]), this.data.height = g.height + 1, this.data.leaf = !1, a(this.data, this.toBBox);
      }, r.prototype._chooseSplitIndex = function(g, v, d) {
        for (var x, y, k, S, A, P, N, C = 1 / 0, F = 1 / 0, b = v; b <= d - v; b++) {
          var O = l(g, 0, b, this.toBBox), I = l(g, b, d, this.toBBox), T = (y = O, k = I, S = void 0, A = void 0, P = void 0, N = void 0, S = Math.max(y.minX, k.minX), A = Math.max(y.minY, k.minY), P = Math.min(y.maxX, k.maxX), N = Math.min(y.maxY, k.maxY), Math.max(0, P - S) * Math.max(0, N - A)), X = f(O) + f(I);
          T < C ? (C = T, x = b, F = X < F ? X : F) : T === C && X < F && (F = X, x = b);
        }
        return x || d - v;
      }, r.prototype._chooseSplitAxis = function(g, v, d) {
        var x = g.leaf ? this.compareMinX : u, y = g.leaf ? this.compareMinY : c;
        this._allDistMargin(g, v, d, x) < this._allDistMargin(g, v, d, y) && g.children.sort(x);
      }, r.prototype._allDistMargin = function(g, v, d, x) {
        g.children.sort(x);
        for (var y = this.toBBox, k = l(g, 0, v, y), S = l(g, d - v, d, y), A = p(k) + p(S), P = v; P < d - v; P++) {
          var N = g.children[P];
          h(k, g.leaf ? y(N) : N), A += p(k);
        }
        for (var C = d - v - 1; C >= v; C--) {
          var F = g.children[C];
          h(S, g.leaf ? y(F) : F), A += p(S);
        }
        return A;
      }, r.prototype._adjustParentBBoxes = function(g, v, d) {
        for (var x = d; x >= 0; x--) h(v[x], g);
      }, r.prototype._condense = function(g) {
        for (var v = g.length - 1, d = void 0; v >= 0; v--) g[v].children.length === 0 ? v > 0 ? (d = g[v - 1].children).splice(d.indexOf(g[v]), 1) : this.clear() : a(g[v], this.toBBox);
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
    for (var l = (o - i) / 2, h = 0, u = l - 1; h < l; u = h++) {
      var c = n[i + h * 2 + 0], f = n[i + h * 2 + 1], p = n[i + u * 2 + 0], w = n[i + u * 2 + 1], m = f > s != w > s && r < (p - c) * (s - f) / (w - f) + c;
      m && (a = !a);
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
      var c = n[h + i][0], f = n[h + i][1], p = n[u + i][0], w = n[u + i][1], m = f > s != w > s && r < (p - c) * (s - f) / (w - f) + c;
      m && (a = !a);
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
      function r(m, E, _, g, v) {
        let d, x, y, k, S = E[0], A = g[0], P = 0, N = 0;
        A > S == A > -S ? (d = S, S = E[++P]) : (d = A, A = g[++N]);
        let C = 0;
        if (P < m && N < _) for (A > S == A > -S ? (y = d - ((x = S + d) - S), S = E[++P]) : (y = d - ((x = A + d) - A), A = g[++N]), d = x, y !== 0 && (v[C++] = y); P < m && N < _; ) A > S == A > -S ? (y = d - ((x = d + S) - (k = x - d)) + (S - k), S = E[++P]) : (y = d - ((x = d + A) - (k = x - d)) + (A - k), A = g[++N]), d = x, y !== 0 && (v[C++] = y);
        for (; P < m; ) y = d - ((x = d + S) - (k = x - d)) + (S - k), S = E[++P], d = x, y !== 0 && (v[C++] = y);
        for (; N < _; ) y = d - ((x = d + A) - (k = x - d)) + (A - k), A = g[++N], d = x, y !== 0 && (v[C++] = y);
        return d === 0 && C !== 0 || (v[C++] = d), C;
      }
      function s(m) {
        return new Float64Array(m);
      }
      const a = 33306690738754716e-32, l = 22204460492503146e-32, h = 11093356479670487e-47, u = s(4), c = s(8), f = s(12), p = s(16), w = s(4);
      n.orient2d = function(m, E, _, g, v, d) {
        const x = (E - d) * (_ - v), y = (m - v) * (g - d), k = x - y;
        if (x === 0 || y === 0 || x > 0 != y > 0) return k;
        const S = Math.abs(x + y);
        return Math.abs(k) >= a * S ? k : -(function(A, P, N, C, F, b, O) {
          let I, T, X, $, M, B, D, Y, L, V, j, q, J, G, Q, H, Z, W;
          const st = A - F, ht = N - F, rt = P - b, ot = C - b;
          M = (Q = (Y = st - (D = (B = 134217729 * st) - (B - st))) * (V = ot - (L = (B = 134217729 * ot) - (B - ot))) - ((G = st * ot) - D * L - Y * L - D * V)) - (j = Q - (Z = (Y = rt - (D = (B = 134217729 * rt) - (B - rt))) * (V = ht - (L = (B = 134217729 * ht) - (B - ht))) - ((H = rt * ht) - D * L - Y * L - D * V))), u[0] = Q - (j + M) + (M - Z), M = (J = G - ((q = G + j) - (M = q - G)) + (j - M)) - (j = J - H), u[1] = J - (j + M) + (M - H), M = (W = q + j) - q, u[2] = q - (W - M) + (j - M), u[3] = W;
          let Xt = (function(ni, Ke) {
            let Qe = Ke[0];
            for (let Ie = 1; Ie < ni; Ie++) Qe += Ke[Ie];
            return Qe;
          })(4, u), Wt = l * O;
          if (Xt >= Wt || -Xt >= Wt || (I = A - (st + (M = A - st)) + (M - F), X = N - (ht + (M = N - ht)) + (M - F), T = P - (rt + (M = P - rt)) + (M - b), $ = C - (ot + (M = C - ot)) + (M - b), I === 0 && T === 0 && X === 0 && $ === 0) || (Wt = h * O + o * Math.abs(Xt), (Xt += st * $ + ot * I - (rt * X + ht * T)) >= Wt || -Xt >= Wt)) return Xt;
          M = (Q = (Y = I - (D = (B = 134217729 * I) - (B - I))) * (V = ot - (L = (B = 134217729 * ot) - (B - ot))) - ((G = I * ot) - D * L - Y * L - D * V)) - (j = Q - (Z = (Y = T - (D = (B = 134217729 * T) - (B - T))) * (V = ht - (L = (B = 134217729 * ht) - (B - ht))) - ((H = T * ht) - D * L - Y * L - D * V))), w[0] = Q - (j + M) + (M - Z), M = (J = G - ((q = G + j) - (M = q - G)) + (j - M)) - (j = J - H), w[1] = J - (j + M) + (M - H), M = (W = q + j) - q, w[2] = q - (W - M) + (j - M), w[3] = W;
          const Zn = r(4, u, 4, w, c);
          M = (Q = (Y = st - (D = (B = 134217729 * st) - (B - st))) * (V = $ - (L = (B = 134217729 * $) - (B - $))) - ((G = st * $) - D * L - Y * L - D * V)) - (j = Q - (Z = (Y = rt - (D = (B = 134217729 * rt) - (B - rt))) * (V = X - (L = (B = 134217729 * X) - (B - X))) - ((H = rt * X) - D * L - Y * L - D * V))), w[0] = Q - (j + M) + (M - Z), M = (J = G - ((q = G + j) - (M = q - G)) + (j - M)) - (j = J - H), w[1] = J - (j + M) + (M - H), M = (W = q + j) - q, w[2] = q - (W - M) + (j - M), w[3] = W;
          const ti = r(Zn, c, 4, w, f);
          M = (Q = (Y = I - (D = (B = 134217729 * I) - (B - I))) * (V = $ - (L = (B = 134217729 * $) - (B - $))) - ((G = I * $) - D * L - Y * L - D * V)) - (j = Q - (Z = (Y = T - (D = (B = 134217729 * T) - (B - T))) * (V = X - (L = (B = 134217729 * X) - (B - X))) - ((H = T * X) - D * L - Y * L - D * V))), w[0] = Q - (j + M) + (M - Z), M = (J = G - ((q = G + j) - (M = q - G)) + (j - M)) - (j = J - H), w[1] = J - (j + M) + (M - H), M = (W = q + j) - q, w[2] = q - (W - M) + (j - M), w[3] = W;
          const ei = r(ti, f, 4, w, p);
          return p[ei - 1];
        })(m, E, _, g, v, d, S);
      }, n.orient2dfast = function(m, E, _, g, v, d) {
        return (E - d) * (_ - v) - (m - v) * (g - d);
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
  function o(d, x, y) {
    x = Math.max(0, x === void 0 ? 2 : x), y = y || 0;
    var k = p(d), S = new e(16);
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
    }, S.load(d);
    for (var A = [], P = 0, N; P < k.length; P++) {
      var C = k[P];
      S.remove(C), N = w(C, N), A.push(N);
    }
    var F = new e(16);
    for (P = 0; P < A.length; P++) F.insert(f(A[P]));
    for (var b = x * x, O = y * y; A.length; ) {
      var I = A.shift(), T = I.p, X = I.next.p, $ = m(T, X);
      if (!($ < O)) {
        var M = $ / b;
        C = r(S, I.prev.p, T, X, I.next.next.p, M, F), C && Math.min(m(C, T), m(C, X)) <= M && (A.push(I), A.push(w(C, I)), S.remove(C), F.remove(I), F.insert(f(I)), F.insert(f(I.next)));
      }
    }
    I = N;
    var B = [];
    do
      B.push(I.p), I = I.next;
    while (I !== N);
    return B.push(I.p), B;
  }
  function r(d, x, y, k, S, A, P) {
    for (var N = new t([], s), C = d.data; C; ) {
      for (var F = 0; F < C.children.length; F++) {
        var b = C.children[F], O = C.leaf ? E(b, y, k) : a(y, k, b);
        O > A || N.push({
          node: b,
          dist: O
        });
      }
      for (; N.length && !N.peek().node.children; ) {
        var I = N.pop(), T = I.node, X = E(T, x, y), $ = E(T, k, S);
        if (I.dist < X && I.dist < $ && h(y, T, P) && h(k, T, P)) return T;
      }
      C = N.pop(), C && (C = C.node);
    }
    return null;
  }
  function s(d, x) {
    return d.dist - x.dist;
  }
  function a(d, x, y) {
    if (l(d, y) || l(x, y)) return 0;
    var k = _(d[0], d[1], x[0], x[1], y.minX, y.minY, y.maxX, y.minY);
    if (k === 0) return 0;
    var S = _(d[0], d[1], x[0], x[1], y.minX, y.minY, y.minX, y.maxY);
    if (S === 0) return 0;
    var A = _(d[0], d[1], x[0], x[1], y.maxX, y.minY, y.maxX, y.maxY);
    if (A === 0) return 0;
    var P = _(d[0], d[1], x[0], x[1], y.minX, y.maxY, y.maxX, y.maxY);
    return P === 0 ? 0 : Math.min(k, S, A, P);
  }
  function l(d, x) {
    return d[0] >= x.minX && d[0] <= x.maxX && d[1] >= x.minY && d[1] <= x.maxY;
  }
  function h(d, x, y) {
    for (var k = Math.min(d[0], x[0]), S = Math.min(d[1], x[1]), A = Math.max(d[0], x[0]), P = Math.max(d[1], x[1]), N = y.search({ minX: k, minY: S, maxX: A, maxY: P }), C = 0; C < N.length; C++)
      if (c(N[C].p, N[C].next.p, d, x)) return !1;
    return !0;
  }
  function u(d, x, y) {
    return i(d[0], d[1], x[0], x[1], y[0], y[1]);
  }
  function c(d, x, y, k) {
    return d !== k && x !== y && u(d, x, y) > 0 != u(d, x, k) > 0 && u(y, k, d) > 0 != u(y, k, x) > 0;
  }
  function f(d) {
    var x = d.p, y = d.next.p;
    return d.minX = Math.min(x[0], y[0]), d.minY = Math.min(x[1], y[1]), d.maxX = Math.max(x[0], y[0]), d.maxY = Math.max(x[1], y[1]), d;
  }
  function p(d) {
    for (var x = d[0], y = d[0], k = d[0], S = d[0], A = 0; A < d.length; A++) {
      var P = d[A];
      P[0] < x[0] && (x = P), P[0] > k[0] && (k = P), P[1] < y[1] && (y = P), P[1] > S[1] && (S = P);
    }
    var N = [x, y, k, S], C = N.slice();
    for (A = 0; A < d.length; A++)
      n(d[A], N) || C.push(d[A]);
    return v(C);
  }
  function w(d, x) {
    var y = {
      p: d,
      prev: null,
      next: null,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };
    return x ? (y.next = x.next, y.prev = x, x.next.prev = y, x.next = y) : (y.prev = y, y.next = y), y;
  }
  function m(d, x) {
    var y = d[0] - x[0], k = d[1] - x[1];
    return y * y + k * k;
  }
  function E(d, x, y) {
    var k = x[0], S = x[1], A = y[0] - k, P = y[1] - S;
    if (A !== 0 || P !== 0) {
      var N = ((d[0] - k) * A + (d[1] - S) * P) / (A * A + P * P);
      N > 1 ? (k = y[0], S = y[1]) : N > 0 && (k += A * N, S += P * N);
    }
    return A = d[0] - k, P = d[1] - S, A * A + P * P;
  }
  function _(d, x, y, k, S, A, P, N) {
    var C = y - d, F = k - x, b = P - S, O = N - A, I = d - S, T = x - A, X = C * C + F * F, $ = C * b + F * O, M = b * b + O * O, B = C * I + F * T, D = b * I + O * T, Y = X * M - $ * $, L, V, j, q, J = Y, G = Y;
    Y === 0 ? (V = 0, J = 1, q = D, G = M) : (V = $ * D - M * B, q = X * D - $ * B, V < 0 ? (V = 0, q = D, G = M) : V > J && (V = J, q = D + $, G = M)), q < 0 ? (q = 0, -B < 0 ? V = 0 : -B > X ? V = J : (V = -B, J = X)) : q > G && (q = G, -B + $ < 0 ? V = 0 : -B + $ > X ? V = J : (V = -B + $, J = X)), L = V === 0 ? 0 : V / J, j = q === 0 ? 0 : q / G;
    var Q = (1 - L) * d + L * y, H = (1 - L) * x + L * k, Z = (1 - j) * S + j * P, W = (1 - j) * A + j * N, st = Z - Q, ht = W - H;
    return st * st + ht * ht;
  }
  function g(d, x) {
    return d[0] === x[0] ? d[1] - x[1] : d[0] - x[0];
  }
  function v(d) {
    d.sort(g);
    for (var x = [], y = 0; y < d.length; y++) {
      for (; x.length >= 2 && u(x[x.length - 2], x[x.length - 1], d[y]) <= 0; )
        x.pop();
      x.push(d[y]);
    }
    for (var k = [], S = d.length - 1; S >= 0; S--) {
      for (; k.length >= 2 && u(k[k.length - 2], k[k.length - 1], d[S]) <= 0; )
        k.pop();
      k.push(d[S]);
    }
    return k.pop(), x.pop(), x.concat(k);
  }
  return ye.exports;
}
var qi = Vi();
const ji = /* @__PURE__ */ Ni(qi);
function mn(e, t = {}) {
  t.concavity = t.concavity || 1 / 0;
  const n = [];
  if (ze(e, (o) => {
    n.push([o[0], o[1]]);
  }), !n.length)
    return null;
  const i = ji(n, t.concavity);
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
function jn(e, t, n = {}) {
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
function Ui(e) {
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
const Ct = 11102230246251565e-32, dt = 134217729, Gi = (3 + 8 * Ct) * Ct;
function Re(e, t, n, i, o) {
  let r, s, a, l, h = t[0], u = i[0], c = 0, f = 0;
  u > h == u > -h ? (r = h, h = t[++c]) : (r = u, u = i[++f]);
  let p = 0;
  if (c < e && f < n)
    for (u > h == u > -h ? (s = h + r, a = r - (s - h), h = t[++c]) : (s = u + r, a = r - (s - u), u = i[++f]), r = s, a !== 0 && (o[p++] = a); c < e && f < n; )
      u > h == u > -h ? (s = r + h, l = s - r, a = r - (s - l) + (h - l), h = t[++c]) : (s = r + u, l = s - r, a = r - (s - l) + (u - l), u = i[++f]), r = s, a !== 0 && (o[p++] = a);
  for (; c < e; )
    s = r + h, l = s - r, a = r - (s - l) + (h - l), h = t[++c], r = s, a !== 0 && (o[p++] = a);
  for (; f < n; )
    s = r + u, l = s - r, a = r - (s - l) + (u - l), u = i[++f], r = s, a !== 0 && (o[p++] = a);
  return (r !== 0 || p === 0) && (o[p++] = r), p;
}
function Ji(e, t) {
  let n = t[0];
  for (let i = 1; i < e; i++) n += t[i];
  return n;
}
function fe(e) {
  return new Float64Array(e);
}
const Ki = (3 + 16 * Ct) * Ct, Qi = (2 + 12 * Ct) * Ct, Hi = (9 + 64 * Ct) * Ct * Ct, Jt = fe(4), yn = fe(8), vn = fe(12), bn = fe(16), vt = fe(4);
function Wi(e, t, n, i, o, r, s) {
  let a, l, h, u, c, f, p, w, m, E, _, g, v, d, x, y, k, S;
  const A = e - o, P = n - o, N = t - r, C = i - r;
  d = A * C, f = dt * A, p = f - (f - A), w = A - p, f = dt * C, m = f - (f - C), E = C - m, x = w * E - (d - p * m - w * m - p * E), y = N * P, f = dt * N, p = f - (f - N), w = N - p, f = dt * P, m = f - (f - P), E = P - m, k = w * E - (y - p * m - w * m - p * E), _ = x - k, c = x - _, Jt[0] = x - (_ + c) + (c - k), g = d + _, c = g - d, v = d - (g - c) + (_ - c), _ = v - y, c = v - _, Jt[1] = v - (_ + c) + (c - y), S = g + _, c = S - g, Jt[2] = g - (S - c) + (_ - c), Jt[3] = S;
  let F = Ji(4, Jt), b = Qi * s;
  if (F >= b || -F >= b || (c = e - A, a = e - (A + c) + (c - o), c = n - P, h = n - (P + c) + (c - o), c = t - N, l = t - (N + c) + (c - r), c = i - C, u = i - (C + c) + (c - r), a === 0 && l === 0 && h === 0 && u === 0) || (b = Hi * s + Gi * Math.abs(F), F += A * u + C * a - (N * h + P * l), F >= b || -F >= b)) return F;
  d = a * C, f = dt * a, p = f - (f - a), w = a - p, f = dt * C, m = f - (f - C), E = C - m, x = w * E - (d - p * m - w * m - p * E), y = l * P, f = dt * l, p = f - (f - l), w = l - p, f = dt * P, m = f - (f - P), E = P - m, k = w * E - (y - p * m - w * m - p * E), _ = x - k, c = x - _, vt[0] = x - (_ + c) + (c - k), g = d + _, c = g - d, v = d - (g - c) + (_ - c), _ = v - y, c = v - _, vt[1] = v - (_ + c) + (c - y), S = g + _, c = S - g, vt[2] = g - (S - c) + (_ - c), vt[3] = S;
  const O = Re(4, Jt, 4, vt, yn);
  d = A * u, f = dt * A, p = f - (f - A), w = A - p, f = dt * u, m = f - (f - u), E = u - m, x = w * E - (d - p * m - w * m - p * E), y = N * h, f = dt * N, p = f - (f - N), w = N - p, f = dt * h, m = f - (f - h), E = h - m, k = w * E - (y - p * m - w * m - p * E), _ = x - k, c = x - _, vt[0] = x - (_ + c) + (c - k), g = d + _, c = g - d, v = d - (g - c) + (_ - c), _ = v - y, c = v - _, vt[1] = v - (_ + c) + (c - y), S = g + _, c = S - g, vt[2] = g - (S - c) + (_ - c), vt[3] = S;
  const I = Re(O, yn, 4, vt, vn);
  d = a * u, f = dt * a, p = f - (f - a), w = a - p, f = dt * u, m = f - (f - u), E = u - m, x = w * E - (d - p * m - w * m - p * E), y = l * h, f = dt * l, p = f - (f - l), w = l - p, f = dt * h, m = f - (f - h), E = h - m, k = w * E - (y - p * m - w * m - p * E), _ = x - k, c = x - _, vt[0] = x - (_ + c) + (c - k), g = d + _, c = g - d, v = d - (g - c) + (_ - c), _ = v - y, c = v - _, vt[1] = v - (_ + c) + (c - y), S = g + _, c = S - g, vt[2] = g - (S - c) + (_ - c), vt[3] = S;
  const T = Re(I, vn, 4, vt, bn);
  return bn[T - 1];
}
function Zi(e, t, n, i, o, r) {
  const s = (t - r) * (n - o), a = (e - o) * (i - r), l = s - a, h = Math.abs(s + a);
  return Math.abs(l) >= Ki * h ? l : -Wi(e, t, n, i, o, r, h);
}
function tr(e, t) {
  var n, i, o = 0, r, s, a, l, h, u, c, f = e[0], p = e[1], w = t.length;
  for (n = 0; n < w; n++) {
    i = 0;
    var m = t[n], E = m.length - 1;
    if (u = m[0], u[0] !== m[E][0] && u[1] !== m[E][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (s = u[0] - f, a = u[1] - p, i; i < E; i++) {
      if (c = m[i + 1], l = c[0] - f, h = c[1] - p, a === 0 && h === 0) {
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
  const i = Ui(e), o = zi(t), r = o.type, s = t.bbox;
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
function Un(e, t) {
  const n = t.geometry.coordinates[0][0], i = t.geometry.coordinates[0][1], o = t.geometry.coordinates[0][2], r = e.geometry.coordinates, s = t.properties.a.geom, a = t.properties.b.geom, l = t.properties.c.geom, h = [i[0] - n[0], i[1] - n[1]], u = [o[0] - n[0], o[1] - n[1]], c = [r[0] - n[0], r[1] - n[1]], f = [a[0] - s[0], a[1] - s[1]], p = [l[0] - s[0], l[1] - s[1]], w = (u[1] * c[0] - u[0] * c[1]) / (h[0] * u[1] - h[1] * u[0]), m = (h[0] * c[1] - h[1] * c[0]) / (h[0] * u[1] - h[1] * u[0]);
  return [
    w * f[0] + m * p[0] + s[0],
    w * f[1] + m * p[1] + s[1]
  ];
}
function nr(e, t, n) {
  const i = e.geometry.coordinates, o = n.geometry.coordinates, r = Math.atan2(i[0] - o[0], i[1] - o[1]), s = ir(r, t[0]);
  if (s === void 0)
    throw new Error("Unable to determine vertex index");
  const a = t[1][s];
  return Un(e, a.features[0]);
}
function ne(e, t, n, i, o, r, s, a) {
  let l;
  if (s && (l = Le(e, Ht([s]))), !l)
    if (n) {
      const h = e.geometry.coordinates, u = n.gridNum, c = n.xOrigin, f = n.yOrigin, p = n.xUnit, w = n.yUnit, m = n.gridCache, E = Pt(h[0], c, p, u), _ = Pt(h[1], f, w, u), g = m[E] ? m[E][_] ? m[E][_] : [] : [], v = Ht(g.map((d) => t.features[d]));
      l = Le(e, v);
    } else
      l = Le(e, t);
  return a && a(l), l ? Un(e, l) : nr(e, i, o);
}
function Pt(e, t, n, i) {
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
  return jn([t], o);
}
function rr(e) {
  const t = [0, 1, 2, 0].map((i) => e[i][0][0]), n = {
    a: { geom: e[0][0][1], index: e[0][1] },
    b: { geom: e[1][0][1], index: e[1][1] },
    c: { geom: e[2][0][1], index: e[2][1] }
  };
  return jn([t], n);
}
function je(e, t, n, i, o, r = !1, s) {
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
function Gn(e, t) {
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
    edges: Gn(e.edges || []),
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
    const r = (o + 1) % n, s = je(
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
  /** @deprecated 2.00704 以降、Transform はこのプロパティを設定も参照もしない。サブクラス（MaplatTin）は、旧 @maplat/transform と組まれたときの互換のため {} を入れる（t2 設計 §2.1） */
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
    if (ar(t)) {
      this.applyModernState(cr(t));
      return;
    }
    this.applyLegacyState(lr(t));
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
   */
  addIndexedTin() {
    const t = this.tins, n = t.forw, i = t.bakw, o = Math.ceil(Math.sqrt(n.features.length));
    if (o < 3) {
      this.indexedTins = void 0;
      return;
    }
    let r = [], s = [];
    const a = n.features.map((m) => {
      let E = [];
      return wn(m)[0].map((_) => {
        r.length === 0 ? r = [Array.from(_), Array.from(_)] : (_[0] < r[0][0] && (r[0][0] = _[0]), _[0] > r[1][0] && (r[1][0] = _[0]), _[1] < r[0][1] && (r[0][1] = _[1]), _[1] > r[1][1] && (r[1][1] = _[1])), E.length === 0 ? E = [Array.from(_), Array.from(_)] : (_[0] < E[0][0] && (E[0][0] = _[0]), _[0] > E[1][0] && (E[1][0] = _[0]), _[1] < E[0][1] && (E[0][1] = _[1]), _[1] > E[1][1] && (E[1][1] = _[1]));
      }), E;
    }), l = (r[1][0] - r[0][0]) / o, h = (r[1][1] - r[0][1]) / o, u = a.reduce(
      (m, E, _) => {
        const g = Pt(E[0][0], r[0][0], l, o), v = Pt(E[1][0], r[0][0], l, o), d = Pt(E[0][1], r[0][1], h, o), x = Pt(E[1][1], r[0][1], h, o);
        for (let y = g; y <= v; y++) {
          m[y] || (m[y] = []);
          for (let k = d; k <= x; k++)
            m[y][k] || (m[y][k] = []), m[y][k].push(_);
        }
        return m;
      },
      []
    ), c = i.features.map((m) => {
      let E = [];
      return wn(m)[0].map((_) => {
        s.length === 0 ? s = [Array.from(_), Array.from(_)] : (_[0] < s[0][0] && (s[0][0] = _[0]), _[0] > s[1][0] && (s[1][0] = _[0]), _[1] < s[0][1] && (s[0][1] = _[1]), _[1] > s[1][1] && (s[1][1] = _[1])), E.length === 0 ? E = [Array.from(_), Array.from(_)] : (_[0] < E[0][0] && (E[0][0] = _[0]), _[0] > E[1][0] && (E[1][0] = _[0]), _[1] < E[0][1] && (E[0][1] = _[1]), _[1] > E[1][1] && (E[1][1] = _[1]));
      }), E;
    }), f = (s[1][0] - s[0][0]) / o, p = (s[1][1] - s[0][1]) / o, w = c.reduce(
      (m, E, _) => {
        const g = Pt(E[0][0], s[0][0], f, o), v = Pt(E[1][0], s[0][0], f, o), d = Pt(E[0][1], s[0][1], p, o), x = Pt(E[1][1], s[0][1], p, o);
        for (let y = g; y <= v; y++) {
          m[y] || (m[y] = []);
          for (let k = d; k <= x; k++)
            m[y][k] || (m[y][k] = []), m[y][k].push(_);
        }
        return m;
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
        yUnit: p,
        gridCache: w
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
    } else this.yaxisMode == St.YAXIS_FOLLOW && !n && (c = [c[0], -1 * c[1]]);
    return c;
  }
}
const Sn = Math.pow(2, -52), ve = new Uint32Array(512);
class Je {
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
    return new Je(r);
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
    for (let A = 0; A < s; A++) {
      const P = t[2 * A], N = t[2 * A + 1];
      P < a && (a = P), N < l && (l = N), P > h && (h = P), N > u && (u = N), this._ids[A] = A;
    }
    const c = (a + h) / 2, f = (l + u) / 2;
    let p = 0, w = 0, m = 0;
    for (let A = 0, P = 1 / 0; A < s; A++) {
      const N = Ve(c, f, t[2 * A], t[2 * A + 1]);
      N < P && (p = A, P = N);
    }
    const E = t[2 * p], _ = t[2 * p + 1];
    for (let A = 0, P = 1 / 0; A < s; A++) {
      if (A === p) continue;
      const N = Ve(E, _, t[2 * A], t[2 * A + 1]);
      N < P && N > 0 && (w = A, P = N);
    }
    let g = t[2 * w], v = t[2 * w + 1], d = 1 / 0;
    for (let A = 0; A < s; A++) {
      if (A === p || A === w) continue;
      const P = vr(E, _, g, v, t[2 * A], t[2 * A + 1]);
      P < d && (m = A, d = P);
    }
    let x = t[2 * m], y = t[2 * m + 1];
    if (d === 1 / 0) {
      for (let N = 0; N < s; N++)
        this._dists[N] = t[2 * N] - t[0] || t[2 * N + 1] - t[1];
      Kt(this._ids, this._dists, 0, s - 1);
      const A = new Uint32Array(s);
      let P = 0;
      for (let N = 0, C = -1 / 0; N < s; N++) {
        const F = this._ids[N], b = this._dists[F];
        b > C && (A[P++] = F, C = b);
      }
      this.hull = A.subarray(0, P), this.triangles = new Uint32Array(0), this.halfedges = new Int32Array(0);
      return;
    }
    if (kt(E, _, g, v, x, y) < 0) {
      const A = w, P = g, N = v;
      w = m, g = x, v = y, m = A, x = P, y = N;
    }
    const k = br(E, _, g, v, x, y);
    this._cx = k.x, this._cy = k.y;
    for (let A = 0; A < s; A++)
      this._dists[A] = Ve(t[2 * A], t[2 * A + 1], k.x, k.y);
    Kt(this._ids, this._dists, 0, s - 1), this._hullStart = p;
    let S = 3;
    i[p] = n[m] = w, i[w] = n[p] = m, i[m] = n[w] = p, o[p] = 0, o[w] = 1, o[m] = 2, r.fill(-1), r[this._hashKey(E, _)] = p, r[this._hashKey(g, v)] = w, r[this._hashKey(x, y)] = m, this.trianglesLen = 0, this._addTriangle(p, w, m, -1, -1, -1);
    for (let A = 0, P = 0, N = 0; A < this._ids.length; A++) {
      const C = this._ids[A], F = t[2 * C], b = t[2 * C + 1];
      if (A > 0 && Math.abs(F - P) <= Sn && Math.abs(b - N) <= Sn || (P = F, N = b, C === p || C === w || C === m)) continue;
      let O = 0;
      for (let M = 0, B = this._hashKey(F, b); M < this._hashSize && (O = r[(B + M) % this._hashSize], !(O !== -1 && O !== i[O])); M++)
        ;
      O = n[O];
      let I = O, T;
      for (; T = i[I], kt(F, b, t[2 * I], t[2 * I + 1], t[2 * T], t[2 * T + 1]) >= 0; )
        if (I = T, I === O) {
          I = -1;
          break;
        }
      if (I === -1) continue;
      let X = this._addTriangle(I, C, i[I], -1, -1, o[I]);
      o[C] = this._legalize(X + 2), o[I] = X, S++;
      let $ = i[I];
      for (; T = i[$], kt(F, b, t[2 * $], t[2 * $ + 1], t[2 * T], t[2 * T + 1]) < 0; )
        X = this._addTriangle($, C, T, o[C], -1, o[$]), o[C] = this._legalize(X + 2), i[$] = $, S--, $ = T;
      if (I === O)
        for (; T = n[I], kt(F, b, t[2 * T], t[2 * T + 1], t[2 * I], t[2 * I + 1]) < 0; )
          X = this._addTriangle(T, C, I, -1, o[I], o[T]), this._legalize(X + 2), o[T] = X, i[I] = I, S--, I = T;
      this._hullStart = n[C] = I, i[I] = n[$] = C, i[C] = $, r[this._hashKey(F, b)] = C, r[this._hashKey(t[2 * I], t[2 * I + 1])] = I;
    }
    this.hull = new Uint32Array(S);
    for (let A = 0, P = this._hullStart; A < S; A++)
      this.hull[A] = P, P = i[P];
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
      const h = a - a % 3, u = l + (t + 1) % 3, c = h + (a + 2) % 3, f = n[s], p = n[t], w = n[u], m = n[c];
      if (yr(
        o[2 * f],
        o[2 * f + 1],
        o[2 * p],
        o[2 * p + 1],
        o[2 * w],
        o[2 * w + 1],
        o[2 * m],
        o[2 * m + 1]
      )) {
        n[t] = m, n[a] = f;
        const _ = i[c];
        if (_ === -1) {
          let v = this._hullStart;
          do {
            if (this._hullTri[v] === c) {
              this._hullTri[v] = t;
              break;
            }
            v = this._hullPrev[v];
          } while (v !== this._hullStart);
        }
        this._link(t, _), this._link(a, i[s]), this._link(s, c);
        const g = h + (a + 1) % 3;
        r < ve.length && (ve[r++] = g);
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
  const l = e - s, h = t - a, u = n - s, c = i - a, f = o - s, p = r - a, w = l * l + h * h, m = u * u + c * c, E = f * f + p * p;
  return l * (c * E - m * p) - h * (u * E - m * f) + w * (u * p - c * f) < 0;
}
function vr(e, t, n, i, o, r) {
  const s = n - e, a = i - t, l = o - e, h = r - t, u = s * s + a * a, c = l * l + h * h, f = 0.5 / (s * h - a * l), p = (h * u - a * c) * f, w = (s * c - l * u) * f;
  return p * p + w * w;
}
function br(e, t, n, i, o, r) {
  const s = n - e, a = i - t, l = o - e, h = r - t, u = s * s + a * a, c = l * l + h * h, f = 0.5 / (s * h - a * l), p = e + (h * u - a * c) * f, w = t + (s * c - l * u) * f;
  return { x: p, y: w };
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
function Nt(e) {
  return e % 3 === 2 ? e - 2 : e + 1;
}
function _t(e) {
  return e % 3 === 0 ? e + 2 : e - 1;
}
function kn(e, t, n, i, o, r, s, a) {
  const l = kt(e, t, o, r, s, a), h = kt(n, i, o, r, s, a);
  if (l > 0 && h > 0 || l < 0 && h < 0)
    return !1;
  const u = kt(o, r, e, t, n, i), c = kt(s, a, e, t, n, i);
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
    this.assertVertex(t, t, n), this.assertVertex(n, t, n), this.assertInTriangulation(t, t, n), this.assertInTriangulation(n, t, n);
    const r = this.vertMap[t], s = this.maxConstrainSteps();
    let a = 0, l = r;
    do {
      if (++a > s)
        throw new Error(
          `Constraining edge [${t}, ${n}] exceeded the iteration limit`
        );
      const c = i[l], f = Nt(l);
      if (c === n)
        return this.protect(l);
      const p = _t(l), w = i[p];
      if (w === n)
        return this.protect(f), f;
      if (this.intersectSegments(t, n, w, c)) {
        l = p;
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
      const c = o[l], f = _t(l), p = _t(c), w = Nt(c);
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
        i[p]
      )) {
        if (u === -1 && (u = l), i[p] === n) {
          if (l === u)
            throw new Error("Infinite loop: non-convex quadrilateral");
          l = u, u = -1;
          continue;
        }
        if (this.intersectSegments(
          t,
          n,
          i[p],
          i[c]
        ))
          l = p;
        else if (this.intersectSegments(
          t,
          n,
          i[w],
          i[p]
        ))
          l = w;
        else if (u === l)
          throw new Error("Infinite loop: no further intersect after non-convex");
        continue;
      }
      if (this.flipDiagonal(l), this.intersectSegments(
        t,
        n,
        i[f],
        i[p]
      ) && (u === -1 && (u = f), u === f))
        throw new Error("Infinite loop: flipped diagonal still intersects");
      i[p] === n ? (h = p, l = u, u = -1) : this.intersectSegments(
        t,
        n,
        i[w],
        i[p]
      ) && (l = w);
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
  forbidGroupTriangles(t, n = [this.del.coords]) {
    const { triangles: i, halfedges: o } = this.del, r = i.length / 3, s = (w, m, E) => {
      const _ = t(m), g = t(E);
      return t(w).some((v) => _.includes(v) && g.includes(v));
    }, a = (w) => s(i[w * 3], i[w * 3 + 1], i[w * 3 + 2]), l = (w, m, E, _) => Math.sign(kt(w[m * 2], w[m * 2 + 1], w[E * 2], w[E * 2 + 1], w[_ * 2], w[_ * 2 + 1])), h = n.map((w) => {
      let m = 0;
      for (let E = 0; E < r; E++) m += l(w, i[E * 3], i[E * 3 + 1], i[E * 3 + 2]);
      return m < 0 ? -1 : 1;
    }), u = (w) => {
      if (this.consd.has(w)) return !1;
      const m = o[w];
      if (m === -1) return !1;
      const E = i[w], _ = i[Nt(w)], g = i[_t(w)], v = i[_t(m)];
      return n.every((d, x) => l(d, g, E, v) === h[x] && l(d, v, _, g) === h[x]);
    };
    let c = 0, f = !0;
    for (; f; ) {
      f = !1;
      for (let w = 0; w < r; w++)
        if (a(w))
          for (let m = 0; m < 3; m++) {
            const E = w * 3 + m;
            if (!u(E)) continue;
            const _ = o[E], g = i[E], v = i[Nt(E)], d = i[_t(E)], x = i[_t(_)];
            if (!(s(d, g, x) && s(x, v, d))) {
              this.protect(this.flipDiagonal(E)), c++, f = !0;
              break;
            }
          }
    }
    let p = 0;
    for (let w = 0; w < r; w++) a(w) && p++;
    return { flips: c, remaining: p };
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
      a = Nt(s), s = r[a];
    } while (s !== -1 && s !== i);
    return o[Nt(a)] === t ? -a : 1 / 0;
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
    const { triangles: n, halfedges: i } = this.del, o = this.flips, r = this.consd, s = i[t], a = _t(t), l = Nt(t), h = _t(s), u = Nt(s), c = i[a], f = i[h];
    if (r.has(t))
      throw new Error("Trying to flip a constrained edge");
    return n[t] = n[h], i[t] = f, o.set(t, o.has(h)) || r.set(t, r.has(h)), f !== -1 && (i[f] = t), i[a] = h, n[s] = n[a], i[s] = c, o.set(s, o.has(a)) || r.set(s, r.has(a)), c !== -1 && (i[c] = s), i[h] = a, this.markFlip(t), this.markFlip(l), this.markFlip(s), this.markFlip(u), o.add(a), r.delete(a), o.add(h), r.delete(h), this.updateVert(t), this.updateVert(l), this.updateVert(s), this.updateVert(u), a;
  }
  /**
   * Whether point p1, p2, and p are collinear.
   */
  isCollinear(t, n, i) {
    const o = this.del.coords;
    return kt(
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
    const r = n[_t(t)], s = n[t], a = n[Nt(t)], l = n[_t(o)];
    return !this.inCircle(r, s, a, l);
  }
  /**
   * Update the vertex -> incoming edge map.
   */
  updateVert(t) {
    const { triangles: n, halfedges: i } = this.del, o = this.vertMap, r = n[t];
    let s = _t(t), a = i[s];
    for (; a !== -1 && a !== t; )
      s = _t(a), a = i[s];
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
  ), o = Je.from(i);
  let r;
  const s = [];
  o.triangles.length !== 0 && t.length !== 0 && (r = new Er(o), r.constrainAll(t));
  for (let l = 0; l < o.triangles.length; l += 3)
    s.push([o.triangles[l], o.triangles[l + 1], o.triangles[l + 2]]);
  const a = ["a", "b", "c"];
  return Et(
    s.map((l) => {
      const h = {}, u = l.map((c, f) => {
        const p = e.features[c], w = p.geometry.coordinates, m = [w[0], w[1]];
        return w.length === 3 ? m[2] = w[2] : h[a[f]] = p.properties[n], m;
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
function Nr(e, t, n, i) {
  const o = t[0] - e[0], r = t[1] - e[1];
  if (Math.abs(o) < 1e-12 && Math.abs(r) < 1e-12) return null;
  const s = i[0] - n[0], a = i[1] - n[1], l = n[0] - e[0], h = n[1] - e[1], u = o * a - r * s;
  if (Math.abs(u) < 1e-12) return null;
  const c = (l * a - h * s) / u, f = (l * r - h * o) / u;
  return c <= 1e-10 || f < -1e-10 || f > 1 + 1e-10 ? null : { t: c, point: [e[0] + c * o, e[1] + c * r] };
}
function Br(e, t, n) {
  const i = n.length;
  let o = -1 / 0, r = null;
  for (let s = 0; s < i; s++) {
    const a = (s + 1) % i, l = Nr(
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
        ), p = Math.sqrt(
          Math.pow(c.geometry.coordinates[0] - n.bakw[0], 2) + Math.pow(c.geometry.coordinates[1] - n.bakw[1], 2)
        ), w = f / p;
        w > o[s] && (o[s] = w), w > o[a] && (o[a] = w);
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
function Jn(e, t, n) {
  const { convexBuf: i, centroid: o, allGcps: r, minx: s, maxx: a, miny: l, maxy: h } = e, u = Ir(i, o, t), f = [
    [s, l],
    [a, l],
    [a, h],
    [s, h]
  ].map((y) => ({
    forw: y,
    bakw: Pr(
      y,
      o,
      u[Or(y, o.forw)]
    )
  }));
  if (f.sort(
    (y, k) => Math.atan2(y.forw[0] - o.forw[0], y.forw[1] - o.forw[1]) - Math.atan2(k.forw[0] - o.forw[0], k.forw[1] - o.forw[1])
  ), On(f, r, o), !n) return f;
  const p = 4, w = f.map(
    (y) => Math.atan2(y.forw[0] - o.forw[0], y.forw[1] - o.forw[1])
  ), m = f.map(
    (y) => Math.atan2(
      y.bakw[0] - o.bakw[0],
      -(y.bakw[1] - o.bakw[1])
    )
  );
  function E(y) {
    for (let k = 0; k < p; k++) {
      const S = (k + 1) % p, A = w[k], P = k < p - 1 ? w[S] : w[S] + 2 * Math.PI;
      let N = y;
      for (; N < A; ) N += 2 * Math.PI;
      for (; N >= A + 2 * Math.PI; ) N -= 2 * Math.PI;
      if (N >= A && N < P)
        return { i: k, j: S, frac: (N - A) / (P - A) };
    }
    return { i: 0, j: 1, frac: 0 };
  }
  function _(y) {
    const { i: k, j: S, frac: A } = E(y), P = m[k];
    let C = m[S] - P;
    for (; C > Math.PI; ) C -= 2 * Math.PI;
    for (; C < -Math.PI; ) C += 2 * Math.PI;
    return P + A * C;
  }
  const g = new Set(
    f.map(
      (y) => Math.floor(An(y.forw, o.forw) / 10) % 36
    )
  ), v = r.map((y) => ({
    forw: y.forw,
    bakw: y.bakw,
    angleDeg: An(y.forw, o.forw),
    forwDist: Math.hypot(y.forw[0] - o.forw[0], y.forw[1] - o.forw[1])
  })), d = [];
  for (let y = 0; y < 36; y++) {
    if (g.has(y)) continue;
    const k = y * 10, S = v.filter(
      (O) => O.angleDeg >= k && O.angleDeg < k + 10
    );
    let A = null;
    if (S.length > 0) {
      const O = S.reduce((I, T) => T.forwDist > I.forwDist ? T : I);
      A = In(o.forw, O.forw, s, a, l, h);
    }
    if (!A) {
      const O = (k + 5) % 360 * (Math.PI / 180), I = [
        o.forw[0] + Math.sin(O),
        o.forw[1] + Math.cos(O)
      ];
      A = In(o.forw, I, s, a, l, h);
    }
    if (!A) continue;
    const P = [A[0] - o.forw[0], A[1] - o.forw[1]], N = Math.atan2(P[0], P[1]), C = _(N), F = [
      o.bakw[0] + Math.sin(C),
      o.bakw[1] - Math.cos(C)
    ], b = Br(o.bakw, F, f);
    b && d.push({ forw: A, bakw: b });
  }
  const x = [...f, ...d];
  return x.sort(
    (y, k) => Math.atan2(y.forw[0] - o.forw[0], y.forw[1] - o.forw[1]) - Math.atan2(k.forw[0] - o.forw[0], k.forw[1] - o.forw[1])
  ), On(x, r, o), x;
}
function Tr(e, t = !1) {
  return Jn(e, "plain", t);
}
function Cr(e, t = !1) {
  return Jn(e, "birdeye", t);
}
function po(e) {
  return Kn(e, 1 / 0);
}
const Pn = 1e5, Xr = 16;
function Kn(e, t) {
  return Dr(e), new $r(e).findSegmentIntersections(t).map(
    (o) => Lt([o.x, o.y])
  );
}
function Dr(e) {
  for (let t = 0, n = e.length; t < n; t++) {
    const i = e[t];
    ae(i) || Ut(
      "findIntersections() received invalid coordinates:",
      `line=${t}`,
      `points=${i}`
    );
    for (let o = 0, r = i.length; o < r; o++) {
      const s = i[o];
      (!ae(s) || !Number.isFinite(s[0]) || !Number.isFinite(s[1])) && Ut(
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
    (r != this._xx.length || this._xx.length != this._yy.length) && Ut("ArcCollection#initXYData() Counting error"), this.initBounds(), this._arcIter = new io(this._xx, this._yy);
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
      l = i[c], l > 0 && (h = c * 4, u = ro(t, n, a, l), r[h++] = u[0], r[h++] = u[1], r[h++] = u[2], r[h] = u[3], a += l, s.mergeBounds(u));
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
    const n = this.getBounds(), i = n.ymin || 0, o = (n.ymax || 0) - i, r = this.calcSegmentIntersectionStripeCount(), s = new Uint32Array(r), a = r > 1 ? (v) => Math.floor((r - 1) * (v - i) / o) : () => 0, l = r + 1;
    let h;
    this.forEachSegment(
      (v, d, x, y) => {
        let k = a(y[v]);
        const S = a(y[d]);
        let A = 0;
        for (; s[k] = s[k] + 2, k != S; )
          A++, A > l && Ut(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${r}`,
            `s1=${k}`,
            `s2=${S}`
          ), k += S > k ? 1 : -1;
      }
    );
    const u = this.getUint32Array(Rr(s));
    let c = 0;
    const f = [];
    Lr(s, (v) => {
      const d = c;
      c += v, f.push(u.subarray(d, c));
    }), Vr(s, 0), this.forEachSegment(
      (v, d, x, y) => {
        let k = a(y[v]);
        const S = a(y[d]);
        let A, P, N = 0;
        for (; A = s[k], s[k] = A + 2, P = f[k], P[A] = v, P[A + 1] = d, k != S; )
          N++, N > l && Ut(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${r}`,
            `s1=${k}`,
            `s2=${S}`
          ), k += S > k ? 1 : -1;
      }
    );
    const p = this.getVertexData(), w = t * Xr;
    let m = 0;
    const E = /* @__PURE__ */ new Set(), _ = /* @__PURE__ */ new Map(), g = (v) => {
      m++;
      const d = no(v);
      return E.has(d) || (E.add(d), _.set(`${v.x}:${v.y}`, v)), _.size >= t || m >= w;
    };
    if (p.xx && p.yy)
      for (h = 0; h < r && !qr(f[h], p.xx, p.yy, g); h++)
        ;
    return Array.from(_.values());
  }
}
function Ut(...e) {
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
  ae(e) || Ut("utils.sum() expects an array, received:", e);
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
function qr(e, t, n, i) {
  const o = e.length - 2;
  let r, s, a, l, h, u, c, f, p, w, m, E, _, g, v, d, x;
  for (Zr(t, e), d = 0; d < o; ) {
    for (r = e[d], s = e[d + 1], h = t[r], u = t[s], p = n[r], w = n[s], x = d; x < o && (x += 2, a = e[x], c = t[a], !(u < c)); ) {
      if (m = n[a], l = e[x + 1], f = t[l], E = n[l], p >= m) {
        if (p > E && w > m && w > E) continue;
      } else if (p < E && w < m && w < E) continue;
      if (!(r == a || r == l || s == a || s == l) && (_ = jr(
        h,
        p,
        u,
        w,
        c,
        m,
        f,
        E
      ), _ && (g = [r, s], v = [a, l], i(Bn(_, g, v, t, n)) || _.length == 4 && i(Bn(_.slice(2), g, v, t, n)))))
        return !0;
    }
    d += 2;
  }
  return !1;
}
function jr(e, t, n, i, o, r, s, a) {
  const l = Ur(e, t, n, i, o, r, s, a);
  let h = null;
  return l && (h = zr(e, t, n, i, o, r, s, a), h ? Wr(e, t, n, i, o, r, s, a) && (h = null) : h = Hr(e, t, n, i, o, r, s, a)), h;
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
function zr(e, t, n, i, o, r, s, a) {
  let l = xe(e, t, n, i, o, r, s, a), h;
  return l && (h = Jr(l[0], l[1], e, t, n, i, o, r, s, a), h == 1 ? l = xe(n, i, e, t, o, r, s, a) : h == 2 ? l = xe(o, r, s, a, e, t, n, i) : h == 3 && (l = xe(s, a, o, r, e, t, n, i))), l && Qr(l, e, t, n, i, o, r, s, a), l;
}
function xe(e, t, n, i, o, r, s, a) {
  const l = Qn(n - e, i - t, s - o, a - r), h = 1e-18;
  let u;
  if (l === 0) return null;
  const c = ie(o, r, s, a, e, t) / l;
  return l <= h && l >= -h ? u = Gr(e, t, n, i, o, r, s, a) : u = [e + c * (n - e), t + c * (i - t)], u;
}
function Gr(e, t, n, i, o, r, s, a) {
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
    r = Kr(e, t, n[a], n[a + 1]), r < o && (o = r, i = s);
  return i;
}
function Kr(e, t, n, i) {
  const o = e - n, r = t - i;
  return o * o + r * r;
}
function Qr(e, t, n, i, o, r, s, a, l) {
  let h = e[0], u = e[1];
  h = _e(h, t, i), h = _e(h, r, a), u = _e(u, n, o), u = _e(u, s, l), e[0] = h, e[1] = u;
}
function _e(e, t, n) {
  let i;
  return Bt(e, t, n) && (i = Math.abs(e - t) < Math.abs(e - n) ? t : n, e = i), e;
}
function Hr(e, t, n, i, o, r, s, a) {
  const l = Math.min(e, n, o, s), h = Math.max(e, n, o, s), u = Math.min(t, i, r, a), c = Math.max(t, i, r, a), f = c - u > h - l;
  let p = [];
  return (f ? Rt(t, u, c) : Rt(e, l, h)) && p.push(e, t), (f ? Rt(i, u, c) : Rt(n, l, h)) && p.push(n, i), (f ? Rt(r, u, c) : Rt(o, l, h)) && p.push(o, r), (f ? Rt(a, u, c) : Rt(s, l, h)) && p.push(s, a), (p.length != 2 && p.length != 4 || p.length == 4 && p[0] == p[2] && p[1] == p[3]) && (p = null), p;
}
function Wr(e, t, n, i, o, r, s, a) {
  return e == o && t == r || e == s && t == a || n == o && i == r || n == s && i == a;
}
function Rt(e, t, n) {
  return e > t && e < n;
}
function Zr(e, t) {
  to(e, t), Hn(e, t, 0, t.length - 2);
}
function to(e, t) {
  for (let n = 0, i = t.length; n < i; n += 2)
    e[t[n]] > e[t[n + 1]] && eo(t, n, n + 1);
}
function eo(e, t, n) {
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
  const a = t[0] < n[0] ? t : n, l = a == t ? n : t;
  return { x: r, y: s, a, b: l };
}
function Tn(e, t, n, i, o, r) {
  let s = n < i ? n : i, a = s === n ? i : n;
  return o[s] == e && r[s] == t ? a = s : o[a] == e && r[a] == t && (s = a), [s, a];
}
function no(e) {
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
    return t instanceof ce ? (i = t.xmin, o = t.ymin, r = t.xmax, s = t.ymax) : n.length == 3 ? (i = t, o = n[0], r = n[1], s = n[2]) : t.length == 4 ? (i = t[0], o = t[1], r = t[2], s = t[3]) : Ut("Bounds#mergeBounds() invalid argument:", t), this.xmin === void 0 ? this.setBounds(i, o, r, s) : (i < this.xmin && (this.xmin = i), o < this.ymin && (this.ymin = o), r > this.xmax && (this.xmax = r), s > this.ymax && (this.ymax = s)), this;
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
  return Lt(e, { target: { geom: t, index: n } });
}
function Se(e) {
  return Lt(e.properties.target.geom, {
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
      (p) => p.geometry.coordinates
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
    }, f = Et([
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
  const u = xt(h.geom);
  let c = !1, f = !1;
  for (let p = 0; p <= 1; p++) {
    const w = i[p];
    if (!w) continue;
    const m = [String(w.prop.index), String(l.prop.index)].sort().join("-"), E = o[m];
    if (!E || E.length < 2) continue;
    const _ = E.find(
      (N) => N.bakw !== r[s].bakw
    );
    if (!_) continue;
    const v = re(_.bakw).find(
      (N) => String(N.prop.index) !== String(w.prop.index) && String(N.prop.index) !== String(l.prop.index)
    );
    if (!v) continue;
    c = !0;
    const d = xt(v.geom), x = xt(w.geom), y = xt(l.geom), k = y[0] - x[0], S = y[1] - x[1], A = k * (u[1] - x[1]) - S * (u[0] - x[0]), P = k * (d[1] - x[1]) - S * (d[0] - x[0]);
    if (A * P > 0) {
      f = !0;
      break;
    }
  }
  return c && !f;
}
function co(e, t, n, i) {
  if (!e && !t) return !1;
  if (n[0] && n[1] && i[0] && i[1]) {
    const o = i.map((u) => xt(u.geom)), r = n.map((u) => xt(u.geom)), s = o[1][0] - o[0][0], a = o[1][1] - o[0][1], l = s * (r[0][1] - o[0][1]) - a * (r[0][0] - o[0][0]), h = s * (r[1][1] - o[0][1]) - a * (r[1][0] - o[0][0]);
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
      const u = t[h];
      if (!u || u.length < 2) continue;
      const c = h.split("-");
      if (c.length !== 2 || o.has(h)) continue;
      const f = re(u[0].bakw), p = re(u[1].bakw), w = re(u[0].forw), m = re(u[1].forw), E = c.map(
        (M) => f.find((B) => `${B.prop.index}` === M) || p.find((B) => `${B.prop.index}` === M)
      ), _ = c.map(
        (M) => w.find((B) => `${B.prop.index}` === M) || m.find((B) => `${B.prop.index}` === M)
      );
      if (E.some((M) => !M) || _.some((M) => !M))
        continue;
      const g = [f, p].map(
        (M) => M.find((B) => !c.includes(`${B.prop.index}`))
      ), v = [w, m].map(
        (M) => M.find((B) => !c.includes(`${B.prop.index}`))
      );
      if (g.some((M) => !M) || v.some((M) => !M))
        continue;
      const d = u[0].bakw.geometry.coordinates[0].slice(0, 3).map((M) => xt(M)), x = u[1].bakw.geometry.coordinates[0].slice(0, 3).map((M) => xt(M)), y = u[0].forw.geometry.coordinates[0].slice(0, 3).map((M) => xt(M)), k = u[1].forw.geometry.coordinates[0].slice(0, 3).map((M) => xt(M)), S = Ee(d), A = Ee(x), P = Ee(y), N = Ee(k), C = ao(
        S,
        A,
        g,
        E,
        t,
        u
      ), F = co(
        P,
        N,
        g,
        E
      );
      if (!(C || F || Dn(
        xt(g[0].geom),
        x
      ) || Dn(
        xt(g[1].geom),
        d
      )))
        continue;
      const O = _.map(
        (M) => xt(M.geom)
      ), I = v.map(
        (M) => xt(M.geom)
      ), T = ho([
        ...O,
        ...I
      ]), X = fo(T), $ = $n(
        O[0],
        O[1],
        I[0]
      ) + $n(
        O[0],
        O[1],
        I[1]
      );
      Ue(X, $) && (Cn(t, u[0], e), Cn(t, u[1], e), E.forEach((M) => {
        if (!M) return;
        const B = [
          M.geom,
          g[0].geom,
          g[1].geom,
          M.geom
        ], D = {
          a: M.prop,
          b: g[0].prop,
          c: g[1].prop
        }, Y = le([B], D), L = zn(Y);
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
  const [n, i] = t[0], [o, r] = t[1], [s, a] = t[2], l = s - n, h = a - i, u = o - n, c = r - i, f = e[0] - n, p = e[1] - i, w = l * l + h * h, m = l * u + h * c, E = l * f + h * p, _ = u * u + c * c, g = u * f + c * p, v = w * _ - m * m;
  if (v === 0) return !1;
  const d = 1 / v, x = (_ * E - m * g) * d, y = (w * g - m * E) * d, k = 1e-9;
  return x >= -k && y >= -k && x + y <= 1 + k;
}
function ho(e) {
  const t = e.map((s) => s.slice()).filter(
    (s, a, l) => l.findIndex(
      (h) => Ue(h[0], s[0]) && Ue(h[1], s[1])
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
function $n(e, t, n) {
  return Math.abs(
    (e[0] * (t[1] - n[1]) + t[0] * (n[1] - e[1]) + n[0] * (e[1] - t[1])) / 2
  );
}
function Ue(e, t, n = 1e-9) {
  return Math.abs(e - t) <= n;
}
const Fn = 2.00704, Yn = 3.00001;
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
    this.tins.bakw = Et(n);
    const i = {};
    this.tins.forw.features.forEach((s, a) => {
      const l = this.tins.bakw.features[a];
      Wn(i, { forw: s, bakw: l });
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
      return Kn(a, t);
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
      if (uo(r, this.points.length, o), s.length === 0 && a.length === 0) {
        n.push(r);
        continue;
      }
      s.unshift(this.points[r[0]][0]), s.push(this.points[r[1]][0]), a.unshift(this.points[r[0]][1]), a.push(this.points[r[1]][1]);
      const l = [s, a].map((h) => {
        const u = h.map((f, p, w) => {
          if (p === 0) return 0;
          const m = w[p - 1];
          return Math.sqrt(
            Math.pow(f[0] - m[0], 2) + Math.pow(f[1] - m[1], 2)
          );
        }), c = u.reduce((f, p, w) => w === 0 ? [0] : (f.push(f[w - 1] + p), f), []);
        return c.map((f, p, w) => {
          const m = f / w[w.length - 1];
          return [h[p], u[p], c[p], m];
        });
      });
      l.map((h, u) => {
        const c = l[u ? 0 : 1];
        return h.filter((f, p) => !(p === 0 || p === h.length - 1 || f[4] === "handled")).flatMap((f) => {
          const p = f[0], w = f[3], m = c.reduce(
            (E, _, g, v) => {
              if (E) return E;
              const d = v[g + 1];
              if (_[3] === w)
                return _[4] = "handled", [_];
              if (_[3] < w && d && d[3] > w)
                return [_, d];
            },
            void 0
          );
          if (m && m.length === 1)
            return u === 0 ? [[p, m[0][0], w]] : [[m[0][0], p, w]];
          if (m && m.length === 2) {
            const E = m[0], _ = m[1], g = (w - E[3]) / (_[3] - E[3]), v = [
              (_[0][0] - E[0][0]) * g + E[0][0],
              (_[0][1] - E[0][1]) * g + E[0][1]
            ];
            return u === 0 ? [[p, v, w]] : [[v, p, w]];
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
      forw: Et(i.forw),
      bakw: Et(i.bakw)
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
    const p = {}, w = f.geometry.coordinates[0];
    let m;
    try {
      m = w.map((S) => ({
        forw: S,
        bakw: ne(Lt(S), h)
      })), m.forEach((S) => {
        p[`${S.forw[0]}:${S.forw[1]}`] = S;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const E = mn(l.bakw);
    if (!E) throw "TOO LINEAR2";
    const _ = E.geometry.coordinates[0];
    try {
      m = _.map((S) => ({
        bakw: S,
        forw: ne(Lt(S), u)
      })), m.forEach((S) => {
        p[`${S.forw[0]}:${S.forw[1]}`] = S;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    let g;
    if (n) {
      const S = c.geometry.coordinates, A = h.features.find(
        (P) => De(
          Lt(S),
          P
        )
      );
      if (A) {
        const P = A.geometry.coordinates[0], N = A.properties.a.geom, C = A.properties.b.geom, F = A.properties.c.geom;
        g = {
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
        g = {
          forw: S,
          bakw: ne(c, h)
        };
    } else
      g = {
        forw: c.geometry.coordinates,
        bakw: ne(c, h)
      };
    const v = Me(g.forw, g.bakw, "c");
    this.centroid = {
      forw: v,
      bakw: Se(v)
    };
    const d = [
      ...this.points.map((S) => ({ forw: S[0], bakw: S[1] })),
      ...(this.edgeNodes ?? []).map((S) => ({ forw: S[0], bakw: S[1] }))
    ], x = {
      convexBuf: p,
      centroid: g,
      allGcps: d,
      minx: o,
      maxx: r,
      miny: s,
      maxy: a
    }, y = this.vertexMode === lt.VERTEX_BIRDEYE ? Cr(x, n) : Tr(x, n), k = {
      forw: [],
      bakw: []
    };
    for (let S = 0; S < y.length; S++) {
      const A = y[S].forw, P = y[S].bakw, N = Me(A, P, `b${S}`), C = Se(N);
      i.forw.push(N), i.bakw.push(C), k.forw.push(N), k.bakw.push(C);
    }
    this.pointsSet = {
      forw: Et(i.forw),
      bakw: Et(i.bakw),
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
      forw: Xn(k.forw, this.centroid.forw),
      bakw: Xn(k.bakw, this.centroid.bakw)
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
  Fn as format_version,
  Wn as insertSearchIndex,
  Xn as vertexCalc
};
