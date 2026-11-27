import { counterTri as cn, Transform as xn, validateWorldFile as zs, normalizeEdges as kn, transformArr as je, rotateVerticesTriangle as Ge, worldFileToCrs as Ys } from "@maplat/transform";
function de(i, t, e = {}) {
  const n = { type: "Feature" };
  return (e.id === 0 || e.id) && (n.id = e.id), e.bbox && (n.bbox = e.bbox), n.properties = t || {}, n.geometry = i, n;
}
function Zt(i, t, e = {}) {
  if (!i)
    throw new Error("coordinates is required");
  if (!Array.isArray(i))
    throw new Error("coordinates must be an Array");
  if (i.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!Mn(i[0]) || !Mn(i[1]))
    throw new Error("coordinates must contain numbers");
  return de({
    type: "Point",
    coordinates: i
  }, t, e);
}
function me(i, t, e = {}) {
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
  return de({
    type: "Polygon",
    coordinates: i
  }, t, e);
}
function Sn(i, t, e = {}) {
  if (i.length < 2)
    throw new Error("coordinates must be an array of two or more positions");
  return de({
    type: "LineString",
    coordinates: i
  }, t, e);
}
function bt(i, t = {}) {
  const e = { type: "FeatureCollection" };
  return t.id && (e.id = t.id), t.bbox && (e.bbox = t.bbox), e.features = i, e;
}
function Mn(i) {
  return !isNaN(i) && i !== null && !Array.isArray(i);
}
function qs(i) {
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
function Us(i) {
  return i.type === "Feature" ? i.geometry : i;
}
function dn(i, t, e) {
  if (i !== null)
    for (var n, s, o, r, a, c, f, l = 0, h = 0, u, p = i.type, y = p === "FeatureCollection", d = p === "Feature", S = y ? i.features.length : 1, E = 0; E < S; E++) {
      f = y ? (
        // @ts-expect-error: Known type conflict
        i.features[E].geometry
      ) : d ? (
        // @ts-expect-error: Known type conflict
        i.geometry
      ) : i, u = f ? f.type === "GeometryCollection" : !1, a = u ? f.geometries.length : 1;
      for (var w = 0; w < a; w++) {
        var k = 0, g = 0;
        if (r = u ? f.geometries[w] : f, r !== null) {
          c = r.coordinates;
          var m = r.type;
          switch (l = e && (m === "Polygon" || m === "MultiPolygon") ? 1 : 0, m) {
            case null:
              break;
            case "Point":
              if (
                // @ts-expect-error: Known type conflict
                t(
                  c,
                  h,
                  E,
                  k,
                  g
                ) === !1
              )
                return !1;
              h++, k++;
              break;
            case "LineString":
            case "MultiPoint":
              for (n = 0; n < c.length; n++) {
                if (
                  // @ts-expect-error: Known type conflict
                  t(
                    c[n],
                    h,
                    E,
                    k,
                    g
                  ) === !1
                )
                  return !1;
                h++, m === "MultiPoint" && k++;
              }
              m === "LineString" && k++;
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
                      E,
                      k,
                      g
                    ) === !1
                  )
                    return !1;
                  h++;
                }
                m === "MultiLineString" && k++, m === "Polygon" && g++;
              }
              m === "Polygon" && k++;
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
                        E,
                        k,
                        g
                      ) === !1
                    )
                      return !1;
                    h++;
                  }
                  g++;
                }
                k++;
              }
              break;
            case "GeometryCollection":
              for (n = 0; n < r.geometries.length; n++)
                if (
                  // @ts-expect-error: Known type conflict
                  dn(r.geometries[n], t, e) === !1
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
const xt = 11102230246251565e-32, J = 134217729, Ss = (3 + 8 * xt) * xt;
function vt(i, t, e, n, s) {
  let o, r, a, c, f = t[0], l = n[0], h = 0, u = 0;
  l > f == l > -f ? (o = f, f = t[++h]) : (o = l, l = n[++u]);
  let p = 0;
  if (h < i && u < e)
    for (l > f == l > -f ? (r = f + o, a = o - (r - f), f = t[++h]) : (r = l + o, a = o - (r - l), l = n[++u]), o = r, a !== 0 && (s[p++] = a); h < i && u < e; )
      l > f == l > -f ? (r = o + f, c = r - o, a = o - (r - c) + (f - c), f = t[++h]) : (r = o + l, c = r - o, a = o - (r - c) + (l - c), l = n[++u]), o = r, a !== 0 && (s[p++] = a);
  for (; h < i; )
    r = o + f, c = r - o, a = o - (r - c) + (f - c), f = t[++h], o = r, a !== 0 && (s[p++] = a);
  for (; u < e; )
    r = o + l, c = r - o, a = o - (r - c) + (l - c), l = n[++u], o = r, a !== 0 && (s[p++] = a);
  return (o !== 0 || p === 0) && (s[p++] = o), p;
}
function Nt(i, t, e, n, s, o, r, a) {
  return vt(vt(i, t, e, n, r), r, s, o, a);
}
function j(i, t, e, n) {
  let s, o, r, a, c, f, l, h, u, p, y;
  l = J * e, p = l - (l - e), y = e - p;
  let d = t[0];
  s = d * e, l = J * d, h = l - (l - d), u = d - h, r = u * y - (s - h * p - u * p - h * y);
  let S = 0;
  r !== 0 && (n[S++] = r);
  for (let E = 1; E < i; E++)
    d = t[E], a = d * e, l = J * d, h = l - (l - d), u = d - h, c = u * y - (a - h * p - u * p - h * y), o = s + c, f = o - s, r = s - (o - f) + (c - f), r !== 0 && (n[S++] = r), s = a + o, r = o - (s - a), r !== 0 && (n[S++] = r);
  return (s !== 0 || S === 0) && (n[S++] = s), S;
}
function Ms(i, t) {
  let e = t[0];
  for (let n = 1; n < i; n++) e += t[n];
  return e;
}
function ot(i) {
  return new Float64Array(i);
}
const js = (3 + 16 * xt) * xt, Gs = (2 + 12 * xt) * xt, Ks = (9 + 64 * xt) * xt * xt, ee = ot(4), En = ot(8), _n = ot(12), In = ot(16), kt = ot(4);
function Ws(i, t, e, n, s, o, r) {
  let a, c, f, l, h, u, p, y, d, S, E, w, k, g, m, b, v, x;
  const M = i - s, T = e - s, O = t - o, D = n - o;
  g = M * D, u = J * M, p = u - (u - M), y = M - p, u = J * D, d = u - (u - D), S = D - d, m = y * S - (g - p * d - y * d - p * S), b = O * T, u = J * O, p = u - (u - O), y = O - p, u = J * T, d = u - (u - T), S = T - d, v = y * S - (b - p * d - y * d - p * S), E = m - v, h = m - E, ee[0] = m - (E + h) + (h - v), w = g + E, h = w - g, k = g - (w - h) + (E - h), E = k - b, h = k - E, ee[1] = k - (E + h) + (h - b), x = w + E, h = x - w, ee[2] = w - (x - h) + (E - h), ee[3] = x;
  let C = Ms(4, ee), _ = Gs * r;
  if (C >= _ || -C >= _ || (h = i - M, a = i - (M + h) + (h - s), h = e - T, f = e - (T + h) + (h - s), h = t - O, c = t - (O + h) + (h - o), h = n - D, l = n - (D + h) + (h - o), a === 0 && c === 0 && f === 0 && l === 0) || (_ = Ks * r + Ss * Math.abs(C), C += M * l + D * a - (O * f + T * c), C >= _ || -C >= _)) return C;
  g = a * D, u = J * a, p = u - (u - a), y = a - p, u = J * D, d = u - (u - D), S = D - d, m = y * S - (g - p * d - y * d - p * S), b = c * T, u = J * c, p = u - (u - c), y = c - p, u = J * T, d = u - (u - T), S = T - d, v = y * S - (b - p * d - y * d - p * S), E = m - v, h = m - E, kt[0] = m - (E + h) + (h - v), w = g + E, h = w - g, k = g - (w - h) + (E - h), E = k - b, h = k - E, kt[1] = k - (E + h) + (h - b), x = w + E, h = x - w, kt[2] = w - (x - h) + (E - h), kt[3] = x;
  const N = vt(4, ee, 4, kt, En);
  g = M * l, u = J * M, p = u - (u - M), y = M - p, u = J * l, d = u - (u - l), S = l - d, m = y * S - (g - p * d - y * d - p * S), b = O * f, u = J * O, p = u - (u - O), y = O - p, u = J * f, d = u - (u - f), S = f - d, v = y * S - (b - p * d - y * d - p * S), E = m - v, h = m - E, kt[0] = m - (E + h) + (h - v), w = g + E, h = w - g, k = g - (w - h) + (E - h), E = k - b, h = k - E, kt[1] = k - (E + h) + (h - b), x = w + E, h = x - w, kt[2] = w - (x - h) + (E - h), kt[3] = x;
  const A = vt(N, En, 4, kt, _n);
  g = a * l, u = J * a, p = u - (u - a), y = a - p, u = J * l, d = u - (u - l), S = l - d, m = y * S - (g - p * d - y * d - p * S), b = c * f, u = J * c, p = u - (u - c), y = c - p, u = J * f, d = u - (u - f), S = f - d, v = y * S - (b - p * d - y * d - p * S), E = m - v, h = m - E, kt[0] = m - (E + h) + (h - v), w = g + E, h = w - g, k = g - (w - h) + (E - h), E = k - b, h = k - E, kt[1] = k - (E + h) + (h - b), x = w + E, h = x - w, kt[2] = w - (x - h) + (E - h), kt[3] = x;
  const F = vt(A, _n, 4, kt, In);
  return In[F - 1];
}
function ft(i, t, e, n, s, o) {
  const r = (t - o) * (e - s), a = (i - s) * (n - o), c = r - a, f = Math.abs(r + a);
  return Math.abs(c) >= js * f ? c : -Ws(i, t, e, n, s, o, f);
}
const Hs = (10 + 96 * xt) * xt, Js = (4 + 48 * xt) * xt, Qs = (44 + 576 * xt) * xt * xt, Vt = ot(4), $t = ot(4), Lt = ot(4), Ft = ot(4), Bt = ot(4), Rt = ot(4), St = ot(4), Mt = ot(4), Ke = ot(8), We = ot(8), He = ot(8), Je = ot(8), Qe = ot(8), Ze = ot(8), ve = ot(8), be = ot(8), ye = ot(8), jt = ot(4), Gt = ot(4), Kt = ot(4), Z = ot(8), nt = ot(16), ht = ot(16), ut = ot(16), ct = ot(32), Xt = ot(32), pt = ot(48), _t = ot(64);
let re = ot(1152), tn = ot(1152);
function mt(i, t, e) {
  i = vt(i, re, t, e, tn);
  const n = re;
  return re = tn, tn = n, i;
}
function Zs(i, t, e, n, s, o, r, a, c) {
  let f, l, h, u, p, y, d, S, E, w, k, g, m, b, v, x, M, T, O, D, C, _, N, A, F, P, V, I, B, $, X, U, Y, L, q;
  const K = i - r, H = e - r, Q = s - r, W = t - a, tt = n - a, et = o - a;
  X = H * et, N = J * H, A = N - (N - H), F = H - A, N = J * et, P = N - (N - et), V = et - P, U = F * V - (X - A * P - F * P - A * V), Y = Q * tt, N = J * Q, A = N - (N - Q), F = Q - A, N = J * tt, P = N - (N - tt), V = tt - P, L = F * V - (Y - A * P - F * P - A * V), I = U - L, _ = U - I, Vt[0] = U - (I + _) + (_ - L), B = X + I, _ = B - X, $ = X - (B - _) + (I - _), I = $ - Y, _ = $ - I, Vt[1] = $ - (I + _) + (_ - Y), q = B + I, _ = q - B, Vt[2] = B - (q - _) + (I - _), Vt[3] = q, X = Q * W, N = J * Q, A = N - (N - Q), F = Q - A, N = J * W, P = N - (N - W), V = W - P, U = F * V - (X - A * P - F * P - A * V), Y = K * et, N = J * K, A = N - (N - K), F = K - A, N = J * et, P = N - (N - et), V = et - P, L = F * V - (Y - A * P - F * P - A * V), I = U - L, _ = U - I, $t[0] = U - (I + _) + (_ - L), B = X + I, _ = B - X, $ = X - (B - _) + (I - _), I = $ - Y, _ = $ - I, $t[1] = $ - (I + _) + (_ - Y), q = B + I, _ = q - B, $t[2] = B - (q - _) + (I - _), $t[3] = q, X = K * tt, N = J * K, A = N - (N - K), F = K - A, N = J * tt, P = N - (N - tt), V = tt - P, U = F * V - (X - A * P - F * P - A * V), Y = H * W, N = J * H, A = N - (N - H), F = H - A, N = J * W, P = N - (N - W), V = W - P, L = F * V - (Y - A * P - F * P - A * V), I = U - L, _ = U - I, Lt[0] = U - (I + _) + (_ - L), B = X + I, _ = B - X, $ = X - (B - _) + (I - _), I = $ - Y, _ = $ - I, Lt[1] = $ - (I + _) + (_ - Y), q = B + I, _ = q - B, Lt[2] = B - (q - _) + (I - _), Lt[3] = q, f = vt(
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
  let lt = Ms(f, re), R = Js * c;
  if (lt >= R || -lt >= R || (_ = i - K, l = i - (K + _) + (_ - r), _ = t - W, p = t - (W + _) + (_ - a), _ = e - H, h = e - (H + _) + (_ - r), _ = n - tt, y = n - (tt + _) + (_ - a), _ = s - Q, u = s - (Q + _) + (_ - r), _ = o - et, d = o - (et + _) + (_ - a), l === 0 && h === 0 && u === 0 && p === 0 && y === 0 && d === 0) || (R = Qs * c + Ss * Math.abs(lt), lt += (K * K + W * W) * (H * d + et * h - (tt * u + Q * y)) + 2 * (K * l + W * p) * (H * et - tt * Q) + ((H * H + tt * tt) * (Q * p + W * u - (et * l + K * d)) + 2 * (H * h + tt * y) * (Q * W - et * K)) + ((Q * Q + et * et) * (K * y + tt * l - (W * h + H * p)) + 2 * (Q * u + et * d) * (K * tt - W * H)), lt >= R || -lt >= R))
    return lt;
  if ((h !== 0 || y !== 0 || u !== 0 || d !== 0) && (X = K * K, N = J * K, A = N - (N - K), F = K - A, U = F * F - (X - A * A - (A + A) * F), Y = W * W, N = J * W, A = N - (N - W), F = W - A, L = F * F - (Y - A * A - (A + A) * F), I = U + L, _ = I - U, Ft[0] = U - (I - _) + (L - _), B = X + I, _ = B - X, $ = X - (B - _) + (I - _), I = $ + Y, _ = I - $, Ft[1] = $ - (I - _) + (Y - _), q = B + I, _ = q - B, Ft[2] = B - (q - _) + (I - _), Ft[3] = q), (u !== 0 || d !== 0 || l !== 0 || p !== 0) && (X = H * H, N = J * H, A = N - (N - H), F = H - A, U = F * F - (X - A * A - (A + A) * F), Y = tt * tt, N = J * tt, A = N - (N - tt), F = tt - A, L = F * F - (Y - A * A - (A + A) * F), I = U + L, _ = I - U, Bt[0] = U - (I - _) + (L - _), B = X + I, _ = B - X, $ = X - (B - _) + (I - _), I = $ + Y, _ = I - $, Bt[1] = $ - (I - _) + (Y - _), q = B + I, _ = q - B, Bt[2] = B - (q - _) + (I - _), Bt[3] = q), (l !== 0 || p !== 0 || h !== 0 || y !== 0) && (X = Q * Q, N = J * Q, A = N - (N - Q), F = Q - A, U = F * F - (X - A * A - (A + A) * F), Y = et * et, N = J * et, A = N - (N - et), F = et - A, L = F * F - (Y - A * A - (A + A) * F), I = U + L, _ = I - U, Rt[0] = U - (I - _) + (L - _), B = X + I, _ = B - X, $ = X - (B - _) + (I - _), I = $ + Y, _ = I - $, Rt[1] = $ - (I - _) + (Y - _), q = B + I, _ = q - B, Rt[2] = B - (q - _) + (I - _), Rt[3] = q), l !== 0 && (S = j(4, Vt, l, Ke), f = mt(f, Nt(
    j(S, Ke, 2 * K, nt),
    nt,
    j(j(4, Rt, l, Z), Z, tt, ht),
    ht,
    j(j(4, Bt, l, Z), Z, -et, ut),
    ut,
    ct,
    pt
  ), pt)), p !== 0 && (E = j(4, Vt, p, We), f = mt(f, Nt(
    j(E, We, 2 * W, nt),
    nt,
    j(j(4, Bt, p, Z), Z, Q, ht),
    ht,
    j(j(4, Rt, p, Z), Z, -H, ut),
    ut,
    ct,
    pt
  ), pt)), h !== 0 && (w = j(4, $t, h, He), f = mt(f, Nt(
    j(w, He, 2 * H, nt),
    nt,
    j(j(4, Ft, h, Z), Z, et, ht),
    ht,
    j(j(4, Rt, h, Z), Z, -W, ut),
    ut,
    ct,
    pt
  ), pt)), y !== 0 && (k = j(4, $t, y, Je), f = mt(f, Nt(
    j(k, Je, 2 * tt, nt),
    nt,
    j(j(4, Rt, y, Z), Z, K, ht),
    ht,
    j(j(4, Ft, y, Z), Z, -Q, ut),
    ut,
    ct,
    pt
  ), pt)), u !== 0 && (g = j(4, Lt, u, Qe), f = mt(f, Nt(
    j(g, Qe, 2 * Q, nt),
    nt,
    j(j(4, Bt, u, Z), Z, W, ht),
    ht,
    j(j(4, Ft, u, Z), Z, -tt, ut),
    ut,
    ct,
    pt
  ), pt)), d !== 0 && (m = j(4, Lt, d, Ze), f = mt(f, Nt(
    j(m, Ze, 2 * et, nt),
    nt,
    j(j(4, Ft, d, Z), Z, H, ht),
    ht,
    j(j(4, Bt, d, Z), Z, -K, ut),
    ut,
    ct,
    pt
  ), pt)), l !== 0 || p !== 0) {
    if (h !== 0 || y !== 0 || u !== 0 || d !== 0 ? (X = h * et, N = J * h, A = N - (N - h), F = h - A, N = J * et, P = N - (N - et), V = et - P, U = F * V - (X - A * P - F * P - A * V), Y = H * d, N = J * H, A = N - (N - H), F = H - A, N = J * d, P = N - (N - d), V = d - P, L = F * V - (Y - A * P - F * P - A * V), I = U + L, _ = I - U, St[0] = U - (I - _) + (L - _), B = X + I, _ = B - X, $ = X - (B - _) + (I - _), I = $ + Y, _ = I - $, St[1] = $ - (I - _) + (Y - _), q = B + I, _ = q - B, St[2] = B - (q - _) + (I - _), St[3] = q, X = u * -tt, N = J * u, A = N - (N - u), F = u - A, N = J * -tt, P = N - (N - -tt), V = -tt - P, U = F * V - (X - A * P - F * P - A * V), Y = Q * -y, N = J * Q, A = N - (N - Q), F = Q - A, N = J * -y, P = N - (N - -y), V = -y - P, L = F * V - (Y - A * P - F * P - A * V), I = U + L, _ = I - U, Mt[0] = U - (I - _) + (L - _), B = X + I, _ = B - X, $ = X - (B - _) + (I - _), I = $ + Y, _ = I - $, Mt[1] = $ - (I - _) + (Y - _), q = B + I, _ = q - B, Mt[2] = B - (q - _) + (I - _), Mt[3] = q, v = vt(4, St, 4, Mt, be), X = h * d, N = J * h, A = N - (N - h), F = h - A, N = J * d, P = N - (N - d), V = d - P, U = F * V - (X - A * P - F * P - A * V), Y = u * y, N = J * u, A = N - (N - u), F = u - A, N = J * y, P = N - (N - y), V = y - P, L = F * V - (Y - A * P - F * P - A * V), I = U - L, _ = U - I, Gt[0] = U - (I + _) + (_ - L), B = X + I, _ = B - X, $ = X - (B - _) + (I - _), I = $ - Y, _ = $ - I, Gt[1] = $ - (I + _) + (_ - Y), q = B + I, _ = q - B, Gt[2] = B - (q - _) + (I - _), Gt[3] = q, T = 4) : (be[0] = 0, v = 1, Gt[0] = 0, T = 1), l !== 0) {
      const z = j(v, be, l, ut);
      f = mt(f, vt(
        j(S, Ke, l, nt),
        nt,
        j(z, ut, 2 * K, ct),
        ct,
        pt
      ), pt);
      const G = j(T, Gt, l, Z);
      f = mt(f, Nt(
        j(G, Z, 2 * K, nt),
        nt,
        j(G, Z, l, ht),
        ht,
        j(z, ut, l, ct),
        ct,
        Xt,
        _t
      ), _t), y !== 0 && (f = mt(f, j(j(4, Rt, l, Z), Z, y, nt), nt)), d !== 0 && (f = mt(f, j(j(4, Bt, -l, Z), Z, d, nt), nt));
    }
    if (p !== 0) {
      const z = j(v, be, p, ut);
      f = mt(f, vt(
        j(E, We, p, nt),
        nt,
        j(z, ut, 2 * W, ct),
        ct,
        pt
      ), pt);
      const G = j(T, Gt, p, Z);
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
  if (h !== 0 || y !== 0) {
    if (u !== 0 || d !== 0 || l !== 0 || p !== 0 ? (X = u * W, N = J * u, A = N - (N - u), F = u - A, N = J * W, P = N - (N - W), V = W - P, U = F * V - (X - A * P - F * P - A * V), Y = Q * p, N = J * Q, A = N - (N - Q), F = Q - A, N = J * p, P = N - (N - p), V = p - P, L = F * V - (Y - A * P - F * P - A * V), I = U + L, _ = I - U, St[0] = U - (I - _) + (L - _), B = X + I, _ = B - X, $ = X - (B - _) + (I - _), I = $ + Y, _ = I - $, St[1] = $ - (I - _) + (Y - _), q = B + I, _ = q - B, St[2] = B - (q - _) + (I - _), St[3] = q, D = -et, C = -d, X = l * D, N = J * l, A = N - (N - l), F = l - A, N = J * D, P = N - (N - D), V = D - P, U = F * V - (X - A * P - F * P - A * V), Y = K * C, N = J * K, A = N - (N - K), F = K - A, N = J * C, P = N - (N - C), V = C - P, L = F * V - (Y - A * P - F * P - A * V), I = U + L, _ = I - U, Mt[0] = U - (I - _) + (L - _), B = X + I, _ = B - X, $ = X - (B - _) + (I - _), I = $ + Y, _ = I - $, Mt[1] = $ - (I - _) + (Y - _), q = B + I, _ = q - B, Mt[2] = B - (q - _) + (I - _), Mt[3] = q, x = vt(4, St, 4, Mt, ye), X = u * p, N = J * u, A = N - (N - u), F = u - A, N = J * p, P = N - (N - p), V = p - P, U = F * V - (X - A * P - F * P - A * V), Y = l * d, N = J * l, A = N - (N - l), F = l - A, N = J * d, P = N - (N - d), V = d - P, L = F * V - (Y - A * P - F * P - A * V), I = U - L, _ = U - I, Kt[0] = U - (I + _) + (_ - L), B = X + I, _ = B - X, $ = X - (B - _) + (I - _), I = $ - Y, _ = $ - I, Kt[1] = $ - (I + _) + (_ - Y), q = B + I, _ = q - B, Kt[2] = B - (q - _) + (I - _), Kt[3] = q, O = 4) : (ye[0] = 0, x = 1, Kt[0] = 0, O = 1), h !== 0) {
      const z = j(x, ye, h, ut);
      f = mt(f, vt(
        j(w, He, h, nt),
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
    if (y !== 0) {
      const z = j(x, ye, y, ut);
      f = mt(f, vt(
        j(k, Je, y, nt),
        nt,
        j(z, ut, 2 * tt, ct),
        ct,
        pt
      ), pt);
      const G = j(O, Kt, y, Z);
      f = mt(f, Nt(
        j(G, Z, 2 * tt, nt),
        nt,
        j(G, Z, y, ht),
        ht,
        j(z, ut, y, ct),
        ct,
        Xt,
        _t
      ), _t);
    }
  }
  if (u !== 0 || d !== 0) {
    if (l !== 0 || p !== 0 || h !== 0 || y !== 0 ? (X = l * tt, N = J * l, A = N - (N - l), F = l - A, N = J * tt, P = N - (N - tt), V = tt - P, U = F * V - (X - A * P - F * P - A * V), Y = K * y, N = J * K, A = N - (N - K), F = K - A, N = J * y, P = N - (N - y), V = y - P, L = F * V - (Y - A * P - F * P - A * V), I = U + L, _ = I - U, St[0] = U - (I - _) + (L - _), B = X + I, _ = B - X, $ = X - (B - _) + (I - _), I = $ + Y, _ = I - $, St[1] = $ - (I - _) + (Y - _), q = B + I, _ = q - B, St[2] = B - (q - _) + (I - _), St[3] = q, D = -W, C = -p, X = h * D, N = J * h, A = N - (N - h), F = h - A, N = J * D, P = N - (N - D), V = D - P, U = F * V - (X - A * P - F * P - A * V), Y = H * C, N = J * H, A = N - (N - H), F = H - A, N = J * C, P = N - (N - C), V = C - P, L = F * V - (Y - A * P - F * P - A * V), I = U + L, _ = I - U, Mt[0] = U - (I - _) + (L - _), B = X + I, _ = B - X, $ = X - (B - _) + (I - _), I = $ + Y, _ = I - $, Mt[1] = $ - (I - _) + (Y - _), q = B + I, _ = q - B, Mt[2] = B - (q - _) + (I - _), Mt[3] = q, b = vt(4, St, 4, Mt, ve), X = l * y, N = J * l, A = N - (N - l), F = l - A, N = J * y, P = N - (N - y), V = y - P, U = F * V - (X - A * P - F * P - A * V), Y = h * p, N = J * h, A = N - (N - h), F = h - A, N = J * p, P = N - (N - p), V = p - P, L = F * V - (Y - A * P - F * P - A * V), I = U - L, _ = U - I, jt[0] = U - (I + _) + (_ - L), B = X + I, _ = B - X, $ = X - (B - _) + (I - _), I = $ - Y, _ = $ - I, jt[1] = $ - (I + _) + (_ - Y), q = B + I, _ = q - B, jt[2] = B - (q - _) + (I - _), jt[3] = q, M = 4) : (ve[0] = 0, b = 1, jt[0] = 0, M = 1), u !== 0) {
      const z = j(b, ve, u, ut);
      f = mt(f, vt(
        j(g, Qe, u, nt),
        nt,
        j(z, ut, 2 * Q, ct),
        ct,
        pt
      ), pt);
      const G = j(M, jt, u, Z);
      f = mt(f, Nt(
        j(G, Z, 2 * Q, nt),
        nt,
        j(G, Z, u, ht),
        ht,
        j(z, ut, u, ct),
        ct,
        Xt,
        _t
      ), _t), p !== 0 && (f = mt(f, j(j(4, Bt, u, Z), Z, p, nt), nt)), y !== 0 && (f = mt(f, j(j(4, Ft, -u, Z), Z, y, nt), nt));
    }
    if (d !== 0) {
      const z = j(b, ve, d, ut);
      f = mt(f, vt(
        j(m, Ze, d, nt),
        nt,
        j(z, ut, 2 * et, ct),
        ct,
        pt
      ), pt);
      const G = j(M, jt, d, Z);
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
function $e(i, t, e, n, s, o, r, a) {
  const c = i - r, f = e - r, l = s - r, h = t - a, u = n - a, p = o - a, y = f * p, d = l * u, S = c * c + h * h, E = l * h, w = c * p, k = f * f + u * u, g = c * u, m = f * h, b = l * l + p * p, v = S * (y - d) + k * (E - w) + b * (g - m), x = (Math.abs(y) + Math.abs(d)) * S + (Math.abs(E) + Math.abs(w)) * k + (Math.abs(g) + Math.abs(m)) * b, M = Hs * x;
  return v > M || -v > M ? v : Zs(i, t, e, n, s, o, r, a, x);
}
function tr(i, t) {
  var e, n, s = 0, o, r, a, c, f, l, h, u = i[0], p = i[1], y = t.length;
  for (e = 0; e < y; e++) {
    n = 0;
    var d = t[e], S = d.length - 1;
    if (l = d[0], l[0] !== d[S][0] && l[1] !== d[S][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (r = l[0] - u, a = l[1] - p, n; n < S; n++) {
      if (h = d[n + 1], c = h[0] - u, f = h[1] - p, a === 0 && f === 0) {
        if (c <= 0 && r >= 0 || r <= 0 && c >= 0)
          return 0;
      } else if (f >= 0 && a <= 0 || f <= 0 && a >= 0) {
        if (o = ft(r, c, a, f, 0, 0), o === 0)
          return 0;
        (o > 0 && f > 0 && a <= 0 || o < 0 && f <= 0 && a > 0) && s++;
      }
      l = h, a = f, r = c;
    }
  }
  return s % 2 !== 0;
}
function en(i, t, e = {}) {
  if (!i)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const n = qs(i), s = Us(t), o = s.type, r = t.bbox;
  let a = s.coordinates;
  if (r && er(n, r) === !1)
    return !1;
  o === "Polygon" && (a = [a]);
  for (var c = 0; c < a.length; ++c) {
    const f = tr(n, a[c]);
    if (f === 0 && !e.ignoreBoundary) return !0;
    if (f) return !0;
  }
  return !1;
}
function er(i, t) {
  return t[0] <= i[0] && t[1] <= i[1] && t[2] >= i[0] && t[3] >= i[1];
}
class gn {
  constructor(t = [], e = nr) {
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
function nr(i, t) {
  return i < t ? -1 : i > t ? 1 : 0;
}
const sr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: gn
}, Symbol.toStringTag, { value: "Module" })), Ct = 11102230246251565e-32, yt = 134217729, rr = (3 + 8 * Ct) * Ct;
function nn(i, t, e, n, s) {
  let o, r, a, c, f = t[0], l = n[0], h = 0, u = 0;
  l > f == l > -f ? (o = f, f = t[++h]) : (o = l, l = n[++u]);
  let p = 0;
  if (h < i && u < e)
    for (l > f == l > -f ? (r = f + o, a = o - (r - f), f = t[++h]) : (r = l + o, a = o - (r - l), l = n[++u]), o = r, a !== 0 && (s[p++] = a); h < i && u < e; )
      l > f == l > -f ? (r = o + f, c = r - o, a = o - (r - c) + (f - c), f = t[++h]) : (r = o + l, c = r - o, a = o - (r - c) + (l - c), l = n[++u]), o = r, a !== 0 && (s[p++] = a);
  for (; h < i; )
    r = o + f, c = r - o, a = o - (r - c) + (f - c), f = t[++h], o = r, a !== 0 && (s[p++] = a);
  for (; u < e; )
    r = o + l, c = r - o, a = o - (r - c) + (l - c), l = n[++u], o = r, a !== 0 && (s[p++] = a);
  return (o !== 0 || p === 0) && (s[p++] = o), p;
}
function ir(i, t) {
  let e = t[0];
  for (let n = 1; n < i; n++) e += t[n];
  return e;
}
function we(i) {
  return new Float64Array(i);
}
const or = (3 + 16 * Ct) * Ct, ar = (2 + 12 * Ct) * Ct, cr = (9 + 64 * Ct) * Ct * Ct, ne = we(4), An = we(8), Nn = we(12), On = we(16), Et = we(4);
function fr(i, t, e, n, s, o, r) {
  let a, c, f, l, h, u, p, y, d, S, E, w, k, g, m, b, v, x;
  const M = i - s, T = e - s, O = t - o, D = n - o;
  g = M * D, u = yt * M, p = u - (u - M), y = M - p, u = yt * D, d = u - (u - D), S = D - d, m = y * S - (g - p * d - y * d - p * S), b = O * T, u = yt * O, p = u - (u - O), y = O - p, u = yt * T, d = u - (u - T), S = T - d, v = y * S - (b - p * d - y * d - p * S), E = m - v, h = m - E, ne[0] = m - (E + h) + (h - v), w = g + E, h = w - g, k = g - (w - h) + (E - h), E = k - b, h = k - E, ne[1] = k - (E + h) + (h - b), x = w + E, h = x - w, ne[2] = w - (x - h) + (E - h), ne[3] = x;
  let C = ir(4, ne), _ = ar * r;
  if (C >= _ || -C >= _ || (h = i - M, a = i - (M + h) + (h - s), h = e - T, f = e - (T + h) + (h - s), h = t - O, c = t - (O + h) + (h - o), h = n - D, l = n - (D + h) + (h - o), a === 0 && c === 0 && f === 0 && l === 0) || (_ = cr * r + rr * Math.abs(C), C += M * l + D * a - (O * f + T * c), C >= _ || -C >= _)) return C;
  g = a * D, u = yt * a, p = u - (u - a), y = a - p, u = yt * D, d = u - (u - D), S = D - d, m = y * S - (g - p * d - y * d - p * S), b = c * T, u = yt * c, p = u - (u - c), y = c - p, u = yt * T, d = u - (u - T), S = T - d, v = y * S - (b - p * d - y * d - p * S), E = m - v, h = m - E, Et[0] = m - (E + h) + (h - v), w = g + E, h = w - g, k = g - (w - h) + (E - h), E = k - b, h = k - E, Et[1] = k - (E + h) + (h - b), x = w + E, h = x - w, Et[2] = w - (x - h) + (E - h), Et[3] = x;
  const N = nn(4, ne, 4, Et, An);
  g = M * l, u = yt * M, p = u - (u - M), y = M - p, u = yt * l, d = u - (u - l), S = l - d, m = y * S - (g - p * d - y * d - p * S), b = O * f, u = yt * O, p = u - (u - O), y = O - p, u = yt * f, d = u - (u - f), S = f - d, v = y * S - (b - p * d - y * d - p * S), E = m - v, h = m - E, Et[0] = m - (E + h) + (h - v), w = g + E, h = w - g, k = g - (w - h) + (E - h), E = k - b, h = k - E, Et[1] = k - (E + h) + (h - b), x = w + E, h = x - w, Et[2] = w - (x - h) + (E - h), Et[3] = x;
  const A = nn(N, An, 4, Et, Nn);
  g = a * l, u = yt * a, p = u - (u - a), y = a - p, u = yt * l, d = u - (u - l), S = l - d, m = y * S - (g - p * d - y * d - p * S), b = c * f, u = yt * c, p = u - (u - c), y = c - p, u = yt * f, d = u - (u - f), S = f - d, v = y * S - (b - p * d - y * d - p * S), E = m - v, h = m - E, Et[0] = m - (E + h) + (h - v), w = g + E, h = w - g, k = g - (w - h) + (E - h), E = k - b, h = k - E, Et[1] = k - (E + h) + (h - b), x = w + E, h = x - w, Et[2] = w - (x - h) + (E - h), Et[3] = x;
  const F = nn(A, Nn, 4, Et, On);
  return On[F - 1];
}
function Tn(i, t, e, n, s, o) {
  const r = (t - o) * (e - s), a = (i - s) * (n - o), c = r - a;
  if (r === 0 || a === 0 || r > 0 != a > 0) return c;
  const f = Math.abs(r + a);
  return Math.abs(c) >= or * f ? c : -fr(i, t, e, n, s, o, f);
}
function lr(i, t) {
  const e = new gn([], Es);
  return ur(i, e), dr(e, t);
}
function Es(i, t) {
  return i.p.x > t.p.x ? 1 : i.p.x < t.p.x || i.p.x === t.p.x && (i.featureId !== t.featureId || i.ringId !== t.ringId) && i.isLeftEndpoint && !t.isLeftEndpoint ? -1 : i.p.y !== t.p.y ? i.p.y > t.p.y ? 1 : -1 : 1;
}
function hr(i, t) {
  return i.rightSweepEvent.p.x > t.rightSweepEvent.p.x ? 1 : i.rightSweepEvent.p.x < t.rightSweepEvent.p.x ? -1 : i.rightSweepEvent.p.y !== t.rightSweepEvent.p.y ? i.rightSweepEvent.p.y < t.rightSweepEvent.p.y ? 1 : -1 : 1;
}
function ur(i, t) {
  if (i.type === "FeatureCollection") {
    const e = i.features;
    for (let n = 0; n < e.length; n++)
      Fn(e[n], t);
  } else
    Fn(i, t);
}
var xe = 0, ke = 0, Se = 0;
function Fn(i, t) {
  const e = i.type === "Feature" ? i.geometry : i;
  let n = e.coordinates;
  (e.type === "Polygon" || e.type === "MultiLineString") && (n = [n]), e.type === "LineString" && (n = [[n]]);
  for (let s = 0; s < n.length; s++)
    for (let o = 0; o < n[s].length; o++) {
      let r = n[s][o][0], a = null;
      ke = ke + 1;
      for (let c = 0; c < n[s][o].length - 1; c++) {
        a = n[s][o][c + 1];
        const f = new Bn(r, xe, ke, Se), l = new Bn(a, xe, ke, Se + 1);
        f.otherEvent = l, l.otherEvent = f, Es(f, l) > 0 ? (l.isLeftEndpoint = !0, f.isLeftEndpoint = !1) : (f.isLeftEndpoint = !0, l.isLeftEndpoint = !1), t.push(f), t.push(l), r = a, Se = Se + 1;
      }
    }
  xe = xe + 1;
}
var Bn = class {
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
function dr(i, t = !1) {
  const e = [], n = new gn([], hr);
  for (; i.length; ) {
    const s = i.pop();
    if (s.isLeftEndpoint) {
      const o = new gr(s);
      for (let r = 0; r < n.data.length; r++) {
        const a = n.data[r];
        if (t && a.leftSweepEvent.featureId === s.featureId)
          continue;
        const c = pr(o, a);
        c !== !1 && e.push(c);
      }
      n.push(o);
    } else s.isLeftEndpoint === !1 && n.pop();
  }
  return e;
}
var gr = class {
  /** @param event must have otherEvent non-null */
  constructor(i) {
    this.leftSweepEvent = i, this.rightSweepEvent = i.otherEvent;
  }
};
function pr(i, t) {
  if (i === null || t === null) return !1;
  const e = i.leftSweepEvent.p.x, n = i.leftSweepEvent.p.y, s = i.rightSweepEvent.p.x, o = i.rightSweepEvent.p.y, r = t.leftSweepEvent.p.x, a = t.leftSweepEvent.p.y, c = t.rightSweepEvent.p.x, f = t.rightSweepEvent.p.y, l = Tn(e, n, s, o, r, a), h = Tn(e, n, s, o, c, f);
  if (l > 0 && h > 0) return !1;
  if (l < 0 && h < 0) return !1;
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
  const u = (f - a) * (s - e) - (c - r) * (o - n), p = (c - r) * (n - a) - (f - a) * (e - r), y = (s - e) * (n - a) - (o - n) * (e - r);
  if (u === 0)
    return !1;
  const d = p / u, S = y / u;
  if (d >= 0 && d <= 1 && S >= 0 && S <= 1) {
    const E = e + d * (s - e), w = n + d * (o - n);
    return [E, w];
  }
  return !1;
}
function mr(i, t, e = {}) {
  const { removeDuplicates: n = !0, ignoreSelfIntersections: s = !0 } = e;
  let o = [];
  i.type === "FeatureCollection" ? o = o.concat(i.features) : i.type === "Feature" ? o.push(i) : (i.type === "LineString" || i.type === "Polygon" || i.type === "MultiLineString" || i.type === "MultiPolygon") && o.push(de(i)), t.type === "FeatureCollection" ? o = o.concat(t.features) : t.type === "Feature" ? o.push(t) : (t.type === "LineString" || t.type === "Polygon" || t.type === "MultiLineString" || t.type === "MultiPolygon") && o.push(de(t));
  const r = lr(
    bt(o),
    s
  );
  let a = [];
  if (n) {
    const c = {};
    r.forEach((f) => {
      const l = f.join(",");
      c[l] || (c[l] = !0, a.push(f));
    });
  } else
    a = r;
  return bt(a.map((c) => Zt(c)));
}
function wr(i) {
  return i && i.__esModule && Object.prototype.hasOwnProperty.call(i, "default") ? i.default : i;
}
function vr(i) {
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
function br(i, t = {}) {
  let e = 0, n = 0, s = 0;
  return dn(
    i,
    function(o) {
      e += o[0], n += o[1], s++;
    },
    !0
  ), Zt([e / s, n / s], t.properties);
}
var Me = { exports: {} }, Te = { exports: {} }, yr = Te.exports, Rn;
function xr() {
  return Rn || (Rn = 1, (function(i, t) {
    (function(e, n) {
      i.exports = n();
    })(yr, function() {
      function e(w, k, g, m, b) {
        (function v(x, M, T, O, D) {
          for (; O > T; ) {
            if (O - T > 600) {
              var C = O - T + 1, _ = M - T + 1, N = Math.log(C), A = 0.5 * Math.exp(2 * N / 3), F = 0.5 * Math.sqrt(N * A * (C - A) / C) * (_ - C / 2 < 0 ? -1 : 1), P = Math.max(T, Math.floor(M - _ * A / C + F)), V = Math.min(O, Math.floor(M + (C - _) * A / C + F));
              v(x, M, P, V, D);
            }
            var I = x[M], B = T, $ = O;
            for (n(x, T, M), D(x[O], I) > 0 && n(x, T, O); B < $; ) {
              for (n(x, B, $), B++, $--; D(x[B], I) < 0; ) B++;
              for (; D(x[$], I) > 0; ) $--;
            }
            D(x[T], I) === 0 ? n(x, T, $) : n(x, ++$, O), $ <= M && (T = $ + 1), M <= $ && (O = $ - 1);
          }
        })(w, k, g || 0, m || w.length - 1, b || s);
      }
      function n(w, k, g) {
        var m = w[k];
        w[k] = w[g], w[g] = m;
      }
      function s(w, k) {
        return w < k ? -1 : w > k ? 1 : 0;
      }
      var o = function(w) {
        w === void 0 && (w = 9), this._maxEntries = Math.max(4, w), this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries)), this.clear();
      };
      function r(w, k, g) {
        if (!g) return k.indexOf(w);
        for (var m = 0; m < k.length; m++) if (g(w, k[m])) return m;
        return -1;
      }
      function a(w, k) {
        c(w, 0, w.children.length, k, w);
      }
      function c(w, k, g, m, b) {
        b || (b = S(null)), b.minX = 1 / 0, b.minY = 1 / 0, b.maxX = -1 / 0, b.maxY = -1 / 0;
        for (var v = k; v < g; v++) {
          var x = w.children[v];
          f(b, w.leaf ? m(x) : x);
        }
        return b;
      }
      function f(w, k) {
        return w.minX = Math.min(w.minX, k.minX), w.minY = Math.min(w.minY, k.minY), w.maxX = Math.max(w.maxX, k.maxX), w.maxY = Math.max(w.maxY, k.maxY), w;
      }
      function l(w, k) {
        return w.minX - k.minX;
      }
      function h(w, k) {
        return w.minY - k.minY;
      }
      function u(w) {
        return (w.maxX - w.minX) * (w.maxY - w.minY);
      }
      function p(w) {
        return w.maxX - w.minX + (w.maxY - w.minY);
      }
      function y(w, k) {
        return w.minX <= k.minX && w.minY <= k.minY && k.maxX <= w.maxX && k.maxY <= w.maxY;
      }
      function d(w, k) {
        return k.minX <= w.maxX && k.minY <= w.maxY && k.maxX >= w.minX && k.maxY >= w.minY;
      }
      function S(w) {
        return { children: w, height: 1, leaf: !0, minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
      }
      function E(w, k, g, m, b) {
        for (var v = [k, g]; v.length; ) if (!((g = v.pop()) - (k = v.pop()) <= m)) {
          var x = k + Math.ceil((g - k) / m / 2) * m;
          e(w, x, k, g, b), v.push(k, x, x, g);
        }
      }
      return o.prototype.all = function() {
        return this._all(this.data, []);
      }, o.prototype.search = function(w) {
        var k = this.data, g = [];
        if (!d(w, k)) return g;
        for (var m = this.toBBox, b = []; k; ) {
          for (var v = 0; v < k.children.length; v++) {
            var x = k.children[v], M = k.leaf ? m(x) : x;
            d(w, M) && (k.leaf ? g.push(x) : y(w, M) ? this._all(x, g) : b.push(x));
          }
          k = b.pop();
        }
        return g;
      }, o.prototype.collides = function(w) {
        var k = this.data;
        if (!d(w, k)) return !1;
        for (var g = []; k; ) {
          for (var m = 0; m < k.children.length; m++) {
            var b = k.children[m], v = k.leaf ? this.toBBox(b) : b;
            if (d(w, v)) {
              if (k.leaf || y(w, v)) return !0;
              g.push(b);
            }
          }
          k = g.pop();
        }
        return !1;
      }, o.prototype.load = function(w) {
        if (!w || !w.length) return this;
        if (w.length < this._minEntries) {
          for (var k = 0; k < w.length; k++) this.insert(w[k]);
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
        return this.data = S([]), this;
      }, o.prototype.remove = function(w, k) {
        if (!w) return this;
        for (var g, m, b, v = this.data, x = this.toBBox(w), M = [], T = []; v || M.length; ) {
          if (v || (v = M.pop(), m = M[M.length - 1], g = T.pop(), b = !0), v.leaf) {
            var O = r(w, v.children, k);
            if (O !== -1) return v.children.splice(O, 1), M.push(v), this._condense(M), this;
          }
          b || v.leaf || !y(v, x) ? m ? (g++, v = m.children[g], b = !1) : v = null : (M.push(v), T.push(g), g = 0, m = v, v = v.children[0]);
        }
        return this;
      }, o.prototype.toBBox = function(w) {
        return w;
      }, o.prototype.compareMinX = function(w, k) {
        return w.minX - k.minX;
      }, o.prototype.compareMinY = function(w, k) {
        return w.minY - k.minY;
      }, o.prototype.toJSON = function() {
        return this.data;
      }, o.prototype.fromJSON = function(w) {
        return this.data = w, this;
      }, o.prototype._all = function(w, k) {
        for (var g = []; w; ) w.leaf ? k.push.apply(k, w.children) : g.push.apply(g, w.children), w = g.pop();
        return k;
      }, o.prototype._build = function(w, k, g, m) {
        var b, v = g - k + 1, x = this._maxEntries;
        if (v <= x) return a(b = S(w.slice(k, g + 1)), this.toBBox), b;
        m || (m = Math.ceil(Math.log(v) / Math.log(x)), x = Math.ceil(v / Math.pow(x, m - 1))), (b = S([])).leaf = !1, b.height = m;
        var M = Math.ceil(v / x), T = M * Math.ceil(Math.sqrt(x));
        E(w, k, g, T, this.compareMinX);
        for (var O = k; O <= g; O += T) {
          var D = Math.min(O + T - 1, g);
          E(w, O, D, M, this.compareMinY);
          for (var C = O; C <= D; C += M) {
            var _ = Math.min(C + M - 1, D);
            b.children.push(this._build(w, C, _, m - 1));
          }
        }
        return a(b, this.toBBox), b;
      }, o.prototype._chooseSubtree = function(w, k, g, m) {
        for (; m.push(k), !k.leaf && m.length - 1 !== g; ) {
          for (var b = 1 / 0, v = 1 / 0, x = void 0, M = 0; M < k.children.length; M++) {
            var T = k.children[M], O = u(T), D = (C = w, _ = T, (Math.max(_.maxX, C.maxX) - Math.min(_.minX, C.minX)) * (Math.max(_.maxY, C.maxY) - Math.min(_.minY, C.minY)) - O);
            D < v ? (v = D, b = O < b ? O : b, x = T) : D === v && O < b && (b = O, x = T);
          }
          k = x || k.children[0];
        }
        var C, _;
        return k;
      }, o.prototype._insert = function(w, k, g) {
        var m = g ? w : this.toBBox(w), b = [], v = this._chooseSubtree(m, this.data, k, b);
        for (v.children.push(w), f(v, m); k >= 0 && b[k].children.length > this._maxEntries; ) this._split(b, k), k--;
        this._adjustParentBBoxes(m, b, k);
      }, o.prototype._split = function(w, k) {
        var g = w[k], m = g.children.length, b = this._minEntries;
        this._chooseSplitAxis(g, b, m);
        var v = this._chooseSplitIndex(g, b, m), x = S(g.children.splice(v, g.children.length - v));
        x.height = g.height, x.leaf = g.leaf, a(g, this.toBBox), a(x, this.toBBox), k ? w[k - 1].children.push(x) : this._splitRoot(g, x);
      }, o.prototype._splitRoot = function(w, k) {
        this.data = S([w, k]), this.data.height = w.height + 1, this.data.leaf = !1, a(this.data, this.toBBox);
      }, o.prototype._chooseSplitIndex = function(w, k, g) {
        for (var m, b, v, x, M, T, O, D = 1 / 0, C = 1 / 0, _ = k; _ <= g - k; _++) {
          var N = c(w, 0, _, this.toBBox), A = c(w, _, g, this.toBBox), F = (b = N, v = A, x = void 0, M = void 0, T = void 0, O = void 0, x = Math.max(b.minX, v.minX), M = Math.max(b.minY, v.minY), T = Math.min(b.maxX, v.maxX), O = Math.min(b.maxY, v.maxY), Math.max(0, T - x) * Math.max(0, O - M)), P = u(N) + u(A);
          F < D ? (D = F, m = _, C = P < C ? P : C) : F === D && P < C && (C = P, m = _);
        }
        return m || g - k;
      }, o.prototype._chooseSplitAxis = function(w, k, g) {
        var m = w.leaf ? this.compareMinX : l, b = w.leaf ? this.compareMinY : h;
        this._allDistMargin(w, k, g, m) < this._allDistMargin(w, k, g, b) && w.children.sort(m);
      }, o.prototype._allDistMargin = function(w, k, g, m) {
        w.children.sort(m);
        for (var b = this.toBBox, v = c(w, 0, k, b), x = c(w, g - k, g, b), M = p(v) + p(x), T = k; T < g - k; T++) {
          var O = w.children[T];
          f(v, w.leaf ? b(O) : O), M += p(v);
        }
        for (var D = g - k - 1; D >= k; D--) {
          var C = w.children[D];
          f(x, w.leaf ? b(C) : C), M += p(x);
        }
        return M;
      }, o.prototype._adjustParentBBoxes = function(w, k, g) {
        for (var m = g; m >= 0; m--) f(k[m], w);
      }, o.prototype._condense = function(w) {
        for (var k = w.length - 1, g = void 0; k >= 0; k--) w[k].children.length === 0 ? k > 0 ? (g = w[k - 1].children).splice(g.indexOf(w[k]), 1) : this.clear() : a(w[k], this.toBBox);
      }, o;
    });
  })(Te)), Te.exports;
}
const kr = /* @__PURE__ */ vr(sr);
var ae = { exports: {} }, sn, Pn;
function Sr() {
  return Pn || (Pn = 1, sn = function(t, e, n, s) {
    var o = t[0], r = t[1], a = !1;
    n === void 0 && (n = 0), s === void 0 && (s = e.length);
    for (var c = (s - n) / 2, f = 0, l = c - 1; f < c; l = f++) {
      var h = e[n + f * 2 + 0], u = e[n + f * 2 + 1], p = e[n + l * 2 + 0], y = e[n + l * 2 + 1], d = u > r != y > r && o < (p - h) * (r - u) / (y - u) + h;
      d && (a = !a);
    }
    return a;
  }), sn;
}
var rn, Dn;
function Mr() {
  return Dn || (Dn = 1, rn = function(t, e, n, s) {
    var o = t[0], r = t[1], a = !1;
    n === void 0 && (n = 0), s === void 0 && (s = e.length);
    for (var c = s - n, f = 0, l = c - 1; f < c; l = f++) {
      var h = e[f + n][0], u = e[f + n][1], p = e[l + n][0], y = e[l + n][1], d = u > r != y > r && o < (p - h) * (r - u) / (y - u) + h;
      d && (a = !a);
    }
    return a;
  }), rn;
}
var Cn;
function Er() {
  if (Cn) return ae.exports;
  Cn = 1;
  var i = Sr(), t = Mr();
  return ae.exports = function(n, s, o, r) {
    return s.length > 0 && Array.isArray(s[0]) ? t(n, s, o, r) : i(n, s, o, r);
  }, ae.exports.nested = t, ae.exports.flat = i, ae.exports;
}
var fe = { exports: {} }, _r = fe.exports, Vn;
function Ir() {
  return Vn || (Vn = 1, (function(i, t) {
    (function(e, n) {
      n(t);
    })(_r, function(e) {
      const s = 33306690738754706e-32;
      function o(d, S, E, w, k) {
        let g, m, b, v, x = S[0], M = w[0], T = 0, O = 0;
        M > x == M > -x ? (g = x, x = S[++T]) : (g = M, M = w[++O]);
        let D = 0;
        if (T < d && O < E) for (M > x == M > -x ? (b = g - ((m = x + g) - x), x = S[++T]) : (b = g - ((m = M + g) - M), M = w[++O]), g = m, b !== 0 && (k[D++] = b); T < d && O < E; ) M > x == M > -x ? (b = g - ((m = g + x) - (v = m - g)) + (x - v), x = S[++T]) : (b = g - ((m = g + M) - (v = m - g)) + (M - v), M = w[++O]), g = m, b !== 0 && (k[D++] = b);
        for (; T < d; ) b = g - ((m = g + x) - (v = m - g)) + (x - v), x = S[++T], g = m, b !== 0 && (k[D++] = b);
        for (; O < E; ) b = g - ((m = g + M) - (v = m - g)) + (M - v), M = w[++O], g = m, b !== 0 && (k[D++] = b);
        return g === 0 && D !== 0 || (k[D++] = g), D;
      }
      function r(d) {
        return new Float64Array(d);
      }
      const a = 33306690738754716e-32, c = 22204460492503146e-32, f = 11093356479670487e-47, l = r(4), h = r(8), u = r(12), p = r(16), y = r(4);
      e.orient2d = function(d, S, E, w, k, g) {
        const m = (S - g) * (E - k), b = (d - k) * (w - g), v = m - b;
        if (m === 0 || b === 0 || m > 0 != b > 0) return v;
        const x = Math.abs(m + b);
        return Math.abs(v) >= a * x ? v : -(function(M, T, O, D, C, _, N) {
          let A, F, P, V, I, B, $, X, U, Y, L, q, K, H, Q, W, tt, et;
          const lt = M - C, R = O - C, z = T - _, G = D - _;
          I = (Q = (X = lt - ($ = (B = 134217729 * lt) - (B - lt))) * (Y = G - (U = (B = 134217729 * G) - (B - G))) - ((H = lt * G) - $ * U - X * U - $ * Y)) - (L = Q - (tt = (X = z - ($ = (B = 134217729 * z) - (B - z))) * (Y = R - (U = (B = 134217729 * R) - (B - R))) - ((W = z * R) - $ * U - X * U - $ * Y))), l[0] = Q - (L + I) + (I - tt), I = (K = H - ((q = H + L) - (I = q - H)) + (L - I)) - (L = K - W), l[1] = K - (L + I) + (I - W), I = (et = q + L) - q, l[2] = q - (et - I) + (L - I), l[3] = et;
          let st = (function(Xs, bn) {
            let yn = bn[0];
            for (let Ue = 1; Ue < Xs; Ue++) yn += bn[Ue];
            return yn;
          })(4, l), at = c * N;
          if (st >= at || -st >= at || (A = M - (lt + (I = M - lt)) + (I - C), P = O - (R + (I = O - R)) + (I - C), F = T - (z + (I = T - z)) + (I - _), V = D - (G + (I = D - G)) + (I - _), A === 0 && F === 0 && P === 0 && V === 0) || (at = f * N + s * Math.abs(st), (st += lt * V + G * A - (z * P + R * F)) >= at || -st >= at)) return st;
          I = (Q = (X = A - ($ = (B = 134217729 * A) - (B - A))) * (Y = G - (U = (B = 134217729 * G) - (B - G))) - ((H = A * G) - $ * U - X * U - $ * Y)) - (L = Q - (tt = (X = F - ($ = (B = 134217729 * F) - (B - F))) * (Y = R - (U = (B = 134217729 * R) - (B - R))) - ((W = F * R) - $ * U - X * U - $ * Y))), y[0] = Q - (L + I) + (I - tt), I = (K = H - ((q = H + L) - (I = q - H)) + (L - I)) - (L = K - W), y[1] = K - (L + I) + (I - W), I = (et = q + L) - q, y[2] = q - (et - I) + (L - I), y[3] = et;
          const wt = o(4, l, 4, y, h);
          I = (Q = (X = lt - ($ = (B = 134217729 * lt) - (B - lt))) * (Y = V - (U = (B = 134217729 * V) - (B - V))) - ((H = lt * V) - $ * U - X * U - $ * Y)) - (L = Q - (tt = (X = z - ($ = (B = 134217729 * z) - (B - z))) * (Y = P - (U = (B = 134217729 * P) - (B - P))) - ((W = z * P) - $ * U - X * U - $ * Y))), y[0] = Q - (L + I) + (I - tt), I = (K = H - ((q = H + L) - (I = q - H)) + (L - I)) - (L = K - W), y[1] = K - (L + I) + (I - W), I = (et = q + L) - q, y[2] = q - (et - I) + (L - I), y[3] = et;
          const Ut = o(wt, h, 4, y, u);
          I = (Q = (X = A - ($ = (B = 134217729 * A) - (B - A))) * (Y = V - (U = (B = 134217729 * V) - (B - V))) - ((H = A * V) - $ * U - X * U - $ * Y)) - (L = Q - (tt = (X = F - ($ = (B = 134217729 * F) - (B - F))) * (Y = P - (U = (B = 134217729 * P) - (B - P))) - ((W = F * P) - $ * U - X * U - $ * Y))), y[0] = Q - (L + I) + (I - tt), I = (K = H - ((q = H + L) - (I = q - H)) + (L - I)) - (L = K - W), y[1] = K - (L + I) + (I - W), I = (et = q + L) - q, y[2] = q - (et - I) + (L - I), y[3] = et;
          const Ls = o(Ut, u, 4, y, p);
          return p[Ls - 1];
        })(d, S, E, w, k, g, x);
      }, e.orient2dfast = function(d, S, E, w, k, g) {
        return (S - g) * (E - k) - (d - k) * (w - g);
      }, Object.defineProperty(e, "__esModule", { value: !0 });
    });
  })(fe, fe.exports)), fe.exports;
}
var $n;
function Ar() {
  if ($n) return Me.exports;
  $n = 1;
  var i = xr(), t = kr, e = Er(), n = Ir().orient2d;
  t.default && (t = t.default), Me.exports = s, Me.exports.default = s;
  function s(g, m, b) {
    m = Math.max(0, m === void 0 ? 2 : m), b = b || 0;
    var v = p(g), x = new i(16);
    x.toBBox = function($) {
      return {
        minX: $[0],
        minY: $[1],
        maxX: $[0],
        maxY: $[1]
      };
    }, x.compareMinX = function($, X) {
      return $[0] - X[0];
    }, x.compareMinY = function($, X) {
      return $[1] - X[1];
    }, x.load(g);
    for (var M = [], T = 0, O; T < v.length; T++) {
      var D = v[T];
      x.remove(D), O = y(D, O), M.push(O);
    }
    var C = new i(16);
    for (T = 0; T < M.length; T++) C.insert(u(M[T]));
    for (var _ = m * m, N = b * b; M.length; ) {
      var A = M.shift(), F = A.p, P = A.next.p, V = d(F, P);
      if (!(V < N)) {
        var I = V / _;
        D = o(x, A.prev.p, F, P, A.next.next.p, I, C), D && Math.min(d(D, F), d(D, P)) <= I && (M.push(A), M.push(y(D, A)), x.remove(D), C.remove(A), C.insert(u(A)), C.insert(u(A.next)));
      }
    }
    A = O;
    var B = [];
    do
      B.push(A.p), A = A.next;
    while (A !== O);
    return B.push(A.p), B;
  }
  function o(g, m, b, v, x, M, T) {
    for (var O = new t([], r), D = g.data; D; ) {
      for (var C = 0; C < D.children.length; C++) {
        var _ = D.children[C], N = D.leaf ? S(_, b, v) : a(b, v, _);
        N > M || O.push({
          node: _,
          dist: N
        });
      }
      for (; O.length && !O.peek().node.children; ) {
        var A = O.pop(), F = A.node, P = S(F, m, b), V = S(F, v, x);
        if (A.dist < P && A.dist < V && f(b, F, T) && f(v, F, T)) return F;
      }
      D = O.pop(), D && (D = D.node);
    }
    return null;
  }
  function r(g, m) {
    return g.dist - m.dist;
  }
  function a(g, m, b) {
    if (c(g, b) || c(m, b)) return 0;
    var v = E(g[0], g[1], m[0], m[1], b.minX, b.minY, b.maxX, b.minY);
    if (v === 0) return 0;
    var x = E(g[0], g[1], m[0], m[1], b.minX, b.minY, b.minX, b.maxY);
    if (x === 0) return 0;
    var M = E(g[0], g[1], m[0], m[1], b.maxX, b.minY, b.maxX, b.maxY);
    if (M === 0) return 0;
    var T = E(g[0], g[1], m[0], m[1], b.minX, b.maxY, b.maxX, b.maxY);
    return T === 0 ? 0 : Math.min(v, x, M, T);
  }
  function c(g, m) {
    return g[0] >= m.minX && g[0] <= m.maxX && g[1] >= m.minY && g[1] <= m.maxY;
  }
  function f(g, m, b) {
    for (var v = Math.min(g[0], m[0]), x = Math.min(g[1], m[1]), M = Math.max(g[0], m[0]), T = Math.max(g[1], m[1]), O = b.search({ minX: v, minY: x, maxX: M, maxY: T }), D = 0; D < O.length; D++)
      if (h(O[D].p, O[D].next.p, g, m)) return !1;
    return !0;
  }
  function l(g, m, b) {
    return n(g[0], g[1], m[0], m[1], b[0], b[1]);
  }
  function h(g, m, b, v) {
    return g !== v && m !== b && l(g, m, b) > 0 != l(g, m, v) > 0 && l(b, v, g) > 0 != l(b, v, m) > 0;
  }
  function u(g) {
    var m = g.p, b = g.next.p;
    return g.minX = Math.min(m[0], b[0]), g.minY = Math.min(m[1], b[1]), g.maxX = Math.max(m[0], b[0]), g.maxY = Math.max(m[1], b[1]), g;
  }
  function p(g) {
    for (var m = g[0], b = g[0], v = g[0], x = g[0], M = 0; M < g.length; M++) {
      var T = g[M];
      T[0] < m[0] && (m = T), T[0] > v[0] && (v = T), T[1] < b[1] && (b = T), T[1] > x[1] && (x = T);
    }
    var O = [m, b, v, x], D = O.slice();
    for (M = 0; M < g.length; M++)
      e(g[M], O) || D.push(g[M]);
    return k(D);
  }
  function y(g, m) {
    var b = {
      p: g,
      prev: null,
      next: null,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };
    return m ? (b.next = m.next, b.prev = m, m.next.prev = b, m.next = b) : (b.prev = b, b.next = b), b;
  }
  function d(g, m) {
    var b = g[0] - m[0], v = g[1] - m[1];
    return b * b + v * v;
  }
  function S(g, m, b) {
    var v = m[0], x = m[1], M = b[0] - v, T = b[1] - x;
    if (M !== 0 || T !== 0) {
      var O = ((g[0] - v) * M + (g[1] - x) * T) / (M * M + T * T);
      O > 1 ? (v = b[0], x = b[1]) : O > 0 && (v += M * O, x += T * O);
    }
    return M = g[0] - v, T = g[1] - x, M * M + T * T;
  }
  function E(g, m, b, v, x, M, T, O) {
    var D = b - g, C = v - m, _ = T - x, N = O - M, A = g - x, F = m - M, P = D * D + C * C, V = D * _ + C * N, I = _ * _ + N * N, B = D * A + C * F, $ = _ * A + N * F, X = P * I - V * V, U, Y, L, q, K = X, H = X;
    X === 0 ? (Y = 0, K = 1, q = $, H = I) : (Y = V * $ - I * B, q = P * $ - V * B, Y < 0 ? (Y = 0, q = $, H = I) : Y > K && (Y = K, q = $ + V, H = I)), q < 0 ? (q = 0, -B < 0 ? Y = 0 : -B > P ? Y = K : (Y = -B, K = P)) : q > H && (q = H, -B + V < 0 ? Y = 0 : -B + V > P ? Y = K : (Y = -B + V, K = P)), U = Y === 0 ? 0 : Y / K, L = q === 0 ? 0 : q / H;
    var Q = (1 - U) * g + U * b, W = (1 - U) * m + U * v, tt = (1 - L) * x + L * T, et = (1 - L) * M + L * O, lt = tt - Q, R = et - W;
    return lt * lt + R * R;
  }
  function w(g, m) {
    return g[0] === m[0] ? g[1] - m[1] : g[0] - m[0];
  }
  function k(g) {
    g.sort(w);
    for (var m = [], b = 0; b < g.length; b++) {
      for (; m.length >= 2 && l(m[m.length - 2], m[m.length - 1], g[b]) <= 0; )
        m.pop();
      m.push(g[b]);
    }
    for (var v = [], x = g.length - 1; x >= 0; x--) {
      for (; v.length >= 2 && l(v[v.length - 2], v[v.length - 1], g[x]) <= 0; )
        v.pop();
      v.push(g[x]);
    }
    return v.pop(), m.pop(), m.concat(v);
  }
  return Me.exports;
}
var Nr = Ar();
const Or = /* @__PURE__ */ wr(Nr);
function Ln(i, t = {}) {
  t.concavity = t.concavity || 1 / 0;
  const e = [];
  if (dn(i, (s) => {
    e.push([s[0], s[1]]);
  }), !e.length)
    return null;
  const n = Or(e, t.concavity);
  return n.length > 3 ? me([n], t.properties) : null;
}
const Xn = Math.pow(2, -52), Ee = new Uint32Array(512);
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
  static from(t, e = Pr, n = Dr) {
    const s = t.length, o = new Float64Array(s * 2);
    for (let r = 0; r < s; r++) {
      const a = t[r];
      o[2 * r] = e(a), o[2 * r + 1] = n(a);
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
    const { coords: t, _hullPrev: e, _hullNext: n, _hullTri: s, _hullHash: o } = this, r = t.length >> 1;
    let a = 1 / 0, c = 1 / 0, f = -1 / 0, l = -1 / 0;
    for (let M = 0; M < r; M++) {
      const T = t[2 * M], O = t[2 * M + 1];
      T < a && (a = T), O < c && (c = O), T > f && (f = T), O > l && (l = O), this._ids[M] = M;
    }
    const h = (a + f) / 2, u = (c + l) / 2;
    let p = 0, y = 0, d = 0;
    for (let M = 0, T = 1 / 0; M < r; M++) {
      const O = on(h, u, t[2 * M], t[2 * M + 1]);
      O < T && (p = M, T = O);
    }
    const S = t[2 * p], E = t[2 * p + 1];
    for (let M = 0, T = 1 / 0; M < r; M++) {
      if (M === p) continue;
      const O = on(S, E, t[2 * M], t[2 * M + 1]);
      O < T && O > 0 && (y = M, T = O);
    }
    let w = t[2 * y], k = t[2 * y + 1], g = 1 / 0;
    for (let M = 0; M < r; M++) {
      if (M === p || M === y) continue;
      const T = Br(S, E, w, k, t[2 * M], t[2 * M + 1]);
      T < g && (d = M, g = T);
    }
    let m = t[2 * d], b = t[2 * d + 1];
    if (g === 1 / 0) {
      for (let O = 0; O < r; O++)
        this._dists[O] = t[2 * O] - t[0] || t[2 * O + 1] - t[1];
      se(this._ids, this._dists, 0, r - 1);
      const M = new Uint32Array(r);
      let T = 0;
      for (let O = 0, D = -1 / 0; O < r; O++) {
        const C = this._ids[O], _ = this._dists[C];
        _ > D && (M[T++] = C, D = _);
      }
      this.hull = M.subarray(0, T), this.triangles = new Uint32Array(0), this.halfedges = new Int32Array(0);
      return;
    }
    if (ft(S, E, w, k, m, b) < 0) {
      const M = y, T = w, O = k;
      y = d, w = m, k = b, d = M, m = T, b = O;
    }
    const v = Rr(S, E, w, k, m, b);
    this._cx = v.x, this._cy = v.y;
    for (let M = 0; M < r; M++)
      this._dists[M] = on(t[2 * M], t[2 * M + 1], v.x, v.y);
    se(this._ids, this._dists, 0, r - 1), this._hullStart = p;
    let x = 3;
    n[p] = e[d] = y, n[y] = e[p] = d, n[d] = e[y] = p, s[p] = 0, s[y] = 1, s[d] = 2, o.fill(-1), o[this._hashKey(S, E)] = p, o[this._hashKey(w, k)] = y, o[this._hashKey(m, b)] = d, this.trianglesLen = 0, this._addTriangle(p, y, d, -1, -1, -1);
    for (let M = 0, T = 0, O = 0; M < this._ids.length; M++) {
      const D = this._ids[M], C = t[2 * D], _ = t[2 * D + 1];
      if (M > 0 && Math.abs(C - T) <= Xn && Math.abs(_ - O) <= Xn || (T = C, O = _, D === p || D === y || D === d)) continue;
      let N = 0;
      for (let I = 0, B = this._hashKey(C, _); I < this._hashSize && (N = o[(B + I) % this._hashSize], !(N !== -1 && N !== n[N])); I++)
        ;
      N = e[N];
      let A = N, F;
      for (; F = n[A], ft(C, _, t[2 * A], t[2 * A + 1], t[2 * F], t[2 * F + 1]) >= 0; )
        if (A = F, A === N) {
          A = -1;
          break;
        }
      if (A === -1) continue;
      let P = this._addTriangle(A, D, n[A], -1, -1, s[A]);
      s[D] = this._legalize(P + 2), s[A] = P, x++;
      let V = n[A];
      for (; F = n[V], ft(C, _, t[2 * V], t[2 * V + 1], t[2 * F], t[2 * F + 1]) < 0; )
        P = this._addTriangle(V, D, F, s[D], -1, s[V]), s[D] = this._legalize(P + 2), n[V] = V, x--, V = F;
      if (A === N)
        for (; F = e[A], ft(C, _, t[2 * F], t[2 * F + 1], t[2 * A], t[2 * A + 1]) < 0; )
          P = this._addTriangle(F, D, A, -1, s[A], s[F]), this._legalize(P + 2), s[F] = P, n[A] = A, x--, A = F;
      this._hullStart = e[D] = A, n[A] = e[V] = D, n[D] = V, o[this._hashKey(C, _)] = D, o[this._hashKey(t[2 * A], t[2 * A + 1])] = A;
    }
    this.hull = new Uint32Array(x);
    for (let M = 0, T = this._hullStart; M < x; M++)
      this.hull[M] = T, T = n[T];
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
    return Math.floor(Tr(t - this._cx, e - this._cy) * this._hashSize) % this._hashSize;
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
        t = Ee[--o];
        continue;
      }
      const f = a - a % 3, l = c + (t + 1) % 3, h = f + (a + 2) % 3, u = e[r], p = e[t], y = e[l], d = e[h];
      if (Fr(
        s[2 * u],
        s[2 * u + 1],
        s[2 * p],
        s[2 * p + 1],
        s[2 * y],
        s[2 * y + 1],
        s[2 * d],
        s[2 * d + 1]
      )) {
        e[t] = d, e[a] = u;
        const E = n[h];
        if (E === -1) {
          let k = this._hullStart;
          do {
            if (this._hullTri[k] === h) {
              this._hullTri[k] = t;
              break;
            }
            k = this._hullPrev[k];
          } while (k !== this._hullStart);
        }
        this._link(t, E), this._link(a, n[r]), this._link(r, h);
        const w = f + (a + 1) % 3;
        o < Ee.length && (Ee[o++] = w);
      } else {
        if (o === 0) break;
        t = Ee[--o];
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
function Tr(i, t) {
  const e = i / (Math.abs(i) + Math.abs(t));
  return (t > 0 ? 3 - e : 1 + e) / 4;
}
function on(i, t, e, n) {
  const s = i - e, o = t - n;
  return s * s + o * o;
}
function Fr(i, t, e, n, s, o, r, a) {
  const c = i - r, f = t - a, l = e - r, h = n - a, u = s - r, p = o - a, y = c * c + f * f, d = l * l + h * h, S = u * u + p * p;
  return c * (h * S - d * p) - f * (l * S - d * u) + y * (l * p - h * u) < 0;
}
function Br(i, t, e, n, s, o) {
  const r = e - i, a = n - t, c = s - i, f = o - t, l = r * r + a * a, h = c * c + f * f, u = 0.5 / (r * f - a * c), p = (f * l - a * h) * u, y = (r * h - c * l) * u;
  return p * p + y * y;
}
function Rr(i, t, e, n, s, o) {
  const r = e - i, a = n - t, c = s - i, f = o - t, l = r * r + a * a, h = c * c + f * f, u = 0.5 / (r * f - a * c), p = i + (f * l - a * h) * u, y = t + (r * h - c * l) * u;
  return { x: p, y };
}
function se(i, t, e, n) {
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
    ce(i, s, o), t[i[e]] > t[i[n]] && ce(i, e, n), t[i[o]] > t[i[n]] && ce(i, o, n), t[i[e]] > t[i[o]] && ce(i, e, o);
    const a = i[o], c = t[a];
    for (; ; ) {
      do
        o++;
      while (t[i[o]] < c);
      do
        r--;
      while (t[i[r]] > c);
      if (r < o) break;
      ce(i, o, r);
    }
    i[e + 1] = i[r], i[r] = a, n - o + 1 >= r - e ? (se(i, t, o, n), se(i, t, e, r - 1)) : (se(i, t, e, r - 1), se(i, t, o, n));
  }
}
function ce(i, t, e) {
  const n = i[t];
  i[t] = i[e], i[e] = n;
}
function Pr(i) {
  return i[0];
}
function Dr(i) {
  return i[1];
}
class Cr {
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
class zn extends Cr {
  constructor(t) {
    super(8, new Uint8Array(Math.ceil(t / 8)).fill(0));
  }
}
function Ot(i) {
  return i % 3 === 2 ? i - 2 : i + 1;
}
function At(i) {
  return i % 3 === 0 ? i + 2 : i - 1;
}
function Be(i, t, e, n, s, o, r, a) {
  const c = ft(i, t, s, o, r, a), f = ft(e, n, s, o, r, a);
  if (c > 0 && f > 0 || c < 0 && f < 0)
    return !1;
  const l = ft(s, o, i, t, e, n), h = ft(r, a, i, t, e, n);
  return l > 0 && h > 0 || l < 0 && h < 0 ? !1 : c === 0 && f === 0 && l === 0 && h === 0 ? !(Math.max(s, r) < Math.min(i, e) || Math.max(i, e) < Math.min(s, r) || Math.max(o, a) < Math.min(t, n) || Math.max(t, n) < Math.min(o, a)) : !0;
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
class Jt extends Vr {
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
    const o = this.vertMap[t], r = this.maxConstrainSteps();
    let a = 0, c = o;
    do {
      if (++a > r)
        throw new Error(
          `Constraining edge [${t}, ${e}] exceeded the iteration limit`
        );
      const h = n[c], u = Ot(c);
      if (h === e)
        return this.protect(c);
      const p = At(c), y = n[p];
      if (y === e)
        return this.protect(u), u;
      if (this.intersectSegments(t, e, y, h)) {
        c = p;
        break;
      }
      c = s[u];
    } while (c !== -1 && c !== o);
    let f = c, l = -1;
    for (; c !== -1; ) {
      if (++a > r)
        throw new Error(
          `Constraining edge [${t}, ${e}] exceeded the iteration limit`
        );
      const h = s[c], u = At(c), p = At(h), y = Ot(h);
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
          n[y],
          n[p]
        ))
          c = y;
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
        n[y],
        n[p]
      ) && (c = y);
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
    let r, a = !(t && this.cleaned);
    do {
      r = 0;
      for (let c = 0; c < o; c++) {
        if (s.has(c) || !a && !n.has(c))
          continue;
        n.delete(c);
        const f = e[c];
        f !== -1 && (n.delete(f), this.isDelaunay(c) || (this.flipDiagonal(c), r++));
      }
      a = !1;
    } while (t && r > 0);
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
    const { triangles: n, halfedges: s } = this.del, o = n.length / 3, r = (y, d, S) => {
      const E = t(d), w = t(S);
      return t(y).some((k) => E.includes(k) && w.includes(k));
    }, a = (y) => r(n[y * 3], n[y * 3 + 1], n[y * 3 + 2]), c = (y, d, S, E) => Math.sign(ft(y[d * 2], y[d * 2 + 1], y[S * 2], y[S * 2 + 1], y[E * 2], y[E * 2 + 1])), f = e.map((y) => {
      let d = 0;
      for (let S = 0; S < o; S++) d += c(y, n[S * 3], n[S * 3 + 1], n[S * 3 + 2]);
      return d < 0 ? -1 : 1;
    }), l = (y) => {
      if (this.consd.has(y)) return !1;
      const d = s[y];
      if (d === -1) return !1;
      const S = n[y], E = n[Ot(y)], w = n[At(y)], k = n[At(d)];
      return e.every((g, m) => c(g, w, S, k) === f[m] && c(g, k, E, w) === f[m]);
    };
    let h = 0, u = !0;
    for (; u; ) {
      u = !1;
      for (let y = 0; y < o; y++)
        if (a(y))
          for (let d = 0; d < 3; d++) {
            const S = y * 3 + d;
            if (!l(S)) continue;
            const E = s[S], w = n[S], k = n[Ot(S)], g = n[At(S)], m = n[At(E)];
            if (!(r(g, w, m) && r(m, k, g))) {
              this.protect(this.flipDiagonal(S)), h++, u = !0;
              break;
            }
          }
    }
    let p = 0;
    for (let y = 0; y < o; y++) a(y) && p++;
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
    let r = n, a, c = 0;
    do {
      if (++c > s.length)
        throw new Error(
          `Looking up edge [${t}, ${e}] exceeded the iteration limit`
        );
      if (s[r] === t)
        return r;
      a = Ot(r), r = o[a];
    } while (r !== -1 && r !== n);
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
    const { triangles: e, halfedges: n } = this.del, s = this.flips, o = this.consd, r = n[t], a = At(t), c = Ot(t), f = At(r), l = Ot(r), h = n[a], u = n[f];
    if (o.has(t))
      throw new Error("Trying to flip a constrained edge");
    return e[t] = e[f], n[t] = u, s.set(t, s.has(f)) || o.set(t, o.has(f)), u !== -1 && (n[u] = t), n[a] = f, e[r] = e[a], n[r] = h, s.set(r, s.has(a)) || o.set(r, o.has(a)), h !== -1 && (n[h] = r), n[f] = a, this.markFlip(t), this.markFlip(c), this.markFlip(r), this.markFlip(l), s.add(a), o.delete(a), s.add(f), o.delete(f), this.updateVert(t), this.updateVert(c), this.updateVert(r), this.updateVert(l), a;
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
    return $e(
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
    const o = e[At(t)], r = e[t], a = e[Ot(t)], c = e[At(s)];
    return !this.inCircle(o, r, a, c);
  }
  /**
   * Update the vertex -> incoming edge map.
   */
  updateVert(t) {
    const { triangles: e, halfedges: n } = this.del, s = this.vertMap, o = e[t];
    let r = At(t), a = n[r];
    for (; a !== -1 && a !== t; )
      r = At(a), a = n[r];
    return s[o] = r, r;
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
function _e(i, t, e) {
  return fn(i, t, e).tin;
}
function fn(i, t, e, n, s) {
  if (t || (t = []), typeof i != "object" || i.type !== "FeatureCollection")
    throw "Argument points must be FeatureCollection";
  if (!Array.isArray(t)) throw "Argument points must be Array of Array";
  const o = i.features.map(
    (d) => d.geometry.coordinates
  );
  let r = s?.snapshot ? Jt.restore(s.snapshot) : void 0;
  const a = r ? void 0 : Le.from(o);
  let c = r ? r.del : a, f = 0, l;
  const h = [];
  if (c.triangles.length !== 0 && (t.length !== 0 || n)) {
    if (!r) {
      r = new Jt(c);
      try {
        r.constrainAll(t);
      } catch (E) {
        if (!n?.allowUnusableBoundary) throw E;
        return { tin: bt([]), remaining: 0, hasBoundary: !1, hull: [] };
      }
      s && (s.snapshot = r.snapshot());
    }
    const d = n ? s?.snapshot ?? r.snapshot() : void 0, S = (E) => {
      const w = Jt.restore(d);
      return w.constrainAll(E), w;
    };
    for (const E of n?.hull ?? [])
      try {
        r.constrainOne(E[0], E[1]), h.push(E);
      } catch {
        r = S(h);
      }
    n?.boundary && (l = $r(r, n.boundary), l || (r = S(h))), n && ({ remaining: f } = r.forbidGroupTriangles(
      n.groupsOf,
      n.planes
    ), f -= l?.size ?? 0), c = r.del;
  }
  const u = [];
  for (let d = 0; d < c.triangles.length; d += 3)
    l?.has(d / 3) || u.push([c.triangles[d], c.triangles[d + 1], c.triangles[d + 2]]);
  const p = ["a", "b", "c"];
  return { tin: bt(
    u.map((d) => {
      const S = {}, E = d.map((w, k) => {
        const g = i.features[w], m = g.geometry.coordinates, b = [m[0], m[1]];
        return m.length === 3 ? b[2] = m[2] : S[p[k]] = g.properties[e], b;
      });
      return E[3] = E[0], me([E], S);
    })
  ), remaining: f, hasBoundary: l !== void 0, hull: h };
}
function $r(i, t) {
  try {
    i.constrainAll(t);
  } catch {
    return;
  }
  const e = new Map(t), { triangles: n, halfedges: s } = i.del, o = (f) => {
    const l = n[f], h = n[Ot(f)];
    return e.get(l) === h || e.get(h) === l;
  }, r = /* @__PURE__ */ new Set(), a = [], c = (f) => {
    const l = Math.floor(f / 3);
    r.has(l) || (r.add(l), a.push(l));
  };
  for (let f = 0; f < s.length; f++)
    s[f] === -1 && !o(f) && c(f);
  for (let f = 0; f < a.length; f++)
    for (let l = a[f] * 3; l < a[f] * 3 + 3; l++) {
      if (!e.has(n[l])) return;
      s[l] !== -1 && !o(l) && c(s[l]);
    }
  return r;
}
function te(i) {
  const t = /* @__PURE__ */ new Set(), e = [];
  if (i.forEach(([c, f], l) => {
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
  }, r = [...o(s), ...o([...s].reverse())];
  if (r.length < 3) return [];
  const a = [];
  for (let c = 0; c < r.length; c++) {
    const f = r[c], l = r[(c + 1) % r.length], h = l.x - f.x, u = l.y - f.y, p = h * h + u * u, y = e.filter((S) => S !== f && S !== l && n(f, l, S) === 0).map((S) => ({ r: S, t: ((S.x - f.x) * h + (S.y - f.y) * u) / p })).filter(({ t: S }) => S > 0 && S < 1).sort((S, E) => S.t - E.t).map(({ r: S }) => S), d = [f, ...y, l];
    for (let S = 0; S + 1 < d.length; S++) a.push([d[S].i, d[S + 1].i]);
  }
  return a;
}
function le([i, t]) {
  return i < t ? `${i}-${t}` : `${t}-${i}`;
}
function Yt(i, t, e) {
  return Zt(i, { target: { geom: t, index: e } });
}
function Wt(i) {
  return Zt(i.properties.target.geom, {
    target: {
      geom: i.geometry.coordinates,
      index: i.properties.target.index
    }
  });
}
function Yn(i, t) {
  const e = i.length, n = t.geometry.coordinates;
  return Array.from({ length: e }, (s, o) => o).map((s) => {
    const o = (s + 1) % e, r = i[s], a = i[o], c = r.geometry.coordinates, f = Math.atan2(
      c[0] - n[0],
      c[1] - n[1]
    ), l = [t, r, a, t].map(
      (p) => p.geometry.coordinates
    ), h = {
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
    }, u = bt([
      me([l], h)
    ]);
    return [f, u];
  }).reduce(
    (s, o) => (s[0].push(o[0]), s[1].push(o[1]), s),
    [[], []]
  );
}
const pn = [0.1, 0.15, 0.225, 0.34, 0.5];
function Lr(i, t) {
  return t ? i.hasBoundary !== t.hasBoundary ? i.hasBoundary : i.diagnostics.boundaryTriangleFlips < t.diagnostics.boundaryTriangleFlips : !0;
}
function qn(i, t, e) {
  return Math.sign(ft(i[0], i[1], t[0], t[1], e[0], e[1]));
}
function Re(i, t = -1) {
  let e = 0;
  for (const n of i.features) {
    const { a: s, b: o, c: r } = n.properties;
    if (![s, o, r].some(
      ({ index: h }) => typeof h == "string" && h.startsWith("b")
    ))
      continue;
    const [a, c, f] = n.geometry.coordinates[0];
    qn(a, c, f) * qn(s.geom, o.geom, r.geom) * t <= 0 && e++;
  }
  return e;
}
function oe(i, t, e) {
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
function Un(i, t, e, n, s, o = /* @__PURE__ */ new Set(), r) {
  const { minx: a, maxx: c, miny: f, maxy: l, centroid: h } = i, u = c - a, p = l - f, y = e.forw.length, d = Array.from({ length: y }, () => []);
  let S = 1;
  for (const [v, x] of e.edges)
    v < n && d[v].push(S), d[x].push(S), x < n && S++;
  const E = (v) => v.slice(0, y).map(({ geometry: x }) => x.coordinates), w = te(E(e.forw)), k = {
    forw: w.filter((v) => !o.has(le(v))),
    bakw: te(E(e.bakw))
  }, g = [0], m = (v) => v >= y ? g : d[v];
  let b;
  for (const v of pn) {
    const x = r?.get(v) ?? { forwReuse: {} };
    r?.set(v, x);
    const M = x.vertices ?? (x.vertices = t(
      {
        ...i,
        minx: a - v * u,
        maxx: c + v * u,
        miny: f - v * p,
        maxy: l + v * p
      },
      !0
    ));
    if (s && (M.length < 4 || !M.every(({ bakw: Y }) => Y.every(Number.isFinite)))) continue;
    const T = M.map(
      ({ forw: Y, bakw: L }, q) => Yt(Y, L, `b${q}`)
    ), O = bt([...e.forw, ...T]), D = bt([
      ...e.bakw,
      ...T.map(Wt)
    ]), C = [O, D].map(
      ({ features: Y }) => Float64Array.from(
        Y.flatMap(
          ({
            geometry: {
              coordinates: [L, q]
            }
          }) => [L, q]
        )
      )
    ), N = s !== void 0 || oe(
      M.map((Y) => Y.forw),
      h.forw,
      -1
    ) && oe(
      M.map((Y) => Y.bakw),
      h.bakw,
      1
    ) ? M.map((Y, L) => [
      y + L,
      y + (L + 1) % M.length
    ]) : void 0, A = { groupsOf: m, planes: C, boundary: N, allowUnusableBoundary: s !== void 0 }, F = s?.orientation ?? -1, P = fn(
      O,
      e.edges,
      "target",
      { ...A, hull: k.forw },
      x.forwReuse
    ), V = x.geographic ?? (x.geographic = (() => {
      const Y = fn(D, e.edges, "target", {
        ...A,
        hull: k.bakw
      });
      return { built: Y, flips: Re(Y.tin, F) };
    })()), I = V.built, B = P.tin, $ = {
      ...I.tin,
      features: [...I.tin.features]
    }, X = Re(B, F) + V.flips, U = {
      vertices: M,
      forw: B,
      bakw: $,
      diagnostics: {
        margin: v,
        boundaryTriangleFlips: X,
        remainingForbiddenTriangles: P.remaining + I.remaining
      },
      hasMapBoundary: P.hasBoundary,
      hasBoundary: P.hasBoundary && I.hasBoundary,
      forwHull: { all: w, applied: P.hull }
    };
    if (s) {
      if (s.accept(U)) return U;
      continue;
    }
    if (X === 0 && U.hasBoundary)
      return U;
    Lr(U, b) && (b = U);
  }
  return b;
}
const jn = 1e-9;
function Xr(i, t) {
  const e = [[], [], [], []], n = [];
  return Object.keys(i).forEach((s) => {
    const o = i[s], r = o.forw, a = o.bakw, c = [
      r[0] - t.forw[0],
      r[1] - t.forw[1]
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
function _s(i) {
  let t = 1 / 0, e = 0, n = 0;
  return i.forEach((s) => {
    const { forw: o, bakw: r } = s, a = Math.hypot(o[0], o[1]), c = Math.hypot(r[0], r[1]);
    if (c === 0) return;
    const f = a / c, l = Math.atan2(o[0], o[1]) - Math.atan2(r[0], r[1]);
    t = Math.min(t, f), e += Math.cos(l), n += Math.sin(l);
  }), isFinite(t) ? [t, Math.atan2(n, e)] : [1, 0];
}
const zr = 0.6, Yr = 3, qr = 0.5;
function Ur(i) {
  let t = 0, e = 0, n = 0, s = 0;
  if (i.forEach(({ forw: r, bakw: a }) => {
    t += r[1] * a[1] + r[0] * a[0], e += r[0] * a[1] - r[1] * a[0], n += a[0] * a[0] + a[1] * a[1], s += r[0] * r[0] + r[1] * r[1];
  }), !(!(n > 0 && s > 0) || !(Math.hypot(t, e) / Math.sqrt(s * n) >= qr)))
    return [Math.hypot(t, e) / n, Math.atan2(e, t)];
}
function jr(i) {
  const t = (s) => Math.hypot(s.forw[0], s.forw[1]), e = Math.max(...i.map(t)), n = i.filter((s) => t(s) >= zr * e);
  return Ur(n.length >= Yr ? n : i) ?? _s(i);
}
function Gr(i, t, e, n) {
  const { perQuad: s, aggregate: o } = Xr(i, t), r = s.every((l) => l.length > 0), a = e === "birdeye" ? r ? s : [o] : [o], c = n === "farLsq" ? jr : _s, f = a.map((l) => c(l));
  return f.length === 1 ? [f[0], f[0], f[0], f[0]] : f;
}
function Kr(i, t) {
  let e = 0;
  return i[0] > t[0] && (e += 1), i[1] > t[1] && (e += 2), e;
}
function Wr(i, t, e) {
  const n = [
    i[0] - t.forw[0],
    i[1] - t.forw[1]
  ], o = Math.sqrt(n[0] ** 2 + n[1] ** 2) / e[0], r = Math.atan2(n[0], n[1]) - e[1];
  return [
    t.bakw[0] + o * Math.sin(r),
    t.bakw[1] - o * Math.cos(r)
  ];
}
function Hr(i, t, e, n) {
  const s = t[0] - i[0], o = t[1] - i[1];
  if (Math.abs(s) < 1e-12 && Math.abs(o) < 1e-12) return null;
  const r = n[0] - e[0], a = n[1] - e[1], c = e[0] - i[0], f = e[1] - i[1], l = s * a - o * r;
  if (Math.abs(l) < 1e-12) return null;
  const h = (c * a - f * r) / l, u = (c * o - f * s) / l;
  return h <= 1e-10 || u < -1e-10 || u > 1 + 1e-10 ? null : { t: h, point: [i[0] + h * s, i[1] + h * o] };
}
function Jr(i, t, e) {
  const n = e.length;
  let s = -1 / 0, o = null;
  for (let r = 0; r < n; r++) {
    const a = (r + 1) % n, c = Hr(
      i,
      t,
      e[r].bakw,
      e[a].bakw
    );
    c && c.t > s && (s = c.t, o = c.point);
  }
  return o;
}
function ln(i, t) {
  return Math.floor(hn(i, t) / 10) % 36;
}
function hn(i, t) {
  const n = Math.atan2(i[0] - t[0], i[1] - t[1]) * (180 / Math.PI);
  return n < 0 ? n + 360 : n;
}
function Gn(i, t, e, n, s, o) {
  const r = t[0] - i[0], a = t[1] - i[1];
  if (r === 0 && a === 0) return null;
  const c = [];
  if (r !== 0)
    for (const l of [e, n]) {
      const h = (l - i[0]) / r;
      if (h > 0) {
        const u = i[1] + h * a;
        u >= s && u <= o && c.push({ t: h, x: l, y: u });
      }
    }
  if (a !== 0)
    for (const l of [s, o]) {
      const h = (l - i[1]) / a;
      if (h > 0) {
        const u = i[0] + h * r;
        u >= e && u <= n && c.push({ t: h, x: u, y: l });
      }
    }
  if (c.length === 0) return null;
  c.sort((l, h) => l.t - h.t);
  const f = c[0];
  return [f.x, f.y];
}
function Qr(i, t, e, n) {
  const s = i[0], o = i[1], r = t[0], a = t[1], c = e[0], f = e[1], l = n[0], h = n[1];
  if (!(Number.isFinite(s) && Number.isFinite(o) && Number.isFinite(r) && Number.isFinite(a) && Number.isFinite(c) && Number.isFinite(f) && Number.isFinite(l) && Number.isFinite(h)) || s === c || s === l || r === c || r === l || s === r && o === a || c === l && f === h) {
    const B = mr(Sn([i, t]), Sn([e, n]));
    return B.features.length > 0 && B.features[0].geometry ? B.features[0].geometry.coordinates : null;
  }
  const u = s > r || s === r && o > a, p = u ? r : s, y = u ? a : o, d = u ? s : r, S = u ? o : a, E = c > l || c === l && f > h, w = E ? l : c, k = E ? h : f, g = E ? c : l, m = E ? f : h;
  let b, v, x, M, T, O, D, C;
  if (p < w) {
    if (d < w) return null;
    b = w, v = k, x = g, M = m, T = p, O = y, D = d, C = S;
  } else {
    if (g < p) return null;
    b = p, v = y, x = d, M = S, T = w, O = k, D = g, C = m;
  }
  const _ = ft(b, v, x, M, T, O), N = ft(b, v, x, M, D, C);
  if (_ > 0 && N > 0 || _ < 0 && N < 0) return null;
  const A = (C - O) * (x - b) - (D - T) * (M - v), F = (D - T) * (v - O) - (C - O) * (b - T), P = (x - b) * (v - O) - (M - v) * (b - T);
  if (A === 0) return null;
  const V = F / A, I = P / A;
  return V >= 0 && V <= 1 && I >= 0 && I <= 1 ? [b + V * (x - b), v + V * (M - v)] : null;
}
function Kn(i, t, e) {
  const n = i.length, s = new Array(n).fill(1);
  for (const o of t)
    for (let r = 0; r < n; r++) {
      const a = (r + 1) % n, c = Qr(
        i[r].bakw,
        i[a].bakw,
        e.bakw,
        o.bakw
      );
      if (c) {
        const f = Math.sqrt(
          Math.pow(o.bakw[0] - e.bakw[0], 2) + Math.pow(o.bakw[1] - e.bakw[1], 2)
        ), l = Math.sqrt(
          Math.pow(c[0] - e.bakw[0], 2) + Math.pow(c[1] - e.bakw[1], 2)
        ), h = f / l;
        h > s[r] && (s[r] = h), h > s[a] && (s[a] = h);
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
function mn(i, t, e, n, s) {
  const { convexBuf: o, centroid: r, allGcps: a, minx: c, maxx: f, miny: l, maxy: h } = i, u = s ? void 0 : Gr(o, r, t, n), y = [
    [c, l],
    [f, l],
    [f, h],
    [c, h]
  ].map((x) => ({
    forw: x,
    bakw: s ? s(x) : Wr(
      x,
      r,
      u[Kr(x, r.forw)]
    )
  }));
  if (y.sort(
    (x, M) => Math.atan2(x.forw[0] - r.forw[0], x.forw[1] - r.forw[1]) - Math.atan2(M.forw[0] - r.forw[0], M.forw[1] - r.forw[1])
  ), s || Kn(y, a, r), !e || i.ring?.cornersOnly) return y;
  const d = 4, S = y.map(
    (x) => Math.atan2(x.forw[0] - r.forw[0], x.forw[1] - r.forw[1])
  ), E = y.map(
    (x) => Math.atan2(
      x.bakw[0] - r.bakw[0],
      -(x.bakw[1] - r.bakw[1])
    )
  );
  function w(x) {
    for (let M = 0; M < d; M++) {
      const T = (M + 1) % d, O = S[M], D = M < d - 1 ? S[T] : S[T] + 2 * Math.PI;
      let C = x;
      for (; C < O; ) C += 2 * Math.PI;
      for (; C >= O + 2 * Math.PI; ) C -= 2 * Math.PI;
      if (C >= O && C < D)
        return { i: M, j: T, frac: (C - O) / (D - O) };
    }
    return { i: 0, j: 1, frac: 0 };
  }
  function k(x) {
    const { i: M, j: T, frac: O } = w(x), D = E[M];
    let _ = E[T] - D;
    for (; _ > Math.PI; ) _ -= 2 * Math.PI;
    for (; _ < -Math.PI; ) _ += 2 * Math.PI;
    return D + O * _;
  }
  const g = new Set(
    y.map(
      (x) => Math.floor(hn(x.forw, r.forw) / 10) % 36
    )
  ), m = a.map((x) => ({
    forw: x.forw,
    bakw: x.bakw,
    angleDeg: hn(x.forw, r.forw),
    forwDist: Math.hypot(x.forw[0] - r.forw[0], x.forw[1] - r.forw[1])
  })), b = [];
  for (let x = 0; x < 36; x++) {
    if (g.has(x) || i.ring?.skipBins?.has(x)) continue;
    const M = x * 10, T = m.filter((I) => {
      if (I.forwDist === 0) return !1;
      const B = ((I.angleDeg - M) % 360 + 360) % 360;
      return B < 10 + jn || B > 360 - jn;
    });
    let O = null;
    if (T.length > 0) {
      const I = T.reduce((B, $) => $.forwDist > B.forwDist ? $ : B);
      O = Gn(r.forw, I.forw, c, f, l, h);
    }
    if (!O) {
      const I = (M + 5) % 360 * (Math.PI / 180), B = [
        r.forw[0] + Math.sin(I),
        r.forw[1] + Math.cos(I)
      ];
      O = Gn(r.forw, B, c, f, l, h);
    }
    if (!O) continue;
    const [D, C] = O, _ = 1e-9 * Math.max(f - c, h - l);
    if ([...y, ...b].some(
      (I) => Math.abs(I.forw[0] - D) <= _ && Math.abs(I.forw[1] - C) <= _
    )) continue;
    if (s) {
      b.push({ forw: O, bakw: s(O) });
      continue;
    }
    const N = [O[0] - r.forw[0], O[1] - r.forw[1]], A = Math.atan2(N[0], N[1]), F = k(A), P = [
      r.bakw[0] + Math.sin(F),
      r.bakw[1] - Math.cos(F)
    ], V = Jr(r.bakw, P, y);
    V && b.push({ forw: O, bakw: V });
  }
  const v = [...y, ...b];
  return v.sort(
    (x, M) => Math.atan2(x.forw[0] - r.forw[0], x.forw[1] - r.forw[1]) - Math.atan2(M.forw[0] - r.forw[0], M.forw[1] - r.forw[1])
  ), s || Kn(v, a, r), v;
}
function Is(i, t = !1) {
  return mn(i, "plain", t, t ? "farLsq" : "min");
}
function As(i, t = !1) {
  return mn(i, "birdeye", t, "min");
}
function Zr(i, t) {
  const e = /* @__PURE__ */ new Set();
  return mn(i, "plain", !0, "min", t).filter(({ forw: [n, s] }) => {
    const o = `${n}:${s}`;
    return e.has(o) ? !1 : (e.add(o), !0);
  });
}
const Wn = (i) => typeof i == "string" && i.startsWith("b");
function ti(i, t) {
  const e = (n, s) => {
    for (let o = 0; o < 3; o++) {
      const r = n.g[o], a = n.g[(o + 1) % 3];
      if (s.g.every((c) => n.sign * ft(r[0], r[1], a[0], a[1], c[0], c[1]) <= 0)) return !0;
    }
    return !1;
  };
  return !e(i, t) && !e(t, i);
}
function ei(i) {
  const t = i.features.map((a) => {
    const { a: c, b: f, c: l } = a.properties, h = [c.geom, f.geom, l.geom], u = a.geometry.coordinates[0].slice(0, 3), p = h.map(([E]) => E), y = h.map(([, E]) => E), d = Math.sign(ft(u[0][0], u[0][1], u[1][0], u[1][1], u[2][0], u[2][1])), S = Math.sign(ft(h[0][0], h[0][1], h[1][0], h[1][1], h[2][0], h[2][1]));
    return {
      ids: [c.index, f.index, l.index],
      f: u,
      g: h,
      sign: S,
      ratio: d * S,
      aux: [c.index, f.index, l.index].some(Wn),
      minx: Math.min(...p),
      maxx: Math.max(...p),
      miny: Math.min(...y),
      maxy: Math.max(...y)
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
        l.sign === 0 || l.miny >= c.maxy || c.miny >= l.maxy || !c.aux && !l.aux || ti(c, l) && (s.add(o[a]), s.add(o[f]));
      }
  }
  const r = /* @__PURE__ */ new Map();
  for (const a of s)
    t[a].ids.forEach((c, f) => {
      Wn(c) && r.set(String(c), t[a].f[f]);
    });
  return [...r.values()];
}
function ko(i) {
  return Fe(i, 1 / 0);
}
const Hn = 1e5, ni = 16;
function Fe(i, t) {
  return si(i), new ri(i).findSegmentIntersections(t).map(
    (s) => Zt([s.x, s.y])
  );
}
function si(i) {
  for (let t = 0, e = i.length; t < e; t++) {
    const n = i[t];
    ge(n) || Qt(
      "findIntersections() received invalid coordinates:",
      `line=${t}`,
      `points=${n}`
    );
    for (let s = 0, o = n.length; s < o; s++) {
      const r = n[s];
      (!ge(r) || !Number.isFinite(r[0]) || !Number.isFinite(r[1])) && Qt(
        "findIntersections() received non-finite coordinates:",
        `line=${t}`,
        `point=${s}`,
        `coordinates=${JSON.stringify(r)}`
      );
    }
  }
}
class ri {
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
    (o != this._xx.length || this._xx.length != this._yy.length) && Qt("ArcCollection#initXYData() Counting error"), this.initBounds(), this._arcIter = new Mi(this._xx, this._yy);
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
    const s = n.length, o = new Float64Array(s * 4), r = new pe();
    let a = 0, c, f, l;
    for (let h = 0; h < s; h++)
      c = n[h], c > 0 && (f = h * 4, l = Ei(t, e, a, c), o[f++] = l[0], o[f++] = l[1], o[f++] = l[2], o[f] = l[3], a += c, r.mergeBounds(l));
    return {
      bb: o,
      bounds: r
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
    const n = t >= 0, s = n ? t : ~t, o = this.getRetainedInterval(), r = this._nn[s], a = n ? 1 : -1;
    let c = n ? this._ii[s] : this._ii[s] + r - 1, f = c, l = 0;
    for (let h = 1; h < r; h++)
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
    const e = this.getBounds(), n = e.ymin || 0, s = (e.ymax || 0) - n, o = this.calcSegmentIntersectionStripeCount(), r = new Uint32Array(o), a = o > 1 ? (k) => Math.floor((o - 1) * (k - n) / s) : () => 0, c = o + 1;
    let f;
    this.forEachSegment(
      (k, g, m, b) => {
        let v = a(b[k]);
        const x = a(b[g]);
        let M = 0;
        for (; r[v] = r[v] + 2, v != x; )
          M++, M > c && Qt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${o}`,
            `s1=${v}`,
            `s2=${x}`
          ), v += x > v ? 1 : -1;
      }
    );
    const l = this.getUint32Array(ai(r));
    let h = 0;
    const u = [];
    ci(r, (k) => {
      const g = h;
      h += k, u.push(l.subarray(g, h));
    }), fi(r, 0), this.forEachSegment(
      (k, g, m, b) => {
        let v = a(b[k]);
        const x = a(b[g]);
        let M, T, O = 0;
        for (; M = r[v], r[v] = M + 2, T = u[v], T[M] = k, T[M + 1] = g, v != x; )
          O++, O > c && Qt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${o}`,
            `s1=${v}`,
            `s2=${x}`
          ), v += x > v ? 1 : -1;
      }
    );
    const p = this.getVertexData(), y = t * ni;
    let d = 0;
    const S = /* @__PURE__ */ new Set(), E = /* @__PURE__ */ new Map(), w = (k) => {
      d++;
      const g = Si(k);
      return S.has(g) || (S.add(g), E.set(`${k.x}:${k.y}`, k)), E.size >= t || d >= y;
    };
    if (p.xx && p.yy)
      for (f = 0; f < o && !li(u[f], p.xx, p.yy, w); f++)
        ;
    return Array.from(E.values());
  }
}
function Qt(...i) {
  const t = i.join(" ");
  throw new Error(t);
}
function ge(i) {
  return i ? oi(i) ? !0 : ii(i) ? !1 : i.length === 0 ? !0 : i.length > 0 : !1;
}
function ii(i) {
  return i != null && i.toString === String.prototype.toString;
}
function oi(i) {
  return Array.isArray(i);
}
function ai(i, t) {
  ge(i) || Qt("utils.sum() expects an array, received:", i);
  let e = 0, n;
  for (let s = 0, o = i.length; s < o; s++)
    n = i[s], n && (e += n);
  return e;
}
function ci(i, t, e) {
  if (!ge(i))
    throw new Error(`#forEach() takes an array-like argument. ${i}`);
  for (let n = 0, s = i.length; n < s; n++)
    t.call(e, i[n], n);
}
function fi(i, t) {
  for (let e = 0, n = i.length; e < n; e++)
    i[e] = t;
  return i;
}
function li(i, t, e, n) {
  const s = i.length - 2;
  let o, r, a, c, f, l, h, u, p, y, d, S, E, w, k, g, m;
  for (yi(t, i), g = 0; g < s; ) {
    for (o = i[g], r = i[g + 1], f = t[o], l = t[r], p = e[o], y = e[r], m = g; m < s && (m += 2, a = i[m], h = t[a], !(l < h)); ) {
      if (d = e[a], c = i[m + 1], u = t[c], S = e[c], p >= d) {
        if (p > S && y > d && y > S) continue;
      } else if (p < S && y < d && y < S) continue;
      if (!(o == a || o == c || r == a || r == c) && (E = hi(
        f,
        p,
        l,
        y,
        h,
        d,
        u,
        S
      ), E && (w = [o, r], k = [a, c], n(Qn(E, w, k, t, e)) || E.length == 4 && n(Qn(E.slice(2), w, k, t, e)))))
        return !0;
    }
    g += 2;
  }
  return !1;
}
function hi(i, t, e, n, s, o, r, a) {
  const c = ui(i, t, e, n, s, o, r, a);
  let f = null;
  return c && (f = di(i, t, e, n, s, o, r, a), f ? bi(i, t, e, n, s, o, r, a) && (f = null) : f = vi(i, t, e, n, s, o, r, a)), f;
}
function ui(i, t, e, n, s, o, r, a) {
  return he(i, t, e, n, s, o) * he(i, t, e, n, r, a) <= 0 && he(s, o, r, a, i, t) * he(s, o, r, a, e, n) <= 0;
}
function he(i, t, e, n, s, o) {
  return Ns(i - s, t - o, e - s, n - o);
}
function Ns(i, t, e, n) {
  return i * n - t * e;
}
function di(i, t, e, n, s, o, r, a) {
  let c = Ie(i, t, e, n, s, o, r, a), f;
  return c && (f = pi(c[0], c[1], i, t, e, n, s, o, r, a), f == 1 ? c = Ie(e, n, i, t, s, o, r, a) : f == 2 ? c = Ie(s, o, r, a, i, t, e, n) : f == 3 && (c = Ie(r, a, s, o, i, t, e, n))), c && wi(c, i, t, e, n, s, o, r, a), c;
}
function Ie(i, t, e, n, s, o, r, a) {
  const c = Ns(e - i, n - t, r - s, a - o), f = 1e-18;
  let l;
  if (c === 0) return null;
  const h = he(s, o, r, a, i, t) / c;
  return c <= f && c >= -f ? l = gi(i, t, e, n, s, o, r, a) : l = [i + h * (e - i), t + h * (n - t)], l;
}
function gi(i, t, e, n, s, o, r, a) {
  let c = null;
  return !Pt(i, s, r) && !Pt(t, o, a) ? c = [i, t] : !Pt(e, s, r) && !Pt(n, o, a) ? c = [e, n] : !Pt(s, i, e) && !Pt(o, t, n) ? c = [s, o] : !Pt(r, i, e) && !Pt(a, t, n) && (c = [r, a]), c;
}
function Pt(i, t, e) {
  let n;
  return t < e ? n = i < t || i > e : t > e ? n = i > t || i < e : n = i != t, n;
}
function pi(i, t, ...e) {
  let n = -1, s = 1 / 0, o;
  for (let r = 0, a = 0, c = e.length; a < c; r++, a += 2)
    o = mi(i, t, e[a], e[a + 1]), o < s && (s = o, n = r);
  return n;
}
function mi(i, t, e, n) {
  const s = i - e, o = t - n;
  return s * s + o * o;
}
function wi(i, t, e, n, s, o, r, a, c) {
  let f = i[0], l = i[1];
  f = Ae(f, t, n), f = Ae(f, o, a), l = Ae(l, e, s), l = Ae(l, r, c), i[0] = f, i[1] = l;
}
function Ae(i, t, e) {
  let n;
  return Pt(i, t, e) && (n = Math.abs(i - t) < Math.abs(i - e) ? t : e, i = n), i;
}
function vi(i, t, e, n, s, o, r, a) {
  const c = Math.min(i, e, s, r), f = Math.max(i, e, s, r), l = Math.min(t, n, o, a), h = Math.max(t, n, o, a), u = h - l > f - c;
  let p = [];
  return (u ? zt(t, l, h) : zt(i, c, f)) && p.push(i, t), (u ? zt(n, l, h) : zt(e, c, f)) && p.push(e, n), (u ? zt(o, l, h) : zt(s, c, f)) && p.push(s, o), (u ? zt(a, l, h) : zt(r, c, f)) && p.push(r, a), (p.length != 2 && p.length != 4 || p.length == 4 && p[0] == p[2] && p[1] == p[3]) && (p = null), p;
}
function bi(i, t, e, n, s, o, r, a) {
  return i == s && t == o || i == r && t == a || e == s && n == o || e == r && n == a;
}
function zt(i, t, e) {
  return i > t && i < e;
}
function yi(i, t) {
  xi(i, t), Os(i, t, 0, t.length - 2);
}
function xi(i, t) {
  for (let e = 0, n = t.length; e < n; e += 2)
    i[t[e]] > i[t[e + 1]] && ki(t, e, e + 1);
}
function ki(i, t, e) {
  const n = i[t];
  i[t] = i[e], i[e] = n;
}
function Os(i, t, e, n) {
  let s = e, o = n, r, a;
  for (; s < n; ) {
    for (r = i[t[e + n >> 2 << 1]]; s <= o; ) {
      for (; i[t[s]] < r; ) s += 2;
      for (; i[t[o]] > r; ) o -= 2;
      s <= o && (a = t[s], t[s] = t[o], t[o] = a, a = t[s + 1], t[s + 1] = t[o + 1], t[o + 1] = a, s += 2, o -= 2);
    }
    if (o - e < 40 ? Jn(i, t, e, o) : Os(i, t, e, o), n - s < 40) {
      Jn(i, t, s, n);
      return;
    }
    e = s, o = n;
  }
}
function Jn(i, t, e, n) {
  let s, o;
  for (let r = e + 2; r <= n; r += 2) {
    s = t[r], o = t[r + 1];
    let a;
    for (a = r - 2; a >= e && i[s] < i[t[a]]; a -= 2)
      t[a + 2] = t[a], t[a + 3] = t[a + 1];
    t[a + 2] = s, t[a + 3] = o;
  }
}
function Qn(i, t, e, n, s) {
  const o = i[0], r = i[1];
  t = Zn(o, r, t[0], t[1], n, s), e = Zn(o, r, e[0], e[1], n, s);
  const a = t[0] < e[0] ? t : e, c = a == t ? e : t;
  return { x: o, y: r, a, b: c };
}
function Zn(i, t, e, n, s, o) {
  let r = e < n ? e : n, a = r === e ? n : e;
  return s[r] == i && o[r] == t ? a = r : s[a] == i && o[a] == t && (r = a), [r, a];
}
function Si(i) {
  return `${i.a.join(",")};${i.b.join(",")}`;
}
class Mi {
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
function Ei(i, t, e, n) {
  let s = e | 0;
  const o = isNaN(n) ? i.length - s : n + s;
  let r, a, c, f, l, h;
  if (o > 0)
    c = l = i[s], f = h = t[s];
  else return [void 0, void 0, void 0, void 0];
  for (s++; s < o; s++)
    r = i[s], a = t[s], r < c && (c = r), r > l && (l = r), a < f && (f = a), a > h && (h = a);
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
    let o, r, a, c;
    if (arguments.length == 1)
      if (ge(t)) {
        const f = t;
        o = f[0], r = f[1], a = f[2], c = f[3];
      } else {
        const f = t;
        o = f.xmin, r = f.ymin, a = f.xmax, c = f.ymax;
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
    return t instanceof pe ? (n = t.xmin, s = t.ymin, o = t.xmax, r = t.ymax) : e.length == 3 ? (n = t, s = e[0], o = e[1], r = e[2]) : t.length == 4 ? (n = t[0], s = t[1], o = t[2], r = t[3]) : Qt("Bounds#mergeBounds() invalid argument:", t), this.xmin === void 0 ? this.setBounds(n, s, o, r) : (n < this.xmin && (this.xmin = n), s < this.ymin && (this.ymin = s), o > this.xmax && (this.xmax = o), r > this.ymax && (this.ymax = r)), this;
  }
}
function Pe(i) {
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
function Ts(i, t, e) {
  const n = Pe(t.forw), s = Pe(t.bakw);
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
function ts(i, t, e) {
  const n = Pe(t.forw), s = Pe(t.bakw);
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
function Ne(i, t = 1e-6) {
  const [e, n] = i[0], [s, o] = i[1], [r, a] = i[2];
  return Math.abs((s - e) * (a - n) - (r - e) * (o - n)) < t;
}
function _i(i, t) {
  const e = /* @__PURE__ */ new Set();
  return i.forEach((n) => {
    if (n.length !== 2) return;
    const s = n.map((o) => `${t?.[o] ?? o}`);
    e.add(s.sort().join("-"));
  }), e;
}
function ue(i) {
  return ["a", "b", "c"].map((t, e) => ({
    prop: i.properties[t],
    geom: i.geometry.coordinates[0][e]
  }));
}
const Ii = 10;
function Ai(i, t, e, n, s, o) {
  if (!i && !t) return !1;
  const r = i ? 0 : 1, a = 1 - r, c = e[r], f = e[a];
  if (!c || !f) return !1;
  const l = It(f.geom);
  let h = !1, u = !1;
  for (let p = 0; p <= 1; p++) {
    const y = n[p];
    if (!y) continue;
    const d = [String(y.prop.index), String(c.prop.index)].sort().join("-"), S = s[d];
    if (!S || S.length < 2) continue;
    const E = S.find(
      (O) => O.bakw !== o[r].bakw
    );
    if (!E) continue;
    const k = ue(E.bakw).find(
      (O) => String(O.prop.index) !== String(y.prop.index) && String(O.prop.index) !== String(c.prop.index)
    );
    if (!k) continue;
    h = !0;
    const g = It(k.geom), m = It(y.geom), b = It(c.geom), v = b[0] - m[0], x = b[1] - m[1], M = v * (l[1] - m[1]) - x * (l[0] - m[0]), T = v * (g[1] - m[1]) - x * (g[0] - m[0]);
    if (M * T > 0) {
      u = !0;
      break;
    }
  }
  return h && !u;
}
function Ni(i, t, e, n) {
  if (!i && !t) return !1;
  if (e[0] && e[1] && n[0] && n[1]) {
    const s = n.map((l) => It(l.geom)), o = e.map((l) => It(l.geom)), r = s[1][0] - s[0][0], a = s[1][1] - s[0][1], c = r * (o[0][1] - s[0][1]) - a * (o[0][0] - s[0][0]), f = r * (o[1][1] - s[0][1]) - a * (o[1][0] - s[0][0]);
    return c * f < 0;
  }
  return !1;
}
function Oi(i, t, e, n) {
  const s = _i(e, n), o = /* @__PURE__ */ new Set();
  let r = !1;
  for (let a = 0; a < Ii; a++) {
    let c = !1;
    for (const f of Object.keys(t)) {
      if (o.has(f)) continue;
      o.add(f);
      const l = t[f];
      if (!l || l.length < 2) continue;
      const h = f.split("-");
      if (h.length !== 2 || s.has(f)) continue;
      const u = ue(l[0].bakw), p = ue(l[1].bakw), y = ue(l[0].forw), d = ue(l[1].forw), S = h.map(
        (I) => u.find((B) => `${B.prop.index}` === I) || p.find((B) => `${B.prop.index}` === I)
      ), E = h.map(
        (I) => y.find((B) => `${B.prop.index}` === I) || d.find((B) => `${B.prop.index}` === I)
      );
      if (S.some((I) => !I) || E.some((I) => !I))
        continue;
      const w = [u, p].map(
        (I) => I.find((B) => !h.includes(`${B.prop.index}`))
      ), k = [y, d].map(
        (I) => I.find((B) => !h.includes(`${B.prop.index}`))
      );
      if (w.some((I) => !I) || k.some((I) => !I))
        continue;
      const g = l[0].bakw.geometry.coordinates[0].slice(0, 3).map((I) => It(I)), m = l[1].bakw.geometry.coordinates[0].slice(0, 3).map((I) => It(I)), b = l[0].forw.geometry.coordinates[0].slice(0, 3).map((I) => It(I)), v = l[1].forw.geometry.coordinates[0].slice(0, 3).map((I) => It(I)), x = Ne(g), M = Ne(m), T = Ne(b), O = Ne(v), D = Ai(
        x,
        M,
        w,
        S,
        t,
        l
      ), C = Ni(
        T,
        O,
        w,
        S
      );
      if (!(D || C || es(
        It(w[0].geom),
        m
      ) || es(
        It(w[1].geom),
        g
      )))
        continue;
      const N = E.map(
        (I) => It(I.geom)
      ), A = k.map(
        (I) => It(I.geom)
      ), F = Ti([
        ...N,
        ...A
      ]), P = Fi(F), V = ns(
        N[0],
        N[1],
        A[0]
      ) + ns(
        N[0],
        N[1],
        A[1]
      );
      un(P, V) && (ts(t, l[0], i), ts(t, l[1], i), S.forEach((I) => {
        if (!I) return;
        const B = [
          I.geom,
          w[0].geom,
          w[1].geom,
          I.geom
        ], $ = {
          a: I.prop,
          b: w[0].prop,
          c: w[1].prop
        }, X = me([B], $), U = cn(X);
        Ts(t, {
          forw: U,
          bakw: X
        }, i);
      }), c = !0, r = !0);
    }
    if (!c) break;
  }
  return r;
}
function It(i) {
  return [i[0], i[1]];
}
function es(i, t) {
  const [e, n] = t[0], [s, o] = t[1], [r, a] = t[2], c = r - e, f = a - n, l = s - e, h = o - n, u = i[0] - e, p = i[1] - n, y = c * c + f * f, d = c * l + f * h, S = c * u + f * p, E = l * l + h * h, w = l * u + h * p, k = y * E - d * d;
  if (k === 0) return !1;
  const g = 1 / k, m = (E * S - d * w) * g, b = (y * w - d * S) * g, v = 1e-9;
  return m >= -v && b >= -v && m + b <= 1 + v;
}
function Ti(i) {
  const t = i.map((r) => r.slice()).filter(
    (r, a, c) => c.findIndex(
      (f) => un(f[0], r[0]) && un(f[1], r[1])
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
function Fi(i) {
  if (i.length < 3) return 0;
  let t = 0;
  for (let e = 0; e < i.length; e++) {
    const [n, s] = i[e], [o, r] = i[(e + 1) % i.length];
    t += n * r - o * s;
  }
  return Math.abs(t) / 2;
}
function ns(i, t, e) {
  return Math.abs(
    (i[0] * (t[1] - e[1]) + t[0] * (e[1] - i[1]) + e[0] * (i[1] - t[1])) / 2
  );
}
function un(i, t, e = 1e-9) {
  return Math.abs(i - t) <= e;
}
const Bi = (i) => typeof i == "string" && i.startsWith("b");
function Ri(i, t) {
  const e = (n, s) => {
    for (let o = 0; o < 3; o++) {
      const r = n.g[o], a = n.g[(o + 1) % 3];
      if (s.g.every((c) => n.sign * ft(r[0], r[1], a[0], a[1], c[0], c[1]) <= 0)) return !0;
    }
    return !1;
  };
  return !e(i, t) && !e(t, i);
}
function Pi(i, t, e) {
  if (t.length === 0) return [];
  const n = i.features.map((d) => {
    const { a: S, b: E, c: w } = d.properties, k = [S.geom, E.geom, w.geom], [g, m, b] = d.geometry.coordinates[0], v = k.map(([O]) => O), x = k.map(([, O]) => O), M = Math.sign(ft(g[0], g[1], m[0], m[1], b[0], b[1])), T = Math.sign(ft(k[0][0], k[0][1], k[1][0], k[1][1], k[2][0], k[2][1]));
    return {
      ids: [S.index, E.index, w.index].map(String),
      g: k,
      sign: T,
      ratio: M * T,
      aux: [S.index, E.index, w.index].some(Bi),
      minx: Math.min(...v),
      maxx: Math.max(...v),
      miny: Math.min(...x),
      maxy: Math.max(...x)
    };
  }), s = n.map((d) => d.ratio), o = s.reduce((d, S) => d + S, 0) < 0 ? -1 : 1, r = (d, S) => d < S ? `${d}|${S}` : `${S}|${d}`, a = /* @__PURE__ */ new Map();
  n.forEach((d, S) => {
    for (let E = 0; E < 3; E++) {
      const w = r(d.ids[E], d.ids[(E + 1) % 3]), k = a.get(w);
      k ? k.push(S) : a.set(w, [S]);
    }
  });
  const c = ([d, S]) => r(String(e[d]), String(e[S])), f = /* @__PURE__ */ new Set();
  for (const d of t) for (const S of a.get(c(d)) ?? []) f.add(S);
  const l = (d) => n[d].aux || f.has(d), h = /* @__PURE__ */ new Set();
  n.forEach((d, S) => {
    l(S) && (s[S] === 0 || s[S] !== o) && h.add(S);
  });
  const u = n.map((d, S) => S).sort((d, S) => n[d].minx - n[S].minx);
  for (let d = 0; d < u.length; d++) {
    const S = n[u[d]];
    if (S.sign !== 0)
      for (let E = d + 1; E < u.length; E++) {
        const w = n[u[E]];
        if (w.minx >= S.maxx) break;
        w.sign === 0 || w.miny >= S.maxy || S.miny >= w.maxy || !l(u[d]) && !l(u[E]) || Ri(S, w) && (h.add(u[d]), h.add(u[E]));
      }
  }
  if (h.size === 0) return [];
  const p = t.filter((d) => (a.get(c(d)) ?? []).some((S) => h.has(S)));
  if (p.length > 0) return p;
  const y = /* @__PURE__ */ new Set();
  for (const d of h) for (const S of n[d].ids) S.startsWith("b") || y.add(S);
  return t.filter(
    ([d, S]) => y.has(String(e[d])) || y.has(String(e[S]))
  );
}
const ie = 0, De = (i) => i + 1, Dt = 1, Tt = 2, ss = 4, rs = 1e-6, Di = 0.2, Ci = 4, Fs = Math.sign(
  $e(0, 0, 1, 0, 0, 1, 0.25, 0.25) * ft(0, 0, 1, 0, 0, 1)
), dt = (i) => [
  i[0],
  i[1]
];
function is(i) {
  const t = i.length;
  if (t < 3) return !1;
  for (let e = 0; e < t; e++) {
    const n = i[e], s = i[(e + 1) % t], o = i[(e + 2) % t];
    if (Ht(n, s, o) === 0 && (n[0] - s[0]) * (o[0] - s[0]) + (n[1] - s[1]) * (o[1] - s[1]) > 0)
      return !1;
    for (let r = e + 2; r < t; r++) {
      if (e === 0 && r === t - 1) continue;
      const a = i[r], c = i[(r + 1) % t];
      if (Be(n[0], n[1], s[0], s[1], a[0], a[1], c[0], c[1]))
        return !1;
    }
  }
  return !0;
}
const os = 2 ** 26;
function it(i, t) {
  return i < t ? i * os + t : t * os + i;
}
const Ht = (i, t, e) => Math.sign(ft(i[0], i[1], t[0], t[1], e[0], e[1])), Oe = (i, t, e) => Math.abs((t[0] - i[0]) * (e[1] - i[1]) - (e[0] - i[0]) * (t[1] - i[1]));
class Vi {
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
    const r = this.triangles.length * 4 + 8;
    for (let a = 0; a < r && !s() && this.repairOne(t, e, n); a++)
      o++;
    return o;
  }
  repairOne(t, e, n) {
    const s = /* @__PURE__ */ new Map();
    this.triangles.forEach((o, r) => {
      for (let a = 0; a < 3; a++) {
        const c = it(o[a], o[(a + 1) % 3]), f = s.get(c);
        f ? f.push(r) : s.set(c, [r]);
      }
    });
    for (let o = 0; o < this.triangles.length; o++) {
      const r = this.triangles[o];
      if (t(r))
        for (let a = 0; a < 3; a++) {
          const c = r[a], f = r[(a + 1) % 3], l = r[(a + 2) % 3], h = it(c, f);
          if (n.has(h)) continue;
          const u = s.get(h);
          if (u.length !== 2) continue;
          const p = u[0] === o ? u[1] : u[0], y = this.triangles[p].find((E) => E !== c && E !== f), d = [
            [c, y, l],
            [y, f, l]
          ], S = e([r, this.triangles[p]], d, it(l, y));
          if (S) {
            for (const E of S) n.add(E);
            return this.triangles[o] = d[0], this.triangles[p] = d[1], !0;
          }
        }
    }
    return !1;
  }
}
class Xe {
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
    const r = this.forbiddenGroup(t, e, n);
    return r === ie ? this.forbiddenBoundary++ : r !== void 0 && this.forbiddenEdge++, s;
  }
  removeTriangle(t) {
    const e = this.triangles.get(t);
    this.triangles.delete(t);
    for (let s = 0; s < 3; s++) {
      this.byVertex.get(e[s])?.delete(t);
      const o = it(e[s], e[(s + 1) % 3]), r = this.byEdge.get(o);
      r.length === 1 ? this.byEdge.delete(o) : r.splice(r.indexOf(t), 1);
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
    const o = s(t), r = s(e), a = s(n);
    return Ht(o.forw, r.forw, a.forw) * Ht(o.bakw, r.bakw, a.bakw) === this.sigma;
  }
  /** 新しく作る三角形の合格: ok に加えて、両面とも 2×面積が閾値以上。 */
  okNew(t, e, n, s = this.vertexAt) {
    if (!this.ok(t, e, n, s)) return !1;
    const o = s(t), r = s(e), a = s(n);
    return Oe(o.forw, r.forw, a.forw) >= rs && Oe(o.bakw, r.bakw, a.bakw) >= rs;
  }
  /** 3 頂点が同じ群に属するなら、その群の番号（禁止制約の違反）。属さなければ undefined。 */
  forbiddenGroup(t, e, n) {
    const s = this.vertices.get(e).groups, o = this.vertices.get(n).groups;
    return this.vertices.get(t).groups.find((r) => s.includes(r) && o.includes(r));
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
      const r = this.positive(o);
      if (!r) return;
      for (let a = 0; a < 3; a++) {
        const c = r[a], f = r[(a + 1) % 3], l = this.byEdge.get(it(c, f));
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
    if (!e.unlimited && t.size > this.triangles.size * Di)
      return n("tooLarge");
    const s = new Set(e.remove ?? []), o = [], r = /* @__PURE__ */ new Set();
    let a = 0;
    for (const R of t) {
      const z = this.positive(R);
      if (!z) return n("notDisk");
      for (let G = 0; G < 3; G++) {
        const st = z[G], at = z[(G + 1) % 3], wt = this.byEdge.get(it(st, at));
        if (wt.length > 2) return n("notDisk");
        wt.length === 2 && t.has(wt[0]) && t.has(wt[1]) || wt.length === 1 && (s.has(st) || s.has(at)) || (wt.length === 1 && a++, o.push([st, at]), r.add(st).add(at));
      }
    }
    if (o.length < 3) return n("notDisk");
    const c = new Set(e.add ?? []);
    for (const R of t)
      for (const z of this.triangles.get(R))
        !r.has(z) && !s.has(z) && c.add(z);
    for (const R of s) {
      if (r.has(R)) return n("notDisk");
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
    const h = [...r, ...c], u = new Map(h.map((R, z) => [R, z])), p = /* @__PURE__ */ new Set(), y = [];
    for (const [R, z] of o)
      p.add(it(R, z)), y.push([u.get(R), u.get(z)]);
    const d = /* @__PURE__ */ new Set();
    if (l)
      for (let R = 0; R < l.length; R++) {
        const z = l[R], G = l[(R + 1) % l.length];
        d.add(it(z, G)), y.push([u.get(z), u.get(G)]);
      }
    const S = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Set(), w = new Set(
      (e.release ?? []).map(([R, z]) => it(R, z))
    );
    for (const R of t) {
      const z = this.triangles.get(R);
      for (let G = 0; G < 3; G++) {
        const st = z[G], at = z[(G + 1) % 3], wt = it(st, at);
        p.has(wt) || (E.add(wt), (this.edgeFlags.get(wt) ?? 0) & (Dt | Tt) && (s.has(st) || s.has(at) || w.has(wt) || S.set(wt, [st, at])));
      }
    }
    for (const [R, z] of e.constrain ?? []) {
      if (!u.has(R) || !u.has(z)) return n("constraint");
      const G = it(R, z);
      !p.has(G) && !d.has(G) && S.set(G, [R, z]);
    }
    for (const [R, z] of S.values())
      y.push([u.get(R), u.get(z)]);
    let k;
    const g = [];
    try {
      const R = Le.from(h.map((st) => f(st).forw));
      if (R.triangles.length === 0) return n("constraint");
      let z = new Jt(R, y);
      const G = (e.soft ?? []).filter(
        ([st, at]) => u.has(st) && u.has(at) && !p.has(it(st, at)) && !d.has(it(st, at)) && !S.has(it(st, at))
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
      k = z.del;
    } catch {
      return n("constraint");
    }
    const { triangles: m, halfedges: b } = k, v = m.length / 3, x = (R) => f(h[R]).forw;
    let M = 0, T = 0;
    for (let R = 0; R < v; R++) {
      const z = x(m[R * 3]), G = x(m[R * 3 + 1]), st = x(m[R * 3 + 2]), at = Oe(z, G, st);
      if (at > T) {
        const wt = Ht(z, G, st);
        wt !== 0 && (T = at, M = wt);
      }
    }
    if (M === 0) return n("count");
    const O = /* @__PURE__ */ new Map();
    for (let R = 0; R < m.length; R++)
      O.set(m[R] * h.length + m[Ot(R)], R);
    const D = /* @__PURE__ */ new Set();
    for (const [R, z] of o) {
      const G = u.get(R), st = u.get(z), at = O.get(
        M > 0 ? G * h.length + st : st * h.length + G
      );
      if (at === void 0) return n("pointOutside");
      D.add(at);
    }
    const C = (R) => d.size > 0 && d.has(it(h[m[R]], h[m[Ot(R)]])), _ = /* @__PURE__ */ new Set(), N = [];
    for (const R of D) {
      const z = Math.floor(R / 3);
      _.has(z) || (_.add(z), N.push(z));
    }
    for (let R = 0; R < N.length; R++)
      for (let z = N[R] * 3; z < N[R] * 3 + 3; z++) {
        if (D.has(z) || C(z)) continue;
        const G = b[z];
        if (G === -1 || D.has(G)) return n("pointOutside");
        const st = Math.floor(G / 3);
        _.has(st) || (_.add(st), N.push(st));
      }
    for (const R of D) {
      const z = b[R];
      if (z !== -1 && !D.has(z) && _.has(Math.floor(z / 3)))
        return n("pointOutside");
    }
    for (let R = 0; R < m.length; R++) {
      if (!C(R) || !_.has(Math.floor(R / 3))) continue;
      const z = b[R];
      if (z !== -1 && _.has(Math.floor(z / 3))) return n("boundary");
    }
    const A = [], F = /* @__PURE__ */ new Set();
    for (const R of _) {
      const z = h[m[R * 3]], G = h[m[R * 3 + 1]], st = h[m[R * 3 + 2]];
      F.add(z).add(G).add(st), A.push(M === this.forwSign ? [z, G, st] : [z, st, G]);
    }
    for (const R of c) if (!F.has(R)) return n("pointOutside");
    const P = /* @__PURE__ */ new Set();
    for (const [R, z, G] of A)
      P.add(it(R, z)).add(it(z, G)).add(it(G, R));
    for (const R of S.keys())
      if (!P.has(R)) return n("constraint");
    for (const R of d)
      if (!P.has(R)) return n("boundary");
    const V = g.map(([R, z]) => it(R, z)).filter((R) => P.has(R)), I = /* @__PURE__ */ new Set([
      ...p,
      ...d,
      ...S.keys(),
      ...V
    ]), B = new Vi(A), $ = (R) => Ht(f(R[0]).forw, f(R[1]).forw, f(R[2]).forw) === this.forwSign && this.okNew(R[0], R[1], R[2], f), X = (R) => this.forbiddenGroup(R[0], R[1], R[2]) !== void 0, U = e.allowBad || e.forwOnly, Y = e.forwOnly ? 0 : B.repair(
      (R) => !this.okNew(R[0], R[1], R[2], f),
      (R, z) => z.every($) ? [] : void 0,
      I
    );
    if (!U) {
      for (const R of B.triangles) if (!$(R)) return n("notStrict");
    }
    let L = 0;
    for (const R of t) {
      const [z, G, st] = this.triangles.get(R);
      this.forbiddenGroup(z, G, st) !== void 0 && L++;
    }
    const q = () => B.triangles.filter(X).length, K = [];
    let H = 0;
    if (q() > L && (H = B.repair(
      X,
      (R, z, G) => {
        if (z.every($) && !(z.filter(X).length >= R.filter(X).length))
          return K.push(G), [G];
      },
      I,
      () => q() <= L
    ), q() > L && !U))
      return n("forbidden");
    A.splice(0, A.length, ...B.triangles);
    for (const [R, z] of e.move ?? []) {
      const G = this.vertices.get(R);
      G.forw = dt(z.forw), G.bakw = dt(z.bakw);
    }
    const Q = [...t];
    for (const R of Q) this.removeTriangle(R);
    const W = A.map(([R, z, G]) => this.addTriangle(R, z, G));
    for (const R of E) {
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
      Ci * o.length,
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
    const r = this.byEdge.get(it(t, e));
    if (!r || r.length !== 2) return;
    const a = this.positive(r[0]);
    if (!a) return;
    const c = a.findIndex(
      (E, w) => (E === t || E === e) && (a[(w + 1) % 3] === t || a[(w + 1) % 3] === e)
    ), f = a[c], l = a[(c + 1) % 3], h = a[(c + 2) % 3], u = this.triangles.get(r[1]).find((E) => E !== t && E !== e), p = [
      [f, u, h],
      [u, l, h]
    ], y = this.vertexAt;
    for (const [E, w, k] of p)
      if (Ht(y(E).forw, y(w).forw, y(k).forw) <= 0 || !o && !this.okNew(E, w, k)) return;
    const d = (E) => E.filter(([w, k, g]) => this.forbiddenGroup(w, k, g) !== void 0).length, S = r.map((E) => this.triangles.get(E));
    if (!(d(p) > d(S))) {
      for (const E of [...r])
        this.removeTriangle(E), s?.has(E) ? s.delete(E) : n?.add(E);
      for (const [E, w, k] of p) {
        const g = this.forwSign > 0 ? this.addTriangle(E, w, k) : this.addTriangle(E, k, w);
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
    const r = [...t];
    let a = 0;
    for (let c = 0; c < r.length && c < e; c++) {
      const [f, l] = r[c], h = it(f, l);
      if ((this.edgeFlags.get(h) ?? 0) !== 0) continue;
      const u = this.byEdge.get(h);
      if (!u || u.length !== 2) continue;
      const p = this.positive(u[0]);
      if (!p) continue;
      const y = this.triangles.get(u[1]).find((g) => g !== f && g !== l), [d, S, E, w] = [...p, y].map((g) => this.vertices.get(g).forw);
      if ($e(d[0], d[1], S[0], S[1], E[0], E[1], w[0], w[1]) * Fs <= 0)
        continue;
      const k = this.flipEdge(f, l, n, s, o);
      k && (a++, r.push(...k));
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
      const [r, a, c] = this.triangles.get(o);
      this.ok(r, a, c) ? this.bad.delete(o) : this.bad.add(o);
    }
    this.revision++;
  }
  // ── 外周 ──
  /** 網の外周 ∂M（対の無い辺）を、輪の頂点の列で取る。1 本の輪でなければ undefined。 */
  boundaryRing() {
    const t = /* @__PURE__ */ new Map();
    for (const [s, o] of this.byEdge) {
      if (o.length !== 1) continue;
      const r = this.positive(o[0]) ?? this.triangles.get(o[0]);
      for (let a = 0; a < 3; a++) {
        const c = r[a], f = r[(a + 1) % 3];
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
    const e = new Xe(this.sigma, this.forwSign);
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
      let r = s;
      for (let a = 0; a < t; a++) {
        r = this.grow(r);
        const c = this.replace(r);
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
          for (let r = 0; r < 3; r++) {
            const a = o[r], c = o[(r + 1) % 3];
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
    const r = /* @__PURE__ */ new Map();
    for (const [l, [h, u, p]] of this.triangles) {
      this.ok(h, u, p) || t.push(l);
      const y = this.forbiddenGroup(h, u, p);
      y === ie ? e++ : y !== void 0 && n++, s += Oe(
        this.vertices.get(h).forw,
        this.vertices.get(u).forw,
        this.vertices.get(p).forw
      ) / 2;
      for (const [d, S] of [
        [h, u],
        [u, p],
        [p, h]
      ]) {
        const E = it(d, S);
        r.set(E, (r.get(E) ?? 0) + 1), this.byEdge.get(E)?.includes(l) || (o = !1), this.byVertex.get(d)?.has(l) || (o = !1);
      }
    }
    let a = 0;
    for (const [l, h] of r)
      h > 2 && a++, this.byEdge.get(l)?.length !== h && (o = !1);
    r.size !== this.byEdge.size && (o = !1);
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
const as = (i, t, e) => Math.sign(ft(i[0], i[1], t[0], t[1], e[0], e[1]));
function $i(i, t, e, n, s) {
  const o = /* @__PURE__ */ new Map();
  for (const p of i) {
    const { index: y, geom: d } = p.properties.target;
    o.set(y, { forw: p.geometry.coordinates, bakw: d });
  }
  let r = 0, a = 0;
  for (const p of t.features) {
    const { a: y, b: d, c: S } = p.properties, [E, w, k] = [y, d, S].map(({ index: m }) => o.get(m));
    if (!E || !w || !k) return;
    const g = as(E.forw, w.forw, k.forw);
    a += g, r += g * as(E.bakw, w.bakw, k.bakw);
  }
  if ((r < 0 ? -1 : 1) !== s) return;
  const c = new Xe(s, a < 0 ? -1 : 1), f = { mesh: c, indexOf: /* @__PURE__ */ new Map(), interior: [], ring: [] }, l = /* @__PURE__ */ new Map(), h = i.map(() => []);
  let u = 1;
  for (const [p, y] of e)
    p < n && h[p].push(u), h[y].push(u), y < n && u++;
  i.forEach((p, y) => {
    const { index: d, geom: S } = p.properties.target, E = typeof d == "string" && d.startsWith("b"), w = c.addVertex(
      E ? { kind: "boundary", order: f.ring.length } : typeof d == "number" ? { kind: "gcp", id: d } : { kind: "edgeNode", edge: -1, order: y },
      p.geometry.coordinates,
      S,
      E ? [ie] : h[y]
    );
    l.set(d, w), f.indexOf.set(w, d), (E ? f.ring : f.interior).push(w);
  });
  for (const p of t.features) {
    const { a: y, b: d, c: S } = p.properties;
    c.addTriangle(l.get(y.index), l.get(d.index), l.get(S.index));
  }
  for (const [p, y] of e)
    c.setFlag(f.interior[p], f.interior[y], Dt);
  return c.boundarySimple = c.computeBoundarySimple(), f;
}
function Li(i) {
  return {
    mesh: i.mesh.clone(!0),
    indexOf: new Map(i.indexOf),
    interior: [...i.interior],
    ring: [...i.ring]
  };
}
function Xi(i) {
  const { mesh: t, indexOf: e } = i, n = [];
  for (const s of t.triangles.values()) {
    const [o, r, a] = s.map((c) => t.vertices.get(c));
    n.push({
      type: "Feature",
      properties: {
        a: { geom: o.bakw, index: e.get(s[0]) },
        b: { geom: r.bakw, index: e.get(s[1]) },
        c: { geom: a.bakw, index: e.get(s[2]) }
      },
      geometry: { type: "Polygon", coordinates: [[o.forw, r.forw, a.forw, o.forw]] }
    });
  }
  return { type: "FeatureCollection", features: n };
}
function Bs(i, t) {
  const { mesh: e } = i, n = i.ring.length;
  for (let d = 0; d < n; d++)
    if (e.byEdge.get(it(i.ring[d], i.ring[(d + 1) % n]))?.length !== 1)
      return { ok: !1, reason: "bandNotAnnulus" };
  for (const d of i.ring) {
    let S = 0;
    for (const E of e.byVertex.get(d)) {
      const w = e.triangles.get(E);
      for (let k = 0; k < 3; k++) {
        const g = w[k], m = w[(k + 1) % 3];
        (g === d || m === d) && e.byEdge.get(it(g, m)).length === 1 && S++;
      }
    }
    if (S !== 2) return { ok: !1, reason: "bandNotAnnulus" };
  }
  const s = new Set(t.extra ?? []);
  for (const d of i.ring)
    for (const S of e.byVertex.get(d)) s.add(S);
  const o = (t.addPoints ?? []).map(({ index: d, forw: S, bakw: E }) => ({
    index: d,
    vertex: e.addVertex({ kind: "edgeNode", edge: -1, order: -1 }, S, E)
  })), r = t.vertices.map(
    ({ forw: d, bakw: S }, E) => e.addVertex({ kind: "boundary", order: E }, d, S, [ie])
  ), a = [...i.interior, ...o.map(({ vertex: d }) => d)], c = new Set(t.edit?.remove ?? []), f = [];
  for (const [d, S] of e.edgeFlags)
    S & Tt && f.push([d, S]);
  for (const [d, S] of f)
    S & ~Tt ? e.edgeFlags.set(d, S & ~Tt) : e.edgeFlags.delete(d);
  const l = [], h = [];
  for (const [d, S] of t.hull) {
    const E = a[d], w = a[S];
    if (E === void 0 || w === void 0 || c.has(E) || c.has(w)) continue;
    l.push([E, w]);
    const k = e.byEdge.get(it(E, w));
    k && !k.every((g) => s.has(g)) ? e.setFlag(E, w, Tt) : h.push([E, w, Tt]);
  }
  const u = e.replace(s, {
    ...t.edit,
    remove: [...i.ring, ...t.edit?.remove ?? []],
    add: [...r, ...o.map(({ vertex: d }) => d), ...t.edit?.add ?? []],
    outerRing: r,
    replacesWholeBoundary: !0,
    soft: h,
    allowBad: t.allowBad,
    forwOnly: t.forwOnly,
    unlimited: !0
  });
  if (!u.ok) {
    for (const d of [...r].reverse()) e.dropVertex(d);
    for (const { vertex: d } of [...o].reverse()) e.dropVertex(d);
    for (const [d, S] of e.edgeFlags)
      S & Tt && (S & ~Tt ? e.edgeFlags.set(d, S & ~Tt) : e.edgeFlags.delete(d));
    for (const [d, S] of f) e.edgeFlags.set(d, (e.edgeFlags.get(d) ?? 0) | S);
    return u;
  }
  for (const d of i.ring) i.indexOf.delete(d);
  r.forEach((d, S) => i.indexOf.set(d, `b${S}`));
  for (const { index: d, vertex: S } of o) i.indexOf.set(S, d);
  i.ring = r, i.interior = a;
  const p = new Map(a.map((d, S) => [d, S])), y = [];
  for (const [d, S] of l)
    e.hasEdge(d, S) && (e.setFlag(d, S, Tt), y.push([p.get(d), p.get(S)]));
  return { ok: !0, applied: y, removed: u.removed, added: u.added };
}
function zi(i) {
  const { mesh: t } = i;
  let e = 0;
  for (const n of t.bad)
    t.triangles.get(n).some((o) => t.vertices.get(o).ref.kind === "boundary") && e++;
  return e;
}
const Yi = 4, cs = 32, qi = 1, Ui = 0.4, Rs = 4, ji = 1e-4, Ps = 0.25, Gi = 0.01, qt = (i, t) => String(i) < String(t) ? `${i}|${t}` : `${t}|${i}`;
function an(i, t, e) {
  const n = t.filter((f) => !String(f.properties.target.index).startsWith("b")).map((f) => ({
    id: f.properties.target.index,
    paper: f.geometry.coordinates,
    geo: f.properties.target.geom
  })), s = /* @__PURE__ */ new Set();
  let o = 0, r = 0;
  const a = i.features.map((f) => {
    const { a: l, b: h, c: u } = f.properties, [p, y, d] = f.geometry.coordinates[0];
    s.add(qt(l.index, h.index)), s.add(qt(l.index, u.index)), s.add(qt(h.index, u.index));
    const S = Math.sign(ft(p[0], p[1], y[0], y[1], d[0], d[1])) * Math.sign(ft(l.geom[0], l.geom[1], h.geom[0], h.geom[1], u.geom[0], u.geom[1]));
    return S > 0 ? o++ : S < 0 && r++, {
      ids: [String(l.index), String(h.index), String(u.index)],
      paper: [p, y, d],
      geo: [l.geom, h.geom, u.geom],
      sign: S
    };
  }), c = e.filter(([f, l]) => !s.has(qt(n[f].id, n[l].id)));
  return { points: n, triangles: a, majority: o >= r ? 1 : -1, hullEdges: e, dropped: c };
}
function Ds(i) {
  return [i.foot[0] + i.height * i.normal[0], i.foot[1] + i.height * i.normal[1]];
}
function Ki(i, [t, e], { lambda: n = Ps, epsilon: s = ji } = {}) {
  const { points: o, majority: r } = i, a = o[t], c = o[e], f = o.reduce((A, F) => A + F.paper[0], 0) / o.length, l = o.reduce((A, F) => A + F.paper[1], 0) / o.length, h = Math.sign(ft(a.paper[0], a.paper[1], c.paper[0], c.paper[1], f, l));
  if (h === 0) return;
  const u = h * r, p = [c.paper[0] - a.paper[0], c.paper[1] - a.paper[1]], y = [c.geo[0] - a.geo[0], c.geo[1] - a.geo[1]], d = Math.hypot(p[0], p[1]), S = Math.hypot(y[0], y[1]);
  if (!(d > 0 && S > 0)) return;
  const E = [];
  for (const A of o) {
    if (A === a || A === c) continue;
    const F = ft(a.geo[0], a.geo[1], c.geo[0], c.geo[1], A.geo[0], A.geo[1]);
    if (F * u >= 0) continue;
    const P = ((A.geo[0] - a.geo[0]) * y[0] + (A.geo[1] - a.geo[1]) * y[1]) / (S * S), V = ((A.paper[0] - a.paper[0]) * p[0] + (A.paper[1] - a.paper[1]) * p[1]) / (d * d);
    P > 0 && P < 1 && V > 0 && V < 1 && E.push({ id: A.id, u: P, t: V, d: Math.abs(F) / S });
  }
  const w = E.length > 0;
  w || E.push({ u: 0.5, t: 0.5, d: 0 });
  const k = E.reduce((A, F) => F.d > A.d ? F : A);
  let g = 0;
  for (const A of E)
    g = Math.max(g, A.u <= k.u ? A.d * k.u / A.u : A.d * (1 - k.u) / (1 - A.u));
  g *= 1 + n;
  const m = [-p[1] / d * h, p[0] / d * h], b = [-y[1] / S * u, y[0] / S * u], v = (A) => [
    a.paper[0] + A * p[0] + s * d * m[0],
    a.paper[1] + A * p[1] + s * d * m[1]
  ], x = (A, F, P, V) => ({
    paper: v(A),
    foot: [a.geo[0] + F * y[0], a.geo[1] + F * y[1]],
    normal: b,
    height: P,
    chord: S,
    protrusion: k.d,
    ...V === void 0 ? {} : { anchor: V }
  }), M = [x(k.t, k.u, g, w ? k.id : void 0)], T = [...E].sort((A, F) => A.u - F.u), O = [{ u: 0, d: 0 }], D = (A, F, P) => (F.u - A.u) * (P.d - A.d) - (F.d - A.d) * (P.u - A.u);
  for (const A of [...T, { u: 1, d: 0 }]) {
    for (; O.length >= 2 && D(O[O.length - 2], O[O.length - 1], A) >= 0; ) O.pop();
    O.push(A);
  }
  const C = n * k.d, _ = [];
  let N = 0;
  for (const A of O.slice(1, -1))
    A.t === void 0 || !(A.t > N) || (N = A.t, _.push(x(A.t, A.u, A.d + C, w ? A.id : void 0)));
  return {
    edge: [a.id, c.id],
    variants: w && _.length > 1 ? [M, _] : [M]
  };
}
function Wi(i, t, e, { lambda: n = Ps, mu: s = Gi, maxIterations: o = Rs } = {}) {
  let r = i.map((a, c) => ({ ray: { ...a }, index: c }));
  for (let a = 0; a < o && r.length > 0; a++) {
    const c = e(r.map(({ ray: h }) => [h.paper, Ds(h)]));
    if (!c) return;
    let f = !1;
    const l = /* @__PURE__ */ new Set();
    for (const [h, { ray: u }] of r.entries()) {
      const p = `e${t + h}`;
      let y = -1 / 0, d = 1 / 0, S = 0;
      for (const g of c.triangles) {
        const m = g.ids.indexOf(p);
        if (m < 0) continue;
        g.sign !== c.majority && S++;
        const b = g.geo[(m + 1) % 3], v = g.geo[(m + 2) % 3], x = Math.sign(
          ft(
            g.paper[m][0],
            g.paper[m][1],
            g.paper[(m + 1) % 3][0],
            g.paper[(m + 1) % 3][1],
            g.paper[(m + 2) % 3][0],
            g.paper[(m + 2) % 3][1]
          )
        ), M = ft(u.foot[0], u.foot[1], b[0], b[1], v[0], v[1]), T = ft(u.foot[0] + u.normal[0], u.foot[1] + u.normal[1], b[0], b[1], v[0], v[1]) - M, O = x * c.majority;
        if (T === 0) {
          M * O <= 0 && (y = 1 / 0);
          continue;
        }
        const D = -M / T;
        T * O > 0 ? y = Math.max(y, D) : d = Math.min(d, D);
      }
      if (!(y < d)) {
        l.add(h);
        continue;
      }
      const E = Math.min(Math.max(n * Math.max(y, u.protrusion), s * u.chord), (d - y) / 2), w = Math.max(y, 0) + E, k = Math.abs(w - u.height) > 1e-9 * u.chord;
      (S > 0 || k) && (k && (f = !0), u.height = w);
    }
    if (l.size > 0 && (r = r.filter((h, u) => !l.has(u)), f = !0), !f) break;
  }
  if (r.length !== 0)
    return { rays: r.map(({ ray: a }) => a), kept: r.map(({ index: a }) => a) };
}
function Hi(i, t) {
  const e = (r) => typeof r == "string" && r.startsWith("e") && Number(r.slice(1)) >= t ? Number(r.slice(1)) : void 0, n = /* @__PURE__ */ new Set();
  for (const { ids: r } of i.triangles)
    n.add(qt(r[0], r[1])), n.add(qt(r[0], r[2])), n.add(qt(r[1], r[2]));
  const s = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set();
  for (const [r, a] of i.hullEdges) {
    const c = n.has(qt(i.points[r].id, i.points[a].id));
    for (const f of [r, a]) {
      const l = e(i.points[f].id);
      l !== void 0 && (o.add(l), c || s.add(l));
    }
  }
  for (const r of i.points) {
    const a = e(r.id);
    a !== void 0 && !o.has(a) && s.add(a);
  }
  return s;
}
function Ji(i, t) {
  const e = { rounds: 0, builds: 0, cost: 0, budget: 0, batches: 0, perEdge: 0, multiPoint: 0 };
  let n = [], s = [], o = t, r = i.snapshot();
  const a = /* @__PURE__ */ new Set(), c = qi * i.baseCost;
  e.budget = c;
  const f = i.buildCost();
  let l = 0;
  const h = () => l * Ui + i.buildCost() - f, u = () => h() >= c, p = (w) => {
    if (!u())
      return e.builds++, l++, i.measure(w);
  }, y = (w) => [w.paper, Ds(w)], d = (w, k, g) => {
    const m = Wi(
      w.map(({ ray: b }) => b),
      k,
      (b) => p([...n, ...b]),
      { maxIterations: g }
    );
    return m?.rays.map((b, v) => ({ ray: b, edge: w[m.kept[v]].edge }));
  }, S = (w, k) => w.length === k.length && w.every(({ ray: g }, m) => Math.abs(g.height - k[m].ray.height) <= 1e-9 * g.chord), E = (w) => {
    if (w.length === 0 || n.length + w.length > cs) return !1;
    const k = i.edgeBase + n.length;
    let g = d(w, k, 1), m = !1;
    for (; g && g.length > 0 && !u(); ) {
      const b = [...n, ...g.map(({ ray: T }) => y(T))];
      e.builds++;
      const v = i.build(b, Math.max(1, Math.ceil(c - h()))), x = v ? Hi(v.analysis, k) : void 0;
      if (v && x.size === 0)
        return s = s.concat(
          g.map(({ ray: T, edge: O }, D) => ({
            node: k + D,
            kind: "hullEdge",
            edge: O,
            ...T.anchor === void 0 ? {} : { anchor: T.anchor }
          }))
        ), n = b, o = v, r = i.snapshot(), !0;
      if (i.restore(r), v && x.size < g.length) {
        g = g.filter((T, O) => !x.has(k + O));
        continue;
      }
      if (m) return !1;
      m = !0;
      const M = d(g, k, Rs);
      if (!M || S(M, g)) return !1;
      g = M;
    }
    return !1;
  };
  for (let w = 1; w <= Yi && !u(); w++) {
    const { analysis: k } = o, g = [];
    for (const b of k.dropped) {
      const v = b.map((M) => k.points[M].paper.join(",")).join("|");
      if (a.has(v) || (a.add(v), n.length + g.length + 1 > cs)) continue;
      const x = Ki(k, b);
      x && g.push(x);
    }
    if (g.length === 0) break;
    e.rounds = w;
    const m = (b, v) => v.map((x) => ({ ray: x, edge: b.edge }));
    if (E(g.flatMap((b) => m(b, b.variants[0])))) {
      e.batches++;
      continue;
    }
    for (const b of g)
      for (const [v, x] of b.variants.entries()) {
        if (u()) break;
        if (E(m(b, x))) {
          e.perEdge++, v > 0 && e.multiPoint++;
          break;
        }
      }
  }
  return i.restore(r), e.cost = h(), { pairs: n, records: s, result: o.result, diagnostics: e };
}
function Cs(i, t) {
  const e = [i, t].map((n) => {
    const s = n.map((r, a, c) => {
      if (a === 0) return 0;
      const f = c[a - 1];
      return Math.sqrt(
        Math.pow(r[0] - f[0], 2) + Math.pow(r[1] - f[1], 2)
      );
    }), o = s.reduce((r, a, c) => c === 0 ? [0] : (r.push(r[c - 1] + a), r), []);
    return o.map((r, a, c) => {
      const f = r / c[c.length - 1];
      return [n[a], s[a], o[a], f];
    });
  });
  return e.map((n, s) => {
    const o = e[s ? 0 : 1];
    return n.filter((r, a) => !(a === 0 || a === n.length - 1 || r[4] === "handled")).flatMap((r) => {
      const a = r[0], c = r[3], f = o.reduce(
        (l, h, u, p) => {
          if (l) return l;
          const y = p[u + 1];
          if (h[3] === c)
            return h[4] = "handled", [h];
          if (h[3] < c && y && y[3] > c)
            return [h, y];
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
const Qi = 5e-3, Zi = 0.999, fs = 1e-9, to = (i, t) => {
  const e = Math.atan2(i[0] - t[0], i[1] - t[1]) * (180 / Math.PI);
  return e < 0 ? e + 360 : e;
};
function ls(i, t) {
  const e = ln(i, t), n = to(i, t) - e * 10;
  return n < fs ? [e, (e + 35) % 36] : n > 10 - fs ? [e, (e + 1) % 36] : [e];
}
function hs(i, t) {
  let e = 0;
  for (let n = 0; n < i.length; n++) {
    const s = i[n], o = i[(n + 1) % i.length], r = Math.sign(ft(s[0], s[1], o[0], o[1], t[0], t[1]));
    if (r === 0) return !1;
    if (e === 0) e = r;
    else if (r !== e) return !1;
  }
  return e !== 0;
}
class wn {
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
  centroid;
  /** 内側の点（対応点と中継点）の紙の面の座標の和と数。帯を作ったときの平均 */
  sum = [0, 0];
  count = 0;
  mean0;
  diagonal;
  constructor(t) {
    const { mesh: e } = t, n = (l) => e.vertices.get(l);
    this.centroid = t.centroid, this.ring = t.ring.map((l) => n(l).bakw);
    const s = [...t.gcps, ...t.nodeOrder()], o = (l) => {
      const h = te(s.map((u) => n(u)[l]));
      for (const [u, p] of h)
        this.hullVertices.add(s[u]), this.hullVertices.add(s[p]);
      return h.map(([u]) => n(s[u])[l]);
    };
    this.hull = { forw: o("forw"), bakw: o("bakw") };
    const r = t.gcps.map((l) => n(l).forw[0]), a = t.gcps.map((l) => n(l).forw[1]);
    this.box = {
      minx: Math.min(...r),
      maxx: Math.max(...r),
      miny: Math.min(...a),
      maxy: Math.max(...a)
    }, this.diagonal = Math.hypot(
      this.box.maxx - this.box.minx,
      this.box.maxy - this.box.miny
    );
    const c = new Array(36).fill(void 0);
    for (const l of s) {
      const { forw: h } = n(l), u = this.forwDistance(h);
      if (u !== 0)
        for (const p of ls(h, this.centroid.forw))
          u > this.binMax[p] && (this.binMax[p] = u, c[p] = l);
    }
    for (const l of c)
      l !== void 0 && this.binHolders.add(l);
    const f = new Set(t.supplements.map(({ vertex: l }) => l));
    for (const l of s)
      f.has(l) || (this.sum[0] += n(l).forw[0], this.sum[1] += n(l).forw[1], this.count++);
    this.mean0 = [this.sum[0] / this.count, this.sum[1] / this.count];
  }
  /** 判定できない網（world file 外周・補助頂点の輪が網の外周でない網）では null。 */
  static of(t) {
    if (!t.centroid || t.ring.length < 3) return null;
    const e = t.mesh.boundaryRing();
    if (!e || e.length !== t.ring.length) return null;
    const n = new Set(t.ring);
    return e.every((s) => n.has(s)) ? new wn(t) : null;
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
    const e = this.centroid.bakw, n = t[0] - e[0], s = t[1] - e[1];
    let o = 1 / 0;
    for (let r = 0; r < this.ring.length; r++) {
      const a = this.ring[r], c = this.ring[(r + 1) % this.ring.length], f = c[0] - a[0], l = c[1] - a[1], h = f * s - l * n;
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
    let s = this.sum[0], o = this.sum[1], r = this.count;
    for (const c of e) {
      if (c.vertex !== void 0) {
        const f = c.vertex, { forw: l, bakw: h } = t.mesh.vertices.get(f);
        if (this.hullVertices.has(f) || this.binHolders.has(f) || !(this.ringRatio(h) < Zi) || c.gcp && (l[0] === n.minx || l[0] === n.maxx || l[1] === n.miny || l[1] === n.maxy))
          return;
        c.counted && (s -= l[0], o -= l[1], r--);
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
        c.counted && (s += f[0], o += f[1], r++);
      }
    }
    if (!(r === 0 || !(Math.hypot(
      s / r - this.mean0[0],
      o / r - this.mean0[1]
    ) <= Qi * this.diagonal)))
      return { sum: [s, o], count: r };
  }
  /** 当てた編集を、算術平均に反映する（{@link keeps} が返した値を渡す）。 */
  commit(t) {
    this.sum = t.sum, this.count = t.count;
  }
}
const us = (i, t, e) => Math.sign(ft(i[0], i[1], t[0], t[1], e[0], e[1]));
class eo {
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
    return this.bandStats === void 0 && (this.bandStats = wn.of(this)), this.bandStats;
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
    ], o = this.indexTable(), r = {};
    r.version = e.version, r.points = this.gcps.map(s), r.weight_buffer = {};
    const a = this.ring.map(s);
    if (e.outer?.outerTransform === "worldFile")
      r.outerTransform = "worldFile", r.worldFile = e.outer.worldFile, r.vertices_points = a;
    else {
      const l = this.centroid;
      r.centroid_point = [
        dt(l.forw),
        dt(l.bakw)
      ], r.vertices_params = this.verticesParams(), r.vertices_points = a;
    }
    const c = t.revision > 0, f = c ? t.isStrict() ? "strict" : "strict_error" : e.strict_status;
    return r.strict_status = f, r.tins_points = [
      [...t.triangles.values()].map(
        (l) => l.map((h) => o.get(h))
      )
    ], !c && f === "strict_error" && e.kinks_points && (r.kinks_points = e.kinks_points), r.yaxisMode = e.yaxisMode, r.vertexMode = e.vertexMode, r.strictMode = e.strictMode, e.bounds ? (r.bounds = e.bounds, r.boundsPolygon = e.boundsPolygon, e.hasXy && (r.xy = e.xy), e.hasWh && (r.wh = e.wh)) : r.wh = e.wh, r.edges = this.edges.map(
      (l) => [
        l.forwNodes.map(dt),
        l.bakwNodes.map(dt),
        [o.get(l.start), o.get(l.end)]
      ]
    ), r.edgeNodes = this.nodeOrder().map(s), this.supplements.length > 0 && (r.supplementPairs = this.supplements.map((l) => ({
      node: Number(o.get(l.vertex).slice(1)),
      kind: l.kind,
      edge: l.edge.map((h) => o.get(h)),
      ...l.anchor === void 0 ? {} : { anchor: o.get(l.anchor) }
    }))), e.outer?.outerTransform === "extrapolate" && (r.outerTransform = "extrapolate"), r;
  }
}
function ds(i, t, e = {}) {
  if (i.version !== void 0 && i.version < 3)
    return { reason: "v2" };
  if (i.strict_status === "loose" || i.tins_points.length !== 1)
    return { reason: "loose" };
  const n = i.outerTransform, s = n === "worldFile" && i.yaxisMode === "follow" ? 1 : -1, o = i.points, r = i.edgeNodes ?? [], a = i.vertices_points ?? [], c = o.length, f = (m) => {
    if (typeof m == "number") return o[m];
    const b = Number(m.slice(1));
    return m.startsWith("e") ? r[b] : m.startsWith("b") ? a[b] : void 0;
  };
  let l = 0, h = 0;
  for (const m of i.tins_points[0]) {
    const [b, v, x] = m.map(f);
    if (!b || !v || !x) return { reason: "inconsistent" };
    const M = us(b[0], v[0], x[0]);
    h += M, l += M * us(b[1], v[1], x[1]);
  }
  if ((l < 0 ? -1 : 1) !== s) return { reason: "orientation" };
  const u = new Xe(s, h < 0 ? -1 : 1), p = new eo(u, {
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
    outer: n === "worldFile" ? {
      outerTransform: "worldFile",
      worldFile: i.worldFile
    } : n === "extrapolate" ? { outerTransform: "extrapolate" } : void 0,
    strict_status: i.strict_status,
    kinks_points: i.kinks_points
  }), y = /* @__PURE__ */ new Map();
  o.forEach(([m, b], v) => {
    const x = e.points?.[v] ?? v, M = u.addVertex({ kind: "gcp", id: x }, m, b);
    p.gcps.push(M), p.pointVertex.set(x, M), y.set(v, M);
  });
  const d = i.edges ?? [];
  if (p.edges = d.map(
    ([m, b, [v, x]], M) => ({
      id: e.edges?.[M] ?? M,
      start: y.get(v),
      end: y.get(x),
      forwNodes: m.map(dt),
      bakwNodes: b.map(dt),
      nodes: []
    })
  ), p.edges.some(({ start: m, end: b }) => m === void 0 || b === void 0))
    return { reason: "inconsistent" };
  const S = /* @__PURE__ */ new Map();
  {
    let m = 0;
    for (const [, b] of t)
      b >= c ? S.has(b - c) || S.set(b - c, m) : m++;
    if (m !== p.edges.length) return { reason: "inconsistent" };
  }
  r.forEach(([m, b], v) => {
    const x = S.get(v);
    let M;
    if (x !== void 0) {
      const T = p.edges[x];
      M = u.addVertex(
        { kind: "edgeNode", edge: T.id, order: T.nodes.length },
        m,
        b,
        [De(T.id)]
      ), T.nodes.push(M);
    } else
      M = u.addVertex(
        { kind: "supplement", key: `s${p.nextSupplement++}` },
        m,
        b
      );
    y.set(`e${v}`, M);
  });
  for (const m of p.edges) {
    const b = De(m.id);
    u.vertices.get(m.start).groups.push(b), u.vertices.get(m.end).groups.push(b);
  }
  a.forEach(([m, b], v) => {
    const x = u.addVertex({ kind: "boundary", order: v }, m, b, [
      ie
    ]);
    p.ring.push(x), y.set(`b${v}`, x);
  });
  const E = new Map(
    (i.supplementPairs ?? []).map((m) => [m.node, m])
  );
  for (let m = 0; m < r.length; m++) {
    if (S.has(m)) continue;
    const b = E.get(m), v = b?.edge.map((x) => y.get(x));
    if (!b || !v || v.some((x) => x === void 0))
      return { reason: "inconsistent" };
    p.supplements.push({
      vertex: y.get(`e${m}`),
      kind: b.kind,
      edge: v,
      ...b.anchor === void 0 ? {} : { anchor: y.get(b.anchor) }
    });
  }
  if (i.centroid_point)
    p.centroid = {
      forw: dt(i.centroid_point[0]),
      bakw: dt(i.centroid_point[1])
    };
  else if (n !== "worldFile") return { reason: "inconsistent" };
  for (const m of i.tins_points[0]) {
    const [b, v, x] = m.map((M) => y.get(M));
    u.addTriangle(b, v, x);
  }
  const w = (m) => m < c ? y.get(m) : y.get(`e${m - c}`);
  for (const [m, b] of t) {
    const v = w(m), x = w(b);
    if (v === void 0 || x === void 0) return { reason: "inconsistent" };
    u.setFlag(v, x, Dt);
  }
  const k = [...p.gcps, ...p.nodeOrder()], g = te(
    k.map((m) => u.vertices.get(m).forw)
  );
  for (const [m, b] of g)
    u.hasEdge(k[m], k[b]) && u.setFlag(k[m], k[b], Tt);
  return u.boundarySimple = u.computeBoundarySimple(), { model: p };
}
const no = 3, gt = (i) => ({ ok: !1, reason: i }), Vs = { overlap: 0, forbidden: 0, polish: 0 }, gs = (i, t, e) => ft(i[0], i[1], t[0], t[1], e[0], e[1]), Ce = (i, t) => i[0] === t[0] && i[1] === t[1];
function ze(i, t, e) {
  const n = (a) => i.vertices.get(a).forw, s = (a) => {
    const c = i.positive(a);
    return c !== void 0 && c.every((f, l) => gs(n(f), n(c[(l + 1) % 3]), t) >= 0);
  }, o = [e];
  let r = e;
  for (let a = 0; a <= i.triangles.size; a++) {
    const c = i.positive(r);
    if (!c) break;
    let f, l = !1;
    for (let h = 0; h < 3 && f === void 0; h++) {
      const u = c[h], p = c[(h + 1) % 3];
      gs(n(u), n(p), t) >= 0 || (l = !0, f = i.byEdge.get(it(u, p)).find((y) => y !== r));
    }
    if (!l) return { triangle: r, path: o };
    if (f === void 0) break;
    r = f, o.push(r);
  }
  for (const a of i.triangles.keys())
    if (s(a)) return { triangle: a, path: [a] };
}
function $s(i, t, e) {
  const n = (r) => i.vertices.get(r).forw, s = /* @__PURE__ */ new Set([e]), o = [e];
  for (let r = 0; r < o.length; r++) {
    const a = i.triangles.get(o[r]);
    for (let c = 0; c < 3; c++) {
      const f = it(a[c], a[(c + 1) % 3]);
      if (!((i.edgeFlags.get(f) ?? 0) & (Dt | Tt)))
        for (const l of i.byEdge.get(f)) {
          if (s.has(l)) continue;
          const h = i.positive(l);
          if (!h) continue;
          const [u, p, y] = h.map(n);
          $e(
            u[0],
            u[1],
            p[0],
            p[1],
            y[0],
            y[1],
            t[0],
            t[1]
          ) * Fs > 0 && (s.add(l), o.push(l));
        }
    }
  }
  return s;
}
function ps(i, t, e, n) {
  const s = ze(i, t, n);
  if (!s) return;
  const o = (f) => i.vertices.get(f).forw, r = (f) => {
    const l = i.triangles.get(f);
    for (let h = 0; h < 3; h++) {
      const u = o(l[h]), p = o(l[(h + 1) % 3]);
      if (Be(t[0], t[1], e[0], e[1], u[0], u[1], p[0], p[1]))
        return !0;
    }
    return !1;
  }, a = /* @__PURE__ */ new Set([s.triangle]), c = [s.triangle];
  for (let f = 0; f < c.length; f++) {
    const l = i.triangles.get(c[f]);
    for (let h = 0; h < 3; h++)
      for (const u of i.byEdge.get(it(l[h], l[(h + 1) % 3])))
        a.has(u) || !r(u) || (a.add(u), c.push(u));
  }
  return a;
}
function Ye(i, t, e) {
  if (e?.force) return () => i.resetBand();
  const n = i.band(), s = n?.keeps(i, t);
  if (!(!n || !s))
    return () => n.commit(s);
}
function vn(i, t, e, n) {
  let s = t, o;
  for (let r = 0; r <= no; r++) {
    const a = i.replace(s, e);
    if (a.ok)
      return {
        ok: !0,
        mode: "replaced",
        removed: a.removed,
        added: a.added,
        grown: r,
        size: s.size,
        flips: a.flips,
        vertices: n
      };
    if (o ??= a.reason, a.reason === "tooLarge") break;
    s = i.grow(s);
  }
  return gt(o ?? "notDisk");
}
function qe(i, t, e, n) {
  const { mesh: s } = i, o = (g) => e && g === e.vertex ? e : s.vertices.get(g), r = /* @__PURE__ */ new Set(), a = [], c = [], f = [], l = s.triangles.keys().next().value;
  if (l === void 0) return gt("unsupported");
  if (e) {
    const g = s.star(e.vertex);
    if (g.size === 0) return gt("unsupported");
    a.push({ vertex: e.vertex, to: e, gcp: !0, counted: !0 });
    for (const b of g) r.add(b);
    const m = s.vertices.get(e.vertex);
    if (!Ce(e.forw, m.forw)) {
      const b = ze(s, e.forw, g.values().next().value);
      if (!b) return gt("pointOutside");
      if (s.triangles.get(b.triangle).some((v) => v !== e.vertex && Ce(s.vertices.get(v).forw, e.forw)))
        return gt("duplicate");
      if (!g.has(b.triangle)) {
        for (const v of b.path) r.add(v);
        for (const v of $s(s, e.forw, b.triangle)) r.add(v);
      }
    }
  }
  if (e) {
    const g = new Set(t.map((m) => m.edge));
    for (const m of i.edges) {
      if (g.has(m) || m.nodes.length > 0 || m.start !== e.vertex && m.end !== e.vertex) continue;
      const b = m.start === e.vertex ? m.end : m.start, v = ps(s, s.vertices.get(b).forw, e.forw, l);
      if (!v) return gt("pointOutside");
      for (const x of v) r.add(x);
    }
  }
  const h = [];
  for (const g of t) {
    const { edge: m } = g;
    if (!g.fresh) {
      const O = [m.start, ...m.nodes, m.end];
      for (let D = 0; D + 1 < O.length; D++) f.push([O[D], O[D + 1]]);
      if (m.nodes.length === 0)
        for (const D of s.byEdge.get(it(m.start, m.end)) ?? []) r.add(D);
      for (const D of m.nodes) {
        for (const C of s.byVertex.get(D)) r.add(C);
        c.push(D), a.push({ vertex: D, gcp: !1, counted: !0 });
      }
    }
    if (g.drop) continue;
    const b = o(m.start), v = o(m.end), x = g.forwNodes.length > 0 || g.bakwNodes.length > 0, M = x ? Cs(
      [b.forw, ...g.forwNodes, v.forw],
      [b.bakw, ...g.bakwNodes, v.bakw]
    ).map(([O, D]) => [O, D]) : [];
    if (x && M.length === 0) return gt("unsupported");
    g.forwNodes = g.forwNodes.map(dt), g.bakwNodes = g.bakwNodes.map(dt), h.push({ spec: g, nodes: M });
    for (const [O, D] of M)
      a.push({ to: { forw: O, bakw: D }, gcp: !1, counted: !0 });
    const T = [b.forw, ...M.map(([O]) => O), v.forw];
    for (let O = 0; O + 1 < T.length; O++) {
      const D = ps(s, T[O], T[O + 1], l);
      if (!D) return gt("pointOutside");
      for (const C of D) r.add(C);
    }
  }
  const u = Ye(i, a, n);
  if (!u) return gt("unsupported");
  const p = c.map((g) => s.vertices.get(g).ref), y = [], d = [], S = [], E = /* @__PURE__ */ new Map();
  for (const { spec: g, nodes: m } of h) {
    const { edge: b } = g, v = De(b.id);
    if (g.fresh)
      for (const T of [b.start, b.end]) {
        const { groups: O } = s.vertices.get(T);
        O.includes(v) || (O.push(v), S.push({ vertex: T, group: v }));
      }
    const x = m.map(
      ([T, O], D) => s.addVertex({ kind: "edgeNode", edge: b.id, order: D }, T, O, [v])
    );
    y.push(...x), E.set(g, x);
    const M = [b.start, ...x, b.end];
    for (let T = 0; T + 1 < M.length; T++)
      d.push([M[T], M[T + 1], Dt]);
  }
  const w = {
    added: y,
    removed: p,
    moved: e ? [e.vertex] : []
  };
  let k;
  if (r.size === 0)
    if (!d.every(([g, m]) => s.hasEdge(g, m)))
      k = gt("constraint");
    else {
      for (const [g, m] of f) s.clearFlag(g, m, Dt);
      for (const [g, m, b] of d) s.setFlag(g, m, b);
      s.revision++, k = { ok: !0, mode: "moved", removed: [], added: [], grown: 0, size: 0, flips: Vs, vertices: w };
    }
  else
    k = vn(
      s,
      r,
      {
        move: e ? /* @__PURE__ */ new Map([[e.vertex, { forw: e.forw, bakw: e.bakw }]]) : void 0,
        add: y,
        remove: c,
        release: f,
        constrain: d
      },
      w
    );
  if (!k.ok) {
    for (const g of y) s.dropVertex(g);
    for (const { vertex: g, group: m } of S) {
      const { groups: b } = s.vertices.get(g);
      b.splice(b.indexOf(m), 1);
    }
    return k;
  }
  u();
  for (const g of t) {
    const { edge: m } = g;
    if (g.drop) {
      const b = De(m.id);
      for (const v of [m.start, m.end]) {
        const { groups: x } = s.vertices.get(v), M = x.indexOf(b);
        M !== -1 && x.splice(M, 1);
      }
      m.nodes = [];
      continue;
    }
    m.nodes = E.get(g), m.forwNodes = g.forwNodes, m.bakwNodes = g.bakwNodes;
  }
  return k;
}
function so(i, t, e, n) {
  const { mesh: s } = i, o = i.pointVertex.get(t);
  if (o === void 0) return gt("unknownPoint");
  const r = s.vertices.get(o), a = dt(e.forw ?? r.forw), c = dt(e.bakw ?? r.bakw), l = i.edges.filter(
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
  if (l.length === 0 && Ce(a, r.forw)) {
    const h = Ye(
      i,
      [{ vertex: o, to: { forw: a, bakw: c }, gcp: !0, counted: !0 }],
      n
    );
    if (!h) return gt("unsupported");
    const u = s.star(o);
    if (u.size === 0) return gt("unsupported");
    const p = (d) => d === o ? { ...r, bakw: c } : s.vertices.get(d);
    if ([...u].every((d) => {
      const [S, E, w] = s.triangles.get(d);
      return s.okNew(S, E, w, p);
    }))
      return s.relocate(o, a, c), h(), {
        ok: !0,
        mode: "moved",
        removed: [],
        added: [],
        grown: 0,
        size: u.size,
        flips: Vs,
        vertices: { added: [], removed: [], moved: [o] }
      };
  }
  return qe(i, l, { vertex: o, forw: a, bakw: c }, n);
}
function ro(i, t, e, n, s, o) {
  const { mesh: r } = i;
  if (i.pointVertex.has(t)) return gt("idInUse");
  const a = r.triangles.keys().next().value;
  if (a === void 0) return gt("unsupported");
  const c = Ye(
    i,
    [{ to: { forw: e, bakw: n }, gcp: !0, counted: !0 }],
    o
  );
  if (!c) return gt("unsupported");
  const f = ze(r, e, a);
  if (!f) return gt("pointOutside");
  if (r.triangles.get(f.triangle).some((p) => Ce(r.vertices.get(p).forw, e)))
    return gt("duplicate");
  const h = r.addVertex({ kind: "gcp", id: t }, e, n), u = vn(
    r,
    $s(r, e, f.triangle),
    { add: [h] },
    { added: [h], removed: [], moved: [] }
  );
  return u.ok ? (c(), i.gcps.splice(s ?? i.gcps.length, 0, h), i.pointVertex.set(t, h), u) : (r.dropVertex(h), u);
}
function io(i, t, e) {
  const { mesh: n } = i, s = i.pointVertex.get(t);
  if (s === void 0) return gt("unknownPoint");
  if (i.edges.some((f) => f.start === s || f.end === s) || i.supplements.some(
    (f) => f.edge.includes(s) || f.anchor === s
  ))
    return gt("unsupported");
  const o = Ye(
    i,
    [{ vertex: s, gcp: !0, counted: !0 }],
    e
  );
  if (!o) return gt("unsupported");
  const r = n.star(s);
  if (r.size === 0) return gt("unsupported");
  const a = n.vertices.get(s).ref, c = vn(
    n,
    r,
    { remove: [s] },
    { added: [], removed: [a], moved: [] }
  );
  return c.ok && (o(), i.gcps.splice(i.gcps.indexOf(s), 1), i.pointVertex.delete(t)), c;
}
function oo(i, t, e, n, s = [], o = [], r, a) {
  if (i.edges.some((u) => u.id === t)) return gt("idInUse");
  const c = i.pointVertex.get(e), f = i.pointVertex.get(n);
  if (c === void 0 || f === void 0 || c === f)
    return gt("unknownPoint");
  const l = {
    id: t,
    start: c,
    end: f,
    forwNodes: s.map(dt),
    bakwNodes: o.map(dt),
    nodes: []
  }, h = qe(
    i,
    [{ edge: l, fresh: !0, drop: !1, forwNodes: s, bakwNodes: o }],
    void 0,
    a
  );
  return h.ok && i.edges.splice(r ?? i.edges.length, 0, l), h;
}
function ao(i, t, e) {
  const n = i.edges.find((o) => o.id === t);
  if (!n) return gt("unknownEdge");
  const s = qe(
    i,
    [{ edge: n, fresh: !1, drop: !0, forwNodes: [], bakwNodes: [] }],
    void 0,
    e
  );
  return s.ok && i.edges.splice(i.edges.indexOf(n), 1), s;
}
function co(i, t, e, n, s) {
  const o = i.edges.find((r) => r.id === t);
  return o ? qe(
    i,
    [{ edge: o, fresh: !1, drop: !1, forwNodes: e, bakwNodes: n }],
    void 0,
    s
  ) : gt("unknownEdge");
}
function fo(i, t) {
  const { mesh: e } = i;
  if (!i.centroid) return { ok: !1, reason: "bandNotAnnulus" };
  const n = (F) => e.vertices.get(F), s = new Set(i.supplements.map(({ vertex: F }) => F)), o = [...i.gcps, ...i.nodeOrder()], r = o.filter((F) => !s.has(F));
  if (r.length < 3) return { ok: !1, reason: "bandFailed" };
  let a = 0, c = 0;
  for (const F of r)
    a += n(F).forw[0], c += n(F).forw[1];
  const f = [a / r.length, c / r.length], l = e.triangles.keys().next().value, h = l === void 0 ? void 0 : ze(e, f, l);
  if (!h) return { ok: !1, reason: "bandFailed" };
  const [u, p, y] = e.triangles.get(h.triangle).map(n), d = (p.forw[0] - u.forw[0]) * (y.forw[1] - u.forw[1]) - (y.forw[0] - u.forw[0]) * (p.forw[1] - u.forw[1]);
  if (d === 0) return { ok: !1, reason: "bandFailed" };
  const S = ((f[0] - u.forw[0]) * (y.forw[1] - u.forw[1]) - (y.forw[0] - u.forw[0]) * (f[1] - u.forw[1])) / d, E = ((p.forw[0] - u.forw[0]) * (f[1] - u.forw[1]) - (f[0] - u.forw[0]) * (p.forw[1] - u.forw[1])) / d, w = {
    forw: f,
    bakw: [
      u.bakw[0] + S * (p.bakw[0] - u.bakw[0]) + E * (y.bakw[0] - u.bakw[0]),
      u.bakw[1] + S * (p.bakw[1] - u.bakw[1]) + E * (y.bakw[1] - u.bakw[1])
    ]
  }, k = {};
  for (const F of ["forw", "bakw"])
    for (const [P] of te(r.map((V) => n(V)[F]))) {
      const V = n(r[P]);
      k[`${V.forw[0]}:${V.forw[1]}`] = { forw: V.forw, bakw: V.bakw };
    }
  const g = i.gcps.map((F) => n(F).forw[0]), m = i.gcps.map((F) => n(F).forw[1]), b = Math.min(...g), v = Math.max(...g), x = Math.min(...m), M = Math.max(...m), T = {
    convexBuf: k,
    centroid: w,
    allGcps: o.map((F) => ({ forw: n(F).forw, bakw: n(F).bakw })),
    minx: b,
    maxx: v,
    miny: x,
    maxy: M
  }, O = t === "birdeye" ? As : Is, D = te(o.map((F) => n(F).forw)), C = i.ring.map((F) => n(F).ref), _ = v - b, N = M - x;
  let A = "bandFailed";
  for (const F of pn) {
    const P = O(
      {
        ...T,
        minx: b - F * _,
        maxx: v + F * _,
        miny: x - F * N,
        maxy: M + F * N
      },
      !0
    );
    if (!P.every(({ bakw: B }) => B.every(Number.isFinite)) || !oe(P.map((B) => B.forw), w.forw, -1) || !oe(P.map((B) => B.bakw), w.bakw, 1))
      continue;
    const V = { mesh: e, indexOf: /* @__PURE__ */ new Map(), interior: o, ring: i.ring }, I = Bs(V, { vertices: P, hull: D });
    if (!I.ok) {
      if (I.reason === "bandNotAnnulus") return { ok: !1, reason: "bandNotAnnulus" };
      A = "bandFailed";
      continue;
    }
    return i.ring = V.ring, i.centroid = w, i.resetBand(), {
      ok: !0,
      removed: I.removed,
      added: I.added,
      removedVertices: C,
      addedVertices: V.ring,
      margin: F
    };
  }
  return { ok: !1, reason: A };
}
const Ve = (i, t) => t ? [i[0], -1 * i[1]] : i;
function lo(i, t, e) {
  const n = i.points.slice(), s = i.pointIds.slice(), o = i.edges.map(
    ([u, p, [y, d]]) => ({ forwNodes: u, bakwNodes: p, start: i.pointIds[y], end: i.pointIds[d] })
  ), r = i.edgeIds.slice(), a = (u) => {
    const p = s.indexOf(u);
    if (p === -1) throw new Error(`applyEdits: 対応点 ${u} がありません`);
    return p;
  }, c = (u) => {
    const p = r.indexOf(u);
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
        n.splice(p, 0, [u.forw, Ve(u.bakw, e)]), s.splice(p, 0, u.id);
        break;
      }
      case "removePoint": {
        const p = a(u.id);
        if (o.some((y) => y.start === u.id || y.end === u.id))
          throw new Error(`applyEdits: 対応点 ${u.id} は必須エッジの端点です（先に必須エッジを外してください）`);
        n.splice(p, 1), s.splice(p, 1);
        break;
      }
      case "movePoint": {
        const p = a(u.id);
        u.forw && l(u.forw), u.bakw && l(u.bakw), n[p] = [
          u.forw ?? n[p][0],
          u.bakw ? Ve(u.bakw, e) : n[p][1]
        ];
        break;
      }
      case "addEdge": {
        if (!Number.isInteger(u.id) || r.includes(u.id))
          throw new Error(`applyEdits: 必須エッジの id ${u.id} は使えません`);
        if (a(u.start), a(u.end), u.start === u.end) throw new Error("applyEdits: 必須エッジの両端が同じ対応点です");
        l(...u.forwNodes, ...u.bakwNodes);
        const p = f(u.position, o.length);
        o.splice(p, 0, { forwNodes: u.forwNodes, bakwNodes: u.bakwNodes, start: u.start, end: u.end }), r.splice(p, 0, u.id);
        break;
      }
      case "removeEdge": {
        const p = c(u.id);
        o.splice(p, 1), r.splice(p, 1);
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
    edgeIds: r
  };
}
const ho = (i) => i === "duplicate" || i === "unknownPoint" || i === "unknownEdge" || i === "idInUse" ? "unsupported" : i;
function ms(i, t, e, n, s = !1) {
  const { mesh: o } = i, r = [...o.bad].sort((v, x) => v - x), a = /* @__PURE__ */ new Set(), c = /* @__PURE__ */ new Set(), f = (v) => JSON.stringify(v), l = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Set(), u = /* @__PURE__ */ new Set(), p = (v, x) => {
    switch (v.type) {
      case "addPoint":
        return ro(i, v.id, v.forw, Ve(v.bakw, e), v.position, x);
      case "removePoint":
        return io(i, v.id, x);
      case "movePoint":
        return so(
          i,
          v.id,
          { forw: v.forw, bakw: v.bakw ? Ve(v.bakw, e) : void 0 },
          x
        );
      case "addEdge":
        return oo(i, v.id, v.start, v.end, v.forwNodes, v.bakwNodes, v.position, x);
      case "removeEdge":
        return ao(i, v.id, x);
      case "replaceEdgeNodes":
        return co(i, v.id, v.forwNodes, v.bakwNodes, x);
    }
  };
  let y = s && n !== void 0;
  for (const v of t) {
    let x = p(v);
    if (!x.ok && x.reason === "unsupported" && n && i.centroid && (x = p(v, { force: !0 }), x.ok && (y = !0)), !x.ok) return { ok: !1, reason: ho(x.reason) };
    for (const M of x.removed)
      c.delete(M) || a.add(M);
    for (const M of x.added) c.add(M);
    for (const M of x.vertices.removed) l.set(f(M), M);
    for (const M of x.vertices.added) h.add(M);
    for (const M of x.vertices.moved) u.add(M);
  }
  if (y) {
    const v = fo(i, n.vertexMode);
    if (!v.ok) return { ok: !1, reason: v.reason };
    for (const x of v.removed)
      c.delete(x) || a.add(x);
    for (const x of v.added) c.add(x);
    for (const x of v.removedVertices) l.set(f(x), x);
    for (const x of v.addedVertices) h.add(x);
  }
  const d = /* @__PURE__ */ new Map(), S = [];
  for (const v of u) {
    const x = o.vertices.get(v);
    x && !h.has(v) && d.set(f(x.ref), { ref: x.ref, forw: x.forw, bakw: x.bakw });
  }
  for (const v of h) {
    const x = o.vertices.get(v);
    if (!x) continue;
    const M = f(x.ref), T = { ref: x.ref, forw: x.forw, bakw: x.bakw };
    l.delete(M) ? d.set(M, T) : S.push(T);
  }
  const E = /* @__PURE__ */ new Set();
  for (const v of l.keys())
    d.has(v) && E.add(v);
  for (const v of E) l.delete(v);
  let w;
  const k = (v) => {
    w = w ? [Math.min(w[0], v[0]), Math.min(w[1], v[1]), Math.max(w[2], v[0]), Math.max(w[3], v[1])] : [v[0], v[1], v[0], v[1]];
  }, g = [];
  for (const v of c) {
    const x = o.triangles.get(v);
    if (!x) continue;
    const M = x.map((T) => {
      const O = o.vertices.get(T);
      return k(O.forw), O.ref;
    });
    g.push({ id: v, vertices: M });
  }
  for (const { forw: v } of d.values()) k(v);
  const m = [...o.bad].sort((v, x) => v - x), b = m.length !== r.length || m.some((v, x) => v !== r[x]);
  return {
    ok: !0,
    refreshed: y,
    patch: {
      strict_status: o.isStrict() ? "strict" : "strict_error",
      // 帯を差し替えたときだけ、重心と補助頂点の扇形の値を入れる
      ...y && i.centroid ? {
        centroid: { forw: [...i.centroid.forw], bakw: [...i.centroid.bakw] },
        verticesParams: i.verticesParams()
      } : {},
      ...d.size > 0 ? { movedVertices: [...d.values()] } : {},
      ...l.size > 0 ? { removedVertices: [...l.values()] } : {},
      ...S.length > 0 ? { addedVertices: S } : {},
      removedTriangles: [...a],
      addedTriangles: g,
      ...b ? { badTriangles: m } : {},
      ...w ? { dirtyBounds: w } : {}
    }
  };
}
const ws = 2.00704, vs = 3.00001, uo = 12, go = 4, bs = 1, ys = 4, po = 8, mo = 24;
function wo(i) {
  if (i.size === 0) return [];
  if (i.size >= 36) return [[...i].sort((e, n) => e - n)];
  const t = [];
  for (let e = 0; e < 36; e++) {
    if (!i.has(e) || i.has((e + 35) % 36)) continue;
    const n = [e];
    for (let s = (e + 1) % 36; i.has(s); s = (s + 1) % 36) n.push(s);
    t.push(n);
  }
  return t;
}
const xs = /* @__PURE__ */ Symbol("supplement pairs out of budget"), vo = 32, ks = 1e-6, bo = 24;
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
    super.setCompiled(e), Object.assign(this, { xy: s, wh: o }), delete this.kinks, this.pointsSet = void 0, this.pointIds = n.pointIds, this.edgeIds = n.edgeIds, this.supplementRecords = (e.supplementPairs ?? []).map((r) => ({
      ...r,
      edge: [...r.edge]
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
    const n = this.yaxisMode === rt.YAXIS_FOLLOW, s = lo(this.currentInputs(), t, n);
    let o = "noMesh";
    if (this.mesh) {
      const a = this.bounds ? this.boundsPolygon : void 0;
      if (a && !s.points.every((c) => en(c[0], a)))
        o = "unsupported";
      else {
        const c = ms(
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
    const r = this.editRevision + 1;
    return this.mesh = void 0, this.meshAhead = !1, this.points = s.points, this.edges = s.edges, this.edgeNodes = void 0, this.pointIds = s.pointIds, this.edgeIds = s.edgeIds, this.tins = void 0, this.indexedTins = void 0, this.editRevision = r, this.updateTin(), {
      revision: r,
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
      zs(t.worldFile), this.requestedWorldFile = { ...t.worldFile };
    }
    t.points && this.setPoints(t.points), t.edges && this.setEdges(t.edges);
  }
  /**
   * フォーマットバージョンを取得します
   */
  getFormatVersion() {
    return this.useV2Algorithm ? ws : vs;
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
    const r = [t[0]];
    for (let a = 1; a < t.length; a++) {
      const c = t[a];
      c[0] < e && (e = c[0]), c[0] > n && (n = c[0]), c[1] < s && (s = c[1]), c[1] > o && (o = c[1]), r.push(c);
    }
    r.push(t[0]), this.boundsPolygon = me([r]), this.xy = [e, s], this.wh = [n - e, o - s], this.vertexMode = rt.VERTEX_PLAIN, this.tins = void 0, this.indexedTins = void 0;
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
    if (t.version = this.useV2Algorithm ? ws : vs, t.points = this.points, t.weight_buffer = {}, this.compiledOuter?.outerTransform === "worldFile")
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
    const n = (y) => ({ ok: !1, reason: y });
    try {
      this.setCompiled(t);
    } catch (y) {
      if (y instanceof Error && /world file|V2/.test(y.message)) throw y;
      return this.tins = void 0, this.indexedTins = void 0, n("inconsistent");
    }
    if (!this.incremental) return n("disabled");
    const s = this.yaxisMode === rt.YAXIS_FOLLOW;
    if (e?.points && !(e.points.length === this.points.length && e.points.every(([d, S], E) => {
      const [w, k] = this.points[E];
      return d[0] === w[0] && d[1] === w[1] && S[0] === k[0] && (s ? -1 * S[1] : S[1]) === k[1];
    })) || e?.edges && JSON.stringify(kn(e.edges)) !== JSON.stringify(this.edges ?? []))
      return n("inputMismatch");
    const o = this.edgeNodes ?? [];
    let r;
    try {
      r = this.generatePointsSet().edges;
    } catch {
      return this.edgeNodes = o, n("inconsistent");
    }
    const a = this.edgeNodes ?? [];
    if (this.edgeNodes = o, !(a.length + this.supplementRecords.length === o.length && a.every((y, d) => y.every((S, E) => S[0] === o[d][E][0] && S[1] === o[d][E][1])))) return n("edgeNodes");
    const f = ds(t, r);
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
    const t = ms(this.mesh, [], this.yaxisMode === rt.YAXIS_FOLLOW, { vertexMode: this.vertexMode }, !0);
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
    const r = { ...n.toCompiled(), strict_status: "strict", meshOrigin: "incremental" }, a = new xn();
    try {
      a.setCompiled(JSON.parse(JSON.stringify(r)));
      let c = 0, f = 0;
      for (const [l, h] of r.points) {
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
    return e.boundaryFresh || e.failed.push("boundaryStale"), e.badTriangles > 0 && e.failed.push("badTriangles"), e.boundarySimple || e.failed.push("boundary"), e.missingRequiredEdges > 0 && e.failed.push("requiredEdge"), e.boundaryOnlyTriangles > 0 && e.failed.push("boundaryOnlyTriangles"), e.gcpRoundTrip.forward <= ks && e.gcpRoundTrip.backward <= ks || e.failed.push("gcpRoundTrip"), e.sweepKinks > 0 && e.failed.push("sweepKinks"), e.eligible = e.failed.length === 0, e.eligible && (e.compiled = r), e;
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
      (s) => cn(s)
    );
    this.tins.bakw = bt(t);
    const e = {};
    this.tins.forw.features.forEach((s, o) => {
      const r = this.tins.bakw.features[o];
      Ts(e, { forw: s, bakw: r });
    });
    const n = (this.pointsSet?.forw.features ?? []).map(
      (s) => s.properties.target.index
    );
    Oi(
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
      const o = this.points[s][0], r = this.points[s][1], a = Yt(o, r, s);
      t.forw.push(a), t.bakw.push(Wt(a));
    }
    const e = [];
    let n = 0;
    this.edgeNodes = [], this.edges || (this.edges = []);
    for (let s = 0; s < this.edges.length; s++) {
      const o = this.edges[s][2], r = Object.assign([], this.edges[s][0]), a = Object.assign([], this.edges[s][1]);
      if (yo(o, this.points.length, s), r.length === 0 && a.length === 0) {
        e.push(o);
        continue;
      }
      r.unshift(this.points[o[0]][0]), r.push(this.points[o[1]][0]), a.unshift(this.points[o[0]][1]), a.push(this.points[o[1]][1]), Cs(r, a).forEach((c, f, l) => {
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
    if (!this.points.reduce((c, f) => c && (o ? en(f[0], o) : f[0][0] >= t && f[0][0] <= e && f[0][1] >= n && f[0][1] <= s), !0))
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
    let s, o, r, a, c;
    if (e) {
      if (this.bounds) {
        const C = this.boundsPolygon;
        if (!C) throw new Error("Internal error: bounds is set but boundsPolygon is missing");
        if (!this.points.every(
          (N) => en(N[0], C)
        )) throw "SOME POINTS OUTSIDE";
      }
      s = this.generatePointsSet(), { minx: o, maxx: r, miny: a, maxy: c } = this.computeGcpBbox();
    } else {
      const C = this.validateAndPrepareInputs();
      s = C.pointsSet, o = C.minx, r = C.maxx, a = C.miny, c = C.maxy;
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
    const u = br(f.forw), p = Ln(f.forw);
    if (!p) throw "TOO LINEAR2";
    const y = {}, d = p.geometry.coordinates[0];
    let S;
    try {
      S = d.map((C) => ({
        forw: C,
        bakw: je(Zt(C), l)
      })), S.forEach((C) => {
        y[`${C.forw[0]}:${C.forw[1]}`] = C;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const E = Ln(f.bakw);
    if (!E) throw "TOO LINEAR2";
    const w = E.geometry.coordinates[0];
    try {
      S = w.map((C) => ({
        bakw: C,
        forw: je(Zt(C), h)
      })), S.forEach((C) => {
        y[`${C.forw[0]}:${C.forw[1]}`] = C;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const k = {
      forw: u.geometry.coordinates,
      bakw: je(u, l)
    }, g = Yt(k.forw, k.bakw, "c");
    this.centroid = {
      forw: g,
      bakw: Wt(g)
    };
    const m = [
      ...this.points.map((C) => ({ forw: C[0], bakw: C[1] })),
      ...(this.edgeNodes ?? []).map((C) => ({ forw: C[0], bakw: C[1] }))
    ], b = {
      convexBuf: y,
      centroid: k,
      allGcps: m,
      minx: o,
      maxx: r,
      miny: a,
      maxy: c
    }, v = t === rt.MODE_STRICT || t === rt.MODE_AUTO, x = (C, _, N) => {
      if (!v || this.isStrict() || !C.boundary) return { result: C };
      const A = () => ({
        build: this.captureBuild(),
        raw: [s.forw.slice(), s.bakw.slice()],
        gcps: m.slice(),
        edgeNodes: this.edgeNodes.slice(),
        supplementRecords: this.supplementRecords,
        supplementDiagnostics: this.lastSupplementDiagnostics
      }), F = (L) => {
        s.forw.splice(0, s.forw.length, ...L.raw[0]), s.bakw.splice(0, s.bakw.length, ...L.raw[1]), m.splice(0, m.length, ...L.gcps), this.edgeNodes.splice(0, this.edgeNodes.length, ...L.edgeNodes), this.restoreBuild(L.build), this.supplementRecords = L.supplementRecords, this.lastSupplementDiagnostics = L.supplementDiagnostics;
      }, P = A(), V = this.attemptTotal, I = () => this.attemptTotal - V, B = (L, q) => {
        const K = q.map(([Q]) => Q), H = q.map(([, Q]) => Q);
        return (L[0] === Math.min(...K) || L[0] === Math.max(...K)) && (L[1] === Math.min(...H) || L[1] === Math.max(...H));
      }, $ = (L) => {
        s.forw.splice(0, s.forw.length, ...P.raw[0]), s.bakw.splice(0, s.bakw.length, ...P.raw[1]), m.splice(0, m.length, ...P.gcps), this.edgeNodes.splice(0, this.edgeNodes.length, ...P.edgeNodes), this.supplementRecords = [];
        const q = N(L);
        return { built: q, strict: q.boundary !== void 0 && this.isStrict() };
      }, X = /* @__PURE__ */ new Set(), U = C.boundary.vertices.map(({ forw: L }) => L), Y = new Set(
        U.filter((L) => !B(L, U)).map((L) => ln(L, k.forw))
      );
      try {
        let L = C;
        for (let q = 0; q < go && !(I() + _ >= ys * _); q++) {
          const K = L.boundary.vertices.map(({ forw: W }) => W), H = X.size;
          for (const W of ei(this.tins.forw)) {
            if (B(W, K)) continue;
            const tt = ln(W, k.forw);
            for (let et = -bs; et <= bs; et++) X.add((tt + et + 36) % 36);
          }
          if (X.size === H || X.size >= mo) break;
          const Q = $({ skipBins: new Set(X) });
          if (!Q.built.boundary)
            return F(P), { result: C };
          if (Q.strict) {
            let W = { result: Q.built, state: A() };
            for (const tt of wo(X)) {
              if (!tt.some((R) => Y.has(R))) continue;
              if (I() >= po * _) break;
              const et = new Set([...X].filter((R) => !tt.includes(R))), lt = $({ skipBins: et });
              if (lt.strict) {
                for (const R of tt) X.delete(R);
                W = { result: lt.built, state: A() };
              }
            }
            return F(W.state), { result: W.result, kind: "thinned" };
          }
          L = Q.built;
        }
        if (I() < ys * _) {
          const q = $({ cornersOnly: !0 });
          if (q.strict) return { result: q.built, kind: "corners" };
        }
      } catch {
      }
      return F(P), { result: C };
    };
    if (n) {
      this.stateTriangle = void 0;
      const C = this.yaxisMode === rt.YAXIS_FOLLOW, _ = C ? 1 : -1, N = (B) => this.buildWithSupplements(t, s, m, ($, X, U) => (Y) => ({ boundary: Un(
        B ? { ...b, ring: B } : b,
        (L) => Zr(L, (q) => {
          const [K, H] = Ys(n, q);
          return [K, C ? -H : H];
        }),
        s,
        this.points.length,
        {
          orientation: _,
          accept: (L) => L.hasMapBoundary ? (this.buildTin(s, L.vertices, X, L, Y.size > 0, U), (this.strict_status !== rt.STATUS_LOOSE || L.hasBoundary) && Re(this.tins.forw, _) === 0 && Re(this.tins.bakw, _) === 0) : !1
        },
        Y,
        $
      ) })), A = this.attemptTotal, F = N(), P = this.attemptTotal - A, { result: { boundary: V }, kind: I } = x(F, P, N);
      if (V) {
        this.compiledOuter = {
          outerTransform: "worldFile",
          worldFile: n,
          vertices_points: V.vertices.map(({ forw: Y, bakw: L }) => [Y, L])
        };
        const { centroid: B, xy: $, wh: X, kinks: U } = this;
        super.setCompiled(this.getCompiled()), Object.assign(this, { centroid: B, xy: $, wh: X, kinks: U }), this.lastBoundaryDiagnostics = {
          ...V.diagnostics,
          ...I ? { ringRescue: I } : {},
          requestedOuterTransform: "worldFile",
          outerTransform: "worldFile"
        };
        return;
      }
      this.compiledOuter = { outerTransform: "extrapolate" }, this.outerTransform = "extrapolate", this.worldFile = void 0;
    }
    const M = this.vertexMode === rt.VERTEX_BIRDEYE ? As : Is;
    let T, O, D;
    if (e) {
      const C = this.incrementalRebuild && !this.localRebuildDisabled && v && !n, _ = {
        fullAttempts: 0,
        localAttempts: 0,
        localFailures: 0,
        localMs: 0,
        adoptedLocal: !1,
        fellBack: this.localRebuildDisabled
      };
      this.lastRebuildDiagnostics = this.incrementalRebuild ? _ : void 0;
      let N;
      const A = s.forw.length, F = ($, X, U) => {
        const Y = $ ? { ...b, ring: $ } : b, L = r - o, q = c - a, K = te(s.forw.map(({ geometry: R }) => R.coordinates)), H = K.filter((R) => !X.has(le(R))), Q = s.forw.slice(A).map((R) => ({
          index: R.properties.target.index,
          forw: R.geometry.coordinates,
          bakw: R.properties.target.geom
        }));
        let W;
        for (const R of pn) {
          const z = U.get(R) ?? { forwReuse: {} };
          U.set(R, z);
          const G = z.vertices ?? (z.vertices = M({
            ...Y,
            minx: o - R * L,
            maxx: r + R * L,
            miny: a - R * q,
            maxy: c + R * q
          }, !0));
          if (!oe(G.map((Ut) => Ut.forw), k.forw, -1) || !oe(G.map((Ut) => Ut.bakw), k.bakw, 1)) continue;
          const st = Li(N), at = Bs(st, { vertices: G, addPoints: Q, hull: H, forwOnly: !0 });
          if (!at.ok) continue;
          st.mesh.repairBad(), st.mesh.bad.size > 0 && st.mesh.bad.size <= vo && st.mesh.healBad();
          const wt = zi(st);
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
        const et = Ge(Xi(W.build));
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
      }, P = ($) => this.buildWithSupplements(t, s, m, (X, U, Y) => (L) => {
        if (N) {
          const Q = performance.now(), W = F($, L, X);
          if (_.localMs += performance.now() - Q, W)
            return _.localAttempts++, W;
          _.localFailures++;
        }
        _.fullAttempts++;
        const q = $ ? { ...b, ring: $ } : b, K = Un(
          q,
          M,
          s,
          this.points.length,
          void 0,
          L,
          X
        );
        return C && !N && !$ && !Y && L.size === 0 && s.forw.length === A && K?.hasBoundary && (N = $i(
          [...s.forw, ...K.vertices.map(({ forw: Q, bakw: W }, tt) => Yt(Q, W, `b${tt}`))],
          K.forw,
          s.edges,
          this.points.length,
          -1
        )), {
          boundary: K,
          verticesList: this.buildTin(
            s,
            K?.vertices ?? M(q, !1),
            U,
            K,
            L.size > 0,
            Y
          )
        };
      }), V = this.attemptTotal, I = P(), B = x(I, this.attemptTotal - V, P);
      if ({ boundary: T, verticesList: O } = B.result, D = B.kind, this.localTins.has(this.tins) && (_.adoptedLocal = !0, this.tins.bakw = bt(this.tins.forw.features.map((X) => cn(X))), !["forw", "bakw"].every(
        (X) => Fe(
          this.tins[X].features.map((U) => U.geometry.coordinates[0]),
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
        M(b, !1),
        t,
        void 0
      );
    this.vertices_params = {
      forw: Yn(O.forw, this.centroid.forw),
      bakw: Yn(O.bakw, this.centroid.bakw)
    }, this.addIndexedTin(), this.pointsWeightBuffer = {}, this.lastBoundaryDiagnostics = T && D ? { ...T.diagnostics, ringRescue: D } : T?.diagnostics, n && this.lastBoundaryDiagnostics && (this.lastBoundaryDiagnostics = {
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
    const r = (b, v, x) => {
      const M = s(b, v, x);
      return (T) => (o++, this.attemptTotal++, M(T));
    }, a = (b) => this.buildWithHull(b, r(/* @__PURE__ */ new Map(), b, !1));
    if (!this.useSupplementPairs || this.useV2Algorithm || t === rt.MODE_LOOSE) return a(t);
    const c = t, f = a(c), l = o;
    let h = 0;
    if (!f.boundary || this.strict_status !== rt.STATUS_STRICT) return f;
    const u = an(this.tins.forw, this.pointsSet.forw.features, f.boundary.forwHull.all);
    if (u.dropped.length === 0) return f;
    const p = this.edgeNodes.length, y = e.forw.length, d = n.length;
    let S = [], E;
    const w = (b, v) => b.length === v.length && b.every((x, M) => x.every((T, O) => T[0] === v[M][O][0] && T[1] === v[M][O][1])), k = (b) => {
      e.forw.length = y, e.bakw.length = y, n.length = d, this.edgeNodes.length = p;
      for (const [v, x] of b) {
        const M = Yt(v, x, `e${this.edgeNodes.length}`);
        this.edgeNodes.push([v, x]), e.forw.push(M), e.bakw.push(Wt(M)), n.push({ forw: v, bakw: x });
      }
      S = b;
    }, m = Ji({
      edgeBase: p,
      baseCost: l,
      buildCost: () => h,
      snapshot: () => ({ pairs: S, state: this.captureBuild() }),
      restore: ({ pairs: b, state: v }) => {
        k(b), this.restoreBuild(v);
      },
      measure: (b) => {
        k(b);
        const v = this.captureBuild();
        try {
          const x = /* @__PURE__ */ new Map();
          E = { pairs: b, cache: x };
          const { boundary: M } = s(x, rt.MODE_STRICT, !0)(/* @__PURE__ */ new Set());
          return M ? an(this.tins.forw, this.pointsSet.forw.features, []) : void 0;
        } finally {
          this.restoreBuild(v);
        }
      },
      build: (b, v) => {
        k(b);
        const x = E && w(E.pairs, b) ? E.cache : /* @__PURE__ */ new Map(), M = o;
        let T;
        try {
          T = this.buildWithHull(c, (O) => {
            if (o - M >= v) throw xs;
            return r(x, c, !1)(O);
          });
        } catch (O) {
          if (O !== xs) throw O;
          h += o - M;
          return;
        }
        if (h += o - M, !(!T.boundary || this.strict_status !== rt.STATUS_STRICT))
          return {
            result: T,
            analysis: an(this.tins.forw, this.pointsSet.forw.features, T.boundary.forwHull.all)
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
    const o = (d) => [...d].sort().join(","), r = (d, S = !1) => {
      const E = o(d), w = n.get(E);
      if (w) return w;
      const k = e(d), g = {
        value: k,
        strict: k.boundary !== void 0 && this.strict_status === rt.STATUS_STRICT
      };
      return (g.strict || S) && (g.state = this.captureBuild()), n.set(E, g), s = g, g;
    }, a = (d) => (s !== d && this.restoreBuild(d.state), s = d, d.value), c = r(/* @__PURE__ */ new Set(), !0);
    if (!(t === rt.MODE_STRICT || t === rt.MODE_AUTO) || !c.value.boundary || c.strict) return c.value;
    const l = new Set(c.value.boundary.forwHull.all.map(le)), h = () => this.pointsSet.forw.features.map(
      (d) => d.properties.target.index
    ), u = /* @__PURE__ */ new Set();
    let p = c, y;
    for (let d = 0; d < uo; d++) {
      const S = Pi(
        this.tins.forw,
        p.value.boundary.forwHull.applied,
        h()
      ).filter((E) => !u.has(le(E)));
      if (S.length === 0) break;
      for (const E of S) u.add(le(E));
      if (p = r(u), !p.value.boundary) break;
      if (p.strict) {
        y = p;
        break;
      }
    }
    if (y) {
      let d = y;
      for (const S of [...u].slice(0, bo)) {
        const E = new Set(u);
        E.delete(S);
        const w = r(E);
        w.strict && (u.delete(S), d = w);
      }
      return a(d);
    }
    if (u.size < l.size) {
      const d = r(l);
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
  buildTin(t, e, n, s, o = !1, r = !1) {
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
      forw: Ge(
        s?.forw ?? _e(this.pointsSet.forw, t.edges, "target")
      )
    }, (n === rt.MODE_STRICT || n === rt.MODE_AUTO) && (r ? this.resolveStrictOverlaps() : this.calculateStrictTin(
      n === rt.MODE_AUTO || o ? 1 : Hn
    )), (n === rt.MODE_LOOSE || n === rt.MODE_AUTO && this.strict_status === rt.STATUS_ERROR) && (this.tins.bakw = Ge(
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
function yo(i, t, e) {
  const n = (s) => Number.isInteger(s) && s >= 0 && s < t;
  if (!Array.isArray(i) || !n(i[0]) || !n(i[1]))
    throw new Error(
      `Invalid edge at edges[${e}]: start/end ${JSON.stringify(i)} must be integer indices of points (0 to ${t - 1})`
    );
}
export {
  ie as BOUNDARY_GROUP,
  Tt as EDGE_HULL,
  ss as EDGE_PROTECT,
  Dt as EDGE_REQUIRED,
  Xe as IncrementalMesh,
  eo as MeshModel,
  rt as Tin,
  _e as constrainedTin,
  Wt as counterPoint,
  Yt as createPoint,
  rt as default,
  ko as findIntersections,
  ws as format_version,
  oo as insertEdge,
  ro as insertPoint,
  Ts as insertSearchIndex,
  ds as meshFromCompiled,
  so as movePoint,
  ao as removeEdge,
  io as removePoint,
  co as replaceEdgeNodes,
  Yn as vertexCalc
};
