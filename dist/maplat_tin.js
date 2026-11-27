import { counterTri as an, Transform as Cs, validateWorldFile as Vs, normalizeEdges as $s, transformArr as qe, rotateVerticesTriangle as je, worldFileToCrs as Ls } from "@maplat/transform";
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
  if (!kn(r[0]) || !kn(r[1]))
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
function xn(r, t, e = {}) {
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
function kn(r) {
  return !isNaN(r) && r !== null && !Array.isArray(r);
}
function Xs(r) {
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
function zs(r) {
  return r.type === "Feature" ? r.geometry : r;
}
function dn(r, t, e) {
  if (r !== null)
    for (var n, s, o, i, a, c, f, l = 0, h = 0, u, m = r.type, b = m === "FeatureCollection", g = m === "Feature", k = b ? r.features.length : 1, M = 0; M < k; M++) {
      f = b ? (
        // @ts-expect-error: Known type conflict
        r.features[M].geometry
      ) : g ? (
        // @ts-expect-error: Known type conflict
        r.geometry
      ) : r, u = f ? f.type === "GeometryCollection" : !1, a = u ? f.geometries.length : 1;
      for (var v = 0; v < a; v++) {
        var x = 0, p = 0;
        if (i = u ? f.geometries[v] : f, i !== null) {
          c = i.coordinates;
          var w = i.type;
          switch (l = e && (w === "Polygon" || w === "MultiPolygon") ? 1 : 0, w) {
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
                h++, w === "MultiPoint" && x++;
              }
              w === "LineString" && x++;
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
                w === "MultiLineString" && x++, w === "Polygon" && p++;
              }
              w === "Polygon" && x++;
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
                  dn(i.geometries[n], t, e) === !1
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
const xt = 11102230246251565e-32, J = 134217729, vs = (3 + 8 * xt) * xt;
function vt(r, t, e, n, s) {
  let o, i, a, c, f = t[0], l = n[0], h = 0, u = 0;
  l > f == l > -f ? (o = f, f = t[++h]) : (o = l, l = n[++u]);
  let m = 0;
  if (h < r && u < e)
    for (l > f == l > -f ? (i = f + o, a = o - (i - f), f = t[++h]) : (i = l + o, a = o - (i - l), l = n[++u]), o = i, a !== 0 && (s[m++] = a); h < r && u < e; )
      l > f == l > -f ? (i = o + f, c = i - o, a = o - (i - c) + (f - c), f = t[++h]) : (i = o + l, c = i - o, a = o - (i - c) + (l - c), l = n[++u]), o = i, a !== 0 && (s[m++] = a);
  for (; h < r; )
    i = o + f, c = i - o, a = o - (i - c) + (f - c), f = t[++h], o = i, a !== 0 && (s[m++] = a);
  for (; u < e; )
    i = o + l, c = i - o, a = o - (i - c) + (l - c), l = n[++u], o = i, a !== 0 && (s[m++] = a);
  return (o !== 0 || m === 0) && (s[m++] = o), m;
}
function Nt(r, t, e, n, s, o, i, a) {
  return vt(vt(r, t, e, n, i), i, s, o, a);
}
function j(r, t, e, n) {
  let s, o, i, a, c, f, l, h, u, m, b;
  l = J * e, m = l - (l - e), b = e - m;
  let g = t[0];
  s = g * e, l = J * g, h = l - (l - g), u = g - h, i = u * b - (s - h * m - u * m - h * b);
  let k = 0;
  i !== 0 && (n[k++] = i);
  for (let M = 1; M < r; M++)
    g = t[M], a = g * e, l = J * g, h = l - (l - g), u = g - h, c = u * b - (a - h * m - u * m - h * b), o = s + c, f = o - s, i = s - (o - f) + (c - f), i !== 0 && (n[k++] = i), s = a + o, i = o - (s - a), i !== 0 && (n[k++] = i);
  return (s !== 0 || k === 0) && (n[k++] = s), k;
}
function bs(r, t) {
  let e = t[0];
  for (let n = 1; n < r; n++) e += t[n];
  return e;
}
function ot(r) {
  return new Float64Array(r);
}
const Ys = (3 + 16 * xt) * xt, Us = (2 + 12 * xt) * xt, qs = (9 + 64 * xt) * xt * xt, ee = ot(4), Sn = ot(8), Mn = ot(12), En = ot(16), kt = ot(4);
function js(r, t, e, n, s, o, i) {
  let a, c, f, l, h, u, m, b, g, k, M, v, x, p, w, d, y, S;
  const _ = r - s, O = e - s, B = t - o, D = n - o;
  p = _ * D, u = J * _, m = u - (u - _), b = _ - m, u = J * D, g = u - (u - D), k = D - g, w = b * k - (p - m * g - b * g - m * k), d = B * O, u = J * B, m = u - (u - B), b = B - m, u = J * O, g = u - (u - O), k = O - g, y = b * k - (d - m * g - b * g - m * k), M = w - y, h = w - M, ee[0] = w - (M + h) + (h - y), v = p + M, h = v - p, x = p - (v - h) + (M - h), M = x - d, h = x - M, ee[1] = x - (M + h) + (h - d), S = v + M, h = S - v, ee[2] = v - (S - h) + (M - h), ee[3] = S;
  let C = bs(4, ee), E = Us * i;
  if (C >= E || -C >= E || (h = r - _, a = r - (_ + h) + (h - s), h = e - O, f = e - (O + h) + (h - s), h = t - B, c = t - (B + h) + (h - o), h = n - D, l = n - (D + h) + (h - o), a === 0 && c === 0 && f === 0 && l === 0) || (E = qs * i + vs * Math.abs(C), C += _ * l + D * a - (B * f + O * c), C >= E || -C >= E)) return C;
  p = a * D, u = J * a, m = u - (u - a), b = a - m, u = J * D, g = u - (u - D), k = D - g, w = b * k - (p - m * g - b * g - m * k), d = c * O, u = J * c, m = u - (u - c), b = c - m, u = J * O, g = u - (u - O), k = O - g, y = b * k - (d - m * g - b * g - m * k), M = w - y, h = w - M, kt[0] = w - (M + h) + (h - y), v = p + M, h = v - p, x = p - (v - h) + (M - h), M = x - d, h = x - M, kt[1] = x - (M + h) + (h - d), S = v + M, h = S - v, kt[2] = v - (S - h) + (M - h), kt[3] = S;
  const N = vt(4, ee, 4, kt, Sn);
  p = _ * l, u = J * _, m = u - (u - _), b = _ - m, u = J * l, g = u - (u - l), k = l - g, w = b * k - (p - m * g - b * g - m * k), d = B * f, u = J * B, m = u - (u - B), b = B - m, u = J * f, g = u - (u - f), k = f - g, y = b * k - (d - m * g - b * g - m * k), M = w - y, h = w - M, kt[0] = w - (M + h) + (h - y), v = p + M, h = v - p, x = p - (v - h) + (M - h), M = x - d, h = x - M, kt[1] = x - (M + h) + (h - d), S = v + M, h = S - v, kt[2] = v - (S - h) + (M - h), kt[3] = S;
  const I = vt(N, Sn, 4, kt, Mn);
  p = a * l, u = J * a, m = u - (u - a), b = a - m, u = J * l, g = u - (u - l), k = l - g, w = b * k - (p - m * g - b * g - m * k), d = c * f, u = J * c, m = u - (u - c), b = c - m, u = J * f, g = u - (u - f), k = f - g, y = b * k - (d - m * g - b * g - m * k), M = w - y, h = w - M, kt[0] = w - (M + h) + (h - y), v = p + M, h = v - p, x = p - (v - h) + (M - h), M = x - d, h = x - M, kt[1] = x - (M + h) + (h - d), S = v + M, h = S - v, kt[2] = v - (S - h) + (M - h), kt[3] = S;
  const F = vt(I, Mn, 4, kt, En);
  return En[F - 1];
}
function ft(r, t, e, n, s, o) {
  const i = (t - o) * (e - s), a = (r - s) * (n - o), c = i - a, f = Math.abs(i + a);
  return Math.abs(c) >= Ys * f ? c : -js(r, t, e, n, s, o, f);
}
const Gs = (10 + 96 * xt) * xt, Ws = (4 + 48 * xt) * xt, Ks = (44 + 576 * xt) * xt * xt, Vt = ot(4), $t = ot(4), Lt = ot(4), Ft = ot(4), Tt = ot(4), Rt = ot(4), St = ot(4), Mt = ot(4), Ge = ot(8), We = ot(8), Ke = ot(8), He = ot(8), Je = ot(8), Qe = ot(8), ve = ot(8), be = ot(8), ye = ot(8), jt = ot(4), Gt = ot(4), Wt = ot(4), Z = ot(8), nt = ot(16), ht = ot(16), ut = ot(16), ct = ot(32), Xt = ot(32), pt = ot(48), _t = ot(64);
let re = ot(1152), Ze = ot(1152);
function mt(r, t, e) {
  r = vt(r, re, t, e, Ze);
  const n = re;
  return re = Ze, Ze = n, r;
}
function Hs(r, t, e, n, s, o, i, a, c) {
  let f, l, h, u, m, b, g, k, M, v, x, p, w, d, y, S, _, O, B, D, C, E, N, I, F, P, V, A, T, $, X, q, Y, L, U;
  const W = r - i, H = e - i, Q = s - i, K = t - a, tt = n - a, et = o - a;
  X = H * et, N = J * H, I = N - (N - H), F = H - I, N = J * et, P = N - (N - et), V = et - P, q = F * V - (X - I * P - F * P - I * V), Y = Q * tt, N = J * Q, I = N - (N - Q), F = Q - I, N = J * tt, P = N - (N - tt), V = tt - P, L = F * V - (Y - I * P - F * P - I * V), A = q - L, E = q - A, Vt[0] = q - (A + E) + (E - L), T = X + A, E = T - X, $ = X - (T - E) + (A - E), A = $ - Y, E = $ - A, Vt[1] = $ - (A + E) + (E - Y), U = T + A, E = U - T, Vt[2] = T - (U - E) + (A - E), Vt[3] = U, X = Q * K, N = J * Q, I = N - (N - Q), F = Q - I, N = J * K, P = N - (N - K), V = K - P, q = F * V - (X - I * P - F * P - I * V), Y = W * et, N = J * W, I = N - (N - W), F = W - I, N = J * et, P = N - (N - et), V = et - P, L = F * V - (Y - I * P - F * P - I * V), A = q - L, E = q - A, $t[0] = q - (A + E) + (E - L), T = X + A, E = T - X, $ = X - (T - E) + (A - E), A = $ - Y, E = $ - A, $t[1] = $ - (A + E) + (E - Y), U = T + A, E = U - T, $t[2] = T - (U - E) + (A - E), $t[3] = U, X = W * tt, N = J * W, I = N - (N - W), F = W - I, N = J * tt, P = N - (N - tt), V = tt - P, q = F * V - (X - I * P - F * P - I * V), Y = H * K, N = J * H, I = N - (N - H), F = H - I, N = J * K, P = N - (N - K), V = K - P, L = F * V - (Y - I * P - F * P - I * V), A = q - L, E = q - A, Lt[0] = q - (A + E) + (E - L), T = X + A, E = T - X, $ = X - (T - E) + (A - E), A = $ - Y, E = $ - A, Lt[1] = $ - (A + E) + (E - Y), U = T + A, E = U - T, Lt[2] = T - (U - E) + (A - E), Lt[3] = U, f = vt(
    vt(
      vt(
        j(j(4, Vt, W, Z), Z, W, nt),
        nt,
        j(j(4, Vt, K, Z), Z, K, ht),
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
  let lt = bs(f, re), R = Ws * c;
  if (lt >= R || -lt >= R || (E = r - W, l = r - (W + E) + (E - i), E = t - K, m = t - (K + E) + (E - a), E = e - H, h = e - (H + E) + (E - i), E = n - tt, b = n - (tt + E) + (E - a), E = s - Q, u = s - (Q + E) + (E - i), E = o - et, g = o - (et + E) + (E - a), l === 0 && h === 0 && u === 0 && m === 0 && b === 0 && g === 0) || (R = Ks * c + vs * Math.abs(lt), lt += (W * W + K * K) * (H * g + et * h - (tt * u + Q * b)) + 2 * (W * l + K * m) * (H * et - tt * Q) + ((H * H + tt * tt) * (Q * m + K * u - (et * l + W * g)) + 2 * (H * h + tt * b) * (Q * K - et * W)) + ((Q * Q + et * et) * (W * b + tt * l - (K * h + H * m)) + 2 * (Q * u + et * g) * (W * tt - K * H)), lt >= R || -lt >= R))
    return lt;
  if ((h !== 0 || b !== 0 || u !== 0 || g !== 0) && (X = W * W, N = J * W, I = N - (N - W), F = W - I, q = F * F - (X - I * I - (I + I) * F), Y = K * K, N = J * K, I = N - (N - K), F = K - I, L = F * F - (Y - I * I - (I + I) * F), A = q + L, E = A - q, Ft[0] = q - (A - E) + (L - E), T = X + A, E = T - X, $ = X - (T - E) + (A - E), A = $ + Y, E = A - $, Ft[1] = $ - (A - E) + (Y - E), U = T + A, E = U - T, Ft[2] = T - (U - E) + (A - E), Ft[3] = U), (u !== 0 || g !== 0 || l !== 0 || m !== 0) && (X = H * H, N = J * H, I = N - (N - H), F = H - I, q = F * F - (X - I * I - (I + I) * F), Y = tt * tt, N = J * tt, I = N - (N - tt), F = tt - I, L = F * F - (Y - I * I - (I + I) * F), A = q + L, E = A - q, Tt[0] = q - (A - E) + (L - E), T = X + A, E = T - X, $ = X - (T - E) + (A - E), A = $ + Y, E = A - $, Tt[1] = $ - (A - E) + (Y - E), U = T + A, E = U - T, Tt[2] = T - (U - E) + (A - E), Tt[3] = U), (l !== 0 || m !== 0 || h !== 0 || b !== 0) && (X = Q * Q, N = J * Q, I = N - (N - Q), F = Q - I, q = F * F - (X - I * I - (I + I) * F), Y = et * et, N = J * et, I = N - (N - et), F = et - I, L = F * F - (Y - I * I - (I + I) * F), A = q + L, E = A - q, Rt[0] = q - (A - E) + (L - E), T = X + A, E = T - X, $ = X - (T - E) + (A - E), A = $ + Y, E = A - $, Rt[1] = $ - (A - E) + (Y - E), U = T + A, E = U - T, Rt[2] = T - (U - E) + (A - E), Rt[3] = U), l !== 0 && (k = j(4, Vt, l, Ge), f = mt(f, Nt(
    j(k, Ge, 2 * W, nt),
    nt,
    j(j(4, Rt, l, Z), Z, tt, ht),
    ht,
    j(j(4, Tt, l, Z), Z, -et, ut),
    ut,
    ct,
    pt
  ), pt)), m !== 0 && (M = j(4, Vt, m, We), f = mt(f, Nt(
    j(M, We, 2 * K, nt),
    nt,
    j(j(4, Tt, m, Z), Z, Q, ht),
    ht,
    j(j(4, Rt, m, Z), Z, -H, ut),
    ut,
    ct,
    pt
  ), pt)), h !== 0 && (v = j(4, $t, h, Ke), f = mt(f, Nt(
    j(v, Ke, 2 * H, nt),
    nt,
    j(j(4, Ft, h, Z), Z, et, ht),
    ht,
    j(j(4, Rt, h, Z), Z, -K, ut),
    ut,
    ct,
    pt
  ), pt)), b !== 0 && (x = j(4, $t, b, He), f = mt(f, Nt(
    j(x, He, 2 * tt, nt),
    nt,
    j(j(4, Rt, b, Z), Z, W, ht),
    ht,
    j(j(4, Ft, b, Z), Z, -Q, ut),
    ut,
    ct,
    pt
  ), pt)), u !== 0 && (p = j(4, Lt, u, Je), f = mt(f, Nt(
    j(p, Je, 2 * Q, nt),
    nt,
    j(j(4, Tt, u, Z), Z, K, ht),
    ht,
    j(j(4, Ft, u, Z), Z, -tt, ut),
    ut,
    ct,
    pt
  ), pt)), g !== 0 && (w = j(4, Lt, g, Qe), f = mt(f, Nt(
    j(w, Qe, 2 * et, nt),
    nt,
    j(j(4, Ft, g, Z), Z, H, ht),
    ht,
    j(j(4, Tt, g, Z), Z, -W, ut),
    ut,
    ct,
    pt
  ), pt)), l !== 0 || m !== 0) {
    if (h !== 0 || b !== 0 || u !== 0 || g !== 0 ? (X = h * et, N = J * h, I = N - (N - h), F = h - I, N = J * et, P = N - (N - et), V = et - P, q = F * V - (X - I * P - F * P - I * V), Y = H * g, N = J * H, I = N - (N - H), F = H - I, N = J * g, P = N - (N - g), V = g - P, L = F * V - (Y - I * P - F * P - I * V), A = q + L, E = A - q, St[0] = q - (A - E) + (L - E), T = X + A, E = T - X, $ = X - (T - E) + (A - E), A = $ + Y, E = A - $, St[1] = $ - (A - E) + (Y - E), U = T + A, E = U - T, St[2] = T - (U - E) + (A - E), St[3] = U, X = u * -tt, N = J * u, I = N - (N - u), F = u - I, N = J * -tt, P = N - (N - -tt), V = -tt - P, q = F * V - (X - I * P - F * P - I * V), Y = Q * -b, N = J * Q, I = N - (N - Q), F = Q - I, N = J * -b, P = N - (N - -b), V = -b - P, L = F * V - (Y - I * P - F * P - I * V), A = q + L, E = A - q, Mt[0] = q - (A - E) + (L - E), T = X + A, E = T - X, $ = X - (T - E) + (A - E), A = $ + Y, E = A - $, Mt[1] = $ - (A - E) + (Y - E), U = T + A, E = U - T, Mt[2] = T - (U - E) + (A - E), Mt[3] = U, y = vt(4, St, 4, Mt, be), X = h * g, N = J * h, I = N - (N - h), F = h - I, N = J * g, P = N - (N - g), V = g - P, q = F * V - (X - I * P - F * P - I * V), Y = u * b, N = J * u, I = N - (N - u), F = u - I, N = J * b, P = N - (N - b), V = b - P, L = F * V - (Y - I * P - F * P - I * V), A = q - L, E = q - A, Gt[0] = q - (A + E) + (E - L), T = X + A, E = T - X, $ = X - (T - E) + (A - E), A = $ - Y, E = $ - A, Gt[1] = $ - (A + E) + (E - Y), U = T + A, E = U - T, Gt[2] = T - (U - E) + (A - E), Gt[3] = U, O = 4) : (be[0] = 0, y = 1, Gt[0] = 0, O = 1), l !== 0) {
      const z = j(y, be, l, ut);
      f = mt(f, vt(
        j(k, Ge, l, nt),
        nt,
        j(z, ut, 2 * W, ct),
        ct,
        pt
      ), pt);
      const G = j(O, Gt, l, Z);
      f = mt(f, Nt(
        j(G, Z, 2 * W, nt),
        nt,
        j(G, Z, l, ht),
        ht,
        j(z, ut, l, ct),
        ct,
        Xt,
        _t
      ), _t), b !== 0 && (f = mt(f, j(j(4, Rt, l, Z), Z, b, nt), nt)), g !== 0 && (f = mt(f, j(j(4, Tt, -l, Z), Z, g, nt), nt));
    }
    if (m !== 0) {
      const z = j(y, be, m, ut);
      f = mt(f, vt(
        j(M, We, m, nt),
        nt,
        j(z, ut, 2 * K, ct),
        ct,
        pt
      ), pt);
      const G = j(O, Gt, m, Z);
      f = mt(f, Nt(
        j(G, Z, 2 * K, nt),
        nt,
        j(G, Z, m, ht),
        ht,
        j(z, ut, m, ct),
        ct,
        Xt,
        _t
      ), _t);
    }
  }
  if (h !== 0 || b !== 0) {
    if (u !== 0 || g !== 0 || l !== 0 || m !== 0 ? (X = u * K, N = J * u, I = N - (N - u), F = u - I, N = J * K, P = N - (N - K), V = K - P, q = F * V - (X - I * P - F * P - I * V), Y = Q * m, N = J * Q, I = N - (N - Q), F = Q - I, N = J * m, P = N - (N - m), V = m - P, L = F * V - (Y - I * P - F * P - I * V), A = q + L, E = A - q, St[0] = q - (A - E) + (L - E), T = X + A, E = T - X, $ = X - (T - E) + (A - E), A = $ + Y, E = A - $, St[1] = $ - (A - E) + (Y - E), U = T + A, E = U - T, St[2] = T - (U - E) + (A - E), St[3] = U, D = -et, C = -g, X = l * D, N = J * l, I = N - (N - l), F = l - I, N = J * D, P = N - (N - D), V = D - P, q = F * V - (X - I * P - F * P - I * V), Y = W * C, N = J * W, I = N - (N - W), F = W - I, N = J * C, P = N - (N - C), V = C - P, L = F * V - (Y - I * P - F * P - I * V), A = q + L, E = A - q, Mt[0] = q - (A - E) + (L - E), T = X + A, E = T - X, $ = X - (T - E) + (A - E), A = $ + Y, E = A - $, Mt[1] = $ - (A - E) + (Y - E), U = T + A, E = U - T, Mt[2] = T - (U - E) + (A - E), Mt[3] = U, S = vt(4, St, 4, Mt, ye), X = u * m, N = J * u, I = N - (N - u), F = u - I, N = J * m, P = N - (N - m), V = m - P, q = F * V - (X - I * P - F * P - I * V), Y = l * g, N = J * l, I = N - (N - l), F = l - I, N = J * g, P = N - (N - g), V = g - P, L = F * V - (Y - I * P - F * P - I * V), A = q - L, E = q - A, Wt[0] = q - (A + E) + (E - L), T = X + A, E = T - X, $ = X - (T - E) + (A - E), A = $ - Y, E = $ - A, Wt[1] = $ - (A + E) + (E - Y), U = T + A, E = U - T, Wt[2] = T - (U - E) + (A - E), Wt[3] = U, B = 4) : (ye[0] = 0, S = 1, Wt[0] = 0, B = 1), h !== 0) {
      const z = j(S, ye, h, ut);
      f = mt(f, vt(
        j(v, Ke, h, nt),
        nt,
        j(z, ut, 2 * H, ct),
        ct,
        pt
      ), pt);
      const G = j(B, Wt, h, Z);
      f = mt(f, Nt(
        j(G, Z, 2 * H, nt),
        nt,
        j(G, Z, h, ht),
        ht,
        j(z, ut, h, ct),
        ct,
        Xt,
        _t
      ), _t), g !== 0 && (f = mt(f, j(j(4, Ft, h, Z), Z, g, nt), nt)), m !== 0 && (f = mt(f, j(j(4, Rt, -h, Z), Z, m, nt), nt));
    }
    if (b !== 0) {
      const z = j(S, ye, b, ut);
      f = mt(f, vt(
        j(x, He, b, nt),
        nt,
        j(z, ut, 2 * tt, ct),
        ct,
        pt
      ), pt);
      const G = j(B, Wt, b, Z);
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
  if (u !== 0 || g !== 0) {
    if (l !== 0 || m !== 0 || h !== 0 || b !== 0 ? (X = l * tt, N = J * l, I = N - (N - l), F = l - I, N = J * tt, P = N - (N - tt), V = tt - P, q = F * V - (X - I * P - F * P - I * V), Y = W * b, N = J * W, I = N - (N - W), F = W - I, N = J * b, P = N - (N - b), V = b - P, L = F * V - (Y - I * P - F * P - I * V), A = q + L, E = A - q, St[0] = q - (A - E) + (L - E), T = X + A, E = T - X, $ = X - (T - E) + (A - E), A = $ + Y, E = A - $, St[1] = $ - (A - E) + (Y - E), U = T + A, E = U - T, St[2] = T - (U - E) + (A - E), St[3] = U, D = -K, C = -m, X = h * D, N = J * h, I = N - (N - h), F = h - I, N = J * D, P = N - (N - D), V = D - P, q = F * V - (X - I * P - F * P - I * V), Y = H * C, N = J * H, I = N - (N - H), F = H - I, N = J * C, P = N - (N - C), V = C - P, L = F * V - (Y - I * P - F * P - I * V), A = q + L, E = A - q, Mt[0] = q - (A - E) + (L - E), T = X + A, E = T - X, $ = X - (T - E) + (A - E), A = $ + Y, E = A - $, Mt[1] = $ - (A - E) + (Y - E), U = T + A, E = U - T, Mt[2] = T - (U - E) + (A - E), Mt[3] = U, d = vt(4, St, 4, Mt, ve), X = l * b, N = J * l, I = N - (N - l), F = l - I, N = J * b, P = N - (N - b), V = b - P, q = F * V - (X - I * P - F * P - I * V), Y = h * m, N = J * h, I = N - (N - h), F = h - I, N = J * m, P = N - (N - m), V = m - P, L = F * V - (Y - I * P - F * P - I * V), A = q - L, E = q - A, jt[0] = q - (A + E) + (E - L), T = X + A, E = T - X, $ = X - (T - E) + (A - E), A = $ - Y, E = $ - A, jt[1] = $ - (A + E) + (E - Y), U = T + A, E = U - T, jt[2] = T - (U - E) + (A - E), jt[3] = U, _ = 4) : (ve[0] = 0, d = 1, jt[0] = 0, _ = 1), u !== 0) {
      const z = j(d, ve, u, ut);
      f = mt(f, vt(
        j(p, Je, u, nt),
        nt,
        j(z, ut, 2 * Q, ct),
        ct,
        pt
      ), pt);
      const G = j(_, jt, u, Z);
      f = mt(f, Nt(
        j(G, Z, 2 * Q, nt),
        nt,
        j(G, Z, u, ht),
        ht,
        j(z, ut, u, ct),
        ct,
        Xt,
        _t
      ), _t), m !== 0 && (f = mt(f, j(j(4, Tt, u, Z), Z, m, nt), nt)), b !== 0 && (f = mt(f, j(j(4, Ft, -u, Z), Z, b, nt), nt));
    }
    if (g !== 0) {
      const z = j(d, ve, g, ut);
      f = mt(f, vt(
        j(w, Qe, g, nt),
        nt,
        j(z, ut, 2 * et, ct),
        ct,
        pt
      ), pt);
      const G = j(_, jt, g, Z);
      f = mt(f, Nt(
        j(G, Z, 2 * et, nt),
        nt,
        j(G, Z, g, ht),
        ht,
        j(z, ut, g, ct),
        ct,
        Xt,
        _t
      ), _t);
    }
  }
  return re[f - 1];
}
function Ve(r, t, e, n, s, o, i, a) {
  const c = r - i, f = e - i, l = s - i, h = t - a, u = n - a, m = o - a, b = f * m, g = l * u, k = c * c + h * h, M = l * h, v = c * m, x = f * f + u * u, p = c * u, w = f * h, d = l * l + m * m, y = k * (b - g) + x * (M - v) + d * (p - w), S = (Math.abs(b) + Math.abs(g)) * k + (Math.abs(M) + Math.abs(v)) * x + (Math.abs(p) + Math.abs(w)) * d, _ = Gs * S;
  return y > _ || -y > _ ? y : Hs(r, t, e, n, s, o, i, a, S);
}
function Js(r, t) {
  var e, n, s = 0, o, i, a, c, f, l, h, u = r[0], m = r[1], b = t.length;
  for (e = 0; e < b; e++) {
    n = 0;
    var g = t[e], k = g.length - 1;
    if (l = g[0], l[0] !== g[k][0] && l[1] !== g[k][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (i = l[0] - u, a = l[1] - m, n; n < k; n++) {
      if (h = g[n + 1], c = h[0] - u, f = h[1] - m, a === 0 && f === 0) {
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
function tn(r, t, e = {}) {
  if (!r)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const n = Xs(r), s = zs(t), o = s.type, i = t.bbox;
  let a = s.coordinates;
  if (i && Qs(n, i) === !1)
    return !1;
  o === "Polygon" && (a = [a]);
  for (var c = 0; c < a.length; ++c) {
    const f = Js(n, a[c]);
    if (f === 0 && !e.ignoreBoundary) return !0;
    if (f) return !0;
  }
  return !1;
}
function Qs(r, t) {
  return t[0] <= r[0] && t[1] <= r[1] && t[2] >= r[0] && t[3] >= r[1];
}
class gn {
  constructor(t = [], e = Zs) {
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
function Zs(r, t) {
  return r < t ? -1 : r > t ? 1 : 0;
}
const tr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: gn
}, Symbol.toStringTag, { value: "Module" })), Ct = 11102230246251565e-32, yt = 134217729, er = (3 + 8 * Ct) * Ct;
function en(r, t, e, n, s) {
  let o, i, a, c, f = t[0], l = n[0], h = 0, u = 0;
  l > f == l > -f ? (o = f, f = t[++h]) : (o = l, l = n[++u]);
  let m = 0;
  if (h < r && u < e)
    for (l > f == l > -f ? (i = f + o, a = o - (i - f), f = t[++h]) : (i = l + o, a = o - (i - l), l = n[++u]), o = i, a !== 0 && (s[m++] = a); h < r && u < e; )
      l > f == l > -f ? (i = o + f, c = i - o, a = o - (i - c) + (f - c), f = t[++h]) : (i = o + l, c = i - o, a = o - (i - c) + (l - c), l = n[++u]), o = i, a !== 0 && (s[m++] = a);
  for (; h < r; )
    i = o + f, c = i - o, a = o - (i - c) + (f - c), f = t[++h], o = i, a !== 0 && (s[m++] = a);
  for (; u < e; )
    i = o + l, c = i - o, a = o - (i - c) + (l - c), l = n[++u], o = i, a !== 0 && (s[m++] = a);
  return (o !== 0 || m === 0) && (s[m++] = o), m;
}
function nr(r, t) {
  let e = t[0];
  for (let n = 1; n < r; n++) e += t[n];
  return e;
}
function we(r) {
  return new Float64Array(r);
}
const sr = (3 + 16 * Ct) * Ct, rr = (2 + 12 * Ct) * Ct, ir = (9 + 64 * Ct) * Ct * Ct, ne = we(4), _n = we(8), An = we(12), In = we(16), Et = we(4);
function or(r, t, e, n, s, o, i) {
  let a, c, f, l, h, u, m, b, g, k, M, v, x, p, w, d, y, S;
  const _ = r - s, O = e - s, B = t - o, D = n - o;
  p = _ * D, u = yt * _, m = u - (u - _), b = _ - m, u = yt * D, g = u - (u - D), k = D - g, w = b * k - (p - m * g - b * g - m * k), d = B * O, u = yt * B, m = u - (u - B), b = B - m, u = yt * O, g = u - (u - O), k = O - g, y = b * k - (d - m * g - b * g - m * k), M = w - y, h = w - M, ne[0] = w - (M + h) + (h - y), v = p + M, h = v - p, x = p - (v - h) + (M - h), M = x - d, h = x - M, ne[1] = x - (M + h) + (h - d), S = v + M, h = S - v, ne[2] = v - (S - h) + (M - h), ne[3] = S;
  let C = nr(4, ne), E = rr * i;
  if (C >= E || -C >= E || (h = r - _, a = r - (_ + h) + (h - s), h = e - O, f = e - (O + h) + (h - s), h = t - B, c = t - (B + h) + (h - o), h = n - D, l = n - (D + h) + (h - o), a === 0 && c === 0 && f === 0 && l === 0) || (E = ir * i + er * Math.abs(C), C += _ * l + D * a - (B * f + O * c), C >= E || -C >= E)) return C;
  p = a * D, u = yt * a, m = u - (u - a), b = a - m, u = yt * D, g = u - (u - D), k = D - g, w = b * k - (p - m * g - b * g - m * k), d = c * O, u = yt * c, m = u - (u - c), b = c - m, u = yt * O, g = u - (u - O), k = O - g, y = b * k - (d - m * g - b * g - m * k), M = w - y, h = w - M, Et[0] = w - (M + h) + (h - y), v = p + M, h = v - p, x = p - (v - h) + (M - h), M = x - d, h = x - M, Et[1] = x - (M + h) + (h - d), S = v + M, h = S - v, Et[2] = v - (S - h) + (M - h), Et[3] = S;
  const N = en(4, ne, 4, Et, _n);
  p = _ * l, u = yt * _, m = u - (u - _), b = _ - m, u = yt * l, g = u - (u - l), k = l - g, w = b * k - (p - m * g - b * g - m * k), d = B * f, u = yt * B, m = u - (u - B), b = B - m, u = yt * f, g = u - (u - f), k = f - g, y = b * k - (d - m * g - b * g - m * k), M = w - y, h = w - M, Et[0] = w - (M + h) + (h - y), v = p + M, h = v - p, x = p - (v - h) + (M - h), M = x - d, h = x - M, Et[1] = x - (M + h) + (h - d), S = v + M, h = S - v, Et[2] = v - (S - h) + (M - h), Et[3] = S;
  const I = en(N, _n, 4, Et, An);
  p = a * l, u = yt * a, m = u - (u - a), b = a - m, u = yt * l, g = u - (u - l), k = l - g, w = b * k - (p - m * g - b * g - m * k), d = c * f, u = yt * c, m = u - (u - c), b = c - m, u = yt * f, g = u - (u - f), k = f - g, y = b * k - (d - m * g - b * g - m * k), M = w - y, h = w - M, Et[0] = w - (M + h) + (h - y), v = p + M, h = v - p, x = p - (v - h) + (M - h), M = x - d, h = x - M, Et[1] = x - (M + h) + (h - d), S = v + M, h = S - v, Et[2] = v - (S - h) + (M - h), Et[3] = S;
  const F = en(I, An, 4, Et, In);
  return In[F - 1];
}
function Nn(r, t, e, n, s, o) {
  const i = (t - o) * (e - s), a = (r - s) * (n - o), c = i - a;
  if (i === 0 || a === 0 || i > 0 != a > 0) return c;
  const f = Math.abs(i + a);
  return Math.abs(c) >= sr * f ? c : -or(r, t, e, n, s, o, f);
}
function ar(r, t) {
  const e = new gn([], ys);
  return fr(r, e), lr(e, t);
}
function ys(r, t) {
  return r.p.x > t.p.x ? 1 : r.p.x < t.p.x || r.p.x === t.p.x && (r.featureId !== t.featureId || r.ringId !== t.ringId) && r.isLeftEndpoint && !t.isLeftEndpoint ? -1 : r.p.y !== t.p.y ? r.p.y > t.p.y ? 1 : -1 : 1;
}
function cr(r, t) {
  return r.rightSweepEvent.p.x > t.rightSweepEvent.p.x ? 1 : r.rightSweepEvent.p.x < t.rightSweepEvent.p.x ? -1 : r.rightSweepEvent.p.y !== t.rightSweepEvent.p.y ? r.rightSweepEvent.p.y < t.rightSweepEvent.p.y ? 1 : -1 : 1;
}
function fr(r, t) {
  if (r.type === "FeatureCollection") {
    const e = r.features;
    for (let n = 0; n < e.length; n++)
      Bn(e[n], t);
  } else
    Bn(r, t);
}
var xe = 0, ke = 0, Se = 0;
function Bn(r, t) {
  const e = r.type === "Feature" ? r.geometry : r;
  let n = e.coordinates;
  (e.type === "Polygon" || e.type === "MultiLineString") && (n = [n]), e.type === "LineString" && (n = [[n]]);
  for (let s = 0; s < n.length; s++)
    for (let o = 0; o < n[s].length; o++) {
      let i = n[s][o][0], a = null;
      ke = ke + 1;
      for (let c = 0; c < n[s][o].length - 1; c++) {
        a = n[s][o][c + 1];
        const f = new On(i, xe, ke, Se), l = new On(a, xe, ke, Se + 1);
        f.otherEvent = l, l.otherEvent = f, ys(f, l) > 0 ? (l.isLeftEndpoint = !0, f.isLeftEndpoint = !1) : (f.isLeftEndpoint = !0, l.isLeftEndpoint = !1), t.push(f), t.push(l), i = a, Se = Se + 1;
      }
    }
  xe = xe + 1;
}
var On = class {
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
function lr(r, t = !1) {
  const e = [], n = new gn([], cr);
  for (; r.length; ) {
    const s = r.pop();
    if (s.isLeftEndpoint) {
      const o = new hr(s);
      for (let i = 0; i < n.data.length; i++) {
        const a = n.data[i];
        if (t && a.leftSweepEvent.featureId === s.featureId)
          continue;
        const c = ur(o, a);
        c !== !1 && e.push(c);
      }
      n.push(o);
    } else s.isLeftEndpoint === !1 && n.pop();
  }
  return e;
}
var hr = class {
  /** @param event must have otherEvent non-null */
  constructor(r) {
    this.leftSweepEvent = r, this.rightSweepEvent = r.otherEvent;
  }
};
function ur(r, t) {
  if (r === null || t === null) return !1;
  const e = r.leftSweepEvent.p.x, n = r.leftSweepEvent.p.y, s = r.rightSweepEvent.p.x, o = r.rightSweepEvent.p.y, i = t.leftSweepEvent.p.x, a = t.leftSweepEvent.p.y, c = t.rightSweepEvent.p.x, f = t.rightSweepEvent.p.y, l = Nn(e, n, s, o, i, a), h = Nn(e, n, s, o, c, f);
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
  const u = (f - a) * (s - e) - (c - i) * (o - n), m = (c - i) * (n - a) - (f - a) * (e - i), b = (s - e) * (n - a) - (o - n) * (e - i);
  if (u === 0)
    return !1;
  const g = m / u, k = b / u;
  if (g >= 0 && g <= 1 && k >= 0 && k <= 1) {
    const M = e + g * (s - e), v = n + g * (o - n);
    return [M, v];
  }
  return !1;
}
function dr(r, t, e = {}) {
  const { removeDuplicates: n = !0, ignoreSelfIntersections: s = !0 } = e;
  let o = [];
  r.type === "FeatureCollection" ? o = o.concat(r.features) : r.type === "Feature" ? o.push(r) : (r.type === "LineString" || r.type === "Polygon" || r.type === "MultiLineString" || r.type === "MultiPolygon") && o.push(de(r)), t.type === "FeatureCollection" ? o = o.concat(t.features) : t.type === "Feature" ? o.push(t) : (t.type === "LineString" || t.type === "Polygon" || t.type === "MultiLineString" || t.type === "MultiPolygon") && o.push(de(t));
  const i = ar(
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
function gr(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
function pr(r) {
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
function mr(r, t = {}) {
  let e = 0, n = 0, s = 0;
  return dn(
    r,
    function(o) {
      e += o[0], n += o[1], s++;
    },
    !0
  ), Zt([e / s, n / s], t.properties);
}
var Me = { exports: {} }, Oe = { exports: {} }, wr = Oe.exports, Fn;
function vr() {
  return Fn || (Fn = 1, (function(r, t) {
    (function(e, n) {
      r.exports = n();
    })(wr, function() {
      function e(v, x, p, w, d) {
        (function y(S, _, O, B, D) {
          for (; B > O; ) {
            if (B - O > 600) {
              var C = B - O + 1, E = _ - O + 1, N = Math.log(C), I = 0.5 * Math.exp(2 * N / 3), F = 0.5 * Math.sqrt(N * I * (C - I) / C) * (E - C / 2 < 0 ? -1 : 1), P = Math.max(O, Math.floor(_ - E * I / C + F)), V = Math.min(B, Math.floor(_ + (C - E) * I / C + F));
              y(S, _, P, V, D);
            }
            var A = S[_], T = O, $ = B;
            for (n(S, O, _), D(S[B], A) > 0 && n(S, O, B); T < $; ) {
              for (n(S, T, $), T++, $--; D(S[T], A) < 0; ) T++;
              for (; D(S[$], A) > 0; ) $--;
            }
            D(S[O], A) === 0 ? n(S, O, $) : n(S, ++$, B), $ <= _ && (O = $ + 1), _ <= $ && (B = $ - 1);
          }
        })(v, x, p || 0, w || v.length - 1, d || s);
      }
      function n(v, x, p) {
        var w = v[x];
        v[x] = v[p], v[p] = w;
      }
      function s(v, x) {
        return v < x ? -1 : v > x ? 1 : 0;
      }
      var o = function(v) {
        v === void 0 && (v = 9), this._maxEntries = Math.max(4, v), this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries)), this.clear();
      };
      function i(v, x, p) {
        if (!p) return x.indexOf(v);
        for (var w = 0; w < x.length; w++) if (p(v, x[w])) return w;
        return -1;
      }
      function a(v, x) {
        c(v, 0, v.children.length, x, v);
      }
      function c(v, x, p, w, d) {
        d || (d = k(null)), d.minX = 1 / 0, d.minY = 1 / 0, d.maxX = -1 / 0, d.maxY = -1 / 0;
        for (var y = x; y < p; y++) {
          var S = v.children[y];
          f(d, v.leaf ? w(S) : S);
        }
        return d;
      }
      function f(v, x) {
        return v.minX = Math.min(v.minX, x.minX), v.minY = Math.min(v.minY, x.minY), v.maxX = Math.max(v.maxX, x.maxX), v.maxY = Math.max(v.maxY, x.maxY), v;
      }
      function l(v, x) {
        return v.minX - x.minX;
      }
      function h(v, x) {
        return v.minY - x.minY;
      }
      function u(v) {
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
      function k(v) {
        return { children: v, height: 1, leaf: !0, minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
      }
      function M(v, x, p, w, d) {
        for (var y = [x, p]; y.length; ) if (!((p = y.pop()) - (x = y.pop()) <= w)) {
          var S = x + Math.ceil((p - x) / w / 2) * w;
          e(v, S, x, p, d), y.push(x, S, S, p);
        }
      }
      return o.prototype.all = function() {
        return this._all(this.data, []);
      }, o.prototype.search = function(v) {
        var x = this.data, p = [];
        if (!g(v, x)) return p;
        for (var w = this.toBBox, d = []; x; ) {
          for (var y = 0; y < x.children.length; y++) {
            var S = x.children[y], _ = x.leaf ? w(S) : S;
            g(v, _) && (x.leaf ? p.push(S) : b(v, _) ? this._all(S, p) : d.push(S));
          }
          x = d.pop();
        }
        return p;
      }, o.prototype.collides = function(v) {
        var x = this.data;
        if (!g(v, x)) return !1;
        for (var p = []; x; ) {
          for (var w = 0; w < x.children.length; w++) {
            var d = x.children[w], y = x.leaf ? this.toBBox(d) : d;
            if (g(v, y)) {
              if (x.leaf || b(v, y)) return !0;
              p.push(d);
            }
          }
          x = p.pop();
        }
        return !1;
      }, o.prototype.load = function(v) {
        if (!v || !v.length) return this;
        if (v.length < this._minEntries) {
          for (var x = 0; x < v.length; x++) this.insert(v[x]);
          return this;
        }
        var p = this._build(v.slice(), 0, v.length - 1, 0);
        if (this.data.children.length) if (this.data.height === p.height) this._splitRoot(this.data, p);
        else {
          if (this.data.height < p.height) {
            var w = this.data;
            this.data = p, p = w;
          }
          this._insert(p, this.data.height - p.height - 1, !0);
        }
        else this.data = p;
        return this;
      }, o.prototype.insert = function(v) {
        return v && this._insert(v, this.data.height - 1), this;
      }, o.prototype.clear = function() {
        return this.data = k([]), this;
      }, o.prototype.remove = function(v, x) {
        if (!v) return this;
        for (var p, w, d, y = this.data, S = this.toBBox(v), _ = [], O = []; y || _.length; ) {
          if (y || (y = _.pop(), w = _[_.length - 1], p = O.pop(), d = !0), y.leaf) {
            var B = i(v, y.children, x);
            if (B !== -1) return y.children.splice(B, 1), _.push(y), this._condense(_), this;
          }
          d || y.leaf || !b(y, S) ? w ? (p++, y = w.children[p], d = !1) : y = null : (_.push(y), O.push(p), p = 0, w = y, y = y.children[0]);
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
        for (var p = []; v; ) v.leaf ? x.push.apply(x, v.children) : p.push.apply(p, v.children), v = p.pop();
        return x;
      }, o.prototype._build = function(v, x, p, w) {
        var d, y = p - x + 1, S = this._maxEntries;
        if (y <= S) return a(d = k(v.slice(x, p + 1)), this.toBBox), d;
        w || (w = Math.ceil(Math.log(y) / Math.log(S)), S = Math.ceil(y / Math.pow(S, w - 1))), (d = k([])).leaf = !1, d.height = w;
        var _ = Math.ceil(y / S), O = _ * Math.ceil(Math.sqrt(S));
        M(v, x, p, O, this.compareMinX);
        for (var B = x; B <= p; B += O) {
          var D = Math.min(B + O - 1, p);
          M(v, B, D, _, this.compareMinY);
          for (var C = B; C <= D; C += _) {
            var E = Math.min(C + _ - 1, D);
            d.children.push(this._build(v, C, E, w - 1));
          }
        }
        return a(d, this.toBBox), d;
      }, o.prototype._chooseSubtree = function(v, x, p, w) {
        for (; w.push(x), !x.leaf && w.length - 1 !== p; ) {
          for (var d = 1 / 0, y = 1 / 0, S = void 0, _ = 0; _ < x.children.length; _++) {
            var O = x.children[_], B = u(O), D = (C = v, E = O, (Math.max(E.maxX, C.maxX) - Math.min(E.minX, C.minX)) * (Math.max(E.maxY, C.maxY) - Math.min(E.minY, C.minY)) - B);
            D < y ? (y = D, d = B < d ? B : d, S = O) : D === y && B < d && (d = B, S = O);
          }
          x = S || x.children[0];
        }
        var C, E;
        return x;
      }, o.prototype._insert = function(v, x, p) {
        var w = p ? v : this.toBBox(v), d = [], y = this._chooseSubtree(w, this.data, x, d);
        for (y.children.push(v), f(y, w); x >= 0 && d[x].children.length > this._maxEntries; ) this._split(d, x), x--;
        this._adjustParentBBoxes(w, d, x);
      }, o.prototype._split = function(v, x) {
        var p = v[x], w = p.children.length, d = this._minEntries;
        this._chooseSplitAxis(p, d, w);
        var y = this._chooseSplitIndex(p, d, w), S = k(p.children.splice(y, p.children.length - y));
        S.height = p.height, S.leaf = p.leaf, a(p, this.toBBox), a(S, this.toBBox), x ? v[x - 1].children.push(S) : this._splitRoot(p, S);
      }, o.prototype._splitRoot = function(v, x) {
        this.data = k([v, x]), this.data.height = v.height + 1, this.data.leaf = !1, a(this.data, this.toBBox);
      }, o.prototype._chooseSplitIndex = function(v, x, p) {
        for (var w, d, y, S, _, O, B, D = 1 / 0, C = 1 / 0, E = x; E <= p - x; E++) {
          var N = c(v, 0, E, this.toBBox), I = c(v, E, p, this.toBBox), F = (d = N, y = I, S = void 0, _ = void 0, O = void 0, B = void 0, S = Math.max(d.minX, y.minX), _ = Math.max(d.minY, y.minY), O = Math.min(d.maxX, y.maxX), B = Math.min(d.maxY, y.maxY), Math.max(0, O - S) * Math.max(0, B - _)), P = u(N) + u(I);
          F < D ? (D = F, w = E, C = P < C ? P : C) : F === D && P < C && (C = P, w = E);
        }
        return w || p - x;
      }, o.prototype._chooseSplitAxis = function(v, x, p) {
        var w = v.leaf ? this.compareMinX : l, d = v.leaf ? this.compareMinY : h;
        this._allDistMargin(v, x, p, w) < this._allDistMargin(v, x, p, d) && v.children.sort(w);
      }, o.prototype._allDistMargin = function(v, x, p, w) {
        v.children.sort(w);
        for (var d = this.toBBox, y = c(v, 0, x, d), S = c(v, p - x, p, d), _ = m(y) + m(S), O = x; O < p - x; O++) {
          var B = v.children[O];
          f(y, v.leaf ? d(B) : B), _ += m(y);
        }
        for (var D = p - x - 1; D >= x; D--) {
          var C = v.children[D];
          f(S, v.leaf ? d(C) : C), _ += m(S);
        }
        return _;
      }, o.prototype._adjustParentBBoxes = function(v, x, p) {
        for (var w = p; w >= 0; w--) f(x[w], v);
      }, o.prototype._condense = function(v) {
        for (var x = v.length - 1, p = void 0; x >= 0; x--) v[x].children.length === 0 ? x > 0 ? (p = v[x - 1].children).splice(p.indexOf(v[x]), 1) : this.clear() : a(v[x], this.toBBox);
      }, o;
    });
  })(Oe)), Oe.exports;
}
const br = /* @__PURE__ */ pr(tr);
var ae = { exports: {} }, nn, Tn;
function yr() {
  return Tn || (Tn = 1, nn = function(t, e, n, s) {
    var o = t[0], i = t[1], a = !1;
    n === void 0 && (n = 0), s === void 0 && (s = e.length);
    for (var c = (s - n) / 2, f = 0, l = c - 1; f < c; l = f++) {
      var h = e[n + f * 2 + 0], u = e[n + f * 2 + 1], m = e[n + l * 2 + 0], b = e[n + l * 2 + 1], g = u > i != b > i && o < (m - h) * (i - u) / (b - u) + h;
      g && (a = !a);
    }
    return a;
  }), nn;
}
var sn, Rn;
function xr() {
  return Rn || (Rn = 1, sn = function(t, e, n, s) {
    var o = t[0], i = t[1], a = !1;
    n === void 0 && (n = 0), s === void 0 && (s = e.length);
    for (var c = s - n, f = 0, l = c - 1; f < c; l = f++) {
      var h = e[f + n][0], u = e[f + n][1], m = e[l + n][0], b = e[l + n][1], g = u > i != b > i && o < (m - h) * (i - u) / (b - u) + h;
      g && (a = !a);
    }
    return a;
  }), sn;
}
var Pn;
function kr() {
  if (Pn) return ae.exports;
  Pn = 1;
  var r = yr(), t = xr();
  return ae.exports = function(n, s, o, i) {
    return s.length > 0 && Array.isArray(s[0]) ? t(n, s, o, i) : r(n, s, o, i);
  }, ae.exports.nested = t, ae.exports.flat = r, ae.exports;
}
var fe = { exports: {} }, Sr = fe.exports, Dn;
function Mr() {
  return Dn || (Dn = 1, (function(r, t) {
    (function(e, n) {
      n(t);
    })(Sr, function(e) {
      const s = 33306690738754706e-32;
      function o(g, k, M, v, x) {
        let p, w, d, y, S = k[0], _ = v[0], O = 0, B = 0;
        _ > S == _ > -S ? (p = S, S = k[++O]) : (p = _, _ = v[++B]);
        let D = 0;
        if (O < g && B < M) for (_ > S == _ > -S ? (d = p - ((w = S + p) - S), S = k[++O]) : (d = p - ((w = _ + p) - _), _ = v[++B]), p = w, d !== 0 && (x[D++] = d); O < g && B < M; ) _ > S == _ > -S ? (d = p - ((w = p + S) - (y = w - p)) + (S - y), S = k[++O]) : (d = p - ((w = p + _) - (y = w - p)) + (_ - y), _ = v[++B]), p = w, d !== 0 && (x[D++] = d);
        for (; O < g; ) d = p - ((w = p + S) - (y = w - p)) + (S - y), S = k[++O], p = w, d !== 0 && (x[D++] = d);
        for (; B < M; ) d = p - ((w = p + _) - (y = w - p)) + (_ - y), _ = v[++B], p = w, d !== 0 && (x[D++] = d);
        return p === 0 && D !== 0 || (x[D++] = p), D;
      }
      function i(g) {
        return new Float64Array(g);
      }
      const a = 33306690738754716e-32, c = 22204460492503146e-32, f = 11093356479670487e-47, l = i(4), h = i(8), u = i(12), m = i(16), b = i(4);
      e.orient2d = function(g, k, M, v, x, p) {
        const w = (k - p) * (M - x), d = (g - x) * (v - p), y = w - d;
        if (w === 0 || d === 0 || w > 0 != d > 0) return y;
        const S = Math.abs(w + d);
        return Math.abs(y) >= a * S ? y : -(function(_, O, B, D, C, E, N) {
          let I, F, P, V, A, T, $, X, q, Y, L, U, W, H, Q, K, tt, et;
          const lt = _ - C, R = B - C, z = O - E, G = D - E;
          A = (Q = (X = lt - ($ = (T = 134217729 * lt) - (T - lt))) * (Y = G - (q = (T = 134217729 * G) - (T - G))) - ((H = lt * G) - $ * q - X * q - $ * Y)) - (L = Q - (tt = (X = z - ($ = (T = 134217729 * z) - (T - z))) * (Y = R - (q = (T = 134217729 * R) - (T - R))) - ((K = z * R) - $ * q - X * q - $ * Y))), l[0] = Q - (L + A) + (A - tt), A = (W = H - ((U = H + L) - (A = U - H)) + (L - A)) - (L = W - K), l[1] = W - (L + A) + (A - K), A = (et = U + L) - U, l[2] = U - (et - A) + (L - A), l[3] = et;
          let st = (function(Ds, bn) {
            let yn = bn[0];
            for (let Ue = 1; Ue < Ds; Ue++) yn += bn[Ue];
            return yn;
          })(4, l), at = c * N;
          if (st >= at || -st >= at || (I = _ - (lt + (A = _ - lt)) + (A - C), P = B - (R + (A = B - R)) + (A - C), F = O - (z + (A = O - z)) + (A - E), V = D - (G + (A = D - G)) + (A - E), I === 0 && F === 0 && P === 0 && V === 0) || (at = f * N + s * Math.abs(st), (st += lt * V + G * I - (z * P + R * F)) >= at || -st >= at)) return st;
          A = (Q = (X = I - ($ = (T = 134217729 * I) - (T - I))) * (Y = G - (q = (T = 134217729 * G) - (T - G))) - ((H = I * G) - $ * q - X * q - $ * Y)) - (L = Q - (tt = (X = F - ($ = (T = 134217729 * F) - (T - F))) * (Y = R - (q = (T = 134217729 * R) - (T - R))) - ((K = F * R) - $ * q - X * q - $ * Y))), b[0] = Q - (L + A) + (A - tt), A = (W = H - ((U = H + L) - (A = U - H)) + (L - A)) - (L = W - K), b[1] = W - (L + A) + (A - K), A = (et = U + L) - U, b[2] = U - (et - A) + (L - A), b[3] = et;
          const wt = o(4, l, 4, b, h);
          A = (Q = (X = lt - ($ = (T = 134217729 * lt) - (T - lt))) * (Y = V - (q = (T = 134217729 * V) - (T - V))) - ((H = lt * V) - $ * q - X * q - $ * Y)) - (L = Q - (tt = (X = z - ($ = (T = 134217729 * z) - (T - z))) * (Y = P - (q = (T = 134217729 * P) - (T - P))) - ((K = z * P) - $ * q - X * q - $ * Y))), b[0] = Q - (L + A) + (A - tt), A = (W = H - ((U = H + L) - (A = U - H)) + (L - A)) - (L = W - K), b[1] = W - (L + A) + (A - K), A = (et = U + L) - U, b[2] = U - (et - A) + (L - A), b[3] = et;
          const qt = o(wt, h, 4, b, u);
          A = (Q = (X = I - ($ = (T = 134217729 * I) - (T - I))) * (Y = V - (q = (T = 134217729 * V) - (T - V))) - ((H = I * V) - $ * q - X * q - $ * Y)) - (L = Q - (tt = (X = F - ($ = (T = 134217729 * F) - (T - F))) * (Y = P - (q = (T = 134217729 * P) - (T - P))) - ((K = F * P) - $ * q - X * q - $ * Y))), b[0] = Q - (L + A) + (A - tt), A = (W = H - ((U = H + L) - (A = U - H)) + (L - A)) - (L = W - K), b[1] = W - (L + A) + (A - K), A = (et = U + L) - U, b[2] = U - (et - A) + (L - A), b[3] = et;
          const Ps = o(qt, u, 4, b, m);
          return m[Ps - 1];
        })(g, k, M, v, x, p, S);
      }, e.orient2dfast = function(g, k, M, v, x, p) {
        return (k - p) * (M - x) - (g - x) * (v - p);
      }, Object.defineProperty(e, "__esModule", { value: !0 });
    });
  })(fe, fe.exports)), fe.exports;
}
var Cn;
function Er() {
  if (Cn) return Me.exports;
  Cn = 1;
  var r = vr(), t = br, e = kr(), n = Mr().orient2d;
  t.default && (t = t.default), Me.exports = s, Me.exports.default = s;
  function s(p, w, d) {
    w = Math.max(0, w === void 0 ? 2 : w), d = d || 0;
    var y = m(p), S = new r(16);
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
    for (var _ = [], O = 0, B; O < y.length; O++) {
      var D = y[O];
      S.remove(D), B = b(D, B), _.push(B);
    }
    var C = new r(16);
    for (O = 0; O < _.length; O++) C.insert(u(_[O]));
    for (var E = w * w, N = d * d; _.length; ) {
      var I = _.shift(), F = I.p, P = I.next.p, V = g(F, P);
      if (!(V < N)) {
        var A = V / E;
        D = o(S, I.prev.p, F, P, I.next.next.p, A, C), D && Math.min(g(D, F), g(D, P)) <= A && (_.push(I), _.push(b(D, I)), S.remove(D), C.remove(I), C.insert(u(I)), C.insert(u(I.next)));
      }
    }
    I = B;
    var T = [];
    do
      T.push(I.p), I = I.next;
    while (I !== B);
    return T.push(I.p), T;
  }
  function o(p, w, d, y, S, _, O) {
    for (var B = new t([], i), D = p.data; D; ) {
      for (var C = 0; C < D.children.length; C++) {
        var E = D.children[C], N = D.leaf ? k(E, d, y) : a(d, y, E);
        N > _ || B.push({
          node: E,
          dist: N
        });
      }
      for (; B.length && !B.peek().node.children; ) {
        var I = B.pop(), F = I.node, P = k(F, w, d), V = k(F, y, S);
        if (I.dist < P && I.dist < V && f(d, F, O) && f(y, F, O)) return F;
      }
      D = B.pop(), D && (D = D.node);
    }
    return null;
  }
  function i(p, w) {
    return p.dist - w.dist;
  }
  function a(p, w, d) {
    if (c(p, d) || c(w, d)) return 0;
    var y = M(p[0], p[1], w[0], w[1], d.minX, d.minY, d.maxX, d.minY);
    if (y === 0) return 0;
    var S = M(p[0], p[1], w[0], w[1], d.minX, d.minY, d.minX, d.maxY);
    if (S === 0) return 0;
    var _ = M(p[0], p[1], w[0], w[1], d.maxX, d.minY, d.maxX, d.maxY);
    if (_ === 0) return 0;
    var O = M(p[0], p[1], w[0], w[1], d.minX, d.maxY, d.maxX, d.maxY);
    return O === 0 ? 0 : Math.min(y, S, _, O);
  }
  function c(p, w) {
    return p[0] >= w.minX && p[0] <= w.maxX && p[1] >= w.minY && p[1] <= w.maxY;
  }
  function f(p, w, d) {
    for (var y = Math.min(p[0], w[0]), S = Math.min(p[1], w[1]), _ = Math.max(p[0], w[0]), O = Math.max(p[1], w[1]), B = d.search({ minX: y, minY: S, maxX: _, maxY: O }), D = 0; D < B.length; D++)
      if (h(B[D].p, B[D].next.p, p, w)) return !1;
    return !0;
  }
  function l(p, w, d) {
    return n(p[0], p[1], w[0], w[1], d[0], d[1]);
  }
  function h(p, w, d, y) {
    return p !== y && w !== d && l(p, w, d) > 0 != l(p, w, y) > 0 && l(d, y, p) > 0 != l(d, y, w) > 0;
  }
  function u(p) {
    var w = p.p, d = p.next.p;
    return p.minX = Math.min(w[0], d[0]), p.minY = Math.min(w[1], d[1]), p.maxX = Math.max(w[0], d[0]), p.maxY = Math.max(w[1], d[1]), p;
  }
  function m(p) {
    for (var w = p[0], d = p[0], y = p[0], S = p[0], _ = 0; _ < p.length; _++) {
      var O = p[_];
      O[0] < w[0] && (w = O), O[0] > y[0] && (y = O), O[1] < d[1] && (d = O), O[1] > S[1] && (S = O);
    }
    var B = [w, d, y, S], D = B.slice();
    for (_ = 0; _ < p.length; _++)
      e(p[_], B) || D.push(p[_]);
    return x(D);
  }
  function b(p, w) {
    var d = {
      p,
      prev: null,
      next: null,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };
    return w ? (d.next = w.next, d.prev = w, w.next.prev = d, w.next = d) : (d.prev = d, d.next = d), d;
  }
  function g(p, w) {
    var d = p[0] - w[0], y = p[1] - w[1];
    return d * d + y * y;
  }
  function k(p, w, d) {
    var y = w[0], S = w[1], _ = d[0] - y, O = d[1] - S;
    if (_ !== 0 || O !== 0) {
      var B = ((p[0] - y) * _ + (p[1] - S) * O) / (_ * _ + O * O);
      B > 1 ? (y = d[0], S = d[1]) : B > 0 && (y += _ * B, S += O * B);
    }
    return _ = p[0] - y, O = p[1] - S, _ * _ + O * O;
  }
  function M(p, w, d, y, S, _, O, B) {
    var D = d - p, C = y - w, E = O - S, N = B - _, I = p - S, F = w - _, P = D * D + C * C, V = D * E + C * N, A = E * E + N * N, T = D * I + C * F, $ = E * I + N * F, X = P * A - V * V, q, Y, L, U, W = X, H = X;
    X === 0 ? (Y = 0, W = 1, U = $, H = A) : (Y = V * $ - A * T, U = P * $ - V * T, Y < 0 ? (Y = 0, U = $, H = A) : Y > W && (Y = W, U = $ + V, H = A)), U < 0 ? (U = 0, -T < 0 ? Y = 0 : -T > P ? Y = W : (Y = -T, W = P)) : U > H && (U = H, -T + V < 0 ? Y = 0 : -T + V > P ? Y = W : (Y = -T + V, W = P)), q = Y === 0 ? 0 : Y / W, L = U === 0 ? 0 : U / H;
    var Q = (1 - q) * p + q * d, K = (1 - q) * w + q * y, tt = (1 - L) * S + L * O, et = (1 - L) * _ + L * B, lt = tt - Q, R = et - K;
    return lt * lt + R * R;
  }
  function v(p, w) {
    return p[0] === w[0] ? p[1] - w[1] : p[0] - w[0];
  }
  function x(p) {
    p.sort(v);
    for (var w = [], d = 0; d < p.length; d++) {
      for (; w.length >= 2 && l(w[w.length - 2], w[w.length - 1], p[d]) <= 0; )
        w.pop();
      w.push(p[d]);
    }
    for (var y = [], S = p.length - 1; S >= 0; S--) {
      for (; y.length >= 2 && l(y[y.length - 2], y[y.length - 1], p[S]) <= 0; )
        y.pop();
      y.push(p[S]);
    }
    return y.pop(), w.pop(), w.concat(y);
  }
  return Me.exports;
}
var _r = Er();
const Ar = /* @__PURE__ */ gr(_r);
function Vn(r, t = {}) {
  t.concavity = t.concavity || 1 / 0;
  const e = [];
  if (dn(r, (s) => {
    e.push([s[0], s[1]]);
  }), !e.length)
    return null;
  const n = Ar(e, t.concavity);
  return n.length > 3 ? me([n], t.properties) : null;
}
const $n = Math.pow(2, -52), Ee = new Uint32Array(512);
class $e {
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
  static from(t, e = Fr, n = Tr) {
    const s = t.length, o = new Float64Array(s * 2);
    for (let i = 0; i < s; i++) {
      const a = t[i];
      o[2 * i] = e(a), o[2 * i + 1] = n(a);
    }
    return new $e(o);
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
    for (let _ = 0; _ < i; _++) {
      const O = t[2 * _], B = t[2 * _ + 1];
      O < a && (a = O), B < c && (c = B), O > f && (f = O), B > l && (l = B), this._ids[_] = _;
    }
    const h = (a + f) / 2, u = (c + l) / 2;
    let m = 0, b = 0, g = 0;
    for (let _ = 0, O = 1 / 0; _ < i; _++) {
      const B = rn(h, u, t[2 * _], t[2 * _ + 1]);
      B < O && (m = _, O = B);
    }
    const k = t[2 * m], M = t[2 * m + 1];
    for (let _ = 0, O = 1 / 0; _ < i; _++) {
      if (_ === m) continue;
      const B = rn(k, M, t[2 * _], t[2 * _ + 1]);
      B < O && B > 0 && (b = _, O = B);
    }
    let v = t[2 * b], x = t[2 * b + 1], p = 1 / 0;
    for (let _ = 0; _ < i; _++) {
      if (_ === m || _ === b) continue;
      const O = Br(k, M, v, x, t[2 * _], t[2 * _ + 1]);
      O < p && (g = _, p = O);
    }
    let w = t[2 * g], d = t[2 * g + 1];
    if (p === 1 / 0) {
      for (let B = 0; B < i; B++)
        this._dists[B] = t[2 * B] - t[0] || t[2 * B + 1] - t[1];
      se(this._ids, this._dists, 0, i - 1);
      const _ = new Uint32Array(i);
      let O = 0;
      for (let B = 0, D = -1 / 0; B < i; B++) {
        const C = this._ids[B], E = this._dists[C];
        E > D && (_[O++] = C, D = E);
      }
      this.hull = _.subarray(0, O), this.triangles = new Uint32Array(0), this.halfedges = new Int32Array(0);
      return;
    }
    if (ft(k, M, v, x, w, d) < 0) {
      const _ = b, O = v, B = x;
      b = g, v = w, x = d, g = _, w = O, d = B;
    }
    const y = Or(k, M, v, x, w, d);
    this._cx = y.x, this._cy = y.y;
    for (let _ = 0; _ < i; _++)
      this._dists[_] = rn(t[2 * _], t[2 * _ + 1], y.x, y.y);
    se(this._ids, this._dists, 0, i - 1), this._hullStart = m;
    let S = 3;
    n[m] = e[g] = b, n[b] = e[m] = g, n[g] = e[b] = m, s[m] = 0, s[b] = 1, s[g] = 2, o.fill(-1), o[this._hashKey(k, M)] = m, o[this._hashKey(v, x)] = b, o[this._hashKey(w, d)] = g, this.trianglesLen = 0, this._addTriangle(m, b, g, -1, -1, -1);
    for (let _ = 0, O = 0, B = 0; _ < this._ids.length; _++) {
      const D = this._ids[_], C = t[2 * D], E = t[2 * D + 1];
      if (_ > 0 && Math.abs(C - O) <= $n && Math.abs(E - B) <= $n || (O = C, B = E, D === m || D === b || D === g)) continue;
      let N = 0;
      for (let A = 0, T = this._hashKey(C, E); A < this._hashSize && (N = o[(T + A) % this._hashSize], !(N !== -1 && N !== n[N])); A++)
        ;
      N = e[N];
      let I = N, F;
      for (; F = n[I], ft(C, E, t[2 * I], t[2 * I + 1], t[2 * F], t[2 * F + 1]) >= 0; )
        if (I = F, I === N) {
          I = -1;
          break;
        }
      if (I === -1) continue;
      let P = this._addTriangle(I, D, n[I], -1, -1, s[I]);
      s[D] = this._legalize(P + 2), s[I] = P, S++;
      let V = n[I];
      for (; F = n[V], ft(C, E, t[2 * V], t[2 * V + 1], t[2 * F], t[2 * F + 1]) < 0; )
        P = this._addTriangle(V, D, F, s[D], -1, s[V]), s[D] = this._legalize(P + 2), n[V] = V, S--, V = F;
      if (I === N)
        for (; F = e[I], ft(C, E, t[2 * F], t[2 * F + 1], t[2 * I], t[2 * I + 1]) < 0; )
          P = this._addTriangle(F, D, I, -1, s[I], s[F]), this._legalize(P + 2), s[F] = P, n[I] = I, S--, I = F;
      this._hullStart = e[D] = I, n[I] = e[V] = D, n[D] = V, o[this._hashKey(C, E)] = D, o[this._hashKey(t[2 * I], t[2 * I + 1])] = I;
    }
    this.hull = new Uint32Array(S);
    for (let _ = 0, O = this._hullStart; _ < S; _++)
      this.hull[_] = O, O = n[O];
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
    return Math.floor(Ir(t - this._cx, e - this._cy) * this._hashSize) % this._hashSize;
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
      const f = a - a % 3, l = c + (t + 1) % 3, h = f + (a + 2) % 3, u = e[i], m = e[t], b = e[l], g = e[h];
      if (Nr(
        s[2 * u],
        s[2 * u + 1],
        s[2 * m],
        s[2 * m + 1],
        s[2 * b],
        s[2 * b + 1],
        s[2 * g],
        s[2 * g + 1]
      )) {
        e[t] = g, e[a] = u;
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
        const v = f + (a + 1) % 3;
        o < Ee.length && (Ee[o++] = v);
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
function Ir(r, t) {
  const e = r / (Math.abs(r) + Math.abs(t));
  return (t > 0 ? 3 - e : 1 + e) / 4;
}
function rn(r, t, e, n) {
  const s = r - e, o = t - n;
  return s * s + o * o;
}
function Nr(r, t, e, n, s, o, i, a) {
  const c = r - i, f = t - a, l = e - i, h = n - a, u = s - i, m = o - a, b = c * c + f * f, g = l * l + h * h, k = u * u + m * m;
  return c * (h * k - g * m) - f * (l * k - g * u) + b * (l * m - h * u) < 0;
}
function Br(r, t, e, n, s, o) {
  const i = e - r, a = n - t, c = s - r, f = o - t, l = i * i + a * a, h = c * c + f * f, u = 0.5 / (i * f - a * c), m = (f * l - a * h) * u, b = (i * h - c * l) * u;
  return m * m + b * b;
}
function Or(r, t, e, n, s, o) {
  const i = e - r, a = n - t, c = s - r, f = o - t, l = i * i + a * a, h = c * c + f * f, u = 0.5 / (i * f - a * c), m = r + (f * l - a * h) * u, b = t + (i * h - c * l) * u;
  return { x: m, y: b };
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
function Fr(r) {
  return r[0];
}
function Tr(r) {
  return r[1];
}
class Rr {
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
class Ln extends Rr {
  constructor(t) {
    super(8, new Uint8Array(Math.ceil(t / 8)).fill(0));
  }
}
function Bt(r) {
  return r % 3 === 2 ? r - 2 : r + 1;
}
function It(r) {
  return r % 3 === 0 ? r + 2 : r - 1;
}
function Fe(r, t, e, n, s, o, i, a) {
  const c = ft(r, t, s, o, i, a), f = ft(e, n, s, o, i, a);
  if (c > 0 && f > 0 || c < 0 && f < 0)
    return !1;
  const l = ft(s, o, r, t, e, n), h = ft(i, a, r, t, e, n);
  return l > 0 && h > 0 || l < 0 && h < 0 ? !1 : c === 0 && f === 0 && l === 0 && h === 0 ? !(Math.max(s, i) < Math.min(r, e) || Math.max(r, e) < Math.min(s, i) || Math.max(o, a) < Math.min(t, n) || Math.max(t, n) < Math.min(o, a)) : !0;
}
class Pr {
  /**
   * The triangulation object from Delaunator.
   */
  del;
  constructor(t) {
    this.del = t;
  }
}
class Jt extends Pr {
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
    this.vertMap = new Uint32Array(s).fill(n), this.flips = new Ln(o), this.consd = new Ln(o);
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
      const h = n[c], u = Bt(c);
      if (h === e)
        return this.protect(c);
      const m = It(c), b = n[m];
      if (b === e)
        return this.protect(u), u;
      if (this.intersectSegments(t, e, b, h)) {
        c = m;
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
      const h = s[c], u = It(c), m = It(h), b = Bt(h);
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
        n[m]
      )) {
        if (l === -1 && (l = c), n[m] === e) {
          if (c === l)
            throw new Error("Infinite loop: non-convex quadrilateral");
          c = l, l = -1;
          continue;
        }
        if (this.intersectSegments(
          t,
          e,
          n[m],
          n[h]
        ))
          c = m;
        else if (this.intersectSegments(
          t,
          e,
          n[b],
          n[m]
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
        n[m]
      ) && (l === -1 && (l = u), l === u))
        throw new Error("Infinite loop: flipped diagonal still intersects");
      n[m] === e ? (f = m, c = l, l = -1) : this.intersectSegments(
        t,
        e,
        n[b],
        n[m]
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
    const { triangles: n, halfedges: s } = this.del, o = n.length / 3, i = (b, g, k) => {
      const M = t(g), v = t(k);
      return t(b).some((x) => M.includes(x) && v.includes(x));
    }, a = (b) => i(n[b * 3], n[b * 3 + 1], n[b * 3 + 2]), c = (b, g, k, M) => Math.sign(ft(b[g * 2], b[g * 2 + 1], b[k * 2], b[k * 2 + 1], b[M * 2], b[M * 2 + 1])), f = e.map((b) => {
      let g = 0;
      for (let k = 0; k < o; k++) g += c(b, n[k * 3], n[k * 3 + 1], n[k * 3 + 2]);
      return g < 0 ? -1 : 1;
    }), l = (b) => {
      if (this.consd.has(b)) return !1;
      const g = s[b];
      if (g === -1) return !1;
      const k = n[b], M = n[Bt(b)], v = n[It(b)], x = n[It(g)];
      return e.every((p, w) => c(p, v, k, x) === f[w] && c(p, x, M, v) === f[w]);
    };
    let h = 0, u = !0;
    for (; u; ) {
      u = !1;
      for (let b = 0; b < o; b++)
        if (a(b))
          for (let g = 0; g < 3; g++) {
            const k = b * 3 + g;
            if (!l(k)) continue;
            const M = s[k], v = n[k], x = n[Bt(k)], p = n[It(k)], w = n[It(M)];
            if (!(i(p, v, w) && i(w, x, p))) {
              this.protect(this.flipDiagonal(k)), h++, u = !0;
              break;
            }
          }
    }
    let m = 0;
    for (let b = 0; b < o; b++) a(b) && m++;
    return { flips: h, remaining: m };
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
      a = Bt(i), i = o[a];
    } while (i !== -1 && i !== n);
    return s[Bt(a)] === t ? -a : 1 / 0;
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
    const { triangles: e, halfedges: n } = this.del, s = this.flips, o = this.consd, i = n[t], a = It(t), c = Bt(t), f = It(i), l = Bt(i), h = n[a], u = n[f];
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
    return Ve(
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
    const o = e[It(t)], i = e[t], a = e[Bt(t)], c = e[It(s)];
    return !this.inCircle(o, i, a, c);
  }
  /**
   * Update the vertex -> incoming edge map.
   */
  updateVert(t) {
    const { triangles: e, halfedges: n } = this.del, s = this.vertMap, o = e[t];
    let i = It(t), a = n[i];
    for (; a !== -1 && a !== t; )
      i = It(a), a = n[i];
    return s[o] = i, i;
  }
  /**
   * Whether the segments between vertices intersect.
   */
  intersectSegments(t, e, n, s) {
    const o = this.del.coords;
    return t === n || t === s || e === n || e === s ? !1 : Fe(
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
  static intersectSegments = Fe;
}
function _e(r, t, e) {
  return cn(r, t, e).tin;
}
function cn(r, t, e, n, s) {
  if (t || (t = []), typeof r != "object" || r.type !== "FeatureCollection")
    throw "Argument points must be FeatureCollection";
  if (!Array.isArray(t)) throw "Argument points must be Array of Array";
  const o = r.features.map(
    (g) => g.geometry.coordinates
  );
  let i = s?.snapshot ? Jt.restore(s.snapshot) : void 0;
  const a = i ? void 0 : $e.from(o);
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
    const g = n ? s?.snapshot ?? i.snapshot() : void 0, k = (M) => {
      const v = Jt.restore(g);
      return v.constrainAll(M), v;
    };
    for (const M of n?.hull ?? [])
      try {
        i.constrainOne(M[0], M[1]), h.push(M);
      } catch {
        i = k(h);
      }
    n?.boundary && (l = Dr(i, n.boundary), l || (i = k(h))), n && ({ remaining: f } = i.forbidGroupTriangles(
      n.groupsOf,
      n.planes
    ), f -= l?.size ?? 0), c = i.del;
  }
  const u = [];
  for (let g = 0; g < c.triangles.length; g += 3)
    l?.has(g / 3) || u.push([c.triangles[g], c.triangles[g + 1], c.triangles[g + 2]]);
  const m = ["a", "b", "c"];
  return { tin: bt(
    u.map((g) => {
      const k = {}, M = g.map((v, x) => {
        const p = r.features[v], w = p.geometry.coordinates, d = [w[0], w[1]];
        return w.length === 3 ? d[2] = w[2] : k[m[x]] = p.properties[e], d;
      });
      return M[3] = M[0], me([M], k);
    })
  ), remaining: f, hasBoundary: l !== void 0, hull: h };
}
function Dr(r, t) {
  try {
    r.constrainAll(t);
  } catch {
    return;
  }
  const e = new Map(t), { triangles: n, halfedges: s } = r.del, o = (f) => {
    const l = n[f], h = n[Bt(f)];
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
    const f = i[c], l = i[(c + 1) % i.length], h = l.x - f.x, u = l.y - f.y, m = h * h + u * u, b = e.filter((k) => k !== f && k !== l && n(f, l, k) === 0).map((k) => ({ r: k, t: ((k.x - f.x) * h + (k.y - f.y) * u) / m })).filter(({ t: k }) => k > 0 && k < 1).sort((k, M) => k.t - M.t).map(({ r: k }) => k), g = [f, ...b, l];
    for (let k = 0; k + 1 < g.length; k++) a.push([g[k].i, g[k + 1].i]);
  }
  return a;
}
function le([r, t]) {
  return r < t ? `${r}-${t}` : `${t}-${r}`;
}
function Yt(r, t, e) {
  return Zt(r, { target: { geom: t, index: e } });
}
function Kt(r) {
  return Zt(r.properties.target.geom, {
    target: {
      geom: r.geometry.coordinates,
      index: r.properties.target.index
    }
  });
}
function Xn(r, t) {
  const e = r.length, n = t.geometry.coordinates;
  return Array.from({ length: e }, (s, o) => o).map((s) => {
    const o = (s + 1) % e, i = r[s], a = r[o], c = i.geometry.coordinates, f = Math.atan2(
      c[0] - n[0],
      c[1] - n[1]
    ), l = [t, i, a, t].map(
      (m) => m.geometry.coordinates
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
const pn = [0.1, 0.15, 0.225, 0.34, 0.5];
function Cr(r, t) {
  return t ? r.hasBoundary !== t.hasBoundary ? r.hasBoundary : r.diagnostics.boundaryTriangleFlips < t.diagnostics.boundaryTriangleFlips : !0;
}
function zn(r, t, e) {
  return Math.sign(ft(r[0], r[1], t[0], t[1], e[0], e[1]));
}
function Te(r, t = -1) {
  let e = 0;
  for (const n of r.features) {
    const { a: s, b: o, c: i } = n.properties;
    if (![s, o, i].some(
      ({ index: h }) => typeof h == "string" && h.startsWith("b")
    ))
      continue;
    const [a, c, f] = n.geometry.coordinates[0];
    zn(a, c, f) * zn(s.geom, o.geom, i.geom) * t <= 0 && e++;
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
function Yn(r, t, e, n, s, o = /* @__PURE__ */ new Set(), i) {
  const { minx: a, maxx: c, miny: f, maxy: l, centroid: h } = r, u = c - a, m = l - f, b = e.forw.length, g = Array.from({ length: b }, () => []);
  let k = 1;
  for (const [y, S] of e.edges)
    y < n && g[y].push(k), g[S].push(k), S < n && k++;
  const M = (y) => y.slice(0, b).map(({ geometry: S }) => S.coordinates), v = te(M(e.forw)), x = {
    forw: v.filter((y) => !o.has(le(y))),
    bakw: te(M(e.bakw))
  }, p = [0], w = (y) => y >= b ? p : g[y];
  let d;
  for (const y of pn) {
    const S = i?.get(y) ?? { forwReuse: {} };
    i?.set(y, S);
    const _ = S.vertices ?? (S.vertices = t(
      {
        ...r,
        minx: a - y * u,
        maxx: c + y * u,
        miny: f - y * m,
        maxy: l + y * m
      },
      !0
    ));
    if (s && (_.length < 4 || !_.every(({ bakw: Y }) => Y.every(Number.isFinite)))) continue;
    const O = _.map(
      ({ forw: Y, bakw: L }, U) => Yt(Y, L, `b${U}`)
    ), B = bt([...e.forw, ...O]), D = bt([
      ...e.bakw,
      ...O.map(Kt)
    ]), C = [B, D].map(
      ({ features: Y }) => Float64Array.from(
        Y.flatMap(
          ({
            geometry: {
              coordinates: [L, U]
            }
          }) => [L, U]
        )
      )
    ), N = s !== void 0 || oe(
      _.map((Y) => Y.forw),
      h.forw,
      -1
    ) && oe(
      _.map((Y) => Y.bakw),
      h.bakw,
      1
    ) ? _.map((Y, L) => [
      b + L,
      b + (L + 1) % _.length
    ]) : void 0, I = { groupsOf: w, planes: C, boundary: N, allowUnusableBoundary: s !== void 0 }, F = s?.orientation ?? -1, P = cn(
      B,
      e.edges,
      "target",
      { ...I, hull: x.forw },
      S.forwReuse
    ), V = S.geographic ?? (S.geographic = (() => {
      const Y = cn(D, e.edges, "target", {
        ...I,
        hull: x.bakw
      });
      return { built: Y, flips: Te(Y.tin, F) };
    })()), A = V.built, T = P.tin, $ = {
      ...A.tin,
      features: [...A.tin.features]
    }, X = Te(T, F) + V.flips, q = {
      vertices: _,
      forw: T,
      bakw: $,
      diagnostics: {
        margin: y,
        boundaryTriangleFlips: X,
        remainingForbiddenTriangles: P.remaining + A.remaining
      },
      hasMapBoundary: P.hasBoundary,
      hasBoundary: P.hasBoundary && A.hasBoundary,
      forwHull: { all: v, applied: P.hull }
    };
    if (s) {
      if (s.accept(q)) return q;
      continue;
    }
    if (X === 0 && q.hasBoundary)
      return q;
    Cr(q, d) && (d = q);
  }
  return d;
}
const Un = 1e-9;
function Vr(r, t) {
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
function xs(r) {
  let t = 1 / 0, e = 0, n = 0;
  return r.forEach((s) => {
    const { forw: o, bakw: i } = s, a = Math.hypot(o[0], o[1]), c = Math.hypot(i[0], i[1]);
    if (c === 0) return;
    const f = a / c, l = Math.atan2(o[0], o[1]) - Math.atan2(i[0], i[1]);
    t = Math.min(t, f), e += Math.cos(l), n += Math.sin(l);
  }), isFinite(t) ? [t, Math.atan2(n, e)] : [1, 0];
}
const $r = 0.6, Lr = 3, Xr = 0.5;
function zr(r) {
  let t = 0, e = 0, n = 0, s = 0;
  if (r.forEach(({ forw: i, bakw: a }) => {
    t += i[1] * a[1] + i[0] * a[0], e += i[0] * a[1] - i[1] * a[0], n += a[0] * a[0] + a[1] * a[1], s += i[0] * i[0] + i[1] * i[1];
  }), !(!(n > 0 && s > 0) || !(Math.hypot(t, e) / Math.sqrt(s * n) >= Xr)))
    return [Math.hypot(t, e) / n, Math.atan2(e, t)];
}
function Yr(r) {
  const t = (s) => Math.hypot(s.forw[0], s.forw[1]), e = Math.max(...r.map(t)), n = r.filter((s) => t(s) >= $r * e);
  return zr(n.length >= Lr ? n : r) ?? xs(r);
}
function Ur(r, t, e, n) {
  const { perQuad: s, aggregate: o } = Vr(r, t), i = s.every((l) => l.length > 0), a = e === "birdeye" ? i ? s : [o] : [o], c = n === "farLsq" ? Yr : xs, f = a.map((l) => c(l));
  return f.length === 1 ? [f[0], f[0], f[0], f[0]] : f;
}
function qr(r, t) {
  let e = 0;
  return r[0] > t[0] && (e += 1), r[1] > t[1] && (e += 2), e;
}
function jr(r, t, e) {
  const n = [
    r[0] - t.forw[0],
    r[1] - t.forw[1]
  ], o = Math.sqrt(n[0] ** 2 + n[1] ** 2) / e[0], i = Math.atan2(n[0], n[1]) - e[1];
  return [
    t.bakw[0] + o * Math.sin(i),
    t.bakw[1] - o * Math.cos(i)
  ];
}
function Gr(r, t, e, n) {
  const s = t[0] - r[0], o = t[1] - r[1];
  if (Math.abs(s) < 1e-12 && Math.abs(o) < 1e-12) return null;
  const i = n[0] - e[0], a = n[1] - e[1], c = e[0] - r[0], f = e[1] - r[1], l = s * a - o * i;
  if (Math.abs(l) < 1e-12) return null;
  const h = (c * a - f * i) / l, u = (c * o - f * s) / l;
  return h <= 1e-10 || u < -1e-10 || u > 1 + 1e-10 ? null : { t: h, point: [r[0] + h * s, r[1] + h * o] };
}
function Wr(r, t, e) {
  const n = e.length;
  let s = -1 / 0, o = null;
  for (let i = 0; i < n; i++) {
    const a = (i + 1) % n, c = Gr(
      r,
      t,
      e[i].bakw,
      e[a].bakw
    );
    c && c.t > s && (s = c.t, o = c.point);
  }
  return o;
}
function fn(r, t) {
  return Math.floor(ln(r, t) / 10) % 36;
}
function ln(r, t) {
  const n = Math.atan2(r[0] - t[0], r[1] - t[1]) * (180 / Math.PI);
  return n < 0 ? n + 360 : n;
}
function qn(r, t, e, n, s, o) {
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
function Kr(r, t, e, n) {
  const s = r[0], o = r[1], i = t[0], a = t[1], c = e[0], f = e[1], l = n[0], h = n[1];
  if (!(Number.isFinite(s) && Number.isFinite(o) && Number.isFinite(i) && Number.isFinite(a) && Number.isFinite(c) && Number.isFinite(f) && Number.isFinite(l) && Number.isFinite(h)) || s === c || s === l || i === c || i === l || s === i && o === a || c === l && f === h) {
    const T = dr(xn([r, t]), xn([e, n]));
    return T.features.length > 0 && T.features[0].geometry ? T.features[0].geometry.coordinates : null;
  }
  const u = s > i || s === i && o > a, m = u ? i : s, b = u ? a : o, g = u ? s : i, k = u ? o : a, M = c > l || c === l && f > h, v = M ? l : c, x = M ? h : f, p = M ? c : l, w = M ? f : h;
  let d, y, S, _, O, B, D, C;
  if (m < v) {
    if (g < v) return null;
    d = v, y = x, S = p, _ = w, O = m, B = b, D = g, C = k;
  } else {
    if (p < m) return null;
    d = m, y = b, S = g, _ = k, O = v, B = x, D = p, C = w;
  }
  const E = ft(d, y, S, _, O, B), N = ft(d, y, S, _, D, C);
  if (E > 0 && N > 0 || E < 0 && N < 0) return null;
  const I = (C - B) * (S - d) - (D - O) * (_ - y), F = (D - O) * (y - B) - (C - B) * (d - O), P = (S - d) * (y - B) - (_ - y) * (d - O);
  if (I === 0) return null;
  const V = F / I, A = P / I;
  return V >= 0 && V <= 1 && A >= 0 && A <= 1 ? [d + V * (S - d), y + V * (_ - y)] : null;
}
function jn(r, t, e) {
  const n = r.length, s = new Array(n).fill(1);
  for (const o of t)
    for (let i = 0; i < n; i++) {
      const a = (i + 1) % n, c = Kr(
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
function mn(r, t, e, n, s) {
  const { convexBuf: o, centroid: i, allGcps: a, minx: c, maxx: f, miny: l, maxy: h } = r, u = s ? void 0 : Ur(o, i, t, n), b = [
    [c, l],
    [f, l],
    [f, h],
    [c, h]
  ].map((S) => ({
    forw: S,
    bakw: s ? s(S) : jr(
      S,
      i,
      u[qr(S, i.forw)]
    )
  }));
  if (b.sort(
    (S, _) => Math.atan2(S.forw[0] - i.forw[0], S.forw[1] - i.forw[1]) - Math.atan2(_.forw[0] - i.forw[0], _.forw[1] - i.forw[1])
  ), s || jn(b, a, i), !e || r.ring?.cornersOnly) return b;
  const g = 4, k = b.map(
    (S) => Math.atan2(S.forw[0] - i.forw[0], S.forw[1] - i.forw[1])
  ), M = b.map(
    (S) => Math.atan2(
      S.bakw[0] - i.bakw[0],
      -(S.bakw[1] - i.bakw[1])
    )
  );
  function v(S) {
    for (let _ = 0; _ < g; _++) {
      const O = (_ + 1) % g, B = k[_], D = _ < g - 1 ? k[O] : k[O] + 2 * Math.PI;
      let C = S;
      for (; C < B; ) C += 2 * Math.PI;
      for (; C >= B + 2 * Math.PI; ) C -= 2 * Math.PI;
      if (C >= B && C < D)
        return { i: _, j: O, frac: (C - B) / (D - B) };
    }
    return { i: 0, j: 1, frac: 0 };
  }
  function x(S) {
    const { i: _, j: O, frac: B } = v(S), D = M[_];
    let E = M[O] - D;
    for (; E > Math.PI; ) E -= 2 * Math.PI;
    for (; E < -Math.PI; ) E += 2 * Math.PI;
    return D + B * E;
  }
  const p = new Set(
    b.map(
      (S) => Math.floor(ln(S.forw, i.forw) / 10) % 36
    )
  ), w = a.map((S) => ({
    forw: S.forw,
    bakw: S.bakw,
    angleDeg: ln(S.forw, i.forw),
    forwDist: Math.hypot(S.forw[0] - i.forw[0], S.forw[1] - i.forw[1])
  })), d = [];
  for (let S = 0; S < 36; S++) {
    if (p.has(S) || r.ring?.skipBins?.has(S)) continue;
    const _ = S * 10, O = w.filter((A) => {
      if (A.forwDist === 0) return !1;
      const T = ((A.angleDeg - _) % 360 + 360) % 360;
      return T < 10 + Un || T > 360 - Un;
    });
    let B = null;
    if (O.length > 0) {
      const A = O.reduce((T, $) => $.forwDist > T.forwDist ? $ : T);
      B = qn(i.forw, A.forw, c, f, l, h);
    }
    if (!B) {
      const A = (_ + 5) % 360 * (Math.PI / 180), T = [
        i.forw[0] + Math.sin(A),
        i.forw[1] + Math.cos(A)
      ];
      B = qn(i.forw, T, c, f, l, h);
    }
    if (!B) continue;
    const [D, C] = B, E = 1e-9 * Math.max(f - c, h - l);
    if ([...b, ...d].some(
      (A) => Math.abs(A.forw[0] - D) <= E && Math.abs(A.forw[1] - C) <= E
    )) continue;
    if (s) {
      d.push({ forw: B, bakw: s(B) });
      continue;
    }
    const N = [B[0] - i.forw[0], B[1] - i.forw[1]], I = Math.atan2(N[0], N[1]), F = x(I), P = [
      i.bakw[0] + Math.sin(F),
      i.bakw[1] - Math.cos(F)
    ], V = Wr(i.bakw, P, b);
    V && d.push({ forw: B, bakw: V });
  }
  const y = [...b, ...d];
  return y.sort(
    (S, _) => Math.atan2(S.forw[0] - i.forw[0], S.forw[1] - i.forw[1]) - Math.atan2(_.forw[0] - i.forw[0], _.forw[1] - i.forw[1])
  ), s || jn(y, a, i), y;
}
function ks(r, t = !1) {
  return mn(r, "plain", t, t ? "farLsq" : "min");
}
function Ss(r, t = !1) {
  return mn(r, "birdeye", t, "min");
}
function Hr(r, t) {
  const e = /* @__PURE__ */ new Set();
  return mn(r, "plain", !0, "min", t).filter(({ forw: [n, s] }) => {
    const o = `${n}:${s}`;
    return e.has(o) ? !1 : (e.add(o), !0);
  });
}
const Gn = (r) => typeof r == "string" && r.startsWith("b");
function Jr(r, t) {
  const e = (n, s) => {
    for (let o = 0; o < 3; o++) {
      const i = n.g[o], a = n.g[(o + 1) % 3];
      if (s.g.every((c) => n.sign * ft(i[0], i[1], a[0], a[1], c[0], c[1]) <= 0)) return !0;
    }
    return !1;
  };
  return !e(r, t) && !e(t, r);
}
function Qr(r) {
  const t = r.features.map((a) => {
    const { a: c, b: f, c: l } = a.properties, h = [c.geom, f.geom, l.geom], u = a.geometry.coordinates[0].slice(0, 3), m = h.map(([M]) => M), b = h.map(([, M]) => M), g = Math.sign(ft(u[0][0], u[0][1], u[1][0], u[1][1], u[2][0], u[2][1])), k = Math.sign(ft(h[0][0], h[0][1], h[1][0], h[1][1], h[2][0], h[2][1]));
    return {
      ids: [c.index, f.index, l.index],
      f: u,
      g: h,
      sign: k,
      ratio: g * k,
      aux: [c.index, f.index, l.index].some(Gn),
      minx: Math.min(...m),
      maxx: Math.max(...m),
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
        l.sign === 0 || l.miny >= c.maxy || c.miny >= l.maxy || !c.aux && !l.aux || Jr(c, l) && (s.add(o[a]), s.add(o[f]));
      }
  }
  const i = /* @__PURE__ */ new Map();
  for (const a of s)
    t[a].ids.forEach((c, f) => {
      Gn(c) && i.set(String(c), t[a].f[f]);
    });
  return [...i.values()];
}
function xo(r) {
  return hn(r, 1 / 0);
}
const Wn = 1e5, Zr = 16;
function hn(r, t) {
  return ti(r), new ei(r).findSegmentIntersections(t).map(
    (s) => Zt([s.x, s.y])
  );
}
function ti(r) {
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
class ei {
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
    (o != this._xx.length || this._xx.length != this._yy.length) && Qt("ArcCollection#initXYData() Counting error"), this.initBounds(), this._arcIter = new xi(this._xx, this._yy);
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
      c = n[h], c > 0 && (f = h * 4, l = ki(t, e, a, c), o[f++] = l[0], o[f++] = l[1], o[f++] = l[2], o[f] = l[3], a += c, i.mergeBounds(l));
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
      (x, p, w, d) => {
        let y = a(d[x]);
        const S = a(d[p]);
        let _ = 0;
        for (; i[y] = i[y] + 2, y != S; )
          _++, _ > c && Qt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${o}`,
            `s1=${y}`,
            `s2=${S}`
          ), y += S > y ? 1 : -1;
      }
    );
    const l = this.getUint32Array(ri(i));
    let h = 0;
    const u = [];
    ii(i, (x) => {
      const p = h;
      h += x, u.push(l.subarray(p, h));
    }), oi(i, 0), this.forEachSegment(
      (x, p, w, d) => {
        let y = a(d[x]);
        const S = a(d[p]);
        let _, O, B = 0;
        for (; _ = i[y], i[y] = _ + 2, O = u[y], O[_] = x, O[_ + 1] = p, y != S; )
          B++, B > c && Qt(
            "findSegmentIntersections() exceeded the stripe iteration limit:",
            `stripeCount=${o}`,
            `s1=${y}`,
            `s2=${S}`
          ), y += S > y ? 1 : -1;
      }
    );
    const m = this.getVertexData(), b = t * Zr;
    let g = 0;
    const k = /* @__PURE__ */ new Set(), M = /* @__PURE__ */ new Map(), v = (x) => {
      g++;
      const p = yi(x);
      return k.has(p) || (k.add(p), M.set(`${x.x}:${x.y}`, x)), M.size >= t || g >= b;
    };
    if (m.xx && m.yy)
      for (f = 0; f < o && !ai(u[f], m.xx, m.yy, v); f++)
        ;
    return Array.from(M.values());
  }
}
function Qt(...r) {
  const t = r.join(" ");
  throw new Error(t);
}
function ge(r) {
  return r ? si(r) ? !0 : ni(r) ? !1 : r.length === 0 ? !0 : r.length > 0 : !1;
}
function ni(r) {
  return r != null && r.toString === String.prototype.toString;
}
function si(r) {
  return Array.isArray(r);
}
function ri(r, t) {
  ge(r) || Qt("utils.sum() expects an array, received:", r);
  let e = 0, n;
  for (let s = 0, o = r.length; s < o; s++)
    n = r[s], n && (e += n);
  return e;
}
function ii(r, t, e) {
  if (!ge(r))
    throw new Error(`#forEach() takes an array-like argument. ${r}`);
  for (let n = 0, s = r.length; n < s; n++)
    t.call(e, r[n], n);
}
function oi(r, t) {
  for (let e = 0, n = r.length; e < n; e++)
    r[e] = t;
  return r;
}
function ai(r, t, e, n) {
  const s = r.length - 2;
  let o, i, a, c, f, l, h, u, m, b, g, k, M, v, x, p, w;
  for (wi(t, r), p = 0; p < s; ) {
    for (o = r[p], i = r[p + 1], f = t[o], l = t[i], m = e[o], b = e[i], w = p; w < s && (w += 2, a = r[w], h = t[a], !(l < h)); ) {
      if (g = e[a], c = r[w + 1], u = t[c], k = e[c], m >= g) {
        if (m > k && b > g && b > k) continue;
      } else if (m < k && b < g && b < k) continue;
      if (!(o == a || o == c || i == a || i == c) && (M = ci(
        f,
        m,
        l,
        b,
        h,
        g,
        u,
        k
      ), M && (v = [o, i], x = [a, c], n(Hn(M, v, x, t, e)) || M.length == 4 && n(Hn(M.slice(2), v, x, t, e)))))
        return !0;
    }
    p += 2;
  }
  return !1;
}
function ci(r, t, e, n, s, o, i, a) {
  const c = fi(r, t, e, n, s, o, i, a);
  let f = null;
  return c && (f = li(r, t, e, n, s, o, i, a), f ? mi(r, t, e, n, s, o, i, a) && (f = null) : f = pi(r, t, e, n, s, o, i, a)), f;
}
function fi(r, t, e, n, s, o, i, a) {
  return he(r, t, e, n, s, o) * he(r, t, e, n, i, a) <= 0 && he(s, o, i, a, r, t) * he(s, o, i, a, e, n) <= 0;
}
function he(r, t, e, n, s, o) {
  return Ms(r - s, t - o, e - s, n - o);
}
function Ms(r, t, e, n) {
  return r * n - t * e;
}
function li(r, t, e, n, s, o, i, a) {
  let c = Ae(r, t, e, n, s, o, i, a), f;
  return c && (f = ui(c[0], c[1], r, t, e, n, s, o, i, a), f == 1 ? c = Ae(e, n, r, t, s, o, i, a) : f == 2 ? c = Ae(s, o, i, a, r, t, e, n) : f == 3 && (c = Ae(i, a, s, o, r, t, e, n))), c && gi(c, r, t, e, n, s, o, i, a), c;
}
function Ae(r, t, e, n, s, o, i, a) {
  const c = Ms(e - r, n - t, i - s, a - o), f = 1e-18;
  let l;
  if (c === 0) return null;
  const h = he(s, o, i, a, r, t) / c;
  return c <= f && c >= -f ? l = hi(r, t, e, n, s, o, i, a) : l = [r + h * (e - r), t + h * (n - t)], l;
}
function hi(r, t, e, n, s, o, i, a) {
  let c = null;
  return !Pt(r, s, i) && !Pt(t, o, a) ? c = [r, t] : !Pt(e, s, i) && !Pt(n, o, a) ? c = [e, n] : !Pt(s, r, e) && !Pt(o, t, n) ? c = [s, o] : !Pt(i, r, e) && !Pt(a, t, n) && (c = [i, a]), c;
}
function Pt(r, t, e) {
  let n;
  return t < e ? n = r < t || r > e : t > e ? n = r > t || r < e : n = r != t, n;
}
function ui(r, t, ...e) {
  let n = -1, s = 1 / 0, o;
  for (let i = 0, a = 0, c = e.length; a < c; i++, a += 2)
    o = di(r, t, e[a], e[a + 1]), o < s && (s = o, n = i);
  return n;
}
function di(r, t, e, n) {
  const s = r - e, o = t - n;
  return s * s + o * o;
}
function gi(r, t, e, n, s, o, i, a, c) {
  let f = r[0], l = r[1];
  f = Ie(f, t, n), f = Ie(f, o, a), l = Ie(l, e, s), l = Ie(l, i, c), r[0] = f, r[1] = l;
}
function Ie(r, t, e) {
  let n;
  return Pt(r, t, e) && (n = Math.abs(r - t) < Math.abs(r - e) ? t : e, r = n), r;
}
function pi(r, t, e, n, s, o, i, a) {
  const c = Math.min(r, e, s, i), f = Math.max(r, e, s, i), l = Math.min(t, n, o, a), h = Math.max(t, n, o, a), u = h - l > f - c;
  let m = [];
  return (u ? zt(t, l, h) : zt(r, c, f)) && m.push(r, t), (u ? zt(n, l, h) : zt(e, c, f)) && m.push(e, n), (u ? zt(o, l, h) : zt(s, c, f)) && m.push(s, o), (u ? zt(a, l, h) : zt(i, c, f)) && m.push(i, a), (m.length != 2 && m.length != 4 || m.length == 4 && m[0] == m[2] && m[1] == m[3]) && (m = null), m;
}
function mi(r, t, e, n, s, o, i, a) {
  return r == s && t == o || r == i && t == a || e == s && n == o || e == i && n == a;
}
function zt(r, t, e) {
  return r > t && r < e;
}
function wi(r, t) {
  vi(r, t), Es(r, t, 0, t.length - 2);
}
function vi(r, t) {
  for (let e = 0, n = t.length; e < n; e += 2)
    r[t[e]] > r[t[e + 1]] && bi(t, e, e + 1);
}
function bi(r, t, e) {
  const n = r[t];
  r[t] = r[e], r[e] = n;
}
function Es(r, t, e, n) {
  let s = e, o = n, i, a;
  for (; s < n; ) {
    for (i = r[t[e + n >> 2 << 1]]; s <= o; ) {
      for (; r[t[s]] < i; ) s += 2;
      for (; r[t[o]] > i; ) o -= 2;
      s <= o && (a = t[s], t[s] = t[o], t[o] = a, a = t[s + 1], t[s + 1] = t[o + 1], t[o + 1] = a, s += 2, o -= 2);
    }
    if (o - e < 40 ? Kn(r, t, e, o) : Es(r, t, e, o), n - s < 40) {
      Kn(r, t, s, n);
      return;
    }
    e = s, o = n;
  }
}
function Kn(r, t, e, n) {
  let s, o;
  for (let i = e + 2; i <= n; i += 2) {
    s = t[i], o = t[i + 1];
    let a;
    for (a = i - 2; a >= e && r[s] < r[t[a]]; a -= 2)
      t[a + 2] = t[a], t[a + 3] = t[a + 1];
    t[a + 2] = s, t[a + 3] = o;
  }
}
function Hn(r, t, e, n, s) {
  const o = r[0], i = r[1];
  t = Jn(o, i, t[0], t[1], n, s), e = Jn(o, i, e[0], e[1], n, s);
  const a = t[0] < e[0] ? t : e, c = a == t ? e : t;
  return { x: o, y: i, a, b: c };
}
function Jn(r, t, e, n, s, o) {
  let i = e < n ? e : n, a = i === e ? n : e;
  return s[i] == r && o[i] == t ? a = i : s[a] == r && o[a] == t && (i = a), [i, a];
}
function yi(r) {
  return `${r.a.join(",")};${r.b.join(",")}`;
}
class xi {
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
function ki(r, t, e, n) {
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
function Re(r) {
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
function _s(r, t, e) {
  const n = Re(t.forw), s = Re(t.bakw);
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
function Qn(r, t, e) {
  const n = Re(t.forw), s = Re(t.bakw);
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
function Si(r, t) {
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
const Mi = 10;
function Ei(r, t, e, n, s, o) {
  if (!r && !t) return !1;
  const i = r ? 0 : 1, a = 1 - i, c = e[i], f = e[a];
  if (!c || !f) return !1;
  const l = At(f.geom);
  let h = !1, u = !1;
  for (let m = 0; m <= 1; m++) {
    const b = n[m];
    if (!b) continue;
    const g = [String(b.prop.index), String(c.prop.index)].sort().join("-"), k = s[g];
    if (!k || k.length < 2) continue;
    const M = k.find(
      (B) => B.bakw !== o[i].bakw
    );
    if (!M) continue;
    const x = ue(M.bakw).find(
      (B) => String(B.prop.index) !== String(b.prop.index) && String(B.prop.index) !== String(c.prop.index)
    );
    if (!x) continue;
    h = !0;
    const p = At(x.geom), w = At(b.geom), d = At(c.geom), y = d[0] - w[0], S = d[1] - w[1], _ = y * (l[1] - w[1]) - S * (l[0] - w[0]), O = y * (p[1] - w[1]) - S * (p[0] - w[0]);
    if (_ * O > 0) {
      u = !0;
      break;
    }
  }
  return h && !u;
}
function _i(r, t, e, n) {
  if (!r && !t) return !1;
  if (e[0] && e[1] && n[0] && n[1]) {
    const s = n.map((l) => At(l.geom)), o = e.map((l) => At(l.geom)), i = s[1][0] - s[0][0], a = s[1][1] - s[0][1], c = i * (o[0][1] - s[0][1]) - a * (o[0][0] - s[0][0]), f = i * (o[1][1] - s[0][1]) - a * (o[1][0] - s[0][0]);
    return c * f < 0;
  }
  return !1;
}
function Ai(r, t, e, n) {
  const s = Si(e, n), o = /* @__PURE__ */ new Set();
  let i = !1;
  for (let a = 0; a < Mi; a++) {
    let c = !1;
    for (const f of Object.keys(t)) {
      if (o.has(f)) continue;
      o.add(f);
      const l = t[f];
      if (!l || l.length < 2) continue;
      const h = f.split("-");
      if (h.length !== 2 || s.has(f)) continue;
      const u = ue(l[0].bakw), m = ue(l[1].bakw), b = ue(l[0].forw), g = ue(l[1].forw), k = h.map(
        (A) => u.find((T) => `${T.prop.index}` === A) || m.find((T) => `${T.prop.index}` === A)
      ), M = h.map(
        (A) => b.find((T) => `${T.prop.index}` === A) || g.find((T) => `${T.prop.index}` === A)
      );
      if (k.some((A) => !A) || M.some((A) => !A))
        continue;
      const v = [u, m].map(
        (A) => A.find((T) => !h.includes(`${T.prop.index}`))
      ), x = [b, g].map(
        (A) => A.find((T) => !h.includes(`${T.prop.index}`))
      );
      if (v.some((A) => !A) || x.some((A) => !A))
        continue;
      const p = l[0].bakw.geometry.coordinates[0].slice(0, 3).map((A) => At(A)), w = l[1].bakw.geometry.coordinates[0].slice(0, 3).map((A) => At(A)), d = l[0].forw.geometry.coordinates[0].slice(0, 3).map((A) => At(A)), y = l[1].forw.geometry.coordinates[0].slice(0, 3).map((A) => At(A)), S = Ne(p), _ = Ne(w), O = Ne(d), B = Ne(y), D = Ei(
        S,
        _,
        v,
        k,
        t,
        l
      ), C = _i(
        O,
        B,
        v,
        k
      );
      if (!(D || C || Zn(
        At(v[0].geom),
        w
      ) || Zn(
        At(v[1].geom),
        p
      )))
        continue;
      const N = M.map(
        (A) => At(A.geom)
      ), I = x.map(
        (A) => At(A.geom)
      ), F = Ii([
        ...N,
        ...I
      ]), P = Ni(F), V = ts(
        N[0],
        N[1],
        I[0]
      ) + ts(
        N[0],
        N[1],
        I[1]
      );
      un(P, V) && (Qn(t, l[0], r), Qn(t, l[1], r), k.forEach((A) => {
        if (!A) return;
        const T = [
          A.geom,
          v[0].geom,
          v[1].geom,
          A.geom
        ], $ = {
          a: A.prop,
          b: v[0].prop,
          c: v[1].prop
        }, X = me([T], $), q = an(X);
        _s(t, {
          forw: q,
          bakw: X
        }, r);
      }), c = !0, i = !0);
    }
    if (!c) break;
  }
  return i;
}
function At(r) {
  return [r[0], r[1]];
}
function Zn(r, t) {
  const [e, n] = t[0], [s, o] = t[1], [i, a] = t[2], c = i - e, f = a - n, l = s - e, h = o - n, u = r[0] - e, m = r[1] - n, b = c * c + f * f, g = c * l + f * h, k = c * u + f * m, M = l * l + h * h, v = l * u + h * m, x = b * M - g * g;
  if (x === 0) return !1;
  const p = 1 / x, w = (M * k - g * v) * p, d = (b * v - g * k) * p, y = 1e-9;
  return w >= -y && d >= -y && w + d <= 1 + y;
}
function Ii(r) {
  const t = r.map((i) => i.slice()).filter(
    (i, a, c) => c.findIndex(
      (f) => un(f[0], i[0]) && un(f[1], i[1])
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
function Ni(r) {
  if (r.length < 3) return 0;
  let t = 0;
  for (let e = 0; e < r.length; e++) {
    const [n, s] = r[e], [o, i] = r[(e + 1) % r.length];
    t += n * i - o * s;
  }
  return Math.abs(t) / 2;
}
function ts(r, t, e) {
  return Math.abs(
    (r[0] * (t[1] - e[1]) + t[0] * (e[1] - r[1]) + e[0] * (r[1] - t[1])) / 2
  );
}
function un(r, t, e = 1e-9) {
  return Math.abs(r - t) <= e;
}
const Bi = (r) => typeof r == "string" && r.startsWith("b");
function Oi(r, t) {
  const e = (n, s) => {
    for (let o = 0; o < 3; o++) {
      const i = n.g[o], a = n.g[(o + 1) % 3];
      if (s.g.every((c) => n.sign * ft(i[0], i[1], a[0], a[1], c[0], c[1]) <= 0)) return !0;
    }
    return !1;
  };
  return !e(r, t) && !e(t, r);
}
function Fi(r, t, e) {
  if (t.length === 0) return [];
  const n = r.features.map((g) => {
    const { a: k, b: M, c: v } = g.properties, x = [k.geom, M.geom, v.geom], [p, w, d] = g.geometry.coordinates[0], y = x.map(([B]) => B), S = x.map(([, B]) => B), _ = Math.sign(ft(p[0], p[1], w[0], w[1], d[0], d[1])), O = Math.sign(ft(x[0][0], x[0][1], x[1][0], x[1][1], x[2][0], x[2][1]));
    return {
      ids: [k.index, M.index, v.index].map(String),
      g: x,
      sign: O,
      ratio: _ * O,
      aux: [k.index, M.index, v.index].some(Bi),
      minx: Math.min(...y),
      maxx: Math.max(...y),
      miny: Math.min(...S),
      maxy: Math.max(...S)
    };
  }), s = n.map((g) => g.ratio), o = s.reduce((g, k) => g + k, 0) < 0 ? -1 : 1, i = (g, k) => g < k ? `${g}|${k}` : `${k}|${g}`, a = /* @__PURE__ */ new Map();
  n.forEach((g, k) => {
    for (let M = 0; M < 3; M++) {
      const v = i(g.ids[M], g.ids[(M + 1) % 3]), x = a.get(v);
      x ? x.push(k) : a.set(v, [k]);
    }
  });
  const c = ([g, k]) => i(String(e[g]), String(e[k])), f = /* @__PURE__ */ new Set();
  for (const g of t) for (const k of a.get(c(g)) ?? []) f.add(k);
  const l = (g) => n[g].aux || f.has(g), h = /* @__PURE__ */ new Set();
  n.forEach((g, k) => {
    l(k) && (s[k] === 0 || s[k] !== o) && h.add(k);
  });
  const u = n.map((g, k) => k).sort((g, k) => n[g].minx - n[k].minx);
  for (let g = 0; g < u.length; g++) {
    const k = n[u[g]];
    if (k.sign !== 0)
      for (let M = g + 1; M < u.length; M++) {
        const v = n[u[M]];
        if (v.minx >= k.maxx) break;
        v.sign === 0 || v.miny >= k.maxy || k.miny >= v.maxy || !l(u[g]) && !l(u[M]) || Oi(k, v) && (h.add(u[g]), h.add(u[M]));
      }
  }
  if (h.size === 0) return [];
  const m = t.filter((g) => (a.get(c(g)) ?? []).some((k) => h.has(k)));
  if (m.length > 0) return m;
  const b = /* @__PURE__ */ new Set();
  for (const g of h) for (const k of n[g].ids) k.startsWith("b") || b.add(k);
  return t.filter(
    ([g, k]) => b.has(String(e[g])) || b.has(String(e[k]))
  );
}
const ie = 0, Pe = (r) => r + 1, Dt = 1, Ot = 2, es = 4, ns = 1e-6, Ti = 0.2, Ri = 4, As = Math.sign(
  Ve(0, 0, 1, 0, 0, 1, 0.25, 0.25) * ft(0, 0, 1, 0, 0, 1)
), dt = (r) => [
  r[0],
  r[1]
];
function ss(r) {
  const t = r.length;
  if (t < 3) return !1;
  for (let e = 0; e < t; e++) {
    const n = r[e], s = r[(e + 1) % t], o = r[(e + 2) % t];
    if (Ht(n, s, o) === 0 && (n[0] - s[0]) * (o[0] - s[0]) + (n[1] - s[1]) * (o[1] - s[1]) > 0)
      return !1;
    for (let i = e + 2; i < t; i++) {
      if (e === 0 && i === t - 1) continue;
      const a = r[i], c = r[(i + 1) % t];
      if (Fe(n[0], n[1], s[0], s[1], a[0], a[1], c[0], c[1]))
        return !1;
    }
  }
  return !0;
}
const rs = 2 ** 26;
function rt(r, t) {
  return r < t ? r * rs + t : t * rs + r;
}
const Ht = (r, t, e) => Math.sign(ft(r[0], r[1], t[0], t[1], e[0], e[1])), Be = (r, t, e) => Math.abs((t[0] - r[0]) * (e[1] - r[1]) - (e[0] - r[0]) * (t[1] - r[1]));
class Pi {
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
        const c = rt(o[a], o[(a + 1) % 3]), f = s.get(c);
        f ? f.push(i) : s.set(c, [i]);
      }
    });
    for (let o = 0; o < this.triangles.length; o++) {
      const i = this.triangles[o];
      if (t(i))
        for (let a = 0; a < 3; a++) {
          const c = i[a], f = i[(a + 1) % 3], l = i[(a + 2) % 3], h = rt(c, f);
          if (n.has(h)) continue;
          const u = s.get(h);
          if (u.length !== 2) continue;
          const m = u[0] === o ? u[1] : u[0], b = this.triangles[m].find((M) => M !== c && M !== f), g = [
            [c, b, l],
            [b, f, l]
          ], k = e([i, this.triangles[m]], g, rt(l, b));
          if (k) {
            for (const M of k) n.add(M);
            return this.triangles[o] = g[0], this.triangles[m] = g[1], !0;
          }
        }
    }
    return !1;
  }
}
class Le {
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
      const c = rt(o[a], o[(a + 1) % 3]), f = this.byEdge.get(c);
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
      const o = rt(e[s], e[(s + 1) % 3]), i = this.byEdge.get(o);
      i.length === 1 ? this.byEdge.delete(o) : i.splice(i.indexOf(t), 1);
    }
    this.bad.delete(t);
    const n = this.forbiddenGroup(e[0], e[1], e[2]);
    n === ie ? this.forbiddenBoundary-- : n !== void 0 && this.forbiddenEdge--;
  }
  hasEdge(t, e) {
    return this.byEdge.has(rt(t, e));
  }
  flagsOf(t, e) {
    return this.edgeFlags.get(rt(t, e)) ?? 0;
  }
  setFlag(t, e, n) {
    const s = rt(t, e);
    this.edgeFlags.set(s, (this.edgeFlags.get(s) ?? 0) | n);
  }
  clearFlag(t, e, n) {
    const s = rt(t, e), o = (this.edgeFlags.get(s) ?? 0) & ~n;
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
    return Be(o.forw, i.forw, a.forw) >= ns && Be(o.bakw, i.bakw, a.bakw) >= ns;
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
        const c = i[a], f = i[(a + 1) % 3], l = this.byEdge.get(rt(c, f));
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
    if (!e.unlimited && t.size > this.triangles.size * Ti)
      return n("tooLarge");
    const s = new Set(e.remove ?? []), o = [], i = /* @__PURE__ */ new Set();
    let a = 0;
    for (const R of t) {
      const z = this.positive(R);
      if (!z) return n("notDisk");
      for (let G = 0; G < 3; G++) {
        const st = z[G], at = z[(G + 1) % 3], wt = this.byEdge.get(rt(st, at));
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
        if (!ss(l.map((z) => f(z)[R])))
          return n("boundary");
    }
    const h = [...i, ...c], u = new Map(h.map((R, z) => [R, z])), m = /* @__PURE__ */ new Set(), b = [];
    for (const [R, z] of o)
      m.add(rt(R, z)), b.push([u.get(R), u.get(z)]);
    const g = /* @__PURE__ */ new Set();
    if (l)
      for (let R = 0; R < l.length; R++) {
        const z = l[R], G = l[(R + 1) % l.length];
        g.add(rt(z, G)), b.push([u.get(z), u.get(G)]);
      }
    const k = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Set(), v = new Set(
      (e.release ?? []).map(([R, z]) => rt(R, z))
    );
    for (const R of t) {
      const z = this.triangles.get(R);
      for (let G = 0; G < 3; G++) {
        const st = z[G], at = z[(G + 1) % 3], wt = rt(st, at);
        m.has(wt) || (M.add(wt), (this.edgeFlags.get(wt) ?? 0) & (Dt | Ot) && (s.has(st) || s.has(at) || v.has(wt) || k.set(wt, [st, at])));
      }
    }
    for (const [R, z] of e.constrain ?? []) {
      if (!u.has(R) || !u.has(z)) return n("constraint");
      const G = rt(R, z);
      !m.has(G) && !g.has(G) && k.set(G, [R, z]);
    }
    for (const [R, z] of k.values())
      b.push([u.get(R), u.get(z)]);
    let x;
    const p = [];
    try {
      const R = $e.from(h.map((st) => f(st).forw));
      if (R.triangles.length === 0) return n("constraint");
      let z = new Jt(R, b);
      const G = (e.soft ?? []).filter(
        ([st, at]) => u.has(st) && u.has(at) && !m.has(rt(st, at)) && !g.has(rt(st, at)) && !k.has(rt(st, at))
      );
      if (G.length > 0) {
        const st = z.snapshot();
        for (const at of G)
          try {
            z.constrainOne(u.get(at[0]), u.get(at[1])), p.push([at[0], at[1], at[2]]);
          } catch {
            z = Jt.restore(st), z.constrainAll(
              p.map(([wt, qt]) => [
                u.get(wt),
                u.get(qt)
              ])
            );
          }
      }
      x = z.del;
    } catch {
      return n("constraint");
    }
    const { triangles: w, halfedges: d } = x, y = w.length / 3, S = (R) => f(h[R]).forw;
    let _ = 0, O = 0;
    for (let R = 0; R < y; R++) {
      const z = S(w[R * 3]), G = S(w[R * 3 + 1]), st = S(w[R * 3 + 2]), at = Be(z, G, st);
      if (at > O) {
        const wt = Ht(z, G, st);
        wt !== 0 && (O = at, _ = wt);
      }
    }
    if (_ === 0) return n("count");
    const B = /* @__PURE__ */ new Map();
    for (let R = 0; R < w.length; R++)
      B.set(w[R] * h.length + w[Bt(R)], R);
    const D = /* @__PURE__ */ new Set();
    for (const [R, z] of o) {
      const G = u.get(R), st = u.get(z), at = B.get(
        _ > 0 ? G * h.length + st : st * h.length + G
      );
      if (at === void 0) return n("pointOutside");
      D.add(at);
    }
    const C = (R) => g.size > 0 && g.has(rt(h[w[R]], h[w[Bt(R)]])), E = /* @__PURE__ */ new Set(), N = [];
    for (const R of D) {
      const z = Math.floor(R / 3);
      E.has(z) || (E.add(z), N.push(z));
    }
    for (let R = 0; R < N.length; R++)
      for (let z = N[R] * 3; z < N[R] * 3 + 3; z++) {
        if (D.has(z) || C(z)) continue;
        const G = d[z];
        if (G === -1 || D.has(G)) return n("pointOutside");
        const st = Math.floor(G / 3);
        E.has(st) || (E.add(st), N.push(st));
      }
    for (const R of D) {
      const z = d[R];
      if (z !== -1 && !D.has(z) && E.has(Math.floor(z / 3)))
        return n("pointOutside");
    }
    for (let R = 0; R < w.length; R++) {
      if (!C(R) || !E.has(Math.floor(R / 3))) continue;
      const z = d[R];
      if (z !== -1 && E.has(Math.floor(z / 3))) return n("boundary");
    }
    const I = [], F = /* @__PURE__ */ new Set();
    for (const R of E) {
      const z = h[w[R * 3]], G = h[w[R * 3 + 1]], st = h[w[R * 3 + 2]];
      F.add(z).add(G).add(st), I.push(_ === this.forwSign ? [z, G, st] : [z, st, G]);
    }
    for (const R of c) if (!F.has(R)) return n("pointOutside");
    const P = /* @__PURE__ */ new Set();
    for (const [R, z, G] of I)
      P.add(rt(R, z)).add(rt(z, G)).add(rt(G, R));
    for (const R of k.keys())
      if (!P.has(R)) return n("constraint");
    for (const R of g)
      if (!P.has(R)) return n("boundary");
    const V = p.map(([R, z]) => rt(R, z)).filter((R) => P.has(R)), A = /* @__PURE__ */ new Set([
      ...m,
      ...g,
      ...k.keys(),
      ...V
    ]), T = new Pi(I), $ = (R) => Ht(f(R[0]).forw, f(R[1]).forw, f(R[2]).forw) === this.forwSign && this.okNew(R[0], R[1], R[2], f), X = (R) => this.forbiddenGroup(R[0], R[1], R[2]) !== void 0, q = e.allowBad || e.forwOnly, Y = e.forwOnly ? 0 : T.repair(
      (R) => !this.okNew(R[0], R[1], R[2], f),
      (R, z) => z.every($) ? [] : void 0,
      A
    );
    if (!q) {
      for (const R of T.triangles) if (!$(R)) return n("notStrict");
    }
    let L = 0;
    for (const R of t) {
      const [z, G, st] = this.triangles.get(R);
      this.forbiddenGroup(z, G, st) !== void 0 && L++;
    }
    const U = () => T.triangles.filter(X).length, W = [];
    let H = 0;
    if (U() > L && (H = T.repair(
      X,
      (R, z, G) => {
        if (z.every($) && !(z.filter(X).length >= R.filter(X).length))
          return W.push(G), [G];
      },
      A,
      () => U() <= L
    ), U() > L && !q))
      return n("forbidden");
    I.splice(0, I.length, ...T.triangles);
    for (const [R, z] of e.move ?? []) {
      const G = this.vertices.get(R);
      G.forw = dt(z.forw), G.bakw = dt(z.bakw);
    }
    const Q = [...t];
    for (const R of Q) this.removeTriangle(R);
    const K = I.map(([R, z, G]) => this.addTriangle(R, z, G));
    for (const R of M) {
      const z = (this.edgeFlags.get(R) ?? 0) & ~es;
      z && this.byEdge.has(R) ? this.edgeFlags.set(R, z) : this.edgeFlags.delete(R);
    }
    for (const [R, z] of e.release ?? [])
      !s.has(R) && !s.has(z) && this.clearFlag(R, z, Dt);
    for (const [R, z, G] of e.constrain ?? [])
      G && this.setFlag(R, z, G);
    for (const [R, z, G] of p)
      G && this.hasEdge(R, z) && this.setFlag(R, z, G);
    for (const R of W)
      this.byEdge.has(R) && this.edgeFlags.set(R, (this.edgeFlags.get(R) ?? 0) | es);
    for (const R of s) this.dropVertex(R);
    l && (this.boundarySimple = a === 0 && e.replacesWholeBoundary ? !0 : this.computeBoundarySimple()), this.revision++;
    const tt = new Set(Q), et = new Set(K);
    let lt = 0;
    return e.noPolish || (lt = this.polish(
      o,
      Ri * o.length,
      tt,
      et,
      e.forwOnly
    )), {
      ok: !0,
      removed: [...tt],
      added: [...et],
      soft: p.map(([R, z]) => [R, z]),
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
    const i = this.byEdge.get(rt(t, e));
    if (!i || i.length !== 2) return;
    const a = this.positive(i[0]);
    if (!a) return;
    const c = a.findIndex(
      (M, v) => (M === t || M === e) && (a[(v + 1) % 3] === t || a[(v + 1) % 3] === e)
    ), f = a[c], l = a[(c + 1) % 3], h = a[(c + 2) % 3], u = this.triangles.get(i[1]).find((M) => M !== t && M !== e), m = [
      [f, u, h],
      [u, l, h]
    ], b = this.vertexAt;
    for (const [M, v, x] of m)
      if (Ht(b(M).forw, b(v).forw, b(x).forw) <= 0 || !o && !this.okNew(M, v, x)) return;
    const g = (M) => M.filter(([v, x, p]) => this.forbiddenGroup(v, x, p) !== void 0).length, k = i.map((M) => this.triangles.get(M));
    if (!(g(m) > g(k))) {
      for (const M of [...i])
        this.removeTriangle(M), s?.has(M) ? s.delete(M) : n?.add(M);
      for (const [M, v, x] of m) {
        const p = this.forwSign > 0 ? this.addTriangle(M, v, x) : this.addTriangle(M, x, v);
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
      const [f, l] = i[c], h = rt(f, l);
      if ((this.edgeFlags.get(h) ?? 0) !== 0) continue;
      const u = this.byEdge.get(h);
      if (!u || u.length !== 2) continue;
      const m = this.positive(u[0]);
      if (!m) continue;
      const b = this.triangles.get(u[1]).find((p) => p !== f && p !== l), [g, k, M, v] = [...m, b].map((p) => this.vertices.get(p).forw);
      if (Ve(g[0], g[1], k[0], k[1], M[0], M[1], v[0], v[1]) * As <= 0)
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
        if (rt(c, f) === s) {
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
      (e) => ss(t.map((n) => this.vertices.get(n)[e]))
    ) : !1;
  }
  /**
   * 網を複製する（全部組み直しの中の試行で、もとの網を保つために使う）。
   *
   * @param shareVertices 頂点の表の中身（座標・群）を、もとの網と共有する。複製した網で、今ある頂点を
   *   動かさない・群を変えないとき（頂点の追加と削除・三角形の差し替えだけのとき）に限る
   */
  clone(t = !1) {
    const e = new Le(this.sigma, this.forwSign);
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
            if (!((this.edgeFlags.get(rt(a, c)) ?? 0) & Dt) && this.flipEdge(a, c)) {
              this.edgeFlags.delete(rt(a, c)), n = !0, t++;
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
    for (const [l, [h, u, m]] of this.triangles) {
      this.ok(h, u, m) || t.push(l);
      const b = this.forbiddenGroup(h, u, m);
      b === ie ? e++ : b !== void 0 && n++, s += Be(
        this.vertices.get(h).forw,
        this.vertices.get(u).forw,
        this.vertices.get(m).forw
      ) / 2;
      for (const [g, k] of [
        [h, u],
        [u, m],
        [m, h]
      ]) {
        const M = rt(g, k);
        i.set(M, (i.get(M) ?? 0) + 1), this.byEdge.get(M)?.includes(l) || (o = !1), this.byVertex.get(g)?.has(l) || (o = !1);
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
const is = (r, t, e) => Math.sign(ft(r[0], r[1], t[0], t[1], e[0], e[1]));
function Di(r, t, e, n, s) {
  const o = /* @__PURE__ */ new Map();
  for (const m of r) {
    const { index: b, geom: g } = m.properties.target;
    o.set(b, { forw: m.geometry.coordinates, bakw: g });
  }
  let i = 0, a = 0;
  for (const m of t.features) {
    const { a: b, b: g, c: k } = m.properties, [M, v, x] = [b, g, k].map(({ index: w }) => o.get(w));
    if (!M || !v || !x) return;
    const p = is(M.forw, v.forw, x.forw);
    a += p, i += p * is(M.bakw, v.bakw, x.bakw);
  }
  if ((i < 0 ? -1 : 1) !== s) return;
  const c = new Le(s, a < 0 ? -1 : 1), f = { mesh: c, indexOf: /* @__PURE__ */ new Map(), interior: [], ring: [] }, l = /* @__PURE__ */ new Map(), h = r.map(() => []);
  let u = 1;
  for (const [m, b] of e)
    m < n && h[m].push(u), h[b].push(u), b < n && u++;
  r.forEach((m, b) => {
    const { index: g, geom: k } = m.properties.target, M = typeof g == "string" && g.startsWith("b"), v = c.addVertex(
      M ? { kind: "boundary", order: f.ring.length } : typeof g == "number" ? { kind: "gcp", id: g } : { kind: "edgeNode", edge: -1, order: b },
      m.geometry.coordinates,
      k,
      M ? [ie] : h[b]
    );
    l.set(g, v), f.indexOf.set(v, g), (M ? f.ring : f.interior).push(v);
  });
  for (const m of t.features) {
    const { a: b, b: g, c: k } = m.properties;
    c.addTriangle(l.get(b.index), l.get(g.index), l.get(k.index));
  }
  for (const [m, b] of e)
    c.setFlag(f.interior[m], f.interior[b], Dt);
  return c.boundarySimple = c.computeBoundarySimple(), f;
}
function Ci(r) {
  return {
    mesh: r.mesh.clone(!0),
    indexOf: new Map(r.indexOf),
    interior: [...r.interior],
    ring: [...r.ring]
  };
}
function Vi(r) {
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
function Is(r, t) {
  const { mesh: e } = r, n = r.ring.length;
  for (let g = 0; g < n; g++)
    if (e.byEdge.get(rt(r.ring[g], r.ring[(g + 1) % n]))?.length !== 1)
      return { ok: !1, reason: "bandNotAnnulus" };
  for (const g of r.ring) {
    let k = 0;
    for (const M of e.byVertex.get(g)) {
      const v = e.triangles.get(M);
      for (let x = 0; x < 3; x++) {
        const p = v[x], w = v[(x + 1) % 3];
        (p === g || w === g) && e.byEdge.get(rt(p, w)).length === 1 && k++;
      }
    }
    if (k !== 2) return { ok: !1, reason: "bandNotAnnulus" };
  }
  const s = new Set(t.extra ?? []);
  for (const g of r.ring)
    for (const k of e.byVertex.get(g)) s.add(k);
  const o = (t.addPoints ?? []).map(({ index: g, forw: k, bakw: M }) => ({
    index: g,
    vertex: e.addVertex({ kind: "edgeNode", edge: -1, order: -1 }, k, M)
  })), i = t.vertices.map(
    ({ forw: g, bakw: k }, M) => e.addVertex({ kind: "boundary", order: M }, g, k, [ie])
  ), a = [...r.interior, ...o.map(({ vertex: g }) => g)], c = new Set(t.edit?.remove ?? []), f = [];
  for (const [g, k] of e.edgeFlags)
    k & Ot && f.push([g, k]);
  for (const [g, k] of f)
    k & ~Ot ? e.edgeFlags.set(g, k & ~Ot) : e.edgeFlags.delete(g);
  const l = [], h = [];
  for (const [g, k] of t.hull) {
    const M = a[g], v = a[k];
    if (M === void 0 || v === void 0 || c.has(M) || c.has(v)) continue;
    l.push([M, v]);
    const x = e.byEdge.get(rt(M, v));
    x && !x.every((p) => s.has(p)) ? e.setFlag(M, v, Ot) : h.push([M, v, Ot]);
  }
  const u = e.replace(s, {
    ...t.edit,
    remove: [...r.ring, ...t.edit?.remove ?? []],
    add: [...i, ...o.map(({ vertex: g }) => g), ...t.edit?.add ?? []],
    outerRing: i,
    replacesWholeBoundary: !0,
    soft: h,
    allowBad: t.allowBad,
    forwOnly: t.forwOnly,
    unlimited: !0
  });
  if (!u.ok) {
    for (const g of [...i].reverse()) e.dropVertex(g);
    for (const { vertex: g } of [...o].reverse()) e.dropVertex(g);
    for (const [g, k] of e.edgeFlags)
      k & Ot && (k & ~Ot ? e.edgeFlags.set(g, k & ~Ot) : e.edgeFlags.delete(g));
    for (const [g, k] of f) e.edgeFlags.set(g, (e.edgeFlags.get(g) ?? 0) | k);
    return u;
  }
  for (const g of r.ring) r.indexOf.delete(g);
  i.forEach((g, k) => r.indexOf.set(g, `b${k}`));
  for (const { index: g, vertex: k } of o) r.indexOf.set(k, g);
  r.ring = i, r.interior = a;
  const m = new Map(a.map((g, k) => [g, k])), b = [];
  for (const [g, k] of l)
    e.hasEdge(g, k) && (e.setFlag(g, k, Ot), b.push([m.get(g), m.get(k)]));
  return { ok: !0, applied: b, removed: u.removed, added: u.added };
}
function $i(r) {
  const { mesh: t } = r;
  let e = 0;
  for (const n of t.bad)
    t.triangles.get(n).some((o) => t.vertices.get(o).ref.kind === "boundary") && e++;
  return e;
}
const Li = 4, os = 32, Xi = 1, zi = 0.4, Ns = 4, Yi = 1e-4, Bs = 0.25, Ui = 0.01, Ut = (r, t) => String(r) < String(t) ? `${r}|${t}` : `${t}|${r}`;
function on(r, t, e) {
  const n = t.filter((f) => !String(f.properties.target.index).startsWith("b")).map((f) => ({
    id: f.properties.target.index,
    paper: f.geometry.coordinates,
    geo: f.properties.target.geom
  })), s = /* @__PURE__ */ new Set();
  let o = 0, i = 0;
  const a = r.features.map((f) => {
    const { a: l, b: h, c: u } = f.properties, [m, b, g] = f.geometry.coordinates[0];
    s.add(Ut(l.index, h.index)), s.add(Ut(l.index, u.index)), s.add(Ut(h.index, u.index));
    const k = Math.sign(ft(m[0], m[1], b[0], b[1], g[0], g[1])) * Math.sign(ft(l.geom[0], l.geom[1], h.geom[0], h.geom[1], u.geom[0], u.geom[1]));
    return k > 0 ? o++ : k < 0 && i++, {
      ids: [String(l.index), String(h.index), String(u.index)],
      paper: [m, b, g],
      geo: [l.geom, h.geom, u.geom],
      sign: k
    };
  }), c = e.filter(([f, l]) => !s.has(Ut(n[f].id, n[l].id)));
  return { points: n, triangles: a, majority: o >= i ? 1 : -1, hullEdges: e, dropped: c };
}
function Os(r) {
  return [r.foot[0] + r.height * r.normal[0], r.foot[1] + r.height * r.normal[1]];
}
function qi(r, [t, e], { lambda: n = Bs, epsilon: s = Yi } = {}) {
  const { points: o, majority: i } = r, a = o[t], c = o[e], f = o.reduce((I, F) => I + F.paper[0], 0) / o.length, l = o.reduce((I, F) => I + F.paper[1], 0) / o.length, h = Math.sign(ft(a.paper[0], a.paper[1], c.paper[0], c.paper[1], f, l));
  if (h === 0) return;
  const u = h * i, m = [c.paper[0] - a.paper[0], c.paper[1] - a.paper[1]], b = [c.geo[0] - a.geo[0], c.geo[1] - a.geo[1]], g = Math.hypot(m[0], m[1]), k = Math.hypot(b[0], b[1]);
  if (!(g > 0 && k > 0)) return;
  const M = [];
  for (const I of o) {
    if (I === a || I === c) continue;
    const F = ft(a.geo[0], a.geo[1], c.geo[0], c.geo[1], I.geo[0], I.geo[1]);
    if (F * u >= 0) continue;
    const P = ((I.geo[0] - a.geo[0]) * b[0] + (I.geo[1] - a.geo[1]) * b[1]) / (k * k), V = ((I.paper[0] - a.paper[0]) * m[0] + (I.paper[1] - a.paper[1]) * m[1]) / (g * g);
    P > 0 && P < 1 && V > 0 && V < 1 && M.push({ id: I.id, u: P, t: V, d: Math.abs(F) / k });
  }
  const v = M.length > 0;
  v || M.push({ u: 0.5, t: 0.5, d: 0 });
  const x = M.reduce((I, F) => F.d > I.d ? F : I);
  let p = 0;
  for (const I of M)
    p = Math.max(p, I.u <= x.u ? I.d * x.u / I.u : I.d * (1 - x.u) / (1 - I.u));
  p *= 1 + n;
  const w = [-m[1] / g * h, m[0] / g * h], d = [-b[1] / k * u, b[0] / k * u], y = (I) => [
    a.paper[0] + I * m[0] + s * g * w[0],
    a.paper[1] + I * m[1] + s * g * w[1]
  ], S = (I, F, P, V) => ({
    paper: y(I),
    foot: [a.geo[0] + F * b[0], a.geo[1] + F * b[1]],
    normal: d,
    height: P,
    chord: k,
    protrusion: x.d,
    ...V === void 0 ? {} : { anchor: V }
  }), _ = [S(x.t, x.u, p, v ? x.id : void 0)], O = [...M].sort((I, F) => I.u - F.u), B = [{ u: 0, d: 0 }], D = (I, F, P) => (F.u - I.u) * (P.d - I.d) - (F.d - I.d) * (P.u - I.u);
  for (const I of [...O, { u: 1, d: 0 }]) {
    for (; B.length >= 2 && D(B[B.length - 2], B[B.length - 1], I) >= 0; ) B.pop();
    B.push(I);
  }
  const C = n * x.d, E = [];
  let N = 0;
  for (const I of B.slice(1, -1))
    I.t === void 0 || !(I.t > N) || (N = I.t, E.push(S(I.t, I.u, I.d + C, v ? I.id : void 0)));
  return {
    edge: [a.id, c.id],
    variants: v && E.length > 1 ? [_, E] : [_]
  };
}
function ji(r, t, e, { lambda: n = Bs, mu: s = Ui, maxIterations: o = Ns } = {}) {
  let i = r.map((a, c) => ({ ray: { ...a }, index: c }));
  for (let a = 0; a < o && i.length > 0; a++) {
    const c = e(i.map(({ ray: h }) => [h.paper, Os(h)]));
    if (!c) return;
    let f = !1;
    const l = /* @__PURE__ */ new Set();
    for (const [h, { ray: u }] of i.entries()) {
      const m = `e${t + h}`;
      let b = -1 / 0, g = 1 / 0, k = 0;
      for (const p of c.triangles) {
        const w = p.ids.indexOf(m);
        if (w < 0) continue;
        p.sign !== c.majority && k++;
        const d = p.geo[(w + 1) % 3], y = p.geo[(w + 2) % 3], S = Math.sign(
          ft(
            p.paper[w][0],
            p.paper[w][1],
            p.paper[(w + 1) % 3][0],
            p.paper[(w + 1) % 3][1],
            p.paper[(w + 2) % 3][0],
            p.paper[(w + 2) % 3][1]
          )
        ), _ = ft(u.foot[0], u.foot[1], d[0], d[1], y[0], y[1]), O = ft(u.foot[0] + u.normal[0], u.foot[1] + u.normal[1], d[0], d[1], y[0], y[1]) - _, B = S * c.majority;
        if (O === 0) {
          _ * B <= 0 && (b = 1 / 0);
          continue;
        }
        const D = -_ / O;
        O * B > 0 ? b = Math.max(b, D) : g = Math.min(g, D);
      }
      if (!(b < g)) {
        l.add(h);
        continue;
      }
      const M = Math.min(Math.max(n * Math.max(b, u.protrusion), s * u.chord), (g - b) / 2), v = Math.max(b, 0) + M, x = Math.abs(v - u.height) > 1e-9 * u.chord;
      (k > 0 || x) && (x && (f = !0), u.height = v);
    }
    if (l.size > 0 && (i = i.filter((h, u) => !l.has(u)), f = !0), !f) break;
  }
  if (i.length !== 0)
    return { rays: i.map(({ ray: a }) => a), kept: i.map(({ index: a }) => a) };
}
function Gi(r, t) {
  const e = (i) => typeof i == "string" && i.startsWith("e") && Number(i.slice(1)) >= t ? Number(i.slice(1)) : void 0, n = /* @__PURE__ */ new Set();
  for (const { ids: i } of r.triangles)
    n.add(Ut(i[0], i[1])), n.add(Ut(i[0], i[2])), n.add(Ut(i[1], i[2]));
  const s = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set();
  for (const [i, a] of r.hullEdges) {
    const c = n.has(Ut(r.points[i].id, r.points[a].id));
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
function Wi(r, t) {
  const e = { rounds: 0, builds: 0, cost: 0, budget: 0, batches: 0, perEdge: 0, multiPoint: 0 };
  let n = [], s = [], o = t, i = r.snapshot();
  const a = /* @__PURE__ */ new Set(), c = Xi * r.baseCost;
  e.budget = c;
  const f = r.buildCost();
  let l = 0;
  const h = () => l * zi + r.buildCost() - f, u = () => h() >= c, m = (v) => {
    if (!u())
      return e.builds++, l++, r.measure(v);
  }, b = (v) => [v.paper, Os(v)], g = (v, x, p) => {
    const w = ji(
      v.map(({ ray: d }) => d),
      x,
      (d) => m([...n, ...d]),
      { maxIterations: p }
    );
    return w?.rays.map((d, y) => ({ ray: d, edge: v[w.kept[y]].edge }));
  }, k = (v, x) => v.length === x.length && v.every(({ ray: p }, w) => Math.abs(p.height - x[w].ray.height) <= 1e-9 * p.chord), M = (v) => {
    if (v.length === 0 || n.length + v.length > os) return !1;
    const x = r.edgeBase + n.length;
    let p = g(v, x, 1), w = !1;
    for (; p && p.length > 0 && !u(); ) {
      const d = [...n, ...p.map(({ ray: O }) => b(O))];
      e.builds++;
      const y = r.build(d, Math.max(1, Math.ceil(c - h()))), S = y ? Gi(y.analysis, x) : void 0;
      if (y && S.size === 0)
        return s = s.concat(
          p.map(({ ray: O, edge: B }, D) => ({
            node: x + D,
            kind: "hullEdge",
            edge: B,
            ...O.anchor === void 0 ? {} : { anchor: O.anchor }
          }))
        ), n = d, o = y, i = r.snapshot(), !0;
      if (r.restore(i), y && S.size < p.length) {
        p = p.filter((O, B) => !S.has(x + B));
        continue;
      }
      if (w) return !1;
      w = !0;
      const _ = g(p, x, Ns);
      if (!_ || k(_, p)) return !1;
      p = _;
    }
    return !1;
  };
  for (let v = 1; v <= Li && !u(); v++) {
    const { analysis: x } = o, p = [];
    for (const d of x.dropped) {
      const y = d.map((_) => x.points[_].paper.join(",")).join("|");
      if (a.has(y) || (a.add(y), n.length + p.length + 1 > os)) continue;
      const S = qi(x, d);
      S && p.push(S);
    }
    if (p.length === 0) break;
    e.rounds = v;
    const w = (d, y) => y.map((S) => ({ ray: S, edge: d.edge }));
    if (M(p.flatMap((d) => w(d, d.variants[0])))) {
      e.batches++;
      continue;
    }
    for (const d of p)
      for (const [y, S] of d.variants.entries()) {
        if (u()) break;
        if (M(w(d, S))) {
          e.perEdge++, y > 0 && e.multiPoint++;
          break;
        }
      }
  }
  return r.restore(i), e.cost = h(), { pairs: n, records: s, result: o.result, diagnostics: e };
}
function Fs(r, t) {
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
        (l, h, u, m) => {
          if (l) return l;
          const b = m[u + 1];
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
        const l = f[0], h = f[1], u = (c - l[3]) / (h[3] - l[3]), m = [
          (h[0][0] - l[0][0]) * u + l[0][0],
          (h[0][1] - l[0][1]) * u + l[0][1]
        ];
        return s === 0 ? [[a, m, c]] : [[m, a, c]];
      }
      return [];
    });
  }).reduce((n, s) => n.concat(s), []).sort((n, s) => n[2] < s[2] ? -1 : 1);
}
const Ki = 5e-3, Hi = 0.999, as = 1e-9, Ji = (r, t) => {
  const e = Math.atan2(r[0] - t[0], r[1] - t[1]) * (180 / Math.PI);
  return e < 0 ? e + 360 : e;
};
function cs(r, t) {
  const e = fn(r, t), n = Ji(r, t) - e * 10;
  return n < as ? [e, (e + 35) % 36] : n > 10 - as ? [e, (e + 1) % 36] : [e];
}
function fs(r, t) {
  let e = 0;
  for (let n = 0; n < r.length; n++) {
    const s = r[n], o = r[(n + 1) % r.length], i = Math.sign(ft(s[0], s[1], o[0], o[1], t[0], t[1]));
    if (i === 0) return !1;
    if (e === 0) e = i;
    else if (i !== e) return !1;
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
      for (const [u, m] of h)
        this.hullVertices.add(s[u]), this.hullVertices.add(s[m]);
      return h.map(([u]) => n(s[u])[l]);
    };
    this.hull = { forw: o("forw"), bakw: o("bakw") };
    const i = t.gcps.map((l) => n(l).forw[0]), a = t.gcps.map((l) => n(l).forw[1]);
    this.box = {
      minx: Math.min(...i),
      maxx: Math.max(...i),
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
        for (const m of cs(h, this.centroid.forw))
          u > this.binMax[m] && (this.binMax[m] = u, c[m] = l);
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
    for (let i = 0; i < this.ring.length; i++) {
      const a = this.ring[i], c = this.ring[(i + 1) % this.ring.length], f = c[0] - a[0], l = c[1] - a[1], h = f * s - l * n;
      if (h === 0) continue;
      const u = (f * (a[1] - e[1]) - l * (a[0] - e[0])) / h, m = (n * (a[1] - e[1]) - s * (a[0] - e[0])) / h;
      u > 0 && m >= 0 && m <= 1 && (o = Math.min(o, 1 / u));
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
        if (this.hullVertices.has(f) || this.binHolders.has(f) || !(this.ringRatio(h) < Hi) || c.gcp && (l[0] === n.minx || l[0] === n.maxx || l[1] === n.miny || l[1] === n.maxy))
          return;
        c.counted && (s -= l[0], o -= l[1], i--);
      }
      if (c.to) {
        const { forw: f, bakw: l } = c.to;
        if (!fs(this.hull.forw, f) || !fs(this.hull.bakw, l) || c.gcp && !(f[0] > n.minx && f[0] < n.maxx && f[1] > n.miny && f[1] < n.maxy))
          return;
        const h = this.forwDistance(f);
        if (h > 0) {
          for (const u of cs(f, this.centroid.forw))
            if (!(h < this.binMax[u])) return;
        }
        if (!(this.ringRatio(l) < 1)) return;
        c.counted && (s += f[0], o += f[1], i++);
      }
    }
    if (!(i === 0 || !(Math.hypot(
      s / i - this.mean0[0],
      o / i - this.mean0[1]
    ) <= Ki * this.diagonal)))
      return { sum: [s, o], count: i };
  }
  /** 当てた編集を、算術平均に反映する（{@link keeps} が返した値を渡す）。 */
  commit(t) {
    this.sum = t.sum, this.count = t.count;
  }
}
const ls = (r, t, e) => Math.sign(ft(r[0], r[1], t[0], t[1], e[0], e[1]));
class Qi {
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
function Zi(r, t, e = {}) {
  if (r.version !== void 0 && r.version < 3)
    return { reason: "v2" };
  if (r.strict_status === "loose" || r.tins_points.length !== 1)
    return { reason: "loose" };
  const n = r.outerTransform, s = n === "worldFile" && r.yaxisMode === "follow" ? 1 : -1, o = r.points, i = r.edgeNodes ?? [], a = r.vertices_points ?? [], c = o.length, f = (w) => {
    if (typeof w == "number") return o[w];
    const d = Number(w.slice(1));
    return w.startsWith("e") ? i[d] : w.startsWith("b") ? a[d] : void 0;
  };
  let l = 0, h = 0;
  for (const w of r.tins_points[0]) {
    const [d, y, S] = w.map(f);
    if (!d || !y || !S) return { reason: "inconsistent" };
    const _ = ls(d[0], y[0], S[0]);
    h += _, l += _ * ls(d[1], y[1], S[1]);
  }
  if ((l < 0 ? -1 : 1) !== s) return { reason: "orientation" };
  const u = new Le(s, h < 0 ? -1 : 1), m = new Qi(u, {
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
  o.forEach(([w, d], y) => {
    const S = e.points?.[y] ?? y, _ = u.addVertex({ kind: "gcp", id: S }, w, d);
    m.gcps.push(_), m.pointVertex.set(S, _), b.set(y, _);
  });
  const g = r.edges ?? [];
  if (m.edges = g.map(
    ([w, d, [y, S]], _) => ({
      id: e.edges?.[_] ?? _,
      start: b.get(y),
      end: b.get(S),
      forwNodes: w.map(dt),
      bakwNodes: d.map(dt),
      nodes: []
    })
  ), m.edges.some(({ start: w, end: d }) => w === void 0 || d === void 0))
    return { reason: "inconsistent" };
  const k = /* @__PURE__ */ new Map();
  {
    let w = 0;
    for (const [, d] of t)
      d >= c ? k.has(d - c) || k.set(d - c, w) : w++;
    if (w !== m.edges.length) return { reason: "inconsistent" };
  }
  i.forEach(([w, d], y) => {
    const S = k.get(y);
    let _;
    if (S !== void 0) {
      const O = m.edges[S];
      _ = u.addVertex(
        { kind: "edgeNode", edge: O.id, order: O.nodes.length },
        w,
        d,
        [Pe(O.id)]
      ), O.nodes.push(_);
    } else
      _ = u.addVertex(
        { kind: "supplement", key: `s${m.nextSupplement++}` },
        w,
        d
      );
    b.set(`e${y}`, _);
  });
  for (const w of m.edges) {
    const d = Pe(w.id);
    u.vertices.get(w.start).groups.push(d), u.vertices.get(w.end).groups.push(d);
  }
  a.forEach(([w, d], y) => {
    const S = u.addVertex({ kind: "boundary", order: y }, w, d, [
      ie
    ]);
    m.ring.push(S), b.set(`b${y}`, S);
  });
  const M = new Map(
    (r.supplementPairs ?? []).map((w) => [w.node, w])
  );
  for (let w = 0; w < i.length; w++) {
    if (k.has(w)) continue;
    const d = M.get(w), y = d?.edge.map((S) => b.get(S));
    if (!d || !y || y.some((S) => S === void 0))
      return { reason: "inconsistent" };
    m.supplements.push({
      vertex: b.get(`e${w}`),
      kind: d.kind,
      edge: y,
      ...d.anchor === void 0 ? {} : { anchor: b.get(d.anchor) }
    });
  }
  if (r.centroid_point)
    m.centroid = {
      forw: dt(r.centroid_point[0]),
      bakw: dt(r.centroid_point[1])
    };
  else if (n !== "worldFile") return { reason: "inconsistent" };
  for (const w of r.tins_points[0]) {
    const [d, y, S] = w.map((_) => b.get(_));
    u.addTriangle(d, y, S);
  }
  const v = (w) => w < c ? b.get(w) : b.get(`e${w - c}`);
  for (const [w, d] of t) {
    const y = v(w), S = v(d);
    if (y === void 0 || S === void 0) return { reason: "inconsistent" };
    u.setFlag(y, S, Dt);
  }
  const x = [...m.gcps, ...m.nodeOrder()], p = te(
    x.map((w) => u.vertices.get(w).forw)
  );
  for (const [w, d] of p)
    u.hasEdge(x[w], x[d]) && u.setFlag(x[w], x[d], Ot);
  return u.boundarySimple = u.computeBoundarySimple(), { model: m };
}
const to = 3, gt = (r) => ({ ok: !1, reason: r }), Ts = { overlap: 0, forbidden: 0, polish: 0 }, hs = (r, t, e) => ft(r[0], r[1], t[0], t[1], e[0], e[1]), De = (r, t) => r[0] === t[0] && r[1] === t[1];
function Xe(r, t, e) {
  const n = (a) => r.vertices.get(a).forw, s = (a) => {
    const c = r.positive(a);
    return c !== void 0 && c.every((f, l) => hs(n(f), n(c[(l + 1) % 3]), t) >= 0);
  }, o = [e];
  let i = e;
  for (let a = 0; a <= r.triangles.size; a++) {
    const c = r.positive(i);
    if (!c) break;
    let f, l = !1;
    for (let h = 0; h < 3 && f === void 0; h++) {
      const u = c[h], m = c[(h + 1) % 3];
      hs(n(u), n(m), t) >= 0 || (l = !0, f = r.byEdge.get(rt(u, m)).find((b) => b !== i));
    }
    if (!l) return { triangle: i, path: o };
    if (f === void 0) break;
    i = f, o.push(i);
  }
  for (const a of r.triangles.keys())
    if (s(a)) return { triangle: a, path: [a] };
}
function Rs(r, t, e) {
  const n = (i) => r.vertices.get(i).forw, s = /* @__PURE__ */ new Set([e]), o = [e];
  for (let i = 0; i < o.length; i++) {
    const a = r.triangles.get(o[i]);
    for (let c = 0; c < 3; c++) {
      const f = rt(a[c], a[(c + 1) % 3]);
      if (!((r.edgeFlags.get(f) ?? 0) & (Dt | Ot)))
        for (const l of r.byEdge.get(f)) {
          if (s.has(l)) continue;
          const h = r.positive(l);
          if (!h) continue;
          const [u, m, b] = h.map(n);
          Ve(
            u[0],
            u[1],
            m[0],
            m[1],
            b[0],
            b[1],
            t[0],
            t[1]
          ) * As > 0 && (s.add(l), o.push(l));
        }
    }
  }
  return s;
}
function us(r, t, e, n) {
  const s = Xe(r, t, n);
  if (!s) return;
  const o = (f) => r.vertices.get(f).forw, i = (f) => {
    const l = r.triangles.get(f);
    for (let h = 0; h < 3; h++) {
      const u = o(l[h]), m = o(l[(h + 1) % 3]);
      if (Fe(t[0], t[1], e[0], e[1], u[0], u[1], m[0], m[1]))
        return !0;
    }
    return !1;
  }, a = /* @__PURE__ */ new Set([s.triangle]), c = [s.triangle];
  for (let f = 0; f < c.length; f++) {
    const l = r.triangles.get(c[f]);
    for (let h = 0; h < 3; h++)
      for (const u of r.byEdge.get(rt(l[h], l[(h + 1) % 3])))
        a.has(u) || !i(u) || (a.add(u), c.push(u));
  }
  return a;
}
function ze(r, t, e) {
  if (e?.force) return () => r.resetBand();
  const n = r.band(), s = n?.keeps(r, t);
  if (!(!n || !s))
    return () => n.commit(s);
}
function vn(r, t, e, n) {
  let s = t, o;
  for (let i = 0; i <= to; i++) {
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
function Ye(r, t, e, n) {
  const { mesh: s } = r, o = (p) => e && p === e.vertex ? e : s.vertices.get(p), i = /* @__PURE__ */ new Set(), a = [], c = [], f = [], l = s.triangles.keys().next().value;
  if (l === void 0) return gt("unsupported");
  if (e) {
    const p = s.star(e.vertex);
    if (p.size === 0) return gt("unsupported");
    a.push({ vertex: e.vertex, to: e, gcp: !0, counted: !0 });
    for (const d of p) i.add(d);
    const w = s.vertices.get(e.vertex);
    if (!De(e.forw, w.forw)) {
      const d = Xe(s, e.forw, p.values().next().value);
      if (!d) return gt("pointOutside");
      if (s.triangles.get(d.triangle).some((y) => y !== e.vertex && De(s.vertices.get(y).forw, e.forw)))
        return gt("duplicate");
      if (!p.has(d.triangle)) {
        for (const y of d.path) i.add(y);
        for (const y of Rs(s, e.forw, d.triangle)) i.add(y);
      }
    }
  }
  if (e) {
    const p = new Set(t.map((w) => w.edge));
    for (const w of r.edges) {
      if (p.has(w) || w.nodes.length > 0 || w.start !== e.vertex && w.end !== e.vertex) continue;
      const d = w.start === e.vertex ? w.end : w.start, y = us(s, s.vertices.get(d).forw, e.forw, l);
      if (!y) return gt("pointOutside");
      for (const S of y) i.add(S);
    }
  }
  const h = [];
  for (const p of t) {
    const { edge: w } = p;
    if (!p.fresh) {
      const B = [w.start, ...w.nodes, w.end];
      for (let D = 0; D + 1 < B.length; D++) f.push([B[D], B[D + 1]]);
      if (w.nodes.length === 0)
        for (const D of s.byEdge.get(rt(w.start, w.end)) ?? []) i.add(D);
      for (const D of w.nodes) {
        for (const C of s.byVertex.get(D)) i.add(C);
        c.push(D), a.push({ vertex: D, gcp: !1, counted: !0 });
      }
    }
    if (p.drop) continue;
    const d = o(w.start), y = o(w.end), S = p.forwNodes.length > 0 || p.bakwNodes.length > 0, _ = S ? Fs(
      [d.forw, ...p.forwNodes, y.forw],
      [d.bakw, ...p.bakwNodes, y.bakw]
    ).map(([B, D]) => [B, D]) : [];
    if (S && _.length === 0) return gt("unsupported");
    p.forwNodes = p.forwNodes.map(dt), p.bakwNodes = p.bakwNodes.map(dt), h.push({ spec: p, nodes: _ });
    for (const [B, D] of _)
      a.push({ to: { forw: B, bakw: D }, gcp: !1, counted: !0 });
    const O = [d.forw, ..._.map(([B]) => B), y.forw];
    for (let B = 0; B + 1 < O.length; B++) {
      const D = us(s, O[B], O[B + 1], l);
      if (!D) return gt("pointOutside");
      for (const C of D) i.add(C);
    }
  }
  const u = ze(r, a, n);
  if (!u) return gt("unsupported");
  const m = c.map((p) => s.vertices.get(p).ref), b = [], g = [], k = [], M = /* @__PURE__ */ new Map();
  for (const { spec: p, nodes: w } of h) {
    const { edge: d } = p, y = Pe(d.id);
    if (p.fresh)
      for (const O of [d.start, d.end]) {
        const { groups: B } = s.vertices.get(O);
        B.includes(y) || (B.push(y), k.push({ vertex: O, group: y }));
      }
    const S = w.map(
      ([O, B], D) => s.addVertex({ kind: "edgeNode", edge: d.id, order: D }, O, B, [y])
    );
    b.push(...S), M.set(p, S);
    const _ = [d.start, ...S, d.end];
    for (let O = 0; O + 1 < _.length; O++)
      g.push([_[O], _[O + 1], Dt]);
  }
  const v = {
    added: b,
    removed: m,
    moved: e ? [e.vertex] : []
  };
  let x;
  if (i.size === 0)
    if (!g.every(([p, w]) => s.hasEdge(p, w)))
      x = gt("constraint");
    else {
      for (const [p, w] of f) s.clearFlag(p, w, Dt);
      for (const [p, w, d] of g) s.setFlag(p, w, d);
      s.revision++, x = { ok: !0, mode: "moved", removed: [], added: [], grown: 0, size: 0, flips: Ts, vertices: v };
    }
  else
    x = vn(
      s,
      i,
      {
        move: e ? /* @__PURE__ */ new Map([[e.vertex, { forw: e.forw, bakw: e.bakw }]]) : void 0,
        add: b,
        remove: c,
        release: f,
        constrain: g
      },
      v
    );
  if (!x.ok) {
    for (const p of b) s.dropVertex(p);
    for (const { vertex: p, group: w } of k) {
      const { groups: d } = s.vertices.get(p);
      d.splice(d.indexOf(w), 1);
    }
    return x;
  }
  u();
  for (const p of t) {
    const { edge: w } = p;
    if (p.drop) {
      const d = Pe(w.id);
      for (const y of [w.start, w.end]) {
        const { groups: S } = s.vertices.get(y), _ = S.indexOf(d);
        _ !== -1 && S.splice(_, 1);
      }
      w.nodes = [];
      continue;
    }
    w.nodes = M.get(p), w.forwNodes = p.forwNodes, w.bakwNodes = p.bakwNodes;
  }
  return x;
}
function eo(r, t, e, n) {
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
  if (l.length === 0 && De(a, i.forw)) {
    const h = ze(
      r,
      [{ vertex: o, to: { forw: a, bakw: c }, gcp: !0, counted: !0 }],
      n
    );
    if (!h) return gt("unsupported");
    const u = s.star(o);
    if (u.size === 0) return gt("unsupported");
    const m = (g) => g === o ? { ...i, bakw: c } : s.vertices.get(g);
    if ([...u].every((g) => {
      const [k, M, v] = s.triangles.get(g);
      return s.okNew(k, M, v, m);
    }))
      return s.relocate(o, a, c), h(), {
        ok: !0,
        mode: "moved",
        removed: [],
        added: [],
        grown: 0,
        size: u.size,
        flips: Ts,
        vertices: { added: [], removed: [], moved: [o] }
      };
  }
  return Ye(r, l, { vertex: o, forw: a, bakw: c }, n);
}
function no(r, t, e, n, s, o) {
  const { mesh: i } = r;
  if (r.pointVertex.has(t)) return gt("idInUse");
  const a = i.triangles.keys().next().value;
  if (a === void 0) return gt("unsupported");
  const c = ze(
    r,
    [{ to: { forw: e, bakw: n }, gcp: !0, counted: !0 }],
    o
  );
  if (!c) return gt("unsupported");
  const f = Xe(i, e, a);
  if (!f) return gt("pointOutside");
  if (i.triangles.get(f.triangle).some((m) => De(i.vertices.get(m).forw, e)))
    return gt("duplicate");
  const h = i.addVertex({ kind: "gcp", id: t }, e, n), u = vn(
    i,
    Rs(i, e, f.triangle),
    { add: [h] },
    { added: [h], removed: [], moved: [] }
  );
  return u.ok ? (c(), r.gcps.splice(s ?? r.gcps.length, 0, h), r.pointVertex.set(t, h), u) : (i.dropVertex(h), u);
}
function so(r, t, e) {
  const { mesh: n } = r, s = r.pointVertex.get(t);
  if (s === void 0) return gt("unknownPoint");
  if (r.edges.some((f) => f.start === s || f.end === s) || r.supplements.some(
    (f) => f.edge.includes(s) || f.anchor === s
  ))
    return gt("unsupported");
  const o = ze(
    r,
    [{ vertex: s, gcp: !0, counted: !0 }],
    e
  );
  if (!o) return gt("unsupported");
  const i = n.star(s);
  if (i.size === 0) return gt("unsupported");
  const a = n.vertices.get(s).ref, c = vn(
    n,
    i,
    { remove: [s] },
    { added: [], removed: [a], moved: [] }
  );
  return c.ok && (o(), r.gcps.splice(r.gcps.indexOf(s), 1), r.pointVertex.delete(t)), c;
}
function ro(r, t, e, n, s = [], o = [], i, a) {
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
  }, h = Ye(
    r,
    [{ edge: l, fresh: !0, drop: !1, forwNodes: s, bakwNodes: o }],
    void 0,
    a
  );
  return h.ok && r.edges.splice(i ?? r.edges.length, 0, l), h;
}
function io(r, t, e) {
  const n = r.edges.find((o) => o.id === t);
  if (!n) return gt("unknownEdge");
  const s = Ye(
    r,
    [{ edge: n, fresh: !1, drop: !0, forwNodes: [], bakwNodes: [] }],
    void 0,
    e
  );
  return s.ok && r.edges.splice(r.edges.indexOf(n), 1), s;
}
function oo(r, t, e, n, s) {
  const o = r.edges.find((i) => i.id === t);
  return o ? Ye(
    r,
    [{ edge: o, fresh: !1, drop: !1, forwNodes: e, bakwNodes: n }],
    void 0,
    s
  ) : gt("unknownEdge");
}
function ao(r, t) {
  const { mesh: e } = r;
  if (!r.centroid) return { ok: !1, reason: "bandNotAnnulus" };
  const n = (F) => e.vertices.get(F), s = new Set(r.supplements.map(({ vertex: F }) => F)), o = [...r.gcps, ...r.nodeOrder()], i = o.filter((F) => !s.has(F));
  if (i.length < 3) return { ok: !1, reason: "bandFailed" };
  let a = 0, c = 0;
  for (const F of i)
    a += n(F).forw[0], c += n(F).forw[1];
  const f = [a / i.length, c / i.length], l = e.triangles.keys().next().value, h = l === void 0 ? void 0 : Xe(e, f, l);
  if (!h) return { ok: !1, reason: "bandFailed" };
  const [u, m, b] = e.triangles.get(h.triangle).map(n), g = (m.forw[0] - u.forw[0]) * (b.forw[1] - u.forw[1]) - (b.forw[0] - u.forw[0]) * (m.forw[1] - u.forw[1]);
  if (g === 0) return { ok: !1, reason: "bandFailed" };
  const k = ((f[0] - u.forw[0]) * (b.forw[1] - u.forw[1]) - (b.forw[0] - u.forw[0]) * (f[1] - u.forw[1])) / g, M = ((m.forw[0] - u.forw[0]) * (f[1] - u.forw[1]) - (f[0] - u.forw[0]) * (m.forw[1] - u.forw[1])) / g, v = {
    forw: f,
    bakw: [
      u.bakw[0] + k * (m.bakw[0] - u.bakw[0]) + M * (b.bakw[0] - u.bakw[0]),
      u.bakw[1] + k * (m.bakw[1] - u.bakw[1]) + M * (b.bakw[1] - u.bakw[1])
    ]
  }, x = {};
  for (const F of ["forw", "bakw"])
    for (const [P] of te(i.map((V) => n(V)[F]))) {
      const V = n(i[P]);
      x[`${V.forw[0]}:${V.forw[1]}`] = { forw: V.forw, bakw: V.bakw };
    }
  const p = r.gcps.map((F) => n(F).forw[0]), w = r.gcps.map((F) => n(F).forw[1]), d = Math.min(...p), y = Math.max(...p), S = Math.min(...w), _ = Math.max(...w), O = {
    convexBuf: x,
    centroid: v,
    allGcps: o.map((F) => ({ forw: n(F).forw, bakw: n(F).bakw })),
    minx: d,
    maxx: y,
    miny: S,
    maxy: _
  }, B = t === "birdeye" ? Ss : ks, D = te(o.map((F) => n(F).forw)), C = r.ring.map((F) => n(F).ref), E = y - d, N = _ - S;
  let I = "bandFailed";
  for (const F of pn) {
    const P = B(
      {
        ...O,
        minx: d - F * E,
        maxx: y + F * E,
        miny: S - F * N,
        maxy: _ + F * N
      },
      !0
    );
    if (!P.every(({ bakw: T }) => T.every(Number.isFinite)) || !oe(P.map((T) => T.forw), v.forw, -1) || !oe(P.map((T) => T.bakw), v.bakw, 1))
      continue;
    const V = { mesh: e, indexOf: /* @__PURE__ */ new Map(), interior: o, ring: r.ring }, A = Is(V, { vertices: P, hull: D });
    if (!A.ok) {
      if (A.reason === "bandNotAnnulus") return { ok: !1, reason: "bandNotAnnulus" };
      I = "bandFailed";
      continue;
    }
    return r.ring = V.ring, r.centroid = v, r.resetBand(), {
      ok: !0,
      removed: A.removed,
      added: A.added,
      removedVertices: C,
      addedVertices: V.ring,
      margin: F
    };
  }
  return { ok: !1, reason: I };
}
const Ce = (r, t) => t ? [r[0], -1 * r[1]] : r;
function co(r, t, e) {
  const n = r.points.slice(), s = r.pointIds.slice(), o = r.edges.map(
    ([u, m, [b, g]]) => ({ forwNodes: u, bakwNodes: m, start: r.pointIds[b], end: r.pointIds[g] })
  ), i = r.edgeIds.slice(), a = (u) => {
    const m = s.indexOf(u);
    if (m === -1) throw new Error(`applyEdits: 対応点 ${u} がありません`);
    return m;
  }, c = (u) => {
    const m = i.indexOf(u);
    if (m === -1) throw new Error(`applyEdits: 必須エッジ ${u} がありません`);
    return m;
  }, f = (u, m) => {
    if (u === void 0) return m;
    if (!Number.isInteger(u) || u < 0 || u > m)
      throw new Error(`applyEdits: position ${u} が範囲の外です`);
    return u;
  }, l = (...u) => {
    for (const m of u)
      if (!Array.isArray(m) || !Number.isFinite(m[0]) || !Number.isFinite(m[1]))
        throw new Error("applyEdits: 座標が有限の数ではありません");
  };
  for (const u of t)
    switch (u.type) {
      case "addPoint": {
        if (!Number.isInteger(u.id) || s.includes(u.id))
          throw new Error(`applyEdits: 対応点の id ${u.id} は使えません`);
        l(u.forw, u.bakw);
        const m = f(u.position, n.length);
        n.splice(m, 0, [u.forw, Ce(u.bakw, e)]), s.splice(m, 0, u.id);
        break;
      }
      case "removePoint": {
        const m = a(u.id);
        if (o.some((b) => b.start === u.id || b.end === u.id))
          throw new Error(`applyEdits: 対応点 ${u.id} は必須エッジの端点です（先に必須エッジを外してください）`);
        n.splice(m, 1), s.splice(m, 1);
        break;
      }
      case "movePoint": {
        const m = a(u.id);
        u.forw && l(u.forw), u.bakw && l(u.bakw), n[m] = [
          u.forw ?? n[m][0],
          u.bakw ? Ce(u.bakw, e) : n[m][1]
        ];
        break;
      }
      case "addEdge": {
        if (!Number.isInteger(u.id) || i.includes(u.id))
          throw new Error(`applyEdits: 必須エッジの id ${u.id} は使えません`);
        if (a(u.start), a(u.end), u.start === u.end) throw new Error("applyEdits: 必須エッジの両端が同じ対応点です");
        l(...u.forwNodes, ...u.bakwNodes);
        const m = f(u.position, o.length);
        o.splice(m, 0, { forwNodes: u.forwNodes, bakwNodes: u.bakwNodes, start: u.start, end: u.end }), i.splice(m, 0, u.id);
        break;
      }
      case "removeEdge": {
        const m = c(u.id);
        o.splice(m, 1), i.splice(m, 1);
        break;
      }
      case "replaceEdgeNodes": {
        const m = c(u.id);
        l(...u.forwNodes, ...u.bakwNodes), o[m] = { ...o[m], forwNodes: u.forwNodes, bakwNodes: u.bakwNodes };
        break;
      }
      default:
        throw new Error(`applyEdits: 編集の種類 ${u.type} は扱えません`);
    }
  const h = new Map(s.map((u, m) => [u, m]));
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
const fo = (r) => r === "duplicate" || r === "unknownPoint" || r === "unknownEdge" || r === "idInUse" ? "unsupported" : r;
function lo(r, t, e, n) {
  const { mesh: s } = r, o = [...s.bad].sort((d, y) => d - y), i = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set(), c = (d) => JSON.stringify(d), f = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Set(), h = /* @__PURE__ */ new Set(), u = (d, y) => {
    switch (d.type) {
      case "addPoint":
        return no(r, d.id, d.forw, Ce(d.bakw, e), d.position, y);
      case "removePoint":
        return so(r, d.id, y);
      case "movePoint":
        return eo(
          r,
          d.id,
          { forw: d.forw, bakw: d.bakw ? Ce(d.bakw, e) : void 0 },
          y
        );
      case "addEdge":
        return ro(r, d.id, d.start, d.end, d.forwNodes, d.bakwNodes, d.position, y);
      case "removeEdge":
        return io(r, d.id, y);
      case "replaceEdgeNodes":
        return oo(r, d.id, d.forwNodes, d.bakwNodes, y);
    }
  };
  let m = !1;
  for (const d of t) {
    let y = u(d);
    if (!y.ok && y.reason === "unsupported" && n && r.centroid && (y = u(d, { force: !0 }), y.ok && (m = !0)), !y.ok) return { ok: !1, reason: fo(y.reason) };
    for (const S of y.removed)
      a.delete(S) || i.add(S);
    for (const S of y.added) a.add(S);
    for (const S of y.vertices.removed) f.set(c(S), S);
    for (const S of y.vertices.added) l.add(S);
    for (const S of y.vertices.moved) h.add(S);
  }
  if (m) {
    const d = ao(r, n.vertexMode);
    if (!d.ok) return { ok: !1, reason: d.reason };
    for (const y of d.removed)
      a.delete(y) || i.add(y);
    for (const y of d.added) a.add(y);
    for (const y of d.removedVertices) f.set(c(y), y);
    for (const y of d.addedVertices) l.add(y);
  }
  const b = /* @__PURE__ */ new Map(), g = [];
  for (const d of h) {
    const y = s.vertices.get(d);
    y && !l.has(d) && b.set(c(y.ref), { ref: y.ref, forw: y.forw, bakw: y.bakw });
  }
  for (const d of l) {
    const y = s.vertices.get(d);
    if (!y) continue;
    const S = c(y.ref), _ = { ref: y.ref, forw: y.forw, bakw: y.bakw };
    f.delete(S) ? b.set(S, _) : g.push(_);
  }
  const k = /* @__PURE__ */ new Set();
  for (const d of f.keys())
    b.has(d) && k.add(d);
  for (const d of k) f.delete(d);
  let M;
  const v = (d) => {
    M = M ? [Math.min(M[0], d[0]), Math.min(M[1], d[1]), Math.max(M[2], d[0]), Math.max(M[3], d[1])] : [d[0], d[1], d[0], d[1]];
  }, x = [];
  for (const d of a) {
    const y = s.triangles.get(d);
    if (!y) continue;
    const S = y.map((_) => {
      const O = s.vertices.get(_);
      return v(O.forw), O.ref;
    });
    x.push({ id: d, vertices: S });
  }
  for (const { forw: d } of b.values()) v(d);
  const p = [...s.bad].sort((d, y) => d - y), w = p.length !== o.length || p.some((d, y) => d !== o[y]);
  return {
    ok: !0,
    refreshed: m,
    patch: {
      strict_status: s.isStrict() ? "strict" : "strict_error",
      // 帯を差し替えたときだけ、重心と補助頂点の扇形の値を入れる
      ...m && r.centroid ? {
        centroid: { forw: [...r.centroid.forw], bakw: [...r.centroid.bakw] },
        verticesParams: r.verticesParams()
      } : {},
      ...b.size > 0 ? { movedVertices: [...b.values()] } : {},
      ...f.size > 0 ? { removedVertices: [...f.values()] } : {},
      ...g.length > 0 ? { addedVertices: g } : {},
      removedTriangles: [...i],
      addedTriangles: x,
      ...w ? { badTriangles: p } : {},
      ...M ? { dirtyBounds: M } : {}
    }
  };
}
const ds = 2.00704, gs = 3.00001, ho = 12, uo = 4, ps = 1, ms = 4, go = 8, po = 24;
function mo(r) {
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
const ws = /* @__PURE__ */ Symbol("supplement pairs out of budget"), wo = 32, vo = 24;
class it extends Cs {
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
    this.mesh = void 0, this.meshFailure = void 0, this.meshAhead = !1, this.bandStale = !1, this.editRevision = 0;
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
    const n = this.yaxisMode === it.YAXIS_FOLLOW, s = co(this.currentInputs(), t, n);
    let o = "noMesh";
    if (this.mesh) {
      const a = this.bounds ? this.boundsPolygon : void 0;
      if (a && !s.points.every((c) => tn(c[0], a)))
        o = "unsupported";
      else {
        const c = lo(
          this.mesh,
          t,
          n,
          this.incrementalBand ? { vertexMode: this.vertexMode } : void 0
        );
        if (c.ok)
          return this.meshAhead = !0, this.bandStale = !c.refreshed, this.tins = void 0, this.indexedTins = void 0, this.pointsSet = void 0, delete this.kinks, this.strict_status = c.patch.strict_status, this.editRevision++, { revision: this.editRevision, mode: "local", boundaryStale: this.bandStale, ...c.patch };
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
    if (super(), t.bounds ? this.setBounds(t.bounds) : (this.setWh(t.wh), this.vertexMode = t.vertexMode || it.VERTEX_PLAIN), this.strictMode = t.strictMode || it.MODE_AUTO, this.yaxisMode = t.yaxisMode || it.YAXIS_INVERT, this.importance = t.importance || 0, this.priority = t.priority || 0, this.stateFull = t.stateFull || !1, this.useV2Algorithm = t.useV2Algorithm ?? !1, this.useSupplementPairs = t.supplementPairs ?? !0, this.incremental = t.incremental ?? !1, this.incrementalRebuild = t.incrementalRebuild ?? !1, this.incrementalBand = t.incrementalBand ?? !1, t.outerTransform === "worldFile") {
      if (this.useV2Algorithm) throw new Error("V2 では world file 外周を使えません");
      if (!t.worldFile) throw new Error("worldFile が必要です");
      Vs(t.worldFile), this.requestedWorldFile = { ...t.worldFile };
    }
    t.points && this.setPoints(t.points), t.edges && this.setEdges(t.edges);
  }
  /**
   * フォーマットバージョンを取得します
   */
  getFormatVersion() {
    return this.useV2Algorithm ? ds : gs;
  }
  /**
   * 制御点（GCP: Ground Control Points）を設定します。
   * 指定した点群に合わせて内部のTINキャッシュをリセットします。
   */
  setPoints(t) {
    this.syncFromMesh(), this.yaxisMode === it.YAXIS_FOLLOW && (t = t.map((e) => [
      e[0],
      [e[1][0], -1 * e[1][1]]
    ])), this.points = t, this.pointIds = void 0, this.dropMesh(), this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * エッジ（制約線）を設定します。
   * 制約線を正規化した上で、依存するキャッシュをリセットします。
   */
  setEdges(t = []) {
    this.syncFromMesh(), this.edges = $s(t), this.edgeIds = void 0, this.dropMesh(), this.edgeNodes = void 0, this.tins = void 0, this.indexedTins = void 0;
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
    i.push(t[0]), this.boundsPolygon = me([i]), this.xy = [e, s], this.wh = [n - e, o - s], this.vertexMode = it.VERTEX_PLAIN, this.tins = void 0, this.indexedTins = void 0;
  }
  /** 設定を変える前に、局所更新を当てた網を入力へ書き戻して、網を捨てる（id の並びと版は保つ）。 */
  retireMesh() {
    this.syncFromMesh(), this.mesh = void 0, this.meshFailure = void 0, this.bandStale = !1;
  }
  /**
   * 現在の設定を永続化可能な形式にコンパイルします
   */
  getCompiled() {
    if (this.meshAhead && this.mesh) return this.mesh.toCompiled();
    const t = {};
    if (t.version = this.useV2Algorithm ? ds : gs, t.points = this.points, t.weight_buffer = {}, this.compiledOuter?.outerTransform === "worldFile")
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
    }), this.strict_status === it.STATUS_LOOSE ? (t.tins_points[1] = [], this.tins.bakw.features.map((e) => {
      t.tins_points[1].push(
        ["a", "b", "c"].map(
          (n) => e.properties[n].index
        )
      );
    })) : this.strict_status === it.STATUS_ERROR && this.kinks?.bakw && (t.kinks_points = this.kinks.bakw.features.map(
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
    this.dropMesh(), this.pointIds = void 0, this.edgeIds = void 0, super.setCompiled(t), this.supplementRecords = (t.supplementPairs ?? []).map((s) => ({
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
  calculateStrictTin(t = Wn) {
    this.resolveStrictOverlaps(), this.detectStrictKinks(t);
  }
  /**
   * 順三角網から逆三角網を写し、重なりを辺の反転で解消する（`calculateStrictTin` の前半）。
   * 交差の判定（`strict_status`・`kinks`）はしない。補完点の置き場所を測る試行は、三角網の向きを読むだけなので
   * これだけを呼ぶ。
   */
  resolveStrictOverlaps() {
    const t = this.tins.forw.features.map(
      (s) => an(s)
    );
    this.tins.bakw = bt(t);
    const e = {};
    this.tins.forw.features.forEach((s, o) => {
      const i = this.tins.bakw.features[o];
      _s(e, { forw: s, bakw: i });
    });
    const n = (this.pointsSet?.forw.features ?? []).map(
      (s) => s.properties.target.index
    );
    Ai(
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
      return hn(s, t);
    });
    e[0].length === 0 && e[1].length === 0 ? (this.strict_status = it.STATUS_STRICT, delete this.kinks) : (this.strict_status = it.STATUS_ERROR, this.kinks = {
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
      t.forw.push(a), t.bakw.push(Kt(a));
    }
    const e = [];
    let n = 0;
    this.edgeNodes = [], this.edges || (this.edges = []);
    for (let s = 0; s < this.edges.length; s++) {
      const o = this.edges[s][2], i = Object.assign([], this.edges[s][0]), a = Object.assign([], this.edges[s][1]);
      if (bo(o, this.points.length, s), i.length === 0 && a.length === 0) {
        e.push(o);
        continue;
      }
      i.unshift(this.points[o[0]][0]), i.push(this.points[o[1]][0]), a.unshift(this.points[o[0]][1]), a.push(this.points[o[1]][1]), Fs(i, a).forEach((c, f, l) => {
        this.edgeNodes[n] = [
          c[0],
          c[1]
        ];
        const h = Yt(
          c[0],
          c[1],
          `e${n}`
        );
        n++, t.forw.push(h), t.bakw.push(Kt(h)), f === 0 ? e.push([o[0], t.forw.length - 1]) : e.push([
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
    if (!this.points.reduce((c, f) => c && (o ? tn(f[0], o) : f[0][0] >= t && f[0][0] <= e && f[0][1] >= n && f[0][1] <= s), !0))
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
      const t = Zi(this.getCompiled(), this.pointsSet.edges, {
        points: this.pointIds,
        edges: this.edgeIds
      });
      "model" in t ? this.mesh = t.model : this.meshFailure = t.reason;
    }
  }
  /** 三角網を最初から全部組む（`updateTin()` の本体）。 */
  rebuildAll() {
    this.lastBoundaryDiagnostics = void 0, this.supplementRecords = [], this.attemptTotal = 0, this.lastSupplementDiagnostics = void 0;
    let t = this.strictMode;
    t !== it.MODE_STRICT && t !== it.MODE_LOOSE && (t = it.MODE_AUTO);
    const e = !this.useV2Algorithm, n = this.requestedWorldFile;
    if (n && !e) throw new Error("V2 では world file 外周を使えません");
    let s, o, i, a, c;
    if (e) {
      if (this.bounds) {
        const C = this.boundsPolygon;
        if (!C) throw new Error("Internal error: bounds is set but boundsPolygon is missing");
        if (!this.points.every(
          (N) => tn(N[0], C)
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
    const u = mr(f.forw), m = Vn(f.forw);
    if (!m) throw "TOO LINEAR2";
    const b = {}, g = m.geometry.coordinates[0];
    let k;
    try {
      k = g.map((C) => ({
        forw: C,
        bakw: qe(Zt(C), l)
      })), k.forEach((C) => {
        b[`${C.forw[0]}:${C.forw[1]}`] = C;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const M = Vn(f.bakw);
    if (!M) throw "TOO LINEAR2";
    const v = M.geometry.coordinates[0];
    try {
      k = v.map((C) => ({
        bakw: C,
        forw: qe(Zt(C), h)
      })), k.forEach((C) => {
        b[`${C.forw[0]}:${C.forw[1]}`] = C;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const x = {
      forw: u.geometry.coordinates,
      bakw: qe(u, l)
    }, p = Yt(x.forw, x.bakw, "c");
    this.centroid = {
      forw: p,
      bakw: Kt(p)
    };
    const w = [
      ...this.points.map((C) => ({ forw: C[0], bakw: C[1] })),
      ...(this.edgeNodes ?? []).map((C) => ({ forw: C[0], bakw: C[1] }))
    ], d = {
      convexBuf: b,
      centroid: x,
      allGcps: w,
      minx: o,
      maxx: i,
      miny: a,
      maxy: c
    }, y = t === it.MODE_STRICT || t === it.MODE_AUTO, S = (C, E, N) => {
      if (!y || this.isStrict() || !C.boundary) return { result: C };
      const I = () => ({
        build: this.captureBuild(),
        raw: [s.forw.slice(), s.bakw.slice()],
        gcps: w.slice(),
        edgeNodes: this.edgeNodes.slice(),
        supplementRecords: this.supplementRecords,
        supplementDiagnostics: this.lastSupplementDiagnostics
      }), F = (L) => {
        s.forw.splice(0, s.forw.length, ...L.raw[0]), s.bakw.splice(0, s.bakw.length, ...L.raw[1]), w.splice(0, w.length, ...L.gcps), this.edgeNodes.splice(0, this.edgeNodes.length, ...L.edgeNodes), this.restoreBuild(L.build), this.supplementRecords = L.supplementRecords, this.lastSupplementDiagnostics = L.supplementDiagnostics;
      }, P = I(), V = this.attemptTotal, A = () => this.attemptTotal - V, T = (L, U) => {
        const W = U.map(([Q]) => Q), H = U.map(([, Q]) => Q);
        return (L[0] === Math.min(...W) || L[0] === Math.max(...W)) && (L[1] === Math.min(...H) || L[1] === Math.max(...H));
      }, $ = (L) => {
        s.forw.splice(0, s.forw.length, ...P.raw[0]), s.bakw.splice(0, s.bakw.length, ...P.raw[1]), w.splice(0, w.length, ...P.gcps), this.edgeNodes.splice(0, this.edgeNodes.length, ...P.edgeNodes), this.supplementRecords = [];
        const U = N(L);
        return { built: U, strict: U.boundary !== void 0 && this.isStrict() };
      }, X = /* @__PURE__ */ new Set(), q = C.boundary.vertices.map(({ forw: L }) => L), Y = new Set(
        q.filter((L) => !T(L, q)).map((L) => fn(L, x.forw))
      );
      try {
        let L = C;
        for (let U = 0; U < uo && !(A() + E >= ms * E); U++) {
          const W = L.boundary.vertices.map(({ forw: K }) => K), H = X.size;
          for (const K of Qr(this.tins.forw)) {
            if (T(K, W)) continue;
            const tt = fn(K, x.forw);
            for (let et = -ps; et <= ps; et++) X.add((tt + et + 36) % 36);
          }
          if (X.size === H || X.size >= po) break;
          const Q = $({ skipBins: new Set(X) });
          if (!Q.built.boundary)
            return F(P), { result: C };
          if (Q.strict) {
            let K = { result: Q.built, state: I() };
            for (const tt of mo(X)) {
              if (!tt.some((R) => Y.has(R))) continue;
              if (A() >= go * E) break;
              const et = new Set([...X].filter((R) => !tt.includes(R))), lt = $({ skipBins: et });
              if (lt.strict) {
                for (const R of tt) X.delete(R);
                K = { result: lt.built, state: I() };
              }
            }
            return F(K.state), { result: K.result, kind: "thinned" };
          }
          L = Q.built;
        }
        if (A() < ms * E) {
          const U = $({ cornersOnly: !0 });
          if (U.strict) return { result: U.built, kind: "corners" };
        }
      } catch {
      }
      return F(P), { result: C };
    };
    if (n) {
      this.stateTriangle = void 0;
      const C = this.yaxisMode === it.YAXIS_FOLLOW, E = C ? 1 : -1, N = (T) => this.buildWithSupplements(t, s, w, ($, X, q) => (Y) => ({ boundary: Yn(
        T ? { ...d, ring: T } : d,
        (L) => Hr(L, (U) => {
          const [W, H] = Ls(n, U);
          return [W, C ? -H : H];
        }),
        s,
        this.points.length,
        {
          orientation: E,
          accept: (L) => L.hasMapBoundary ? (this.buildTin(s, L.vertices, X, L, Y.size > 0, q), (this.strict_status !== it.STATUS_LOOSE || L.hasBoundary) && Te(this.tins.forw, E) === 0 && Te(this.tins.bakw, E) === 0) : !1
        },
        Y,
        $
      ) })), I = this.attemptTotal, F = N(), P = this.attemptTotal - I, { result: { boundary: V }, kind: A } = S(F, P, N);
      if (V) {
        this.compiledOuter = {
          outerTransform: "worldFile",
          worldFile: n,
          vertices_points: V.vertices.map(({ forw: Y, bakw: L }) => [Y, L])
        };
        const { centroid: T, xy: $, wh: X, kinks: q } = this;
        super.setCompiled(this.getCompiled()), Object.assign(this, { centroid: T, xy: $, wh: X, kinks: q }), this.lastBoundaryDiagnostics = {
          ...V.diagnostics,
          ...A ? { ringRescue: A } : {},
          requestedOuterTransform: "worldFile",
          outerTransform: "worldFile"
        };
        return;
      }
      this.compiledOuter = { outerTransform: "extrapolate" }, this.outerTransform = "extrapolate", this.worldFile = void 0;
    }
    const _ = this.vertexMode === it.VERTEX_BIRDEYE ? Ss : ks;
    let O, B, D;
    if (e) {
      const C = this.incrementalRebuild && !this.localRebuildDisabled && y && !n, E = {
        fullAttempts: 0,
        localAttempts: 0,
        localFailures: 0,
        localMs: 0,
        adoptedLocal: !1,
        fellBack: this.localRebuildDisabled
      };
      this.lastRebuildDiagnostics = this.incrementalRebuild ? E : void 0;
      let N;
      const I = s.forw.length, F = ($, X, q) => {
        const Y = $ ? { ...d, ring: $ } : d, L = i - o, U = c - a, W = te(s.forw.map(({ geometry: R }) => R.coordinates)), H = W.filter((R) => !X.has(le(R))), Q = s.forw.slice(I).map((R) => ({
          index: R.properties.target.index,
          forw: R.geometry.coordinates,
          bakw: R.properties.target.geom
        }));
        let K;
        for (const R of pn) {
          const z = q.get(R) ?? { forwReuse: {} };
          q.set(R, z);
          const G = z.vertices ?? (z.vertices = _({
            ...Y,
            minx: o - R * L,
            maxx: i + R * L,
            miny: a - R * U,
            maxy: c + R * U
          }, !0));
          if (!oe(G.map((qt) => qt.forw), x.forw, -1) || !oe(G.map((qt) => qt.bakw), x.bakw, 1)) continue;
          const st = Ci(N), at = Is(st, { vertices: G, addPoints: Q, hull: H, forwOnly: !0 });
          if (!at.ok) continue;
          st.mesh.repairBad(), st.mesh.bad.size > 0 && st.mesh.bad.size <= wo && st.mesh.healBad();
          const wt = $i(st);
          if ((!K || wt < K.flips) && (K = { build: st, vertices: G, margin: R, flips: wt, applied: at.applied }), wt === 0) break;
        }
        if (!K) return;
        const tt = {
          forw: K.vertices.map(({ forw: R, bakw: z }, G) => Yt(R, z, `b${G}`)),
          bakw: []
        };
        tt.bakw = tt.forw.map(Kt), this.pointsSet = {
          forw: bt([...s.forw, ...tt.forw]),
          bakw: bt([...s.bakw, ...tt.bakw]),
          edges: s.edges
        };
        const et = je(Vi(K.build));
        this.tins = { forw: et }, this.localTins.add(this.tins), this.strict_status = K.build.mesh.isStrict() ? it.STATUS_STRICT : it.STATUS_ERROR, delete this.kinks;
        const { mesh: lt } = K.build;
        return {
          boundary: {
            vertices: K.vertices,
            forw: et,
            bakw: et,
            diagnostics: {
              margin: K.margin,
              boundaryTriangleFlips: K.flips,
              remainingForbiddenTriangles: lt.forbiddenBoundary + lt.forbiddenEdge
            },
            hasMapBoundary: !0,
            hasBoundary: !0,
            forwHull: { all: W, applied: K.applied }
          },
          verticesList: tt
        };
      }, P = ($) => this.buildWithSupplements(t, s, w, (X, q, Y) => (L) => {
        if (N) {
          const Q = performance.now(), K = F($, L, X);
          if (E.localMs += performance.now() - Q, K)
            return E.localAttempts++, K;
          E.localFailures++;
        }
        E.fullAttempts++;
        const U = $ ? { ...d, ring: $ } : d, W = Yn(
          U,
          _,
          s,
          this.points.length,
          void 0,
          L,
          X
        );
        return C && !N && !$ && !Y && L.size === 0 && s.forw.length === I && W?.hasBoundary && (N = Di(
          [...s.forw, ...W.vertices.map(({ forw: Q, bakw: K }, tt) => Yt(Q, K, `b${tt}`))],
          W.forw,
          s.edges,
          this.points.length,
          -1
        )), {
          boundary: W,
          verticesList: this.buildTin(
            s,
            W?.vertices ?? _(U, !1),
            q,
            W,
            L.size > 0,
            Y
          )
        };
      }), V = this.attemptTotal, A = P(), T = S(A, this.attemptTotal - V, P);
      if ({ boundary: O, verticesList: B } = T.result, D = T.kind, this.localTins.has(this.tins) && (E.adoptedLocal = !0, this.tins.bakw = bt(this.tins.forw.features.map((X) => an(X))), !["forw", "bakw"].every(
        (X) => hn(
          this.tins[X].features.map((q) => q.geometry.coordinates[0]),
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
      B = this.buildTin(
        s,
        _(d, !1),
        t,
        void 0
      );
    this.vertices_params = {
      forw: Xn(B.forw, this.centroid.forw),
      bakw: Xn(B.bakw, this.centroid.bakw)
    }, this.addIndexedTin(), this.pointsWeightBuffer = {}, this.lastBoundaryDiagnostics = O && D ? { ...O.diagnostics, ringRescue: D } : O?.diagnostics, n && this.lastBoundaryDiagnostics && (this.lastBoundaryDiagnostics = {
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
    const i = (d, y, S) => {
      const _ = s(d, y, S);
      return (O) => (o++, this.attemptTotal++, _(O));
    }, a = (d) => this.buildWithHull(d, i(/* @__PURE__ */ new Map(), d, !1));
    if (!this.useSupplementPairs || this.useV2Algorithm || t === it.MODE_LOOSE) return a(t);
    const c = t, f = a(c), l = o;
    let h = 0;
    if (!f.boundary || this.strict_status !== it.STATUS_STRICT) return f;
    const u = on(this.tins.forw, this.pointsSet.forw.features, f.boundary.forwHull.all);
    if (u.dropped.length === 0) return f;
    const m = this.edgeNodes.length, b = e.forw.length, g = n.length;
    let k = [], M;
    const v = (d, y) => d.length === y.length && d.every((S, _) => S.every((O, B) => O[0] === y[_][B][0] && O[1] === y[_][B][1])), x = (d) => {
      e.forw.length = b, e.bakw.length = b, n.length = g, this.edgeNodes.length = m;
      for (const [y, S] of d) {
        const _ = Yt(y, S, `e${this.edgeNodes.length}`);
        this.edgeNodes.push([y, S]), e.forw.push(_), e.bakw.push(Kt(_)), n.push({ forw: y, bakw: S });
      }
      k = d;
    }, w = Wi({
      edgeBase: m,
      baseCost: l,
      buildCost: () => h,
      snapshot: () => ({ pairs: k, state: this.captureBuild() }),
      restore: ({ pairs: d, state: y }) => {
        x(d), this.restoreBuild(y);
      },
      measure: (d) => {
        x(d);
        const y = this.captureBuild();
        try {
          const S = /* @__PURE__ */ new Map();
          M = { pairs: d, cache: S };
          const { boundary: _ } = s(S, it.MODE_STRICT, !0)(/* @__PURE__ */ new Set());
          return _ ? on(this.tins.forw, this.pointsSet.forw.features, []) : void 0;
        } finally {
          this.restoreBuild(y);
        }
      },
      build: (d, y) => {
        x(d);
        const S = M && v(M.pairs, d) ? M.cache : /* @__PURE__ */ new Map(), _ = o;
        let O;
        try {
          O = this.buildWithHull(c, (B) => {
            if (o - _ >= y) throw ws;
            return i(S, c, !1)(B);
          });
        } catch (B) {
          if (B !== ws) throw B;
          h += o - _;
          return;
        }
        if (h += o - _, !(!O.boundary || this.strict_status !== it.STATUS_STRICT))
          return {
            result: O,
            analysis: on(this.tins.forw, this.pointsSet.forw.features, O.boundary.forwHull.all)
          };
      }
    }, { result: f, analysis: u });
    return this.supplementRecords = w.records, this.lastSupplementDiagnostics = w.diagnostics, w.result;
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
    const o = (g) => [...g].sort().join(","), i = (g, k = !1) => {
      const M = o(g), v = n.get(M);
      if (v) return v;
      const x = e(g), p = {
        value: x,
        strict: x.boundary !== void 0 && this.strict_status === it.STATUS_STRICT
      };
      return (p.strict || k) && (p.state = this.captureBuild()), n.set(M, p), s = p, p;
    }, a = (g) => (s !== g && this.restoreBuild(g.state), s = g, g.value), c = i(/* @__PURE__ */ new Set(), !0);
    if (!(t === it.MODE_STRICT || t === it.MODE_AUTO) || !c.value.boundary || c.strict) return c.value;
    const l = new Set(c.value.boundary.forwHull.all.map(le)), h = () => this.pointsSet.forw.features.map(
      (g) => g.properties.target.index
    ), u = /* @__PURE__ */ new Set();
    let m = c, b;
    for (let g = 0; g < ho; g++) {
      const k = Fi(
        this.tins.forw,
        m.value.boundary.forwHull.applied,
        h()
      ).filter((M) => !u.has(le(M)));
      if (k.length === 0) break;
      for (const M of k) u.add(le(M));
      if (m = i(u), !m.value.boundary) break;
      if (m.strict) {
        b = m;
        break;
      }
    }
    if (b) {
      let g = b;
      for (const k of [...u].slice(0, vo)) {
        const M = new Set(u);
        M.delete(k);
        const v = i(M);
        v.strict && (u.delete(k), g = v);
      }
      return a(g);
    }
    if (u.size < l.size) {
      const g = i(l);
      if (g.strict) return a(g);
    }
    return a(c);
  }
  /** 今の三角網が strict か（組み立ての途中で `strict_status` が変わるので、型の絞り込みを避けて読む）。 */
  isStrict() {
    return this.strict_status === it.STATUS_STRICT;
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
      const f = e[c].forw, l = e[c].bakw, h = Yt(f, l, `b${c}`), u = Kt(h);
      a.forw.push(h), a.bakw.push(u);
    }
    return this.pointsSet = {
      forw: bt([...t.forw, ...a.forw]),
      bakw: bt([...t.bakw, ...a.bakw]),
      edges: t.edges
    }, this.tins = {
      forw: je(
        s?.forw ?? _e(this.pointsSet.forw, t.edges, "target")
      )
    }, (n === it.MODE_STRICT || n === it.MODE_AUTO) && (i ? this.resolveStrictOverlaps() : this.calculateStrictTin(
      n === it.MODE_AUTO || o ? 1 : Wn
    )), (n === it.MODE_LOOSE || n === it.MODE_AUTO && this.strict_status === it.STATUS_ERROR) && (this.tins.bakw = je(
      s?.bakw ?? _e(this.pointsSet.bakw, t.edges, "target")
    ), delete this.kinks, this.strict_status = it.STATUS_LOOSE), a;
  }
  /**
   * 非同期ラッパーを提供します。
   * 互換性のために Promise ベースの API を維持しますが、内部処理は同期的です。
   */
  async updateTinAsync() {
    this.updateTin();
  }
}
function bo(r, t, e) {
  const n = (s) => Number.isInteger(s) && s >= 0 && s < t;
  if (!Array.isArray(r) || !n(r[0]) || !n(r[1]))
    throw new Error(
      `Invalid edge at edges[${e}]: start/end ${JSON.stringify(r)} must be integer indices of points (0 to ${t - 1})`
    );
}
export {
  ie as BOUNDARY_GROUP,
  Ot as EDGE_HULL,
  es as EDGE_PROTECT,
  Dt as EDGE_REQUIRED,
  Le as IncrementalMesh,
  Qi as MeshModel,
  it as Tin,
  _e as constrainedTin,
  Kt as counterPoint,
  Yt as createPoint,
  it as default,
  xo as findIntersections,
  ds as format_version,
  ro as insertEdge,
  no as insertPoint,
  _s as insertSearchIndex,
  Zi as meshFromCompiled,
  eo as movePoint,
  io as removeEdge,
  so as removePoint,
  oo as replaceEdgeNodes,
  Xn as vertexCalc
};
