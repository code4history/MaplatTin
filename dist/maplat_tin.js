import { counterTri as On, Transform as Vn, validateWorldFile as jn, normalizeEdges as Un, transformArr as _e, rotateVerticesTriangle as qe, worldFileToCrs as zn } from "@maplat/transform";
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
function Hn(i) {
  return i.type === "Feature" ? i.geometry : i;
}
function Pe(i, t, e) {
  if (i !== null)
    for (var n, s, o, r, a, l, c, h = 0, f = 0, p, y = i.type, b = y === "FeatureCollection", u = y === "Feature", _ = b ? i.features.length : 1, B = 0; B < _; B++) {
      c = b ? (
        // @ts-expect-error: Known type conflict
        i.features[B].geometry
      ) : u ? (
        // @ts-expect-error: Known type conflict
        i.geometry
      ) : i, p = c ? c.type === "GeometryCollection" : !1, a = p ? c.geometries.length : 1;
      for (var m = 0; m < a; m++) {
        var v = 0, d = 0;
        if (r = p ? c.geometries[m] : c, r !== null) {
          l = r.coordinates;
          var x = r.type;
          switch (h = e && (x === "Polygon" || x === "MultiPolygon") ? 1 : 0, x) {
            case null:
              break;
            case "Point":
              if (
                // @ts-expect-error: Known type conflict
                t(
                  l,
                  f,
                  B,
                  v,
                  d
                ) === !1
              )
                return !1;
              f++, v++;
              break;
            case "LineString":
            case "MultiPoint":
              for (n = 0; n < l.length; n++) {
                if (
                  // @ts-expect-error: Known type conflict
                  t(
                    l[n],
                    f,
                    B,
                    v,
                    d
                  ) === !1
                )
                  return !1;
                f++, x === "MultiPoint" && v++;
              }
              x === "LineString" && v++;
              break;
            case "Polygon":
            case "MultiLineString":
              for (n = 0; n < l.length; n++) {
                for (s = 0; s < l[n].length - h; s++) {
                  if (
                    // @ts-expect-error: Known type conflict
                    t(
                      l[n][s],
                      f,
                      B,
                      v,
                      d
                    ) === !1
                  )
                    return !1;
                  f++;
                }
                x === "MultiLineString" && v++, x === "Polygon" && d++;
              }
              x === "Polygon" && v++;
              break;
            case "MultiPolygon":
              for (n = 0; n < l.length; n++) {
                for (d = 0, s = 0; s < l[n].length; s++) {
                  for (o = 0; o < l[n][s].length - h; o++) {
                    if (
                      // @ts-expect-error: Known type conflict
                      t(
                        l[n][s][o],
                        f,
                        B,
                        v,
                        d
                      ) === !1
                    )
                      return !1;
                    f++;
                  }
                  d++;
                }
                v++;
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
const pt = 11102230246251565e-32, U = 134217729, Tn = (3 + 8 * pt) * pt;
function ht(i, t, e, n, s) {
  let o, r, a, l, c = t[0], h = n[0], f = 0, p = 0;
  h > c == h > -c ? (o = c, c = t[++f]) : (o = h, h = n[++p]);
  let y = 0;
  if (f < i && p < e)
    for (h > c == h > -c ? (r = c + o, a = o - (r - c), c = t[++f]) : (r = h + o, a = o - (r - h), h = n[++p]), o = r, a !== 0 && (s[y++] = a); f < i && p < e; )
      h > c == h > -c ? (r = o + c, l = r - o, a = o - (r - l) + (c - l), c = t[++f]) : (r = o + h, l = r - o, a = o - (r - l) + (h - l), h = n[++p]), o = r, a !== 0 && (s[y++] = a);
  for (; f < i; )
    r = o + c, l = r - o, a = o - (r - l) + (c - l), c = t[++f], o = r, a !== 0 && (s[y++] = a);
  for (; p < e; )
    r = o + h, l = r - o, a = o - (r - l) + (h - l), h = n[++p], o = r, a !== 0 && (s[y++] = a);
  return (o !== 0 || y === 0) && (s[y++] = o), y;
}
function St(i, t, e, n, s, o, r, a) {
  return ht(ht(i, t, e, n, r), r, s, o, a);
}
function L(i, t, e, n) {
  let s, o, r, a, l, c, h, f, p, y, b;
  h = U * e, y = h - (h - e), b = e - y;
  let u = t[0];
  s = u * e, h = U * u, f = h - (h - u), p = u - f, r = p * b - (s - f * y - p * y - f * b);
  let _ = 0;
  r !== 0 && (n[_++] = r);
  for (let B = 1; B < i; B++)
    u = t[B], a = u * e, h = U * u, f = h - (h - u), p = u - f, l = p * b - (a - f * y - p * y - f * b), o = s + l, c = o - s, r = s - (o - c) + (l - c), r !== 0 && (n[_++] = r), s = a + o, r = o - (s - a), r !== 0 && (n[_++] = r);
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
const Kn = (3 + 16 * pt) * pt, Wn = (2 + 12 * pt) * pt, Jn = (9 + 64 * pt) * pt * pt, Lt = tt(4), Ue = tt(8), ze = tt(12), Ge = tt(16), mt = tt(4);
function Qn(i, t, e, n, s, o, r) {
  let a, l, c, h, f, p, y, b, u, _, B, m, v, d, x, S, I, k;
  const M = i - s, O = e - s, T = t - o, D = n - o;
  d = M * D, p = U * M, y = p - (p - M), b = M - y, p = U * D, u = p - (p - D), _ = D - u, x = b * _ - (d - y * u - b * u - y * _), S = T * O, p = U * T, y = p - (p - T), b = T - y, p = U * O, u = p - (p - O), _ = O - u, I = b * _ - (S - y * u - b * u - y * _), B = x - I, f = x - B, Lt[0] = x - (B + f) + (f - I), m = d + B, f = m - d, v = d - (m - f) + (B - f), B = v - S, f = v - B, Lt[1] = v - (B + f) + (f - S), k = m + B, f = k - m, Lt[2] = m - (k - f) + (B - f), Lt[3] = k;
  let X = Fn(4, Lt), g = Wn * r;
  if (X >= g || -X >= g || (f = i - M, a = i - (M + f) + (f - s), f = e - O, c = e - (O + f) + (f - s), f = t - T, l = t - (T + f) + (f - o), f = n - D, h = n - (D + f) + (f - o), a === 0 && l === 0 && c === 0 && h === 0) || (g = Jn * r + Tn * Math.abs(X), X += M * h + D * a - (T * c + O * l), X >= g || -X >= g)) return X;
  d = a * D, p = U * a, y = p - (p - a), b = a - y, p = U * D, u = p - (p - D), _ = D - u, x = b * _ - (d - y * u - b * u - y * _), S = l * O, p = U * l, y = p - (p - l), b = l - y, p = U * O, u = p - (p - O), _ = O - u, I = b * _ - (S - y * u - b * u - y * _), B = x - I, f = x - B, mt[0] = x - (B + f) + (f - I), m = d + B, f = m - d, v = d - (m - f) + (B - f), B = v - S, f = v - B, mt[1] = v - (B + f) + (f - S), k = m + B, f = k - m, mt[2] = m - (k - f) + (B - f), mt[3] = k;
  const A = ht(4, Lt, 4, mt, Ue);
  d = M * h, p = U * M, y = p - (p - M), b = M - y, p = U * h, u = p - (p - h), _ = h - u, x = b * _ - (d - y * u - b * u - y * _), S = T * c, p = U * T, y = p - (p - T), b = T - y, p = U * c, u = p - (p - c), _ = c - u, I = b * _ - (S - y * u - b * u - y * _), B = x - I, f = x - B, mt[0] = x - (B + f) + (f - I), m = d + B, f = m - d, v = d - (m - f) + (B - f), B = v - S, f = v - B, mt[1] = v - (B + f) + (f - S), k = m + B, f = k - m, mt[2] = m - (k - f) + (B - f), mt[3] = k;
  const E = ht(A, Ue, 4, mt, ze);
  d = a * h, p = U * a, y = p - (p - a), b = a - y, p = U * h, u = p - (p - h), _ = h - u, x = b * _ - (d - y * u - b * u - y * _), S = l * c, p = U * l, y = p - (p - l), b = l - y, p = U * c, u = p - (p - c), _ = c - u, I = b * _ - (S - y * u - b * u - y * _), B = x - I, f = x - B, mt[0] = x - (B + f) + (f - I), m = d + B, f = m - d, v = d - (m - f) + (B - f), B = v - S, f = v - B, mt[1] = v - (B + f) + (f - S), k = m + B, f = k - m, mt[2] = m - (k - f) + (B - f), mt[3] = k;
  const N = ht(E, ze, 4, mt, Ge);
  return Ge[N - 1];
}
function dt(i, t, e, n, s, o) {
  const r = (t - o) * (e - s), a = (i - s) * (n - o), l = r - a, c = Math.abs(r + a);
  return Math.abs(l) >= Kn * c ? l : -Qn(i, t, e, n, s, o, c);
}
const Zn = (10 + 96 * pt) * pt, tr = (4 + 48 * pt) * pt, er = (44 + 576 * pt) * pt * pt, Tt = tt(4), Ft = tt(4), Nt = tt(4), Mt = tt(4), kt = tt(4), Et = tt(4), gt = tt(4), wt = tt(4), Se = tt(8), Me = tt(8), ke = tt(8), Ee = tt(8), Ae = tt(8), Ie = tt(8), se = tt(8), oe = tt(8), ae = tt(8), Pt = tt(4), $t = tt(4), Xt = tt(4), z = tt(8), K = tt(16), nt = tt(16), rt = tt(16), et = tt(32), Ct = tt(32), ct = tt(48), vt = tt(64);
let jt = tt(1152), Be = tt(1152);
function lt(i, t, e) {
  i = ht(i, jt, t, e, Be);
  const n = jt;
  return jt = Be, Be = n, i;
}
function nr(i, t, e, n, s, o, r, a, l) {
  let c, h, f, p, y, b, u, _, B, m, v, d, x, S, I, k, M, O, T, D, X, g, A, E, N, C, P, w, F, $, R, q, Y, j, V;
  const H = i - r, G = e - r, W = s - r, J = t - a, Z = n - a, Q = o - a;
  R = G * Q, A = U * G, E = A - (A - G), N = G - E, A = U * Q, C = A - (A - Q), P = Q - C, q = N * P - (R - E * C - N * C - E * P), Y = W * Z, A = U * W, E = A - (A - W), N = W - E, A = U * Z, C = A - (A - Z), P = Z - C, j = N * P - (Y - E * C - N * C - E * P), w = q - j, g = q - w, Tt[0] = q - (w + g) + (g - j), F = R + w, g = F - R, $ = R - (F - g) + (w - g), w = $ - Y, g = $ - w, Tt[1] = $ - (w + g) + (g - Y), V = F + w, g = V - F, Tt[2] = F - (V - g) + (w - g), Tt[3] = V, R = W * J, A = U * W, E = A - (A - W), N = W - E, A = U * J, C = A - (A - J), P = J - C, q = N * P - (R - E * C - N * C - E * P), Y = H * Q, A = U * H, E = A - (A - H), N = H - E, A = U * Q, C = A - (A - Q), P = Q - C, j = N * P - (Y - E * C - N * C - E * P), w = q - j, g = q - w, Ft[0] = q - (w + g) + (g - j), F = R + w, g = F - R, $ = R - (F - g) + (w - g), w = $ - Y, g = $ - w, Ft[1] = $ - (w + g) + (g - Y), V = F + w, g = V - F, Ft[2] = F - (V - g) + (w - g), Ft[3] = V, R = H * Z, A = U * H, E = A - (A - H), N = H - E, A = U * Z, C = A - (A - Z), P = Z - C, q = N * P - (R - E * C - N * C - E * P), Y = G * J, A = U * G, E = A - (A - G), N = G - E, A = U * J, C = A - (A - J), P = J - C, j = N * P - (Y - E * C - N * C - E * P), w = q - j, g = q - w, Nt[0] = q - (w + g) + (g - j), F = R + w, g = F - R, $ = R - (F - g) + (w - g), w = $ - Y, g = $ - w, Nt[1] = $ - (w + g) + (g - Y), V = F + w, g = V - F, Nt[2] = F - (V - g) + (w - g), Nt[3] = V, c = ht(
    ht(
      ht(
        L(L(4, Tt, H, z), z, H, K),
        K,
        L(L(4, Tt, J, z), z, J, nt),
        nt,
        et
      ),
      et,
      ht(
        L(L(4, Ft, G, z), z, G, K),
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
  let at = Fn(c, jt), ft = tr * l;
  if (at >= ft || -at >= ft || (g = i - H, h = i - (H + g) + (g - r), g = t - J, y = t - (J + g) + (g - a), g = e - G, f = e - (G + g) + (g - r), g = n - Z, b = n - (Z + g) + (g - a), g = s - W, p = s - (W + g) + (g - r), g = o - Q, u = o - (Q + g) + (g - a), h === 0 && f === 0 && p === 0 && y === 0 && b === 0 && u === 0) || (ft = er * l + Tn * Math.abs(at), at += (H * H + J * J) * (G * u + Q * f - (Z * p + W * b)) + 2 * (H * h + J * y) * (G * Q - Z * W) + ((G * G + Z * Z) * (W * y + J * p - (Q * h + H * u)) + 2 * (G * f + Z * b) * (W * J - Q * H)) + ((W * W + Q * Q) * (H * b + Z * h - (J * f + G * y)) + 2 * (W * p + Q * u) * (H * Z - J * G)), at >= ft || -at >= ft))
    return at;
  if ((f !== 0 || b !== 0 || p !== 0 || u !== 0) && (R = H * H, A = U * H, E = A - (A - H), N = H - E, q = N * N - (R - E * E - (E + E) * N), Y = J * J, A = U * J, E = A - (A - J), N = J - E, j = N * N - (Y - E * E - (E + E) * N), w = q + j, g = w - q, Mt[0] = q - (w - g) + (j - g), F = R + w, g = F - R, $ = R - (F - g) + (w - g), w = $ + Y, g = w - $, Mt[1] = $ - (w - g) + (Y - g), V = F + w, g = V - F, Mt[2] = F - (V - g) + (w - g), Mt[3] = V), (p !== 0 || u !== 0 || h !== 0 || y !== 0) && (R = G * G, A = U * G, E = A - (A - G), N = G - E, q = N * N - (R - E * E - (E + E) * N), Y = Z * Z, A = U * Z, E = A - (A - Z), N = Z - E, j = N * N - (Y - E * E - (E + E) * N), w = q + j, g = w - q, kt[0] = q - (w - g) + (j - g), F = R + w, g = F - R, $ = R - (F - g) + (w - g), w = $ + Y, g = w - $, kt[1] = $ - (w - g) + (Y - g), V = F + w, g = V - F, kt[2] = F - (V - g) + (w - g), kt[3] = V), (h !== 0 || y !== 0 || f !== 0 || b !== 0) && (R = W * W, A = U * W, E = A - (A - W), N = W - E, q = N * N - (R - E * E - (E + E) * N), Y = Q * Q, A = U * Q, E = A - (A - Q), N = Q - E, j = N * N - (Y - E * E - (E + E) * N), w = q + j, g = w - q, Et[0] = q - (w - g) + (j - g), F = R + w, g = F - R, $ = R - (F - g) + (w - g), w = $ + Y, g = w - $, Et[1] = $ - (w - g) + (Y - g), V = F + w, g = V - F, Et[2] = F - (V - g) + (w - g), Et[3] = V), h !== 0 && (_ = L(4, Tt, h, Se), c = lt(c, St(
    L(_, Se, 2 * H, K),
    K,
    L(L(4, Et, h, z), z, Z, nt),
    nt,
    L(L(4, kt, h, z), z, -Q, rt),
    rt,
    et,
    ct
  ), ct)), y !== 0 && (B = L(4, Tt, y, Me), c = lt(c, St(
    L(B, Me, 2 * J, K),
    K,
    L(L(4, kt, y, z), z, W, nt),
    nt,
    L(L(4, Et, y, z), z, -G, rt),
    rt,
    et,
    ct
  ), ct)), f !== 0 && (m = L(4, Ft, f, ke), c = lt(c, St(
    L(m, ke, 2 * G, K),
    K,
    L(L(4, Mt, f, z), z, Q, nt),
    nt,
    L(L(4, Et, f, z), z, -J, rt),
    rt,
    et,
    ct
  ), ct)), b !== 0 && (v = L(4, Ft, b, Ee), c = lt(c, St(
    L(v, Ee, 2 * Z, K),
    K,
    L(L(4, Et, b, z), z, H, nt),
    nt,
    L(L(4, Mt, b, z), z, -W, rt),
    rt,
    et,
    ct
  ), ct)), p !== 0 && (d = L(4, Nt, p, Ae), c = lt(c, St(
    L(d, Ae, 2 * W, K),
    K,
    L(L(4, kt, p, z), z, J, nt),
    nt,
    L(L(4, Mt, p, z), z, -Z, rt),
    rt,
    et,
    ct
  ), ct)), u !== 0 && (x = L(4, Nt, u, Ie), c = lt(c, St(
    L(x, Ie, 2 * Q, K),
    K,
    L(L(4, Mt, u, z), z, G, nt),
    nt,
    L(L(4, kt, u, z), z, -H, rt),
    rt,
    et,
    ct
  ), ct)), h !== 0 || y !== 0) {
    if (f !== 0 || b !== 0 || p !== 0 || u !== 0 ? (R = f * Q, A = U * f, E = A - (A - f), N = f - E, A = U * Q, C = A - (A - Q), P = Q - C, q = N * P - (R - E * C - N * C - E * P), Y = G * u, A = U * G, E = A - (A - G), N = G - E, A = U * u, C = A - (A - u), P = u - C, j = N * P - (Y - E * C - N * C - E * P), w = q + j, g = w - q, gt[0] = q - (w - g) + (j - g), F = R + w, g = F - R, $ = R - (F - g) + (w - g), w = $ + Y, g = w - $, gt[1] = $ - (w - g) + (Y - g), V = F + w, g = V - F, gt[2] = F - (V - g) + (w - g), gt[3] = V, R = p * -Z, A = U * p, E = A - (A - p), N = p - E, A = U * -Z, C = A - (A - -Z), P = -Z - C, q = N * P - (R - E * C - N * C - E * P), Y = W * -b, A = U * W, E = A - (A - W), N = W - E, A = U * -b, C = A - (A - -b), P = -b - C, j = N * P - (Y - E * C - N * C - E * P), w = q + j, g = w - q, wt[0] = q - (w - g) + (j - g), F = R + w, g = F - R, $ = R - (F - g) + (w - g), w = $ + Y, g = w - $, wt[1] = $ - (w - g) + (Y - g), V = F + w, g = V - F, wt[2] = F - (V - g) + (w - g), wt[3] = V, I = ht(4, gt, 4, wt, oe), R = f * u, A = U * f, E = A - (A - f), N = f - E, A = U * u, C = A - (A - u), P = u - C, q = N * P - (R - E * C - N * C - E * P), Y = p * b, A = U * p, E = A - (A - p), N = p - E, A = U * b, C = A - (A - b), P = b - C, j = N * P - (Y - E * C - N * C - E * P), w = q - j, g = q - w, $t[0] = q - (w + g) + (g - j), F = R + w, g = F - R, $ = R - (F - g) + (w - g), w = $ - Y, g = $ - w, $t[1] = $ - (w + g) + (g - Y), V = F + w, g = V - F, $t[2] = F - (V - g) + (w - g), $t[3] = V, O = 4) : (oe[0] = 0, I = 1, $t[0] = 0, O = 1), h !== 0) {
      const it = L(I, oe, h, rt);
      c = lt(c, ht(
        L(_, Se, h, K),
        K,
        L(it, rt, 2 * H, et),
        et,
        ct
      ), ct);
      const st = L(O, $t, h, z);
      c = lt(c, St(
        L(st, z, 2 * H, K),
        K,
        L(st, z, h, nt),
        nt,
        L(it, rt, h, et),
        et,
        Ct,
        vt
      ), vt), b !== 0 && (c = lt(c, L(L(4, Et, h, z), z, b, K), K)), u !== 0 && (c = lt(c, L(L(4, kt, -h, z), z, u, K), K));
    }
    if (y !== 0) {
      const it = L(I, oe, y, rt);
      c = lt(c, ht(
        L(B, Me, y, K),
        K,
        L(it, rt, 2 * J, et),
        et,
        ct
      ), ct);
      const st = L(O, $t, y, z);
      c = lt(c, St(
        L(st, z, 2 * J, K),
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
  if (f !== 0 || b !== 0) {
    if (p !== 0 || u !== 0 || h !== 0 || y !== 0 ? (R = p * J, A = U * p, E = A - (A - p), N = p - E, A = U * J, C = A - (A - J), P = J - C, q = N * P - (R - E * C - N * C - E * P), Y = W * y, A = U * W, E = A - (A - W), N = W - E, A = U * y, C = A - (A - y), P = y - C, j = N * P - (Y - E * C - N * C - E * P), w = q + j, g = w - q, gt[0] = q - (w - g) + (j - g), F = R + w, g = F - R, $ = R - (F - g) + (w - g), w = $ + Y, g = w - $, gt[1] = $ - (w - g) + (Y - g), V = F + w, g = V - F, gt[2] = F - (V - g) + (w - g), gt[3] = V, D = -Q, X = -u, R = h * D, A = U * h, E = A - (A - h), N = h - E, A = U * D, C = A - (A - D), P = D - C, q = N * P - (R - E * C - N * C - E * P), Y = H * X, A = U * H, E = A - (A - H), N = H - E, A = U * X, C = A - (A - X), P = X - C, j = N * P - (Y - E * C - N * C - E * P), w = q + j, g = w - q, wt[0] = q - (w - g) + (j - g), F = R + w, g = F - R, $ = R - (F - g) + (w - g), w = $ + Y, g = w - $, wt[1] = $ - (w - g) + (Y - g), V = F + w, g = V - F, wt[2] = F - (V - g) + (w - g), wt[3] = V, k = ht(4, gt, 4, wt, ae), R = p * y, A = U * p, E = A - (A - p), N = p - E, A = U * y, C = A - (A - y), P = y - C, q = N * P - (R - E * C - N * C - E * P), Y = h * u, A = U * h, E = A - (A - h), N = h - E, A = U * u, C = A - (A - u), P = u - C, j = N * P - (Y - E * C - N * C - E * P), w = q - j, g = q - w, Xt[0] = q - (w + g) + (g - j), F = R + w, g = F - R, $ = R - (F - g) + (w - g), w = $ - Y, g = $ - w, Xt[1] = $ - (w + g) + (g - Y), V = F + w, g = V - F, Xt[2] = F - (V - g) + (w - g), Xt[3] = V, T = 4) : (ae[0] = 0, k = 1, Xt[0] = 0, T = 1), f !== 0) {
      const it = L(k, ae, f, rt);
      c = lt(c, ht(
        L(m, ke, f, K),
        K,
        L(it, rt, 2 * G, et),
        et,
        ct
      ), ct);
      const st = L(T, Xt, f, z);
      c = lt(c, St(
        L(st, z, 2 * G, K),
        K,
        L(st, z, f, nt),
        nt,
        L(it, rt, f, et),
        et,
        Ct,
        vt
      ), vt), u !== 0 && (c = lt(c, L(L(4, Mt, f, z), z, u, K), K)), y !== 0 && (c = lt(c, L(L(4, Et, -f, z), z, y, K), K));
    }
    if (b !== 0) {
      const it = L(k, ae, b, rt);
      c = lt(c, ht(
        L(v, Ee, b, K),
        K,
        L(it, rt, 2 * Z, et),
        et,
        ct
      ), ct);
      const st = L(T, Xt, b, z);
      c = lt(c, St(
        L(st, z, 2 * Z, K),
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
  if (p !== 0 || u !== 0) {
    if (h !== 0 || y !== 0 || f !== 0 || b !== 0 ? (R = h * Z, A = U * h, E = A - (A - h), N = h - E, A = U * Z, C = A - (A - Z), P = Z - C, q = N * P - (R - E * C - N * C - E * P), Y = H * b, A = U * H, E = A - (A - H), N = H - E, A = U * b, C = A - (A - b), P = b - C, j = N * P - (Y - E * C - N * C - E * P), w = q + j, g = w - q, gt[0] = q - (w - g) + (j - g), F = R + w, g = F - R, $ = R - (F - g) + (w - g), w = $ + Y, g = w - $, gt[1] = $ - (w - g) + (Y - g), V = F + w, g = V - F, gt[2] = F - (V - g) + (w - g), gt[3] = V, D = -J, X = -y, R = f * D, A = U * f, E = A - (A - f), N = f - E, A = U * D, C = A - (A - D), P = D - C, q = N * P - (R - E * C - N * C - E * P), Y = G * X, A = U * G, E = A - (A - G), N = G - E, A = U * X, C = A - (A - X), P = X - C, j = N * P - (Y - E * C - N * C - E * P), w = q + j, g = w - q, wt[0] = q - (w - g) + (j - g), F = R + w, g = F - R, $ = R - (F - g) + (w - g), w = $ + Y, g = w - $, wt[1] = $ - (w - g) + (Y - g), V = F + w, g = V - F, wt[2] = F - (V - g) + (w - g), wt[3] = V, S = ht(4, gt, 4, wt, se), R = h * b, A = U * h, E = A - (A - h), N = h - E, A = U * b, C = A - (A - b), P = b - C, q = N * P - (R - E * C - N * C - E * P), Y = f * y, A = U * f, E = A - (A - f), N = f - E, A = U * y, C = A - (A - y), P = y - C, j = N * P - (Y - E * C - N * C - E * P), w = q - j, g = q - w, Pt[0] = q - (w + g) + (g - j), F = R + w, g = F - R, $ = R - (F - g) + (w - g), w = $ - Y, g = $ - w, Pt[1] = $ - (w + g) + (g - Y), V = F + w, g = V - F, Pt[2] = F - (V - g) + (w - g), Pt[3] = V, M = 4) : (se[0] = 0, S = 1, Pt[0] = 0, M = 1), p !== 0) {
      const it = L(S, se, p, rt);
      c = lt(c, ht(
        L(d, Ae, p, K),
        K,
        L(it, rt, 2 * W, et),
        et,
        ct
      ), ct);
      const st = L(M, Pt, p, z);
      c = lt(c, St(
        L(st, z, 2 * W, K),
        K,
        L(st, z, p, nt),
        nt,
        L(it, rt, p, et),
        et,
        Ct,
        vt
      ), vt), y !== 0 && (c = lt(c, L(L(4, kt, p, z), z, y, K), K)), b !== 0 && (c = lt(c, L(L(4, Mt, -p, z), z, b, K), K));
    }
    if (u !== 0) {
      const it = L(S, se, u, rt);
      c = lt(c, ht(
        L(x, Ie, u, K),
        K,
        L(it, rt, 2 * Q, et),
        et,
        ct
      ), ct);
      const st = L(M, Pt, u, z);
      c = lt(c, St(
        L(st, z, 2 * Q, K),
        K,
        L(st, z, u, nt),
        nt,
        L(it, rt, u, et),
        et,
        Ct,
        vt
      ), vt);
    }
  }
  return jt[c - 1];
}
function rr(i, t, e, n, s, o, r, a) {
  const l = i - r, c = e - r, h = s - r, f = t - a, p = n - a, y = o - a, b = c * y, u = h * p, _ = l * l + f * f, B = h * f, m = l * y, v = c * c + p * p, d = l * p, x = c * f, S = h * h + y * y, I = _ * (b - u) + v * (B - m) + S * (d - x), k = (Math.abs(b) + Math.abs(u)) * _ + (Math.abs(B) + Math.abs(m)) * v + (Math.abs(d) + Math.abs(x)) * S, M = Zn * k;
  return I > M || -I > M ? I : nr(i, t, e, n, s, o, r, a, k);
}
function ir(i, t) {
  var e, n, s = 0, o, r, a, l, c, h, f, p = i[0], y = i[1], b = t.length;
  for (e = 0; e < b; e++) {
    n = 0;
    var u = t[e], _ = u.length - 1;
    if (h = u[0], h[0] !== u[_][0] && h[1] !== u[_][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (r = h[0] - p, a = h[1] - y, n; n < _; n++) {
      if (f = u[n + 1], l = f[0] - p, c = f[1] - y, a === 0 && c === 0) {
        if (l <= 0 && r >= 0 || r <= 0 && l >= 0)
          return 0;
      } else if (c >= 0 && a <= 0 || c <= 0 && a >= 0) {
        if (o = dt(r, l, a, c, 0, 0), o === 0)
          return 0;
        (o > 0 && c > 0 && a <= 0 || o < 0 && c <= 0 && a > 0) && s++;
      }
      h = f, a = c, r = l;
    }
  }
  return s % 2 !== 0;
}
function He(i, t, e = {}) {
  if (!i)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const n = Gn(i), s = Hn(t), o = s.type, r = t.bbox;
  let a = s.coordinates;
  if (r && sr(n, r) === !1)
    return !1;
  o === "Polygon" && (a = [a]);
  for (var l = 0; l < a.length; ++l) {
    const c = ir(n, a[l]);
    if (c === 0 && !e.ignoreBoundary) return !0;
    if (c) return !0;
  }
  return !1;
}
function sr(i, t) {
  return t[0] <= i[0] && t[1] <= i[1] && t[2] >= i[0] && t[3] >= i[1];
}
class $e {
  constructor(t = [], e = or) {
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
      const l = r + 1;
      if (l < this.length && n(e[l], a) < 0 && (r = l, a = e[l]), n(a, o) >= 0) break;
      e[t] = a, t = r;
    }
    e[t] = o;
  }
}
function or(i, t) {
  return i < t ? -1 : i > t ? 1 : 0;
}
const ar = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $e
}, Symbol.toStringTag, { value: "Module" })), Bt = 11102230246251565e-32, ut = 134217729, cr = (3 + 8 * Bt) * Bt;
function Oe(i, t, e, n, s) {
  let o, r, a, l, c = t[0], h = n[0], f = 0, p = 0;
  h > c == h > -c ? (o = c, c = t[++f]) : (o = h, h = n[++p]);
  let y = 0;
  if (f < i && p < e)
    for (h > c == h > -c ? (r = c + o, a = o - (r - c), c = t[++f]) : (r = h + o, a = o - (r - h), h = n[++p]), o = r, a !== 0 && (s[y++] = a); f < i && p < e; )
      h > c == h > -c ? (r = o + c, l = r - o, a = o - (r - l) + (c - l), c = t[++f]) : (r = o + h, l = r - o, a = o - (r - l) + (h - l), h = n[++p]), o = r, a !== 0 && (s[y++] = a);
  for (; f < i; )
    r = o + c, l = r - o, a = o - (r - l) + (c - l), c = t[++f], o = r, a !== 0 && (s[y++] = a);
  for (; p < e; )
    r = o + h, l = r - o, a = o - (r - l) + (h - l), h = n[++p], o = r, a !== 0 && (s[y++] = a);
  return (o !== 0 || y === 0) && (s[y++] = o), y;
}
function lr(i, t) {
  let e = t[0];
  for (let n = 1; n < i; n++) e += t[n];
  return e;
}
function ie(i) {
  return new Float64Array(i);
}
const fr = (3 + 16 * Bt) * Bt, hr = (2 + 12 * Bt) * Bt, ur = (9 + 64 * Bt) * Bt * Bt, qt = ie(4), Ke = ie(8), We = ie(12), Je = ie(16), yt = ie(4);
function dr(i, t, e, n, s, o, r) {
  let a, l, c, h, f, p, y, b, u, _, B, m, v, d, x, S, I, k;
  const M = i - s, O = e - s, T = t - o, D = n - o;
  d = M * D, p = ut * M, y = p - (p - M), b = M - y, p = ut * D, u = p - (p - D), _ = D - u, x = b * _ - (d - y * u - b * u - y * _), S = T * O, p = ut * T, y = p - (p - T), b = T - y, p = ut * O, u = p - (p - O), _ = O - u, I = b * _ - (S - y * u - b * u - y * _), B = x - I, f = x - B, qt[0] = x - (B + f) + (f - I), m = d + B, f = m - d, v = d - (m - f) + (B - f), B = v - S, f = v - B, qt[1] = v - (B + f) + (f - S), k = m + B, f = k - m, qt[2] = m - (k - f) + (B - f), qt[3] = k;
  let X = lr(4, qt), g = hr * r;
  if (X >= g || -X >= g || (f = i - M, a = i - (M + f) + (f - s), f = e - O, c = e - (O + f) + (f - s), f = t - T, l = t - (T + f) + (f - o), f = n - D, h = n - (D + f) + (f - o), a === 0 && l === 0 && c === 0 && h === 0) || (g = ur * r + cr * Math.abs(X), X += M * h + D * a - (T * c + O * l), X >= g || -X >= g)) return X;
  d = a * D, p = ut * a, y = p - (p - a), b = a - y, p = ut * D, u = p - (p - D), _ = D - u, x = b * _ - (d - y * u - b * u - y * _), S = l * O, p = ut * l, y = p - (p - l), b = l - y, p = ut * O, u = p - (p - O), _ = O - u, I = b * _ - (S - y * u - b * u - y * _), B = x - I, f = x - B, yt[0] = x - (B + f) + (f - I), m = d + B, f = m - d, v = d - (m - f) + (B - f), B = v - S, f = v - B, yt[1] = v - (B + f) + (f - S), k = m + B, f = k - m, yt[2] = m - (k - f) + (B - f), yt[3] = k;
  const A = Oe(4, qt, 4, yt, Ke);
  d = M * h, p = ut * M, y = p - (p - M), b = M - y, p = ut * h, u = p - (p - h), _ = h - u, x = b * _ - (d - y * u - b * u - y * _), S = T * c, p = ut * T, y = p - (p - T), b = T - y, p = ut * c, u = p - (p - c), _ = c - u, I = b * _ - (S - y * u - b * u - y * _), B = x - I, f = x - B, yt[0] = x - (B + f) + (f - I), m = d + B, f = m - d, v = d - (m - f) + (B - f), B = v - S, f = v - B, yt[1] = v - (B + f) + (f - S), k = m + B, f = k - m, yt[2] = m - (k - f) + (B - f), yt[3] = k;
  const E = Oe(A, Ke, 4, yt, We);
  d = a * h, p = ut * a, y = p - (p - a), b = a - y, p = ut * h, u = p - (p - h), _ = h - u, x = b * _ - (d - y * u - b * u - y * _), S = l * c, p = ut * l, y = p - (p - l), b = l - y, p = ut * c, u = p - (p - c), _ = c - u, I = b * _ - (S - y * u - b * u - y * _), B = x - I, f = x - B, yt[0] = x - (B + f) + (f - I), m = d + B, f = m - d, v = d - (m - f) + (B - f), B = v - S, f = v - B, yt[1] = v - (B + f) + (f - S), k = m + B, f = k - m, yt[2] = m - (k - f) + (B - f), yt[3] = k;
  const N = Oe(E, We, 4, yt, Je);
  return Je[N - 1];
}
function Qe(i, t, e, n, s, o) {
  const r = (t - o) * (e - s), a = (i - s) * (n - o), l = r - a;
  if (r === 0 || a === 0 || r > 0 != a > 0) return l;
  const c = Math.abs(r + a);
  return Math.abs(l) >= fr * c ? l : -dr(i, t, e, n, s, o, c);
}
function pr(i, t) {
  const e = new $e([], Nn);
  return gr(i, e), wr(e, t);
}
function Nn(i, t) {
  return i.p.x > t.p.x ? 1 : i.p.x < t.p.x || i.p.x === t.p.x && (i.featureId !== t.featureId || i.ringId !== t.ringId) && i.isLeftEndpoint && !t.isLeftEndpoint ? -1 : i.p.y !== t.p.y ? i.p.y > t.p.y ? 1 : -1 : 1;
}
function mr(i, t) {
  return i.rightSweepEvent.p.x > t.rightSweepEvent.p.x ? 1 : i.rightSweepEvent.p.x < t.rightSweepEvent.p.x ? -1 : i.rightSweepEvent.p.y !== t.rightSweepEvent.p.y ? i.rightSweepEvent.p.y < t.rightSweepEvent.p.y ? 1 : -1 : 1;
}
function gr(i, t) {
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
      for (let l = 0; l < n[s][o].length - 1; l++) {
        a = n[s][o][l + 1];
        const c = new tn(r, ce, le, fe), h = new tn(a, ce, le, fe + 1);
        c.otherEvent = h, h.otherEvent = c, Nn(c, h) > 0 ? (h.isLeftEndpoint = !0, c.isLeftEndpoint = !1) : (c.isLeftEndpoint = !0, h.isLeftEndpoint = !1), t.push(c), t.push(h), r = a, fe = fe + 1;
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
function wr(i, t = !1) {
  const e = [], n = new $e([], mr);
  for (; i.length; ) {
    const s = i.pop();
    if (s.isLeftEndpoint) {
      const o = new yr(s);
      for (let r = 0; r < n.data.length; r++) {
        const a = n.data[r];
        if (t && a.leftSweepEvent.featureId === s.featureId)
          continue;
        const l = vr(o, a);
        l !== !1 && e.push(l);
      }
      n.push(o);
    } else s.isLeftEndpoint === !1 && n.pop();
  }
  return e;
}
var yr = class {
  /** @param event must have otherEvent non-null */
  constructor(i) {
    this.leftSweepEvent = i, this.rightSweepEvent = i.otherEvent;
  }
};
function vr(i, t) {
  if (i === null || t === null) return !1;
  const e = i.leftSweepEvent.p.x, n = i.leftSweepEvent.p.y, s = i.rightSweepEvent.p.x, o = i.rightSweepEvent.p.y, r = t.leftSweepEvent.p.x, a = t.leftSweepEvent.p.y, l = t.rightSweepEvent.p.x, c = t.rightSweepEvent.p.y, h = Qe(e, n, s, o, r, a), f = Qe(e, n, s, o, l, c);
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
  const p = (c - a) * (s - e) - (l - r) * (o - n), y = (l - r) * (n - a) - (c - a) * (e - r), b = (s - e) * (n - a) - (o - n) * (e - r);
  if (p === 0)
    return !1;
  const u = y / p, _ = b / p;
  if (u >= 0 && u <= 1 && _ >= 0 && _ <= 1) {
    const B = e + u * (s - e), m = n + u * (o - n);
    return [B, m];
  }
  return !1;
}
function br(i, t, e = {}) {
  const { removeDuplicates: n = !0, ignoreSelfIntersections: s = !0 } = e;
  let o = [];
  i.type === "FeatureCollection" ? o = o.concat(i.features) : i.type === "Feature" ? o.push(i) : (i.type === "LineString" || i.type === "Polygon" || i.type === "MultiLineString" || i.type === "MultiPolygon") && o.push(te(i)), t.type === "FeatureCollection" ? o = o.concat(t.features) : t.type === "Feature" ? o.push(t) : (t.type === "LineString" || t.type === "Polygon" || t.type === "MultiLineString" || t.type === "MultiPolygon") && o.push(te(t));
  const r = pr(
    xt(o),
    s
  );
  let a = [];
  if (n) {
    const l = {};
    r.forEach((c) => {
      const h = c.join(",");
      l[h] || (l[h] = !0, a.push(c));
    });
  } else
    a = r;
  return xt(a.map((l) => Yt(l)));
}
function xr(i) {
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
var he = { exports: {} }, we = { exports: {} }, Mr = we.exports, en;
function kr() {
  return en || (en = 1, (function(i, t) {
    (function(e, n) {
      i.exports = n();
    })(Mr, function() {
      function e(m, v, d, x, S) {
        (function I(k, M, O, T, D) {
          for (; T > O; ) {
            if (T - O > 600) {
              var X = T - O + 1, g = M - O + 1, A = Math.log(X), E = 0.5 * Math.exp(2 * A / 3), N = 0.5 * Math.sqrt(A * E * (X - E) / X) * (g - X / 2 < 0 ? -1 : 1), C = Math.max(O, Math.floor(M - g * E / X + N)), P = Math.min(T, Math.floor(M + (X - g) * E / X + N));
              I(k, M, C, P, D);
            }
            var w = k[M], F = O, $ = T;
            for (n(k, O, M), D(k[T], w) > 0 && n(k, O, T); F < $; ) {
              for (n(k, F, $), F++, $--; D(k[F], w) < 0; ) F++;
              for (; D(k[$], w) > 0; ) $--;
            }
            D(k[O], w) === 0 ? n(k, O, $) : n(k, ++$, T), $ <= M && (O = $ + 1), M <= $ && (T = $ - 1);
          }
        })(m, v, d || 0, x || m.length - 1, S || s);
      }
      function n(m, v, d) {
        var x = m[v];
        m[v] = m[d], m[d] = x;
      }
      function s(m, v) {
        return m < v ? -1 : m > v ? 1 : 0;
      }
      var o = function(m) {
        m === void 0 && (m = 9), this._maxEntries = Math.max(4, m), this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries)), this.clear();
      };
      function r(m, v, d) {
        if (!d) return v.indexOf(m);
        for (var x = 0; x < v.length; x++) if (d(m, v[x])) return x;
        return -1;
      }
      function a(m, v) {
        l(m, 0, m.children.length, v, m);
      }
      function l(m, v, d, x, S) {
        S || (S = _(null)), S.minX = 1 / 0, S.minY = 1 / 0, S.maxX = -1 / 0, S.maxY = -1 / 0;
        for (var I = v; I < d; I++) {
          var k = m.children[I];
          c(S, m.leaf ? x(k) : k);
        }
        return S;
      }
      function c(m, v) {
        return m.minX = Math.min(m.minX, v.minX), m.minY = Math.min(m.minY, v.minY), m.maxX = Math.max(m.maxX, v.maxX), m.maxY = Math.max(m.maxY, v.maxY), m;
      }
      function h(m, v) {
        return m.minX - v.minX;
      }
      function f(m, v) {
        return m.minY - v.minY;
      }
      function p(m) {
        return (m.maxX - m.minX) * (m.maxY - m.minY);
      }
      function y(m) {
        return m.maxX - m.minX + (m.maxY - m.minY);
      }
      function b(m, v) {
        return m.minX <= v.minX && m.minY <= v.minY && v.maxX <= m.maxX && v.maxY <= m.maxY;
      }
      function u(m, v) {
        return v.minX <= m.maxX && v.minY <= m.maxY && v.maxX >= m.minX && v.maxY >= m.minY;
      }
      function _(m) {
        return { children: m, height: 1, leaf: !0, minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
      }
      function B(m, v, d, x, S) {
        for (var I = [v, d]; I.length; ) if (!((d = I.pop()) - (v = I.pop()) <= x)) {
          var k = v + Math.ceil((d - v) / x / 2) * x;
          e(m, k, v, d, S), I.push(v, k, k, d);
        }
      }
      return o.prototype.all = function() {
        return this._all(this.data, []);
      }, o.prototype.search = function(m) {
        var v = this.data, d = [];
        if (!u(m, v)) return d;
        for (var x = this.toBBox, S = []; v; ) {
          for (var I = 0; I < v.children.length; I++) {
            var k = v.children[I], M = v.leaf ? x(k) : k;
            u(m, M) && (v.leaf ? d.push(k) : b(m, M) ? this._all(k, d) : S.push(k));
          }
          v = S.pop();
        }
        return d;
      }, o.prototype.collides = function(m) {
        var v = this.data;
        if (!u(m, v)) return !1;
        for (var d = []; v; ) {
          for (var x = 0; x < v.children.length; x++) {
            var S = v.children[x], I = v.leaf ? this.toBBox(S) : S;
            if (u(m, I)) {
              if (v.leaf || b(m, I)) return !0;
              d.push(S);
            }
          }
          v = d.pop();
        }
        return !1;
      }, o.prototype.load = function(m) {
        if (!m || !m.length) return this;
        if (m.length < this._minEntries) {
          for (var v = 0; v < m.length; v++) this.insert(m[v]);
          return this;
        }
        var d = this._build(m.slice(), 0, m.length - 1, 0);
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
      }, o.prototype.insert = function(m) {
        return m && this._insert(m, this.data.height - 1), this;
      }, o.prototype.clear = function() {
        return this.data = _([]), this;
      }, o.prototype.remove = function(m, v) {
        if (!m) return this;
        for (var d, x, S, I = this.data, k = this.toBBox(m), M = [], O = []; I || M.length; ) {
          if (I || (I = M.pop(), x = M[M.length - 1], d = O.pop(), S = !0), I.leaf) {
            var T = r(m, I.children, v);
            if (T !== -1) return I.children.splice(T, 1), M.push(I), this._condense(M), this;
          }
          S || I.leaf || !b(I, k) ? x ? (d++, I = x.children[d], S = !1) : I = null : (M.push(I), O.push(d), d = 0, x = I, I = I.children[0]);
        }
        return this;
      }, o.prototype.toBBox = function(m) {
        return m;
      }, o.prototype.compareMinX = function(m, v) {
        return m.minX - v.minX;
      }, o.prototype.compareMinY = function(m, v) {
        return m.minY - v.minY;
      }, o.prototype.toJSON = function() {
        return this.data;
      }, o.prototype.fromJSON = function(m) {
        return this.data = m, this;
      }, o.prototype._all = function(m, v) {
        for (var d = []; m; ) m.leaf ? v.push.apply(v, m.children) : d.push.apply(d, m.children), m = d.pop();
        return v;
      }, o.prototype._build = function(m, v, d, x) {
        var S, I = d - v + 1, k = this._maxEntries;
        if (I <= k) return a(S = _(m.slice(v, d + 1)), this.toBBox), S;
        x || (x = Math.ceil(Math.log(I) / Math.log(k)), k = Math.ceil(I / Math.pow(k, x - 1))), (S = _([])).leaf = !1, S.height = x;
        var M = Math.ceil(I / k), O = M * Math.ceil(Math.sqrt(k));
        B(m, v, d, O, this.compareMinX);
        for (var T = v; T <= d; T += O) {
          var D = Math.min(T + O - 1, d);
          B(m, T, D, M, this.compareMinY);
          for (var X = T; X <= D; X += M) {
            var g = Math.min(X + M - 1, D);
            S.children.push(this._build(m, X, g, x - 1));
          }
        }
        return a(S, this.toBBox), S;
      }, o.prototype._chooseSubtree = function(m, v, d, x) {
        for (; x.push(v), !v.leaf && x.length - 1 !== d; ) {
          for (var S = 1 / 0, I = 1 / 0, k = void 0, M = 0; M < v.children.length; M++) {
            var O = v.children[M], T = p(O), D = (X = m, g = O, (Math.max(g.maxX, X.maxX) - Math.min(g.minX, X.minX)) * (Math.max(g.maxY, X.maxY) - Math.min(g.minY, X.minY)) - T);
            D < I ? (I = D, S = T < S ? T : S, k = O) : D === I && T < S && (S = T, k = O);
          }
          v = k || v.children[0];
        }
        var X, g;
        return v;
      }, o.prototype._insert = function(m, v, d) {
        var x = d ? m : this.toBBox(m), S = [], I = this._chooseSubtree(x, this.data, v, S);
        for (I.children.push(m), c(I, x); v >= 0 && S[v].children.length > this._maxEntries; ) this._split(S, v), v--;
        this._adjustParentBBoxes(x, S, v);
      }, o.prototype._split = function(m, v) {
        var d = m[v], x = d.children.length, S = this._minEntries;
        this._chooseSplitAxis(d, S, x);
        var I = this._chooseSplitIndex(d, S, x), k = _(d.children.splice(I, d.children.length - I));
        k.height = d.height, k.leaf = d.leaf, a(d, this.toBBox), a(k, this.toBBox), v ? m[v - 1].children.push(k) : this._splitRoot(d, k);
      }, o.prototype._splitRoot = function(m, v) {
        this.data = _([m, v]), this.data.height = m.height + 1, this.data.leaf = !1, a(this.data, this.toBBox);
      }, o.prototype._chooseSplitIndex = function(m, v, d) {
        for (var x, S, I, k, M, O, T, D = 1 / 0, X = 1 / 0, g = v; g <= d - v; g++) {
          var A = l(m, 0, g, this.toBBox), E = l(m, g, d, this.toBBox), N = (S = A, I = E, k = void 0, M = void 0, O = void 0, T = void 0, k = Math.max(S.minX, I.minX), M = Math.max(S.minY, I.minY), O = Math.min(S.maxX, I.maxX), T = Math.min(S.maxY, I.maxY), Math.max(0, O - k) * Math.max(0, T - M)), C = p(A) + p(E);
          N < D ? (D = N, x = g, X = C < X ? C : X) : N === D && C < X && (X = C, x = g);
        }
        return x || d - v;
      }, o.prototype._chooseSplitAxis = function(m, v, d) {
        var x = m.leaf ? this.compareMinX : h, S = m.leaf ? this.compareMinY : f;
        this._allDistMargin(m, v, d, x) < this._allDistMargin(m, v, d, S) && m.children.sort(x);
      }, o.prototype._allDistMargin = function(m, v, d, x) {
        m.children.sort(x);
        for (var S = this.toBBox, I = l(m, 0, v, S), k = l(m, d - v, d, S), M = y(I) + y(k), O = v; O < d - v; O++) {
          var T = m.children[O];
          c(I, m.leaf ? S(T) : T), M += y(I);
        }
        for (var D = d - v - 1; D >= v; D--) {
          var X = m.children[D];
          c(k, m.leaf ? S(X) : X), M += y(k);
        }
        return M;
      }, o.prototype._adjustParentBBoxes = function(m, v, d) {
        for (var x = d; x >= 0; x--) c(v[x], m);
      }, o.prototype._condense = function(m) {
        for (var v = m.length - 1, d = void 0; v >= 0; v--) m[v].children.length === 0 ? v > 0 ? (d = m[v - 1].children).splice(d.indexOf(m[v]), 1) : this.clear() : a(m[v], this.toBBox);
      }, o;
    });
  })(we)), we.exports;
}
const Er = /* @__PURE__ */ _r(ar);
var zt = { exports: {} }, Te, nn;
function Ar() {
  return nn || (nn = 1, Te = function(t, e, n, s) {
    var o = t[0], r = t[1], a = !1;
    n === void 0 && (n = 0), s === void 0 && (s = e.length);
    for (var l = (s - n) / 2, c = 0, h = l - 1; c < l; h = c++) {
      var f = e[n + c * 2 + 0], p = e[n + c * 2 + 1], y = e[n + h * 2 + 0], b = e[n + h * 2 + 1], u = p > r != b > r && o < (y - f) * (r - p) / (b - p) + f;
      u && (a = !a);
    }
    return a;
  }), Te;
}
var Fe, rn;
function Ir() {
  return rn || (rn = 1, Fe = function(t, e, n, s) {
    var o = t[0], r = t[1], a = !1;
    n === void 0 && (n = 0), s === void 0 && (s = e.length);
    for (var l = s - n, c = 0, h = l - 1; c < l; h = c++) {
      var f = e[c + n][0], p = e[c + n][1], y = e[h + n][0], b = e[h + n][1], u = p > r != b > r && o < (y - f) * (r - p) / (b - p) + f;
      u && (a = !a);
    }
    return a;
  }), Fe;
}
var sn;
function Br() {
  if (sn) return zt.exports;
  sn = 1;
  var i = Ar(), t = Ir();
  return zt.exports = function(n, s, o, r) {
    return s.length > 0 && Array.isArray(s[0]) ? t(n, s, o, r) : i(n, s, o, r);
  }, zt.exports.nested = t, zt.exports.flat = i, zt.exports;
}
var Ht = { exports: {} }, Or = Ht.exports, on;
function Tr() {
  return on || (on = 1, (function(i, t) {
    (function(e, n) {
      n(t);
    })(Or, function(e) {
      const s = 33306690738754706e-32;
      function o(u, _, B, m, v) {
        let d, x, S, I, k = _[0], M = m[0], O = 0, T = 0;
        M > k == M > -k ? (d = k, k = _[++O]) : (d = M, M = m[++T]);
        let D = 0;
        if (O < u && T < B) for (M > k == M > -k ? (S = d - ((x = k + d) - k), k = _[++O]) : (S = d - ((x = M + d) - M), M = m[++T]), d = x, S !== 0 && (v[D++] = S); O < u && T < B; ) M > k == M > -k ? (S = d - ((x = d + k) - (I = x - d)) + (k - I), k = _[++O]) : (S = d - ((x = d + M) - (I = x - d)) + (M - I), M = m[++T]), d = x, S !== 0 && (v[D++] = S);
        for (; O < u; ) S = d - ((x = d + k) - (I = x - d)) + (k - I), k = _[++O], d = x, S !== 0 && (v[D++] = S);
        for (; T < B; ) S = d - ((x = d + M) - (I = x - d)) + (M - I), M = m[++T], d = x, S !== 0 && (v[D++] = S);
        return d === 0 && D !== 0 || (v[D++] = d), D;
      }
      function r(u) {
        return new Float64Array(u);
      }
      const a = 33306690738754716e-32, l = 22204460492503146e-32, c = 11093356479670487e-47, h = r(4), f = r(8), p = r(12), y = r(16), b = r(4);
      e.orient2d = function(u, _, B, m, v, d) {
        const x = (_ - d) * (B - v), S = (u - v) * (m - d), I = x - S;
        if (x === 0 || S === 0 || x > 0 != S > 0) return I;
        const k = Math.abs(x + S);
        return Math.abs(I) >= a * k ? I : -(function(M, O, T, D, X, g, A) {
          let E, N, C, P, w, F, $, R, q, Y, j, V, H, G, W, J, Z, Q;
          const at = M - X, ft = T - X, it = O - g, st = D - g;
          w = (W = (R = at - ($ = (F = 134217729 * at) - (F - at))) * (Y = st - (q = (F = 134217729 * st) - (F - st))) - ((G = at * st) - $ * q - R * q - $ * Y)) - (j = W - (Z = (R = it - ($ = (F = 134217729 * it) - (F - it))) * (Y = ft - (q = (F = 134217729 * ft) - (F - ft))) - ((J = it * ft) - $ * q - R * q - $ * Y))), h[0] = W - (j + w) + (w - Z), w = (H = G - ((V = G + j) - (w = V - G)) + (j - w)) - (j = H - J), h[1] = H - (j + w) + (w - J), w = (Q = V + j) - V, h[2] = V - (Q - w) + (j - w), h[3] = Q;
          let Ot = (function(qn, Ye) {
            let Le = Ye[0];
            for (let xe = 1; xe < qn; xe++) Le += Ye[xe];
            return Le;
          })(4, h), Ut = l * A;
          if (Ot >= Ut || -Ot >= Ut || (E = M - (at + (w = M - at)) + (w - X), C = T - (ft + (w = T - ft)) + (w - X), N = O - (it + (w = O - it)) + (w - g), P = D - (st + (w = D - st)) + (w - g), E === 0 && N === 0 && C === 0 && P === 0) || (Ut = c * A + s * Math.abs(Ot), (Ot += at * P + st * E - (it * C + ft * N)) >= Ut || -Ot >= Ut)) return Ot;
          w = (W = (R = E - ($ = (F = 134217729 * E) - (F - E))) * (Y = st - (q = (F = 134217729 * st) - (F - st))) - ((G = E * st) - $ * q - R * q - $ * Y)) - (j = W - (Z = (R = N - ($ = (F = 134217729 * N) - (F - N))) * (Y = ft - (q = (F = 134217729 * ft) - (F - ft))) - ((J = N * ft) - $ * q - R * q - $ * Y))), b[0] = W - (j + w) + (w - Z), w = (H = G - ((V = G + j) - (w = V - G)) + (j - w)) - (j = H - J), b[1] = H - (j + w) + (w - J), w = (Q = V + j) - V, b[2] = V - (Q - w) + (j - w), b[3] = Q;
          const Rn = o(4, h, 4, b, f);
          w = (W = (R = at - ($ = (F = 134217729 * at) - (F - at))) * (Y = P - (q = (F = 134217729 * P) - (F - P))) - ((G = at * P) - $ * q - R * q - $ * Y)) - (j = W - (Z = (R = it - ($ = (F = 134217729 * it) - (F - it))) * (Y = C - (q = (F = 134217729 * C) - (F - C))) - ((J = it * C) - $ * q - R * q - $ * Y))), b[0] = W - (j + w) + (w - Z), w = (H = G - ((V = G + j) - (w = V - G)) + (j - w)) - (j = H - J), b[1] = H - (j + w) + (w - J), w = (Q = V + j) - V, b[2] = V - (Q - w) + (j - w), b[3] = Q;
          const Yn = o(Rn, f, 4, b, p);
          w = (W = (R = E - ($ = (F = 134217729 * E) - (F - E))) * (Y = P - (q = (F = 134217729 * P) - (F - P))) - ((G = E * P) - $ * q - R * q - $ * Y)) - (j = W - (Z = (R = N - ($ = (F = 134217729 * N) - (F - N))) * (Y = C - (q = (F = 134217729 * C) - (F - C))) - ((J = N * C) - $ * q - R * q - $ * Y))), b[0] = W - (j + w) + (w - Z), w = (H = G - ((V = G + j) - (w = V - G)) + (j - w)) - (j = H - J), b[1] = H - (j + w) + (w - J), w = (Q = V + j) - V, b[2] = V - (Q - w) + (j - w), b[3] = Q;
          const Ln = o(Yn, p, 4, b, y);
          return y[Ln - 1];
        })(u, _, B, m, v, d, k);
      }, e.orient2dfast = function(u, _, B, m, v, d) {
        return (_ - d) * (B - v) - (u - v) * (m - d);
      }, Object.defineProperty(e, "__esModule", { value: !0 });
    });
  })(Ht, Ht.exports)), Ht.exports;
}
var an;
function Fr() {
  if (an) return he.exports;
  an = 1;
  var i = kr(), t = Er, e = Br(), n = Tr().orient2d;
  t.default && (t = t.default), he.exports = s, he.exports.default = s;
  function s(d, x, S) {
    x = Math.max(0, x === void 0 ? 2 : x), S = S || 0;
    var I = y(d), k = new i(16);
    k.toBBox = function($) {
      return {
        minX: $[0],
        minY: $[1],
        maxX: $[0],
        maxY: $[1]
      };
    }, k.compareMinX = function($, R) {
      return $[0] - R[0];
    }, k.compareMinY = function($, R) {
      return $[1] - R[1];
    }, k.load(d);
    for (var M = [], O = 0, T; O < I.length; O++) {
      var D = I[O];
      k.remove(D), T = b(D, T), M.push(T);
    }
    var X = new i(16);
    for (O = 0; O < M.length; O++) X.insert(p(M[O]));
    for (var g = x * x, A = S * S; M.length; ) {
      var E = M.shift(), N = E.p, C = E.next.p, P = u(N, C);
      if (!(P < A)) {
        var w = P / g;
        D = o(k, E.prev.p, N, C, E.next.next.p, w, X), D && Math.min(u(D, N), u(D, C)) <= w && (M.push(E), M.push(b(D, E)), k.remove(D), X.remove(E), X.insert(p(E)), X.insert(p(E.next)));
      }
    }
    E = T;
    var F = [];
    do
      F.push(E.p), E = E.next;
    while (E !== T);
    return F.push(E.p), F;
  }
  function o(d, x, S, I, k, M, O) {
    for (var T = new t([], r), D = d.data; D; ) {
      for (var X = 0; X < D.children.length; X++) {
        var g = D.children[X], A = D.leaf ? _(g, S, I) : a(S, I, g);
        A > M || T.push({
          node: g,
          dist: A
        });
      }
      for (; T.length && !T.peek().node.children; ) {
        var E = T.pop(), N = E.node, C = _(N, x, S), P = _(N, I, k);
        if (E.dist < C && E.dist < P && c(S, N, O) && c(I, N, O)) return N;
      }
      D = T.pop(), D && (D = D.node);
    }
    return null;
  }
  function r(d, x) {
    return d.dist - x.dist;
  }
  function a(d, x, S) {
    if (l(d, S) || l(x, S)) return 0;
    var I = B(d[0], d[1], x[0], x[1], S.minX, S.minY, S.maxX, S.minY);
    if (I === 0) return 0;
    var k = B(d[0], d[1], x[0], x[1], S.minX, S.minY, S.minX, S.maxY);
    if (k === 0) return 0;
    var M = B(d[0], d[1], x[0], x[1], S.maxX, S.minY, S.maxX, S.maxY);
    if (M === 0) return 0;
    var O = B(d[0], d[1], x[0], x[1], S.minX, S.maxY, S.maxX, S.maxY);
    return O === 0 ? 0 : Math.min(I, k, M, O);
  }
  function l(d, x) {
    return d[0] >= x.minX && d[0] <= x.maxX && d[1] >= x.minY && d[1] <= x.maxY;
  }
  function c(d, x, S) {
    for (var I = Math.min(d[0], x[0]), k = Math.min(d[1], x[1]), M = Math.max(d[0], x[0]), O = Math.max(d[1], x[1]), T = S.search({ minX: I, minY: k, maxX: M, maxY: O }), D = 0; D < T.length; D++)
      if (f(T[D].p, T[D].next.p, d, x)) return !1;
    return !0;
  }
  function h(d, x, S) {
    return n(d[0], d[1], x[0], x[1], S[0], S[1]);
  }
  function f(d, x, S, I) {
    return d !== I && x !== S && h(d, x, S) > 0 != h(d, x, I) > 0 && h(S, I, d) > 0 != h(S, I, x) > 0;
  }
  function p(d) {
    var x = d.p, S = d.next.p;
    return d.minX = Math.min(x[0], S[0]), d.minY = Math.min(x[1], S[1]), d.maxX = Math.max(x[0], S[0]), d.maxY = Math.max(x[1], S[1]), d;
  }
  function y(d) {
    for (var x = d[0], S = d[0], I = d[0], k = d[0], M = 0; M < d.length; M++) {
      var O = d[M];
      O[0] < x[0] && (x = O), O[0] > I[0] && (I = O), O[1] < S[1] && (S = O), O[1] > k[1] && (k = O);
    }
    var T = [x, S, I, k], D = T.slice();
    for (M = 0; M < d.length; M++)
      e(d[M], T) || D.push(d[M]);
    return v(D);
  }
  function b(d, x) {
    var S = {
      p: d,
      prev: null,
      next: null,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };
    return x ? (S.next = x.next, S.prev = x, x.next.prev = S, x.next = S) : (S.prev = S, S.next = S), S;
  }
  function u(d, x) {
    var S = d[0] - x[0], I = d[1] - x[1];
    return S * S + I * I;
  }
  function _(d, x, S) {
    var I = x[0], k = x[1], M = S[0] - I, O = S[1] - k;
    if (M !== 0 || O !== 0) {
      var T = ((d[0] - I) * M + (d[1] - k) * O) / (M * M + O * O);
      T > 1 ? (I = S[0], k = S[1]) : T > 0 && (I += M * T, k += O * T);
    }
    return M = d[0] - I, O = d[1] - k, M * M + O * O;
  }
  function B(d, x, S, I, k, M, O, T) {
    var D = S - d, X = I - x, g = O - k, A = T - M, E = d - k, N = x - M, C = D * D + X * X, P = D * g + X * A, w = g * g + A * A, F = D * E + X * N, $ = g * E + A * N, R = C * w - P * P, q, Y, j, V, H = R, G = R;
    R === 0 ? (Y = 0, H = 1, V = $, G = w) : (Y = P * $ - w * F, V = C * $ - P * F, Y < 0 ? (Y = 0, V = $, G = w) : Y > H && (Y = H, V = $ + P, G = w)), V < 0 ? (V = 0, -F < 0 ? Y = 0 : -F > C ? Y = H : (Y = -F, H = C)) : V > G && (V = G, -F + P < 0 ? Y = 0 : -F + P > C ? Y = H : (Y = -F + P, H = C)), q = Y === 0 ? 0 : Y / H, j = V === 0 ? 0 : V / G;
    var W = (1 - q) * d + q * S, J = (1 - q) * x + q * I, Z = (1 - j) * k + j * O, Q = (1 - j) * M + j * T, at = Z - W, ft = Q - J;
    return at * at + ft * ft;
  }
  function m(d, x) {
    return d[0] === x[0] ? d[1] - x[1] : d[0] - x[0];
  }
  function v(d) {
    d.sort(m);
    for (var x = [], S = 0; S < d.length; S++) {
      for (; x.length >= 2 && h(x[x.length - 2], x[x.length - 1], d[S]) <= 0; )
        x.pop();
      x.push(d[S]);
    }
    for (var I = [], k = d.length - 1; k >= 0; k--) {
      for (; I.length >= 2 && h(I[I.length - 2], I[I.length - 1], d[k]) <= 0; )
        I.pop();
      I.push(d[k]);
    }
    return I.pop(), x.pop(), x.concat(I);
  }
  return he.exports;
}
var Nr = Fr();
const Cr = /* @__PURE__ */ xr(Nr);
function cn(i, t = {}) {
  t.concavity = t.concavity || 1 / 0;
  const e = [];
  if (Pe(i, (s) => {
    e.push([s[0], s[1]]);
  }), !e.length)
    return null;
  const n = Cr(e, t.concavity);
  return n.length > 3 ? re([n], t.properties) : null;
}
const ln = Math.pow(2, -52), ue = new Uint32Array(512);
class Xe {
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
  static from(t, e = Rr, n = Yr) {
    const s = t.length, o = new Float64Array(s * 2);
    for (let r = 0; r < s; r++) {
      const a = t[r];
      o[2 * r] = e(a), o[2 * r + 1] = n(a);
    }
    return new Xe(o);
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
    let a = 1 / 0, l = 1 / 0, c = -1 / 0, h = -1 / 0;
    for (let M = 0; M < r; M++) {
      const O = t[2 * M], T = t[2 * M + 1];
      O < a && (a = O), T < l && (l = T), O > c && (c = O), T > h && (h = T), this._ids[M] = M;
    }
    const f = (a + c) / 2, p = (l + h) / 2;
    let y = 0, b = 0, u = 0;
    for (let M = 0, O = 1 / 0; M < r; M++) {
      const T = Ne(f, p, t[2 * M], t[2 * M + 1]);
      T < O && (y = M, O = T);
    }
    const _ = t[2 * y], B = t[2 * y + 1];
    for (let M = 0, O = 1 / 0; M < r; M++) {
      if (M === y) continue;
      const T = Ne(_, B, t[2 * M], t[2 * M + 1]);
      T < O && T > 0 && (b = M, O = T);
    }
    let m = t[2 * b], v = t[2 * b + 1], d = 1 / 0;
    for (let M = 0; M < r; M++) {
      if (M === y || M === b) continue;
      const O = $r(_, B, m, v, t[2 * M], t[2 * M + 1]);
      O < d && (u = M, d = O);
    }
    let x = t[2 * u], S = t[2 * u + 1];
    if (d === 1 / 0) {
      for (let T = 0; T < r; T++)
        this._dists[T] = t[2 * T] - t[0] || t[2 * T + 1] - t[1];
      Vt(this._ids, this._dists, 0, r - 1);
      const M = new Uint32Array(r);
      let O = 0;
      for (let T = 0, D = -1 / 0; T < r; T++) {
        const X = this._ids[T], g = this._dists[X];
        g > D && (M[O++] = X, D = g);
      }
      this.hull = M.subarray(0, O), this.triangles = new Uint32Array(0), this.halfedges = new Int32Array(0);
      return;
    }
    if (dt(_, B, m, v, x, S) < 0) {
      const M = b, O = m, T = v;
      b = u, m = x, v = S, u = M, x = O, S = T;
    }
    const I = Xr(_, B, m, v, x, S);
    this._cx = I.x, this._cy = I.y;
    for (let M = 0; M < r; M++)
      this._dists[M] = Ne(t[2 * M], t[2 * M + 1], I.x, I.y);
    Vt(this._ids, this._dists, 0, r - 1), this._hullStart = y;
    let k = 3;
    n[y] = e[u] = b, n[b] = e[y] = u, n[u] = e[b] = y, s[y] = 0, s[b] = 1, s[u] = 2, o.fill(-1), o[this._hashKey(_, B)] = y, o[this._hashKey(m, v)] = b, o[this._hashKey(x, S)] = u, this.trianglesLen = 0, this._addTriangle(y, b, u, -1, -1, -1);
    for (let M = 0, O = 0, T = 0; M < this._ids.length; M++) {
      const D = this._ids[M], X = t[2 * D], g = t[2 * D + 1];
      if (M > 0 && Math.abs(X - O) <= ln && Math.abs(g - T) <= ln || (O = X, T = g, D === y || D === b || D === u)) continue;
      let A = 0;
      for (let w = 0, F = this._hashKey(X, g); w < this._hashSize && (A = o[(F + w) % this._hashSize], !(A !== -1 && A !== n[A])); w++)
        ;
      A = e[A];
      let E = A, N;
      for (; N = n[E], dt(X, g, t[2 * E], t[2 * E + 1], t[2 * N], t[2 * N + 1]) >= 0; )
        if (E = N, E === A) {
          E = -1;
          break;
        }
      if (E === -1) continue;
      let C = this._addTriangle(E, D, n[E], -1, -1, s[E]);
      s[D] = this._legalize(C + 2), s[E] = C, k++;
      let P = n[E];
      for (; N = n[P], dt(X, g, t[2 * P], t[2 * P + 1], t[2 * N], t[2 * N + 1]) < 0; )
        C = this._addTriangle(P, D, N, s[D], -1, s[P]), s[D] = this._legalize(C + 2), n[P] = P, k--, P = N;
      if (E === A)
        for (; N = e[E], dt(X, g, t[2 * N], t[2 * N + 1], t[2 * E], t[2 * E + 1]) < 0; )
          C = this._addTriangle(N, D, E, -1, s[E], s[N]), this._legalize(C + 2), s[N] = C, n[E] = E, k--, E = N;
      this._hullStart = e[D] = E, n[E] = e[P] = D, n[D] = P, o[this._hashKey(X, g)] = D, o[this._hashKey(t[2 * E], t[2 * E + 1])] = E;
    }
    this.hull = new Uint32Array(k);
    for (let M = 0, O = this._hullStart; M < k; M++)
      this.hull[M] = O, O = n[O];
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
    return Math.floor(Dr(t - this._cx, e - this._cy) * this._hashSize) % this._hashSize;
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
      const a = n[t], l = t - t % 3;
      if (r = l + (t + 2) % 3, a === -1) {
        if (o === 0) break;
        t = ue[--o];
        continue;
      }
      const c = a - a % 3, h = l + (t + 1) % 3, f = c + (a + 2) % 3, p = e[r], y = e[t], b = e[h], u = e[f];
      if (Pr(
        s[2 * p],
        s[2 * p + 1],
        s[2 * y],
        s[2 * y + 1],
        s[2 * b],
        s[2 * b + 1],
        s[2 * u],
        s[2 * u + 1]
      )) {
        e[t] = u, e[a] = p;
        const B = n[f];
        if (B === -1) {
          let v = this._hullStart;
          do {
            if (this._hullTri[v] === f) {
              this._hullTri[v] = t;
              break;
            }
            v = this._hullPrev[v];
          } while (v !== this._hullStart);
        }
        this._link(t, B), this._link(a, n[r]), this._link(r, f);
        const m = c + (a + 1) % 3;
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
function Dr(i, t) {
  const e = i / (Math.abs(i) + Math.abs(t));
  return (t > 0 ? 3 - e : 1 + e) / 4;
}
function Ne(i, t, e, n) {
  const s = i - e, o = t - n;
  return s * s + o * o;
}
function Pr(i, t, e, n, s, o, r, a) {
  const l = i - r, c = t - a, h = e - r, f = n - a, p = s - r, y = o - a, b = l * l + c * c, u = h * h + f * f, _ = p * p + y * y;
  return l * (f * _ - u * y) - c * (h * _ - u * p) + b * (h * y - f * p) < 0;
}
function $r(i, t, e, n, s, o) {
  const r = e - i, a = n - t, l = s - i, c = o - t, h = r * r + a * a, f = l * l + c * c, p = 0.5 / (r * c - a * l), y = (c * h - a * f) * p, b = (r * f - l * h) * p;
  return y * y + b * b;
}
function Xr(i, t, e, n, s, o) {
  const r = e - i, a = n - t, l = s - i, c = o - t, h = r * r + a * a, f = l * l + c * c, p = 0.5 / (r * c - a * l), y = i + (c * h - a * f) * p, b = t + (r * f - l * h) * p;
  return { x: y, y: b };
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
    Gt(i, s, o), t[i[e]] > t[i[n]] && Gt(i, e, n), t[i[o]] > t[i[n]] && Gt(i, o, n), t[i[e]] > t[i[o]] && Gt(i, e, o);
    const a = i[o], l = t[a];
    for (; ; ) {
      do
        o++;
      while (t[i[o]] < l);
      do
        r--;
      while (t[i[r]] > l);
      if (r < o) break;
      Gt(i, o, r);
    }
    i[e + 1] = i[r], i[r] = a, n - o + 1 >= r - e ? (Vt(i, t, o, n), Vt(i, t, e, r - 1)) : (Vt(i, t, e, r - 1), Vt(i, t, o, n));
  }
}
function Gt(i, t, e) {
  const n = i[t];
  i[t] = i[e], i[e] = n;
}
function Rr(i) {
  return i[0];
}
function Yr(i) {
  return i[1];
}
class Lr {
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
class fn extends Lr {
  constructor(t) {
    super(8, new Uint8Array(Math.ceil(t / 8)).fill(0));
  }
}
function At(i) {
  return i % 3 === 2 ? i - 2 : i + 1;
}
function _t(i) {
  return i % 3 === 0 ? i + 2 : i - 1;
}
function hn(i, t, e, n, s, o, r, a) {
  const l = dt(i, t, s, o, r, a), c = dt(e, n, s, o, r, a);
  if (l > 0 && c > 0 || l < 0 && c < 0)
    return !1;
  const h = dt(s, o, i, t, e, n), f = dt(r, a, i, t, e, n);
  return h > 0 && f > 0 || h < 0 && f < 0 ? !1 : l === 0 && c === 0 && h === 0 && f === 0 ? !(Math.max(s, r) < Math.min(i, e) || Math.max(i, e) < Math.min(s, r) || Math.max(o, a) < Math.min(t, n) || Math.max(t, n) < Math.min(o, a)) : !0;
}
class qr {
  /**
   * The triangulation object from Delaunator.
   */
  del;
  constructor(t) {
    this.del = t;
  }
}
class Zt extends qr {
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
    let a = 0, l = o;
    do {
      if (++a > r)
        throw new Error(
          `Constraining edge [${t}, ${e}] exceeded the iteration limit`
        );
      const f = n[l], p = At(l);
      if (f === e)
        return this.protect(l);
      const y = _t(l), b = n[y];
      if (b === e)
        return this.protect(p), p;
      if (this.intersectSegments(t, e, b, f)) {
        l = y;
        break;
      }
      l = s[p];
    } while (l !== -1 && l !== o);
    let c = l, h = -1;
    for (; l !== -1; ) {
      if (++a > r)
        throw new Error(
          `Constraining edge [${t}, ${e}] exceeded the iteration limit`
        );
      const f = s[l], p = _t(l), y = _t(f), b = At(f);
      if (f === -1)
        throw new Error("Constraining edge exited the hull");
      if (this.consd.has(l))
        throw new Error("Edge intersects already constrained edge");
      if (this.isCollinear(t, e, n[l]) || this.isCollinear(t, e, n[f]))
        throw new Error("Constraining edge intersects point");
      if (!this.intersectSegments(
        n[l],
        n[f],
        n[p],
        n[y]
      )) {
        if (h === -1 && (h = l), n[y] === e) {
          if (l === h)
            throw new Error("Infinite loop: non-convex quadrilateral");
          l = h, h = -1;
          continue;
        }
        if (this.intersectSegments(
          t,
          e,
          n[y],
          n[f]
        ))
          l = y;
        else if (this.intersectSegments(
          t,
          e,
          n[b],
          n[y]
        ))
          l = b;
        else if (h === l)
          throw new Error("Infinite loop: no further intersect after non-convex");
        continue;
      }
      if (this.flipDiagonal(l), this.intersectSegments(
        t,
        e,
        n[p],
        n[y]
      ) && (h === -1 && (h = p), h === p))
        throw new Error("Infinite loop: flipped diagonal still intersects");
      n[y] === e ? (c = y, l = h, h = -1) : this.intersectSegments(
        t,
        e,
        n[b],
        n[y]
      ) && (l = b);
    }
    return this.protect(c), this.delaunify(!0), this.findEdge(t, e);
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
        const l = e[a];
        l !== -1 && (n.delete(l), this.isDelaunay(a) || (this.flipDiagonal(a), r++));
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
    const { triangles: n, halfedges: s } = this.del, o = n.length / 3, r = (b, u, _) => {
      const B = t(u), m = t(_);
      return t(b).some((v) => B.includes(v) && m.includes(v));
    }, a = (b) => r(n[b * 3], n[b * 3 + 1], n[b * 3 + 2]), l = (b, u, _, B) => Math.sign(dt(b[u * 2], b[u * 2 + 1], b[_ * 2], b[_ * 2 + 1], b[B * 2], b[B * 2 + 1])), c = e.map((b) => {
      let u = 0;
      for (let _ = 0; _ < o; _++) u += l(b, n[_ * 3], n[_ * 3 + 1], n[_ * 3 + 2]);
      return u < 0 ? -1 : 1;
    }), h = (b) => {
      if (this.consd.has(b)) return !1;
      const u = s[b];
      if (u === -1) return !1;
      const _ = n[b], B = n[At(b)], m = n[_t(b)], v = n[_t(u)];
      return e.every((d, x) => l(d, m, _, v) === c[x] && l(d, v, B, m) === c[x]);
    };
    let f = 0, p = !0;
    for (; p; ) {
      p = !1;
      for (let b = 0; b < o; b++)
        if (a(b))
          for (let u = 0; u < 3; u++) {
            const _ = b * 3 + u;
            if (!h(_)) continue;
            const B = s[_], m = n[_], v = n[At(_)], d = n[_t(_)], x = n[_t(B)];
            if (!(r(d, m, x) && r(x, v, d))) {
              this.protect(this.flipDiagonal(_)), f++, p = !0;
              break;
            }
          }
    }
    let y = 0;
    for (let b = 0; b < o; b++) a(b) && y++;
    return { flips: f, remaining: y };
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
    let r = n, a, l = 0;
    do {
      if (++l > s.length)
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
    const { triangles: e, halfedges: n } = this.del, s = this.flips, o = this.consd, r = n[t], a = _t(t), l = At(t), c = _t(r), h = At(r), f = n[a], p = n[c];
    if (o.has(t))
      throw new Error("Trying to flip a constrained edge");
    return e[t] = e[c], n[t] = p, s.set(t, s.has(c)) || o.set(t, o.has(c)), p !== -1 && (n[p] = t), n[a] = c, e[r] = e[a], n[r] = f, s.set(r, s.has(a)) || o.set(r, o.has(a)), f !== -1 && (n[f] = r), n[c] = a, this.markFlip(t), this.markFlip(l), this.markFlip(r), this.markFlip(h), s.add(a), o.delete(a), s.add(c), o.delete(c), this.updateVert(t), this.updateVert(l), this.updateVert(r), this.updateVert(h), a;
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
    return rr(
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
    const o = e[_t(t)], r = e[t], a = e[At(t)], l = e[_t(s)];
    return !this.inCircle(o, r, a, l);
  }
  /**
   * Update the vertex -> incoming edge map.
   */
  updateVert(t) {
    const { triangles: e, halfedges: n } = this.del, s = this.vertMap, o = e[t];
    let r = _t(t), a = n[r];
    for (; a !== -1 && a !== t; )
      r = _t(a), a = n[r];
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
    (u) => u.geometry.coordinates
  );
  let r = s?.snapshot ? Zt.restore(s.snapshot) : void 0;
  const a = r ? void 0 : Xe.from(o);
  let l = r ? r.del : a, c = 0, h;
  const f = [];
  if (l.triangles.length !== 0 && (t.length !== 0 || n)) {
    if (!r) {
      r = new Zt(l);
      try {
        r.constrainAll(t);
      } catch (B) {
        if (!n?.allowUnusableBoundary) throw B;
        return { tin: xt([]), remaining: 0, hasBoundary: !1, hull: [] };
      }
      s && (s.snapshot = r.snapshot());
    }
    const u = n ? s?.snapshot ?? r.snapshot() : void 0, _ = (B) => {
      const m = Zt.restore(u);
      return m.constrainAll(B), m;
    };
    for (const B of n?.hull ?? [])
      try {
        r.constrainOne(B[0], B[1]), f.push(B);
      } catch {
        r = _(f);
      }
    n?.boundary && (h = Vr(r, n.boundary), h || (r = _(f))), n && ({ remaining: c } = r.forbidGroupTriangles(
      n.groupsOf,
      n.planes
    ), c -= h?.size ?? 0), l = r.del;
  }
  const p = [];
  for (let u = 0; u < l.triangles.length; u += 3)
    h?.has(u / 3) || p.push([l.triangles[u], l.triangles[u + 1], l.triangles[u + 2]]);
  const y = ["a", "b", "c"];
  return { tin: xt(
    p.map((u) => {
      const _ = {}, B = u.map((m, v) => {
        const d = i.features[m], x = d.geometry.coordinates, S = [x[0], x[1]];
        return x.length === 3 ? S[2] = x[2] : _[y[v]] = d.properties[e], S;
      });
      return B[3] = B[0], re([B], _);
    })
  ), remaining: c, hasBoundary: h !== void 0, hull: f };
}
function Vr(i, t) {
  try {
    i.constrainAll(t);
  } catch {
    return;
  }
  const e = new Map(t), { triangles: n, halfedges: s } = i.del, o = (c) => {
    const h = n[c], f = n[At(c)];
    return e.get(h) === f || e.get(f) === h;
  }, r = /* @__PURE__ */ new Set(), a = [], l = (c) => {
    const h = Math.floor(c / 3);
    r.has(h) || (r.add(h), a.push(h));
  };
  for (let c = 0; c < s.length; c++)
    s[c] === -1 && !o(c) && l(c);
  for (let c = 0; c < a.length; c++)
    for (let h = a[c] * 3; h < a[c] * 3 + 3; h++) {
      if (!e.has(n[h])) return;
      s[h] !== -1 && !o(h) && l(s[h]);
    }
  return r;
}
function un(i) {
  const t = /* @__PURE__ */ new Set(), e = [];
  if (i.forEach(([l, c], h) => {
    const f = `${l}:${c}`;
    t.has(f) || (t.add(f), e.push({ i: h, x: l, y: c }));
  }), e.length < 3) return [];
  const n = (l, c, h) => dt(l.x, l.y, c.x, c.y, h.x, h.y), s = [...e].sort((l, c) => l.x - c.x || l.y - c.y), o = (l) => {
    const c = [];
    for (const h of l) {
      for (; c.length >= 2 && n(c[c.length - 2], c[c.length - 1], h) <= 0; ) c.pop();
      c.push(h);
    }
    return c.pop(), c;
  }, r = [...o(s), ...o([...s].reverse())];
  if (r.length < 3) return [];
  const a = [];
  for (let l = 0; l < r.length; l++) {
    const c = r[l], h = r[(l + 1) % r.length], f = h.x - c.x, p = h.y - c.y, y = f * f + p * p, b = e.filter((_) => _ !== c && _ !== h && n(c, h, _) === 0).map((_) => ({ r: _, t: ((_.x - c.x) * f + (_.y - c.y) * p) / y })).filter(({ t: _ }) => _ > 0 && _ < 1).sort((_, B) => _.t - B.t).map(({ r: _ }) => _), u = [c, ...b, h];
    for (let _ = 0; _ + 1 < u.length; _++) a.push([u[_].i, u[_ + 1].i]);
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
    const o = (s + 1) % e, r = i[s], a = i[o], l = r.geometry.coordinates, c = Math.atan2(
      l[0] - n[0],
      l[1] - n[1]
    ), h = [t, r, a, t].map(
      (y) => y.geometry.coordinates
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
    }, p = xt([
      re([h], f)
    ]);
    return [c, p];
  }).reduce(
    (s, o) => (s[0].push(o[0]), s[1].push(o[1]), s),
    [[], []]
  );
}
const jr = [0.1, 0.15, 0.225, 0.34, 0.5];
function Ur(i, t) {
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
    const [a, l, c] = n.geometry.coordinates[0];
    pn(a, l, c) * pn(s.geom, o.geom, r.geom) * t <= 0 && e++;
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
    const l = (e * (n[(r + 1) % n.length] - n[r]) + s) % s;
    if (!(l > 0 && l < Math.PI)) return !1;
    o += l;
  }
  return Math.abs(o - s) < 1e-6;
}
function zr(i, t) {
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
  const { minx: a, maxx: l, miny: c, maxy: h, centroid: f } = i, p = l - a, y = h - c, b = e.forw.length, u = Array.from({ length: b }, () => []);
  let _ = 1;
  for (const [I, k] of e.edges)
    I < n && u[I].push(_), u[k].push(_), k < n && _++;
  const B = (I) => I.slice(0, b).map(({ geometry: k }) => k.coordinates), m = un(B(e.forw)), v = {
    forw: m.filter((I) => !o.has(ye(I))),
    bakw: un(B(e.bakw))
  }, d = [0], x = (I) => I >= b ? d : u[I];
  let S;
  for (const I of jr) {
    const k = r?.get(I) ?? { forwReuse: {} };
    r?.set(I, k);
    const M = k.vertices ?? (k.vertices = zr(
      t(
        {
          ...i,
          minx: a - I * p,
          maxx: l + I * p,
          miny: c - I * y,
          maxy: h + I * y
        },
        !0
      ),
      e
    ));
    if (s && (M.length < 4 || !M.every(({ bakw: Y }) => Y.every(Number.isFinite)))) continue;
    const O = M.map(
      ({ forw: Y, bakw: j }, V) => Kt(Y, j, `b${V}`)
    ), T = xt([...e.forw, ...O]), D = xt([
      ...e.bakw,
      ...O.map(Wt)
    ]), X = [T, D].map(
      ({ features: Y }) => Float64Array.from(
        Y.flatMap(
          ({
            geometry: {
              coordinates: [j, V]
            }
          }) => [j, V]
        )
      )
    ), A = s !== void 0 || mn(
      M.map((Y) => Y.forw),
      f.forw,
      -1
    ) && mn(
      M.map((Y) => Y.bakw),
      f.bakw,
      1
    ) ? M.map((Y, j) => [
      b + j,
      b + (j + 1) % M.length
    ]) : void 0, E = { groupsOf: x, planes: X, boundary: A, allowUnusableBoundary: s !== void 0 }, N = s?.orientation ?? -1, C = Ce(
      T,
      e.edges,
      "target",
      { ...E, hull: v.forw },
      k.forwReuse
    ), P = k.geographic ?? (k.geographic = (() => {
      const Y = Ce(D, e.edges, "target", {
        ...E,
        hull: v.bakw
      });
      return { built: Y, flips: ve(Y.tin, N) };
    })()), w = P.built, F = C.tin, $ = {
      ...w.tin,
      features: [...w.tin.features]
    }, R = ve(F, N) + P.flips, q = {
      vertices: M,
      forw: F,
      bakw: $,
      diagnostics: {
        margin: I,
        boundaryTriangleFlips: R,
        remainingForbiddenTriangles: C.remaining + w.remaining
      },
      hasMapBoundary: C.hasBoundary,
      hasBoundary: C.hasBoundary && w.hasBoundary,
      forwHull: { all: m, applied: C.hull }
    };
    if (s) {
      if (s.accept(q)) return q;
      continue;
    }
    if (R === 0 && q.hasBoundary)
      return q;
    Ur(q, S) && (S = q);
  }
  return S;
}
const Gr = 256 * Number.EPSILON;
function Hr(i, t) {
  const e = [i, t].map((s) => {
    const o = s.map((a, l, c) => {
      if (l === 0) return 0;
      const h = c[l - 1];
      return Math.sqrt(
        Math.pow(a[0] - h[0], 2) + Math.pow(a[1] - h[1], 2)
      );
    }), r = o.reduce((a, l, c) => c === 0 ? [0] : (a.push(a[c - 1] + l), a), []);
    return r.map((a, l, c) => {
      const h = a / c[c.length - 1];
      return [s[l], o[l], r[l], h];
    });
  }), n = [];
  return e.forEach((s, o) => {
    const r = e[o ? 0 : 1];
    s.forEach((a, l) => {
      if (l === 0 || l === s.length - 1 || a[4] === "handled")
        return;
      const c = a[0], h = a[3];
      let f, p = 1 / 0;
      for (let y = 1; y < r.length - 1; y++) {
        const b = r[y];
        if (b[4] === "handled") continue;
        const u = Math.abs(b[3] - h);
        u <= Gr && u < p && (f = b, p = u);
      }
      if (f) {
        f[4] = "handled", a[4] = "handled", n.push(
          o === 0 ? [c, f[0], h] : [f[0], c, h]
        );
        return;
      }
      for (let y = 0; y < r.length - 1; y++) {
        const b = r[y], u = r[y + 1], _ = b[3], B = u[3];
        if (_ < h && B > h) {
          const m = (h - _) / (B - _), v = [
            (u[0][0] - b[0][0]) * m + b[0][0],
            (u[0][1] - b[0][1]) * m + b[0][1]
          ];
          n.push(
            o === 0 ? [c, v, h] : [v, c, h]
          );
          return;
        }
      }
    });
  }), n.sort((s, o) => s[2] - o[2]);
}
const wn = 1e-9;
function Kr(i, t) {
  const e = [[], [], [], []], n = [];
  return Object.keys(i).forEach((s) => {
    const o = i[s], r = o.forw, a = o.bakw, l = [
      r[0] - t.forw[0],
      r[1] - t.forw[1]
    ], c = [
      a[0] - t.bakw[0],
      t.bakw[1] - a[1]
    ], h = { forw: l, bakw: c };
    if (n.push(h), l[0] === 0 || l[1] === 0)
      return;
    let f = 0;
    l[0] > 0 && (f += 1), l[1] > 0 && (f += 2), e[f].push(h);
  }), { perQuad: e, aggregate: n };
}
function Cn(i) {
  let t = 1 / 0, e = 0, n = 0;
  return i.forEach((s) => {
    const { forw: o, bakw: r } = s, a = Math.hypot(o[0], o[1]), l = Math.hypot(r[0], r[1]);
    if (l === 0) return;
    const c = a / l, h = Math.atan2(o[0], o[1]) - Math.atan2(r[0], r[1]);
    t = Math.min(t, c), e += Math.cos(h), n += Math.sin(h);
  }), isFinite(t) ? [t, Math.atan2(n, e)] : [1, 0];
}
const Wr = 0.6, Jr = 3, Qr = 0.5;
function Zr(i) {
  let t = 0, e = 0, n = 0, s = 0;
  if (i.forEach(({ forw: r, bakw: a }) => {
    t += r[1] * a[1] + r[0] * a[0], e += r[0] * a[1] - r[1] * a[0], n += a[0] * a[0] + a[1] * a[1], s += r[0] * r[0] + r[1] * r[1];
  }), !(!(n > 0 && s > 0) || !(Math.hypot(t, e) / Math.sqrt(s * n) >= Qr)))
    return [Math.hypot(t, e) / n, Math.atan2(e, t)];
}
function ti(i) {
  const t = (s) => Math.hypot(s.forw[0], s.forw[1]), e = Math.max(...i.map(t)), n = i.filter((s) => t(s) >= Wr * e);
  return Zr(n.length >= Jr ? n : i) ?? Cn(i);
}
function ei(i, t, e, n) {
  const { perQuad: s, aggregate: o } = Kr(i, t), r = s.every((h) => h.length > 0), a = e === "birdeye" ? r ? s : [o] : [o], l = n === "farLsq" ? ti : Cn, c = a.map((h) => l(h));
  return c.length === 1 ? [c[0], c[0], c[0], c[0]] : c;
}
function ni(i, t) {
  let e = 0;
  return i[0] > t[0] && (e += 1), i[1] > t[1] && (e += 2), e;
}
function ri(i, t, e) {
  const n = [
    i[0] - t.forw[0],
    i[1] - t.forw[1]
  ], o = Math.sqrt(n[0] ** 2 + n[1] ** 2) / e[0], r = Math.atan2(n[0], n[1]) - e[1];
  return [
    t.bakw[0] + o * Math.sin(r),
    t.bakw[1] - o * Math.cos(r)
  ];
}
function ii(i, t, e, n) {
  const s = t[0] - i[0], o = t[1] - i[1];
  if (Math.abs(s) < 1e-12 && Math.abs(o) < 1e-12) return null;
  const r = n[0] - e[0], a = n[1] - e[1], l = e[0] - i[0], c = e[1] - i[1], h = s * a - o * r;
  if (Math.abs(h) < 1e-12) return null;
  const f = (l * a - c * r) / h, p = (l * o - c * s) / h;
  return f <= 1e-10 || p < -1e-10 || p > 1 + 1e-10 ? null : { t: f, point: [i[0] + f * s, i[1] + f * o] };
}
function si(i, t, e) {
  const n = e.length;
  let s = -1 / 0, o = null;
  for (let r = 0; r < n; r++) {
    const a = (r + 1) % n, l = ii(
      i,
      t,
      e[r].bakw,
      e[a].bakw
    );
    l && l.t > s && (s = l.t, o = l.point);
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
  const l = [];
  if (r !== 0)
    for (const h of [e, n]) {
      const f = (h - i[0]) / r;
      if (f > 0) {
        const p = i[1] + f * a;
        p >= s && p <= o && l.push({ t: f, x: h, y: p });
      }
    }
  if (a !== 0)
    for (const h of [s, o]) {
      const f = (h - i[1]) / a;
      if (f > 0) {
        const p = i[0] + f * r;
        p >= e && p <= n && l.push({ t: f, x: p, y: h });
      }
    }
  if (l.length === 0) return null;
  l.sort((h, f) => h.t - f.t);
  const c = l[0];
  return [c.x, c.y];
}
function bn(i, t, e) {
  const n = i.length, s = new Array(n).fill(1);
  for (const o of t)
    for (let r = 0; r < n; r++) {
      const a = (r + 1) % n, l = Ve([i[r].bakw, i[a].bakw]), c = Ve([e.bakw, o.bakw]), h = br(l, c);
      if (h.features.length > 0 && h.features[0].geometry) {
        const f = h.features[0], p = Math.sqrt(
          Math.pow(o.bakw[0] - e.bakw[0], 2) + Math.pow(o.bakw[1] - e.bakw[1], 2)
        ), y = Math.sqrt(
          Math.pow(f.geometry.coordinates[0] - e.bakw[0], 2) + Math.pow(f.geometry.coordinates[1] - e.bakw[1], 2)
        ), b = p / y;
        b > s[r] && (s[r] = b), b > s[a] && (s[a] = b);
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
function Re(i, t, e, n, s) {
  const { convexBuf: o, centroid: r, allGcps: a, minx: l, maxx: c, miny: h, maxy: f } = i, p = s ? void 0 : ei(o, r, t, n), b = [
    [l, h],
    [c, h],
    [c, f],
    [l, f]
  ].map((k) => ({
    forw: k,
    bakw: s ? s(k) : ri(
      k,
      r,
      p[ni(k, r.forw)]
    )
  }));
  if (b.sort(
    (k, M) => Math.atan2(k.forw[0] - r.forw[0], k.forw[1] - r.forw[1]) - Math.atan2(M.forw[0] - r.forw[0], M.forw[1] - r.forw[1])
  ), s || bn(b, a, r), !e) return b;
  const u = 4, _ = b.map(
    (k) => Math.atan2(k.forw[0] - r.forw[0], k.forw[1] - r.forw[1])
  ), B = b.map(
    (k) => Math.atan2(
      k.bakw[0] - r.bakw[0],
      -(k.bakw[1] - r.bakw[1])
    )
  );
  function m(k) {
    for (let M = 0; M < u; M++) {
      const O = (M + 1) % u, T = _[M], D = M < u - 1 ? _[O] : _[O] + 2 * Math.PI;
      let X = k;
      for (; X < T; ) X += 2 * Math.PI;
      for (; X >= T + 2 * Math.PI; ) X -= 2 * Math.PI;
      if (X >= T && X < D)
        return { i: M, j: O, frac: (X - T) / (D - T) };
    }
    return { i: 0, j: 1, frac: 0 };
  }
  function v(k) {
    const { i: M, j: O, frac: T } = m(k), D = B[M];
    let g = B[O] - D;
    for (; g > Math.PI; ) g -= 2 * Math.PI;
    for (; g < -Math.PI; ) g += 2 * Math.PI;
    return D + T * g;
  }
  const d = new Set(
    b.map(
      (k) => Math.floor(yn(k.forw, r.forw) / 10) % 36
    )
  ), x = a.map((k) => ({
    forw: k.forw,
    bakw: k.bakw,
    angleDeg: yn(k.forw, r.forw),
    forwDist: Math.hypot(k.forw[0] - r.forw[0], k.forw[1] - r.forw[1])
  })), S = [];
  for (let k = 0; k < 36; k++) {
    if (d.has(k)) continue;
    const M = k * 10, O = x.filter((w) => {
      if (w.forwDist === 0) return !1;
      const F = ((w.angleDeg - M) % 360 + 360) % 360;
      return F < 10 + wn || F > 360 - wn;
    });
    let T = null;
    if (O.length > 0) {
      const w = O.reduce((F, $) => $.forwDist > F.forwDist ? $ : F);
      T = vn(r.forw, w.forw, l, c, h, f);
    }
    if (!T) {
      const w = (M + 5) % 360 * (Math.PI / 180), F = [
        r.forw[0] + Math.sin(w),
        r.forw[1] + Math.cos(w)
      ];
      T = vn(r.forw, F, l, c, h, f);
    }
    if (!T) continue;
    const [D, X] = T, g = 1e-9 * Math.max(c - l, f - h);
    if ([...b, ...S].some(
      (w) => Math.abs(w.forw[0] - D) <= g && Math.abs(w.forw[1] - X) <= g
    )) continue;
    if (s) {
      S.push({ forw: T, bakw: s(T) });
      continue;
    }
    const A = [T[0] - r.forw[0], T[1] - r.forw[1]], E = Math.atan2(A[0], A[1]), N = v(E), C = [
      r.bakw[0] + Math.sin(N),
      r.bakw[1] - Math.cos(N)
    ], P = si(r.bakw, C, b);
    P && S.push({ forw: T, bakw: P });
  }
  const I = [...b, ...S];
  return I.sort(
    (k, M) => Math.atan2(k.forw[0] - r.forw[0], k.forw[1] - r.forw[1]) - Math.atan2(M.forw[0] - r.forw[0], M.forw[1] - r.forw[1])
  ), s || bn(I, a, r), I;
}
function oi(i, t = !1) {
  return Re(i, "plain", t, t ? "farLsq" : "min");
}
function ai(i, t = !1) {
  return Re(i, "birdeye", t, "min");
}
function ci(i, t) {
  const e = /* @__PURE__ */ new Set();
  return Re(i, "plain", !0, "min", t).filter(({ forw: [n, s] }) => {
    const o = `${n}:${s}`;
    return e.has(o) ? !1 : (e.add(o), !0);
  });
}
function Gi(i) {
  return Dn(i, 1 / 0);
}
const xn = 1e5, li = 16;
function Dn(i, t) {
  return fi(i), new hi(i).findSegmentIntersections(t).map(
    (s) => Yt([s.x, s.y])
  );
}
function fi(i) {
  for (let t = 0, e = i.length; t < e; t++) {
    const n = i[t];
    ee(n) || Rt(
      "findIntersections() received invalid coordinates:",
      `line=${t}`,
      `points=${n}`
    );
    for (let s = 0, o = n.length; s < o; s++) {
      const r = n[s];
      (!ee(r) || !Number.isFinite(r[0]) || !Number.isFinite(r[1])) && Rt(
        "findIntersections() received non-finite coordinates:",
        `line=${t}`,
        `point=${s}`,
        `coordinates=${JSON.stringify(r)}`
      );
    }
  }
}
class hi {
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
    (o != this._xx.length || this._xx.length != this._yy.length) && Rt("ArcCollection#initXYData() Counting error"), this.initBounds(), this._arcIter = new Ti(this._xx, this._yy);
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
    let a = 0, l, c, h;
    for (let f = 0; f < s; f++)
      l = n[f], l > 0 && (c = f * 4, h = Fi(t, e, a, l), o[c++] = h[0], o[c++] = h[1], o[c++] = h[2], o[c] = h[3], a += l, r.mergeBounds(h));
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
    let l = n ? this._ii[s] : this._ii[s] + r - 1, c = l, h = 0;
    for (let f = 1; f < r; f++)
      c += a, (o === 0 || this._zz[c] >= o) && (e(l, c, this._xx, this._yy), l = c, h++);
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
    const e = this.getBounds(), n = e.ymin || 0, s = (e.ymax || 0) - n, o = this.calcSegmentIntersectionStripeCount(), r = new Uint32Array(o), a = o > 1 ? (v) => Math.floor((o - 1) * (v - n) / s) : () => 0, l = o + 1;
    let c;
    this.forEachSegment(
      (v, d, x, S) => {
        let I = a(S[v]);
        const k = a(S[d]);
        let M = 0;
        for (; r[I] = r[I] + 2, I != k; )
          M++, M > l && Rt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${o}`,
            `s1=${I}`,
            `s2=${k}`
          ), I += k > I ? 1 : -1;
      }
    );
    const h = this.getUint32Array(pi(r));
    let f = 0;
    const p = [];
    mi(r, (v) => {
      const d = f;
      f += v, p.push(h.subarray(d, f));
    }), gi(r, 0), this.forEachSegment(
      (v, d, x, S) => {
        let I = a(S[v]);
        const k = a(S[d]);
        let M, O, T = 0;
        for (; M = r[I], r[I] = M + 2, O = p[I], O[M] = v, O[M + 1] = d, I != k; )
          T++, T > l && Rt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${o}`,
            `s1=${I}`,
            `s2=${k}`
          ), I += k > I ? 1 : -1;
      }
    );
    const y = this.getVertexData(), b = t * li;
    let u = 0;
    const _ = /* @__PURE__ */ new Set(), B = /* @__PURE__ */ new Map(), m = (v) => {
      u++;
      const d = Oi(v);
      return _.has(d) || (_.add(d), B.set(`${v.x}:${v.y}`, v)), B.size >= t || u >= b;
    };
    if (y.xx && y.yy)
      for (c = 0; c < o && !wi(p[c], y.xx, y.yy, m); c++)
        ;
    return Array.from(B.values());
  }
}
function Rt(...i) {
  const t = i.join(" ");
  throw new Error(t);
}
function ee(i) {
  return i ? di(i) ? !0 : ui(i) ? !1 : i.length === 0 ? !0 : i.length > 0 : !1;
}
function ui(i) {
  return i != null && i.toString === String.prototype.toString;
}
function di(i) {
  return Array.isArray(i);
}
function pi(i, t) {
  ee(i) || Rt("utils.sum() expects an array, received:", i);
  let e = 0, n;
  for (let s = 0, o = i.length; s < o; s++)
    n = i[s], n && (e += n);
  return e;
}
function mi(i, t, e) {
  if (!ee(i))
    throw new Error(`#forEach() takes an array-like argument. ${i}`);
  for (let n = 0, s = i.length; n < s; n++)
    t.call(e, i[n], n);
}
function gi(i, t) {
  for (let e = 0, n = i.length; e < n; e++)
    i[e] = t;
  return i;
}
function wi(i, t, e, n) {
  const s = i.length - 2;
  let o, r, a, l, c, h, f, p, y, b, u, _, B, m, v, d, x;
  for (Ai(t, i), d = 0; d < s; ) {
    for (o = i[d], r = i[d + 1], c = t[o], h = t[r], y = e[o], b = e[r], x = d; x < s && (x += 2, a = i[x], f = t[a], !(h < f)); ) {
      if (u = e[a], l = i[x + 1], p = t[l], _ = e[l], y >= u) {
        if (y > _ && b > u && b > _) continue;
      } else if (y < _ && b < u && b < _) continue;
      if (!(o == a || o == l || r == a || r == l) && (B = yi(
        c,
        y,
        h,
        b,
        f,
        u,
        p,
        _
      ), B && (m = [o, r], v = [a, l], n(Sn(B, m, v, t, e)) || B.length == 4 && n(Sn(B.slice(2), m, v, t, e)))))
        return !0;
    }
    d += 2;
  }
  return !1;
}
function yi(i, t, e, n, s, o, r, a) {
  const l = vi(i, t, e, n, s, o, r, a);
  let c = null;
  return l && (c = bi(i, t, e, n, s, o, r, a), c ? Ei(i, t, e, n, s, o, r, a) && (c = null) : c = ki(i, t, e, n, s, o, r, a)), c;
}
function vi(i, t, e, n, s, o, r, a) {
  return Jt(i, t, e, n, s, o) * Jt(i, t, e, n, r, a) <= 0 && Jt(s, o, r, a, i, t) * Jt(s, o, r, a, e, n) <= 0;
}
function Jt(i, t, e, n, s, o) {
  return Pn(i - s, t - o, e - s, n - o);
}
function Pn(i, t, e, n) {
  return i * n - t * e;
}
function bi(i, t, e, n, s, o, r, a) {
  let l = pe(i, t, e, n, s, o, r, a), c;
  return l && (c = _i(l[0], l[1], i, t, e, n, s, o, r, a), c == 1 ? l = pe(e, n, i, t, s, o, r, a) : c == 2 ? l = pe(s, o, r, a, i, t, e, n) : c == 3 && (l = pe(r, a, s, o, i, t, e, n))), l && Mi(l, i, t, e, n, s, o, r, a), l;
}
function pe(i, t, e, n, s, o, r, a) {
  const l = Pn(e - i, n - t, r - s, a - o), c = 1e-18;
  let h;
  if (l === 0) return null;
  const f = Jt(s, o, r, a, i, t) / l;
  return l <= c && l >= -c ? h = xi(i, t, e, n, s, o, r, a) : h = [i + f * (e - i), t + f * (n - t)], h;
}
function xi(i, t, e, n, s, o, r, a) {
  let l = null;
  return !It(i, s, r) && !It(t, o, a) ? l = [i, t] : !It(e, s, r) && !It(n, o, a) ? l = [e, n] : !It(s, i, e) && !It(o, t, n) ? l = [s, o] : !It(r, i, e) && !It(a, t, n) && (l = [r, a]), l;
}
function It(i, t, e) {
  let n;
  return t < e ? n = i < t || i > e : t > e ? n = i > t || i < e : n = i != t, n;
}
function _i(i, t, ...e) {
  let n = -1, s = 1 / 0, o;
  for (let r = 0, a = 0, l = e.length; a < l; r++, a += 2)
    o = Si(i, t, e[a], e[a + 1]), o < s && (s = o, n = r);
  return n;
}
function Si(i, t, e, n) {
  const s = i - e, o = t - n;
  return s * s + o * o;
}
function Mi(i, t, e, n, s, o, r, a, l) {
  let c = i[0], h = i[1];
  c = me(c, t, n), c = me(c, o, a), h = me(h, e, s), h = me(h, r, l), i[0] = c, i[1] = h;
}
function me(i, t, e) {
  let n;
  return It(i, t, e) && (n = Math.abs(i - t) < Math.abs(i - e) ? t : e, i = n), i;
}
function ki(i, t, e, n, s, o, r, a) {
  const l = Math.min(i, e, s, r), c = Math.max(i, e, s, r), h = Math.min(t, n, o, a), f = Math.max(t, n, o, a), p = f - h > c - l;
  let y = [];
  return (p ? Dt(t, h, f) : Dt(i, l, c)) && y.push(i, t), (p ? Dt(n, h, f) : Dt(e, l, c)) && y.push(e, n), (p ? Dt(o, h, f) : Dt(s, l, c)) && y.push(s, o), (p ? Dt(a, h, f) : Dt(r, l, c)) && y.push(r, a), (y.length != 2 && y.length != 4 || y.length == 4 && y[0] == y[2] && y[1] == y[3]) && (y = null), y;
}
function Ei(i, t, e, n, s, o, r, a) {
  return i == s && t == o || i == r && t == a || e == s && n == o || e == r && n == a;
}
function Dt(i, t, e) {
  return i > t && i < e;
}
function Ai(i, t) {
  Ii(i, t), $n(i, t, 0, t.length - 2);
}
function Ii(i, t) {
  for (let e = 0, n = t.length; e < n; e += 2)
    i[t[e]] > i[t[e + 1]] && Bi(t, e, e + 1);
}
function Bi(i, t, e) {
  const n = i[t];
  i[t] = i[e], i[e] = n;
}
function $n(i, t, e, n) {
  let s = e, o = n, r, a;
  for (; s < n; ) {
    for (r = i[t[e + n >> 2 << 1]]; s <= o; ) {
      for (; i[t[s]] < r; ) s += 2;
      for (; i[t[o]] > r; ) o -= 2;
      s <= o && (a = t[s], t[s] = t[o], t[o] = a, a = t[s + 1], t[s + 1] = t[o + 1], t[o + 1] = a, s += 2, o -= 2);
    }
    if (o - e < 40 ? _n(i, t, e, o) : $n(i, t, e, o), n - s < 40) {
      _n(i, t, s, n);
      return;
    }
    e = s, o = n;
  }
}
function _n(i, t, e, n) {
  let s, o;
  for (let r = e + 2; r <= n; r += 2) {
    s = t[r], o = t[r + 1];
    let a;
    for (a = r - 2; a >= e && i[s] < i[t[a]]; a -= 2)
      t[a + 2] = t[a], t[a + 3] = t[a + 1];
    t[a + 2] = s, t[a + 3] = o;
  }
}
function Sn(i, t, e, n, s) {
  const o = i[0], r = i[1];
  t = Mn(o, r, t[0], t[1], n, s), e = Mn(o, r, e[0], e[1], n, s);
  const a = t[0] < e[0] ? t : e, l = a == t ? e : t;
  return { x: o, y: r, a, b: l };
}
function Mn(i, t, e, n, s, o) {
  let r = e < n ? e : n, a = r === e ? n : e;
  return s[r] == i && o[r] == t ? a = r : s[a] == i && o[a] == t && (r = a), [r, a];
}
function Oi(i) {
  return `${i.a.join(",")};${i.b.join(",")}`;
}
class Ti {
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
function Fi(i, t, e, n) {
  let s = e | 0;
  const o = isNaN(n) ? i.length - s : n + s;
  let r, a, l, c, h, f;
  if (o > 0)
    l = h = i[s], c = f = t[s];
  else return [void 0, void 0, void 0, void 0];
  for (s++; s < o; s++)
    r = i[s], a = t[s], r < l && (l = r), r > h && (h = r), a < c && (c = a), a > f && (f = a);
  return [l, c, h, f];
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
    let o, r, a, l;
    if (arguments.length == 1)
      if (ee(t)) {
        const c = t;
        o = c[0], r = c[1], a = c[2], l = c[3];
      } else {
        const c = t;
        o = c.xmin, r = c.ymin, a = c.xmax, l = c.ymax;
      }
    else
      o = t, r = e, a = n, l = s;
    return this.xmin = o, this.ymin = r, this.xmax = a, this.ymax = l, (o > a || r > l) && this.update(), this;
  }
  update() {
    let t;
    this.xmin > this.xmax && (t = this.xmin, this.xmin = this.xmax, this.xmax = t), this.ymin > this.ymax && (t = this.ymin, this.ymin = this.ymax, this.ymax = t);
  }
  mergeBounds(t, ...e) {
    let n, s, o, r;
    return t instanceof ne ? (n = t.xmin, s = t.ymin, o = t.xmax, r = t.ymax) : e.length == 3 ? (n = t, s = e[0], o = e[1], r = e[2]) : t.length == 4 ? (n = t[0], s = t[1], o = t[2], r = t[3]) : Rt("Bounds#mergeBounds() invalid argument:", t), this.xmin === void 0 ? this.setBounds(n, s, o, r) : (n < this.xmin && (this.xmin = n), s < this.ymin && (this.ymin = s), o > this.xmax && (this.xmax = o), r > this.ymax && (this.ymax = r)), this;
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
    const a = r.filter((l) => l !== t);
    a.length === 0 ? delete i[o] : i[o] = a;
  }), e) {
    const o = (r, a) => {
      !r || !a || (r.features = r.features.filter((l) => l !== a));
    };
    o(e.forw, t.forw), o(e.bakw, t.bakw);
  }
}
function ge(i, t = 1e-6) {
  const [e, n] = i[0], [s, o] = i[1], [r, a] = i[2];
  return Math.abs((s - e) * (a - n) - (r - e) * (o - n)) < t;
}
function Ni(i, t) {
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
const Ci = 10;
function Di(i, t, e, n, s, o) {
  if (!i && !t) return !1;
  const r = i ? 0 : 1, a = 1 - r, l = e[r], c = e[a];
  if (!l || !c) return !1;
  const h = bt(c.geom);
  let f = !1, p = !1;
  for (let y = 0; y <= 1; y++) {
    const b = n[y];
    if (!b) continue;
    const u = [String(b.prop.index), String(l.prop.index)].sort().join("-"), _ = s[u];
    if (!_ || _.length < 2) continue;
    const B = _.find(
      (T) => T.bakw !== o[r].bakw
    );
    if (!B) continue;
    const v = Qt(B.bakw).find(
      (T) => String(T.prop.index) !== String(b.prop.index) && String(T.prop.index) !== String(l.prop.index)
    );
    if (!v) continue;
    f = !0;
    const d = bt(v.geom), x = bt(b.geom), S = bt(l.geom), I = S[0] - x[0], k = S[1] - x[1], M = I * (h[1] - x[1]) - k * (h[0] - x[0]), O = I * (d[1] - x[1]) - k * (d[0] - x[0]);
    if (M * O > 0) {
      p = !0;
      break;
    }
  }
  return f && !p;
}
function Pi(i, t, e, n) {
  if (!i && !t) return !1;
  if (e[0] && e[1] && n[0] && n[1]) {
    const s = n.map((h) => bt(h.geom)), o = e.map((h) => bt(h.geom)), r = s[1][0] - s[0][0], a = s[1][1] - s[0][1], l = r * (o[0][1] - s[0][1]) - a * (o[0][0] - s[0][0]), c = r * (o[1][1] - s[0][1]) - a * (o[1][0] - s[0][0]);
    return l * c < 0;
  }
  return !1;
}
function $i(i, t, e, n) {
  const s = Ni(e, n), o = /* @__PURE__ */ new Set();
  let r = !1;
  for (let a = 0; a < Ci; a++) {
    let l = !1;
    for (const c of Object.keys(t)) {
      if (o.has(c)) continue;
      o.add(c);
      const h = t[c];
      if (!h || h.length < 2) continue;
      const f = c.split("-");
      if (f.length !== 2 || s.has(c)) continue;
      const p = Qt(h[0].bakw), y = Qt(h[1].bakw), b = Qt(h[0].forw), u = Qt(h[1].forw), _ = f.map(
        (w) => p.find((F) => `${F.prop.index}` === w) || y.find((F) => `${F.prop.index}` === w)
      ), B = f.map(
        (w) => b.find((F) => `${F.prop.index}` === w) || u.find((F) => `${F.prop.index}` === w)
      );
      if (_.some((w) => !w) || B.some((w) => !w))
        continue;
      const m = [p, y].map(
        (w) => w.find((F) => !f.includes(`${F.prop.index}`))
      ), v = [b, u].map(
        (w) => w.find((F) => !f.includes(`${F.prop.index}`))
      );
      if (m.some((w) => !w) || v.some((w) => !w))
        continue;
      const d = h[0].bakw.geometry.coordinates[0].slice(0, 3).map((w) => bt(w)), x = h[1].bakw.geometry.coordinates[0].slice(0, 3).map((w) => bt(w)), S = h[0].forw.geometry.coordinates[0].slice(0, 3).map((w) => bt(w)), I = h[1].forw.geometry.coordinates[0].slice(0, 3).map((w) => bt(w)), k = ge(d), M = ge(x), O = ge(S), T = ge(I), D = Di(
        k,
        M,
        m,
        _,
        t,
        h
      ), X = Pi(
        O,
        T,
        m,
        _
      );
      if (!(D || X || En(
        bt(m[0].geom),
        x
      ) || En(
        bt(m[1].geom),
        d
      )))
        continue;
      const A = B.map(
        (w) => bt(w.geom)
      ), E = v.map(
        (w) => bt(w.geom)
      ), N = Xi([
        ...A,
        ...E
      ]), C = Ri(N), P = An(
        A[0],
        A[1],
        E[0]
      ) + An(
        A[0],
        A[1],
        E[1]
      );
      De(C, P) && (kn(t, h[0], i), kn(t, h[1], i), _.forEach((w) => {
        if (!w) return;
        const F = [
          w.geom,
          m[0].geom,
          m[1].geom,
          w.geom
        ], $ = {
          a: w.prop,
          b: m[0].prop,
          c: m[1].prop
        }, R = re([F], $), q = On(R);
        Xn(t, {
          forw: q,
          bakw: R
        }, i);
      }), l = !0, r = !0);
    }
    if (!l) break;
  }
  return r;
}
function bt(i) {
  return [i[0], i[1]];
}
function En(i, t) {
  const [e, n] = t[0], [s, o] = t[1], [r, a] = t[2], l = r - e, c = a - n, h = s - e, f = o - n, p = i[0] - e, y = i[1] - n, b = l * l + c * c, u = l * h + c * f, _ = l * p + c * y, B = h * h + f * f, m = h * p + f * y, v = b * B - u * u;
  if (v === 0) return !1;
  const d = 1 / v, x = (B * _ - u * m) * d, S = (b * m - u * _) * d, I = 1e-9;
  return x >= -I && S >= -I && x + S <= 1 + I;
}
function Xi(i) {
  const t = i.map((r) => r.slice()).filter(
    (r, a, l) => l.findIndex(
      (c) => De(c[0], r[0]) && De(c[1], r[1])
    ) === a
  );
  if (t.length <= 1) return t;
  const e = t.sort(
    (r, a) => r[0] === a[0] ? r[1] - a[1] : r[0] - a[0]
  ), n = (r, a, l) => (a[0] - r[0]) * (l[1] - r[1]) - (a[1] - r[1]) * (l[0] - r[0]), s = [];
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
function Ri(i) {
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
const Yi = (i) => typeof i == "string" && i.startsWith("b");
function Li(i, t) {
  const e = (n, s) => {
    for (let o = 0; o < 3; o++) {
      const r = n.g[o], a = n.g[(o + 1) % 3];
      if (s.g.every((l) => n.sign * dt(r[0], r[1], a[0], a[1], l[0], l[1]) <= 0)) return !0;
    }
    return !1;
  };
  return !e(i, t) && !e(t, i);
}
function qi(i, t, e) {
  if (t.length === 0) return [];
  const n = i.features.map((u) => {
    const { a: _, b: B, c: m } = u.properties, v = [_.geom, B.geom, m.geom], [d, x, S] = u.geometry.coordinates[0], I = v.map(([T]) => T), k = v.map(([, T]) => T), M = Math.sign(dt(d[0], d[1], x[0], x[1], S[0], S[1])), O = Math.sign(dt(v[0][0], v[0][1], v[1][0], v[1][1], v[2][0], v[2][1]));
    return {
      ids: [_.index, B.index, m.index].map(String),
      g: v,
      sign: O,
      ratio: M * O,
      aux: [_.index, B.index, m.index].some(Yi),
      minx: Math.min(...I),
      maxx: Math.max(...I),
      miny: Math.min(...k),
      maxy: Math.max(...k)
    };
  }), s = n.map((u) => u.ratio), o = s.reduce((u, _) => u + _, 0) < 0 ? -1 : 1, r = (u, _) => u < _ ? `${u}|${_}` : `${_}|${u}`, a = /* @__PURE__ */ new Map();
  n.forEach((u, _) => {
    for (let B = 0; B < 3; B++) {
      const m = r(u.ids[B], u.ids[(B + 1) % 3]), v = a.get(m);
      v ? v.push(_) : a.set(m, [_]);
    }
  });
  const l = ([u, _]) => r(String(e[u]), String(e[_])), c = /* @__PURE__ */ new Set();
  for (const u of t) for (const _ of a.get(l(u)) ?? []) c.add(_);
  const h = (u) => n[u].aux || c.has(u), f = /* @__PURE__ */ new Set();
  n.forEach((u, _) => {
    h(_) && (s[_] === 0 || s[_] !== o) && f.add(_);
  });
  const p = n.map((u, _) => _).sort((u, _) => n[u].minx - n[_].minx);
  for (let u = 0; u < p.length; u++) {
    const _ = n[p[u]];
    if (_.sign !== 0)
      for (let B = u + 1; B < p.length; B++) {
        const m = n[p[B]];
        if (m.minx >= _.maxx) break;
        m.sign === 0 || m.miny >= _.maxy || _.miny >= m.maxy || !h(p[u]) && !h(p[B]) || Li(_, m) && (f.add(p[u]), f.add(p[B]));
      }
  }
  if (f.size === 0) return [];
  const y = t.filter((u) => (a.get(l(u)) ?? []).some((_) => f.has(_)));
  if (y.length > 0) return y;
  const b = /* @__PURE__ */ new Set();
  for (const u of f) for (const _ of n[u].ids) _.startsWith("b") || b.add(_);
  return t.filter(
    ([u, _]) => b.has(String(e[u])) || b.has(String(e[_]))
  );
}
const In = 2.00704, Bn = 3.00001, Vi = 12, ji = 24;
class ot extends Vn {
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
      jn(t.worldFile), this.requestedWorldFile = { ...t.worldFile };
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
    this.edges = Un(t), this.edgeNodes = void 0, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 境界ポリゴンを設定します
   */
  setBounds(t) {
    this.bounds = t;
    let e = t[0][0], n = e, s = t[0][1], o = s;
    const r = [t[0]];
    for (let a = 1; a < t.length; a++) {
      const l = t[a];
      l[0] < e && (e = l[0]), l[0] > n && (n = l[0]), l[1] < s && (s = l[1]), l[1] > o && (o = l[1]), r.push(l);
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
      (r) => On(r)
    );
    this.tins.bakw = xt(e);
    const n = {};
    this.tins.forw.features.forEach((r, a) => {
      const l = this.tins.bakw.features[a];
      Xn(n, { forw: r, bakw: l });
    });
    const s = (this.pointsSet?.forw.features ?? []).map(
      (r) => r.properties.target.index
    );
    $i(
      this.tins,
      n,
      this.pointsSet?.edges || [],
      s
    );
    const o = ["forw", "bakw"].map((r) => {
      const a = this.tins[r].features.map(
        (l) => l.geometry.coordinates[0]
      );
      return Dn(a, t);
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
      if (Ui(o, this.points.length, s), r.length === 0 && a.length === 0) {
        e.push(o);
        continue;
      }
      r.unshift(this.points[o[0]][0]), r.push(this.points[o[1]][0]), a.unshift(this.points[o[0]][1]), a.push(this.points[o[1]][1]), Hr(r, a).map((l, c, h) => {
        this.edgeNodes[n] = [
          l[0],
          l[1]
        ];
        const f = Kt(
          l[0],
          l[1],
          `e${n}`
        );
        n++, t.forw.push(f), t.bakw.push(Wt(f)), c === 0 ? e.push([o[0], t.forw.length - 1]) : e.push([
          t.forw.length - 2,
          t.forw.length - 1
        ]), c === h.length - 1 && e.push([t.forw.length - 1, o[1]]);
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
    if (!this.points.reduce((l, c) => l && (o ? He(c[0], o) : c[0][0] >= t && c[0][0] <= e && c[0][1] >= n && c[0][1] <= s), !0))
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
    let s, o, r, a, l;
    if (e) {
      if (this.bounds) {
        const O = this.boundsPolygon;
        if (!O) throw new Error("Internal error: bounds is set but boundsPolygon is missing");
        if (!this.points.every(
          (D) => He(D[0], O)
        )) throw "SOME POINTS OUTSIDE";
      }
      s = this.generatePointsSet(), { minx: o, maxx: r, miny: a, maxy: l } = this.computeGcpBbox();
    } else {
      const O = this.validateAndPrepareInputs();
      s = O.pointsSet, o = O.minx, r = O.maxx, a = O.miny, l = O.maxy;
    }
    const c = {
      forw: xt(s.forw),
      bakw: xt(s.bakw)
    }, h = de(
      c.forw,
      s.edges,
      "target"
    ), f = de(
      c.bakw,
      s.edges,
      "target"
    );
    if (h.features.length === 0 || f.features.length === 0)
      throw "TOO LINEAR1";
    const p = Sr(c.forw), y = cn(c.forw);
    if (!y) throw "TOO LINEAR2";
    const b = {}, u = y.geometry.coordinates[0];
    let _;
    try {
      _ = u.map((O) => ({
        forw: O,
        bakw: _e(Yt(O), h)
      })), _.forEach((O) => {
        b[`${O.forw[0]}:${O.forw[1]}`] = O;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const B = cn(c.bakw);
    if (!B) throw "TOO LINEAR2";
    const m = B.geometry.coordinates[0];
    try {
      _ = m.map((O) => ({
        bakw: O,
        forw: _e(Yt(O), f)
      })), _.forEach((O) => {
        b[`${O.forw[0]}:${O.forw[1]}`] = O;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const v = {
      forw: p.geometry.coordinates,
      bakw: _e(p, h)
    }, d = Kt(v.forw, v.bakw, "c");
    this.centroid = {
      forw: d,
      bakw: Wt(d)
    };
    const x = [
      ...this.points.map((O) => ({ forw: O[0], bakw: O[1] })),
      ...(this.edgeNodes ?? []).map((O) => ({ forw: O[0], bakw: O[1] }))
    ], S = {
      convexBuf: b,
      centroid: v,
      allGcps: x,
      minx: o,
      maxx: r,
      miny: a,
      maxy: l
    };
    if (n) {
      this.stateTriangle = void 0;
      const O = this.yaxisMode === ot.YAXIS_FOLLOW, T = O ? 1 : -1, D = /* @__PURE__ */ new Map(), { boundary: X } = this.buildWithHull(t, (g) => ({ boundary: gn(
        S,
        (A) => ci(A, (E) => {
          const [N, C] = zn(n, E);
          return [N, O ? -C : C];
        }),
        s,
        this.points.length,
        {
          orientation: T,
          accept: (A) => A.hasMapBoundary ? (this.buildTin(s, A.vertices, t, A, g.size > 0), (this.strict_status !== ot.STATUS_LOOSE || A.hasBoundary) && ve(this.tins.forw, T) === 0 && ve(this.tins.bakw, T) === 0) : !1
        },
        g,
        D
      ) }));
      if (X) {
        this.compiledOuter = {
          outerTransform: "worldFile",
          worldFile: n,
          vertices_points: X.vertices.map(({ forw: C, bakw: P }) => [C, P])
        };
        const { centroid: g, xy: A, wh: E, kinks: N } = this;
        super.setCompiled(this.getCompiled()), Object.assign(this, { centroid: g, xy: A, wh: E, kinks: N }), this.lastBoundaryDiagnostics = {
          ...X.diagnostics,
          requestedOuterTransform: "worldFile",
          outerTransform: "worldFile"
        };
        return;
      }
      this.compiledOuter = { outerTransform: "extrapolate" }, this.outerTransform = "extrapolate", this.worldFile = void 0;
    }
    const I = this.vertexMode === ot.VERTEX_BIRDEYE ? ai : oi;
    let k, M;
    if (e) {
      const O = /* @__PURE__ */ new Map();
      ({ boundary: k, verticesList: M } = this.buildWithHull(t, (T) => {
        const D = gn(
          S,
          I,
          s,
          this.points.length,
          void 0,
          T,
          O
        );
        return {
          boundary: D,
          verticesList: this.buildTin(
            s,
            D?.vertices ?? I(S, !1),
            t,
            D,
            T.size > 0
          )
        };
      }));
    } else
      M = this.buildTin(
        s,
        I(S, !1),
        t,
        void 0
      );
    this.vertices_params = {
      forw: dn(M.forw, this.centroid.forw),
      bakw: dn(M.bakw, this.centroid.bakw)
    }, this.addIndexedTin(), this.pointsWeightBuffer = {}, this.lastBoundaryDiagnostics = k?.diagnostics, n && this.lastBoundaryDiagnostics && (this.lastBoundaryDiagnostics = {
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
    const o = (u) => [...u].sort().join(","), r = (u, _ = !1) => {
      const B = o(u), m = n.get(B);
      if (m) return m;
      const v = e(u), d = {
        value: v,
        strict: v.boundary !== void 0 && this.strict_status === ot.STATUS_STRICT
      };
      return (d.strict || _) && (d.state = this.captureBuild()), n.set(B, d), s = d, d;
    }, a = (u) => (s !== u && this.restoreBuild(u.state), s = u, u.value), l = r(/* @__PURE__ */ new Set(), !0);
    if (!(t === ot.MODE_STRICT || t === ot.MODE_AUTO) || !l.value.boundary || l.strict) return l.value;
    const h = new Set(l.value.boundary.forwHull.all.map(ye)), f = () => this.pointsSet.forw.features.map(
      (u) => u.properties.target.index
    ), p = /* @__PURE__ */ new Set();
    let y = l, b;
    for (let u = 0; u < Vi; u++) {
      const _ = qi(
        this.tins.forw,
        y.value.boundary.forwHull.applied,
        f()
      ).filter((B) => !p.has(ye(B)));
      if (_.length === 0) break;
      for (const B of _) p.add(ye(B));
      if (y = r(p), !y.value.boundary) break;
      if (y.strict) {
        b = y;
        break;
      }
    }
    if (b) {
      let u = b;
      for (const _ of [...p].slice(0, ji)) {
        const B = new Set(p);
        B.delete(_);
        const m = r(B);
        m.strict && (p.delete(_), u = m);
      }
      return a(u);
    }
    if (p.size < h.size) {
      const u = r(h);
      if (u.strict) return a(u);
    }
    return a(l);
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
      const l = e[a].forw, c = e[a].bakw, h = Kt(l, c, `b${a}`), f = Wt(h);
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
function Ui(i, t, e) {
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
  Gi as findIntersections,
  In as format_version,
  Xn as insertSearchIndex,
  dn as vertexCalc
};
