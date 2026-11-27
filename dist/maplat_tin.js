import { counterTri as ln, Transform as xn, validateWorldFile as Ys, normalizeEdges as kn, transformArr as Ke, rotateVerticesTriangle as We, worldFileToCrs as qs } from "@maplat/transform";
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
function Us(r) {
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
function js(r) {
  return r.type === "Feature" ? r.geometry : r;
}
function gn(r, t, e) {
  if (r !== null)
    for (var n, s, o, i, a, c, f, l = 0, h = 0, u, p = r.type, b = p === "FeatureCollection", d = p === "Feature", k = b ? r.features.length : 1, M = 0; M < k; M++) {
      f = b ? (
        // @ts-expect-error: Known type conflict
        r.features[M].geometry
      ) : d ? (
        // @ts-expect-error: Known type conflict
        r.geometry
      ) : r, u = f ? f.type === "GeometryCollection" : !1, a = u ? f.geometries.length : 1;
      for (var w = 0; w < a; w++) {
        var x = 0, g = 0;
        if (i = u ? f.geometries[w] : f, i !== null) {
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
                  g
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
                    g
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
                      g
                    ) === !1
                  )
                    return !1;
                  h++;
                }
                m === "MultiLineString" && x++, m === "Polygon" && g++;
              }
              m === "Polygon" && x++;
              break;
            case "MultiPolygon":
              for (n = 0; n < c.length; n++) {
                for (g = 0, s = 0; s < c[n].length; s++) {
                  for (o = 0; o < c[n][s].length - l; o++) {
                    if (
                      // @ts-expect-error: Known type conflict
                      t(
                        c[n][s][o],
                        h,
                        M,
                        x,
                        g
                      ) === !1
                    )
                      return !1;
                    h++;
                  }
                  g++;
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
const xt = 11102230246251565e-32, J = 134217729, Ms = (3 + 8 * xt) * xt;
function vt(r, t, e, n, s) {
  let o, i, a, c, f = t[0], l = n[0], h = 0, u = 0;
  l > f == l > -f ? (o = f, f = t[++h]) : (o = l, l = n[++u]);
  let p = 0;
  if (h < r && u < e)
    for (l > f == l > -f ? (i = f + o, a = o - (i - f), f = t[++h]) : (i = l + o, a = o - (i - l), l = n[++u]), o = i, a !== 0 && (s[p++] = a); h < r && u < e; )
      l > f == l > -f ? (i = o + f, c = i - o, a = o - (i - c) + (f - c), f = t[++h]) : (i = o + l, c = i - o, a = o - (i - c) + (l - c), l = n[++u]), o = i, a !== 0 && (s[p++] = a);
  for (; h < r; )
    i = o + f, c = i - o, a = o - (i - c) + (f - c), f = t[++h], o = i, a !== 0 && (s[p++] = a);
  for (; u < e; )
    i = o + l, c = i - o, a = o - (i - c) + (l - c), l = n[++u], o = i, a !== 0 && (s[p++] = a);
  return (o !== 0 || p === 0) && (s[p++] = o), p;
}
function Nt(r, t, e, n, s, o, i, a) {
  return vt(vt(r, t, e, n, i), i, s, o, a);
}
function j(r, t, e, n) {
  let s, o, i, a, c, f, l, h, u, p, b;
  l = J * e, p = l - (l - e), b = e - p;
  let d = t[0];
  s = d * e, l = J * d, h = l - (l - d), u = d - h, i = u * b - (s - h * p - u * p - h * b);
  let k = 0;
  i !== 0 && (n[k++] = i);
  for (let M = 1; M < r; M++)
    d = t[M], a = d * e, l = J * d, h = l - (l - d), u = d - h, c = u * b - (a - h * p - u * p - h * b), o = s + c, f = o - s, i = s - (o - f) + (c - f), i !== 0 && (n[k++] = i), s = a + o, i = o - (s - a), i !== 0 && (n[k++] = i);
  return (s !== 0 || k === 0) && (n[k++] = s), k;
}
function Es(r, t) {
  let e = t[0];
  for (let n = 1; n < r; n++) e += t[n];
  return e;
}
function ot(r) {
  return new Float64Array(r);
}
const Gs = (3 + 16 * xt) * xt, Ks = (2 + 12 * xt) * xt, Ws = (9 + 64 * xt) * xt * xt, ee = ot(4), En = ot(8), _n = ot(12), In = ot(16), kt = ot(4);
function Hs(r, t, e, n, s, o, i) {
  let a, c, f, l, h, u, p, b, d, k, M, w, x, g, m, v, S, E;
  const y = r - s, N = e - s, O = t - o, P = n - o;
  g = y * P, u = J * y, p = u - (u - y), b = y - p, u = J * P, d = u - (u - P), k = P - d, m = b * k - (g - p * d - b * d - p * k), v = O * N, u = J * O, p = u - (u - O), b = O - p, u = J * N, d = u - (u - N), k = N - d, S = b * k - (v - p * d - b * d - p * k), M = m - S, h = m - M, ee[0] = m - (M + h) + (h - S), w = g + M, h = w - g, x = g - (w - h) + (M - h), M = x - v, h = x - M, ee[1] = x - (M + h) + (h - v), E = w + M, h = E - w, ee[2] = w - (E - h) + (M - h), ee[3] = E;
  let C = Es(4, ee), _ = Ks * i;
  if (C >= _ || -C >= _ || (h = r - y, a = r - (y + h) + (h - s), h = e - N, f = e - (N + h) + (h - s), h = t - O, c = t - (O + h) + (h - o), h = n - P, l = n - (P + h) + (h - o), a === 0 && c === 0 && f === 0 && l === 0) || (_ = Ws * i + Ms * Math.abs(C), C += y * l + P * a - (O * f + N * c), C >= _ || -C >= _)) return C;
  g = a * P, u = J * a, p = u - (u - a), b = a - p, u = J * P, d = u - (u - P), k = P - d, m = b * k - (g - p * d - b * d - p * k), v = c * N, u = J * c, p = u - (u - c), b = c - p, u = J * N, d = u - (u - N), k = N - d, S = b * k - (v - p * d - b * d - p * k), M = m - S, h = m - M, kt[0] = m - (M + h) + (h - S), w = g + M, h = w - g, x = g - (w - h) + (M - h), M = x - v, h = x - M, kt[1] = x - (M + h) + (h - v), E = w + M, h = E - w, kt[2] = w - (E - h) + (M - h), kt[3] = E;
  const T = vt(4, ee, 4, kt, En);
  g = y * l, u = J * y, p = u - (u - y), b = y - p, u = J * l, d = u - (u - l), k = l - d, m = b * k - (g - p * d - b * d - p * k), v = O * f, u = J * O, p = u - (u - O), b = O - p, u = J * f, d = u - (u - f), k = f - d, S = b * k - (v - p * d - b * d - p * k), M = m - S, h = m - M, kt[0] = m - (M + h) + (h - S), w = g + M, h = w - g, x = g - (w - h) + (M - h), M = x - v, h = x - M, kt[1] = x - (M + h) + (h - v), E = w + M, h = E - w, kt[2] = w - (E - h) + (M - h), kt[3] = E;
  const A = vt(T, En, 4, kt, _n);
  g = a * l, u = J * a, p = u - (u - a), b = a - p, u = J * l, d = u - (u - l), k = l - d, m = b * k - (g - p * d - b * d - p * k), v = c * f, u = J * c, p = u - (u - c), b = c - p, u = J * f, d = u - (u - f), k = f - d, S = b * k - (v - p * d - b * d - p * k), M = m - S, h = m - M, kt[0] = m - (M + h) + (h - S), w = g + M, h = w - g, x = g - (w - h) + (M - h), M = x - v, h = x - M, kt[1] = x - (M + h) + (h - v), E = w + M, h = E - w, kt[2] = w - (E - h) + (M - h), kt[3] = E;
  const B = vt(A, _n, 4, kt, In);
  return In[B - 1];
}
function ft(r, t, e, n, s, o) {
  const i = (t - o) * (e - s), a = (r - s) * (n - o), c = i - a, f = Math.abs(i + a);
  return Math.abs(c) >= Gs * f ? c : -Hs(r, t, e, n, s, o, f);
}
const Js = (10 + 96 * xt) * xt, Qs = (4 + 48 * xt) * xt, Zs = (44 + 576 * xt) * xt * xt, Vt = ot(4), $t = ot(4), Lt = ot(4), Ft = ot(4), Bt = ot(4), Rt = ot(4), St = ot(4), Mt = ot(4), He = ot(8), Je = ot(8), Qe = ot(8), Ze = ot(8), tn = ot(8), en = ot(8), ve = ot(8), be = ot(8), ye = ot(8), jt = ot(4), Gt = ot(4), Kt = ot(4), Z = ot(8), nt = ot(16), ht = ot(16), ut = ot(16), ct = ot(32), Xt = ot(32), pt = ot(48), _t = ot(64);
let re = ot(1152), nn = ot(1152);
function mt(r, t, e) {
  r = vt(r, re, t, e, nn);
  const n = re;
  return re = nn, nn = n, r;
}
function tr(r, t, e, n, s, o, i, a, c) {
  let f, l, h, u, p, b, d, k, M, w, x, g, m, v, S, E, y, N, O, P, C, _, T, A, B, D, L, I, F, V, $, q, Y, X, U;
  const K = r - i, H = e - i, Q = s - i, W = t - a, tt = n - a, et = o - a;
  $ = H * et, T = J * H, A = T - (T - H), B = H - A, T = J * et, D = T - (T - et), L = et - D, q = B * L - ($ - A * D - B * D - A * L), Y = Q * tt, T = J * Q, A = T - (T - Q), B = Q - A, T = J * tt, D = T - (T - tt), L = tt - D, X = B * L - (Y - A * D - B * D - A * L), I = q - X, _ = q - I, Vt[0] = q - (I + _) + (_ - X), F = $ + I, _ = F - $, V = $ - (F - _) + (I - _), I = V - Y, _ = V - I, Vt[1] = V - (I + _) + (_ - Y), U = F + I, _ = U - F, Vt[2] = F - (U - _) + (I - _), Vt[3] = U, $ = Q * W, T = J * Q, A = T - (T - Q), B = Q - A, T = J * W, D = T - (T - W), L = W - D, q = B * L - ($ - A * D - B * D - A * L), Y = K * et, T = J * K, A = T - (T - K), B = K - A, T = J * et, D = T - (T - et), L = et - D, X = B * L - (Y - A * D - B * D - A * L), I = q - X, _ = q - I, $t[0] = q - (I + _) + (_ - X), F = $ + I, _ = F - $, V = $ - (F - _) + (I - _), I = V - Y, _ = V - I, $t[1] = V - (I + _) + (_ - Y), U = F + I, _ = U - F, $t[2] = F - (U - _) + (I - _), $t[3] = U, $ = K * tt, T = J * K, A = T - (T - K), B = K - A, T = J * tt, D = T - (T - tt), L = tt - D, q = B * L - ($ - A * D - B * D - A * L), Y = H * W, T = J * H, A = T - (T - H), B = H - A, T = J * W, D = T - (T - W), L = W - D, X = B * L - (Y - A * D - B * D - A * L), I = q - X, _ = q - I, Lt[0] = q - (I + _) + (_ - X), F = $ + I, _ = F - $, V = $ - (F - _) + (I - _), I = V - Y, _ = V - I, Lt[1] = V - (I + _) + (_ - Y), U = F + I, _ = U - F, Lt[2] = F - (U - _) + (I - _), Lt[3] = U, f = vt(
    vt(
      vt(
        j(j(4, Vt, K, Z), Z, K, nt),
        nt,
        j(j(4, Vt, W, Z), Z, W, ht),
        ht,
        ct
      ),
      ct,
      vt(
        j(j(4, $t, H, Z), Z, H, nt),
        nt,
        j(j(4, $t, tt, Z), Z, tt, ht),
        ht,
        Xt
      ),
      Xt,
      _t
    ),
    _t,
    vt(
      j(j(4, Lt, Q, Z), Z, Q, nt),
      nt,
      j(j(4, Lt, et, Z), Z, et, ht),
      ht,
      ct
    ),
    ct,
    re
  );
  let lt = Es(f, re), R = Qs * c;
  if (lt >= R || -lt >= R || (_ = r - K, l = r - (K + _) + (_ - i), _ = t - W, p = t - (W + _) + (_ - a), _ = e - H, h = e - (H + _) + (_ - i), _ = n - tt, b = n - (tt + _) + (_ - a), _ = s - Q, u = s - (Q + _) + (_ - i), _ = o - et, d = o - (et + _) + (_ - a), l === 0 && h === 0 && u === 0 && p === 0 && b === 0 && d === 0) || (R = Zs * c + Ms * Math.abs(lt), lt += (K * K + W * W) * (H * d + et * h - (tt * u + Q * b)) + 2 * (K * l + W * p) * (H * et - tt * Q) + ((H * H + tt * tt) * (Q * p + W * u - (et * l + K * d)) + 2 * (H * h + tt * b) * (Q * W - et * K)) + ((Q * Q + et * et) * (K * b + tt * l - (W * h + H * p)) + 2 * (Q * u + et * d) * (K * tt - W * H)), lt >= R || -lt >= R))
    return lt;
  if ((h !== 0 || b !== 0 || u !== 0 || d !== 0) && ($ = K * K, T = J * K, A = T - (T - K), B = K - A, q = B * B - ($ - A * A - (A + A) * B), Y = W * W, T = J * W, A = T - (T - W), B = W - A, X = B * B - (Y - A * A - (A + A) * B), I = q + X, _ = I - q, Ft[0] = q - (I - _) + (X - _), F = $ + I, _ = F - $, V = $ - (F - _) + (I - _), I = V + Y, _ = I - V, Ft[1] = V - (I - _) + (Y - _), U = F + I, _ = U - F, Ft[2] = F - (U - _) + (I - _), Ft[3] = U), (u !== 0 || d !== 0 || l !== 0 || p !== 0) && ($ = H * H, T = J * H, A = T - (T - H), B = H - A, q = B * B - ($ - A * A - (A + A) * B), Y = tt * tt, T = J * tt, A = T - (T - tt), B = tt - A, X = B * B - (Y - A * A - (A + A) * B), I = q + X, _ = I - q, Bt[0] = q - (I - _) + (X - _), F = $ + I, _ = F - $, V = $ - (F - _) + (I - _), I = V + Y, _ = I - V, Bt[1] = V - (I - _) + (Y - _), U = F + I, _ = U - F, Bt[2] = F - (U - _) + (I - _), Bt[3] = U), (l !== 0 || p !== 0 || h !== 0 || b !== 0) && ($ = Q * Q, T = J * Q, A = T - (T - Q), B = Q - A, q = B * B - ($ - A * A - (A + A) * B), Y = et * et, T = J * et, A = T - (T - et), B = et - A, X = B * B - (Y - A * A - (A + A) * B), I = q + X, _ = I - q, Rt[0] = q - (I - _) + (X - _), F = $ + I, _ = F - $, V = $ - (F - _) + (I - _), I = V + Y, _ = I - V, Rt[1] = V - (I - _) + (Y - _), U = F + I, _ = U - F, Rt[2] = F - (U - _) + (I - _), Rt[3] = U), l !== 0 && (k = j(4, Vt, l, He), f = mt(f, Nt(
    j(k, He, 2 * K, nt),
    nt,
    j(j(4, Rt, l, Z), Z, tt, ht),
    ht,
    j(j(4, Bt, l, Z), Z, -et, ut),
    ut,
    ct,
    pt
  ), pt)), p !== 0 && (M = j(4, Vt, p, Je), f = mt(f, Nt(
    j(M, Je, 2 * W, nt),
    nt,
    j(j(4, Bt, p, Z), Z, Q, ht),
    ht,
    j(j(4, Rt, p, Z), Z, -H, ut),
    ut,
    ct,
    pt
  ), pt)), h !== 0 && (w = j(4, $t, h, Qe), f = mt(f, Nt(
    j(w, Qe, 2 * H, nt),
    nt,
    j(j(4, Ft, h, Z), Z, et, ht),
    ht,
    j(j(4, Rt, h, Z), Z, -W, ut),
    ut,
    ct,
    pt
  ), pt)), b !== 0 && (x = j(4, $t, b, Ze), f = mt(f, Nt(
    j(x, Ze, 2 * tt, nt),
    nt,
    j(j(4, Rt, b, Z), Z, K, ht),
    ht,
    j(j(4, Ft, b, Z), Z, -Q, ut),
    ut,
    ct,
    pt
  ), pt)), u !== 0 && (g = j(4, Lt, u, tn), f = mt(f, Nt(
    j(g, tn, 2 * Q, nt),
    nt,
    j(j(4, Bt, u, Z), Z, W, ht),
    ht,
    j(j(4, Ft, u, Z), Z, -tt, ut),
    ut,
    ct,
    pt
  ), pt)), d !== 0 && (m = j(4, Lt, d, en), f = mt(f, Nt(
    j(m, en, 2 * et, nt),
    nt,
    j(j(4, Ft, d, Z), Z, H, ht),
    ht,
    j(j(4, Bt, d, Z), Z, -K, ut),
    ut,
    ct,
    pt
  ), pt)), l !== 0 || p !== 0) {
    if (h !== 0 || b !== 0 || u !== 0 || d !== 0 ? ($ = h * et, T = J * h, A = T - (T - h), B = h - A, T = J * et, D = T - (T - et), L = et - D, q = B * L - ($ - A * D - B * D - A * L), Y = H * d, T = J * H, A = T - (T - H), B = H - A, T = J * d, D = T - (T - d), L = d - D, X = B * L - (Y - A * D - B * D - A * L), I = q + X, _ = I - q, St[0] = q - (I - _) + (X - _), F = $ + I, _ = F - $, V = $ - (F - _) + (I - _), I = V + Y, _ = I - V, St[1] = V - (I - _) + (Y - _), U = F + I, _ = U - F, St[2] = F - (U - _) + (I - _), St[3] = U, $ = u * -tt, T = J * u, A = T - (T - u), B = u - A, T = J * -tt, D = T - (T - -tt), L = -tt - D, q = B * L - ($ - A * D - B * D - A * L), Y = Q * -b, T = J * Q, A = T - (T - Q), B = Q - A, T = J * -b, D = T - (T - -b), L = -b - D, X = B * L - (Y - A * D - B * D - A * L), I = q + X, _ = I - q, Mt[0] = q - (I - _) + (X - _), F = $ + I, _ = F - $, V = $ - (F - _) + (I - _), I = V + Y, _ = I - V, Mt[1] = V - (I - _) + (Y - _), U = F + I, _ = U - F, Mt[2] = F - (U - _) + (I - _), Mt[3] = U, S = vt(4, St, 4, Mt, be), $ = h * d, T = J * h, A = T - (T - h), B = h - A, T = J * d, D = T - (T - d), L = d - D, q = B * L - ($ - A * D - B * D - A * L), Y = u * b, T = J * u, A = T - (T - u), B = u - A, T = J * b, D = T - (T - b), L = b - D, X = B * L - (Y - A * D - B * D - A * L), I = q - X, _ = q - I, Gt[0] = q - (I + _) + (_ - X), F = $ + I, _ = F - $, V = $ - (F - _) + (I - _), I = V - Y, _ = V - I, Gt[1] = V - (I + _) + (_ - Y), U = F + I, _ = U - F, Gt[2] = F - (U - _) + (I - _), Gt[3] = U, N = 4) : (be[0] = 0, S = 1, Gt[0] = 0, N = 1), l !== 0) {
      const z = j(S, be, l, ut);
      f = mt(f, vt(
        j(k, He, l, nt),
        nt,
        j(z, ut, 2 * K, ct),
        ct,
        pt
      ), pt);
      const G = j(N, Gt, l, Z);
      f = mt(f, Nt(
        j(G, Z, 2 * K, nt),
        nt,
        j(G, Z, l, ht),
        ht,
        j(z, ut, l, ct),
        ct,
        Xt,
        _t
      ), _t), b !== 0 && (f = mt(f, j(j(4, Rt, l, Z), Z, b, nt), nt)), d !== 0 && (f = mt(f, j(j(4, Bt, -l, Z), Z, d, nt), nt));
    }
    if (p !== 0) {
      const z = j(S, be, p, ut);
      f = mt(f, vt(
        j(M, Je, p, nt),
        nt,
        j(z, ut, 2 * W, ct),
        ct,
        pt
      ), pt);
      const G = j(N, Gt, p, Z);
      f = mt(f, Nt(
        j(G, Z, 2 * W, nt),
        nt,
        j(G, Z, p, ht),
        ht,
        j(z, ut, p, ct),
        ct,
        Xt,
        _t
      ), _t);
    }
  }
  if (h !== 0 || b !== 0) {
    if (u !== 0 || d !== 0 || l !== 0 || p !== 0 ? ($ = u * W, T = J * u, A = T - (T - u), B = u - A, T = J * W, D = T - (T - W), L = W - D, q = B * L - ($ - A * D - B * D - A * L), Y = Q * p, T = J * Q, A = T - (T - Q), B = Q - A, T = J * p, D = T - (T - p), L = p - D, X = B * L - (Y - A * D - B * D - A * L), I = q + X, _ = I - q, St[0] = q - (I - _) + (X - _), F = $ + I, _ = F - $, V = $ - (F - _) + (I - _), I = V + Y, _ = I - V, St[1] = V - (I - _) + (Y - _), U = F + I, _ = U - F, St[2] = F - (U - _) + (I - _), St[3] = U, P = -et, C = -d, $ = l * P, T = J * l, A = T - (T - l), B = l - A, T = J * P, D = T - (T - P), L = P - D, q = B * L - ($ - A * D - B * D - A * L), Y = K * C, T = J * K, A = T - (T - K), B = K - A, T = J * C, D = T - (T - C), L = C - D, X = B * L - (Y - A * D - B * D - A * L), I = q + X, _ = I - q, Mt[0] = q - (I - _) + (X - _), F = $ + I, _ = F - $, V = $ - (F - _) + (I - _), I = V + Y, _ = I - V, Mt[1] = V - (I - _) + (Y - _), U = F + I, _ = U - F, Mt[2] = F - (U - _) + (I - _), Mt[3] = U, E = vt(4, St, 4, Mt, ye), $ = u * p, T = J * u, A = T - (T - u), B = u - A, T = J * p, D = T - (T - p), L = p - D, q = B * L - ($ - A * D - B * D - A * L), Y = l * d, T = J * l, A = T - (T - l), B = l - A, T = J * d, D = T - (T - d), L = d - D, X = B * L - (Y - A * D - B * D - A * L), I = q - X, _ = q - I, Kt[0] = q - (I + _) + (_ - X), F = $ + I, _ = F - $, V = $ - (F - _) + (I - _), I = V - Y, _ = V - I, Kt[1] = V - (I + _) + (_ - Y), U = F + I, _ = U - F, Kt[2] = F - (U - _) + (I - _), Kt[3] = U, O = 4) : (ye[0] = 0, E = 1, Kt[0] = 0, O = 1), h !== 0) {
      const z = j(E, ye, h, ut);
      f = mt(f, vt(
        j(w, Qe, h, nt),
        nt,
        j(z, ut, 2 * H, ct),
        ct,
        pt
      ), pt);
      const G = j(O, Kt, h, Z);
      f = mt(f, Nt(
        j(G, Z, 2 * H, nt),
        nt,
        j(G, Z, h, ht),
        ht,
        j(z, ut, h, ct),
        ct,
        Xt,
        _t
      ), _t), d !== 0 && (f = mt(f, j(j(4, Ft, h, Z), Z, d, nt), nt)), p !== 0 && (f = mt(f, j(j(4, Rt, -h, Z), Z, p, nt), nt));
    }
    if (b !== 0) {
      const z = j(E, ye, b, ut);
      f = mt(f, vt(
        j(x, Ze, b, nt),
        nt,
        j(z, ut, 2 * tt, ct),
        ct,
        pt
      ), pt);
      const G = j(O, Kt, b, Z);
      f = mt(f, Nt(
        j(G, Z, 2 * tt, nt),
        nt,
        j(G, Z, b, ht),
        ht,
        j(z, ut, b, ct),
        ct,
        Xt,
        _t
      ), _t);
    }
  }
  if (u !== 0 || d !== 0) {
    if (l !== 0 || p !== 0 || h !== 0 || b !== 0 ? ($ = l * tt, T = J * l, A = T - (T - l), B = l - A, T = J * tt, D = T - (T - tt), L = tt - D, q = B * L - ($ - A * D - B * D - A * L), Y = K * b, T = J * K, A = T - (T - K), B = K - A, T = J * b, D = T - (T - b), L = b - D, X = B * L - (Y - A * D - B * D - A * L), I = q + X, _ = I - q, St[0] = q - (I - _) + (X - _), F = $ + I, _ = F - $, V = $ - (F - _) + (I - _), I = V + Y, _ = I - V, St[1] = V - (I - _) + (Y - _), U = F + I, _ = U - F, St[2] = F - (U - _) + (I - _), St[3] = U, P = -W, C = -p, $ = h * P, T = J * h, A = T - (T - h), B = h - A, T = J * P, D = T - (T - P), L = P - D, q = B * L - ($ - A * D - B * D - A * L), Y = H * C, T = J * H, A = T - (T - H), B = H - A, T = J * C, D = T - (T - C), L = C - D, X = B * L - (Y - A * D - B * D - A * L), I = q + X, _ = I - q, Mt[0] = q - (I - _) + (X - _), F = $ + I, _ = F - $, V = $ - (F - _) + (I - _), I = V + Y, _ = I - V, Mt[1] = V - (I - _) + (Y - _), U = F + I, _ = U - F, Mt[2] = F - (U - _) + (I - _), Mt[3] = U, v = vt(4, St, 4, Mt, ve), $ = l * b, T = J * l, A = T - (T - l), B = l - A, T = J * b, D = T - (T - b), L = b - D, q = B * L - ($ - A * D - B * D - A * L), Y = h * p, T = J * h, A = T - (T - h), B = h - A, T = J * p, D = T - (T - p), L = p - D, X = B * L - (Y - A * D - B * D - A * L), I = q - X, _ = q - I, jt[0] = q - (I + _) + (_ - X), F = $ + I, _ = F - $, V = $ - (F - _) + (I - _), I = V - Y, _ = V - I, jt[1] = V - (I + _) + (_ - Y), U = F + I, _ = U - F, jt[2] = F - (U - _) + (I - _), jt[3] = U, y = 4) : (ve[0] = 0, v = 1, jt[0] = 0, y = 1), u !== 0) {
      const z = j(v, ve, u, ut);
      f = mt(f, vt(
        j(g, tn, u, nt),
        nt,
        j(z, ut, 2 * Q, ct),
        ct,
        pt
      ), pt);
      const G = j(y, jt, u, Z);
      f = mt(f, Nt(
        j(G, Z, 2 * Q, nt),
        nt,
        j(G, Z, u, ht),
        ht,
        j(z, ut, u, ct),
        ct,
        Xt,
        _t
      ), _t), p !== 0 && (f = mt(f, j(j(4, Bt, u, Z), Z, p, nt), nt)), b !== 0 && (f = mt(f, j(j(4, Ft, -u, Z), Z, b, nt), nt));
    }
    if (d !== 0) {
      const z = j(v, ve, d, ut);
      f = mt(f, vt(
        j(m, en, d, nt),
        nt,
        j(z, ut, 2 * et, ct),
        ct,
        pt
      ), pt);
      const G = j(y, jt, d, Z);
      f = mt(f, Nt(
        j(G, Z, 2 * et, nt),
        nt,
        j(G, Z, d, ht),
        ht,
        j(z, ut, d, ct),
        ct,
        Xt,
        _t
      ), _t);
    }
  }
  return re[f - 1];
}
function Le(r, t, e, n, s, o, i, a) {
  const c = r - i, f = e - i, l = s - i, h = t - a, u = n - a, p = o - a, b = f * p, d = l * u, k = c * c + h * h, M = l * h, w = c * p, x = f * f + u * u, g = c * u, m = f * h, v = l * l + p * p, S = k * (b - d) + x * (M - w) + v * (g - m), E = (Math.abs(b) + Math.abs(d)) * k + (Math.abs(M) + Math.abs(w)) * x + (Math.abs(g) + Math.abs(m)) * v, y = Js * E;
  return S > y || -S > y ? S : tr(r, t, e, n, s, o, i, a, E);
}
function er(r, t) {
  var e, n, s = 0, o, i, a, c, f, l, h, u = r[0], p = r[1], b = t.length;
  for (e = 0; e < b; e++) {
    n = 0;
    var d = t[e], k = d.length - 1;
    if (l = d[0], l[0] !== d[k][0] && l[1] !== d[k][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (i = l[0] - u, a = l[1] - p, n; n < k; n++) {
      if (h = d[n + 1], c = h[0] - u, f = h[1] - p, a === 0 && f === 0) {
        if (c <= 0 && i >= 0 || i <= 0 && c >= 0)
          return 0;
      } else if (f >= 0 && a <= 0 || f <= 0 && a >= 0) {
        if (o = ft(i, c, a, f, 0, 0), o === 0)
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
  const n = Us(r), s = js(t), o = s.type, i = t.bbox;
  let a = s.coordinates;
  if (i && nr(n, i) === !1)
    return !1;
  o === "Polygon" && (a = [a]);
  for (var c = 0; c < a.length; ++c) {
    const f = er(n, a[c]);
    if (f === 0 && !e.ignoreBoundary) return !0;
    if (f) return !0;
  }
  return !1;
}
function nr(r, t) {
  return t[0] <= r[0] && t[1] <= r[1] && t[2] >= r[0] && t[3] >= r[1];
}
class pn {
  constructor(t = [], e = sr) {
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
function sr(r, t) {
  return r < t ? -1 : r > t ? 1 : 0;
}
const rr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: pn
}, Symbol.toStringTag, { value: "Module" })), Ct = 11102230246251565e-32, yt = 134217729, ir = (3 + 8 * Ct) * Ct;
function rn(r, t, e, n, s) {
  let o, i, a, c, f = t[0], l = n[0], h = 0, u = 0;
  l > f == l > -f ? (o = f, f = t[++h]) : (o = l, l = n[++u]);
  let p = 0;
  if (h < r && u < e)
    for (l > f == l > -f ? (i = f + o, a = o - (i - f), f = t[++h]) : (i = l + o, a = o - (i - l), l = n[++u]), o = i, a !== 0 && (s[p++] = a); h < r && u < e; )
      l > f == l > -f ? (i = o + f, c = i - o, a = o - (i - c) + (f - c), f = t[++h]) : (i = o + l, c = i - o, a = o - (i - c) + (l - c), l = n[++u]), o = i, a !== 0 && (s[p++] = a);
  for (; h < r; )
    i = o + f, c = i - o, a = o - (i - c) + (f - c), f = t[++h], o = i, a !== 0 && (s[p++] = a);
  for (; u < e; )
    i = o + l, c = i - o, a = o - (i - c) + (l - c), l = n[++u], o = i, a !== 0 && (s[p++] = a);
  return (o !== 0 || p === 0) && (s[p++] = o), p;
}
function or(r, t) {
  let e = t[0];
  for (let n = 1; n < r; n++) e += t[n];
  return e;
}
function we(r) {
  return new Float64Array(r);
}
const ar = (3 + 16 * Ct) * Ct, cr = (2 + 12 * Ct) * Ct, fr = (9 + 64 * Ct) * Ct * Ct, ne = we(4), An = we(8), Nn = we(12), On = we(16), Et = we(4);
function lr(r, t, e, n, s, o, i) {
  let a, c, f, l, h, u, p, b, d, k, M, w, x, g, m, v, S, E;
  const y = r - s, N = e - s, O = t - o, P = n - o;
  g = y * P, u = yt * y, p = u - (u - y), b = y - p, u = yt * P, d = u - (u - P), k = P - d, m = b * k - (g - p * d - b * d - p * k), v = O * N, u = yt * O, p = u - (u - O), b = O - p, u = yt * N, d = u - (u - N), k = N - d, S = b * k - (v - p * d - b * d - p * k), M = m - S, h = m - M, ne[0] = m - (M + h) + (h - S), w = g + M, h = w - g, x = g - (w - h) + (M - h), M = x - v, h = x - M, ne[1] = x - (M + h) + (h - v), E = w + M, h = E - w, ne[2] = w - (E - h) + (M - h), ne[3] = E;
  let C = or(4, ne), _ = cr * i;
  if (C >= _ || -C >= _ || (h = r - y, a = r - (y + h) + (h - s), h = e - N, f = e - (N + h) + (h - s), h = t - O, c = t - (O + h) + (h - o), h = n - P, l = n - (P + h) + (h - o), a === 0 && c === 0 && f === 0 && l === 0) || (_ = fr * i + ir * Math.abs(C), C += y * l + P * a - (O * f + N * c), C >= _ || -C >= _)) return C;
  g = a * P, u = yt * a, p = u - (u - a), b = a - p, u = yt * P, d = u - (u - P), k = P - d, m = b * k - (g - p * d - b * d - p * k), v = c * N, u = yt * c, p = u - (u - c), b = c - p, u = yt * N, d = u - (u - N), k = N - d, S = b * k - (v - p * d - b * d - p * k), M = m - S, h = m - M, Et[0] = m - (M + h) + (h - S), w = g + M, h = w - g, x = g - (w - h) + (M - h), M = x - v, h = x - M, Et[1] = x - (M + h) + (h - v), E = w + M, h = E - w, Et[2] = w - (E - h) + (M - h), Et[3] = E;
  const T = rn(4, ne, 4, Et, An);
  g = y * l, u = yt * y, p = u - (u - y), b = y - p, u = yt * l, d = u - (u - l), k = l - d, m = b * k - (g - p * d - b * d - p * k), v = O * f, u = yt * O, p = u - (u - O), b = O - p, u = yt * f, d = u - (u - f), k = f - d, S = b * k - (v - p * d - b * d - p * k), M = m - S, h = m - M, Et[0] = m - (M + h) + (h - S), w = g + M, h = w - g, x = g - (w - h) + (M - h), M = x - v, h = x - M, Et[1] = x - (M + h) + (h - v), E = w + M, h = E - w, Et[2] = w - (E - h) + (M - h), Et[3] = E;
  const A = rn(T, An, 4, Et, Nn);
  g = a * l, u = yt * a, p = u - (u - a), b = a - p, u = yt * l, d = u - (u - l), k = l - d, m = b * k - (g - p * d - b * d - p * k), v = c * f, u = yt * c, p = u - (u - c), b = c - p, u = yt * f, d = u - (u - f), k = f - d, S = b * k - (v - p * d - b * d - p * k), M = m - S, h = m - M, Et[0] = m - (M + h) + (h - S), w = g + M, h = w - g, x = g - (w - h) + (M - h), M = x - v, h = x - M, Et[1] = x - (M + h) + (h - v), E = w + M, h = E - w, Et[2] = w - (E - h) + (M - h), Et[3] = E;
  const B = rn(A, Nn, 4, Et, On);
  return On[B - 1];
}
function Tn(r, t, e, n, s, o) {
  const i = (t - o) * (e - s), a = (r - s) * (n - o), c = i - a;
  if (i === 0 || a === 0 || i > 0 != a > 0) return c;
  const f = Math.abs(i + a);
  return Math.abs(c) >= ar * f ? c : -lr(r, t, e, n, s, o, f);
}
function hr(r, t) {
  const e = new pn([], _s);
  return dr(r, e), gr(e, t);
}
function _s(r, t) {
  return r.p.x > t.p.x ? 1 : r.p.x < t.p.x || r.p.x === t.p.x && (r.featureId !== t.featureId || r.ringId !== t.ringId) && r.isLeftEndpoint && !t.isLeftEndpoint ? -1 : r.p.y !== t.p.y ? r.p.y > t.p.y ? 1 : -1 : 1;
}
function ur(r, t) {
  return r.rightSweepEvent.p.x > t.rightSweepEvent.p.x ? 1 : r.rightSweepEvent.p.x < t.rightSweepEvent.p.x ? -1 : r.rightSweepEvent.p.y !== t.rightSweepEvent.p.y ? r.rightSweepEvent.p.y < t.rightSweepEvent.p.y ? 1 : -1 : 1;
}
function dr(r, t) {
  if (r.type === "FeatureCollection") {
    const e = r.features;
    for (let n = 0; n < e.length; n++)
      Fn(e[n], t);
  } else
    Fn(r, t);
}
var xe = 0, ke = 0, Se = 0;
function Fn(r, t) {
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
        f.otherEvent = l, l.otherEvent = f, _s(f, l) > 0 ? (l.isLeftEndpoint = !0, f.isLeftEndpoint = !1) : (f.isLeftEndpoint = !0, l.isLeftEndpoint = !1), t.push(f), t.push(l), i = a, Se = Se + 1;
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
function gr(r, t = !1) {
  const e = [], n = new pn([], ur);
  for (; r.length; ) {
    const s = r.pop();
    if (s.isLeftEndpoint) {
      const o = new pr(s);
      for (let i = 0; i < n.data.length; i++) {
        const a = n.data[i];
        if (t && a.leftSweepEvent.featureId === s.featureId)
          continue;
        const c = mr(o, a);
        c !== !1 && e.push(c);
      }
      n.push(o);
    } else s.isLeftEndpoint === !1 && n.pop();
  }
  return e;
}
var pr = class {
  /** @param event must have otherEvent non-null */
  constructor(r) {
    this.leftSweepEvent = r, this.rightSweepEvent = r.otherEvent;
  }
};
function mr(r, t) {
  if (r === null || t === null) return !1;
  const e = r.leftSweepEvent.p.x, n = r.leftSweepEvent.p.y, s = r.rightSweepEvent.p.x, o = r.rightSweepEvent.p.y, i = t.leftSweepEvent.p.x, a = t.leftSweepEvent.p.y, c = t.rightSweepEvent.p.x, f = t.rightSweepEvent.p.y, l = Tn(e, n, s, o, i, a), h = Tn(e, n, s, o, c, f);
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
  const u = (f - a) * (s - e) - (c - i) * (o - n), p = (c - i) * (n - a) - (f - a) * (e - i), b = (s - e) * (n - a) - (o - n) * (e - i);
  if (u === 0)
    return !1;
  const d = p / u, k = b / u;
  if (d >= 0 && d <= 1 && k >= 0 && k <= 1) {
    const M = e + d * (s - e), w = n + d * (o - n);
    return [M, w];
  }
  return !1;
}
function wr(r, t, e = {}) {
  const { removeDuplicates: n = !0, ignoreSelfIntersections: s = !0 } = e;
  let o = [];
  r.type === "FeatureCollection" ? o = o.concat(r.features) : r.type === "Feature" ? o.push(r) : (r.type === "LineString" || r.type === "Polygon" || r.type === "MultiLineString" || r.type === "MultiPolygon") && o.push(de(r)), t.type === "FeatureCollection" ? o = o.concat(t.features) : t.type === "Feature" ? o.push(t) : (t.type === "LineString" || t.type === "Polygon" || t.type === "MultiLineString" || t.type === "MultiPolygon") && o.push(de(t));
  const i = hr(
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
function vr(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
function br(r) {
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
function yr(r, t = {}) {
  let e = 0, n = 0, s = 0;
  return gn(
    r,
    function(o) {
      e += o[0], n += o[1], s++;
    },
    !0
  ), Zt([e / s, n / s], t.properties);
}
var Me = { exports: {} }, Te = { exports: {} }, xr = Te.exports, Rn;
function kr() {
  return Rn || (Rn = 1, (function(r, t) {
    (function(e, n) {
      r.exports = n();
    })(xr, function() {
      function e(w, x, g, m, v) {
        (function S(E, y, N, O, P) {
          for (; O > N; ) {
            if (O - N > 600) {
              var C = O - N + 1, _ = y - N + 1, T = Math.log(C), A = 0.5 * Math.exp(2 * T / 3), B = 0.5 * Math.sqrt(T * A * (C - A) / C) * (_ - C / 2 < 0 ? -1 : 1), D = Math.max(N, Math.floor(y - _ * A / C + B)), L = Math.min(O, Math.floor(y + (C - _) * A / C + B));
              S(E, y, D, L, P);
            }
            var I = E[y], F = N, V = O;
            for (n(E, N, y), P(E[O], I) > 0 && n(E, N, O); F < V; ) {
              for (n(E, F, V), F++, V--; P(E[F], I) < 0; ) F++;
              for (; P(E[V], I) > 0; ) V--;
            }
            P(E[N], I) === 0 ? n(E, N, V) : n(E, ++V, O), V <= y && (N = V + 1), y <= V && (O = V - 1);
          }
        })(w, x, g || 0, m || w.length - 1, v || s);
      }
      function n(w, x, g) {
        var m = w[x];
        w[x] = w[g], w[g] = m;
      }
      function s(w, x) {
        return w < x ? -1 : w > x ? 1 : 0;
      }
      var o = function(w) {
        w === void 0 && (w = 9), this._maxEntries = Math.max(4, w), this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries)), this.clear();
      };
      function i(w, x, g) {
        if (!g) return x.indexOf(w);
        for (var m = 0; m < x.length; m++) if (g(w, x[m])) return m;
        return -1;
      }
      function a(w, x) {
        c(w, 0, w.children.length, x, w);
      }
      function c(w, x, g, m, v) {
        v || (v = k(null)), v.minX = 1 / 0, v.minY = 1 / 0, v.maxX = -1 / 0, v.maxY = -1 / 0;
        for (var S = x; S < g; S++) {
          var E = w.children[S];
          f(v, w.leaf ? m(E) : E);
        }
        return v;
      }
      function f(w, x) {
        return w.minX = Math.min(w.minX, x.minX), w.minY = Math.min(w.minY, x.minY), w.maxX = Math.max(w.maxX, x.maxX), w.maxY = Math.max(w.maxY, x.maxY), w;
      }
      function l(w, x) {
        return w.minX - x.minX;
      }
      function h(w, x) {
        return w.minY - x.minY;
      }
      function u(w) {
        return (w.maxX - w.minX) * (w.maxY - w.minY);
      }
      function p(w) {
        return w.maxX - w.minX + (w.maxY - w.minY);
      }
      function b(w, x) {
        return w.minX <= x.minX && w.minY <= x.minY && x.maxX <= w.maxX && x.maxY <= w.maxY;
      }
      function d(w, x) {
        return x.minX <= w.maxX && x.minY <= w.maxY && x.maxX >= w.minX && x.maxY >= w.minY;
      }
      function k(w) {
        return { children: w, height: 1, leaf: !0, minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
      }
      function M(w, x, g, m, v) {
        for (var S = [x, g]; S.length; ) if (!((g = S.pop()) - (x = S.pop()) <= m)) {
          var E = x + Math.ceil((g - x) / m / 2) * m;
          e(w, E, x, g, v), S.push(x, E, E, g);
        }
      }
      return o.prototype.all = function() {
        return this._all(this.data, []);
      }, o.prototype.search = function(w) {
        var x = this.data, g = [];
        if (!d(w, x)) return g;
        for (var m = this.toBBox, v = []; x; ) {
          for (var S = 0; S < x.children.length; S++) {
            var E = x.children[S], y = x.leaf ? m(E) : E;
            d(w, y) && (x.leaf ? g.push(E) : b(w, y) ? this._all(E, g) : v.push(E));
          }
          x = v.pop();
        }
        return g;
      }, o.prototype.collides = function(w) {
        var x = this.data;
        if (!d(w, x)) return !1;
        for (var g = []; x; ) {
          for (var m = 0; m < x.children.length; m++) {
            var v = x.children[m], S = x.leaf ? this.toBBox(v) : v;
            if (d(w, S)) {
              if (x.leaf || b(w, S)) return !0;
              g.push(v);
            }
          }
          x = g.pop();
        }
        return !1;
      }, o.prototype.load = function(w) {
        if (!w || !w.length) return this;
        if (w.length < this._minEntries) {
          for (var x = 0; x < w.length; x++) this.insert(w[x]);
          return this;
        }
        var g = this._build(w.slice(), 0, w.length - 1, 0);
        if (this.data.children.length) if (this.data.height === g.height) this._splitRoot(this.data, g);
        else {
          if (this.data.height < g.height) {
            var m = this.data;
            this.data = g, g = m;
          }
          this._insert(g, this.data.height - g.height - 1, !0);
        }
        else this.data = g;
        return this;
      }, o.prototype.insert = function(w) {
        return w && this._insert(w, this.data.height - 1), this;
      }, o.prototype.clear = function() {
        return this.data = k([]), this;
      }, o.prototype.remove = function(w, x) {
        if (!w) return this;
        for (var g, m, v, S = this.data, E = this.toBBox(w), y = [], N = []; S || y.length; ) {
          if (S || (S = y.pop(), m = y[y.length - 1], g = N.pop(), v = !0), S.leaf) {
            var O = i(w, S.children, x);
            if (O !== -1) return S.children.splice(O, 1), y.push(S), this._condense(y), this;
          }
          v || S.leaf || !b(S, E) ? m ? (g++, S = m.children[g], v = !1) : S = null : (y.push(S), N.push(g), g = 0, m = S, S = S.children[0]);
        }
        return this;
      }, o.prototype.toBBox = function(w) {
        return w;
      }, o.prototype.compareMinX = function(w, x) {
        return w.minX - x.minX;
      }, o.prototype.compareMinY = function(w, x) {
        return w.minY - x.minY;
      }, o.prototype.toJSON = function() {
        return this.data;
      }, o.prototype.fromJSON = function(w) {
        return this.data = w, this;
      }, o.prototype._all = function(w, x) {
        for (var g = []; w; ) w.leaf ? x.push.apply(x, w.children) : g.push.apply(g, w.children), w = g.pop();
        return x;
      }, o.prototype._build = function(w, x, g, m) {
        var v, S = g - x + 1, E = this._maxEntries;
        if (S <= E) return a(v = k(w.slice(x, g + 1)), this.toBBox), v;
        m || (m = Math.ceil(Math.log(S) / Math.log(E)), E = Math.ceil(S / Math.pow(E, m - 1))), (v = k([])).leaf = !1, v.height = m;
        var y = Math.ceil(S / E), N = y * Math.ceil(Math.sqrt(E));
        M(w, x, g, N, this.compareMinX);
        for (var O = x; O <= g; O += N) {
          var P = Math.min(O + N - 1, g);
          M(w, O, P, y, this.compareMinY);
          for (var C = O; C <= P; C += y) {
            var _ = Math.min(C + y - 1, P);
            v.children.push(this._build(w, C, _, m - 1));
          }
        }
        return a(v, this.toBBox), v;
      }, o.prototype._chooseSubtree = function(w, x, g, m) {
        for (; m.push(x), !x.leaf && m.length - 1 !== g; ) {
          for (var v = 1 / 0, S = 1 / 0, E = void 0, y = 0; y < x.children.length; y++) {
            var N = x.children[y], O = u(N), P = (C = w, _ = N, (Math.max(_.maxX, C.maxX) - Math.min(_.minX, C.minX)) * (Math.max(_.maxY, C.maxY) - Math.min(_.minY, C.minY)) - O);
            P < S ? (S = P, v = O < v ? O : v, E = N) : P === S && O < v && (v = O, E = N);
          }
          x = E || x.children[0];
        }
        var C, _;
        return x;
      }, o.prototype._insert = function(w, x, g) {
        var m = g ? w : this.toBBox(w), v = [], S = this._chooseSubtree(m, this.data, x, v);
        for (S.children.push(w), f(S, m); x >= 0 && v[x].children.length > this._maxEntries; ) this._split(v, x), x--;
        this._adjustParentBBoxes(m, v, x);
      }, o.prototype._split = function(w, x) {
        var g = w[x], m = g.children.length, v = this._minEntries;
        this._chooseSplitAxis(g, v, m);
        var S = this._chooseSplitIndex(g, v, m), E = k(g.children.splice(S, g.children.length - S));
        E.height = g.height, E.leaf = g.leaf, a(g, this.toBBox), a(E, this.toBBox), x ? w[x - 1].children.push(E) : this._splitRoot(g, E);
      }, o.prototype._splitRoot = function(w, x) {
        this.data = k([w, x]), this.data.height = w.height + 1, this.data.leaf = !1, a(this.data, this.toBBox);
      }, o.prototype._chooseSplitIndex = function(w, x, g) {
        for (var m, v, S, E, y, N, O, P = 1 / 0, C = 1 / 0, _ = x; _ <= g - x; _++) {
          var T = c(w, 0, _, this.toBBox), A = c(w, _, g, this.toBBox), B = (v = T, S = A, E = void 0, y = void 0, N = void 0, O = void 0, E = Math.max(v.minX, S.minX), y = Math.max(v.minY, S.minY), N = Math.min(v.maxX, S.maxX), O = Math.min(v.maxY, S.maxY), Math.max(0, N - E) * Math.max(0, O - y)), D = u(T) + u(A);
          B < P ? (P = B, m = _, C = D < C ? D : C) : B === P && D < C && (C = D, m = _);
        }
        return m || g - x;
      }, o.prototype._chooseSplitAxis = function(w, x, g) {
        var m = w.leaf ? this.compareMinX : l, v = w.leaf ? this.compareMinY : h;
        this._allDistMargin(w, x, g, m) < this._allDistMargin(w, x, g, v) && w.children.sort(m);
      }, o.prototype._allDistMargin = function(w, x, g, m) {
        w.children.sort(m);
        for (var v = this.toBBox, S = c(w, 0, x, v), E = c(w, g - x, g, v), y = p(S) + p(E), N = x; N < g - x; N++) {
          var O = w.children[N];
          f(S, w.leaf ? v(O) : O), y += p(S);
        }
        for (var P = g - x - 1; P >= x; P--) {
          var C = w.children[P];
          f(E, w.leaf ? v(C) : C), y += p(E);
        }
        return y;
      }, o.prototype._adjustParentBBoxes = function(w, x, g) {
        for (var m = g; m >= 0; m--) f(x[m], w);
      }, o.prototype._condense = function(w) {
        for (var x = w.length - 1, g = void 0; x >= 0; x--) w[x].children.length === 0 ? x > 0 ? (g = w[x - 1].children).splice(g.indexOf(w[x]), 1) : this.clear() : a(w[x], this.toBBox);
      }, o;
    });
  })(Te)), Te.exports;
}
const Sr = /* @__PURE__ */ br(rr);
var ae = { exports: {} }, on, Pn;
function Mr() {
  return Pn || (Pn = 1, on = function(t, e, n, s) {
    var o = t[0], i = t[1], a = !1;
    n === void 0 && (n = 0), s === void 0 && (s = e.length);
    for (var c = (s - n) / 2, f = 0, l = c - 1; f < c; l = f++) {
      var h = e[n + f * 2 + 0], u = e[n + f * 2 + 1], p = e[n + l * 2 + 0], b = e[n + l * 2 + 1], d = u > i != b > i && o < (p - h) * (i - u) / (b - u) + h;
      d && (a = !a);
    }
    return a;
  }), on;
}
var an, Dn;
function Er() {
  return Dn || (Dn = 1, an = function(t, e, n, s) {
    var o = t[0], i = t[1], a = !1;
    n === void 0 && (n = 0), s === void 0 && (s = e.length);
    for (var c = s - n, f = 0, l = c - 1; f < c; l = f++) {
      var h = e[f + n][0], u = e[f + n][1], p = e[l + n][0], b = e[l + n][1], d = u > i != b > i && o < (p - h) * (i - u) / (b - u) + h;
      d && (a = !a);
    }
    return a;
  }), an;
}
var Cn;
function _r() {
  if (Cn) return ae.exports;
  Cn = 1;
  var r = Mr(), t = Er();
  return ae.exports = function(n, s, o, i) {
    return s.length > 0 && Array.isArray(s[0]) ? t(n, s, o, i) : r(n, s, o, i);
  }, ae.exports.nested = t, ae.exports.flat = r, ae.exports;
}
var fe = { exports: {} }, Ir = fe.exports, Vn;
function Ar() {
  return Vn || (Vn = 1, (function(r, t) {
    (function(e, n) {
      n(t);
    })(Ir, function(e) {
      const s = 33306690738754706e-32;
      function o(d, k, M, w, x) {
        let g, m, v, S, E = k[0], y = w[0], N = 0, O = 0;
        y > E == y > -E ? (g = E, E = k[++N]) : (g = y, y = w[++O]);
        let P = 0;
        if (N < d && O < M) for (y > E == y > -E ? (v = g - ((m = E + g) - E), E = k[++N]) : (v = g - ((m = y + g) - y), y = w[++O]), g = m, v !== 0 && (x[P++] = v); N < d && O < M; ) y > E == y > -E ? (v = g - ((m = g + E) - (S = m - g)) + (E - S), E = k[++N]) : (v = g - ((m = g + y) - (S = m - g)) + (y - S), y = w[++O]), g = m, v !== 0 && (x[P++] = v);
        for (; N < d; ) v = g - ((m = g + E) - (S = m - g)) + (E - S), E = k[++N], g = m, v !== 0 && (x[P++] = v);
        for (; O < M; ) v = g - ((m = g + y) - (S = m - g)) + (y - S), y = w[++O], g = m, v !== 0 && (x[P++] = v);
        return g === 0 && P !== 0 || (x[P++] = g), P;
      }
      function i(d) {
        return new Float64Array(d);
      }
      const a = 33306690738754716e-32, c = 22204460492503146e-32, f = 11093356479670487e-47, l = i(4), h = i(8), u = i(12), p = i(16), b = i(4);
      e.orient2d = function(d, k, M, w, x, g) {
        const m = (k - g) * (M - x), v = (d - x) * (w - g), S = m - v;
        if (m === 0 || v === 0 || m > 0 != v > 0) return S;
        const E = Math.abs(m + v);
        return Math.abs(S) >= a * E ? S : -(function(y, N, O, P, C, _, T) {
          let A, B, D, L, I, F, V, $, q, Y, X, U, K, H, Q, W, tt, et;
          const lt = y - C, R = O - C, z = N - _, G = P - _;
          I = (Q = ($ = lt - (V = (F = 134217729 * lt) - (F - lt))) * (Y = G - (q = (F = 134217729 * G) - (F - G))) - ((H = lt * G) - V * q - $ * q - V * Y)) - (X = Q - (tt = ($ = z - (V = (F = 134217729 * z) - (F - z))) * (Y = R - (q = (F = 134217729 * R) - (F - R))) - ((W = z * R) - V * q - $ * q - V * Y))), l[0] = Q - (X + I) + (I - tt), I = (K = H - ((U = H + X) - (I = U - H)) + (X - I)) - (X = K - W), l[1] = K - (X + I) + (I - W), I = (et = U + X) - U, l[2] = U - (et - I) + (X - I), l[3] = et;
          let st = (function(zs, bn) {
            let yn = bn[0];
            for (let Ge = 1; Ge < zs; Ge++) yn += bn[Ge];
            return yn;
          })(4, l), at = c * T;
          if (st >= at || -st >= at || (A = y - (lt + (I = y - lt)) + (I - C), D = O - (R + (I = O - R)) + (I - C), B = N - (z + (I = N - z)) + (I - _), L = P - (G + (I = P - G)) + (I - _), A === 0 && B === 0 && D === 0 && L === 0) || (at = f * T + s * Math.abs(st), (st += lt * L + G * A - (z * D + R * B)) >= at || -st >= at)) return st;
          I = (Q = ($ = A - (V = (F = 134217729 * A) - (F - A))) * (Y = G - (q = (F = 134217729 * G) - (F - G))) - ((H = A * G) - V * q - $ * q - V * Y)) - (X = Q - (tt = ($ = B - (V = (F = 134217729 * B) - (F - B))) * (Y = R - (q = (F = 134217729 * R) - (F - R))) - ((W = B * R) - V * q - $ * q - V * Y))), b[0] = Q - (X + I) + (I - tt), I = (K = H - ((U = H + X) - (I = U - H)) + (X - I)) - (X = K - W), b[1] = K - (X + I) + (I - W), I = (et = U + X) - U, b[2] = U - (et - I) + (X - I), b[3] = et;
          const wt = o(4, l, 4, b, h);
          I = (Q = ($ = lt - (V = (F = 134217729 * lt) - (F - lt))) * (Y = L - (q = (F = 134217729 * L) - (F - L))) - ((H = lt * L) - V * q - $ * q - V * Y)) - (X = Q - (tt = ($ = z - (V = (F = 134217729 * z) - (F - z))) * (Y = D - (q = (F = 134217729 * D) - (F - D))) - ((W = z * D) - V * q - $ * q - V * Y))), b[0] = Q - (X + I) + (I - tt), I = (K = H - ((U = H + X) - (I = U - H)) + (X - I)) - (X = K - W), b[1] = K - (X + I) + (I - W), I = (et = U + X) - U, b[2] = U - (et - I) + (X - I), b[3] = et;
          const Ut = o(wt, h, 4, b, u);
          I = (Q = ($ = A - (V = (F = 134217729 * A) - (F - A))) * (Y = L - (q = (F = 134217729 * L) - (F - L))) - ((H = A * L) - V * q - $ * q - V * Y)) - (X = Q - (tt = ($ = B - (V = (F = 134217729 * B) - (F - B))) * (Y = D - (q = (F = 134217729 * D) - (F - D))) - ((W = B * D) - V * q - $ * q - V * Y))), b[0] = Q - (X + I) + (I - tt), I = (K = H - ((U = H + X) - (I = U - H)) + (X - I)) - (X = K - W), b[1] = K - (X + I) + (I - W), I = (et = U + X) - U, b[2] = U - (et - I) + (X - I), b[3] = et;
          const Xs = o(Ut, u, 4, b, p);
          return p[Xs - 1];
        })(d, k, M, w, x, g, E);
      }, e.orient2dfast = function(d, k, M, w, x, g) {
        return (k - g) * (M - x) - (d - x) * (w - g);
      }, Object.defineProperty(e, "__esModule", { value: !0 });
    });
  })(fe, fe.exports)), fe.exports;
}
var $n;
function Nr() {
  if ($n) return Me.exports;
  $n = 1;
  var r = kr(), t = Sr, e = _r(), n = Ar().orient2d;
  t.default && (t = t.default), Me.exports = s, Me.exports.default = s;
  function s(g, m, v) {
    m = Math.max(0, m === void 0 ? 2 : m), v = v || 0;
    var S = p(g), E = new r(16);
    E.toBBox = function(V) {
      return {
        minX: V[0],
        minY: V[1],
        maxX: V[0],
        maxY: V[1]
      };
    }, E.compareMinX = function(V, $) {
      return V[0] - $[0];
    }, E.compareMinY = function(V, $) {
      return V[1] - $[1];
    }, E.load(g);
    for (var y = [], N = 0, O; N < S.length; N++) {
      var P = S[N];
      E.remove(P), O = b(P, O), y.push(O);
    }
    var C = new r(16);
    for (N = 0; N < y.length; N++) C.insert(u(y[N]));
    for (var _ = m * m, T = v * v; y.length; ) {
      var A = y.shift(), B = A.p, D = A.next.p, L = d(B, D);
      if (!(L < T)) {
        var I = L / _;
        P = o(E, A.prev.p, B, D, A.next.next.p, I, C), P && Math.min(d(P, B), d(P, D)) <= I && (y.push(A), y.push(b(P, A)), E.remove(P), C.remove(A), C.insert(u(A)), C.insert(u(A.next)));
      }
    }
    A = O;
    var F = [];
    do
      F.push(A.p), A = A.next;
    while (A !== O);
    return F.push(A.p), F;
  }
  function o(g, m, v, S, E, y, N) {
    for (var O = new t([], i), P = g.data; P; ) {
      for (var C = 0; C < P.children.length; C++) {
        var _ = P.children[C], T = P.leaf ? k(_, v, S) : a(v, S, _);
        T > y || O.push({
          node: _,
          dist: T
        });
      }
      for (; O.length && !O.peek().node.children; ) {
        var A = O.pop(), B = A.node, D = k(B, m, v), L = k(B, S, E);
        if (A.dist < D && A.dist < L && f(v, B, N) && f(S, B, N)) return B;
      }
      P = O.pop(), P && (P = P.node);
    }
    return null;
  }
  function i(g, m) {
    return g.dist - m.dist;
  }
  function a(g, m, v) {
    if (c(g, v) || c(m, v)) return 0;
    var S = M(g[0], g[1], m[0], m[1], v.minX, v.minY, v.maxX, v.minY);
    if (S === 0) return 0;
    var E = M(g[0], g[1], m[0], m[1], v.minX, v.minY, v.minX, v.maxY);
    if (E === 0) return 0;
    var y = M(g[0], g[1], m[0], m[1], v.maxX, v.minY, v.maxX, v.maxY);
    if (y === 0) return 0;
    var N = M(g[0], g[1], m[0], m[1], v.minX, v.maxY, v.maxX, v.maxY);
    return N === 0 ? 0 : Math.min(S, E, y, N);
  }
  function c(g, m) {
    return g[0] >= m.minX && g[0] <= m.maxX && g[1] >= m.minY && g[1] <= m.maxY;
  }
  function f(g, m, v) {
    for (var S = Math.min(g[0], m[0]), E = Math.min(g[1], m[1]), y = Math.max(g[0], m[0]), N = Math.max(g[1], m[1]), O = v.search({ minX: S, minY: E, maxX: y, maxY: N }), P = 0; P < O.length; P++)
      if (h(O[P].p, O[P].next.p, g, m)) return !1;
    return !0;
  }
  function l(g, m, v) {
    return n(g[0], g[1], m[0], m[1], v[0], v[1]);
  }
  function h(g, m, v, S) {
    return g !== S && m !== v && l(g, m, v) > 0 != l(g, m, S) > 0 && l(v, S, g) > 0 != l(v, S, m) > 0;
  }
  function u(g) {
    var m = g.p, v = g.next.p;
    return g.minX = Math.min(m[0], v[0]), g.minY = Math.min(m[1], v[1]), g.maxX = Math.max(m[0], v[0]), g.maxY = Math.max(m[1], v[1]), g;
  }
  function p(g) {
    for (var m = g[0], v = g[0], S = g[0], E = g[0], y = 0; y < g.length; y++) {
      var N = g[y];
      N[0] < m[0] && (m = N), N[0] > S[0] && (S = N), N[1] < v[1] && (v = N), N[1] > E[1] && (E = N);
    }
    var O = [m, v, S, E], P = O.slice();
    for (y = 0; y < g.length; y++)
      e(g[y], O) || P.push(g[y]);
    return x(P);
  }
  function b(g, m) {
    var v = {
      p: g,
      prev: null,
      next: null,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };
    return m ? (v.next = m.next, v.prev = m, m.next.prev = v, m.next = v) : (v.prev = v, v.next = v), v;
  }
  function d(g, m) {
    var v = g[0] - m[0], S = g[1] - m[1];
    return v * v + S * S;
  }
  function k(g, m, v) {
    var S = m[0], E = m[1], y = v[0] - S, N = v[1] - E;
    if (y !== 0 || N !== 0) {
      var O = ((g[0] - S) * y + (g[1] - E) * N) / (y * y + N * N);
      O > 1 ? (S = v[0], E = v[1]) : O > 0 && (S += y * O, E += N * O);
    }
    return y = g[0] - S, N = g[1] - E, y * y + N * N;
  }
  function M(g, m, v, S, E, y, N, O) {
    var P = v - g, C = S - m, _ = N - E, T = O - y, A = g - E, B = m - y, D = P * P + C * C, L = P * _ + C * T, I = _ * _ + T * T, F = P * A + C * B, V = _ * A + T * B, $ = D * I - L * L, q, Y, X, U, K = $, H = $;
    $ === 0 ? (Y = 0, K = 1, U = V, H = I) : (Y = L * V - I * F, U = D * V - L * F, Y < 0 ? (Y = 0, U = V, H = I) : Y > K && (Y = K, U = V + L, H = I)), U < 0 ? (U = 0, -F < 0 ? Y = 0 : -F > D ? Y = K : (Y = -F, K = D)) : U > H && (U = H, -F + L < 0 ? Y = 0 : -F + L > D ? Y = K : (Y = -F + L, K = D)), q = Y === 0 ? 0 : Y / K, X = U === 0 ? 0 : U / H;
    var Q = (1 - q) * g + q * v, W = (1 - q) * m + q * S, tt = (1 - X) * E + X * N, et = (1 - X) * y + X * O, lt = tt - Q, R = et - W;
    return lt * lt + R * R;
  }
  function w(g, m) {
    return g[0] === m[0] ? g[1] - m[1] : g[0] - m[0];
  }
  function x(g) {
    g.sort(w);
    for (var m = [], v = 0; v < g.length; v++) {
      for (; m.length >= 2 && l(m[m.length - 2], m[m.length - 1], g[v]) <= 0; )
        m.pop();
      m.push(g[v]);
    }
    for (var S = [], E = g.length - 1; E >= 0; E--) {
      for (; S.length >= 2 && l(S[S.length - 2], S[S.length - 1], g[E]) <= 0; )
        S.pop();
      S.push(g[E]);
    }
    return S.pop(), m.pop(), m.concat(S);
  }
  return Me.exports;
}
var Or = Nr();
const Tr = /* @__PURE__ */ vr(Or);
function Ln(r, t = {}) {
  t.concavity = t.concavity || 1 / 0;
  const e = [];
  if (gn(r, (s) => {
    e.push([s[0], s[1]]);
  }), !e.length)
    return null;
  const n = Tr(e, t.concavity);
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
  static from(t, e = Dr, n = Cr) {
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
      const N = t[2 * y], O = t[2 * y + 1];
      N < a && (a = N), O < c && (c = O), N > f && (f = N), O > l && (l = O), this._ids[y] = y;
    }
    const h = (a + f) / 2, u = (c + l) / 2;
    let p = 0, b = 0, d = 0;
    for (let y = 0, N = 1 / 0; y < i; y++) {
      const O = cn(h, u, t[2 * y], t[2 * y + 1]);
      O < N && (p = y, N = O);
    }
    const k = t[2 * p], M = t[2 * p + 1];
    for (let y = 0, N = 1 / 0; y < i; y++) {
      if (y === p) continue;
      const O = cn(k, M, t[2 * y], t[2 * y + 1]);
      O < N && O > 0 && (b = y, N = O);
    }
    let w = t[2 * b], x = t[2 * b + 1], g = 1 / 0;
    for (let y = 0; y < i; y++) {
      if (y === p || y === b) continue;
      const N = Rr(k, M, w, x, t[2 * y], t[2 * y + 1]);
      N < g && (d = y, g = N);
    }
    let m = t[2 * d], v = t[2 * d + 1];
    if (g === 1 / 0) {
      for (let O = 0; O < i; O++)
        this._dists[O] = t[2 * O] - t[0] || t[2 * O + 1] - t[1];
      se(this._ids, this._dists, 0, i - 1);
      const y = new Uint32Array(i);
      let N = 0;
      for (let O = 0, P = -1 / 0; O < i; O++) {
        const C = this._ids[O], _ = this._dists[C];
        _ > P && (y[N++] = C, P = _);
      }
      this.hull = y.subarray(0, N), this.triangles = new Uint32Array(0), this.halfedges = new Int32Array(0);
      return;
    }
    if (ft(k, M, w, x, m, v) < 0) {
      const y = b, N = w, O = x;
      b = d, w = m, x = v, d = y, m = N, v = O;
    }
    const S = Pr(k, M, w, x, m, v);
    this._cx = S.x, this._cy = S.y;
    for (let y = 0; y < i; y++)
      this._dists[y] = cn(t[2 * y], t[2 * y + 1], S.x, S.y);
    se(this._ids, this._dists, 0, i - 1), this._hullStart = p;
    let E = 3;
    n[p] = e[d] = b, n[b] = e[p] = d, n[d] = e[b] = p, s[p] = 0, s[b] = 1, s[d] = 2, o.fill(-1), o[this._hashKey(k, M)] = p, o[this._hashKey(w, x)] = b, o[this._hashKey(m, v)] = d, this.trianglesLen = 0, this._addTriangle(p, b, d, -1, -1, -1);
    for (let y = 0, N = 0, O = 0; y < this._ids.length; y++) {
      const P = this._ids[y], C = t[2 * P], _ = t[2 * P + 1];
      if (y > 0 && Math.abs(C - N) <= Xn && Math.abs(_ - O) <= Xn || (N = C, O = _, P === p || P === b || P === d)) continue;
      let T = 0;
      for (let I = 0, F = this._hashKey(C, _); I < this._hashSize && (T = o[(F + I) % this._hashSize], !(T !== -1 && T !== n[T])); I++)
        ;
      T = e[T];
      let A = T, B;
      for (; B = n[A], ft(C, _, t[2 * A], t[2 * A + 1], t[2 * B], t[2 * B + 1]) >= 0; )
        if (A = B, A === T) {
          A = -1;
          break;
        }
      if (A === -1) continue;
      let D = this._addTriangle(A, P, n[A], -1, -1, s[A]);
      s[P] = this._legalize(D + 2), s[A] = D, E++;
      let L = n[A];
      for (; B = n[L], ft(C, _, t[2 * L], t[2 * L + 1], t[2 * B], t[2 * B + 1]) < 0; )
        D = this._addTriangle(L, P, B, s[P], -1, s[L]), s[P] = this._legalize(D + 2), n[L] = L, E--, L = B;
      if (A === T)
        for (; B = e[A], ft(C, _, t[2 * B], t[2 * B + 1], t[2 * A], t[2 * A + 1]) < 0; )
          D = this._addTriangle(B, P, A, -1, s[A], s[B]), this._legalize(D + 2), s[B] = D, n[A] = A, E--, A = B;
      this._hullStart = e[P] = A, n[A] = e[L] = P, n[P] = L, o[this._hashKey(C, _)] = P, o[this._hashKey(t[2 * A], t[2 * A + 1])] = A;
    }
    this.hull = new Uint32Array(E);
    for (let y = 0, N = this._hullStart; y < E; y++)
      this.hull[y] = N, N = n[N];
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
    return Math.floor(Fr(t - this._cx, e - this._cy) * this._hashSize) % this._hashSize;
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
      const f = a - a % 3, l = c + (t + 1) % 3, h = f + (a + 2) % 3, u = e[i], p = e[t], b = e[l], d = e[h];
      if (Br(
        s[2 * u],
        s[2 * u + 1],
        s[2 * p],
        s[2 * p + 1],
        s[2 * b],
        s[2 * b + 1],
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
        const w = f + (a + 1) % 3;
        o < Ee.length && (Ee[o++] = w);
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
function Fr(r, t) {
  const e = r / (Math.abs(r) + Math.abs(t));
  return (t > 0 ? 3 - e : 1 + e) / 4;
}
function cn(r, t, e, n) {
  const s = r - e, o = t - n;
  return s * s + o * o;
}
function Br(r, t, e, n, s, o, i, a) {
  const c = r - i, f = t - a, l = e - i, h = n - a, u = s - i, p = o - a, b = c * c + f * f, d = l * l + h * h, k = u * u + p * p;
  return c * (h * k - d * p) - f * (l * k - d * u) + b * (l * p - h * u) < 0;
}
function Rr(r, t, e, n, s, o) {
  const i = e - r, a = n - t, c = s - r, f = o - t, l = i * i + a * a, h = c * c + f * f, u = 0.5 / (i * f - a * c), p = (f * l - a * h) * u, b = (i * h - c * l) * u;
  return p * p + b * b;
}
function Pr(r, t, e, n, s, o) {
  const i = e - r, a = n - t, c = s - r, f = o - t, l = i * i + a * a, h = c * c + f * f, u = 0.5 / (i * f - a * c), p = r + (f * l - a * h) * u, b = t + (i * h - c * l) * u;
  return { x: p, y: b };
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
function Dr(r) {
  return r[0];
}
function Cr(r) {
  return r[1];
}
class Vr {
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
class zn extends Vr {
  constructor(t) {
    super(8, new Uint8Array(Math.ceil(t / 8)).fill(0));
  }
}
function Ot(r) {
  return r % 3 === 2 ? r - 2 : r + 1;
}
function At(r) {
  return r % 3 === 0 ? r + 2 : r - 1;
}
function Be(r, t, e, n, s, o, i, a) {
  const c = ft(r, t, s, o, i, a), f = ft(e, n, s, o, i, a);
  if (c > 0 && f > 0 || c < 0 && f < 0)
    return !1;
  const l = ft(s, o, r, t, e, n), h = ft(i, a, r, t, e, n);
  return l > 0 && h > 0 || l < 0 && h < 0 ? !1 : c === 0 && f === 0 && l === 0 && h === 0 ? !(Math.max(s, i) < Math.min(r, e) || Math.max(r, e) < Math.min(s, i) || Math.max(o, a) < Math.min(t, n) || Math.max(t, n) < Math.min(o, a)) : !0;
}
class $r {
  /**
   * The triangulation object from Delaunator.
   */
  del;
  constructor(t) {
    this.del = t;
  }
}
class Jt extends $r {
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
      const h = n[c], u = Ot(c);
      if (h === e)
        return this.protect(c);
      const p = At(c), b = n[p];
      if (b === e)
        return this.protect(u), u;
      if (this.intersectSegments(t, e, b, h)) {
        c = p;
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
      const h = s[c], u = At(c), p = At(h), b = Ot(h);
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
        n[p]
      )) {
        if (l === -1 && (l = c), n[p] === e) {
          if (c === l)
            throw new Error("Infinite loop: non-convex quadrilateral");
          c = l, l = -1;
          continue;
        }
        if (this.intersectSegments(
          t,
          e,
          n[p],
          n[h]
        ))
          c = p;
        else if (this.intersectSegments(
          t,
          e,
          n[b],
          n[p]
        ))
          c = b;
        else if (l === c)
          throw new Error("Infinite loop: no further intersect after non-convex");
        continue;
      }
      if (this.flipDiagonal(c), this.intersectSegments(
        t,
        e,
        n[u],
        n[p]
      ) && (l === -1 && (l = u), l === u))
        throw new Error("Infinite loop: flipped diagonal still intersects");
      n[p] === e ? (f = p, c = l, l = -1) : this.intersectSegments(
        t,
        e,
        n[b],
        n[p]
      ) && (c = b);
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
    const { triangles: n, halfedges: s } = this.del, o = n.length / 3, i = (b, d, k) => {
      const M = t(d), w = t(k);
      return t(b).some((x) => M.includes(x) && w.includes(x));
    }, a = (b) => i(n[b * 3], n[b * 3 + 1], n[b * 3 + 2]), c = (b, d, k, M) => Math.sign(ft(b[d * 2], b[d * 2 + 1], b[k * 2], b[k * 2 + 1], b[M * 2], b[M * 2 + 1])), f = e.map((b) => {
      let d = 0;
      for (let k = 0; k < o; k++) d += c(b, n[k * 3], n[k * 3 + 1], n[k * 3 + 2]);
      return d < 0 ? -1 : 1;
    }), l = (b) => {
      if (this.consd.has(b)) return !1;
      const d = s[b];
      if (d === -1) return !1;
      const k = n[b], M = n[Ot(b)], w = n[At(b)], x = n[At(d)];
      return e.every((g, m) => c(g, w, k, x) === f[m] && c(g, x, M, w) === f[m]);
    };
    let h = 0, u = !0;
    for (; u; ) {
      u = !1;
      for (let b = 0; b < o; b++)
        if (a(b))
          for (let d = 0; d < 3; d++) {
            const k = b * 3 + d;
            if (!l(k)) continue;
            const M = s[k], w = n[k], x = n[Ot(k)], g = n[At(k)], m = n[At(M)];
            if (!(i(g, w, m) && i(m, x, g))) {
              this.protect(this.flipDiagonal(k)), h++, u = !0;
              break;
            }
          }
    }
    let p = 0;
    for (let b = 0; b < o; b++) a(b) && p++;
    return { flips: h, remaining: p };
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
      a = Ot(i), i = o[a];
    } while (i !== -1 && i !== n);
    return s[Ot(a)] === t ? -a : 1 / 0;
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
    const { triangles: e, halfedges: n } = this.del, s = this.flips, o = this.consd, i = n[t], a = At(t), c = Ot(t), f = At(i), l = Ot(i), h = n[a], u = n[f];
    if (o.has(t))
      throw new Error("Trying to flip a constrained edge");
    return e[t] = e[f], n[t] = u, s.set(t, s.has(f)) || o.set(t, o.has(f)), u !== -1 && (n[u] = t), n[a] = f, e[i] = e[a], n[i] = h, s.set(i, s.has(a)) || o.set(i, o.has(a)), h !== -1 && (n[h] = i), n[f] = a, this.markFlip(t), this.markFlip(c), this.markFlip(i), this.markFlip(l), s.add(a), o.delete(a), s.add(f), o.delete(f), this.updateVert(t), this.updateVert(c), this.updateVert(i), this.updateVert(l), a;
  }
  /**
   * Whether point p1, p2, and p are collinear.
   */
  isCollinear(t, e, n) {
    const s = this.del.coords;
    return ft(
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
    const o = e[At(t)], i = e[t], a = e[Ot(t)], c = e[At(s)];
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
      const w = Jt.restore(d);
      return w.constrainAll(M), w;
    };
    for (const M of n?.hull ?? [])
      try {
        i.constrainOne(M[0], M[1]), h.push(M);
      } catch {
        i = k(h);
      }
    n?.boundary && (l = Lr(i, n.boundary), l || (i = k(h))), n && ({ remaining: f } = i.forbidGroupTriangles(
      n.groupsOf,
      n.planes
    ), f -= l?.size ?? 0), c = i.del;
  }
  const u = [];
  for (let d = 0; d < c.triangles.length; d += 3)
    l?.has(d / 3) || u.push([c.triangles[d], c.triangles[d + 1], c.triangles[d + 2]]);
  const p = ["a", "b", "c"];
  return { tin: bt(
    u.map((d) => {
      const k = {}, M = d.map((w, x) => {
        const g = r.features[w], m = g.geometry.coordinates, v = [m[0], m[1]];
        return m.length === 3 ? v[2] = m[2] : k[p[x]] = g.properties[e], v;
      });
      return M[3] = M[0], me([M], k);
    })
  ), remaining: f, hasBoundary: l !== void 0, hull: h };
}
function Lr(r, t) {
  try {
    r.constrainAll(t);
  } catch {
    return;
  }
  const e = new Map(t), { triangles: n, halfedges: s } = r.del, o = (f) => {
    const l = n[f], h = n[Ot(f)];
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
  const n = (c, f, l) => ft(c.x, c.y, f.x, f.y, l.x, l.y), s = [...e].sort((c, f) => c.x - f.x || c.y - f.y), o = (c) => {
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
    const f = i[c], l = i[(c + 1) % i.length], h = l.x - f.x, u = l.y - f.y, p = h * h + u * u, b = e.filter((k) => k !== f && k !== l && n(f, l, k) === 0).map((k) => ({ r: k, t: ((k.x - f.x) * h + (k.y - f.y) * u) / p })).filter(({ t: k }) => k > 0 && k < 1).sort((k, M) => k.t - M.t).map(({ r: k }) => k), d = [f, ...b, l];
    for (let k = 0; k + 1 < d.length; k++) a.push([d[k].i, d[k + 1].i]);
  }
  return a;
}
function le([r, t]) {
  return r < t ? `${r}-${t}` : `${t}-${r}`;
}
function Yt(r, t, e) {
  return Zt(r, { target: { geom: t, index: e } });
}
function Wt(r) {
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
      (p) => p.geometry.coordinates
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
function Xr(r, t) {
  return t ? r.hasBoundary !== t.hasBoundary ? r.hasBoundary : r.diagnostics.boundaryTriangleFlips < t.diagnostics.boundaryTriangleFlips : !0;
}
function qn(r, t, e) {
  return Math.sign(ft(r[0], r[1], t[0], t[1], e[0], e[1]));
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
  const { minx: a, maxx: c, miny: f, maxy: l, centroid: h } = r, u = c - a, p = l - f, b = e.forw.length, d = Array.from({ length: b }, () => []);
  let k = 1;
  for (const [S, E] of e.edges)
    S < n && d[S].push(k), d[E].push(k), E < n && k++;
  const M = (S) => S.slice(0, b).map(({ geometry: E }) => E.coordinates), w = te(M(e.forw)), x = {
    forw: w.filter((S) => !o.has(le(S))),
    bakw: te(M(e.bakw))
  }, g = [0], m = (S) => S >= b ? g : d[S];
  let v;
  for (const S of mn) {
    const E = i?.get(S) ?? { forwReuse: {} };
    i?.set(S, E);
    const y = E.vertices ?? (E.vertices = t(
      {
        ...r,
        minx: a - S * u,
        maxx: c + S * u,
        miny: f - S * p,
        maxy: l + S * p
      },
      !0
    ));
    if (s && (y.length < 4 || !y.every(({ bakw: Y }) => Y.every(Number.isFinite)))) continue;
    const N = y.map(
      ({ forw: Y, bakw: X }, U) => Yt(Y, X, `b${U}`)
    ), O = bt([...e.forw, ...N]), P = bt([
      ...e.bakw,
      ...N.map(Wt)
    ]), C = [O, P].map(
      ({ features: Y }) => Float64Array.from(
        Y.flatMap(
          ({
            geometry: {
              coordinates: [X, U]
            }
          }) => [X, U]
        )
      )
    ), T = s !== void 0 || oe(
      y.map((Y) => Y.forw),
      h.forw,
      -1
    ) && oe(
      y.map((Y) => Y.bakw),
      h.bakw,
      1
    ) ? y.map((Y, X) => [
      b + X,
      b + (X + 1) % y.length
    ]) : void 0, A = { groupsOf: m, planes: C, boundary: T, allowUnusableBoundary: s !== void 0 }, B = s?.orientation ?? -1, D = hn(
      O,
      e.edges,
      "target",
      { ...A, hull: x.forw },
      E.forwReuse
    ), L = E.geographic ?? (E.geographic = (() => {
      const Y = hn(P, e.edges, "target", {
        ...A,
        hull: x.bakw
      });
      return { built: Y, flips: Re(Y.tin, B) };
    })()), I = L.built, F = D.tin, V = {
      ...I.tin,
      features: [...I.tin.features]
    }, $ = Re(F, B) + L.flips, q = {
      vertices: y,
      forw: F,
      bakw: V,
      diagnostics: {
        margin: S,
        boundaryTriangleFlips: $,
        remainingForbiddenTriangles: D.remaining + I.remaining
      },
      hasMapBoundary: D.hasBoundary,
      hasBoundary: D.hasBoundary && I.hasBoundary,
      forwHull: { all: w, applied: D.hull }
    };
    if (s) {
      if (s.accept(q)) return q;
      continue;
    }
    if ($ === 0 && q.hasBoundary)
      return q;
    Xr(q, v) && (v = q);
  }
  return v;
}
const jn = 1e-9;
function zr(r, t) {
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
function Is(r) {
  let t = 1 / 0, e = 0, n = 0;
  return r.forEach((s) => {
    const { forw: o, bakw: i } = s, a = Math.hypot(o[0], o[1]), c = Math.hypot(i[0], i[1]);
    if (c === 0) return;
    const f = a / c, l = Math.atan2(o[0], o[1]) - Math.atan2(i[0], i[1]);
    t = Math.min(t, f), e += Math.cos(l), n += Math.sin(l);
  }), isFinite(t) ? [t, Math.atan2(n, e)] : [1, 0];
}
const Yr = 0.6, qr = 3, Ur = 0.5;
function jr(r) {
  let t = 0, e = 0, n = 0, s = 0;
  if (r.forEach(({ forw: i, bakw: a }) => {
    t += i[1] * a[1] + i[0] * a[0], e += i[0] * a[1] - i[1] * a[0], n += a[0] * a[0] + a[1] * a[1], s += i[0] * i[0] + i[1] * i[1];
  }), !(!(n > 0 && s > 0) || !(Math.hypot(t, e) / Math.sqrt(s * n) >= Ur)))
    return [Math.hypot(t, e) / n, Math.atan2(e, t)];
}
function Gr(r) {
  const t = (s) => Math.hypot(s.forw[0], s.forw[1]), e = Math.max(...r.map(t)), n = r.filter((s) => t(s) >= Yr * e);
  return jr(n.length >= qr ? n : r) ?? Is(r);
}
function Kr(r, t, e, n) {
  const { perQuad: s, aggregate: o } = zr(r, t), i = s.every((l) => l.length > 0), a = e === "birdeye" ? i ? s : [o] : [o], c = n === "farLsq" ? Gr : Is, f = a.map((l) => c(l));
  return f.length === 1 ? [f[0], f[0], f[0], f[0]] : f;
}
function Wr(r, t) {
  let e = 0;
  return r[0] > t[0] && (e += 1), r[1] > t[1] && (e += 2), e;
}
function Hr(r, t, e) {
  const n = [
    r[0] - t.forw[0],
    r[1] - t.forw[1]
  ], o = Math.sqrt(n[0] ** 2 + n[1] ** 2) / e[0], i = Math.atan2(n[0], n[1]) - e[1];
  return [
    t.bakw[0] + o * Math.sin(i),
    t.bakw[1] - o * Math.cos(i)
  ];
}
function Jr(r, t, e, n) {
  const s = t[0] - r[0], o = t[1] - r[1];
  if (Math.abs(s) < 1e-12 && Math.abs(o) < 1e-12) return null;
  const i = n[0] - e[0], a = n[1] - e[1], c = e[0] - r[0], f = e[1] - r[1], l = s * a - o * i;
  if (Math.abs(l) < 1e-12) return null;
  const h = (c * a - f * i) / l, u = (c * o - f * s) / l;
  return h <= 1e-10 || u < -1e-10 || u > 1 + 1e-10 ? null : { t: h, point: [r[0] + h * s, r[1] + h * o] };
}
function Qr(r, t, e) {
  const n = e.length;
  let s = -1 / 0, o = null;
  for (let i = 0; i < n; i++) {
    const a = (i + 1) % n, c = Jr(
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
function Zr(r, t, e, n) {
  const s = r[0], o = r[1], i = t[0], a = t[1], c = e[0], f = e[1], l = n[0], h = n[1];
  if (!(Number.isFinite(s) && Number.isFinite(o) && Number.isFinite(i) && Number.isFinite(a) && Number.isFinite(c) && Number.isFinite(f) && Number.isFinite(l) && Number.isFinite(h)) || s === c || s === l || i === c || i === l || s === i && o === a || c === l && f === h) {
    const F = wr(Sn([r, t]), Sn([e, n]));
    return F.features.length > 0 && F.features[0].geometry ? F.features[0].geometry.coordinates : null;
  }
  const u = s > i || s === i && o > a, p = u ? i : s, b = u ? a : o, d = u ? s : i, k = u ? o : a, M = c > l || c === l && f > h, w = M ? l : c, x = M ? h : f, g = M ? c : l, m = M ? f : h;
  let v, S, E, y, N, O, P, C;
  if (p < w) {
    if (d < w) return null;
    v = w, S = x, E = g, y = m, N = p, O = b, P = d, C = k;
  } else {
    if (g < p) return null;
    v = p, S = b, E = d, y = k, N = w, O = x, P = g, C = m;
  }
  const _ = ft(v, S, E, y, N, O), T = ft(v, S, E, y, P, C);
  if (_ > 0 && T > 0 || _ < 0 && T < 0) return null;
  const A = (C - O) * (E - v) - (P - N) * (y - S), B = (P - N) * (S - O) - (C - O) * (v - N), D = (E - v) * (S - O) - (y - S) * (v - N);
  if (A === 0) return null;
  const L = B / A, I = D / A;
  return L >= 0 && L <= 1 && I >= 0 && I <= 1 ? [v + L * (E - v), S + L * (y - S)] : null;
}
function Kn(r, t, e) {
  const n = r.length, s = new Array(n).fill(1);
  for (const o of t)
    for (let i = 0; i < n; i++) {
      const a = (i + 1) % n, c = Zr(
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
  const { convexBuf: o, centroid: i, allGcps: a, minx: c, maxx: f, miny: l, maxy: h } = r, u = s ? void 0 : Kr(o, i, t, n), b = [
    [c, l],
    [f, l],
    [f, h],
    [c, h]
  ].map((E) => ({
    forw: E,
    bakw: s ? s(E) : Hr(
      E,
      i,
      u[Wr(E, i.forw)]
    )
  }));
  if (b.sort(
    (E, y) => Math.atan2(E.forw[0] - i.forw[0], E.forw[1] - i.forw[1]) - Math.atan2(y.forw[0] - i.forw[0], y.forw[1] - i.forw[1])
  ), s || Kn(b, a, i), !e || r.ring?.cornersOnly) return b;
  const d = 4, k = b.map(
    (E) => Math.atan2(E.forw[0] - i.forw[0], E.forw[1] - i.forw[1])
  ), M = b.map(
    (E) => Math.atan2(
      E.bakw[0] - i.bakw[0],
      -(E.bakw[1] - i.bakw[1])
    )
  );
  function w(E) {
    for (let y = 0; y < d; y++) {
      const N = (y + 1) % d, O = k[y], P = y < d - 1 ? k[N] : k[N] + 2 * Math.PI;
      let C = E;
      for (; C < O; ) C += 2 * Math.PI;
      for (; C >= O + 2 * Math.PI; ) C -= 2 * Math.PI;
      if (C >= O && C < P)
        return { i: y, j: N, frac: (C - O) / (P - O) };
    }
    return { i: 0, j: 1, frac: 0 };
  }
  function x(E) {
    const { i: y, j: N, frac: O } = w(E), P = M[y];
    let _ = M[N] - P;
    for (; _ > Math.PI; ) _ -= 2 * Math.PI;
    for (; _ < -Math.PI; ) _ += 2 * Math.PI;
    return P + O * _;
  }
  const g = new Set(
    b.map(
      (E) => Math.floor(un(E.forw, i.forw) / 10) % 36
    )
  ), m = a.map((E) => ({
    forw: E.forw,
    bakw: E.bakw,
    angleDeg: un(E.forw, i.forw),
    forwDist: Math.hypot(E.forw[0] - i.forw[0], E.forw[1] - i.forw[1])
  })), v = [];
  for (let E = 0; E < 36; E++) {
    if (g.has(E) || r.ring?.skipBins?.has(E)) continue;
    const y = E * 10, N = m.filter((I) => {
      if (I.forwDist === 0) return !1;
      const F = ((I.angleDeg - y) % 360 + 360) % 360;
      return F < 10 + jn || F > 360 - jn;
    });
    let O = null;
    if (N.length > 0) {
      const I = N.reduce((F, V) => V.forwDist > F.forwDist ? V : F);
      O = Gn(i.forw, I.forw, c, f, l, h);
    }
    if (!O) {
      const I = (y + 5) % 360 * (Math.PI / 180), F = [
        i.forw[0] + Math.sin(I),
        i.forw[1] + Math.cos(I)
      ];
      O = Gn(i.forw, F, c, f, l, h);
    }
    if (!O) continue;
    const [P, C] = O, _ = 1e-9 * Math.max(f - c, h - l);
    if ([...b, ...v].some(
      (I) => Math.abs(I.forw[0] - P) <= _ && Math.abs(I.forw[1] - C) <= _
    )) continue;
    if (s) {
      v.push({ forw: O, bakw: s(O) });
      continue;
    }
    const T = [O[0] - i.forw[0], O[1] - i.forw[1]], A = Math.atan2(T[0], T[1]), B = x(A), D = [
      i.bakw[0] + Math.sin(B),
      i.bakw[1] - Math.cos(B)
    ], L = Qr(i.bakw, D, b);
    L && v.push({ forw: O, bakw: L });
  }
  const S = [...b, ...v];
  return S.sort(
    (E, y) => Math.atan2(E.forw[0] - i.forw[0], E.forw[1] - i.forw[1]) - Math.atan2(y.forw[0] - i.forw[0], y.forw[1] - i.forw[1])
  ), s || Kn(S, a, i), S;
}
function As(r, t = !1) {
  return wn(r, "plain", t, t ? "farLsq" : "min");
}
function Ns(r, t = !1) {
  return wn(r, "birdeye", t, "min");
}
function ti(r, t) {
  const e = /* @__PURE__ */ new Set();
  return wn(r, "plain", !0, "min", t).filter(({ forw: [n, s] }) => {
    const o = `${n}:${s}`;
    return e.has(o) ? !1 : (e.add(o), !0);
  });
}
const Wn = (r) => typeof r == "string" && r.startsWith("b");
function ei(r, t) {
  const e = (n, s) => {
    for (let o = 0; o < 3; o++) {
      const i = n.g[o], a = n.g[(o + 1) % 3];
      if (s.g.every((c) => n.sign * ft(i[0], i[1], a[0], a[1], c[0], c[1]) <= 0)) return !0;
    }
    return !1;
  };
  return !e(r, t) && !e(t, r);
}
function ni(r) {
  const t = r.features.map((a) => {
    const { a: c, b: f, c: l } = a.properties, h = [c.geom, f.geom, l.geom], u = a.geometry.coordinates[0].slice(0, 3), p = h.map(([M]) => M), b = h.map(([, M]) => M), d = Math.sign(ft(u[0][0], u[0][1], u[1][0], u[1][1], u[2][0], u[2][1])), k = Math.sign(ft(h[0][0], h[0][1], h[1][0], h[1][1], h[2][0], h[2][1]));
    return {
      ids: [c.index, f.index, l.index],
      f: u,
      g: h,
      sign: k,
      ratio: d * k,
      aux: [c.index, f.index, l.index].some(Wn),
      minx: Math.min(...p),
      maxx: Math.max(...p),
      miny: Math.min(...b),
      maxy: Math.max(...b)
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
        l.sign === 0 || l.miny >= c.maxy || c.miny >= l.maxy || !c.aux && !l.aux || ei(c, l) && (s.add(o[a]), s.add(o[f]));
      }
  }
  const i = /* @__PURE__ */ new Map();
  for (const a of s)
    t[a].ids.forEach((c, f) => {
      Wn(c) && i.set(String(c), t[a].f[f]);
    });
  return [...i.values()];
}
function So(r) {
  return Fe(r, 1 / 0);
}
const Hn = 1e5, si = 16;
function Fe(r, t) {
  return ri(r), new ii(r).findSegmentIntersections(t).map(
    (s) => Zt([s.x, s.y])
  );
}
function ri(r) {
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
class ii {
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
    (o != this._xx.length || this._xx.length != this._yy.length) && Qt("ArcCollection#initXYData() Counting error"), this.initBounds(), this._arcIter = new Ei(this._xx, this._yy);
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
      c = n[h], c > 0 && (f = h * 4, l = _i(t, e, a, c), o[f++] = l[0], o[f++] = l[1], o[f++] = l[2], o[f] = l[3], a += c, i.mergeBounds(l));
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
      (x, g, m, v) => {
        let S = a(v[x]);
        const E = a(v[g]);
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
    const l = this.getUint32Array(ci(i));
    let h = 0;
    const u = [];
    fi(i, (x) => {
      const g = h;
      h += x, u.push(l.subarray(g, h));
    }), li(i, 0), this.forEachSegment(
      (x, g, m, v) => {
        let S = a(v[x]);
        const E = a(v[g]);
        let y, N, O = 0;
        for (; y = i[S], i[S] = y + 2, N = u[S], N[y] = x, N[y + 1] = g, S != E; )
          O++, O > c && Qt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${o}`,
            `s1=${S}`,
            `s2=${E}`
          ), S += E > S ? 1 : -1;
      }
    );
    const p = this.getVertexData(), b = t * si;
    let d = 0;
    const k = /* @__PURE__ */ new Set(), M = /* @__PURE__ */ new Map(), w = (x) => {
      d++;
      const g = Mi(x);
      return k.has(g) || (k.add(g), M.set(`${x.x}:${x.y}`, x)), M.size >= t || d >= b;
    };
    if (p.xx && p.yy)
      for (f = 0; f < o && !hi(u[f], p.xx, p.yy, w); f++)
        ;
    return Array.from(M.values());
  }
}
function Qt(...r) {
  const t = r.join(" ");
  throw new Error(t);
}
function ge(r) {
  return r ? ai(r) ? !0 : oi(r) ? !1 : r.length === 0 ? !0 : r.length > 0 : !1;
}
function oi(r) {
  return r != null && r.toString === String.prototype.toString;
}
function ai(r) {
  return Array.isArray(r);
}
function ci(r, t) {
  ge(r) || Qt("utils.sum() expects an array, received:", r);
  let e = 0, n;
  for (let s = 0, o = r.length; s < o; s++)
    n = r[s], n && (e += n);
  return e;
}
function fi(r, t, e) {
  if (!ge(r))
    throw new Error(`#forEach() takes an array-like argument. ${r}`);
  for (let n = 0, s = r.length; n < s; n++)
    t.call(e, r[n], n);
}
function li(r, t) {
  for (let e = 0, n = r.length; e < n; e++)
    r[e] = t;
  return r;
}
function hi(r, t, e, n) {
  const s = r.length - 2;
  let o, i, a, c, f, l, h, u, p, b, d, k, M, w, x, g, m;
  for (xi(t, r), g = 0; g < s; ) {
    for (o = r[g], i = r[g + 1], f = t[o], l = t[i], p = e[o], b = e[i], m = g; m < s && (m += 2, a = r[m], h = t[a], !(l < h)); ) {
      if (d = e[a], c = r[m + 1], u = t[c], k = e[c], p >= d) {
        if (p > k && b > d && b > k) continue;
      } else if (p < k && b < d && b < k) continue;
      if (!(o == a || o == c || i == a || i == c) && (M = ui(
        f,
        p,
        l,
        b,
        h,
        d,
        u,
        k
      ), M && (w = [o, i], x = [a, c], n(Qn(M, w, x, t, e)) || M.length == 4 && n(Qn(M.slice(2), w, x, t, e)))))
        return !0;
    }
    g += 2;
  }
  return !1;
}
function ui(r, t, e, n, s, o, i, a) {
  const c = di(r, t, e, n, s, o, i, a);
  let f = null;
  return c && (f = gi(r, t, e, n, s, o, i, a), f ? yi(r, t, e, n, s, o, i, a) && (f = null) : f = bi(r, t, e, n, s, o, i, a)), f;
}
function di(r, t, e, n, s, o, i, a) {
  return he(r, t, e, n, s, o) * he(r, t, e, n, i, a) <= 0 && he(s, o, i, a, r, t) * he(s, o, i, a, e, n) <= 0;
}
function he(r, t, e, n, s, o) {
  return Os(r - s, t - o, e - s, n - o);
}
function Os(r, t, e, n) {
  return r * n - t * e;
}
function gi(r, t, e, n, s, o, i, a) {
  let c = Ie(r, t, e, n, s, o, i, a), f;
  return c && (f = mi(c[0], c[1], r, t, e, n, s, o, i, a), f == 1 ? c = Ie(e, n, r, t, s, o, i, a) : f == 2 ? c = Ie(s, o, i, a, r, t, e, n) : f == 3 && (c = Ie(i, a, s, o, r, t, e, n))), c && vi(c, r, t, e, n, s, o, i, a), c;
}
function Ie(r, t, e, n, s, o, i, a) {
  const c = Os(e - r, n - t, i - s, a - o), f = 1e-18;
  let l;
  if (c === 0) return null;
  const h = he(s, o, i, a, r, t) / c;
  return c <= f && c >= -f ? l = pi(r, t, e, n, s, o, i, a) : l = [r + h * (e - r), t + h * (n - t)], l;
}
function pi(r, t, e, n, s, o, i, a) {
  let c = null;
  return !Pt(r, s, i) && !Pt(t, o, a) ? c = [r, t] : !Pt(e, s, i) && !Pt(n, o, a) ? c = [e, n] : !Pt(s, r, e) && !Pt(o, t, n) ? c = [s, o] : !Pt(i, r, e) && !Pt(a, t, n) && (c = [i, a]), c;
}
function Pt(r, t, e) {
  let n;
  return t < e ? n = r < t || r > e : t > e ? n = r > t || r < e : n = r != t, n;
}
function mi(r, t, ...e) {
  let n = -1, s = 1 / 0, o;
  for (let i = 0, a = 0, c = e.length; a < c; i++, a += 2)
    o = wi(r, t, e[a], e[a + 1]), o < s && (s = o, n = i);
  return n;
}
function wi(r, t, e, n) {
  const s = r - e, o = t - n;
  return s * s + o * o;
}
function vi(r, t, e, n, s, o, i, a, c) {
  let f = r[0], l = r[1];
  f = Ae(f, t, n), f = Ae(f, o, a), l = Ae(l, e, s), l = Ae(l, i, c), r[0] = f, r[1] = l;
}
function Ae(r, t, e) {
  let n;
  return Pt(r, t, e) && (n = Math.abs(r - t) < Math.abs(r - e) ? t : e, r = n), r;
}
function bi(r, t, e, n, s, o, i, a) {
  const c = Math.min(r, e, s, i), f = Math.max(r, e, s, i), l = Math.min(t, n, o, a), h = Math.max(t, n, o, a), u = h - l > f - c;
  let p = [];
  return (u ? zt(t, l, h) : zt(r, c, f)) && p.push(r, t), (u ? zt(n, l, h) : zt(e, c, f)) && p.push(e, n), (u ? zt(o, l, h) : zt(s, c, f)) && p.push(s, o), (u ? zt(a, l, h) : zt(i, c, f)) && p.push(i, a), (p.length != 2 && p.length != 4 || p.length == 4 && p[0] == p[2] && p[1] == p[3]) && (p = null), p;
}
function yi(r, t, e, n, s, o, i, a) {
  return r == s && t == o || r == i && t == a || e == s && n == o || e == i && n == a;
}
function zt(r, t, e) {
  return r > t && r < e;
}
function xi(r, t) {
  ki(r, t), Ts(r, t, 0, t.length - 2);
}
function ki(r, t) {
  for (let e = 0, n = t.length; e < n; e += 2)
    r[t[e]] > r[t[e + 1]] && Si(t, e, e + 1);
}
function Si(r, t, e) {
  const n = r[t];
  r[t] = r[e], r[e] = n;
}
function Ts(r, t, e, n) {
  let s = e, o = n, i, a;
  for (; s < n; ) {
    for (i = r[t[e + n >> 2 << 1]]; s <= o; ) {
      for (; r[t[s]] < i; ) s += 2;
      for (; r[t[o]] > i; ) o -= 2;
      s <= o && (a = t[s], t[s] = t[o], t[o] = a, a = t[s + 1], t[s + 1] = t[o + 1], t[o + 1] = a, s += 2, o -= 2);
    }
    if (o - e < 40 ? Jn(r, t, e, o) : Ts(r, t, e, o), n - s < 40) {
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
function Mi(r) {
  return `${r.a.join(",")};${r.b.join(",")}`;
}
class Ei {
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
function _i(r, t, e, n) {
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
function Fs(r, t, e) {
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
function Ii(r, t) {
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
const Ai = 10;
function Ni(r, t, e, n, s, o) {
  if (!r && !t) return !1;
  const i = r ? 0 : 1, a = 1 - i, c = e[i], f = e[a];
  if (!c || !f) return !1;
  const l = It(f.geom);
  let h = !1, u = !1;
  for (let p = 0; p <= 1; p++) {
    const b = n[p];
    if (!b) continue;
    const d = [String(b.prop.index), String(c.prop.index)].sort().join("-"), k = s[d];
    if (!k || k.length < 2) continue;
    const M = k.find(
      (O) => O.bakw !== o[i].bakw
    );
    if (!M) continue;
    const x = ue(M.bakw).find(
      (O) => String(O.prop.index) !== String(b.prop.index) && String(O.prop.index) !== String(c.prop.index)
    );
    if (!x) continue;
    h = !0;
    const g = It(x.geom), m = It(b.geom), v = It(c.geom), S = v[0] - m[0], E = v[1] - m[1], y = S * (l[1] - m[1]) - E * (l[0] - m[0]), N = S * (g[1] - m[1]) - E * (g[0] - m[0]);
    if (y * N > 0) {
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
  const s = Ii(e, n), o = /* @__PURE__ */ new Set();
  let i = !1;
  for (let a = 0; a < Ai; a++) {
    let c = !1;
    for (const f of Object.keys(t)) {
      if (o.has(f)) continue;
      o.add(f);
      const l = t[f];
      if (!l || l.length < 2) continue;
      const h = f.split("-");
      if (h.length !== 2 || s.has(f)) continue;
      const u = ue(l[0].bakw), p = ue(l[1].bakw), b = ue(l[0].forw), d = ue(l[1].forw), k = h.map(
        (I) => u.find((F) => `${F.prop.index}` === I) || p.find((F) => `${F.prop.index}` === I)
      ), M = h.map(
        (I) => b.find((F) => `${F.prop.index}` === I) || d.find((F) => `${F.prop.index}` === I)
      );
      if (k.some((I) => !I) || M.some((I) => !I))
        continue;
      const w = [u, p].map(
        (I) => I.find((F) => !h.includes(`${F.prop.index}`))
      ), x = [b, d].map(
        (I) => I.find((F) => !h.includes(`${F.prop.index}`))
      );
      if (w.some((I) => !I) || x.some((I) => !I))
        continue;
      const g = l[0].bakw.geometry.coordinates[0].slice(0, 3).map((I) => It(I)), m = l[1].bakw.geometry.coordinates[0].slice(0, 3).map((I) => It(I)), v = l[0].forw.geometry.coordinates[0].slice(0, 3).map((I) => It(I)), S = l[1].forw.geometry.coordinates[0].slice(0, 3).map((I) => It(I)), E = Ne(g), y = Ne(m), N = Ne(v), O = Ne(S), P = Ni(
        E,
        y,
        w,
        k,
        t,
        l
      ), C = Oi(
        N,
        O,
        w,
        k
      );
      if (!(P || C || es(
        It(w[0].geom),
        m
      ) || es(
        It(w[1].geom),
        g
      )))
        continue;
      const T = M.map(
        (I) => It(I.geom)
      ), A = x.map(
        (I) => It(I.geom)
      ), B = Fi([
        ...T,
        ...A
      ]), D = Bi(B), L = ns(
        T[0],
        T[1],
        A[0]
      ) + ns(
        T[0],
        T[1],
        A[1]
      );
      dn(D, L) && (ts(t, l[0], r), ts(t, l[1], r), k.forEach((I) => {
        if (!I) return;
        const F = [
          I.geom,
          w[0].geom,
          w[1].geom,
          I.geom
        ], V = {
          a: I.prop,
          b: w[0].prop,
          c: w[1].prop
        }, $ = me([F], V), q = ln($);
        Fs(t, {
          forw: q,
          bakw: $
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
  const [e, n] = t[0], [s, o] = t[1], [i, a] = t[2], c = i - e, f = a - n, l = s - e, h = o - n, u = r[0] - e, p = r[1] - n, b = c * c + f * f, d = c * l + f * h, k = c * u + f * p, M = l * l + h * h, w = l * u + h * p, x = b * M - d * d;
  if (x === 0) return !1;
  const g = 1 / x, m = (M * k - d * w) * g, v = (b * w - d * k) * g, S = 1e-9;
  return m >= -S && v >= -S && m + v <= 1 + S;
}
function Fi(r) {
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
function Bi(r) {
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
const Ri = (r) => typeof r == "string" && r.startsWith("b");
function Pi(r, t) {
  const e = (n, s) => {
    for (let o = 0; o < 3; o++) {
      const i = n.g[o], a = n.g[(o + 1) % 3];
      if (s.g.every((c) => n.sign * ft(i[0], i[1], a[0], a[1], c[0], c[1]) <= 0)) return !0;
    }
    return !1;
  };
  return !e(r, t) && !e(t, r);
}
function Di(r, t, e) {
  if (t.length === 0) return [];
  const n = r.features.map((d) => {
    const { a: k, b: M, c: w } = d.properties, x = [k.geom, M.geom, w.geom], [g, m, v] = d.geometry.coordinates[0], S = x.map(([O]) => O), E = x.map(([, O]) => O), y = Math.sign(ft(g[0], g[1], m[0], m[1], v[0], v[1])), N = Math.sign(ft(x[0][0], x[0][1], x[1][0], x[1][1], x[2][0], x[2][1]));
    return {
      ids: [k.index, M.index, w.index].map(String),
      g: x,
      sign: N,
      ratio: y * N,
      aux: [k.index, M.index, w.index].some(Ri),
      minx: Math.min(...S),
      maxx: Math.max(...S),
      miny: Math.min(...E),
      maxy: Math.max(...E)
    };
  }), s = n.map((d) => d.ratio), o = s.reduce((d, k) => d + k, 0) < 0 ? -1 : 1, i = (d, k) => d < k ? `${d}|${k}` : `${k}|${d}`, a = /* @__PURE__ */ new Map();
  n.forEach((d, k) => {
    for (let M = 0; M < 3; M++) {
      const w = i(d.ids[M], d.ids[(M + 1) % 3]), x = a.get(w);
      x ? x.push(k) : a.set(w, [k]);
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
        const w = n[u[M]];
        if (w.minx >= k.maxx) break;
        w.sign === 0 || w.miny >= k.maxy || k.miny >= w.maxy || !l(u[d]) && !l(u[M]) || Pi(k, w) && (h.add(u[d]), h.add(u[M]));
      }
  }
  if (h.size === 0) return [];
  const p = t.filter((d) => (a.get(c(d)) ?? []).some((k) => h.has(k)));
  if (p.length > 0) return p;
  const b = /* @__PURE__ */ new Set();
  for (const d of h) for (const k of n[d].ids) k.startsWith("b") || b.add(k);
  return t.filter(
    ([d, k]) => b.has(String(e[d])) || b.has(String(e[k]))
  );
}
const ie = 0, Ce = (r) => r + 1, Dt = 1, Tt = 2, ss = 4, rs = 1e-6, Ci = 0.2, Vi = 4, Bs = Math.sign(
  Le(0, 0, 1, 0, 0, 1, 0.25, 0.25) * ft(0, 0, 1, 0, 0, 1)
), dt = (r) => [
  r[0],
  r[1]
];
function is(r) {
  const t = r.length;
  if (t < 3) return !1;
  for (let e = 0; e < t; e++) {
    const n = r[e], s = r[(e + 1) % t], o = r[(e + 2) % t];
    if (Ht(n, s, o) === 0 && (n[0] - s[0]) * (o[0] - s[0]) + (n[1] - s[1]) * (o[1] - s[1]) > 0)
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
function it(r, t) {
  return r < t ? r * os + t : t * os + r;
}
const Ht = (r, t, e) => Math.sign(ft(r[0], r[1], t[0], t[1], e[0], e[1])), Oe = (r, t, e) => Math.abs((t[0] - r[0]) * (e[1] - r[1]) - (e[0] - r[0]) * (t[1] - r[1]));
class $i {
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
        const c = it(o[a], o[(a + 1) % 3]), f = s.get(c);
        f ? f.push(i) : s.set(c, [i]);
      }
    });
    for (let o = 0; o < this.triangles.length; o++) {
      const i = this.triangles[o];
      if (t(i))
        for (let a = 0; a < 3; a++) {
          const c = i[a], f = i[(a + 1) % 3], l = i[(a + 2) % 3], h = it(c, f);
          if (n.has(h)) continue;
          const u = s.get(h);
          if (u.length !== 2) continue;
          const p = u[0] === o ? u[1] : u[0], b = this.triangles[p].find((M) => M !== c && M !== f), d = [
            [c, b, l],
            [b, f, l]
          ], k = e([i, this.triangles[p]], d, it(l, b));
          if (k) {
            for (const M of k) n.add(M);
            return this.triangles[o] = d[0], this.triangles[p] = d[1], !0;
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
      const c = it(o[a], o[(a + 1) % 3]), f = this.byEdge.get(c);
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
      const o = it(e[s], e[(s + 1) % 3]), i = this.byEdge.get(o);
      i.length === 1 ? this.byEdge.delete(o) : i.splice(i.indexOf(t), 1);
    }
    this.bad.delete(t);
    const n = this.forbiddenGroup(e[0], e[1], e[2]);
    n === ie ? this.forbiddenBoundary-- : n !== void 0 && this.forbiddenEdge--;
  }
  hasEdge(t, e) {
    return this.byEdge.has(it(t, e));
  }
  flagsOf(t, e) {
    return this.edgeFlags.get(it(t, e)) ?? 0;
  }
  setFlag(t, e, n) {
    const s = it(t, e);
    this.edgeFlags.set(s, (this.edgeFlags.get(s) ?? 0) | n);
  }
  clearFlag(t, e, n) {
    const s = it(t, e), o = (this.edgeFlags.get(s) ?? 0) & ~n;
    o ? this.edgeFlags.set(s, o) : this.edgeFlags.delete(s);
  }
  // ── 判定 ──
  /** 三角形の合格（S1）: 両面の向きの積が σ に等しい。面積 0 は不合格。向きは厳密な述語で取る。 */
  ok(t, e, n, s = this.vertexAt) {
    const o = s(t), i = s(e), a = s(n);
    return Ht(o.forw, i.forw, a.forw) * Ht(o.bakw, i.bakw, a.bakw) === this.sigma;
  }
  /** 新しく作る三角形の合格: ok に加えて、両面とも 2×面積が閾値以上。 */
  okNew(t, e, n, s = this.vertexAt) {
    if (!this.ok(t, e, n, s)) return !1;
    const o = s(t), i = s(e), a = s(n);
    return Oe(o.forw, i.forw, a.forw) >= rs && Oe(o.bakw, i.bakw, a.bakw) >= rs;
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
    const [e, n, s] = this.triangles.get(t), o = Ht(
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
        const c = i[a], f = i[(a + 1) % 3], l = this.byEdge.get(it(c, f));
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
    const n = (R) => ({
      ok: !1,
      reason: R
    });
    if (!e.unlimited && t.size > this.triangles.size * Ci)
      return n("tooLarge");
    const s = new Set(e.remove ?? []), o = [], i = /* @__PURE__ */ new Set();
    let a = 0;
    for (const R of t) {
      const z = this.positive(R);
      if (!z) return n("notDisk");
      for (let G = 0; G < 3; G++) {
        const st = z[G], at = z[(G + 1) % 3], wt = this.byEdge.get(it(st, at));
        if (wt.length > 2) return n("notDisk");
        wt.length === 2 && t.has(wt[0]) && t.has(wt[1]) || wt.length === 1 && (s.has(st) || s.has(at)) || (wt.length === 1 && a++, o.push([st, at]), i.add(st).add(at));
      }
    }
    if (o.length < 3) return n("notDisk");
    const c = new Set(e.add ?? []);
    for (const R of t)
      for (const z of this.triangles.get(R))
        !i.has(z) && !s.has(z) && c.add(z);
    for (const R of s) {
      if (i.has(R)) return n("notDisk");
      for (const z of this.byVertex.get(R))
        if (!t.has(z)) return n("notDisk");
    }
    for (const R of e.move?.keys() ?? [])
      if (!c.has(R)) return n("notDisk");
    const f = (R) => {
      const z = e.move?.get(R), G = this.vertices.get(R);
      return z ? { ...G, ...z } : G;
    }, l = e.outerRing;
    if (l) {
      if (l.some((R) => !c.has(R))) return n("boundary");
      for (const R of ["forw", "bakw"])
        if (!is(l.map((z) => f(z)[R])))
          return n("boundary");
    }
    const h = [...i, ...c], u = new Map(h.map((R, z) => [R, z])), p = /* @__PURE__ */ new Set(), b = [];
    for (const [R, z] of o)
      p.add(it(R, z)), b.push([u.get(R), u.get(z)]);
    const d = /* @__PURE__ */ new Set();
    if (l)
      for (let R = 0; R < l.length; R++) {
        const z = l[R], G = l[(R + 1) % l.length];
        d.add(it(z, G)), b.push([u.get(z), u.get(G)]);
      }
    const k = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Set(), w = new Set(
      (e.release ?? []).map(([R, z]) => it(R, z))
    );
    for (const R of t) {
      const z = this.triangles.get(R);
      for (let G = 0; G < 3; G++) {
        const st = z[G], at = z[(G + 1) % 3], wt = it(st, at);
        p.has(wt) || (M.add(wt), (this.edgeFlags.get(wt) ?? 0) & (Dt | Tt) && (s.has(st) || s.has(at) || w.has(wt) || k.set(wt, [st, at])));
      }
    }
    for (const [R, z] of e.constrain ?? []) {
      if (!u.has(R) || !u.has(z)) return n("constraint");
      const G = it(R, z);
      !p.has(G) && !d.has(G) && k.set(G, [R, z]);
    }
    for (const [R, z] of k.values())
      b.push([u.get(R), u.get(z)]);
    let x;
    const g = [];
    try {
      const R = Xe.from(h.map((st) => f(st).forw));
      if (R.triangles.length === 0) return n("constraint");
      let z = new Jt(R, b);
      const G = (e.soft ?? []).filter(
        ([st, at]) => u.has(st) && u.has(at) && !p.has(it(st, at)) && !d.has(it(st, at)) && !k.has(it(st, at))
      );
      if (G.length > 0) {
        const st = z.snapshot();
        for (const at of G)
          try {
            z.constrainOne(u.get(at[0]), u.get(at[1])), g.push([at[0], at[1], at[2]]);
          } catch {
            z = Jt.restore(st), z.constrainAll(
              g.map(([wt, Ut]) => [
                u.get(wt),
                u.get(Ut)
              ])
            );
          }
      }
      x = z.del;
    } catch {
      return n("constraint");
    }
    const { triangles: m, halfedges: v } = x, S = m.length / 3, E = (R) => f(h[R]).forw;
    let y = 0, N = 0;
    for (let R = 0; R < S; R++) {
      const z = E(m[R * 3]), G = E(m[R * 3 + 1]), st = E(m[R * 3 + 2]), at = Oe(z, G, st);
      if (at > N) {
        const wt = Ht(z, G, st);
        wt !== 0 && (N = at, y = wt);
      }
    }
    if (y === 0) return n("count");
    const O = /* @__PURE__ */ new Map();
    for (let R = 0; R < m.length; R++)
      O.set(m[R] * h.length + m[Ot(R)], R);
    const P = /* @__PURE__ */ new Set();
    for (const [R, z] of o) {
      const G = u.get(R), st = u.get(z), at = O.get(
        y > 0 ? G * h.length + st : st * h.length + G
      );
      if (at === void 0) return n("pointOutside");
      P.add(at);
    }
    const C = (R) => d.size > 0 && d.has(it(h[m[R]], h[m[Ot(R)]])), _ = /* @__PURE__ */ new Set(), T = [];
    for (const R of P) {
      const z = Math.floor(R / 3);
      _.has(z) || (_.add(z), T.push(z));
    }
    for (let R = 0; R < T.length; R++)
      for (let z = T[R] * 3; z < T[R] * 3 + 3; z++) {
        if (P.has(z) || C(z)) continue;
        const G = v[z];
        if (G === -1 || P.has(G)) return n("pointOutside");
        const st = Math.floor(G / 3);
        _.has(st) || (_.add(st), T.push(st));
      }
    for (const R of P) {
      const z = v[R];
      if (z !== -1 && !P.has(z) && _.has(Math.floor(z / 3)))
        return n("pointOutside");
    }
    for (let R = 0; R < m.length; R++) {
      if (!C(R) || !_.has(Math.floor(R / 3))) continue;
      const z = v[R];
      if (z !== -1 && _.has(Math.floor(z / 3))) return n("boundary");
    }
    const A = [], B = /* @__PURE__ */ new Set();
    for (const R of _) {
      const z = h[m[R * 3]], G = h[m[R * 3 + 1]], st = h[m[R * 3 + 2]];
      B.add(z).add(G).add(st), A.push(y === this.forwSign ? [z, G, st] : [z, st, G]);
    }
    for (const R of c) if (!B.has(R)) return n("pointOutside");
    const D = /* @__PURE__ */ new Set();
    for (const [R, z, G] of A)
      D.add(it(R, z)).add(it(z, G)).add(it(G, R));
    for (const R of k.keys())
      if (!D.has(R)) return n("constraint");
    for (const R of d)
      if (!D.has(R)) return n("boundary");
    const L = g.map(([R, z]) => it(R, z)).filter((R) => D.has(R)), I = /* @__PURE__ */ new Set([
      ...p,
      ...d,
      ...k.keys(),
      ...L
    ]), F = new $i(A), V = (R) => Ht(f(R[0]).forw, f(R[1]).forw, f(R[2]).forw) === this.forwSign && this.okNew(R[0], R[1], R[2], f), $ = (R) => this.forbiddenGroup(R[0], R[1], R[2]) !== void 0, q = e.allowBad || e.forwOnly, Y = e.forwOnly ? 0 : F.repair(
      (R) => !this.okNew(R[0], R[1], R[2], f),
      (R, z) => z.every(V) ? [] : void 0,
      I
    );
    if (!q) {
      for (const R of F.triangles) if (!V(R)) return n("notStrict");
    }
    let X = 0;
    for (const R of t) {
      const [z, G, st] = this.triangles.get(R);
      this.forbiddenGroup(z, G, st) !== void 0 && X++;
    }
    const U = () => F.triangles.filter($).length, K = [];
    let H = 0;
    if (U() > X && (H = F.repair(
      $,
      (R, z, G) => {
        if (z.every(V) && !(z.filter($).length >= R.filter($).length))
          return K.push(G), [G];
      },
      I,
      () => U() <= X
    ), U() > X && !q))
      return n("forbidden");
    A.splice(0, A.length, ...F.triangles);
    for (const [R, z] of e.move ?? []) {
      const G = this.vertices.get(R);
      G.forw = dt(z.forw), G.bakw = dt(z.bakw);
    }
    const Q = [...t];
    for (const R of Q) this.removeTriangle(R);
    const W = A.map(([R, z, G]) => this.addTriangle(R, z, G));
    for (const R of M) {
      const z = (this.edgeFlags.get(R) ?? 0) & ~ss;
      z && this.byEdge.has(R) ? this.edgeFlags.set(R, z) : this.edgeFlags.delete(R);
    }
    for (const [R, z] of e.release ?? [])
      !s.has(R) && !s.has(z) && this.clearFlag(R, z, Dt);
    for (const [R, z, G] of e.constrain ?? [])
      G && this.setFlag(R, z, G);
    for (const [R, z, G] of g)
      G && this.hasEdge(R, z) && this.setFlag(R, z, G);
    for (const R of K)
      this.byEdge.has(R) && this.edgeFlags.set(R, (this.edgeFlags.get(R) ?? 0) | ss);
    for (const R of s) this.dropVertex(R);
    l && (this.boundarySimple = a === 0 && e.replacesWholeBoundary ? !0 : this.computeBoundarySimple()), this.revision++;
    const tt = new Set(Q), et = new Set(W);
    let lt = 0;
    return e.noPolish || (lt = this.polish(
      o,
      Vi * o.length,
      tt,
      et,
      e.forwOnly
    )), {
      ok: !0,
      removed: [...tt],
      added: [...et],
      soft: g.map(([R, z]) => [R, z]),
      flips: {
        overlap: Y,
        forbidden: H,
        polish: lt
      }
    };
  }
  /**
   * 辺を共有する 2 つの三角形の対角線を入れ替える。新しい 2 つの三角形が、紙の面で正しい向き（凸な四辺形）で、
   * 両方 okNew で、禁止制約の違反を増やさないときだけ行う。行ったら、四辺形の外周の 4 辺を返す。
   */
  flipEdge(t, e, n, s, o = !1) {
    const i = this.byEdge.get(it(t, e));
    if (!i || i.length !== 2) return;
    const a = this.positive(i[0]);
    if (!a) return;
    const c = a.findIndex(
      (M, w) => (M === t || M === e) && (a[(w + 1) % 3] === t || a[(w + 1) % 3] === e)
    ), f = a[c], l = a[(c + 1) % 3], h = a[(c + 2) % 3], u = this.triangles.get(i[1]).find((M) => M !== t && M !== e), p = [
      [f, u, h],
      [u, l, h]
    ], b = this.vertexAt;
    for (const [M, w, x] of p)
      if (Ht(b(M).forw, b(w).forw, b(x).forw) <= 0 || !o && !this.okNew(M, w, x)) return;
    const d = (M) => M.filter(([w, x, g]) => this.forbiddenGroup(w, x, g) !== void 0).length, k = i.map((M) => this.triangles.get(M));
    if (!(d(p) > d(k))) {
      for (const M of [...i])
        this.removeTriangle(M), s?.has(M) ? s.delete(M) : n?.add(M);
      for (const [M, w, x] of p) {
        const g = this.forwSign > 0 ? this.addTriangle(M, w, x) : this.addTriangle(M, x, w);
        s?.add(g);
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
      const [f, l] = i[c], h = it(f, l);
      if ((this.edgeFlags.get(h) ?? 0) !== 0) continue;
      const u = this.byEdge.get(h);
      if (!u || u.length !== 2) continue;
      const p = this.positive(u[0]);
      if (!p) continue;
      const b = this.triangles.get(u[1]).find((g) => g !== f && g !== l), [d, k, M, w] = [...p, b].map((g) => this.vertices.get(g).forw);
      if (Le(d[0], d[1], k[0], k[1], M[0], M[1], w[0], w[1]) * Bs <= 0)
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
        if (it(c, f) === s) {
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
            if (!((this.edgeFlags.get(it(a, c)) ?? 0) & Dt) && this.flipEdge(a, c)) {
              this.edgeFlags.delete(it(a, c)), n = !0, t++;
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
    for (const [l, [h, u, p]] of this.triangles) {
      this.ok(h, u, p) || t.push(l);
      const b = this.forbiddenGroup(h, u, p);
      b === ie ? e++ : b !== void 0 && n++, s += Oe(
        this.vertices.get(h).forw,
        this.vertices.get(u).forw,
        this.vertices.get(p).forw
      ) / 2;
      for (const [d, k] of [
        [h, u],
        [u, p],
        [p, h]
      ]) {
        const M = it(d, k);
        i.set(M, (i.get(M) ?? 0) + 1), this.byEdge.get(M)?.includes(l) || (o = !1), this.byVertex.get(d)?.has(l) || (o = !1);
      }
    }
    let a = 0;
    for (const [l, h] of i)
      h > 2 && a++, this.byEdge.get(l)?.length !== h && (o = !1);
    i.size !== this.byEdge.size && (o = !1);
    let c = 0;
    for (const [l, h] of this.byVertex)
      this.vertices.has(l) || (o = !1), c += h.size;
    c !== this.triangles.size * 3 && (o = !1);
    let f = 0;
    for (const [l, h] of this.edgeFlags)
      h & Dt && !this.byEdge.has(l) && f++;
    return {
      triangles: this.triangles.size,
      bad: t,
      badMatches: t.length === this.bad.size && t.every((l) => this.bad.has(l)),
      indexMatches: o,
      nonManifoldEdges: a,
      boundarySimple: this.computeBoundarySimple(),
      missingRequired: f,
      forbiddenBoundary: e,
      forbiddenEdge: n,
      forbiddenMatches: e === this.forbiddenBoundary && n === this.forbiddenEdge,
      forwArea: s
    };
  }
}
const as = (r, t, e) => Math.sign(ft(r[0], r[1], t[0], t[1], e[0], e[1]));
function Li(r, t, e, n, s) {
  const o = /* @__PURE__ */ new Map();
  for (const p of r) {
    const { index: b, geom: d } = p.properties.target;
    o.set(b, { forw: p.geometry.coordinates, bakw: d });
  }
  let i = 0, a = 0;
  for (const p of t.features) {
    const { a: b, b: d, c: k } = p.properties, [M, w, x] = [b, d, k].map(({ index: m }) => o.get(m));
    if (!M || !w || !x) return;
    const g = as(M.forw, w.forw, x.forw);
    a += g, i += g * as(M.bakw, w.bakw, x.bakw);
  }
  if ((i < 0 ? -1 : 1) !== s) return;
  const c = new ze(s, a < 0 ? -1 : 1), f = { mesh: c, indexOf: /* @__PURE__ */ new Map(), interior: [], ring: [] }, l = /* @__PURE__ */ new Map(), h = r.map(() => []);
  let u = 1;
  for (const [p, b] of e)
    p < n && h[p].push(u), h[b].push(u), b < n && u++;
  r.forEach((p, b) => {
    const { index: d, geom: k } = p.properties.target, M = typeof d == "string" && d.startsWith("b"), w = c.addVertex(
      M ? { kind: "boundary", order: f.ring.length } : typeof d == "number" ? { kind: "gcp", id: d } : { kind: "edgeNode", edge: -1, order: b },
      p.geometry.coordinates,
      k,
      M ? [ie] : h[b]
    );
    l.set(d, w), f.indexOf.set(w, d), (M ? f.ring : f.interior).push(w);
  });
  for (const p of t.features) {
    const { a: b, b: d, c: k } = p.properties;
    c.addTriangle(l.get(b.index), l.get(d.index), l.get(k.index));
  }
  for (const [p, b] of e)
    c.setFlag(f.interior[p], f.interior[b], Dt);
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
function Rs(r, t) {
  const { mesh: e } = r, n = r.ring.length;
  for (let d = 0; d < n; d++)
    if (e.byEdge.get(it(r.ring[d], r.ring[(d + 1) % n]))?.length !== 1)
      return { ok: !1, reason: "bandNotAnnulus" };
  for (const d of r.ring) {
    let k = 0;
    for (const M of e.byVertex.get(d)) {
      const w = e.triangles.get(M);
      for (let x = 0; x < 3; x++) {
        const g = w[x], m = w[(x + 1) % 3];
        (g === d || m === d) && e.byEdge.get(it(g, m)).length === 1 && k++;
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
    k & Tt && f.push([d, k]);
  for (const [d, k] of f)
    k & ~Tt ? e.edgeFlags.set(d, k & ~Tt) : e.edgeFlags.delete(d);
  const l = [], h = [];
  for (const [d, k] of t.hull) {
    const M = a[d], w = a[k];
    if (M === void 0 || w === void 0 || c.has(M) || c.has(w)) continue;
    l.push([M, w]);
    const x = e.byEdge.get(it(M, w));
    x && !x.every((g) => s.has(g)) ? e.setFlag(M, w, Tt) : h.push([M, w, Tt]);
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
      k & Tt && (k & ~Tt ? e.edgeFlags.set(d, k & ~Tt) : e.edgeFlags.delete(d));
    for (const [d, k] of f) e.edgeFlags.set(d, (e.edgeFlags.get(d) ?? 0) | k);
    return u;
  }
  for (const d of r.ring) r.indexOf.delete(d);
  i.forEach((d, k) => r.indexOf.set(d, `b${k}`));
  for (const { index: d, vertex: k } of o) r.indexOf.set(k, d);
  r.ring = i, r.interior = a;
  const p = new Map(a.map((d, k) => [d, k])), b = [];
  for (const [d, k] of l)
    e.hasEdge(d, k) && (e.setFlag(d, k, Tt), b.push([p.get(d), p.get(k)]));
  return { ok: !0, applied: b, removed: u.removed, added: u.added };
}
function Yi(r) {
  const { mesh: t } = r;
  let e = 0;
  for (const n of t.bad)
    t.triangles.get(n).some((o) => t.vertices.get(o).ref.kind === "boundary") && e++;
  return e;
}
const qi = 4, cs = 32, Ui = 1, ji = 0.4, Ps = 4, Gi = 1e-4, Ds = 0.25, Ki = 0.01, qt = (r, t) => String(r) < String(t) ? `${r}|${t}` : `${t}|${r}`;
function fn(r, t, e) {
  const n = t.filter((f) => !String(f.properties.target.index).startsWith("b")).map((f) => ({
    id: f.properties.target.index,
    paper: f.geometry.coordinates,
    geo: f.properties.target.geom
  })), s = /* @__PURE__ */ new Set();
  let o = 0, i = 0;
  const a = r.features.map((f) => {
    const { a: l, b: h, c: u } = f.properties, [p, b, d] = f.geometry.coordinates[0];
    s.add(qt(l.index, h.index)), s.add(qt(l.index, u.index)), s.add(qt(h.index, u.index));
    const k = Math.sign(ft(p[0], p[1], b[0], b[1], d[0], d[1])) * Math.sign(ft(l.geom[0], l.geom[1], h.geom[0], h.geom[1], u.geom[0], u.geom[1]));
    return k > 0 ? o++ : k < 0 && i++, {
      ids: [String(l.index), String(h.index), String(u.index)],
      paper: [p, b, d],
      geo: [l.geom, h.geom, u.geom],
      sign: k
    };
  }), c = e.filter(([f, l]) => !s.has(qt(n[f].id, n[l].id)));
  return { points: n, triangles: a, majority: o >= i ? 1 : -1, hullEdges: e, dropped: c };
}
function Cs(r) {
  return [r.foot[0] + r.height * r.normal[0], r.foot[1] + r.height * r.normal[1]];
}
function Wi(r, [t, e], { lambda: n = Ds, epsilon: s = Gi } = {}) {
  const { points: o, majority: i } = r, a = o[t], c = o[e], f = o.reduce((A, B) => A + B.paper[0], 0) / o.length, l = o.reduce((A, B) => A + B.paper[1], 0) / o.length, h = Math.sign(ft(a.paper[0], a.paper[1], c.paper[0], c.paper[1], f, l));
  if (h === 0) return;
  const u = h * i, p = [c.paper[0] - a.paper[0], c.paper[1] - a.paper[1]], b = [c.geo[0] - a.geo[0], c.geo[1] - a.geo[1]], d = Math.hypot(p[0], p[1]), k = Math.hypot(b[0], b[1]);
  if (!(d > 0 && k > 0)) return;
  const M = [];
  for (const A of o) {
    if (A === a || A === c) continue;
    const B = ft(a.geo[0], a.geo[1], c.geo[0], c.geo[1], A.geo[0], A.geo[1]);
    if (B * u >= 0) continue;
    const D = ((A.geo[0] - a.geo[0]) * b[0] + (A.geo[1] - a.geo[1]) * b[1]) / (k * k), L = ((A.paper[0] - a.paper[0]) * p[0] + (A.paper[1] - a.paper[1]) * p[1]) / (d * d);
    D > 0 && D < 1 && L > 0 && L < 1 && M.push({ id: A.id, u: D, t: L, d: Math.abs(B) / k });
  }
  const w = M.length > 0;
  w || M.push({ u: 0.5, t: 0.5, d: 0 });
  const x = M.reduce((A, B) => B.d > A.d ? B : A);
  let g = 0;
  for (const A of M)
    g = Math.max(g, A.u <= x.u ? A.d * x.u / A.u : A.d * (1 - x.u) / (1 - A.u));
  g *= 1 + n;
  const m = [-p[1] / d * h, p[0] / d * h], v = [-b[1] / k * u, b[0] / k * u], S = (A) => [
    a.paper[0] + A * p[0] + s * d * m[0],
    a.paper[1] + A * p[1] + s * d * m[1]
  ], E = (A, B, D, L) => ({
    paper: S(A),
    foot: [a.geo[0] + B * b[0], a.geo[1] + B * b[1]],
    normal: v,
    height: D,
    chord: k,
    protrusion: x.d,
    ...L === void 0 ? {} : { anchor: L }
  }), y = [E(x.t, x.u, g, w ? x.id : void 0)], N = [...M].sort((A, B) => A.u - B.u), O = [{ u: 0, d: 0 }], P = (A, B, D) => (B.u - A.u) * (D.d - A.d) - (B.d - A.d) * (D.u - A.u);
  for (const A of [...N, { u: 1, d: 0 }]) {
    for (; O.length >= 2 && P(O[O.length - 2], O[O.length - 1], A) >= 0; ) O.pop();
    O.push(A);
  }
  const C = n * x.d, _ = [];
  let T = 0;
  for (const A of O.slice(1, -1))
    A.t === void 0 || !(A.t > T) || (T = A.t, _.push(E(A.t, A.u, A.d + C, w ? A.id : void 0)));
  return {
    edge: [a.id, c.id],
    variants: w && _.length > 1 ? [y, _] : [y]
  };
}
function Hi(r, t, e, { lambda: n = Ds, mu: s = Ki, maxIterations: o = Ps } = {}) {
  let i = r.map((a, c) => ({ ray: { ...a }, index: c }));
  for (let a = 0; a < o && i.length > 0; a++) {
    const c = e(i.map(({ ray: h }) => [h.paper, Cs(h)]));
    if (!c) return;
    let f = !1;
    const l = /* @__PURE__ */ new Set();
    for (const [h, { ray: u }] of i.entries()) {
      const p = `e${t + h}`;
      let b = -1 / 0, d = 1 / 0, k = 0;
      for (const g of c.triangles) {
        const m = g.ids.indexOf(p);
        if (m < 0) continue;
        g.sign !== c.majority && k++;
        const v = g.geo[(m + 1) % 3], S = g.geo[(m + 2) % 3], E = Math.sign(
          ft(
            g.paper[m][0],
            g.paper[m][1],
            g.paper[(m + 1) % 3][0],
            g.paper[(m + 1) % 3][1],
            g.paper[(m + 2) % 3][0],
            g.paper[(m + 2) % 3][1]
          )
        ), y = ft(u.foot[0], u.foot[1], v[0], v[1], S[0], S[1]), N = ft(u.foot[0] + u.normal[0], u.foot[1] + u.normal[1], v[0], v[1], S[0], S[1]) - y, O = E * c.majority;
        if (N === 0) {
          y * O <= 0 && (b = 1 / 0);
          continue;
        }
        const P = -y / N;
        N * O > 0 ? b = Math.max(b, P) : d = Math.min(d, P);
      }
      if (!(b < d)) {
        l.add(h);
        continue;
      }
      const M = Math.min(Math.max(n * Math.max(b, u.protrusion), s * u.chord), (d - b) / 2), w = Math.max(b, 0) + M, x = Math.abs(w - u.height) > 1e-9 * u.chord;
      (k > 0 || x) && (x && (f = !0), u.height = w);
    }
    if (l.size > 0 && (i = i.filter((h, u) => !l.has(u)), f = !0), !f) break;
  }
  if (i.length !== 0)
    return { rays: i.map(({ ray: a }) => a), kept: i.map(({ index: a }) => a) };
}
function Ji(r, t) {
  const e = (i) => typeof i == "string" && i.startsWith("e") && Number(i.slice(1)) >= t ? Number(i.slice(1)) : void 0, n = /* @__PURE__ */ new Set();
  for (const { ids: i } of r.triangles)
    n.add(qt(i[0], i[1])), n.add(qt(i[0], i[2])), n.add(qt(i[1], i[2]));
  const s = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set();
  for (const [i, a] of r.hullEdges) {
    const c = n.has(qt(r.points[i].id, r.points[a].id));
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
  const h = () => l * ji + r.buildCost() - f, u = () => h() >= c, p = (w) => {
    if (!u())
      return e.builds++, l++, r.measure(w);
  }, b = (w) => [w.paper, Cs(w)], d = (w, x, g) => {
    const m = Hi(
      w.map(({ ray: v }) => v),
      x,
      (v) => p([...n, ...v]),
      { maxIterations: g }
    );
    return m?.rays.map((v, S) => ({ ray: v, edge: w[m.kept[S]].edge }));
  }, k = (w, x) => w.length === x.length && w.every(({ ray: g }, m) => Math.abs(g.height - x[m].ray.height) <= 1e-9 * g.chord), M = (w) => {
    if (w.length === 0 || n.length + w.length > cs) return !1;
    const x = r.edgeBase + n.length;
    let g = d(w, x, 1), m = !1;
    for (; g && g.length > 0 && !u(); ) {
      const v = [...n, ...g.map(({ ray: N }) => b(N))];
      e.builds++;
      const S = r.build(v, Math.max(1, Math.ceil(c - h()))), E = S ? Ji(S.analysis, x) : void 0;
      if (S && E.size === 0)
        return s = s.concat(
          g.map(({ ray: N, edge: O }, P) => ({
            node: x + P,
            kind: "hullEdge",
            edge: O,
            ...N.anchor === void 0 ? {} : { anchor: N.anchor }
          }))
        ), n = v, o = S, i = r.snapshot(), !0;
      if (r.restore(i), S && E.size < g.length) {
        g = g.filter((N, O) => !E.has(x + O));
        continue;
      }
      if (m) return !1;
      m = !0;
      const y = d(g, x, Ps);
      if (!y || k(y, g)) return !1;
      g = y;
    }
    return !1;
  };
  for (let w = 1; w <= qi && !u(); w++) {
    const { analysis: x } = o, g = [];
    for (const v of x.dropped) {
      const S = v.map((y) => x.points[y].paper.join(",")).join("|");
      if (a.has(S) || (a.add(S), n.length + g.length + 1 > cs)) continue;
      const E = Wi(x, v);
      E && g.push(E);
    }
    if (g.length === 0) break;
    e.rounds = w;
    const m = (v, S) => S.map((E) => ({ ray: E, edge: v.edge }));
    if (M(g.flatMap((v) => m(v, v.variants[0])))) {
      e.batches++;
      continue;
    }
    for (const v of g)
      for (const [S, E] of v.variants.entries()) {
        if (u()) break;
        if (M(m(v, E))) {
          e.perEdge++, S > 0 && e.multiPoint++;
          break;
        }
      }
  }
  return r.restore(i), e.cost = h(), { pairs: n, records: s, result: o.result, diagnostics: e };
}
function Vs(r, t) {
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
        (l, h, u, p) => {
          if (l) return l;
          const b = p[u + 1];
          if (h[3] === c)
            return h[4] = "handled", [h];
          if (h[3] < c && b && b[3] > c)
            return [h, b];
        },
        void 0
      );
      if (f && f.length === 1)
        return s === 0 ? [[a, f[0][0], c]] : [[f[0][0], a, c]];
      if (f && f.length === 2) {
        const l = f[0], h = f[1], u = (c - l[3]) / (h[3] - l[3]), p = [
          (h[0][0] - l[0][0]) * u + l[0][0],
          (h[0][1] - l[0][1]) * u + l[0][1]
        ];
        return s === 0 ? [[a, p, c]] : [[p, a, c]];
      }
      return [];
    });
  }).reduce((n, s) => n.concat(s), []).sort((n, s) => n[2] < s[2] ? -1 : 1);
}
const Zi = 5e-3, to = 0.999, fs = 1e-9, eo = (r, t) => {
  const e = Math.atan2(r[0] - t[0], r[1] - t[1]) * (180 / Math.PI);
  return e < 0 ? e + 360 : e;
};
function ls(r, t) {
  const e = Pe(r, t), n = eo(r, t) - e * 10;
  return n < fs ? [e, (e + 35) % 36] : n > 10 - fs ? [e, (e + 1) % 36] : [e];
}
function hs(r, t) {
  let e = 0;
  for (let n = 0; n < r.length; n++) {
    const s = r[n], o = r[(n + 1) % r.length], i = Math.sign(ft(s[0], s[1], o[0], o[1], t[0], t[1]));
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
      for (const [u, p] of h)
        this.hullVertices.add(s[u]), this.hullVertices.add(s[p]);
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
        for (const p of ls(h, this.centroid.forw))
          u > this.binMax[p] && (this.binMax[p] = u, f[p] = l);
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
      const u = (f * (a[1] - e[1]) - l * (a[0] - e[0])) / h, p = (n * (a[1] - e[1]) - s * (a[0] - e[0])) / h;
      u > 0 && p >= 0 && p <= 1 && (o = Math.min(o, 1 / u));
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
        if (!hs(this.hull.forw, f) || !hs(this.hull.bakw, l) || c.gcp && !(f[0] > n.minx && f[0] < n.maxx && f[1] > n.miny && f[1] < n.maxy))
          return;
        const h = this.forwDistance(f);
        if (h > 0) {
          for (const u of ls(f, this.centroid.forw))
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
const us = (r, t, e) => Math.sign(ft(r[0], r[1], t[0], t[1], e[0], e[1]));
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
function ds(r, t, e = {}) {
  if (r.version !== void 0 && r.version < 3)
    return { reason: "v2" };
  if (r.strict_status === "loose" || r.tins_points.length !== 1)
    return { reason: "loose" };
  const n = r.outerTransform, s = n === "worldFile" && r.yaxisMode === "follow" ? 1 : -1, o = r.points, i = r.edgeNodes ?? [], a = r.vertices_points ?? [], c = o.length, f = (m) => {
    if (typeof m == "number") return o[m];
    const v = Number(m.slice(1));
    return m.startsWith("e") ? i[v] : m.startsWith("b") ? a[v] : void 0;
  };
  let l = 0, h = 0;
  for (const m of r.tins_points[0]) {
    const [v, S, E] = m.map(f);
    if (!v || !S || !E) return { reason: "inconsistent" };
    const y = us(v[0], S[0], E[0]);
    h += y, l += y * us(v[1], S[1], E[1]);
  }
  if ((l < 0 ? -1 : 1) !== s) return { reason: "orientation" };
  const u = new ze(s, h < 0 ? -1 : 1), p = new no(u, {
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
  }), b = /* @__PURE__ */ new Map();
  o.forEach(([m, v], S) => {
    const E = e.points?.[S] ?? S, y = u.addVertex({ kind: "gcp", id: E }, m, v);
    p.gcps.push(y), p.pointVertex.set(E, y), b.set(S, y);
  });
  const d = r.edges ?? [];
  if (p.edges = d.map(
    ([m, v, [S, E]], y) => ({
      id: e.edges?.[y] ?? y,
      start: b.get(S),
      end: b.get(E),
      forwNodes: m.map(dt),
      bakwNodes: v.map(dt),
      nodes: []
    })
  ), p.edges.some(({ start: m, end: v }) => m === void 0 || v === void 0))
    return { reason: "inconsistent" };
  const k = /* @__PURE__ */ new Map();
  {
    let m = 0;
    for (const [, v] of t)
      v >= c ? k.has(v - c) || k.set(v - c, m) : m++;
    if (m !== p.edges.length) return { reason: "inconsistent" };
  }
  i.forEach(([m, v], S) => {
    const E = k.get(S);
    let y;
    if (E !== void 0) {
      const N = p.edges[E];
      y = u.addVertex(
        { kind: "edgeNode", edge: N.id, order: N.nodes.length },
        m,
        v,
        [Ce(N.id)]
      ), N.nodes.push(y);
    } else
      y = u.addVertex(
        { kind: "supplement", key: `s${p.nextSupplement++}` },
        m,
        v
      );
    b.set(`e${S}`, y);
  });
  for (const m of p.edges) {
    const v = Ce(m.id);
    u.vertices.get(m.start).groups.push(v), u.vertices.get(m.end).groups.push(v);
  }
  a.forEach(([m, v], S) => {
    const E = u.addVertex({ kind: "boundary", order: S }, m, v, [
      ie
    ]);
    p.ring.push(E), b.set(`b${S}`, E);
  });
  const M = new Map(
    (r.supplementPairs ?? []).map((m) => [m.node, m])
  );
  for (let m = 0; m < i.length; m++) {
    if (k.has(m)) continue;
    const v = M.get(m), S = v?.edge.map((E) => b.get(E));
    if (!v || !S || S.some((E) => E === void 0))
      return { reason: "inconsistent" };
    p.supplements.push({
      vertex: b.get(`e${m}`),
      kind: v.kind,
      edge: S,
      ...v.anchor === void 0 ? {} : { anchor: b.get(v.anchor) }
    });
  }
  if (r.centroid_point)
    p.centroid = {
      forw: dt(r.centroid_point[0]),
      bakw: dt(r.centroid_point[1])
    };
  else if (n !== "worldFile") return { reason: "inconsistent" };
  for (const m of r.tins_points[0]) {
    const [v, S, E] = m.map((y) => b.get(y));
    u.addTriangle(v, S, E);
  }
  const w = (m) => m < c ? b.get(m) : b.get(`e${m - c}`);
  for (const [m, v] of t) {
    const S = w(m), E = w(v);
    if (S === void 0 || E === void 0) return { reason: "inconsistent" };
    u.setFlag(S, E, Dt);
  }
  const x = [...p.gcps, ...p.nodeOrder()], g = te(
    x.map((m) => u.vertices.get(m).forw)
  );
  for (const [m, v] of g)
    u.hasEdge(x[m], x[v]) && u.setFlag(x[m], x[v], Tt);
  return u.boundarySimple = u.computeBoundarySimple(), { model: p };
}
const so = 3, gt = (r) => ({ ok: !1, reason: r }), $s = { overlap: 0, forbidden: 0, polish: 0 }, gs = (r, t, e) => ft(r[0], r[1], t[0], t[1], e[0], e[1]), Ve = (r, t) => r[0] === t[0] && r[1] === t[1];
function Ye(r, t, e) {
  const n = (a) => r.vertices.get(a).forw, s = (a) => {
    const c = r.positive(a);
    return c !== void 0 && c.every((f, l) => gs(n(f), n(c[(l + 1) % 3]), t) >= 0);
  }, o = [e];
  let i = e;
  for (let a = 0; a <= r.triangles.size; a++) {
    const c = r.positive(i);
    if (!c) break;
    let f, l = !1;
    for (let h = 0; h < 3 && f === void 0; h++) {
      const u = c[h], p = c[(h + 1) % 3];
      gs(n(u), n(p), t) >= 0 || (l = !0, f = r.byEdge.get(it(u, p)).find((b) => b !== i));
    }
    if (!l) return { triangle: i, path: o };
    if (f === void 0) break;
    i = f, o.push(i);
  }
  for (const a of r.triangles.keys())
    if (s(a)) return { triangle: a, path: [a] };
}
function Ls(r, t, e) {
  const n = (i) => r.vertices.get(i).forw, s = /* @__PURE__ */ new Set([e]), o = [e];
  for (let i = 0; i < o.length; i++) {
    const a = r.triangles.get(o[i]);
    for (let c = 0; c < 3; c++) {
      const f = it(a[c], a[(c + 1) % 3]);
      if (!((r.edgeFlags.get(f) ?? 0) & (Dt | Tt)))
        for (const l of r.byEdge.get(f)) {
          if (s.has(l)) continue;
          const h = r.positive(l);
          if (!h) continue;
          const [u, p, b] = h.map(n);
          Le(
            u[0],
            u[1],
            p[0],
            p[1],
            b[0],
            b[1],
            t[0],
            t[1]
          ) * Bs > 0 && (s.add(l), o.push(l));
        }
    }
  }
  return s;
}
function ps(r, t, e, n) {
  const s = Ye(r, t, n);
  if (!s) return;
  const o = (f) => r.vertices.get(f).forw, i = (f) => {
    const l = r.triangles.get(f);
    for (let h = 0; h < 3; h++) {
      const u = o(l[h]), p = o(l[(h + 1) % 3]);
      if (Be(t[0], t[1], e[0], e[1], u[0], u[1], p[0], p[1]))
        return !0;
    }
    return !1;
  }, a = /* @__PURE__ */ new Set([s.triangle]), c = [s.triangle];
  for (let f = 0; f < c.length; f++) {
    const l = r.triangles.get(c[f]);
    for (let h = 0; h < 3; h++)
      for (const u of r.byEdge.get(it(l[h], l[(h + 1) % 3])))
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
  return gt(o ?? "notDisk");
}
function je(r, t, e, n) {
  const { mesh: s } = r, o = (g) => e && g === e.vertex ? e : s.vertices.get(g), i = /* @__PURE__ */ new Set(), a = [], c = [], f = [], l = s.triangles.keys().next().value;
  if (l === void 0) return gt("unsupported");
  if (e) {
    const g = s.star(e.vertex);
    if (g.size === 0) return gt("unsupported");
    a.push({ vertex: e.vertex, to: e, gcp: !0, counted: !0 });
    for (const v of g) i.add(v);
    const m = s.vertices.get(e.vertex);
    if (!Ve(e.forw, m.forw)) {
      const v = Ye(s, e.forw, g.values().next().value);
      if (!v) return gt("pointOutside");
      if (s.triangles.get(v.triangle).some((S) => S !== e.vertex && Ve(s.vertices.get(S).forw, e.forw)))
        return gt("duplicate");
      if (!g.has(v.triangle)) {
        for (const S of v.path) i.add(S);
        for (const S of Ls(s, e.forw, v.triangle)) i.add(S);
      }
    }
  }
  if (e) {
    const g = new Set(t.map((m) => m.edge));
    for (const m of r.edges) {
      if (g.has(m) || m.nodes.length > 0 || m.start !== e.vertex && m.end !== e.vertex) continue;
      const v = m.start === e.vertex ? m.end : m.start, S = ps(s, s.vertices.get(v).forw, e.forw, l);
      if (!S) return gt("pointOutside");
      for (const E of S) i.add(E);
    }
  }
  const h = [];
  for (const g of t) {
    const { edge: m } = g;
    if (!g.fresh) {
      const O = [m.start, ...m.nodes, m.end];
      for (let P = 0; P + 1 < O.length; P++) f.push([O[P], O[P + 1]]);
      if (m.nodes.length === 0)
        for (const P of s.byEdge.get(it(m.start, m.end)) ?? []) i.add(P);
      for (const P of m.nodes) {
        for (const C of s.byVertex.get(P)) i.add(C);
        c.push(P), a.push({ vertex: P, gcp: !1, counted: !0 });
      }
    }
    if (g.drop) continue;
    const v = o(m.start), S = o(m.end), E = g.forwNodes.length > 0 || g.bakwNodes.length > 0, y = E ? Vs(
      [v.forw, ...g.forwNodes, S.forw],
      [v.bakw, ...g.bakwNodes, S.bakw]
    ).map(([O, P]) => [O, P]) : [];
    if (E && y.length === 0) return gt("unsupported");
    g.forwNodes = g.forwNodes.map(dt), g.bakwNodes = g.bakwNodes.map(dt), h.push({ spec: g, nodes: y });
    for (const [O, P] of y)
      a.push({ to: { forw: O, bakw: P }, gcp: !1, counted: !0 });
    const N = [v.forw, ...y.map(([O]) => O), S.forw];
    for (let O = 0; O + 1 < N.length; O++) {
      const P = ps(s, N[O], N[O + 1], l);
      if (!P) return gt("pointOutside");
      for (const C of P) i.add(C);
    }
  }
  const u = qe(r, a, n);
  if (!u) return gt("unsupported");
  const p = c.map((g) => s.vertices.get(g).ref), b = [], d = [], k = [], M = /* @__PURE__ */ new Map();
  for (const { spec: g, nodes: m } of h) {
    const { edge: v } = g, S = Ce(v.id);
    if (g.fresh)
      for (const N of [v.start, v.end]) {
        const { groups: O } = s.vertices.get(N);
        O.includes(S) || (O.push(S), k.push({ vertex: N, group: S }));
      }
    const E = m.map(
      ([N, O], P) => s.addVertex({ kind: "edgeNode", edge: v.id, order: P }, N, O, [S])
    );
    b.push(...E), M.set(g, E);
    const y = [v.start, ...E, v.end];
    for (let N = 0; N + 1 < y.length; N++)
      d.push([y[N], y[N + 1], Dt]);
  }
  const w = {
    added: b,
    removed: p,
    moved: e ? [e.vertex] : []
  };
  let x;
  if (i.size === 0)
    if (!d.every(([g, m]) => s.hasEdge(g, m)))
      x = gt("constraint");
    else {
      for (const [g, m] of f) s.clearFlag(g, m, Dt);
      for (const [g, m, v] of d) s.setFlag(g, m, v);
      s.revision++, x = { ok: !0, mode: "moved", removed: [], added: [], grown: 0, size: 0, flips: $s, vertices: w };
    }
  else
    x = Ue(
      s,
      i,
      {
        move: e ? /* @__PURE__ */ new Map([[e.vertex, { forw: e.forw, bakw: e.bakw }]]) : void 0,
        add: b,
        remove: c,
        release: f,
        constrain: d
      },
      w
    );
  if (!x.ok) {
    for (const g of b) s.dropVertex(g);
    for (const { vertex: g, group: m } of k) {
      const { groups: v } = s.vertices.get(g);
      v.splice(v.indexOf(m), 1);
    }
    return x;
  }
  u();
  for (const g of t) {
    const { edge: m } = g;
    if (g.drop) {
      const v = Ce(m.id);
      for (const S of [m.start, m.end]) {
        const { groups: E } = s.vertices.get(S), y = E.indexOf(v);
        y !== -1 && E.splice(y, 1);
      }
      m.nodes = [];
      continue;
    }
    m.nodes = M.get(g), m.forwNodes = g.forwNodes, m.bakwNodes = g.bakwNodes;
  }
  return x;
}
function ro(r, t, e, n) {
  const { mesh: s } = r, o = r.pointVertex.get(t);
  if (o === void 0) return gt("unknownPoint");
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
    if (!h) return gt("unsupported");
    const u = s.star(o);
    if (u.size === 0) return gt("unsupported");
    const p = (d) => d === o ? { ...i, bakw: c } : s.vertices.get(d);
    if ([...u].every((d) => {
      const [k, M, w] = s.triangles.get(d);
      return s.okNew(k, M, w, p);
    }))
      return s.relocate(o, a, c), h(), {
        ok: !0,
        mode: "moved",
        removed: [],
        added: [],
        grown: 0,
        size: u.size,
        flips: $s,
        vertices: { added: [], removed: [], moved: [o] }
      };
  }
  return je(r, l, { vertex: o, forw: a, bakw: c }, n);
}
function io(r, t, e, n, s, o) {
  const { mesh: i } = r;
  if (r.pointVertex.has(t)) return gt("idInUse");
  const a = i.triangles.keys().next().value;
  if (a === void 0) return gt("unsupported");
  const c = qe(
    r,
    [{ to: { forw: e, bakw: n }, gcp: !0, counted: !0 }],
    o
  );
  if (!c) return gt("unsupported");
  const f = Ye(i, e, a);
  if (!f) return gt("pointOutside");
  if (i.triangles.get(f.triangle).some((p) => Ve(i.vertices.get(p).forw, e)))
    return gt("duplicate");
  const h = i.addVertex({ kind: "gcp", id: t }, e, n), u = Ue(
    i,
    Ls(i, e, f.triangle),
    { add: [h] },
    { added: [h], removed: [], moved: [] }
  );
  return u.ok ? (c(), r.gcps.splice(s ?? r.gcps.length, 0, h), r.pointVertex.set(t, h), u) : (i.dropVertex(h), u);
}
function oo(r, t, e) {
  const { mesh: n } = r, s = r.pointVertex.get(t);
  if (s === void 0) return gt("unknownPoint");
  if (r.edges.some((f) => f.start === s || f.end === s) || r.supplements.some(
    (f) => f.edge.includes(s) || f.anchor === s
  ))
    return gt("unsupported");
  const o = qe(
    r,
    [{ vertex: s, gcp: !0, counted: !0 }],
    e
  );
  if (!o) return gt("unsupported");
  const i = n.star(s);
  if (i.size === 0) return gt("unsupported");
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
  if (r.edges.some((u) => u.id === t)) return gt("idInUse");
  const c = r.pointVertex.get(e), f = r.pointVertex.get(n);
  if (c === void 0 || f === void 0 || c === f)
    return gt("unknownPoint");
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
  if (!n) return gt("unknownEdge");
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
  ) : gt("unknownEdge");
}
function ho(r, t) {
  const { mesh: e } = r;
  if (!r.centroid) return { ok: !1, reason: "bandNotAnnulus" };
  const n = (F) => e.vertices.get(F), s = new Set(r.supplements.map(({ vertex: F }) => F)), o = [...r.gcps, ...r.nodeOrder()], i = o.filter((F) => !s.has(F));
  if (i.length < 3) return { ok: !1, reason: "bandFailed" };
  let a = 0, c = 0;
  for (const F of i)
    a += n(F).forw[0], c += n(F).forw[1];
  const f = [a / i.length, c / i.length], l = e.triangles.keys().next().value, h = l === void 0 ? void 0 : Ye(e, f, l);
  if (!h) return { ok: !1, reason: "bandFailed" };
  const [u, p, b] = e.triangles.get(h.triangle).map(n), d = (p.forw[0] - u.forw[0]) * (b.forw[1] - u.forw[1]) - (b.forw[0] - u.forw[0]) * (p.forw[1] - u.forw[1]);
  if (d === 0) return { ok: !1, reason: "bandFailed" };
  const k = ((f[0] - u.forw[0]) * (b.forw[1] - u.forw[1]) - (b.forw[0] - u.forw[0]) * (f[1] - u.forw[1])) / d, M = ((p.forw[0] - u.forw[0]) * (f[1] - u.forw[1]) - (f[0] - u.forw[0]) * (p.forw[1] - u.forw[1])) / d, w = {
    forw: f,
    bakw: [
      u.bakw[0] + k * (p.bakw[0] - u.bakw[0]) + M * (b.bakw[0] - u.bakw[0]),
      u.bakw[1] + k * (p.bakw[1] - u.bakw[1]) + M * (b.bakw[1] - u.bakw[1])
    ]
  }, x = {};
  for (const F of ["forw", "bakw"])
    for (const [V] of te(i.map(($) => n($)[F]))) {
      const $ = n(i[V]);
      x[`${$.forw[0]}:${$.forw[1]}`] = { forw: $.forw, bakw: $.bakw };
    }
  const g = r.gcps.map((F) => n(F).forw[0]), m = r.gcps.map((F) => n(F).forw[1]), v = Math.min(...g), S = Math.max(...g), E = Math.min(...m), y = Math.max(...m), N = {
    convexBuf: x,
    centroid: w,
    allGcps: o.map((F) => ({ forw: n(F).forw, bakw: n(F).bakw })),
    minx: v,
    maxx: S,
    miny: E,
    maxy: y
  }, O = t === "birdeye" ? Ns : As, P = new Set(r.ring.map((F) => Pe(n(F).forw, r.centroid.forw))), C = /* @__PURE__ */ new Set();
  for (let F = 0; F < 36; F++) P.has(F) || C.add(F);
  const _ = r.ring.length <= 4 ? { cornersOnly: !0 } : C.size > 0 ? { skipBins: C } : void 0, T = _ ? [_, void 0] : [void 0], A = te(o.map((F) => n(F).forw)), B = r.ring.map((F) => n(F).ref), D = S - v, L = y - E;
  let I = "bandFailed";
  for (const F of T) for (const V of mn) {
    const $ = O(
      {
        ...N,
        ...F ? { ring: F } : {},
        minx: v - V * D,
        maxx: S + V * D,
        miny: E - V * L,
        maxy: y + V * L
      },
      !0
    );
    if (!$.every(({ bakw: X }) => X.every(Number.isFinite)) || !oe($.map((X) => X.forw), w.forw, -1) || !oe($.map((X) => X.bakw), w.bakw, 1))
      continue;
    const q = { mesh: e, indexOf: /* @__PURE__ */ new Map(), interior: o, ring: r.ring }, Y = Rs(q, { vertices: $, hull: A });
    if (!Y.ok) {
      if (Y.reason === "bandNotAnnulus") return { ok: !1, reason: "bandNotAnnulus" };
      I = "bandFailed";
      continue;
    }
    return r.ring = q.ring, r.centroid = w, r.resetBand(), {
      ok: !0,
      removed: Y.removed,
      added: Y.added,
      removedVertices: B,
      addedVertices: q.ring,
      margin: V
    };
  }
  return { ok: !1, reason: I };
}
const $e = (r, t) => t ? [r[0], -1 * r[1]] : r;
function uo(r, t, e) {
  const n = r.points.slice(), s = r.pointIds.slice(), o = r.edges.map(
    ([u, p, [b, d]]) => ({ forwNodes: u, bakwNodes: p, start: r.pointIds[b], end: r.pointIds[d] })
  ), i = r.edgeIds.slice(), a = (u) => {
    const p = s.indexOf(u);
    if (p === -1) throw new Error(`applyEdits: 対応点 ${u} がありません`);
    return p;
  }, c = (u) => {
    const p = i.indexOf(u);
    if (p === -1) throw new Error(`applyEdits: 必須エッジ ${u} がありません`);
    return p;
  }, f = (u, p) => {
    if (u === void 0) return p;
    if (!Number.isInteger(u) || u < 0 || u > p)
      throw new Error(`applyEdits: position ${u} が範囲の外です`);
    return u;
  }, l = (...u) => {
    for (const p of u)
      if (!Array.isArray(p) || !Number.isFinite(p[0]) || !Number.isFinite(p[1]))
        throw new Error("applyEdits: 座標が有限の数ではありません");
  };
  for (const u of t)
    switch (u.type) {
      case "addPoint": {
        if (!Number.isInteger(u.id) || s.includes(u.id))
          throw new Error(`applyEdits: 対応点の id ${u.id} は使えません`);
        l(u.forw, u.bakw);
        const p = f(u.position, n.length);
        n.splice(p, 0, [u.forw, $e(u.bakw, e)]), s.splice(p, 0, u.id);
        break;
      }
      case "removePoint": {
        const p = a(u.id);
        if (o.some((b) => b.start === u.id || b.end === u.id))
          throw new Error(`applyEdits: 対応点 ${u.id} は必須エッジの端点です（先に必須エッジを外してください）`);
        n.splice(p, 1), s.splice(p, 1);
        break;
      }
      case "movePoint": {
        const p = a(u.id);
        u.forw && l(u.forw), u.bakw && l(u.bakw), n[p] = [
          u.forw ?? n[p][0],
          u.bakw ? $e(u.bakw, e) : n[p][1]
        ];
        break;
      }
      case "addEdge": {
        if (!Number.isInteger(u.id) || i.includes(u.id))
          throw new Error(`applyEdits: 必須エッジの id ${u.id} は使えません`);
        if (a(u.start), a(u.end), u.start === u.end) throw new Error("applyEdits: 必須エッジの両端が同じ対応点です");
        l(...u.forwNodes, ...u.bakwNodes);
        const p = f(u.position, o.length);
        o.splice(p, 0, { forwNodes: u.forwNodes, bakwNodes: u.bakwNodes, start: u.start, end: u.end }), i.splice(p, 0, u.id);
        break;
      }
      case "removeEdge": {
        const p = c(u.id);
        o.splice(p, 1), i.splice(p, 1);
        break;
      }
      case "replaceEdgeNodes": {
        const p = c(u.id);
        l(...u.forwNodes, ...u.bakwNodes), o[p] = { ...o[p], forwNodes: u.forwNodes, bakwNodes: u.bakwNodes };
        break;
      }
      default:
        throw new Error(`applyEdits: 編集の種類 ${u.type} は扱えません`);
    }
  const h = new Map(s.map((u, p) => [u, p]));
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
const ms = (r) => r === "duplicate" || r === "unknownPoint" || r === "unknownEdge" || r === "idInUse" ? "unsupported" : r;
function ws(r, t, e, n, s = !1) {
  const { mesh: o } = r, i = [...o.bad].sort((y, N) => y - N), a = /* @__PURE__ */ new Set(), c = /* @__PURE__ */ new Set(), f = (y) => JSON.stringify(y), l = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Set(), u = /* @__PURE__ */ new Set(), p = (y, N) => {
    switch (y.type) {
      case "addPoint":
        return io(r, y.id, y.forw, $e(y.bakw, e), y.position, N);
      case "removePoint":
        return oo(r, y.id, N);
      case "movePoint":
        return ro(
          r,
          y.id,
          { forw: y.forw, bakw: y.bakw ? $e(y.bakw, e) : void 0 },
          N
        );
      case "addEdge":
        return co(r, y.id, y.start, y.end, y.forwNodes, y.bakwNodes, y.position, N);
      case "removeEdge":
        return fo(r, y.id, N);
      case "replaceEdgeNodes":
        return lo(r, y.id, y.forwNodes, y.bakwNodes, N);
    }
  };
  let b = s && n !== void 0, d = !1;
  const k = (y) => {
    for (const N of y.removed)
      c.delete(N) || a.add(N);
    for (const N of y.added) c.add(N);
    for (const N of y.vertices.removed) l.set(f(N), N);
    for (const N of y.vertices.added) h.add(N);
    for (const N of y.vertices.moved) u.add(N);
  };
  for (const y of t) {
    let N = p(y);
    if (!N.ok && N.reason === "unsupported" && n && r.centroid) {
      if (y.type === "removePoint")
        for (const O of ao(r, y.id)) {
          if (!O.ok) return { ok: !1, reason: ms(O.reason) };
          k(O), d = !0, b = !0;
        }
      N = p(y, { force: !0 }), N.ok && (b = !0);
    }
    if (!N.ok) return { ok: !1, reason: ms(N.reason) };
    k(N);
  }
  if (b) {
    const y = ho(r, n.vertexMode);
    if (!y.ok) return { ok: !1, reason: y.reason };
    for (const N of y.removed)
      c.delete(N) || a.add(N);
    for (const N of y.added) c.add(N);
    for (const N of y.removedVertices) l.set(f(N), N);
    for (const N of y.addedVertices) h.add(N);
  }
  const M = /* @__PURE__ */ new Map(), w = [];
  for (const y of u) {
    const N = o.vertices.get(y);
    N && !h.has(y) && M.set(f(N.ref), { ref: N.ref, forw: N.forw, bakw: N.bakw });
  }
  for (const y of h) {
    const N = o.vertices.get(y);
    if (!N) continue;
    const O = f(N.ref), P = { ref: N.ref, forw: N.forw, bakw: N.bakw };
    l.delete(O) ? M.set(O, P) : w.push(P);
  }
  const x = /* @__PURE__ */ new Set();
  for (const y of l.keys())
    M.has(y) && x.add(y);
  for (const y of x) l.delete(y);
  let g;
  const m = (y) => {
    g = g ? [Math.min(g[0], y[0]), Math.min(g[1], y[1]), Math.max(g[2], y[0]), Math.max(g[3], y[1])] : [y[0], y[1], y[0], y[1]];
  }, v = [];
  for (const y of c) {
    const N = o.triangles.get(y);
    if (!N) continue;
    const O = N.map((P) => {
      const C = o.vertices.get(P);
      return m(C.forw), C.ref;
    });
    v.push({ id: y, vertices: O });
  }
  for (const { forw: y } of M.values()) m(y);
  const S = [...o.bad].sort((y, N) => y - N), E = S.length !== i.length || S.some((y, N) => y !== i[N]);
  return {
    ok: !0,
    refreshed: b,
    patch: {
      strict_status: o.isStrict() ? "strict" : "strict_error",
      // 帯を差し替えたときだけ、重心と補助頂点の扇形の値を入れる
      ...b && r.centroid ? {
        centroid: { forw: [...r.centroid.forw], bakw: [...r.centroid.bakw] },
        verticesParams: r.verticesParams()
      } : {},
      // 補完点の一覧が変わったときだけ入れる
      ...d ? { supplementPairs: r.supplementPairs() } : {},
      ...M.size > 0 ? { movedVertices: [...M.values()] } : {},
      ...l.size > 0 ? { removedVertices: [...l.values()] } : {},
      ...w.length > 0 ? { addedVertices: w } : {},
      removedTriangles: [...a],
      addedTriangles: v,
      ...E ? { badTriangles: S } : {},
      ...g ? { dirtyBounds: g } : {}
    }
  };
}
const vs = 2.00704, bs = 3.00001, go = 12, po = 4, ys = 1, xs = 4, mo = 8, wo = 24;
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
const ks = /* @__PURE__ */ Symbol("supplement pairs out of budget"), bo = 32, Ss = 1e-6, yo = 24;
class rt extends xn {
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
    })), this.pointsWeightBuffer = {}, this.meshAhead = !1;
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
    const n = this.yaxisMode === rt.YAXIS_FOLLOW, s = uo(this.currentInputs(), t, n);
    let o = "noMesh";
    if (this.mesh) {
      const a = this.bounds ? this.boundsPolygon : void 0;
      if (a && !s.points.every((c) => sn(c[0], a)))
        o = "unsupported";
      else {
        const c = ws(
          this.mesh,
          t,
          n,
          this.incrementalBand ? { vertexMode: this.vertexMode } : void 0
        );
        if (c.ok)
          return this.afterLocalEdit(c.patch.strict_status, !c.refreshed), { revision: this.editRevision, mode: "local", boundaryStale: this.bandStale, ...c.patch };
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
    if (super(), t.bounds ? this.setBounds(t.bounds) : (this.setWh(t.wh), this.vertexMode = t.vertexMode || rt.VERTEX_PLAIN), this.strictMode = t.strictMode || rt.MODE_AUTO, this.yaxisMode = t.yaxisMode || rt.YAXIS_INVERT, this.importance = t.importance || 0, this.priority = t.priority || 0, this.stateFull = t.stateFull || !1, this.useV2Algorithm = t.useV2Algorithm ?? !1, this.useSupplementPairs = t.supplementPairs ?? !0, this.incremental = t.incremental ?? !1, this.incrementalRebuild = t.incrementalRebuild ?? !1, this.incrementalBand = t.incrementalBand ?? !1, t.outerTransform === "worldFile") {
      if (this.useV2Algorithm) throw new Error("V2 では world file 外周を使えません");
      if (!t.worldFile) throw new Error("worldFile が必要です");
      Ys(t.worldFile), this.requestedWorldFile = { ...t.worldFile };
    }
    t.points && this.setPoints(t.points), t.edges && this.setEdges(t.edges);
  }
  /**
   * フォーマットバージョンを取得します
   */
  getFormatVersion() {
    return this.useV2Algorithm ? vs : bs;
  }
  /**
   * 制御点（GCP: Ground Control Points）を設定します。
   * 指定した点群に合わせて内部のTINキャッシュをリセットします。
   */
  setPoints(t) {
    this.syncFromMesh(), this.yaxisMode === rt.YAXIS_FOLLOW && (t = t.map((e) => [
      e[0],
      [e[1][0], -1 * e[1][1]]
    ])), this.points = t, this.pointIds = void 0, this.dropMesh(), this.tins = void 0, this.indexedTins = void 0;
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
    i.push(t[0]), this.boundsPolygon = me([i]), this.xy = [e, s], this.wh = [n - e, o - s], this.vertexMode = rt.VERTEX_PLAIN, this.tins = void 0, this.indexedTins = void 0;
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
    if (t.version = this.useV2Algorithm ? vs : bs, t.points = this.points, t.weight_buffer = {}, this.compiledOuter?.outerTransform === "worldFile")
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
    }), this.strict_status === rt.STATUS_LOOSE ? (t.tins_points[1] = [], this.tins.bakw.features.map((e) => {
      t.tins_points[1].push(
        ["a", "b", "c"].map(
          (n) => e.properties[n].index
        )
      );
    })) : this.strict_status === rt.STATUS_ERROR && this.kinks?.bakw && (t.kinks_points = this.kinks.bakw.features.map(
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
   * 呼び出し側は、対応点と必須エッジを入れ直して `updateTin()` すること。
   *
   * @param compiled 保存した compiled（座標は内部の座標系。follow では地理面の Y が反転済み）
   * @param inputs 呼び出し側が持つ対応点・必須エッジ（`setPoints`・`setEdges` に渡すのと同じ、外の座標系）。
   *   渡すと、compiled と合うかを確かめる（follow の反転は、ここで掛ける。呼び出し側で compiled と直接比べないこと）
   */
  restoreMesh(t, e) {
    const n = (b) => ({ ok: !1, reason: b });
    try {
      this.setCompiled(t);
    } catch (b) {
      if (b instanceof Error && /world file|V2/.test(b.message)) throw b;
      return this.tins = void 0, this.indexedTins = void 0, n("inconsistent");
    }
    if (!this.incremental) return n("disabled");
    const s = this.yaxisMode === rt.YAXIS_FOLLOW;
    if (e?.points && !(e.points.length === this.points.length && e.points.every(([d, k], M) => {
      const [w, x] = this.points[M];
      return d[0] === w[0] && d[1] === w[1] && k[0] === x[0] && (s ? -1 * k[1] : k[1]) === x[1];
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
    if (this.edgeNodes = o, !(a.length + this.supplementRecords.length === o.length && a.every((b, d) => b.every((k, M) => k[0] === o[d][M][0] && k[1] === o[d][M][1])))) return n("edgeNodes");
    const f = ds(t, i);
    if (!("model" in f)) return n(f.reason);
    const { model: l } = f, h = l.mesh.audit();
    if (h.bad.length > 0) return n("notStrict");
    if (!h.boundarySimple) return n("boundary");
    if (h.missingRequired > 0) return n("requiredEdge");
    if (h.forbiddenBoundary > 0) return n("forbidden");
    const u = l.verticesParams(), p = t.vertices_params;
    return u && JSON.stringify(u) !== JSON.stringify(p) ? n("verticesParams") : (this.mesh = l, this.meshFailure = void 0, { ok: !0 });
  }
  /**
   * 帯（補助頂点・重心）を、今の内側の点から作り直す（保存の直前に、帯を最新にするために呼ぶ。設計書 §9.5 (a)）。
   * スイッチ `incrementalBand` が要る。成り立てば差分を返し、成り立たなければ（スイッチが切れている・網が無い・
   * どの余白でも strict な帯にならない）何も変えずに undefined を返す。
   */
  refreshBand() {
    if (!this.mesh || !this.incrementalBand) return;
    const t = ws(this.mesh, [], this.yaxisMode === rt.YAXIS_FOLLOW, { vertexMode: this.vertexMode }, !0);
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
    e.badTriangles = o.bad.length, e.boundarySimple = o.boundarySimple, e.missingRequiredEdges = o.missingRequired, e.boundaryOnlyTriangles = o.forbiddenBoundary, e.remainingForbiddenTriangles = o.forbiddenEdge;
    const i = { ...n.toCompiled(), strict_status: "strict", meshOrigin: "incremental" }, a = new xn();
    try {
      a.setCompiled(JSON.parse(JSON.stringify(i)));
      let c = 0, f = 0;
      for (const [l, h] of i.points) {
        const u = a.transform(l, !1), p = a.transform(h, !0);
        c = Math.max(c, u ? Math.hypot(u[0] - h[0], u[1] - h[1]) : 1 / 0), f = Math.max(f, p ? Math.hypot(p[0] - l[0], p[1] - l[1]) : 1 / 0);
      }
      e.gcpRoundTrip = { forward: c, backward: f };
    } catch {
    }
    for (const c of ["forw", "bakw"]) {
      const f = [...s.triangles.values()].map((l) => {
        const h = l.map((u) => s.vertices.get(u)[c]);
        return [...h, h[0]];
      });
      e.sweepKinks += Fe(f, 1).length;
    }
    return e.boundaryFresh || e.failed.push("boundaryStale"), e.badTriangles > 0 && e.failed.push("badTriangles"), e.boundarySimple || e.failed.push("boundary"), e.missingRequiredEdges > 0 && e.failed.push("requiredEdge"), e.boundaryOnlyTriangles > 0 && e.failed.push("boundaryOnlyTriangles"), e.gcpRoundTrip.forward <= Ss && e.gcpRoundTrip.backward <= Ss || e.failed.push("gcpRoundTrip"), e.sweepKinks > 0 && e.failed.push("sweepKinks"), e.eligible = e.failed.length === 0, e.eligible && (e.compiled = i), e;
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
      Fs(e, { forw: s, bakw: i });
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
      return Fe(s, t);
    });
    e[0].length === 0 && e[1].length === 0 ? (this.strict_status = rt.STATUS_STRICT, delete this.kinks) : (this.strict_status = rt.STATUS_ERROR, this.kinks = {
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
      const o = this.points[s][0], i = this.points[s][1], a = Yt(o, i, s);
      t.forw.push(a), t.bakw.push(Wt(a));
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
      i.unshift(this.points[o[0]][0]), i.push(this.points[o[1]][0]), a.unshift(this.points[o[0]][1]), a.push(this.points[o[1]][1]), Vs(i, a).forEach((c, f, l) => {
        this.edgeNodes[n] = [
          c[0],
          c[1]
        ];
        const h = Yt(
          c[0],
          c[1],
          `e${n}`
        );
        n++, t.forw.push(h), t.bakw.push(Wt(h)), f === 0 ? e.push([o[0], t.forw.length - 1]) : e.push([
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
      const t = ds(this.getCompiled(), this.pointsSet.edges, {
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
    t !== rt.MODE_STRICT && t !== rt.MODE_LOOSE && (t = rt.MODE_AUTO);
    const e = !this.useV2Algorithm, n = this.requestedWorldFile;
    if (n && !e) throw new Error("V2 では world file 外周を使えません");
    let s, o, i, a, c;
    if (e) {
      if (this.bounds) {
        const C = this.boundsPolygon;
        if (!C) throw new Error("Internal error: bounds is set but boundsPolygon is missing");
        if (!this.points.every(
          (T) => sn(T[0], C)
        )) throw "SOME POINTS OUTSIDE";
      }
      s = this.generatePointsSet(), { minx: o, maxx: i, miny: a, maxy: c } = this.computeGcpBbox();
    } else {
      const C = this.validateAndPrepareInputs();
      s = C.pointsSet, o = C.minx, i = C.maxx, a = C.miny, c = C.maxy;
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
    const u = yr(f.forw), p = Ln(f.forw);
    if (!p) throw "TOO LINEAR2";
    const b = {}, d = p.geometry.coordinates[0];
    let k;
    try {
      k = d.map((C) => ({
        forw: C,
        bakw: Ke(Zt(C), l)
      })), k.forEach((C) => {
        b[`${C.forw[0]}:${C.forw[1]}`] = C;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const M = Ln(f.bakw);
    if (!M) throw "TOO LINEAR2";
    const w = M.geometry.coordinates[0];
    try {
      k = w.map((C) => ({
        bakw: C,
        forw: Ke(Zt(C), h)
      })), k.forEach((C) => {
        b[`${C.forw[0]}:${C.forw[1]}`] = C;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const x = {
      forw: u.geometry.coordinates,
      bakw: Ke(u, l)
    }, g = Yt(x.forw, x.bakw, "c");
    this.centroid = {
      forw: g,
      bakw: Wt(g)
    };
    const m = [
      ...this.points.map((C) => ({ forw: C[0], bakw: C[1] })),
      ...(this.edgeNodes ?? []).map((C) => ({ forw: C[0], bakw: C[1] }))
    ], v = {
      convexBuf: b,
      centroid: x,
      allGcps: m,
      minx: o,
      maxx: i,
      miny: a,
      maxy: c
    }, S = t === rt.MODE_STRICT || t === rt.MODE_AUTO, E = (C, _, T) => {
      if (!S || this.isStrict() || !C.boundary) return { result: C };
      const A = () => ({
        build: this.captureBuild(),
        raw: [s.forw.slice(), s.bakw.slice()],
        gcps: m.slice(),
        edgeNodes: this.edgeNodes.slice(),
        supplementRecords: this.supplementRecords,
        supplementDiagnostics: this.lastSupplementDiagnostics
      }), B = (X) => {
        s.forw.splice(0, s.forw.length, ...X.raw[0]), s.bakw.splice(0, s.bakw.length, ...X.raw[1]), m.splice(0, m.length, ...X.gcps), this.edgeNodes.splice(0, this.edgeNodes.length, ...X.edgeNodes), this.restoreBuild(X.build), this.supplementRecords = X.supplementRecords, this.lastSupplementDiagnostics = X.supplementDiagnostics;
      }, D = A(), L = this.attemptTotal, I = () => this.attemptTotal - L, F = (X, U) => {
        const K = U.map(([Q]) => Q), H = U.map(([, Q]) => Q);
        return (X[0] === Math.min(...K) || X[0] === Math.max(...K)) && (X[1] === Math.min(...H) || X[1] === Math.max(...H));
      }, V = (X) => {
        s.forw.splice(0, s.forw.length, ...D.raw[0]), s.bakw.splice(0, s.bakw.length, ...D.raw[1]), m.splice(0, m.length, ...D.gcps), this.edgeNodes.splice(0, this.edgeNodes.length, ...D.edgeNodes), this.supplementRecords = [];
        const U = T(X);
        return { built: U, strict: U.boundary !== void 0 && this.isStrict() };
      }, $ = /* @__PURE__ */ new Set(), q = C.boundary.vertices.map(({ forw: X }) => X), Y = new Set(
        q.filter((X) => !F(X, q)).map((X) => Pe(X, x.forw))
      );
      try {
        let X = C;
        for (let U = 0; U < po && !(I() + _ >= xs * _); U++) {
          const K = X.boundary.vertices.map(({ forw: W }) => W), H = $.size;
          for (const W of ni(this.tins.forw)) {
            if (F(W, K)) continue;
            const tt = Pe(W, x.forw);
            for (let et = -ys; et <= ys; et++) $.add((tt + et + 36) % 36);
          }
          if ($.size === H || $.size >= wo) break;
          const Q = V({ skipBins: new Set($) });
          if (!Q.built.boundary)
            return B(D), { result: C };
          if (Q.strict) {
            let W = { result: Q.built, state: A() };
            for (const tt of vo($)) {
              if (!tt.some((R) => Y.has(R))) continue;
              if (I() >= mo * _) break;
              const et = new Set([...$].filter((R) => !tt.includes(R))), lt = V({ skipBins: et });
              if (lt.strict) {
                for (const R of tt) $.delete(R);
                W = { result: lt.built, state: A() };
              }
            }
            return B(W.state), { result: W.result, kind: "thinned" };
          }
          X = Q.built;
        }
        if (I() < xs * _) {
          const U = V({ cornersOnly: !0 });
          if (U.strict) return { result: U.built, kind: "corners" };
        }
      } catch {
      }
      return B(D), { result: C };
    };
    if (n) {
      this.stateTriangle = void 0;
      const C = this.yaxisMode === rt.YAXIS_FOLLOW, _ = C ? 1 : -1, T = (F) => this.buildWithSupplements(t, s, m, (V, $, q) => (Y) => ({ boundary: Un(
        F ? { ...v, ring: F } : v,
        (X) => ti(X, (U) => {
          const [K, H] = qs(n, U);
          return [K, C ? -H : H];
        }),
        s,
        this.points.length,
        {
          orientation: _,
          accept: (X) => X.hasMapBoundary ? (this.buildTin(s, X.vertices, $, X, Y.size > 0, q), (this.strict_status !== rt.STATUS_LOOSE || X.hasBoundary) && Re(this.tins.forw, _) === 0 && Re(this.tins.bakw, _) === 0) : !1
        },
        Y,
        V
      ) })), A = this.attemptTotal, B = T(), D = this.attemptTotal - A, { result: { boundary: L }, kind: I } = E(B, D, T);
      if (L) {
        this.compiledOuter = {
          outerTransform: "worldFile",
          worldFile: n,
          vertices_points: L.vertices.map(({ forw: Y, bakw: X }) => [Y, X])
        };
        const { centroid: F, xy: V, wh: $, kinks: q } = this;
        super.setCompiled(this.getCompiled()), Object.assign(this, { centroid: F, xy: V, wh: $, kinks: q }), this.lastBoundaryDiagnostics = {
          ...L.diagnostics,
          ...I ? { ringRescue: I } : {},
          requestedOuterTransform: "worldFile",
          outerTransform: "worldFile"
        };
        return;
      }
      this.compiledOuter = { outerTransform: "extrapolate" }, this.outerTransform = "extrapolate", this.worldFile = void 0;
    }
    const y = this.vertexMode === rt.VERTEX_BIRDEYE ? Ns : As;
    let N, O, P;
    if (e) {
      const C = this.incrementalRebuild && !this.localRebuildDisabled && S && !n, _ = {
        fullAttempts: 0,
        localAttempts: 0,
        localFailures: 0,
        localMs: 0,
        adoptedLocal: !1,
        fellBack: this.localRebuildDisabled
      };
      this.lastRebuildDiagnostics = this.incrementalRebuild ? _ : void 0;
      let T;
      const A = s.forw.length, B = (V, $, q) => {
        const Y = V ? { ...v, ring: V } : v, X = i - o, U = c - a, K = te(s.forw.map(({ geometry: R }) => R.coordinates)), H = K.filter((R) => !$.has(le(R))), Q = s.forw.slice(A).map((R) => ({
          index: R.properties.target.index,
          forw: R.geometry.coordinates,
          bakw: R.properties.target.geom
        }));
        let W;
        for (const R of mn) {
          const z = q.get(R) ?? { forwReuse: {} };
          q.set(R, z);
          const G = z.vertices ?? (z.vertices = y({
            ...Y,
            minx: o - R * X,
            maxx: i + R * X,
            miny: a - R * U,
            maxy: c + R * U
          }, !0));
          if (!oe(G.map((Ut) => Ut.forw), x.forw, -1) || !oe(G.map((Ut) => Ut.bakw), x.bakw, 1)) continue;
          const st = Xi(T), at = Rs(st, { vertices: G, addPoints: Q, hull: H, forwOnly: !0 });
          if (!at.ok) continue;
          st.mesh.repairBad(), st.mesh.bad.size > 0 && st.mesh.bad.size <= bo && st.mesh.healBad();
          const wt = Yi(st);
          if ((!W || wt < W.flips) && (W = { build: st, vertices: G, margin: R, flips: wt, applied: at.applied }), wt === 0) break;
        }
        if (!W) return;
        const tt = {
          forw: W.vertices.map(({ forw: R, bakw: z }, G) => Yt(R, z, `b${G}`)),
          bakw: []
        };
        tt.bakw = tt.forw.map(Wt), this.pointsSet = {
          forw: bt([...s.forw, ...tt.forw]),
          bakw: bt([...s.bakw, ...tt.bakw]),
          edges: s.edges
        };
        const et = We(zi(W.build));
        this.tins = { forw: et }, this.localTins.add(this.tins), this.strict_status = W.build.mesh.isStrict() ? rt.STATUS_STRICT : rt.STATUS_ERROR, delete this.kinks;
        const { mesh: lt } = W.build;
        return {
          boundary: {
            vertices: W.vertices,
            forw: et,
            bakw: et,
            diagnostics: {
              margin: W.margin,
              boundaryTriangleFlips: W.flips,
              remainingForbiddenTriangles: lt.forbiddenBoundary + lt.forbiddenEdge
            },
            hasMapBoundary: !0,
            hasBoundary: !0,
            forwHull: { all: K, applied: W.applied }
          },
          verticesList: tt
        };
      }, D = (V) => this.buildWithSupplements(t, s, m, ($, q, Y) => (X) => {
        if (T) {
          const Q = performance.now(), W = B(V, X, $);
          if (_.localMs += performance.now() - Q, W)
            return _.localAttempts++, W;
          _.localFailures++;
        }
        _.fullAttempts++;
        const U = V ? { ...v, ring: V } : v, K = Un(
          U,
          y,
          s,
          this.points.length,
          void 0,
          X,
          $
        );
        return C && !T && !V && !Y && X.size === 0 && s.forw.length === A && K?.hasBoundary && (T = Li(
          [...s.forw, ...K.vertices.map(({ forw: Q, bakw: W }, tt) => Yt(Q, W, `b${tt}`))],
          K.forw,
          s.edges,
          this.points.length,
          -1
        )), {
          boundary: K,
          verticesList: this.buildTin(
            s,
            K?.vertices ?? y(U, !1),
            q,
            K,
            X.size > 0,
            Y
          )
        };
      }), L = this.attemptTotal, I = D(), F = E(I, this.attemptTotal - L, D);
      if ({ boundary: N, verticesList: O } = F.result, P = F.kind, this.localTins.has(this.tins) && (_.adoptedLocal = !0, this.tins.bakw = bt(this.tins.forw.features.map(($) => ln($))), !["forw", "bakw"].every(
        ($) => Fe(
          this.tins[$].features.map((q) => q.geometry.coordinates[0]),
          1
        ).length === 0
      ) || !this.isStrict())) {
        this.localRebuildDisabled = !0;
        try {
          this.rebuildAll();
        } finally {
          this.localRebuildDisabled = !1;
        }
        return;
      }
    } else
      O = this.buildTin(
        s,
        y(v, !1),
        t,
        void 0
      );
    this.vertices_params = {
      forw: Yn(O.forw, this.centroid.forw),
      bakw: Yn(O.bakw, this.centroid.bakw)
    }, this.addIndexedTin(), this.pointsWeightBuffer = {}, this.lastBoundaryDiagnostics = N && P ? { ...N.diagnostics, ringRescue: P } : N?.diagnostics, n && this.lastBoundaryDiagnostics && (this.lastBoundaryDiagnostics = {
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
    const i = (v, S, E) => {
      const y = s(v, S, E);
      return (N) => (o++, this.attemptTotal++, y(N));
    }, a = (v) => this.buildWithHull(v, i(/* @__PURE__ */ new Map(), v, !1));
    if (!this.useSupplementPairs || this.useV2Algorithm || t === rt.MODE_LOOSE) return a(t);
    const c = t, f = a(c), l = o;
    let h = 0;
    if (!f.boundary || this.strict_status !== rt.STATUS_STRICT) return f;
    const u = fn(this.tins.forw, this.pointsSet.forw.features, f.boundary.forwHull.all);
    if (u.dropped.length === 0) return f;
    const p = this.edgeNodes.length, b = e.forw.length, d = n.length;
    let k = [], M;
    const w = (v, S) => v.length === S.length && v.every((E, y) => E.every((N, O) => N[0] === S[y][O][0] && N[1] === S[y][O][1])), x = (v) => {
      e.forw.length = b, e.bakw.length = b, n.length = d, this.edgeNodes.length = p;
      for (const [S, E] of v) {
        const y = Yt(S, E, `e${this.edgeNodes.length}`);
        this.edgeNodes.push([S, E]), e.forw.push(y), e.bakw.push(Wt(y)), n.push({ forw: S, bakw: E });
      }
      k = v;
    }, m = Qi({
      edgeBase: p,
      baseCost: l,
      buildCost: () => h,
      snapshot: () => ({ pairs: k, state: this.captureBuild() }),
      restore: ({ pairs: v, state: S }) => {
        x(v), this.restoreBuild(S);
      },
      measure: (v) => {
        x(v);
        const S = this.captureBuild();
        try {
          const E = /* @__PURE__ */ new Map();
          M = { pairs: v, cache: E };
          const { boundary: y } = s(E, rt.MODE_STRICT, !0)(/* @__PURE__ */ new Set());
          return y ? fn(this.tins.forw, this.pointsSet.forw.features, []) : void 0;
        } finally {
          this.restoreBuild(S);
        }
      },
      build: (v, S) => {
        x(v);
        const E = M && w(M.pairs, v) ? M.cache : /* @__PURE__ */ new Map(), y = o;
        let N;
        try {
          N = this.buildWithHull(c, (O) => {
            if (o - y >= S) throw ks;
            return i(E, c, !1)(O);
          });
        } catch (O) {
          if (O !== ks) throw O;
          h += o - y;
          return;
        }
        if (h += o - y, !(!N.boundary || this.strict_status !== rt.STATUS_STRICT))
          return {
            result: N,
            analysis: fn(this.tins.forw, this.pointsSet.forw.features, N.boundary.forwHull.all)
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
      const M = o(d), w = n.get(M);
      if (w) return w;
      const x = e(d), g = {
        value: x,
        strict: x.boundary !== void 0 && this.strict_status === rt.STATUS_STRICT
      };
      return (g.strict || k) && (g.state = this.captureBuild()), n.set(M, g), s = g, g;
    }, a = (d) => (s !== d && this.restoreBuild(d.state), s = d, d.value), c = i(/* @__PURE__ */ new Set(), !0);
    if (!(t === rt.MODE_STRICT || t === rt.MODE_AUTO) || !c.value.boundary || c.strict) return c.value;
    const l = new Set(c.value.boundary.forwHull.all.map(le)), h = () => this.pointsSet.forw.features.map(
      (d) => d.properties.target.index
    ), u = /* @__PURE__ */ new Set();
    let p = c, b;
    for (let d = 0; d < go; d++) {
      const k = Di(
        this.tins.forw,
        p.value.boundary.forwHull.applied,
        h()
      ).filter((M) => !u.has(le(M)));
      if (k.length === 0) break;
      for (const M of k) u.add(le(M));
      if (p = i(u), !p.value.boundary) break;
      if (p.strict) {
        b = p;
        break;
      }
    }
    if (b) {
      let d = b;
      for (const k of [...u].slice(0, yo)) {
        const M = new Set(u);
        M.delete(k);
        const w = i(M);
        w.strict && (u.delete(k), d = w);
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
    return this.strict_status === rt.STATUS_STRICT;
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
      const f = e[c].forw, l = e[c].bakw, h = Yt(f, l, `b${c}`), u = Wt(h);
      a.forw.push(h), a.bakw.push(u);
    }
    return this.pointsSet = {
      forw: bt([...t.forw, ...a.forw]),
      bakw: bt([...t.bakw, ...a.bakw]),
      edges: t.edges
    }, this.tins = {
      forw: We(
        s?.forw ?? _e(this.pointsSet.forw, t.edges, "target")
      )
    }, (n === rt.MODE_STRICT || n === rt.MODE_AUTO) && (i ? this.resolveStrictOverlaps() : this.calculateStrictTin(
      n === rt.MODE_AUTO || o ? 1 : Hn
    )), (n === rt.MODE_LOOSE || n === rt.MODE_AUTO && this.strict_status === rt.STATUS_ERROR) && (this.tins.bakw = We(
      s?.bakw ?? _e(this.pointsSet.bakw, t.edges, "target")
    ), delete this.kinks, this.strict_status = rt.STATUS_LOOSE), a;
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
  Tt as EDGE_HULL,
  ss as EDGE_PROTECT,
  Dt as EDGE_REQUIRED,
  ze as IncrementalMesh,
  no as MeshModel,
  rt as Tin,
  _e as constrainedTin,
  Wt as counterPoint,
  Yt as createPoint,
  rt as default,
  So as findIntersections,
  vs as format_version,
  co as insertEdge,
  io as insertPoint,
  Fs as insertSearchIndex,
  ds as meshFromCompiled,
  ro as movePoint,
  fo as removeEdge,
  oo as removePoint,
  lo as replaceEdgeNodes,
  Yn as vertexCalc
};
