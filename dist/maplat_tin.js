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
    for (var i, o, r, s, a, l, f, h = 0, c = 0, u, p = e.type, y = p === "FeatureCollection", m = p === "Feature", S = y ? e.features.length : 1, b = 0; b < S; b++) {
      f = y ? (
        // @ts-expect-error: Known type conflict
        e.features[b].geometry
      ) : m ? (
        // @ts-expect-error: Known type conflict
        e.geometry
      ) : e, u = f ? f.type === "GeometryCollection" : !1, a = u ? f.geometries.length : 1;
      for (var g = 0; g < a; g++) {
        var x = 0, d = 0;
        if (s = u ? f.geometries[g] : f, s !== null) {
          l = s.coordinates;
          var _ = s.type;
          switch (h = n && (_ === "Polygon" || _ === "MultiPolygon") ? 1 : 0, _) {
            case null:
              break;
            case "Point":
              if (
                // @ts-expect-error: Known type conflict
                t(
                  l,
                  c,
                  b,
                  x,
                  d
                ) === !1
              )
                return !1;
              c++, x++;
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
                    x,
                    d
                  ) === !1
                )
                  return !1;
                c++, _ === "MultiPoint" && x++;
              }
              _ === "LineString" && x++;
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
                      b,
                      x,
                      d
                    ) === !1
                  )
                    return !1;
                  c++;
                }
                _ === "MultiLineString" && x++, _ === "Polygon" && d++;
              }
              _ === "Polygon" && x++;
              break;
            case "MultiPolygon":
              for (i = 0; i < l.length; i++) {
                for (d = 0, o = 0; o < l[i].length; o++) {
                  for (r = 0; r < l[i][o].length - h; r++) {
                    if (
                      // @ts-expect-error: Known type conflict
                      t(
                        l[i][o][r],
                        c,
                        b,
                        x,
                        d
                      ) === !1
                    )
                      return !1;
                    c++;
                  }
                  d++;
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
  let r, s, a, l, f = t[0], h = i[0], c = 0, u = 0;
  h > f == h > -f ? (r = f, f = t[++c]) : (r = h, h = i[++u]);
  let p = 0;
  if (c < e && u < n)
    for (h > f == h > -f ? (s = f + r, a = r - (s - f), f = t[++c]) : (s = h + r, a = r - (s - h), h = i[++u]), r = s, a !== 0 && (o[p++] = a); c < e && u < n; )
      h > f == h > -f ? (s = r + f, l = s - r, a = r - (s - l) + (f - l), f = t[++c]) : (s = r + h, l = s - r, a = r - (s - l) + (h - l), h = i[++u]), r = s, a !== 0 && (o[p++] = a);
  for (; c < e; )
    s = r + f, l = s - r, a = r - (s - l) + (f - l), f = t[++c], r = s, a !== 0 && (o[p++] = a);
  for (; u < n; )
    s = r + h, l = s - r, a = r - (s - l) + (h - l), h = i[++u], r = s, a !== 0 && (o[p++] = a);
  return (r !== 0 || p === 0) && (o[p++] = r), p;
}
function St(e, t, n, i, o, r, s, a) {
  return ht(ht(e, t, n, i, s), s, o, r, a);
}
function Y(e, t, n, i) {
  let o, r, s, a, l, f, h, c, u, p, y;
  h = U * n, p = h - (h - n), y = n - p;
  let m = t[0];
  o = m * n, h = U * m, c = h - (h - m), u = m - c, s = u * y - (o - c * p - u * p - c * y);
  let S = 0;
  s !== 0 && (i[S++] = s);
  for (let b = 1; b < e; b++)
    m = t[b], a = m * n, h = U * m, c = h - (h - m), u = m - c, l = u * y - (a - c * p - u * p - c * y), r = o + l, f = r - o, s = o - (r - f) + (l - f), s !== 0 && (i[S++] = s), o = a + r, s = r - (o - a), s !== 0 && (i[S++] = s);
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
const fi = (3 + 16 * pt) * pt, hi = (2 + 12 * pt) * pt, ui = (9 + 64 * pt) * pt * pt, zt = tt(4), tn = tt(8), en = tt(12), nn = tt(16), gt = tt(4);
function di(e, t, n, i, o, r, s) {
  let a, l, f, h, c, u, p, y, m, S, b, g, x, d, _, w, k, O;
  const A = e - o, B = n - o, P = t - r, C = i - r;
  d = A * C, u = U * A, p = u - (u - A), y = A - p, u = U * C, m = u - (u - C), S = C - m, _ = y * S - (d - p * m - y * m - p * S), w = P * B, u = U * P, p = u - (u - P), y = P - p, u = U * B, m = u - (u - B), S = B - m, k = y * S - (w - p * m - y * m - p * S), b = _ - k, c = _ - b, zt[0] = _ - (b + c) + (c - k), g = d + b, c = g - d, x = d - (g - c) + (b - c), b = x - w, c = x - b, zt[1] = x - (b + c) + (c - w), O = g + b, c = O - g, zt[2] = g - (O - c) + (b - c), zt[3] = O;
  let $ = zn(4, zt), v = hi * s;
  if ($ >= v || -$ >= v || (c = e - A, a = e - (A + c) + (c - o), c = n - B, f = n - (B + c) + (c - o), c = t - P, l = t - (P + c) + (c - r), c = i - C, h = i - (C + c) + (c - r), a === 0 && l === 0 && f === 0 && h === 0) || (v = ui * s + Un * Math.abs($), $ += A * h + C * a - (P * f + B * l), $ >= v || -$ >= v)) return $;
  d = a * C, u = U * a, p = u - (u - a), y = a - p, u = U * C, m = u - (u - C), S = C - m, _ = y * S - (d - p * m - y * m - p * S), w = l * B, u = U * l, p = u - (u - l), y = l - p, u = U * B, m = u - (u - B), S = B - m, k = y * S - (w - p * m - y * m - p * S), b = _ - k, c = _ - b, gt[0] = _ - (b + c) + (c - k), g = d + b, c = g - d, x = d - (g - c) + (b - c), b = x - w, c = x - b, gt[1] = x - (b + c) + (c - w), O = g + b, c = O - g, gt[2] = g - (O - c) + (b - c), gt[3] = O;
  const I = ht(4, zt, 4, gt, tn);
  d = A * h, u = U * A, p = u - (u - A), y = A - p, u = U * h, m = u - (u - h), S = h - m, _ = y * S - (d - p * m - y * m - p * S), w = P * f, u = U * P, p = u - (u - P), y = P - p, u = U * f, m = u - (u - f), S = f - m, k = y * S - (w - p * m - y * m - p * S), b = _ - k, c = _ - b, gt[0] = _ - (b + c) + (c - k), g = d + b, c = g - d, x = d - (g - c) + (b - c), b = x - w, c = x - b, gt[1] = x - (b + c) + (c - w), O = g + b, c = O - g, gt[2] = g - (O - c) + (b - c), gt[3] = O;
  const E = ht(I, tn, 4, gt, en);
  d = a * h, u = U * a, p = u - (u - a), y = a - p, u = U * h, m = u - (u - h), S = h - m, _ = y * S - (d - p * m - y * m - p * S), w = l * f, u = U * l, p = u - (u - l), y = l - p, u = U * f, m = u - (u - f), S = f - m, k = y * S - (w - p * m - y * m - p * S), b = _ - k, c = _ - b, gt[0] = _ - (b + c) + (c - k), g = d + b, c = g - d, x = d - (g - c) + (b - c), b = x - w, c = x - b, gt[1] = x - (b + c) + (c - w), O = g + b, c = O - g, gt[2] = g - (O - c) + (b - c), gt[3] = O;
  const N = ht(E, en, 4, gt, nn);
  return nn[N - 1];
}
function kt(e, t, n, i, o, r) {
  const s = (t - r) * (n - o), a = (e - o) * (i - r), l = s - a, f = Math.abs(s + a);
  return Math.abs(l) >= fi * f ? l : -di(e, t, n, i, o, r, f);
}
const pi = (10 + 96 * pt) * pt, gi = (4 + 48 * pt) * pt, mi = (44 + 576 * pt) * pt * pt, Ft = tt(4), Xt = tt(4), $t = tt(4), At = tt(4), It = tt(4), Bt = tt(4), mt = tt(4), wt = tt(4), Oe = tt(8), Pe = tt(8), Ne = tt(8), Te = tt(8), Ce = tt(8), De = tt(8), pe = tt(8), ge = tt(8), me = tt(8), Vt = tt(4), qt = tt(4), jt = tt(4), z = tt(8), K = tt(16), nt = tt(16), it = tt(16), et = tt(32), Rt = tt(32), at = tt(48), bt = tt(64);
let Qt = tt(1152), Fe = tt(1152);
function ct(e, t, n) {
  e = ht(e, Qt, t, n, Fe);
  const i = Qt;
  return Qt = Fe, Fe = i, e;
}
function wi(e, t, n, i, o, r, s, a, l) {
  let f, h, c, u, p, y, m, S, b, g, x, d, _, w, k, O, A, B, P, C, $, v, I, E, N, D, X, M, T, F, R, L, V, j, q;
  const J = e - s, G = n - s, Q = o - s, H = t - a, Z = i - a, W = r - a;
  R = G * W, I = U * G, E = I - (I - G), N = G - E, I = U * W, D = I - (I - W), X = W - D, L = N * X - (R - E * D - N * D - E * X), V = Q * Z, I = U * Q, E = I - (I - Q), N = Q - E, I = U * Z, D = I - (I - Z), X = Z - D, j = N * X - (V - E * D - N * D - E * X), M = L - j, v = L - M, Ft[0] = L - (M + v) + (v - j), T = R + M, v = T - R, F = R - (T - v) + (M - v), M = F - V, v = F - M, Ft[1] = F - (M + v) + (v - V), q = T + M, v = q - T, Ft[2] = T - (q - v) + (M - v), Ft[3] = q, R = Q * H, I = U * Q, E = I - (I - Q), N = Q - E, I = U * H, D = I - (I - H), X = H - D, L = N * X - (R - E * D - N * D - E * X), V = J * W, I = U * J, E = I - (I - J), N = J - E, I = U * W, D = I - (I - W), X = W - D, j = N * X - (V - E * D - N * D - E * X), M = L - j, v = L - M, Xt[0] = L - (M + v) + (v - j), T = R + M, v = T - R, F = R - (T - v) + (M - v), M = F - V, v = F - M, Xt[1] = F - (M + v) + (v - V), q = T + M, v = q - T, Xt[2] = T - (q - v) + (M - v), Xt[3] = q, R = J * Z, I = U * J, E = I - (I - J), N = J - E, I = U * Z, D = I - (I - Z), X = Z - D, L = N * X - (R - E * D - N * D - E * X), V = G * H, I = U * G, E = I - (I - G), N = G - E, I = U * H, D = I - (I - H), X = H - D, j = N * X - (V - E * D - N * D - E * X), M = L - j, v = L - M, $t[0] = L - (M + v) + (v - j), T = R + M, v = T - R, F = R - (T - v) + (M - v), M = F - V, v = F - M, $t[1] = F - (M + v) + (v - V), q = T + M, v = q - T, $t[2] = T - (q - v) + (M - v), $t[3] = q, f = ht(
    ht(
      ht(
        Y(Y(4, Ft, J, z), z, J, K),
        K,
        Y(Y(4, Ft, H, z), z, H, nt),
        nt,
        et
      ),
      et,
      ht(
        Y(Y(4, Xt, G, z), z, G, K),
        K,
        Y(Y(4, Xt, Z, z), z, Z, nt),
        nt,
        Rt
      ),
      Rt,
      bt
    ),
    bt,
    ht(
      Y(Y(4, $t, Q, z), z, Q, K),
      K,
      Y(Y(4, $t, W, z), z, W, nt),
      nt,
      et
    ),
    et,
    Qt
  );
  let st = zn(f, Qt), ft = gi * l;
  if (st >= ft || -st >= ft || (v = e - J, h = e - (J + v) + (v - s), v = t - H, p = t - (H + v) + (v - a), v = n - G, c = n - (G + v) + (v - s), v = i - Z, y = i - (Z + v) + (v - a), v = o - Q, u = o - (Q + v) + (v - s), v = r - W, m = r - (W + v) + (v - a), h === 0 && c === 0 && u === 0 && p === 0 && y === 0 && m === 0) || (ft = mi * l + Un * Math.abs(st), st += (J * J + H * H) * (G * m + W * c - (Z * u + Q * y)) + 2 * (J * h + H * p) * (G * W - Z * Q) + ((G * G + Z * Z) * (Q * p + H * u - (W * h + J * m)) + 2 * (G * c + Z * y) * (Q * H - W * J)) + ((Q * Q + W * W) * (J * y + Z * h - (H * c + G * p)) + 2 * (Q * u + W * m) * (J * Z - H * G)), st >= ft || -st >= ft))
    return st;
  if ((c !== 0 || y !== 0 || u !== 0 || m !== 0) && (R = J * J, I = U * J, E = I - (I - J), N = J - E, L = N * N - (R - E * E - (E + E) * N), V = H * H, I = U * H, E = I - (I - H), N = H - E, j = N * N - (V - E * E - (E + E) * N), M = L + j, v = M - L, At[0] = L - (M - v) + (j - v), T = R + M, v = T - R, F = R - (T - v) + (M - v), M = F + V, v = M - F, At[1] = F - (M - v) + (V - v), q = T + M, v = q - T, At[2] = T - (q - v) + (M - v), At[3] = q), (u !== 0 || m !== 0 || h !== 0 || p !== 0) && (R = G * G, I = U * G, E = I - (I - G), N = G - E, L = N * N - (R - E * E - (E + E) * N), V = Z * Z, I = U * Z, E = I - (I - Z), N = Z - E, j = N * N - (V - E * E - (E + E) * N), M = L + j, v = M - L, It[0] = L - (M - v) + (j - v), T = R + M, v = T - R, F = R - (T - v) + (M - v), M = F + V, v = M - F, It[1] = F - (M - v) + (V - v), q = T + M, v = q - T, It[2] = T - (q - v) + (M - v), It[3] = q), (h !== 0 || p !== 0 || c !== 0 || y !== 0) && (R = Q * Q, I = U * Q, E = I - (I - Q), N = Q - E, L = N * N - (R - E * E - (E + E) * N), V = W * W, I = U * W, E = I - (I - W), N = W - E, j = N * N - (V - E * E - (E + E) * N), M = L + j, v = M - L, Bt[0] = L - (M - v) + (j - v), T = R + M, v = T - R, F = R - (T - v) + (M - v), M = F + V, v = M - F, Bt[1] = F - (M - v) + (V - v), q = T + M, v = q - T, Bt[2] = T - (q - v) + (M - v), Bt[3] = q), h !== 0 && (S = Y(4, Ft, h, Oe), f = ct(f, St(
    Y(S, Oe, 2 * J, K),
    K,
    Y(Y(4, Bt, h, z), z, Z, nt),
    nt,
    Y(Y(4, It, h, z), z, -W, it),
    it,
    et,
    at
  ), at)), p !== 0 && (b = Y(4, Ft, p, Pe), f = ct(f, St(
    Y(b, Pe, 2 * H, K),
    K,
    Y(Y(4, It, p, z), z, Q, nt),
    nt,
    Y(Y(4, Bt, p, z), z, -G, it),
    it,
    et,
    at
  ), at)), c !== 0 && (g = Y(4, Xt, c, Ne), f = ct(f, St(
    Y(g, Ne, 2 * G, K),
    K,
    Y(Y(4, At, c, z), z, W, nt),
    nt,
    Y(Y(4, Bt, c, z), z, -H, it),
    it,
    et,
    at
  ), at)), y !== 0 && (x = Y(4, Xt, y, Te), f = ct(f, St(
    Y(x, Te, 2 * Z, K),
    K,
    Y(Y(4, Bt, y, z), z, J, nt),
    nt,
    Y(Y(4, At, y, z), z, -Q, it),
    it,
    et,
    at
  ), at)), u !== 0 && (d = Y(4, $t, u, Ce), f = ct(f, St(
    Y(d, Ce, 2 * Q, K),
    K,
    Y(Y(4, It, u, z), z, H, nt),
    nt,
    Y(Y(4, At, u, z), z, -Z, it),
    it,
    et,
    at
  ), at)), m !== 0 && (_ = Y(4, $t, m, De), f = ct(f, St(
    Y(_, De, 2 * W, K),
    K,
    Y(Y(4, At, m, z), z, G, nt),
    nt,
    Y(Y(4, It, m, z), z, -J, it),
    it,
    et,
    at
  ), at)), h !== 0 || p !== 0) {
    if (c !== 0 || y !== 0 || u !== 0 || m !== 0 ? (R = c * W, I = U * c, E = I - (I - c), N = c - E, I = U * W, D = I - (I - W), X = W - D, L = N * X - (R - E * D - N * D - E * X), V = G * m, I = U * G, E = I - (I - G), N = G - E, I = U * m, D = I - (I - m), X = m - D, j = N * X - (V - E * D - N * D - E * X), M = L + j, v = M - L, mt[0] = L - (M - v) + (j - v), T = R + M, v = T - R, F = R - (T - v) + (M - v), M = F + V, v = M - F, mt[1] = F - (M - v) + (V - v), q = T + M, v = q - T, mt[2] = T - (q - v) + (M - v), mt[3] = q, R = u * -Z, I = U * u, E = I - (I - u), N = u - E, I = U * -Z, D = I - (I - -Z), X = -Z - D, L = N * X - (R - E * D - N * D - E * X), V = Q * -y, I = U * Q, E = I - (I - Q), N = Q - E, I = U * -y, D = I - (I - -y), X = -y - D, j = N * X - (V - E * D - N * D - E * X), M = L + j, v = M - L, wt[0] = L - (M - v) + (j - v), T = R + M, v = T - R, F = R - (T - v) + (M - v), M = F + V, v = M - F, wt[1] = F - (M - v) + (V - v), q = T + M, v = q - T, wt[2] = T - (q - v) + (M - v), wt[3] = q, k = ht(4, mt, 4, wt, ge), R = c * m, I = U * c, E = I - (I - c), N = c - E, I = U * m, D = I - (I - m), X = m - D, L = N * X - (R - E * D - N * D - E * X), V = u * y, I = U * u, E = I - (I - u), N = u - E, I = U * y, D = I - (I - y), X = y - D, j = N * X - (V - E * D - N * D - E * X), M = L - j, v = L - M, qt[0] = L - (M + v) + (v - j), T = R + M, v = T - R, F = R - (T - v) + (M - v), M = F - V, v = F - M, qt[1] = F - (M + v) + (v - V), q = T + M, v = q - T, qt[2] = T - (q - v) + (M - v), qt[3] = q, B = 4) : (ge[0] = 0, k = 1, qt[0] = 0, B = 1), h !== 0) {
      const rt = Y(k, ge, h, it);
      f = ct(f, ht(
        Y(S, Oe, h, K),
        K,
        Y(rt, it, 2 * J, et),
        et,
        at
      ), at);
      const ot = Y(B, qt, h, z);
      f = ct(f, St(
        Y(ot, z, 2 * J, K),
        K,
        Y(ot, z, h, nt),
        nt,
        Y(rt, it, h, et),
        et,
        Rt,
        bt
      ), bt), y !== 0 && (f = ct(f, Y(Y(4, Bt, h, z), z, y, K), K)), m !== 0 && (f = ct(f, Y(Y(4, It, -h, z), z, m, K), K));
    }
    if (p !== 0) {
      const rt = Y(k, ge, p, it);
      f = ct(f, ht(
        Y(b, Pe, p, K),
        K,
        Y(rt, it, 2 * H, et),
        et,
        at
      ), at);
      const ot = Y(B, qt, p, z);
      f = ct(f, St(
        Y(ot, z, 2 * H, K),
        K,
        Y(ot, z, p, nt),
        nt,
        Y(rt, it, p, et),
        et,
        Rt,
        bt
      ), bt);
    }
  }
  if (c !== 0 || y !== 0) {
    if (u !== 0 || m !== 0 || h !== 0 || p !== 0 ? (R = u * H, I = U * u, E = I - (I - u), N = u - E, I = U * H, D = I - (I - H), X = H - D, L = N * X - (R - E * D - N * D - E * X), V = Q * p, I = U * Q, E = I - (I - Q), N = Q - E, I = U * p, D = I - (I - p), X = p - D, j = N * X - (V - E * D - N * D - E * X), M = L + j, v = M - L, mt[0] = L - (M - v) + (j - v), T = R + M, v = T - R, F = R - (T - v) + (M - v), M = F + V, v = M - F, mt[1] = F - (M - v) + (V - v), q = T + M, v = q - T, mt[2] = T - (q - v) + (M - v), mt[3] = q, C = -W, $ = -m, R = h * C, I = U * h, E = I - (I - h), N = h - E, I = U * C, D = I - (I - C), X = C - D, L = N * X - (R - E * D - N * D - E * X), V = J * $, I = U * J, E = I - (I - J), N = J - E, I = U * $, D = I - (I - $), X = $ - D, j = N * X - (V - E * D - N * D - E * X), M = L + j, v = M - L, wt[0] = L - (M - v) + (j - v), T = R + M, v = T - R, F = R - (T - v) + (M - v), M = F + V, v = M - F, wt[1] = F - (M - v) + (V - v), q = T + M, v = q - T, wt[2] = T - (q - v) + (M - v), wt[3] = q, O = ht(4, mt, 4, wt, me), R = u * p, I = U * u, E = I - (I - u), N = u - E, I = U * p, D = I - (I - p), X = p - D, L = N * X - (R - E * D - N * D - E * X), V = h * m, I = U * h, E = I - (I - h), N = h - E, I = U * m, D = I - (I - m), X = m - D, j = N * X - (V - E * D - N * D - E * X), M = L - j, v = L - M, jt[0] = L - (M + v) + (v - j), T = R + M, v = T - R, F = R - (T - v) + (M - v), M = F - V, v = F - M, jt[1] = F - (M + v) + (v - V), q = T + M, v = q - T, jt[2] = T - (q - v) + (M - v), jt[3] = q, P = 4) : (me[0] = 0, O = 1, jt[0] = 0, P = 1), c !== 0) {
      const rt = Y(O, me, c, it);
      f = ct(f, ht(
        Y(g, Ne, c, K),
        K,
        Y(rt, it, 2 * G, et),
        et,
        at
      ), at);
      const ot = Y(P, jt, c, z);
      f = ct(f, St(
        Y(ot, z, 2 * G, K),
        K,
        Y(ot, z, c, nt),
        nt,
        Y(rt, it, c, et),
        et,
        Rt,
        bt
      ), bt), m !== 0 && (f = ct(f, Y(Y(4, At, c, z), z, m, K), K)), p !== 0 && (f = ct(f, Y(Y(4, Bt, -c, z), z, p, K), K));
    }
    if (y !== 0) {
      const rt = Y(O, me, y, it);
      f = ct(f, ht(
        Y(x, Te, y, K),
        K,
        Y(rt, it, 2 * Z, et),
        et,
        at
      ), at);
      const ot = Y(P, jt, y, z);
      f = ct(f, St(
        Y(ot, z, 2 * Z, K),
        K,
        Y(ot, z, y, nt),
        nt,
        Y(rt, it, y, et),
        et,
        Rt,
        bt
      ), bt);
    }
  }
  if (u !== 0 || m !== 0) {
    if (h !== 0 || p !== 0 || c !== 0 || y !== 0 ? (R = h * Z, I = U * h, E = I - (I - h), N = h - E, I = U * Z, D = I - (I - Z), X = Z - D, L = N * X - (R - E * D - N * D - E * X), V = J * y, I = U * J, E = I - (I - J), N = J - E, I = U * y, D = I - (I - y), X = y - D, j = N * X - (V - E * D - N * D - E * X), M = L + j, v = M - L, mt[0] = L - (M - v) + (j - v), T = R + M, v = T - R, F = R - (T - v) + (M - v), M = F + V, v = M - F, mt[1] = F - (M - v) + (V - v), q = T + M, v = q - T, mt[2] = T - (q - v) + (M - v), mt[3] = q, C = -H, $ = -p, R = c * C, I = U * c, E = I - (I - c), N = c - E, I = U * C, D = I - (I - C), X = C - D, L = N * X - (R - E * D - N * D - E * X), V = G * $, I = U * G, E = I - (I - G), N = G - E, I = U * $, D = I - (I - $), X = $ - D, j = N * X - (V - E * D - N * D - E * X), M = L + j, v = M - L, wt[0] = L - (M - v) + (j - v), T = R + M, v = T - R, F = R - (T - v) + (M - v), M = F + V, v = M - F, wt[1] = F - (M - v) + (V - v), q = T + M, v = q - T, wt[2] = T - (q - v) + (M - v), wt[3] = q, w = ht(4, mt, 4, wt, pe), R = h * y, I = U * h, E = I - (I - h), N = h - E, I = U * y, D = I - (I - y), X = y - D, L = N * X - (R - E * D - N * D - E * X), V = c * p, I = U * c, E = I - (I - c), N = c - E, I = U * p, D = I - (I - p), X = p - D, j = N * X - (V - E * D - N * D - E * X), M = L - j, v = L - M, Vt[0] = L - (M + v) + (v - j), T = R + M, v = T - R, F = R - (T - v) + (M - v), M = F - V, v = F - M, Vt[1] = F - (M + v) + (v - V), q = T + M, v = q - T, Vt[2] = T - (q - v) + (M - v), Vt[3] = q, A = 4) : (pe[0] = 0, w = 1, Vt[0] = 0, A = 1), u !== 0) {
      const rt = Y(w, pe, u, it);
      f = ct(f, ht(
        Y(d, Ce, u, K),
        K,
        Y(rt, it, 2 * Q, et),
        et,
        at
      ), at);
      const ot = Y(A, Vt, u, z);
      f = ct(f, St(
        Y(ot, z, 2 * Q, K),
        K,
        Y(ot, z, u, nt),
        nt,
        Y(rt, it, u, et),
        et,
        Rt,
        bt
      ), bt), p !== 0 && (f = ct(f, Y(Y(4, It, u, z), z, p, K), K)), y !== 0 && (f = ct(f, Y(Y(4, At, -u, z), z, y, K), K));
    }
    if (m !== 0) {
      const rt = Y(w, pe, m, it);
      f = ct(f, ht(
        Y(_, De, m, K),
        K,
        Y(rt, it, 2 * W, et),
        et,
        at
      ), at);
      const ot = Y(A, Vt, m, z);
      f = ct(f, St(
        Y(ot, z, 2 * W, K),
        K,
        Y(ot, z, m, nt),
        nt,
        Y(rt, it, m, et),
        et,
        Rt,
        bt
      ), bt);
    }
  }
  return Qt[f - 1];
}
function yi(e, t, n, i, o, r, s, a) {
  const l = e - s, f = n - s, h = o - s, c = t - a, u = i - a, p = r - a, y = f * p, m = h * u, S = l * l + c * c, b = h * c, g = l * p, x = f * f + u * u, d = l * u, _ = f * c, w = h * h + p * p, k = S * (y - m) + x * (b - g) + w * (d - _), O = (Math.abs(y) + Math.abs(m)) * S + (Math.abs(b) + Math.abs(g)) * x + (Math.abs(d) + Math.abs(_)) * w, A = pi * O;
  return k > A || -k > A ? k : wi(e, t, n, i, o, r, s, a, O);
}
function vi(e, t) {
  var n, i, o = 0, r, s, a, l, f, h, c, u = e[0], p = e[1], y = t.length;
  for (n = 0; n < y; n++) {
    i = 0;
    var m = t[n], S = m.length - 1;
    if (h = m[0], h[0] !== m[S][0] && h[1] !== m[S][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (s = h[0] - u, a = h[1] - p, i; i < S; i++) {
      if (c = m[i + 1], l = c[0] - u, f = c[1] - p, a === 0 && f === 0) {
        if (l <= 0 && s >= 0 || s <= 0 && l >= 0)
          return 0;
      } else if (f >= 0 && a <= 0 || f <= 0 && a >= 0) {
        if (r = kt(s, l, a, f, 0, 0), r === 0)
          return 0;
        (r > 0 && f > 0 && a <= 0 || r < 0 && f <= 0 && a > 0) && o++;
      }
      h = c, a = f, s = l;
    }
  }
  return o % 2 !== 0;
}
function Xe(e, t, n = {}) {
  if (!e)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const i = ci(e), o = li(t), r = o.type, s = t.bbox;
  let a = o.coordinates;
  if (s && bi(i, s) === !1)
    return !1;
  r === "Polygon" && (a = [a]);
  for (var l = 0; l < a.length; ++l) {
    const f = vi(i, a[l]);
    if (f === 0 && !n.ignoreBoundary) return !0;
    if (f) return !0;
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
      const l = s + 1;
      if (l < this.length && i(n[l], a) < 0 && (s = l, a = n[l]), i(a, r) >= 0) break;
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
  let r, s, a, l, f = t[0], h = i[0], c = 0, u = 0;
  h > f == h > -f ? (r = f, f = t[++c]) : (r = h, h = i[++u]);
  let p = 0;
  if (c < e && u < n)
    for (h > f == h > -f ? (s = f + r, a = r - (s - f), f = t[++c]) : (s = h + r, a = r - (s - h), h = i[++u]), r = s, a !== 0 && (o[p++] = a); c < e && u < n; )
      h > f == h > -f ? (s = r + f, l = s - r, a = r - (s - l) + (f - l), f = t[++c]) : (s = r + h, l = s - r, a = r - (s - l) + (h - l), h = i[++u]), r = s, a !== 0 && (o[p++] = a);
  for (; c < e; )
    s = r + f, l = s - r, a = r - (s - l) + (f - l), f = t[++c], r = s, a !== 0 && (o[p++] = a);
  for (; u < n; )
    s = r + h, l = s - r, a = r - (s - l) + (h - l), h = i[++u], r = s, a !== 0 && (o[p++] = a);
  return (r !== 0 || p === 0) && (o[p++] = r), p;
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
  let a, l, f, h, c, u, p, y, m, S, b, g, x, d, _, w, k, O;
  const A = e - o, B = n - o, P = t - r, C = i - r;
  d = A * C, u = ut * A, p = u - (u - A), y = A - p, u = ut * C, m = u - (u - C), S = C - m, _ = y * S - (d - p * m - y * m - p * S), w = P * B, u = ut * P, p = u - (u - P), y = P - p, u = ut * B, m = u - (u - B), S = B - m, k = y * S - (w - p * m - y * m - p * S), b = _ - k, c = _ - b, Gt[0] = _ - (b + c) + (c - k), g = d + b, c = g - d, x = d - (g - c) + (b - c), b = x - w, c = x - b, Gt[1] = x - (b + c) + (c - w), O = g + b, c = O - g, Gt[2] = g - (O - c) + (b - c), Gt[3] = O;
  let $ = Si(4, Gt), v = Ei * s;
  if ($ >= v || -$ >= v || (c = e - A, a = e - (A + c) + (c - o), c = n - B, f = n - (B + c) + (c - o), c = t - P, l = t - (P + c) + (c - r), c = i - C, h = i - (C + c) + (c - r), a === 0 && l === 0 && f === 0 && h === 0) || (v = Ai * s + Mi * Math.abs($), $ += A * h + C * a - (P * f + B * l), $ >= v || -$ >= v)) return $;
  d = a * C, u = ut * a, p = u - (u - a), y = a - p, u = ut * C, m = u - (u - C), S = C - m, _ = y * S - (d - p * m - y * m - p * S), w = l * B, u = ut * l, p = u - (u - l), y = l - p, u = ut * B, m = u - (u - B), S = B - m, k = y * S - (w - p * m - y * m - p * S), b = _ - k, c = _ - b, yt[0] = _ - (b + c) + (c - k), g = d + b, c = g - d, x = d - (g - c) + (b - c), b = x - w, c = x - b, yt[1] = x - (b + c) + (c - w), O = g + b, c = O - g, yt[2] = g - (O - c) + (b - c), yt[3] = O;
  const I = $e(4, Gt, 4, yt, rn);
  d = A * h, u = ut * A, p = u - (u - A), y = A - p, u = ut * h, m = u - (u - h), S = h - m, _ = y * S - (d - p * m - y * m - p * S), w = P * f, u = ut * P, p = u - (u - P), y = P - p, u = ut * f, m = u - (u - f), S = f - m, k = y * S - (w - p * m - y * m - p * S), b = _ - k, c = _ - b, yt[0] = _ - (b + c) + (c - k), g = d + b, c = g - d, x = d - (g - c) + (b - c), b = x - w, c = x - b, yt[1] = x - (b + c) + (c - w), O = g + b, c = O - g, yt[2] = g - (O - c) + (b - c), yt[3] = O;
  const E = $e(I, rn, 4, yt, on);
  d = a * h, u = ut * a, p = u - (u - a), y = a - p, u = ut * h, m = u - (u - h), S = h - m, _ = y * S - (d - p * m - y * m - p * S), w = l * f, u = ut * l, p = u - (u - l), y = l - p, u = ut * f, m = u - (u - f), S = f - m, k = y * S - (w - p * m - y * m - p * S), b = _ - k, c = _ - b, yt[0] = _ - (b + c) + (c - k), g = d + b, c = g - d, x = d - (g - c) + (b - c), b = x - w, c = x - b, yt[1] = x - (b + c) + (c - w), O = g + b, c = O - g, yt[2] = g - (O - c) + (b - c), yt[3] = O;
  const N = $e(E, on, 4, yt, sn);
  return sn[N - 1];
}
function an(e, t, n, i, o, r) {
  const s = (t - r) * (n - o), a = (e - o) * (i - r), l = s - a;
  if (s === 0 || a === 0 || s > 0 != a > 0) return l;
  const f = Math.abs(s + a);
  return Math.abs(l) >= ki * f ? l : -Ii(e, t, n, i, o, r, f);
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
      for (let l = 0; l < i[o][r].length - 1; l++) {
        a = i[o][r][l + 1];
        const f = new ln(s, we, ye, ve), h = new ln(a, we, ye, ve + 1);
        f.otherEvent = h, h.otherEvent = f, Gn(f, h) > 0 ? (h.isLeftEndpoint = !0, f.isLeftEndpoint = !1) : (f.isLeftEndpoint = !0, h.isLeftEndpoint = !1), t.push(f), t.push(h), s = a, ve = ve + 1;
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
        const l = Ci(r, a);
        l !== !1 && n.push(l);
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
  const n = e.leftSweepEvent.p.x, i = e.leftSweepEvent.p.y, o = e.rightSweepEvent.p.x, r = e.rightSweepEvent.p.y, s = t.leftSweepEvent.p.x, a = t.leftSweepEvent.p.y, l = t.rightSweepEvent.p.x, f = t.rightSweepEvent.p.y, h = an(n, i, o, r, s, a), c = an(n, i, o, r, l, f);
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
  const u = (f - a) * (o - n) - (l - s) * (r - i), p = (l - s) * (i - a) - (f - a) * (n - s), y = (o - n) * (i - a) - (r - i) * (n - s);
  if (u === 0)
    return !1;
  const m = p / u, S = y / u;
  if (m >= 0 && m <= 1 && S >= 0 && S <= 1) {
    const b = n + m * (o - n), g = i + m * (r - i);
    return [b, g];
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
    const l = {};
    s.forEach((f) => {
      const h = f.join(",");
      l[h] || (l[h] = !0, a.push(f));
    });
  } else
    a = s;
  return Mt(a.map((l) => Lt(l)));
}
function Fi(e) {
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
var be = { exports: {} }, Ee = { exports: {} }, Ri = Ee.exports, fn;
function Yi() {
  return fn || (fn = 1, (function(e, t) {
    (function(n, i) {
      e.exports = i();
    })(Ri, function() {
      function n(g, x, d, _, w) {
        (function k(O, A, B, P, C) {
          for (; P > B; ) {
            if (P - B > 600) {
              var $ = P - B + 1, v = A - B + 1, I = Math.log($), E = 0.5 * Math.exp(2 * I / 3), N = 0.5 * Math.sqrt(I * E * ($ - E) / $) * (v - $ / 2 < 0 ? -1 : 1), D = Math.max(B, Math.floor(A - v * E / $ + N)), X = Math.min(P, Math.floor(A + ($ - v) * E / $ + N));
              k(O, A, D, X, C);
            }
            var M = O[A], T = B, F = P;
            for (i(O, B, A), C(O[P], M) > 0 && i(O, B, P); T < F; ) {
              for (i(O, T, F), T++, F--; C(O[T], M) < 0; ) T++;
              for (; C(O[F], M) > 0; ) F--;
            }
            C(O[B], M) === 0 ? i(O, B, F) : i(O, ++F, P), F <= A && (B = F + 1), A <= F && (P = F - 1);
          }
        })(g, x, d || 0, _ || g.length - 1, w || o);
      }
      function i(g, x, d) {
        var _ = g[x];
        g[x] = g[d], g[d] = _;
      }
      function o(g, x) {
        return g < x ? -1 : g > x ? 1 : 0;
      }
      var r = function(g) {
        g === void 0 && (g = 9), this._maxEntries = Math.max(4, g), this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries)), this.clear();
      };
      function s(g, x, d) {
        if (!d) return x.indexOf(g);
        for (var _ = 0; _ < x.length; _++) if (d(g, x[_])) return _;
        return -1;
      }
      function a(g, x) {
        l(g, 0, g.children.length, x, g);
      }
      function l(g, x, d, _, w) {
        w || (w = S(null)), w.minX = 1 / 0, w.minY = 1 / 0, w.maxX = -1 / 0, w.maxY = -1 / 0;
        for (var k = x; k < d; k++) {
          var O = g.children[k];
          f(w, g.leaf ? _(O) : O);
        }
        return w;
      }
      function f(g, x) {
        return g.minX = Math.min(g.minX, x.minX), g.minY = Math.min(g.minY, x.minY), g.maxX = Math.max(g.maxX, x.maxX), g.maxY = Math.max(g.maxY, x.maxY), g;
      }
      function h(g, x) {
        return g.minX - x.minX;
      }
      function c(g, x) {
        return g.minY - x.minY;
      }
      function u(g) {
        return (g.maxX - g.minX) * (g.maxY - g.minY);
      }
      function p(g) {
        return g.maxX - g.minX + (g.maxY - g.minY);
      }
      function y(g, x) {
        return g.minX <= x.minX && g.minY <= x.minY && x.maxX <= g.maxX && x.maxY <= g.maxY;
      }
      function m(g, x) {
        return x.minX <= g.maxX && x.minY <= g.maxY && x.maxX >= g.minX && x.maxY >= g.minY;
      }
      function S(g) {
        return { children: g, height: 1, leaf: !0, minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
      }
      function b(g, x, d, _, w) {
        for (var k = [x, d]; k.length; ) if (!((d = k.pop()) - (x = k.pop()) <= _)) {
          var O = x + Math.ceil((d - x) / _ / 2) * _;
          n(g, O, x, d, w), k.push(x, O, O, d);
        }
      }
      return r.prototype.all = function() {
        return this._all(this.data, []);
      }, r.prototype.search = function(g) {
        var x = this.data, d = [];
        if (!m(g, x)) return d;
        for (var _ = this.toBBox, w = []; x; ) {
          for (var k = 0; k < x.children.length; k++) {
            var O = x.children[k], A = x.leaf ? _(O) : O;
            m(g, A) && (x.leaf ? d.push(O) : y(g, A) ? this._all(O, d) : w.push(O));
          }
          x = w.pop();
        }
        return d;
      }, r.prototype.collides = function(g) {
        var x = this.data;
        if (!m(g, x)) return !1;
        for (var d = []; x; ) {
          for (var _ = 0; _ < x.children.length; _++) {
            var w = x.children[_], k = x.leaf ? this.toBBox(w) : w;
            if (m(g, k)) {
              if (x.leaf || y(g, k)) return !0;
              d.push(w);
            }
          }
          x = d.pop();
        }
        return !1;
      }, r.prototype.load = function(g) {
        if (!g || !g.length) return this;
        if (g.length < this._minEntries) {
          for (var x = 0; x < g.length; x++) this.insert(g[x]);
          return this;
        }
        var d = this._build(g.slice(), 0, g.length - 1, 0);
        if (this.data.children.length) if (this.data.height === d.height) this._splitRoot(this.data, d);
        else {
          if (this.data.height < d.height) {
            var _ = this.data;
            this.data = d, d = _;
          }
          this._insert(d, this.data.height - d.height - 1, !0);
        }
        else this.data = d;
        return this;
      }, r.prototype.insert = function(g) {
        return g && this._insert(g, this.data.height - 1), this;
      }, r.prototype.clear = function() {
        return this.data = S([]), this;
      }, r.prototype.remove = function(g, x) {
        if (!g) return this;
        for (var d, _, w, k = this.data, O = this.toBBox(g), A = [], B = []; k || A.length; ) {
          if (k || (k = A.pop(), _ = A[A.length - 1], d = B.pop(), w = !0), k.leaf) {
            var P = s(g, k.children, x);
            if (P !== -1) return k.children.splice(P, 1), A.push(k), this._condense(A), this;
          }
          w || k.leaf || !y(k, O) ? _ ? (d++, k = _.children[d], w = !1) : k = null : (A.push(k), B.push(d), d = 0, _ = k, k = k.children[0]);
        }
        return this;
      }, r.prototype.toBBox = function(g) {
        return g;
      }, r.prototype.compareMinX = function(g, x) {
        return g.minX - x.minX;
      }, r.prototype.compareMinY = function(g, x) {
        return g.minY - x.minY;
      }, r.prototype.toJSON = function() {
        return this.data;
      }, r.prototype.fromJSON = function(g) {
        return this.data = g, this;
      }, r.prototype._all = function(g, x) {
        for (var d = []; g; ) g.leaf ? x.push.apply(x, g.children) : d.push.apply(d, g.children), g = d.pop();
        return x;
      }, r.prototype._build = function(g, x, d, _) {
        var w, k = d - x + 1, O = this._maxEntries;
        if (k <= O) return a(w = S(g.slice(x, d + 1)), this.toBBox), w;
        _ || (_ = Math.ceil(Math.log(k) / Math.log(O)), O = Math.ceil(k / Math.pow(O, _ - 1))), (w = S([])).leaf = !1, w.height = _;
        var A = Math.ceil(k / O), B = A * Math.ceil(Math.sqrt(O));
        b(g, x, d, B, this.compareMinX);
        for (var P = x; P <= d; P += B) {
          var C = Math.min(P + B - 1, d);
          b(g, P, C, A, this.compareMinY);
          for (var $ = P; $ <= C; $ += A) {
            var v = Math.min($ + A - 1, C);
            w.children.push(this._build(g, $, v, _ - 1));
          }
        }
        return a(w, this.toBBox), w;
      }, r.prototype._chooseSubtree = function(g, x, d, _) {
        for (; _.push(x), !x.leaf && _.length - 1 !== d; ) {
          for (var w = 1 / 0, k = 1 / 0, O = void 0, A = 0; A < x.children.length; A++) {
            var B = x.children[A], P = u(B), C = ($ = g, v = B, (Math.max(v.maxX, $.maxX) - Math.min(v.minX, $.minX)) * (Math.max(v.maxY, $.maxY) - Math.min(v.minY, $.minY)) - P);
            C < k ? (k = C, w = P < w ? P : w, O = B) : C === k && P < w && (w = P, O = B);
          }
          x = O || x.children[0];
        }
        var $, v;
        return x;
      }, r.prototype._insert = function(g, x, d) {
        var _ = d ? g : this.toBBox(g), w = [], k = this._chooseSubtree(_, this.data, x, w);
        for (k.children.push(g), f(k, _); x >= 0 && w[x].children.length > this._maxEntries; ) this._split(w, x), x--;
        this._adjustParentBBoxes(_, w, x);
      }, r.prototype._split = function(g, x) {
        var d = g[x], _ = d.children.length, w = this._minEntries;
        this._chooseSplitAxis(d, w, _);
        var k = this._chooseSplitIndex(d, w, _), O = S(d.children.splice(k, d.children.length - k));
        O.height = d.height, O.leaf = d.leaf, a(d, this.toBBox), a(O, this.toBBox), x ? g[x - 1].children.push(O) : this._splitRoot(d, O);
      }, r.prototype._splitRoot = function(g, x) {
        this.data = S([g, x]), this.data.height = g.height + 1, this.data.leaf = !1, a(this.data, this.toBBox);
      }, r.prototype._chooseSplitIndex = function(g, x, d) {
        for (var _, w, k, O, A, B, P, C = 1 / 0, $ = 1 / 0, v = x; v <= d - x; v++) {
          var I = l(g, 0, v, this.toBBox), E = l(g, v, d, this.toBBox), N = (w = I, k = E, O = void 0, A = void 0, B = void 0, P = void 0, O = Math.max(w.minX, k.minX), A = Math.max(w.minY, k.minY), B = Math.min(w.maxX, k.maxX), P = Math.min(w.maxY, k.maxY), Math.max(0, B - O) * Math.max(0, P - A)), D = u(I) + u(E);
          N < C ? (C = N, _ = v, $ = D < $ ? D : $) : N === C && D < $ && ($ = D, _ = v);
        }
        return _ || d - x;
      }, r.prototype._chooseSplitAxis = function(g, x, d) {
        var _ = g.leaf ? this.compareMinX : h, w = g.leaf ? this.compareMinY : c;
        this._allDistMargin(g, x, d, _) < this._allDistMargin(g, x, d, w) && g.children.sort(_);
      }, r.prototype._allDistMargin = function(g, x, d, _) {
        g.children.sort(_);
        for (var w = this.toBBox, k = l(g, 0, x, w), O = l(g, d - x, d, w), A = p(k) + p(O), B = x; B < d - x; B++) {
          var P = g.children[B];
          f(k, g.leaf ? w(P) : P), A += p(k);
        }
        for (var C = d - x - 1; C >= x; C--) {
          var $ = g.children[C];
          f(O, g.leaf ? w($) : $), A += p(O);
        }
        return A;
      }, r.prototype._adjustParentBBoxes = function(g, x, d) {
        for (var _ = d; _ >= 0; _--) f(x[_], g);
      }, r.prototype._condense = function(g) {
        for (var x = g.length - 1, d = void 0; x >= 0; x--) g[x].children.length === 0 ? x > 0 ? (d = g[x - 1].children).splice(d.indexOf(g[x]), 1) : this.clear() : a(g[x], this.toBBox);
      }, r;
    });
  })(Ee)), Ee.exports;
}
const Li = /* @__PURE__ */ Xi(_i);
var Zt = { exports: {} }, Re, hn;
function Vi() {
  return hn || (hn = 1, Re = function(t, n, i, o) {
    var r = t[0], s = t[1], a = !1;
    i === void 0 && (i = 0), o === void 0 && (o = n.length);
    for (var l = (o - i) / 2, f = 0, h = l - 1; f < l; h = f++) {
      var c = n[i + f * 2 + 0], u = n[i + f * 2 + 1], p = n[i + h * 2 + 0], y = n[i + h * 2 + 1], m = u > s != y > s && r < (p - c) * (s - u) / (y - u) + c;
      m && (a = !a);
    }
    return a;
  }), Re;
}
var Ye, un;
function qi() {
  return un || (un = 1, Ye = function(t, n, i, o) {
    var r = t[0], s = t[1], a = !1;
    i === void 0 && (i = 0), o === void 0 && (o = n.length);
    for (var l = o - i, f = 0, h = l - 1; f < l; h = f++) {
      var c = n[f + i][0], u = n[f + i][1], p = n[h + i][0], y = n[h + i][1], m = u > s != y > s && r < (p - c) * (s - u) / (y - u) + c;
      m && (a = !a);
    }
    return a;
  }), Ye;
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
      function r(m, S, b, g, x) {
        let d, _, w, k, O = S[0], A = g[0], B = 0, P = 0;
        A > O == A > -O ? (d = O, O = S[++B]) : (d = A, A = g[++P]);
        let C = 0;
        if (B < m && P < b) for (A > O == A > -O ? (w = d - ((_ = O + d) - O), O = S[++B]) : (w = d - ((_ = A + d) - A), A = g[++P]), d = _, w !== 0 && (x[C++] = w); B < m && P < b; ) A > O == A > -O ? (w = d - ((_ = d + O) - (k = _ - d)) + (O - k), O = S[++B]) : (w = d - ((_ = d + A) - (k = _ - d)) + (A - k), A = g[++P]), d = _, w !== 0 && (x[C++] = w);
        for (; B < m; ) w = d - ((_ = d + O) - (k = _ - d)) + (O - k), O = S[++B], d = _, w !== 0 && (x[C++] = w);
        for (; P < b; ) w = d - ((_ = d + A) - (k = _ - d)) + (A - k), A = g[++P], d = _, w !== 0 && (x[C++] = w);
        return d === 0 && C !== 0 || (x[C++] = d), C;
      }
      function s(m) {
        return new Float64Array(m);
      }
      const a = 33306690738754716e-32, l = 22204460492503146e-32, f = 11093356479670487e-47, h = s(4), c = s(8), u = s(12), p = s(16), y = s(4);
      n.orient2d = function(m, S, b, g, x, d) {
        const _ = (S - d) * (b - x), w = (m - x) * (g - d), k = _ - w;
        if (_ === 0 || w === 0 || _ > 0 != w > 0) return k;
        const O = Math.abs(_ + w);
        return Math.abs(k) >= a * O ? k : -(function(A, B, P, C, $, v, I) {
          let E, N, D, X, M, T, F, R, L, V, j, q, J, G, Q, H, Z, W;
          const st = A - $, ft = P - $, rt = B - v, ot = C - v;
          M = (Q = (R = st - (F = (T = 134217729 * st) - (T - st))) * (V = ot - (L = (T = 134217729 * ot) - (T - ot))) - ((G = st * ot) - F * L - R * L - F * V)) - (j = Q - (Z = (R = rt - (F = (T = 134217729 * rt) - (T - rt))) * (V = ft - (L = (T = 134217729 * ft) - (T - ft))) - ((H = rt * ft) - F * L - R * L - F * V))), h[0] = Q - (j + M) + (M - Z), M = (J = G - ((q = G + j) - (M = q - G)) + (j - M)) - (j = J - H), h[1] = J - (j + M) + (M - H), M = (W = q + j) - q, h[2] = q - (W - M) + (j - M), h[3] = W;
          let Dt = (function(ai, Qe) {
            let He = Qe[0];
            for (let Be = 1; Be < ai; Be++) He += Qe[Be];
            return He;
          })(4, h), Wt = l * I;
          if (Dt >= Wt || -Dt >= Wt || (E = A - (st + (M = A - st)) + (M - $), D = P - (ft + (M = P - ft)) + (M - $), N = B - (rt + (M = B - rt)) + (M - v), X = C - (ot + (M = C - ot)) + (M - v), E === 0 && N === 0 && D === 0 && X === 0) || (Wt = f * I + o * Math.abs(Dt), (Dt += st * X + ot * E - (rt * D + ft * N)) >= Wt || -Dt >= Wt)) return Dt;
          M = (Q = (R = E - (F = (T = 134217729 * E) - (T - E))) * (V = ot - (L = (T = 134217729 * ot) - (T - ot))) - ((G = E * ot) - F * L - R * L - F * V)) - (j = Q - (Z = (R = N - (F = (T = 134217729 * N) - (T - N))) * (V = ft - (L = (T = 134217729 * ft) - (T - ft))) - ((H = N * ft) - F * L - R * L - F * V))), y[0] = Q - (j + M) + (M - Z), M = (J = G - ((q = G + j) - (M = q - G)) + (j - M)) - (j = J - H), y[1] = J - (j + M) + (M - H), M = (W = q + j) - q, y[2] = q - (W - M) + (j - M), y[3] = W;
          const ri = r(4, h, 4, y, c);
          M = (Q = (R = st - (F = (T = 134217729 * st) - (T - st))) * (V = X - (L = (T = 134217729 * X) - (T - X))) - ((G = st * X) - F * L - R * L - F * V)) - (j = Q - (Z = (R = rt - (F = (T = 134217729 * rt) - (T - rt))) * (V = D - (L = (T = 134217729 * D) - (T - D))) - ((H = rt * D) - F * L - R * L - F * V))), y[0] = Q - (j + M) + (M - Z), M = (J = G - ((q = G + j) - (M = q - G)) + (j - M)) - (j = J - H), y[1] = J - (j + M) + (M - H), M = (W = q + j) - q, y[2] = q - (W - M) + (j - M), y[3] = W;
          const oi = r(ri, c, 4, y, u);
          M = (Q = (R = E - (F = (T = 134217729 * E) - (T - E))) * (V = X - (L = (T = 134217729 * X) - (T - X))) - ((G = E * X) - F * L - R * L - F * V)) - (j = Q - (Z = (R = N - (F = (T = 134217729 * N) - (T - N))) * (V = D - (L = (T = 134217729 * D) - (T - D))) - ((H = N * D) - F * L - R * L - F * V))), y[0] = Q - (j + M) + (M - Z), M = (J = G - ((q = G + j) - (M = q - G)) + (j - M)) - (j = J - H), y[1] = J - (j + M) + (M - H), M = (W = q + j) - q, y[2] = q - (W - M) + (j - M), y[3] = W;
          const si = r(oi, u, 4, y, p);
          return p[si - 1];
        })(m, S, b, g, x, d, O);
      }, n.orient2dfast = function(m, S, b, g, x, d) {
        return (S - d) * (b - x) - (m - x) * (g - d);
      }, Object.defineProperty(n, "__esModule", { value: !0 });
    });
  })(ee, ee.exports)), ee.exports;
}
var gn;
function Gi() {
  if (gn) return be.exports;
  gn = 1;
  var e = Yi(), t = Li, n = ji(), i = zi().orient2d;
  t.default && (t = t.default), be.exports = o, be.exports.default = o;
  function o(d, _, w) {
    _ = Math.max(0, _ === void 0 ? 2 : _), w = w || 0;
    var k = p(d), O = new e(16);
    O.toBBox = function(F) {
      return {
        minX: F[0],
        minY: F[1],
        maxX: F[0],
        maxY: F[1]
      };
    }, O.compareMinX = function(F, R) {
      return F[0] - R[0];
    }, O.compareMinY = function(F, R) {
      return F[1] - R[1];
    }, O.load(d);
    for (var A = [], B = 0, P; B < k.length; B++) {
      var C = k[B];
      O.remove(C), P = y(C, P), A.push(P);
    }
    var $ = new e(16);
    for (B = 0; B < A.length; B++) $.insert(u(A[B]));
    for (var v = _ * _, I = w * w; A.length; ) {
      var E = A.shift(), N = E.p, D = E.next.p, X = m(N, D);
      if (!(X < I)) {
        var M = X / v;
        C = r(O, E.prev.p, N, D, E.next.next.p, M, $), C && Math.min(m(C, N), m(C, D)) <= M && (A.push(E), A.push(y(C, E)), O.remove(C), $.remove(E), $.insert(u(E)), $.insert(u(E.next)));
      }
    }
    E = P;
    var T = [];
    do
      T.push(E.p), E = E.next;
    while (E !== P);
    return T.push(E.p), T;
  }
  function r(d, _, w, k, O, A, B) {
    for (var P = new t([], s), C = d.data; C; ) {
      for (var $ = 0; $ < C.children.length; $++) {
        var v = C.children[$], I = C.leaf ? S(v, w, k) : a(w, k, v);
        I > A || P.push({
          node: v,
          dist: I
        });
      }
      for (; P.length && !P.peek().node.children; ) {
        var E = P.pop(), N = E.node, D = S(N, _, w), X = S(N, k, O);
        if (E.dist < D && E.dist < X && f(w, N, B) && f(k, N, B)) return N;
      }
      C = P.pop(), C && (C = C.node);
    }
    return null;
  }
  function s(d, _) {
    return d.dist - _.dist;
  }
  function a(d, _, w) {
    if (l(d, w) || l(_, w)) return 0;
    var k = b(d[0], d[1], _[0], _[1], w.minX, w.minY, w.maxX, w.minY);
    if (k === 0) return 0;
    var O = b(d[0], d[1], _[0], _[1], w.minX, w.minY, w.minX, w.maxY);
    if (O === 0) return 0;
    var A = b(d[0], d[1], _[0], _[1], w.maxX, w.minY, w.maxX, w.maxY);
    if (A === 0) return 0;
    var B = b(d[0], d[1], _[0], _[1], w.minX, w.maxY, w.maxX, w.maxY);
    return B === 0 ? 0 : Math.min(k, O, A, B);
  }
  function l(d, _) {
    return d[0] >= _.minX && d[0] <= _.maxX && d[1] >= _.minY && d[1] <= _.maxY;
  }
  function f(d, _, w) {
    for (var k = Math.min(d[0], _[0]), O = Math.min(d[1], _[1]), A = Math.max(d[0], _[0]), B = Math.max(d[1], _[1]), P = w.search({ minX: k, minY: O, maxX: A, maxY: B }), C = 0; C < P.length; C++)
      if (c(P[C].p, P[C].next.p, d, _)) return !1;
    return !0;
  }
  function h(d, _, w) {
    return i(d[0], d[1], _[0], _[1], w[0], w[1]);
  }
  function c(d, _, w, k) {
    return d !== k && _ !== w && h(d, _, w) > 0 != h(d, _, k) > 0 && h(w, k, d) > 0 != h(w, k, _) > 0;
  }
  function u(d) {
    var _ = d.p, w = d.next.p;
    return d.minX = Math.min(_[0], w[0]), d.minY = Math.min(_[1], w[1]), d.maxX = Math.max(_[0], w[0]), d.maxY = Math.max(_[1], w[1]), d;
  }
  function p(d) {
    for (var _ = d[0], w = d[0], k = d[0], O = d[0], A = 0; A < d.length; A++) {
      var B = d[A];
      B[0] < _[0] && (_ = B), B[0] > k[0] && (k = B), B[1] < w[1] && (w = B), B[1] > O[1] && (O = B);
    }
    var P = [_, w, k, O], C = P.slice();
    for (A = 0; A < d.length; A++)
      n(d[A], P) || C.push(d[A]);
    return x(C);
  }
  function y(d, _) {
    var w = {
      p: d,
      prev: null,
      next: null,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };
    return _ ? (w.next = _.next, w.prev = _, _.next.prev = w, _.next = w) : (w.prev = w, w.next = w), w;
  }
  function m(d, _) {
    var w = d[0] - _[0], k = d[1] - _[1];
    return w * w + k * k;
  }
  function S(d, _, w) {
    var k = _[0], O = _[1], A = w[0] - k, B = w[1] - O;
    if (A !== 0 || B !== 0) {
      var P = ((d[0] - k) * A + (d[1] - O) * B) / (A * A + B * B);
      P > 1 ? (k = w[0], O = w[1]) : P > 0 && (k += A * P, O += B * P);
    }
    return A = d[0] - k, B = d[1] - O, A * A + B * B;
  }
  function b(d, _, w, k, O, A, B, P) {
    var C = w - d, $ = k - _, v = B - O, I = P - A, E = d - O, N = _ - A, D = C * C + $ * $, X = C * v + $ * I, M = v * v + I * I, T = C * E + $ * N, F = v * E + I * N, R = D * M - X * X, L, V, j, q, J = R, G = R;
    R === 0 ? (V = 0, J = 1, q = F, G = M) : (V = X * F - M * T, q = D * F - X * T, V < 0 ? (V = 0, q = F, G = M) : V > J && (V = J, q = F + X, G = M)), q < 0 ? (q = 0, -T < 0 ? V = 0 : -T > D ? V = J : (V = -T, J = D)) : q > G && (q = G, -T + X < 0 ? V = 0 : -T + X > D ? V = J : (V = -T + X, J = D)), L = V === 0 ? 0 : V / J, j = q === 0 ? 0 : q / G;
    var Q = (1 - L) * d + L * w, H = (1 - L) * _ + L * k, Z = (1 - j) * O + j * B, W = (1 - j) * A + j * P, st = Z - Q, ft = W - H;
    return st * st + ft * ft;
  }
  function g(d, _) {
    return d[0] === _[0] ? d[1] - _[1] : d[0] - _[0];
  }
  function x(d) {
    d.sort(g);
    for (var _ = [], w = 0; w < d.length; w++) {
      for (; _.length >= 2 && h(_[_.length - 2], _[_.length - 1], d[w]) <= 0; )
        _.pop();
      _.push(d[w]);
    }
    for (var k = [], O = d.length - 1; O >= 0; O--) {
      for (; k.length >= 2 && h(k[k.length - 2], k[k.length - 1], d[O]) <= 0; )
        k.pop();
      k.push(d[O]);
    }
    return k.pop(), _.pop(), _.concat(k);
  }
  return be.exports;
}
var Ji = Gi();
const Ki = /* @__PURE__ */ Fi(Ji);
function mn(e, t = {}) {
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
  let r, s, a, l, f = t[0], h = i[0], c = 0, u = 0;
  h > f == h > -f ? (r = f, f = t[++c]) : (r = h, h = i[++u]);
  let p = 0;
  if (c < e && u < n)
    for (h > f == h > -f ? (s = f + r, a = r - (s - f), f = t[++c]) : (s = h + r, a = r - (s - h), h = i[++u]), r = s, a !== 0 && (o[p++] = a); c < e && u < n; )
      h > f == h > -f ? (s = r + f, l = s - r, a = r - (s - l) + (f - l), f = t[++c]) : (s = r + h, l = s - r, a = r - (s - l) + (h - l), h = i[++u]), r = s, a !== 0 && (o[p++] = a);
  for (; c < e; )
    s = r + f, l = s - r, a = r - (s - l) + (f - l), f = t[++c], r = s, a !== 0 && (o[p++] = a);
  for (; u < n; )
    s = r + h, l = s - r, a = r - (s - l) + (h - l), h = i[++u], r = s, a !== 0 && (o[p++] = a);
  return (r !== 0 || p === 0) && (o[p++] = r), p;
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
  let a, l, f, h, c, u, p, y, m, S, b, g, x, d, _, w, k, O;
  const A = e - o, B = n - o, P = t - r, C = i - r;
  d = A * C, u = dt * A, p = u - (u - A), y = A - p, u = dt * C, m = u - (u - C), S = C - m, _ = y * S - (d - p * m - y * m - p * S), w = P * B, u = dt * P, p = u - (u - P), y = P - p, u = dt * B, m = u - (u - B), S = B - m, k = y * S - (w - p * m - y * m - p * S), b = _ - k, c = _ - b, Jt[0] = _ - (b + c) + (c - k), g = d + b, c = g - d, x = d - (g - c) + (b - c), b = x - w, c = x - b, Jt[1] = x - (b + c) + (c - w), O = g + b, c = O - g, Jt[2] = g - (O - c) + (b - c), Jt[3] = O;
  let $ = Zi(4, Jt), v = er * s;
  if ($ >= v || -$ >= v || (c = e - A, a = e - (A + c) + (c - o), c = n - B, f = n - (B + c) + (c - o), c = t - P, l = t - (P + c) + (c - r), c = i - C, h = i - (C + c) + (c - r), a === 0 && l === 0 && f === 0 && h === 0) || (v = nr * s + Wi * Math.abs($), $ += A * h + C * a - (P * f + B * l), $ >= v || -$ >= v)) return $;
  d = a * C, u = dt * a, p = u - (u - a), y = a - p, u = dt * C, m = u - (u - C), S = C - m, _ = y * S - (d - p * m - y * m - p * S), w = l * B, u = dt * l, p = u - (u - l), y = l - p, u = dt * B, m = u - (u - B), S = B - m, k = y * S - (w - p * m - y * m - p * S), b = _ - k, c = _ - b, vt[0] = _ - (b + c) + (c - k), g = d + b, c = g - d, x = d - (g - c) + (b - c), b = x - w, c = x - b, vt[1] = x - (b + c) + (c - w), O = g + b, c = O - g, vt[2] = g - (O - c) + (b - c), vt[3] = O;
  const I = Le(4, Jt, 4, vt, vn);
  d = A * h, u = dt * A, p = u - (u - A), y = A - p, u = dt * h, m = u - (u - h), S = h - m, _ = y * S - (d - p * m - y * m - p * S), w = P * f, u = dt * P, p = u - (u - P), y = P - p, u = dt * f, m = u - (u - f), S = f - m, k = y * S - (w - p * m - y * m - p * S), b = _ - k, c = _ - b, vt[0] = _ - (b + c) + (c - k), g = d + b, c = g - d, x = d - (g - c) + (b - c), b = x - w, c = x - b, vt[1] = x - (b + c) + (c - w), O = g + b, c = O - g, vt[2] = g - (O - c) + (b - c), vt[3] = O;
  const E = Le(I, vn, 4, vt, bn);
  d = a * h, u = dt * a, p = u - (u - a), y = a - p, u = dt * h, m = u - (u - h), S = h - m, _ = y * S - (d - p * m - y * m - p * S), w = l * f, u = dt * l, p = u - (u - l), y = l - p, u = dt * f, m = u - (u - f), S = f - m, k = y * S - (w - p * m - y * m - p * S), b = _ - k, c = _ - b, vt[0] = _ - (b + c) + (c - k), g = d + b, c = g - d, x = d - (g - c) + (b - c), b = x - w, c = x - b, vt[1] = x - (b + c) + (c - w), O = g + b, c = O - g, vt[2] = g - (O - c) + (b - c), vt[3] = O;
  const N = Le(E, bn, 4, vt, xn);
  return xn[N - 1];
}
function rr(e, t, n, i, o, r) {
  const s = (t - r) * (n - o), a = (e - o) * (i - r), l = s - a, f = Math.abs(s + a);
  return Math.abs(l) >= tr * f ? l : -ir(e, t, n, i, o, r, f);
}
function or(e, t) {
  var n, i, o = 0, r, s, a, l, f, h, c, u = e[0], p = e[1], y = t.length;
  for (n = 0; n < y; n++) {
    i = 0;
    var m = t[n], S = m.length - 1;
    if (h = m[0], h[0] !== m[S][0] && h[1] !== m[S][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (s = h[0] - u, a = h[1] - p, i; i < S; i++) {
      if (c = m[i + 1], l = c[0] - u, f = c[1] - p, a === 0 && f === 0) {
        if (l <= 0 && s >= 0 || s <= 0 && l >= 0)
          return 0;
      } else if (f >= 0 && a <= 0 || f <= 0 && a >= 0) {
        if (r = rr(s, l, a, f, 0, 0), r === 0)
          return 0;
        (r > 0 && f > 0 && a <= 0 || r < 0 && f <= 0 && a > 0) && o++;
      }
      h = c, a = f, s = l;
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
  for (var l = 0; l < a.length; ++l) {
    const f = or(i, a[l]);
    if (f === 0 && !n.ignoreBoundary || f) return !0;
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
  const n = t.geometry.coordinates[0][0], i = t.geometry.coordinates[0][1], o = t.geometry.coordinates[0][2], r = e.geometry.coordinates, s = t.properties.a.geom, a = t.properties.b.geom, l = t.properties.c.geom, f = [i[0] - n[0], i[1] - n[1]], h = [o[0] - n[0], o[1] - n[1]], c = [r[0] - n[0], r[1] - n[1]], u = [a[0] - s[0], a[1] - s[1]], p = [l[0] - s[0], l[1] - s[1]], y = (h[1] * c[0] - h[0] * c[1]) / (f[0] * h[1] - f[1] * h[0]), m = (f[0] * c[1] - f[1] * c[0]) / (f[0] * h[1] - f[1] * h[0]);
  return [
    y * u[0] + m * p[0] + s[0],
    y * u[1] + m * p[1] + s[1]
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
  let l;
  if (s && (l = Ve(e, Ht([s]))), !l)
    if (n) {
      const f = e.geometry.coordinates, h = n.gridNum, c = n.xOrigin, u = n.yOrigin, p = n.xUnit, y = n.yUnit, m = n.gridCache, S = Pt(f[0], c, p, h), b = Pt(f[1], u, y, h), g = m[S] ? m[S][b] ? m[S][b] : [] : [], x = Ht(g.map((d) => t.features[d]));
      l = Ve(e, x);
    } else
      l = Ve(e, t);
  return a && a(l), l ? Qn(e, l) : ar(e, i, o);
}
function Pt(e, t, n, i) {
  let o = Math.floor((e - t) / n);
  return o < 0 && (o = 0), o >= i && (o = i - 1), o;
}
function cr(e, t) {
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
    (l) => {
      (!s || s < 2.00703) && (l = fr(l));
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
    strictStatus: gr(e),
    verticesParams: mr(e),
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
function gr(e) {
  return e.strict_status ? e.strict_status : e.kinks_points ? "strict_error" : e.tins_points.length === 2 ? "loose" : "strict";
}
function mr(e) {
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
      const a = o.geometry.coordinates[0][s], l = o.properties[r].geom, f = o.properties[r].index;
      typeof f == "number" && (t[f] = [a, l]);
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
    const a = n.features.map((m) => {
      let S = [];
      return yn(m)[0].map((b) => {
        r.length === 0 ? r = [Array.from(b), Array.from(b)] : (b[0] < r[0][0] && (r[0][0] = b[0]), b[0] > r[1][0] && (r[1][0] = b[0]), b[1] < r[0][1] && (r[0][1] = b[1]), b[1] > r[1][1] && (r[1][1] = b[1])), S.length === 0 ? S = [Array.from(b), Array.from(b)] : (b[0] < S[0][0] && (S[0][0] = b[0]), b[0] > S[1][0] && (S[1][0] = b[0]), b[1] < S[0][1] && (S[0][1] = b[1]), b[1] > S[1][1] && (S[1][1] = b[1]));
      }), S;
    }), l = (r[1][0] - r[0][0]) / o, f = (r[1][1] - r[0][1]) / o, h = a.reduce(
      (m, S, b) => {
        const g = Pt(S[0][0], r[0][0], l, o), x = Pt(S[1][0], r[0][0], l, o), d = Pt(S[0][1], r[0][1], f, o), _ = Pt(S[1][1], r[0][1], f, o);
        for (let w = g; w <= x; w++) {
          m[w] || (m[w] = []);
          for (let k = d; k <= _; k++)
            m[w][k] || (m[w][k] = []), m[w][k].push(b);
        }
        return m;
      },
      []
    ), c = i.features.map((m) => {
      let S = [];
      return yn(m)[0].map((b) => {
        s.length === 0 ? s = [Array.from(b), Array.from(b)] : (b[0] < s[0][0] && (s[0][0] = b[0]), b[0] > s[1][0] && (s[1][0] = b[0]), b[1] < s[0][1] && (s[0][1] = b[1]), b[1] > s[1][1] && (s[1][1] = b[1])), S.length === 0 ? S = [Array.from(b), Array.from(b)] : (b[0] < S[0][0] && (S[0][0] = b[0]), b[0] > S[1][0] && (S[1][0] = b[0]), b[1] < S[0][1] && (S[0][1] = b[1]), b[1] > S[1][1] && (S[1][1] = b[1]));
      }), S;
    }), u = (s[1][0] - s[0][0]) / o, p = (s[1][1] - s[0][1]) / o, y = c.reduce(
      (m, S, b) => {
        const g = Pt(S[0][0], s[0][0], u, o), x = Pt(S[1][0], s[0][0], u, o), d = Pt(S[0][1], s[0][1], p, o), _ = Pt(S[1][1], s[0][1], p, o);
        for (let w = g; w <= x; w++) {
          m[w] || (m[w] = []);
          for (let k = d; k <= _; k++)
            m[w][k] || (m[w][k] = []), m[w][k].push(b);
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
        yUnit: f,
        gridCache: h
      },
      bakw: {
        gridNum: o,
        xOrigin: s[0][0],
        yOrigin: s[0][1],
        xUnit: u,
        yUnit: p,
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
    const r = n ? this.tins.bakw : this.tins.forw, s = n ? this.indexedTins.bakw : this.indexedTins.forw, a = n ? this.vertices_params.bakw : this.vertices_params.forw, l = n ? this.centroid.bakw : this.centroid.forw;
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
    let a = 1 / 0, l = 1 / 0, f = -1 / 0, h = -1 / 0;
    for (let A = 0; A < s; A++) {
      const B = t[2 * A], P = t[2 * A + 1];
      B < a && (a = B), P < l && (l = P), B > f && (f = B), P > h && (h = P), this._ids[A] = A;
    }
    const c = (a + f) / 2, u = (l + h) / 2;
    let p = 0, y = 0, m = 0;
    for (let A = 0, B = 1 / 0; A < s; A++) {
      const P = qe(c, u, t[2 * A], t[2 * A + 1]);
      P < B && (p = A, B = P);
    }
    const S = t[2 * p], b = t[2 * p + 1];
    for (let A = 0, B = 1 / 0; A < s; A++) {
      if (A === p) continue;
      const P = qe(S, b, t[2 * A], t[2 * A + 1]);
      P < B && P > 0 && (y = A, B = P);
    }
    let g = t[2 * y], x = t[2 * y + 1], d = 1 / 0;
    for (let A = 0; A < s; A++) {
      if (A === p || A === y) continue;
      const B = Sr(S, b, g, x, t[2 * A], t[2 * A + 1]);
      B < d && (m = A, d = B);
    }
    let _ = t[2 * m], w = t[2 * m + 1];
    if (d === 1 / 0) {
      for (let P = 0; P < s; P++)
        this._dists[P] = t[2 * P] - t[0] || t[2 * P + 1] - t[1];
      Kt(this._ids, this._dists, 0, s - 1);
      const A = new Uint32Array(s);
      let B = 0;
      for (let P = 0, C = -1 / 0; P < s; P++) {
        const $ = this._ids[P], v = this._dists[$];
        v > C && (A[B++] = $, C = v);
      }
      this.hull = A.subarray(0, B), this.triangles = new Uint32Array(0), this.halfedges = new Int32Array(0);
      return;
    }
    if (kt(S, b, g, x, _, w) < 0) {
      const A = y, B = g, P = x;
      y = m, g = _, x = w, m = A, _ = B, w = P;
    }
    const k = kr(S, b, g, x, _, w);
    this._cx = k.x, this._cy = k.y;
    for (let A = 0; A < s; A++)
      this._dists[A] = qe(t[2 * A], t[2 * A + 1], k.x, k.y);
    Kt(this._ids, this._dists, 0, s - 1), this._hullStart = p;
    let O = 3;
    i[p] = n[m] = y, i[y] = n[p] = m, i[m] = n[y] = p, o[p] = 0, o[y] = 1, o[m] = 2, r.fill(-1), r[this._hashKey(S, b)] = p, r[this._hashKey(g, x)] = y, r[this._hashKey(_, w)] = m, this.trianglesLen = 0, this._addTriangle(p, y, m, -1, -1, -1);
    for (let A = 0, B = 0, P = 0; A < this._ids.length; A++) {
      const C = this._ids[A], $ = t[2 * C], v = t[2 * C + 1];
      if (A > 0 && Math.abs($ - B) <= kn && Math.abs(v - P) <= kn || (B = $, P = v, C === p || C === y || C === m)) continue;
      let I = 0;
      for (let M = 0, T = this._hashKey($, v); M < this._hashSize && (I = r[(T + M) % this._hashSize], !(I !== -1 && I !== i[I])); M++)
        ;
      I = n[I];
      let E = I, N;
      for (; N = i[E], kt($, v, t[2 * E], t[2 * E + 1], t[2 * N], t[2 * N + 1]) >= 0; )
        if (E = N, E === I) {
          E = -1;
          break;
        }
      if (E === -1) continue;
      let D = this._addTriangle(E, C, i[E], -1, -1, o[E]);
      o[C] = this._legalize(D + 2), o[E] = D, O++;
      let X = i[E];
      for (; N = i[X], kt($, v, t[2 * X], t[2 * X + 1], t[2 * N], t[2 * N + 1]) < 0; )
        D = this._addTriangle(X, C, N, o[C], -1, o[X]), o[C] = this._legalize(D + 2), i[X] = X, O--, X = N;
      if (E === I)
        for (; N = n[E], kt($, v, t[2 * N], t[2 * N + 1], t[2 * E], t[2 * E + 1]) < 0; )
          D = this._addTriangle(N, C, E, -1, o[E], o[N]), this._legalize(D + 2), o[N] = D, i[E] = E, O--, E = N;
      this._hullStart = n[C] = E, i[E] = n[X] = C, i[C] = X, r[this._hashKey($, v)] = C, r[this._hashKey(t[2 * E], t[2 * E + 1])] = E;
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
      const a = i[t], l = t - t % 3;
      if (s = l + (t + 2) % 3, a === -1) {
        if (r === 0) break;
        t = xe[--r];
        continue;
      }
      const f = a - a % 3, h = l + (t + 1) % 3, c = f + (a + 2) % 3, u = n[s], p = n[t], y = n[h], m = n[c];
      if (Mr(
        o[2 * u],
        o[2 * u + 1],
        o[2 * p],
        o[2 * p + 1],
        o[2 * y],
        o[2 * y + 1],
        o[2 * m],
        o[2 * m + 1]
      )) {
        n[t] = m, n[a] = u;
        const b = i[c];
        if (b === -1) {
          let x = this._hullStart;
          do {
            if (this._hullTri[x] === c) {
              this._hullTri[x] = t;
              break;
            }
            x = this._hullPrev[x];
          } while (x !== this._hullStart);
        }
        this._link(t, b), this._link(a, i[s]), this._link(s, c);
        const g = f + (a + 1) % 3;
        r < xe.length && (xe[r++] = g);
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
  const l = e - s, f = t - a, h = n - s, c = i - a, u = o - s, p = r - a, y = l * l + f * f, m = h * h + c * c, S = u * u + p * p;
  return l * (c * S - m * p) - f * (h * S - m * u) + y * (h * p - c * u) < 0;
}
function Sr(e, t, n, i, o, r) {
  const s = n - e, a = i - t, l = o - e, f = r - t, h = s * s + a * a, c = l * l + f * f, u = 0.5 / (s * f - a * l), p = (f * h - a * c) * u, y = (s * c - l * h) * u;
  return p * p + y * y;
}
function kr(e, t, n, i, o, r) {
  const s = n - e, a = i - t, l = o - e, f = r - t, h = s * s + a * a, c = l * l + f * f, u = 0.5 / (s * f - a * l), p = e + (f * h - a * c) * u, y = t + (s * c - l * h) * u;
  return { x: p, y };
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
  const l = kt(e, t, o, r, s, a), f = kt(n, i, o, r, s, a);
  if (l > 0 && f > 0 || l < 0 && f < 0)
    return !1;
  const h = kt(o, r, e, t, n, i), c = kt(s, a, e, t, n, i);
  return h > 0 && c > 0 || h < 0 && c < 0 ? !1 : l === 0 && f === 0 && h === 0 && c === 0 ? !(Math.max(o, s) < Math.min(e, n) || Math.max(e, n) < Math.min(o, s) || Math.max(r, a) < Math.min(t, i) || Math.max(t, i) < Math.min(r, a)) : !0;
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
    let a = 0, l = r;
    do {
      if (++a > s)
        throw new Error(
          `Constraining edge [${t}, ${n}] exceeded the iteration limit`
        );
      const c = i[l], u = Ot(l);
      if (c === n)
        return this.protect(l);
      const p = _t(l), y = i[p];
      if (y === n)
        return this.protect(u), u;
      if (this.intersectSegments(t, n, y, c)) {
        l = p;
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
      const c = o[l], u = _t(l), p = _t(c), y = Ot(c);
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
        i[p]
      )) {
        if (h === -1 && (h = l), i[p] === n) {
          if (l === h)
            throw new Error("Infinite loop: non-convex quadrilateral");
          l = h, h = -1;
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
          i[y],
          i[p]
        ))
          l = y;
        else if (h === l)
          throw new Error("Infinite loop: no further intersect after non-convex");
        continue;
      }
      if (this.flipDiagonal(l), this.intersectSegments(
        t,
        n,
        i[u],
        i[p]
      ) && (h === -1 && (h = u), h === u))
        throw new Error("Infinite loop: flipped diagonal still intersects");
      i[p] === n ? (f = p, l = h, h = -1) : this.intersectSegments(
        t,
        n,
        i[y],
        i[p]
      ) && (l = y);
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
    const { triangles: i, halfedges: o } = this.del, r = i.length / 3, s = (y, m, S) => {
      const b = t(m), g = t(S);
      return t(y).some((x) => b.includes(x) && g.includes(x));
    }, a = (y) => s(i[y * 3], i[y * 3 + 1], i[y * 3 + 2]), l = (y, m, S, b) => Math.sign(kt(y[m * 2], y[m * 2 + 1], y[S * 2], y[S * 2 + 1], y[b * 2], y[b * 2 + 1])), f = n.map((y) => {
      let m = 0;
      for (let S = 0; S < r; S++) m += l(y, i[S * 3], i[S * 3 + 1], i[S * 3 + 2]);
      return m < 0 ? -1 : 1;
    }), h = (y) => {
      if (this.consd.has(y)) return !1;
      const m = o[y];
      if (m === -1) return !1;
      const S = i[y], b = i[Ot(y)], g = i[_t(y)], x = i[_t(m)];
      return n.every((d, _) => l(d, g, S, x) === f[_] && l(d, x, b, g) === f[_]);
    };
    let c = 0, u = !0;
    for (; u; ) {
      u = !1;
      for (let y = 0; y < r; y++)
        if (a(y))
          for (let m = 0; m < 3; m++) {
            const S = y * 3 + m;
            if (!h(S)) continue;
            const b = o[S], g = i[S], x = i[Ot(S)], d = i[_t(S)], _ = i[_t(b)];
            if (!(s(d, g, _) && s(_, x, d))) {
              this.protect(this.flipDiagonal(S)), c++, u = !0;
              break;
            }
          }
    }
    let p = 0;
    for (let y = 0; y < r; y++) a(y) && p++;
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
    const { triangles: n, halfedges: i } = this.del, o = this.flips, r = this.consd, s = i[t], a = _t(t), l = Ot(t), f = _t(s), h = Ot(s), c = i[a], u = i[f];
    if (r.has(t))
      throw new Error("Trying to flip a constrained edge");
    return n[t] = n[f], i[t] = u, o.set(t, o.has(f)) || r.set(t, r.has(f)), u !== -1 && (i[u] = t), i[a] = f, n[s] = n[a], i[s] = c, o.set(s, o.has(a)) || r.set(s, r.has(a)), c !== -1 && (i[c] = s), i[f] = a, this.markFlip(t), this.markFlip(l), this.markFlip(s), this.markFlip(h), o.add(a), r.delete(a), o.add(f), r.delete(f), this.updateVert(t), this.updateVert(l), this.updateVert(s), this.updateVert(h), a;
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
    const r = n[_t(t)], s = n[t], a = n[Ot(t)], l = n[_t(o)];
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
  const l = [];
  for (let c = 0; c < r.triangles.length; c += 3)
    a?.has(c / 3) || l.push([r.triangles[c], r.triangles[c + 1], r.triangles[c + 2]]);
  const f = ["a", "b", "c"];
  return { tin: Mt(
    l.map((c) => {
      const u = {}, p = c.map((y, m) => {
        const S = e.features[y], b = S.geometry.coordinates, g = [b[0], b[1]];
        return b.length === 3 ? g[2] = b[2] : u[f[m]] = S.properties[n], g;
      });
      return p[3] = p[0], he([p], u);
    })
  ), remaining: s, hasBoundary: a !== void 0 };
}
function Or(e, t) {
  try {
    e.constrainAll(t);
  } catch {
    return;
  }
  const n = new Map(t), { triangles: i, halfedges: o } = e.del, r = (f) => {
    const h = i[f], c = i[Ot(f)];
    return n.get(h) === c || n.get(c) === h;
  }, s = /* @__PURE__ */ new Set(), a = [], l = (f) => {
    const h = Math.floor(f / 3);
    s.has(h) || (s.add(h), a.push(h));
  };
  for (let f = 0; f < o.length; f++)
    o[f] === -1 && !r(f) && l(f);
  for (let f = 0; f < a.length; f++)
    for (let h = a[f] * 3; h < a[f] * 3 + 3; h++) {
      if (!n.has(i[h])) return;
      o[h] !== -1 && !r(h) && l(o[h]);
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
    const r = (o + 1) % n, s = e[o], a = e[r], l = s.geometry.coordinates, f = Math.atan2(
      l[0] - i[0],
      l[1] - i[1]
    ), h = [t, s, a, t].map(
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
    }, u = Mt([
      he([h], c)
    ]);
    return [f, u];
  }).reduce(
    (o, r) => (o[0].push(r[0]), o[1].push(r[1]), o),
    [[], []]
  );
}
const Pr = [0.1, 0.15, 0.225, 0.34, 0.5];
function Nr(e, t) {
  return t ? e.hasBoundary !== t.hasBoundary ? e.hasBoundary : e.diagnostics.boundaryTriangleFlips < t.diagnostics.boundaryTriangleFlips : !0;
}
function On(e, t, n) {
  return Math.sign(kt(e[0], e[1], t[0], t[1], n[0], n[1]));
}
function Pn(e) {
  let t = 0;
  for (const n of e.features) {
    const { a: i, b: o, c: r } = n.properties;
    if (![i, o, r].some(
      ({ index: f }) => typeof f == "string" && f.startsWith("b")
    ))
      continue;
    const [s, a, l] = n.geometry.coordinates[0];
    On(s, a, l) * On(i.geom, o.geom, r.geom) >= 0 && t++;
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
    const l = (n * (i[(s + 1) % i.length] - i[s]) + o) % o;
    if (!(l > 0 && l < Math.PI)) return !1;
    r += l;
  }
  return Math.abs(r - o) < 1e-6;
}
function Tr(e, t) {
  const n = new Set(
    t.forw.map(({ geometry: o }) => String(o.coordinates))
  ), i = new Set(
    t.bakw.map(({ geometry: o }) => String(o.coordinates))
  );
  return e.filter(({ forw: o, bakw: r }) => {
    const s = String(o), a = String(r);
    return n.has(s) || i.has(a) ? !1 : (n.add(s), i.add(a), !0);
  });
}
function Cr(e, t, n, i) {
  const { minx: o, maxx: r, miny: s, maxy: a, centroid: l } = e, f = r - o, h = a - s, c = n.forw.length, u = Array.from({ length: c }, () => []);
  let p = 1;
  for (const [b, g] of n.edges)
    b < i && u[b].push(p), u[g].push(p), g < i && p++;
  const y = [0], m = (b) => b >= c ? y : u[b];
  let S;
  for (const b of Pr) {
    const g = Tr(
      t(
        {
          ...e,
          minx: o - b * f,
          maxx: r + b * f,
          miny: s - b * h,
          maxy: a + b * h
        },
        !0
      ),
      n
    ), x = g.map(
      ({ forw: E, bakw: N }, D) => ie(E, N, `b${D}`)
    ), d = Mt([...n.forw, ...x]), _ = Mt([
      ...n.bakw,
      ...x.map(re)
    ]), w = [d, _].map(
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
      g.map((E) => E.forw),
      l.forw,
      -1
    ) && Nn(
      g.map((E) => E.bakw),
      l.bakw,
      1
    ) ? g.map((E, N) => [
      c + N,
      c + (N + 1) % g.length
    ]) : void 0, A = { groupsOf: m, planes: w, boundary: O }, B = ze(
      d,
      n.edges,
      "target",
      A
    ), P = ze(
      _,
      n.edges,
      "target",
      A
    ), C = B.tin, $ = P.tin, v = Pn(C) + Pn($), I = {
      vertices: g,
      forw: C,
      bakw: $,
      diagnostics: {
        margin: b,
        boundaryTriangleFlips: v,
        remainingForbiddenTriangles: B.remaining + P.remaining
      },
      hasBoundary: B.hasBoundary && P.hasBoundary
    };
    if (v === 0 && I.hasBoundary)
      return I;
    Nr(I, S) && (S = I);
  }
  return S;
}
const Dr = 256 * Number.EPSILON;
function Fr(e, t) {
  const n = [e, t].map((o) => {
    const r = o.map((a, l, f) => {
      if (l === 0) return 0;
      const h = f[l - 1];
      return Math.sqrt(
        Math.pow(a[0] - h[0], 2) + Math.pow(a[1] - h[1], 2)
      );
    }), s = r.reduce((a, l, f) => f === 0 ? [0] : (a.push(a[f - 1] + l), a), []);
    return s.map((a, l, f) => {
      const h = a / f[f.length - 1];
      return [o[l], r[l], s[l], h];
    });
  }), i = [];
  return n.forEach((o, r) => {
    const s = n[r ? 0 : 1];
    o.forEach((a, l) => {
      if (l === 0 || l === o.length - 1 || a[4] === "handled")
        return;
      const f = a[0], h = a[3];
      let c, u = 1 / 0;
      for (let p = 1; p < s.length - 1; p++) {
        const y = s[p];
        if (y[4] === "handled") continue;
        const m = Math.abs(y[3] - h);
        m <= Dr && m < u && (c = y, u = m);
      }
      if (c) {
        c[4] = "handled", a[4] = "handled", i.push(
          r === 0 ? [f, c[0], h] : [c[0], f, h]
        );
        return;
      }
      for (let p = 0; p < s.length - 1; p++) {
        const y = s[p], m = s[p + 1], S = y[3], b = m[3];
        if (S < h && b > h) {
          const g = (h - S) / (b - S), x = [
            (m[0][0] - y[0][0]) * g + y[0][0],
            (m[0][1] - y[0][1]) * g + y[0][1]
          ];
          i.push(
            r === 0 ? [f, x, h] : [x, f, h]
          );
          return;
        }
      }
    });
  }), i.sort((o, r) => o[2] - r[2]);
}
function Xr(e, t) {
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
function $r(e) {
  let t = 1 / 0, n = 0, i = 0;
  return e.forEach((o) => {
    const { forw: r, bakw: s } = o, a = Math.hypot(r[0], r[1]), l = Math.hypot(s[0], s[1]);
    if (l === 0) return;
    const f = a / l, h = Math.atan2(r[0], r[1]) - Math.atan2(s[0], s[1]);
    t = Math.min(t, f), n += Math.cos(h), i += Math.sin(h);
  }), isFinite(t) ? [t, Math.atan2(i, n)] : [1, 0];
}
function Rr(e, t, n) {
  const { perQuad: i, aggregate: o } = Xr(e, t), r = i.every((l) => l.length > 0), a = (n === "birdeye" ? r ? i : [o] : [o]).map((l) => $r(l));
  return a.length === 1 ? [a[0], a[0], a[0], a[0]] : a;
}
function Yr(e, t) {
  let n = 0;
  return e[0] > t[0] && (n += 1), e[1] > t[1] && (n += 2), n;
}
function Lr(e, t, n) {
  const i = [
    e[0] - t.forw[0],
    e[1] - t.forw[1]
  ], r = Math.sqrt(i[0] ** 2 + i[1] ** 2) / n[0], s = Math.atan2(i[0], i[1]) - n[1];
  return [
    t.bakw[0] + r * Math.sin(s),
    t.bakw[1] - r * Math.cos(s)
  ];
}
function Vr(e, t, n, i) {
  const o = t[0] - e[0], r = t[1] - e[1];
  if (Math.abs(o) < 1e-12 && Math.abs(r) < 1e-12) return null;
  const s = i[0] - n[0], a = i[1] - n[1], l = n[0] - e[0], f = n[1] - e[1], h = o * a - r * s;
  if (Math.abs(h) < 1e-12) return null;
  const c = (l * a - f * s) / h, u = (l * r - f * o) / h;
  return c <= 1e-10 || u < -1e-10 || u > 1 + 1e-10 ? null : { t: c, point: [e[0] + c * o, e[1] + c * r] };
}
function qr(e, t, n) {
  const i = n.length;
  let o = -1 / 0, r = null;
  for (let s = 0; s < i; s++) {
    const a = (s + 1) % i, l = Vr(
      e,
      t,
      n[s].bakw,
      n[a].bakw
    );
    l && l.t > o && (o = l.t, r = l.point);
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
function Dn(e, t, n) {
  const i = e.length, o = new Array(i).fill(1);
  for (const r of t)
    for (let s = 0; s < i; s++) {
      const a = (s + 1) % i, l = We([e[s].bakw, e[a].bakw]), f = We([n.bakw, r.bakw]), h = Di(l, f);
      if (h.features.length > 0 && h.features[0].geometry) {
        const c = h.features[0], u = Math.sqrt(
          Math.pow(r.bakw[0] - n.bakw[0], 2) + Math.pow(r.bakw[1] - n.bakw[1], 2)
        ), p = Math.sqrt(
          Math.pow(c.geometry.coordinates[0] - n.bakw[0], 2) + Math.pow(c.geometry.coordinates[1] - n.bakw[1], 2)
        ), y = u / p;
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
  const { convexBuf: i, centroid: o, allGcps: r, minx: s, maxx: a, miny: l, maxy: f } = e, h = Rr(i, o, t), u = [
    [s, l],
    [a, l],
    [a, f],
    [s, f]
  ].map((w) => ({
    forw: w,
    bakw: Lr(
      w,
      o,
      h[Yr(w, o.forw)]
    )
  }));
  if (u.sort(
    (w, k) => Math.atan2(w.forw[0] - o.forw[0], w.forw[1] - o.forw[1]) - Math.atan2(k.forw[0] - o.forw[0], k.forw[1] - o.forw[1])
  ), Dn(u, r, o), !n) return u;
  const p = 4, y = u.map(
    (w) => Math.atan2(w.forw[0] - o.forw[0], w.forw[1] - o.forw[1])
  ), m = u.map(
    (w) => Math.atan2(
      w.bakw[0] - o.bakw[0],
      -(w.bakw[1] - o.bakw[1])
    )
  );
  function S(w) {
    for (let k = 0; k < p; k++) {
      const O = (k + 1) % p, A = y[k], B = k < p - 1 ? y[O] : y[O] + 2 * Math.PI;
      let P = w;
      for (; P < A; ) P += 2 * Math.PI;
      for (; P >= A + 2 * Math.PI; ) P -= 2 * Math.PI;
      if (P >= A && P < B)
        return { i: k, j: O, frac: (P - A) / (B - A) };
    }
    return { i: 0, j: 1, frac: 0 };
  }
  function b(w) {
    const { i: k, j: O, frac: A } = S(w), B = m[k];
    let C = m[O] - B;
    for (; C > Math.PI; ) C -= 2 * Math.PI;
    for (; C < -Math.PI; ) C += 2 * Math.PI;
    return B + A * C;
  }
  const g = new Set(
    u.map(
      (w) => Math.floor(Tn(w.forw, o.forw) / 10) % 36
    )
  ), x = r.map((w) => ({
    forw: w.forw,
    bakw: w.bakw,
    angleDeg: Tn(w.forw, o.forw),
    forwDist: Math.hypot(w.forw[0] - o.forw[0], w.forw[1] - o.forw[1])
  })), d = [];
  for (let w = 0; w < 36; w++) {
    if (g.has(w)) continue;
    const k = w * 10, O = x.filter(
      (I) => I.angleDeg >= k && I.angleDeg < k + 10
    );
    let A = null;
    if (O.length > 0) {
      const I = O.reduce((E, N) => N.forwDist > E.forwDist ? N : E);
      A = Cn(o.forw, I.forw, s, a, l, f);
    }
    if (!A) {
      const I = (k + 5) % 360 * (Math.PI / 180), E = [
        o.forw[0] + Math.sin(I),
        o.forw[1] + Math.cos(I)
      ];
      A = Cn(o.forw, E, s, a, l, f);
    }
    if (!A) continue;
    const B = [A[0] - o.forw[0], A[1] - o.forw[1]], P = Math.atan2(B[0], B[1]), C = b(P), $ = [
      o.bakw[0] + Math.sin(C),
      o.bakw[1] - Math.cos(C)
    ], v = qr(o.bakw, $, u);
    v && d.push({ forw: A, bakw: v });
  }
  const _ = [...u, ...d];
  return _.sort(
    (w, k) => Math.atan2(w.forw[0] - o.forw[0], w.forw[1] - o.forw[1]) - Math.atan2(k.forw[0] - o.forw[0], k.forw[1] - o.forw[1])
  ), Dn(_, r, o), _;
}
function jr(e, t = !1) {
  return Zn(e, "plain", t);
}
function Ur(e, t = !1) {
  return Zn(e, "birdeye", t);
}
function ko(e) {
  return ti(e, 1 / 0);
}
const Fn = 1e5, zr = 16;
function ti(e, t) {
  return Gr(e), new Jr(e).findSegmentIntersections(t).map(
    (o) => Lt([o.x, o.y])
  );
}
function Gr(e) {
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
class Jr {
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
    (r != this._xx.length || this._xx.length != this._yy.length) && Ut("ArcCollection#initXYData() Counting error"), this.initBounds(), this._arcIter = new go(this._xx, this._yy);
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
    let a = 0, l, f, h;
    for (let c = 0; c < o; c++)
      l = i[c], l > 0 && (f = c * 4, h = mo(t, n, a, l), r[f++] = h[0], r[f++] = h[1], r[f++] = h[2], r[f] = h[3], a += l, s.mergeBounds(h));
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
    const n = this.getBounds(), i = n.ymin || 0, o = (n.ymax || 0) - i, r = this.calcSegmentIntersectionStripeCount(), s = new Uint32Array(r), a = r > 1 ? (x) => Math.floor((r - 1) * (x - i) / o) : () => 0, l = r + 1;
    let f;
    this.forEachSegment(
      (x, d, _, w) => {
        let k = a(w[x]);
        const O = a(w[d]);
        let A = 0;
        for (; s[k] = s[k] + 2, k != O; )
          A++, A > l && Ut(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${r}`,
            `s1=${k}`,
            `s2=${O}`
          ), k += O > k ? 1 : -1;
      }
    );
    const h = this.getUint32Array(Hr(s));
    let c = 0;
    const u = [];
    Wr(s, (x) => {
      const d = c;
      c += x, u.push(h.subarray(d, c));
    }), Zr(s, 0), this.forEachSegment(
      (x, d, _, w) => {
        let k = a(w[x]);
        const O = a(w[d]);
        let A, B, P = 0;
        for (; A = s[k], s[k] = A + 2, B = u[k], B[A] = x, B[A + 1] = d, k != O; )
          P++, P > l && Ut(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${r}`,
            `s1=${k}`,
            `s2=${O}`
          ), k += O > k ? 1 : -1;
      }
    );
    const p = this.getVertexData(), y = t * zr;
    let m = 0;
    const S = /* @__PURE__ */ new Set(), b = /* @__PURE__ */ new Map(), g = (x) => {
      m++;
      const d = po(x);
      return S.has(d) || (S.add(d), b.set(`${x.x}:${x.y}`, x)), b.size >= t || m >= y;
    };
    if (p.xx && p.yy)
      for (f = 0; f < r && !to(u[f], p.xx, p.yy, g); f++)
        ;
    return Array.from(b.values());
  }
}
function Ut(...e) {
  const t = e.join(" ");
  throw new Error(t);
}
function le(e) {
  return e ? Qr(e) ? !0 : Kr(e) ? !1 : e.length === 0 ? !0 : e.length > 0 : !1;
}
function Kr(e) {
  return e != null && e.toString === String.prototype.toString;
}
function Qr(e) {
  return Array.isArray(e);
}
function Hr(e, t) {
  le(e) || Ut("utils.sum() expects an array, received:", e);
  let n = 0, i;
  for (let o = 0, r = e.length; o < r; o++)
    i = e[o], i && (n += i);
  return n;
}
function Wr(e, t, n) {
  if (!le(e))
    throw new Error(`#forEach() takes an array-like argument. ${e}`);
  for (let i = 0, o = e.length; i < o; i++)
    t.call(n, e[i], i);
}
function Zr(e, t) {
  for (let n = 0, i = e.length; n < i; n++)
    e[n] = t;
  return e;
}
function to(e, t, n, i) {
  const o = e.length - 2;
  let r, s, a, l, f, h, c, u, p, y, m, S, b, g, x, d, _;
  for (fo(t, e), d = 0; d < o; ) {
    for (r = e[d], s = e[d + 1], f = t[r], h = t[s], p = n[r], y = n[s], _ = d; _ < o && (_ += 2, a = e[_], c = t[a], !(h < c)); ) {
      if (m = n[a], l = e[_ + 1], u = t[l], S = n[l], p >= m) {
        if (p > S && y > m && y > S) continue;
      } else if (p < S && y < m && y < S) continue;
      if (!(r == a || r == l || s == a || s == l) && (b = eo(
        f,
        p,
        h,
        y,
        c,
        m,
        u,
        S
      ), b && (g = [r, s], x = [a, l], i($n(b, g, x, t, n)) || b.length == 4 && i($n(b.slice(2), g, x, t, n)))))
        return !0;
    }
    d += 2;
  }
  return !1;
}
function eo(e, t, n, i, o, r, s, a) {
  const l = no(e, t, n, i, o, r, s, a);
  let f = null;
  return l && (f = io(e, t, n, i, o, r, s, a), f ? lo(e, t, n, i, o, r, s, a) && (f = null) : f = co(e, t, n, i, o, r, s, a)), f;
}
function no(e, t, n, i, o, r, s, a) {
  return oe(e, t, n, i, o, r) * oe(e, t, n, i, s, a) <= 0 && oe(o, r, s, a, e, t) * oe(o, r, s, a, n, i) <= 0;
}
function oe(e, t, n, i, o, r) {
  return ei(e - o, t - r, n - o, i - r);
}
function ei(e, t, n, i) {
  return e * i - t * n;
}
function io(e, t, n, i, o, r, s, a) {
  let l = Me(e, t, n, i, o, r, s, a), f;
  return l && (f = oo(l[0], l[1], e, t, n, i, o, r, s, a), f == 1 ? l = Me(n, i, e, t, o, r, s, a) : f == 2 ? l = Me(o, r, s, a, e, t, n, i) : f == 3 && (l = Me(s, a, o, r, e, t, n, i))), l && ao(l, e, t, n, i, o, r, s, a), l;
}
function Me(e, t, n, i, o, r, s, a) {
  const l = ei(n - e, i - t, s - o, a - r), f = 1e-18;
  let h;
  if (l === 0) return null;
  const c = oe(o, r, s, a, e, t) / l;
  return l <= f && l >= -f ? h = ro(e, t, n, i, o, r, s, a) : h = [e + c * (n - e), t + c * (i - t)], h;
}
function ro(e, t, n, i, o, r, s, a) {
  let l = null;
  return !Nt(e, o, s) && !Nt(t, r, a) ? l = [e, t] : !Nt(n, o, s) && !Nt(i, r, a) ? l = [n, i] : !Nt(o, e, n) && !Nt(r, t, i) ? l = [o, r] : !Nt(s, e, n) && !Nt(a, t, i) && (l = [s, a]), l;
}
function Nt(e, t, n) {
  let i;
  return t < n ? i = e < t || e > n : t > n ? i = e > t || e < n : i = e != t, i;
}
function oo(e, t, ...n) {
  let i = -1, o = 1 / 0, r;
  for (let s = 0, a = 0, l = n.length; a < l; s++, a += 2)
    r = so(e, t, n[a], n[a + 1]), r < o && (o = r, i = s);
  return i;
}
function so(e, t, n, i) {
  const o = e - n, r = t - i;
  return o * o + r * r;
}
function ao(e, t, n, i, o, r, s, a, l) {
  let f = e[0], h = e[1];
  f = Se(f, t, i), f = Se(f, r, a), h = Se(h, n, o), h = Se(h, s, l), e[0] = f, e[1] = h;
}
function Se(e, t, n) {
  let i;
  return Nt(e, t, n) && (i = Math.abs(e - t) < Math.abs(e - n) ? t : n, e = i), e;
}
function co(e, t, n, i, o, r, s, a) {
  const l = Math.min(e, n, o, s), f = Math.max(e, n, o, s), h = Math.min(t, i, r, a), c = Math.max(t, i, r, a), u = c - h > f - l;
  let p = [];
  return (u ? Yt(t, h, c) : Yt(e, l, f)) && p.push(e, t), (u ? Yt(i, h, c) : Yt(n, l, f)) && p.push(n, i), (u ? Yt(r, h, c) : Yt(o, l, f)) && p.push(o, r), (u ? Yt(a, h, c) : Yt(s, l, f)) && p.push(s, a), (p.length != 2 && p.length != 4 || p.length == 4 && p[0] == p[2] && p[1] == p[3]) && (p = null), p;
}
function lo(e, t, n, i, o, r, s, a) {
  return e == o && t == r || e == s && t == a || n == o && i == r || n == s && i == a;
}
function Yt(e, t, n) {
  return e > t && e < n;
}
function fo(e, t) {
  ho(e, t), ni(e, t, 0, t.length - 2);
}
function ho(e, t) {
  for (let n = 0, i = t.length; n < i; n += 2)
    e[t[n]] > e[t[n + 1]] && uo(t, n, n + 1);
}
function uo(e, t, n) {
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
    if (r - n < 40 ? Xn(e, t, n, r) : ni(e, t, n, r), i - o < 40) {
      Xn(e, t, o, i);
      return;
    }
    n = o, r = i;
  }
}
function Xn(e, t, n, i) {
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
  t = Rn(r, s, t[0], t[1], i, o), n = Rn(r, s, n[0], n[1], i, o);
  const a = t[0] < n[0] ? t : n, l = a == t ? n : t;
  return { x: r, y: s, a, b: l };
}
function Rn(e, t, n, i, o, r) {
  let s = n < i ? n : i, a = s === n ? i : n;
  return o[s] == e && r[s] == t ? a = s : o[a] == e && r[a] == t && (s = a), [s, a];
}
function po(e) {
  return `${e.a.join(",")};${e.b.join(",")}`;
}
class go {
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
function mo(e, t, n, i) {
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
    let r, s, a, l;
    if (arguments.length == 1)
      if (le(t)) {
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
function Yn(e, t, n) {
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
function ke(e, t = 1e-6) {
  const [n, i] = e[0], [o, r] = e[1], [s, a] = e[2];
  return Math.abs((o - n) * (a - i) - (s - n) * (r - i)) < t;
}
function wo(e, t) {
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
const yo = 10;
function vo(e, t, n, i, o, r) {
  if (!e && !t) return !1;
  const s = e ? 0 : 1, a = 1 - s, l = n[s], f = n[a];
  if (!l || !f) return !1;
  const h = xt(f.geom);
  let c = !1, u = !1;
  for (let p = 0; p <= 1; p++) {
    const y = i[p];
    if (!y) continue;
    const m = [String(y.prop.index), String(l.prop.index)].sort().join("-"), S = o[m];
    if (!S || S.length < 2) continue;
    const b = S.find(
      (P) => P.bakw !== r[s].bakw
    );
    if (!b) continue;
    const x = se(b.bakw).find(
      (P) => String(P.prop.index) !== String(y.prop.index) && String(P.prop.index) !== String(l.prop.index)
    );
    if (!x) continue;
    c = !0;
    const d = xt(x.geom), _ = xt(y.geom), w = xt(l.geom), k = w[0] - _[0], O = w[1] - _[1], A = k * (h[1] - _[1]) - O * (h[0] - _[0]), B = k * (d[1] - _[1]) - O * (d[0] - _[0]);
    if (A * B > 0) {
      u = !0;
      break;
    }
  }
  return c && !u;
}
function bo(e, t, n, i) {
  if (!e && !t) return !1;
  if (n[0] && n[1] && i[0] && i[1]) {
    const o = i.map((h) => xt(h.geom)), r = n.map((h) => xt(h.geom)), s = o[1][0] - o[0][0], a = o[1][1] - o[0][1], l = s * (r[0][1] - o[0][1]) - a * (r[0][0] - o[0][0]), f = s * (r[1][1] - o[0][1]) - a * (r[1][0] - o[0][0]);
    return l * f < 0;
  }
  return !1;
}
function xo(e, t, n, i) {
  const o = wo(n, i), r = /* @__PURE__ */ new Set();
  let s = !1;
  for (let a = 0; a < yo; a++) {
    let l = !1;
    for (const f of Object.keys(t)) {
      if (r.has(f)) continue;
      r.add(f);
      const h = t[f];
      if (!h || h.length < 2) continue;
      const c = f.split("-");
      if (c.length !== 2 || o.has(f)) continue;
      const u = se(h[0].bakw), p = se(h[1].bakw), y = se(h[0].forw), m = se(h[1].forw), S = c.map(
        (M) => u.find((T) => `${T.prop.index}` === M) || p.find((T) => `${T.prop.index}` === M)
      ), b = c.map(
        (M) => y.find((T) => `${T.prop.index}` === M) || m.find((T) => `${T.prop.index}` === M)
      );
      if (S.some((M) => !M) || b.some((M) => !M))
        continue;
      const g = [u, p].map(
        (M) => M.find((T) => !c.includes(`${T.prop.index}`))
      ), x = [y, m].map(
        (M) => M.find((T) => !c.includes(`${T.prop.index}`))
      );
      if (g.some((M) => !M) || x.some((M) => !M))
        continue;
      const d = h[0].bakw.geometry.coordinates[0].slice(0, 3).map((M) => xt(M)), _ = h[1].bakw.geometry.coordinates[0].slice(0, 3).map((M) => xt(M)), w = h[0].forw.geometry.coordinates[0].slice(0, 3).map((M) => xt(M)), k = h[1].forw.geometry.coordinates[0].slice(0, 3).map((M) => xt(M)), O = ke(d), A = ke(_), B = ke(w), P = ke(k), C = vo(
        O,
        A,
        g,
        S,
        t,
        h
      ), $ = bo(
        B,
        P,
        g,
        S
      );
      if (!(C || $ || Ln(
        xt(g[0].geom),
        _
      ) || Ln(
        xt(g[1].geom),
        d
      )))
        continue;
      const I = b.map(
        (M) => xt(M.geom)
      ), E = x.map(
        (M) => xt(M.geom)
      ), N = _o([
        ...I,
        ...E
      ]), D = Mo(N), X = Vn(
        I[0],
        I[1],
        E[0]
      ) + Vn(
        I[0],
        I[1],
        E[1]
      );
      Ge(D, X) && (Yn(t, h[0], e), Yn(t, h[1], e), S.forEach((M) => {
        if (!M) return;
        const T = [
          M.geom,
          g[0].geom,
          g[1].geom,
          M.geom
        ], F = {
          a: M.prop,
          b: g[0].prop,
          c: g[1].prop
        }, R = he([T], F), L = Hn(R);
        ii(t, {
          forw: L,
          bakw: R
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
function Ln(e, t) {
  const [n, i] = t[0], [o, r] = t[1], [s, a] = t[2], l = s - n, f = a - i, h = o - n, c = r - i, u = e[0] - n, p = e[1] - i, y = l * l + f * f, m = l * h + f * c, S = l * u + f * p, b = h * h + c * c, g = h * u + c * p, x = y * b - m * m;
  if (x === 0) return !1;
  const d = 1 / x, _ = (b * S - m * g) * d, w = (y * g - m * S) * d, k = 1e-9;
  return _ >= -k && w >= -k && _ + w <= 1 + k;
}
function _o(e) {
  const t = e.map((s) => s.slice()).filter(
    (s, a, l) => l.findIndex(
      (f) => Ge(f[0], s[0]) && Ge(f[1], s[1])
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
function Mo(e) {
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
      const l = t[a];
      l[0] < n && (n = l[0]), l[0] > i && (i = l[0]), l[1] < o && (o = l[1]), l[1] > r && (r = l[1]), s.push(l);
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
  calculateStrictTin(t = Fn) {
    const n = this.tins.forw.features.map(
      (s) => Hn(s)
    );
    this.tins.bakw = Mt(n);
    const i = {};
    this.tins.forw.features.forEach((s, a) => {
      const l = this.tins.bakw.features[a];
      ii(i, { forw: s, bakw: l });
    });
    const o = (this.pointsSet?.forw.features ?? []).map(
      (s) => s.properties.target.index
    );
    xo(
      this.tins,
      i,
      this.pointsSet?.edges || [],
      o
    );
    const r = ["forw", "bakw"].map((s) => {
      const a = this.tins[s].features.map(
        (l) => l.geometry.coordinates[0]
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
      if (So(r, this.points.length, o), s.length === 0 && a.length === 0) {
        n.push(r);
        continue;
      }
      s.unshift(this.points[r[0]][0]), s.push(this.points[r[1]][0]), a.unshift(this.points[r[0]][1]), a.push(this.points[r[1]][1]), Fr(s, a).map((l, f, h) => {
        this.edgeNodes[i] = [
          l[0],
          l[1]
        ];
        const c = ie(
          l[0],
          l[1],
          `e${i}`
        );
        i++, t.forw.push(c), t.bakw.push(re(c)), f === 0 ? n.push([r[0], t.forw.length - 1]) : n.push([
          t.forw.length - 2,
          t.forw.length - 1
        ]), f === h.length - 1 && n.push([t.forw.length - 1, r[1]]);
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
    if (!this.points.reduce((l, f) => l && (r ? Xe(f[0], r) : f[0][0] >= t && f[0][0] <= n && f[0][1] >= i && f[0][1] <= o), !0))
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
          (C) => Xe(C[0], B)
        )) throw "SOME POINTS OUTSIDE";
      }
      i = this.generatePointsSet(), { minx: o, maxx: r, miny: s, maxy: a } = this.computeGcpBbox();
    } else {
      const B = this.validateAndPrepareInputs();
      i = B.pointsSet, o = B.minx, r = B.maxx, s = B.miny, a = B.maxy;
    }
    const l = {
      forw: Mt(i.forw),
      bakw: Mt(i.bakw)
    }, f = _e(
      l.forw,
      i.edges,
      "target"
    ), h = _e(
      l.bakw,
      i.edges,
      "target"
    );
    if (f.features.length === 0 || h.features.length === 0)
      throw "TOO LINEAR1";
    const c = $i(l.forw), u = mn(l.forw);
    if (!u) throw "TOO LINEAR2";
    const p = {}, y = u.geometry.coordinates[0];
    let m;
    try {
      m = y.map((B) => ({
        forw: B,
        bakw: ne(Lt(B), f)
      })), m.forEach((B) => {
        p[`${B.forw[0]}:${B.forw[1]}`] = B;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const S = mn(l.bakw);
    if (!S) throw "TOO LINEAR2";
    const b = S.geometry.coordinates[0];
    try {
      m = b.map((B) => ({
        bakw: B,
        forw: ne(Lt(B), h)
      })), m.forEach((B) => {
        p[`${B.forw[0]}:${B.forw[1]}`] = B;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    let g;
    if (n) {
      const B = c.geometry.coordinates, P = f.features.find(
        (C) => Xe(
          Lt(B),
          C
        )
      );
      if (P) {
        const C = P.geometry.coordinates[0], $ = P.properties.a.geom, v = P.properties.b.geom, I = P.properties.c.geom;
        g = {
          forw: [
            (C[0][0] + C[1][0] + C[2][0]) / 3,
            (C[0][1] + C[1][1] + C[2][1]) / 3
          ],
          bakw: [
            ($[0] + v[0] + I[0]) / 3,
            ($[1] + v[1] + I[1]) / 3
          ]
        };
      } else
        g = {
          forw: B,
          bakw: ne(c, f)
        };
    } else
      g = {
        forw: c.geometry.coordinates,
        bakw: ne(c, f)
      };
    const x = ie(g.forw, g.bakw, "c");
    this.centroid = {
      forw: x,
      bakw: re(x)
    };
    const d = [
      ...this.points.map((B) => ({ forw: B[0], bakw: B[1] })),
      ...(this.edgeNodes ?? []).map((B) => ({ forw: B[0], bakw: B[1] }))
    ], _ = {
      convexBuf: p,
      centroid: g,
      allGcps: d,
      minx: o,
      maxx: r,
      miny: s,
      maxy: a
    }, w = this.vertexMode === lt.VERTEX_BIRDEYE ? Ur : jr, k = n ? Cr(_, w, i, this.points.length) : void 0, O = k?.vertices ?? w(_, !1), A = {
      forw: [],
      bakw: []
    };
    for (let B = 0; B < O.length; B++) {
      const P = O[B].forw, C = O[B].bakw, $ = ie(P, C, `b${B}`), v = re($);
      i.forw.push($), i.bakw.push(v), A.forw.push($), A.bakw.push(v);
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
      t === lt.MODE_AUTO ? 1 : Fn
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
function So(e, t, n) {
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
  ko as findIntersections,
  qn as format_version,
  ii as insertSearchIndex,
  Bn as vertexCalc
};
