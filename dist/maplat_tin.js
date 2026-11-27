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
function li(e) {
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
function fi(e) {
  return e.type === "Feature" ? e.geometry : e;
}
function Je(e, t, n) {
  if (e !== null)
    for (var i, o, r, s, a, l, f, h = 0, c = 0, u, p = e.type, v = p === "FeatureCollection", w = p === "Feature", S = v ? e.features.length : 1, _ = 0; _ < S; _++) {
      f = v ? (
        // @ts-expect-error: Known type conflict
        e.features[_].geometry
      ) : w ? (
        // @ts-expect-error: Known type conflict
        e.geometry
      ) : e, u = f ? f.type === "GeometryCollection" : !1, a = u ? f.geometries.length : 1;
      for (var g = 0; g < a; g++) {
        var b = 0, d = 0;
        if (s = u ? f.geometries[g] : f, s !== null) {
          l = s.coordinates;
          var y = s.type;
          switch (h = n && (y === "Polygon" || y === "MultiPolygon") ? 1 : 0, y) {
            case null:
              break;
            case "Point":
              if (
                // @ts-expect-error: Known type conflict
                t(
                  l,
                  c,
                  _,
                  b,
                  d
                ) === !1
              )
                return !1;
              c++, b++;
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
                    b,
                    d
                  ) === !1
                )
                  return !1;
                c++, y === "MultiPoint" && b++;
              }
              y === "LineString" && b++;
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
                      _,
                      b,
                      d
                    ) === !1
                  )
                    return !1;
                  c++;
                }
                y === "MultiLineString" && b++, y === "Polygon" && d++;
              }
              y === "Polygon" && b++;
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
                        _,
                        b,
                        d
                      ) === !1
                    )
                      return !1;
                    c++;
                  }
                  d++;
                }
                b++;
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
  let o, r, s, a, l, f, h, c, u, p, v;
  h = U * n, p = h - (h - n), v = n - p;
  let w = t[0];
  o = w * n, h = U * w, c = h - (h - w), u = w - c, s = u * v - (o - c * p - u * p - c * v);
  let S = 0;
  s !== 0 && (i[S++] = s);
  for (let _ = 1; _ < e; _++)
    w = t[_], a = w * n, h = U * w, c = h - (h - w), u = w - c, l = u * v - (a - c * p - u * p - c * v), r = o + l, f = r - o, s = o - (r - f) + (l - f), s !== 0 && (i[S++] = s), o = a + r, s = r - (o - a), s !== 0 && (i[S++] = s);
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
const hi = (3 + 16 * pt) * pt, ui = (2 + 12 * pt) * pt, di = (9 + 64 * pt) * pt * pt, zt = tt(4), tn = tt(8), en = tt(12), nn = tt(16), gt = tt(4);
function pi(e, t, n, i, o, r, s) {
  let a, l, f, h, c, u, p, v, w, S, _, g, b, d, y, m, k, O;
  const A = e - o, B = n - o, T = t - r, P = i - r;
  d = A * P, u = U * A, p = u - (u - A), v = A - p, u = U * P, w = u - (u - P), S = P - w, y = v * S - (d - p * w - v * w - p * S), m = T * B, u = U * T, p = u - (u - T), v = T - p, u = U * B, w = u - (u - B), S = B - w, k = v * S - (m - p * w - v * w - p * S), _ = y - k, c = y - _, zt[0] = y - (_ + c) + (c - k), g = d + _, c = g - d, b = d - (g - c) + (_ - c), _ = b - m, c = b - _, zt[1] = b - (_ + c) + (c - m), O = g + _, c = O - g, zt[2] = g - (O - c) + (_ - c), zt[3] = O;
  let D = zn(4, zt), x = ui * s;
  if (D >= x || -D >= x || (c = e - A, a = e - (A + c) + (c - o), c = n - B, f = n - (B + c) + (c - o), c = t - T, l = t - (T + c) + (c - r), c = i - P, h = i - (P + c) + (c - r), a === 0 && l === 0 && f === 0 && h === 0) || (x = di * s + Un * Math.abs(D), D += A * h + P * a - (T * f + B * l), D >= x || -D >= x)) return D;
  d = a * P, u = U * a, p = u - (u - a), v = a - p, u = U * P, w = u - (u - P), S = P - w, y = v * S - (d - p * w - v * w - p * S), m = l * B, u = U * l, p = u - (u - l), v = l - p, u = U * B, w = u - (u - B), S = B - w, k = v * S - (m - p * w - v * w - p * S), _ = y - k, c = y - _, gt[0] = y - (_ + c) + (c - k), g = d + _, c = g - d, b = d - (g - c) + (_ - c), _ = b - m, c = b - _, gt[1] = b - (_ + c) + (c - m), O = g + _, c = O - g, gt[2] = g - (O - c) + (_ - c), gt[3] = O;
  const I = ht(4, zt, 4, gt, tn);
  d = A * h, u = U * A, p = u - (u - A), v = A - p, u = U * h, w = u - (u - h), S = h - w, y = v * S - (d - p * w - v * w - p * S), m = T * f, u = U * T, p = u - (u - T), v = T - p, u = U * f, w = u - (u - f), S = f - w, k = v * S - (m - p * w - v * w - p * S), _ = y - k, c = y - _, gt[0] = y - (_ + c) + (c - k), g = d + _, c = g - d, b = d - (g - c) + (_ - c), _ = b - m, c = b - _, gt[1] = b - (_ + c) + (c - m), O = g + _, c = O - g, gt[2] = g - (O - c) + (_ - c), gt[3] = O;
  const E = ht(I, tn, 4, gt, en);
  d = a * h, u = U * a, p = u - (u - a), v = a - p, u = U * h, w = u - (u - h), S = h - w, y = v * S - (d - p * w - v * w - p * S), m = l * f, u = U * l, p = u - (u - l), v = l - p, u = U * f, w = u - (u - f), S = f - w, k = v * S - (m - p * w - v * w - p * S), _ = y - k, c = y - _, gt[0] = y - (_ + c) + (c - k), g = d + _, c = g - d, b = d - (g - c) + (_ - c), _ = b - m, c = b - _, gt[1] = b - (_ + c) + (c - m), O = g + _, c = O - g, gt[2] = g - (O - c) + (_ - c), gt[3] = O;
  const N = ht(E, en, 4, gt, nn);
  return nn[N - 1];
}
function kt(e, t, n, i, o, r) {
  const s = (t - r) * (n - o), a = (e - o) * (i - r), l = s - a, f = Math.abs(s + a);
  return Math.abs(l) >= hi * f ? l : -pi(e, t, n, i, o, r, f);
}
const gi = (10 + 96 * pt) * pt, mi = (4 + 48 * pt) * pt, wi = (44 + 576 * pt) * pt * pt, Dt = tt(4), Xt = tt(4), Rt = tt(4), At = tt(4), It = tt(4), Bt = tt(4), mt = tt(4), wt = tt(4), Oe = tt(8), Te = tt(8), Ne = tt(8), Pe = tt(8), Ce = tt(8), Fe = tt(8), pe = tt(8), ge = tt(8), me = tt(8), Vt = tt(4), jt = tt(4), qt = tt(4), z = tt(8), K = tt(16), nt = tt(16), it = tt(16), et = tt(32), $t = tt(32), at = tt(48), bt = tt(64);
let Ht = tt(1152), De = tt(1152);
function ct(e, t, n) {
  e = ht(e, Ht, t, n, De);
  const i = Ht;
  return Ht = De, De = i, e;
}
function yi(e, t, n, i, o, r, s, a, l) {
  let f, h, c, u, p, v, w, S, _, g, b, d, y, m, k, O, A, B, T, P, D, x, I, E, N, F, R, M, C, X, $, L, V, q, j;
  const J = e - s, G = n - s, H = o - s, Q = t - a, Z = i - a, W = r - a;
  $ = G * W, I = U * G, E = I - (I - G), N = G - E, I = U * W, F = I - (I - W), R = W - F, L = N * R - ($ - E * F - N * F - E * R), V = H * Z, I = U * H, E = I - (I - H), N = H - E, I = U * Z, F = I - (I - Z), R = Z - F, q = N * R - (V - E * F - N * F - E * R), M = L - q, x = L - M, Dt[0] = L - (M + x) + (x - q), C = $ + M, x = C - $, X = $ - (C - x) + (M - x), M = X - V, x = X - M, Dt[1] = X - (M + x) + (x - V), j = C + M, x = j - C, Dt[2] = C - (j - x) + (M - x), Dt[3] = j, $ = H * Q, I = U * H, E = I - (I - H), N = H - E, I = U * Q, F = I - (I - Q), R = Q - F, L = N * R - ($ - E * F - N * F - E * R), V = J * W, I = U * J, E = I - (I - J), N = J - E, I = U * W, F = I - (I - W), R = W - F, q = N * R - (V - E * F - N * F - E * R), M = L - q, x = L - M, Xt[0] = L - (M + x) + (x - q), C = $ + M, x = C - $, X = $ - (C - x) + (M - x), M = X - V, x = X - M, Xt[1] = X - (M + x) + (x - V), j = C + M, x = j - C, Xt[2] = C - (j - x) + (M - x), Xt[3] = j, $ = J * Z, I = U * J, E = I - (I - J), N = J - E, I = U * Z, F = I - (I - Z), R = Z - F, L = N * R - ($ - E * F - N * F - E * R), V = G * Q, I = U * G, E = I - (I - G), N = G - E, I = U * Q, F = I - (I - Q), R = Q - F, q = N * R - (V - E * F - N * F - E * R), M = L - q, x = L - M, Rt[0] = L - (M + x) + (x - q), C = $ + M, x = C - $, X = $ - (C - x) + (M - x), M = X - V, x = X - M, Rt[1] = X - (M + x) + (x - V), j = C + M, x = j - C, Rt[2] = C - (j - x) + (M - x), Rt[3] = j, f = ht(
    ht(
      ht(
        Y(Y(4, Dt, J, z), z, J, K),
        K,
        Y(Y(4, Dt, Q, z), z, Q, nt),
        nt,
        et
      ),
      et,
      ht(
        Y(Y(4, Xt, G, z), z, G, K),
        K,
        Y(Y(4, Xt, Z, z), z, Z, nt),
        nt,
        $t
      ),
      $t,
      bt
    ),
    bt,
    ht(
      Y(Y(4, Rt, H, z), z, H, K),
      K,
      Y(Y(4, Rt, W, z), z, W, nt),
      nt,
      et
    ),
    et,
    Ht
  );
  let st = zn(f, Ht), ft = mi * l;
  if (st >= ft || -st >= ft || (x = e - J, h = e - (J + x) + (x - s), x = t - Q, p = t - (Q + x) + (x - a), x = n - G, c = n - (G + x) + (x - s), x = i - Z, v = i - (Z + x) + (x - a), x = o - H, u = o - (H + x) + (x - s), x = r - W, w = r - (W + x) + (x - a), h === 0 && c === 0 && u === 0 && p === 0 && v === 0 && w === 0) || (ft = wi * l + Un * Math.abs(st), st += (J * J + Q * Q) * (G * w + W * c - (Z * u + H * v)) + 2 * (J * h + Q * p) * (G * W - Z * H) + ((G * G + Z * Z) * (H * p + Q * u - (W * h + J * w)) + 2 * (G * c + Z * v) * (H * Q - W * J)) + ((H * H + W * W) * (J * v + Z * h - (Q * c + G * p)) + 2 * (H * u + W * w) * (J * Z - Q * G)), st >= ft || -st >= ft))
    return st;
  if ((c !== 0 || v !== 0 || u !== 0 || w !== 0) && ($ = J * J, I = U * J, E = I - (I - J), N = J - E, L = N * N - ($ - E * E - (E + E) * N), V = Q * Q, I = U * Q, E = I - (I - Q), N = Q - E, q = N * N - (V - E * E - (E + E) * N), M = L + q, x = M - L, At[0] = L - (M - x) + (q - x), C = $ + M, x = C - $, X = $ - (C - x) + (M - x), M = X + V, x = M - X, At[1] = X - (M - x) + (V - x), j = C + M, x = j - C, At[2] = C - (j - x) + (M - x), At[3] = j), (u !== 0 || w !== 0 || h !== 0 || p !== 0) && ($ = G * G, I = U * G, E = I - (I - G), N = G - E, L = N * N - ($ - E * E - (E + E) * N), V = Z * Z, I = U * Z, E = I - (I - Z), N = Z - E, q = N * N - (V - E * E - (E + E) * N), M = L + q, x = M - L, It[0] = L - (M - x) + (q - x), C = $ + M, x = C - $, X = $ - (C - x) + (M - x), M = X + V, x = M - X, It[1] = X - (M - x) + (V - x), j = C + M, x = j - C, It[2] = C - (j - x) + (M - x), It[3] = j), (h !== 0 || p !== 0 || c !== 0 || v !== 0) && ($ = H * H, I = U * H, E = I - (I - H), N = H - E, L = N * N - ($ - E * E - (E + E) * N), V = W * W, I = U * W, E = I - (I - W), N = W - E, q = N * N - (V - E * E - (E + E) * N), M = L + q, x = M - L, Bt[0] = L - (M - x) + (q - x), C = $ + M, x = C - $, X = $ - (C - x) + (M - x), M = X + V, x = M - X, Bt[1] = X - (M - x) + (V - x), j = C + M, x = j - C, Bt[2] = C - (j - x) + (M - x), Bt[3] = j), h !== 0 && (S = Y(4, Dt, h, Oe), f = ct(f, St(
    Y(S, Oe, 2 * J, K),
    K,
    Y(Y(4, Bt, h, z), z, Z, nt),
    nt,
    Y(Y(4, It, h, z), z, -W, it),
    it,
    et,
    at
  ), at)), p !== 0 && (_ = Y(4, Dt, p, Te), f = ct(f, St(
    Y(_, Te, 2 * Q, K),
    K,
    Y(Y(4, It, p, z), z, H, nt),
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
    Y(Y(4, Bt, c, z), z, -Q, it),
    it,
    et,
    at
  ), at)), v !== 0 && (b = Y(4, Xt, v, Pe), f = ct(f, St(
    Y(b, Pe, 2 * Z, K),
    K,
    Y(Y(4, Bt, v, z), z, J, nt),
    nt,
    Y(Y(4, At, v, z), z, -H, it),
    it,
    et,
    at
  ), at)), u !== 0 && (d = Y(4, Rt, u, Ce), f = ct(f, St(
    Y(d, Ce, 2 * H, K),
    K,
    Y(Y(4, It, u, z), z, Q, nt),
    nt,
    Y(Y(4, At, u, z), z, -Z, it),
    it,
    et,
    at
  ), at)), w !== 0 && (y = Y(4, Rt, w, Fe), f = ct(f, St(
    Y(y, Fe, 2 * W, K),
    K,
    Y(Y(4, At, w, z), z, G, nt),
    nt,
    Y(Y(4, It, w, z), z, -J, it),
    it,
    et,
    at
  ), at)), h !== 0 || p !== 0) {
    if (c !== 0 || v !== 0 || u !== 0 || w !== 0 ? ($ = c * W, I = U * c, E = I - (I - c), N = c - E, I = U * W, F = I - (I - W), R = W - F, L = N * R - ($ - E * F - N * F - E * R), V = G * w, I = U * G, E = I - (I - G), N = G - E, I = U * w, F = I - (I - w), R = w - F, q = N * R - (V - E * F - N * F - E * R), M = L + q, x = M - L, mt[0] = L - (M - x) + (q - x), C = $ + M, x = C - $, X = $ - (C - x) + (M - x), M = X + V, x = M - X, mt[1] = X - (M - x) + (V - x), j = C + M, x = j - C, mt[2] = C - (j - x) + (M - x), mt[3] = j, $ = u * -Z, I = U * u, E = I - (I - u), N = u - E, I = U * -Z, F = I - (I - -Z), R = -Z - F, L = N * R - ($ - E * F - N * F - E * R), V = H * -v, I = U * H, E = I - (I - H), N = H - E, I = U * -v, F = I - (I - -v), R = -v - F, q = N * R - (V - E * F - N * F - E * R), M = L + q, x = M - L, wt[0] = L - (M - x) + (q - x), C = $ + M, x = C - $, X = $ - (C - x) + (M - x), M = X + V, x = M - X, wt[1] = X - (M - x) + (V - x), j = C + M, x = j - C, wt[2] = C - (j - x) + (M - x), wt[3] = j, k = ht(4, mt, 4, wt, ge), $ = c * w, I = U * c, E = I - (I - c), N = c - E, I = U * w, F = I - (I - w), R = w - F, L = N * R - ($ - E * F - N * F - E * R), V = u * v, I = U * u, E = I - (I - u), N = u - E, I = U * v, F = I - (I - v), R = v - F, q = N * R - (V - E * F - N * F - E * R), M = L - q, x = L - M, jt[0] = L - (M + x) + (x - q), C = $ + M, x = C - $, X = $ - (C - x) + (M - x), M = X - V, x = X - M, jt[1] = X - (M + x) + (x - V), j = C + M, x = j - C, jt[2] = C - (j - x) + (M - x), jt[3] = j, B = 4) : (ge[0] = 0, k = 1, jt[0] = 0, B = 1), h !== 0) {
      const rt = Y(k, ge, h, it);
      f = ct(f, ht(
        Y(S, Oe, h, K),
        K,
        Y(rt, it, 2 * J, et),
        et,
        at
      ), at);
      const ot = Y(B, jt, h, z);
      f = ct(f, St(
        Y(ot, z, 2 * J, K),
        K,
        Y(ot, z, h, nt),
        nt,
        Y(rt, it, h, et),
        et,
        $t,
        bt
      ), bt), v !== 0 && (f = ct(f, Y(Y(4, Bt, h, z), z, v, K), K)), w !== 0 && (f = ct(f, Y(Y(4, It, -h, z), z, w, K), K));
    }
    if (p !== 0) {
      const rt = Y(k, ge, p, it);
      f = ct(f, ht(
        Y(_, Te, p, K),
        K,
        Y(rt, it, 2 * Q, et),
        et,
        at
      ), at);
      const ot = Y(B, jt, p, z);
      f = ct(f, St(
        Y(ot, z, 2 * Q, K),
        K,
        Y(ot, z, p, nt),
        nt,
        Y(rt, it, p, et),
        et,
        $t,
        bt
      ), bt);
    }
  }
  if (c !== 0 || v !== 0) {
    if (u !== 0 || w !== 0 || h !== 0 || p !== 0 ? ($ = u * Q, I = U * u, E = I - (I - u), N = u - E, I = U * Q, F = I - (I - Q), R = Q - F, L = N * R - ($ - E * F - N * F - E * R), V = H * p, I = U * H, E = I - (I - H), N = H - E, I = U * p, F = I - (I - p), R = p - F, q = N * R - (V - E * F - N * F - E * R), M = L + q, x = M - L, mt[0] = L - (M - x) + (q - x), C = $ + M, x = C - $, X = $ - (C - x) + (M - x), M = X + V, x = M - X, mt[1] = X - (M - x) + (V - x), j = C + M, x = j - C, mt[2] = C - (j - x) + (M - x), mt[3] = j, P = -W, D = -w, $ = h * P, I = U * h, E = I - (I - h), N = h - E, I = U * P, F = I - (I - P), R = P - F, L = N * R - ($ - E * F - N * F - E * R), V = J * D, I = U * J, E = I - (I - J), N = J - E, I = U * D, F = I - (I - D), R = D - F, q = N * R - (V - E * F - N * F - E * R), M = L + q, x = M - L, wt[0] = L - (M - x) + (q - x), C = $ + M, x = C - $, X = $ - (C - x) + (M - x), M = X + V, x = M - X, wt[1] = X - (M - x) + (V - x), j = C + M, x = j - C, wt[2] = C - (j - x) + (M - x), wt[3] = j, O = ht(4, mt, 4, wt, me), $ = u * p, I = U * u, E = I - (I - u), N = u - E, I = U * p, F = I - (I - p), R = p - F, L = N * R - ($ - E * F - N * F - E * R), V = h * w, I = U * h, E = I - (I - h), N = h - E, I = U * w, F = I - (I - w), R = w - F, q = N * R - (V - E * F - N * F - E * R), M = L - q, x = L - M, qt[0] = L - (M + x) + (x - q), C = $ + M, x = C - $, X = $ - (C - x) + (M - x), M = X - V, x = X - M, qt[1] = X - (M + x) + (x - V), j = C + M, x = j - C, qt[2] = C - (j - x) + (M - x), qt[3] = j, T = 4) : (me[0] = 0, O = 1, qt[0] = 0, T = 1), c !== 0) {
      const rt = Y(O, me, c, it);
      f = ct(f, ht(
        Y(g, Ne, c, K),
        K,
        Y(rt, it, 2 * G, et),
        et,
        at
      ), at);
      const ot = Y(T, qt, c, z);
      f = ct(f, St(
        Y(ot, z, 2 * G, K),
        K,
        Y(ot, z, c, nt),
        nt,
        Y(rt, it, c, et),
        et,
        $t,
        bt
      ), bt), w !== 0 && (f = ct(f, Y(Y(4, At, c, z), z, w, K), K)), p !== 0 && (f = ct(f, Y(Y(4, Bt, -c, z), z, p, K), K));
    }
    if (v !== 0) {
      const rt = Y(O, me, v, it);
      f = ct(f, ht(
        Y(b, Pe, v, K),
        K,
        Y(rt, it, 2 * Z, et),
        et,
        at
      ), at);
      const ot = Y(T, qt, v, z);
      f = ct(f, St(
        Y(ot, z, 2 * Z, K),
        K,
        Y(ot, z, v, nt),
        nt,
        Y(rt, it, v, et),
        et,
        $t,
        bt
      ), bt);
    }
  }
  if (u !== 0 || w !== 0) {
    if (h !== 0 || p !== 0 || c !== 0 || v !== 0 ? ($ = h * Z, I = U * h, E = I - (I - h), N = h - E, I = U * Z, F = I - (I - Z), R = Z - F, L = N * R - ($ - E * F - N * F - E * R), V = J * v, I = U * J, E = I - (I - J), N = J - E, I = U * v, F = I - (I - v), R = v - F, q = N * R - (V - E * F - N * F - E * R), M = L + q, x = M - L, mt[0] = L - (M - x) + (q - x), C = $ + M, x = C - $, X = $ - (C - x) + (M - x), M = X + V, x = M - X, mt[1] = X - (M - x) + (V - x), j = C + M, x = j - C, mt[2] = C - (j - x) + (M - x), mt[3] = j, P = -Q, D = -p, $ = c * P, I = U * c, E = I - (I - c), N = c - E, I = U * P, F = I - (I - P), R = P - F, L = N * R - ($ - E * F - N * F - E * R), V = G * D, I = U * G, E = I - (I - G), N = G - E, I = U * D, F = I - (I - D), R = D - F, q = N * R - (V - E * F - N * F - E * R), M = L + q, x = M - L, wt[0] = L - (M - x) + (q - x), C = $ + M, x = C - $, X = $ - (C - x) + (M - x), M = X + V, x = M - X, wt[1] = X - (M - x) + (V - x), j = C + M, x = j - C, wt[2] = C - (j - x) + (M - x), wt[3] = j, m = ht(4, mt, 4, wt, pe), $ = h * v, I = U * h, E = I - (I - h), N = h - E, I = U * v, F = I - (I - v), R = v - F, L = N * R - ($ - E * F - N * F - E * R), V = c * p, I = U * c, E = I - (I - c), N = c - E, I = U * p, F = I - (I - p), R = p - F, q = N * R - (V - E * F - N * F - E * R), M = L - q, x = L - M, Vt[0] = L - (M + x) + (x - q), C = $ + M, x = C - $, X = $ - (C - x) + (M - x), M = X - V, x = X - M, Vt[1] = X - (M + x) + (x - V), j = C + M, x = j - C, Vt[2] = C - (j - x) + (M - x), Vt[3] = j, A = 4) : (pe[0] = 0, m = 1, Vt[0] = 0, A = 1), u !== 0) {
      const rt = Y(m, pe, u, it);
      f = ct(f, ht(
        Y(d, Ce, u, K),
        K,
        Y(rt, it, 2 * H, et),
        et,
        at
      ), at);
      const ot = Y(A, Vt, u, z);
      f = ct(f, St(
        Y(ot, z, 2 * H, K),
        K,
        Y(ot, z, u, nt),
        nt,
        Y(rt, it, u, et),
        et,
        $t,
        bt
      ), bt), p !== 0 && (f = ct(f, Y(Y(4, It, u, z), z, p, K), K)), v !== 0 && (f = ct(f, Y(Y(4, At, -u, z), z, v, K), K));
    }
    if (w !== 0) {
      const rt = Y(m, pe, w, it);
      f = ct(f, ht(
        Y(y, Fe, w, K),
        K,
        Y(rt, it, 2 * W, et),
        et,
        at
      ), at);
      const ot = Y(A, Vt, w, z);
      f = ct(f, St(
        Y(ot, z, 2 * W, K),
        K,
        Y(ot, z, w, nt),
        nt,
        Y(rt, it, w, et),
        et,
        $t,
        bt
      ), bt);
    }
  }
  return Ht[f - 1];
}
function vi(e, t, n, i, o, r, s, a) {
  const l = e - s, f = n - s, h = o - s, c = t - a, u = i - a, p = r - a, v = f * p, w = h * u, S = l * l + c * c, _ = h * c, g = l * p, b = f * f + u * u, d = l * u, y = f * c, m = h * h + p * p, k = S * (v - w) + b * (_ - g) + m * (d - y), O = (Math.abs(v) + Math.abs(w)) * S + (Math.abs(_) + Math.abs(g)) * b + (Math.abs(d) + Math.abs(y)) * m, A = gi * O;
  return k > A || -k > A ? k : yi(e, t, n, i, o, r, s, a, O);
}
function bi(e, t) {
  var n, i, o = 0, r, s, a, l, f, h, c, u = e[0], p = e[1], v = t.length;
  for (n = 0; n < v; n++) {
    i = 0;
    var w = t[n], S = w.length - 1;
    if (h = w[0], h[0] !== w[S][0] && h[1] !== w[S][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (s = h[0] - u, a = h[1] - p, i; i < S; i++) {
      if (c = w[i + 1], l = c[0] - u, f = c[1] - p, a === 0 && f === 0) {
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
  const i = li(e), o = fi(t), r = o.type, s = t.bbox;
  let a = o.coordinates;
  if (s && xi(i, s) === !1)
    return !1;
  r === "Polygon" && (a = [a]);
  for (var l = 0; l < a.length; ++l) {
    const f = bi(i, a[l]);
    if (f === 0 && !n.ignoreBoundary) return !0;
    if (f) return !0;
  }
  return !1;
}
function xi(e, t) {
  return t[0] <= e[0] && t[1] <= e[1] && t[2] >= e[0] && t[3] >= e[1];
}
class Ke {
  constructor(t = [], n = _i) {
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
function _i(e, t) {
  return e < t ? -1 : e > t ? 1 : 0;
}
const Mi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ke
}, Symbol.toStringTag, { value: "Module" })), Pt = 11102230246251565e-32, ut = 134217729, Si = (3 + 8 * Pt) * Pt;
function Re(e, t, n, i, o) {
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
function ki(e, t) {
  let n = t[0];
  for (let i = 1; i < e; i++) n += t[i];
  return n;
}
function ue(e) {
  return new Float64Array(e);
}
const Ei = (3 + 16 * Pt) * Pt, Ai = (2 + 12 * Pt) * Pt, Ii = (9 + 64 * Pt) * Pt * Pt, Gt = ue(4), rn = ue(8), on = ue(12), sn = ue(16), yt = ue(4);
function Bi(e, t, n, i, o, r, s) {
  let a, l, f, h, c, u, p, v, w, S, _, g, b, d, y, m, k, O;
  const A = e - o, B = n - o, T = t - r, P = i - r;
  d = A * P, u = ut * A, p = u - (u - A), v = A - p, u = ut * P, w = u - (u - P), S = P - w, y = v * S - (d - p * w - v * w - p * S), m = T * B, u = ut * T, p = u - (u - T), v = T - p, u = ut * B, w = u - (u - B), S = B - w, k = v * S - (m - p * w - v * w - p * S), _ = y - k, c = y - _, Gt[0] = y - (_ + c) + (c - k), g = d + _, c = g - d, b = d - (g - c) + (_ - c), _ = b - m, c = b - _, Gt[1] = b - (_ + c) + (c - m), O = g + _, c = O - g, Gt[2] = g - (O - c) + (_ - c), Gt[3] = O;
  let D = ki(4, Gt), x = Ai * s;
  if (D >= x || -D >= x || (c = e - A, a = e - (A + c) + (c - o), c = n - B, f = n - (B + c) + (c - o), c = t - T, l = t - (T + c) + (c - r), c = i - P, h = i - (P + c) + (c - r), a === 0 && l === 0 && f === 0 && h === 0) || (x = Ii * s + Si * Math.abs(D), D += A * h + P * a - (T * f + B * l), D >= x || -D >= x)) return D;
  d = a * P, u = ut * a, p = u - (u - a), v = a - p, u = ut * P, w = u - (u - P), S = P - w, y = v * S - (d - p * w - v * w - p * S), m = l * B, u = ut * l, p = u - (u - l), v = l - p, u = ut * B, w = u - (u - B), S = B - w, k = v * S - (m - p * w - v * w - p * S), _ = y - k, c = y - _, yt[0] = y - (_ + c) + (c - k), g = d + _, c = g - d, b = d - (g - c) + (_ - c), _ = b - m, c = b - _, yt[1] = b - (_ + c) + (c - m), O = g + _, c = O - g, yt[2] = g - (O - c) + (_ - c), yt[3] = O;
  const I = Re(4, Gt, 4, yt, rn);
  d = A * h, u = ut * A, p = u - (u - A), v = A - p, u = ut * h, w = u - (u - h), S = h - w, y = v * S - (d - p * w - v * w - p * S), m = T * f, u = ut * T, p = u - (u - T), v = T - p, u = ut * f, w = u - (u - f), S = f - w, k = v * S - (m - p * w - v * w - p * S), _ = y - k, c = y - _, yt[0] = y - (_ + c) + (c - k), g = d + _, c = g - d, b = d - (g - c) + (_ - c), _ = b - m, c = b - _, yt[1] = b - (_ + c) + (c - m), O = g + _, c = O - g, yt[2] = g - (O - c) + (_ - c), yt[3] = O;
  const E = Re(I, rn, 4, yt, on);
  d = a * h, u = ut * a, p = u - (u - a), v = a - p, u = ut * h, w = u - (u - h), S = h - w, y = v * S - (d - p * w - v * w - p * S), m = l * f, u = ut * l, p = u - (u - l), v = l - p, u = ut * f, w = u - (u - f), S = f - w, k = v * S - (m - p * w - v * w - p * S), _ = y - k, c = y - _, yt[0] = y - (_ + c) + (c - k), g = d + _, c = g - d, b = d - (g - c) + (_ - c), _ = b - m, c = b - _, yt[1] = b - (_ + c) + (c - m), O = g + _, c = O - g, yt[2] = g - (O - c) + (_ - c), yt[3] = O;
  const N = Re(E, on, 4, yt, sn);
  return sn[N - 1];
}
function an(e, t, n, i, o, r) {
  const s = (t - r) * (n - o), a = (e - o) * (i - r), l = s - a;
  if (s === 0 || a === 0 || s > 0 != a > 0) return l;
  const f = Math.abs(s + a);
  return Math.abs(l) >= Ei * f ? l : -Bi(e, t, n, i, o, r, f);
}
function Oi(e, t) {
  const n = new Ke([], Gn);
  return Ni(e, n), Pi(n, t);
}
function Gn(e, t) {
  return e.p.x > t.p.x ? 1 : e.p.x < t.p.x || e.p.x === t.p.x && (e.featureId !== t.featureId || e.ringId !== t.ringId) && e.isLeftEndpoint && !t.isLeftEndpoint ? -1 : e.p.y !== t.p.y ? e.p.y > t.p.y ? 1 : -1 : 1;
}
function Ti(e, t) {
  return e.rightSweepEvent.p.x > t.rightSweepEvent.p.x ? 1 : e.rightSweepEvent.p.x < t.rightSweepEvent.p.x ? -1 : e.rightSweepEvent.p.y !== t.rightSweepEvent.p.y ? e.rightSweepEvent.p.y < t.rightSweepEvent.p.y ? 1 : -1 : 1;
}
function Ni(e, t) {
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
function Pi(e, t = !1) {
  const n = [], i = new Ke([], Ti);
  for (; e.length; ) {
    const o = e.pop();
    if (o.isLeftEndpoint) {
      const r = new Ci(o);
      for (let s = 0; s < i.data.length; s++) {
        const a = i.data[s];
        if (t && a.leftSweepEvent.featureId === o.featureId)
          continue;
        const l = Fi(r, a);
        l !== !1 && n.push(l);
      }
      i.push(r);
    } else o.isLeftEndpoint === !1 && i.pop();
  }
  return n;
}
var Ci = class {
  /** @param event must have otherEvent non-null */
  constructor(e) {
    this.leftSweepEvent = e, this.rightSweepEvent = e.otherEvent;
  }
};
function Fi(e, t) {
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
  const u = (f - a) * (o - n) - (l - s) * (r - i), p = (l - s) * (i - a) - (f - a) * (n - s), v = (o - n) * (i - a) - (r - i) * (n - s);
  if (u === 0)
    return !1;
  const w = p / u, S = v / u;
  if (w >= 0 && w <= 1 && S >= 0 && S <= 1) {
    const _ = n + w * (o - n), g = i + w * (r - i);
    return [_, g];
  }
  return !1;
}
function Di(e, t, n = {}) {
  const { removeDuplicates: i = !0, ignoreSelfIntersections: o = !0 } = n;
  let r = [];
  e.type === "FeatureCollection" ? r = r.concat(e.features) : e.type === "Feature" ? r.push(e) : (e.type === "LineString" || e.type === "Polygon" || e.type === "MultiLineString" || e.type === "MultiPolygon") && r.push(ae(e)), t.type === "FeatureCollection" ? r = r.concat(t.features) : t.type === "Feature" ? r.push(t) : (t.type === "LineString" || t.type === "Polygon" || t.type === "MultiLineString" || t.type === "MultiPolygon") && r.push(ae(t));
  const s = Oi(
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
function Xi(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function Ri(e) {
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
function Li() {
  return fn || (fn = 1, (function(e, t) {
    (function(n, i) {
      e.exports = i();
    })(Yi, function() {
      function n(g, b, d, y, m) {
        (function k(O, A, B, T, P) {
          for (; T > B; ) {
            if (T - B > 600) {
              var D = T - B + 1, x = A - B + 1, I = Math.log(D), E = 0.5 * Math.exp(2 * I / 3), N = 0.5 * Math.sqrt(I * E * (D - E) / D) * (x - D / 2 < 0 ? -1 : 1), F = Math.max(B, Math.floor(A - x * E / D + N)), R = Math.min(T, Math.floor(A + (D - x) * E / D + N));
              k(O, A, F, R, P);
            }
            var M = O[A], C = B, X = T;
            for (i(O, B, A), P(O[T], M) > 0 && i(O, B, T); C < X; ) {
              for (i(O, C, X), C++, X--; P(O[C], M) < 0; ) C++;
              for (; P(O[X], M) > 0; ) X--;
            }
            P(O[B], M) === 0 ? i(O, B, X) : i(O, ++X, T), X <= A && (B = X + 1), A <= X && (T = X - 1);
          }
        })(g, b, d || 0, y || g.length - 1, m || o);
      }
      function i(g, b, d) {
        var y = g[b];
        g[b] = g[d], g[d] = y;
      }
      function o(g, b) {
        return g < b ? -1 : g > b ? 1 : 0;
      }
      var r = function(g) {
        g === void 0 && (g = 9), this._maxEntries = Math.max(4, g), this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries)), this.clear();
      };
      function s(g, b, d) {
        if (!d) return b.indexOf(g);
        for (var y = 0; y < b.length; y++) if (d(g, b[y])) return y;
        return -1;
      }
      function a(g, b) {
        l(g, 0, g.children.length, b, g);
      }
      function l(g, b, d, y, m) {
        m || (m = S(null)), m.minX = 1 / 0, m.minY = 1 / 0, m.maxX = -1 / 0, m.maxY = -1 / 0;
        for (var k = b; k < d; k++) {
          var O = g.children[k];
          f(m, g.leaf ? y(O) : O);
        }
        return m;
      }
      function f(g, b) {
        return g.minX = Math.min(g.minX, b.minX), g.minY = Math.min(g.minY, b.minY), g.maxX = Math.max(g.maxX, b.maxX), g.maxY = Math.max(g.maxY, b.maxY), g;
      }
      function h(g, b) {
        return g.minX - b.minX;
      }
      function c(g, b) {
        return g.minY - b.minY;
      }
      function u(g) {
        return (g.maxX - g.minX) * (g.maxY - g.minY);
      }
      function p(g) {
        return g.maxX - g.minX + (g.maxY - g.minY);
      }
      function v(g, b) {
        return g.minX <= b.minX && g.minY <= b.minY && b.maxX <= g.maxX && b.maxY <= g.maxY;
      }
      function w(g, b) {
        return b.minX <= g.maxX && b.minY <= g.maxY && b.maxX >= g.minX && b.maxY >= g.minY;
      }
      function S(g) {
        return { children: g, height: 1, leaf: !0, minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
      }
      function _(g, b, d, y, m) {
        for (var k = [b, d]; k.length; ) if (!((d = k.pop()) - (b = k.pop()) <= y)) {
          var O = b + Math.ceil((d - b) / y / 2) * y;
          n(g, O, b, d, m), k.push(b, O, O, d);
        }
      }
      return r.prototype.all = function() {
        return this._all(this.data, []);
      }, r.prototype.search = function(g) {
        var b = this.data, d = [];
        if (!w(g, b)) return d;
        for (var y = this.toBBox, m = []; b; ) {
          for (var k = 0; k < b.children.length; k++) {
            var O = b.children[k], A = b.leaf ? y(O) : O;
            w(g, A) && (b.leaf ? d.push(O) : v(g, A) ? this._all(O, d) : m.push(O));
          }
          b = m.pop();
        }
        return d;
      }, r.prototype.collides = function(g) {
        var b = this.data;
        if (!w(g, b)) return !1;
        for (var d = []; b; ) {
          for (var y = 0; y < b.children.length; y++) {
            var m = b.children[y], k = b.leaf ? this.toBBox(m) : m;
            if (w(g, k)) {
              if (b.leaf || v(g, k)) return !0;
              d.push(m);
            }
          }
          b = d.pop();
        }
        return !1;
      }, r.prototype.load = function(g) {
        if (!g || !g.length) return this;
        if (g.length < this._minEntries) {
          for (var b = 0; b < g.length; b++) this.insert(g[b]);
          return this;
        }
        var d = this._build(g.slice(), 0, g.length - 1, 0);
        if (this.data.children.length) if (this.data.height === d.height) this._splitRoot(this.data, d);
        else {
          if (this.data.height < d.height) {
            var y = this.data;
            this.data = d, d = y;
          }
          this._insert(d, this.data.height - d.height - 1, !0);
        }
        else this.data = d;
        return this;
      }, r.prototype.insert = function(g) {
        return g && this._insert(g, this.data.height - 1), this;
      }, r.prototype.clear = function() {
        return this.data = S([]), this;
      }, r.prototype.remove = function(g, b) {
        if (!g) return this;
        for (var d, y, m, k = this.data, O = this.toBBox(g), A = [], B = []; k || A.length; ) {
          if (k || (k = A.pop(), y = A[A.length - 1], d = B.pop(), m = !0), k.leaf) {
            var T = s(g, k.children, b);
            if (T !== -1) return k.children.splice(T, 1), A.push(k), this._condense(A), this;
          }
          m || k.leaf || !v(k, O) ? y ? (d++, k = y.children[d], m = !1) : k = null : (A.push(k), B.push(d), d = 0, y = k, k = k.children[0]);
        }
        return this;
      }, r.prototype.toBBox = function(g) {
        return g;
      }, r.prototype.compareMinX = function(g, b) {
        return g.minX - b.minX;
      }, r.prototype.compareMinY = function(g, b) {
        return g.minY - b.minY;
      }, r.prototype.toJSON = function() {
        return this.data;
      }, r.prototype.fromJSON = function(g) {
        return this.data = g, this;
      }, r.prototype._all = function(g, b) {
        for (var d = []; g; ) g.leaf ? b.push.apply(b, g.children) : d.push.apply(d, g.children), g = d.pop();
        return b;
      }, r.prototype._build = function(g, b, d, y) {
        var m, k = d - b + 1, O = this._maxEntries;
        if (k <= O) return a(m = S(g.slice(b, d + 1)), this.toBBox), m;
        y || (y = Math.ceil(Math.log(k) / Math.log(O)), O = Math.ceil(k / Math.pow(O, y - 1))), (m = S([])).leaf = !1, m.height = y;
        var A = Math.ceil(k / O), B = A * Math.ceil(Math.sqrt(O));
        _(g, b, d, B, this.compareMinX);
        for (var T = b; T <= d; T += B) {
          var P = Math.min(T + B - 1, d);
          _(g, T, P, A, this.compareMinY);
          for (var D = T; D <= P; D += A) {
            var x = Math.min(D + A - 1, P);
            m.children.push(this._build(g, D, x, y - 1));
          }
        }
        return a(m, this.toBBox), m;
      }, r.prototype._chooseSubtree = function(g, b, d, y) {
        for (; y.push(b), !b.leaf && y.length - 1 !== d; ) {
          for (var m = 1 / 0, k = 1 / 0, O = void 0, A = 0; A < b.children.length; A++) {
            var B = b.children[A], T = u(B), P = (D = g, x = B, (Math.max(x.maxX, D.maxX) - Math.min(x.minX, D.minX)) * (Math.max(x.maxY, D.maxY) - Math.min(x.minY, D.minY)) - T);
            P < k ? (k = P, m = T < m ? T : m, O = B) : P === k && T < m && (m = T, O = B);
          }
          b = O || b.children[0];
        }
        var D, x;
        return b;
      }, r.prototype._insert = function(g, b, d) {
        var y = d ? g : this.toBBox(g), m = [], k = this._chooseSubtree(y, this.data, b, m);
        for (k.children.push(g), f(k, y); b >= 0 && m[b].children.length > this._maxEntries; ) this._split(m, b), b--;
        this._adjustParentBBoxes(y, m, b);
      }, r.prototype._split = function(g, b) {
        var d = g[b], y = d.children.length, m = this._minEntries;
        this._chooseSplitAxis(d, m, y);
        var k = this._chooseSplitIndex(d, m, y), O = S(d.children.splice(k, d.children.length - k));
        O.height = d.height, O.leaf = d.leaf, a(d, this.toBBox), a(O, this.toBBox), b ? g[b - 1].children.push(O) : this._splitRoot(d, O);
      }, r.prototype._splitRoot = function(g, b) {
        this.data = S([g, b]), this.data.height = g.height + 1, this.data.leaf = !1, a(this.data, this.toBBox);
      }, r.prototype._chooseSplitIndex = function(g, b, d) {
        for (var y, m, k, O, A, B, T, P = 1 / 0, D = 1 / 0, x = b; x <= d - b; x++) {
          var I = l(g, 0, x, this.toBBox), E = l(g, x, d, this.toBBox), N = (m = I, k = E, O = void 0, A = void 0, B = void 0, T = void 0, O = Math.max(m.minX, k.minX), A = Math.max(m.minY, k.minY), B = Math.min(m.maxX, k.maxX), T = Math.min(m.maxY, k.maxY), Math.max(0, B - O) * Math.max(0, T - A)), F = u(I) + u(E);
          N < P ? (P = N, y = x, D = F < D ? F : D) : N === P && F < D && (D = F, y = x);
        }
        return y || d - b;
      }, r.prototype._chooseSplitAxis = function(g, b, d) {
        var y = g.leaf ? this.compareMinX : h, m = g.leaf ? this.compareMinY : c;
        this._allDistMargin(g, b, d, y) < this._allDistMargin(g, b, d, m) && g.children.sort(y);
      }, r.prototype._allDistMargin = function(g, b, d, y) {
        g.children.sort(y);
        for (var m = this.toBBox, k = l(g, 0, b, m), O = l(g, d - b, d, m), A = p(k) + p(O), B = b; B < d - b; B++) {
          var T = g.children[B];
          f(k, g.leaf ? m(T) : T), A += p(k);
        }
        for (var P = d - b - 1; P >= b; P--) {
          var D = g.children[P];
          f(O, g.leaf ? m(D) : D), A += p(O);
        }
        return A;
      }, r.prototype._adjustParentBBoxes = function(g, b, d) {
        for (var y = d; y >= 0; y--) f(b[y], g);
      }, r.prototype._condense = function(g) {
        for (var b = g.length - 1, d = void 0; b >= 0; b--) g[b].children.length === 0 ? b > 0 ? (d = g[b - 1].children).splice(d.indexOf(g[b]), 1) : this.clear() : a(g[b], this.toBBox);
      }, r;
    });
  })(Ee)), Ee.exports;
}
const Vi = /* @__PURE__ */ Ri(Mi);
var Zt = { exports: {} }, $e, hn;
function ji() {
  return hn || (hn = 1, $e = function(t, n, i, o) {
    var r = t[0], s = t[1], a = !1;
    i === void 0 && (i = 0), o === void 0 && (o = n.length);
    for (var l = (o - i) / 2, f = 0, h = l - 1; f < l; h = f++) {
      var c = n[i + f * 2 + 0], u = n[i + f * 2 + 1], p = n[i + h * 2 + 0], v = n[i + h * 2 + 1], w = u > s != v > s && r < (p - c) * (s - u) / (v - u) + c;
      w && (a = !a);
    }
    return a;
  }), $e;
}
var Ye, un;
function qi() {
  return un || (un = 1, Ye = function(t, n, i, o) {
    var r = t[0], s = t[1], a = !1;
    i === void 0 && (i = 0), o === void 0 && (o = n.length);
    for (var l = o - i, f = 0, h = l - 1; f < l; h = f++) {
      var c = n[f + i][0], u = n[f + i][1], p = n[h + i][0], v = n[h + i][1], w = u > s != v > s && r < (p - c) * (s - u) / (v - u) + c;
      w && (a = !a);
    }
    return a;
  }), Ye;
}
var dn;
function Ui() {
  if (dn) return Zt.exports;
  dn = 1;
  var e = ji(), t = qi();
  return Zt.exports = function(i, o, r, s) {
    return o.length > 0 && Array.isArray(o[0]) ? t(i, o, r, s) : e(i, o, r, s);
  }, Zt.exports.nested = t, Zt.exports.flat = e, Zt.exports;
}
var ee = { exports: {} }, zi = ee.exports, pn;
function Gi() {
  return pn || (pn = 1, (function(e, t) {
    (function(n, i) {
      i(t);
    })(zi, function(n) {
      const o = 33306690738754706e-32;
      function r(w, S, _, g, b) {
        let d, y, m, k, O = S[0], A = g[0], B = 0, T = 0;
        A > O == A > -O ? (d = O, O = S[++B]) : (d = A, A = g[++T]);
        let P = 0;
        if (B < w && T < _) for (A > O == A > -O ? (m = d - ((y = O + d) - O), O = S[++B]) : (m = d - ((y = A + d) - A), A = g[++T]), d = y, m !== 0 && (b[P++] = m); B < w && T < _; ) A > O == A > -O ? (m = d - ((y = d + O) - (k = y - d)) + (O - k), O = S[++B]) : (m = d - ((y = d + A) - (k = y - d)) + (A - k), A = g[++T]), d = y, m !== 0 && (b[P++] = m);
        for (; B < w; ) m = d - ((y = d + O) - (k = y - d)) + (O - k), O = S[++B], d = y, m !== 0 && (b[P++] = m);
        for (; T < _; ) m = d - ((y = d + A) - (k = y - d)) + (A - k), A = g[++T], d = y, m !== 0 && (b[P++] = m);
        return d === 0 && P !== 0 || (b[P++] = d), P;
      }
      function s(w) {
        return new Float64Array(w);
      }
      const a = 33306690738754716e-32, l = 22204460492503146e-32, f = 11093356479670487e-47, h = s(4), c = s(8), u = s(12), p = s(16), v = s(4);
      n.orient2d = function(w, S, _, g, b, d) {
        const y = (S - d) * (_ - b), m = (w - b) * (g - d), k = y - m;
        if (y === 0 || m === 0 || y > 0 != m > 0) return k;
        const O = Math.abs(y + m);
        return Math.abs(k) >= a * O ? k : -(function(A, B, T, P, D, x, I) {
          let E, N, F, R, M, C, X, $, L, V, q, j, J, G, H, Q, Z, W;
          const st = A - D, ft = T - D, rt = B - x, ot = P - x;
          M = (H = ($ = st - (X = (C = 134217729 * st) - (C - st))) * (V = ot - (L = (C = 134217729 * ot) - (C - ot))) - ((G = st * ot) - X * L - $ * L - X * V)) - (q = H - (Z = ($ = rt - (X = (C = 134217729 * rt) - (C - rt))) * (V = ft - (L = (C = 134217729 * ft) - (C - ft))) - ((Q = rt * ft) - X * L - $ * L - X * V))), h[0] = H - (q + M) + (M - Z), M = (J = G - ((j = G + q) - (M = j - G)) + (q - M)) - (q = J - Q), h[1] = J - (q + M) + (M - Q), M = (W = j + q) - j, h[2] = j - (W - M) + (q - M), h[3] = W;
          let Ft = (function(ci, He) {
            let Qe = He[0];
            for (let Be = 1; Be < ci; Be++) Qe += He[Be];
            return Qe;
          })(4, h), Wt = l * I;
          if (Ft >= Wt || -Ft >= Wt || (E = A - (st + (M = A - st)) + (M - D), F = T - (ft + (M = T - ft)) + (M - D), N = B - (rt + (M = B - rt)) + (M - x), R = P - (ot + (M = P - ot)) + (M - x), E === 0 && N === 0 && F === 0 && R === 0) || (Wt = f * I + o * Math.abs(Ft), (Ft += st * R + ot * E - (rt * F + ft * N)) >= Wt || -Ft >= Wt)) return Ft;
          M = (H = ($ = E - (X = (C = 134217729 * E) - (C - E))) * (V = ot - (L = (C = 134217729 * ot) - (C - ot))) - ((G = E * ot) - X * L - $ * L - X * V)) - (q = H - (Z = ($ = N - (X = (C = 134217729 * N) - (C - N))) * (V = ft - (L = (C = 134217729 * ft) - (C - ft))) - ((Q = N * ft) - X * L - $ * L - X * V))), v[0] = H - (q + M) + (M - Z), M = (J = G - ((j = G + q) - (M = j - G)) + (q - M)) - (q = J - Q), v[1] = J - (q + M) + (M - Q), M = (W = j + q) - j, v[2] = j - (W - M) + (q - M), v[3] = W;
          const oi = r(4, h, 4, v, c);
          M = (H = ($ = st - (X = (C = 134217729 * st) - (C - st))) * (V = R - (L = (C = 134217729 * R) - (C - R))) - ((G = st * R) - X * L - $ * L - X * V)) - (q = H - (Z = ($ = rt - (X = (C = 134217729 * rt) - (C - rt))) * (V = F - (L = (C = 134217729 * F) - (C - F))) - ((Q = rt * F) - X * L - $ * L - X * V))), v[0] = H - (q + M) + (M - Z), M = (J = G - ((j = G + q) - (M = j - G)) + (q - M)) - (q = J - Q), v[1] = J - (q + M) + (M - Q), M = (W = j + q) - j, v[2] = j - (W - M) + (q - M), v[3] = W;
          const si = r(oi, c, 4, v, u);
          M = (H = ($ = E - (X = (C = 134217729 * E) - (C - E))) * (V = R - (L = (C = 134217729 * R) - (C - R))) - ((G = E * R) - X * L - $ * L - X * V)) - (q = H - (Z = ($ = N - (X = (C = 134217729 * N) - (C - N))) * (V = F - (L = (C = 134217729 * F) - (C - F))) - ((Q = N * F) - X * L - $ * L - X * V))), v[0] = H - (q + M) + (M - Z), M = (J = G - ((j = G + q) - (M = j - G)) + (q - M)) - (q = J - Q), v[1] = J - (q + M) + (M - Q), M = (W = j + q) - j, v[2] = j - (W - M) + (q - M), v[3] = W;
          const ai = r(si, u, 4, v, p);
          return p[ai - 1];
        })(w, S, _, g, b, d, O);
      }, n.orient2dfast = function(w, S, _, g, b, d) {
        return (S - d) * (_ - b) - (w - b) * (g - d);
      }, Object.defineProperty(n, "__esModule", { value: !0 });
    });
  })(ee, ee.exports)), ee.exports;
}
var gn;
function Ji() {
  if (gn) return be.exports;
  gn = 1;
  var e = Li(), t = Vi, n = Ui(), i = Gi().orient2d;
  t.default && (t = t.default), be.exports = o, be.exports.default = o;
  function o(d, y, m) {
    y = Math.max(0, y === void 0 ? 2 : y), m = m || 0;
    var k = p(d), O = new e(16);
    O.toBBox = function(X) {
      return {
        minX: X[0],
        minY: X[1],
        maxX: X[0],
        maxY: X[1]
      };
    }, O.compareMinX = function(X, $) {
      return X[0] - $[0];
    }, O.compareMinY = function(X, $) {
      return X[1] - $[1];
    }, O.load(d);
    for (var A = [], B = 0, T; B < k.length; B++) {
      var P = k[B];
      O.remove(P), T = v(P, T), A.push(T);
    }
    var D = new e(16);
    for (B = 0; B < A.length; B++) D.insert(u(A[B]));
    for (var x = y * y, I = m * m; A.length; ) {
      var E = A.shift(), N = E.p, F = E.next.p, R = w(N, F);
      if (!(R < I)) {
        var M = R / x;
        P = r(O, E.prev.p, N, F, E.next.next.p, M, D), P && Math.min(w(P, N), w(P, F)) <= M && (A.push(E), A.push(v(P, E)), O.remove(P), D.remove(E), D.insert(u(E)), D.insert(u(E.next)));
      }
    }
    E = T;
    var C = [];
    do
      C.push(E.p), E = E.next;
    while (E !== T);
    return C.push(E.p), C;
  }
  function r(d, y, m, k, O, A, B) {
    for (var T = new t([], s), P = d.data; P; ) {
      for (var D = 0; D < P.children.length; D++) {
        var x = P.children[D], I = P.leaf ? S(x, m, k) : a(m, k, x);
        I > A || T.push({
          node: x,
          dist: I
        });
      }
      for (; T.length && !T.peek().node.children; ) {
        var E = T.pop(), N = E.node, F = S(N, y, m), R = S(N, k, O);
        if (E.dist < F && E.dist < R && f(m, N, B) && f(k, N, B)) return N;
      }
      P = T.pop(), P && (P = P.node);
    }
    return null;
  }
  function s(d, y) {
    return d.dist - y.dist;
  }
  function a(d, y, m) {
    if (l(d, m) || l(y, m)) return 0;
    var k = _(d[0], d[1], y[0], y[1], m.minX, m.minY, m.maxX, m.minY);
    if (k === 0) return 0;
    var O = _(d[0], d[1], y[0], y[1], m.minX, m.minY, m.minX, m.maxY);
    if (O === 0) return 0;
    var A = _(d[0], d[1], y[0], y[1], m.maxX, m.minY, m.maxX, m.maxY);
    if (A === 0) return 0;
    var B = _(d[0], d[1], y[0], y[1], m.minX, m.maxY, m.maxX, m.maxY);
    return B === 0 ? 0 : Math.min(k, O, A, B);
  }
  function l(d, y) {
    return d[0] >= y.minX && d[0] <= y.maxX && d[1] >= y.minY && d[1] <= y.maxY;
  }
  function f(d, y, m) {
    for (var k = Math.min(d[0], y[0]), O = Math.min(d[1], y[1]), A = Math.max(d[0], y[0]), B = Math.max(d[1], y[1]), T = m.search({ minX: k, minY: O, maxX: A, maxY: B }), P = 0; P < T.length; P++)
      if (c(T[P].p, T[P].next.p, d, y)) return !1;
    return !0;
  }
  function h(d, y, m) {
    return i(d[0], d[1], y[0], y[1], m[0], m[1]);
  }
  function c(d, y, m, k) {
    return d !== k && y !== m && h(d, y, m) > 0 != h(d, y, k) > 0 && h(m, k, d) > 0 != h(m, k, y) > 0;
  }
  function u(d) {
    var y = d.p, m = d.next.p;
    return d.minX = Math.min(y[0], m[0]), d.minY = Math.min(y[1], m[1]), d.maxX = Math.max(y[0], m[0]), d.maxY = Math.max(y[1], m[1]), d;
  }
  function p(d) {
    for (var y = d[0], m = d[0], k = d[0], O = d[0], A = 0; A < d.length; A++) {
      var B = d[A];
      B[0] < y[0] && (y = B), B[0] > k[0] && (k = B), B[1] < m[1] && (m = B), B[1] > O[1] && (O = B);
    }
    var T = [y, m, k, O], P = T.slice();
    for (A = 0; A < d.length; A++)
      n(d[A], T) || P.push(d[A]);
    return b(P);
  }
  function v(d, y) {
    var m = {
      p: d,
      prev: null,
      next: null,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };
    return y ? (m.next = y.next, m.prev = y, y.next.prev = m, y.next = m) : (m.prev = m, m.next = m), m;
  }
  function w(d, y) {
    var m = d[0] - y[0], k = d[1] - y[1];
    return m * m + k * k;
  }
  function S(d, y, m) {
    var k = y[0], O = y[1], A = m[0] - k, B = m[1] - O;
    if (A !== 0 || B !== 0) {
      var T = ((d[0] - k) * A + (d[1] - O) * B) / (A * A + B * B);
      T > 1 ? (k = m[0], O = m[1]) : T > 0 && (k += A * T, O += B * T);
    }
    return A = d[0] - k, B = d[1] - O, A * A + B * B;
  }
  function _(d, y, m, k, O, A, B, T) {
    var P = m - d, D = k - y, x = B - O, I = T - A, E = d - O, N = y - A, F = P * P + D * D, R = P * x + D * I, M = x * x + I * I, C = P * E + D * N, X = x * E + I * N, $ = F * M - R * R, L, V, q, j, J = $, G = $;
    $ === 0 ? (V = 0, J = 1, j = X, G = M) : (V = R * X - M * C, j = F * X - R * C, V < 0 ? (V = 0, j = X, G = M) : V > J && (V = J, j = X + R, G = M)), j < 0 ? (j = 0, -C < 0 ? V = 0 : -C > F ? V = J : (V = -C, J = F)) : j > G && (j = G, -C + R < 0 ? V = 0 : -C + R > F ? V = J : (V = -C + R, J = F)), L = V === 0 ? 0 : V / J, q = j === 0 ? 0 : j / G;
    var H = (1 - L) * d + L * m, Q = (1 - L) * y + L * k, Z = (1 - q) * O + q * B, W = (1 - q) * A + q * T, st = Z - H, ft = W - Q;
    return st * st + ft * ft;
  }
  function g(d, y) {
    return d[0] === y[0] ? d[1] - y[1] : d[0] - y[0];
  }
  function b(d) {
    d.sort(g);
    for (var y = [], m = 0; m < d.length; m++) {
      for (; y.length >= 2 && h(y[y.length - 2], y[y.length - 1], d[m]) <= 0; )
        y.pop();
      y.push(d[m]);
    }
    for (var k = [], O = d.length - 1; O >= 0; O--) {
      for (; k.length >= 2 && h(k[k.length - 2], k[k.length - 1], d[O]) <= 0; )
        k.pop();
      k.push(d[O]);
    }
    return k.pop(), y.pop(), y.concat(k);
  }
  return be.exports;
}
var Ki = Ji();
const Hi = /* @__PURE__ */ Xi(Ki);
function mn(e, t = {}) {
  t.concavity = t.concavity || 1 / 0;
  const n = [];
  if (Je(e, (o) => {
    n.push([o[0], o[1]]);
  }), !n.length)
    return null;
  const i = Hi(n, t.concavity);
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
function Qt(e, t = {}) {
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
function Wi(e) {
  return e.type === "Feature" ? e.geometry : e;
}
const Ct = 11102230246251565e-32, dt = 134217729, Zi = (3 + 8 * Ct) * Ct;
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
function tr(e, t) {
  let n = t[0];
  for (let i = 1; i < e; i++) n += t[i];
  return n;
}
function de(e) {
  return new Float64Array(e);
}
const er = (3 + 16 * Ct) * Ct, nr = (2 + 12 * Ct) * Ct, ir = (9 + 64 * Ct) * Ct * Ct, Jt = de(4), vn = de(8), bn = de(12), xn = de(16), vt = de(4);
function rr(e, t, n, i, o, r, s) {
  let a, l, f, h, c, u, p, v, w, S, _, g, b, d, y, m, k, O;
  const A = e - o, B = n - o, T = t - r, P = i - r;
  d = A * P, u = dt * A, p = u - (u - A), v = A - p, u = dt * P, w = u - (u - P), S = P - w, y = v * S - (d - p * w - v * w - p * S), m = T * B, u = dt * T, p = u - (u - T), v = T - p, u = dt * B, w = u - (u - B), S = B - w, k = v * S - (m - p * w - v * w - p * S), _ = y - k, c = y - _, Jt[0] = y - (_ + c) + (c - k), g = d + _, c = g - d, b = d - (g - c) + (_ - c), _ = b - m, c = b - _, Jt[1] = b - (_ + c) + (c - m), O = g + _, c = O - g, Jt[2] = g - (O - c) + (_ - c), Jt[3] = O;
  let D = tr(4, Jt), x = nr * s;
  if (D >= x || -D >= x || (c = e - A, a = e - (A + c) + (c - o), c = n - B, f = n - (B + c) + (c - o), c = t - T, l = t - (T + c) + (c - r), c = i - P, h = i - (P + c) + (c - r), a === 0 && l === 0 && f === 0 && h === 0) || (x = ir * s + Zi * Math.abs(D), D += A * h + P * a - (T * f + B * l), D >= x || -D >= x)) return D;
  d = a * P, u = dt * a, p = u - (u - a), v = a - p, u = dt * P, w = u - (u - P), S = P - w, y = v * S - (d - p * w - v * w - p * S), m = l * B, u = dt * l, p = u - (u - l), v = l - p, u = dt * B, w = u - (u - B), S = B - w, k = v * S - (m - p * w - v * w - p * S), _ = y - k, c = y - _, vt[0] = y - (_ + c) + (c - k), g = d + _, c = g - d, b = d - (g - c) + (_ - c), _ = b - m, c = b - _, vt[1] = b - (_ + c) + (c - m), O = g + _, c = O - g, vt[2] = g - (O - c) + (_ - c), vt[3] = O;
  const I = Le(4, Jt, 4, vt, vn);
  d = A * h, u = dt * A, p = u - (u - A), v = A - p, u = dt * h, w = u - (u - h), S = h - w, y = v * S - (d - p * w - v * w - p * S), m = T * f, u = dt * T, p = u - (u - T), v = T - p, u = dt * f, w = u - (u - f), S = f - w, k = v * S - (m - p * w - v * w - p * S), _ = y - k, c = y - _, vt[0] = y - (_ + c) + (c - k), g = d + _, c = g - d, b = d - (g - c) + (_ - c), _ = b - m, c = b - _, vt[1] = b - (_ + c) + (c - m), O = g + _, c = O - g, vt[2] = g - (O - c) + (_ - c), vt[3] = O;
  const E = Le(I, vn, 4, vt, bn);
  d = a * h, u = dt * a, p = u - (u - a), v = a - p, u = dt * h, w = u - (u - h), S = h - w, y = v * S - (d - p * w - v * w - p * S), m = l * f, u = dt * l, p = u - (u - l), v = l - p, u = dt * f, w = u - (u - f), S = f - w, k = v * S - (m - p * w - v * w - p * S), _ = y - k, c = y - _, vt[0] = y - (_ + c) + (c - k), g = d + _, c = g - d, b = d - (g - c) + (_ - c), _ = b - m, c = b - _, vt[1] = b - (_ + c) + (c - m), O = g + _, c = O - g, vt[2] = g - (O - c) + (_ - c), vt[3] = O;
  const N = Le(E, bn, 4, vt, xn);
  return xn[N - 1];
}
function or(e, t, n, i, o, r) {
  const s = (t - r) * (n - o), a = (e - o) * (i - r), l = s - a, f = Math.abs(s + a);
  return Math.abs(l) >= er * f ? l : -rr(e, t, n, i, o, r, f);
}
function sr(e, t) {
  var n, i, o = 0, r, s, a, l, f, h, c, u = e[0], p = e[1], v = t.length;
  for (n = 0; n < v; n++) {
    i = 0;
    var w = t[n], S = w.length - 1;
    if (h = w[0], h[0] !== w[S][0] && h[1] !== w[S][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (s = h[0] - u, a = h[1] - p, i; i < S; i++) {
      if (c = w[i + 1], l = c[0] - u, f = c[1] - p, a === 0 && f === 0) {
        if (l <= 0 && s >= 0 || s <= 0 && l >= 0)
          return 0;
      } else if (f >= 0 && a <= 0 || f <= 0 && a >= 0) {
        if (r = or(s, l, a, f, 0, 0), r === 0)
          return 0;
        (r > 0 && f > 0 && a <= 0 || r < 0 && f <= 0 && a > 0) && o++;
      }
      h = c, a = f, s = l;
    }
  }
  return o % 2 !== 0;
}
function qe(e, t, n = {}) {
  if (!e)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const i = Qi(e), o = Wi(t), r = o.type, s = t.bbox;
  let a = o.coordinates;
  if (s && ar(i, s) === !1)
    return !1;
  r === "Polygon" && (a = [a]);
  for (var l = 0; l < a.length; ++l) {
    const f = sr(i, a[l]);
    if (f === 0 && !n.ignoreBoundary || f) return !0;
  }
  return !1;
}
function ar(e, t) {
  return t[0] <= e[0] && t[1] <= e[1] && t[2] >= e[0] && t[3] >= e[1];
}
function Ve(e, t) {
  for (let n = 0; n < t.features.length; n++)
    if (qe(e, t.features[n]))
      return t.features[n];
}
function Hn(e, t) {
  const n = t.geometry.coordinates[0][0], i = t.geometry.coordinates[0][1], o = t.geometry.coordinates[0][2], r = e.geometry.coordinates, s = t.properties.a.geom, a = t.properties.b.geom, l = t.properties.c.geom, f = [i[0] - n[0], i[1] - n[1]], h = [o[0] - n[0], o[1] - n[1]], c = [r[0] - n[0], r[1] - n[1]], u = [a[0] - s[0], a[1] - s[1]], p = [l[0] - s[0], l[1] - s[1]], v = (h[1] * c[0] - h[0] * c[1]) / (f[0] * h[1] - f[1] * h[0]), w = (f[0] * c[1] - f[1] * c[0]) / (f[0] * h[1] - f[1] * h[0]);
  return [
    v * u[0] + w * p[0] + s[0],
    v * u[1] + w * p[1] + s[1]
  ];
}
function cr(e, t, n) {
  const i = e.geometry.coordinates, o = n.geometry.coordinates, r = Math.atan2(i[0] - o[0], i[1] - o[1]), s = lr(r, t[0]);
  if (s === void 0)
    throw new Error("Unable to determine vertex index");
  const a = t[1][s];
  return Hn(e, a.features[0]);
}
function ne(e, t, n, i, o, r, s, a) {
  let l;
  if (s && (l = Ve(e, Qt([s]))), !l)
    if (n) {
      const f = e.geometry.coordinates, h = n.gridNum, c = n.xOrigin, u = n.yOrigin, p = n.xUnit, v = n.yUnit, w = n.gridCache, S = Tt(f[0], c, p, h), _ = Tt(f[1], u, v, h), g = w[S] ? w[S][_] ? w[S][_] : [] : [], b = Qt(g.map((d) => t.features[d]));
      l = Ve(e, b);
    } else
      l = Ve(e, t);
  return a && a(l), l ? Hn(e, l) : cr(e, i, o);
}
function Tt(e, t, n, i) {
  let o = Math.floor((e - t) / n);
  return o < 0 && (o = 0), o >= i && (o = i - 1), o;
}
function lr(e, t) {
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
function Qn(e) {
  const t = ["a", "b", "c", "a"].map(
    (r) => e.properties[r].geom
  ), n = e.geometry.coordinates[0], i = e.properties, o = {
    a: { geom: n[0], index: i.a.index },
    b: { geom: n[1], index: i.b.index },
    c: { geom: n[2], index: i.c.index }
  };
  return Kn([t], o);
}
function fr(e) {
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
      (!s || s < 2.00703) && (l = hr(l));
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
  return fr(a);
}
function hr(e) {
  return typeof e == "number" ? e : e.replace(/^(c|e|b)(?:ent|dgeNode|box)(\d+)?$/, "$1$2");
}
function Wn(e, t) {
  return t && t >= 2.00703 || Array.isArray(e[0]) ? e : e.map((n) => [
    n.illstNodes,
    n.mercNodes,
    n.startEnd
  ]);
}
const ur = 2.00704;
function dr(e) {
  return !!(e.version !== void 0 || !e.tins && e.points && e.tins_points);
}
function pr(e) {
  return {
    points: e.points,
    strictStatus: mr(e),
    verticesParams: wr(e),
    centroid: yr(e),
    edges: Wn(e.edges || []),
    edgeNodes: e.edgeNodes || [],
    tins: vr(e),
    kinks: br(e.kinks_points),
    yaxisMode: e.yaxisMode ?? "invert",
    strictMode: e.strictMode ?? "auto",
    vertexMode: e.vertexMode,
    bounds: e.bounds,
    boundsPolygon: e.boundsPolygon,
    wh: e.wh,
    xy: e.xy ?? [0, 0]
  };
}
function gr(e) {
  const t = xr(e), n = t.tins;
  return {
    compiled: t,
    tins: n,
    points: _r(n),
    strictStatus: t.strict_status,
    verticesParams: t.vertices_params,
    centroid: t.centroid,
    kinks: t.kinks
  };
}
function mr(e) {
  return e.strict_status ? e.strict_status : e.kinks_points ? "strict_error" : e.tins_points.length === 2 ? "loose" : "strict";
}
function wr(e) {
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
      ur
    );
    return Qt([s]);
  });
}
function yr(e) {
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
function vr(e) {
  const t = e.tins_points.length === 1 ? 0 : 1;
  return {
    forw: Qt(
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
    bakw: Qt(
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
function br(e) {
  if (e)
    return {
      bakw: Qt(
        e.map((t) => ce(t))
      )
    };
}
function xr(e) {
  return JSON.parse(
    JSON.stringify(e).replace('"cent"', '"c"').replace(/"bbox(\d+)"/g, '"b$1"')
  );
}
function _r(e) {
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
    if (dr(t)) {
      this.applyModernState(pr(t));
      return;
    }
    this.applyLegacyState(gr(t));
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
    const a = n.features.map((w) => {
      let S = [];
      return yn(w)[0].map((_) => {
        r.length === 0 ? r = [Array.from(_), Array.from(_)] : (_[0] < r[0][0] && (r[0][0] = _[0]), _[0] > r[1][0] && (r[1][0] = _[0]), _[1] < r[0][1] && (r[0][1] = _[1]), _[1] > r[1][1] && (r[1][1] = _[1])), S.length === 0 ? S = [Array.from(_), Array.from(_)] : (_[0] < S[0][0] && (S[0][0] = _[0]), _[0] > S[1][0] && (S[1][0] = _[0]), _[1] < S[0][1] && (S[0][1] = _[1]), _[1] > S[1][1] && (S[1][1] = _[1]));
      }), S;
    }), l = (r[1][0] - r[0][0]) / o, f = (r[1][1] - r[0][1]) / o, h = a.reduce(
      (w, S, _) => {
        const g = Tt(S[0][0], r[0][0], l, o), b = Tt(S[1][0], r[0][0], l, o), d = Tt(S[0][1], r[0][1], f, o), y = Tt(S[1][1], r[0][1], f, o);
        for (let m = g; m <= b; m++) {
          w[m] || (w[m] = []);
          for (let k = d; k <= y; k++)
            w[m][k] || (w[m][k] = []), w[m][k].push(_);
        }
        return w;
      },
      []
    ), c = i.features.map((w) => {
      let S = [];
      return yn(w)[0].map((_) => {
        s.length === 0 ? s = [Array.from(_), Array.from(_)] : (_[0] < s[0][0] && (s[0][0] = _[0]), _[0] > s[1][0] && (s[1][0] = _[0]), _[1] < s[0][1] && (s[0][1] = _[1]), _[1] > s[1][1] && (s[1][1] = _[1])), S.length === 0 ? S = [Array.from(_), Array.from(_)] : (_[0] < S[0][0] && (S[0][0] = _[0]), _[0] > S[1][0] && (S[1][0] = _[0]), _[1] < S[0][1] && (S[0][1] = _[1]), _[1] > S[1][1] && (S[1][1] = _[1]));
      }), S;
    }), u = (s[1][0] - s[0][0]) / o, p = (s[1][1] - s[0][1]) / o, v = c.reduce(
      (w, S, _) => {
        const g = Tt(S[0][0], s[0][0], u, o), b = Tt(S[1][0], s[0][0], u, o), d = Tt(S[0][1], s[0][1], p, o), y = Tt(S[1][1], s[0][1], p, o);
        for (let m = g; m <= b; m++) {
          w[m] || (w[m] = []);
          for (let k = d; k <= y; k++)
            w[m][k] || (w[m][k] = []), w[m][k].push(_);
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
        yUnit: f,
        gridCache: h
      },
      bakw: {
        gridNum: o,
        xOrigin: s[0][0],
        yOrigin: s[0][1],
        xUnit: u,
        yUnit: p,
        gridCache: v
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
    if (this.bounds && !n && !i && !qe(o, this.boundsPolygon))
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
      if (!qe(u, this.boundsPolygon)) return !1;
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
  static from(t, n = Ar, i = Ir) {
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
      const B = t[2 * A], T = t[2 * A + 1];
      B < a && (a = B), T < l && (l = T), B > f && (f = B), T > h && (h = T), this._ids[A] = A;
    }
    const c = (a + f) / 2, u = (l + h) / 2;
    let p = 0, v = 0, w = 0;
    for (let A = 0, B = 1 / 0; A < s; A++) {
      const T = je(c, u, t[2 * A], t[2 * A + 1]);
      T < B && (p = A, B = T);
    }
    const S = t[2 * p], _ = t[2 * p + 1];
    for (let A = 0, B = 1 / 0; A < s; A++) {
      if (A === p) continue;
      const T = je(S, _, t[2 * A], t[2 * A + 1]);
      T < B && T > 0 && (v = A, B = T);
    }
    let g = t[2 * v], b = t[2 * v + 1], d = 1 / 0;
    for (let A = 0; A < s; A++) {
      if (A === p || A === v) continue;
      const B = kr(S, _, g, b, t[2 * A], t[2 * A + 1]);
      B < d && (w = A, d = B);
    }
    let y = t[2 * w], m = t[2 * w + 1];
    if (d === 1 / 0) {
      for (let T = 0; T < s; T++)
        this._dists[T] = t[2 * T] - t[0] || t[2 * T + 1] - t[1];
      Kt(this._ids, this._dists, 0, s - 1);
      const A = new Uint32Array(s);
      let B = 0;
      for (let T = 0, P = -1 / 0; T < s; T++) {
        const D = this._ids[T], x = this._dists[D];
        x > P && (A[B++] = D, P = x);
      }
      this.hull = A.subarray(0, B), this.triangles = new Uint32Array(0), this.halfedges = new Int32Array(0);
      return;
    }
    if (kt(S, _, g, b, y, m) < 0) {
      const A = v, B = g, T = b;
      v = w, g = y, b = m, w = A, y = B, m = T;
    }
    const k = Er(S, _, g, b, y, m);
    this._cx = k.x, this._cy = k.y;
    for (let A = 0; A < s; A++)
      this._dists[A] = je(t[2 * A], t[2 * A + 1], k.x, k.y);
    Kt(this._ids, this._dists, 0, s - 1), this._hullStart = p;
    let O = 3;
    i[p] = n[w] = v, i[v] = n[p] = w, i[w] = n[v] = p, o[p] = 0, o[v] = 1, o[w] = 2, r.fill(-1), r[this._hashKey(S, _)] = p, r[this._hashKey(g, b)] = v, r[this._hashKey(y, m)] = w, this.trianglesLen = 0, this._addTriangle(p, v, w, -1, -1, -1);
    for (let A = 0, B = 0, T = 0; A < this._ids.length; A++) {
      const P = this._ids[A], D = t[2 * P], x = t[2 * P + 1];
      if (A > 0 && Math.abs(D - B) <= kn && Math.abs(x - T) <= kn || (B = D, T = x, P === p || P === v || P === w)) continue;
      let I = 0;
      for (let M = 0, C = this._hashKey(D, x); M < this._hashSize && (I = r[(C + M) % this._hashSize], !(I !== -1 && I !== i[I])); M++)
        ;
      I = n[I];
      let E = I, N;
      for (; N = i[E], kt(D, x, t[2 * E], t[2 * E + 1], t[2 * N], t[2 * N + 1]) >= 0; )
        if (E = N, E === I) {
          E = -1;
          break;
        }
      if (E === -1) continue;
      let F = this._addTriangle(E, P, i[E], -1, -1, o[E]);
      o[P] = this._legalize(F + 2), o[E] = F, O++;
      let R = i[E];
      for (; N = i[R], kt(D, x, t[2 * R], t[2 * R + 1], t[2 * N], t[2 * N + 1]) < 0; )
        F = this._addTriangle(R, P, N, o[P], -1, o[R]), o[P] = this._legalize(F + 2), i[R] = R, O--, R = N;
      if (E === I)
        for (; N = n[E], kt(D, x, t[2 * N], t[2 * N + 1], t[2 * E], t[2 * E + 1]) < 0; )
          F = this._addTriangle(N, P, E, -1, o[E], o[N]), this._legalize(F + 2), o[N] = F, i[E] = E, O--, E = N;
      this._hullStart = n[P] = E, i[E] = n[R] = P, i[P] = R, r[this._hashKey(D, x)] = P, r[this._hashKey(t[2 * E], t[2 * E + 1])] = E;
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
    return Math.floor(Mr(t - this._cx, n - this._cy) * this._hashSize) % this._hashSize;
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
      const f = a - a % 3, h = l + (t + 1) % 3, c = f + (a + 2) % 3, u = n[s], p = n[t], v = n[h], w = n[c];
      if (Sr(
        o[2 * u],
        o[2 * u + 1],
        o[2 * p],
        o[2 * p + 1],
        o[2 * v],
        o[2 * v + 1],
        o[2 * w],
        o[2 * w + 1]
      )) {
        n[t] = w, n[a] = u;
        const _ = i[c];
        if (_ === -1) {
          let b = this._hullStart;
          do {
            if (this._hullTri[b] === c) {
              this._hullTri[b] = t;
              break;
            }
            b = this._hullPrev[b];
          } while (b !== this._hullStart);
        }
        this._link(t, _), this._link(a, i[s]), this._link(s, c);
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
function Mr(e, t) {
  const n = e / (Math.abs(e) + Math.abs(t));
  return (t > 0 ? 3 - n : 1 + n) / 4;
}
function je(e, t, n, i) {
  const o = e - n, r = t - i;
  return o * o + r * r;
}
function Sr(e, t, n, i, o, r, s, a) {
  const l = e - s, f = t - a, h = n - s, c = i - a, u = o - s, p = r - a, v = l * l + f * f, w = h * h + c * c, S = u * u + p * p;
  return l * (c * S - w * p) - f * (h * S - w * u) + v * (h * p - c * u) < 0;
}
function kr(e, t, n, i, o, r) {
  const s = n - e, a = i - t, l = o - e, f = r - t, h = s * s + a * a, c = l * l + f * f, u = 0.5 / (s * f - a * l), p = (f * h - a * c) * u, v = (s * c - l * h) * u;
  return p * p + v * v;
}
function Er(e, t, n, i, o, r) {
  const s = n - e, a = i - t, l = o - e, f = r - t, h = s * s + a * a, c = l * l + f * f, u = 0.5 / (s * f - a * l), p = e + (f * h - a * c) * u, v = t + (s * c - l * h) * u;
  return { x: p, y: v };
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
function Ar(e) {
  return e[0];
}
function Ir(e) {
  return e[1];
}
class Br {
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
class En extends Br {
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
class Or {
  /**
   * The triangulation object from Delaunator.
   */
  del;
  constructor(t) {
    this.del = t;
  }
}
class In extends Or {
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
      const p = _t(l), v = i[p];
      if (v === n)
        return this.protect(u), u;
      if (this.intersectSegments(t, n, v, c)) {
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
      const c = o[l], u = _t(l), p = _t(c), v = Ot(c);
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
          i[v],
          i[p]
        ))
          l = v;
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
        i[v],
        i[p]
      ) && (l = v);
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
    const { triangles: i, halfedges: o } = this.del, r = i.length / 3, s = (v, w, S) => {
      const _ = t(w), g = t(S);
      return t(v).some((b) => _.includes(b) && g.includes(b));
    }, a = (v) => s(i[v * 3], i[v * 3 + 1], i[v * 3 + 2]), l = (v, w, S, _) => Math.sign(kt(v[w * 2], v[w * 2 + 1], v[S * 2], v[S * 2 + 1], v[_ * 2], v[_ * 2 + 1])), f = n.map((v) => {
      let w = 0;
      for (let S = 0; S < r; S++) w += l(v, i[S * 3], i[S * 3 + 1], i[S * 3 + 2]);
      return w < 0 ? -1 : 1;
    }), h = (v) => {
      if (this.consd.has(v)) return !1;
      const w = o[v];
      if (w === -1) return !1;
      const S = i[v], _ = i[Ot(v)], g = i[_t(v)], b = i[_t(w)];
      return n.every((d, y) => l(d, g, S, b) === f[y] && l(d, b, _, g) === f[y]);
    };
    let c = 0, u = !0;
    for (; u; ) {
      u = !1;
      for (let v = 0; v < r; v++)
        if (a(v))
          for (let w = 0; w < 3; w++) {
            const S = v * 3 + w;
            if (!h(S)) continue;
            const _ = o[S], g = i[S], b = i[Ot(S)], d = i[_t(S)], y = i[_t(_)];
            if (!(s(d, g, y) && s(y, b, d))) {
              this.protect(this.flipDiagonal(S)), c++, u = !0;
              break;
            }
          }
    }
    let p = 0;
    for (let v = 0; v < r; v++) a(v) && p++;
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
    return vi(
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
    c.constrainAll(t), i?.boundary && (a = Tr(c, i.boundary), a || (r = Ae.from(o), c = new In(r, t))), i && ({ remaining: s } = c.forbidGroupTriangles(
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
      const u = {}, p = c.map((v, w) => {
        const S = e.features[v], _ = S.geometry.coordinates, g = [_[0], _[1]];
        return _.length === 3 ? g[2] = _[2] : u[f[w]] = S.properties[n], g;
      });
      return p[3] = p[0], he([p], u);
    })
  ), remaining: s, hasBoundary: a !== void 0 };
}
function Tr(e, t) {
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
const Nr = [0.1, 0.15, 0.225, 0.34, 0.5];
function Pr(e, t) {
  return t ? e.hasBoundary !== t.hasBoundary ? e.hasBoundary : e.diagnostics.boundaryTriangleFlips < t.diagnostics.boundaryTriangleFlips : !0;
}
function On(e, t, n) {
  return Math.sign(kt(e[0], e[1], t[0], t[1], n[0], n[1]));
}
function Tn(e) {
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
function Cr(e, t) {
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
function Fr(e, t, n, i) {
  const { minx: o, maxx: r, miny: s, maxy: a, centroid: l } = e, f = r - o, h = a - s, c = n.forw.length, u = Array.from({ length: c }, () => []);
  let p = 1;
  for (const [_, g] of n.edges)
    _ < i && u[_].push(p), u[g].push(p), g < i && p++;
  const v = [0], w = (_) => _ >= c ? v : u[_];
  let S;
  for (const _ of Nr) {
    const g = Cr(
      t(
        {
          ...e,
          minx: o - _ * f,
          maxx: r + _ * f,
          miny: s - _ * h,
          maxy: a + _ * h
        },
        !0
      ),
      n
    ), b = g.map(
      ({ forw: E, bakw: N }, F) => ie(E, N, `b${F}`)
    ), d = Mt([...n.forw, ...b]), y = Mt([
      ...n.bakw,
      ...b.map(re)
    ]), m = [d, y].map(
      ({ features: E }) => Float64Array.from(
        E.flatMap(
          ({
            geometry: {
              coordinates: [N, F]
            }
          }) => [N, F]
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
    ]) : void 0, A = { groupsOf: w, planes: m, boundary: O }, B = ze(
      d,
      n.edges,
      "target",
      A
    ), T = ze(
      y,
      n.edges,
      "target",
      A
    ), P = B.tin, D = T.tin, x = Tn(P) + Tn(D), I = {
      vertices: g,
      forw: P,
      bakw: D,
      diagnostics: {
        margin: _,
        boundaryTriangleFlips: x,
        remainingForbiddenTriangles: B.remaining + T.remaining
      },
      hasBoundary: B.hasBoundary && T.hasBoundary
    };
    if (x === 0 && I.hasBoundary)
      return I;
    Pr(I, S) && (S = I);
  }
  return S;
}
const Dr = 256 * Number.EPSILON, Zn = 4, Xr = 1e-9;
function Rr(e) {
  const t = Math.abs(e);
  if (!Number.isFinite(t)) return NaN;
  const n = new DataView(new ArrayBuffer(8));
  n.setFloat64(0, t);
  const i = n.getUint32(0) >>> 20 & 2047;
  return Math.pow(2, Math.max(i, 1) - 1023 - 52);
}
function $r(e) {
  let t = 0;
  for (const n of e)
    t = Math.max(t, Math.abs(n[0]), Math.abs(n[1]));
  return t;
}
function Yr(e, t, n = Zn) {
  const i = (r) => {
    let s = 0;
    for (let l = 1; l < r.length; l++)
      s += Math.sqrt(
        Math.pow(r[l][0] - r[l - 1][0], 2) + Math.pow(r[l][1] - r[l - 1][1], 2)
      );
    const a = Rr($r(r)) / s;
    return Number.isFinite(a) ? a : 0;
  }, o = Dr + n * (i(e) + i(t));
  return Math.min(o, Xr);
}
function Lr(e, t, n) {
  const i = new Int32Array(e.length).fill(-1), o = new Int32Array(t.length).fill(-1), r = e.length - 2, s = t.length - 2;
  if (r < 1 || s < 1) return { illstToMerc: i, mercToIllst: o };
  const a = (y, m) => Math.abs(t[m + 1][3] - e[y + 1][3]) <= n;
  let l = r, f = -1, h = s, c = -1;
  for (let y = 0; y < r; y++)
    for (let m = 0; m < s; m++)
      a(y, m) && (l = Math.min(l, y), f = Math.max(f, y), h = Math.min(h, m), c = Math.max(c, m));
  if (f < 0) return { illstToMerc: i, mercToIllst: o };
  const u = f - l + 1, p = c - h + 1, v = p + 1, w = new Int32Array((u + 1) * v), S = new Float64Array((u + 1) * v), _ = new Uint8Array((u + 1) * v), g = (y, m, k, O) => y > k || y === k && m < O;
  for (let y = 1; y <= u; y++)
    for (let m = 1; m <= p; m++) {
      const k = y * v + m, O = k - v, A = k - 1;
      let B = w[O], T = S[O], P = 0;
      g(w[A], S[A], B, T) && (B = w[A], T = S[A], P = 1);
      const D = l + y - 1, x = h + m - 1;
      if (a(D, x)) {
        const I = O - 1, E = w[I] + 1, N = S[I] + Math.abs(t[x + 1][3] - e[D + 1][3]);
        g(E, N, B, T) && (B = E, T = N, P = 2);
      }
      w[k] = B, S[k] = T, _[k] = P;
    }
  let b = u, d = p;
  for (; b > 0 && d > 0; ) {
    const y = _[b * v + d];
    if (y === 2) {
      const m = l + b - 1 + 1, k = h + d - 1 + 1;
      i[m] = k, o[k] = m, b--, d--;
    } else y === 0 ? b-- : d--;
  }
  return { illstToMerc: i, mercToIllst: o };
}
function Vr(e, t, n = Zn) {
  const i = Yr(e, t, n), o = [e, t].map((h) => {
    const c = h.map((p, v, w) => {
      if (v === 0) return 0;
      const S = w[v - 1];
      return Math.sqrt(
        Math.pow(p[0] - S[0], 2) + Math.pow(p[1] - S[1], 2)
      );
    }), u = c.reduce((p, v, w) => w === 0 ? [0] : (p.push(p[w - 1] + v), p), []);
    return u.map((p, v, w) => {
      const S = p / w[w.length - 1];
      return [h[v], c[v], u[v], S];
    });
  }), { illstToMerc: r, mercToIllst: s } = Lr(o[0], o[1], i), a = [r, s], l = (h, c) => {
    for (let u = 1; u < c.length - 1; u++)
      if (Math.abs(c[u][3] - h) <= i) return !0;
    return !1;
  }, f = [];
  return o.forEach((h, c) => {
    const u = o[c ? 0 : 1];
    h.forEach((p, v) => {
      if (v === 0 || v === h.length - 1) return;
      const w = p[0], S = p[3], _ = a[c][v];
      if (_ >= 0) {
        c === 0 && f.push([w, u[_][0], S]);
        return;
      }
      if (!l(S, u))
        for (let g = 0; g < u.length - 1; g++) {
          const b = u[g], d = u[g + 1], y = b[3], m = d[3];
          if (y < S && m > S) {
            const k = (S - y) / (m - y), O = [
              (d[0][0] - b[0][0]) * k + b[0][0],
              (d[0][1] - b[0][1]) * k + b[0][1]
            ];
            f.push(
              c === 0 ? [w, O, S] : [O, w, S]
            );
            return;
          }
        }
    });
  }), f.sort((h, c) => h[2] - c[2]);
}
function jr(e, t) {
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
function qr(e) {
  let t = 1 / 0, n = 0, i = 0;
  return e.forEach((o) => {
    const { forw: r, bakw: s } = o, a = Math.hypot(r[0], r[1]), l = Math.hypot(s[0], s[1]);
    if (l === 0) return;
    const f = a / l, h = Math.atan2(r[0], r[1]) - Math.atan2(s[0], s[1]);
    t = Math.min(t, f), n += Math.cos(h), i += Math.sin(h);
  }), isFinite(t) ? [t, Math.atan2(i, n)] : [1, 0];
}
function Ur(e, t, n) {
  const { perQuad: i, aggregate: o } = jr(e, t), r = i.every((l) => l.length > 0), a = (n === "birdeye" ? r ? i : [o] : [o]).map((l) => qr(l));
  return a.length === 1 ? [a[0], a[0], a[0], a[0]] : a;
}
function zr(e, t) {
  let n = 0;
  return e[0] > t[0] && (n += 1), e[1] > t[1] && (n += 2), n;
}
function Gr(e, t, n) {
  const i = [
    e[0] - t.forw[0],
    e[1] - t.forw[1]
  ], r = Math.sqrt(i[0] ** 2 + i[1] ** 2) / n[0], s = Math.atan2(i[0], i[1]) - n[1];
  return [
    t.bakw[0] + r * Math.sin(s),
    t.bakw[1] - r * Math.cos(s)
  ];
}
function Jr(e, t, n, i) {
  const o = t[0] - e[0], r = t[1] - e[1];
  if (Math.abs(o) < 1e-12 && Math.abs(r) < 1e-12) return null;
  const s = i[0] - n[0], a = i[1] - n[1], l = n[0] - e[0], f = n[1] - e[1], h = o * a - r * s;
  if (Math.abs(h) < 1e-12) return null;
  const c = (l * a - f * s) / h, u = (l * r - f * o) / h;
  return c <= 1e-10 || u < -1e-10 || u > 1 + 1e-10 ? null : { t: c, point: [e[0] + c * o, e[1] + c * r] };
}
function Kr(e, t, n) {
  const i = n.length;
  let o = -1 / 0, r = null;
  for (let s = 0; s < i; s++) {
    const a = (s + 1) % i, l = Jr(
      e,
      t,
      n[s].bakw,
      n[a].bakw
    );
    l && l.t > o && (o = l.t, r = l.point);
  }
  return r;
}
function Pn(e, t) {
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
function Fn(e, t, n) {
  const i = e.length, o = new Array(i).fill(1);
  for (const r of t)
    for (let s = 0; s < i; s++) {
      const a = (s + 1) % i, l = We([e[s].bakw, e[a].bakw]), f = We([n.bakw, r.bakw]), h = Di(l, f);
      if (h.features.length > 0 && h.features[0].geometry) {
        const c = h.features[0], u = Math.sqrt(
          Math.pow(r.bakw[0] - n.bakw[0], 2) + Math.pow(r.bakw[1] - n.bakw[1], 2)
        ), p = Math.sqrt(
          Math.pow(c.geometry.coordinates[0] - n.bakw[0], 2) + Math.pow(c.geometry.coordinates[1] - n.bakw[1], 2)
        ), v = u / p;
        v > o[s] && (o[s] = v), v > o[a] && (o[a] = v);
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
function ti(e, t, n) {
  const { convexBuf: i, centroid: o, allGcps: r, minx: s, maxx: a, miny: l, maxy: f } = e, h = Ur(i, o, t), u = [
    [s, l],
    [a, l],
    [a, f],
    [s, f]
  ].map((m) => ({
    forw: m,
    bakw: Gr(
      m,
      o,
      h[zr(m, o.forw)]
    )
  }));
  if (u.sort(
    (m, k) => Math.atan2(m.forw[0] - o.forw[0], m.forw[1] - o.forw[1]) - Math.atan2(k.forw[0] - o.forw[0], k.forw[1] - o.forw[1])
  ), Fn(u, r, o), !n) return u;
  const p = 4, v = u.map(
    (m) => Math.atan2(m.forw[0] - o.forw[0], m.forw[1] - o.forw[1])
  ), w = u.map(
    (m) => Math.atan2(
      m.bakw[0] - o.bakw[0],
      -(m.bakw[1] - o.bakw[1])
    )
  );
  function S(m) {
    for (let k = 0; k < p; k++) {
      const O = (k + 1) % p, A = v[k], B = k < p - 1 ? v[O] : v[O] + 2 * Math.PI;
      let T = m;
      for (; T < A; ) T += 2 * Math.PI;
      for (; T >= A + 2 * Math.PI; ) T -= 2 * Math.PI;
      if (T >= A && T < B)
        return { i: k, j: O, frac: (T - A) / (B - A) };
    }
    return { i: 0, j: 1, frac: 0 };
  }
  function _(m) {
    const { i: k, j: O, frac: A } = S(m), B = w[k];
    let P = w[O] - B;
    for (; P > Math.PI; ) P -= 2 * Math.PI;
    for (; P < -Math.PI; ) P += 2 * Math.PI;
    return B + A * P;
  }
  const g = new Set(
    u.map(
      (m) => Math.floor(Pn(m.forw, o.forw) / 10) % 36
    )
  ), b = r.map((m) => ({
    forw: m.forw,
    bakw: m.bakw,
    angleDeg: Pn(m.forw, o.forw),
    forwDist: Math.hypot(m.forw[0] - o.forw[0], m.forw[1] - o.forw[1])
  })), d = [];
  for (let m = 0; m < 36; m++) {
    if (g.has(m)) continue;
    const k = m * 10, O = b.filter(
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
    const B = [A[0] - o.forw[0], A[1] - o.forw[1]], T = Math.atan2(B[0], B[1]), P = _(T), D = [
      o.bakw[0] + Math.sin(P),
      o.bakw[1] - Math.cos(P)
    ], x = Kr(o.bakw, D, u);
    x && d.push({ forw: A, bakw: x });
  }
  const y = [...u, ...d];
  return y.sort(
    (m, k) => Math.atan2(m.forw[0] - o.forw[0], m.forw[1] - o.forw[1]) - Math.atan2(k.forw[0] - o.forw[0], k.forw[1] - o.forw[1])
  ), Fn(y, r, o), y;
}
function Hr(e, t = !1) {
  return ti(e, "plain", t);
}
function Qr(e, t = !1) {
  return ti(e, "birdeye", t);
}
function To(e) {
  return ei(e, 1 / 0);
}
const Dn = 1e5, Wr = 16;
function ei(e, t) {
  return Zr(e), new to(e).findSegmentIntersections(t).map(
    (o) => Lt([o.x, o.y])
  );
}
function Zr(e) {
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
class to {
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
    (r != this._xx.length || this._xx.length != this._yy.length) && Ut("ArcCollection#initXYData() Counting error"), this.initBounds(), this._arcIter = new xo(this._xx, this._yy);
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
      l = i[c], l > 0 && (f = c * 4, h = _o(t, n, a, l), r[f++] = h[0], r[f++] = h[1], r[f++] = h[2], r[f] = h[3], a += l, s.mergeBounds(h));
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
    const n = this.getBounds(), i = n.ymin || 0, o = (n.ymax || 0) - i, r = this.calcSegmentIntersectionStripeCount(), s = new Uint32Array(r), a = r > 1 ? (b) => Math.floor((r - 1) * (b - i) / o) : () => 0, l = r + 1;
    let f;
    this.forEachSegment(
      (b, d, y, m) => {
        let k = a(m[b]);
        const O = a(m[d]);
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
    const h = this.getUint32Array(io(s));
    let c = 0;
    const u = [];
    ro(s, (b) => {
      const d = c;
      c += b, u.push(h.subarray(d, c));
    }), oo(s, 0), this.forEachSegment(
      (b, d, y, m) => {
        let k = a(m[b]);
        const O = a(m[d]);
        let A, B, T = 0;
        for (; A = s[k], s[k] = A + 2, B = u[k], B[A] = b, B[A + 1] = d, k != O; )
          T++, T > l && Ut(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${r}`,
            `s1=${k}`,
            `s2=${O}`
          ), k += O > k ? 1 : -1;
      }
    );
    const p = this.getVertexData(), v = t * Wr;
    let w = 0;
    const S = /* @__PURE__ */ new Set(), _ = /* @__PURE__ */ new Map(), g = (b) => {
      w++;
      const d = bo(b);
      return S.has(d) || (S.add(d), _.set(`${b.x}:${b.y}`, b)), _.size >= t || w >= v;
    };
    if (p.xx && p.yy)
      for (f = 0; f < r && !so(u[f], p.xx, p.yy, g); f++)
        ;
    return Array.from(_.values());
  }
}
function Ut(...e) {
  const t = e.join(" ");
  throw new Error(t);
}
function le(e) {
  return e ? no(e) ? !0 : eo(e) ? !1 : e.length === 0 ? !0 : e.length > 0 : !1;
}
function eo(e) {
  return e != null && e.toString === String.prototype.toString;
}
function no(e) {
  return Array.isArray(e);
}
function io(e, t) {
  le(e) || Ut("utils.sum() expects an array, received:", e);
  let n = 0, i;
  for (let o = 0, r = e.length; o < r; o++)
    i = e[o], i && (n += i);
  return n;
}
function ro(e, t, n) {
  if (!le(e))
    throw new Error(`#forEach() takes an array-like argument. ${e}`);
  for (let i = 0, o = e.length; i < o; i++)
    t.call(n, e[i], i);
}
function oo(e, t) {
  for (let n = 0, i = e.length; n < i; n++)
    e[n] = t;
  return e;
}
function so(e, t, n, i) {
  const o = e.length - 2;
  let r, s, a, l, f, h, c, u, p, v, w, S, _, g, b, d, y;
  for (wo(t, e), d = 0; d < o; ) {
    for (r = e[d], s = e[d + 1], f = t[r], h = t[s], p = n[r], v = n[s], y = d; y < o && (y += 2, a = e[y], c = t[a], !(h < c)); ) {
      if (w = n[a], l = e[y + 1], u = t[l], S = n[l], p >= w) {
        if (p > S && v > w && v > S) continue;
      } else if (p < S && v < w && v < S) continue;
      if (!(r == a || r == l || s == a || s == l) && (_ = ao(
        f,
        p,
        h,
        v,
        c,
        w,
        u,
        S
      ), _ && (g = [r, s], b = [a, l], i(Rn(_, g, b, t, n)) || _.length == 4 && i(Rn(_.slice(2), g, b, t, n)))))
        return !0;
    }
    d += 2;
  }
  return !1;
}
function ao(e, t, n, i, o, r, s, a) {
  const l = co(e, t, n, i, o, r, s, a);
  let f = null;
  return l && (f = lo(e, t, n, i, o, r, s, a), f ? mo(e, t, n, i, o, r, s, a) && (f = null) : f = go(e, t, n, i, o, r, s, a)), f;
}
function co(e, t, n, i, o, r, s, a) {
  return oe(e, t, n, i, o, r) * oe(e, t, n, i, s, a) <= 0 && oe(o, r, s, a, e, t) * oe(o, r, s, a, n, i) <= 0;
}
function oe(e, t, n, i, o, r) {
  return ni(e - o, t - r, n - o, i - r);
}
function ni(e, t, n, i) {
  return e * i - t * n;
}
function lo(e, t, n, i, o, r, s, a) {
  let l = Me(e, t, n, i, o, r, s, a), f;
  return l && (f = ho(l[0], l[1], e, t, n, i, o, r, s, a), f == 1 ? l = Me(n, i, e, t, o, r, s, a) : f == 2 ? l = Me(o, r, s, a, e, t, n, i) : f == 3 && (l = Me(s, a, o, r, e, t, n, i))), l && po(l, e, t, n, i, o, r, s, a), l;
}
function Me(e, t, n, i, o, r, s, a) {
  const l = ni(n - e, i - t, s - o, a - r), f = 1e-18;
  let h;
  if (l === 0) return null;
  const c = oe(o, r, s, a, e, t) / l;
  return l <= f && l >= -f ? h = fo(e, t, n, i, o, r, s, a) : h = [e + c * (n - e), t + c * (i - t)], h;
}
function fo(e, t, n, i, o, r, s, a) {
  let l = null;
  return !Nt(e, o, s) && !Nt(t, r, a) ? l = [e, t] : !Nt(n, o, s) && !Nt(i, r, a) ? l = [n, i] : !Nt(o, e, n) && !Nt(r, t, i) ? l = [o, r] : !Nt(s, e, n) && !Nt(a, t, i) && (l = [s, a]), l;
}
function Nt(e, t, n) {
  let i;
  return t < n ? i = e < t || e > n : t > n ? i = e > t || e < n : i = e != t, i;
}
function ho(e, t, ...n) {
  let i = -1, o = 1 / 0, r;
  for (let s = 0, a = 0, l = n.length; a < l; s++, a += 2)
    r = uo(e, t, n[a], n[a + 1]), r < o && (o = r, i = s);
  return i;
}
function uo(e, t, n, i) {
  const o = e - n, r = t - i;
  return o * o + r * r;
}
function po(e, t, n, i, o, r, s, a, l) {
  let f = e[0], h = e[1];
  f = Se(f, t, i), f = Se(f, r, a), h = Se(h, n, o), h = Se(h, s, l), e[0] = f, e[1] = h;
}
function Se(e, t, n) {
  let i;
  return Nt(e, t, n) && (i = Math.abs(e - t) < Math.abs(e - n) ? t : n, e = i), e;
}
function go(e, t, n, i, o, r, s, a) {
  const l = Math.min(e, n, o, s), f = Math.max(e, n, o, s), h = Math.min(t, i, r, a), c = Math.max(t, i, r, a), u = c - h > f - l;
  let p = [];
  return (u ? Yt(t, h, c) : Yt(e, l, f)) && p.push(e, t), (u ? Yt(i, h, c) : Yt(n, l, f)) && p.push(n, i), (u ? Yt(r, h, c) : Yt(o, l, f)) && p.push(o, r), (u ? Yt(a, h, c) : Yt(s, l, f)) && p.push(s, a), (p.length != 2 && p.length != 4 || p.length == 4 && p[0] == p[2] && p[1] == p[3]) && (p = null), p;
}
function mo(e, t, n, i, o, r, s, a) {
  return e == o && t == r || e == s && t == a || n == o && i == r || n == s && i == a;
}
function Yt(e, t, n) {
  return e > t && e < n;
}
function wo(e, t) {
  yo(e, t), ii(e, t, 0, t.length - 2);
}
function yo(e, t) {
  for (let n = 0, i = t.length; n < i; n += 2)
    e[t[n]] > e[t[n + 1]] && vo(t, n, n + 1);
}
function vo(e, t, n) {
  const i = e[t];
  e[t] = e[n], e[n] = i;
}
function ii(e, t, n, i) {
  let o = n, r = i, s, a;
  for (; o < i; ) {
    for (s = e[t[n + i >> 2 << 1]]; o <= r; ) {
      for (; e[t[o]] < s; ) o += 2;
      for (; e[t[r]] > s; ) r -= 2;
      o <= r && (a = t[o], t[o] = t[r], t[r] = a, a = t[o + 1], t[o + 1] = t[r + 1], t[r + 1] = a, o += 2, r -= 2);
    }
    if (r - n < 40 ? Xn(e, t, n, r) : ii(e, t, n, r), i - o < 40) {
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
function Rn(e, t, n, i, o) {
  const r = e[0], s = e[1];
  t = $n(r, s, t[0], t[1], i, o), n = $n(r, s, n[0], n[1], i, o);
  const a = t[0] < n[0] ? t : n, l = a == t ? n : t;
  return { x: r, y: s, a, b: l };
}
function $n(e, t, n, i, o, r) {
  let s = n < i ? n : i, a = s === n ? i : n;
  return o[s] == e && r[s] == t ? a = s : o[a] == e && r[a] == t && (s = a), [s, a];
}
function bo(e) {
  return `${e.a.join(",")};${e.b.join(",")}`;
}
class xo {
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
function _o(e, t, n, i) {
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
function ri(e, t, n) {
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
function Mo(e, t) {
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
const So = 10;
function ko(e, t, n, i, o, r) {
  if (!e && !t) return !1;
  const s = e ? 0 : 1, a = 1 - s, l = n[s], f = n[a];
  if (!l || !f) return !1;
  const h = xt(f.geom);
  let c = !1, u = !1;
  for (let p = 0; p <= 1; p++) {
    const v = i[p];
    if (!v) continue;
    const w = [String(v.prop.index), String(l.prop.index)].sort().join("-"), S = o[w];
    if (!S || S.length < 2) continue;
    const _ = S.find(
      (T) => T.bakw !== r[s].bakw
    );
    if (!_) continue;
    const b = se(_.bakw).find(
      (T) => String(T.prop.index) !== String(v.prop.index) && String(T.prop.index) !== String(l.prop.index)
    );
    if (!b) continue;
    c = !0;
    const d = xt(b.geom), y = xt(v.geom), m = xt(l.geom), k = m[0] - y[0], O = m[1] - y[1], A = k * (h[1] - y[1]) - O * (h[0] - y[0]), B = k * (d[1] - y[1]) - O * (d[0] - y[0]);
    if (A * B > 0) {
      u = !0;
      break;
    }
  }
  return c && !u;
}
function Eo(e, t, n, i) {
  if (!e && !t) return !1;
  if (n[0] && n[1] && i[0] && i[1]) {
    const o = i.map((h) => xt(h.geom)), r = n.map((h) => xt(h.geom)), s = o[1][0] - o[0][0], a = o[1][1] - o[0][1], l = s * (r[0][1] - o[0][1]) - a * (r[0][0] - o[0][0]), f = s * (r[1][1] - o[0][1]) - a * (r[1][0] - o[0][0]);
    return l * f < 0;
  }
  return !1;
}
function Ao(e, t, n, i) {
  const o = Mo(n, i), r = /* @__PURE__ */ new Set();
  let s = !1;
  for (let a = 0; a < So; a++) {
    let l = !1;
    for (const f of Object.keys(t)) {
      if (r.has(f)) continue;
      r.add(f);
      const h = t[f];
      if (!h || h.length < 2) continue;
      const c = f.split("-");
      if (c.length !== 2 || o.has(f)) continue;
      const u = se(h[0].bakw), p = se(h[1].bakw), v = se(h[0].forw), w = se(h[1].forw), S = c.map(
        (M) => u.find((C) => `${C.prop.index}` === M) || p.find((C) => `${C.prop.index}` === M)
      ), _ = c.map(
        (M) => v.find((C) => `${C.prop.index}` === M) || w.find((C) => `${C.prop.index}` === M)
      );
      if (S.some((M) => !M) || _.some((M) => !M))
        continue;
      const g = [u, p].map(
        (M) => M.find((C) => !c.includes(`${C.prop.index}`))
      ), b = [v, w].map(
        (M) => M.find((C) => !c.includes(`${C.prop.index}`))
      );
      if (g.some((M) => !M) || b.some((M) => !M))
        continue;
      const d = h[0].bakw.geometry.coordinates[0].slice(0, 3).map((M) => xt(M)), y = h[1].bakw.geometry.coordinates[0].slice(0, 3).map((M) => xt(M)), m = h[0].forw.geometry.coordinates[0].slice(0, 3).map((M) => xt(M)), k = h[1].forw.geometry.coordinates[0].slice(0, 3).map((M) => xt(M)), O = ke(d), A = ke(y), B = ke(m), T = ke(k), P = ko(
        O,
        A,
        g,
        S,
        t,
        h
      ), D = Eo(
        B,
        T,
        g,
        S
      );
      if (!(P || D || Ln(
        xt(g[0].geom),
        y
      ) || Ln(
        xt(g[1].geom),
        d
      )))
        continue;
      const I = _.map(
        (M) => xt(M.geom)
      ), E = b.map(
        (M) => xt(M.geom)
      ), N = Io([
        ...I,
        ...E
      ]), F = Bo(N), R = Vn(
        I[0],
        I[1],
        E[0]
      ) + Vn(
        I[0],
        I[1],
        E[1]
      );
      Ge(F, R) && (Yn(t, h[0], e), Yn(t, h[1], e), S.forEach((M) => {
        if (!M) return;
        const C = [
          M.geom,
          g[0].geom,
          g[1].geom,
          M.geom
        ], X = {
          a: M.prop,
          b: g[0].prop,
          c: g[1].prop
        }, $ = he([C], X), L = Qn($);
        ri(t, {
          forw: L,
          bakw: $
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
  const [n, i] = t[0], [o, r] = t[1], [s, a] = t[2], l = s - n, f = a - i, h = o - n, c = r - i, u = e[0] - n, p = e[1] - i, v = l * l + f * f, w = l * h + f * c, S = l * u + f * p, _ = h * h + c * c, g = h * u + c * p, b = v * _ - w * w;
  if (b === 0) return !1;
  const d = 1 / b, y = (_ * S - w * g) * d, m = (v * g - w * S) * d, k = 1e-9;
  return y >= -k && m >= -k && y + m <= 1 + k;
}
function Io(e) {
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
function Bo(e) {
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
const jn = 2.00704, qn = 3.00001;
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
    return this.useV2Algorithm ? jn : qn;
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
    t.version = this.useV2Algorithm ? jn : qn, t.points = this.points, t.weight_buffer = {}, t.centroid_point = [
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
  calculateStrictTin(t = Dn) {
    const n = this.tins.forw.features.map(
      (s) => Qn(s)
    );
    this.tins.bakw = Mt(n);
    const i = {};
    this.tins.forw.features.forEach((s, a) => {
      const l = this.tins.bakw.features[a];
      ri(i, { forw: s, bakw: l });
    });
    const o = (this.pointsSet?.forw.features ?? []).map(
      (s) => s.properties.target.index
    );
    Ao(
      this.tins,
      i,
      this.pointsSet?.edges || [],
      o
    );
    const r = ["forw", "bakw"].map((s) => {
      const a = this.tins[s].features.map(
        (l) => l.geometry.coordinates[0]
      );
      return ei(a, t);
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
      if (Oo(r, this.points.length, o), s.length === 0 && a.length === 0) {
        n.push(r);
        continue;
      }
      s.unshift(this.points[r[0]][0]), s.push(this.points[r[1]][0]), a.unshift(this.points[r[0]][1]), a.push(this.points[r[1]][1]), Vr(s, a).map((l, f, h) => {
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
          (P) => Xe(P[0], B)
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
    const p = {}, v = u.geometry.coordinates[0];
    let w;
    try {
      w = v.map((B) => ({
        forw: B,
        bakw: ne(Lt(B), f)
      })), w.forEach((B) => {
        p[`${B.forw[0]}:${B.forw[1]}`] = B;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const S = mn(l.bakw);
    if (!S) throw "TOO LINEAR2";
    const _ = S.geometry.coordinates[0];
    try {
      w = _.map((B) => ({
        bakw: B,
        forw: ne(Lt(B), h)
      })), w.forEach((B) => {
        p[`${B.forw[0]}:${B.forw[1]}`] = B;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    let g;
    if (n) {
      const B = c.geometry.coordinates, T = f.features.find(
        (P) => Xe(
          Lt(B),
          P
        )
      );
      if (T) {
        const P = T.geometry.coordinates[0], D = T.properties.a.geom, x = T.properties.b.geom, I = T.properties.c.geom;
        g = {
          forw: [
            (P[0][0] + P[1][0] + P[2][0]) / 3,
            (P[0][1] + P[1][1] + P[2][1]) / 3
          ],
          bakw: [
            (D[0] + x[0] + I[0]) / 3,
            (D[1] + x[1] + I[1]) / 3
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
    const b = ie(g.forw, g.bakw, "c");
    this.centroid = {
      forw: b,
      bakw: re(b)
    };
    const d = [
      ...this.points.map((B) => ({ forw: B[0], bakw: B[1] })),
      ...(this.edgeNodes ?? []).map((B) => ({ forw: B[0], bakw: B[1] }))
    ], y = {
      convexBuf: p,
      centroid: g,
      allGcps: d,
      minx: o,
      maxx: r,
      miny: s,
      maxy: a
    }, m = this.vertexMode === lt.VERTEX_BIRDEYE ? Qr : Hr, k = n ? Fr(y, m, i, this.points.length) : void 0, O = k?.vertices ?? m(y, !1), A = {
      forw: [],
      bakw: []
    };
    for (let B = 0; B < O.length; B++) {
      const T = O[B].forw, P = O[B].bakw, D = ie(T, P, `b${B}`), x = re(D);
      i.forw.push(D), i.bakw.push(x), A.forw.push(D), A.bakw.push(x);
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
      t === lt.MODE_AUTO ? 1 : Dn
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
function Oo(e, t, n) {
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
  To as findIntersections,
  jn as format_version,
  ri as insertSearchIndex,
  Bn as vertexCalc
};
