import { counterTri as Pn, Transform as Qn, validateWorldFile as Zn, normalizeEdges as ti, transformArr as Me, rotateVerticesTriangle as Ve, worldFileToCrs as ei } from "@maplat/transform";
function ee(r, t, e = {}) {
  const n = { type: "Feature" };
  return (e.id === 0 || e.id) && (n.id = e.id), e.bbox && (n.bbox = e.bbox), n.properties = t || {}, n.geometry = r, n;
}
function Lt(r, t, e = {}) {
  if (!r)
    throw new Error("coordinates is required");
  if (!Array.isArray(r))
    throw new Error("coordinates must be an Array");
  if (r.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!Ge(r[0]) || !Ge(r[1]))
    throw new Error("coordinates must contain numbers");
  return ee({
    type: "Point",
    coordinates: r
  }, t, e);
}
function re(r, t, e = {}) {
  for (const s of r) {
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
  return ee({
    type: "Polygon",
    coordinates: r
  }, t, e);
}
function ze(r, t, e = {}) {
  if (r.length < 2)
    throw new Error("coordinates must be an array of two or more positions");
  return ee({
    type: "LineString",
    coordinates: r
  }, t, e);
}
function xt(r, t = {}) {
  const e = { type: "FeatureCollection" };
  return t.id && (e.id = t.id), t.bbox && (e.bbox = t.bbox), e.features = r, e;
}
function Ge(r) {
  return !isNaN(r) && r !== null && !Array.isArray(r);
}
function ni(r) {
  if (!r)
    throw new Error("coord is required");
  if (!Array.isArray(r)) {
    if (r.type === "Feature" && r.geometry !== null && r.geometry.type === "Point")
      return [...r.geometry.coordinates];
    if (r.type === "Point")
      return [...r.coordinates];
  }
  if (Array.isArray(r) && r.length >= 2 && !Array.isArray(r[0]) && !Array.isArray(r[1]))
    return [...r];
  throw new Error("coord must be GeoJSON Point or an Array of numbers");
}
function ii(r) {
  return r.type === "Feature" ? r.geometry : r;
}
function Xe(r, t, e) {
  if (r !== null)
    for (var n, s, o, i, a, c, l, f = 0, u = 0, h, y = r.type, m = y === "FeatureCollection", p = y === "Feature", _ = m ? r.features.length : 1, I = 0; I < _; I++) {
      l = m ? (
        // @ts-expect-error: Known type conflict
        r.features[I].geometry
      ) : p ? (
        // @ts-expect-error: Known type conflict
        r.geometry
      ) : r, h = l ? l.type === "GeometryCollection" : !1, a = h ? l.geometries.length : 1;
      for (var g = 0; g < a; g++) {
        var w = 0, d = 0;
        if (i = h ? l.geometries[g] : l, i !== null) {
          c = i.coordinates;
          var b = i.type;
          switch (f = e && (b === "Polygon" || b === "MultiPolygon") ? 1 : 0, b) {
            case null:
              break;
            case "Point":
              if (
                // @ts-expect-error: Known type conflict
                t(
                  c,
                  u,
                  I,
                  w,
                  d
                ) === !1
              )
                return !1;
              u++, w++;
              break;
            case "LineString":
            case "MultiPoint":
              for (n = 0; n < c.length; n++) {
                if (
                  // @ts-expect-error: Known type conflict
                  t(
                    c[n],
                    u,
                    I,
                    w,
                    d
                  ) === !1
                )
                  return !1;
                u++, b === "MultiPoint" && w++;
              }
              b === "LineString" && w++;
              break;
            case "Polygon":
            case "MultiLineString":
              for (n = 0; n < c.length; n++) {
                for (s = 0; s < c[n].length - f; s++) {
                  if (
                    // @ts-expect-error: Known type conflict
                    t(
                      c[n][s],
                      u,
                      I,
                      w,
                      d
                    ) === !1
                  )
                    return !1;
                  u++;
                }
                b === "MultiLineString" && w++, b === "Polygon" && d++;
              }
              b === "Polygon" && w++;
              break;
            case "MultiPolygon":
              for (n = 0; n < c.length; n++) {
                for (d = 0, s = 0; s < c[n].length; s++) {
                  for (o = 0; o < c[n][s].length - f; o++) {
                    if (
                      // @ts-expect-error: Known type conflict
                      t(
                        c[n][s][o],
                        u,
                        I,
                        w,
                        d
                      ) === !1
                    )
                      return !1;
                    u++;
                  }
                  d++;
                }
                w++;
              }
              break;
            case "GeometryCollection":
              for (n = 0; n < i.geometries.length; n++)
                if (
                  // @ts-expect-error: Known type conflict
                  Xe(i.geometries[n], t, e) === !1
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
const pt = 11102230246251565e-32, V = 134217729, Rn = (3 + 8 * pt) * pt;
function ht(r, t, e, n, s) {
  let o, i, a, c, l = t[0], f = n[0], u = 0, h = 0;
  f > l == f > -l ? (o = l, l = t[++u]) : (o = f, f = n[++h]);
  let y = 0;
  if (u < r && h < e)
    for (f > l == f > -l ? (i = l + o, a = o - (i - l), l = t[++u]) : (i = f + o, a = o - (i - f), f = n[++h]), o = i, a !== 0 && (s[y++] = a); u < r && h < e; )
      f > l == f > -l ? (i = o + l, c = i - o, a = o - (i - c) + (l - c), l = t[++u]) : (i = o + f, c = i - o, a = o - (i - c) + (f - c), f = n[++h]), o = i, a !== 0 && (s[y++] = a);
  for (; u < r; )
    i = o + l, c = i - o, a = o - (i - c) + (l - c), l = t[++u], o = i, a !== 0 && (s[y++] = a);
  for (; h < e; )
    i = o + f, c = i - o, a = o - (i - c) + (f - c), f = n[++h], o = i, a !== 0 && (s[y++] = a);
  return (o !== 0 || y === 0) && (s[y++] = o), y;
}
function Mt(r, t, e, n, s, o, i, a) {
  return ht(ht(r, t, e, n, i), i, s, o, a);
}
function U(r, t, e, n) {
  let s, o, i, a, c, l, f, u, h, y, m;
  f = V * e, y = f - (f - e), m = e - y;
  let p = t[0];
  s = p * e, f = V * p, u = f - (f - p), h = p - u, i = h * m - (s - u * y - h * y - u * m);
  let _ = 0;
  i !== 0 && (n[_++] = i);
  for (let I = 1; I < r; I++)
    p = t[I], a = p * e, f = V * p, u = f - (f - p), h = p - u, c = h * m - (a - u * y - h * y - u * m), o = s + c, l = o - s, i = s - (o - l) + (c - l), i !== 0 && (n[_++] = i), s = a + o, i = o - (s - a), i !== 0 && (n[_++] = i);
  return (s !== 0 || _ === 0) && (n[_++] = s), _;
}
function $n(r, t) {
  let e = t[0];
  for (let n = 1; n < r; n++) e += t[n];
  return e;
}
function tt(r) {
  return new Float64Array(r);
}
const ri = (3 + 16 * pt) * pt, si = (2 + 12 * pt) * pt, oi = (9 + 64 * pt) * pt * pt, Ut = tt(4), Ke = tt(8), We = tt(12), He = tt(16), gt = tt(4);
function ai(r, t, e, n, s, o, i) {
  let a, c, l, f, u, h, y, m, p, _, I, g, w, d, b, S, A, k;
  const E = r - s, O = e - s, T = t - o, P = n - o;
  d = E * P, h = V * E, y = h - (h - E), m = E - y, h = V * P, p = h - (h - P), _ = P - p, b = m * _ - (d - y * p - m * p - y * _), S = T * O, h = V * T, y = h - (h - T), m = T - y, h = V * O, p = h - (h - O), _ = O - p, A = m * _ - (S - y * p - m * p - y * _), I = b - A, u = b - I, Ut[0] = b - (I + u) + (u - A), g = d + I, u = g - d, w = d - (g - u) + (I - u), I = w - S, u = w - I, Ut[1] = w - (I + u) + (u - S), k = g + I, u = k - g, Ut[2] = g - (k - u) + (I - u), Ut[3] = k;
  let F = $n(4, Ut), x = si * i;
  if (F >= x || -F >= x || (u = r - E, a = r - (E + u) + (u - s), u = e - O, l = e - (O + u) + (u - s), u = t - T, c = t - (T + u) + (u - o), u = n - P, f = n - (P + u) + (u - o), a === 0 && c === 0 && l === 0 && f === 0) || (x = oi * i + Rn * Math.abs(F), F += E * f + P * a - (T * l + O * c), F >= x || -F >= x)) return F;
  d = a * P, h = V * a, y = h - (h - a), m = a - y, h = V * P, p = h - (h - P), _ = P - p, b = m * _ - (d - y * p - m * p - y * _), S = c * O, h = V * c, y = h - (h - c), m = c - y, h = V * O, p = h - (h - O), _ = O - p, A = m * _ - (S - y * p - m * p - y * _), I = b - A, u = b - I, gt[0] = b - (I + u) + (u - A), g = d + I, u = g - d, w = d - (g - u) + (I - u), I = w - S, u = w - I, gt[1] = w - (I + u) + (u - S), k = g + I, u = k - g, gt[2] = g - (k - u) + (I - u), gt[3] = k;
  const B = ht(4, Ut, 4, gt, Ke);
  d = E * f, h = V * E, y = h - (h - E), m = E - y, h = V * f, p = h - (h - f), _ = f - p, b = m * _ - (d - y * p - m * p - y * _), S = T * l, h = V * T, y = h - (h - T), m = T - y, h = V * l, p = h - (h - l), _ = l - p, A = m * _ - (S - y * p - m * p - y * _), I = b - A, u = b - I, gt[0] = b - (I + u) + (u - A), g = d + I, u = g - d, w = d - (g - u) + (I - u), I = w - S, u = w - I, gt[1] = w - (I + u) + (u - S), k = g + I, u = k - g, gt[2] = g - (k - u) + (I - u), gt[3] = k;
  const M = ht(B, Ke, 4, gt, We);
  d = a * f, h = V * a, y = h - (h - a), m = a - y, h = V * f, p = h - (h - f), _ = f - p, b = m * _ - (d - y * p - m * p - y * _), S = c * l, h = V * c, y = h - (h - c), m = c - y, h = V * l, p = h - (h - l), _ = l - p, A = m * _ - (S - y * p - m * p - y * _), I = b - A, u = b - I, gt[0] = b - (I + u) + (u - A), g = d + I, u = g - d, w = d - (g - u) + (I - u), I = w - S, u = w - I, gt[1] = w - (I + u) + (u - S), k = g + I, u = k - g, gt[2] = g - (k - u) + (I - u), gt[3] = k;
  const N = ht(M, We, 4, gt, He);
  return He[N - 1];
}
function at(r, t, e, n, s, o) {
  const i = (t - o) * (e - s), a = (r - s) * (n - o), c = i - a, l = Math.abs(i + a);
  return Math.abs(c) >= ri * l ? c : -ai(r, t, e, n, s, o, l);
}
const ci = (10 + 96 * pt) * pt, li = (4 + 48 * pt) * pt, ui = (44 + 576 * pt) * pt * pt, Ot = tt(4), Nt = tt(4), Ct = tt(4), _t = tt(4), kt = tt(4), Et = tt(4), mt = tt(4), wt = tt(4), _e = tt(8), ke = tt(8), Ee = tt(8), Ae = tt(8), Ie = tt(8), Be = tt(8), oe = tt(8), ae = tt(8), ce = tt(8), Rt = tt(4), $t = tt(4), Xt = tt(4), z = tt(8), H = tt(16), it = tt(16), rt = tt(16), et = tt(32), Dt = tt(32), lt = tt(48), vt = tt(64);
let Gt = tt(1152), Te = tt(1152);
function ut(r, t, e) {
  r = ht(r, Gt, t, e, Te);
  const n = Gt;
  return Gt = Te, Te = n, r;
}
function fi(r, t, e, n, s, o, i, a, c) {
  let l, f, u, h, y, m, p, _, I, g, w, d, b, S, A, k, E, O, T, P, F, x, B, M, N, D, R, v, C, $, X, Y, L, j, q;
  const W = r - i, K = e - i, G = s - i, Q = t - a, J = n - a, Z = o - a;
  X = K * Z, B = V * K, M = B - (B - K), N = K - M, B = V * Z, D = B - (B - Z), R = Z - D, Y = N * R - (X - M * D - N * D - M * R), L = G * J, B = V * G, M = B - (B - G), N = G - M, B = V * J, D = B - (B - J), R = J - D, j = N * R - (L - M * D - N * D - M * R), v = Y - j, x = Y - v, Ot[0] = Y - (v + x) + (x - j), C = X + v, x = C - X, $ = X - (C - x) + (v - x), v = $ - L, x = $ - v, Ot[1] = $ - (v + x) + (x - L), q = C + v, x = q - C, Ot[2] = C - (q - x) + (v - x), Ot[3] = q, X = G * Q, B = V * G, M = B - (B - G), N = G - M, B = V * Q, D = B - (B - Q), R = Q - D, Y = N * R - (X - M * D - N * D - M * R), L = W * Z, B = V * W, M = B - (B - W), N = W - M, B = V * Z, D = B - (B - Z), R = Z - D, j = N * R - (L - M * D - N * D - M * R), v = Y - j, x = Y - v, Nt[0] = Y - (v + x) + (x - j), C = X + v, x = C - X, $ = X - (C - x) + (v - x), v = $ - L, x = $ - v, Nt[1] = $ - (v + x) + (x - L), q = C + v, x = q - C, Nt[2] = C - (q - x) + (v - x), Nt[3] = q, X = W * J, B = V * W, M = B - (B - W), N = W - M, B = V * J, D = B - (B - J), R = J - D, Y = N * R - (X - M * D - N * D - M * R), L = K * Q, B = V * K, M = B - (B - K), N = K - M, B = V * Q, D = B - (B - Q), R = Q - D, j = N * R - (L - M * D - N * D - M * R), v = Y - j, x = Y - v, Ct[0] = Y - (v + x) + (x - j), C = X + v, x = C - X, $ = X - (C - x) + (v - x), v = $ - L, x = $ - v, Ct[1] = $ - (v + x) + (x - L), q = C + v, x = q - C, Ct[2] = C - (q - x) + (v - x), Ct[3] = q, l = ht(
    ht(
      ht(
        U(U(4, Ot, W, z), z, W, H),
        H,
        U(U(4, Ot, Q, z), z, Q, it),
        it,
        et
      ),
      et,
      ht(
        U(U(4, Nt, K, z), z, K, H),
        H,
        U(U(4, Nt, J, z), z, J, it),
        it,
        Dt
      ),
      Dt,
      vt
    ),
    vt,
    ht(
      U(U(4, Ct, G, z), z, G, H),
      H,
      U(U(4, Ct, Z, z), z, Z, it),
      it,
      et
    ),
    et,
    Gt
  );
  let ct = $n(l, Gt), ft = li * c;
  if (ct >= ft || -ct >= ft || (x = r - W, f = r - (W + x) + (x - i), x = t - Q, y = t - (Q + x) + (x - a), x = e - K, u = e - (K + x) + (x - i), x = n - J, m = n - (J + x) + (x - a), x = s - G, h = s - (G + x) + (x - i), x = o - Z, p = o - (Z + x) + (x - a), f === 0 && u === 0 && h === 0 && y === 0 && m === 0 && p === 0) || (ft = ui * c + Rn * Math.abs(ct), ct += (W * W + Q * Q) * (K * p + Z * u - (J * h + G * m)) + 2 * (W * f + Q * y) * (K * Z - J * G) + ((K * K + J * J) * (G * y + Q * h - (Z * f + W * p)) + 2 * (K * u + J * m) * (G * Q - Z * W)) + ((G * G + Z * Z) * (W * m + J * f - (Q * u + K * y)) + 2 * (G * h + Z * p) * (W * J - Q * K)), ct >= ft || -ct >= ft))
    return ct;
  if ((u !== 0 || m !== 0 || h !== 0 || p !== 0) && (X = W * W, B = V * W, M = B - (B - W), N = W - M, Y = N * N - (X - M * M - (M + M) * N), L = Q * Q, B = V * Q, M = B - (B - Q), N = Q - M, j = N * N - (L - M * M - (M + M) * N), v = Y + j, x = v - Y, _t[0] = Y - (v - x) + (j - x), C = X + v, x = C - X, $ = X - (C - x) + (v - x), v = $ + L, x = v - $, _t[1] = $ - (v - x) + (L - x), q = C + v, x = q - C, _t[2] = C - (q - x) + (v - x), _t[3] = q), (h !== 0 || p !== 0 || f !== 0 || y !== 0) && (X = K * K, B = V * K, M = B - (B - K), N = K - M, Y = N * N - (X - M * M - (M + M) * N), L = J * J, B = V * J, M = B - (B - J), N = J - M, j = N * N - (L - M * M - (M + M) * N), v = Y + j, x = v - Y, kt[0] = Y - (v - x) + (j - x), C = X + v, x = C - X, $ = X - (C - x) + (v - x), v = $ + L, x = v - $, kt[1] = $ - (v - x) + (L - x), q = C + v, x = q - C, kt[2] = C - (q - x) + (v - x), kt[3] = q), (f !== 0 || y !== 0 || u !== 0 || m !== 0) && (X = G * G, B = V * G, M = B - (B - G), N = G - M, Y = N * N - (X - M * M - (M + M) * N), L = Z * Z, B = V * Z, M = B - (B - Z), N = Z - M, j = N * N - (L - M * M - (M + M) * N), v = Y + j, x = v - Y, Et[0] = Y - (v - x) + (j - x), C = X + v, x = C - X, $ = X - (C - x) + (v - x), v = $ + L, x = v - $, Et[1] = $ - (v - x) + (L - x), q = C + v, x = q - C, Et[2] = C - (q - x) + (v - x), Et[3] = q), f !== 0 && (_ = U(4, Ot, f, _e), l = ut(l, Mt(
    U(_, _e, 2 * W, H),
    H,
    U(U(4, Et, f, z), z, J, it),
    it,
    U(U(4, kt, f, z), z, -Z, rt),
    rt,
    et,
    lt
  ), lt)), y !== 0 && (I = U(4, Ot, y, ke), l = ut(l, Mt(
    U(I, ke, 2 * Q, H),
    H,
    U(U(4, kt, y, z), z, G, it),
    it,
    U(U(4, Et, y, z), z, -K, rt),
    rt,
    et,
    lt
  ), lt)), u !== 0 && (g = U(4, Nt, u, Ee), l = ut(l, Mt(
    U(g, Ee, 2 * K, H),
    H,
    U(U(4, _t, u, z), z, Z, it),
    it,
    U(U(4, Et, u, z), z, -Q, rt),
    rt,
    et,
    lt
  ), lt)), m !== 0 && (w = U(4, Nt, m, Ae), l = ut(l, Mt(
    U(w, Ae, 2 * J, H),
    H,
    U(U(4, Et, m, z), z, W, it),
    it,
    U(U(4, _t, m, z), z, -G, rt),
    rt,
    et,
    lt
  ), lt)), h !== 0 && (d = U(4, Ct, h, Ie), l = ut(l, Mt(
    U(d, Ie, 2 * G, H),
    H,
    U(U(4, kt, h, z), z, Q, it),
    it,
    U(U(4, _t, h, z), z, -J, rt),
    rt,
    et,
    lt
  ), lt)), p !== 0 && (b = U(4, Ct, p, Be), l = ut(l, Mt(
    U(b, Be, 2 * Z, H),
    H,
    U(U(4, _t, p, z), z, K, it),
    it,
    U(U(4, kt, p, z), z, -W, rt),
    rt,
    et,
    lt
  ), lt)), f !== 0 || y !== 0) {
    if (u !== 0 || m !== 0 || h !== 0 || p !== 0 ? (X = u * Z, B = V * u, M = B - (B - u), N = u - M, B = V * Z, D = B - (B - Z), R = Z - D, Y = N * R - (X - M * D - N * D - M * R), L = K * p, B = V * K, M = B - (B - K), N = K - M, B = V * p, D = B - (B - p), R = p - D, j = N * R - (L - M * D - N * D - M * R), v = Y + j, x = v - Y, mt[0] = Y - (v - x) + (j - x), C = X + v, x = C - X, $ = X - (C - x) + (v - x), v = $ + L, x = v - $, mt[1] = $ - (v - x) + (L - x), q = C + v, x = q - C, mt[2] = C - (q - x) + (v - x), mt[3] = q, X = h * -J, B = V * h, M = B - (B - h), N = h - M, B = V * -J, D = B - (B - -J), R = -J - D, Y = N * R - (X - M * D - N * D - M * R), L = G * -m, B = V * G, M = B - (B - G), N = G - M, B = V * -m, D = B - (B - -m), R = -m - D, j = N * R - (L - M * D - N * D - M * R), v = Y + j, x = v - Y, wt[0] = Y - (v - x) + (j - x), C = X + v, x = C - X, $ = X - (C - x) + (v - x), v = $ + L, x = v - $, wt[1] = $ - (v - x) + (L - x), q = C + v, x = q - C, wt[2] = C - (q - x) + (v - x), wt[3] = q, A = ht(4, mt, 4, wt, ae), X = u * p, B = V * u, M = B - (B - u), N = u - M, B = V * p, D = B - (B - p), R = p - D, Y = N * R - (X - M * D - N * D - M * R), L = h * m, B = V * h, M = B - (B - h), N = h - M, B = V * m, D = B - (B - m), R = m - D, j = N * R - (L - M * D - N * D - M * R), v = Y - j, x = Y - v, $t[0] = Y - (v + x) + (x - j), C = X + v, x = C - X, $ = X - (C - x) + (v - x), v = $ - L, x = $ - v, $t[1] = $ - (v + x) + (x - L), q = C + v, x = q - C, $t[2] = C - (q - x) + (v - x), $t[3] = q, O = 4) : (ae[0] = 0, A = 1, $t[0] = 0, O = 1), f !== 0) {
      const st = U(A, ae, f, rt);
      l = ut(l, ht(
        U(_, _e, f, H),
        H,
        U(st, rt, 2 * W, et),
        et,
        lt
      ), lt);
      const ot = U(O, $t, f, z);
      l = ut(l, Mt(
        U(ot, z, 2 * W, H),
        H,
        U(ot, z, f, it),
        it,
        U(st, rt, f, et),
        et,
        Dt,
        vt
      ), vt), m !== 0 && (l = ut(l, U(U(4, Et, f, z), z, m, H), H)), p !== 0 && (l = ut(l, U(U(4, kt, -f, z), z, p, H), H));
    }
    if (y !== 0) {
      const st = U(A, ae, y, rt);
      l = ut(l, ht(
        U(I, ke, y, H),
        H,
        U(st, rt, 2 * Q, et),
        et,
        lt
      ), lt);
      const ot = U(O, $t, y, z);
      l = ut(l, Mt(
        U(ot, z, 2 * Q, H),
        H,
        U(ot, z, y, it),
        it,
        U(st, rt, y, et),
        et,
        Dt,
        vt
      ), vt);
    }
  }
  if (u !== 0 || m !== 0) {
    if (h !== 0 || p !== 0 || f !== 0 || y !== 0 ? (X = h * Q, B = V * h, M = B - (B - h), N = h - M, B = V * Q, D = B - (B - Q), R = Q - D, Y = N * R - (X - M * D - N * D - M * R), L = G * y, B = V * G, M = B - (B - G), N = G - M, B = V * y, D = B - (B - y), R = y - D, j = N * R - (L - M * D - N * D - M * R), v = Y + j, x = v - Y, mt[0] = Y - (v - x) + (j - x), C = X + v, x = C - X, $ = X - (C - x) + (v - x), v = $ + L, x = v - $, mt[1] = $ - (v - x) + (L - x), q = C + v, x = q - C, mt[2] = C - (q - x) + (v - x), mt[3] = q, P = -Z, F = -p, X = f * P, B = V * f, M = B - (B - f), N = f - M, B = V * P, D = B - (B - P), R = P - D, Y = N * R - (X - M * D - N * D - M * R), L = W * F, B = V * W, M = B - (B - W), N = W - M, B = V * F, D = B - (B - F), R = F - D, j = N * R - (L - M * D - N * D - M * R), v = Y + j, x = v - Y, wt[0] = Y - (v - x) + (j - x), C = X + v, x = C - X, $ = X - (C - x) + (v - x), v = $ + L, x = v - $, wt[1] = $ - (v - x) + (L - x), q = C + v, x = q - C, wt[2] = C - (q - x) + (v - x), wt[3] = q, k = ht(4, mt, 4, wt, ce), X = h * y, B = V * h, M = B - (B - h), N = h - M, B = V * y, D = B - (B - y), R = y - D, Y = N * R - (X - M * D - N * D - M * R), L = f * p, B = V * f, M = B - (B - f), N = f - M, B = V * p, D = B - (B - p), R = p - D, j = N * R - (L - M * D - N * D - M * R), v = Y - j, x = Y - v, Xt[0] = Y - (v + x) + (x - j), C = X + v, x = C - X, $ = X - (C - x) + (v - x), v = $ - L, x = $ - v, Xt[1] = $ - (v + x) + (x - L), q = C + v, x = q - C, Xt[2] = C - (q - x) + (v - x), Xt[3] = q, T = 4) : (ce[0] = 0, k = 1, Xt[0] = 0, T = 1), u !== 0) {
      const st = U(k, ce, u, rt);
      l = ut(l, ht(
        U(g, Ee, u, H),
        H,
        U(st, rt, 2 * K, et),
        et,
        lt
      ), lt);
      const ot = U(T, Xt, u, z);
      l = ut(l, Mt(
        U(ot, z, 2 * K, H),
        H,
        U(ot, z, u, it),
        it,
        U(st, rt, u, et),
        et,
        Dt,
        vt
      ), vt), p !== 0 && (l = ut(l, U(U(4, _t, u, z), z, p, H), H)), y !== 0 && (l = ut(l, U(U(4, Et, -u, z), z, y, H), H));
    }
    if (m !== 0) {
      const st = U(k, ce, m, rt);
      l = ut(l, ht(
        U(w, Ae, m, H),
        H,
        U(st, rt, 2 * J, et),
        et,
        lt
      ), lt);
      const ot = U(T, Xt, m, z);
      l = ut(l, Mt(
        U(ot, z, 2 * J, H),
        H,
        U(ot, z, m, it),
        it,
        U(st, rt, m, et),
        et,
        Dt,
        vt
      ), vt);
    }
  }
  if (h !== 0 || p !== 0) {
    if (f !== 0 || y !== 0 || u !== 0 || m !== 0 ? (X = f * J, B = V * f, M = B - (B - f), N = f - M, B = V * J, D = B - (B - J), R = J - D, Y = N * R - (X - M * D - N * D - M * R), L = W * m, B = V * W, M = B - (B - W), N = W - M, B = V * m, D = B - (B - m), R = m - D, j = N * R - (L - M * D - N * D - M * R), v = Y + j, x = v - Y, mt[0] = Y - (v - x) + (j - x), C = X + v, x = C - X, $ = X - (C - x) + (v - x), v = $ + L, x = v - $, mt[1] = $ - (v - x) + (L - x), q = C + v, x = q - C, mt[2] = C - (q - x) + (v - x), mt[3] = q, P = -Q, F = -y, X = u * P, B = V * u, M = B - (B - u), N = u - M, B = V * P, D = B - (B - P), R = P - D, Y = N * R - (X - M * D - N * D - M * R), L = K * F, B = V * K, M = B - (B - K), N = K - M, B = V * F, D = B - (B - F), R = F - D, j = N * R - (L - M * D - N * D - M * R), v = Y + j, x = v - Y, wt[0] = Y - (v - x) + (j - x), C = X + v, x = C - X, $ = X - (C - x) + (v - x), v = $ + L, x = v - $, wt[1] = $ - (v - x) + (L - x), q = C + v, x = q - C, wt[2] = C - (q - x) + (v - x), wt[3] = q, S = ht(4, mt, 4, wt, oe), X = f * m, B = V * f, M = B - (B - f), N = f - M, B = V * m, D = B - (B - m), R = m - D, Y = N * R - (X - M * D - N * D - M * R), L = u * y, B = V * u, M = B - (B - u), N = u - M, B = V * y, D = B - (B - y), R = y - D, j = N * R - (L - M * D - N * D - M * R), v = Y - j, x = Y - v, Rt[0] = Y - (v + x) + (x - j), C = X + v, x = C - X, $ = X - (C - x) + (v - x), v = $ - L, x = $ - v, Rt[1] = $ - (v + x) + (x - L), q = C + v, x = q - C, Rt[2] = C - (q - x) + (v - x), Rt[3] = q, E = 4) : (oe[0] = 0, S = 1, Rt[0] = 0, E = 1), h !== 0) {
      const st = U(S, oe, h, rt);
      l = ut(l, ht(
        U(d, Ie, h, H),
        H,
        U(st, rt, 2 * G, et),
        et,
        lt
      ), lt);
      const ot = U(E, Rt, h, z);
      l = ut(l, Mt(
        U(ot, z, 2 * G, H),
        H,
        U(ot, z, h, it),
        it,
        U(st, rt, h, et),
        et,
        Dt,
        vt
      ), vt), y !== 0 && (l = ut(l, U(U(4, kt, h, z), z, y, H), H)), m !== 0 && (l = ut(l, U(U(4, _t, -h, z), z, m, H), H));
    }
    if (p !== 0) {
      const st = U(S, oe, p, rt);
      l = ut(l, ht(
        U(b, Be, p, H),
        H,
        U(st, rt, 2 * Z, et),
        et,
        lt
      ), lt);
      const ot = U(E, Rt, p, z);
      l = ut(l, Mt(
        U(ot, z, 2 * Z, H),
        H,
        U(ot, z, p, it),
        it,
        U(st, rt, p, et),
        et,
        Dt,
        vt
      ), vt);
    }
  }
  return Gt[l - 1];
}
function hi(r, t, e, n, s, o, i, a) {
  const c = r - i, l = e - i, f = s - i, u = t - a, h = n - a, y = o - a, m = l * y, p = f * h, _ = c * c + u * u, I = f * u, g = c * y, w = l * l + h * h, d = c * h, b = l * u, S = f * f + y * y, A = _ * (m - p) + w * (I - g) + S * (d - b), k = (Math.abs(m) + Math.abs(p)) * _ + (Math.abs(I) + Math.abs(g)) * w + (Math.abs(d) + Math.abs(b)) * S, E = ci * k;
  return A > E || -A > E ? A : fi(r, t, e, n, s, o, i, a, k);
}
function di(r, t) {
  var e, n, s = 0, o, i, a, c, l, f, u, h = r[0], y = r[1], m = t.length;
  for (e = 0; e < m; e++) {
    n = 0;
    var p = t[e], _ = p.length - 1;
    if (f = p[0], f[0] !== p[_][0] && f[1] !== p[_][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (i = f[0] - h, a = f[1] - y, n; n < _; n++) {
      if (u = p[n + 1], c = u[0] - h, l = u[1] - y, a === 0 && l === 0) {
        if (c <= 0 && i >= 0 || i <= 0 && c >= 0)
          return 0;
      } else if (l >= 0 && a <= 0 || l <= 0 && a >= 0) {
        if (o = at(i, c, a, l, 0, 0), o === 0)
          return 0;
        (o > 0 && l > 0 && a <= 0 || o < 0 && l <= 0 && a > 0) && s++;
      }
      f = u, a = l, i = c;
    }
  }
  return s % 2 !== 0;
}
function Je(r, t, e = {}) {
  if (!r)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const n = ni(r), s = ii(t), o = s.type, i = t.bbox;
  let a = s.coordinates;
  if (i && pi(n, i) === !1)
    return !1;
  o === "Polygon" && (a = [a]);
  for (var c = 0; c < a.length; ++c) {
    const l = di(n, a[c]);
    if (l === 0 && !e.ignoreBoundary) return !0;
    if (l) return !0;
  }
  return !1;
}
function pi(r, t) {
  return t[0] <= r[0] && t[1] <= r[1] && t[2] >= r[0] && t[3] >= r[1];
}
class Ye {
  constructor(t = [], e = gi) {
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
      const o = t - 1 >> 1, i = e[o];
      if (n(s, i) >= 0) break;
      e[t] = i, t = o;
    }
    e[t] = s;
  }
  _down(t) {
    const { data: e, compare: n } = this, s = this.length >> 1, o = e[t];
    for (; t < s; ) {
      let i = (t << 1) + 1, a = e[i];
      const c = i + 1;
      if (c < this.length && n(e[c], a) < 0 && (i = c, a = e[c]), n(a, o) >= 0) break;
      e[t] = a, t = i;
    }
    e[t] = o;
  }
}
function gi(r, t) {
  return r < t ? -1 : r > t ? 1 : 0;
}
const mi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ye
}, Symbol.toStringTag, { value: "Module" })), Bt = 11102230246251565e-32, dt = 134217729, wi = (3 + 8 * Bt) * Bt;
function Oe(r, t, e, n, s) {
  let o, i, a, c, l = t[0], f = n[0], u = 0, h = 0;
  f > l == f > -l ? (o = l, l = t[++u]) : (o = f, f = n[++h]);
  let y = 0;
  if (u < r && h < e)
    for (f > l == f > -l ? (i = l + o, a = o - (i - l), l = t[++u]) : (i = f + o, a = o - (i - f), f = n[++h]), o = i, a !== 0 && (s[y++] = a); u < r && h < e; )
      f > l == f > -l ? (i = o + l, c = i - o, a = o - (i - c) + (l - c), l = t[++u]) : (i = o + f, c = i - o, a = o - (i - c) + (f - c), f = n[++h]), o = i, a !== 0 && (s[y++] = a);
  for (; u < r; )
    i = o + l, c = i - o, a = o - (i - c) + (l - c), l = t[++u], o = i, a !== 0 && (s[y++] = a);
  for (; h < e; )
    i = o + f, c = i - o, a = o - (i - c) + (f - c), f = n[++h], o = i, a !== 0 && (s[y++] = a);
  return (o !== 0 || y === 0) && (s[y++] = o), y;
}
function yi(r, t) {
  let e = t[0];
  for (let n = 1; n < r; n++) e += t[n];
  return e;
}
function se(r) {
  return new Float64Array(r);
}
const vi = (3 + 16 * Bt) * Bt, bi = (2 + 12 * Bt) * Bt, xi = (9 + 64 * Bt) * Bt * Bt, qt = se(4), Qe = se(8), Ze = se(12), tn = se(16), yt = se(4);
function Si(r, t, e, n, s, o, i) {
  let a, c, l, f, u, h, y, m, p, _, I, g, w, d, b, S, A, k;
  const E = r - s, O = e - s, T = t - o, P = n - o;
  d = E * P, h = dt * E, y = h - (h - E), m = E - y, h = dt * P, p = h - (h - P), _ = P - p, b = m * _ - (d - y * p - m * p - y * _), S = T * O, h = dt * T, y = h - (h - T), m = T - y, h = dt * O, p = h - (h - O), _ = O - p, A = m * _ - (S - y * p - m * p - y * _), I = b - A, u = b - I, qt[0] = b - (I + u) + (u - A), g = d + I, u = g - d, w = d - (g - u) + (I - u), I = w - S, u = w - I, qt[1] = w - (I + u) + (u - S), k = g + I, u = k - g, qt[2] = g - (k - u) + (I - u), qt[3] = k;
  let F = yi(4, qt), x = bi * i;
  if (F >= x || -F >= x || (u = r - E, a = r - (E + u) + (u - s), u = e - O, l = e - (O + u) + (u - s), u = t - T, c = t - (T + u) + (u - o), u = n - P, f = n - (P + u) + (u - o), a === 0 && c === 0 && l === 0 && f === 0) || (x = xi * i + wi * Math.abs(F), F += E * f + P * a - (T * l + O * c), F >= x || -F >= x)) return F;
  d = a * P, h = dt * a, y = h - (h - a), m = a - y, h = dt * P, p = h - (h - P), _ = P - p, b = m * _ - (d - y * p - m * p - y * _), S = c * O, h = dt * c, y = h - (h - c), m = c - y, h = dt * O, p = h - (h - O), _ = O - p, A = m * _ - (S - y * p - m * p - y * _), I = b - A, u = b - I, yt[0] = b - (I + u) + (u - A), g = d + I, u = g - d, w = d - (g - u) + (I - u), I = w - S, u = w - I, yt[1] = w - (I + u) + (u - S), k = g + I, u = k - g, yt[2] = g - (k - u) + (I - u), yt[3] = k;
  const B = Oe(4, qt, 4, yt, Qe);
  d = E * f, h = dt * E, y = h - (h - E), m = E - y, h = dt * f, p = h - (h - f), _ = f - p, b = m * _ - (d - y * p - m * p - y * _), S = T * l, h = dt * T, y = h - (h - T), m = T - y, h = dt * l, p = h - (h - l), _ = l - p, A = m * _ - (S - y * p - m * p - y * _), I = b - A, u = b - I, yt[0] = b - (I + u) + (u - A), g = d + I, u = g - d, w = d - (g - u) + (I - u), I = w - S, u = w - I, yt[1] = w - (I + u) + (u - S), k = g + I, u = k - g, yt[2] = g - (k - u) + (I - u), yt[3] = k;
  const M = Oe(B, Qe, 4, yt, Ze);
  d = a * f, h = dt * a, y = h - (h - a), m = a - y, h = dt * f, p = h - (h - f), _ = f - p, b = m * _ - (d - y * p - m * p - y * _), S = c * l, h = dt * c, y = h - (h - c), m = c - y, h = dt * l, p = h - (h - l), _ = l - p, A = m * _ - (S - y * p - m * p - y * _), I = b - A, u = b - I, yt[0] = b - (I + u) + (u - A), g = d + I, u = g - d, w = d - (g - u) + (I - u), I = w - S, u = w - I, yt[1] = w - (I + u) + (u - S), k = g + I, u = k - g, yt[2] = g - (k - u) + (I - u), yt[3] = k;
  const N = Oe(M, Ze, 4, yt, tn);
  return tn[N - 1];
}
function en(r, t, e, n, s, o) {
  const i = (t - o) * (e - s), a = (r - s) * (n - o), c = i - a;
  if (i === 0 || a === 0 || i > 0 != a > 0) return c;
  const l = Math.abs(i + a);
  return Math.abs(c) >= vi * l ? c : -Si(r, t, e, n, s, o, l);
}
function Mi(r, t) {
  const e = new Ye([], Xn);
  return ki(r, e), Ei(e, t);
}
function Xn(r, t) {
  return r.p.x > t.p.x ? 1 : r.p.x < t.p.x || r.p.x === t.p.x && (r.featureId !== t.featureId || r.ringId !== t.ringId) && r.isLeftEndpoint && !t.isLeftEndpoint ? -1 : r.p.y !== t.p.y ? r.p.y > t.p.y ? 1 : -1 : 1;
}
function _i(r, t) {
  return r.rightSweepEvent.p.x > t.rightSweepEvent.p.x ? 1 : r.rightSweepEvent.p.x < t.rightSweepEvent.p.x ? -1 : r.rightSweepEvent.p.y !== t.rightSweepEvent.p.y ? r.rightSweepEvent.p.y < t.rightSweepEvent.p.y ? 1 : -1 : 1;
}
function ki(r, t) {
  if (r.type === "FeatureCollection") {
    const e = r.features;
    for (let n = 0; n < e.length; n++)
      nn(e[n], t);
  } else
    nn(r, t);
}
var le = 0, ue = 0, fe = 0;
function nn(r, t) {
  const e = r.type === "Feature" ? r.geometry : r;
  let n = e.coordinates;
  (e.type === "Polygon" || e.type === "MultiLineString") && (n = [n]), e.type === "LineString" && (n = [[n]]);
  for (let s = 0; s < n.length; s++)
    for (let o = 0; o < n[s].length; o++) {
      let i = n[s][o][0], a = null;
      ue = ue + 1;
      for (let c = 0; c < n[s][o].length - 1; c++) {
        a = n[s][o][c + 1];
        const l = new rn(i, le, ue, fe), f = new rn(a, le, ue, fe + 1);
        l.otherEvent = f, f.otherEvent = l, Xn(l, f) > 0 ? (f.isLeftEndpoint = !0, l.isLeftEndpoint = !1) : (l.isLeftEndpoint = !0, f.isLeftEndpoint = !1), t.push(l), t.push(f), i = a, fe = fe + 1;
      }
    }
  le = le + 1;
}
var rn = class {
  constructor(r, t, e, n) {
    this.p = {
      x: r[0],
      y: r[1]
    }, this.featureId = t, this.ringId = e, this.eventId = n, this.otherEvent = null, this.isLeftEndpoint = null;
  }
  isSamePoint(r) {
    return this.p.x === r.p.x && this.p.y === r.p.y;
  }
  asNewXY() {
    return [this.p.x, this.p.y];
  }
};
function Ei(r, t = !1) {
  const e = [], n = new Ye([], _i);
  for (; r.length; ) {
    const s = r.pop();
    if (s.isLeftEndpoint) {
      const o = new Ai(s);
      for (let i = 0; i < n.data.length; i++) {
        const a = n.data[i];
        if (t && a.leftSweepEvent.featureId === s.featureId)
          continue;
        const c = Ii(o, a);
        c !== !1 && e.push(c);
      }
      n.push(o);
    } else s.isLeftEndpoint === !1 && n.pop();
  }
  return e;
}
var Ai = class {
  /** @param event must have otherEvent non-null */
  constructor(r) {
    this.leftSweepEvent = r, this.rightSweepEvent = r.otherEvent;
  }
};
function Ii(r, t) {
  if (r === null || t === null) return !1;
  const e = r.leftSweepEvent.p.x, n = r.leftSweepEvent.p.y, s = r.rightSweepEvent.p.x, o = r.rightSweepEvent.p.y, i = t.leftSweepEvent.p.x, a = t.leftSweepEvent.p.y, c = t.rightSweepEvent.p.x, l = t.rightSweepEvent.p.y, f = en(e, n, s, o, i, a), u = en(e, n, s, o, c, l);
  if (f > 0 && u > 0) return !1;
  if (f < 0 && u < 0) return !1;
  if (r.leftSweepEvent.ringId === t.leftSweepEvent.ringId) {
    if (r.rightSweepEvent.isSamePoint(t.leftSweepEvent) || r.rightSweepEvent.isSamePoint(t.rightSweepEvent) || r.leftSweepEvent.isSamePoint(t.leftSweepEvent) || r.leftSweepEvent.isSamePoint(t.rightSweepEvent))
      return !1;
  } else {
    if (r.rightSweepEvent.isSamePoint(t.leftSweepEvent))
      return t.leftSweepEvent.asNewXY();
    if (r.rightSweepEvent.isSamePoint(t.rightSweepEvent))
      return t.rightSweepEvent.asNewXY();
    if (r.leftSweepEvent.isSamePoint(t.leftSweepEvent))
      return t.leftSweepEvent.asNewXY();
    if (r.leftSweepEvent.isSamePoint(t.rightSweepEvent))
      return t.rightSweepEvent.asNewXY();
  }
  const h = (l - a) * (s - e) - (c - i) * (o - n), y = (c - i) * (n - a) - (l - a) * (e - i), m = (s - e) * (n - a) - (o - n) * (e - i);
  if (h === 0)
    return !1;
  const p = y / h, _ = m / h;
  if (p >= 0 && p <= 1 && _ >= 0 && _ <= 1) {
    const I = e + p * (s - e), g = n + p * (o - n);
    return [I, g];
  }
  return !1;
}
function Bi(r, t, e = {}) {
  const { removeDuplicates: n = !0, ignoreSelfIntersections: s = !0 } = e;
  let o = [];
  r.type === "FeatureCollection" ? o = o.concat(r.features) : r.type === "Feature" ? o.push(r) : (r.type === "LineString" || r.type === "Polygon" || r.type === "MultiLineString" || r.type === "MultiPolygon") && o.push(ee(r)), t.type === "FeatureCollection" ? o = o.concat(t.features) : t.type === "Feature" ? o.push(t) : (t.type === "LineString" || t.type === "Polygon" || t.type === "MultiLineString" || t.type === "MultiPolygon") && o.push(ee(t));
  const i = Mi(
    xt(o),
    s
  );
  let a = [];
  if (n) {
    const c = {};
    i.forEach((l) => {
      const f = l.join(",");
      c[f] || (c[f] = !0, a.push(l));
    });
  } else
    a = i;
  return xt(a.map((c) => Lt(c)));
}
function Ti(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
function Oi(r) {
  if (Object.prototype.hasOwnProperty.call(r, "__esModule")) return r;
  var t = r.default;
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
  return Object.defineProperty(e, "__esModule", { value: !0 }), Object.keys(r).forEach(function(n) {
    var s = Object.getOwnPropertyDescriptor(r, n);
    Object.defineProperty(e, n, s.get ? s : {
      enumerable: !0,
      get: function() {
        return r[n];
      }
    });
  }), e;
}
function Ni(r, t = {}) {
  let e = 0, n = 0, s = 0;
  return Xe(
    r,
    function(o) {
      e += o[0], n += o[1], s++;
    },
    !0
  ), Lt([e / s, n / s], t.properties);
}
var he = { exports: {} }, ye = { exports: {} }, Ci = ye.exports, sn;
function Di() {
  return sn || (sn = 1, (function(r, t) {
    (function(e, n) {
      r.exports = n();
    })(Ci, function() {
      function e(g, w, d, b, S) {
        (function A(k, E, O, T, P) {
          for (; T > O; ) {
            if (T - O > 600) {
              var F = T - O + 1, x = E - O + 1, B = Math.log(F), M = 0.5 * Math.exp(2 * B / 3), N = 0.5 * Math.sqrt(B * M * (F - M) / F) * (x - F / 2 < 0 ? -1 : 1), D = Math.max(O, Math.floor(E - x * M / F + N)), R = Math.min(T, Math.floor(E + (F - x) * M / F + N));
              A(k, E, D, R, P);
            }
            var v = k[E], C = O, $ = T;
            for (n(k, O, E), P(k[T], v) > 0 && n(k, O, T); C < $; ) {
              for (n(k, C, $), C++, $--; P(k[C], v) < 0; ) C++;
              for (; P(k[$], v) > 0; ) $--;
            }
            P(k[O], v) === 0 ? n(k, O, $) : n(k, ++$, T), $ <= E && (O = $ + 1), E <= $ && (T = $ - 1);
          }
        })(g, w, d || 0, b || g.length - 1, S || s);
      }
      function n(g, w, d) {
        var b = g[w];
        g[w] = g[d], g[d] = b;
      }
      function s(g, w) {
        return g < w ? -1 : g > w ? 1 : 0;
      }
      var o = function(g) {
        g === void 0 && (g = 9), this._maxEntries = Math.max(4, g), this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries)), this.clear();
      };
      function i(g, w, d) {
        if (!d) return w.indexOf(g);
        for (var b = 0; b < w.length; b++) if (d(g, w[b])) return b;
        return -1;
      }
      function a(g, w) {
        c(g, 0, g.children.length, w, g);
      }
      function c(g, w, d, b, S) {
        S || (S = _(null)), S.minX = 1 / 0, S.minY = 1 / 0, S.maxX = -1 / 0, S.maxY = -1 / 0;
        for (var A = w; A < d; A++) {
          var k = g.children[A];
          l(S, g.leaf ? b(k) : k);
        }
        return S;
      }
      function l(g, w) {
        return g.minX = Math.min(g.minX, w.minX), g.minY = Math.min(g.minY, w.minY), g.maxX = Math.max(g.maxX, w.maxX), g.maxY = Math.max(g.maxY, w.maxY), g;
      }
      function f(g, w) {
        return g.minX - w.minX;
      }
      function u(g, w) {
        return g.minY - w.minY;
      }
      function h(g) {
        return (g.maxX - g.minX) * (g.maxY - g.minY);
      }
      function y(g) {
        return g.maxX - g.minX + (g.maxY - g.minY);
      }
      function m(g, w) {
        return g.minX <= w.minX && g.minY <= w.minY && w.maxX <= g.maxX && w.maxY <= g.maxY;
      }
      function p(g, w) {
        return w.minX <= g.maxX && w.minY <= g.maxY && w.maxX >= g.minX && w.maxY >= g.minY;
      }
      function _(g) {
        return { children: g, height: 1, leaf: !0, minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
      }
      function I(g, w, d, b, S) {
        for (var A = [w, d]; A.length; ) if (!((d = A.pop()) - (w = A.pop()) <= b)) {
          var k = w + Math.ceil((d - w) / b / 2) * b;
          e(g, k, w, d, S), A.push(w, k, k, d);
        }
      }
      return o.prototype.all = function() {
        return this._all(this.data, []);
      }, o.prototype.search = function(g) {
        var w = this.data, d = [];
        if (!p(g, w)) return d;
        for (var b = this.toBBox, S = []; w; ) {
          for (var A = 0; A < w.children.length; A++) {
            var k = w.children[A], E = w.leaf ? b(k) : k;
            p(g, E) && (w.leaf ? d.push(k) : m(g, E) ? this._all(k, d) : S.push(k));
          }
          w = S.pop();
        }
        return d;
      }, o.prototype.collides = function(g) {
        var w = this.data;
        if (!p(g, w)) return !1;
        for (var d = []; w; ) {
          for (var b = 0; b < w.children.length; b++) {
            var S = w.children[b], A = w.leaf ? this.toBBox(S) : S;
            if (p(g, A)) {
              if (w.leaf || m(g, A)) return !0;
              d.push(S);
            }
          }
          w = d.pop();
        }
        return !1;
      }, o.prototype.load = function(g) {
        if (!g || !g.length) return this;
        if (g.length < this._minEntries) {
          for (var w = 0; w < g.length; w++) this.insert(g[w]);
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
      }, o.prototype.insert = function(g) {
        return g && this._insert(g, this.data.height - 1), this;
      }, o.prototype.clear = function() {
        return this.data = _([]), this;
      }, o.prototype.remove = function(g, w) {
        if (!g) return this;
        for (var d, b, S, A = this.data, k = this.toBBox(g), E = [], O = []; A || E.length; ) {
          if (A || (A = E.pop(), b = E[E.length - 1], d = O.pop(), S = !0), A.leaf) {
            var T = i(g, A.children, w);
            if (T !== -1) return A.children.splice(T, 1), E.push(A), this._condense(E), this;
          }
          S || A.leaf || !m(A, k) ? b ? (d++, A = b.children[d], S = !1) : A = null : (E.push(A), O.push(d), d = 0, b = A, A = A.children[0]);
        }
        return this;
      }, o.prototype.toBBox = function(g) {
        return g;
      }, o.prototype.compareMinX = function(g, w) {
        return g.minX - w.minX;
      }, o.prototype.compareMinY = function(g, w) {
        return g.minY - w.minY;
      }, o.prototype.toJSON = function() {
        return this.data;
      }, o.prototype.fromJSON = function(g) {
        return this.data = g, this;
      }, o.prototype._all = function(g, w) {
        for (var d = []; g; ) g.leaf ? w.push.apply(w, g.children) : d.push.apply(d, g.children), g = d.pop();
        return w;
      }, o.prototype._build = function(g, w, d, b) {
        var S, A = d - w + 1, k = this._maxEntries;
        if (A <= k) return a(S = _(g.slice(w, d + 1)), this.toBBox), S;
        b || (b = Math.ceil(Math.log(A) / Math.log(k)), k = Math.ceil(A / Math.pow(k, b - 1))), (S = _([])).leaf = !1, S.height = b;
        var E = Math.ceil(A / k), O = E * Math.ceil(Math.sqrt(k));
        I(g, w, d, O, this.compareMinX);
        for (var T = w; T <= d; T += O) {
          var P = Math.min(T + O - 1, d);
          I(g, T, P, E, this.compareMinY);
          for (var F = T; F <= P; F += E) {
            var x = Math.min(F + E - 1, P);
            S.children.push(this._build(g, F, x, b - 1));
          }
        }
        return a(S, this.toBBox), S;
      }, o.prototype._chooseSubtree = function(g, w, d, b) {
        for (; b.push(w), !w.leaf && b.length - 1 !== d; ) {
          for (var S = 1 / 0, A = 1 / 0, k = void 0, E = 0; E < w.children.length; E++) {
            var O = w.children[E], T = h(O), P = (F = g, x = O, (Math.max(x.maxX, F.maxX) - Math.min(x.minX, F.minX)) * (Math.max(x.maxY, F.maxY) - Math.min(x.minY, F.minY)) - T);
            P < A ? (A = P, S = T < S ? T : S, k = O) : P === A && T < S && (S = T, k = O);
          }
          w = k || w.children[0];
        }
        var F, x;
        return w;
      }, o.prototype._insert = function(g, w, d) {
        var b = d ? g : this.toBBox(g), S = [], A = this._chooseSubtree(b, this.data, w, S);
        for (A.children.push(g), l(A, b); w >= 0 && S[w].children.length > this._maxEntries; ) this._split(S, w), w--;
        this._adjustParentBBoxes(b, S, w);
      }, o.prototype._split = function(g, w) {
        var d = g[w], b = d.children.length, S = this._minEntries;
        this._chooseSplitAxis(d, S, b);
        var A = this._chooseSplitIndex(d, S, b), k = _(d.children.splice(A, d.children.length - A));
        k.height = d.height, k.leaf = d.leaf, a(d, this.toBBox), a(k, this.toBBox), w ? g[w - 1].children.push(k) : this._splitRoot(d, k);
      }, o.prototype._splitRoot = function(g, w) {
        this.data = _([g, w]), this.data.height = g.height + 1, this.data.leaf = !1, a(this.data, this.toBBox);
      }, o.prototype._chooseSplitIndex = function(g, w, d) {
        for (var b, S, A, k, E, O, T, P = 1 / 0, F = 1 / 0, x = w; x <= d - w; x++) {
          var B = c(g, 0, x, this.toBBox), M = c(g, x, d, this.toBBox), N = (S = B, A = M, k = void 0, E = void 0, O = void 0, T = void 0, k = Math.max(S.minX, A.minX), E = Math.max(S.minY, A.minY), O = Math.min(S.maxX, A.maxX), T = Math.min(S.maxY, A.maxY), Math.max(0, O - k) * Math.max(0, T - E)), D = h(B) + h(M);
          N < P ? (P = N, b = x, F = D < F ? D : F) : N === P && D < F && (F = D, b = x);
        }
        return b || d - w;
      }, o.prototype._chooseSplitAxis = function(g, w, d) {
        var b = g.leaf ? this.compareMinX : f, S = g.leaf ? this.compareMinY : u;
        this._allDistMargin(g, w, d, b) < this._allDistMargin(g, w, d, S) && g.children.sort(b);
      }, o.prototype._allDistMargin = function(g, w, d, b) {
        g.children.sort(b);
        for (var S = this.toBBox, A = c(g, 0, w, S), k = c(g, d - w, d, S), E = y(A) + y(k), O = w; O < d - w; O++) {
          var T = g.children[O];
          l(A, g.leaf ? S(T) : T), E += y(A);
        }
        for (var P = d - w - 1; P >= w; P--) {
          var F = g.children[P];
          l(k, g.leaf ? S(F) : F), E += y(k);
        }
        return E;
      }, o.prototype._adjustParentBBoxes = function(g, w, d) {
        for (var b = d; b >= 0; b--) l(w[b], g);
      }, o.prototype._condense = function(g) {
        for (var w = g.length - 1, d = void 0; w >= 0; w--) g[w].children.length === 0 ? w > 0 ? (d = g[w - 1].children).splice(d.indexOf(g[w]), 1) : this.clear() : a(g[w], this.toBBox);
      }, o;
    });
  })(ye)), ye.exports;
}
const Fi = /* @__PURE__ */ Oi(mi);
var Wt = { exports: {} }, Ne, on;
function Pi() {
  return on || (on = 1, Ne = function(t, e, n, s) {
    var o = t[0], i = t[1], a = !1;
    n === void 0 && (n = 0), s === void 0 && (s = e.length);
    for (var c = (s - n) / 2, l = 0, f = c - 1; l < c; f = l++) {
      var u = e[n + l * 2 + 0], h = e[n + l * 2 + 1], y = e[n + f * 2 + 0], m = e[n + f * 2 + 1], p = h > i != m > i && o < (y - u) * (i - h) / (m - h) + u;
      p && (a = !a);
    }
    return a;
  }), Ne;
}
var Ce, an;
function Ri() {
  return an || (an = 1, Ce = function(t, e, n, s) {
    var o = t[0], i = t[1], a = !1;
    n === void 0 && (n = 0), s === void 0 && (s = e.length);
    for (var c = s - n, l = 0, f = c - 1; l < c; f = l++) {
      var u = e[l + n][0], h = e[l + n][1], y = e[f + n][0], m = e[f + n][1], p = h > i != m > i && o < (y - u) * (i - h) / (m - h) + u;
      p && (a = !a);
    }
    return a;
  }), Ce;
}
var cn;
function $i() {
  if (cn) return Wt.exports;
  cn = 1;
  var r = Pi(), t = Ri();
  return Wt.exports = function(n, s, o, i) {
    return s.length > 0 && Array.isArray(s[0]) ? t(n, s, o, i) : r(n, s, o, i);
  }, Wt.exports.nested = t, Wt.exports.flat = r, Wt.exports;
}
var Jt = { exports: {} }, Xi = Jt.exports, ln;
function Yi() {
  return ln || (ln = 1, (function(r, t) {
    (function(e, n) {
      n(t);
    })(Xi, function(e) {
      const s = 33306690738754706e-32;
      function o(p, _, I, g, w) {
        let d, b, S, A, k = _[0], E = g[0], O = 0, T = 0;
        E > k == E > -k ? (d = k, k = _[++O]) : (d = E, E = g[++T]);
        let P = 0;
        if (O < p && T < I) for (E > k == E > -k ? (S = d - ((b = k + d) - k), k = _[++O]) : (S = d - ((b = E + d) - E), E = g[++T]), d = b, S !== 0 && (w[P++] = S); O < p && T < I; ) E > k == E > -k ? (S = d - ((b = d + k) - (A = b - d)) + (k - A), k = _[++O]) : (S = d - ((b = d + E) - (A = b - d)) + (E - A), E = g[++T]), d = b, S !== 0 && (w[P++] = S);
        for (; O < p; ) S = d - ((b = d + k) - (A = b - d)) + (k - A), k = _[++O], d = b, S !== 0 && (w[P++] = S);
        for (; T < I; ) S = d - ((b = d + E) - (A = b - d)) + (E - A), E = g[++T], d = b, S !== 0 && (w[P++] = S);
        return d === 0 && P !== 0 || (w[P++] = d), P;
      }
      function i(p) {
        return new Float64Array(p);
      }
      const a = 33306690738754716e-32, c = 22204460492503146e-32, l = 11093356479670487e-47, f = i(4), u = i(8), h = i(12), y = i(16), m = i(4);
      e.orient2d = function(p, _, I, g, w, d) {
        const b = (_ - d) * (I - w), S = (p - w) * (g - d), A = b - S;
        if (b === 0 || S === 0 || b > 0 != S > 0) return A;
        const k = Math.abs(b + S);
        return Math.abs(A) >= a * k ? A : -(function(E, O, T, P, F, x, B) {
          let M, N, D, R, v, C, $, X, Y, L, j, q, W, K, G, Q, J, Z;
          const ct = E - F, ft = T - F, st = O - x, ot = P - x;
          v = (G = (X = ct - ($ = (C = 134217729 * ct) - (C - ct))) * (L = ot - (Y = (C = 134217729 * ot) - (C - ot))) - ((K = ct * ot) - $ * Y - X * Y - $ * L)) - (j = G - (J = (X = st - ($ = (C = 134217729 * st) - (C - st))) * (L = ft - (Y = (C = 134217729 * ft) - (C - ft))) - ((Q = st * ft) - $ * Y - X * Y - $ * L))), f[0] = G - (j + v) + (v - J), v = (W = K - ((q = K + j) - (v = q - K)) + (j - v)) - (j = W - Q), f[1] = W - (j + v) + (v - Q), v = (Z = q + j) - q, f[2] = q - (Z - v) + (j - v), f[3] = Z;
          let Tt = (function(Jn, qe) {
            let je = qe[0];
            for (let Se = 1; Se < Jn; Se++) je += qe[Se];
            return je;
          })(4, f), Kt = c * B;
          if (Tt >= Kt || -Tt >= Kt || (M = E - (ct + (v = E - ct)) + (v - F), D = T - (ft + (v = T - ft)) + (v - F), N = O - (st + (v = O - st)) + (v - x), R = P - (ot + (v = P - ot)) + (v - x), M === 0 && N === 0 && D === 0 && R === 0) || (Kt = l * B + s * Math.abs(Tt), (Tt += ct * R + ot * M - (st * D + ft * N)) >= Kt || -Tt >= Kt)) return Tt;
          v = (G = (X = M - ($ = (C = 134217729 * M) - (C - M))) * (L = ot - (Y = (C = 134217729 * ot) - (C - ot))) - ((K = M * ot) - $ * Y - X * Y - $ * L)) - (j = G - (J = (X = N - ($ = (C = 134217729 * N) - (C - N))) * (L = ft - (Y = (C = 134217729 * ft) - (C - ft))) - ((Q = N * ft) - $ * Y - X * Y - $ * L))), m[0] = G - (j + v) + (v - J), v = (W = K - ((q = K + j) - (v = q - K)) + (j - v)) - (j = W - Q), m[1] = W - (j + v) + (v - Q), v = (Z = q + j) - q, m[2] = q - (Z - v) + (j - v), m[3] = Z;
          const Kn = o(4, f, 4, m, u);
          v = (G = (X = ct - ($ = (C = 134217729 * ct) - (C - ct))) * (L = R - (Y = (C = 134217729 * R) - (C - R))) - ((K = ct * R) - $ * Y - X * Y - $ * L)) - (j = G - (J = (X = st - ($ = (C = 134217729 * st) - (C - st))) * (L = D - (Y = (C = 134217729 * D) - (C - D))) - ((Q = st * D) - $ * Y - X * Y - $ * L))), m[0] = G - (j + v) + (v - J), v = (W = K - ((q = K + j) - (v = q - K)) + (j - v)) - (j = W - Q), m[1] = W - (j + v) + (v - Q), v = (Z = q + j) - q, m[2] = q - (Z - v) + (j - v), m[3] = Z;
          const Wn = o(Kn, u, 4, m, h);
          v = (G = (X = M - ($ = (C = 134217729 * M) - (C - M))) * (L = R - (Y = (C = 134217729 * R) - (C - R))) - ((K = M * R) - $ * Y - X * Y - $ * L)) - (j = G - (J = (X = N - ($ = (C = 134217729 * N) - (C - N))) * (L = D - (Y = (C = 134217729 * D) - (C - D))) - ((Q = N * D) - $ * Y - X * Y - $ * L))), m[0] = G - (j + v) + (v - J), v = (W = K - ((q = K + j) - (v = q - K)) + (j - v)) - (j = W - Q), m[1] = W - (j + v) + (v - Q), v = (Z = q + j) - q, m[2] = q - (Z - v) + (j - v), m[3] = Z;
          const Hn = o(Wn, h, 4, m, y);
          return y[Hn - 1];
        })(p, _, I, g, w, d, k);
      }, e.orient2dfast = function(p, _, I, g, w, d) {
        return (_ - d) * (I - w) - (p - w) * (g - d);
      }, Object.defineProperty(e, "__esModule", { value: !0 });
    });
  })(Jt, Jt.exports)), Jt.exports;
}
var un;
function Li() {
  if (un) return he.exports;
  un = 1;
  var r = Di(), t = Fi, e = $i(), n = Yi().orient2d;
  t.default && (t = t.default), he.exports = s, he.exports.default = s;
  function s(d, b, S) {
    b = Math.max(0, b === void 0 ? 2 : b), S = S || 0;
    var A = y(d), k = new r(16);
    k.toBBox = function($) {
      return {
        minX: $[0],
        minY: $[1],
        maxX: $[0],
        maxY: $[1]
      };
    }, k.compareMinX = function($, X) {
      return $[0] - X[0];
    }, k.compareMinY = function($, X) {
      return $[1] - X[1];
    }, k.load(d);
    for (var E = [], O = 0, T; O < A.length; O++) {
      var P = A[O];
      k.remove(P), T = m(P, T), E.push(T);
    }
    var F = new r(16);
    for (O = 0; O < E.length; O++) F.insert(h(E[O]));
    for (var x = b * b, B = S * S; E.length; ) {
      var M = E.shift(), N = M.p, D = M.next.p, R = p(N, D);
      if (!(R < B)) {
        var v = R / x;
        P = o(k, M.prev.p, N, D, M.next.next.p, v, F), P && Math.min(p(P, N), p(P, D)) <= v && (E.push(M), E.push(m(P, M)), k.remove(P), F.remove(M), F.insert(h(M)), F.insert(h(M.next)));
      }
    }
    M = T;
    var C = [];
    do
      C.push(M.p), M = M.next;
    while (M !== T);
    return C.push(M.p), C;
  }
  function o(d, b, S, A, k, E, O) {
    for (var T = new t([], i), P = d.data; P; ) {
      for (var F = 0; F < P.children.length; F++) {
        var x = P.children[F], B = P.leaf ? _(x, S, A) : a(S, A, x);
        B > E || T.push({
          node: x,
          dist: B
        });
      }
      for (; T.length && !T.peek().node.children; ) {
        var M = T.pop(), N = M.node, D = _(N, b, S), R = _(N, A, k);
        if (M.dist < D && M.dist < R && l(S, N, O) && l(A, N, O)) return N;
      }
      P = T.pop(), P && (P = P.node);
    }
    return null;
  }
  function i(d, b) {
    return d.dist - b.dist;
  }
  function a(d, b, S) {
    if (c(d, S) || c(b, S)) return 0;
    var A = I(d[0], d[1], b[0], b[1], S.minX, S.minY, S.maxX, S.minY);
    if (A === 0) return 0;
    var k = I(d[0], d[1], b[0], b[1], S.minX, S.minY, S.minX, S.maxY);
    if (k === 0) return 0;
    var E = I(d[0], d[1], b[0], b[1], S.maxX, S.minY, S.maxX, S.maxY);
    if (E === 0) return 0;
    var O = I(d[0], d[1], b[0], b[1], S.minX, S.maxY, S.maxX, S.maxY);
    return O === 0 ? 0 : Math.min(A, k, E, O);
  }
  function c(d, b) {
    return d[0] >= b.minX && d[0] <= b.maxX && d[1] >= b.minY && d[1] <= b.maxY;
  }
  function l(d, b, S) {
    for (var A = Math.min(d[0], b[0]), k = Math.min(d[1], b[1]), E = Math.max(d[0], b[0]), O = Math.max(d[1], b[1]), T = S.search({ minX: A, minY: k, maxX: E, maxY: O }), P = 0; P < T.length; P++)
      if (u(T[P].p, T[P].next.p, d, b)) return !1;
    return !0;
  }
  function f(d, b, S) {
    return n(d[0], d[1], b[0], b[1], S[0], S[1]);
  }
  function u(d, b, S, A) {
    return d !== A && b !== S && f(d, b, S) > 0 != f(d, b, A) > 0 && f(S, A, d) > 0 != f(S, A, b) > 0;
  }
  function h(d) {
    var b = d.p, S = d.next.p;
    return d.minX = Math.min(b[0], S[0]), d.minY = Math.min(b[1], S[1]), d.maxX = Math.max(b[0], S[0]), d.maxY = Math.max(b[1], S[1]), d;
  }
  function y(d) {
    for (var b = d[0], S = d[0], A = d[0], k = d[0], E = 0; E < d.length; E++) {
      var O = d[E];
      O[0] < b[0] && (b = O), O[0] > A[0] && (A = O), O[1] < S[1] && (S = O), O[1] > k[1] && (k = O);
    }
    var T = [b, S, A, k], P = T.slice();
    for (E = 0; E < d.length; E++)
      e(d[E], T) || P.push(d[E]);
    return w(P);
  }
  function m(d, b) {
    var S = {
      p: d,
      prev: null,
      next: null,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };
    return b ? (S.next = b.next, S.prev = b, b.next.prev = S, b.next = S) : (S.prev = S, S.next = S), S;
  }
  function p(d, b) {
    var S = d[0] - b[0], A = d[1] - b[1];
    return S * S + A * A;
  }
  function _(d, b, S) {
    var A = b[0], k = b[1], E = S[0] - A, O = S[1] - k;
    if (E !== 0 || O !== 0) {
      var T = ((d[0] - A) * E + (d[1] - k) * O) / (E * E + O * O);
      T > 1 ? (A = S[0], k = S[1]) : T > 0 && (A += E * T, k += O * T);
    }
    return E = d[0] - A, O = d[1] - k, E * E + O * O;
  }
  function I(d, b, S, A, k, E, O, T) {
    var P = S - d, F = A - b, x = O - k, B = T - E, M = d - k, N = b - E, D = P * P + F * F, R = P * x + F * B, v = x * x + B * B, C = P * M + F * N, $ = x * M + B * N, X = D * v - R * R, Y, L, j, q, W = X, K = X;
    X === 0 ? (L = 0, W = 1, q = $, K = v) : (L = R * $ - v * C, q = D * $ - R * C, L < 0 ? (L = 0, q = $, K = v) : L > W && (L = W, q = $ + R, K = v)), q < 0 ? (q = 0, -C < 0 ? L = 0 : -C > D ? L = W : (L = -C, W = D)) : q > K && (q = K, -C + R < 0 ? L = 0 : -C + R > D ? L = W : (L = -C + R, W = D)), Y = L === 0 ? 0 : L / W, j = q === 0 ? 0 : q / K;
    var G = (1 - Y) * d + Y * S, Q = (1 - Y) * b + Y * A, J = (1 - j) * k + j * O, Z = (1 - j) * E + j * T, ct = J - G, ft = Z - Q;
    return ct * ct + ft * ft;
  }
  function g(d, b) {
    return d[0] === b[0] ? d[1] - b[1] : d[0] - b[0];
  }
  function w(d) {
    d.sort(g);
    for (var b = [], S = 0; S < d.length; S++) {
      for (; b.length >= 2 && f(b[b.length - 2], b[b.length - 1], d[S]) <= 0; )
        b.pop();
      b.push(d[S]);
    }
    for (var A = [], k = d.length - 1; k >= 0; k--) {
      for (; A.length >= 2 && f(A[A.length - 2], A[A.length - 1], d[k]) <= 0; )
        A.pop();
      A.push(d[k]);
    }
    return A.pop(), b.pop(), b.concat(A);
  }
  return he.exports;
}
var Ui = Li();
const qi = /* @__PURE__ */ Ti(Ui);
function fn(r, t = {}) {
  t.concavity = t.concavity || 1 / 0;
  const e = [];
  if (Xe(r, (s) => {
    e.push([s[0], s[1]]);
  }), !e.length)
    return null;
  const n = qi(e, t.concavity);
  return n.length > 3 ? re([n], t.properties) : null;
}
const hn = Math.pow(2, -52), de = new Uint32Array(512);
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
  static from(t, e = Ki, n = Wi) {
    const s = t.length, o = new Float64Array(s * 2);
    for (let i = 0; i < s; i++) {
      const a = t[i];
      o[2 * i] = e(a), o[2 * i + 1] = n(a);
    }
    return new Le(o);
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
    const { coords: t, _hullPrev: e, _hullNext: n, _hullTri: s, _hullHash: o } = this, i = t.length >> 1;
    let a = 1 / 0, c = 1 / 0, l = -1 / 0, f = -1 / 0;
    for (let E = 0; E < i; E++) {
      const O = t[2 * E], T = t[2 * E + 1];
      O < a && (a = O), T < c && (c = T), O > l && (l = O), T > f && (f = T), this._ids[E] = E;
    }
    const u = (a + l) / 2, h = (c + f) / 2;
    let y = 0, m = 0, p = 0;
    for (let E = 0, O = 1 / 0; E < i; E++) {
      const T = De(u, h, t[2 * E], t[2 * E + 1]);
      T < O && (y = E, O = T);
    }
    const _ = t[2 * y], I = t[2 * y + 1];
    for (let E = 0, O = 1 / 0; E < i; E++) {
      if (E === y) continue;
      const T = De(_, I, t[2 * E], t[2 * E + 1]);
      T < O && T > 0 && (m = E, O = T);
    }
    let g = t[2 * m], w = t[2 * m + 1], d = 1 / 0;
    for (let E = 0; E < i; E++) {
      if (E === y || E === m) continue;
      const O = zi(_, I, g, w, t[2 * E], t[2 * E + 1]);
      O < d && (p = E, d = O);
    }
    let b = t[2 * p], S = t[2 * p + 1];
    if (d === 1 / 0) {
      for (let T = 0; T < i; T++)
        this._dists[T] = t[2 * T] - t[0] || t[2 * T + 1] - t[1];
      zt(this._ids, this._dists, 0, i - 1);
      const E = new Uint32Array(i);
      let O = 0;
      for (let T = 0, P = -1 / 0; T < i; T++) {
        const F = this._ids[T], x = this._dists[F];
        x > P && (E[O++] = F, P = x);
      }
      this.hull = E.subarray(0, O), this.triangles = new Uint32Array(0), this.halfedges = new Int32Array(0);
      return;
    }
    if (at(_, I, g, w, b, S) < 0) {
      const E = m, O = g, T = w;
      m = p, g = b, w = S, p = E, b = O, S = T;
    }
    const A = Gi(_, I, g, w, b, S);
    this._cx = A.x, this._cy = A.y;
    for (let E = 0; E < i; E++)
      this._dists[E] = De(t[2 * E], t[2 * E + 1], A.x, A.y);
    zt(this._ids, this._dists, 0, i - 1), this._hullStart = y;
    let k = 3;
    n[y] = e[p] = m, n[m] = e[y] = p, n[p] = e[m] = y, s[y] = 0, s[m] = 1, s[p] = 2, o.fill(-1), o[this._hashKey(_, I)] = y, o[this._hashKey(g, w)] = m, o[this._hashKey(b, S)] = p, this.trianglesLen = 0, this._addTriangle(y, m, p, -1, -1, -1);
    for (let E = 0, O = 0, T = 0; E < this._ids.length; E++) {
      const P = this._ids[E], F = t[2 * P], x = t[2 * P + 1];
      if (E > 0 && Math.abs(F - O) <= hn && Math.abs(x - T) <= hn || (O = F, T = x, P === y || P === m || P === p)) continue;
      let B = 0;
      for (let v = 0, C = this._hashKey(F, x); v < this._hashSize && (B = o[(C + v) % this._hashSize], !(B !== -1 && B !== n[B])); v++)
        ;
      B = e[B];
      let M = B, N;
      for (; N = n[M], at(F, x, t[2 * M], t[2 * M + 1], t[2 * N], t[2 * N + 1]) >= 0; )
        if (M = N, M === B) {
          M = -1;
          break;
        }
      if (M === -1) continue;
      let D = this._addTriangle(M, P, n[M], -1, -1, s[M]);
      s[P] = this._legalize(D + 2), s[M] = D, k++;
      let R = n[M];
      for (; N = n[R], at(F, x, t[2 * R], t[2 * R + 1], t[2 * N], t[2 * N + 1]) < 0; )
        D = this._addTriangle(R, P, N, s[P], -1, s[R]), s[P] = this._legalize(D + 2), n[R] = R, k--, R = N;
      if (M === B)
        for (; N = e[M], at(F, x, t[2 * N], t[2 * N + 1], t[2 * M], t[2 * M + 1]) < 0; )
          D = this._addTriangle(N, P, M, -1, s[M], s[N]), this._legalize(D + 2), s[N] = D, n[M] = M, k--, M = N;
      this._hullStart = e[P] = M, n[M] = e[R] = P, n[P] = R, o[this._hashKey(F, x)] = P, o[this._hashKey(t[2 * M], t[2 * M + 1])] = M;
    }
    this.hull = new Uint32Array(k);
    for (let E = 0, O = this._hullStart; E < k; E++)
      this.hull[E] = O, O = n[O];
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
    return Math.floor(ji(t - this._cx, e - this._cy) * this._hashSize) % this._hashSize;
  }
  /**
   * Flip an edge in a pair of triangles if it doesn't satisfy the Delaunay condition.
   *
   * @param {number} a
   * @private
   */
  _legalize(t) {
    const { _triangles: e, _halfedges: n, coords: s } = this;
    let o = 0, i = 0;
    for (; ; ) {
      const a = n[t], c = t - t % 3;
      if (i = c + (t + 2) % 3, a === -1) {
        if (o === 0) break;
        t = de[--o];
        continue;
      }
      const l = a - a % 3, f = c + (t + 1) % 3, u = l + (a + 2) % 3, h = e[i], y = e[t], m = e[f], p = e[u];
      if (Vi(
        s[2 * h],
        s[2 * h + 1],
        s[2 * y],
        s[2 * y + 1],
        s[2 * m],
        s[2 * m + 1],
        s[2 * p],
        s[2 * p + 1]
      )) {
        e[t] = p, e[a] = h;
        const I = n[u];
        if (I === -1) {
          let w = this._hullStart;
          do {
            if (this._hullTri[w] === u) {
              this._hullTri[w] = t;
              break;
            }
            w = this._hullPrev[w];
          } while (w !== this._hullStart);
        }
        this._link(t, I), this._link(a, n[i]), this._link(i, u);
        const g = l + (a + 1) % 3;
        o < de.length && (de[o++] = g);
      } else {
        if (o === 0) break;
        t = de[--o];
      }
    }
    return i;
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
  _addTriangle(t, e, n, s, o, i) {
    const a = this.trianglesLen;
    return this._triangles[a] = t, this._triangles[a + 1] = e, this._triangles[a + 2] = n, this._link(a, s), this._link(a + 1, o), this._link(a + 2, i), this.trianglesLen += 3, a;
  }
}
function ji(r, t) {
  const e = r / (Math.abs(r) + Math.abs(t));
  return (t > 0 ? 3 - e : 1 + e) / 4;
}
function De(r, t, e, n) {
  const s = r - e, o = t - n;
  return s * s + o * o;
}
function Vi(r, t, e, n, s, o, i, a) {
  const c = r - i, l = t - a, f = e - i, u = n - a, h = s - i, y = o - a, m = c * c + l * l, p = f * f + u * u, _ = h * h + y * y;
  return c * (u * _ - p * y) - l * (f * _ - p * h) + m * (f * y - u * h) < 0;
}
function zi(r, t, e, n, s, o) {
  const i = e - r, a = n - t, c = s - r, l = o - t, f = i * i + a * a, u = c * c + l * l, h = 0.5 / (i * l - a * c), y = (l * f - a * u) * h, m = (i * u - c * f) * h;
  return y * y + m * m;
}
function Gi(r, t, e, n, s, o) {
  const i = e - r, a = n - t, c = s - r, l = o - t, f = i * i + a * a, u = c * c + l * l, h = 0.5 / (i * l - a * c), y = r + (l * f - a * u) * h, m = t + (i * u - c * f) * h;
  return { x: y, y: m };
}
function zt(r, t, e, n) {
  if (n - e <= 20)
    for (let s = e + 1; s <= n; s++) {
      const o = r[s], i = t[o];
      let a = s - 1;
      for (; a >= e && t[r[a]] > i; ) r[a + 1] = r[a--];
      r[a + 1] = o;
    }
  else {
    const s = e + n >> 1;
    let o = e + 1, i = n;
    Ht(r, s, o), t[r[e]] > t[r[n]] && Ht(r, e, n), t[r[o]] > t[r[n]] && Ht(r, o, n), t[r[e]] > t[r[o]] && Ht(r, e, o);
    const a = r[o], c = t[a];
    for (; ; ) {
      do
        o++;
      while (t[r[o]] < c);
      do
        i--;
      while (t[r[i]] > c);
      if (i < o) break;
      Ht(r, o, i);
    }
    r[e + 1] = r[i], r[i] = a, n - o + 1 >= i - e ? (zt(r, t, o, n), zt(r, t, e, i - 1)) : (zt(r, t, e, i - 1), zt(r, t, o, n));
  }
}
function Ht(r, t, e) {
  const n = r[t];
  r[t] = r[e], r[e] = n;
}
function Ki(r) {
  return r[0];
}
function Wi(r) {
  return r[1];
}
class Hi {
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
class dn extends Hi {
  constructor(t) {
    super(8, new Uint8Array(Math.ceil(t / 8)).fill(0));
  }
}
function At(r) {
  return r % 3 === 2 ? r - 2 : r + 1;
}
function St(r) {
  return r % 3 === 0 ? r + 2 : r - 1;
}
function pn(r, t, e, n, s, o, i, a) {
  const c = at(r, t, s, o, i, a), l = at(e, n, s, o, i, a);
  if (c > 0 && l > 0 || c < 0 && l < 0)
    return !1;
  const f = at(s, o, r, t, e, n), u = at(i, a, r, t, e, n);
  return f > 0 && u > 0 || f < 0 && u < 0 ? !1 : c === 0 && l === 0 && f === 0 && u === 0 ? !(Math.max(s, i) < Math.min(r, e) || Math.max(r, e) < Math.min(s, i) || Math.max(o, a) < Math.min(t, n) || Math.max(t, n) < Math.min(o, a)) : !0;
}
class Ji {
  /**
   * The triangulation object from Delaunator.
   */
  del;
  constructor(t) {
    this.del = t;
  }
}
class te extends Ji {
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
    this.vertMap = new Uint32Array(s).fill(n), this.flips = new dn(o), this.consd = new dn(o);
    for (let i = 0; i < o; i++) {
      const a = t.triangles[i];
      this.vertMap[a] === n && this.updateVert(i);
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
    const e = new te({
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
    const o = this.vertMap[t], i = this.maxConstrainSteps();
    let a = 0, c = o;
    do {
      if (++a > i)
        throw new Error(
          `Constraining edge [${t}, ${e}] exceeded the iteration limit`
        );
      const u = n[c], h = At(c);
      if (u === e)
        return this.protect(c);
      const y = St(c), m = n[y];
      if (m === e)
        return this.protect(h), h;
      if (this.intersectSegments(t, e, m, u)) {
        c = y;
        break;
      }
      c = s[h];
    } while (c !== -1 && c !== o);
    let l = c, f = -1;
    for (; c !== -1; ) {
      if (++a > i)
        throw new Error(
          `Constraining edge [${t}, ${e}] exceeded the iteration limit`
        );
      const u = s[c], h = St(c), y = St(u), m = At(u);
      if (u === -1)
        throw new Error("Constraining edge exited the hull");
      if (this.consd.has(c))
        throw new Error("Edge intersects already constrained edge");
      if (this.isCollinear(t, e, n[c]) || this.isCollinear(t, e, n[u]))
        throw new Error("Constraining edge intersects point");
      if (!this.intersectSegments(
        n[c],
        n[u],
        n[h],
        n[y]
      )) {
        if (f === -1 && (f = c), n[y] === e) {
          if (c === f)
            throw new Error("Infinite loop: non-convex quadrilateral");
          c = f, f = -1;
          continue;
        }
        if (this.intersectSegments(
          t,
          e,
          n[y],
          n[u]
        ))
          c = y;
        else if (this.intersectSegments(
          t,
          e,
          n[m],
          n[y]
        ))
          c = m;
        else if (f === c)
          throw new Error("Infinite loop: no further intersect after non-convex");
        continue;
      }
      if (this.flipDiagonal(c), this.intersectSegments(
        t,
        e,
        n[h],
        n[y]
      ) && (f === -1 && (f = h), f === h))
        throw new Error("Infinite loop: flipped diagonal still intersects");
      n[y] === e ? (l = y, c = f, f = -1) : this.intersectSegments(
        t,
        e,
        n[m],
        n[y]
      ) && (c = m);
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
    let i;
    do {
      i = 0;
      for (let a = 0; a < o; a++) {
        if (s.has(a))
          continue;
        n.delete(a);
        const c = e[a];
        c !== -1 && (n.delete(c), this.isDelaunay(a) || (this.flipDiagonal(a), i++));
      }
    } while (t && i > 0);
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
    const { triangles: n, halfedges: s } = this.del, o = n.length / 3, i = (m, p, _) => {
      const I = t(p), g = t(_);
      return t(m).some((w) => I.includes(w) && g.includes(w));
    }, a = (m) => i(n[m * 3], n[m * 3 + 1], n[m * 3 + 2]), c = (m, p, _, I) => Math.sign(at(m[p * 2], m[p * 2 + 1], m[_ * 2], m[_ * 2 + 1], m[I * 2], m[I * 2 + 1])), l = e.map((m) => {
      let p = 0;
      for (let _ = 0; _ < o; _++) p += c(m, n[_ * 3], n[_ * 3 + 1], n[_ * 3 + 2]);
      return p < 0 ? -1 : 1;
    }), f = (m) => {
      if (this.consd.has(m)) return !1;
      const p = s[m];
      if (p === -1) return !1;
      const _ = n[m], I = n[At(m)], g = n[St(m)], w = n[St(p)];
      return e.every((d, b) => c(d, g, _, w) === l[b] && c(d, w, I, g) === l[b]);
    };
    let u = 0, h = !0;
    for (; h; ) {
      h = !1;
      for (let m = 0; m < o; m++)
        if (a(m))
          for (let p = 0; p < 3; p++) {
            const _ = m * 3 + p;
            if (!f(_)) continue;
            const I = s[_], g = n[_], w = n[At(_)], d = n[St(_)], b = n[St(I)];
            if (!(i(d, g, b) && i(b, w, d))) {
              this.protect(this.flipDiagonal(_)), u++, h = !0;
              break;
            }
          }
    }
    let y = 0;
    for (let m = 0; m < o; m++) a(m) && y++;
    return { flips: u, remaining: y };
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
    let i = n, a, c = 0;
    do {
      if (++c > s.length)
        throw new Error(
          `Looking up edge [${t}, ${e}] exceeded the iteration limit`
        );
      if (s[i] === t)
        return i;
      a = At(i), i = o[a];
    } while (i !== -1 && i !== n);
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
    const { triangles: e, halfedges: n } = this.del, s = this.flips, o = this.consd, i = n[t], a = St(t), c = At(t), l = St(i), f = At(i), u = n[a], h = n[l];
    if (o.has(t))
      throw new Error("Trying to flip a constrained edge");
    return e[t] = e[l], n[t] = h, s.set(t, s.has(l)) || o.set(t, o.has(l)), h !== -1 && (n[h] = t), n[a] = l, e[i] = e[a], n[i] = u, s.set(i, s.has(a)) || o.set(i, o.has(a)), u !== -1 && (n[u] = i), n[l] = a, this.markFlip(t), this.markFlip(c), this.markFlip(i), this.markFlip(f), s.add(a), o.delete(a), s.add(l), o.delete(l), this.updateVert(t), this.updateVert(c), this.updateVert(i), this.updateVert(f), a;
  }
  /**
   * Whether point p1, p2, and p are collinear.
   */
  isCollinear(t, e, n) {
    const s = this.del.coords;
    return at(
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
    return hi(
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
    const o = e[St(t)], i = e[t], a = e[At(t)], c = e[St(s)];
    return !this.inCircle(o, i, a, c);
  }
  /**
   * Update the vertex -> incoming edge map.
   */
  updateVert(t) {
    const { triangles: e, halfedges: n } = this.del, s = this.vertMap, o = e[t];
    let i = St(t), a = n[i];
    for (; a !== -1 && a !== t; )
      i = St(a), a = n[i];
    return s[o] = i, i;
  }
  /**
   * Whether the segments between vertices intersect.
   */
  intersectSegments(t, e, n, s) {
    const o = this.del.coords;
    return t === n || t === s || e === n || e === s ? !1 : pn(
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
  static intersectSegments = pn;
}
function pe(r, t, e) {
  return Pe(r, t, e).tin;
}
function Pe(r, t, e, n, s) {
  if (t || (t = []), typeof r != "object" || r.type !== "FeatureCollection")
    throw "Argument points must be FeatureCollection";
  if (!Array.isArray(t)) throw "Argument points must be Array of Array";
  const o = r.features.map(
    (p) => p.geometry.coordinates
  );
  let i = s?.snapshot ? te.restore(s.snapshot) : void 0;
  const a = i ? void 0 : Le.from(o);
  let c = i ? i.del : a, l = 0, f;
  const u = [];
  if (c.triangles.length !== 0 && (t.length !== 0 || n)) {
    if (!i) {
      i = new te(c);
      try {
        i.constrainAll(t);
      } catch (I) {
        if (!n?.allowUnusableBoundary) throw I;
        return { tin: xt([]), remaining: 0, hasBoundary: !1, hull: [] };
      }
      s && (s.snapshot = i.snapshot());
    }
    const p = n ? s?.snapshot ?? i.snapshot() : void 0, _ = (I) => {
      const g = te.restore(p);
      return g.constrainAll(I), g;
    };
    for (const I of n?.hull ?? [])
      try {
        i.constrainOne(I[0], I[1]), u.push(I);
      } catch {
        i = _(u);
      }
    n?.boundary && (f = Qi(i, n.boundary), f || (i = _(u))), n && ({ remaining: l } = i.forbidGroupTriangles(
      n.groupsOf,
      n.planes
    ), l -= f?.size ?? 0), c = i.del;
  }
  const h = [];
  for (let p = 0; p < c.triangles.length; p += 3)
    f?.has(p / 3) || h.push([c.triangles[p], c.triangles[p + 1], c.triangles[p + 2]]);
  const y = ["a", "b", "c"];
  return { tin: xt(
    h.map((p) => {
      const _ = {}, I = p.map((g, w) => {
        const d = r.features[g], b = d.geometry.coordinates, S = [b[0], b[1]];
        return b.length === 3 ? S[2] = b[2] : _[y[w]] = d.properties[e], S;
      });
      return I[3] = I[0], re([I], _);
    })
  ), remaining: l, hasBoundary: f !== void 0, hull: u };
}
function Qi(r, t) {
  try {
    r.constrainAll(t);
  } catch {
    return;
  }
  const e = new Map(t), { triangles: n, halfedges: s } = r.del, o = (l) => {
    const f = n[l], u = n[At(l)];
    return e.get(f) === u || e.get(u) === f;
  }, i = /* @__PURE__ */ new Set(), a = [], c = (l) => {
    const f = Math.floor(l / 3);
    i.has(f) || (i.add(f), a.push(f));
  };
  for (let l = 0; l < s.length; l++)
    s[l] === -1 && !o(l) && c(l);
  for (let l = 0; l < a.length; l++)
    for (let f = a[l] * 3; f < a[l] * 3 + 3; f++) {
      if (!e.has(n[f])) return;
      s[f] !== -1 && !o(f) && c(s[f]);
    }
  return i;
}
function gn(r) {
  const t = /* @__PURE__ */ new Set(), e = [];
  if (r.forEach(([c, l], f) => {
    const u = `${c}:${l}`;
    t.has(u) || (t.add(u), e.push({ i: f, x: c, y: l }));
  }), e.length < 3) return [];
  const n = (c, l, f) => at(c.x, c.y, l.x, l.y, f.x, f.y), s = [...e].sort((c, l) => c.x - l.x || c.y - l.y), o = (c) => {
    const l = [];
    for (const f of c) {
      for (; l.length >= 2 && n(l[l.length - 2], l[l.length - 1], f) <= 0; ) l.pop();
      l.push(f);
    }
    return l.pop(), l;
  }, i = [...o(s), ...o([...s].reverse())];
  if (i.length < 3) return [];
  const a = [];
  for (let c = 0; c < i.length; c++) {
    const l = i[c], f = i[(c + 1) % i.length], u = f.x - l.x, h = f.y - l.y, y = u * u + h * h, m = e.filter((_) => _ !== l && _ !== f && n(l, f, _) === 0).map((_) => ({ r: _, t: ((_.x - l.x) * u + (_.y - l.y) * h) / y })).filter(({ t: _ }) => _ > 0 && _ < 1).sort((_, I) => _.t - I.t).map(({ r: _ }) => _), p = [l, ...m, f];
    for (let _ = 0; _ + 1 < p.length; _++) a.push([p[_].i, p[_ + 1].i]);
  }
  return a;
}
function ve([r, t]) {
  return r < t ? `${r}-${t}` : `${t}-${r}`;
}
function jt(r, t, e) {
  return Lt(r, { target: { geom: t, index: e } });
}
function Vt(r) {
  return Lt(r.properties.target.geom, {
    target: {
      geom: r.geometry.coordinates,
      index: r.properties.target.index
    }
  });
}
function mn(r, t) {
  const e = r.length, n = t.geometry.coordinates;
  return Array.from({ length: e }, (s, o) => o).map((s) => {
    const o = (s + 1) % e, i = r[s], a = r[o], c = i.geometry.coordinates, l = Math.atan2(
      c[0] - n[0],
      c[1] - n[1]
    ), f = [t, i, a, t].map(
      (y) => y.geometry.coordinates
    ), u = {
      a: {
        geom: t.properties.target.geom,
        index: t.properties.target.index
      },
      b: {
        geom: i.properties.target.geom,
        index: i.properties.target.index
      },
      c: {
        geom: a.properties.target.geom,
        index: a.properties.target.index
      }
    }, h = xt([
      re([f], u)
    ]);
    return [l, h];
  }).reduce(
    (s, o) => (s[0].push(o[0]), s[1].push(o[1]), s),
    [[], []]
  );
}
const Zi = [0.1, 0.15, 0.225, 0.34, 0.5];
function tr(r, t) {
  return t ? r.hasBoundary !== t.hasBoundary ? r.hasBoundary : r.diagnostics.boundaryTriangleFlips < t.diagnostics.boundaryTriangleFlips : !0;
}
function wn(r, t, e) {
  return Math.sign(at(r[0], r[1], t[0], t[1], e[0], e[1]));
}
function be(r, t = -1) {
  let e = 0;
  for (const n of r.features) {
    const { a: s, b: o, c: i } = n.properties;
    if (![s, o, i].some(
      ({ index: u }) => typeof u == "string" && u.startsWith("b")
    ))
      continue;
    const [a, c, l] = n.geometry.coordinates[0];
    wn(a, c, l) * wn(s.geom, o.geom, i.geom) * t <= 0 && e++;
  }
  return e;
}
function yn(r, t, e) {
  if (r.some(([i, a]) => i === t[0] && a === t[1])) return !1;
  const n = r.map(
    ([i, a]) => Math.atan2(a - t[1], i - t[0])
  ), s = 2 * Math.PI;
  let o = 0;
  for (let i = 0; i < n.length; i++) {
    const c = (e * (n[(i + 1) % n.length] - n[i]) + s) % s;
    if (!(c > 0 && c < Math.PI)) return !1;
    o += c;
  }
  return Math.abs(o - s) < 1e-6;
}
function vn(r, t, e, n, s, o = /* @__PURE__ */ new Set(), i) {
  const { minx: a, maxx: c, miny: l, maxy: f, centroid: u } = r, h = c - a, y = f - l, m = e.forw.length, p = Array.from({ length: m }, () => []);
  let _ = 1;
  for (const [A, k] of e.edges)
    A < n && p[A].push(_), p[k].push(_), k < n && _++;
  const I = (A) => A.slice(0, m).map(({ geometry: k }) => k.coordinates), g = gn(I(e.forw)), w = {
    forw: g.filter((A) => !o.has(ve(A))),
    bakw: gn(I(e.bakw))
  }, d = [0], b = (A) => A >= m ? d : p[A];
  let S;
  for (const A of Zi) {
    const k = i?.get(A) ?? { forwReuse: {} };
    i?.set(A, k);
    const E = k.vertices ?? (k.vertices = t(
      {
        ...r,
        minx: a - A * h,
        maxx: c + A * h,
        miny: l - A * y,
        maxy: f + A * y
      },
      !0
    ));
    if (s && (E.length < 4 || !E.every(({ bakw: L }) => L.every(Number.isFinite)))) continue;
    const O = E.map(
      ({ forw: L, bakw: j }, q) => jt(L, j, `b${q}`)
    ), T = xt([...e.forw, ...O]), P = xt([
      ...e.bakw,
      ...O.map(Vt)
    ]), F = [T, P].map(
      ({ features: L }) => Float64Array.from(
        L.flatMap(
          ({
            geometry: {
              coordinates: [j, q]
            }
          }) => [j, q]
        )
      )
    ), B = s !== void 0 || yn(
      E.map((L) => L.forw),
      u.forw,
      -1
    ) && yn(
      E.map((L) => L.bakw),
      u.bakw,
      1
    ) ? E.map((L, j) => [
      m + j,
      m + (j + 1) % E.length
    ]) : void 0, M = { groupsOf: b, planes: F, boundary: B, allowUnusableBoundary: s !== void 0 }, N = s?.orientation ?? -1, D = Pe(
      T,
      e.edges,
      "target",
      { ...M, hull: w.forw },
      k.forwReuse
    ), R = k.geographic ?? (k.geographic = (() => {
      const L = Pe(P, e.edges, "target", {
        ...M,
        hull: w.bakw
      });
      return { built: L, flips: be(L.tin, N) };
    })()), v = R.built, C = D.tin, $ = {
      ...v.tin,
      features: [...v.tin.features]
    }, X = be(C, N) + R.flips, Y = {
      vertices: E,
      forw: C,
      bakw: $,
      diagnostics: {
        margin: A,
        boundaryTriangleFlips: X,
        remainingForbiddenTriangles: D.remaining + v.remaining
      },
      hasMapBoundary: D.hasBoundary,
      hasBoundary: D.hasBoundary && v.hasBoundary,
      forwHull: { all: g, applied: D.hull }
    };
    if (s) {
      if (s.accept(Y)) return Y;
      continue;
    }
    if (X === 0 && Y.hasBoundary)
      return Y;
    tr(Y, S) && (S = Y);
  }
  return S;
}
const bn = 1e-9;
function er(r, t) {
  const e = [[], [], [], []], n = [];
  return Object.keys(r).forEach((s) => {
    const o = r[s], i = o.forw, a = o.bakw, c = [
      i[0] - t.forw[0],
      i[1] - t.forw[1]
    ], l = [
      a[0] - t.bakw[0],
      t.bakw[1] - a[1]
    ], f = { forw: c, bakw: l };
    if (n.push(f), c[0] === 0 || c[1] === 0)
      return;
    let u = 0;
    c[0] > 0 && (u += 1), c[1] > 0 && (u += 2), e[u].push(f);
  }), { perQuad: e, aggregate: n };
}
function Yn(r) {
  let t = 1 / 0, e = 0, n = 0;
  return r.forEach((s) => {
    const { forw: o, bakw: i } = s, a = Math.hypot(o[0], o[1]), c = Math.hypot(i[0], i[1]);
    if (c === 0) return;
    const l = a / c, f = Math.atan2(o[0], o[1]) - Math.atan2(i[0], i[1]);
    t = Math.min(t, l), e += Math.cos(f), n += Math.sin(f);
  }), isFinite(t) ? [t, Math.atan2(n, e)] : [1, 0];
}
const nr = 0.6, ir = 3, rr = 0.5;
function sr(r) {
  let t = 0, e = 0, n = 0, s = 0;
  if (r.forEach(({ forw: i, bakw: a }) => {
    t += i[1] * a[1] + i[0] * a[0], e += i[0] * a[1] - i[1] * a[0], n += a[0] * a[0] + a[1] * a[1], s += i[0] * i[0] + i[1] * i[1];
  }), !(!(n > 0 && s > 0) || !(Math.hypot(t, e) / Math.sqrt(s * n) >= rr)))
    return [Math.hypot(t, e) / n, Math.atan2(e, t)];
}
function or(r) {
  const t = (s) => Math.hypot(s.forw[0], s.forw[1]), e = Math.max(...r.map(t)), n = r.filter((s) => t(s) >= nr * e);
  return sr(n.length >= ir ? n : r) ?? Yn(r);
}
function ar(r, t, e, n) {
  const { perQuad: s, aggregate: o } = er(r, t), i = s.every((f) => f.length > 0), a = e === "birdeye" ? i ? s : [o] : [o], c = n === "farLsq" ? or : Yn, l = a.map((f) => c(f));
  return l.length === 1 ? [l[0], l[0], l[0], l[0]] : l;
}
function cr(r, t) {
  let e = 0;
  return r[0] > t[0] && (e += 1), r[1] > t[1] && (e += 2), e;
}
function lr(r, t, e) {
  const n = [
    r[0] - t.forw[0],
    r[1] - t.forw[1]
  ], o = Math.sqrt(n[0] ** 2 + n[1] ** 2) / e[0], i = Math.atan2(n[0], n[1]) - e[1];
  return [
    t.bakw[0] + o * Math.sin(i),
    t.bakw[1] - o * Math.cos(i)
  ];
}
function ur(r, t, e, n) {
  const s = t[0] - r[0], o = t[1] - r[1];
  if (Math.abs(s) < 1e-12 && Math.abs(o) < 1e-12) return null;
  const i = n[0] - e[0], a = n[1] - e[1], c = e[0] - r[0], l = e[1] - r[1], f = s * a - o * i;
  if (Math.abs(f) < 1e-12) return null;
  const u = (c * a - l * i) / f, h = (c * o - l * s) / f;
  return u <= 1e-10 || h < -1e-10 || h > 1 + 1e-10 ? null : { t: u, point: [r[0] + u * s, r[1] + u * o] };
}
function fr(r, t, e) {
  const n = e.length;
  let s = -1 / 0, o = null;
  for (let i = 0; i < n; i++) {
    const a = (i + 1) % n, c = ur(
      r,
      t,
      e[i].bakw,
      e[a].bakw
    );
    c && c.t > s && (s = c.t, o = c.point);
  }
  return o;
}
function hr(r, t) {
  return Math.floor(Re(r, t) / 10) % 36;
}
function Re(r, t) {
  const n = Math.atan2(r[0] - t[0], r[1] - t[1]) * (180 / Math.PI);
  return n < 0 ? n + 360 : n;
}
function xn(r, t, e, n, s, o) {
  const i = t[0] - r[0], a = t[1] - r[1];
  if (i === 0 && a === 0) return null;
  const c = [];
  if (i !== 0)
    for (const f of [e, n]) {
      const u = (f - r[0]) / i;
      if (u > 0) {
        const h = r[1] + u * a;
        h >= s && h <= o && c.push({ t: u, x: f, y: h });
      }
    }
  if (a !== 0)
    for (const f of [s, o]) {
      const u = (f - r[1]) / a;
      if (u > 0) {
        const h = r[0] + u * i;
        h >= e && h <= n && c.push({ t: u, x: h, y: f });
      }
    }
  if (c.length === 0) return null;
  c.sort((f, u) => f.t - u.t);
  const l = c[0];
  return [l.x, l.y];
}
function Sn(r, t, e) {
  const n = r.length, s = new Array(n).fill(1);
  for (const o of t)
    for (let i = 0; i < n; i++) {
      const a = (i + 1) % n, c = ze([r[i].bakw, r[a].bakw]), l = ze([e.bakw, o.bakw]), f = Bi(c, l);
      if (f.features.length > 0 && f.features[0].geometry) {
        const u = f.features[0], h = Math.sqrt(
          Math.pow(o.bakw[0] - e.bakw[0], 2) + Math.pow(o.bakw[1] - e.bakw[1], 2)
        ), y = Math.sqrt(
          Math.pow(u.geometry.coordinates[0] - e.bakw[0], 2) + Math.pow(u.geometry.coordinates[1] - e.bakw[1], 2)
        ), m = h / y;
        m > s[i] && (s[i] = m), m > s[a] && (s[a] = m);
      }
    }
  r.forEach((o, i) => {
    const a = s[i];
    o.bakw = [
      (o.bakw[0] - e.bakw[0]) * a + e.bakw[0],
      (o.bakw[1] - e.bakw[1]) * a + e.bakw[1]
    ];
  });
}
function Ue(r, t, e, n, s) {
  const { convexBuf: o, centroid: i, allGcps: a, minx: c, maxx: l, miny: f, maxy: u } = r, h = s ? void 0 : ar(o, i, t, n), m = [
    [c, f],
    [l, f],
    [l, u],
    [c, u]
  ].map((k) => ({
    forw: k,
    bakw: s ? s(k) : lr(
      k,
      i,
      h[cr(k, i.forw)]
    )
  }));
  if (m.sort(
    (k, E) => Math.atan2(k.forw[0] - i.forw[0], k.forw[1] - i.forw[1]) - Math.atan2(E.forw[0] - i.forw[0], E.forw[1] - i.forw[1])
  ), s || Sn(m, a, i), !e || r.ring?.cornersOnly) return m;
  const p = 4, _ = m.map(
    (k) => Math.atan2(k.forw[0] - i.forw[0], k.forw[1] - i.forw[1])
  ), I = m.map(
    (k) => Math.atan2(
      k.bakw[0] - i.bakw[0],
      -(k.bakw[1] - i.bakw[1])
    )
  );
  function g(k) {
    for (let E = 0; E < p; E++) {
      const O = (E + 1) % p, T = _[E], P = E < p - 1 ? _[O] : _[O] + 2 * Math.PI;
      let F = k;
      for (; F < T; ) F += 2 * Math.PI;
      for (; F >= T + 2 * Math.PI; ) F -= 2 * Math.PI;
      if (F >= T && F < P)
        return { i: E, j: O, frac: (F - T) / (P - T) };
    }
    return { i: 0, j: 1, frac: 0 };
  }
  function w(k) {
    const { i: E, j: O, frac: T } = g(k), P = I[E];
    let x = I[O] - P;
    for (; x > Math.PI; ) x -= 2 * Math.PI;
    for (; x < -Math.PI; ) x += 2 * Math.PI;
    return P + T * x;
  }
  const d = new Set(
    m.map(
      (k) => Math.floor(Re(k.forw, i.forw) / 10) % 36
    )
  ), b = a.map((k) => ({
    forw: k.forw,
    bakw: k.bakw,
    angleDeg: Re(k.forw, i.forw),
    forwDist: Math.hypot(k.forw[0] - i.forw[0], k.forw[1] - i.forw[1])
  })), S = [];
  for (let k = 0; k < 36; k++) {
    if (d.has(k) || r.ring?.skipBins?.has(k)) continue;
    const E = k * 10, O = b.filter((v) => {
      if (v.forwDist === 0) return !1;
      const C = ((v.angleDeg - E) % 360 + 360) % 360;
      return C < 10 + bn || C > 360 - bn;
    });
    let T = null;
    if (O.length > 0) {
      const v = O.reduce((C, $) => $.forwDist > C.forwDist ? $ : C);
      T = xn(i.forw, v.forw, c, l, f, u);
    }
    if (!T) {
      const v = (E + 5) % 360 * (Math.PI / 180), C = [
        i.forw[0] + Math.sin(v),
        i.forw[1] + Math.cos(v)
      ];
      T = xn(i.forw, C, c, l, f, u);
    }
    if (!T) continue;
    const [P, F] = T, x = 1e-9 * Math.max(l - c, u - f);
    if ([...m, ...S].some(
      (v) => Math.abs(v.forw[0] - P) <= x && Math.abs(v.forw[1] - F) <= x
    )) continue;
    if (s) {
      S.push({ forw: T, bakw: s(T) });
      continue;
    }
    const B = [T[0] - i.forw[0], T[1] - i.forw[1]], M = Math.atan2(B[0], B[1]), N = w(M), D = [
      i.bakw[0] + Math.sin(N),
      i.bakw[1] - Math.cos(N)
    ], R = fr(i.bakw, D, m);
    R && S.push({ forw: T, bakw: R });
  }
  const A = [...m, ...S];
  return A.sort(
    (k, E) => Math.atan2(k.forw[0] - i.forw[0], k.forw[1] - i.forw[1]) - Math.atan2(E.forw[0] - i.forw[0], E.forw[1] - i.forw[1])
  ), s || Sn(A, a, i), A;
}
function dr(r, t = !1) {
  return Ue(r, "plain", t, t ? "farLsq" : "min");
}
function pr(r, t = !1) {
  return Ue(r, "birdeye", t, "min");
}
function gr(r, t) {
  const e = /* @__PURE__ */ new Set();
  return Ue(r, "plain", !0, "min", t).filter(({ forw: [n, s] }) => {
    const o = `${n}:${s}`;
    return e.has(o) ? !1 : (e.add(o), !0);
  });
}
const Mn = (r) => typeof r == "string" && r.startsWith("b");
function mr(r, t) {
  const e = (n, s) => {
    for (let o = 0; o < 3; o++) {
      const i = n.g[o], a = n.g[(o + 1) % 3];
      if (s.g.every((c) => n.sign * at(i[0], i[1], a[0], a[1], c[0], c[1]) <= 0)) return !0;
    }
    return !1;
  };
  return !e(r, t) && !e(t, r);
}
function wr(r) {
  const t = r.features.map((a) => {
    const { a: c, b: l, c: f } = a.properties, u = [c.geom, l.geom, f.geom], h = a.geometry.coordinates[0].slice(0, 3), y = u.map(([I]) => I), m = u.map(([, I]) => I), p = Math.sign(at(h[0][0], h[0][1], h[1][0], h[1][1], h[2][0], h[2][1])), _ = Math.sign(at(u[0][0], u[0][1], u[1][0], u[1][1], u[2][0], u[2][1]));
    return {
      ids: [c.index, l.index, f.index],
      f: h,
      g: u,
      sign: _,
      ratio: p * _,
      aux: [c.index, l.index, f.index].some(Mn),
      minx: Math.min(...y),
      maxx: Math.max(...y),
      miny: Math.min(...m),
      maxy: Math.max(...m)
    };
  }), e = t.map((a) => a.ratio), n = e.reduce((a, c) => a + c, 0) < 0 ? -1 : 1, s = /* @__PURE__ */ new Set();
  t.forEach((a, c) => {
    a.aux && (e[c] === 0 || e[c] !== n) && s.add(c);
  });
  const o = t.map((a, c) => c).sort((a, c) => t[a].minx - t[c].minx);
  for (let a = 0; a < o.length; a++) {
    const c = t[o[a]];
    if (c.sign !== 0)
      for (let l = a + 1; l < o.length; l++) {
        const f = t[o[l]];
        if (f.minx >= c.maxx) break;
        f.sign === 0 || f.miny >= c.maxy || c.miny >= f.maxy || !c.aux && !f.aux || mr(c, f) && (s.add(o[a]), s.add(o[l]));
      }
  }
  const i = /* @__PURE__ */ new Map();
  for (const a of s)
    t[a].ids.forEach((c, l) => {
      Mn(c) && i.set(String(c), t[a].f[l]);
    });
  return [...i.values()];
}
function ds(r) {
  return Ln(r, 1 / 0);
}
const _n = 1e5, yr = 16;
function Ln(r, t) {
  return vr(r), new br(r).findSegmentIntersections(t).map(
    (s) => Lt([s.x, s.y])
  );
}
function vr(r) {
  for (let t = 0, e = r.length; t < e; t++) {
    const n = r[t];
    ne(n) || Yt(
      "findIntersections() received invalid coordinates:",
      `line=${t}`,
      `points=${n}`
    );
    for (let s = 0, o = n.length; s < o; s++) {
      const i = n[s];
      (!ne(i) || !Number.isFinite(i[0]) || !Number.isFinite(i[1])) && Yt(
        "findIntersections() received non-finite coordinates:",
        `line=${t}`,
        `point=${s}`,
        `coordinates=${JSON.stringify(i)}`
      );
    }
  }
}
class br {
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
      const i = o ? o.length : 0;
      for (let a = 0; a < i; a++)
        e.push(o[a][0]), n.push(o[a][1]);
      return i;
    });
    this.initXYData(s, e, n);
  }
  initXYData(t, e, n) {
    const s = t.length;
    this._xx = new Float64Array(e), this._yy = new Float64Array(n), this._nn = new Uint32Array(t), this._zz = null, this._zlimit = 0, this._filteredArcIter = null, this._ii = new Uint32Array(s);
    let o = 0;
    for (let i = 0; i < s; i++)
      this._ii[i] = o, o += t[i];
    (o != this._xx.length || this._xx.length != this._yy.length) && Yt("ArcCollection#initXYData() Counting error"), this.initBounds(), this._arcIter = new Yr(this._xx, this._yy);
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
    const s = n.length, o = new Float64Array(s * 4), i = new ie();
    let a = 0, c, l, f;
    for (let u = 0; u < s; u++)
      c = n[u], c > 0 && (l = u * 4, f = Lr(t, e, a, c), o[l++] = f[0], o[l++] = f[1], o[l++] = f[2], o[l] = f[3], a += c, i.mergeBounds(f));
    return {
      bb: o,
      bounds: i
    };
  }
  getBounds() {
    return this._allBounds ? this._allBounds.clone() : new ie();
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
    const n = t >= 0, s = n ? t : ~t, o = this.getRetainedInterval(), i = this._nn[s], a = n ? 1 : -1;
    let c = n ? this._ii[s] : this._ii[s] + i - 1, l = c, f = 0;
    for (let u = 1; u < i; u++)
      l += a, (o === 0 || this._zz[l] >= o) && (e(c, l, this._xx, this._yy), c = l, f++);
    return f;
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
      (s, o, i, a) => {
        t += Math.abs(i[s] - i[o]), e += Math.abs(a[s] - a[o]);
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
    const e = this.getBounds(), n = e.ymin || 0, s = (e.ymax || 0) - n, o = this.calcSegmentIntersectionStripeCount(), i = new Uint32Array(o), a = o > 1 ? (w) => Math.floor((o - 1) * (w - n) / s) : () => 0, c = o + 1;
    let l;
    this.forEachSegment(
      (w, d, b, S) => {
        let A = a(S[w]);
        const k = a(S[d]);
        let E = 0;
        for (; i[A] = i[A] + 2, A != k; )
          E++, E > c && Yt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${o}`,
            `s1=${A}`,
            `s2=${k}`
          ), A += k > A ? 1 : -1;
      }
    );
    const f = this.getUint32Array(Mr(i));
    let u = 0;
    const h = [];
    _r(i, (w) => {
      const d = u;
      u += w, h.push(f.subarray(d, u));
    }), kr(i, 0), this.forEachSegment(
      (w, d, b, S) => {
        let A = a(S[w]);
        const k = a(S[d]);
        let E, O, T = 0;
        for (; E = i[A], i[A] = E + 2, O = h[A], O[E] = w, O[E + 1] = d, A != k; )
          T++, T > c && Yt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${o}`,
            `s1=${A}`,
            `s2=${k}`
          ), A += k > A ? 1 : -1;
      }
    );
    const y = this.getVertexData(), m = t * yr;
    let p = 0;
    const _ = /* @__PURE__ */ new Set(), I = /* @__PURE__ */ new Map(), g = (w) => {
      p++;
      const d = Xr(w);
      return _.has(d) || (_.add(d), I.set(`${w.x}:${w.y}`, w)), I.size >= t || p >= m;
    };
    if (y.xx && y.yy)
      for (l = 0; l < o && !Er(h[l], y.xx, y.yy, g); l++)
        ;
    return Array.from(I.values());
  }
}
function Yt(...r) {
  const t = r.join(" ");
  throw new Error(t);
}
function ne(r) {
  return r ? Sr(r) ? !0 : xr(r) ? !1 : r.length === 0 ? !0 : r.length > 0 : !1;
}
function xr(r) {
  return r != null && r.toString === String.prototype.toString;
}
function Sr(r) {
  return Array.isArray(r);
}
function Mr(r, t) {
  ne(r) || Yt("utils.sum() expects an array, received:", r);
  let e = 0, n;
  for (let s = 0, o = r.length; s < o; s++)
    n = r[s], n && (e += n);
  return e;
}
function _r(r, t, e) {
  if (!ne(r))
    throw new Error(`#forEach() takes an array-like argument. ${r}`);
  for (let n = 0, s = r.length; n < s; n++)
    t.call(e, r[n], n);
}
function kr(r, t) {
  for (let e = 0, n = r.length; e < n; e++)
    r[e] = t;
  return r;
}
function Er(r, t, e, n) {
  const s = r.length - 2;
  let o, i, a, c, l, f, u, h, y, m, p, _, I, g, w, d, b;
  for (Pr(t, r), d = 0; d < s; ) {
    for (o = r[d], i = r[d + 1], l = t[o], f = t[i], y = e[o], m = e[i], b = d; b < s && (b += 2, a = r[b], u = t[a], !(f < u)); ) {
      if (p = e[a], c = r[b + 1], h = t[c], _ = e[c], y >= p) {
        if (y > _ && m > p && m > _) continue;
      } else if (y < _ && m < p && m < _) continue;
      if (!(o == a || o == c || i == a || i == c) && (I = Ar(
        l,
        y,
        f,
        m,
        u,
        p,
        h,
        _
      ), I && (g = [o, i], w = [a, c], n(En(I, g, w, t, e)) || I.length == 4 && n(En(I.slice(2), g, w, t, e)))))
        return !0;
    }
    d += 2;
  }
  return !1;
}
function Ar(r, t, e, n, s, o, i, a) {
  const c = Ir(r, t, e, n, s, o, i, a);
  let l = null;
  return c && (l = Br(r, t, e, n, s, o, i, a), l ? Fr(r, t, e, n, s, o, i, a) && (l = null) : l = Dr(r, t, e, n, s, o, i, a)), l;
}
function Ir(r, t, e, n, s, o, i, a) {
  return Qt(r, t, e, n, s, o) * Qt(r, t, e, n, i, a) <= 0 && Qt(s, o, i, a, r, t) * Qt(s, o, i, a, e, n) <= 0;
}
function Qt(r, t, e, n, s, o) {
  return Un(r - s, t - o, e - s, n - o);
}
function Un(r, t, e, n) {
  return r * n - t * e;
}
function Br(r, t, e, n, s, o, i, a) {
  let c = ge(r, t, e, n, s, o, i, a), l;
  return c && (l = Or(c[0], c[1], r, t, e, n, s, o, i, a), l == 1 ? c = ge(e, n, r, t, s, o, i, a) : l == 2 ? c = ge(s, o, i, a, r, t, e, n) : l == 3 && (c = ge(i, a, s, o, r, t, e, n))), c && Cr(c, r, t, e, n, s, o, i, a), c;
}
function ge(r, t, e, n, s, o, i, a) {
  const c = Un(e - r, n - t, i - s, a - o), l = 1e-18;
  let f;
  if (c === 0) return null;
  const u = Qt(s, o, i, a, r, t) / c;
  return c <= l && c >= -l ? f = Tr(r, t, e, n, s, o, i, a) : f = [r + u * (e - r), t + u * (n - t)], f;
}
function Tr(r, t, e, n, s, o, i, a) {
  let c = null;
  return !It(r, s, i) && !It(t, o, a) ? c = [r, t] : !It(e, s, i) && !It(n, o, a) ? c = [e, n] : !It(s, r, e) && !It(o, t, n) ? c = [s, o] : !It(i, r, e) && !It(a, t, n) && (c = [i, a]), c;
}
function It(r, t, e) {
  let n;
  return t < e ? n = r < t || r > e : t > e ? n = r > t || r < e : n = r != t, n;
}
function Or(r, t, ...e) {
  let n = -1, s = 1 / 0, o;
  for (let i = 0, a = 0, c = e.length; a < c; i++, a += 2)
    o = Nr(r, t, e[a], e[a + 1]), o < s && (s = o, n = i);
  return n;
}
function Nr(r, t, e, n) {
  const s = r - e, o = t - n;
  return s * s + o * o;
}
function Cr(r, t, e, n, s, o, i, a, c) {
  let l = r[0], f = r[1];
  l = me(l, t, n), l = me(l, o, a), f = me(f, e, s), f = me(f, i, c), r[0] = l, r[1] = f;
}
function me(r, t, e) {
  let n;
  return It(r, t, e) && (n = Math.abs(r - t) < Math.abs(r - e) ? t : e, r = n), r;
}
function Dr(r, t, e, n, s, o, i, a) {
  const c = Math.min(r, e, s, i), l = Math.max(r, e, s, i), f = Math.min(t, n, o, a), u = Math.max(t, n, o, a), h = u - f > l - c;
  let y = [];
  return (h ? Ft(t, f, u) : Ft(r, c, l)) && y.push(r, t), (h ? Ft(n, f, u) : Ft(e, c, l)) && y.push(e, n), (h ? Ft(o, f, u) : Ft(s, c, l)) && y.push(s, o), (h ? Ft(a, f, u) : Ft(i, c, l)) && y.push(i, a), (y.length != 2 && y.length != 4 || y.length == 4 && y[0] == y[2] && y[1] == y[3]) && (y = null), y;
}
function Fr(r, t, e, n, s, o, i, a) {
  return r == s && t == o || r == i && t == a || e == s && n == o || e == i && n == a;
}
function Ft(r, t, e) {
  return r > t && r < e;
}
function Pr(r, t) {
  Rr(r, t), qn(r, t, 0, t.length - 2);
}
function Rr(r, t) {
  for (let e = 0, n = t.length; e < n; e += 2)
    r[t[e]] > r[t[e + 1]] && $r(t, e, e + 1);
}
function $r(r, t, e) {
  const n = r[t];
  r[t] = r[e], r[e] = n;
}
function qn(r, t, e, n) {
  let s = e, o = n, i, a;
  for (; s < n; ) {
    for (i = r[t[e + n >> 2 << 1]]; s <= o; ) {
      for (; r[t[s]] < i; ) s += 2;
      for (; r[t[o]] > i; ) o -= 2;
      s <= o && (a = t[s], t[s] = t[o], t[o] = a, a = t[s + 1], t[s + 1] = t[o + 1], t[o + 1] = a, s += 2, o -= 2);
    }
    if (o - e < 40 ? kn(r, t, e, o) : qn(r, t, e, o), n - s < 40) {
      kn(r, t, s, n);
      return;
    }
    e = s, o = n;
  }
}
function kn(r, t, e, n) {
  let s, o;
  for (let i = e + 2; i <= n; i += 2) {
    s = t[i], o = t[i + 1];
    let a;
    for (a = i - 2; a >= e && r[s] < r[t[a]]; a -= 2)
      t[a + 2] = t[a], t[a + 3] = t[a + 1];
    t[a + 2] = s, t[a + 3] = o;
  }
}
function En(r, t, e, n, s) {
  const o = r[0], i = r[1];
  t = An(o, i, t[0], t[1], n, s), e = An(o, i, e[0], e[1], n, s);
  const a = t[0] < e[0] ? t : e, c = a == t ? e : t;
  return { x: o, y: i, a, b: c };
}
function An(r, t, e, n, s, o) {
  let i = e < n ? e : n, a = i === e ? n : e;
  return s[i] == r && o[i] == t ? a = i : s[a] == r && o[a] == t && (i = a), [i, a];
}
function Xr(r) {
  return `${r.a.join(",")};${r.b.join(",")}`;
}
class Yr {
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
function Lr(r, t, e, n) {
  let s = e | 0;
  const o = isNaN(n) ? r.length - s : n + s;
  let i, a, c, l, f, u;
  if (o > 0)
    c = f = r[s], l = u = t[s];
  else return [void 0, void 0, void 0, void 0];
  for (s++; s < o; s++)
    i = r[s], a = t[s], i < c && (c = i), i > f && (f = i), a < l && (l = a), a > u && (u = a);
  return [c, l, f, u];
}
class ie {
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
    return new ie(
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
    let o, i, a, c;
    if (arguments.length == 1)
      if (ne(t)) {
        const l = t;
        o = l[0], i = l[1], a = l[2], c = l[3];
      } else {
        const l = t;
        o = l.xmin, i = l.ymin, a = l.xmax, c = l.ymax;
      }
    else
      o = t, i = e, a = n, c = s;
    return this.xmin = o, this.ymin = i, this.xmax = a, this.ymax = c, (o > a || i > c) && this.update(), this;
  }
  update() {
    let t;
    this.xmin > this.xmax && (t = this.xmin, this.xmin = this.xmax, this.xmax = t), this.ymin > this.ymax && (t = this.ymin, this.ymin = this.ymax, this.ymax = t);
  }
  mergeBounds(t, ...e) {
    let n, s, o, i;
    return t instanceof ie ? (n = t.xmin, s = t.ymin, o = t.xmax, i = t.ymax) : e.length == 3 ? (n = t, s = e[0], o = e[1], i = e[2]) : t.length == 4 ? (n = t[0], s = t[1], o = t[2], i = t[3]) : Yt("Bounds#mergeBounds() invalid argument:", t), this.xmin === void 0 ? this.setBounds(n, s, o, i) : (n < this.xmin && (this.xmin = n), s < this.ymin && (this.ymin = s), o > this.xmax && (this.xmax = o), i > this.ymax && (this.ymax = i)), this;
  }
}
function xe(r) {
  const t = ["a", "b", "c"].map(
    (e) => r.properties[e].index
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
function jn(r, t, e) {
  const n = xe(t.forw), s = xe(t.bakw);
  if (JSON.stringify(n) != JSON.stringify(s))
    throw `${JSON.stringify(t, null, 2)}
${JSON.stringify(
      n
    )}
${JSON.stringify(s)}`;
  for (let o = 0; o < n.length; o++) {
    const i = n[o];
    r[i] || (r[i] = []), r[i].push(t);
  }
  e && (e.forw.features.push(t.forw), e.bakw.features.push(t.bakw));
}
function In(r, t, e) {
  const n = xe(t.forw), s = xe(t.bakw);
  if (JSON.stringify(n) != JSON.stringify(s))
    throw `${JSON.stringify(t, null, 2)}
${JSON.stringify(n)}
${JSON.stringify(s)}`;
  if (n.forEach((o) => {
    const i = r[o];
    if (!i) return;
    const a = i.filter((c) => c !== t);
    a.length === 0 ? delete r[o] : r[o] = a;
  }), e) {
    const o = (i, a) => {
      !i || !a || (i.features = i.features.filter((c) => c !== a));
    };
    o(e.forw, t.forw), o(e.bakw, t.bakw);
  }
}
function we(r, t = 1e-6) {
  const [e, n] = r[0], [s, o] = r[1], [i, a] = r[2];
  return Math.abs((s - e) * (a - n) - (i - e) * (o - n)) < t;
}
function Ur(r, t) {
  const e = /* @__PURE__ */ new Set();
  return r.forEach((n) => {
    if (n.length !== 2) return;
    const s = n.map((o) => `${t?.[o] ?? o}`);
    e.add(s.sort().join("-"));
  }), e;
}
function Zt(r) {
  return ["a", "b", "c"].map((t, e) => ({
    prop: r.properties[t],
    geom: r.geometry.coordinates[0][e]
  }));
}
const qr = 10;
function jr(r, t, e, n, s, o) {
  if (!r && !t) return !1;
  const i = r ? 0 : 1, a = 1 - i, c = e[i], l = e[a];
  if (!c || !l) return !1;
  const f = bt(l.geom);
  let u = !1, h = !1;
  for (let y = 0; y <= 1; y++) {
    const m = n[y];
    if (!m) continue;
    const p = [String(m.prop.index), String(c.prop.index)].sort().join("-"), _ = s[p];
    if (!_ || _.length < 2) continue;
    const I = _.find(
      (T) => T.bakw !== o[i].bakw
    );
    if (!I) continue;
    const w = Zt(I.bakw).find(
      (T) => String(T.prop.index) !== String(m.prop.index) && String(T.prop.index) !== String(c.prop.index)
    );
    if (!w) continue;
    u = !0;
    const d = bt(w.geom), b = bt(m.geom), S = bt(c.geom), A = S[0] - b[0], k = S[1] - b[1], E = A * (f[1] - b[1]) - k * (f[0] - b[0]), O = A * (d[1] - b[1]) - k * (d[0] - b[0]);
    if (E * O > 0) {
      h = !0;
      break;
    }
  }
  return u && !h;
}
function Vr(r, t, e, n) {
  if (!r && !t) return !1;
  if (e[0] && e[1] && n[0] && n[1]) {
    const s = n.map((f) => bt(f.geom)), o = e.map((f) => bt(f.geom)), i = s[1][0] - s[0][0], a = s[1][1] - s[0][1], c = i * (o[0][1] - s[0][1]) - a * (o[0][0] - s[0][0]), l = i * (o[1][1] - s[0][1]) - a * (o[1][0] - s[0][0]);
    return c * l < 0;
  }
  return !1;
}
function zr(r, t, e, n) {
  const s = Ur(e, n), o = /* @__PURE__ */ new Set();
  let i = !1;
  for (let a = 0; a < qr; a++) {
    let c = !1;
    for (const l of Object.keys(t)) {
      if (o.has(l)) continue;
      o.add(l);
      const f = t[l];
      if (!f || f.length < 2) continue;
      const u = l.split("-");
      if (u.length !== 2 || s.has(l)) continue;
      const h = Zt(f[0].bakw), y = Zt(f[1].bakw), m = Zt(f[0].forw), p = Zt(f[1].forw), _ = u.map(
        (v) => h.find((C) => `${C.prop.index}` === v) || y.find((C) => `${C.prop.index}` === v)
      ), I = u.map(
        (v) => m.find((C) => `${C.prop.index}` === v) || p.find((C) => `${C.prop.index}` === v)
      );
      if (_.some((v) => !v) || I.some((v) => !v))
        continue;
      const g = [h, y].map(
        (v) => v.find((C) => !u.includes(`${C.prop.index}`))
      ), w = [m, p].map(
        (v) => v.find((C) => !u.includes(`${C.prop.index}`))
      );
      if (g.some((v) => !v) || w.some((v) => !v))
        continue;
      const d = f[0].bakw.geometry.coordinates[0].slice(0, 3).map((v) => bt(v)), b = f[1].bakw.geometry.coordinates[0].slice(0, 3).map((v) => bt(v)), S = f[0].forw.geometry.coordinates[0].slice(0, 3).map((v) => bt(v)), A = f[1].forw.geometry.coordinates[0].slice(0, 3).map((v) => bt(v)), k = we(d), E = we(b), O = we(S), T = we(A), P = jr(
        k,
        E,
        g,
        _,
        t,
        f
      ), F = Vr(
        O,
        T,
        g,
        _
      );
      if (!(P || F || Bn(
        bt(g[0].geom),
        b
      ) || Bn(
        bt(g[1].geom),
        d
      )))
        continue;
      const B = I.map(
        (v) => bt(v.geom)
      ), M = w.map(
        (v) => bt(v.geom)
      ), N = Gr([
        ...B,
        ...M
      ]), D = Kr(N), R = Tn(
        B[0],
        B[1],
        M[0]
      ) + Tn(
        B[0],
        B[1],
        M[1]
      );
      $e(D, R) && (In(t, f[0], r), In(t, f[1], r), _.forEach((v) => {
        if (!v) return;
        const C = [
          v.geom,
          g[0].geom,
          g[1].geom,
          v.geom
        ], $ = {
          a: v.prop,
          b: g[0].prop,
          c: g[1].prop
        }, X = re([C], $), Y = Pn(X);
        jn(t, {
          forw: Y,
          bakw: X
        }, r);
      }), c = !0, i = !0);
    }
    if (!c) break;
  }
  return i;
}
function bt(r) {
  return [r[0], r[1]];
}
function Bn(r, t) {
  const [e, n] = t[0], [s, o] = t[1], [i, a] = t[2], c = i - e, l = a - n, f = s - e, u = o - n, h = r[0] - e, y = r[1] - n, m = c * c + l * l, p = c * f + l * u, _ = c * h + l * y, I = f * f + u * u, g = f * h + u * y, w = m * I - p * p;
  if (w === 0) return !1;
  const d = 1 / w, b = (I * _ - p * g) * d, S = (m * g - p * _) * d, A = 1e-9;
  return b >= -A && S >= -A && b + S <= 1 + A;
}
function Gr(r) {
  const t = r.map((i) => i.slice()).filter(
    (i, a, c) => c.findIndex(
      (l) => $e(l[0], i[0]) && $e(l[1], i[1])
    ) === a
  );
  if (t.length <= 1) return t;
  const e = t.sort(
    (i, a) => i[0] === a[0] ? i[1] - a[1] : i[0] - a[0]
  ), n = (i, a, c) => (a[0] - i[0]) * (c[1] - i[1]) - (a[1] - i[1]) * (c[0] - i[0]), s = [];
  for (const i of e) {
    for (; s.length >= 2 && n(
      s[s.length - 2],
      s[s.length - 1],
      i
    ) <= 0; )
      s.pop();
    s.push(i);
  }
  const o = [];
  for (let i = e.length - 1; i >= 0; i--) {
    const a = e[i];
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
function Kr(r) {
  if (r.length < 3) return 0;
  let t = 0;
  for (let e = 0; e < r.length; e++) {
    const [n, s] = r[e], [o, i] = r[(e + 1) % r.length];
    t += n * i - o * s;
  }
  return Math.abs(t) / 2;
}
function Tn(r, t, e) {
  return Math.abs(
    (r[0] * (t[1] - e[1]) + t[0] * (e[1] - r[1]) + e[0] * (r[1] - t[1])) / 2
  );
}
function $e(r, t, e = 1e-9) {
  return Math.abs(r - t) <= e;
}
const Wr = (r) => typeof r == "string" && r.startsWith("b");
function Hr(r, t) {
  const e = (n, s) => {
    for (let o = 0; o < 3; o++) {
      const i = n.g[o], a = n.g[(o + 1) % 3];
      if (s.g.every((c) => n.sign * at(i[0], i[1], a[0], a[1], c[0], c[1]) <= 0)) return !0;
    }
    return !1;
  };
  return !e(r, t) && !e(t, r);
}
function Jr(r, t, e) {
  if (t.length === 0) return [];
  const n = r.features.map((p) => {
    const { a: _, b: I, c: g } = p.properties, w = [_.geom, I.geom, g.geom], [d, b, S] = p.geometry.coordinates[0], A = w.map(([T]) => T), k = w.map(([, T]) => T), E = Math.sign(at(d[0], d[1], b[0], b[1], S[0], S[1])), O = Math.sign(at(w[0][0], w[0][1], w[1][0], w[1][1], w[2][0], w[2][1]));
    return {
      ids: [_.index, I.index, g.index].map(String),
      g: w,
      sign: O,
      ratio: E * O,
      aux: [_.index, I.index, g.index].some(Wr),
      minx: Math.min(...A),
      maxx: Math.max(...A),
      miny: Math.min(...k),
      maxy: Math.max(...k)
    };
  }), s = n.map((p) => p.ratio), o = s.reduce((p, _) => p + _, 0) < 0 ? -1 : 1, i = (p, _) => p < _ ? `${p}|${_}` : `${_}|${p}`, a = /* @__PURE__ */ new Map();
  n.forEach((p, _) => {
    for (let I = 0; I < 3; I++) {
      const g = i(p.ids[I], p.ids[(I + 1) % 3]), w = a.get(g);
      w ? w.push(_) : a.set(g, [_]);
    }
  });
  const c = ([p, _]) => i(String(e[p]), String(e[_])), l = /* @__PURE__ */ new Set();
  for (const p of t) for (const _ of a.get(c(p)) ?? []) l.add(_);
  const f = (p) => n[p].aux || l.has(p), u = /* @__PURE__ */ new Set();
  n.forEach((p, _) => {
    f(_) && (s[_] === 0 || s[_] !== o) && u.add(_);
  });
  const h = n.map((p, _) => _).sort((p, _) => n[p].minx - n[_].minx);
  for (let p = 0; p < h.length; p++) {
    const _ = n[h[p]];
    if (_.sign !== 0)
      for (let I = p + 1; I < h.length; I++) {
        const g = n[h[I]];
        if (g.minx >= _.maxx) break;
        g.sign === 0 || g.miny >= _.maxy || _.miny >= g.maxy || !f(h[p]) && !f(h[I]) || Hr(_, g) && (u.add(h[p]), u.add(h[I]));
      }
  }
  if (u.size === 0) return [];
  const y = t.filter((p) => (a.get(c(p)) ?? []).some((_) => u.has(_)));
  if (y.length > 0) return y;
  const m = /* @__PURE__ */ new Set();
  for (const p of u) for (const _ of n[p].ids) _.startsWith("b") || m.add(_);
  return t.filter(
    ([p, _]) => m.has(String(e[p])) || m.has(String(e[_]))
  );
}
const Qr = 4, On = 32, Zr = 1, ts = 0.4, Vn = 4, es = 1e-4, zn = 0.25, ns = 0.01, Pt = (r, t) => String(r) < String(t) ? `${r}|${t}` : `${t}|${r}`;
function Fe(r, t, e) {
  const n = t.filter((l) => !String(l.properties.target.index).startsWith("b")).map((l) => ({
    id: l.properties.target.index,
    paper: l.geometry.coordinates,
    geo: l.properties.target.geom
  })), s = /* @__PURE__ */ new Set();
  let o = 0, i = 0;
  const a = r.features.map((l) => {
    const { a: f, b: u, c: h } = l.properties, [y, m, p] = l.geometry.coordinates[0];
    s.add(Pt(f.index, u.index)), s.add(Pt(f.index, h.index)), s.add(Pt(u.index, h.index));
    const _ = Math.sign(at(y[0], y[1], m[0], m[1], p[0], p[1])) * Math.sign(at(f.geom[0], f.geom[1], u.geom[0], u.geom[1], h.geom[0], h.geom[1]));
    return _ > 0 ? o++ : _ < 0 && i++, {
      ids: [String(f.index), String(u.index), String(h.index)],
      paper: [y, m, p],
      geo: [f.geom, u.geom, h.geom],
      sign: _
    };
  }), c = e.filter(([l, f]) => !s.has(Pt(n[l].id, n[f].id)));
  return { points: n, triangles: a, majority: o >= i ? 1 : -1, hullEdges: e, dropped: c };
}
function Gn(r) {
  return [r.foot[0] + r.height * r.normal[0], r.foot[1] + r.height * r.normal[1]];
}
function is(r, [t, e], { lambda: n = zn, epsilon: s = es } = {}) {
  const { points: o, majority: i } = r, a = o[t], c = o[e], l = o.reduce((M, N) => M + N.paper[0], 0) / o.length, f = o.reduce((M, N) => M + N.paper[1], 0) / o.length, u = Math.sign(at(a.paper[0], a.paper[1], c.paper[0], c.paper[1], l, f));
  if (u === 0) return;
  const h = u * i, y = [c.paper[0] - a.paper[0], c.paper[1] - a.paper[1]], m = [c.geo[0] - a.geo[0], c.geo[1] - a.geo[1]], p = Math.hypot(y[0], y[1]), _ = Math.hypot(m[0], m[1]);
  if (!(p > 0 && _ > 0)) return;
  const I = [];
  for (const M of o) {
    if (M === a || M === c) continue;
    const N = at(a.geo[0], a.geo[1], c.geo[0], c.geo[1], M.geo[0], M.geo[1]);
    if (N * h >= 0) continue;
    const D = ((M.geo[0] - a.geo[0]) * m[0] + (M.geo[1] - a.geo[1]) * m[1]) / (_ * _), R = ((M.paper[0] - a.paper[0]) * y[0] + (M.paper[1] - a.paper[1]) * y[1]) / (p * p);
    D > 0 && D < 1 && R > 0 && R < 1 && I.push({ id: M.id, u: D, t: R, d: Math.abs(N) / _ });
  }
  const g = I.length > 0;
  g || I.push({ u: 0.5, t: 0.5, d: 0 });
  const w = I.reduce((M, N) => N.d > M.d ? N : M);
  let d = 0;
  for (const M of I)
    d = Math.max(d, M.u <= w.u ? M.d * w.u / M.u : M.d * (1 - w.u) / (1 - M.u));
  d *= 1 + n;
  const b = [-y[1] / p * u, y[0] / p * u], S = [-m[1] / _ * h, m[0] / _ * h], A = (M) => [
    a.paper[0] + M * y[0] + s * p * b[0],
    a.paper[1] + M * y[1] + s * p * b[1]
  ], k = (M, N, D, R) => ({
    paper: A(M),
    foot: [a.geo[0] + N * m[0], a.geo[1] + N * m[1]],
    normal: S,
    height: D,
    chord: _,
    protrusion: w.d,
    ...R === void 0 ? {} : { anchor: R }
  }), E = [k(w.t, w.u, d, g ? w.id : void 0)], O = [...I].sort((M, N) => M.u - N.u), T = [{ u: 0, d: 0 }], P = (M, N, D) => (N.u - M.u) * (D.d - M.d) - (N.d - M.d) * (D.u - M.u);
  for (const M of [...O, { u: 1, d: 0 }]) {
    for (; T.length >= 2 && P(T[T.length - 2], T[T.length - 1], M) >= 0; ) T.pop();
    T.push(M);
  }
  const F = n * w.d, x = [];
  let B = 0;
  for (const M of T.slice(1, -1))
    M.t === void 0 || !(M.t > B) || (B = M.t, x.push(k(M.t, M.u, M.d + F, g ? M.id : void 0)));
  return {
    edge: [a.id, c.id],
    variants: g && x.length > 1 ? [E, x] : [E]
  };
}
function rs(r, t, e, { lambda: n = zn, mu: s = ns, maxIterations: o = Vn } = {}) {
  let i = r.map((a, c) => ({ ray: { ...a }, index: c }));
  for (let a = 0; a < o && i.length > 0; a++) {
    const c = e(i.map(({ ray: u }) => [u.paper, Gn(u)]));
    if (!c) return;
    let l = !1;
    const f = /* @__PURE__ */ new Set();
    for (const [u, { ray: h }] of i.entries()) {
      const y = `e${t + u}`;
      let m = -1 / 0, p = 1 / 0, _ = 0;
      for (const d of c.triangles) {
        const b = d.ids.indexOf(y);
        if (b < 0) continue;
        d.sign !== c.majority && _++;
        const S = d.geo[(b + 1) % 3], A = d.geo[(b + 2) % 3], k = Math.sign(
          at(
            d.paper[b][0],
            d.paper[b][1],
            d.paper[(b + 1) % 3][0],
            d.paper[(b + 1) % 3][1],
            d.paper[(b + 2) % 3][0],
            d.paper[(b + 2) % 3][1]
          )
        ), E = at(h.foot[0], h.foot[1], S[0], S[1], A[0], A[1]), O = at(h.foot[0] + h.normal[0], h.foot[1] + h.normal[1], S[0], S[1], A[0], A[1]) - E, T = k * c.majority;
        if (O === 0) {
          E * T <= 0 && (m = 1 / 0);
          continue;
        }
        const P = -E / O;
        O * T > 0 ? m = Math.max(m, P) : p = Math.min(p, P);
      }
      if (!(m < p)) {
        f.add(u);
        continue;
      }
      const I = Math.min(Math.max(n * Math.max(m, h.protrusion), s * h.chord), (p - m) / 2), g = Math.max(m, 0) + I, w = Math.abs(g - h.height) > 1e-9 * h.chord;
      (_ > 0 || w) && (w && (l = !0), h.height = g);
    }
    if (f.size > 0 && (i = i.filter((u, h) => !f.has(h)), l = !0), !l) break;
  }
  if (i.length !== 0)
    return { rays: i.map(({ ray: a }) => a), kept: i.map(({ index: a }) => a) };
}
function ss(r, t) {
  const e = (i) => typeof i == "string" && i.startsWith("e") && Number(i.slice(1)) >= t ? Number(i.slice(1)) : void 0, n = /* @__PURE__ */ new Set();
  for (const { ids: i } of r.triangles)
    n.add(Pt(i[0], i[1])), n.add(Pt(i[0], i[2])), n.add(Pt(i[1], i[2]));
  const s = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set();
  for (const [i, a] of r.hullEdges) {
    const c = n.has(Pt(r.points[i].id, r.points[a].id));
    for (const l of [i, a]) {
      const f = e(r.points[l].id);
      f !== void 0 && (o.add(f), c || s.add(f));
    }
  }
  for (const i of r.points) {
    const a = e(i.id);
    a !== void 0 && !o.has(a) && s.add(a);
  }
  return s;
}
function os(r, t) {
  const e = { rounds: 0, builds: 0, cost: 0, budget: 0, batches: 0, perEdge: 0, multiPoint: 0 };
  let n = [], s = [], o = t, i = r.snapshot();
  const a = /* @__PURE__ */ new Set(), c = Zr * r.baseCost;
  e.budget = c;
  const l = r.buildCost();
  let f = 0;
  const u = () => f * ts + r.buildCost() - l, h = () => u() >= c, y = (g) => {
    if (!h())
      return e.builds++, f++, r.measure(g);
  }, m = (g) => [g.paper, Gn(g)], p = (g, w, d) => {
    const b = rs(
      g.map(({ ray: S }) => S),
      w,
      (S) => y([...n, ...S]),
      { maxIterations: d }
    );
    return b?.rays.map((S, A) => ({ ray: S, edge: g[b.kept[A]].edge }));
  }, _ = (g, w) => g.length === w.length && g.every(({ ray: d }, b) => Math.abs(d.height - w[b].ray.height) <= 1e-9 * d.chord), I = (g) => {
    if (g.length === 0 || n.length + g.length > On) return !1;
    const w = r.edgeBase + n.length;
    let d = p(g, w, 1), b = !1;
    for (; d && d.length > 0 && !h(); ) {
      const S = [...n, ...d.map(({ ray: O }) => m(O))];
      e.builds++;
      const A = r.build(S, Math.max(1, Math.ceil(c - u()))), k = A ? ss(A.analysis, w) : void 0;
      if (A && k.size === 0)
        return s = s.concat(
          d.map(({ ray: O, edge: T }, P) => ({
            node: w + P,
            kind: "hullEdge",
            edge: T,
            ...O.anchor === void 0 ? {} : { anchor: O.anchor }
          }))
        ), n = S, o = A, i = r.snapshot(), !0;
      if (r.restore(i), A && k.size < d.length) {
        d = d.filter((O, T) => !k.has(w + T));
        continue;
      }
      if (b) return !1;
      b = !0;
      const E = p(d, w, Vn);
      if (!E || _(E, d)) return !1;
      d = E;
    }
    return !1;
  };
  for (let g = 1; g <= Qr && !h(); g++) {
    const { analysis: w } = o, d = [];
    for (const S of w.dropped) {
      const A = S.map((E) => w.points[E].paper.join(",")).join("|");
      if (a.has(A) || (a.add(A), n.length + d.length + 1 > On)) continue;
      const k = is(w, S);
      k && d.push(k);
    }
    if (d.length === 0) break;
    e.rounds = g;
    const b = (S, A) => A.map((k) => ({ ray: k, edge: S.edge }));
    if (I(d.flatMap((S) => b(S, S.variants[0])))) {
      e.batches++;
      continue;
    }
    for (const S of d)
      for (const [A, k] of S.variants.entries()) {
        if (h()) break;
        if (I(b(S, k))) {
          e.perEdge++, A > 0 && e.multiPoint++;
          break;
        }
      }
  }
  return r.restore(i), e.cost = u(), { pairs: n, records: s, result: o.result, diagnostics: e };
}
const Nn = 2.00704, Cn = 3.00001, as = 12, cs = 4, Dn = 1, ls = 3, Fn = /* @__PURE__ */ Symbol("supplement pairs out of budget"), us = 24;
class nt extends Qn {
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
    if (super(), t.bounds ? this.setBounds(t.bounds) : (this.setWh(t.wh), this.vertexMode = t.vertexMode || nt.VERTEX_PLAIN), this.strictMode = t.strictMode || nt.MODE_AUTO, this.yaxisMode = t.yaxisMode || nt.YAXIS_INVERT, this.importance = t.importance || 0, this.priority = t.priority || 0, this.stateFull = t.stateFull || !1, this.useV2Algorithm = t.useV2Algorithm ?? !1, this.useSupplementPairs = t.supplementPairs ?? !0, t.outerTransform === "worldFile") {
      if (this.useV2Algorithm) throw new Error("V2 では world file 外周を使えません");
      if (!t.worldFile) throw new Error("worldFile が必要です");
      Zn(t.worldFile), this.requestedWorldFile = { ...t.worldFile };
    }
    t.points && this.setPoints(t.points), t.edges && this.setEdges(t.edges);
  }
  /**
   * フォーマットバージョンを取得します
   */
  getFormatVersion() {
    return this.useV2Algorithm ? Nn : Cn;
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
    this.edges = ti(t), this.edgeNodes = void 0, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 境界ポリゴンを設定します
   */
  setBounds(t) {
    this.bounds = t;
    let e = t[0][0], n = e, s = t[0][1], o = s;
    const i = [t[0]];
    for (let a = 1; a < t.length; a++) {
      const c = t[a];
      c[0] < e && (e = c[0]), c[0] > n && (n = c[0]), c[1] < s && (s = c[1]), c[1] > o && (o = c[1]), i.push(c);
    }
    i.push(t[0]), this.boundsPolygon = re([i]), this.xy = [e, s], this.wh = [n - e, o - s], this.vertexMode = nt.VERTEX_PLAIN, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 現在の設定を永続化可能な形式にコンパイルします
   */
  getCompiled() {
    const t = {};
    if (t.version = this.useV2Algorithm ? Nn : Cn, t.points = this.points, t.weight_buffer = {}, this.compiledOuter?.outerTransform === "worldFile")
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
          const s = e[n].features[0], o = s.geometry.coordinates[0][1], i = s.properties.b.geom;
          t.vertices_points[n] = [o, i];
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
    super.setCompiled(t), this.supplementRecords = (t.supplementPairs ?? []).map((s) => ({
      ...s,
      edge: [...s.edge]
    })), this.lastSupplementDiagnostics = void 0, n && (this.stateTriangle = void 0), this.requestedWorldFile = void 0, this.compiledOuter = void 0, e?.outerTransform === "worldFile" ? (this.requestedWorldFile = { ...e.worldFile }, this.compiledOuter = {
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
  calculateStrictTin(t = _n) {
    this.resolveStrictOverlaps(), this.detectStrictKinks(t);
  }
  /**
   * 順三角網から逆三角網を写し、重なりを辺の反転で解消する（`calculateStrictTin` の前半）。
   * 交差の判定（`strict_status`・`kinks`）はしない。補完点の置き場所を測る試行は、三角網の向きを読むだけなので
   * これだけを呼ぶ。
   */
  resolveStrictOverlaps() {
    const t = this.tins.forw.features.map(
      (s) => Pn(s)
    );
    this.tins.bakw = xt(t);
    const e = {};
    this.tins.forw.features.forEach((s, o) => {
      const i = this.tins.bakw.features[o];
      jn(e, { forw: s, bakw: i });
    });
    const n = (this.pointsSet?.forw.features ?? []).map(
      (s) => s.properties.target.index
    );
    zr(
      this.tins,
      e,
      this.pointsSet?.edges || [],
      n
    );
  }
  /** `calculateStrictTin` の後半: 両面の交差を数え、`strict_status` と `kinks` を決める。 */
  detectStrictKinks(t) {
    const e = ["forw", "bakw"].map((n) => {
      const s = this.tins[n].features.map(
        (o) => o.geometry.coordinates[0]
      );
      return Ln(s, t);
    });
    e[0].length === 0 && e[1].length === 0 ? (this.strict_status = nt.STATUS_STRICT, delete this.kinks) : (this.strict_status = nt.STATUS_ERROR, this.kinks = {
      forw: xt(e[0]),
      bakw: xt(e[1])
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
      const o = this.points[s][0], i = this.points[s][1], a = jt(o, i, s);
      t.forw.push(a), t.bakw.push(Vt(a));
    }
    const e = [];
    let n = 0;
    this.edgeNodes = [], this.edges || (this.edges = []);
    for (let s = 0; s < this.edges.length; s++) {
      const o = this.edges[s][2], i = Object.assign([], this.edges[s][0]), a = Object.assign([], this.edges[s][1]);
      if (fs(o, this.points.length, s), i.length === 0 && a.length === 0) {
        e.push(o);
        continue;
      }
      i.unshift(this.points[o[0]][0]), i.push(this.points[o[1]][0]), a.unshift(this.points[o[0]][1]), a.push(this.points[o[1]][1]);
      const c = [i, a].map((l) => {
        const f = l.map((h, y, m) => {
          if (y === 0) return 0;
          const p = m[y - 1];
          return Math.sqrt(
            Math.pow(h[0] - p[0], 2) + Math.pow(h[1] - p[1], 2)
          );
        }), u = f.reduce((h, y, m) => m === 0 ? [0] : (h.push(h[m - 1] + y), h), []);
        return u.map((h, y, m) => {
          const p = h / m[m.length - 1];
          return [l[y], f[y], u[y], p];
        });
      });
      c.map((l, f) => {
        const u = c[f ? 0 : 1];
        return l.filter((h, y) => !(y === 0 || y === l.length - 1 || h[4] === "handled")).flatMap((h) => {
          const y = h[0], m = h[3], p = u.reduce(
            (_, I, g, w) => {
              if (_) return _;
              const d = w[g + 1];
              if (I[3] === m)
                return I[4] = "handled", [I];
              if (I[3] < m && d && d[3] > m)
                return [I, d];
            },
            void 0
          );
          if (p && p.length === 1)
            return f === 0 ? [[y, p[0][0], m]] : [[p[0][0], y, m]];
          if (p && p.length === 2) {
            const _ = p[0], I = p[1], g = (m - _[3]) / (I[3] - _[3]), w = [
              (I[0][0] - _[0][0]) * g + _[0][0],
              (I[0][1] - _[0][1]) * g + _[0][1]
            ];
            return f === 0 ? [[y, w, m]] : [[w, y, m]];
          }
          return [];
        });
      }).reduce((l, f) => l.concat(f), []).sort((l, f) => l[2] < f[2] ? -1 : 1).map((l, f, u) => {
        this.edgeNodes[n] = [
          l[0],
          l[1]
        ];
        const h = jt(
          l[0],
          l[1],
          `e${n}`
        );
        n++, t.forw.push(h), t.bakw.push(Vt(h)), f === 0 ? e.push([o[0], t.forw.length - 1]) : e.push([
          t.forw.length - 2,
          t.forw.length - 1
        ]), f === u.length - 1 && e.push([t.forw.length - 1, o[1]]);
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
    if (!this.points.reduce((c, l) => c && (o ? Je(l[0], o) : l[0][0] >= t && l[0][0] <= e && l[0][1] >= n && l[0][1] <= s), !0))
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
      const i = o[0][0], a = o[0][1];
      i < t && (t = i), i > e && (e = i), a < n && (n = a), a > s && (s = a);
    }
    return { minx: t, maxx: e, miny: n, maxy: s };
  }
  /**
   * TINネットワークを同期的に更新し、座標変換の準備を行います。
   * 重めの計算を伴うため、呼び出し側が非同期制御を行いたい場合は
   * {@link updateTinAsync} を利用してください。
   */
  updateTin() {
    this.lastBoundaryDiagnostics = void 0, this.supplementRecords = [], this.attemptTotal = 0, this.lastSupplementDiagnostics = void 0;
    let t = this.strictMode;
    t !== nt.MODE_STRICT && t !== nt.MODE_LOOSE && (t = nt.MODE_AUTO);
    const e = !this.useV2Algorithm, n = this.requestedWorldFile;
    if (n && !e) throw new Error("V2 では world file 外周を使えません");
    let s, o, i, a, c;
    if (e) {
      if (this.bounds) {
        const F = this.boundsPolygon;
        if (!F) throw new Error("Internal error: bounds is set but boundsPolygon is missing");
        if (!this.points.every(
          (B) => Je(B[0], F)
        )) throw "SOME POINTS OUTSIDE";
      }
      s = this.generatePointsSet(), { minx: o, maxx: i, miny: a, maxy: c } = this.computeGcpBbox();
    } else {
      const F = this.validateAndPrepareInputs();
      s = F.pointsSet, o = F.minx, i = F.maxx, a = F.miny, c = F.maxy;
    }
    const l = {
      forw: xt([...s.forw]),
      bakw: xt([...s.bakw])
    }, f = pe(
      l.forw,
      s.edges,
      "target"
    ), u = pe(
      l.bakw,
      s.edges,
      "target"
    );
    if (f.features.length === 0 || u.features.length === 0)
      throw "TOO LINEAR1";
    const h = Ni(l.forw), y = fn(l.forw);
    if (!y) throw "TOO LINEAR2";
    const m = {}, p = y.geometry.coordinates[0];
    let _;
    try {
      _ = p.map((F) => ({
        forw: F,
        bakw: Me(Lt(F), f)
      })), _.forEach((F) => {
        m[`${F.forw[0]}:${F.forw[1]}`] = F;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const I = fn(l.bakw);
    if (!I) throw "TOO LINEAR2";
    const g = I.geometry.coordinates[0];
    try {
      _ = g.map((F) => ({
        bakw: F,
        forw: Me(Lt(F), u)
      })), _.forEach((F) => {
        m[`${F.forw[0]}:${F.forw[1]}`] = F;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const w = {
      forw: h.geometry.coordinates,
      bakw: Me(h, f)
    }, d = jt(w.forw, w.bakw, "c");
    this.centroid = {
      forw: d,
      bakw: Vt(d)
    };
    const b = [
      ...this.points.map((F) => ({ forw: F[0], bakw: F[1] })),
      ...(this.edgeNodes ?? []).map((F) => ({ forw: F[0], bakw: F[1] }))
    ], S = {
      convexBuf: m,
      centroid: w,
      allGcps: b,
      minx: o,
      maxx: i,
      miny: a,
      maxy: c
    }, A = t === nt.MODE_STRICT || t === nt.MODE_AUTO, k = (F, x) => {
      if (!A || this.isStrict()) return { result: F };
      const B = {
        build: this.captureBuild(),
        supplementRecords: this.supplementRecords,
        supplementDiagnostics: this.lastSupplementDiagnostics,
        rawCount: s.forw.length,
        gcpCount: b.length,
        edgeNodeCount: this.edgeNodes.length
      }, M = () => {
        s.forw.length = B.rawCount, s.bakw.length = B.rawCount, b.length = B.gcpCount, this.edgeNodes.length = B.edgeNodeCount, this.restoreBuild(B.build), this.supplementRecords = B.supplementRecords, this.lastSupplementDiagnostics = B.supplementDiagnostics;
      }, N = this.attemptTotal, D = this.attemptTotal, R = /* @__PURE__ */ new Set();
      let v = F;
      try {
        for (let C = 0; C < cs && v.boundary && !(this.attemptTotal - D >= ls * N); C++) {
          const $ = v.boundary.vertices.map(({ forw: G }) => G), X = $.map(([G]) => G), Y = $.map(([, G]) => G), [L, j, q, W] = [Math.min(...X), Math.max(...X), Math.min(...Y), Math.max(...Y)], K = R.size;
          for (const G of wr(this.tins.forw)) {
            if ((G[0] === L || G[0] === j) && (G[1] === q || G[1] === W)) continue;
            const Q = hr(G, w.forw);
            for (let J = -Dn; J <= Dn; J++) R.add((Q + J + 36) % 36);
          }
          if (R.size === K) break;
          if (v = x({ skipBins: new Set(R) }), v.boundary && this.isStrict()) return { result: v, kind: "thinned" };
        }
        if (v = x({ cornersOnly: !0 }), v.boundary && this.isStrict()) return { result: v, kind: "corners" };
      } catch {
      }
      return M(), { result: F };
    };
    if (n) {
      this.stateTriangle = void 0;
      const F = this.yaxisMode === nt.YAXIS_FOLLOW, x = F ? 1 : -1, B = (R) => this.buildWithSupplements(t, s, b, (v, C, $) => (X) => ({ boundary: vn(
        R ? { ...S, ring: R } : S,
        (Y) => gr(Y, (L) => {
          const [j, q] = ei(n, L);
          return [j, F ? -q : q];
        }),
        s,
        this.points.length,
        {
          orientation: x,
          accept: (Y) => Y.hasMapBoundary ? (this.buildTin(s, Y.vertices, C, Y, X.size > 0, $), (this.strict_status !== nt.STATUS_LOOSE || Y.hasBoundary) && be(this.tins.forw, x) === 0 && be(this.tins.bakw, x) === 0) : !1
        },
        X,
        v
      ) })), M = B(), { result: { boundary: N }, kind: D } = k(M, B);
      if (N) {
        this.compiledOuter = {
          outerTransform: "worldFile",
          worldFile: n,
          vertices_points: N.vertices.map(({ forw: X, bakw: Y }) => [X, Y])
        };
        const { centroid: R, xy: v, wh: C, kinks: $ } = this;
        super.setCompiled(this.getCompiled()), Object.assign(this, { centroid: R, xy: v, wh: C, kinks: $ }), this.lastBoundaryDiagnostics = {
          ...N.diagnostics,
          ...D ? { ringRescue: D } : {},
          requestedOuterTransform: "worldFile",
          outerTransform: "worldFile"
        };
        return;
      }
      this.compiledOuter = { outerTransform: "extrapolate" }, this.outerTransform = "extrapolate", this.worldFile = void 0;
    }
    const E = this.vertexMode === nt.VERTEX_BIRDEYE ? pr : dr;
    let O, T, P;
    if (e) {
      const F = (B) => this.buildWithSupplements(t, s, b, (M, N, D) => (R) => {
        const v = B ? { ...S, ring: B } : S, C = vn(
          v,
          E,
          s,
          this.points.length,
          void 0,
          R,
          M
        );
        return {
          boundary: C,
          verticesList: this.buildTin(
            s,
            C?.vertices ?? E(v, !1),
            N,
            C,
            R.size > 0,
            D
          )
        };
      }), x = k(F(), F);
      ({ boundary: O, verticesList: T } = x.result), P = x.kind;
    } else
      T = this.buildTin(
        s,
        E(S, !1),
        t,
        void 0
      );
    this.vertices_params = {
      forw: mn(T.forw, this.centroid.forw),
      bakw: mn(T.bakw, this.centroid.bakw)
    }, this.addIndexedTin(), this.pointsWeightBuffer = {}, this.lastBoundaryDiagnostics = O && P ? { ...O.diagnostics, ringRescue: P } : O?.diagnostics, n && this.lastBoundaryDiagnostics && (this.lastBoundaryDiagnostics = {
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
  buildWithSupplements(t, e, n, s) {
    let o = 0;
    const i = (S, A, k) => {
      const E = s(S, A, k);
      return (O) => (o++, this.attemptTotal++, E(O));
    }, a = (S) => this.buildWithHull(S, i(/* @__PURE__ */ new Map(), S, !1));
    if (!this.useSupplementPairs || this.useV2Algorithm || t === nt.MODE_LOOSE) return a(t);
    const c = t, l = a(c), f = o;
    let u = 0;
    if (!l.boundary || this.strict_status !== nt.STATUS_STRICT) return l;
    const h = Fe(this.tins.forw, this.pointsSet.forw.features, l.boundary.forwHull.all);
    if (h.dropped.length === 0) return l;
    const y = this.edgeNodes.length, m = e.forw.length, p = n.length;
    let _ = [], I;
    const g = (S, A) => S.length === A.length && S.every((k, E) => k.every((O, T) => O[0] === A[E][T][0] && O[1] === A[E][T][1])), w = (S) => {
      e.forw.length = m, e.bakw.length = m, n.length = p, this.edgeNodes.length = y;
      for (const [A, k] of S) {
        const E = jt(A, k, `e${this.edgeNodes.length}`);
        this.edgeNodes.push([A, k]), e.forw.push(E), e.bakw.push(Vt(E)), n.push({ forw: A, bakw: k });
      }
      _ = S;
    }, b = os({
      edgeBase: y,
      baseCost: f,
      buildCost: () => u,
      snapshot: () => ({ pairs: _, state: this.captureBuild() }),
      restore: ({ pairs: S, state: A }) => {
        w(S), this.restoreBuild(A);
      },
      measure: (S) => {
        w(S);
        const A = this.captureBuild();
        try {
          const k = /* @__PURE__ */ new Map();
          I = { pairs: S, cache: k };
          const { boundary: E } = s(k, nt.MODE_STRICT, !0)(/* @__PURE__ */ new Set());
          return E ? Fe(this.tins.forw, this.pointsSet.forw.features, []) : void 0;
        } finally {
          this.restoreBuild(A);
        }
      },
      build: (S, A) => {
        w(S);
        const k = I && g(I.pairs, S) ? I.cache : /* @__PURE__ */ new Map(), E = o;
        let O;
        try {
          O = this.buildWithHull(c, (T) => {
            if (o - E >= A) throw Fn;
            return i(k, c, !1)(T);
          });
        } catch (T) {
          if (T !== Fn) throw T;
          u += o - E;
          return;
        }
        if (u += o - E, !(!O.boundary || this.strict_status !== nt.STATUS_STRICT))
          return {
            result: O,
            analysis: Fe(this.tins.forw, this.pointsSet.forw.features, O.boundary.forwHull.all)
          };
      }
    }, { result: l, analysis: h });
    return this.supplementRecords = b.records, this.lastSupplementDiagnostics = b.diagnostics, b.result;
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
    const o = (p) => [...p].sort().join(","), i = (p, _ = !1) => {
      const I = o(p), g = n.get(I);
      if (g) return g;
      const w = e(p), d = {
        value: w,
        strict: w.boundary !== void 0 && this.strict_status === nt.STATUS_STRICT
      };
      return (d.strict || _) && (d.state = this.captureBuild()), n.set(I, d), s = d, d;
    }, a = (p) => (s !== p && this.restoreBuild(p.state), s = p, p.value), c = i(/* @__PURE__ */ new Set(), !0);
    if (!(t === nt.MODE_STRICT || t === nt.MODE_AUTO) || !c.value.boundary || c.strict) return c.value;
    const f = new Set(c.value.boundary.forwHull.all.map(ve)), u = () => this.pointsSet.forw.features.map(
      (p) => p.properties.target.index
    ), h = /* @__PURE__ */ new Set();
    let y = c, m;
    for (let p = 0; p < as; p++) {
      const _ = Jr(
        this.tins.forw,
        y.value.boundary.forwHull.applied,
        u()
      ).filter((I) => !h.has(ve(I)));
      if (_.length === 0) break;
      for (const I of _) h.add(ve(I));
      if (y = i(h), !y.value.boundary) break;
      if (y.strict) {
        m = y;
        break;
      }
    }
    if (m) {
      let p = m;
      for (const _ of [...h].slice(0, us)) {
        const I = new Set(h);
        I.delete(_);
        const g = i(I);
        g.strict && (h.delete(_), p = g);
      }
      return a(p);
    }
    if (h.size < f.size) {
      const p = i(f);
      if (p.strict) return a(p);
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
  buildTin(t, e, n, s, o = !1, i = !1) {
    const a = {
      forw: [],
      bakw: []
    };
    for (let c = 0; c < e.length; c++) {
      const l = e[c].forw, f = e[c].bakw, u = jt(l, f, `b${c}`), h = Vt(u);
      a.forw.push(u), a.bakw.push(h);
    }
    return this.pointsSet = {
      forw: xt([...t.forw, ...a.forw]),
      bakw: xt([...t.bakw, ...a.bakw]),
      edges: t.edges
    }, this.tins = {
      forw: Ve(
        s?.forw ?? pe(this.pointsSet.forw, t.edges, "target")
      )
    }, (n === nt.MODE_STRICT || n === nt.MODE_AUTO) && (i ? this.resolveStrictOverlaps() : this.calculateStrictTin(
      n === nt.MODE_AUTO || o ? 1 : _n
    )), (n === nt.MODE_LOOSE || n === nt.MODE_AUTO && this.strict_status === nt.STATUS_ERROR) && (this.tins.bakw = Ve(
      s?.bakw ?? pe(this.pointsSet.bakw, t.edges, "target")
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
function fs(r, t, e) {
  const n = (s) => Number.isInteger(s) && s >= 0 && s < t;
  if (!Array.isArray(r) || !n(r[0]) || !n(r[1]))
    throw new Error(
      `Invalid edge at edges[${e}]: start/end ${JSON.stringify(r)} must be integer indices of points (0 to ${t - 1})`
    );
}
export {
  nt as Tin,
  pe as constrainedTin,
  Vt as counterPoint,
  jt as createPoint,
  nt as default,
  ds as findIntersections,
  Nn as format_version,
  jn as insertSearchIndex,
  mn as vertexCalc
};
