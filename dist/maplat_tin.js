function ie(e, t, n = {}) {
  const r = { type: "Feature" };
  return (n.id === 0 || n.id) && (r.id = n.id), n.bbox && (r.bbox = n.bbox), r.properties = t || {}, r.geometry = e, r;
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
  return ie({
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
    for (let i = 0; i < o[o.length - 1].length; i++)
      if (o[o.length - 1][i] !== o[0][i])
        throw new Error("First and last Position are not equivalent.");
  }
  return ie({
    type: "Polygon",
    coordinates: e
  }, t, n);
}
function He(e, t, n = {}) {
  if (e.length < 2)
    throw new Error("coordinates must be an array of two or more positions");
  return ie({
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
function nr(e) {
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
function rr(e) {
  return e.type === "Feature" ? e.geometry : e;
}
function qe(e, t, n) {
  if (e !== null)
    for (var r, o, i, s, a, h, l, u = 0, c = 0, f, p = e.type, _ = p === "FeatureCollection", g = p === "Feature", I = _ ? e.features.length : 1, M = 0; M < I; M++) {
      l = _ ? (
        // @ts-expect-error: Known type conflict
        e.features[M].geometry
      ) : g ? (
        // @ts-expect-error: Known type conflict
        e.geometry
      ) : e, f = l ? l.type === "GeometryCollection" : !1, a = f ? l.geometries.length : 1;
      for (var m = 0; m < a; m++) {
        var b = 0, d = 0;
        if (s = f ? l.geometries[m] : l, s !== null) {
          h = s.coordinates;
          var v = s.type;
          switch (u = n && (v === "Polygon" || v === "MultiPolygon") ? 1 : 0, v) {
            case null:
              break;
            case "Point":
              if (
                // @ts-expect-error: Known type conflict
                t(
                  h,
                  c,
                  M,
                  b,
                  d
                ) === !1
              )
                return !1;
              c++, b++;
              break;
            case "LineString":
            case "MultiPoint":
              for (r = 0; r < h.length; r++) {
                if (
                  // @ts-expect-error: Known type conflict
                  t(
                    h[r],
                    c,
                    M,
                    b,
                    d
                  ) === !1
                )
                  return !1;
                c++, v === "MultiPoint" && b++;
              }
              v === "LineString" && b++;
              break;
            case "Polygon":
            case "MultiLineString":
              for (r = 0; r < h.length; r++) {
                for (o = 0; o < h[r].length - u; o++) {
                  if (
                    // @ts-expect-error: Known type conflict
                    t(
                      h[r][o],
                      c,
                      M,
                      b,
                      d
                    ) === !1
                  )
                    return !1;
                  c++;
                }
                v === "MultiLineString" && b++, v === "Polygon" && d++;
              }
              v === "Polygon" && b++;
              break;
            case "MultiPolygon":
              for (r = 0; r < h.length; r++) {
                for (d = 0, o = 0; o < h[r].length; o++) {
                  for (i = 0; i < h[r][o].length - u; i++) {
                    if (
                      // @ts-expect-error: Known type conflict
                      t(
                        h[r][o][i],
                        c,
                        M,
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
              for (r = 0; r < s.geometries.length; r++)
                if (
                  // @ts-expect-error: Known type conflict
                  qe(s.geometries[r], t, n) === !1
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
function ft(e, t, n, r, o) {
  let i, s, a, h, l = t[0], u = r[0], c = 0, f = 0;
  u > l == u > -l ? (i = l, l = t[++c]) : (i = u, u = r[++f]);
  let p = 0;
  if (c < e && f < n)
    for (u > l == u > -l ? (s = l + i, a = i - (s - l), l = t[++c]) : (s = u + i, a = i - (s - u), u = r[++f]), i = s, a !== 0 && (o[p++] = a); c < e && f < n; )
      u > l == u > -l ? (s = i + l, h = s - i, a = i - (s - h) + (l - h), l = t[++c]) : (s = i + u, h = s - i, a = i - (s - h) + (u - h), u = r[++f]), i = s, a !== 0 && (o[p++] = a);
  for (; c < e; )
    s = i + l, h = s - i, a = i - (s - h) + (l - h), l = t[++c], i = s, a !== 0 && (o[p++] = a);
  for (; f < n; )
    s = i + u, h = s - i, a = i - (s - h) + (u - h), u = r[++f], i = s, a !== 0 && (o[p++] = a);
  return (i !== 0 || p === 0) && (o[p++] = i), p;
}
function _t(e, t, n, r, o, i, s, a) {
  return ft(ft(e, t, n, r, s), s, o, i, a);
}
function L(e, t, n, r) {
  let o, i, s, a, h, l, u, c, f, p, _;
  u = U * n, p = u - (u - n), _ = n - p;
  let g = t[0];
  o = g * n, u = U * g, c = u - (u - g), f = g - c, s = f * _ - (o - c * p - f * p - c * _);
  let I = 0;
  s !== 0 && (r[I++] = s);
  for (let M = 1; M < e; M++)
    g = t[M], a = g * n, u = U * g, c = u - (u - g), f = g - c, h = f * _ - (a - c * p - f * p - c * _), i = o + h, l = i - o, s = o - (i - l) + (h - l), s !== 0 && (r[I++] = s), o = a + i, s = i - (o - a), s !== 0 && (r[I++] = s);
  return (o !== 0 || I === 0) && (r[I++] = o), I;
}
function Ln(e, t) {
  let n = t[0];
  for (let r = 1; r < e; r++) n += t[r];
  return n;
}
function tt(e) {
  return new Float64Array(e);
}
const ir = (3 + 16 * pt) * pt, or = (2 + 12 * pt) * pt, sr = (9 + 64 * pt) * pt * pt, Ut = tt(4), Ze = tt(8), tn = tt(12), en = tt(16), mt = tt(4);
function ar(e, t, n, r, o, i, s) {
  let a, h, l, u, c, f, p, _, g, I, M, m, b, d, v, w, A, S;
  const E = e - o, O = n - o, B = t - i, X = r - i;
  d = E * X, f = U * E, p = f - (f - E), _ = E - p, f = U * X, g = f - (f - X), I = X - g, v = _ * I - (d - p * g - _ * g - p * I), w = B * O, f = U * B, p = f - (f - B), _ = B - p, f = U * O, g = f - (f - O), I = O - g, A = _ * I - (w - p * g - _ * g - p * I), M = v - A, c = v - M, Ut[0] = v - (M + c) + (c - A), m = d + M, c = m - d, b = d - (m - c) + (M - c), M = b - w, c = b - M, Ut[1] = b - (M + c) + (c - w), S = m + M, c = S - m, Ut[2] = m - (S - c) + (M - c), Ut[3] = S;
  let F = Ln(4, Ut), y = or * s;
  if (F >= y || -F >= y || (c = e - E, a = e - (E + c) + (c - o), c = n - O, l = n - (O + c) + (c - o), c = t - B, h = t - (B + c) + (c - i), c = r - X, u = r - (X + c) + (c - i), a === 0 && h === 0 && l === 0 && u === 0) || (y = sr * s + Rn * Math.abs(F), F += E * u + X * a - (B * l + O * h), F >= y || -F >= y)) return F;
  d = a * X, f = U * a, p = f - (f - a), _ = a - p, f = U * X, g = f - (f - X), I = X - g, v = _ * I - (d - p * g - _ * g - p * I), w = h * O, f = U * h, p = f - (f - h), _ = h - p, f = U * O, g = f - (f - O), I = O - g, A = _ * I - (w - p * g - _ * g - p * I), M = v - A, c = v - M, mt[0] = v - (M + c) + (c - A), m = d + M, c = m - d, b = d - (m - c) + (M - c), M = b - w, c = b - M, mt[1] = b - (M + c) + (c - w), S = m + M, c = S - m, mt[2] = m - (S - c) + (M - c), mt[3] = S;
  const P = ft(4, Ut, 4, mt, Ze);
  d = E * u, f = U * E, p = f - (f - E), _ = E - p, f = U * u, g = f - (f - u), I = u - g, v = _ * I - (d - p * g - _ * g - p * I), w = B * l, f = U * B, p = f - (f - B), _ = B - p, f = U * l, g = f - (f - l), I = l - g, A = _ * I - (w - p * g - _ * g - p * I), M = v - A, c = v - M, mt[0] = v - (M + c) + (c - A), m = d + M, c = m - d, b = d - (m - c) + (M - c), M = b - w, c = b - M, mt[1] = b - (M + c) + (c - w), S = m + M, c = S - m, mt[2] = m - (S - c) + (M - c), mt[3] = S;
  const k = ft(P, Ze, 4, mt, tn);
  d = a * u, f = U * a, p = f - (f - a), _ = a - p, f = U * u, g = f - (f - u), I = u - g, v = _ * I - (d - p * g - _ * g - p * I), w = h * l, f = U * h, p = f - (f - h), _ = h - p, f = U * l, g = f - (f - l), I = l - g, A = _ * I - (w - p * g - _ * g - p * I), M = v - A, c = v - M, mt[0] = v - (M + c) + (c - A), m = d + M, c = m - d, b = d - (m - c) + (M - c), M = b - w, c = b - M, mt[1] = b - (M + c) + (c - w), S = m + M, c = S - m, mt[2] = m - (S - c) + (M - c), mt[3] = S;
  const T = ft(k, tn, 4, mt, en);
  return en[T - 1];
}
function Pt(e, t, n, r, o, i) {
  const s = (t - i) * (n - o), a = (e - o) * (r - i), h = s - a, l = Math.abs(s + a);
  return Math.abs(h) >= ir * l ? h : -ar(e, t, n, r, o, i, l);
}
const cr = (10 + 96 * pt) * pt, lr = (4 + 48 * pt) * pt, hr = (44 + 576 * pt) * pt * pt, Ct = tt(4), Dt = tt(4), Yt = tt(4), kt = tt(4), Et = tt(4), At = tt(4), gt = tt(4), wt = tt(4), Ae = tt(8), Ie = tt(8), Pe = tt(8), Oe = tt(8), Be = tt(8), Ne = tt(8), he = tt(8), fe = tt(8), ue = tt(8), $t = tt(4), Vt = tt(4), jt = tt(4), z = tt(8), K = tt(16), nt = tt(16), rt = tt(16), et = tt(32), Ft = tt(32), at = tt(48), bt = tt(64);
let Kt = tt(1152), Te = tt(1152);
function ct(e, t, n) {
  e = ft(e, Kt, t, n, Te);
  const r = Kt;
  return Kt = Te, Te = r, e;
}
function fr(e, t, n, r, o, i, s, a, h) {
  let l, u, c, f, p, _, g, I, M, m, b, d, v, w, A, S, E, O, B, X, F, y, P, k, T, C, Y, x, N, D, R, $, V, q, j;
  const J = e - s, G = n - s, Q = o - s, H = t - a, Z = r - a, W = i - a;
  R = G * W, P = U * G, k = P - (P - G), T = G - k, P = U * W, C = P - (P - W), Y = W - C, $ = T * Y - (R - k * C - T * C - k * Y), V = Q * Z, P = U * Q, k = P - (P - Q), T = Q - k, P = U * Z, C = P - (P - Z), Y = Z - C, q = T * Y - (V - k * C - T * C - k * Y), x = $ - q, y = $ - x, Ct[0] = $ - (x + y) + (y - q), N = R + x, y = N - R, D = R - (N - y) + (x - y), x = D - V, y = D - x, Ct[1] = D - (x + y) + (y - V), j = N + x, y = j - N, Ct[2] = N - (j - y) + (x - y), Ct[3] = j, R = Q * H, P = U * Q, k = P - (P - Q), T = Q - k, P = U * H, C = P - (P - H), Y = H - C, $ = T * Y - (R - k * C - T * C - k * Y), V = J * W, P = U * J, k = P - (P - J), T = J - k, P = U * W, C = P - (P - W), Y = W - C, q = T * Y - (V - k * C - T * C - k * Y), x = $ - q, y = $ - x, Dt[0] = $ - (x + y) + (y - q), N = R + x, y = N - R, D = R - (N - y) + (x - y), x = D - V, y = D - x, Dt[1] = D - (x + y) + (y - V), j = N + x, y = j - N, Dt[2] = N - (j - y) + (x - y), Dt[3] = j, R = J * Z, P = U * J, k = P - (P - J), T = J - k, P = U * Z, C = P - (P - Z), Y = Z - C, $ = T * Y - (R - k * C - T * C - k * Y), V = G * H, P = U * G, k = P - (P - G), T = G - k, P = U * H, C = P - (P - H), Y = H - C, q = T * Y - (V - k * C - T * C - k * Y), x = $ - q, y = $ - x, Yt[0] = $ - (x + y) + (y - q), N = R + x, y = N - R, D = R - (N - y) + (x - y), x = D - V, y = D - x, Yt[1] = D - (x + y) + (y - V), j = N + x, y = j - N, Yt[2] = N - (j - y) + (x - y), Yt[3] = j, l = ft(
    ft(
      ft(
        L(L(4, Ct, J, z), z, J, K),
        K,
        L(L(4, Ct, H, z), z, H, nt),
        nt,
        et
      ),
      et,
      ft(
        L(L(4, Dt, G, z), z, G, K),
        K,
        L(L(4, Dt, Z, z), z, Z, nt),
        nt,
        Ft
      ),
      Ft,
      bt
    ),
    bt,
    ft(
      L(L(4, Yt, Q, z), z, Q, K),
      K,
      L(L(4, Yt, W, z), z, W, nt),
      nt,
      et
    ),
    et,
    Kt
  );
  let st = Ln(l, Kt), lt = lr * h;
  if (st >= lt || -st >= lt || (y = e - J, u = e - (J + y) + (y - s), y = t - H, p = t - (H + y) + (y - a), y = n - G, c = n - (G + y) + (y - s), y = r - Z, _ = r - (Z + y) + (y - a), y = o - Q, f = o - (Q + y) + (y - s), y = i - W, g = i - (W + y) + (y - a), u === 0 && c === 0 && f === 0 && p === 0 && _ === 0 && g === 0) || (lt = hr * h + Rn * Math.abs(st), st += (J * J + H * H) * (G * g + W * c - (Z * f + Q * _)) + 2 * (J * u + H * p) * (G * W - Z * Q) + ((G * G + Z * Z) * (Q * p + H * f - (W * u + J * g)) + 2 * (G * c + Z * _) * (Q * H - W * J)) + ((Q * Q + W * W) * (J * _ + Z * u - (H * c + G * p)) + 2 * (Q * f + W * g) * (J * Z - H * G)), st >= lt || -st >= lt))
    return st;
  if ((c !== 0 || _ !== 0 || f !== 0 || g !== 0) && (R = J * J, P = U * J, k = P - (P - J), T = J - k, $ = T * T - (R - k * k - (k + k) * T), V = H * H, P = U * H, k = P - (P - H), T = H - k, q = T * T - (V - k * k - (k + k) * T), x = $ + q, y = x - $, kt[0] = $ - (x - y) + (q - y), N = R + x, y = N - R, D = R - (N - y) + (x - y), x = D + V, y = x - D, kt[1] = D - (x - y) + (V - y), j = N + x, y = j - N, kt[2] = N - (j - y) + (x - y), kt[3] = j), (f !== 0 || g !== 0 || u !== 0 || p !== 0) && (R = G * G, P = U * G, k = P - (P - G), T = G - k, $ = T * T - (R - k * k - (k + k) * T), V = Z * Z, P = U * Z, k = P - (P - Z), T = Z - k, q = T * T - (V - k * k - (k + k) * T), x = $ + q, y = x - $, Et[0] = $ - (x - y) + (q - y), N = R + x, y = N - R, D = R - (N - y) + (x - y), x = D + V, y = x - D, Et[1] = D - (x - y) + (V - y), j = N + x, y = j - N, Et[2] = N - (j - y) + (x - y), Et[3] = j), (u !== 0 || p !== 0 || c !== 0 || _ !== 0) && (R = Q * Q, P = U * Q, k = P - (P - Q), T = Q - k, $ = T * T - (R - k * k - (k + k) * T), V = W * W, P = U * W, k = P - (P - W), T = W - k, q = T * T - (V - k * k - (k + k) * T), x = $ + q, y = x - $, At[0] = $ - (x - y) + (q - y), N = R + x, y = N - R, D = R - (N - y) + (x - y), x = D + V, y = x - D, At[1] = D - (x - y) + (V - y), j = N + x, y = j - N, At[2] = N - (j - y) + (x - y), At[3] = j), u !== 0 && (I = L(4, Ct, u, Ae), l = ct(l, _t(
    L(I, Ae, 2 * J, K),
    K,
    L(L(4, At, u, z), z, Z, nt),
    nt,
    L(L(4, Et, u, z), z, -W, rt),
    rt,
    et,
    at
  ), at)), p !== 0 && (M = L(4, Ct, p, Ie), l = ct(l, _t(
    L(M, Ie, 2 * H, K),
    K,
    L(L(4, Et, p, z), z, Q, nt),
    nt,
    L(L(4, At, p, z), z, -G, rt),
    rt,
    et,
    at
  ), at)), c !== 0 && (m = L(4, Dt, c, Pe), l = ct(l, _t(
    L(m, Pe, 2 * G, K),
    K,
    L(L(4, kt, c, z), z, W, nt),
    nt,
    L(L(4, At, c, z), z, -H, rt),
    rt,
    et,
    at
  ), at)), _ !== 0 && (b = L(4, Dt, _, Oe), l = ct(l, _t(
    L(b, Oe, 2 * Z, K),
    K,
    L(L(4, At, _, z), z, J, nt),
    nt,
    L(L(4, kt, _, z), z, -Q, rt),
    rt,
    et,
    at
  ), at)), f !== 0 && (d = L(4, Yt, f, Be), l = ct(l, _t(
    L(d, Be, 2 * Q, K),
    K,
    L(L(4, Et, f, z), z, H, nt),
    nt,
    L(L(4, kt, f, z), z, -Z, rt),
    rt,
    et,
    at
  ), at)), g !== 0 && (v = L(4, Yt, g, Ne), l = ct(l, _t(
    L(v, Ne, 2 * W, K),
    K,
    L(L(4, kt, g, z), z, G, nt),
    nt,
    L(L(4, Et, g, z), z, -J, rt),
    rt,
    et,
    at
  ), at)), u !== 0 || p !== 0) {
    if (c !== 0 || _ !== 0 || f !== 0 || g !== 0 ? (R = c * W, P = U * c, k = P - (P - c), T = c - k, P = U * W, C = P - (P - W), Y = W - C, $ = T * Y - (R - k * C - T * C - k * Y), V = G * g, P = U * G, k = P - (P - G), T = G - k, P = U * g, C = P - (P - g), Y = g - C, q = T * Y - (V - k * C - T * C - k * Y), x = $ + q, y = x - $, gt[0] = $ - (x - y) + (q - y), N = R + x, y = N - R, D = R - (N - y) + (x - y), x = D + V, y = x - D, gt[1] = D - (x - y) + (V - y), j = N + x, y = j - N, gt[2] = N - (j - y) + (x - y), gt[3] = j, R = f * -Z, P = U * f, k = P - (P - f), T = f - k, P = U * -Z, C = P - (P - -Z), Y = -Z - C, $ = T * Y - (R - k * C - T * C - k * Y), V = Q * -_, P = U * Q, k = P - (P - Q), T = Q - k, P = U * -_, C = P - (P - -_), Y = -_ - C, q = T * Y - (V - k * C - T * C - k * Y), x = $ + q, y = x - $, wt[0] = $ - (x - y) + (q - y), N = R + x, y = N - R, D = R - (N - y) + (x - y), x = D + V, y = x - D, wt[1] = D - (x - y) + (V - y), j = N + x, y = j - N, wt[2] = N - (j - y) + (x - y), wt[3] = j, A = ft(4, gt, 4, wt, fe), R = c * g, P = U * c, k = P - (P - c), T = c - k, P = U * g, C = P - (P - g), Y = g - C, $ = T * Y - (R - k * C - T * C - k * Y), V = f * _, P = U * f, k = P - (P - f), T = f - k, P = U * _, C = P - (P - _), Y = _ - C, q = T * Y - (V - k * C - T * C - k * Y), x = $ - q, y = $ - x, Vt[0] = $ - (x + y) + (y - q), N = R + x, y = N - R, D = R - (N - y) + (x - y), x = D - V, y = D - x, Vt[1] = D - (x + y) + (y - V), j = N + x, y = j - N, Vt[2] = N - (j - y) + (x - y), Vt[3] = j, O = 4) : (fe[0] = 0, A = 1, Vt[0] = 0, O = 1), u !== 0) {
      const it = L(A, fe, u, rt);
      l = ct(l, ft(
        L(I, Ae, u, K),
        K,
        L(it, rt, 2 * J, et),
        et,
        at
      ), at);
      const ot = L(O, Vt, u, z);
      l = ct(l, _t(
        L(ot, z, 2 * J, K),
        K,
        L(ot, z, u, nt),
        nt,
        L(it, rt, u, et),
        et,
        Ft,
        bt
      ), bt), _ !== 0 && (l = ct(l, L(L(4, At, u, z), z, _, K), K)), g !== 0 && (l = ct(l, L(L(4, Et, -u, z), z, g, K), K));
    }
    if (p !== 0) {
      const it = L(A, fe, p, rt);
      l = ct(l, ft(
        L(M, Ie, p, K),
        K,
        L(it, rt, 2 * H, et),
        et,
        at
      ), at);
      const ot = L(O, Vt, p, z);
      l = ct(l, _t(
        L(ot, z, 2 * H, K),
        K,
        L(ot, z, p, nt),
        nt,
        L(it, rt, p, et),
        et,
        Ft,
        bt
      ), bt);
    }
  }
  if (c !== 0 || _ !== 0) {
    if (f !== 0 || g !== 0 || u !== 0 || p !== 0 ? (R = f * H, P = U * f, k = P - (P - f), T = f - k, P = U * H, C = P - (P - H), Y = H - C, $ = T * Y - (R - k * C - T * C - k * Y), V = Q * p, P = U * Q, k = P - (P - Q), T = Q - k, P = U * p, C = P - (P - p), Y = p - C, q = T * Y - (V - k * C - T * C - k * Y), x = $ + q, y = x - $, gt[0] = $ - (x - y) + (q - y), N = R + x, y = N - R, D = R - (N - y) + (x - y), x = D + V, y = x - D, gt[1] = D - (x - y) + (V - y), j = N + x, y = j - N, gt[2] = N - (j - y) + (x - y), gt[3] = j, X = -W, F = -g, R = u * X, P = U * u, k = P - (P - u), T = u - k, P = U * X, C = P - (P - X), Y = X - C, $ = T * Y - (R - k * C - T * C - k * Y), V = J * F, P = U * J, k = P - (P - J), T = J - k, P = U * F, C = P - (P - F), Y = F - C, q = T * Y - (V - k * C - T * C - k * Y), x = $ + q, y = x - $, wt[0] = $ - (x - y) + (q - y), N = R + x, y = N - R, D = R - (N - y) + (x - y), x = D + V, y = x - D, wt[1] = D - (x - y) + (V - y), j = N + x, y = j - N, wt[2] = N - (j - y) + (x - y), wt[3] = j, S = ft(4, gt, 4, wt, ue), R = f * p, P = U * f, k = P - (P - f), T = f - k, P = U * p, C = P - (P - p), Y = p - C, $ = T * Y - (R - k * C - T * C - k * Y), V = u * g, P = U * u, k = P - (P - u), T = u - k, P = U * g, C = P - (P - g), Y = g - C, q = T * Y - (V - k * C - T * C - k * Y), x = $ - q, y = $ - x, jt[0] = $ - (x + y) + (y - q), N = R + x, y = N - R, D = R - (N - y) + (x - y), x = D - V, y = D - x, jt[1] = D - (x + y) + (y - V), j = N + x, y = j - N, jt[2] = N - (j - y) + (x - y), jt[3] = j, B = 4) : (ue[0] = 0, S = 1, jt[0] = 0, B = 1), c !== 0) {
      const it = L(S, ue, c, rt);
      l = ct(l, ft(
        L(m, Pe, c, K),
        K,
        L(it, rt, 2 * G, et),
        et,
        at
      ), at);
      const ot = L(B, jt, c, z);
      l = ct(l, _t(
        L(ot, z, 2 * G, K),
        K,
        L(ot, z, c, nt),
        nt,
        L(it, rt, c, et),
        et,
        Ft,
        bt
      ), bt), g !== 0 && (l = ct(l, L(L(4, kt, c, z), z, g, K), K)), p !== 0 && (l = ct(l, L(L(4, At, -c, z), z, p, K), K));
    }
    if (_ !== 0) {
      const it = L(S, ue, _, rt);
      l = ct(l, ft(
        L(b, Oe, _, K),
        K,
        L(it, rt, 2 * Z, et),
        et,
        at
      ), at);
      const ot = L(B, jt, _, z);
      l = ct(l, _t(
        L(ot, z, 2 * Z, K),
        K,
        L(ot, z, _, nt),
        nt,
        L(it, rt, _, et),
        et,
        Ft,
        bt
      ), bt);
    }
  }
  if (f !== 0 || g !== 0) {
    if (u !== 0 || p !== 0 || c !== 0 || _ !== 0 ? (R = u * Z, P = U * u, k = P - (P - u), T = u - k, P = U * Z, C = P - (P - Z), Y = Z - C, $ = T * Y - (R - k * C - T * C - k * Y), V = J * _, P = U * J, k = P - (P - J), T = J - k, P = U * _, C = P - (P - _), Y = _ - C, q = T * Y - (V - k * C - T * C - k * Y), x = $ + q, y = x - $, gt[0] = $ - (x - y) + (q - y), N = R + x, y = N - R, D = R - (N - y) + (x - y), x = D + V, y = x - D, gt[1] = D - (x - y) + (V - y), j = N + x, y = j - N, gt[2] = N - (j - y) + (x - y), gt[3] = j, X = -H, F = -p, R = c * X, P = U * c, k = P - (P - c), T = c - k, P = U * X, C = P - (P - X), Y = X - C, $ = T * Y - (R - k * C - T * C - k * Y), V = G * F, P = U * G, k = P - (P - G), T = G - k, P = U * F, C = P - (P - F), Y = F - C, q = T * Y - (V - k * C - T * C - k * Y), x = $ + q, y = x - $, wt[0] = $ - (x - y) + (q - y), N = R + x, y = N - R, D = R - (N - y) + (x - y), x = D + V, y = x - D, wt[1] = D - (x - y) + (V - y), j = N + x, y = j - N, wt[2] = N - (j - y) + (x - y), wt[3] = j, w = ft(4, gt, 4, wt, he), R = u * _, P = U * u, k = P - (P - u), T = u - k, P = U * _, C = P - (P - _), Y = _ - C, $ = T * Y - (R - k * C - T * C - k * Y), V = c * p, P = U * c, k = P - (P - c), T = c - k, P = U * p, C = P - (P - p), Y = p - C, q = T * Y - (V - k * C - T * C - k * Y), x = $ - q, y = $ - x, $t[0] = $ - (x + y) + (y - q), N = R + x, y = N - R, D = R - (N - y) + (x - y), x = D - V, y = D - x, $t[1] = D - (x + y) + (y - V), j = N + x, y = j - N, $t[2] = N - (j - y) + (x - y), $t[3] = j, E = 4) : (he[0] = 0, w = 1, $t[0] = 0, E = 1), f !== 0) {
      const it = L(w, he, f, rt);
      l = ct(l, ft(
        L(d, Be, f, K),
        K,
        L(it, rt, 2 * Q, et),
        et,
        at
      ), at);
      const ot = L(E, $t, f, z);
      l = ct(l, _t(
        L(ot, z, 2 * Q, K),
        K,
        L(ot, z, f, nt),
        nt,
        L(it, rt, f, et),
        et,
        Ft,
        bt
      ), bt), p !== 0 && (l = ct(l, L(L(4, Et, f, z), z, p, K), K)), _ !== 0 && (l = ct(l, L(L(4, kt, -f, z), z, _, K), K));
    }
    if (g !== 0) {
      const it = L(w, he, g, rt);
      l = ct(l, ft(
        L(v, Ne, g, K),
        K,
        L(it, rt, 2 * W, et),
        et,
        at
      ), at);
      const ot = L(E, $t, g, z);
      l = ct(l, _t(
        L(ot, z, 2 * W, K),
        K,
        L(ot, z, g, nt),
        nt,
        L(it, rt, g, et),
        et,
        Ft,
        bt
      ), bt);
    }
  }
  return Kt[l - 1];
}
function ur(e, t, n, r, o, i, s, a) {
  const h = e - s, l = n - s, u = o - s, c = t - a, f = r - a, p = i - a, _ = l * p, g = u * f, I = h * h + c * c, M = u * c, m = h * p, b = l * l + f * f, d = h * f, v = l * c, w = u * u + p * p, A = I * (_ - g) + b * (M - m) + w * (d - v), S = (Math.abs(_) + Math.abs(g)) * I + (Math.abs(M) + Math.abs(m)) * b + (Math.abs(d) + Math.abs(v)) * w, E = cr * S;
  return A > E || -A > E ? A : fr(e, t, n, r, o, i, s, a, S);
}
function dr(e, t) {
  var n, r, o = 0, i, s, a, h, l, u, c, f = e[0], p = e[1], _ = t.length;
  for (n = 0; n < _; n++) {
    r = 0;
    var g = t[n], I = g.length - 1;
    if (u = g[0], u[0] !== g[I][0] && u[1] !== g[I][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (s = u[0] - f, a = u[1] - p, r; r < I; r++) {
      if (c = g[r + 1], h = c[0] - f, l = c[1] - p, a === 0 && l === 0) {
        if (h <= 0 && s >= 0 || s <= 0 && h >= 0)
          return 0;
      } else if (l >= 0 && a <= 0 || l <= 0 && a >= 0) {
        if (i = Pt(s, h, a, l, 0, 0), i === 0)
          return 0;
        (i > 0 && l > 0 && a <= 0 || i < 0 && l <= 0 && a > 0) && o++;
      }
      u = c, a = l, s = h;
    }
  }
  return o % 2 !== 0;
}
function Xe(e, t, n = {}) {
  if (!e)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const r = nr(e), o = rr(t), i = o.type, s = t.bbox;
  let a = o.coordinates;
  if (s && pr(r, s) === !1)
    return !1;
  i === "Polygon" && (a = [a]);
  for (var h = 0; h < a.length; ++h) {
    const l = dr(r, a[h]);
    if (l === 0 && !n.ignoreBoundary) return !0;
    if (l) return !0;
  }
  return !1;
}
function pr(e, t) {
  return t[0] <= e[0] && t[1] <= e[1] && t[2] >= e[0] && t[3] >= e[1];
}
class Ue {
  constructor(t = [], n = mr) {
    if (this.data = t, this.length = this.data.length, this.compare = n, this.length > 0)
      for (let r = (this.length >> 1) - 1; r >= 0; r--) this._down(r);
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
    const { data: n, compare: r } = this, o = n[t];
    for (; t > 0; ) {
      const i = t - 1 >> 1, s = n[i];
      if (r(o, s) >= 0) break;
      n[t] = s, t = i;
    }
    n[t] = o;
  }
  _down(t) {
    const { data: n, compare: r } = this, o = this.length >> 1, i = n[t];
    for (; t < o; ) {
      let s = (t << 1) + 1, a = n[s];
      const h = s + 1;
      if (h < this.length && r(n[h], a) < 0 && (s = h, a = n[h]), r(a, i) >= 0) break;
      n[t] = a, t = s;
    }
    n[t] = i;
  }
}
function mr(e, t) {
  return e < t ? -1 : e > t ? 1 : 0;
}
const gr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ue
}, Symbol.toStringTag, { value: "Module" })), Nt = 11102230246251565e-32, ut = 134217729, wr = (3 + 8 * Nt) * Nt;
function Ce(e, t, n, r, o) {
  let i, s, a, h, l = t[0], u = r[0], c = 0, f = 0;
  u > l == u > -l ? (i = l, l = t[++c]) : (i = u, u = r[++f]);
  let p = 0;
  if (c < e && f < n)
    for (u > l == u > -l ? (s = l + i, a = i - (s - l), l = t[++c]) : (s = u + i, a = i - (s - u), u = r[++f]), i = s, a !== 0 && (o[p++] = a); c < e && f < n; )
      u > l == u > -l ? (s = i + l, h = s - i, a = i - (s - h) + (l - h), l = t[++c]) : (s = i + u, h = s - i, a = i - (s - h) + (u - h), u = r[++f]), i = s, a !== 0 && (o[p++] = a);
  for (; c < e; )
    s = i + l, h = s - i, a = i - (s - h) + (l - h), l = t[++c], i = s, a !== 0 && (o[p++] = a);
  for (; f < n; )
    s = i + u, h = s - i, a = i - (s - h) + (u - h), u = r[++f], i = s, a !== 0 && (o[p++] = a);
  return (i !== 0 || p === 0) && (o[p++] = i), p;
}
function yr(e, t) {
  let n = t[0];
  for (let r = 1; r < e; r++) n += t[r];
  return n;
}
function ce(e) {
  return new Float64Array(e);
}
const vr = (3 + 16 * Nt) * Nt, br = (2 + 12 * Nt) * Nt, xr = (9 + 64 * Nt) * Nt * Nt, zt = ce(4), nn = ce(8), rn = ce(12), on = ce(16), yt = ce(4);
function _r(e, t, n, r, o, i, s) {
  let a, h, l, u, c, f, p, _, g, I, M, m, b, d, v, w, A, S;
  const E = e - o, O = n - o, B = t - i, X = r - i;
  d = E * X, f = ut * E, p = f - (f - E), _ = E - p, f = ut * X, g = f - (f - X), I = X - g, v = _ * I - (d - p * g - _ * g - p * I), w = B * O, f = ut * B, p = f - (f - B), _ = B - p, f = ut * O, g = f - (f - O), I = O - g, A = _ * I - (w - p * g - _ * g - p * I), M = v - A, c = v - M, zt[0] = v - (M + c) + (c - A), m = d + M, c = m - d, b = d - (m - c) + (M - c), M = b - w, c = b - M, zt[1] = b - (M + c) + (c - w), S = m + M, c = S - m, zt[2] = m - (S - c) + (M - c), zt[3] = S;
  let F = yr(4, zt), y = br * s;
  if (F >= y || -F >= y || (c = e - E, a = e - (E + c) + (c - o), c = n - O, l = n - (O + c) + (c - o), c = t - B, h = t - (B + c) + (c - i), c = r - X, u = r - (X + c) + (c - i), a === 0 && h === 0 && l === 0 && u === 0) || (y = xr * s + wr * Math.abs(F), F += E * u + X * a - (B * l + O * h), F >= y || -F >= y)) return F;
  d = a * X, f = ut * a, p = f - (f - a), _ = a - p, f = ut * X, g = f - (f - X), I = X - g, v = _ * I - (d - p * g - _ * g - p * I), w = h * O, f = ut * h, p = f - (f - h), _ = h - p, f = ut * O, g = f - (f - O), I = O - g, A = _ * I - (w - p * g - _ * g - p * I), M = v - A, c = v - M, yt[0] = v - (M + c) + (c - A), m = d + M, c = m - d, b = d - (m - c) + (M - c), M = b - w, c = b - M, yt[1] = b - (M + c) + (c - w), S = m + M, c = S - m, yt[2] = m - (S - c) + (M - c), yt[3] = S;
  const P = Ce(4, zt, 4, yt, nn);
  d = E * u, f = ut * E, p = f - (f - E), _ = E - p, f = ut * u, g = f - (f - u), I = u - g, v = _ * I - (d - p * g - _ * g - p * I), w = B * l, f = ut * B, p = f - (f - B), _ = B - p, f = ut * l, g = f - (f - l), I = l - g, A = _ * I - (w - p * g - _ * g - p * I), M = v - A, c = v - M, yt[0] = v - (M + c) + (c - A), m = d + M, c = m - d, b = d - (m - c) + (M - c), M = b - w, c = b - M, yt[1] = b - (M + c) + (c - w), S = m + M, c = S - m, yt[2] = m - (S - c) + (M - c), yt[3] = S;
  const k = Ce(P, nn, 4, yt, rn);
  d = a * u, f = ut * a, p = f - (f - a), _ = a - p, f = ut * u, g = f - (f - u), I = u - g, v = _ * I - (d - p * g - _ * g - p * I), w = h * l, f = ut * h, p = f - (f - h), _ = h - p, f = ut * l, g = f - (f - l), I = l - g, A = _ * I - (w - p * g - _ * g - p * I), M = v - A, c = v - M, yt[0] = v - (M + c) + (c - A), m = d + M, c = m - d, b = d - (m - c) + (M - c), M = b - w, c = b - M, yt[1] = b - (M + c) + (c - w), S = m + M, c = S - m, yt[2] = m - (S - c) + (M - c), yt[3] = S;
  const T = Ce(k, rn, 4, yt, on);
  return on[T - 1];
}
function sn(e, t, n, r, o, i) {
  const s = (t - i) * (n - o), a = (e - o) * (r - i), h = s - a;
  if (s === 0 || a === 0 || s > 0 != a > 0) return h;
  const l = Math.abs(s + a);
  return Math.abs(h) >= vr * l ? h : -_r(e, t, n, r, o, i, l);
}
function Mr(e, t) {
  const n = new Ue([], $n);
  return kr(e, n), Er(n, t);
}
function $n(e, t) {
  return e.p.x > t.p.x ? 1 : e.p.x < t.p.x || e.p.x === t.p.x && (e.featureId !== t.featureId || e.ringId !== t.ringId) && e.isLeftEndpoint && !t.isLeftEndpoint ? -1 : e.p.y !== t.p.y ? e.p.y > t.p.y ? 1 : -1 : 1;
}
function Sr(e, t) {
  return e.rightSweepEvent.p.x > t.rightSweepEvent.p.x ? 1 : e.rightSweepEvent.p.x < t.rightSweepEvent.p.x ? -1 : e.rightSweepEvent.p.y !== t.rightSweepEvent.p.y ? e.rightSweepEvent.p.y < t.rightSweepEvent.p.y ? 1 : -1 : 1;
}
function kr(e, t) {
  if (e.type === "FeatureCollection") {
    const n = e.features;
    for (let r = 0; r < n.length; r++)
      an(n[r], t);
  } else
    an(e, t);
}
var de = 0, pe = 0, me = 0;
function an(e, t) {
  const n = e.type === "Feature" ? e.geometry : e;
  let r = n.coordinates;
  (n.type === "Polygon" || n.type === "MultiLineString") && (r = [r]), n.type === "LineString" && (r = [[r]]);
  for (let o = 0; o < r.length; o++)
    for (let i = 0; i < r[o].length; i++) {
      let s = r[o][i][0], a = null;
      pe = pe + 1;
      for (let h = 0; h < r[o][i].length - 1; h++) {
        a = r[o][i][h + 1];
        const l = new cn(s, de, pe, me), u = new cn(a, de, pe, me + 1);
        l.otherEvent = u, u.otherEvent = l, $n(l, u) > 0 ? (u.isLeftEndpoint = !0, l.isLeftEndpoint = !1) : (l.isLeftEndpoint = !0, u.isLeftEndpoint = !1), t.push(l), t.push(u), s = a, me = me + 1;
      }
    }
  de = de + 1;
}
var cn = class {
  constructor(e, t, n, r) {
    this.p = {
      x: e[0],
      y: e[1]
    }, this.featureId = t, this.ringId = n, this.eventId = r, this.otherEvent = null, this.isLeftEndpoint = null;
  }
  isSamePoint(e) {
    return this.p.x === e.p.x && this.p.y === e.p.y;
  }
  asNewXY() {
    return [this.p.x, this.p.y];
  }
};
function Er(e, t = !1) {
  const n = [], r = new Ue([], Sr);
  for (; e.length; ) {
    const o = e.pop();
    if (o.isLeftEndpoint) {
      const i = new Ar(o);
      for (let s = 0; s < r.data.length; s++) {
        const a = r.data[s];
        if (t && a.leftSweepEvent.featureId === o.featureId)
          continue;
        const h = Ir(i, a);
        h !== !1 && n.push(h);
      }
      r.push(i);
    } else o.isLeftEndpoint === !1 && r.pop();
  }
  return n;
}
var Ar = class {
  /** @param event must have otherEvent non-null */
  constructor(e) {
    this.leftSweepEvent = e, this.rightSweepEvent = e.otherEvent;
  }
};
function Ir(e, t) {
  if (e === null || t === null) return !1;
  const n = e.leftSweepEvent.p.x, r = e.leftSweepEvent.p.y, o = e.rightSweepEvent.p.x, i = e.rightSweepEvent.p.y, s = t.leftSweepEvent.p.x, a = t.leftSweepEvent.p.y, h = t.rightSweepEvent.p.x, l = t.rightSweepEvent.p.y, u = sn(n, r, o, i, s, a), c = sn(n, r, o, i, h, l);
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
  const f = (l - a) * (o - n) - (h - s) * (i - r), p = (h - s) * (r - a) - (l - a) * (n - s), _ = (o - n) * (r - a) - (i - r) * (n - s);
  if (f === 0)
    return !1;
  const g = p / f, I = _ / f;
  if (g >= 0 && g <= 1 && I >= 0 && I <= 1) {
    const M = n + g * (o - n), m = r + g * (i - r);
    return [M, m];
  }
  return !1;
}
function Pr(e, t, n = {}) {
  const { removeDuplicates: r = !0, ignoreSelfIntersections: o = !0 } = n;
  let i = [];
  e.type === "FeatureCollection" ? i = i.concat(e.features) : e.type === "Feature" ? i.push(e) : (e.type === "LineString" || e.type === "Polygon" || e.type === "MultiLineString" || e.type === "MultiPolygon") && i.push(ie(e)), t.type === "FeatureCollection" ? i = i.concat(t.features) : t.type === "Feature" ? i.push(t) : (t.type === "LineString" || t.type === "Polygon" || t.type === "MultiLineString" || t.type === "MultiPolygon") && i.push(ie(t));
  const s = Mr(
    St(i),
    o
  );
  let a = [];
  if (r) {
    const h = {};
    s.forEach((l) => {
      const u = l.join(",");
      h[u] || (h[u] = !0, a.push(l));
    });
  } else
    a = s;
  return St(a.map((h) => Lt(h)));
}
function Or(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function Br(e) {
  if (Object.prototype.hasOwnProperty.call(e, "__esModule")) return e;
  var t = e.default;
  if (typeof t == "function") {
    var n = function r() {
      var o = !1;
      try {
        o = this instanceof r;
      } catch {
      }
      return o ? Reflect.construct(t, arguments, this.constructor) : t.apply(this, arguments);
    };
    n.prototype = t.prototype;
  } else n = {};
  return Object.defineProperty(n, "__esModule", { value: !0 }), Object.keys(e).forEach(function(r) {
    var o = Object.getOwnPropertyDescriptor(e, r);
    Object.defineProperty(n, r, o.get ? o : {
      enumerable: !0,
      get: function() {
        return e[r];
      }
    });
  }), n;
}
function Nr(e, t = {}) {
  let n = 0, r = 0, o = 0;
  return qe(
    e,
    function(i) {
      n += i[0], r += i[1], o++;
    },
    !0
  ), Lt([n / o, r / o], t.properties);
}
var ge = { exports: {} }, Se = { exports: {} }, Tr = Se.exports, ln;
function Xr() {
  return ln || (ln = 1, (function(e, t) {
    (function(n, r) {
      e.exports = r();
    })(Tr, function() {
      function n(m, b, d, v, w) {
        (function A(S, E, O, B, X) {
          for (; B > O; ) {
            if (B - O > 600) {
              var F = B - O + 1, y = E - O + 1, P = Math.log(F), k = 0.5 * Math.exp(2 * P / 3), T = 0.5 * Math.sqrt(P * k * (F - k) / F) * (y - F / 2 < 0 ? -1 : 1), C = Math.max(O, Math.floor(E - y * k / F + T)), Y = Math.min(B, Math.floor(E + (F - y) * k / F + T));
              A(S, E, C, Y, X);
            }
            var x = S[E], N = O, D = B;
            for (r(S, O, E), X(S[B], x) > 0 && r(S, O, B); N < D; ) {
              for (r(S, N, D), N++, D--; X(S[N], x) < 0; ) N++;
              for (; X(S[D], x) > 0; ) D--;
            }
            X(S[O], x) === 0 ? r(S, O, D) : r(S, ++D, B), D <= E && (O = D + 1), E <= D && (B = D - 1);
          }
        })(m, b, d || 0, v || m.length - 1, w || o);
      }
      function r(m, b, d) {
        var v = m[b];
        m[b] = m[d], m[d] = v;
      }
      function o(m, b) {
        return m < b ? -1 : m > b ? 1 : 0;
      }
      var i = function(m) {
        m === void 0 && (m = 9), this._maxEntries = Math.max(4, m), this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries)), this.clear();
      };
      function s(m, b, d) {
        if (!d) return b.indexOf(m);
        for (var v = 0; v < b.length; v++) if (d(m, b[v])) return v;
        return -1;
      }
      function a(m, b) {
        h(m, 0, m.children.length, b, m);
      }
      function h(m, b, d, v, w) {
        w || (w = I(null)), w.minX = 1 / 0, w.minY = 1 / 0, w.maxX = -1 / 0, w.maxY = -1 / 0;
        for (var A = b; A < d; A++) {
          var S = m.children[A];
          l(w, m.leaf ? v(S) : S);
        }
        return w;
      }
      function l(m, b) {
        return m.minX = Math.min(m.minX, b.minX), m.minY = Math.min(m.minY, b.minY), m.maxX = Math.max(m.maxX, b.maxX), m.maxY = Math.max(m.maxY, b.maxY), m;
      }
      function u(m, b) {
        return m.minX - b.minX;
      }
      function c(m, b) {
        return m.minY - b.minY;
      }
      function f(m) {
        return (m.maxX - m.minX) * (m.maxY - m.minY);
      }
      function p(m) {
        return m.maxX - m.minX + (m.maxY - m.minY);
      }
      function _(m, b) {
        return m.minX <= b.minX && m.minY <= b.minY && b.maxX <= m.maxX && b.maxY <= m.maxY;
      }
      function g(m, b) {
        return b.minX <= m.maxX && b.minY <= m.maxY && b.maxX >= m.minX && b.maxY >= m.minY;
      }
      function I(m) {
        return { children: m, height: 1, leaf: !0, minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
      }
      function M(m, b, d, v, w) {
        for (var A = [b, d]; A.length; ) if (!((d = A.pop()) - (b = A.pop()) <= v)) {
          var S = b + Math.ceil((d - b) / v / 2) * v;
          n(m, S, b, d, w), A.push(b, S, S, d);
        }
      }
      return i.prototype.all = function() {
        return this._all(this.data, []);
      }, i.prototype.search = function(m) {
        var b = this.data, d = [];
        if (!g(m, b)) return d;
        for (var v = this.toBBox, w = []; b; ) {
          for (var A = 0; A < b.children.length; A++) {
            var S = b.children[A], E = b.leaf ? v(S) : S;
            g(m, E) && (b.leaf ? d.push(S) : _(m, E) ? this._all(S, d) : w.push(S));
          }
          b = w.pop();
        }
        return d;
      }, i.prototype.collides = function(m) {
        var b = this.data;
        if (!g(m, b)) return !1;
        for (var d = []; b; ) {
          for (var v = 0; v < b.children.length; v++) {
            var w = b.children[v], A = b.leaf ? this.toBBox(w) : w;
            if (g(m, A)) {
              if (b.leaf || _(m, A)) return !0;
              d.push(w);
            }
          }
          b = d.pop();
        }
        return !1;
      }, i.prototype.load = function(m) {
        if (!m || !m.length) return this;
        if (m.length < this._minEntries) {
          for (var b = 0; b < m.length; b++) this.insert(m[b]);
          return this;
        }
        var d = this._build(m.slice(), 0, m.length - 1, 0);
        if (this.data.children.length) if (this.data.height === d.height) this._splitRoot(this.data, d);
        else {
          if (this.data.height < d.height) {
            var v = this.data;
            this.data = d, d = v;
          }
          this._insert(d, this.data.height - d.height - 1, !0);
        }
        else this.data = d;
        return this;
      }, i.prototype.insert = function(m) {
        return m && this._insert(m, this.data.height - 1), this;
      }, i.prototype.clear = function() {
        return this.data = I([]), this;
      }, i.prototype.remove = function(m, b) {
        if (!m) return this;
        for (var d, v, w, A = this.data, S = this.toBBox(m), E = [], O = []; A || E.length; ) {
          if (A || (A = E.pop(), v = E[E.length - 1], d = O.pop(), w = !0), A.leaf) {
            var B = s(m, A.children, b);
            if (B !== -1) return A.children.splice(B, 1), E.push(A), this._condense(E), this;
          }
          w || A.leaf || !_(A, S) ? v ? (d++, A = v.children[d], w = !1) : A = null : (E.push(A), O.push(d), d = 0, v = A, A = A.children[0]);
        }
        return this;
      }, i.prototype.toBBox = function(m) {
        return m;
      }, i.prototype.compareMinX = function(m, b) {
        return m.minX - b.minX;
      }, i.prototype.compareMinY = function(m, b) {
        return m.minY - b.minY;
      }, i.prototype.toJSON = function() {
        return this.data;
      }, i.prototype.fromJSON = function(m) {
        return this.data = m, this;
      }, i.prototype._all = function(m, b) {
        for (var d = []; m; ) m.leaf ? b.push.apply(b, m.children) : d.push.apply(d, m.children), m = d.pop();
        return b;
      }, i.prototype._build = function(m, b, d, v) {
        var w, A = d - b + 1, S = this._maxEntries;
        if (A <= S) return a(w = I(m.slice(b, d + 1)), this.toBBox), w;
        v || (v = Math.ceil(Math.log(A) / Math.log(S)), S = Math.ceil(A / Math.pow(S, v - 1))), (w = I([])).leaf = !1, w.height = v;
        var E = Math.ceil(A / S), O = E * Math.ceil(Math.sqrt(S));
        M(m, b, d, O, this.compareMinX);
        for (var B = b; B <= d; B += O) {
          var X = Math.min(B + O - 1, d);
          M(m, B, X, E, this.compareMinY);
          for (var F = B; F <= X; F += E) {
            var y = Math.min(F + E - 1, X);
            w.children.push(this._build(m, F, y, v - 1));
          }
        }
        return a(w, this.toBBox), w;
      }, i.prototype._chooseSubtree = function(m, b, d, v) {
        for (; v.push(b), !b.leaf && v.length - 1 !== d; ) {
          for (var w = 1 / 0, A = 1 / 0, S = void 0, E = 0; E < b.children.length; E++) {
            var O = b.children[E], B = f(O), X = (F = m, y = O, (Math.max(y.maxX, F.maxX) - Math.min(y.minX, F.minX)) * (Math.max(y.maxY, F.maxY) - Math.min(y.minY, F.minY)) - B);
            X < A ? (A = X, w = B < w ? B : w, S = O) : X === A && B < w && (w = B, S = O);
          }
          b = S || b.children[0];
        }
        var F, y;
        return b;
      }, i.prototype._insert = function(m, b, d) {
        var v = d ? m : this.toBBox(m), w = [], A = this._chooseSubtree(v, this.data, b, w);
        for (A.children.push(m), l(A, v); b >= 0 && w[b].children.length > this._maxEntries; ) this._split(w, b), b--;
        this._adjustParentBBoxes(v, w, b);
      }, i.prototype._split = function(m, b) {
        var d = m[b], v = d.children.length, w = this._minEntries;
        this._chooseSplitAxis(d, w, v);
        var A = this._chooseSplitIndex(d, w, v), S = I(d.children.splice(A, d.children.length - A));
        S.height = d.height, S.leaf = d.leaf, a(d, this.toBBox), a(S, this.toBBox), b ? m[b - 1].children.push(S) : this._splitRoot(d, S);
      }, i.prototype._splitRoot = function(m, b) {
        this.data = I([m, b]), this.data.height = m.height + 1, this.data.leaf = !1, a(this.data, this.toBBox);
      }, i.prototype._chooseSplitIndex = function(m, b, d) {
        for (var v, w, A, S, E, O, B, X = 1 / 0, F = 1 / 0, y = b; y <= d - b; y++) {
          var P = h(m, 0, y, this.toBBox), k = h(m, y, d, this.toBBox), T = (w = P, A = k, S = void 0, E = void 0, O = void 0, B = void 0, S = Math.max(w.minX, A.minX), E = Math.max(w.minY, A.minY), O = Math.min(w.maxX, A.maxX), B = Math.min(w.maxY, A.maxY), Math.max(0, O - S) * Math.max(0, B - E)), C = f(P) + f(k);
          T < X ? (X = T, v = y, F = C < F ? C : F) : T === X && C < F && (F = C, v = y);
        }
        return v || d - b;
      }, i.prototype._chooseSplitAxis = function(m, b, d) {
        var v = m.leaf ? this.compareMinX : u, w = m.leaf ? this.compareMinY : c;
        this._allDistMargin(m, b, d, v) < this._allDistMargin(m, b, d, w) && m.children.sort(v);
      }, i.prototype._allDistMargin = function(m, b, d, v) {
        m.children.sort(v);
        for (var w = this.toBBox, A = h(m, 0, b, w), S = h(m, d - b, d, w), E = p(A) + p(S), O = b; O < d - b; O++) {
          var B = m.children[O];
          l(A, m.leaf ? w(B) : B), E += p(A);
        }
        for (var X = d - b - 1; X >= b; X--) {
          var F = m.children[X];
          l(S, m.leaf ? w(F) : F), E += p(S);
        }
        return E;
      }, i.prototype._adjustParentBBoxes = function(m, b, d) {
        for (var v = d; v >= 0; v--) l(b[v], m);
      }, i.prototype._condense = function(m) {
        for (var b = m.length - 1, d = void 0; b >= 0; b--) m[b].children.length === 0 ? b > 0 ? (d = m[b - 1].children).splice(d.indexOf(m[b]), 1) : this.clear() : a(m[b], this.toBBox);
      }, i;
    });
  })(Se)), Se.exports;
}
const Cr = /* @__PURE__ */ Br(gr);
var Wt = { exports: {} }, De, hn;
function Dr() {
  return hn || (hn = 1, De = function(t, n, r, o) {
    var i = t[0], s = t[1], a = !1;
    r === void 0 && (r = 0), o === void 0 && (o = n.length);
    for (var h = (o - r) / 2, l = 0, u = h - 1; l < h; u = l++) {
      var c = n[r + l * 2 + 0], f = n[r + l * 2 + 1], p = n[r + u * 2 + 0], _ = n[r + u * 2 + 1], g = f > s != _ > s && i < (p - c) * (s - f) / (_ - f) + c;
      g && (a = !a);
    }
    return a;
  }), De;
}
var Ye, fn;
function Yr() {
  return fn || (fn = 1, Ye = function(t, n, r, o) {
    var i = t[0], s = t[1], a = !1;
    r === void 0 && (r = 0), o === void 0 && (o = n.length);
    for (var h = o - r, l = 0, u = h - 1; l < h; u = l++) {
      var c = n[l + r][0], f = n[l + r][1], p = n[u + r][0], _ = n[u + r][1], g = f > s != _ > s && i < (p - c) * (s - f) / (_ - f) + c;
      g && (a = !a);
    }
    return a;
  }), Ye;
}
var un;
function Fr() {
  if (un) return Wt.exports;
  un = 1;
  var e = Dr(), t = Yr();
  return Wt.exports = function(r, o, i, s) {
    return o.length > 0 && Array.isArray(o[0]) ? t(r, o, i, s) : e(r, o, i, s);
  }, Wt.exports.nested = t, Wt.exports.flat = e, Wt.exports;
}
var te = { exports: {} }, Rr = te.exports, dn;
function Lr() {
  return dn || (dn = 1, (function(e, t) {
    (function(n, r) {
      r(t);
    })(Rr, function(n) {
      const o = 33306690738754706e-32;
      function i(g, I, M, m, b) {
        let d, v, w, A, S = I[0], E = m[0], O = 0, B = 0;
        E > S == E > -S ? (d = S, S = I[++O]) : (d = E, E = m[++B]);
        let X = 0;
        if (O < g && B < M) for (E > S == E > -S ? (w = d - ((v = S + d) - S), S = I[++O]) : (w = d - ((v = E + d) - E), E = m[++B]), d = v, w !== 0 && (b[X++] = w); O < g && B < M; ) E > S == E > -S ? (w = d - ((v = d + S) - (A = v - d)) + (S - A), S = I[++O]) : (w = d - ((v = d + E) - (A = v - d)) + (E - A), E = m[++B]), d = v, w !== 0 && (b[X++] = w);
        for (; O < g; ) w = d - ((v = d + S) - (A = v - d)) + (S - A), S = I[++O], d = v, w !== 0 && (b[X++] = w);
        for (; B < M; ) w = d - ((v = d + E) - (A = v - d)) + (E - A), E = m[++B], d = v, w !== 0 && (b[X++] = w);
        return d === 0 && X !== 0 || (b[X++] = d), X;
      }
      function s(g) {
        return new Float64Array(g);
      }
      const a = 33306690738754716e-32, h = 22204460492503146e-32, l = 11093356479670487e-47, u = s(4), c = s(8), f = s(12), p = s(16), _ = s(4);
      n.orient2d = function(g, I, M, m, b, d) {
        const v = (I - d) * (M - b), w = (g - b) * (m - d), A = v - w;
        if (v === 0 || w === 0 || v > 0 != w > 0) return A;
        const S = Math.abs(v + w);
        return Math.abs(A) >= a * S ? A : -(function(E, O, B, X, F, y, P) {
          let k, T, C, Y, x, N, D, R, $, V, q, j, J, G, Q, H, Z, W;
          const st = E - F, lt = B - F, it = O - y, ot = X - y;
          x = (Q = (R = st - (D = (N = 134217729 * st) - (N - st))) * (V = ot - ($ = (N = 134217729 * ot) - (N - ot))) - ((G = st * ot) - D * $ - R * $ - D * V)) - (q = Q - (Z = (R = it - (D = (N = 134217729 * it) - (N - it))) * (V = lt - ($ = (N = 134217729 * lt) - (N - lt))) - ((H = it * lt) - D * $ - R * $ - D * V))), u[0] = Q - (q + x) + (x - Z), x = (J = G - ((j = G + q) - (x = j - G)) + (q - x)) - (q = J - H), u[1] = J - (q + x) + (x - H), x = (W = j + q) - j, u[2] = j - (W - x) + (q - x), u[3] = W;
          let Xt = (function(er, Ke) {
            let Qe = Ke[0];
            for (let Ee = 1; Ee < er; Ee++) Qe += Ke[Ee];
            return Qe;
          })(4, u), Ht = h * P;
          if (Xt >= Ht || -Xt >= Ht || (k = E - (st + (x = E - st)) + (x - F), C = B - (lt + (x = B - lt)) + (x - F), T = O - (it + (x = O - it)) + (x - y), Y = X - (ot + (x = X - ot)) + (x - y), k === 0 && T === 0 && C === 0 && Y === 0) || (Ht = l * P + o * Math.abs(Xt), (Xt += st * Y + ot * k - (it * C + lt * T)) >= Ht || -Xt >= Ht)) return Xt;
          x = (Q = (R = k - (D = (N = 134217729 * k) - (N - k))) * (V = ot - ($ = (N = 134217729 * ot) - (N - ot))) - ((G = k * ot) - D * $ - R * $ - D * V)) - (q = Q - (Z = (R = T - (D = (N = 134217729 * T) - (N - T))) * (V = lt - ($ = (N = 134217729 * lt) - (N - lt))) - ((H = T * lt) - D * $ - R * $ - D * V))), _[0] = Q - (q + x) + (x - Z), x = (J = G - ((j = G + q) - (x = j - G)) + (q - x)) - (q = J - H), _[1] = J - (q + x) + (x - H), x = (W = j + q) - j, _[2] = j - (W - x) + (q - x), _[3] = W;
          const Wn = i(4, u, 4, _, c);
          x = (Q = (R = st - (D = (N = 134217729 * st) - (N - st))) * (V = Y - ($ = (N = 134217729 * Y) - (N - Y))) - ((G = st * Y) - D * $ - R * $ - D * V)) - (q = Q - (Z = (R = it - (D = (N = 134217729 * it) - (N - it))) * (V = C - ($ = (N = 134217729 * C) - (N - C))) - ((H = it * C) - D * $ - R * $ - D * V))), _[0] = Q - (q + x) + (x - Z), x = (J = G - ((j = G + q) - (x = j - G)) + (q - x)) - (q = J - H), _[1] = J - (q + x) + (x - H), x = (W = j + q) - j, _[2] = j - (W - x) + (q - x), _[3] = W;
          const Zn = i(Wn, c, 4, _, f);
          x = (Q = (R = k - (D = (N = 134217729 * k) - (N - k))) * (V = Y - ($ = (N = 134217729 * Y) - (N - Y))) - ((G = k * Y) - D * $ - R * $ - D * V)) - (q = Q - (Z = (R = T - (D = (N = 134217729 * T) - (N - T))) * (V = C - ($ = (N = 134217729 * C) - (N - C))) - ((H = T * C) - D * $ - R * $ - D * V))), _[0] = Q - (q + x) + (x - Z), x = (J = G - ((j = G + q) - (x = j - G)) + (q - x)) - (q = J - H), _[1] = J - (q + x) + (x - H), x = (W = j + q) - j, _[2] = j - (W - x) + (q - x), _[3] = W;
          const tr = i(Zn, f, 4, _, p);
          return p[tr - 1];
        })(g, I, M, m, b, d, S);
      }, n.orient2dfast = function(g, I, M, m, b, d) {
        return (I - d) * (M - b) - (g - b) * (m - d);
      }, Object.defineProperty(n, "__esModule", { value: !0 });
    });
  })(te, te.exports)), te.exports;
}
var pn;
function $r() {
  if (pn) return ge.exports;
  pn = 1;
  var e = Xr(), t = Cr, n = Fr(), r = Lr().orient2d;
  t.default && (t = t.default), ge.exports = o, ge.exports.default = o;
  function o(d, v, w) {
    v = Math.max(0, v === void 0 ? 2 : v), w = w || 0;
    var A = p(d), S = new e(16);
    S.toBBox = function(D) {
      return {
        minX: D[0],
        minY: D[1],
        maxX: D[0],
        maxY: D[1]
      };
    }, S.compareMinX = function(D, R) {
      return D[0] - R[0];
    }, S.compareMinY = function(D, R) {
      return D[1] - R[1];
    }, S.load(d);
    for (var E = [], O = 0, B; O < A.length; O++) {
      var X = A[O];
      S.remove(X), B = _(X, B), E.push(B);
    }
    var F = new e(16);
    for (O = 0; O < E.length; O++) F.insert(f(E[O]));
    for (var y = v * v, P = w * w; E.length; ) {
      var k = E.shift(), T = k.p, C = k.next.p, Y = g(T, C);
      if (!(Y < P)) {
        var x = Y / y;
        X = i(S, k.prev.p, T, C, k.next.next.p, x, F), X && Math.min(g(X, T), g(X, C)) <= x && (E.push(k), E.push(_(X, k)), S.remove(X), F.remove(k), F.insert(f(k)), F.insert(f(k.next)));
      }
    }
    k = B;
    var N = [];
    do
      N.push(k.p), k = k.next;
    while (k !== B);
    return N.push(k.p), N;
  }
  function i(d, v, w, A, S, E, O) {
    for (var B = new t([], s), X = d.data; X; ) {
      for (var F = 0; F < X.children.length; F++) {
        var y = X.children[F], P = X.leaf ? I(y, w, A) : a(w, A, y);
        P > E || B.push({
          node: y,
          dist: P
        });
      }
      for (; B.length && !B.peek().node.children; ) {
        var k = B.pop(), T = k.node, C = I(T, v, w), Y = I(T, A, S);
        if (k.dist < C && k.dist < Y && l(w, T, O) && l(A, T, O)) return T;
      }
      X = B.pop(), X && (X = X.node);
    }
    return null;
  }
  function s(d, v) {
    return d.dist - v.dist;
  }
  function a(d, v, w) {
    if (h(d, w) || h(v, w)) return 0;
    var A = M(d[0], d[1], v[0], v[1], w.minX, w.minY, w.maxX, w.minY);
    if (A === 0) return 0;
    var S = M(d[0], d[1], v[0], v[1], w.minX, w.minY, w.minX, w.maxY);
    if (S === 0) return 0;
    var E = M(d[0], d[1], v[0], v[1], w.maxX, w.minY, w.maxX, w.maxY);
    if (E === 0) return 0;
    var O = M(d[0], d[1], v[0], v[1], w.minX, w.maxY, w.maxX, w.maxY);
    return O === 0 ? 0 : Math.min(A, S, E, O);
  }
  function h(d, v) {
    return d[0] >= v.minX && d[0] <= v.maxX && d[1] >= v.minY && d[1] <= v.maxY;
  }
  function l(d, v, w) {
    for (var A = Math.min(d[0], v[0]), S = Math.min(d[1], v[1]), E = Math.max(d[0], v[0]), O = Math.max(d[1], v[1]), B = w.search({ minX: A, minY: S, maxX: E, maxY: O }), X = 0; X < B.length; X++)
      if (c(B[X].p, B[X].next.p, d, v)) return !1;
    return !0;
  }
  function u(d, v, w) {
    return r(d[0], d[1], v[0], v[1], w[0], w[1]);
  }
  function c(d, v, w, A) {
    return d !== A && v !== w && u(d, v, w) > 0 != u(d, v, A) > 0 && u(w, A, d) > 0 != u(w, A, v) > 0;
  }
  function f(d) {
    var v = d.p, w = d.next.p;
    return d.minX = Math.min(v[0], w[0]), d.minY = Math.min(v[1], w[1]), d.maxX = Math.max(v[0], w[0]), d.maxY = Math.max(v[1], w[1]), d;
  }
  function p(d) {
    for (var v = d[0], w = d[0], A = d[0], S = d[0], E = 0; E < d.length; E++) {
      var O = d[E];
      O[0] < v[0] && (v = O), O[0] > A[0] && (A = O), O[1] < w[1] && (w = O), O[1] > S[1] && (S = O);
    }
    var B = [v, w, A, S], X = B.slice();
    for (E = 0; E < d.length; E++)
      n(d[E], B) || X.push(d[E]);
    return b(X);
  }
  function _(d, v) {
    var w = {
      p: d,
      prev: null,
      next: null,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };
    return v ? (w.next = v.next, w.prev = v, v.next.prev = w, v.next = w) : (w.prev = w, w.next = w), w;
  }
  function g(d, v) {
    var w = d[0] - v[0], A = d[1] - v[1];
    return w * w + A * A;
  }
  function I(d, v, w) {
    var A = v[0], S = v[1], E = w[0] - A, O = w[1] - S;
    if (E !== 0 || O !== 0) {
      var B = ((d[0] - A) * E + (d[1] - S) * O) / (E * E + O * O);
      B > 1 ? (A = w[0], S = w[1]) : B > 0 && (A += E * B, S += O * B);
    }
    return E = d[0] - A, O = d[1] - S, E * E + O * O;
  }
  function M(d, v, w, A, S, E, O, B) {
    var X = w - d, F = A - v, y = O - S, P = B - E, k = d - S, T = v - E, C = X * X + F * F, Y = X * y + F * P, x = y * y + P * P, N = X * k + F * T, D = y * k + P * T, R = C * x - Y * Y, $, V, q, j, J = R, G = R;
    R === 0 ? (V = 0, J = 1, j = D, G = x) : (V = Y * D - x * N, j = C * D - Y * N, V < 0 ? (V = 0, j = D, G = x) : V > J && (V = J, j = D + Y, G = x)), j < 0 ? (j = 0, -N < 0 ? V = 0 : -N > C ? V = J : (V = -N, J = C)) : j > G && (j = G, -N + Y < 0 ? V = 0 : -N + Y > C ? V = J : (V = -N + Y, J = C)), $ = V === 0 ? 0 : V / J, q = j === 0 ? 0 : j / G;
    var Q = (1 - $) * d + $ * w, H = (1 - $) * v + $ * A, Z = (1 - q) * S + q * O, W = (1 - q) * E + q * B, st = Z - Q, lt = W - H;
    return st * st + lt * lt;
  }
  function m(d, v) {
    return d[0] === v[0] ? d[1] - v[1] : d[0] - v[0];
  }
  function b(d) {
    d.sort(m);
    for (var v = [], w = 0; w < d.length; w++) {
      for (; v.length >= 2 && u(v[v.length - 2], v[v.length - 1], d[w]) <= 0; )
        v.pop();
      v.push(d[w]);
    }
    for (var A = [], S = d.length - 1; S >= 0; S--) {
      for (; A.length >= 2 && u(A[A.length - 2], A[A.length - 1], d[S]) <= 0; )
        A.pop();
      A.push(d[S]);
    }
    return A.pop(), v.pop(), v.concat(A);
  }
  return ge.exports;
}
var Vr = $r();
const jr = /* @__PURE__ */ Or(Vr);
function mn(e, t = {}) {
  t.concavity = t.concavity || 1 / 0;
  const n = [];
  if (qe(e, (o) => {
    n.push([o[0], o[1]]);
  }), !n.length)
    return null;
  const r = jr(n, t.concavity);
  return r.length > 3 ? ae([r], t.properties) : null;
}
function Vn(e, t, n = {}) {
  const r = { type: "Feature" };
  return (n.id === 0 || n.id) && (r.id = n.id), n.bbox && (r.bbox = n.bbox), r.properties = t || {}, r.geometry = e, r;
}
function oe(e, t, n = {}) {
  if (!e)
    throw new Error("coordinates is required");
  if (!Array.isArray(e))
    throw new Error("coordinates must be an Array");
  if (e.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!gn(e[0]) || !gn(e[1]))
    throw new Error("coordinates must contain numbers");
  return Vn({
    type: "Point",
    coordinates: e
  }, t, n);
}
function jn(e, t, n = {}) {
  for (const r of e) {
    if (r.length < 4)
      throw new Error(
        "Each LinearRing of a Polygon must have 4 or more Positions."
      );
    if (r[r.length - 1].length !== r[0].length)
      throw new Error("First and last Position are not equivalent.");
    for (let o = 0; o < r[r.length - 1].length; o++)
      if (r[r.length - 1][o] !== r[0][o])
        throw new Error("First and last Position are not equivalent.");
  }
  return Vn({
    type: "Polygon",
    coordinates: e
  }, t, n);
}
function Qt(e, t = {}) {
  const n = { type: "FeatureCollection" };
  return t.id && (n.id = t.id), t.bbox && (n.bbox = t.bbox), n.features = e, n;
}
function gn(e) {
  return !isNaN(e) && e !== null && !Array.isArray(e);
}
function qr(e) {
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
function Ur(e) {
  return e.type === "Feature" ? e.geometry : e;
}
const Tt = 11102230246251565e-32, dt = 134217729, zr = (3 + 8 * Tt) * Tt;
function Fe(e, t, n, r, o) {
  let i, s, a, h, l = t[0], u = r[0], c = 0, f = 0;
  u > l == u > -l ? (i = l, l = t[++c]) : (i = u, u = r[++f]);
  let p = 0;
  if (c < e && f < n)
    for (u > l == u > -l ? (s = l + i, a = i - (s - l), l = t[++c]) : (s = u + i, a = i - (s - u), u = r[++f]), i = s, a !== 0 && (o[p++] = a); c < e && f < n; )
      u > l == u > -l ? (s = i + l, h = s - i, a = i - (s - h) + (l - h), l = t[++c]) : (s = i + u, h = s - i, a = i - (s - h) + (u - h), u = r[++f]), i = s, a !== 0 && (o[p++] = a);
  for (; c < e; )
    s = i + l, h = s - i, a = i - (s - h) + (l - h), l = t[++c], i = s, a !== 0 && (o[p++] = a);
  for (; f < n; )
    s = i + u, h = s - i, a = i - (s - h) + (u - h), u = r[++f], i = s, a !== 0 && (o[p++] = a);
  return (i !== 0 || p === 0) && (o[p++] = i), p;
}
function Gr(e, t) {
  let n = t[0];
  for (let r = 1; r < e; r++) n += t[r];
  return n;
}
function le(e) {
  return new Float64Array(e);
}
const Jr = (3 + 16 * Tt) * Tt, Kr = (2 + 12 * Tt) * Tt, Qr = (9 + 64 * Tt) * Tt * Tt, Gt = le(4), yn = le(8), vn = le(12), bn = le(16), vt = le(4);
function Hr(e, t, n, r, o, i, s) {
  let a, h, l, u, c, f, p, _, g, I, M, m, b, d, v, w, A, S;
  const E = e - o, O = n - o, B = t - i, X = r - i;
  d = E * X, f = dt * E, p = f - (f - E), _ = E - p, f = dt * X, g = f - (f - X), I = X - g, v = _ * I - (d - p * g - _ * g - p * I), w = B * O, f = dt * B, p = f - (f - B), _ = B - p, f = dt * O, g = f - (f - O), I = O - g, A = _ * I - (w - p * g - _ * g - p * I), M = v - A, c = v - M, Gt[0] = v - (M + c) + (c - A), m = d + M, c = m - d, b = d - (m - c) + (M - c), M = b - w, c = b - M, Gt[1] = b - (M + c) + (c - w), S = m + M, c = S - m, Gt[2] = m - (S - c) + (M - c), Gt[3] = S;
  let F = Gr(4, Gt), y = Kr * s;
  if (F >= y || -F >= y || (c = e - E, a = e - (E + c) + (c - o), c = n - O, l = n - (O + c) + (c - o), c = t - B, h = t - (B + c) + (c - i), c = r - X, u = r - (X + c) + (c - i), a === 0 && h === 0 && l === 0 && u === 0) || (y = Qr * s + zr * Math.abs(F), F += E * u + X * a - (B * l + O * h), F >= y || -F >= y)) return F;
  d = a * X, f = dt * a, p = f - (f - a), _ = a - p, f = dt * X, g = f - (f - X), I = X - g, v = _ * I - (d - p * g - _ * g - p * I), w = h * O, f = dt * h, p = f - (f - h), _ = h - p, f = dt * O, g = f - (f - O), I = O - g, A = _ * I - (w - p * g - _ * g - p * I), M = v - A, c = v - M, vt[0] = v - (M + c) + (c - A), m = d + M, c = m - d, b = d - (m - c) + (M - c), M = b - w, c = b - M, vt[1] = b - (M + c) + (c - w), S = m + M, c = S - m, vt[2] = m - (S - c) + (M - c), vt[3] = S;
  const P = Fe(4, Gt, 4, vt, yn);
  d = E * u, f = dt * E, p = f - (f - E), _ = E - p, f = dt * u, g = f - (f - u), I = u - g, v = _ * I - (d - p * g - _ * g - p * I), w = B * l, f = dt * B, p = f - (f - B), _ = B - p, f = dt * l, g = f - (f - l), I = l - g, A = _ * I - (w - p * g - _ * g - p * I), M = v - A, c = v - M, vt[0] = v - (M + c) + (c - A), m = d + M, c = m - d, b = d - (m - c) + (M - c), M = b - w, c = b - M, vt[1] = b - (M + c) + (c - w), S = m + M, c = S - m, vt[2] = m - (S - c) + (M - c), vt[3] = S;
  const k = Fe(P, yn, 4, vt, vn);
  d = a * u, f = dt * a, p = f - (f - a), _ = a - p, f = dt * u, g = f - (f - u), I = u - g, v = _ * I - (d - p * g - _ * g - p * I), w = h * l, f = dt * h, p = f - (f - h), _ = h - p, f = dt * l, g = f - (f - l), I = l - g, A = _ * I - (w - p * g - _ * g - p * I), M = v - A, c = v - M, vt[0] = v - (M + c) + (c - A), m = d + M, c = m - d, b = d - (m - c) + (M - c), M = b - w, c = b - M, vt[1] = b - (M + c) + (c - w), S = m + M, c = S - m, vt[2] = m - (S - c) + (M - c), vt[3] = S;
  const T = Fe(k, vn, 4, vt, bn);
  return bn[T - 1];
}
function Wr(e, t, n, r, o, i) {
  const s = (t - i) * (n - o), a = (e - o) * (r - i), h = s - a, l = Math.abs(s + a);
  return Math.abs(h) >= Jr * l ? h : -Hr(e, t, n, r, o, i, l);
}
function Zr(e, t) {
  var n, r, o = 0, i, s, a, h, l, u, c, f = e[0], p = e[1], _ = t.length;
  for (n = 0; n < _; n++) {
    r = 0;
    var g = t[n], I = g.length - 1;
    if (u = g[0], u[0] !== g[I][0] && u[1] !== g[I][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (s = u[0] - f, a = u[1] - p, r; r < I; r++) {
      if (c = g[r + 1], h = c[0] - f, l = c[1] - p, a === 0 && l === 0) {
        if (h <= 0 && s >= 0 || s <= 0 && h >= 0)
          return 0;
      } else if (l >= 0 && a <= 0 || l <= 0 && a >= 0) {
        if (i = Wr(s, h, a, l, 0, 0), i === 0)
          return 0;
        (i > 0 && l > 0 && a <= 0 || i < 0 && l <= 0 && a > 0) && o++;
      }
      u = c, a = l, s = h;
    }
  }
  return o % 2 !== 0;
}
function $e(e, t, n = {}) {
  if (!e)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const r = qr(e), o = Ur(t), i = o.type, s = t.bbox;
  let a = o.coordinates;
  if (s && ti(r, s) === !1)
    return !1;
  i === "Polygon" && (a = [a]);
  for (var h = 0; h < a.length; ++h) {
    const l = Zr(r, a[h]);
    if (l === 0 && !n.ignoreBoundary || l) return !0;
  }
  return !1;
}
function ti(e, t) {
  return t[0] <= e[0] && t[1] <= e[1] && t[2] >= e[0] && t[3] >= e[1];
}
function Re(e, t) {
  for (let n = 0; n < t.features.length; n++)
    if ($e(e, t.features[n]))
      return t.features[n];
}
function qn(e, t) {
  const n = t.geometry.coordinates[0][0], r = t.geometry.coordinates[0][1], o = t.geometry.coordinates[0][2], i = e.geometry.coordinates, s = t.properties.a.geom, a = t.properties.b.geom, h = t.properties.c.geom, l = [r[0] - n[0], r[1] - n[1]], u = [o[0] - n[0], o[1] - n[1]], c = [i[0] - n[0], i[1] - n[1]], f = [a[0] - s[0], a[1] - s[1]], p = [h[0] - s[0], h[1] - s[1]], _ = (u[1] * c[0] - u[0] * c[1]) / (l[0] * u[1] - l[1] * u[0]), g = (l[0] * c[1] - l[1] * c[0]) / (l[0] * u[1] - l[1] * u[0]);
  return [
    _ * f[0] + g * p[0] + s[0],
    _ * f[1] + g * p[1] + s[1]
  ];
}
function ei(e, t, n) {
  const r = e.geometry.coordinates, o = n.geometry.coordinates, i = Math.atan2(r[0] - o[0], r[1] - o[1]), s = ni(i, t[0]);
  if (s === void 0)
    throw new Error("Unable to determine vertex index");
  const a = t[1][s];
  return qn(e, a.features[0]);
}
function ee(e, t, n, r, o, i, s, a) {
  let h;
  if (s && (h = Re(e, Qt([s]))), !h)
    if (n) {
      const l = e.geometry.coordinates, u = n.gridNum, c = n.xOrigin, f = n.yOrigin, p = n.xUnit, _ = n.yUnit, g = n.gridCache, I = It(l[0], c, p, u), M = It(l[1], f, _, u), m = g[I] ? g[I][M] ? g[I][M] : [] : [], b = Qt(m.map((d) => t.features[d]));
      h = Re(e, b);
    } else
      h = Re(e, t);
  return a && a(h), h ? qn(e, h) : ei(e, r, o);
}
function It(e, t, n, r) {
  let o = Math.floor((e - t) / n);
  return o < 0 && (o = 0), o >= r && (o = r - 1), o;
}
function ni(e, t) {
  let n = xn(e - t[0]), r = Math.PI * 2, o;
  for (let i = 0; i < t.length; i++) {
    const s = (i + 1) % t.length, a = xn(e - t[s]), h = Math.min(Math.abs(n), Math.abs(a));
    n * a <= 0 && h < r && (r = h, o = i), n = a;
  }
  return o;
}
function xn(e, t = !1) {
  const n = 2 * Math.PI, r = e - Math.floor(e / n) * n;
  return t ? r : r > Math.PI ? r - n : r;
}
function _n(e) {
  const t = e.features;
  for (let n = 0; n < t.length; n++) {
    const r = t[n];
    `${r.properties.a.index}`.substring(0, 1) === "b" && `${r.properties.b.index}`.substring(0, 1) === "b" ? t[n] = {
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            r.geometry.coordinates[0][2],
            r.geometry.coordinates[0][0],
            r.geometry.coordinates[0][1],
            r.geometry.coordinates[0][2]
          ]
        ]
      },
      properties: {
        a: {
          geom: r.properties.c.geom,
          index: r.properties.c.index
        },
        b: {
          geom: r.properties.a.geom,
          index: r.properties.a.index
        },
        c: {
          geom: r.properties.b.geom,
          index: r.properties.b.index
        }
      },
      type: "Feature"
    } : `${r.properties.c.index}`.substring(0, 1) === "b" && `${r.properties.a.index}`.substring(0, 1) === "b" && (t[n] = {
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            r.geometry.coordinates[0][1],
            r.geometry.coordinates[0][2],
            r.geometry.coordinates[0][0],
            r.geometry.coordinates[0][1]
          ]
        ]
      },
      properties: {
        a: {
          geom: r.properties.b.geom,
          index: r.properties.b.index
        },
        b: {
          geom: r.properties.c.geom,
          index: r.properties.c.index
        },
        c: {
          geom: r.properties.a.geom,
          index: r.properties.a.index
        }
      },
      type: "Feature"
    });
  }
  return e;
}
function Un(e) {
  const t = ["a", "b", "c", "a"].map(
    (i) => e.properties[i].geom
  ), n = e.geometry.coordinates[0], r = e.properties, o = {
    a: { geom: n[0], index: r.a.index },
    b: { geom: n[1], index: r.b.index },
    c: { geom: n[2], index: r.c.index }
  };
  return jn([t], o);
}
function ri(e) {
  const t = [0, 1, 2, 0].map((r) => e[r][0][0]), n = {
    a: { geom: e[0][0][1], index: e[0][1] },
    b: { geom: e[1][0][1], index: e[1][1] },
    c: { geom: e[2][0][1], index: e[2][1] }
  };
  return jn([t], n);
}
function Ve(e, t, n, r, o, i = !1, s) {
  const a = e.map(
    (h) => {
      (!s || s < 2.00703) && (h = ii(h));
      const l = isFinite(h) ? t[h] : h === "c" ? r : (function() {
        const u = h.match(/^b(\d+)$/);
        if (u) return o[parseInt(u[1])];
        const c = h.match(/^e(\d+)$/);
        if (c) return n[parseInt(c[1])];
        throw new Error("Bad index value for indexesToTri");
      })();
      return i ? [[l[1], l[0]], h] : [[l[0], l[1]], h];
    }
  );
  return ri(a);
}
function ii(e) {
  return typeof e == "number" ? e : e.replace(/^(c|e|b)(?:ent|dgeNode|box)(\d+)?$/, "$1$2");
}
function zn(e, t) {
  return t && t >= 2.00703 || Array.isArray(e[0]) ? e : e.map((n) => [
    n.illstNodes,
    n.mercNodes,
    n.startEnd
  ]);
}
const oi = 2.00704;
function si(e) {
  return !!(e.version !== void 0 || !e.tins && e.points && e.tins_points);
}
function ai(e) {
  return {
    points: e.points,
    strictStatus: li(e),
    verticesParams: hi(e),
    centroid: fi(e),
    edges: zn(e.edges || []),
    edgeNodes: e.edgeNodes || [],
    tins: ui(e),
    kinks: di(e.kinks_points),
    yaxisMode: e.yaxisMode ?? "invert",
    strictMode: e.strictMode ?? "auto",
    vertexMode: e.vertexMode,
    bounds: e.bounds,
    boundsPolygon: e.boundsPolygon,
    wh: e.wh,
    xy: e.xy ?? [0, 0]
  };
}
function ci(e) {
  const t = pi(e), n = t.tins;
  return {
    compiled: t,
    tins: n,
    points: mi(n),
    strictStatus: t.strict_status,
    verticesParams: t.vertices_params,
    centroid: t.centroid,
    kinks: t.kinks
  };
}
function li(e) {
  return e.strict_status ? e.strict_status : e.kinks_points ? "strict_error" : e.tins_points.length === 2 ? "loose" : "strict";
}
function hi(e) {
  const t = {
    forw: [e.vertices_params[0]],
    bakw: [e.vertices_params[1]]
  };
  return t.forw[1] = Mn(e, !1), t.bakw[1] = Mn(e, !0), t;
}
function Mn(e, t) {
  const n = e.vertices_points.length;
  return Array.from({ length: n }, (r, o) => {
    const i = (o + 1) % n, s = Ve(
      ["c", `b${o}`, `b${i}`],
      e.points,
      e.edgeNodes || [],
      e.centroid_point,
      e.vertices_points,
      t,
      oi
    );
    return Qt([s]);
  });
}
function fi(e) {
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
function ui(e) {
  const t = e.tins_points.length === 1 ? 0 : 1;
  return {
    forw: Qt(
      e.tins_points[0].map(
        (n) => Ve(
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
        (n) => Ve(
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
function di(e) {
  if (e)
    return {
      bakw: Qt(
        e.map((t) => oe(t))
      )
    };
}
function pi(e) {
  return JSON.parse(
    JSON.stringify(e).replace('"cent"', '"c"').replace(/"bbox(\d+)"/g, '"b$1"')
  );
}
function mi(e) {
  const t = [], n = e.forw.features;
  for (let r = 0; r < n.length; r++) {
    const o = n[r];
    ["a", "b", "c"].forEach((i, s) => {
      const a = o.geometry.coordinates[0][s], h = o.properties[i].geom, l = o.properties[i].index;
      typeof l == "number" && (t[l] = [a, h]);
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
    if (si(t)) {
      this.applyModernState(ai(t));
      return;
    }
    this.applyLegacyState(ci(t));
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
    const t = this.tins, n = t.forw, r = t.bakw, o = Math.ceil(Math.sqrt(n.features.length));
    if (o < 3) {
      this.indexedTins = void 0;
      return;
    }
    let i = [], s = [];
    const a = n.features.map((g) => {
      let I = [];
      return wn(g)[0].map((M) => {
        i.length === 0 ? i = [Array.from(M), Array.from(M)] : (M[0] < i[0][0] && (i[0][0] = M[0]), M[0] > i[1][0] && (i[1][0] = M[0]), M[1] < i[0][1] && (i[0][1] = M[1]), M[1] > i[1][1] && (i[1][1] = M[1])), I.length === 0 ? I = [Array.from(M), Array.from(M)] : (M[0] < I[0][0] && (I[0][0] = M[0]), M[0] > I[1][0] && (I[1][0] = M[0]), M[1] < I[0][1] && (I[0][1] = M[1]), M[1] > I[1][1] && (I[1][1] = M[1]));
      }), I;
    }), h = (i[1][0] - i[0][0]) / o, l = (i[1][1] - i[0][1]) / o, u = a.reduce(
      (g, I, M) => {
        const m = It(I[0][0], i[0][0], h, o), b = It(I[1][0], i[0][0], h, o), d = It(I[0][1], i[0][1], l, o), v = It(I[1][1], i[0][1], l, o);
        for (let w = m; w <= b; w++) {
          g[w] || (g[w] = []);
          for (let A = d; A <= v; A++)
            g[w][A] || (g[w][A] = []), g[w][A].push(M);
        }
        return g;
      },
      []
    ), c = r.features.map((g) => {
      let I = [];
      return wn(g)[0].map((M) => {
        s.length === 0 ? s = [Array.from(M), Array.from(M)] : (M[0] < s[0][0] && (s[0][0] = M[0]), M[0] > s[1][0] && (s[1][0] = M[0]), M[1] < s[0][1] && (s[0][1] = M[1]), M[1] > s[1][1] && (s[1][1] = M[1])), I.length === 0 ? I = [Array.from(M), Array.from(M)] : (M[0] < I[0][0] && (I[0][0] = M[0]), M[0] > I[1][0] && (I[1][0] = M[0]), M[1] < I[0][1] && (I[0][1] = M[1]), M[1] > I[1][1] && (I[1][1] = M[1]));
      }), I;
    }), f = (s[1][0] - s[0][0]) / o, p = (s[1][1] - s[0][1]) / o, _ = c.reduce(
      (g, I, M) => {
        const m = It(I[0][0], s[0][0], f, o), b = It(I[1][0], s[0][0], f, o), d = It(I[0][1], s[0][1], p, o), v = It(I[1][1], s[0][1], p, o);
        for (let w = m; w <= b; w++) {
          g[w] || (g[w] = []);
          for (let A = d; A <= v; A++)
            g[w][A] || (g[w][A] = []), g[w][A].push(M);
        }
        return g;
      },
      []
    );
    this.indexedTins = {
      forw: {
        gridNum: o,
        xOrigin: i[0][0],
        yOrigin: i[0][1],
        xUnit: h,
        yUnit: l,
        gridCache: u
      },
      bakw: {
        gridNum: o,
        xOrigin: s[0][0],
        yOrigin: s[0][1],
        xUnit: f,
        yUnit: p,
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
  transform(t, n, r) {
    if (!this.tins)
      throw new Error("setCompiled() must be called before transform()");
    if (n && this.strict_status == Mt.STATUS_ERROR)
      throw new Error('Backward transform is not allowed if strict_status == "strict_error"');
    this.yaxisMode == Mt.YAXIS_FOLLOW && n && (t = [t[0], -1 * t[1]]);
    const o = oe(t);
    if (this.bounds && !n && !r && !$e(o, this.boundsPolygon))
      return !1;
    const i = n ? this.tins.bakw : this.tins.forw, s = n ? this.indexedTins.bakw : this.indexedTins.forw, a = n ? this.vertices_params.bakw : this.vertices_params.forw, h = n ? this.centroid.bakw : this.centroid.forw;
    let l, u;
    this.stateFull && (this.stateBackward == n ? l = this.stateTriangle : (this.stateBackward = n, this.stateTriangle = void 0), u = (f) => {
      this.stateTriangle = f;
    });
    let c = ee(
      o,
      i,
      s,
      a,
      h,
      void 0,
      l,
      u
    );
    if (this.bounds && n && !r) {
      const f = oe(c);
      if (!$e(f, this.boundsPolygon)) return !1;
    } else this.yaxisMode == Mt.YAXIS_FOLLOW && !n && (c = [c[0], -1 * c[1]]);
    return c;
  }
}
const Sn = Math.pow(2, -52), we = new Uint32Array(512);
class ze {
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
  static from(t, n = bi, r = xi) {
    const o = t.length, i = new Float64Array(o * 2);
    for (let s = 0; s < o; s++) {
      const a = t[s];
      i[2 * s] = n(a), i[2 * s + 1] = r(a);
    }
    return new ze(i);
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
    const r = Math.max(2 * n - 5, 0);
    this._triangles = new Uint32Array(r * 3), this._halfedges = new Int32Array(r * 3), this._hashSize = Math.ceil(Math.sqrt(n)), this._hullPrev = new Uint32Array(n), this._hullNext = new Uint32Array(n), this._hullTri = new Uint32Array(n), this._hullHash = new Int32Array(this._hashSize), this._ids = new Uint32Array(n), this._dists = new Float64Array(n), this.trianglesLen = 0, this._cx = 0, this._cy = 0, this._hullStart = 0, this.hull = this._triangles, this.triangles = this._triangles, this.halfedges = this._halfedges, this.update();
  }
  /**
   * Updates the triangulation if you modified `delaunay.coords` values in place, avoiding expensive memory allocations.
   * Useful for iterative relaxation algorithms such as Lloyd's.
   */
  update() {
    const { coords: t, _hullPrev: n, _hullNext: r, _hullTri: o, _hullHash: i } = this, s = t.length >> 1;
    let a = 1 / 0, h = 1 / 0, l = -1 / 0, u = -1 / 0;
    for (let E = 0; E < s; E++) {
      const O = t[2 * E], B = t[2 * E + 1];
      O < a && (a = O), B < h && (h = B), O > l && (l = O), B > u && (u = B), this._ids[E] = E;
    }
    const c = (a + l) / 2, f = (h + u) / 2;
    let p = 0, _ = 0, g = 0;
    for (let E = 0, O = 1 / 0; E < s; E++) {
      const B = Le(c, f, t[2 * E], t[2 * E + 1]);
      B < O && (p = E, O = B);
    }
    const I = t[2 * p], M = t[2 * p + 1];
    for (let E = 0, O = 1 / 0; E < s; E++) {
      if (E === p) continue;
      const B = Le(I, M, t[2 * E], t[2 * E + 1]);
      B < O && B > 0 && (_ = E, O = B);
    }
    let m = t[2 * _], b = t[2 * _ + 1], d = 1 / 0;
    for (let E = 0; E < s; E++) {
      if (E === p || E === _) continue;
      const O = yi(I, M, m, b, t[2 * E], t[2 * E + 1]);
      O < d && (g = E, d = O);
    }
    let v = t[2 * g], w = t[2 * g + 1];
    if (d === 1 / 0) {
      for (let B = 0; B < s; B++)
        this._dists[B] = t[2 * B] - t[0] || t[2 * B + 1] - t[1];
      Jt(this._ids, this._dists, 0, s - 1);
      const E = new Uint32Array(s);
      let O = 0;
      for (let B = 0, X = -1 / 0; B < s; B++) {
        const F = this._ids[B], y = this._dists[F];
        y > X && (E[O++] = F, X = y);
      }
      this.hull = E.subarray(0, O), this.triangles = new Uint32Array(0), this.halfedges = new Int32Array(0);
      return;
    }
    if (Pt(I, M, m, b, v, w) < 0) {
      const E = _, O = m, B = b;
      _ = g, m = v, b = w, g = E, v = O, w = B;
    }
    const A = vi(I, M, m, b, v, w);
    this._cx = A.x, this._cy = A.y;
    for (let E = 0; E < s; E++)
      this._dists[E] = Le(t[2 * E], t[2 * E + 1], A.x, A.y);
    Jt(this._ids, this._dists, 0, s - 1), this._hullStart = p;
    let S = 3;
    r[p] = n[g] = _, r[_] = n[p] = g, r[g] = n[_] = p, o[p] = 0, o[_] = 1, o[g] = 2, i.fill(-1), i[this._hashKey(I, M)] = p, i[this._hashKey(m, b)] = _, i[this._hashKey(v, w)] = g, this.trianglesLen = 0, this._addTriangle(p, _, g, -1, -1, -1);
    for (let E = 0, O = 0, B = 0; E < this._ids.length; E++) {
      const X = this._ids[E], F = t[2 * X], y = t[2 * X + 1];
      if (E > 0 && Math.abs(F - O) <= Sn && Math.abs(y - B) <= Sn || (O = F, B = y, X === p || X === _ || X === g)) continue;
      let P = 0;
      for (let x = 0, N = this._hashKey(F, y); x < this._hashSize && (P = i[(N + x) % this._hashSize], !(P !== -1 && P !== r[P])); x++)
        ;
      P = n[P];
      let k = P, T;
      for (; T = r[k], Pt(F, y, t[2 * k], t[2 * k + 1], t[2 * T], t[2 * T + 1]) >= 0; )
        if (k = T, k === P) {
          k = -1;
          break;
        }
      if (k === -1) continue;
      let C = this._addTriangle(k, X, r[k], -1, -1, o[k]);
      o[X] = this._legalize(C + 2), o[k] = C, S++;
      let Y = r[k];
      for (; T = r[Y], Pt(F, y, t[2 * Y], t[2 * Y + 1], t[2 * T], t[2 * T + 1]) < 0; )
        C = this._addTriangle(Y, X, T, o[X], -1, o[Y]), o[X] = this._legalize(C + 2), r[Y] = Y, S--, Y = T;
      if (k === P)
        for (; T = n[k], Pt(F, y, t[2 * T], t[2 * T + 1], t[2 * k], t[2 * k + 1]) < 0; )
          C = this._addTriangle(T, X, k, -1, o[k], o[T]), this._legalize(C + 2), o[T] = C, r[k] = k, S--, k = T;
      this._hullStart = n[X] = k, r[k] = n[Y] = X, r[X] = Y, i[this._hashKey(F, y)] = X, i[this._hashKey(t[2 * k], t[2 * k + 1])] = k;
    }
    this.hull = new Uint32Array(S);
    for (let E = 0, O = this._hullStart; E < S; E++)
      this.hull[E] = O, O = r[O];
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
    return Math.floor(gi(t - this._cx, n - this._cy) * this._hashSize) % this._hashSize;
  }
  /**
   * Flip an edge in a pair of triangles if it doesn't satisfy the Delaunay condition.
   *
   * @param {number} a
   * @private
   */
  _legalize(t) {
    const { _triangles: n, _halfedges: r, coords: o } = this;
    let i = 0, s = 0;
    for (; ; ) {
      const a = r[t], h = t - t % 3;
      if (s = h + (t + 2) % 3, a === -1) {
        if (i === 0) break;
        t = we[--i];
        continue;
      }
      const l = a - a % 3, u = h + (t + 1) % 3, c = l + (a + 2) % 3, f = n[s], p = n[t], _ = n[u], g = n[c];
      if (wi(
        o[2 * f],
        o[2 * f + 1],
        o[2 * p],
        o[2 * p + 1],
        o[2 * _],
        o[2 * _ + 1],
        o[2 * g],
        o[2 * g + 1]
      )) {
        n[t] = g, n[a] = f;
        const M = r[c];
        if (M === -1) {
          let b = this._hullStart;
          do {
            if (this._hullTri[b] === c) {
              this._hullTri[b] = t;
              break;
            }
            b = this._hullPrev[b];
          } while (b !== this._hullStart);
        }
        this._link(t, M), this._link(a, r[s]), this._link(s, c);
        const m = l + (a + 1) % 3;
        i < we.length && (we[i++] = m);
      } else {
        if (i === 0) break;
        t = we[--i];
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
  _addTriangle(t, n, r, o, i, s) {
    const a = this.trianglesLen;
    return this._triangles[a] = t, this._triangles[a + 1] = n, this._triangles[a + 2] = r, this._link(a, o), this._link(a + 1, i), this._link(a + 2, s), this.trianglesLen += 3, a;
  }
}
function gi(e, t) {
  const n = e / (Math.abs(e) + Math.abs(t));
  return (t > 0 ? 3 - n : 1 + n) / 4;
}
function Le(e, t, n, r) {
  const o = e - n, i = t - r;
  return o * o + i * i;
}
function wi(e, t, n, r, o, i, s, a) {
  const h = e - s, l = t - a, u = n - s, c = r - a, f = o - s, p = i - a, _ = h * h + l * l, g = u * u + c * c, I = f * f + p * p;
  return h * (c * I - g * p) - l * (u * I - g * f) + _ * (u * p - c * f) < 0;
}
function yi(e, t, n, r, o, i) {
  const s = n - e, a = r - t, h = o - e, l = i - t, u = s * s + a * a, c = h * h + l * l, f = 0.5 / (s * l - a * h), p = (l * u - a * c) * f, _ = (s * c - h * u) * f;
  return p * p + _ * _;
}
function vi(e, t, n, r, o, i) {
  const s = n - e, a = r - t, h = o - e, l = i - t, u = s * s + a * a, c = h * h + l * l, f = 0.5 / (s * l - a * h), p = e + (l * u - a * c) * f, _ = t + (s * c - h * u) * f;
  return { x: p, y: _ };
}
function Jt(e, t, n, r) {
  if (r - n <= 20)
    for (let o = n + 1; o <= r; o++) {
      const i = e[o], s = t[i];
      let a = o - 1;
      for (; a >= n && t[e[a]] > s; ) e[a + 1] = e[a--];
      e[a + 1] = i;
    }
  else {
    const o = n + r >> 1;
    let i = n + 1, s = r;
    Zt(e, o, i), t[e[n]] > t[e[r]] && Zt(e, n, r), t[e[i]] > t[e[r]] && Zt(e, i, r), t[e[n]] > t[e[i]] && Zt(e, n, i);
    const a = e[i], h = t[a];
    for (; ; ) {
      do
        i++;
      while (t[e[i]] < h);
      do
        s--;
      while (t[e[s]] > h);
      if (s < i) break;
      Zt(e, i, s);
    }
    e[n + 1] = e[s], e[s] = a, r - i + 1 >= s - n ? (Jt(e, t, i, r), Jt(e, t, n, s - 1)) : (Jt(e, t, n, s - 1), Jt(e, t, i, r));
  }
}
function Zt(e, t, n) {
  const r = e[t];
  e[t] = e[n], e[n] = r;
}
function bi(e) {
  return e[0];
}
function xi(e) {
  return e[1];
}
class _i {
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
    const n = Math.floor(t / this.width), r = t % this.width;
    return this.bs[n] |= 1 << r, this;
  }
  /**
   * Delete a number from the set.
   *
   * @param idx The number to delete. Must be 0 <= idx < len.
   */
  delete(t) {
    const n = Math.floor(t / this.width), r = t % this.width;
    return this.bs[n] &= ~(1 << r), this;
  }
  /**
   * Add or delete a number in the set, depending on the second argument.
   *
   * @param idx The number to add or delete. Must be 0 <= idx < len.
   * @param val If true, add the number, otherwise delete.
   */
  set(t, n) {
    const r = Math.floor(t / this.width), i = 1 << t % this.width;
    return this.bs[r] ^= (-Number(n) ^ this.bs[r]) & i, n;
  }
  /**
   * Whether the number is in the set.
   *
   * @param idx The number to test. Must be 0 <= idx < len.
   */
  has(t) {
    const n = Math.floor(t / this.width), r = t % this.width;
    return (this.bs[n] & 1 << r) !== 0;
  }
  /**
   * Iterate over the numbers that are in the set.
   */
  forEach(t) {
    const n = this.bs.length;
    for (let r = 0; r < n; r++) {
      let o = 0;
      for (; this.bs[r] && o < this.width; )
        this.bs[r] & 1 << o && t(r * this.width + o), o++;
    }
    return this;
  }
}
class kn extends _i {
  constructor(t) {
    super(8, new Uint8Array(Math.ceil(t / 8)).fill(0));
  }
}
function qt(e) {
  return e % 3 === 2 ? e - 2 : e + 1;
}
function Ot(e) {
  return e % 3 === 0 ? e + 2 : e - 1;
}
function En(e, t, n, r, o, i, s, a) {
  const h = Pt(e, t, o, i, s, a), l = Pt(n, r, o, i, s, a);
  if (h > 0 && l > 0 || h < 0 && l < 0)
    return !1;
  const u = Pt(o, i, e, t, n, r), c = Pt(s, a, e, t, n, r);
  return u > 0 && c > 0 || u < 0 && c < 0 ? !1 : h === 0 && l === 0 && u === 0 && c === 0 ? !(Math.max(o, s) < Math.min(e, n) || Math.max(e, n) < Math.min(o, s) || Math.max(i, a) < Math.min(t, r) || Math.max(t, r) < Math.min(i, a)) : !0;
}
class Mi {
  /**
   * The triangulation object from Delaunator.
   */
  del;
  constructor(t) {
    this.del = t;
  }
}
class Si extends Mi {
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
    const r = 2 ** 32 - 1, o = t.coords.length >> 1, i = t.triangles.length;
    this.vertMap = new Uint32Array(o).fill(r), this.flips = new kn(i), this.consd = new kn(i);
    for (let s = 0; s < i; s++) {
      const a = t.triangles[s];
      this.vertMap[a] === r && this.updateVert(s);
    }
    n && this.constrainAll(n);
  }
  /**
   * Constrain the triangulation such that there is an edge between p1 and p2.
   */
  constrainOne(t, n) {
    const { triangles: r, halfedges: o } = this.del, i = this.vertMap[t];
    let s = i;
    do {
      const l = r[s], u = qt(s);
      if (l === n)
        return this.protect(s);
      const c = Ot(s), f = r[c];
      if (f === n)
        return this.protect(u), u;
      if (this.intersectSegments(t, n, f, l)) {
        s = c;
        break;
      }
      s = o[u];
    } while (s !== -1 && s !== i);
    let a = s, h = -1;
    for (; s !== -1; ) {
      const l = o[s], u = Ot(s), c = Ot(l), f = qt(l);
      if (l === -1)
        throw new Error("Constraining edge exited the hull");
      if (this.consd.has(s))
        throw new Error("Edge intersects already constrained edge");
      if (this.isCollinear(t, n, r[s]) || this.isCollinear(t, n, r[l]))
        throw new Error("Constraining edge intersects point");
      if (!this.intersectSegments(
        r[s],
        r[l],
        r[u],
        r[c]
      )) {
        if (h === -1 && (h = s), r[c] === n) {
          if (s === h)
            throw new Error("Infinite loop: non-convex quadrilateral");
          s = h, h = -1;
          continue;
        }
        if (this.intersectSegments(
          t,
          n,
          r[c],
          r[l]
        ))
          s = c;
        else if (this.intersectSegments(
          t,
          n,
          r[f],
          r[c]
        ))
          s = f;
        else if (h === s)
          throw new Error("Infinite loop: no further intersect after non-convex");
        continue;
      }
      if (this.flipDiagonal(s), this.intersectSegments(
        t,
        n,
        r[u],
        r[c]
      ) && (h === -1 && (h = u), h === u))
        throw new Error("Infinite loop: flipped diagonal still intersects");
      r[c] === n ? (a = c, s = h, h = -1) : this.intersectSegments(
        t,
        n,
        r[f],
        r[c]
      ) && (s = f);
    }
    return this.protect(a), this.delaunify(!0), this.findEdge(t, n);
  }
  /**
   * Fix the Delaunay condition.
   */
  delaunify(t = !1) {
    const { halfedges: n } = this.del, r = this.flips, o = this.consd, i = n.length;
    let s;
    do {
      s = 0;
      for (let a = 0; a < i; a++) {
        if (o.has(a))
          continue;
        r.delete(a);
        const h = n[a];
        h !== -1 && (r.delete(h), this.isDelaunay(a) || (this.flipDiagonal(a), s++));
      }
    } while (t && s > 0);
    return this;
  }
  /**
   * Call constrainOne on each edge.
   */
  constrainAll(t) {
    const n = t.length;
    for (let r = 0; r < n; r++) {
      const o = t[r];
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
    const r = this.vertMap[n], { triangles: o, halfedges: i } = this.del;
    let s = r, a;
    do {
      if (o[s] === t)
        return s;
      a = qt(s), s = i[a];
    } while (s !== -1 && s !== r);
    return o[qt(a)] === t ? -a : 1 / 0;
  }
  /**
   * Mark an edge as constrained, i.e. should not be touched by `delaunify`.
   */
  protect(t) {
    const n = this.del.halfedges[t], r = this.flips, o = this.consd;
    return r.delete(t), o.add(t), n !== -1 ? (r.delete(n), o.add(n), n) : -t;
  }
  /**
   * Mark an edge as flipped unless constrained.
   */
  markFlip(t) {
    const n = this.del.halfedges, r = this.flips;
    if (this.consd.has(t))
      return !1;
    const i = n[t];
    return i !== -1 && (r.add(t), r.add(i)), !0;
  }
  /**
   * Flip the edge shared by two triangles.
   */
  flipDiagonal(t) {
    const { triangles: n, halfedges: r } = this.del, o = this.flips, i = this.consd, s = r[t], a = Ot(t), h = qt(t), l = Ot(s), u = qt(s), c = r[a], f = r[l];
    if (i.has(t))
      throw new Error("Trying to flip a constrained edge");
    return n[t] = n[l], r[t] = f, o.set(t, o.has(l)) || i.set(t, i.has(l)), f !== -1 && (r[f] = t), r[a] = l, n[s] = n[a], r[s] = c, o.set(s, o.has(a)) || i.set(s, i.has(a)), c !== -1 && (r[c] = s), r[l] = a, this.markFlip(t), this.markFlip(h), this.markFlip(s), this.markFlip(u), o.add(a), i.delete(a), o.add(l), i.delete(l), this.updateVert(t), this.updateVert(h), this.updateVert(s), this.updateVert(u), a;
  }
  /**
   * Whether point p1, p2, and p are collinear.
   */
  isCollinear(t, n, r) {
    const o = this.del.coords;
    return Pt(
      o[t * 2],
      o[t * 2 + 1],
      o[n * 2],
      o[n * 2 + 1],
      o[r * 2],
      o[r * 2 + 1]
    ) === 0;
  }
  /**
   * Whether the triangle formed by p1, p2, p3 keeps px outside the circumcircle.
   */
  inCircle(t, n, r, o) {
    const i = this.del.coords;
    return ur(
      i[t * 2],
      i[t * 2 + 1],
      i[n * 2],
      i[n * 2 + 1],
      i[r * 2],
      i[r * 2 + 1],
      i[o * 2],
      i[o * 2 + 1]
    ) < 0;
  }
  /**
   * Whether the triangles sharing edg conform to the Delaunay condition.
   */
  isDelaunay(t) {
    const { triangles: n, halfedges: r } = this.del, o = r[t];
    if (o === -1)
      return !0;
    const i = n[Ot(t)], s = n[t], a = n[qt(t)], h = n[Ot(o)];
    return !this.inCircle(i, s, a, h);
  }
  /**
   * Update the vertex -> incoming edge map.
   */
  updateVert(t) {
    const { triangles: n, halfedges: r } = this.del, o = this.vertMap, i = n[t];
    let s = Ot(t), a = r[s];
    for (; a !== -1 && a !== t; )
      s = Ot(a), a = r[s];
    return o[i] = s, s;
  }
  /**
   * Whether the segments between vertices intersect.
   */
  intersectSegments(t, n, r, o) {
    const i = this.del.coords;
    return t === r || t === o || n === r || n === o ? !1 : En(
      i[t * 2],
      i[t * 2 + 1],
      i[n * 2],
      i[n * 2 + 1],
      i[r * 2],
      i[r * 2 + 1],
      i[o * 2],
      i[o * 2 + 1]
    );
  }
  static intersectSegments = En;
}
function ye(e, t, n) {
  if (t || (t = []), typeof e != "object" || e.type !== "FeatureCollection")
    throw "Argument points must be FeatureCollection";
  if (!Array.isArray(t)) throw "Argument points must be Array of Array";
  const r = e.features.map(
    (h) => h.geometry.coordinates
  ), o = ze.from(r);
  let i;
  const s = [];
  o.triangles.length !== 0 && t.length !== 0 && (i = new Si(o), i.constrainAll(t));
  for (let h = 0; h < o.triangles.length; h += 3)
    s.push([o.triangles[h], o.triangles[h + 1], o.triangles[h + 2]]);
  const a = ["a", "b", "c"];
  return St(
    s.map((h) => {
      const l = {}, u = h.map((c, f) => {
        const p = e.features[c], _ = p.geometry.coordinates, g = [_[0], _[1]];
        return _.length === 3 ? g[2] = _[2] : l[a[f]] = p.properties[n], g;
      });
      return u[3] = u[0], ae([u], l);
    })
  );
}
function ki(e, t) {
  const n = [[], [], [], []], r = [];
  return Object.keys(e).forEach((o) => {
    const i = e[o], s = i.forw, a = i.bakw, h = [
      s[0] - t.forw[0],
      s[1] - t.forw[1]
    ], l = [
      a[0] - t.bakw[0],
      t.bakw[1] - a[1]
    ], u = { forw: h, bakw: l };
    if (r.push(u), h[0] === 0 || h[1] === 0)
      return;
    let c = 0;
    h[0] > 0 && (c += 1), h[1] > 0 && (c += 2), n[c].push(u);
  }), { perQuad: n, aggregate: r };
}
function Ei(e) {
  let t = 1 / 0, n = 0, r = 0;
  return e.forEach((o) => {
    const { forw: i, bakw: s } = o, a = Math.hypot(i[0], i[1]), h = Math.hypot(s[0], s[1]);
    if (h === 0) return;
    const l = a / h, u = Math.atan2(i[0], i[1]) - Math.atan2(s[0], s[1]);
    t = Math.min(t, l), n += Math.cos(u), r += Math.sin(u);
  }), isFinite(t) ? [t, Math.atan2(r, n)] : [1, 0];
}
function Ai(e, t, n) {
  const { perQuad: r, aggregate: o } = ki(e, t), i = r.every((h) => h.length > 0), a = (n === "birdeye" ? i ? r : [o] : [o]).map((h) => Ei(h));
  return a.length === 1 ? [a[0], a[0], a[0], a[0]] : a;
}
function Ii(e, t) {
  let n = 0;
  return e[0] > t[0] && (n += 1), e[1] > t[1] && (n += 2), n;
}
function Pi(e, t, n) {
  const r = [
    e[0] - t.forw[0],
    e[1] - t.forw[1]
  ], i = Math.sqrt(r[0] ** 2 + r[1] ** 2) / n[0], s = Math.atan2(r[0], r[1]) - n[1];
  return [
    t.bakw[0] + i * Math.sin(s),
    t.bakw[1] - i * Math.cos(s)
  ];
}
function Oi(e, t, n, r) {
  const o = t[0] - e[0], i = t[1] - e[1];
  if (Math.abs(o) < 1e-12 && Math.abs(i) < 1e-12) return null;
  const s = r[0] - n[0], a = r[1] - n[1], h = n[0] - e[0], l = n[1] - e[1], u = o * a - i * s;
  if (Math.abs(u) < 1e-12) return null;
  const c = (h * a - l * s) / u, f = (h * i - l * o) / u;
  return c <= 1e-10 || f < -1e-10 || f > 1 + 1e-10 ? null : { t: c, point: [e[0] + c * o, e[1] + c * i] };
}
function Bi(e, t, n) {
  const r = n.length;
  let o = -1 / 0, i = null;
  for (let s = 0; s < r; s++) {
    const a = (s + 1) % r, h = Oi(
      e,
      t,
      n[s].bakw,
      n[a].bakw
    );
    h && h.t > o && (o = h.t, i = h.point);
  }
  return i;
}
function An(e, t) {
  const r = Math.atan2(e[0] - t[0], e[1] - t[1]) * (180 / Math.PI);
  return r < 0 ? r + 360 : r;
}
function In(e, t, n, r, o, i) {
  const s = t[0] - e[0], a = t[1] - e[1];
  if (s === 0 && a === 0) return null;
  const h = [];
  if (s !== 0)
    for (const u of [n, r]) {
      const c = (u - e[0]) / s;
      if (c > 0) {
        const f = e[1] + c * a;
        f >= o && f <= i && h.push({ t: c, x: u, y: f });
      }
    }
  if (a !== 0)
    for (const u of [o, i]) {
      const c = (u - e[1]) / a;
      if (c > 0) {
        const f = e[0] + c * s;
        f >= n && f <= r && h.push({ t: c, x: f, y: u });
      }
    }
  if (h.length === 0) return null;
  h.sort((u, c) => u.t - c.t);
  const l = h[0];
  return [l.x, l.y];
}
function Pn(e, t, n) {
  const r = e.length, o = new Array(r).fill(1);
  for (const i of t)
    for (let s = 0; s < r; s++) {
      const a = (s + 1) % r, h = He([e[s].bakw, e[a].bakw]), l = He([n.bakw, i.bakw]), u = Pr(h, l);
      if (u.features.length > 0 && u.features[0].geometry) {
        const c = u.features[0], f = Math.sqrt(
          Math.pow(i.bakw[0] - n.bakw[0], 2) + Math.pow(i.bakw[1] - n.bakw[1], 2)
        ), p = Math.sqrt(
          Math.pow(c.geometry.coordinates[0] - n.bakw[0], 2) + Math.pow(c.geometry.coordinates[1] - n.bakw[1], 2)
        ), _ = f / p;
        _ > o[s] && (o[s] = _), _ > o[a] && (o[a] = _);
      }
    }
  e.forEach((i, s) => {
    const a = o[s];
    i.bakw = [
      (i.bakw[0] - n.bakw[0]) * a + n.bakw[0],
      (i.bakw[1] - n.bakw[1]) * a + n.bakw[1]
    ];
  });
}
function Gn(e, t, n) {
  const { convexBuf: r, centroid: o, allGcps: i, minx: s, maxx: a, miny: h, maxy: l } = e, u = Ai(r, o, t), f = [
    [s, h],
    [a, h],
    [a, l],
    [s, l]
  ].map((w) => ({
    forw: w,
    bakw: Pi(
      w,
      o,
      u[Ii(w, o.forw)]
    )
  }));
  if (f.sort(
    (w, A) => Math.atan2(w.forw[0] - o.forw[0], w.forw[1] - o.forw[1]) - Math.atan2(A.forw[0] - o.forw[0], A.forw[1] - o.forw[1])
  ), Pn(f, i, o), !n) return f;
  const p = 4, _ = f.map(
    (w) => Math.atan2(w.forw[0] - o.forw[0], w.forw[1] - o.forw[1])
  ), g = f.map(
    (w) => Math.atan2(
      w.bakw[0] - o.bakw[0],
      -(w.bakw[1] - o.bakw[1])
    )
  );
  function I(w) {
    for (let A = 0; A < p; A++) {
      const S = (A + 1) % p, E = _[A], O = A < p - 1 ? _[S] : _[S] + 2 * Math.PI;
      let B = w;
      for (; B < E; ) B += 2 * Math.PI;
      for (; B >= E + 2 * Math.PI; ) B -= 2 * Math.PI;
      if (B >= E && B < O)
        return { i: A, j: S, frac: (B - E) / (O - E) };
    }
    return { i: 0, j: 1, frac: 0 };
  }
  function M(w) {
    const { i: A, j: S, frac: E } = I(w), O = g[A];
    let X = g[S] - O;
    for (; X > Math.PI; ) X -= 2 * Math.PI;
    for (; X < -Math.PI; ) X += 2 * Math.PI;
    return O + E * X;
  }
  const m = new Set(
    f.map(
      (w) => Math.floor(An(w.forw, o.forw) / 10) % 36
    )
  ), b = i.map((w) => ({
    forw: w.forw,
    bakw: w.bakw,
    angleDeg: An(w.forw, o.forw),
    forwDist: Math.hypot(w.forw[0] - o.forw[0], w.forw[1] - o.forw[1])
  })), d = [];
  for (let w = 0; w < 36; w++) {
    if (m.has(w)) continue;
    const A = w * 10, S = b.filter(
      (P) => P.angleDeg >= A && P.angleDeg < A + 10
    );
    let E = null;
    if (S.length > 0) {
      const P = S.reduce((k, T) => T.forwDist > k.forwDist ? T : k);
      E = In(o.forw, P.forw, s, a, h, l);
    }
    if (!E) {
      const P = (A + 5) % 360 * (Math.PI / 180), k = [
        o.forw[0] + Math.sin(P),
        o.forw[1] + Math.cos(P)
      ];
      E = In(o.forw, k, s, a, h, l);
    }
    if (!E) continue;
    const O = [E[0] - o.forw[0], E[1] - o.forw[1]], B = Math.atan2(O[0], O[1]), X = M(B), F = [
      o.bakw[0] + Math.sin(X),
      o.bakw[1] - Math.cos(X)
    ], y = Bi(o.bakw, F, f);
    y && d.push({ forw: E, bakw: y });
  }
  const v = [...f, ...d];
  return v.sort(
    (w, A) => Math.atan2(w.forw[0] - o.forw[0], w.forw[1] - o.forw[1]) - Math.atan2(A.forw[0] - o.forw[0], A.forw[1] - o.forw[1])
  ), Pn(v, i, o), v;
}
function Ni(e, t = !1) {
  return Gn(e, "plain", t);
}
function Ti(e, t = !1) {
  return Gn(e, "birdeye", t);
}
function Xi(e) {
  const n = new Ci(e).findSegmentIntersections(), r = Qn(n), o = /* @__PURE__ */ new Map();
  return r.forEach((i) => {
    o.set(`${i.x}:${i.y}`, i);
  }), Array.from(o.values()).map(
    (i) => Lt([i.x, i.y])
  );
}
class Ci {
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
    const n = [], r = [], o = t.map((i) => {
      const s = i ? i.length : 0;
      for (let a = 0; a < s; a++)
        n.push(i[a][0]), r.push(i[a][1]);
      return s;
    });
    this.initXYData(o, n, r);
  }
  initXYData(t, n, r) {
    const o = t.length;
    this._xx = new Float64Array(n), this._yy = new Float64Array(r), this._nn = new Uint32Array(t), this._zz = null, this._zlimit = 0, this._filteredArcIter = null, this._ii = new Uint32Array(o);
    let i = 0;
    for (let s = 0; s < o; s++)
      this._ii[s] = i, i += t[s];
    (i != this._xx.length || this._xx.length != this._yy.length) && Ge("ArcCollection#initXYData() Counting error"), this.initBounds(), this._arcIter = new eo(this._xx, this._yy);
  }
  initBounds() {
    const t = this.calcArcBounds_(this._xx, this._yy, this._nn);
    this._bb = t.bb, this._allBounds = t.bounds;
  }
  /**
   * データの境界を計算
   * @returns バウンディングボックス情報
   */
  calcArcBounds_(t, n, r) {
    const o = r.length, i = new Float64Array(o * 4), s = new se();
    let a = 0, h, l, u;
    for (let c = 0; c < o; c++)
      h = r[c], h > 0 && (l = c * 4, u = no(t, n, a, h), i[l++] = u[0], i[l++] = u[1], i[l++] = u[2], i[l] = u[3], a += h, s.mergeBounds(u));
    return {
      bb: i,
      bounds: s
    };
  }
  getBounds() {
    return this._allBounds ? this._allBounds.clone() : new se();
  }
  // @cb function(i, j, xx, yy)
  forEachSegment(t) {
    let n = 0;
    for (let r = 0, o = this.size(); r < o; r++)
      n += this.forEachArcSegment(r, t);
    return n;
  }
  size() {
    return this._ii && this._ii.length || 0;
  }
  // @cb function(i, j, xx, yy)
  forEachArcSegment(t, n) {
    const r = t >= 0, o = r ? t : ~t, i = this.getRetainedInterval(), s = this._nn[o], a = r ? 1 : -1;
    let h = r ? this._ii[o] : this._ii[o] + s - 1, l = h, u = 0;
    for (let c = 1; c < s; c++)
      l += a, (i === 0 || this._zz[l] >= i) && (n(h, l, this._xx, this._yy), h = l, u++);
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
    const r = this.forEachSegment(
      (o, i, s, a) => {
        t += Math.abs(s[o] - s[i]), n += Math.abs(a[o] - a[i]);
      }
    );
    return [t / r || 0, n / r || 0];
  }
  /**
   * 交差判定のためのストライプ数を計算
   * 線分の平均長さに基づいて最適な分割数を決定
   */
  calcSegmentIntersectionStripeCount() {
    const t = this.getBounds().height(), n = this.getAvgSegment2()[1];
    let r = 1;
    return n > 0 && t > 0 && (r = Math.ceil(t / n / 20)), r || 1;
  }
  /**
   * 線分の交差を検出
   * ストライプ分割による効率的な判定を実装
   *
   * @returns 検出された交差点の配列
   */
  findSegmentIntersections() {
    const t = this.getBounds(), n = t.ymin || 0, r = (t.ymax || 0) - n, o = this.calcSegmentIntersectionStripeCount(), i = new Uint32Array(o), s = o > 1 ? (g) => Math.floor((o - 1) * (g - n) / r) : () => 0;
    let a, h;
    this.forEachSegment(
      (g, I, M, m) => {
        let b = s(m[g]);
        const d = s(m[I]);
        for (; i[b] = i[b] + 2, b != d; )
          b += d > b ? 1 : -1;
      }
    );
    const l = this.getUint32Array(Fi(i));
    let u = 0;
    const c = [];
    Ri(i, (g) => {
      const I = u;
      u += g, c.push(l.subarray(I, u));
    }), Li(i, 0), this.forEachSegment(
      (g, I, M, m) => {
        let b = s(m[g]);
        const d = s(m[I]);
        let v, w;
        for (; v = i[b], i[b] = v + 2, w = c[b], w[v] = g, w[v + 1] = I, b != d; )
          b += d > b ? 1 : -1;
      }
    );
    const f = this.getVertexData(), p = [];
    let _;
    for (a = 0; a < o; a++)
      if (f.xx && f.yy)
        for (_ = $i(c[a], f.xx, f.yy), h = 0; h < _.length; h++)
          p.push(_[h]);
    return Qn(p);
  }
}
function Ge(...e) {
  const t = e.join(" ");
  throw new Error(t);
}
function Je(e) {
  return e ? Yi(e) ? !0 : Di(e) ? !1 : e.length === 0 ? !0 : e.length > 0 : !1;
}
function Di(e) {
  return e != null && e.toString === String.prototype.toString;
}
function Yi(e) {
  return Array.isArray(e);
}
function Fi(e, t) {
  Je(e) || Ge("utils.sum() expects an array, received:", e);
  let n = 0, r;
  for (let o = 0, i = e.length; o < i; o++)
    r = e[o], r && (n += r);
  return n;
}
function Ri(e, t, n) {
  if (!Je(e))
    throw new Error(`#forEach() takes an array-like argument. ${e}`);
  for (let r = 0, o = e.length; r < o; r++)
    t.call(n, e[r], r);
}
function Li(e, t) {
  for (let n = 0, r = e.length; n < r; n++)
    e[n] = t;
  return e;
}
function $i(e, t, n) {
  const r = e.length - 2, o = [];
  let i, s, a, h, l, u, c, f, p, _, g, I, M, m, b, d, v;
  for (Hi(t, e), d = 0; d < r; ) {
    for (i = e[d], s = e[d + 1], l = t[i], u = t[s], p = n[i], _ = n[s], v = d; v < r && (v += 2, a = e[v], c = t[a], !(u < c)); ) {
      if (g = n[a], h = e[v + 1], f = t[h], I = n[h], p >= g) {
        if (p > I && _ > g && _ > I) continue;
      } else if (p < I && _ < g && _ < I) continue;
      i == a || i == h || s == a || s == h || (M = Vi(
        l,
        p,
        u,
        _,
        c,
        g,
        f,
        I
      ), M && (m = [i, s], b = [a, h], o.push(Bn(M, m, b, t, n)), M.length == 4 && o.push(
        Bn(M.slice(2), m, b, t, n)
      )));
    }
    d += 2;
  }
  return o;
}
function Vi(e, t, n, r, o, i, s, a) {
  const h = ji(e, t, n, r, o, i, s, a);
  let l = null;
  return h && (l = qi(e, t, n, r, o, i, s, a), l ? Qi(e, t, n, r, o, i, s, a) && (l = null) : l = Ki(e, t, n, r, o, i, s, a)), l;
}
function ji(e, t, n, r, o, i, s, a) {
  return ne(e, t, n, r, o, i) * ne(e, t, n, r, s, a) <= 0 && ne(o, i, s, a, e, t) * ne(o, i, s, a, n, r) <= 0;
}
function ne(e, t, n, r, o, i) {
  return Jn(e - o, t - i, n - o, r - i);
}
function Jn(e, t, n, r) {
  return e * r - t * n;
}
function qi(e, t, n, r, o, i, s, a) {
  let h = ve(e, t, n, r, o, i, s, a), l;
  return h && (l = zi(h[0], h[1], e, t, n, r, o, i, s, a), l == 1 ? h = ve(n, r, e, t, o, i, s, a) : l == 2 ? h = ve(o, i, s, a, e, t, n, r) : l == 3 && (h = ve(s, a, o, i, e, t, n, r))), h && Ji(h, e, t, n, r, o, i, s, a), h;
}
function ve(e, t, n, r, o, i, s, a) {
  const h = Jn(n - e, r - t, s - o, a - i), l = 1e-18;
  let u;
  if (h === 0) return null;
  const c = ne(o, i, s, a, e, t) / h;
  return h <= l && h >= -l ? u = Ui(e, t, n, r, o, i, s, a) : u = [e + c * (n - e), t + c * (r - t)], u;
}
function Ui(e, t, n, r, o, i, s, a) {
  let h = null;
  return !Bt(e, o, s) && !Bt(t, i, a) ? h = [e, t] : !Bt(n, o, s) && !Bt(r, i, a) ? h = [n, r] : !Bt(o, e, n) && !Bt(i, t, r) ? h = [o, i] : !Bt(s, e, n) && !Bt(a, t, r) && (h = [s, a]), h;
}
function Bt(e, t, n) {
  let r;
  return t < n ? r = e < t || e > n : t > n ? r = e > t || e < n : r = e != t, r;
}
function zi(e, t, ...n) {
  let r = -1, o = 1 / 0, i;
  for (let s = 0, a = 0, h = n.length; a < h; s++, a += 2)
    i = Gi(e, t, n[a], n[a + 1]), i < o && (o = i, r = s);
  return r;
}
function Gi(e, t, n, r) {
  const o = e - n, i = t - r;
  return o * o + i * i;
}
function Ji(e, t, n, r, o, i, s, a, h) {
  let l = e[0], u = e[1];
  l = be(l, t, r), l = be(l, i, a), u = be(u, n, o), u = be(u, s, h), e[0] = l, e[1] = u;
}
function be(e, t, n) {
  let r;
  return Bt(e, t, n) && (r = Math.abs(e - t) < Math.abs(e - n) ? t : n, e = r), e;
}
function Ki(e, t, n, r, o, i, s, a) {
  const h = Math.min(e, n, o, s), l = Math.max(e, n, o, s), u = Math.min(t, r, i, a), c = Math.max(t, r, i, a), f = c - u > l - h;
  let p = [];
  return (f ? Rt(t, u, c) : Rt(e, h, l)) && p.push(e, t), (f ? Rt(r, u, c) : Rt(n, h, l)) && p.push(n, r), (f ? Rt(i, u, c) : Rt(o, h, l)) && p.push(o, i), (f ? Rt(a, u, c) : Rt(s, h, l)) && p.push(s, a), (p.length != 2 && p.length != 4 || p.length == 4 && p[0] == p[2] && p[1] == p[3]) && (p = null), p;
}
function Qi(e, t, n, r, o, i, s, a) {
  return e == o && t == i || e == s && t == a || n == o && r == i || n == s && r == a;
}
function Rt(e, t, n) {
  return e > t && e < n;
}
function Hi(e, t) {
  Wi(e, t), Kn(e, t, 0, t.length - 2);
}
function Wi(e, t) {
  for (let n = 0, r = t.length; n < r; n += 2)
    e[t[n]] > e[t[n + 1]] && Zi(t, n, n + 1);
}
function Zi(e, t, n) {
  const r = e[t];
  e[t] = e[n], e[n] = r;
}
function Kn(e, t, n, r) {
  let o = n, i = r, s, a;
  for (; o < r; ) {
    for (s = e[t[n + r >> 2 << 1]]; o <= i; ) {
      for (; e[t[o]] < s; ) o += 2;
      for (; e[t[i]] > s; ) i -= 2;
      o <= i && (a = t[o], t[o] = t[i], t[i] = a, a = t[o + 1], t[o + 1] = t[i + 1], t[i + 1] = a, o += 2, i -= 2);
    }
    if (i - n < 40 ? On(e, t, n, i) : Kn(e, t, n, i), r - o < 40) {
      On(e, t, o, r);
      return;
    }
    n = o, i = r;
  }
}
function On(e, t, n, r) {
  let o, i;
  for (let s = n + 2; s <= r; s += 2) {
    o = t[s], i = t[s + 1];
    let a;
    for (a = s - 2; a >= n && e[o] < e[t[a]]; a -= 2)
      t[a + 2] = t[a], t[a + 3] = t[a + 1];
    t[a + 2] = o, t[a + 3] = i;
  }
}
function Bn(e, t, n, r, o) {
  const i = e[0], s = e[1];
  t = Nn(i, s, t[0], t[1], r, o), n = Nn(i, s, n[0], n[1], r, o);
  const a = t[0] < n[0] ? t : n, h = a == t ? n : t;
  return { x: i, y: s, a, b: h };
}
function Nn(e, t, n, r, o, i) {
  let s = n < r ? n : r, a = s === n ? r : n;
  return o[s] == e && i[s] == t ? a = s : o[a] == e && i[a] == t && (s = a), [s, a];
}
function Qn(e) {
  const t = {};
  return e.filter((n) => {
    const r = to(n);
    return r in t ? !1 : (t[r] = !0, !0);
  });
}
function to(e) {
  return `${e.a.join(",")};${e.b.join(",")}`;
}
class eo {
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
function no(e, t, n, r) {
  let o = n | 0;
  const i = isNaN(r) ? e.length - o : r + o;
  let s, a, h, l, u, c;
  if (i > 0)
    h = u = e[o], l = c = t[o];
  else return [void 0, void 0, void 0, void 0];
  for (o++; o < i; o++)
    s = e[o], a = t[o], s < h && (h = s), s > u && (u = s), a < l && (l = a), a > c && (c = a);
  return [h, l, u, c];
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
  setBounds(t, n, r, o) {
    let i, s, a, h;
    if (arguments.length == 1)
      if (Je(t)) {
        const l = t;
        i = l[0], s = l[1], a = l[2], h = l[3];
      } else {
        const l = t;
        i = l.xmin, s = l.ymin, a = l.xmax, h = l.ymax;
      }
    else
      i = t, s = n, a = r, h = o;
    return this.xmin = i, this.ymin = s, this.xmax = a, this.ymax = h, (i > a || s > h) && this.update(), this;
  }
  update() {
    let t;
    this.xmin > this.xmax && (t = this.xmin, this.xmin = this.xmax, this.xmax = t), this.ymin > this.ymax && (t = this.ymin, this.ymin = this.ymax, this.ymax = t);
  }
  mergeBounds(t, ...n) {
    let r, o, i, s;
    return t instanceof se ? (r = t.xmin, o = t.ymin, i = t.xmax, s = t.ymax) : n.length == 3 ? (r = t, o = n[0], i = n[1], s = n[2]) : t.length == 4 ? (r = t[0], o = t[1], i = t[2], s = t[3]) : Ge("Bounds#mergeBounds() invalid argument:", t), this.xmin === void 0 ? this.setBounds(r, o, i, s) : (r < this.xmin && (this.xmin = r), o < this.ymin && (this.ymin = o), i > this.xmax && (this.xmax = i), s > this.ymax && (this.ymax = s)), this;
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
    (n) => n.map((r) => t[r]).sort().join("-")
  ).sort();
}
function Hn(e, t, n) {
  const r = ke(t.forw), o = ke(t.bakw);
  if (JSON.stringify(r) != JSON.stringify(o))
    throw `${JSON.stringify(t, null, 2)}
${JSON.stringify(
      r
    )}
${JSON.stringify(o)}`;
  for (let i = 0; i < r.length; i++) {
    const s = r[i];
    e[s] || (e[s] = []), e[s].push(t);
  }
  n && (n.forw.features.push(t.forw), n.bakw.features.push(t.bakw));
}
function Tn(e, t, n) {
  const r = ke(t.forw), o = ke(t.bakw);
  if (JSON.stringify(r) != JSON.stringify(o))
    throw `${JSON.stringify(t, null, 2)}
${JSON.stringify(r)}
${JSON.stringify(o)}`;
  if (r.forEach((i) => {
    const s = e[i];
    if (!s) return;
    const a = s.filter((h) => h !== t);
    a.length === 0 ? delete e[i] : e[i] = a;
  }), n) {
    const i = (s, a) => {
      !s || !a || (s.features = s.features.filter((h) => h !== a));
    };
    i(n.forw, t.forw), i(n.bakw, t.bakw);
  }
}
function xe(e, t, n) {
  return Lt(e, { target: { geom: t, index: n } });
}
function _e(e) {
  return Lt(e.properties.target.geom, {
    target: {
      geom: e.geometry.coordinates,
      index: e.properties.target.index
    }
  });
}
function Xn(e, t) {
  const n = e.length, r = t.geometry.coordinates;
  return Array.from({ length: n }, (o, i) => i).map((o) => {
    const i = (o + 1) % n, s = e[o], a = e[i], h = s.geometry.coordinates, l = Math.atan2(
      h[0] - r[0],
      h[1] - r[1]
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
    }, f = St([
      ae([u], c)
    ]);
    return [l, f];
  }).reduce(
    (o, i) => (o[0].push(i[0]), o[1].push(i[1]), o),
    [[], []]
  );
}
function Me(e, t = 1e-6) {
  const [n, r] = e[0], [o, i] = e[1], [s, a] = e[2];
  return Math.abs((o - n) * (a - r) - (s - n) * (i - r)) < t;
}
function ro(e, t) {
  const n = /* @__PURE__ */ new Set();
  return e.forEach((r) => {
    if (r.length !== 2) return;
    const o = r.map((i) => `${t?.[i] ?? i}`);
    n.add(o.sort().join("-"));
  }), n;
}
function re(e) {
  return ["a", "b", "c"].map((t, n) => ({
    prop: e.properties[t],
    geom: e.geometry.coordinates[0][n]
  }));
}
const io = 10;
function oo(e, t, n, r, o, i) {
  if (!e && !t) return !1;
  const s = e ? 0 : 1, a = 1 - s, h = n[s], l = n[a];
  if (!h || !l) return !1;
  const u = xt(l.geom);
  let c = !1, f = !1;
  for (let p = 0; p <= 1; p++) {
    const _ = r[p];
    if (!_) continue;
    const g = [String(_.prop.index), String(h.prop.index)].sort().join("-"), I = o[g];
    if (!I || I.length < 2) continue;
    const M = I.find(
      (B) => B.bakw !== i[s].bakw
    );
    if (!M) continue;
    const b = re(M.bakw).find(
      (B) => String(B.prop.index) !== String(_.prop.index) && String(B.prop.index) !== String(h.prop.index)
    );
    if (!b) continue;
    c = !0;
    const d = xt(b.geom), v = xt(_.geom), w = xt(h.geom), A = w[0] - v[0], S = w[1] - v[1], E = A * (u[1] - v[1]) - S * (u[0] - v[0]), O = A * (d[1] - v[1]) - S * (d[0] - v[0]);
    if (E * O > 0) {
      f = !0;
      break;
    }
  }
  return c && !f;
}
function so(e, t, n, r) {
  if (!e && !t) return !1;
  if (n[0] && n[1] && r[0] && r[1]) {
    const o = r.map((u) => xt(u.geom)), i = n.map((u) => xt(u.geom)), s = o[1][0] - o[0][0], a = o[1][1] - o[0][1], h = s * (i[0][1] - o[0][1]) - a * (i[0][0] - o[0][0]), l = s * (i[1][1] - o[0][1]) - a * (i[1][0] - o[0][0]);
    return h * l < 0;
  }
  return !1;
}
function ao(e, t, n, r) {
  const o = ro(n, r), i = /* @__PURE__ */ new Set();
  let s = !1;
  for (let a = 0; a < io; a++) {
    let h = !1;
    for (const l of Object.keys(t)) {
      if (i.has(l)) continue;
      i.add(l);
      const u = t[l];
      if (!u || u.length < 2) continue;
      const c = l.split("-");
      if (c.length !== 2 || o.has(l)) continue;
      const f = re(u[0].bakw), p = re(u[1].bakw), _ = re(u[0].forw), g = re(u[1].forw), I = c.map(
        (x) => f.find((N) => `${N.prop.index}` === x) || p.find((N) => `${N.prop.index}` === x)
      ), M = c.map(
        (x) => _.find((N) => `${N.prop.index}` === x) || g.find((N) => `${N.prop.index}` === x)
      );
      if (I.some((x) => !x) || M.some((x) => !x))
        continue;
      const m = [f, p].map(
        (x) => x.find((N) => !c.includes(`${N.prop.index}`))
      ), b = [_, g].map(
        (x) => x.find((N) => !c.includes(`${N.prop.index}`))
      );
      if (m.some((x) => !x) || b.some((x) => !x))
        continue;
      const d = u[0].bakw.geometry.coordinates[0].slice(0, 3).map((x) => xt(x)), v = u[1].bakw.geometry.coordinates[0].slice(0, 3).map((x) => xt(x)), w = u[0].forw.geometry.coordinates[0].slice(0, 3).map((x) => xt(x)), A = u[1].forw.geometry.coordinates[0].slice(0, 3).map((x) => xt(x)), S = Me(d), E = Me(v), O = Me(w), B = Me(A), X = oo(
        S,
        E,
        m,
        I,
        t,
        u
      ), F = so(
        O,
        B,
        m,
        I
      );
      if (!(X || F || Cn(
        xt(m[0].geom),
        v
      ) || Cn(
        xt(m[1].geom),
        d
      )))
        continue;
      const P = M.map(
        (x) => xt(x.geom)
      ), k = b.map(
        (x) => xt(x.geom)
      ), T = co([
        ...P,
        ...k
      ]), C = lo(T), Y = Dn(
        P[0],
        P[1],
        k[0]
      ) + Dn(
        P[0],
        P[1],
        k[1]
      );
      je(C, Y) && (Tn(t, u[0], e), Tn(t, u[1], e), I.forEach((x) => {
        if (!x) return;
        const N = [
          x.geom,
          m[0].geom,
          m[1].geom,
          x.geom
        ], D = {
          a: x.prop,
          b: m[0].prop,
          c: m[1].prop
        }, R = ae([N], D), $ = Un(R);
        Hn(t, {
          forw: $,
          bakw: R
        }, e);
      }), h = !0, s = !0);
    }
    if (!h) break;
  }
  return s;
}
function xt(e) {
  return [e[0], e[1]];
}
function Cn(e, t) {
  const [n, r] = t[0], [o, i] = t[1], [s, a] = t[2], h = s - n, l = a - r, u = o - n, c = i - r, f = e[0] - n, p = e[1] - r, _ = h * h + l * l, g = h * u + l * c, I = h * f + l * p, M = u * u + c * c, m = u * f + c * p, b = _ * M - g * g;
  if (b === 0) return !1;
  const d = 1 / b, v = (M * I - g * m) * d, w = (_ * m - g * I) * d, A = 1e-9;
  return v >= -A && w >= -A && v + w <= 1 + A;
}
function co(e) {
  const t = e.map((s) => s.slice()).filter(
    (s, a, h) => h.findIndex(
      (l) => je(l[0], s[0]) && je(l[1], s[1])
    ) === a
  );
  if (t.length <= 1) return t;
  const n = t.sort(
    (s, a) => s[0] === a[0] ? s[1] - a[1] : s[0] - a[0]
  ), r = (s, a, h) => (a[0] - s[0]) * (h[1] - s[1]) - (a[1] - s[1]) * (h[0] - s[0]), o = [];
  for (const s of n) {
    for (; o.length >= 2 && r(
      o[o.length - 2],
      o[o.length - 1],
      s
    ) <= 0; )
      o.pop();
    o.push(s);
  }
  const i = [];
  for (let s = n.length - 1; s >= 0; s--) {
    const a = n[s];
    for (; i.length >= 2 && r(
      i[i.length - 2],
      i[i.length - 1],
      a
    ) <= 0; )
      i.pop();
    i.push(a);
  }
  return i.pop(), o.pop(), o.concat(i);
}
function lo(e) {
  if (e.length < 3) return 0;
  let t = 0;
  for (let n = 0; n < e.length; n++) {
    const [r, o] = e[n], [i, s] = e[(n + 1) % e.length];
    t += r * s - i * o;
  }
  return Math.abs(t) / 2;
}
function Dn(e, t, n) {
  return Math.abs(
    (e[0] * (t[1] - n[1]) + t[0] * (n[1] - e[1]) + n[0] * (e[1] - t[1])) / 2
  );
}
function je(e, t, n = 1e-9) {
  return Math.abs(e - t) <= n;
}
const Yn = 2.00704, Fn = 3.00001;
class ht extends Mt {
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
    return this.useV2Algorithm ? Yn : Fn;
  }
  /**
   * 制御点（GCP: Ground Control Points）を設定します。
   * 指定した点群に合わせて内部のTINキャッシュをリセットします。
   */
  setPoints(t) {
    this.yaxisMode === ht.YAXIS_FOLLOW && (t = t.map((n) => [
      n[0],
      [n[1][0], -1 * n[1][1]]
    ])), this.points = t, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * エッジ（制約線）を設定します。
   * 制約線を正規化した上で、依存するキャッシュをリセットします。
   */
  setEdges(t = []) {
    this.edges = zn(t), this.edgeNodes = void 0, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 境界ポリゴンを設定します
   */
  setBounds(t) {
    this.bounds = t;
    let n = t[0][0], r = n, o = t[0][1], i = o;
    const s = [t[0]];
    for (let a = 1; a < t.length; a++) {
      const h = t[a];
      h[0] < n && (n = h[0]), h[0] > r && (r = h[0]), h[1] < o && (o = h[1]), h[1] > i && (i = h[1]), s.push(h);
    }
    s.push(t[0]), this.boundsPolygon = ae([s]), this.xy = [n, o], this.wh = [r - n, i - o], this.vertexMode = ht.VERTEX_PLAIN, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 現在の設定を永続化可能な形式にコンパイルします
   */
  getCompiled() {
    const t = {};
    t.version = this.useV2Algorithm ? Yn : Fn, t.points = this.points, t.weight_buffer = {}, t.centroid_point = [
      this.centroid.forw.geometry.coordinates,
      this.centroid.forw.properties.target.geom
    ], t.vertices_params = [
      this.vertices_params.forw[0],
      this.vertices_params.bakw[0]
    ], t.vertices_points = [];
    const n = this.vertices_params.forw[1];
    if (n)
      for (let r = 0; r < n.length; r++) {
        const o = n[r].features[0], i = o.geometry.coordinates[0][1], s = o.properties.b.geom;
        t.vertices_points[r] = [i, s];
      }
    return t.strict_status = this.strict_status, t.tins_points = [[]], this.tins.forw.features.map((r) => {
      t.tins_points[0].push(
        ["a", "b", "c"].map(
          (o) => r.properties[o].index
        )
      );
    }), this.strict_status === ht.STATUS_LOOSE ? (t.tins_points[1] = [], this.tins.bakw.features.map((r) => {
      t.tins_points[1].push(
        ["a", "b", "c"].map(
          (o) => r.properties[o].index
        )
      );
    })) : this.strict_status === ht.STATUS_ERROR && this.kinks?.bakw && (t.kinks_points = this.kinks.bakw.features.map(
      (r) => r.geometry.coordinates
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
      (i) => Un(i)
    );
    this.tins.bakw = St(t);
    const n = {};
    this.tins.forw.features.forEach((i, s) => {
      const a = this.tins.bakw.features[s];
      Hn(n, { forw: i, bakw: a });
    });
    const r = (this.pointsSet?.forw.features ?? []).map(
      (i) => i.properties.target.index
    );
    ao(
      this.tins,
      n,
      this.pointsSet?.edges || [],
      r
    );
    const o = ["forw", "bakw"].map((i) => {
      const s = this.tins[i].features.map(
        (a) => a.geometry.coordinates[0]
      );
      return Xi(s);
    });
    o[0].length === 0 && o[1].length === 0 ? (this.strict_status = ht.STATUS_STRICT, delete this.kinks) : (this.strict_status = ht.STATUS_ERROR, this.kinks = {
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
      const i = this.points[o][0], s = this.points[o][1], a = xe(i, s, o);
      t.forw.push(a), t.bakw.push(_e(a));
    }
    const n = [];
    let r = 0;
    this.edgeNodes = [], this.edges || (this.edges = []);
    for (let o = 0; o < this.edges.length; o++) {
      const i = this.edges[o][2], s = Object.assign([], this.edges[o][0]), a = Object.assign([], this.edges[o][1]);
      if (s.length === 0 && a.length === 0) {
        n.push(i);
        continue;
      }
      s.unshift(this.points[i[0]][0]), s.push(this.points[i[1]][0]), a.unshift(this.points[i[0]][1]), a.push(this.points[i[1]][1]);
      const h = [s, a].map((l) => {
        const u = l.map((f, p, _) => {
          if (p === 0) return 0;
          const g = _[p - 1];
          return Math.sqrt(
            Math.pow(f[0] - g[0], 2) + Math.pow(f[1] - g[1], 2)
          );
        }), c = u.reduce((f, p, _) => _ === 0 ? [0] : (f.push(f[_ - 1] + p), f), []);
        return c.map((f, p, _) => {
          const g = f / _[_.length - 1];
          return [l[p], u[p], c[p], g];
        });
      });
      h.map((l, u) => {
        const c = h[u ? 0 : 1];
        return l.filter((f, p) => !(p === 0 || p === l.length - 1 || f[4] === "handled")).flatMap((f) => {
          const p = f[0], _ = f[3], g = c.reduce(
            (I, M, m, b) => {
              if (I) return I;
              const d = b[m + 1];
              if (M[3] === _)
                return M[4] = "handled", [M];
              if (M[3] < _ && d && d[3] > _)
                return [M, d];
            },
            void 0
          );
          if (g && g.length === 1)
            return u === 0 ? [[p, g[0][0], _]] : [[g[0][0], p, _]];
          if (g && g.length === 2) {
            const I = g[0], M = g[1], m = (_ - I[3]) / (M[3] - I[3]), b = [
              (M[0][0] - I[0][0]) * m + I[0][0],
              (M[0][1] - I[0][1]) * m + I[0][1]
            ];
            return u === 0 ? [[p, b, _]] : [[b, p, _]];
          }
          return [];
        });
      }).reduce((l, u) => l.concat(u), []).sort((l, u) => l[2] < u[2] ? -1 : 1).map((l, u, c) => {
        this.edgeNodes[r] = [
          l[0],
          l[1]
        ];
        const f = xe(
          l[0],
          l[1],
          `e${r}`
        );
        r++, t.forw.push(f), t.bakw.push(_e(f)), u === 0 ? n.push([i[0], t.forw.length - 1]) : n.push([
          t.forw.length - 2,
          t.forw.length - 1
        ]), u === c.length - 1 && n.push([t.forw.length - 1, i[1]]);
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
    const t = this.xy[0] - 0.05 * this.wh[0], n = this.xy[0] + 1.05 * this.wh[0], r = this.xy[1] - 0.05 * this.wh[1], o = this.xy[1] + 1.05 * this.wh[1];
    if (this.bounds && !this.boundsPolygon) throw new Error("Internal error: bounds is set but boundsPolygon is missing");
    const i = this.bounds ? this.boundsPolygon : void 0;
    if (!this.points.reduce((h, l) => h && (i ? Xe(l[0], i) : l[0][0] >= t && l[0][0] <= n && l[0][1] >= r && l[0][1] <= o), !0))
      throw "SOME POINTS OUTSIDE";
    let a = [];
    return this.wh && (a = [[t, r], [n, r], [t, o], [n, o]]), {
      pointsSet: this.generatePointsSet(),
      bbox: a,
      minx: t,
      maxx: n,
      miny: r,
      maxy: o
    };
  }
  /**
   * Compute a bounding box derived from GCP coordinates with a 5% margin.
   * Used in V3 plain mode where no explicit image bounds are available.
   */
  computeGcpBbox() {
    let t = 1 / 0, n = -1 / 0, r = 1 / 0, o = -1 / 0;
    for (const a of this.points) {
      const h = a[0][0], l = a[0][1];
      h < t && (t = h), h > n && (n = h), l < r && (r = l), l > o && (o = l);
    }
    const i = n - t, s = o - r;
    return {
      minx: t - 0.05 * i,
      maxx: n + 0.05 * i,
      miny: r - 0.05 * s,
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
    const n = !this.useV2Algorithm;
    let r, o, i, s, a;
    if (n) {
      if (this.bounds) {
        const S = this.boundsPolygon;
        if (!S) throw new Error("Internal error: bounds is set but boundsPolygon is missing");
        if (!this.points.every(
          (O) => Xe(O[0], S)
        )) throw "SOME POINTS OUTSIDE";
      }
      r = this.generatePointsSet(), { minx: o, maxx: i, miny: s, maxy: a } = this.computeGcpBbox();
    } else {
      const S = this.validateAndPrepareInputs();
      r = S.pointsSet, o = S.minx, i = S.maxx, s = S.miny, a = S.maxy;
    }
    const h = {
      forw: St(r.forw),
      bakw: St(r.bakw)
    }, l = ye(
      h.forw,
      r.edges,
      "target"
    ), u = ye(
      h.bakw,
      r.edges,
      "target"
    );
    if (l.features.length === 0 || u.features.length === 0)
      throw "TOO LINEAR1";
    const c = Nr(h.forw), f = mn(h.forw);
    if (!f) throw "TOO LINEAR2";
    const p = {}, _ = f.geometry.coordinates[0];
    let g;
    try {
      g = _.map((S) => ({
        forw: S,
        bakw: ee(Lt(S), l)
      })), g.forEach((S) => {
        p[`${S.forw[0]}:${S.forw[1]}`] = S;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const I = mn(h.bakw);
    if (!I) throw "TOO LINEAR2";
    const M = I.geometry.coordinates[0];
    try {
      g = M.map((S) => ({
        bakw: S,
        forw: ee(Lt(S), u)
      })), g.forEach((S) => {
        p[`${S.forw[0]}:${S.forw[1]}`] = S;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    let m;
    if (n) {
      const S = c.geometry.coordinates, E = l.features.find(
        (O) => Xe(
          Lt(S),
          O
        )
      );
      if (E) {
        const O = E.geometry.coordinates[0], B = E.properties.a.geom, X = E.properties.b.geom, F = E.properties.c.geom;
        m = {
          forw: [
            (O[0][0] + O[1][0] + O[2][0]) / 3,
            (O[0][1] + O[1][1] + O[2][1]) / 3
          ],
          bakw: [
            (B[0] + X[0] + F[0]) / 3,
            (B[1] + X[1] + F[1]) / 3
          ]
        };
      } else
        m = {
          forw: S,
          bakw: ee(c, l)
        };
    } else
      m = {
        forw: c.geometry.coordinates,
        bakw: ee(c, l)
      };
    const b = xe(m.forw, m.bakw, "c");
    this.centroid = {
      forw: b,
      bakw: _e(b)
    };
    const d = [
      ...this.points.map((S) => ({ forw: S[0], bakw: S[1] })),
      ...(this.edgeNodes ?? []).map((S) => ({ forw: S[0], bakw: S[1] }))
    ], v = {
      convexBuf: p,
      centroid: m,
      allGcps: d,
      minx: o,
      maxx: i,
      miny: s,
      maxy: a
    }, w = this.vertexMode === ht.VERTEX_BIRDEYE ? Ti(v, n) : Ni(v, n), A = {
      forw: [],
      bakw: []
    };
    for (let S = 0; S < w.length; S++) {
      const E = w[S].forw, O = w[S].bakw, B = xe(E, O, `b${S}`), X = _e(B);
      r.forw.push(B), r.bakw.push(X), A.forw.push(B), A.bakw.push(X);
    }
    this.pointsSet = {
      forw: St(r.forw),
      bakw: St(r.bakw),
      edges: r.edges
    }, this.tins = {
      forw: _n(
        ye(
          this.pointsSet.forw,
          r.edges,
          "target"
        )
      )
    }, (t === ht.MODE_STRICT || t === ht.MODE_AUTO) && this.calculateStrictTin(), (t === ht.MODE_LOOSE || t === ht.MODE_AUTO && this.strict_status === ht.STATUS_ERROR) && (this.tins.bakw = _n(
      ye(
        this.pointsSet.bakw,
        r.edges,
        "target"
      )
    ), delete this.kinks, this.strict_status = ht.STATUS_LOOSE), this.vertices_params = {
      forw: Xn(A.forw, this.centroid.forw),
      bakw: Xn(A.bakw, this.centroid.bakw)
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
export {
  ht as Tin,
  ye as constrainedTin,
  _e as counterPoint,
  xe as createPoint,
  ht as default,
  Xi as findIntersections,
  Yn as format_version,
  Hn as insertSearchIndex,
  Xn as vertexCalc
};
