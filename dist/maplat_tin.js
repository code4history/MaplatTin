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
    for (var i, o, r, s, a, h, c, l = 0, f = 0, u, g = n.type, _ = g === "FeatureCollection", w = g === "Feature", E = _ ? n.features.length : 1, k = 0; k < E; k++) {
      c = _ ? (
        // @ts-expect-error: Known type conflict
        n.features[k].geometry
      ) : w ? (
        // @ts-expect-error: Known type conflict
        n.geometry
      ) : n, u = c ? c.type === "GeometryCollection" : !1, a = u ? c.geometries.length : 1;
      for (var p = 0; p < a; p++) {
        var b = 0, d = 0;
        if (s = u ? c.geometries[p] : c, s !== null) {
          h = s.coordinates;
          var x = s.type;
          switch (l = e && (x === "Polygon" || x === "MultiPolygon") ? 1 : 0, x) {
            case null:
              break;
            case "Point":
              if (
                // @ts-expect-error: Known type conflict
                t(
                  h,
                  f,
                  k,
                  b,
                  d
                ) === !1
              )
                return !1;
              f++, b++;
              break;
            case "LineString":
            case "MultiPoint":
              for (i = 0; i < h.length; i++) {
                if (
                  // @ts-expect-error: Known type conflict
                  t(
                    h[i],
                    f,
                    k,
                    b,
                    d
                  ) === !1
                )
                  return !1;
                f++, x === "MultiPoint" && b++;
              }
              x === "LineString" && b++;
              break;
            case "Polygon":
            case "MultiLineString":
              for (i = 0; i < h.length; i++) {
                for (o = 0; o < h[i].length - l; o++) {
                  if (
                    // @ts-expect-error: Known type conflict
                    t(
                      h[i][o],
                      f,
                      k,
                      b,
                      d
                    ) === !1
                  )
                    return !1;
                  f++;
                }
                x === "MultiLineString" && b++, x === "Polygon" && d++;
              }
              x === "Polygon" && b++;
              break;
            case "MultiPolygon":
              for (i = 0; i < h.length; i++) {
                for (d = 0, o = 0; o < h[i].length; o++) {
                  for (r = 0; r < h[i][o].length - l; r++) {
                    if (
                      // @ts-expect-error: Known type conflict
                      t(
                        h[i][o][r],
                        f,
                        k,
                        b,
                        d
                      ) === !1
                    )
                      return !1;
                    f++;
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
  let r, s, a, h, c = t[0], l = i[0], f = 0, u = 0;
  l > c == l > -c ? (r = c, c = t[++f]) : (r = l, l = i[++u]);
  let g = 0;
  if (f < n && u < e)
    for (l > c == l > -c ? (s = c + r, a = r - (s - c), c = t[++f]) : (s = l + r, a = r - (s - l), l = i[++u]), r = s, a !== 0 && (o[g++] = a); f < n && u < e; )
      l > c == l > -c ? (s = r + c, h = s - r, a = r - (s - h) + (c - h), c = t[++f]) : (s = r + l, h = s - r, a = r - (s - h) + (l - h), l = i[++u]), r = s, a !== 0 && (o[g++] = a);
  for (; f < n; )
    s = r + c, h = s - r, a = r - (s - h) + (c - h), c = t[++f], r = s, a !== 0 && (o[g++] = a);
  for (; u < e; )
    s = r + l, h = s - r, a = r - (s - h) + (l - h), l = i[++u], r = s, a !== 0 && (o[g++] = a);
  return (r !== 0 || g === 0) && (o[g++] = r), g;
}
function bt(n, t, e, i, o, r, s, a) {
  return lt(lt(n, t, e, i, s), s, o, r, a);
}
function F(n, t, e, i) {
  let o, r, s, a, h, c, l, f, u, g, _;
  l = U * e, g = l - (l - e), _ = e - g;
  let w = t[0];
  o = w * e, l = U * w, f = l - (l - w), u = w - f, s = u * _ - (o - f * g - u * g - f * _);
  let E = 0;
  s !== 0 && (i[E++] = s);
  for (let k = 1; k < n; k++)
    w = t[k], a = w * e, l = U * w, f = l - (l - w), u = w - f, h = u * _ - (a - f * g - u * g - f * _), r = o + h, c = r - o, s = o - (r - c) + (h - c), s !== 0 && (i[E++] = s), o = a + r, s = r - (o - a), s !== 0 && (i[E++] = s);
  return (o !== 0 || E === 0) && (i[E++] = o), E;
}
function Bn(n, t) {
  let e = t[0];
  for (let i = 1; i < n; i++) e += t[i];
  return e;
}
function tt(n) {
  return new Float64Array(n);
}
const Kn = (3 + 16 * dt) * dt, Qn = (2 + 12 * dt) * dt, Hn = (9 + 64 * dt) * dt * dt, $t = tt(4), We = tt(8), Ge = tt(12), Je = tt(16), pt = tt(4);
function Zn(n, t, e, i, o, r, s) {
  let a, h, c, l, f, u, g, _, w, E, k, p, b, d, x, m, A, B;
  const P = n - o, I = e - o, N = t - r, X = i - r;
  d = P * X, u = U * P, g = u - (u - P), _ = P - g, u = U * X, w = u - (u - X), E = X - w, x = _ * E - (d - g * w - _ * w - g * E), m = N * I, u = U * N, g = u - (u - N), _ = N - g, u = U * I, w = u - (u - I), E = I - w, A = _ * E - (m - g * w - _ * w - g * E), k = x - A, f = x - k, $t[0] = x - (k + f) + (f - A), p = d + k, f = p - d, b = d - (p - f) + (k - f), k = b - m, f = b - k, $t[1] = b - (k + f) + (f - m), B = p + k, f = B - p, $t[2] = p - (B - f) + (k - f), $t[3] = B;
  let L = Bn(4, $t), y = Qn * s;
  if (L >= y || -L >= y || (f = n - P, a = n - (P + f) + (f - o), f = e - I, c = e - (I + f) + (f - o), f = t - N, h = t - (N + f) + (f - r), f = i - X, l = i - (X + f) + (f - r), a === 0 && h === 0 && c === 0 && l === 0) || (y = Hn * s + In * Math.abs(L), L += P * l + X * a - (N * c + I * h), L >= y || -L >= y)) return L;
  d = a * X, u = U * a, g = u - (u - a), _ = a - g, u = U * X, w = u - (u - X), E = X - w, x = _ * E - (d - g * w - _ * w - g * E), m = h * I, u = U * h, g = u - (u - h), _ = h - g, u = U * I, w = u - (u - I), E = I - w, A = _ * E - (m - g * w - _ * w - g * E), k = x - A, f = x - k, pt[0] = x - (k + f) + (f - A), p = d + k, f = p - d, b = d - (p - f) + (k - f), k = b - m, f = b - k, pt[1] = b - (k + f) + (f - m), B = p + k, f = B - p, pt[2] = p - (B - f) + (k - f), pt[3] = B;
  const S = lt(4, $t, 4, pt, We);
  d = P * l, u = U * P, g = u - (u - P), _ = P - g, u = U * l, w = u - (u - l), E = l - w, x = _ * E - (d - g * w - _ * w - g * E), m = N * c, u = U * N, g = u - (u - N), _ = N - g, u = U * c, w = u - (u - c), E = c - w, A = _ * E - (m - g * w - _ * w - g * E), k = x - A, f = x - k, pt[0] = x - (k + f) + (f - A), p = d + k, f = p - d, b = d - (p - f) + (k - f), k = b - m, f = b - k, pt[1] = b - (k + f) + (f - m), B = p + k, f = B - p, pt[2] = p - (B - f) + (k - f), pt[3] = B;
  const M = lt(S, We, 4, pt, Ge);
  d = a * l, u = U * a, g = u - (u - a), _ = a - g, u = U * l, w = u - (u - l), E = l - w, x = _ * E - (d - g * w - _ * w - g * E), m = h * c, u = U * h, g = u - (u - h), _ = h - g, u = U * c, w = u - (u - c), E = c - w, A = _ * E - (m - g * w - _ * w - g * E), k = x - A, f = x - k, pt[0] = x - (k + f) + (f - A), p = d + k, f = p - d, b = d - (p - f) + (k - f), k = b - m, f = b - k, pt[1] = b - (k + f) + (f - m), B = p + k, f = B - p, pt[2] = p - (B - f) + (k - f), pt[3] = B;
  const T = lt(M, Ge, 4, pt, Je);
  return Je[T - 1];
}
function At(n, t, e, i, o, r) {
  const s = (t - r) * (e - o), a = (n - o) * (i - r), h = s - a, c = Math.abs(s + a);
  return Math.abs(h) >= Kn * c ? h : -Zn(n, t, e, i, o, r, c);
}
const ti = (10 + 96 * dt) * dt, ei = (4 + 48 * dt) * dt, ni = (44 + 576 * dt) * dt * dt, Tt = tt(4), Nt = tt(4), Xt = tt(4), Mt = tt(4), kt = tt(4), St = tt(4), gt = tt(4), mt = tt(4), _e = tt(8), Me = tt(8), ke = tt(8), Se = tt(8), Ee = tt(8), Ae = tt(8), oe = tt(8), se = tt(8), ae = tt(8), Yt = tt(4), Ft = tt(4), Lt = tt(4), z = tt(8), J = tt(16), nt = tt(16), it = tt(16), et = tt(32), Ct = tt(32), at = tt(48), yt = tt(64);
let Ut = tt(1152), Pe = tt(1152);
function ct(n, t, e) {
  n = lt(n, Ut, t, e, Pe);
  const i = Ut;
  return Ut = Pe, Pe = i, n;
}
function ii(n, t, e, i, o, r, s, a, h) {
  let c, l, f, u, g, _, w, E, k, p, b, d, x, m, A, B, P, I, N, X, L, y, S, M, T, C, R, v, O, D, Y, j, $, q, V;
  const G = n - s, W = e - s, K = o - s, Q = t - a, Z = i - a, H = r - a;
  Y = W * H, S = U * W, M = S - (S - W), T = W - M, S = U * H, C = S - (S - H), R = H - C, j = T * R - (Y - M * C - T * C - M * R), $ = K * Z, S = U * K, M = S - (S - K), T = K - M, S = U * Z, C = S - (S - Z), R = Z - C, q = T * R - ($ - M * C - T * C - M * R), v = j - q, y = j - v, Tt[0] = j - (v + y) + (y - q), O = Y + v, y = O - Y, D = Y - (O - y) + (v - y), v = D - $, y = D - v, Tt[1] = D - (v + y) + (y - $), V = O + v, y = V - O, Tt[2] = O - (V - y) + (v - y), Tt[3] = V, Y = K * Q, S = U * K, M = S - (S - K), T = K - M, S = U * Q, C = S - (S - Q), R = Q - C, j = T * R - (Y - M * C - T * C - M * R), $ = G * H, S = U * G, M = S - (S - G), T = G - M, S = U * H, C = S - (S - H), R = H - C, q = T * R - ($ - M * C - T * C - M * R), v = j - q, y = j - v, Nt[0] = j - (v + y) + (y - q), O = Y + v, y = O - Y, D = Y - (O - y) + (v - y), v = D - $, y = D - v, Nt[1] = D - (v + y) + (y - $), V = O + v, y = V - O, Nt[2] = O - (V - y) + (v - y), Nt[3] = V, Y = G * Z, S = U * G, M = S - (S - G), T = G - M, S = U * Z, C = S - (S - Z), R = Z - C, j = T * R - (Y - M * C - T * C - M * R), $ = W * Q, S = U * W, M = S - (S - W), T = W - M, S = U * Q, C = S - (S - Q), R = Q - C, q = T * R - ($ - M * C - T * C - M * R), v = j - q, y = j - v, Xt[0] = j - (v + y) + (y - q), O = Y + v, y = O - Y, D = Y - (O - y) + (v - y), v = D - $, y = D - v, Xt[1] = D - (v + y) + (y - $), V = O + v, y = V - O, Xt[2] = O - (V - y) + (v - y), Xt[3] = V, c = lt(
    lt(
      lt(
        F(F(4, Tt, G, z), z, G, J),
        J,
        F(F(4, Tt, Q, z), z, Q, nt),
        nt,
        et
      ),
      et,
      lt(
        F(F(4, Nt, W, z), z, W, J),
        J,
        F(F(4, Nt, Z, z), z, Z, nt),
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
  let st = Bn(c, Ut), ft = ei * h;
  if (st >= ft || -st >= ft || (y = n - G, l = n - (G + y) + (y - s), y = t - Q, g = t - (Q + y) + (y - a), y = e - W, f = e - (W + y) + (y - s), y = i - Z, _ = i - (Z + y) + (y - a), y = o - K, u = o - (K + y) + (y - s), y = r - H, w = r - (H + y) + (y - a), l === 0 && f === 0 && u === 0 && g === 0 && _ === 0 && w === 0) || (ft = ni * h + In * Math.abs(st), st += (G * G + Q * Q) * (W * w + H * f - (Z * u + K * _)) + 2 * (G * l + Q * g) * (W * H - Z * K) + ((W * W + Z * Z) * (K * g + Q * u - (H * l + G * w)) + 2 * (W * f + Z * _) * (K * Q - H * G)) + ((K * K + H * H) * (G * _ + Z * l - (Q * f + W * g)) + 2 * (K * u + H * w) * (G * Z - Q * W)), st >= ft || -st >= ft))
    return st;
  if ((f !== 0 || _ !== 0 || u !== 0 || w !== 0) && (Y = G * G, S = U * G, M = S - (S - G), T = G - M, j = T * T - (Y - M * M - (M + M) * T), $ = Q * Q, S = U * Q, M = S - (S - Q), T = Q - M, q = T * T - ($ - M * M - (M + M) * T), v = j + q, y = v - j, Mt[0] = j - (v - y) + (q - y), O = Y + v, y = O - Y, D = Y - (O - y) + (v - y), v = D + $, y = v - D, Mt[1] = D - (v - y) + ($ - y), V = O + v, y = V - O, Mt[2] = O - (V - y) + (v - y), Mt[3] = V), (u !== 0 || w !== 0 || l !== 0 || g !== 0) && (Y = W * W, S = U * W, M = S - (S - W), T = W - M, j = T * T - (Y - M * M - (M + M) * T), $ = Z * Z, S = U * Z, M = S - (S - Z), T = Z - M, q = T * T - ($ - M * M - (M + M) * T), v = j + q, y = v - j, kt[0] = j - (v - y) + (q - y), O = Y + v, y = O - Y, D = Y - (O - y) + (v - y), v = D + $, y = v - D, kt[1] = D - (v - y) + ($ - y), V = O + v, y = V - O, kt[2] = O - (V - y) + (v - y), kt[3] = V), (l !== 0 || g !== 0 || f !== 0 || _ !== 0) && (Y = K * K, S = U * K, M = S - (S - K), T = K - M, j = T * T - (Y - M * M - (M + M) * T), $ = H * H, S = U * H, M = S - (S - H), T = H - M, q = T * T - ($ - M * M - (M + M) * T), v = j + q, y = v - j, St[0] = j - (v - y) + (q - y), O = Y + v, y = O - Y, D = Y - (O - y) + (v - y), v = D + $, y = v - D, St[1] = D - (v - y) + ($ - y), V = O + v, y = V - O, St[2] = O - (V - y) + (v - y), St[3] = V), l !== 0 && (E = F(4, Tt, l, _e), c = ct(c, bt(
    F(E, _e, 2 * G, J),
    J,
    F(F(4, St, l, z), z, Z, nt),
    nt,
    F(F(4, kt, l, z), z, -H, it),
    it,
    et,
    at
  ), at)), g !== 0 && (k = F(4, Tt, g, Me), c = ct(c, bt(
    F(k, Me, 2 * Q, J),
    J,
    F(F(4, kt, g, z), z, K, nt),
    nt,
    F(F(4, St, g, z), z, -W, it),
    it,
    et,
    at
  ), at)), f !== 0 && (p = F(4, Nt, f, ke), c = ct(c, bt(
    F(p, ke, 2 * W, J),
    J,
    F(F(4, Mt, f, z), z, H, nt),
    nt,
    F(F(4, St, f, z), z, -Q, it),
    it,
    et,
    at
  ), at)), _ !== 0 && (b = F(4, Nt, _, Se), c = ct(c, bt(
    F(b, Se, 2 * Z, J),
    J,
    F(F(4, St, _, z), z, G, nt),
    nt,
    F(F(4, Mt, _, z), z, -K, it),
    it,
    et,
    at
  ), at)), u !== 0 && (d = F(4, Xt, u, Ee), c = ct(c, bt(
    F(d, Ee, 2 * K, J),
    J,
    F(F(4, kt, u, z), z, Q, nt),
    nt,
    F(F(4, Mt, u, z), z, -Z, it),
    it,
    et,
    at
  ), at)), w !== 0 && (x = F(4, Xt, w, Ae), c = ct(c, bt(
    F(x, Ae, 2 * H, J),
    J,
    F(F(4, Mt, w, z), z, W, nt),
    nt,
    F(F(4, kt, w, z), z, -G, it),
    it,
    et,
    at
  ), at)), l !== 0 || g !== 0) {
    if (f !== 0 || _ !== 0 || u !== 0 || w !== 0 ? (Y = f * H, S = U * f, M = S - (S - f), T = f - M, S = U * H, C = S - (S - H), R = H - C, j = T * R - (Y - M * C - T * C - M * R), $ = W * w, S = U * W, M = S - (S - W), T = W - M, S = U * w, C = S - (S - w), R = w - C, q = T * R - ($ - M * C - T * C - M * R), v = j + q, y = v - j, gt[0] = j - (v - y) + (q - y), O = Y + v, y = O - Y, D = Y - (O - y) + (v - y), v = D + $, y = v - D, gt[1] = D - (v - y) + ($ - y), V = O + v, y = V - O, gt[2] = O - (V - y) + (v - y), gt[3] = V, Y = u * -Z, S = U * u, M = S - (S - u), T = u - M, S = U * -Z, C = S - (S - -Z), R = -Z - C, j = T * R - (Y - M * C - T * C - M * R), $ = K * -_, S = U * K, M = S - (S - K), T = K - M, S = U * -_, C = S - (S - -_), R = -_ - C, q = T * R - ($ - M * C - T * C - M * R), v = j + q, y = v - j, mt[0] = j - (v - y) + (q - y), O = Y + v, y = O - Y, D = Y - (O - y) + (v - y), v = D + $, y = v - D, mt[1] = D - (v - y) + ($ - y), V = O + v, y = V - O, mt[2] = O - (V - y) + (v - y), mt[3] = V, A = lt(4, gt, 4, mt, se), Y = f * w, S = U * f, M = S - (S - f), T = f - M, S = U * w, C = S - (S - w), R = w - C, j = T * R - (Y - M * C - T * C - M * R), $ = u * _, S = U * u, M = S - (S - u), T = u - M, S = U * _, C = S - (S - _), R = _ - C, q = T * R - ($ - M * C - T * C - M * R), v = j - q, y = j - v, Ft[0] = j - (v + y) + (y - q), O = Y + v, y = O - Y, D = Y - (O - y) + (v - y), v = D - $, y = D - v, Ft[1] = D - (v + y) + (y - $), V = O + v, y = V - O, Ft[2] = O - (V - y) + (v - y), Ft[3] = V, I = 4) : (se[0] = 0, A = 1, Ft[0] = 0, I = 1), l !== 0) {
      const rt = F(A, se, l, it);
      c = ct(c, lt(
        F(E, _e, l, J),
        J,
        F(rt, it, 2 * G, et),
        et,
        at
      ), at);
      const ot = F(I, Ft, l, z);
      c = ct(c, bt(
        F(ot, z, 2 * G, J),
        J,
        F(ot, z, l, nt),
        nt,
        F(rt, it, l, et),
        et,
        Ct,
        yt
      ), yt), _ !== 0 && (c = ct(c, F(F(4, St, l, z), z, _, J), J)), w !== 0 && (c = ct(c, F(F(4, kt, -l, z), z, w, J), J));
    }
    if (g !== 0) {
      const rt = F(A, se, g, it);
      c = ct(c, lt(
        F(k, Me, g, J),
        J,
        F(rt, it, 2 * Q, et),
        et,
        at
      ), at);
      const ot = F(I, Ft, g, z);
      c = ct(c, bt(
        F(ot, z, 2 * Q, J),
        J,
        F(ot, z, g, nt),
        nt,
        F(rt, it, g, et),
        et,
        Ct,
        yt
      ), yt);
    }
  }
  if (f !== 0 || _ !== 0) {
    if (u !== 0 || w !== 0 || l !== 0 || g !== 0 ? (Y = u * Q, S = U * u, M = S - (S - u), T = u - M, S = U * Q, C = S - (S - Q), R = Q - C, j = T * R - (Y - M * C - T * C - M * R), $ = K * g, S = U * K, M = S - (S - K), T = K - M, S = U * g, C = S - (S - g), R = g - C, q = T * R - ($ - M * C - T * C - M * R), v = j + q, y = v - j, gt[0] = j - (v - y) + (q - y), O = Y + v, y = O - Y, D = Y - (O - y) + (v - y), v = D + $, y = v - D, gt[1] = D - (v - y) + ($ - y), V = O + v, y = V - O, gt[2] = O - (V - y) + (v - y), gt[3] = V, X = -H, L = -w, Y = l * X, S = U * l, M = S - (S - l), T = l - M, S = U * X, C = S - (S - X), R = X - C, j = T * R - (Y - M * C - T * C - M * R), $ = G * L, S = U * G, M = S - (S - G), T = G - M, S = U * L, C = S - (S - L), R = L - C, q = T * R - ($ - M * C - T * C - M * R), v = j + q, y = v - j, mt[0] = j - (v - y) + (q - y), O = Y + v, y = O - Y, D = Y - (O - y) + (v - y), v = D + $, y = v - D, mt[1] = D - (v - y) + ($ - y), V = O + v, y = V - O, mt[2] = O - (V - y) + (v - y), mt[3] = V, B = lt(4, gt, 4, mt, ae), Y = u * g, S = U * u, M = S - (S - u), T = u - M, S = U * g, C = S - (S - g), R = g - C, j = T * R - (Y - M * C - T * C - M * R), $ = l * w, S = U * l, M = S - (S - l), T = l - M, S = U * w, C = S - (S - w), R = w - C, q = T * R - ($ - M * C - T * C - M * R), v = j - q, y = j - v, Lt[0] = j - (v + y) + (y - q), O = Y + v, y = O - Y, D = Y - (O - y) + (v - y), v = D - $, y = D - v, Lt[1] = D - (v + y) + (y - $), V = O + v, y = V - O, Lt[2] = O - (V - y) + (v - y), Lt[3] = V, N = 4) : (ae[0] = 0, B = 1, Lt[0] = 0, N = 1), f !== 0) {
      const rt = F(B, ae, f, it);
      c = ct(c, lt(
        F(p, ke, f, J),
        J,
        F(rt, it, 2 * W, et),
        et,
        at
      ), at);
      const ot = F(N, Lt, f, z);
      c = ct(c, bt(
        F(ot, z, 2 * W, J),
        J,
        F(ot, z, f, nt),
        nt,
        F(rt, it, f, et),
        et,
        Ct,
        yt
      ), yt), w !== 0 && (c = ct(c, F(F(4, Mt, f, z), z, w, J), J)), g !== 0 && (c = ct(c, F(F(4, St, -f, z), z, g, J), J));
    }
    if (_ !== 0) {
      const rt = F(B, ae, _, it);
      c = ct(c, lt(
        F(b, Se, _, J),
        J,
        F(rt, it, 2 * Z, et),
        et,
        at
      ), at);
      const ot = F(N, Lt, _, z);
      c = ct(c, bt(
        F(ot, z, 2 * Z, J),
        J,
        F(ot, z, _, nt),
        nt,
        F(rt, it, _, et),
        et,
        Ct,
        yt
      ), yt);
    }
  }
  if (u !== 0 || w !== 0) {
    if (l !== 0 || g !== 0 || f !== 0 || _ !== 0 ? (Y = l * Z, S = U * l, M = S - (S - l), T = l - M, S = U * Z, C = S - (S - Z), R = Z - C, j = T * R - (Y - M * C - T * C - M * R), $ = G * _, S = U * G, M = S - (S - G), T = G - M, S = U * _, C = S - (S - _), R = _ - C, q = T * R - ($ - M * C - T * C - M * R), v = j + q, y = v - j, gt[0] = j - (v - y) + (q - y), O = Y + v, y = O - Y, D = Y - (O - y) + (v - y), v = D + $, y = v - D, gt[1] = D - (v - y) + ($ - y), V = O + v, y = V - O, gt[2] = O - (V - y) + (v - y), gt[3] = V, X = -Q, L = -g, Y = f * X, S = U * f, M = S - (S - f), T = f - M, S = U * X, C = S - (S - X), R = X - C, j = T * R - (Y - M * C - T * C - M * R), $ = W * L, S = U * W, M = S - (S - W), T = W - M, S = U * L, C = S - (S - L), R = L - C, q = T * R - ($ - M * C - T * C - M * R), v = j + q, y = v - j, mt[0] = j - (v - y) + (q - y), O = Y + v, y = O - Y, D = Y - (O - y) + (v - y), v = D + $, y = v - D, mt[1] = D - (v - y) + ($ - y), V = O + v, y = V - O, mt[2] = O - (V - y) + (v - y), mt[3] = V, m = lt(4, gt, 4, mt, oe), Y = l * _, S = U * l, M = S - (S - l), T = l - M, S = U * _, C = S - (S - _), R = _ - C, j = T * R - (Y - M * C - T * C - M * R), $ = f * g, S = U * f, M = S - (S - f), T = f - M, S = U * g, C = S - (S - g), R = g - C, q = T * R - ($ - M * C - T * C - M * R), v = j - q, y = j - v, Yt[0] = j - (v + y) + (y - q), O = Y + v, y = O - Y, D = Y - (O - y) + (v - y), v = D - $, y = D - v, Yt[1] = D - (v + y) + (y - $), V = O + v, y = V - O, Yt[2] = O - (V - y) + (v - y), Yt[3] = V, P = 4) : (oe[0] = 0, m = 1, Yt[0] = 0, P = 1), u !== 0) {
      const rt = F(m, oe, u, it);
      c = ct(c, lt(
        F(d, Ee, u, J),
        J,
        F(rt, it, 2 * K, et),
        et,
        at
      ), at);
      const ot = F(P, Yt, u, z);
      c = ct(c, bt(
        F(ot, z, 2 * K, J),
        J,
        F(ot, z, u, nt),
        nt,
        F(rt, it, u, et),
        et,
        Ct,
        yt
      ), yt), g !== 0 && (c = ct(c, F(F(4, kt, u, z), z, g, J), J)), _ !== 0 && (c = ct(c, F(F(4, Mt, -u, z), z, _, J), J));
    }
    if (w !== 0) {
      const rt = F(m, oe, w, it);
      c = ct(c, lt(
        F(x, Ae, w, J),
        J,
        F(rt, it, 2 * H, et),
        et,
        at
      ), at);
      const ot = F(P, Yt, w, z);
      c = ct(c, bt(
        F(ot, z, 2 * H, J),
        J,
        F(ot, z, w, nt),
        nt,
        F(rt, it, w, et),
        et,
        Ct,
        yt
      ), yt);
    }
  }
  return Ut[c - 1];
}
function ri(n, t, e, i, o, r, s, a) {
  const h = n - s, c = e - s, l = o - s, f = t - a, u = i - a, g = r - a, _ = c * g, w = l * u, E = h * h + f * f, k = l * f, p = h * g, b = c * c + u * u, d = h * u, x = c * f, m = l * l + g * g, A = E * (_ - w) + b * (k - p) + m * (d - x), B = (Math.abs(_) + Math.abs(w)) * E + (Math.abs(k) + Math.abs(p)) * b + (Math.abs(d) + Math.abs(x)) * m, P = ti * B;
  return A > P || -A > P ? A : ii(n, t, e, i, o, r, s, a, B);
}
function oi(n, t) {
  var e, i, o = 0, r, s, a, h, c, l, f, u = n[0], g = n[1], _ = t.length;
  for (e = 0; e < _; e++) {
    i = 0;
    var w = t[e], E = w.length - 1;
    if (l = w[0], l[0] !== w[E][0] && l[1] !== w[E][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (s = l[0] - u, a = l[1] - g, i; i < E; i++) {
      if (f = w[i + 1], h = f[0] - u, c = f[1] - g, a === 0 && c === 0) {
        if (h <= 0 && s >= 0 || s <= 0 && h >= 0)
          return 0;
      } else if (c >= 0 && a <= 0 || c <= 0 && a >= 0) {
        if (r = At(s, h, a, c, 0, 0), r === 0)
          return 0;
        (r > 0 && c > 0 && a <= 0 || r < 0 && c <= 0 && a > 0) && o++;
      }
      l = f, a = c, s = h;
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
  let h = !1;
  for (var c = 0; c < a.length; ++c) {
    const l = oi(i, a[c]);
    if (l === 0) return !e.ignoreBoundary;
    l && (h = !0);
  }
  return h;
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
      const h = s + 1;
      if (h < this.length && i(e[h], a) < 0 && (s = h, a = e[h]), i(a, r) >= 0) break;
      e[t] = a, t = s;
    }
    e[t] = r;
  }
};
function ai(n, t) {
  return n < t ? -1 : n > t ? 1 : 0;
}
function Tn(n, t) {
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
function hi(n, t) {
  if (n.type === "FeatureCollection") {
    const e = n.features;
    for (let i = 0; i < e.length; i++)
      Qe(e[i], t);
  } else
    Qe(n, t);
}
let ce = 0, he = 0, fe = 0;
function Qe(n, t) {
  const e = n.type === "Feature" ? n.geometry : n;
  let i = e.coordinates;
  (e.type === "Polygon" || e.type === "MultiLineString") && (i = [i]), e.type === "LineString" && (i = [[i]]);
  for (let o = 0; o < i.length; o++)
    for (let r = 0; r < i[o].length; r++) {
      let s = i[o][r][0], a = null;
      he = he + 1;
      for (let h = 0; h < i[o][r].length - 1; h++) {
        a = i[o][r][h + 1];
        const c = new Ke(s, ce, he, fe), l = new Ke(a, ce, he, fe + 1);
        c.otherEvent = l, l.otherEvent = c, Tn(c, l) > 0 ? (l.isLeftEndpoint = !0, c.isLeftEndpoint = !1) : (c.isLeftEndpoint = !0, l.isLeftEndpoint = !1), t.push(c), t.push(l), s = a, fe = fe + 1;
      }
    }
  ce = ce + 1;
}
class fi {
  constructor(t) {
    this.leftSweepEvent = t, this.rightSweepEvent = t.otherEvent;
  }
}
function li(n, t) {
  if (n === null || t === null || n.leftSweepEvent.ringId === t.leftSweepEvent.ringId && (n.rightSweepEvent.isSamePoint(t.leftSweepEvent) || n.rightSweepEvent.isSamePoint(t.leftSweepEvent) || n.rightSweepEvent.isSamePoint(t.rightSweepEvent) || n.leftSweepEvent.isSamePoint(t.leftSweepEvent) || n.leftSweepEvent.isSamePoint(t.rightSweepEvent))) return !1;
  const e = n.leftSweepEvent.p.x, i = n.leftSweepEvent.p.y, o = n.rightSweepEvent.p.x, r = n.rightSweepEvent.p.y, s = t.leftSweepEvent.p.x, a = t.leftSweepEvent.p.y, h = t.rightSweepEvent.p.x, c = t.rightSweepEvent.p.y, l = (c - a) * (o - e) - (h - s) * (r - i), f = (h - s) * (i - a) - (c - a) * (e - s), u = (o - e) * (i - a) - (r - i) * (e - s);
  if (l === 0)
    return !1;
  const g = f / l, _ = u / l;
  if (g >= 0 && g <= 1 && _ >= 0 && _ <= 1) {
    const w = e + g * (o - e), E = i + g * (r - i);
    return [w, E];
  }
  return !1;
}
function ui(n, t) {
  t = t || !1;
  const e = [], i = new On([], ci);
  for (; n.length; ) {
    const o = n.pop();
    if (o.isLeftEndpoint) {
      const r = new fi(o);
      for (let s = 0; s < i.data.length; s++) {
        const a = i.data[s];
        if (t && a.leftSweepEvent.featureId === o.featureId)
          continue;
        const h = li(r, a);
        h !== !1 && e.push(h);
      }
      i.push(r);
    } else o.isLeftEndpoint === !1 && i.pop();
  }
  return e;
}
function di(n, t) {
  const e = new On([], Tn);
  return hi(n, e), ui(e, t);
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
    const h = {};
    s.forEach((c) => {
      const l = c.join(",");
      h[l] || (h[l] = !0, a.push(c));
    });
  } else
    a = s;
  return _t(a.map((h) => Rt(h)));
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
      function e(p, b, d, x, m) {
        (function A(B, P, I, N, X) {
          for (; N > I; ) {
            if (N - I > 600) {
              var L = N - I + 1, y = P - I + 1, S = Math.log(L), M = 0.5 * Math.exp(2 * S / 3), T = 0.5 * Math.sqrt(S * M * (L - M) / L) * (y - L / 2 < 0 ? -1 : 1), C = Math.max(I, Math.floor(P - y * M / L + T)), R = Math.min(N, Math.floor(P + (L - y) * M / L + T));
              A(B, P, C, R, X);
            }
            var v = B[P], O = I, D = N;
            for (i(B, I, P), X(B[N], v) > 0 && i(B, I, N); O < D; ) {
              for (i(B, O, D), O++, D--; X(B[O], v) < 0; ) O++;
              for (; X(B[D], v) > 0; ) D--;
            }
            X(B[I], v) === 0 ? i(B, I, D) : i(B, ++D, N), D <= P && (I = D + 1), P <= D && (N = D - 1);
          }
        })(p, b, d || 0, x || p.length - 1, m || o);
      }
      function i(p, b, d) {
        var x = p[b];
        p[b] = p[d], p[d] = x;
      }
      function o(p, b) {
        return p < b ? -1 : p > b ? 1 : 0;
      }
      var r = function(p) {
        p === void 0 && (p = 9), this._maxEntries = Math.max(4, p), this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries)), this.clear();
      };
      function s(p, b, d) {
        if (!d) return b.indexOf(p);
        for (var x = 0; x < b.length; x++) if (d(p, b[x])) return x;
        return -1;
      }
      function a(p, b) {
        h(p, 0, p.children.length, b, p);
      }
      function h(p, b, d, x, m) {
        m || (m = E(null)), m.minX = 1 / 0, m.minY = 1 / 0, m.maxX = -1 / 0, m.maxY = -1 / 0;
        for (var A = b; A < d; A++) {
          var B = p.children[A];
          c(m, p.leaf ? x(B) : B);
        }
        return m;
      }
      function c(p, b) {
        return p.minX = Math.min(p.minX, b.minX), p.minY = Math.min(p.minY, b.minY), p.maxX = Math.max(p.maxX, b.maxX), p.maxY = Math.max(p.maxY, b.maxY), p;
      }
      function l(p, b) {
        return p.minX - b.minX;
      }
      function f(p, b) {
        return p.minY - b.minY;
      }
      function u(p) {
        return (p.maxX - p.minX) * (p.maxY - p.minY);
      }
      function g(p) {
        return p.maxX - p.minX + (p.maxY - p.minY);
      }
      function _(p, b) {
        return p.minX <= b.minX && p.minY <= b.minY && b.maxX <= p.maxX && b.maxY <= p.maxY;
      }
      function w(p, b) {
        return b.minX <= p.maxX && b.minY <= p.maxY && b.maxX >= p.minX && b.maxY >= p.minY;
      }
      function E(p) {
        return { children: p, height: 1, leaf: !0, minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
      }
      function k(p, b, d, x, m) {
        for (var A = [b, d]; A.length; ) if (!((d = A.pop()) - (b = A.pop()) <= x)) {
          var B = b + Math.ceil((d - b) / x / 2) * x;
          e(p, B, b, d, m), A.push(b, B, B, d);
        }
      }
      return r.prototype.all = function() {
        return this._all(this.data, []);
      }, r.prototype.search = function(p) {
        var b = this.data, d = [];
        if (!w(p, b)) return d;
        for (var x = this.toBBox, m = []; b; ) {
          for (var A = 0; A < b.children.length; A++) {
            var B = b.children[A], P = b.leaf ? x(B) : B;
            w(p, P) && (b.leaf ? d.push(B) : _(p, P) ? this._all(B, d) : m.push(B));
          }
          b = m.pop();
        }
        return d;
      }, r.prototype.collides = function(p) {
        var b = this.data;
        if (!w(p, b)) return !1;
        for (var d = []; b; ) {
          for (var x = 0; x < b.children.length; x++) {
            var m = b.children[x], A = b.leaf ? this.toBBox(m) : m;
            if (w(p, A)) {
              if (b.leaf || _(p, A)) return !0;
              d.push(m);
            }
          }
          b = d.pop();
        }
        return !1;
      }, r.prototype.load = function(p) {
        if (!p || !p.length) return this;
        if (p.length < this._minEntries) {
          for (var b = 0; b < p.length; b++) this.insert(p[b]);
          return this;
        }
        var d = this._build(p.slice(), 0, p.length - 1, 0);
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
      }, r.prototype.insert = function(p) {
        return p && this._insert(p, this.data.height - 1), this;
      }, r.prototype.clear = function() {
        return this.data = E([]), this;
      }, r.prototype.remove = function(p, b) {
        if (!p) return this;
        for (var d, x, m, A = this.data, B = this.toBBox(p), P = [], I = []; A || P.length; ) {
          if (A || (A = P.pop(), x = P[P.length - 1], d = I.pop(), m = !0), A.leaf) {
            var N = s(p, A.children, b);
            if (N !== -1) return A.children.splice(N, 1), P.push(A), this._condense(P), this;
          }
          m || A.leaf || !_(A, B) ? x ? (d++, A = x.children[d], m = !1) : A = null : (P.push(A), I.push(d), d = 0, x = A, A = A.children[0]);
        }
        return this;
      }, r.prototype.toBBox = function(p) {
        return p;
      }, r.prototype.compareMinX = function(p, b) {
        return p.minX - b.minX;
      }, r.prototype.compareMinY = function(p, b) {
        return p.minY - b.minY;
      }, r.prototype.toJSON = function() {
        return this.data;
      }, r.prototype.fromJSON = function(p) {
        return this.data = p, this;
      }, r.prototype._all = function(p, b) {
        for (var d = []; p; ) p.leaf ? b.push.apply(b, p.children) : d.push.apply(d, p.children), p = d.pop();
        return b;
      }, r.prototype._build = function(p, b, d, x) {
        var m, A = d - b + 1, B = this._maxEntries;
        if (A <= B) return a(m = E(p.slice(b, d + 1)), this.toBBox), m;
        x || (x = Math.ceil(Math.log(A) / Math.log(B)), B = Math.ceil(A / Math.pow(B, x - 1))), (m = E([])).leaf = !1, m.height = x;
        var P = Math.ceil(A / B), I = P * Math.ceil(Math.sqrt(B));
        k(p, b, d, I, this.compareMinX);
        for (var N = b; N <= d; N += I) {
          var X = Math.min(N + I - 1, d);
          k(p, N, X, P, this.compareMinY);
          for (var L = N; L <= X; L += P) {
            var y = Math.min(L + P - 1, X);
            m.children.push(this._build(p, L, y, x - 1));
          }
        }
        return a(m, this.toBBox), m;
      }, r.prototype._chooseSubtree = function(p, b, d, x) {
        for (; x.push(b), !b.leaf && x.length - 1 !== d; ) {
          for (var m = 1 / 0, A = 1 / 0, B = void 0, P = 0; P < b.children.length; P++) {
            var I = b.children[P], N = u(I), X = (L = p, y = I, (Math.max(y.maxX, L.maxX) - Math.min(y.minX, L.minX)) * (Math.max(y.maxY, L.maxY) - Math.min(y.minY, L.minY)) - N);
            X < A ? (A = X, m = N < m ? N : m, B = I) : X === A && N < m && (m = N, B = I);
          }
          b = B || b.children[0];
        }
        var L, y;
        return b;
      }, r.prototype._insert = function(p, b, d) {
        var x = d ? p : this.toBBox(p), m = [], A = this._chooseSubtree(x, this.data, b, m);
        for (A.children.push(p), c(A, x); b >= 0 && m[b].children.length > this._maxEntries; ) this._split(m, b), b--;
        this._adjustParentBBoxes(x, m, b);
      }, r.prototype._split = function(p, b) {
        var d = p[b], x = d.children.length, m = this._minEntries;
        this._chooseSplitAxis(d, m, x);
        var A = this._chooseSplitIndex(d, m, x), B = E(d.children.splice(A, d.children.length - A));
        B.height = d.height, B.leaf = d.leaf, a(d, this.toBBox), a(B, this.toBBox), b ? p[b - 1].children.push(B) : this._splitRoot(d, B);
      }, r.prototype._splitRoot = function(p, b) {
        this.data = E([p, b]), this.data.height = p.height + 1, this.data.leaf = !1, a(this.data, this.toBBox);
      }, r.prototype._chooseSplitIndex = function(p, b, d) {
        for (var x, m, A, B, P, I, N, X = 1 / 0, L = 1 / 0, y = b; y <= d - b; y++) {
          var S = h(p, 0, y, this.toBBox), M = h(p, y, d, this.toBBox), T = (m = S, A = M, B = void 0, P = void 0, I = void 0, N = void 0, B = Math.max(m.minX, A.minX), P = Math.max(m.minY, A.minY), I = Math.min(m.maxX, A.maxX), N = Math.min(m.maxY, A.maxY), Math.max(0, I - B) * Math.max(0, N - P)), C = u(S) + u(M);
          T < X ? (X = T, x = y, L = C < L ? C : L) : T === X && C < L && (L = C, x = y);
        }
        return x || d - b;
      }, r.prototype._chooseSplitAxis = function(p, b, d) {
        var x = p.leaf ? this.compareMinX : l, m = p.leaf ? this.compareMinY : f;
        this._allDistMargin(p, b, d, x) < this._allDistMargin(p, b, d, m) && p.children.sort(x);
      }, r.prototype._allDistMargin = function(p, b, d, x) {
        p.children.sort(x);
        for (var m = this.toBBox, A = h(p, 0, b, m), B = h(p, d - b, d, m), P = g(A) + g(B), I = b; I < d - b; I++) {
          var N = p.children[I];
          c(A, p.leaf ? m(N) : N), P += g(A);
        }
        for (var X = d - b - 1; X >= b; X--) {
          var L = p.children[X];
          c(B, p.leaf ? m(L) : L), P += g(B);
        }
        return P;
      }, r.prototype._adjustParentBBoxes = function(p, b, d) {
        for (var x = d; x >= 0; x--) c(b[x], p);
      }, r.prototype._condense = function(p) {
        for (var b = p.length - 1, d = void 0; b >= 0; b--) p[b].children.length === 0 ? b > 0 ? (d = p[b - 1].children).splice(d.indexOf(p[b]), 1) : this.clear() : a(p[b], this.toBBox);
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
      const h = s + 1;
      if (h < this.length && i(e[h], a) < 0 && (s = h, a = e[h]), i(a, r) >= 0) break;
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
    for (var h = (o - i) / 2, c = 0, l = h - 1; c < h; l = c++) {
      var f = e[i + c * 2 + 0], u = e[i + c * 2 + 1], g = e[i + l * 2 + 0], _ = e[i + l * 2 + 1], w = u > s != _ > s && r < (g - f) * (s - u) / (_ - u) + f;
      w && (a = !a);
    }
    return a;
  }), Be;
}
var Oe, tn;
function Ei() {
  return tn || (tn = 1, Oe = function(t, e, i, o) {
    var r = t[0], s = t[1], a = !1;
    i === void 0 && (i = 0), o === void 0 && (o = e.length);
    for (var h = o - i, c = 0, l = h - 1; c < h; l = c++) {
      var f = e[c + i][0], u = e[c + i][1], g = e[l + i][0], _ = e[l + i][1], w = u > s != _ > s && r < (g - f) * (s - u) / (_ - u) + f;
      w && (a = !a);
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
      function r(w, E, k, p, b) {
        let d, x, m, A, B = E[0], P = p[0], I = 0, N = 0;
        P > B == P > -B ? (d = B, B = E[++I]) : (d = P, P = p[++N]);
        let X = 0;
        if (I < w && N < k) for (P > B == P > -B ? (m = d - ((x = B + d) - B), B = E[++I]) : (m = d - ((x = P + d) - P), P = p[++N]), d = x, m !== 0 && (b[X++] = m); I < w && N < k; ) P > B == P > -B ? (m = d - ((x = d + B) - (A = x - d)) + (B - A), B = E[++I]) : (m = d - ((x = d + P) - (A = x - d)) + (P - A), P = p[++N]), d = x, m !== 0 && (b[X++] = m);
        for (; I < w; ) m = d - ((x = d + B) - (A = x - d)) + (B - A), B = E[++I], d = x, m !== 0 && (b[X++] = m);
        for (; N < k; ) m = d - ((x = d + P) - (A = x - d)) + (P - A), P = p[++N], d = x, m !== 0 && (b[X++] = m);
        return d === 0 && X !== 0 || (b[X++] = d), X;
      }
      function s(w) {
        return new Float64Array(w);
      }
      const a = 33306690738754716e-32, h = 22204460492503146e-32, c = 11093356479670487e-47, l = s(4), f = s(8), u = s(12), g = s(16), _ = s(4);
      e.orient2d = function(w, E, k, p, b, d) {
        const x = (E - d) * (k - b), m = (w - b) * (p - d), A = x - m;
        if (x === 0 || m === 0 || x > 0 != m > 0) return A;
        const B = Math.abs(x + m);
        return Math.abs(A) >= a * B ? A : -(function(P, I, N, X, L, y, S) {
          let M, T, C, R, v, O, D, Y, j, $, q, V, G, W, K, Q, Z, H;
          const st = P - L, ft = N - L, rt = I - y, ot = X - y;
          v = (K = (Y = st - (D = (O = 134217729 * st) - (O - st))) * ($ = ot - (j = (O = 134217729 * ot) - (O - ot))) - ((W = st * ot) - D * j - Y * j - D * $)) - (q = K - (Z = (Y = rt - (D = (O = 134217729 * rt) - (O - rt))) * ($ = ft - (j = (O = 134217729 * ft) - (O - ft))) - ((Q = rt * ft) - D * j - Y * j - D * $))), l[0] = K - (q + v) + (v - Z), v = (G = W - ((V = W + q) - (v = V - W)) + (q - v)) - (q = G - Q), l[1] = G - (q + v) + (v - Q), v = (H = V + q) - V, l[2] = V - (H - v) + (q - v), l[3] = H;
          let Ot = (function(Wn, Ve) {
            let qe = Ve[0];
            for (let xe = 1; xe < Wn; xe++) qe += Ve[xe];
            return qe;
          })(4, l), Wt = h * S;
          if (Ot >= Wt || -Ot >= Wt || (M = P - (st + (v = P - st)) + (v - L), C = N - (ft + (v = N - ft)) + (v - L), T = I - (rt + (v = I - rt)) + (v - y), R = X - (ot + (v = X - ot)) + (v - y), M === 0 && T === 0 && C === 0 && R === 0) || (Wt = c * S + o * Math.abs(Ot), (Ot += st * R + ot * M - (rt * C + ft * T)) >= Wt || -Ot >= Wt)) return Ot;
          v = (K = (Y = M - (D = (O = 134217729 * M) - (O - M))) * ($ = ot - (j = (O = 134217729 * ot) - (O - ot))) - ((W = M * ot) - D * j - Y * j - D * $)) - (q = K - (Z = (Y = T - (D = (O = 134217729 * T) - (O - T))) * ($ = ft - (j = (O = 134217729 * ft) - (O - ft))) - ((Q = T * ft) - D * j - Y * j - D * $))), _[0] = K - (q + v) + (v - Z), v = (G = W - ((V = W + q) - (v = V - W)) + (q - v)) - (q = G - Q), _[1] = G - (q + v) + (v - Q), v = (H = V + q) - V, _[2] = V - (H - v) + (q - v), _[3] = H;
          const qn = r(4, l, 4, _, f);
          v = (K = (Y = st - (D = (O = 134217729 * st) - (O - st))) * ($ = R - (j = (O = 134217729 * R) - (O - R))) - ((W = st * R) - D * j - Y * j - D * $)) - (q = K - (Z = (Y = rt - (D = (O = 134217729 * rt) - (O - rt))) * ($ = C - (j = (O = 134217729 * C) - (O - C))) - ((Q = rt * C) - D * j - Y * j - D * $))), _[0] = K - (q + v) + (v - Z), v = (G = W - ((V = W + q) - (v = V - W)) + (q - v)) - (q = G - Q), _[1] = G - (q + v) + (v - Q), v = (H = V + q) - V, _[2] = V - (H - v) + (q - v), _[3] = H;
          const Un = r(qn, f, 4, _, u);
          v = (K = (Y = M - (D = (O = 134217729 * M) - (O - M))) * ($ = R - (j = (O = 134217729 * R) - (O - R))) - ((W = M * R) - D * j - Y * j - D * $)) - (q = K - (Z = (Y = T - (D = (O = 134217729 * T) - (O - T))) * ($ = C - (j = (O = 134217729 * C) - (O - C))) - ((Q = T * C) - D * j - Y * j - D * $))), _[0] = K - (q + v) + (v - Z), v = (G = W - ((V = W + q) - (v = V - W)) + (q - v)) - (q = G - Q), _[1] = G - (q + v) + (v - Q), v = (H = V + q) - V, _[2] = V - (H - v) + (q - v), _[3] = H;
          const zn = r(Un, u, 4, _, g);
          return g[zn - 1];
        })(w, E, k, p, b, d, B);
      }, e.orient2dfast = function(w, E, k, p, b, d) {
        return (E - d) * (k - b) - (w - b) * (p - d);
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
  function o(d, x, m) {
    x = Math.max(0, x === void 0 ? 2 : x), m = m || 0;
    var A = g(d), B = new n(16);
    B.toBBox = function(D) {
      return {
        minX: D[0],
        minY: D[1],
        maxX: D[0],
        maxY: D[1]
      };
    }, B.compareMinX = function(D, Y) {
      return D[0] - Y[0];
    }, B.compareMinY = function(D, Y) {
      return D[1] - Y[1];
    }, B.load(d);
    for (var P = [], I = 0, N; I < A.length; I++) {
      var X = A[I];
      B.remove(X), N = _(X, N), P.push(N);
    }
    var L = new n(16);
    for (I = 0; I < P.length; I++) L.insert(u(P[I]));
    for (var y = x * x, S = m * m; P.length; ) {
      var M = P.shift(), T = M.p, C = M.next.p, R = w(T, C);
      if (!(R < S)) {
        var v = R / y;
        X = r(B, M.prev.p, T, C, M.next.next.p, v, L), X && Math.min(w(X, T), w(X, C)) <= v && (P.push(M), P.push(_(X, M)), B.remove(X), L.remove(M), L.insert(u(M)), L.insert(u(M.next)));
      }
    }
    M = N;
    var O = [];
    do
      O.push(M.p), M = M.next;
    while (M !== N);
    return O.push(M.p), O;
  }
  function r(d, x, m, A, B, P, I) {
    for (var N = new t([], s), X = d.data; X; ) {
      for (var L = 0; L < X.children.length; L++) {
        var y = X.children[L], S = X.leaf ? E(y, m, A) : a(m, A, y);
        S > P || N.push({
          node: y,
          dist: S
        });
      }
      for (; N.length && !N.peek().node.children; ) {
        var M = N.pop(), T = M.node, C = E(T, x, m), R = E(T, A, B);
        if (M.dist < C && M.dist < R && c(m, T, I) && c(A, T, I)) return T;
      }
      X = N.pop(), X && (X = X.node);
    }
    return null;
  }
  function s(d, x) {
    return d.dist - x.dist;
  }
  function a(d, x, m) {
    if (h(d, m) || h(x, m)) return 0;
    var A = k(d[0], d[1], x[0], x[1], m.minX, m.minY, m.maxX, m.minY);
    if (A === 0) return 0;
    var B = k(d[0], d[1], x[0], x[1], m.minX, m.minY, m.minX, m.maxY);
    if (B === 0) return 0;
    var P = k(d[0], d[1], x[0], x[1], m.maxX, m.minY, m.maxX, m.maxY);
    if (P === 0) return 0;
    var I = k(d[0], d[1], x[0], x[1], m.minX, m.maxY, m.maxX, m.maxY);
    return I === 0 ? 0 : Math.min(A, B, P, I);
  }
  function h(d, x) {
    return d[0] >= x.minX && d[0] <= x.maxX && d[1] >= x.minY && d[1] <= x.maxY;
  }
  function c(d, x, m) {
    for (var A = Math.min(d[0], x[0]), B = Math.min(d[1], x[1]), P = Math.max(d[0], x[0]), I = Math.max(d[1], x[1]), N = m.search({ minX: A, minY: B, maxX: P, maxY: I }), X = 0; X < N.length; X++)
      if (f(N[X].p, N[X].next.p, d, x)) return !1;
    return !0;
  }
  function l(d, x, m) {
    return i(d[0], d[1], x[0], x[1], m[0], m[1]);
  }
  function f(d, x, m, A) {
    return d !== A && x !== m && l(d, x, m) > 0 != l(d, x, A) > 0 && l(m, A, d) > 0 != l(m, A, x) > 0;
  }
  function u(d) {
    var x = d.p, m = d.next.p;
    return d.minX = Math.min(x[0], m[0]), d.minY = Math.min(x[1], m[1]), d.maxX = Math.max(x[0], m[0]), d.maxY = Math.max(x[1], m[1]), d;
  }
  function g(d) {
    for (var x = d[0], m = d[0], A = d[0], B = d[0], P = 0; P < d.length; P++) {
      var I = d[P];
      I[0] < x[0] && (x = I), I[0] > A[0] && (A = I), I[1] < m[1] && (m = I), I[1] > B[1] && (B = I);
    }
    var N = [x, m, A, B], X = N.slice();
    for (P = 0; P < d.length; P++)
      e(d[P], N) || X.push(d[P]);
    return b(X);
  }
  function _(d, x) {
    var m = {
      p: d,
      prev: null,
      next: null,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };
    return x ? (m.next = x.next, m.prev = x, x.next.prev = m, x.next = m) : (m.prev = m, m.next = m), m;
  }
  function w(d, x) {
    var m = d[0] - x[0], A = d[1] - x[1];
    return m * m + A * A;
  }
  function E(d, x, m) {
    var A = x[0], B = x[1], P = m[0] - A, I = m[1] - B;
    if (P !== 0 || I !== 0) {
      var N = ((d[0] - A) * P + (d[1] - B) * I) / (P * P + I * I);
      N > 1 ? (A = m[0], B = m[1]) : N > 0 && (A += P * N, B += I * N);
    }
    return P = d[0] - A, I = d[1] - B, P * P + I * I;
  }
  function k(d, x, m, A, B, P, I, N) {
    var X = m - d, L = A - x, y = I - B, S = N - P, M = d - B, T = x - P, C = X * X + L * L, R = X * y + L * S, v = y * y + S * S, O = X * M + L * T, D = y * M + S * T, Y = C * v - R * R, j, $, q, V, G = Y, W = Y;
    Y === 0 ? ($ = 0, G = 1, V = D, W = v) : ($ = R * D - v * O, V = C * D - R * O, $ < 0 ? ($ = 0, V = D, W = v) : $ > G && ($ = G, V = D + R, W = v)), V < 0 ? (V = 0, -O < 0 ? $ = 0 : -O > C ? $ = G : ($ = -O, G = C)) : V > W && (V = W, -O + R < 0 ? $ = 0 : -O + R > C ? $ = G : ($ = -O + R, G = C)), j = $ === 0 ? 0 : $ / G, q = V === 0 ? 0 : V / W;
    var K = (1 - j) * d + j * m, Q = (1 - j) * x + j * A, Z = (1 - q) * B + q * I, H = (1 - q) * P + q * N, st = Z - K, ft = H - Q;
    return st * st + ft * ft;
  }
  function p(d, x) {
    return d[0] === x[0] ? d[1] - x[1] : d[0] - x[0];
  }
  function b(d) {
    d.sort(p);
    for (var x = [], m = 0; m < d.length; m++) {
      for (; x.length >= 2 && l(x[x.length - 2], x[x.length - 1], d[m]) <= 0; )
        x.pop();
      x.push(d[m]);
    }
    for (var A = [], B = d.length - 1; B >= 0; B--) {
      for (; A.length >= 2 && l(A[A.length - 2], A[A.length - 1], d[B]) <= 0; )
        A.pop();
      A.push(d[B]);
    }
    return A.pop(), x.pop(), x.concat(A);
  }
  return le.exports;
}
var Oi = Bi();
const Ti = /* @__PURE__ */ mi(Oi);
function on(n, t = {}) {
  t.concavity = t.concavity || 1 / 0;
  const e = [];
  if (Ye(n, (o) => {
    e.push([o[0], o[1]]);
  }), !e.length)
    return null;
  const i = Ti(e, t.concavity);
  return i.length > 3 ? ie([i]) : null;
}
function Nn(n, t, e = {}) {
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
  return Nn({
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
  return Nn({
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
function Ni(n) {
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
function Te(n, t, e, i, o) {
  let r, s, a, h, c = t[0], l = i[0], f = 0, u = 0;
  l > c == l > -c ? (r = c, c = t[++f]) : (r = l, l = i[++u]);
  let g = 0;
  if (f < n && u < e)
    for (l > c == l > -c ? (s = c + r, a = r - (s - c), c = t[++f]) : (s = l + r, a = r - (s - l), l = i[++u]), r = s, a !== 0 && (o[g++] = a); f < n && u < e; )
      l > c == l > -c ? (s = r + c, h = s - r, a = r - (s - h) + (c - h), c = t[++f]) : (s = r + l, h = s - r, a = r - (s - h) + (l - h), l = i[++u]), r = s, a !== 0 && (o[g++] = a);
  for (; f < n; )
    s = r + c, h = s - r, a = r - (s - h) + (c - h), c = t[++f], r = s, a !== 0 && (o[g++] = a);
  for (; u < e; )
    s = r + l, h = s - r, a = r - (s - h) + (l - h), l = i[++u], r = s, a !== 0 && (o[g++] = a);
  return (r !== 0 || g === 0) && (o[g++] = r), g;
}
function Di(n, t) {
  let e = t[0];
  for (let i = 1; i < n; i++) e += t[i];
  return e;
}
function re(n) {
  return new Float64Array(n);
}
const Ri = (3 + 16 * Bt) * Bt, Yi = (2 + 12 * Bt) * Bt, Fi = (9 + 64 * Bt) * Bt * Bt, Vt = re(4), cn = re(8), hn = re(12), fn = re(16), wt = re(4);
function Li(n, t, e, i, o, r, s) {
  let a, h, c, l, f, u, g, _, w, E, k, p, b, d, x, m, A, B;
  const P = n - o, I = e - o, N = t - r, X = i - r;
  d = P * X, u = ut * P, g = u - (u - P), _ = P - g, u = ut * X, w = u - (u - X), E = X - w, x = _ * E - (d - g * w - _ * w - g * E), m = N * I, u = ut * N, g = u - (u - N), _ = N - g, u = ut * I, w = u - (u - I), E = I - w, A = _ * E - (m - g * w - _ * w - g * E), k = x - A, f = x - k, Vt[0] = x - (k + f) + (f - A), p = d + k, f = p - d, b = d - (p - f) + (k - f), k = b - m, f = b - k, Vt[1] = b - (k + f) + (f - m), B = p + k, f = B - p, Vt[2] = p - (B - f) + (k - f), Vt[3] = B;
  let L = Di(4, Vt), y = Yi * s;
  if (L >= y || -L >= y || (f = n - P, a = n - (P + f) + (f - o), f = e - I, c = e - (I + f) + (f - o), f = t - N, h = t - (N + f) + (f - r), f = i - X, l = i - (X + f) + (f - r), a === 0 && h === 0 && c === 0 && l === 0) || (y = Fi * s + Ci * Math.abs(L), L += P * l + X * a - (N * c + I * h), L >= y || -L >= y)) return L;
  d = a * X, u = ut * a, g = u - (u - a), _ = a - g, u = ut * X, w = u - (u - X), E = X - w, x = _ * E - (d - g * w - _ * w - g * E), m = h * I, u = ut * h, g = u - (u - h), _ = h - g, u = ut * I, w = u - (u - I), E = I - w, A = _ * E - (m - g * w - _ * w - g * E), k = x - A, f = x - k, wt[0] = x - (k + f) + (f - A), p = d + k, f = p - d, b = d - (p - f) + (k - f), k = b - m, f = b - k, wt[1] = b - (k + f) + (f - m), B = p + k, f = B - p, wt[2] = p - (B - f) + (k - f), wt[3] = B;
  const S = Te(4, Vt, 4, wt, cn);
  d = P * l, u = ut * P, g = u - (u - P), _ = P - g, u = ut * l, w = u - (u - l), E = l - w, x = _ * E - (d - g * w - _ * w - g * E), m = N * c, u = ut * N, g = u - (u - N), _ = N - g, u = ut * c, w = u - (u - c), E = c - w, A = _ * E - (m - g * w - _ * w - g * E), k = x - A, f = x - k, wt[0] = x - (k + f) + (f - A), p = d + k, f = p - d, b = d - (p - f) + (k - f), k = b - m, f = b - k, wt[1] = b - (k + f) + (f - m), B = p + k, f = B - p, wt[2] = p - (B - f) + (k - f), wt[3] = B;
  const M = Te(S, cn, 4, wt, hn);
  d = a * l, u = ut * a, g = u - (u - a), _ = a - g, u = ut * l, w = u - (u - l), E = l - w, x = _ * E - (d - g * w - _ * w - g * E), m = h * c, u = ut * h, g = u - (u - h), _ = h - g, u = ut * c, w = u - (u - c), E = c - w, A = _ * E - (m - g * w - _ * w - g * E), k = x - A, f = x - k, wt[0] = x - (k + f) + (f - A), p = d + k, f = p - d, b = d - (p - f) + (k - f), k = b - m, f = b - k, wt[1] = b - (k + f) + (f - m), B = p + k, f = B - p, wt[2] = p - (B - f) + (k - f), wt[3] = B;
  const T = Te(M, hn, 4, wt, fn);
  return fn[T - 1];
}
function ji(n, t, e, i, o, r) {
  const s = (t - r) * (e - o), a = (n - o) * (i - r), h = s - a, c = Math.abs(s + a);
  return Math.abs(h) >= Ri * c ? h : -Li(n, t, e, i, o, r, c);
}
function $i(n, t) {
  var e, i, o = 0, r, s, a, h, c, l, f, u = n[0], g = n[1], _ = t.length;
  for (e = 0; e < _; e++) {
    i = 0;
    var w = t[e], E = w.length - 1;
    if (l = w[0], l[0] !== w[E][0] && l[1] !== w[E][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (s = l[0] - u, a = l[1] - g, i; i < E; i++) {
      if (f = w[i + 1], h = f[0] - u, c = f[1] - g, a === 0 && c === 0) {
        if (h <= 0 && s >= 0 || s <= 0 && h >= 0)
          return 0;
      } else if (c >= 0 && a <= 0 || c <= 0 && a >= 0) {
        if (r = ji(s, h, a, c, 0, 0), r === 0)
          return 0;
        (r > 0 && c > 0 && a <= 0 || r < 0 && c <= 0 && a > 0) && o++;
      }
      l = f, a = c, s = h;
    }
  }
  return o % 2 !== 0;
}
function Ce(n, t, e = {}) {
  if (!n)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const i = Ni(n), o = Xi(t), r = o.type, s = t.bbox;
  let a = o.coordinates;
  if (s && Vi(i, s) === !1)
    return !1;
  r === "Polygon" && (a = [a]);
  let h = !1;
  for (var c = 0; c < a.length; ++c) {
    const l = $i(i, a[c]);
    if (l === 0) return !e.ignoreBoundary;
    l && (h = !0);
  }
  return h;
}
function Vi(n, t) {
  return t[0] <= n[0] && t[1] <= n[1] && t[2] >= n[0] && t[3] >= n[1];
}
function Ne(n, t) {
  for (let e = 0; e < t.features.length; e++)
    if (Ce(n, t.features[e]))
      return t.features[e];
}
function Cn(n, t, e) {
  const i = t.geometry.coordinates[0][0], o = t.geometry.coordinates[0][1], r = t.geometry.coordinates[0][2], s = n.geometry.coordinates, a = t.properties.a.geom, h = t.properties.b.geom, c = t.properties.c.geom, l = [o[0] - i[0], o[1] - i[1]], f = [r[0] - i[0], r[1] - i[1]], u = [s[0] - i[0], s[1] - i[1]], g = [h[0] - a[0], h[1] - a[1]], _ = [c[0] - a[0], c[1] - a[1]];
  let w = (f[1] * u[0] - f[0] * u[1]) / (l[0] * f[1] - l[1] * f[0]), E = (l[0] * u[1] - l[1] * u[0]) / (l[0] * f[1] - l[1] * f[0]);
  if (e) {
    const k = e[t.properties.a.index], p = e[t.properties.b.index], b = e[t.properties.c.index];
    let d;
    if (w < 0 || E < 0 || 1 - w - E < 0) {
      const x = w / (w + E), m = E / (w + E);
      d = w / p / (x / p + m / b), E = E / b / (x / p + m / b);
    } else
      d = w / p / (w / p + E / b + (1 - w - E) / k), E = E / b / (w / p + E / b + (1 - w - E) / k);
    w = d;
  }
  return [
    w * g[0] + E * _[0] + a[0],
    w * g[1] + E * _[1] + a[1]
  ];
}
function qi(n, t, e, i) {
  const o = n.geometry.coordinates, r = e.geometry.coordinates, s = Math.atan2(o[0] - r[0], o[1] - r[1]), a = Ui(s, t[0]);
  if (a === void 0)
    throw new Error("Unable to determine vertex index");
  const h = t[1][a];
  return Cn(n, h.features[0], i);
}
function Qt(n, t, e, i, o, r, s, a) {
  let h;
  if (s && (h = Ne(n, zt([s]))), !h)
    if (e) {
      const c = n.geometry.coordinates, l = e.gridNum, f = e.xOrigin, u = e.yOrigin, g = e.xUnit, _ = e.yUnit, w = e.gridCache, E = Et(c[0], f, g, l), k = Et(c[1], u, _, l), p = w[E] ? w[E][k] ? w[E][k] : [] : [], b = zt(p.map((d) => t.features[d]));
      h = Ne(n, b);
    } else
      h = Ne(n, t);
  return a && a(h), h ? Cn(n, h, r) : qi(n, i, o, r);
}
function Et(n, t, e, i) {
  let o = Math.floor((n - t) / e);
  return o < 0 && (o = 0), o >= i && (o = i - 1), o;
}
function Ui(n, t) {
  let e = ln(n - t[0]), i = Math.PI * 2, o;
  for (let r = 0; r < t.length; r++) {
    const s = (r + 1) % t.length, a = ln(n - t[s]), h = Math.min(Math.abs(e), Math.abs(a));
    e * a <= 0 && h < i && (i = h, o = r), e = a;
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
    (h) => {
      (!s || s < 2.00703) && (h = Rn(h));
      const c = isFinite(h) ? t[h] : h === "c" ? i : (function() {
        const l = h.match(/^b(\d+)$/);
        if (l) return o[parseInt(l[1])];
        const f = h.match(/^e(\d+)$/);
        if (f) return e[parseInt(f[1])];
        throw new Error("Bad index value for indexesToTri");
      })();
      return r ? [[c[1], c[0]], h] : [[c[0], c[1]], h];
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
      const a = o.geometry.coordinates[0][s], h = o.properties[r].geom, c = o.properties[r].index;
      typeof c == "number" && (t[c] = [a, h]);
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
    const a = e.features.map((w) => {
      let E = [];
      return an(w)[0].map((k) => {
        r.length === 0 ? r = [Array.from(k), Array.from(k)] : (k[0] < r[0][0] && (r[0][0] = k[0]), k[0] > r[1][0] && (r[1][0] = k[0]), k[1] < r[0][1] && (r[0][1] = k[1]), k[1] > r[1][1] && (r[1][1] = k[1])), E.length === 0 ? E = [Array.from(k), Array.from(k)] : (k[0] < E[0][0] && (E[0][0] = k[0]), k[0] > E[1][0] && (E[1][0] = k[0]), k[1] < E[0][1] && (E[0][1] = k[1]), k[1] > E[1][1] && (E[1][1] = k[1]));
      }), E;
    }), h = (r[1][0] - r[0][0]) / o, c = (r[1][1] - r[0][1]) / o, l = a.reduce(
      (w, E, k) => {
        const p = Et(E[0][0], r[0][0], h, o), b = Et(E[1][0], r[0][0], h, o), d = Et(E[0][1], r[0][1], c, o), x = Et(E[1][1], r[0][1], c, o);
        for (let m = p; m <= b; m++) {
          w[m] || (w[m] = []);
          for (let A = d; A <= x; A++)
            w[m][A] || (w[m][A] = []), w[m][A].push(k);
        }
        return w;
      },
      []
    ), f = i.features.map((w) => {
      let E = [];
      return an(w)[0].map((k) => {
        s.length === 0 ? s = [Array.from(k), Array.from(k)] : (k[0] < s[0][0] && (s[0][0] = k[0]), k[0] > s[1][0] && (s[1][0] = k[0]), k[1] < s[0][1] && (s[0][1] = k[1]), k[1] > s[1][1] && (s[1][1] = k[1])), E.length === 0 ? E = [Array.from(k), Array.from(k)] : (k[0] < E[0][0] && (E[0][0] = k[0]), k[0] > E[1][0] && (E[1][0] = k[0]), k[1] < E[0][1] && (E[0][1] = k[1]), k[1] > E[1][1] && (E[1][1] = k[1]));
      }), E;
    }), u = (s[1][0] - s[0][0]) / o, g = (s[1][1] - s[0][1]) / o, _ = f.reduce(
      (w, E, k) => {
        const p = Et(E[0][0], s[0][0], u, o), b = Et(E[1][0], s[0][0], u, o), d = Et(E[0][1], s[0][1], g, o), x = Et(E[1][1], s[0][1], g, o);
        for (let m = p; m <= b; m++) {
          w[m] || (w[m] = []);
          for (let A = d; A <= x; A++)
            w[m][A] || (w[m][A] = []), w[m][A].push(k);
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
        xUnit: h,
        yUnit: c,
        gridCache: l
      },
      bakw: {
        gridNum: o,
        xOrigin: s[0][0],
        yOrigin: s[0][1],
        xUnit: u,
        yUnit: g,
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
  transform(t, e, i) {
    if (!this.tins)
      throw new Error("setCompiled() must be called before transform()");
    if (e && this.strict_status == xt.STATUS_ERROR)
      throw new Error('Backward transform is not allowed if strict_status == "strict_error"');
    this.yaxisMode == xt.YAXIS_FOLLOW && e && (t = [t[0], -1 * t[1]]);
    const o = ee(t);
    if (this.bounds && !e && !i && !Ce(o, this.boundsPolygon))
      return !1;
    const r = e ? this.tins.bakw : this.tins.forw, s = e ? this.indexedTins.bakw : this.indexedTins.forw, a = e ? this.vertices_params.bakw : this.vertices_params.forw, h = e ? this.centroid.bakw : this.centroid.forw, c = e ? this.pointsWeightBuffer.bakw : this.pointsWeightBuffer.forw;
    let l, f;
    this.stateFull && (this.stateBackward == e ? l = this.stateTriangle : (this.stateBackward = e, this.stateTriangle = void 0), f = (g) => {
      this.stateTriangle = g;
    });
    let u = Qt(
      o,
      r,
      s,
      a,
      h,
      c,
      l,
      f
    );
    if (this.bounds && e && !i) {
      const g = ee(u);
      if (!Ce(g, this.boundsPolygon)) return !1;
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
  static from(t, e = cr, i = hr) {
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
    let a = 1 / 0, h = 1 / 0, c = -1 / 0, l = -1 / 0;
    for (let P = 0; P < s; P++) {
      const I = t[2 * P], N = t[2 * P + 1];
      I < a && (a = I), N < h && (h = N), I > c && (c = I), N > l && (l = N), this._ids[P] = P;
    }
    const f = (a + c) / 2, u = (h + l) / 2;
    let g = 0, _ = 0, w = 0;
    for (let P = 0, I = 1 / 0; P < s; P++) {
      const N = Xe(f, u, t[2 * P], t[2 * P + 1]);
      N < I && (g = P, I = N);
    }
    const E = t[2 * g], k = t[2 * g + 1];
    for (let P = 0, I = 1 / 0; P < s; P++) {
      if (P === g) continue;
      const N = Xe(E, k, t[2 * P], t[2 * P + 1]);
      N < I && N > 0 && (_ = P, I = N);
    }
    let p = t[2 * _], b = t[2 * _ + 1], d = 1 / 0;
    for (let P = 0; P < s; P++) {
      if (P === g || P === _) continue;
      const I = sr(E, k, p, b, t[2 * P], t[2 * P + 1]);
      I < d && (w = P, d = I);
    }
    let x = t[2 * w], m = t[2 * w + 1];
    if (d === 1 / 0) {
      for (let N = 0; N < s; N++)
        this._dists[N] = t[2 * N] - t[0] || t[2 * N + 1] - t[1];
      qt(this._ids, this._dists, 0, s - 1);
      const P = new Uint32Array(s);
      let I = 0;
      for (let N = 0, X = -1 / 0; N < s; N++) {
        const L = this._ids[N], y = this._dists[L];
        y > X && (P[I++] = L, X = y);
      }
      this.hull = P.subarray(0, I), this.triangles = new Uint32Array(0), this.halfedges = new Int32Array(0);
      return;
    }
    if (At(E, k, p, b, x, m) < 0) {
      const P = _, I = p, N = b;
      _ = w, p = x, b = m, w = P, x = I, m = N;
    }
    const A = ar(E, k, p, b, x, m);
    this._cx = A.x, this._cy = A.y;
    for (let P = 0; P < s; P++)
      this._dists[P] = Xe(t[2 * P], t[2 * P + 1], A.x, A.y);
    qt(this._ids, this._dists, 0, s - 1), this._hullStart = g;
    let B = 3;
    i[g] = e[w] = _, i[_] = e[g] = w, i[w] = e[_] = g, o[g] = 0, o[_] = 1, o[w] = 2, r.fill(-1), r[this._hashKey(E, k)] = g, r[this._hashKey(p, b)] = _, r[this._hashKey(x, m)] = w, this.trianglesLen = 0, this._addTriangle(g, _, w, -1, -1, -1);
    for (let P = 0, I = 0, N = 0; P < this._ids.length; P++) {
      const X = this._ids[P], L = t[2 * X], y = t[2 * X + 1];
      if (P > 0 && Math.abs(L - I) <= gn && Math.abs(y - N) <= gn || (I = L, N = y, X === g || X === _ || X === w)) continue;
      let S = 0;
      for (let v = 0, O = this._hashKey(L, y); v < this._hashSize && (S = r[(O + v) % this._hashSize], !(S !== -1 && S !== i[S])); v++)
        ;
      S = e[S];
      let M = S, T;
      for (; T = i[M], At(L, y, t[2 * M], t[2 * M + 1], t[2 * T], t[2 * T + 1]) >= 0; )
        if (M = T, M === S) {
          M = -1;
          break;
        }
      if (M === -1) continue;
      let C = this._addTriangle(M, X, i[M], -1, -1, o[M]);
      o[X] = this._legalize(C + 2), o[M] = C, B++;
      let R = i[M];
      for (; T = i[R], At(L, y, t[2 * R], t[2 * R + 1], t[2 * T], t[2 * T + 1]) < 0; )
        C = this._addTriangle(R, X, T, o[X], -1, o[R]), o[X] = this._legalize(C + 2), i[R] = R, B--, R = T;
      if (M === S)
        for (; T = e[M], At(L, y, t[2 * T], t[2 * T + 1], t[2 * M], t[2 * M + 1]) < 0; )
          C = this._addTriangle(T, X, M, -1, o[M], o[T]), this._legalize(C + 2), o[T] = C, i[M] = M, B--, M = T;
      this._hullStart = e[X] = M, i[M] = e[R] = X, i[X] = R, r[this._hashKey(L, y)] = X, r[this._hashKey(t[2 * M], t[2 * M + 1])] = M;
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
      const a = i[t], h = t - t % 3;
      if (s = h + (t + 2) % 3, a === -1) {
        if (r === 0) break;
        t = ue[--r];
        continue;
      }
      const c = a - a % 3, l = h + (t + 1) % 3, f = c + (a + 2) % 3, u = e[s], g = e[t], _ = e[l], w = e[f];
      if (or(
        o[2 * u],
        o[2 * u + 1],
        o[2 * g],
        o[2 * g + 1],
        o[2 * _],
        o[2 * _ + 1],
        o[2 * w],
        o[2 * w + 1]
      )) {
        e[t] = w, e[a] = u;
        const k = i[f];
        if (k === -1) {
          let b = this._hullStart;
          do {
            if (this._hullTri[b] === f) {
              this._hullTri[b] = t;
              break;
            }
            b = this._hullPrev[b];
          } while (b !== this._hullStart);
        }
        this._link(t, k), this._link(a, i[s]), this._link(s, f);
        const p = c + (a + 1) % 3;
        r < ue.length && (ue[r++] = p);
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
  const h = n - s, c = t - a, l = e - s, f = i - a, u = o - s, g = r - a, _ = h * h + c * c, w = l * l + f * f, E = u * u + g * g;
  return h * (f * E - w * g) - c * (l * E - w * u) + _ * (l * g - f * u) < 0;
}
function sr(n, t, e, i, o, r) {
  const s = e - n, a = i - t, h = o - n, c = r - t, l = s * s + a * a, f = h * h + c * c, u = 0.5 / (s * c - a * h), g = (c * l - a * f) * u, _ = (s * f - h * l) * u;
  return g * g + _ * _;
}
function ar(n, t, e, i, o, r) {
  const s = e - n, a = i - t, h = o - n, c = r - t, l = s * s + a * a, f = h * h + c * c, u = 0.5 / (s * c - a * h), g = n + (c * l - a * f) * u, _ = t + (s * f - h * l) * u;
  return { x: g, y: _ };
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
    const a = n[r], h = t[a];
    for (; ; ) {
      do
        r++;
      while (t[n[r]] < h);
      do
        s--;
      while (t[n[s]] > h);
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
function hr(n) {
  return n[1];
}
class fr {
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
class mn extends fr {
  constructor(t) {
    super(8, new Uint8Array(Math.ceil(t / 8)).fill(0));
  }
}
function jt(n) {
  return n % 3 === 2 ? n - 2 : n + 1;
}
function Pt(n) {
  return n % 3 === 0 ? n + 2 : n - 1;
}
function wn(n, t, e, i, o, r, s, a) {
  const h = At(n, t, o, r, s, a), c = At(e, i, o, r, s, a);
  if (h > 0 && c > 0 || h < 0 && c < 0)
    return !1;
  const l = At(o, r, n, t, e, i), f = At(s, a, n, t, e, i);
  return l > 0 && f > 0 || l < 0 && f < 0 ? !1 : h === 0 && c === 0 && l === 0 && f === 0 ? !(Math.max(o, s) < Math.min(n, e) || Math.max(n, e) < Math.min(o, s) || Math.max(r, a) < Math.min(t, i) || Math.max(t, i) < Math.min(r, a)) : !0;
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
      const c = i[s], l = jt(s);
      if (c === e)
        return this.protect(s);
      const f = Pt(s), u = i[f];
      if (u === e)
        return this.protect(l), l;
      if (this.intersectSegments(t, e, u, c)) {
        s = f;
        break;
      }
      s = o[l];
    } while (s !== -1 && s !== r);
    let a = s, h = -1;
    for (; s !== -1; ) {
      const c = o[s], l = Pt(s), f = Pt(c), u = jt(c);
      if (c === -1)
        throw new Error("Constraining edge exited the hull");
      if (this.consd.has(s))
        throw new Error("Edge intersects already constrained edge");
      if (this.isCollinear(t, e, i[s]) || this.isCollinear(t, e, i[c]))
        throw new Error("Constraining edge intersects point");
      if (!this.intersectSegments(
        i[s],
        i[c],
        i[l],
        i[f]
      )) {
        if (h === -1 && (h = s), i[f] === e) {
          if (s === h)
            throw new Error("Infinite loop: non-convex quadrilateral");
          s = h, h = -1;
          continue;
        }
        if (this.intersectSegments(
          t,
          e,
          i[f],
          i[c]
        ))
          s = f;
        else if (this.intersectSegments(
          t,
          e,
          i[u],
          i[f]
        ))
          s = u;
        else if (h === s)
          throw new Error("Infinite loop: no further intersect after non-convex");
        continue;
      }
      if (this.flipDiagonal(s), this.intersectSegments(
        t,
        e,
        i[l],
        i[f]
      ) && (h === -1 && (h = l), h === l))
        throw new Error("Infinite loop: flipped diagonal still intersects");
      i[f] === e ? (a = f, s = h, h = -1) : this.intersectSegments(
        t,
        e,
        i[u],
        i[f]
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
        const h = e[a];
        h !== -1 && (i.delete(h), this.isDelaunay(a) || (this.flipDiagonal(a), s++));
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
      a = jt(s), s = r[a];
    } while (s !== -1 && s !== i);
    return o[jt(a)] === t ? -a : 1 / 0;
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
    const { triangles: e, halfedges: i } = this.del, o = this.flips, r = this.consd, s = i[t], a = Pt(t), h = jt(t), c = Pt(s), l = jt(s), f = i[a], u = i[c];
    if (r.has(t))
      throw new Error("Trying to flip a constrained edge");
    return e[t] = e[c], i[t] = u, o.set(t, o.has(c)) || r.set(t, r.has(c)), u !== -1 && (i[u] = t), i[a] = c, e[s] = e[a], i[s] = f, o.set(s, o.has(a)) || r.set(s, r.has(a)), f !== -1 && (i[f] = s), i[c] = a, this.markFlip(t), this.markFlip(h), this.markFlip(s), this.markFlip(l), o.add(a), r.delete(a), o.add(c), r.delete(c), this.updateVert(t), this.updateVert(h), this.updateVert(s), this.updateVert(l), a;
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
    const r = e[Pt(t)], s = e[t], a = e[jt(t)], h = e[Pt(o)];
    return !this.inCircle(r, s, a, h);
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
    (h) => h.geometry.coordinates
  ), o = Le.from(i);
  let r;
  const s = [];
  o.triangles.length !== 0 && t.length !== 0 && (r = new ur(o), r.constrainAll(t));
  for (let h = 0; h < o.triangles.length; h += 3)
    s.push([o.triangles[h], o.triangles[h + 1], o.triangles[h + 2]]);
  const a = ["a", "b", "c"];
  return _t(
    s.map((h) => {
      const c = {}, l = h.map((f, u) => {
        const g = n.features[f], _ = g.geometry.coordinates, w = [_[0], _[1]];
        return _.length === 3 ? w[2] = _[2] : c[a[u]] = g.properties[e], w;
      });
      return l[3] = l[0], ie([l], c);
    })
  );
}
function dr(n, t) {
  const e = [[], [], [], []], i = [];
  return Object.keys(n).forEach((o) => {
    const r = n[o], s = r.forw, a = r.bakw, h = [
      s[0] - t.forw[0],
      s[1] - t.forw[1]
    ], c = [
      a[0] - t.bakw[0],
      t.bakw[1] - a[1]
    ], l = { forw: h, bakw: c };
    if (i.push(l), h[0] === 0 || h[1] === 0)
      return;
    let f = 0;
    h[0] > 0 && (f += 1), h[1] > 0 && (f += 2), e[f].push(l);
  }), { perQuad: e, aggregate: i };
}
function pr(n) {
  let t = 1 / 0, e = 0, i = 0;
  return n.forEach((o) => {
    const { forw: r, bakw: s } = o, a = Math.hypot(r[0], r[1]), h = Math.hypot(s[0], s[1]);
    if (h === 0) return;
    const c = a / h, l = Math.atan2(r[0], r[1]) - Math.atan2(s[0], s[1]);
    t = Math.min(t, c), e += Math.cos(l), i += Math.sin(l);
  }), isFinite(t) ? [t, Math.atan2(i, e)] : [1, 0];
}
function gr(n, t, e) {
  const { perQuad: i, aggregate: o } = dr(n, t), r = i.every((h) => h.length > 0), a = (e === "birdeye" ? r ? i : [o] : [o]).map((h) => pr(h));
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
  const s = i[0] - e[0], a = i[1] - e[1], h = e[0] - n[0], c = e[1] - n[1], l = o * a - r * s;
  if (Math.abs(l) < 1e-12) return null;
  const f = (h * a - c * s) / l, u = (h * r - c * o) / l;
  return f <= 1e-10 || u < -1e-10 || u > 1 + 1e-10 ? null : { t: f, point: [n[0] + f * o, n[1] + f * r] };
}
function vr(n, t, e) {
  const i = e.length;
  let o = -1 / 0, r = null;
  for (let s = 0; s < i; s++) {
    const a = (s + 1) % i, h = yr(
      n,
      t,
      e[s].bakw,
      e[a].bakw
    );
    h && h.t > o && (o = h.t, r = h.point);
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
  const h = [];
  if (s !== 0)
    for (const l of [e, i]) {
      const f = (l - n[0]) / s;
      if (f > 0) {
        const u = n[1] + f * a;
        u >= o && u <= r && h.push({ t: f, x: l, y: u });
      }
    }
  if (a !== 0)
    for (const l of [o, r]) {
      const f = (l - n[1]) / a;
      if (f > 0) {
        const u = n[0] + f * s;
        u >= e && u <= i && h.push({ t: f, x: u, y: l });
      }
    }
  if (h.length === 0) return null;
  h.sort((l, f) => l.t - f.t);
  const c = h[0];
  return [c.x, c.y];
}
function bn(n, t, e) {
  const i = n.length, o = new Array(i).fill(1);
  for (const r of t)
    for (let s = 0; s < i; s++) {
      const a = (s + 1) % i, h = Ue([n[s].bakw, n[a].bakw]), c = Ue([e.bakw, r.bakw]), l = gi(h, c);
      if (l.features.length > 0 && l.features[0].geometry) {
        const f = l.features[0], u = Math.sqrt(
          Math.pow(r.bakw[0] - e.bakw[0], 2) + Math.pow(r.bakw[1] - e.bakw[1], 2)
        ), g = Math.sqrt(
          Math.pow(f.geometry.coordinates[0] - e.bakw[0], 2) + Math.pow(f.geometry.coordinates[1] - e.bakw[1], 2)
        ), _ = u / g;
        _ > o[s] && (o[s] = _), _ > o[a] && (o[a] = _);
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
  const { convexBuf: i, centroid: o, allGcps: r, minx: s, maxx: a, miny: h, maxy: c } = n, l = gr(i, o, t), u = [
    [s, h],
    [a, h],
    [a, c],
    [s, c]
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
  const g = 4, _ = u.map(
    (m) => Math.atan2(m.forw[0] - o.forw[0], m.forw[1] - o.forw[1])
  ), w = u.map(
    (m) => Math.atan2(
      m.bakw[0] - o.bakw[0],
      -(m.bakw[1] - o.bakw[1])
    )
  );
  function E(m) {
    for (let A = 0; A < g; A++) {
      const B = (A + 1) % g, P = _[A], I = A < g - 1 ? _[B] : _[B] + 2 * Math.PI;
      let N = m;
      for (; N < P; ) N += 2 * Math.PI;
      for (; N >= P + 2 * Math.PI; ) N -= 2 * Math.PI;
      if (N >= P && N < I)
        return { i: A, j: B, frac: (N - P) / (I - P) };
    }
    return { i: 0, j: 1, frac: 0 };
  }
  function k(m) {
    const { i: A, j: B, frac: P } = E(m), I = w[A];
    let X = w[B] - I;
    for (; X > Math.PI; ) X -= 2 * Math.PI;
    for (; X < -Math.PI; ) X += 2 * Math.PI;
    return I + P * X;
  }
  const p = new Set(
    u.map(
      (m) => Math.floor(yn(m.forw, o.forw) / 10) % 36
    )
  ), b = r.map((m) => ({
    forw: m.forw,
    bakw: m.bakw,
    angleDeg: yn(m.forw, o.forw),
    forwDist: Math.hypot(m.forw[0] - o.forw[0], m.forw[1] - o.forw[1])
  })), d = [];
  for (let m = 0; m < 36; m++) {
    if (p.has(m)) continue;
    const A = m * 10, B = b.filter(
      (S) => S.angleDeg >= A && S.angleDeg < A + 10
    );
    let P = null;
    if (B.length > 0) {
      const S = B.reduce((M, T) => T.forwDist > M.forwDist ? T : M);
      P = vn(o.forw, S.forw, s, a, h, c);
    }
    if (!P) {
      const S = (A + 5) % 360 * (Math.PI / 180), M = [
        o.forw[0] + Math.sin(S),
        o.forw[1] + Math.cos(S)
      ];
      P = vn(o.forw, M, s, a, h, c);
    }
    if (!P) continue;
    const I = [P[0] - o.forw[0], P[1] - o.forw[1]], N = Math.atan2(I[0], I[1]), X = k(N), L = [
      o.bakw[0] + Math.sin(X),
      o.bakw[1] - Math.cos(X)
    ], y = vr(o.bakw, L, u);
    y && d.push({ forw: P, bakw: y });
  }
  const x = [...u, ...d];
  return x.sort(
    (m, A) => Math.atan2(m.forw[0] - o.forw[0], m.forw[1] - o.forw[1]) - Math.atan2(A.forw[0] - o.forw[0], A.forw[1] - o.forw[1])
  ), bn(x, r, o), x;
}
function br(n, t = !1) {
  return Fn(n, "plain", t);
}
function xr(n, t = !1) {
  return Fn(n, "birdeye", t);
}
function _r(n) {
  const e = new Mr(n).findSegmentIntersections(), i = $n(e), o = /* @__PURE__ */ new Map();
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
    (r != this._xx.length || this._xx.length != this._yy.length) && je("ArcCollection#initXYData() Counting error"), this.initBounds(), this._arcIter = new Vr(this._xx, this._yy);
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
    let a = 0, h, c, l;
    for (let f = 0; f < o; f++)
      h = i[f], h > 0 && (c = f * 4, l = qr(t, e, a, h), r[c++] = l[0], r[c++] = l[1], r[c++] = l[2], r[c] = l[3], a += h, s.mergeBounds(l));
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
    let h = i ? this._ii[o] : this._ii[o] + s - 1, c = h, l = 0;
    for (let f = 1; f < s; f++)
      c += a, (r === 0 || this._zz[c] >= r) && (e(h, c, this._xx, this._yy), h = c, l++);
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
    const t = this.getBounds(), e = t.ymin || 0, i = (t.ymax || 0) - e, o = this.calcSegmentIntersectionStripeCount(), r = new Uint32Array(o), s = o > 1 ? (w) => Math.floor((o - 1) * (w - e) / i) : () => 0;
    let a, h;
    this.forEachSegment(
      (w, E, k, p) => {
        let b = s(p[w]);
        const d = s(p[E]);
        for (; r[b] = r[b] + 2, b != d; )
          b += d > b ? 1 : -1;
      }
    );
    const c = this.getUint32Array(Er(r));
    let l = 0;
    const f = [];
    Ar(r, (w) => {
      const E = l;
      l += w, f.push(c.subarray(E, l));
    }), Pr(r, 0), this.forEachSegment(
      (w, E, k, p) => {
        let b = s(p[w]);
        const d = s(p[E]);
        let x, m;
        for (; x = r[b], r[b] = x + 2, m = f[b], m[x] = w, m[x + 1] = E, b != d; )
          b += d > b ? 1 : -1;
      }
    );
    const u = this.getVertexData(), g = [];
    let _;
    for (a = 0; a < o; a++)
      if (u.xx && u.yy)
        for (_ = Ir(f[a], u.xx, u.yy), h = 0; h < _.length; h++)
          g.push(_[h]);
    return $n(g);
  }
}
function je(...n) {
  const t = n.join(" ");
  throw new Error(t);
}
function $e(n) {
  return n ? Sr(n) ? !0 : kr(n) ? !1 : n.length === 0 ? !0 : n.length > 0 : !1;
}
function kr(n) {
  return n != null && n.toString === String.prototype.toString;
}
function Sr(n) {
  return Array.isArray(n);
}
function Er(n, t) {
  $e(n) || je("utils.sum() expects an array, received:", n);
  let e = 0, i;
  for (let o = 0, r = n.length; o < r; o++)
    i = n[o], i && (e += i);
  return e;
}
function Ar(n, t, e) {
  if (!$e(n))
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
  let r, s, a, h, c, l, f, u, g, _, w, E, k, p, b, d, x;
  for (Fr(t, n), d = 0; d < i; ) {
    for (r = n[d], s = n[d + 1], c = t[r], l = t[s], g = e[r], _ = e[s], x = d; x < i && (x += 2, a = n[x], f = t[a], !(l < f)); ) {
      if (w = e[a], h = n[x + 1], u = t[h], E = e[h], g >= w) {
        if (g > E && _ > w && _ > E) continue;
      } else if (g < E && _ < w && _ < E) continue;
      r == a || r == h || s == a || s == h || (k = Br(
        c,
        g,
        l,
        _,
        f,
        w,
        u,
        E
      ), k && (p = [r, s], b = [a, h], o.push(_n(k, p, b, t, e)), k.length == 4 && o.push(
        _n(k.slice(2), p, b, t, e)
      )));
    }
    d += 2;
  }
  return o;
}
function Br(n, t, e, i, o, r, s, a) {
  const h = Or(n, t, e, i, o, r, s, a);
  let c = null;
  return h && (c = Tr(n, t, e, i, o, r, s, a), c ? Yr(n, t, e, i, o, r, s, a) && (c = null) : c = Rr(n, t, e, i, o, r, s, a)), c;
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
function Tr(n, t, e, i, o, r, s, a) {
  let h = pe(n, t, e, i, o, r, s, a), c;
  return h && (c = Xr(h[0], h[1], n, t, e, i, o, r, s, a), c == 1 ? h = pe(e, i, n, t, o, r, s, a) : c == 2 ? h = pe(o, r, s, a, n, t, e, i) : c == 3 && (h = pe(s, a, o, r, n, t, e, i))), h && Dr(h, n, t, e, i, o, r, s, a), h;
}
function pe(n, t, e, i, o, r, s, a) {
  const h = Ln(e - n, i - t, s - o, a - r), c = 1e-18;
  let l;
  if (h === 0) return null;
  const f = Ht(o, r, s, a, n, t) / h;
  return h <= c && h >= -c ? l = Nr(n, t, e, i, o, r, s, a) : l = [n + f * (e - n), t + f * (i - t)], l;
}
function Nr(n, t, e, i, o, r, s, a) {
  let h = null;
  return !It(n, o, s) && !It(t, r, a) ? h = [n, t] : !It(e, o, s) && !It(i, r, a) ? h = [e, i] : !It(o, n, e) && !It(r, t, i) ? h = [o, r] : !It(s, n, e) && !It(a, t, i) && (h = [s, a]), h;
}
function It(n, t, e) {
  let i;
  return t < e ? i = n < t || n > e : t > e ? i = n > t || n < e : i = n != t, i;
}
function Xr(n, t, ...e) {
  let i = -1, o = 1 / 0, r;
  for (let s = 0, a = 0, h = e.length; a < h; s++, a += 2)
    r = Cr(n, t, e[a], e[a + 1]), r < o && (o = r, i = s);
  return i;
}
function Cr(n, t, e, i) {
  const o = n - e, r = t - i;
  return o * o + r * r;
}
function Dr(n, t, e, i, o, r, s, a, h) {
  let c = n[0], l = n[1];
  c = ge(c, t, i), c = ge(c, r, a), l = ge(l, e, o), l = ge(l, s, h), n[0] = c, n[1] = l;
}
function ge(n, t, e) {
  let i;
  return It(n, t, e) && (i = Math.abs(n - t) < Math.abs(n - e) ? t : e, n = i), n;
}
function Rr(n, t, e, i, o, r, s, a) {
  const h = Math.min(n, e, o, s), c = Math.max(n, e, o, s), l = Math.min(t, i, r, a), f = Math.max(t, i, r, a), u = f - l > c - h;
  let g = [];
  return (u ? Dt(t, l, f) : Dt(n, h, c)) && g.push(n, t), (u ? Dt(i, l, f) : Dt(e, h, c)) && g.push(e, i), (u ? Dt(r, l, f) : Dt(o, h, c)) && g.push(o, r), (u ? Dt(a, l, f) : Dt(s, h, c)) && g.push(s, a), (g.length != 2 && g.length != 4 || g.length == 4 && g[0] == g[2] && g[1] == g[3]) && (g = null), g;
}
function Yr(n, t, e, i, o, r, s, a) {
  return n == o && t == r || n == s && t == a || e == o && i == r || e == s && i == a;
}
function Dt(n, t, e) {
  return n > t && n < e;
}
function Fr(n, t) {
  Lr(n, t), jn(n, t, 0, t.length - 2);
}
function Lr(n, t) {
  for (let e = 0, i = t.length; e < i; e += 2)
    n[t[e]] > n[t[e + 1]] && jr(t, e, e + 1);
}
function jr(n, t, e) {
  const i = n[t];
  n[t] = n[e], n[e] = i;
}
function jn(n, t, e, i) {
  let o = e, r = i, s, a;
  for (; o < i; ) {
    for (s = n[t[e + i >> 2 << 1]]; o <= r; ) {
      for (; n[t[o]] < s; ) o += 2;
      for (; n[t[r]] > s; ) r -= 2;
      o <= r && (a = t[o], t[o] = t[r], t[r] = a, a = t[o + 1], t[o + 1] = t[r + 1], t[r + 1] = a, o += 2, r -= 2);
    }
    if (r - e < 40 ? xn(n, t, e, r) : jn(n, t, e, r), i - o < 40) {
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
  const a = t[0] < e[0] ? t : e, h = a == t ? e : t;
  return { x: r, y: s, a, b: h };
}
function Mn(n, t, e, i, o, r) {
  let s = e < i ? e : i, a = s === e ? i : e;
  return o[s] == n && r[s] == t ? a = s : o[a] == n && r[a] == t && (s = a), [s, a];
}
function $n(n) {
  const t = {};
  return n.filter((e) => {
    const i = $r(e);
    return i in t ? !1 : (t[i] = !0, !0);
  });
}
function $r(n) {
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
  let s, a, h, c, l, f;
  if (r > 0)
    h = l = n[o], c = f = t[o];
  else return [void 0, void 0, void 0, void 0];
  for (o++; o < r; o++)
    s = n[o], a = t[o], s < h && (h = s), s > l && (l = s), a < c && (c = a), a > f && (f = a);
  return [h, c, l, f];
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
    let r, s, a, h;
    if (arguments.length == 1)
      if ($e(t)) {
        const c = t;
        r = c[0], s = c[1], a = c[2], h = c[3];
      } else {
        const c = t;
        r = c.xmin, s = c.ymin, a = c.xmax, h = c.ymax;
      }
    else
      r = t, s = e, a = i, h = o;
    return this.xmin = r, this.ymin = s, this.xmax = a, this.ymax = h, (r > a || s > h) && this.update(), this;
  }
  update() {
    let t;
    this.xmin > this.xmax && (t = this.xmin, this.xmin = this.xmax, this.xmax = t), this.ymin > this.ymax && (t = this.ymin, this.ymin = this.ymax, this.ymax = t);
  }
  mergeBounds(t, ...e) {
    let i, o, r, s;
    return t instanceof ne ? (i = t.xmin, o = t.ymin, r = t.xmax, s = t.ymax) : e.length == 3 ? (i = t, o = e[0], r = e[1], s = e[2]) : t.length == 4 ? (i = t[0], o = t[1], r = t[2], s = t[3]) : je("Bounds#mergeBounds() invalid argument:", t), this.xmin === void 0 ? this.setBounds(i, o, r, s) : (i < this.xmin && (this.xmin = i), o < this.ymin && (this.ymin = o), r > this.xmax && (this.xmax = r), s > this.ymax && (this.ymax = s)), this;
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
    const a = s.filter((h) => h !== t);
    a.length === 0 ? delete n[r] : n[r] = a;
  }), e) {
    const r = (s, a) => {
      !s || !a || (s.features = s.features.filter((h) => h !== a));
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
    const r = (o + 1) % e, s = n[o], a = n[r], h = s.geometry.coordinates, c = Math.atan2(
      h[0] - i[0],
      h[1] - i[1]
    ), l = [t, s, a, t].map(
      (g) => g.geometry.coordinates
    ), f = {
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
      ie([l], f)
    ]);
    return [c, u];
  }).reduce(
    (o, r) => (o[0].push(r[0]), o[1].push(r[1]), o),
    [[], []]
  );
}
function Ur(n) {
  const { tins: t, targets: e, includeReciprocals: i, numBoundaryVertices: o = 4 } = n, r = {};
  e.forEach((a) => {
    const h = t[a];
    if (!h || !h.features) return;
    r[a] = {};
    const c = {};
    h.features.forEach((l) => {
      const f = ["a", "b", "c"];
      for (let u = 0; u < 3; u++) {
        const g = (u + 1) % 3, _ = f[u], w = f[g], E = l.properties[_].index, k = l.properties[w].index, p = [E, k].sort().join("-");
        if (c[p]) continue;
        c[p] = !0;
        const b = l.geometry.coordinates[0][u], d = l.geometry.coordinates[0][g], x = l.properties[_].geom, m = l.properties[w].geom, A = Math.sqrt(
          Math.pow(x[0] - m[0], 2) + Math.pow(x[1] - m[1], 2)
        ) / Math.sqrt(
          Math.pow(b[0] - d[0], 2) + Math.pow(b[1] - d[1], 2)
        ), B = r[a];
        B[`${E}:${p}`] = A, B[`${k}:${p}`] = A;
      }
    });
  });
  const s = {};
  return i && (s.bakw = {}), e.forEach((a) => {
    const h = r[a];
    if (s[a] = {}, !h)
      return;
    const c = {};
    Object.keys(h).forEach((f) => {
      const [u] = f.split(":");
      c[u] || (c[u] = []), c[u].push(h[f]);
    }), Object.keys(c).forEach((f) => {
      const u = c[f], g = u.reduce((_, w) => _ + w, 0) / u.length;
      s[a][f] = g, i && s.bakw && (s.bakw[f] = 1 / g);
    });
    let l = 0;
    for (let f = 0; f < o; f++) {
      const u = `b${f}`, g = s[a][u] || 0;
      l += g;
    }
    s[a].c = l / o, i && s.bakw && (s.bakw.c = 1 / s[a].c);
  }), s;
}
function ye(n, t = 1e-6) {
  const [e, i] = n[0], [o, r] = n[1], [s, a] = n[2];
  return Math.abs((o - e) * (a - i) - (s - e) * (r - i)) < t;
}
function zr(n, t) {
  const e = /* @__PURE__ */ new Set();
  return n.forEach((i) => {
    if (i.length !== 2) return;
    const o = i.map((r) => `${t?.[r] ?? r}`);
    e.add(o.sort().join("-"));
  }), e;
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
  const s = n ? 0 : 1, a = 1 - s, h = e[s], c = e[a];
  if (!h || !c) return !1;
  const l = vt(c.geom);
  let f = !1, u = !1;
  for (let g = 0; g <= 1; g++) {
    const _ = i[g];
    if (!_) continue;
    const w = [String(_.prop.index), String(h.prop.index)].sort().join("-"), E = o[w];
    if (!E || E.length < 2) continue;
    const k = E.find(
      (N) => N.bakw !== r[s].bakw
    );
    if (!k) continue;
    const b = Zt(k.bakw).find(
      (N) => String(N.prop.index) !== String(_.prop.index) && String(N.prop.index) !== String(h.prop.index)
    );
    if (!b) continue;
    f = !0;
    const d = vt(b.geom), x = vt(_.geom), m = vt(h.geom), A = m[0] - x[0], B = m[1] - x[1], P = A * (l[1] - x[1]) - B * (l[0] - x[0]), I = A * (d[1] - x[1]) - B * (d[0] - x[0]);
    if (P * I > 0) {
      u = !0;
      break;
    }
  }
  return f && !u;
}
function Jr(n, t, e, i) {
  if (!n && !t) return !1;
  if (e[0] && e[1] && i[0] && i[1]) {
    const o = i.map((l) => vt(l.geom)), r = e.map((l) => vt(l.geom)), s = o[1][0] - o[0][0], a = o[1][1] - o[0][1], h = s * (r[0][1] - o[0][1]) - a * (r[0][0] - o[0][0]), c = s * (r[1][1] - o[0][1]) - a * (r[1][0] - o[0][0]);
    return h * c < 0;
  }
  return !1;
}
function Kr(n, t, e, i) {
  const o = zr(e, i), r = /* @__PURE__ */ new Set();
  let s = !1;
  for (let a = 0; a < Wr; a++) {
    let h = !1;
    for (const c of Object.keys(t)) {
      if (r.has(c)) continue;
      r.add(c);
      const l = t[c];
      if (!l || l.length < 2) continue;
      const f = c.split("-");
      if (f.length !== 2 || o.has(c)) continue;
      const u = Zt(l[0].bakw), g = Zt(l[1].bakw), _ = Zt(l[0].forw), w = Zt(l[1].forw), E = f.map(
        (v) => u.find((O) => `${O.prop.index}` === v) || g.find((O) => `${O.prop.index}` === v)
      ), k = f.map(
        (v) => _.find((O) => `${O.prop.index}` === v) || w.find((O) => `${O.prop.index}` === v)
      );
      if (E.some((v) => !v) || k.some((v) => !v))
        continue;
      const p = [u, g].map(
        (v) => v.find((O) => !f.includes(`${O.prop.index}`))
      ), b = [_, w].map(
        (v) => v.find((O) => !f.includes(`${O.prop.index}`))
      );
      if (p.some((v) => !v) || b.some((v) => !v))
        continue;
      const d = l[0].bakw.geometry.coordinates[0].slice(0, 3).map((v) => vt(v)), x = l[1].bakw.geometry.coordinates[0].slice(0, 3).map((v) => vt(v)), m = l[0].forw.geometry.coordinates[0].slice(0, 3).map((v) => vt(v)), A = l[1].forw.geometry.coordinates[0].slice(0, 3).map((v) => vt(v)), B = ye(d), P = ye(x), I = ye(m), N = ye(A), X = Gr(
        B,
        P,
        p,
        E,
        t,
        l
      ), L = Jr(
        I,
        N,
        p,
        E
      );
      if (!(X || L || En(
        vt(p[0].geom),
        x
      ) || En(
        vt(p[1].geom),
        d
      )))
        continue;
      const S = k.map(
        (v) => vt(v.geom)
      ), M = b.map(
        (v) => vt(v.geom)
      ), T = Qr([
        ...S,
        ...M
      ]), C = Hr(T), R = An(
        S[0],
        S[1],
        M[0]
      ) + An(
        S[0],
        S[1],
        M[1]
      );
      Re(C, R) && (kn(t, l[0], n), kn(t, l[1], n), E.forEach((v) => {
        if (!v) return;
        const O = [
          v.geom,
          p[0].geom,
          p[1].geom,
          v.geom
        ], D = {
          a: v.prop,
          b: p[0].prop,
          c: p[1].prop
        }, Y = ie([O], D), j = Dn(Y);
        Vn(t, {
          forw: j,
          bakw: Y
        }, n);
      }), h = !0, s = !0);
    }
    if (!h) break;
  }
  return s;
}
function vt(n) {
  return [n[0], n[1]];
}
function En(n, t) {
  const [e, i] = t[0], [o, r] = t[1], [s, a] = t[2], h = s - e, c = a - i, l = o - e, f = r - i, u = n[0] - e, g = n[1] - i, _ = h * h + c * c, w = h * l + c * f, E = h * u + c * g, k = l * l + f * f, p = l * u + f * g, b = _ * k - w * w;
  if (b === 0) return !1;
  const d = 1 / b, x = (k * E - w * p) * d, m = (_ * p - w * E) * d, A = 1e-9;
  return x >= -A && m >= -A && x + m <= 1 + A;
}
function Qr(n) {
  const t = n.map((s) => s.slice()).filter(
    (s, a, h) => h.findIndex(
      (c) => Re(c[0], s[0]) && Re(c[1], s[1])
    ) === a
  );
  if (t.length <= 1) return t;
  const e = t.sort(
    (s, a) => s[0] === a[0] ? s[1] - a[1] : s[0] - a[0]
  ), i = (s, a, h) => (a[0] - s[0]) * (h[1] - s[1]) - (a[1] - s[1]) * (h[0] - s[0]), o = [];
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
class ht extends xt {
  importance;
  priority;
  pointsSet;
  useV2Algorithm;
  /**
   * Tinクラスのインスタンスを生成します
   * @param options - 初期化オプション
   */
  constructor(t = {}) {
    super(), t.bounds ? this.setBounds(t.bounds) : (this.setWh(t.wh), this.vertexMode = t.vertexMode || ht.VERTEX_PLAIN), this.strictMode = t.strictMode || ht.MODE_AUTO, this.yaxisMode = t.yaxisMode || ht.YAXIS_INVERT, this.importance = t.importance || 0, this.priority = t.priority || 0, this.stateFull = t.stateFull || !1, this.useV2Algorithm = t.useV2Algorithm ?? !1, t.points && this.setPoints(t.points), t.edges && this.setEdges(t.edges);
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
    this.yaxisMode === ht.YAXIS_FOLLOW && (t = t.map((e) => [
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
      const h = t[a];
      h[0] < e && (e = h[0]), h[0] > i && (i = h[0]), h[1] < o && (o = h[1]), h[1] > r && (r = h[1]), s.push(h);
    }
    s.push(t[0]), this.boundsPolygon = ie([s]), this.xy = [e, o], this.wh = [i - e, r - o], this.vertexMode = ht.VERTEX_PLAIN, this.tins = void 0, this.indexedTins = void 0;
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
    }), this.strict_status === ht.STATUS_LOOSE ? (t.tins_points[1] = [], this.tins.bakw.features.map((i) => {
      t.tins_points[1].push(
        ["a", "b", "c"].map(
          (o) => i.properties[o].index
        )
      );
    })) : this.strict_status === ht.STATUS_ERROR && this.kinks?.bakw && (t.kinks_points = this.kinks.bakw.features.map(
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
      (r) => Dn(r)
    );
    this.tins.bakw = _t(t);
    const e = {};
    this.tins.forw.features.forEach((r, s) => {
      const a = this.tins.bakw.features[s];
      Vn(e, { forw: r, bakw: a });
    });
    const i = (this.pointsSet?.forw.features ?? []).map(
      (r) => r.properties.target.index
    );
    Kr(
      this.tins,
      e,
      this.pointsSet?.edges || [],
      i
    );
    const o = ["forw", "bakw"].map((r) => {
      const s = this.tins[r].features.map(
        (a) => a.geometry.coordinates[0]
      );
      return _r(s);
    });
    o[0].length === 0 && o[1].length === 0 ? (this.strict_status = ht.STATUS_STRICT, delete this.kinks) : (this.strict_status = ht.STATUS_ERROR, this.kinks = {
      forw: _t(o[0]),
      bakw: _t(o[1])
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
      const h = [s, a].map((c) => {
        const l = c.map((u, g, _) => {
          if (g === 0) return 0;
          const w = _[g - 1];
          return Math.sqrt(
            Math.pow(u[0] - w[0], 2) + Math.pow(u[1] - w[1], 2)
          );
        }), f = l.reduce((u, g, _) => _ === 0 ? [0] : (u.push(u[_ - 1] + g), u), []);
        return f.map((u, g, _) => {
          const w = u / _[_.length - 1];
          return [c[g], l[g], f[g], w];
        });
      });
      h.map((c, l) => {
        const f = h[l ? 0 : 1];
        return c.filter((u, g) => !(g === 0 || g === c.length - 1 || u[4] === "handled")).flatMap((u) => {
          const g = u[0], _ = u[3], w = f.reduce(
            (E, k, p, b) => {
              if (E) return E;
              const d = b[p + 1];
              if (k[3] === _)
                return k[4] = "handled", [k];
              if (k[3] < _ && d && d[3] > _)
                return [k, d];
            },
            void 0
          );
          if (w && w.length === 1)
            return l === 0 ? [[g, w[0][0], _]] : [[w[0][0], g, _]];
          if (w && w.length === 2) {
            const E = w[0], k = w[1], p = (_ - E[3]) / (k[3] - E[3]), b = [
              (k[0][0] - E[0][0]) * p + E[0][0],
              (k[0][1] - E[0][1]) * p + E[0][1]
            ];
            return l === 0 ? [[g, b, _]] : [[b, g, _]];
          }
          return [];
        });
      }).reduce((c, l) => c.concat(l), []).sort((c, l) => c[2] < l[2] ? -1 : 1).map((c, l, f) => {
        this.edgeNodes[i] = [
          c[0],
          c[1]
        ];
        const u = me(
          c[0],
          c[1],
          `e${i}`
        );
        i++, t.forw.push(u), t.bakw.push(we(u)), l === 0 ? e.push([r[0], t.forw.length - 1]) : e.push([
          t.forw.length - 2,
          t.forw.length - 1
        ]), l === f.length - 1 && e.push([t.forw.length - 1, r[1]]);
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
    if (!this.points.reduce((h, c) => h && (r ? Ie(c[0], r) : c[0][0] >= t && c[0][0] <= e && c[0][1] >= i && c[0][1] <= o), !0))
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
      const h = a[0][0], c = a[0][1];
      h < t && (t = h), h > e && (e = h), c < i && (i = c), c > o && (o = c);
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
    t !== ht.MODE_STRICT && t !== ht.MODE_LOOSE && (t = ht.MODE_AUTO);
    const e = !this.useV2Algorithm;
    let i, o, r, s, a;
    if (e) {
      if (this.bounds) {
        const I = this.boundsPolygon;
        if (!I) throw new Error("Internal error: bounds is set but boundsPolygon is missing");
        if (!this.points.every(
          (X) => Ie(X[0], I)
        )) throw "SOME POINTS OUTSIDE";
      }
      i = this.generatePointsSet(), { minx: o, maxx: r, miny: s, maxy: a } = this.computeGcpBbox();
    } else {
      const I = this.validateAndPrepareInputs();
      i = I.pointsSet, o = I.minx, r = I.maxx, s = I.miny, a = I.maxy;
    }
    const h = {
      forw: _t(i.forw),
      bakw: _t(i.bakw)
    }, c = de(
      h.forw,
      i.edges,
      "target"
    ), l = de(
      h.bakw,
      i.edges,
      "target"
    );
    if (c.features.length === 0 || l.features.length === 0)
      throw "TOO LINEAR1";
    const f = yi(h.forw), u = on(h.forw);
    if (!u) throw "TOO LINEAR2";
    const g = {}, _ = u.geometry.coordinates[0];
    let w;
    try {
      w = _.map((I) => ({
        forw: I,
        bakw: Qt(Rt(I), c)
      })), w.forEach((I) => {
        g[`${I.forw[0]}:${I.forw[1]}`] = I;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const E = on(h.bakw);
    if (!E) throw "TOO LINEAR2";
    const k = E.geometry.coordinates[0];
    try {
      w = k.map((I) => ({
        bakw: I,
        forw: Qt(Rt(I), l)
      })), w.forEach((I) => {
        g[`${I.forw[0]}:${I.forw[1]}`] = I;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    let p;
    if (e) {
      const I = f.geometry.coordinates, N = c.features.find(
        (X) => Ie(
          Rt(I),
          X
        )
      );
      if (N) {
        const X = N.geometry.coordinates[0], L = N.properties.a.geom, y = N.properties.b.geom, S = N.properties.c.geom;
        p = {
          forw: [
            (X[0][0] + X[1][0] + X[2][0]) / 3,
            (X[0][1] + X[1][1] + X[2][1]) / 3
          ],
          bakw: [
            (L[0] + y[0] + S[0]) / 3,
            (L[1] + y[1] + S[1]) / 3
          ]
        };
      } else
        p = {
          forw: I,
          bakw: Qt(f, c)
        };
    } else
      p = {
        forw: f.geometry.coordinates,
        bakw: Qt(f, c)
      };
    const b = me(p.forw, p.bakw, "c");
    this.centroid = {
      forw: b,
      bakw: we(b)
    };
    const d = [
      ...this.points.map((I) => ({ forw: I[0], bakw: I[1] })),
      ...(this.edgeNodes ?? []).map((I) => ({ forw: I[0], bakw: I[1] }))
    ], x = {
      convexBuf: g,
      centroid: p,
      allGcps: d,
      minx: o,
      maxx: r,
      miny: s,
      maxy: a
    }, m = this.vertexMode === ht.VERTEX_BIRDEYE ? xr(x, e) : br(x, e), A = {
      forw: [],
      bakw: []
    };
    for (let I = 0; I < m.length; I++) {
      const N = m[I].forw, X = m[I].bakw, L = me(N, X, `b${I}`), y = we(L);
      i.forw.push(L), i.bakw.push(y), A.forw.push(L), A.bakw.push(y);
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
    }, (t === ht.MODE_STRICT || t === ht.MODE_AUTO) && this.calculateStrictTin(), (t === ht.MODE_LOOSE || t === ht.MODE_AUTO && this.strict_status === ht.STATUS_ERROR) && (this.tins.bakw = un(
      de(
        this.pointsSet.bakw,
        i.edges,
        "target"
      )
    ), delete this.kinks, this.strict_status = ht.STATUS_LOOSE), this.vertices_params = {
      forw: Sn(A.forw, this.centroid.forw),
      bakw: Sn(A.bakw, this.centroid.bakw)
    }, this.addIndexedTin();
    const B = ["forw"];
    this.strict_status === ht.STATUS_LOOSE && B.push("bakw");
    const P = this.strict_status === ht.STATUS_STRICT;
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
  ht as Tin,
  de as constrainedTin,
  we as counterPoint,
  me as createPoint,
  ht as default,
  _r as findIntersections,
  pn as format_version,
  Vn as insertSearchIndex,
  Sn as vertexCalc
};
