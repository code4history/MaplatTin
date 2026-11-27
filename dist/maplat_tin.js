import { counterTri as Qn, Transform as ys, validateWorldFile as bs, normalizeEdges as xs, transformArr as Oe, rotateVerticesTriangle as nn, worldFileToCrs as Ss } from "@maplat/transform";
function re(i, t, e = {}) {
  const n = { type: "Feature" };
  return (e.id === 0 || e.id) && (n.id = e.id), e.bbox && (n.bbox = e.bbox), n.properties = t || {}, n.geometry = i, n;
}
function zt(i, t, e = {}) {
  if (!i)
    throw new Error("coordinates is required");
  if (!Array.isArray(i))
    throw new Error("coordinates must be an Array");
  if (i.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!rn(i[0]) || !rn(i[1]))
    throw new Error("coordinates must contain numbers");
  return re({
    type: "Point",
    coordinates: i
  }, t, e);
}
function ae(i, t, e = {}) {
  for (const r of i) {
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
  return re({
    type: "Polygon",
    coordinates: i
  }, t, e);
}
function sn(i, t, e = {}) {
  if (i.length < 2)
    throw new Error("coordinates must be an array of two or more positions");
  return re({
    type: "LineString",
    coordinates: i
  }, t, e);
}
function Mt(i, t = {}) {
  const e = { type: "FeatureCollection" };
  return t.id && (e.id = t.id), t.bbox && (e.bbox = t.bbox), e.features = i, e;
}
function rn(i) {
  return !isNaN(i) && i !== null && !Array.isArray(i);
}
function Ms(i) {
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
function ks(i) {
  return i.type === "Feature" ? i.geometry : i;
}
function We(i, t, e) {
  if (i !== null)
    for (var n, r, o, s, a, c, l, u = 0, f = 0, h, m = i.type, b = m === "FeatureCollection", g = m === "Feature", _ = b ? i.features.length : 1, B = 0; B < _; B++) {
      l = b ? (
        // @ts-expect-error: Known type conflict
        i.features[B].geometry
      ) : g ? (
        // @ts-expect-error: Known type conflict
        i.geometry
      ) : i, h = l ? l.type === "GeometryCollection" : !1, a = h ? l.geometries.length : 1;
      for (var v = 0; v < a; v++) {
        var x = 0, d = 0;
        if (s = h ? l.geometries[v] : l, s !== null) {
          c = s.coordinates;
          var p = s.type;
          switch (u = e && (p === "Polygon" || p === "MultiPolygon") ? 1 : 0, p) {
            case null:
              break;
            case "Point":
              if (
                // @ts-expect-error: Known type conflict
                t(
                  c,
                  f,
                  B,
                  x,
                  d
                ) === !1
              )
                return !1;
              f++, x++;
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
                    x,
                    d
                  ) === !1
                )
                  return !1;
                f++, p === "MultiPoint" && x++;
              }
              p === "LineString" && x++;
              break;
            case "Polygon":
            case "MultiLineString":
              for (n = 0; n < c.length; n++) {
                for (r = 0; r < c[n].length - u; r++) {
                  if (
                    // @ts-expect-error: Known type conflict
                    t(
                      c[n][r],
                      f,
                      B,
                      x,
                      d
                    ) === !1
                  )
                    return !1;
                  f++;
                }
                p === "MultiLineString" && x++, p === "Polygon" && d++;
              }
              p === "Polygon" && x++;
              break;
            case "MultiPolygon":
              for (n = 0; n < c.length; n++) {
                for (d = 0, r = 0; r < c[n].length; r++) {
                  for (o = 0; o < c[n][r].length - u; o++) {
                    if (
                      // @ts-expect-error: Known type conflict
                      t(
                        c[n][r][o],
                        f,
                        B,
                        x,
                        d
                      ) === !1
                    )
                      return !1;
                    f++;
                  }
                  d++;
                }
                x++;
              }
              break;
            case "GeometryCollection":
              for (n = 0; n < s.geometries.length; n++)
                if (
                  // @ts-expect-error: Known type conflict
                  We(s.geometries[n], t, e) === !1
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
const mt = 11102230246251565e-32, q = 134217729, Zn = (3 + 8 * mt) * mt;
function ht(i, t, e, n, r) {
  let o, s, a, c, l = t[0], u = n[0], f = 0, h = 0;
  u > l == u > -l ? (o = l, l = t[++f]) : (o = u, u = n[++h]);
  let m = 0;
  if (f < i && h < e)
    for (u > l == u > -l ? (s = l + o, a = o - (s - l), l = t[++f]) : (s = u + o, a = o - (s - u), u = n[++h]), o = s, a !== 0 && (r[m++] = a); f < i && h < e; )
      u > l == u > -l ? (s = o + l, c = s - o, a = o - (s - c) + (l - c), l = t[++f]) : (s = o + u, c = s - o, a = o - (s - c) + (u - c), u = n[++h]), o = s, a !== 0 && (r[m++] = a);
  for (; f < i; )
    s = o + l, c = s - o, a = o - (s - c) + (l - c), l = t[++f], o = s, a !== 0 && (r[m++] = a);
  for (; h < e; )
    s = o + u, c = s - o, a = o - (s - c) + (u - c), u = n[++h], o = s, a !== 0 && (r[m++] = a);
  return (o !== 0 || m === 0) && (r[m++] = o), m;
}
function _t(i, t, e, n, r, o, s, a) {
  return ht(ht(i, t, e, n, s), s, r, o, a);
}
function U(i, t, e, n) {
  let r, o, s, a, c, l, u, f, h, m, b;
  u = q * e, m = u - (u - e), b = e - m;
  let g = t[0];
  r = g * e, u = q * g, f = u - (u - g), h = g - f, s = h * b - (r - f * m - h * m - f * b);
  let _ = 0;
  s !== 0 && (n[_++] = s);
  for (let B = 1; B < i; B++)
    g = t[B], a = g * e, u = q * g, f = u - (u - g), h = g - f, c = h * b - (a - f * m - h * m - f * b), o = r + c, l = o - r, s = r - (o - l) + (c - l), s !== 0 && (n[_++] = s), r = a + o, s = o - (r - a), s !== 0 && (n[_++] = s);
  return (r !== 0 || _ === 0) && (n[_++] = r), _;
}
function ts(i, t) {
  let e = t[0];
  for (let n = 1; n < i; n++) e += t[n];
  return e;
}
function tt(i) {
  return new Float64Array(i);
}
const _s = (3 + 16 * mt) * mt, Es = (2 + 12 * mt) * mt, As = (9 + 64 * mt) * mt * mt, Ut = tt(4), on = tt(8), an = tt(12), cn = tt(16), wt = tt(4);
function Is(i, t, e, n, r, o, s) {
  let a, c, l, u, f, h, m, b, g, _, B, v, x, d, p, w, k, M;
  const A = i - r, N = e - r, O = t - o, C = n - o;
  d = A * C, h = q * A, m = h - (h - A), b = A - m, h = q * C, g = h - (h - C), _ = C - g, p = b * _ - (d - m * g - b * g - m * _), w = O * N, h = q * O, m = h - (h - O), b = O - m, h = q * N, g = h - (h - N), _ = N - g, k = b * _ - (w - m * g - b * g - m * _), B = p - k, f = p - B, Ut[0] = p - (B + f) + (f - k), v = d + B, f = v - d, x = d - (v - f) + (B - f), B = x - w, f = x - B, Ut[1] = x - (B + f) + (f - w), M = v + B, f = M - v, Ut[2] = v - (M - f) + (B - f), Ut[3] = M;
  let R = ts(4, Ut), S = Es * s;
  if (R >= S || -R >= S || (f = i - A, a = i - (A + f) + (f - r), f = e - N, l = e - (N + f) + (f - r), f = t - O, c = t - (O + f) + (f - o), f = n - C, u = n - (C + f) + (f - o), a === 0 && c === 0 && l === 0 && u === 0) || (S = As * s + Zn * Math.abs(R), R += A * u + C * a - (O * l + N * c), R >= S || -R >= S)) return R;
  d = a * C, h = q * a, m = h - (h - a), b = a - m, h = q * C, g = h - (h - C), _ = C - g, p = b * _ - (d - m * g - b * g - m * _), w = c * N, h = q * c, m = h - (h - c), b = c - m, h = q * N, g = h - (h - N), _ = N - g, k = b * _ - (w - m * g - b * g - m * _), B = p - k, f = p - B, wt[0] = p - (B + f) + (f - k), v = d + B, f = v - d, x = d - (v - f) + (B - f), B = x - w, f = x - B, wt[1] = x - (B + f) + (f - w), M = v + B, f = M - v, wt[2] = v - (M - f) + (B - f), wt[3] = M;
  const T = ht(4, Ut, 4, wt, on);
  d = A * u, h = q * A, m = h - (h - A), b = A - m, h = q * u, g = h - (h - u), _ = u - g, p = b * _ - (d - m * g - b * g - m * _), w = O * l, h = q * O, m = h - (h - O), b = O - m, h = q * l, g = h - (h - l), _ = l - g, k = b * _ - (w - m * g - b * g - m * _), B = p - k, f = p - B, wt[0] = p - (B + f) + (f - k), v = d + B, f = v - d, x = d - (v - f) + (B - f), B = x - w, f = x - B, wt[1] = x - (B + f) + (f - w), M = v + B, f = M - v, wt[2] = v - (M - f) + (B - f), wt[3] = M;
  const E = ht(T, on, 4, wt, an);
  d = a * u, h = q * a, m = h - (h - a), b = a - m, h = q * u, g = h - (h - u), _ = u - g, p = b * _ - (d - m * g - b * g - m * _), w = c * l, h = q * c, m = h - (h - c), b = c - m, h = q * l, g = h - (h - l), _ = l - g, k = b * _ - (w - m * g - b * g - m * _), B = p - k, f = p - B, wt[0] = p - (B + f) + (f - k), v = d + B, f = v - d, x = d - (v - f) + (B - f), B = x - w, f = x - B, wt[1] = x - (B + f) + (f - w), M = v + B, f = M - v, wt[2] = v - (M - f) + (B - f), wt[3] = M;
  const D = ht(E, an, 4, wt, cn);
  return cn[D - 1];
}
function st(i, t, e, n, r, o) {
  const s = (t - o) * (e - r), a = (i - r) * (n - o), c = s - a, l = Math.abs(s + a);
  return Math.abs(c) >= _s * l ? c : -Is(i, t, e, n, r, o, l);
}
const Bs = (10 + 96 * mt) * mt, Ts = (4 + 48 * mt) * mt, Os = (44 + 576 * mt) * mt * mt, Nt = tt(4), Pt = tt(4), Dt = tt(4), At = tt(4), It = tt(4), Bt = tt(4), vt = tt(4), yt = tt(4), Fe = tt(8), Ne = tt(8), Pe = tt(8), De = tt(8), Re = tt(8), Ce = tt(8), le = tt(8), fe = tt(8), ue = tt(8), Vt = tt(4), Xt = tt(4), Lt = tt(4), K = tt(8), Z = tt(16), rt = tt(16), it = tt(16), et = tt(32), Rt = tt(32), ft = tt(48), xt = tt(64);
let Wt = tt(1152), $e = tt(1152);
function ut(i, t, e) {
  i = ht(i, Wt, t, e, $e);
  const n = Wt;
  return Wt = $e, $e = n, i;
}
function Fs(i, t, e, n, r, o, s, a, c) {
  let l, u, f, h, m, b, g, _, B, v, x, d, p, w, k, M, A, N, O, C, R, S, T, E, D, I, F, y, P, $, V, z, L, X, Y;
  const G = i - s, j = e - s, W = r - s, H = t - a, Q = n - a, J = o - a;
  V = j * J, T = q * j, E = T - (T - j), D = j - E, T = q * J, I = T - (T - J), F = J - I, z = D * F - (V - E * I - D * I - E * F), L = W * Q, T = q * W, E = T - (T - W), D = W - E, T = q * Q, I = T - (T - Q), F = Q - I, X = D * F - (L - E * I - D * I - E * F), y = z - X, S = z - y, Nt[0] = z - (y + S) + (S - X), P = V + y, S = P - V, $ = V - (P - S) + (y - S), y = $ - L, S = $ - y, Nt[1] = $ - (y + S) + (S - L), Y = P + y, S = Y - P, Nt[2] = P - (Y - S) + (y - S), Nt[3] = Y, V = W * H, T = q * W, E = T - (T - W), D = W - E, T = q * H, I = T - (T - H), F = H - I, z = D * F - (V - E * I - D * I - E * F), L = G * J, T = q * G, E = T - (T - G), D = G - E, T = q * J, I = T - (T - J), F = J - I, X = D * F - (L - E * I - D * I - E * F), y = z - X, S = z - y, Pt[0] = z - (y + S) + (S - X), P = V + y, S = P - V, $ = V - (P - S) + (y - S), y = $ - L, S = $ - y, Pt[1] = $ - (y + S) + (S - L), Y = P + y, S = Y - P, Pt[2] = P - (Y - S) + (y - S), Pt[3] = Y, V = G * Q, T = q * G, E = T - (T - G), D = G - E, T = q * Q, I = T - (T - Q), F = Q - I, z = D * F - (V - E * I - D * I - E * F), L = j * H, T = q * j, E = T - (T - j), D = j - E, T = q * H, I = T - (T - H), F = H - I, X = D * F - (L - E * I - D * I - E * F), y = z - X, S = z - y, Dt[0] = z - (y + S) + (S - X), P = V + y, S = P - V, $ = V - (P - S) + (y - S), y = $ - L, S = $ - y, Dt[1] = $ - (y + S) + (S - L), Y = P + y, S = Y - P, Dt[2] = P - (Y - S) + (y - S), Dt[3] = Y, l = ht(
    ht(
      ht(
        U(U(4, Nt, G, K), K, G, Z),
        Z,
        U(U(4, Nt, H, K), K, H, rt),
        rt,
        et
      ),
      et,
      ht(
        U(U(4, Pt, j, K), K, j, Z),
        Z,
        U(U(4, Pt, Q, K), K, Q, rt),
        rt,
        Rt
      ),
      Rt,
      xt
    ),
    xt,
    ht(
      U(U(4, Dt, W, K), K, W, Z),
      Z,
      U(U(4, Dt, J, K), K, J, rt),
      rt,
      et
    ),
    et,
    Wt
  );
  let ct = ts(l, Wt), lt = Ts * c;
  if (ct >= lt || -ct >= lt || (S = i - G, u = i - (G + S) + (S - s), S = t - H, m = t - (H + S) + (S - a), S = e - j, f = e - (j + S) + (S - s), S = n - Q, b = n - (Q + S) + (S - a), S = r - W, h = r - (W + S) + (S - s), S = o - J, g = o - (J + S) + (S - a), u === 0 && f === 0 && h === 0 && m === 0 && b === 0 && g === 0) || (lt = Os * c + Zn * Math.abs(ct), ct += (G * G + H * H) * (j * g + J * f - (Q * h + W * b)) + 2 * (G * u + H * m) * (j * J - Q * W) + ((j * j + Q * Q) * (W * m + H * h - (J * u + G * g)) + 2 * (j * f + Q * b) * (W * H - J * G)) + ((W * W + J * J) * (G * b + Q * u - (H * f + j * m)) + 2 * (W * h + J * g) * (G * Q - H * j)), ct >= lt || -ct >= lt))
    return ct;
  if ((f !== 0 || b !== 0 || h !== 0 || g !== 0) && (V = G * G, T = q * G, E = T - (T - G), D = G - E, z = D * D - (V - E * E - (E + E) * D), L = H * H, T = q * H, E = T - (T - H), D = H - E, X = D * D - (L - E * E - (E + E) * D), y = z + X, S = y - z, At[0] = z - (y - S) + (X - S), P = V + y, S = P - V, $ = V - (P - S) + (y - S), y = $ + L, S = y - $, At[1] = $ - (y - S) + (L - S), Y = P + y, S = Y - P, At[2] = P - (Y - S) + (y - S), At[3] = Y), (h !== 0 || g !== 0 || u !== 0 || m !== 0) && (V = j * j, T = q * j, E = T - (T - j), D = j - E, z = D * D - (V - E * E - (E + E) * D), L = Q * Q, T = q * Q, E = T - (T - Q), D = Q - E, X = D * D - (L - E * E - (E + E) * D), y = z + X, S = y - z, It[0] = z - (y - S) + (X - S), P = V + y, S = P - V, $ = V - (P - S) + (y - S), y = $ + L, S = y - $, It[1] = $ - (y - S) + (L - S), Y = P + y, S = Y - P, It[2] = P - (Y - S) + (y - S), It[3] = Y), (u !== 0 || m !== 0 || f !== 0 || b !== 0) && (V = W * W, T = q * W, E = T - (T - W), D = W - E, z = D * D - (V - E * E - (E + E) * D), L = J * J, T = q * J, E = T - (T - J), D = J - E, X = D * D - (L - E * E - (E + E) * D), y = z + X, S = y - z, Bt[0] = z - (y - S) + (X - S), P = V + y, S = P - V, $ = V - (P - S) + (y - S), y = $ + L, S = y - $, Bt[1] = $ - (y - S) + (L - S), Y = P + y, S = Y - P, Bt[2] = P - (Y - S) + (y - S), Bt[3] = Y), u !== 0 && (_ = U(4, Nt, u, Fe), l = ut(l, _t(
    U(_, Fe, 2 * G, Z),
    Z,
    U(U(4, Bt, u, K), K, Q, rt),
    rt,
    U(U(4, It, u, K), K, -J, it),
    it,
    et,
    ft
  ), ft)), m !== 0 && (B = U(4, Nt, m, Ne), l = ut(l, _t(
    U(B, Ne, 2 * H, Z),
    Z,
    U(U(4, It, m, K), K, W, rt),
    rt,
    U(U(4, Bt, m, K), K, -j, it),
    it,
    et,
    ft
  ), ft)), f !== 0 && (v = U(4, Pt, f, Pe), l = ut(l, _t(
    U(v, Pe, 2 * j, Z),
    Z,
    U(U(4, At, f, K), K, J, rt),
    rt,
    U(U(4, Bt, f, K), K, -H, it),
    it,
    et,
    ft
  ), ft)), b !== 0 && (x = U(4, Pt, b, De), l = ut(l, _t(
    U(x, De, 2 * Q, Z),
    Z,
    U(U(4, Bt, b, K), K, G, rt),
    rt,
    U(U(4, At, b, K), K, -W, it),
    it,
    et,
    ft
  ), ft)), h !== 0 && (d = U(4, Dt, h, Re), l = ut(l, _t(
    U(d, Re, 2 * W, Z),
    Z,
    U(U(4, It, h, K), K, H, rt),
    rt,
    U(U(4, At, h, K), K, -Q, it),
    it,
    et,
    ft
  ), ft)), g !== 0 && (p = U(4, Dt, g, Ce), l = ut(l, _t(
    U(p, Ce, 2 * J, Z),
    Z,
    U(U(4, At, g, K), K, j, rt),
    rt,
    U(U(4, It, g, K), K, -G, it),
    it,
    et,
    ft
  ), ft)), u !== 0 || m !== 0) {
    if (f !== 0 || b !== 0 || h !== 0 || g !== 0 ? (V = f * J, T = q * f, E = T - (T - f), D = f - E, T = q * J, I = T - (T - J), F = J - I, z = D * F - (V - E * I - D * I - E * F), L = j * g, T = q * j, E = T - (T - j), D = j - E, T = q * g, I = T - (T - g), F = g - I, X = D * F - (L - E * I - D * I - E * F), y = z + X, S = y - z, vt[0] = z - (y - S) + (X - S), P = V + y, S = P - V, $ = V - (P - S) + (y - S), y = $ + L, S = y - $, vt[1] = $ - (y - S) + (L - S), Y = P + y, S = Y - P, vt[2] = P - (Y - S) + (y - S), vt[3] = Y, V = h * -Q, T = q * h, E = T - (T - h), D = h - E, T = q * -Q, I = T - (T - -Q), F = -Q - I, z = D * F - (V - E * I - D * I - E * F), L = W * -b, T = q * W, E = T - (T - W), D = W - E, T = q * -b, I = T - (T - -b), F = -b - I, X = D * F - (L - E * I - D * I - E * F), y = z + X, S = y - z, yt[0] = z - (y - S) + (X - S), P = V + y, S = P - V, $ = V - (P - S) + (y - S), y = $ + L, S = y - $, yt[1] = $ - (y - S) + (L - S), Y = P + y, S = Y - P, yt[2] = P - (Y - S) + (y - S), yt[3] = Y, k = ht(4, vt, 4, yt, fe), V = f * g, T = q * f, E = T - (T - f), D = f - E, T = q * g, I = T - (T - g), F = g - I, z = D * F - (V - E * I - D * I - E * F), L = h * b, T = q * h, E = T - (T - h), D = h - E, T = q * b, I = T - (T - b), F = b - I, X = D * F - (L - E * I - D * I - E * F), y = z - X, S = z - y, Xt[0] = z - (y + S) + (S - X), P = V + y, S = P - V, $ = V - (P - S) + (y - S), y = $ - L, S = $ - y, Xt[1] = $ - (y + S) + (S - L), Y = P + y, S = Y - P, Xt[2] = P - (Y - S) + (y - S), Xt[3] = Y, N = 4) : (fe[0] = 0, k = 1, Xt[0] = 0, N = 1), u !== 0) {
      const ot = U(k, fe, u, it);
      l = ut(l, ht(
        U(_, Fe, u, Z),
        Z,
        U(ot, it, 2 * G, et),
        et,
        ft
      ), ft);
      const at = U(N, Xt, u, K);
      l = ut(l, _t(
        U(at, K, 2 * G, Z),
        Z,
        U(at, K, u, rt),
        rt,
        U(ot, it, u, et),
        et,
        Rt,
        xt
      ), xt), b !== 0 && (l = ut(l, U(U(4, Bt, u, K), K, b, Z), Z)), g !== 0 && (l = ut(l, U(U(4, It, -u, K), K, g, Z), Z));
    }
    if (m !== 0) {
      const ot = U(k, fe, m, it);
      l = ut(l, ht(
        U(B, Ne, m, Z),
        Z,
        U(ot, it, 2 * H, et),
        et,
        ft
      ), ft);
      const at = U(N, Xt, m, K);
      l = ut(l, _t(
        U(at, K, 2 * H, Z),
        Z,
        U(at, K, m, rt),
        rt,
        U(ot, it, m, et),
        et,
        Rt,
        xt
      ), xt);
    }
  }
  if (f !== 0 || b !== 0) {
    if (h !== 0 || g !== 0 || u !== 0 || m !== 0 ? (V = h * H, T = q * h, E = T - (T - h), D = h - E, T = q * H, I = T - (T - H), F = H - I, z = D * F - (V - E * I - D * I - E * F), L = W * m, T = q * W, E = T - (T - W), D = W - E, T = q * m, I = T - (T - m), F = m - I, X = D * F - (L - E * I - D * I - E * F), y = z + X, S = y - z, vt[0] = z - (y - S) + (X - S), P = V + y, S = P - V, $ = V - (P - S) + (y - S), y = $ + L, S = y - $, vt[1] = $ - (y - S) + (L - S), Y = P + y, S = Y - P, vt[2] = P - (Y - S) + (y - S), vt[3] = Y, C = -J, R = -g, V = u * C, T = q * u, E = T - (T - u), D = u - E, T = q * C, I = T - (T - C), F = C - I, z = D * F - (V - E * I - D * I - E * F), L = G * R, T = q * G, E = T - (T - G), D = G - E, T = q * R, I = T - (T - R), F = R - I, X = D * F - (L - E * I - D * I - E * F), y = z + X, S = y - z, yt[0] = z - (y - S) + (X - S), P = V + y, S = P - V, $ = V - (P - S) + (y - S), y = $ + L, S = y - $, yt[1] = $ - (y - S) + (L - S), Y = P + y, S = Y - P, yt[2] = P - (Y - S) + (y - S), yt[3] = Y, M = ht(4, vt, 4, yt, ue), V = h * m, T = q * h, E = T - (T - h), D = h - E, T = q * m, I = T - (T - m), F = m - I, z = D * F - (V - E * I - D * I - E * F), L = u * g, T = q * u, E = T - (T - u), D = u - E, T = q * g, I = T - (T - g), F = g - I, X = D * F - (L - E * I - D * I - E * F), y = z - X, S = z - y, Lt[0] = z - (y + S) + (S - X), P = V + y, S = P - V, $ = V - (P - S) + (y - S), y = $ - L, S = $ - y, Lt[1] = $ - (y + S) + (S - L), Y = P + y, S = Y - P, Lt[2] = P - (Y - S) + (y - S), Lt[3] = Y, O = 4) : (ue[0] = 0, M = 1, Lt[0] = 0, O = 1), f !== 0) {
      const ot = U(M, ue, f, it);
      l = ut(l, ht(
        U(v, Pe, f, Z),
        Z,
        U(ot, it, 2 * j, et),
        et,
        ft
      ), ft);
      const at = U(O, Lt, f, K);
      l = ut(l, _t(
        U(at, K, 2 * j, Z),
        Z,
        U(at, K, f, rt),
        rt,
        U(ot, it, f, et),
        et,
        Rt,
        xt
      ), xt), g !== 0 && (l = ut(l, U(U(4, At, f, K), K, g, Z), Z)), m !== 0 && (l = ut(l, U(U(4, Bt, -f, K), K, m, Z), Z));
    }
    if (b !== 0) {
      const ot = U(M, ue, b, it);
      l = ut(l, ht(
        U(x, De, b, Z),
        Z,
        U(ot, it, 2 * Q, et),
        et,
        ft
      ), ft);
      const at = U(O, Lt, b, K);
      l = ut(l, _t(
        U(at, K, 2 * Q, Z),
        Z,
        U(at, K, b, rt),
        rt,
        U(ot, it, b, et),
        et,
        Rt,
        xt
      ), xt);
    }
  }
  if (h !== 0 || g !== 0) {
    if (u !== 0 || m !== 0 || f !== 0 || b !== 0 ? (V = u * Q, T = q * u, E = T - (T - u), D = u - E, T = q * Q, I = T - (T - Q), F = Q - I, z = D * F - (V - E * I - D * I - E * F), L = G * b, T = q * G, E = T - (T - G), D = G - E, T = q * b, I = T - (T - b), F = b - I, X = D * F - (L - E * I - D * I - E * F), y = z + X, S = y - z, vt[0] = z - (y - S) + (X - S), P = V + y, S = P - V, $ = V - (P - S) + (y - S), y = $ + L, S = y - $, vt[1] = $ - (y - S) + (L - S), Y = P + y, S = Y - P, vt[2] = P - (Y - S) + (y - S), vt[3] = Y, C = -H, R = -m, V = f * C, T = q * f, E = T - (T - f), D = f - E, T = q * C, I = T - (T - C), F = C - I, z = D * F - (V - E * I - D * I - E * F), L = j * R, T = q * j, E = T - (T - j), D = j - E, T = q * R, I = T - (T - R), F = R - I, X = D * F - (L - E * I - D * I - E * F), y = z + X, S = y - z, yt[0] = z - (y - S) + (X - S), P = V + y, S = P - V, $ = V - (P - S) + (y - S), y = $ + L, S = y - $, yt[1] = $ - (y - S) + (L - S), Y = P + y, S = Y - P, yt[2] = P - (Y - S) + (y - S), yt[3] = Y, w = ht(4, vt, 4, yt, le), V = u * b, T = q * u, E = T - (T - u), D = u - E, T = q * b, I = T - (T - b), F = b - I, z = D * F - (V - E * I - D * I - E * F), L = f * m, T = q * f, E = T - (T - f), D = f - E, T = q * m, I = T - (T - m), F = m - I, X = D * F - (L - E * I - D * I - E * F), y = z - X, S = z - y, Vt[0] = z - (y + S) + (S - X), P = V + y, S = P - V, $ = V - (P - S) + (y - S), y = $ - L, S = $ - y, Vt[1] = $ - (y + S) + (S - L), Y = P + y, S = Y - P, Vt[2] = P - (Y - S) + (y - S), Vt[3] = Y, A = 4) : (le[0] = 0, w = 1, Vt[0] = 0, A = 1), h !== 0) {
      const ot = U(w, le, h, it);
      l = ut(l, ht(
        U(d, Re, h, Z),
        Z,
        U(ot, it, 2 * W, et),
        et,
        ft
      ), ft);
      const at = U(A, Vt, h, K);
      l = ut(l, _t(
        U(at, K, 2 * W, Z),
        Z,
        U(at, K, h, rt),
        rt,
        U(ot, it, h, et),
        et,
        Rt,
        xt
      ), xt), m !== 0 && (l = ut(l, U(U(4, It, h, K), K, m, Z), Z)), b !== 0 && (l = ut(l, U(U(4, At, -h, K), K, b, Z), Z));
    }
    if (g !== 0) {
      const ot = U(w, le, g, it);
      l = ut(l, ht(
        U(p, Ce, g, Z),
        Z,
        U(ot, it, 2 * J, et),
        et,
        ft
      ), ft);
      const at = U(A, Vt, g, K);
      l = ut(l, _t(
        U(at, K, 2 * J, Z),
        Z,
        U(at, K, g, rt),
        rt,
        U(ot, it, g, et),
        et,
        Rt,
        xt
      ), xt);
    }
  }
  return Wt[l - 1];
}
function He(i, t, e, n, r, o, s, a) {
  const c = i - s, l = e - s, u = r - s, f = t - a, h = n - a, m = o - a, b = l * m, g = u * h, _ = c * c + f * f, B = u * f, v = c * m, x = l * l + h * h, d = c * h, p = l * f, w = u * u + m * m, k = _ * (b - g) + x * (B - v) + w * (d - p), M = (Math.abs(b) + Math.abs(g)) * _ + (Math.abs(B) + Math.abs(v)) * x + (Math.abs(d) + Math.abs(p)) * w, A = Bs * M;
  return k > A || -k > A ? k : Fs(i, t, e, n, r, o, s, a, M);
}
function Ns(i, t) {
  var e, n, r = 0, o, s, a, c, l, u, f, h = i[0], m = i[1], b = t.length;
  for (e = 0; e < b; e++) {
    n = 0;
    var g = t[e], _ = g.length - 1;
    if (u = g[0], u[0] !== g[_][0] && u[1] !== g[_][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (s = u[0] - h, a = u[1] - m, n; n < _; n++) {
      if (f = g[n + 1], c = f[0] - h, l = f[1] - m, a === 0 && l === 0) {
        if (c <= 0 && s >= 0 || s <= 0 && c >= 0)
          return 0;
      } else if (l >= 0 && a <= 0 || l <= 0 && a >= 0) {
        if (o = st(s, c, a, l, 0, 0), o === 0)
          return 0;
        (o > 0 && l > 0 && a <= 0 || o < 0 && l <= 0 && a > 0) && r++;
      }
      u = f, a = l, s = c;
    }
  }
  return r % 2 !== 0;
}
function ln(i, t, e = {}) {
  if (!i)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const n = Ms(i), r = ks(t), o = r.type, s = t.bbox;
  let a = r.coordinates;
  if (s && Ps(n, s) === !1)
    return !1;
  o === "Polygon" && (a = [a]);
  for (var c = 0; c < a.length; ++c) {
    const l = Ns(n, a[c]);
    if (l === 0 && !e.ignoreBoundary) return !0;
    if (l) return !0;
  }
  return !1;
}
function Ps(i, t) {
  return t[0] <= i[0] && t[1] <= i[1] && t[2] >= i[0] && t[3] >= i[1];
}
class Je {
  constructor(t = [], e = Ds) {
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
    const { data: e, compare: n } = this, r = e[t];
    for (; t > 0; ) {
      const o = t - 1 >> 1, s = e[o];
      if (n(r, s) >= 0) break;
      e[t] = s, t = o;
    }
    e[t] = r;
  }
  _down(t) {
    const { data: e, compare: n } = this, r = this.length >> 1, o = e[t];
    for (; t < r; ) {
      let s = (t << 1) + 1, a = e[s];
      const c = s + 1;
      if (c < this.length && n(e[c], a) < 0 && (s = c, a = e[c]), n(a, o) >= 0) break;
      e[t] = a, t = s;
    }
    e[t] = o;
  }
}
function Ds(i, t) {
  return i < t ? -1 : i > t ? 1 : 0;
}
const Rs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Je
}, Symbol.toStringTag, { value: "Module" })), Ot = 11102230246251565e-32, pt = 134217729, Cs = (3 + 8 * Ot) * Ot;
function Ve(i, t, e, n, r) {
  let o, s, a, c, l = t[0], u = n[0], f = 0, h = 0;
  u > l == u > -l ? (o = l, l = t[++f]) : (o = u, u = n[++h]);
  let m = 0;
  if (f < i && h < e)
    for (u > l == u > -l ? (s = l + o, a = o - (s - l), l = t[++f]) : (s = u + o, a = o - (s - u), u = n[++h]), o = s, a !== 0 && (r[m++] = a); f < i && h < e; )
      u > l == u > -l ? (s = o + l, c = s - o, a = o - (s - c) + (l - c), l = t[++f]) : (s = o + u, c = s - o, a = o - (s - c) + (u - c), u = n[++h]), o = s, a !== 0 && (r[m++] = a);
  for (; f < i; )
    s = o + l, c = s - o, a = o - (s - c) + (l - c), l = t[++f], o = s, a !== 0 && (r[m++] = a);
  for (; h < e; )
    s = o + u, c = s - o, a = o - (s - c) + (u - c), u = n[++h], o = s, a !== 0 && (r[m++] = a);
  return (o !== 0 || m === 0) && (r[m++] = o), m;
}
function $s(i, t) {
  let e = t[0];
  for (let n = 1; n < i; n++) e += t[n];
  return e;
}
function ce(i) {
  return new Float64Array(i);
}
const Vs = (3 + 16 * Ot) * Ot, Xs = (2 + 12 * Ot) * Ot, Ls = (9 + 64 * Ot) * Ot * Ot, qt = ce(4), fn = ce(8), un = ce(12), hn = ce(16), bt = ce(4);
function Ys(i, t, e, n, r, o, s) {
  let a, c, l, u, f, h, m, b, g, _, B, v, x, d, p, w, k, M;
  const A = i - r, N = e - r, O = t - o, C = n - o;
  d = A * C, h = pt * A, m = h - (h - A), b = A - m, h = pt * C, g = h - (h - C), _ = C - g, p = b * _ - (d - m * g - b * g - m * _), w = O * N, h = pt * O, m = h - (h - O), b = O - m, h = pt * N, g = h - (h - N), _ = N - g, k = b * _ - (w - m * g - b * g - m * _), B = p - k, f = p - B, qt[0] = p - (B + f) + (f - k), v = d + B, f = v - d, x = d - (v - f) + (B - f), B = x - w, f = x - B, qt[1] = x - (B + f) + (f - w), M = v + B, f = M - v, qt[2] = v - (M - f) + (B - f), qt[3] = M;
  let R = $s(4, qt), S = Xs * s;
  if (R >= S || -R >= S || (f = i - A, a = i - (A + f) + (f - r), f = e - N, l = e - (N + f) + (f - r), f = t - O, c = t - (O + f) + (f - o), f = n - C, u = n - (C + f) + (f - o), a === 0 && c === 0 && l === 0 && u === 0) || (S = Ls * s + Cs * Math.abs(R), R += A * u + C * a - (O * l + N * c), R >= S || -R >= S)) return R;
  d = a * C, h = pt * a, m = h - (h - a), b = a - m, h = pt * C, g = h - (h - C), _ = C - g, p = b * _ - (d - m * g - b * g - m * _), w = c * N, h = pt * c, m = h - (h - c), b = c - m, h = pt * N, g = h - (h - N), _ = N - g, k = b * _ - (w - m * g - b * g - m * _), B = p - k, f = p - B, bt[0] = p - (B + f) + (f - k), v = d + B, f = v - d, x = d - (v - f) + (B - f), B = x - w, f = x - B, bt[1] = x - (B + f) + (f - w), M = v + B, f = M - v, bt[2] = v - (M - f) + (B - f), bt[3] = M;
  const T = Ve(4, qt, 4, bt, fn);
  d = A * u, h = pt * A, m = h - (h - A), b = A - m, h = pt * u, g = h - (h - u), _ = u - g, p = b * _ - (d - m * g - b * g - m * _), w = O * l, h = pt * O, m = h - (h - O), b = O - m, h = pt * l, g = h - (h - l), _ = l - g, k = b * _ - (w - m * g - b * g - m * _), B = p - k, f = p - B, bt[0] = p - (B + f) + (f - k), v = d + B, f = v - d, x = d - (v - f) + (B - f), B = x - w, f = x - B, bt[1] = x - (B + f) + (f - w), M = v + B, f = M - v, bt[2] = v - (M - f) + (B - f), bt[3] = M;
  const E = Ve(T, fn, 4, bt, un);
  d = a * u, h = pt * a, m = h - (h - a), b = a - m, h = pt * u, g = h - (h - u), _ = u - g, p = b * _ - (d - m * g - b * g - m * _), w = c * l, h = pt * c, m = h - (h - c), b = c - m, h = pt * l, g = h - (h - l), _ = l - g, k = b * _ - (w - m * g - b * g - m * _), B = p - k, f = p - B, bt[0] = p - (B + f) + (f - k), v = d + B, f = v - d, x = d - (v - f) + (B - f), B = x - w, f = x - B, bt[1] = x - (B + f) + (f - w), M = v + B, f = M - v, bt[2] = v - (M - f) + (B - f), bt[3] = M;
  const D = Ve(E, un, 4, bt, hn);
  return hn[D - 1];
}
function dn(i, t, e, n, r, o) {
  const s = (t - o) * (e - r), a = (i - r) * (n - o), c = s - a;
  if (s === 0 || a === 0 || s > 0 != a > 0) return c;
  const l = Math.abs(s + a);
  return Math.abs(c) >= Vs * l ? c : -Ys(i, t, e, n, r, o, l);
}
function zs(i, t) {
  const e = new Je([], es);
  return qs(i, e), js(e, t);
}
function es(i, t) {
  return i.p.x > t.p.x ? 1 : i.p.x < t.p.x || i.p.x === t.p.x && (i.featureId !== t.featureId || i.ringId !== t.ringId) && i.isLeftEndpoint && !t.isLeftEndpoint ? -1 : i.p.y !== t.p.y ? i.p.y > t.p.y ? 1 : -1 : 1;
}
function Us(i, t) {
  return i.rightSweepEvent.p.x > t.rightSweepEvent.p.x ? 1 : i.rightSweepEvent.p.x < t.rightSweepEvent.p.x ? -1 : i.rightSweepEvent.p.y !== t.rightSweepEvent.p.y ? i.rightSweepEvent.p.y < t.rightSweepEvent.p.y ? 1 : -1 : 1;
}
function qs(i, t) {
  if (i.type === "FeatureCollection") {
    const e = i.features;
    for (let n = 0; n < e.length; n++)
      gn(e[n], t);
  } else
    gn(i, t);
}
var he = 0, de = 0, ge = 0;
function gn(i, t) {
  const e = i.type === "Feature" ? i.geometry : i;
  let n = e.coordinates;
  (e.type === "Polygon" || e.type === "MultiLineString") && (n = [n]), e.type === "LineString" && (n = [[n]]);
  for (let r = 0; r < n.length; r++)
    for (let o = 0; o < n[r].length; o++) {
      let s = n[r][o][0], a = null;
      de = de + 1;
      for (let c = 0; c < n[r][o].length - 1; c++) {
        a = n[r][o][c + 1];
        const l = new pn(s, he, de, ge), u = new pn(a, he, de, ge + 1);
        l.otherEvent = u, u.otherEvent = l, es(l, u) > 0 ? (u.isLeftEndpoint = !0, l.isLeftEndpoint = !1) : (l.isLeftEndpoint = !0, u.isLeftEndpoint = !1), t.push(l), t.push(u), s = a, ge = ge + 1;
      }
    }
  he = he + 1;
}
var pn = class {
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
function js(i, t = !1) {
  const e = [], n = new Je([], Us);
  for (; i.length; ) {
    const r = i.pop();
    if (r.isLeftEndpoint) {
      const o = new Gs(r);
      for (let s = 0; s < n.data.length; s++) {
        const a = n.data[s];
        if (t && a.leftSweepEvent.featureId === r.featureId)
          continue;
        const c = Ks(o, a);
        c !== !1 && e.push(c);
      }
      n.push(o);
    } else r.isLeftEndpoint === !1 && n.pop();
  }
  return e;
}
var Gs = class {
  /** @param event must have otherEvent non-null */
  constructor(i) {
    this.leftSweepEvent = i, this.rightSweepEvent = i.otherEvent;
  }
};
function Ks(i, t) {
  if (i === null || t === null) return !1;
  const e = i.leftSweepEvent.p.x, n = i.leftSweepEvent.p.y, r = i.rightSweepEvent.p.x, o = i.rightSweepEvent.p.y, s = t.leftSweepEvent.p.x, a = t.leftSweepEvent.p.y, c = t.rightSweepEvent.p.x, l = t.rightSweepEvent.p.y, u = dn(e, n, r, o, s, a), f = dn(e, n, r, o, c, l);
  if (u > 0 && f > 0) return !1;
  if (u < 0 && f < 0) return !1;
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
  const h = (l - a) * (r - e) - (c - s) * (o - n), m = (c - s) * (n - a) - (l - a) * (e - s), b = (r - e) * (n - a) - (o - n) * (e - s);
  if (h === 0)
    return !1;
  const g = m / h, _ = b / h;
  if (g >= 0 && g <= 1 && _ >= 0 && _ <= 1) {
    const B = e + g * (r - e), v = n + g * (o - n);
    return [B, v];
  }
  return !1;
}
function Ws(i, t, e = {}) {
  const { removeDuplicates: n = !0, ignoreSelfIntersections: r = !0 } = e;
  let o = [];
  i.type === "FeatureCollection" ? o = o.concat(i.features) : i.type === "Feature" ? o.push(i) : (i.type === "LineString" || i.type === "Polygon" || i.type === "MultiLineString" || i.type === "MultiPolygon") && o.push(re(i)), t.type === "FeatureCollection" ? o = o.concat(t.features) : t.type === "Feature" ? o.push(t) : (t.type === "LineString" || t.type === "Polygon" || t.type === "MultiLineString" || t.type === "MultiPolygon") && o.push(re(t));
  const s = zs(
    Mt(o),
    r
  );
  let a = [];
  if (n) {
    const c = {};
    s.forEach((l) => {
      const u = l.join(",");
      c[u] || (c[u] = !0, a.push(l));
    });
  } else
    a = s;
  return Mt(a.map((c) => zt(c)));
}
function Hs(i) {
  return i && i.__esModule && Object.prototype.hasOwnProperty.call(i, "default") ? i.default : i;
}
function Js(i) {
  if (Object.prototype.hasOwnProperty.call(i, "__esModule")) return i;
  var t = i.default;
  if (typeof t == "function") {
    var e = function n() {
      var r = !1;
      try {
        r = this instanceof n;
      } catch {
      }
      return r ? Reflect.construct(t, arguments, this.constructor) : t.apply(this, arguments);
    };
    e.prototype = t.prototype;
  } else e = {};
  return Object.defineProperty(e, "__esModule", { value: !0 }), Object.keys(i).forEach(function(n) {
    var r = Object.getOwnPropertyDescriptor(i, n);
    Object.defineProperty(e, n, r.get ? r : {
      enumerable: !0,
      get: function() {
        return i[n];
      }
    });
  }), e;
}
function Qs(i, t = {}) {
  let e = 0, n = 0, r = 0;
  return We(
    i,
    function(o) {
      e += o[0], n += o[1], r++;
    },
    !0
  ), zt([e / r, n / r], t.properties);
}
var pe = { exports: {} }, Se = { exports: {} }, Zs = Se.exports, mn;
function tr() {
  return mn || (mn = 1, (function(i, t) {
    (function(e, n) {
      i.exports = n();
    })(Zs, function() {
      function e(v, x, d, p, w) {
        (function k(M, A, N, O, C) {
          for (; O > N; ) {
            if (O - N > 600) {
              var R = O - N + 1, S = A - N + 1, T = Math.log(R), E = 0.5 * Math.exp(2 * T / 3), D = 0.5 * Math.sqrt(T * E * (R - E) / R) * (S - R / 2 < 0 ? -1 : 1), I = Math.max(N, Math.floor(A - S * E / R + D)), F = Math.min(O, Math.floor(A + (R - S) * E / R + D));
              k(M, A, I, F, C);
            }
            var y = M[A], P = N, $ = O;
            for (n(M, N, A), C(M[O], y) > 0 && n(M, N, O); P < $; ) {
              for (n(M, P, $), P++, $--; C(M[P], y) < 0; ) P++;
              for (; C(M[$], y) > 0; ) $--;
            }
            C(M[N], y) === 0 ? n(M, N, $) : n(M, ++$, O), $ <= A && (N = $ + 1), A <= $ && (O = $ - 1);
          }
        })(v, x, d || 0, p || v.length - 1, w || r);
      }
      function n(v, x, d) {
        var p = v[x];
        v[x] = v[d], v[d] = p;
      }
      function r(v, x) {
        return v < x ? -1 : v > x ? 1 : 0;
      }
      var o = function(v) {
        v === void 0 && (v = 9), this._maxEntries = Math.max(4, v), this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries)), this.clear();
      };
      function s(v, x, d) {
        if (!d) return x.indexOf(v);
        for (var p = 0; p < x.length; p++) if (d(v, x[p])) return p;
        return -1;
      }
      function a(v, x) {
        c(v, 0, v.children.length, x, v);
      }
      function c(v, x, d, p, w) {
        w || (w = _(null)), w.minX = 1 / 0, w.minY = 1 / 0, w.maxX = -1 / 0, w.maxY = -1 / 0;
        for (var k = x; k < d; k++) {
          var M = v.children[k];
          l(w, v.leaf ? p(M) : M);
        }
        return w;
      }
      function l(v, x) {
        return v.minX = Math.min(v.minX, x.minX), v.minY = Math.min(v.minY, x.minY), v.maxX = Math.max(v.maxX, x.maxX), v.maxY = Math.max(v.maxY, x.maxY), v;
      }
      function u(v, x) {
        return v.minX - x.minX;
      }
      function f(v, x) {
        return v.minY - x.minY;
      }
      function h(v) {
        return (v.maxX - v.minX) * (v.maxY - v.minY);
      }
      function m(v) {
        return v.maxX - v.minX + (v.maxY - v.minY);
      }
      function b(v, x) {
        return v.minX <= x.minX && v.minY <= x.minY && x.maxX <= v.maxX && x.maxY <= v.maxY;
      }
      function g(v, x) {
        return x.minX <= v.maxX && x.minY <= v.maxY && x.maxX >= v.minX && x.maxY >= v.minY;
      }
      function _(v) {
        return { children: v, height: 1, leaf: !0, minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
      }
      function B(v, x, d, p, w) {
        for (var k = [x, d]; k.length; ) if (!((d = k.pop()) - (x = k.pop()) <= p)) {
          var M = x + Math.ceil((d - x) / p / 2) * p;
          e(v, M, x, d, w), k.push(x, M, M, d);
        }
      }
      return o.prototype.all = function() {
        return this._all(this.data, []);
      }, o.prototype.search = function(v) {
        var x = this.data, d = [];
        if (!g(v, x)) return d;
        for (var p = this.toBBox, w = []; x; ) {
          for (var k = 0; k < x.children.length; k++) {
            var M = x.children[k], A = x.leaf ? p(M) : M;
            g(v, A) && (x.leaf ? d.push(M) : b(v, A) ? this._all(M, d) : w.push(M));
          }
          x = w.pop();
        }
        return d;
      }, o.prototype.collides = function(v) {
        var x = this.data;
        if (!g(v, x)) return !1;
        for (var d = []; x; ) {
          for (var p = 0; p < x.children.length; p++) {
            var w = x.children[p], k = x.leaf ? this.toBBox(w) : w;
            if (g(v, k)) {
              if (x.leaf || b(v, k)) return !0;
              d.push(w);
            }
          }
          x = d.pop();
        }
        return !1;
      }, o.prototype.load = function(v) {
        if (!v || !v.length) return this;
        if (v.length < this._minEntries) {
          for (var x = 0; x < v.length; x++) this.insert(v[x]);
          return this;
        }
        var d = this._build(v.slice(), 0, v.length - 1, 0);
        if (this.data.children.length) if (this.data.height === d.height) this._splitRoot(this.data, d);
        else {
          if (this.data.height < d.height) {
            var p = this.data;
            this.data = d, d = p;
          }
          this._insert(d, this.data.height - d.height - 1, !0);
        }
        else this.data = d;
        return this;
      }, o.prototype.insert = function(v) {
        return v && this._insert(v, this.data.height - 1), this;
      }, o.prototype.clear = function() {
        return this.data = _([]), this;
      }, o.prototype.remove = function(v, x) {
        if (!v) return this;
        for (var d, p, w, k = this.data, M = this.toBBox(v), A = [], N = []; k || A.length; ) {
          if (k || (k = A.pop(), p = A[A.length - 1], d = N.pop(), w = !0), k.leaf) {
            var O = s(v, k.children, x);
            if (O !== -1) return k.children.splice(O, 1), A.push(k), this._condense(A), this;
          }
          w || k.leaf || !b(k, M) ? p ? (d++, k = p.children[d], w = !1) : k = null : (A.push(k), N.push(d), d = 0, p = k, k = k.children[0]);
        }
        return this;
      }, o.prototype.toBBox = function(v) {
        return v;
      }, o.prototype.compareMinX = function(v, x) {
        return v.minX - x.minX;
      }, o.prototype.compareMinY = function(v, x) {
        return v.minY - x.minY;
      }, o.prototype.toJSON = function() {
        return this.data;
      }, o.prototype.fromJSON = function(v) {
        return this.data = v, this;
      }, o.prototype._all = function(v, x) {
        for (var d = []; v; ) v.leaf ? x.push.apply(x, v.children) : d.push.apply(d, v.children), v = d.pop();
        return x;
      }, o.prototype._build = function(v, x, d, p) {
        var w, k = d - x + 1, M = this._maxEntries;
        if (k <= M) return a(w = _(v.slice(x, d + 1)), this.toBBox), w;
        p || (p = Math.ceil(Math.log(k) / Math.log(M)), M = Math.ceil(k / Math.pow(M, p - 1))), (w = _([])).leaf = !1, w.height = p;
        var A = Math.ceil(k / M), N = A * Math.ceil(Math.sqrt(M));
        B(v, x, d, N, this.compareMinX);
        for (var O = x; O <= d; O += N) {
          var C = Math.min(O + N - 1, d);
          B(v, O, C, A, this.compareMinY);
          for (var R = O; R <= C; R += A) {
            var S = Math.min(R + A - 1, C);
            w.children.push(this._build(v, R, S, p - 1));
          }
        }
        return a(w, this.toBBox), w;
      }, o.prototype._chooseSubtree = function(v, x, d, p) {
        for (; p.push(x), !x.leaf && p.length - 1 !== d; ) {
          for (var w = 1 / 0, k = 1 / 0, M = void 0, A = 0; A < x.children.length; A++) {
            var N = x.children[A], O = h(N), C = (R = v, S = N, (Math.max(S.maxX, R.maxX) - Math.min(S.minX, R.minX)) * (Math.max(S.maxY, R.maxY) - Math.min(S.minY, R.minY)) - O);
            C < k ? (k = C, w = O < w ? O : w, M = N) : C === k && O < w && (w = O, M = N);
          }
          x = M || x.children[0];
        }
        var R, S;
        return x;
      }, o.prototype._insert = function(v, x, d) {
        var p = d ? v : this.toBBox(v), w = [], k = this._chooseSubtree(p, this.data, x, w);
        for (k.children.push(v), l(k, p); x >= 0 && w[x].children.length > this._maxEntries; ) this._split(w, x), x--;
        this._adjustParentBBoxes(p, w, x);
      }, o.prototype._split = function(v, x) {
        var d = v[x], p = d.children.length, w = this._minEntries;
        this._chooseSplitAxis(d, w, p);
        var k = this._chooseSplitIndex(d, w, p), M = _(d.children.splice(k, d.children.length - k));
        M.height = d.height, M.leaf = d.leaf, a(d, this.toBBox), a(M, this.toBBox), x ? v[x - 1].children.push(M) : this._splitRoot(d, M);
      }, o.prototype._splitRoot = function(v, x) {
        this.data = _([v, x]), this.data.height = v.height + 1, this.data.leaf = !1, a(this.data, this.toBBox);
      }, o.prototype._chooseSplitIndex = function(v, x, d) {
        for (var p, w, k, M, A, N, O, C = 1 / 0, R = 1 / 0, S = x; S <= d - x; S++) {
          var T = c(v, 0, S, this.toBBox), E = c(v, S, d, this.toBBox), D = (w = T, k = E, M = void 0, A = void 0, N = void 0, O = void 0, M = Math.max(w.minX, k.minX), A = Math.max(w.minY, k.minY), N = Math.min(w.maxX, k.maxX), O = Math.min(w.maxY, k.maxY), Math.max(0, N - M) * Math.max(0, O - A)), I = h(T) + h(E);
          D < C ? (C = D, p = S, R = I < R ? I : R) : D === C && I < R && (R = I, p = S);
        }
        return p || d - x;
      }, o.prototype._chooseSplitAxis = function(v, x, d) {
        var p = v.leaf ? this.compareMinX : u, w = v.leaf ? this.compareMinY : f;
        this._allDistMargin(v, x, d, p) < this._allDistMargin(v, x, d, w) && v.children.sort(p);
      }, o.prototype._allDistMargin = function(v, x, d, p) {
        v.children.sort(p);
        for (var w = this.toBBox, k = c(v, 0, x, w), M = c(v, d - x, d, w), A = m(k) + m(M), N = x; N < d - x; N++) {
          var O = v.children[N];
          l(k, v.leaf ? w(O) : O), A += m(k);
        }
        for (var C = d - x - 1; C >= x; C--) {
          var R = v.children[C];
          l(M, v.leaf ? w(R) : R), A += m(M);
        }
        return A;
      }, o.prototype._adjustParentBBoxes = function(v, x, d) {
        for (var p = d; p >= 0; p--) l(x[p], v);
      }, o.prototype._condense = function(v) {
        for (var x = v.length - 1, d = void 0; x >= 0; x--) v[x].children.length === 0 ? x > 0 ? (d = v[x - 1].children).splice(d.indexOf(v[x]), 1) : this.clear() : a(v[x], this.toBBox);
      }, o;
    });
  })(Se)), Se.exports;
}
const er = /* @__PURE__ */ Js(Rs);
var Qt = { exports: {} }, Xe, wn;
function nr() {
  return wn || (wn = 1, Xe = function(t, e, n, r) {
    var o = t[0], s = t[1], a = !1;
    n === void 0 && (n = 0), r === void 0 && (r = e.length);
    for (var c = (r - n) / 2, l = 0, u = c - 1; l < c; u = l++) {
      var f = e[n + l * 2 + 0], h = e[n + l * 2 + 1], m = e[n + u * 2 + 0], b = e[n + u * 2 + 1], g = h > s != b > s && o < (m - f) * (s - h) / (b - h) + f;
      g && (a = !a);
    }
    return a;
  }), Xe;
}
var Le, vn;
function sr() {
  return vn || (vn = 1, Le = function(t, e, n, r) {
    var o = t[0], s = t[1], a = !1;
    n === void 0 && (n = 0), r === void 0 && (r = e.length);
    for (var c = r - n, l = 0, u = c - 1; l < c; u = l++) {
      var f = e[l + n][0], h = e[l + n][1], m = e[u + n][0], b = e[u + n][1], g = h > s != b > s && o < (m - f) * (s - h) / (b - h) + f;
      g && (a = !a);
    }
    return a;
  }), Le;
}
var yn;
function rr() {
  if (yn) return Qt.exports;
  yn = 1;
  var i = nr(), t = sr();
  return Qt.exports = function(n, r, o, s) {
    return r.length > 0 && Array.isArray(r[0]) ? t(n, r, o, s) : i(n, r, o, s);
  }, Qt.exports.nested = t, Qt.exports.flat = i, Qt.exports;
}
var ee = { exports: {} }, ir = ee.exports, bn;
function or() {
  return bn || (bn = 1, (function(i, t) {
    (function(e, n) {
      n(t);
    })(ir, function(e) {
      const r = 33306690738754706e-32;
      function o(g, _, B, v, x) {
        let d, p, w, k, M = _[0], A = v[0], N = 0, O = 0;
        A > M == A > -M ? (d = M, M = _[++N]) : (d = A, A = v[++O]);
        let C = 0;
        if (N < g && O < B) for (A > M == A > -M ? (w = d - ((p = M + d) - M), M = _[++N]) : (w = d - ((p = A + d) - A), A = v[++O]), d = p, w !== 0 && (x[C++] = w); N < g && O < B; ) A > M == A > -M ? (w = d - ((p = d + M) - (k = p - d)) + (M - k), M = _[++N]) : (w = d - ((p = d + A) - (k = p - d)) + (A - k), A = v[++O]), d = p, w !== 0 && (x[C++] = w);
        for (; N < g; ) w = d - ((p = d + M) - (k = p - d)) + (M - k), M = _[++N], d = p, w !== 0 && (x[C++] = w);
        for (; O < B; ) w = d - ((p = d + A) - (k = p - d)) + (A - k), A = v[++O], d = p, w !== 0 && (x[C++] = w);
        return d === 0 && C !== 0 || (x[C++] = d), C;
      }
      function s(g) {
        return new Float64Array(g);
      }
      const a = 33306690738754716e-32, c = 22204460492503146e-32, l = 11093356479670487e-47, u = s(4), f = s(8), h = s(12), m = s(16), b = s(4);
      e.orient2d = function(g, _, B, v, x, d) {
        const p = (_ - d) * (B - x), w = (g - x) * (v - d), k = p - w;
        if (p === 0 || w === 0 || p > 0 != w > 0) return k;
        const M = Math.abs(p + w);
        return Math.abs(k) >= a * M ? k : -(function(A, N, O, C, R, S, T) {
          let E, D, I, F, y, P, $, V, z, L, X, Y, G, j, W, H, Q, J;
          const ct = A - R, lt = O - R, ot = N - S, at = C - S;
          y = (W = (V = ct - ($ = (P = 134217729 * ct) - (P - ct))) * (L = at - (z = (P = 134217729 * at) - (P - at))) - ((j = ct * at) - $ * z - V * z - $ * L)) - (X = W - (Q = (V = ot - ($ = (P = 134217729 * ot) - (P - ot))) * (L = lt - (z = (P = 134217729 * lt) - (P - lt))) - ((H = ot * lt) - $ * z - V * z - $ * L))), u[0] = W - (X + y) + (y - Q), y = (G = j - ((Y = j + X) - (y = Y - j)) + (X - y)) - (X = G - H), u[1] = G - (X + y) + (y - H), y = (J = Y + X) - Y, u[2] = Y - (J - y) + (X - y), u[3] = J;
          let Ft = (function(vs, tn) {
            let en = tn[0];
            for (let Te = 1; Te < vs; Te++) en += tn[Te];
            return en;
          })(4, u), Jt = c * T;
          if (Ft >= Jt || -Ft >= Jt || (E = A - (ct + (y = A - ct)) + (y - R), I = O - (lt + (y = O - lt)) + (y - R), D = N - (ot + (y = N - ot)) + (y - S), F = C - (at + (y = C - at)) + (y - S), E === 0 && D === 0 && I === 0 && F === 0) || (Jt = l * T + r * Math.abs(Ft), (Ft += ct * F + at * E - (ot * I + lt * D)) >= Jt || -Ft >= Jt)) return Ft;
          y = (W = (V = E - ($ = (P = 134217729 * E) - (P - E))) * (L = at - (z = (P = 134217729 * at) - (P - at))) - ((j = E * at) - $ * z - V * z - $ * L)) - (X = W - (Q = (V = D - ($ = (P = 134217729 * D) - (P - D))) * (L = lt - (z = (P = 134217729 * lt) - (P - lt))) - ((H = D * lt) - $ * z - V * z - $ * L))), b[0] = W - (X + y) + (y - Q), y = (G = j - ((Y = j + X) - (y = Y - j)) + (X - y)) - (X = G - H), b[1] = G - (X + y) + (y - H), y = (J = Y + X) - Y, b[2] = Y - (J - y) + (X - y), b[3] = J;
          const ps = o(4, u, 4, b, f);
          y = (W = (V = ct - ($ = (P = 134217729 * ct) - (P - ct))) * (L = F - (z = (P = 134217729 * F) - (P - F))) - ((j = ct * F) - $ * z - V * z - $ * L)) - (X = W - (Q = (V = ot - ($ = (P = 134217729 * ot) - (P - ot))) * (L = I - (z = (P = 134217729 * I) - (P - I))) - ((H = ot * I) - $ * z - V * z - $ * L))), b[0] = W - (X + y) + (y - Q), y = (G = j - ((Y = j + X) - (y = Y - j)) + (X - y)) - (X = G - H), b[1] = G - (X + y) + (y - H), y = (J = Y + X) - Y, b[2] = Y - (J - y) + (X - y), b[3] = J;
          const ms = o(ps, f, 4, b, h);
          y = (W = (V = E - ($ = (P = 134217729 * E) - (P - E))) * (L = F - (z = (P = 134217729 * F) - (P - F))) - ((j = E * F) - $ * z - V * z - $ * L)) - (X = W - (Q = (V = D - ($ = (P = 134217729 * D) - (P - D))) * (L = I - (z = (P = 134217729 * I) - (P - I))) - ((H = D * I) - $ * z - V * z - $ * L))), b[0] = W - (X + y) + (y - Q), y = (G = j - ((Y = j + X) - (y = Y - j)) + (X - y)) - (X = G - H), b[1] = G - (X + y) + (y - H), y = (J = Y + X) - Y, b[2] = Y - (J - y) + (X - y), b[3] = J;
          const ws = o(ms, h, 4, b, m);
          return m[ws - 1];
        })(g, _, B, v, x, d, M);
      }, e.orient2dfast = function(g, _, B, v, x, d) {
        return (_ - d) * (B - x) - (g - x) * (v - d);
      }, Object.defineProperty(e, "__esModule", { value: !0 });
    });
  })(ee, ee.exports)), ee.exports;
}
var xn;
function ar() {
  if (xn) return pe.exports;
  xn = 1;
  var i = tr(), t = er, e = rr(), n = or().orient2d;
  t.default && (t = t.default), pe.exports = r, pe.exports.default = r;
  function r(d, p, w) {
    p = Math.max(0, p === void 0 ? 2 : p), w = w || 0;
    var k = m(d), M = new i(16);
    M.toBBox = function($) {
      return {
        minX: $[0],
        minY: $[1],
        maxX: $[0],
        maxY: $[1]
      };
    }, M.compareMinX = function($, V) {
      return $[0] - V[0];
    }, M.compareMinY = function($, V) {
      return $[1] - V[1];
    }, M.load(d);
    for (var A = [], N = 0, O; N < k.length; N++) {
      var C = k[N];
      M.remove(C), O = b(C, O), A.push(O);
    }
    var R = new i(16);
    for (N = 0; N < A.length; N++) R.insert(h(A[N]));
    for (var S = p * p, T = w * w; A.length; ) {
      var E = A.shift(), D = E.p, I = E.next.p, F = g(D, I);
      if (!(F < T)) {
        var y = F / S;
        C = o(M, E.prev.p, D, I, E.next.next.p, y, R), C && Math.min(g(C, D), g(C, I)) <= y && (A.push(E), A.push(b(C, E)), M.remove(C), R.remove(E), R.insert(h(E)), R.insert(h(E.next)));
      }
    }
    E = O;
    var P = [];
    do
      P.push(E.p), E = E.next;
    while (E !== O);
    return P.push(E.p), P;
  }
  function o(d, p, w, k, M, A, N) {
    for (var O = new t([], s), C = d.data; C; ) {
      for (var R = 0; R < C.children.length; R++) {
        var S = C.children[R], T = C.leaf ? _(S, w, k) : a(w, k, S);
        T > A || O.push({
          node: S,
          dist: T
        });
      }
      for (; O.length && !O.peek().node.children; ) {
        var E = O.pop(), D = E.node, I = _(D, p, w), F = _(D, k, M);
        if (E.dist < I && E.dist < F && l(w, D, N) && l(k, D, N)) return D;
      }
      C = O.pop(), C && (C = C.node);
    }
    return null;
  }
  function s(d, p) {
    return d.dist - p.dist;
  }
  function a(d, p, w) {
    if (c(d, w) || c(p, w)) return 0;
    var k = B(d[0], d[1], p[0], p[1], w.minX, w.minY, w.maxX, w.minY);
    if (k === 0) return 0;
    var M = B(d[0], d[1], p[0], p[1], w.minX, w.minY, w.minX, w.maxY);
    if (M === 0) return 0;
    var A = B(d[0], d[1], p[0], p[1], w.maxX, w.minY, w.maxX, w.maxY);
    if (A === 0) return 0;
    var N = B(d[0], d[1], p[0], p[1], w.minX, w.maxY, w.maxX, w.maxY);
    return N === 0 ? 0 : Math.min(k, M, A, N);
  }
  function c(d, p) {
    return d[0] >= p.minX && d[0] <= p.maxX && d[1] >= p.minY && d[1] <= p.maxY;
  }
  function l(d, p, w) {
    for (var k = Math.min(d[0], p[0]), M = Math.min(d[1], p[1]), A = Math.max(d[0], p[0]), N = Math.max(d[1], p[1]), O = w.search({ minX: k, minY: M, maxX: A, maxY: N }), C = 0; C < O.length; C++)
      if (f(O[C].p, O[C].next.p, d, p)) return !1;
    return !0;
  }
  function u(d, p, w) {
    return n(d[0], d[1], p[0], p[1], w[0], w[1]);
  }
  function f(d, p, w, k) {
    return d !== k && p !== w && u(d, p, w) > 0 != u(d, p, k) > 0 && u(w, k, d) > 0 != u(w, k, p) > 0;
  }
  function h(d) {
    var p = d.p, w = d.next.p;
    return d.minX = Math.min(p[0], w[0]), d.minY = Math.min(p[1], w[1]), d.maxX = Math.max(p[0], w[0]), d.maxY = Math.max(p[1], w[1]), d;
  }
  function m(d) {
    for (var p = d[0], w = d[0], k = d[0], M = d[0], A = 0; A < d.length; A++) {
      var N = d[A];
      N[0] < p[0] && (p = N), N[0] > k[0] && (k = N), N[1] < w[1] && (w = N), N[1] > M[1] && (M = N);
    }
    var O = [p, w, k, M], C = O.slice();
    for (A = 0; A < d.length; A++)
      e(d[A], O) || C.push(d[A]);
    return x(C);
  }
  function b(d, p) {
    var w = {
      p: d,
      prev: null,
      next: null,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };
    return p ? (w.next = p.next, w.prev = p, p.next.prev = w, p.next = w) : (w.prev = w, w.next = w), w;
  }
  function g(d, p) {
    var w = d[0] - p[0], k = d[1] - p[1];
    return w * w + k * k;
  }
  function _(d, p, w) {
    var k = p[0], M = p[1], A = w[0] - k, N = w[1] - M;
    if (A !== 0 || N !== 0) {
      var O = ((d[0] - k) * A + (d[1] - M) * N) / (A * A + N * N);
      O > 1 ? (k = w[0], M = w[1]) : O > 0 && (k += A * O, M += N * O);
    }
    return A = d[0] - k, N = d[1] - M, A * A + N * N;
  }
  function B(d, p, w, k, M, A, N, O) {
    var C = w - d, R = k - p, S = N - M, T = O - A, E = d - M, D = p - A, I = C * C + R * R, F = C * S + R * T, y = S * S + T * T, P = C * E + R * D, $ = S * E + T * D, V = I * y - F * F, z, L, X, Y, G = V, j = V;
    V === 0 ? (L = 0, G = 1, Y = $, j = y) : (L = F * $ - y * P, Y = I * $ - F * P, L < 0 ? (L = 0, Y = $, j = y) : L > G && (L = G, Y = $ + F, j = y)), Y < 0 ? (Y = 0, -P < 0 ? L = 0 : -P > I ? L = G : (L = -P, G = I)) : Y > j && (Y = j, -P + F < 0 ? L = 0 : -P + F > I ? L = G : (L = -P + F, G = I)), z = L === 0 ? 0 : L / G, X = Y === 0 ? 0 : Y / j;
    var W = (1 - z) * d + z * w, H = (1 - z) * p + z * k, Q = (1 - X) * M + X * N, J = (1 - X) * A + X * O, ct = Q - W, lt = J - H;
    return ct * ct + lt * lt;
  }
  function v(d, p) {
    return d[0] === p[0] ? d[1] - p[1] : d[0] - p[0];
  }
  function x(d) {
    d.sort(v);
    for (var p = [], w = 0; w < d.length; w++) {
      for (; p.length >= 2 && u(p[p.length - 2], p[p.length - 1], d[w]) <= 0; )
        p.pop();
      p.push(d[w]);
    }
    for (var k = [], M = d.length - 1; M >= 0; M--) {
      for (; k.length >= 2 && u(k[k.length - 2], k[k.length - 1], d[M]) <= 0; )
        k.pop();
      k.push(d[M]);
    }
    return k.pop(), p.pop(), p.concat(k);
  }
  return pe.exports;
}
var cr = ar();
const lr = /* @__PURE__ */ Hs(cr);
function Sn(i, t = {}) {
  t.concavity = t.concavity || 1 / 0;
  const e = [];
  if (We(i, (r) => {
    e.push([r[0], r[1]]);
  }), !e.length)
    return null;
  const n = lr(e, t.concavity);
  return n.length > 3 ? ae([n], t.properties) : null;
}
const Mn = Math.pow(2, -52), me = new Uint32Array(512);
class Ie {
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
  static from(t, e = gr, n = pr) {
    const r = t.length, o = new Float64Array(r * 2);
    for (let s = 0; s < r; s++) {
      const a = t[s];
      o[2 * s] = e(a), o[2 * s + 1] = n(a);
    }
    return new Ie(o);
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
    const { coords: t, _hullPrev: e, _hullNext: n, _hullTri: r, _hullHash: o } = this, s = t.length >> 1;
    let a = 1 / 0, c = 1 / 0, l = -1 / 0, u = -1 / 0;
    for (let A = 0; A < s; A++) {
      const N = t[2 * A], O = t[2 * A + 1];
      N < a && (a = N), O < c && (c = O), N > l && (l = N), O > u && (u = O), this._ids[A] = A;
    }
    const f = (a + l) / 2, h = (c + u) / 2;
    let m = 0, b = 0, g = 0;
    for (let A = 0, N = 1 / 0; A < s; A++) {
      const O = Ye(f, h, t[2 * A], t[2 * A + 1]);
      O < N && (m = A, N = O);
    }
    const _ = t[2 * m], B = t[2 * m + 1];
    for (let A = 0, N = 1 / 0; A < s; A++) {
      if (A === m) continue;
      const O = Ye(_, B, t[2 * A], t[2 * A + 1]);
      O < N && O > 0 && (b = A, N = O);
    }
    let v = t[2 * b], x = t[2 * b + 1], d = 1 / 0;
    for (let A = 0; A < s; A++) {
      if (A === m || A === b) continue;
      const N = hr(_, B, v, x, t[2 * A], t[2 * A + 1]);
      N < d && (g = A, d = N);
    }
    let p = t[2 * g], w = t[2 * g + 1];
    if (d === 1 / 0) {
      for (let O = 0; O < s; O++)
        this._dists[O] = t[2 * O] - t[0] || t[2 * O + 1] - t[1];
      Kt(this._ids, this._dists, 0, s - 1);
      const A = new Uint32Array(s);
      let N = 0;
      for (let O = 0, C = -1 / 0; O < s; O++) {
        const R = this._ids[O], S = this._dists[R];
        S > C && (A[N++] = R, C = S);
      }
      this.hull = A.subarray(0, N), this.triangles = new Uint32Array(0), this.halfedges = new Int32Array(0);
      return;
    }
    if (st(_, B, v, x, p, w) < 0) {
      const A = b, N = v, O = x;
      b = g, v = p, x = w, g = A, p = N, w = O;
    }
    const k = dr(_, B, v, x, p, w);
    this._cx = k.x, this._cy = k.y;
    for (let A = 0; A < s; A++)
      this._dists[A] = Ye(t[2 * A], t[2 * A + 1], k.x, k.y);
    Kt(this._ids, this._dists, 0, s - 1), this._hullStart = m;
    let M = 3;
    n[m] = e[g] = b, n[b] = e[m] = g, n[g] = e[b] = m, r[m] = 0, r[b] = 1, r[g] = 2, o.fill(-1), o[this._hashKey(_, B)] = m, o[this._hashKey(v, x)] = b, o[this._hashKey(p, w)] = g, this.trianglesLen = 0, this._addTriangle(m, b, g, -1, -1, -1);
    for (let A = 0, N = 0, O = 0; A < this._ids.length; A++) {
      const C = this._ids[A], R = t[2 * C], S = t[2 * C + 1];
      if (A > 0 && Math.abs(R - N) <= Mn && Math.abs(S - O) <= Mn || (N = R, O = S, C === m || C === b || C === g)) continue;
      let T = 0;
      for (let y = 0, P = this._hashKey(R, S); y < this._hashSize && (T = o[(P + y) % this._hashSize], !(T !== -1 && T !== n[T])); y++)
        ;
      T = e[T];
      let E = T, D;
      for (; D = n[E], st(R, S, t[2 * E], t[2 * E + 1], t[2 * D], t[2 * D + 1]) >= 0; )
        if (E = D, E === T) {
          E = -1;
          break;
        }
      if (E === -1) continue;
      let I = this._addTriangle(E, C, n[E], -1, -1, r[E]);
      r[C] = this._legalize(I + 2), r[E] = I, M++;
      let F = n[E];
      for (; D = n[F], st(R, S, t[2 * F], t[2 * F + 1], t[2 * D], t[2 * D + 1]) < 0; )
        I = this._addTriangle(F, C, D, r[C], -1, r[F]), r[C] = this._legalize(I + 2), n[F] = F, M--, F = D;
      if (E === T)
        for (; D = e[E], st(R, S, t[2 * D], t[2 * D + 1], t[2 * E], t[2 * E + 1]) < 0; )
          I = this._addTriangle(D, C, E, -1, r[E], r[D]), this._legalize(I + 2), r[D] = I, n[E] = E, M--, E = D;
      this._hullStart = e[C] = E, n[E] = e[F] = C, n[C] = F, o[this._hashKey(R, S)] = C, o[this._hashKey(t[2 * E], t[2 * E + 1])] = E;
    }
    this.hull = new Uint32Array(M);
    for (let A = 0, N = this._hullStart; A < M; A++)
      this.hull[A] = N, N = n[N];
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
    return Math.floor(fr(t - this._cx, e - this._cy) * this._hashSize) % this._hashSize;
  }
  /**
   * Flip an edge in a pair of triangles if it doesn't satisfy the Delaunay condition.
   *
   * @param {number} a
   * @private
   */
  _legalize(t) {
    const { _triangles: e, _halfedges: n, coords: r } = this;
    let o = 0, s = 0;
    for (; ; ) {
      const a = n[t], c = t - t % 3;
      if (s = c + (t + 2) % 3, a === -1) {
        if (o === 0) break;
        t = me[--o];
        continue;
      }
      const l = a - a % 3, u = c + (t + 1) % 3, f = l + (a + 2) % 3, h = e[s], m = e[t], b = e[u], g = e[f];
      if (ur(
        r[2 * h],
        r[2 * h + 1],
        r[2 * m],
        r[2 * m + 1],
        r[2 * b],
        r[2 * b + 1],
        r[2 * g],
        r[2 * g + 1]
      )) {
        e[t] = g, e[a] = h;
        const B = n[f];
        if (B === -1) {
          let x = this._hullStart;
          do {
            if (this._hullTri[x] === f) {
              this._hullTri[x] = t;
              break;
            }
            x = this._hullPrev[x];
          } while (x !== this._hullStart);
        }
        this._link(t, B), this._link(a, n[s]), this._link(s, f);
        const v = l + (a + 1) % 3;
        o < me.length && (me[o++] = v);
      } else {
        if (o === 0) break;
        t = me[--o];
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
  _addTriangle(t, e, n, r, o, s) {
    const a = this.trianglesLen;
    return this._triangles[a] = t, this._triangles[a + 1] = e, this._triangles[a + 2] = n, this._link(a, r), this._link(a + 1, o), this._link(a + 2, s), this.trianglesLen += 3, a;
  }
}
function fr(i, t) {
  const e = i / (Math.abs(i) + Math.abs(t));
  return (t > 0 ? 3 - e : 1 + e) / 4;
}
function Ye(i, t, e, n) {
  const r = i - e, o = t - n;
  return r * r + o * o;
}
function ur(i, t, e, n, r, o, s, a) {
  const c = i - s, l = t - a, u = e - s, f = n - a, h = r - s, m = o - a, b = c * c + l * l, g = u * u + f * f, _ = h * h + m * m;
  return c * (f * _ - g * m) - l * (u * _ - g * h) + b * (u * m - f * h) < 0;
}
function hr(i, t, e, n, r, o) {
  const s = e - i, a = n - t, c = r - i, l = o - t, u = s * s + a * a, f = c * c + l * l, h = 0.5 / (s * l - a * c), m = (l * u - a * f) * h, b = (s * f - c * u) * h;
  return m * m + b * b;
}
function dr(i, t, e, n, r, o) {
  const s = e - i, a = n - t, c = r - i, l = o - t, u = s * s + a * a, f = c * c + l * l, h = 0.5 / (s * l - a * c), m = i + (l * u - a * f) * h, b = t + (s * f - c * u) * h;
  return { x: m, y: b };
}
function Kt(i, t, e, n) {
  if (n - e <= 20)
    for (let r = e + 1; r <= n; r++) {
      const o = i[r], s = t[o];
      let a = r - 1;
      for (; a >= e && t[i[a]] > s; ) i[a + 1] = i[a--];
      i[a + 1] = o;
    }
  else {
    const r = e + n >> 1;
    let o = e + 1, s = n;
    Zt(i, r, o), t[i[e]] > t[i[n]] && Zt(i, e, n), t[i[o]] > t[i[n]] && Zt(i, o, n), t[i[e]] > t[i[o]] && Zt(i, e, o);
    const a = i[o], c = t[a];
    for (; ; ) {
      do
        o++;
      while (t[i[o]] < c);
      do
        s--;
      while (t[i[s]] > c);
      if (s < o) break;
      Zt(i, o, s);
    }
    i[e + 1] = i[s], i[s] = a, n - o + 1 >= s - e ? (Kt(i, t, o, n), Kt(i, t, e, s - 1)) : (Kt(i, t, e, s - 1), Kt(i, t, o, n));
  }
}
function Zt(i, t, e) {
  const n = i[t];
  i[t] = i[e], i[e] = n;
}
function gr(i) {
  return i[0];
}
function pr(i) {
  return i[1];
}
class mr {
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
      let r = 0;
      for (; this.bs[n] && r < this.width; )
        this.bs[n] & 1 << r && t(n * this.width + r), r++;
    }
    return this;
  }
}
class kn extends mr {
  constructor(t) {
    super(8, new Uint8Array(Math.ceil(t / 8)).fill(0));
  }
}
function Et(i) {
  return i % 3 === 2 ? i - 2 : i + 1;
}
function kt(i) {
  return i % 3 === 0 ? i + 2 : i - 1;
}
function Ue(i, t, e, n, r, o, s, a) {
  const c = st(i, t, r, o, s, a), l = st(e, n, r, o, s, a);
  if (c > 0 && l > 0 || c < 0 && l < 0)
    return !1;
  const u = st(r, o, i, t, e, n), f = st(s, a, i, t, e, n);
  return u > 0 && f > 0 || u < 0 && f < 0 ? !1 : c === 0 && l === 0 && u === 0 && f === 0 ? !(Math.max(r, s) < Math.min(i, e) || Math.max(i, e) < Math.min(r, s) || Math.max(o, a) < Math.min(t, n) || Math.max(t, n) < Math.min(o, a)) : !0;
}
class wr {
  /**
   * The triangulation object from Delaunator.
   */
  del;
  constructor(t) {
    this.del = t;
  }
}
class Ht extends wr {
  vertMap;
  flips;
  consd;
  /**
   * 全部の辺を調べる掃除（{@link delaunify} の最初の 1 回）が済んでいるか。済んだ後は、
   * 反転で触った辺（`flips` の印がある辺）だけを調べれば Delaunay 性が保たれる。
   * 掃除は制約を 1 本張るとき（`delaunify(true)`）にしか走らないので、制約を 1 本も張っていない網や、
   * 張った制約がすべて初めからある辺だった網は、まだ済んでいない。
   */
  cleaned = !1;
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
    const n = 2 ** 32 - 1, r = t.coords.length >> 1, o = t.triangles.length;
    this.vertMap = new Uint32Array(r).fill(n), this.flips = new kn(o), this.consd = new kn(o);
    for (let s = 0; s < o; s++) {
      const a = t.triangles[s];
      this.vertMap[a] === n && this.updateVert(s);
    }
    e && this.constrainAll(e);
  }
  /** 現在の三角網と制約の状態を控える（三角網の配列は複製する）。 */
  snapshot() {
    const { coords: t, hull: e, triangles: n, halfedges: r } = this.del;
    return {
      coords: t,
      hull: e,
      triangles: Uint32Array.from(n),
      halfedges: Int32Array.from(r),
      vertMap: this.vertMap.slice(),
      flips: this.flips.copyBits(),
      consd: this.consd.copyBits(),
      cleaned: this.cleaned
    };
  }
  /** {@link snapshot} で控えた状態を、新しい配列に複製して復元する（控えは何度でも使える）。 */
  static restore(t) {
    const e = new Ht({
      coords: t.coords,
      hull: t.hull,
      triangles: t.triangles.slice(),
      halfedges: t.halfedges.slice()
    });
    return e.vertMap.set(t.vertMap), e.flips.load(t.flips), e.consd.load(t.consd), e.cleaned = t.cleaned, e;
  }
  /**
   * Constrain the triangulation such that there is an edge between p1 and p2.
   */
  constrainOne(t, e) {
    const { triangles: n, halfedges: r } = this.del;
    this.assertVertex(t, t, e), this.assertVertex(e, t, e), this.assertInTriangulation(t, t, e), this.assertInTriangulation(e, t, e);
    const o = this.vertMap[t], s = this.maxConstrainSteps();
    let a = 0, c = o;
    do {
      if (++a > s)
        throw new Error(
          `Constraining edge [${t}, ${e}] exceeded the iteration limit`
        );
      const f = n[c], h = Et(c);
      if (f === e)
        return this.protect(c);
      const m = kt(c), b = n[m];
      if (b === e)
        return this.protect(h), h;
      if (this.intersectSegments(t, e, b, f)) {
        c = m;
        break;
      }
      c = r[h];
    } while (c !== -1 && c !== o);
    let l = c, u = -1;
    for (; c !== -1; ) {
      if (++a > s)
        throw new Error(
          `Constraining edge [${t}, ${e}] exceeded the iteration limit`
        );
      const f = r[c], h = kt(c), m = kt(f), b = Et(f);
      if (f === -1)
        throw new Error("Constraining edge exited the hull");
      if (this.consd.has(c))
        throw new Error("Edge intersects already constrained edge");
      if (this.isCollinear(t, e, n[c]) || this.isCollinear(t, e, n[f]))
        throw new Error("Constraining edge intersects point");
      if (!this.intersectSegments(
        n[c],
        n[f],
        n[h],
        n[m]
      )) {
        if (u === -1 && (u = c), n[m] === e) {
          if (c === u)
            throw new Error("Infinite loop: non-convex quadrilateral");
          c = u, u = -1;
          continue;
        }
        if (this.intersectSegments(
          t,
          e,
          n[m],
          n[f]
        ))
          c = m;
        else if (this.intersectSegments(
          t,
          e,
          n[b],
          n[m]
        ))
          c = b;
        else if (u === c)
          throw new Error("Infinite loop: no further intersect after non-convex");
        continue;
      }
      if (this.flipDiagonal(c), this.intersectSegments(
        t,
        e,
        n[h],
        n[m]
      ) && (u === -1 && (u = h), u === h))
        throw new Error("Infinite loop: flipped diagonal still intersects");
      n[m] === e ? (l = m, c = u, u = -1) : this.intersectSegments(
        t,
        e,
        n[b],
        n[m]
      ) && (c = b);
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
    const r = this.vertMap.length;
    if (!Number.isInteger(t) || t < 0 || t >= r)
      throw new Error(
        `Invalid edge [${String(e)}, ${String(n)}]: vertex ids must be integers from 0 to ${r - 1}`
      );
  }
  /**
   * Fix the Delaunay condition.
   *
   * 最初の 1 回（`deep` で、まだ掃除が済んでいないとき）だけは、制約でない全部の辺を調べる。
   * Delaunator の外接円の判定は浮動小数点なので、厳密な述語での掃除を 1 回は通すため。
   * その後は、反転で触った辺（`flips` の印がある辺）だけを調べる。掃除の後に Delaunay でなくなりうるのは、
   * 反転で触った辺とその周りだけで、{@link flipDiagonal} はそこに印を付けるから、結果は変わらない。
   */
  delaunify(t = !1) {
    const { halfedges: e } = this.del, n = this.flips, r = this.consd, o = e.length;
    let s, a = !(t && this.cleaned);
    do {
      s = 0;
      for (let c = 0; c < o; c++) {
        if (r.has(c) || !a && !n.has(c))
          continue;
        n.delete(c);
        const l = e[c];
        l !== -1 && (n.delete(l), this.isDelaunay(c) || (this.flipDiagonal(c), s++));
      }
      a = !1;
    } while (t && s > 0);
    return t && (this.cleaned = !0), this;
  }
  /**
   * Call constrainOne on each edge.
   */
  constrainAll(t) {
    const e = t.length;
    for (let n = 0; n < e; n++) {
      const r = t[n];
      this.constrainOne(r[0], r[1]);
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
    const { triangles: n, halfedges: r } = this.del, o = n.length / 3, s = (b, g, _) => {
      const B = t(g), v = t(_);
      return t(b).some((x) => B.includes(x) && v.includes(x));
    }, a = (b) => s(n[b * 3], n[b * 3 + 1], n[b * 3 + 2]), c = (b, g, _, B) => Math.sign(st(b[g * 2], b[g * 2 + 1], b[_ * 2], b[_ * 2 + 1], b[B * 2], b[B * 2 + 1])), l = e.map((b) => {
      let g = 0;
      for (let _ = 0; _ < o; _++) g += c(b, n[_ * 3], n[_ * 3 + 1], n[_ * 3 + 2]);
      return g < 0 ? -1 : 1;
    }), u = (b) => {
      if (this.consd.has(b)) return !1;
      const g = r[b];
      if (g === -1) return !1;
      const _ = n[b], B = n[Et(b)], v = n[kt(b)], x = n[kt(g)];
      return e.every((d, p) => c(d, v, _, x) === l[p] && c(d, x, B, v) === l[p]);
    };
    let f = 0, h = !0;
    for (; h; ) {
      h = !1;
      for (let b = 0; b < o; b++)
        if (a(b))
          for (let g = 0; g < 3; g++) {
            const _ = b * 3 + g;
            if (!u(_)) continue;
            const B = r[_], v = n[_], x = n[Et(_)], d = n[kt(_)], p = n[kt(B)];
            if (!(s(d, v, p) && s(p, x, d))) {
              this.protect(this.flipDiagonal(_)), f++, h = !0;
              break;
            }
          }
    }
    let m = 0;
    for (let b = 0; b < o; b++) a(b) && m++;
    return { flips: f, remaining: m };
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
    const n = this.vertMap[e], { triangles: r, halfedges: o } = this.del;
    if (!(n < r.length))
      return 1 / 0;
    let s = n, a, c = 0;
    do {
      if (++c > r.length)
        throw new Error(
          `Looking up edge [${t}, ${e}] exceeded the iteration limit`
        );
      if (r[s] === t)
        return s;
      a = Et(s), s = o[a];
    } while (s !== -1 && s !== n);
    return r[Et(a)] === t ? -a : 1 / 0;
  }
  /**
   * Mark an edge as constrained, i.e. should not be touched by `delaunify`.
   */
  protect(t) {
    const e = this.del.halfedges[t], n = this.flips, r = this.consd;
    return n.delete(t), r.add(t), e !== -1 ? (n.delete(e), r.add(e), e) : -t;
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
    const { triangles: e, halfedges: n } = this.del, r = this.flips, o = this.consd, s = n[t], a = kt(t), c = Et(t), l = kt(s), u = Et(s), f = n[a], h = n[l];
    if (o.has(t))
      throw new Error("Trying to flip a constrained edge");
    return e[t] = e[l], n[t] = h, r.set(t, r.has(l)) || o.set(t, o.has(l)), h !== -1 && (n[h] = t), n[a] = l, e[s] = e[a], n[s] = f, r.set(s, r.has(a)) || o.set(s, o.has(a)), f !== -1 && (n[f] = s), n[l] = a, this.markFlip(t), this.markFlip(c), this.markFlip(s), this.markFlip(u), r.add(a), o.delete(a), r.add(l), o.delete(l), this.updateVert(t), this.updateVert(c), this.updateVert(s), this.updateVert(u), a;
  }
  /**
   * Whether point p1, p2, and p are collinear.
   */
  isCollinear(t, e, n) {
    const r = this.del.coords;
    return st(
      r[t * 2],
      r[t * 2 + 1],
      r[e * 2],
      r[e * 2 + 1],
      r[n * 2],
      r[n * 2 + 1]
    ) === 0;
  }
  /**
   * Whether the triangle formed by p1, p2, p3 keeps px outside the circumcircle.
   */
  inCircle(t, e, n, r) {
    const o = this.del.coords;
    return He(
      o[t * 2],
      o[t * 2 + 1],
      o[e * 2],
      o[e * 2 + 1],
      o[n * 2],
      o[n * 2 + 1],
      o[r * 2],
      o[r * 2 + 1]
    ) < 0;
  }
  /**
   * Whether the triangles sharing edg conform to the Delaunay condition.
   */
  isDelaunay(t) {
    const { triangles: e, halfedges: n } = this.del, r = n[t];
    if (r === -1)
      return !0;
    const o = e[kt(t)], s = e[t], a = e[Et(t)], c = e[kt(r)];
    return !this.inCircle(o, s, a, c);
  }
  /**
   * Update the vertex -> incoming edge map.
   */
  updateVert(t) {
    const { triangles: e, halfedges: n } = this.del, r = this.vertMap, o = e[t];
    let s = kt(t), a = n[s];
    for (; a !== -1 && a !== t; )
      s = kt(a), a = n[s];
    return r[o] = s, s;
  }
  /**
   * Whether the segments between vertices intersect.
   */
  intersectSegments(t, e, n, r) {
    const o = this.del.coords;
    return t === n || t === r || e === n || e === r ? !1 : Ue(
      o[t * 2],
      o[t * 2 + 1],
      o[e * 2],
      o[e * 2 + 1],
      o[n * 2],
      o[n * 2 + 1],
      o[r * 2],
      o[r * 2 + 1]
    );
  }
  static intersectSegments = Ue;
}
function we(i, t, e) {
  return qe(i, t, e).tin;
}
function qe(i, t, e, n, r) {
  if (t || (t = []), typeof i != "object" || i.type !== "FeatureCollection")
    throw "Argument points must be FeatureCollection";
  if (!Array.isArray(t)) throw "Argument points must be Array of Array";
  const o = i.features.map(
    (g) => g.geometry.coordinates
  );
  let s = r?.snapshot ? Ht.restore(r.snapshot) : void 0;
  const a = s ? void 0 : Ie.from(o);
  let c = s ? s.del : a, l = 0, u;
  const f = [];
  if (c.triangles.length !== 0 && (t.length !== 0 || n)) {
    if (!s) {
      s = new Ht(c);
      try {
        s.constrainAll(t);
      } catch (B) {
        if (!n?.allowUnusableBoundary) throw B;
        return { tin: Mt([]), remaining: 0, hasBoundary: !1, hull: [] };
      }
      r && (r.snapshot = s.snapshot());
    }
    const g = n ? r?.snapshot ?? s.snapshot() : void 0, _ = (B) => {
      const v = Ht.restore(g);
      return v.constrainAll(B), v;
    };
    for (const B of n?.hull ?? [])
      try {
        s.constrainOne(B[0], B[1]), f.push(B);
      } catch {
        s = _(f);
      }
    n?.boundary && (u = vr(s, n.boundary), u || (s = _(f))), n && ({ remaining: l } = s.forbidGroupTriangles(
      n.groupsOf,
      n.planes
    ), l -= u?.size ?? 0), c = s.del;
  }
  const h = [];
  for (let g = 0; g < c.triangles.length; g += 3)
    u?.has(g / 3) || h.push([c.triangles[g], c.triangles[g + 1], c.triangles[g + 2]]);
  const m = ["a", "b", "c"];
  return { tin: Mt(
    h.map((g) => {
      const _ = {}, B = g.map((v, x) => {
        const d = i.features[v], p = d.geometry.coordinates, w = [p[0], p[1]];
        return p.length === 3 ? w[2] = p[2] : _[m[x]] = d.properties[e], w;
      });
      return B[3] = B[0], ae([B], _);
    })
  ), remaining: l, hasBoundary: u !== void 0, hull: f };
}
function vr(i, t) {
  try {
    i.constrainAll(t);
  } catch {
    return;
  }
  const e = new Map(t), { triangles: n, halfedges: r } = i.del, o = (l) => {
    const u = n[l], f = n[Et(l)];
    return e.get(u) === f || e.get(f) === u;
  }, s = /* @__PURE__ */ new Set(), a = [], c = (l) => {
    const u = Math.floor(l / 3);
    s.has(u) || (s.add(u), a.push(u));
  };
  for (let l = 0; l < r.length; l++)
    r[l] === -1 && !o(l) && c(l);
  for (let l = 0; l < a.length; l++)
    for (let u = a[l] * 3; u < a[l] * 3 + 3; u++) {
      if (!e.has(n[u])) return;
      r[u] !== -1 && !o(u) && c(r[u]);
    }
  return s;
}
function je(i) {
  const t = /* @__PURE__ */ new Set(), e = [];
  if (i.forEach(([c, l], u) => {
    const f = `${c}:${l}`;
    t.has(f) || (t.add(f), e.push({ i: u, x: c, y: l }));
  }), e.length < 3) return [];
  const n = (c, l, u) => st(c.x, c.y, l.x, l.y, u.x, u.y), r = [...e].sort((c, l) => c.x - l.x || c.y - l.y), o = (c) => {
    const l = [];
    for (const u of c) {
      for (; l.length >= 2 && n(l[l.length - 2], l[l.length - 1], u) <= 0; ) l.pop();
      l.push(u);
    }
    return l.pop(), l;
  }, s = [...o(r), ...o([...r].reverse())];
  if (s.length < 3) return [];
  const a = [];
  for (let c = 0; c < s.length; c++) {
    const l = s[c], u = s[(c + 1) % s.length], f = u.x - l.x, h = u.y - l.y, m = f * f + h * h, b = e.filter((_) => _ !== l && _ !== u && n(l, u, _) === 0).map((_) => ({ r: _, t: ((_.x - l.x) * f + (_.y - l.y) * h) / m })).filter(({ t: _ }) => _ > 0 && _ < 1).sort((_, B) => _.t - B.t).map(({ r: _ }) => _), g = [l, ...b, u];
    for (let _ = 0; _ + 1 < g.length; _++) a.push([g[_].i, g[_ + 1].i]);
  }
  return a;
}
function Me([i, t]) {
  return i < t ? `${i}-${t}` : `${t}-${i}`;
}
function jt(i, t, e) {
  return zt(i, { target: { geom: t, index: e } });
}
function Gt(i) {
  return zt(i.properties.target.geom, {
    target: {
      geom: i.geometry.coordinates,
      index: i.properties.target.index
    }
  });
}
function _n(i, t) {
  const e = i.length, n = t.geometry.coordinates;
  return Array.from({ length: e }, (r, o) => o).map((r) => {
    const o = (r + 1) % e, s = i[r], a = i[o], c = s.geometry.coordinates, l = Math.atan2(
      c[0] - n[0],
      c[1] - n[1]
    ), u = [t, s, a, t].map(
      (m) => m.geometry.coordinates
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
    }, h = Mt([
      ae([u], f)
    ]);
    return [l, h];
  }).reduce(
    (r, o) => (r[0].push(o[0]), r[1].push(o[1]), r),
    [[], []]
  );
}
const yr = [0.1, 0.15, 0.225, 0.34, 0.5];
function br(i, t) {
  return t ? i.hasBoundary !== t.hasBoundary ? i.hasBoundary : i.diagnostics.boundaryTriangleFlips < t.diagnostics.boundaryTriangleFlips : !0;
}
function En(i, t, e) {
  return Math.sign(st(i[0], i[1], t[0], t[1], e[0], e[1]));
}
function _e(i, t = -1) {
  let e = 0;
  for (const n of i.features) {
    const { a: r, b: o, c: s } = n.properties;
    if (![r, o, s].some(
      ({ index: f }) => typeof f == "string" && f.startsWith("b")
    ))
      continue;
    const [a, c, l] = n.geometry.coordinates[0];
    En(a, c, l) * En(r.geom, o.geom, s.geom) * t <= 0 && e++;
  }
  return e;
}
function An(i, t, e) {
  if (i.some(([s, a]) => s === t[0] && a === t[1])) return !1;
  const n = i.map(
    ([s, a]) => Math.atan2(a - t[1], s - t[0])
  ), r = 2 * Math.PI;
  let o = 0;
  for (let s = 0; s < n.length; s++) {
    const c = (e * (n[(s + 1) % n.length] - n[s]) + r) % r;
    if (!(c > 0 && c < Math.PI)) return !1;
    o += c;
  }
  return Math.abs(o - r) < 1e-6;
}
function In(i, t, e, n, r, o = /* @__PURE__ */ new Set(), s) {
  const { minx: a, maxx: c, miny: l, maxy: u, centroid: f } = i, h = c - a, m = u - l, b = e.forw.length, g = Array.from({ length: b }, () => []);
  let _ = 1;
  for (const [k, M] of e.edges)
    k < n && g[k].push(_), g[M].push(_), M < n && _++;
  const B = (k) => k.slice(0, b).map(({ geometry: M }) => M.coordinates), v = je(B(e.forw)), x = {
    forw: v.filter((k) => !o.has(Me(k))),
    bakw: je(B(e.bakw))
  }, d = [0], p = (k) => k >= b ? d : g[k];
  let w;
  for (const k of yr) {
    const M = s?.get(k) ?? { forwReuse: {} };
    s?.set(k, M);
    const A = M.vertices ?? (M.vertices = t(
      {
        ...i,
        minx: a - k * h,
        maxx: c + k * h,
        miny: l - k * m,
        maxy: u + k * m
      },
      !0
    ));
    if (r && (A.length < 4 || !A.every(({ bakw: L }) => L.every(Number.isFinite)))) continue;
    const N = A.map(
      ({ forw: L, bakw: X }, Y) => jt(L, X, `b${Y}`)
    ), O = Mt([...e.forw, ...N]), C = Mt([
      ...e.bakw,
      ...N.map(Gt)
    ]), R = [O, C].map(
      ({ features: L }) => Float64Array.from(
        L.flatMap(
          ({
            geometry: {
              coordinates: [X, Y]
            }
          }) => [X, Y]
        )
      )
    ), T = r !== void 0 || An(
      A.map((L) => L.forw),
      f.forw,
      -1
    ) && An(
      A.map((L) => L.bakw),
      f.bakw,
      1
    ) ? A.map((L, X) => [
      b + X,
      b + (X + 1) % A.length
    ]) : void 0, E = { groupsOf: p, planes: R, boundary: T, allowUnusableBoundary: r !== void 0 }, D = r?.orientation ?? -1, I = qe(
      O,
      e.edges,
      "target",
      { ...E, hull: x.forw },
      M.forwReuse
    ), F = M.geographic ?? (M.geographic = (() => {
      const L = qe(C, e.edges, "target", {
        ...E,
        hull: x.bakw
      });
      return { built: L, flips: _e(L.tin, D) };
    })()), y = F.built, P = I.tin, $ = {
      ...y.tin,
      features: [...y.tin.features]
    }, V = _e(P, D) + F.flips, z = {
      vertices: A,
      forw: P,
      bakw: $,
      diagnostics: {
        margin: k,
        boundaryTriangleFlips: V,
        remainingForbiddenTriangles: I.remaining + y.remaining
      },
      hasMapBoundary: I.hasBoundary,
      hasBoundary: I.hasBoundary && y.hasBoundary,
      forwHull: { all: v, applied: I.hull }
    };
    if (r) {
      if (r.accept(z)) return z;
      continue;
    }
    if (V === 0 && z.hasBoundary)
      return z;
    br(z, w) && (w = z);
  }
  return w;
}
const Bn = 1e-9;
function xr(i, t) {
  const e = [[], [], [], []], n = [];
  return Object.keys(i).forEach((r) => {
    const o = i[r], s = o.forw, a = o.bakw, c = [
      s[0] - t.forw[0],
      s[1] - t.forw[1]
    ], l = [
      a[0] - t.bakw[0],
      t.bakw[1] - a[1]
    ], u = { forw: c, bakw: l };
    if (n.push(u), c[0] === 0 || c[1] === 0)
      return;
    let f = 0;
    c[0] > 0 && (f += 1), c[1] > 0 && (f += 2), e[f].push(u);
  }), { perQuad: e, aggregate: n };
}
function ns(i) {
  let t = 1 / 0, e = 0, n = 0;
  return i.forEach((r) => {
    const { forw: o, bakw: s } = r, a = Math.hypot(o[0], o[1]), c = Math.hypot(s[0], s[1]);
    if (c === 0) return;
    const l = a / c, u = Math.atan2(o[0], o[1]) - Math.atan2(s[0], s[1]);
    t = Math.min(t, l), e += Math.cos(u), n += Math.sin(u);
  }), isFinite(t) ? [t, Math.atan2(n, e)] : [1, 0];
}
const Sr = 0.6, Mr = 3, kr = 0.5;
function _r(i) {
  let t = 0, e = 0, n = 0, r = 0;
  if (i.forEach(({ forw: s, bakw: a }) => {
    t += s[1] * a[1] + s[0] * a[0], e += s[0] * a[1] - s[1] * a[0], n += a[0] * a[0] + a[1] * a[1], r += s[0] * s[0] + s[1] * s[1];
  }), !(!(n > 0 && r > 0) || !(Math.hypot(t, e) / Math.sqrt(r * n) >= kr)))
    return [Math.hypot(t, e) / n, Math.atan2(e, t)];
}
function Er(i) {
  const t = (r) => Math.hypot(r.forw[0], r.forw[1]), e = Math.max(...i.map(t)), n = i.filter((r) => t(r) >= Sr * e);
  return _r(n.length >= Mr ? n : i) ?? ns(i);
}
function Ar(i, t, e, n) {
  const { perQuad: r, aggregate: o } = xr(i, t), s = r.every((u) => u.length > 0), a = e === "birdeye" ? s ? r : [o] : [o], c = n === "farLsq" ? Er : ns, l = a.map((u) => c(u));
  return l.length === 1 ? [l[0], l[0], l[0], l[0]] : l;
}
function Ir(i, t) {
  let e = 0;
  return i[0] > t[0] && (e += 1), i[1] > t[1] && (e += 2), e;
}
function Br(i, t, e) {
  const n = [
    i[0] - t.forw[0],
    i[1] - t.forw[1]
  ], o = Math.sqrt(n[0] ** 2 + n[1] ** 2) / e[0], s = Math.atan2(n[0], n[1]) - e[1];
  return [
    t.bakw[0] + o * Math.sin(s),
    t.bakw[1] - o * Math.cos(s)
  ];
}
function Tr(i, t, e, n) {
  const r = t[0] - i[0], o = t[1] - i[1];
  if (Math.abs(r) < 1e-12 && Math.abs(o) < 1e-12) return null;
  const s = n[0] - e[0], a = n[1] - e[1], c = e[0] - i[0], l = e[1] - i[1], u = r * a - o * s;
  if (Math.abs(u) < 1e-12) return null;
  const f = (c * a - l * s) / u, h = (c * o - l * r) / u;
  return f <= 1e-10 || h < -1e-10 || h > 1 + 1e-10 ? null : { t: f, point: [i[0] + f * r, i[1] + f * o] };
}
function Or(i, t, e) {
  const n = e.length;
  let r = -1 / 0, o = null;
  for (let s = 0; s < n; s++) {
    const a = (s + 1) % n, c = Tr(
      i,
      t,
      e[s].bakw,
      e[a].bakw
    );
    c && c.t > r && (r = c.t, o = c.point);
  }
  return o;
}
function Tn(i, t) {
  return Math.floor(Ge(i, t) / 10) % 36;
}
function Ge(i, t) {
  const n = Math.atan2(i[0] - t[0], i[1] - t[1]) * (180 / Math.PI);
  return n < 0 ? n + 360 : n;
}
function On(i, t, e, n, r, o) {
  const s = t[0] - i[0], a = t[1] - i[1];
  if (s === 0 && a === 0) return null;
  const c = [];
  if (s !== 0)
    for (const u of [e, n]) {
      const f = (u - i[0]) / s;
      if (f > 0) {
        const h = i[1] + f * a;
        h >= r && h <= o && c.push({ t: f, x: u, y: h });
      }
    }
  if (a !== 0)
    for (const u of [r, o]) {
      const f = (u - i[1]) / a;
      if (f > 0) {
        const h = i[0] + f * s;
        h >= e && h <= n && c.push({ t: f, x: h, y: u });
      }
    }
  if (c.length === 0) return null;
  c.sort((u, f) => u.t - f.t);
  const l = c[0];
  return [l.x, l.y];
}
function Fr(i, t, e, n) {
  const r = i[0], o = i[1], s = t[0], a = t[1], c = e[0], l = e[1], u = n[0], f = n[1];
  if (!(Number.isFinite(r) && Number.isFinite(o) && Number.isFinite(s) && Number.isFinite(a) && Number.isFinite(c) && Number.isFinite(l) && Number.isFinite(u) && Number.isFinite(f)) || r === c || r === u || s === c || s === u || r === s && o === a || c === u && l === f) {
    const P = Ws(sn([i, t]), sn([e, n]));
    return P.features.length > 0 && P.features[0].geometry ? P.features[0].geometry.coordinates : null;
  }
  const h = r > s || r === s && o > a, m = h ? s : r, b = h ? a : o, g = h ? r : s, _ = h ? o : a, B = c > u || c === u && l > f, v = B ? u : c, x = B ? f : l, d = B ? c : u, p = B ? l : f;
  let w, k, M, A, N, O, C, R;
  if (m < v) {
    if (g < v) return null;
    w = v, k = x, M = d, A = p, N = m, O = b, C = g, R = _;
  } else {
    if (d < m) return null;
    w = m, k = b, M = g, A = _, N = v, O = x, C = d, R = p;
  }
  const S = st(w, k, M, A, N, O), T = st(w, k, M, A, C, R);
  if (S > 0 && T > 0 || S < 0 && T < 0) return null;
  const E = (R - O) * (M - w) - (C - N) * (A - k), D = (C - N) * (k - O) - (R - O) * (w - N), I = (M - w) * (k - O) - (A - k) * (w - N);
  if (E === 0) return null;
  const F = D / E, y = I / E;
  return F >= 0 && F <= 1 && y >= 0 && y <= 1 ? [w + F * (M - w), k + F * (A - k)] : null;
}
function Fn(i, t, e) {
  const n = i.length, r = new Array(n).fill(1);
  for (const o of t)
    for (let s = 0; s < n; s++) {
      const a = (s + 1) % n, c = Fr(
        i[s].bakw,
        i[a].bakw,
        e.bakw,
        o.bakw
      );
      if (c) {
        const l = Math.sqrt(
          Math.pow(o.bakw[0] - e.bakw[0], 2) + Math.pow(o.bakw[1] - e.bakw[1], 2)
        ), u = Math.sqrt(
          Math.pow(c[0] - e.bakw[0], 2) + Math.pow(c[1] - e.bakw[1], 2)
        ), f = l / u;
        f > r[s] && (r[s] = f), f > r[a] && (r[a] = f);
      }
    }
  i.forEach((o, s) => {
    const a = r[s];
    o.bakw = [
      (o.bakw[0] - e.bakw[0]) * a + e.bakw[0],
      (o.bakw[1] - e.bakw[1]) * a + e.bakw[1]
    ];
  });
}
function Qe(i, t, e, n, r) {
  const { convexBuf: o, centroid: s, allGcps: a, minx: c, maxx: l, miny: u, maxy: f } = i, h = r ? void 0 : Ar(o, s, t, n), b = [
    [c, u],
    [l, u],
    [l, f],
    [c, f]
  ].map((M) => ({
    forw: M,
    bakw: r ? r(M) : Br(
      M,
      s,
      h[Ir(M, s.forw)]
    )
  }));
  if (b.sort(
    (M, A) => Math.atan2(M.forw[0] - s.forw[0], M.forw[1] - s.forw[1]) - Math.atan2(A.forw[0] - s.forw[0], A.forw[1] - s.forw[1])
  ), r || Fn(b, a, s), !e || i.ring?.cornersOnly) return b;
  const g = 4, _ = b.map(
    (M) => Math.atan2(M.forw[0] - s.forw[0], M.forw[1] - s.forw[1])
  ), B = b.map(
    (M) => Math.atan2(
      M.bakw[0] - s.bakw[0],
      -(M.bakw[1] - s.bakw[1])
    )
  );
  function v(M) {
    for (let A = 0; A < g; A++) {
      const N = (A + 1) % g, O = _[A], C = A < g - 1 ? _[N] : _[N] + 2 * Math.PI;
      let R = M;
      for (; R < O; ) R += 2 * Math.PI;
      for (; R >= O + 2 * Math.PI; ) R -= 2 * Math.PI;
      if (R >= O && R < C)
        return { i: A, j: N, frac: (R - O) / (C - O) };
    }
    return { i: 0, j: 1, frac: 0 };
  }
  function x(M) {
    const { i: A, j: N, frac: O } = v(M), C = B[A];
    let S = B[N] - C;
    for (; S > Math.PI; ) S -= 2 * Math.PI;
    for (; S < -Math.PI; ) S += 2 * Math.PI;
    return C + O * S;
  }
  const d = new Set(
    b.map(
      (M) => Math.floor(Ge(M.forw, s.forw) / 10) % 36
    )
  ), p = a.map((M) => ({
    forw: M.forw,
    bakw: M.bakw,
    angleDeg: Ge(M.forw, s.forw),
    forwDist: Math.hypot(M.forw[0] - s.forw[0], M.forw[1] - s.forw[1])
  })), w = [];
  for (let M = 0; M < 36; M++) {
    if (d.has(M) || i.ring?.skipBins?.has(M)) continue;
    const A = M * 10, N = p.filter((y) => {
      if (y.forwDist === 0) return !1;
      const P = ((y.angleDeg - A) % 360 + 360) % 360;
      return P < 10 + Bn || P > 360 - Bn;
    });
    let O = null;
    if (N.length > 0) {
      const y = N.reduce((P, $) => $.forwDist > P.forwDist ? $ : P);
      O = On(s.forw, y.forw, c, l, u, f);
    }
    if (!O) {
      const y = (A + 5) % 360 * (Math.PI / 180), P = [
        s.forw[0] + Math.sin(y),
        s.forw[1] + Math.cos(y)
      ];
      O = On(s.forw, P, c, l, u, f);
    }
    if (!O) continue;
    const [C, R] = O, S = 1e-9 * Math.max(l - c, f - u);
    if ([...b, ...w].some(
      (y) => Math.abs(y.forw[0] - C) <= S && Math.abs(y.forw[1] - R) <= S
    )) continue;
    if (r) {
      w.push({ forw: O, bakw: r(O) });
      continue;
    }
    const T = [O[0] - s.forw[0], O[1] - s.forw[1]], E = Math.atan2(T[0], T[1]), D = x(E), I = [
      s.bakw[0] + Math.sin(D),
      s.bakw[1] - Math.cos(D)
    ], F = Or(s.bakw, I, b);
    F && w.push({ forw: O, bakw: F });
  }
  const k = [...b, ...w];
  return k.sort(
    (M, A) => Math.atan2(M.forw[0] - s.forw[0], M.forw[1] - s.forw[1]) - Math.atan2(A.forw[0] - s.forw[0], A.forw[1] - s.forw[1])
  ), r || Fn(k, a, s), k;
}
function Nr(i, t = !1) {
  return Qe(i, "plain", t, t ? "farLsq" : "min");
}
function Pr(i, t = !1) {
  return Qe(i, "birdeye", t, "min");
}
function Dr(i, t) {
  const e = /* @__PURE__ */ new Set();
  return Qe(i, "plain", !0, "min", t).filter(({ forw: [n, r] }) => {
    const o = `${n}:${r}`;
    return e.has(o) ? !1 : (e.add(o), !0);
  });
}
const Nn = (i) => typeof i == "string" && i.startsWith("b");
function Rr(i, t) {
  const e = (n, r) => {
    for (let o = 0; o < 3; o++) {
      const s = n.g[o], a = n.g[(o + 1) % 3];
      if (r.g.every((c) => n.sign * st(s[0], s[1], a[0], a[1], c[0], c[1]) <= 0)) return !0;
    }
    return !1;
  };
  return !e(i, t) && !e(t, i);
}
function Cr(i) {
  const t = i.features.map((a) => {
    const { a: c, b: l, c: u } = a.properties, f = [c.geom, l.geom, u.geom], h = a.geometry.coordinates[0].slice(0, 3), m = f.map(([B]) => B), b = f.map(([, B]) => B), g = Math.sign(st(h[0][0], h[0][1], h[1][0], h[1][1], h[2][0], h[2][1])), _ = Math.sign(st(f[0][0], f[0][1], f[1][0], f[1][1], f[2][0], f[2][1]));
    return {
      ids: [c.index, l.index, u.index],
      f: h,
      g: f,
      sign: _,
      ratio: g * _,
      aux: [c.index, l.index, u.index].some(Nn),
      minx: Math.min(...m),
      maxx: Math.max(...m),
      miny: Math.min(...b),
      maxy: Math.max(...b)
    };
  }), e = t.map((a) => a.ratio), n = e.reduce((a, c) => a + c, 0) < 0 ? -1 : 1, r = /* @__PURE__ */ new Set();
  t.forEach((a, c) => {
    a.aux && (e[c] === 0 || e[c] !== n) && r.add(c);
  });
  const o = t.map((a, c) => c).sort((a, c) => t[a].minx - t[c].minx);
  for (let a = 0; a < o.length; a++) {
    const c = t[o[a]];
    if (c.sign !== 0)
      for (let l = a + 1; l < o.length; l++) {
        const u = t[o[l]];
        if (u.minx >= c.maxx) break;
        u.sign === 0 || u.miny >= c.maxy || c.miny >= u.maxy || !c.aux && !u.aux || Rr(c, u) && (r.add(o[a]), r.add(o[l]));
      }
  }
  const s = /* @__PURE__ */ new Map();
  for (const a of r)
    t[a].ids.forEach((c, l) => {
      Nn(c) && s.set(String(c), t[a].f[l]);
    });
  return [...s.values()];
}
function Yi(i) {
  return ss(i, 1 / 0);
}
const Pn = 1e5, $r = 16;
function ss(i, t) {
  return Vr(i), new Xr(i).findSegmentIntersections(t).map(
    (r) => zt([r.x, r.y])
  );
}
function Vr(i) {
  for (let t = 0, e = i.length; t < e; t++) {
    const n = i[t];
    ie(n) || Yt(
      "findIntersections() received invalid coordinates:",
      `line=${t}`,
      `points=${n}`
    );
    for (let r = 0, o = n.length; r < o; r++) {
      const s = n[r];
      (!ie(s) || !Number.isFinite(s[0]) || !Number.isFinite(s[1])) && Yt(
        "findIntersections() received non-finite coordinates:",
        `line=${t}`,
        `point=${r}`,
        `coordinates=${JSON.stringify(s)}`
      );
    }
  }
}
class Xr {
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
    const e = [], n = [], r = t.map((o) => {
      const s = o ? o.length : 0;
      for (let a = 0; a < s; a++)
        e.push(o[a][0]), n.push(o[a][1]);
      return s;
    });
    this.initXYData(r, e, n);
  }
  initXYData(t, e, n) {
    const r = t.length;
    this._xx = new Float64Array(e), this._yy = new Float64Array(n), this._nn = new Uint32Array(t), this._zz = null, this._zlimit = 0, this._filteredArcIter = null, this._ii = new Uint32Array(r);
    let o = 0;
    for (let s = 0; s < r; s++)
      this._ii[s] = o, o += t[s];
    (o != this._xx.length || this._xx.length != this._yy.length) && Yt("ArcCollection#initXYData() Counting error"), this.initBounds(), this._arcIter = new oi(this._xx, this._yy);
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
    const r = n.length, o = new Float64Array(r * 4), s = new oe();
    let a = 0, c, l, u;
    for (let f = 0; f < r; f++)
      c = n[f], c > 0 && (l = f * 4, u = ai(t, e, a, c), o[l++] = u[0], o[l++] = u[1], o[l++] = u[2], o[l] = u[3], a += c, s.mergeBounds(u));
    return {
      bb: o,
      bounds: s
    };
  }
  getBounds() {
    return this._allBounds ? this._allBounds.clone() : new oe();
  }
  // @cb function(i, j, xx, yy)
  forEachSegment(t) {
    let e = 0;
    for (let n = 0, r = this.size(); n < r; n++)
      e += this.forEachArcSegment(n, t);
    return e;
  }
  size() {
    return this._ii && this._ii.length || 0;
  }
  // @cb function(i, j, xx, yy)
  forEachArcSegment(t, e) {
    const n = t >= 0, r = n ? t : ~t, o = this.getRetainedInterval(), s = this._nn[r], a = n ? 1 : -1;
    let c = n ? this._ii[r] : this._ii[r] + s - 1, l = c, u = 0;
    for (let f = 1; f < s; f++)
      l += a, (o === 0 || this._zz[l] >= o) && (e(c, l, this._xx, this._yy), c = l, u++);
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
    const e = t * 4;
    return (!this.buf || this.buf.byteLength < e) && (this.buf = new ArrayBuffer(e)), new Uint32Array(this.buf, 0, t);
  }
  // Return average magnitudes of dx, dy (with simplification)
  getAvgSegment2() {
    let t = 0, e = 0;
    const n = this.forEachSegment(
      (r, o, s, a) => {
        t += Math.abs(s[r] - s[o]), e += Math.abs(a[r] - a[o]);
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
    const e = this.getBounds(), n = e.ymin || 0, r = (e.ymax || 0) - n, o = this.calcSegmentIntersectionStripeCount(), s = new Uint32Array(o), a = o > 1 ? (x) => Math.floor((o - 1) * (x - n) / r) : () => 0, c = o + 1;
    let l;
    this.forEachSegment(
      (x, d, p, w) => {
        let k = a(w[x]);
        const M = a(w[d]);
        let A = 0;
        for (; s[k] = s[k] + 2, k != M; )
          A++, A > c && Yt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${o}`,
            `s1=${k}`,
            `s2=${M}`
          ), k += M > k ? 1 : -1;
      }
    );
    const u = this.getUint32Array(zr(s));
    let f = 0;
    const h = [];
    Ur(s, (x) => {
      const d = f;
      f += x, h.push(u.subarray(d, f));
    }), qr(s, 0), this.forEachSegment(
      (x, d, p, w) => {
        let k = a(w[x]);
        const M = a(w[d]);
        let A, N, O = 0;
        for (; A = s[k], s[k] = A + 2, N = h[k], N[A] = x, N[A + 1] = d, k != M; )
          O++, O > c && Yt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${o}`,
            `s1=${k}`,
            `s2=${M}`
          ), k += M > k ? 1 : -1;
      }
    );
    const m = this.getVertexData(), b = t * $r;
    let g = 0;
    const _ = /* @__PURE__ */ new Set(), B = /* @__PURE__ */ new Map(), v = (x) => {
      g++;
      const d = ii(x);
      return _.has(d) || (_.add(d), B.set(`${x.x}:${x.y}`, x)), B.size >= t || g >= b;
    };
    if (m.xx && m.yy)
      for (l = 0; l < o && !jr(h[l], m.xx, m.yy, v); l++)
        ;
    return Array.from(B.values());
  }
}
function Yt(...i) {
  const t = i.join(" ");
  throw new Error(t);
}
function ie(i) {
  return i ? Yr(i) ? !0 : Lr(i) ? !1 : i.length === 0 ? !0 : i.length > 0 : !1;
}
function Lr(i) {
  return i != null && i.toString === String.prototype.toString;
}
function Yr(i) {
  return Array.isArray(i);
}
function zr(i, t) {
  ie(i) || Yt("utils.sum() expects an array, received:", i);
  let e = 0, n;
  for (let r = 0, o = i.length; r < o; r++)
    n = i[r], n && (e += n);
  return e;
}
function Ur(i, t, e) {
  if (!ie(i))
    throw new Error(`#forEach() takes an array-like argument. ${i}`);
  for (let n = 0, r = i.length; n < r; n++)
    t.call(e, i[n], n);
}
function qr(i, t) {
  for (let e = 0, n = i.length; e < n; e++)
    i[e] = t;
  return i;
}
function jr(i, t, e, n) {
  const r = i.length - 2;
  let o, s, a, c, l, u, f, h, m, b, g, _, B, v, x, d, p;
  for (ni(t, i), d = 0; d < r; ) {
    for (o = i[d], s = i[d + 1], l = t[o], u = t[s], m = e[o], b = e[s], p = d; p < r && (p += 2, a = i[p], f = t[a], !(u < f)); ) {
      if (g = e[a], c = i[p + 1], h = t[c], _ = e[c], m >= g) {
        if (m > _ && b > g && b > _) continue;
      } else if (m < _ && b < g && b < _) continue;
      if (!(o == a || o == c || s == a || s == c) && (B = Gr(
        l,
        m,
        u,
        b,
        f,
        g,
        h,
        _
      ), B && (v = [o, s], x = [a, c], n(Rn(B, v, x, t, e)) || B.length == 4 && n(Rn(B.slice(2), v, x, t, e)))))
        return !0;
    }
    d += 2;
  }
  return !1;
}
function Gr(i, t, e, n, r, o, s, a) {
  const c = Kr(i, t, e, n, r, o, s, a);
  let l = null;
  return c && (l = Wr(i, t, e, n, r, o, s, a), l ? ei(i, t, e, n, r, o, s, a) && (l = null) : l = ti(i, t, e, n, r, o, s, a)), l;
}
function Kr(i, t, e, n, r, o, s, a) {
  return ne(i, t, e, n, r, o) * ne(i, t, e, n, s, a) <= 0 && ne(r, o, s, a, i, t) * ne(r, o, s, a, e, n) <= 0;
}
function ne(i, t, e, n, r, o) {
  return rs(i - r, t - o, e - r, n - o);
}
function rs(i, t, e, n) {
  return i * n - t * e;
}
function Wr(i, t, e, n, r, o, s, a) {
  let c = ve(i, t, e, n, r, o, s, a), l;
  return c && (l = Jr(c[0], c[1], i, t, e, n, r, o, s, a), l == 1 ? c = ve(e, n, i, t, r, o, s, a) : l == 2 ? c = ve(r, o, s, a, i, t, e, n) : l == 3 && (c = ve(s, a, r, o, i, t, e, n))), c && Zr(c, i, t, e, n, r, o, s, a), c;
}
function ve(i, t, e, n, r, o, s, a) {
  const c = rs(e - i, n - t, s - r, a - o), l = 1e-18;
  let u;
  if (c === 0) return null;
  const f = ne(r, o, s, a, i, t) / c;
  return c <= l && c >= -l ? u = Hr(i, t, e, n, r, o, s, a) : u = [i + f * (e - i), t + f * (n - t)], u;
}
function Hr(i, t, e, n, r, o, s, a) {
  let c = null;
  return !Tt(i, r, s) && !Tt(t, o, a) ? c = [i, t] : !Tt(e, r, s) && !Tt(n, o, a) ? c = [e, n] : !Tt(r, i, e) && !Tt(o, t, n) ? c = [r, o] : !Tt(s, i, e) && !Tt(a, t, n) && (c = [s, a]), c;
}
function Tt(i, t, e) {
  let n;
  return t < e ? n = i < t || i > e : t > e ? n = i > t || i < e : n = i != t, n;
}
function Jr(i, t, ...e) {
  let n = -1, r = 1 / 0, o;
  for (let s = 0, a = 0, c = e.length; a < c; s++, a += 2)
    o = Qr(i, t, e[a], e[a + 1]), o < r && (r = o, n = s);
  return n;
}
function Qr(i, t, e, n) {
  const r = i - e, o = t - n;
  return r * r + o * o;
}
function Zr(i, t, e, n, r, o, s, a, c) {
  let l = i[0], u = i[1];
  l = ye(l, t, n), l = ye(l, o, a), u = ye(u, e, r), u = ye(u, s, c), i[0] = l, i[1] = u;
}
function ye(i, t, e) {
  let n;
  return Tt(i, t, e) && (n = Math.abs(i - t) < Math.abs(i - e) ? t : e, i = n), i;
}
function ti(i, t, e, n, r, o, s, a) {
  const c = Math.min(i, e, r, s), l = Math.max(i, e, r, s), u = Math.min(t, n, o, a), f = Math.max(t, n, o, a), h = f - u > l - c;
  let m = [];
  return (h ? Ct(t, u, f) : Ct(i, c, l)) && m.push(i, t), (h ? Ct(n, u, f) : Ct(e, c, l)) && m.push(e, n), (h ? Ct(o, u, f) : Ct(r, c, l)) && m.push(r, o), (h ? Ct(a, u, f) : Ct(s, c, l)) && m.push(s, a), (m.length != 2 && m.length != 4 || m.length == 4 && m[0] == m[2] && m[1] == m[3]) && (m = null), m;
}
function ei(i, t, e, n, r, o, s, a) {
  return i == r && t == o || i == s && t == a || e == r && n == o || e == s && n == a;
}
function Ct(i, t, e) {
  return i > t && i < e;
}
function ni(i, t) {
  si(i, t), is(i, t, 0, t.length - 2);
}
function si(i, t) {
  for (let e = 0, n = t.length; e < n; e += 2)
    i[t[e]] > i[t[e + 1]] && ri(t, e, e + 1);
}
function ri(i, t, e) {
  const n = i[t];
  i[t] = i[e], i[e] = n;
}
function is(i, t, e, n) {
  let r = e, o = n, s, a;
  for (; r < n; ) {
    for (s = i[t[e + n >> 2 << 1]]; r <= o; ) {
      for (; i[t[r]] < s; ) r += 2;
      for (; i[t[o]] > s; ) o -= 2;
      r <= o && (a = t[r], t[r] = t[o], t[o] = a, a = t[r + 1], t[r + 1] = t[o + 1], t[o + 1] = a, r += 2, o -= 2);
    }
    if (o - e < 40 ? Dn(i, t, e, o) : is(i, t, e, o), n - r < 40) {
      Dn(i, t, r, n);
      return;
    }
    e = r, o = n;
  }
}
function Dn(i, t, e, n) {
  let r, o;
  for (let s = e + 2; s <= n; s += 2) {
    r = t[s], o = t[s + 1];
    let a;
    for (a = s - 2; a >= e && i[r] < i[t[a]]; a -= 2)
      t[a + 2] = t[a], t[a + 3] = t[a + 1];
    t[a + 2] = r, t[a + 3] = o;
  }
}
function Rn(i, t, e, n, r) {
  const o = i[0], s = i[1];
  t = Cn(o, s, t[0], t[1], n, r), e = Cn(o, s, e[0], e[1], n, r);
  const a = t[0] < e[0] ? t : e, c = a == t ? e : t;
  return { x: o, y: s, a, b: c };
}
function Cn(i, t, e, n, r, o) {
  let s = e < n ? e : n, a = s === e ? n : e;
  return r[s] == i && o[s] == t ? a = s : r[a] == i && o[a] == t && (s = a), [s, a];
}
function ii(i) {
  return `${i.a.join(",")};${i.b.join(",")}`;
}
class oi {
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
function ai(i, t, e, n) {
  let r = e | 0;
  const o = isNaN(n) ? i.length - r : n + r;
  let s, a, c, l, u, f;
  if (o > 0)
    c = u = i[r], l = f = t[r];
  else return [void 0, void 0, void 0, void 0];
  for (r++; r < o; r++)
    s = i[r], a = t[r], s < c && (c = s), s > u && (u = s), a < l && (l = a), a > f && (f = a);
  return [c, l, u, f];
}
class oe {
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
    return new oe(
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
  setBounds(t, e, n, r) {
    let o, s, a, c;
    if (arguments.length == 1)
      if (ie(t)) {
        const l = t;
        o = l[0], s = l[1], a = l[2], c = l[3];
      } else {
        const l = t;
        o = l.xmin, s = l.ymin, a = l.xmax, c = l.ymax;
      }
    else
      o = t, s = e, a = n, c = r;
    return this.xmin = o, this.ymin = s, this.xmax = a, this.ymax = c, (o > a || s > c) && this.update(), this;
  }
  update() {
    let t;
    this.xmin > this.xmax && (t = this.xmin, this.xmin = this.xmax, this.xmax = t), this.ymin > this.ymax && (t = this.ymin, this.ymin = this.ymax, this.ymax = t);
  }
  mergeBounds(t, ...e) {
    let n, r, o, s;
    return t instanceof oe ? (n = t.xmin, r = t.ymin, o = t.xmax, s = t.ymax) : e.length == 3 ? (n = t, r = e[0], o = e[1], s = e[2]) : t.length == 4 ? (n = t[0], r = t[1], o = t[2], s = t[3]) : Yt("Bounds#mergeBounds() invalid argument:", t), this.xmin === void 0 ? this.setBounds(n, r, o, s) : (n < this.xmin && (this.xmin = n), r < this.ymin && (this.ymin = r), o > this.xmax && (this.xmax = o), s > this.ymax && (this.ymax = s)), this;
  }
}
function Ee(i) {
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
function os(i, t, e) {
  const n = Ee(t.forw), r = Ee(t.bakw);
  if (JSON.stringify(n) != JSON.stringify(r))
    throw `${JSON.stringify(t, null, 2)}
${JSON.stringify(
      n
    )}
${JSON.stringify(r)}`;
  for (let o = 0; o < n.length; o++) {
    const s = n[o];
    i[s] || (i[s] = []), i[s].push(t);
  }
  e && (e.forw.features.push(t.forw), e.bakw.features.push(t.bakw));
}
function $n(i, t, e) {
  const n = Ee(t.forw), r = Ee(t.bakw);
  if (JSON.stringify(n) != JSON.stringify(r))
    throw `${JSON.stringify(t, null, 2)}
${JSON.stringify(n)}
${JSON.stringify(r)}`;
  if (n.forEach((o) => {
    const s = i[o];
    if (!s) return;
    const a = s.filter((c) => c !== t);
    a.length === 0 ? delete i[o] : i[o] = a;
  }), e) {
    const o = (s, a) => {
      !s || !a || (s.features = s.features.filter((c) => c !== a));
    };
    o(e.forw, t.forw), o(e.bakw, t.bakw);
  }
}
function be(i, t = 1e-6) {
  const [e, n] = i[0], [r, o] = i[1], [s, a] = i[2];
  return Math.abs((r - e) * (a - n) - (s - e) * (o - n)) < t;
}
function ci(i, t) {
  const e = /* @__PURE__ */ new Set();
  return i.forEach((n) => {
    if (n.length !== 2) return;
    const r = n.map((o) => `${t?.[o] ?? o}`);
    e.add(r.sort().join("-"));
  }), e;
}
function se(i) {
  return ["a", "b", "c"].map((t, e) => ({
    prop: i.properties[t],
    geom: i.geometry.coordinates[0][e]
  }));
}
const li = 10;
function fi(i, t, e, n, r, o) {
  if (!i && !t) return !1;
  const s = i ? 0 : 1, a = 1 - s, c = e[s], l = e[a];
  if (!c || !l) return !1;
  const u = St(l.geom);
  let f = !1, h = !1;
  for (let m = 0; m <= 1; m++) {
    const b = n[m];
    if (!b) continue;
    const g = [String(b.prop.index), String(c.prop.index)].sort().join("-"), _ = r[g];
    if (!_ || _.length < 2) continue;
    const B = _.find(
      (O) => O.bakw !== o[s].bakw
    );
    if (!B) continue;
    const x = se(B.bakw).find(
      (O) => String(O.prop.index) !== String(b.prop.index) && String(O.prop.index) !== String(c.prop.index)
    );
    if (!x) continue;
    f = !0;
    const d = St(x.geom), p = St(b.geom), w = St(c.geom), k = w[0] - p[0], M = w[1] - p[1], A = k * (u[1] - p[1]) - M * (u[0] - p[0]), N = k * (d[1] - p[1]) - M * (d[0] - p[0]);
    if (A * N > 0) {
      h = !0;
      break;
    }
  }
  return f && !h;
}
function ui(i, t, e, n) {
  if (!i && !t) return !1;
  if (e[0] && e[1] && n[0] && n[1]) {
    const r = n.map((u) => St(u.geom)), o = e.map((u) => St(u.geom)), s = r[1][0] - r[0][0], a = r[1][1] - r[0][1], c = s * (o[0][1] - r[0][1]) - a * (o[0][0] - r[0][0]), l = s * (o[1][1] - r[0][1]) - a * (o[1][0] - r[0][0]);
    return c * l < 0;
  }
  return !1;
}
function hi(i, t, e, n) {
  const r = ci(e, n), o = /* @__PURE__ */ new Set();
  let s = !1;
  for (let a = 0; a < li; a++) {
    let c = !1;
    for (const l of Object.keys(t)) {
      if (o.has(l)) continue;
      o.add(l);
      const u = t[l];
      if (!u || u.length < 2) continue;
      const f = l.split("-");
      if (f.length !== 2 || r.has(l)) continue;
      const h = se(u[0].bakw), m = se(u[1].bakw), b = se(u[0].forw), g = se(u[1].forw), _ = f.map(
        (y) => h.find((P) => `${P.prop.index}` === y) || m.find((P) => `${P.prop.index}` === y)
      ), B = f.map(
        (y) => b.find((P) => `${P.prop.index}` === y) || g.find((P) => `${P.prop.index}` === y)
      );
      if (_.some((y) => !y) || B.some((y) => !y))
        continue;
      const v = [h, m].map(
        (y) => y.find((P) => !f.includes(`${P.prop.index}`))
      ), x = [b, g].map(
        (y) => y.find((P) => !f.includes(`${P.prop.index}`))
      );
      if (v.some((y) => !y) || x.some((y) => !y))
        continue;
      const d = u[0].bakw.geometry.coordinates[0].slice(0, 3).map((y) => St(y)), p = u[1].bakw.geometry.coordinates[0].slice(0, 3).map((y) => St(y)), w = u[0].forw.geometry.coordinates[0].slice(0, 3).map((y) => St(y)), k = u[1].forw.geometry.coordinates[0].slice(0, 3).map((y) => St(y)), M = be(d), A = be(p), N = be(w), O = be(k), C = fi(
        M,
        A,
        v,
        _,
        t,
        u
      ), R = ui(
        N,
        O,
        v,
        _
      );
      if (!(C || R || Vn(
        St(v[0].geom),
        p
      ) || Vn(
        St(v[1].geom),
        d
      )))
        continue;
      const T = B.map(
        (y) => St(y.geom)
      ), E = x.map(
        (y) => St(y.geom)
      ), D = di([
        ...T,
        ...E
      ]), I = gi(D), F = Xn(
        T[0],
        T[1],
        E[0]
      ) + Xn(
        T[0],
        T[1],
        E[1]
      );
      Ke(I, F) && ($n(t, u[0], i), $n(t, u[1], i), _.forEach((y) => {
        if (!y) return;
        const P = [
          y.geom,
          v[0].geom,
          v[1].geom,
          y.geom
        ], $ = {
          a: y.prop,
          b: v[0].prop,
          c: v[1].prop
        }, V = ae([P], $), z = Qn(V);
        os(t, {
          forw: z,
          bakw: V
        }, i);
      }), c = !0, s = !0);
    }
    if (!c) break;
  }
  return s;
}
function St(i) {
  return [i[0], i[1]];
}
function Vn(i, t) {
  const [e, n] = t[0], [r, o] = t[1], [s, a] = t[2], c = s - e, l = a - n, u = r - e, f = o - n, h = i[0] - e, m = i[1] - n, b = c * c + l * l, g = c * u + l * f, _ = c * h + l * m, B = u * u + f * f, v = u * h + f * m, x = b * B - g * g;
  if (x === 0) return !1;
  const d = 1 / x, p = (B * _ - g * v) * d, w = (b * v - g * _) * d, k = 1e-9;
  return p >= -k && w >= -k && p + w <= 1 + k;
}
function di(i) {
  const t = i.map((s) => s.slice()).filter(
    (s, a, c) => c.findIndex(
      (l) => Ke(l[0], s[0]) && Ke(l[1], s[1])
    ) === a
  );
  if (t.length <= 1) return t;
  const e = t.sort(
    (s, a) => s[0] === a[0] ? s[1] - a[1] : s[0] - a[0]
  ), n = (s, a, c) => (a[0] - s[0]) * (c[1] - s[1]) - (a[1] - s[1]) * (c[0] - s[0]), r = [];
  for (const s of e) {
    for (; r.length >= 2 && n(
      r[r.length - 2],
      r[r.length - 1],
      s
    ) <= 0; )
      r.pop();
    r.push(s);
  }
  const o = [];
  for (let s = e.length - 1; s >= 0; s--) {
    const a = e[s];
    for (; o.length >= 2 && n(
      o[o.length - 2],
      o[o.length - 1],
      a
    ) <= 0; )
      o.pop();
    o.push(a);
  }
  return o.pop(), r.pop(), r.concat(o);
}
function gi(i) {
  if (i.length < 3) return 0;
  let t = 0;
  for (let e = 0; e < i.length; e++) {
    const [n, r] = i[e], [o, s] = i[(e + 1) % i.length];
    t += n * s - o * r;
  }
  return Math.abs(t) / 2;
}
function Xn(i, t, e) {
  return Math.abs(
    (i[0] * (t[1] - e[1]) + t[0] * (e[1] - i[1]) + e[0] * (i[1] - t[1])) / 2
  );
}
function Ke(i, t, e = 1e-9) {
  return Math.abs(i - t) <= e;
}
const pi = (i) => typeof i == "string" && i.startsWith("b");
function mi(i, t) {
  const e = (n, r) => {
    for (let o = 0; o < 3; o++) {
      const s = n.g[o], a = n.g[(o + 1) % 3];
      if (r.g.every((c) => n.sign * st(s[0], s[1], a[0], a[1], c[0], c[1]) <= 0)) return !0;
    }
    return !1;
  };
  return !e(i, t) && !e(t, i);
}
function wi(i, t, e) {
  if (t.length === 0) return [];
  const n = i.features.map((g) => {
    const { a: _, b: B, c: v } = g.properties, x = [_.geom, B.geom, v.geom], [d, p, w] = g.geometry.coordinates[0], k = x.map(([O]) => O), M = x.map(([, O]) => O), A = Math.sign(st(d[0], d[1], p[0], p[1], w[0], w[1])), N = Math.sign(st(x[0][0], x[0][1], x[1][0], x[1][1], x[2][0], x[2][1]));
    return {
      ids: [_.index, B.index, v.index].map(String),
      g: x,
      sign: N,
      ratio: A * N,
      aux: [_.index, B.index, v.index].some(pi),
      minx: Math.min(...k),
      maxx: Math.max(...k),
      miny: Math.min(...M),
      maxy: Math.max(...M)
    };
  }), r = n.map((g) => g.ratio), o = r.reduce((g, _) => g + _, 0) < 0 ? -1 : 1, s = (g, _) => g < _ ? `${g}|${_}` : `${_}|${g}`, a = /* @__PURE__ */ new Map();
  n.forEach((g, _) => {
    for (let B = 0; B < 3; B++) {
      const v = s(g.ids[B], g.ids[(B + 1) % 3]), x = a.get(v);
      x ? x.push(_) : a.set(v, [_]);
    }
  });
  const c = ([g, _]) => s(String(e[g]), String(e[_])), l = /* @__PURE__ */ new Set();
  for (const g of t) for (const _ of a.get(c(g)) ?? []) l.add(_);
  const u = (g) => n[g].aux || l.has(g), f = /* @__PURE__ */ new Set();
  n.forEach((g, _) => {
    u(_) && (r[_] === 0 || r[_] !== o) && f.add(_);
  });
  const h = n.map((g, _) => _).sort((g, _) => n[g].minx - n[_].minx);
  for (let g = 0; g < h.length; g++) {
    const _ = n[h[g]];
    if (_.sign !== 0)
      for (let B = g + 1; B < h.length; B++) {
        const v = n[h[B]];
        if (v.minx >= _.maxx) break;
        v.sign === 0 || v.miny >= _.maxy || _.miny >= v.maxy || !u(h[g]) && !u(h[B]) || mi(_, v) && (f.add(h[g]), f.add(h[B]));
      }
  }
  if (f.size === 0) return [];
  const m = t.filter((g) => (a.get(c(g)) ?? []).some((_) => f.has(_)));
  if (m.length > 0) return m;
  const b = /* @__PURE__ */ new Set();
  for (const g of f) for (const _ of n[g].ids) _.startsWith("b") || b.add(_);
  return t.filter(
    ([g, _]) => b.has(String(e[g])) || b.has(String(e[_]))
  );
}
const vi = 4, Ln = 32, yi = 1, bi = 0.4, as = 4, xi = 1e-4, cs = 0.25, Si = 0.01, $t = (i, t) => String(i) < String(t) ? `${i}|${t}` : `${t}|${i}`;
function ze(i, t, e) {
  const n = t.filter((l) => !String(l.properties.target.index).startsWith("b")).map((l) => ({
    id: l.properties.target.index,
    paper: l.geometry.coordinates,
    geo: l.properties.target.geom
  })), r = /* @__PURE__ */ new Set();
  let o = 0, s = 0;
  const a = i.features.map((l) => {
    const { a: u, b: f, c: h } = l.properties, [m, b, g] = l.geometry.coordinates[0];
    r.add($t(u.index, f.index)), r.add($t(u.index, h.index)), r.add($t(f.index, h.index));
    const _ = Math.sign(st(m[0], m[1], b[0], b[1], g[0], g[1])) * Math.sign(st(u.geom[0], u.geom[1], f.geom[0], f.geom[1], h.geom[0], h.geom[1]));
    return _ > 0 ? o++ : _ < 0 && s++, {
      ids: [String(u.index), String(f.index), String(h.index)],
      paper: [m, b, g],
      geo: [u.geom, f.geom, h.geom],
      sign: _
    };
  }), c = e.filter(([l, u]) => !r.has($t(n[l].id, n[u].id)));
  return { points: n, triangles: a, majority: o >= s ? 1 : -1, hullEdges: e, dropped: c };
}
function ls(i) {
  return [i.foot[0] + i.height * i.normal[0], i.foot[1] + i.height * i.normal[1]];
}
function Mi(i, [t, e], { lambda: n = cs, epsilon: r = xi } = {}) {
  const { points: o, majority: s } = i, a = o[t], c = o[e], l = o.reduce((E, D) => E + D.paper[0], 0) / o.length, u = o.reduce((E, D) => E + D.paper[1], 0) / o.length, f = Math.sign(st(a.paper[0], a.paper[1], c.paper[0], c.paper[1], l, u));
  if (f === 0) return;
  const h = f * s, m = [c.paper[0] - a.paper[0], c.paper[1] - a.paper[1]], b = [c.geo[0] - a.geo[0], c.geo[1] - a.geo[1]], g = Math.hypot(m[0], m[1]), _ = Math.hypot(b[0], b[1]);
  if (!(g > 0 && _ > 0)) return;
  const B = [];
  for (const E of o) {
    if (E === a || E === c) continue;
    const D = st(a.geo[0], a.geo[1], c.geo[0], c.geo[1], E.geo[0], E.geo[1]);
    if (D * h >= 0) continue;
    const I = ((E.geo[0] - a.geo[0]) * b[0] + (E.geo[1] - a.geo[1]) * b[1]) / (_ * _), F = ((E.paper[0] - a.paper[0]) * m[0] + (E.paper[1] - a.paper[1]) * m[1]) / (g * g);
    I > 0 && I < 1 && F > 0 && F < 1 && B.push({ id: E.id, u: I, t: F, d: Math.abs(D) / _ });
  }
  const v = B.length > 0;
  v || B.push({ u: 0.5, t: 0.5, d: 0 });
  const x = B.reduce((E, D) => D.d > E.d ? D : E);
  let d = 0;
  for (const E of B)
    d = Math.max(d, E.u <= x.u ? E.d * x.u / E.u : E.d * (1 - x.u) / (1 - E.u));
  d *= 1 + n;
  const p = [-m[1] / g * f, m[0] / g * f], w = [-b[1] / _ * h, b[0] / _ * h], k = (E) => [
    a.paper[0] + E * m[0] + r * g * p[0],
    a.paper[1] + E * m[1] + r * g * p[1]
  ], M = (E, D, I, F) => ({
    paper: k(E),
    foot: [a.geo[0] + D * b[0], a.geo[1] + D * b[1]],
    normal: w,
    height: I,
    chord: _,
    protrusion: x.d,
    ...F === void 0 ? {} : { anchor: F }
  }), A = [M(x.t, x.u, d, v ? x.id : void 0)], N = [...B].sort((E, D) => E.u - D.u), O = [{ u: 0, d: 0 }], C = (E, D, I) => (D.u - E.u) * (I.d - E.d) - (D.d - E.d) * (I.u - E.u);
  for (const E of [...N, { u: 1, d: 0 }]) {
    for (; O.length >= 2 && C(O[O.length - 2], O[O.length - 1], E) >= 0; ) O.pop();
    O.push(E);
  }
  const R = n * x.d, S = [];
  let T = 0;
  for (const E of O.slice(1, -1))
    E.t === void 0 || !(E.t > T) || (T = E.t, S.push(M(E.t, E.u, E.d + R, v ? E.id : void 0)));
  return {
    edge: [a.id, c.id],
    variants: v && S.length > 1 ? [A, S] : [A]
  };
}
function ki(i, t, e, { lambda: n = cs, mu: r = Si, maxIterations: o = as } = {}) {
  let s = i.map((a, c) => ({ ray: { ...a }, index: c }));
  for (let a = 0; a < o && s.length > 0; a++) {
    const c = e(s.map(({ ray: f }) => [f.paper, ls(f)]));
    if (!c) return;
    let l = !1;
    const u = /* @__PURE__ */ new Set();
    for (const [f, { ray: h }] of s.entries()) {
      const m = `e${t + f}`;
      let b = -1 / 0, g = 1 / 0, _ = 0;
      for (const d of c.triangles) {
        const p = d.ids.indexOf(m);
        if (p < 0) continue;
        d.sign !== c.majority && _++;
        const w = d.geo[(p + 1) % 3], k = d.geo[(p + 2) % 3], M = Math.sign(
          st(
            d.paper[p][0],
            d.paper[p][1],
            d.paper[(p + 1) % 3][0],
            d.paper[(p + 1) % 3][1],
            d.paper[(p + 2) % 3][0],
            d.paper[(p + 2) % 3][1]
          )
        ), A = st(h.foot[0], h.foot[1], w[0], w[1], k[0], k[1]), N = st(h.foot[0] + h.normal[0], h.foot[1] + h.normal[1], w[0], w[1], k[0], k[1]) - A, O = M * c.majority;
        if (N === 0) {
          A * O <= 0 && (b = 1 / 0);
          continue;
        }
        const C = -A / N;
        N * O > 0 ? b = Math.max(b, C) : g = Math.min(g, C);
      }
      if (!(b < g)) {
        u.add(f);
        continue;
      }
      const B = Math.min(Math.max(n * Math.max(b, h.protrusion), r * h.chord), (g - b) / 2), v = Math.max(b, 0) + B, x = Math.abs(v - h.height) > 1e-9 * h.chord;
      (_ > 0 || x) && (x && (l = !0), h.height = v);
    }
    if (u.size > 0 && (s = s.filter((f, h) => !u.has(h)), l = !0), !l) break;
  }
  if (s.length !== 0)
    return { rays: s.map(({ ray: a }) => a), kept: s.map(({ index: a }) => a) };
}
function _i(i, t) {
  const e = (s) => typeof s == "string" && s.startsWith("e") && Number(s.slice(1)) >= t ? Number(s.slice(1)) : void 0, n = /* @__PURE__ */ new Set();
  for (const { ids: s } of i.triangles)
    n.add($t(s[0], s[1])), n.add($t(s[0], s[2])), n.add($t(s[1], s[2]));
  const r = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set();
  for (const [s, a] of i.hullEdges) {
    const c = n.has($t(i.points[s].id, i.points[a].id));
    for (const l of [s, a]) {
      const u = e(i.points[l].id);
      u !== void 0 && (o.add(u), c || r.add(u));
    }
  }
  for (const s of i.points) {
    const a = e(s.id);
    a !== void 0 && !o.has(a) && r.add(a);
  }
  return r;
}
function Ei(i, t) {
  const e = { rounds: 0, builds: 0, cost: 0, budget: 0, batches: 0, perEdge: 0, multiPoint: 0 };
  let n = [], r = [], o = t, s = i.snapshot();
  const a = /* @__PURE__ */ new Set(), c = yi * i.baseCost;
  e.budget = c;
  const l = i.buildCost();
  let u = 0;
  const f = () => u * bi + i.buildCost() - l, h = () => f() >= c, m = (v) => {
    if (!h())
      return e.builds++, u++, i.measure(v);
  }, b = (v) => [v.paper, ls(v)], g = (v, x, d) => {
    const p = ki(
      v.map(({ ray: w }) => w),
      x,
      (w) => m([...n, ...w]),
      { maxIterations: d }
    );
    return p?.rays.map((w, k) => ({ ray: w, edge: v[p.kept[k]].edge }));
  }, _ = (v, x) => v.length === x.length && v.every(({ ray: d }, p) => Math.abs(d.height - x[p].ray.height) <= 1e-9 * d.chord), B = (v) => {
    if (v.length === 0 || n.length + v.length > Ln) return !1;
    const x = i.edgeBase + n.length;
    let d = g(v, x, 1), p = !1;
    for (; d && d.length > 0 && !h(); ) {
      const w = [...n, ...d.map(({ ray: N }) => b(N))];
      e.builds++;
      const k = i.build(w, Math.max(1, Math.ceil(c - f()))), M = k ? _i(k.analysis, x) : void 0;
      if (k && M.size === 0)
        return r = r.concat(
          d.map(({ ray: N, edge: O }, C) => ({
            node: x + C,
            kind: "hullEdge",
            edge: O,
            ...N.anchor === void 0 ? {} : { anchor: N.anchor }
          }))
        ), n = w, o = k, s = i.snapshot(), !0;
      if (i.restore(s), k && M.size < d.length) {
        d = d.filter((N, O) => !M.has(x + O));
        continue;
      }
      if (p) return !1;
      p = !0;
      const A = g(d, x, as);
      if (!A || _(A, d)) return !1;
      d = A;
    }
    return !1;
  };
  for (let v = 1; v <= vi && !h(); v++) {
    const { analysis: x } = o, d = [];
    for (const w of x.dropped) {
      const k = w.map((A) => x.points[A].paper.join(",")).join("|");
      if (a.has(k) || (a.add(k), n.length + d.length + 1 > Ln)) continue;
      const M = Mi(x, w);
      M && d.push(M);
    }
    if (d.length === 0) break;
    e.rounds = v;
    const p = (w, k) => k.map((M) => ({ ray: M, edge: w.edge }));
    if (B(d.flatMap((w) => p(w, w.variants[0])))) {
      e.batches++;
      continue;
    }
    for (const w of d)
      for (const [k, M] of w.variants.entries()) {
        if (h()) break;
        if (B(p(w, M))) {
          e.perEdge++, k > 0 && e.multiPoint++;
          break;
        }
      }
  }
  return i.restore(s), e.cost = f(), { pairs: n, records: r, result: o.result, diagnostics: e };
}
const ke = 0, Yn = (i) => i + 1, Ae = 1, Be = 2, Ai = 4, zn = 1e-6, Ii = 0.2, Un = 2 ** 26;
function dt(i, t) {
  return i < t ? i * Un + t : t * Un + i;
}
const te = (i, t, e) => Math.sign(st(i[0], i[1], t[0], t[1], e[0], e[1])), xe = (i, t, e) => Math.abs((t[0] - i[0]) * (e[1] - i[1]) - (e[0] - i[0]) * (t[1] - i[1]));
class Bi {
  vertices = /* @__PURE__ */ new Map();
  triangles = /* @__PURE__ */ new Map();
  /** 頂点 → その頂点を持つ三角形 */
  byVertex = /* @__PURE__ */ new Map();
  /** 辺 → その辺を持つ三角形（1 つなら網の外周の辺） */
  byEdge = /* @__PURE__ */ new Map();
  /** 辺の属性（{@link EDGE_REQUIRED}・{@link EDGE_HULL}・{@link EDGE_PROTECT} の和） */
  edgeFlags = /* @__PURE__ */ new Map();
  /** ok でない三角形 */
  bad = /* @__PURE__ */ new Set();
  /** 外周 ∂M が 1 本の輪で、両面とも単純か */
  boundarySimple = !0;
  /** 禁止制約の三角形の数（補助頂点だけの三角形・同じ必須エッジの点だけの三角形） */
  forbiddenBoundary = 0;
  forbiddenEdge = 0;
  /** 差し替えを当てた回数 */
  revision = 0;
  nextVertex = 0;
  nextTriangle = 0;
  /** 網の向き（紙の面の向きの符号 × 地理面の向きの符号） */
  sigma;
  /** 新しく作る三角形の、紙の面での頂点の並びの向き（取り込んだ網の多数決） */
  forwSign;
  constructor(t, e) {
    this.sigma = t, this.forwSign = e;
  }
  // ── 頂点・三角形・辺の表 ──
  addVertex(t, e, n, r = []) {
    const o = this.nextVertex++;
    return this.vertices.set(o, { ref: t, forw: e, bakw: n, groups: r }), this.byVertex.set(o, /* @__PURE__ */ new Set()), o;
  }
  /** 三角形を 1 つも持たない頂点を消す。 */
  dropVertex(t) {
    if (this.byVertex.get(t)?.size)
      throw new Error(`頂点 ${t} は三角形の頂点です`);
    this.vertices.delete(t), this.byVertex.delete(t);
  }
  addTriangle(t, e, n) {
    const r = this.nextTriangle++, o = [t, e, n];
    this.triangles.set(r, o);
    for (let a = 0; a < 3; a++) {
      this.byVertex.get(o[a]).add(r);
      const c = dt(o[a], o[(a + 1) % 3]), l = this.byEdge.get(c);
      l ? l.push(r) : this.byEdge.set(c, [r]);
    }
    this.ok(t, e, n) || this.bad.add(r);
    const s = this.forbiddenGroup(t, e, n);
    return s === ke ? this.forbiddenBoundary++ : s !== void 0 && this.forbiddenEdge++, r;
  }
  removeTriangle(t) {
    const e = this.triangles.get(t);
    this.triangles.delete(t);
    for (let r = 0; r < 3; r++) {
      this.byVertex.get(e[r])?.delete(t);
      const o = dt(e[r], e[(r + 1) % 3]), s = this.byEdge.get(o);
      s.length === 1 ? this.byEdge.delete(o) : s.splice(s.indexOf(t), 1);
    }
    this.bad.delete(t);
    const n = this.forbiddenGroup(e[0], e[1], e[2]);
    n === ke ? this.forbiddenBoundary-- : n !== void 0 && this.forbiddenEdge--;
  }
  hasEdge(t, e) {
    return this.byEdge.has(dt(t, e));
  }
  flagsOf(t, e) {
    return this.edgeFlags.get(dt(t, e)) ?? 0;
  }
  setFlag(t, e, n) {
    const r = dt(t, e);
    this.edgeFlags.set(r, (this.edgeFlags.get(r) ?? 0) | n);
  }
  clearFlag(t, e, n) {
    const r = dt(t, e), o = (this.edgeFlags.get(r) ?? 0) & ~n;
    o ? this.edgeFlags.set(r, o) : this.edgeFlags.delete(r);
  }
  // ── 判定 ──
  /** 三角形の合格（S1）: 両面の向きの積が σ に等しい。面積 0 は不合格。向きは厳密な述語で取る。 */
  ok(t, e, n, r = this.vertexAt) {
    const o = r(t), s = r(e), a = r(n);
    return te(o.forw, s.forw, a.forw) * te(o.bakw, s.bakw, a.bakw) === this.sigma;
  }
  /** 新しく作る三角形の合格: ok に加えて、両面とも 2×面積が閾値以上。 */
  okNew(t, e, n, r = this.vertexAt) {
    if (!this.ok(t, e, n, r)) return !1;
    const o = r(t), s = r(e), a = r(n);
    return xe(o.forw, s.forw, a.forw) >= zn && xe(o.bakw, s.bakw, a.bakw) >= zn;
  }
  /** 3 頂点が同じ群に属するなら、その群の番号（禁止制約の違反）。属さなければ undefined。 */
  forbiddenGroup(t, e, n) {
    const r = this.vertices.get(e).groups, o = this.vertices.get(n).groups;
    return this.vertices.get(t).groups.find((s) => r.includes(s) && o.includes(s));
  }
  /** strict か（S1 と S2）。`bad` が空なだけでは足りない。 */
  isStrict() {
    return this.bad.size === 0 && this.boundarySimple;
  }
  vertexAt = (t) => this.vertices.get(t);
  // ── 範囲と輪 ──
  /** 頂点の星（その頂点を持つ三角形の全部）。 */
  star(t) {
    return new Set(this.byVertex.get(t));
  }
  /** 範囲に、頂点で接する三角形を 1 周足す。 */
  grow(t) {
    const e = new Set(t);
    for (const n of t)
      for (const r of this.triangles.get(n))
        for (const o of this.byVertex.get(r)) e.add(o);
    return e;
  }
  /** 三角形の頂点を、紙の面で正の向き（orient2d > 0）に並べ直す。面積 0 なら undefined。 */
  positive(t) {
    const [e, n, r] = this.triangles.get(t), o = te(
      this.vertices.get(e).forw,
      this.vertices.get(n).forw,
      this.vertices.get(r).forw
    );
    if (o !== 0)
      return o > 0 ? [e, n, r] : [e, r, n];
  }
  /**
   * 範囲の外周の輪を、有向の辺の列（範囲の内側が、紙の面で正の向きの側）で取る。
   * 範囲が円板でなければ（同じ頂点を 2 回通る・穴がある・離れている）undefined。
   */
  ringOf(t) {
    const e = /* @__PURE__ */ new Map();
    for (const o of t) {
      const s = this.positive(o);
      if (!s) return;
      for (let a = 0; a < 3; a++) {
        const c = s[a], l = s[(a + 1) % 3], u = this.byEdge.get(dt(c, l));
        if (u.length > 2) return;
        if (!(u.length === 2 && t.has(u[0]) && t.has(u[1]))) {
          if (e.has(c)) return;
          e.set(c, l);
        }
      }
    }
    if (e.size < 3) return;
    const n = e.keys().next().value, r = [n];
    for (let o = e.get(n); o !== n; o = e.get(o)) {
      if (o === void 0 || r.length > e.size) return;
      r.push(o);
    }
    return r.length === e.size ? r : void 0;
  }
  // ── 差し替え ──
  /**
   * 範囲 R の外周の輪を固定して、内側だけを三角形分割し直す（設計書 §5.1）。
   * 失敗したときは、網を変えない。
   *
   * 重なりの解消と、禁止制約の局所の解消（§5.2）は、まだ入れていない（第 2 週）。新しい三角形に
   * okNew でないものがあれば "notStrict"、禁止制約が増えれば "forbidden" で失敗する。
   */
  replace(t, e = {}) {
    const n = (I) => ({
      ok: !1,
      reason: I
    });
    if (t.size > this.triangles.size * Ii)
      return n("tooLarge");
    const r = this.ringOf(t);
    if (!r) return n("notDisk");
    const o = r.length, s = new Set(r), a = new Set(e.remove ?? []), c = new Set(e.add ?? []);
    for (const I of t)
      for (const F of this.triangles.get(I))
        !s.has(F) && !a.has(F) && c.add(F);
    for (const I of a) {
      if (s.has(I)) return n("notDisk");
      for (const F of this.byVertex.get(I))
        if (!t.has(F)) return n("notDisk");
    }
    for (const I of e.move?.keys() ?? [])
      if (!c.has(I)) return n("notDisk");
    const l = (I) => {
      const F = e.move?.get(I), y = this.vertices.get(I);
      return F ? { ...y, ...F } : y;
    }, u = [...r, ...c], f = new Map(u.map((I, F) => [I, F])), h = /* @__PURE__ */ new Set();
    for (let I = 0; I < o; I++)
      h.add(dt(r[I], r[(I + 1) % o]));
    const m = r.map((I, F) => [
      F,
      (F + 1) % o
    ]), b = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Set();
    for (const I of t) {
      const F = this.triangles.get(I);
      for (let y = 0; y < 3; y++) {
        const P = F[y], $ = F[(y + 1) % 3], V = dt(P, $);
        h.has(V) || (g.add(V), (this.edgeFlags.get(V) ?? 0) & (Ae | Be) && (a.has(P) || a.has($) || b.set(V, [P, $])));
      }
    }
    for (const [I, F] of e.constrain ?? []) {
      if (!f.has(I) || !f.has(F)) return n("constraint");
      h.has(dt(I, F)) || b.set(dt(I, F), [I, F]);
    }
    for (const [I, F] of b.values())
      m.push([f.get(I), f.get(F)]);
    let _;
    try {
      const I = Ie.from(u.map((F) => l(F).forw));
      if (I.triangles.length === 0) return n("constraint");
      _ = new Ht(I, m).del;
    } catch {
      return n("constraint");
    }
    const { triangles: B, halfedges: v } = _, x = B.length / 3, d = (I) => l(u[I]).forw;
    let p = 0, w = 0;
    for (let I = 0; I < x; I++) {
      const F = d(B[I * 3]), y = d(B[I * 3 + 1]), P = d(B[I * 3 + 2]), $ = xe(F, y, P);
      if ($ > w) {
        const V = te(F, y, P);
        V !== 0 && (w = $, p = V);
      }
    }
    if (p === 0) return n("count");
    const k = /* @__PURE__ */ new Map();
    for (let I = 0; I < B.length; I++)
      k.set(B[I] * u.length + B[Et(I)], I);
    const M = /* @__PURE__ */ new Set();
    for (let I = 0; I < o; I++) {
      const F = I, y = (I + 1) % o, P = k.get(
        p > 0 ? F * u.length + y : y * u.length + F
      );
      if (P === void 0) return n("pointOutside");
      M.add(P);
    }
    const A = /* @__PURE__ */ new Set(), N = [];
    for (const I of M) {
      const F = Math.floor(I / 3);
      A.has(F) || (A.add(F), N.push(F));
    }
    for (let I = 0; I < N.length; I++)
      for (let F = N[I] * 3; F < N[I] * 3 + 3; F++) {
        if (M.has(F)) continue;
        const y = v[F];
        if (y === -1 || M.has(y)) return n("pointOutside");
        const P = Math.floor(y / 3);
        A.has(P) || (A.add(P), N.push(P));
      }
    for (const I of M) {
      const F = v[I];
      if (F !== -1 && A.has(Math.floor(F / 3)))
        return n("pointOutside");
    }
    const O = [], C = /* @__PURE__ */ new Set();
    for (const I of A) {
      const F = u[B[I * 3]], y = u[B[I * 3 + 1]], P = u[B[I * 3 + 2]];
      C.add(F).add(y).add(P), O.push(p === this.forwSign ? [F, y, P] : [F, P, y]);
    }
    for (const I of c) if (!C.has(I)) return n("pointOutside");
    if (O.length !== o - 2 + 2 * c.size) return n("count");
    const R = /* @__PURE__ */ new Set();
    for (const [I, F, y] of O)
      R.add(dt(I, F)).add(dt(F, y)).add(dt(y, I));
    for (const I of b.keys())
      if (!R.has(I)) return n("constraint");
    for (const [I, F, y] of O)
      if (!this.okNew(I, F, y, l)) return n("notStrict");
    let S = 0;
    for (const I of t) {
      const [F, y, P] = this.triangles.get(I);
      this.forbiddenGroup(F, y, P) !== void 0 && S++;
    }
    let T = 0;
    for (const [I, F, y] of O)
      this.forbiddenGroup(I, F, y) !== void 0 && T++;
    if (T > S) return n("forbidden");
    for (const [I, F] of e.move ?? []) {
      const y = this.vertices.get(I);
      y.forw = F.forw, y.bakw = F.bakw;
    }
    const E = [...t];
    for (const I of E) this.removeTriangle(I);
    const D = O.map(([I, F, y]) => this.addTriangle(I, F, y));
    for (const I of g) {
      const F = (this.edgeFlags.get(I) ?? 0) & ~Ai;
      F && this.byEdge.has(I) ? this.edgeFlags.set(I, F) : this.edgeFlags.delete(I);
    }
    for (const [I, F, y] of e.constrain ?? []) this.setFlag(I, F, y);
    for (const I of a) this.dropVertex(I);
    return this.revision++, { ok: !0, removed: E, added: D };
  }
  /**
   * 接続を変えずに、頂点の座標だけを変える（地理面だけの移動。設計書 §4.3）。星の三角形の `bad` を
   * 判定し直す。採ってよいかどうか（星の三角形が全部 okNew か）は、呼び出し側が先に確かめる。
   */
  relocate(t, e, n) {
    const r = this.vertices.get(t);
    r.forw = e, r.bakw = n;
    for (const o of this.byVertex.get(t)) {
      const [s, a, c] = this.triangles.get(o);
      this.ok(s, a, c) ? this.bad.delete(o) : this.bad.add(o);
    }
    this.revision++;
  }
  // ── 外周 ──
  /** 網の外周 ∂M（対の無い辺）を、輪の頂点の列で取る。1 本の輪でなければ undefined。 */
  boundaryRing() {
    const t = /* @__PURE__ */ new Map();
    for (const [r, o] of this.byEdge) {
      if (o.length !== 1) continue;
      const s = this.positive(o[0]) ?? this.triangles.get(o[0]);
      for (let a = 0; a < 3; a++) {
        const c = s[a], l = s[(a + 1) % 3];
        if (dt(c, l) === r) {
          if (t.has(c)) return;
          t.set(c, l);
        }
      }
    }
    if (t.size < 3) return;
    const e = t.keys().next().value, n = [e];
    for (let r = t.get(e); r !== e; r = t.get(r)) {
      if (r === void 0 || n.length > t.size) return;
      n.push(r);
    }
    return n.length === t.size ? n : void 0;
  }
  /** 外周 ∂M が 1 本の輪で、両面とも単純な多角形か（S2）を計算し直す。 */
  computeBoundarySimple() {
    const t = this.boundaryRing();
    if (!t) return !1;
    const e = t.length;
    for (const n of ["forw", "bakw"]) {
      const r = t.map((o) => this.vertices.get(o)[n]);
      for (let o = 0; o < e; o++) {
        const s = r[o], a = r[(o + 1) % e], c = r[(o + 2) % e];
        if (te(s, a, c) === 0 && (s[0] - a[0]) * (c[0] - a[0]) + (s[1] - a[1]) * (c[1] - a[1]) > 0)
          return !1;
        for (let l = o + 2; l < e; l++) {
          if (o === 0 && l === e - 1) continue;
          const u = r[l], f = r[(l + 1) % e];
          if (Ue(s[0], s[1], a[0], a[1], u[0], u[1], f[0], f[1]))
            return !1;
        }
      }
    }
    return !0;
  }
  // ── 全部の数え直し（試験用。製品のコードは呼ばない） ──
  audit() {
    const t = [];
    let e = 0, n = 0, r = 0, o = !0;
    const s = /* @__PURE__ */ new Map();
    for (const [u, [f, h, m]] of this.triangles) {
      this.ok(f, h, m) || t.push(u);
      const b = this.forbiddenGroup(f, h, m);
      b === ke ? e++ : b !== void 0 && n++, r += xe(
        this.vertices.get(f).forw,
        this.vertices.get(h).forw,
        this.vertices.get(m).forw
      ) / 2;
      for (const [g, _] of [
        [f, h],
        [h, m],
        [m, f]
      ]) {
        const B = dt(g, _);
        s.set(B, (s.get(B) ?? 0) + 1), this.byEdge.get(B)?.includes(u) || (o = !1), this.byVertex.get(g)?.has(u) || (o = !1);
      }
    }
    let a = 0;
    for (const [u, f] of s)
      f > 2 && a++, this.byEdge.get(u)?.length !== f && (o = !1);
    s.size !== this.byEdge.size && (o = !1);
    let c = 0;
    for (const [u, f] of this.byVertex)
      this.vertices.has(u) || (o = !1), c += f.size;
    c !== this.triangles.size * 3 && (o = !1);
    let l = 0;
    for (const [u, f] of this.edgeFlags)
      f & Ae && !this.byEdge.has(u) && l++;
    return {
      triangles: this.triangles.size,
      bad: t,
      badMatches: t.length === this.bad.size && t.every((u) => this.bad.has(u)),
      indexMatches: o,
      nonManifoldEdges: a,
      boundarySimple: this.computeBoundarySimple(),
      missingRequired: l,
      forbiddenBoundary: e,
      forbiddenEdge: n,
      forbiddenMatches: e === this.forbiddenBoundary && n === this.forbiddenEdge,
      forwArea: r
    };
  }
}
const qn = (i, t, e) => Math.sign(st(i[0], i[1], t[0], t[1], e[0], e[1]));
class Ti {
  /** 対応点の頂点の id（compiled の `points` の並び） */
  gcps = [];
  /** 対応点の id（`PointId`）から、頂点の id を引く表 */
  pointVertex = /* @__PURE__ */ new Map();
  /** 必須エッジ（compiled の `edges` の並び） */
  edges = [];
  /** 補完点（compiled の `edgeNodes` の、中継点の後ろの並び） */
  supplements = [];
  /** 補助頂点の頂点の id（輪の中の順） */
  ring = [];
  /** 扇形の中心（最後に帯を作ったときの値。world file 外周では持たない） */
  centroid;
  mesh;
  context;
  constructor(t, e) {
    this.mesh = t, this.context = e;
  }
  /** 中継点と補完点の頂点の id（compiled の `edgeNodes` の並び）。 */
  nodeOrder() {
    return [
      ...this.edges.flatMap((t) => t.nodes),
      ...this.supplements.map((t) => t.vertex)
    ];
  }
  /** 頂点の id から、compiled の番号（対応点は添字、中継点・補完点は `e{n}`、補助頂点は `b{n}`）を引く表。 */
  indexTable() {
    const t = /* @__PURE__ */ new Map();
    return this.gcps.forEach((e, n) => t.set(e, n)), this.nodeOrder().forEach((e, n) => t.set(e, `e${n}`)), this.ring.forEach((e, n) => t.set(e, `b${n}`)), t;
  }
  /** 網から compiled を書き出す（項目の並びは `Tin#getCompiled` と同じ）。 */
  toCompiled() {
    const { mesh: t, context: e } = this, n = (u) => t.vertices.get(u), r = (u) => [
      n(u).forw,
      n(u).bakw
    ], o = this.indexTable(), s = {};
    s.version = e.version, s.points = this.gcps.map(r), s.weight_buffer = {};
    const a = this.ring.map(r);
    if (e.outer?.outerTransform === "worldFile")
      s.outerTransform = "worldFile", s.worldFile = e.outer.worldFile, s.vertices_points = a;
    else {
      const u = this.centroid;
      s.centroid_point = [u.forw, u.bakw], s.vertices_params = ["forw", "bakw"].map(
        (f) => this.ring.map((h) => {
          const m = n(h)[f];
          return Math.atan2(
            m[0] - u[f][0],
            m[1] - u[f][1]
          );
        })
      ), s.vertices_points = a;
    }
    const c = t.revision > 0, l = c ? t.isStrict() ? "strict" : "strict_error" : e.strict_status;
    return s.strict_status = l, s.tins_points = [
      [...t.triangles.values()].map(
        (u) => u.map((f) => o.get(f))
      )
    ], !c && l === "strict_error" && e.kinks_points && (s.kinks_points = e.kinks_points), s.yaxisMode = e.yaxisMode, s.vertexMode = e.vertexMode, s.strictMode = e.strictMode, e.bounds ? (s.bounds = e.bounds, s.boundsPolygon = e.boundsPolygon, e.hasXy && (s.xy = e.xy), e.hasWh && (s.wh = e.wh)) : s.wh = e.wh, s.edges = this.edges.map(
      (u) => [
        u.forwNodes,
        u.bakwNodes,
        [o.get(u.start), o.get(u.end)]
      ]
    ), s.edgeNodes = this.nodeOrder().map(r), this.supplements.length > 0 && (s.supplementPairs = this.supplements.map((u) => ({
      node: Number(o.get(u.vertex).slice(1)),
      kind: u.kind,
      edge: u.edge.map((f) => o.get(f)),
      ...u.anchor === void 0 ? {} : { anchor: o.get(u.anchor) }
    }))), e.outer?.outerTransform === "extrapolate" && (s.outerTransform = "extrapolate"), s;
  }
}
function Oi(i, t) {
  if (i.version !== void 0 && i.version < 3)
    return { reason: "v2" };
  if (i.strict_status === "loose" || i.tins_points.length !== 1)
    return { reason: "loose" };
  const e = i.outerTransform, n = e === "worldFile" && i.yaxisMode === "follow" ? 1 : -1, r = i.points, o = i.edgeNodes ?? [], s = i.vertices_points ?? [], a = r.length, c = (p) => {
    if (typeof p == "number") return r[p];
    const w = Number(p.slice(1));
    return p.startsWith("e") ? o[w] : p.startsWith("b") ? s[w] : void 0;
  };
  let l = 0, u = 0;
  for (const p of i.tins_points[0]) {
    const [w, k, M] = p.map(c);
    if (!w || !k || !M) return { reason: "inconsistent" };
    const A = qn(w[0], k[0], M[0]);
    u += A, l += A * qn(w[1], k[1], M[1]);
  }
  if ((l < 0 ? -1 : 1) !== n) return { reason: "orientation" };
  const f = new Bi(n, u < 0 ? -1 : 1), h = new Ti(f, {
    version: i.version,
    yaxisMode: i.yaxisMode,
    vertexMode: i.vertexMode,
    strictMode: i.strictMode,
    bounds: i.bounds,
    boundsPolygon: i.boundsPolygon,
    xy: i.xy,
    wh: i.wh,
    hasXy: "xy" in i,
    hasWh: "wh" in i,
    outer: e === "worldFile" ? {
      outerTransform: "worldFile",
      worldFile: i.worldFile
    } : e === "extrapolate" ? { outerTransform: "extrapolate" } : void 0,
    strict_status: i.strict_status,
    kinks_points: i.kinks_points
  }), m = /* @__PURE__ */ new Map();
  r.forEach(([p, w], k) => {
    const M = f.addVertex({ kind: "gcp", id: k }, p, w);
    h.gcps.push(M), h.pointVertex.set(k, M), m.set(k, M);
  });
  const b = i.edges ?? [];
  if (h.edges = b.map(
    ([p, w, [k, M]], A) => ({
      id: A,
      start: m.get(k),
      end: m.get(M),
      forwNodes: p,
      bakwNodes: w,
      nodes: []
    })
  ), h.edges.some(({ start: p, end: w }) => p === void 0 || w === void 0))
    return { reason: "inconsistent" };
  const g = /* @__PURE__ */ new Map();
  {
    let p = 0;
    for (const [, w] of t)
      w >= a ? g.has(w - a) || g.set(w - a, p) : p++;
    if (p !== h.edges.length) return { reason: "inconsistent" };
  }
  let _ = 0;
  o.forEach(([p, w], k) => {
    const M = g.get(k);
    let A;
    if (M !== void 0) {
      const N = h.edges[M];
      A = f.addVertex(
        { kind: "edgeNode", edge: N.id, order: N.nodes.length },
        p,
        w,
        [Yn(N.id)]
      ), N.nodes.push(A);
    } else
      A = f.addVertex(
        { kind: "supplement", key: `s${_++}` },
        p,
        w
      );
    m.set(`e${k}`, A);
  });
  for (const p of h.edges) {
    const w = Yn(p.id);
    f.vertices.get(p.start).groups.push(w), f.vertices.get(p.end).groups.push(w);
  }
  s.forEach(([p, w], k) => {
    const M = f.addVertex({ kind: "boundary", order: k }, p, w, [
      ke
    ]);
    h.ring.push(M), m.set(`b${k}`, M);
  });
  const B = new Map(
    (i.supplementPairs ?? []).map((p) => [p.node, p])
  );
  for (let p = 0; p < o.length; p++) {
    if (g.has(p)) continue;
    const w = B.get(p), k = w?.edge.map((M) => m.get(M));
    if (!w || !k || k.some((M) => M === void 0))
      return { reason: "inconsistent" };
    h.supplements.push({
      vertex: m.get(`e${p}`),
      kind: w.kind,
      edge: k,
      ...w.anchor === void 0 ? {} : { anchor: m.get(w.anchor) }
    });
  }
  if (i.centroid_point)
    h.centroid = {
      forw: i.centroid_point[0],
      bakw: i.centroid_point[1]
    };
  else if (e !== "worldFile") return { reason: "inconsistent" };
  for (const p of i.tins_points[0]) {
    const [w, k, M] = p.map((A) => m.get(A));
    f.addTriangle(w, k, M);
  }
  const v = (p) => p < a ? m.get(p) : m.get(`e${p - a}`);
  for (const [p, w] of t) {
    const k = v(p), M = v(w);
    if (k === void 0 || M === void 0) return { reason: "inconsistent" };
    f.setFlag(k, M, Ae);
  }
  const x = [...h.gcps, ...h.nodeOrder()], d = je(
    x.map((p) => f.vertices.get(p).forw)
  );
  for (const [p, w] of d)
    f.hasEdge(x[p], x[w]) && f.setFlag(x[p], x[w], Be);
  return f.boundarySimple = f.computeBoundarySimple(), { model: h };
}
const jn = 2.00704, Gn = 3.00001, Fi = 12, Ni = 4, Kn = 1, Wn = 4, Pi = 8, Di = 24;
function Ri(i) {
  if (i.size === 0) return [];
  if (i.size >= 36) return [[...i].sort((e, n) => e - n)];
  const t = [];
  for (let e = 0; e < 36; e++) {
    if (!i.has(e) || i.has((e + 35) % 36)) continue;
    const n = [e];
    for (let r = (e + 1) % 36; i.has(r); r = (r + 1) % 36) n.push(r);
    t.push(n);
  }
  return t;
}
const Hn = /* @__PURE__ */ Symbol("supplement pairs out of budget"), Ci = 24;
class nt extends ys {
  importance;
  priority;
  pointsSet;
  useV2Algorithm;
  /** V3 で補完点を足すか（`Options#supplementPairs`）。 */
  useSupplementPairs;
  supplementRecords = [];
  lastSupplementDiagnostics;
  lastBoundaryDiagnostics;
  /** `updateTin()` の中で三角網を組んだ試行の数（補助頂点の手当ての手間の上限に使う）。 */
  attemptTotal = 0;
  requestedWorldFile;
  compiledOuter;
  /** 局所更新のスイッチ（`Options#incremental`）。 */
  incremental;
  mesh;
  meshFailure;
  /**
   * 局所更新の網（今の三角網を取り込んだもの）。スイッチが切れている・三角網が無い・取り込めない網
   * （loose・V2 など。理由は `incrementalFailure`）のときは undefined。
   */
  get incrementalMesh() {
    return this.tins ? this.mesh : void 0;
  }
  /** 局所更新の網へ取り込めなかった理由（取り込めた・スイッチが切れているときは undefined）。 */
  get incrementalFailure() {
    return this.tins ? this.meshFailure : void 0;
  }
  /** 現在の三角網を V3 で生成したときの外周の診断。 */
  get boundaryDiagnostics() {
    return this.tins && !this.useV2Algorithm ? this.lastBoundaryDiagnostics : void 0;
  }
  /**
   * システムが足した補完点の一覧（今の三角網のもの）。座標は内部の座標（`edgeNodes` と同じ）。
   * 人間の対応点（`points`）には入らない。`updateTin()` のたびに、対応点だけから作り直される。
   */
  get supplementPairs() {
    if (!this.tins) return [];
    const t = this.edgeNodes ?? [];
    return this.supplementRecords.flatMap((e) => {
      const n = t[e.node];
      return n ? [{ ...e, forw: n[0], bakw: n[1] }] : [];
    });
  }
  /** 直近の `updateTin()` の補完の手順の診断（足す手順に入らなかったときは undefined）。 */
  get supplementDiagnostics() {
    return this.tins && !this.useV2Algorithm ? this.lastSupplementDiagnostics : void 0;
  }
  /**
   * Tinクラスのインスタンスを生成します
   * @param options - 初期化オプション
   */
  constructor(t = {}) {
    if (super(), t.bounds ? this.setBounds(t.bounds) : (this.setWh(t.wh), this.vertexMode = t.vertexMode || nt.VERTEX_PLAIN), this.strictMode = t.strictMode || nt.MODE_AUTO, this.yaxisMode = t.yaxisMode || nt.YAXIS_INVERT, this.importance = t.importance || 0, this.priority = t.priority || 0, this.stateFull = t.stateFull || !1, this.useV2Algorithm = t.useV2Algorithm ?? !1, this.useSupplementPairs = t.supplementPairs ?? !0, this.incremental = t.incremental ?? !1, t.outerTransform === "worldFile") {
      if (this.useV2Algorithm) throw new Error("V2 では world file 外周を使えません");
      if (!t.worldFile) throw new Error("worldFile が必要です");
      bs(t.worldFile), this.requestedWorldFile = { ...t.worldFile };
    }
    t.points && this.setPoints(t.points), t.edges && this.setEdges(t.edges);
  }
  /**
   * フォーマットバージョンを取得します
   */
  getFormatVersion() {
    return this.useV2Algorithm ? jn : Gn;
  }
  /**
   * 制御点（GCP: Ground Control Points）を設定します。
   * 指定した点群に合わせて内部のTINキャッシュをリセットします。
   */
  setPoints(t) {
    this.yaxisMode === nt.YAXIS_FOLLOW && (t = t.map((e) => [
      e[0],
      [e[1][0], -1 * e[1][1]]
    ])), this.points = t, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * エッジ（制約線）を設定します。
   * 制約線を正規化した上で、依存するキャッシュをリセットします。
   */
  setEdges(t = []) {
    this.edges = xs(t), this.edgeNodes = void 0, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 境界ポリゴンを設定します
   */
  setBounds(t) {
    this.bounds = t;
    let e = t[0][0], n = e, r = t[0][1], o = r;
    const s = [t[0]];
    for (let a = 1; a < t.length; a++) {
      const c = t[a];
      c[0] < e && (e = c[0]), c[0] > n && (n = c[0]), c[1] < r && (r = c[1]), c[1] > o && (o = c[1]), s.push(c);
    }
    s.push(t[0]), this.boundsPolygon = ae([s]), this.xy = [e, r], this.wh = [n - e, o - r], this.vertexMode = nt.VERTEX_PLAIN, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 現在の設定を永続化可能な形式にコンパイルします
   */
  getCompiled() {
    const t = {};
    if (t.version = this.useV2Algorithm ? jn : Gn, t.points = this.points, t.weight_buffer = {}, this.compiledOuter?.outerTransform === "worldFile")
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
          const r = e[n].features[0], o = r.geometry.coordinates[0][1], s = r.properties.b.geom;
          t.vertices_points[n] = [o, s];
        }
    }
    return t.strict_status = this.strict_status, t.tins_points = [[]], this.tins.forw.features.map((e) => {
      t.tins_points[0].push(
        ["a", "b", "c"].map(
          (n) => e.properties[n].index
        )
      );
    }), this.strict_status === nt.STATUS_LOOSE ? (t.tins_points[1] = [], this.tins.bakw.features.map((e) => {
      t.tins_points[1].push(
        ["a", "b", "c"].map(
          (n) => e.properties[n].index
        )
      );
    })) : this.strict_status === nt.STATUS_ERROR && this.kinks?.bakw && (t.kinks_points = this.kinks.bakw.features.map(
      (e) => e.geometry.coordinates
    )), t.yaxisMode = this.yaxisMode, t.vertexMode = this.vertexMode, t.strictMode = this.strictMode, this.bounds ? (t.bounds = this.bounds, t.boundsPolygon = this.boundsPolygon, this.useV2Algorithm && (t.xy = this.xy, t.wh = this.wh)) : t.wh = this.wh, t.edges = this.edges ?? [], t.edgeNodes = this.edgeNodes ?? [], this.supplementRecords.length > 0 && (t.supplementPairs = this.supplementRecords.map((e) => ({
      ...e,
      edge: [...e.edge]
    }))), this.compiledOuter?.outerTransform === "extrapolate" && Object.assign(t, this.compiledOuter), t;
  }
  /** コンパイルされた設定を基底クラスで復元し、外周方式を次の生成にも引き継ぐ。 */
  setCompiled(t) {
    const e = "outerTransform" in t ? t : void 0;
    if (e?.outerTransform === "worldFile" && this.useV2Algorithm)
      throw new Error("V2 では world file 外周を使えません");
    const n = this.outerTransform === "worldFile" || e?.outerTransform === "worldFile";
    super.setCompiled(t), this.supplementRecords = (t.supplementPairs ?? []).map((r) => ({
      ...r,
      edge: [...r.edge]
    })), this.lastSupplementDiagnostics = void 0, n && (this.stateTriangle = void 0), this.mesh = void 0, this.meshFailure = void 0, this.requestedWorldFile = void 0, this.compiledOuter = void 0, e?.outerTransform === "worldFile" ? (this.requestedWorldFile = { ...e.worldFile }, this.compiledOuter = {
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
  calculateStrictTin(t = Pn) {
    this.resolveStrictOverlaps(), this.detectStrictKinks(t);
  }
  /**
   * 順三角網から逆三角網を写し、重なりを辺の反転で解消する（`calculateStrictTin` の前半）。
   * 交差の判定（`strict_status`・`kinks`）はしない。補完点の置き場所を測る試行は、三角網の向きを読むだけなので
   * これだけを呼ぶ。
   */
  resolveStrictOverlaps() {
    const t = this.tins.forw.features.map(
      (r) => Qn(r)
    );
    this.tins.bakw = Mt(t);
    const e = {};
    this.tins.forw.features.forEach((r, o) => {
      const s = this.tins.bakw.features[o];
      os(e, { forw: r, bakw: s });
    });
    const n = (this.pointsSet?.forw.features ?? []).map(
      (r) => r.properties.target.index
    );
    hi(
      this.tins,
      e,
      this.pointsSet?.edges || [],
      n
    );
  }
  /** `calculateStrictTin` の後半: 両面の交差を数え、`strict_status` と `kinks` を決める。 */
  detectStrictKinks(t) {
    const e = ["forw", "bakw"].map((n) => {
      const r = this.tins[n].features.map(
        (o) => o.geometry.coordinates[0]
      );
      return ss(r, t);
    });
    e[0].length === 0 && e[1].length === 0 ? (this.strict_status = nt.STATUS_STRICT, delete this.kinks) : (this.strict_status = nt.STATUS_ERROR, this.kinks = {
      forw: Mt(e[0]),
      bakw: Mt(e[1])
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
    for (let r = 0; r < this.points.length; r++) {
      const o = this.points[r][0], s = this.points[r][1], a = jt(o, s, r);
      t.forw.push(a), t.bakw.push(Gt(a));
    }
    const e = [];
    let n = 0;
    this.edgeNodes = [], this.edges || (this.edges = []);
    for (let r = 0; r < this.edges.length; r++) {
      const o = this.edges[r][2], s = Object.assign([], this.edges[r][0]), a = Object.assign([], this.edges[r][1]);
      if ($i(o, this.points.length, r), s.length === 0 && a.length === 0) {
        e.push(o);
        continue;
      }
      s.unshift(this.points[o[0]][0]), s.push(this.points[o[1]][0]), a.unshift(this.points[o[0]][1]), a.push(this.points[o[1]][1]);
      const c = [s, a].map((l) => {
        const u = l.map((h, m, b) => {
          if (m === 0) return 0;
          const g = b[m - 1];
          return Math.sqrt(
            Math.pow(h[0] - g[0], 2) + Math.pow(h[1] - g[1], 2)
          );
        }), f = u.reduce((h, m, b) => b === 0 ? [0] : (h.push(h[b - 1] + m), h), []);
        return f.map((h, m, b) => {
          const g = h / b[b.length - 1];
          return [l[m], u[m], f[m], g];
        });
      });
      c.map((l, u) => {
        const f = c[u ? 0 : 1];
        return l.filter((h, m) => !(m === 0 || m === l.length - 1 || h[4] === "handled")).flatMap((h) => {
          const m = h[0], b = h[3], g = f.reduce(
            (_, B, v, x) => {
              if (_) return _;
              const d = x[v + 1];
              if (B[3] === b)
                return B[4] = "handled", [B];
              if (B[3] < b && d && d[3] > b)
                return [B, d];
            },
            void 0
          );
          if (g && g.length === 1)
            return u === 0 ? [[m, g[0][0], b]] : [[g[0][0], m, b]];
          if (g && g.length === 2) {
            const _ = g[0], B = g[1], v = (b - _[3]) / (B[3] - _[3]), x = [
              (B[0][0] - _[0][0]) * v + _[0][0],
              (B[0][1] - _[0][1]) * v + _[0][1]
            ];
            return u === 0 ? [[m, x, b]] : [[x, m, b]];
          }
          return [];
        });
      }).reduce((l, u) => l.concat(u), []).sort((l, u) => l[2] < u[2] ? -1 : 1).map((l, u, f) => {
        this.edgeNodes[n] = [
          l[0],
          l[1]
        ];
        const h = jt(
          l[0],
          l[1],
          `e${n}`
        );
        n++, t.forw.push(h), t.bakw.push(Gt(h)), u === 0 ? e.push([o[0], t.forw.length - 1]) : e.push([
          t.forw.length - 2,
          t.forw.length - 1
        ]), u === f.length - 1 && e.push([t.forw.length - 1, o[1]]);
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
    const t = this.xy[0] - 0.05 * this.wh[0], e = this.xy[0] + 1.05 * this.wh[0], n = this.xy[1] - 0.05 * this.wh[1], r = this.xy[1] + 1.05 * this.wh[1];
    if (this.bounds && !this.boundsPolygon) throw new Error("Internal error: bounds is set but boundsPolygon is missing");
    const o = this.bounds ? this.boundsPolygon : void 0;
    if (!this.points.reduce((c, l) => c && (o ? ln(l[0], o) : l[0][0] >= t && l[0][0] <= e && l[0][1] >= n && l[0][1] <= r), !0))
      throw "SOME POINTS OUTSIDE";
    let a = [];
    return this.wh && (a = [[t, n], [e, n], [t, r], [e, r]]), {
      pointsSet: this.generatePointsSet(),
      bbox: a,
      minx: t,
      maxx: e,
      miny: n,
      maxy: r
    };
  }
  /** 余白を加える前の GCP の外接矩形を求める。 */
  computeGcpBbox() {
    let t = 1 / 0, e = -1 / 0, n = 1 / 0, r = -1 / 0;
    for (const o of this.points) {
      const s = o[0][0], a = o[0][1];
      s < t && (t = s), s > e && (e = s), a < n && (n = a), a > r && (r = a);
    }
    return { minx: t, maxx: e, miny: n, maxy: r };
  }
  /**
   * TINネットワークを同期的に更新し、座標変換の準備を行います。
   * 重めの計算を伴うため、呼び出し側が非同期制御を行いたい場合は
   * {@link updateTinAsync} を利用してください。
   */
  updateTin() {
    if (this.mesh = void 0, this.meshFailure = void 0, this.rebuildAll(), this.incremental) {
      const t = Oi(this.getCompiled(), this.pointsSet.edges);
      "model" in t ? this.mesh = t.model : this.meshFailure = t.reason;
    }
  }
  /** 三角網を最初から全部組む（`updateTin()` の本体）。 */
  rebuildAll() {
    this.lastBoundaryDiagnostics = void 0, this.supplementRecords = [], this.attemptTotal = 0, this.lastSupplementDiagnostics = void 0;
    let t = this.strictMode;
    t !== nt.MODE_STRICT && t !== nt.MODE_LOOSE && (t = nt.MODE_AUTO);
    const e = !this.useV2Algorithm, n = this.requestedWorldFile;
    if (n && !e) throw new Error("V2 では world file 外周を使えません");
    let r, o, s, a, c;
    if (e) {
      if (this.bounds) {
        const R = this.boundsPolygon;
        if (!R) throw new Error("Internal error: bounds is set but boundsPolygon is missing");
        if (!this.points.every(
          (T) => ln(T[0], R)
        )) throw "SOME POINTS OUTSIDE";
      }
      r = this.generatePointsSet(), { minx: o, maxx: s, miny: a, maxy: c } = this.computeGcpBbox();
    } else {
      const R = this.validateAndPrepareInputs();
      r = R.pointsSet, o = R.minx, s = R.maxx, a = R.miny, c = R.maxy;
    }
    const l = {
      forw: Mt([...r.forw]),
      bakw: Mt([...r.bakw])
    }, u = we(
      l.forw,
      r.edges,
      "target"
    ), f = we(
      l.bakw,
      r.edges,
      "target"
    );
    if (u.features.length === 0 || f.features.length === 0)
      throw "TOO LINEAR1";
    const h = Qs(l.forw), m = Sn(l.forw);
    if (!m) throw "TOO LINEAR2";
    const b = {}, g = m.geometry.coordinates[0];
    let _;
    try {
      _ = g.map((R) => ({
        forw: R,
        bakw: Oe(zt(R), u)
      })), _.forEach((R) => {
        b[`${R.forw[0]}:${R.forw[1]}`] = R;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const B = Sn(l.bakw);
    if (!B) throw "TOO LINEAR2";
    const v = B.geometry.coordinates[0];
    try {
      _ = v.map((R) => ({
        bakw: R,
        forw: Oe(zt(R), f)
      })), _.forEach((R) => {
        b[`${R.forw[0]}:${R.forw[1]}`] = R;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const x = {
      forw: h.geometry.coordinates,
      bakw: Oe(h, u)
    }, d = jt(x.forw, x.bakw, "c");
    this.centroid = {
      forw: d,
      bakw: Gt(d)
    };
    const p = [
      ...this.points.map((R) => ({ forw: R[0], bakw: R[1] })),
      ...(this.edgeNodes ?? []).map((R) => ({ forw: R[0], bakw: R[1] }))
    ], w = {
      convexBuf: b,
      centroid: x,
      allGcps: p,
      minx: o,
      maxx: s,
      miny: a,
      maxy: c
    }, k = t === nt.MODE_STRICT || t === nt.MODE_AUTO, M = (R, S, T) => {
      if (!k || this.isStrict() || !R.boundary) return { result: R };
      const E = () => ({
        build: this.captureBuild(),
        raw: [r.forw.slice(), r.bakw.slice()],
        gcps: p.slice(),
        edgeNodes: this.edgeNodes.slice(),
        supplementRecords: this.supplementRecords,
        supplementDiagnostics: this.lastSupplementDiagnostics
      }), D = (X) => {
        r.forw.splice(0, r.forw.length, ...X.raw[0]), r.bakw.splice(0, r.bakw.length, ...X.raw[1]), p.splice(0, p.length, ...X.gcps), this.edgeNodes.splice(0, this.edgeNodes.length, ...X.edgeNodes), this.restoreBuild(X.build), this.supplementRecords = X.supplementRecords, this.lastSupplementDiagnostics = X.supplementDiagnostics;
      }, I = E(), F = this.attemptTotal, y = () => this.attemptTotal - F, P = (X, Y) => {
        const G = Y.map(([W]) => W), j = Y.map(([, W]) => W);
        return (X[0] === Math.min(...G) || X[0] === Math.max(...G)) && (X[1] === Math.min(...j) || X[1] === Math.max(...j));
      }, $ = (X) => {
        r.forw.splice(0, r.forw.length, ...I.raw[0]), r.bakw.splice(0, r.bakw.length, ...I.raw[1]), p.splice(0, p.length, ...I.gcps), this.edgeNodes.splice(0, this.edgeNodes.length, ...I.edgeNodes), this.supplementRecords = [];
        const Y = T(X);
        return { built: Y, strict: Y.boundary !== void 0 && this.isStrict() };
      }, V = /* @__PURE__ */ new Set(), z = R.boundary.vertices.map(({ forw: X }) => X), L = new Set(
        z.filter((X) => !P(X, z)).map((X) => Tn(X, x.forw))
      );
      try {
        let X = R;
        for (let Y = 0; Y < Ni && !(y() + S >= Wn * S); Y++) {
          const G = X.boundary.vertices.map(({ forw: H }) => H), j = V.size;
          for (const H of Cr(this.tins.forw)) {
            if (P(H, G)) continue;
            const Q = Tn(H, x.forw);
            for (let J = -Kn; J <= Kn; J++) V.add((Q + J + 36) % 36);
          }
          if (V.size === j || V.size >= Di) break;
          const W = $({ skipBins: new Set(V) });
          if (!W.built.boundary)
            return D(I), { result: R };
          if (W.strict) {
            let H = { result: W.built, state: E() };
            for (const Q of Ri(V)) {
              if (!Q.some((lt) => L.has(lt))) continue;
              if (y() >= Pi * S) break;
              const J = new Set([...V].filter((lt) => !Q.includes(lt))), ct = $({ skipBins: J });
              if (ct.strict) {
                for (const lt of Q) V.delete(lt);
                H = { result: ct.built, state: E() };
              }
            }
            return D(H.state), { result: H.result, kind: "thinned" };
          }
          X = W.built;
        }
        if (y() < Wn * S) {
          const Y = $({ cornersOnly: !0 });
          if (Y.strict) return { result: Y.built, kind: "corners" };
        }
      } catch {
      }
      return D(I), { result: R };
    };
    if (n) {
      this.stateTriangle = void 0;
      const R = this.yaxisMode === nt.YAXIS_FOLLOW, S = R ? 1 : -1, T = (P) => this.buildWithSupplements(t, r, p, ($, V, z) => (L) => ({ boundary: In(
        P ? { ...w, ring: P } : w,
        (X) => Dr(X, (Y) => {
          const [G, j] = Ss(n, Y);
          return [G, R ? -j : j];
        }),
        r,
        this.points.length,
        {
          orientation: S,
          accept: (X) => X.hasMapBoundary ? (this.buildTin(r, X.vertices, V, X, L.size > 0, z), (this.strict_status !== nt.STATUS_LOOSE || X.hasBoundary) && _e(this.tins.forw, S) === 0 && _e(this.tins.bakw, S) === 0) : !1
        },
        L,
        $
      ) })), E = this.attemptTotal, D = T(), I = this.attemptTotal - E, { result: { boundary: F }, kind: y } = M(D, I, T);
      if (F) {
        this.compiledOuter = {
          outerTransform: "worldFile",
          worldFile: n,
          vertices_points: F.vertices.map(({ forw: L, bakw: X }) => [L, X])
        };
        const { centroid: P, xy: $, wh: V, kinks: z } = this;
        super.setCompiled(this.getCompiled()), Object.assign(this, { centroid: P, xy: $, wh: V, kinks: z }), this.lastBoundaryDiagnostics = {
          ...F.diagnostics,
          ...y ? { ringRescue: y } : {},
          requestedOuterTransform: "worldFile",
          outerTransform: "worldFile"
        };
        return;
      }
      this.compiledOuter = { outerTransform: "extrapolate" }, this.outerTransform = "extrapolate", this.worldFile = void 0;
    }
    const A = this.vertexMode === nt.VERTEX_BIRDEYE ? Pr : Nr;
    let N, O, C;
    if (e) {
      const R = (D) => this.buildWithSupplements(t, r, p, (I, F, y) => (P) => {
        const $ = D ? { ...w, ring: D } : w, V = In(
          $,
          A,
          r,
          this.points.length,
          void 0,
          P,
          I
        );
        return {
          boundary: V,
          verticesList: this.buildTin(
            r,
            V?.vertices ?? A($, !1),
            F,
            V,
            P.size > 0,
            y
          )
        };
      }), S = this.attemptTotal, T = R(), E = M(T, this.attemptTotal - S, R);
      ({ boundary: N, verticesList: O } = E.result), C = E.kind;
    } else
      O = this.buildTin(
        r,
        A(w, !1),
        t,
        void 0
      );
    this.vertices_params = {
      forw: _n(O.forw, this.centroid.forw),
      bakw: _n(O.bakw, this.centroid.bakw)
    }, this.addIndexedTin(), this.pointsWeightBuffer = {}, this.lastBoundaryDiagnostics = N && C ? { ...N.diagnostics, ringRescue: C } : N?.diagnostics, n && this.lastBoundaryDiagnostics && (this.lastBoundaryDiagnostics = {
      ...this.lastBoundaryDiagnostics,
      requestedOuterTransform: "worldFile",
      outerTransform: "extrapolate",
      fallbackReason: "boundaryFlips"
    });
  }
  /**
   * `buildWithHull` で三角網を組み、strict のために制約から外した凸包の辺があれば、システムが補完点を
   * 足して組み直す（#89）。外れた辺が無いとき、補完点を使わない指定のとき、V2 のときは、`buildWithHull` の
   * 結果をそのまま返す。
   *
   * 補完点は rawPointsSet と allGcps と edgeNodes の末尾に、添字 `e{n}` で足す（必須エッジの中継点の
   * 続き番号）。重心・扇形外挿の推定（pointsSetFC・convexBuf）には入れない。loose 指定には足さない
   * （MaplatTin#95）。
   *
   * @param makeAttempt 点群ごとの探索の入れ物と strict の方式・「三角網の向きを読むだけ」（交差を調べない）を
   *   受け取り、`buildWithHull` に渡す試行を返す
   */
  buildWithSupplements(t, e, n, r) {
    let o = 0;
    const s = (w, k, M) => {
      const A = r(w, k, M);
      return (N) => (o++, this.attemptTotal++, A(N));
    }, a = (w) => this.buildWithHull(w, s(/* @__PURE__ */ new Map(), w, !1));
    if (!this.useSupplementPairs || this.useV2Algorithm || t === nt.MODE_LOOSE) return a(t);
    const c = t, l = a(c), u = o;
    let f = 0;
    if (!l.boundary || this.strict_status !== nt.STATUS_STRICT) return l;
    const h = ze(this.tins.forw, this.pointsSet.forw.features, l.boundary.forwHull.all);
    if (h.dropped.length === 0) return l;
    const m = this.edgeNodes.length, b = e.forw.length, g = n.length;
    let _ = [], B;
    const v = (w, k) => w.length === k.length && w.every((M, A) => M.every((N, O) => N[0] === k[A][O][0] && N[1] === k[A][O][1])), x = (w) => {
      e.forw.length = b, e.bakw.length = b, n.length = g, this.edgeNodes.length = m;
      for (const [k, M] of w) {
        const A = jt(k, M, `e${this.edgeNodes.length}`);
        this.edgeNodes.push([k, M]), e.forw.push(A), e.bakw.push(Gt(A)), n.push({ forw: k, bakw: M });
      }
      _ = w;
    }, p = Ei({
      edgeBase: m,
      baseCost: u,
      buildCost: () => f,
      snapshot: () => ({ pairs: _, state: this.captureBuild() }),
      restore: ({ pairs: w, state: k }) => {
        x(w), this.restoreBuild(k);
      },
      measure: (w) => {
        x(w);
        const k = this.captureBuild();
        try {
          const M = /* @__PURE__ */ new Map();
          B = { pairs: w, cache: M };
          const { boundary: A } = r(M, nt.MODE_STRICT, !0)(/* @__PURE__ */ new Set());
          return A ? ze(this.tins.forw, this.pointsSet.forw.features, []) : void 0;
        } finally {
          this.restoreBuild(k);
        }
      },
      build: (w, k) => {
        x(w);
        const M = B && v(B.pairs, w) ? B.cache : /* @__PURE__ */ new Map(), A = o;
        let N;
        try {
          N = this.buildWithHull(c, (O) => {
            if (o - A >= k) throw Hn;
            return s(M, c, !1)(O);
          });
        } catch (O) {
          if (O !== Hn) throw O;
          f += o - A;
          return;
        }
        if (f += o - A, !(!N.boundary || this.strict_status !== nt.STATUS_STRICT))
          return {
            result: N,
            analysis: ze(this.tins.forw, this.pointsSet.forw.features, N.boundary.forwHull.all)
          };
      }
    }, { result: l, analysis: h });
    return this.supplementRecords = p.records, this.lastSupplementDiagnostics = p.diagnostics, p.result;
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
    let r;
    const o = (g) => [...g].sort().join(","), s = (g, _ = !1) => {
      const B = o(g), v = n.get(B);
      if (v) return v;
      const x = e(g), d = {
        value: x,
        strict: x.boundary !== void 0 && this.strict_status === nt.STATUS_STRICT
      };
      return (d.strict || _) && (d.state = this.captureBuild()), n.set(B, d), r = d, d;
    }, a = (g) => (r !== g && this.restoreBuild(g.state), r = g, g.value), c = s(/* @__PURE__ */ new Set(), !0);
    if (!(t === nt.MODE_STRICT || t === nt.MODE_AUTO) || !c.value.boundary || c.strict) return c.value;
    const u = new Set(c.value.boundary.forwHull.all.map(Me)), f = () => this.pointsSet.forw.features.map(
      (g) => g.properties.target.index
    ), h = /* @__PURE__ */ new Set();
    let m = c, b;
    for (let g = 0; g < Fi; g++) {
      const _ = wi(
        this.tins.forw,
        m.value.boundary.forwHull.applied,
        f()
      ).filter((B) => !h.has(Me(B)));
      if (_.length === 0) break;
      for (const B of _) h.add(Me(B));
      if (m = s(h), !m.value.boundary) break;
      if (m.strict) {
        b = m;
        break;
      }
    }
    if (b) {
      let g = b;
      for (const _ of [...h].slice(0, Ci)) {
        const B = new Set(h);
        B.delete(_);
        const v = s(B);
        v.strict && (h.delete(_), g = v);
      }
      return a(g);
    }
    if (h.size < u.size) {
      const g = s(u);
      if (g.strict) return a(g);
    }
    return a(c);
  }
  /** 今の三角網が strict か（組み立ての途中で `strict_status` が変わるので、型の絞り込みを避けて読む）。 */
  isStrict() {
    return this.strict_status === nt.STATUS_STRICT;
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
  buildTin(t, e, n, r, o = !1, s = !1) {
    const a = {
      forw: [],
      bakw: []
    };
    for (let c = 0; c < e.length; c++) {
      const l = e[c].forw, u = e[c].bakw, f = jt(l, u, `b${c}`), h = Gt(f);
      a.forw.push(f), a.bakw.push(h);
    }
    return this.pointsSet = {
      forw: Mt([...t.forw, ...a.forw]),
      bakw: Mt([...t.bakw, ...a.bakw]),
      edges: t.edges
    }, this.tins = {
      forw: nn(
        r?.forw ?? we(this.pointsSet.forw, t.edges, "target")
      )
    }, (n === nt.MODE_STRICT || n === nt.MODE_AUTO) && (s ? this.resolveStrictOverlaps() : this.calculateStrictTin(
      n === nt.MODE_AUTO || o ? 1 : Pn
    )), (n === nt.MODE_LOOSE || n === nt.MODE_AUTO && this.strict_status === nt.STATUS_ERROR) && (this.tins.bakw = nn(
      r?.bakw ?? we(this.pointsSet.bakw, t.edges, "target")
    ), delete this.kinks, this.strict_status = nt.STATUS_LOOSE), a;
  }
  /**
   * 非同期ラッパーを提供します。
   * 互換性のために Promise ベースの API を維持しますが、内部処理は同期的です。
   */
  async updateTinAsync() {
    this.updateTin();
  }
}
function $i(i, t, e) {
  const n = (r) => Number.isInteger(r) && r >= 0 && r < t;
  if (!Array.isArray(i) || !n(i[0]) || !n(i[1]))
    throw new Error(
      `Invalid edge at edges[${e}]: start/end ${JSON.stringify(i)} must be integer indices of points (0 to ${t - 1})`
    );
}
const Vi = 3, gt = (i) => ({ ok: !1, reason: i }), Xi = Math.sign(
  He(0, 0, 1, 0, 0, 1, 0.25, 0.25) * st(0, 0, 1, 0, 0, 1)
), Jn = (i, t, e) => st(i[0], i[1], t[0], t[1], e[0], e[1]);
function fs(i, t, e) {
  const n = (a) => i.vertices.get(a).forw, r = (a) => {
    const c = i.positive(a);
    return c !== void 0 && c.every((l, u) => Jn(n(l), n(c[(u + 1) % 3]), t) >= 0);
  }, o = [e];
  let s = e;
  for (let a = 0; a <= i.triangles.size; a++) {
    const c = i.positive(s);
    if (!c) break;
    let l, u = !1;
    for (let f = 0; f < 3 && l === void 0; f++) {
      const h = c[f], m = c[(f + 1) % 3];
      Jn(n(h), n(m), t) >= 0 || (u = !0, l = i.byEdge.get(dt(h, m)).find((b) => b !== s));
    }
    if (!u) return { triangle: s, path: o };
    if (l === void 0) break;
    s = l, o.push(s);
  }
  for (const a of i.triangles.keys())
    if (r(a)) return { triangle: a, path: [a] };
}
function us(i, t, e) {
  const n = (s) => i.vertices.get(s).forw, r = /* @__PURE__ */ new Set([e]), o = [e];
  for (let s = 0; s < o.length; s++) {
    const a = i.triangles.get(o[s]);
    for (let c = 0; c < 3; c++) {
      const l = dt(a[c], a[(c + 1) % 3]);
      if (!((i.edgeFlags.get(l) ?? 0) & (Ae | Be)))
        for (const u of i.byEdge.get(l)) {
          if (r.has(u)) continue;
          const f = i.positive(u);
          if (!f) continue;
          const [h, m, b] = f.map(n);
          He(
            h[0],
            h[1],
            m[0],
            m[1],
            b[0],
            b[1],
            t[0],
            t[1]
          ) * Xi > 0 && (r.add(u), o.push(u));
        }
    }
  }
  return r;
}
function Ze(i, t, e) {
  let n = t, r = "notDisk";
  for (let o = 0; o <= Vi; o++) {
    const s = i.replace(n, e);
    if (s.ok)
      return {
        ok: !0,
        mode: "replaced",
        removed: s.removed,
        added: s.added,
        grown: o,
        size: n.size
      };
    if (r = s.reason, r === "tooLarge") break;
    n = i.grow(n);
  }
  return gt(r);
}
function hs(i, t) {
  for (const e of i.byVertex.get(t)) {
    const n = i.triangles.get(e);
    for (let r = 0; r < 3; r++) {
      const o = n[r], s = n[(r + 1) % 3];
      if (i.vertices.get(o).ref.kind === "boundary") return !0;
      if (o !== t && s !== t) continue;
      const a = dt(o, s);
      if (i.byEdge.get(a).length === 1 || (i.edgeFlags.get(a) ?? 0) & Be) return !0;
    }
  }
  return !1;
}
const ds = (i, t) => i.triangles.get(t).some((e) => i.vertices.get(e).ref.kind === "boundary"), gs = (i, t) => i[0] === t[0] && i[1] === t[1];
function zi(i, t, e) {
  const { mesh: n } = i, r = i.pointVertex.get(t);
  if (r === void 0) return gt("unknownPoint");
  const o = n.vertices.get(r), s = e.forw ?? o.forw, a = e.bakw ?? o.bakw;
  if (i.edges.some(
    (f) => (f.start === r || f.end === r) && f.nodes.length > 0
  ) || hs(n, r)) return gt("unsupported");
  const c = n.star(r);
  if (c.size === 0) return gt("unsupported");
  const l = /* @__PURE__ */ new Map([[r, { forw: s, bakw: a }]]);
  let u = c;
  if (gs(s, o.forw)) {
    const f = (m) => m === r ? { ...o, bakw: a } : n.vertices.get(m);
    if ([...c].every((m) => {
      const [b, g, _] = n.triangles.get(m);
      return n.okNew(b, g, _, f);
    }))
      return n.relocate(r, s, a), {
        ok: !0,
        mode: "moved",
        removed: [],
        added: [],
        grown: 0,
        size: c.size
      };
  } else {
    const f = fs(n, s, c.values().next().value);
    if (!f) return gt("pointOutside");
    if (ds(n, f.triangle)) return gt("unsupported");
    if (!c.has(f.triangle)) {
      u = new Set(c);
      for (const h of f.path) u.add(h);
      for (const h of us(n, s, f.triangle)) u.add(h);
    }
  }
  return Ze(n, u, { move: l });
}
function Ui(i, t, e, n, r) {
  const { mesh: o } = i;
  if (i.pointVertex.has(t)) return gt("idInUse");
  const s = o.triangles.keys().next().value;
  if (s === void 0) return gt("unsupported");
  const a = fs(o, e, s);
  if (!a) return gt("pointOutside");
  if (o.triangles.get(a.triangle).some((f) => gs(o.vertices.get(f).forw, e)))
    return gt("duplicate");
  if (ds(o, a.triangle)) return gt("unsupported");
  const l = o.addVertex({ kind: "gcp", id: t }, e, n), u = Ze(o, us(o, e, a.triangle), {
    add: [l]
  });
  return u.ok ? (i.gcps.splice(r ?? i.gcps.length, 0, l), i.pointVertex.set(t, l), u) : (o.dropVertex(l), u);
}
function qi(i, t) {
  const { mesh: e } = i, n = i.pointVertex.get(t);
  if (n === void 0) return gt("unknownPoint");
  if (i.edges.some((s) => s.start === n || s.end === n) || i.supplements.some(
    (s) => s.edge.includes(n) || s.anchor === n
  ) || hs(e, n)) return gt("unsupported");
  const r = e.star(n);
  if (r.size === 0) return gt("unsupported");
  const o = Ze(e, r, { remove: [n] });
  return o.ok && (i.gcps.splice(i.gcps.indexOf(n), 1), i.pointVertex.delete(t)), o;
}
export {
  ke as BOUNDARY_GROUP,
  Be as EDGE_HULL,
  Ai as EDGE_PROTECT,
  Ae as EDGE_REQUIRED,
  Bi as IncrementalMesh,
  Ti as MeshModel,
  nt as Tin,
  we as constrainedTin,
  Gt as counterPoint,
  jt as createPoint,
  nt as default,
  Yi as findIntersections,
  jn as format_version,
  Ui as insertPoint,
  os as insertSearchIndex,
  Oi as meshFromCompiled,
  zi as movePoint,
  qi as removePoint,
  _n as vertexCalc
};
