function re(e, t, n = {}) {
  const i = { type: "Feature" };
  return (n.id === 0 || n.id) && (i.id = n.id), n.bbox && (i.bbox = n.bbox), i.properties = t || {}, i.geometry = e, i;
}
function $t(e, t, n = {}) {
  if (!e)
    throw new Error("coordinates is required");
  if (!Array.isArray(e))
    throw new Error("coordinates must be an Array");
  if (e.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!Ze(e[0]) || !Ze(e[1]))
    throw new Error("coordinates must contain numbers");
  return re({
    type: "Point",
    coordinates: e
  }, t, n);
}
function ae(e, t, n = {}) {
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
  return re({
    type: "Polygon",
    coordinates: e
  }, t, n);
}
function He(e, t, n = {}) {
  if (e.length < 2)
    throw new Error("coordinates must be an array of two or more positions");
  return re({
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
function ri(e) {
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
function oi(e) {
  return e.type === "Feature" ? e.geometry : e;
}
function qe(e, t, n) {
  if (e !== null)
    for (var i, o, r, s, a, l, f, u = 0, c = 0, h, p = e.type, M = p === "FeatureCollection", m = p === "Feature", S = M ? e.features.length : 1, _ = 0; _ < S; _++) {
      f = M ? (
        // @ts-expect-error: Known type conflict
        e.features[_].geometry
      ) : m ? (
        // @ts-expect-error: Known type conflict
        e.geometry
      ) : e, h = f ? f.type === "GeometryCollection" : !1, a = h ? f.geometries.length : 1;
      for (var g = 0; g < a; g++) {
        var v = 0, d = 0;
        if (s = h ? f.geometries[g] : f, s !== null) {
          l = s.coordinates;
          var b = s.type;
          switch (u = n && (b === "Polygon" || b === "MultiPolygon") ? 1 : 0, b) {
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
                c++, b === "MultiPoint" && v++;
              }
              b === "LineString" && v++;
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
                b === "MultiLineString" && v++, b === "Polygon" && d++;
              }
              b === "Polygon" && v++;
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
                  qe(s.geometries[i], t, n) === !1
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
const pt = 11102230246251565e-32, U = 134217729, $n = (3 + 8 * pt) * pt;
function ht(e, t, n, i, o) {
  let r, s, a, l, f = t[0], u = i[0], c = 0, h = 0;
  u > f == u > -f ? (r = f, f = t[++c]) : (r = u, u = i[++h]);
  let p = 0;
  if (c < e && h < n)
    for (u > f == u > -f ? (s = f + r, a = r - (s - f), f = t[++c]) : (s = u + r, a = r - (s - u), u = i[++h]), r = s, a !== 0 && (o[p++] = a); c < e && h < n; )
      u > f == u > -f ? (s = r + f, l = s - r, a = r - (s - l) + (f - l), f = t[++c]) : (s = r + u, l = s - r, a = r - (s - l) + (u - l), u = i[++h]), r = s, a !== 0 && (o[p++] = a);
  for (; c < e; )
    s = r + f, l = s - r, a = r - (s - l) + (f - l), f = t[++c], r = s, a !== 0 && (o[p++] = a);
  for (; h < n; )
    s = r + u, l = s - r, a = r - (s - l) + (u - l), u = i[++h], r = s, a !== 0 && (o[p++] = a);
  return (r !== 0 || p === 0) && (o[p++] = r), p;
}
function _t(e, t, n, i, o, r, s, a) {
  return ht(ht(e, t, n, i, s), s, o, r, a);
}
function $(e, t, n, i) {
  let o, r, s, a, l, f, u, c, h, p, M;
  u = U * n, p = u - (u - n), M = n - p;
  let m = t[0];
  o = m * n, u = U * m, c = u - (u - m), h = m - c, s = h * M - (o - c * p - h * p - c * M);
  let S = 0;
  s !== 0 && (i[S++] = s);
  for (let _ = 1; _ < e; _++)
    m = t[_], a = m * n, u = U * m, c = u - (u - m), h = m - c, l = h * M - (a - c * p - h * p - c * M), r = o + l, f = r - o, s = o - (r - f) + (l - f), s !== 0 && (i[S++] = s), o = a + r, s = r - (o - a), s !== 0 && (i[S++] = s);
  return (o !== 0 || S === 0) && (i[S++] = o), S;
}
function Ln(e, t) {
  let n = t[0];
  for (let i = 1; i < e; i++) n += t[i];
  return n;
}
function tt(e) {
  return new Float64Array(e);
}
const si = (3 + 16 * pt) * pt, ai = (2 + 12 * pt) * pt, ci = (9 + 64 * pt) * pt * pt, Ut = tt(4), tn = tt(8), en = tt(12), nn = tt(16), gt = tt(4);
function fi(e, t, n, i, o, r, s) {
  let a, l, f, u, c, h, p, M, m, S, _, g, v, d, b, w, E, B;
  const P = e - o, I = n - o, O = t - r, X = i - r;
  d = P * X, h = U * P, p = h - (h - P), M = P - p, h = U * X, m = h - (h - X), S = X - m, b = M * S - (d - p * m - M * m - p * S), w = O * I, h = U * O, p = h - (h - O), M = O - p, h = U * I, m = h - (h - I), S = I - m, E = M * S - (w - p * m - M * m - p * S), _ = b - E, c = b - _, Ut[0] = b - (_ + c) + (c - E), g = d + _, c = g - d, v = d - (g - c) + (_ - c), _ = v - w, c = v - _, Ut[1] = v - (_ + c) + (c - w), B = g + _, c = B - g, Ut[2] = g - (B - c) + (_ - c), Ut[3] = B;
  let R = Ln(4, Ut), y = ai * s;
  if (R >= y || -R >= y || (c = e - P, a = e - (P + c) + (c - o), c = n - I, f = n - (I + c) + (c - o), c = t - O, l = t - (O + c) + (c - r), c = i - X, u = i - (X + c) + (c - r), a === 0 && l === 0 && f === 0 && u === 0) || (y = ci * s + $n * Math.abs(R), R += P * u + X * a - (O * f + I * l), R >= y || -R >= y)) return R;
  d = a * X, h = U * a, p = h - (h - a), M = a - p, h = U * X, m = h - (h - X), S = X - m, b = M * S - (d - p * m - M * m - p * S), w = l * I, h = U * l, p = h - (h - l), M = l - p, h = U * I, m = h - (h - I), S = I - m, E = M * S - (w - p * m - M * m - p * S), _ = b - E, c = b - _, gt[0] = b - (_ + c) + (c - E), g = d + _, c = g - d, v = d - (g - c) + (_ - c), _ = v - w, c = v - _, gt[1] = v - (_ + c) + (c - w), B = g + _, c = B - g, gt[2] = g - (B - c) + (_ - c), gt[3] = B;
  const A = ht(4, Ut, 4, gt, tn);
  d = P * u, h = U * P, p = h - (h - P), M = P - p, h = U * u, m = h - (h - u), S = u - m, b = M * S - (d - p * m - M * m - p * S), w = O * f, h = U * O, p = h - (h - O), M = O - p, h = U * f, m = h - (h - f), S = f - m, E = M * S - (w - p * m - M * m - p * S), _ = b - E, c = b - _, gt[0] = b - (_ + c) + (c - E), g = d + _, c = g - d, v = d - (g - c) + (_ - c), _ = v - w, c = v - _, gt[1] = v - (_ + c) + (c - w), B = g + _, c = B - g, gt[2] = g - (B - c) + (_ - c), gt[3] = B;
  const k = ht(A, tn, 4, gt, en);
  d = a * u, h = U * a, p = h - (h - a), M = a - p, h = U * u, m = h - (h - u), S = u - m, b = M * S - (d - p * m - M * m - p * S), w = l * f, h = U * l, p = h - (h - l), M = l - p, h = U * f, m = h - (h - f), S = f - m, E = M * S - (w - p * m - M * m - p * S), _ = b - E, c = b - _, gt[0] = b - (_ + c) + (c - E), g = d + _, c = g - d, v = d - (g - c) + (_ - c), _ = v - w, c = v - _, gt[1] = v - (_ + c) + (c - w), B = g + _, c = B - g, gt[2] = g - (B - c) + (_ - c), gt[3] = B;
  const T = ht(k, en, 4, gt, nn);
  return nn[T - 1];
}
function It(e, t, n, i, o, r) {
  const s = (t - r) * (n - o), a = (e - o) * (i - r), l = s - a, f = Math.abs(s + a);
  return Math.abs(l) >= si * f ? l : -fi(e, t, n, i, o, r, f);
}
const li = (10 + 96 * pt) * pt, hi = (4 + 48 * pt) * pt, ui = (44 + 576 * pt) * pt * pt, Ct = tt(4), Dt = tt(4), Yt = tt(4), kt = tt(4), Et = tt(4), At = tt(4), mt = tt(4), wt = tt(4), Ae = tt(8), Pe = tt(8), Ie = tt(8), Be = tt(8), Oe = tt(8), Ne = tt(8), le = tt(8), he = tt(8), ue = tt(8), Lt = tt(4), jt = tt(4), Vt = tt(4), z = tt(8), J = tt(16), nt = tt(16), it = tt(16), et = tt(32), Rt = tt(32), at = tt(48), bt = tt(64);
let Jt = tt(1152), Te = tt(1152);
function ct(e, t, n) {
  e = ht(e, Jt, t, n, Te);
  const i = Jt;
  return Jt = Te, Te = i, e;
}
function di(e, t, n, i, o, r, s, a, l) {
  let f, u, c, h, p, M, m, S, _, g, v, d, b, w, E, B, P, I, O, X, R, y, A, k, T, C, Y, x, N, D, F, L, j, q, V;
  const G = e - s, W = n - s, K = o - s, Q = t - a, Z = i - a, H = r - a;
  F = W * H, A = U * W, k = A - (A - W), T = W - k, A = U * H, C = A - (A - H), Y = H - C, L = T * Y - (F - k * C - T * C - k * Y), j = K * Z, A = U * K, k = A - (A - K), T = K - k, A = U * Z, C = A - (A - Z), Y = Z - C, q = T * Y - (j - k * C - T * C - k * Y), x = L - q, y = L - x, Ct[0] = L - (x + y) + (y - q), N = F + x, y = N - F, D = F - (N - y) + (x - y), x = D - j, y = D - x, Ct[1] = D - (x + y) + (y - j), V = N + x, y = V - N, Ct[2] = N - (V - y) + (x - y), Ct[3] = V, F = K * Q, A = U * K, k = A - (A - K), T = K - k, A = U * Q, C = A - (A - Q), Y = Q - C, L = T * Y - (F - k * C - T * C - k * Y), j = G * H, A = U * G, k = A - (A - G), T = G - k, A = U * H, C = A - (A - H), Y = H - C, q = T * Y - (j - k * C - T * C - k * Y), x = L - q, y = L - x, Dt[0] = L - (x + y) + (y - q), N = F + x, y = N - F, D = F - (N - y) + (x - y), x = D - j, y = D - x, Dt[1] = D - (x + y) + (y - j), V = N + x, y = V - N, Dt[2] = N - (V - y) + (x - y), Dt[3] = V, F = G * Z, A = U * G, k = A - (A - G), T = G - k, A = U * Z, C = A - (A - Z), Y = Z - C, L = T * Y - (F - k * C - T * C - k * Y), j = W * Q, A = U * W, k = A - (A - W), T = W - k, A = U * Q, C = A - (A - Q), Y = Q - C, q = T * Y - (j - k * C - T * C - k * Y), x = L - q, y = L - x, Yt[0] = L - (x + y) + (y - q), N = F + x, y = N - F, D = F - (N - y) + (x - y), x = D - j, y = D - x, Yt[1] = D - (x + y) + (y - j), V = N + x, y = V - N, Yt[2] = N - (V - y) + (x - y), Yt[3] = V, f = ht(
    ht(
      ht(
        $($(4, Ct, G, z), z, G, J),
        J,
        $($(4, Ct, Q, z), z, Q, nt),
        nt,
        et
      ),
      et,
      ht(
        $($(4, Dt, W, z), z, W, J),
        J,
        $($(4, Dt, Z, z), z, Z, nt),
        nt,
        Rt
      ),
      Rt,
      bt
    ),
    bt,
    ht(
      $($(4, Yt, K, z), z, K, J),
      J,
      $($(4, Yt, H, z), z, H, nt),
      nt,
      et
    ),
    et,
    Jt
  );
  let st = Ln(f, Jt), lt = hi * l;
  if (st >= lt || -st >= lt || (y = e - G, u = e - (G + y) + (y - s), y = t - Q, p = t - (Q + y) + (y - a), y = n - W, c = n - (W + y) + (y - s), y = i - Z, M = i - (Z + y) + (y - a), y = o - K, h = o - (K + y) + (y - s), y = r - H, m = r - (H + y) + (y - a), u === 0 && c === 0 && h === 0 && p === 0 && M === 0 && m === 0) || (lt = ui * l + $n * Math.abs(st), st += (G * G + Q * Q) * (W * m + H * c - (Z * h + K * M)) + 2 * (G * u + Q * p) * (W * H - Z * K) + ((W * W + Z * Z) * (K * p + Q * h - (H * u + G * m)) + 2 * (W * c + Z * M) * (K * Q - H * G)) + ((K * K + H * H) * (G * M + Z * u - (Q * c + W * p)) + 2 * (K * h + H * m) * (G * Z - Q * W)), st >= lt || -st >= lt))
    return st;
  if ((c !== 0 || M !== 0 || h !== 0 || m !== 0) && (F = G * G, A = U * G, k = A - (A - G), T = G - k, L = T * T - (F - k * k - (k + k) * T), j = Q * Q, A = U * Q, k = A - (A - Q), T = Q - k, q = T * T - (j - k * k - (k + k) * T), x = L + q, y = x - L, kt[0] = L - (x - y) + (q - y), N = F + x, y = N - F, D = F - (N - y) + (x - y), x = D + j, y = x - D, kt[1] = D - (x - y) + (j - y), V = N + x, y = V - N, kt[2] = N - (V - y) + (x - y), kt[3] = V), (h !== 0 || m !== 0 || u !== 0 || p !== 0) && (F = W * W, A = U * W, k = A - (A - W), T = W - k, L = T * T - (F - k * k - (k + k) * T), j = Z * Z, A = U * Z, k = A - (A - Z), T = Z - k, q = T * T - (j - k * k - (k + k) * T), x = L + q, y = x - L, Et[0] = L - (x - y) + (q - y), N = F + x, y = N - F, D = F - (N - y) + (x - y), x = D + j, y = x - D, Et[1] = D - (x - y) + (j - y), V = N + x, y = V - N, Et[2] = N - (V - y) + (x - y), Et[3] = V), (u !== 0 || p !== 0 || c !== 0 || M !== 0) && (F = K * K, A = U * K, k = A - (A - K), T = K - k, L = T * T - (F - k * k - (k + k) * T), j = H * H, A = U * H, k = A - (A - H), T = H - k, q = T * T - (j - k * k - (k + k) * T), x = L + q, y = x - L, At[0] = L - (x - y) + (q - y), N = F + x, y = N - F, D = F - (N - y) + (x - y), x = D + j, y = x - D, At[1] = D - (x - y) + (j - y), V = N + x, y = V - N, At[2] = N - (V - y) + (x - y), At[3] = V), u !== 0 && (S = $(4, Ct, u, Ae), f = ct(f, _t(
    $(S, Ae, 2 * G, J),
    J,
    $($(4, At, u, z), z, Z, nt),
    nt,
    $($(4, Et, u, z), z, -H, it),
    it,
    et,
    at
  ), at)), p !== 0 && (_ = $(4, Ct, p, Pe), f = ct(f, _t(
    $(_, Pe, 2 * Q, J),
    J,
    $($(4, Et, p, z), z, K, nt),
    nt,
    $($(4, At, p, z), z, -W, it),
    it,
    et,
    at
  ), at)), c !== 0 && (g = $(4, Dt, c, Ie), f = ct(f, _t(
    $(g, Ie, 2 * W, J),
    J,
    $($(4, kt, c, z), z, H, nt),
    nt,
    $($(4, At, c, z), z, -Q, it),
    it,
    et,
    at
  ), at)), M !== 0 && (v = $(4, Dt, M, Be), f = ct(f, _t(
    $(v, Be, 2 * Z, J),
    J,
    $($(4, At, M, z), z, G, nt),
    nt,
    $($(4, kt, M, z), z, -K, it),
    it,
    et,
    at
  ), at)), h !== 0 && (d = $(4, Yt, h, Oe), f = ct(f, _t(
    $(d, Oe, 2 * K, J),
    J,
    $($(4, Et, h, z), z, Q, nt),
    nt,
    $($(4, kt, h, z), z, -Z, it),
    it,
    et,
    at
  ), at)), m !== 0 && (b = $(4, Yt, m, Ne), f = ct(f, _t(
    $(b, Ne, 2 * H, J),
    J,
    $($(4, kt, m, z), z, W, nt),
    nt,
    $($(4, Et, m, z), z, -G, it),
    it,
    et,
    at
  ), at)), u !== 0 || p !== 0) {
    if (c !== 0 || M !== 0 || h !== 0 || m !== 0 ? (F = c * H, A = U * c, k = A - (A - c), T = c - k, A = U * H, C = A - (A - H), Y = H - C, L = T * Y - (F - k * C - T * C - k * Y), j = W * m, A = U * W, k = A - (A - W), T = W - k, A = U * m, C = A - (A - m), Y = m - C, q = T * Y - (j - k * C - T * C - k * Y), x = L + q, y = x - L, mt[0] = L - (x - y) + (q - y), N = F + x, y = N - F, D = F - (N - y) + (x - y), x = D + j, y = x - D, mt[1] = D - (x - y) + (j - y), V = N + x, y = V - N, mt[2] = N - (V - y) + (x - y), mt[3] = V, F = h * -Z, A = U * h, k = A - (A - h), T = h - k, A = U * -Z, C = A - (A - -Z), Y = -Z - C, L = T * Y - (F - k * C - T * C - k * Y), j = K * -M, A = U * K, k = A - (A - K), T = K - k, A = U * -M, C = A - (A - -M), Y = -M - C, q = T * Y - (j - k * C - T * C - k * Y), x = L + q, y = x - L, wt[0] = L - (x - y) + (q - y), N = F + x, y = N - F, D = F - (N - y) + (x - y), x = D + j, y = x - D, wt[1] = D - (x - y) + (j - y), V = N + x, y = V - N, wt[2] = N - (V - y) + (x - y), wt[3] = V, E = ht(4, mt, 4, wt, he), F = c * m, A = U * c, k = A - (A - c), T = c - k, A = U * m, C = A - (A - m), Y = m - C, L = T * Y - (F - k * C - T * C - k * Y), j = h * M, A = U * h, k = A - (A - h), T = h - k, A = U * M, C = A - (A - M), Y = M - C, q = T * Y - (j - k * C - T * C - k * Y), x = L - q, y = L - x, jt[0] = L - (x + y) + (y - q), N = F + x, y = N - F, D = F - (N - y) + (x - y), x = D - j, y = D - x, jt[1] = D - (x + y) + (y - j), V = N + x, y = V - N, jt[2] = N - (V - y) + (x - y), jt[3] = V, I = 4) : (he[0] = 0, E = 1, jt[0] = 0, I = 1), u !== 0) {
      const rt = $(E, he, u, it);
      f = ct(f, ht(
        $(S, Ae, u, J),
        J,
        $(rt, it, 2 * G, et),
        et,
        at
      ), at);
      const ot = $(I, jt, u, z);
      f = ct(f, _t(
        $(ot, z, 2 * G, J),
        J,
        $(ot, z, u, nt),
        nt,
        $(rt, it, u, et),
        et,
        Rt,
        bt
      ), bt), M !== 0 && (f = ct(f, $($(4, At, u, z), z, M, J), J)), m !== 0 && (f = ct(f, $($(4, Et, -u, z), z, m, J), J));
    }
    if (p !== 0) {
      const rt = $(E, he, p, it);
      f = ct(f, ht(
        $(_, Pe, p, J),
        J,
        $(rt, it, 2 * Q, et),
        et,
        at
      ), at);
      const ot = $(I, jt, p, z);
      f = ct(f, _t(
        $(ot, z, 2 * Q, J),
        J,
        $(ot, z, p, nt),
        nt,
        $(rt, it, p, et),
        et,
        Rt,
        bt
      ), bt);
    }
  }
  if (c !== 0 || M !== 0) {
    if (h !== 0 || m !== 0 || u !== 0 || p !== 0 ? (F = h * Q, A = U * h, k = A - (A - h), T = h - k, A = U * Q, C = A - (A - Q), Y = Q - C, L = T * Y - (F - k * C - T * C - k * Y), j = K * p, A = U * K, k = A - (A - K), T = K - k, A = U * p, C = A - (A - p), Y = p - C, q = T * Y - (j - k * C - T * C - k * Y), x = L + q, y = x - L, mt[0] = L - (x - y) + (q - y), N = F + x, y = N - F, D = F - (N - y) + (x - y), x = D + j, y = x - D, mt[1] = D - (x - y) + (j - y), V = N + x, y = V - N, mt[2] = N - (V - y) + (x - y), mt[3] = V, X = -H, R = -m, F = u * X, A = U * u, k = A - (A - u), T = u - k, A = U * X, C = A - (A - X), Y = X - C, L = T * Y - (F - k * C - T * C - k * Y), j = G * R, A = U * G, k = A - (A - G), T = G - k, A = U * R, C = A - (A - R), Y = R - C, q = T * Y - (j - k * C - T * C - k * Y), x = L + q, y = x - L, wt[0] = L - (x - y) + (q - y), N = F + x, y = N - F, D = F - (N - y) + (x - y), x = D + j, y = x - D, wt[1] = D - (x - y) + (j - y), V = N + x, y = V - N, wt[2] = N - (V - y) + (x - y), wt[3] = V, B = ht(4, mt, 4, wt, ue), F = h * p, A = U * h, k = A - (A - h), T = h - k, A = U * p, C = A - (A - p), Y = p - C, L = T * Y - (F - k * C - T * C - k * Y), j = u * m, A = U * u, k = A - (A - u), T = u - k, A = U * m, C = A - (A - m), Y = m - C, q = T * Y - (j - k * C - T * C - k * Y), x = L - q, y = L - x, Vt[0] = L - (x + y) + (y - q), N = F + x, y = N - F, D = F - (N - y) + (x - y), x = D - j, y = D - x, Vt[1] = D - (x + y) + (y - j), V = N + x, y = V - N, Vt[2] = N - (V - y) + (x - y), Vt[3] = V, O = 4) : (ue[0] = 0, B = 1, Vt[0] = 0, O = 1), c !== 0) {
      const rt = $(B, ue, c, it);
      f = ct(f, ht(
        $(g, Ie, c, J),
        J,
        $(rt, it, 2 * W, et),
        et,
        at
      ), at);
      const ot = $(O, Vt, c, z);
      f = ct(f, _t(
        $(ot, z, 2 * W, J),
        J,
        $(ot, z, c, nt),
        nt,
        $(rt, it, c, et),
        et,
        Rt,
        bt
      ), bt), m !== 0 && (f = ct(f, $($(4, kt, c, z), z, m, J), J)), p !== 0 && (f = ct(f, $($(4, At, -c, z), z, p, J), J));
    }
    if (M !== 0) {
      const rt = $(B, ue, M, it);
      f = ct(f, ht(
        $(v, Be, M, J),
        J,
        $(rt, it, 2 * Z, et),
        et,
        at
      ), at);
      const ot = $(O, Vt, M, z);
      f = ct(f, _t(
        $(ot, z, 2 * Z, J),
        J,
        $(ot, z, M, nt),
        nt,
        $(rt, it, M, et),
        et,
        Rt,
        bt
      ), bt);
    }
  }
  if (h !== 0 || m !== 0) {
    if (u !== 0 || p !== 0 || c !== 0 || M !== 0 ? (F = u * Z, A = U * u, k = A - (A - u), T = u - k, A = U * Z, C = A - (A - Z), Y = Z - C, L = T * Y - (F - k * C - T * C - k * Y), j = G * M, A = U * G, k = A - (A - G), T = G - k, A = U * M, C = A - (A - M), Y = M - C, q = T * Y - (j - k * C - T * C - k * Y), x = L + q, y = x - L, mt[0] = L - (x - y) + (q - y), N = F + x, y = N - F, D = F - (N - y) + (x - y), x = D + j, y = x - D, mt[1] = D - (x - y) + (j - y), V = N + x, y = V - N, mt[2] = N - (V - y) + (x - y), mt[3] = V, X = -Q, R = -p, F = c * X, A = U * c, k = A - (A - c), T = c - k, A = U * X, C = A - (A - X), Y = X - C, L = T * Y - (F - k * C - T * C - k * Y), j = W * R, A = U * W, k = A - (A - W), T = W - k, A = U * R, C = A - (A - R), Y = R - C, q = T * Y - (j - k * C - T * C - k * Y), x = L + q, y = x - L, wt[0] = L - (x - y) + (q - y), N = F + x, y = N - F, D = F - (N - y) + (x - y), x = D + j, y = x - D, wt[1] = D - (x - y) + (j - y), V = N + x, y = V - N, wt[2] = N - (V - y) + (x - y), wt[3] = V, w = ht(4, mt, 4, wt, le), F = u * M, A = U * u, k = A - (A - u), T = u - k, A = U * M, C = A - (A - M), Y = M - C, L = T * Y - (F - k * C - T * C - k * Y), j = c * p, A = U * c, k = A - (A - c), T = c - k, A = U * p, C = A - (A - p), Y = p - C, q = T * Y - (j - k * C - T * C - k * Y), x = L - q, y = L - x, Lt[0] = L - (x + y) + (y - q), N = F + x, y = N - F, D = F - (N - y) + (x - y), x = D - j, y = D - x, Lt[1] = D - (x + y) + (y - j), V = N + x, y = V - N, Lt[2] = N - (V - y) + (x - y), Lt[3] = V, P = 4) : (le[0] = 0, w = 1, Lt[0] = 0, P = 1), h !== 0) {
      const rt = $(w, le, h, it);
      f = ct(f, ht(
        $(d, Oe, h, J),
        J,
        $(rt, it, 2 * K, et),
        et,
        at
      ), at);
      const ot = $(P, Lt, h, z);
      f = ct(f, _t(
        $(ot, z, 2 * K, J),
        J,
        $(ot, z, h, nt),
        nt,
        $(rt, it, h, et),
        et,
        Rt,
        bt
      ), bt), p !== 0 && (f = ct(f, $($(4, Et, h, z), z, p, J), J)), M !== 0 && (f = ct(f, $($(4, kt, -h, z), z, M, J), J));
    }
    if (m !== 0) {
      const rt = $(w, le, m, it);
      f = ct(f, ht(
        $(b, Ne, m, J),
        J,
        $(rt, it, 2 * H, et),
        et,
        at
      ), at);
      const ot = $(P, Lt, m, z);
      f = ct(f, _t(
        $(ot, z, 2 * H, J),
        J,
        $(ot, z, m, nt),
        nt,
        $(rt, it, m, et),
        et,
        Rt,
        bt
      ), bt);
    }
  }
  return Jt[f - 1];
}
function pi(e, t, n, i, o, r, s, a) {
  const l = e - s, f = n - s, u = o - s, c = t - a, h = i - a, p = r - a, M = f * p, m = u * h, S = l * l + c * c, _ = u * c, g = l * p, v = f * f + h * h, d = l * h, b = f * c, w = u * u + p * p, E = S * (M - m) + v * (_ - g) + w * (d - b), B = (Math.abs(M) + Math.abs(m)) * S + (Math.abs(_) + Math.abs(g)) * v + (Math.abs(d) + Math.abs(b)) * w, P = li * B;
  return E > P || -E > P ? E : di(e, t, n, i, o, r, s, a, B);
}
function gi(e, t) {
  var n, i, o = 0, r, s, a, l, f, u, c, h = e[0], p = e[1], M = t.length;
  for (n = 0; n < M; n++) {
    i = 0;
    var m = t[n], S = m.length - 1;
    if (u = m[0], u[0] !== m[S][0] && u[1] !== m[S][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (s = u[0] - h, a = u[1] - p, i; i < S; i++) {
      if (c = m[i + 1], l = c[0] - h, f = c[1] - p, a === 0 && f === 0) {
        if (l <= 0 && s >= 0 || s <= 0 && l >= 0)
          return 0;
      } else if (f >= 0 && a <= 0 || f <= 0 && a >= 0) {
        if (r = It(s, l, a, f, 0, 0), r === 0)
          return 0;
        (r > 0 && f > 0 && a <= 0 || r < 0 && f <= 0 && a > 0) && o++;
      }
      u = c, a = f, s = l;
    }
  }
  return o % 2 !== 0;
}
function Xe(e, t, n = {}) {
  if (!e)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const i = ri(e), o = oi(t), r = o.type, s = t.bbox;
  let a = o.coordinates;
  if (s && mi(i, s) === !1)
    return !1;
  r === "Polygon" && (a = [a]);
  for (var l = 0; l < a.length; ++l) {
    const f = gi(i, a[l]);
    if (f === 0 && !n.ignoreBoundary) return !0;
    if (f) return !0;
  }
  return !1;
}
function mi(e, t) {
  return t[0] <= e[0] && t[1] <= e[1] && t[2] >= e[0] && t[3] >= e[1];
}
class Ue {
  constructor(t = [], n = wi) {
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
function wi(e, t) {
  return e < t ? -1 : e > t ? 1 : 0;
}
const yi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ue
}, Symbol.toStringTag, { value: "Module" })), Nt = 11102230246251565e-32, ut = 134217729, vi = (3 + 8 * Nt) * Nt;
function Ce(e, t, n, i, o) {
  let r, s, a, l, f = t[0], u = i[0], c = 0, h = 0;
  u > f == u > -f ? (r = f, f = t[++c]) : (r = u, u = i[++h]);
  let p = 0;
  if (c < e && h < n)
    for (u > f == u > -f ? (s = f + r, a = r - (s - f), f = t[++c]) : (s = u + r, a = r - (s - u), u = i[++h]), r = s, a !== 0 && (o[p++] = a); c < e && h < n; )
      u > f == u > -f ? (s = r + f, l = s - r, a = r - (s - l) + (f - l), f = t[++c]) : (s = r + u, l = s - r, a = r - (s - l) + (u - l), u = i[++h]), r = s, a !== 0 && (o[p++] = a);
  for (; c < e; )
    s = r + f, l = s - r, a = r - (s - l) + (f - l), f = t[++c], r = s, a !== 0 && (o[p++] = a);
  for (; h < n; )
    s = r + u, l = s - r, a = r - (s - l) + (u - l), u = i[++h], r = s, a !== 0 && (o[p++] = a);
  return (r !== 0 || p === 0) && (o[p++] = r), p;
}
function bi(e, t) {
  let n = t[0];
  for (let i = 1; i < e; i++) n += t[i];
  return n;
}
function ce(e) {
  return new Float64Array(e);
}
const xi = (3 + 16 * Nt) * Nt, _i = (2 + 12 * Nt) * Nt, Mi = (9 + 64 * Nt) * Nt * Nt, zt = ce(4), rn = ce(8), on = ce(12), sn = ce(16), yt = ce(4);
function Si(e, t, n, i, o, r, s) {
  let a, l, f, u, c, h, p, M, m, S, _, g, v, d, b, w, E, B;
  const P = e - o, I = n - o, O = t - r, X = i - r;
  d = P * X, h = ut * P, p = h - (h - P), M = P - p, h = ut * X, m = h - (h - X), S = X - m, b = M * S - (d - p * m - M * m - p * S), w = O * I, h = ut * O, p = h - (h - O), M = O - p, h = ut * I, m = h - (h - I), S = I - m, E = M * S - (w - p * m - M * m - p * S), _ = b - E, c = b - _, zt[0] = b - (_ + c) + (c - E), g = d + _, c = g - d, v = d - (g - c) + (_ - c), _ = v - w, c = v - _, zt[1] = v - (_ + c) + (c - w), B = g + _, c = B - g, zt[2] = g - (B - c) + (_ - c), zt[3] = B;
  let R = bi(4, zt), y = _i * s;
  if (R >= y || -R >= y || (c = e - P, a = e - (P + c) + (c - o), c = n - I, f = n - (I + c) + (c - o), c = t - O, l = t - (O + c) + (c - r), c = i - X, u = i - (X + c) + (c - r), a === 0 && l === 0 && f === 0 && u === 0) || (y = Mi * s + vi * Math.abs(R), R += P * u + X * a - (O * f + I * l), R >= y || -R >= y)) return R;
  d = a * X, h = ut * a, p = h - (h - a), M = a - p, h = ut * X, m = h - (h - X), S = X - m, b = M * S - (d - p * m - M * m - p * S), w = l * I, h = ut * l, p = h - (h - l), M = l - p, h = ut * I, m = h - (h - I), S = I - m, E = M * S - (w - p * m - M * m - p * S), _ = b - E, c = b - _, yt[0] = b - (_ + c) + (c - E), g = d + _, c = g - d, v = d - (g - c) + (_ - c), _ = v - w, c = v - _, yt[1] = v - (_ + c) + (c - w), B = g + _, c = B - g, yt[2] = g - (B - c) + (_ - c), yt[3] = B;
  const A = Ce(4, zt, 4, yt, rn);
  d = P * u, h = ut * P, p = h - (h - P), M = P - p, h = ut * u, m = h - (h - u), S = u - m, b = M * S - (d - p * m - M * m - p * S), w = O * f, h = ut * O, p = h - (h - O), M = O - p, h = ut * f, m = h - (h - f), S = f - m, E = M * S - (w - p * m - M * m - p * S), _ = b - E, c = b - _, yt[0] = b - (_ + c) + (c - E), g = d + _, c = g - d, v = d - (g - c) + (_ - c), _ = v - w, c = v - _, yt[1] = v - (_ + c) + (c - w), B = g + _, c = B - g, yt[2] = g - (B - c) + (_ - c), yt[3] = B;
  const k = Ce(A, rn, 4, yt, on);
  d = a * u, h = ut * a, p = h - (h - a), M = a - p, h = ut * u, m = h - (h - u), S = u - m, b = M * S - (d - p * m - M * m - p * S), w = l * f, h = ut * l, p = h - (h - l), M = l - p, h = ut * f, m = h - (h - f), S = f - m, E = M * S - (w - p * m - M * m - p * S), _ = b - E, c = b - _, yt[0] = b - (_ + c) + (c - E), g = d + _, c = g - d, v = d - (g - c) + (_ - c), _ = v - w, c = v - _, yt[1] = v - (_ + c) + (c - w), B = g + _, c = B - g, yt[2] = g - (B - c) + (_ - c), yt[3] = B;
  const T = Ce(k, on, 4, yt, sn);
  return sn[T - 1];
}
function an(e, t, n, i, o, r) {
  const s = (t - r) * (n - o), a = (e - o) * (i - r), l = s - a;
  if (s === 0 || a === 0 || s > 0 != a > 0) return l;
  const f = Math.abs(s + a);
  return Math.abs(l) >= xi * f ? l : -Si(e, t, n, i, o, r, f);
}
function ki(e, t) {
  const n = new Ue([], jn);
  return Ai(e, n), Pi(n, t);
}
function jn(e, t) {
  return e.p.x > t.p.x ? 1 : e.p.x < t.p.x || e.p.x === t.p.x && (e.featureId !== t.featureId || e.ringId !== t.ringId) && e.isLeftEndpoint && !t.isLeftEndpoint ? -1 : e.p.y !== t.p.y ? e.p.y > t.p.y ? 1 : -1 : 1;
}
function Ei(e, t) {
  return e.rightSweepEvent.p.x > t.rightSweepEvent.p.x ? 1 : e.rightSweepEvent.p.x < t.rightSweepEvent.p.x ? -1 : e.rightSweepEvent.p.y !== t.rightSweepEvent.p.y ? e.rightSweepEvent.p.y < t.rightSweepEvent.p.y ? 1 : -1 : 1;
}
function Ai(e, t) {
  if (e.type === "FeatureCollection") {
    const n = e.features;
    for (let i = 0; i < n.length; i++)
      cn(n[i], t);
  } else
    cn(e, t);
}
var de = 0, pe = 0, ge = 0;
function cn(e, t) {
  const n = e.type === "Feature" ? e.geometry : e;
  let i = n.coordinates;
  (n.type === "Polygon" || n.type === "MultiLineString") && (i = [i]), n.type === "LineString" && (i = [[i]]);
  for (let o = 0; o < i.length; o++)
    for (let r = 0; r < i[o].length; r++) {
      let s = i[o][r][0], a = null;
      pe = pe + 1;
      for (let l = 0; l < i[o][r].length - 1; l++) {
        a = i[o][r][l + 1];
        const f = new fn(s, de, pe, ge), u = new fn(a, de, pe, ge + 1);
        f.otherEvent = u, u.otherEvent = f, jn(f, u) > 0 ? (u.isLeftEndpoint = !0, f.isLeftEndpoint = !1) : (f.isLeftEndpoint = !0, u.isLeftEndpoint = !1), t.push(f), t.push(u), s = a, ge = ge + 1;
      }
    }
  de = de + 1;
}
var fn = class {
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
  const n = [], i = new Ue([], Ei);
  for (; e.length; ) {
    const o = e.pop();
    if (o.isLeftEndpoint) {
      const r = new Ii(o);
      for (let s = 0; s < i.data.length; s++) {
        const a = i.data[s];
        if (t && a.leftSweepEvent.featureId === o.featureId)
          continue;
        const l = Bi(r, a);
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
function Bi(e, t) {
  if (e === null || t === null) return !1;
  const n = e.leftSweepEvent.p.x, i = e.leftSweepEvent.p.y, o = e.rightSweepEvent.p.x, r = e.rightSweepEvent.p.y, s = t.leftSweepEvent.p.x, a = t.leftSweepEvent.p.y, l = t.rightSweepEvent.p.x, f = t.rightSweepEvent.p.y, u = an(n, i, o, r, s, a), c = an(n, i, o, r, l, f);
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
  const h = (f - a) * (o - n) - (l - s) * (r - i), p = (l - s) * (i - a) - (f - a) * (n - s), M = (o - n) * (i - a) - (r - i) * (n - s);
  if (h === 0)
    return !1;
  const m = p / h, S = M / h;
  if (m >= 0 && m <= 1 && S >= 0 && S <= 1) {
    const _ = n + m * (o - n), g = i + m * (r - i);
    return [_, g];
  }
  return !1;
}
function Oi(e, t, n = {}) {
  const { removeDuplicates: i = !0, ignoreSelfIntersections: o = !0 } = n;
  let r = [];
  e.type === "FeatureCollection" ? r = r.concat(e.features) : e.type === "Feature" ? r.push(e) : (e.type === "LineString" || e.type === "Polygon" || e.type === "MultiLineString" || e.type === "MultiPolygon") && r.push(re(e)), t.type === "FeatureCollection" ? r = r.concat(t.features) : t.type === "Feature" ? r.push(t) : (t.type === "LineString" || t.type === "Polygon" || t.type === "MultiLineString" || t.type === "MultiPolygon") && r.push(re(t));
  const s = ki(
    St(r),
    o
  );
  let a = [];
  if (i) {
    const l = {};
    s.forEach((f) => {
      const u = f.join(",");
      l[u] || (l[u] = !0, a.push(f));
    });
  } else
    a = s;
  return St(a.map((l) => $t(l)));
}
function Ni(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function Ti(e) {
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
  return qe(
    e,
    function(r) {
      n += r[0], i += r[1], o++;
    },
    !0
  ), $t([n / o, i / o], t.properties);
}
var me = { exports: {} }, Se = { exports: {} }, Ci = Se.exports, ln;
function Di() {
  return ln || (ln = 1, (function(e, t) {
    (function(n, i) {
      e.exports = i();
    })(Ci, function() {
      function n(g, v, d, b, w) {
        (function E(B, P, I, O, X) {
          for (; O > I; ) {
            if (O - I > 600) {
              var R = O - I + 1, y = P - I + 1, A = Math.log(R), k = 0.5 * Math.exp(2 * A / 3), T = 0.5 * Math.sqrt(A * k * (R - k) / R) * (y - R / 2 < 0 ? -1 : 1), C = Math.max(I, Math.floor(P - y * k / R + T)), Y = Math.min(O, Math.floor(P + (R - y) * k / R + T));
              E(B, P, C, Y, X);
            }
            var x = B[P], N = I, D = O;
            for (i(B, I, P), X(B[O], x) > 0 && i(B, I, O); N < D; ) {
              for (i(B, N, D), N++, D--; X(B[N], x) < 0; ) N++;
              for (; X(B[D], x) > 0; ) D--;
            }
            X(B[I], x) === 0 ? i(B, I, D) : i(B, ++D, O), D <= P && (I = D + 1), P <= D && (O = D - 1);
          }
        })(g, v, d || 0, b || g.length - 1, w || o);
      }
      function i(g, v, d) {
        var b = g[v];
        g[v] = g[d], g[d] = b;
      }
      function o(g, v) {
        return g < v ? -1 : g > v ? 1 : 0;
      }
      var r = function(g) {
        g === void 0 && (g = 9), this._maxEntries = Math.max(4, g), this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries)), this.clear();
      };
      function s(g, v, d) {
        if (!d) return v.indexOf(g);
        for (var b = 0; b < v.length; b++) if (d(g, v[b])) return b;
        return -1;
      }
      function a(g, v) {
        l(g, 0, g.children.length, v, g);
      }
      function l(g, v, d, b, w) {
        w || (w = S(null)), w.minX = 1 / 0, w.minY = 1 / 0, w.maxX = -1 / 0, w.maxY = -1 / 0;
        for (var E = v; E < d; E++) {
          var B = g.children[E];
          f(w, g.leaf ? b(B) : B);
        }
        return w;
      }
      function f(g, v) {
        return g.minX = Math.min(g.minX, v.minX), g.minY = Math.min(g.minY, v.minY), g.maxX = Math.max(g.maxX, v.maxX), g.maxY = Math.max(g.maxY, v.maxY), g;
      }
      function u(g, v) {
        return g.minX - v.minX;
      }
      function c(g, v) {
        return g.minY - v.minY;
      }
      function h(g) {
        return (g.maxX - g.minX) * (g.maxY - g.minY);
      }
      function p(g) {
        return g.maxX - g.minX + (g.maxY - g.minY);
      }
      function M(g, v) {
        return g.minX <= v.minX && g.minY <= v.minY && v.maxX <= g.maxX && v.maxY <= g.maxY;
      }
      function m(g, v) {
        return v.minX <= g.maxX && v.minY <= g.maxY && v.maxX >= g.minX && v.maxY >= g.minY;
      }
      function S(g) {
        return { children: g, height: 1, leaf: !0, minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
      }
      function _(g, v, d, b, w) {
        for (var E = [v, d]; E.length; ) if (!((d = E.pop()) - (v = E.pop()) <= b)) {
          var B = v + Math.ceil((d - v) / b / 2) * b;
          n(g, B, v, d, w), E.push(v, B, B, d);
        }
      }
      return r.prototype.all = function() {
        return this._all(this.data, []);
      }, r.prototype.search = function(g) {
        var v = this.data, d = [];
        if (!m(g, v)) return d;
        for (var b = this.toBBox, w = []; v; ) {
          for (var E = 0; E < v.children.length; E++) {
            var B = v.children[E], P = v.leaf ? b(B) : B;
            m(g, P) && (v.leaf ? d.push(B) : M(g, P) ? this._all(B, d) : w.push(B));
          }
          v = w.pop();
        }
        return d;
      }, r.prototype.collides = function(g) {
        var v = this.data;
        if (!m(g, v)) return !1;
        for (var d = []; v; ) {
          for (var b = 0; b < v.children.length; b++) {
            var w = v.children[b], E = v.leaf ? this.toBBox(w) : w;
            if (m(g, E)) {
              if (v.leaf || M(g, E)) return !0;
              d.push(w);
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
            var b = this.data;
            this.data = d, d = b;
          }
          this._insert(d, this.data.height - d.height - 1, !0);
        }
        else this.data = d;
        return this;
      }, r.prototype.insert = function(g) {
        return g && this._insert(g, this.data.height - 1), this;
      }, r.prototype.clear = function() {
        return this.data = S([]), this;
      }, r.prototype.remove = function(g, v) {
        if (!g) return this;
        for (var d, b, w, E = this.data, B = this.toBBox(g), P = [], I = []; E || P.length; ) {
          if (E || (E = P.pop(), b = P[P.length - 1], d = I.pop(), w = !0), E.leaf) {
            var O = s(g, E.children, v);
            if (O !== -1) return E.children.splice(O, 1), P.push(E), this._condense(P), this;
          }
          w || E.leaf || !M(E, B) ? b ? (d++, E = b.children[d], w = !1) : E = null : (P.push(E), I.push(d), d = 0, b = E, E = E.children[0]);
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
      }, r.prototype._build = function(g, v, d, b) {
        var w, E = d - v + 1, B = this._maxEntries;
        if (E <= B) return a(w = S(g.slice(v, d + 1)), this.toBBox), w;
        b || (b = Math.ceil(Math.log(E) / Math.log(B)), B = Math.ceil(E / Math.pow(B, b - 1))), (w = S([])).leaf = !1, w.height = b;
        var P = Math.ceil(E / B), I = P * Math.ceil(Math.sqrt(B));
        _(g, v, d, I, this.compareMinX);
        for (var O = v; O <= d; O += I) {
          var X = Math.min(O + I - 1, d);
          _(g, O, X, P, this.compareMinY);
          for (var R = O; R <= X; R += P) {
            var y = Math.min(R + P - 1, X);
            w.children.push(this._build(g, R, y, b - 1));
          }
        }
        return a(w, this.toBBox), w;
      }, r.prototype._chooseSubtree = function(g, v, d, b) {
        for (; b.push(v), !v.leaf && b.length - 1 !== d; ) {
          for (var w = 1 / 0, E = 1 / 0, B = void 0, P = 0; P < v.children.length; P++) {
            var I = v.children[P], O = h(I), X = (R = g, y = I, (Math.max(y.maxX, R.maxX) - Math.min(y.minX, R.minX)) * (Math.max(y.maxY, R.maxY) - Math.min(y.minY, R.minY)) - O);
            X < E ? (E = X, w = O < w ? O : w, B = I) : X === E && O < w && (w = O, B = I);
          }
          v = B || v.children[0];
        }
        var R, y;
        return v;
      }, r.prototype._insert = function(g, v, d) {
        var b = d ? g : this.toBBox(g), w = [], E = this._chooseSubtree(b, this.data, v, w);
        for (E.children.push(g), f(E, b); v >= 0 && w[v].children.length > this._maxEntries; ) this._split(w, v), v--;
        this._adjustParentBBoxes(b, w, v);
      }, r.prototype._split = function(g, v) {
        var d = g[v], b = d.children.length, w = this._minEntries;
        this._chooseSplitAxis(d, w, b);
        var E = this._chooseSplitIndex(d, w, b), B = S(d.children.splice(E, d.children.length - E));
        B.height = d.height, B.leaf = d.leaf, a(d, this.toBBox), a(B, this.toBBox), v ? g[v - 1].children.push(B) : this._splitRoot(d, B);
      }, r.prototype._splitRoot = function(g, v) {
        this.data = S([g, v]), this.data.height = g.height + 1, this.data.leaf = !1, a(this.data, this.toBBox);
      }, r.prototype._chooseSplitIndex = function(g, v, d) {
        for (var b, w, E, B, P, I, O, X = 1 / 0, R = 1 / 0, y = v; y <= d - v; y++) {
          var A = l(g, 0, y, this.toBBox), k = l(g, y, d, this.toBBox), T = (w = A, E = k, B = void 0, P = void 0, I = void 0, O = void 0, B = Math.max(w.minX, E.minX), P = Math.max(w.minY, E.minY), I = Math.min(w.maxX, E.maxX), O = Math.min(w.maxY, E.maxY), Math.max(0, I - B) * Math.max(0, O - P)), C = h(A) + h(k);
          T < X ? (X = T, b = y, R = C < R ? C : R) : T === X && C < R && (R = C, b = y);
        }
        return b || d - v;
      }, r.prototype._chooseSplitAxis = function(g, v, d) {
        var b = g.leaf ? this.compareMinX : u, w = g.leaf ? this.compareMinY : c;
        this._allDistMargin(g, v, d, b) < this._allDistMargin(g, v, d, w) && g.children.sort(b);
      }, r.prototype._allDistMargin = function(g, v, d, b) {
        g.children.sort(b);
        for (var w = this.toBBox, E = l(g, 0, v, w), B = l(g, d - v, d, w), P = p(E) + p(B), I = v; I < d - v; I++) {
          var O = g.children[I];
          f(E, g.leaf ? w(O) : O), P += p(E);
        }
        for (var X = d - v - 1; X >= v; X--) {
          var R = g.children[X];
          f(B, g.leaf ? w(R) : R), P += p(B);
        }
        return P;
      }, r.prototype._adjustParentBBoxes = function(g, v, d) {
        for (var b = d; b >= 0; b--) f(v[b], g);
      }, r.prototype._condense = function(g) {
        for (var v = g.length - 1, d = void 0; v >= 0; v--) g[v].children.length === 0 ? v > 0 ? (d = g[v - 1].children).splice(d.indexOf(g[v]), 1) : this.clear() : a(g[v], this.toBBox);
      }, r;
    });
  })(Se)), Se.exports;
}
const Yi = /* @__PURE__ */ Ti(yi);
var Ht = { exports: {} }, De, hn;
function Ri() {
  return hn || (hn = 1, De = function(t, n, i, o) {
    var r = t[0], s = t[1], a = !1;
    i === void 0 && (i = 0), o === void 0 && (o = n.length);
    for (var l = (o - i) / 2, f = 0, u = l - 1; f < l; u = f++) {
      var c = n[i + f * 2 + 0], h = n[i + f * 2 + 1], p = n[i + u * 2 + 0], M = n[i + u * 2 + 1], m = h > s != M > s && r < (p - c) * (s - h) / (M - h) + c;
      m && (a = !a);
    }
    return a;
  }), De;
}
var Ye, un;
function Fi() {
  return un || (un = 1, Ye = function(t, n, i, o) {
    var r = t[0], s = t[1], a = !1;
    i === void 0 && (i = 0), o === void 0 && (o = n.length);
    for (var l = o - i, f = 0, u = l - 1; f < l; u = f++) {
      var c = n[f + i][0], h = n[f + i][1], p = n[u + i][0], M = n[u + i][1], m = h > s != M > s && r < (p - c) * (s - h) / (M - h) + c;
      m && (a = !a);
    }
    return a;
  }), Ye;
}
var dn;
function $i() {
  if (dn) return Ht.exports;
  dn = 1;
  var e = Ri(), t = Fi();
  return Ht.exports = function(i, o, r, s) {
    return o.length > 0 && Array.isArray(o[0]) ? t(i, o, r, s) : e(i, o, r, s);
  }, Ht.exports.nested = t, Ht.exports.flat = e, Ht.exports;
}
var te = { exports: {} }, Li = te.exports, pn;
function ji() {
  return pn || (pn = 1, (function(e, t) {
    (function(n, i) {
      i(t);
    })(Li, function(n) {
      const o = 33306690738754706e-32;
      function r(m, S, _, g, v) {
        let d, b, w, E, B = S[0], P = g[0], I = 0, O = 0;
        P > B == P > -B ? (d = B, B = S[++I]) : (d = P, P = g[++O]);
        let X = 0;
        if (I < m && O < _) for (P > B == P > -B ? (w = d - ((b = B + d) - B), B = S[++I]) : (w = d - ((b = P + d) - P), P = g[++O]), d = b, w !== 0 && (v[X++] = w); I < m && O < _; ) P > B == P > -B ? (w = d - ((b = d + B) - (E = b - d)) + (B - E), B = S[++I]) : (w = d - ((b = d + P) - (E = b - d)) + (P - E), P = g[++O]), d = b, w !== 0 && (v[X++] = w);
        for (; I < m; ) w = d - ((b = d + B) - (E = b - d)) + (B - E), B = S[++I], d = b, w !== 0 && (v[X++] = w);
        for (; O < _; ) w = d - ((b = d + P) - (E = b - d)) + (P - E), P = g[++O], d = b, w !== 0 && (v[X++] = w);
        return d === 0 && X !== 0 || (v[X++] = d), X;
      }
      function s(m) {
        return new Float64Array(m);
      }
      const a = 33306690738754716e-32, l = 22204460492503146e-32, f = 11093356479670487e-47, u = s(4), c = s(8), h = s(12), p = s(16), M = s(4);
      n.orient2d = function(m, S, _, g, v, d) {
        const b = (S - d) * (_ - v), w = (m - v) * (g - d), E = b - w;
        if (b === 0 || w === 0 || b > 0 != w > 0) return E;
        const B = Math.abs(b + w);
        return Math.abs(E) >= a * B ? E : -(function(P, I, O, X, R, y, A) {
          let k, T, C, Y, x, N, D, F, L, j, q, V, G, W, K, Q, Z, H;
          const st = P - R, lt = O - R, rt = I - y, ot = X - y;
          x = (K = (F = st - (D = (N = 134217729 * st) - (N - st))) * (j = ot - (L = (N = 134217729 * ot) - (N - ot))) - ((W = st * ot) - D * L - F * L - D * j)) - (q = K - (Z = (F = rt - (D = (N = 134217729 * rt) - (N - rt))) * (j = lt - (L = (N = 134217729 * lt) - (N - lt))) - ((Q = rt * lt) - D * L - F * L - D * j))), u[0] = K - (q + x) + (x - Z), x = (G = W - ((V = W + q) - (x = V - W)) + (q - x)) - (q = G - Q), u[1] = G - (q + x) + (x - Q), x = (H = V + q) - V, u[2] = V - (H - x) + (q - x), u[3] = H;
          let Xt = (function(ii, Ke) {
            let Qe = Ke[0];
            for (let Ee = 1; Ee < ii; Ee++) Qe += Ke[Ee];
            return Qe;
          })(4, u), Qt = l * A;
          if (Xt >= Qt || -Xt >= Qt || (k = P - (st + (x = P - st)) + (x - R), C = O - (lt + (x = O - lt)) + (x - R), T = I - (rt + (x = I - rt)) + (x - y), Y = X - (ot + (x = X - ot)) + (x - y), k === 0 && T === 0 && C === 0 && Y === 0) || (Qt = f * A + o * Math.abs(Xt), (Xt += st * Y + ot * k - (rt * C + lt * T)) >= Qt || -Xt >= Qt)) return Xt;
          x = (K = (F = k - (D = (N = 134217729 * k) - (N - k))) * (j = ot - (L = (N = 134217729 * ot) - (N - ot))) - ((W = k * ot) - D * L - F * L - D * j)) - (q = K - (Z = (F = T - (D = (N = 134217729 * T) - (N - T))) * (j = lt - (L = (N = 134217729 * lt) - (N - lt))) - ((Q = T * lt) - D * L - F * L - D * j))), M[0] = K - (q + x) + (x - Z), x = (G = W - ((V = W + q) - (x = V - W)) + (q - x)) - (q = G - Q), M[1] = G - (q + x) + (x - Q), x = (H = V + q) - V, M[2] = V - (H - x) + (q - x), M[3] = H;
          const ti = r(4, u, 4, M, c);
          x = (K = (F = st - (D = (N = 134217729 * st) - (N - st))) * (j = Y - (L = (N = 134217729 * Y) - (N - Y))) - ((W = st * Y) - D * L - F * L - D * j)) - (q = K - (Z = (F = rt - (D = (N = 134217729 * rt) - (N - rt))) * (j = C - (L = (N = 134217729 * C) - (N - C))) - ((Q = rt * C) - D * L - F * L - D * j))), M[0] = K - (q + x) + (x - Z), x = (G = W - ((V = W + q) - (x = V - W)) + (q - x)) - (q = G - Q), M[1] = G - (q + x) + (x - Q), x = (H = V + q) - V, M[2] = V - (H - x) + (q - x), M[3] = H;
          const ei = r(ti, c, 4, M, h);
          x = (K = (F = k - (D = (N = 134217729 * k) - (N - k))) * (j = Y - (L = (N = 134217729 * Y) - (N - Y))) - ((W = k * Y) - D * L - F * L - D * j)) - (q = K - (Z = (F = T - (D = (N = 134217729 * T) - (N - T))) * (j = C - (L = (N = 134217729 * C) - (N - C))) - ((Q = T * C) - D * L - F * L - D * j))), M[0] = K - (q + x) + (x - Z), x = (G = W - ((V = W + q) - (x = V - W)) + (q - x)) - (q = G - Q), M[1] = G - (q + x) + (x - Q), x = (H = V + q) - V, M[2] = V - (H - x) + (q - x), M[3] = H;
          const ni = r(ei, h, 4, M, p);
          return p[ni - 1];
        })(m, S, _, g, v, d, B);
      }, n.orient2dfast = function(m, S, _, g, v, d) {
        return (S - d) * (_ - v) - (m - v) * (g - d);
      }, Object.defineProperty(n, "__esModule", { value: !0 });
    });
  })(te, te.exports)), te.exports;
}
var gn;
function Vi() {
  if (gn) return me.exports;
  gn = 1;
  var e = Di(), t = Yi, n = $i(), i = ji().orient2d;
  t.default && (t = t.default), me.exports = o, me.exports.default = o;
  function o(d, b, w) {
    b = Math.max(0, b === void 0 ? 2 : b), w = w || 0;
    var E = p(d), B = new e(16);
    B.toBBox = function(D) {
      return {
        minX: D[0],
        minY: D[1],
        maxX: D[0],
        maxY: D[1]
      };
    }, B.compareMinX = function(D, F) {
      return D[0] - F[0];
    }, B.compareMinY = function(D, F) {
      return D[1] - F[1];
    }, B.load(d);
    for (var P = [], I = 0, O; I < E.length; I++) {
      var X = E[I];
      B.remove(X), O = M(X, O), P.push(O);
    }
    var R = new e(16);
    for (I = 0; I < P.length; I++) R.insert(h(P[I]));
    for (var y = b * b, A = w * w; P.length; ) {
      var k = P.shift(), T = k.p, C = k.next.p, Y = m(T, C);
      if (!(Y < A)) {
        var x = Y / y;
        X = r(B, k.prev.p, T, C, k.next.next.p, x, R), X && Math.min(m(X, T), m(X, C)) <= x && (P.push(k), P.push(M(X, k)), B.remove(X), R.remove(k), R.insert(h(k)), R.insert(h(k.next)));
      }
    }
    k = O;
    var N = [];
    do
      N.push(k.p), k = k.next;
    while (k !== O);
    return N.push(k.p), N;
  }
  function r(d, b, w, E, B, P, I) {
    for (var O = new t([], s), X = d.data; X; ) {
      for (var R = 0; R < X.children.length; R++) {
        var y = X.children[R], A = X.leaf ? S(y, w, E) : a(w, E, y);
        A > P || O.push({
          node: y,
          dist: A
        });
      }
      for (; O.length && !O.peek().node.children; ) {
        var k = O.pop(), T = k.node, C = S(T, b, w), Y = S(T, E, B);
        if (k.dist < C && k.dist < Y && f(w, T, I) && f(E, T, I)) return T;
      }
      X = O.pop(), X && (X = X.node);
    }
    return null;
  }
  function s(d, b) {
    return d.dist - b.dist;
  }
  function a(d, b, w) {
    if (l(d, w) || l(b, w)) return 0;
    var E = _(d[0], d[1], b[0], b[1], w.minX, w.minY, w.maxX, w.minY);
    if (E === 0) return 0;
    var B = _(d[0], d[1], b[0], b[1], w.minX, w.minY, w.minX, w.maxY);
    if (B === 0) return 0;
    var P = _(d[0], d[1], b[0], b[1], w.maxX, w.minY, w.maxX, w.maxY);
    if (P === 0) return 0;
    var I = _(d[0], d[1], b[0], b[1], w.minX, w.maxY, w.maxX, w.maxY);
    return I === 0 ? 0 : Math.min(E, B, P, I);
  }
  function l(d, b) {
    return d[0] >= b.minX && d[0] <= b.maxX && d[1] >= b.minY && d[1] <= b.maxY;
  }
  function f(d, b, w) {
    for (var E = Math.min(d[0], b[0]), B = Math.min(d[1], b[1]), P = Math.max(d[0], b[0]), I = Math.max(d[1], b[1]), O = w.search({ minX: E, minY: B, maxX: P, maxY: I }), X = 0; X < O.length; X++)
      if (c(O[X].p, O[X].next.p, d, b)) return !1;
    return !0;
  }
  function u(d, b, w) {
    return i(d[0], d[1], b[0], b[1], w[0], w[1]);
  }
  function c(d, b, w, E) {
    return d !== E && b !== w && u(d, b, w) > 0 != u(d, b, E) > 0 && u(w, E, d) > 0 != u(w, E, b) > 0;
  }
  function h(d) {
    var b = d.p, w = d.next.p;
    return d.minX = Math.min(b[0], w[0]), d.minY = Math.min(b[1], w[1]), d.maxX = Math.max(b[0], w[0]), d.maxY = Math.max(b[1], w[1]), d;
  }
  function p(d) {
    for (var b = d[0], w = d[0], E = d[0], B = d[0], P = 0; P < d.length; P++) {
      var I = d[P];
      I[0] < b[0] && (b = I), I[0] > E[0] && (E = I), I[1] < w[1] && (w = I), I[1] > B[1] && (B = I);
    }
    var O = [b, w, E, B], X = O.slice();
    for (P = 0; P < d.length; P++)
      n(d[P], O) || X.push(d[P]);
    return v(X);
  }
  function M(d, b) {
    var w = {
      p: d,
      prev: null,
      next: null,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };
    return b ? (w.next = b.next, w.prev = b, b.next.prev = w, b.next = w) : (w.prev = w, w.next = w), w;
  }
  function m(d, b) {
    var w = d[0] - b[0], E = d[1] - b[1];
    return w * w + E * E;
  }
  function S(d, b, w) {
    var E = b[0], B = b[1], P = w[0] - E, I = w[1] - B;
    if (P !== 0 || I !== 0) {
      var O = ((d[0] - E) * P + (d[1] - B) * I) / (P * P + I * I);
      O > 1 ? (E = w[0], B = w[1]) : O > 0 && (E += P * O, B += I * O);
    }
    return P = d[0] - E, I = d[1] - B, P * P + I * I;
  }
  function _(d, b, w, E, B, P, I, O) {
    var X = w - d, R = E - b, y = I - B, A = O - P, k = d - B, T = b - P, C = X * X + R * R, Y = X * y + R * A, x = y * y + A * A, N = X * k + R * T, D = y * k + A * T, F = C * x - Y * Y, L, j, q, V, G = F, W = F;
    F === 0 ? (j = 0, G = 1, V = D, W = x) : (j = Y * D - x * N, V = C * D - Y * N, j < 0 ? (j = 0, V = D, W = x) : j > G && (j = G, V = D + Y, W = x)), V < 0 ? (V = 0, -N < 0 ? j = 0 : -N > C ? j = G : (j = -N, G = C)) : V > W && (V = W, -N + Y < 0 ? j = 0 : -N + Y > C ? j = G : (j = -N + Y, G = C)), L = j === 0 ? 0 : j / G, q = V === 0 ? 0 : V / W;
    var K = (1 - L) * d + L * w, Q = (1 - L) * b + L * E, Z = (1 - q) * B + q * I, H = (1 - q) * P + q * O, st = Z - K, lt = H - Q;
    return st * st + lt * lt;
  }
  function g(d, b) {
    return d[0] === b[0] ? d[1] - b[1] : d[0] - b[0];
  }
  function v(d) {
    d.sort(g);
    for (var b = [], w = 0; w < d.length; w++) {
      for (; b.length >= 2 && u(b[b.length - 2], b[b.length - 1], d[w]) <= 0; )
        b.pop();
      b.push(d[w]);
    }
    for (var E = [], B = d.length - 1; B >= 0; B--) {
      for (; E.length >= 2 && u(E[E.length - 2], E[E.length - 1], d[B]) <= 0; )
        E.pop();
      E.push(d[B]);
    }
    return E.pop(), b.pop(), b.concat(E);
  }
  return me.exports;
}
var qi = Vi();
const Ui = /* @__PURE__ */ Ni(qi);
function mn(e, t = {}) {
  t.concavity = t.concavity || 1 / 0;
  const n = [];
  if (qe(e, (o) => {
    n.push([o[0], o[1]]);
  }), !n.length)
    return null;
  const i = Ui(n, t.concavity);
  return i.length > 3 ? ae([i], t.properties) : null;
}
function Vn(e, t, n = {}) {
  const i = { type: "Feature" };
  return (n.id === 0 || n.id) && (i.id = n.id), n.bbox && (i.bbox = n.bbox), i.properties = t || {}, i.geometry = e, i;
}
function oe(e, t, n = {}) {
  if (!e)
    throw new Error("coordinates is required");
  if (!Array.isArray(e))
    throw new Error("coordinates must be an Array");
  if (e.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!wn(e[0]) || !wn(e[1]))
    throw new Error("coordinates must contain numbers");
  return Vn({
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
  return Vn({
    type: "Polygon",
    coordinates: e
  }, t, n);
}
function Kt(e, t = {}) {
  const n = { type: "FeatureCollection" };
  return t.id && (n.id = t.id), t.bbox && (n.bbox = t.bbox), n.features = e, n;
}
function wn(e) {
  return !isNaN(e) && e !== null && !Array.isArray(e);
}
function zi(e) {
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
const Tt = 11102230246251565e-32, dt = 134217729, Gi = (3 + 8 * Tt) * Tt;
function Re(e, t, n, i, o) {
  let r, s, a, l, f = t[0], u = i[0], c = 0, h = 0;
  u > f == u > -f ? (r = f, f = t[++c]) : (r = u, u = i[++h]);
  let p = 0;
  if (c < e && h < n)
    for (u > f == u > -f ? (s = f + r, a = r - (s - f), f = t[++c]) : (s = u + r, a = r - (s - u), u = i[++h]), r = s, a !== 0 && (o[p++] = a); c < e && h < n; )
      u > f == u > -f ? (s = r + f, l = s - r, a = r - (s - l) + (f - l), f = t[++c]) : (s = r + u, l = s - r, a = r - (s - l) + (u - l), u = i[++h]), r = s, a !== 0 && (o[p++] = a);
  for (; c < e; )
    s = r + f, l = s - r, a = r - (s - l) + (f - l), f = t[++c], r = s, a !== 0 && (o[p++] = a);
  for (; h < n; )
    s = r + u, l = s - r, a = r - (s - l) + (u - l), u = i[++h], r = s, a !== 0 && (o[p++] = a);
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
const Ki = (3 + 16 * Tt) * Tt, Qi = (2 + 12 * Tt) * Tt, Hi = (9 + 64 * Tt) * Tt * Tt, Wt = fe(4), vn = fe(8), bn = fe(12), xn = fe(16), vt = fe(4);
function Zi(e, t, n, i, o, r, s) {
  let a, l, f, u, c, h, p, M, m, S, _, g, v, d, b, w, E, B;
  const P = e - o, I = n - o, O = t - r, X = i - r;
  d = P * X, h = dt * P, p = h - (h - P), M = P - p, h = dt * X, m = h - (h - X), S = X - m, b = M * S - (d - p * m - M * m - p * S), w = O * I, h = dt * O, p = h - (h - O), M = O - p, h = dt * I, m = h - (h - I), S = I - m, E = M * S - (w - p * m - M * m - p * S), _ = b - E, c = b - _, Wt[0] = b - (_ + c) + (c - E), g = d + _, c = g - d, v = d - (g - c) + (_ - c), _ = v - w, c = v - _, Wt[1] = v - (_ + c) + (c - w), B = g + _, c = B - g, Wt[2] = g - (B - c) + (_ - c), Wt[3] = B;
  let R = Ji(4, Wt), y = Qi * s;
  if (R >= y || -R >= y || (c = e - P, a = e - (P + c) + (c - o), c = n - I, f = n - (I + c) + (c - o), c = t - O, l = t - (O + c) + (c - r), c = i - X, u = i - (X + c) + (c - r), a === 0 && l === 0 && f === 0 && u === 0) || (y = Hi * s + Gi * Math.abs(R), R += P * u + X * a - (O * f + I * l), R >= y || -R >= y)) return R;
  d = a * X, h = dt * a, p = h - (h - a), M = a - p, h = dt * X, m = h - (h - X), S = X - m, b = M * S - (d - p * m - M * m - p * S), w = l * I, h = dt * l, p = h - (h - l), M = l - p, h = dt * I, m = h - (h - I), S = I - m, E = M * S - (w - p * m - M * m - p * S), _ = b - E, c = b - _, vt[0] = b - (_ + c) + (c - E), g = d + _, c = g - d, v = d - (g - c) + (_ - c), _ = v - w, c = v - _, vt[1] = v - (_ + c) + (c - w), B = g + _, c = B - g, vt[2] = g - (B - c) + (_ - c), vt[3] = B;
  const A = Re(4, Wt, 4, vt, vn);
  d = P * u, h = dt * P, p = h - (h - P), M = P - p, h = dt * u, m = h - (h - u), S = u - m, b = M * S - (d - p * m - M * m - p * S), w = O * f, h = dt * O, p = h - (h - O), M = O - p, h = dt * f, m = h - (h - f), S = f - m, E = M * S - (w - p * m - M * m - p * S), _ = b - E, c = b - _, vt[0] = b - (_ + c) + (c - E), g = d + _, c = g - d, v = d - (g - c) + (_ - c), _ = v - w, c = v - _, vt[1] = v - (_ + c) + (c - w), B = g + _, c = B - g, vt[2] = g - (B - c) + (_ - c), vt[3] = B;
  const k = Re(A, vn, 4, vt, bn);
  d = a * u, h = dt * a, p = h - (h - a), M = a - p, h = dt * u, m = h - (h - u), S = u - m, b = M * S - (d - p * m - M * m - p * S), w = l * f, h = dt * l, p = h - (h - l), M = l - p, h = dt * f, m = h - (h - f), S = f - m, E = M * S - (w - p * m - M * m - p * S), _ = b - E, c = b - _, vt[0] = b - (_ + c) + (c - E), g = d + _, c = g - d, v = d - (g - c) + (_ - c), _ = v - w, c = v - _, vt[1] = v - (_ + c) + (c - w), B = g + _, c = B - g, vt[2] = g - (B - c) + (_ - c), vt[3] = B;
  const T = Re(k, bn, 4, vt, xn);
  return xn[T - 1];
}
function tr(e, t, n, i, o, r) {
  const s = (t - r) * (n - o), a = (e - o) * (i - r), l = s - a, f = Math.abs(s + a);
  return Math.abs(l) >= Ki * f ? l : -Zi(e, t, n, i, o, r, f);
}
function er(e, t) {
  var n, i, o = 0, r, s, a, l, f, u, c, h = e[0], p = e[1], M = t.length;
  for (n = 0; n < M; n++) {
    i = 0;
    var m = t[n], S = m.length - 1;
    if (u = m[0], u[0] !== m[S][0] && u[1] !== m[S][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (s = u[0] - h, a = u[1] - p, i; i < S; i++) {
      if (c = m[i + 1], l = c[0] - h, f = c[1] - p, a === 0 && f === 0) {
        if (l <= 0 && s >= 0 || s <= 0 && l >= 0)
          return 0;
      } else if (f >= 0 && a <= 0 || f <= 0 && a >= 0) {
        if (r = tr(s, l, a, f, 0, 0), r === 0)
          return 0;
        (r > 0 && f > 0 && a <= 0 || r < 0 && f <= 0 && a > 0) && o++;
      }
      u = c, a = f, s = l;
    }
  }
  return o % 2 !== 0;
}
function Le(e, t, n = {}) {
  if (!e)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const i = zi(e), o = Wi(t), r = o.type, s = t.bbox;
  let a = o.coordinates;
  if (s && nr(i, s) === !1)
    return !1;
  r === "Polygon" && (a = [a]);
  let l = !1;
  for (var f = 0; f < a.length; ++f) {
    const u = er(i, a[f]);
    if (u === 0) return !n.ignoreBoundary;
    u && (l = !0);
  }
  return l;
}
function nr(e, t) {
  return t[0] <= e[0] && t[1] <= e[1] && t[2] >= e[0] && t[3] >= e[1];
}
function Fe(e, t) {
  for (let n = 0; n < t.features.length; n++)
    if (Le(e, t.features[n]))
      return t.features[n];
}
function Un(e, t, n) {
  const i = t.geometry.coordinates[0][0], o = t.geometry.coordinates[0][1], r = t.geometry.coordinates[0][2], s = e.geometry.coordinates, a = t.properties.a.geom, l = t.properties.b.geom, f = t.properties.c.geom, u = [o[0] - i[0], o[1] - i[1]], c = [r[0] - i[0], r[1] - i[1]], h = [s[0] - i[0], s[1] - i[1]], p = [l[0] - a[0], l[1] - a[1]], M = [f[0] - a[0], f[1] - a[1]];
  let m = (c[1] * h[0] - c[0] * h[1]) / (u[0] * c[1] - u[1] * c[0]), S = (u[0] * h[1] - u[1] * h[0]) / (u[0] * c[1] - u[1] * c[0]);
  if (n) {
    const _ = n[t.properties.a.index], g = n[t.properties.b.index], v = n[t.properties.c.index];
    let d;
    if (m < 0 || S < 0 || 1 - m - S < 0) {
      const b = m / (m + S), w = S / (m + S);
      d = m / g / (b / g + w / v), S = S / v / (b / g + w / v);
    } else
      d = m / g / (m / g + S / v + (1 - m - S) / _), S = S / v / (m / g + S / v + (1 - m - S) / _);
    m = d;
  }
  return [
    m * p[0] + S * M[0] + a[0],
    m * p[1] + S * M[1] + a[1]
  ];
}
function ir(e, t, n, i) {
  const o = e.geometry.coordinates, r = n.geometry.coordinates, s = Math.atan2(o[0] - r[0], o[1] - r[1]), a = rr(s, t[0]);
  if (a === void 0)
    throw new Error("Unable to determine vertex index");
  const l = t[1][a];
  return Un(e, l.features[0], i);
}
function ee(e, t, n, i, o, r, s, a) {
  let l;
  if (s && (l = Fe(e, Kt([s]))), !l)
    if (n) {
      const f = e.geometry.coordinates, u = n.gridNum, c = n.xOrigin, h = n.yOrigin, p = n.xUnit, M = n.yUnit, m = n.gridCache, S = Pt(f[0], c, p, u), _ = Pt(f[1], h, M, u), g = m[S] ? m[S][_] ? m[S][_] : [] : [], v = Kt(g.map((d) => t.features[d]));
      l = Fe(e, v);
    } else
      l = Fe(e, t);
  return a && a(l), l ? Un(e, l, r) : ir(e, i, o, r);
}
function Pt(e, t, n, i) {
  let o = Math.floor((e - t) / n);
  return o < 0 && (o = 0), o >= i && (o = i - 1), o;
}
function rr(e, t) {
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
function or(e) {
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
      (!s || s < 2.00703) && (l = Wn(l));
      const f = isFinite(l) ? t[l] : l === "c" ? i : (function() {
        const u = l.match(/^b(\d+)$/);
        if (u) return o[parseInt(u[1])];
        const c = l.match(/^e(\d+)$/);
        if (c) return n[parseInt(c[1])];
        throw new Error("Bad index value for indexesToTri");
      })();
      return r ? [[f[1], f[0]], l] : [[f[0], f[1]], l];
    }
  );
  return or(a);
}
function Wn(e) {
  return typeof e == "number" ? e : e.replace(/^(c|e|b)(?:ent|dgeNode|box)(\d+)?$/, "$1$2");
}
function Gn(e, t) {
  return t && t >= 2.00703 || Array.isArray(e[0]) ? e : e.map((n) => [
    n.illstNodes,
    n.mercNodes,
    n.startEnd
  ]);
}
const ze = 2.00703;
function sr(e) {
  return !!(e.version !== void 0 || !e.tins && e.points && e.tins_points);
}
function ar(e) {
  return {
    points: e.points,
    pointsWeightBuffer: fr(e),
    strictStatus: lr(e),
    verticesParams: hr(e),
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
function cr(e) {
  const t = gr(e), n = t.tins;
  return {
    compiled: t,
    tins: n,
    points: mr(n),
    strictStatus: t.strict_status,
    pointsWeightBuffer: t.weight_buffer,
    verticesParams: t.vertices_params,
    centroid: t.centroid,
    kinks: t.kinks
  };
}
function fr(e) {
  return !e.version || e.version < ze ? ["forw", "bakw"].reduce((t, n) => {
    const i = e.weight_buffer[n];
    return i && (t[n] = Object.keys(i).reduce((o, r) => {
      const s = Wn(r);
      return o[s] = i[r], o;
    }, {})), t;
  }, {}) : e.weight_buffer;
}
function lr(e) {
  return e.strict_status ? e.strict_status : e.kinks_points ? "strict_error" : e.tins_points.length === 2 ? "loose" : "strict";
}
function hr(e) {
  const t = {
    forw: [e.vertices_params[0]],
    bakw: [e.vertices_params[1]]
  };
  return t.forw[1] = Sn(e, !1), t.bakw[1] = Sn(e, !0), t;
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
      ze
    );
    return Kt([s]);
  });
}
function ur(e) {
  return {
    forw: oe(e.centroid_point[0], {
      target: {
        geom: e.centroid_point[1],
        index: "c"
      }
    }),
    bakw: oe(e.centroid_point[1], {
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
    forw: Kt(
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
    bakw: Kt(
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
      bakw: Kt(
        e.map((t) => oe(t))
      )
    };
}
function gr(e) {
  return JSON.parse(
    JSON.stringify(e).replace('"cent"', '"c"').replace(/"bbox(\d+)"/g, '"b$1"')
  );
}
function mr(e) {
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
const kn = ze;
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
    if (sr(t)) {
      this.applyModernState(ar(t));
      return;
    }
    this.applyLegacyState(cr(t));
  }
  applyModernState(t) {
    this.points = t.points, this.pointsWeightBuffer = t.pointsWeightBuffer, this.strict_status = t.strictStatus, this.vertices_params = t.verticesParams, this.centroid = t.centroid, this.edges = t.edges, this.edgeNodes = t.edgeNodes || [], this.tins = t.tins, this.addIndexedTin(), this.kinks = t.kinks, this.yaxisMode = t.yaxisMode ?? Mt.YAXIS_INVERT, this.vertexMode = t.vertexMode ?? Mt.VERTEX_PLAIN, this.strictMode = t.strictMode ?? Mt.MODE_AUTO, t.bounds ? (this.bounds = t.bounds, this.boundsPolygon = t.boundsPolygon, this.xy = t.xy, this.wh = t.wh) : (this.bounds = void 0, this.boundsPolygon = void 0, this.xy = t.xy ?? [0, 0], t.wh && (this.wh = t.wh));
  }
  applyLegacyState(t) {
    this.tins = t.tins, this.addIndexedTin(), this.strict_status = t.strictStatus, this.pointsWeightBuffer = t.pointsWeightBuffer, this.vertices_params = t.verticesParams, this.centroid = t.centroid, this.kinks = t.kinks, this.points = t.points;
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
      return yn(m)[0].map((_) => {
        r.length === 0 ? r = [Array.from(_), Array.from(_)] : (_[0] < r[0][0] && (r[0][0] = _[0]), _[0] > r[1][0] && (r[1][0] = _[0]), _[1] < r[0][1] && (r[0][1] = _[1]), _[1] > r[1][1] && (r[1][1] = _[1])), S.length === 0 ? S = [Array.from(_), Array.from(_)] : (_[0] < S[0][0] && (S[0][0] = _[0]), _[0] > S[1][0] && (S[1][0] = _[0]), _[1] < S[0][1] && (S[0][1] = _[1]), _[1] > S[1][1] && (S[1][1] = _[1]));
      }), S;
    }), l = (r[1][0] - r[0][0]) / o, f = (r[1][1] - r[0][1]) / o, u = a.reduce(
      (m, S, _) => {
        const g = Pt(S[0][0], r[0][0], l, o), v = Pt(S[1][0], r[0][0], l, o), d = Pt(S[0][1], r[0][1], f, o), b = Pt(S[1][1], r[0][1], f, o);
        for (let w = g; w <= v; w++) {
          m[w] || (m[w] = []);
          for (let E = d; E <= b; E++)
            m[w][E] || (m[w][E] = []), m[w][E].push(_);
        }
        return m;
      },
      []
    ), c = i.features.map((m) => {
      let S = [];
      return yn(m)[0].map((_) => {
        s.length === 0 ? s = [Array.from(_), Array.from(_)] : (_[0] < s[0][0] && (s[0][0] = _[0]), _[0] > s[1][0] && (s[1][0] = _[0]), _[1] < s[0][1] && (s[0][1] = _[1]), _[1] > s[1][1] && (s[1][1] = _[1])), S.length === 0 ? S = [Array.from(_), Array.from(_)] : (_[0] < S[0][0] && (S[0][0] = _[0]), _[0] > S[1][0] && (S[1][0] = _[0]), _[1] < S[0][1] && (S[0][1] = _[1]), _[1] > S[1][1] && (S[1][1] = _[1]));
      }), S;
    }), h = (s[1][0] - s[0][0]) / o, p = (s[1][1] - s[0][1]) / o, M = c.reduce(
      (m, S, _) => {
        const g = Pt(S[0][0], s[0][0], h, o), v = Pt(S[1][0], s[0][0], h, o), d = Pt(S[0][1], s[0][1], p, o), b = Pt(S[1][1], s[0][1], p, o);
        for (let w = g; w <= v; w++) {
          m[w] || (m[w] = []);
          for (let E = d; E <= b; E++)
            m[w][E] || (m[w][E] = []), m[w][E].push(_);
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
        gridCache: u
      },
      bakw: {
        gridNum: o,
        xOrigin: s[0][0],
        yOrigin: s[0][1],
        xUnit: h,
        yUnit: p,
        gridCache: M
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
    const o = oe(t);
    if (this.bounds && !n && !i && !Le(o, this.boundsPolygon))
      return !1;
    const r = n ? this.tins.bakw : this.tins.forw, s = n ? this.indexedTins.bakw : this.indexedTins.forw, a = n ? this.vertices_params.bakw : this.vertices_params.forw, l = n ? this.centroid.bakw : this.centroid.forw, f = n ? this.pointsWeightBuffer.bakw : this.pointsWeightBuffer.forw;
    let u, c;
    this.stateFull && (this.stateBackward == n ? u = this.stateTriangle : (this.stateBackward = n, this.stateTriangle = void 0), c = (p) => {
      this.stateTriangle = p;
    });
    let h = ee(
      o,
      r,
      s,
      a,
      l,
      f,
      u,
      c
    );
    if (this.bounds && n && !i) {
      const p = oe(h);
      if (!Le(p, this.boundsPolygon)) return !1;
    } else this.yaxisMode == Mt.YAXIS_FOLLOW && !n && (h = [h[0], -1 * h[1]]);
    return h;
  }
}
const En = Math.pow(2, -52), we = new Uint32Array(512);
class We {
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
    return new We(r);
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
    let a = 1 / 0, l = 1 / 0, f = -1 / 0, u = -1 / 0;
    for (let P = 0; P < s; P++) {
      const I = t[2 * P], O = t[2 * P + 1];
      I < a && (a = I), O < l && (l = O), I > f && (f = I), O > u && (u = O), this._ids[P] = P;
    }
    const c = (a + f) / 2, h = (l + u) / 2;
    let p = 0, M = 0, m = 0;
    for (let P = 0, I = 1 / 0; P < s; P++) {
      const O = $e(c, h, t[2 * P], t[2 * P + 1]);
      O < I && (p = P, I = O);
    }
    const S = t[2 * p], _ = t[2 * p + 1];
    for (let P = 0, I = 1 / 0; P < s; P++) {
      if (P === p) continue;
      const O = $e(S, _, t[2 * P], t[2 * P + 1]);
      O < I && O > 0 && (M = P, I = O);
    }
    let g = t[2 * M], v = t[2 * M + 1], d = 1 / 0;
    for (let P = 0; P < s; P++) {
      if (P === p || P === M) continue;
      const I = vr(S, _, g, v, t[2 * P], t[2 * P + 1]);
      I < d && (m = P, d = I);
    }
    let b = t[2 * m], w = t[2 * m + 1];
    if (d === 1 / 0) {
      for (let O = 0; O < s; O++)
        this._dists[O] = t[2 * O] - t[0] || t[2 * O + 1] - t[1];
      Gt(this._ids, this._dists, 0, s - 1);
      const P = new Uint32Array(s);
      let I = 0;
      for (let O = 0, X = -1 / 0; O < s; O++) {
        const R = this._ids[O], y = this._dists[R];
        y > X && (P[I++] = R, X = y);
      }
      this.hull = P.subarray(0, I), this.triangles = new Uint32Array(0), this.halfedges = new Int32Array(0);
      return;
    }
    if (It(S, _, g, v, b, w) < 0) {
      const P = M, I = g, O = v;
      M = m, g = b, v = w, m = P, b = I, w = O;
    }
    const E = br(S, _, g, v, b, w);
    this._cx = E.x, this._cy = E.y;
    for (let P = 0; P < s; P++)
      this._dists[P] = $e(t[2 * P], t[2 * P + 1], E.x, E.y);
    Gt(this._ids, this._dists, 0, s - 1), this._hullStart = p;
    let B = 3;
    i[p] = n[m] = M, i[M] = n[p] = m, i[m] = n[M] = p, o[p] = 0, o[M] = 1, o[m] = 2, r.fill(-1), r[this._hashKey(S, _)] = p, r[this._hashKey(g, v)] = M, r[this._hashKey(b, w)] = m, this.trianglesLen = 0, this._addTriangle(p, M, m, -1, -1, -1);
    for (let P = 0, I = 0, O = 0; P < this._ids.length; P++) {
      const X = this._ids[P], R = t[2 * X], y = t[2 * X + 1];
      if (P > 0 && Math.abs(R - I) <= En && Math.abs(y - O) <= En || (I = R, O = y, X === p || X === M || X === m)) continue;
      let A = 0;
      for (let x = 0, N = this._hashKey(R, y); x < this._hashSize && (A = r[(N + x) % this._hashSize], !(A !== -1 && A !== i[A])); x++)
        ;
      A = n[A];
      let k = A, T;
      for (; T = i[k], It(R, y, t[2 * k], t[2 * k + 1], t[2 * T], t[2 * T + 1]) >= 0; )
        if (k = T, k === A) {
          k = -1;
          break;
        }
      if (k === -1) continue;
      let C = this._addTriangle(k, X, i[k], -1, -1, o[k]);
      o[X] = this._legalize(C + 2), o[k] = C, B++;
      let Y = i[k];
      for (; T = i[Y], It(R, y, t[2 * Y], t[2 * Y + 1], t[2 * T], t[2 * T + 1]) < 0; )
        C = this._addTriangle(Y, X, T, o[X], -1, o[Y]), o[X] = this._legalize(C + 2), i[Y] = Y, B--, Y = T;
      if (k === A)
        for (; T = n[k], It(R, y, t[2 * T], t[2 * T + 1], t[2 * k], t[2 * k + 1]) < 0; )
          C = this._addTriangle(T, X, k, -1, o[k], o[T]), this._legalize(C + 2), o[T] = C, i[k] = k, B--, k = T;
      this._hullStart = n[X] = k, i[k] = n[Y] = X, i[X] = Y, r[this._hashKey(R, y)] = X, r[this._hashKey(t[2 * k], t[2 * k + 1])] = k;
    }
    this.hull = new Uint32Array(B);
    for (let P = 0, I = this._hullStart; P < B; P++)
      this.hull[P] = I, I = i[I];
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
        t = we[--r];
        continue;
      }
      const f = a - a % 3, u = l + (t + 1) % 3, c = f + (a + 2) % 3, h = n[s], p = n[t], M = n[u], m = n[c];
      if (yr(
        o[2 * h],
        o[2 * h + 1],
        o[2 * p],
        o[2 * p + 1],
        o[2 * M],
        o[2 * M + 1],
        o[2 * m],
        o[2 * m + 1]
      )) {
        n[t] = m, n[a] = h;
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
        const g = f + (a + 1) % 3;
        r < we.length && (we[r++] = g);
      } else {
        if (r === 0) break;
        t = we[--r];
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
function $e(e, t, n, i) {
  const o = e - n, r = t - i;
  return o * o + r * r;
}
function yr(e, t, n, i, o, r, s, a) {
  const l = e - s, f = t - a, u = n - s, c = i - a, h = o - s, p = r - a, M = l * l + f * f, m = u * u + c * c, S = h * h + p * p;
  return l * (c * S - m * p) - f * (u * S - m * h) + M * (u * p - c * h) < 0;
}
function vr(e, t, n, i, o, r) {
  const s = n - e, a = i - t, l = o - e, f = r - t, u = s * s + a * a, c = l * l + f * f, h = 0.5 / (s * f - a * l), p = (f * u - a * c) * h, M = (s * c - l * u) * h;
  return p * p + M * M;
}
function br(e, t, n, i, o, r) {
  const s = n - e, a = i - t, l = o - e, f = r - t, u = s * s + a * a, c = l * l + f * f, h = 0.5 / (s * f - a * l), p = e + (f * u - a * c) * h, M = t + (s * c - l * u) * h;
  return { x: p, y: M };
}
function Gt(e, t, n, i) {
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
    Zt(e, o, r), t[e[n]] > t[e[i]] && Zt(e, n, i), t[e[r]] > t[e[i]] && Zt(e, r, i), t[e[n]] > t[e[r]] && Zt(e, n, r);
    const a = e[r], l = t[a];
    for (; ; ) {
      do
        r++;
      while (t[e[r]] < l);
      do
        s--;
      while (t[e[s]] > l);
      if (s < r) break;
      Zt(e, r, s);
    }
    e[n + 1] = e[s], e[s] = a, i - r + 1 >= s - n ? (Gt(e, t, r, i), Gt(e, t, n, s - 1)) : (Gt(e, t, n, s - 1), Gt(e, t, r, i));
  }
}
function Zt(e, t, n) {
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
class An extends Mr {
  constructor(t) {
    super(8, new Uint8Array(Math.ceil(t / 8)).fill(0));
  }
}
function qt(e) {
  return e % 3 === 2 ? e - 2 : e + 1;
}
function Bt(e) {
  return e % 3 === 0 ? e + 2 : e - 1;
}
function Pn(e, t, n, i, o, r, s, a) {
  const l = It(e, t, o, r, s, a), f = It(n, i, o, r, s, a);
  if (l > 0 && f > 0 || l < 0 && f < 0)
    return !1;
  const u = It(o, r, e, t, n, i), c = It(s, a, e, t, n, i);
  return u > 0 && c > 0 || u < 0 && c < 0 ? !1 : l === 0 && f === 0 && u === 0 && c === 0 ? !(Math.max(o, s) < Math.min(e, n) || Math.max(e, n) < Math.min(o, s) || Math.max(r, a) < Math.min(t, i) || Math.max(t, i) < Math.min(r, a)) : !0;
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
class kr extends Sr {
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
    this.vertMap = new Uint32Array(o).fill(i), this.flips = new An(r), this.consd = new An(r);
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
    const { triangles: i, halfedges: o } = this.del, r = this.vertMap[t];
    let s = r;
    do {
      const f = i[s], u = qt(s);
      if (f === n)
        return this.protect(s);
      const c = Bt(s), h = i[c];
      if (h === n)
        return this.protect(u), u;
      if (this.intersectSegments(t, n, h, f)) {
        s = c;
        break;
      }
      s = o[u];
    } while (s !== -1 && s !== r);
    let a = s, l = -1;
    for (; s !== -1; ) {
      const f = o[s], u = Bt(s), c = Bt(f), h = qt(f);
      if (f === -1)
        throw new Error("Constraining edge exited the hull");
      if (this.consd.has(s))
        throw new Error("Edge intersects already constrained edge");
      if (this.isCollinear(t, n, i[s]) || this.isCollinear(t, n, i[f]))
        throw new Error("Constraining edge intersects point");
      if (!this.intersectSegments(
        i[s],
        i[f],
        i[u],
        i[c]
      )) {
        if (l === -1 && (l = s), i[c] === n) {
          if (s === l)
            throw new Error("Infinite loop: non-convex quadrilateral");
          s = l, l = -1;
          continue;
        }
        if (this.intersectSegments(
          t,
          n,
          i[c],
          i[f]
        ))
          s = c;
        else if (this.intersectSegments(
          t,
          n,
          i[h],
          i[c]
        ))
          s = h;
        else if (l === s)
          throw new Error("Infinite loop: no further intersect after non-convex");
        continue;
      }
      if (this.flipDiagonal(s), this.intersectSegments(
        t,
        n,
        i[u],
        i[c]
      ) && (l === -1 && (l = u), l === u))
        throw new Error("Infinite loop: flipped diagonal still intersects");
      i[c] === n ? (a = c, s = l, l = -1) : this.intersectSegments(
        t,
        n,
        i[h],
        i[c]
      ) && (s = h);
    }
    return this.protect(a), this.delaunify(!0), this.findEdge(t, n);
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
    let s = i, a = -1;
    do {
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
    const { triangles: n, halfedges: i } = this.del, o = this.flips, r = this.consd, s = i[t], a = Bt(t), l = qt(t), f = Bt(s), u = qt(s), c = i[a], h = i[f];
    if (r.has(t))
      throw new Error("Trying to flip a constrained edge");
    return n[t] = n[f], i[t] = h, o.set(t, o.has(f)) || r.set(t, r.has(f)), h !== -1 && (i[h] = t), i[a] = f, n[s] = n[a], i[s] = c, o.set(s, o.has(a)) || r.set(s, r.has(a)), c !== -1 && (i[c] = s), i[f] = a, this.markFlip(t), this.markFlip(l), this.markFlip(s), this.markFlip(u), o.add(a), r.delete(a), o.add(f), r.delete(f), this.updateVert(t), this.updateVert(l), this.updateVert(s), this.updateVert(u), a;
  }
  /**
   * Whether point p1, p2, and p are collinear.
   */
  isCollinear(t, n, i) {
    const o = this.del.coords;
    return It(
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
    return pi(
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
    const r = n[Bt(t)], s = n[t], a = n[qt(t)], l = n[Bt(o)];
    return !this.inCircle(r, s, a, l);
  }
  /**
   * Update the vertex -> incoming edge map.
   */
  updateVert(t) {
    const { triangles: n, halfedges: i } = this.del, o = this.vertMap, r = n[t];
    let s = Bt(t), a = i[s];
    for (; a !== -1 && a !== t; )
      s = Bt(a), a = i[s];
    return o[r] = s, s;
  }
  /**
   * Whether the segments between vertices intersect.
   */
  intersectSegments(t, n, i, o) {
    const r = this.del.coords;
    return t === i || t === o || n === i || n === o ? !1 : Pn(
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
  static intersectSegments = Pn;
}
function ye(e, t, n) {
  if (t || (t = []), typeof e != "object" || e.type !== "FeatureCollection")
    throw "Argument points must be FeatureCollection";
  if (!Array.isArray(t)) throw "Argument points must be Array of Array";
  const i = e.features.map(
    (l) => l.geometry.coordinates
  ), o = We.from(i);
  let r;
  const s = [];
  o.triangles.length !== 0 && t.length !== 0 && (r = new kr(o), r.constrainAll(t));
  for (let l = 0; l < o.triangles.length; l += 3)
    s.push([o.triangles[l], o.triangles[l + 1], o.triangles[l + 2]]);
  const a = ["a", "b", "c"];
  return St(
    s.map((l) => {
      const f = {}, u = l.map((c, h) => {
        const p = e.features[c], M = p.geometry.coordinates, m = [M[0], M[1]];
        return M.length === 3 ? m[2] = M[2] : f[a[h]] = p.properties[n], m;
      });
      return u[3] = u[0], ae([u], f);
    })
  );
}
function Er(e, t) {
  const n = [[], [], [], []], i = [];
  return Object.keys(e).forEach((o) => {
    const r = e[o], s = r.forw, a = r.bakw, l = [
      s[0] - t.forw[0],
      s[1] - t.forw[1]
    ], f = [
      a[0] - t.bakw[0],
      t.bakw[1] - a[1]
    ], u = { forw: l, bakw: f };
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
    const f = a / l, u = Math.atan2(r[0], r[1]) - Math.atan2(s[0], s[1]);
    t = Math.min(t, f), n += Math.cos(u), i += Math.sin(u);
  }), isFinite(t) ? [t, Math.atan2(i, n)] : [1, 0];
}
function Pr(e, t, n) {
  const { perQuad: i, aggregate: o } = Er(e, t), r = i.every((l) => l.length > 0), a = (n === "birdeye" ? r ? i : [o] : [o]).map((l) => Ar(l));
  return a.length === 1 ? [a[0], a[0], a[0], a[0]] : a;
}
function Ir(e, t) {
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
function Or(e, t, n, i) {
  const o = t[0] - e[0], r = t[1] - e[1];
  if (Math.abs(o) < 1e-12 && Math.abs(r) < 1e-12) return null;
  const s = i[0] - n[0], a = i[1] - n[1], l = n[0] - e[0], f = n[1] - e[1], u = o * a - r * s;
  if (Math.abs(u) < 1e-12) return null;
  const c = (l * a - f * s) / u, h = (l * r - f * o) / u;
  return c <= 1e-10 || h < -1e-10 || h > 1 + 1e-10 ? null : { t: c, point: [e[0] + c * o, e[1] + c * r] };
}
function Nr(e, t, n) {
  const i = n.length;
  let o = -1 / 0, r = null;
  for (let s = 0; s < i; s++) {
    const a = (s + 1) % i, l = Or(
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
function Bn(e, t, n, i, o, r) {
  const s = t[0] - e[0], a = t[1] - e[1];
  if (s === 0 && a === 0) return null;
  const l = [];
  if (s !== 0)
    for (const u of [n, i]) {
      const c = (u - e[0]) / s;
      if (c > 0) {
        const h = e[1] + c * a;
        h >= o && h <= r && l.push({ t: c, x: u, y: h });
      }
    }
  if (a !== 0)
    for (const u of [o, r]) {
      const c = (u - e[1]) / a;
      if (c > 0) {
        const h = e[0] + c * s;
        h >= n && h <= i && l.push({ t: c, x: h, y: u });
      }
    }
  if (l.length === 0) return null;
  l.sort((u, c) => u.t - c.t);
  const f = l[0];
  return [f.x, f.y];
}
function On(e, t, n) {
  const i = e.length, o = new Array(i).fill(1);
  for (const r of t)
    for (let s = 0; s < i; s++) {
      const a = (s + 1) % i, l = He([e[s].bakw, e[a].bakw]), f = He([n.bakw, r.bakw]), u = Oi(l, f);
      if (u.features.length > 0 && u.features[0].geometry) {
        const c = u.features[0], h = Math.sqrt(
          Math.pow(r.bakw[0] - n.bakw[0], 2) + Math.pow(r.bakw[1] - n.bakw[1], 2)
        ), p = Math.sqrt(
          Math.pow(c.geometry.coordinates[0] - n.bakw[0], 2) + Math.pow(c.geometry.coordinates[1] - n.bakw[1], 2)
        ), M = h / p;
        M > o[s] && (o[s] = M), M > o[a] && (o[a] = M);
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
  const { convexBuf: i, centroid: o, allGcps: r, minx: s, maxx: a, miny: l, maxy: f } = e, u = Pr(i, o, t), h = [
    [s, l],
    [a, l],
    [a, f],
    [s, f]
  ].map((w) => ({
    forw: w,
    bakw: Br(
      w,
      o,
      u[Ir(w, o.forw)]
    )
  }));
  if (h.sort(
    (w, E) => Math.atan2(w.forw[0] - o.forw[0], w.forw[1] - o.forw[1]) - Math.atan2(E.forw[0] - o.forw[0], E.forw[1] - o.forw[1])
  ), On(h, r, o), !n) return h;
  const p = 4, M = h.map(
    (w) => Math.atan2(w.forw[0] - o.forw[0], w.forw[1] - o.forw[1])
  ), m = h.map(
    (w) => Math.atan2(
      w.bakw[0] - o.bakw[0],
      -(w.bakw[1] - o.bakw[1])
    )
  );
  function S(w) {
    for (let E = 0; E < p; E++) {
      const B = (E + 1) % p, P = M[E], I = E < p - 1 ? M[B] : M[B] + 2 * Math.PI;
      let O = w;
      for (; O < P; ) O += 2 * Math.PI;
      for (; O >= P + 2 * Math.PI; ) O -= 2 * Math.PI;
      if (O >= P && O < I)
        return { i: E, j: B, frac: (O - P) / (I - P) };
    }
    return { i: 0, j: 1, frac: 0 };
  }
  function _(w) {
    const { i: E, j: B, frac: P } = S(w), I = m[E];
    let X = m[B] - I;
    for (; X > Math.PI; ) X -= 2 * Math.PI;
    for (; X < -Math.PI; ) X += 2 * Math.PI;
    return I + P * X;
  }
  const g = new Set(
    h.map(
      (w) => Math.floor(In(w.forw, o.forw) / 10) % 36
    )
  ), v = r.map((w) => ({
    forw: w.forw,
    bakw: w.bakw,
    angleDeg: In(w.forw, o.forw),
    forwDist: Math.hypot(w.forw[0] - o.forw[0], w.forw[1] - o.forw[1])
  })), d = [];
  for (let w = 0; w < 36; w++) {
    if (g.has(w)) continue;
    const E = w * 10, B = v.filter(
      (A) => A.angleDeg >= E && A.angleDeg < E + 10
    );
    let P = null;
    if (B.length > 0) {
      const A = B.reduce((k, T) => T.forwDist > k.forwDist ? T : k);
      P = Bn(o.forw, A.forw, s, a, l, f);
    }
    if (!P) {
      const A = (E + 5) % 360 * (Math.PI / 180), k = [
        o.forw[0] + Math.sin(A),
        o.forw[1] + Math.cos(A)
      ];
      P = Bn(o.forw, k, s, a, l, f);
    }
    if (!P) continue;
    const I = [P[0] - o.forw[0], P[1] - o.forw[1]], O = Math.atan2(I[0], I[1]), X = _(O), R = [
      o.bakw[0] + Math.sin(X),
      o.bakw[1] - Math.cos(X)
    ], y = Nr(o.bakw, R, h);
    y && d.push({ forw: P, bakw: y });
  }
  const b = [...h, ...d];
  return b.sort(
    (w, E) => Math.atan2(w.forw[0] - o.forw[0], w.forw[1] - o.forw[1]) - Math.atan2(E.forw[0] - o.forw[0], E.forw[1] - o.forw[1])
  ), On(b, r, o), b;
}
function Tr(e, t = !1) {
  return Jn(e, "plain", t);
}
function Xr(e, t = !1) {
  return Jn(e, "birdeye", t);
}
function Cr(e) {
  const n = new Dr(e).findSegmentIntersections(), i = Hn(n), o = /* @__PURE__ */ new Map();
  return i.forEach((r) => {
    o.set(`${r.x}:${r.y}`, r);
  }), Array.from(o.values()).map(
    (r) => $t([r.x, r.y])
  );
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
    (r != this._xx.length || this._xx.length != this._yy.length) && Ge("ArcCollection#initXYData() Counting error"), this.initBounds(), this._arcIter = new no(this._xx, this._yy);
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
    const o = i.length, r = new Float64Array(o * 4), s = new se();
    let a = 0, l, f, u;
    for (let c = 0; c < o; c++)
      l = i[c], l > 0 && (f = c * 4, u = io(t, n, a, l), r[f++] = u[0], r[f++] = u[1], r[f++] = u[2], r[f] = u[3], a += l, s.mergeBounds(u));
    return {
      bb: r,
      bounds: s
    };
  }
  getBounds() {
    return this._allBounds ? this._allBounds.clone() : new se();
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
    let l = i ? this._ii[o] : this._ii[o] + s - 1, f = l, u = 0;
    for (let c = 1; c < s; c++)
      f += a, (r === 0 || this._zz[f] >= r) && (n(l, f, this._xx, this._yy), l = f, u++);
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
   * @returns 検出された交差点の配列
   */
  findSegmentIntersections() {
    const t = this.getBounds(), n = t.ymin || 0, i = (t.ymax || 0) - n, o = this.calcSegmentIntersectionStripeCount(), r = new Uint32Array(o), s = o > 1 ? (m) => Math.floor((o - 1) * (m - n) / i) : () => 0;
    let a, l;
    this.forEachSegment(
      (m, S, _, g) => {
        let v = s(g[m]);
        const d = s(g[S]);
        for (; r[v] = r[v] + 2, v != d; )
          v += d > v ? 1 : -1;
      }
    );
    const f = this.getUint32Array(Fr(r));
    let u = 0;
    const c = [];
    $r(r, (m) => {
      const S = u;
      u += m, c.push(f.subarray(S, u));
    }), Lr(r, 0), this.forEachSegment(
      (m, S, _, g) => {
        let v = s(g[m]);
        const d = s(g[S]);
        let b, w;
        for (; b = r[v], r[v] = b + 2, w = c[v], w[b] = m, w[b + 1] = S, v != d; )
          v += d > v ? 1 : -1;
      }
    );
    const h = this.getVertexData(), p = [];
    let M;
    for (a = 0; a < o; a++)
      if (h.xx && h.yy)
        for (M = jr(c[a], h.xx, h.yy), l = 0; l < M.length; l++)
          p.push(M[l]);
    return Hn(p);
  }
}
function Ge(...e) {
  const t = e.join(" ");
  throw new Error(t);
}
function Je(e) {
  return e ? Rr(e) ? !0 : Yr(e) ? !1 : e.length === 0 ? !0 : e.length > 0 : !1;
}
function Yr(e) {
  return e != null && e.toString === String.prototype.toString;
}
function Rr(e) {
  return Array.isArray(e);
}
function Fr(e, t) {
  Je(e) || Ge("utils.sum() expects an array, received:", e);
  let n = 0, i;
  for (let o = 0, r = e.length; o < r; o++)
    i = e[o], i && (n += i);
  return n;
}
function $r(e, t, n) {
  if (!Je(e))
    throw new Error(`#forEach() takes an array-like argument. ${e}`);
  for (let i = 0, o = e.length; i < o; i++)
    t.call(n, e[i], i);
}
function Lr(e, t) {
  for (let n = 0, i = e.length; n < i; n++)
    e[n] = t;
  return e;
}
function jr(e, t, n) {
  const i = e.length - 2, o = [];
  let r, s, a, l, f, u, c, h, p, M, m, S, _, g, v, d, b;
  for (Hr(t, e), d = 0; d < i; ) {
    for (r = e[d], s = e[d + 1], f = t[r], u = t[s], p = n[r], M = n[s], b = d; b < i && (b += 2, a = e[b], c = t[a], !(u < c)); ) {
      if (m = n[a], l = e[b + 1], h = t[l], S = n[l], p >= m) {
        if (p > S && M > m && M > S) continue;
      } else if (p < S && M < m && M < S) continue;
      r == a || r == l || s == a || s == l || (_ = Vr(
        f,
        p,
        u,
        M,
        c,
        m,
        h,
        S
      ), _ && (g = [r, s], v = [a, l], o.push(Tn(_, g, v, t, n)), _.length == 4 && o.push(
        Tn(_.slice(2), g, v, t, n)
      )));
    }
    d += 2;
  }
  return o;
}
function Vr(e, t, n, i, o, r, s, a) {
  const l = qr(e, t, n, i, o, r, s, a);
  let f = null;
  return l && (f = Ur(e, t, n, i, o, r, s, a), f ? Qr(e, t, n, i, o, r, s, a) && (f = null) : f = Kr(e, t, n, i, o, r, s, a)), f;
}
function qr(e, t, n, i, o, r, s, a) {
  return ne(e, t, n, i, o, r) * ne(e, t, n, i, s, a) <= 0 && ne(o, r, s, a, e, t) * ne(o, r, s, a, n, i) <= 0;
}
function ne(e, t, n, i, o, r) {
  return Kn(e - o, t - r, n - o, i - r);
}
function Kn(e, t, n, i) {
  return e * i - t * n;
}
function Ur(e, t, n, i, o, r, s, a) {
  let l = ve(e, t, n, i, o, r, s, a), f;
  return l && (f = Wr(l[0], l[1], e, t, n, i, o, r, s, a), f == 1 ? l = ve(n, i, e, t, o, r, s, a) : f == 2 ? l = ve(o, r, s, a, e, t, n, i) : f == 3 && (l = ve(s, a, o, r, e, t, n, i))), l && Jr(l, e, t, n, i, o, r, s, a), l;
}
function ve(e, t, n, i, o, r, s, a) {
  const l = Kn(n - e, i - t, s - o, a - r), f = 1e-18;
  let u;
  if (l === 0) return null;
  const c = ne(o, r, s, a, e, t) / l;
  return l <= f && l >= -f ? u = zr(e, t, n, i, o, r, s, a) : u = [e + c * (n - e), t + c * (i - t)], u;
}
function zr(e, t, n, i, o, r, s, a) {
  let l = null;
  return !Ot(e, o, s) && !Ot(t, r, a) ? l = [e, t] : !Ot(n, o, s) && !Ot(i, r, a) ? l = [n, i] : !Ot(o, e, n) && !Ot(r, t, i) ? l = [o, r] : !Ot(s, e, n) && !Ot(a, t, i) && (l = [s, a]), l;
}
function Ot(e, t, n) {
  let i;
  return t < n ? i = e < t || e > n : t > n ? i = e > t || e < n : i = e != t, i;
}
function Wr(e, t, ...n) {
  let i = -1, o = 1 / 0, r;
  for (let s = 0, a = 0, l = n.length; a < l; s++, a += 2)
    r = Gr(e, t, n[a], n[a + 1]), r < o && (o = r, i = s);
  return i;
}
function Gr(e, t, n, i) {
  const o = e - n, r = t - i;
  return o * o + r * r;
}
function Jr(e, t, n, i, o, r, s, a, l) {
  let f = e[0], u = e[1];
  f = be(f, t, i), f = be(f, r, a), u = be(u, n, o), u = be(u, s, l), e[0] = f, e[1] = u;
}
function be(e, t, n) {
  let i;
  return Ot(e, t, n) && (i = Math.abs(e - t) < Math.abs(e - n) ? t : n, e = i), e;
}
function Kr(e, t, n, i, o, r, s, a) {
  const l = Math.min(e, n, o, s), f = Math.max(e, n, o, s), u = Math.min(t, i, r, a), c = Math.max(t, i, r, a), h = c - u > f - l;
  let p = [];
  return (h ? Ft(t, u, c) : Ft(e, l, f)) && p.push(e, t), (h ? Ft(i, u, c) : Ft(n, l, f)) && p.push(n, i), (h ? Ft(r, u, c) : Ft(o, l, f)) && p.push(o, r), (h ? Ft(a, u, c) : Ft(s, l, f)) && p.push(s, a), (p.length != 2 && p.length != 4 || p.length == 4 && p[0] == p[2] && p[1] == p[3]) && (p = null), p;
}
function Qr(e, t, n, i, o, r, s, a) {
  return e == o && t == r || e == s && t == a || n == o && i == r || n == s && i == a;
}
function Ft(e, t, n) {
  return e > t && e < n;
}
function Hr(e, t) {
  Zr(e, t), Qn(e, t, 0, t.length - 2);
}
function Zr(e, t) {
  for (let n = 0, i = t.length; n < i; n += 2)
    e[t[n]] > e[t[n + 1]] && to(t, n, n + 1);
}
function to(e, t, n) {
  const i = e[t];
  e[t] = e[n], e[n] = i;
}
function Qn(e, t, n, i) {
  let o = n, r = i, s, a;
  for (; o < i; ) {
    for (s = e[t[n + i >> 2 << 1]]; o <= r; ) {
      for (; e[t[o]] < s; ) o += 2;
      for (; e[t[r]] > s; ) r -= 2;
      o <= r && (a = t[o], t[o] = t[r], t[r] = a, a = t[o + 1], t[o + 1] = t[r + 1], t[r + 1] = a, o += 2, r -= 2);
    }
    if (r - n < 40 ? Nn(e, t, n, r) : Qn(e, t, n, r), i - o < 40) {
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
function Hn(e) {
  const t = {};
  return e.filter((n) => {
    const i = eo(n);
    return i in t ? !1 : (t[i] = !0, !0);
  });
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
  let s, a, l, f, u, c;
  if (r > 0)
    l = u = e[o], f = c = t[o];
  else return [void 0, void 0, void 0, void 0];
  for (o++; o < r; o++)
    s = e[o], a = t[o], s < l && (l = s), s > u && (u = s), a < f && (f = a), a > c && (c = a);
  return [l, f, u, c];
}
class se {
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
    return new se(
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
      if (Je(t)) {
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
    return t instanceof se ? (i = t.xmin, o = t.ymin, r = t.xmax, s = t.ymax) : n.length == 3 ? (i = t, o = n[0], r = n[1], s = n[2]) : t.length == 4 ? (i = t[0], o = t[1], r = t[2], s = t[3]) : Ge("Bounds#mergeBounds() invalid argument:", t), this.xmin === void 0 ? this.setBounds(i, o, r, s) : (i < this.xmin && (this.xmin = i), o < this.ymin && (this.ymin = o), r > this.xmax && (this.xmax = r), s > this.ymax && (this.ymax = s)), this;
  }
}
function ke(e) {
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
function Zn(e, t, n) {
  const i = ke(t.forw), o = ke(t.bakw);
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
  const i = ke(t.forw), o = ke(t.bakw);
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
function xe(e, t, n) {
  return $t(e, { target: { geom: t, index: n } });
}
function _e(e) {
  return $t(e.properties.target.geom, {
    target: {
      geom: e.geometry.coordinates,
      index: e.properties.target.index
    }
  });
}
function Dn(e, t) {
  const n = e.length, i = t.geometry.coordinates;
  return Array.from({ length: n }, (o, r) => r).map((o) => {
    const r = (o + 1) % n, s = e[o], a = e[r], l = s.geometry.coordinates, f = Math.atan2(
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
    }, h = St([
      ae([u], c)
    ]);
    return [f, h];
  }).reduce(
    (o, r) => (o[0].push(r[0]), o[1].push(r[1]), o),
    [[], []]
  );
}
function ro(e) {
  const { tins: t, targets: n, includeReciprocals: i, numBoundaryVertices: o = 4 } = e, r = {};
  n.forEach((a) => {
    const l = t[a];
    if (!l || !l.features) return;
    r[a] = {};
    const f = {};
    l.features.forEach((u) => {
      const c = ["a", "b", "c"];
      for (let h = 0; h < 3; h++) {
        const p = (h + 1) % 3, M = c[h], m = c[p], S = u.properties[M].index, _ = u.properties[m].index, g = [S, _].sort().join("-");
        if (f[g]) continue;
        f[g] = !0;
        const v = u.geometry.coordinates[0][h], d = u.geometry.coordinates[0][p], b = u.properties[M].geom, w = u.properties[m].geom, E = Math.sqrt(
          Math.pow(b[0] - w[0], 2) + Math.pow(b[1] - w[1], 2)
        ) / Math.sqrt(
          Math.pow(v[0] - d[0], 2) + Math.pow(v[1] - d[1], 2)
        ), B = r[a];
        B[`${S}:${g}`] = E, B[`${_}:${g}`] = E;
      }
    });
  });
  const s = {};
  return i && (s.bakw = {}), n.forEach((a) => {
    const l = r[a];
    if (s[a] = {}, !l)
      return;
    const f = {};
    Object.keys(l).forEach((c) => {
      const [h] = c.split(":");
      f[h] || (f[h] = []), f[h].push(l[c]);
    }), Object.keys(f).forEach((c) => {
      const h = f[c], p = h.reduce((M, m) => M + m, 0) / h.length;
      s[a][c] = p, i && s.bakw && (s.bakw[c] = 1 / p);
    });
    let u = 0;
    for (let c = 0; c < o; c++) {
      const h = `b${c}`, p = s[a][h] || 0;
      u += p;
    }
    s[a].c = u / o, i && s.bakw && (s.bakw.c = 1 / s[a].c);
  }), s;
}
function Me(e, t = 1e-6) {
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
function ie(e) {
  return ["a", "b", "c"].map((t, n) => ({
    prop: e.properties[t],
    geom: e.geometry.coordinates[0][n]
  }));
}
const so = 10;
function ao(e, t, n, i, o, r) {
  if (!e && !t) return !1;
  const s = e ? 0 : 1, a = 1 - s, l = n[s], f = n[a];
  if (!l || !f) return !1;
  const u = xt(f.geom);
  let c = !1, h = !1;
  for (let p = 0; p <= 1; p++) {
    const M = i[p];
    if (!M) continue;
    const m = [String(M.prop.index), String(l.prop.index)].sort().join("-"), S = o[m];
    if (!S || S.length < 2) continue;
    const _ = S.find(
      (O) => O.bakw !== r[s].bakw
    );
    if (!_) continue;
    const v = ie(_.bakw).find(
      (O) => String(O.prop.index) !== String(M.prop.index) && String(O.prop.index) !== String(l.prop.index)
    );
    if (!v) continue;
    c = !0;
    const d = xt(v.geom), b = xt(M.geom), w = xt(l.geom), E = w[0] - b[0], B = w[1] - b[1], P = E * (u[1] - b[1]) - B * (u[0] - b[0]), I = E * (d[1] - b[1]) - B * (d[0] - b[0]);
    if (P * I > 0) {
      h = !0;
      break;
    }
  }
  return c && !h;
}
function co(e, t, n, i) {
  if (!e && !t) return !1;
  if (n[0] && n[1] && i[0] && i[1]) {
    const o = i.map((u) => xt(u.geom)), r = n.map((u) => xt(u.geom)), s = o[1][0] - o[0][0], a = o[1][1] - o[0][1], l = s * (r[0][1] - o[0][1]) - a * (r[0][0] - o[0][0]), f = s * (r[1][1] - o[0][1]) - a * (r[1][0] - o[0][0]);
    return l * f < 0;
  }
  return !1;
}
function fo(e, t, n, i) {
  const o = oo(n, i), r = /* @__PURE__ */ new Set();
  let s = !1;
  for (let a = 0; a < so; a++) {
    let l = !1;
    for (const f of Object.keys(t)) {
      if (r.has(f)) continue;
      r.add(f);
      const u = t[f];
      if (!u || u.length < 2) continue;
      const c = f.split("-");
      if (c.length !== 2 || o.has(f)) continue;
      const h = ie(u[0].bakw), p = ie(u[1].bakw), M = ie(u[0].forw), m = ie(u[1].forw), S = c.map(
        (x) => h.find((N) => `${N.prop.index}` === x) || p.find((N) => `${N.prop.index}` === x)
      ), _ = c.map(
        (x) => M.find((N) => `${N.prop.index}` === x) || m.find((N) => `${N.prop.index}` === x)
      );
      if (S.some((x) => !x) || _.some((x) => !x))
        continue;
      const g = [h, p].map(
        (x) => x.find((N) => !c.includes(`${N.prop.index}`))
      ), v = [M, m].map(
        (x) => x.find((N) => !c.includes(`${N.prop.index}`))
      );
      if (g.some((x) => !x) || v.some((x) => !x))
        continue;
      const d = u[0].bakw.geometry.coordinates[0].slice(0, 3).map((x) => xt(x)), b = u[1].bakw.geometry.coordinates[0].slice(0, 3).map((x) => xt(x)), w = u[0].forw.geometry.coordinates[0].slice(0, 3).map((x) => xt(x)), E = u[1].forw.geometry.coordinates[0].slice(0, 3).map((x) => xt(x)), B = Me(d), P = Me(b), I = Me(w), O = Me(E), X = ao(
        B,
        P,
        g,
        S,
        t,
        u
      ), R = co(
        I,
        O,
        g,
        S
      );
      if (!(X || R || Yn(
        xt(g[0].geom),
        b
      ) || Yn(
        xt(g[1].geom),
        d
      )))
        continue;
      const A = _.map(
        (x) => xt(x.geom)
      ), k = v.map(
        (x) => xt(x.geom)
      ), T = lo([
        ...A,
        ...k
      ]), C = ho(T), Y = Rn(
        A[0],
        A[1],
        k[0]
      ) + Rn(
        A[0],
        A[1],
        k[1]
      );
      Ve(C, Y) && (Cn(t, u[0], e), Cn(t, u[1], e), S.forEach((x) => {
        if (!x) return;
        const N = [
          x.geom,
          g[0].geom,
          g[1].geom,
          x.geom
        ], D = {
          a: x.prop,
          b: g[0].prop,
          c: g[1].prop
        }, F = ae([N], D), L = zn(F);
        Zn(t, {
          forw: L,
          bakw: F
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
function Yn(e, t) {
  const [n, i] = t[0], [o, r] = t[1], [s, a] = t[2], l = s - n, f = a - i, u = o - n, c = r - i, h = e[0] - n, p = e[1] - i, M = l * l + f * f, m = l * u + f * c, S = l * h + f * p, _ = u * u + c * c, g = u * h + c * p, v = M * _ - m * m;
  if (v === 0) return !1;
  const d = 1 / v, b = (_ * S - m * g) * d, w = (M * g - m * S) * d, E = 1e-9;
  return b >= -E && w >= -E && b + w <= 1 + E;
}
function lo(e) {
  const t = e.map((s) => s.slice()).filter(
    (s, a, l) => l.findIndex(
      (f) => Ve(f[0], s[0]) && Ve(f[1], s[1])
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
function Rn(e, t, n) {
  return Math.abs(
    (e[0] * (t[1] - n[1]) + t[0] * (n[1] - e[1]) + n[0] * (e[1] - t[1])) / 2
  );
}
function Ve(e, t, n = 1e-9) {
  return Math.abs(e - t) <= n;
}
const Fn = 3;
class ft extends Mt {
  importance;
  priority;
  pointsSet;
  useV2Algorithm;
  /**
   * Tinクラスのインスタンスを生成します
   * @param options - 初期化オプション
   */
  constructor(t = {}) {
    super(), t.bounds ? this.setBounds(t.bounds) : (this.setWh(t.wh), this.vertexMode = t.vertexMode || ft.VERTEX_PLAIN), this.strictMode = t.strictMode || ft.MODE_AUTO, this.yaxisMode = t.yaxisMode || ft.YAXIS_INVERT, this.importance = t.importance || 0, this.priority = t.priority || 0, this.stateFull = t.stateFull || !1, this.useV2Algorithm = t.useV2Algorithm ?? !1, t.points && this.setPoints(t.points), t.edges && this.setEdges(t.edges);
  }
  /**
   * フォーマットバージョンを取得します
   */
  getFormatVersion() {
    return this.useV2Algorithm ? kn : Fn;
  }
  /**
   * 制御点（GCP: Ground Control Points）を設定します。
   * 指定した点群に合わせて内部のTINキャッシュをリセットします。
   */
  setPoints(t) {
    this.yaxisMode === ft.YAXIS_FOLLOW && (t = t.map((n) => [
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
    s.push(t[0]), this.boundsPolygon = ae([s]), this.xy = [n, o], this.wh = [i - n, r - o], this.vertexMode = ft.VERTEX_PLAIN, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 現在の設定を永続化可能な形式にコンパイルします
   */
  getCompiled() {
    const t = {};
    t.version = this.useV2Algorithm ? kn : Fn, t.points = this.points, t.weight_buffer = this.pointsWeightBuffer ?? {}, t.centroid_point = [
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
    }), this.strict_status === ft.STATUS_LOOSE ? (t.tins_points[1] = [], this.tins.bakw.features.map((i) => {
      t.tins_points[1].push(
        ["a", "b", "c"].map(
          (o) => i.properties[o].index
        )
      );
    })) : this.strict_status === ft.STATUS_ERROR && this.kinks?.bakw && (t.kinks_points = this.kinks.bakw.features.map(
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
   */
  calculateStrictTin() {
    const t = this.tins.forw.features.map(
      (r) => zn(r)
    );
    this.tins.bakw = St(t);
    const n = {};
    this.tins.forw.features.forEach((r, s) => {
      const a = this.tins.bakw.features[s];
      Zn(n, { forw: r, bakw: a });
    });
    const i = (this.pointsSet?.forw.features ?? []).map(
      (r) => r.properties.target.index
    );
    fo(
      this.tins,
      n,
      this.pointsSet?.edges || [],
      i
    );
    const o = ["forw", "bakw"].map((r) => {
      const s = this.tins[r].features.map(
        (a) => a.geometry.coordinates[0]
      );
      return Cr(s);
    });
    o[0].length === 0 && o[1].length === 0 ? (this.strict_status = ft.STATUS_STRICT, delete this.kinks) : (this.strict_status = ft.STATUS_ERROR, this.kinks = {
      forw: St(o[0]),
      bakw: St(o[1])
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
      const r = this.points[o][0], s = this.points[o][1], a = xe(r, s, o);
      t.forw.push(a), t.bakw.push(_e(a));
    }
    const n = [];
    let i = 0;
    this.edgeNodes = [], this.edges || (this.edges = []);
    for (let o = 0; o < this.edges.length; o++) {
      const r = this.edges[o][2], s = Object.assign([], this.edges[o][0]), a = Object.assign([], this.edges[o][1]);
      if (s.length === 0 && a.length === 0) {
        n.push(r);
        continue;
      }
      s.unshift(this.points[r[0]][0]), s.push(this.points[r[1]][0]), a.unshift(this.points[r[0]][1]), a.push(this.points[r[1]][1]);
      const l = [s, a].map((f) => {
        const u = f.map((h, p, M) => {
          if (p === 0) return 0;
          const m = M[p - 1];
          return Math.sqrt(
            Math.pow(h[0] - m[0], 2) + Math.pow(h[1] - m[1], 2)
          );
        }), c = u.reduce((h, p, M) => M === 0 ? [0] : (h.push(h[M - 1] + p), h), []);
        return c.map((h, p, M) => {
          const m = h / M[M.length - 1];
          return [f[p], u[p], c[p], m];
        });
      });
      l.map((f, u) => {
        const c = l[u ? 0 : 1];
        return f.filter((h, p) => !(p === 0 || p === f.length - 1 || h[4] === "handled")).flatMap((h) => {
          const p = h[0], M = h[3], m = c.reduce(
            (S, _, g, v) => {
              if (S) return S;
              const d = v[g + 1];
              if (_[3] === M)
                return _[4] = "handled", [_];
              if (_[3] < M && d && d[3] > M)
                return [_, d];
            },
            void 0
          );
          if (m && m.length === 1)
            return u === 0 ? [[p, m[0][0], M]] : [[m[0][0], p, M]];
          if (m && m.length === 2) {
            const S = m[0], _ = m[1], g = (M - S[3]) / (_[3] - S[3]), v = [
              (_[0][0] - S[0][0]) * g + S[0][0],
              (_[0][1] - S[0][1]) * g + S[0][1]
            ];
            return u === 0 ? [[p, v, M]] : [[v, p, M]];
          }
          return [];
        });
      }).reduce((f, u) => f.concat(u), []).sort((f, u) => f[2] < u[2] ? -1 : 1).map((f, u, c) => {
        this.edgeNodes[i] = [
          f[0],
          f[1]
        ];
        const h = xe(
          f[0],
          f[1],
          `e${i}`
        );
        i++, t.forw.push(h), t.bakw.push(_e(h)), u === 0 ? n.push([r[0], t.forw.length - 1]) : n.push([
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
    t !== ft.MODE_STRICT && t !== ft.MODE_LOOSE && (t = ft.MODE_AUTO);
    const n = !this.useV2Algorithm;
    let i, o, r, s, a;
    if (n) {
      if (this.bounds) {
        const I = this.boundsPolygon;
        if (!I) throw new Error("Internal error: bounds is set but boundsPolygon is missing");
        if (!this.points.every(
          (X) => Xe(X[0], I)
        )) throw "SOME POINTS OUTSIDE";
      }
      i = this.generatePointsSet(), { minx: o, maxx: r, miny: s, maxy: a } = this.computeGcpBbox();
    } else {
      const I = this.validateAndPrepareInputs();
      i = I.pointsSet, o = I.minx, r = I.maxx, s = I.miny, a = I.maxy;
    }
    const l = {
      forw: St(i.forw),
      bakw: St(i.bakw)
    }, f = ye(
      l.forw,
      i.edges,
      "target"
    ), u = ye(
      l.bakw,
      i.edges,
      "target"
    );
    if (f.features.length === 0 || u.features.length === 0)
      throw "TOO LINEAR1";
    const c = Xi(l.forw), h = mn(l.forw);
    if (!h) throw "TOO LINEAR2";
    const p = {}, M = h.geometry.coordinates[0];
    let m;
    try {
      m = M.map((I) => ({
        forw: I,
        bakw: ee($t(I), f)
      })), m.forEach((I) => {
        p[`${I.forw[0]}:${I.forw[1]}`] = I;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const S = mn(l.bakw);
    if (!S) throw "TOO LINEAR2";
    const _ = S.geometry.coordinates[0];
    try {
      m = _.map((I) => ({
        bakw: I,
        forw: ee($t(I), u)
      })), m.forEach((I) => {
        p[`${I.forw[0]}:${I.forw[1]}`] = I;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    let g;
    if (n) {
      const I = c.geometry.coordinates, O = f.features.find(
        (X) => Xe(
          $t(I),
          X
        )
      );
      if (O) {
        const X = O.geometry.coordinates[0], R = O.properties.a.geom, y = O.properties.b.geom, A = O.properties.c.geom;
        g = {
          forw: [
            (X[0][0] + X[1][0] + X[2][0]) / 3,
            (X[0][1] + X[1][1] + X[2][1]) / 3
          ],
          bakw: [
            (R[0] + y[0] + A[0]) / 3,
            (R[1] + y[1] + A[1]) / 3
          ]
        };
      } else
        g = {
          forw: I,
          bakw: ee(c, f)
        };
    } else
      g = {
        forw: c.geometry.coordinates,
        bakw: ee(c, f)
      };
    const v = xe(g.forw, g.bakw, "c");
    this.centroid = {
      forw: v,
      bakw: _e(v)
    };
    const d = [
      ...this.points.map((I) => ({ forw: I[0], bakw: I[1] })),
      ...(this.edgeNodes ?? []).map((I) => ({ forw: I[0], bakw: I[1] }))
    ], b = {
      convexBuf: p,
      centroid: g,
      allGcps: d,
      minx: o,
      maxx: r,
      miny: s,
      maxy: a
    }, w = this.vertexMode === ft.VERTEX_BIRDEYE ? Xr(b, n) : Tr(b, n), E = {
      forw: [],
      bakw: []
    };
    for (let I = 0; I < w.length; I++) {
      const O = w[I].forw, X = w[I].bakw, R = xe(O, X, `b${I}`), y = _e(R);
      i.forw.push(R), i.bakw.push(y), E.forw.push(R), E.bakw.push(y);
    }
    this.pointsSet = {
      forw: St(i.forw),
      bakw: St(i.bakw),
      edges: i.edges
    }, this.tins = {
      forw: Mn(
        ye(
          this.pointsSet.forw,
          i.edges,
          "target"
        )
      )
    }, (t === ft.MODE_STRICT || t === ft.MODE_AUTO) && this.calculateStrictTin(), (t === ft.MODE_LOOSE || t === ft.MODE_AUTO && this.strict_status === ft.STATUS_ERROR) && (this.tins.bakw = Mn(
      ye(
        this.pointsSet.bakw,
        i.edges,
        "target"
      )
    ), delete this.kinks, this.strict_status = ft.STATUS_LOOSE), this.vertices_params = {
      forw: Dn(E.forw, this.centroid.forw),
      bakw: Dn(E.bakw, this.centroid.bakw)
    }, this.addIndexedTin();
    const B = ["forw"];
    this.strict_status === ft.STATUS_LOOSE && B.push("bakw");
    const P = this.strict_status === ft.STATUS_STRICT;
    this.pointsWeightBuffer = ro({
      tins: this.tins,
      targets: B,
      includeReciprocals: P,
      numBoundaryVertices: w.length
    });
  }
  /**
   * 非同期ラッパーを提供します。
   * 互換性のために Promise ベースの API を維持しますが、内部処理は同期的です。
   */
  async updateTinAsync() {
    this.updateTin();
  }
}
export {
  ft as Tin,
  ye as constrainedTin,
  _e as counterPoint,
  xe as createPoint,
  ft as default,
  Cr as findIntersections,
  kn as format_version,
  Zn as insertSearchIndex,
  Dn as vertexCalc
};
