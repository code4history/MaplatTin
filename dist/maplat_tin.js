function ae(e, t, n = {}) {
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
  if (!Ze(e[0]) || !Ze(e[1]))
    throw new Error("coordinates must contain numbers");
  return ae({
    type: "Point",
    coordinates: e
  }, t, n);
}
function he(e, t, n = {}) {
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
  return ae({
    type: "Polygon",
    coordinates: e
  }, t, n);
}
function We(e, t, n = {}) {
  if (e.length < 2)
    throw new Error("coordinates must be an array of two or more positions");
  return ae({
    type: "LineString",
    coordinates: e
  }, t, n);
}
function Mt(e, t = {}) {
  const n = { type: "FeatureCollection" };
  return t.id && (n.id = t.id), t.bbox && (n.bbox = t.bbox), n.features = e, n;
}
function Ze(e) {
  return !isNaN(e) && e !== null && !Array.isArray(e);
}
function ci(e) {
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
function li(e) {
  return e.type === "Feature" ? e.geometry : e;
}
function Je(e, t, n) {
  if (e !== null)
    for (var i, o, r, s, a, f, l, h = 0, c = 0, u, d = e.type, y = d === "FeatureCollection", g = d === "Feature", S = y ? e.features.length : 1, v = 0; v < S; v++) {
      l = y ? (
        // @ts-expect-error: Known type conflict
        e.features[v].geometry
      ) : g ? (
        // @ts-expect-error: Known type conflict
        e.geometry
      ) : e, u = l ? l.type === "GeometryCollection" : !1, a = u ? l.geometries.length : 1;
      for (var m = 0; m < a; m++) {
        var x = 0, p = 0;
        if (s = u ? l.geometries[m] : l, s !== null) {
          f = s.coordinates;
          var _ = s.type;
          switch (h = n && (_ === "Polygon" || _ === "MultiPolygon") ? 1 : 0, _) {
            case null:
              break;
            case "Point":
              if (
                // @ts-expect-error: Known type conflict
                t(
                  f,
                  c,
                  v,
                  x,
                  p
                ) === !1
              )
                return !1;
              c++, x++;
              break;
            case "LineString":
            case "MultiPoint":
              for (i = 0; i < f.length; i++) {
                if (
                  // @ts-expect-error: Known type conflict
                  t(
                    f[i],
                    c,
                    v,
                    x,
                    p
                  ) === !1
                )
                  return !1;
                c++, _ === "MultiPoint" && x++;
              }
              _ === "LineString" && x++;
              break;
            case "Polygon":
            case "MultiLineString":
              for (i = 0; i < f.length; i++) {
                for (o = 0; o < f[i].length - h; o++) {
                  if (
                    // @ts-expect-error: Known type conflict
                    t(
                      f[i][o],
                      c,
                      v,
                      x,
                      p
                    ) === !1
                  )
                    return !1;
                  c++;
                }
                _ === "MultiLineString" && x++, _ === "Polygon" && p++;
              }
              _ === "Polygon" && x++;
              break;
            case "MultiPolygon":
              for (i = 0; i < f.length; i++) {
                for (p = 0, o = 0; o < f[i].length; o++) {
                  for (r = 0; r < f[i][o].length - h; r++) {
                    if (
                      // @ts-expect-error: Known type conflict
                      t(
                        f[i][o][r],
                        c,
                        v,
                        x,
                        p
                      ) === !1
                    )
                      return !1;
                    c++;
                  }
                  p++;
                }
                x++;
              }
              break;
            case "GeometryCollection":
              for (i = 0; i < s.geometries.length; i++)
                if (
                  // @ts-expect-error: Known type conflict
                  Je(s.geometries[i], t, n) === !1
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
const pt = 11102230246251565e-32, U = 134217729, Un = (3 + 8 * pt) * pt;
function ht(e, t, n, i, o) {
  let r, s, a, f, l = t[0], h = i[0], c = 0, u = 0;
  h > l == h > -l ? (r = l, l = t[++c]) : (r = h, h = i[++u]);
  let d = 0;
  if (c < e && u < n)
    for (h > l == h > -l ? (s = l + r, a = r - (s - l), l = t[++c]) : (s = h + r, a = r - (s - h), h = i[++u]), r = s, a !== 0 && (o[d++] = a); c < e && u < n; )
      h > l == h > -l ? (s = r + l, f = s - r, a = r - (s - f) + (l - f), l = t[++c]) : (s = r + h, f = s - r, a = r - (s - f) + (h - f), h = i[++u]), r = s, a !== 0 && (o[d++] = a);
  for (; c < e; )
    s = r + l, f = s - r, a = r - (s - f) + (l - f), l = t[++c], r = s, a !== 0 && (o[d++] = a);
  for (; u < n; )
    s = r + h, f = s - r, a = r - (s - f) + (h - f), h = i[++u], r = s, a !== 0 && (o[d++] = a);
  return (r !== 0 || d === 0) && (o[d++] = r), d;
}
function St(e, t, n, i, o, r, s, a) {
  return ht(ht(e, t, n, i, s), s, o, r, a);
}
function R(e, t, n, i) {
  let o, r, s, a, f, l, h, c, u, d, y;
  h = U * n, d = h - (h - n), y = n - d;
  let g = t[0];
  o = g * n, h = U * g, c = h - (h - g), u = g - c, s = u * y - (o - c * d - u * d - c * y);
  let S = 0;
  s !== 0 && (i[S++] = s);
  for (let v = 1; v < e; v++)
    g = t[v], a = g * n, h = U * g, c = h - (h - g), u = g - c, f = u * y - (a - c * d - u * d - c * y), r = o + f, l = r - o, s = o - (r - l) + (f - l), s !== 0 && (i[S++] = s), o = a + r, s = r - (o - a), s !== 0 && (i[S++] = s);
  return (o !== 0 || S === 0) && (i[S++] = o), S;
}
function zn(e, t) {
  let n = t[0];
  for (let i = 1; i < e; i++) n += t[i];
  return n;
}
function tt(e) {
  return new Float64Array(e);
}
const fi = (3 + 16 * pt) * pt, hi = (2 + 12 * pt) * pt, ui = (9 + 64 * pt) * pt * pt, zt = tt(4), tn = tt(8), en = tt(12), nn = tt(16), mt = tt(4);
function di(e, t, n, i, o, r, s) {
  let a, f, l, h, c, u, d, y, g, S, v, m, x, p, _, w, k, O;
  const A = e - o, B = n - o, P = t - r, C = i - r;
  p = A * C, u = U * A, d = u - (u - A), y = A - d, u = U * C, g = u - (u - C), S = C - g, _ = y * S - (p - d * g - y * g - d * S), w = P * B, u = U * P, d = u - (u - P), y = P - d, u = U * B, g = u - (u - B), S = B - g, k = y * S - (w - d * g - y * g - d * S), v = _ - k, c = _ - v, zt[0] = _ - (v + c) + (c - k), m = p + v, c = m - p, x = p - (m - c) + (v - c), v = x - w, c = x - v, zt[1] = x - (v + c) + (c - w), O = m + v, c = O - m, zt[2] = m - (O - c) + (v - c), zt[3] = O;
  let $ = zn(4, zt), b = hi * s;
  if ($ >= b || -$ >= b || (c = e - A, a = e - (A + c) + (c - o), c = n - B, l = n - (B + c) + (c - o), c = t - P, f = t - (P + c) + (c - r), c = i - C, h = i - (C + c) + (c - r), a === 0 && f === 0 && l === 0 && h === 0) || (b = ui * s + Un * Math.abs($), $ += A * h + C * a - (P * l + B * f), $ >= b || -$ >= b)) return $;
  p = a * C, u = U * a, d = u - (u - a), y = a - d, u = U * C, g = u - (u - C), S = C - g, _ = y * S - (p - d * g - y * g - d * S), w = f * B, u = U * f, d = u - (u - f), y = f - d, u = U * B, g = u - (u - B), S = B - g, k = y * S - (w - d * g - y * g - d * S), v = _ - k, c = _ - v, mt[0] = _ - (v + c) + (c - k), m = p + v, c = m - p, x = p - (m - c) + (v - c), v = x - w, c = x - v, mt[1] = x - (v + c) + (c - w), O = m + v, c = O - m, mt[2] = m - (O - c) + (v - c), mt[3] = O;
  const I = ht(4, zt, 4, mt, tn);
  p = A * h, u = U * A, d = u - (u - A), y = A - d, u = U * h, g = u - (u - h), S = h - g, _ = y * S - (p - d * g - y * g - d * S), w = P * l, u = U * P, d = u - (u - P), y = P - d, u = U * l, g = u - (u - l), S = l - g, k = y * S - (w - d * g - y * g - d * S), v = _ - k, c = _ - v, mt[0] = _ - (v + c) + (c - k), m = p + v, c = m - p, x = p - (m - c) + (v - c), v = x - w, c = x - v, mt[1] = x - (v + c) + (c - w), O = m + v, c = O - m, mt[2] = m - (O - c) + (v - c), mt[3] = O;
  const E = ht(I, tn, 4, mt, en);
  p = a * h, u = U * a, d = u - (u - a), y = a - d, u = U * h, g = u - (u - h), S = h - g, _ = y * S - (p - d * g - y * g - d * S), w = f * l, u = U * f, d = u - (u - f), y = f - d, u = U * l, g = u - (u - l), S = l - g, k = y * S - (w - d * g - y * g - d * S), v = _ - k, c = _ - v, mt[0] = _ - (v + c) + (c - k), m = p + v, c = m - p, x = p - (m - c) + (v - c), v = x - w, c = x - v, mt[1] = x - (v + c) + (c - w), O = m + v, c = O - m, mt[2] = m - (O - c) + (v - c), mt[3] = O;
  const N = ht(E, en, 4, mt, nn);
  return nn[N - 1];
}
function kt(e, t, n, i, o, r) {
  const s = (t - r) * (n - o), a = (e - o) * (i - r), f = s - a, l = Math.abs(s + a);
  return Math.abs(f) >= fi * l ? f : -di(e, t, n, i, o, r, l);
}
const pi = (10 + 96 * pt) * pt, mi = (4 + 48 * pt) * pt, gi = (44 + 576 * pt) * pt * pt, Xt = tt(4), Ft = tt(4), $t = tt(4), At = tt(4), It = tt(4), Bt = tt(4), gt = tt(4), wt = tt(4), Oe = tt(8), Pe = tt(8), Ne = tt(8), Te = tt(8), Ce = tt(8), De = tt(8), pe = tt(8), me = tt(8), ge = tt(8), Vt = tt(4), qt = tt(4), jt = tt(4), z = tt(8), K = tt(16), nt = tt(16), it = tt(16), et = tt(32), Yt = tt(32), at = tt(48), bt = tt(64);
let Qt = tt(1152), Xe = tt(1152);
function ct(e, t, n) {
  e = ht(e, Qt, t, n, Xe);
  const i = Qt;
  return Qt = Xe, Xe = i, e;
}
function wi(e, t, n, i, o, r, s, a, f) {
  let l, h, c, u, d, y, g, S, v, m, x, p, _, w, k, O, A, B, P, C, $, b, I, E, N, D, F, M, T, X, Y, L, V, j, q;
  const J = e - s, G = n - s, Q = o - s, H = t - a, Z = i - a, W = r - a;
  Y = G * W, I = U * G, E = I - (I - G), N = G - E, I = U * W, D = I - (I - W), F = W - D, L = N * F - (Y - E * D - N * D - E * F), V = Q * Z, I = U * Q, E = I - (I - Q), N = Q - E, I = U * Z, D = I - (I - Z), F = Z - D, j = N * F - (V - E * D - N * D - E * F), M = L - j, b = L - M, Xt[0] = L - (M + b) + (b - j), T = Y + M, b = T - Y, X = Y - (T - b) + (M - b), M = X - V, b = X - M, Xt[1] = X - (M + b) + (b - V), q = T + M, b = q - T, Xt[2] = T - (q - b) + (M - b), Xt[3] = q, Y = Q * H, I = U * Q, E = I - (I - Q), N = Q - E, I = U * H, D = I - (I - H), F = H - D, L = N * F - (Y - E * D - N * D - E * F), V = J * W, I = U * J, E = I - (I - J), N = J - E, I = U * W, D = I - (I - W), F = W - D, j = N * F - (V - E * D - N * D - E * F), M = L - j, b = L - M, Ft[0] = L - (M + b) + (b - j), T = Y + M, b = T - Y, X = Y - (T - b) + (M - b), M = X - V, b = X - M, Ft[1] = X - (M + b) + (b - V), q = T + M, b = q - T, Ft[2] = T - (q - b) + (M - b), Ft[3] = q, Y = J * Z, I = U * J, E = I - (I - J), N = J - E, I = U * Z, D = I - (I - Z), F = Z - D, L = N * F - (Y - E * D - N * D - E * F), V = G * H, I = U * G, E = I - (I - G), N = G - E, I = U * H, D = I - (I - H), F = H - D, j = N * F - (V - E * D - N * D - E * F), M = L - j, b = L - M, $t[0] = L - (M + b) + (b - j), T = Y + M, b = T - Y, X = Y - (T - b) + (M - b), M = X - V, b = X - M, $t[1] = X - (M + b) + (b - V), q = T + M, b = q - T, $t[2] = T - (q - b) + (M - b), $t[3] = q, l = ht(
    ht(
      ht(
        R(R(4, Xt, J, z), z, J, K),
        K,
        R(R(4, Xt, H, z), z, H, nt),
        nt,
        et
      ),
      et,
      ht(
        R(R(4, Ft, G, z), z, G, K),
        K,
        R(R(4, Ft, Z, z), z, Z, nt),
        nt,
        Yt
      ),
      Yt,
      bt
    ),
    bt,
    ht(
      R(R(4, $t, Q, z), z, Q, K),
      K,
      R(R(4, $t, W, z), z, W, nt),
      nt,
      et
    ),
    et,
    Qt
  );
  let st = zn(l, Qt), ft = mi * f;
  if (st >= ft || -st >= ft || (b = e - J, h = e - (J + b) + (b - s), b = t - H, d = t - (H + b) + (b - a), b = n - G, c = n - (G + b) + (b - s), b = i - Z, y = i - (Z + b) + (b - a), b = o - Q, u = o - (Q + b) + (b - s), b = r - W, g = r - (W + b) + (b - a), h === 0 && c === 0 && u === 0 && d === 0 && y === 0 && g === 0) || (ft = gi * f + Un * Math.abs(st), st += (J * J + H * H) * (G * g + W * c - (Z * u + Q * y)) + 2 * (J * h + H * d) * (G * W - Z * Q) + ((G * G + Z * Z) * (Q * d + H * u - (W * h + J * g)) + 2 * (G * c + Z * y) * (Q * H - W * J)) + ((Q * Q + W * W) * (J * y + Z * h - (H * c + G * d)) + 2 * (Q * u + W * g) * (J * Z - H * G)), st >= ft || -st >= ft))
    return st;
  if ((c !== 0 || y !== 0 || u !== 0 || g !== 0) && (Y = J * J, I = U * J, E = I - (I - J), N = J - E, L = N * N - (Y - E * E - (E + E) * N), V = H * H, I = U * H, E = I - (I - H), N = H - E, j = N * N - (V - E * E - (E + E) * N), M = L + j, b = M - L, At[0] = L - (M - b) + (j - b), T = Y + M, b = T - Y, X = Y - (T - b) + (M - b), M = X + V, b = M - X, At[1] = X - (M - b) + (V - b), q = T + M, b = q - T, At[2] = T - (q - b) + (M - b), At[3] = q), (u !== 0 || g !== 0 || h !== 0 || d !== 0) && (Y = G * G, I = U * G, E = I - (I - G), N = G - E, L = N * N - (Y - E * E - (E + E) * N), V = Z * Z, I = U * Z, E = I - (I - Z), N = Z - E, j = N * N - (V - E * E - (E + E) * N), M = L + j, b = M - L, It[0] = L - (M - b) + (j - b), T = Y + M, b = T - Y, X = Y - (T - b) + (M - b), M = X + V, b = M - X, It[1] = X - (M - b) + (V - b), q = T + M, b = q - T, It[2] = T - (q - b) + (M - b), It[3] = q), (h !== 0 || d !== 0 || c !== 0 || y !== 0) && (Y = Q * Q, I = U * Q, E = I - (I - Q), N = Q - E, L = N * N - (Y - E * E - (E + E) * N), V = W * W, I = U * W, E = I - (I - W), N = W - E, j = N * N - (V - E * E - (E + E) * N), M = L + j, b = M - L, Bt[0] = L - (M - b) + (j - b), T = Y + M, b = T - Y, X = Y - (T - b) + (M - b), M = X + V, b = M - X, Bt[1] = X - (M - b) + (V - b), q = T + M, b = q - T, Bt[2] = T - (q - b) + (M - b), Bt[3] = q), h !== 0 && (S = R(4, Xt, h, Oe), l = ct(l, St(
    R(S, Oe, 2 * J, K),
    K,
    R(R(4, Bt, h, z), z, Z, nt),
    nt,
    R(R(4, It, h, z), z, -W, it),
    it,
    et,
    at
  ), at)), d !== 0 && (v = R(4, Xt, d, Pe), l = ct(l, St(
    R(v, Pe, 2 * H, K),
    K,
    R(R(4, It, d, z), z, Q, nt),
    nt,
    R(R(4, Bt, d, z), z, -G, it),
    it,
    et,
    at
  ), at)), c !== 0 && (m = R(4, Ft, c, Ne), l = ct(l, St(
    R(m, Ne, 2 * G, K),
    K,
    R(R(4, At, c, z), z, W, nt),
    nt,
    R(R(4, Bt, c, z), z, -H, it),
    it,
    et,
    at
  ), at)), y !== 0 && (x = R(4, Ft, y, Te), l = ct(l, St(
    R(x, Te, 2 * Z, K),
    K,
    R(R(4, Bt, y, z), z, J, nt),
    nt,
    R(R(4, At, y, z), z, -Q, it),
    it,
    et,
    at
  ), at)), u !== 0 && (p = R(4, $t, u, Ce), l = ct(l, St(
    R(p, Ce, 2 * Q, K),
    K,
    R(R(4, It, u, z), z, H, nt),
    nt,
    R(R(4, At, u, z), z, -Z, it),
    it,
    et,
    at
  ), at)), g !== 0 && (_ = R(4, $t, g, De), l = ct(l, St(
    R(_, De, 2 * W, K),
    K,
    R(R(4, At, g, z), z, G, nt),
    nt,
    R(R(4, It, g, z), z, -J, it),
    it,
    et,
    at
  ), at)), h !== 0 || d !== 0) {
    if (c !== 0 || y !== 0 || u !== 0 || g !== 0 ? (Y = c * W, I = U * c, E = I - (I - c), N = c - E, I = U * W, D = I - (I - W), F = W - D, L = N * F - (Y - E * D - N * D - E * F), V = G * g, I = U * G, E = I - (I - G), N = G - E, I = U * g, D = I - (I - g), F = g - D, j = N * F - (V - E * D - N * D - E * F), M = L + j, b = M - L, gt[0] = L - (M - b) + (j - b), T = Y + M, b = T - Y, X = Y - (T - b) + (M - b), M = X + V, b = M - X, gt[1] = X - (M - b) + (V - b), q = T + M, b = q - T, gt[2] = T - (q - b) + (M - b), gt[3] = q, Y = u * -Z, I = U * u, E = I - (I - u), N = u - E, I = U * -Z, D = I - (I - -Z), F = -Z - D, L = N * F - (Y - E * D - N * D - E * F), V = Q * -y, I = U * Q, E = I - (I - Q), N = Q - E, I = U * -y, D = I - (I - -y), F = -y - D, j = N * F - (V - E * D - N * D - E * F), M = L + j, b = M - L, wt[0] = L - (M - b) + (j - b), T = Y + M, b = T - Y, X = Y - (T - b) + (M - b), M = X + V, b = M - X, wt[1] = X - (M - b) + (V - b), q = T + M, b = q - T, wt[2] = T - (q - b) + (M - b), wt[3] = q, k = ht(4, gt, 4, wt, me), Y = c * g, I = U * c, E = I - (I - c), N = c - E, I = U * g, D = I - (I - g), F = g - D, L = N * F - (Y - E * D - N * D - E * F), V = u * y, I = U * u, E = I - (I - u), N = u - E, I = U * y, D = I - (I - y), F = y - D, j = N * F - (V - E * D - N * D - E * F), M = L - j, b = L - M, qt[0] = L - (M + b) + (b - j), T = Y + M, b = T - Y, X = Y - (T - b) + (M - b), M = X - V, b = X - M, qt[1] = X - (M + b) + (b - V), q = T + M, b = q - T, qt[2] = T - (q - b) + (M - b), qt[3] = q, B = 4) : (me[0] = 0, k = 1, qt[0] = 0, B = 1), h !== 0) {
      const rt = R(k, me, h, it);
      l = ct(l, ht(
        R(S, Oe, h, K),
        K,
        R(rt, it, 2 * J, et),
        et,
        at
      ), at);
      const ot = R(B, qt, h, z);
      l = ct(l, St(
        R(ot, z, 2 * J, K),
        K,
        R(ot, z, h, nt),
        nt,
        R(rt, it, h, et),
        et,
        Yt,
        bt
      ), bt), y !== 0 && (l = ct(l, R(R(4, Bt, h, z), z, y, K), K)), g !== 0 && (l = ct(l, R(R(4, It, -h, z), z, g, K), K));
    }
    if (d !== 0) {
      const rt = R(k, me, d, it);
      l = ct(l, ht(
        R(v, Pe, d, K),
        K,
        R(rt, it, 2 * H, et),
        et,
        at
      ), at);
      const ot = R(B, qt, d, z);
      l = ct(l, St(
        R(ot, z, 2 * H, K),
        K,
        R(ot, z, d, nt),
        nt,
        R(rt, it, d, et),
        et,
        Yt,
        bt
      ), bt);
    }
  }
  if (c !== 0 || y !== 0) {
    if (u !== 0 || g !== 0 || h !== 0 || d !== 0 ? (Y = u * H, I = U * u, E = I - (I - u), N = u - E, I = U * H, D = I - (I - H), F = H - D, L = N * F - (Y - E * D - N * D - E * F), V = Q * d, I = U * Q, E = I - (I - Q), N = Q - E, I = U * d, D = I - (I - d), F = d - D, j = N * F - (V - E * D - N * D - E * F), M = L + j, b = M - L, gt[0] = L - (M - b) + (j - b), T = Y + M, b = T - Y, X = Y - (T - b) + (M - b), M = X + V, b = M - X, gt[1] = X - (M - b) + (V - b), q = T + M, b = q - T, gt[2] = T - (q - b) + (M - b), gt[3] = q, C = -W, $ = -g, Y = h * C, I = U * h, E = I - (I - h), N = h - E, I = U * C, D = I - (I - C), F = C - D, L = N * F - (Y - E * D - N * D - E * F), V = J * $, I = U * J, E = I - (I - J), N = J - E, I = U * $, D = I - (I - $), F = $ - D, j = N * F - (V - E * D - N * D - E * F), M = L + j, b = M - L, wt[0] = L - (M - b) + (j - b), T = Y + M, b = T - Y, X = Y - (T - b) + (M - b), M = X + V, b = M - X, wt[1] = X - (M - b) + (V - b), q = T + M, b = q - T, wt[2] = T - (q - b) + (M - b), wt[3] = q, O = ht(4, gt, 4, wt, ge), Y = u * d, I = U * u, E = I - (I - u), N = u - E, I = U * d, D = I - (I - d), F = d - D, L = N * F - (Y - E * D - N * D - E * F), V = h * g, I = U * h, E = I - (I - h), N = h - E, I = U * g, D = I - (I - g), F = g - D, j = N * F - (V - E * D - N * D - E * F), M = L - j, b = L - M, jt[0] = L - (M + b) + (b - j), T = Y + M, b = T - Y, X = Y - (T - b) + (M - b), M = X - V, b = X - M, jt[1] = X - (M + b) + (b - V), q = T + M, b = q - T, jt[2] = T - (q - b) + (M - b), jt[3] = q, P = 4) : (ge[0] = 0, O = 1, jt[0] = 0, P = 1), c !== 0) {
      const rt = R(O, ge, c, it);
      l = ct(l, ht(
        R(m, Ne, c, K),
        K,
        R(rt, it, 2 * G, et),
        et,
        at
      ), at);
      const ot = R(P, jt, c, z);
      l = ct(l, St(
        R(ot, z, 2 * G, K),
        K,
        R(ot, z, c, nt),
        nt,
        R(rt, it, c, et),
        et,
        Yt,
        bt
      ), bt), g !== 0 && (l = ct(l, R(R(4, At, c, z), z, g, K), K)), d !== 0 && (l = ct(l, R(R(4, Bt, -c, z), z, d, K), K));
    }
    if (y !== 0) {
      const rt = R(O, ge, y, it);
      l = ct(l, ht(
        R(x, Te, y, K),
        K,
        R(rt, it, 2 * Z, et),
        et,
        at
      ), at);
      const ot = R(P, jt, y, z);
      l = ct(l, St(
        R(ot, z, 2 * Z, K),
        K,
        R(ot, z, y, nt),
        nt,
        R(rt, it, y, et),
        et,
        Yt,
        bt
      ), bt);
    }
  }
  if (u !== 0 || g !== 0) {
    if (h !== 0 || d !== 0 || c !== 0 || y !== 0 ? (Y = h * Z, I = U * h, E = I - (I - h), N = h - E, I = U * Z, D = I - (I - Z), F = Z - D, L = N * F - (Y - E * D - N * D - E * F), V = J * y, I = U * J, E = I - (I - J), N = J - E, I = U * y, D = I - (I - y), F = y - D, j = N * F - (V - E * D - N * D - E * F), M = L + j, b = M - L, gt[0] = L - (M - b) + (j - b), T = Y + M, b = T - Y, X = Y - (T - b) + (M - b), M = X + V, b = M - X, gt[1] = X - (M - b) + (V - b), q = T + M, b = q - T, gt[2] = T - (q - b) + (M - b), gt[3] = q, C = -H, $ = -d, Y = c * C, I = U * c, E = I - (I - c), N = c - E, I = U * C, D = I - (I - C), F = C - D, L = N * F - (Y - E * D - N * D - E * F), V = G * $, I = U * G, E = I - (I - G), N = G - E, I = U * $, D = I - (I - $), F = $ - D, j = N * F - (V - E * D - N * D - E * F), M = L + j, b = M - L, wt[0] = L - (M - b) + (j - b), T = Y + M, b = T - Y, X = Y - (T - b) + (M - b), M = X + V, b = M - X, wt[1] = X - (M - b) + (V - b), q = T + M, b = q - T, wt[2] = T - (q - b) + (M - b), wt[3] = q, w = ht(4, gt, 4, wt, pe), Y = h * y, I = U * h, E = I - (I - h), N = h - E, I = U * y, D = I - (I - y), F = y - D, L = N * F - (Y - E * D - N * D - E * F), V = c * d, I = U * c, E = I - (I - c), N = c - E, I = U * d, D = I - (I - d), F = d - D, j = N * F - (V - E * D - N * D - E * F), M = L - j, b = L - M, Vt[0] = L - (M + b) + (b - j), T = Y + M, b = T - Y, X = Y - (T - b) + (M - b), M = X - V, b = X - M, Vt[1] = X - (M + b) + (b - V), q = T + M, b = q - T, Vt[2] = T - (q - b) + (M - b), Vt[3] = q, A = 4) : (pe[0] = 0, w = 1, Vt[0] = 0, A = 1), u !== 0) {
      const rt = R(w, pe, u, it);
      l = ct(l, ht(
        R(p, Ce, u, K),
        K,
        R(rt, it, 2 * Q, et),
        et,
        at
      ), at);
      const ot = R(A, Vt, u, z);
      l = ct(l, St(
        R(ot, z, 2 * Q, K),
        K,
        R(ot, z, u, nt),
        nt,
        R(rt, it, u, et),
        et,
        Yt,
        bt
      ), bt), d !== 0 && (l = ct(l, R(R(4, It, u, z), z, d, K), K)), y !== 0 && (l = ct(l, R(R(4, At, -u, z), z, y, K), K));
    }
    if (g !== 0) {
      const rt = R(w, pe, g, it);
      l = ct(l, ht(
        R(_, De, g, K),
        K,
        R(rt, it, 2 * W, et),
        et,
        at
      ), at);
      const ot = R(A, Vt, g, z);
      l = ct(l, St(
        R(ot, z, 2 * W, K),
        K,
        R(ot, z, g, nt),
        nt,
        R(rt, it, g, et),
        et,
        Yt,
        bt
      ), bt);
    }
  }
  return Qt[l - 1];
}
function yi(e, t, n, i, o, r, s, a) {
  const f = e - s, l = n - s, h = o - s, c = t - a, u = i - a, d = r - a, y = l * d, g = h * u, S = f * f + c * c, v = h * c, m = f * d, x = l * l + u * u, p = f * u, _ = l * c, w = h * h + d * d, k = S * (y - g) + x * (v - m) + w * (p - _), O = (Math.abs(y) + Math.abs(g)) * S + (Math.abs(v) + Math.abs(m)) * x + (Math.abs(p) + Math.abs(_)) * w, A = pi * O;
  return k > A || -k > A ? k : wi(e, t, n, i, o, r, s, a, O);
}
function vi(e, t) {
  var n, i, o = 0, r, s, a, f, l, h, c, u = e[0], d = e[1], y = t.length;
  for (n = 0; n < y; n++) {
    i = 0;
    var g = t[n], S = g.length - 1;
    if (h = g[0], h[0] !== g[S][0] && h[1] !== g[S][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (s = h[0] - u, a = h[1] - d, i; i < S; i++) {
      if (c = g[i + 1], f = c[0] - u, l = c[1] - d, a === 0 && l === 0) {
        if (f <= 0 && s >= 0 || s <= 0 && f >= 0)
          return 0;
      } else if (l >= 0 && a <= 0 || l <= 0 && a >= 0) {
        if (r = kt(s, f, a, l, 0, 0), r === 0)
          return 0;
        (r > 0 && l > 0 && a <= 0 || r < 0 && l <= 0 && a > 0) && o++;
      }
      h = c, a = l, s = f;
    }
  }
  return o % 2 !== 0;
}
function Fe(e, t, n = {}) {
  if (!e)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const i = ci(e), o = li(t), r = o.type, s = t.bbox;
  let a = o.coordinates;
  if (s && bi(i, s) === !1)
    return !1;
  r === "Polygon" && (a = [a]);
  for (var f = 0; f < a.length; ++f) {
    const l = vi(i, a[f]);
    if (l === 0 && !n.ignoreBoundary) return !0;
    if (l) return !0;
  }
  return !1;
}
function bi(e, t) {
  return t[0] <= e[0] && t[1] <= e[1] && t[2] >= e[0] && t[3] >= e[1];
}
class Ke {
  constructor(t = [], n = xi) {
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
      const f = s + 1;
      if (f < this.length && i(n[f], a) < 0 && (s = f, a = n[f]), i(a, r) >= 0) break;
      n[t] = a, t = s;
    }
    n[t] = r;
  }
}
function xi(e, t) {
  return e < t ? -1 : e > t ? 1 : 0;
}
const _i = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ke
}, Symbol.toStringTag, { value: "Module" })), Tt = 11102230246251565e-32, ut = 134217729, Mi = (3 + 8 * Tt) * Tt;
function $e(e, t, n, i, o) {
  let r, s, a, f, l = t[0], h = i[0], c = 0, u = 0;
  h > l == h > -l ? (r = l, l = t[++c]) : (r = h, h = i[++u]);
  let d = 0;
  if (c < e && u < n)
    for (h > l == h > -l ? (s = l + r, a = r - (s - l), l = t[++c]) : (s = h + r, a = r - (s - h), h = i[++u]), r = s, a !== 0 && (o[d++] = a); c < e && u < n; )
      h > l == h > -l ? (s = r + l, f = s - r, a = r - (s - f) + (l - f), l = t[++c]) : (s = r + h, f = s - r, a = r - (s - f) + (h - f), h = i[++u]), r = s, a !== 0 && (o[d++] = a);
  for (; c < e; )
    s = r + l, f = s - r, a = r - (s - f) + (l - f), l = t[++c], r = s, a !== 0 && (o[d++] = a);
  for (; u < n; )
    s = r + h, f = s - r, a = r - (s - f) + (h - f), h = i[++u], r = s, a !== 0 && (o[d++] = a);
  return (r !== 0 || d === 0) && (o[d++] = r), d;
}
function Si(e, t) {
  let n = t[0];
  for (let i = 1; i < e; i++) n += t[i];
  return n;
}
function ue(e) {
  return new Float64Array(e);
}
const ki = (3 + 16 * Tt) * Tt, Ei = (2 + 12 * Tt) * Tt, Ai = (9 + 64 * Tt) * Tt * Tt, Gt = ue(4), rn = ue(8), on = ue(12), sn = ue(16), yt = ue(4);
function Ii(e, t, n, i, o, r, s) {
  let a, f, l, h, c, u, d, y, g, S, v, m, x, p, _, w, k, O;
  const A = e - o, B = n - o, P = t - r, C = i - r;
  p = A * C, u = ut * A, d = u - (u - A), y = A - d, u = ut * C, g = u - (u - C), S = C - g, _ = y * S - (p - d * g - y * g - d * S), w = P * B, u = ut * P, d = u - (u - P), y = P - d, u = ut * B, g = u - (u - B), S = B - g, k = y * S - (w - d * g - y * g - d * S), v = _ - k, c = _ - v, Gt[0] = _ - (v + c) + (c - k), m = p + v, c = m - p, x = p - (m - c) + (v - c), v = x - w, c = x - v, Gt[1] = x - (v + c) + (c - w), O = m + v, c = O - m, Gt[2] = m - (O - c) + (v - c), Gt[3] = O;
  let $ = Si(4, Gt), b = Ei * s;
  if ($ >= b || -$ >= b || (c = e - A, a = e - (A + c) + (c - o), c = n - B, l = n - (B + c) + (c - o), c = t - P, f = t - (P + c) + (c - r), c = i - C, h = i - (C + c) + (c - r), a === 0 && f === 0 && l === 0 && h === 0) || (b = Ai * s + Mi * Math.abs($), $ += A * h + C * a - (P * l + B * f), $ >= b || -$ >= b)) return $;
  p = a * C, u = ut * a, d = u - (u - a), y = a - d, u = ut * C, g = u - (u - C), S = C - g, _ = y * S - (p - d * g - y * g - d * S), w = f * B, u = ut * f, d = u - (u - f), y = f - d, u = ut * B, g = u - (u - B), S = B - g, k = y * S - (w - d * g - y * g - d * S), v = _ - k, c = _ - v, yt[0] = _ - (v + c) + (c - k), m = p + v, c = m - p, x = p - (m - c) + (v - c), v = x - w, c = x - v, yt[1] = x - (v + c) + (c - w), O = m + v, c = O - m, yt[2] = m - (O - c) + (v - c), yt[3] = O;
  const I = $e(4, Gt, 4, yt, rn);
  p = A * h, u = ut * A, d = u - (u - A), y = A - d, u = ut * h, g = u - (u - h), S = h - g, _ = y * S - (p - d * g - y * g - d * S), w = P * l, u = ut * P, d = u - (u - P), y = P - d, u = ut * l, g = u - (u - l), S = l - g, k = y * S - (w - d * g - y * g - d * S), v = _ - k, c = _ - v, yt[0] = _ - (v + c) + (c - k), m = p + v, c = m - p, x = p - (m - c) + (v - c), v = x - w, c = x - v, yt[1] = x - (v + c) + (c - w), O = m + v, c = O - m, yt[2] = m - (O - c) + (v - c), yt[3] = O;
  const E = $e(I, rn, 4, yt, on);
  p = a * h, u = ut * a, d = u - (u - a), y = a - d, u = ut * h, g = u - (u - h), S = h - g, _ = y * S - (p - d * g - y * g - d * S), w = f * l, u = ut * f, d = u - (u - f), y = f - d, u = ut * l, g = u - (u - l), S = l - g, k = y * S - (w - d * g - y * g - d * S), v = _ - k, c = _ - v, yt[0] = _ - (v + c) + (c - k), m = p + v, c = m - p, x = p - (m - c) + (v - c), v = x - w, c = x - v, yt[1] = x - (v + c) + (c - w), O = m + v, c = O - m, yt[2] = m - (O - c) + (v - c), yt[3] = O;
  const N = $e(E, on, 4, yt, sn);
  return sn[N - 1];
}
function an(e, t, n, i, o, r) {
  const s = (t - r) * (n - o), a = (e - o) * (i - r), f = s - a;
  if (s === 0 || a === 0 || s > 0 != a > 0) return f;
  const l = Math.abs(s + a);
  return Math.abs(f) >= ki * l ? f : -Ii(e, t, n, i, o, r, l);
}
function Bi(e, t) {
  const n = new Ke([], Gn);
  return Pi(e, n), Ni(n, t);
}
function Gn(e, t) {
  return e.p.x > t.p.x ? 1 : e.p.x < t.p.x || e.p.x === t.p.x && (e.featureId !== t.featureId || e.ringId !== t.ringId) && e.isLeftEndpoint && !t.isLeftEndpoint ? -1 : e.p.y !== t.p.y ? e.p.y > t.p.y ? 1 : -1 : 1;
}
function Oi(e, t) {
  return e.rightSweepEvent.p.x > t.rightSweepEvent.p.x ? 1 : e.rightSweepEvent.p.x < t.rightSweepEvent.p.x ? -1 : e.rightSweepEvent.p.y !== t.rightSweepEvent.p.y ? e.rightSweepEvent.p.y < t.rightSweepEvent.p.y ? 1 : -1 : 1;
}
function Pi(e, t) {
  if (e.type === "FeatureCollection") {
    const n = e.features;
    for (let i = 0; i < n.length; i++)
      cn(n[i], t);
  } else
    cn(e, t);
}
var we = 0, ye = 0, ve = 0;
function cn(e, t) {
  const n = e.type === "Feature" ? e.geometry : e;
  let i = n.coordinates;
  (n.type === "Polygon" || n.type === "MultiLineString") && (i = [i]), n.type === "LineString" && (i = [[i]]);
  for (let o = 0; o < i.length; o++)
    for (let r = 0; r < i[o].length; r++) {
      let s = i[o][r][0], a = null;
      ye = ye + 1;
      for (let f = 0; f < i[o][r].length - 1; f++) {
        a = i[o][r][f + 1];
        const l = new ln(s, we, ye, ve), h = new ln(a, we, ye, ve + 1);
        l.otherEvent = h, h.otherEvent = l, Gn(l, h) > 0 ? (h.isLeftEndpoint = !0, l.isLeftEndpoint = !1) : (l.isLeftEndpoint = !0, h.isLeftEndpoint = !1), t.push(l), t.push(h), s = a, ve = ve + 1;
      }
    }
  we = we + 1;
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
function Ni(e, t = !1) {
  const n = [], i = new Ke([], Oi);
  for (; e.length; ) {
    const o = e.pop();
    if (o.isLeftEndpoint) {
      const r = new Ti(o);
      for (let s = 0; s < i.data.length; s++) {
        const a = i.data[s];
        if (t && a.leftSweepEvent.featureId === o.featureId)
          continue;
        const f = Ci(r, a);
        f !== !1 && n.push(f);
      }
      i.push(r);
    } else o.isLeftEndpoint === !1 && i.pop();
  }
  return n;
}
var Ti = class {
  /** @param event must have otherEvent non-null */
  constructor(e) {
    this.leftSweepEvent = e, this.rightSweepEvent = e.otherEvent;
  }
};
function Ci(e, t) {
  if (e === null || t === null) return !1;
  const n = e.leftSweepEvent.p.x, i = e.leftSweepEvent.p.y, o = e.rightSweepEvent.p.x, r = e.rightSweepEvent.p.y, s = t.leftSweepEvent.p.x, a = t.leftSweepEvent.p.y, f = t.rightSweepEvent.p.x, l = t.rightSweepEvent.p.y, h = an(n, i, o, r, s, a), c = an(n, i, o, r, f, l);
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
  const u = (l - a) * (o - n) - (f - s) * (r - i), d = (f - s) * (i - a) - (l - a) * (n - s), y = (o - n) * (i - a) - (r - i) * (n - s);
  if (u === 0)
    return !1;
  const g = d / u, S = y / u;
  if (g >= 0 && g <= 1 && S >= 0 && S <= 1) {
    const v = n + g * (o - n), m = i + g * (r - i);
    return [v, m];
  }
  return !1;
}
function Di(e, t, n = {}) {
  const { removeDuplicates: i = !0, ignoreSelfIntersections: o = !0 } = n;
  let r = [];
  e.type === "FeatureCollection" ? r = r.concat(e.features) : e.type === "Feature" ? r.push(e) : (e.type === "LineString" || e.type === "Polygon" || e.type === "MultiLineString" || e.type === "MultiPolygon") && r.push(ae(e)), t.type === "FeatureCollection" ? r = r.concat(t.features) : t.type === "Feature" ? r.push(t) : (t.type === "LineString" || t.type === "Polygon" || t.type === "MultiLineString" || t.type === "MultiPolygon") && r.push(ae(t));
  const s = Bi(
    Mt(r),
    o
  );
  let a = [];
  if (i) {
    const f = {};
    s.forEach((l) => {
      const h = l.join(",");
      f[h] || (f[h] = !0, a.push(l));
    });
  } else
    a = s;
  return Mt(a.map((f) => Lt(f)));
}
function Xi(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function Fi(e) {
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
function $i(e, t = {}) {
  let n = 0, i = 0, o = 0;
  return Je(
    e,
    function(r) {
      n += r[0], i += r[1], o++;
    },
    !0
  ), Lt([n / o, i / o], t.properties);
}
var be = { exports: {} }, Ee = { exports: {} }, Yi = Ee.exports, fn;
function Ri() {
  return fn || (fn = 1, (function(e, t) {
    (function(n, i) {
      e.exports = i();
    })(Yi, function() {
      function n(m, x, p, _, w) {
        (function k(O, A, B, P, C) {
          for (; P > B; ) {
            if (P - B > 600) {
              var $ = P - B + 1, b = A - B + 1, I = Math.log($), E = 0.5 * Math.exp(2 * I / 3), N = 0.5 * Math.sqrt(I * E * ($ - E) / $) * (b - $ / 2 < 0 ? -1 : 1), D = Math.max(B, Math.floor(A - b * E / $ + N)), F = Math.min(P, Math.floor(A + ($ - b) * E / $ + N));
              k(O, A, D, F, C);
            }
            var M = O[A], T = B, X = P;
            for (i(O, B, A), C(O[P], M) > 0 && i(O, B, P); T < X; ) {
              for (i(O, T, X), T++, X--; C(O[T], M) < 0; ) T++;
              for (; C(O[X], M) > 0; ) X--;
            }
            C(O[B], M) === 0 ? i(O, B, X) : i(O, ++X, P), X <= A && (B = X + 1), A <= X && (P = X - 1);
          }
        })(m, x, p || 0, _ || m.length - 1, w || o);
      }
      function i(m, x, p) {
        var _ = m[x];
        m[x] = m[p], m[p] = _;
      }
      function o(m, x) {
        return m < x ? -1 : m > x ? 1 : 0;
      }
      var r = function(m) {
        m === void 0 && (m = 9), this._maxEntries = Math.max(4, m), this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries)), this.clear();
      };
      function s(m, x, p) {
        if (!p) return x.indexOf(m);
        for (var _ = 0; _ < x.length; _++) if (p(m, x[_])) return _;
        return -1;
      }
      function a(m, x) {
        f(m, 0, m.children.length, x, m);
      }
      function f(m, x, p, _, w) {
        w || (w = S(null)), w.minX = 1 / 0, w.minY = 1 / 0, w.maxX = -1 / 0, w.maxY = -1 / 0;
        for (var k = x; k < p; k++) {
          var O = m.children[k];
          l(w, m.leaf ? _(O) : O);
        }
        return w;
      }
      function l(m, x) {
        return m.minX = Math.min(m.minX, x.minX), m.minY = Math.min(m.minY, x.minY), m.maxX = Math.max(m.maxX, x.maxX), m.maxY = Math.max(m.maxY, x.maxY), m;
      }
      function h(m, x) {
        return m.minX - x.minX;
      }
      function c(m, x) {
        return m.minY - x.minY;
      }
      function u(m) {
        return (m.maxX - m.minX) * (m.maxY - m.minY);
      }
      function d(m) {
        return m.maxX - m.minX + (m.maxY - m.minY);
      }
      function y(m, x) {
        return m.minX <= x.minX && m.minY <= x.minY && x.maxX <= m.maxX && x.maxY <= m.maxY;
      }
      function g(m, x) {
        return x.minX <= m.maxX && x.minY <= m.maxY && x.maxX >= m.minX && x.maxY >= m.minY;
      }
      function S(m) {
        return { children: m, height: 1, leaf: !0, minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
      }
      function v(m, x, p, _, w) {
        for (var k = [x, p]; k.length; ) if (!((p = k.pop()) - (x = k.pop()) <= _)) {
          var O = x + Math.ceil((p - x) / _ / 2) * _;
          n(m, O, x, p, w), k.push(x, O, O, p);
        }
      }
      return r.prototype.all = function() {
        return this._all(this.data, []);
      }, r.prototype.search = function(m) {
        var x = this.data, p = [];
        if (!g(m, x)) return p;
        for (var _ = this.toBBox, w = []; x; ) {
          for (var k = 0; k < x.children.length; k++) {
            var O = x.children[k], A = x.leaf ? _(O) : O;
            g(m, A) && (x.leaf ? p.push(O) : y(m, A) ? this._all(O, p) : w.push(O));
          }
          x = w.pop();
        }
        return p;
      }, r.prototype.collides = function(m) {
        var x = this.data;
        if (!g(m, x)) return !1;
        for (var p = []; x; ) {
          for (var _ = 0; _ < x.children.length; _++) {
            var w = x.children[_], k = x.leaf ? this.toBBox(w) : w;
            if (g(m, k)) {
              if (x.leaf || y(m, k)) return !0;
              p.push(w);
            }
          }
          x = p.pop();
        }
        return !1;
      }, r.prototype.load = function(m) {
        if (!m || !m.length) return this;
        if (m.length < this._minEntries) {
          for (var x = 0; x < m.length; x++) this.insert(m[x]);
          return this;
        }
        var p = this._build(m.slice(), 0, m.length - 1, 0);
        if (this.data.children.length) if (this.data.height === p.height) this._splitRoot(this.data, p);
        else {
          if (this.data.height < p.height) {
            var _ = this.data;
            this.data = p, p = _;
          }
          this._insert(p, this.data.height - p.height - 1, !0);
        }
        else this.data = p;
        return this;
      }, r.prototype.insert = function(m) {
        return m && this._insert(m, this.data.height - 1), this;
      }, r.prototype.clear = function() {
        return this.data = S([]), this;
      }, r.prototype.remove = function(m, x) {
        if (!m) return this;
        for (var p, _, w, k = this.data, O = this.toBBox(m), A = [], B = []; k || A.length; ) {
          if (k || (k = A.pop(), _ = A[A.length - 1], p = B.pop(), w = !0), k.leaf) {
            var P = s(m, k.children, x);
            if (P !== -1) return k.children.splice(P, 1), A.push(k), this._condense(A), this;
          }
          w || k.leaf || !y(k, O) ? _ ? (p++, k = _.children[p], w = !1) : k = null : (A.push(k), B.push(p), p = 0, _ = k, k = k.children[0]);
        }
        return this;
      }, r.prototype.toBBox = function(m) {
        return m;
      }, r.prototype.compareMinX = function(m, x) {
        return m.minX - x.minX;
      }, r.prototype.compareMinY = function(m, x) {
        return m.minY - x.minY;
      }, r.prototype.toJSON = function() {
        return this.data;
      }, r.prototype.fromJSON = function(m) {
        return this.data = m, this;
      }, r.prototype._all = function(m, x) {
        for (var p = []; m; ) m.leaf ? x.push.apply(x, m.children) : p.push.apply(p, m.children), m = p.pop();
        return x;
      }, r.prototype._build = function(m, x, p, _) {
        var w, k = p - x + 1, O = this._maxEntries;
        if (k <= O) return a(w = S(m.slice(x, p + 1)), this.toBBox), w;
        _ || (_ = Math.ceil(Math.log(k) / Math.log(O)), O = Math.ceil(k / Math.pow(O, _ - 1))), (w = S([])).leaf = !1, w.height = _;
        var A = Math.ceil(k / O), B = A * Math.ceil(Math.sqrt(O));
        v(m, x, p, B, this.compareMinX);
        for (var P = x; P <= p; P += B) {
          var C = Math.min(P + B - 1, p);
          v(m, P, C, A, this.compareMinY);
          for (var $ = P; $ <= C; $ += A) {
            var b = Math.min($ + A - 1, C);
            w.children.push(this._build(m, $, b, _ - 1));
          }
        }
        return a(w, this.toBBox), w;
      }, r.prototype._chooseSubtree = function(m, x, p, _) {
        for (; _.push(x), !x.leaf && _.length - 1 !== p; ) {
          for (var w = 1 / 0, k = 1 / 0, O = void 0, A = 0; A < x.children.length; A++) {
            var B = x.children[A], P = u(B), C = ($ = m, b = B, (Math.max(b.maxX, $.maxX) - Math.min(b.minX, $.minX)) * (Math.max(b.maxY, $.maxY) - Math.min(b.minY, $.minY)) - P);
            C < k ? (k = C, w = P < w ? P : w, O = B) : C === k && P < w && (w = P, O = B);
          }
          x = O || x.children[0];
        }
        var $, b;
        return x;
      }, r.prototype._insert = function(m, x, p) {
        var _ = p ? m : this.toBBox(m), w = [], k = this._chooseSubtree(_, this.data, x, w);
        for (k.children.push(m), l(k, _); x >= 0 && w[x].children.length > this._maxEntries; ) this._split(w, x), x--;
        this._adjustParentBBoxes(_, w, x);
      }, r.prototype._split = function(m, x) {
        var p = m[x], _ = p.children.length, w = this._minEntries;
        this._chooseSplitAxis(p, w, _);
        var k = this._chooseSplitIndex(p, w, _), O = S(p.children.splice(k, p.children.length - k));
        O.height = p.height, O.leaf = p.leaf, a(p, this.toBBox), a(O, this.toBBox), x ? m[x - 1].children.push(O) : this._splitRoot(p, O);
      }, r.prototype._splitRoot = function(m, x) {
        this.data = S([m, x]), this.data.height = m.height + 1, this.data.leaf = !1, a(this.data, this.toBBox);
      }, r.prototype._chooseSplitIndex = function(m, x, p) {
        for (var _, w, k, O, A, B, P, C = 1 / 0, $ = 1 / 0, b = x; b <= p - x; b++) {
          var I = f(m, 0, b, this.toBBox), E = f(m, b, p, this.toBBox), N = (w = I, k = E, O = void 0, A = void 0, B = void 0, P = void 0, O = Math.max(w.minX, k.minX), A = Math.max(w.minY, k.minY), B = Math.min(w.maxX, k.maxX), P = Math.min(w.maxY, k.maxY), Math.max(0, B - O) * Math.max(0, P - A)), D = u(I) + u(E);
          N < C ? (C = N, _ = b, $ = D < $ ? D : $) : N === C && D < $ && ($ = D, _ = b);
        }
        return _ || p - x;
      }, r.prototype._chooseSplitAxis = function(m, x, p) {
        var _ = m.leaf ? this.compareMinX : h, w = m.leaf ? this.compareMinY : c;
        this._allDistMargin(m, x, p, _) < this._allDistMargin(m, x, p, w) && m.children.sort(_);
      }, r.prototype._allDistMargin = function(m, x, p, _) {
        m.children.sort(_);
        for (var w = this.toBBox, k = f(m, 0, x, w), O = f(m, p - x, p, w), A = d(k) + d(O), B = x; B < p - x; B++) {
          var P = m.children[B];
          l(k, m.leaf ? w(P) : P), A += d(k);
        }
        for (var C = p - x - 1; C >= x; C--) {
          var $ = m.children[C];
          l(O, m.leaf ? w($) : $), A += d(O);
        }
        return A;
      }, r.prototype._adjustParentBBoxes = function(m, x, p) {
        for (var _ = p; _ >= 0; _--) l(x[_], m);
      }, r.prototype._condense = function(m) {
        for (var x = m.length - 1, p = void 0; x >= 0; x--) m[x].children.length === 0 ? x > 0 ? (p = m[x - 1].children).splice(p.indexOf(m[x]), 1) : this.clear() : a(m[x], this.toBBox);
      }, r;
    });
  })(Ee)), Ee.exports;
}
const Li = /* @__PURE__ */ Fi(_i);
var Zt = { exports: {} }, Ye, hn;
function Vi() {
  return hn || (hn = 1, Ye = function(t, n, i, o) {
    var r = t[0], s = t[1], a = !1;
    i === void 0 && (i = 0), o === void 0 && (o = n.length);
    for (var f = (o - i) / 2, l = 0, h = f - 1; l < f; h = l++) {
      var c = n[i + l * 2 + 0], u = n[i + l * 2 + 1], d = n[i + h * 2 + 0], y = n[i + h * 2 + 1], g = u > s != y > s && r < (d - c) * (s - u) / (y - u) + c;
      g && (a = !a);
    }
    return a;
  }), Ye;
}
var Re, un;
function qi() {
  return un || (un = 1, Re = function(t, n, i, o) {
    var r = t[0], s = t[1], a = !1;
    i === void 0 && (i = 0), o === void 0 && (o = n.length);
    for (var f = o - i, l = 0, h = f - 1; l < f; h = l++) {
      var c = n[l + i][0], u = n[l + i][1], d = n[h + i][0], y = n[h + i][1], g = u > s != y > s && r < (d - c) * (s - u) / (y - u) + c;
      g && (a = !a);
    }
    return a;
  }), Re;
}
var dn;
function ji() {
  if (dn) return Zt.exports;
  dn = 1;
  var e = Vi(), t = qi();
  return Zt.exports = function(i, o, r, s) {
    return o.length > 0 && Array.isArray(o[0]) ? t(i, o, r, s) : e(i, o, r, s);
  }, Zt.exports.nested = t, Zt.exports.flat = e, Zt.exports;
}
var ee = { exports: {} }, Ui = ee.exports, pn;
function zi() {
  return pn || (pn = 1, (function(e, t) {
    (function(n, i) {
      i(t);
    })(Ui, function(n) {
      const o = 33306690738754706e-32;
      function r(g, S, v, m, x) {
        let p, _, w, k, O = S[0], A = m[0], B = 0, P = 0;
        A > O == A > -O ? (p = O, O = S[++B]) : (p = A, A = m[++P]);
        let C = 0;
        if (B < g && P < v) for (A > O == A > -O ? (w = p - ((_ = O + p) - O), O = S[++B]) : (w = p - ((_ = A + p) - A), A = m[++P]), p = _, w !== 0 && (x[C++] = w); B < g && P < v; ) A > O == A > -O ? (w = p - ((_ = p + O) - (k = _ - p)) + (O - k), O = S[++B]) : (w = p - ((_ = p + A) - (k = _ - p)) + (A - k), A = m[++P]), p = _, w !== 0 && (x[C++] = w);
        for (; B < g; ) w = p - ((_ = p + O) - (k = _ - p)) + (O - k), O = S[++B], p = _, w !== 0 && (x[C++] = w);
        for (; P < v; ) w = p - ((_ = p + A) - (k = _ - p)) + (A - k), A = m[++P], p = _, w !== 0 && (x[C++] = w);
        return p === 0 && C !== 0 || (x[C++] = p), C;
      }
      function s(g) {
        return new Float64Array(g);
      }
      const a = 33306690738754716e-32, f = 22204460492503146e-32, l = 11093356479670487e-47, h = s(4), c = s(8), u = s(12), d = s(16), y = s(4);
      n.orient2d = function(g, S, v, m, x, p) {
        const _ = (S - p) * (v - x), w = (g - x) * (m - p), k = _ - w;
        if (_ === 0 || w === 0 || _ > 0 != w > 0) return k;
        const O = Math.abs(_ + w);
        return Math.abs(k) >= a * O ? k : -(function(A, B, P, C, $, b, I) {
          let E, N, D, F, M, T, X, Y, L, V, j, q, J, G, Q, H, Z, W;
          const st = A - $, ft = P - $, rt = B - b, ot = C - b;
          M = (Q = (Y = st - (X = (T = 134217729 * st) - (T - st))) * (V = ot - (L = (T = 134217729 * ot) - (T - ot))) - ((G = st * ot) - X * L - Y * L - X * V)) - (j = Q - (Z = (Y = rt - (X = (T = 134217729 * rt) - (T - rt))) * (V = ft - (L = (T = 134217729 * ft) - (T - ft))) - ((H = rt * ft) - X * L - Y * L - X * V))), h[0] = Q - (j + M) + (M - Z), M = (J = G - ((q = G + j) - (M = q - G)) + (j - M)) - (j = J - H), h[1] = J - (j + M) + (M - H), M = (W = q + j) - q, h[2] = q - (W - M) + (j - M), h[3] = W;
          let Dt = (function(ai, Qe) {
            let He = Qe[0];
            for (let Be = 1; Be < ai; Be++) He += Qe[Be];
            return He;
          })(4, h), Wt = f * I;
          if (Dt >= Wt || -Dt >= Wt || (E = A - (st + (M = A - st)) + (M - $), D = P - (ft + (M = P - ft)) + (M - $), N = B - (rt + (M = B - rt)) + (M - b), F = C - (ot + (M = C - ot)) + (M - b), E === 0 && N === 0 && D === 0 && F === 0) || (Wt = l * I + o * Math.abs(Dt), (Dt += st * F + ot * E - (rt * D + ft * N)) >= Wt || -Dt >= Wt)) return Dt;
          M = (Q = (Y = E - (X = (T = 134217729 * E) - (T - E))) * (V = ot - (L = (T = 134217729 * ot) - (T - ot))) - ((G = E * ot) - X * L - Y * L - X * V)) - (j = Q - (Z = (Y = N - (X = (T = 134217729 * N) - (T - N))) * (V = ft - (L = (T = 134217729 * ft) - (T - ft))) - ((H = N * ft) - X * L - Y * L - X * V))), y[0] = Q - (j + M) + (M - Z), M = (J = G - ((q = G + j) - (M = q - G)) + (j - M)) - (j = J - H), y[1] = J - (j + M) + (M - H), M = (W = q + j) - q, y[2] = q - (W - M) + (j - M), y[3] = W;
          const ri = r(4, h, 4, y, c);
          M = (Q = (Y = st - (X = (T = 134217729 * st) - (T - st))) * (V = F - (L = (T = 134217729 * F) - (T - F))) - ((G = st * F) - X * L - Y * L - X * V)) - (j = Q - (Z = (Y = rt - (X = (T = 134217729 * rt) - (T - rt))) * (V = D - (L = (T = 134217729 * D) - (T - D))) - ((H = rt * D) - X * L - Y * L - X * V))), y[0] = Q - (j + M) + (M - Z), M = (J = G - ((q = G + j) - (M = q - G)) + (j - M)) - (j = J - H), y[1] = J - (j + M) + (M - H), M = (W = q + j) - q, y[2] = q - (W - M) + (j - M), y[3] = W;
          const oi = r(ri, c, 4, y, u);
          M = (Q = (Y = E - (X = (T = 134217729 * E) - (T - E))) * (V = F - (L = (T = 134217729 * F) - (T - F))) - ((G = E * F) - X * L - Y * L - X * V)) - (j = Q - (Z = (Y = N - (X = (T = 134217729 * N) - (T - N))) * (V = D - (L = (T = 134217729 * D) - (T - D))) - ((H = N * D) - X * L - Y * L - X * V))), y[0] = Q - (j + M) + (M - Z), M = (J = G - ((q = G + j) - (M = q - G)) + (j - M)) - (j = J - H), y[1] = J - (j + M) + (M - H), M = (W = q + j) - q, y[2] = q - (W - M) + (j - M), y[3] = W;
          const si = r(oi, u, 4, y, d);
          return d[si - 1];
        })(g, S, v, m, x, p, O);
      }, n.orient2dfast = function(g, S, v, m, x, p) {
        return (S - p) * (v - x) - (g - x) * (m - p);
      }, Object.defineProperty(n, "__esModule", { value: !0 });
    });
  })(ee, ee.exports)), ee.exports;
}
var mn;
function Gi() {
  if (mn) return be.exports;
  mn = 1;
  var e = Ri(), t = Li, n = ji(), i = zi().orient2d;
  t.default && (t = t.default), be.exports = o, be.exports.default = o;
  function o(p, _, w) {
    _ = Math.max(0, _ === void 0 ? 2 : _), w = w || 0;
    var k = d(p), O = new e(16);
    O.toBBox = function(X) {
      return {
        minX: X[0],
        minY: X[1],
        maxX: X[0],
        maxY: X[1]
      };
    }, O.compareMinX = function(X, Y) {
      return X[0] - Y[0];
    }, O.compareMinY = function(X, Y) {
      return X[1] - Y[1];
    }, O.load(p);
    for (var A = [], B = 0, P; B < k.length; B++) {
      var C = k[B];
      O.remove(C), P = y(C, P), A.push(P);
    }
    var $ = new e(16);
    for (B = 0; B < A.length; B++) $.insert(u(A[B]));
    for (var b = _ * _, I = w * w; A.length; ) {
      var E = A.shift(), N = E.p, D = E.next.p, F = g(N, D);
      if (!(F < I)) {
        var M = F / b;
        C = r(O, E.prev.p, N, D, E.next.next.p, M, $), C && Math.min(g(C, N), g(C, D)) <= M && (A.push(E), A.push(y(C, E)), O.remove(C), $.remove(E), $.insert(u(E)), $.insert(u(E.next)));
      }
    }
    E = P;
    var T = [];
    do
      T.push(E.p), E = E.next;
    while (E !== P);
    return T.push(E.p), T;
  }
  function r(p, _, w, k, O, A, B) {
    for (var P = new t([], s), C = p.data; C; ) {
      for (var $ = 0; $ < C.children.length; $++) {
        var b = C.children[$], I = C.leaf ? S(b, w, k) : a(w, k, b);
        I > A || P.push({
          node: b,
          dist: I
        });
      }
      for (; P.length && !P.peek().node.children; ) {
        var E = P.pop(), N = E.node, D = S(N, _, w), F = S(N, k, O);
        if (E.dist < D && E.dist < F && l(w, N, B) && l(k, N, B)) return N;
      }
      C = P.pop(), C && (C = C.node);
    }
    return null;
  }
  function s(p, _) {
    return p.dist - _.dist;
  }
  function a(p, _, w) {
    if (f(p, w) || f(_, w)) return 0;
    var k = v(p[0], p[1], _[0], _[1], w.minX, w.minY, w.maxX, w.minY);
    if (k === 0) return 0;
    var O = v(p[0], p[1], _[0], _[1], w.minX, w.minY, w.minX, w.maxY);
    if (O === 0) return 0;
    var A = v(p[0], p[1], _[0], _[1], w.maxX, w.minY, w.maxX, w.maxY);
    if (A === 0) return 0;
    var B = v(p[0], p[1], _[0], _[1], w.minX, w.maxY, w.maxX, w.maxY);
    return B === 0 ? 0 : Math.min(k, O, A, B);
  }
  function f(p, _) {
    return p[0] >= _.minX && p[0] <= _.maxX && p[1] >= _.minY && p[1] <= _.maxY;
  }
  function l(p, _, w) {
    for (var k = Math.min(p[0], _[0]), O = Math.min(p[1], _[1]), A = Math.max(p[0], _[0]), B = Math.max(p[1], _[1]), P = w.search({ minX: k, minY: O, maxX: A, maxY: B }), C = 0; C < P.length; C++)
      if (c(P[C].p, P[C].next.p, p, _)) return !1;
    return !0;
  }
  function h(p, _, w) {
    return i(p[0], p[1], _[0], _[1], w[0], w[1]);
  }
  function c(p, _, w, k) {
    return p !== k && _ !== w && h(p, _, w) > 0 != h(p, _, k) > 0 && h(w, k, p) > 0 != h(w, k, _) > 0;
  }
  function u(p) {
    var _ = p.p, w = p.next.p;
    return p.minX = Math.min(_[0], w[0]), p.minY = Math.min(_[1], w[1]), p.maxX = Math.max(_[0], w[0]), p.maxY = Math.max(_[1], w[1]), p;
  }
  function d(p) {
    for (var _ = p[0], w = p[0], k = p[0], O = p[0], A = 0; A < p.length; A++) {
      var B = p[A];
      B[0] < _[0] && (_ = B), B[0] > k[0] && (k = B), B[1] < w[1] && (w = B), B[1] > O[1] && (O = B);
    }
    var P = [_, w, k, O], C = P.slice();
    for (A = 0; A < p.length; A++)
      n(p[A], P) || C.push(p[A]);
    return x(C);
  }
  function y(p, _) {
    var w = {
      p,
      prev: null,
      next: null,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };
    return _ ? (w.next = _.next, w.prev = _, _.next.prev = w, _.next = w) : (w.prev = w, w.next = w), w;
  }
  function g(p, _) {
    var w = p[0] - _[0], k = p[1] - _[1];
    return w * w + k * k;
  }
  function S(p, _, w) {
    var k = _[0], O = _[1], A = w[0] - k, B = w[1] - O;
    if (A !== 0 || B !== 0) {
      var P = ((p[0] - k) * A + (p[1] - O) * B) / (A * A + B * B);
      P > 1 ? (k = w[0], O = w[1]) : P > 0 && (k += A * P, O += B * P);
    }
    return A = p[0] - k, B = p[1] - O, A * A + B * B;
  }
  function v(p, _, w, k, O, A, B, P) {
    var C = w - p, $ = k - _, b = B - O, I = P - A, E = p - O, N = _ - A, D = C * C + $ * $, F = C * b + $ * I, M = b * b + I * I, T = C * E + $ * N, X = b * E + I * N, Y = D * M - F * F, L, V, j, q, J = Y, G = Y;
    Y === 0 ? (V = 0, J = 1, q = X, G = M) : (V = F * X - M * T, q = D * X - F * T, V < 0 ? (V = 0, q = X, G = M) : V > J && (V = J, q = X + F, G = M)), q < 0 ? (q = 0, -T < 0 ? V = 0 : -T > D ? V = J : (V = -T, J = D)) : q > G && (q = G, -T + F < 0 ? V = 0 : -T + F > D ? V = J : (V = -T + F, J = D)), L = V === 0 ? 0 : V / J, j = q === 0 ? 0 : q / G;
    var Q = (1 - L) * p + L * w, H = (1 - L) * _ + L * k, Z = (1 - j) * O + j * B, W = (1 - j) * A + j * P, st = Z - Q, ft = W - H;
    return st * st + ft * ft;
  }
  function m(p, _) {
    return p[0] === _[0] ? p[1] - _[1] : p[0] - _[0];
  }
  function x(p) {
    p.sort(m);
    for (var _ = [], w = 0; w < p.length; w++) {
      for (; _.length >= 2 && h(_[_.length - 2], _[_.length - 1], p[w]) <= 0; )
        _.pop();
      _.push(p[w]);
    }
    for (var k = [], O = p.length - 1; O >= 0; O--) {
      for (; k.length >= 2 && h(k[k.length - 2], k[k.length - 1], p[O]) <= 0; )
        k.pop();
      k.push(p[O]);
    }
    return k.pop(), _.pop(), _.concat(k);
  }
  return be.exports;
}
var Ji = Gi();
const Ki = /* @__PURE__ */ Xi(Ji);
function gn(e, t = {}) {
  t.concavity = t.concavity || 1 / 0;
  const n = [];
  if (Je(e, (o) => {
    n.push([o[0], o[1]]);
  }), !n.length)
    return null;
  const i = Ki(n, t.concavity);
  return i.length > 3 ? he([i], t.properties) : null;
}
function Jn(e, t, n = {}) {
  const i = { type: "Feature" };
  return (n.id === 0 || n.id) && (i.id = n.id), n.bbox && (i.bbox = n.bbox), i.properties = t || {}, i.geometry = e, i;
}
function ce(e, t, n = {}) {
  if (!e)
    throw new Error("coordinates is required");
  if (!Array.isArray(e))
    throw new Error("coordinates must be an Array");
  if (e.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!wn(e[0]) || !wn(e[1]))
    throw new Error("coordinates must contain numbers");
  return Jn({
    type: "Point",
    coordinates: e
  }, t, n);
}
function Kn(e, t, n = {}) {
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
  return Jn({
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
function Qi(e) {
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
function Hi(e) {
  return e.type === "Feature" ? e.geometry : e;
}
const Ct = 11102230246251565e-32, dt = 134217729, Wi = (3 + 8 * Ct) * Ct;
function Le(e, t, n, i, o) {
  let r, s, a, f, l = t[0], h = i[0], c = 0, u = 0;
  h > l == h > -l ? (r = l, l = t[++c]) : (r = h, h = i[++u]);
  let d = 0;
  if (c < e && u < n)
    for (h > l == h > -l ? (s = l + r, a = r - (s - l), l = t[++c]) : (s = h + r, a = r - (s - h), h = i[++u]), r = s, a !== 0 && (o[d++] = a); c < e && u < n; )
      h > l == h > -l ? (s = r + l, f = s - r, a = r - (s - f) + (l - f), l = t[++c]) : (s = r + h, f = s - r, a = r - (s - f) + (h - f), h = i[++u]), r = s, a !== 0 && (o[d++] = a);
  for (; c < e; )
    s = r + l, f = s - r, a = r - (s - f) + (l - f), l = t[++c], r = s, a !== 0 && (o[d++] = a);
  for (; u < n; )
    s = r + h, f = s - r, a = r - (s - f) + (h - f), h = i[++u], r = s, a !== 0 && (o[d++] = a);
  return (r !== 0 || d === 0) && (o[d++] = r), d;
}
function Zi(e, t) {
  let n = t[0];
  for (let i = 1; i < e; i++) n += t[i];
  return n;
}
function de(e) {
  return new Float64Array(e);
}
const tr = (3 + 16 * Ct) * Ct, er = (2 + 12 * Ct) * Ct, nr = (9 + 64 * Ct) * Ct * Ct, Jt = de(4), vn = de(8), bn = de(12), xn = de(16), vt = de(4);
function ir(e, t, n, i, o, r, s) {
  let a, f, l, h, c, u, d, y, g, S, v, m, x, p, _, w, k, O;
  const A = e - o, B = n - o, P = t - r, C = i - r;
  p = A * C, u = dt * A, d = u - (u - A), y = A - d, u = dt * C, g = u - (u - C), S = C - g, _ = y * S - (p - d * g - y * g - d * S), w = P * B, u = dt * P, d = u - (u - P), y = P - d, u = dt * B, g = u - (u - B), S = B - g, k = y * S - (w - d * g - y * g - d * S), v = _ - k, c = _ - v, Jt[0] = _ - (v + c) + (c - k), m = p + v, c = m - p, x = p - (m - c) + (v - c), v = x - w, c = x - v, Jt[1] = x - (v + c) + (c - w), O = m + v, c = O - m, Jt[2] = m - (O - c) + (v - c), Jt[3] = O;
  let $ = Zi(4, Jt), b = er * s;
  if ($ >= b || -$ >= b || (c = e - A, a = e - (A + c) + (c - o), c = n - B, l = n - (B + c) + (c - o), c = t - P, f = t - (P + c) + (c - r), c = i - C, h = i - (C + c) + (c - r), a === 0 && f === 0 && l === 0 && h === 0) || (b = nr * s + Wi * Math.abs($), $ += A * h + C * a - (P * l + B * f), $ >= b || -$ >= b)) return $;
  p = a * C, u = dt * a, d = u - (u - a), y = a - d, u = dt * C, g = u - (u - C), S = C - g, _ = y * S - (p - d * g - y * g - d * S), w = f * B, u = dt * f, d = u - (u - f), y = f - d, u = dt * B, g = u - (u - B), S = B - g, k = y * S - (w - d * g - y * g - d * S), v = _ - k, c = _ - v, vt[0] = _ - (v + c) + (c - k), m = p + v, c = m - p, x = p - (m - c) + (v - c), v = x - w, c = x - v, vt[1] = x - (v + c) + (c - w), O = m + v, c = O - m, vt[2] = m - (O - c) + (v - c), vt[3] = O;
  const I = Le(4, Jt, 4, vt, vn);
  p = A * h, u = dt * A, d = u - (u - A), y = A - d, u = dt * h, g = u - (u - h), S = h - g, _ = y * S - (p - d * g - y * g - d * S), w = P * l, u = dt * P, d = u - (u - P), y = P - d, u = dt * l, g = u - (u - l), S = l - g, k = y * S - (w - d * g - y * g - d * S), v = _ - k, c = _ - v, vt[0] = _ - (v + c) + (c - k), m = p + v, c = m - p, x = p - (m - c) + (v - c), v = x - w, c = x - v, vt[1] = x - (v + c) + (c - w), O = m + v, c = O - m, vt[2] = m - (O - c) + (v - c), vt[3] = O;
  const E = Le(I, vn, 4, vt, bn);
  p = a * h, u = dt * a, d = u - (u - a), y = a - d, u = dt * h, g = u - (u - h), S = h - g, _ = y * S - (p - d * g - y * g - d * S), w = f * l, u = dt * f, d = u - (u - f), y = f - d, u = dt * l, g = u - (u - l), S = l - g, k = y * S - (w - d * g - y * g - d * S), v = _ - k, c = _ - v, vt[0] = _ - (v + c) + (c - k), m = p + v, c = m - p, x = p - (m - c) + (v - c), v = x - w, c = x - v, vt[1] = x - (v + c) + (c - w), O = m + v, c = O - m, vt[2] = m - (O - c) + (v - c), vt[3] = O;
  const N = Le(E, bn, 4, vt, xn);
  return xn[N - 1];
}
function rr(e, t, n, i, o, r) {
  const s = (t - r) * (n - o), a = (e - o) * (i - r), f = s - a, l = Math.abs(s + a);
  return Math.abs(f) >= tr * l ? f : -ir(e, t, n, i, o, r, l);
}
function or(e, t) {
  var n, i, o = 0, r, s, a, f, l, h, c, u = e[0], d = e[1], y = t.length;
  for (n = 0; n < y; n++) {
    i = 0;
    var g = t[n], S = g.length - 1;
    if (h = g[0], h[0] !== g[S][0] && h[1] !== g[S][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (s = h[0] - u, a = h[1] - d, i; i < S; i++) {
      if (c = g[i + 1], f = c[0] - u, l = c[1] - d, a === 0 && l === 0) {
        if (f <= 0 && s >= 0 || s <= 0 && f >= 0)
          return 0;
      } else if (l >= 0 && a <= 0 || l <= 0 && a >= 0) {
        if (r = rr(s, f, a, l, 0, 0), r === 0)
          return 0;
        (r > 0 && l > 0 && a <= 0 || r < 0 && l <= 0 && a > 0) && o++;
      }
      h = c, a = l, s = f;
    }
  }
  return o % 2 !== 0;
}
function je(e, t, n = {}) {
  if (!e)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const i = Qi(e), o = Hi(t), r = o.type, s = t.bbox;
  let a = o.coordinates;
  if (s && sr(i, s) === !1)
    return !1;
  r === "Polygon" && (a = [a]);
  for (var f = 0; f < a.length; ++f) {
    const l = or(i, a[f]);
    if (l === 0 && !n.ignoreBoundary || l) return !0;
  }
  return !1;
}
function sr(e, t) {
  return t[0] <= e[0] && t[1] <= e[1] && t[2] >= e[0] && t[3] >= e[1];
}
function Ve(e, t) {
  for (let n = 0; n < t.features.length; n++)
    if (je(e, t.features[n]))
      return t.features[n];
}
function Qn(e, t) {
  const n = t.geometry.coordinates[0][0], i = t.geometry.coordinates[0][1], o = t.geometry.coordinates[0][2], r = e.geometry.coordinates, s = t.properties.a.geom, a = t.properties.b.geom, f = t.properties.c.geom, l = [i[0] - n[0], i[1] - n[1]], h = [o[0] - n[0], o[1] - n[1]], c = [r[0] - n[0], r[1] - n[1]], u = [a[0] - s[0], a[1] - s[1]], d = [f[0] - s[0], f[1] - s[1]], y = (h[1] * c[0] - h[0] * c[1]) / (l[0] * h[1] - l[1] * h[0]), g = (l[0] * c[1] - l[1] * c[0]) / (l[0] * h[1] - l[1] * h[0]);
  return [
    y * u[0] + g * d[0] + s[0],
    y * u[1] + g * d[1] + s[1]
  ];
}
function ar(e, t, n) {
  const i = e.geometry.coordinates, o = n.geometry.coordinates, r = Math.atan2(i[0] - o[0], i[1] - o[1]), s = cr(r, t[0]);
  if (s === void 0)
    throw new Error("Unable to determine vertex index");
  const a = t[1][s];
  return Qn(e, a.features[0]);
}
function ne(e, t, n, i, o, r, s, a) {
  let f;
  if (s && (f = Ve(e, Ht([s]))), !f)
    if (n) {
      const l = e.geometry.coordinates, h = n.gridNum, c = n.xOrigin, u = n.yOrigin, d = n.xUnit, y = n.yUnit, g = n.gridCache, S = Pt(l[0], c, d, h), v = Pt(l[1], u, y, h), m = g[S] ? g[S][v] ? g[S][v] : [] : [], x = Ht(m.map((p) => t.features[p]));
      f = Ve(e, x);
    } else
      f = Ve(e, t);
  return a && a(f), f ? Qn(e, f) : ar(e, i, o);
}
function Pt(e, t, n, i) {
  let o = Math.floor((e - t) / n);
  return o < 0 && (o = 0), o >= i && (o = i - 1), o;
}
function cr(e, t) {
  let n = _n(e - t[0]), i = Math.PI * 2, o;
  for (let r = 0; r < t.length; r++) {
    const s = (r + 1) % t.length, a = _n(e - t[s]), f = Math.min(Math.abs(n), Math.abs(a));
    n * a <= 0 && f < i && (i = f, o = r), n = a;
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
function Hn(e) {
  const t = ["a", "b", "c", "a"].map(
    (r) => e.properties[r].geom
  ), n = e.geometry.coordinates[0], i = e.properties, o = {
    a: { geom: n[0], index: i.a.index },
    b: { geom: n[1], index: i.b.index },
    c: { geom: n[2], index: i.c.index }
  };
  return Kn([t], o);
}
function lr(e) {
  const t = [0, 1, 2, 0].map((i) => e[i][0][0]), n = {
    a: { geom: e[0][0][1], index: e[0][1] },
    b: { geom: e[1][0][1], index: e[1][1] },
    c: { geom: e[2][0][1], index: e[2][1] }
  };
  return Kn([t], n);
}
function Ue(e, t, n, i, o, r = !1, s) {
  const a = e.map(
    (f) => {
      (!s || s < 2.00703) && (f = fr(f));
      const l = isFinite(f) ? t[f] : f === "c" ? i : (function() {
        const h = f.match(/^b(\d+)$/);
        if (h) return o[parseInt(h[1])];
        const c = f.match(/^e(\d+)$/);
        if (c) return n[parseInt(c[1])];
        throw new Error("Bad index value for indexesToTri");
      })();
      return r ? [[l[1], l[0]], f] : [[l[0], l[1]], f];
    }
  );
  return lr(a);
}
function fr(e) {
  return typeof e == "number" ? e : e.replace(/^(c|e|b)(?:ent|dgeNode|box)(\d+)?$/, "$1$2");
}
function Wn(e, t) {
  return t && t >= 2.00703 || Array.isArray(e[0]) ? e : e.map((n) => [
    n.illstNodes,
    n.mercNodes,
    n.startEnd
  ]);
}
const hr = 2.00704;
function ur(e) {
  return !!(e.version !== void 0 || !e.tins && e.points && e.tins_points);
}
function dr(e) {
  return {
    points: e.points,
    strictStatus: mr(e),
    verticesParams: gr(e),
    centroid: wr(e),
    edges: Wn(e.edges || []),
    edgeNodes: e.edgeNodes || [],
    tins: yr(e),
    kinks: vr(e.kinks_points),
    yaxisMode: e.yaxisMode ?? "invert",
    strictMode: e.strictMode ?? "auto",
    vertexMode: e.vertexMode,
    bounds: e.bounds,
    boundsPolygon: e.boundsPolygon,
    wh: e.wh,
    xy: e.xy ?? [0, 0]
  };
}
function pr(e) {
  const t = br(e), n = t.tins;
  return {
    compiled: t,
    tins: n,
    points: xr(n),
    strictStatus: t.strict_status,
    verticesParams: t.vertices_params,
    centroid: t.centroid,
    kinks: t.kinks
  };
}
function mr(e) {
  return e.strict_status ? e.strict_status : e.kinks_points ? "strict_error" : e.tins_points.length === 2 ? "loose" : "strict";
}
function gr(e) {
  const t = {
    forw: [e.vertices_params[0]],
    bakw: [e.vertices_params[1]]
  };
  return t.forw[1] = Sn(e, !1), t.bakw[1] = Sn(e, !0), t;
}
function Sn(e, t) {
  const n = e.vertices_points.length;
  return Array.from({ length: n }, (i, o) => {
    const r = (o + 1) % n, s = Ue(
      ["c", `b${o}`, `b${r}`],
      e.points,
      e.edgeNodes || [],
      e.centroid_point,
      e.vertices_points,
      t,
      hr
    );
    return Ht([s]);
  });
}
function wr(e) {
  return {
    forw: ce(e.centroid_point[0], {
      target: {
        geom: e.centroid_point[1],
        index: "c"
      }
    }),
    bakw: ce(e.centroid_point[1], {
      target: {
        geom: e.centroid_point[0],
        index: "c"
      }
    })
  };
}
function yr(e) {
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
function vr(e) {
  if (e)
    return {
      bakw: Ht(
        e.map((t) => ce(t))
      )
    };
}
function br(e) {
  return JSON.parse(
    JSON.stringify(e).replace('"cent"', '"c"').replace(/"bbox(\d+)"/g, '"b$1"')
  );
}
function xr(e) {
  const t = [], n = e.forw.features;
  for (let i = 0; i < n.length; i++) {
    const o = n[i];
    ["a", "b", "c"].forEach((r, s) => {
      const a = o.geometry.coordinates[0][s], f = o.properties[r].geom, l = o.properties[r].index;
      typeof l == "number" && (t[l] = [a, f]);
    });
  }
  return t;
}
class Et {
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
  yaxisMode = Et.YAXIS_INVERT;
  strictMode = Et.MODE_AUTO;
  vertexMode = Et.VERTEX_PLAIN;
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
    if (ur(t)) {
      this.applyModernState(dr(t));
      return;
    }
    this.applyLegacyState(pr(t));
  }
  applyModernState(t) {
    this.points = t.points, this.strict_status = t.strictStatus, this.vertices_params = t.verticesParams, this.centroid = t.centroid, this.edges = t.edges, this.edgeNodes = t.edgeNodes || [], this.tins = t.tins, this.addIndexedTin(), this.kinks = t.kinks, this.yaxisMode = t.yaxisMode ?? Et.YAXIS_INVERT, this.vertexMode = t.vertexMode ?? Et.VERTEX_PLAIN, this.strictMode = t.strictMode ?? Et.MODE_AUTO, t.bounds ? (this.bounds = t.bounds, this.boundsPolygon = t.boundsPolygon, this.xy = t.xy, this.wh = t.wh) : (this.bounds = void 0, this.boundsPolygon = void 0, this.xy = t.xy ?? [0, 0], t.wh && (this.wh = t.wh));
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
    const a = n.features.map((g) => {
      let S = [];
      return yn(g)[0].map((v) => {
        r.length === 0 ? r = [Array.from(v), Array.from(v)] : (v[0] < r[0][0] && (r[0][0] = v[0]), v[0] > r[1][0] && (r[1][0] = v[0]), v[1] < r[0][1] && (r[0][1] = v[1]), v[1] > r[1][1] && (r[1][1] = v[1])), S.length === 0 ? S = [Array.from(v), Array.from(v)] : (v[0] < S[0][0] && (S[0][0] = v[0]), v[0] > S[1][0] && (S[1][0] = v[0]), v[1] < S[0][1] && (S[0][1] = v[1]), v[1] > S[1][1] && (S[1][1] = v[1]));
      }), S;
    }), f = (r[1][0] - r[0][0]) / o, l = (r[1][1] - r[0][1]) / o, h = a.reduce(
      (g, S, v) => {
        const m = Pt(S[0][0], r[0][0], f, o), x = Pt(S[1][0], r[0][0], f, o), p = Pt(S[0][1], r[0][1], l, o), _ = Pt(S[1][1], r[0][1], l, o);
        for (let w = m; w <= x; w++) {
          g[w] || (g[w] = []);
          for (let k = p; k <= _; k++)
            g[w][k] || (g[w][k] = []), g[w][k].push(v);
        }
        return g;
      },
      []
    ), c = i.features.map((g) => {
      let S = [];
      return yn(g)[0].map((v) => {
        s.length === 0 ? s = [Array.from(v), Array.from(v)] : (v[0] < s[0][0] && (s[0][0] = v[0]), v[0] > s[1][0] && (s[1][0] = v[0]), v[1] < s[0][1] && (s[0][1] = v[1]), v[1] > s[1][1] && (s[1][1] = v[1])), S.length === 0 ? S = [Array.from(v), Array.from(v)] : (v[0] < S[0][0] && (S[0][0] = v[0]), v[0] > S[1][0] && (S[1][0] = v[0]), v[1] < S[0][1] && (S[0][1] = v[1]), v[1] > S[1][1] && (S[1][1] = v[1]));
      }), S;
    }), u = (s[1][0] - s[0][0]) / o, d = (s[1][1] - s[0][1]) / o, y = c.reduce(
      (g, S, v) => {
        const m = Pt(S[0][0], s[0][0], u, o), x = Pt(S[1][0], s[0][0], u, o), p = Pt(S[0][1], s[0][1], d, o), _ = Pt(S[1][1], s[0][1], d, o);
        for (let w = m; w <= x; w++) {
          g[w] || (g[w] = []);
          for (let k = p; k <= _; k++)
            g[w][k] || (g[w][k] = []), g[w][k].push(v);
        }
        return g;
      },
      []
    );
    this.indexedTins = {
      forw: {
        gridNum: o,
        xOrigin: r[0][0],
        yOrigin: r[0][1],
        xUnit: f,
        yUnit: l,
        gridCache: h
      },
      bakw: {
        gridNum: o,
        xOrigin: s[0][0],
        yOrigin: s[0][1],
        xUnit: u,
        yUnit: d,
        gridCache: y
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
    if (n && this.strict_status == Et.STATUS_ERROR)
      throw new Error('Backward transform is not allowed if strict_status == "strict_error"');
    this.yaxisMode == Et.YAXIS_FOLLOW && n && (t = [t[0], -1 * t[1]]);
    const o = ce(t);
    if (this.bounds && !n && !i && !je(o, this.boundsPolygon))
      return !1;
    const r = n ? this.tins.bakw : this.tins.forw, s = n ? this.indexedTins.bakw : this.indexedTins.forw, a = n ? this.vertices_params.bakw : this.vertices_params.forw, f = n ? this.centroid.bakw : this.centroid.forw;
    let l, h;
    this.stateFull && (this.stateBackward == n ? l = this.stateTriangle : (this.stateBackward = n, this.stateTriangle = void 0), h = (u) => {
      this.stateTriangle = u;
    });
    let c = ne(
      o,
      r,
      s,
      a,
      f,
      void 0,
      l,
      h
    );
    if (this.bounds && n && !i) {
      const u = ce(c);
      if (!je(u, this.boundsPolygon)) return !1;
    } else this.yaxisMode == Et.YAXIS_FOLLOW && !n && (c = [c[0], -1 * c[1]]);
    return c;
  }
}
const kn = Math.pow(2, -52), xe = new Uint32Array(512);
class Ae {
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
  static from(t, n = Er, i = Ar) {
    const o = t.length, r = new Float64Array(o * 2);
    for (let s = 0; s < o; s++) {
      const a = t[s];
      r[2 * s] = n(a), r[2 * s + 1] = i(a);
    }
    return new Ae(r);
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
    let a = 1 / 0, f = 1 / 0, l = -1 / 0, h = -1 / 0;
    for (let A = 0; A < s; A++) {
      const B = t[2 * A], P = t[2 * A + 1];
      B < a && (a = B), P < f && (f = P), B > l && (l = B), P > h && (h = P), this._ids[A] = A;
    }
    const c = (a + l) / 2, u = (f + h) / 2;
    let d = 0, y = 0, g = 0;
    for (let A = 0, B = 1 / 0; A < s; A++) {
      const P = qe(c, u, t[2 * A], t[2 * A + 1]);
      P < B && (d = A, B = P);
    }
    const S = t[2 * d], v = t[2 * d + 1];
    for (let A = 0, B = 1 / 0; A < s; A++) {
      if (A === d) continue;
      const P = qe(S, v, t[2 * A], t[2 * A + 1]);
      P < B && P > 0 && (y = A, B = P);
    }
    let m = t[2 * y], x = t[2 * y + 1], p = 1 / 0;
    for (let A = 0; A < s; A++) {
      if (A === d || A === y) continue;
      const B = Sr(S, v, m, x, t[2 * A], t[2 * A + 1]);
      B < p && (g = A, p = B);
    }
    let _ = t[2 * g], w = t[2 * g + 1];
    if (p === 1 / 0) {
      for (let P = 0; P < s; P++)
        this._dists[P] = t[2 * P] - t[0] || t[2 * P + 1] - t[1];
      Kt(this._ids, this._dists, 0, s - 1);
      const A = new Uint32Array(s);
      let B = 0;
      for (let P = 0, C = -1 / 0; P < s; P++) {
        const $ = this._ids[P], b = this._dists[$];
        b > C && (A[B++] = $, C = b);
      }
      this.hull = A.subarray(0, B), this.triangles = new Uint32Array(0), this.halfedges = new Int32Array(0);
      return;
    }
    if (kt(S, v, m, x, _, w) < 0) {
      const A = y, B = m, P = x;
      y = g, m = _, x = w, g = A, _ = B, w = P;
    }
    const k = kr(S, v, m, x, _, w);
    this._cx = k.x, this._cy = k.y;
    for (let A = 0; A < s; A++)
      this._dists[A] = qe(t[2 * A], t[2 * A + 1], k.x, k.y);
    Kt(this._ids, this._dists, 0, s - 1), this._hullStart = d;
    let O = 3;
    i[d] = n[g] = y, i[y] = n[d] = g, i[g] = n[y] = d, o[d] = 0, o[y] = 1, o[g] = 2, r.fill(-1), r[this._hashKey(S, v)] = d, r[this._hashKey(m, x)] = y, r[this._hashKey(_, w)] = g, this.trianglesLen = 0, this._addTriangle(d, y, g, -1, -1, -1);
    for (let A = 0, B = 0, P = 0; A < this._ids.length; A++) {
      const C = this._ids[A], $ = t[2 * C], b = t[2 * C + 1];
      if (A > 0 && Math.abs($ - B) <= kn && Math.abs(b - P) <= kn || (B = $, P = b, C === d || C === y || C === g)) continue;
      let I = 0;
      for (let M = 0, T = this._hashKey($, b); M < this._hashSize && (I = r[(T + M) % this._hashSize], !(I !== -1 && I !== i[I])); M++)
        ;
      I = n[I];
      let E = I, N;
      for (; N = i[E], kt($, b, t[2 * E], t[2 * E + 1], t[2 * N], t[2 * N + 1]) >= 0; )
        if (E = N, E === I) {
          E = -1;
          break;
        }
      if (E === -1) continue;
      let D = this._addTriangle(E, C, i[E], -1, -1, o[E]);
      o[C] = this._legalize(D + 2), o[E] = D, O++;
      let F = i[E];
      for (; N = i[F], kt($, b, t[2 * F], t[2 * F + 1], t[2 * N], t[2 * N + 1]) < 0; )
        D = this._addTriangle(F, C, N, o[C], -1, o[F]), o[C] = this._legalize(D + 2), i[F] = F, O--, F = N;
      if (E === I)
        for (; N = n[E], kt($, b, t[2 * N], t[2 * N + 1], t[2 * E], t[2 * E + 1]) < 0; )
          D = this._addTriangle(N, C, E, -1, o[E], o[N]), this._legalize(D + 2), o[N] = D, i[E] = E, O--, E = N;
      this._hullStart = n[C] = E, i[E] = n[F] = C, i[C] = F, r[this._hashKey($, b)] = C, r[this._hashKey(t[2 * E], t[2 * E + 1])] = E;
    }
    this.hull = new Uint32Array(O);
    for (let A = 0, B = this._hullStart; A < O; A++)
      this.hull[A] = B, B = i[B];
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
    return Math.floor(_r(t - this._cx, n - this._cy) * this._hashSize) % this._hashSize;
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
      const a = i[t], f = t - t % 3;
      if (s = f + (t + 2) % 3, a === -1) {
        if (r === 0) break;
        t = xe[--r];
        continue;
      }
      const l = a - a % 3, h = f + (t + 1) % 3, c = l + (a + 2) % 3, u = n[s], d = n[t], y = n[h], g = n[c];
      if (Mr(
        o[2 * u],
        o[2 * u + 1],
        o[2 * d],
        o[2 * d + 1],
        o[2 * y],
        o[2 * y + 1],
        o[2 * g],
        o[2 * g + 1]
      )) {
        n[t] = g, n[a] = u;
        const v = i[c];
        if (v === -1) {
          let x = this._hullStart;
          do {
            if (this._hullTri[x] === c) {
              this._hullTri[x] = t;
              break;
            }
            x = this._hullPrev[x];
          } while (x !== this._hullStart);
        }
        this._link(t, v), this._link(a, i[s]), this._link(s, c);
        const m = l + (a + 1) % 3;
        r < xe.length && (xe[r++] = m);
      } else {
        if (r === 0) break;
        t = xe[--r];
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
function _r(e, t) {
  const n = e / (Math.abs(e) + Math.abs(t));
  return (t > 0 ? 3 - n : 1 + n) / 4;
}
function qe(e, t, n, i) {
  const o = e - n, r = t - i;
  return o * o + r * r;
}
function Mr(e, t, n, i, o, r, s, a) {
  const f = e - s, l = t - a, h = n - s, c = i - a, u = o - s, d = r - a, y = f * f + l * l, g = h * h + c * c, S = u * u + d * d;
  return f * (c * S - g * d) - l * (h * S - g * u) + y * (h * d - c * u) < 0;
}
function Sr(e, t, n, i, o, r) {
  const s = n - e, a = i - t, f = o - e, l = r - t, h = s * s + a * a, c = f * f + l * l, u = 0.5 / (s * l - a * f), d = (l * h - a * c) * u, y = (s * c - f * h) * u;
  return d * d + y * y;
}
function kr(e, t, n, i, o, r) {
  const s = n - e, a = i - t, f = o - e, l = r - t, h = s * s + a * a, c = f * f + l * l, u = 0.5 / (s * l - a * f), d = e + (l * h - a * c) * u, y = t + (s * c - f * h) * u;
  return { x: d, y };
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
    const a = e[r], f = t[a];
    for (; ; ) {
      do
        r++;
      while (t[e[r]] < f);
      do
        s--;
      while (t[e[s]] > f);
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
function Er(e) {
  return e[0];
}
function Ar(e) {
  return e[1];
}
class Ir {
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
class En extends Ir {
  constructor(t) {
    super(8, new Uint8Array(Math.ceil(t / 8)).fill(0));
  }
}
function Ot(e) {
  return e % 3 === 2 ? e - 2 : e + 1;
}
function _t(e) {
  return e % 3 === 0 ? e + 2 : e - 1;
}
function An(e, t, n, i, o, r, s, a) {
  const f = kt(e, t, o, r, s, a), l = kt(n, i, o, r, s, a);
  if (f > 0 && l > 0 || f < 0 && l < 0)
    return !1;
  const h = kt(o, r, e, t, n, i), c = kt(s, a, e, t, n, i);
  return h > 0 && c > 0 || h < 0 && c < 0 ? !1 : f === 0 && l === 0 && h === 0 && c === 0 ? !(Math.max(o, s) < Math.min(e, n) || Math.max(e, n) < Math.min(o, s) || Math.max(r, a) < Math.min(t, i) || Math.max(t, i) < Math.min(r, a)) : !0;
}
class Br {
  /**
   * The triangulation object from Delaunator.
   */
  del;
  constructor(t) {
    this.del = t;
  }
}
class In extends Br {
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
    let a = 0, f = r;
    do {
      if (++a > s)
        throw new Error(
          `Constraining edge [${t}, ${n}] exceeded the iteration limit`
        );
      const c = i[f], u = Ot(f);
      if (c === n)
        return this.protect(f);
      const d = _t(f), y = i[d];
      if (y === n)
        return this.protect(u), u;
      if (this.intersectSegments(t, n, y, c)) {
        f = d;
        break;
      }
      f = o[u];
    } while (f !== -1 && f !== r);
    let l = f, h = -1;
    for (; f !== -1; ) {
      if (++a > s)
        throw new Error(
          `Constraining edge [${t}, ${n}] exceeded the iteration limit`
        );
      const c = o[f], u = _t(f), d = _t(c), y = Ot(c);
      if (c === -1)
        throw new Error("Constraining edge exited the hull");
      if (this.consd.has(f))
        throw new Error("Edge intersects already constrained edge");
      if (this.isCollinear(t, n, i[f]) || this.isCollinear(t, n, i[c]))
        throw new Error("Constraining edge intersects point");
      if (!this.intersectSegments(
        i[f],
        i[c],
        i[u],
        i[d]
      )) {
        if (h === -1 && (h = f), i[d] === n) {
          if (f === h)
            throw new Error("Infinite loop: non-convex quadrilateral");
          f = h, h = -1;
          continue;
        }
        if (this.intersectSegments(
          t,
          n,
          i[d],
          i[c]
        ))
          f = d;
        else if (this.intersectSegments(
          t,
          n,
          i[y],
          i[d]
        ))
          f = y;
        else if (h === f)
          throw new Error("Infinite loop: no further intersect after non-convex");
        continue;
      }
      if (this.flipDiagonal(f), this.intersectSegments(
        t,
        n,
        i[u],
        i[d]
      ) && (h === -1 && (h = u), h === u))
        throw new Error("Infinite loop: flipped diagonal still intersects");
      i[d] === n ? (l = d, f = h, h = -1) : this.intersectSegments(
        t,
        n,
        i[y],
        i[d]
      ) && (f = y);
    }
    return this.protect(l), this.delaunify(!0), this.findEdge(t, n);
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
        const f = n[a];
        f !== -1 && (i.delete(f), this.isDelaunay(a) || (this.flipDiagonal(a), s++));
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
    const { triangles: i, halfedges: o } = this.del, r = i.length / 3, s = (y, g, S) => {
      const v = t(g), m = t(S);
      return t(y).some((x) => v.includes(x) && m.includes(x));
    }, a = (y) => s(i[y * 3], i[y * 3 + 1], i[y * 3 + 2]), f = (y, g, S, v) => Math.sign(kt(y[g * 2], y[g * 2 + 1], y[S * 2], y[S * 2 + 1], y[v * 2], y[v * 2 + 1])), l = n.map((y) => {
      let g = 0;
      for (let S = 0; S < r; S++) g += f(y, i[S * 3], i[S * 3 + 1], i[S * 3 + 2]);
      return g < 0 ? -1 : 1;
    }), h = (y) => {
      if (this.consd.has(y)) return !1;
      const g = o[y];
      if (g === -1) return !1;
      const S = i[y], v = i[Ot(y)], m = i[_t(y)], x = i[_t(g)];
      return n.every((p, _) => f(p, m, S, x) === l[_] && f(p, x, v, m) === l[_]);
    };
    let c = 0, u = !0;
    for (; u; ) {
      u = !1;
      for (let y = 0; y < r; y++)
        if (a(y))
          for (let g = 0; g < 3; g++) {
            const S = y * 3 + g;
            if (!h(S)) continue;
            const v = o[S], m = i[S], x = i[Ot(S)], p = i[_t(S)], _ = i[_t(v)];
            if (!(s(p, m, _) && s(_, x, p))) {
              this.protect(this.flipDiagonal(S)), c++, u = !0;
              break;
            }
          }
    }
    let d = 0;
    for (let y = 0; y < r; y++) a(y) && d++;
    return { flips: c, remaining: d };
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
    let s = i, a, f = 0;
    do {
      if (++f > o.length)
        throw new Error(
          `Looking up edge [${t}, ${n}] exceeded the iteration limit`
        );
      if (o[s] === t)
        return s;
      a = Ot(s), s = r[a];
    } while (s !== -1 && s !== i);
    return o[Ot(a)] === t ? -a : 1 / 0;
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
    const { triangles: n, halfedges: i } = this.del, o = this.flips, r = this.consd, s = i[t], a = _t(t), f = Ot(t), l = _t(s), h = Ot(s), c = i[a], u = i[l];
    if (r.has(t))
      throw new Error("Trying to flip a constrained edge");
    return n[t] = n[l], i[t] = u, o.set(t, o.has(l)) || r.set(t, r.has(l)), u !== -1 && (i[u] = t), i[a] = l, n[s] = n[a], i[s] = c, o.set(s, o.has(a)) || r.set(s, r.has(a)), c !== -1 && (i[c] = s), i[l] = a, this.markFlip(t), this.markFlip(f), this.markFlip(s), this.markFlip(h), o.add(a), r.delete(a), o.add(l), r.delete(l), this.updateVert(t), this.updateVert(f), this.updateVert(s), this.updateVert(h), a;
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
    return yi(
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
    const r = n[_t(t)], s = n[t], a = n[Ot(t)], f = n[_t(o)];
    return !this.inCircle(r, s, a, f);
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
function _e(e, t, n) {
  return ze(e, t, n).tin;
}
function ze(e, t, n, i) {
  if (t || (t = []), typeof e != "object" || e.type !== "FeatureCollection")
    throw "Argument points must be FeatureCollection";
  if (!Array.isArray(t)) throw "Argument points must be Array of Array";
  const o = e.features.map(
    (c) => c.geometry.coordinates
  );
  let r = Ae.from(o), s = 0, a;
  if (r.triangles.length !== 0 && (t.length !== 0 || i)) {
    let c = new In(r);
    c.constrainAll(t), i?.boundary && (a = Or(c, i.boundary), a || (r = Ae.from(o), c = new In(r, t))), i && ({ remaining: s } = c.forbidGroupTriangles(
      i.groupsOf,
      i.planes
    ), s -= a?.size ?? 0);
  }
  const f = [];
  for (let c = 0; c < r.triangles.length; c += 3)
    a?.has(c / 3) || f.push([r.triangles[c], r.triangles[c + 1], r.triangles[c + 2]]);
  const l = ["a", "b", "c"];
  return { tin: Mt(
    f.map((c) => {
      const u = {}, d = c.map((y, g) => {
        const S = e.features[y], v = S.geometry.coordinates, m = [v[0], v[1]];
        return v.length === 3 ? m[2] = v[2] : u[l[g]] = S.properties[n], m;
      });
      return d[3] = d[0], he([d], u);
    })
  ), remaining: s, hasBoundary: a !== void 0 };
}
function Or(e, t) {
  try {
    e.constrainAll(t);
  } catch {
    return;
  }
  const n = new Map(t), { triangles: i, halfedges: o } = e.del, r = (l) => {
    const h = i[l], c = i[Ot(l)];
    return n.get(h) === c || n.get(c) === h;
  }, s = /* @__PURE__ */ new Set(), a = [], f = (l) => {
    const h = Math.floor(l / 3);
    s.has(h) || (s.add(h), a.push(h));
  };
  for (let l = 0; l < o.length; l++)
    o[l] === -1 && !r(l) && f(l);
  for (let l = 0; l < a.length; l++)
    for (let h = a[l] * 3; h < a[l] * 3 + 3; h++) {
      if (!n.has(i[h])) return;
      o[h] !== -1 && !r(h) && f(o[h]);
    }
  return s;
}
function ie(e, t, n) {
  return Lt(e, { target: { geom: t, index: n } });
}
function re(e) {
  return Lt(e.properties.target.geom, {
    target: {
      geom: e.geometry.coordinates,
      index: e.properties.target.index
    }
  });
}
function Bn(e, t) {
  const n = e.length, i = t.geometry.coordinates;
  return Array.from({ length: n }, (o, r) => r).map((o) => {
    const r = (o + 1) % n, s = e[o], a = e[r], f = s.geometry.coordinates, l = Math.atan2(
      f[0] - i[0],
      f[1] - i[1]
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
    }, u = Mt([
      he([h], c)
    ]);
    return [l, u];
  }).reduce(
    (o, r) => (o[0].push(r[0]), o[1].push(r[1]), o),
    [[], []]
  );
}
const Pr = [0.1, 0.15, 0.225, 0.34, 0.5];
function On(e, t, n) {
  return Math.sign(kt(e[0], e[1], t[0], t[1], n[0], n[1]));
}
function Pn(e) {
  let t = 0;
  for (const n of e.features) {
    const { a: i, b: o, c: r } = n.properties;
    if (![i, o, r].some(
      ({ index: l }) => typeof l == "string" && l.startsWith("b")
    ))
      continue;
    const [s, a, f] = n.geometry.coordinates[0];
    On(s, a, f) * On(i.geom, o.geom, r.geom) >= 0 && t++;
  }
  return t;
}
function Nn(e, t, n) {
  if (e.some(([s, a]) => s === t[0] && a === t[1])) return !1;
  const i = e.map(
    ([s, a]) => Math.atan2(a - t[1], s - t[0])
  ), o = 2 * Math.PI;
  let r = 0;
  for (let s = 0; s < i.length; s++) {
    const f = (n * (i[(s + 1) % i.length] - i[s]) + o) % o;
    if (!(f > 0 && f < Math.PI)) return !1;
    r += f;
  }
  return Math.abs(r - o) < 1e-6;
}
function Nr(e, t, n, i) {
  const { minx: o, maxx: r, miny: s, maxy: a, centroid: f } = e, l = r - o, h = a - s, c = n.forw.length, u = Array.from({ length: c }, () => []);
  let d = 1;
  for (const [v, m] of n.edges)
    v < i && u[v].push(d), u[m].push(d), m < i && d++;
  const y = [0], g = (v) => v >= c ? y : u[v];
  let S;
  for (const v of Pr) {
    const m = t(
      {
        ...e,
        minx: o - v * l,
        maxx: r + v * l,
        miny: s - v * h,
        maxy: a + v * h
      },
      !0
    ), x = m.map(
      ({ forw: E, bakw: N }, D) => ie(E, N, `b${D}`)
    ), p = Mt([...n.forw, ...x]), _ = Mt([
      ...n.bakw,
      ...x.map(re)
    ]), w = [p, _].map(
      ({ features: E }) => Float64Array.from(
        E.flatMap(
          ({
            geometry: {
              coordinates: [N, D]
            }
          }) => [N, D]
        )
      )
    ), O = Nn(
      m.map((E) => E.forw),
      f.forw,
      -1
    ) && Nn(
      m.map((E) => E.bakw),
      f.bakw,
      1
    ) ? m.map((E, N) => [
      c + N,
      c + (N + 1) % m.length
    ]) : void 0, A = { groupsOf: g, planes: w, boundary: O }, B = ze(
      p,
      n.edges,
      "target",
      A
    ), P = ze(
      _,
      n.edges,
      "target",
      A
    ), C = B.tin, $ = P.tin, b = Pn(C) + Pn($), I = {
      vertices: m,
      forw: C,
      bakw: $,
      diagnostics: {
        margin: v,
        boundaryTriangleFlips: b,
        remainingForbiddenTriangles: B.remaining + P.remaining
      }
    };
    if (b === 0 && B.hasBoundary && P.hasBoundary)
      return I;
    (!S || b < S.diagnostics.boundaryTriangleFlips) && (S = I);
  }
  return S;
}
function Tr(e, t) {
  const n = [[], [], [], []], i = [];
  return Object.keys(e).forEach((o) => {
    const r = e[o], s = r.forw, a = r.bakw, f = [
      s[0] - t.forw[0],
      s[1] - t.forw[1]
    ], l = [
      a[0] - t.bakw[0],
      t.bakw[1] - a[1]
    ], h = { forw: f, bakw: l };
    if (i.push(h), f[0] === 0 || f[1] === 0)
      return;
    let c = 0;
    f[0] > 0 && (c += 1), f[1] > 0 && (c += 2), n[c].push(h);
  }), { perQuad: n, aggregate: i };
}
function Cr(e) {
  let t = 1 / 0, n = 0, i = 0;
  return e.forEach((o) => {
    const { forw: r, bakw: s } = o, a = Math.hypot(r[0], r[1]), f = Math.hypot(s[0], s[1]);
    if (f === 0) return;
    const l = a / f, h = Math.atan2(r[0], r[1]) - Math.atan2(s[0], s[1]);
    t = Math.min(t, l), n += Math.cos(h), i += Math.sin(h);
  }), isFinite(t) ? [t, Math.atan2(i, n)] : [1, 0];
}
function Dr(e, t, n) {
  const { perQuad: i, aggregate: o } = Tr(e, t), r = i.every((f) => f.length > 0), a = (n === "birdeye" ? r ? i : [o] : [o]).map((f) => Cr(f));
  return a.length === 1 ? [a[0], a[0], a[0], a[0]] : a;
}
function Xr(e, t) {
  let n = 0;
  return e[0] > t[0] && (n += 1), e[1] > t[1] && (n += 2), n;
}
function Fr(e, t, n) {
  const i = [
    e[0] - t.forw[0],
    e[1] - t.forw[1]
  ], r = Math.sqrt(i[0] ** 2 + i[1] ** 2) / n[0], s = Math.atan2(i[0], i[1]) - n[1];
  return [
    t.bakw[0] + r * Math.sin(s),
    t.bakw[1] - r * Math.cos(s)
  ];
}
function $r(e, t, n, i) {
  const o = t[0] - e[0], r = t[1] - e[1];
  if (Math.abs(o) < 1e-12 && Math.abs(r) < 1e-12) return null;
  const s = i[0] - n[0], a = i[1] - n[1], f = n[0] - e[0], l = n[1] - e[1], h = o * a - r * s;
  if (Math.abs(h) < 1e-12) return null;
  const c = (f * a - l * s) / h, u = (f * r - l * o) / h;
  return c <= 1e-10 || u < -1e-10 || u > 1 + 1e-10 ? null : { t: c, point: [e[0] + c * o, e[1] + c * r] };
}
function Yr(e, t, n) {
  const i = n.length;
  let o = -1 / 0, r = null;
  for (let s = 0; s < i; s++) {
    const a = (s + 1) % i, f = $r(
      e,
      t,
      n[s].bakw,
      n[a].bakw
    );
    f && f.t > o && (o = f.t, r = f.point);
  }
  return r;
}
function Tn(e, t) {
  const i = Math.atan2(e[0] - t[0], e[1] - t[1]) * (180 / Math.PI);
  return i < 0 ? i + 360 : i;
}
function Cn(e, t, n, i, o, r) {
  const s = t[0] - e[0], a = t[1] - e[1];
  if (s === 0 && a === 0) return null;
  const f = [];
  if (s !== 0)
    for (const h of [n, i]) {
      const c = (h - e[0]) / s;
      if (c > 0) {
        const u = e[1] + c * a;
        u >= o && u <= r && f.push({ t: c, x: h, y: u });
      }
    }
  if (a !== 0)
    for (const h of [o, r]) {
      const c = (h - e[1]) / a;
      if (c > 0) {
        const u = e[0] + c * s;
        u >= n && u <= i && f.push({ t: c, x: u, y: h });
      }
    }
  if (f.length === 0) return null;
  f.sort((h, c) => h.t - c.t);
  const l = f[0];
  return [l.x, l.y];
}
function Dn(e, t, n) {
  const i = e.length, o = new Array(i).fill(1);
  for (const r of t)
    for (let s = 0; s < i; s++) {
      const a = (s + 1) % i, f = We([e[s].bakw, e[a].bakw]), l = We([n.bakw, r.bakw]), h = Di(f, l);
      if (h.features.length > 0 && h.features[0].geometry) {
        const c = h.features[0], u = Math.sqrt(
          Math.pow(r.bakw[0] - n.bakw[0], 2) + Math.pow(r.bakw[1] - n.bakw[1], 2)
        ), d = Math.sqrt(
          Math.pow(c.geometry.coordinates[0] - n.bakw[0], 2) + Math.pow(c.geometry.coordinates[1] - n.bakw[1], 2)
        ), y = u / d;
        y > o[s] && (o[s] = y), y > o[a] && (o[a] = y);
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
function Zn(e, t, n) {
  const { convexBuf: i, centroid: o, allGcps: r, minx: s, maxx: a, miny: f, maxy: l } = e, h = Dr(i, o, t), u = [
    [s, f],
    [a, f],
    [a, l],
    [s, l]
  ].map((w) => ({
    forw: w,
    bakw: Fr(
      w,
      o,
      h[Xr(w, o.forw)]
    )
  }));
  if (u.sort(
    (w, k) => Math.atan2(w.forw[0] - o.forw[0], w.forw[1] - o.forw[1]) - Math.atan2(k.forw[0] - o.forw[0], k.forw[1] - o.forw[1])
  ), Dn(u, r, o), !n) return u;
  const d = 4, y = u.map(
    (w) => Math.atan2(w.forw[0] - o.forw[0], w.forw[1] - o.forw[1])
  ), g = u.map(
    (w) => Math.atan2(
      w.bakw[0] - o.bakw[0],
      -(w.bakw[1] - o.bakw[1])
    )
  );
  function S(w) {
    for (let k = 0; k < d; k++) {
      const O = (k + 1) % d, A = y[k], B = k < d - 1 ? y[O] : y[O] + 2 * Math.PI;
      let P = w;
      for (; P < A; ) P += 2 * Math.PI;
      for (; P >= A + 2 * Math.PI; ) P -= 2 * Math.PI;
      if (P >= A && P < B)
        return { i: k, j: O, frac: (P - A) / (B - A) };
    }
    return { i: 0, j: 1, frac: 0 };
  }
  function v(w) {
    const { i: k, j: O, frac: A } = S(w), B = g[k];
    let C = g[O] - B;
    for (; C > Math.PI; ) C -= 2 * Math.PI;
    for (; C < -Math.PI; ) C += 2 * Math.PI;
    return B + A * C;
  }
  const m = new Set(
    u.map(
      (w) => Math.floor(Tn(w.forw, o.forw) / 10) % 36
    )
  ), x = r.map((w) => ({
    forw: w.forw,
    bakw: w.bakw,
    angleDeg: Tn(w.forw, o.forw),
    forwDist: Math.hypot(w.forw[0] - o.forw[0], w.forw[1] - o.forw[1])
  })), p = [];
  for (let w = 0; w < 36; w++) {
    if (m.has(w)) continue;
    const k = w * 10, O = x.filter(
      (I) => I.angleDeg >= k && I.angleDeg < k + 10
    );
    let A = null;
    if (O.length > 0) {
      const I = O.reduce((E, N) => N.forwDist > E.forwDist ? N : E);
      A = Cn(o.forw, I.forw, s, a, f, l);
    }
    if (!A) {
      const I = (k + 5) % 360 * (Math.PI / 180), E = [
        o.forw[0] + Math.sin(I),
        o.forw[1] + Math.cos(I)
      ];
      A = Cn(o.forw, E, s, a, f, l);
    }
    if (!A) continue;
    const B = [A[0] - o.forw[0], A[1] - o.forw[1]], P = Math.atan2(B[0], B[1]), C = v(P), $ = [
      o.bakw[0] + Math.sin(C),
      o.bakw[1] - Math.cos(C)
    ], b = Yr(o.bakw, $, u);
    b && p.push({ forw: A, bakw: b });
  }
  const _ = [...u, ...p];
  return _.sort(
    (w, k) => Math.atan2(w.forw[0] - o.forw[0], w.forw[1] - o.forw[1]) - Math.atan2(k.forw[0] - o.forw[0], k.forw[1] - o.forw[1])
  ), Dn(_, r, o), _;
}
function Rr(e, t = !1) {
  return Zn(e, "plain", t);
}
function Lr(e, t = !1) {
  return Zn(e, "birdeye", t);
}
function xo(e) {
  return ti(e, 1 / 0);
}
const Xn = 1e5, Vr = 16;
function ti(e, t) {
  return qr(e), new jr(e).findSegmentIntersections(t).map(
    (o) => Lt([o.x, o.y])
  );
}
function qr(e) {
  for (let t = 0, n = e.length; t < n; t++) {
    const i = e[t];
    le(i) || Ut(
      "findIntersections() received invalid coordinates:",
      `line=${t}`,
      `points=${i}`
    );
    for (let o = 0, r = i.length; o < r; o++) {
      const s = i[o];
      (!le(s) || !Number.isFinite(s[0]) || !Number.isFinite(s[1])) && Ut(
        "findIntersections() received non-finite coordinates:",
        `line=${t}`,
        `point=${o}`,
        `coordinates=${JSON.stringify(s)}`
      );
    }
  }
}
class jr {
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
    (r != this._xx.length || this._xx.length != this._yy.length) && Ut("ArcCollection#initXYData() Counting error"), this.initBounds(), this._arcIter = new fo(this._xx, this._yy);
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
    const o = i.length, r = new Float64Array(o * 4), s = new fe();
    let a = 0, f, l, h;
    for (let c = 0; c < o; c++)
      f = i[c], f > 0 && (l = c * 4, h = ho(t, n, a, f), r[l++] = h[0], r[l++] = h[1], r[l++] = h[2], r[l] = h[3], a += f, s.mergeBounds(h));
    return {
      bb: r,
      bounds: s
    };
  }
  getBounds() {
    return this._allBounds ? this._allBounds.clone() : new fe();
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
    let f = i ? this._ii[o] : this._ii[o] + s - 1, l = f, h = 0;
    for (let c = 1; c < s; c++)
      l += a, (r === 0 || this._zz[l] >= r) && (n(f, l, this._xx, this._yy), f = l, h++);
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
    const n = this.getBounds(), i = n.ymin || 0, o = (n.ymax || 0) - i, r = this.calcSegmentIntersectionStripeCount(), s = new Uint32Array(r), a = r > 1 ? (x) => Math.floor((r - 1) * (x - i) / o) : () => 0, f = r + 1;
    let l;
    this.forEachSegment(
      (x, p, _, w) => {
        let k = a(w[x]);
        const O = a(w[p]);
        let A = 0;
        for (; s[k] = s[k] + 2, k != O; )
          A++, A > f && Ut(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${r}`,
            `s1=${k}`,
            `s2=${O}`
          ), k += O > k ? 1 : -1;
      }
    );
    const h = this.getUint32Array(Gr(s));
    let c = 0;
    const u = [];
    Jr(s, (x) => {
      const p = c;
      c += x, u.push(h.subarray(p, c));
    }), Kr(s, 0), this.forEachSegment(
      (x, p, _, w) => {
        let k = a(w[x]);
        const O = a(w[p]);
        let A, B, P = 0;
        for (; A = s[k], s[k] = A + 2, B = u[k], B[A] = x, B[A + 1] = p, k != O; )
          P++, P > f && Ut(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${r}`,
            `s1=${k}`,
            `s2=${O}`
          ), k += O > k ? 1 : -1;
      }
    );
    const d = this.getVertexData(), y = t * Vr;
    let g = 0;
    const S = /* @__PURE__ */ new Set(), v = /* @__PURE__ */ new Map(), m = (x) => {
      g++;
      const p = lo(x);
      return S.has(p) || (S.add(p), v.set(`${x.x}:${x.y}`, x)), v.size >= t || g >= y;
    };
    if (d.xx && d.yy)
      for (l = 0; l < r && !Qr(u[l], d.xx, d.yy, m); l++)
        ;
    return Array.from(v.values());
  }
}
function Ut(...e) {
  const t = e.join(" ");
  throw new Error(t);
}
function le(e) {
  return e ? zr(e) ? !0 : Ur(e) ? !1 : e.length === 0 ? !0 : e.length > 0 : !1;
}
function Ur(e) {
  return e != null && e.toString === String.prototype.toString;
}
function zr(e) {
  return Array.isArray(e);
}
function Gr(e, t) {
  le(e) || Ut("utils.sum() expects an array, received:", e);
  let n = 0, i;
  for (let o = 0, r = e.length; o < r; o++)
    i = e[o], i && (n += i);
  return n;
}
function Jr(e, t, n) {
  if (!le(e))
    throw new Error(`#forEach() takes an array-like argument. ${e}`);
  for (let i = 0, o = e.length; i < o; i++)
    t.call(n, e[i], i);
}
function Kr(e, t) {
  for (let n = 0, i = e.length; n < i; n++)
    e[n] = t;
  return e;
}
function Qr(e, t, n, i) {
  const o = e.length - 2;
  let r, s, a, f, l, h, c, u, d, y, g, S, v, m, x, p, _;
  for (so(t, e), p = 0; p < o; ) {
    for (r = e[p], s = e[p + 1], l = t[r], h = t[s], d = n[r], y = n[s], _ = p; _ < o && (_ += 2, a = e[_], c = t[a], !(h < c)); ) {
      if (g = n[a], f = e[_ + 1], u = t[f], S = n[f], d >= g) {
        if (d > S && y > g && y > S) continue;
      } else if (d < S && y < g && y < S) continue;
      if (!(r == a || r == f || s == a || s == f) && (v = Hr(
        l,
        d,
        h,
        y,
        c,
        g,
        u,
        S
      ), v && (m = [r, s], x = [a, f], i($n(v, m, x, t, n)) || v.length == 4 && i($n(v.slice(2), m, x, t, n)))))
        return !0;
    }
    p += 2;
  }
  return !1;
}
function Hr(e, t, n, i, o, r, s, a) {
  const f = Wr(e, t, n, i, o, r, s, a);
  let l = null;
  return f && (l = Zr(e, t, n, i, o, r, s, a), l ? oo(e, t, n, i, o, r, s, a) && (l = null) : l = ro(e, t, n, i, o, r, s, a)), l;
}
function Wr(e, t, n, i, o, r, s, a) {
  return oe(e, t, n, i, o, r) * oe(e, t, n, i, s, a) <= 0 && oe(o, r, s, a, e, t) * oe(o, r, s, a, n, i) <= 0;
}
function oe(e, t, n, i, o, r) {
  return ei(e - o, t - r, n - o, i - r);
}
function ei(e, t, n, i) {
  return e * i - t * n;
}
function Zr(e, t, n, i, o, r, s, a) {
  let f = Me(e, t, n, i, o, r, s, a), l;
  return f && (l = eo(f[0], f[1], e, t, n, i, o, r, s, a), l == 1 ? f = Me(n, i, e, t, o, r, s, a) : l == 2 ? f = Me(o, r, s, a, e, t, n, i) : l == 3 && (f = Me(s, a, o, r, e, t, n, i))), f && io(f, e, t, n, i, o, r, s, a), f;
}
function Me(e, t, n, i, o, r, s, a) {
  const f = ei(n - e, i - t, s - o, a - r), l = 1e-18;
  let h;
  if (f === 0) return null;
  const c = oe(o, r, s, a, e, t) / f;
  return f <= l && f >= -l ? h = to(e, t, n, i, o, r, s, a) : h = [e + c * (n - e), t + c * (i - t)], h;
}
function to(e, t, n, i, o, r, s, a) {
  let f = null;
  return !Nt(e, o, s) && !Nt(t, r, a) ? f = [e, t] : !Nt(n, o, s) && !Nt(i, r, a) ? f = [n, i] : !Nt(o, e, n) && !Nt(r, t, i) ? f = [o, r] : !Nt(s, e, n) && !Nt(a, t, i) && (f = [s, a]), f;
}
function Nt(e, t, n) {
  let i;
  return t < n ? i = e < t || e > n : t > n ? i = e > t || e < n : i = e != t, i;
}
function eo(e, t, ...n) {
  let i = -1, o = 1 / 0, r;
  for (let s = 0, a = 0, f = n.length; a < f; s++, a += 2)
    r = no(e, t, n[a], n[a + 1]), r < o && (o = r, i = s);
  return i;
}
function no(e, t, n, i) {
  const o = e - n, r = t - i;
  return o * o + r * r;
}
function io(e, t, n, i, o, r, s, a, f) {
  let l = e[0], h = e[1];
  l = Se(l, t, i), l = Se(l, r, a), h = Se(h, n, o), h = Se(h, s, f), e[0] = l, e[1] = h;
}
function Se(e, t, n) {
  let i;
  return Nt(e, t, n) && (i = Math.abs(e - t) < Math.abs(e - n) ? t : n, e = i), e;
}
function ro(e, t, n, i, o, r, s, a) {
  const f = Math.min(e, n, o, s), l = Math.max(e, n, o, s), h = Math.min(t, i, r, a), c = Math.max(t, i, r, a), u = c - h > l - f;
  let d = [];
  return (u ? Rt(t, h, c) : Rt(e, f, l)) && d.push(e, t), (u ? Rt(i, h, c) : Rt(n, f, l)) && d.push(n, i), (u ? Rt(r, h, c) : Rt(o, f, l)) && d.push(o, r), (u ? Rt(a, h, c) : Rt(s, f, l)) && d.push(s, a), (d.length != 2 && d.length != 4 || d.length == 4 && d[0] == d[2] && d[1] == d[3]) && (d = null), d;
}
function oo(e, t, n, i, o, r, s, a) {
  return e == o && t == r || e == s && t == a || n == o && i == r || n == s && i == a;
}
function Rt(e, t, n) {
  return e > t && e < n;
}
function so(e, t) {
  ao(e, t), ni(e, t, 0, t.length - 2);
}
function ao(e, t) {
  for (let n = 0, i = t.length; n < i; n += 2)
    e[t[n]] > e[t[n + 1]] && co(t, n, n + 1);
}
function co(e, t, n) {
  const i = e[t];
  e[t] = e[n], e[n] = i;
}
function ni(e, t, n, i) {
  let o = n, r = i, s, a;
  for (; o < i; ) {
    for (s = e[t[n + i >> 2 << 1]]; o <= r; ) {
      for (; e[t[o]] < s; ) o += 2;
      for (; e[t[r]] > s; ) r -= 2;
      o <= r && (a = t[o], t[o] = t[r], t[r] = a, a = t[o + 1], t[o + 1] = t[r + 1], t[r + 1] = a, o += 2, r -= 2);
    }
    if (r - n < 40 ? Fn(e, t, n, r) : ni(e, t, n, r), i - o < 40) {
      Fn(e, t, o, i);
      return;
    }
    n = o, r = i;
  }
}
function Fn(e, t, n, i) {
  let o, r;
  for (let s = n + 2; s <= i; s += 2) {
    o = t[s], r = t[s + 1];
    let a;
    for (a = s - 2; a >= n && e[o] < e[t[a]]; a -= 2)
      t[a + 2] = t[a], t[a + 3] = t[a + 1];
    t[a + 2] = o, t[a + 3] = r;
  }
}
function $n(e, t, n, i, o) {
  const r = e[0], s = e[1];
  t = Yn(r, s, t[0], t[1], i, o), n = Yn(r, s, n[0], n[1], i, o);
  const a = t[0] < n[0] ? t : n, f = a == t ? n : t;
  return { x: r, y: s, a, b: f };
}
function Yn(e, t, n, i, o, r) {
  let s = n < i ? n : i, a = s === n ? i : n;
  return o[s] == e && r[s] == t ? a = s : o[a] == e && r[a] == t && (s = a), [s, a];
}
function lo(e) {
  return `${e.a.join(",")};${e.b.join(",")}`;
}
class fo {
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
function ho(e, t, n, i) {
  let o = n | 0;
  const r = isNaN(i) ? e.length - o : i + o;
  let s, a, f, l, h, c;
  if (r > 0)
    f = h = e[o], l = c = t[o];
  else return [void 0, void 0, void 0, void 0];
  for (o++; o < r; o++)
    s = e[o], a = t[o], s < f && (f = s), s > h && (h = s), a < l && (l = a), a > c && (c = a);
  return [f, l, h, c];
}
class fe {
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
    return new fe(
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
    let r, s, a, f;
    if (arguments.length == 1)
      if (le(t)) {
        const l = t;
        r = l[0], s = l[1], a = l[2], f = l[3];
      } else {
        const l = t;
        r = l.xmin, s = l.ymin, a = l.xmax, f = l.ymax;
      }
    else
      r = t, s = n, a = i, f = o;
    return this.xmin = r, this.ymin = s, this.xmax = a, this.ymax = f, (r > a || s > f) && this.update(), this;
  }
  update() {
    let t;
    this.xmin > this.xmax && (t = this.xmin, this.xmin = this.xmax, this.xmax = t), this.ymin > this.ymax && (t = this.ymin, this.ymin = this.ymax, this.ymax = t);
  }
  mergeBounds(t, ...n) {
    let i, o, r, s;
    return t instanceof fe ? (i = t.xmin, o = t.ymin, r = t.xmax, s = t.ymax) : n.length == 3 ? (i = t, o = n[0], r = n[1], s = n[2]) : t.length == 4 ? (i = t[0], o = t[1], r = t[2], s = t[3]) : Ut("Bounds#mergeBounds() invalid argument:", t), this.xmin === void 0 ? this.setBounds(i, o, r, s) : (i < this.xmin && (this.xmin = i), o < this.ymin && (this.ymin = o), r > this.xmax && (this.xmax = r), s > this.ymax && (this.ymax = s)), this;
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
function ii(e, t, n) {
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
function Rn(e, t, n) {
  const i = Ie(t.forw), o = Ie(t.bakw);
  if (JSON.stringify(i) != JSON.stringify(o))
    throw `${JSON.stringify(t, null, 2)}
${JSON.stringify(i)}
${JSON.stringify(o)}`;
  if (i.forEach((r) => {
    const s = e[r];
    if (!s) return;
    const a = s.filter((f) => f !== t);
    a.length === 0 ? delete e[r] : e[r] = a;
  }), n) {
    const r = (s, a) => {
      !s || !a || (s.features = s.features.filter((f) => f !== a));
    };
    r(n.forw, t.forw), r(n.bakw, t.bakw);
  }
}
function ke(e, t = 1e-6) {
  const [n, i] = e[0], [o, r] = e[1], [s, a] = e[2];
  return Math.abs((o - n) * (a - i) - (s - n) * (r - i)) < t;
}
function uo(e, t) {
  const n = /* @__PURE__ */ new Set();
  return e.forEach((i) => {
    if (i.length !== 2) return;
    const o = i.map((r) => `${t?.[r] ?? r}`);
    n.add(o.sort().join("-"));
  }), n;
}
function se(e) {
  return ["a", "b", "c"].map((t, n) => ({
    prop: e.properties[t],
    geom: e.geometry.coordinates[0][n]
  }));
}
const po = 10;
function mo(e, t, n, i, o, r) {
  if (!e && !t) return !1;
  const s = e ? 0 : 1, a = 1 - s, f = n[s], l = n[a];
  if (!f || !l) return !1;
  const h = xt(l.geom);
  let c = !1, u = !1;
  for (let d = 0; d <= 1; d++) {
    const y = i[d];
    if (!y) continue;
    const g = [String(y.prop.index), String(f.prop.index)].sort().join("-"), S = o[g];
    if (!S || S.length < 2) continue;
    const v = S.find(
      (P) => P.bakw !== r[s].bakw
    );
    if (!v) continue;
    const x = se(v.bakw).find(
      (P) => String(P.prop.index) !== String(y.prop.index) && String(P.prop.index) !== String(f.prop.index)
    );
    if (!x) continue;
    c = !0;
    const p = xt(x.geom), _ = xt(y.geom), w = xt(f.geom), k = w[0] - _[0], O = w[1] - _[1], A = k * (h[1] - _[1]) - O * (h[0] - _[0]), B = k * (p[1] - _[1]) - O * (p[0] - _[0]);
    if (A * B > 0) {
      u = !0;
      break;
    }
  }
  return c && !u;
}
function go(e, t, n, i) {
  if (!e && !t) return !1;
  if (n[0] && n[1] && i[0] && i[1]) {
    const o = i.map((h) => xt(h.geom)), r = n.map((h) => xt(h.geom)), s = o[1][0] - o[0][0], a = o[1][1] - o[0][1], f = s * (r[0][1] - o[0][1]) - a * (r[0][0] - o[0][0]), l = s * (r[1][1] - o[0][1]) - a * (r[1][0] - o[0][0]);
    return f * l < 0;
  }
  return !1;
}
function wo(e, t, n, i) {
  const o = uo(n, i), r = /* @__PURE__ */ new Set();
  let s = !1;
  for (let a = 0; a < po; a++) {
    let f = !1;
    for (const l of Object.keys(t)) {
      if (r.has(l)) continue;
      r.add(l);
      const h = t[l];
      if (!h || h.length < 2) continue;
      const c = l.split("-");
      if (c.length !== 2 || o.has(l)) continue;
      const u = se(h[0].bakw), d = se(h[1].bakw), y = se(h[0].forw), g = se(h[1].forw), S = c.map(
        (M) => u.find((T) => `${T.prop.index}` === M) || d.find((T) => `${T.prop.index}` === M)
      ), v = c.map(
        (M) => y.find((T) => `${T.prop.index}` === M) || g.find((T) => `${T.prop.index}` === M)
      );
      if (S.some((M) => !M) || v.some((M) => !M))
        continue;
      const m = [u, d].map(
        (M) => M.find((T) => !c.includes(`${T.prop.index}`))
      ), x = [y, g].map(
        (M) => M.find((T) => !c.includes(`${T.prop.index}`))
      );
      if (m.some((M) => !M) || x.some((M) => !M))
        continue;
      const p = h[0].bakw.geometry.coordinates[0].slice(0, 3).map((M) => xt(M)), _ = h[1].bakw.geometry.coordinates[0].slice(0, 3).map((M) => xt(M)), w = h[0].forw.geometry.coordinates[0].slice(0, 3).map((M) => xt(M)), k = h[1].forw.geometry.coordinates[0].slice(0, 3).map((M) => xt(M)), O = ke(p), A = ke(_), B = ke(w), P = ke(k), C = mo(
        O,
        A,
        m,
        S,
        t,
        h
      ), $ = go(
        B,
        P,
        m,
        S
      );
      if (!(C || $ || Ln(
        xt(m[0].geom),
        _
      ) || Ln(
        xt(m[1].geom),
        p
      )))
        continue;
      const I = v.map(
        (M) => xt(M.geom)
      ), E = x.map(
        (M) => xt(M.geom)
      ), N = yo([
        ...I,
        ...E
      ]), D = vo(N), F = Vn(
        I[0],
        I[1],
        E[0]
      ) + Vn(
        I[0],
        I[1],
        E[1]
      );
      Ge(D, F) && (Rn(t, h[0], e), Rn(t, h[1], e), S.forEach((M) => {
        if (!M) return;
        const T = [
          M.geom,
          m[0].geom,
          m[1].geom,
          M.geom
        ], X = {
          a: M.prop,
          b: m[0].prop,
          c: m[1].prop
        }, Y = he([T], X), L = Hn(Y);
        ii(t, {
          forw: L,
          bakw: Y
        }, e);
      }), f = !0, s = !0);
    }
    if (!f) break;
  }
  return s;
}
function xt(e) {
  return [e[0], e[1]];
}
function Ln(e, t) {
  const [n, i] = t[0], [o, r] = t[1], [s, a] = t[2], f = s - n, l = a - i, h = o - n, c = r - i, u = e[0] - n, d = e[1] - i, y = f * f + l * l, g = f * h + l * c, S = f * u + l * d, v = h * h + c * c, m = h * u + c * d, x = y * v - g * g;
  if (x === 0) return !1;
  const p = 1 / x, _ = (v * S - g * m) * p, w = (y * m - g * S) * p, k = 1e-9;
  return _ >= -k && w >= -k && _ + w <= 1 + k;
}
function yo(e) {
  const t = e.map((s) => s.slice()).filter(
    (s, a, f) => f.findIndex(
      (l) => Ge(l[0], s[0]) && Ge(l[1], s[1])
    ) === a
  );
  if (t.length <= 1) return t;
  const n = t.sort(
    (s, a) => s[0] === a[0] ? s[1] - a[1] : s[0] - a[0]
  ), i = (s, a, f) => (a[0] - s[0]) * (f[1] - s[1]) - (a[1] - s[1]) * (f[0] - s[0]), o = [];
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
function vo(e) {
  if (e.length < 3) return 0;
  let t = 0;
  for (let n = 0; n < e.length; n++) {
    const [i, o] = e[n], [r, s] = e[(n + 1) % e.length];
    t += i * s - r * o;
  }
  return Math.abs(t) / 2;
}
function Vn(e, t, n) {
  return Math.abs(
    (e[0] * (t[1] - n[1]) + t[0] * (n[1] - e[1]) + n[0] * (e[1] - t[1])) / 2
  );
}
function Ge(e, t, n = 1e-9) {
  return Math.abs(e - t) <= n;
}
const qn = 2.00704, jn = 3.00001;
class lt extends Et {
  importance;
  priority;
  pointsSet;
  useV2Algorithm;
  lastBoundaryDiagnostics;
  /** 現在の三角網を V3 で生成したときの外周の診断。 */
  get boundaryDiagnostics() {
    return this.tins && !this.useV2Algorithm ? this.lastBoundaryDiagnostics : void 0;
  }
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
    return this.useV2Algorithm ? qn : jn;
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
    this.edges = Wn(t), this.edgeNodes = void 0, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 境界ポリゴンを設定します
   */
  setBounds(t) {
    this.bounds = t;
    let n = t[0][0], i = n, o = t[0][1], r = o;
    const s = [t[0]];
    for (let a = 1; a < t.length; a++) {
      const f = t[a];
      f[0] < n && (n = f[0]), f[0] > i && (i = f[0]), f[1] < o && (o = f[1]), f[1] > r && (r = f[1]), s.push(f);
    }
    s.push(t[0]), this.boundsPolygon = he([s]), this.xy = [n, o], this.wh = [i - n, r - o], this.vertexMode = lt.VERTEX_PLAIN, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 現在の設定を永続化可能な形式にコンパイルします
   */
  getCompiled() {
    const t = {};
    t.version = this.useV2Algorithm ? qn : jn, t.points = this.points, t.weight_buffer = {}, t.centroid_point = [
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
    super.setCompiled(t), this.lastBoundaryDiagnostics = void 0;
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
  calculateStrictTin(t = Xn) {
    const n = this.tins.forw.features.map(
      (s) => Hn(s)
    );
    this.tins.bakw = Mt(n);
    const i = {};
    this.tins.forw.features.forEach((s, a) => {
      const f = this.tins.bakw.features[a];
      ii(i, { forw: s, bakw: f });
    });
    const o = (this.pointsSet?.forw.features ?? []).map(
      (s) => s.properties.target.index
    );
    wo(
      this.tins,
      i,
      this.pointsSet?.edges || [],
      o
    );
    const r = ["forw", "bakw"].map((s) => {
      const a = this.tins[s].features.map(
        (f) => f.geometry.coordinates[0]
      );
      return ti(a, t);
    });
    r[0].length === 0 && r[1].length === 0 ? (this.strict_status = lt.STATUS_STRICT, delete this.kinks) : (this.strict_status = lt.STATUS_ERROR, this.kinks = {
      forw: Mt(r[0]),
      bakw: Mt(r[1])
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
      const r = this.points[o][0], s = this.points[o][1], a = ie(r, s, o);
      t.forw.push(a), t.bakw.push(re(a));
    }
    const n = [];
    let i = 0;
    this.edgeNodes = [], this.edges || (this.edges = []);
    for (let o = 0; o < this.edges.length; o++) {
      const r = this.edges[o][2], s = Object.assign([], this.edges[o][0]), a = Object.assign([], this.edges[o][1]);
      if (bo(r, this.points.length, o), s.length === 0 && a.length === 0) {
        n.push(r);
        continue;
      }
      s.unshift(this.points[r[0]][0]), s.push(this.points[r[1]][0]), a.unshift(this.points[r[0]][1]), a.push(this.points[r[1]][1]);
      const f = [s, a].map((l) => {
        const h = l.map((u, d, y) => {
          if (d === 0) return 0;
          const g = y[d - 1];
          return Math.sqrt(
            Math.pow(u[0] - g[0], 2) + Math.pow(u[1] - g[1], 2)
          );
        }), c = h.reduce((u, d, y) => y === 0 ? [0] : (u.push(u[y - 1] + d), u), []);
        return c.map((u, d, y) => {
          const g = u / y[y.length - 1];
          return [l[d], h[d], c[d], g];
        });
      });
      f.map((l, h) => {
        const c = f[h ? 0 : 1];
        return l.filter((u, d) => !(d === 0 || d === l.length - 1 || u[4] === "handled")).flatMap((u) => {
          const d = u[0], y = u[3], g = c.reduce(
            (S, v, m, x) => {
              if (S) return S;
              const p = x[m + 1];
              if (v[3] === y)
                return v[4] = "handled", [v];
              if (v[3] < y && p && p[3] > y)
                return [v, p];
            },
            void 0
          );
          if (g && g.length === 1)
            return h === 0 ? [[d, g[0][0], y]] : [[g[0][0], d, y]];
          if (g && g.length === 2) {
            const S = g[0], v = g[1], m = (y - S[3]) / (v[3] - S[3]), x = [
              (v[0][0] - S[0][0]) * m + S[0][0],
              (v[0][1] - S[0][1]) * m + S[0][1]
            ];
            return h === 0 ? [[d, x, y]] : [[x, d, y]];
          }
          return [];
        });
      }).reduce((l, h) => l.concat(h), []).sort((l, h) => l[2] < h[2] ? -1 : 1).map((l, h, c) => {
        this.edgeNodes[i] = [
          l[0],
          l[1]
        ];
        const u = ie(
          l[0],
          l[1],
          `e${i}`
        );
        i++, t.forw.push(u), t.bakw.push(re(u)), h === 0 ? n.push([r[0], t.forw.length - 1]) : n.push([
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
    if (!this.points.reduce((f, l) => f && (r ? Fe(l[0], r) : l[0][0] >= t && l[0][0] <= n && l[0][1] >= i && l[0][1] <= o), !0))
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
  /** 余白を加える前の GCP の外接矩形を求める。 */
  computeGcpBbox() {
    let t = 1 / 0, n = -1 / 0, i = 1 / 0, o = -1 / 0;
    for (const r of this.points) {
      const s = r[0][0], a = r[0][1];
      s < t && (t = s), s > n && (n = s), a < i && (i = a), a > o && (o = a);
    }
    return { minx: t, maxx: n, miny: i, maxy: o };
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
    const n = !this.useV2Algorithm;
    let i, o, r, s, a;
    if (n) {
      if (this.bounds) {
        const B = this.boundsPolygon;
        if (!B) throw new Error("Internal error: bounds is set but boundsPolygon is missing");
        if (!this.points.every(
          (C) => Fe(C[0], B)
        )) throw "SOME POINTS OUTSIDE";
      }
      i = this.generatePointsSet(), { minx: o, maxx: r, miny: s, maxy: a } = this.computeGcpBbox();
    } else {
      const B = this.validateAndPrepareInputs();
      i = B.pointsSet, o = B.minx, r = B.maxx, s = B.miny, a = B.maxy;
    }
    const f = {
      forw: Mt(i.forw),
      bakw: Mt(i.bakw)
    }, l = _e(
      f.forw,
      i.edges,
      "target"
    ), h = _e(
      f.bakw,
      i.edges,
      "target"
    );
    if (l.features.length === 0 || h.features.length === 0)
      throw "TOO LINEAR1";
    const c = $i(f.forw), u = gn(f.forw);
    if (!u) throw "TOO LINEAR2";
    const d = {}, y = u.geometry.coordinates[0];
    let g;
    try {
      g = y.map((B) => ({
        forw: B,
        bakw: ne(Lt(B), l)
      })), g.forEach((B) => {
        d[`${B.forw[0]}:${B.forw[1]}`] = B;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const S = gn(f.bakw);
    if (!S) throw "TOO LINEAR2";
    const v = S.geometry.coordinates[0];
    try {
      g = v.map((B) => ({
        bakw: B,
        forw: ne(Lt(B), h)
      })), g.forEach((B) => {
        d[`${B.forw[0]}:${B.forw[1]}`] = B;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    let m;
    if (n) {
      const B = c.geometry.coordinates, P = l.features.find(
        (C) => Fe(
          Lt(B),
          C
        )
      );
      if (P) {
        const C = P.geometry.coordinates[0], $ = P.properties.a.geom, b = P.properties.b.geom, I = P.properties.c.geom;
        m = {
          forw: [
            (C[0][0] + C[1][0] + C[2][0]) / 3,
            (C[0][1] + C[1][1] + C[2][1]) / 3
          ],
          bakw: [
            ($[0] + b[0] + I[0]) / 3,
            ($[1] + b[1] + I[1]) / 3
          ]
        };
      } else
        m = {
          forw: B,
          bakw: ne(c, l)
        };
    } else
      m = {
        forw: c.geometry.coordinates,
        bakw: ne(c, l)
      };
    const x = ie(m.forw, m.bakw, "c");
    this.centroid = {
      forw: x,
      bakw: re(x)
    };
    const p = [
      ...this.points.map((B) => ({ forw: B[0], bakw: B[1] })),
      ...(this.edgeNodes ?? []).map((B) => ({ forw: B[0], bakw: B[1] }))
    ], _ = {
      convexBuf: d,
      centroid: m,
      allGcps: p,
      minx: o,
      maxx: r,
      miny: s,
      maxy: a
    }, w = this.vertexMode === lt.VERTEX_BIRDEYE ? Lr : Rr, k = n ? Nr(_, w, i, this.points.length) : void 0, O = k?.vertices ?? w(_, !1), A = {
      forw: [],
      bakw: []
    };
    for (let B = 0; B < O.length; B++) {
      const P = O[B].forw, C = O[B].bakw, $ = ie(P, C, `b${B}`), b = re($);
      i.forw.push($), i.bakw.push(b), A.forw.push($), A.bakw.push(b);
    }
    this.pointsSet = {
      forw: Mt(i.forw),
      bakw: Mt(i.bakw),
      edges: i.edges
    }, this.tins = {
      forw: Mn(
        k?.forw ?? _e(this.pointsSet.forw, i.edges, "target")
      )
    }, (t === lt.MODE_STRICT || t === lt.MODE_AUTO) && this.calculateStrictTin(
      t === lt.MODE_AUTO ? 1 : Xn
    ), (t === lt.MODE_LOOSE || t === lt.MODE_AUTO && this.strict_status === lt.STATUS_ERROR) && (this.tins.bakw = Mn(
      k?.bakw ?? _e(this.pointsSet.bakw, i.edges, "target")
    ), delete this.kinks, this.strict_status = lt.STATUS_LOOSE), this.vertices_params = {
      forw: Bn(A.forw, this.centroid.forw),
      bakw: Bn(A.bakw, this.centroid.bakw)
    }, this.addIndexedTin(), this.pointsWeightBuffer = {}, this.lastBoundaryDiagnostics = k?.diagnostics;
  }
  /**
   * 非同期ラッパーを提供します。
   * 互換性のために Promise ベースの API を維持しますが、内部処理は同期的です。
   */
  async updateTinAsync() {
    this.updateTin();
  }
}
function bo(e, t, n) {
  const i = (o) => Number.isInteger(o) && o >= 0 && o < t;
  if (!Array.isArray(e) || !i(e[0]) || !i(e[1]))
    throw new Error(
      `Invalid edge at edges[${n}]: start/end ${JSON.stringify(e)} must be integer indices of points (0 to ${t - 1})`
    );
}
export {
  lt as Tin,
  _e as constrainedTin,
  re as counterPoint,
  ie as createPoint,
  lt as default,
  xo as findIntersections,
  qn as format_version,
  ii as insertSearchIndex,
  Bn as vertexCalc
};
