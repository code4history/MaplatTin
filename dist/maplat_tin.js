import { counterTri as Tn, Transform as jn, validateWorldFile as Un, normalizeEdges as zn, transformArr as Me, rotateVerticesTriangle as qe, worldFileToCrs as Hn } from "@maplat/transform";
function te(i, t, e = {}) {
  const n = { type: "Feature" };
  return (e.id === 0 || e.id) && (n.id = e.id), e.bbox && (n.bbox = e.bbox), n.properties = t || {}, n.geometry = i, n;
}
function Yt(i, t, e = {}) {
  if (!i)
    throw new Error("coordinates is required");
  if (!Array.isArray(i))
    throw new Error("coordinates must be an Array");
  if (i.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!je(i[0]) || !je(i[1]))
    throw new Error("coordinates must contain numbers");
  return te({
    type: "Point",
    coordinates: i
  }, t, e);
}
function re(i, t, e = {}) {
  for (const s of i) {
    if (s.length < 4)
      throw new Error(
        "Each LinearRing of a Polygon must have 4 or more Positions."
      );
    if (s[s.length - 1].length !== s[0].length)
      throw new Error("First and last Position are not equivalent.");
    for (let o = 0; o < s[s.length - 1].length; o++)
      if (s[s.length - 1][o] !== s[0][o])
        throw new Error("First and last Position are not equivalent.");
  }
  return te({
    type: "Polygon",
    coordinates: i
  }, t, e);
}
function Ve(i, t, e = {}) {
  if (i.length < 2)
    throw new Error("coordinates must be an array of two or more positions");
  return te({
    type: "LineString",
    coordinates: i
  }, t, e);
}
function xt(i, t = {}) {
  const e = { type: "FeatureCollection" };
  return t.id && (e.id = t.id), t.bbox && (e.bbox = t.bbox), e.features = i, e;
}
function je(i) {
  return !isNaN(i) && i !== null && !Array.isArray(i);
}
function Gn(i) {
  if (!i)
    throw new Error("coord is required");
  if (!Array.isArray(i)) {
    if (i.type === "Feature" && i.geometry !== null && i.geometry.type === "Point")
      return [...i.geometry.coordinates];
    if (i.type === "Point")
      return [...i.coordinates];
  }
  if (Array.isArray(i) && i.length >= 2 && !Array.isArray(i[0]) && !Array.isArray(i[1]))
    return [...i];
  throw new Error("coord must be GeoJSON Point or an Array of numbers");
}
function Kn(i) {
  return i.type === "Feature" ? i.geometry : i;
}
function Pe(i, t, e) {
  if (i !== null)
    for (var n, s, o, r, a, c, l, h = 0, f = 0, u, b = i.type, y = b === "FeatureCollection", d = b === "Feature", _ = y ? i.features.length : 1, B = 0; B < _; B++) {
      l = y ? (
        // @ts-expect-error: Known type conflict
        i.features[B].geometry
      ) : d ? (
        // @ts-expect-error: Known type conflict
        i.geometry
      ) : i, u = l ? l.type === "GeometryCollection" : !1, a = u ? l.geometries.length : 1;
      for (var m = 0; m < a; m++) {
        var g = 0, p = 0;
        if (r = u ? l.geometries[m] : l, r !== null) {
          c = r.coordinates;
          var v = r.type;
          switch (h = e && (v === "Polygon" || v === "MultiPolygon") ? 1 : 0, v) {
            case null:
              break;
            case "Point":
              if (
                // @ts-expect-error: Known type conflict
                t(
                  c,
                  f,
                  B,
                  g,
                  p
                ) === !1
              )
                return !1;
              f++, g++;
              break;
            case "LineString":
            case "MultiPoint":
              for (n = 0; n < c.length; n++) {
                if (
                  // @ts-expect-error: Known type conflict
                  t(
                    c[n],
                    f,
                    B,
                    g,
                    p
                  ) === !1
                )
                  return !1;
                f++, v === "MultiPoint" && g++;
              }
              v === "LineString" && g++;
              break;
            case "Polygon":
            case "MultiLineString":
              for (n = 0; n < c.length; n++) {
                for (s = 0; s < c[n].length - h; s++) {
                  if (
                    // @ts-expect-error: Known type conflict
                    t(
                      c[n][s],
                      f,
                      B,
                      g,
                      p
                    ) === !1
                  )
                    return !1;
                  f++;
                }
                v === "MultiLineString" && g++, v === "Polygon" && p++;
              }
              v === "Polygon" && g++;
              break;
            case "MultiPolygon":
              for (n = 0; n < c.length; n++) {
                for (p = 0, s = 0; s < c[n].length; s++) {
                  for (o = 0; o < c[n][s].length - h; o++) {
                    if (
                      // @ts-expect-error: Known type conflict
                      t(
                        c[n][s][o],
                        f,
                        B,
                        g,
                        p
                      ) === !1
                    )
                      return !1;
                    f++;
                  }
                  p++;
                }
                g++;
              }
              break;
            case "GeometryCollection":
              for (n = 0; n < r.geometries.length; n++)
                if (
                  // @ts-expect-error: Known type conflict
                  Pe(r.geometries[n], t, e) === !1
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
const pt = 11102230246251565e-32, U = 134217729, On = (3 + 8 * pt) * pt;
function ht(i, t, e, n, s) {
  let o, r, a, c, l = t[0], h = n[0], f = 0, u = 0;
  h > l == h > -l ? (o = l, l = t[++f]) : (o = h, h = n[++u]);
  let b = 0;
  if (f < i && u < e)
    for (h > l == h > -l ? (r = l + o, a = o - (r - l), l = t[++f]) : (r = h + o, a = o - (r - h), h = n[++u]), o = r, a !== 0 && (s[b++] = a); f < i && u < e; )
      h > l == h > -l ? (r = o + l, c = r - o, a = o - (r - c) + (l - c), l = t[++f]) : (r = o + h, c = r - o, a = o - (r - c) + (h - c), h = n[++u]), o = r, a !== 0 && (s[b++] = a);
  for (; f < i; )
    r = o + l, c = r - o, a = o - (r - c) + (l - c), l = t[++f], o = r, a !== 0 && (s[b++] = a);
  for (; u < e; )
    r = o + h, c = r - o, a = o - (r - c) + (h - c), h = n[++u], o = r, a !== 0 && (s[b++] = a);
  return (o !== 0 || b === 0) && (s[b++] = o), b;
}
function _t(i, t, e, n, s, o, r, a) {
  return ht(ht(i, t, e, n, r), r, s, o, a);
}
function L(i, t, e, n) {
  let s, o, r, a, c, l, h, f, u, b, y;
  h = U * e, b = h - (h - e), y = e - b;
  let d = t[0];
  s = d * e, h = U * d, f = h - (h - d), u = d - f, r = u * y - (s - f * b - u * b - f * y);
  let _ = 0;
  r !== 0 && (n[_++] = r);
  for (let B = 1; B < i; B++)
    d = t[B], a = d * e, h = U * d, f = h - (h - d), u = d - f, c = u * y - (a - f * b - u * b - f * y), o = s + c, l = o - s, r = s - (o - l) + (c - l), r !== 0 && (n[_++] = r), s = a + o, r = o - (s - a), r !== 0 && (n[_++] = r);
  return (s !== 0 || _ === 0) && (n[_++] = s), _;
}
function Fn(i, t) {
  let e = t[0];
  for (let n = 1; n < i; n++) e += t[n];
  return e;
}
function tt(i) {
  return new Float64Array(i);
}
const Wn = (3 + 16 * pt) * pt, Jn = (2 + 12 * pt) * pt, Qn = (9 + 64 * pt) * pt * pt, Lt = tt(4), Ue = tt(8), ze = tt(12), He = tt(16), mt = tt(4);
function Zn(i, t, e, n, s, o, r) {
  let a, c, l, h, f, u, b, y, d, _, B, m, g, p, v, M, E, S;
  const k = i - s, T = e - s, O = t - o, D = n - o;
  p = k * D, u = U * k, b = u - (u - k), y = k - b, u = U * D, d = u - (u - D), _ = D - d, v = y * _ - (p - b * d - y * d - b * _), M = O * T, u = U * O, b = u - (u - O), y = O - b, u = U * T, d = u - (u - T), _ = T - d, E = y * _ - (M - b * d - y * d - b * _), B = v - E, f = v - B, Lt[0] = v - (B + f) + (f - E), m = p + B, f = m - p, g = p - (m - f) + (B - f), B = g - M, f = g - B, Lt[1] = g - (B + f) + (f - M), S = m + B, f = S - m, Lt[2] = m - (S - f) + (B - f), Lt[3] = S;
  let R = Fn(4, Lt), w = Jn * r;
  if (R >= w || -R >= w || (f = i - k, a = i - (k + f) + (f - s), f = e - T, l = e - (T + f) + (f - s), f = t - O, c = t - (O + f) + (f - o), f = n - D, h = n - (D + f) + (f - o), a === 0 && c === 0 && l === 0 && h === 0) || (w = Qn * r + On * Math.abs(R), R += k * h + D * a - (O * l + T * c), R >= w || -R >= w)) return R;
  p = a * D, u = U * a, b = u - (u - a), y = a - b, u = U * D, d = u - (u - D), _ = D - d, v = y * _ - (p - b * d - y * d - b * _), M = c * T, u = U * c, b = u - (u - c), y = c - b, u = U * T, d = u - (u - T), _ = T - d, E = y * _ - (M - b * d - y * d - b * _), B = v - E, f = v - B, mt[0] = v - (B + f) + (f - E), m = p + B, f = m - p, g = p - (m - f) + (B - f), B = g - M, f = g - B, mt[1] = g - (B + f) + (f - M), S = m + B, f = S - m, mt[2] = m - (S - f) + (B - f), mt[3] = S;
  const I = ht(4, Lt, 4, mt, Ue);
  p = k * h, u = U * k, b = u - (u - k), y = k - b, u = U * h, d = u - (u - h), _ = h - d, v = y * _ - (p - b * d - y * d - b * _), M = O * l, u = U * O, b = u - (u - O), y = O - b, u = U * l, d = u - (u - l), _ = l - d, E = y * _ - (M - b * d - y * d - b * _), B = v - E, f = v - B, mt[0] = v - (B + f) + (f - E), m = p + B, f = m - p, g = p - (m - f) + (B - f), B = g - M, f = g - B, mt[1] = g - (B + f) + (f - M), S = m + B, f = S - m, mt[2] = m - (S - f) + (B - f), mt[3] = S;
  const A = ht(I, Ue, 4, mt, ze);
  p = a * h, u = U * a, b = u - (u - a), y = a - b, u = U * h, d = u - (u - h), _ = h - d, v = y * _ - (p - b * d - y * d - b * _), M = c * l, u = U * c, b = u - (u - c), y = c - b, u = U * l, d = u - (u - l), _ = l - d, E = y * _ - (M - b * d - y * d - b * _), B = v - E, f = v - B, mt[0] = v - (B + f) + (f - E), m = p + B, f = m - p, g = p - (m - f) + (B - f), B = g - M, f = g - B, mt[1] = g - (B + f) + (f - M), S = m + B, f = S - m, mt[2] = m - (S - f) + (B - f), mt[3] = S;
  const N = ht(A, ze, 4, mt, He);
  return He[N - 1];
}
function dt(i, t, e, n, s, o) {
  const r = (t - o) * (e - s), a = (i - s) * (n - o), c = r - a, l = Math.abs(r + a);
  return Math.abs(c) >= Wn * l ? c : -Zn(i, t, e, n, s, o, l);
}
const tr = (10 + 96 * pt) * pt, er = (4 + 48 * pt) * pt, nr = (44 + 576 * pt) * pt * pt, Ot = tt(4), Ft = tt(4), Nt = tt(4), St = tt(4), kt = tt(4), Et = tt(4), gt = tt(4), wt = tt(4), _e = tt(8), Se = tt(8), ke = tt(8), Ee = tt(8), Ae = tt(8), Ie = tt(8), se = tt(8), oe = tt(8), ae = tt(8), Pt = tt(4), $t = tt(4), Rt = tt(4), z = tt(8), K = tt(16), nt = tt(16), rt = tt(16), et = tt(32), Ct = tt(32), ct = tt(48), vt = tt(64);
let jt = tt(1152), Be = tt(1152);
function lt(i, t, e) {
  i = ht(i, jt, t, e, Be);
  const n = jt;
  return jt = Be, Be = n, i;
}
function rr(i, t, e, n, s, o, r, a, c) {
  let l, h, f, u, b, y, d, _, B, m, g, p, v, M, E, S, k, T, O, D, R, w, I, A, N, C, P, x, F, $, X, q, Y, j, V;
  const G = i - r, H = e - r, W = s - r, J = t - a, Z = n - a, Q = o - a;
  X = H * Q, I = U * H, A = I - (I - H), N = H - A, I = U * Q, C = I - (I - Q), P = Q - C, q = N * P - (X - A * C - N * C - A * P), Y = W * Z, I = U * W, A = I - (I - W), N = W - A, I = U * Z, C = I - (I - Z), P = Z - C, j = N * P - (Y - A * C - N * C - A * P), x = q - j, w = q - x, Ot[0] = q - (x + w) + (w - j), F = X + x, w = F - X, $ = X - (F - w) + (x - w), x = $ - Y, w = $ - x, Ot[1] = $ - (x + w) + (w - Y), V = F + x, w = V - F, Ot[2] = F - (V - w) + (x - w), Ot[3] = V, X = W * J, I = U * W, A = I - (I - W), N = W - A, I = U * J, C = I - (I - J), P = J - C, q = N * P - (X - A * C - N * C - A * P), Y = G * Q, I = U * G, A = I - (I - G), N = G - A, I = U * Q, C = I - (I - Q), P = Q - C, j = N * P - (Y - A * C - N * C - A * P), x = q - j, w = q - x, Ft[0] = q - (x + w) + (w - j), F = X + x, w = F - X, $ = X - (F - w) + (x - w), x = $ - Y, w = $ - x, Ft[1] = $ - (x + w) + (w - Y), V = F + x, w = V - F, Ft[2] = F - (V - w) + (x - w), Ft[3] = V, X = G * Z, I = U * G, A = I - (I - G), N = G - A, I = U * Z, C = I - (I - Z), P = Z - C, q = N * P - (X - A * C - N * C - A * P), Y = H * J, I = U * H, A = I - (I - H), N = H - A, I = U * J, C = I - (I - J), P = J - C, j = N * P - (Y - A * C - N * C - A * P), x = q - j, w = q - x, Nt[0] = q - (x + w) + (w - j), F = X + x, w = F - X, $ = X - (F - w) + (x - w), x = $ - Y, w = $ - x, Nt[1] = $ - (x + w) + (w - Y), V = F + x, w = V - F, Nt[2] = F - (V - w) + (x - w), Nt[3] = V, l = ht(
    ht(
      ht(
        L(L(4, Ot, G, z), z, G, K),
        K,
        L(L(4, Ot, J, z), z, J, nt),
        nt,
        et
      ),
      et,
      ht(
        L(L(4, Ft, H, z), z, H, K),
        K,
        L(L(4, Ft, Z, z), z, Z, nt),
        nt,
        Ct
      ),
      Ct,
      vt
    ),
    vt,
    ht(
      L(L(4, Nt, W, z), z, W, K),
      K,
      L(L(4, Nt, Q, z), z, Q, nt),
      nt,
      et
    ),
    et,
    jt
  );
  let at = Fn(l, jt), ft = er * c;
  if (at >= ft || -at >= ft || (w = i - G, h = i - (G + w) + (w - r), w = t - J, b = t - (J + w) + (w - a), w = e - H, f = e - (H + w) + (w - r), w = n - Z, y = n - (Z + w) + (w - a), w = s - W, u = s - (W + w) + (w - r), w = o - Q, d = o - (Q + w) + (w - a), h === 0 && f === 0 && u === 0 && b === 0 && y === 0 && d === 0) || (ft = nr * c + On * Math.abs(at), at += (G * G + J * J) * (H * d + Q * f - (Z * u + W * y)) + 2 * (G * h + J * b) * (H * Q - Z * W) + ((H * H + Z * Z) * (W * b + J * u - (Q * h + G * d)) + 2 * (H * f + Z * y) * (W * J - Q * G)) + ((W * W + Q * Q) * (G * y + Z * h - (J * f + H * b)) + 2 * (W * u + Q * d) * (G * Z - J * H)), at >= ft || -at >= ft))
    return at;
  if ((f !== 0 || y !== 0 || u !== 0 || d !== 0) && (X = G * G, I = U * G, A = I - (I - G), N = G - A, q = N * N - (X - A * A - (A + A) * N), Y = J * J, I = U * J, A = I - (I - J), N = J - A, j = N * N - (Y - A * A - (A + A) * N), x = q + j, w = x - q, St[0] = q - (x - w) + (j - w), F = X + x, w = F - X, $ = X - (F - w) + (x - w), x = $ + Y, w = x - $, St[1] = $ - (x - w) + (Y - w), V = F + x, w = V - F, St[2] = F - (V - w) + (x - w), St[3] = V), (u !== 0 || d !== 0 || h !== 0 || b !== 0) && (X = H * H, I = U * H, A = I - (I - H), N = H - A, q = N * N - (X - A * A - (A + A) * N), Y = Z * Z, I = U * Z, A = I - (I - Z), N = Z - A, j = N * N - (Y - A * A - (A + A) * N), x = q + j, w = x - q, kt[0] = q - (x - w) + (j - w), F = X + x, w = F - X, $ = X - (F - w) + (x - w), x = $ + Y, w = x - $, kt[1] = $ - (x - w) + (Y - w), V = F + x, w = V - F, kt[2] = F - (V - w) + (x - w), kt[3] = V), (h !== 0 || b !== 0 || f !== 0 || y !== 0) && (X = W * W, I = U * W, A = I - (I - W), N = W - A, q = N * N - (X - A * A - (A + A) * N), Y = Q * Q, I = U * Q, A = I - (I - Q), N = Q - A, j = N * N - (Y - A * A - (A + A) * N), x = q + j, w = x - q, Et[0] = q - (x - w) + (j - w), F = X + x, w = F - X, $ = X - (F - w) + (x - w), x = $ + Y, w = x - $, Et[1] = $ - (x - w) + (Y - w), V = F + x, w = V - F, Et[2] = F - (V - w) + (x - w), Et[3] = V), h !== 0 && (_ = L(4, Ot, h, _e), l = lt(l, _t(
    L(_, _e, 2 * G, K),
    K,
    L(L(4, Et, h, z), z, Z, nt),
    nt,
    L(L(4, kt, h, z), z, -Q, rt),
    rt,
    et,
    ct
  ), ct)), b !== 0 && (B = L(4, Ot, b, Se), l = lt(l, _t(
    L(B, Se, 2 * J, K),
    K,
    L(L(4, kt, b, z), z, W, nt),
    nt,
    L(L(4, Et, b, z), z, -H, rt),
    rt,
    et,
    ct
  ), ct)), f !== 0 && (m = L(4, Ft, f, ke), l = lt(l, _t(
    L(m, ke, 2 * H, K),
    K,
    L(L(4, St, f, z), z, Q, nt),
    nt,
    L(L(4, Et, f, z), z, -J, rt),
    rt,
    et,
    ct
  ), ct)), y !== 0 && (g = L(4, Ft, y, Ee), l = lt(l, _t(
    L(g, Ee, 2 * Z, K),
    K,
    L(L(4, Et, y, z), z, G, nt),
    nt,
    L(L(4, St, y, z), z, -W, rt),
    rt,
    et,
    ct
  ), ct)), u !== 0 && (p = L(4, Nt, u, Ae), l = lt(l, _t(
    L(p, Ae, 2 * W, K),
    K,
    L(L(4, kt, u, z), z, J, nt),
    nt,
    L(L(4, St, u, z), z, -Z, rt),
    rt,
    et,
    ct
  ), ct)), d !== 0 && (v = L(4, Nt, d, Ie), l = lt(l, _t(
    L(v, Ie, 2 * Q, K),
    K,
    L(L(4, St, d, z), z, H, nt),
    nt,
    L(L(4, kt, d, z), z, -G, rt),
    rt,
    et,
    ct
  ), ct)), h !== 0 || b !== 0) {
    if (f !== 0 || y !== 0 || u !== 0 || d !== 0 ? (X = f * Q, I = U * f, A = I - (I - f), N = f - A, I = U * Q, C = I - (I - Q), P = Q - C, q = N * P - (X - A * C - N * C - A * P), Y = H * d, I = U * H, A = I - (I - H), N = H - A, I = U * d, C = I - (I - d), P = d - C, j = N * P - (Y - A * C - N * C - A * P), x = q + j, w = x - q, gt[0] = q - (x - w) + (j - w), F = X + x, w = F - X, $ = X - (F - w) + (x - w), x = $ + Y, w = x - $, gt[1] = $ - (x - w) + (Y - w), V = F + x, w = V - F, gt[2] = F - (V - w) + (x - w), gt[3] = V, X = u * -Z, I = U * u, A = I - (I - u), N = u - A, I = U * -Z, C = I - (I - -Z), P = -Z - C, q = N * P - (X - A * C - N * C - A * P), Y = W * -y, I = U * W, A = I - (I - W), N = W - A, I = U * -y, C = I - (I - -y), P = -y - C, j = N * P - (Y - A * C - N * C - A * P), x = q + j, w = x - q, wt[0] = q - (x - w) + (j - w), F = X + x, w = F - X, $ = X - (F - w) + (x - w), x = $ + Y, w = x - $, wt[1] = $ - (x - w) + (Y - w), V = F + x, w = V - F, wt[2] = F - (V - w) + (x - w), wt[3] = V, E = ht(4, gt, 4, wt, oe), X = f * d, I = U * f, A = I - (I - f), N = f - A, I = U * d, C = I - (I - d), P = d - C, q = N * P - (X - A * C - N * C - A * P), Y = u * y, I = U * u, A = I - (I - u), N = u - A, I = U * y, C = I - (I - y), P = y - C, j = N * P - (Y - A * C - N * C - A * P), x = q - j, w = q - x, $t[0] = q - (x + w) + (w - j), F = X + x, w = F - X, $ = X - (F - w) + (x - w), x = $ - Y, w = $ - x, $t[1] = $ - (x + w) + (w - Y), V = F + x, w = V - F, $t[2] = F - (V - w) + (x - w), $t[3] = V, T = 4) : (oe[0] = 0, E = 1, $t[0] = 0, T = 1), h !== 0) {
      const it = L(E, oe, h, rt);
      l = lt(l, ht(
        L(_, _e, h, K),
        K,
        L(it, rt, 2 * G, et),
        et,
        ct
      ), ct);
      const st = L(T, $t, h, z);
      l = lt(l, _t(
        L(st, z, 2 * G, K),
        K,
        L(st, z, h, nt),
        nt,
        L(it, rt, h, et),
        et,
        Ct,
        vt
      ), vt), y !== 0 && (l = lt(l, L(L(4, Et, h, z), z, y, K), K)), d !== 0 && (l = lt(l, L(L(4, kt, -h, z), z, d, K), K));
    }
    if (b !== 0) {
      const it = L(E, oe, b, rt);
      l = lt(l, ht(
        L(B, Se, b, K),
        K,
        L(it, rt, 2 * J, et),
        et,
        ct
      ), ct);
      const st = L(T, $t, b, z);
      l = lt(l, _t(
        L(st, z, 2 * J, K),
        K,
        L(st, z, b, nt),
        nt,
        L(it, rt, b, et),
        et,
        Ct,
        vt
      ), vt);
    }
  }
  if (f !== 0 || y !== 0) {
    if (u !== 0 || d !== 0 || h !== 0 || b !== 0 ? (X = u * J, I = U * u, A = I - (I - u), N = u - A, I = U * J, C = I - (I - J), P = J - C, q = N * P - (X - A * C - N * C - A * P), Y = W * b, I = U * W, A = I - (I - W), N = W - A, I = U * b, C = I - (I - b), P = b - C, j = N * P - (Y - A * C - N * C - A * P), x = q + j, w = x - q, gt[0] = q - (x - w) + (j - w), F = X + x, w = F - X, $ = X - (F - w) + (x - w), x = $ + Y, w = x - $, gt[1] = $ - (x - w) + (Y - w), V = F + x, w = V - F, gt[2] = F - (V - w) + (x - w), gt[3] = V, D = -Q, R = -d, X = h * D, I = U * h, A = I - (I - h), N = h - A, I = U * D, C = I - (I - D), P = D - C, q = N * P - (X - A * C - N * C - A * P), Y = G * R, I = U * G, A = I - (I - G), N = G - A, I = U * R, C = I - (I - R), P = R - C, j = N * P - (Y - A * C - N * C - A * P), x = q + j, w = x - q, wt[0] = q - (x - w) + (j - w), F = X + x, w = F - X, $ = X - (F - w) + (x - w), x = $ + Y, w = x - $, wt[1] = $ - (x - w) + (Y - w), V = F + x, w = V - F, wt[2] = F - (V - w) + (x - w), wt[3] = V, S = ht(4, gt, 4, wt, ae), X = u * b, I = U * u, A = I - (I - u), N = u - A, I = U * b, C = I - (I - b), P = b - C, q = N * P - (X - A * C - N * C - A * P), Y = h * d, I = U * h, A = I - (I - h), N = h - A, I = U * d, C = I - (I - d), P = d - C, j = N * P - (Y - A * C - N * C - A * P), x = q - j, w = q - x, Rt[0] = q - (x + w) + (w - j), F = X + x, w = F - X, $ = X - (F - w) + (x - w), x = $ - Y, w = $ - x, Rt[1] = $ - (x + w) + (w - Y), V = F + x, w = V - F, Rt[2] = F - (V - w) + (x - w), Rt[3] = V, O = 4) : (ae[0] = 0, S = 1, Rt[0] = 0, O = 1), f !== 0) {
      const it = L(S, ae, f, rt);
      l = lt(l, ht(
        L(m, ke, f, K),
        K,
        L(it, rt, 2 * H, et),
        et,
        ct
      ), ct);
      const st = L(O, Rt, f, z);
      l = lt(l, _t(
        L(st, z, 2 * H, K),
        K,
        L(st, z, f, nt),
        nt,
        L(it, rt, f, et),
        et,
        Ct,
        vt
      ), vt), d !== 0 && (l = lt(l, L(L(4, St, f, z), z, d, K), K)), b !== 0 && (l = lt(l, L(L(4, Et, -f, z), z, b, K), K));
    }
    if (y !== 0) {
      const it = L(S, ae, y, rt);
      l = lt(l, ht(
        L(g, Ee, y, K),
        K,
        L(it, rt, 2 * Z, et),
        et,
        ct
      ), ct);
      const st = L(O, Rt, y, z);
      l = lt(l, _t(
        L(st, z, 2 * Z, K),
        K,
        L(st, z, y, nt),
        nt,
        L(it, rt, y, et),
        et,
        Ct,
        vt
      ), vt);
    }
  }
  if (u !== 0 || d !== 0) {
    if (h !== 0 || b !== 0 || f !== 0 || y !== 0 ? (X = h * Z, I = U * h, A = I - (I - h), N = h - A, I = U * Z, C = I - (I - Z), P = Z - C, q = N * P - (X - A * C - N * C - A * P), Y = G * y, I = U * G, A = I - (I - G), N = G - A, I = U * y, C = I - (I - y), P = y - C, j = N * P - (Y - A * C - N * C - A * P), x = q + j, w = x - q, gt[0] = q - (x - w) + (j - w), F = X + x, w = F - X, $ = X - (F - w) + (x - w), x = $ + Y, w = x - $, gt[1] = $ - (x - w) + (Y - w), V = F + x, w = V - F, gt[2] = F - (V - w) + (x - w), gt[3] = V, D = -J, R = -b, X = f * D, I = U * f, A = I - (I - f), N = f - A, I = U * D, C = I - (I - D), P = D - C, q = N * P - (X - A * C - N * C - A * P), Y = H * R, I = U * H, A = I - (I - H), N = H - A, I = U * R, C = I - (I - R), P = R - C, j = N * P - (Y - A * C - N * C - A * P), x = q + j, w = x - q, wt[0] = q - (x - w) + (j - w), F = X + x, w = F - X, $ = X - (F - w) + (x - w), x = $ + Y, w = x - $, wt[1] = $ - (x - w) + (Y - w), V = F + x, w = V - F, wt[2] = F - (V - w) + (x - w), wt[3] = V, M = ht(4, gt, 4, wt, se), X = h * y, I = U * h, A = I - (I - h), N = h - A, I = U * y, C = I - (I - y), P = y - C, q = N * P - (X - A * C - N * C - A * P), Y = f * b, I = U * f, A = I - (I - f), N = f - A, I = U * b, C = I - (I - b), P = b - C, j = N * P - (Y - A * C - N * C - A * P), x = q - j, w = q - x, Pt[0] = q - (x + w) + (w - j), F = X + x, w = F - X, $ = X - (F - w) + (x - w), x = $ - Y, w = $ - x, Pt[1] = $ - (x + w) + (w - Y), V = F + x, w = V - F, Pt[2] = F - (V - w) + (x - w), Pt[3] = V, k = 4) : (se[0] = 0, M = 1, Pt[0] = 0, k = 1), u !== 0) {
      const it = L(M, se, u, rt);
      l = lt(l, ht(
        L(p, Ae, u, K),
        K,
        L(it, rt, 2 * W, et),
        et,
        ct
      ), ct);
      const st = L(k, Pt, u, z);
      l = lt(l, _t(
        L(st, z, 2 * W, K),
        K,
        L(st, z, u, nt),
        nt,
        L(it, rt, u, et),
        et,
        Ct,
        vt
      ), vt), b !== 0 && (l = lt(l, L(L(4, kt, u, z), z, b, K), K)), y !== 0 && (l = lt(l, L(L(4, St, -u, z), z, y, K), K));
    }
    if (d !== 0) {
      const it = L(M, se, d, rt);
      l = lt(l, ht(
        L(v, Ie, d, K),
        K,
        L(it, rt, 2 * Q, et),
        et,
        ct
      ), ct);
      const st = L(k, Pt, d, z);
      l = lt(l, _t(
        L(st, z, 2 * Q, K),
        K,
        L(st, z, d, nt),
        nt,
        L(it, rt, d, et),
        et,
        Ct,
        vt
      ), vt);
    }
  }
  return jt[l - 1];
}
function ir(i, t, e, n, s, o, r, a) {
  const c = i - r, l = e - r, h = s - r, f = t - a, u = n - a, b = o - a, y = l * b, d = h * u, _ = c * c + f * f, B = h * f, m = c * b, g = l * l + u * u, p = c * u, v = l * f, M = h * h + b * b, E = _ * (y - d) + g * (B - m) + M * (p - v), S = (Math.abs(y) + Math.abs(d)) * _ + (Math.abs(B) + Math.abs(m)) * g + (Math.abs(p) + Math.abs(v)) * M, k = tr * S;
  return E > k || -E > k ? E : rr(i, t, e, n, s, o, r, a, S);
}
function sr(i, t) {
  var e, n, s = 0, o, r, a, c, l, h, f, u = i[0], b = i[1], y = t.length;
  for (e = 0; e < y; e++) {
    n = 0;
    var d = t[e], _ = d.length - 1;
    if (h = d[0], h[0] !== d[_][0] && h[1] !== d[_][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (r = h[0] - u, a = h[1] - b, n; n < _; n++) {
      if (f = d[n + 1], c = f[0] - u, l = f[1] - b, a === 0 && l === 0) {
        if (c <= 0 && r >= 0 || r <= 0 && c >= 0)
          return 0;
      } else if (l >= 0 && a <= 0 || l <= 0 && a >= 0) {
        if (o = dt(r, c, a, l, 0, 0), o === 0)
          return 0;
        (o > 0 && l > 0 && a <= 0 || o < 0 && l <= 0 && a > 0) && s++;
      }
      h = f, a = l, r = c;
    }
  }
  return s % 2 !== 0;
}
function Ge(i, t, e = {}) {
  if (!i)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const n = Gn(i), s = Kn(t), o = s.type, r = t.bbox;
  let a = s.coordinates;
  if (r && or(n, r) === !1)
    return !1;
  o === "Polygon" && (a = [a]);
  for (var c = 0; c < a.length; ++c) {
    const l = sr(n, a[c]);
    if (l === 0 && !e.ignoreBoundary) return !0;
    if (l) return !0;
  }
  return !1;
}
function or(i, t) {
  return t[0] <= i[0] && t[1] <= i[1] && t[2] >= i[0] && t[3] >= i[1];
}
class $e {
  constructor(t = [], e = ar) {
    if (this.data = t, this.length = this.data.length, this.compare = e, this.length > 0)
      for (let n = (this.length >> 1) - 1; n >= 0; n--) this._down(n);
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
    const { data: e, compare: n } = this, s = e[t];
    for (; t > 0; ) {
      const o = t - 1 >> 1, r = e[o];
      if (n(s, r) >= 0) break;
      e[t] = r, t = o;
    }
    e[t] = s;
  }
  _down(t) {
    const { data: e, compare: n } = this, s = this.length >> 1, o = e[t];
    for (; t < s; ) {
      let r = (t << 1) + 1, a = e[r];
      const c = r + 1;
      if (c < this.length && n(e[c], a) < 0 && (r = c, a = e[c]), n(a, o) >= 0) break;
      e[t] = a, t = r;
    }
    e[t] = o;
  }
}
function ar(i, t) {
  return i < t ? -1 : i > t ? 1 : 0;
}
const cr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $e
}, Symbol.toStringTag, { value: "Module" })), Bt = 11102230246251565e-32, ut = 134217729, lr = (3 + 8 * Bt) * Bt;
function Te(i, t, e, n, s) {
  let o, r, a, c, l = t[0], h = n[0], f = 0, u = 0;
  h > l == h > -l ? (o = l, l = t[++f]) : (o = h, h = n[++u]);
  let b = 0;
  if (f < i && u < e)
    for (h > l == h > -l ? (r = l + o, a = o - (r - l), l = t[++f]) : (r = h + o, a = o - (r - h), h = n[++u]), o = r, a !== 0 && (s[b++] = a); f < i && u < e; )
      h > l == h > -l ? (r = o + l, c = r - o, a = o - (r - c) + (l - c), l = t[++f]) : (r = o + h, c = r - o, a = o - (r - c) + (h - c), h = n[++u]), o = r, a !== 0 && (s[b++] = a);
  for (; f < i; )
    r = o + l, c = r - o, a = o - (r - c) + (l - c), l = t[++f], o = r, a !== 0 && (s[b++] = a);
  for (; u < e; )
    r = o + h, c = r - o, a = o - (r - c) + (h - c), h = n[++u], o = r, a !== 0 && (s[b++] = a);
  return (o !== 0 || b === 0) && (s[b++] = o), b;
}
function fr(i, t) {
  let e = t[0];
  for (let n = 1; n < i; n++) e += t[n];
  return e;
}
function ie(i) {
  return new Float64Array(i);
}
const hr = (3 + 16 * Bt) * Bt, ur = (2 + 12 * Bt) * Bt, dr = (9 + 64 * Bt) * Bt * Bt, qt = ie(4), Ke = ie(8), We = ie(12), Je = ie(16), yt = ie(4);
function pr(i, t, e, n, s, o, r) {
  let a, c, l, h, f, u, b, y, d, _, B, m, g, p, v, M, E, S;
  const k = i - s, T = e - s, O = t - o, D = n - o;
  p = k * D, u = ut * k, b = u - (u - k), y = k - b, u = ut * D, d = u - (u - D), _ = D - d, v = y * _ - (p - b * d - y * d - b * _), M = O * T, u = ut * O, b = u - (u - O), y = O - b, u = ut * T, d = u - (u - T), _ = T - d, E = y * _ - (M - b * d - y * d - b * _), B = v - E, f = v - B, qt[0] = v - (B + f) + (f - E), m = p + B, f = m - p, g = p - (m - f) + (B - f), B = g - M, f = g - B, qt[1] = g - (B + f) + (f - M), S = m + B, f = S - m, qt[2] = m - (S - f) + (B - f), qt[3] = S;
  let R = fr(4, qt), w = ur * r;
  if (R >= w || -R >= w || (f = i - k, a = i - (k + f) + (f - s), f = e - T, l = e - (T + f) + (f - s), f = t - O, c = t - (O + f) + (f - o), f = n - D, h = n - (D + f) + (f - o), a === 0 && c === 0 && l === 0 && h === 0) || (w = dr * r + lr * Math.abs(R), R += k * h + D * a - (O * l + T * c), R >= w || -R >= w)) return R;
  p = a * D, u = ut * a, b = u - (u - a), y = a - b, u = ut * D, d = u - (u - D), _ = D - d, v = y * _ - (p - b * d - y * d - b * _), M = c * T, u = ut * c, b = u - (u - c), y = c - b, u = ut * T, d = u - (u - T), _ = T - d, E = y * _ - (M - b * d - y * d - b * _), B = v - E, f = v - B, yt[0] = v - (B + f) + (f - E), m = p + B, f = m - p, g = p - (m - f) + (B - f), B = g - M, f = g - B, yt[1] = g - (B + f) + (f - M), S = m + B, f = S - m, yt[2] = m - (S - f) + (B - f), yt[3] = S;
  const I = Te(4, qt, 4, yt, Ke);
  p = k * h, u = ut * k, b = u - (u - k), y = k - b, u = ut * h, d = u - (u - h), _ = h - d, v = y * _ - (p - b * d - y * d - b * _), M = O * l, u = ut * O, b = u - (u - O), y = O - b, u = ut * l, d = u - (u - l), _ = l - d, E = y * _ - (M - b * d - y * d - b * _), B = v - E, f = v - B, yt[0] = v - (B + f) + (f - E), m = p + B, f = m - p, g = p - (m - f) + (B - f), B = g - M, f = g - B, yt[1] = g - (B + f) + (f - M), S = m + B, f = S - m, yt[2] = m - (S - f) + (B - f), yt[3] = S;
  const A = Te(I, Ke, 4, yt, We);
  p = a * h, u = ut * a, b = u - (u - a), y = a - b, u = ut * h, d = u - (u - h), _ = h - d, v = y * _ - (p - b * d - y * d - b * _), M = c * l, u = ut * c, b = u - (u - c), y = c - b, u = ut * l, d = u - (u - l), _ = l - d, E = y * _ - (M - b * d - y * d - b * _), B = v - E, f = v - B, yt[0] = v - (B + f) + (f - E), m = p + B, f = m - p, g = p - (m - f) + (B - f), B = g - M, f = g - B, yt[1] = g - (B + f) + (f - M), S = m + B, f = S - m, yt[2] = m - (S - f) + (B - f), yt[3] = S;
  const N = Te(A, We, 4, yt, Je);
  return Je[N - 1];
}
function Qe(i, t, e, n, s, o) {
  const r = (t - o) * (e - s), a = (i - s) * (n - o), c = r - a;
  if (r === 0 || a === 0 || r > 0 != a > 0) return c;
  const l = Math.abs(r + a);
  return Math.abs(c) >= hr * l ? c : -pr(i, t, e, n, s, o, l);
}
function mr(i, t) {
  const e = new $e([], Nn);
  return wr(i, e), yr(e, t);
}
function Nn(i, t) {
  return i.p.x > t.p.x ? 1 : i.p.x < t.p.x || i.p.x === t.p.x && (i.featureId !== t.featureId || i.ringId !== t.ringId) && i.isLeftEndpoint && !t.isLeftEndpoint ? -1 : i.p.y !== t.p.y ? i.p.y > t.p.y ? 1 : -1 : 1;
}
function gr(i, t) {
  return i.rightSweepEvent.p.x > t.rightSweepEvent.p.x ? 1 : i.rightSweepEvent.p.x < t.rightSweepEvent.p.x ? -1 : i.rightSweepEvent.p.y !== t.rightSweepEvent.p.y ? i.rightSweepEvent.p.y < t.rightSweepEvent.p.y ? 1 : -1 : 1;
}
function wr(i, t) {
  if (i.type === "FeatureCollection") {
    const e = i.features;
    for (let n = 0; n < e.length; n++)
      Ze(e[n], t);
  } else
    Ze(i, t);
}
var ce = 0, le = 0, fe = 0;
function Ze(i, t) {
  const e = i.type === "Feature" ? i.geometry : i;
  let n = e.coordinates;
  (e.type === "Polygon" || e.type === "MultiLineString") && (n = [n]), e.type === "LineString" && (n = [[n]]);
  for (let s = 0; s < n.length; s++)
    for (let o = 0; o < n[s].length; o++) {
      let r = n[s][o][0], a = null;
      le = le + 1;
      for (let c = 0; c < n[s][o].length - 1; c++) {
        a = n[s][o][c + 1];
        const l = new tn(r, ce, le, fe), h = new tn(a, ce, le, fe + 1);
        l.otherEvent = h, h.otherEvent = l, Nn(l, h) > 0 ? (h.isLeftEndpoint = !0, l.isLeftEndpoint = !1) : (l.isLeftEndpoint = !0, h.isLeftEndpoint = !1), t.push(l), t.push(h), r = a, fe = fe + 1;
      }
    }
  ce = ce + 1;
}
var tn = class {
  constructor(i, t, e, n) {
    this.p = {
      x: i[0],
      y: i[1]
    }, this.featureId = t, this.ringId = e, this.eventId = n, this.otherEvent = null, this.isLeftEndpoint = null;
  }
  isSamePoint(i) {
    return this.p.x === i.p.x && this.p.y === i.p.y;
  }
  asNewXY() {
    return [this.p.x, this.p.y];
  }
};
function yr(i, t = !1) {
  const e = [], n = new $e([], gr);
  for (; i.length; ) {
    const s = i.pop();
    if (s.isLeftEndpoint) {
      const o = new vr(s);
      for (let r = 0; r < n.data.length; r++) {
        const a = n.data[r];
        if (t && a.leftSweepEvent.featureId === s.featureId)
          continue;
        const c = br(o, a);
        c !== !1 && e.push(c);
      }
      n.push(o);
    } else s.isLeftEndpoint === !1 && n.pop();
  }
  return e;
}
var vr = class {
  /** @param event must have otherEvent non-null */
  constructor(i) {
    this.leftSweepEvent = i, this.rightSweepEvent = i.otherEvent;
  }
};
function br(i, t) {
  if (i === null || t === null) return !1;
  const e = i.leftSweepEvent.p.x, n = i.leftSweepEvent.p.y, s = i.rightSweepEvent.p.x, o = i.rightSweepEvent.p.y, r = t.leftSweepEvent.p.x, a = t.leftSweepEvent.p.y, c = t.rightSweepEvent.p.x, l = t.rightSweepEvent.p.y, h = Qe(e, n, s, o, r, a), f = Qe(e, n, s, o, c, l);
  if (h > 0 && f > 0) return !1;
  if (h < 0 && f < 0) return !1;
  if (i.leftSweepEvent.ringId === t.leftSweepEvent.ringId) {
    if (i.rightSweepEvent.isSamePoint(t.leftSweepEvent) || i.rightSweepEvent.isSamePoint(t.rightSweepEvent) || i.leftSweepEvent.isSamePoint(t.leftSweepEvent) || i.leftSweepEvent.isSamePoint(t.rightSweepEvent))
      return !1;
  } else {
    if (i.rightSweepEvent.isSamePoint(t.leftSweepEvent))
      return t.leftSweepEvent.asNewXY();
    if (i.rightSweepEvent.isSamePoint(t.rightSweepEvent))
      return t.rightSweepEvent.asNewXY();
    if (i.leftSweepEvent.isSamePoint(t.leftSweepEvent))
      return t.leftSweepEvent.asNewXY();
    if (i.leftSweepEvent.isSamePoint(t.rightSweepEvent))
      return t.rightSweepEvent.asNewXY();
  }
  const u = (l - a) * (s - e) - (c - r) * (o - n), b = (c - r) * (n - a) - (l - a) * (e - r), y = (s - e) * (n - a) - (o - n) * (e - r);
  if (u === 0)
    return !1;
  const d = b / u, _ = y / u;
  if (d >= 0 && d <= 1 && _ >= 0 && _ <= 1) {
    const B = e + d * (s - e), m = n + d * (o - n);
    return [B, m];
  }
  return !1;
}
function xr(i, t, e = {}) {
  const { removeDuplicates: n = !0, ignoreSelfIntersections: s = !0 } = e;
  let o = [];
  i.type === "FeatureCollection" ? o = o.concat(i.features) : i.type === "Feature" ? o.push(i) : (i.type === "LineString" || i.type === "Polygon" || i.type === "MultiLineString" || i.type === "MultiPolygon") && o.push(te(i)), t.type === "FeatureCollection" ? o = o.concat(t.features) : t.type === "Feature" ? o.push(t) : (t.type === "LineString" || t.type === "Polygon" || t.type === "MultiLineString" || t.type === "MultiPolygon") && o.push(te(t));
  const r = mr(
    xt(o),
    s
  );
  let a = [];
  if (n) {
    const c = {};
    r.forEach((l) => {
      const h = l.join(",");
      c[h] || (c[h] = !0, a.push(l));
    });
  } else
    a = r;
  return xt(a.map((c) => Yt(c)));
}
function Mr(i) {
  return i && i.__esModule && Object.prototype.hasOwnProperty.call(i, "default") ? i.default : i;
}
function _r(i) {
  if (Object.prototype.hasOwnProperty.call(i, "__esModule")) return i;
  var t = i.default;
  if (typeof t == "function") {
    var e = function n() {
      var s = !1;
      try {
        s = this instanceof n;
      } catch {
      }
      return s ? Reflect.construct(t, arguments, this.constructor) : t.apply(this, arguments);
    };
    e.prototype = t.prototype;
  } else e = {};
  return Object.defineProperty(e, "__esModule", { value: !0 }), Object.keys(i).forEach(function(n) {
    var s = Object.getOwnPropertyDescriptor(i, n);
    Object.defineProperty(e, n, s.get ? s : {
      enumerable: !0,
      get: function() {
        return i[n];
      }
    });
  }), e;
}
function Sr(i, t = {}) {
  let e = 0, n = 0, s = 0;
  return Pe(
    i,
    function(o) {
      e += o[0], n += o[1], s++;
    },
    !0
  ), Yt([e / s, n / s], t.properties);
}
var he = { exports: {} }, we = { exports: {} }, kr = we.exports, en;
function Er() {
  return en || (en = 1, (function(i, t) {
    (function(e, n) {
      i.exports = n();
    })(kr, function() {
      function e(m, g, p, v, M) {
        (function E(S, k, T, O, D) {
          for (; O > T; ) {
            if (O - T > 600) {
              var R = O - T + 1, w = k - T + 1, I = Math.log(R), A = 0.5 * Math.exp(2 * I / 3), N = 0.5 * Math.sqrt(I * A * (R - A) / R) * (w - R / 2 < 0 ? -1 : 1), C = Math.max(T, Math.floor(k - w * A / R + N)), P = Math.min(O, Math.floor(k + (R - w) * A / R + N));
              E(S, k, C, P, D);
            }
            var x = S[k], F = T, $ = O;
            for (n(S, T, k), D(S[O], x) > 0 && n(S, T, O); F < $; ) {
              for (n(S, F, $), F++, $--; D(S[F], x) < 0; ) F++;
              for (; D(S[$], x) > 0; ) $--;
            }
            D(S[T], x) === 0 ? n(S, T, $) : n(S, ++$, O), $ <= k && (T = $ + 1), k <= $ && (O = $ - 1);
          }
        })(m, g, p || 0, v || m.length - 1, M || s);
      }
      function n(m, g, p) {
        var v = m[g];
        m[g] = m[p], m[p] = v;
      }
      function s(m, g) {
        return m < g ? -1 : m > g ? 1 : 0;
      }
      var o = function(m) {
        m === void 0 && (m = 9), this._maxEntries = Math.max(4, m), this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries)), this.clear();
      };
      function r(m, g, p) {
        if (!p) return g.indexOf(m);
        for (var v = 0; v < g.length; v++) if (p(m, g[v])) return v;
        return -1;
      }
      function a(m, g) {
        c(m, 0, m.children.length, g, m);
      }
      function c(m, g, p, v, M) {
        M || (M = _(null)), M.minX = 1 / 0, M.minY = 1 / 0, M.maxX = -1 / 0, M.maxY = -1 / 0;
        for (var E = g; E < p; E++) {
          var S = m.children[E];
          l(M, m.leaf ? v(S) : S);
        }
        return M;
      }
      function l(m, g) {
        return m.minX = Math.min(m.minX, g.minX), m.minY = Math.min(m.minY, g.minY), m.maxX = Math.max(m.maxX, g.maxX), m.maxY = Math.max(m.maxY, g.maxY), m;
      }
      function h(m, g) {
        return m.minX - g.minX;
      }
      function f(m, g) {
        return m.minY - g.minY;
      }
      function u(m) {
        return (m.maxX - m.minX) * (m.maxY - m.minY);
      }
      function b(m) {
        return m.maxX - m.minX + (m.maxY - m.minY);
      }
      function y(m, g) {
        return m.minX <= g.minX && m.minY <= g.minY && g.maxX <= m.maxX && g.maxY <= m.maxY;
      }
      function d(m, g) {
        return g.minX <= m.maxX && g.minY <= m.maxY && g.maxX >= m.minX && g.maxY >= m.minY;
      }
      function _(m) {
        return { children: m, height: 1, leaf: !0, minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
      }
      function B(m, g, p, v, M) {
        for (var E = [g, p]; E.length; ) if (!((p = E.pop()) - (g = E.pop()) <= v)) {
          var S = g + Math.ceil((p - g) / v / 2) * v;
          e(m, S, g, p, M), E.push(g, S, S, p);
        }
      }
      return o.prototype.all = function() {
        return this._all(this.data, []);
      }, o.prototype.search = function(m) {
        var g = this.data, p = [];
        if (!d(m, g)) return p;
        for (var v = this.toBBox, M = []; g; ) {
          for (var E = 0; E < g.children.length; E++) {
            var S = g.children[E], k = g.leaf ? v(S) : S;
            d(m, k) && (g.leaf ? p.push(S) : y(m, k) ? this._all(S, p) : M.push(S));
          }
          g = M.pop();
        }
        return p;
      }, o.prototype.collides = function(m) {
        var g = this.data;
        if (!d(m, g)) return !1;
        for (var p = []; g; ) {
          for (var v = 0; v < g.children.length; v++) {
            var M = g.children[v], E = g.leaf ? this.toBBox(M) : M;
            if (d(m, E)) {
              if (g.leaf || y(m, E)) return !0;
              p.push(M);
            }
          }
          g = p.pop();
        }
        return !1;
      }, o.prototype.load = function(m) {
        if (!m || !m.length) return this;
        if (m.length < this._minEntries) {
          for (var g = 0; g < m.length; g++) this.insert(m[g]);
          return this;
        }
        var p = this._build(m.slice(), 0, m.length - 1, 0);
        if (this.data.children.length) if (this.data.height === p.height) this._splitRoot(this.data, p);
        else {
          if (this.data.height < p.height) {
            var v = this.data;
            this.data = p, p = v;
          }
          this._insert(p, this.data.height - p.height - 1, !0);
        }
        else this.data = p;
        return this;
      }, o.prototype.insert = function(m) {
        return m && this._insert(m, this.data.height - 1), this;
      }, o.prototype.clear = function() {
        return this.data = _([]), this;
      }, o.prototype.remove = function(m, g) {
        if (!m) return this;
        for (var p, v, M, E = this.data, S = this.toBBox(m), k = [], T = []; E || k.length; ) {
          if (E || (E = k.pop(), v = k[k.length - 1], p = T.pop(), M = !0), E.leaf) {
            var O = r(m, E.children, g);
            if (O !== -1) return E.children.splice(O, 1), k.push(E), this._condense(k), this;
          }
          M || E.leaf || !y(E, S) ? v ? (p++, E = v.children[p], M = !1) : E = null : (k.push(E), T.push(p), p = 0, v = E, E = E.children[0]);
        }
        return this;
      }, o.prototype.toBBox = function(m) {
        return m;
      }, o.prototype.compareMinX = function(m, g) {
        return m.minX - g.minX;
      }, o.prototype.compareMinY = function(m, g) {
        return m.minY - g.minY;
      }, o.prototype.toJSON = function() {
        return this.data;
      }, o.prototype.fromJSON = function(m) {
        return this.data = m, this;
      }, o.prototype._all = function(m, g) {
        for (var p = []; m; ) m.leaf ? g.push.apply(g, m.children) : p.push.apply(p, m.children), m = p.pop();
        return g;
      }, o.prototype._build = function(m, g, p, v) {
        var M, E = p - g + 1, S = this._maxEntries;
        if (E <= S) return a(M = _(m.slice(g, p + 1)), this.toBBox), M;
        v || (v = Math.ceil(Math.log(E) / Math.log(S)), S = Math.ceil(E / Math.pow(S, v - 1))), (M = _([])).leaf = !1, M.height = v;
        var k = Math.ceil(E / S), T = k * Math.ceil(Math.sqrt(S));
        B(m, g, p, T, this.compareMinX);
        for (var O = g; O <= p; O += T) {
          var D = Math.min(O + T - 1, p);
          B(m, O, D, k, this.compareMinY);
          for (var R = O; R <= D; R += k) {
            var w = Math.min(R + k - 1, D);
            M.children.push(this._build(m, R, w, v - 1));
          }
        }
        return a(M, this.toBBox), M;
      }, o.prototype._chooseSubtree = function(m, g, p, v) {
        for (; v.push(g), !g.leaf && v.length - 1 !== p; ) {
          for (var M = 1 / 0, E = 1 / 0, S = void 0, k = 0; k < g.children.length; k++) {
            var T = g.children[k], O = u(T), D = (R = m, w = T, (Math.max(w.maxX, R.maxX) - Math.min(w.minX, R.minX)) * (Math.max(w.maxY, R.maxY) - Math.min(w.minY, R.minY)) - O);
            D < E ? (E = D, M = O < M ? O : M, S = T) : D === E && O < M && (M = O, S = T);
          }
          g = S || g.children[0];
        }
        var R, w;
        return g;
      }, o.prototype._insert = function(m, g, p) {
        var v = p ? m : this.toBBox(m), M = [], E = this._chooseSubtree(v, this.data, g, M);
        for (E.children.push(m), l(E, v); g >= 0 && M[g].children.length > this._maxEntries; ) this._split(M, g), g--;
        this._adjustParentBBoxes(v, M, g);
      }, o.prototype._split = function(m, g) {
        var p = m[g], v = p.children.length, M = this._minEntries;
        this._chooseSplitAxis(p, M, v);
        var E = this._chooseSplitIndex(p, M, v), S = _(p.children.splice(E, p.children.length - E));
        S.height = p.height, S.leaf = p.leaf, a(p, this.toBBox), a(S, this.toBBox), g ? m[g - 1].children.push(S) : this._splitRoot(p, S);
      }, o.prototype._splitRoot = function(m, g) {
        this.data = _([m, g]), this.data.height = m.height + 1, this.data.leaf = !1, a(this.data, this.toBBox);
      }, o.prototype._chooseSplitIndex = function(m, g, p) {
        for (var v, M, E, S, k, T, O, D = 1 / 0, R = 1 / 0, w = g; w <= p - g; w++) {
          var I = c(m, 0, w, this.toBBox), A = c(m, w, p, this.toBBox), N = (M = I, E = A, S = void 0, k = void 0, T = void 0, O = void 0, S = Math.max(M.minX, E.minX), k = Math.max(M.minY, E.minY), T = Math.min(M.maxX, E.maxX), O = Math.min(M.maxY, E.maxY), Math.max(0, T - S) * Math.max(0, O - k)), C = u(I) + u(A);
          N < D ? (D = N, v = w, R = C < R ? C : R) : N === D && C < R && (R = C, v = w);
        }
        return v || p - g;
      }, o.prototype._chooseSplitAxis = function(m, g, p) {
        var v = m.leaf ? this.compareMinX : h, M = m.leaf ? this.compareMinY : f;
        this._allDistMargin(m, g, p, v) < this._allDistMargin(m, g, p, M) && m.children.sort(v);
      }, o.prototype._allDistMargin = function(m, g, p, v) {
        m.children.sort(v);
        for (var M = this.toBBox, E = c(m, 0, g, M), S = c(m, p - g, p, M), k = b(E) + b(S), T = g; T < p - g; T++) {
          var O = m.children[T];
          l(E, m.leaf ? M(O) : O), k += b(E);
        }
        for (var D = p - g - 1; D >= g; D--) {
          var R = m.children[D];
          l(S, m.leaf ? M(R) : R), k += b(S);
        }
        return k;
      }, o.prototype._adjustParentBBoxes = function(m, g, p) {
        for (var v = p; v >= 0; v--) l(g[v], m);
      }, o.prototype._condense = function(m) {
        for (var g = m.length - 1, p = void 0; g >= 0; g--) m[g].children.length === 0 ? g > 0 ? (p = m[g - 1].children).splice(p.indexOf(m[g]), 1) : this.clear() : a(m[g], this.toBBox);
      }, o;
    });
  })(we)), we.exports;
}
const Ar = /* @__PURE__ */ _r(cr);
var zt = { exports: {} }, Oe, nn;
function Ir() {
  return nn || (nn = 1, Oe = function(t, e, n, s) {
    var o = t[0], r = t[1], a = !1;
    n === void 0 && (n = 0), s === void 0 && (s = e.length);
    for (var c = (s - n) / 2, l = 0, h = c - 1; l < c; h = l++) {
      var f = e[n + l * 2 + 0], u = e[n + l * 2 + 1], b = e[n + h * 2 + 0], y = e[n + h * 2 + 1], d = u > r != y > r && o < (b - f) * (r - u) / (y - u) + f;
      d && (a = !a);
    }
    return a;
  }), Oe;
}
var Fe, rn;
function Br() {
  return rn || (rn = 1, Fe = function(t, e, n, s) {
    var o = t[0], r = t[1], a = !1;
    n === void 0 && (n = 0), s === void 0 && (s = e.length);
    for (var c = s - n, l = 0, h = c - 1; l < c; h = l++) {
      var f = e[l + n][0], u = e[l + n][1], b = e[h + n][0], y = e[h + n][1], d = u > r != y > r && o < (b - f) * (r - u) / (y - u) + f;
      d && (a = !a);
    }
    return a;
  }), Fe;
}
var sn;
function Tr() {
  if (sn) return zt.exports;
  sn = 1;
  var i = Ir(), t = Br();
  return zt.exports = function(n, s, o, r) {
    return s.length > 0 && Array.isArray(s[0]) ? t(n, s, o, r) : i(n, s, o, r);
  }, zt.exports.nested = t, zt.exports.flat = i, zt.exports;
}
var Gt = { exports: {} }, Or = Gt.exports, on;
function Fr() {
  return on || (on = 1, (function(i, t) {
    (function(e, n) {
      n(t);
    })(Or, function(e) {
      const s = 33306690738754706e-32;
      function o(d, _, B, m, g) {
        let p, v, M, E, S = _[0], k = m[0], T = 0, O = 0;
        k > S == k > -S ? (p = S, S = _[++T]) : (p = k, k = m[++O]);
        let D = 0;
        if (T < d && O < B) for (k > S == k > -S ? (M = p - ((v = S + p) - S), S = _[++T]) : (M = p - ((v = k + p) - k), k = m[++O]), p = v, M !== 0 && (g[D++] = M); T < d && O < B; ) k > S == k > -S ? (M = p - ((v = p + S) - (E = v - p)) + (S - E), S = _[++T]) : (M = p - ((v = p + k) - (E = v - p)) + (k - E), k = m[++O]), p = v, M !== 0 && (g[D++] = M);
        for (; T < d; ) M = p - ((v = p + S) - (E = v - p)) + (S - E), S = _[++T], p = v, M !== 0 && (g[D++] = M);
        for (; O < B; ) M = p - ((v = p + k) - (E = v - p)) + (k - E), k = m[++O], p = v, M !== 0 && (g[D++] = M);
        return p === 0 && D !== 0 || (g[D++] = p), D;
      }
      function r(d) {
        return new Float64Array(d);
      }
      const a = 33306690738754716e-32, c = 22204460492503146e-32, l = 11093356479670487e-47, h = r(4), f = r(8), u = r(12), b = r(16), y = r(4);
      e.orient2d = function(d, _, B, m, g, p) {
        const v = (_ - p) * (B - g), M = (d - g) * (m - p), E = v - M;
        if (v === 0 || M === 0 || v > 0 != M > 0) return E;
        const S = Math.abs(v + M);
        return Math.abs(E) >= a * S ? E : -(function(k, T, O, D, R, w, I) {
          let A, N, C, P, x, F, $, X, q, Y, j, V, G, H, W, J, Z, Q;
          const at = k - R, ft = O - R, it = T - w, st = D - w;
          x = (W = (X = at - ($ = (F = 134217729 * at) - (F - at))) * (Y = st - (q = (F = 134217729 * st) - (F - st))) - ((H = at * st) - $ * q - X * q - $ * Y)) - (j = W - (Z = (X = it - ($ = (F = 134217729 * it) - (F - it))) * (Y = ft - (q = (F = 134217729 * ft) - (F - ft))) - ((J = it * ft) - $ * q - X * q - $ * Y))), h[0] = W - (j + x) + (x - Z), x = (G = H - ((V = H + j) - (x = V - H)) + (j - x)) - (j = G - J), h[1] = G - (j + x) + (x - J), x = (Q = V + j) - V, h[2] = V - (Q - x) + (j - x), h[3] = Q;
          let Tt = (function(Vn, Ye) {
            let Le = Ye[0];
            for (let xe = 1; xe < Vn; xe++) Le += Ye[xe];
            return Le;
          })(4, h), Ut = c * I;
          if (Tt >= Ut || -Tt >= Ut || (A = k - (at + (x = k - at)) + (x - R), C = O - (ft + (x = O - ft)) + (x - R), N = T - (it + (x = T - it)) + (x - w), P = D - (st + (x = D - st)) + (x - w), A === 0 && N === 0 && C === 0 && P === 0) || (Ut = l * I + s * Math.abs(Tt), (Tt += at * P + st * A - (it * C + ft * N)) >= Ut || -Tt >= Ut)) return Tt;
          x = (W = (X = A - ($ = (F = 134217729 * A) - (F - A))) * (Y = st - (q = (F = 134217729 * st) - (F - st))) - ((H = A * st) - $ * q - X * q - $ * Y)) - (j = W - (Z = (X = N - ($ = (F = 134217729 * N) - (F - N))) * (Y = ft - (q = (F = 134217729 * ft) - (F - ft))) - ((J = N * ft) - $ * q - X * q - $ * Y))), y[0] = W - (j + x) + (x - Z), x = (G = H - ((V = H + j) - (x = V - H)) + (j - x)) - (j = G - J), y[1] = G - (j + x) + (x - J), x = (Q = V + j) - V, y[2] = V - (Q - x) + (j - x), y[3] = Q;
          const Yn = o(4, h, 4, y, f);
          x = (W = (X = at - ($ = (F = 134217729 * at) - (F - at))) * (Y = P - (q = (F = 134217729 * P) - (F - P))) - ((H = at * P) - $ * q - X * q - $ * Y)) - (j = W - (Z = (X = it - ($ = (F = 134217729 * it) - (F - it))) * (Y = C - (q = (F = 134217729 * C) - (F - C))) - ((J = it * C) - $ * q - X * q - $ * Y))), y[0] = W - (j + x) + (x - Z), x = (G = H - ((V = H + j) - (x = V - H)) + (j - x)) - (j = G - J), y[1] = G - (j + x) + (x - J), x = (Q = V + j) - V, y[2] = V - (Q - x) + (j - x), y[3] = Q;
          const Ln = o(Yn, f, 4, y, u);
          x = (W = (X = A - ($ = (F = 134217729 * A) - (F - A))) * (Y = P - (q = (F = 134217729 * P) - (F - P))) - ((H = A * P) - $ * q - X * q - $ * Y)) - (j = W - (Z = (X = N - ($ = (F = 134217729 * N) - (F - N))) * (Y = C - (q = (F = 134217729 * C) - (F - C))) - ((J = N * C) - $ * q - X * q - $ * Y))), y[0] = W - (j + x) + (x - Z), x = (G = H - ((V = H + j) - (x = V - H)) + (j - x)) - (j = G - J), y[1] = G - (j + x) + (x - J), x = (Q = V + j) - V, y[2] = V - (Q - x) + (j - x), y[3] = Q;
          const qn = o(Ln, u, 4, y, b);
          return b[qn - 1];
        })(d, _, B, m, g, p, S);
      }, e.orient2dfast = function(d, _, B, m, g, p) {
        return (_ - p) * (B - g) - (d - g) * (m - p);
      }, Object.defineProperty(e, "__esModule", { value: !0 });
    });
  })(Gt, Gt.exports)), Gt.exports;
}
var an;
function Nr() {
  if (an) return he.exports;
  an = 1;
  var i = Er(), t = Ar, e = Tr(), n = Fr().orient2d;
  t.default && (t = t.default), he.exports = s, he.exports.default = s;
  function s(p, v, M) {
    v = Math.max(0, v === void 0 ? 2 : v), M = M || 0;
    var E = b(p), S = new i(16);
    S.toBBox = function($) {
      return {
        minX: $[0],
        minY: $[1],
        maxX: $[0],
        maxY: $[1]
      };
    }, S.compareMinX = function($, X) {
      return $[0] - X[0];
    }, S.compareMinY = function($, X) {
      return $[1] - X[1];
    }, S.load(p);
    for (var k = [], T = 0, O; T < E.length; T++) {
      var D = E[T];
      S.remove(D), O = y(D, O), k.push(O);
    }
    var R = new i(16);
    for (T = 0; T < k.length; T++) R.insert(u(k[T]));
    for (var w = v * v, I = M * M; k.length; ) {
      var A = k.shift(), N = A.p, C = A.next.p, P = d(N, C);
      if (!(P < I)) {
        var x = P / w;
        D = o(S, A.prev.p, N, C, A.next.next.p, x, R), D && Math.min(d(D, N), d(D, C)) <= x && (k.push(A), k.push(y(D, A)), S.remove(D), R.remove(A), R.insert(u(A)), R.insert(u(A.next)));
      }
    }
    A = O;
    var F = [];
    do
      F.push(A.p), A = A.next;
    while (A !== O);
    return F.push(A.p), F;
  }
  function o(p, v, M, E, S, k, T) {
    for (var O = new t([], r), D = p.data; D; ) {
      for (var R = 0; R < D.children.length; R++) {
        var w = D.children[R], I = D.leaf ? _(w, M, E) : a(M, E, w);
        I > k || O.push({
          node: w,
          dist: I
        });
      }
      for (; O.length && !O.peek().node.children; ) {
        var A = O.pop(), N = A.node, C = _(N, v, M), P = _(N, E, S);
        if (A.dist < C && A.dist < P && l(M, N, T) && l(E, N, T)) return N;
      }
      D = O.pop(), D && (D = D.node);
    }
    return null;
  }
  function r(p, v) {
    return p.dist - v.dist;
  }
  function a(p, v, M) {
    if (c(p, M) || c(v, M)) return 0;
    var E = B(p[0], p[1], v[0], v[1], M.minX, M.minY, M.maxX, M.minY);
    if (E === 0) return 0;
    var S = B(p[0], p[1], v[0], v[1], M.minX, M.minY, M.minX, M.maxY);
    if (S === 0) return 0;
    var k = B(p[0], p[1], v[0], v[1], M.maxX, M.minY, M.maxX, M.maxY);
    if (k === 0) return 0;
    var T = B(p[0], p[1], v[0], v[1], M.minX, M.maxY, M.maxX, M.maxY);
    return T === 0 ? 0 : Math.min(E, S, k, T);
  }
  function c(p, v) {
    return p[0] >= v.minX && p[0] <= v.maxX && p[1] >= v.minY && p[1] <= v.maxY;
  }
  function l(p, v, M) {
    for (var E = Math.min(p[0], v[0]), S = Math.min(p[1], v[1]), k = Math.max(p[0], v[0]), T = Math.max(p[1], v[1]), O = M.search({ minX: E, minY: S, maxX: k, maxY: T }), D = 0; D < O.length; D++)
      if (f(O[D].p, O[D].next.p, p, v)) return !1;
    return !0;
  }
  function h(p, v, M) {
    return n(p[0], p[1], v[0], v[1], M[0], M[1]);
  }
  function f(p, v, M, E) {
    return p !== E && v !== M && h(p, v, M) > 0 != h(p, v, E) > 0 && h(M, E, p) > 0 != h(M, E, v) > 0;
  }
  function u(p) {
    var v = p.p, M = p.next.p;
    return p.minX = Math.min(v[0], M[0]), p.minY = Math.min(v[1], M[1]), p.maxX = Math.max(v[0], M[0]), p.maxY = Math.max(v[1], M[1]), p;
  }
  function b(p) {
    for (var v = p[0], M = p[0], E = p[0], S = p[0], k = 0; k < p.length; k++) {
      var T = p[k];
      T[0] < v[0] && (v = T), T[0] > E[0] && (E = T), T[1] < M[1] && (M = T), T[1] > S[1] && (S = T);
    }
    var O = [v, M, E, S], D = O.slice();
    for (k = 0; k < p.length; k++)
      e(p[k], O) || D.push(p[k]);
    return g(D);
  }
  function y(p, v) {
    var M = {
      p,
      prev: null,
      next: null,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };
    return v ? (M.next = v.next, M.prev = v, v.next.prev = M, v.next = M) : (M.prev = M, M.next = M), M;
  }
  function d(p, v) {
    var M = p[0] - v[0], E = p[1] - v[1];
    return M * M + E * E;
  }
  function _(p, v, M) {
    var E = v[0], S = v[1], k = M[0] - E, T = M[1] - S;
    if (k !== 0 || T !== 0) {
      var O = ((p[0] - E) * k + (p[1] - S) * T) / (k * k + T * T);
      O > 1 ? (E = M[0], S = M[1]) : O > 0 && (E += k * O, S += T * O);
    }
    return k = p[0] - E, T = p[1] - S, k * k + T * T;
  }
  function B(p, v, M, E, S, k, T, O) {
    var D = M - p, R = E - v, w = T - S, I = O - k, A = p - S, N = v - k, C = D * D + R * R, P = D * w + R * I, x = w * w + I * I, F = D * A + R * N, $ = w * A + I * N, X = C * x - P * P, q, Y, j, V, G = X, H = X;
    X === 0 ? (Y = 0, G = 1, V = $, H = x) : (Y = P * $ - x * F, V = C * $ - P * F, Y < 0 ? (Y = 0, V = $, H = x) : Y > G && (Y = G, V = $ + P, H = x)), V < 0 ? (V = 0, -F < 0 ? Y = 0 : -F > C ? Y = G : (Y = -F, G = C)) : V > H && (V = H, -F + P < 0 ? Y = 0 : -F + P > C ? Y = G : (Y = -F + P, G = C)), q = Y === 0 ? 0 : Y / G, j = V === 0 ? 0 : V / H;
    var W = (1 - q) * p + q * M, J = (1 - q) * v + q * E, Z = (1 - j) * S + j * T, Q = (1 - j) * k + j * O, at = Z - W, ft = Q - J;
    return at * at + ft * ft;
  }
  function m(p, v) {
    return p[0] === v[0] ? p[1] - v[1] : p[0] - v[0];
  }
  function g(p) {
    p.sort(m);
    for (var v = [], M = 0; M < p.length; M++) {
      for (; v.length >= 2 && h(v[v.length - 2], v[v.length - 1], p[M]) <= 0; )
        v.pop();
      v.push(p[M]);
    }
    for (var E = [], S = p.length - 1; S >= 0; S--) {
      for (; E.length >= 2 && h(E[E.length - 2], E[E.length - 1], p[S]) <= 0; )
        E.pop();
      E.push(p[S]);
    }
    return E.pop(), v.pop(), v.concat(E);
  }
  return he.exports;
}
var Cr = Nr();
const Dr = /* @__PURE__ */ Mr(Cr);
function cn(i, t = {}) {
  t.concavity = t.concavity || 1 / 0;
  const e = [];
  if (Pe(i, (s) => {
    e.push([s[0], s[1]]);
  }), !e.length)
    return null;
  const n = Dr(e, t.concavity);
  return n.length > 3 ? re([n], t.properties) : null;
}
const ln = Math.pow(2, -52), ue = new Uint32Array(512);
class Re {
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
  static from(t, e = Yr, n = Lr) {
    const s = t.length, o = new Float64Array(s * 2);
    for (let r = 0; r < s; r++) {
      const a = t[r];
      o[2 * r] = e(a), o[2 * r + 1] = n(a);
    }
    return new Re(o);
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
    const n = Math.max(2 * e - 5, 0);
    this._triangles = new Uint32Array(n * 3), this._halfedges = new Int32Array(n * 3), this._hashSize = Math.ceil(Math.sqrt(e)), this._hullPrev = new Uint32Array(e), this._hullNext = new Uint32Array(e), this._hullTri = new Uint32Array(e), this._hullHash = new Int32Array(this._hashSize), this._ids = new Uint32Array(e), this._dists = new Float64Array(e), this.trianglesLen = 0, this._cx = 0, this._cy = 0, this._hullStart = 0, this.hull = this._triangles, this.triangles = this._triangles, this.halfedges = this._halfedges, this.update();
  }
  /**
   * Updates the triangulation if you modified `delaunay.coords` values in place, avoiding expensive memory allocations.
   * Useful for iterative relaxation algorithms such as Lloyd's.
   */
  update() {
    const { coords: t, _hullPrev: e, _hullNext: n, _hullTri: s, _hullHash: o } = this, r = t.length >> 1;
    let a = 1 / 0, c = 1 / 0, l = -1 / 0, h = -1 / 0;
    for (let k = 0; k < r; k++) {
      const T = t[2 * k], O = t[2 * k + 1];
      T < a && (a = T), O < c && (c = O), T > l && (l = T), O > h && (h = O), this._ids[k] = k;
    }
    const f = (a + l) / 2, u = (c + h) / 2;
    let b = 0, y = 0, d = 0;
    for (let k = 0, T = 1 / 0; k < r; k++) {
      const O = Ne(f, u, t[2 * k], t[2 * k + 1]);
      O < T && (b = k, T = O);
    }
    const _ = t[2 * b], B = t[2 * b + 1];
    for (let k = 0, T = 1 / 0; k < r; k++) {
      if (k === b) continue;
      const O = Ne(_, B, t[2 * k], t[2 * k + 1]);
      O < T && O > 0 && (y = k, T = O);
    }
    let m = t[2 * y], g = t[2 * y + 1], p = 1 / 0;
    for (let k = 0; k < r; k++) {
      if (k === b || k === y) continue;
      const T = Rr(_, B, m, g, t[2 * k], t[2 * k + 1]);
      T < p && (d = k, p = T);
    }
    let v = t[2 * d], M = t[2 * d + 1];
    if (p === 1 / 0) {
      for (let O = 0; O < r; O++)
        this._dists[O] = t[2 * O] - t[0] || t[2 * O + 1] - t[1];
      Vt(this._ids, this._dists, 0, r - 1);
      const k = new Uint32Array(r);
      let T = 0;
      for (let O = 0, D = -1 / 0; O < r; O++) {
        const R = this._ids[O], w = this._dists[R];
        w > D && (k[T++] = R, D = w);
      }
      this.hull = k.subarray(0, T), this.triangles = new Uint32Array(0), this.halfedges = new Int32Array(0);
      return;
    }
    if (dt(_, B, m, g, v, M) < 0) {
      const k = y, T = m, O = g;
      y = d, m = v, g = M, d = k, v = T, M = O;
    }
    const E = Xr(_, B, m, g, v, M);
    this._cx = E.x, this._cy = E.y;
    for (let k = 0; k < r; k++)
      this._dists[k] = Ne(t[2 * k], t[2 * k + 1], E.x, E.y);
    Vt(this._ids, this._dists, 0, r - 1), this._hullStart = b;
    let S = 3;
    n[b] = e[d] = y, n[y] = e[b] = d, n[d] = e[y] = b, s[b] = 0, s[y] = 1, s[d] = 2, o.fill(-1), o[this._hashKey(_, B)] = b, o[this._hashKey(m, g)] = y, o[this._hashKey(v, M)] = d, this.trianglesLen = 0, this._addTriangle(b, y, d, -1, -1, -1);
    for (let k = 0, T = 0, O = 0; k < this._ids.length; k++) {
      const D = this._ids[k], R = t[2 * D], w = t[2 * D + 1];
      if (k > 0 && Math.abs(R - T) <= ln && Math.abs(w - O) <= ln || (T = R, O = w, D === b || D === y || D === d)) continue;
      let I = 0;
      for (let x = 0, F = this._hashKey(R, w); x < this._hashSize && (I = o[(F + x) % this._hashSize], !(I !== -1 && I !== n[I])); x++)
        ;
      I = e[I];
      let A = I, N;
      for (; N = n[A], dt(R, w, t[2 * A], t[2 * A + 1], t[2 * N], t[2 * N + 1]) >= 0; )
        if (A = N, A === I) {
          A = -1;
          break;
        }
      if (A === -1) continue;
      let C = this._addTriangle(A, D, n[A], -1, -1, s[A]);
      s[D] = this._legalize(C + 2), s[A] = C, S++;
      let P = n[A];
      for (; N = n[P], dt(R, w, t[2 * P], t[2 * P + 1], t[2 * N], t[2 * N + 1]) < 0; )
        C = this._addTriangle(P, D, N, s[D], -1, s[P]), s[D] = this._legalize(C + 2), n[P] = P, S--, P = N;
      if (A === I)
        for (; N = e[A], dt(R, w, t[2 * N], t[2 * N + 1], t[2 * A], t[2 * A + 1]) < 0; )
          C = this._addTriangle(N, D, A, -1, s[A], s[N]), this._legalize(C + 2), s[N] = C, n[A] = A, S--, A = N;
      this._hullStart = e[D] = A, n[A] = e[P] = D, n[D] = P, o[this._hashKey(R, w)] = D, o[this._hashKey(t[2 * A], t[2 * A + 1])] = A;
    }
    this.hull = new Uint32Array(S);
    for (let k = 0, T = this._hullStart; k < S; k++)
      this.hull[k] = T, T = n[T];
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
    return Math.floor(Pr(t - this._cx, e - this._cy) * this._hashSize) % this._hashSize;
  }
  /**
   * Flip an edge in a pair of triangles if it doesn't satisfy the Delaunay condition.
   *
   * @param {number} a
   * @private
   */
  _legalize(t) {
    const { _triangles: e, _halfedges: n, coords: s } = this;
    let o = 0, r = 0;
    for (; ; ) {
      const a = n[t], c = t - t % 3;
      if (r = c + (t + 2) % 3, a === -1) {
        if (o === 0) break;
        t = ue[--o];
        continue;
      }
      const l = a - a % 3, h = c + (t + 1) % 3, f = l + (a + 2) % 3, u = e[r], b = e[t], y = e[h], d = e[f];
      if ($r(
        s[2 * u],
        s[2 * u + 1],
        s[2 * b],
        s[2 * b + 1],
        s[2 * y],
        s[2 * y + 1],
        s[2 * d],
        s[2 * d + 1]
      )) {
        e[t] = d, e[a] = u;
        const B = n[f];
        if (B === -1) {
          let g = this._hullStart;
          do {
            if (this._hullTri[g] === f) {
              this._hullTri[g] = t;
              break;
            }
            g = this._hullPrev[g];
          } while (g !== this._hullStart);
        }
        this._link(t, B), this._link(a, n[r]), this._link(r, f);
        const m = l + (a + 1) % 3;
        o < ue.length && (ue[o++] = m);
      } else {
        if (o === 0) break;
        t = ue[--o];
      }
    }
    return r;
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
  _addTriangle(t, e, n, s, o, r) {
    const a = this.trianglesLen;
    return this._triangles[a] = t, this._triangles[a + 1] = e, this._triangles[a + 2] = n, this._link(a, s), this._link(a + 1, o), this._link(a + 2, r), this.trianglesLen += 3, a;
  }
}
function Pr(i, t) {
  const e = i / (Math.abs(i) + Math.abs(t));
  return (t > 0 ? 3 - e : 1 + e) / 4;
}
function Ne(i, t, e, n) {
  const s = i - e, o = t - n;
  return s * s + o * o;
}
function $r(i, t, e, n, s, o, r, a) {
  const c = i - r, l = t - a, h = e - r, f = n - a, u = s - r, b = o - a, y = c * c + l * l, d = h * h + f * f, _ = u * u + b * b;
  return c * (f * _ - d * b) - l * (h * _ - d * u) + y * (h * b - f * u) < 0;
}
function Rr(i, t, e, n, s, o) {
  const r = e - i, a = n - t, c = s - i, l = o - t, h = r * r + a * a, f = c * c + l * l, u = 0.5 / (r * l - a * c), b = (l * h - a * f) * u, y = (r * f - c * h) * u;
  return b * b + y * y;
}
function Xr(i, t, e, n, s, o) {
  const r = e - i, a = n - t, c = s - i, l = o - t, h = r * r + a * a, f = c * c + l * l, u = 0.5 / (r * l - a * c), b = i + (l * h - a * f) * u, y = t + (r * f - c * h) * u;
  return { x: b, y };
}
function Vt(i, t, e, n) {
  if (n - e <= 20)
    for (let s = e + 1; s <= n; s++) {
      const o = i[s], r = t[o];
      let a = s - 1;
      for (; a >= e && t[i[a]] > r; ) i[a + 1] = i[a--];
      i[a + 1] = o;
    }
  else {
    const s = e + n >> 1;
    let o = e + 1, r = n;
    Ht(i, s, o), t[i[e]] > t[i[n]] && Ht(i, e, n), t[i[o]] > t[i[n]] && Ht(i, o, n), t[i[e]] > t[i[o]] && Ht(i, e, o);
    const a = i[o], c = t[a];
    for (; ; ) {
      do
        o++;
      while (t[i[o]] < c);
      do
        r--;
      while (t[i[r]] > c);
      if (r < o) break;
      Ht(i, o, r);
    }
    i[e + 1] = i[r], i[r] = a, n - o + 1 >= r - e ? (Vt(i, t, o, n), Vt(i, t, e, r - 1)) : (Vt(i, t, e, r - 1), Vt(i, t, o, n));
  }
}
function Ht(i, t, e) {
  const n = i[t];
  i[t] = i[e], i[e] = n;
}
function Yr(i) {
  return i[0];
}
function Lr(i) {
  return i[1];
}
class qr {
  bs;
  width;
  constructor(t, e) {
    this.width = t, this.bs = e;
  }
  /** Copy of the underlying bits (for restoring the set later with {@link load}). */
  copyBits() {
    return this.bs.slice();
  }
  /** Replace the contents with bits taken by {@link copyBits} from a set of the same length. */
  load(t) {
    return this.bs.set(t), this;
  }
  /**
   * Add a number to the set.
   *
   * @param idx The number to add. Must be 0 <= idx < len.
   */
  add(t) {
    const e = Math.floor(t / this.width), n = t % this.width;
    return this.bs[e] |= 1 << n, this;
  }
  /**
   * Delete a number from the set.
   *
   * @param idx The number to delete. Must be 0 <= idx < len.
   */
  delete(t) {
    const e = Math.floor(t / this.width), n = t % this.width;
    return this.bs[e] &= ~(1 << n), this;
  }
  /**
   * Add or delete a number in the set, depending on the second argument.
   *
   * @param idx The number to add or delete. Must be 0 <= idx < len.
   * @param val If true, add the number, otherwise delete.
   */
  set(t, e) {
    const n = Math.floor(t / this.width), o = 1 << t % this.width;
    return this.bs[n] ^= (-Number(e) ^ this.bs[n]) & o, e;
  }
  /**
   * Whether the number is in the set.
   *
   * @param idx The number to test. Must be 0 <= idx < len.
   */
  has(t) {
    const e = Math.floor(t / this.width), n = t % this.width;
    return (this.bs[e] & 1 << n) !== 0;
  }
  /**
   * Iterate over the numbers that are in the set.
   */
  forEach(t) {
    const e = this.bs.length;
    for (let n = 0; n < e; n++) {
      let s = 0;
      for (; this.bs[n] && s < this.width; )
        this.bs[n] & 1 << s && t(n * this.width + s), s++;
    }
    return this;
  }
}
class fn extends qr {
  constructor(t) {
    super(8, new Uint8Array(Math.ceil(t / 8)).fill(0));
  }
}
function At(i) {
  return i % 3 === 2 ? i - 2 : i + 1;
}
function Mt(i) {
  return i % 3 === 0 ? i + 2 : i - 1;
}
function hn(i, t, e, n, s, o, r, a) {
  const c = dt(i, t, s, o, r, a), l = dt(e, n, s, o, r, a);
  if (c > 0 && l > 0 || c < 0 && l < 0)
    return !1;
  const h = dt(s, o, i, t, e, n), f = dt(r, a, i, t, e, n);
  return h > 0 && f > 0 || h < 0 && f < 0 ? !1 : c === 0 && l === 0 && h === 0 && f === 0 ? !(Math.max(s, r) < Math.min(i, e) || Math.max(i, e) < Math.min(s, r) || Math.max(o, a) < Math.min(t, n) || Math.max(t, n) < Math.min(o, a)) : !0;
}
class Vr {
  /**
   * The triangulation object from Delaunator.
   */
  del;
  constructor(t) {
    this.del = t;
  }
}
class Zt extends Vr {
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
    const n = 2 ** 32 - 1, s = t.coords.length >> 1, o = t.triangles.length;
    this.vertMap = new Uint32Array(s).fill(n), this.flips = new fn(o), this.consd = new fn(o);
    for (let r = 0; r < o; r++) {
      const a = t.triangles[r];
      this.vertMap[a] === n && this.updateVert(r);
    }
    e && this.constrainAll(e);
  }
  /** 現在の三角網と制約の状態を控える（三角網の配列は複製する）。 */
  snapshot() {
    const { coords: t, hull: e, triangles: n, halfedges: s } = this.del;
    return {
      coords: t,
      hull: e,
      triangles: Uint32Array.from(n),
      halfedges: Int32Array.from(s),
      vertMap: this.vertMap.slice(),
      flips: this.flips.copyBits(),
      consd: this.consd.copyBits()
    };
  }
  /** {@link snapshot} で控えた状態を、新しい配列に複製して復元する（控えは何度でも使える）。 */
  static restore(t) {
    const e = new Zt({
      coords: t.coords,
      hull: t.hull,
      triangles: t.triangles.slice(),
      halfedges: t.halfedges.slice()
    });
    return e.vertMap.set(t.vertMap), e.flips.load(t.flips), e.consd.load(t.consd), e;
  }
  /**
   * Constrain the triangulation such that there is an edge between p1 and p2.
   */
  constrainOne(t, e) {
    const { triangles: n, halfedges: s } = this.del;
    this.assertVertex(t, t, e), this.assertVertex(e, t, e), this.assertInTriangulation(t, t, e), this.assertInTriangulation(e, t, e);
    const o = this.vertMap[t], r = this.maxConstrainSteps();
    let a = 0, c = o;
    do {
      if (++a > r)
        throw new Error(
          `Constraining edge [${t}, ${e}] exceeded the iteration limit`
        );
      const f = n[c], u = At(c);
      if (f === e)
        return this.protect(c);
      const b = Mt(c), y = n[b];
      if (y === e)
        return this.protect(u), u;
      if (this.intersectSegments(t, e, y, f)) {
        c = b;
        break;
      }
      c = s[u];
    } while (c !== -1 && c !== o);
    let l = c, h = -1;
    for (; c !== -1; ) {
      if (++a > r)
        throw new Error(
          `Constraining edge [${t}, ${e}] exceeded the iteration limit`
        );
      const f = s[c], u = Mt(c), b = Mt(f), y = At(f);
      if (f === -1)
        throw new Error("Constraining edge exited the hull");
      if (this.consd.has(c))
        throw new Error("Edge intersects already constrained edge");
      if (this.isCollinear(t, e, n[c]) || this.isCollinear(t, e, n[f]))
        throw new Error("Constraining edge intersects point");
      if (!this.intersectSegments(
        n[c],
        n[f],
        n[u],
        n[b]
      )) {
        if (h === -1 && (h = c), n[b] === e) {
          if (c === h)
            throw new Error("Infinite loop: non-convex quadrilateral");
          c = h, h = -1;
          continue;
        }
        if (this.intersectSegments(
          t,
          e,
          n[b],
          n[f]
        ))
          c = b;
        else if (this.intersectSegments(
          t,
          e,
          n[y],
          n[b]
        ))
          c = y;
        else if (h === c)
          throw new Error("Infinite loop: no further intersect after non-convex");
        continue;
      }
      if (this.flipDiagonal(c), this.intersectSegments(
        t,
        e,
        n[u],
        n[b]
      ) && (h === -1 && (h = u), h === u))
        throw new Error("Infinite loop: flipped diagonal still intersects");
      n[b] === e ? (l = b, c = h, h = -1) : this.intersectSegments(
        t,
        e,
        n[y],
        n[b]
      ) && (c = y);
    }
    return this.protect(l), this.delaunify(!0), this.findEdge(t, e);
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
  assertInTriangulation(t, e, n) {
    if (this.vertMap[t] >= this.del.triangles.length)
      throw new Error(
        `Invalid edge [${e}, ${n}]: vertex ${t} is not part of the triangulation`
      );
  }
  /**
   * Throw unless `vertex` is an id of a point given to Delaunator.
   */
  assertVertex(t, e, n) {
    const s = this.vertMap.length;
    if (!Number.isInteger(t) || t < 0 || t >= s)
      throw new Error(
        `Invalid edge [${String(e)}, ${String(n)}]: vertex ids must be integers from 0 to ${s - 1}`
      );
  }
  /**
   * Fix the Delaunay condition.
   */
  delaunify(t = !1) {
    const { halfedges: e } = this.del, n = this.flips, s = this.consd, o = e.length;
    let r;
    do {
      r = 0;
      for (let a = 0; a < o; a++) {
        if (s.has(a))
          continue;
        n.delete(a);
        const c = e[a];
        c !== -1 && (n.delete(c), this.isDelaunay(a) || (this.flipDiagonal(a), r++));
      }
    } while (t && r > 0);
    return this;
  }
  /**
   * Call constrainOne on each edge.
   */
  constrainAll(t) {
    const e = t.length;
    for (let n = 0; n < e; n++) {
      const s = t[n];
      this.constrainOne(s[0], s[1]);
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
  forbidGroupTriangles(t, e = [this.del.coords]) {
    const { triangles: n, halfedges: s } = this.del, o = n.length / 3, r = (y, d, _) => {
      const B = t(d), m = t(_);
      return t(y).some((g) => B.includes(g) && m.includes(g));
    }, a = (y) => r(n[y * 3], n[y * 3 + 1], n[y * 3 + 2]), c = (y, d, _, B) => Math.sign(dt(y[d * 2], y[d * 2 + 1], y[_ * 2], y[_ * 2 + 1], y[B * 2], y[B * 2 + 1])), l = e.map((y) => {
      let d = 0;
      for (let _ = 0; _ < o; _++) d += c(y, n[_ * 3], n[_ * 3 + 1], n[_ * 3 + 2]);
      return d < 0 ? -1 : 1;
    }), h = (y) => {
      if (this.consd.has(y)) return !1;
      const d = s[y];
      if (d === -1) return !1;
      const _ = n[y], B = n[At(y)], m = n[Mt(y)], g = n[Mt(d)];
      return e.every((p, v) => c(p, m, _, g) === l[v] && c(p, g, B, m) === l[v]);
    };
    let f = 0, u = !0;
    for (; u; ) {
      u = !1;
      for (let y = 0; y < o; y++)
        if (a(y))
          for (let d = 0; d < 3; d++) {
            const _ = y * 3 + d;
            if (!h(_)) continue;
            const B = s[_], m = n[_], g = n[At(_)], p = n[Mt(_)], v = n[Mt(B)];
            if (!(r(p, m, v) && r(v, g, p))) {
              this.protect(this.flipDiagonal(_)), f++, u = !0;
              break;
            }
          }
    }
    let b = 0;
    for (let y = 0; y < o; y++) a(y) && b++;
    return { flips: f, remaining: b };
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
    const n = this.vertMap[e], { triangles: s, halfedges: o } = this.del;
    if (!(n < s.length))
      return 1 / 0;
    let r = n, a, c = 0;
    do {
      if (++c > s.length)
        throw new Error(
          `Looking up edge [${t}, ${e}] exceeded the iteration limit`
        );
      if (s[r] === t)
        return r;
      a = At(r), r = o[a];
    } while (r !== -1 && r !== n);
    return s[At(a)] === t ? -a : 1 / 0;
  }
  /**
   * Mark an edge as constrained, i.e. should not be touched by `delaunify`.
   */
  protect(t) {
    const e = this.del.halfedges[t], n = this.flips, s = this.consd;
    return n.delete(t), s.add(t), e !== -1 ? (n.delete(e), s.add(e), e) : -t;
  }
  /**
   * Mark an edge as flipped unless constrained.
   */
  markFlip(t) {
    const e = this.del.halfedges, n = this.flips;
    if (this.consd.has(t))
      return !1;
    const o = e[t];
    return o !== -1 && (n.add(t), n.add(o)), !0;
  }
  /**
   * Flip the edge shared by two triangles.
   */
  flipDiagonal(t) {
    const { triangles: e, halfedges: n } = this.del, s = this.flips, o = this.consd, r = n[t], a = Mt(t), c = At(t), l = Mt(r), h = At(r), f = n[a], u = n[l];
    if (o.has(t))
      throw new Error("Trying to flip a constrained edge");
    return e[t] = e[l], n[t] = u, s.set(t, s.has(l)) || o.set(t, o.has(l)), u !== -1 && (n[u] = t), n[a] = l, e[r] = e[a], n[r] = f, s.set(r, s.has(a)) || o.set(r, o.has(a)), f !== -1 && (n[f] = r), n[l] = a, this.markFlip(t), this.markFlip(c), this.markFlip(r), this.markFlip(h), s.add(a), o.delete(a), s.add(l), o.delete(l), this.updateVert(t), this.updateVert(c), this.updateVert(r), this.updateVert(h), a;
  }
  /**
   * Whether point p1, p2, and p are collinear.
   */
  isCollinear(t, e, n) {
    const s = this.del.coords;
    return dt(
      s[t * 2],
      s[t * 2 + 1],
      s[e * 2],
      s[e * 2 + 1],
      s[n * 2],
      s[n * 2 + 1]
    ) === 0;
  }
  /**
   * Whether the triangle formed by p1, p2, p3 keeps px outside the circumcircle.
   */
  inCircle(t, e, n, s) {
    const o = this.del.coords;
    return ir(
      o[t * 2],
      o[t * 2 + 1],
      o[e * 2],
      o[e * 2 + 1],
      o[n * 2],
      o[n * 2 + 1],
      o[s * 2],
      o[s * 2 + 1]
    ) < 0;
  }
  /**
   * Whether the triangles sharing edg conform to the Delaunay condition.
   */
  isDelaunay(t) {
    const { triangles: e, halfedges: n } = this.del, s = n[t];
    if (s === -1)
      return !0;
    const o = e[Mt(t)], r = e[t], a = e[At(t)], c = e[Mt(s)];
    return !this.inCircle(o, r, a, c);
  }
  /**
   * Update the vertex -> incoming edge map.
   */
  updateVert(t) {
    const { triangles: e, halfedges: n } = this.del, s = this.vertMap, o = e[t];
    let r = Mt(t), a = n[r];
    for (; a !== -1 && a !== t; )
      r = Mt(a), a = n[r];
    return s[o] = r, r;
  }
  /**
   * Whether the segments between vertices intersect.
   */
  intersectSegments(t, e, n, s) {
    const o = this.del.coords;
    return t === n || t === s || e === n || e === s ? !1 : hn(
      o[t * 2],
      o[t * 2 + 1],
      o[e * 2],
      o[e * 2 + 1],
      o[n * 2],
      o[n * 2 + 1],
      o[s * 2],
      o[s * 2 + 1]
    );
  }
  static intersectSegments = hn;
}
function de(i, t, e) {
  return Ce(i, t, e).tin;
}
function Ce(i, t, e, n, s) {
  if (t || (t = []), typeof i != "object" || i.type !== "FeatureCollection")
    throw "Argument points must be FeatureCollection";
  if (!Array.isArray(t)) throw "Argument points must be Array of Array";
  const o = i.features.map(
    (d) => d.geometry.coordinates
  );
  let r = s?.snapshot ? Zt.restore(s.snapshot) : void 0;
  const a = r ? void 0 : Re.from(o);
  let c = r ? r.del : a, l = 0, h;
  const f = [];
  if (c.triangles.length !== 0 && (t.length !== 0 || n)) {
    if (!r) {
      r = new Zt(c);
      try {
        r.constrainAll(t);
      } catch (B) {
        if (!n?.allowUnusableBoundary) throw B;
        return { tin: xt([]), remaining: 0, hasBoundary: !1, hull: [] };
      }
      s && (s.snapshot = r.snapshot());
    }
    const d = n ? s?.snapshot ?? r.snapshot() : void 0, _ = (B) => {
      const m = Zt.restore(d);
      return m.constrainAll(B), m;
    };
    for (const B of n?.hull ?? [])
      try {
        r.constrainOne(B[0], B[1]), f.push(B);
      } catch {
        r = _(f);
      }
    n?.boundary && (h = jr(r, n.boundary), h || (r = _(f))), n && ({ remaining: l } = r.forbidGroupTriangles(
      n.groupsOf,
      n.planes
    ), l -= h?.size ?? 0), c = r.del;
  }
  const u = [];
  for (let d = 0; d < c.triangles.length; d += 3)
    h?.has(d / 3) || u.push([c.triangles[d], c.triangles[d + 1], c.triangles[d + 2]]);
  const b = ["a", "b", "c"];
  return { tin: xt(
    u.map((d) => {
      const _ = {}, B = d.map((m, g) => {
        const p = i.features[m], v = p.geometry.coordinates, M = [v[0], v[1]];
        return v.length === 3 ? M[2] = v[2] : _[b[g]] = p.properties[e], M;
      });
      return B[3] = B[0], re([B], _);
    })
  ), remaining: l, hasBoundary: h !== void 0, hull: f };
}
function jr(i, t) {
  try {
    i.constrainAll(t);
  } catch {
    return;
  }
  const e = new Map(t), { triangles: n, halfedges: s } = i.del, o = (l) => {
    const h = n[l], f = n[At(l)];
    return e.get(h) === f || e.get(f) === h;
  }, r = /* @__PURE__ */ new Set(), a = [], c = (l) => {
    const h = Math.floor(l / 3);
    r.has(h) || (r.add(h), a.push(h));
  };
  for (let l = 0; l < s.length; l++)
    s[l] === -1 && !o(l) && c(l);
  for (let l = 0; l < a.length; l++)
    for (let h = a[l] * 3; h < a[l] * 3 + 3; h++) {
      if (!e.has(n[h])) return;
      s[h] !== -1 && !o(h) && c(s[h]);
    }
  return r;
}
function un(i) {
  const t = /* @__PURE__ */ new Set(), e = [];
  if (i.forEach(([c, l], h) => {
    const f = `${c}:${l}`;
    t.has(f) || (t.add(f), e.push({ i: h, x: c, y: l }));
  }), e.length < 3) return [];
  const n = (c, l, h) => dt(c.x, c.y, l.x, l.y, h.x, h.y), s = [...e].sort((c, l) => c.x - l.x || c.y - l.y), o = (c) => {
    const l = [];
    for (const h of c) {
      for (; l.length >= 2 && n(l[l.length - 2], l[l.length - 1], h) <= 0; ) l.pop();
      l.push(h);
    }
    return l.pop(), l;
  }, r = [...o(s), ...o([...s].reverse())];
  if (r.length < 3) return [];
  const a = [];
  for (let c = 0; c < r.length; c++) {
    const l = r[c], h = r[(c + 1) % r.length], f = h.x - l.x, u = h.y - l.y, b = f * f + u * u, y = e.filter((_) => _ !== l && _ !== h && n(l, h, _) === 0).map((_) => ({ r: _, t: ((_.x - l.x) * f + (_.y - l.y) * u) / b })).filter(({ t: _ }) => _ > 0 && _ < 1).sort((_, B) => _.t - B.t).map(({ r: _ }) => _), d = [l, ...y, h];
    for (let _ = 0; _ + 1 < d.length; _++) a.push([d[_].i, d[_ + 1].i]);
  }
  return a;
}
function ye([i, t]) {
  return i < t ? `${i}-${t}` : `${t}-${i}`;
}
function Kt(i, t, e) {
  return Yt(i, { target: { geom: t, index: e } });
}
function Wt(i) {
  return Yt(i.properties.target.geom, {
    target: {
      geom: i.geometry.coordinates,
      index: i.properties.target.index
    }
  });
}
function dn(i, t) {
  const e = i.length, n = t.geometry.coordinates;
  return Array.from({ length: e }, (s, o) => o).map((s) => {
    const o = (s + 1) % e, r = i[s], a = i[o], c = r.geometry.coordinates, l = Math.atan2(
      c[0] - n[0],
      c[1] - n[1]
    ), h = [t, r, a, t].map(
      (b) => b.geometry.coordinates
    ), f = {
      a: {
        geom: t.properties.target.geom,
        index: t.properties.target.index
      },
      b: {
        geom: r.properties.target.geom,
        index: r.properties.target.index
      },
      c: {
        geom: a.properties.target.geom,
        index: a.properties.target.index
      }
    }, u = xt([
      re([h], f)
    ]);
    return [l, u];
  }).reduce(
    (s, o) => (s[0].push(o[0]), s[1].push(o[1]), s),
    [[], []]
  );
}
const Ur = [0.1, 0.15, 0.225, 0.34, 0.5];
function zr(i, t) {
  return t ? i.hasBoundary !== t.hasBoundary ? i.hasBoundary : i.diagnostics.boundaryTriangleFlips < t.diagnostics.boundaryTriangleFlips : !0;
}
function pn(i, t, e) {
  return Math.sign(dt(i[0], i[1], t[0], t[1], e[0], e[1]));
}
function ve(i, t = -1) {
  let e = 0;
  for (const n of i.features) {
    const { a: s, b: o, c: r } = n.properties;
    if (![s, o, r].some(
      ({ index: f }) => typeof f == "string" && f.startsWith("b")
    ))
      continue;
    const [a, c, l] = n.geometry.coordinates[0];
    pn(a, c, l) * pn(s.geom, o.geom, r.geom) * t <= 0 && e++;
  }
  return e;
}
function mn(i, t, e) {
  if (i.some(([r, a]) => r === t[0] && a === t[1])) return !1;
  const n = i.map(
    ([r, a]) => Math.atan2(a - t[1], r - t[0])
  ), s = 2 * Math.PI;
  let o = 0;
  for (let r = 0; r < n.length; r++) {
    const c = (e * (n[(r + 1) % n.length] - n[r]) + s) % s;
    if (!(c > 0 && c < Math.PI)) return !1;
    o += c;
  }
  return Math.abs(o - s) < 1e-6;
}
function Hr(i, t) {
  const e = new Set(
    t.forw.map(({ geometry: s }) => String(s.coordinates))
  ), n = new Set(
    t.bakw.map(({ geometry: s }) => String(s.coordinates))
  );
  return i.filter(({ forw: s, bakw: o }) => {
    const r = String(s), a = String(o);
    return e.has(r) || n.has(a) ? !1 : (e.add(r), n.add(a), !0);
  });
}
function gn(i, t, e, n, s, o = /* @__PURE__ */ new Set(), r) {
  const { minx: a, maxx: c, miny: l, maxy: h, centroid: f } = i, u = c - a, b = h - l, y = e.forw.length, d = Array.from({ length: y }, () => []);
  let _ = 1;
  for (const [E, S] of e.edges)
    E < n && d[E].push(_), d[S].push(_), S < n && _++;
  const B = (E) => E.slice(0, y).map(({ geometry: S }) => S.coordinates), m = un(B(e.forw)), g = {
    forw: m.filter((E) => !o.has(ye(E))),
    bakw: un(B(e.bakw))
  }, p = [0], v = (E) => E >= y ? p : d[E];
  let M;
  for (const E of Ur) {
    const S = r?.get(E) ?? { forwReuse: {} };
    r?.set(E, S);
    const k = S.vertices ?? (S.vertices = Hr(
      t(
        {
          ...i,
          minx: a - E * u,
          maxx: c + E * u,
          miny: l - E * b,
          maxy: h + E * b
        },
        !0
      ),
      e
    ));
    if (s && (k.length < 4 || !k.every(({ bakw: Y }) => Y.every(Number.isFinite)))) continue;
    const T = k.map(
      ({ forw: Y, bakw: j }, V) => Kt(Y, j, `b${V}`)
    ), O = xt([...e.forw, ...T]), D = xt([
      ...e.bakw,
      ...T.map(Wt)
    ]), R = [O, D].map(
      ({ features: Y }) => Float64Array.from(
        Y.flatMap(
          ({
            geometry: {
              coordinates: [j, V]
            }
          }) => [j, V]
        )
      )
    ), I = s !== void 0 || mn(
      k.map((Y) => Y.forw),
      f.forw,
      -1
    ) && mn(
      k.map((Y) => Y.bakw),
      f.bakw,
      1
    ) ? k.map((Y, j) => [
      y + j,
      y + (j + 1) % k.length
    ]) : void 0, A = { groupsOf: v, planes: R, boundary: I, allowUnusableBoundary: s !== void 0 }, N = s?.orientation ?? -1, C = Ce(
      O,
      e.edges,
      "target",
      { ...A, hull: g.forw },
      S.forwReuse
    ), P = S.geographic ?? (S.geographic = (() => {
      const Y = Ce(D, e.edges, "target", {
        ...A,
        hull: g.bakw
      });
      return { built: Y, flips: ve(Y.tin, N) };
    })()), x = P.built, F = C.tin, $ = {
      ...x.tin,
      features: [...x.tin.features]
    }, X = ve(F, N) + P.flips, q = {
      vertices: k,
      forw: F,
      bakw: $,
      diagnostics: {
        margin: E,
        boundaryTriangleFlips: X,
        remainingForbiddenTriangles: C.remaining + x.remaining
      },
      hasMapBoundary: C.hasBoundary,
      hasBoundary: C.hasBoundary && x.hasBoundary,
      forwHull: { all: m, applied: C.hull }
    };
    if (s) {
      if (s.accept(q)) return q;
      continue;
    }
    if (X === 0 && q.hasBoundary)
      return q;
    zr(q, M) && (M = q);
  }
  return M;
}
const Gr = 256 * Number.EPSILON, Cn = 4, Kr = 1e-9;
function Wr(i) {
  const t = Math.abs(i);
  if (!Number.isFinite(t)) return NaN;
  const e = new DataView(new ArrayBuffer(8));
  e.setFloat64(0, t);
  const n = e.getUint32(0) >>> 20 & 2047;
  return Math.pow(2, Math.max(n, 1) - 1023 - 52);
}
function Jr(i) {
  let t = 0;
  for (const e of i)
    t = Math.max(t, Math.abs(e[0]), Math.abs(e[1]));
  return t;
}
function Qr(i, t, e = Cn) {
  const n = (o) => {
    let r = 0;
    for (let c = 1; c < o.length; c++)
      r += Math.sqrt(
        Math.pow(o[c][0] - o[c - 1][0], 2) + Math.pow(o[c][1] - o[c - 1][1], 2)
      );
    const a = Wr(Jr(o)) / r;
    return Number.isFinite(a) ? a : 0;
  }, s = Gr + e * (n(i) + n(t));
  return Math.min(s, Kr);
}
function Zr(i, t, e) {
  const n = new Int32Array(i.length).fill(-1), s = new Int32Array(t.length).fill(-1), o = i.length - 2, r = t.length - 2;
  if (o < 1 || r < 1) return { illstToMerc: n, mercToIllst: s };
  const a = (v, M) => Math.abs(t[M + 1][3] - i[v + 1][3]) <= e;
  let c = o, l = -1, h = r, f = -1;
  for (let v = 0; v < o; v++)
    for (let M = 0; M < r; M++)
      a(v, M) && (c = Math.min(c, v), l = Math.max(l, v), h = Math.min(h, M), f = Math.max(f, M));
  if (l < 0) return { illstToMerc: n, mercToIllst: s };
  const u = l - c + 1, b = f - h + 1, y = b + 1, d = new Int32Array((u + 1) * y), _ = new Float64Array((u + 1) * y), B = new Uint8Array((u + 1) * y), m = (v, M, E, S) => v > E || v === E && M < S;
  for (let v = 1; v <= u; v++)
    for (let M = 1; M <= b; M++) {
      const E = v * y + M, S = E - y, k = E - 1;
      let T = d[S], O = _[S], D = 0;
      m(d[k], _[k], T, O) && (T = d[k], O = _[k], D = 1);
      const R = c + v - 1, w = h + M - 1;
      if (a(R, w)) {
        const I = S - 1, A = d[I] + 1, N = _[I] + Math.abs(t[w + 1][3] - i[R + 1][3]);
        m(A, N, T, O) && (T = A, O = N, D = 2);
      }
      d[E] = T, _[E] = O, B[E] = D;
    }
  let g = u, p = b;
  for (; g > 0 && p > 0; ) {
    const v = B[g * y + p];
    if (v === 2) {
      const M = c + g - 1 + 1, E = h + p - 1 + 1;
      n[M] = E, s[E] = M, g--, p--;
    } else v === 0 ? g-- : p--;
  }
  return { illstToMerc: n, mercToIllst: s };
}
function ti(i, t, e = Cn) {
  const n = Qr(i, t, e), s = [i, t].map((h) => {
    const f = h.map((b, y, d) => {
      if (y === 0) return 0;
      const _ = d[y - 1];
      return Math.sqrt(
        Math.pow(b[0] - _[0], 2) + Math.pow(b[1] - _[1], 2)
      );
    }), u = f.reduce((b, y, d) => d === 0 ? [0] : (b.push(b[d - 1] + y), b), []);
    return u.map((b, y, d) => {
      const _ = b / d[d.length - 1];
      return [h[y], f[y], u[y], _];
    });
  }), { illstToMerc: o, mercToIllst: r } = Zr(s[0], s[1], n), a = [o, r], c = (h, f) => {
    for (let u = 1; u < f.length - 1; u++)
      if (Math.abs(f[u][3] - h) <= n) return !0;
    return !1;
  }, l = [];
  return s.forEach((h, f) => {
    const u = s[f ? 0 : 1];
    h.forEach((b, y) => {
      if (y === 0 || y === h.length - 1) return;
      const d = b[0], _ = b[3], B = a[f][y];
      if (B >= 0) {
        f === 0 && l.push([d, u[B][0], _]);
        return;
      }
      if (!c(_, u))
        for (let m = 0; m < u.length - 1; m++) {
          const g = u[m], p = u[m + 1], v = g[3], M = p[3];
          if (v < _ && M > _) {
            const E = (_ - v) / (M - v), S = [
              (p[0][0] - g[0][0]) * E + g[0][0],
              (p[0][1] - g[0][1]) * E + g[0][1]
            ];
            l.push(
              f === 0 ? [d, S, _] : [S, d, _]
            );
            return;
          }
        }
    });
  }), l.sort((h, f) => h[2] - f[2]);
}
const wn = 1e-9;
function ei(i, t) {
  const e = [[], [], [], []], n = [];
  return Object.keys(i).forEach((s) => {
    const o = i[s], r = o.forw, a = o.bakw, c = [
      r[0] - t.forw[0],
      r[1] - t.forw[1]
    ], l = [
      a[0] - t.bakw[0],
      t.bakw[1] - a[1]
    ], h = { forw: c, bakw: l };
    if (n.push(h), c[0] === 0 || c[1] === 0)
      return;
    let f = 0;
    c[0] > 0 && (f += 1), c[1] > 0 && (f += 2), e[f].push(h);
  }), { perQuad: e, aggregate: n };
}
function Dn(i) {
  let t = 1 / 0, e = 0, n = 0;
  return i.forEach((s) => {
    const { forw: o, bakw: r } = s, a = Math.hypot(o[0], o[1]), c = Math.hypot(r[0], r[1]);
    if (c === 0) return;
    const l = a / c, h = Math.atan2(o[0], o[1]) - Math.atan2(r[0], r[1]);
    t = Math.min(t, l), e += Math.cos(h), n += Math.sin(h);
  }), isFinite(t) ? [t, Math.atan2(n, e)] : [1, 0];
}
const ni = 0.6, ri = 3, ii = 0.5;
function si(i) {
  let t = 0, e = 0, n = 0, s = 0;
  if (i.forEach(({ forw: r, bakw: a }) => {
    t += r[1] * a[1] + r[0] * a[0], e += r[0] * a[1] - r[1] * a[0], n += a[0] * a[0] + a[1] * a[1], s += r[0] * r[0] + r[1] * r[1];
  }), !(!(n > 0 && s > 0) || !(Math.hypot(t, e) / Math.sqrt(s * n) >= ii)))
    return [Math.hypot(t, e) / n, Math.atan2(e, t)];
}
function oi(i) {
  const t = (s) => Math.hypot(s.forw[0], s.forw[1]), e = Math.max(...i.map(t)), n = i.filter((s) => t(s) >= ni * e);
  return si(n.length >= ri ? n : i) ?? Dn(i);
}
function ai(i, t, e, n) {
  const { perQuad: s, aggregate: o } = ei(i, t), r = s.every((h) => h.length > 0), a = e === "birdeye" ? r ? s : [o] : [o], c = n === "farLsq" ? oi : Dn, l = a.map((h) => c(h));
  return l.length === 1 ? [l[0], l[0], l[0], l[0]] : l;
}
function ci(i, t) {
  let e = 0;
  return i[0] > t[0] && (e += 1), i[1] > t[1] && (e += 2), e;
}
function li(i, t, e) {
  const n = [
    i[0] - t.forw[0],
    i[1] - t.forw[1]
  ], o = Math.sqrt(n[0] ** 2 + n[1] ** 2) / e[0], r = Math.atan2(n[0], n[1]) - e[1];
  return [
    t.bakw[0] + o * Math.sin(r),
    t.bakw[1] - o * Math.cos(r)
  ];
}
function fi(i, t, e, n) {
  const s = t[0] - i[0], o = t[1] - i[1];
  if (Math.abs(s) < 1e-12 && Math.abs(o) < 1e-12) return null;
  const r = n[0] - e[0], a = n[1] - e[1], c = e[0] - i[0], l = e[1] - i[1], h = s * a - o * r;
  if (Math.abs(h) < 1e-12) return null;
  const f = (c * a - l * r) / h, u = (c * o - l * s) / h;
  return f <= 1e-10 || u < -1e-10 || u > 1 + 1e-10 ? null : { t: f, point: [i[0] + f * s, i[1] + f * o] };
}
function hi(i, t, e) {
  const n = e.length;
  let s = -1 / 0, o = null;
  for (let r = 0; r < n; r++) {
    const a = (r + 1) % n, c = fi(
      i,
      t,
      e[r].bakw,
      e[a].bakw
    );
    c && c.t > s && (s = c.t, o = c.point);
  }
  return o;
}
function yn(i, t) {
  const n = Math.atan2(i[0] - t[0], i[1] - t[1]) * (180 / Math.PI);
  return n < 0 ? n + 360 : n;
}
function vn(i, t, e, n, s, o) {
  const r = t[0] - i[0], a = t[1] - i[1];
  if (r === 0 && a === 0) return null;
  const c = [];
  if (r !== 0)
    for (const h of [e, n]) {
      const f = (h - i[0]) / r;
      if (f > 0) {
        const u = i[1] + f * a;
        u >= s && u <= o && c.push({ t: f, x: h, y: u });
      }
    }
  if (a !== 0)
    for (const h of [s, o]) {
      const f = (h - i[1]) / a;
      if (f > 0) {
        const u = i[0] + f * r;
        u >= e && u <= n && c.push({ t: f, x: u, y: h });
      }
    }
  if (c.length === 0) return null;
  c.sort((h, f) => h.t - f.t);
  const l = c[0];
  return [l.x, l.y];
}
function bn(i, t, e) {
  const n = i.length, s = new Array(n).fill(1);
  for (const o of t)
    for (let r = 0; r < n; r++) {
      const a = (r + 1) % n, c = Ve([i[r].bakw, i[a].bakw]), l = Ve([e.bakw, o.bakw]), h = xr(c, l);
      if (h.features.length > 0 && h.features[0].geometry) {
        const f = h.features[0], u = Math.sqrt(
          Math.pow(o.bakw[0] - e.bakw[0], 2) + Math.pow(o.bakw[1] - e.bakw[1], 2)
        ), b = Math.sqrt(
          Math.pow(f.geometry.coordinates[0] - e.bakw[0], 2) + Math.pow(f.geometry.coordinates[1] - e.bakw[1], 2)
        ), y = u / b;
        y > s[r] && (s[r] = y), y > s[a] && (s[a] = y);
      }
    }
  i.forEach((o, r) => {
    const a = s[r];
    o.bakw = [
      (o.bakw[0] - e.bakw[0]) * a + e.bakw[0],
      (o.bakw[1] - e.bakw[1]) * a + e.bakw[1]
    ];
  });
}
function Xe(i, t, e, n, s) {
  const { convexBuf: o, centroid: r, allGcps: a, minx: c, maxx: l, miny: h, maxy: f } = i, u = s ? void 0 : ai(o, r, t, n), y = [
    [c, h],
    [l, h],
    [l, f],
    [c, f]
  ].map((S) => ({
    forw: S,
    bakw: s ? s(S) : li(
      S,
      r,
      u[ci(S, r.forw)]
    )
  }));
  if (y.sort(
    (S, k) => Math.atan2(S.forw[0] - r.forw[0], S.forw[1] - r.forw[1]) - Math.atan2(k.forw[0] - r.forw[0], k.forw[1] - r.forw[1])
  ), s || bn(y, a, r), !e) return y;
  const d = 4, _ = y.map(
    (S) => Math.atan2(S.forw[0] - r.forw[0], S.forw[1] - r.forw[1])
  ), B = y.map(
    (S) => Math.atan2(
      S.bakw[0] - r.bakw[0],
      -(S.bakw[1] - r.bakw[1])
    )
  );
  function m(S) {
    for (let k = 0; k < d; k++) {
      const T = (k + 1) % d, O = _[k], D = k < d - 1 ? _[T] : _[T] + 2 * Math.PI;
      let R = S;
      for (; R < O; ) R += 2 * Math.PI;
      for (; R >= O + 2 * Math.PI; ) R -= 2 * Math.PI;
      if (R >= O && R < D)
        return { i: k, j: T, frac: (R - O) / (D - O) };
    }
    return { i: 0, j: 1, frac: 0 };
  }
  function g(S) {
    const { i: k, j: T, frac: O } = m(S), D = B[k];
    let w = B[T] - D;
    for (; w > Math.PI; ) w -= 2 * Math.PI;
    for (; w < -Math.PI; ) w += 2 * Math.PI;
    return D + O * w;
  }
  const p = new Set(
    y.map(
      (S) => Math.floor(yn(S.forw, r.forw) / 10) % 36
    )
  ), v = a.map((S) => ({
    forw: S.forw,
    bakw: S.bakw,
    angleDeg: yn(S.forw, r.forw),
    forwDist: Math.hypot(S.forw[0] - r.forw[0], S.forw[1] - r.forw[1])
  })), M = [];
  for (let S = 0; S < 36; S++) {
    if (p.has(S)) continue;
    const k = S * 10, T = v.filter((x) => {
      if (x.forwDist === 0) return !1;
      const F = ((x.angleDeg - k) % 360 + 360) % 360;
      return F < 10 + wn || F > 360 - wn;
    });
    let O = null;
    if (T.length > 0) {
      const x = T.reduce((F, $) => $.forwDist > F.forwDist ? $ : F);
      O = vn(r.forw, x.forw, c, l, h, f);
    }
    if (!O) {
      const x = (k + 5) % 360 * (Math.PI / 180), F = [
        r.forw[0] + Math.sin(x),
        r.forw[1] + Math.cos(x)
      ];
      O = vn(r.forw, F, c, l, h, f);
    }
    if (!O) continue;
    const [D, R] = O, w = 1e-9 * Math.max(l - c, f - h);
    if ([...y, ...M].some(
      (x) => Math.abs(x.forw[0] - D) <= w && Math.abs(x.forw[1] - R) <= w
    )) continue;
    if (s) {
      M.push({ forw: O, bakw: s(O) });
      continue;
    }
    const I = [O[0] - r.forw[0], O[1] - r.forw[1]], A = Math.atan2(I[0], I[1]), N = g(A), C = [
      r.bakw[0] + Math.sin(N),
      r.bakw[1] - Math.cos(N)
    ], P = hi(r.bakw, C, y);
    P && M.push({ forw: O, bakw: P });
  }
  const E = [...y, ...M];
  return E.sort(
    (S, k) => Math.atan2(S.forw[0] - r.forw[0], S.forw[1] - r.forw[1]) - Math.atan2(k.forw[0] - r.forw[0], k.forw[1] - r.forw[1])
  ), s || bn(E, a, r), E;
}
function ui(i, t = !1) {
  return Xe(i, "plain", t, t ? "farLsq" : "min");
}
function di(i, t = !1) {
  return Xe(i, "birdeye", t, "min");
}
function pi(i, t) {
  const e = /* @__PURE__ */ new Set();
  return Xe(i, "plain", !0, "min", t).filter(({ forw: [n, s] }) => {
    const o = `${n}:${s}`;
    return e.has(o) ? !1 : (e.add(o), !0);
  });
}
function Zi(i) {
  return Pn(i, 1 / 0);
}
const xn = 1e5, mi = 16;
function Pn(i, t) {
  return gi(i), new wi(i).findSegmentIntersections(t).map(
    (s) => Yt([s.x, s.y])
  );
}
function gi(i) {
  for (let t = 0, e = i.length; t < e; t++) {
    const n = i[t];
    ee(n) || Xt(
      "findIntersections() received invalid coordinates:",
      `line=${t}`,
      `points=${n}`
    );
    for (let s = 0, o = n.length; s < o; s++) {
      const r = n[s];
      (!ee(r) || !Number.isFinite(r[0]) || !Number.isFinite(r[1])) && Xt(
        "findIntersections() received non-finite coordinates:",
        `line=${t}`,
        `point=${s}`,
        `coordinates=${JSON.stringify(r)}`
      );
    }
  }
}
class wi {
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
    const e = [], n = [], s = t.map((o) => {
      const r = o ? o.length : 0;
      for (let a = 0; a < r; a++)
        e.push(o[a][0]), n.push(o[a][1]);
      return r;
    });
    this.initXYData(s, e, n);
  }
  initXYData(t, e, n) {
    const s = t.length;
    this._xx = new Float64Array(e), this._yy = new Float64Array(n), this._nn = new Uint32Array(t), this._zz = null, this._zlimit = 0, this._filteredArcIter = null, this._ii = new Uint32Array(s);
    let o = 0;
    for (let r = 0; r < s; r++)
      this._ii[r] = o, o += t[r];
    (o != this._xx.length || this._xx.length != this._yy.length) && Xt("ArcCollection#initXYData() Counting error"), this.initBounds(), this._arcIter = new $i(this._xx, this._yy);
  }
  initBounds() {
    const t = this.calcArcBounds_(this._xx, this._yy, this._nn);
    this._bb = t.bb, this._allBounds = t.bounds;
  }
  /**
   * データの境界を計算
   * @returns バウンディングボックス情報
   */
  calcArcBounds_(t, e, n) {
    const s = n.length, o = new Float64Array(s * 4), r = new ne();
    let a = 0, c, l, h;
    for (let f = 0; f < s; f++)
      c = n[f], c > 0 && (l = f * 4, h = Ri(t, e, a, c), o[l++] = h[0], o[l++] = h[1], o[l++] = h[2], o[l] = h[3], a += c, r.mergeBounds(h));
    return {
      bb: o,
      bounds: r
    };
  }
  getBounds() {
    return this._allBounds ? this._allBounds.clone() : new ne();
  }
  // @cb function(i, j, xx, yy)
  forEachSegment(t) {
    let e = 0;
    for (let n = 0, s = this.size(); n < s; n++)
      e += this.forEachArcSegment(n, t);
    return e;
  }
  size() {
    return this._ii && this._ii.length || 0;
  }
  // @cb function(i, j, xx, yy)
  forEachArcSegment(t, e) {
    const n = t >= 0, s = n ? t : ~t, o = this.getRetainedInterval(), r = this._nn[s], a = n ? 1 : -1;
    let c = n ? this._ii[s] : this._ii[s] + r - 1, l = c, h = 0;
    for (let f = 1; f < r; f++)
      l += a, (o === 0 || this._zz[l] >= o) && (e(c, l, this._xx, this._yy), c = l, h++);
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
    const e = t * 4;
    return (!this.buf || this.buf.byteLength < e) && (this.buf = new ArrayBuffer(e)), new Uint32Array(this.buf, 0, t);
  }
  // Return average magnitudes of dx, dy (with simplification)
  getAvgSegment2() {
    let t = 0, e = 0;
    const n = this.forEachSegment(
      (s, o, r, a) => {
        t += Math.abs(r[s] - r[o]), e += Math.abs(a[s] - a[o]);
      }
    );
    return [t / n || 0, e / n || 0];
  }
  /**
   * 交差判定のためのストライプ数を計算
   * 線分の平均長さに基づいて最適な分割数を決定
   */
  calcSegmentIntersectionStripeCount() {
    const t = this.getBounds().height(), e = this.getAvgSegment2()[1];
    let n = 1;
    return e > 0 && t > 0 && (n = Math.ceil(t / e / 20)), n || 1;
  }
  /**
   * 線分の交差を検出
   * ストライプ分割による効率的な判定を実装
   *
   * @param limit - 返す交差点の件数の上限（同じ位置の交差は 1 件に数える）
   * @returns 検出された交差点の配列（同じ位置の重複なし）
   */
  findSegmentIntersections(t = 1 / 0) {
    const e = this.getBounds(), n = e.ymin || 0, s = (e.ymax || 0) - n, o = this.calcSegmentIntersectionStripeCount(), r = new Uint32Array(o), a = o > 1 ? (g) => Math.floor((o - 1) * (g - n) / s) : () => 0, c = o + 1;
    let l;
    this.forEachSegment(
      (g, p, v, M) => {
        let E = a(M[g]);
        const S = a(M[p]);
        let k = 0;
        for (; r[E] = r[E] + 2, E != S; )
          k++, k > c && Xt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${o}`,
            `s1=${E}`,
            `s2=${S}`
          ), E += S > E ? 1 : -1;
      }
    );
    const h = this.getUint32Array(bi(r));
    let f = 0;
    const u = [];
    xi(r, (g) => {
      const p = f;
      f += g, u.push(h.subarray(p, f));
    }), Mi(r, 0), this.forEachSegment(
      (g, p, v, M) => {
        let E = a(M[g]);
        const S = a(M[p]);
        let k, T, O = 0;
        for (; k = r[E], r[E] = k + 2, T = u[E], T[k] = g, T[k + 1] = p, E != S; )
          O++, O > c && Xt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${o}`,
            `s1=${E}`,
            `s2=${S}`
          ), E += S > E ? 1 : -1;
      }
    );
    const b = this.getVertexData(), y = t * mi;
    let d = 0;
    const _ = /* @__PURE__ */ new Set(), B = /* @__PURE__ */ new Map(), m = (g) => {
      d++;
      const p = Pi(g);
      return _.has(p) || (_.add(p), B.set(`${g.x}:${g.y}`, g)), B.size >= t || d >= y;
    };
    if (b.xx && b.yy)
      for (l = 0; l < o && !_i(u[l], b.xx, b.yy, m); l++)
        ;
    return Array.from(B.values());
  }
}
function Xt(...i) {
  const t = i.join(" ");
  throw new Error(t);
}
function ee(i) {
  return i ? vi(i) ? !0 : yi(i) ? !1 : i.length === 0 ? !0 : i.length > 0 : !1;
}
function yi(i) {
  return i != null && i.toString === String.prototype.toString;
}
function vi(i) {
  return Array.isArray(i);
}
function bi(i, t) {
  ee(i) || Xt("utils.sum() expects an array, received:", i);
  let e = 0, n;
  for (let s = 0, o = i.length; s < o; s++)
    n = i[s], n && (e += n);
  return e;
}
function xi(i, t, e) {
  if (!ee(i))
    throw new Error(`#forEach() takes an array-like argument. ${i}`);
  for (let n = 0, s = i.length; n < s; n++)
    t.call(e, i[n], n);
}
function Mi(i, t) {
  for (let e = 0, n = i.length; e < n; e++)
    i[e] = t;
  return i;
}
function _i(i, t, e, n) {
  const s = i.length - 2;
  let o, r, a, c, l, h, f, u, b, y, d, _, B, m, g, p, v;
  for (Ni(t, i), p = 0; p < s; ) {
    for (o = i[p], r = i[p + 1], l = t[o], h = t[r], b = e[o], y = e[r], v = p; v < s && (v += 2, a = i[v], f = t[a], !(h < f)); ) {
      if (d = e[a], c = i[v + 1], u = t[c], _ = e[c], b >= d) {
        if (b > _ && y > d && y > _) continue;
      } else if (b < _ && y < d && y < _) continue;
      if (!(o == a || o == c || r == a || r == c) && (B = Si(
        l,
        b,
        h,
        y,
        f,
        d,
        u,
        _
      ), B && (m = [o, r], g = [a, c], n(_n(B, m, g, t, e)) || B.length == 4 && n(_n(B.slice(2), m, g, t, e)))))
        return !0;
    }
    p += 2;
  }
  return !1;
}
function Si(i, t, e, n, s, o, r, a) {
  const c = ki(i, t, e, n, s, o, r, a);
  let l = null;
  return c && (l = Ei(i, t, e, n, s, o, r, a), l ? Fi(i, t, e, n, s, o, r, a) && (l = null) : l = Oi(i, t, e, n, s, o, r, a)), l;
}
function ki(i, t, e, n, s, o, r, a) {
  return Jt(i, t, e, n, s, o) * Jt(i, t, e, n, r, a) <= 0 && Jt(s, o, r, a, i, t) * Jt(s, o, r, a, e, n) <= 0;
}
function Jt(i, t, e, n, s, o) {
  return $n(i - s, t - o, e - s, n - o);
}
function $n(i, t, e, n) {
  return i * n - t * e;
}
function Ei(i, t, e, n, s, o, r, a) {
  let c = pe(i, t, e, n, s, o, r, a), l;
  return c && (l = Ii(c[0], c[1], i, t, e, n, s, o, r, a), l == 1 ? c = pe(e, n, i, t, s, o, r, a) : l == 2 ? c = pe(s, o, r, a, i, t, e, n) : l == 3 && (c = pe(r, a, s, o, i, t, e, n))), c && Ti(c, i, t, e, n, s, o, r, a), c;
}
function pe(i, t, e, n, s, o, r, a) {
  const c = $n(e - i, n - t, r - s, a - o), l = 1e-18;
  let h;
  if (c === 0) return null;
  const f = Jt(s, o, r, a, i, t) / c;
  return c <= l && c >= -l ? h = Ai(i, t, e, n, s, o, r, a) : h = [i + f * (e - i), t + f * (n - t)], h;
}
function Ai(i, t, e, n, s, o, r, a) {
  let c = null;
  return !It(i, s, r) && !It(t, o, a) ? c = [i, t] : !It(e, s, r) && !It(n, o, a) ? c = [e, n] : !It(s, i, e) && !It(o, t, n) ? c = [s, o] : !It(r, i, e) && !It(a, t, n) && (c = [r, a]), c;
}
function It(i, t, e) {
  let n;
  return t < e ? n = i < t || i > e : t > e ? n = i > t || i < e : n = i != t, n;
}
function Ii(i, t, ...e) {
  let n = -1, s = 1 / 0, o;
  for (let r = 0, a = 0, c = e.length; a < c; r++, a += 2)
    o = Bi(i, t, e[a], e[a + 1]), o < s && (s = o, n = r);
  return n;
}
function Bi(i, t, e, n) {
  const s = i - e, o = t - n;
  return s * s + o * o;
}
function Ti(i, t, e, n, s, o, r, a, c) {
  let l = i[0], h = i[1];
  l = me(l, t, n), l = me(l, o, a), h = me(h, e, s), h = me(h, r, c), i[0] = l, i[1] = h;
}
function me(i, t, e) {
  let n;
  return It(i, t, e) && (n = Math.abs(i - t) < Math.abs(i - e) ? t : e, i = n), i;
}
function Oi(i, t, e, n, s, o, r, a) {
  const c = Math.min(i, e, s, r), l = Math.max(i, e, s, r), h = Math.min(t, n, o, a), f = Math.max(t, n, o, a), u = f - h > l - c;
  let b = [];
  return (u ? Dt(t, h, f) : Dt(i, c, l)) && b.push(i, t), (u ? Dt(n, h, f) : Dt(e, c, l)) && b.push(e, n), (u ? Dt(o, h, f) : Dt(s, c, l)) && b.push(s, o), (u ? Dt(a, h, f) : Dt(r, c, l)) && b.push(r, a), (b.length != 2 && b.length != 4 || b.length == 4 && b[0] == b[2] && b[1] == b[3]) && (b = null), b;
}
function Fi(i, t, e, n, s, o, r, a) {
  return i == s && t == o || i == r && t == a || e == s && n == o || e == r && n == a;
}
function Dt(i, t, e) {
  return i > t && i < e;
}
function Ni(i, t) {
  Ci(i, t), Rn(i, t, 0, t.length - 2);
}
function Ci(i, t) {
  for (let e = 0, n = t.length; e < n; e += 2)
    i[t[e]] > i[t[e + 1]] && Di(t, e, e + 1);
}
function Di(i, t, e) {
  const n = i[t];
  i[t] = i[e], i[e] = n;
}
function Rn(i, t, e, n) {
  let s = e, o = n, r, a;
  for (; s < n; ) {
    for (r = i[t[e + n >> 2 << 1]]; s <= o; ) {
      for (; i[t[s]] < r; ) s += 2;
      for (; i[t[o]] > r; ) o -= 2;
      s <= o && (a = t[s], t[s] = t[o], t[o] = a, a = t[s + 1], t[s + 1] = t[o + 1], t[o + 1] = a, s += 2, o -= 2);
    }
    if (o - e < 40 ? Mn(i, t, e, o) : Rn(i, t, e, o), n - s < 40) {
      Mn(i, t, s, n);
      return;
    }
    e = s, o = n;
  }
}
function Mn(i, t, e, n) {
  let s, o;
  for (let r = e + 2; r <= n; r += 2) {
    s = t[r], o = t[r + 1];
    let a;
    for (a = r - 2; a >= e && i[s] < i[t[a]]; a -= 2)
      t[a + 2] = t[a], t[a + 3] = t[a + 1];
    t[a + 2] = s, t[a + 3] = o;
  }
}
function _n(i, t, e, n, s) {
  const o = i[0], r = i[1];
  t = Sn(o, r, t[0], t[1], n, s), e = Sn(o, r, e[0], e[1], n, s);
  const a = t[0] < e[0] ? t : e, c = a == t ? e : t;
  return { x: o, y: r, a, b: c };
}
function Sn(i, t, e, n, s, o) {
  let r = e < n ? e : n, a = r === e ? n : e;
  return s[r] == i && o[r] == t ? a = r : s[a] == i && o[a] == t && (r = a), [r, a];
}
function Pi(i) {
  return `${i.a.join(",")};${i.b.join(",")}`;
}
class $i {
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
function Ri(i, t, e, n) {
  let s = e | 0;
  const o = isNaN(n) ? i.length - s : n + s;
  let r, a, c, l, h, f;
  if (o > 0)
    c = h = i[s], l = f = t[s];
  else return [void 0, void 0, void 0, void 0];
  for (s++; s < o; s++)
    r = i[s], a = t[s], r < c && (c = r), r > h && (h = r), a < l && (l = a), a > f && (f = a);
  return [c, l, h, f];
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
  setBounds(t, e, n, s) {
    let o, r, a, c;
    if (arguments.length == 1)
      if (ee(t)) {
        const l = t;
        o = l[0], r = l[1], a = l[2], c = l[3];
      } else {
        const l = t;
        o = l.xmin, r = l.ymin, a = l.xmax, c = l.ymax;
      }
    else
      o = t, r = e, a = n, c = s;
    return this.xmin = o, this.ymin = r, this.xmax = a, this.ymax = c, (o > a || r > c) && this.update(), this;
  }
  update() {
    let t;
    this.xmin > this.xmax && (t = this.xmin, this.xmin = this.xmax, this.xmax = t), this.ymin > this.ymax && (t = this.ymin, this.ymin = this.ymax, this.ymax = t);
  }
  mergeBounds(t, ...e) {
    let n, s, o, r;
    return t instanceof ne ? (n = t.xmin, s = t.ymin, o = t.xmax, r = t.ymax) : e.length == 3 ? (n = t, s = e[0], o = e[1], r = e[2]) : t.length == 4 ? (n = t[0], s = t[1], o = t[2], r = t[3]) : Xt("Bounds#mergeBounds() invalid argument:", t), this.xmin === void 0 ? this.setBounds(n, s, o, r) : (n < this.xmin && (this.xmin = n), s < this.ymin && (this.ymin = s), o > this.xmax && (this.xmax = o), r > this.ymax && (this.ymax = r)), this;
  }
}
function be(i) {
  const t = ["a", "b", "c"].map(
    (e) => i.properties[e].index
  );
  return [
    [0, 1],
    [0, 2],
    [1, 2],
    [0, 1, 2]
  ].map(
    (e) => e.map((n) => t[n]).sort().join("-")
  ).sort();
}
function Xn(i, t, e) {
  const n = be(t.forw), s = be(t.bakw);
  if (JSON.stringify(n) != JSON.stringify(s))
    throw `${JSON.stringify(t, null, 2)}
${JSON.stringify(
      n
    )}
${JSON.stringify(s)}`;
  for (let o = 0; o < n.length; o++) {
    const r = n[o];
    i[r] || (i[r] = []), i[r].push(t);
  }
  e && (e.forw.features.push(t.forw), e.bakw.features.push(t.bakw));
}
function kn(i, t, e) {
  const n = be(t.forw), s = be(t.bakw);
  if (JSON.stringify(n) != JSON.stringify(s))
    throw `${JSON.stringify(t, null, 2)}
${JSON.stringify(n)}
${JSON.stringify(s)}`;
  if (n.forEach((o) => {
    const r = i[o];
    if (!r) return;
    const a = r.filter((c) => c !== t);
    a.length === 0 ? delete i[o] : i[o] = a;
  }), e) {
    const o = (r, a) => {
      !r || !a || (r.features = r.features.filter((c) => c !== a));
    };
    o(e.forw, t.forw), o(e.bakw, t.bakw);
  }
}
function ge(i, t = 1e-6) {
  const [e, n] = i[0], [s, o] = i[1], [r, a] = i[2];
  return Math.abs((s - e) * (a - n) - (r - e) * (o - n)) < t;
}
function Xi(i, t) {
  const e = /* @__PURE__ */ new Set();
  return i.forEach((n) => {
    if (n.length !== 2) return;
    const s = n.map((o) => `${t?.[o] ?? o}`);
    e.add(s.sort().join("-"));
  }), e;
}
function Qt(i) {
  return ["a", "b", "c"].map((t, e) => ({
    prop: i.properties[t],
    geom: i.geometry.coordinates[0][e]
  }));
}
const Yi = 10;
function Li(i, t, e, n, s, o) {
  if (!i && !t) return !1;
  const r = i ? 0 : 1, a = 1 - r, c = e[r], l = e[a];
  if (!c || !l) return !1;
  const h = bt(l.geom);
  let f = !1, u = !1;
  for (let b = 0; b <= 1; b++) {
    const y = n[b];
    if (!y) continue;
    const d = [String(y.prop.index), String(c.prop.index)].sort().join("-"), _ = s[d];
    if (!_ || _.length < 2) continue;
    const B = _.find(
      (O) => O.bakw !== o[r].bakw
    );
    if (!B) continue;
    const g = Qt(B.bakw).find(
      (O) => String(O.prop.index) !== String(y.prop.index) && String(O.prop.index) !== String(c.prop.index)
    );
    if (!g) continue;
    f = !0;
    const p = bt(g.geom), v = bt(y.geom), M = bt(c.geom), E = M[0] - v[0], S = M[1] - v[1], k = E * (h[1] - v[1]) - S * (h[0] - v[0]), T = E * (p[1] - v[1]) - S * (p[0] - v[0]);
    if (k * T > 0) {
      u = !0;
      break;
    }
  }
  return f && !u;
}
function qi(i, t, e, n) {
  if (!i && !t) return !1;
  if (e[0] && e[1] && n[0] && n[1]) {
    const s = n.map((h) => bt(h.geom)), o = e.map((h) => bt(h.geom)), r = s[1][0] - s[0][0], a = s[1][1] - s[0][1], c = r * (o[0][1] - s[0][1]) - a * (o[0][0] - s[0][0]), l = r * (o[1][1] - s[0][1]) - a * (o[1][0] - s[0][0]);
    return c * l < 0;
  }
  return !1;
}
function Vi(i, t, e, n) {
  const s = Xi(e, n), o = /* @__PURE__ */ new Set();
  let r = !1;
  for (let a = 0; a < Yi; a++) {
    let c = !1;
    for (const l of Object.keys(t)) {
      if (o.has(l)) continue;
      o.add(l);
      const h = t[l];
      if (!h || h.length < 2) continue;
      const f = l.split("-");
      if (f.length !== 2 || s.has(l)) continue;
      const u = Qt(h[0].bakw), b = Qt(h[1].bakw), y = Qt(h[0].forw), d = Qt(h[1].forw), _ = f.map(
        (x) => u.find((F) => `${F.prop.index}` === x) || b.find((F) => `${F.prop.index}` === x)
      ), B = f.map(
        (x) => y.find((F) => `${F.prop.index}` === x) || d.find((F) => `${F.prop.index}` === x)
      );
      if (_.some((x) => !x) || B.some((x) => !x))
        continue;
      const m = [u, b].map(
        (x) => x.find((F) => !f.includes(`${F.prop.index}`))
      ), g = [y, d].map(
        (x) => x.find((F) => !f.includes(`${F.prop.index}`))
      );
      if (m.some((x) => !x) || g.some((x) => !x))
        continue;
      const p = h[0].bakw.geometry.coordinates[0].slice(0, 3).map((x) => bt(x)), v = h[1].bakw.geometry.coordinates[0].slice(0, 3).map((x) => bt(x)), M = h[0].forw.geometry.coordinates[0].slice(0, 3).map((x) => bt(x)), E = h[1].forw.geometry.coordinates[0].slice(0, 3).map((x) => bt(x)), S = ge(p), k = ge(v), T = ge(M), O = ge(E), D = Li(
        S,
        k,
        m,
        _,
        t,
        h
      ), R = qi(
        T,
        O,
        m,
        _
      );
      if (!(D || R || En(
        bt(m[0].geom),
        v
      ) || En(
        bt(m[1].geom),
        p
      )))
        continue;
      const I = B.map(
        (x) => bt(x.geom)
      ), A = g.map(
        (x) => bt(x.geom)
      ), N = ji([
        ...I,
        ...A
      ]), C = Ui(N), P = An(
        I[0],
        I[1],
        A[0]
      ) + An(
        I[0],
        I[1],
        A[1]
      );
      De(C, P) && (kn(t, h[0], i), kn(t, h[1], i), _.forEach((x) => {
        if (!x) return;
        const F = [
          x.geom,
          m[0].geom,
          m[1].geom,
          x.geom
        ], $ = {
          a: x.prop,
          b: m[0].prop,
          c: m[1].prop
        }, X = re([F], $), q = Tn(X);
        Xn(t, {
          forw: q,
          bakw: X
        }, i);
      }), c = !0, r = !0);
    }
    if (!c) break;
  }
  return r;
}
function bt(i) {
  return [i[0], i[1]];
}
function En(i, t) {
  const [e, n] = t[0], [s, o] = t[1], [r, a] = t[2], c = r - e, l = a - n, h = s - e, f = o - n, u = i[0] - e, b = i[1] - n, y = c * c + l * l, d = c * h + l * f, _ = c * u + l * b, B = h * h + f * f, m = h * u + f * b, g = y * B - d * d;
  if (g === 0) return !1;
  const p = 1 / g, v = (B * _ - d * m) * p, M = (y * m - d * _) * p, E = 1e-9;
  return v >= -E && M >= -E && v + M <= 1 + E;
}
function ji(i) {
  const t = i.map((r) => r.slice()).filter(
    (r, a, c) => c.findIndex(
      (l) => De(l[0], r[0]) && De(l[1], r[1])
    ) === a
  );
  if (t.length <= 1) return t;
  const e = t.sort(
    (r, a) => r[0] === a[0] ? r[1] - a[1] : r[0] - a[0]
  ), n = (r, a, c) => (a[0] - r[0]) * (c[1] - r[1]) - (a[1] - r[1]) * (c[0] - r[0]), s = [];
  for (const r of e) {
    for (; s.length >= 2 && n(
      s[s.length - 2],
      s[s.length - 1],
      r
    ) <= 0; )
      s.pop();
    s.push(r);
  }
  const o = [];
  for (let r = e.length - 1; r >= 0; r--) {
    const a = e[r];
    for (; o.length >= 2 && n(
      o[o.length - 2],
      o[o.length - 1],
      a
    ) <= 0; )
      o.pop();
    o.push(a);
  }
  return o.pop(), s.pop(), s.concat(o);
}
function Ui(i) {
  if (i.length < 3) return 0;
  let t = 0;
  for (let e = 0; e < i.length; e++) {
    const [n, s] = i[e], [o, r] = i[(e + 1) % i.length];
    t += n * r - o * s;
  }
  return Math.abs(t) / 2;
}
function An(i, t, e) {
  return Math.abs(
    (i[0] * (t[1] - e[1]) + t[0] * (e[1] - i[1]) + e[0] * (i[1] - t[1])) / 2
  );
}
function De(i, t, e = 1e-9) {
  return Math.abs(i - t) <= e;
}
const zi = (i) => typeof i == "string" && i.startsWith("b");
function Hi(i, t) {
  const e = (n, s) => {
    for (let o = 0; o < 3; o++) {
      const r = n.g[o], a = n.g[(o + 1) % 3];
      if (s.g.every((c) => n.sign * dt(r[0], r[1], a[0], a[1], c[0], c[1]) <= 0)) return !0;
    }
    return !1;
  };
  return !e(i, t) && !e(t, i);
}
function Gi(i, t, e) {
  if (t.length === 0) return [];
  const n = i.features.map((d) => {
    const { a: _, b: B, c: m } = d.properties, g = [_.geom, B.geom, m.geom], [p, v, M] = d.geometry.coordinates[0], E = g.map(([O]) => O), S = g.map(([, O]) => O), k = Math.sign(dt(p[0], p[1], v[0], v[1], M[0], M[1])), T = Math.sign(dt(g[0][0], g[0][1], g[1][0], g[1][1], g[2][0], g[2][1]));
    return {
      ids: [_.index, B.index, m.index].map(String),
      g,
      sign: T,
      ratio: k * T,
      aux: [_.index, B.index, m.index].some(zi),
      minx: Math.min(...E),
      maxx: Math.max(...E),
      miny: Math.min(...S),
      maxy: Math.max(...S)
    };
  }), s = n.map((d) => d.ratio), o = s.reduce((d, _) => d + _, 0) < 0 ? -1 : 1, r = (d, _) => d < _ ? `${d}|${_}` : `${_}|${d}`, a = /* @__PURE__ */ new Map();
  n.forEach((d, _) => {
    for (let B = 0; B < 3; B++) {
      const m = r(d.ids[B], d.ids[(B + 1) % 3]), g = a.get(m);
      g ? g.push(_) : a.set(m, [_]);
    }
  });
  const c = ([d, _]) => r(String(e[d]), String(e[_])), l = /* @__PURE__ */ new Set();
  for (const d of t) for (const _ of a.get(c(d)) ?? []) l.add(_);
  const h = (d) => n[d].aux || l.has(d), f = /* @__PURE__ */ new Set();
  n.forEach((d, _) => {
    h(_) && (s[_] === 0 || s[_] !== o) && f.add(_);
  });
  const u = n.map((d, _) => _).sort((d, _) => n[d].minx - n[_].minx);
  for (let d = 0; d < u.length; d++) {
    const _ = n[u[d]];
    if (_.sign !== 0)
      for (let B = d + 1; B < u.length; B++) {
        const m = n[u[B]];
        if (m.minx >= _.maxx) break;
        m.sign === 0 || m.miny >= _.maxy || _.miny >= m.maxy || !h(u[d]) && !h(u[B]) || Hi(_, m) && (f.add(u[d]), f.add(u[B]));
      }
  }
  if (f.size === 0) return [];
  const b = t.filter((d) => (a.get(c(d)) ?? []).some((_) => f.has(_)));
  if (b.length > 0) return b;
  const y = /* @__PURE__ */ new Set();
  for (const d of f) for (const _ of n[d].ids) _.startsWith("b") || y.add(_);
  return t.filter(
    ([d, _]) => y.has(String(e[d])) || y.has(String(e[_]))
  );
}
const In = 2.00704, Bn = 3.00001, Ki = 12, Wi = 24;
class ot extends jn {
  importance;
  priority;
  pointsSet;
  useV2Algorithm;
  lastBoundaryDiagnostics;
  requestedWorldFile;
  compiledOuter;
  /** 現在の三角網を V3 で生成したときの外周の診断。 */
  get boundaryDiagnostics() {
    return this.tins && !this.useV2Algorithm ? this.lastBoundaryDiagnostics : void 0;
  }
  /**
   * Tinクラスのインスタンスを生成します
   * @param options - 初期化オプション
   */
  constructor(t = {}) {
    if (super(), t.bounds ? this.setBounds(t.bounds) : (this.setWh(t.wh), this.vertexMode = t.vertexMode || ot.VERTEX_PLAIN), this.strictMode = t.strictMode || ot.MODE_AUTO, this.yaxisMode = t.yaxisMode || ot.YAXIS_INVERT, this.importance = t.importance || 0, this.priority = t.priority || 0, this.stateFull = t.stateFull || !1, this.useV2Algorithm = t.useV2Algorithm ?? !1, t.outerTransform === "worldFile") {
      if (this.useV2Algorithm) throw new Error("V2 では world file 外周を使えません");
      if (!t.worldFile) throw new Error("worldFile が必要です");
      Un(t.worldFile), this.requestedWorldFile = { ...t.worldFile };
    }
    t.points && this.setPoints(t.points), t.edges && this.setEdges(t.edges);
  }
  /**
   * フォーマットバージョンを取得します
   */
  getFormatVersion() {
    return this.useV2Algorithm ? In : Bn;
  }
  /**
   * 制御点（GCP: Ground Control Points）を設定します。
   * 指定した点群に合わせて内部のTINキャッシュをリセットします。
   */
  setPoints(t) {
    this.yaxisMode === ot.YAXIS_FOLLOW && (t = t.map((e) => [
      e[0],
      [e[1][0], -1 * e[1][1]]
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
    let e = t[0][0], n = e, s = t[0][1], o = s;
    const r = [t[0]];
    for (let a = 1; a < t.length; a++) {
      const c = t[a];
      c[0] < e && (e = c[0]), c[0] > n && (n = c[0]), c[1] < s && (s = c[1]), c[1] > o && (o = c[1]), r.push(c);
    }
    r.push(t[0]), this.boundsPolygon = re([r]), this.xy = [e, s], this.wh = [n - e, o - s], this.vertexMode = ot.VERTEX_PLAIN, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 現在の設定を永続化可能な形式にコンパイルします
   */
  getCompiled() {
    const t = {};
    if (t.version = this.useV2Algorithm ? In : Bn, t.points = this.points, t.weight_buffer = {}, this.compiledOuter?.outerTransform === "worldFile")
      Object.assign(t, this.compiledOuter);
    else {
      t.centroid_point = [
        this.centroid.forw.geometry.coordinates,
        this.centroid.forw.properties.target.geom
      ], t.vertices_params = [
        this.vertices_params.forw[0],
        this.vertices_params.bakw[0]
      ], t.vertices_points = [];
      const e = this.vertices_params.forw[1];
      if (e)
        for (let n = 0; n < e.length; n++) {
          const s = e[n].features[0], o = s.geometry.coordinates[0][1], r = s.properties.b.geom;
          t.vertices_points[n] = [o, r];
        }
    }
    return t.strict_status = this.strict_status, t.tins_points = [[]], this.tins.forw.features.map((e) => {
      t.tins_points[0].push(
        ["a", "b", "c"].map(
          (n) => e.properties[n].index
        )
      );
    }), this.strict_status === ot.STATUS_LOOSE ? (t.tins_points[1] = [], this.tins.bakw.features.map((e) => {
      t.tins_points[1].push(
        ["a", "b", "c"].map(
          (n) => e.properties[n].index
        )
      );
    })) : this.strict_status === ot.STATUS_ERROR && this.kinks?.bakw && (t.kinks_points = this.kinks.bakw.features.map(
      (e) => e.geometry.coordinates
    )), t.yaxisMode = this.yaxisMode, t.vertexMode = this.vertexMode, t.strictMode = this.strictMode, this.bounds ? (t.bounds = this.bounds, t.boundsPolygon = this.boundsPolygon, this.useV2Algorithm && (t.xy = this.xy, t.wh = this.wh)) : t.wh = this.wh, t.edges = this.edges ?? [], t.edgeNodes = this.edgeNodes ?? [], this.compiledOuter?.outerTransform === "extrapolate" && Object.assign(t, this.compiledOuter), t;
  }
  /** コンパイルされた設定を基底クラスで復元し、外周方式を次の生成にも引き継ぐ。 */
  setCompiled(t) {
    const e = "outerTransform" in t ? t : void 0;
    if (e?.outerTransform === "worldFile" && this.useV2Algorithm)
      throw new Error("V2 では world file 外周を使えません");
    const n = this.outerTransform === "worldFile" || e?.outerTransform === "worldFile";
    super.setCompiled(t), n && (this.stateTriangle = void 0), this.requestedWorldFile = void 0, this.compiledOuter = void 0, e?.outerTransform === "worldFile" ? (this.requestedWorldFile = { ...e.worldFile }, this.compiledOuter = {
      outerTransform: "worldFile",
      worldFile: e.worldFile,
      vertices_points: e.vertices_points
    }) : e?.outerTransform === "extrapolate" && (this.compiledOuter = { outerTransform: "extrapolate" }), this.lastBoundaryDiagnostics = void 0;
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
  calculateStrictTin(t = xn) {
    const e = this.tins.forw.features.map(
      (r) => Tn(r)
    );
    this.tins.bakw = xt(e);
    const n = {};
    this.tins.forw.features.forEach((r, a) => {
      const c = this.tins.bakw.features[a];
      Xn(n, { forw: r, bakw: c });
    });
    const s = (this.pointsSet?.forw.features ?? []).map(
      (r) => r.properties.target.index
    );
    Vi(
      this.tins,
      n,
      this.pointsSet?.edges || [],
      s
    );
    const o = ["forw", "bakw"].map((r) => {
      const a = this.tins[r].features.map(
        (c) => c.geometry.coordinates[0]
      );
      return Pn(a, t);
    });
    o[0].length === 0 && o[1].length === 0 ? (this.strict_status = ot.STATUS_STRICT, delete this.kinks) : (this.strict_status = ot.STATUS_ERROR, this.kinks = {
      forw: xt(o[0]),
      bakw: xt(o[1])
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
    for (let s = 0; s < this.points.length; s++) {
      const o = this.points[s][0], r = this.points[s][1], a = Kt(o, r, s);
      t.forw.push(a), t.bakw.push(Wt(a));
    }
    const e = [];
    let n = 0;
    this.edgeNodes = [], this.edges || (this.edges = []);
    for (let s = 0; s < this.edges.length; s++) {
      const o = this.edges[s][2], r = Object.assign([], this.edges[s][0]), a = Object.assign([], this.edges[s][1]);
      if (Ji(o, this.points.length, s), r.length === 0 && a.length === 0) {
        e.push(o);
        continue;
      }
      r.unshift(this.points[o[0]][0]), r.push(this.points[o[1]][0]), a.unshift(this.points[o[0]][1]), a.push(this.points[o[1]][1]), ti(r, a).map((c, l, h) => {
        this.edgeNodes[n] = [
          c[0],
          c[1]
        ];
        const f = Kt(
          c[0],
          c[1],
          `e${n}`
        );
        n++, t.forw.push(f), t.bakw.push(Wt(f)), l === 0 ? e.push([o[0], t.forw.length - 1]) : e.push([
          t.forw.length - 2,
          t.forw.length - 1
        ]), l === h.length - 1 && e.push([t.forw.length - 1, o[1]]);
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
    const t = this.xy[0] - 0.05 * this.wh[0], e = this.xy[0] + 1.05 * this.wh[0], n = this.xy[1] - 0.05 * this.wh[1], s = this.xy[1] + 1.05 * this.wh[1];
    if (this.bounds && !this.boundsPolygon) throw new Error("Internal error: bounds is set but boundsPolygon is missing");
    const o = this.bounds ? this.boundsPolygon : void 0;
    if (!this.points.reduce((c, l) => c && (o ? Ge(l[0], o) : l[0][0] >= t && l[0][0] <= e && l[0][1] >= n && l[0][1] <= s), !0))
      throw "SOME POINTS OUTSIDE";
    let a = [];
    return this.wh && (a = [[t, n], [e, n], [t, s], [e, s]]), {
      pointsSet: this.generatePointsSet(),
      bbox: a,
      minx: t,
      maxx: e,
      miny: n,
      maxy: s
    };
  }
  /** 余白を加える前の GCP の外接矩形を求める。 */
  computeGcpBbox() {
    let t = 1 / 0, e = -1 / 0, n = 1 / 0, s = -1 / 0;
    for (const o of this.points) {
      const r = o[0][0], a = o[0][1];
      r < t && (t = r), r > e && (e = r), a < n && (n = a), a > s && (s = a);
    }
    return { minx: t, maxx: e, miny: n, maxy: s };
  }
  /**
   * TINネットワークを同期的に更新し、座標変換の準備を行います。
   * 重めの計算を伴うため、呼び出し側が非同期制御を行いたい場合は
   * {@link updateTinAsync} を利用してください。
   */
  updateTin() {
    this.lastBoundaryDiagnostics = void 0;
    let t = this.strictMode;
    t !== ot.MODE_STRICT && t !== ot.MODE_LOOSE && (t = ot.MODE_AUTO);
    const e = !this.useV2Algorithm, n = this.requestedWorldFile;
    if (n && !e) throw new Error("V2 では world file 外周を使えません");
    let s, o, r, a, c;
    if (e) {
      if (this.bounds) {
        const T = this.boundsPolygon;
        if (!T) throw new Error("Internal error: bounds is set but boundsPolygon is missing");
        if (!this.points.every(
          (D) => Ge(D[0], T)
        )) throw "SOME POINTS OUTSIDE";
      }
      s = this.generatePointsSet(), { minx: o, maxx: r, miny: a, maxy: c } = this.computeGcpBbox();
    } else {
      const T = this.validateAndPrepareInputs();
      s = T.pointsSet, o = T.minx, r = T.maxx, a = T.miny, c = T.maxy;
    }
    const l = {
      forw: xt(s.forw),
      bakw: xt(s.bakw)
    }, h = de(
      l.forw,
      s.edges,
      "target"
    ), f = de(
      l.bakw,
      s.edges,
      "target"
    );
    if (h.features.length === 0 || f.features.length === 0)
      throw "TOO LINEAR1";
    const u = Sr(l.forw), b = cn(l.forw);
    if (!b) throw "TOO LINEAR2";
    const y = {}, d = b.geometry.coordinates[0];
    let _;
    try {
      _ = d.map((T) => ({
        forw: T,
        bakw: Me(Yt(T), h)
      })), _.forEach((T) => {
        y[`${T.forw[0]}:${T.forw[1]}`] = T;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const B = cn(l.bakw);
    if (!B) throw "TOO LINEAR2";
    const m = B.geometry.coordinates[0];
    try {
      _ = m.map((T) => ({
        bakw: T,
        forw: Me(Yt(T), f)
      })), _.forEach((T) => {
        y[`${T.forw[0]}:${T.forw[1]}`] = T;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const g = {
      forw: u.geometry.coordinates,
      bakw: Me(u, h)
    }, p = Kt(g.forw, g.bakw, "c");
    this.centroid = {
      forw: p,
      bakw: Wt(p)
    };
    const v = [
      ...this.points.map((T) => ({ forw: T[0], bakw: T[1] })),
      ...(this.edgeNodes ?? []).map((T) => ({ forw: T[0], bakw: T[1] }))
    ], M = {
      convexBuf: y,
      centroid: g,
      allGcps: v,
      minx: o,
      maxx: r,
      miny: a,
      maxy: c
    };
    if (n) {
      this.stateTriangle = void 0;
      const T = this.yaxisMode === ot.YAXIS_FOLLOW, O = T ? 1 : -1, D = /* @__PURE__ */ new Map(), { boundary: R } = this.buildWithHull(t, (w) => ({ boundary: gn(
        M,
        (I) => pi(I, (A) => {
          const [N, C] = Hn(n, A);
          return [N, T ? -C : C];
        }),
        s,
        this.points.length,
        {
          orientation: O,
          accept: (I) => I.hasMapBoundary ? (this.buildTin(s, I.vertices, t, I, w.size > 0), (this.strict_status !== ot.STATUS_LOOSE || I.hasBoundary) && ve(this.tins.forw, O) === 0 && ve(this.tins.bakw, O) === 0) : !1
        },
        w,
        D
      ) }));
      if (R) {
        this.compiledOuter = {
          outerTransform: "worldFile",
          worldFile: n,
          vertices_points: R.vertices.map(({ forw: C, bakw: P }) => [C, P])
        };
        const { centroid: w, xy: I, wh: A, kinks: N } = this;
        super.setCompiled(this.getCompiled()), Object.assign(this, { centroid: w, xy: I, wh: A, kinks: N }), this.lastBoundaryDiagnostics = {
          ...R.diagnostics,
          requestedOuterTransform: "worldFile",
          outerTransform: "worldFile"
        };
        return;
      }
      this.compiledOuter = { outerTransform: "extrapolate" }, this.outerTransform = "extrapolate", this.worldFile = void 0;
    }
    const E = this.vertexMode === ot.VERTEX_BIRDEYE ? di : ui;
    let S, k;
    if (e) {
      const T = /* @__PURE__ */ new Map();
      ({ boundary: S, verticesList: k } = this.buildWithHull(t, (O) => {
        const D = gn(
          M,
          E,
          s,
          this.points.length,
          void 0,
          O,
          T
        );
        return {
          boundary: D,
          verticesList: this.buildTin(
            s,
            D?.vertices ?? E(M, !1),
            t,
            D,
            O.size > 0
          )
        };
      }));
    } else
      k = this.buildTin(
        s,
        E(M, !1),
        t,
        void 0
      );
    this.vertices_params = {
      forw: dn(k.forw, this.centroid.forw),
      bakw: dn(k.bakw, this.centroid.bakw)
    }, this.addIndexedTin(), this.pointsWeightBuffer = {}, this.lastBoundaryDiagnostics = S?.diagnostics, n && this.lastBoundaryDiagnostics && (this.lastBoundaryDiagnostics = {
      ...this.lastBoundaryDiagnostics,
      requestedOuterTransform: "worldFile",
      outerTransform: "extrapolate",
      fallbackReason: "boundaryFlips"
    });
  }
  /**
   * 凸包の辺を全部制約にして三角網を組み、strict を壊したときは、壊した原因の凸包の辺だけを外して
   * 組み直す。strict に戻るか、外す辺が無くなるまで繰り返し（strict を壊さない範囲で、なるべく多くの
   * 凸包の辺を制約にする）、戻ったら、外した辺を 1 本ずつ制約に戻して strict を保てるか試す。
   *
   * strict に戻らないときは、外して得るものが無いので、凸包の辺を全部制約にした最初の三角網を採る。
   * 凸包の辺を全部外した三角網が strict になるときだけは、そちらを採る。
   *
   * 返す結果と `this` の状態（三角網・点群・strict の判定・交差）は、必ず同じ試行から来る。試行の結果は
   * 控えておき、採用する試行の状態を戻す（失敗した試行の状態を残さない）。同じ外す指定の試行は
   * 繰り返さない。strict でも auto でもない（loose の）ときは組み直さない。
   *
   * 外す辺がある試行（最初の試行以外）は、strict になるかどうかだけが要る（採用されるのは、交差が無い
   * strict の試行か、最初の試行だけ）ので、交差の数え上げは 1 件で止める（`buildTin` の onlyDetectKinks）。
   *
   * @param attempt 外す辺の鍵を受け取り、外周を探して `this.tins` などを組み、探索の結果を返す
   */
  buildWithHull(t, e) {
    const n = /* @__PURE__ */ new Map();
    let s;
    const o = (d) => [...d].sort().join(","), r = (d, _ = !1) => {
      const B = o(d), m = n.get(B);
      if (m) return m;
      const g = e(d), p = {
        value: g,
        strict: g.boundary !== void 0 && this.strict_status === ot.STATUS_STRICT
      };
      return (p.strict || _) && (p.state = this.captureBuild()), n.set(B, p), s = p, p;
    }, a = (d) => (s !== d && this.restoreBuild(d.state), s = d, d.value), c = r(/* @__PURE__ */ new Set(), !0);
    if (!(t === ot.MODE_STRICT || t === ot.MODE_AUTO) || !c.value.boundary || c.strict) return c.value;
    const h = new Set(c.value.boundary.forwHull.all.map(ye)), f = () => this.pointsSet.forw.features.map(
      (d) => d.properties.target.index
    ), u = /* @__PURE__ */ new Set();
    let b = c, y;
    for (let d = 0; d < Ki; d++) {
      const _ = Gi(
        this.tins.forw,
        b.value.boundary.forwHull.applied,
        f()
      ).filter((B) => !u.has(ye(B)));
      if (_.length === 0) break;
      for (const B of _) u.add(ye(B));
      if (b = r(u), !b.value.boundary) break;
      if (b.strict) {
        y = b;
        break;
      }
    }
    if (y) {
      let d = y;
      for (const _ of [...u].slice(0, Wi)) {
        const B = new Set(u);
        B.delete(_);
        const m = r(B);
        m.strict && (u.delete(_), d = m);
      }
      return a(d);
    }
    if (u.size < h.size) {
      const d = r(h);
      if (d.strict) return a(d);
    }
    return a(c);
  }
  /** 三角網を組んだ結果の状態（試行ごとに控え、採用する試行の状態に戻す）。 */
  captureBuild() {
    return {
      tins: this.tins,
      pointsSet: this.pointsSet,
      strict_status: this.strict_status,
      kinks: this.kinks
    };
  }
  restoreBuild(t) {
    this.tins = t.tins, this.pointsSet = t.pointsSet, this.strict_status = t.strict_status, t.kinks ? this.kinks = t.kinks : delete this.kinks;
  }
  /** 補助頂点を含め、strictMode に従って実際に使う両方向の三角網を組む。 */
  buildTin(t, e, n, s, o = !1) {
    const r = {
      forw: [],
      bakw: []
    };
    for (let a = 0; a < e.length; a++) {
      const c = e[a].forw, l = e[a].bakw, h = Kt(c, l, `b${a}`), f = Wt(h);
      r.forw.push(h), r.bakw.push(f);
    }
    return this.pointsSet = {
      forw: xt([...t.forw, ...r.forw]),
      bakw: xt([...t.bakw, ...r.bakw]),
      edges: t.edges
    }, this.tins = {
      forw: qe(
        s?.forw ?? de(this.pointsSet.forw, t.edges, "target")
      )
    }, (n === ot.MODE_STRICT || n === ot.MODE_AUTO) && this.calculateStrictTin(
      n === ot.MODE_AUTO || o ? 1 : xn
    ), (n === ot.MODE_LOOSE || n === ot.MODE_AUTO && this.strict_status === ot.STATUS_ERROR) && (this.tins.bakw = qe(
      s?.bakw ?? de(this.pointsSet.bakw, t.edges, "target")
    ), delete this.kinks, this.strict_status = ot.STATUS_LOOSE), r;
  }
  /**
   * 非同期ラッパーを提供します。
   * 互換性のために Promise ベースの API を維持しますが、内部処理は同期的です。
   */
  async updateTinAsync() {
    this.updateTin();
  }
}
function Ji(i, t, e) {
  const n = (s) => Number.isInteger(s) && s >= 0 && s < t;
  if (!Array.isArray(i) || !n(i[0]) || !n(i[1]))
    throw new Error(
      `Invalid edge at edges[${e}]: start/end ${JSON.stringify(i)} must be integer indices of points (0 to ${t - 1})`
    );
}
export {
  ot as Tin,
  de as constrainedTin,
  Wt as counterPoint,
  Kt as createPoint,
  ot as default,
  Zi as findIntersections,
  In as format_version,
  Xn as insertSearchIndex,
  dn as vertexCalc
};
