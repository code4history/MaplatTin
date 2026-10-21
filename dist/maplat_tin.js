function oe(e, t, n = {}) {
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
function St(e, t = {}) {
  const n = { type: "FeatureCollection" };
  return t.id && (n.id = t.id), t.bbox && (n.bbox = t.bbox), n.features = e, n;
}
function We(e) {
  return !isNaN(e) && e !== null && !Array.isArray(e);
}
function ni(e) {
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
function ii(e) {
  return e.type === "Feature" ? e.geometry : e;
}
function ze(e, t, n) {
  if (e !== null)
    for (var i, o, r, s, a, h, l, u = 0, c = 0, f, p = e.type, M = p === "FeatureCollection", w = p === "Feature", I = M ? e.features.length : 1, x = 0; x < I; x++) {
      l = M ? (
        // @ts-expect-error: Known type conflict
        e.features[x].geometry
      ) : w ? (
        // @ts-expect-error: Known type conflict
        e.geometry
      ) : e, f = l ? l.type === "GeometryCollection" : !1, a = f ? l.geometries.length : 1;
      for (var m = 0; m < a; m++) {
        var _ = 0, d = 0;
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
                  x,
                  _,
                  d
                ) === !1
              )
                return !1;
              c++, _++;
              break;
            case "LineString":
            case "MultiPoint":
              for (i = 0; i < h.length; i++) {
                if (
                  // @ts-expect-error: Known type conflict
                  t(
                    h[i],
                    c,
                    x,
                    _,
                    d
                  ) === !1
                )
                  return !1;
                c++, v === "MultiPoint" && _++;
              }
              v === "LineString" && _++;
              break;
            case "Polygon":
            case "MultiLineString":
              for (i = 0; i < h.length; i++) {
                for (o = 0; o < h[i].length - u; o++) {
                  if (
                    // @ts-expect-error: Known type conflict
                    t(
                      h[i][o],
                      c,
                      x,
                      _,
                      d
                    ) === !1
                  )
                    return !1;
                  c++;
                }
                v === "MultiLineString" && _++, v === "Polygon" && d++;
              }
              v === "Polygon" && _++;
              break;
            case "MultiPolygon":
              for (i = 0; i < h.length; i++) {
                for (d = 0, o = 0; o < h[i].length; o++) {
                  for (r = 0; r < h[i][o].length - u; r++) {
                    if (
                      // @ts-expect-error: Known type conflict
                      t(
                        h[i][o][r],
                        c,
                        x,
                        _,
                        d
                      ) === !1
                    )
                      return !1;
                    c++;
                  }
                  d++;
                }
                _++;
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
  let r, s, a, h, l = t[0], u = i[0], c = 0, f = 0;
  u > l == u > -l ? (r = l, l = t[++c]) : (r = u, u = i[++f]);
  let p = 0;
  if (c < e && f < n)
    for (u > l == u > -l ? (s = l + r, a = r - (s - l), l = t[++c]) : (s = u + r, a = r - (s - u), u = i[++f]), r = s, a !== 0 && (o[p++] = a); c < e && f < n; )
      u > l == u > -l ? (s = r + l, h = s - r, a = r - (s - h) + (l - h), l = t[++c]) : (s = r + u, h = s - r, a = r - (s - h) + (u - h), u = i[++f]), r = s, a !== 0 && (o[p++] = a);
  for (; c < e; )
    s = r + l, h = s - r, a = r - (s - h) + (l - h), l = t[++c], r = s, a !== 0 && (o[p++] = a);
  for (; f < n; )
    s = r + u, h = s - r, a = r - (s - h) + (u - h), u = i[++f], r = s, a !== 0 && (o[p++] = a);
  return (r !== 0 || p === 0) && (o[p++] = r), p;
}
function _t(e, t, n, i, o, r, s, a) {
  return ft(ft(e, t, n, i, s), s, o, r, a);
}
function $(e, t, n, i) {
  let o, r, s, a, h, l, u, c, f, p, M;
  u = U * n, p = u - (u - n), M = n - p;
  let w = t[0];
  o = w * n, u = U * w, c = u - (u - w), f = w - c, s = f * M - (o - c * p - f * p - c * M);
  let I = 0;
  s !== 0 && (i[I++] = s);
  for (let x = 1; x < e; x++)
    w = t[x], a = w * n, u = U * w, c = u - (u - w), f = w - c, h = f * M - (a - c * p - f * p - c * M), r = o + h, l = r - o, s = o - (r - l) + (h - l), s !== 0 && (i[I++] = s), o = a + r, s = r - (o - a), s !== 0 && (i[I++] = s);
  return (o !== 0 || I === 0) && (i[I++] = o), I;
}
function $n(e, t) {
  let n = t[0];
  for (let i = 1; i < e; i++) n += t[i];
  return n;
}
function tt(e) {
  return new Float64Array(e);
}
const ri = (3 + 16 * pt) * pt, oi = (2 + 12 * pt) * pt, si = (9 + 64 * pt) * pt * pt, zt = tt(4), Ze = tt(8), tn = tt(12), en = tt(16), mt = tt(4);
function ai(e, t, n, i, o, r, s) {
  let a, h, l, u, c, f, p, M, w, I, x, m, _, d, v, g, k, S;
  const A = e - o, O = n - o, B = t - r, X = i - r;
  d = A * X, f = U * A, p = f - (f - A), M = A - p, f = U * X, w = f - (f - X), I = X - w, v = M * I - (d - p * w - M * w - p * I), g = B * O, f = U * B, p = f - (f - B), M = B - p, f = U * O, w = f - (f - O), I = O - w, k = M * I - (g - p * w - M * w - p * I), x = v - k, c = v - x, zt[0] = v - (x + c) + (c - k), m = d + x, c = m - d, _ = d - (m - c) + (x - c), x = _ - g, c = _ - x, zt[1] = _ - (x + c) + (c - g), S = m + x, c = S - m, zt[2] = m - (S - c) + (x - c), zt[3] = S;
  let Y = $n(4, zt), y = oi * s;
  if (Y >= y || -Y >= y || (c = e - A, a = e - (A + c) + (c - o), c = n - O, l = n - (O + c) + (c - o), c = t - B, h = t - (B + c) + (c - r), c = i - X, u = i - (X + c) + (c - r), a === 0 && h === 0 && l === 0 && u === 0) || (y = si * s + Rn * Math.abs(Y), Y += A * u + X * a - (B * l + O * h), Y >= y || -Y >= y)) return Y;
  d = a * X, f = U * a, p = f - (f - a), M = a - p, f = U * X, w = f - (f - X), I = X - w, v = M * I - (d - p * w - M * w - p * I), g = h * O, f = U * h, p = f - (f - h), M = h - p, f = U * O, w = f - (f - O), I = O - w, k = M * I - (g - p * w - M * w - p * I), x = v - k, c = v - x, mt[0] = v - (x + c) + (c - k), m = d + x, c = m - d, _ = d - (m - c) + (x - c), x = _ - g, c = _ - x, mt[1] = _ - (x + c) + (c - g), S = m + x, c = S - m, mt[2] = m - (S - c) + (x - c), mt[3] = S;
  const P = ft(4, zt, 4, mt, Ze);
  d = A * u, f = U * A, p = f - (f - A), M = A - p, f = U * u, w = f - (f - u), I = u - w, v = M * I - (d - p * w - M * w - p * I), g = B * l, f = U * B, p = f - (f - B), M = B - p, f = U * l, w = f - (f - l), I = l - w, k = M * I - (g - p * w - M * w - p * I), x = v - k, c = v - x, mt[0] = v - (x + c) + (c - k), m = d + x, c = m - d, _ = d - (m - c) + (x - c), x = _ - g, c = _ - x, mt[1] = _ - (x + c) + (c - g), S = m + x, c = S - m, mt[2] = m - (S - c) + (x - c), mt[3] = S;
  const E = ft(P, Ze, 4, mt, tn);
  d = a * u, f = U * a, p = f - (f - a), M = a - p, f = U * u, w = f - (f - u), I = u - w, v = M * I - (d - p * w - M * w - p * I), g = h * l, f = U * h, p = f - (f - h), M = h - p, f = U * l, w = f - (f - l), I = l - w, k = M * I - (g - p * w - M * w - p * I), x = v - k, c = v - x, mt[0] = v - (x + c) + (c - k), m = d + x, c = m - d, _ = d - (m - c) + (x - c), x = _ - g, c = _ - x, mt[1] = _ - (x + c) + (c - g), S = m + x, c = S - m, mt[2] = m - (S - c) + (x - c), mt[3] = S;
  const T = ft(E, tn, 4, mt, en);
  return en[T - 1];
}
function Pt(e, t, n, i, o, r) {
  const s = (t - r) * (n - o), a = (e - o) * (i - r), h = s - a, l = Math.abs(s + a);
  return Math.abs(h) >= ri * l ? h : -ai(e, t, n, i, o, r, l);
}
const ci = (10 + 96 * pt) * pt, li = (4 + 48 * pt) * pt, hi = (44 + 576 * pt) * pt * pt, Ct = tt(4), Dt = tt(4), Ft = tt(4), kt = tt(4), Et = tt(4), At = tt(4), gt = tt(4), wt = tt(4), Pe = tt(8), Oe = tt(8), Be = tt(8), Ne = tt(8), Te = tt(8), Xe = tt(8), ue = tt(8), de = tt(8), pe = tt(8), Lt = tt(4), Vt = tt(4), jt = tt(4), z = tt(8), K = tt(16), nt = tt(16), it = tt(16), et = tt(32), Yt = tt(32), at = tt(48), bt = tt(64);
let Qt = tt(1152), Ce = tt(1152);
function ct(e, t, n) {
  e = ft(e, Qt, t, n, Ce);
  const i = Qt;
  return Qt = Ce, Ce = i, e;
}
function fi(e, t, n, i, o, r, s, a, h) {
  let l, u, c, f, p, M, w, I, x, m, _, d, v, g, k, S, A, O, B, X, Y, y, P, E, T, C, F, b, N, D, R, L, V, q, j;
  const J = e - s, G = n - s, Q = o - s, H = t - a, Z = i - a, W = r - a;
  R = G * W, P = U * G, E = P - (P - G), T = G - E, P = U * W, C = P - (P - W), F = W - C, L = T * F - (R - E * C - T * C - E * F), V = Q * Z, P = U * Q, E = P - (P - Q), T = Q - E, P = U * Z, C = P - (P - Z), F = Z - C, q = T * F - (V - E * C - T * C - E * F), b = L - q, y = L - b, Ct[0] = L - (b + y) + (y - q), N = R + b, y = N - R, D = R - (N - y) + (b - y), b = D - V, y = D - b, Ct[1] = D - (b + y) + (y - V), j = N + b, y = j - N, Ct[2] = N - (j - y) + (b - y), Ct[3] = j, R = Q * H, P = U * Q, E = P - (P - Q), T = Q - E, P = U * H, C = P - (P - H), F = H - C, L = T * F - (R - E * C - T * C - E * F), V = J * W, P = U * J, E = P - (P - J), T = J - E, P = U * W, C = P - (P - W), F = W - C, q = T * F - (V - E * C - T * C - E * F), b = L - q, y = L - b, Dt[0] = L - (b + y) + (y - q), N = R + b, y = N - R, D = R - (N - y) + (b - y), b = D - V, y = D - b, Dt[1] = D - (b + y) + (y - V), j = N + b, y = j - N, Dt[2] = N - (j - y) + (b - y), Dt[3] = j, R = J * Z, P = U * J, E = P - (P - J), T = J - E, P = U * Z, C = P - (P - Z), F = Z - C, L = T * F - (R - E * C - T * C - E * F), V = G * H, P = U * G, E = P - (P - G), T = G - E, P = U * H, C = P - (P - H), F = H - C, q = T * F - (V - E * C - T * C - E * F), b = L - q, y = L - b, Ft[0] = L - (b + y) + (y - q), N = R + b, y = N - R, D = R - (N - y) + (b - y), b = D - V, y = D - b, Ft[1] = D - (b + y) + (y - V), j = N + b, y = j - N, Ft[2] = N - (j - y) + (b - y), Ft[3] = j, l = ft(
    ft(
      ft(
        $($(4, Ct, J, z), z, J, K),
        K,
        $($(4, Ct, H, z), z, H, nt),
        nt,
        et
      ),
      et,
      ft(
        $($(4, Dt, G, z), z, G, K),
        K,
        $($(4, Dt, Z, z), z, Z, nt),
        nt,
        Yt
      ),
      Yt,
      bt
    ),
    bt,
    ft(
      $($(4, Ft, Q, z), z, Q, K),
      K,
      $($(4, Ft, W, z), z, W, nt),
      nt,
      et
    ),
    et,
    Qt
  );
  let st = $n(l, Qt), lt = li * h;
  if (st >= lt || -st >= lt || (y = e - J, u = e - (J + y) + (y - s), y = t - H, p = t - (H + y) + (y - a), y = n - G, c = n - (G + y) + (y - s), y = i - Z, M = i - (Z + y) + (y - a), y = o - Q, f = o - (Q + y) + (y - s), y = r - W, w = r - (W + y) + (y - a), u === 0 && c === 0 && f === 0 && p === 0 && M === 0 && w === 0) || (lt = hi * h + Rn * Math.abs(st), st += (J * J + H * H) * (G * w + W * c - (Z * f + Q * M)) + 2 * (J * u + H * p) * (G * W - Z * Q) + ((G * G + Z * Z) * (Q * p + H * f - (W * u + J * w)) + 2 * (G * c + Z * M) * (Q * H - W * J)) + ((Q * Q + W * W) * (J * M + Z * u - (H * c + G * p)) + 2 * (Q * f + W * w) * (J * Z - H * G)), st >= lt || -st >= lt))
    return st;
  if ((c !== 0 || M !== 0 || f !== 0 || w !== 0) && (R = J * J, P = U * J, E = P - (P - J), T = J - E, L = T * T - (R - E * E - (E + E) * T), V = H * H, P = U * H, E = P - (P - H), T = H - E, q = T * T - (V - E * E - (E + E) * T), b = L + q, y = b - L, kt[0] = L - (b - y) + (q - y), N = R + b, y = N - R, D = R - (N - y) + (b - y), b = D + V, y = b - D, kt[1] = D - (b - y) + (V - y), j = N + b, y = j - N, kt[2] = N - (j - y) + (b - y), kt[3] = j), (f !== 0 || w !== 0 || u !== 0 || p !== 0) && (R = G * G, P = U * G, E = P - (P - G), T = G - E, L = T * T - (R - E * E - (E + E) * T), V = Z * Z, P = U * Z, E = P - (P - Z), T = Z - E, q = T * T - (V - E * E - (E + E) * T), b = L + q, y = b - L, Et[0] = L - (b - y) + (q - y), N = R + b, y = N - R, D = R - (N - y) + (b - y), b = D + V, y = b - D, Et[1] = D - (b - y) + (V - y), j = N + b, y = j - N, Et[2] = N - (j - y) + (b - y), Et[3] = j), (u !== 0 || p !== 0 || c !== 0 || M !== 0) && (R = Q * Q, P = U * Q, E = P - (P - Q), T = Q - E, L = T * T - (R - E * E - (E + E) * T), V = W * W, P = U * W, E = P - (P - W), T = W - E, q = T * T - (V - E * E - (E + E) * T), b = L + q, y = b - L, At[0] = L - (b - y) + (q - y), N = R + b, y = N - R, D = R - (N - y) + (b - y), b = D + V, y = b - D, At[1] = D - (b - y) + (V - y), j = N + b, y = j - N, At[2] = N - (j - y) + (b - y), At[3] = j), u !== 0 && (I = $(4, Ct, u, Pe), l = ct(l, _t(
    $(I, Pe, 2 * J, K),
    K,
    $($(4, At, u, z), z, Z, nt),
    nt,
    $($(4, Et, u, z), z, -W, it),
    it,
    et,
    at
  ), at)), p !== 0 && (x = $(4, Ct, p, Oe), l = ct(l, _t(
    $(x, Oe, 2 * H, K),
    K,
    $($(4, Et, p, z), z, Q, nt),
    nt,
    $($(4, At, p, z), z, -G, it),
    it,
    et,
    at
  ), at)), c !== 0 && (m = $(4, Dt, c, Be), l = ct(l, _t(
    $(m, Be, 2 * G, K),
    K,
    $($(4, kt, c, z), z, W, nt),
    nt,
    $($(4, At, c, z), z, -H, it),
    it,
    et,
    at
  ), at)), M !== 0 && (_ = $(4, Dt, M, Ne), l = ct(l, _t(
    $(_, Ne, 2 * Z, K),
    K,
    $($(4, At, M, z), z, J, nt),
    nt,
    $($(4, kt, M, z), z, -Q, it),
    it,
    et,
    at
  ), at)), f !== 0 && (d = $(4, Ft, f, Te), l = ct(l, _t(
    $(d, Te, 2 * Q, K),
    K,
    $($(4, Et, f, z), z, H, nt),
    nt,
    $($(4, kt, f, z), z, -Z, it),
    it,
    et,
    at
  ), at)), w !== 0 && (v = $(4, Ft, w, Xe), l = ct(l, _t(
    $(v, Xe, 2 * W, K),
    K,
    $($(4, kt, w, z), z, G, nt),
    nt,
    $($(4, Et, w, z), z, -J, it),
    it,
    et,
    at
  ), at)), u !== 0 || p !== 0) {
    if (c !== 0 || M !== 0 || f !== 0 || w !== 0 ? (R = c * W, P = U * c, E = P - (P - c), T = c - E, P = U * W, C = P - (P - W), F = W - C, L = T * F - (R - E * C - T * C - E * F), V = G * w, P = U * G, E = P - (P - G), T = G - E, P = U * w, C = P - (P - w), F = w - C, q = T * F - (V - E * C - T * C - E * F), b = L + q, y = b - L, gt[0] = L - (b - y) + (q - y), N = R + b, y = N - R, D = R - (N - y) + (b - y), b = D + V, y = b - D, gt[1] = D - (b - y) + (V - y), j = N + b, y = j - N, gt[2] = N - (j - y) + (b - y), gt[3] = j, R = f * -Z, P = U * f, E = P - (P - f), T = f - E, P = U * -Z, C = P - (P - -Z), F = -Z - C, L = T * F - (R - E * C - T * C - E * F), V = Q * -M, P = U * Q, E = P - (P - Q), T = Q - E, P = U * -M, C = P - (P - -M), F = -M - C, q = T * F - (V - E * C - T * C - E * F), b = L + q, y = b - L, wt[0] = L - (b - y) + (q - y), N = R + b, y = N - R, D = R - (N - y) + (b - y), b = D + V, y = b - D, wt[1] = D - (b - y) + (V - y), j = N + b, y = j - N, wt[2] = N - (j - y) + (b - y), wt[3] = j, k = ft(4, gt, 4, wt, de), R = c * w, P = U * c, E = P - (P - c), T = c - E, P = U * w, C = P - (P - w), F = w - C, L = T * F - (R - E * C - T * C - E * F), V = f * M, P = U * f, E = P - (P - f), T = f - E, P = U * M, C = P - (P - M), F = M - C, q = T * F - (V - E * C - T * C - E * F), b = L - q, y = L - b, Vt[0] = L - (b + y) + (y - q), N = R + b, y = N - R, D = R - (N - y) + (b - y), b = D - V, y = D - b, Vt[1] = D - (b + y) + (y - V), j = N + b, y = j - N, Vt[2] = N - (j - y) + (b - y), Vt[3] = j, O = 4) : (de[0] = 0, k = 1, Vt[0] = 0, O = 1), u !== 0) {
      const rt = $(k, de, u, it);
      l = ct(l, ft(
        $(I, Pe, u, K),
        K,
        $(rt, it, 2 * J, et),
        et,
        at
      ), at);
      const ot = $(O, Vt, u, z);
      l = ct(l, _t(
        $(ot, z, 2 * J, K),
        K,
        $(ot, z, u, nt),
        nt,
        $(rt, it, u, et),
        et,
        Yt,
        bt
      ), bt), M !== 0 && (l = ct(l, $($(4, At, u, z), z, M, K), K)), w !== 0 && (l = ct(l, $($(4, Et, -u, z), z, w, K), K));
    }
    if (p !== 0) {
      const rt = $(k, de, p, it);
      l = ct(l, ft(
        $(x, Oe, p, K),
        K,
        $(rt, it, 2 * H, et),
        et,
        at
      ), at);
      const ot = $(O, Vt, p, z);
      l = ct(l, _t(
        $(ot, z, 2 * H, K),
        K,
        $(ot, z, p, nt),
        nt,
        $(rt, it, p, et),
        et,
        Yt,
        bt
      ), bt);
    }
  }
  if (c !== 0 || M !== 0) {
    if (f !== 0 || w !== 0 || u !== 0 || p !== 0 ? (R = f * H, P = U * f, E = P - (P - f), T = f - E, P = U * H, C = P - (P - H), F = H - C, L = T * F - (R - E * C - T * C - E * F), V = Q * p, P = U * Q, E = P - (P - Q), T = Q - E, P = U * p, C = P - (P - p), F = p - C, q = T * F - (V - E * C - T * C - E * F), b = L + q, y = b - L, gt[0] = L - (b - y) + (q - y), N = R + b, y = N - R, D = R - (N - y) + (b - y), b = D + V, y = b - D, gt[1] = D - (b - y) + (V - y), j = N + b, y = j - N, gt[2] = N - (j - y) + (b - y), gt[3] = j, X = -W, Y = -w, R = u * X, P = U * u, E = P - (P - u), T = u - E, P = U * X, C = P - (P - X), F = X - C, L = T * F - (R - E * C - T * C - E * F), V = J * Y, P = U * J, E = P - (P - J), T = J - E, P = U * Y, C = P - (P - Y), F = Y - C, q = T * F - (V - E * C - T * C - E * F), b = L + q, y = b - L, wt[0] = L - (b - y) + (q - y), N = R + b, y = N - R, D = R - (N - y) + (b - y), b = D + V, y = b - D, wt[1] = D - (b - y) + (V - y), j = N + b, y = j - N, wt[2] = N - (j - y) + (b - y), wt[3] = j, S = ft(4, gt, 4, wt, pe), R = f * p, P = U * f, E = P - (P - f), T = f - E, P = U * p, C = P - (P - p), F = p - C, L = T * F - (R - E * C - T * C - E * F), V = u * w, P = U * u, E = P - (P - u), T = u - E, P = U * w, C = P - (P - w), F = w - C, q = T * F - (V - E * C - T * C - E * F), b = L - q, y = L - b, jt[0] = L - (b + y) + (y - q), N = R + b, y = N - R, D = R - (N - y) + (b - y), b = D - V, y = D - b, jt[1] = D - (b + y) + (y - V), j = N + b, y = j - N, jt[2] = N - (j - y) + (b - y), jt[3] = j, B = 4) : (pe[0] = 0, S = 1, jt[0] = 0, B = 1), c !== 0) {
      const rt = $(S, pe, c, it);
      l = ct(l, ft(
        $(m, Be, c, K),
        K,
        $(rt, it, 2 * G, et),
        et,
        at
      ), at);
      const ot = $(B, jt, c, z);
      l = ct(l, _t(
        $(ot, z, 2 * G, K),
        K,
        $(ot, z, c, nt),
        nt,
        $(rt, it, c, et),
        et,
        Yt,
        bt
      ), bt), w !== 0 && (l = ct(l, $($(4, kt, c, z), z, w, K), K)), p !== 0 && (l = ct(l, $($(4, At, -c, z), z, p, K), K));
    }
    if (M !== 0) {
      const rt = $(S, pe, M, it);
      l = ct(l, ft(
        $(_, Ne, M, K),
        K,
        $(rt, it, 2 * Z, et),
        et,
        at
      ), at);
      const ot = $(B, jt, M, z);
      l = ct(l, _t(
        $(ot, z, 2 * Z, K),
        K,
        $(ot, z, M, nt),
        nt,
        $(rt, it, M, et),
        et,
        Yt,
        bt
      ), bt);
    }
  }
  if (f !== 0 || w !== 0) {
    if (u !== 0 || p !== 0 || c !== 0 || M !== 0 ? (R = u * Z, P = U * u, E = P - (P - u), T = u - E, P = U * Z, C = P - (P - Z), F = Z - C, L = T * F - (R - E * C - T * C - E * F), V = J * M, P = U * J, E = P - (P - J), T = J - E, P = U * M, C = P - (P - M), F = M - C, q = T * F - (V - E * C - T * C - E * F), b = L + q, y = b - L, gt[0] = L - (b - y) + (q - y), N = R + b, y = N - R, D = R - (N - y) + (b - y), b = D + V, y = b - D, gt[1] = D - (b - y) + (V - y), j = N + b, y = j - N, gt[2] = N - (j - y) + (b - y), gt[3] = j, X = -H, Y = -p, R = c * X, P = U * c, E = P - (P - c), T = c - E, P = U * X, C = P - (P - X), F = X - C, L = T * F - (R - E * C - T * C - E * F), V = G * Y, P = U * G, E = P - (P - G), T = G - E, P = U * Y, C = P - (P - Y), F = Y - C, q = T * F - (V - E * C - T * C - E * F), b = L + q, y = b - L, wt[0] = L - (b - y) + (q - y), N = R + b, y = N - R, D = R - (N - y) + (b - y), b = D + V, y = b - D, wt[1] = D - (b - y) + (V - y), j = N + b, y = j - N, wt[2] = N - (j - y) + (b - y), wt[3] = j, g = ft(4, gt, 4, wt, ue), R = u * M, P = U * u, E = P - (P - u), T = u - E, P = U * M, C = P - (P - M), F = M - C, L = T * F - (R - E * C - T * C - E * F), V = c * p, P = U * c, E = P - (P - c), T = c - E, P = U * p, C = P - (P - p), F = p - C, q = T * F - (V - E * C - T * C - E * F), b = L - q, y = L - b, Lt[0] = L - (b + y) + (y - q), N = R + b, y = N - R, D = R - (N - y) + (b - y), b = D - V, y = D - b, Lt[1] = D - (b + y) + (y - V), j = N + b, y = j - N, Lt[2] = N - (j - y) + (b - y), Lt[3] = j, A = 4) : (ue[0] = 0, g = 1, Lt[0] = 0, A = 1), f !== 0) {
      const rt = $(g, ue, f, it);
      l = ct(l, ft(
        $(d, Te, f, K),
        K,
        $(rt, it, 2 * Q, et),
        et,
        at
      ), at);
      const ot = $(A, Lt, f, z);
      l = ct(l, _t(
        $(ot, z, 2 * Q, K),
        K,
        $(ot, z, f, nt),
        nt,
        $(rt, it, f, et),
        et,
        Yt,
        bt
      ), bt), p !== 0 && (l = ct(l, $($(4, Et, f, z), z, p, K), K)), M !== 0 && (l = ct(l, $($(4, kt, -f, z), z, M, K), K));
    }
    if (w !== 0) {
      const rt = $(g, ue, w, it);
      l = ct(l, ft(
        $(v, Xe, w, K),
        K,
        $(rt, it, 2 * W, et),
        et,
        at
      ), at);
      const ot = $(A, Lt, w, z);
      l = ct(l, _t(
        $(ot, z, 2 * W, K),
        K,
        $(ot, z, w, nt),
        nt,
        $(rt, it, w, et),
        et,
        Yt,
        bt
      ), bt);
    }
  }
  return Qt[l - 1];
}
function ui(e, t, n, i, o, r, s, a) {
  const h = e - s, l = n - s, u = o - s, c = t - a, f = i - a, p = r - a, M = l * p, w = u * f, I = h * h + c * c, x = u * c, m = h * p, _ = l * l + f * f, d = h * f, v = l * c, g = u * u + p * p, k = I * (M - w) + _ * (x - m) + g * (d - v), S = (Math.abs(M) + Math.abs(w)) * I + (Math.abs(x) + Math.abs(m)) * _ + (Math.abs(d) + Math.abs(v)) * g, A = ci * S;
  return k > A || -k > A ? k : fi(e, t, n, i, o, r, s, a, S);
}
function di(e, t) {
  var n, i, o = 0, r, s, a, h, l, u, c, f = e[0], p = e[1], M = t.length;
  for (n = 0; n < M; n++) {
    i = 0;
    var w = t[n], I = w.length - 1;
    if (u = w[0], u[0] !== w[I][0] && u[1] !== w[I][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (s = u[0] - f, a = u[1] - p, i; i < I; i++) {
      if (c = w[i + 1], h = c[0] - f, l = c[1] - p, a === 0 && l === 0) {
        if (h <= 0 && s >= 0 || s <= 0 && h >= 0)
          return 0;
      } else if (l >= 0 && a <= 0 || l <= 0 && a >= 0) {
        if (r = Pt(s, h, a, l, 0, 0), r === 0)
          return 0;
        (r > 0 && l > 0 && a <= 0 || r < 0 && l <= 0 && a > 0) && o++;
      }
      u = c, a = l, s = h;
    }
  }
  return o % 2 !== 0;
}
function De(e, t, n = {}) {
  if (!e)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const i = ni(e), o = ii(t), r = o.type, s = t.bbox;
  let a = o.coordinates;
  if (s && pi(i, s) === !1)
    return !1;
  r === "Polygon" && (a = [a]);
  for (var h = 0; h < a.length; ++h) {
    const l = di(i, a[h]);
    if (l === 0 && !n.ignoreBoundary) return !0;
    if (l) return !0;
  }
  return !1;
}
function pi(e, t) {
  return t[0] <= e[0] && t[1] <= e[1] && t[2] >= e[0] && t[3] >= e[1];
}
class Ge {
  constructor(t = [], n = mi) {
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
      const h = s + 1;
      if (h < this.length && i(n[h], a) < 0 && (s = h, a = n[h]), i(a, r) >= 0) break;
      n[t] = a, t = s;
    }
    n[t] = r;
  }
}
function mi(e, t) {
  return e < t ? -1 : e > t ? 1 : 0;
}
const gi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ge
}, Symbol.toStringTag, { value: "Module" })), Nt = 11102230246251565e-32, ut = 134217729, wi = (3 + 8 * Nt) * Nt;
function Fe(e, t, n, i, o) {
  let r, s, a, h, l = t[0], u = i[0], c = 0, f = 0;
  u > l == u > -l ? (r = l, l = t[++c]) : (r = u, u = i[++f]);
  let p = 0;
  if (c < e && f < n)
    for (u > l == u > -l ? (s = l + r, a = r - (s - l), l = t[++c]) : (s = u + r, a = r - (s - u), u = i[++f]), r = s, a !== 0 && (o[p++] = a); c < e && f < n; )
      u > l == u > -l ? (s = r + l, h = s - r, a = r - (s - h) + (l - h), l = t[++c]) : (s = r + u, h = s - r, a = r - (s - h) + (u - h), u = i[++f]), r = s, a !== 0 && (o[p++] = a);
  for (; c < e; )
    s = r + l, h = s - r, a = r - (s - h) + (l - h), l = t[++c], r = s, a !== 0 && (o[p++] = a);
  for (; f < n; )
    s = r + u, h = s - r, a = r - (s - h) + (u - h), u = i[++f], r = s, a !== 0 && (o[p++] = a);
  return (r !== 0 || p === 0) && (o[p++] = r), p;
}
function yi(e, t) {
  let n = t[0];
  for (let i = 1; i < e; i++) n += t[i];
  return n;
}
function he(e) {
  return new Float64Array(e);
}
const vi = (3 + 16 * Nt) * Nt, bi = (2 + 12 * Nt) * Nt, xi = (9 + 64 * Nt) * Nt * Nt, Gt = he(4), nn = he(8), rn = he(12), on = he(16), yt = he(4);
function _i(e, t, n, i, o, r, s) {
  let a, h, l, u, c, f, p, M, w, I, x, m, _, d, v, g, k, S;
  const A = e - o, O = n - o, B = t - r, X = i - r;
  d = A * X, f = ut * A, p = f - (f - A), M = A - p, f = ut * X, w = f - (f - X), I = X - w, v = M * I - (d - p * w - M * w - p * I), g = B * O, f = ut * B, p = f - (f - B), M = B - p, f = ut * O, w = f - (f - O), I = O - w, k = M * I - (g - p * w - M * w - p * I), x = v - k, c = v - x, Gt[0] = v - (x + c) + (c - k), m = d + x, c = m - d, _ = d - (m - c) + (x - c), x = _ - g, c = _ - x, Gt[1] = _ - (x + c) + (c - g), S = m + x, c = S - m, Gt[2] = m - (S - c) + (x - c), Gt[3] = S;
  let Y = yi(4, Gt), y = bi * s;
  if (Y >= y || -Y >= y || (c = e - A, a = e - (A + c) + (c - o), c = n - O, l = n - (O + c) + (c - o), c = t - B, h = t - (B + c) + (c - r), c = i - X, u = i - (X + c) + (c - r), a === 0 && h === 0 && l === 0 && u === 0) || (y = xi * s + wi * Math.abs(Y), Y += A * u + X * a - (B * l + O * h), Y >= y || -Y >= y)) return Y;
  d = a * X, f = ut * a, p = f - (f - a), M = a - p, f = ut * X, w = f - (f - X), I = X - w, v = M * I - (d - p * w - M * w - p * I), g = h * O, f = ut * h, p = f - (f - h), M = h - p, f = ut * O, w = f - (f - O), I = O - w, k = M * I - (g - p * w - M * w - p * I), x = v - k, c = v - x, yt[0] = v - (x + c) + (c - k), m = d + x, c = m - d, _ = d - (m - c) + (x - c), x = _ - g, c = _ - x, yt[1] = _ - (x + c) + (c - g), S = m + x, c = S - m, yt[2] = m - (S - c) + (x - c), yt[3] = S;
  const P = Fe(4, Gt, 4, yt, nn);
  d = A * u, f = ut * A, p = f - (f - A), M = A - p, f = ut * u, w = f - (f - u), I = u - w, v = M * I - (d - p * w - M * w - p * I), g = B * l, f = ut * B, p = f - (f - B), M = B - p, f = ut * l, w = f - (f - l), I = l - w, k = M * I - (g - p * w - M * w - p * I), x = v - k, c = v - x, yt[0] = v - (x + c) + (c - k), m = d + x, c = m - d, _ = d - (m - c) + (x - c), x = _ - g, c = _ - x, yt[1] = _ - (x + c) + (c - g), S = m + x, c = S - m, yt[2] = m - (S - c) + (x - c), yt[3] = S;
  const E = Fe(P, nn, 4, yt, rn);
  d = a * u, f = ut * a, p = f - (f - a), M = a - p, f = ut * u, w = f - (f - u), I = u - w, v = M * I - (d - p * w - M * w - p * I), g = h * l, f = ut * h, p = f - (f - h), M = h - p, f = ut * l, w = f - (f - l), I = l - w, k = M * I - (g - p * w - M * w - p * I), x = v - k, c = v - x, yt[0] = v - (x + c) + (c - k), m = d + x, c = m - d, _ = d - (m - c) + (x - c), x = _ - g, c = _ - x, yt[1] = _ - (x + c) + (c - g), S = m + x, c = S - m, yt[2] = m - (S - c) + (x - c), yt[3] = S;
  const T = Fe(E, rn, 4, yt, on);
  return on[T - 1];
}
function sn(e, t, n, i, o, r) {
  const s = (t - r) * (n - o), a = (e - o) * (i - r), h = s - a;
  if (s === 0 || a === 0 || s > 0 != a > 0) return h;
  const l = Math.abs(s + a);
  return Math.abs(h) >= vi * l ? h : -_i(e, t, n, i, o, r, l);
}
function Mi(e, t) {
  const n = new Ge([], Ln);
  return ki(e, n), Ei(n, t);
}
function Ln(e, t) {
  return e.p.x > t.p.x ? 1 : e.p.x < t.p.x || e.p.x === t.p.x && (e.featureId !== t.featureId || e.ringId !== t.ringId) && e.isLeftEndpoint && !t.isLeftEndpoint ? -1 : e.p.y !== t.p.y ? e.p.y > t.p.y ? 1 : -1 : 1;
}
function Si(e, t) {
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
      for (let h = 0; h < i[o][r].length - 1; h++) {
        a = i[o][r][h + 1];
        const l = new cn(s, me, ge, we), u = new cn(a, me, ge, we + 1);
        l.otherEvent = u, u.otherEvent = l, Ln(l, u) > 0 ? (u.isLeftEndpoint = !0, l.isLeftEndpoint = !1) : (l.isLeftEndpoint = !0, u.isLeftEndpoint = !1), t.push(l), t.push(u), s = a, we = we + 1;
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
function Ei(e, t = !1) {
  const n = [], i = new Ge([], Si);
  for (; e.length; ) {
    const o = e.pop();
    if (o.isLeftEndpoint) {
      const r = new Ai(o);
      for (let s = 0; s < i.data.length; s++) {
        const a = i.data[s];
        if (t && a.leftSweepEvent.featureId === o.featureId)
          continue;
        const h = Ii(r, a);
        h !== !1 && n.push(h);
      }
      i.push(r);
    } else o.isLeftEndpoint === !1 && i.pop();
  }
  return n;
}
var Ai = class {
  /** @param event must have otherEvent non-null */
  constructor(e) {
    this.leftSweepEvent = e, this.rightSweepEvent = e.otherEvent;
  }
};
function Ii(e, t) {
  if (e === null || t === null) return !1;
  const n = e.leftSweepEvent.p.x, i = e.leftSweepEvent.p.y, o = e.rightSweepEvent.p.x, r = e.rightSweepEvent.p.y, s = t.leftSweepEvent.p.x, a = t.leftSweepEvent.p.y, h = t.rightSweepEvent.p.x, l = t.rightSweepEvent.p.y, u = sn(n, i, o, r, s, a), c = sn(n, i, o, r, h, l);
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
  const f = (l - a) * (o - n) - (h - s) * (r - i), p = (h - s) * (i - a) - (l - a) * (n - s), M = (o - n) * (i - a) - (r - i) * (n - s);
  if (f === 0)
    return !1;
  const w = p / f, I = M / f;
  if (w >= 0 && w <= 1 && I >= 0 && I <= 1) {
    const x = n + w * (o - n), m = i + w * (r - i);
    return [x, m];
  }
  return !1;
}
function Pi(e, t, n = {}) {
  const { removeDuplicates: i = !0, ignoreSelfIntersections: o = !0 } = n;
  let r = [];
  e.type === "FeatureCollection" ? r = r.concat(e.features) : e.type === "Feature" ? r.push(e) : (e.type === "LineString" || e.type === "Polygon" || e.type === "MultiLineString" || e.type === "MultiPolygon") && r.push(oe(e)), t.type === "FeatureCollection" ? r = r.concat(t.features) : t.type === "Feature" ? r.push(t) : (t.type === "LineString" || t.type === "Polygon" || t.type === "MultiLineString" || t.type === "MultiPolygon") && r.push(oe(t));
  const s = Mi(
    St(r),
    o
  );
  let a = [];
  if (i) {
    const h = {};
    s.forEach((l) => {
      const u = l.join(",");
      h[u] || (h[u] = !0, a.push(l));
    });
  } else
    a = s;
  return St(a.map((h) => $t(h)));
}
function Oi(e) {
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
function Ni(e, t = {}) {
  let n = 0, i = 0, o = 0;
  return ze(
    e,
    function(r) {
      n += r[0], i += r[1], o++;
    },
    !0
  ), $t([n / o, i / o], t.properties);
}
var ye = { exports: {} }, Ee = { exports: {} }, Ti = Ee.exports, ln;
function Xi() {
  return ln || (ln = 1, (function(e, t) {
    (function(n, i) {
      e.exports = i();
    })(Ti, function() {
      function n(m, _, d, v, g) {
        (function k(S, A, O, B, X) {
          for (; B > O; ) {
            if (B - O > 600) {
              var Y = B - O + 1, y = A - O + 1, P = Math.log(Y), E = 0.5 * Math.exp(2 * P / 3), T = 0.5 * Math.sqrt(P * E * (Y - E) / Y) * (y - Y / 2 < 0 ? -1 : 1), C = Math.max(O, Math.floor(A - y * E / Y + T)), F = Math.min(B, Math.floor(A + (Y - y) * E / Y + T));
              k(S, A, C, F, X);
            }
            var b = S[A], N = O, D = B;
            for (i(S, O, A), X(S[B], b) > 0 && i(S, O, B); N < D; ) {
              for (i(S, N, D), N++, D--; X(S[N], b) < 0; ) N++;
              for (; X(S[D], b) > 0; ) D--;
            }
            X(S[O], b) === 0 ? i(S, O, D) : i(S, ++D, B), D <= A && (O = D + 1), A <= D && (B = D - 1);
          }
        })(m, _, d || 0, v || m.length - 1, g || o);
      }
      function i(m, _, d) {
        var v = m[_];
        m[_] = m[d], m[d] = v;
      }
      function o(m, _) {
        return m < _ ? -1 : m > _ ? 1 : 0;
      }
      var r = function(m) {
        m === void 0 && (m = 9), this._maxEntries = Math.max(4, m), this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries)), this.clear();
      };
      function s(m, _, d) {
        if (!d) return _.indexOf(m);
        for (var v = 0; v < _.length; v++) if (d(m, _[v])) return v;
        return -1;
      }
      function a(m, _) {
        h(m, 0, m.children.length, _, m);
      }
      function h(m, _, d, v, g) {
        g || (g = I(null)), g.minX = 1 / 0, g.minY = 1 / 0, g.maxX = -1 / 0, g.maxY = -1 / 0;
        for (var k = _; k < d; k++) {
          var S = m.children[k];
          l(g, m.leaf ? v(S) : S);
        }
        return g;
      }
      function l(m, _) {
        return m.minX = Math.min(m.minX, _.minX), m.minY = Math.min(m.minY, _.minY), m.maxX = Math.max(m.maxX, _.maxX), m.maxY = Math.max(m.maxY, _.maxY), m;
      }
      function u(m, _) {
        return m.minX - _.minX;
      }
      function c(m, _) {
        return m.minY - _.minY;
      }
      function f(m) {
        return (m.maxX - m.minX) * (m.maxY - m.minY);
      }
      function p(m) {
        return m.maxX - m.minX + (m.maxY - m.minY);
      }
      function M(m, _) {
        return m.minX <= _.minX && m.minY <= _.minY && _.maxX <= m.maxX && _.maxY <= m.maxY;
      }
      function w(m, _) {
        return _.minX <= m.maxX && _.minY <= m.maxY && _.maxX >= m.minX && _.maxY >= m.minY;
      }
      function I(m) {
        return { children: m, height: 1, leaf: !0, minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
      }
      function x(m, _, d, v, g) {
        for (var k = [_, d]; k.length; ) if (!((d = k.pop()) - (_ = k.pop()) <= v)) {
          var S = _ + Math.ceil((d - _) / v / 2) * v;
          n(m, S, _, d, g), k.push(_, S, S, d);
        }
      }
      return r.prototype.all = function() {
        return this._all(this.data, []);
      }, r.prototype.search = function(m) {
        var _ = this.data, d = [];
        if (!w(m, _)) return d;
        for (var v = this.toBBox, g = []; _; ) {
          for (var k = 0; k < _.children.length; k++) {
            var S = _.children[k], A = _.leaf ? v(S) : S;
            w(m, A) && (_.leaf ? d.push(S) : M(m, A) ? this._all(S, d) : g.push(S));
          }
          _ = g.pop();
        }
        return d;
      }, r.prototype.collides = function(m) {
        var _ = this.data;
        if (!w(m, _)) return !1;
        for (var d = []; _; ) {
          for (var v = 0; v < _.children.length; v++) {
            var g = _.children[v], k = _.leaf ? this.toBBox(g) : g;
            if (w(m, k)) {
              if (_.leaf || M(m, k)) return !0;
              d.push(g);
            }
          }
          _ = d.pop();
        }
        return !1;
      }, r.prototype.load = function(m) {
        if (!m || !m.length) return this;
        if (m.length < this._minEntries) {
          for (var _ = 0; _ < m.length; _++) this.insert(m[_]);
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
      }, r.prototype.insert = function(m) {
        return m && this._insert(m, this.data.height - 1), this;
      }, r.prototype.clear = function() {
        return this.data = I([]), this;
      }, r.prototype.remove = function(m, _) {
        if (!m) return this;
        for (var d, v, g, k = this.data, S = this.toBBox(m), A = [], O = []; k || A.length; ) {
          if (k || (k = A.pop(), v = A[A.length - 1], d = O.pop(), g = !0), k.leaf) {
            var B = s(m, k.children, _);
            if (B !== -1) return k.children.splice(B, 1), A.push(k), this._condense(A), this;
          }
          g || k.leaf || !M(k, S) ? v ? (d++, k = v.children[d], g = !1) : k = null : (A.push(k), O.push(d), d = 0, v = k, k = k.children[0]);
        }
        return this;
      }, r.prototype.toBBox = function(m) {
        return m;
      }, r.prototype.compareMinX = function(m, _) {
        return m.minX - _.minX;
      }, r.prototype.compareMinY = function(m, _) {
        return m.minY - _.minY;
      }, r.prototype.toJSON = function() {
        return this.data;
      }, r.prototype.fromJSON = function(m) {
        return this.data = m, this;
      }, r.prototype._all = function(m, _) {
        for (var d = []; m; ) m.leaf ? _.push.apply(_, m.children) : d.push.apply(d, m.children), m = d.pop();
        return _;
      }, r.prototype._build = function(m, _, d, v) {
        var g, k = d - _ + 1, S = this._maxEntries;
        if (k <= S) return a(g = I(m.slice(_, d + 1)), this.toBBox), g;
        v || (v = Math.ceil(Math.log(k) / Math.log(S)), S = Math.ceil(k / Math.pow(S, v - 1))), (g = I([])).leaf = !1, g.height = v;
        var A = Math.ceil(k / S), O = A * Math.ceil(Math.sqrt(S));
        x(m, _, d, O, this.compareMinX);
        for (var B = _; B <= d; B += O) {
          var X = Math.min(B + O - 1, d);
          x(m, B, X, A, this.compareMinY);
          for (var Y = B; Y <= X; Y += A) {
            var y = Math.min(Y + A - 1, X);
            g.children.push(this._build(m, Y, y, v - 1));
          }
        }
        return a(g, this.toBBox), g;
      }, r.prototype._chooseSubtree = function(m, _, d, v) {
        for (; v.push(_), !_.leaf && v.length - 1 !== d; ) {
          for (var g = 1 / 0, k = 1 / 0, S = void 0, A = 0; A < _.children.length; A++) {
            var O = _.children[A], B = f(O), X = (Y = m, y = O, (Math.max(y.maxX, Y.maxX) - Math.min(y.minX, Y.minX)) * (Math.max(y.maxY, Y.maxY) - Math.min(y.minY, Y.minY)) - B);
            X < k ? (k = X, g = B < g ? B : g, S = O) : X === k && B < g && (g = B, S = O);
          }
          _ = S || _.children[0];
        }
        var Y, y;
        return _;
      }, r.prototype._insert = function(m, _, d) {
        var v = d ? m : this.toBBox(m), g = [], k = this._chooseSubtree(v, this.data, _, g);
        for (k.children.push(m), l(k, v); _ >= 0 && g[_].children.length > this._maxEntries; ) this._split(g, _), _--;
        this._adjustParentBBoxes(v, g, _);
      }, r.prototype._split = function(m, _) {
        var d = m[_], v = d.children.length, g = this._minEntries;
        this._chooseSplitAxis(d, g, v);
        var k = this._chooseSplitIndex(d, g, v), S = I(d.children.splice(k, d.children.length - k));
        S.height = d.height, S.leaf = d.leaf, a(d, this.toBBox), a(S, this.toBBox), _ ? m[_ - 1].children.push(S) : this._splitRoot(d, S);
      }, r.prototype._splitRoot = function(m, _) {
        this.data = I([m, _]), this.data.height = m.height + 1, this.data.leaf = !1, a(this.data, this.toBBox);
      }, r.prototype._chooseSplitIndex = function(m, _, d) {
        for (var v, g, k, S, A, O, B, X = 1 / 0, Y = 1 / 0, y = _; y <= d - _; y++) {
          var P = h(m, 0, y, this.toBBox), E = h(m, y, d, this.toBBox), T = (g = P, k = E, S = void 0, A = void 0, O = void 0, B = void 0, S = Math.max(g.minX, k.minX), A = Math.max(g.minY, k.minY), O = Math.min(g.maxX, k.maxX), B = Math.min(g.maxY, k.maxY), Math.max(0, O - S) * Math.max(0, B - A)), C = f(P) + f(E);
          T < X ? (X = T, v = y, Y = C < Y ? C : Y) : T === X && C < Y && (Y = C, v = y);
        }
        return v || d - _;
      }, r.prototype._chooseSplitAxis = function(m, _, d) {
        var v = m.leaf ? this.compareMinX : u, g = m.leaf ? this.compareMinY : c;
        this._allDistMargin(m, _, d, v) < this._allDistMargin(m, _, d, g) && m.children.sort(v);
      }, r.prototype._allDistMargin = function(m, _, d, v) {
        m.children.sort(v);
        for (var g = this.toBBox, k = h(m, 0, _, g), S = h(m, d - _, d, g), A = p(k) + p(S), O = _; O < d - _; O++) {
          var B = m.children[O];
          l(k, m.leaf ? g(B) : B), A += p(k);
        }
        for (var X = d - _ - 1; X >= _; X--) {
          var Y = m.children[X];
          l(S, m.leaf ? g(Y) : Y), A += p(S);
        }
        return A;
      }, r.prototype._adjustParentBBoxes = function(m, _, d) {
        for (var v = d; v >= 0; v--) l(_[v], m);
      }, r.prototype._condense = function(m) {
        for (var _ = m.length - 1, d = void 0; _ >= 0; _--) m[_].children.length === 0 ? _ > 0 ? (d = m[_ - 1].children).splice(d.indexOf(m[_]), 1) : this.clear() : a(m[_], this.toBBox);
      }, r;
    });
  })(Ee)), Ee.exports;
}
const Ci = /* @__PURE__ */ Bi(gi);
var Zt = { exports: {} }, Ye, hn;
function Di() {
  return hn || (hn = 1, Ye = function(t, n, i, o) {
    var r = t[0], s = t[1], a = !1;
    i === void 0 && (i = 0), o === void 0 && (o = n.length);
    for (var h = (o - i) / 2, l = 0, u = h - 1; l < h; u = l++) {
      var c = n[i + l * 2 + 0], f = n[i + l * 2 + 1], p = n[i + u * 2 + 0], M = n[i + u * 2 + 1], w = f > s != M > s && r < (p - c) * (s - f) / (M - f) + c;
      w && (a = !a);
    }
    return a;
  }), Ye;
}
var Re, fn;
function Fi() {
  return fn || (fn = 1, Re = function(t, n, i, o) {
    var r = t[0], s = t[1], a = !1;
    i === void 0 && (i = 0), o === void 0 && (o = n.length);
    for (var h = o - i, l = 0, u = h - 1; l < h; u = l++) {
      var c = n[l + i][0], f = n[l + i][1], p = n[u + i][0], M = n[u + i][1], w = f > s != M > s && r < (p - c) * (s - f) / (M - f) + c;
      w && (a = !a);
    }
    return a;
  }), Re;
}
var un;
function Yi() {
  if (un) return Zt.exports;
  un = 1;
  var e = Di(), t = Fi();
  return Zt.exports = function(i, o, r, s) {
    return o.length > 0 && Array.isArray(o[0]) ? t(i, o, r, s) : e(i, o, r, s);
  }, Zt.exports.nested = t, Zt.exports.flat = e, Zt.exports;
}
var ee = { exports: {} }, Ri = ee.exports, dn;
function $i() {
  return dn || (dn = 1, (function(e, t) {
    (function(n, i) {
      i(t);
    })(Ri, function(n) {
      const o = 33306690738754706e-32;
      function r(w, I, x, m, _) {
        let d, v, g, k, S = I[0], A = m[0], O = 0, B = 0;
        A > S == A > -S ? (d = S, S = I[++O]) : (d = A, A = m[++B]);
        let X = 0;
        if (O < w && B < x) for (A > S == A > -S ? (g = d - ((v = S + d) - S), S = I[++O]) : (g = d - ((v = A + d) - A), A = m[++B]), d = v, g !== 0 && (_[X++] = g); O < w && B < x; ) A > S == A > -S ? (g = d - ((v = d + S) - (k = v - d)) + (S - k), S = I[++O]) : (g = d - ((v = d + A) - (k = v - d)) + (A - k), A = m[++B]), d = v, g !== 0 && (_[X++] = g);
        for (; O < w; ) g = d - ((v = d + S) - (k = v - d)) + (S - k), S = I[++O], d = v, g !== 0 && (_[X++] = g);
        for (; B < x; ) g = d - ((v = d + A) - (k = v - d)) + (A - k), A = m[++B], d = v, g !== 0 && (_[X++] = g);
        return d === 0 && X !== 0 || (_[X++] = d), X;
      }
      function s(w) {
        return new Float64Array(w);
      }
      const a = 33306690738754716e-32, h = 22204460492503146e-32, l = 11093356479670487e-47, u = s(4), c = s(8), f = s(12), p = s(16), M = s(4);
      n.orient2d = function(w, I, x, m, _, d) {
        const v = (I - d) * (x - _), g = (w - _) * (m - d), k = v - g;
        if (v === 0 || g === 0 || v > 0 != g > 0) return k;
        const S = Math.abs(v + g);
        return Math.abs(k) >= a * S ? k : -(function(A, O, B, X, Y, y, P) {
          let E, T, C, F, b, N, D, R, L, V, q, j, J, G, Q, H, Z, W;
          const st = A - Y, lt = B - Y, rt = O - y, ot = X - y;
          b = (Q = (R = st - (D = (N = 134217729 * st) - (N - st))) * (V = ot - (L = (N = 134217729 * ot) - (N - ot))) - ((G = st * ot) - D * L - R * L - D * V)) - (q = Q - (Z = (R = rt - (D = (N = 134217729 * rt) - (N - rt))) * (V = lt - (L = (N = 134217729 * lt) - (N - lt))) - ((H = rt * lt) - D * L - R * L - D * V))), u[0] = Q - (q + b) + (b - Z), b = (J = G - ((j = G + q) - (b = j - G)) + (q - b)) - (q = J - H), u[1] = J - (q + b) + (b - H), b = (W = j + q) - j, u[2] = j - (W - b) + (q - b), u[3] = W;
          let Xt = (function(ei, Ke) {
            let Qe = Ke[0];
            for (let Ie = 1; Ie < ei; Ie++) Qe += Ke[Ie];
            return Qe;
          })(4, u), Wt = h * P;
          if (Xt >= Wt || -Xt >= Wt || (E = A - (st + (b = A - st)) + (b - Y), C = B - (lt + (b = B - lt)) + (b - Y), T = O - (rt + (b = O - rt)) + (b - y), F = X - (ot + (b = X - ot)) + (b - y), E === 0 && T === 0 && C === 0 && F === 0) || (Wt = l * P + o * Math.abs(Xt), (Xt += st * F + ot * E - (rt * C + lt * T)) >= Wt || -Xt >= Wt)) return Xt;
          b = (Q = (R = E - (D = (N = 134217729 * E) - (N - E))) * (V = ot - (L = (N = 134217729 * ot) - (N - ot))) - ((G = E * ot) - D * L - R * L - D * V)) - (q = Q - (Z = (R = T - (D = (N = 134217729 * T) - (N - T))) * (V = lt - (L = (N = 134217729 * lt) - (N - lt))) - ((H = T * lt) - D * L - R * L - D * V))), M[0] = Q - (q + b) + (b - Z), b = (J = G - ((j = G + q) - (b = j - G)) + (q - b)) - (q = J - H), M[1] = J - (q + b) + (b - H), b = (W = j + q) - j, M[2] = j - (W - b) + (q - b), M[3] = W;
          const Wn = r(4, u, 4, M, c);
          b = (Q = (R = st - (D = (N = 134217729 * st) - (N - st))) * (V = F - (L = (N = 134217729 * F) - (N - F))) - ((G = st * F) - D * L - R * L - D * V)) - (q = Q - (Z = (R = rt - (D = (N = 134217729 * rt) - (N - rt))) * (V = C - (L = (N = 134217729 * C) - (N - C))) - ((H = rt * C) - D * L - R * L - D * V))), M[0] = Q - (q + b) + (b - Z), b = (J = G - ((j = G + q) - (b = j - G)) + (q - b)) - (q = J - H), M[1] = J - (q + b) + (b - H), b = (W = j + q) - j, M[2] = j - (W - b) + (q - b), M[3] = W;
          const Zn = r(Wn, c, 4, M, f);
          b = (Q = (R = E - (D = (N = 134217729 * E) - (N - E))) * (V = F - (L = (N = 134217729 * F) - (N - F))) - ((G = E * F) - D * L - R * L - D * V)) - (q = Q - (Z = (R = T - (D = (N = 134217729 * T) - (N - T))) * (V = C - (L = (N = 134217729 * C) - (N - C))) - ((H = T * C) - D * L - R * L - D * V))), M[0] = Q - (q + b) + (b - Z), b = (J = G - ((j = G + q) - (b = j - G)) + (q - b)) - (q = J - H), M[1] = J - (q + b) + (b - H), b = (W = j + q) - j, M[2] = j - (W - b) + (q - b), M[3] = W;
          const ti = r(Zn, f, 4, M, p);
          return p[ti - 1];
        })(w, I, x, m, _, d, S);
      }, n.orient2dfast = function(w, I, x, m, _, d) {
        return (I - d) * (x - _) - (w - _) * (m - d);
      }, Object.defineProperty(n, "__esModule", { value: !0 });
    });
  })(ee, ee.exports)), ee.exports;
}
var pn;
function Li() {
  if (pn) return ye.exports;
  pn = 1;
  var e = Xi(), t = Ci, n = Yi(), i = $i().orient2d;
  t.default && (t = t.default), ye.exports = o, ye.exports.default = o;
  function o(d, v, g) {
    v = Math.max(0, v === void 0 ? 2 : v), g = g || 0;
    var k = p(d), S = new e(16);
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
    for (var A = [], O = 0, B; O < k.length; O++) {
      var X = k[O];
      S.remove(X), B = M(X, B), A.push(B);
    }
    var Y = new e(16);
    for (O = 0; O < A.length; O++) Y.insert(f(A[O]));
    for (var y = v * v, P = g * g; A.length; ) {
      var E = A.shift(), T = E.p, C = E.next.p, F = w(T, C);
      if (!(F < P)) {
        var b = F / y;
        X = r(S, E.prev.p, T, C, E.next.next.p, b, Y), X && Math.min(w(X, T), w(X, C)) <= b && (A.push(E), A.push(M(X, E)), S.remove(X), Y.remove(E), Y.insert(f(E)), Y.insert(f(E.next)));
      }
    }
    E = B;
    var N = [];
    do
      N.push(E.p), E = E.next;
    while (E !== B);
    return N.push(E.p), N;
  }
  function r(d, v, g, k, S, A, O) {
    for (var B = new t([], s), X = d.data; X; ) {
      for (var Y = 0; Y < X.children.length; Y++) {
        var y = X.children[Y], P = X.leaf ? I(y, g, k) : a(g, k, y);
        P > A || B.push({
          node: y,
          dist: P
        });
      }
      for (; B.length && !B.peek().node.children; ) {
        var E = B.pop(), T = E.node, C = I(T, v, g), F = I(T, k, S);
        if (E.dist < C && E.dist < F && l(g, T, O) && l(k, T, O)) return T;
      }
      X = B.pop(), X && (X = X.node);
    }
    return null;
  }
  function s(d, v) {
    return d.dist - v.dist;
  }
  function a(d, v, g) {
    if (h(d, g) || h(v, g)) return 0;
    var k = x(d[0], d[1], v[0], v[1], g.minX, g.minY, g.maxX, g.minY);
    if (k === 0) return 0;
    var S = x(d[0], d[1], v[0], v[1], g.minX, g.minY, g.minX, g.maxY);
    if (S === 0) return 0;
    var A = x(d[0], d[1], v[0], v[1], g.maxX, g.minY, g.maxX, g.maxY);
    if (A === 0) return 0;
    var O = x(d[0], d[1], v[0], v[1], g.minX, g.maxY, g.maxX, g.maxY);
    return O === 0 ? 0 : Math.min(k, S, A, O);
  }
  function h(d, v) {
    return d[0] >= v.minX && d[0] <= v.maxX && d[1] >= v.minY && d[1] <= v.maxY;
  }
  function l(d, v, g) {
    for (var k = Math.min(d[0], v[0]), S = Math.min(d[1], v[1]), A = Math.max(d[0], v[0]), O = Math.max(d[1], v[1]), B = g.search({ minX: k, minY: S, maxX: A, maxY: O }), X = 0; X < B.length; X++)
      if (c(B[X].p, B[X].next.p, d, v)) return !1;
    return !0;
  }
  function u(d, v, g) {
    return i(d[0], d[1], v[0], v[1], g[0], g[1]);
  }
  function c(d, v, g, k) {
    return d !== k && v !== g && u(d, v, g) > 0 != u(d, v, k) > 0 && u(g, k, d) > 0 != u(g, k, v) > 0;
  }
  function f(d) {
    var v = d.p, g = d.next.p;
    return d.minX = Math.min(v[0], g[0]), d.minY = Math.min(v[1], g[1]), d.maxX = Math.max(v[0], g[0]), d.maxY = Math.max(v[1], g[1]), d;
  }
  function p(d) {
    for (var v = d[0], g = d[0], k = d[0], S = d[0], A = 0; A < d.length; A++) {
      var O = d[A];
      O[0] < v[0] && (v = O), O[0] > k[0] && (k = O), O[1] < g[1] && (g = O), O[1] > S[1] && (S = O);
    }
    var B = [v, g, k, S], X = B.slice();
    for (A = 0; A < d.length; A++)
      n(d[A], B) || X.push(d[A]);
    return _(X);
  }
  function M(d, v) {
    var g = {
      p: d,
      prev: null,
      next: null,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };
    return v ? (g.next = v.next, g.prev = v, v.next.prev = g, v.next = g) : (g.prev = g, g.next = g), g;
  }
  function w(d, v) {
    var g = d[0] - v[0], k = d[1] - v[1];
    return g * g + k * k;
  }
  function I(d, v, g) {
    var k = v[0], S = v[1], A = g[0] - k, O = g[1] - S;
    if (A !== 0 || O !== 0) {
      var B = ((d[0] - k) * A + (d[1] - S) * O) / (A * A + O * O);
      B > 1 ? (k = g[0], S = g[1]) : B > 0 && (k += A * B, S += O * B);
    }
    return A = d[0] - k, O = d[1] - S, A * A + O * O;
  }
  function x(d, v, g, k, S, A, O, B) {
    var X = g - d, Y = k - v, y = O - S, P = B - A, E = d - S, T = v - A, C = X * X + Y * Y, F = X * y + Y * P, b = y * y + P * P, N = X * E + Y * T, D = y * E + P * T, R = C * b - F * F, L, V, q, j, J = R, G = R;
    R === 0 ? (V = 0, J = 1, j = D, G = b) : (V = F * D - b * N, j = C * D - F * N, V < 0 ? (V = 0, j = D, G = b) : V > J && (V = J, j = D + F, G = b)), j < 0 ? (j = 0, -N < 0 ? V = 0 : -N > C ? V = J : (V = -N, J = C)) : j > G && (j = G, -N + F < 0 ? V = 0 : -N + F > C ? V = J : (V = -N + F, J = C)), L = V === 0 ? 0 : V / J, q = j === 0 ? 0 : j / G;
    var Q = (1 - L) * d + L * g, H = (1 - L) * v + L * k, Z = (1 - q) * S + q * O, W = (1 - q) * A + q * B, st = Z - Q, lt = W - H;
    return st * st + lt * lt;
  }
  function m(d, v) {
    return d[0] === v[0] ? d[1] - v[1] : d[0] - v[0];
  }
  function _(d) {
    d.sort(m);
    for (var v = [], g = 0; g < d.length; g++) {
      for (; v.length >= 2 && u(v[v.length - 2], v[v.length - 1], d[g]) <= 0; )
        v.pop();
      v.push(d[g]);
    }
    for (var k = [], S = d.length - 1; S >= 0; S--) {
      for (; k.length >= 2 && u(k[k.length - 2], k[k.length - 1], d[S]) <= 0; )
        k.pop();
      k.push(d[S]);
    }
    return k.pop(), v.pop(), v.concat(k);
  }
  return ye.exports;
}
var Vi = Li();
const ji = /* @__PURE__ */ Oi(Vi);
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
function Vn(e, t, n = {}) {
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
  return Vn({
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
  return Vn({
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
function qi(e) {
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
function Ui(e) {
  return e.type === "Feature" ? e.geometry : e;
}
const Tt = 11102230246251565e-32, dt = 134217729, zi = (3 + 8 * Tt) * Tt;
function $e(e, t, n, i, o) {
  let r, s, a, h, l = t[0], u = i[0], c = 0, f = 0;
  u > l == u > -l ? (r = l, l = t[++c]) : (r = u, u = i[++f]);
  let p = 0;
  if (c < e && f < n)
    for (u > l == u > -l ? (s = l + r, a = r - (s - l), l = t[++c]) : (s = u + r, a = r - (s - u), u = i[++f]), r = s, a !== 0 && (o[p++] = a); c < e && f < n; )
      u > l == u > -l ? (s = r + l, h = s - r, a = r - (s - h) + (l - h), l = t[++c]) : (s = r + u, h = s - r, a = r - (s - h) + (u - h), u = i[++f]), r = s, a !== 0 && (o[p++] = a);
  for (; c < e; )
    s = r + l, h = s - r, a = r - (s - h) + (l - h), l = t[++c], r = s, a !== 0 && (o[p++] = a);
  for (; f < n; )
    s = r + u, h = s - r, a = r - (s - h) + (u - h), u = i[++f], r = s, a !== 0 && (o[p++] = a);
  return (r !== 0 || p === 0) && (o[p++] = r), p;
}
function Gi(e, t) {
  let n = t[0];
  for (let i = 1; i < e; i++) n += t[i];
  return n;
}
function fe(e) {
  return new Float64Array(e);
}
const Ji = (3 + 16 * Tt) * Tt, Ki = (2 + 12 * Tt) * Tt, Qi = (9 + 64 * Tt) * Tt * Tt, Jt = fe(4), yn = fe(8), vn = fe(12), bn = fe(16), vt = fe(4);
function Hi(e, t, n, i, o, r, s) {
  let a, h, l, u, c, f, p, M, w, I, x, m, _, d, v, g, k, S;
  const A = e - o, O = n - o, B = t - r, X = i - r;
  d = A * X, f = dt * A, p = f - (f - A), M = A - p, f = dt * X, w = f - (f - X), I = X - w, v = M * I - (d - p * w - M * w - p * I), g = B * O, f = dt * B, p = f - (f - B), M = B - p, f = dt * O, w = f - (f - O), I = O - w, k = M * I - (g - p * w - M * w - p * I), x = v - k, c = v - x, Jt[0] = v - (x + c) + (c - k), m = d + x, c = m - d, _ = d - (m - c) + (x - c), x = _ - g, c = _ - x, Jt[1] = _ - (x + c) + (c - g), S = m + x, c = S - m, Jt[2] = m - (S - c) + (x - c), Jt[3] = S;
  let Y = Gi(4, Jt), y = Ki * s;
  if (Y >= y || -Y >= y || (c = e - A, a = e - (A + c) + (c - o), c = n - O, l = n - (O + c) + (c - o), c = t - B, h = t - (B + c) + (c - r), c = i - X, u = i - (X + c) + (c - r), a === 0 && h === 0 && l === 0 && u === 0) || (y = Qi * s + zi * Math.abs(Y), Y += A * u + X * a - (B * l + O * h), Y >= y || -Y >= y)) return Y;
  d = a * X, f = dt * a, p = f - (f - a), M = a - p, f = dt * X, w = f - (f - X), I = X - w, v = M * I - (d - p * w - M * w - p * I), g = h * O, f = dt * h, p = f - (f - h), M = h - p, f = dt * O, w = f - (f - O), I = O - w, k = M * I - (g - p * w - M * w - p * I), x = v - k, c = v - x, vt[0] = v - (x + c) + (c - k), m = d + x, c = m - d, _ = d - (m - c) + (x - c), x = _ - g, c = _ - x, vt[1] = _ - (x + c) + (c - g), S = m + x, c = S - m, vt[2] = m - (S - c) + (x - c), vt[3] = S;
  const P = $e(4, Jt, 4, vt, yn);
  d = A * u, f = dt * A, p = f - (f - A), M = A - p, f = dt * u, w = f - (f - u), I = u - w, v = M * I - (d - p * w - M * w - p * I), g = B * l, f = dt * B, p = f - (f - B), M = B - p, f = dt * l, w = f - (f - l), I = l - w, k = M * I - (g - p * w - M * w - p * I), x = v - k, c = v - x, vt[0] = v - (x + c) + (c - k), m = d + x, c = m - d, _ = d - (m - c) + (x - c), x = _ - g, c = _ - x, vt[1] = _ - (x + c) + (c - g), S = m + x, c = S - m, vt[2] = m - (S - c) + (x - c), vt[3] = S;
  const E = $e(P, yn, 4, vt, vn);
  d = a * u, f = dt * a, p = f - (f - a), M = a - p, f = dt * u, w = f - (f - u), I = u - w, v = M * I - (d - p * w - M * w - p * I), g = h * l, f = dt * h, p = f - (f - h), M = h - p, f = dt * l, w = f - (f - l), I = l - w, k = M * I - (g - p * w - M * w - p * I), x = v - k, c = v - x, vt[0] = v - (x + c) + (c - k), m = d + x, c = m - d, _ = d - (m - c) + (x - c), x = _ - g, c = _ - x, vt[1] = _ - (x + c) + (c - g), S = m + x, c = S - m, vt[2] = m - (S - c) + (x - c), vt[3] = S;
  const T = $e(E, vn, 4, vt, bn);
  return bn[T - 1];
}
function Wi(e, t, n, i, o, r) {
  const s = (t - r) * (n - o), a = (e - o) * (i - r), h = s - a, l = Math.abs(s + a);
  return Math.abs(h) >= Ji * l ? h : -Hi(e, t, n, i, o, r, l);
}
function Zi(e, t) {
  var n, i, o = 0, r, s, a, h, l, u, c, f = e[0], p = e[1], M = t.length;
  for (n = 0; n < M; n++) {
    i = 0;
    var w = t[n], I = w.length - 1;
    if (u = w[0], u[0] !== w[I][0] && u[1] !== w[I][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (s = u[0] - f, a = u[1] - p, i; i < I; i++) {
      if (c = w[i + 1], h = c[0] - f, l = c[1] - p, a === 0 && l === 0) {
        if (h <= 0 && s >= 0 || s <= 0 && h >= 0)
          return 0;
      } else if (l >= 0 && a <= 0 || l <= 0 && a >= 0) {
        if (r = Wi(s, h, a, l, 0, 0), r === 0)
          return 0;
        (r > 0 && l > 0 && a <= 0 || r < 0 && l <= 0 && a > 0) && o++;
      }
      u = c, a = l, s = h;
    }
  }
  return o % 2 !== 0;
}
function je(e, t, n = {}) {
  if (!e)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const i = qi(e), o = Ui(t), r = o.type, s = t.bbox;
  let a = o.coordinates;
  if (s && tr(i, s) === !1)
    return !1;
  r === "Polygon" && (a = [a]);
  for (var h = 0; h < a.length; ++h) {
    const l = Zi(i, a[h]);
    if (l === 0 && !n.ignoreBoundary || l) return !0;
  }
  return !1;
}
function tr(e, t) {
  return t[0] <= e[0] && t[1] <= e[1] && t[2] >= e[0] && t[3] >= e[1];
}
function Le(e, t) {
  for (let n = 0; n < t.features.length; n++)
    if (je(e, t.features[n]))
      return t.features[n];
}
function qn(e, t) {
  const n = t.geometry.coordinates[0][0], i = t.geometry.coordinates[0][1], o = t.geometry.coordinates[0][2], r = e.geometry.coordinates, s = t.properties.a.geom, a = t.properties.b.geom, h = t.properties.c.geom, l = [i[0] - n[0], i[1] - n[1]], u = [o[0] - n[0], o[1] - n[1]], c = [r[0] - n[0], r[1] - n[1]], f = [a[0] - s[0], a[1] - s[1]], p = [h[0] - s[0], h[1] - s[1]], M = (u[1] * c[0] - u[0] * c[1]) / (l[0] * u[1] - l[1] * u[0]), w = (l[0] * c[1] - l[1] * c[0]) / (l[0] * u[1] - l[1] * u[0]);
  return [
    M * f[0] + w * p[0] + s[0],
    M * f[1] + w * p[1] + s[1]
  ];
}
function er(e, t, n) {
  const i = e.geometry.coordinates, o = n.geometry.coordinates, r = Math.atan2(i[0] - o[0], i[1] - o[1]), s = nr(r, t[0]);
  if (s === void 0)
    throw new Error("Unable to determine vertex index");
  const a = t[1][s];
  return qn(e, a.features[0]);
}
function ne(e, t, n, i, o, r, s, a) {
  let h;
  if (s && (h = Le(e, Ht([s]))), !h)
    if (n) {
      const l = e.geometry.coordinates, u = n.gridNum, c = n.xOrigin, f = n.yOrigin, p = n.xUnit, M = n.yUnit, w = n.gridCache, I = It(l[0], c, p, u), x = It(l[1], f, M, u), m = w[I] ? w[I][x] ? w[I][x] : [] : [], _ = Ht(m.map((d) => t.features[d]));
      h = Le(e, _);
    } else
      h = Le(e, t);
  return a && a(h), h ? qn(e, h) : er(e, i, o);
}
function It(e, t, n, i) {
  let o = Math.floor((e - t) / n);
  return o < 0 && (o = 0), o >= i && (o = i - 1), o;
}
function nr(e, t) {
  let n = xn(e - t[0]), i = Math.PI * 2, o;
  for (let r = 0; r < t.length; r++) {
    const s = (r + 1) % t.length, a = xn(e - t[s]), h = Math.min(Math.abs(n), Math.abs(a));
    n * a <= 0 && h < i && (i = h, o = r), n = a;
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
function Un(e) {
  const t = ["a", "b", "c", "a"].map(
    (r) => e.properties[r].geom
  ), n = e.geometry.coordinates[0], i = e.properties, o = {
    a: { geom: n[0], index: i.a.index },
    b: { geom: n[1], index: i.b.index },
    c: { geom: n[2], index: i.c.index }
  };
  return jn([t], o);
}
function ir(e) {
  const t = [0, 1, 2, 0].map((i) => e[i][0][0]), n = {
    a: { geom: e[0][0][1], index: e[0][1] },
    b: { geom: e[1][0][1], index: e[1][1] },
    c: { geom: e[2][0][1], index: e[2][1] }
  };
  return jn([t], n);
}
function qe(e, t, n, i, o, r = !1, s) {
  const a = e.map(
    (h) => {
      (!s || s < 2.00703) && (h = rr(h));
      const l = isFinite(h) ? t[h] : h === "c" ? i : (function() {
        const u = h.match(/^b(\d+)$/);
        if (u) return o[parseInt(u[1])];
        const c = h.match(/^e(\d+)$/);
        if (c) return n[parseInt(c[1])];
        throw new Error("Bad index value for indexesToTri");
      })();
      return r ? [[l[1], l[0]], h] : [[l[0], l[1]], h];
    }
  );
  return ir(a);
}
function rr(e) {
  return typeof e == "number" ? e : e.replace(/^(c|e|b)(?:ent|dgeNode|box)(\d+)?$/, "$1$2");
}
function zn(e, t) {
  return t && t >= 2.00703 || Array.isArray(e[0]) ? e : e.map((n) => [
    n.illstNodes,
    n.mercNodes,
    n.startEnd
  ]);
}
const or = 2.00704;
function sr(e) {
  return !!(e.version !== void 0 || !e.tins && e.points && e.tins_points);
}
function ar(e) {
  return {
    points: e.points,
    strictStatus: lr(e),
    verticesParams: hr(e),
    centroid: fr(e),
    edges: zn(e.edges || []),
    edgeNodes: e.edgeNodes || [],
    tins: ur(e),
    kinks: dr(e.kinks_points),
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
  const t = pr(e), n = t.tins;
  return {
    compiled: t,
    tins: n,
    points: mr(n),
    strictStatus: t.strict_status,
    verticesParams: t.vertices_params,
    centroid: t.centroid,
    kinks: t.kinks
  };
}
function lr(e) {
  return e.strict_status ? e.strict_status : e.kinks_points ? "strict_error" : e.tins_points.length === 2 ? "loose" : "strict";
}
function hr(e) {
  const t = {
    forw: [e.vertices_params[0]],
    bakw: [e.vertices_params[1]]
  };
  return t.forw[1] = Mn(e, !1), t.bakw[1] = Mn(e, !0), t;
}
function Mn(e, t) {
  const n = e.vertices_points.length;
  return Array.from({ length: n }, (i, o) => {
    const r = (o + 1) % n, s = qe(
      ["c", `b${o}`, `b${r}`],
      e.points,
      e.edgeNodes || [],
      e.centroid_point,
      e.vertices_points,
      t,
      or
    );
    return Ht([s]);
  });
}
function fr(e) {
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
function ur(e) {
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
function dr(e) {
  if (e)
    return {
      bakw: Ht(
        e.map((t) => se(t))
      )
    };
}
function pr(e) {
  return JSON.parse(
    JSON.stringify(e).replace('"cent"', '"c"').replace(/"bbox(\d+)"/g, '"b$1"')
  );
}
function mr(e) {
  const t = [], n = e.forw.features;
  for (let i = 0; i < n.length; i++) {
    const o = n[i];
    ["a", "b", "c"].forEach((r, s) => {
      const a = o.geometry.coordinates[0][s], h = o.properties[r].geom, l = o.properties[r].index;
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
    if (sr(t)) {
      this.applyModernState(ar(t));
      return;
    }
    this.applyLegacyState(cr(t));
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
      let I = [];
      return wn(w)[0].map((x) => {
        r.length === 0 ? r = [Array.from(x), Array.from(x)] : (x[0] < r[0][0] && (r[0][0] = x[0]), x[0] > r[1][0] && (r[1][0] = x[0]), x[1] < r[0][1] && (r[0][1] = x[1]), x[1] > r[1][1] && (r[1][1] = x[1])), I.length === 0 ? I = [Array.from(x), Array.from(x)] : (x[0] < I[0][0] && (I[0][0] = x[0]), x[0] > I[1][0] && (I[1][0] = x[0]), x[1] < I[0][1] && (I[0][1] = x[1]), x[1] > I[1][1] && (I[1][1] = x[1]));
      }), I;
    }), h = (r[1][0] - r[0][0]) / o, l = (r[1][1] - r[0][1]) / o, u = a.reduce(
      (w, I, x) => {
        const m = It(I[0][0], r[0][0], h, o), _ = It(I[1][0], r[0][0], h, o), d = It(I[0][1], r[0][1], l, o), v = It(I[1][1], r[0][1], l, o);
        for (let g = m; g <= _; g++) {
          w[g] || (w[g] = []);
          for (let k = d; k <= v; k++)
            w[g][k] || (w[g][k] = []), w[g][k].push(x);
        }
        return w;
      },
      []
    ), c = i.features.map((w) => {
      let I = [];
      return wn(w)[0].map((x) => {
        s.length === 0 ? s = [Array.from(x), Array.from(x)] : (x[0] < s[0][0] && (s[0][0] = x[0]), x[0] > s[1][0] && (s[1][0] = x[0]), x[1] < s[0][1] && (s[0][1] = x[1]), x[1] > s[1][1] && (s[1][1] = x[1])), I.length === 0 ? I = [Array.from(x), Array.from(x)] : (x[0] < I[0][0] && (I[0][0] = x[0]), x[0] > I[1][0] && (I[1][0] = x[0]), x[1] < I[0][1] && (I[0][1] = x[1]), x[1] > I[1][1] && (I[1][1] = x[1]));
      }), I;
    }), f = (s[1][0] - s[0][0]) / o, p = (s[1][1] - s[0][1]) / o, M = c.reduce(
      (w, I, x) => {
        const m = It(I[0][0], s[0][0], f, o), _ = It(I[1][0], s[0][0], f, o), d = It(I[0][1], s[0][1], p, o), v = It(I[1][1], s[0][1], p, o);
        for (let g = m; g <= _; g++) {
          w[g] || (w[g] = []);
          for (let k = d; k <= v; k++)
            w[g][k] || (w[g][k] = []), w[g][k].push(x);
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
        yUnit: l,
        gridCache: u
      },
      bakw: {
        gridNum: o,
        xOrigin: s[0][0],
        yOrigin: s[0][1],
        xUnit: f,
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
    const o = se(t);
    if (this.bounds && !n && !i && !je(o, this.boundsPolygon))
      return !1;
    const r = n ? this.tins.bakw : this.tins.forw, s = n ? this.indexedTins.bakw : this.indexedTins.forw, a = n ? this.vertices_params.bakw : this.vertices_params.forw, h = n ? this.centroid.bakw : this.centroid.forw;
    let l, u;
    this.stateFull && (this.stateBackward == n ? l = this.stateTriangle : (this.stateBackward = n, this.stateTriangle = void 0), u = (f) => {
      this.stateTriangle = f;
    });
    let c = ne(
      o,
      r,
      s,
      a,
      h,
      void 0,
      l,
      u
    );
    if (this.bounds && n && !i) {
      const f = se(c);
      if (!je(f, this.boundsPolygon)) return !1;
    } else this.yaxisMode == Mt.YAXIS_FOLLOW && !n && (c = [c[0], -1 * c[1]]);
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
  static from(t, n = br, i = xr) {
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
    let a = 1 / 0, h = 1 / 0, l = -1 / 0, u = -1 / 0;
    for (let A = 0; A < s; A++) {
      const O = t[2 * A], B = t[2 * A + 1];
      O < a && (a = O), B < h && (h = B), O > l && (l = O), B > u && (u = B), this._ids[A] = A;
    }
    const c = (a + l) / 2, f = (h + u) / 2;
    let p = 0, M = 0, w = 0;
    for (let A = 0, O = 1 / 0; A < s; A++) {
      const B = Ve(c, f, t[2 * A], t[2 * A + 1]);
      B < O && (p = A, O = B);
    }
    const I = t[2 * p], x = t[2 * p + 1];
    for (let A = 0, O = 1 / 0; A < s; A++) {
      if (A === p) continue;
      const B = Ve(I, x, t[2 * A], t[2 * A + 1]);
      B < O && B > 0 && (M = A, O = B);
    }
    let m = t[2 * M], _ = t[2 * M + 1], d = 1 / 0;
    for (let A = 0; A < s; A++) {
      if (A === p || A === M) continue;
      const O = yr(I, x, m, _, t[2 * A], t[2 * A + 1]);
      O < d && (w = A, d = O);
    }
    let v = t[2 * w], g = t[2 * w + 1];
    if (d === 1 / 0) {
      for (let B = 0; B < s; B++)
        this._dists[B] = t[2 * B] - t[0] || t[2 * B + 1] - t[1];
      Kt(this._ids, this._dists, 0, s - 1);
      const A = new Uint32Array(s);
      let O = 0;
      for (let B = 0, X = -1 / 0; B < s; B++) {
        const Y = this._ids[B], y = this._dists[Y];
        y > X && (A[O++] = Y, X = y);
      }
      this.hull = A.subarray(0, O), this.triangles = new Uint32Array(0), this.halfedges = new Int32Array(0);
      return;
    }
    if (Pt(I, x, m, _, v, g) < 0) {
      const A = M, O = m, B = _;
      M = w, m = v, _ = g, w = A, v = O, g = B;
    }
    const k = vr(I, x, m, _, v, g);
    this._cx = k.x, this._cy = k.y;
    for (let A = 0; A < s; A++)
      this._dists[A] = Ve(t[2 * A], t[2 * A + 1], k.x, k.y);
    Kt(this._ids, this._dists, 0, s - 1), this._hullStart = p;
    let S = 3;
    i[p] = n[w] = M, i[M] = n[p] = w, i[w] = n[M] = p, o[p] = 0, o[M] = 1, o[w] = 2, r.fill(-1), r[this._hashKey(I, x)] = p, r[this._hashKey(m, _)] = M, r[this._hashKey(v, g)] = w, this.trianglesLen = 0, this._addTriangle(p, M, w, -1, -1, -1);
    for (let A = 0, O = 0, B = 0; A < this._ids.length; A++) {
      const X = this._ids[A], Y = t[2 * X], y = t[2 * X + 1];
      if (A > 0 && Math.abs(Y - O) <= Sn && Math.abs(y - B) <= Sn || (O = Y, B = y, X === p || X === M || X === w)) continue;
      let P = 0;
      for (let b = 0, N = this._hashKey(Y, y); b < this._hashSize && (P = r[(N + b) % this._hashSize], !(P !== -1 && P !== i[P])); b++)
        ;
      P = n[P];
      let E = P, T;
      for (; T = i[E], Pt(Y, y, t[2 * E], t[2 * E + 1], t[2 * T], t[2 * T + 1]) >= 0; )
        if (E = T, E === P) {
          E = -1;
          break;
        }
      if (E === -1) continue;
      let C = this._addTriangle(E, X, i[E], -1, -1, o[E]);
      o[X] = this._legalize(C + 2), o[E] = C, S++;
      let F = i[E];
      for (; T = i[F], Pt(Y, y, t[2 * F], t[2 * F + 1], t[2 * T], t[2 * T + 1]) < 0; )
        C = this._addTriangle(F, X, T, o[X], -1, o[F]), o[X] = this._legalize(C + 2), i[F] = F, S--, F = T;
      if (E === P)
        for (; T = n[E], Pt(Y, y, t[2 * T], t[2 * T + 1], t[2 * E], t[2 * E + 1]) < 0; )
          C = this._addTriangle(T, X, E, -1, o[E], o[T]), this._legalize(C + 2), o[T] = C, i[E] = E, S--, E = T;
      this._hullStart = n[X] = E, i[E] = n[F] = X, i[X] = F, r[this._hashKey(Y, y)] = X, r[this._hashKey(t[2 * E], t[2 * E + 1])] = E;
    }
    this.hull = new Uint32Array(S);
    for (let A = 0, O = this._hullStart; A < S; A++)
      this.hull[A] = O, O = i[O];
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
    return Math.floor(gr(t - this._cx, n - this._cy) * this._hashSize) % this._hashSize;
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
      const a = i[t], h = t - t % 3;
      if (s = h + (t + 2) % 3, a === -1) {
        if (r === 0) break;
        t = ve[--r];
        continue;
      }
      const l = a - a % 3, u = h + (t + 1) % 3, c = l + (a + 2) % 3, f = n[s], p = n[t], M = n[u], w = n[c];
      if (wr(
        o[2 * f],
        o[2 * f + 1],
        o[2 * p],
        o[2 * p + 1],
        o[2 * M],
        o[2 * M + 1],
        o[2 * w],
        o[2 * w + 1]
      )) {
        n[t] = w, n[a] = f;
        const x = i[c];
        if (x === -1) {
          let _ = this._hullStart;
          do {
            if (this._hullTri[_] === c) {
              this._hullTri[_] = t;
              break;
            }
            _ = this._hullPrev[_];
          } while (_ !== this._hullStart);
        }
        this._link(t, x), this._link(a, i[s]), this._link(s, c);
        const m = l + (a + 1) % 3;
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
function gr(e, t) {
  const n = e / (Math.abs(e) + Math.abs(t));
  return (t > 0 ? 3 - n : 1 + n) / 4;
}
function Ve(e, t, n, i) {
  const o = e - n, r = t - i;
  return o * o + r * r;
}
function wr(e, t, n, i, o, r, s, a) {
  const h = e - s, l = t - a, u = n - s, c = i - a, f = o - s, p = r - a, M = h * h + l * l, w = u * u + c * c, I = f * f + p * p;
  return h * (c * I - w * p) - l * (u * I - w * f) + M * (u * p - c * f) < 0;
}
function yr(e, t, n, i, o, r) {
  const s = n - e, a = i - t, h = o - e, l = r - t, u = s * s + a * a, c = h * h + l * l, f = 0.5 / (s * l - a * h), p = (l * u - a * c) * f, M = (s * c - h * u) * f;
  return p * p + M * M;
}
function vr(e, t, n, i, o, r) {
  const s = n - e, a = i - t, h = o - e, l = r - t, u = s * s + a * a, c = h * h + l * l, f = 0.5 / (s * l - a * h), p = e + (l * u - a * c) * f, M = t + (s * c - h * u) * f;
  return { x: p, y: M };
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
    const a = e[r], h = t[a];
    for (; ; ) {
      do
        r++;
      while (t[e[r]] < h);
      do
        s--;
      while (t[e[s]] > h);
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
function br(e) {
  return e[0];
}
function xr(e) {
  return e[1];
}
class _r {
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
class kn extends _r {
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
function En(e, t, n, i, o, r, s, a) {
  const h = Pt(e, t, o, r, s, a), l = Pt(n, i, o, r, s, a);
  if (h > 0 && l > 0 || h < 0 && l < 0)
    return !1;
  const u = Pt(o, r, e, t, n, i), c = Pt(s, a, e, t, n, i);
  return u > 0 && c > 0 || u < 0 && c < 0 ? !1 : h === 0 && l === 0 && u === 0 && c === 0 ? !(Math.max(o, s) < Math.min(e, n) || Math.max(e, n) < Math.min(o, s) || Math.max(r, a) < Math.min(t, i) || Math.max(t, i) < Math.min(r, a)) : !0;
}
class Mr {
  /**
   * The triangulation object from Delaunator.
   */
  del;
  constructor(t) {
    this.del = t;
  }
}
class Sr extends Mr {
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
    const { triangles: i, halfedges: o } = this.del, r = this.vertMap[t];
    let s = r;
    do {
      const l = i[s], u = qt(s);
      if (l === n)
        return this.protect(s);
      const c = Ot(s), f = i[c];
      if (f === n)
        return this.protect(u), u;
      if (this.intersectSegments(t, n, f, l)) {
        s = c;
        break;
      }
      s = o[u];
    } while (s !== -1 && s !== r);
    let a = s, h = -1;
    for (; s !== -1; ) {
      const l = o[s], u = Ot(s), c = Ot(l), f = qt(l);
      if (l === -1)
        throw new Error("Constraining edge exited the hull");
      if (this.consd.has(s))
        throw new Error("Edge intersects already constrained edge");
      if (this.isCollinear(t, n, i[s]) || this.isCollinear(t, n, i[l]))
        throw new Error("Constraining edge intersects point");
      if (!this.intersectSegments(
        i[s],
        i[l],
        i[u],
        i[c]
      )) {
        if (h === -1 && (h = s), i[c] === n) {
          if (s === h)
            throw new Error("Infinite loop: non-convex quadrilateral");
          s = h, h = -1;
          continue;
        }
        if (this.intersectSegments(
          t,
          n,
          i[c],
          i[l]
        ))
          s = c;
        else if (this.intersectSegments(
          t,
          n,
          i[f],
          i[c]
        ))
          s = f;
        else if (h === s)
          throw new Error("Infinite loop: no further intersect after non-convex");
        continue;
      }
      if (this.flipDiagonal(s), this.intersectSegments(
        t,
        n,
        i[u],
        i[c]
      ) && (h === -1 && (h = u), h === u))
        throw new Error("Infinite loop: flipped diagonal still intersects");
      i[c] === n ? (a = c, s = h, h = -1) : this.intersectSegments(
        t,
        n,
        i[f],
        i[c]
      ) && (s = f);
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
        const h = n[a];
        h !== -1 && (i.delete(h), this.isDelaunay(a) || (this.flipDiagonal(a), s++));
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
    const { triangles: n, halfedges: i } = this.del, o = this.flips, r = this.consd, s = i[t], a = Ot(t), h = qt(t), l = Ot(s), u = qt(s), c = i[a], f = i[l];
    if (r.has(t))
      throw new Error("Trying to flip a constrained edge");
    return n[t] = n[l], i[t] = f, o.set(t, o.has(l)) || r.set(t, r.has(l)), f !== -1 && (i[f] = t), i[a] = l, n[s] = n[a], i[s] = c, o.set(s, o.has(a)) || r.set(s, r.has(a)), c !== -1 && (i[c] = s), i[l] = a, this.markFlip(t), this.markFlip(h), this.markFlip(s), this.markFlip(u), o.add(a), r.delete(a), o.add(l), r.delete(l), this.updateVert(t), this.updateVert(h), this.updateVert(s), this.updateVert(u), a;
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
    return ui(
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
    const r = n[Ot(t)], s = n[t], a = n[qt(t)], h = n[Ot(o)];
    return !this.inCircle(r, s, a, h);
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
    return t === i || t === o || n === i || n === o ? !1 : En(
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
  static intersectSegments = En;
}
function be(e, t, n) {
  if (t || (t = []), typeof e != "object" || e.type !== "FeatureCollection")
    throw "Argument points must be FeatureCollection";
  if (!Array.isArray(t)) throw "Argument points must be Array of Array";
  const i = e.features.map(
    (h) => h.geometry.coordinates
  ), o = Je.from(i);
  let r;
  const s = [];
  o.triangles.length !== 0 && t.length !== 0 && (r = new Sr(o), r.constrainAll(t));
  for (let h = 0; h < o.triangles.length; h += 3)
    s.push([o.triangles[h], o.triangles[h + 1], o.triangles[h + 2]]);
  const a = ["a", "b", "c"];
  return St(
    s.map((h) => {
      const l = {}, u = h.map((c, f) => {
        const p = e.features[c], M = p.geometry.coordinates, w = [M[0], M[1]];
        return M.length === 3 ? w[2] = M[2] : l[a[f]] = p.properties[n], w;
      });
      return u[3] = u[0], le([u], l);
    })
  );
}
function kr(e, t) {
  const n = [[], [], [], []], i = [];
  return Object.keys(e).forEach((o) => {
    const r = e[o], s = r.forw, a = r.bakw, h = [
      s[0] - t.forw[0],
      s[1] - t.forw[1]
    ], l = [
      a[0] - t.bakw[0],
      t.bakw[1] - a[1]
    ], u = { forw: h, bakw: l };
    if (i.push(u), h[0] === 0 || h[1] === 0)
      return;
    let c = 0;
    h[0] > 0 && (c += 1), h[1] > 0 && (c += 2), n[c].push(u);
  }), { perQuad: n, aggregate: i };
}
function Er(e) {
  let t = 1 / 0, n = 0, i = 0;
  return e.forEach((o) => {
    const { forw: r, bakw: s } = o, a = Math.hypot(r[0], r[1]), h = Math.hypot(s[0], s[1]);
    if (h === 0) return;
    const l = a / h, u = Math.atan2(r[0], r[1]) - Math.atan2(s[0], s[1]);
    t = Math.min(t, l), n += Math.cos(u), i += Math.sin(u);
  }), isFinite(t) ? [t, Math.atan2(i, n)] : [1, 0];
}
function Ar(e, t, n) {
  const { perQuad: i, aggregate: o } = kr(e, t), r = i.every((h) => h.length > 0), a = (n === "birdeye" ? r ? i : [o] : [o]).map((h) => Er(h));
  return a.length === 1 ? [a[0], a[0], a[0], a[0]] : a;
}
function Ir(e, t) {
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
function Or(e, t, n, i) {
  const o = t[0] - e[0], r = t[1] - e[1];
  if (Math.abs(o) < 1e-12 && Math.abs(r) < 1e-12) return null;
  const s = i[0] - n[0], a = i[1] - n[1], h = n[0] - e[0], l = n[1] - e[1], u = o * a - r * s;
  if (Math.abs(u) < 1e-12) return null;
  const c = (h * a - l * s) / u, f = (h * r - l * o) / u;
  return c <= 1e-10 || f < -1e-10 || f > 1 + 1e-10 ? null : { t: c, point: [e[0] + c * o, e[1] + c * r] };
}
function Br(e, t, n) {
  const i = n.length;
  let o = -1 / 0, r = null;
  for (let s = 0; s < i; s++) {
    const a = (s + 1) % i, h = Or(
      e,
      t,
      n[s].bakw,
      n[a].bakw
    );
    h && h.t > o && (o = h.t, r = h.point);
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
  const h = [];
  if (s !== 0)
    for (const u of [n, i]) {
      const c = (u - e[0]) / s;
      if (c > 0) {
        const f = e[1] + c * a;
        f >= o && f <= r && h.push({ t: c, x: u, y: f });
      }
    }
  if (a !== 0)
    for (const u of [o, r]) {
      const c = (u - e[1]) / a;
      if (c > 0) {
        const f = e[0] + c * s;
        f >= n && f <= i && h.push({ t: c, x: f, y: u });
      }
    }
  if (h.length === 0) return null;
  h.sort((u, c) => u.t - c.t);
  const l = h[0];
  return [l.x, l.y];
}
function Pn(e, t, n) {
  const i = e.length, o = new Array(i).fill(1);
  for (const r of t)
    for (let s = 0; s < i; s++) {
      const a = (s + 1) % i, h = He([e[s].bakw, e[a].bakw]), l = He([n.bakw, r.bakw]), u = Pi(h, l);
      if (u.features.length > 0 && u.features[0].geometry) {
        const c = u.features[0], f = Math.sqrt(
          Math.pow(r.bakw[0] - n.bakw[0], 2) + Math.pow(r.bakw[1] - n.bakw[1], 2)
        ), p = Math.sqrt(
          Math.pow(c.geometry.coordinates[0] - n.bakw[0], 2) + Math.pow(c.geometry.coordinates[1] - n.bakw[1], 2)
        ), M = f / p;
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
function Gn(e, t, n) {
  const { convexBuf: i, centroid: o, allGcps: r, minx: s, maxx: a, miny: h, maxy: l } = e, u = Ar(i, o, t), f = [
    [s, h],
    [a, h],
    [a, l],
    [s, l]
  ].map((g) => ({
    forw: g,
    bakw: Pr(
      g,
      o,
      u[Ir(g, o.forw)]
    )
  }));
  if (f.sort(
    (g, k) => Math.atan2(g.forw[0] - o.forw[0], g.forw[1] - o.forw[1]) - Math.atan2(k.forw[0] - o.forw[0], k.forw[1] - o.forw[1])
  ), Pn(f, r, o), !n) return f;
  const p = 4, M = f.map(
    (g) => Math.atan2(g.forw[0] - o.forw[0], g.forw[1] - o.forw[1])
  ), w = f.map(
    (g) => Math.atan2(
      g.bakw[0] - o.bakw[0],
      -(g.bakw[1] - o.bakw[1])
    )
  );
  function I(g) {
    for (let k = 0; k < p; k++) {
      const S = (k + 1) % p, A = M[k], O = k < p - 1 ? M[S] : M[S] + 2 * Math.PI;
      let B = g;
      for (; B < A; ) B += 2 * Math.PI;
      for (; B >= A + 2 * Math.PI; ) B -= 2 * Math.PI;
      if (B >= A && B < O)
        return { i: k, j: S, frac: (B - A) / (O - A) };
    }
    return { i: 0, j: 1, frac: 0 };
  }
  function x(g) {
    const { i: k, j: S, frac: A } = I(g), O = w[k];
    let X = w[S] - O;
    for (; X > Math.PI; ) X -= 2 * Math.PI;
    for (; X < -Math.PI; ) X += 2 * Math.PI;
    return O + A * X;
  }
  const m = new Set(
    f.map(
      (g) => Math.floor(An(g.forw, o.forw) / 10) % 36
    )
  ), _ = r.map((g) => ({
    forw: g.forw,
    bakw: g.bakw,
    angleDeg: An(g.forw, o.forw),
    forwDist: Math.hypot(g.forw[0] - o.forw[0], g.forw[1] - o.forw[1])
  })), d = [];
  for (let g = 0; g < 36; g++) {
    if (m.has(g)) continue;
    const k = g * 10, S = _.filter(
      (P) => P.angleDeg >= k && P.angleDeg < k + 10
    );
    let A = null;
    if (S.length > 0) {
      const P = S.reduce((E, T) => T.forwDist > E.forwDist ? T : E);
      A = In(o.forw, P.forw, s, a, h, l);
    }
    if (!A) {
      const P = (k + 5) % 360 * (Math.PI / 180), E = [
        o.forw[0] + Math.sin(P),
        o.forw[1] + Math.cos(P)
      ];
      A = In(o.forw, E, s, a, h, l);
    }
    if (!A) continue;
    const O = [A[0] - o.forw[0], A[1] - o.forw[1]], B = Math.atan2(O[0], O[1]), X = x(B), Y = [
      o.bakw[0] + Math.sin(X),
      o.bakw[1] - Math.cos(X)
    ], y = Br(o.bakw, Y, f);
    y && d.push({ forw: A, bakw: y });
  }
  const v = [...f, ...d];
  return v.sort(
    (g, k) => Math.atan2(g.forw[0] - o.forw[0], g.forw[1] - o.forw[1]) - Math.atan2(k.forw[0] - o.forw[0], k.forw[1] - o.forw[1])
  ), Pn(v, r, o), v;
}
function Nr(e, t = !1) {
  return Gn(e, "plain", t);
}
function Tr(e, t = !1) {
  return Gn(e, "birdeye", t);
}
function Xr(e) {
  Cr(e);
  const n = new Dr(e).findSegmentIntersections(), i = Qn(n), o = /* @__PURE__ */ new Map();
  return i.forEach((r) => {
    o.set(`${r.x}:${r.y}`, r);
  }), Array.from(o.values()).map(
    (r) => $t([r.x, r.y])
  );
}
function Cr(e) {
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
    (r != this._xx.length || this._xx.length != this._yy.length) && Ut("ArcCollection#initXYData() Counting error"), this.initBounds(), this._arcIter = new no(this._xx, this._yy);
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
    let a = 0, h, l, u;
    for (let c = 0; c < o; c++)
      h = i[c], h > 0 && (l = c * 4, u = io(t, n, a, h), r[l++] = u[0], r[l++] = u[1], r[l++] = u[2], r[l] = u[3], a += h, s.mergeBounds(u));
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
    let h = i ? this._ii[o] : this._ii[o] + s - 1, l = h, u = 0;
    for (let c = 1; c < s; c++)
      l += a, (r === 0 || this._zz[l] >= r) && (n(h, l, this._xx, this._yy), h = l, u++);
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
    const t = this.getBounds(), n = t.ymin || 0, i = (t.ymax || 0) - n, o = this.calcSegmentIntersectionStripeCount(), r = new Uint32Array(o), s = o > 1 ? (I) => Math.floor((o - 1) * (I - n) / i) : () => 0, a = o + 1;
    let h, l;
    this.forEachSegment(
      (I, x, m, _) => {
        let d = s(_[I]);
        const v = s(_[x]);
        let g = 0;
        for (; r[d] = r[d] + 2, d != v; )
          g++, g > a && Ut(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${o}`,
            `s1=${d}`,
            `s2=${v}`
          ), d += v > d ? 1 : -1;
      }
    );
    const u = this.getUint32Array(Rr(r));
    let c = 0;
    const f = [];
    $r(r, (I) => {
      const x = c;
      c += I, f.push(u.subarray(x, c));
    }), Lr(r, 0), this.forEachSegment(
      (I, x, m, _) => {
        let d = s(_[I]);
        const v = s(_[x]);
        let g, k, S = 0;
        for (; g = r[d], r[d] = g + 2, k = f[d], k[g] = I, k[g + 1] = x, d != v; )
          S++, S > a && Ut(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${o}`,
            `s1=${d}`,
            `s2=${v}`
          ), d += v > d ? 1 : -1;
      }
    );
    const p = this.getVertexData(), M = [];
    let w;
    for (h = 0; h < o; h++)
      if (p.xx && p.yy)
        for (w = Vr(f[h], p.xx, p.yy), l = 0; l < w.length; l++)
          M.push(w[l]);
    return Qn(M);
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
function $r(e, t, n) {
  if (!ae(e))
    throw new Error(`#forEach() takes an array-like argument. ${e}`);
  for (let i = 0, o = e.length; i < o; i++)
    t.call(n, e[i], i);
}
function Lr(e, t) {
  for (let n = 0, i = e.length; n < i; n++)
    e[n] = t;
  return e;
}
function Vr(e, t, n) {
  const i = e.length - 2, o = [];
  let r, s, a, h, l, u, c, f, p, M, w, I, x, m, _, d, v;
  for (Wr(t, e), d = 0; d < i; ) {
    for (r = e[d], s = e[d + 1], l = t[r], u = t[s], p = n[r], M = n[s], v = d; v < i && (v += 2, a = e[v], c = t[a], !(u < c)); ) {
      if (w = n[a], h = e[v + 1], f = t[h], I = n[h], p >= w) {
        if (p > I && M > w && M > I) continue;
      } else if (p < I && M < w && M < I) continue;
      r == a || r == h || s == a || s == h || (x = jr(
        l,
        p,
        u,
        M,
        c,
        w,
        f,
        I
      ), x && (m = [r, s], _ = [a, h], o.push(Bn(x, m, _, t, n)), x.length == 4 && o.push(
        Bn(x.slice(2), m, _, t, n)
      )));
    }
    d += 2;
  }
  return o;
}
function jr(e, t, n, i, o, r, s, a) {
  const h = qr(e, t, n, i, o, r, s, a);
  let l = null;
  return h && (l = Ur(e, t, n, i, o, r, s, a), l ? Hr(e, t, n, i, o, r, s, a) && (l = null) : l = Qr(e, t, n, i, o, r, s, a)), l;
}
function qr(e, t, n, i, o, r, s, a) {
  return ie(e, t, n, i, o, r) * ie(e, t, n, i, s, a) <= 0 && ie(o, r, s, a, e, t) * ie(o, r, s, a, n, i) <= 0;
}
function ie(e, t, n, i, o, r) {
  return Jn(e - o, t - r, n - o, i - r);
}
function Jn(e, t, n, i) {
  return e * i - t * n;
}
function Ur(e, t, n, i, o, r, s, a) {
  let h = xe(e, t, n, i, o, r, s, a), l;
  return h && (l = Gr(h[0], h[1], e, t, n, i, o, r, s, a), l == 1 ? h = xe(n, i, e, t, o, r, s, a) : l == 2 ? h = xe(o, r, s, a, e, t, n, i) : l == 3 && (h = xe(s, a, o, r, e, t, n, i))), h && Kr(h, e, t, n, i, o, r, s, a), h;
}
function xe(e, t, n, i, o, r, s, a) {
  const h = Jn(n - e, i - t, s - o, a - r), l = 1e-18;
  let u;
  if (h === 0) return null;
  const c = ie(o, r, s, a, e, t) / h;
  return h <= l && h >= -l ? u = zr(e, t, n, i, o, r, s, a) : u = [e + c * (n - e), t + c * (i - t)], u;
}
function zr(e, t, n, i, o, r, s, a) {
  let h = null;
  return !Bt(e, o, s) && !Bt(t, r, a) ? h = [e, t] : !Bt(n, o, s) && !Bt(i, r, a) ? h = [n, i] : !Bt(o, e, n) && !Bt(r, t, i) ? h = [o, r] : !Bt(s, e, n) && !Bt(a, t, i) && (h = [s, a]), h;
}
function Bt(e, t, n) {
  let i;
  return t < n ? i = e < t || e > n : t > n ? i = e > t || e < n : i = e != t, i;
}
function Gr(e, t, ...n) {
  let i = -1, o = 1 / 0, r;
  for (let s = 0, a = 0, h = n.length; a < h; s++, a += 2)
    r = Jr(e, t, n[a], n[a + 1]), r < o && (o = r, i = s);
  return i;
}
function Jr(e, t, n, i) {
  const o = e - n, r = t - i;
  return o * o + r * r;
}
function Kr(e, t, n, i, o, r, s, a, h) {
  let l = e[0], u = e[1];
  l = _e(l, t, i), l = _e(l, r, a), u = _e(u, n, o), u = _e(u, s, h), e[0] = l, e[1] = u;
}
function _e(e, t, n) {
  let i;
  return Bt(e, t, n) && (i = Math.abs(e - t) < Math.abs(e - n) ? t : n, e = i), e;
}
function Qr(e, t, n, i, o, r, s, a) {
  const h = Math.min(e, n, o, s), l = Math.max(e, n, o, s), u = Math.min(t, i, r, a), c = Math.max(t, i, r, a), f = c - u > l - h;
  let p = [];
  return (f ? Rt(t, u, c) : Rt(e, h, l)) && p.push(e, t), (f ? Rt(i, u, c) : Rt(n, h, l)) && p.push(n, i), (f ? Rt(r, u, c) : Rt(o, h, l)) && p.push(o, r), (f ? Rt(a, u, c) : Rt(s, h, l)) && p.push(s, a), (p.length != 2 && p.length != 4 || p.length == 4 && p[0] == p[2] && p[1] == p[3]) && (p = null), p;
}
function Hr(e, t, n, i, o, r, s, a) {
  return e == o && t == r || e == s && t == a || n == o && i == r || n == s && i == a;
}
function Rt(e, t, n) {
  return e > t && e < n;
}
function Wr(e, t) {
  Zr(e, t), Kn(e, t, 0, t.length - 2);
}
function Zr(e, t) {
  for (let n = 0, i = t.length; n < i; n += 2)
    e[t[n]] > e[t[n + 1]] && to(t, n, n + 1);
}
function to(e, t, n) {
  const i = e[t];
  e[t] = e[n], e[n] = i;
}
function Kn(e, t, n, i) {
  let o = n, r = i, s, a;
  for (; o < i; ) {
    for (s = e[t[n + i >> 2 << 1]]; o <= r; ) {
      for (; e[t[o]] < s; ) o += 2;
      for (; e[t[r]] > s; ) r -= 2;
      o <= r && (a = t[o], t[o] = t[r], t[r] = a, a = t[o + 1], t[o + 1] = t[r + 1], t[r + 1] = a, o += 2, r -= 2);
    }
    if (r - n < 40 ? On(e, t, n, r) : Kn(e, t, n, r), i - o < 40) {
      On(e, t, o, i);
      return;
    }
    n = o, r = i;
  }
}
function On(e, t, n, i) {
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
  t = Nn(r, s, t[0], t[1], i, o), n = Nn(r, s, n[0], n[1], i, o);
  const a = t[0] < n[0] ? t : n, h = a == t ? n : t;
  return { x: r, y: s, a, b: h };
}
function Nn(e, t, n, i, o, r) {
  let s = n < i ? n : i, a = s === n ? i : n;
  return o[s] == e && r[s] == t ? a = s : o[a] == e && r[a] == t && (s = a), [s, a];
}
function Qn(e) {
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
  let s, a, h, l, u, c;
  if (r > 0)
    h = u = e[o], l = c = t[o];
  else return [void 0, void 0, void 0, void 0];
  for (o++; o < r; o++)
    s = e[o], a = t[o], s < h && (h = s), s > u && (u = s), a < l && (l = a), a > c && (c = a);
  return [h, l, u, c];
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
    let r, s, a, h;
    if (arguments.length == 1)
      if (ae(t)) {
        const l = t;
        r = l[0], s = l[1], a = l[2], h = l[3];
      } else {
        const l = t;
        r = l.xmin, s = l.ymin, a = l.xmax, h = l.ymax;
      }
    else
      r = t, s = n, a = i, h = o;
    return this.xmin = r, this.ymin = s, this.xmax = a, this.ymax = h, (r > a || s > h) && this.update(), this;
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
function Hn(e, t, n) {
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
function Tn(e, t, n) {
  const i = Ae(t.forw), o = Ae(t.bakw);
  if (JSON.stringify(i) != JSON.stringify(o))
    throw `${JSON.stringify(t, null, 2)}
${JSON.stringify(i)}
${JSON.stringify(o)}`;
  if (i.forEach((r) => {
    const s = e[r];
    if (!s) return;
    const a = s.filter((h) => h !== t);
    a.length === 0 ? delete e[r] : e[r] = a;
  }), n) {
    const r = (s, a) => {
      !s || !a || (s.features = s.features.filter((h) => h !== a));
    };
    r(n.forw, t.forw), r(n.bakw, t.bakw);
  }
}
function Me(e, t, n) {
  return $t(e, { target: { geom: t, index: n } });
}
function Se(e) {
  return $t(e.properties.target.geom, {
    target: {
      geom: e.geometry.coordinates,
      index: e.properties.target.index
    }
  });
}
function Xn(e, t) {
  const n = e.length, i = t.geometry.coordinates;
  return Array.from({ length: n }, (o, r) => r).map((o) => {
    const r = (o + 1) % n, s = e[o], a = e[r], h = s.geometry.coordinates, l = Math.atan2(
      h[0] - i[0],
      h[1] - i[1]
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
      le([u], c)
    ]);
    return [l, f];
  }).reduce(
    (o, r) => (o[0].push(r[0]), o[1].push(r[1]), o),
    [[], []]
  );
}
function ke(e, t = 1e-6) {
  const [n, i] = e[0], [o, r] = e[1], [s, a] = e[2];
  return Math.abs((o - n) * (a - i) - (s - n) * (r - i)) < t;
}
function ro(e, t) {
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
const oo = 10;
function so(e, t, n, i, o, r) {
  if (!e && !t) return !1;
  const s = e ? 0 : 1, a = 1 - s, h = n[s], l = n[a];
  if (!h || !l) return !1;
  const u = xt(l.geom);
  let c = !1, f = !1;
  for (let p = 0; p <= 1; p++) {
    const M = i[p];
    if (!M) continue;
    const w = [String(M.prop.index), String(h.prop.index)].sort().join("-"), I = o[w];
    if (!I || I.length < 2) continue;
    const x = I.find(
      (B) => B.bakw !== r[s].bakw
    );
    if (!x) continue;
    const _ = re(x.bakw).find(
      (B) => String(B.prop.index) !== String(M.prop.index) && String(B.prop.index) !== String(h.prop.index)
    );
    if (!_) continue;
    c = !0;
    const d = xt(_.geom), v = xt(M.geom), g = xt(h.geom), k = g[0] - v[0], S = g[1] - v[1], A = k * (u[1] - v[1]) - S * (u[0] - v[0]), O = k * (d[1] - v[1]) - S * (d[0] - v[0]);
    if (A * O > 0) {
      f = !0;
      break;
    }
  }
  return c && !f;
}
function ao(e, t, n, i) {
  if (!e && !t) return !1;
  if (n[0] && n[1] && i[0] && i[1]) {
    const o = i.map((u) => xt(u.geom)), r = n.map((u) => xt(u.geom)), s = o[1][0] - o[0][0], a = o[1][1] - o[0][1], h = s * (r[0][1] - o[0][1]) - a * (r[0][0] - o[0][0]), l = s * (r[1][1] - o[0][1]) - a * (r[1][0] - o[0][0]);
    return h * l < 0;
  }
  return !1;
}
function co(e, t, n, i) {
  const o = ro(n, i), r = /* @__PURE__ */ new Set();
  let s = !1;
  for (let a = 0; a < oo; a++) {
    let h = !1;
    for (const l of Object.keys(t)) {
      if (r.has(l)) continue;
      r.add(l);
      const u = t[l];
      if (!u || u.length < 2) continue;
      const c = l.split("-");
      if (c.length !== 2 || o.has(l)) continue;
      const f = re(u[0].bakw), p = re(u[1].bakw), M = re(u[0].forw), w = re(u[1].forw), I = c.map(
        (b) => f.find((N) => `${N.prop.index}` === b) || p.find((N) => `${N.prop.index}` === b)
      ), x = c.map(
        (b) => M.find((N) => `${N.prop.index}` === b) || w.find((N) => `${N.prop.index}` === b)
      );
      if (I.some((b) => !b) || x.some((b) => !b))
        continue;
      const m = [f, p].map(
        (b) => b.find((N) => !c.includes(`${N.prop.index}`))
      ), _ = [M, w].map(
        (b) => b.find((N) => !c.includes(`${N.prop.index}`))
      );
      if (m.some((b) => !b) || _.some((b) => !b))
        continue;
      const d = u[0].bakw.geometry.coordinates[0].slice(0, 3).map((b) => xt(b)), v = u[1].bakw.geometry.coordinates[0].slice(0, 3).map((b) => xt(b)), g = u[0].forw.geometry.coordinates[0].slice(0, 3).map((b) => xt(b)), k = u[1].forw.geometry.coordinates[0].slice(0, 3).map((b) => xt(b)), S = ke(d), A = ke(v), O = ke(g), B = ke(k), X = so(
        S,
        A,
        m,
        I,
        t,
        u
      ), Y = ao(
        O,
        B,
        m,
        I
      );
      if (!(X || Y || Cn(
        xt(m[0].geom),
        v
      ) || Cn(
        xt(m[1].geom),
        d
      )))
        continue;
      const P = x.map(
        (b) => xt(b.geom)
      ), E = _.map(
        (b) => xt(b.geom)
      ), T = lo([
        ...P,
        ...E
      ]), C = ho(T), F = Dn(
        P[0],
        P[1],
        E[0]
      ) + Dn(
        P[0],
        P[1],
        E[1]
      );
      Ue(C, F) && (Tn(t, u[0], e), Tn(t, u[1], e), I.forEach((b) => {
        if (!b) return;
        const N = [
          b.geom,
          m[0].geom,
          m[1].geom,
          b.geom
        ], D = {
          a: b.prop,
          b: m[0].prop,
          c: m[1].prop
        }, R = le([N], D), L = Un(R);
        Hn(t, {
          forw: L,
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
  const [n, i] = t[0], [o, r] = t[1], [s, a] = t[2], h = s - n, l = a - i, u = o - n, c = r - i, f = e[0] - n, p = e[1] - i, M = h * h + l * l, w = h * u + l * c, I = h * f + l * p, x = u * u + c * c, m = u * f + c * p, _ = M * x - w * w;
  if (_ === 0) return !1;
  const d = 1 / _, v = (x * I - w * m) * d, g = (M * m - w * I) * d, k = 1e-9;
  return v >= -k && g >= -k && v + g <= 1 + k;
}
function lo(e) {
  const t = e.map((s) => s.slice()).filter(
    (s, a, h) => h.findIndex(
      (l) => Ue(l[0], s[0]) && Ue(l[1], s[1])
    ) === a
  );
  if (t.length <= 1) return t;
  const n = t.sort(
    (s, a) => s[0] === a[0] ? s[1] - a[1] : s[0] - a[0]
  ), i = (s, a, h) => (a[0] - s[0]) * (h[1] - s[1]) - (a[1] - s[1]) * (h[0] - s[0]), o = [];
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
function Dn(e, t, n) {
  return Math.abs(
    (e[0] * (t[1] - n[1]) + t[0] * (n[1] - e[1]) + n[0] * (e[1] - t[1])) / 2
  );
}
function Ue(e, t, n = 1e-9) {
  return Math.abs(e - t) <= n;
}
const Fn = 2.00704, Yn = 3.00001;
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
    return this.useV2Algorithm ? Fn : Yn;
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
    let n = t[0][0], i = n, o = t[0][1], r = o;
    const s = [t[0]];
    for (let a = 1; a < t.length; a++) {
      const h = t[a];
      h[0] < n && (n = h[0]), h[0] > i && (i = h[0]), h[1] < o && (o = h[1]), h[1] > r && (r = h[1]), s.push(h);
    }
    s.push(t[0]), this.boundsPolygon = le([s]), this.xy = [n, o], this.wh = [i - n, r - o], this.vertexMode = ht.VERTEX_PLAIN, this.tins = void 0, this.indexedTins = void 0;
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
      (r) => Un(r)
    );
    this.tins.bakw = St(t);
    const n = {};
    this.tins.forw.features.forEach((r, s) => {
      const a = this.tins.bakw.features[s];
      Hn(n, { forw: r, bakw: a });
    });
    const i = (this.pointsSet?.forw.features ?? []).map(
      (r) => r.properties.target.index
    );
    co(
      this.tins,
      n,
      this.pointsSet?.edges || [],
      i
    );
    const o = ["forw", "bakw"].map((r) => {
      const s = this.tins[r].features.map(
        (a) => a.geometry.coordinates[0]
      );
      return Xr(s);
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
      const r = this.points[o][0], s = this.points[o][1], a = Me(r, s, o);
      t.forw.push(a), t.bakw.push(Se(a));
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
      const h = [s, a].map((l) => {
        const u = l.map((f, p, M) => {
          if (p === 0) return 0;
          const w = M[p - 1];
          return Math.sqrt(
            Math.pow(f[0] - w[0], 2) + Math.pow(f[1] - w[1], 2)
          );
        }), c = u.reduce((f, p, M) => M === 0 ? [0] : (f.push(f[M - 1] + p), f), []);
        return c.map((f, p, M) => {
          const w = f / M[M.length - 1];
          return [l[p], u[p], c[p], w];
        });
      });
      h.map((l, u) => {
        const c = h[u ? 0 : 1];
        return l.filter((f, p) => !(p === 0 || p === l.length - 1 || f[4] === "handled")).flatMap((f) => {
          const p = f[0], M = f[3], w = c.reduce(
            (I, x, m, _) => {
              if (I) return I;
              const d = _[m + 1];
              if (x[3] === M)
                return x[4] = "handled", [x];
              if (x[3] < M && d && d[3] > M)
                return [x, d];
            },
            void 0
          );
          if (w && w.length === 1)
            return u === 0 ? [[p, w[0][0], M]] : [[w[0][0], p, M]];
          if (w && w.length === 2) {
            const I = w[0], x = w[1], m = (M - I[3]) / (x[3] - I[3]), _ = [
              (x[0][0] - I[0][0]) * m + I[0][0],
              (x[0][1] - I[0][1]) * m + I[0][1]
            ];
            return u === 0 ? [[p, _, M]] : [[_, p, M]];
          }
          return [];
        });
      }).reduce((l, u) => l.concat(u), []).sort((l, u) => l[2] < u[2] ? -1 : 1).map((l, u, c) => {
        this.edgeNodes[i] = [
          l[0],
          l[1]
        ];
        const f = Me(
          l[0],
          l[1],
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
    if (!this.points.reduce((h, l) => h && (r ? De(l[0], r) : l[0][0] >= t && l[0][0] <= n && l[0][1] >= i && l[0][1] <= o), !0))
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
      const h = a[0][0], l = a[0][1];
      h < t && (t = h), h > n && (n = h), l < i && (i = l), l > o && (o = l);
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
    t !== ht.MODE_STRICT && t !== ht.MODE_LOOSE && (t = ht.MODE_AUTO);
    const n = !this.useV2Algorithm;
    let i, o, r, s, a;
    if (n) {
      if (this.bounds) {
        const S = this.boundsPolygon;
        if (!S) throw new Error("Internal error: bounds is set but boundsPolygon is missing");
        if (!this.points.every(
          (O) => De(O[0], S)
        )) throw "SOME POINTS OUTSIDE";
      }
      i = this.generatePointsSet(), { minx: o, maxx: r, miny: s, maxy: a } = this.computeGcpBbox();
    } else {
      const S = this.validateAndPrepareInputs();
      i = S.pointsSet, o = S.minx, r = S.maxx, s = S.miny, a = S.maxy;
    }
    const h = {
      forw: St(i.forw),
      bakw: St(i.bakw)
    }, l = be(
      h.forw,
      i.edges,
      "target"
    ), u = be(
      h.bakw,
      i.edges,
      "target"
    );
    if (l.features.length === 0 || u.features.length === 0)
      throw "TOO LINEAR1";
    const c = Ni(h.forw), f = mn(h.forw);
    if (!f) throw "TOO LINEAR2";
    const p = {}, M = f.geometry.coordinates[0];
    let w;
    try {
      w = M.map((S) => ({
        forw: S,
        bakw: ne($t(S), l)
      })), w.forEach((S) => {
        p[`${S.forw[0]}:${S.forw[1]}`] = S;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const I = mn(h.bakw);
    if (!I) throw "TOO LINEAR2";
    const x = I.geometry.coordinates[0];
    try {
      w = x.map((S) => ({
        bakw: S,
        forw: ne($t(S), u)
      })), w.forEach((S) => {
        p[`${S.forw[0]}:${S.forw[1]}`] = S;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    let m;
    if (n) {
      const S = c.geometry.coordinates, A = l.features.find(
        (O) => De(
          $t(S),
          O
        )
      );
      if (A) {
        const O = A.geometry.coordinates[0], B = A.properties.a.geom, X = A.properties.b.geom, Y = A.properties.c.geom;
        m = {
          forw: [
            (O[0][0] + O[1][0] + O[2][0]) / 3,
            (O[0][1] + O[1][1] + O[2][1]) / 3
          ],
          bakw: [
            (B[0] + X[0] + Y[0]) / 3,
            (B[1] + X[1] + Y[1]) / 3
          ]
        };
      } else
        m = {
          forw: S,
          bakw: ne(c, l)
        };
    } else
      m = {
        forw: c.geometry.coordinates,
        bakw: ne(c, l)
      };
    const _ = Me(m.forw, m.bakw, "c");
    this.centroid = {
      forw: _,
      bakw: Se(_)
    };
    const d = [
      ...this.points.map((S) => ({ forw: S[0], bakw: S[1] })),
      ...(this.edgeNodes ?? []).map((S) => ({ forw: S[0], bakw: S[1] }))
    ], v = {
      convexBuf: p,
      centroid: m,
      allGcps: d,
      minx: o,
      maxx: r,
      miny: s,
      maxy: a
    }, g = this.vertexMode === ht.VERTEX_BIRDEYE ? Tr(v, n) : Nr(v, n), k = {
      forw: [],
      bakw: []
    };
    for (let S = 0; S < g.length; S++) {
      const A = g[S].forw, O = g[S].bakw, B = Me(A, O, `b${S}`), X = Se(B);
      i.forw.push(B), i.bakw.push(X), k.forw.push(B), k.bakw.push(X);
    }
    this.pointsSet = {
      forw: St(i.forw),
      bakw: St(i.bakw),
      edges: i.edges
    }, this.tins = {
      forw: _n(
        be(
          this.pointsSet.forw,
          i.edges,
          "target"
        )
      )
    }, (t === ht.MODE_STRICT || t === ht.MODE_AUTO) && this.calculateStrictTin(), (t === ht.MODE_LOOSE || t === ht.MODE_AUTO && this.strict_status === ht.STATUS_ERROR) && (this.tins.bakw = _n(
      be(
        this.pointsSet.bakw,
        i.edges,
        "target"
      )
    ), delete this.kinks, this.strict_status = ht.STATUS_LOOSE), this.vertices_params = {
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
export {
  ht as Tin,
  be as constrainedTin,
  Se as counterPoint,
  Me as createPoint,
  ht as default,
  Xr as findIntersections,
  Fn as format_version,
  Hn as insertSearchIndex,
  Xn as vertexCalc
};
