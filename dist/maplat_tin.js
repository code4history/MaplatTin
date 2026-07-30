function te(n, t, e = {}) {
  const i = { type: "Feature" };
  return (e.id === 0 || e.id) && (i.id = e.id), e.bbox && (i.bbox = e.bbox), i.properties = t || {}, i.geometry = n, i;
}
function Rt(n, t, e = {}) {
  if (!n)
    throw new Error("coordinates is required");
  if (!Array.isArray(n))
    throw new Error("coordinates must be an Array");
  if (n.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!ze(n[0]) || !ze(n[1]))
    throw new Error("coordinates must contain numbers");
  return te({
    type: "Point",
    coordinates: n
  }, t, e);
}
function ie(n, t, e = {}) {
  for (const o of n) {
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
  return te({
    type: "Polygon",
    coordinates: n
  }, t, e);
}
function Ue(n, t, e = {}) {
  if (n.length < 2)
    throw new Error("coordinates must be an array of two or more positions");
  return te({
    type: "LineString",
    coordinates: n
  }, t, e);
}
function _t(n, t = {}) {
  const e = { type: "FeatureCollection" };
  return t.id && (e.id = t.id), t.bbox && (e.bbox = t.bbox), e.features = n, e;
}
function ze(n) {
  return !isNaN(n) && n !== null && !Array.isArray(n);
}
function Gn(n) {
  if (!n)
    throw new Error("coord is required");
  if (!Array.isArray(n)) {
    if (n.type === "Feature" && n.geometry !== null && n.geometry.type === "Point")
      return [...n.geometry.coordinates];
    if (n.type === "Point")
      return [...n.coordinates];
  }
  if (Array.isArray(n) && n.length >= 2 && !Array.isArray(n[0]) && !Array.isArray(n[1]))
    return [...n];
  throw new Error("coord must be GeoJSON Point or an Array of numbers");
}
function Jn(n) {
  return n.type === "Feature" ? n.geometry : n;
}
function Ye(n, t, e) {
  if (n !== null)
    for (var i, o, r, s, a, c, f, l = 0, h = 0, u, p = n.type, x = p === "FeatureCollection", y = p === "Feature", S = x ? n.features.length : 1, k = 0; k < S; k++) {
      f = x ? (
        // @ts-expect-error: Known type conflict
        n.features[k].geometry
      ) : y ? (
        // @ts-expect-error: Known type conflict
        n.geometry
      ) : n, u = f ? f.type === "GeometryCollection" : !1, a = u ? f.geometries.length : 1;
      for (var g = 0; g < a; g++) {
        var v = 0, d = 0;
        if (s = u ? f.geometries[g] : f, s !== null) {
          c = s.coordinates;
          var b = s.type;
          switch (l = e && (b === "Polygon" || b === "MultiPolygon") ? 1 : 0, b) {
            case null:
              break;
            case "Point":
              if (
                // @ts-expect-error: Known type conflict
                t(
                  c,
                  h,
                  k,
                  v,
                  d
                ) === !1
              )
                return !1;
              h++, v++;
              break;
            case "LineString":
            case "MultiPoint":
              for (i = 0; i < c.length; i++) {
                if (
                  // @ts-expect-error: Known type conflict
                  t(
                    c[i],
                    h,
                    k,
                    v,
                    d
                  ) === !1
                )
                  return !1;
                h++, b === "MultiPoint" && v++;
              }
              b === "LineString" && v++;
              break;
            case "Polygon":
            case "MultiLineString":
              for (i = 0; i < c.length; i++) {
                for (o = 0; o < c[i].length - l; o++) {
                  if (
                    // @ts-expect-error: Known type conflict
                    t(
                      c[i][o],
                      h,
                      k,
                      v,
                      d
                    ) === !1
                  )
                    return !1;
                  h++;
                }
                b === "MultiLineString" && v++, b === "Polygon" && d++;
              }
              b === "Polygon" && v++;
              break;
            case "MultiPolygon":
              for (i = 0; i < c.length; i++) {
                for (d = 0, o = 0; o < c[i].length; o++) {
                  for (r = 0; r < c[i][o].length - l; r++) {
                    if (
                      // @ts-expect-error: Known type conflict
                      t(
                        c[i][o][r],
                        h,
                        k,
                        v,
                        d
                      ) === !1
                    )
                      return !1;
                    h++;
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
                  Ye(s.geometries[i], t, e) === !1
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
const dt = 11102230246251565e-32, U = 134217729, In = (3 + 8 * dt) * dt;
function lt(n, t, e, i, o) {
  let r, s, a, c, f = t[0], l = i[0], h = 0, u = 0;
  l > f == l > -f ? (r = f, f = t[++h]) : (r = l, l = i[++u]);
  let p = 0;
  if (h < n && u < e)
    for (l > f == l > -f ? (s = f + r, a = r - (s - f), f = t[++h]) : (s = l + r, a = r - (s - l), l = i[++u]), r = s, a !== 0 && (o[p++] = a); h < n && u < e; )
      l > f == l > -f ? (s = r + f, c = s - r, a = r - (s - c) + (f - c), f = t[++h]) : (s = r + l, c = s - r, a = r - (s - c) + (l - c), l = i[++u]), r = s, a !== 0 && (o[p++] = a);
  for (; h < n; )
    s = r + f, c = s - r, a = r - (s - c) + (f - c), f = t[++h], r = s, a !== 0 && (o[p++] = a);
  for (; u < e; )
    s = r + l, c = s - r, a = r - (s - c) + (l - c), l = i[++u], r = s, a !== 0 && (o[p++] = a);
  return (r !== 0 || p === 0) && (o[p++] = r), p;
}
function bt(n, t, e, i, o, r, s, a) {
  return lt(lt(n, t, e, i, s), s, o, r, a);
}
function F(n, t, e, i) {
  let o, r, s, a, c, f, l, h, u, p, x;
  l = U * e, p = l - (l - e), x = e - p;
  let y = t[0];
  o = y * e, l = U * y, h = l - (l - y), u = y - h, s = u * x - (o - h * p - u * p - h * x);
  let S = 0;
  s !== 0 && (i[S++] = s);
  for (let k = 1; k < n; k++)
    y = t[k], a = y * e, l = U * y, h = l - (l - y), u = y - h, c = u * x - (a - h * p - u * p - h * x), r = o + c, f = r - o, s = o - (r - f) + (c - f), s !== 0 && (i[S++] = s), o = a + r, s = r - (o - a), s !== 0 && (i[S++] = s);
  return (o !== 0 || S === 0) && (i[S++] = o), S;
}
function Bn(n, t) {
  let e = t[0];
  for (let i = 1; i < n; i++) e += t[i];
  return e;
}
function tt(n) {
  return new Float64Array(n);
}
const Kn = (3 + 16 * dt) * dt, Qn = (2 + 12 * dt) * dt, Hn = (9 + 64 * dt) * dt * dt, jt = tt(4), We = tt(8), Ge = tt(12), Je = tt(16), pt = tt(4);
function Zn(n, t, e, i, o, r, s) {
  let a, c, f, l, h, u, p, x, y, S, k, g, v, d, b, m, A, B;
  const P = n - o, I = e - o, T = t - r, C = i - r;
  d = P * C, u = U * P, p = u - (u - P), x = P - p, u = U * C, y = u - (u - C), S = C - y, b = x * S - (d - p * y - x * y - p * S), m = T * I, u = U * T, p = u - (u - T), x = T - p, u = U * I, y = u - (u - I), S = I - y, A = x * S - (m - p * y - x * y - p * S), k = b - A, h = b - k, jt[0] = b - (k + h) + (h - A), g = d + k, h = g - d, v = d - (g - h) + (k - h), k = v - m, h = v - k, jt[1] = v - (k + h) + (h - m), B = g + k, h = B - g, jt[2] = g - (B - h) + (k - h), jt[3] = B;
  let Y = Bn(4, jt), w = Qn * s;
  if (Y >= w || -Y >= w || (h = n - P, a = n - (P + h) + (h - o), h = e - I, f = e - (I + h) + (h - o), h = t - T, c = t - (T + h) + (h - r), h = i - C, l = i - (C + h) + (h - r), a === 0 && c === 0 && f === 0 && l === 0) || (w = Hn * s + In * Math.abs(Y), Y += P * l + C * a - (T * f + I * c), Y >= w || -Y >= w)) return Y;
  d = a * C, u = U * a, p = u - (u - a), x = a - p, u = U * C, y = u - (u - C), S = C - y, b = x * S - (d - p * y - x * y - p * S), m = c * I, u = U * c, p = u - (u - c), x = c - p, u = U * I, y = u - (u - I), S = I - y, A = x * S - (m - p * y - x * y - p * S), k = b - A, h = b - k, pt[0] = b - (k + h) + (h - A), g = d + k, h = g - d, v = d - (g - h) + (k - h), k = v - m, h = v - k, pt[1] = v - (k + h) + (h - m), B = g + k, h = B - g, pt[2] = g - (B - h) + (k - h), pt[3] = B;
  const E = lt(4, jt, 4, pt, We);
  d = P * l, u = U * P, p = u - (u - P), x = P - p, u = U * l, y = u - (u - l), S = l - y, b = x * S - (d - p * y - x * y - p * S), m = T * f, u = U * T, p = u - (u - T), x = T - p, u = U * f, y = u - (u - f), S = f - y, A = x * S - (m - p * y - x * y - p * S), k = b - A, h = b - k, pt[0] = b - (k + h) + (h - A), g = d + k, h = g - d, v = d - (g - h) + (k - h), k = v - m, h = v - k, pt[1] = v - (k + h) + (h - m), B = g + k, h = B - g, pt[2] = g - (B - h) + (k - h), pt[3] = B;
  const M = lt(E, We, 4, pt, Ge);
  d = a * l, u = U * a, p = u - (u - a), x = a - p, u = U * l, y = u - (u - l), S = l - y, b = x * S - (d - p * y - x * y - p * S), m = c * f, u = U * c, p = u - (u - c), x = c - p, u = U * f, y = u - (u - f), S = f - y, A = x * S - (m - p * y - x * y - p * S), k = b - A, h = b - k, pt[0] = b - (k + h) + (h - A), g = d + k, h = g - d, v = d - (g - h) + (k - h), k = v - m, h = v - k, pt[1] = v - (k + h) + (h - m), B = g + k, h = B - g, pt[2] = g - (B - h) + (k - h), pt[3] = B;
  const N = lt(M, Ge, 4, pt, Je);
  return Je[N - 1];
}
function At(n, t, e, i, o, r) {
  const s = (t - r) * (e - o), a = (n - o) * (i - r), c = s - a, f = Math.abs(s + a);
  return Math.abs(c) >= Kn * f ? c : -Zn(n, t, e, i, o, r, f);
}
const ti = (10 + 96 * dt) * dt, ei = (4 + 48 * dt) * dt, ni = (44 + 576 * dt) * dt * dt, Nt = tt(4), Tt = tt(4), Xt = tt(4), Mt = tt(4), kt = tt(4), St = tt(4), gt = tt(4), mt = tt(4), _e = tt(8), Me = tt(8), ke = tt(8), Se = tt(8), Ee = tt(8), Ae = tt(8), oe = tt(8), se = tt(8), ae = tt(8), Yt = tt(4), Ft = tt(4), Lt = tt(4), z = tt(8), J = tt(16), nt = tt(16), it = tt(16), et = tt(32), Ct = tt(32), at = tt(48), yt = tt(64);
let Ut = tt(1152), Pe = tt(1152);
function ct(n, t, e) {
  n = lt(n, Ut, t, e, Pe);
  const i = Ut;
  return Ut = Pe, Pe = i, n;
}
function ii(n, t, e, i, o, r, s, a, c) {
  let f, l, h, u, p, x, y, S, k, g, v, d, b, m, A, B, P, I, T, C, Y, w, E, M, N, O, D, _, X, R, L, V, $, q, j;
  const G = n - s, W = e - s, K = o - s, Q = t - a, Z = i - a, H = r - a;
  L = W * H, E = U * W, M = E - (E - W), N = W - M, E = U * H, O = E - (E - H), D = H - O, V = N * D - (L - M * O - N * O - M * D), $ = K * Z, E = U * K, M = E - (E - K), N = K - M, E = U * Z, O = E - (E - Z), D = Z - O, q = N * D - ($ - M * O - N * O - M * D), _ = V - q, w = V - _, Nt[0] = V - (_ + w) + (w - q), X = L + _, w = X - L, R = L - (X - w) + (_ - w), _ = R - $, w = R - _, Nt[1] = R - (_ + w) + (w - $), j = X + _, w = j - X, Nt[2] = X - (j - w) + (_ - w), Nt[3] = j, L = K * Q, E = U * K, M = E - (E - K), N = K - M, E = U * Q, O = E - (E - Q), D = Q - O, V = N * D - (L - M * O - N * O - M * D), $ = G * H, E = U * G, M = E - (E - G), N = G - M, E = U * H, O = E - (E - H), D = H - O, q = N * D - ($ - M * O - N * O - M * D), _ = V - q, w = V - _, Tt[0] = V - (_ + w) + (w - q), X = L + _, w = X - L, R = L - (X - w) + (_ - w), _ = R - $, w = R - _, Tt[1] = R - (_ + w) + (w - $), j = X + _, w = j - X, Tt[2] = X - (j - w) + (_ - w), Tt[3] = j, L = G * Z, E = U * G, M = E - (E - G), N = G - M, E = U * Z, O = E - (E - Z), D = Z - O, V = N * D - (L - M * O - N * O - M * D), $ = W * Q, E = U * W, M = E - (E - W), N = W - M, E = U * Q, O = E - (E - Q), D = Q - O, q = N * D - ($ - M * O - N * O - M * D), _ = V - q, w = V - _, Xt[0] = V - (_ + w) + (w - q), X = L + _, w = X - L, R = L - (X - w) + (_ - w), _ = R - $, w = R - _, Xt[1] = R - (_ + w) + (w - $), j = X + _, w = j - X, Xt[2] = X - (j - w) + (_ - w), Xt[3] = j, f = lt(
    lt(
      lt(
        F(F(4, Nt, G, z), z, G, J),
        J,
        F(F(4, Nt, Q, z), z, Q, nt),
        nt,
        et
      ),
      et,
      lt(
        F(F(4, Tt, W, z), z, W, J),
        J,
        F(F(4, Tt, Z, z), z, Z, nt),
        nt,
        Ct
      ),
      Ct,
      yt
    ),
    yt,
    lt(
      F(F(4, Xt, K, z), z, K, J),
      J,
      F(F(4, Xt, H, z), z, H, nt),
      nt,
      et
    ),
    et,
    Ut
  );
  let st = Bn(f, Ut), ht = ei * c;
  if (st >= ht || -st >= ht || (w = n - G, l = n - (G + w) + (w - s), w = t - Q, p = t - (Q + w) + (w - a), w = e - W, h = e - (W + w) + (w - s), w = i - Z, x = i - (Z + w) + (w - a), w = o - K, u = o - (K + w) + (w - s), w = r - H, y = r - (H + w) + (w - a), l === 0 && h === 0 && u === 0 && p === 0 && x === 0 && y === 0) || (ht = ni * c + In * Math.abs(st), st += (G * G + Q * Q) * (W * y + H * h - (Z * u + K * x)) + 2 * (G * l + Q * p) * (W * H - Z * K) + ((W * W + Z * Z) * (K * p + Q * u - (H * l + G * y)) + 2 * (W * h + Z * x) * (K * Q - H * G)) + ((K * K + H * H) * (G * x + Z * l - (Q * h + W * p)) + 2 * (K * u + H * y) * (G * Z - Q * W)), st >= ht || -st >= ht))
    return st;
  if ((h !== 0 || x !== 0 || u !== 0 || y !== 0) && (L = G * G, E = U * G, M = E - (E - G), N = G - M, V = N * N - (L - M * M - (M + M) * N), $ = Q * Q, E = U * Q, M = E - (E - Q), N = Q - M, q = N * N - ($ - M * M - (M + M) * N), _ = V + q, w = _ - V, Mt[0] = V - (_ - w) + (q - w), X = L + _, w = X - L, R = L - (X - w) + (_ - w), _ = R + $, w = _ - R, Mt[1] = R - (_ - w) + ($ - w), j = X + _, w = j - X, Mt[2] = X - (j - w) + (_ - w), Mt[3] = j), (u !== 0 || y !== 0 || l !== 0 || p !== 0) && (L = W * W, E = U * W, M = E - (E - W), N = W - M, V = N * N - (L - M * M - (M + M) * N), $ = Z * Z, E = U * Z, M = E - (E - Z), N = Z - M, q = N * N - ($ - M * M - (M + M) * N), _ = V + q, w = _ - V, kt[0] = V - (_ - w) + (q - w), X = L + _, w = X - L, R = L - (X - w) + (_ - w), _ = R + $, w = _ - R, kt[1] = R - (_ - w) + ($ - w), j = X + _, w = j - X, kt[2] = X - (j - w) + (_ - w), kt[3] = j), (l !== 0 || p !== 0 || h !== 0 || x !== 0) && (L = K * K, E = U * K, M = E - (E - K), N = K - M, V = N * N - (L - M * M - (M + M) * N), $ = H * H, E = U * H, M = E - (E - H), N = H - M, q = N * N - ($ - M * M - (M + M) * N), _ = V + q, w = _ - V, St[0] = V - (_ - w) + (q - w), X = L + _, w = X - L, R = L - (X - w) + (_ - w), _ = R + $, w = _ - R, St[1] = R - (_ - w) + ($ - w), j = X + _, w = j - X, St[2] = X - (j - w) + (_ - w), St[3] = j), l !== 0 && (S = F(4, Nt, l, _e), f = ct(f, bt(
    F(S, _e, 2 * G, J),
    J,
    F(F(4, St, l, z), z, Z, nt),
    nt,
    F(F(4, kt, l, z), z, -H, it),
    it,
    et,
    at
  ), at)), p !== 0 && (k = F(4, Nt, p, Me), f = ct(f, bt(
    F(k, Me, 2 * Q, J),
    J,
    F(F(4, kt, p, z), z, K, nt),
    nt,
    F(F(4, St, p, z), z, -W, it),
    it,
    et,
    at
  ), at)), h !== 0 && (g = F(4, Tt, h, ke), f = ct(f, bt(
    F(g, ke, 2 * W, J),
    J,
    F(F(4, Mt, h, z), z, H, nt),
    nt,
    F(F(4, St, h, z), z, -Q, it),
    it,
    et,
    at
  ), at)), x !== 0 && (v = F(4, Tt, x, Se), f = ct(f, bt(
    F(v, Se, 2 * Z, J),
    J,
    F(F(4, St, x, z), z, G, nt),
    nt,
    F(F(4, Mt, x, z), z, -K, it),
    it,
    et,
    at
  ), at)), u !== 0 && (d = F(4, Xt, u, Ee), f = ct(f, bt(
    F(d, Ee, 2 * K, J),
    J,
    F(F(4, kt, u, z), z, Q, nt),
    nt,
    F(F(4, Mt, u, z), z, -Z, it),
    it,
    et,
    at
  ), at)), y !== 0 && (b = F(4, Xt, y, Ae), f = ct(f, bt(
    F(b, Ae, 2 * H, J),
    J,
    F(F(4, Mt, y, z), z, W, nt),
    nt,
    F(F(4, kt, y, z), z, -G, it),
    it,
    et,
    at
  ), at)), l !== 0 || p !== 0) {
    if (h !== 0 || x !== 0 || u !== 0 || y !== 0 ? (L = h * H, E = U * h, M = E - (E - h), N = h - M, E = U * H, O = E - (E - H), D = H - O, V = N * D - (L - M * O - N * O - M * D), $ = W * y, E = U * W, M = E - (E - W), N = W - M, E = U * y, O = E - (E - y), D = y - O, q = N * D - ($ - M * O - N * O - M * D), _ = V + q, w = _ - V, gt[0] = V - (_ - w) + (q - w), X = L + _, w = X - L, R = L - (X - w) + (_ - w), _ = R + $, w = _ - R, gt[1] = R - (_ - w) + ($ - w), j = X + _, w = j - X, gt[2] = X - (j - w) + (_ - w), gt[3] = j, L = u * -Z, E = U * u, M = E - (E - u), N = u - M, E = U * -Z, O = E - (E - -Z), D = -Z - O, V = N * D - (L - M * O - N * O - M * D), $ = K * -x, E = U * K, M = E - (E - K), N = K - M, E = U * -x, O = E - (E - -x), D = -x - O, q = N * D - ($ - M * O - N * O - M * D), _ = V + q, w = _ - V, mt[0] = V - (_ - w) + (q - w), X = L + _, w = X - L, R = L - (X - w) + (_ - w), _ = R + $, w = _ - R, mt[1] = R - (_ - w) + ($ - w), j = X + _, w = j - X, mt[2] = X - (j - w) + (_ - w), mt[3] = j, A = lt(4, gt, 4, mt, se), L = h * y, E = U * h, M = E - (E - h), N = h - M, E = U * y, O = E - (E - y), D = y - O, V = N * D - (L - M * O - N * O - M * D), $ = u * x, E = U * u, M = E - (E - u), N = u - M, E = U * x, O = E - (E - x), D = x - O, q = N * D - ($ - M * O - N * O - M * D), _ = V - q, w = V - _, Ft[0] = V - (_ + w) + (w - q), X = L + _, w = X - L, R = L - (X - w) + (_ - w), _ = R - $, w = R - _, Ft[1] = R - (_ + w) + (w - $), j = X + _, w = j - X, Ft[2] = X - (j - w) + (_ - w), Ft[3] = j, I = 4) : (se[0] = 0, A = 1, Ft[0] = 0, I = 1), l !== 0) {
      const rt = F(A, se, l, it);
      f = ct(f, lt(
        F(S, _e, l, J),
        J,
        F(rt, it, 2 * G, et),
        et,
        at
      ), at);
      const ot = F(I, Ft, l, z);
      f = ct(f, bt(
        F(ot, z, 2 * G, J),
        J,
        F(ot, z, l, nt),
        nt,
        F(rt, it, l, et),
        et,
        Ct,
        yt
      ), yt), x !== 0 && (f = ct(f, F(F(4, St, l, z), z, x, J), J)), y !== 0 && (f = ct(f, F(F(4, kt, -l, z), z, y, J), J));
    }
    if (p !== 0) {
      const rt = F(A, se, p, it);
      f = ct(f, lt(
        F(k, Me, p, J),
        J,
        F(rt, it, 2 * Q, et),
        et,
        at
      ), at);
      const ot = F(I, Ft, p, z);
      f = ct(f, bt(
        F(ot, z, 2 * Q, J),
        J,
        F(ot, z, p, nt),
        nt,
        F(rt, it, p, et),
        et,
        Ct,
        yt
      ), yt);
    }
  }
  if (h !== 0 || x !== 0) {
    if (u !== 0 || y !== 0 || l !== 0 || p !== 0 ? (L = u * Q, E = U * u, M = E - (E - u), N = u - M, E = U * Q, O = E - (E - Q), D = Q - O, V = N * D - (L - M * O - N * O - M * D), $ = K * p, E = U * K, M = E - (E - K), N = K - M, E = U * p, O = E - (E - p), D = p - O, q = N * D - ($ - M * O - N * O - M * D), _ = V + q, w = _ - V, gt[0] = V - (_ - w) + (q - w), X = L + _, w = X - L, R = L - (X - w) + (_ - w), _ = R + $, w = _ - R, gt[1] = R - (_ - w) + ($ - w), j = X + _, w = j - X, gt[2] = X - (j - w) + (_ - w), gt[3] = j, C = -H, Y = -y, L = l * C, E = U * l, M = E - (E - l), N = l - M, E = U * C, O = E - (E - C), D = C - O, V = N * D - (L - M * O - N * O - M * D), $ = G * Y, E = U * G, M = E - (E - G), N = G - M, E = U * Y, O = E - (E - Y), D = Y - O, q = N * D - ($ - M * O - N * O - M * D), _ = V + q, w = _ - V, mt[0] = V - (_ - w) + (q - w), X = L + _, w = X - L, R = L - (X - w) + (_ - w), _ = R + $, w = _ - R, mt[1] = R - (_ - w) + ($ - w), j = X + _, w = j - X, mt[2] = X - (j - w) + (_ - w), mt[3] = j, B = lt(4, gt, 4, mt, ae), L = u * p, E = U * u, M = E - (E - u), N = u - M, E = U * p, O = E - (E - p), D = p - O, V = N * D - (L - M * O - N * O - M * D), $ = l * y, E = U * l, M = E - (E - l), N = l - M, E = U * y, O = E - (E - y), D = y - O, q = N * D - ($ - M * O - N * O - M * D), _ = V - q, w = V - _, Lt[0] = V - (_ + w) + (w - q), X = L + _, w = X - L, R = L - (X - w) + (_ - w), _ = R - $, w = R - _, Lt[1] = R - (_ + w) + (w - $), j = X + _, w = j - X, Lt[2] = X - (j - w) + (_ - w), Lt[3] = j, T = 4) : (ae[0] = 0, B = 1, Lt[0] = 0, T = 1), h !== 0) {
      const rt = F(B, ae, h, it);
      f = ct(f, lt(
        F(g, ke, h, J),
        J,
        F(rt, it, 2 * W, et),
        et,
        at
      ), at);
      const ot = F(T, Lt, h, z);
      f = ct(f, bt(
        F(ot, z, 2 * W, J),
        J,
        F(ot, z, h, nt),
        nt,
        F(rt, it, h, et),
        et,
        Ct,
        yt
      ), yt), y !== 0 && (f = ct(f, F(F(4, Mt, h, z), z, y, J), J)), p !== 0 && (f = ct(f, F(F(4, St, -h, z), z, p, J), J));
    }
    if (x !== 0) {
      const rt = F(B, ae, x, it);
      f = ct(f, lt(
        F(v, Se, x, J),
        J,
        F(rt, it, 2 * Z, et),
        et,
        at
      ), at);
      const ot = F(T, Lt, x, z);
      f = ct(f, bt(
        F(ot, z, 2 * Z, J),
        J,
        F(ot, z, x, nt),
        nt,
        F(rt, it, x, et),
        et,
        Ct,
        yt
      ), yt);
    }
  }
  if (u !== 0 || y !== 0) {
    if (l !== 0 || p !== 0 || h !== 0 || x !== 0 ? (L = l * Z, E = U * l, M = E - (E - l), N = l - M, E = U * Z, O = E - (E - Z), D = Z - O, V = N * D - (L - M * O - N * O - M * D), $ = G * x, E = U * G, M = E - (E - G), N = G - M, E = U * x, O = E - (E - x), D = x - O, q = N * D - ($ - M * O - N * O - M * D), _ = V + q, w = _ - V, gt[0] = V - (_ - w) + (q - w), X = L + _, w = X - L, R = L - (X - w) + (_ - w), _ = R + $, w = _ - R, gt[1] = R - (_ - w) + ($ - w), j = X + _, w = j - X, gt[2] = X - (j - w) + (_ - w), gt[3] = j, C = -Q, Y = -p, L = h * C, E = U * h, M = E - (E - h), N = h - M, E = U * C, O = E - (E - C), D = C - O, V = N * D - (L - M * O - N * O - M * D), $ = W * Y, E = U * W, M = E - (E - W), N = W - M, E = U * Y, O = E - (E - Y), D = Y - O, q = N * D - ($ - M * O - N * O - M * D), _ = V + q, w = _ - V, mt[0] = V - (_ - w) + (q - w), X = L + _, w = X - L, R = L - (X - w) + (_ - w), _ = R + $, w = _ - R, mt[1] = R - (_ - w) + ($ - w), j = X + _, w = j - X, mt[2] = X - (j - w) + (_ - w), mt[3] = j, m = lt(4, gt, 4, mt, oe), L = l * x, E = U * l, M = E - (E - l), N = l - M, E = U * x, O = E - (E - x), D = x - O, V = N * D - (L - M * O - N * O - M * D), $ = h * p, E = U * h, M = E - (E - h), N = h - M, E = U * p, O = E - (E - p), D = p - O, q = N * D - ($ - M * O - N * O - M * D), _ = V - q, w = V - _, Yt[0] = V - (_ + w) + (w - q), X = L + _, w = X - L, R = L - (X - w) + (_ - w), _ = R - $, w = R - _, Yt[1] = R - (_ + w) + (w - $), j = X + _, w = j - X, Yt[2] = X - (j - w) + (_ - w), Yt[3] = j, P = 4) : (oe[0] = 0, m = 1, Yt[0] = 0, P = 1), u !== 0) {
      const rt = F(m, oe, u, it);
      f = ct(f, lt(
        F(d, Ee, u, J),
        J,
        F(rt, it, 2 * K, et),
        et,
        at
      ), at);
      const ot = F(P, Yt, u, z);
      f = ct(f, bt(
        F(ot, z, 2 * K, J),
        J,
        F(ot, z, u, nt),
        nt,
        F(rt, it, u, et),
        et,
        Ct,
        yt
      ), yt), p !== 0 && (f = ct(f, F(F(4, kt, u, z), z, p, J), J)), x !== 0 && (f = ct(f, F(F(4, Mt, -u, z), z, x, J), J));
    }
    if (y !== 0) {
      const rt = F(m, oe, y, it);
      f = ct(f, lt(
        F(b, Ae, y, J),
        J,
        F(rt, it, 2 * H, et),
        et,
        at
      ), at);
      const ot = F(P, Yt, y, z);
      f = ct(f, bt(
        F(ot, z, 2 * H, J),
        J,
        F(ot, z, y, nt),
        nt,
        F(rt, it, y, et),
        et,
        Ct,
        yt
      ), yt);
    }
  }
  return Ut[f - 1];
}
function ri(n, t, e, i, o, r, s, a) {
  const c = n - s, f = e - s, l = o - s, h = t - a, u = i - a, p = r - a, x = f * p, y = l * u, S = c * c + h * h, k = l * h, g = c * p, v = f * f + u * u, d = c * u, b = f * h, m = l * l + p * p, A = S * (x - y) + v * (k - g) + m * (d - b), B = (Math.abs(x) + Math.abs(y)) * S + (Math.abs(k) + Math.abs(g)) * v + (Math.abs(d) + Math.abs(b)) * m, P = ti * B;
  return A > P || -A > P ? A : ii(n, t, e, i, o, r, s, a, B);
}
function oi(n, t) {
  var e, i, o = 0, r, s, a, c, f, l, h, u = n[0], p = n[1], x = t.length;
  for (e = 0; e < x; e++) {
    i = 0;
    var y = t[e], S = y.length - 1;
    if (l = y[0], l[0] !== y[S][0] && l[1] !== y[S][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (s = l[0] - u, a = l[1] - p, i; i < S; i++) {
      if (h = y[i + 1], c = h[0] - u, f = h[1] - p, a === 0 && f === 0) {
        if (c <= 0 && s >= 0 || s <= 0 && c >= 0)
          return 0;
      } else if (f >= 0 && a <= 0 || f <= 0 && a >= 0) {
        if (r = At(s, c, a, f, 0, 0), r === 0)
          return 0;
        (r > 0 && f > 0 && a <= 0 || r < 0 && f <= 0 && a > 0) && o++;
      }
      l = h, a = f, s = c;
    }
  }
  return o % 2 !== 0;
}
function Ie(n, t, e = {}) {
  if (!n)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const i = Gn(n), o = Jn(t), r = o.type, s = t.bbox;
  let a = o.coordinates;
  if (s && si(i, s) === !1)
    return !1;
  r === "Polygon" && (a = [a]);
  let c = !1;
  for (var f = 0; f < a.length; ++f) {
    const l = oi(i, a[f]);
    if (l === 0) return !e.ignoreBoundary;
    l && (c = !0);
  }
  return c;
}
function si(n, t) {
  return t[0] <= n[0] && t[1] <= n[1] && t[2] >= n[0] && t[3] >= n[1];
}
let On = class {
  constructor(t = [], e = ai) {
    if (this.data = t, this.length = this.data.length, this.compare = e, this.length > 0)
      for (let i = (this.length >> 1) - 1; i >= 0; i--) this._down(i);
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
    const { data: e, compare: i } = this, o = e[t];
    for (; t > 0; ) {
      const r = t - 1 >> 1, s = e[r];
      if (i(o, s) >= 0) break;
      e[t] = s, t = r;
    }
    e[t] = o;
  }
  _down(t) {
    const { data: e, compare: i } = this, o = this.length >> 1, r = e[t];
    for (; t < o; ) {
      let s = (t << 1) + 1, a = e[s];
      const c = s + 1;
      if (c < this.length && i(e[c], a) < 0 && (s = c, a = e[c]), i(a, r) >= 0) break;
      e[t] = a, t = s;
    }
    e[t] = r;
  }
};
function ai(n, t) {
  return n < t ? -1 : n > t ? 1 : 0;
}
function Nn(n, t) {
  return n.p.x > t.p.x ? 1 : n.p.x < t.p.x ? -1 : n.p.y !== t.p.y ? n.p.y > t.p.y ? 1 : -1 : 1;
}
function ci(n, t) {
  return n.rightSweepEvent.p.x > t.rightSweepEvent.p.x ? 1 : n.rightSweepEvent.p.x < t.rightSweepEvent.p.x ? -1 : n.rightSweepEvent.p.y !== t.rightSweepEvent.p.y ? n.rightSweepEvent.p.y < t.rightSweepEvent.p.y ? 1 : -1 : 1;
}
class Ke {
  constructor(t, e, i, o) {
    this.p = {
      x: t[0],
      y: t[1]
    }, this.featureId = e, this.ringId = i, this.eventId = o, this.otherEvent = null, this.isLeftEndpoint = null;
  }
  isSamePoint(t) {
    return this.p.x === t.p.x && this.p.y === t.p.y;
  }
}
function fi(n, t) {
  if (n.type === "FeatureCollection") {
    const e = n.features;
    for (let i = 0; i < e.length; i++)
      Qe(e[i], t);
  } else
    Qe(n, t);
}
let ce = 0, fe = 0, he = 0;
function Qe(n, t) {
  const e = n.type === "Feature" ? n.geometry : n;
  let i = e.coordinates;
  (e.type === "Polygon" || e.type === "MultiLineString") && (i = [i]), e.type === "LineString" && (i = [[i]]);
  for (let o = 0; o < i.length; o++)
    for (let r = 0; r < i[o].length; r++) {
      let s = i[o][r][0], a = null;
      fe = fe + 1;
      for (let c = 0; c < i[o][r].length - 1; c++) {
        a = i[o][r][c + 1];
        const f = new Ke(s, ce, fe, he), l = new Ke(a, ce, fe, he + 1);
        f.otherEvent = l, l.otherEvent = f, Nn(f, l) > 0 ? (l.isLeftEndpoint = !0, f.isLeftEndpoint = !1) : (f.isLeftEndpoint = !0, l.isLeftEndpoint = !1), t.push(f), t.push(l), s = a, he = he + 1;
      }
    }
  ce = ce + 1;
}
class hi {
  constructor(t) {
    this.leftSweepEvent = t, this.rightSweepEvent = t.otherEvent;
  }
}
function li(n, t) {
  if (n === null || t === null || n.leftSweepEvent.ringId === t.leftSweepEvent.ringId && (n.rightSweepEvent.isSamePoint(t.leftSweepEvent) || n.rightSweepEvent.isSamePoint(t.leftSweepEvent) || n.rightSweepEvent.isSamePoint(t.rightSweepEvent) || n.leftSweepEvent.isSamePoint(t.leftSweepEvent) || n.leftSweepEvent.isSamePoint(t.rightSweepEvent))) return !1;
  const e = n.leftSweepEvent.p.x, i = n.leftSweepEvent.p.y, o = n.rightSweepEvent.p.x, r = n.rightSweepEvent.p.y, s = t.leftSweepEvent.p.x, a = t.leftSweepEvent.p.y, c = t.rightSweepEvent.p.x, f = t.rightSweepEvent.p.y, l = (f - a) * (o - e) - (c - s) * (r - i), h = (c - s) * (i - a) - (f - a) * (e - s), u = (o - e) * (i - a) - (r - i) * (e - s);
  if (l === 0)
    return !1;
  const p = h / l, x = u / l;
  if (p >= 0 && p <= 1 && x >= 0 && x <= 1) {
    const y = e + p * (o - e), S = i + p * (r - i);
    return [y, S];
  }
  return !1;
}
function ui(n, t) {
  t = t || !1;
  const e = [], i = new On([], ci);
  for (; n.length; ) {
    const o = n.pop();
    if (o.isLeftEndpoint) {
      const r = new hi(o);
      for (let s = 0; s < i.data.length; s++) {
        const a = i.data[s];
        if (t && a.leftSweepEvent.featureId === o.featureId)
          continue;
        const c = li(r, a);
        c !== !1 && e.push(c);
      }
      i.push(r);
    } else o.isLeftEndpoint === !1 && i.pop();
  }
  return e;
}
function di(n, t) {
  const e = new On([], Nn);
  return fi(n, e), ui(e, t);
}
var pi = di;
function gi(n, t, e = {}) {
  const { removeDuplicates: i = !0, ignoreSelfIntersections: o = !0 } = e;
  let r = [];
  n.type === "FeatureCollection" ? r = r.concat(n.features) : n.type === "Feature" ? r.push(n) : (n.type === "LineString" || n.type === "Polygon" || n.type === "MultiLineString" || n.type === "MultiPolygon") && r.push(te(n)), t.type === "FeatureCollection" ? r = r.concat(t.features) : t.type === "Feature" ? r.push(t) : (t.type === "LineString" || t.type === "Polygon" || t.type === "MultiLineString" || t.type === "MultiPolygon") && r.push(te(t));
  const s = pi(
    _t(r),
    o
  );
  let a = [];
  if (i) {
    const c = {};
    s.forEach((f) => {
      const l = f.join(",");
      c[l] || (c[l] = !0, a.push(f));
    });
  } else
    a = s;
  return _t(a.map((c) => Rt(c)));
}
function mi(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
function wi(n) {
  if (Object.prototype.hasOwnProperty.call(n, "__esModule")) return n;
  var t = n.default;
  if (typeof t == "function") {
    var e = function i() {
      var o = !1;
      try {
        o = this instanceof i;
      } catch {
      }
      return o ? Reflect.construct(t, arguments, this.constructor) : t.apply(this, arguments);
    };
    e.prototype = t.prototype;
  } else e = {};
  return Object.defineProperty(e, "__esModule", { value: !0 }), Object.keys(n).forEach(function(i) {
    var o = Object.getOwnPropertyDescriptor(n, i);
    Object.defineProperty(e, i, o.get ? o : {
      enumerable: !0,
      get: function() {
        return n[i];
      }
    });
  }), e;
}
function yi(n, t = {}) {
  let e = 0, i = 0, o = 0;
  return Ye(
    n,
    function(r) {
      e += r[0], i += r[1], o++;
    },
    !0
  ), Rt([e / o, i / o], t.properties);
}
var le = { exports: {} }, ve = { exports: {} }, vi = ve.exports, He;
function bi() {
  return He || (He = 1, (function(n, t) {
    (function(e, i) {
      n.exports = i();
    })(vi, function() {
      function e(g, v, d, b, m) {
        (function A(B, P, I, T, C) {
          for (; T > I; ) {
            if (T - I > 600) {
              var Y = T - I + 1, w = P - I + 1, E = Math.log(Y), M = 0.5 * Math.exp(2 * E / 3), N = 0.5 * Math.sqrt(E * M * (Y - M) / Y) * (w - Y / 2 < 0 ? -1 : 1), O = Math.max(I, Math.floor(P - w * M / Y + N)), D = Math.min(T, Math.floor(P + (Y - w) * M / Y + N));
              A(B, P, O, D, C);
            }
            var _ = B[P], X = I, R = T;
            for (i(B, I, P), C(B[T], _) > 0 && i(B, I, T); X < R; ) {
              for (i(B, X, R), X++, R--; C(B[X], _) < 0; ) X++;
              for (; C(B[R], _) > 0; ) R--;
            }
            C(B[I], _) === 0 ? i(B, I, R) : i(B, ++R, T), R <= P && (I = R + 1), P <= R && (T = R - 1);
          }
        })(g, v, d || 0, b || g.length - 1, m || o);
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
        c(g, 0, g.children.length, v, g);
      }
      function c(g, v, d, b, m) {
        m || (m = S(null)), m.minX = 1 / 0, m.minY = 1 / 0, m.maxX = -1 / 0, m.maxY = -1 / 0;
        for (var A = v; A < d; A++) {
          var B = g.children[A];
          f(m, g.leaf ? b(B) : B);
        }
        return m;
      }
      function f(g, v) {
        return g.minX = Math.min(g.minX, v.minX), g.minY = Math.min(g.minY, v.minY), g.maxX = Math.max(g.maxX, v.maxX), g.maxY = Math.max(g.maxY, v.maxY), g;
      }
      function l(g, v) {
        return g.minX - v.minX;
      }
      function h(g, v) {
        return g.minY - v.minY;
      }
      function u(g) {
        return (g.maxX - g.minX) * (g.maxY - g.minY);
      }
      function p(g) {
        return g.maxX - g.minX + (g.maxY - g.minY);
      }
      function x(g, v) {
        return g.minX <= v.minX && g.minY <= v.minY && v.maxX <= g.maxX && v.maxY <= g.maxY;
      }
      function y(g, v) {
        return v.minX <= g.maxX && v.minY <= g.maxY && v.maxX >= g.minX && v.maxY >= g.minY;
      }
      function S(g) {
        return { children: g, height: 1, leaf: !0, minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
      }
      function k(g, v, d, b, m) {
        for (var A = [v, d]; A.length; ) if (!((d = A.pop()) - (v = A.pop()) <= b)) {
          var B = v + Math.ceil((d - v) / b / 2) * b;
          e(g, B, v, d, m), A.push(v, B, B, d);
        }
      }
      return r.prototype.all = function() {
        return this._all(this.data, []);
      }, r.prototype.search = function(g) {
        var v = this.data, d = [];
        if (!y(g, v)) return d;
        for (var b = this.toBBox, m = []; v; ) {
          for (var A = 0; A < v.children.length; A++) {
            var B = v.children[A], P = v.leaf ? b(B) : B;
            y(g, P) && (v.leaf ? d.push(B) : x(g, P) ? this._all(B, d) : m.push(B));
          }
          v = m.pop();
        }
        return d;
      }, r.prototype.collides = function(g) {
        var v = this.data;
        if (!y(g, v)) return !1;
        for (var d = []; v; ) {
          for (var b = 0; b < v.children.length; b++) {
            var m = v.children[b], A = v.leaf ? this.toBBox(m) : m;
            if (y(g, A)) {
              if (v.leaf || x(g, A)) return !0;
              d.push(m);
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
        for (var d, b, m, A = this.data, B = this.toBBox(g), P = [], I = []; A || P.length; ) {
          if (A || (A = P.pop(), b = P[P.length - 1], d = I.pop(), m = !0), A.leaf) {
            var T = s(g, A.children, v);
            if (T !== -1) return A.children.splice(T, 1), P.push(A), this._condense(P), this;
          }
          m || A.leaf || !x(A, B) ? b ? (d++, A = b.children[d], m = !1) : A = null : (P.push(A), I.push(d), d = 0, b = A, A = A.children[0]);
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
        var m, A = d - v + 1, B = this._maxEntries;
        if (A <= B) return a(m = S(g.slice(v, d + 1)), this.toBBox), m;
        b || (b = Math.ceil(Math.log(A) / Math.log(B)), B = Math.ceil(A / Math.pow(B, b - 1))), (m = S([])).leaf = !1, m.height = b;
        var P = Math.ceil(A / B), I = P * Math.ceil(Math.sqrt(B));
        k(g, v, d, I, this.compareMinX);
        for (var T = v; T <= d; T += I) {
          var C = Math.min(T + I - 1, d);
          k(g, T, C, P, this.compareMinY);
          for (var Y = T; Y <= C; Y += P) {
            var w = Math.min(Y + P - 1, C);
            m.children.push(this._build(g, Y, w, b - 1));
          }
        }
        return a(m, this.toBBox), m;
      }, r.prototype._chooseSubtree = function(g, v, d, b) {
        for (; b.push(v), !v.leaf && b.length - 1 !== d; ) {
          for (var m = 1 / 0, A = 1 / 0, B = void 0, P = 0; P < v.children.length; P++) {
            var I = v.children[P], T = u(I), C = (Y = g, w = I, (Math.max(w.maxX, Y.maxX) - Math.min(w.minX, Y.minX)) * (Math.max(w.maxY, Y.maxY) - Math.min(w.minY, Y.minY)) - T);
            C < A ? (A = C, m = T < m ? T : m, B = I) : C === A && T < m && (m = T, B = I);
          }
          v = B || v.children[0];
        }
        var Y, w;
        return v;
      }, r.prototype._insert = function(g, v, d) {
        var b = d ? g : this.toBBox(g), m = [], A = this._chooseSubtree(b, this.data, v, m);
        for (A.children.push(g), f(A, b); v >= 0 && m[v].children.length > this._maxEntries; ) this._split(m, v), v--;
        this._adjustParentBBoxes(b, m, v);
      }, r.prototype._split = function(g, v) {
        var d = g[v], b = d.children.length, m = this._minEntries;
        this._chooseSplitAxis(d, m, b);
        var A = this._chooseSplitIndex(d, m, b), B = S(d.children.splice(A, d.children.length - A));
        B.height = d.height, B.leaf = d.leaf, a(d, this.toBBox), a(B, this.toBBox), v ? g[v - 1].children.push(B) : this._splitRoot(d, B);
      }, r.prototype._splitRoot = function(g, v) {
        this.data = S([g, v]), this.data.height = g.height + 1, this.data.leaf = !1, a(this.data, this.toBBox);
      }, r.prototype._chooseSplitIndex = function(g, v, d) {
        for (var b, m, A, B, P, I, T, C = 1 / 0, Y = 1 / 0, w = v; w <= d - v; w++) {
          var E = c(g, 0, w, this.toBBox), M = c(g, w, d, this.toBBox), N = (m = E, A = M, B = void 0, P = void 0, I = void 0, T = void 0, B = Math.max(m.minX, A.minX), P = Math.max(m.minY, A.minY), I = Math.min(m.maxX, A.maxX), T = Math.min(m.maxY, A.maxY), Math.max(0, I - B) * Math.max(0, T - P)), O = u(E) + u(M);
          N < C ? (C = N, b = w, Y = O < Y ? O : Y) : N === C && O < Y && (Y = O, b = w);
        }
        return b || d - v;
      }, r.prototype._chooseSplitAxis = function(g, v, d) {
        var b = g.leaf ? this.compareMinX : l, m = g.leaf ? this.compareMinY : h;
        this._allDistMargin(g, v, d, b) < this._allDistMargin(g, v, d, m) && g.children.sort(b);
      }, r.prototype._allDistMargin = function(g, v, d, b) {
        g.children.sort(b);
        for (var m = this.toBBox, A = c(g, 0, v, m), B = c(g, d - v, d, m), P = p(A) + p(B), I = v; I < d - v; I++) {
          var T = g.children[I];
          f(A, g.leaf ? m(T) : T), P += p(A);
        }
        for (var C = d - v - 1; C >= v; C--) {
          var Y = g.children[C];
          f(B, g.leaf ? m(Y) : Y), P += p(B);
        }
        return P;
      }, r.prototype._adjustParentBBoxes = function(g, v, d) {
        for (var b = d; b >= 0; b--) f(v[b], g);
      }, r.prototype._condense = function(g) {
        for (var v = g.length - 1, d = void 0; v >= 0; v--) g[v].children.length === 0 ? v > 0 ? (d = g[v - 1].children).splice(d.indexOf(g[v]), 1) : this.clear() : a(g[v], this.toBBox);
      }, r;
    });
  })(ve)), ve.exports;
}
class xi {
  constructor(t = [], e = _i) {
    if (this.data = t, this.length = this.data.length, this.compare = e, this.length > 0)
      for (let i = (this.length >> 1) - 1; i >= 0; i--) this._down(i);
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
    const { data: e, compare: i } = this, o = e[t];
    for (; t > 0; ) {
      const r = t - 1 >> 1, s = e[r];
      if (i(o, s) >= 0) break;
      e[t] = s, t = r;
    }
    e[t] = o;
  }
  _down(t) {
    const { data: e, compare: i } = this, o = this.length >> 1, r = e[t];
    for (; t < o; ) {
      let s = (t << 1) + 1, a = e[s];
      const c = s + 1;
      if (c < this.length && i(e[c], a) < 0 && (s = c, a = e[c]), i(a, r) >= 0) break;
      e[t] = a, t = s;
    }
    e[t] = r;
  }
}
function _i(n, t) {
  return n < t ? -1 : n > t ? 1 : 0;
}
const Mi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: xi
}, Symbol.toStringTag, { value: "Module" })), ki = /* @__PURE__ */ wi(Mi);
var Gt = { exports: {} }, Be, Ze;
function Si() {
  return Ze || (Ze = 1, Be = function(t, e, i, o) {
    var r = t[0], s = t[1], a = !1;
    i === void 0 && (i = 0), o === void 0 && (o = e.length);
    for (var c = (o - i) / 2, f = 0, l = c - 1; f < c; l = f++) {
      var h = e[i + f * 2 + 0], u = e[i + f * 2 + 1], p = e[i + l * 2 + 0], x = e[i + l * 2 + 1], y = u > s != x > s && r < (p - h) * (s - u) / (x - u) + h;
      y && (a = !a);
    }
    return a;
  }), Be;
}
var Oe, tn;
function Ei() {
  return tn || (tn = 1, Oe = function(t, e, i, o) {
    var r = t[0], s = t[1], a = !1;
    i === void 0 && (i = 0), o === void 0 && (o = e.length);
    for (var c = o - i, f = 0, l = c - 1; f < c; l = f++) {
      var h = e[f + i][0], u = e[f + i][1], p = e[l + i][0], x = e[l + i][1], y = u > s != x > s && r < (p - h) * (s - u) / (x - u) + h;
      y && (a = !a);
    }
    return a;
  }), Oe;
}
var en;
function Ai() {
  if (en) return Gt.exports;
  en = 1;
  var n = Si(), t = Ei();
  return Gt.exports = function(i, o, r, s) {
    return o.length > 0 && Array.isArray(o[0]) ? t(i, o, r, s) : n(i, o, r, s);
  }, Gt.exports.nested = t, Gt.exports.flat = n, Gt.exports;
}
var Kt = { exports: {} }, Pi = Kt.exports, nn;
function Ii() {
  return nn || (nn = 1, (function(n, t) {
    (function(e, i) {
      i(t);
    })(Pi, function(e) {
      const o = 33306690738754706e-32;
      function r(y, S, k, g, v) {
        let d, b, m, A, B = S[0], P = g[0], I = 0, T = 0;
        P > B == P > -B ? (d = B, B = S[++I]) : (d = P, P = g[++T]);
        let C = 0;
        if (I < y && T < k) for (P > B == P > -B ? (m = d - ((b = B + d) - B), B = S[++I]) : (m = d - ((b = P + d) - P), P = g[++T]), d = b, m !== 0 && (v[C++] = m); I < y && T < k; ) P > B == P > -B ? (m = d - ((b = d + B) - (A = b - d)) + (B - A), B = S[++I]) : (m = d - ((b = d + P) - (A = b - d)) + (P - A), P = g[++T]), d = b, m !== 0 && (v[C++] = m);
        for (; I < y; ) m = d - ((b = d + B) - (A = b - d)) + (B - A), B = S[++I], d = b, m !== 0 && (v[C++] = m);
        for (; T < k; ) m = d - ((b = d + P) - (A = b - d)) + (P - A), P = g[++T], d = b, m !== 0 && (v[C++] = m);
        return d === 0 && C !== 0 || (v[C++] = d), C;
      }
      function s(y) {
        return new Float64Array(y);
      }
      const a = 33306690738754716e-32, c = 22204460492503146e-32, f = 11093356479670487e-47, l = s(4), h = s(8), u = s(12), p = s(16), x = s(4);
      e.orient2d = function(y, S, k, g, v, d) {
        const b = (S - d) * (k - v), m = (y - v) * (g - d), A = b - m;
        if (b === 0 || m === 0 || b > 0 != m > 0) return A;
        const B = Math.abs(b + m);
        return Math.abs(A) >= a * B ? A : -(function(P, I, T, C, Y, w, E) {
          let M, N, O, D, _, X, R, L, V, $, q, j, G, W, K, Q, Z, H;
          const st = P - Y, ht = T - Y, rt = I - w, ot = C - w;
          _ = (K = (L = st - (R = (X = 134217729 * st) - (X - st))) * ($ = ot - (V = (X = 134217729 * ot) - (X - ot))) - ((W = st * ot) - R * V - L * V - R * $)) - (q = K - (Z = (L = rt - (R = (X = 134217729 * rt) - (X - rt))) * ($ = ht - (V = (X = 134217729 * ht) - (X - ht))) - ((Q = rt * ht) - R * V - L * V - R * $))), l[0] = K - (q + _) + (_ - Z), _ = (G = W - ((j = W + q) - (_ = j - W)) + (q - _)) - (q = G - Q), l[1] = G - (q + _) + (_ - Q), _ = (H = j + q) - j, l[2] = j - (H - _) + (q - _), l[3] = H;
          let Ot = (function(Wn, Ve) {
            let qe = Ve[0];
            for (let xe = 1; xe < Wn; xe++) qe += Ve[xe];
            return qe;
          })(4, l), Wt = c * E;
          if (Ot >= Wt || -Ot >= Wt || (M = P - (st + (_ = P - st)) + (_ - Y), O = T - (ht + (_ = T - ht)) + (_ - Y), N = I - (rt + (_ = I - rt)) + (_ - w), D = C - (ot + (_ = C - ot)) + (_ - w), M === 0 && N === 0 && O === 0 && D === 0) || (Wt = f * E + o * Math.abs(Ot), (Ot += st * D + ot * M - (rt * O + ht * N)) >= Wt || -Ot >= Wt)) return Ot;
          _ = (K = (L = M - (R = (X = 134217729 * M) - (X - M))) * ($ = ot - (V = (X = 134217729 * ot) - (X - ot))) - ((W = M * ot) - R * V - L * V - R * $)) - (q = K - (Z = (L = N - (R = (X = 134217729 * N) - (X - N))) * ($ = ht - (V = (X = 134217729 * ht) - (X - ht))) - ((Q = N * ht) - R * V - L * V - R * $))), x[0] = K - (q + _) + (_ - Z), _ = (G = W - ((j = W + q) - (_ = j - W)) + (q - _)) - (q = G - Q), x[1] = G - (q + _) + (_ - Q), _ = (H = j + q) - j, x[2] = j - (H - _) + (q - _), x[3] = H;
          const qn = r(4, l, 4, x, h);
          _ = (K = (L = st - (R = (X = 134217729 * st) - (X - st))) * ($ = D - (V = (X = 134217729 * D) - (X - D))) - ((W = st * D) - R * V - L * V - R * $)) - (q = K - (Z = (L = rt - (R = (X = 134217729 * rt) - (X - rt))) * ($ = O - (V = (X = 134217729 * O) - (X - O))) - ((Q = rt * O) - R * V - L * V - R * $))), x[0] = K - (q + _) + (_ - Z), _ = (G = W - ((j = W + q) - (_ = j - W)) + (q - _)) - (q = G - Q), x[1] = G - (q + _) + (_ - Q), _ = (H = j + q) - j, x[2] = j - (H - _) + (q - _), x[3] = H;
          const Un = r(qn, h, 4, x, u);
          _ = (K = (L = M - (R = (X = 134217729 * M) - (X - M))) * ($ = D - (V = (X = 134217729 * D) - (X - D))) - ((W = M * D) - R * V - L * V - R * $)) - (q = K - (Z = (L = N - (R = (X = 134217729 * N) - (X - N))) * ($ = O - (V = (X = 134217729 * O) - (X - O))) - ((Q = N * O) - R * V - L * V - R * $))), x[0] = K - (q + _) + (_ - Z), _ = (G = W - ((j = W + q) - (_ = j - W)) + (q - _)) - (q = G - Q), x[1] = G - (q + _) + (_ - Q), _ = (H = j + q) - j, x[2] = j - (H - _) + (q - _), x[3] = H;
          const zn = r(Un, u, 4, x, p);
          return p[zn - 1];
        })(y, S, k, g, v, d, B);
      }, e.orient2dfast = function(y, S, k, g, v, d) {
        return (S - d) * (k - v) - (y - v) * (g - d);
      }, Object.defineProperty(e, "__esModule", { value: !0 });
    });
  })(Kt, Kt.exports)), Kt.exports;
}
var rn;
function Bi() {
  if (rn) return le.exports;
  rn = 1;
  var n = bi(), t = ki, e = Ai(), i = Ii().orient2d;
  t.default && (t = t.default), le.exports = o, le.exports.default = o;
  function o(d, b, m) {
    b = Math.max(0, b === void 0 ? 2 : b), m = m || 0;
    var A = p(d), B = new n(16);
    B.toBBox = function(R) {
      return {
        minX: R[0],
        minY: R[1],
        maxX: R[0],
        maxY: R[1]
      };
    }, B.compareMinX = function(R, L) {
      return R[0] - L[0];
    }, B.compareMinY = function(R, L) {
      return R[1] - L[1];
    }, B.load(d);
    for (var P = [], I = 0, T; I < A.length; I++) {
      var C = A[I];
      B.remove(C), T = x(C, T), P.push(T);
    }
    var Y = new n(16);
    for (I = 0; I < P.length; I++) Y.insert(u(P[I]));
    for (var w = b * b, E = m * m; P.length; ) {
      var M = P.shift(), N = M.p, O = M.next.p, D = y(N, O);
      if (!(D < E)) {
        var _ = D / w;
        C = r(B, M.prev.p, N, O, M.next.next.p, _, Y), C && Math.min(y(C, N), y(C, O)) <= _ && (P.push(M), P.push(x(C, M)), B.remove(C), Y.remove(M), Y.insert(u(M)), Y.insert(u(M.next)));
      }
    }
    M = T;
    var X = [];
    do
      X.push(M.p), M = M.next;
    while (M !== T);
    return X.push(M.p), X;
  }
  function r(d, b, m, A, B, P, I) {
    for (var T = new t([], s), C = d.data; C; ) {
      for (var Y = 0; Y < C.children.length; Y++) {
        var w = C.children[Y], E = C.leaf ? S(w, m, A) : a(m, A, w);
        E > P || T.push({
          node: w,
          dist: E
        });
      }
      for (; T.length && !T.peek().node.children; ) {
        var M = T.pop(), N = M.node, O = S(N, b, m), D = S(N, A, B);
        if (M.dist < O && M.dist < D && f(m, N, I) && f(A, N, I)) return N;
      }
      C = T.pop(), C && (C = C.node);
    }
    return null;
  }
  function s(d, b) {
    return d.dist - b.dist;
  }
  function a(d, b, m) {
    if (c(d, m) || c(b, m)) return 0;
    var A = k(d[0], d[1], b[0], b[1], m.minX, m.minY, m.maxX, m.minY);
    if (A === 0) return 0;
    var B = k(d[0], d[1], b[0], b[1], m.minX, m.minY, m.minX, m.maxY);
    if (B === 0) return 0;
    var P = k(d[0], d[1], b[0], b[1], m.maxX, m.minY, m.maxX, m.maxY);
    if (P === 0) return 0;
    var I = k(d[0], d[1], b[0], b[1], m.minX, m.maxY, m.maxX, m.maxY);
    return I === 0 ? 0 : Math.min(A, B, P, I);
  }
  function c(d, b) {
    return d[0] >= b.minX && d[0] <= b.maxX && d[1] >= b.minY && d[1] <= b.maxY;
  }
  function f(d, b, m) {
    for (var A = Math.min(d[0], b[0]), B = Math.min(d[1], b[1]), P = Math.max(d[0], b[0]), I = Math.max(d[1], b[1]), T = m.search({ minX: A, minY: B, maxX: P, maxY: I }), C = 0; C < T.length; C++)
      if (h(T[C].p, T[C].next.p, d, b)) return !1;
    return !0;
  }
  function l(d, b, m) {
    return i(d[0], d[1], b[0], b[1], m[0], m[1]);
  }
  function h(d, b, m, A) {
    return d !== A && b !== m && l(d, b, m) > 0 != l(d, b, A) > 0 && l(m, A, d) > 0 != l(m, A, b) > 0;
  }
  function u(d) {
    var b = d.p, m = d.next.p;
    return d.minX = Math.min(b[0], m[0]), d.minY = Math.min(b[1], m[1]), d.maxX = Math.max(b[0], m[0]), d.maxY = Math.max(b[1], m[1]), d;
  }
  function p(d) {
    for (var b = d[0], m = d[0], A = d[0], B = d[0], P = 0; P < d.length; P++) {
      var I = d[P];
      I[0] < b[0] && (b = I), I[0] > A[0] && (A = I), I[1] < m[1] && (m = I), I[1] > B[1] && (B = I);
    }
    var T = [b, m, A, B], C = T.slice();
    for (P = 0; P < d.length; P++)
      e(d[P], T) || C.push(d[P]);
    return v(C);
  }
  function x(d, b) {
    var m = {
      p: d,
      prev: null,
      next: null,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };
    return b ? (m.next = b.next, m.prev = b, b.next.prev = m, b.next = m) : (m.prev = m, m.next = m), m;
  }
  function y(d, b) {
    var m = d[0] - b[0], A = d[1] - b[1];
    return m * m + A * A;
  }
  function S(d, b, m) {
    var A = b[0], B = b[1], P = m[0] - A, I = m[1] - B;
    if (P !== 0 || I !== 0) {
      var T = ((d[0] - A) * P + (d[1] - B) * I) / (P * P + I * I);
      T > 1 ? (A = m[0], B = m[1]) : T > 0 && (A += P * T, B += I * T);
    }
    return P = d[0] - A, I = d[1] - B, P * P + I * I;
  }
  function k(d, b, m, A, B, P, I, T) {
    var C = m - d, Y = A - b, w = I - B, E = T - P, M = d - B, N = b - P, O = C * C + Y * Y, D = C * w + Y * E, _ = w * w + E * E, X = C * M + Y * N, R = w * M + E * N, L = O * _ - D * D, V, $, q, j, G = L, W = L;
    L === 0 ? ($ = 0, G = 1, j = R, W = _) : ($ = D * R - _ * X, j = O * R - D * X, $ < 0 ? ($ = 0, j = R, W = _) : $ > G && ($ = G, j = R + D, W = _)), j < 0 ? (j = 0, -X < 0 ? $ = 0 : -X > O ? $ = G : ($ = -X, G = O)) : j > W && (j = W, -X + D < 0 ? $ = 0 : -X + D > O ? $ = G : ($ = -X + D, G = O)), V = $ === 0 ? 0 : $ / G, q = j === 0 ? 0 : j / W;
    var K = (1 - V) * d + V * m, Q = (1 - V) * b + V * A, Z = (1 - q) * B + q * I, H = (1 - q) * P + q * T, st = Z - K, ht = H - Q;
    return st * st + ht * ht;
  }
  function g(d, b) {
    return d[0] === b[0] ? d[1] - b[1] : d[0] - b[0];
  }
  function v(d) {
    d.sort(g);
    for (var b = [], m = 0; m < d.length; m++) {
      for (; b.length >= 2 && l(b[b.length - 2], b[b.length - 1], d[m]) <= 0; )
        b.pop();
      b.push(d[m]);
    }
    for (var A = [], B = d.length - 1; B >= 0; B--) {
      for (; A.length >= 2 && l(A[A.length - 2], A[A.length - 1], d[B]) <= 0; )
        A.pop();
      A.push(d[B]);
    }
    return A.pop(), b.pop(), b.concat(A);
  }
  return le.exports;
}
var Oi = Bi();
const Ni = /* @__PURE__ */ mi(Oi);
function on(n, t = {}) {
  t.concavity = t.concavity || 1 / 0;
  const e = [];
  if (Ye(n, (o) => {
    e.push([o[0], o[1]]);
  }), !e.length)
    return null;
  const i = Ni(e, t.concavity);
  return i.length > 3 ? ie([i]) : null;
}
function Tn(n, t, e = {}) {
  const i = { type: "Feature" };
  return (e.id === 0 || e.id) && (i.id = e.id), e.bbox && (i.bbox = e.bbox), i.properties = t || {}, i.geometry = n, i;
}
function ee(n, t, e = {}) {
  if (!n)
    throw new Error("coordinates is required");
  if (!Array.isArray(n))
    throw new Error("coordinates must be an Array");
  if (n.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!sn(n[0]) || !sn(n[1]))
    throw new Error("coordinates must contain numbers");
  return Tn({
    type: "Point",
    coordinates: n
  }, t, e);
}
function Xn(n, t, e = {}) {
  for (const i of n) {
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
  return Tn({
    type: "Polygon",
    coordinates: n
  }, t, e);
}
function zt(n, t = {}) {
  const e = { type: "FeatureCollection" };
  return t.id && (e.id = t.id), t.bbox && (e.bbox = t.bbox), e.features = n, e;
}
function sn(n) {
  return !isNaN(n) && n !== null && !Array.isArray(n);
}
function Ti(n) {
  if (!n)
    throw new Error("coord is required");
  if (!Array.isArray(n)) {
    if (n.type === "Feature" && n.geometry !== null && n.geometry.type === "Point")
      return [...n.geometry.coordinates];
    if (n.type === "Point")
      return [...n.coordinates];
  }
  if (Array.isArray(n) && n.length >= 2 && !Array.isArray(n[0]) && !Array.isArray(n[1]))
    return [...n];
  throw new Error("coord must be GeoJSON Point or an Array of numbers");
}
function an(n) {
  if (Array.isArray(n))
    return n;
  if (n.type === "Feature") {
    if (n.geometry !== null)
      return n.geometry.coordinates;
  } else if (n.coordinates)
    return n.coordinates;
  throw new Error(
    "coords must be GeoJSON Feature, Geometry Object or an Array"
  );
}
function Xi(n) {
  return n.type === "Feature" ? n.geometry : n;
}
const Bt = 11102230246251565e-32, ut = 134217729, Ci = (3 + 8 * Bt) * Bt;
function Ne(n, t, e, i, o) {
  let r, s, a, c, f = t[0], l = i[0], h = 0, u = 0;
  l > f == l > -f ? (r = f, f = t[++h]) : (r = l, l = i[++u]);
  let p = 0;
  if (h < n && u < e)
    for (l > f == l > -f ? (s = f + r, a = r - (s - f), f = t[++h]) : (s = l + r, a = r - (s - l), l = i[++u]), r = s, a !== 0 && (o[p++] = a); h < n && u < e; )
      l > f == l > -f ? (s = r + f, c = s - r, a = r - (s - c) + (f - c), f = t[++h]) : (s = r + l, c = s - r, a = r - (s - c) + (l - c), l = i[++u]), r = s, a !== 0 && (o[p++] = a);
  for (; h < n; )
    s = r + f, c = s - r, a = r - (s - c) + (f - c), f = t[++h], r = s, a !== 0 && (o[p++] = a);
  for (; u < e; )
    s = r + l, c = s - r, a = r - (s - c) + (l - c), l = i[++u], r = s, a !== 0 && (o[p++] = a);
  return (r !== 0 || p === 0) && (o[p++] = r), p;
}
function Di(n, t) {
  let e = t[0];
  for (let i = 1; i < n; i++) e += t[i];
  return e;
}
function re(n) {
  return new Float64Array(n);
}
const Ri = (3 + 16 * Bt) * Bt, Yi = (2 + 12 * Bt) * Bt, Fi = (9 + 64 * Bt) * Bt * Bt, Vt = re(4), cn = re(8), fn = re(12), hn = re(16), wt = re(4);
function Li(n, t, e, i, o, r, s) {
  let a, c, f, l, h, u, p, x, y, S, k, g, v, d, b, m, A, B;
  const P = n - o, I = e - o, T = t - r, C = i - r;
  d = P * C, u = ut * P, p = u - (u - P), x = P - p, u = ut * C, y = u - (u - C), S = C - y, b = x * S - (d - p * y - x * y - p * S), m = T * I, u = ut * T, p = u - (u - T), x = T - p, u = ut * I, y = u - (u - I), S = I - y, A = x * S - (m - p * y - x * y - p * S), k = b - A, h = b - k, Vt[0] = b - (k + h) + (h - A), g = d + k, h = g - d, v = d - (g - h) + (k - h), k = v - m, h = v - k, Vt[1] = v - (k + h) + (h - m), B = g + k, h = B - g, Vt[2] = g - (B - h) + (k - h), Vt[3] = B;
  let Y = Di(4, Vt), w = Yi * s;
  if (Y >= w || -Y >= w || (h = n - P, a = n - (P + h) + (h - o), h = e - I, f = e - (I + h) + (h - o), h = t - T, c = t - (T + h) + (h - r), h = i - C, l = i - (C + h) + (h - r), a === 0 && c === 0 && f === 0 && l === 0) || (w = Fi * s + Ci * Math.abs(Y), Y += P * l + C * a - (T * f + I * c), Y >= w || -Y >= w)) return Y;
  d = a * C, u = ut * a, p = u - (u - a), x = a - p, u = ut * C, y = u - (u - C), S = C - y, b = x * S - (d - p * y - x * y - p * S), m = c * I, u = ut * c, p = u - (u - c), x = c - p, u = ut * I, y = u - (u - I), S = I - y, A = x * S - (m - p * y - x * y - p * S), k = b - A, h = b - k, wt[0] = b - (k + h) + (h - A), g = d + k, h = g - d, v = d - (g - h) + (k - h), k = v - m, h = v - k, wt[1] = v - (k + h) + (h - m), B = g + k, h = B - g, wt[2] = g - (B - h) + (k - h), wt[3] = B;
  const E = Ne(4, Vt, 4, wt, cn);
  d = P * l, u = ut * P, p = u - (u - P), x = P - p, u = ut * l, y = u - (u - l), S = l - y, b = x * S - (d - p * y - x * y - p * S), m = T * f, u = ut * T, p = u - (u - T), x = T - p, u = ut * f, y = u - (u - f), S = f - y, A = x * S - (m - p * y - x * y - p * S), k = b - A, h = b - k, wt[0] = b - (k + h) + (h - A), g = d + k, h = g - d, v = d - (g - h) + (k - h), k = v - m, h = v - k, wt[1] = v - (k + h) + (h - m), B = g + k, h = B - g, wt[2] = g - (B - h) + (k - h), wt[3] = B;
  const M = Ne(E, cn, 4, wt, fn);
  d = a * l, u = ut * a, p = u - (u - a), x = a - p, u = ut * l, y = u - (u - l), S = l - y, b = x * S - (d - p * y - x * y - p * S), m = c * f, u = ut * c, p = u - (u - c), x = c - p, u = ut * f, y = u - (u - f), S = f - y, A = x * S - (m - p * y - x * y - p * S), k = b - A, h = b - k, wt[0] = b - (k + h) + (h - A), g = d + k, h = g - d, v = d - (g - h) + (k - h), k = v - m, h = v - k, wt[1] = v - (k + h) + (h - m), B = g + k, h = B - g, wt[2] = g - (B - h) + (k - h), wt[3] = B;
  const N = Ne(M, fn, 4, wt, hn);
  return hn[N - 1];
}
function $i(n, t, e, i, o, r) {
  const s = (t - r) * (e - o), a = (n - o) * (i - r), c = s - a, f = Math.abs(s + a);
  return Math.abs(c) >= Ri * f ? c : -Li(n, t, e, i, o, r, f);
}
function ji(n, t) {
  var e, i, o = 0, r, s, a, c, f, l, h, u = n[0], p = n[1], x = t.length;
  for (e = 0; e < x; e++) {
    i = 0;
    var y = t[e], S = y.length - 1;
    if (l = y[0], l[0] !== y[S][0] && l[1] !== y[S][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (s = l[0] - u, a = l[1] - p, i; i < S; i++) {
      if (h = y[i + 1], c = h[0] - u, f = h[1] - p, a === 0 && f === 0) {
        if (c <= 0 && s >= 0 || s <= 0 && c >= 0)
          return 0;
      } else if (f >= 0 && a <= 0 || f <= 0 && a >= 0) {
        if (r = $i(s, c, a, f, 0, 0), r === 0)
          return 0;
        (r > 0 && f > 0 && a <= 0 || r < 0 && f <= 0 && a > 0) && o++;
      }
      l = h, a = f, s = c;
    }
  }
  return o % 2 !== 0;
}
function Ce(n, t, e = {}) {
  if (!n)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const i = Ti(n), o = Xi(t), r = o.type, s = t.bbox;
  let a = o.coordinates;
  if (s && Vi(i, s) === !1)
    return !1;
  r === "Polygon" && (a = [a]);
  let c = !1;
  for (var f = 0; f < a.length; ++f) {
    const l = ji(i, a[f]);
    if (l === 0) return !e.ignoreBoundary;
    l && (c = !0);
  }
  return c;
}
function Vi(n, t) {
  return t[0] <= n[0] && t[1] <= n[1] && t[2] >= n[0] && t[3] >= n[1];
}
function Te(n, t) {
  for (let e = 0; e < t.features.length; e++)
    if (Ce(n, t.features[e]))
      return t.features[e];
}
function Cn(n, t, e) {
  const i = t.geometry.coordinates[0][0], o = t.geometry.coordinates[0][1], r = t.geometry.coordinates[0][2], s = n.geometry.coordinates, a = t.properties.a.geom, c = t.properties.b.geom, f = t.properties.c.geom, l = [o[0] - i[0], o[1] - i[1]], h = [r[0] - i[0], r[1] - i[1]], u = [s[0] - i[0], s[1] - i[1]], p = [c[0] - a[0], c[1] - a[1]], x = [f[0] - a[0], f[1] - a[1]];
  let y = (h[1] * u[0] - h[0] * u[1]) / (l[0] * h[1] - l[1] * h[0]), S = (l[0] * u[1] - l[1] * u[0]) / (l[0] * h[1] - l[1] * h[0]);
  if (e) {
    const k = e[t.properties.a.index], g = e[t.properties.b.index], v = e[t.properties.c.index];
    let d;
    if (y < 0 || S < 0 || 1 - y - S < 0) {
      const b = y / (y + S), m = S / (y + S);
      d = y / g / (b / g + m / v), S = S / v / (b / g + m / v);
    } else
      d = y / g / (y / g + S / v + (1 - y - S) / k), S = S / v / (y / g + S / v + (1 - y - S) / k);
    y = d;
  }
  return [
    y * p[0] + S * x[0] + a[0],
    y * p[1] + S * x[1] + a[1]
  ];
}
function qi(n, t, e, i) {
  const o = n.geometry.coordinates, r = e.geometry.coordinates, s = Math.atan2(o[0] - r[0], o[1] - r[1]), a = Ui(s, t[0]);
  if (a === void 0)
    throw new Error("Unable to determine vertex index");
  const c = t[1][a];
  return Cn(n, c.features[0], i);
}
function Qt(n, t, e, i, o, r, s, a) {
  let c;
  if (s && (c = Te(n, zt([s]))), !c)
    if (e) {
      const f = n.geometry.coordinates, l = e.gridNum, h = e.xOrigin, u = e.yOrigin, p = e.xUnit, x = e.yUnit, y = e.gridCache, S = Et(f[0], h, p, l), k = Et(f[1], u, x, l), g = y[S] ? y[S][k] ? y[S][k] : [] : [], v = zt(g.map((d) => t.features[d]));
      c = Te(n, v);
    } else
      c = Te(n, t);
  return a && a(c), c ? Cn(n, c, r) : qi(n, i, o, r);
}
function Et(n, t, e, i) {
  let o = Math.floor((n - t) / e);
  return o < 0 && (o = 0), o >= i && (o = i - 1), o;
}
function Ui(n, t) {
  let e = ln(n - t[0]), i = Math.PI * 2, o;
  for (let r = 0; r < t.length; r++) {
    const s = (r + 1) % t.length, a = ln(n - t[s]), c = Math.min(Math.abs(e), Math.abs(a));
    e * a <= 0 && c < i && (i = c, o = r), e = a;
  }
  return o;
}
function ln(n, t = !1) {
  const e = 2 * Math.PI, i = n - Math.floor(n / e) * e;
  return t ? i : i > Math.PI ? i - e : i;
}
function un(n) {
  const t = n.features;
  for (let e = 0; e < t.length; e++) {
    const i = t[e];
    `${i.properties.a.index}`.substring(0, 1) === "b" && `${i.properties.b.index}`.substring(0, 1) === "b" ? t[e] = {
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
    } : `${i.properties.c.index}`.substring(0, 1) === "b" && `${i.properties.a.index}`.substring(0, 1) === "b" && (t[e] = {
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
  return n;
}
function Dn(n) {
  const t = ["a", "b", "c", "a"].map(
    (r) => n.properties[r].geom
  ), e = n.geometry.coordinates[0], i = n.properties, o = {
    a: { geom: e[0], index: i.a.index },
    b: { geom: e[1], index: i.b.index },
    c: { geom: e[2], index: i.c.index }
  };
  return Xn([t], o);
}
function zi(n) {
  const t = [0, 1, 2, 0].map((i) => n[i][0][0]), e = {
    a: { geom: n[0][0][1], index: n[0][1] },
    b: { geom: n[1][0][1], index: n[1][1] },
    c: { geom: n[2][0][1], index: n[2][1] }
  };
  return Xn([t], e);
}
function De(n, t, e, i, o, r = !1, s) {
  const a = n.map(
    (c) => {
      (!s || s < 2.00703) && (c = Rn(c));
      const f = isFinite(c) ? t[c] : c === "c" ? i : (function() {
        const l = c.match(/^b(\d+)$/);
        if (l) return o[parseInt(l[1])];
        const h = c.match(/^e(\d+)$/);
        if (h) return e[parseInt(h[1])];
        throw new Error("Bad index value for indexesToTri");
      })();
      return r ? [[f[1], f[0]], c] : [[f[0], f[1]], c];
    }
  );
  return zi(a);
}
function Rn(n) {
  return typeof n == "number" ? n : n.replace(/^(c|e|b)(?:ent|dgeNode|box)(\d+)?$/, "$1$2");
}
function Yn(n, t) {
  return t && t >= 2.00703 || Array.isArray(n[0]) ? n : n.map((e) => [
    e.illstNodes,
    e.mercNodes,
    e.startEnd
  ]);
}
const Fe = 2.00703;
function Wi(n) {
  return !!(n.version !== void 0 || !n.tins && n.points && n.tins_points);
}
function Gi(n) {
  return {
    points: n.points,
    pointsWeightBuffer: Ki(n),
    strictStatus: Qi(n),
    verticesParams: Hi(n),
    centroid: Zi(n),
    edges: Yn(n.edges || []),
    edgeNodes: n.edgeNodes || [],
    tins: tr(n),
    kinks: er(n.kinks_points),
    yaxisMode: n.yaxisMode ?? "invert",
    strictMode: n.strictMode ?? "auto",
    vertexMode: n.vertexMode,
    bounds: n.bounds,
    boundsPolygon: n.boundsPolygon,
    wh: n.wh,
    xy: n.xy ?? [0, 0]
  };
}
function Ji(n) {
  const t = nr(n), e = t.tins;
  return {
    compiled: t,
    tins: e,
    points: ir(e),
    strictStatus: t.strict_status,
    pointsWeightBuffer: t.weight_buffer,
    verticesParams: t.vertices_params,
    centroid: t.centroid,
    kinks: t.kinks
  };
}
function Ki(n) {
  return !n.version || n.version < Fe ? ["forw", "bakw"].reduce((t, e) => {
    const i = n.weight_buffer[e];
    return i && (t[e] = Object.keys(i).reduce((o, r) => {
      const s = Rn(r);
      return o[s] = i[r], o;
    }, {})), t;
  }, {}) : n.weight_buffer;
}
function Qi(n) {
  return n.strict_status ? n.strict_status : n.kinks_points ? "strict_error" : n.tins_points.length === 2 ? "loose" : "strict";
}
function Hi(n) {
  const t = {
    forw: [n.vertices_params[0]],
    bakw: [n.vertices_params[1]]
  };
  return t.forw[1] = dn(n, !1), t.bakw[1] = dn(n, !0), t;
}
function dn(n, t) {
  const e = n.vertices_points.length;
  return Array.from({ length: e }, (i, o) => {
    const r = (o + 1) % e, s = De(
      ["c", `b${o}`, `b${r}`],
      n.points,
      n.edgeNodes || [],
      n.centroid_point,
      n.vertices_points,
      t,
      Fe
    );
    return zt([s]);
  });
}
function Zi(n) {
  return {
    forw: ee(n.centroid_point[0], {
      target: {
        geom: n.centroid_point[1],
        index: "c"
      }
    }),
    bakw: ee(n.centroid_point[1], {
      target: {
        geom: n.centroid_point[0],
        index: "c"
      }
    })
  };
}
function tr(n) {
  const t = n.tins_points.length === 1 ? 0 : 1;
  return {
    forw: zt(
      n.tins_points[0].map(
        (e) => De(
          e,
          n.points,
          n.edgeNodes || [],
          n.centroid_point,
          n.vertices_points,
          !1,
          n.version
        )
      )
    ),
    bakw: zt(
      n.tins_points[t].map(
        (e) => De(
          e,
          n.points,
          n.edgeNodes || [],
          n.centroid_point,
          n.vertices_points,
          !0,
          n.version
        )
      )
    )
  };
}
function er(n) {
  if (n)
    return {
      bakw: zt(
        n.map((t) => ee(t))
      )
    };
}
function nr(n) {
  return JSON.parse(
    JSON.stringify(n).replace('"cent"', '"c"').replace(/"bbox(\d+)"/g, '"b$1"')
  );
}
function ir(n) {
  const t = [], e = n.forw.features;
  for (let i = 0; i < e.length; i++) {
    const o = e[i];
    ["a", "b", "c"].forEach((r, s) => {
      const a = o.geometry.coordinates[0][s], c = o.properties[r].geom, f = o.properties[r].index;
      typeof f == "number" && (t[f] = [a, c]);
    });
  }
  return t;
}
const pn = Fe;
class xt {
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
  yaxisMode = xt.YAXIS_INVERT;
  strictMode = xt.MODE_AUTO;
  vertexMode = xt.VERTEX_PLAIN;
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
    if (Wi(t)) {
      this.applyModernState(Gi(t));
      return;
    }
    this.applyLegacyState(Ji(t));
  }
  applyModernState(t) {
    this.points = t.points, this.pointsWeightBuffer = t.pointsWeightBuffer, this.strict_status = t.strictStatus, this.vertices_params = t.verticesParams, this.centroid = t.centroid, this.edges = t.edges, this.edgeNodes = t.edgeNodes || [], this.tins = t.tins, this.addIndexedTin(), this.kinks = t.kinks, this.yaxisMode = t.yaxisMode ?? xt.YAXIS_INVERT, this.vertexMode = t.vertexMode ?? xt.VERTEX_PLAIN, this.strictMode = t.strictMode ?? xt.MODE_AUTO, t.bounds ? (this.bounds = t.bounds, this.boundsPolygon = t.boundsPolygon, this.xy = t.xy, this.wh = t.wh) : (this.bounds = void 0, this.boundsPolygon = void 0, this.xy = t.xy ?? [0, 0], t.wh && (this.wh = t.wh));
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
    const t = this.tins, e = t.forw, i = t.bakw, o = Math.ceil(Math.sqrt(e.features.length));
    if (o < 3) {
      this.indexedTins = void 0;
      return;
    }
    let r = [], s = [];
    const a = e.features.map((y) => {
      let S = [];
      return an(y)[0].map((k) => {
        r.length === 0 ? r = [Array.from(k), Array.from(k)] : (k[0] < r[0][0] && (r[0][0] = k[0]), k[0] > r[1][0] && (r[1][0] = k[0]), k[1] < r[0][1] && (r[0][1] = k[1]), k[1] > r[1][1] && (r[1][1] = k[1])), S.length === 0 ? S = [Array.from(k), Array.from(k)] : (k[0] < S[0][0] && (S[0][0] = k[0]), k[0] > S[1][0] && (S[1][0] = k[0]), k[1] < S[0][1] && (S[0][1] = k[1]), k[1] > S[1][1] && (S[1][1] = k[1]));
      }), S;
    }), c = (r[1][0] - r[0][0]) / o, f = (r[1][1] - r[0][1]) / o, l = a.reduce(
      (y, S, k) => {
        const g = Et(S[0][0], r[0][0], c, o), v = Et(S[1][0], r[0][0], c, o), d = Et(S[0][1], r[0][1], f, o), b = Et(S[1][1], r[0][1], f, o);
        for (let m = g; m <= v; m++) {
          y[m] || (y[m] = []);
          for (let A = d; A <= b; A++)
            y[m][A] || (y[m][A] = []), y[m][A].push(k);
        }
        return y;
      },
      []
    ), h = i.features.map((y) => {
      let S = [];
      return an(y)[0].map((k) => {
        s.length === 0 ? s = [Array.from(k), Array.from(k)] : (k[0] < s[0][0] && (s[0][0] = k[0]), k[0] > s[1][0] && (s[1][0] = k[0]), k[1] < s[0][1] && (s[0][1] = k[1]), k[1] > s[1][1] && (s[1][1] = k[1])), S.length === 0 ? S = [Array.from(k), Array.from(k)] : (k[0] < S[0][0] && (S[0][0] = k[0]), k[0] > S[1][0] && (S[1][0] = k[0]), k[1] < S[0][1] && (S[0][1] = k[1]), k[1] > S[1][1] && (S[1][1] = k[1]));
      }), S;
    }), u = (s[1][0] - s[0][0]) / o, p = (s[1][1] - s[0][1]) / o, x = h.reduce(
      (y, S, k) => {
        const g = Et(S[0][0], s[0][0], u, o), v = Et(S[1][0], s[0][0], u, o), d = Et(S[0][1], s[0][1], p, o), b = Et(S[1][1], s[0][1], p, o);
        for (let m = g; m <= v; m++) {
          y[m] || (y[m] = []);
          for (let A = d; A <= b; A++)
            y[m][A] || (y[m][A] = []), y[m][A].push(k);
        }
        return y;
      },
      []
    );
    this.indexedTins = {
      forw: {
        gridNum: o,
        xOrigin: r[0][0],
        yOrigin: r[0][1],
        xUnit: c,
        yUnit: f,
        gridCache: l
      },
      bakw: {
        gridNum: o,
        xOrigin: s[0][0],
        yOrigin: s[0][1],
        xUnit: u,
        yUnit: p,
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
  transform(t, e, i) {
    if (!this.tins)
      throw new Error("setCompiled() must be called before transform()");
    if (e && this.strict_status == xt.STATUS_ERROR)
      throw new Error('Backward transform is not allowed if strict_status == "strict_error"');
    this.yaxisMode == xt.YAXIS_FOLLOW && e && (t = [t[0], -1 * t[1]]);
    const o = ee(t);
    if (this.bounds && !e && !i && !Ce(o, this.boundsPolygon))
      return !1;
    const r = e ? this.tins.bakw : this.tins.forw, s = e ? this.indexedTins.bakw : this.indexedTins.forw, a = e ? this.vertices_params.bakw : this.vertices_params.forw, c = e ? this.centroid.bakw : this.centroid.forw, f = e ? this.pointsWeightBuffer.bakw : this.pointsWeightBuffer.forw;
    let l, h;
    this.stateFull && (this.stateBackward == e ? l = this.stateTriangle : (this.stateBackward = e, this.stateTriangle = void 0), h = (p) => {
      this.stateTriangle = p;
    });
    let u = Qt(
      o,
      r,
      s,
      a,
      c,
      f,
      l,
      h
    );
    if (this.bounds && e && !i) {
      const p = ee(u);
      if (!Ce(p, this.boundsPolygon)) return !1;
    } else this.yaxisMode == xt.YAXIS_FOLLOW && !e && (u = [u[0], -1 * u[1]]);
    return u;
  }
}
const gn = Math.pow(2, -52), ue = new Uint32Array(512);
class Le {
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
  static from(t, e = cr, i = fr) {
    const o = t.length, r = new Float64Array(o * 2);
    for (let s = 0; s < o; s++) {
      const a = t[s];
      r[2 * s] = e(a), r[2 * s + 1] = i(a);
    }
    return new Le(r);
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
    const i = Math.max(2 * e - 5, 0);
    this._triangles = new Uint32Array(i * 3), this._halfedges = new Int32Array(i * 3), this._hashSize = Math.ceil(Math.sqrt(e)), this._hullPrev = new Uint32Array(e), this._hullNext = new Uint32Array(e), this._hullTri = new Uint32Array(e), this._hullHash = new Int32Array(this._hashSize), this._ids = new Uint32Array(e), this._dists = new Float64Array(e), this.trianglesLen = 0, this._cx = 0, this._cy = 0, this._hullStart = 0, this.hull = this._triangles, this.triangles = this._triangles, this.halfedges = this._halfedges, this.update();
  }
  /**
   * Updates the triangulation if you modified `delaunay.coords` values in place, avoiding expensive memory allocations.
   * Useful for iterative relaxation algorithms such as Lloyd's.
   */
  update() {
    const { coords: t, _hullPrev: e, _hullNext: i, _hullTri: o, _hullHash: r } = this, s = t.length >> 1;
    let a = 1 / 0, c = 1 / 0, f = -1 / 0, l = -1 / 0;
    for (let P = 0; P < s; P++) {
      const I = t[2 * P], T = t[2 * P + 1];
      I < a && (a = I), T < c && (c = T), I > f && (f = I), T > l && (l = T), this._ids[P] = P;
    }
    const h = (a + f) / 2, u = (c + l) / 2;
    let p = 0, x = 0, y = 0;
    for (let P = 0, I = 1 / 0; P < s; P++) {
      const T = Xe(h, u, t[2 * P], t[2 * P + 1]);
      T < I && (p = P, I = T);
    }
    const S = t[2 * p], k = t[2 * p + 1];
    for (let P = 0, I = 1 / 0; P < s; P++) {
      if (P === p) continue;
      const T = Xe(S, k, t[2 * P], t[2 * P + 1]);
      T < I && T > 0 && (x = P, I = T);
    }
    let g = t[2 * x], v = t[2 * x + 1], d = 1 / 0;
    for (let P = 0; P < s; P++) {
      if (P === p || P === x) continue;
      const I = sr(S, k, g, v, t[2 * P], t[2 * P + 1]);
      I < d && (y = P, d = I);
    }
    let b = t[2 * y], m = t[2 * y + 1];
    if (d === 1 / 0) {
      for (let T = 0; T < s; T++)
        this._dists[T] = t[2 * T] - t[0] || t[2 * T + 1] - t[1];
      qt(this._ids, this._dists, 0, s - 1);
      const P = new Uint32Array(s);
      let I = 0;
      for (let T = 0, C = -1 / 0; T < s; T++) {
        const Y = this._ids[T], w = this._dists[Y];
        w > C && (P[I++] = Y, C = w);
      }
      this.hull = P.subarray(0, I), this.triangles = new Uint32Array(0), this.halfedges = new Int32Array(0);
      return;
    }
    if (At(S, k, g, v, b, m) < 0) {
      const P = x, I = g, T = v;
      x = y, g = b, v = m, y = P, b = I, m = T;
    }
    const A = ar(S, k, g, v, b, m);
    this._cx = A.x, this._cy = A.y;
    for (let P = 0; P < s; P++)
      this._dists[P] = Xe(t[2 * P], t[2 * P + 1], A.x, A.y);
    qt(this._ids, this._dists, 0, s - 1), this._hullStart = p;
    let B = 3;
    i[p] = e[y] = x, i[x] = e[p] = y, i[y] = e[x] = p, o[p] = 0, o[x] = 1, o[y] = 2, r.fill(-1), r[this._hashKey(S, k)] = p, r[this._hashKey(g, v)] = x, r[this._hashKey(b, m)] = y, this.trianglesLen = 0, this._addTriangle(p, x, y, -1, -1, -1);
    for (let P = 0, I = 0, T = 0; P < this._ids.length; P++) {
      const C = this._ids[P], Y = t[2 * C], w = t[2 * C + 1];
      if (P > 0 && Math.abs(Y - I) <= gn && Math.abs(w - T) <= gn || (I = Y, T = w, C === p || C === x || C === y)) continue;
      let E = 0;
      for (let _ = 0, X = this._hashKey(Y, w); _ < this._hashSize && (E = r[(X + _) % this._hashSize], !(E !== -1 && E !== i[E])); _++)
        ;
      E = e[E];
      let M = E, N;
      for (; N = i[M], At(Y, w, t[2 * M], t[2 * M + 1], t[2 * N], t[2 * N + 1]) >= 0; )
        if (M = N, M === E) {
          M = -1;
          break;
        }
      if (M === -1) continue;
      let O = this._addTriangle(M, C, i[M], -1, -1, o[M]);
      o[C] = this._legalize(O + 2), o[M] = O, B++;
      let D = i[M];
      for (; N = i[D], At(Y, w, t[2 * D], t[2 * D + 1], t[2 * N], t[2 * N + 1]) < 0; )
        O = this._addTriangle(D, C, N, o[C], -1, o[D]), o[C] = this._legalize(O + 2), i[D] = D, B--, D = N;
      if (M === E)
        for (; N = e[M], At(Y, w, t[2 * N], t[2 * N + 1], t[2 * M], t[2 * M + 1]) < 0; )
          O = this._addTriangle(N, C, M, -1, o[M], o[N]), this._legalize(O + 2), o[N] = O, i[M] = M, B--, M = N;
      this._hullStart = e[C] = M, i[M] = e[D] = C, i[C] = D, r[this._hashKey(Y, w)] = C, r[this._hashKey(t[2 * M], t[2 * M + 1])] = M;
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
  _hashKey(t, e) {
    return Math.floor(rr(t - this._cx, e - this._cy) * this._hashSize) % this._hashSize;
  }
  /**
   * Flip an edge in a pair of triangles if it doesn't satisfy the Delaunay condition.
   *
   * @param {number} a
   * @private
   */
  _legalize(t) {
    const { _triangles: e, _halfedges: i, coords: o } = this;
    let r = 0, s = 0;
    for (; ; ) {
      const a = i[t], c = t - t % 3;
      if (s = c + (t + 2) % 3, a === -1) {
        if (r === 0) break;
        t = ue[--r];
        continue;
      }
      const f = a - a % 3, l = c + (t + 1) % 3, h = f + (a + 2) % 3, u = e[s], p = e[t], x = e[l], y = e[h];
      if (or(
        o[2 * u],
        o[2 * u + 1],
        o[2 * p],
        o[2 * p + 1],
        o[2 * x],
        o[2 * x + 1],
        o[2 * y],
        o[2 * y + 1]
      )) {
        e[t] = y, e[a] = u;
        const k = i[h];
        if (k === -1) {
          let v = this._hullStart;
          do {
            if (this._hullTri[v] === h) {
              this._hullTri[v] = t;
              break;
            }
            v = this._hullPrev[v];
          } while (v !== this._hullStart);
        }
        this._link(t, k), this._link(a, i[s]), this._link(s, h);
        const g = f + (a + 1) % 3;
        r < ue.length && (ue[r++] = g);
      } else {
        if (r === 0) break;
        t = ue[--r];
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
  _addTriangle(t, e, i, o, r, s) {
    const a = this.trianglesLen;
    return this._triangles[a] = t, this._triangles[a + 1] = e, this._triangles[a + 2] = i, this._link(a, o), this._link(a + 1, r), this._link(a + 2, s), this.trianglesLen += 3, a;
  }
}
function rr(n, t) {
  const e = n / (Math.abs(n) + Math.abs(t));
  return (t > 0 ? 3 - e : 1 + e) / 4;
}
function Xe(n, t, e, i) {
  const o = n - e, r = t - i;
  return o * o + r * r;
}
function or(n, t, e, i, o, r, s, a) {
  const c = n - s, f = t - a, l = e - s, h = i - a, u = o - s, p = r - a, x = c * c + f * f, y = l * l + h * h, S = u * u + p * p;
  return c * (h * S - y * p) - f * (l * S - y * u) + x * (l * p - h * u) < 0;
}
function sr(n, t, e, i, o, r) {
  const s = e - n, a = i - t, c = o - n, f = r - t, l = s * s + a * a, h = c * c + f * f, u = 0.5 / (s * f - a * c), p = (f * l - a * h) * u, x = (s * h - c * l) * u;
  return p * p + x * x;
}
function ar(n, t, e, i, o, r) {
  const s = e - n, a = i - t, c = o - n, f = r - t, l = s * s + a * a, h = c * c + f * f, u = 0.5 / (s * f - a * c), p = n + (f * l - a * h) * u, x = t + (s * h - c * l) * u;
  return { x: p, y: x };
}
function qt(n, t, e, i) {
  if (i - e <= 20)
    for (let o = e + 1; o <= i; o++) {
      const r = n[o], s = t[r];
      let a = o - 1;
      for (; a >= e && t[n[a]] > s; ) n[a + 1] = n[a--];
      n[a + 1] = r;
    }
  else {
    const o = e + i >> 1;
    let r = e + 1, s = i;
    Jt(n, o, r), t[n[e]] > t[n[i]] && Jt(n, e, i), t[n[r]] > t[n[i]] && Jt(n, r, i), t[n[e]] > t[n[r]] && Jt(n, e, r);
    const a = n[r], c = t[a];
    for (; ; ) {
      do
        r++;
      while (t[n[r]] < c);
      do
        s--;
      while (t[n[s]] > c);
      if (s < r) break;
      Jt(n, r, s);
    }
    n[e + 1] = n[s], n[s] = a, i - r + 1 >= s - e ? (qt(n, t, r, i), qt(n, t, e, s - 1)) : (qt(n, t, e, s - 1), qt(n, t, r, i));
  }
}
function Jt(n, t, e) {
  const i = n[t];
  n[t] = n[e], n[e] = i;
}
function cr(n) {
  return n[0];
}
function fr(n) {
  return n[1];
}
class hr {
  bs;
  width;
  constructor(t, e) {
    this.width = t, this.bs = e;
  }
  /**
   * Add a number to the set.
   *
   * @param idx The number to add. Must be 0 <= idx < len.
   */
  add(t) {
    const e = Math.floor(t / this.width), i = t % this.width;
    return this.bs[e] |= 1 << i, this;
  }
  /**
   * Delete a number from the set.
   *
   * @param idx The number to delete. Must be 0 <= idx < len.
   */
  delete(t) {
    const e = Math.floor(t / this.width), i = t % this.width;
    return this.bs[e] &= ~(1 << i), this;
  }
  /**
   * Add or delete a number in the set, depending on the second argument.
   *
   * @param idx The number to add or delete. Must be 0 <= idx < len.
   * @param val If true, add the number, otherwise delete.
   */
  set(t, e) {
    const i = Math.floor(t / this.width), r = 1 << t % this.width;
    return this.bs[i] ^= (-Number(e) ^ this.bs[i]) & r, e;
  }
  /**
   * Whether the number is in the set.
   *
   * @param idx The number to test. Must be 0 <= idx < len.
   */
  has(t) {
    const e = Math.floor(t / this.width), i = t % this.width;
    return (this.bs[e] & 1 << i) !== 0;
  }
  /**
   * Iterate over the numbers that are in the set.
   */
  forEach(t) {
    const e = this.bs.length;
    for (let i = 0; i < e; i++) {
      let o = 0;
      for (; this.bs[i] && o < this.width; )
        this.bs[i] & 1 << o && t(i * this.width + o), o++;
    }
    return this;
  }
}
class mn extends hr {
  constructor(t) {
    super(8, new Uint8Array(Math.ceil(t / 8)).fill(0));
  }
}
function $t(n) {
  return n % 3 === 2 ? n - 2 : n + 1;
}
function Pt(n) {
  return n % 3 === 0 ? n + 2 : n - 1;
}
function wn(n, t, e, i, o, r, s, a) {
  const c = At(n, t, o, r, s, a), f = At(e, i, o, r, s, a);
  if (c > 0 && f > 0 || c < 0 && f < 0)
    return !1;
  const l = At(o, r, n, t, e, i), h = At(s, a, n, t, e, i);
  return l > 0 && h > 0 || l < 0 && h < 0 ? !1 : c === 0 && f === 0 && l === 0 && h === 0 ? !(Math.max(o, s) < Math.min(n, e) || Math.max(n, e) < Math.min(o, s) || Math.max(r, a) < Math.min(t, i) || Math.max(t, i) < Math.min(r, a)) : !0;
}
class lr {
  /**
   * The triangulation object from Delaunator.
   */
  del;
  constructor(t) {
    this.del = t;
  }
}
class ur extends lr {
  vertMap;
  flips;
  consd;
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
    const i = 2 ** 32 - 1, o = t.coords.length >> 1, r = t.triangles.length;
    this.vertMap = new Uint32Array(o).fill(i), this.flips = new mn(r), this.consd = new mn(r);
    for (let s = 0; s < r; s++) {
      const a = t.triangles[s];
      this.vertMap[a] === i && this.updateVert(s);
    }
    e && this.constrainAll(e);
  }
  /**
   * Constrain the triangulation such that there is an edge between p1 and p2.
   */
  constrainOne(t, e) {
    const { triangles: i, halfedges: o } = this.del, r = this.vertMap[t];
    let s = r;
    do {
      const f = i[s], l = $t(s);
      if (f === e)
        return this.protect(s);
      const h = Pt(s), u = i[h];
      if (u === e)
        return this.protect(l), l;
      if (this.intersectSegments(t, e, u, f)) {
        s = h;
        break;
      }
      s = o[l];
    } while (s !== -1 && s !== r);
    let a = s, c = -1;
    for (; s !== -1; ) {
      const f = o[s], l = Pt(s), h = Pt(f), u = $t(f);
      if (f === -1)
        throw new Error("Constraining edge exited the hull");
      if (this.consd.has(s))
        throw new Error("Edge intersects already constrained edge");
      if (this.isCollinear(t, e, i[s]) || this.isCollinear(t, e, i[f]))
        throw new Error("Constraining edge intersects point");
      if (!this.intersectSegments(
        i[s],
        i[f],
        i[l],
        i[h]
      )) {
        if (c === -1 && (c = s), i[h] === e) {
          if (s === c)
            throw new Error("Infinite loop: non-convex quadrilateral");
          s = c, c = -1;
          continue;
        }
        if (this.intersectSegments(
          t,
          e,
          i[h],
          i[f]
        ))
          s = h;
        else if (this.intersectSegments(
          t,
          e,
          i[u],
          i[h]
        ))
          s = u;
        else if (c === s)
          throw new Error("Infinite loop: no further intersect after non-convex");
        continue;
      }
      if (this.flipDiagonal(s), this.intersectSegments(
        t,
        e,
        i[l],
        i[h]
      ) && (c === -1 && (c = l), c === l))
        throw new Error("Infinite loop: flipped diagonal still intersects");
      i[h] === e ? (a = h, s = c, c = -1) : this.intersectSegments(
        t,
        e,
        i[u],
        i[h]
      ) && (s = u);
    }
    return this.protect(a), this.delaunify(!0), this.findEdge(t, e);
  }
  /**
   * Fix the Delaunay condition.
   */
  delaunify(t = !1) {
    const { halfedges: e } = this.del, i = this.flips, o = this.consd, r = e.length;
    let s;
    do {
      s = 0;
      for (let a = 0; a < r; a++) {
        if (o.has(a))
          continue;
        i.delete(a);
        const c = e[a];
        c !== -1 && (i.delete(c), this.isDelaunay(a) || (this.flipDiagonal(a), s++));
      }
    } while (t && s > 0);
    return this;
  }
  /**
   * Call constrainOne on each edge.
   */
  constrainAll(t) {
    const e = t.length;
    for (let i = 0; i < e; i++) {
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
  findEdge(t, e) {
    const i = this.vertMap[e], { triangles: o, halfedges: r } = this.del;
    let s = i, a = -1;
    do {
      if (o[s] === t)
        return s;
      a = $t(s), s = r[a];
    } while (s !== -1 && s !== i);
    return o[$t(a)] === t ? -a : 1 / 0;
  }
  /**
   * Mark an edge as constrained, i.e. should not be touched by `delaunify`.
   */
  protect(t) {
    const e = this.del.halfedges[t], i = this.flips, o = this.consd;
    return i.delete(t), o.add(t), e !== -1 ? (i.delete(e), o.add(e), e) : -t;
  }
  /**
   * Mark an edge as flipped unless constrained.
   */
  markFlip(t) {
    const e = this.del.halfedges, i = this.flips;
    if (this.consd.has(t))
      return !1;
    const r = e[t];
    return r !== -1 && (i.add(t), i.add(r)), !0;
  }
  /**
   * Flip the edge shared by two triangles.
   */
  flipDiagonal(t) {
    const { triangles: e, halfedges: i } = this.del, o = this.flips, r = this.consd, s = i[t], a = Pt(t), c = $t(t), f = Pt(s), l = $t(s), h = i[a], u = i[f];
    if (r.has(t))
      throw new Error("Trying to flip a constrained edge");
    return e[t] = e[f], i[t] = u, o.set(t, o.has(f)) || r.set(t, r.has(f)), u !== -1 && (i[u] = t), i[a] = f, e[s] = e[a], i[s] = h, o.set(s, o.has(a)) || r.set(s, r.has(a)), h !== -1 && (i[h] = s), i[f] = a, this.markFlip(t), this.markFlip(c), this.markFlip(s), this.markFlip(l), o.add(a), r.delete(a), o.add(f), r.delete(f), this.updateVert(t), this.updateVert(c), this.updateVert(s), this.updateVert(l), a;
  }
  /**
   * Whether point p1, p2, and p are collinear.
   */
  isCollinear(t, e, i) {
    const o = this.del.coords;
    return At(
      o[t * 2],
      o[t * 2 + 1],
      o[e * 2],
      o[e * 2 + 1],
      o[i * 2],
      o[i * 2 + 1]
    ) === 0;
  }
  /**
   * Whether the triangle formed by p1, p2, p3 keeps px outside the circumcircle.
   */
  inCircle(t, e, i, o) {
    const r = this.del.coords;
    return ri(
      r[t * 2],
      r[t * 2 + 1],
      r[e * 2],
      r[e * 2 + 1],
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
    const { triangles: e, halfedges: i } = this.del, o = i[t];
    if (o === -1)
      return !0;
    const r = e[Pt(t)], s = e[t], a = e[$t(t)], c = e[Pt(o)];
    return !this.inCircle(r, s, a, c);
  }
  /**
   * Update the vertex -> incoming edge map.
   */
  updateVert(t) {
    const { triangles: e, halfedges: i } = this.del, o = this.vertMap, r = e[t];
    let s = Pt(t), a = i[s];
    for (; a !== -1 && a !== t; )
      s = Pt(a), a = i[s];
    return o[r] = s, s;
  }
  /**
   * Whether the segments between vertices intersect.
   */
  intersectSegments(t, e, i, o) {
    const r = this.del.coords;
    return t === i || t === o || e === i || e === o ? !1 : wn(
      r[t * 2],
      r[t * 2 + 1],
      r[e * 2],
      r[e * 2 + 1],
      r[i * 2],
      r[i * 2 + 1],
      r[o * 2],
      r[o * 2 + 1]
    );
  }
  static intersectSegments = wn;
}
function de(n, t, e) {
  if (t || (t = []), typeof n != "object" || n.type !== "FeatureCollection")
    throw "Argument points must be FeatureCollection";
  if (!Array.isArray(t)) throw "Argument points must be Array of Array";
  const i = n.features.map(
    (c) => c.geometry.coordinates
  ), o = Le.from(i);
  let r;
  const s = [];
  o.triangles.length !== 0 && t.length !== 0 && (r = new ur(o), r.constrainAll(t));
  for (let c = 0; c < o.triangles.length; c += 3)
    s.push([o.triangles[c], o.triangles[c + 1], o.triangles[c + 2]]);
  const a = ["a", "b", "c"];
  return _t(
    s.map((c) => {
      const f = {}, l = c.map((h, u) => {
        const p = n.features[h], x = p.geometry.coordinates, y = [x[0], x[1]];
        return x.length === 3 ? y[2] = x[2] : f[a[u]] = p.properties[e], y;
      });
      return l[3] = l[0], ie([l], f);
    })
  );
}
function dr(n, t) {
  const e = [[], [], [], []], i = [];
  return Object.keys(n).forEach((o) => {
    const r = n[o], s = r.forw, a = r.bakw, c = [
      s[0] - t.forw[0],
      s[1] - t.forw[1]
    ], f = [
      a[0] - t.bakw[0],
      t.bakw[1] - a[1]
    ], l = { forw: c, bakw: f };
    if (i.push(l), c[0] === 0 || c[1] === 0)
      return;
    let h = 0;
    c[0] > 0 && (h += 1), c[1] > 0 && (h += 2), e[h].push(l);
  }), { perQuad: e, aggregate: i };
}
function pr(n) {
  let t = 1 / 0, e = 0, i = 0;
  return n.forEach((o) => {
    const { forw: r, bakw: s } = o, a = Math.hypot(r[0], r[1]), c = Math.hypot(s[0], s[1]);
    if (c === 0) return;
    const f = a / c, l = Math.atan2(r[0], r[1]) - Math.atan2(s[0], s[1]);
    t = Math.min(t, f), e += Math.cos(l), i += Math.sin(l);
  }), isFinite(t) ? [t, Math.atan2(i, e)] : [1, 0];
}
function gr(n, t, e) {
  const { perQuad: i, aggregate: o } = dr(n, t), r = i.every((c) => c.length > 0), a = (e === "birdeye" ? r ? i : [o] : [o]).map((c) => pr(c));
  return a.length === 1 ? [a[0], a[0], a[0], a[0]] : a;
}
function mr(n, t) {
  let e = 0;
  return n[0] > t[0] && (e += 1), n[1] > t[1] && (e += 2), e;
}
function wr(n, t, e) {
  const i = [
    n[0] - t.forw[0],
    n[1] - t.forw[1]
  ], r = Math.sqrt(i[0] ** 2 + i[1] ** 2) / e[0], s = Math.atan2(i[0], i[1]) - e[1];
  return [
    t.bakw[0] + r * Math.sin(s),
    t.bakw[1] - r * Math.cos(s)
  ];
}
function yr(n, t, e, i) {
  const o = t[0] - n[0], r = t[1] - n[1];
  if (Math.abs(o) < 1e-12 && Math.abs(r) < 1e-12) return null;
  const s = i[0] - e[0], a = i[1] - e[1], c = e[0] - n[0], f = e[1] - n[1], l = o * a - r * s;
  if (Math.abs(l) < 1e-12) return null;
  const h = (c * a - f * s) / l, u = (c * r - f * o) / l;
  return h <= 1e-10 || u < -1e-10 || u > 1 + 1e-10 ? null : { t: h, point: [n[0] + h * o, n[1] + h * r] };
}
function vr(n, t, e) {
  const i = e.length;
  let o = -1 / 0, r = null;
  for (let s = 0; s < i; s++) {
    const a = (s + 1) % i, c = yr(
      n,
      t,
      e[s].bakw,
      e[a].bakw
    );
    c && c.t > o && (o = c.t, r = c.point);
  }
  return r;
}
function yn(n, t) {
  const i = Math.atan2(n[0] - t[0], n[1] - t[1]) * (180 / Math.PI);
  return i < 0 ? i + 360 : i;
}
function vn(n, t, e, i, o, r) {
  const s = t[0] - n[0], a = t[1] - n[1];
  if (s === 0 && a === 0) return null;
  const c = [];
  if (s !== 0)
    for (const l of [e, i]) {
      const h = (l - n[0]) / s;
      if (h > 0) {
        const u = n[1] + h * a;
        u >= o && u <= r && c.push({ t: h, x: l, y: u });
      }
    }
  if (a !== 0)
    for (const l of [o, r]) {
      const h = (l - n[1]) / a;
      if (h > 0) {
        const u = n[0] + h * s;
        u >= e && u <= i && c.push({ t: h, x: u, y: l });
      }
    }
  if (c.length === 0) return null;
  c.sort((l, h) => l.t - h.t);
  const f = c[0];
  return [f.x, f.y];
}
function bn(n, t, e) {
  const i = n.length, o = new Array(i).fill(1);
  for (const r of t)
    for (let s = 0; s < i; s++) {
      const a = (s + 1) % i, c = Ue([n[s].bakw, n[a].bakw]), f = Ue([e.bakw, r.bakw]), l = gi(c, f);
      if (l.features.length > 0 && l.features[0].geometry) {
        const h = l.features[0], u = Math.sqrt(
          Math.pow(r.bakw[0] - e.bakw[0], 2) + Math.pow(r.bakw[1] - e.bakw[1], 2)
        ), p = Math.sqrt(
          Math.pow(h.geometry.coordinates[0] - e.bakw[0], 2) + Math.pow(h.geometry.coordinates[1] - e.bakw[1], 2)
        ), x = u / p;
        x > o[s] && (o[s] = x), x > o[a] && (o[a] = x);
      }
    }
  n.forEach((r, s) => {
    const a = o[s];
    r.bakw = [
      (r.bakw[0] - e.bakw[0]) * a + e.bakw[0],
      (r.bakw[1] - e.bakw[1]) * a + e.bakw[1]
    ];
  });
}
function Fn(n, t, e) {
  const { convexBuf: i, centroid: o, allGcps: r, minx: s, maxx: a, miny: c, maxy: f } = n, l = gr(i, o, t), u = [
    [s, c],
    [a, c],
    [a, f],
    [s, f]
  ].map((m) => ({
    forw: m,
    bakw: wr(
      m,
      o,
      l[mr(m, o.forw)]
    )
  }));
  if (u.sort(
    (m, A) => Math.atan2(m.forw[0] - o.forw[0], m.forw[1] - o.forw[1]) - Math.atan2(A.forw[0] - o.forw[0], A.forw[1] - o.forw[1])
  ), bn(u, r, o), !e) return u;
  const p = 4, x = u.map(
    (m) => Math.atan2(m.forw[0] - o.forw[0], m.forw[1] - o.forw[1])
  ), y = u.map(
    (m) => Math.atan2(
      m.bakw[0] - o.bakw[0],
      -(m.bakw[1] - o.bakw[1])
    )
  );
  function S(m) {
    for (let A = 0; A < p; A++) {
      const B = (A + 1) % p, P = x[A], I = A < p - 1 ? x[B] : x[B] + 2 * Math.PI;
      let T = m;
      for (; T < P; ) T += 2 * Math.PI;
      for (; T >= P + 2 * Math.PI; ) T -= 2 * Math.PI;
      if (T >= P && T < I)
        return { i: A, j: B, frac: (T - P) / (I - P) };
    }
    return { i: 0, j: 1, frac: 0 };
  }
  function k(m) {
    const { i: A, j: B, frac: P } = S(m), I = y[A];
    let C = y[B] - I;
    for (; C > Math.PI; ) C -= 2 * Math.PI;
    for (; C < -Math.PI; ) C += 2 * Math.PI;
    return I + P * C;
  }
  const g = new Set(
    u.map(
      (m) => Math.floor(yn(m.forw, o.forw) / 10) % 36
    )
  ), v = r.map((m) => ({
    forw: m.forw,
    bakw: m.bakw,
    angleDeg: yn(m.forw, o.forw),
    forwDist: Math.hypot(m.forw[0] - o.forw[0], m.forw[1] - o.forw[1])
  })), d = [];
  for (let m = 0; m < 36; m++) {
    if (g.has(m)) continue;
    const A = m * 10, B = v.filter(
      (E) => E.angleDeg >= A && E.angleDeg < A + 10
    );
    let P = null;
    if (B.length > 0) {
      const E = B.reduce((M, N) => N.forwDist > M.forwDist ? N : M);
      P = vn(o.forw, E.forw, s, a, c, f);
    }
    if (!P) {
      const E = (A + 5) % 360 * (Math.PI / 180), M = [
        o.forw[0] + Math.sin(E),
        o.forw[1] + Math.cos(E)
      ];
      P = vn(o.forw, M, s, a, c, f);
    }
    if (!P) continue;
    const I = [P[0] - o.forw[0], P[1] - o.forw[1]], T = Math.atan2(I[0], I[1]), C = k(T), Y = [
      o.bakw[0] + Math.sin(C),
      o.bakw[1] - Math.cos(C)
    ], w = vr(o.bakw, Y, u);
    w && d.push({ forw: P, bakw: w });
  }
  const b = [...u, ...d];
  return b.sort(
    (m, A) => Math.atan2(m.forw[0] - o.forw[0], m.forw[1] - o.forw[1]) - Math.atan2(A.forw[0] - o.forw[0], A.forw[1] - o.forw[1])
  ), bn(b, r, o), b;
}
function br(n, t = !1) {
  return Fn(n, "plain", t);
}
function xr(n, t = !1) {
  return Fn(n, "birdeye", t);
}
function _r(n) {
  const e = new Mr(n).findSegmentIntersections(), i = jn(e), o = /* @__PURE__ */ new Map();
  return i.forEach((r) => {
    o.set(`${r.x}:${r.y}`, r);
  }), Array.from(o.values()).map(
    (r) => Rt([r.x, r.y])
  );
}
class Mr {
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
    const e = [], i = [], o = t.map((r) => {
      const s = r ? r.length : 0;
      for (let a = 0; a < s; a++)
        e.push(r[a][0]), i.push(r[a][1]);
      return s;
    });
    this.initXYData(o, e, i);
  }
  initXYData(t, e, i) {
    const o = t.length;
    this._xx = new Float64Array(e), this._yy = new Float64Array(i), this._nn = new Uint32Array(t), this._zz = null, this._zlimit = 0, this._filteredArcIter = null, this._ii = new Uint32Array(o);
    let r = 0;
    for (let s = 0; s < o; s++)
      this._ii[s] = r, r += t[s];
    (r != this._xx.length || this._xx.length != this._yy.length) && $e("ArcCollection#initXYData() Counting error"), this.initBounds(), this._arcIter = new Vr(this._xx, this._yy);
  }
  initBounds() {
    const t = this.calcArcBounds_(this._xx, this._yy, this._nn);
    this._bb = t.bb, this._allBounds = t.bounds;
  }
  /**
   * データの境界を計算
   * @returns バウンディングボックス情報
   */
  calcArcBounds_(t, e, i) {
    const o = i.length, r = new Float64Array(o * 4), s = new ne();
    let a = 0, c, f, l;
    for (let h = 0; h < o; h++)
      c = i[h], c > 0 && (f = h * 4, l = qr(t, e, a, c), r[f++] = l[0], r[f++] = l[1], r[f++] = l[2], r[f] = l[3], a += c, s.mergeBounds(l));
    return {
      bb: r,
      bounds: s
    };
  }
  getBounds() {
    return this._allBounds ? this._allBounds.clone() : new ne();
  }
  // @cb function(i, j, xx, yy)
  forEachSegment(t) {
    let e = 0;
    for (let i = 0, o = this.size(); i < o; i++)
      e += this.forEachArcSegment(i, t);
    return e;
  }
  size() {
    return this._ii && this._ii.length || 0;
  }
  // @cb function(i, j, xx, yy)
  forEachArcSegment(t, e) {
    const i = t >= 0, o = i ? t : ~t, r = this.getRetainedInterval(), s = this._nn[o], a = i ? 1 : -1;
    let c = i ? this._ii[o] : this._ii[o] + s - 1, f = c, l = 0;
    for (let h = 1; h < s; h++)
      f += a, (r === 0 || this._zz[f] >= r) && (e(c, f, this._xx, this._yy), c = f, l++);
    return l;
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
    const i = this.forEachSegment(
      (o, r, s, a) => {
        t += Math.abs(s[o] - s[r]), e += Math.abs(a[o] - a[r]);
      }
    );
    return [t / i || 0, e / i || 0];
  }
  /**
   * 交差判定のためのストライプ数を計算
   * 線分の平均長さに基づいて最適な分割数を決定
   */
  calcSegmentIntersectionStripeCount() {
    const t = this.getBounds().height(), e = this.getAvgSegment2()[1];
    let i = 1;
    return e > 0 && t > 0 && (i = Math.ceil(t / e / 20)), i || 1;
  }
  /**
   * 線分の交差を検出
   * ストライプ分割による効率的な判定を実装
   *
   * @returns 検出された交差点の配列
   */
  findSegmentIntersections() {
    const t = this.getBounds(), e = t.ymin || 0, i = (t.ymax || 0) - e, o = this.calcSegmentIntersectionStripeCount(), r = new Uint32Array(o), s = o > 1 ? (y) => Math.floor((o - 1) * (y - e) / i) : () => 0;
    let a, c;
    this.forEachSegment(
      (y, S, k, g) => {
        let v = s(g[y]);
        const d = s(g[S]);
        for (; r[v] = r[v] + 2, v != d; )
          v += d > v ? 1 : -1;
      }
    );
    const f = this.getUint32Array(Er(r));
    let l = 0;
    const h = [];
    Ar(r, (y) => {
      const S = l;
      l += y, h.push(f.subarray(S, l));
    }), Pr(r, 0), this.forEachSegment(
      (y, S, k, g) => {
        let v = s(g[y]);
        const d = s(g[S]);
        let b, m;
        for (; b = r[v], r[v] = b + 2, m = h[v], m[b] = y, m[b + 1] = S, v != d; )
          v += d > v ? 1 : -1;
      }
    );
    const u = this.getVertexData(), p = [];
    let x;
    for (a = 0; a < o; a++)
      if (u.xx && u.yy)
        for (x = Ir(h[a], u.xx, u.yy), c = 0; c < x.length; c++)
          p.push(x[c]);
    return jn(p);
  }
}
function $e(...n) {
  const t = n.join(" ");
  throw new Error(t);
}
function je(n) {
  return n ? Sr(n) ? !0 : kr(n) ? !1 : n.length === 0 ? !0 : n.length > 0 : !1;
}
function kr(n) {
  return n != null && n.toString === String.prototype.toString;
}
function Sr(n) {
  return Array.isArray(n);
}
function Er(n, t) {
  je(n) || $e("utils.sum() expects an array, received:", n);
  let e = 0, i;
  for (let o = 0, r = n.length; o < r; o++)
    i = n[o], i && (e += i);
  return e;
}
function Ar(n, t, e) {
  if (!je(n))
    throw new Error(`#forEach() takes an array-like argument. ${n}`);
  for (let i = 0, o = n.length; i < o; i++)
    t.call(e, n[i], i);
}
function Pr(n, t) {
  for (let e = 0, i = n.length; e < i; e++)
    n[e] = t;
  return n;
}
function Ir(n, t, e) {
  const i = n.length - 2, o = [];
  let r, s, a, c, f, l, h, u, p, x, y, S, k, g, v, d, b;
  for (Fr(t, n), d = 0; d < i; ) {
    for (r = n[d], s = n[d + 1], f = t[r], l = t[s], p = e[r], x = e[s], b = d; b < i && (b += 2, a = n[b], h = t[a], !(l < h)); ) {
      if (y = e[a], c = n[b + 1], u = t[c], S = e[c], p >= y) {
        if (p > S && x > y && x > S) continue;
      } else if (p < S && x < y && x < S) continue;
      r == a || r == c || s == a || s == c || (k = Br(
        f,
        p,
        l,
        x,
        h,
        y,
        u,
        S
      ), k && (g = [r, s], v = [a, c], o.push(_n(k, g, v, t, e)), k.length == 4 && o.push(
        _n(k.slice(2), g, v, t, e)
      )));
    }
    d += 2;
  }
  return o;
}
function Br(n, t, e, i, o, r, s, a) {
  const c = Or(n, t, e, i, o, r, s, a);
  let f = null;
  return c && (f = Nr(n, t, e, i, o, r, s, a), f ? Yr(n, t, e, i, o, r, s, a) && (f = null) : f = Rr(n, t, e, i, o, r, s, a)), f;
}
function Or(n, t, e, i, o, r, s, a) {
  return Ht(n, t, e, i, o, r) * Ht(n, t, e, i, s, a) <= 0 && Ht(o, r, s, a, n, t) * Ht(o, r, s, a, e, i) <= 0;
}
function Ht(n, t, e, i, o, r) {
  return Ln(n - o, t - r, e - o, i - r);
}
function Ln(n, t, e, i) {
  return n * i - t * e;
}
function Nr(n, t, e, i, o, r, s, a) {
  let c = pe(n, t, e, i, o, r, s, a), f;
  return c && (f = Xr(c[0], c[1], n, t, e, i, o, r, s, a), f == 1 ? c = pe(e, i, n, t, o, r, s, a) : f == 2 ? c = pe(o, r, s, a, n, t, e, i) : f == 3 && (c = pe(s, a, o, r, n, t, e, i))), c && Dr(c, n, t, e, i, o, r, s, a), c;
}
function pe(n, t, e, i, o, r, s, a) {
  const c = Ln(e - n, i - t, s - o, a - r), f = 1e-18;
  let l;
  if (c === 0) return null;
  const h = Ht(o, r, s, a, n, t) / c;
  return c <= f && c >= -f ? l = Tr(n, t, e, i, o, r, s, a) : l = [n + h * (e - n), t + h * (i - t)], l;
}
function Tr(n, t, e, i, o, r, s, a) {
  let c = null;
  return !It(n, o, s) && !It(t, r, a) ? c = [n, t] : !It(e, o, s) && !It(i, r, a) ? c = [e, i] : !It(o, n, e) && !It(r, t, i) ? c = [o, r] : !It(s, n, e) && !It(a, t, i) && (c = [s, a]), c;
}
function It(n, t, e) {
  let i;
  return t < e ? i = n < t || n > e : t > e ? i = n > t || n < e : i = n != t, i;
}
function Xr(n, t, ...e) {
  let i = -1, o = 1 / 0, r;
  for (let s = 0, a = 0, c = e.length; a < c; s++, a += 2)
    r = Cr(n, t, e[a], e[a + 1]), r < o && (o = r, i = s);
  return i;
}
function Cr(n, t, e, i) {
  const o = n - e, r = t - i;
  return o * o + r * r;
}
function Dr(n, t, e, i, o, r, s, a, c) {
  let f = n[0], l = n[1];
  f = ge(f, t, i), f = ge(f, r, a), l = ge(l, e, o), l = ge(l, s, c), n[0] = f, n[1] = l;
}
function ge(n, t, e) {
  let i;
  return It(n, t, e) && (i = Math.abs(n - t) < Math.abs(n - e) ? t : e, n = i), n;
}
function Rr(n, t, e, i, o, r, s, a) {
  const c = Math.min(n, e, o, s), f = Math.max(n, e, o, s), l = Math.min(t, i, r, a), h = Math.max(t, i, r, a), u = h - l > f - c;
  let p = [];
  return (u ? Dt(t, l, h) : Dt(n, c, f)) && p.push(n, t), (u ? Dt(i, l, h) : Dt(e, c, f)) && p.push(e, i), (u ? Dt(r, l, h) : Dt(o, c, f)) && p.push(o, r), (u ? Dt(a, l, h) : Dt(s, c, f)) && p.push(s, a), (p.length != 2 && p.length != 4 || p.length == 4 && p[0] == p[2] && p[1] == p[3]) && (p = null), p;
}
function Yr(n, t, e, i, o, r, s, a) {
  return n == o && t == r || n == s && t == a || e == o && i == r || e == s && i == a;
}
function Dt(n, t, e) {
  return n > t && n < e;
}
function Fr(n, t) {
  Lr(n, t), $n(n, t, 0, t.length - 2);
}
function Lr(n, t) {
  for (let e = 0, i = t.length; e < i; e += 2)
    n[t[e]] > n[t[e + 1]] && $r(t, e, e + 1);
}
function $r(n, t, e) {
  const i = n[t];
  n[t] = n[e], n[e] = i;
}
function $n(n, t, e, i) {
  let o = e, r = i, s, a;
  for (; o < i; ) {
    for (s = n[t[e + i >> 2 << 1]]; o <= r; ) {
      for (; n[t[o]] < s; ) o += 2;
      for (; n[t[r]] > s; ) r -= 2;
      o <= r && (a = t[o], t[o] = t[r], t[r] = a, a = t[o + 1], t[o + 1] = t[r + 1], t[r + 1] = a, o += 2, r -= 2);
    }
    if (r - e < 40 ? xn(n, t, e, r) : $n(n, t, e, r), i - o < 40) {
      xn(n, t, o, i);
      return;
    }
    e = o, r = i;
  }
}
function xn(n, t, e, i) {
  let o, r;
  for (let s = e + 2; s <= i; s += 2) {
    o = t[s], r = t[s + 1];
    let a;
    for (a = s - 2; a >= e && n[o] < n[t[a]]; a -= 2)
      t[a + 2] = t[a], t[a + 3] = t[a + 1];
    t[a + 2] = o, t[a + 3] = r;
  }
}
function _n(n, t, e, i, o) {
  const r = n[0], s = n[1];
  t = Mn(r, s, t[0], t[1], i, o), e = Mn(r, s, e[0], e[1], i, o);
  const a = t[0] < e[0] ? t : e, c = a == t ? e : t;
  return { x: r, y: s, a, b: c };
}
function Mn(n, t, e, i, o, r) {
  let s = e < i ? e : i, a = s === e ? i : e;
  return o[s] == n && r[s] == t ? a = s : o[a] == n && r[a] == t && (s = a), [s, a];
}
function jn(n) {
  const t = {};
  return n.filter((e) => {
    const i = jr(e);
    return i in t ? !1 : (t[i] = !0, !0);
  });
}
function jr(n) {
  return `${n.a.join(",")};${n.b.join(",")}`;
}
class Vr {
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
function qr(n, t, e, i) {
  let o = e | 0;
  const r = isNaN(i) ? n.length - o : i + o;
  let s, a, c, f, l, h;
  if (r > 0)
    c = l = n[o], f = h = t[o];
  else return [void 0, void 0, void 0, void 0];
  for (o++; o < r; o++)
    s = n[o], a = t[o], s < c && (c = s), s > l && (l = s), a < f && (f = a), a > h && (h = a);
  return [c, f, l, h];
}
class ne {
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
    return new ne(
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
  setBounds(t, e, i, o) {
    let r, s, a, c;
    if (arguments.length == 1)
      if (je(t)) {
        const f = t;
        r = f[0], s = f[1], a = f[2], c = f[3];
      } else {
        const f = t;
        r = f.xmin, s = f.ymin, a = f.xmax, c = f.ymax;
      }
    else
      r = t, s = e, a = i, c = o;
    return this.xmin = r, this.ymin = s, this.xmax = a, this.ymax = c, (r > a || s > c) && this.update(), this;
  }
  update() {
    let t;
    this.xmin > this.xmax && (t = this.xmin, this.xmin = this.xmax, this.xmax = t), this.ymin > this.ymax && (t = this.ymin, this.ymin = this.ymax, this.ymax = t);
  }
  mergeBounds(t, ...e) {
    let i, o, r, s;
    return t instanceof ne ? (i = t.xmin, o = t.ymin, r = t.xmax, s = t.ymax) : e.length == 3 ? (i = t, o = e[0], r = e[1], s = e[2]) : t.length == 4 ? (i = t[0], o = t[1], r = t[2], s = t[3]) : $e("Bounds#mergeBounds() invalid argument:", t), this.xmin === void 0 ? this.setBounds(i, o, r, s) : (i < this.xmin && (this.xmin = i), o < this.ymin && (this.ymin = o), r > this.xmax && (this.xmax = r), s > this.ymax && (this.ymax = s)), this;
  }
}
function be(n) {
  const t = ["a", "b", "c"].map(
    (e) => n.properties[e].index
  );
  return [
    [0, 1],
    [0, 2],
    [1, 2],
    [0, 1, 2]
  ].map(
    (e) => e.map((i) => t[i]).sort().join("-")
  ).sort();
}
function Vn(n, t, e) {
  const i = be(t.forw), o = be(t.bakw);
  if (JSON.stringify(i) != JSON.stringify(o))
    throw `${JSON.stringify(t, null, 2)}
${JSON.stringify(
      i
    )}
${JSON.stringify(o)}`;
  for (let r = 0; r < i.length; r++) {
    const s = i[r];
    n[s] || (n[s] = []), n[s].push(t);
  }
  e && (e.forw.features.push(t.forw), e.bakw.features.push(t.bakw));
}
function kn(n, t, e) {
  const i = be(t.forw), o = be(t.bakw);
  if (JSON.stringify(i) != JSON.stringify(o))
    throw `${JSON.stringify(t, null, 2)}
${JSON.stringify(i)}
${JSON.stringify(o)}`;
  if (i.forEach((r) => {
    const s = n[r];
    if (!s) return;
    const a = s.filter((c) => c !== t);
    a.length === 0 ? delete n[r] : n[r] = a;
  }), e) {
    const r = (s, a) => {
      !s || !a || (s.features = s.features.filter((c) => c !== a));
    };
    r(e.forw, t.forw), r(e.bakw, t.bakw);
  }
}
function me(n, t, e) {
  return Rt(n, { target: { geom: t, index: e } });
}
function we(n) {
  return Rt(n.properties.target.geom, {
    target: {
      geom: n.geometry.coordinates,
      index: n.properties.target.index
    }
  });
}
function Sn(n, t) {
  const e = n.length, i = t.geometry.coordinates;
  return Array.from({ length: e }, (o, r) => r).map((o) => {
    const r = (o + 1) % e, s = n[o], a = n[r], c = s.geometry.coordinates, f = Math.atan2(
      c[0] - i[0],
      c[1] - i[1]
    ), l = [t, s, a, t].map(
      (p) => p.geometry.coordinates
    ), h = {
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
    }, u = _t([
      ie([l], h)
    ]);
    return [f, u];
  }).reduce(
    (o, r) => (o[0].push(r[0]), o[1].push(r[1]), o),
    [[], []]
  );
}
function Ur(n) {
  const { tins: t, targets: e, includeReciprocals: i, numBoundaryVertices: o = 4 } = n, r = {};
  e.forEach((a) => {
    const c = t[a];
    if (!c || !c.features) return;
    r[a] = {};
    const f = {};
    c.features.forEach((l) => {
      const h = ["a", "b", "c"];
      for (let u = 0; u < 3; u++) {
        const p = (u + 1) % 3, x = h[u], y = h[p], S = l.properties[x].index, k = l.properties[y].index, g = [S, k].sort().join("-");
        if (f[g]) continue;
        f[g] = !0;
        const v = l.geometry.coordinates[0][u], d = l.geometry.coordinates[0][p], b = l.properties[x].geom, m = l.properties[y].geom, A = Math.sqrt(
          Math.pow(b[0] - m[0], 2) + Math.pow(b[1] - m[1], 2)
        ) / Math.sqrt(
          Math.pow(v[0] - d[0], 2) + Math.pow(v[1] - d[1], 2)
        ), B = r[a];
        B[`${S}:${g}`] = A, B[`${k}:${g}`] = A;
      }
    });
  });
  const s = {};
  return i && (s.bakw = {}), e.forEach((a) => {
    const c = r[a];
    if (s[a] = {}, !c)
      return;
    const f = {};
    Object.keys(c).forEach((h) => {
      const [u] = h.split(":");
      f[u] || (f[u] = []), f[u].push(c[h]);
    }), Object.keys(f).forEach((h) => {
      const u = f[h], p = u.reduce((x, y) => x + y, 0) / u.length;
      s[a][h] = p, i && s.bakw && (s.bakw[h] = 1 / p);
    });
    let l = 0;
    for (let h = 0; h < o; h++) {
      const u = `b${h}`, p = s[a][u] || 0;
      l += p;
    }
    s[a].c = l / o, i && s.bakw && (s.bakw.c = 1 / s[a].c);
  }), s;
}
function ye(n, t = 1e-6) {
  const [e, i] = n[0], [o, r] = n[1], [s, a] = n[2];
  return Math.abs((o - e) * (a - i) - (s - e) * (r - i)) < t;
}
function zr(n, t) {
  const e = n.split("-");
  if (e.length !== 2 || !e.every((r) => /^-?\d+$/.test(r))) return !1;
  const [i, o] = e.map((r) => parseInt(r, 10)).sort((r, s) => r - s);
  return t.some((r) => {
    if (r.length !== 2) return !1;
    const s = r.map((c) => parseInt(`${c}`, 10));
    if (s.some((c) => Number.isNaN(c))) return !1;
    const a = s.sort((c, f) => c - f);
    return a[0] === i && a[1] === o;
  });
}
function Zt(n) {
  return ["a", "b", "c"].map((t, e) => ({
    prop: n.properties[t],
    geom: n.geometry.coordinates[0][e]
  }));
}
const Wr = 10;
function Gr(n, t, e, i, o, r) {
  if (!n && !t) return !1;
  const s = n ? 0 : 1, a = 1 - s, c = e[s], f = e[a];
  if (!c || !f) return !1;
  const l = vt(f.geom);
  let h = !1, u = !1;
  for (let p = 0; p <= 1; p++) {
    const x = i[p];
    if (!x) continue;
    const y = [String(x.prop.index), String(c.prop.index)].sort().join("-"), S = o[y];
    if (!S || S.length < 2) continue;
    const k = S.find(
      (T) => T.bakw !== r[s].bakw
    );
    if (!k) continue;
    const v = Zt(k.bakw).find(
      (T) => String(T.prop.index) !== String(x.prop.index) && String(T.prop.index) !== String(c.prop.index)
    );
    if (!v) continue;
    h = !0;
    const d = vt(v.geom), b = vt(x.geom), m = vt(c.geom), A = m[0] - b[0], B = m[1] - b[1], P = A * (l[1] - b[1]) - B * (l[0] - b[0]), I = A * (d[1] - b[1]) - B * (d[0] - b[0]);
    if (P * I > 0) {
      u = !0;
      break;
    }
  }
  return h && !u;
}
function Jr(n, t, e, i) {
  if (!n && !t) return !1;
  if (e[0] && e[1] && i[0] && i[1]) {
    const o = i.map((l) => vt(l.geom)), r = e.map((l) => vt(l.geom)), s = o[1][0] - o[0][0], a = o[1][1] - o[0][1], c = s * (r[0][1] - o[0][1]) - a * (r[0][0] - o[0][0]), f = s * (r[1][1] - o[0][1]) - a * (r[1][0] - o[0][0]);
    return c * f < 0;
  }
  return !1;
}
function Kr(n, t, e) {
  const i = /* @__PURE__ */ new Set();
  let o = !1;
  for (let r = 0; r < Wr; r++) {
    let s = !1;
    for (const a of Object.keys(t)) {
      if (i.has(a)) continue;
      i.add(a);
      const c = t[a];
      if (!c || c.length < 2) continue;
      const f = a.split("-");
      if (f.length !== 2 || zr(a, e)) continue;
      const l = Zt(c[0].bakw), h = Zt(c[1].bakw), u = Zt(c[0].forw), p = Zt(c[1].forw), x = f.map(
        (O) => l.find((D) => `${D.prop.index}` === O) || h.find((D) => `${D.prop.index}` === O)
      ), y = f.map(
        (O) => u.find((D) => `${D.prop.index}` === O) || p.find((D) => `${D.prop.index}` === O)
      );
      if (x.some((O) => !O) || y.some((O) => !O))
        continue;
      const S = [l, h].map(
        (O) => O.find((D) => !f.includes(`${D.prop.index}`))
      ), k = [u, p].map(
        (O) => O.find((D) => !f.includes(`${D.prop.index}`))
      );
      if (S.some((O) => !O) || k.some((O) => !O))
        continue;
      const g = c[0].bakw.geometry.coordinates[0].slice(0, 3).map((O) => vt(O)), v = c[1].bakw.geometry.coordinates[0].slice(0, 3).map((O) => vt(O)), d = c[0].forw.geometry.coordinates[0].slice(0, 3).map((O) => vt(O)), b = c[1].forw.geometry.coordinates[0].slice(0, 3).map((O) => vt(O)), m = ye(g), A = ye(v), B = ye(d), P = ye(b), I = Gr(
        m,
        A,
        S,
        x,
        t,
        c
      ), T = Jr(
        B,
        P,
        S,
        x
      );
      if (!(I || T || En(
        vt(S[0].geom),
        v
      ) || En(
        vt(S[1].geom),
        g
      )))
        continue;
      const Y = y.map(
        (O) => vt(O.geom)
      ), w = k.map(
        (O) => vt(O.geom)
      ), E = Qr([
        ...Y,
        ...w
      ]), M = Hr(E), N = An(
        Y[0],
        Y[1],
        w[0]
      ) + An(
        Y[0],
        Y[1],
        w[1]
      );
      Re(M, N) && (kn(t, c[0], n), kn(t, c[1], n), x.forEach((O) => {
        if (!O) return;
        const D = [
          O.geom,
          S[0].geom,
          S[1].geom,
          O.geom
        ], _ = {
          a: O.prop,
          b: S[0].prop,
          c: S[1].prop
        }, X = ie([D], _), R = Dn(X);
        Vn(t, {
          forw: R,
          bakw: X
        }, n);
      }), s = !0, o = !0);
    }
    if (!s) break;
  }
  return o;
}
function vt(n) {
  return [n[0], n[1]];
}
function En(n, t) {
  const [e, i] = t[0], [o, r] = t[1], [s, a] = t[2], c = s - e, f = a - i, l = o - e, h = r - i, u = n[0] - e, p = n[1] - i, x = c * c + f * f, y = c * l + f * h, S = c * u + f * p, k = l * l + h * h, g = l * u + h * p, v = x * k - y * y;
  if (v === 0) return !1;
  const d = 1 / v, b = (k * S - y * g) * d, m = (x * g - y * S) * d, A = 1e-9;
  return b >= -A && m >= -A && b + m <= 1 + A;
}
function Qr(n) {
  const t = n.map((s) => s.slice()).filter(
    (s, a, c) => c.findIndex(
      (f) => Re(f[0], s[0]) && Re(f[1], s[1])
    ) === a
  );
  if (t.length <= 1) return t;
  const e = t.sort(
    (s, a) => s[0] === a[0] ? s[1] - a[1] : s[0] - a[0]
  ), i = (s, a, c) => (a[0] - s[0]) * (c[1] - s[1]) - (a[1] - s[1]) * (c[0] - s[0]), o = [];
  for (const s of e) {
    for (; o.length >= 2 && i(
      o[o.length - 2],
      o[o.length - 1],
      s
    ) <= 0; )
      o.pop();
    o.push(s);
  }
  const r = [];
  for (let s = e.length - 1; s >= 0; s--) {
    const a = e[s];
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
function Hr(n) {
  if (n.length < 3) return 0;
  let t = 0;
  for (let e = 0; e < n.length; e++) {
    const [i, o] = n[e], [r, s] = n[(e + 1) % n.length];
    t += i * s - r * o;
  }
  return Math.abs(t) / 2;
}
function An(n, t, e) {
  return Math.abs(
    (n[0] * (t[1] - e[1]) + t[0] * (e[1] - n[1]) + e[0] * (n[1] - t[1])) / 2
  );
}
function Re(n, t, e = 1e-9) {
  return Math.abs(n - t) <= e;
}
const Pn = 3;
class ft extends xt {
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
    return this.useV2Algorithm ? pn : Pn;
  }
  /**
   * 制御点（GCP: Ground Control Points）を設定します。
   * 指定した点群に合わせて内部のTINキャッシュをリセットします。
   */
  setPoints(t) {
    this.yaxisMode === ft.YAXIS_FOLLOW && (t = t.map((e) => [
      e[0],
      [e[1][0], -1 * e[1][1]]
    ])), this.points = t, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * エッジ（制約線）を設定します。
   * 制約線を正規化した上で、依存するキャッシュをリセットします。
   */
  setEdges(t = []) {
    this.edges = Yn(t), this.edgeNodes = void 0, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 境界ポリゴンを設定します
   */
  setBounds(t) {
    this.bounds = t;
    let e = t[0][0], i = e, o = t[0][1], r = o;
    const s = [t[0]];
    for (let a = 1; a < t.length; a++) {
      const c = t[a];
      c[0] < e && (e = c[0]), c[0] > i && (i = c[0]), c[1] < o && (o = c[1]), c[1] > r && (r = c[1]), s.push(c);
    }
    s.push(t[0]), this.boundsPolygon = ie([s]), this.xy = [e, o], this.wh = [i - e, r - o], this.vertexMode = ft.VERTEX_PLAIN, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 現在の設定を永続化可能な形式にコンパイルします
   */
  getCompiled() {
    const t = {};
    t.version = this.useV2Algorithm ? pn : Pn, t.points = this.points, t.weight_buffer = this.pointsWeightBuffer ?? {}, t.centroid_point = [
      this.centroid.forw.geometry.coordinates,
      this.centroid.forw.properties.target.geom
    ], t.vertices_params = [
      this.vertices_params.forw[0],
      this.vertices_params.bakw[0]
    ], t.vertices_points = [];
    const e = this.vertices_params.forw[1];
    if (e)
      for (let i = 0; i < e.length; i++) {
        const o = e[i].features[0], r = o.geometry.coordinates[0][1], s = o.properties.b.geom;
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
  calcurateStrictTin() {
    const t = this.tins.forw.features.map(
      (o) => Dn(o)
    );
    this.tins.bakw = _t(t);
    const e = {};
    this.tins.forw.features.forEach((o, r) => {
      const s = this.tins.bakw.features[r];
      Vn(e, { forw: o, bakw: s });
    }), Kr(
      this.tins,
      e,
      this.pointsSet?.edges || []
    );
    const i = ["forw", "bakw"].map((o) => {
      const r = this.tins[o].features.map(
        (s) => s.geometry.coordinates[0]
      );
      return _r(r);
    });
    i[0].length === 0 && i[1].length === 0 ? (this.strict_status = ft.STATUS_STRICT, delete this.kinks) : (this.strict_status = ft.STATUS_ERROR, this.kinks = {
      forw: _t(i[0]),
      bakw: _t(i[1])
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
      const r = this.points[o][0], s = this.points[o][1], a = me(r, s, o);
      t.forw.push(a), t.bakw.push(we(a));
    }
    const e = [];
    let i = 0;
    this.edgeNodes = [], this.edges || (this.edges = []);
    for (let o = 0; o < this.edges.length; o++) {
      const r = this.edges[o][2], s = Object.assign([], this.edges[o][0]), a = Object.assign([], this.edges[o][1]);
      if (s.length === 0 && a.length === 0) {
        e.push(r);
        continue;
      }
      s.unshift(this.points[r[0]][0]), s.push(this.points[r[1]][0]), a.unshift(this.points[r[0]][1]), a.push(this.points[r[1]][1]);
      const c = [s, a].map((f) => {
        const l = f.map((u, p, x) => {
          if (p === 0) return 0;
          const y = x[p - 1];
          return Math.sqrt(
            Math.pow(u[0] - y[0], 2) + Math.pow(u[1] - y[1], 2)
          );
        }), h = l.reduce((u, p, x) => x === 0 ? [0] : (u.push(u[x - 1] + p), u), []);
        return h.map((u, p, x) => {
          const y = u / x[x.length - 1];
          return [f[p], l[p], h[p], y];
        });
      });
      c.map((f, l) => {
        const h = c[l ? 0 : 1];
        return f.filter((u, p) => !(p === 0 || p === f.length - 1 || u[4] === "handled")).flatMap((u) => {
          const p = u[0], x = u[3], y = h.reduce(
            (S, k, g, v) => {
              if (S) return S;
              const d = v[g + 1];
              if (k[3] === x)
                return k[4] = "handled", [k];
              if (k[3] < x && d && d[3] > x)
                return [k, d];
            },
            void 0
          );
          if (y && y.length === 1)
            return l === 0 ? [[p, y[0][0], x]] : [[y[0][0], p, x]];
          if (y && y.length === 2) {
            const S = y[0], k = y[1], g = (x - S[3]) / (k[3] - S[3]), v = [
              (k[0][0] - S[0][0]) * g + S[0][0],
              (k[0][1] - S[0][1]) * g + S[0][1]
            ];
            return l === 0 ? [[p, v, x]] : [[v, p, x]];
          }
          return [];
        });
      }).reduce((f, l) => f.concat(l), []).sort((f, l) => f[2] < l[2] ? -1 : 1).map((f, l, h) => {
        this.edgeNodes[i] = [
          f[0],
          f[1]
        ];
        const u = me(
          f[0],
          f[1],
          `e${i}`
        );
        i++, t.forw.push(u), t.bakw.push(we(u)), l === 0 ? e.push([r[0], t.forw.length - 1]) : e.push([
          t.forw.length - 2,
          t.forw.length - 1
        ]), l === h.length - 1 && e.push([t.forw.length - 1, r[1]]);
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
    const t = this.xy[0] - 0.05 * this.wh[0], e = this.xy[0] + 1.05 * this.wh[0], i = this.xy[1] - 0.05 * this.wh[1], o = this.xy[1] + 1.05 * this.wh[1];
    if (this.bounds && !this.boundsPolygon) throw new Error("Internal error: bounds is set but boundsPolygon is missing");
    const r = this.bounds ? this.boundsPolygon : void 0;
    if (!this.points.reduce((c, f) => c && (r ? Ie(f[0], r) : f[0][0] >= t && f[0][0] <= e && f[0][1] >= i && f[0][1] <= o), !0))
      throw "SOME POINTS OUTSIDE";
    let a = [];
    return this.wh && (a = [[t, i], [e, i], [t, o], [e, o]]), {
      pointsSet: this.generatePointsSet(),
      bbox: a,
      minx: t,
      maxx: e,
      miny: i,
      maxy: o
    };
  }
  /**
   * Compute a bounding box derived from GCP coordinates with a 5% margin.
   * Used in V3 plain mode where no explicit image bounds are available.
   */
  computeGcpBbox() {
    let t = 1 / 0, e = -1 / 0, i = 1 / 0, o = -1 / 0;
    for (const a of this.points) {
      const c = a[0][0], f = a[0][1];
      c < t && (t = c), c > e && (e = c), f < i && (i = f), f > o && (o = f);
    }
    const r = e - t, s = o - i;
    return {
      minx: t - 0.05 * r,
      maxx: e + 0.05 * r,
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
    const e = !this.useV2Algorithm;
    let i, o, r, s, a;
    if (e) {
      if (this.bounds) {
        const I = this.boundsPolygon;
        if (!I) throw new Error("Internal error: bounds is set but boundsPolygon is missing");
        if (!this.points.every(
          (C) => Ie(C[0], I)
        )) throw "SOME POINTS OUTSIDE";
      }
      i = this.generatePointsSet(), { minx: o, maxx: r, miny: s, maxy: a } = this.computeGcpBbox();
    } else {
      const I = this.validateAndPrepareInputs();
      i = I.pointsSet, o = I.minx, r = I.maxx, s = I.miny, a = I.maxy;
    }
    const c = {
      forw: _t(i.forw),
      bakw: _t(i.bakw)
    }, f = de(
      c.forw,
      i.edges,
      "target"
    ), l = de(
      c.bakw,
      i.edges,
      "target"
    );
    if (f.features.length === 0 || l.features.length === 0)
      throw "TOO LINEAR1";
    const h = yi(c.forw), u = on(c.forw);
    if (!u) throw "TOO LINEAR2";
    const p = {}, x = u.geometry.coordinates[0];
    let y;
    try {
      y = x.map((I) => ({
        forw: I,
        bakw: Qt(Rt(I), f)
      })), y.forEach((I) => {
        p[`${I.forw[0]}:${I.forw[1]}`] = I;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const S = on(c.bakw);
    if (!S) throw "TOO LINEAR2";
    const k = S.geometry.coordinates[0];
    try {
      y = k.map((I) => ({
        bakw: I,
        forw: Qt(Rt(I), l)
      })), y.forEach((I) => {
        p[`${I.forw[0]}:${I.forw[1]}`] = I;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    let g;
    if (e) {
      const I = h.geometry.coordinates, T = f.features.find(
        (C) => Ie(
          Rt(I),
          C
        )
      );
      if (T) {
        const C = T.geometry.coordinates[0], Y = T.properties.a.geom, w = T.properties.b.geom, E = T.properties.c.geom;
        g = {
          forw: [
            (C[0][0] + C[1][0] + C[2][0]) / 3,
            (C[0][1] + C[1][1] + C[2][1]) / 3
          ],
          bakw: [
            (Y[0] + w[0] + E[0]) / 3,
            (Y[1] + w[1] + E[1]) / 3
          ]
        };
      } else
        g = {
          forw: I,
          bakw: Qt(h, f)
        };
    } else
      g = {
        forw: h.geometry.coordinates,
        bakw: Qt(h, f)
      };
    const v = me(g.forw, g.bakw, "c");
    this.centroid = {
      forw: v,
      bakw: we(v)
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
    }, m = this.vertexMode === ft.VERTEX_BIRDEYE ? xr(b, e) : br(b, e), A = {
      forw: [],
      bakw: []
    };
    for (let I = 0; I < m.length; I++) {
      const T = m[I].forw, C = m[I].bakw, Y = me(T, C, `b${I}`), w = we(Y);
      i.forw.push(Y), i.bakw.push(w), A.forw.push(Y), A.bakw.push(w);
    }
    this.pointsSet = {
      forw: _t(i.forw),
      bakw: _t(i.bakw),
      edges: i.edges
    }, this.tins = {
      forw: un(
        de(
          this.pointsSet.forw,
          i.edges,
          "target"
        )
      )
    }, (t === ft.MODE_STRICT || t === ft.MODE_AUTO) && this.calcurateStrictTin(), (t === ft.MODE_LOOSE || t === ft.MODE_AUTO && this.strict_status === ft.STATUS_ERROR) && (this.tins.bakw = un(
      de(
        this.pointsSet.bakw,
        i.edges,
        "target"
      )
    ), delete this.kinks, this.strict_status = ft.STATUS_LOOSE), this.vertices_params = {
      forw: Sn(A.forw, this.centroid.forw),
      bakw: Sn(A.bakw, this.centroid.bakw)
    }, this.addIndexedTin();
    const B = ["forw"];
    this.strict_status === ft.STATUS_LOOSE && B.push("bakw");
    const P = this.strict_status === ft.STATUS_STRICT;
    this.pointsWeightBuffer = Ur({
      tins: this.tins,
      targets: B,
      includeReciprocals: P,
      numBoundaryVertices: m.length
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
  de as constrainedTin,
  we as counterPoint,
  me as createPoint,
  ft as default,
  _r as findIntersections,
  pn as format_version,
  Vn as insertSearchIndex,
  Sn as vertexCalc
};
