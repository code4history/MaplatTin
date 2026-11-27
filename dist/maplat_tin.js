import { counterTri as ln, worldFileToCrs as Es, Transform as xn, validateWorldFile as js, normalizeEdges as kn, transformArr as We, rotateVerticesTriangle as Ke } from "@maplat/transform";
function de(r, t, e = {}) {
  const n = { type: "Feature" };
  return (e.id === 0 || e.id) && (n.id = e.id), e.bbox && (n.bbox = e.bbox), n.properties = t || {}, n.geometry = r, n;
}
function Zt(r, t, e = {}) {
  if (!r)
    throw new Error("coordinates is required");
  if (!Array.isArray(r))
    throw new Error("coordinates must be an Array");
  if (r.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!Mn(r[0]) || !Mn(r[1]))
    throw new Error("coordinates must contain numbers");
  return de({
    type: "Point",
    coordinates: r
  }, t, e);
}
function me(r, t, e = {}) {
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
  return de({
    type: "Polygon",
    coordinates: r
  }, t, e);
}
function Sn(r, t, e = {}) {
  if (r.length < 2)
    throw new Error("coordinates must be an array of two or more positions");
  return de({
    type: "LineString",
    coordinates: r
  }, t, e);
}
function bt(r, t = {}) {
  const e = { type: "FeatureCollection" };
  return t.id && (e.id = t.id), t.bbox && (e.bbox = t.bbox), e.features = r, e;
}
function Mn(r) {
  return !isNaN(r) && r !== null && !Array.isArray(r);
}
function Gs(r) {
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
function Ws(r) {
  return r.type === "Feature" ? r.geometry : r;
}
function gn(r, t, e) {
  if (r !== null)
    for (var n, s, o, i, a, c, f, l = 0, h = 0, u, g = r.type, v = g === "FeatureCollection", d = g === "Feature", k = v ? r.features.length : 1, M = 0; M < k; M++) {
      f = v ? (
        // @ts-expect-error: Known type conflict
        r.features[M].geometry
      ) : d ? (
        // @ts-expect-error: Known type conflict
        r.geometry
      ) : r, u = f ? f.type === "GeometryCollection" : !1, a = u ? f.geometries.length : 1;
      for (var b = 0; b < a; b++) {
        var x = 0, p = 0;
        if (i = u ? f.geometries[b] : f, i !== null) {
          c = i.coordinates;
          var m = i.type;
          switch (l = e && (m === "Polygon" || m === "MultiPolygon") ? 1 : 0, m) {
            case null:
              break;
            case "Point":
              if (
                // @ts-expect-error: Known type conflict
                t(
                  c,
                  h,
                  M,
                  x,
                  p
                ) === !1
              )
                return !1;
              h++, x++;
              break;
            case "LineString":
            case "MultiPoint":
              for (n = 0; n < c.length; n++) {
                if (
                  // @ts-expect-error: Known type conflict
                  t(
                    c[n],
                    h,
                    M,
                    x,
                    p
                  ) === !1
                )
                  return !1;
                h++, m === "MultiPoint" && x++;
              }
              m === "LineString" && x++;
              break;
            case "Polygon":
            case "MultiLineString":
              for (n = 0; n < c.length; n++) {
                for (s = 0; s < c[n].length - l; s++) {
                  if (
                    // @ts-expect-error: Known type conflict
                    t(
                      c[n][s],
                      h,
                      M,
                      x,
                      p
                    ) === !1
                  )
                    return !1;
                  h++;
                }
                m === "MultiLineString" && x++, m === "Polygon" && p++;
              }
              m === "Polygon" && x++;
              break;
            case "MultiPolygon":
              for (n = 0; n < c.length; n++) {
                for (p = 0, s = 0; s < c[n].length; s++) {
                  for (o = 0; o < c[n][s].length - l; o++) {
                    if (
                      // @ts-expect-error: Known type conflict
                      t(
                        c[n][s][o],
                        h,
                        M,
                        x,
                        p
                      ) === !1
                    )
                      return !1;
                    h++;
                  }
                  p++;
                }
                x++;
              }
              break;
            case "GeometryCollection":
              for (n = 0; n < i.geometries.length; n++)
                if (
                  // @ts-expect-error: Known type conflict
                  gn(i.geometries[n], t, e) === !1
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
const xt = 11102230246251565e-32, Z = 134217729, _s = (3 + 8 * xt) * xt;
function vt(r, t, e, n, s) {
  let o, i, a, c, f = t[0], l = n[0], h = 0, u = 0;
  l > f == l > -f ? (o = f, f = t[++h]) : (o = l, l = n[++u]);
  let g = 0;
  if (h < r && u < e)
    for (l > f == l > -f ? (i = f + o, a = o - (i - f), f = t[++h]) : (i = l + o, a = o - (i - l), l = n[++u]), o = i, a !== 0 && (s[g++] = a); h < r && u < e; )
      l > f == l > -f ? (i = o + f, c = i - o, a = o - (i - c) + (f - c), f = t[++h]) : (i = o + l, c = i - o, a = o - (i - c) + (l - c), l = n[++u]), o = i, a !== 0 && (s[g++] = a);
  for (; h < r; )
    i = o + f, c = i - o, a = o - (i - c) + (f - c), f = t[++h], o = i, a !== 0 && (s[g++] = a);
  for (; u < e; )
    i = o + l, c = i - o, a = o - (i - c) + (l - c), l = n[++u], o = i, a !== 0 && (s[g++] = a);
  return (o !== 0 || g === 0) && (s[g++] = o), g;
}
function Nt(r, t, e, n, s, o, i, a) {
  return vt(vt(r, t, e, n, i), i, s, o, a);
}
function G(r, t, e, n) {
  let s, o, i, a, c, f, l, h, u, g, v;
  l = Z * e, g = l - (l - e), v = e - g;
  let d = t[0];
  s = d * e, l = Z * d, h = l - (l - d), u = d - h, i = u * v - (s - h * g - u * g - h * v);
  let k = 0;
  i !== 0 && (n[k++] = i);
  for (let M = 1; M < r; M++)
    d = t[M], a = d * e, l = Z * d, h = l - (l - d), u = d - h, c = u * v - (a - h * g - u * g - h * v), o = s + c, f = o - s, i = s - (o - f) + (c - f), i !== 0 && (n[k++] = i), s = a + o, i = o - (s - a), i !== 0 && (n[k++] = i);
  return (s !== 0 || k === 0) && (n[k++] = s), k;
}
function Is(r, t) {
  let e = t[0];
  for (let n = 1; n < r; n++) e += t[n];
  return e;
}
function ft(r) {
  return new Float64Array(r);
}
const Ks = (3 + 16 * xt) * xt, Hs = (2 + 12 * xt) * xt, Js = (9 + 64 * xt) * xt * xt, ee = ft(4), En = ft(8), _n = ft(12), In = ft(16), kt = ft(4);
function Qs(r, t, e, n, s, o, i) {
  let a, c, f, l, h, u, g, v, d, k, M, b, x, p, m, w, S, E;
  const y = r - s, A = e - s, F = t - o, R = n - o;
  p = y * R, u = Z * y, g = u - (u - y), v = y - g, u = Z * R, d = u - (u - R), k = R - d, m = v * k - (p - g * d - v * d - g * k), w = F * A, u = Z * F, g = u - (u - F), v = F - g, u = Z * A, d = u - (u - A), k = A - d, S = v * k - (w - g * d - v * d - g * k), M = m - S, h = m - M, ee[0] = m - (M + h) + (h - S), b = p + M, h = b - p, x = p - (b - h) + (M - h), M = x - w, h = x - M, ee[1] = x - (M + h) + (h - w), E = b + M, h = E - b, ee[2] = b - (E - h) + (M - h), ee[3] = E;
  let Y = Is(4, ee), I = Hs * i;
  if (Y >= I || -Y >= I || (h = r - y, a = r - (y + h) + (h - s), h = e - A, f = e - (A + h) + (h - s), h = t - F, c = t - (F + h) + (h - o), h = n - R, l = n - (R + h) + (h - o), a === 0 && c === 0 && f === 0 && l === 0) || (I = Js * i + _s * Math.abs(Y), Y += y * l + R * a - (F * f + A * c), Y >= I || -Y >= I)) return Y;
  p = a * R, u = Z * a, g = u - (u - a), v = a - g, u = Z * R, d = u - (u - R), k = R - d, m = v * k - (p - g * d - v * d - g * k), w = c * A, u = Z * c, g = u - (u - c), v = c - g, u = Z * A, d = u - (u - A), k = A - d, S = v * k - (w - g * d - v * d - g * k), M = m - S, h = m - M, kt[0] = m - (M + h) + (h - S), b = p + M, h = b - p, x = p - (b - h) + (M - h), M = x - w, h = x - M, kt[1] = x - (M + h) + (h - w), E = b + M, h = E - b, kt[2] = b - (E - h) + (M - h), kt[3] = E;
  const O = vt(4, ee, 4, kt, En);
  p = y * l, u = Z * y, g = u - (u - y), v = y - g, u = Z * l, d = u - (u - l), k = l - d, m = v * k - (p - g * d - v * d - g * k), w = F * f, u = Z * F, g = u - (u - F), v = F - g, u = Z * f, d = u - (u - f), k = f - d, S = v * k - (w - g * d - v * d - g * k), M = m - S, h = m - M, kt[0] = m - (M + h) + (h - S), b = p + M, h = b - p, x = p - (b - h) + (M - h), M = x - w, h = x - M, kt[1] = x - (M + h) + (h - w), E = b + M, h = E - b, kt[2] = b - (E - h) + (M - h), kt[3] = E;
  const N = vt(O, En, 4, kt, _n);
  p = a * l, u = Z * a, g = u - (u - a), v = a - g, u = Z * l, d = u - (u - l), k = l - d, m = v * k - (p - g * d - v * d - g * k), w = c * f, u = Z * c, g = u - (u - c), v = c - g, u = Z * f, d = u - (u - f), k = f - d, S = v * k - (w - g * d - v * d - g * k), M = m - S, h = m - M, kt[0] = m - (M + h) + (h - S), b = p + M, h = b - p, x = p - (b - h) + (M - h), M = x - w, h = x - M, kt[1] = x - (M + h) + (h - w), E = b + M, h = E - b, kt[2] = b - (E - h) + (M - h), kt[3] = E;
  const B = vt(N, _n, 4, kt, In);
  return In[B - 1];
}
function ct(r, t, e, n, s, o) {
  const i = (t - o) * (e - s), a = (r - s) * (n - o), c = i - a, f = Math.abs(i + a);
  return Math.abs(c) >= Ks * f ? c : -Qs(r, t, e, n, s, o, f);
}
const Zs = (10 + 96 * xt) * xt, tr = (4 + 48 * xt) * xt, er = (44 + 576 * xt) * xt * xt, Xt = ft(4), zt = ft(4), Yt = ft(4), Tt = ft(4), Bt = ft(4), Rt = ft(4), St = ft(4), Mt = ft(4), He = ft(8), Je = ft(8), Qe = ft(8), Ze = ft(8), tn = ft(8), en = ft(8), ve = ft(8), be = ft(8), ye = ft(8), Gt = ft(4), Wt = ft(4), Kt = ft(4), et = ft(8), st = ft(16), ht = ft(16), ut = ft(16), lt = ft(32), qt = ft(32), mt = ft(48), _t = ft(64);
let re = ft(1152), nn = ft(1152);
function wt(r, t, e) {
  r = vt(r, re, t, e, nn);
  const n = re;
  return re = nn, nn = n, r;
}
function nr(r, t, e, n, s, o, i, a, c) {
  let f, l, h, u, g, v, d, k, M, b, x, p, m, w, S, E, y, A, F, R, Y, I, O, N, B, C, P, _, T, $, V, z, X, U, q;
  const H = r - i, W = e - i, J = s - i, tt = t - a, K = n - a, Q = o - a;
  V = W * Q, O = Z * W, N = O - (O - W), B = W - N, O = Z * Q, C = O - (O - Q), P = Q - C, z = B * P - (V - N * C - B * C - N * P), X = J * K, O = Z * J, N = O - (O - J), B = J - N, O = Z * K, C = O - (O - K), P = K - C, U = B * P - (X - N * C - B * C - N * P), _ = z - U, I = z - _, Xt[0] = z - (_ + I) + (I - U), T = V + _, I = T - V, $ = V - (T - I) + (_ - I), _ = $ - X, I = $ - _, Xt[1] = $ - (_ + I) + (I - X), q = T + _, I = q - T, Xt[2] = T - (q - I) + (_ - I), Xt[3] = q, V = J * tt, O = Z * J, N = O - (O - J), B = J - N, O = Z * tt, C = O - (O - tt), P = tt - C, z = B * P - (V - N * C - B * C - N * P), X = H * Q, O = Z * H, N = O - (O - H), B = H - N, O = Z * Q, C = O - (O - Q), P = Q - C, U = B * P - (X - N * C - B * C - N * P), _ = z - U, I = z - _, zt[0] = z - (_ + I) + (I - U), T = V + _, I = T - V, $ = V - (T - I) + (_ - I), _ = $ - X, I = $ - _, zt[1] = $ - (_ + I) + (I - X), q = T + _, I = q - T, zt[2] = T - (q - I) + (_ - I), zt[3] = q, V = H * K, O = Z * H, N = O - (O - H), B = H - N, O = Z * K, C = O - (O - K), P = K - C, z = B * P - (V - N * C - B * C - N * P), X = W * tt, O = Z * W, N = O - (O - W), B = W - N, O = Z * tt, C = O - (O - tt), P = tt - C, U = B * P - (X - N * C - B * C - N * P), _ = z - U, I = z - _, Yt[0] = z - (_ + I) + (I - U), T = V + _, I = T - V, $ = V - (T - I) + (_ - I), _ = $ - X, I = $ - _, Yt[1] = $ - (_ + I) + (I - X), q = T + _, I = q - T, Yt[2] = T - (q - I) + (_ - I), Yt[3] = q, f = vt(
    vt(
      vt(
        G(G(4, Xt, H, et), et, H, st),
        st,
        G(G(4, Xt, tt, et), et, tt, ht),
        ht,
        lt
      ),
      lt,
      vt(
        G(G(4, zt, W, et), et, W, st),
        st,
        G(G(4, zt, K, et), et, K, ht),
        ht,
        qt
      ),
      qt,
      _t
    ),
    _t,
    vt(
      G(G(4, Yt, J, et), et, J, st),
      st,
      G(G(4, Yt, Q, et), et, Q, ht),
      ht,
      lt
    ),
    lt,
    re
  );
  let nt = Is(f, re), D = tr * c;
  if (nt >= D || -nt >= D || (I = r - H, l = r - (H + I) + (I - i), I = t - tt, g = t - (tt + I) + (I - a), I = e - W, h = e - (W + I) + (I - i), I = n - K, v = n - (K + I) + (I - a), I = s - J, u = s - (J + I) + (I - i), I = o - Q, d = o - (Q + I) + (I - a), l === 0 && h === 0 && u === 0 && g === 0 && v === 0 && d === 0) || (D = er * c + _s * Math.abs(nt), nt += (H * H + tt * tt) * (W * d + Q * h - (K * u + J * v)) + 2 * (H * l + tt * g) * (W * Q - K * J) + ((W * W + K * K) * (J * g + tt * u - (Q * l + H * d)) + 2 * (W * h + K * v) * (J * tt - Q * H)) + ((J * J + Q * Q) * (H * v + K * l - (tt * h + W * g)) + 2 * (J * u + Q * d) * (H * K - tt * W)), nt >= D || -nt >= D))
    return nt;
  if ((h !== 0 || v !== 0 || u !== 0 || d !== 0) && (V = H * H, O = Z * H, N = O - (O - H), B = H - N, z = B * B - (V - N * N - (N + N) * B), X = tt * tt, O = Z * tt, N = O - (O - tt), B = tt - N, U = B * B - (X - N * N - (N + N) * B), _ = z + U, I = _ - z, Tt[0] = z - (_ - I) + (U - I), T = V + _, I = T - V, $ = V - (T - I) + (_ - I), _ = $ + X, I = _ - $, Tt[1] = $ - (_ - I) + (X - I), q = T + _, I = q - T, Tt[2] = T - (q - I) + (_ - I), Tt[3] = q), (u !== 0 || d !== 0 || l !== 0 || g !== 0) && (V = W * W, O = Z * W, N = O - (O - W), B = W - N, z = B * B - (V - N * N - (N + N) * B), X = K * K, O = Z * K, N = O - (O - K), B = K - N, U = B * B - (X - N * N - (N + N) * B), _ = z + U, I = _ - z, Bt[0] = z - (_ - I) + (U - I), T = V + _, I = T - V, $ = V - (T - I) + (_ - I), _ = $ + X, I = _ - $, Bt[1] = $ - (_ - I) + (X - I), q = T + _, I = q - T, Bt[2] = T - (q - I) + (_ - I), Bt[3] = q), (l !== 0 || g !== 0 || h !== 0 || v !== 0) && (V = J * J, O = Z * J, N = O - (O - J), B = J - N, z = B * B - (V - N * N - (N + N) * B), X = Q * Q, O = Z * Q, N = O - (O - Q), B = Q - N, U = B * B - (X - N * N - (N + N) * B), _ = z + U, I = _ - z, Rt[0] = z - (_ - I) + (U - I), T = V + _, I = T - V, $ = V - (T - I) + (_ - I), _ = $ + X, I = _ - $, Rt[1] = $ - (_ - I) + (X - I), q = T + _, I = q - T, Rt[2] = T - (q - I) + (_ - I), Rt[3] = q), l !== 0 && (k = G(4, Xt, l, He), f = wt(f, Nt(
    G(k, He, 2 * H, st),
    st,
    G(G(4, Rt, l, et), et, K, ht),
    ht,
    G(G(4, Bt, l, et), et, -Q, ut),
    ut,
    lt,
    mt
  ), mt)), g !== 0 && (M = G(4, Xt, g, Je), f = wt(f, Nt(
    G(M, Je, 2 * tt, st),
    st,
    G(G(4, Bt, g, et), et, J, ht),
    ht,
    G(G(4, Rt, g, et), et, -W, ut),
    ut,
    lt,
    mt
  ), mt)), h !== 0 && (b = G(4, zt, h, Qe), f = wt(f, Nt(
    G(b, Qe, 2 * W, st),
    st,
    G(G(4, Tt, h, et), et, Q, ht),
    ht,
    G(G(4, Rt, h, et), et, -tt, ut),
    ut,
    lt,
    mt
  ), mt)), v !== 0 && (x = G(4, zt, v, Ze), f = wt(f, Nt(
    G(x, Ze, 2 * K, st),
    st,
    G(G(4, Rt, v, et), et, H, ht),
    ht,
    G(G(4, Tt, v, et), et, -J, ut),
    ut,
    lt,
    mt
  ), mt)), u !== 0 && (p = G(4, Yt, u, tn), f = wt(f, Nt(
    G(p, tn, 2 * J, st),
    st,
    G(G(4, Bt, u, et), et, tt, ht),
    ht,
    G(G(4, Tt, u, et), et, -K, ut),
    ut,
    lt,
    mt
  ), mt)), d !== 0 && (m = G(4, Yt, d, en), f = wt(f, Nt(
    G(m, en, 2 * Q, st),
    st,
    G(G(4, Tt, d, et), et, W, ht),
    ht,
    G(G(4, Bt, d, et), et, -H, ut),
    ut,
    lt,
    mt
  ), mt)), l !== 0 || g !== 0) {
    if (h !== 0 || v !== 0 || u !== 0 || d !== 0 ? (V = h * Q, O = Z * h, N = O - (O - h), B = h - N, O = Z * Q, C = O - (O - Q), P = Q - C, z = B * P - (V - N * C - B * C - N * P), X = W * d, O = Z * W, N = O - (O - W), B = W - N, O = Z * d, C = O - (O - d), P = d - C, U = B * P - (X - N * C - B * C - N * P), _ = z + U, I = _ - z, St[0] = z - (_ - I) + (U - I), T = V + _, I = T - V, $ = V - (T - I) + (_ - I), _ = $ + X, I = _ - $, St[1] = $ - (_ - I) + (X - I), q = T + _, I = q - T, St[2] = T - (q - I) + (_ - I), St[3] = q, V = u * -K, O = Z * u, N = O - (O - u), B = u - N, O = Z * -K, C = O - (O - -K), P = -K - C, z = B * P - (V - N * C - B * C - N * P), X = J * -v, O = Z * J, N = O - (O - J), B = J - N, O = Z * -v, C = O - (O - -v), P = -v - C, U = B * P - (X - N * C - B * C - N * P), _ = z + U, I = _ - z, Mt[0] = z - (_ - I) + (U - I), T = V + _, I = T - V, $ = V - (T - I) + (_ - I), _ = $ + X, I = _ - $, Mt[1] = $ - (_ - I) + (X - I), q = T + _, I = q - T, Mt[2] = T - (q - I) + (_ - I), Mt[3] = q, S = vt(4, St, 4, Mt, be), V = h * d, O = Z * h, N = O - (O - h), B = h - N, O = Z * d, C = O - (O - d), P = d - C, z = B * P - (V - N * C - B * C - N * P), X = u * v, O = Z * u, N = O - (O - u), B = u - N, O = Z * v, C = O - (O - v), P = v - C, U = B * P - (X - N * C - B * C - N * P), _ = z - U, I = z - _, Wt[0] = z - (_ + I) + (I - U), T = V + _, I = T - V, $ = V - (T - I) + (_ - I), _ = $ - X, I = $ - _, Wt[1] = $ - (_ + I) + (I - X), q = T + _, I = q - T, Wt[2] = T - (q - I) + (_ - I), Wt[3] = q, A = 4) : (be[0] = 0, S = 1, Wt[0] = 0, A = 1), l !== 0) {
      const L = G(S, be, l, ut);
      f = wt(f, vt(
        G(k, He, l, st),
        st,
        G(L, ut, 2 * H, lt),
        lt,
        mt
      ), mt);
      const j = G(A, Wt, l, et);
      f = wt(f, Nt(
        G(j, et, 2 * H, st),
        st,
        G(j, et, l, ht),
        ht,
        G(L, ut, l, lt),
        lt,
        qt,
        _t
      ), _t), v !== 0 && (f = wt(f, G(G(4, Rt, l, et), et, v, st), st)), d !== 0 && (f = wt(f, G(G(4, Bt, -l, et), et, d, st), st));
    }
    if (g !== 0) {
      const L = G(S, be, g, ut);
      f = wt(f, vt(
        G(M, Je, g, st),
        st,
        G(L, ut, 2 * tt, lt),
        lt,
        mt
      ), mt);
      const j = G(A, Wt, g, et);
      f = wt(f, Nt(
        G(j, et, 2 * tt, st),
        st,
        G(j, et, g, ht),
        ht,
        G(L, ut, g, lt),
        lt,
        qt,
        _t
      ), _t);
    }
  }
  if (h !== 0 || v !== 0) {
    if (u !== 0 || d !== 0 || l !== 0 || g !== 0 ? (V = u * tt, O = Z * u, N = O - (O - u), B = u - N, O = Z * tt, C = O - (O - tt), P = tt - C, z = B * P - (V - N * C - B * C - N * P), X = J * g, O = Z * J, N = O - (O - J), B = J - N, O = Z * g, C = O - (O - g), P = g - C, U = B * P - (X - N * C - B * C - N * P), _ = z + U, I = _ - z, St[0] = z - (_ - I) + (U - I), T = V + _, I = T - V, $ = V - (T - I) + (_ - I), _ = $ + X, I = _ - $, St[1] = $ - (_ - I) + (X - I), q = T + _, I = q - T, St[2] = T - (q - I) + (_ - I), St[3] = q, R = -Q, Y = -d, V = l * R, O = Z * l, N = O - (O - l), B = l - N, O = Z * R, C = O - (O - R), P = R - C, z = B * P - (V - N * C - B * C - N * P), X = H * Y, O = Z * H, N = O - (O - H), B = H - N, O = Z * Y, C = O - (O - Y), P = Y - C, U = B * P - (X - N * C - B * C - N * P), _ = z + U, I = _ - z, Mt[0] = z - (_ - I) + (U - I), T = V + _, I = T - V, $ = V - (T - I) + (_ - I), _ = $ + X, I = _ - $, Mt[1] = $ - (_ - I) + (X - I), q = T + _, I = q - T, Mt[2] = T - (q - I) + (_ - I), Mt[3] = q, E = vt(4, St, 4, Mt, ye), V = u * g, O = Z * u, N = O - (O - u), B = u - N, O = Z * g, C = O - (O - g), P = g - C, z = B * P - (V - N * C - B * C - N * P), X = l * d, O = Z * l, N = O - (O - l), B = l - N, O = Z * d, C = O - (O - d), P = d - C, U = B * P - (X - N * C - B * C - N * P), _ = z - U, I = z - _, Kt[0] = z - (_ + I) + (I - U), T = V + _, I = T - V, $ = V - (T - I) + (_ - I), _ = $ - X, I = $ - _, Kt[1] = $ - (_ + I) + (I - X), q = T + _, I = q - T, Kt[2] = T - (q - I) + (_ - I), Kt[3] = q, F = 4) : (ye[0] = 0, E = 1, Kt[0] = 0, F = 1), h !== 0) {
      const L = G(E, ye, h, ut);
      f = wt(f, vt(
        G(b, Qe, h, st),
        st,
        G(L, ut, 2 * W, lt),
        lt,
        mt
      ), mt);
      const j = G(F, Kt, h, et);
      f = wt(f, Nt(
        G(j, et, 2 * W, st),
        st,
        G(j, et, h, ht),
        ht,
        G(L, ut, h, lt),
        lt,
        qt,
        _t
      ), _t), d !== 0 && (f = wt(f, G(G(4, Tt, h, et), et, d, st), st)), g !== 0 && (f = wt(f, G(G(4, Rt, -h, et), et, g, st), st));
    }
    if (v !== 0) {
      const L = G(E, ye, v, ut);
      f = wt(f, vt(
        G(x, Ze, v, st),
        st,
        G(L, ut, 2 * K, lt),
        lt,
        mt
      ), mt);
      const j = G(F, Kt, v, et);
      f = wt(f, Nt(
        G(j, et, 2 * K, st),
        st,
        G(j, et, v, ht),
        ht,
        G(L, ut, v, lt),
        lt,
        qt,
        _t
      ), _t);
    }
  }
  if (u !== 0 || d !== 0) {
    if (l !== 0 || g !== 0 || h !== 0 || v !== 0 ? (V = l * K, O = Z * l, N = O - (O - l), B = l - N, O = Z * K, C = O - (O - K), P = K - C, z = B * P - (V - N * C - B * C - N * P), X = H * v, O = Z * H, N = O - (O - H), B = H - N, O = Z * v, C = O - (O - v), P = v - C, U = B * P - (X - N * C - B * C - N * P), _ = z + U, I = _ - z, St[0] = z - (_ - I) + (U - I), T = V + _, I = T - V, $ = V - (T - I) + (_ - I), _ = $ + X, I = _ - $, St[1] = $ - (_ - I) + (X - I), q = T + _, I = q - T, St[2] = T - (q - I) + (_ - I), St[3] = q, R = -tt, Y = -g, V = h * R, O = Z * h, N = O - (O - h), B = h - N, O = Z * R, C = O - (O - R), P = R - C, z = B * P - (V - N * C - B * C - N * P), X = W * Y, O = Z * W, N = O - (O - W), B = W - N, O = Z * Y, C = O - (O - Y), P = Y - C, U = B * P - (X - N * C - B * C - N * P), _ = z + U, I = _ - z, Mt[0] = z - (_ - I) + (U - I), T = V + _, I = T - V, $ = V - (T - I) + (_ - I), _ = $ + X, I = _ - $, Mt[1] = $ - (_ - I) + (X - I), q = T + _, I = q - T, Mt[2] = T - (q - I) + (_ - I), Mt[3] = q, w = vt(4, St, 4, Mt, ve), V = l * v, O = Z * l, N = O - (O - l), B = l - N, O = Z * v, C = O - (O - v), P = v - C, z = B * P - (V - N * C - B * C - N * P), X = h * g, O = Z * h, N = O - (O - h), B = h - N, O = Z * g, C = O - (O - g), P = g - C, U = B * P - (X - N * C - B * C - N * P), _ = z - U, I = z - _, Gt[0] = z - (_ + I) + (I - U), T = V + _, I = T - V, $ = V - (T - I) + (_ - I), _ = $ - X, I = $ - _, Gt[1] = $ - (_ + I) + (I - X), q = T + _, I = q - T, Gt[2] = T - (q - I) + (_ - I), Gt[3] = q, y = 4) : (ve[0] = 0, w = 1, Gt[0] = 0, y = 1), u !== 0) {
      const L = G(w, ve, u, ut);
      f = wt(f, vt(
        G(p, tn, u, st),
        st,
        G(L, ut, 2 * J, lt),
        lt,
        mt
      ), mt);
      const j = G(y, Gt, u, et);
      f = wt(f, Nt(
        G(j, et, 2 * J, st),
        st,
        G(j, et, u, ht),
        ht,
        G(L, ut, u, lt),
        lt,
        qt,
        _t
      ), _t), g !== 0 && (f = wt(f, G(G(4, Bt, u, et), et, g, st), st)), v !== 0 && (f = wt(f, G(G(4, Tt, -u, et), et, v, st), st));
    }
    if (d !== 0) {
      const L = G(w, ve, d, ut);
      f = wt(f, vt(
        G(m, en, d, st),
        st,
        G(L, ut, 2 * Q, lt),
        lt,
        mt
      ), mt);
      const j = G(y, Gt, d, et);
      f = wt(f, Nt(
        G(j, et, 2 * Q, st),
        st,
        G(j, et, d, ht),
        ht,
        G(L, ut, d, lt),
        lt,
        qt,
        _t
      ), _t);
    }
  }
  return re[f - 1];
}
function Le(r, t, e, n, s, o, i, a) {
  const c = r - i, f = e - i, l = s - i, h = t - a, u = n - a, g = o - a, v = f * g, d = l * u, k = c * c + h * h, M = l * h, b = c * g, x = f * f + u * u, p = c * u, m = f * h, w = l * l + g * g, S = k * (v - d) + x * (M - b) + w * (p - m), E = (Math.abs(v) + Math.abs(d)) * k + (Math.abs(M) + Math.abs(b)) * x + (Math.abs(p) + Math.abs(m)) * w, y = Zs * E;
  return S > y || -S > y ? S : nr(r, t, e, n, s, o, i, a, E);
}
function sr(r, t) {
  var e, n, s = 0, o, i, a, c, f, l, h, u = r[0], g = r[1], v = t.length;
  for (e = 0; e < v; e++) {
    n = 0;
    var d = t[e], k = d.length - 1;
    if (l = d[0], l[0] !== d[k][0] && l[1] !== d[k][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (i = l[0] - u, a = l[1] - g, n; n < k; n++) {
      if (h = d[n + 1], c = h[0] - u, f = h[1] - g, a === 0 && f === 0) {
        if (c <= 0 && i >= 0 || i <= 0 && c >= 0)
          return 0;
      } else if (f >= 0 && a <= 0 || f <= 0 && a >= 0) {
        if (o = ct(i, c, a, f, 0, 0), o === 0)
          return 0;
        (o > 0 && f > 0 && a <= 0 || o < 0 && f <= 0 && a > 0) && s++;
      }
      l = h, a = f, i = c;
    }
  }
  return s % 2 !== 0;
}
function sn(r, t, e = {}) {
  if (!r)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const n = Gs(r), s = Ws(t), o = s.type, i = t.bbox;
  let a = s.coordinates;
  if (i && rr(n, i) === !1)
    return !1;
  o === "Polygon" && (a = [a]);
  for (var c = 0; c < a.length; ++c) {
    const f = sr(n, a[c]);
    if (f === 0 && !e.ignoreBoundary) return !0;
    if (f) return !0;
  }
  return !1;
}
function rr(r, t) {
  return t[0] <= r[0] && t[1] <= r[1] && t[2] >= r[0] && t[3] >= r[1];
}
class pn {
  constructor(t = [], e = ir) {
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
function ir(r, t) {
  return r < t ? -1 : r > t ? 1 : 0;
}
const or = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: pn
}, Symbol.toStringTag, { value: "Module" })), Lt = 11102230246251565e-32, yt = 134217729, ar = (3 + 8 * Lt) * Lt;
function rn(r, t, e, n, s) {
  let o, i, a, c, f = t[0], l = n[0], h = 0, u = 0;
  l > f == l > -f ? (o = f, f = t[++h]) : (o = l, l = n[++u]);
  let g = 0;
  if (h < r && u < e)
    for (l > f == l > -f ? (i = f + o, a = o - (i - f), f = t[++h]) : (i = l + o, a = o - (i - l), l = n[++u]), o = i, a !== 0 && (s[g++] = a); h < r && u < e; )
      l > f == l > -f ? (i = o + f, c = i - o, a = o - (i - c) + (f - c), f = t[++h]) : (i = o + l, c = i - o, a = o - (i - c) + (l - c), l = n[++u]), o = i, a !== 0 && (s[g++] = a);
  for (; h < r; )
    i = o + f, c = i - o, a = o - (i - c) + (f - c), f = t[++h], o = i, a !== 0 && (s[g++] = a);
  for (; u < e; )
    i = o + l, c = i - o, a = o - (i - c) + (l - c), l = n[++u], o = i, a !== 0 && (s[g++] = a);
  return (o !== 0 || g === 0) && (s[g++] = o), g;
}
function cr(r, t) {
  let e = t[0];
  for (let n = 1; n < r; n++) e += t[n];
  return e;
}
function we(r) {
  return new Float64Array(r);
}
const fr = (3 + 16 * Lt) * Lt, lr = (2 + 12 * Lt) * Lt, hr = (9 + 64 * Lt) * Lt * Lt, ne = we(4), An = we(8), Nn = we(12), Fn = we(16), Et = we(4);
function ur(r, t, e, n, s, o, i) {
  let a, c, f, l, h, u, g, v, d, k, M, b, x, p, m, w, S, E;
  const y = r - s, A = e - s, F = t - o, R = n - o;
  p = y * R, u = yt * y, g = u - (u - y), v = y - g, u = yt * R, d = u - (u - R), k = R - d, m = v * k - (p - g * d - v * d - g * k), w = F * A, u = yt * F, g = u - (u - F), v = F - g, u = yt * A, d = u - (u - A), k = A - d, S = v * k - (w - g * d - v * d - g * k), M = m - S, h = m - M, ne[0] = m - (M + h) + (h - S), b = p + M, h = b - p, x = p - (b - h) + (M - h), M = x - w, h = x - M, ne[1] = x - (M + h) + (h - w), E = b + M, h = E - b, ne[2] = b - (E - h) + (M - h), ne[3] = E;
  let Y = cr(4, ne), I = lr * i;
  if (Y >= I || -Y >= I || (h = r - y, a = r - (y + h) + (h - s), h = e - A, f = e - (A + h) + (h - s), h = t - F, c = t - (F + h) + (h - o), h = n - R, l = n - (R + h) + (h - o), a === 0 && c === 0 && f === 0 && l === 0) || (I = hr * i + ar * Math.abs(Y), Y += y * l + R * a - (F * f + A * c), Y >= I || -Y >= I)) return Y;
  p = a * R, u = yt * a, g = u - (u - a), v = a - g, u = yt * R, d = u - (u - R), k = R - d, m = v * k - (p - g * d - v * d - g * k), w = c * A, u = yt * c, g = u - (u - c), v = c - g, u = yt * A, d = u - (u - A), k = A - d, S = v * k - (w - g * d - v * d - g * k), M = m - S, h = m - M, Et[0] = m - (M + h) + (h - S), b = p + M, h = b - p, x = p - (b - h) + (M - h), M = x - w, h = x - M, Et[1] = x - (M + h) + (h - w), E = b + M, h = E - b, Et[2] = b - (E - h) + (M - h), Et[3] = E;
  const O = rn(4, ne, 4, Et, An);
  p = y * l, u = yt * y, g = u - (u - y), v = y - g, u = yt * l, d = u - (u - l), k = l - d, m = v * k - (p - g * d - v * d - g * k), w = F * f, u = yt * F, g = u - (u - F), v = F - g, u = yt * f, d = u - (u - f), k = f - d, S = v * k - (w - g * d - v * d - g * k), M = m - S, h = m - M, Et[0] = m - (M + h) + (h - S), b = p + M, h = b - p, x = p - (b - h) + (M - h), M = x - w, h = x - M, Et[1] = x - (M + h) + (h - w), E = b + M, h = E - b, Et[2] = b - (E - h) + (M - h), Et[3] = E;
  const N = rn(O, An, 4, Et, Nn);
  p = a * l, u = yt * a, g = u - (u - a), v = a - g, u = yt * l, d = u - (u - l), k = l - d, m = v * k - (p - g * d - v * d - g * k), w = c * f, u = yt * c, g = u - (u - c), v = c - g, u = yt * f, d = u - (u - f), k = f - d, S = v * k - (w - g * d - v * d - g * k), M = m - S, h = m - M, Et[0] = m - (M + h) + (h - S), b = p + M, h = b - p, x = p - (b - h) + (M - h), M = x - w, h = x - M, Et[1] = x - (M + h) + (h - w), E = b + M, h = E - b, Et[2] = b - (E - h) + (M - h), Et[3] = E;
  const B = rn(N, Nn, 4, Et, Fn);
  return Fn[B - 1];
}
function On(r, t, e, n, s, o) {
  const i = (t - o) * (e - s), a = (r - s) * (n - o), c = i - a;
  if (i === 0 || a === 0 || i > 0 != a > 0) return c;
  const f = Math.abs(i + a);
  return Math.abs(c) >= fr * f ? c : -ur(r, t, e, n, s, o, f);
}
function dr(r, t) {
  const e = new pn([], As);
  return pr(r, e), mr(e, t);
}
function As(r, t) {
  return r.p.x > t.p.x ? 1 : r.p.x < t.p.x || r.p.x === t.p.x && (r.featureId !== t.featureId || r.ringId !== t.ringId) && r.isLeftEndpoint && !t.isLeftEndpoint ? -1 : r.p.y !== t.p.y ? r.p.y > t.p.y ? 1 : -1 : 1;
}
function gr(r, t) {
  return r.rightSweepEvent.p.x > t.rightSweepEvent.p.x ? 1 : r.rightSweepEvent.p.x < t.rightSweepEvent.p.x ? -1 : r.rightSweepEvent.p.y !== t.rightSweepEvent.p.y ? r.rightSweepEvent.p.y < t.rightSweepEvent.p.y ? 1 : -1 : 1;
}
function pr(r, t) {
  if (r.type === "FeatureCollection") {
    const e = r.features;
    for (let n = 0; n < e.length; n++)
      Tn(e[n], t);
  } else
    Tn(r, t);
}
var xe = 0, ke = 0, Se = 0;
function Tn(r, t) {
  const e = r.type === "Feature" ? r.geometry : r;
  let n = e.coordinates;
  (e.type === "Polygon" || e.type === "MultiLineString") && (n = [n]), e.type === "LineString" && (n = [[n]]);
  for (let s = 0; s < n.length; s++)
    for (let o = 0; o < n[s].length; o++) {
      let i = n[s][o][0], a = null;
      ke = ke + 1;
      for (let c = 0; c < n[s][o].length - 1; c++) {
        a = n[s][o][c + 1];
        const f = new Bn(i, xe, ke, Se), l = new Bn(a, xe, ke, Se + 1);
        f.otherEvent = l, l.otherEvent = f, As(f, l) > 0 ? (l.isLeftEndpoint = !0, f.isLeftEndpoint = !1) : (f.isLeftEndpoint = !0, l.isLeftEndpoint = !1), t.push(f), t.push(l), i = a, Se = Se + 1;
      }
    }
  xe = xe + 1;
}
var Bn = class {
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
function mr(r, t = !1) {
  const e = [], n = new pn([], gr);
  for (; r.length; ) {
    const s = r.pop();
    if (s.isLeftEndpoint) {
      const o = new wr(s);
      for (let i = 0; i < n.data.length; i++) {
        const a = n.data[i];
        if (t && a.leftSweepEvent.featureId === s.featureId)
          continue;
        const c = vr(o, a);
        c !== !1 && e.push(c);
      }
      n.push(o);
    } else s.isLeftEndpoint === !1 && n.pop();
  }
  return e;
}
var wr = class {
  /** @param event must have otherEvent non-null */
  constructor(r) {
    this.leftSweepEvent = r, this.rightSweepEvent = r.otherEvent;
  }
};
function vr(r, t) {
  if (r === null || t === null) return !1;
  const e = r.leftSweepEvent.p.x, n = r.leftSweepEvent.p.y, s = r.rightSweepEvent.p.x, o = r.rightSweepEvent.p.y, i = t.leftSweepEvent.p.x, a = t.leftSweepEvent.p.y, c = t.rightSweepEvent.p.x, f = t.rightSweepEvent.p.y, l = On(e, n, s, o, i, a), h = On(e, n, s, o, c, f);
  if (l > 0 && h > 0) return !1;
  if (l < 0 && h < 0) return !1;
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
  const u = (f - a) * (s - e) - (c - i) * (o - n), g = (c - i) * (n - a) - (f - a) * (e - i), v = (s - e) * (n - a) - (o - n) * (e - i);
  if (u === 0)
    return !1;
  const d = g / u, k = v / u;
  if (d >= 0 && d <= 1 && k >= 0 && k <= 1) {
    const M = e + d * (s - e), b = n + d * (o - n);
    return [M, b];
  }
  return !1;
}
function br(r, t, e = {}) {
  const { removeDuplicates: n = !0, ignoreSelfIntersections: s = !0 } = e;
  let o = [];
  r.type === "FeatureCollection" ? o = o.concat(r.features) : r.type === "Feature" ? o.push(r) : (r.type === "LineString" || r.type === "Polygon" || r.type === "MultiLineString" || r.type === "MultiPolygon") && o.push(de(r)), t.type === "FeatureCollection" ? o = o.concat(t.features) : t.type === "Feature" ? o.push(t) : (t.type === "LineString" || t.type === "Polygon" || t.type === "MultiLineString" || t.type === "MultiPolygon") && o.push(de(t));
  const i = dr(
    bt(o),
    s
  );
  let a = [];
  if (n) {
    const c = {};
    i.forEach((f) => {
      const l = f.join(",");
      c[l] || (c[l] = !0, a.push(f));
    });
  } else
    a = i;
  return bt(a.map((c) => Zt(c)));
}
function yr(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
function xr(r) {
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
function kr(r, t = {}) {
  let e = 0, n = 0, s = 0;
  return gn(
    r,
    function(o) {
      e += o[0], n += o[1], s++;
    },
    !0
  ), Zt([e / s, n / s], t.properties);
}
var Me = { exports: {} }, Oe = { exports: {} }, Sr = Oe.exports, Rn;
function Mr() {
  return Rn || (Rn = 1, (function(r, t) {
    (function(e, n) {
      r.exports = n();
    })(Sr, function() {
      function e(b, x, p, m, w) {
        (function S(E, y, A, F, R) {
          for (; F > A; ) {
            if (F - A > 600) {
              var Y = F - A + 1, I = y - A + 1, O = Math.log(Y), N = 0.5 * Math.exp(2 * O / 3), B = 0.5 * Math.sqrt(O * N * (Y - N) / Y) * (I - Y / 2 < 0 ? -1 : 1), C = Math.max(A, Math.floor(y - I * N / Y + B)), P = Math.min(F, Math.floor(y + (Y - I) * N / Y + B));
              S(E, y, C, P, R);
            }
            var _ = E[y], T = A, $ = F;
            for (n(E, A, y), R(E[F], _) > 0 && n(E, A, F); T < $; ) {
              for (n(E, T, $), T++, $--; R(E[T], _) < 0; ) T++;
              for (; R(E[$], _) > 0; ) $--;
            }
            R(E[A], _) === 0 ? n(E, A, $) : n(E, ++$, F), $ <= y && (A = $ + 1), y <= $ && (F = $ - 1);
          }
        })(b, x, p || 0, m || b.length - 1, w || s);
      }
      function n(b, x, p) {
        var m = b[x];
        b[x] = b[p], b[p] = m;
      }
      function s(b, x) {
        return b < x ? -1 : b > x ? 1 : 0;
      }
      var o = function(b) {
        b === void 0 && (b = 9), this._maxEntries = Math.max(4, b), this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries)), this.clear();
      };
      function i(b, x, p) {
        if (!p) return x.indexOf(b);
        for (var m = 0; m < x.length; m++) if (p(b, x[m])) return m;
        return -1;
      }
      function a(b, x) {
        c(b, 0, b.children.length, x, b);
      }
      function c(b, x, p, m, w) {
        w || (w = k(null)), w.minX = 1 / 0, w.minY = 1 / 0, w.maxX = -1 / 0, w.maxY = -1 / 0;
        for (var S = x; S < p; S++) {
          var E = b.children[S];
          f(w, b.leaf ? m(E) : E);
        }
        return w;
      }
      function f(b, x) {
        return b.minX = Math.min(b.minX, x.minX), b.minY = Math.min(b.minY, x.minY), b.maxX = Math.max(b.maxX, x.maxX), b.maxY = Math.max(b.maxY, x.maxY), b;
      }
      function l(b, x) {
        return b.minX - x.minX;
      }
      function h(b, x) {
        return b.minY - x.minY;
      }
      function u(b) {
        return (b.maxX - b.minX) * (b.maxY - b.minY);
      }
      function g(b) {
        return b.maxX - b.minX + (b.maxY - b.minY);
      }
      function v(b, x) {
        return b.minX <= x.minX && b.minY <= x.minY && x.maxX <= b.maxX && x.maxY <= b.maxY;
      }
      function d(b, x) {
        return x.minX <= b.maxX && x.minY <= b.maxY && x.maxX >= b.minX && x.maxY >= b.minY;
      }
      function k(b) {
        return { children: b, height: 1, leaf: !0, minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
      }
      function M(b, x, p, m, w) {
        for (var S = [x, p]; S.length; ) if (!((p = S.pop()) - (x = S.pop()) <= m)) {
          var E = x + Math.ceil((p - x) / m / 2) * m;
          e(b, E, x, p, w), S.push(x, E, E, p);
        }
      }
      return o.prototype.all = function() {
        return this._all(this.data, []);
      }, o.prototype.search = function(b) {
        var x = this.data, p = [];
        if (!d(b, x)) return p;
        for (var m = this.toBBox, w = []; x; ) {
          for (var S = 0; S < x.children.length; S++) {
            var E = x.children[S], y = x.leaf ? m(E) : E;
            d(b, y) && (x.leaf ? p.push(E) : v(b, y) ? this._all(E, p) : w.push(E));
          }
          x = w.pop();
        }
        return p;
      }, o.prototype.collides = function(b) {
        var x = this.data;
        if (!d(b, x)) return !1;
        for (var p = []; x; ) {
          for (var m = 0; m < x.children.length; m++) {
            var w = x.children[m], S = x.leaf ? this.toBBox(w) : w;
            if (d(b, S)) {
              if (x.leaf || v(b, S)) return !0;
              p.push(w);
            }
          }
          x = p.pop();
        }
        return !1;
      }, o.prototype.load = function(b) {
        if (!b || !b.length) return this;
        if (b.length < this._minEntries) {
          for (var x = 0; x < b.length; x++) this.insert(b[x]);
          return this;
        }
        var p = this._build(b.slice(), 0, b.length - 1, 0);
        if (this.data.children.length) if (this.data.height === p.height) this._splitRoot(this.data, p);
        else {
          if (this.data.height < p.height) {
            var m = this.data;
            this.data = p, p = m;
          }
          this._insert(p, this.data.height - p.height - 1, !0);
        }
        else this.data = p;
        return this;
      }, o.prototype.insert = function(b) {
        return b && this._insert(b, this.data.height - 1), this;
      }, o.prototype.clear = function() {
        return this.data = k([]), this;
      }, o.prototype.remove = function(b, x) {
        if (!b) return this;
        for (var p, m, w, S = this.data, E = this.toBBox(b), y = [], A = []; S || y.length; ) {
          if (S || (S = y.pop(), m = y[y.length - 1], p = A.pop(), w = !0), S.leaf) {
            var F = i(b, S.children, x);
            if (F !== -1) return S.children.splice(F, 1), y.push(S), this._condense(y), this;
          }
          w || S.leaf || !v(S, E) ? m ? (p++, S = m.children[p], w = !1) : S = null : (y.push(S), A.push(p), p = 0, m = S, S = S.children[0]);
        }
        return this;
      }, o.prototype.toBBox = function(b) {
        return b;
      }, o.prototype.compareMinX = function(b, x) {
        return b.minX - x.minX;
      }, o.prototype.compareMinY = function(b, x) {
        return b.minY - x.minY;
      }, o.prototype.toJSON = function() {
        return this.data;
      }, o.prototype.fromJSON = function(b) {
        return this.data = b, this;
      }, o.prototype._all = function(b, x) {
        for (var p = []; b; ) b.leaf ? x.push.apply(x, b.children) : p.push.apply(p, b.children), b = p.pop();
        return x;
      }, o.prototype._build = function(b, x, p, m) {
        var w, S = p - x + 1, E = this._maxEntries;
        if (S <= E) return a(w = k(b.slice(x, p + 1)), this.toBBox), w;
        m || (m = Math.ceil(Math.log(S) / Math.log(E)), E = Math.ceil(S / Math.pow(E, m - 1))), (w = k([])).leaf = !1, w.height = m;
        var y = Math.ceil(S / E), A = y * Math.ceil(Math.sqrt(E));
        M(b, x, p, A, this.compareMinX);
        for (var F = x; F <= p; F += A) {
          var R = Math.min(F + A - 1, p);
          M(b, F, R, y, this.compareMinY);
          for (var Y = F; Y <= R; Y += y) {
            var I = Math.min(Y + y - 1, R);
            w.children.push(this._build(b, Y, I, m - 1));
          }
        }
        return a(w, this.toBBox), w;
      }, o.prototype._chooseSubtree = function(b, x, p, m) {
        for (; m.push(x), !x.leaf && m.length - 1 !== p; ) {
          for (var w = 1 / 0, S = 1 / 0, E = void 0, y = 0; y < x.children.length; y++) {
            var A = x.children[y], F = u(A), R = (Y = b, I = A, (Math.max(I.maxX, Y.maxX) - Math.min(I.minX, Y.minX)) * (Math.max(I.maxY, Y.maxY) - Math.min(I.minY, Y.minY)) - F);
            R < S ? (S = R, w = F < w ? F : w, E = A) : R === S && F < w && (w = F, E = A);
          }
          x = E || x.children[0];
        }
        var Y, I;
        return x;
      }, o.prototype._insert = function(b, x, p) {
        var m = p ? b : this.toBBox(b), w = [], S = this._chooseSubtree(m, this.data, x, w);
        for (S.children.push(b), f(S, m); x >= 0 && w[x].children.length > this._maxEntries; ) this._split(w, x), x--;
        this._adjustParentBBoxes(m, w, x);
      }, o.prototype._split = function(b, x) {
        var p = b[x], m = p.children.length, w = this._minEntries;
        this._chooseSplitAxis(p, w, m);
        var S = this._chooseSplitIndex(p, w, m), E = k(p.children.splice(S, p.children.length - S));
        E.height = p.height, E.leaf = p.leaf, a(p, this.toBBox), a(E, this.toBBox), x ? b[x - 1].children.push(E) : this._splitRoot(p, E);
      }, o.prototype._splitRoot = function(b, x) {
        this.data = k([b, x]), this.data.height = b.height + 1, this.data.leaf = !1, a(this.data, this.toBBox);
      }, o.prototype._chooseSplitIndex = function(b, x, p) {
        for (var m, w, S, E, y, A, F, R = 1 / 0, Y = 1 / 0, I = x; I <= p - x; I++) {
          var O = c(b, 0, I, this.toBBox), N = c(b, I, p, this.toBBox), B = (w = O, S = N, E = void 0, y = void 0, A = void 0, F = void 0, E = Math.max(w.minX, S.minX), y = Math.max(w.minY, S.minY), A = Math.min(w.maxX, S.maxX), F = Math.min(w.maxY, S.maxY), Math.max(0, A - E) * Math.max(0, F - y)), C = u(O) + u(N);
          B < R ? (R = B, m = I, Y = C < Y ? C : Y) : B === R && C < Y && (Y = C, m = I);
        }
        return m || p - x;
      }, o.prototype._chooseSplitAxis = function(b, x, p) {
        var m = b.leaf ? this.compareMinX : l, w = b.leaf ? this.compareMinY : h;
        this._allDistMargin(b, x, p, m) < this._allDistMargin(b, x, p, w) && b.children.sort(m);
      }, o.prototype._allDistMargin = function(b, x, p, m) {
        b.children.sort(m);
        for (var w = this.toBBox, S = c(b, 0, x, w), E = c(b, p - x, p, w), y = g(S) + g(E), A = x; A < p - x; A++) {
          var F = b.children[A];
          f(S, b.leaf ? w(F) : F), y += g(S);
        }
        for (var R = p - x - 1; R >= x; R--) {
          var Y = b.children[R];
          f(E, b.leaf ? w(Y) : Y), y += g(E);
        }
        return y;
      }, o.prototype._adjustParentBBoxes = function(b, x, p) {
        for (var m = p; m >= 0; m--) f(x[m], b);
      }, o.prototype._condense = function(b) {
        for (var x = b.length - 1, p = void 0; x >= 0; x--) b[x].children.length === 0 ? x > 0 ? (p = b[x - 1].children).splice(p.indexOf(b[x]), 1) : this.clear() : a(b[x], this.toBBox);
      }, o;
    });
  })(Oe)), Oe.exports;
}
const Er = /* @__PURE__ */ xr(or);
var ae = { exports: {} }, on, Pn;
function _r() {
  return Pn || (Pn = 1, on = function(t, e, n, s) {
    var o = t[0], i = t[1], a = !1;
    n === void 0 && (n = 0), s === void 0 && (s = e.length);
    for (var c = (s - n) / 2, f = 0, l = c - 1; f < c; l = f++) {
      var h = e[n + f * 2 + 0], u = e[n + f * 2 + 1], g = e[n + l * 2 + 0], v = e[n + l * 2 + 1], d = u > i != v > i && o < (g - h) * (i - u) / (v - u) + h;
      d && (a = !a);
    }
    return a;
  }), on;
}
var an, Dn;
function Ir() {
  return Dn || (Dn = 1, an = function(t, e, n, s) {
    var o = t[0], i = t[1], a = !1;
    n === void 0 && (n = 0), s === void 0 && (s = e.length);
    for (var c = s - n, f = 0, l = c - 1; f < c; l = f++) {
      var h = e[f + n][0], u = e[f + n][1], g = e[l + n][0], v = e[l + n][1], d = u > i != v > i && o < (g - h) * (i - u) / (v - u) + h;
      d && (a = !a);
    }
    return a;
  }), an;
}
var Cn;
function Ar() {
  if (Cn) return ae.exports;
  Cn = 1;
  var r = _r(), t = Ir();
  return ae.exports = function(n, s, o, i) {
    return s.length > 0 && Array.isArray(s[0]) ? t(n, s, o, i) : r(n, s, o, i);
  }, ae.exports.nested = t, ae.exports.flat = r, ae.exports;
}
var fe = { exports: {} }, Nr = fe.exports, Vn;
function Fr() {
  return Vn || (Vn = 1, (function(r, t) {
    (function(e, n) {
      n(t);
    })(Nr, function(e) {
      const s = 33306690738754706e-32;
      function o(d, k, M, b, x) {
        let p, m, w, S, E = k[0], y = b[0], A = 0, F = 0;
        y > E == y > -E ? (p = E, E = k[++A]) : (p = y, y = b[++F]);
        let R = 0;
        if (A < d && F < M) for (y > E == y > -E ? (w = p - ((m = E + p) - E), E = k[++A]) : (w = p - ((m = y + p) - y), y = b[++F]), p = m, w !== 0 && (x[R++] = w); A < d && F < M; ) y > E == y > -E ? (w = p - ((m = p + E) - (S = m - p)) + (E - S), E = k[++A]) : (w = p - ((m = p + y) - (S = m - p)) + (y - S), y = b[++F]), p = m, w !== 0 && (x[R++] = w);
        for (; A < d; ) w = p - ((m = p + E) - (S = m - p)) + (E - S), E = k[++A], p = m, w !== 0 && (x[R++] = w);
        for (; F < M; ) w = p - ((m = p + y) - (S = m - p)) + (y - S), y = b[++F], p = m, w !== 0 && (x[R++] = w);
        return p === 0 && R !== 0 || (x[R++] = p), R;
      }
      function i(d) {
        return new Float64Array(d);
      }
      const a = 33306690738754716e-32, c = 22204460492503146e-32, f = 11093356479670487e-47, l = i(4), h = i(8), u = i(12), g = i(16), v = i(4);
      e.orient2d = function(d, k, M, b, x, p) {
        const m = (k - p) * (M - x), w = (d - x) * (b - p), S = m - w;
        if (m === 0 || w === 0 || m > 0 != w > 0) return S;
        const E = Math.abs(m + w);
        return Math.abs(S) >= a * E ? S : -(function(y, A, F, R, Y, I, O) {
          let N, B, C, P, _, T, $, V, z, X, U, q, H, W, J, tt, K, Q;
          const nt = y - Y, D = F - Y, L = A - I, j = R - I;
          _ = (J = (V = nt - ($ = (T = 134217729 * nt) - (T - nt))) * (X = j - (z = (T = 134217729 * j) - (T - j))) - ((W = nt * j) - $ * z - V * z - $ * X)) - (U = J - (K = (V = L - ($ = (T = 134217729 * L) - (T - L))) * (X = D - (z = (T = 134217729 * D) - (T - D))) - ((tt = L * D) - $ * z - V * z - $ * X))), l[0] = J - (U + _) + (_ - K), _ = (H = W - ((q = W + U) - (_ = q - W)) + (U - _)) - (U = H - tt), l[1] = H - (U + _) + (_ - tt), _ = (Q = q + U) - q, l[2] = q - (Q - _) + (U - _), l[3] = Q;
          let rt = (function(Us, bn) {
            let yn = bn[0];
            for (let Ge = 1; Ge < Us; Ge++) yn += bn[Ge];
            return yn;
          })(4, l), it = c * O;
          if (rt >= it || -rt >= it || (N = y - (nt + (_ = y - nt)) + (_ - Y), C = F - (D + (_ = F - D)) + (_ - Y), B = A - (L + (_ = A - L)) + (_ - I), P = R - (j + (_ = R - j)) + (_ - I), N === 0 && B === 0 && C === 0 && P === 0) || (it = f * O + s * Math.abs(rt), (rt += nt * P + j * N - (L * C + D * B)) >= it || -rt >= it)) return rt;
          _ = (J = (V = N - ($ = (T = 134217729 * N) - (T - N))) * (X = j - (z = (T = 134217729 * j) - (T - j))) - ((W = N * j) - $ * z - V * z - $ * X)) - (U = J - (K = (V = B - ($ = (T = 134217729 * B) - (T - B))) * (X = D - (z = (T = 134217729 * D) - (T - D))) - ((tt = B * D) - $ * z - V * z - $ * X))), v[0] = J - (U + _) + (_ - K), _ = (H = W - ((q = W + U) - (_ = q - W)) + (U - _)) - (U = H - tt), v[1] = H - (U + _) + (_ - tt), _ = (Q = q + U) - q, v[2] = q - (Q - _) + (U - _), v[3] = Q;
          const gt = o(4, l, 4, v, h);
          _ = (J = (V = nt - ($ = (T = 134217729 * nt) - (T - nt))) * (X = P - (z = (T = 134217729 * P) - (T - P))) - ((W = nt * P) - $ * z - V * z - $ * X)) - (U = J - (K = (V = L - ($ = (T = 134217729 * L) - (T - L))) * (X = C - (z = (T = 134217729 * C) - (T - C))) - ((tt = L * C) - $ * z - V * z - $ * X))), v[0] = J - (U + _) + (_ - K), _ = (H = W - ((q = W + U) - (_ = q - W)) + (U - _)) - (U = H - tt), v[1] = H - (U + _) + (_ - tt), _ = (Q = q + U) - q, v[2] = q - (Q - _) + (U - _), v[3] = Q;
          const Pt = o(gt, h, 4, v, u);
          _ = (J = (V = N - ($ = (T = 134217729 * N) - (T - N))) * (X = P - (z = (T = 134217729 * P) - (T - P))) - ((W = N * P) - $ * z - V * z - $ * X)) - (U = J - (K = (V = B - ($ = (T = 134217729 * B) - (T - B))) * (X = C - (z = (T = 134217729 * C) - (T - C))) - ((tt = B * C) - $ * z - V * z - $ * X))), v[0] = J - (U + _) + (_ - K), _ = (H = W - ((q = W + U) - (_ = q - W)) + (U - _)) - (U = H - tt), v[1] = H - (U + _) + (_ - tt), _ = (Q = q + U) - q, v[2] = q - (Q - _) + (U - _), v[3] = Q;
          const qs = o(Pt, u, 4, v, g);
          return g[qs - 1];
        })(d, k, M, b, x, p, E);
      }, e.orient2dfast = function(d, k, M, b, x, p) {
        return (k - p) * (M - x) - (d - x) * (b - p);
      }, Object.defineProperty(e, "__esModule", { value: !0 });
    });
  })(fe, fe.exports)), fe.exports;
}
var $n;
function Or() {
  if ($n) return Me.exports;
  $n = 1;
  var r = Mr(), t = Er, e = Ar(), n = Fr().orient2d;
  t.default && (t = t.default), Me.exports = s, Me.exports.default = s;
  function s(p, m, w) {
    m = Math.max(0, m === void 0 ? 2 : m), w = w || 0;
    var S = g(p), E = new r(16);
    E.toBBox = function($) {
      return {
        minX: $[0],
        minY: $[1],
        maxX: $[0],
        maxY: $[1]
      };
    }, E.compareMinX = function($, V) {
      return $[0] - V[0];
    }, E.compareMinY = function($, V) {
      return $[1] - V[1];
    }, E.load(p);
    for (var y = [], A = 0, F; A < S.length; A++) {
      var R = S[A];
      E.remove(R), F = v(R, F), y.push(F);
    }
    var Y = new r(16);
    for (A = 0; A < y.length; A++) Y.insert(u(y[A]));
    for (var I = m * m, O = w * w; y.length; ) {
      var N = y.shift(), B = N.p, C = N.next.p, P = d(B, C);
      if (!(P < O)) {
        var _ = P / I;
        R = o(E, N.prev.p, B, C, N.next.next.p, _, Y), R && Math.min(d(R, B), d(R, C)) <= _ && (y.push(N), y.push(v(R, N)), E.remove(R), Y.remove(N), Y.insert(u(N)), Y.insert(u(N.next)));
      }
    }
    N = F;
    var T = [];
    do
      T.push(N.p), N = N.next;
    while (N !== F);
    return T.push(N.p), T;
  }
  function o(p, m, w, S, E, y, A) {
    for (var F = new t([], i), R = p.data; R; ) {
      for (var Y = 0; Y < R.children.length; Y++) {
        var I = R.children[Y], O = R.leaf ? k(I, w, S) : a(w, S, I);
        O > y || F.push({
          node: I,
          dist: O
        });
      }
      for (; F.length && !F.peek().node.children; ) {
        var N = F.pop(), B = N.node, C = k(B, m, w), P = k(B, S, E);
        if (N.dist < C && N.dist < P && f(w, B, A) && f(S, B, A)) return B;
      }
      R = F.pop(), R && (R = R.node);
    }
    return null;
  }
  function i(p, m) {
    return p.dist - m.dist;
  }
  function a(p, m, w) {
    if (c(p, w) || c(m, w)) return 0;
    var S = M(p[0], p[1], m[0], m[1], w.minX, w.minY, w.maxX, w.minY);
    if (S === 0) return 0;
    var E = M(p[0], p[1], m[0], m[1], w.minX, w.minY, w.minX, w.maxY);
    if (E === 0) return 0;
    var y = M(p[0], p[1], m[0], m[1], w.maxX, w.minY, w.maxX, w.maxY);
    if (y === 0) return 0;
    var A = M(p[0], p[1], m[0], m[1], w.minX, w.maxY, w.maxX, w.maxY);
    return A === 0 ? 0 : Math.min(S, E, y, A);
  }
  function c(p, m) {
    return p[0] >= m.minX && p[0] <= m.maxX && p[1] >= m.minY && p[1] <= m.maxY;
  }
  function f(p, m, w) {
    for (var S = Math.min(p[0], m[0]), E = Math.min(p[1], m[1]), y = Math.max(p[0], m[0]), A = Math.max(p[1], m[1]), F = w.search({ minX: S, minY: E, maxX: y, maxY: A }), R = 0; R < F.length; R++)
      if (h(F[R].p, F[R].next.p, p, m)) return !1;
    return !0;
  }
  function l(p, m, w) {
    return n(p[0], p[1], m[0], m[1], w[0], w[1]);
  }
  function h(p, m, w, S) {
    return p !== S && m !== w && l(p, m, w) > 0 != l(p, m, S) > 0 && l(w, S, p) > 0 != l(w, S, m) > 0;
  }
  function u(p) {
    var m = p.p, w = p.next.p;
    return p.minX = Math.min(m[0], w[0]), p.minY = Math.min(m[1], w[1]), p.maxX = Math.max(m[0], w[0]), p.maxY = Math.max(m[1], w[1]), p;
  }
  function g(p) {
    for (var m = p[0], w = p[0], S = p[0], E = p[0], y = 0; y < p.length; y++) {
      var A = p[y];
      A[0] < m[0] && (m = A), A[0] > S[0] && (S = A), A[1] < w[1] && (w = A), A[1] > E[1] && (E = A);
    }
    var F = [m, w, S, E], R = F.slice();
    for (y = 0; y < p.length; y++)
      e(p[y], F) || R.push(p[y]);
    return x(R);
  }
  function v(p, m) {
    var w = {
      p,
      prev: null,
      next: null,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };
    return m ? (w.next = m.next, w.prev = m, m.next.prev = w, m.next = w) : (w.prev = w, w.next = w), w;
  }
  function d(p, m) {
    var w = p[0] - m[0], S = p[1] - m[1];
    return w * w + S * S;
  }
  function k(p, m, w) {
    var S = m[0], E = m[1], y = w[0] - S, A = w[1] - E;
    if (y !== 0 || A !== 0) {
      var F = ((p[0] - S) * y + (p[1] - E) * A) / (y * y + A * A);
      F > 1 ? (S = w[0], E = w[1]) : F > 0 && (S += y * F, E += A * F);
    }
    return y = p[0] - S, A = p[1] - E, y * y + A * A;
  }
  function M(p, m, w, S, E, y, A, F) {
    var R = w - p, Y = S - m, I = A - E, O = F - y, N = p - E, B = m - y, C = R * R + Y * Y, P = R * I + Y * O, _ = I * I + O * O, T = R * N + Y * B, $ = I * N + O * B, V = C * _ - P * P, z, X, U, q, H = V, W = V;
    V === 0 ? (X = 0, H = 1, q = $, W = _) : (X = P * $ - _ * T, q = C * $ - P * T, X < 0 ? (X = 0, q = $, W = _) : X > H && (X = H, q = $ + P, W = _)), q < 0 ? (q = 0, -T < 0 ? X = 0 : -T > C ? X = H : (X = -T, H = C)) : q > W && (q = W, -T + P < 0 ? X = 0 : -T + P > C ? X = H : (X = -T + P, H = C)), z = X === 0 ? 0 : X / H, U = q === 0 ? 0 : q / W;
    var J = (1 - z) * p + z * w, tt = (1 - z) * m + z * S, K = (1 - U) * E + U * A, Q = (1 - U) * y + U * F, nt = K - J, D = Q - tt;
    return nt * nt + D * D;
  }
  function b(p, m) {
    return p[0] === m[0] ? p[1] - m[1] : p[0] - m[0];
  }
  function x(p) {
    p.sort(b);
    for (var m = [], w = 0; w < p.length; w++) {
      for (; m.length >= 2 && l(m[m.length - 2], m[m.length - 1], p[w]) <= 0; )
        m.pop();
      m.push(p[w]);
    }
    for (var S = [], E = p.length - 1; E >= 0; E--) {
      for (; S.length >= 2 && l(S[S.length - 2], S[S.length - 1], p[E]) <= 0; )
        S.pop();
      S.push(p[E]);
    }
    return S.pop(), m.pop(), m.concat(S);
  }
  return Me.exports;
}
var Tr = Or();
const Br = /* @__PURE__ */ yr(Tr);
function Ln(r, t = {}) {
  t.concavity = t.concavity || 1 / 0;
  const e = [];
  if (gn(r, (s) => {
    e.push([s[0], s[1]]);
  }), !e.length)
    return null;
  const n = Br(e, t.concavity);
  return n.length > 3 ? me([n], t.properties) : null;
}
const Xn = Math.pow(2, -52), Ee = new Uint32Array(512);
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
  static from(t, e = Vr, n = $r) {
    const s = t.length, o = new Float64Array(s * 2);
    for (let i = 0; i < s; i++) {
      const a = t[i];
      o[2 * i] = e(a), o[2 * i + 1] = n(a);
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
    const { coords: t, _hullPrev: e, _hullNext: n, _hullTri: s, _hullHash: o } = this, i = t.length >> 1;
    let a = 1 / 0, c = 1 / 0, f = -1 / 0, l = -1 / 0;
    for (let y = 0; y < i; y++) {
      const A = t[2 * y], F = t[2 * y + 1];
      A < a && (a = A), F < c && (c = F), A > f && (f = A), F > l && (l = F), this._ids[y] = y;
    }
    const h = (a + f) / 2, u = (c + l) / 2;
    let g = 0, v = 0, d = 0;
    for (let y = 0, A = 1 / 0; y < i; y++) {
      const F = cn(h, u, t[2 * y], t[2 * y + 1]);
      F < A && (g = y, A = F);
    }
    const k = t[2 * g], M = t[2 * g + 1];
    for (let y = 0, A = 1 / 0; y < i; y++) {
      if (y === g) continue;
      const F = cn(k, M, t[2 * y], t[2 * y + 1]);
      F < A && F > 0 && (v = y, A = F);
    }
    let b = t[2 * v], x = t[2 * v + 1], p = 1 / 0;
    for (let y = 0; y < i; y++) {
      if (y === g || y === v) continue;
      const A = Dr(k, M, b, x, t[2 * y], t[2 * y + 1]);
      A < p && (d = y, p = A);
    }
    let m = t[2 * d], w = t[2 * d + 1];
    if (p === 1 / 0) {
      for (let F = 0; F < i; F++)
        this._dists[F] = t[2 * F] - t[0] || t[2 * F + 1] - t[1];
      se(this._ids, this._dists, 0, i - 1);
      const y = new Uint32Array(i);
      let A = 0;
      for (let F = 0, R = -1 / 0; F < i; F++) {
        const Y = this._ids[F], I = this._dists[Y];
        I > R && (y[A++] = Y, R = I);
      }
      this.hull = y.subarray(0, A), this.triangles = new Uint32Array(0), this.halfedges = new Int32Array(0);
      return;
    }
    if (ct(k, M, b, x, m, w) < 0) {
      const y = v, A = b, F = x;
      v = d, b = m, x = w, d = y, m = A, w = F;
    }
    const S = Cr(k, M, b, x, m, w);
    this._cx = S.x, this._cy = S.y;
    for (let y = 0; y < i; y++)
      this._dists[y] = cn(t[2 * y], t[2 * y + 1], S.x, S.y);
    se(this._ids, this._dists, 0, i - 1), this._hullStart = g;
    let E = 3;
    n[g] = e[d] = v, n[v] = e[g] = d, n[d] = e[v] = g, s[g] = 0, s[v] = 1, s[d] = 2, o.fill(-1), o[this._hashKey(k, M)] = g, o[this._hashKey(b, x)] = v, o[this._hashKey(m, w)] = d, this.trianglesLen = 0, this._addTriangle(g, v, d, -1, -1, -1);
    for (let y = 0, A = 0, F = 0; y < this._ids.length; y++) {
      const R = this._ids[y], Y = t[2 * R], I = t[2 * R + 1];
      if (y > 0 && Math.abs(Y - A) <= Xn && Math.abs(I - F) <= Xn || (A = Y, F = I, R === g || R === v || R === d)) continue;
      let O = 0;
      for (let _ = 0, T = this._hashKey(Y, I); _ < this._hashSize && (O = o[(T + _) % this._hashSize], !(O !== -1 && O !== n[O])); _++)
        ;
      O = e[O];
      let N = O, B;
      for (; B = n[N], ct(Y, I, t[2 * N], t[2 * N + 1], t[2 * B], t[2 * B + 1]) >= 0; )
        if (N = B, N === O) {
          N = -1;
          break;
        }
      if (N === -1) continue;
      let C = this._addTriangle(N, R, n[N], -1, -1, s[N]);
      s[R] = this._legalize(C + 2), s[N] = C, E++;
      let P = n[N];
      for (; B = n[P], ct(Y, I, t[2 * P], t[2 * P + 1], t[2 * B], t[2 * B + 1]) < 0; )
        C = this._addTriangle(P, R, B, s[R], -1, s[P]), s[R] = this._legalize(C + 2), n[P] = P, E--, P = B;
      if (N === O)
        for (; B = e[N], ct(Y, I, t[2 * B], t[2 * B + 1], t[2 * N], t[2 * N + 1]) < 0; )
          C = this._addTriangle(B, R, N, -1, s[N], s[B]), this._legalize(C + 2), s[B] = C, n[N] = N, E--, N = B;
      this._hullStart = e[R] = N, n[N] = e[P] = R, n[R] = P, o[this._hashKey(Y, I)] = R, o[this._hashKey(t[2 * N], t[2 * N + 1])] = N;
    }
    this.hull = new Uint32Array(E);
    for (let y = 0, A = this._hullStart; y < E; y++)
      this.hull[y] = A, A = n[A];
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
    return Math.floor(Rr(t - this._cx, e - this._cy) * this._hashSize) % this._hashSize;
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
        t = Ee[--o];
        continue;
      }
      const f = a - a % 3, l = c + (t + 1) % 3, h = f + (a + 2) % 3, u = e[i], g = e[t], v = e[l], d = e[h];
      if (Pr(
        s[2 * u],
        s[2 * u + 1],
        s[2 * g],
        s[2 * g + 1],
        s[2 * v],
        s[2 * v + 1],
        s[2 * d],
        s[2 * d + 1]
      )) {
        e[t] = d, e[a] = u;
        const M = n[h];
        if (M === -1) {
          let x = this._hullStart;
          do {
            if (this._hullTri[x] === h) {
              this._hullTri[x] = t;
              break;
            }
            x = this._hullPrev[x];
          } while (x !== this._hullStart);
        }
        this._link(t, M), this._link(a, n[i]), this._link(i, h);
        const b = f + (a + 1) % 3;
        o < Ee.length && (Ee[o++] = b);
      } else {
        if (o === 0) break;
        t = Ee[--o];
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
function Rr(r, t) {
  const e = r / (Math.abs(r) + Math.abs(t));
  return (t > 0 ? 3 - e : 1 + e) / 4;
}
function cn(r, t, e, n) {
  const s = r - e, o = t - n;
  return s * s + o * o;
}
function Pr(r, t, e, n, s, o, i, a) {
  const c = r - i, f = t - a, l = e - i, h = n - a, u = s - i, g = o - a, v = c * c + f * f, d = l * l + h * h, k = u * u + g * g;
  return c * (h * k - d * g) - f * (l * k - d * u) + v * (l * g - h * u) < 0;
}
function Dr(r, t, e, n, s, o) {
  const i = e - r, a = n - t, c = s - r, f = o - t, l = i * i + a * a, h = c * c + f * f, u = 0.5 / (i * f - a * c), g = (f * l - a * h) * u, v = (i * h - c * l) * u;
  return g * g + v * v;
}
function Cr(r, t, e, n, s, o) {
  const i = e - r, a = n - t, c = s - r, f = o - t, l = i * i + a * a, h = c * c + f * f, u = 0.5 / (i * f - a * c), g = r + (f * l - a * h) * u, v = t + (i * h - c * l) * u;
  return { x: g, y: v };
}
function se(r, t, e, n) {
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
    ce(r, s, o), t[r[e]] > t[r[n]] && ce(r, e, n), t[r[o]] > t[r[n]] && ce(r, o, n), t[r[e]] > t[r[o]] && ce(r, e, o);
    const a = r[o], c = t[a];
    for (; ; ) {
      do
        o++;
      while (t[r[o]] < c);
      do
        i--;
      while (t[r[i]] > c);
      if (i < o) break;
      ce(r, o, i);
    }
    r[e + 1] = r[i], r[i] = a, n - o + 1 >= i - e ? (se(r, t, o, n), se(r, t, e, i - 1)) : (se(r, t, e, i - 1), se(r, t, o, n));
  }
}
function ce(r, t, e) {
  const n = r[t];
  r[t] = r[e], r[e] = n;
}
function Vr(r) {
  return r[0];
}
function $r(r) {
  return r[1];
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
class zn extends Lr {
  constructor(t) {
    super(8, new Uint8Array(Math.ceil(t / 8)).fill(0));
  }
}
function Ft(r) {
  return r % 3 === 2 ? r - 2 : r + 1;
}
function At(r) {
  return r % 3 === 0 ? r + 2 : r - 1;
}
function Be(r, t, e, n, s, o, i, a) {
  const c = ct(r, t, s, o, i, a), f = ct(e, n, s, o, i, a);
  if (c > 0 && f > 0 || c < 0 && f < 0)
    return !1;
  const l = ct(s, o, r, t, e, n), h = ct(i, a, r, t, e, n);
  return l > 0 && h > 0 || l < 0 && h < 0 ? !1 : c === 0 && f === 0 && l === 0 && h === 0 ? !(Math.max(s, i) < Math.min(r, e) || Math.max(r, e) < Math.min(s, i) || Math.max(o, a) < Math.min(t, n) || Math.max(t, n) < Math.min(o, a)) : !0;
}
class Xr {
  /**
   * The triangulation object from Delaunator.
   */
  del;
  constructor(t) {
    this.del = t;
  }
}
class Jt extends Xr {
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
    const n = 2 ** 32 - 1, s = t.coords.length >> 1, o = t.triangles.length;
    this.vertMap = new Uint32Array(s).fill(n), this.flips = new zn(o), this.consd = new zn(o);
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
      consd: this.consd.copyBits(),
      cleaned: this.cleaned
    };
  }
  /** {@link snapshot} で控えた状態を、新しい配列に複製して復元する（控えは何度でも使える）。 */
  static restore(t) {
    const e = new Jt({
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
    const { triangles: n, halfedges: s } = this.del;
    this.assertVertex(t, t, e), this.assertVertex(e, t, e), this.assertInTriangulation(t, t, e), this.assertInTriangulation(e, t, e);
    const o = this.vertMap[t], i = this.maxConstrainSteps();
    let a = 0, c = o;
    do {
      if (++a > i)
        throw new Error(
          `Constraining edge [${t}, ${e}] exceeded the iteration limit`
        );
      const h = n[c], u = Ft(c);
      if (h === e)
        return this.protect(c);
      const g = At(c), v = n[g];
      if (v === e)
        return this.protect(u), u;
      if (this.intersectSegments(t, e, v, h)) {
        c = g;
        break;
      }
      c = s[u];
    } while (c !== -1 && c !== o);
    let f = c, l = -1;
    for (; c !== -1; ) {
      if (++a > i)
        throw new Error(
          `Constraining edge [${t}, ${e}] exceeded the iteration limit`
        );
      const h = s[c], u = At(c), g = At(h), v = Ft(h);
      if (h === -1)
        throw new Error("Constraining edge exited the hull");
      if (this.consd.has(c))
        throw new Error("Edge intersects already constrained edge");
      if (this.isCollinear(t, e, n[c]) || this.isCollinear(t, e, n[h]))
        throw new Error("Constraining edge intersects point");
      if (!this.intersectSegments(
        n[c],
        n[h],
        n[u],
        n[g]
      )) {
        if (l === -1 && (l = c), n[g] === e) {
          if (c === l)
            throw new Error("Infinite loop: non-convex quadrilateral");
          c = l, l = -1;
          continue;
        }
        if (this.intersectSegments(
          t,
          e,
          n[g],
          n[h]
        ))
          c = g;
        else if (this.intersectSegments(
          t,
          e,
          n[v],
          n[g]
        ))
          c = v;
        else if (l === c)
          throw new Error("Infinite loop: no further intersect after non-convex");
        continue;
      }
      if (this.flipDiagonal(c), this.intersectSegments(
        t,
        e,
        n[u],
        n[g]
      ) && (l === -1 && (l = u), l === u))
        throw new Error("Infinite loop: flipped diagonal still intersects");
      n[g] === e ? (f = g, c = l, l = -1) : this.intersectSegments(
        t,
        e,
        n[v],
        n[g]
      ) && (c = v);
    }
    return this.protect(f), this.delaunify(!0), this.findEdge(t, e);
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
   *
   * 最初の 1 回（`deep` で、まだ掃除が済んでいないとき）だけは、制約でない全部の辺を調べる。
   * Delaunator の外接円の判定は浮動小数点なので、厳密な述語での掃除を 1 回は通すため。
   * その後は、反転で触った辺（`flips` の印がある辺）だけを調べる。掃除の後に Delaunay でなくなりうるのは、
   * 反転で触った辺とその周りだけで、{@link flipDiagonal} はそこに印を付けるから、結果は変わらない。
   */
  delaunify(t = !1) {
    const { halfedges: e } = this.del, n = this.flips, s = this.consd, o = e.length;
    let i, a = !(t && this.cleaned);
    do {
      i = 0;
      for (let c = 0; c < o; c++) {
        if (s.has(c) || !a && !n.has(c))
          continue;
        n.delete(c);
        const f = e[c];
        f !== -1 && (n.delete(f), this.isDelaunay(c) || (this.flipDiagonal(c), i++));
      }
      a = !1;
    } while (t && i > 0);
    return t && (this.cleaned = !0), this;
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
    const { triangles: n, halfedges: s } = this.del, o = n.length / 3, i = (v, d, k) => {
      const M = t(d), b = t(k);
      return t(v).some((x) => M.includes(x) && b.includes(x));
    }, a = (v) => i(n[v * 3], n[v * 3 + 1], n[v * 3 + 2]), c = (v, d, k, M) => Math.sign(ct(v[d * 2], v[d * 2 + 1], v[k * 2], v[k * 2 + 1], v[M * 2], v[M * 2 + 1])), f = e.map((v) => {
      let d = 0;
      for (let k = 0; k < o; k++) d += c(v, n[k * 3], n[k * 3 + 1], n[k * 3 + 2]);
      return d < 0 ? -1 : 1;
    }), l = (v) => {
      if (this.consd.has(v)) return !1;
      const d = s[v];
      if (d === -1) return !1;
      const k = n[v], M = n[Ft(v)], b = n[At(v)], x = n[At(d)];
      return e.every((p, m) => c(p, b, k, x) === f[m] && c(p, x, M, b) === f[m]);
    };
    let h = 0, u = !0;
    for (; u; ) {
      u = !1;
      for (let v = 0; v < o; v++)
        if (a(v))
          for (let d = 0; d < 3; d++) {
            const k = v * 3 + d;
            if (!l(k)) continue;
            const M = s[k], b = n[k], x = n[Ft(k)], p = n[At(k)], m = n[At(M)];
            if (!(i(p, b, m) && i(m, x, p))) {
              this.protect(this.flipDiagonal(k)), h++, u = !0;
              break;
            }
          }
    }
    let g = 0;
    for (let v = 0; v < o; v++) a(v) && g++;
    return { flips: h, remaining: g };
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
      a = Ft(i), i = o[a];
    } while (i !== -1 && i !== n);
    return s[Ft(a)] === t ? -a : 1 / 0;
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
    const { triangles: e, halfedges: n } = this.del, s = this.flips, o = this.consd, i = n[t], a = At(t), c = Ft(t), f = At(i), l = Ft(i), h = n[a], u = n[f];
    if (o.has(t))
      throw new Error("Trying to flip a constrained edge");
    return e[t] = e[f], n[t] = u, s.set(t, s.has(f)) || o.set(t, o.has(f)), u !== -1 && (n[u] = t), n[a] = f, e[i] = e[a], n[i] = h, s.set(i, s.has(a)) || o.set(i, o.has(a)), h !== -1 && (n[h] = i), n[f] = a, this.markFlip(t), this.markFlip(c), this.markFlip(i), this.markFlip(l), s.add(a), o.delete(a), s.add(f), o.delete(f), this.updateVert(t), this.updateVert(c), this.updateVert(i), this.updateVert(l), a;
  }
  /**
   * Whether point p1, p2, and p are collinear.
   */
  isCollinear(t, e, n) {
    const s = this.del.coords;
    return ct(
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
    return Le(
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
    const o = e[At(t)], i = e[t], a = e[Ft(t)], c = e[At(s)];
    return !this.inCircle(o, i, a, c);
  }
  /**
   * Update the vertex -> incoming edge map.
   */
  updateVert(t) {
    const { triangles: e, halfedges: n } = this.del, s = this.vertMap, o = e[t];
    let i = At(t), a = n[i];
    for (; a !== -1 && a !== t; )
      i = At(a), a = n[i];
    return s[o] = i, i;
  }
  /**
   * Whether the segments between vertices intersect.
   */
  intersectSegments(t, e, n, s) {
    const o = this.del.coords;
    return t === n || t === s || e === n || e === s ? !1 : Be(
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
  static intersectSegments = Be;
}
function _e(r, t, e) {
  return hn(r, t, e).tin;
}
function hn(r, t, e, n, s) {
  if (t || (t = []), typeof r != "object" || r.type !== "FeatureCollection")
    throw "Argument points must be FeatureCollection";
  if (!Array.isArray(t)) throw "Argument points must be Array of Array";
  const o = r.features.map(
    (d) => d.geometry.coordinates
  );
  let i = s?.snapshot ? Jt.restore(s.snapshot) : void 0;
  const a = i ? void 0 : Xe.from(o);
  let c = i ? i.del : a, f = 0, l;
  const h = [];
  if (c.triangles.length !== 0 && (t.length !== 0 || n)) {
    if (!i) {
      i = new Jt(c);
      try {
        i.constrainAll(t);
      } catch (M) {
        if (!n?.allowUnusableBoundary) throw M;
        return { tin: bt([]), remaining: 0, hasBoundary: !1, hull: [] };
      }
      s && (s.snapshot = i.snapshot());
    }
    const d = n ? s?.snapshot ?? i.snapshot() : void 0, k = (M) => {
      const b = Jt.restore(d);
      return b.constrainAll(M), b;
    };
    for (const M of n?.hull ?? [])
      try {
        i.constrainOne(M[0], M[1]), h.push(M);
      } catch {
        i = k(h);
      }
    n?.boundary && (l = zr(i, n.boundary), l || (i = k(h))), n && ({ remaining: f } = i.forbidGroupTriangles(
      n.groupsOf,
      n.planes
    ), f -= l?.size ?? 0), c = i.del;
  }
  const u = [];
  for (let d = 0; d < c.triangles.length; d += 3)
    l?.has(d / 3) || u.push([c.triangles[d], c.triangles[d + 1], c.triangles[d + 2]]);
  const g = ["a", "b", "c"];
  return { tin: bt(
    u.map((d) => {
      const k = {}, M = d.map((b, x) => {
        const p = r.features[b], m = p.geometry.coordinates, w = [m[0], m[1]];
        return m.length === 3 ? w[2] = m[2] : k[g[x]] = p.properties[e], w;
      });
      return M[3] = M[0], me([M], k);
    })
  ), remaining: f, hasBoundary: l !== void 0, hull: h };
}
function zr(r, t) {
  try {
    r.constrainAll(t);
  } catch {
    return;
  }
  const e = new Map(t), { triangles: n, halfedges: s } = r.del, o = (f) => {
    const l = n[f], h = n[Ft(f)];
    return e.get(l) === h || e.get(h) === l;
  }, i = /* @__PURE__ */ new Set(), a = [], c = (f) => {
    const l = Math.floor(f / 3);
    i.has(l) || (i.add(l), a.push(l));
  };
  for (let f = 0; f < s.length; f++)
    s[f] === -1 && !o(f) && c(f);
  for (let f = 0; f < a.length; f++)
    for (let l = a[f] * 3; l < a[f] * 3 + 3; l++) {
      if (!e.has(n[l])) return;
      s[l] !== -1 && !o(l) && c(s[l]);
    }
  return i;
}
function te(r) {
  const t = /* @__PURE__ */ new Set(), e = [];
  if (r.forEach(([c, f], l) => {
    const h = `${c}:${f}`;
    t.has(h) || (t.add(h), e.push({ i: l, x: c, y: f }));
  }), e.length < 3) return [];
  const n = (c, f, l) => ct(c.x, c.y, f.x, f.y, l.x, l.y), s = [...e].sort((c, f) => c.x - f.x || c.y - f.y), o = (c) => {
    const f = [];
    for (const l of c) {
      for (; f.length >= 2 && n(f[f.length - 2], f[f.length - 1], l) <= 0; ) f.pop();
      f.push(l);
    }
    return f.pop(), f;
  }, i = [...o(s), ...o([...s].reverse())];
  if (i.length < 3) return [];
  const a = [];
  for (let c = 0; c < i.length; c++) {
    const f = i[c], l = i[(c + 1) % i.length], h = l.x - f.x, u = l.y - f.y, g = h * h + u * u, v = e.filter((k) => k !== f && k !== l && n(f, l, k) === 0).map((k) => ({ r: k, t: ((k.x - f.x) * h + (k.y - f.y) * u) / g })).filter(({ t: k }) => k > 0 && k < 1).sort((k, M) => k.t - M.t).map(({ r: k }) => k), d = [f, ...v, l];
    for (let k = 0; k + 1 < d.length; k++) a.push([d[k].i, d[k + 1].i]);
  }
  return a;
}
function le([r, t]) {
  return r < t ? `${r}-${t}` : `${t}-${r}`;
}
function Dt(r, t, e) {
  return Zt(r, { target: { geom: t, index: e } });
}
function Ht(r) {
  return Zt(r.properties.target.geom, {
    target: {
      geom: r.geometry.coordinates,
      index: r.properties.target.index
    }
  });
}
function Yn(r, t) {
  const e = r.length, n = t.geometry.coordinates;
  return Array.from({ length: e }, (s, o) => o).map((s) => {
    const o = (s + 1) % e, i = r[s], a = r[o], c = i.geometry.coordinates, f = Math.atan2(
      c[0] - n[0],
      c[1] - n[1]
    ), l = [t, i, a, t].map(
      (g) => g.geometry.coordinates
    ), h = {
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
    }, u = bt([
      me([l], h)
    ]);
    return [f, u];
  }).reduce(
    (s, o) => (s[0].push(o[0]), s[1].push(o[1]), s),
    [[], []]
  );
}
const mn = [0.1, 0.15, 0.225, 0.34, 0.5];
function Yr(r, t) {
  return t ? r.hasBoundary !== t.hasBoundary ? r.hasBoundary : r.diagnostics.boundaryTriangleFlips < t.diagnostics.boundaryTriangleFlips : !0;
}
function qn(r, t, e) {
  return Math.sign(ct(r[0], r[1], t[0], t[1], e[0], e[1]));
}
function Re(r, t = -1) {
  let e = 0;
  for (const n of r.features) {
    const { a: s, b: o, c: i } = n.properties;
    if (![s, o, i].some(
      ({ index: h }) => typeof h == "string" && h.startsWith("b")
    ))
      continue;
    const [a, c, f] = n.geometry.coordinates[0];
    qn(a, c, f) * qn(s.geom, o.geom, i.geom) * t <= 0 && e++;
  }
  return e;
}
function oe(r, t, e) {
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
function Un(r, t, e, n, s, o = /* @__PURE__ */ new Set(), i) {
  const { minx: a, maxx: c, miny: f, maxy: l, centroid: h } = r, u = c - a, g = l - f, v = e.forw.length, d = Array.from({ length: v }, () => []);
  let k = 1;
  for (const [S, E] of e.edges)
    S < n && d[S].push(k), d[E].push(k), E < n && k++;
  const M = (S) => S.slice(0, v).map(({ geometry: E }) => E.coordinates), b = te(M(e.forw)), x = {
    forw: b.filter((S) => !o.has(le(S))),
    bakw: te(M(e.bakw))
  }, p = [0], m = (S) => S >= v ? p : d[S];
  let w;
  for (const S of mn) {
    const E = i?.get(S) ?? { forwReuse: {} };
    i?.set(S, E);
    const y = E.vertices ?? (E.vertices = t(
      {
        ...r,
        minx: a - S * u,
        maxx: c + S * u,
        miny: f - S * g,
        maxy: l + S * g
      },
      !0
    ));
    if (s && (y.length < 4 || !y.every(({ bakw: X }) => X.every(Number.isFinite)))) continue;
    const A = y.map(
      ({ forw: X, bakw: U }, q) => Dt(X, U, `b${q}`)
    ), F = bt([...e.forw, ...A]), R = bt([
      ...e.bakw,
      ...A.map(Ht)
    ]), Y = [F, R].map(
      ({ features: X }) => Float64Array.from(
        X.flatMap(
          ({
            geometry: {
              coordinates: [U, q]
            }
          }) => [U, q]
        )
      )
    ), O = s !== void 0 || oe(
      y.map((X) => X.forw),
      h.forw,
      -1
    ) && oe(
      y.map((X) => X.bakw),
      h.bakw,
      1
    ) ? y.map((X, U) => [
      v + U,
      v + (U + 1) % y.length
    ]) : void 0, N = { groupsOf: m, planes: Y, boundary: O, allowUnusableBoundary: s !== void 0 }, B = s?.orientation ?? -1, C = hn(
      F,
      e.edges,
      "target",
      { ...N, hull: x.forw },
      E.forwReuse
    ), P = E.geographic ?? (E.geographic = (() => {
      const X = hn(R, e.edges, "target", {
        ...N,
        hull: x.bakw
      });
      return { built: X, flips: Re(X.tin, B) };
    })()), _ = P.built, T = C.tin, $ = {
      ..._.tin,
      features: [..._.tin.features]
    }, V = Re(T, B) + P.flips, z = {
      vertices: y,
      forw: T,
      bakw: $,
      diagnostics: {
        margin: S,
        boundaryTriangleFlips: V,
        remainingForbiddenTriangles: C.remaining + _.remaining
      },
      hasMapBoundary: C.hasBoundary,
      hasBoundary: C.hasBoundary && _.hasBoundary,
      forwHull: { all: b, applied: C.hull }
    };
    if (s) {
      if (s.accept(z)) return z;
      continue;
    }
    if (V === 0 && z.hasBoundary)
      return z;
    Yr(z, w) && (w = z);
  }
  return w;
}
const jn = 1e-9;
function qr(r, t) {
  const e = [[], [], [], []], n = [];
  return Object.keys(r).forEach((s) => {
    const o = r[s], i = o.forw, a = o.bakw, c = [
      i[0] - t.forw[0],
      i[1] - t.forw[1]
    ], f = [
      a[0] - t.bakw[0],
      t.bakw[1] - a[1]
    ], l = { forw: c, bakw: f };
    if (n.push(l), c[0] === 0 || c[1] === 0)
      return;
    let h = 0;
    c[0] > 0 && (h += 1), c[1] > 0 && (h += 2), e[h].push(l);
  }), { perQuad: e, aggregate: n };
}
function Ns(r) {
  let t = 1 / 0, e = 0, n = 0;
  return r.forEach((s) => {
    const { forw: o, bakw: i } = s, a = Math.hypot(o[0], o[1]), c = Math.hypot(i[0], i[1]);
    if (c === 0) return;
    const f = a / c, l = Math.atan2(o[0], o[1]) - Math.atan2(i[0], i[1]);
    t = Math.min(t, f), e += Math.cos(l), n += Math.sin(l);
  }), isFinite(t) ? [t, Math.atan2(n, e)] : [1, 0];
}
const Ur = 0.6, jr = 3, Gr = 0.5;
function Wr(r) {
  let t = 0, e = 0, n = 0, s = 0;
  if (r.forEach(({ forw: i, bakw: a }) => {
    t += i[1] * a[1] + i[0] * a[0], e += i[0] * a[1] - i[1] * a[0], n += a[0] * a[0] + a[1] * a[1], s += i[0] * i[0] + i[1] * i[1];
  }), !(!(n > 0 && s > 0) || !(Math.hypot(t, e) / Math.sqrt(s * n) >= Gr)))
    return [Math.hypot(t, e) / n, Math.atan2(e, t)];
}
function Kr(r) {
  const t = (s) => Math.hypot(s.forw[0], s.forw[1]), e = Math.max(...r.map(t)), n = r.filter((s) => t(s) >= Ur * e);
  return Wr(n.length >= jr ? n : r) ?? Ns(r);
}
function Hr(r, t, e, n) {
  const { perQuad: s, aggregate: o } = qr(r, t), i = s.every((l) => l.length > 0), a = e === "birdeye" ? i ? s : [o] : [o], c = n === "farLsq" ? Kr : Ns, f = a.map((l) => c(l));
  return f.length === 1 ? [f[0], f[0], f[0], f[0]] : f;
}
function Jr(r, t) {
  let e = 0;
  return r[0] > t[0] && (e += 1), r[1] > t[1] && (e += 2), e;
}
function Qr(r, t, e) {
  const n = [
    r[0] - t.forw[0],
    r[1] - t.forw[1]
  ], o = Math.sqrt(n[0] ** 2 + n[1] ** 2) / e[0], i = Math.atan2(n[0], n[1]) - e[1];
  return [
    t.bakw[0] + o * Math.sin(i),
    t.bakw[1] - o * Math.cos(i)
  ];
}
function Zr(r, t, e, n) {
  const s = t[0] - r[0], o = t[1] - r[1];
  if (Math.abs(s) < 1e-12 && Math.abs(o) < 1e-12) return null;
  const i = n[0] - e[0], a = n[1] - e[1], c = e[0] - r[0], f = e[1] - r[1], l = s * a - o * i;
  if (Math.abs(l) < 1e-12) return null;
  const h = (c * a - f * i) / l, u = (c * o - f * s) / l;
  return h <= 1e-10 || u < -1e-10 || u > 1 + 1e-10 ? null : { t: h, point: [r[0] + h * s, r[1] + h * o] };
}
function ti(r, t, e) {
  const n = e.length;
  let s = -1 / 0, o = null;
  for (let i = 0; i < n; i++) {
    const a = (i + 1) % n, c = Zr(
      r,
      t,
      e[i].bakw,
      e[a].bakw
    );
    c && c.t > s && (s = c.t, o = c.point);
  }
  return o;
}
function Pe(r, t) {
  return Math.floor(un(r, t) / 10) % 36;
}
function un(r, t) {
  const n = Math.atan2(r[0] - t[0], r[1] - t[1]) * (180 / Math.PI);
  return n < 0 ? n + 360 : n;
}
function Gn(r, t, e, n, s, o) {
  const i = t[0] - r[0], a = t[1] - r[1];
  if (i === 0 && a === 0) return null;
  const c = [];
  if (i !== 0)
    for (const l of [e, n]) {
      const h = (l - r[0]) / i;
      if (h > 0) {
        const u = r[1] + h * a;
        u >= s && u <= o && c.push({ t: h, x: l, y: u });
      }
    }
  if (a !== 0)
    for (const l of [s, o]) {
      const h = (l - r[1]) / a;
      if (h > 0) {
        const u = r[0] + h * i;
        u >= e && u <= n && c.push({ t: h, x: u, y: l });
      }
    }
  if (c.length === 0) return null;
  c.sort((l, h) => l.t - h.t);
  const f = c[0];
  return [f.x, f.y];
}
function ei(r, t, e, n) {
  const s = r[0], o = r[1], i = t[0], a = t[1], c = e[0], f = e[1], l = n[0], h = n[1];
  if (!(Number.isFinite(s) && Number.isFinite(o) && Number.isFinite(i) && Number.isFinite(a) && Number.isFinite(c) && Number.isFinite(f) && Number.isFinite(l) && Number.isFinite(h)) || s === c || s === l || i === c || i === l || s === i && o === a || c === l && f === h) {
    const T = br(Sn([r, t]), Sn([e, n]));
    return T.features.length > 0 && T.features[0].geometry ? T.features[0].geometry.coordinates : null;
  }
  const u = s > i || s === i && o > a, g = u ? i : s, v = u ? a : o, d = u ? s : i, k = u ? o : a, M = c > l || c === l && f > h, b = M ? l : c, x = M ? h : f, p = M ? c : l, m = M ? f : h;
  let w, S, E, y, A, F, R, Y;
  if (g < b) {
    if (d < b) return null;
    w = b, S = x, E = p, y = m, A = g, F = v, R = d, Y = k;
  } else {
    if (p < g) return null;
    w = g, S = v, E = d, y = k, A = b, F = x, R = p, Y = m;
  }
  const I = ct(w, S, E, y, A, F), O = ct(w, S, E, y, R, Y);
  if (I > 0 && O > 0 || I < 0 && O < 0) return null;
  const N = (Y - F) * (E - w) - (R - A) * (y - S), B = (R - A) * (S - F) - (Y - F) * (w - A), C = (E - w) * (S - F) - (y - S) * (w - A);
  if (N === 0) return null;
  const P = B / N, _ = C / N;
  return P >= 0 && P <= 1 && _ >= 0 && _ <= 1 ? [w + P * (E - w), S + P * (y - S)] : null;
}
function Wn(r, t, e) {
  const n = r.length, s = new Array(n).fill(1);
  for (const o of t)
    for (let i = 0; i < n; i++) {
      const a = (i + 1) % n, c = ei(
        r[i].bakw,
        r[a].bakw,
        e.bakw,
        o.bakw
      );
      if (c) {
        const f = Math.sqrt(
          Math.pow(o.bakw[0] - e.bakw[0], 2) + Math.pow(o.bakw[1] - e.bakw[1], 2)
        ), l = Math.sqrt(
          Math.pow(c[0] - e.bakw[0], 2) + Math.pow(c[1] - e.bakw[1], 2)
        ), h = f / l;
        h > s[i] && (s[i] = h), h > s[a] && (s[a] = h);
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
function wn(r, t, e, n, s) {
  const { convexBuf: o, centroid: i, allGcps: a, minx: c, maxx: f, miny: l, maxy: h } = r, u = s ? void 0 : Hr(o, i, t, n), v = [
    [c, l],
    [f, l],
    [f, h],
    [c, h]
  ].map((E) => ({
    forw: E,
    bakw: s ? s(E) : Qr(
      E,
      i,
      u[Jr(E, i.forw)]
    )
  }));
  if (v.sort(
    (E, y) => Math.atan2(E.forw[0] - i.forw[0], E.forw[1] - i.forw[1]) - Math.atan2(y.forw[0] - i.forw[0], y.forw[1] - i.forw[1])
  ), s || Wn(v, a, i), !e || r.ring?.cornersOnly) return v;
  const d = 4, k = v.map(
    (E) => Math.atan2(E.forw[0] - i.forw[0], E.forw[1] - i.forw[1])
  ), M = v.map(
    (E) => Math.atan2(
      E.bakw[0] - i.bakw[0],
      -(E.bakw[1] - i.bakw[1])
    )
  );
  function b(E) {
    for (let y = 0; y < d; y++) {
      const A = (y + 1) % d, F = k[y], R = y < d - 1 ? k[A] : k[A] + 2 * Math.PI;
      let Y = E;
      for (; Y < F; ) Y += 2 * Math.PI;
      for (; Y >= F + 2 * Math.PI; ) Y -= 2 * Math.PI;
      if (Y >= F && Y < R)
        return { i: y, j: A, frac: (Y - F) / (R - F) };
    }
    return { i: 0, j: 1, frac: 0 };
  }
  function x(E) {
    const { i: y, j: A, frac: F } = b(E), R = M[y];
    let I = M[A] - R;
    for (; I > Math.PI; ) I -= 2 * Math.PI;
    for (; I < -Math.PI; ) I += 2 * Math.PI;
    return R + F * I;
  }
  const p = new Set(
    v.map(
      (E) => Math.floor(un(E.forw, i.forw) / 10) % 36
    )
  ), m = a.map((E) => ({
    forw: E.forw,
    bakw: E.bakw,
    angleDeg: un(E.forw, i.forw),
    forwDist: Math.hypot(E.forw[0] - i.forw[0], E.forw[1] - i.forw[1])
  })), w = [];
  for (let E = 0; E < 36; E++) {
    if (p.has(E) || r.ring?.skipBins?.has(E)) continue;
    const y = E * 10, A = m.filter((_) => {
      if (_.forwDist === 0) return !1;
      const T = ((_.angleDeg - y) % 360 + 360) % 360;
      return T < 10 + jn || T > 360 - jn;
    });
    let F = null;
    if (A.length > 0) {
      const _ = A.reduce((T, $) => $.forwDist > T.forwDist ? $ : T);
      F = Gn(i.forw, _.forw, c, f, l, h);
    }
    if (!F) {
      const _ = (y + 5) % 360 * (Math.PI / 180), T = [
        i.forw[0] + Math.sin(_),
        i.forw[1] + Math.cos(_)
      ];
      F = Gn(i.forw, T, c, f, l, h);
    }
    if (!F) continue;
    const [R, Y] = F, I = 1e-9 * Math.max(f - c, h - l);
    if ([...v, ...w].some(
      (_) => Math.abs(_.forw[0] - R) <= I && Math.abs(_.forw[1] - Y) <= I
    )) continue;
    if (s) {
      w.push({ forw: F, bakw: s(F) });
      continue;
    }
    const O = [F[0] - i.forw[0], F[1] - i.forw[1]], N = Math.atan2(O[0], O[1]), B = x(N), C = [
      i.bakw[0] + Math.sin(B),
      i.bakw[1] - Math.cos(B)
    ], P = ti(i.bakw, C, v);
    P && w.push({ forw: F, bakw: P });
  }
  const S = [...v, ...w];
  return S.sort(
    (E, y) => Math.atan2(E.forw[0] - i.forw[0], E.forw[1] - i.forw[1]) - Math.atan2(y.forw[0] - i.forw[0], y.forw[1] - i.forw[1])
  ), s || Wn(S, a, i), S;
}
function Fs(r, t = !1) {
  return wn(r, "plain", t, t ? "farLsq" : "min");
}
function Os(r, t = !1) {
  return wn(r, "birdeye", t, "min");
}
function Ts(r, t) {
  const e = /* @__PURE__ */ new Set();
  return wn(r, "plain", !0, "min", t).filter(({ forw: [n, s] }) => {
    const o = `${n}:${s}`;
    return e.has(o) ? !1 : (e.add(o), !0);
  });
}
const Kn = (r) => typeof r == "string" && r.startsWith("b");
function ni(r, t) {
  const e = (n, s) => {
    for (let o = 0; o < 3; o++) {
      const i = n.g[o], a = n.g[(o + 1) % 3];
      if (s.g.every((c) => n.sign * ct(i[0], i[1], a[0], a[1], c[0], c[1]) <= 0)) return !0;
    }
    return !1;
  };
  return !e(r, t) && !e(t, r);
}
function si(r) {
  const t = r.features.map((a) => {
    const { a: c, b: f, c: l } = a.properties, h = [c.geom, f.geom, l.geom], u = a.geometry.coordinates[0].slice(0, 3), g = h.map(([M]) => M), v = h.map(([, M]) => M), d = Math.sign(ct(u[0][0], u[0][1], u[1][0], u[1][1], u[2][0], u[2][1])), k = Math.sign(ct(h[0][0], h[0][1], h[1][0], h[1][1], h[2][0], h[2][1]));
    return {
      ids: [c.index, f.index, l.index],
      f: u,
      g: h,
      sign: k,
      ratio: d * k,
      aux: [c.index, f.index, l.index].some(Kn),
      minx: Math.min(...g),
      maxx: Math.max(...g),
      miny: Math.min(...v),
      maxy: Math.max(...v)
    };
  }), e = t.map((a) => a.ratio), n = e.reduce((a, c) => a + c, 0) < 0 ? -1 : 1, s = /* @__PURE__ */ new Set();
  t.forEach((a, c) => {
    a.aux && (e[c] === 0 || e[c] !== n) && s.add(c);
  });
  const o = t.map((a, c) => c).sort((a, c) => t[a].minx - t[c].minx);
  for (let a = 0; a < o.length; a++) {
    const c = t[o[a]];
    if (c.sign !== 0)
      for (let f = a + 1; f < o.length; f++) {
        const l = t[o[f]];
        if (l.minx >= c.maxx) break;
        l.sign === 0 || l.miny >= c.maxy || c.miny >= l.maxy || !c.aux && !l.aux || ni(c, l) && (s.add(o[a]), s.add(o[f]));
      }
  }
  const i = /* @__PURE__ */ new Map();
  for (const a of s)
    t[a].ids.forEach((c, f) => {
      Kn(c) && i.set(String(c), t[a].f[f]);
    });
  return [...i.values()];
}
function So(r) {
  return Te(r, 1 / 0);
}
const Hn = 1e5, ri = 16;
function Te(r, t) {
  return ii(r), new oi(r).findSegmentIntersections(t).map(
    (s) => Zt([s.x, s.y])
  );
}
function ii(r) {
  for (let t = 0, e = r.length; t < e; t++) {
    const n = r[t];
    ge(n) || Qt(
      "findIntersections() received invalid coordinates:",
      `line=${t}`,
      `points=${n}`
    );
    for (let s = 0, o = n.length; s < o; s++) {
      const i = n[s];
      (!ge(i) || !Number.isFinite(i[0]) || !Number.isFinite(i[1])) && Qt(
        "findIntersections() received non-finite coordinates:",
        `line=${t}`,
        `point=${s}`,
        `coordinates=${JSON.stringify(i)}`
      );
    }
  }
}
class oi {
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
    (o != this._xx.length || this._xx.length != this._yy.length) && Qt("ArcCollection#initXYData() Counting error"), this.initBounds(), this._arcIter = new _i(this._xx, this._yy);
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
    const s = n.length, o = new Float64Array(s * 4), i = new pe();
    let a = 0, c, f, l;
    for (let h = 0; h < s; h++)
      c = n[h], c > 0 && (f = h * 4, l = Ii(t, e, a, c), o[f++] = l[0], o[f++] = l[1], o[f++] = l[2], o[f] = l[3], a += c, i.mergeBounds(l));
    return {
      bb: o,
      bounds: i
    };
  }
  getBounds() {
    return this._allBounds ? this._allBounds.clone() : new pe();
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
    let c = n ? this._ii[s] : this._ii[s] + i - 1, f = c, l = 0;
    for (let h = 1; h < i; h++)
      f += a, (o === 0 || this._zz[f] >= o) && (e(c, f, this._xx, this._yy), c = f, l++);
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
    const e = this.getBounds(), n = e.ymin || 0, s = (e.ymax || 0) - n, o = this.calcSegmentIntersectionStripeCount(), i = new Uint32Array(o), a = o > 1 ? (x) => Math.floor((o - 1) * (x - n) / s) : () => 0, c = o + 1;
    let f;
    this.forEachSegment(
      (x, p, m, w) => {
        let S = a(w[x]);
        const E = a(w[p]);
        let y = 0;
        for (; i[S] = i[S] + 2, S != E; )
          y++, y > c && Qt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${o}`,
            `s1=${S}`,
            `s2=${E}`
          ), S += E > S ? 1 : -1;
      }
    );
    const l = this.getUint32Array(fi(i));
    let h = 0;
    const u = [];
    li(i, (x) => {
      const p = h;
      h += x, u.push(l.subarray(p, h));
    }), hi(i, 0), this.forEachSegment(
      (x, p, m, w) => {
        let S = a(w[x]);
        const E = a(w[p]);
        let y, A, F = 0;
        for (; y = i[S], i[S] = y + 2, A = u[S], A[y] = x, A[y + 1] = p, S != E; )
          F++, F > c && Qt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${o}`,
            `s1=${S}`,
            `s2=${E}`
          ), S += E > S ? 1 : -1;
      }
    );
    const g = this.getVertexData(), v = t * ri;
    let d = 0;
    const k = /* @__PURE__ */ new Set(), M = /* @__PURE__ */ new Map(), b = (x) => {
      d++;
      const p = Ei(x);
      return k.has(p) || (k.add(p), M.set(`${x.x}:${x.y}`, x)), M.size >= t || d >= v;
    };
    if (g.xx && g.yy)
      for (f = 0; f < o && !ui(u[f], g.xx, g.yy, b); f++)
        ;
    return Array.from(M.values());
  }
}
function Qt(...r) {
  const t = r.join(" ");
  throw new Error(t);
}
function ge(r) {
  return r ? ci(r) ? !0 : ai(r) ? !1 : r.length === 0 ? !0 : r.length > 0 : !1;
}
function ai(r) {
  return r != null && r.toString === String.prototype.toString;
}
function ci(r) {
  return Array.isArray(r);
}
function fi(r, t) {
  ge(r) || Qt("utils.sum() expects an array, received:", r);
  let e = 0, n;
  for (let s = 0, o = r.length; s < o; s++)
    n = r[s], n && (e += n);
  return e;
}
function li(r, t, e) {
  if (!ge(r))
    throw new Error(`#forEach() takes an array-like argument. ${r}`);
  for (let n = 0, s = r.length; n < s; n++)
    t.call(e, r[n], n);
}
function hi(r, t) {
  for (let e = 0, n = r.length; e < n; e++)
    r[e] = t;
  return r;
}
function ui(r, t, e, n) {
  const s = r.length - 2;
  let o, i, a, c, f, l, h, u, g, v, d, k, M, b, x, p, m;
  for (ki(t, r), p = 0; p < s; ) {
    for (o = r[p], i = r[p + 1], f = t[o], l = t[i], g = e[o], v = e[i], m = p; m < s && (m += 2, a = r[m], h = t[a], !(l < h)); ) {
      if (d = e[a], c = r[m + 1], u = t[c], k = e[c], g >= d) {
        if (g > k && v > d && v > k) continue;
      } else if (g < k && v < d && v < k) continue;
      if (!(o == a || o == c || i == a || i == c) && (M = di(
        f,
        g,
        l,
        v,
        h,
        d,
        u,
        k
      ), M && (b = [o, i], x = [a, c], n(Qn(M, b, x, t, e)) || M.length == 4 && n(Qn(M.slice(2), b, x, t, e)))))
        return !0;
    }
    p += 2;
  }
  return !1;
}
function di(r, t, e, n, s, o, i, a) {
  const c = gi(r, t, e, n, s, o, i, a);
  let f = null;
  return c && (f = pi(r, t, e, n, s, o, i, a), f ? xi(r, t, e, n, s, o, i, a) && (f = null) : f = yi(r, t, e, n, s, o, i, a)), f;
}
function gi(r, t, e, n, s, o, i, a) {
  return he(r, t, e, n, s, o) * he(r, t, e, n, i, a) <= 0 && he(s, o, i, a, r, t) * he(s, o, i, a, e, n) <= 0;
}
function he(r, t, e, n, s, o) {
  return Bs(r - s, t - o, e - s, n - o);
}
function Bs(r, t, e, n) {
  return r * n - t * e;
}
function pi(r, t, e, n, s, o, i, a) {
  let c = Ie(r, t, e, n, s, o, i, a), f;
  return c && (f = wi(c[0], c[1], r, t, e, n, s, o, i, a), f == 1 ? c = Ie(e, n, r, t, s, o, i, a) : f == 2 ? c = Ie(s, o, i, a, r, t, e, n) : f == 3 && (c = Ie(i, a, s, o, r, t, e, n))), c && bi(c, r, t, e, n, s, o, i, a), c;
}
function Ie(r, t, e, n, s, o, i, a) {
  const c = Bs(e - r, n - t, i - s, a - o), f = 1e-18;
  let l;
  if (c === 0) return null;
  const h = he(s, o, i, a, r, t) / c;
  return c <= f && c >= -f ? l = mi(r, t, e, n, s, o, i, a) : l = [r + h * (e - r), t + h * (n - t)], l;
}
function mi(r, t, e, n, s, o, i, a) {
  let c = null;
  return !Ct(r, s, i) && !Ct(t, o, a) ? c = [r, t] : !Ct(e, s, i) && !Ct(n, o, a) ? c = [e, n] : !Ct(s, r, e) && !Ct(o, t, n) ? c = [s, o] : !Ct(i, r, e) && !Ct(a, t, n) && (c = [i, a]), c;
}
function Ct(r, t, e) {
  let n;
  return t < e ? n = r < t || r > e : t > e ? n = r > t || r < e : n = r != t, n;
}
function wi(r, t, ...e) {
  let n = -1, s = 1 / 0, o;
  for (let i = 0, a = 0, c = e.length; a < c; i++, a += 2)
    o = vi(r, t, e[a], e[a + 1]), o < s && (s = o, n = i);
  return n;
}
function vi(r, t, e, n) {
  const s = r - e, o = t - n;
  return s * s + o * o;
}
function bi(r, t, e, n, s, o, i, a, c) {
  let f = r[0], l = r[1];
  f = Ae(f, t, n), f = Ae(f, o, a), l = Ae(l, e, s), l = Ae(l, i, c), r[0] = f, r[1] = l;
}
function Ae(r, t, e) {
  let n;
  return Ct(r, t, e) && (n = Math.abs(r - t) < Math.abs(r - e) ? t : e, r = n), r;
}
function yi(r, t, e, n, s, o, i, a) {
  const c = Math.min(r, e, s, i), f = Math.max(r, e, s, i), l = Math.min(t, n, o, a), h = Math.max(t, n, o, a), u = h - l > f - c;
  let g = [];
  return (u ? Ut(t, l, h) : Ut(r, c, f)) && g.push(r, t), (u ? Ut(n, l, h) : Ut(e, c, f)) && g.push(e, n), (u ? Ut(o, l, h) : Ut(s, c, f)) && g.push(s, o), (u ? Ut(a, l, h) : Ut(i, c, f)) && g.push(i, a), (g.length != 2 && g.length != 4 || g.length == 4 && g[0] == g[2] && g[1] == g[3]) && (g = null), g;
}
function xi(r, t, e, n, s, o, i, a) {
  return r == s && t == o || r == i && t == a || e == s && n == o || e == i && n == a;
}
function Ut(r, t, e) {
  return r > t && r < e;
}
function ki(r, t) {
  Si(r, t), Rs(r, t, 0, t.length - 2);
}
function Si(r, t) {
  for (let e = 0, n = t.length; e < n; e += 2)
    r[t[e]] > r[t[e + 1]] && Mi(t, e, e + 1);
}
function Mi(r, t, e) {
  const n = r[t];
  r[t] = r[e], r[e] = n;
}
function Rs(r, t, e, n) {
  let s = e, o = n, i, a;
  for (; s < n; ) {
    for (i = r[t[e + n >> 2 << 1]]; s <= o; ) {
      for (; r[t[s]] < i; ) s += 2;
      for (; r[t[o]] > i; ) o -= 2;
      s <= o && (a = t[s], t[s] = t[o], t[o] = a, a = t[s + 1], t[s + 1] = t[o + 1], t[o + 1] = a, s += 2, o -= 2);
    }
    if (o - e < 40 ? Jn(r, t, e, o) : Rs(r, t, e, o), n - s < 40) {
      Jn(r, t, s, n);
      return;
    }
    e = s, o = n;
  }
}
function Jn(r, t, e, n) {
  let s, o;
  for (let i = e + 2; i <= n; i += 2) {
    s = t[i], o = t[i + 1];
    let a;
    for (a = i - 2; a >= e && r[s] < r[t[a]]; a -= 2)
      t[a + 2] = t[a], t[a + 3] = t[a + 1];
    t[a + 2] = s, t[a + 3] = o;
  }
}
function Qn(r, t, e, n, s) {
  const o = r[0], i = r[1];
  t = Zn(o, i, t[0], t[1], n, s), e = Zn(o, i, e[0], e[1], n, s);
  const a = t[0] < e[0] ? t : e, c = a == t ? e : t;
  return { x: o, y: i, a, b: c };
}
function Zn(r, t, e, n, s, o) {
  let i = e < n ? e : n, a = i === e ? n : e;
  return s[i] == r && o[i] == t ? a = i : s[a] == r && o[a] == t && (i = a), [i, a];
}
function Ei(r) {
  return `${r.a.join(",")};${r.b.join(",")}`;
}
class _i {
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
function Ii(r, t, e, n) {
  let s = e | 0;
  const o = isNaN(n) ? r.length - s : n + s;
  let i, a, c, f, l, h;
  if (o > 0)
    c = l = r[s], f = h = t[s];
  else return [void 0, void 0, void 0, void 0];
  for (s++; s < o; s++)
    i = r[s], a = t[s], i < c && (c = i), i > l && (l = i), a < f && (f = a), a > h && (h = a);
  return [c, f, l, h];
}
class pe {
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
    return new pe(
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
      if (ge(t)) {
        const f = t;
        o = f[0], i = f[1], a = f[2], c = f[3];
      } else {
        const f = t;
        o = f.xmin, i = f.ymin, a = f.xmax, c = f.ymax;
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
    return t instanceof pe ? (n = t.xmin, s = t.ymin, o = t.xmax, i = t.ymax) : e.length == 3 ? (n = t, s = e[0], o = e[1], i = e[2]) : t.length == 4 ? (n = t[0], s = t[1], o = t[2], i = t[3]) : Qt("Bounds#mergeBounds() invalid argument:", t), this.xmin === void 0 ? this.setBounds(n, s, o, i) : (n < this.xmin && (this.xmin = n), s < this.ymin && (this.ymin = s), o > this.xmax && (this.xmax = o), i > this.ymax && (this.ymax = i)), this;
  }
}
function De(r) {
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
function Ps(r, t, e) {
  const n = De(t.forw), s = De(t.bakw);
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
function ts(r, t, e) {
  const n = De(t.forw), s = De(t.bakw);
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
function Ne(r, t = 1e-6) {
  const [e, n] = r[0], [s, o] = r[1], [i, a] = r[2];
  return Math.abs((s - e) * (a - n) - (i - e) * (o - n)) < t;
}
function Ai(r, t) {
  const e = /* @__PURE__ */ new Set();
  return r.forEach((n) => {
    if (n.length !== 2) return;
    const s = n.map((o) => `${t?.[o] ?? o}`);
    e.add(s.sort().join("-"));
  }), e;
}
function ue(r) {
  return ["a", "b", "c"].map((t, e) => ({
    prop: r.properties[t],
    geom: r.geometry.coordinates[0][e]
  }));
}
const Ni = 10;
function Fi(r, t, e, n, s, o) {
  if (!r && !t) return !1;
  const i = r ? 0 : 1, a = 1 - i, c = e[i], f = e[a];
  if (!c || !f) return !1;
  const l = It(f.geom);
  let h = !1, u = !1;
  for (let g = 0; g <= 1; g++) {
    const v = n[g];
    if (!v) continue;
    const d = [String(v.prop.index), String(c.prop.index)].sort().join("-"), k = s[d];
    if (!k || k.length < 2) continue;
    const M = k.find(
      (F) => F.bakw !== o[i].bakw
    );
    if (!M) continue;
    const x = ue(M.bakw).find(
      (F) => String(F.prop.index) !== String(v.prop.index) && String(F.prop.index) !== String(c.prop.index)
    );
    if (!x) continue;
    h = !0;
    const p = It(x.geom), m = It(v.geom), w = It(c.geom), S = w[0] - m[0], E = w[1] - m[1], y = S * (l[1] - m[1]) - E * (l[0] - m[0]), A = S * (p[1] - m[1]) - E * (p[0] - m[0]);
    if (y * A > 0) {
      u = !0;
      break;
    }
  }
  return h && !u;
}
function Oi(r, t, e, n) {
  if (!r && !t) return !1;
  if (e[0] && e[1] && n[0] && n[1]) {
    const s = n.map((l) => It(l.geom)), o = e.map((l) => It(l.geom)), i = s[1][0] - s[0][0], a = s[1][1] - s[0][1], c = i * (o[0][1] - s[0][1]) - a * (o[0][0] - s[0][0]), f = i * (o[1][1] - s[0][1]) - a * (o[1][0] - s[0][0]);
    return c * f < 0;
  }
  return !1;
}
function Ti(r, t, e, n) {
  const s = Ai(e, n), o = /* @__PURE__ */ new Set();
  let i = !1;
  for (let a = 0; a < Ni; a++) {
    let c = !1;
    for (const f of Object.keys(t)) {
      if (o.has(f)) continue;
      o.add(f);
      const l = t[f];
      if (!l || l.length < 2) continue;
      const h = f.split("-");
      if (h.length !== 2 || s.has(f)) continue;
      const u = ue(l[0].bakw), g = ue(l[1].bakw), v = ue(l[0].forw), d = ue(l[1].forw), k = h.map(
        (_) => u.find((T) => `${T.prop.index}` === _) || g.find((T) => `${T.prop.index}` === _)
      ), M = h.map(
        (_) => v.find((T) => `${T.prop.index}` === _) || d.find((T) => `${T.prop.index}` === _)
      );
      if (k.some((_) => !_) || M.some((_) => !_))
        continue;
      const b = [u, g].map(
        (_) => _.find((T) => !h.includes(`${T.prop.index}`))
      ), x = [v, d].map(
        (_) => _.find((T) => !h.includes(`${T.prop.index}`))
      );
      if (b.some((_) => !_) || x.some((_) => !_))
        continue;
      const p = l[0].bakw.geometry.coordinates[0].slice(0, 3).map((_) => It(_)), m = l[1].bakw.geometry.coordinates[0].slice(0, 3).map((_) => It(_)), w = l[0].forw.geometry.coordinates[0].slice(0, 3).map((_) => It(_)), S = l[1].forw.geometry.coordinates[0].slice(0, 3).map((_) => It(_)), E = Ne(p), y = Ne(m), A = Ne(w), F = Ne(S), R = Fi(
        E,
        y,
        b,
        k,
        t,
        l
      ), Y = Oi(
        A,
        F,
        b,
        k
      );
      if (!(R || Y || es(
        It(b[0].geom),
        m
      ) || es(
        It(b[1].geom),
        p
      )))
        continue;
      const O = M.map(
        (_) => It(_.geom)
      ), N = x.map(
        (_) => It(_.geom)
      ), B = Bi([
        ...O,
        ...N
      ]), C = Ri(B), P = ns(
        O[0],
        O[1],
        N[0]
      ) + ns(
        O[0],
        O[1],
        N[1]
      );
      dn(C, P) && (ts(t, l[0], r), ts(t, l[1], r), k.forEach((_) => {
        if (!_) return;
        const T = [
          _.geom,
          b[0].geom,
          b[1].geom,
          _.geom
        ], $ = {
          a: _.prop,
          b: b[0].prop,
          c: b[1].prop
        }, V = me([T], $), z = ln(V);
        Ps(t, {
          forw: z,
          bakw: V
        }, r);
      }), c = !0, i = !0);
    }
    if (!c) break;
  }
  return i;
}
function It(r) {
  return [r[0], r[1]];
}
function es(r, t) {
  const [e, n] = t[0], [s, o] = t[1], [i, a] = t[2], c = i - e, f = a - n, l = s - e, h = o - n, u = r[0] - e, g = r[1] - n, v = c * c + f * f, d = c * l + f * h, k = c * u + f * g, M = l * l + h * h, b = l * u + h * g, x = v * M - d * d;
  if (x === 0) return !1;
  const p = 1 / x, m = (M * k - d * b) * p, w = (v * b - d * k) * p, S = 1e-9;
  return m >= -S && w >= -S && m + w <= 1 + S;
}
function Bi(r) {
  const t = r.map((i) => i.slice()).filter(
    (i, a, c) => c.findIndex(
      (f) => dn(f[0], i[0]) && dn(f[1], i[1])
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
function Ri(r) {
  if (r.length < 3) return 0;
  let t = 0;
  for (let e = 0; e < r.length; e++) {
    const [n, s] = r[e], [o, i] = r[(e + 1) % r.length];
    t += n * i - o * s;
  }
  return Math.abs(t) / 2;
}
function ns(r, t, e) {
  return Math.abs(
    (r[0] * (t[1] - e[1]) + t[0] * (e[1] - r[1]) + e[0] * (r[1] - t[1])) / 2
  );
}
function dn(r, t, e = 1e-9) {
  return Math.abs(r - t) <= e;
}
const Pi = (r) => typeof r == "string" && r.startsWith("b");
function Di(r, t) {
  const e = (n, s) => {
    for (let o = 0; o < 3; o++) {
      const i = n.g[o], a = n.g[(o + 1) % 3];
      if (s.g.every((c) => n.sign * ct(i[0], i[1], a[0], a[1], c[0], c[1]) <= 0)) return !0;
    }
    return !1;
  };
  return !e(r, t) && !e(t, r);
}
function Ci(r, t, e) {
  if (t.length === 0) return [];
  const n = r.features.map((d) => {
    const { a: k, b: M, c: b } = d.properties, x = [k.geom, M.geom, b.geom], [p, m, w] = d.geometry.coordinates[0], S = x.map(([F]) => F), E = x.map(([, F]) => F), y = Math.sign(ct(p[0], p[1], m[0], m[1], w[0], w[1])), A = Math.sign(ct(x[0][0], x[0][1], x[1][0], x[1][1], x[2][0], x[2][1]));
    return {
      ids: [k.index, M.index, b.index].map(String),
      g: x,
      sign: A,
      ratio: y * A,
      aux: [k.index, M.index, b.index].some(Pi),
      minx: Math.min(...S),
      maxx: Math.max(...S),
      miny: Math.min(...E),
      maxy: Math.max(...E)
    };
  }), s = n.map((d) => d.ratio), o = s.reduce((d, k) => d + k, 0) < 0 ? -1 : 1, i = (d, k) => d < k ? `${d}|${k}` : `${k}|${d}`, a = /* @__PURE__ */ new Map();
  n.forEach((d, k) => {
    for (let M = 0; M < 3; M++) {
      const b = i(d.ids[M], d.ids[(M + 1) % 3]), x = a.get(b);
      x ? x.push(k) : a.set(b, [k]);
    }
  });
  const c = ([d, k]) => i(String(e[d]), String(e[k])), f = /* @__PURE__ */ new Set();
  for (const d of t) for (const k of a.get(c(d)) ?? []) f.add(k);
  const l = (d) => n[d].aux || f.has(d), h = /* @__PURE__ */ new Set();
  n.forEach((d, k) => {
    l(k) && (s[k] === 0 || s[k] !== o) && h.add(k);
  });
  const u = n.map((d, k) => k).sort((d, k) => n[d].minx - n[k].minx);
  for (let d = 0; d < u.length; d++) {
    const k = n[u[d]];
    if (k.sign !== 0)
      for (let M = d + 1; M < u.length; M++) {
        const b = n[u[M]];
        if (b.minx >= k.maxx) break;
        b.sign === 0 || b.miny >= k.maxy || k.miny >= b.maxy || !l(u[d]) && !l(u[M]) || Di(k, b) && (h.add(u[d]), h.add(u[M]));
      }
  }
  if (h.size === 0) return [];
  const g = t.filter((d) => (a.get(c(d)) ?? []).some((k) => h.has(k)));
  if (g.length > 0) return g;
  const v = /* @__PURE__ */ new Set();
  for (const d of h) for (const k of n[d].ids) k.startsWith("b") || v.add(k);
  return t.filter(
    ([d, k]) => v.has(String(e[d])) || v.has(String(e[k]))
  );
}
const ie = 0, Ce = (r) => r + 1, $t = 1, Ot = 2, ss = 4, rs = 1e-6, Vi = 0.2, $i = 4, Ds = Math.sign(
  Le(0, 0, 1, 0, 0, 1, 0.25, 0.25) * ct(0, 0, 1, 0, 0, 1)
), dt = (r) => [
  r[0],
  r[1]
];
function is(r) {
  const t = r.length;
  if (t < 3) return !1;
  for (let e = 0; e < t; e++) {
    const n = r[e], s = r[(e + 1) % t], o = r[(e + 2) % t];
    if (Vt(n, s, o) === 0 && (n[0] - s[0]) * (o[0] - s[0]) + (n[1] - s[1]) * (o[1] - s[1]) > 0)
      return !1;
    for (let i = e + 2; i < t; i++) {
      if (e === 0 && i === t - 1) continue;
      const a = r[i], c = r[(i + 1) % t];
      if (Be(n[0], n[1], s[0], s[1], a[0], a[1], c[0], c[1]))
        return !1;
    }
  }
  return !0;
}
const os = 2 ** 26;
function at(r, t) {
  return r < t ? r * os + t : t * os + r;
}
const Vt = (r, t, e) => Math.sign(ct(r[0], r[1], t[0], t[1], e[0], e[1])), Fe = (r, t, e) => Math.abs((t[0] - r[0]) * (e[1] - r[1]) - (e[0] - r[0]) * (t[1] - r[1]));
class Li {
  triangles;
  constructor(t) {
    this.triangles = t.map((e) => [...e]);
  }
  /**
   * `wrong` な三角形の辺のうち、固定されていない辺を反転して直す。
   *
   * @param accept 反転の前の 2 つの三角形・後の 2 つの三角形・後の対角線の鍵を受け取り、採るなら、
   *   新しく固定する辺の鍵の配列を返す（採らなければ undefined）
   * @param done 途中で止めてよいか
   * @returns 反転した数
   */
  repair(t, e, n, s = () => !1) {
    let o = 0;
    const i = this.triangles.length * 4 + 8;
    for (let a = 0; a < i && !s() && this.repairOne(t, e, n); a++)
      o++;
    return o;
  }
  repairOne(t, e, n) {
    const s = /* @__PURE__ */ new Map();
    this.triangles.forEach((o, i) => {
      for (let a = 0; a < 3; a++) {
        const c = at(o[a], o[(a + 1) % 3]), f = s.get(c);
        f ? f.push(i) : s.set(c, [i]);
      }
    });
    for (let o = 0; o < this.triangles.length; o++) {
      const i = this.triangles[o];
      if (t(i))
        for (let a = 0; a < 3; a++) {
          const c = i[a], f = i[(a + 1) % 3], l = i[(a + 2) % 3], h = at(c, f);
          if (n.has(h)) continue;
          const u = s.get(h);
          if (u.length !== 2) continue;
          const g = u[0] === o ? u[1] : u[0], v = this.triangles[g].find((M) => M !== c && M !== f), d = [
            [c, v, l],
            [v, f, l]
          ], k = e([i, this.triangles[g]], d, at(l, v));
          if (k) {
            for (const M of k) n.add(M);
            return this.triangles[o] = d[0], this.triangles[g] = d[1], !0;
          }
        }
    }
    return !1;
  }
}
class ze {
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
  addVertex(t, e, n, s = []) {
    const o = this.nextVertex++;
    return this.vertices.set(o, {
      ref: t,
      forw: dt(e),
      bakw: dt(n),
      groups: s
    }), this.byVertex.set(o, /* @__PURE__ */ new Set()), o;
  }
  /** 三角形を 1 つも持たない頂点を消す。 */
  dropVertex(t) {
    if (this.byVertex.get(t)?.size)
      throw new Error(`頂点 ${t} は三角形の頂点です`);
    this.vertices.delete(t), this.byVertex.delete(t), t === this.nextVertex - 1 && this.nextVertex--;
  }
  addTriangle(t, e, n) {
    const s = this.nextTriangle++, o = [t, e, n];
    this.triangles.set(s, o);
    for (let a = 0; a < 3; a++) {
      this.byVertex.get(o[a]).add(s);
      const c = at(o[a], o[(a + 1) % 3]), f = this.byEdge.get(c);
      f ? f.push(s) : this.byEdge.set(c, [s]);
    }
    this.ok(t, e, n) || this.bad.add(s);
    const i = this.forbiddenGroup(t, e, n);
    return i === ie ? this.forbiddenBoundary++ : i !== void 0 && this.forbiddenEdge++, s;
  }
  removeTriangle(t) {
    const e = this.triangles.get(t);
    this.triangles.delete(t);
    for (let s = 0; s < 3; s++) {
      this.byVertex.get(e[s])?.delete(t);
      const o = at(e[s], e[(s + 1) % 3]), i = this.byEdge.get(o);
      i.length === 1 ? this.byEdge.delete(o) : i.splice(i.indexOf(t), 1);
    }
    this.bad.delete(t);
    const n = this.forbiddenGroup(e[0], e[1], e[2]);
    n === ie ? this.forbiddenBoundary-- : n !== void 0 && this.forbiddenEdge--;
  }
  hasEdge(t, e) {
    return this.byEdge.has(at(t, e));
  }
  flagsOf(t, e) {
    return this.edgeFlags.get(at(t, e)) ?? 0;
  }
  setFlag(t, e, n) {
    const s = at(t, e);
    this.edgeFlags.set(s, (this.edgeFlags.get(s) ?? 0) | n);
  }
  clearFlag(t, e, n) {
    const s = at(t, e), o = (this.edgeFlags.get(s) ?? 0) & ~n;
    o ? this.edgeFlags.set(s, o) : this.edgeFlags.delete(s);
  }
  // ── 判定 ──
  /** 三角形の合格（S1）: 両面の向きの積が σ に等しい。面積 0 は不合格。向きは厳密な述語で取る。 */
  ok(t, e, n, s = this.vertexAt) {
    const o = s(t), i = s(e), a = s(n);
    return Vt(o.forw, i.forw, a.forw) * Vt(o.bakw, i.bakw, a.bakw) === this.sigma;
  }
  /** 新しく作る三角形の合格: ok に加えて、両面とも 2×面積が閾値以上。 */
  okNew(t, e, n, s = this.vertexAt) {
    if (!this.ok(t, e, n, s)) return !1;
    const o = s(t), i = s(e), a = s(n);
    return Fe(o.forw, i.forw, a.forw) >= rs && Fe(o.bakw, i.bakw, a.bakw) >= rs;
  }
  /** 3 頂点が同じ群に属するなら、その群の番号（禁止制約の違反）。属さなければ undefined。 */
  forbiddenGroup(t, e, n) {
    const s = this.vertices.get(e).groups, o = this.vertices.get(n).groups;
    return this.vertices.get(t).groups.find((i) => s.includes(i) && o.includes(i));
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
      for (const s of this.triangles.get(n))
        for (const o of this.byVertex.get(s)) e.add(o);
    return e;
  }
  /** 三角形の頂点を、紙の面で正の向き（orient2d > 0）に並べ直す。面積 0 なら undefined。 */
  positive(t) {
    const [e, n, s] = this.triangles.get(t), o = Vt(
      this.vertices.get(e).forw,
      this.vertices.get(n).forw,
      this.vertices.get(s).forw
    );
    if (o !== 0)
      return o > 0 ? [e, n, s] : [e, s, n];
  }
  /**
   * 範囲の外周の輪を、有向の辺の列（範囲の内側が、紙の面で正の向きの側）で取る。
   * 範囲が円板でなければ（同じ頂点を 2 回通る・穴がある・離れている）undefined。
   */
  ringOf(t) {
    const e = /* @__PURE__ */ new Map();
    for (const o of t) {
      const i = this.positive(o);
      if (!i) return;
      for (let a = 0; a < 3; a++) {
        const c = i[a], f = i[(a + 1) % 3], l = this.byEdge.get(at(c, f));
        if (l.length > 2) return;
        if (!(l.length === 2 && t.has(l[0]) && t.has(l[1]))) {
          if (e.has(c)) return;
          e.set(c, f);
        }
      }
    }
    if (e.size < 3) return;
    const n = e.keys().next().value, s = [n];
    for (let o = e.get(n); o !== n; o = e.get(o)) {
      if (o === void 0 || s.length > e.size) return;
      s.push(o);
    }
    return s.length === e.size ? s : void 0;
  }
  // ── 差し替え ──
  /**
   * 範囲 R の外周の輪を固定して、内側だけを三角形分割し直す（設計書 §5.1）。
   * 失敗したときは、網を変えない。
   *
   * 新しい三角形に okNew でないものがあれば、R' の中の辺の反転で直す（重なりの解消。§5.2）。禁止制約の
   * 三角形が増えたら、違反の三角形の所だけ反転で直し、反転した辺に protect を付ける。それでも残れば
   * "notStrict"・"forbidden" で失敗する。差し替えの後に、輪の辺を上限つきで磨く（§5.3）。
   */
  replace(t, e = {}) {
    const n = (D) => ({
      ok: !1,
      reason: D
    });
    if (!e.unlimited && t.size > this.triangles.size * Vi)
      return n("tooLarge");
    const s = new Set(e.remove ?? []), o = [], i = /* @__PURE__ */ new Set();
    let a = 0;
    for (const D of t) {
      const L = this.positive(D);
      if (!L) return n("notDisk");
      for (let j = 0; j < 3; j++) {
        const rt = L[j], it = L[(j + 1) % 3], gt = this.byEdge.get(at(rt, it));
        if (gt.length > 2) return n("notDisk");
        gt.length === 2 && t.has(gt[0]) && t.has(gt[1]) || gt.length === 1 && (s.has(rt) || s.has(it)) || (gt.length === 1 && a++, o.push([rt, it]), i.add(rt).add(it));
      }
    }
    if (o.length < 3) return n("notDisk");
    const c = new Set(e.add ?? []);
    for (const D of t)
      for (const L of this.triangles.get(D))
        !i.has(L) && !s.has(L) && c.add(L);
    for (const D of s) {
      if (i.has(D)) return n("notDisk");
      for (const L of this.byVertex.get(D))
        if (!t.has(L)) return n("notDisk");
    }
    for (const D of e.move?.keys() ?? [])
      if (!c.has(D)) return n("notDisk");
    const f = (D) => {
      const L = e.move?.get(D), j = this.vertices.get(D);
      return L ? { ...j, ...L } : j;
    }, l = e.outerRing;
    if (l) {
      if (l.some((D) => !c.has(D))) return n("boundary");
      for (const D of ["forw", "bakw"])
        if (!is(l.map((L) => f(L)[D])))
          return n("boundary");
    }
    const h = [...i, ...c], u = new Map(h.map((D, L) => [D, L])), g = /* @__PURE__ */ new Set(), v = [];
    for (const [D, L] of o)
      g.add(at(D, L)), v.push([u.get(D), u.get(L)]);
    const d = /* @__PURE__ */ new Set();
    if (l)
      for (let D = 0; D < l.length; D++) {
        const L = l[D], j = l[(D + 1) % l.length];
        d.add(at(L, j)), v.push([u.get(L), u.get(j)]);
      }
    const k = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Set(), b = new Set(
      (e.release ?? []).map(([D, L]) => at(D, L))
    );
    for (const D of t) {
      const L = this.triangles.get(D);
      for (let j = 0; j < 3; j++) {
        const rt = L[j], it = L[(j + 1) % 3], gt = at(rt, it);
        g.has(gt) || (M.add(gt), (this.edgeFlags.get(gt) ?? 0) & ($t | Ot) && (s.has(rt) || s.has(it) || b.has(gt) || k.set(gt, [rt, it])));
      }
    }
    for (const [D, L] of e.constrain ?? []) {
      if (!u.has(D) || !u.has(L)) return n("constraint");
      const j = at(D, L);
      !g.has(j) && !d.has(j) && k.set(j, [D, L]);
    }
    for (const [D, L] of k.values())
      v.push([u.get(D), u.get(L)]);
    let x;
    const p = [];
    try {
      const D = Xe.from(h.map((rt) => f(rt).forw));
      if (D.triangles.length === 0) return n("constraint");
      let L = new Jt(D, v);
      const j = (e.soft ?? []).filter(
        ([rt, it]) => u.has(rt) && u.has(it) && !g.has(at(rt, it)) && !d.has(at(rt, it)) && !k.has(at(rt, it))
      );
      if (j.length > 0) {
        const rt = L.snapshot();
        for (const it of j)
          try {
            L.constrainOne(u.get(it[0]), u.get(it[1])), p.push([it[0], it[1], it[2]]);
          } catch {
            L = Jt.restore(rt), L.constrainAll(
              p.map(([gt, Pt]) => [
                u.get(gt),
                u.get(Pt)
              ])
            );
          }
      }
      x = L.del;
    } catch {
      return n("constraint");
    }
    const { triangles: m, halfedges: w } = x, S = m.length / 3, E = (D) => f(h[D]).forw;
    let y = 0, A = 0;
    for (let D = 0; D < S; D++) {
      const L = E(m[D * 3]), j = E(m[D * 3 + 1]), rt = E(m[D * 3 + 2]), it = Fe(L, j, rt);
      if (it > A) {
        const gt = Vt(L, j, rt);
        gt !== 0 && (A = it, y = gt);
      }
    }
    if (y === 0) return n("count");
    const F = /* @__PURE__ */ new Map();
    for (let D = 0; D < m.length; D++)
      F.set(m[D] * h.length + m[Ft(D)], D);
    const R = /* @__PURE__ */ new Set();
    for (const [D, L] of o) {
      const j = u.get(D), rt = u.get(L), it = F.get(
        y > 0 ? j * h.length + rt : rt * h.length + j
      );
      if (it === void 0) return n("pointOutside");
      R.add(it);
    }
    const Y = (D) => d.size > 0 && d.has(at(h[m[D]], h[m[Ft(D)]])), I = /* @__PURE__ */ new Set(), O = [];
    for (const D of R) {
      const L = Math.floor(D / 3);
      I.has(L) || (I.add(L), O.push(L));
    }
    for (let D = 0; D < O.length; D++)
      for (let L = O[D] * 3; L < O[D] * 3 + 3; L++) {
        if (R.has(L) || Y(L)) continue;
        const j = w[L];
        if (j === -1 || R.has(j)) return n("pointOutside");
        const rt = Math.floor(j / 3);
        I.has(rt) || (I.add(rt), O.push(rt));
      }
    for (const D of R) {
      const L = w[D];
      if (L !== -1 && !R.has(L) && I.has(Math.floor(L / 3)))
        return n("pointOutside");
    }
    for (let D = 0; D < m.length; D++) {
      if (!Y(D) || !I.has(Math.floor(D / 3))) continue;
      const L = w[D];
      if (L !== -1 && I.has(Math.floor(L / 3))) return n("boundary");
    }
    const N = [], B = /* @__PURE__ */ new Set();
    for (const D of I) {
      const L = h[m[D * 3]], j = h[m[D * 3 + 1]], rt = h[m[D * 3 + 2]];
      B.add(L).add(j).add(rt), N.push(y === this.forwSign ? [L, j, rt] : [L, rt, j]);
    }
    for (const D of c) if (!B.has(D)) return n("pointOutside");
    const C = /* @__PURE__ */ new Set();
    for (const [D, L, j] of N)
      C.add(at(D, L)).add(at(L, j)).add(at(j, D));
    for (const D of k.keys())
      if (!C.has(D)) return n("constraint");
    for (const D of d)
      if (!C.has(D)) return n("boundary");
    const P = p.map(([D, L]) => at(D, L)).filter((D) => C.has(D)), _ = /* @__PURE__ */ new Set([
      ...g,
      ...d,
      ...k.keys(),
      ...P
    ]), T = new Li(N), $ = (D) => Vt(f(D[0]).forw, f(D[1]).forw, f(D[2]).forw) === this.forwSign && this.okNew(D[0], D[1], D[2], f), V = (D) => this.forbiddenGroup(D[0], D[1], D[2]) !== void 0, z = e.allowBad || e.forwOnly, X = e.forwOnly ? 0 : T.repair(
      (D) => !this.okNew(D[0], D[1], D[2], f),
      (D, L) => L.every($) ? [] : void 0,
      _
    );
    if (!z) {
      for (const D of T.triangles) if (!$(D)) return n("notStrict");
    }
    let U = 0;
    for (const D of t) {
      const [L, j, rt] = this.triangles.get(D);
      this.forbiddenGroup(L, j, rt) !== void 0 && U++;
    }
    const q = () => T.triangles.filter(V).length, H = [];
    let W = 0;
    if (q() > U && (W = T.repair(
      V,
      (D, L, j) => {
        if (L.every($) && !(L.filter(V).length >= D.filter(V).length))
          return H.push(j), [j];
      },
      _,
      () => q() <= U
    ), q() > U && !z))
      return n("forbidden");
    N.splice(0, N.length, ...T.triangles);
    for (const [D, L] of e.move ?? []) {
      const j = this.vertices.get(D);
      j.forw = dt(L.forw), j.bakw = dt(L.bakw);
    }
    const J = [...t];
    for (const D of J) this.removeTriangle(D);
    const tt = N.map(([D, L, j]) => this.addTriangle(D, L, j));
    for (const D of M) {
      const L = (this.edgeFlags.get(D) ?? 0) & ~ss;
      L && this.byEdge.has(D) ? this.edgeFlags.set(D, L) : this.edgeFlags.delete(D);
    }
    for (const [D, L] of e.release ?? [])
      !s.has(D) && !s.has(L) && this.clearFlag(D, L, $t);
    for (const [D, L, j] of e.constrain ?? [])
      j && this.setFlag(D, L, j);
    for (const [D, L, j] of p)
      j && this.hasEdge(D, L) && this.setFlag(D, L, j);
    for (const D of H)
      this.byEdge.has(D) && this.edgeFlags.set(D, (this.edgeFlags.get(D) ?? 0) | ss);
    for (const D of s) this.dropVertex(D);
    l && (this.boundarySimple = a === 0 && e.replacesWholeBoundary ? !0 : this.computeBoundarySimple()), this.revision++;
    const K = new Set(J), Q = new Set(tt);
    let nt = 0;
    return e.noPolish || (nt = this.polish(
      o,
      $i * o.length,
      K,
      Q,
      e.forwOnly
    )), {
      ok: !0,
      removed: [...K],
      added: [...Q],
      soft: p.map(([D, L]) => [D, L]),
      flips: {
        overlap: X,
        forbidden: W,
        polish: nt
      }
    };
  }
  /**
   * 辺を共有する 2 つの三角形の対角線を入れ替える。新しい 2 つの三角形が、紙の面で正しい向き（凸な四辺形）で、
   * 両方 okNew で、禁止制約の違反を増やさないときだけ行う。行ったら、四辺形の外周の 4 辺を返す。
   */
  flipEdge(t, e, n, s, o = !1) {
    const i = this.byEdge.get(at(t, e));
    if (!i || i.length !== 2) return;
    const a = this.positive(i[0]);
    if (!a) return;
    const c = a.findIndex(
      (M, b) => (M === t || M === e) && (a[(b + 1) % 3] === t || a[(b + 1) % 3] === e)
    ), f = a[c], l = a[(c + 1) % 3], h = a[(c + 2) % 3], u = this.triangles.get(i[1]).find((M) => M !== t && M !== e), g = [
      [f, u, h],
      [u, l, h]
    ], v = this.vertexAt;
    for (const [M, b, x] of g)
      if (Vt(v(M).forw, v(b).forw, v(x).forw) <= 0 || !o && !this.okNew(M, b, x)) return;
    const d = (M) => M.filter(([b, x, p]) => this.forbiddenGroup(b, x, p) !== void 0).length, k = i.map((M) => this.triangles.get(M));
    if (!(d(g) > d(k))) {
      for (const M of [...i])
        this.removeTriangle(M), s?.has(M) ? s.delete(M) : n?.add(M);
      for (const [M, b, x] of g) {
        const p = this.forwSign > 0 ? this.addTriangle(M, b, x) : this.addTriangle(M, x, b);
        s?.add(p);
      }
      return [
        [f, u],
        [u, l],
        [l, h],
        [h, f]
      ];
    }
  }
  /**
   * 磨き（§5.3）: 与えた辺から始めて、制約（required・hull・protect）でなく、外接円の条件を満たさない辺を
   * 反転する。反転したら、四辺形の外周の 4 辺を調べ直す。調べる辺の数の上限で止める（全体を回らない）。
   * 外接円の判定は厳密な不等号（同じ円の上の 4 点では反転しない。往復して止まらなくなるのを防ぐ）。
   *
   * @returns 反転した辺の数
   */
  polish(t, e, n, s, o = !1) {
    const i = [...t];
    let a = 0;
    for (let c = 0; c < i.length && c < e; c++) {
      const [f, l] = i[c], h = at(f, l);
      if ((this.edgeFlags.get(h) ?? 0) !== 0) continue;
      const u = this.byEdge.get(h);
      if (!u || u.length !== 2) continue;
      const g = this.positive(u[0]);
      if (!g) continue;
      const v = this.triangles.get(u[1]).find((p) => p !== f && p !== l), [d, k, M, b] = [...g, v].map((p) => this.vertices.get(p).forw);
      if (Le(d[0], d[1], k[0], k[1], M[0], M[1], b[0], b[1]) * Ds <= 0)
        continue;
      const x = this.flipEdge(f, l, n, s, o);
      x && (a++, i.push(...x));
    }
    return a > 0 && this.revision++, a;
  }
  /**
   * 接続を変えずに、頂点の座標だけを変える（地理面だけの移動。設計書 §4.3）。星の三角形の `bad` を
   * 判定し直す。採ってよいかどうか（星の三角形が全部 okNew か）は、呼び出し側が先に確かめる。
   */
  relocate(t, e, n) {
    const s = this.vertices.get(t);
    s.forw = dt(e), s.bakw = dt(n);
    for (const o of this.byVertex.get(t)) {
      const [i, a, c] = this.triangles.get(o);
      this.ok(i, a, c) ? this.bad.delete(o) : this.bad.add(o);
    }
    this.revision++;
  }
  // ── 外周 ──
  /** 網の外周 ∂M（対の無い辺）を、輪の頂点の列で取る。1 本の輪でなければ undefined。 */
  boundaryRing() {
    const t = /* @__PURE__ */ new Map();
    for (const [s, o] of this.byEdge) {
      if (o.length !== 1) continue;
      const i = this.positive(o[0]) ?? this.triangles.get(o[0]);
      for (let a = 0; a < 3; a++) {
        const c = i[a], f = i[(a + 1) % 3];
        if (at(c, f) === s) {
          if (t.has(c)) return;
          t.set(c, f);
        }
      }
    }
    if (t.size < 3) return;
    const e = t.keys().next().value, n = [e];
    for (let s = t.get(e); s !== e; s = t.get(s)) {
      if (s === void 0 || n.length > t.size) return;
      n.push(s);
    }
    return n.length === t.size ? n : void 0;
  }
  /** 外周 ∂M が 1 本の輪で、両面とも単純な多角形か（S2）を計算し直す。 */
  computeBoundarySimple() {
    const t = this.boundaryRing();
    return t ? ["forw", "bakw"].every(
      (e) => is(t.map((n) => this.vertices.get(n)[e]))
    ) : !1;
  }
  /**
   * 網を複製する（全部組み直しの中の試行で、もとの網を保つために使う）。
   *
   * @param shareVertices 頂点の表の中身（座標・群）を、もとの網と共有する。複製した網で、今ある頂点を
   *   動かさない・群を変えないとき（頂点の追加と削除・三角形の差し替えだけのとき）に限る
   */
  clone(t = !1) {
    const e = new ze(this.sigma, this.forwSign);
    for (const [n, s] of this.vertices)
      e.vertices.set(
        n,
        t ? s : {
          ref: s.ref,
          forw: dt(s.forw),
          bakw: dt(s.bakw),
          groups: [...s.groups]
        }
      );
    for (const [n, s] of this.triangles)
      e.triangles.set(n, s);
    for (const [n, s] of this.byVertex)
      e.byVertex.set(n, new Set(s));
    for (const [n, s] of this.byEdge) e.byEdge.set(n, [...s]);
    for (const [n, s] of this.edgeFlags) e.edgeFlags.set(n, s);
    for (const n of this.bad) e.bad.add(n);
    return e.boundarySimple = this.boundarySimple, e.forbiddenBoundary = this.forbiddenBoundary, e.forbiddenEdge = this.forbiddenEdge, e.revision = this.revision, e.nextVertex = this.nextVertex, e.nextTriangle = this.nextTriangle, e;
  }
  /**
   * ok でない三角形を、その周りの組み直しで直す（辺の反転で直らなかったもの）。ok でない三角形を、頂点で
   * つながるかたまりに分け、かたまりごとに、周りを 1 周ずつ広げた範囲を差し替える（全部が okNew になる
   * 差し替えだけを採る）。
   *
   * @returns 直せなかった、ok でない三角形の数
   */
  healBad(t = 3) {
    const e = /* @__PURE__ */ new Set();
    for (const n of [...this.bad]) {
      if (e.has(n) || !this.bad.has(n)) continue;
      const s = /* @__PURE__ */ new Set([n]), o = [n];
      for (let a = 0; a < o.length; a++)
        for (const c of this.triangles.get(o[a]))
          for (const f of this.byVertex.get(c))
            this.bad.has(f) && !s.has(f) && (s.add(f), o.push(f));
      for (const a of s) e.add(a);
      let i = s;
      for (let a = 0; a < t; a++) {
        i = this.grow(i);
        const c = this.replace(i);
        if (c.ok || c.reason === "tooLarge") break;
      }
    }
    return this.bad.size;
  }
  /**
   * ok でない三角形を、その辺の反転で直す（重なりの解消。網の全体ではなく、ok でない三角形の所だけ）。
   * 必須エッジは反転しない。凸包の辺は反転してよい（今の `resolveOverlaps` と同じ扱い）。
   *
   * @returns 反転した辺の数
   */
  repairBad() {
    let t = 0;
    for (let e = 0; e < 4 && this.bad.size > 0; e++) {
      let n = !1;
      for (const s of [...this.bad]) {
        const o = this.bad.has(s) ? this.triangles.get(s) : void 0;
        if (o)
          for (let i = 0; i < 3; i++) {
            const a = o[i], c = o[(i + 1) % 3];
            if (!((this.edgeFlags.get(at(a, c)) ?? 0) & $t) && this.flipEdge(a, c)) {
              this.edgeFlags.delete(at(a, c)), n = !0, t++;
              break;
            }
          }
      }
      if (!n) break;
    }
    return t > 0 && this.revision++, t;
  }
  // ── 全部の数え直し（試験用。製品のコードは呼ばない） ──
  audit() {
    const t = [];
    let e = 0, n = 0, s = 0, o = !0;
    const i = /* @__PURE__ */ new Map();
    for (const [u, [g, v, d]] of this.triangles) {
      this.ok(g, v, d) || t.push(u);
      const k = this.forbiddenGroup(g, v, d);
      k === ie ? e++ : k !== void 0 && n++, s += Fe(
        this.vertices.get(g).forw,
        this.vertices.get(v).forw,
        this.vertices.get(d).forw
      ) / 2;
      for (const [M, b] of [
        [g, v],
        [v, d],
        [d, g]
      ]) {
        const x = at(M, b);
        i.set(x, (i.get(x) ?? 0) + 1), this.byEdge.get(x)?.includes(u) || (o = !1), this.byVertex.get(M)?.has(u) || (o = !1);
      }
    }
    let a = 0;
    for (const [u, g] of i)
      g > 2 && a++, this.byEdge.get(u)?.length !== g && (o = !1);
    i.size !== this.byEdge.size && (o = !1);
    let c = 0, f = 0;
    for (const [u, g] of this.byVertex)
      this.vertices.has(u) || (o = !1), g.size === 0 && f++, c += g.size;
    let l = 0;
    for (const [, u] of this.byEdge) {
      if (u.length !== 2) continue;
      const g = this.triangles.get(u[0]), v = this.triangles.get(u[1]), d = g.filter((m) => v.includes(m)), k = g.find((m) => !v.includes(m)), M = v.find((m) => !g.includes(m));
      if (d.length !== 2 || k === void 0 || M === void 0) {
        l++;
        continue;
      }
      const [b, x] = d.map((m) => this.vertices.get(m).forw);
      Vt(b, x, this.vertices.get(k).forw) * Vt(b, x, this.vertices.get(M).forw) !== -1 && l++;
    }
    c !== this.triangles.size * 3 && (o = !1);
    let h = 0;
    for (const [u, g] of this.edgeFlags)
      g & $t && !this.byEdge.has(u) && h++;
    return {
      triangles: this.triangles.size,
      bad: t,
      badMatches: t.length === this.bad.size && t.every((u) => this.bad.has(u)),
      indexMatches: o,
      nonManifoldEdges: a,
      boundarySimple: this.computeBoundarySimple(),
      missingRequired: h,
      forbiddenBoundary: e,
      forbiddenEdge: n,
      forbiddenMatches: e === this.forbiddenBoundary && n === this.forbiddenEdge,
      forwArea: s,
      forwFolds: l,
      orphanVertices: f
    };
  }
}
const as = (r, t, e) => Math.sign(ct(r[0], r[1], t[0], t[1], e[0], e[1]));
function cs(r, t, e, n, s) {
  const o = /* @__PURE__ */ new Map();
  for (const g of r) {
    const { index: v, geom: d } = g.properties.target;
    o.set(v, { forw: g.geometry.coordinates, bakw: d });
  }
  let i = 0, a = 0;
  for (const g of t.features) {
    const { a: v, b: d, c: k } = g.properties, [M, b, x] = [v, d, k].map(({ index: m }) => o.get(m));
    if (!M || !b || !x) return;
    const p = as(M.forw, b.forw, x.forw);
    a += p, i += p * as(M.bakw, b.bakw, x.bakw);
  }
  if ((i < 0 ? -1 : 1) !== s) return;
  const c = new ze(s, a < 0 ? -1 : 1), f = { mesh: c, indexOf: /* @__PURE__ */ new Map(), interior: [], ring: [] }, l = /* @__PURE__ */ new Map(), h = r.map(() => []);
  let u = 1;
  for (const [g, v] of e)
    g < n && h[g].push(u), h[v].push(u), v < n && u++;
  r.forEach((g, v) => {
    const { index: d, geom: k } = g.properties.target, M = typeof d == "string" && d.startsWith("b"), b = c.addVertex(
      M ? { kind: "boundary", order: f.ring.length } : typeof d == "number" ? { kind: "gcp", id: d } : { kind: "edgeNode", edge: -1, order: v },
      g.geometry.coordinates,
      k,
      M ? [ie] : h[v]
    );
    l.set(d, b), f.indexOf.set(b, d), (M ? f.ring : f.interior).push(b);
  });
  for (const g of t.features) {
    const { a: v, b: d, c: k } = g.properties;
    c.addTriangle(l.get(v.index), l.get(d.index), l.get(k.index));
  }
  for (const [g, v] of e)
    c.setFlag(f.interior[g], f.interior[v], $t);
  return c.boundarySimple = c.computeBoundarySimple(), f;
}
function Xi(r) {
  return {
    mesh: r.mesh.clone(!0),
    indexOf: new Map(r.indexOf),
    interior: [...r.interior],
    ring: [...r.ring]
  };
}
function zi(r) {
  const { mesh: t, indexOf: e } = r, n = [];
  for (const s of t.triangles.values()) {
    const [o, i, a] = s.map((c) => t.vertices.get(c));
    n.push({
      type: "Feature",
      properties: {
        a: { geom: o.bakw, index: e.get(s[0]) },
        b: { geom: i.bakw, index: e.get(s[1]) },
        c: { geom: a.bakw, index: e.get(s[2]) }
      },
      geometry: { type: "Polygon", coordinates: [[o.forw, i.forw, a.forw, o.forw]] }
    });
  }
  return { type: "FeatureCollection", features: n };
}
function Cs(r, t) {
  const { mesh: e } = r, n = r.ring.length;
  for (let d = 0; d < n; d++)
    if (e.byEdge.get(at(r.ring[d], r.ring[(d + 1) % n]))?.length !== 1)
      return { ok: !1, reason: "bandNotAnnulus" };
  for (const d of r.ring) {
    let k = 0;
    for (const M of e.byVertex.get(d)) {
      const b = e.triangles.get(M);
      for (let x = 0; x < 3; x++) {
        const p = b[x], m = b[(x + 1) % 3];
        (p === d || m === d) && e.byEdge.get(at(p, m)).length === 1 && k++;
      }
    }
    if (k !== 2) return { ok: !1, reason: "bandNotAnnulus" };
  }
  const s = new Set(t.extra ?? []);
  for (const d of r.ring)
    for (const k of e.byVertex.get(d)) s.add(k);
  const o = (t.addPoints ?? []).map(({ index: d, forw: k, bakw: M }) => ({
    index: d,
    vertex: e.addVertex({ kind: "edgeNode", edge: -1, order: -1 }, k, M)
  })), i = t.vertices.map(
    ({ forw: d, bakw: k }, M) => e.addVertex({ kind: "boundary", order: M }, d, k, [ie])
  ), a = [...r.interior, ...o.map(({ vertex: d }) => d)], c = new Set(t.edit?.remove ?? []), f = [];
  for (const [d, k] of e.edgeFlags)
    k & Ot && f.push([d, k]);
  for (const [d, k] of f)
    k & ~Ot ? e.edgeFlags.set(d, k & ~Ot) : e.edgeFlags.delete(d);
  const l = [], h = [];
  for (const [d, k] of t.hull) {
    const M = a[d], b = a[k];
    if (M === void 0 || b === void 0 || c.has(M) || c.has(b)) continue;
    l.push([M, b]);
    const x = e.byEdge.get(at(M, b));
    x && !x.every((p) => s.has(p)) ? e.setFlag(M, b, Ot) : h.push([M, b, Ot]);
  }
  const u = e.replace(s, {
    ...t.edit,
    remove: [...r.ring, ...t.edit?.remove ?? []],
    add: [...i, ...o.map(({ vertex: d }) => d), ...t.edit?.add ?? []],
    outerRing: i,
    replacesWholeBoundary: !0,
    soft: h,
    allowBad: t.allowBad,
    forwOnly: t.forwOnly,
    unlimited: !0
  });
  if (!u.ok) {
    for (const d of [...i].reverse()) e.dropVertex(d);
    for (const { vertex: d } of [...o].reverse()) e.dropVertex(d);
    for (const [d, k] of e.edgeFlags)
      k & Ot && (k & ~Ot ? e.edgeFlags.set(d, k & ~Ot) : e.edgeFlags.delete(d));
    for (const [d, k] of f) e.edgeFlags.set(d, (e.edgeFlags.get(d) ?? 0) | k);
    return u;
  }
  for (const d of r.ring) r.indexOf.delete(d);
  i.forEach((d, k) => r.indexOf.set(d, `b${k}`));
  for (const { index: d, vertex: k } of o) r.indexOf.set(k, d);
  r.ring = i, r.interior = a;
  const g = new Map(a.map((d, k) => [d, k])), v = [];
  for (const [d, k] of l)
    e.hasEdge(d, k) && (e.setFlag(d, k, Ot), v.push([g.get(d), g.get(k)]));
  return { ok: !0, applied: v, removed: u.removed, added: u.added };
}
function Yi(r) {
  const { mesh: t } = r;
  let e = 0;
  for (const n of t.bad)
    t.triangles.get(n).some((o) => t.vertices.get(o).ref.kind === "boundary") && e++;
  return e;
}
const qi = 4, fs = 32, Ui = 1, ji = 0.4, Vs = 4, Gi = 1e-4, $s = 0.25, Wi = 0.01, jt = (r, t) => String(r) < String(t) ? `${r}|${t}` : `${t}|${r}`;
function fn(r, t, e) {
  const n = t.filter((f) => !String(f.properties.target.index).startsWith("b")).map((f) => ({
    id: f.properties.target.index,
    paper: f.geometry.coordinates,
    geo: f.properties.target.geom
  })), s = /* @__PURE__ */ new Set();
  let o = 0, i = 0;
  const a = r.features.map((f) => {
    const { a: l, b: h, c: u } = f.properties, [g, v, d] = f.geometry.coordinates[0];
    s.add(jt(l.index, h.index)), s.add(jt(l.index, u.index)), s.add(jt(h.index, u.index));
    const k = Math.sign(ct(g[0], g[1], v[0], v[1], d[0], d[1])) * Math.sign(ct(l.geom[0], l.geom[1], h.geom[0], h.geom[1], u.geom[0], u.geom[1]));
    return k > 0 ? o++ : k < 0 && i++, {
      ids: [String(l.index), String(h.index), String(u.index)],
      paper: [g, v, d],
      geo: [l.geom, h.geom, u.geom],
      sign: k
    };
  }), c = e.filter(([f, l]) => !s.has(jt(n[f].id, n[l].id)));
  return { points: n, triangles: a, majority: o >= i ? 1 : -1, hullEdges: e, dropped: c };
}
function Ls(r) {
  return [r.foot[0] + r.height * r.normal[0], r.foot[1] + r.height * r.normal[1]];
}
function Ki(r, [t, e], { lambda: n = $s, epsilon: s = Gi } = {}) {
  const { points: o, majority: i } = r, a = o[t], c = o[e], f = o.reduce((N, B) => N + B.paper[0], 0) / o.length, l = o.reduce((N, B) => N + B.paper[1], 0) / o.length, h = Math.sign(ct(a.paper[0], a.paper[1], c.paper[0], c.paper[1], f, l));
  if (h === 0) return;
  const u = h * i, g = [c.paper[0] - a.paper[0], c.paper[1] - a.paper[1]], v = [c.geo[0] - a.geo[0], c.geo[1] - a.geo[1]], d = Math.hypot(g[0], g[1]), k = Math.hypot(v[0], v[1]);
  if (!(d > 0 && k > 0)) return;
  const M = [];
  for (const N of o) {
    if (N === a || N === c) continue;
    const B = ct(a.geo[0], a.geo[1], c.geo[0], c.geo[1], N.geo[0], N.geo[1]);
    if (B * u >= 0) continue;
    const C = ((N.geo[0] - a.geo[0]) * v[0] + (N.geo[1] - a.geo[1]) * v[1]) / (k * k), P = ((N.paper[0] - a.paper[0]) * g[0] + (N.paper[1] - a.paper[1]) * g[1]) / (d * d);
    C > 0 && C < 1 && P > 0 && P < 1 && M.push({ id: N.id, u: C, t: P, d: Math.abs(B) / k });
  }
  const b = M.length > 0;
  b || M.push({ u: 0.5, t: 0.5, d: 0 });
  const x = M.reduce((N, B) => B.d > N.d ? B : N);
  let p = 0;
  for (const N of M)
    p = Math.max(p, N.u <= x.u ? N.d * x.u / N.u : N.d * (1 - x.u) / (1 - N.u));
  p *= 1 + n;
  const m = [-g[1] / d * h, g[0] / d * h], w = [-v[1] / k * u, v[0] / k * u], S = (N) => [
    a.paper[0] + N * g[0] + s * d * m[0],
    a.paper[1] + N * g[1] + s * d * m[1]
  ], E = (N, B, C, P) => ({
    paper: S(N),
    foot: [a.geo[0] + B * v[0], a.geo[1] + B * v[1]],
    normal: w,
    height: C,
    chord: k,
    protrusion: x.d,
    ...P === void 0 ? {} : { anchor: P }
  }), y = [E(x.t, x.u, p, b ? x.id : void 0)], A = [...M].sort((N, B) => N.u - B.u), F = [{ u: 0, d: 0 }], R = (N, B, C) => (B.u - N.u) * (C.d - N.d) - (B.d - N.d) * (C.u - N.u);
  for (const N of [...A, { u: 1, d: 0 }]) {
    for (; F.length >= 2 && R(F[F.length - 2], F[F.length - 1], N) >= 0; ) F.pop();
    F.push(N);
  }
  const Y = n * x.d, I = [];
  let O = 0;
  for (const N of F.slice(1, -1))
    N.t === void 0 || !(N.t > O) || (O = N.t, I.push(E(N.t, N.u, N.d + Y, b ? N.id : void 0)));
  return {
    edge: [a.id, c.id],
    variants: b && I.length > 1 ? [y, I] : [y]
  };
}
function Hi(r, t, e, { lambda: n = $s, mu: s = Wi, maxIterations: o = Vs } = {}) {
  let i = r.map((a, c) => ({ ray: { ...a }, index: c }));
  for (let a = 0; a < o && i.length > 0; a++) {
    const c = e(i.map(({ ray: h }) => [h.paper, Ls(h)]));
    if (!c) return;
    let f = !1;
    const l = /* @__PURE__ */ new Set();
    for (const [h, { ray: u }] of i.entries()) {
      const g = `e${t + h}`;
      let v = -1 / 0, d = 1 / 0, k = 0;
      for (const p of c.triangles) {
        const m = p.ids.indexOf(g);
        if (m < 0) continue;
        p.sign !== c.majority && k++;
        const w = p.geo[(m + 1) % 3], S = p.geo[(m + 2) % 3], E = Math.sign(
          ct(
            p.paper[m][0],
            p.paper[m][1],
            p.paper[(m + 1) % 3][0],
            p.paper[(m + 1) % 3][1],
            p.paper[(m + 2) % 3][0],
            p.paper[(m + 2) % 3][1]
          )
        ), y = ct(u.foot[0], u.foot[1], w[0], w[1], S[0], S[1]), A = ct(u.foot[0] + u.normal[0], u.foot[1] + u.normal[1], w[0], w[1], S[0], S[1]) - y, F = E * c.majority;
        if (A === 0) {
          y * F <= 0 && (v = 1 / 0);
          continue;
        }
        const R = -y / A;
        A * F > 0 ? v = Math.max(v, R) : d = Math.min(d, R);
      }
      if (!(v < d)) {
        l.add(h);
        continue;
      }
      const M = Math.min(Math.max(n * Math.max(v, u.protrusion), s * u.chord), (d - v) / 2), b = Math.max(v, 0) + M, x = Math.abs(b - u.height) > 1e-9 * u.chord;
      (k > 0 || x) && (x && (f = !0), u.height = b);
    }
    if (l.size > 0 && (i = i.filter((h, u) => !l.has(u)), f = !0), !f) break;
  }
  if (i.length !== 0)
    return { rays: i.map(({ ray: a }) => a), kept: i.map(({ index: a }) => a) };
}
function Ji(r, t) {
  const e = (i) => typeof i == "string" && i.startsWith("e") && Number(i.slice(1)) >= t ? Number(i.slice(1)) : void 0, n = /* @__PURE__ */ new Set();
  for (const { ids: i } of r.triangles)
    n.add(jt(i[0], i[1])), n.add(jt(i[0], i[2])), n.add(jt(i[1], i[2]));
  const s = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set();
  for (const [i, a] of r.hullEdges) {
    const c = n.has(jt(r.points[i].id, r.points[a].id));
    for (const f of [i, a]) {
      const l = e(r.points[f].id);
      l !== void 0 && (o.add(l), c || s.add(l));
    }
  }
  for (const i of r.points) {
    const a = e(i.id);
    a !== void 0 && !o.has(a) && s.add(a);
  }
  return s;
}
function Qi(r, t) {
  const e = { rounds: 0, builds: 0, cost: 0, budget: 0, batches: 0, perEdge: 0, multiPoint: 0 };
  let n = [], s = [], o = t, i = r.snapshot();
  const a = /* @__PURE__ */ new Set(), c = Ui * r.baseCost;
  e.budget = c;
  const f = r.buildCost();
  let l = 0;
  const h = () => l * ji + r.buildCost() - f, u = () => h() >= c, g = (b) => {
    if (!u())
      return e.builds++, l++, r.measure(b);
  }, v = (b) => [b.paper, Ls(b)], d = (b, x, p) => {
    const m = Hi(
      b.map(({ ray: w }) => w),
      x,
      (w) => g([...n, ...w]),
      { maxIterations: p }
    );
    return m?.rays.map((w, S) => ({ ray: w, edge: b[m.kept[S]].edge }));
  }, k = (b, x) => b.length === x.length && b.every(({ ray: p }, m) => Math.abs(p.height - x[m].ray.height) <= 1e-9 * p.chord), M = (b) => {
    if (b.length === 0 || n.length + b.length > fs) return !1;
    const x = r.edgeBase + n.length;
    let p = d(b, x, 1), m = !1;
    for (; p && p.length > 0 && !u(); ) {
      const w = [...n, ...p.map(({ ray: A }) => v(A))];
      e.builds++;
      const S = r.build(w, Math.max(1, Math.ceil(c - h()))), E = S ? Ji(S.analysis, x) : void 0;
      if (S && E.size === 0)
        return s = s.concat(
          p.map(({ ray: A, edge: F }, R) => ({
            node: x + R,
            kind: "hullEdge",
            edge: F,
            ...A.anchor === void 0 ? {} : { anchor: A.anchor }
          }))
        ), n = w, o = S, i = r.snapshot(), !0;
      if (r.restore(i), S && E.size < p.length) {
        p = p.filter((A, F) => !E.has(x + F));
        continue;
      }
      if (m) return !1;
      m = !0;
      const y = d(p, x, Vs);
      if (!y || k(y, p)) return !1;
      p = y;
    }
    return !1;
  };
  for (let b = 1; b <= qi && !u(); b++) {
    const { analysis: x } = o, p = [];
    for (const w of x.dropped) {
      const S = w.map((y) => x.points[y].paper.join(",")).join("|");
      if (a.has(S) || (a.add(S), n.length + p.length + 1 > fs)) continue;
      const E = Ki(x, w);
      E && p.push(E);
    }
    if (p.length === 0) break;
    e.rounds = b;
    const m = (w, S) => S.map((E) => ({ ray: E, edge: w.edge }));
    if (M(p.flatMap((w) => m(w, w.variants[0])))) {
      e.batches++;
      continue;
    }
    for (const w of p)
      for (const [S, E] of w.variants.entries()) {
        if (u()) break;
        if (M(m(w, E))) {
          e.perEdge++, S > 0 && e.multiPoint++;
          break;
        }
      }
  }
  return r.restore(i), e.cost = h(), { pairs: n, records: s, result: o.result, diagnostics: e };
}
function Xs(r, t) {
  const e = [r, t].map((n) => {
    const s = n.map((i, a, c) => {
      if (a === 0) return 0;
      const f = c[a - 1];
      return Math.sqrt(
        Math.pow(i[0] - f[0], 2) + Math.pow(i[1] - f[1], 2)
      );
    }), o = s.reduce((i, a, c) => c === 0 ? [0] : (i.push(i[c - 1] + a), i), []);
    return o.map((i, a, c) => {
      const f = i / c[c.length - 1];
      return [n[a], s[a], o[a], f];
    });
  });
  return e.map((n, s) => {
    const o = e[s ? 0 : 1];
    return n.filter((i, a) => !(a === 0 || a === n.length - 1 || i[4] === "handled")).flatMap((i) => {
      const a = i[0], c = i[3], f = o.reduce(
        (l, h, u, g) => {
          if (l) return l;
          const v = g[u + 1];
          if (h[3] === c)
            return h[4] = "handled", [h];
          if (h[3] < c && v && v[3] > c)
            return [h, v];
        },
        void 0
      );
      if (f && f.length === 1)
        return s === 0 ? [[a, f[0][0], c]] : [[f[0][0], a, c]];
      if (f && f.length === 2) {
        const l = f[0], h = f[1], u = (c - l[3]) / (h[3] - l[3]), g = [
          (h[0][0] - l[0][0]) * u + l[0][0],
          (h[0][1] - l[0][1]) * u + l[0][1]
        ];
        return s === 0 ? [[a, g, c]] : [[g, a, c]];
      }
      return [];
    });
  }).reduce((n, s) => n.concat(s), []).sort((n, s) => n[2] < s[2] ? -1 : 1);
}
const Zi = 5e-3, to = 0.999, ls = 1e-9, eo = (r, t) => {
  const e = Math.atan2(r[0] - t[0], r[1] - t[1]) * (180 / Math.PI);
  return e < 0 ? e + 360 : e;
};
function hs(r, t) {
  const e = Pe(r, t), n = eo(r, t) - e * 10;
  return n < ls ? [e, (e + 35) % 36] : n > 10 - ls ? [e, (e + 1) % 36] : [e];
}
function us(r, t) {
  let e = 0;
  for (let n = 0; n < r.length; n++) {
    const s = r[n], o = r[(n + 1) % r.length], i = Math.sign(ct(s[0], s[1], o[0], o[1], t[0], t[1]));
    if (i === 0) return !1;
    if (e === 0) e = i;
    else if (i !== e) return !1;
  }
  return e !== 0;
}
class vn {
  /** 両面の凸包（内側の点の全部で取る）と、凸包の辺の上にある頂点 */
  hull;
  hullVertices = /* @__PURE__ */ new Set();
  /** 対応点の外接矩形（紙の面）と、その端を与える頂点 */
  box;
  /** 区分ごとの、最も外側の点までの距離（点が無い区分は −1）と、その頂点 */
  binMax = new Array(36).fill(-1);
  binHolders = /* @__PURE__ */ new Set();
  /** 補助頂点の輪（地理面）と、扇形の中心 */
  ring;
  /** world file 外周の網では、地理面の中心を持たない（補助頂点の地理面の位置は、world file から直接決まる） */
  centroid;
  /** 内側の点（対応点と中継点）の紙の面の座標の和と数。帯を作ったときの平均 */
  sum = [0, 0];
  count = 0;
  mean0 = [0, 0];
  diagonal;
  constructor(t) {
    const { mesh: e } = t, n = (l) => e.vertices.get(l);
    this.ring = t.ring.map((l) => n(l).bakw);
    const s = [...t.gcps, ...t.nodeOrder()], o = new Set(t.supplements.map(({ vertex: l }) => l));
    for (const l of s)
      o.has(l) || (this.sum[0] += n(l).forw[0], this.sum[1] += n(l).forw[1], this.count++);
    this.mean0 = [this.sum[0] / this.count, this.sum[1] / this.count], this.centroid = t.centroid ?? { forw: [this.mean0[0], this.mean0[1]] };
    const i = (l) => {
      const h = te(s.map((u) => n(u)[l]));
      for (const [u, g] of h)
        this.hullVertices.add(s[u]), this.hullVertices.add(s[g]);
      return h.map(([u]) => n(s[u])[l]);
    };
    this.hull = { forw: i("forw"), bakw: i("bakw") };
    const a = t.gcps.map((l) => n(l).forw[0]), c = t.gcps.map((l) => n(l).forw[1]);
    this.box = {
      minx: Math.min(...a),
      maxx: Math.max(...a),
      miny: Math.min(...c),
      maxy: Math.max(...c)
    }, this.diagonal = Math.hypot(
      this.box.maxx - this.box.minx,
      this.box.maxy - this.box.miny
    );
    const f = new Array(36).fill(void 0);
    for (const l of s) {
      const { forw: h } = n(l), u = this.forwDistance(h);
      if (u !== 0)
        for (const g of hs(h, this.centroid.forw))
          u > this.binMax[g] && (this.binMax[g] = u, f[g] = l);
    }
    for (const l of f)
      l !== void 0 && this.binHolders.add(l);
  }
  /**
   * 判定できない網（補助頂点の輪が網の外周でない網）では null。
   *
   * world file 外周の網は、補助頂点の地理面の位置を world file から直接決め、囲みの拡大を通らないので、
   * C5・C6（地理面の輪との関係）は見ない。紙の面の条件（C2〜C4・C7）は、扇形の網と同じ。
   */
  static of(t) {
    if (!t.centroid && !t.isWorldFile || t.ring.length < 3) return null;
    const e = t.mesh.boundaryRing();
    if (!e || e.length !== t.ring.length) return null;
    const n = new Set(t.ring);
    return e.every((s) => n.has(s)) ? new vn(t) : null;
  }
  forwDistance(t) {
    return Math.hypot(
      t[0] - this.centroid.forw[0],
      t[1] - this.centroid.forw[1]
    );
  }
  /**
   * 地理面で、重心から輪までの距離に対する、重心から点までの距離の比（輪の内側なら 1 未満）。
   * 輪と交わらない方向なら Infinity。
   */
  ringRatio(t) {
    const e = this.centroid.bakw;
    if (!e) return 0;
    const n = t[0] - e[0], s = t[1] - e[1];
    let o = 1 / 0;
    for (let i = 0; i < this.ring.length; i++) {
      const a = this.ring[i], c = this.ring[(i + 1) % this.ring.length], f = c[0] - a[0], l = c[1] - a[1], h = f * s - l * n;
      if (h === 0) continue;
      const u = (f * (a[1] - e[1]) - l * (a[0] - e[0])) / h, g = (n * (a[1] - e[1]) - s * (a[0] - e[0])) / h;
      u > 0 && g >= 0 && g <= 1 && (o = Math.min(o, 1 / u));
    }
    return o;
  }
  /**
   * 編集が、帯を更新しなくてよい条件（C1〜C7）を全部満たすか。満たすなら、編集の後の座標の和と数を返す
   * （編集を当てた後に {@link commit} へ渡す）。満たさなければ undefined。網を動かす前に呼ぶ。
   */
  keeps(t, e) {
    const { box: n } = this;
    let s = this.sum[0], o = this.sum[1], i = this.count;
    for (const c of e) {
      if (c.vertex !== void 0) {
        const f = c.vertex, { forw: l, bakw: h } = t.mesh.vertices.get(f);
        if (this.hullVertices.has(f) || this.binHolders.has(f) || !(this.ringRatio(h) < to) || c.gcp && (l[0] === n.minx || l[0] === n.maxx || l[1] === n.miny || l[1] === n.maxy))
          return;
        c.counted && (s -= l[0], o -= l[1], i--);
      }
      if (c.to) {
        const { forw: f, bakw: l } = c.to;
        if (!us(this.hull.forw, f) || !us(this.hull.bakw, l) || c.gcp && !(f[0] > n.minx && f[0] < n.maxx && f[1] > n.miny && f[1] < n.maxy))
          return;
        const h = this.forwDistance(f);
        if (h > 0) {
          for (const u of hs(f, this.centroid.forw))
            if (!(h < this.binMax[u])) return;
        }
        if (!(this.ringRatio(l) < 1)) return;
        c.counted && (s += f[0], o += f[1], i++);
      }
    }
    if (!(i === 0 || !(Math.hypot(
      s / i - this.mean0[0],
      o / i - this.mean0[1]
    ) <= Zi * this.diagonal)))
      return { sum: [s, o], count: i };
  }
  /** 当てた編集を、算術平均に反映する（{@link keeps} が返した値を渡す）。 */
  commit(t) {
    this.sum = t.sum, this.count = t.count;
  }
}
const ds = (r, t, e) => Math.sign(ct(r[0], r[1], t[0], t[1], e[0], e[1]));
class no {
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
  /** 補完点の鍵の続き番号 */
  nextSupplement = 0;
  bandStats;
  /**
   * 帯（補助頂点・重心）を更新しなくてよいかを判定するための量（設計書 §6.3）。最初に要るときに 1 回だけ作る。
   * 判定できない網（world file 外周・補助頂点の輪が閉じなかった網）では null。
   */
  band() {
    return this.bandStats === void 0 && (this.bandStats = vn.of(this)), this.bandStats;
  }
  /** world file 外周の網か（補助頂点の地理面の位置を、world file から直接決める。扇形の中心を持たない）。 */
  get isWorldFile() {
    return this.context.outer?.outerTransform === "worldFile";
  }
  /**
   * world file 外周の網の、紙の面から地理面（網の内部の座標系）への写像。world file 外周でなければ undefined。
   * follow では、GCP と同じく、地理面の Y を反転する。
   */
  worldFileProjection() {
    const t = this.context.outer;
    if (t?.outerTransform !== "worldFile") return;
    const e = t.worldFile, n = this.context.yaxisMode === "follow";
    return (s) => {
      const [o, i] = Es(e, s);
      return [o, n ? -i : i];
    };
  }
  /**
   * world file 外周の網で、地理面の位置が world file の値（`worldFileProjection()(forw)`）と違う補助頂点の数。
   * world file 外周でなければ 0。全部組み直した compiled では、差は 0（同じ式で計算した値を、そのまま持つ）。
   */
  worldFileMismatches() {
    const t = this.worldFileProjection();
    if (!t) return 0;
    let e = 0;
    for (const n of this.ring) {
      const { forw: s, bakw: o } = this.mesh.vertices.get(n), i = t(s);
      (i[0] !== o[0] || i[1] !== o[1]) && e++;
    }
    return e;
  }
  /** 補完点の一覧（compiled の `supplementPairs` に、座標を付けたもの。`Tin#supplementPairs` と同じ形）。 */
  supplementPairs() {
    const t = this.indexTable();
    return this.supplements.map((e) => {
      const { forw: n, bakw: s } = this.mesh.vertices.get(e.vertex);
      return {
        node: Number(t.get(e.vertex).slice(1)),
        kind: e.kind,
        edge: e.edge.map((o) => t.get(o)),
        ...e.anchor === void 0 ? {} : { anchor: t.get(e.anchor) },
        forw: dt(n),
        bakw: dt(s)
      };
    });
  }
  /** 帯の判定のための量を捨てる（帯・凸包が変わったとき。次に要るときに作り直す）。 */
  resetBand() {
    this.bandStats = void 0;
  }
  /** 補助頂点の扇形の角度（compiled の `vertices_params`。紙の面・地理面）。world file 外周では undefined。 */
  verticesParams() {
    const t = this.centroid;
    if (t)
      return ["forw", "bakw"].map(
        (e) => this.ring.map((n) => {
          const s = this.mesh.vertices.get(n)[e];
          return Math.atan2(
            s[0] - t[e][0],
            s[1] - t[e][1]
          );
        })
      );
  }
  /** 対応点と必須エッジ（`setPoints`・`setEdges` に入れる形。座標は内部の座標系）と、その id の並び。 */
  inputs() {
    const t = (n) => this.mesh.vertices.get(n), e = new Map(this.gcps.map((n, s) => [n, s]));
    return {
      points: this.gcps.map((n) => [
        dt(t(n).forw),
        dt(t(n).bakw)
      ]),
      edges: this.edges.map((n) => [
        n.forwNodes.map(dt),
        n.bakwNodes.map(dt),
        [e.get(n.start), e.get(n.end)]
      ]),
      pointIds: this.gcps.map(
        (n) => t(n).ref.id
      ),
      edgeIds: this.edges.map((n) => n.id)
    };
  }
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
    const { mesh: t, context: e } = this, n = (l) => t.vertices.get(l), s = (l) => [
      dt(n(l).forw),
      dt(n(l).bakw)
    ], o = this.indexTable(), i = {};
    i.version = e.version, i.points = this.gcps.map(s), i.weight_buffer = {};
    const a = this.ring.map(s);
    if (e.outer?.outerTransform === "worldFile")
      i.outerTransform = "worldFile", i.worldFile = e.outer.worldFile, i.vertices_points = a;
    else {
      const l = this.centroid;
      i.centroid_point = [
        dt(l.forw),
        dt(l.bakw)
      ], i.vertices_params = this.verticesParams(), i.vertices_points = a;
    }
    const c = t.revision > 0, f = c ? t.isStrict() ? "strict" : "strict_error" : e.strict_status;
    return i.strict_status = f, i.tins_points = [
      [...t.triangles.values()].map(
        (l) => l.map((h) => o.get(h))
      )
    ], !c && f === "strict_error" && e.kinks_points && (i.kinks_points = e.kinks_points), i.yaxisMode = e.yaxisMode, i.vertexMode = e.vertexMode, i.strictMode = e.strictMode, e.bounds ? (i.bounds = e.bounds, i.boundsPolygon = e.boundsPolygon, e.hasXy && (i.xy = e.xy), e.hasWh && (i.wh = e.wh)) : i.wh = e.wh, i.edges = this.edges.map(
      (l) => [
        l.forwNodes.map(dt),
        l.bakwNodes.map(dt),
        [o.get(l.start), o.get(l.end)]
      ]
    ), i.edgeNodes = this.nodeOrder().map(s), this.supplements.length > 0 && (i.supplementPairs = this.supplements.map((l) => ({
      node: Number(o.get(l.vertex).slice(1)),
      kind: l.kind,
      edge: l.edge.map((h) => o.get(h)),
      ...l.anchor === void 0 ? {} : { anchor: o.get(l.anchor) }
    }))), e.outer?.outerTransform === "extrapolate" && (i.outerTransform = "extrapolate"), i;
  }
}
function gs(r, t, e = {}) {
  if (r.version !== void 0 && r.version < 3)
    return { reason: "v2" };
  if (r.strict_status === "loose" || r.tins_points.length !== 1)
    return { reason: "loose" };
  const n = r.outerTransform, s = n === "worldFile" && r.yaxisMode === "follow" ? 1 : -1, o = r.points, i = r.edgeNodes ?? [], a = r.vertices_points ?? [], c = o.length, f = (m) => {
    if (typeof m == "number") return o[m];
    const w = Number(m.slice(1));
    return m.startsWith("e") ? i[w] : m.startsWith("b") ? a[w] : void 0;
  };
  let l = 0, h = 0;
  for (const m of r.tins_points[0]) {
    const [w, S, E] = m.map(f);
    if (!w || !S || !E) return { reason: "inconsistent" };
    const y = ds(w[0], S[0], E[0]);
    h += y, l += y * ds(w[1], S[1], E[1]);
  }
  if ((l < 0 ? -1 : 1) !== s) return { reason: "orientation" };
  const u = new ze(s, h < 0 ? -1 : 1), g = new no(u, {
    version: r.version,
    yaxisMode: r.yaxisMode,
    vertexMode: r.vertexMode,
    strictMode: r.strictMode,
    bounds: r.bounds,
    boundsPolygon: r.boundsPolygon,
    xy: r.xy,
    wh: r.wh,
    hasXy: "xy" in r,
    hasWh: "wh" in r,
    outer: n === "worldFile" ? {
      outerTransform: "worldFile",
      worldFile: r.worldFile
    } : n === "extrapolate" ? { outerTransform: "extrapolate" } : void 0,
    strict_status: r.strict_status,
    kinks_points: r.kinks_points
  }), v = /* @__PURE__ */ new Map();
  o.forEach(([m, w], S) => {
    const E = e.points?.[S] ?? S, y = u.addVertex({ kind: "gcp", id: E }, m, w);
    g.gcps.push(y), g.pointVertex.set(E, y), v.set(S, y);
  });
  const d = r.edges ?? [];
  if (g.edges = d.map(
    ([m, w, [S, E]], y) => ({
      id: e.edges?.[y] ?? y,
      start: v.get(S),
      end: v.get(E),
      forwNodes: m.map(dt),
      bakwNodes: w.map(dt),
      nodes: []
    })
  ), g.edges.some(({ start: m, end: w }) => m === void 0 || w === void 0))
    return { reason: "inconsistent" };
  const k = /* @__PURE__ */ new Map();
  {
    let m = 0;
    for (const [, w] of t)
      w >= c ? k.has(w - c) || k.set(w - c, m) : m++;
    if (m !== g.edges.length) return { reason: "inconsistent" };
  }
  i.forEach(([m, w], S) => {
    const E = k.get(S);
    let y;
    if (E !== void 0) {
      const A = g.edges[E];
      y = u.addVertex(
        { kind: "edgeNode", edge: A.id, order: A.nodes.length },
        m,
        w,
        [Ce(A.id)]
      ), A.nodes.push(y);
    } else
      y = u.addVertex(
        { kind: "supplement", key: `s${g.nextSupplement++}` },
        m,
        w
      );
    v.set(`e${S}`, y);
  });
  for (const m of g.edges) {
    const w = Ce(m.id);
    u.vertices.get(m.start).groups.push(w), u.vertices.get(m.end).groups.push(w);
  }
  a.forEach(([m, w], S) => {
    const E = u.addVertex({ kind: "boundary", order: S }, m, w, [
      ie
    ]);
    g.ring.push(E), v.set(`b${S}`, E);
  });
  const M = new Map(
    (r.supplementPairs ?? []).map((m) => [m.node, m])
  );
  for (let m = 0; m < i.length; m++) {
    if (k.has(m)) continue;
    const w = M.get(m), S = w?.edge.map((E) => v.get(E));
    if (!w || !S || S.some((E) => E === void 0))
      return { reason: "inconsistent" };
    if (w.anchor !== void 0 && v.get(w.anchor) === void 0)
      return { reason: "inconsistent" };
    g.supplements.push({
      vertex: v.get(`e${m}`),
      kind: w.kind,
      edge: S,
      ...w.anchor === void 0 ? {} : { anchor: v.get(w.anchor) }
    });
  }
  if (r.centroid_point)
    g.centroid = {
      forw: dt(r.centroid_point[0]),
      bakw: dt(r.centroid_point[1])
    };
  else if (n !== "worldFile") return { reason: "inconsistent" };
  for (const m of r.tins_points[0]) {
    const [w, S, E] = m.map((y) => v.get(y));
    u.addTriangle(w, S, E);
  }
  const b = (m) => m < c ? v.get(m) : v.get(`e${m - c}`);
  for (const [m, w] of t) {
    const S = b(m), E = b(w);
    if (S === void 0 || E === void 0) return { reason: "inconsistent" };
    u.setFlag(S, E, $t);
  }
  const x = [...g.gcps, ...g.nodeOrder()], p = te(
    x.map((m) => u.vertices.get(m).forw)
  );
  for (const [m, w] of p)
    u.hasEdge(x[m], x[w]) && u.setFlag(x[m], x[w], Ot);
  return u.boundarySimple = u.computeBoundarySimple(), { model: g };
}
const so = 3, pt = (r) => ({ ok: !1, reason: r }), zs = { overlap: 0, forbidden: 0, polish: 0 }, ps = (r, t, e) => ct(r[0], r[1], t[0], t[1], e[0], e[1]), Ve = (r, t) => r[0] === t[0] && r[1] === t[1];
function Ye(r, t, e) {
  const n = (a) => r.vertices.get(a).forw, s = (a) => {
    const c = r.positive(a);
    return c !== void 0 && c.every((f, l) => ps(n(f), n(c[(l + 1) % 3]), t) >= 0);
  }, o = [e];
  let i = e;
  for (let a = 0; a <= r.triangles.size; a++) {
    const c = r.positive(i);
    if (!c) break;
    let f, l = !1;
    for (let h = 0; h < 3 && f === void 0; h++) {
      const u = c[h], g = c[(h + 1) % 3];
      ps(n(u), n(g), t) >= 0 || (l = !0, f = r.byEdge.get(at(u, g)).find((v) => v !== i));
    }
    if (!l) return { triangle: i, path: o };
    if (f === void 0) break;
    i = f, o.push(i);
  }
  for (const a of r.triangles.keys())
    if (s(a)) return { triangle: a, path: [a] };
}
function Ys(r, t, e) {
  const n = (i) => r.vertices.get(i).forw, s = /* @__PURE__ */ new Set([e]), o = [e];
  for (let i = 0; i < o.length; i++) {
    const a = r.triangles.get(o[i]);
    for (let c = 0; c < 3; c++) {
      const f = at(a[c], a[(c + 1) % 3]);
      if (!((r.edgeFlags.get(f) ?? 0) & ($t | Ot)))
        for (const l of r.byEdge.get(f)) {
          if (s.has(l)) continue;
          const h = r.positive(l);
          if (!h) continue;
          const [u, g, v] = h.map(n);
          Le(
            u[0],
            u[1],
            g[0],
            g[1],
            v[0],
            v[1],
            t[0],
            t[1]
          ) * Ds > 0 && (s.add(l), o.push(l));
        }
    }
  }
  return s;
}
function ms(r, t, e, n) {
  const s = Ye(r, t, n);
  if (!s) return;
  const o = (f) => r.vertices.get(f).forw, i = (f) => {
    const l = r.triangles.get(f);
    for (let h = 0; h < 3; h++) {
      const u = o(l[h]), g = o(l[(h + 1) % 3]);
      if (Be(t[0], t[1], e[0], e[1], u[0], u[1], g[0], g[1]))
        return !0;
    }
    return !1;
  }, a = /* @__PURE__ */ new Set([s.triangle]), c = [s.triangle];
  for (let f = 0; f < c.length; f++) {
    const l = r.triangles.get(c[f]);
    for (let h = 0; h < 3; h++)
      for (const u of r.byEdge.get(at(l[h], l[(h + 1) % 3])))
        a.has(u) || !i(u) || (a.add(u), c.push(u));
  }
  return a;
}
function qe(r, t, e) {
  if (e?.force) return () => r.resetBand();
  const n = r.band(), s = n?.keeps(r, t);
  if (!(!n || !s))
    return () => n.commit(s);
}
function Ue(r, t, e, n) {
  let s = t, o;
  for (let i = 0; i <= so; i++) {
    const a = r.replace(s, e);
    if (a.ok)
      return {
        ok: !0,
        mode: "replaced",
        removed: a.removed,
        added: a.added,
        grown: i,
        size: s.size,
        flips: a.flips,
        vertices: n
      };
    if (o ??= a.reason, a.reason === "tooLarge") break;
    s = r.grow(s);
  }
  return pt(o ?? "notDisk");
}
function je(r, t, e, n) {
  const { mesh: s } = r, o = (p) => e && p === e.vertex ? e : s.vertices.get(p), i = /* @__PURE__ */ new Set(), a = [], c = [], f = [], l = s.triangles.keys().next().value;
  if (l === void 0) return pt("unsupported");
  if (e) {
    const p = s.star(e.vertex);
    if (p.size === 0) return pt("unsupported");
    a.push({ vertex: e.vertex, to: e, gcp: !0, counted: !0 });
    for (const w of p) i.add(w);
    const m = s.vertices.get(e.vertex);
    if (!Ve(e.forw, m.forw)) {
      const w = Ye(s, e.forw, p.values().next().value);
      if (!w) return pt("pointOutside");
      if (s.triangles.get(w.triangle).some((S) => S !== e.vertex && Ve(s.vertices.get(S).forw, e.forw)))
        return pt("duplicate");
      if (!p.has(w.triangle)) {
        for (const S of w.path) i.add(S);
        for (const S of Ys(s, e.forw, w.triangle)) i.add(S);
      }
    }
  }
  if (e) {
    const p = new Set(t.map((m) => m.edge));
    for (const m of r.edges) {
      if (p.has(m) || m.nodes.length > 0 || m.start !== e.vertex && m.end !== e.vertex) continue;
      const w = m.start === e.vertex ? m.end : m.start, S = ms(s, s.vertices.get(w).forw, e.forw, l);
      if (!S) return pt("pointOutside");
      for (const E of S) i.add(E);
    }
  }
  const h = [];
  for (const p of t) {
    const { edge: m } = p;
    if (!p.fresh) {
      const F = [m.start, ...m.nodes, m.end];
      for (let R = 0; R + 1 < F.length; R++) f.push([F[R], F[R + 1]]);
      if (m.nodes.length === 0)
        for (const R of s.byEdge.get(at(m.start, m.end)) ?? []) i.add(R);
      for (const R of m.nodes) {
        for (const Y of s.byVertex.get(R)) i.add(Y);
        c.push(R), a.push({ vertex: R, gcp: !1, counted: !0 });
      }
    }
    if (p.drop) continue;
    const w = o(m.start), S = o(m.end), E = p.forwNodes.length > 0 || p.bakwNodes.length > 0, y = E ? Xs(
      [w.forw, ...p.forwNodes, S.forw],
      [w.bakw, ...p.bakwNodes, S.bakw]
    ).map(([F, R]) => [F, R]) : [];
    if (E && y.length === 0) return pt("unsupported");
    p.forwNodes = p.forwNodes.map(dt), p.bakwNodes = p.bakwNodes.map(dt), h.push({ spec: p, nodes: y });
    for (const [F, R] of y)
      a.push({ to: { forw: F, bakw: R }, gcp: !1, counted: !0 });
    const A = [w.forw, ...y.map(([F]) => F), S.forw];
    for (let F = 0; F + 1 < A.length; F++) {
      const R = ms(s, A[F], A[F + 1], l);
      if (!R) return pt("pointOutside");
      for (const Y of R) i.add(Y);
    }
  }
  if (f.length > 0) {
    const p = new Set(t.map((w) => w.edge)), m = /* @__PURE__ */ new Set();
    for (const w of r.edges) {
      if (p.has(w)) continue;
      const S = [w.start, ...w.nodes, w.end];
      for (let E = 0; E + 1 < S.length; E++) m.add(at(S[E], S[E + 1]));
    }
    for (let w = f.length - 1; w >= 0; w--)
      m.has(at(f[w][0], f[w][1])) && f.splice(w, 1);
  }
  const u = qe(r, a, n);
  if (!u) return pt("unsupported");
  const g = c.map((p) => s.vertices.get(p).ref), v = [], d = [], k = [], M = /* @__PURE__ */ new Map();
  for (const { spec: p, nodes: m } of h) {
    const { edge: w } = p, S = Ce(w.id);
    if (p.fresh)
      for (const A of [w.start, w.end]) {
        const { groups: F } = s.vertices.get(A);
        F.includes(S) || (F.push(S), k.push({ vertex: A, group: S }));
      }
    const E = m.map(
      ([A, F], R) => s.addVertex({ kind: "edgeNode", edge: w.id, order: R }, A, F, [S])
    );
    v.push(...E), M.set(p, E);
    const y = [w.start, ...E, w.end];
    for (let A = 0; A + 1 < y.length; A++)
      d.push([y[A], y[A + 1], $t]);
  }
  const b = {
    added: v,
    removed: g,
    moved: e ? [e.vertex] : []
  };
  let x;
  if (i.size === 0)
    if (!d.every(([p, m]) => s.hasEdge(p, m)))
      x = pt("constraint");
    else {
      for (const [p, m] of f) s.clearFlag(p, m, $t);
      for (const [p, m, w] of d) s.setFlag(p, m, w);
      s.revision++, x = { ok: !0, mode: "moved", removed: [], added: [], grown: 0, size: 0, flips: zs, vertices: b };
    }
  else
    x = Ue(
      s,
      i,
      {
        move: e ? /* @__PURE__ */ new Map([[e.vertex, { forw: e.forw, bakw: e.bakw }]]) : void 0,
        add: v,
        remove: c,
        release: f,
        constrain: d
      },
      b
    );
  if (!x.ok) {
    for (const p of v) s.dropVertex(p);
    for (const { vertex: p, group: m } of k) {
      const { groups: w } = s.vertices.get(p);
      w.splice(w.indexOf(m), 1);
    }
    return x;
  }
  u();
  for (const p of t) {
    const { edge: m } = p;
    if (p.drop) {
      const w = Ce(m.id);
      for (const S of [m.start, m.end]) {
        const { groups: E } = s.vertices.get(S), y = E.indexOf(w);
        y !== -1 && E.splice(y, 1);
      }
      m.nodes = [];
      continue;
    }
    m.nodes = M.get(p), m.forwNodes = p.forwNodes, m.bakwNodes = p.bakwNodes;
  }
  return x;
}
function ro(r, t, e, n) {
  const { mesh: s } = r, o = r.pointVertex.get(t);
  if (o === void 0) return pt("unknownPoint");
  const i = s.vertices.get(o), a = dt(e.forw ?? i.forw), c = dt(e.bakw ?? i.bakw), l = r.edges.filter(
    (h) => h.start === o || h.end === o
  ).filter((h) => h.nodes.length > 0).map(
    (h) => ({
      edge: h,
      fresh: !1,
      drop: !1,
      forwNodes: h.forwNodes,
      bakwNodes: h.bakwNodes
    })
  );
  if (l.length === 0 && Ve(a, i.forw)) {
    const h = qe(
      r,
      [{ vertex: o, to: { forw: a, bakw: c }, gcp: !0, counted: !0 }],
      n
    );
    if (!h) return pt("unsupported");
    const u = s.star(o);
    if (u.size === 0) return pt("unsupported");
    const g = (d) => d === o ? { ...i, bakw: c } : s.vertices.get(d);
    if ([...u].every((d) => {
      const [k, M, b] = s.triangles.get(d);
      return s.okNew(k, M, b, g);
    }))
      return s.relocate(o, a, c), h(), {
        ok: !0,
        mode: "moved",
        removed: [],
        added: [],
        grown: 0,
        size: u.size,
        flips: zs,
        vertices: { added: [], removed: [], moved: [o] }
      };
  }
  return je(r, l, { vertex: o, forw: a, bakw: c }, n);
}
function io(r, t, e, n, s, o) {
  const { mesh: i } = r;
  if (r.pointVertex.has(t)) return pt("idInUse");
  const a = i.triangles.keys().next().value;
  if (a === void 0) return pt("unsupported");
  const c = qe(
    r,
    [{ to: { forw: e, bakw: n }, gcp: !0, counted: !0 }],
    o
  );
  if (!c) return pt("unsupported");
  const f = Ye(i, e, a);
  if (!f) return pt("pointOutside");
  if (i.triangles.get(f.triangle).some((g) => Ve(i.vertices.get(g).forw, e)))
    return pt("duplicate");
  const h = i.addVertex({ kind: "gcp", id: t }, e, n), u = Ue(
    i,
    Ys(i, e, f.triangle),
    { add: [h] },
    { added: [h], removed: [], moved: [] }
  );
  return u.ok ? (c(), r.gcps.splice(s ?? r.gcps.length, 0, h), r.pointVertex.set(t, h), u) : (i.dropVertex(h), u);
}
function oo(r, t, e) {
  const { mesh: n } = r, s = r.pointVertex.get(t);
  if (s === void 0) return pt("unknownPoint");
  if (r.edges.some((f) => f.start === s || f.end === s) || r.supplements.some(
    (f) => f.edge.includes(s) || f.anchor === s
  ))
    return pt("unsupported");
  const o = qe(
    r,
    [{ vertex: s, gcp: !0, counted: !0 }],
    e
  );
  if (!o) return pt("unsupported");
  const i = n.star(s);
  if (i.size === 0) return pt("unsupported");
  const a = n.vertices.get(s).ref, c = Ue(
    n,
    i,
    { remove: [s] },
    { added: [], removed: [a], moved: [] }
  );
  return c.ok && (o(), r.gcps.splice(r.gcps.indexOf(s), 1), r.pointVertex.delete(t)), c;
}
function ao(r, t) {
  const { mesh: e } = r, n = r.pointVertex.get(t), s = [];
  if (n === void 0) return s;
  for (const o of [...r.supplements]) {
    if (!o.edge.includes(n) && o.anchor !== n) continue;
    const i = e.star(o.vertex), a = e.vertices.get(o.vertex).ref, c = Ue(
      e,
      i,
      { remove: [o.vertex] },
      { added: [], removed: [a], moved: [] }
    );
    if (s.push(c), !c.ok) break;
    r.supplements.splice(r.supplements.indexOf(o), 1), r.resetBand();
  }
  return s;
}
function co(r, t, e, n, s = [], o = [], i, a) {
  if (r.edges.some((u) => u.id === t)) return pt("idInUse");
  const c = r.pointVertex.get(e), f = r.pointVertex.get(n);
  if (c === void 0 || f === void 0 || c === f)
    return pt("unknownPoint");
  const l = {
    id: t,
    start: c,
    end: f,
    forwNodes: s.map(dt),
    bakwNodes: o.map(dt),
    nodes: []
  }, h = je(
    r,
    [{ edge: l, fresh: !0, drop: !1, forwNodes: s, bakwNodes: o }],
    void 0,
    a
  );
  return h.ok && r.edges.splice(i ?? r.edges.length, 0, l), h;
}
function fo(r, t, e) {
  const n = r.edges.find((o) => o.id === t);
  if (!n) return pt("unknownEdge");
  const s = je(
    r,
    [{ edge: n, fresh: !1, drop: !0, forwNodes: [], bakwNodes: [] }],
    void 0,
    e
  );
  return s.ok && r.edges.splice(r.edges.indexOf(n), 1), s;
}
function lo(r, t, e, n, s) {
  const o = r.edges.find((i) => i.id === t);
  return o ? je(
    r,
    [{ edge: o, fresh: !1, drop: !1, forwNodes: e, bakwNodes: n }],
    void 0,
    s
  ) : pt("unknownEdge");
}
function ho(r, t) {
  const { mesh: e } = r, n = r.worldFileProjection();
  if (!r.centroid && !n) return { ok: !1, reason: "bandNotAnnulus" };
  const s = (V) => e.vertices.get(V), o = new Set(r.supplements.map(({ vertex: V }) => V)), i = [...r.gcps, ...r.nodeOrder()], a = i.filter((V) => !o.has(V));
  if (a.length < 3) return { ok: !1, reason: "bandFailed" };
  let c = 0, f = 0;
  for (const V of a)
    c += s(V).forw[0], f += s(V).forw[1];
  const l = [c / a.length, f / a.length], h = e.triangles.keys().next().value, u = h === void 0 ? void 0 : Ye(e, l, h);
  if (!u) return { ok: !1, reason: "bandFailed" };
  const [g, v, d] = e.triangles.get(u.triangle).map(s), k = (v.forw[0] - g.forw[0]) * (d.forw[1] - g.forw[1]) - (d.forw[0] - g.forw[0]) * (v.forw[1] - g.forw[1]);
  if (k === 0) return { ok: !1, reason: "bandFailed" };
  const M = ((l[0] - g.forw[0]) * (d.forw[1] - g.forw[1]) - (d.forw[0] - g.forw[0]) * (l[1] - g.forw[1])) / k, b = ((v.forw[0] - g.forw[0]) * (l[1] - g.forw[1]) - (l[0] - g.forw[0]) * (v.forw[1] - g.forw[1])) / k, x = {
    forw: l,
    bakw: [
      g.bakw[0] + M * (v.bakw[0] - g.bakw[0]) + b * (d.bakw[0] - g.bakw[0]),
      g.bakw[1] + M * (v.bakw[1] - g.bakw[1]) + b * (d.bakw[1] - g.bakw[1])
    ]
  }, p = r.centroid?.forw ?? l, m = {};
  for (const V of ["forw", "bakw"])
    for (const [z] of te(a.map((X) => s(X)[V]))) {
      const X = s(a[z]);
      m[`${X.forw[0]}:${X.forw[1]}`] = { forw: X.forw, bakw: X.bakw };
    }
  const w = r.gcps.map((V) => s(V).forw[0]), S = r.gcps.map((V) => s(V).forw[1]), E = Math.min(...w), y = Math.max(...w), A = Math.min(...S), F = Math.max(...S), R = {
    convexBuf: m,
    centroid: x,
    allGcps: i.map((V) => ({ forw: s(V).forw, bakw: s(V).bakw })),
    minx: E,
    maxx: y,
    miny: A,
    maxy: F
  }, Y = n ? (V) => Ts(V, n) : t === "birdeye" ? Os : Fs, I = new Set(r.ring.map((V) => Pe(s(V).forw, p))), O = /* @__PURE__ */ new Set();
  for (let V = 0; V < 36; V++) I.has(V) || O.add(V);
  const N = r.ring.length <= 4 ? { cornersOnly: !0 } : O.size > 0 && r.ring.length < 36 ? { skipBins: O } : void 0, B = N ? [N, void 0] : [void 0], C = te(i.map((V) => s(V).forw)), P = r.ring.map((V) => s(V).ref), _ = y - E, T = F - A;
  let $ = "bandFailed";
  for (const V of B) for (const z of mn) {
    const X = Y(
      {
        ...R,
        ...V ? { ring: V } : {},
        minx: E - z * _,
        maxx: y + z * _,
        miny: A - z * T,
        maxy: F + z * T
      },
      !0
    );
    if (X.length < 4 || !X.every(({ bakw: H }) => H.every(Number.isFinite)) || !n && (!oe(X.map((H) => H.forw), x.forw, -1) || !oe(X.map((H) => H.bakw), x.bakw, 1)))
      continue;
    const U = { mesh: e, indexOf: /* @__PURE__ */ new Map(), interior: i, ring: r.ring }, q = Cs(U, { vertices: X, hull: C });
    if (!q.ok) {
      if (q.reason === "bandNotAnnulus") return { ok: !1, reason: "bandNotAnnulus" };
      $ = "bandFailed";
      continue;
    }
    return r.ring = U.ring, n || (r.centroid = x), r.resetBand(), {
      ok: !0,
      removed: q.removed,
      added: q.added,
      removedVertices: P,
      addedVertices: U.ring,
      margin: z
    };
  }
  return { ok: !1, reason: $ };
}
const $e = (r, t) => t ? [r[0], -1 * r[1]] : r;
function uo(r, t, e) {
  const n = r.points.slice(), s = r.pointIds.slice(), o = r.edges.map(
    ([u, g, [v, d]]) => ({ forwNodes: u, bakwNodes: g, start: r.pointIds[v], end: r.pointIds[d] })
  ), i = r.edgeIds.slice(), a = (u) => {
    const g = s.indexOf(u);
    if (g === -1) throw new Error(`applyEdits: 対応点 ${u} がありません`);
    return g;
  }, c = (u) => {
    const g = i.indexOf(u);
    if (g === -1) throw new Error(`applyEdits: 必須エッジ ${u} がありません`);
    return g;
  }, f = (u, g) => {
    if (u === void 0) return g;
    if (!Number.isInteger(u) || u < 0 || u > g)
      throw new Error(`applyEdits: position ${u} が範囲の外です`);
    return u;
  }, l = (...u) => {
    for (const g of u)
      if (!Array.isArray(g) || !Number.isFinite(g[0]) || !Number.isFinite(g[1]))
        throw new Error("applyEdits: 座標が有限の数ではありません");
  };
  for (const u of t)
    switch (u.type) {
      case "addPoint": {
        if (!Number.isInteger(u.id) || s.includes(u.id))
          throw new Error(`applyEdits: 対応点の id ${u.id} は使えません`);
        l(u.forw, u.bakw);
        const g = f(u.position, n.length);
        n.splice(g, 0, [u.forw, $e(u.bakw, e)]), s.splice(g, 0, u.id);
        break;
      }
      case "removePoint": {
        const g = a(u.id);
        if (o.some((v) => v.start === u.id || v.end === u.id))
          throw new Error(`applyEdits: 対応点 ${u.id} は必須エッジの端点です（先に必須エッジを外してください）`);
        n.splice(g, 1), s.splice(g, 1);
        break;
      }
      case "movePoint": {
        const g = a(u.id);
        u.forw && l(u.forw), u.bakw && l(u.bakw), n[g] = [
          u.forw ?? n[g][0],
          u.bakw ? $e(u.bakw, e) : n[g][1]
        ];
        break;
      }
      case "addEdge": {
        if (!Number.isInteger(u.id) || i.includes(u.id))
          throw new Error(`applyEdits: 必須エッジの id ${u.id} は使えません`);
        if (a(u.start), a(u.end), u.start === u.end) throw new Error("applyEdits: 必須エッジの両端が同じ対応点です");
        l(...u.forwNodes, ...u.bakwNodes);
        const g = f(u.position, o.length);
        o.splice(g, 0, { forwNodes: u.forwNodes, bakwNodes: u.bakwNodes, start: u.start, end: u.end }), i.splice(g, 0, u.id);
        break;
      }
      case "removeEdge": {
        const g = c(u.id);
        o.splice(g, 1), i.splice(g, 1);
        break;
      }
      case "replaceEdgeNodes": {
        const g = c(u.id);
        l(...u.forwNodes, ...u.bakwNodes), o[g] = { ...o[g], forwNodes: u.forwNodes, bakwNodes: u.bakwNodes };
        break;
      }
      default:
        throw new Error(`applyEdits: 編集の種類 ${u.type} は扱えません`);
    }
  const h = new Map(s.map((u, g) => [u, g]));
  return {
    points: n,
    pointIds: s,
    edges: o.map((u) => [
      u.forwNodes,
      u.bakwNodes,
      [h.get(u.start), h.get(u.end)]
    ]),
    edgeIds: i
  };
}
const ws = (r) => r === "duplicate" || r === "unknownPoint" || r === "unknownEdge" || r === "idInUse" ? "unsupported" : r;
function vs(r, t, e, n, s = !1) {
  const { mesh: o } = r, i = [...o.bad].sort((y, A) => y - A), a = /* @__PURE__ */ new Set(), c = /* @__PURE__ */ new Set(), f = (y) => JSON.stringify(y), l = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Set(), u = /* @__PURE__ */ new Set(), g = (y, A) => {
    switch (y.type) {
      case "addPoint":
        return io(r, y.id, y.forw, $e(y.bakw, e), y.position, A);
      case "removePoint":
        return oo(r, y.id, A);
      case "movePoint":
        return ro(
          r,
          y.id,
          { forw: y.forw, bakw: y.bakw ? $e(y.bakw, e) : void 0 },
          A
        );
      case "addEdge":
        return co(r, y.id, y.start, y.end, y.forwNodes, y.bakwNodes, y.position, A);
      case "removeEdge":
        return fo(r, y.id, A);
      case "replaceEdgeNodes":
        return lo(r, y.id, y.forwNodes, y.bakwNodes, A);
    }
  };
  let v = s && n !== void 0, d = !1;
  const k = (y) => {
    for (const A of y.removed)
      c.delete(A) || a.add(A);
    for (const A of y.added) c.add(A);
    for (const A of y.vertices.removed) l.set(f(A), A);
    for (const A of y.vertices.added) h.add(A);
    for (const A of y.vertices.moved) u.add(A);
  };
  for (const y of t) {
    let A = g(y);
    if (!A.ok && A.reason === "unsupported" && n && (r.centroid || r.isWorldFile)) {
      if (y.type === "removePoint")
        for (const F of ao(r, y.id)) {
          if (!F.ok) return { ok: !1, reason: ws(F.reason) };
          k(F), d = !0, v = !0;
        }
      A = g(y, { force: !0 }), A.ok && (v = !0);
    }
    if (!A.ok) return { ok: !1, reason: ws(A.reason) };
    k(A);
  }
  if (v) {
    const y = ho(r, n.vertexMode);
    if (!y.ok) return { ok: !1, reason: y.reason };
    for (const A of y.removed)
      c.delete(A) || a.add(A);
    for (const A of y.added) c.add(A);
    for (const A of y.removedVertices) l.set(f(A), A);
    for (const A of y.addedVertices) h.add(A);
  }
  const M = /* @__PURE__ */ new Map(), b = [];
  for (const y of u) {
    const A = o.vertices.get(y);
    A && !h.has(y) && M.set(f(A.ref), { ref: A.ref, forw: A.forw, bakw: A.bakw });
  }
  for (const y of h) {
    const A = o.vertices.get(y);
    if (!A) continue;
    const F = f(A.ref), R = { ref: A.ref, forw: A.forw, bakw: A.bakw };
    l.delete(F) ? M.set(F, R) : b.push(R);
  }
  const x = /* @__PURE__ */ new Set();
  for (const y of l.keys())
    M.has(y) && x.add(y);
  for (const y of x) l.delete(y);
  let p;
  const m = (y) => {
    p = p ? [Math.min(p[0], y[0]), Math.min(p[1], y[1]), Math.max(p[2], y[0]), Math.max(p[3], y[1])] : [y[0], y[1], y[0], y[1]];
  }, w = [];
  for (const y of c) {
    const A = o.triangles.get(y);
    if (!A) continue;
    const F = A.map((R) => {
      const Y = o.vertices.get(R);
      return m(Y.forw), Y.ref;
    });
    w.push({ id: y, vertices: F });
  }
  for (const { forw: y } of M.values()) m(y);
  const S = [...o.bad].sort((y, A) => y - A), E = S.length !== i.length || S.some((y, A) => y !== i[A]);
  return {
    ok: !0,
    refreshed: v,
    patch: {
      strict_status: o.isStrict() ? "strict" : "strict_error",
      // 帯を差し替えたときだけ、重心と補助頂点の扇形の値を入れる
      ...v && r.centroid ? {
        centroid: { forw: [...r.centroid.forw], bakw: [...r.centroid.bakw] },
        verticesParams: r.verticesParams()
      } : {},
      // 補完点の一覧が変わったときだけ入れる
      ...d ? { supplementPairs: r.supplementPairs() } : {},
      ...M.size > 0 ? { movedVertices: [...M.values()] } : {},
      ...l.size > 0 ? { removedVertices: [...l.values()] } : {},
      ...b.length > 0 ? { addedVertices: b } : {},
      removedTriangles: [...a],
      addedTriangles: w,
      ...E ? { badTriangles: S } : {},
      ...p ? { dirtyBounds: p } : {}
    }
  };
}
const bs = 2.00704, ys = 3.00001, go = 12, po = 4, xs = 1, ks = 4, mo = 8, wo = 24;
function vo(r) {
  if (r.size === 0) return [];
  if (r.size >= 36) return [[...r].sort((e, n) => e - n)];
  const t = [];
  for (let e = 0; e < 36; e++) {
    if (!r.has(e) || r.has((e + 35) % 36)) continue;
    const n = [e];
    for (let s = (e + 1) % 36; r.has(s); s = (s + 1) % 36) n.push(s);
    t.push(n);
  }
  return t;
}
const Ss = /* @__PURE__ */ Symbol("supplement pairs out of budget"), bo = 32, Ms = 1e-6, yo = 24;
class ot extends xn {
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
  /** 組み直しの繰り返しを局所の操作に置き換えるスイッチ（`Options#incrementalRebuild`）。 */
  incrementalRebuild;
  /** 帯に触れる編集を局所に当てるスイッチ（`Options#incrementalBand`）。 */
  incrementalBand;
  /** 局所の試行で作った三角網（採用したら、地理面の三角網を足して、交差の数え上げで確かめる）。 */
  localTins = /* @__PURE__ */ new WeakSet();
  /** 局所の試行の結果が、今の交差の数え上げと食い違ったので、今の手順だけで組み直している。 */
  localRebuildDisabled = !1;
  lastRebuildDiagnostics;
  /** 直近の `updateTin()` の、試行の内訳（`incrementalRebuild` を入れたときだけ）。 */
  get rebuildDiagnostics() {
    return this.tins ? this.lastRebuildDiagnostics : void 0;
  }
  mesh;
  meshFailure;
  /** 対応点・必須エッジの id（`points`・`edges` の並び）。undefined は、配列の添字が id。 */
  pointIds;
  edgeIds;
  /** `applyEdits` で進む版の番号。`setPoints` などで入力を入れ直すと 0 に戻る。 */
  editRevision = 0;
  /** 網が、`tins`・`points`・`edges` より先に進んでいる（局所更新を当てた後、まだ書き戻していない）。 */
  meshAhead = !1;
  /** 補助頂点・重心が最新でない（局所更新を当てた後、清書か帯の差し替えをするまで）。 */
  bandStale = !1;
  /** 今の三角網が、局所更新の網をそのまま保存した特例（`meshOrigin: "incremental"`）から来ているか。 */
  originIncremental = !1;
  /** 最後の全部組み直し・復元から重ねた、局所更新の回数。 */
  localEdits = 0;
  /**
   * 今の三角網の出どころ。`"incremental"` は、局所更新の網をそのまま保存した特例（読み込んだ compiled に
   * 印があった）。全部組み直す（`updateTin()`）と、印は外れる。
   */
  get meshOrigin() {
    return this.originIncremental ? "incremental" : void 0;
  }
  /**
   * 局所更新の網（今の三角網を取り込んだもの）。スイッチが切れている・三角網が無い・取り込めない網
   * （loose・V2 など。理由は `incrementalFailure`）のときは undefined。
   */
  get incrementalMesh() {
    return this.mesh;
  }
  /** 局所更新の網へ取り込めなかった理由（取り込めた・スイッチが切れているときは undefined）。 */
  get incrementalFailure() {
    return this.meshFailure;
  }
  /** `applyEdits` の版の番号。次の `applyEdits` に、前提として渡す。 */
  get revision() {
    return this.editRevision;
  }
  /** 網と、網から決まる状態を捨てる（入力や設定を入れ直したとき）。 */
  dropMesh() {
    this.mesh = void 0, this.meshFailure = void 0, this.meshAhead = !1, this.bandStale = !1, this.editRevision = 0, this.localEdits = 0;
  }
  /**
   * 局所更新を当てた網を、`points`・`edges`・`tins` などへ書き戻す（`transform()`・`getCompiled()` の前に
   * 自動で呼ばれる。全体を作り直すので、編集のたびには呼ばないこと。表示は `TinPatch` で足りる）。
   */
  syncFromMesh() {
    if (!this.meshAhead || !this.mesh) return;
    const t = this.mesh, e = t.toCompiled(), n = t.inputs(), { xy: s, wh: o } = this;
    super.setCompiled(e), Object.assign(this, { xy: s, wh: o }), delete this.kinks, this.pointsSet = void 0, this.pointIds = n.pointIds, this.edgeIds = n.edgeIds, this.supplementRecords = (e.supplementPairs ?? []).map((i) => ({
      ...i,
      edge: [...i.edge]
    })), this.pointsWeightBuffer = {}, this.compiledOuter?.outerTransform === "worldFile" && (this.compiledOuter = { ...this.compiledOuter, vertices_points: e.vertices_points }), this.meshAhead = !1;
  }
  /** 今の入力（対応点・必須エッジ。内部の座標系）と、その id の並び。 */
  currentInputs() {
    return this.meshAhead && this.mesh ? this.mesh.inputs() : {
      points: this.points,
      edges: this.edges ?? [],
      pointIds: this.pointIds ?? this.points.map((t, e) => e),
      edgeIds: this.edgeIds ?? (this.edges ?? []).map((t, e) => e)
    };
  }
  /**
   * 編集を当てる（MaplatTin#100 の第 2 段 a）。局所で済めば、網の差分を返す（`mode: "local"`）。済まなければ、
   * 編集を入力に当てて全部組み直し、その結果を返す（`mode: "full"`。理由は `fallbackReason`）。
   *
   * - `edits` は、全部が当たるか、全部組み直しか、のどちらか（一部だけ当たった網を返さない）。
   * - `baseRevision` が今の版（`revision`）と合わなければ、何も変えずに `"revisionMismatch"` を返す。
   *   呼び出し側は、最新の入力を `setPoints`・`setEdges` で入れ直して、`updateTin()` すること。
   * - 当てられない編集（id が無い・既に使われている・座標が有限でない）は、何も変えずに例外を投げる。
   * - 全部組み直しが例外を投げる入力（必須エッジが交差する・点が一直線、など）では、`updateTin()` と同じ
   *   例外を投げる。入力は編集の後の状態になり、三角網は無い。
   * - 局所で済むのは、スイッチ（`Options#incremental`）が入っていて、strict・strict_error の V3 の網で、
   *   帯（補助頂点・重心）を更新しなくてよい内側の編集だけ。
   * - 座標は、`setPoints` に渡すのと同じ、外の座標系（差分の座標は、compiled と同じ内部の座標系）。
   */
  applyEdits(t, e) {
    if (e !== void 0 && e !== this.editRevision)
      return {
        revision: this.editRevision,
        mode: "full",
        fallbackReason: "revisionMismatch",
        strict_status: this.strict_status,
        boundaryStale: this.bandStale
      };
    const n = this.yaxisMode === ot.YAXIS_FOLLOW, s = uo(this.currentInputs(), t, n);
    let o = "noMesh";
    if (this.mesh) {
      const a = this.bounds ? this.boundsPolygon : void 0;
      if (a && !s.points.every((c) => sn(c[0], a)))
        o = "unsupported";
      else {
        const c = vs(
          this.mesh,
          t,
          n,
          this.incrementalBand ? { vertexMode: this.vertexMode } : void 0
        );
        if (c.ok)
          return this.afterLocalEdit(
            c.patch.strict_status,
            !(c.refreshed || this.mesh.isWorldFile)
          ), { revision: this.editRevision, mode: "local", boundaryStale: this.bandStale, ...c.patch };
        o = c.reason;
      }
    }
    const i = this.editRevision + 1;
    return this.mesh = void 0, this.meshAhead = !1, this.points = s.points, this.edges = s.edges, this.edgeNodes = void 0, this.pointIds = s.pointIds, this.edgeIds = s.edgeIds, this.tins = void 0, this.indexedTins = void 0, this.editRevision = i, this.updateTin(), {
      revision: i,
      mode: "full",
      fallbackReason: o,
      strict_status: this.strict_status,
      boundaryStale: !1
    };
  }
  /** 紙の面と地理面の間で座標を変換する。局所更新を当てた後は、網から三角網を作り直してから変換する。 */
  transform(t, e, n) {
    return this.syncFromMesh(), super.transform(t, e, n);
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
    if (super(), t.bounds ? this.setBounds(t.bounds) : (this.setWh(t.wh), this.vertexMode = t.vertexMode || ot.VERTEX_PLAIN), this.strictMode = t.strictMode || ot.MODE_AUTO, this.yaxisMode = t.yaxisMode || ot.YAXIS_INVERT, this.importance = t.importance || 0, this.priority = t.priority || 0, this.stateFull = t.stateFull || !1, this.useV2Algorithm = t.useV2Algorithm ?? !1, this.useSupplementPairs = t.supplementPairs ?? !0, this.incremental = t.incremental ?? !1, this.incrementalRebuild = t.incrementalRebuild ?? !1, this.incrementalBand = t.incrementalBand ?? !1, t.outerTransform === "worldFile") {
      if (this.useV2Algorithm) throw new Error("V2 では world file 外周を使えません");
      if (!t.worldFile) throw new Error("worldFile が必要です");
      js(t.worldFile), this.requestedWorldFile = { ...t.worldFile };
    }
    t.points && this.setPoints(t.points), t.edges && this.setEdges(t.edges);
  }
  /**
   * フォーマットバージョンを取得します
   */
  getFormatVersion() {
    return this.useV2Algorithm ? bs : ys;
  }
  /**
   * 制御点（GCP: Ground Control Points）を設定します。
   * 指定した点群に合わせて内部のTINキャッシュをリセットします。
   */
  setPoints(t) {
    this.syncFromMesh(), this.yaxisMode === ot.YAXIS_FOLLOW && (t = t.map((e) => [
      e[0],
      [e[1][0], -1 * e[1][1]]
    ])), this.points = t, this.pointIds = void 0, this.originIncremental = !1, this.dropMesh(), this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * エッジ（制約線）を設定します。
   * 制約線を正規化した上で、依存するキャッシュをリセットします。
   */
  setEdges(t = []) {
    this.syncFromMesh(), this.edges = kn(t), this.edgeIds = void 0, this.dropMesh(), this.edgeNodes = void 0, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 境界ポリゴンを設定します
   */
  setBounds(t) {
    this.retireMesh(), this.bounds = t;
    let e = t[0][0], n = e, s = t[0][1], o = s;
    const i = [t[0]];
    for (let a = 1; a < t.length; a++) {
      const c = t[a];
      c[0] < e && (e = c[0]), c[0] > n && (n = c[0]), c[1] < s && (s = c[1]), c[1] > o && (o = c[1]), i.push(c);
    }
    i.push(t[0]), this.boundsPolygon = me([i]), this.xy = [e, s], this.wh = [n - e, o - s], this.vertexMode = ot.VERTEX_PLAIN, this.tins = void 0, this.indexedTins = void 0;
  }
  /** 設定を変える前に、局所更新を当てた網を入力へ書き戻して、網を捨てる（id の並びと版は保つ）。 */
  retireMesh() {
    this.syncFromMesh(), this.mesh = void 0, this.meshFailure = void 0, this.bandStale = !1;
  }
  /**
   * 現在の設定を永続化可能な形式にコンパイルします
   */
  getCompiled() {
    if (this.meshAhead && this.mesh) {
      const e = this.mesh.toCompiled();
      return this.originIncremental && (e.meshOrigin = "incremental"), e;
    }
    const t = {};
    if (t.version = this.useV2Algorithm ? bs : ys, t.points = this.points, t.weight_buffer = {}, this.compiledOuter?.outerTransform === "worldFile")
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
    }), this.strict_status === ot.STATUS_LOOSE ? (t.tins_points[1] = [], this.tins.bakw.features.map((e) => {
      t.tins_points[1].push(
        ["a", "b", "c"].map(
          (n) => e.properties[n].index
        )
      );
    })) : this.strict_status === ot.STATUS_ERROR && this.kinks?.bakw && (t.kinks_points = this.kinks.bakw.features.map(
      (e) => e.geometry.coordinates
    )), t.yaxisMode = this.yaxisMode, t.vertexMode = this.vertexMode, t.strictMode = this.strictMode, this.bounds ? (t.bounds = this.bounds, t.boundsPolygon = this.boundsPolygon, this.useV2Algorithm && (t.xy = this.xy, t.wh = this.wh)) : t.wh = this.wh, t.edges = this.edges ?? [], t.edgeNodes = this.edgeNodes ?? [], this.supplementRecords.length > 0 && (t.supplementPairs = this.supplementRecords.map((e) => ({
      ...e,
      edge: [...e.edge]
    }))), this.compiledOuter?.outerTransform === "extrapolate" && Object.assign(t, this.compiledOuter), this.originIncremental && (t.meshOrigin = "incremental"), t;
  }
  /** コンパイルされた設定を基底クラスで復元し、外周方式を次の生成にも引き継ぐ。 */
  setCompiled(t) {
    const e = "outerTransform" in t ? t : void 0;
    if (e?.outerTransform === "worldFile" && this.useV2Algorithm)
      throw new Error("V2 では world file 外周を使えません");
    const n = this.outerTransform === "worldFile" || e?.outerTransform === "worldFile";
    this.dropMesh(), this.pointIds = void 0, this.edgeIds = void 0, super.setCompiled(t), this.supplementRecords = (t.supplementPairs ?? []).map((s) => ({
      ...s,
      edge: [...s.edge]
    })), this.lastSupplementDiagnostics = void 0, n && (this.stateTriangle = void 0), this.requestedWorldFile = void 0, this.compiledOuter = void 0, e?.outerTransform === "worldFile" ? (this.requestedWorldFile = { ...e.worldFile }, this.compiledOuter = {
      outerTransform: "worldFile",
      worldFile: e.worldFile,
      vertices_points: e.vertices_points
    }) : e?.outerTransform === "extrapolate" && (this.compiledOuter = { outerTransform: "extrapolate" }), this.lastBoundaryDiagnostics = void 0, this.originIncremental = t.meshOrigin === "incremental";
  }
  /**
   * 保存した compiled から、三角網と局所更新の網を戻す（MaplatTin#100。設計書 §9.5 (c)）。三角形分割はしない。
   *
   * 局所更新の網をそのまま保存した特例（`meshOrigin: "incremental"`）の地図は、`updateTin()` で開くと、
   * 清書と同じ strict_error に戻る。この口で開けば、保存した strict な網から、局所更新を続けられる。
   * 印の無い（全部組み直しの）compiled も、同じように戻せる（`updateTin()` を待たずに編集を始められる）。
   *
   * 戻すのは、対応点・必須エッジ・中継点と補完点（中継点がどの必須エッジの何番目か）・三角形・補助頂点・
   * 重心・補助頂点の扇形。凸包の辺の印は、内側の点の紙の面の凸包の辺のうち、網の辺にあるものに付け直す。
   * 戻した網で、S1（全部の三角形が ok）・S2（外周が両面で単純）・S3（必須エッジが全部ある）と、
   * 補助頂点 3 点だけの三角形が無いことを、全部を数えて確かめる。
   *
   * 失敗したとき（理由を返す）は、`setCompiled(compiled)` をした状態（変換はできる）で、網は持たない。
   * 印（`meshOrigin`）は外れる。`strict_status` は、次の 3 通り:
   * - compiled が strict と名乗っていて、網を調べて strict でないと分かったとき（`"notStrict"`・`"boundary"`）は、
   *   strict_error になる（逆変換は断られる。交差の一覧 `kinks` は持たない）
   * - compiled が strict と名乗っていて、ほかの理由で断ったときは、未確定（undefined）になる
   * - compiled が strict_error・loose と名乗っていたときは、その値のまま残る
   *
   * スイッチが切れている（`"disabled"`）ときは、`setCompiled(compiled)` と同じ（印も `strict_status` も compiled のまま）。
   * `"v2"`（読む前に断る）のときは、状態に触らない。
   * 呼び出し側は、対応点と必須エッジを入れ直して `updateTin()` すること。
   *
   * @param compiled 保存した compiled（座標は内部の座標系。follow では地理面の Y が反転済み）
   * @param inputs 呼び出し側が持つ対応点・必須エッジ（`setPoints`・`setEdges` に渡すのと同じ、外の座標系）。
   *   渡すと、compiled と合うかを確かめる（follow の反転は、ここで掛ける。呼び出し側で compiled と直接比べないこと）
   */
  restoreMesh(t, e) {
    const n = (v) => (v !== "disabled" && (this.originIncremental = !1, this.strict_status === ot.STATUS_STRICT && (this.strict_status = v === "notStrict" || v === "boundary" ? ot.STATUS_ERROR : void 0)), { ok: !1, reason: v });
    if (this.useV2Algorithm && t.outerTransform === "worldFile")
      return { ok: !1, reason: "v2" };
    try {
      this.setCompiled(t);
    } catch {
      return this.tins = void 0, this.indexedTins = void 0, n("inconsistent");
    }
    if (!this.incremental) return n("disabled");
    const s = this.yaxisMode === ot.YAXIS_FOLLOW;
    if (e?.points && !(e.points.length === this.points.length && e.points.every(([d, k], M) => {
      const [b, x] = this.points[M];
      return d[0] === b[0] && d[1] === b[1] && k[0] === x[0] && (s ? -1 * k[1] : k[1]) === x[1];
    })) || e?.edges && JSON.stringify(kn(e.edges)) !== JSON.stringify(this.edges ?? []))
      return n("inputMismatch");
    const o = this.edgeNodes ?? [];
    let i;
    try {
      i = this.generatePointsSet().edges;
    } catch {
      return this.edgeNodes = o, n("inconsistent");
    }
    const a = this.edgeNodes ?? [];
    if (this.edgeNodes = o, !(a.length + this.supplementRecords.length === o.length && a.every((v, d) => v.every((k, M) => k[0] === o[d][M][0] && k[1] === o[d][M][1])))) return n("edgeNodes");
    const f = gs(t, i);
    if (!("model" in f)) return n(f.reason);
    const { model: l } = f, h = l.mesh.audit();
    if (h.nonManifoldEdges > 0 || h.orphanVertices > 0 || !h.indexMatches) return n("inconsistent");
    if (h.bad.length > 0 || h.forwFolds > 0) return n("notStrict");
    if (!h.boundarySimple) return n("boundary");
    if (h.missingRequired > 0) return n("requiredEdge");
    if (h.forbiddenBoundary > 0) return n("forbidden");
    const u = l.verticesParams(), g = t.vertices_params;
    return u && JSON.stringify(u) !== JSON.stringify(g) ? n("verticesParams") : l.worldFileMismatches() > 0 ? n("inconsistent") : (this.mesh = l, this.meshFailure = void 0, { ok: !0 });
  }
  /**
   * 帯（補助頂点・重心）を、今の内側の点から作り直す（保存の直前に、帯を最新にするために呼ぶ。設計書 §9.5 (a)）。
   * スイッチ `incrementalBand` が要る。成り立てば差分を返し、成り立たなければ（スイッチが切れている・網が無い・
   * どの余白でも strict な帯にならない）何も変えずに undefined を返す。
   */
  refreshBand() {
    if (!this.mesh || !this.incrementalBand) return;
    const t = vs(this.mesh, [], this.yaxisMode === ot.YAXIS_FOLLOW, { vertexMode: this.vertexMode }, !0);
    if (t.ok)
      return this.afterLocalEdit(t.patch.strict_status, !1), { revision: this.editRevision, mode: "local", boundaryStale: !1, ...t.patch };
  }
  /** 局所更新を当てた後の、Tin の状態の更新。 */
  afterLocalEdit(t, e) {
    this.meshAhead = !0, this.bandStale = e, this.tins = void 0, this.indexedTins = void 0, this.pointsSet = void 0, delete this.kinks, this.strict_status = t, this.editRevision++, this.localEdits++;
  }
  /**
   * 局所更新の網を、そのまま保存してよいかの証拠を集める（設計書 §9.5 の条件 (a)(b) と診断 (d)）。
   * 清書（別のインスタンスでの全部組み直し）が strict にならず、この網が strict のときに使う。
   *
   * 網の全部を数え直し（差分管理の値を信用しない）、書き出した compiled を Transform で読み直して対応点の往復を
   * 確かめ、今の交差の数え上げを両面で 1 件まで走らせる。全体を回るので、保存のときだけ呼ぶこと。網は変えない。
   * 帯が最新でないと条件を満たさないので、先に `refreshBand()` を呼ぶ。
   *
   * @param rebuild 同じ入力を全部組み直したときの状態と交差の件数（診断に写すだけ）
   */
  collectIncrementalEvidence(t) {
    const e = {
      eligible: !1,
      failed: [],
      boundaryFresh: !this.bandStale,
      badTriangles: 0,
      forwFolds: 0,
      nonManifoldEdges: 0,
      indexMatches: !1,
      boundarySimple: !1,
      missingRequiredEdges: 0,
      boundaryOnlyTriangles: 0,
      remainingForbiddenTriangles: 0,
      gcpRoundTrip: { forward: 1 / 0, backward: 1 / 0 },
      sweepKinks: 0,
      editsSinceRebuild: this.localEdits,
      ...t ? { rebuildStatus: t.status, rebuildKinks: t.kinks } : {}
    }, n = this.mesh;
    if (!n)
      return e.failed.push("noMesh"), e;
    const { mesh: s } = n, o = s.audit();
    e.badTriangles = o.bad.length, e.forwFolds = o.forwFolds, e.nonManifoldEdges = o.nonManifoldEdges, e.indexMatches = o.indexMatches && o.badMatches && o.orphanVertices === 0, e.boundarySimple = o.boundarySimple && n.worldFileMismatches() === 0, e.missingRequiredEdges = o.missingRequired, e.boundaryOnlyTriangles = o.forbiddenBoundary, e.remainingForbiddenTriangles = o.forbiddenEdge;
    const i = { ...n.toCompiled(), strict_status: "strict", meshOrigin: "incremental" }, a = new xn();
    try {
      a.setCompiled(JSON.parse(JSON.stringify(i)));
      let c = 0, f = 0;
      const l = i.yaxisMode === ot.YAXIS_FOLLOW;
      for (const [h, u] of i.points) {
        const g = l ? [u[0], -1 * u[1]] : u, v = a.transform(h, !1), d = a.transform(g, !0);
        c = Math.max(c, v ? Math.hypot(v[0] - g[0], v[1] - g[1]) : 1 / 0), f = Math.max(f, d ? Math.hypot(d[0] - h[0], d[1] - h[1]) : 1 / 0);
      }
      e.gcpRoundTrip = { forward: c, backward: f };
    } catch {
    }
    for (const c of ["forw", "bakw"]) {
      const f = [...s.triangles.values()].map((l) => {
        const h = l.map((u) => s.vertices.get(u)[c]);
        return [...h, h[0]];
      });
      e.sweepKinks += Te(f, 1).length;
    }
    return e.boundaryFresh || e.failed.push("boundaryStale"), (e.badTriangles > 0 || e.forwFolds > 0) && e.failed.push("badTriangles"), (e.nonManifoldEdges > 0 || !e.indexMatches) && e.failed.push("meshShape"), e.boundarySimple || e.failed.push("boundary"), e.missingRequiredEdges > 0 && e.failed.push("requiredEdge"), e.boundaryOnlyTriangles > 0 && e.failed.push("boundaryOnlyTriangles"), e.gcpRoundTrip.forward <= Ms && e.gcpRoundTrip.backward <= Ms || e.failed.push("gcpRoundTrip"), e.sweepKinks > 0 && e.failed.push("sweepKinks"), e.eligible = e.failed.length === 0, e.eligible && (e.compiled = i), e;
  }
  /**
   * 幅と高さを設定します
   */
  setWh(t) {
    this.retireMesh(), this.wh = t || [100, 100], this.xy = [0, 0], this.bounds = void 0, this.boundsPolygon = void 0, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 頂点モードを設定します
   */
  setVertexMode(t) {
    this.retireMesh(), this.vertexMode = t, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 厳密性モードを設定します
   */
  setStrictMode(t) {
    this.retireMesh(), this.strictMode = t, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 厳密なTINを計算します
   *
   * @param kinkLimit - forw / bakw それぞれで残す交差（kinks）の件数の上限
   *   （同じ位置の交差を 1 件に数えた件数）。届いた時点で数え上げをやめます
   */
  calculateStrictTin(t = Hn) {
    this.resolveStrictOverlaps(), this.detectStrictKinks(t);
  }
  /**
   * 順三角網から逆三角網を写し、重なりを辺の反転で解消する（`calculateStrictTin` の前半）。
   * 交差の判定（`strict_status`・`kinks`）はしない。補完点の置き場所を測る試行は、三角網の向きを読むだけなので
   * これだけを呼ぶ。
   */
  resolveStrictOverlaps() {
    const t = this.tins.forw.features.map(
      (s) => ln(s)
    );
    this.tins.bakw = bt(t);
    const e = {};
    this.tins.forw.features.forEach((s, o) => {
      const i = this.tins.bakw.features[o];
      Ps(e, { forw: s, bakw: i });
    });
    const n = (this.pointsSet?.forw.features ?? []).map(
      (s) => s.properties.target.index
    );
    Ti(
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
      return Te(s, t);
    });
    e[0].length === 0 && e[1].length === 0 ? (this.strict_status = ot.STATUS_STRICT, delete this.kinks) : (this.strict_status = ot.STATUS_ERROR, this.kinks = {
      forw: bt(e[0]),
      bakw: bt(e[1])
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
      const o = this.points[s][0], i = this.points[s][1], a = Dt(o, i, s);
      t.forw.push(a), t.bakw.push(Ht(a));
    }
    const e = [];
    let n = 0;
    this.edgeNodes = [], this.edges || (this.edges = []);
    for (let s = 0; s < this.edges.length; s++) {
      const o = this.edges[s][2], i = Object.assign([], this.edges[s][0]), a = Object.assign([], this.edges[s][1]);
      if (xo(o, this.points.length, s), i.length === 0 && a.length === 0) {
        e.push(o);
        continue;
      }
      i.unshift(this.points[o[0]][0]), i.push(this.points[o[1]][0]), a.unshift(this.points[o[0]][1]), a.push(this.points[o[1]][1]), Xs(i, a).forEach((c, f, l) => {
        this.edgeNodes[n] = [
          c[0],
          c[1]
        ];
        const h = Dt(
          c[0],
          c[1],
          `e${n}`
        );
        n++, t.forw.push(h), t.bakw.push(Ht(h)), f === 0 ? e.push([o[0], t.forw.length - 1]) : e.push([
          t.forw.length - 2,
          t.forw.length - 1
        ]), f === l.length - 1 && e.push([t.forw.length - 1, o[1]]);
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
    if (!this.points.reduce((c, f) => c && (o ? sn(f[0], o) : f[0][0] >= t && f[0][0] <= e && f[0][1] >= n && f[0][1] <= s), !0))
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
    if (this.meshAhead && this.mesh) {
      const t = this.mesh.inputs();
      this.points = t.points, this.edges = t.edges, this.pointIds = t.pointIds, this.edgeIds = t.edgeIds, this.edgeNodes = void 0;
    }
    if (this.mesh = void 0, this.meshFailure = void 0, this.meshAhead = !1, this.bandStale = !1, this.rebuildAll(), this.incremental) {
      const t = gs(this.getCompiled(), this.pointsSet.edges, {
        points: this.pointIds,
        edges: this.edgeIds
      });
      "model" in t ? this.mesh = t.model : this.meshFailure = t.reason;
    }
  }
  /** 三角網を最初から全部組む（`updateTin()` の本体）。 */
  rebuildAll() {
    this.originIncremental = !1, this.localEdits = 0, this.lastBoundaryDiagnostics = void 0, this.supplementRecords = [], this.attemptTotal = 0, this.lastSupplementDiagnostics = void 0;
    let t = this.strictMode;
    t !== ot.MODE_STRICT && t !== ot.MODE_LOOSE && (t = ot.MODE_AUTO);
    const e = !this.useV2Algorithm, n = this.requestedWorldFile;
    if (n && !e) throw new Error("V2 では world file 外周を使えません");
    let s, o, i, a, c;
    if (e) {
      if (this.bounds) {
        const P = this.boundsPolygon;
        if (!P) throw new Error("Internal error: bounds is set but boundsPolygon is missing");
        if (!this.points.every(
          (T) => sn(T[0], P)
        )) throw "SOME POINTS OUTSIDE";
      }
      s = this.generatePointsSet(), { minx: o, maxx: i, miny: a, maxy: c } = this.computeGcpBbox();
    } else {
      const P = this.validateAndPrepareInputs();
      s = P.pointsSet, o = P.minx, i = P.maxx, a = P.miny, c = P.maxy;
    }
    const f = {
      forw: bt([...s.forw]),
      bakw: bt([...s.bakw])
    }, l = _e(
      f.forw,
      s.edges,
      "target"
    ), h = _e(
      f.bakw,
      s.edges,
      "target"
    );
    if (l.features.length === 0 || h.features.length === 0)
      throw "TOO LINEAR1";
    const u = kr(f.forw), g = Ln(f.forw);
    if (!g) throw "TOO LINEAR2";
    const v = {}, d = g.geometry.coordinates[0];
    let k;
    try {
      k = d.map((P) => ({
        forw: P,
        bakw: We(Zt(P), l)
      })), k.forEach((P) => {
        v[`${P.forw[0]}:${P.forw[1]}`] = P;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const M = Ln(f.bakw);
    if (!M) throw "TOO LINEAR2";
    const b = M.geometry.coordinates[0];
    try {
      k = b.map((P) => ({
        bakw: P,
        forw: We(Zt(P), h)
      })), k.forEach((P) => {
        v[`${P.forw[0]}:${P.forw[1]}`] = P;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const x = {
      forw: u.geometry.coordinates,
      bakw: We(u, l)
    }, p = Dt(x.forw, x.bakw, "c");
    this.centroid = {
      forw: p,
      bakw: Ht(p)
    };
    const m = [
      ...this.points.map((P) => ({ forw: P[0], bakw: P[1] })),
      ...(this.edgeNodes ?? []).map((P) => ({ forw: P[0], bakw: P[1] }))
    ], w = {
      convexBuf: v,
      centroid: x,
      allGcps: m,
      minx: o,
      maxx: i,
      miny: a,
      maxy: c
    }, S = t === ot.MODE_STRICT || t === ot.MODE_AUTO, E = (P, _, T) => {
      if (!S || this.isStrict() || !P.boundary) return { result: P };
      const $ = () => ({
        build: this.captureBuild(),
        raw: [s.forw.slice(), s.bakw.slice()],
        gcps: m.slice(),
        edgeNodes: this.edgeNodes.slice(),
        supplementRecords: this.supplementRecords,
        supplementDiagnostics: this.lastSupplementDiagnostics
      }), V = (K) => {
        s.forw.splice(0, s.forw.length, ...K.raw[0]), s.bakw.splice(0, s.bakw.length, ...K.raw[1]), m.splice(0, m.length, ...K.gcps), this.edgeNodes.splice(0, this.edgeNodes.length, ...K.edgeNodes), this.restoreBuild(K.build), this.supplementRecords = K.supplementRecords, this.lastSupplementDiagnostics = K.supplementDiagnostics;
      }, z = $(), X = this.attemptTotal, U = () => this.attemptTotal - X, q = (K, Q) => {
        const nt = Q.map(([L]) => L), D = Q.map(([, L]) => L);
        return (K[0] === Math.min(...nt) || K[0] === Math.max(...nt)) && (K[1] === Math.min(...D) || K[1] === Math.max(...D));
      }, H = (K) => {
        s.forw.splice(0, s.forw.length, ...z.raw[0]), s.bakw.splice(0, s.bakw.length, ...z.raw[1]), m.splice(0, m.length, ...z.gcps), this.edgeNodes.splice(0, this.edgeNodes.length, ...z.edgeNodes), this.supplementRecords = [];
        const Q = T(K);
        return { built: Q, strict: Q.boundary !== void 0 && this.isStrict() };
      }, W = /* @__PURE__ */ new Set(), J = P.boundary.vertices.map(({ forw: K }) => K), tt = new Set(
        J.filter((K) => !q(K, J)).map((K) => Pe(K, x.forw))
      );
      try {
        let K = P;
        for (let Q = 0; Q < po && !(U() + _ >= ks * _); Q++) {
          const nt = K.boundary.vertices.map(({ forw: j }) => j), D = W.size;
          for (const j of si(this.tins.forw)) {
            if (q(j, nt)) continue;
            const rt = Pe(j, x.forw);
            for (let it = -xs; it <= xs; it++) W.add((rt + it + 36) % 36);
          }
          if (W.size === D || W.size >= wo) break;
          const L = H({ skipBins: new Set(W) });
          if (!L.built.boundary)
            return V(z), { result: P };
          if (L.strict) {
            let j = { result: L.built, state: $() };
            for (const rt of vo(W)) {
              if (!rt.some((Pt) => tt.has(Pt))) continue;
              if (U() >= mo * _) break;
              const it = new Set([...W].filter((Pt) => !rt.includes(Pt))), gt = H({ skipBins: it });
              if (gt.strict) {
                for (const Pt of rt) W.delete(Pt);
                j = { result: gt.built, state: $() };
              }
            }
            return V(j.state), { result: j.result, kind: "thinned" };
          }
          K = L.built;
        }
        if (U() < ks * _) {
          const Q = H({ cornersOnly: !0 });
          if (Q.strict) return { result: Q.built, kind: "corners" };
        }
      } catch {
      }
      return V(z), { result: P };
    }, y = this.incrementalRebuild && !this.localRebuildDisabled && S, A = {
      fullAttempts: 0,
      localAttempts: 0,
      localFailures: 0,
      localMs: 0,
      adoptedLocal: !1,
      fellBack: this.localRebuildDisabled
    };
    this.lastRebuildDiagnostics = this.incrementalRebuild ? A : void 0;
    let F;
    const R = s.forw.length, Y = (P, _, T, $, V) => {
      const z = P ? { ...w, ring: P } : w, X = i - o, U = c - a, q = te(s.forw.map(({ geometry: nt }) => nt.coordinates)), H = q.filter((nt) => !_.has(le(nt))), W = s.forw.slice(R).map((nt) => ({
        index: nt.properties.target.index,
        forw: nt.geometry.coordinates,
        bakw: nt.properties.target.geom
      }));
      let J;
      for (const nt of mn) {
        const D = T.get(nt) ?? { forwReuse: {} };
        T.set(nt, D);
        const L = D.vertices ?? (D.vertices = $({
          ...z,
          minx: o - nt * X,
          maxx: i + nt * X,
          miny: a - nt * U,
          maxy: c + nt * U
        }, !0));
        if (V) {
          if (L.length < 4 || !L.every(({ bakw: gt }) => gt.every(Number.isFinite))) continue;
        } else if (
          // 扇形の境界には、地図面で時計回り、地理面で反時計回りの星形が必要（searchBoundary と同じ）
          !oe(L.map((gt) => gt.forw), x.forw, -1) || !oe(L.map((gt) => gt.bakw), x.bakw, 1)
        ) continue;
        const j = Xi(F), rt = Cs(j, { vertices: L, addPoints: W, hull: H, forwOnly: !0 });
        if (!rt.ok) continue;
        j.mesh.repairBad(), j.mesh.bad.size > 0 && j.mesh.bad.size <= bo && j.mesh.healBad();
        const it = Yi(j);
        if (!(V && it > 0) && ((!J || it < J.flips) && (J = { build: j, vertices: L, margin: nt, flips: it, applied: rt.applied }), it === 0))
          break;
      }
      if (!J) return;
      const tt = {
        forw: J.vertices.map(({ forw: nt, bakw: D }, L) => Dt(nt, D, `b${L}`)),
        bakw: []
      };
      tt.bakw = tt.forw.map(Ht), this.pointsSet = {
        forw: bt([...s.forw, ...tt.forw]),
        bakw: bt([...s.bakw, ...tt.bakw]),
        edges: s.edges
      };
      const K = Ke(zi(J.build));
      this.tins = { forw: K }, this.localTins.add(this.tins), this.strict_status = J.build.mesh.isStrict() ? ot.STATUS_STRICT : ot.STATUS_ERROR, delete this.kinks;
      const { mesh: Q } = J.build;
      return {
        boundary: {
          vertices: J.vertices,
          forw: K,
          bakw: K,
          diagnostics: {
            margin: J.margin,
            boundaryTriangleFlips: J.flips,
            remainingForbiddenTriangles: Q.forbiddenBoundary + Q.forbiddenEdge
          },
          hasMapBoundary: !0,
          hasBoundary: !0,
          forwHull: { all: q, applied: J.applied }
        },
        verticesList: tt
      };
    }, I = (P) => {
      if (!this.localTins.has(this.tins) || (A.adoptedLocal = !0, this.tins.bakw = bt(this.tins.forw.features.map(($) => ln($))), this.tins.forw.features.every(($) => {
        const { a: V, b: z, c: X } = $.properties, [U, q, H] = $.geometry.coordinates[0];
        return Math.sign(ct(U[0], U[1], q[0], q[1], H[0], H[1])) * Math.sign(ct(V.geom[0], V.geom[1], z.geom[0], z.geom[1], X.geom[0], X.geom[1])) === P;
      }) && ["forw", "bakw"].every(
        ($) => Te(
          this.tins[$].features.map((V) => V.geometry.coordinates[0]),
          1
        ).length === 0
      ) && this.isStrict())) return !0;
      this.localRebuildDisabled = !0;
      try {
        this.rebuildAll();
      } finally {
        this.localRebuildDisabled = !1;
      }
      return !1;
    };
    if (n) {
      this.stateTriangle = void 0;
      const P = this.yaxisMode === ot.YAXIS_FOLLOW, _ = P ? 1 : -1, T = (W) => {
        const [J, tt] = Es(n, W);
        return [J, P ? -tt : tt];
      }, $ = (W) => Ts(W, T), V = (W) => this.buildWithSupplements(t, s, m, (J, tt, K) => (Q) => {
        if (F) {
          const nt = performance.now(), D = Y(W, Q, J, $, !0);
          if (A.localMs += performance.now() - nt, D)
            return A.localAttempts++, { boundary: D.boundary };
          A.localFailures++;
        }
        return A.fullAttempts++, { boundary: Un(
          W ? { ...w, ring: W } : w,
          $,
          s,
          this.points.length,
          {
            orientation: _,
            accept: (nt) => nt.hasMapBoundary ? (y && !F && !W && !K && Q.size === 0 && s.forw.length === R && nt.hasBoundary && (F = cs(
              [...s.forw, ...nt.vertices.map(({ forw: D, bakw: L }, j) => Dt(D, L, `b${j}`))],
              nt.forw,
              s.edges,
              this.points.length,
              _
            )), this.buildTin(s, nt.vertices, tt, nt, Q.size > 0, K), (this.strict_status !== ot.STATUS_LOOSE || nt.hasBoundary) && Re(this.tins.forw, _) === 0 && Re(this.tins.bakw, _) === 0) : !1
          },
          Q,
          J
        ) };
      }), z = this.attemptTotal, X = V(), U = this.attemptTotal - z, { result: { boundary: q }, kind: H } = E(X, U, V);
      if (F = void 0, q) {
        if (!I(_)) return;
        this.compiledOuter = {
          outerTransform: "worldFile",
          worldFile: n,
          vertices_points: q.vertices.map(({ forw: Q, bakw: nt }) => [Q, nt])
        };
        const { centroid: W, xy: J, wh: tt, kinks: K } = this;
        super.setCompiled(this.getCompiled()), Object.assign(this, { centroid: W, xy: J, wh: tt, kinks: K }), this.lastBoundaryDiagnostics = {
          ...q.diagnostics,
          ...H ? { ringRescue: H } : {},
          requestedOuterTransform: "worldFile",
          outerTransform: "worldFile"
        };
        return;
      }
      this.compiledOuter = { outerTransform: "extrapolate" }, this.outerTransform = "extrapolate", this.worldFile = void 0;
    }
    const O = this.vertexMode === ot.VERTEX_BIRDEYE ? Os : Fs;
    let N, B, C;
    if (e) {
      const P = (V) => this.buildWithSupplements(t, s, m, (z, X, U) => (q) => {
        if (F) {
          const tt = performance.now(), K = Y(V, q, z, O, !1);
          if (A.localMs += performance.now() - tt, K)
            return A.localAttempts++, K;
          A.localFailures++;
        }
        A.fullAttempts++;
        const H = V ? { ...w, ring: V } : w, W = Un(
          H,
          O,
          s,
          this.points.length,
          void 0,
          q,
          z
        );
        return y && !F && !V && !U && q.size === 0 && s.forw.length === R && W?.hasBoundary && (F = cs(
          [...s.forw, ...W.vertices.map(({ forw: tt, bakw: K }, Q) => Dt(tt, K, `b${Q}`))],
          W.forw,
          s.edges,
          this.points.length,
          -1
        )), {
          boundary: W,
          verticesList: this.buildTin(
            s,
            W?.vertices ?? O(H, !1),
            X,
            W,
            q.size > 0,
            U
          )
        };
      }), _ = this.attemptTotal, T = P(), $ = E(T, this.attemptTotal - _, P);
      if ({ boundary: N, verticesList: B } = $.result, C = $.kind, !I(-1)) return;
    } else
      B = this.buildTin(
        s,
        O(w, !1),
        t,
        void 0
      );
    this.vertices_params = {
      forw: Yn(B.forw, this.centroid.forw),
      bakw: Yn(B.bakw, this.centroid.bakw)
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
  buildWithSupplements(t, e, n, s) {
    let o = 0;
    const i = (w, S, E) => {
      const y = s(w, S, E);
      return (A) => (o++, this.attemptTotal++, y(A));
    }, a = (w) => this.buildWithHull(w, i(/* @__PURE__ */ new Map(), w, !1));
    if (!this.useSupplementPairs || this.useV2Algorithm || t === ot.MODE_LOOSE) return a(t);
    const c = t, f = a(c), l = o;
    let h = 0;
    if (!f.boundary || this.strict_status !== ot.STATUS_STRICT) return f;
    const u = fn(this.tins.forw, this.pointsSet.forw.features, f.boundary.forwHull.all);
    if (u.dropped.length === 0) return f;
    const g = this.edgeNodes.length, v = e.forw.length, d = n.length;
    let k = [], M;
    const b = (w, S) => w.length === S.length && w.every((E, y) => E.every((A, F) => A[0] === S[y][F][0] && A[1] === S[y][F][1])), x = (w) => {
      e.forw.length = v, e.bakw.length = v, n.length = d, this.edgeNodes.length = g;
      for (const [S, E] of w) {
        const y = Dt(S, E, `e${this.edgeNodes.length}`);
        this.edgeNodes.push([S, E]), e.forw.push(y), e.bakw.push(Ht(y)), n.push({ forw: S, bakw: E });
      }
      k = w;
    }, m = Qi({
      edgeBase: g,
      baseCost: l,
      buildCost: () => h,
      snapshot: () => ({ pairs: k, state: this.captureBuild() }),
      restore: ({ pairs: w, state: S }) => {
        x(w), this.restoreBuild(S);
      },
      measure: (w) => {
        x(w);
        const S = this.captureBuild();
        try {
          const E = /* @__PURE__ */ new Map();
          M = { pairs: w, cache: E };
          const { boundary: y } = s(E, ot.MODE_STRICT, !0)(/* @__PURE__ */ new Set());
          return y ? fn(this.tins.forw, this.pointsSet.forw.features, []) : void 0;
        } finally {
          this.restoreBuild(S);
        }
      },
      build: (w, S) => {
        x(w);
        const E = M && b(M.pairs, w) ? M.cache : /* @__PURE__ */ new Map(), y = o;
        let A;
        try {
          A = this.buildWithHull(c, (F) => {
            if (o - y >= S) throw Ss;
            return i(E, c, !1)(F);
          });
        } catch (F) {
          if (F !== Ss) throw F;
          h += o - y;
          return;
        }
        if (h += o - y, !(!A.boundary || this.strict_status !== ot.STATUS_STRICT))
          return {
            result: A,
            analysis: fn(this.tins.forw, this.pointsSet.forw.features, A.boundary.forwHull.all)
          };
      }
    }, { result: f, analysis: u });
    return this.supplementRecords = m.records, this.lastSupplementDiagnostics = m.diagnostics, m.result;
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
    const o = (d) => [...d].sort().join(","), i = (d, k = !1) => {
      const M = o(d), b = n.get(M);
      if (b) return b;
      const x = e(d), p = {
        value: x,
        strict: x.boundary !== void 0 && this.strict_status === ot.STATUS_STRICT
      };
      return (p.strict || k) && (p.state = this.captureBuild()), n.set(M, p), s = p, p;
    }, a = (d) => (s !== d && this.restoreBuild(d.state), s = d, d.value), c = i(/* @__PURE__ */ new Set(), !0);
    if (!(t === ot.MODE_STRICT || t === ot.MODE_AUTO) || !c.value.boundary || c.strict) return c.value;
    const l = new Set(c.value.boundary.forwHull.all.map(le)), h = () => this.pointsSet.forw.features.map(
      (d) => d.properties.target.index
    ), u = /* @__PURE__ */ new Set();
    let g = c, v;
    for (let d = 0; d < go; d++) {
      const k = Ci(
        this.tins.forw,
        g.value.boundary.forwHull.applied,
        h()
      ).filter((M) => !u.has(le(M)));
      if (k.length === 0) break;
      for (const M of k) u.add(le(M));
      if (g = i(u), !g.value.boundary) break;
      if (g.strict) {
        v = g;
        break;
      }
    }
    if (v) {
      let d = v;
      for (const k of [...u].slice(0, yo)) {
        const M = new Set(u);
        M.delete(k);
        const b = i(M);
        b.strict && (u.delete(k), d = b);
      }
      return a(d);
    }
    if (u.size < l.size) {
      const d = i(l);
      if (d.strict) return a(d);
    }
    return a(c);
  }
  /** 今の三角網が strict か（組み立ての途中で `strict_status` が変わるので、型の絞り込みを避けて読む）。 */
  isStrict() {
    return this.strict_status === ot.STATUS_STRICT;
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
      const f = e[c].forw, l = e[c].bakw, h = Dt(f, l, `b${c}`), u = Ht(h);
      a.forw.push(h), a.bakw.push(u);
    }
    return this.pointsSet = {
      forw: bt([...t.forw, ...a.forw]),
      bakw: bt([...t.bakw, ...a.bakw]),
      edges: t.edges
    }, this.tins = {
      forw: Ke(
        s?.forw ?? _e(this.pointsSet.forw, t.edges, "target")
      )
    }, (n === ot.MODE_STRICT || n === ot.MODE_AUTO) && (i ? this.resolveStrictOverlaps() : this.calculateStrictTin(
      n === ot.MODE_AUTO || o ? 1 : Hn
    )), (n === ot.MODE_LOOSE || n === ot.MODE_AUTO && this.strict_status === ot.STATUS_ERROR) && (this.tins.bakw = Ke(
      s?.bakw ?? _e(this.pointsSet.bakw, t.edges, "target")
    ), delete this.kinks, this.strict_status = ot.STATUS_LOOSE), a;
  }
  /**
   * 非同期ラッパーを提供します。
   * 互換性のために Promise ベースの API を維持しますが、内部処理は同期的です。
   */
  async updateTinAsync() {
    this.updateTin();
  }
}
function xo(r, t, e) {
  const n = (s) => Number.isInteger(s) && s >= 0 && s < t;
  if (!Array.isArray(r) || !n(r[0]) || !n(r[1]))
    throw new Error(
      `Invalid edge at edges[${e}]: start/end ${JSON.stringify(r)} must be integer indices of points (0 to ${t - 1})`
    );
}
export {
  ie as BOUNDARY_GROUP,
  Ot as EDGE_HULL,
  ss as EDGE_PROTECT,
  $t as EDGE_REQUIRED,
  ze as IncrementalMesh,
  no as MeshModel,
  ot as Tin,
  _e as constrainedTin,
  Ht as counterPoint,
  Dt as createPoint,
  ot as default,
  So as findIntersections,
  bs as format_version,
  co as insertEdge,
  io as insertPoint,
  Ps as insertSearchIndex,
  gs as meshFromCompiled,
  ro as movePoint,
  fo as removeEdge,
  oo as removePoint,
  lo as replaceEdgeNodes,
  Yn as vertexCalc
};
