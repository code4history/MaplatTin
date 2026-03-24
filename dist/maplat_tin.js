var hr = Object.defineProperty;
var ur = (n, e, t) => e in n ? hr(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var bt = (n, e, t) => ur(n, typeof e != "symbol" ? e + "" : e, t);
function Ie(n, e, t = {}) {
  const i = { type: "Feature" };
  return (t.id === 0 || t.id) && (i.id = t.id), t.bbox && (i.bbox = t.bbox), i.properties = e || {}, i.geometry = n, i;
}
function Qt(n, e, t = {}) {
  if (!n)
    throw new Error("coordinates is required");
  if (!Array.isArray(n))
    throw new Error("coordinates must be an Array");
  if (n.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!gn(n[0]) || !gn(n[1]))
    throw new Error("coordinates must contain numbers");
  return Ie({
    type: "Point",
    coordinates: n
  }, e, t);
}
function xe(n, e, t = {}) {
  for (const s of n) {
    if (s.length < 4)
      throw new Error(
        "Each LinearRing of a Polygon must have 4 or more Positions."
      );
    if (s[s.length - 1].length !== s[0].length)
      throw new Error("First and last Position are not equivalent.");
    for (let r = 0; r < s[s.length - 1].length; r++)
      if (s[s.length - 1][r] !== s[0][r])
        throw new Error("First and last Position are not equivalent.");
  }
  return Ie({
    type: "Polygon",
    coordinates: n
  }, e, t);
}
function ze(n, e, t = {}) {
  if (n.length < 2)
    throw new Error("coordinates must be an array of two or more positions");
  return Ie({
    type: "LineString",
    coordinates: n
  }, e, t);
}
function Vt(n, e = {}) {
  const t = { type: "FeatureCollection" };
  return e.id && (t.id = e.id), e.bbox && (t.bbox = e.bbox), t.features = n, t;
}
function gn(n) {
  return !isNaN(n) && n !== null && !Array.isArray(n);
}
function lr(n) {
  if (!n)
    throw new Error("coord is required");
  if (!Array.isArray(n)) {
    if (n.type === "Feature" && n.geometry !== null && n.geometry.type === "Point")
      return [...n.geometry.coordinates];
    if (n.type === "Point")
      return [...n.coordinates];
  }
  if (Array.isArray(n) && n.length >= 2 && !Array.isArray(n[0]) && !Array.isArray(n[1]))
    return [...n];
  throw new Error("coord must be GeoJSON Point or an Array of numbers");
}
function dr(n) {
  return n.type === "Feature" ? n.geometry : n;
}
function un(n, e, t) {
  if (n !== null)
    for (var i, s, r, o, a, c, f, u = 0, h = 0, p, g = n.type, _ = g === "FeatureCollection", v = g === "Feature", R = _ ? n.features.length : 1, C = 0; C < R; C++) {
      f = _ ? n.features[C].geometry : v ? n.geometry : n, p = f ? f.type === "GeometryCollection" : !1, a = p ? f.geometries.length : 1;
      for (var m = 0; m < a; m++) {
        var y = 0, l = 0;
        if (o = p ? f.geometries[m] : f, o !== null) {
          c = o.coordinates;
          var w = o.type;
          switch (u = t && (w === "Polygon" || w === "MultiPolygon") ? 1 : 0, w) {
            case null:
              break;
            case "Point":
              if (e(
                c,
                h,
                C,
                y,
                l
              ) === !1)
                return !1;
              h++, y++;
              break;
            case "LineString":
            case "MultiPoint":
              for (i = 0; i < c.length; i++) {
                if (e(
                  c[i],
                  h,
                  C,
                  y,
                  l
                ) === !1)
                  return !1;
                h++, w === "MultiPoint" && y++;
              }
              w === "LineString" && y++;
              break;
            case "Polygon":
            case "MultiLineString":
              for (i = 0; i < c.length; i++) {
                for (s = 0; s < c[i].length - u; s++) {
                  if (e(
                    c[i][s],
                    h,
                    C,
                    y,
                    l
                  ) === !1)
                    return !1;
                  h++;
                }
                w === "MultiLineString" && y++, w === "Polygon" && l++;
              }
              w === "Polygon" && y++;
              break;
            case "MultiPolygon":
              for (i = 0; i < c.length; i++) {
                for (l = 0, s = 0; s < c[i].length; s++) {
                  for (r = 0; r < c[i][s].length - u; r++) {
                    if (e(
                      c[i][s][r],
                      h,
                      C,
                      y,
                      l
                    ) === !1)
                      return !1;
                    h++;
                  }
                  l++;
                }
                y++;
              }
              break;
            case "GeometryCollection":
              for (i = 0; i < o.geometries.length; i++)
                if (un(o.geometries[i], e, t) === !1)
                  return !1;
              break;
            default:
              throw new Error("Unknown Geometry Type");
          }
        }
      }
    }
}
const Dt = 11102230246251565e-32, rt = 134217729, zn = (3 + 8 * Dt) * Dt;
function Ct(n, e, t, i, s) {
  let r, o, a, c, f = e[0], u = i[0], h = 0, p = 0;
  u > f == u > -f ? (r = f, f = e[++h]) : (r = u, u = i[++p]);
  let g = 0;
  if (h < n && p < t)
    for (u > f == u > -f ? (o = f + r, a = r - (o - f), f = e[++h]) : (o = u + r, a = r - (o - u), u = i[++p]), r = o, a !== 0 && (s[g++] = a); h < n && p < t; )
      u > f == u > -f ? (o = r + f, c = o - r, a = r - (o - c) + (f - c), f = e[++h]) : (o = r + u, c = o - r, a = r - (o - c) + (u - c), u = i[++p]), r = o, a !== 0 && (s[g++] = a);
  for (; h < n; )
    o = r + f, c = o - r, a = r - (o - c) + (f - c), f = e[++h], r = o, a !== 0 && (s[g++] = a);
  for (; p < t; )
    o = r + u, c = o - r, a = r - (o - c) + (u - c), u = i[++p], r = o, a !== 0 && (s[g++] = a);
  return (r !== 0 || g === 0) && (s[g++] = r), g;
}
function zt(n, e, t, i, s, r, o, a) {
  return Ct(Ct(n, e, t, i, o), o, s, r, a);
}
function j(n, e, t, i) {
  let s, r, o, a, c, f, u, h, p, g, _;
  u = rt * t, g = u - (u - t), _ = t - g;
  let v = e[0];
  s = v * t, u = rt * v, h = u - (u - v), p = v - h, o = p * _ - (s - h * g - p * g - h * _);
  let R = 0;
  o !== 0 && (i[R++] = o);
  for (let C = 1; C < n; C++)
    v = e[C], a = v * t, u = rt * v, h = u - (u - v), p = v - h, c = p * _ - (a - h * g - p * g - h * _), r = s + c, f = r - s, o = s - (r - f) + (c - f), o !== 0 && (i[R++] = o), s = a + r, o = r - (s - a), o !== 0 && (i[R++] = o);
  return (s !== 0 || R === 0) && (i[R++] = s), R;
}
function Wn(n, e) {
  let t = e[0];
  for (let i = 1; i < n; i++) t += e[i];
  return t;
}
function vt(n) {
  return new Float64Array(n);
}
const pr = (3 + 16 * Dt) * Dt, gr = (2 + 12 * Dt) * Dt, mr = (9 + 64 * Dt) * Dt * Dt, we = vt(4), mn = vt(8), wn = vt(12), yn = vt(16), Ft = vt(4);
function wr(n, e, t, i, s, r, o) {
  let a, c, f, u, h, p, g, _, v, R, C, m, y, l, w, x, I, T;
  const S = n - s, A = t - s, N = e - r, Y = i - r;
  l = S * Y, p = rt * S, g = p - (p - S), _ = S - g, p = rt * Y, v = p - (p - Y), R = Y - v, w = _ * R - (l - g * v - _ * v - g * R), x = N * A, p = rt * N, g = p - (p - N), _ = N - g, p = rt * A, v = p - (p - A), R = A - v, I = _ * R - (x - g * v - _ * v - g * R), C = w - I, h = w - C, we[0] = w - (C + h) + (h - I), m = l + C, h = m - l, y = l - (m - h) + (C - h), C = y - x, h = y - C, we[1] = y - (C + h) + (h - x), T = m + C, h = T - m, we[2] = m - (T - h) + (C - h), we[3] = T;
  let q = Wn(4, we), d = gr * o;
  if (q >= d || -q >= d || (h = n - S, a = n - (S + h) + (h - s), h = t - A, f = t - (A + h) + (h - s), h = e - N, c = e - (N + h) + (h - r), h = i - Y, u = i - (Y + h) + (h - r), a === 0 && c === 0 && f === 0 && u === 0) || (d = mr * o + zn * Math.abs(q), q += S * u + Y * a - (N * f + A * c), q >= d || -q >= d)) return q;
  l = a * Y, p = rt * a, g = p - (p - a), _ = a - g, p = rt * Y, v = p - (p - Y), R = Y - v, w = _ * R - (l - g * v - _ * v - g * R), x = c * A, p = rt * c, g = p - (p - c), _ = c - g, p = rt * A, v = p - (p - A), R = A - v, I = _ * R - (x - g * v - _ * v - g * R), C = w - I, h = w - C, Ft[0] = w - (C + h) + (h - I), m = l + C, h = m - l, y = l - (m - h) + (C - h), C = y - x, h = y - C, Ft[1] = y - (C + h) + (h - x), T = m + C, h = T - m, Ft[2] = m - (T - h) + (C - h), Ft[3] = T;
  const k = Ct(4, we, 4, Ft, mn);
  l = S * u, p = rt * S, g = p - (p - S), _ = S - g, p = rt * u, v = p - (p - u), R = u - v, w = _ * R - (l - g * v - _ * v - g * R), x = N * f, p = rt * N, g = p - (p - N), _ = N - g, p = rt * f, v = p - (p - f), R = f - v, I = _ * R - (x - g * v - _ * v - g * R), C = w - I, h = w - C, Ft[0] = w - (C + h) + (h - I), m = l + C, h = m - l, y = l - (m - h) + (C - h), C = y - x, h = y - C, Ft[1] = y - (C + h) + (h - x), T = m + C, h = T - m, Ft[2] = m - (T - h) + (C - h), Ft[3] = T;
  const M = Ct(k, mn, 4, Ft, wn);
  l = a * u, p = rt * a, g = p - (p - a), _ = a - g, p = rt * u, v = p - (p - u), R = u - v, w = _ * R - (l - g * v - _ * v - g * R), x = c * f, p = rt * c, g = p - (p - c), _ = c - g, p = rt * f, v = p - (p - f), R = f - v, I = _ * R - (x - g * v - _ * v - g * R), C = w - I, h = w - C, Ft[0] = w - (C + h) + (h - I), m = l + C, h = m - l, y = l - (m - h) + (C - h), C = y - x, h = y - C, Ft[1] = y - (C + h) + (h - x), T = m + C, h = T - m, Ft[2] = m - (T - h) + (C - h), Ft[3] = T;
  const B = Ct(M, wn, 4, Ft, yn);
  return yn[B - 1];
}
function re(n, e, t, i, s, r) {
  const o = (e - r) * (t - s), a = (n - s) * (i - r), c = o - a, f = Math.abs(o + a);
  return Math.abs(c) >= pr * f ? c : -wr(n, e, t, i, s, r, f);
}
const yr = (10 + 96 * Dt) * Dt, br = (4 + 48 * Dt) * Dt, vr = (44 + 576 * Dt) * Dt * Dt, oe = vt(4), ae = vt(4), ce = vt(4), Zt = vt(4), te = vt(4), ee = vt(4), Lt = vt(4), $t = vt(4), He = vt(8), Ze = vt(8), tn = vt(8), en = vt(8), nn = vt(8), rn = vt(8), Oe = vt(8), Te = vt(8), Ne = vt(8), de = vt(4), pe = vt(4), ge = vt(4), ot = vt(8), dt = vt(16), St = vt(16), Et = vt(16), xt = vt(32), fe = vt(32), Tt = vt(48), qt = vt(64);
let ve = vt(1152), sn = vt(1152);
function Nt(n, e, t) {
  n = Ct(n, ve, e, t, sn);
  const i = ve;
  return ve = sn, sn = i, n;
}
function xr(n, e, t, i, s, r, o, a, c) {
  let f, u, h, p, g, _, v, R, C, m, y, l, w, x, I, T, S, A, N, Y, q, d, k, M, B, X, L, b, P, F, V, U, z, Q, W;
  const ft = n - o, ct = t - o, ut = s - o, pt = e - a, mt = i - a, gt = r - a;
  V = ct * gt, k = rt * ct, M = k - (k - ct), B = ct - M, k = rt * gt, X = k - (k - gt), L = gt - X, U = B * L - (V - M * X - B * X - M * L), z = ut * mt, k = rt * ut, M = k - (k - ut), B = ut - M, k = rt * mt, X = k - (k - mt), L = mt - X, Q = B * L - (z - M * X - B * X - M * L), b = U - Q, d = U - b, oe[0] = U - (b + d) + (d - Q), P = V + b, d = P - V, F = V - (P - d) + (b - d), b = F - z, d = F - b, oe[1] = F - (b + d) + (d - z), W = P + b, d = W - P, oe[2] = P - (W - d) + (b - d), oe[3] = W, V = ut * pt, k = rt * ut, M = k - (k - ut), B = ut - M, k = rt * pt, X = k - (k - pt), L = pt - X, U = B * L - (V - M * X - B * X - M * L), z = ft * gt, k = rt * ft, M = k - (k - ft), B = ft - M, k = rt * gt, X = k - (k - gt), L = gt - X, Q = B * L - (z - M * X - B * X - M * L), b = U - Q, d = U - b, ae[0] = U - (b + d) + (d - Q), P = V + b, d = P - V, F = V - (P - d) + (b - d), b = F - z, d = F - b, ae[1] = F - (b + d) + (d - z), W = P + b, d = W - P, ae[2] = P - (W - d) + (b - d), ae[3] = W, V = ft * mt, k = rt * ft, M = k - (k - ft), B = ft - M, k = rt * mt, X = k - (k - mt), L = mt - X, U = B * L - (V - M * X - B * X - M * L), z = ct * pt, k = rt * ct, M = k - (k - ct), B = ct - M, k = rt * pt, X = k - (k - pt), L = pt - X, Q = B * L - (z - M * X - B * X - M * L), b = U - Q, d = U - b, ce[0] = U - (b + d) + (d - Q), P = V + b, d = P - V, F = V - (P - d) + (b - d), b = F - z, d = F - b, ce[1] = F - (b + d) + (d - z), W = P + b, d = W - P, ce[2] = P - (W - d) + (b - d), ce[3] = W, f = Ct(
    Ct(
      Ct(
        j(j(4, oe, ft, ot), ot, ft, dt),
        dt,
        j(j(4, oe, pt, ot), ot, pt, St),
        St,
        xt
      ),
      xt,
      Ct(
        j(j(4, ae, ct, ot), ot, ct, dt),
        dt,
        j(j(4, ae, mt, ot), ot, mt, St),
        St,
        fe
      ),
      fe,
      qt
    ),
    qt,
    Ct(
      j(j(4, ce, ut, ot), ot, ut, dt),
      dt,
      j(j(4, ce, gt, ot), ot, gt, St),
      St,
      xt
    ),
    xt,
    ve
  );
  let Bt = Wn(f, ve), Xt = br * c;
  if (Bt >= Xt || -Bt >= Xt || (d = n - ft, u = n - (ft + d) + (d - o), d = e - pt, g = e - (pt + d) + (d - a), d = t - ct, h = t - (ct + d) + (d - o), d = i - mt, _ = i - (mt + d) + (d - a), d = s - ut, p = s - (ut + d) + (d - o), d = r - gt, v = r - (gt + d) + (d - a), u === 0 && h === 0 && p === 0 && g === 0 && _ === 0 && v === 0) || (Xt = vr * c + zn * Math.abs(Bt), Bt += (ft * ft + pt * pt) * (ct * v + gt * h - (mt * p + ut * _)) + 2 * (ft * u + pt * g) * (ct * gt - mt * ut) + ((ct * ct + mt * mt) * (ut * g + pt * p - (gt * u + ft * v)) + 2 * (ct * h + mt * _) * (ut * pt - gt * ft)) + ((ut * ut + gt * gt) * (ft * _ + mt * u - (pt * h + ct * g)) + 2 * (ut * p + gt * v) * (ft * mt - pt * ct)), Bt >= Xt || -Bt >= Xt))
    return Bt;
  if ((h !== 0 || _ !== 0 || p !== 0 || v !== 0) && (V = ft * ft, k = rt * ft, M = k - (k - ft), B = ft - M, U = B * B - (V - M * M - (M + M) * B), z = pt * pt, k = rt * pt, M = k - (k - pt), B = pt - M, Q = B * B - (z - M * M - (M + M) * B), b = U + Q, d = b - U, Zt[0] = U - (b - d) + (Q - d), P = V + b, d = P - V, F = V - (P - d) + (b - d), b = F + z, d = b - F, Zt[1] = F - (b - d) + (z - d), W = P + b, d = W - P, Zt[2] = P - (W - d) + (b - d), Zt[3] = W), (p !== 0 || v !== 0 || u !== 0 || g !== 0) && (V = ct * ct, k = rt * ct, M = k - (k - ct), B = ct - M, U = B * B - (V - M * M - (M + M) * B), z = mt * mt, k = rt * mt, M = k - (k - mt), B = mt - M, Q = B * B - (z - M * M - (M + M) * B), b = U + Q, d = b - U, te[0] = U - (b - d) + (Q - d), P = V + b, d = P - V, F = V - (P - d) + (b - d), b = F + z, d = b - F, te[1] = F - (b - d) + (z - d), W = P + b, d = W - P, te[2] = P - (W - d) + (b - d), te[3] = W), (u !== 0 || g !== 0 || h !== 0 || _ !== 0) && (V = ut * ut, k = rt * ut, M = k - (k - ut), B = ut - M, U = B * B - (V - M * M - (M + M) * B), z = gt * gt, k = rt * gt, M = k - (k - gt), B = gt - M, Q = B * B - (z - M * M - (M + M) * B), b = U + Q, d = b - U, ee[0] = U - (b - d) + (Q - d), P = V + b, d = P - V, F = V - (P - d) + (b - d), b = F + z, d = b - F, ee[1] = F - (b - d) + (z - d), W = P + b, d = W - P, ee[2] = P - (W - d) + (b - d), ee[3] = W), u !== 0 && (R = j(4, oe, u, He), f = Nt(f, zt(
    j(R, He, 2 * ft, dt),
    dt,
    j(j(4, ee, u, ot), ot, mt, St),
    St,
    j(j(4, te, u, ot), ot, -gt, Et),
    Et,
    xt,
    Tt
  ), Tt)), g !== 0 && (C = j(4, oe, g, Ze), f = Nt(f, zt(
    j(C, Ze, 2 * pt, dt),
    dt,
    j(j(4, te, g, ot), ot, ut, St),
    St,
    j(j(4, ee, g, ot), ot, -ct, Et),
    Et,
    xt,
    Tt
  ), Tt)), h !== 0 && (m = j(4, ae, h, tn), f = Nt(f, zt(
    j(m, tn, 2 * ct, dt),
    dt,
    j(j(4, Zt, h, ot), ot, gt, St),
    St,
    j(j(4, ee, h, ot), ot, -pt, Et),
    Et,
    xt,
    Tt
  ), Tt)), _ !== 0 && (y = j(4, ae, _, en), f = Nt(f, zt(
    j(y, en, 2 * mt, dt),
    dt,
    j(j(4, ee, _, ot), ot, ft, St),
    St,
    j(j(4, Zt, _, ot), ot, -ut, Et),
    Et,
    xt,
    Tt
  ), Tt)), p !== 0 && (l = j(4, ce, p, nn), f = Nt(f, zt(
    j(l, nn, 2 * ut, dt),
    dt,
    j(j(4, te, p, ot), ot, pt, St),
    St,
    j(j(4, Zt, p, ot), ot, -mt, Et),
    Et,
    xt,
    Tt
  ), Tt)), v !== 0 && (w = j(4, ce, v, rn), f = Nt(f, zt(
    j(w, rn, 2 * gt, dt),
    dt,
    j(j(4, Zt, v, ot), ot, ct, St),
    St,
    j(j(4, te, v, ot), ot, -ft, Et),
    Et,
    xt,
    Tt
  ), Tt)), u !== 0 || g !== 0) {
    if (h !== 0 || _ !== 0 || p !== 0 || v !== 0 ? (V = h * gt, k = rt * h, M = k - (k - h), B = h - M, k = rt * gt, X = k - (k - gt), L = gt - X, U = B * L - (V - M * X - B * X - M * L), z = ct * v, k = rt * ct, M = k - (k - ct), B = ct - M, k = rt * v, X = k - (k - v), L = v - X, Q = B * L - (z - M * X - B * X - M * L), b = U + Q, d = b - U, Lt[0] = U - (b - d) + (Q - d), P = V + b, d = P - V, F = V - (P - d) + (b - d), b = F + z, d = b - F, Lt[1] = F - (b - d) + (z - d), W = P + b, d = W - P, Lt[2] = P - (W - d) + (b - d), Lt[3] = W, V = p * -mt, k = rt * p, M = k - (k - p), B = p - M, k = rt * -mt, X = k - (k - -mt), L = -mt - X, U = B * L - (V - M * X - B * X - M * L), z = ut * -_, k = rt * ut, M = k - (k - ut), B = ut - M, k = rt * -_, X = k - (k - -_), L = -_ - X, Q = B * L - (z - M * X - B * X - M * L), b = U + Q, d = b - U, $t[0] = U - (b - d) + (Q - d), P = V + b, d = P - V, F = V - (P - d) + (b - d), b = F + z, d = b - F, $t[1] = F - (b - d) + (z - d), W = P + b, d = W - P, $t[2] = P - (W - d) + (b - d), $t[3] = W, I = Ct(4, Lt, 4, $t, Te), V = h * v, k = rt * h, M = k - (k - h), B = h - M, k = rt * v, X = k - (k - v), L = v - X, U = B * L - (V - M * X - B * X - M * L), z = p * _, k = rt * p, M = k - (k - p), B = p - M, k = rt * _, X = k - (k - _), L = _ - X, Q = B * L - (z - M * X - B * X - M * L), b = U - Q, d = U - b, pe[0] = U - (b + d) + (d - Q), P = V + b, d = P - V, F = V - (P - d) + (b - d), b = F - z, d = F - b, pe[1] = F - (b + d) + (d - z), W = P + b, d = W - P, pe[2] = P - (W - d) + (b - d), pe[3] = W, A = 4) : (Te[0] = 0, I = 1, pe[0] = 0, A = 1), u !== 0) {
      const kt = j(I, Te, u, Et);
      f = Nt(f, Ct(
        j(R, He, u, dt),
        dt,
        j(kt, Et, 2 * ft, xt),
        xt,
        Tt
      ), Tt);
      const Mt = j(A, pe, u, ot);
      f = Nt(f, zt(
        j(Mt, ot, 2 * ft, dt),
        dt,
        j(Mt, ot, u, St),
        St,
        j(kt, Et, u, xt),
        xt,
        fe,
        qt
      ), qt), _ !== 0 && (f = Nt(f, j(j(4, ee, u, ot), ot, _, dt), dt)), v !== 0 && (f = Nt(f, j(j(4, te, -u, ot), ot, v, dt), dt));
    }
    if (g !== 0) {
      const kt = j(I, Te, g, Et);
      f = Nt(f, Ct(
        j(C, Ze, g, dt),
        dt,
        j(kt, Et, 2 * pt, xt),
        xt,
        Tt
      ), Tt);
      const Mt = j(A, pe, g, ot);
      f = Nt(f, zt(
        j(Mt, ot, 2 * pt, dt),
        dt,
        j(Mt, ot, g, St),
        St,
        j(kt, Et, g, xt),
        xt,
        fe,
        qt
      ), qt);
    }
  }
  if (h !== 0 || _ !== 0) {
    if (p !== 0 || v !== 0 || u !== 0 || g !== 0 ? (V = p * pt, k = rt * p, M = k - (k - p), B = p - M, k = rt * pt, X = k - (k - pt), L = pt - X, U = B * L - (V - M * X - B * X - M * L), z = ut * g, k = rt * ut, M = k - (k - ut), B = ut - M, k = rt * g, X = k - (k - g), L = g - X, Q = B * L - (z - M * X - B * X - M * L), b = U + Q, d = b - U, Lt[0] = U - (b - d) + (Q - d), P = V + b, d = P - V, F = V - (P - d) + (b - d), b = F + z, d = b - F, Lt[1] = F - (b - d) + (z - d), W = P + b, d = W - P, Lt[2] = P - (W - d) + (b - d), Lt[3] = W, Y = -gt, q = -v, V = u * Y, k = rt * u, M = k - (k - u), B = u - M, k = rt * Y, X = k - (k - Y), L = Y - X, U = B * L - (V - M * X - B * X - M * L), z = ft * q, k = rt * ft, M = k - (k - ft), B = ft - M, k = rt * q, X = k - (k - q), L = q - X, Q = B * L - (z - M * X - B * X - M * L), b = U + Q, d = b - U, $t[0] = U - (b - d) + (Q - d), P = V + b, d = P - V, F = V - (P - d) + (b - d), b = F + z, d = b - F, $t[1] = F - (b - d) + (z - d), W = P + b, d = W - P, $t[2] = P - (W - d) + (b - d), $t[3] = W, T = Ct(4, Lt, 4, $t, Ne), V = p * g, k = rt * p, M = k - (k - p), B = p - M, k = rt * g, X = k - (k - g), L = g - X, U = B * L - (V - M * X - B * X - M * L), z = u * v, k = rt * u, M = k - (k - u), B = u - M, k = rt * v, X = k - (k - v), L = v - X, Q = B * L - (z - M * X - B * X - M * L), b = U - Q, d = U - b, ge[0] = U - (b + d) + (d - Q), P = V + b, d = P - V, F = V - (P - d) + (b - d), b = F - z, d = F - b, ge[1] = F - (b + d) + (d - z), W = P + b, d = W - P, ge[2] = P - (W - d) + (b - d), ge[3] = W, N = 4) : (Ne[0] = 0, T = 1, ge[0] = 0, N = 1), h !== 0) {
      const kt = j(T, Ne, h, Et);
      f = Nt(f, Ct(
        j(m, tn, h, dt),
        dt,
        j(kt, Et, 2 * ct, xt),
        xt,
        Tt
      ), Tt);
      const Mt = j(N, ge, h, ot);
      f = Nt(f, zt(
        j(Mt, ot, 2 * ct, dt),
        dt,
        j(Mt, ot, h, St),
        St,
        j(kt, Et, h, xt),
        xt,
        fe,
        qt
      ), qt), v !== 0 && (f = Nt(f, j(j(4, Zt, h, ot), ot, v, dt), dt)), g !== 0 && (f = Nt(f, j(j(4, ee, -h, ot), ot, g, dt), dt));
    }
    if (_ !== 0) {
      const kt = j(T, Ne, _, Et);
      f = Nt(f, Ct(
        j(y, en, _, dt),
        dt,
        j(kt, Et, 2 * mt, xt),
        xt,
        Tt
      ), Tt);
      const Mt = j(N, ge, _, ot);
      f = Nt(f, zt(
        j(Mt, ot, 2 * mt, dt),
        dt,
        j(Mt, ot, _, St),
        St,
        j(kt, Et, _, xt),
        xt,
        fe,
        qt
      ), qt);
    }
  }
  if (p !== 0 || v !== 0) {
    if (u !== 0 || g !== 0 || h !== 0 || _ !== 0 ? (V = u * mt, k = rt * u, M = k - (k - u), B = u - M, k = rt * mt, X = k - (k - mt), L = mt - X, U = B * L - (V - M * X - B * X - M * L), z = ft * _, k = rt * ft, M = k - (k - ft), B = ft - M, k = rt * _, X = k - (k - _), L = _ - X, Q = B * L - (z - M * X - B * X - M * L), b = U + Q, d = b - U, Lt[0] = U - (b - d) + (Q - d), P = V + b, d = P - V, F = V - (P - d) + (b - d), b = F + z, d = b - F, Lt[1] = F - (b - d) + (z - d), W = P + b, d = W - P, Lt[2] = P - (W - d) + (b - d), Lt[3] = W, Y = -pt, q = -g, V = h * Y, k = rt * h, M = k - (k - h), B = h - M, k = rt * Y, X = k - (k - Y), L = Y - X, U = B * L - (V - M * X - B * X - M * L), z = ct * q, k = rt * ct, M = k - (k - ct), B = ct - M, k = rt * q, X = k - (k - q), L = q - X, Q = B * L - (z - M * X - B * X - M * L), b = U + Q, d = b - U, $t[0] = U - (b - d) + (Q - d), P = V + b, d = P - V, F = V - (P - d) + (b - d), b = F + z, d = b - F, $t[1] = F - (b - d) + (z - d), W = P + b, d = W - P, $t[2] = P - (W - d) + (b - d), $t[3] = W, x = Ct(4, Lt, 4, $t, Oe), V = u * _, k = rt * u, M = k - (k - u), B = u - M, k = rt * _, X = k - (k - _), L = _ - X, U = B * L - (V - M * X - B * X - M * L), z = h * g, k = rt * h, M = k - (k - h), B = h - M, k = rt * g, X = k - (k - g), L = g - X, Q = B * L - (z - M * X - B * X - M * L), b = U - Q, d = U - b, de[0] = U - (b + d) + (d - Q), P = V + b, d = P - V, F = V - (P - d) + (b - d), b = F - z, d = F - b, de[1] = F - (b + d) + (d - z), W = P + b, d = W - P, de[2] = P - (W - d) + (b - d), de[3] = W, S = 4) : (Oe[0] = 0, x = 1, de[0] = 0, S = 1), p !== 0) {
      const kt = j(x, Oe, p, Et);
      f = Nt(f, Ct(
        j(l, nn, p, dt),
        dt,
        j(kt, Et, 2 * ut, xt),
        xt,
        Tt
      ), Tt);
      const Mt = j(S, de, p, ot);
      f = Nt(f, zt(
        j(Mt, ot, 2 * ut, dt),
        dt,
        j(Mt, ot, p, St),
        St,
        j(kt, Et, p, xt),
        xt,
        fe,
        qt
      ), qt), g !== 0 && (f = Nt(f, j(j(4, te, p, ot), ot, g, dt), dt)), _ !== 0 && (f = Nt(f, j(j(4, Zt, -p, ot), ot, _, dt), dt));
    }
    if (v !== 0) {
      const kt = j(x, Oe, v, Et);
      f = Nt(f, Ct(
        j(w, rn, v, dt),
        dt,
        j(kt, Et, 2 * gt, xt),
        xt,
        Tt
      ), Tt);
      const Mt = j(S, de, v, ot);
      f = Nt(f, zt(
        j(Mt, ot, 2 * gt, dt),
        dt,
        j(Mt, ot, v, St),
        St,
        j(kt, Et, v, xt),
        xt,
        fe,
        qt
      ), qt);
    }
  }
  return ve[f - 1];
}
function _r(n, e, t, i, s, r, o, a) {
  const c = n - o, f = t - o, u = s - o, h = e - a, p = i - a, g = r - a, _ = f * g, v = u * p, R = c * c + h * h, C = u * h, m = c * g, y = f * f + p * p, l = c * p, w = f * h, x = u * u + g * g, I = R * (_ - v) + y * (C - m) + x * (l - w), T = (Math.abs(_) + Math.abs(v)) * R + (Math.abs(C) + Math.abs(m)) * y + (Math.abs(l) + Math.abs(w)) * x, S = yr * T;
  return I > S || -I > S ? I : xr(n, e, t, i, s, r, o, a, T);
}
function Mr(n, e) {
  var t, i, s = 0, r, o, a, c, f, u, h, p = n[0], g = n[1], _ = e.length;
  for (t = 0; t < _; t++) {
    i = 0;
    var v = e[t], R = v.length - 1;
    if (u = v[0], u[0] !== v[R][0] && u[1] !== v[R][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (o = u[0] - p, a = u[1] - g, i; i < R; i++) {
      if (h = v[i + 1], c = h[0] - p, f = h[1] - g, a === 0 && f === 0) {
        if (c <= 0 && o >= 0 || o <= 0 && c >= 0)
          return 0;
      } else if (f >= 0 && a <= 0 || f <= 0 && a >= 0) {
        if (r = re(o, c, a, f, 0, 0), r === 0)
          return 0;
        (r > 0 && f > 0 && a <= 0 || r < 0 && f <= 0 && a > 0) && s++;
      }
      u = h, a = f, o = c;
    }
  }
  return s % 2 !== 0;
}
function bn(n, e, t = {}) {
  if (!n)
    throw new Error("point is required");
  if (!e)
    throw new Error("polygon is required");
  const i = lr(n), s = dr(e), r = s.type, o = e.bbox;
  let a = s.coordinates;
  if (o && kr(i, o) === !1)
    return !1;
  r === "Polygon" && (a = [a]);
  let c = !1;
  for (var f = 0; f < a.length; ++f) {
    const u = Mr(i, a[f]);
    if (u === 0) return !t.ignoreBoundary;
    u && (c = !0);
  }
  return c;
}
function kr(n, e) {
  return e[0] <= n[0] && e[1] <= n[1] && e[2] >= n[0] && e[3] >= n[1];
}
let Jn = class {
  constructor(e = [], t = Sr) {
    if (this.data = e, this.length = this.data.length, this.compare = t, this.length > 0)
      for (let i = (this.length >> 1) - 1; i >= 0; i--) this._down(i);
  }
  push(e) {
    this.data.push(e), this.length++, this._up(this.length - 1);
  }
  pop() {
    if (this.length === 0) return;
    const e = this.data[0], t = this.data.pop();
    return this.length--, this.length > 0 && (this.data[0] = t, this._down(0)), e;
  }
  peek() {
    return this.data[0];
  }
  _up(e) {
    const { data: t, compare: i } = this, s = t[e];
    for (; e > 0; ) {
      const r = e - 1 >> 1, o = t[r];
      if (i(s, o) >= 0) break;
      t[e] = o, e = r;
    }
    t[e] = s;
  }
  _down(e) {
    const { data: t, compare: i } = this, s = this.length >> 1, r = t[e];
    for (; e < s; ) {
      let o = (e << 1) + 1, a = t[o];
      const c = o + 1;
      if (c < this.length && i(t[c], a) < 0 && (o = c, a = t[c]), i(a, r) >= 0) break;
      t[e] = a, e = o;
    }
    t[e] = r;
  }
};
function Sr(n, e) {
  return n < e ? -1 : n > e ? 1 : 0;
}
function Gn(n, e) {
  return n.p.x > e.p.x ? 1 : n.p.x < e.p.x ? -1 : n.p.y !== e.p.y ? n.p.y > e.p.y ? 1 : -1 : 1;
}
function Er(n, e) {
  return n.rightSweepEvent.p.x > e.rightSweepEvent.p.x ? 1 : n.rightSweepEvent.p.x < e.rightSweepEvent.p.x ? -1 : n.rightSweepEvent.p.y !== e.rightSweepEvent.p.y ? n.rightSweepEvent.p.y < e.rightSweepEvent.p.y ? 1 : -1 : 1;
}
class vn {
  constructor(e, t, i, s) {
    this.p = {
      x: e[0],
      y: e[1]
    }, this.featureId = t, this.ringId = i, this.eventId = s, this.otherEvent = null, this.isLeftEndpoint = null;
  }
  isSamePoint(e) {
    return this.p.x === e.p.x && this.p.y === e.p.y;
  }
}
function Ar(n, e) {
  if (n.type === "FeatureCollection") {
    const t = n.features;
    for (let i = 0; i < t.length; i++)
      xn(t[i], e);
  } else
    xn(n, e);
}
let Re = 0, Xe = 0, Ce = 0;
function xn(n, e) {
  const t = n.type === "Feature" ? n.geometry : n;
  let i = t.coordinates;
  (t.type === "Polygon" || t.type === "MultiLineString") && (i = [i]), t.type === "LineString" && (i = [[i]]);
  for (let s = 0; s < i.length; s++)
    for (let r = 0; r < i[s].length; r++) {
      let o = i[s][r][0], a = null;
      Xe = Xe + 1;
      for (let c = 0; c < i[s][r].length - 1; c++) {
        a = i[s][r][c + 1];
        const f = new vn(o, Re, Xe, Ce), u = new vn(a, Re, Xe, Ce + 1);
        f.otherEvent = u, u.otherEvent = f, Gn(f, u) > 0 ? (u.isLeftEndpoint = !0, f.isLeftEndpoint = !1) : (f.isLeftEndpoint = !0, u.isLeftEndpoint = !1), e.push(f), e.push(u), o = a, Ce = Ce + 1;
      }
    }
  Re = Re + 1;
}
class Ir {
  constructor(e) {
    this.leftSweepEvent = e, this.rightSweepEvent = e.otherEvent;
  }
}
function Br(n, e) {
  if (n === null || e === null || n.leftSweepEvent.ringId === e.leftSweepEvent.ringId && (n.rightSweepEvent.isSamePoint(e.leftSweepEvent) || n.rightSweepEvent.isSamePoint(e.leftSweepEvent) || n.rightSweepEvent.isSamePoint(e.rightSweepEvent) || n.leftSweepEvent.isSamePoint(e.leftSweepEvent) || n.leftSweepEvent.isSamePoint(e.rightSweepEvent))) return !1;
  const t = n.leftSweepEvent.p.x, i = n.leftSweepEvent.p.y, s = n.rightSweepEvent.p.x, r = n.rightSweepEvent.p.y, o = e.leftSweepEvent.p.x, a = e.leftSweepEvent.p.y, c = e.rightSweepEvent.p.x, f = e.rightSweepEvent.p.y, u = (f - a) * (s - t) - (c - o) * (r - i), h = (c - o) * (i - a) - (f - a) * (t - o), p = (s - t) * (i - a) - (r - i) * (t - o);
  if (u === 0)
    return !1;
  const g = h / u, _ = p / u;
  if (g >= 0 && g <= 1 && _ >= 0 && _ <= 1) {
    const v = t + g * (s - t), R = i + g * (r - i);
    return [v, R];
  }
  return !1;
}
function Pr(n, e) {
  e = e || !1;
  const t = [], i = new Jn([], Er);
  for (; n.length; ) {
    const s = n.pop();
    if (s.isLeftEndpoint) {
      const r = new Ir(s);
      for (let o = 0; o < i.data.length; o++) {
        const a = i.data[o];
        if (e && a.leftSweepEvent.featureId === s.featureId)
          continue;
        const c = Br(r, a);
        c !== !1 && t.push(c);
      }
      i.push(r);
    } else s.isLeftEndpoint === !1 && i.pop();
  }
  return t;
}
function Or(n, e) {
  const t = new Jn([], Gn);
  return Ar(n, t), Pr(t, e);
}
var Tr = Or;
function Kn(n, e, t = {}) {
  const { removeDuplicates: i = !0, ignoreSelfIntersections: s = !0 } = t;
  let r = [];
  n.type === "FeatureCollection" ? r = r.concat(n.features) : n.type === "Feature" ? r.push(n) : (n.type === "LineString" || n.type === "Polygon" || n.type === "MultiLineString" || n.type === "MultiPolygon") && r.push(Ie(n)), e.type === "FeatureCollection" ? r = r.concat(e.features) : e.type === "Feature" ? r.push(e) : (e.type === "LineString" || e.type === "Polygon" || e.type === "MultiLineString" || e.type === "MultiPolygon") && r.push(Ie(e));
  const o = Tr(
    Vt(r),
    s
  );
  let a = [];
  if (i) {
    const c = {};
    o.forEach((f) => {
      const u = f.join(",");
      c[u] || (c[u] = !0, a.push(f));
    });
  } else
    a = o;
  return Vt(a.map((c) => Qt(c)));
}
function Nr(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
function Rr(n) {
  if (Object.prototype.hasOwnProperty.call(n, "__esModule")) return n;
  var e = n.default;
  if (typeof e == "function") {
    var t = function i() {
      return this instanceof i ? Reflect.construct(e, arguments, this.constructor) : e.apply(this, arguments);
    };
    t.prototype = e.prototype;
  } else t = {};
  return Object.defineProperty(t, "__esModule", { value: !0 }), Object.keys(n).forEach(function(i) {
    var s = Object.getOwnPropertyDescriptor(n, i);
    Object.defineProperty(t, i, s.get ? s : {
      enumerable: !0,
      get: function() {
        return n[i];
      }
    });
  }), t;
}
function Xr(n, e = {}) {
  let t = 0, i = 0, s = 0;
  return un(
    n,
    function(r) {
      t += r[0], i += r[1], s++;
    },
    !0
  ), Qt([t / s, i / s], e.properties);
}
var Ye = { exports: {} }, Ue = { exports: {} }, Cr = Ue.exports, _n;
function Yr() {
  return _n || (_n = 1, (function(n, e) {
    (function(t, i) {
      n.exports = i();
    })(Cr, function() {
      function t(m, y, l, w, x) {
        (function I(T, S, A, N, Y) {
          for (; N > A; ) {
            if (N - A > 600) {
              var q = N - A + 1, d = S - A + 1, k = Math.log(q), M = 0.5 * Math.exp(2 * k / 3), B = 0.5 * Math.sqrt(k * M * (q - M) / q) * (d - q / 2 < 0 ? -1 : 1), X = Math.max(A, Math.floor(S - d * M / q + B)), L = Math.min(N, Math.floor(S + (q - d) * M / q + B));
              I(T, S, X, L, Y);
            }
            var b = T[S], P = A, F = N;
            for (i(T, A, S), Y(T[N], b) > 0 && i(T, A, N); P < F; ) {
              for (i(T, P, F), P++, F--; Y(T[P], b) < 0; ) P++;
              for (; Y(T[F], b) > 0; ) F--;
            }
            Y(T[A], b) === 0 ? i(T, A, F) : i(T, ++F, N), F <= S && (A = F + 1), S <= F && (N = F - 1);
          }
        })(m, y, l || 0, w || m.length - 1, x || s);
      }
      function i(m, y, l) {
        var w = m[y];
        m[y] = m[l], m[l] = w;
      }
      function s(m, y) {
        return m < y ? -1 : m > y ? 1 : 0;
      }
      var r = function(m) {
        m === void 0 && (m = 9), this._maxEntries = Math.max(4, m), this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries)), this.clear();
      };
      function o(m, y, l) {
        if (!l) return y.indexOf(m);
        for (var w = 0; w < y.length; w++) if (l(m, y[w])) return w;
        return -1;
      }
      function a(m, y) {
        c(m, 0, m.children.length, y, m);
      }
      function c(m, y, l, w, x) {
        x || (x = R(null)), x.minX = 1 / 0, x.minY = 1 / 0, x.maxX = -1 / 0, x.maxY = -1 / 0;
        for (var I = y; I < l; I++) {
          var T = m.children[I];
          f(x, m.leaf ? w(T) : T);
        }
        return x;
      }
      function f(m, y) {
        return m.minX = Math.min(m.minX, y.minX), m.minY = Math.min(m.minY, y.minY), m.maxX = Math.max(m.maxX, y.maxX), m.maxY = Math.max(m.maxY, y.maxY), m;
      }
      function u(m, y) {
        return m.minX - y.minX;
      }
      function h(m, y) {
        return m.minY - y.minY;
      }
      function p(m) {
        return (m.maxX - m.minX) * (m.maxY - m.minY);
      }
      function g(m) {
        return m.maxX - m.minX + (m.maxY - m.minY);
      }
      function _(m, y) {
        return m.minX <= y.minX && m.minY <= y.minY && y.maxX <= m.maxX && y.maxY <= m.maxY;
      }
      function v(m, y) {
        return y.minX <= m.maxX && y.minY <= m.maxY && y.maxX >= m.minX && y.maxY >= m.minY;
      }
      function R(m) {
        return { children: m, height: 1, leaf: !0, minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
      }
      function C(m, y, l, w, x) {
        for (var I = [y, l]; I.length; ) if (!((l = I.pop()) - (y = I.pop()) <= w)) {
          var T = y + Math.ceil((l - y) / w / 2) * w;
          t(m, T, y, l, x), I.push(y, T, T, l);
        }
      }
      return r.prototype.all = function() {
        return this._all(this.data, []);
      }, r.prototype.search = function(m) {
        var y = this.data, l = [];
        if (!v(m, y)) return l;
        for (var w = this.toBBox, x = []; y; ) {
          for (var I = 0; I < y.children.length; I++) {
            var T = y.children[I], S = y.leaf ? w(T) : T;
            v(m, S) && (y.leaf ? l.push(T) : _(m, S) ? this._all(T, l) : x.push(T));
          }
          y = x.pop();
        }
        return l;
      }, r.prototype.collides = function(m) {
        var y = this.data;
        if (!v(m, y)) return !1;
        for (var l = []; y; ) {
          for (var w = 0; w < y.children.length; w++) {
            var x = y.children[w], I = y.leaf ? this.toBBox(x) : x;
            if (v(m, I)) {
              if (y.leaf || _(m, I)) return !0;
              l.push(x);
            }
          }
          y = l.pop();
        }
        return !1;
      }, r.prototype.load = function(m) {
        if (!m || !m.length) return this;
        if (m.length < this._minEntries) {
          for (var y = 0; y < m.length; y++) this.insert(m[y]);
          return this;
        }
        var l = this._build(m.slice(), 0, m.length - 1, 0);
        if (this.data.children.length) if (this.data.height === l.height) this._splitRoot(this.data, l);
        else {
          if (this.data.height < l.height) {
            var w = this.data;
            this.data = l, l = w;
          }
          this._insert(l, this.data.height - l.height - 1, !0);
        }
        else this.data = l;
        return this;
      }, r.prototype.insert = function(m) {
        return m && this._insert(m, this.data.height - 1), this;
      }, r.prototype.clear = function() {
        return this.data = R([]), this;
      }, r.prototype.remove = function(m, y) {
        if (!m) return this;
        for (var l, w, x, I = this.data, T = this.toBBox(m), S = [], A = []; I || S.length; ) {
          if (I || (I = S.pop(), w = S[S.length - 1], l = A.pop(), x = !0), I.leaf) {
            var N = o(m, I.children, y);
            if (N !== -1) return I.children.splice(N, 1), S.push(I), this._condense(S), this;
          }
          x || I.leaf || !_(I, T) ? w ? (l++, I = w.children[l], x = !1) : I = null : (S.push(I), A.push(l), l = 0, w = I, I = I.children[0]);
        }
        return this;
      }, r.prototype.toBBox = function(m) {
        return m;
      }, r.prototype.compareMinX = function(m, y) {
        return m.minX - y.minX;
      }, r.prototype.compareMinY = function(m, y) {
        return m.minY - y.minY;
      }, r.prototype.toJSON = function() {
        return this.data;
      }, r.prototype.fromJSON = function(m) {
        return this.data = m, this;
      }, r.prototype._all = function(m, y) {
        for (var l = []; m; ) m.leaf ? y.push.apply(y, m.children) : l.push.apply(l, m.children), m = l.pop();
        return y;
      }, r.prototype._build = function(m, y, l, w) {
        var x, I = l - y + 1, T = this._maxEntries;
        if (I <= T) return a(x = R(m.slice(y, l + 1)), this.toBBox), x;
        w || (w = Math.ceil(Math.log(I) / Math.log(T)), T = Math.ceil(I / Math.pow(T, w - 1))), (x = R([])).leaf = !1, x.height = w;
        var S = Math.ceil(I / T), A = S * Math.ceil(Math.sqrt(T));
        C(m, y, l, A, this.compareMinX);
        for (var N = y; N <= l; N += A) {
          var Y = Math.min(N + A - 1, l);
          C(m, N, Y, S, this.compareMinY);
          for (var q = N; q <= Y; q += S) {
            var d = Math.min(q + S - 1, Y);
            x.children.push(this._build(m, q, d, w - 1));
          }
        }
        return a(x, this.toBBox), x;
      }, r.prototype._chooseSubtree = function(m, y, l, w) {
        for (; w.push(y), !y.leaf && w.length - 1 !== l; ) {
          for (var x = 1 / 0, I = 1 / 0, T = void 0, S = 0; S < y.children.length; S++) {
            var A = y.children[S], N = p(A), Y = (q = m, d = A, (Math.max(d.maxX, q.maxX) - Math.min(d.minX, q.minX)) * (Math.max(d.maxY, q.maxY) - Math.min(d.minY, q.minY)) - N);
            Y < I ? (I = Y, x = N < x ? N : x, T = A) : Y === I && N < x && (x = N, T = A);
          }
          y = T || y.children[0];
        }
        var q, d;
        return y;
      }, r.prototype._insert = function(m, y, l) {
        var w = l ? m : this.toBBox(m), x = [], I = this._chooseSubtree(w, this.data, y, x);
        for (I.children.push(m), f(I, w); y >= 0 && x[y].children.length > this._maxEntries; ) this._split(x, y), y--;
        this._adjustParentBBoxes(w, x, y);
      }, r.prototype._split = function(m, y) {
        var l = m[y], w = l.children.length, x = this._minEntries;
        this._chooseSplitAxis(l, x, w);
        var I = this._chooseSplitIndex(l, x, w), T = R(l.children.splice(I, l.children.length - I));
        T.height = l.height, T.leaf = l.leaf, a(l, this.toBBox), a(T, this.toBBox), y ? m[y - 1].children.push(T) : this._splitRoot(l, T);
      }, r.prototype._splitRoot = function(m, y) {
        this.data = R([m, y]), this.data.height = m.height + 1, this.data.leaf = !1, a(this.data, this.toBBox);
      }, r.prototype._chooseSplitIndex = function(m, y, l) {
        for (var w, x, I, T, S, A, N, Y = 1 / 0, q = 1 / 0, d = y; d <= l - y; d++) {
          var k = c(m, 0, d, this.toBBox), M = c(m, d, l, this.toBBox), B = (x = k, I = M, T = void 0, S = void 0, A = void 0, N = void 0, T = Math.max(x.minX, I.minX), S = Math.max(x.minY, I.minY), A = Math.min(x.maxX, I.maxX), N = Math.min(x.maxY, I.maxY), Math.max(0, A - T) * Math.max(0, N - S)), X = p(k) + p(M);
          B < Y ? (Y = B, w = d, q = X < q ? X : q) : B === Y && X < q && (q = X, w = d);
        }
        return w || l - y;
      }, r.prototype._chooseSplitAxis = function(m, y, l) {
        var w = m.leaf ? this.compareMinX : u, x = m.leaf ? this.compareMinY : h;
        this._allDistMargin(m, y, l, w) < this._allDistMargin(m, y, l, x) && m.children.sort(w);
      }, r.prototype._allDistMargin = function(m, y, l, w) {
        m.children.sort(w);
        for (var x = this.toBBox, I = c(m, 0, y, x), T = c(m, l - y, l, x), S = g(I) + g(T), A = y; A < l - y; A++) {
          var N = m.children[A];
          f(I, m.leaf ? x(N) : N), S += g(I);
        }
        for (var Y = l - y - 1; Y >= y; Y--) {
          var q = m.children[Y];
          f(T, m.leaf ? x(q) : q), S += g(T);
        }
        return S;
      }, r.prototype._adjustParentBBoxes = function(m, y, l) {
        for (var w = l; w >= 0; w--) f(y[w], m);
      }, r.prototype._condense = function(m) {
        for (var y = m.length - 1, l = void 0; y >= 0; y--) m[y].children.length === 0 ? y > 0 ? (l = m[y - 1].children).splice(l.indexOf(m[y]), 1) : this.clear() : a(m[y], this.toBBox);
      }, r;
    });
  })(Ue)), Ue.exports;
}
class Dr {
  constructor(e = [], t = Fr) {
    if (this.data = e, this.length = this.data.length, this.compare = t, this.length > 0)
      for (let i = (this.length >> 1) - 1; i >= 0; i--) this._down(i);
  }
  push(e) {
    this.data.push(e), this.length++, this._up(this.length - 1);
  }
  pop() {
    if (this.length === 0) return;
    const e = this.data[0], t = this.data.pop();
    return this.length--, this.length > 0 && (this.data[0] = t, this._down(0)), e;
  }
  peek() {
    return this.data[0];
  }
  _up(e) {
    const { data: t, compare: i } = this, s = t[e];
    for (; e > 0; ) {
      const r = e - 1 >> 1, o = t[r];
      if (i(s, o) >= 0) break;
      t[e] = o, e = r;
    }
    t[e] = s;
  }
  _down(e) {
    const { data: t, compare: i } = this, s = this.length >> 1, r = t[e];
    for (; e < s; ) {
      let o = (e << 1) + 1, a = t[o];
      const c = o + 1;
      if (c < this.length && i(t[c], a) < 0 && (o = c, a = t[c]), i(a, r) >= 0) break;
      t[e] = a, e = o;
    }
    t[e] = r;
  }
}
function Fr(n, e) {
  return n < e ? -1 : n > e ? 1 : 0;
}
const Lr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Dr
}, Symbol.toStringTag, { value: "Module" })), $r = /* @__PURE__ */ Rr(Lr);
var Me = { exports: {} }, on, Mn;
function Vr() {
  return Mn || (Mn = 1, on = function(e, t, i, s) {
    var r = e[0], o = e[1], a = !1;
    i === void 0 && (i = 0), s === void 0 && (s = t.length);
    for (var c = (s - i) / 2, f = 0, u = c - 1; f < c; u = f++) {
      var h = t[i + f * 2 + 0], p = t[i + f * 2 + 1], g = t[i + u * 2 + 0], _ = t[i + u * 2 + 1], v = p > o != _ > o && r < (g - h) * (o - p) / (_ - p) + h;
      v && (a = !a);
    }
    return a;
  }), on;
}
var an, kn;
function jr() {
  return kn || (kn = 1, an = function(e, t, i, s) {
    var r = e[0], o = e[1], a = !1;
    i === void 0 && (i = 0), s === void 0 && (s = t.length);
    for (var c = s - i, f = 0, u = c - 1; f < c; u = f++) {
      var h = t[f + i][0], p = t[f + i][1], g = t[u + i][0], _ = t[u + i][1], v = p > o != _ > o && r < (g - h) * (o - p) / (_ - p) + h;
      v && (a = !a);
    }
    return a;
  }), an;
}
var Sn;
function qr() {
  if (Sn) return Me.exports;
  Sn = 1;
  var n = Vr(), e = jr();
  return Me.exports = function(i, s, r, o) {
    return s.length > 0 && Array.isArray(s[0]) ? e(i, s, r, o) : n(i, s, r, o);
  }, Me.exports.nested = e, Me.exports.flat = n, Me.exports;
}
var Se = { exports: {} }, Ur = Se.exports, En;
function zr() {
  return En || (En = 1, (function(n, e) {
    (function(t, i) {
      i(e);
    })(Ur, function(t) {
      const s = 33306690738754706e-32;
      function r(v, R, C, m, y) {
        let l, w, x, I, T = R[0], S = m[0], A = 0, N = 0;
        S > T == S > -T ? (l = T, T = R[++A]) : (l = S, S = m[++N]);
        let Y = 0;
        if (A < v && N < C) for (S > T == S > -T ? (x = l - ((w = T + l) - T), T = R[++A]) : (x = l - ((w = S + l) - S), S = m[++N]), l = w, x !== 0 && (y[Y++] = x); A < v && N < C; ) S > T == S > -T ? (x = l - ((w = l + T) - (I = w - l)) + (T - I), T = R[++A]) : (x = l - ((w = l + S) - (I = w - l)) + (S - I), S = m[++N]), l = w, x !== 0 && (y[Y++] = x);
        for (; A < v; ) x = l - ((w = l + T) - (I = w - l)) + (T - I), T = R[++A], l = w, x !== 0 && (y[Y++] = x);
        for (; N < C; ) x = l - ((w = l + S) - (I = w - l)) + (S - I), S = m[++N], l = w, x !== 0 && (y[Y++] = x);
        return l === 0 && Y !== 0 || (y[Y++] = l), Y;
      }
      function o(v) {
        return new Float64Array(v);
      }
      const a = 33306690738754716e-32, c = 22204460492503146e-32, f = 11093356479670487e-47, u = o(4), h = o(8), p = o(12), g = o(16), _ = o(4);
      t.orient2d = function(v, R, C, m, y, l) {
        const w = (R - l) * (C - y), x = (v - y) * (m - l), I = w - x;
        if (w === 0 || x === 0 || w > 0 != x > 0) return I;
        const T = Math.abs(w + x);
        return Math.abs(I) >= a * T ? I : -(function(S, A, N, Y, q, d, k) {
          let M, B, X, L, b, P, F, V, U, z, Q, W, ft, ct, ut, pt, mt, gt;
          const Bt = S - q, Xt = N - q, kt = A - d, Mt = Y - d;
          b = (ut = (V = Bt - (F = (P = 134217729 * Bt) - (P - Bt))) * (z = Mt - (U = (P = 134217729 * Mt) - (P - Mt))) - ((ct = Bt * Mt) - F * U - V * U - F * z)) - (Q = ut - (mt = (V = kt - (F = (P = 134217729 * kt) - (P - kt))) * (z = Xt - (U = (P = 134217729 * Xt) - (P - Xt))) - ((pt = kt * Xt) - F * U - V * U - F * z))), u[0] = ut - (Q + b) + (b - mt), b = (ft = ct - ((W = ct + Q) - (b = W - ct)) + (Q - b)) - (Q = ft - pt), u[1] = ft - (Q + b) + (b - pt), b = (gt = W + Q) - W, u[2] = W - (gt - b) + (Q - b), u[3] = gt;
          let Ht = (function(Qe, jt) {
            let Pe = jt[0];
            for (let E = 1; E < Qe; E++) Pe += jt[E];
            return Pe;
          })(4, u), ue = c * k;
          if (Ht >= ue || -Ht >= ue || (M = S - (Bt + (b = S - Bt)) + (b - q), X = N - (Xt + (b = N - Xt)) + (b - q), B = A - (kt + (b = A - kt)) + (b - d), L = Y - (Mt + (b = Y - Mt)) + (b - d), M === 0 && B === 0 && X === 0 && L === 0) || (ue = f * k + s * Math.abs(Ht), (Ht += Bt * L + Mt * M - (kt * X + Xt * B)) >= ue || -Ht >= ue)) return Ht;
          b = (ut = (V = M - (F = (P = 134217729 * M) - (P - M))) * (z = Mt - (U = (P = 134217729 * Mt) - (P - Mt))) - ((ct = M * Mt) - F * U - V * U - F * z)) - (Q = ut - (mt = (V = B - (F = (P = 134217729 * B) - (P - B))) * (z = Xt - (U = (P = 134217729 * Xt) - (P - Xt))) - ((pt = B * Xt) - F * U - V * U - F * z))), _[0] = ut - (Q + b) + (b - mt), b = (ft = ct - ((W = ct + Q) - (b = W - ct)) + (Q - b)) - (Q = ft - pt), _[1] = ft - (Q + b) + (b - pt), b = (gt = W + Q) - W, _[2] = W - (gt - b) + (Q - b), _[3] = gt;
          const Je = r(4, u, 4, _, h);
          b = (ut = (V = Bt - (F = (P = 134217729 * Bt) - (P - Bt))) * (z = L - (U = (P = 134217729 * L) - (P - L))) - ((ct = Bt * L) - F * U - V * U - F * z)) - (Q = ut - (mt = (V = kt - (F = (P = 134217729 * kt) - (P - kt))) * (z = X - (U = (P = 134217729 * X) - (P - X))) - ((pt = kt * X) - F * U - V * U - F * z))), _[0] = ut - (Q + b) + (b - mt), b = (ft = ct - ((W = ct + Q) - (b = W - ct)) + (Q - b)) - (Q = ft - pt), _[1] = ft - (Q + b) + (b - pt), b = (gt = W + Q) - W, _[2] = W - (gt - b) + (Q - b), _[3] = gt;
          const Ge = r(Je, h, 4, _, p);
          b = (ut = (V = M - (F = (P = 134217729 * M) - (P - M))) * (z = L - (U = (P = 134217729 * L) - (P - L))) - ((ct = M * L) - F * U - V * U - F * z)) - (Q = ut - (mt = (V = B - (F = (P = 134217729 * B) - (P - B))) * (z = X - (U = (P = 134217729 * X) - (P - X))) - ((pt = B * X) - F * U - V * U - F * z))), _[0] = ut - (Q + b) + (b - mt), b = (ft = ct - ((W = ct + Q) - (b = W - ct)) + (Q - b)) - (Q = ft - pt), _[1] = ft - (Q + b) + (b - pt), b = (gt = W + Q) - W, _[2] = W - (gt - b) + (Q - b), _[3] = gt;
          const Ke = r(Ge, p, 4, _, g);
          return g[Ke - 1];
        })(v, R, C, m, y, l, T);
      }, t.orient2dfast = function(v, R, C, m, y, l) {
        return (R - l) * (C - y) - (v - y) * (m - l);
      }, Object.defineProperty(t, "__esModule", { value: !0 });
    });
  })(Se, Se.exports)), Se.exports;
}
var An;
function Wr() {
  if (An) return Ye.exports;
  An = 1;
  var n = Yr(), e = $r, t = qr(), i = zr().orient2d;
  e.default && (e = e.default), Ye.exports = s, Ye.exports.default = s;
  function s(l, w, x) {
    w = Math.max(0, w === void 0 ? 2 : w), x = x || 0;
    var I = g(l), T = new n(16);
    T.toBBox = function(F) {
      return {
        minX: F[0],
        minY: F[1],
        maxX: F[0],
        maxY: F[1]
      };
    }, T.compareMinX = function(F, V) {
      return F[0] - V[0];
    }, T.compareMinY = function(F, V) {
      return F[1] - V[1];
    }, T.load(l);
    for (var S = [], A = 0, N; A < I.length; A++) {
      var Y = I[A];
      T.remove(Y), N = _(Y, N), S.push(N);
    }
    var q = new n(16);
    for (A = 0; A < S.length; A++) q.insert(p(S[A]));
    for (var d = w * w, k = x * x; S.length; ) {
      var M = S.shift(), B = M.p, X = M.next.p, L = v(B, X);
      if (!(L < k)) {
        var b = L / d;
        Y = r(T, M.prev.p, B, X, M.next.next.p, b, q), Y && Math.min(v(Y, B), v(Y, X)) <= b && (S.push(M), S.push(_(Y, M)), T.remove(Y), q.remove(M), q.insert(p(M)), q.insert(p(M.next)));
      }
    }
    M = N;
    var P = [];
    do
      P.push(M.p), M = M.next;
    while (M !== N);
    return P.push(M.p), P;
  }
  function r(l, w, x, I, T, S, A) {
    for (var N = new e([], o), Y = l.data; Y; ) {
      for (var q = 0; q < Y.children.length; q++) {
        var d = Y.children[q], k = Y.leaf ? R(d, x, I) : a(x, I, d);
        k > S || N.push({
          node: d,
          dist: k
        });
      }
      for (; N.length && !N.peek().node.children; ) {
        var M = N.pop(), B = M.node, X = R(B, w, x), L = R(B, I, T);
        if (M.dist < X && M.dist < L && f(x, B, A) && f(I, B, A)) return B;
      }
      Y = N.pop(), Y && (Y = Y.node);
    }
    return null;
  }
  function o(l, w) {
    return l.dist - w.dist;
  }
  function a(l, w, x) {
    if (c(l, x) || c(w, x)) return 0;
    var I = C(l[0], l[1], w[0], w[1], x.minX, x.minY, x.maxX, x.minY);
    if (I === 0) return 0;
    var T = C(l[0], l[1], w[0], w[1], x.minX, x.minY, x.minX, x.maxY);
    if (T === 0) return 0;
    var S = C(l[0], l[1], w[0], w[1], x.maxX, x.minY, x.maxX, x.maxY);
    if (S === 0) return 0;
    var A = C(l[0], l[1], w[0], w[1], x.minX, x.maxY, x.maxX, x.maxY);
    return A === 0 ? 0 : Math.min(I, T, S, A);
  }
  function c(l, w) {
    return l[0] >= w.minX && l[0] <= w.maxX && l[1] >= w.minY && l[1] <= w.maxY;
  }
  function f(l, w, x) {
    for (var I = Math.min(l[0], w[0]), T = Math.min(l[1], w[1]), S = Math.max(l[0], w[0]), A = Math.max(l[1], w[1]), N = x.search({ minX: I, minY: T, maxX: S, maxY: A }), Y = 0; Y < N.length; Y++)
      if (h(N[Y].p, N[Y].next.p, l, w)) return !1;
    return !0;
  }
  function u(l, w, x) {
    return i(l[0], l[1], w[0], w[1], x[0], x[1]);
  }
  function h(l, w, x, I) {
    return l !== I && w !== x && u(l, w, x) > 0 != u(l, w, I) > 0 && u(x, I, l) > 0 != u(x, I, w) > 0;
  }
  function p(l) {
    var w = l.p, x = l.next.p;
    return l.minX = Math.min(w[0], x[0]), l.minY = Math.min(w[1], x[1]), l.maxX = Math.max(w[0], x[0]), l.maxY = Math.max(w[1], x[1]), l;
  }
  function g(l) {
    for (var w = l[0], x = l[0], I = l[0], T = l[0], S = 0; S < l.length; S++) {
      var A = l[S];
      A[0] < w[0] && (w = A), A[0] > I[0] && (I = A), A[1] < x[1] && (x = A), A[1] > T[1] && (T = A);
    }
    var N = [w, x, I, T], Y = N.slice();
    for (S = 0; S < l.length; S++)
      t(l[S], N) || Y.push(l[S]);
    return y(Y);
  }
  function _(l, w) {
    var x = {
      p: l,
      prev: null,
      next: null,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };
    return w ? (x.next = w.next, x.prev = w, w.next.prev = x, w.next = x) : (x.prev = x, x.next = x), x;
  }
  function v(l, w) {
    var x = l[0] - w[0], I = l[1] - w[1];
    return x * x + I * I;
  }
  function R(l, w, x) {
    var I = w[0], T = w[1], S = x[0] - I, A = x[1] - T;
    if (S !== 0 || A !== 0) {
      var N = ((l[0] - I) * S + (l[1] - T) * A) / (S * S + A * A);
      N > 1 ? (I = x[0], T = x[1]) : N > 0 && (I += S * N, T += A * N);
    }
    return S = l[0] - I, A = l[1] - T, S * S + A * A;
  }
  function C(l, w, x, I, T, S, A, N) {
    var Y = x - l, q = I - w, d = A - T, k = N - S, M = l - T, B = w - S, X = Y * Y + q * q, L = Y * d + q * k, b = d * d + k * k, P = Y * M + q * B, F = d * M + k * B, V = X * b - L * L, U, z, Q, W, ft = V, ct = V;
    V === 0 ? (z = 0, ft = 1, W = F, ct = b) : (z = L * F - b * P, W = X * F - L * P, z < 0 ? (z = 0, W = F, ct = b) : z > ft && (z = ft, W = F + L, ct = b)), W < 0 ? (W = 0, -P < 0 ? z = 0 : -P > X ? z = ft : (z = -P, ft = X)) : W > ct && (W = ct, -P + L < 0 ? z = 0 : -P + L > X ? z = ft : (z = -P + L, ft = X)), U = z === 0 ? 0 : z / ft, Q = W === 0 ? 0 : W / ct;
    var ut = (1 - U) * l + U * x, pt = (1 - U) * w + U * I, mt = (1 - Q) * T + Q * A, gt = (1 - Q) * S + Q * N, Bt = mt - ut, Xt = gt - pt;
    return Bt * Bt + Xt * Xt;
  }
  function m(l, w) {
    return l[0] === w[0] ? l[1] - w[1] : l[0] - w[0];
  }
  function y(l) {
    l.sort(m);
    for (var w = [], x = 0; x < l.length; x++) {
      for (; w.length >= 2 && u(w[w.length - 2], w[w.length - 1], l[x]) <= 0; )
        w.pop();
      w.push(l[x]);
    }
    for (var I = [], T = l.length - 1; T >= 0; T--) {
      for (; I.length >= 2 && u(I[I.length - 2], I[I.length - 1], l[T]) <= 0; )
        I.pop();
      I.push(l[T]);
    }
    return I.pop(), w.pop(), w.concat(I);
  }
  return Ye.exports;
}
var Jr = Wr();
const Gr = /* @__PURE__ */ Nr(Jr);
function In(n, e = {}) {
  e.concavity = e.concavity || 1 / 0;
  const t = [];
  if (un(n, (s) => {
    t.push([s[0], s[1]]);
  }), !t.length)
    return null;
  const i = Gr(t, e.concavity);
  return i.length > 3 ? xe([i]) : null;
}
var Ee = { exports: {} }, Kr = Ee.exports, Bn;
function Qr() {
  return Bn || (Bn = 1, (function(n, e) {
    (function(t, i) {
      i(e);
    })(Kr, (function(t) {
      var i = Object.defineProperty, s = (E, O, D) => O in E ? i(E, O, { enumerable: !0, configurable: !0, writable: !0, value: D }) : E[O] = D, r = (E, O, D) => s(E, typeof O != "symbol" ? O + "" : O, D);
      function o(E, O, D = {}) {
        const $ = { type: "Feature" };
        return (D.id === 0 || D.id) && ($.id = D.id), D.bbox && ($.bbox = D.bbox), $.properties = O || {}, $.geometry = E, $;
      }
      function a(E, O, D = {}) {
        if (!E) throw new Error("coordinates is required");
        if (!Array.isArray(E)) throw new Error("coordinates must be an Array");
        if (E.length < 2) throw new Error("coordinates must be at least 2 numbers long");
        if (!u(E[0]) || !u(E[1])) throw new Error("coordinates must contain numbers");
        return o({ type: "Point", coordinates: E }, O, D);
      }
      function c(E, O, D = {}) {
        for (const $ of E) {
          if ($.length < 4) throw new Error("Each LinearRing of a Polygon must have 4 or more Positions.");
          if ($[$.length - 1].length !== $[0].length) throw new Error("First and last Position are not equivalent.");
          for (let tt = 0; tt < $[$.length - 1].length; tt++) if ($[$.length - 1][tt] !== $[0][tt]) throw new Error("First and last Position are not equivalent.");
        }
        return o({ type: "Polygon", coordinates: E }, O, D);
      }
      function f(E, O = {}) {
        const D = { type: "FeatureCollection" };
        return O.id && (D.id = O.id), O.bbox && (D.bbox = O.bbox), D.features = E, D;
      }
      function u(E) {
        return !isNaN(E) && E !== null && !Array.isArray(E);
      }
      function h(E) {
        if (!E) throw new Error("coord is required");
        if (!Array.isArray(E)) {
          if (E.type === "Feature" && E.geometry !== null && E.geometry.type === "Point") return [...E.geometry.coordinates];
          if (E.type === "Point") return [...E.coordinates];
        }
        if (Array.isArray(E) && E.length >= 2 && !Array.isArray(E[0]) && !Array.isArray(E[1])) return [...E];
        throw new Error("coord must be GeoJSON Point or an Array of numbers");
      }
      function p(E) {
        if (Array.isArray(E)) return E;
        if (E.type === "Feature") {
          if (E.geometry !== null) return E.geometry.coordinates;
        } else if (E.coordinates) return E.coordinates;
        throw new Error("coords must be GeoJSON Feature, Geometry Object or an Array");
      }
      function g(E) {
        return E.type === "Feature" ? E.geometry : E;
      }
      const _ = 11102230246251565e-32, v = 134217729, R = (3 + 8 * _) * _;
      function C(E, O, D, $, tt) {
        let K, et, st, it, at = O[0], ht = $[0], G = 0, Z = 0;
        ht > at == ht > -at ? (K = at, at = O[++G]) : (K = ht, ht = $[++Z]);
        let lt = 0;
        if (G < E && Z < D) for (ht > at == ht > -at ? (et = at + K, st = K - (et - at), at = O[++G]) : (et = ht + K, st = K - (et - ht), ht = $[++Z]), K = et, st !== 0 && (tt[lt++] = st); G < E && Z < D; ) ht > at == ht > -at ? (et = K + at, it = et - K, st = K - (et - it) + (at - it), at = O[++G]) : (et = K + ht, it = et - K, st = K - (et - it) + (ht - it), ht = $[++Z]), K = et, st !== 0 && (tt[lt++] = st);
        for (; G < E; ) et = K + at, it = et - K, st = K - (et - it) + (at - it), at = O[++G], K = et, st !== 0 && (tt[lt++] = st);
        for (; Z < D; ) et = K + ht, it = et - K, st = K - (et - it) + (ht - it), ht = $[++Z], K = et, st !== 0 && (tt[lt++] = st);
        return (K !== 0 || lt === 0) && (tt[lt++] = K), lt;
      }
      function m(E, O) {
        let D = O[0];
        for (let $ = 1; $ < E; $++) D += O[$];
        return D;
      }
      function y(E) {
        return new Float64Array(E);
      }
      const l = (3 + 16 * _) * _, w = (2 + 12 * _) * _, x = (9 + 64 * _) * _ * _, I = y(4), T = y(8), S = y(12), A = y(16), N = y(4);
      function Y(E, O, D, $, tt, K, et) {
        let st, it, at, ht, G, Z, lt, _t, nt, H, J, wt, At, It, Rt, yt, Ot, Yt;
        const Wt = E - tt, Jt = D - tt, Gt = O - K, Kt = $ - K;
        It = Wt * Kt, Z = v * Wt, lt = Z - (Z - Wt), _t = Wt - lt, Z = v * Kt, nt = Z - (Z - Kt), H = Kt - nt, Rt = _t * H - (It - lt * nt - _t * nt - lt * H), yt = Gt * Jt, Z = v * Gt, lt = Z - (Z - Gt), _t = Gt - lt, Z = v * Jt, nt = Z - (Z - Jt), H = Jt - nt, Ot = _t * H - (yt - lt * nt - _t * nt - lt * H), J = Rt - Ot, G = Rt - J, I[0] = Rt - (J + G) + (G - Ot), wt = It + J, G = wt - It, At = It - (wt - G) + (J - G), J = At - yt, G = At - J, I[1] = At - (J + G) + (G - yt), Yt = wt + J, G = Yt - wt, I[2] = wt - (Yt - G) + (J - G), I[3] = Yt;
        let le = m(4, I), _e = w * et;
        if (le >= _e || -le >= _e || (G = E - Wt, st = E - (Wt + G) + (G - tt), G = D - Jt, at = D - (Jt + G) + (G - tt), G = O - Gt, it = O - (Gt + G) + (G - K), G = $ - Kt, ht = $ - (Kt + G) + (G - K), st === 0 && it === 0 && at === 0 && ht === 0) || (_e = x * et + R * Math.abs(le), le += Wt * ht + Kt * st - (Gt * at + Jt * it), le >= _e || -le >= _e)) return le;
        It = st * Kt, Z = v * st, lt = Z - (Z - st), _t = st - lt, Z = v * Kt, nt = Z - (Z - Kt), H = Kt - nt, Rt = _t * H - (It - lt * nt - _t * nt - lt * H), yt = it * Jt, Z = v * it, lt = Z - (Z - it), _t = it - lt, Z = v * Jt, nt = Z - (Z - Jt), H = Jt - nt, Ot = _t * H - (yt - lt * nt - _t * nt - lt * H), J = Rt - Ot, G = Rt - J, N[0] = Rt - (J + G) + (G - Ot), wt = It + J, G = wt - It, At = It - (wt - G) + (J - G), J = At - yt, G = At - J, N[1] = At - (J + G) + (G - yt), Yt = wt + J, G = Yt - wt, N[2] = wt - (Yt - G) + (J - G), N[3] = Yt;
        const ar = C(4, I, 4, N, T);
        It = Wt * ht, Z = v * Wt, lt = Z - (Z - Wt), _t = Wt - lt, Z = v * ht, nt = Z - (Z - ht), H = ht - nt, Rt = _t * H - (It - lt * nt - _t * nt - lt * H), yt = Gt * at, Z = v * Gt, lt = Z - (Z - Gt), _t = Gt - lt, Z = v * at, nt = Z - (Z - at), H = at - nt, Ot = _t * H - (yt - lt * nt - _t * nt - lt * H), J = Rt - Ot, G = Rt - J, N[0] = Rt - (J + G) + (G - Ot), wt = It + J, G = wt - It, At = It - (wt - G) + (J - G), J = At - yt, G = At - J, N[1] = At - (J + G) + (G - yt), Yt = wt + J, G = Yt - wt, N[2] = wt - (Yt - G) + (J - G), N[3] = Yt;
        const cr = C(ar, T, 4, N, S);
        It = st * ht, Z = v * st, lt = Z - (Z - st), _t = st - lt, Z = v * ht, nt = Z - (Z - ht), H = ht - nt, Rt = _t * H - (It - lt * nt - _t * nt - lt * H), yt = it * at, Z = v * it, lt = Z - (Z - it), _t = it - lt, Z = v * at, nt = Z - (Z - at), H = at - nt, Ot = _t * H - (yt - lt * nt - _t * nt - lt * H), J = Rt - Ot, G = Rt - J, N[0] = Rt - (J + G) + (G - Ot), wt = It + J, G = wt - It, At = It - (wt - G) + (J - G), J = At - yt, G = At - J, N[1] = At - (J + G) + (G - yt), Yt = wt + J, G = Yt - wt, N[2] = wt - (Yt - G) + (J - G), N[3] = Yt;
        const fr = C(cr, S, 4, N, A);
        return A[fr - 1];
      }
      function q(E, O, D, $, tt, K) {
        const et = (O - K) * (D - tt), st = (E - tt) * ($ - K), it = et - st, at = Math.abs(et + st);
        return Math.abs(it) >= l * at ? it : -Y(E, O, D, $, tt, K, at);
      }
      function d(E, O) {
        var D, $, tt = 0, K, et, st, it, at, ht, G, Z = E[0], lt = E[1], _t = O.length;
        for (D = 0; D < _t; D++) {
          $ = 0;
          var nt = O[D], H = nt.length - 1;
          if (ht = nt[0], ht[0] !== nt[H][0] && ht[1] !== nt[H][1]) throw new Error("First and last coordinates in a ring must be the same");
          for (et = ht[0] - Z, st = ht[1] - lt, $; $ < H; $++) {
            if (G = nt[$ + 1], it = G[0] - Z, at = G[1] - lt, st === 0 && at === 0) {
              if (it <= 0 && et >= 0 || et <= 0 && it >= 0) return 0;
            } else if (at >= 0 && st <= 0 || at <= 0 && st >= 0) {
              if (K = q(et, it, st, at, 0, 0), K === 0) return 0;
              (K > 0 && at > 0 && st <= 0 || K < 0 && at <= 0 && st > 0) && tt++;
            }
            ht = G, st = at, et = it;
          }
        }
        return tt % 2 !== 0;
      }
      function k(E, O, D = {}) {
        if (!E) throw new Error("point is required");
        if (!O) throw new Error("polygon is required");
        const $ = h(E), tt = g(O), K = tt.type, et = O.bbox;
        let st = tt.coordinates;
        if (et && M($, et) === !1) return !1;
        K === "Polygon" && (st = [st]);
        let it = !1;
        for (var at = 0; at < st.length; ++at) {
          const ht = d($, st[at]);
          if (ht === 0) return !D.ignoreBoundary;
          ht && (it = !0);
        }
        return it;
      }
      function M(E, O) {
        return O[0] <= E[0] && O[1] <= E[1] && O[2] >= E[0] && O[3] >= E[1];
      }
      function B(E, O) {
        for (let D = 0; D < O.features.length; D++) if (k(E, O.features[D])) return O.features[D];
      }
      function X(E, O, D) {
        const $ = O.geometry.coordinates[0][0], tt = O.geometry.coordinates[0][1], K = O.geometry.coordinates[0][2], et = E.geometry.coordinates, st = O.properties.a.geom, it = O.properties.b.geom, at = O.properties.c.geom, ht = [tt[0] - $[0], tt[1] - $[1]], G = [K[0] - $[0], K[1] - $[1]], Z = [et[0] - $[0], et[1] - $[1]], lt = [it[0] - st[0], it[1] - st[1]], _t = [at[0] - st[0], at[1] - st[1]];
        let nt = (G[1] * Z[0] - G[0] * Z[1]) / (ht[0] * G[1] - ht[1] * G[0]), H = (ht[0] * Z[1] - ht[1] * Z[0]) / (ht[0] * G[1] - ht[1] * G[0]);
        if (D) {
          const J = D[O.properties.a.index], wt = D[O.properties.b.index], At = D[O.properties.c.index];
          let It;
          if (nt < 0 || H < 0 || 1 - nt - H < 0) {
            const Rt = nt / (nt + H), yt = H / (nt + H);
            It = nt / wt / (Rt / wt + yt / At), H = H / At / (Rt / wt + yt / At);
          } else It = nt / wt / (nt / wt + H / At + (1 - nt - H) / J), H = H / At / (nt / wt + H / At + (1 - nt - H) / J);
          nt = It;
        }
        return [nt * lt[0] + H * _t[0] + st[0], nt * lt[1] + H * _t[1] + st[1]];
      }
      function L(E, O, D, $) {
        const tt = E.geometry.coordinates, K = D.geometry.coordinates, et = Math.atan2(tt[0] - K[0], tt[1] - K[1]), st = F(et, O[0]);
        if (st === void 0) throw new Error("Unable to determine vertex index");
        const it = O[1][st];
        return X(E, it.features[0], $);
      }
      function b(E, O, D, $, tt, K, et, st) {
        let it;
        if (et && (it = B(E, f([et]))), !it) {
          if (D) {
            const at = E.geometry.coordinates, ht = D.gridNum, G = D.xOrigin, Z = D.yOrigin, lt = D.xUnit, _t = D.yUnit, nt = D.gridCache, H = P(at[0], G, lt, ht), J = P(at[1], Z, _t, ht), wt = nt[H] ? nt[H][J] ? nt[H][J] : [] : [];
            O = f(wt.map((At) => O.features[At]));
          }
          it = B(E, O);
        }
        return st && st(it), it ? X(E, it, K) : L(E, $, tt, K);
      }
      function P(E, O, D, $) {
        let tt = Math.floor((E - O) / D);
        return tt >= $ && (tt = $ - 1), tt;
      }
      function F(E, O) {
        let D = V(E - O[0]), $ = Math.PI * 2, tt;
        for (let K = 0; K < O.length; K++) {
          const et = (K + 1) % O.length, st = V(E - O[et]), it = Math.min(Math.abs(D), Math.abs(st));
          D * st <= 0 && it < $ && ($ = it, tt = K), D = st;
        }
        return tt;
      }
      function V(E, O = !1) {
        const D = O ? function($) {
          return !($ >= 0 && $ < Math.PI * 2);
        } : function($) {
          return !($ > -1 * Math.PI && $ <= Math.PI);
        };
        for (; D(E); ) E = E + 2 * Math.PI * (E > 0 ? -1 : 1);
        return E;
      }
      function U(E, O) {
        return O && O >= 2.00703 || Array.isArray(E[0]) ? E : E.map((D) => [D.illstNodes, D.mercNodes, D.startEnd]);
      }
      function z(E) {
        const O = E.features;
        for (let D = 0; D < O.length; D++) {
          const $ = O[D];
          `${$.properties.a.index}`.substring(0, 1) === "b" && `${$.properties.b.index}`.substring(0, 1) === "b" ? O[D] = { geometry: { type: "Polygon", coordinates: [[$.geometry.coordinates[0][2], $.geometry.coordinates[0][0], $.geometry.coordinates[0][1], $.geometry.coordinates[0][2]]] }, properties: { a: { geom: $.properties.c.geom, index: $.properties.c.index }, b: { geom: $.properties.a.geom, index: $.properties.a.index }, c: { geom: $.properties.b.geom, index: $.properties.b.index } }, type: "Feature" } : `${$.properties.c.index}`.substring(0, 1) === "b" && `${$.properties.a.index}`.substring(0, 1) === "b" && (O[D] = { geometry: { type: "Polygon", coordinates: [[$.geometry.coordinates[0][1], $.geometry.coordinates[0][2], $.geometry.coordinates[0][0], $.geometry.coordinates[0][1]]] }, properties: { a: { geom: $.properties.b.geom, index: $.properties.b.index }, b: { geom: $.properties.c.geom, index: $.properties.c.index }, c: { geom: $.properties.a.geom, index: $.properties.a.index } }, type: "Feature" });
        }
        return E;
      }
      function Q(E) {
        const O = ["a", "b", "c", "a"].map((K) => E.properties[K].geom), D = E.geometry.coordinates[0], $ = E.properties, tt = { a: { geom: D[0], index: $.a.index }, b: { geom: D[1], index: $.b.index }, c: { geom: D[2], index: $.c.index } };
        return c([O], tt);
      }
      function W(E) {
        const O = [0, 1, 2, 0].map(($) => E[$][0][0]), D = { a: { geom: E[0][0][1], index: E[0][1] }, b: { geom: E[1][0][1], index: E[1][1] }, c: { geom: E[2][0][1], index: E[2][1] } };
        return c([O], D);
      }
      function ft(E, O, D, $, tt, K = !1, et) {
        const st = E.map((it) => {
          (!et || et < 2.00703) && (it = ct(it));
          const at = isFinite(it) ? O[it] : it === "c" ? $ : it === "b0" ? tt[0] : it === "b1" ? tt[1] : it === "b2" ? tt[2] : it === "b3" ? tt[3] : (function() {
            const ht = it.match(/e(\d+)/);
            if (ht) {
              const G = parseInt(ht[1]);
              return D[G];
            }
            throw "Bad index value for indexesToTri";
          })();
          return K ? [[at[1], at[0]], it] : [[at[0], at[1]], it];
        });
        return W(st);
      }
      function ct(E) {
        return typeof E == "number" ? E : E.replace(/^(c|e|b)(?:ent|dgeNode|box)(\d+)?$/, "$1$2");
      }
      const ut = 2.00703;
      function pt(E) {
        return !!(E.version || !E.tins && E.points && E.tins_points);
      }
      function mt(E) {
        return { points: E.points, pointsWeightBuffer: Bt(E), strictStatus: Xt(E), verticesParams: kt(E), centroid: Ht(E), edges: U(E.edges || []), edgeNodes: E.edgeNodes || [], tins: ue(E), kinks: Je(E.kinks_points), yaxisMode: E.yaxisMode ?? "invert", strictMode: E.strictMode ?? "auto", vertexMode: E.vertexMode, bounds: E.bounds, boundsPolygon: E.boundsPolygon, wh: E.wh, xy: E.bounds ? E.xy : [0, 0] };
      }
      function gt(E) {
        const O = Ge(E), D = O.tins;
        return { compiled: O, tins: D, points: Ke(D), strictStatus: O.strict_status, pointsWeightBuffer: O.weight_buffer, verticesParams: O.vertices_params, centroid: O.centroid, kinks: O.kinks };
      }
      function Bt(E) {
        return !E.version || E.version < ut ? ["forw", "bakw"].reduce((O, D) => {
          const $ = E.weight_buffer[D];
          return $ && (O[D] = Object.keys($).reduce((tt, K) => {
            const et = ct(K);
            return tt[et] = $[K], tt;
          }, {})), O;
        }, {}) : E.weight_buffer;
      }
      function Xt(E) {
        return E.strict_status ? E.strict_status : E.kinks_points ? "strict_error" : E.tins_points.length === 2 ? "loose" : "strict";
      }
      function kt(E) {
        const O = { forw: [E.vertices_params[0]], bakw: [E.vertices_params[1]] };
        return O.forw[1] = Mt(E, !1), O.bakw[1] = Mt(E, !0), O;
      }
      function Mt(E, O) {
        return [0, 1, 2, 3].map((D) => {
          const $ = (D + 1) % 4, tt = ft(["c", `b${D}`, `b${$}`], E.points, E.edgeNodes || [], E.centroid_point, E.vertices_points, O, ut);
          return f([tt]);
        });
      }
      function Ht(E) {
        return { forw: a(E.centroid_point[0], { target: { geom: E.centroid_point[1], index: "c" } }), bakw: a(E.centroid_point[1], { target: { geom: E.centroid_point[0], index: "c" } }) };
      }
      function ue(E) {
        const O = E.tins_points.length === 1 ? 0 : 1;
        return { forw: f(E.tins_points[0].map((D) => ft(D, E.points, E.edgeNodes || [], E.centroid_point, E.vertices_points, !1, E.version))), bakw: f(E.tins_points[O].map((D) => ft(D, E.points, E.edgeNodes || [], E.centroid_point, E.vertices_points, !0, E.version))) };
      }
      function Je(E) {
        if (E) return { bakw: f(E.map((O) => a(O))) };
      }
      function Ge(E) {
        return JSON.parse(JSON.stringify(E).replace('"cent"', '"c"').replace(/"bbox(\d+)"/g, '"b$1"'));
      }
      function Ke(E) {
        const O = [], D = E.forw.features;
        for (let $ = 0; $ < D.length; $++) {
          const tt = D[$];
          ["a", "b", "c"].map((K, et) => {
            const st = tt.geometry.coordinates[0][et], it = tt.properties[K].geom, at = tt.properties[K].index;
            typeof at == "number" && (O[at] = [st, it]);
          });
        }
        return O;
      }
      const Qe = ut, jt = class ne {
        constructor() {
          r(this, "points", []), r(this, "pointsWeightBuffer"), r(this, "strict_status"), r(this, "vertices_params"), r(this, "centroid"), r(this, "edgeNodes"), r(this, "edges"), r(this, "tins"), r(this, "kinks"), r(this, "yaxisMode", ne.YAXIS_INVERT), r(this, "strictMode", ne.MODE_AUTO), r(this, "vertexMode", ne.VERTEX_PLAIN), r(this, "bounds"), r(this, "boundsPolygon"), r(this, "wh"), r(this, "xy"), r(this, "indexedTins"), r(this, "stateFull", !1), r(this, "stateTriangle"), r(this, "stateBackward"), r(this, "priority"), r(this, "importance"), r(this, "xyBounds"), r(this, "mercBounds");
        }
        setCompiled(O) {
          if (pt(O)) {
            this.applyModernState(mt(O));
            return;
          }
          this.applyLegacyState(gt(O));
        }
        applyModernState(O) {
          this.points = O.points, this.pointsWeightBuffer = O.pointsWeightBuffer, this.strict_status = O.strictStatus, this.vertices_params = O.verticesParams, this.centroid = O.centroid, this.edges = O.edges, this.edgeNodes = O.edgeNodes || [], this.tins = O.tins, this.addIndexedTin(), this.kinks = O.kinks, this.yaxisMode = O.yaxisMode ?? ne.YAXIS_INVERT, this.vertexMode = O.vertexMode ?? ne.VERTEX_PLAIN, this.strictMode = O.strictMode ?? ne.MODE_AUTO, O.bounds ? (this.bounds = O.bounds, this.boundsPolygon = O.boundsPolygon, this.xy = O.xy, this.wh = O.wh) : (this.bounds = void 0, this.boundsPolygon = void 0, this.xy = O.xy ?? [0, 0], O.wh && (this.wh = O.wh));
        }
        applyLegacyState(O) {
          this.tins = O.tins, this.addIndexedTin(), this.strict_status = O.strictStatus, this.pointsWeightBuffer = O.pointsWeightBuffer, this.vertices_params = O.verticesParams, this.centroid = O.centroid, this.kinks = O.kinks, this.points = O.points;
        }
        addIndexedTin() {
          const O = this.tins, D = O.forw, $ = O.bakw, tt = Math.ceil(Math.sqrt(D.features.length));
          if (tt < 3) {
            this.indexedTins = void 0;
            return;
          }
          let K = [], et = [];
          const st = D.features.map((nt) => {
            let H = [];
            return p(nt)[0].map((J) => {
              K.length === 0 ? K = [Array.from(J), Array.from(J)] : (J[0] < K[0][0] && (K[0][0] = J[0]), J[0] > K[1][0] && (K[1][0] = J[0]), J[1] < K[0][1] && (K[0][1] = J[1]), J[1] > K[1][1] && (K[1][1] = J[1])), H.length === 0 ? H = [Array.from(J), Array.from(J)] : (J[0] < H[0][0] && (H[0][0] = J[0]), J[0] > H[1][0] && (H[1][0] = J[0]), J[1] < H[0][1] && (H[0][1] = J[1]), J[1] > H[1][1] && (H[1][1] = J[1]));
            }), H;
          }), it = (K[1][0] - K[0][0]) / tt, at = (K[1][1] - K[0][1]) / tt, ht = st.reduce((nt, H, J) => {
            const wt = P(H[0][0], K[0][0], it, tt), At = P(H[1][0], K[0][0], it, tt), It = P(H[0][1], K[0][1], at, tt), Rt = P(H[1][1], K[0][1], at, tt);
            for (let yt = wt; yt <= At; yt++) {
              nt[yt] || (nt[yt] = []);
              for (let Ot = It; Ot <= Rt; Ot++) nt[yt][Ot] || (nt[yt][Ot] = []), nt[yt][Ot].push(J);
            }
            return nt;
          }, []), G = $.features.map((nt) => {
            let H = [];
            return p(nt)[0].map((J) => {
              et.length === 0 ? et = [Array.from(J), Array.from(J)] : (J[0] < et[0][0] && (et[0][0] = J[0]), J[0] > et[1][0] && (et[1][0] = J[0]), J[1] < et[0][1] && (et[0][1] = J[1]), J[1] > et[1][1] && (et[1][1] = J[1])), H.length === 0 ? H = [Array.from(J), Array.from(J)] : (J[0] < H[0][0] && (H[0][0] = J[0]), J[0] > H[1][0] && (H[1][0] = J[0]), J[1] < H[0][1] && (H[0][1] = J[1]), J[1] > H[1][1] && (H[1][1] = J[1]));
            }), H;
          }), Z = (et[1][0] - et[0][0]) / tt, lt = (et[1][1] - et[0][1]) / tt, _t = G.reduce((nt, H, J) => {
            const wt = P(H[0][0], et[0][0], Z, tt), At = P(H[1][0], et[0][0], Z, tt), It = P(H[0][1], et[0][1], lt, tt), Rt = P(H[1][1], et[0][1], lt, tt);
            for (let yt = wt; yt <= At; yt++) {
              nt[yt] || (nt[yt] = []);
              for (let Ot = It; Ot <= Rt; Ot++) nt[yt][Ot] || (nt[yt][Ot] = []), nt[yt][Ot].push(J);
            }
            return nt;
          }, []);
          this.indexedTins = { forw: { gridNum: tt, xOrigin: K[0][0], yOrigin: K[0][1], xUnit: it, yUnit: at, gridCache: ht }, bakw: { gridNum: tt, xOrigin: et[0][0], yOrigin: et[0][1], xUnit: Z, yUnit: lt, gridCache: _t } };
        }
        transform(O, D, $) {
          if (D && this.strict_status == ne.STATUS_ERROR) throw 'Backward transform is not allowed if strict_status == "strict_error"';
          this.yaxisMode == ne.YAXIS_FOLLOW && D && (O = [O[0], -1 * O[1]]);
          const tt = a(O);
          if (this.bounds && !D && !$ && !k(tt, this.boundsPolygon)) return !1;
          const K = D ? this.tins.bakw : this.tins.forw, et = D ? this.indexedTins.bakw : this.indexedTins.forw, st = D ? this.vertices_params.bakw : this.vertices_params.forw, it = D ? this.centroid.bakw : this.centroid.forw, at = D ? this.pointsWeightBuffer.bakw : this.pointsWeightBuffer.forw;
          let ht, G;
          this.stateFull && (this.stateBackward == D ? ht = this.stateTriangle : (this.stateBackward = D, this.stateTriangle = void 0), G = (lt) => {
            this.stateTriangle = lt;
          });
          let Z = b(tt, K, et, st, it, at, ht, G);
          if (this.bounds && D && !$) {
            const lt = a(Z);
            if (!k(lt, this.boundsPolygon)) return !1;
          } else this.yaxisMode == ne.YAXIS_FOLLOW && !D && (Z = [Z[0], -1 * Z[1]]);
          return Z;
        }
      };
      r(jt, "VERTEX_PLAIN", "plain"), r(jt, "VERTEX_BIRDEYE", "birdeye"), r(jt, "MODE_STRICT", "strict"), r(jt, "MODE_AUTO", "auto"), r(jt, "MODE_LOOSE", "loose"), r(jt, "STATUS_STRICT", "strict"), r(jt, "STATUS_ERROR", "strict_error"), r(jt, "STATUS_LOOSE", "loose"), r(jt, "YAXIS_FOLLOW", "follow"), r(jt, "YAXIS_INVERT", "invert");
      let Pe = jt;
      t.Transform = Pe, t.counterTri = Q, t.format_version = Qe, t.normalizeEdges = U, t.rotateVerticesTriangle = z, t.transformArr = b, Object.defineProperty(t, Symbol.toStringTag, { value: "Module" });
    }));
  })(Ee, Ee.exports)), Ee.exports;
}
var Ut = Qr();
const Pn = Math.pow(2, -52), De = new Uint32Array(512);
class ln {
  static from(e, t = ni, i = ri) {
    const s = e.length, r = new Float64Array(s * 2);
    for (let o = 0; o < s; o++) {
      const a = e[o];
      r[2 * o] = t(a), r[2 * o + 1] = i(a);
    }
    return new ln(r);
  }
  constructor(e) {
    const t = e.length >> 1;
    if (t > 0 && typeof e[0] != "number") throw new Error("Expected coords to contain numbers.");
    this.coords = e;
    const i = Math.max(2 * t - 5, 0);
    this._triangles = new Uint32Array(i * 3), this._halfedges = new Int32Array(i * 3), this._hashSize = Math.ceil(Math.sqrt(t)), this._hullPrev = new Uint32Array(t), this._hullNext = new Uint32Array(t), this._hullTri = new Uint32Array(t), this._hullHash = new Int32Array(this._hashSize), this._ids = new Uint32Array(t), this._dists = new Float64Array(t), this.update();
  }
  update() {
    const { coords: e, _hullPrev: t, _hullNext: i, _hullTri: s, _hullHash: r } = this, o = e.length >> 1;
    let a = 1 / 0, c = 1 / 0, f = -1 / 0, u = -1 / 0;
    for (let S = 0; S < o; S++) {
      const A = e[2 * S], N = e[2 * S + 1];
      A < a && (a = A), N < c && (c = N), A > f && (f = A), N > u && (u = N), this._ids[S] = S;
    }
    const h = (a + f) / 2, p = (c + u) / 2;
    let g, _, v;
    for (let S = 0, A = 1 / 0; S < o; S++) {
      const N = cn(h, p, e[2 * S], e[2 * S + 1]);
      N < A && (g = S, A = N);
    }
    const R = e[2 * g], C = e[2 * g + 1];
    for (let S = 0, A = 1 / 0; S < o; S++) {
      if (S === g) continue;
      const N = cn(R, C, e[2 * S], e[2 * S + 1]);
      N < A && N > 0 && (_ = S, A = N);
    }
    let m = e[2 * _], y = e[2 * _ + 1], l = 1 / 0;
    for (let S = 0; S < o; S++) {
      if (S === g || S === _) continue;
      const A = ti(R, C, m, y, e[2 * S], e[2 * S + 1]);
      A < l && (v = S, l = A);
    }
    let w = e[2 * v], x = e[2 * v + 1];
    if (l === 1 / 0) {
      for (let N = 0; N < o; N++)
        this._dists[N] = e[2 * N] - e[0] || e[2 * N + 1] - e[1];
      be(this._ids, this._dists, 0, o - 1);
      const S = new Uint32Array(o);
      let A = 0;
      for (let N = 0, Y = -1 / 0; N < o; N++) {
        const q = this._ids[N], d = this._dists[q];
        d > Y && (S[A++] = q, Y = d);
      }
      this.hull = S.subarray(0, A), this.triangles = new Uint32Array(0), this.halfedges = new Uint32Array(0);
      return;
    }
    if (re(R, C, m, y, w, x) < 0) {
      const S = _, A = m, N = y;
      _ = v, m = w, y = x, v = S, w = A, x = N;
    }
    const I = ei(R, C, m, y, w, x);
    this._cx = I.x, this._cy = I.y;
    for (let S = 0; S < o; S++)
      this._dists[S] = cn(e[2 * S], e[2 * S + 1], I.x, I.y);
    be(this._ids, this._dists, 0, o - 1), this._hullStart = g;
    let T = 3;
    i[g] = t[v] = _, i[_] = t[g] = v, i[v] = t[_] = g, s[g] = 0, s[_] = 1, s[v] = 2, r.fill(-1), r[this._hashKey(R, C)] = g, r[this._hashKey(m, y)] = _, r[this._hashKey(w, x)] = v, this.trianglesLen = 0, this._addTriangle(g, _, v, -1, -1, -1);
    for (let S = 0, A, N; S < this._ids.length; S++) {
      const Y = this._ids[S], q = e[2 * Y], d = e[2 * Y + 1];
      if (S > 0 && Math.abs(q - A) <= Pn && Math.abs(d - N) <= Pn || (A = q, N = d, Y === g || Y === _ || Y === v)) continue;
      let k = 0;
      for (let b = 0, P = this._hashKey(q, d); b < this._hashSize && (k = r[(P + b) % this._hashSize], !(k !== -1 && k !== i[k])); b++)
        ;
      k = t[k];
      let M = k, B;
      for (; B = i[M], re(q, d, e[2 * M], e[2 * M + 1], e[2 * B], e[2 * B + 1]) >= 0; )
        if (M = B, M === k) {
          M = -1;
          break;
        }
      if (M === -1) continue;
      let X = this._addTriangle(M, Y, i[M], -1, -1, s[M]);
      s[Y] = this._legalize(X + 2), s[M] = X, T++;
      let L = i[M];
      for (; B = i[L], re(q, d, e[2 * L], e[2 * L + 1], e[2 * B], e[2 * B + 1]) < 0; )
        X = this._addTriangle(L, Y, B, s[Y], -1, s[L]), s[Y] = this._legalize(X + 2), i[L] = L, T--, L = B;
      if (M === k)
        for (; B = t[M], re(q, d, e[2 * B], e[2 * B + 1], e[2 * M], e[2 * M + 1]) < 0; )
          X = this._addTriangle(B, Y, M, -1, s[M], s[B]), this._legalize(X + 2), s[B] = X, i[M] = M, T--, M = B;
      this._hullStart = t[Y] = M, i[M] = t[L] = Y, i[Y] = L, r[this._hashKey(q, d)] = Y, r[this._hashKey(e[2 * M], e[2 * M + 1])] = M;
    }
    this.hull = new Uint32Array(T);
    for (let S = 0, A = this._hullStart; S < T; S++)
      this.hull[S] = A, A = i[A];
    this.triangles = this._triangles.subarray(0, this.trianglesLen), this.halfedges = this._halfedges.subarray(0, this.trianglesLen);
  }
  _hashKey(e, t) {
    return Math.floor(Hr(e - this._cx, t - this._cy) * this._hashSize) % this._hashSize;
  }
  _legalize(e) {
    const { _triangles: t, _halfedges: i, coords: s } = this;
    let r = 0, o = 0;
    for (; ; ) {
      const a = i[e], c = e - e % 3;
      if (o = c + (e + 2) % 3, a === -1) {
        if (r === 0) break;
        e = De[--r];
        continue;
      }
      const f = a - a % 3, u = c + (e + 1) % 3, h = f + (a + 2) % 3, p = t[o], g = t[e], _ = t[u], v = t[h];
      if (Zr(
        s[2 * p],
        s[2 * p + 1],
        s[2 * g],
        s[2 * g + 1],
        s[2 * _],
        s[2 * _ + 1],
        s[2 * v],
        s[2 * v + 1]
      )) {
        t[e] = v, t[a] = p;
        const C = i[h];
        if (C === -1) {
          let y = this._hullStart;
          do {
            if (this._hullTri[y] === h) {
              this._hullTri[y] = e;
              break;
            }
            y = this._hullPrev[y];
          } while (y !== this._hullStart);
        }
        this._link(e, C), this._link(a, i[o]), this._link(o, h);
        const m = f + (a + 1) % 3;
        r < De.length && (De[r++] = m);
      } else {
        if (r === 0) break;
        e = De[--r];
      }
    }
    return o;
  }
  _link(e, t) {
    this._halfedges[e] = t, t !== -1 && (this._halfedges[t] = e);
  }
  // add a new triangle given vertex indices and adjacent half-edge ids
  _addTriangle(e, t, i, s, r, o) {
    const a = this.trianglesLen;
    return this._triangles[a] = e, this._triangles[a + 1] = t, this._triangles[a + 2] = i, this._link(a, s), this._link(a + 1, r), this._link(a + 2, o), this.trianglesLen += 3, a;
  }
}
function Hr(n, e) {
  const t = n / (Math.abs(n) + Math.abs(e));
  return (e > 0 ? 3 - t : 1 + t) / 4;
}
function cn(n, e, t, i) {
  const s = n - t, r = e - i;
  return s * s + r * r;
}
function Zr(n, e, t, i, s, r, o, a) {
  const c = n - o, f = e - a, u = t - o, h = i - a, p = s - o, g = r - a, _ = c * c + f * f, v = u * u + h * h, R = p * p + g * g;
  return c * (h * R - v * g) - f * (u * R - v * p) + _ * (u * g - h * p) < 0;
}
function ti(n, e, t, i, s, r) {
  const o = t - n, a = i - e, c = s - n, f = r - e, u = o * o + a * a, h = c * c + f * f, p = 0.5 / (o * f - a * c), g = (f * u - a * h) * p, _ = (o * h - c * u) * p;
  return g * g + _ * _;
}
function ei(n, e, t, i, s, r) {
  const o = t - n, a = i - e, c = s - n, f = r - e, u = o * o + a * a, h = c * c + f * f, p = 0.5 / (o * f - a * c), g = n + (f * u - a * h) * p, _ = e + (o * h - c * u) * p;
  return { x: g, y: _ };
}
function be(n, e, t, i) {
  if (i - t <= 20)
    for (let s = t + 1; s <= i; s++) {
      const r = n[s], o = e[r];
      let a = s - 1;
      for (; a >= t && e[n[a]] > o; ) n[a + 1] = n[a--];
      n[a + 1] = r;
    }
  else {
    const s = t + i >> 1;
    let r = t + 1, o = i;
    ke(n, s, r), e[n[t]] > e[n[i]] && ke(n, t, i), e[n[r]] > e[n[i]] && ke(n, r, i), e[n[t]] > e[n[r]] && ke(n, t, r);
    const a = n[r], c = e[a];
    for (; ; ) {
      do
        r++;
      while (e[n[r]] < c);
      do
        o--;
      while (e[n[o]] > c);
      if (o < r) break;
      ke(n, r, o);
    }
    n[t + 1] = n[o], n[o] = a, i - r + 1 >= o - t ? (be(n, e, r, i), be(n, e, t, o - 1)) : (be(n, e, t, o - 1), be(n, e, r, i));
  }
}
function ke(n, e, t) {
  const i = n[e];
  n[e] = n[t], n[t] = i;
}
function ni(n) {
  return n[0];
}
function ri(n) {
  return n[1];
}
class ii {
  constructor(e, t) {
    bt(this, "bs");
    bt(this, "width");
    this.width = e, this.bs = t;
  }
  /**
   * Add a number to the set.
   *
   * @param idx The number to add. Must be 0 <= idx < len.
   */
  add(e) {
    const t = Math.floor(e / this.width), i = e % this.width;
    return this.bs[t] |= 1 << i, this;
  }
  /**
   * Delete a number from the set.
   *
   * @param idx The number to delete. Must be 0 <= idx < len.
   */
  delete(e) {
    const t = Math.floor(e / this.width), i = e % this.width;
    return this.bs[t] &= ~(1 << i), this;
  }
  /**
   * Add or delete a number in the set, depending on the second argument.
   *
   * @param idx The number to add or delete. Must be 0 <= idx < len.
   * @param val If true, add the number, otherwise delete.
   */
  set(e, t) {
    const i = Math.floor(e / this.width), r = 1 << e % this.width;
    return this.bs[i] ^= (-Number(t) ^ this.bs[i]) & r, t;
  }
  /**
   * Whether the number is in the set.
   *
   * @param idx The number to test. Must be 0 <= idx < len.
   */
  has(e) {
    const t = Math.floor(e / this.width), i = e % this.width;
    return (this.bs[t] & 1 << i) !== 0;
  }
  /**
   * Iterate over the numbers that are in the set.
   */
  forEach(e) {
    const t = this.bs.length;
    for (let i = 0; i < t; i++) {
      let s = 0;
      for (; this.bs[i] && s < this.width; )
        this.bs[i] & 1 << s && e(i * this.width + s), s++;
    }
    return this;
  }
}
class On extends ii {
  constructor(e) {
    super(8, new Uint8Array(Math.ceil(e / 8)).fill(0));
  }
}
function me(n) {
  return n % 3 === 2 ? n - 2 : n + 1;
}
function ie(n) {
  return n % 3 === 0 ? n + 2 : n - 1;
}
function Tn(n, e, t, i, s, r, o, a) {
  const c = re(n, e, s, r, o, a), f = re(t, i, s, r, o, a);
  if (c > 0 && f > 0 || c < 0 && f < 0)
    return !1;
  const u = re(s, r, n, e, t, i), h = re(o, a, n, e, t, i);
  return u > 0 && h > 0 || u < 0 && h < 0 ? !1 : c === 0 && f === 0 && u === 0 && h === 0 ? !(Math.max(s, o) < Math.min(n, t) || Math.max(n, t) < Math.min(s, o) || Math.max(r, a) < Math.min(e, i) || Math.max(e, i) < Math.min(r, a)) : !0;
}
class si {
  constructor(e) {
    /**
     * The triangulation object from Delaunator.
     */
    bt(this, "del");
    this.del = e;
  }
}
class Qn extends si {
  /**
   * Create a Constrain instance.
   *
   * @param del The triangulation output from Delaunator.
   * @param edges If provided, constrain these edges via constrainAll.
   */
  constructor(t, i) {
    if (!t || typeof t != "object" || !t.triangles || !t.halfedges || !t.coords)
      throw new Error("Expected an object with Delaunator output");
    if (t.triangles.length % 3 || t.halfedges.length !== t.triangles.length || t.coords.length % 2)
      throw new Error("Delaunator output appears inconsistent");
    if (t.triangles.length < 3)
      throw new Error("No edges in triangulation");
    super(t);
    bt(this, "vertMap");
    bt(this, "flips");
    bt(this, "consd");
    const s = 2 ** 32 - 1, r = t.coords.length >> 1, o = t.triangles.length;
    this.vertMap = new Uint32Array(r).fill(s), this.flips = new On(o), this.consd = new On(o);
    for (let a = 0; a < o; a++) {
      const c = t.triangles[a];
      this.vertMap[c] === s && this.updateVert(a);
    }
    i && this.constrainAll(i);
  }
  /**
   * Constrain the triangulation such that there is an edge between p1 and p2.
   */
  constrainOne(t, i) {
    const { triangles: s, halfedges: r } = this.del, o = this.vertMap[t];
    let a = o;
    do {
      const u = s[a], h = me(a);
      if (u === i)
        return this.protect(a);
      const p = ie(a), g = s[p];
      if (g === i)
        return this.protect(h), h;
      if (this.intersectSegments(t, i, g, u)) {
        a = p;
        break;
      }
      a = r[h];
    } while (a !== -1 && a !== o);
    let c = a, f = -1;
    for (; a !== -1; ) {
      const u = r[a], h = ie(a), p = ie(u), g = me(u);
      if (u === -1)
        throw new Error("Constraining edge exited the hull");
      if (this.consd.has(a))
        throw new Error("Edge intersects already constrained edge");
      if (this.isCollinear(t, i, s[a]) || this.isCollinear(t, i, s[u]))
        throw new Error("Constraining edge intersects point");
      if (!this.intersectSegments(
        s[a],
        s[u],
        s[h],
        s[p]
      )) {
        if (f === -1 && (f = a), s[p] === i) {
          if (a === f)
            throw new Error("Infinite loop: non-convex quadrilateral");
          a = f, f = -1;
          continue;
        }
        if (this.intersectSegments(
          t,
          i,
          s[p],
          s[u]
        ))
          a = p;
        else if (this.intersectSegments(
          t,
          i,
          s[g],
          s[p]
        ))
          a = g;
        else if (f === a)
          throw new Error("Infinite loop: no further intersect after non-convex");
        continue;
      }
      if (this.flipDiagonal(a), this.intersectSegments(
        t,
        i,
        s[h],
        s[p]
      ) && (f === -1 && (f = h), f === h))
        throw new Error("Infinite loop: flipped diagonal still intersects");
      s[p] === i ? (c = p, a = f, f = -1) : this.intersectSegments(
        t,
        i,
        s[g],
        s[p]
      ) && (a = g);
    }
    return this.protect(c), this.delaunify(!0), this.findEdge(t, i);
  }
  /**
   * Fix the Delaunay condition.
   */
  delaunify(t = !1) {
    const { halfedges: i } = this.del, s = this.flips, r = this.consd, o = i.length;
    let a;
    do {
      a = 0;
      for (let c = 0; c < o; c++) {
        if (r.has(c))
          continue;
        s.delete(c);
        const f = i[c];
        f !== -1 && (s.delete(f), this.isDelaunay(c) || (this.flipDiagonal(c), a++));
      }
    } while (t && a > 0);
    return this;
  }
  /**
   * Call constrainOne on each edge.
   */
  constrainAll(t) {
    const i = t.length;
    for (let s = 0; s < i; s++) {
      const r = t[s];
      this.constrainOne(r[0], r[1]);
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
  findEdge(t, i) {
    const s = this.vertMap[i], { triangles: r, halfedges: o } = this.del;
    let a = s, c = -1;
    do {
      if (r[a] === t)
        return a;
      c = me(a), a = o[c];
    } while (a !== -1 && a !== s);
    return r[me(c)] === t ? -c : 1 / 0;
  }
  /**
   * Mark an edge as constrained, i.e. should not be touched by `delaunify`.
   */
  protect(t) {
    const i = this.del.halfedges[t], s = this.flips, r = this.consd;
    return s.delete(t), r.add(t), i !== -1 ? (s.delete(i), r.add(i), i) : -t;
  }
  /**
   * Mark an edge as flipped unless constrained.
   */
  markFlip(t) {
    const i = this.del.halfedges, s = this.flips;
    if (this.consd.has(t))
      return !1;
    const o = i[t];
    return o !== -1 && (s.add(t), s.add(o)), !0;
  }
  /**
   * Flip the edge shared by two triangles.
   */
  flipDiagonal(t) {
    const { triangles: i, halfedges: s } = this.del, r = this.flips, o = this.consd, a = s[t], c = ie(t), f = me(t), u = ie(a), h = me(a), p = s[c], g = s[u];
    if (o.has(t))
      throw new Error("Trying to flip a constrained edge");
    return i[t] = i[u], s[t] = g, r.set(t, r.has(u)) || o.set(t, o.has(u)), g !== -1 && (s[g] = t), s[c] = u, i[a] = i[c], s[a] = p, r.set(a, r.has(c)) || o.set(a, o.has(c)), p !== -1 && (s[p] = a), s[u] = c, this.markFlip(t), this.markFlip(f), this.markFlip(a), this.markFlip(h), r.add(c), o.delete(c), r.add(u), o.delete(u), this.updateVert(t), this.updateVert(f), this.updateVert(a), this.updateVert(h), c;
  }
  /**
   * Whether point p1, p2, and p are collinear.
   */
  isCollinear(t, i, s) {
    const r = this.del.coords;
    return re(
      r[t * 2],
      r[t * 2 + 1],
      r[i * 2],
      r[i * 2 + 1],
      r[s * 2],
      r[s * 2 + 1]
    ) === 0;
  }
  /**
   * Whether the triangle formed by p1, p2, p3 keeps px outside the circumcircle.
   */
  inCircle(t, i, s, r) {
    const o = this.del.coords;
    return _r(
      o[t * 2],
      o[t * 2 + 1],
      o[i * 2],
      o[i * 2 + 1],
      o[s * 2],
      o[s * 2 + 1],
      o[r * 2],
      o[r * 2 + 1]
    ) < 0;
  }
  /**
   * Whether the triangles sharing edg conform to the Delaunay condition.
   */
  isDelaunay(t) {
    const { triangles: i, halfedges: s } = this.del, r = s[t];
    if (r === -1)
      return !0;
    const o = i[ie(t)], a = i[t], c = i[me(t)], f = i[ie(r)];
    return !this.inCircle(o, a, c, f);
  }
  /**
   * Update the vertex -> incoming edge map.
   */
  updateVert(t) {
    const { triangles: i, halfedges: s } = this.del, r = this.vertMap, o = i[t];
    let a = ie(t), c = s[a];
    for (; c !== -1 && c !== t; )
      a = ie(c), c = s[a];
    return r[o] = a, a;
  }
  /**
   * Whether the segments between vertices intersect.
   */
  intersectSegments(t, i, s, r) {
    const o = this.del.coords;
    return t === s || t === r || i === s || i === r ? !1 : Tn(
      o[t * 2],
      o[t * 2 + 1],
      o[i * 2],
      o[i * 2 + 1],
      o[s * 2],
      o[s * 2 + 1],
      o[r * 2],
      o[r * 2 + 1]
    );
  }
}
bt(Qn, "intersectSegments", Tn);
function Fe(n, e, t) {
  if (e || (e = []), typeof n != "object" || n.type !== "FeatureCollection")
    throw "Argument points must be FeatureCollection";
  if (!Array.isArray(e)) throw "Argument points must be Array of Array";
  const i = n.features.map(
    (c) => c.geometry.coordinates
  ), s = ln.from(i);
  let r;
  const o = [];
  s.triangles.length !== 0 && e.length !== 0 && (r = new Qn(s), r.constrainAll(e));
  for (let c = 0; c < s.triangles.length; c += 3)
    o.push([s.triangles[c], s.triangles[c + 1], s.triangles[c + 2]]);
  const a = ["a", "b", "c"];
  return Vt(
    o.map((c) => {
      const f = {}, u = c.map((h, p) => {
        const g = n.features[h], _ = g.geometry.coordinates, v = [_[0], _[1]];
        return _.length === 3 ? v[2] = _[2] : f[a[p]] = g.properties[t], v;
      });
      return u[3] = u[0], xe([u], f);
    })
  );
}
function Hn(n, e, t, i, s, r) {
  return Object.keys(n).reduce((o, a) => {
    const c = n[a], f = c.forw, u = c.bakw, h = {
      forw: [f[0] - e.forw[0], f[1] - e.forw[1]],
      bakw: [u[0] - e.bakw[0], u[1] - e.bakw[1]]
    }, p = h.forw[0] === 0 ? 1 / 0 : ((h.forw[0] < 0 ? t : i) - e.forw[0]) / h.forw[0], g = h.forw[1] === 0 ? 1 / 0 : ((h.forw[1] < 0 ? s : r) - e.forw[1]) / h.forw[1];
    if (Math.abs(p) / Math.abs(g) < 1.1) {
      const _ = {
        forw: [
          h.forw[0] * p + e.forw[0],
          h.forw[1] * p + e.forw[1]
        ],
        bakw: [
          h.bakw[0] * p + e.bakw[0],
          h.bakw[1] * p + e.bakw[1]
        ]
      };
      h.forw[0] < 0 ? o[3].push(_) : o[1].push(_);
    }
    if (Math.abs(g) / Math.abs(p) < 1.1) {
      const _ = {
        forw: [
          h.forw[0] * g + e.forw[0],
          h.forw[1] * g + e.forw[1]
        ],
        bakw: [
          h.bakw[0] * g + e.bakw[0],
          h.bakw[1] * g + e.bakw[1]
        ]
      };
      h.forw[1] < 0 ? o[0].push(_) : o[2].push(_);
    }
    return o;
  }, [[], [], [], []]);
}
function Zn(n, e) {
  const t = [[], [], [], []], i = [];
  return Object.keys(n).forEach((s) => {
    const r = n[s], o = r.forw, a = r.bakw, c = [
      o[0] - e.forw[0],
      o[1] - e.forw[1]
    ], f = [
      a[0] - e.bakw[0],
      e.bakw[1] - a[1]
    ], u = { forw: c, bakw: f };
    if (i.push(u), c[0] === 0 || c[1] === 0)
      return;
    let h = 0;
    c[0] > 0 && (h += 1), c[1] > 0 && (h += 2), t[h].push(u);
  }), { perQuad: t, aggregate: i };
}
function tr(n) {
  let e = 1 / 0, t = 0, i = 0;
  return n.forEach((s) => {
    const { forw: r, bakw: o } = s, a = Math.hypot(r[0], r[1]), c = Math.hypot(o[0], o[1]);
    if (c === 0) return;
    const f = a / c, u = Math.atan2(r[0], r[1]) - Math.atan2(o[0], o[1]);
    e = Math.min(e, f), t += Math.cos(u), i += Math.sin(u);
  }), isFinite(e) ? [e, Math.atan2(i, t)] : [1, 0];
}
function er(n, e, t) {
  const { perQuad: i, aggregate: s } = Zn(n, e), r = i.every((c) => c.length > 0), a = (t === "birdeye" ? r ? i : [s] : [s]).map((c) => tr(c));
  return a.length === 1 ? [a[0], a[0], a[0], a[0]] : a;
}
function oi(n, e, t) {
  const i = [1, 1, 1, 1];
  for (let s = 0; s < 4; s++) {
    const r = (s + 1) % 4, o = ze([n[s].bakw, n[r].bakw]);
    e[s].map((a) => {
      const c = ze([t.bakw, a.bakw]), f = Kn(o, c);
      if (f.features.length > 0 && f.features[0].geometry) {
        const u = f.features[0], h = Math.sqrt(
          Math.pow(a.bakw[0] - t.bakw[0], 2) + Math.pow(a.bakw[1] - t.bakw[1], 2)
        ), p = Math.sqrt(
          Math.pow(
            u.geometry.coordinates[0] - t.bakw[0],
            2
          ) + Math.pow(
            u.geometry.coordinates[1] - t.bakw[1],
            2
          )
        ), g = h / p;
        g > i[s] && (i[s] = g), g > i[r] && (i[r] = g);
      }
    });
  }
  n.forEach((s, r) => {
    const o = i[r], a = [
      (s.bakw[0] - t.bakw[0]) * o + t.bakw[0],
      (s.bakw[1] - t.bakw[1]) * o + t.bakw[1]
    ];
    s.bakw = a;
  });
}
function nr(n, e, t, i) {
  const s = n.map((o, a) => {
    const c = e[a], f = [
      c[0] - t.forw[0],
      c[1] - t.forw[1]
    ], h = Math.sqrt(
      Math.pow(f[0], 2) + Math.pow(f[1], 2)
    ) / o[0], p = Math.atan2(f[0], f[1]) - o[1], g = [
      t.bakw[0] + h * Math.sin(p),
      t.bakw[1] - h * Math.cos(p)
    ];
    return { forw: c, bakw: g };
  }), r = s[2];
  return s[2] = s[3], s[3] = r, oi(s, i, t), s;
}
function ai(n) {
  const { convexBuf: e, centroid: t, bbox: i, minx: s, maxx: r, miny: o, maxy: a } = n, c = Hn(e, t, s, r, o, a), f = er(e, t, "plain");
  return nr(f, i, t, c);
}
function ci(n) {
  const { convexBuf: e, centroid: t, bbox: i, minx: s, maxx: r, miny: o, maxy: a } = n, c = Hn(e, t, s, r, o, a), f = er(e, t, "birdeye");
  return nr(f, i, t, c);
}
function Nn(n) {
  for (; n > Math.PI; ) n -= 2 * Math.PI;
  for (; n <= -Math.PI; ) n += 2 * Math.PI;
  return n;
}
function Rn(n, e, t, i, s, r) {
  const o = e[0] - n[0], a = e[1] - n[1];
  if (o === 0 && a === 0) return null;
  const c = [];
  if (o !== 0)
    for (const u of [t, i]) {
      const h = (u - n[0]) / o;
      if (h > 0) {
        const p = n[1] + h * a;
        p >= s && p <= r && c.push({ t: h, x: u, y: p });
      }
    }
  if (a !== 0)
    for (const u of [s, r]) {
      const h = (u - n[1]) / a;
      if (h > 0) {
        const p = n[0] + h * o;
        p >= t && p <= i && c.push({ t: h, x: p, y: u });
      }
    }
  if (c.length === 0) return null;
  c.sort((u, h) => u.t - h.t);
  const f = c[0];
  return [f.x, f.y];
}
function Xn(n, e, t) {
  const i = [
    n[0] - e.forw[0],
    n[1] - e.forw[1]
  ], r = Math.sqrt(i[0] ** 2 + i[1] ** 2) / t[0], o = Math.atan2(i[0], i[1]) - t[1];
  return [
    e.bakw[0] + r * Math.sin(o),
    e.bakw[1] - r * Math.cos(o)
  ];
}
function Cn(n, e) {
  const i = Math.atan2(n[0] - e[0], n[1] - e[1]) * (180 / Math.PI);
  return i < 0 ? i + 360 : i;
}
function fi(n, e, t, i) {
  const s = e[0] - n[0], r = e[1] - n[1];
  if (Math.abs(s) < 1e-12 && Math.abs(r) < 1e-12) return null;
  const o = i[0] - t[0], a = i[1] - t[1], c = t[0] - n[0], f = t[1] - n[1], u = s * a - r * o;
  if (Math.abs(u) < 1e-12) return null;
  const h = (c * a - f * o) / u, p = (c * r - f * s) / u;
  return h <= 1e-10 || p < -1e-10 || p > 1 + 1e-10 ? null : { t: h, point: [n[0] + h * s, n[1] + h * r] };
}
function hi(n, e, t) {
  const i = t.length;
  let s = -1 / 0, r = null;
  for (let o = 0; o < i; o++) {
    const a = (o + 1) % i, c = fi(
      n,
      e,
      t[o].bakw,
      t[a].bakw
    );
    c && c.t > s && (s = c.t, r = c.point);
  }
  return r;
}
function ui(n, e, t) {
  const i = n.length, s = new Array(i).fill(1), r = n.map(
    (o) => Math.atan2(o.forw[0] - t.forw[0], o.forw[1] - t.forw[1])
  );
  for (const o of e) {
    const a = Math.atan2(
      o.forw[0] - t.forw[0],
      o.forw[1] - t.forw[1]
    );
    let c = -1, f = 1 / 0;
    for (let _ = 0; _ < i; _++) {
      const v = (_ + 1) % i, R = Nn(a - r[_]), C = Nn(a - r[v]);
      if (R * C <= 0) {
        const m = Math.min(Math.abs(R), Math.abs(C));
        m < f && (f = m, c = _);
      }
    }
    if (c === -1) continue;
    const u = (c + 1) % i, h = ze([n[c].bakw, n[u].bakw]), p = ze([t.bakw, o.bakw]), g = Kn(h, p);
    if (g.features.length > 0 && g.features[0].geometry) {
      const _ = g.features[0], v = Math.sqrt(
        Math.pow(o.bakw[0] - t.bakw[0], 2) + Math.pow(o.bakw[1] - t.bakw[1], 2)
      ), R = Math.sqrt(
        Math.pow(_.geometry.coordinates[0] - t.bakw[0], 2) + Math.pow(_.geometry.coordinates[1] - t.bakw[1], 2)
      ), C = v / R;
      C > s[c] && (s[c] = C), C > s[u] && (s[u] = C);
    }
  }
  n.forEach((o, a) => {
    const c = s[a];
    o.bakw = [
      (o.bakw[0] - t.bakw[0]) * c + t.bakw[0],
      (o.bakw[1] - t.bakw[1]) * c + t.bakw[1]
    ];
  });
}
function li(n) {
  const { convexBuf: e, centroid: t, allGcps: i, minx: s, maxx: r, miny: o, maxy: a } = n, { aggregate: c } = Zn(e, t), f = tr(c), h = [
    [s, o],
    [r, o],
    [r, a],
    [s, a]
  ].map((R) => ({
    forw: R,
    bakw: Xn(R, t, f)
  }));
  h.sort(
    (R, C) => Math.atan2(R.forw[0] - t.forw[0], R.forw[1] - t.forw[1]) - Math.atan2(C.forw[0] - t.forw[0], C.forw[1] - t.forw[1])
  ), ui(h, i, t);
  const p = new Set(
    h.map((R) => Math.floor(Cn(R.forw, t.forw) / 10) % 36)
  ), g = i.map((R) => ({
    forw: R.forw,
    bakw: R.bakw,
    angleDeg: Cn(R.forw, t.forw),
    dist: Math.hypot(R.forw[0] - t.forw[0], R.forw[1] - t.forw[1])
  })), _ = [];
  for (let R = 0; R < 36; R++) {
    if (p.has(R)) continue;
    const C = R * 10, m = C + 10, y = g.filter((x) => x.angleDeg >= C && x.angleDeg < m);
    let l = null, w = null;
    if (y.length > 0) {
      const x = y.reduce((I, T) => T.dist > I.dist ? T : I);
      l = Rn(t.forw, x.forw, s, r, o, a), l && (w = hi(t.bakw, x.bakw, h));
    }
    if (!l || !w) {
      const x = (C + 5) % 360 * (Math.PI / 180), I = [
        t.forw[0] + Math.sin(x),
        t.forw[1] + Math.cos(x)
      ];
      l = Rn(t.forw, I, s, r, o, a), l && (w = Xn(l, t, f));
    }
    l && w && _.push({ forw: l, bakw: w });
  }
  const v = [...h, ..._];
  return v.sort(
    (R, C) => Math.atan2(R.forw[0] - t.forw[0], R.forw[1] - t.forw[1]) - Math.atan2(C.forw[0] - t.forw[0], C.forw[1] - t.forw[1])
  ), v;
}
function di(n, e, t, i, s) {
  if (typeof n == "number" || typeof n == "string" && /^\d+$/.test(n)) {
    const a = typeof n == "number" ? n : parseInt(n, 10);
    return e[a];
  }
  if (n === "c")
    return [i[0], i[1]];
  const r = n.match(/^b(\d+)$/);
  if (r) {
    const a = parseInt(r[1], 10);
    return s[a];
  }
  const o = n.match(/^e(\d+)$/);
  if (o) {
    const a = parseInt(o[1], 10);
    return t[a];
  }
  throw new Error(`Bad index value for v3 triangle builder: ${n}`);
}
function fn(n, e, t, i, s, r = !1) {
  const o = n.map(
    (u) => di(u, e, t, i, s)
  ), a = [0, 1, 2, 0].map(
    (u) => r ? o[u][1] : o[u][0]
  ), c = [0, 1, 2].map(
    (u) => r ? o[u][0] : o[u][1]
  ), f = {
    a: { geom: c[0], index: n[0] },
    b: { geom: c[1], index: n[1] },
    c: { geom: c[2], index: n[2] }
  };
  return xe([a], f);
}
function Yn(n, e) {
  const t = n.vertices_points.length;
  return Array.from({ length: t }, (i, s) => {
    const r = (s + 1) % t, o = fn(
      ["c", `b${s}`, `b${r}`],
      n.points,
      n.edgeNodes ?? [],
      n.centroid_point,
      n.vertices_points,
      e
    );
    return Vt([o]);
  });
}
function pi(n) {
  return n.weight_buffer;
}
function gi(n) {
  return n.strict_status ? n.strict_status : n.kinks_points ? "strict_error" : n.tins_points.length === 2 ? "loose" : "strict";
}
function mi(n) {
  return {
    forw: Qt(n.centroid_point[0], {
      target: { geom: n.centroid_point[1], index: "c" }
    }),
    bakw: Qt(n.centroid_point[1], {
      target: { geom: n.centroid_point[0], index: "c" }
    })
  };
}
function wi(n) {
  const e = n.tins_points.length === 1 ? 0 : 1;
  return {
    forw: Vt(
      n.tins_points[0].map(
        (t) => fn(
          t,
          n.points,
          n.edgeNodes ?? [],
          n.centroid_point,
          n.vertices_points,
          !1
        )
      )
    ),
    bakw: Vt(
      n.tins_points[e].map(
        (t) => fn(
          t,
          n.points,
          n.edgeNodes ?? [],
          n.centroid_point,
          n.vertices_points,
          !0
        )
      )
    )
  };
}
function yi(n) {
  if (n)
    return {
      bakw: Vt(n.map((e) => Qt(e)))
    };
}
function bi(n) {
  const e = n.vertices_points.length, t = Yn(n, !1), i = Yn(n, !0), s = {
    forw: [n.vertices_params[0], t],
    bakw: [n.vertices_params[1], i]
  };
  if (n.vertices_params[0].length !== e || n.vertices_params[1].length !== e)
    throw new Error(
      `v3 compiled format mismatch: vertices_points has ${e} entries but vertices_params[0] has ${n.vertices_params[0].length} and vertices_params[1] has ${n.vertices_params[1].length}`
    );
  return {
    points: n.points,
    pointsWeightBuffer: pi(n),
    strictStatus: gi(n),
    verticesParams: s,
    centroid: mi(n),
    edges: Ut.normalizeEdges(n.edges ?? []),
    edgeNodes: n.edgeNodes ?? [],
    tins: wi(n),
    kinks: yi(n.kinks_points),
    yaxisMode: n.yaxisMode ?? "invert",
    strictMode: n.strictMode ?? "auto",
    vertexMode: n.vertexMode,
    bounds: n.bounds,
    boundsPolygon: n.boundsPolygon,
    wh: n.wh,
    xy: n.bounds ? n.xy : [0, 0]
  };
}
function vi(n) {
  const t = new xi(n).findSegmentIntersections(), i = sr(t), s = /* @__PURE__ */ new Map();
  return i.forEach((r) => {
    s.set(`${r.x}:${r.y}`, r);
  }), Array.from(s.values()).map(
    (r) => Qt([r.x, r.y])
  );
}
class xi {
  /**
   * 線分群からArcCollectionを初期化
   * @param coords - 線分群の座標配列
   */
  constructor(e) {
    /**
     * 座標データの配列
     * _xx, _yy: Float64Array形式で座標を保持
     * _ii: 各線分の開始インデックス
     * _nn: 各線分の頂点数
     */
    bt(this, "_xx");
    bt(this, "_yy");
    // coordinates data
    bt(this, "_ii");
    bt(this, "_nn");
    // indexes, sizes
    bt(this, "_zz", null);
    bt(this, "_zlimit", 0);
    // simplification
    bt(this, "_bb", null);
    bt(this, "_allBounds", null);
    // bounding boxes
    bt(this, "_arcIter", null);
    bt(this, "_filteredArcIter", null);
    // path iterators
    bt(this, "buf");
    this.initArcs(e);
  }
  initArcs(e) {
    const t = [], i = [], s = e.map((r) => {
      const o = r ? r.length : 0;
      for (let a = 0; a < o; a++)
        t.push(r[a][0]), i.push(r[a][1]);
      return o;
    });
    this.initXYData(s, t, i);
  }
  initXYData(e, t, i) {
    const s = e.length;
    this._xx = new Float64Array(t), this._yy = new Float64Array(i), this._nn = new Uint32Array(e), this._zz = null, this._zlimit = 0, this._filteredArcIter = null, this._ii = new Uint32Array(s);
    let r = 0;
    for (let o = 0; o < s; o++)
      this._ii[o] = r, r += e[o];
    (r != this._xx.length || this._xx.length != this._yy.length) && dn("ArcCollection#initXYData() Counting error"), this.initBounds(), this._arcIter = new $i(this._xx, this._yy);
  }
  initBounds() {
    const e = this.calcArcBounds_(this._xx, this._yy, this._nn);
    this._bb = e.bb, this._allBounds = e.bounds;
  }
  /**
   * データの境界を計算
   * @returns バウンディングボックス情報
   */
  calcArcBounds_(e, t, i) {
    const s = i.length, r = new Float64Array(s * 4), o = new Be();
    let a = 0, c, f, u;
    for (let h = 0; h < s; h++)
      c = i[h], c > 0 && (f = h * 4, u = Vi(e, t, a, c), r[f++] = u[0], r[f++] = u[1], r[f++] = u[2], r[f] = u[3], a += c, o.mergeBounds(u));
    return {
      bb: r,
      bounds: o
    };
  }
  getBounds() {
    return this._allBounds ? this._allBounds.clone() : new Be();
  }
  // @cb function(i, j, xx, yy)
  forEachSegment(e) {
    let t = 0;
    for (let i = 0, s = this.size(); i < s; i++)
      t += this.forEachArcSegment(i, e);
    return t;
  }
  size() {
    return this._ii && this._ii.length || 0;
  }
  // @cb function(i, j, xx, yy)
  forEachArcSegment(e, t) {
    const i = e >= 0, s = i ? e : ~e, r = this.getRetainedInterval(), o = this._nn[s], a = i ? 1 : -1;
    let c = i ? this._ii[s] : this._ii[s] + o - 1, f = c, u = 0;
    for (let h = 1; h < o; h++)
      f += a, (r === 0 || this._zz[f] >= r) && (t(c, f, this._xx, this._yy), c = f, u++);
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
  getUint32Array(e) {
    const t = e * 4;
    return (!this.buf || this.buf.byteLength < t) && (this.buf = new ArrayBuffer(t)), new Uint32Array(this.buf, 0, e);
  }
  // Return average magnitudes of dx, dy (with simplification)
  getAvgSegment2() {
    let e = 0, t = 0;
    const i = this.forEachSegment(
      (s, r, o, a) => {
        e += Math.abs(o[s] - o[r]), t += Math.abs(a[s] - a[r]);
      }
    );
    return [e / i || 0, t / i || 0];
  }
  /**
   * 交差判定のためのストライプ数を計算
   * 線分の平均長さに基づいて最適な分割数を決定
   */
  calcSegmentIntersectionStripeCount() {
    const e = this.getBounds().height(), t = this.getAvgSegment2()[1];
    let i = 1;
    return t > 0 && e > 0 && (i = Math.ceil(e / t / 20)), i || 1;
  }
  /**
   * 線分の交差を検出
   * ストライプ分割による効率的な判定を実装
   *
   * @returns 検出された交差点の配列
   */
  findSegmentIntersections() {
    const e = this.getBounds(), t = e.ymin || 0, i = (e.ymax || 0) - t, s = this.calcSegmentIntersectionStripeCount(), r = new Uint32Array(s), o = s > 1 ? (v) => Math.floor((s - 1) * (v - t) / i) : () => 0;
    let a, c;
    this.forEachSegment(
      (v, R, C, m) => {
        let y = o(m[v]);
        const l = o(m[R]);
        for (; r[y] = r[y] + 2, y != l; )
          y += l > y ? 1 : -1;
      }
    );
    const f = this.getUint32Array(ki(r));
    let u = 0;
    const h = [];
    Si(r, (v) => {
      const R = u;
      u += v, h.push(f.subarray(R, u));
    }), Ei(r, 0), this.forEachSegment(
      (v, R, C, m) => {
        let y = o(m[v]);
        const l = o(m[R]);
        let w, x;
        for (; w = r[y], r[y] = w + 2, x = h[y], x[w] = v, x[w + 1] = R, y != l; )
          y += l > y ? 1 : -1;
      }
    );
    const p = this.getVertexData(), g = [];
    let _;
    for (a = 0; a < s; a++)
      if (p.xx && p.yy)
        for (_ = Ai(h[a], p.xx, p.yy), c = 0; c < _.length; c++)
          g.push(_[c]);
    return sr(g);
  }
}
function dn(...n) {
  const e = n.join(" ");
  throw new Error(e);
}
function pn(n) {
  return n ? Mi(n) ? !0 : _i(n) ? !1 : n.length === 0 ? !0 : n.length > 0 : !1;
}
function _i(n) {
  return n != null && n.toString === String.prototype.toString;
}
function Mi(n) {
  return Array.isArray(n);
}
function ki(n, e) {
  pn(n) || dn("utils.sum() expects an array, received:", n);
  let t = 0, i;
  for (let s = 0, r = n.length; s < r; s++)
    i = n[s], i && (t += i);
  return t;
}
function Si(n, e, t) {
  if (!pn(n))
    throw new Error(`#forEach() takes an array-like argument. ${n}`);
  for (let i = 0, s = n.length; i < s; i++)
    e.call(t, n[i], i);
}
function Ei(n, e) {
  for (let t = 0, i = n.length; t < i; t++)
    n[t] = e;
  return n;
}
function Ai(n, e, t) {
  const i = n.length - 2, s = [];
  let r, o, a, c, f, u, h, p, g, _, v, R, C, m, y, l, w;
  for (Yi(e, n), l = 0; l < i; ) {
    for (r = n[l], o = n[l + 1], f = e[r], u = e[o], g = t[r], _ = t[o], w = l; w < i && (w += 2, a = n[w], h = e[a], !(u < h)); ) {
      if (v = t[a], c = n[w + 1], p = e[c], R = t[c], g >= v) {
        if (g > R && _ > v && _ > R) continue;
      } else if (g < R && _ < v && _ < R) continue;
      r == a || r == c || o == a || o == c || (C = Ii(
        f,
        g,
        u,
        _,
        h,
        v,
        p,
        R
      ), C && (m = [r, o], y = [a, c], s.push(Fn(C, m, y, e, t)), C.length == 4 && s.push(
        Fn(C.slice(2), m, y, e, t)
      )));
    }
    l += 2;
  }
  return s;
}
function Ii(n, e, t, i, s, r, o, a) {
  const c = Bi(n, e, t, i, s, r, o, a);
  let f = null;
  return c && (f = Pi(n, e, t, i, s, r, o, a), f ? Ci(n, e, t, i, s, r, o, a) && (f = null) : f = Xi(n, e, t, i, s, r, o, a)), f;
}
function Bi(n, e, t, i, s, r, o, a) {
  return Ae(n, e, t, i, s, r) * Ae(n, e, t, i, o, a) <= 0 && Ae(s, r, o, a, n, e) * Ae(s, r, o, a, t, i) <= 0;
}
function Ae(n, e, t, i, s, r) {
  return rr(n - s, e - r, t - s, i - r);
}
function rr(n, e, t, i) {
  return n * i - e * t;
}
function Pi(n, e, t, i, s, r, o, a) {
  let c = Le(n, e, t, i, s, r, o, a), f;
  return c && (f = Ti(c[0], c[1], n, e, t, i, s, r, o, a), f == 1 ? c = Le(t, i, n, e, s, r, o, a) : f == 2 ? c = Le(s, r, o, a, n, e, t, i) : f == 3 && (c = Le(o, a, s, r, n, e, t, i))), c && Ri(c, n, e, t, i, s, r, o, a), c;
}
function Le(n, e, t, i, s, r, o, a) {
  const c = rr(t - n, i - e, o - s, a - r), f = 1e-18;
  let u;
  if (c === 0) return null;
  const h = Ae(s, r, o, a, n, e) / c;
  return c <= f && c >= -f ? u = Oi(n, e, t, i, s, r, o, a) : u = [n + h * (t - n), e + h * (i - e)], u;
}
function Oi(n, e, t, i, s, r, o, a) {
  let c = null;
  return !se(n, s, o) && !se(e, r, a) ? c = [n, e] : !se(t, s, o) && !se(i, r, a) ? c = [t, i] : !se(s, n, t) && !se(r, e, i) ? c = [s, r] : !se(o, n, t) && !se(a, e, i) && (c = [o, a]), c;
}
function se(n, e, t) {
  let i;
  return e < t ? i = n < e || n > t : e > t ? i = n > e || n < t : i = n != e, i;
}
function Ti(n, e, ...t) {
  let i = -1, s = 1 / 0, r;
  for (let o = 0, a = 0, c = t.length; a < c; o++, a += 2)
    r = Ni(n, e, t[a], t[a + 1]), r < s && (s = r, i = o);
  return i;
}
function Ni(n, e, t, i) {
  const s = n - t, r = e - i;
  return s * s + r * r;
}
function Ri(n, e, t, i, s, r, o, a, c) {
  let f = n[0], u = n[1];
  f = $e(f, e, i), f = $e(f, r, a), u = $e(u, t, s), u = $e(u, o, c), n[0] = f, n[1] = u;
}
function $e(n, e, t) {
  let i;
  return se(n, e, t) && (i = Math.abs(n - e) < Math.abs(n - t) ? e : t, n = i), n;
}
function Xi(n, e, t, i, s, r, o, a) {
  const c = Math.min(n, t, s, o), f = Math.max(n, t, s, o), u = Math.min(e, i, r, a), h = Math.max(e, i, r, a), p = h - u > f - c;
  let g = [];
  return (p ? he(e, u, h) : he(n, c, f)) && g.push(n, e), (p ? he(i, u, h) : he(t, c, f)) && g.push(t, i), (p ? he(r, u, h) : he(s, c, f)) && g.push(s, r), (p ? he(a, u, h) : he(o, c, f)) && g.push(o, a), (g.length != 2 && g.length != 4 || g.length == 4 && g[0] == g[2] && g[1] == g[3]) && (g = null), g;
}
function Ci(n, e, t, i, s, r, o, a) {
  return n == s && e == r || n == o && e == a || t == s && i == r || t == o && i == a;
}
function he(n, e, t) {
  return n > e && n < t;
}
function Yi(n, e) {
  Di(n, e), ir(n, e, 0, e.length - 2);
}
function Di(n, e) {
  for (let t = 0, i = e.length; t < i; t += 2)
    n[e[t]] > n[e[t + 1]] && Fi(e, t, t + 1);
}
function Fi(n, e, t) {
  const i = n[e];
  n[e] = n[t], n[t] = i;
}
function ir(n, e, t, i) {
  let s = t, r = i, o, a;
  for (; s < i; ) {
    for (o = n[e[t + i >> 2 << 1]]; s <= r; ) {
      for (; n[e[s]] < o; ) s += 2;
      for (; n[e[r]] > o; ) r -= 2;
      s <= r && (a = e[s], e[s] = e[r], e[r] = a, a = e[s + 1], e[s + 1] = e[r + 1], e[r + 1] = a, s += 2, r -= 2);
    }
    if (r - t < 40 ? Dn(n, e, t, r) : ir(n, e, t, r), i - s < 40) {
      Dn(n, e, s, i);
      return;
    }
    t = s, r = i;
  }
}
function Dn(n, e, t, i) {
  let s, r;
  for (let o = t + 2; o <= i; o += 2) {
    s = e[o], r = e[o + 1];
    let a;
    for (a = o - 2; a >= t && n[s] < n[e[a]]; a -= 2)
      e[a + 2] = e[a], e[a + 3] = e[a + 1];
    e[a + 2] = s, e[a + 3] = r;
  }
}
function Fn(n, e, t, i, s) {
  const r = n[0], o = n[1];
  e = Ln(r, o, e[0], e[1], i, s), t = Ln(r, o, t[0], t[1], i, s);
  const a = e[0] < t[0] ? e : t, c = a == e ? t : e;
  return { x: r, y: o, a, b: c };
}
function Ln(n, e, t, i, s, r) {
  let o = t < i ? t : i, a = o === t ? i : t;
  return s[o] == n && r[o] == e ? a = o : s[a] == n && r[a] == e && (o = a), [o, a];
}
function sr(n) {
  const e = {};
  return n.filter((t) => {
    const i = Li(t);
    return i in e ? !1 : (e[i] = !0, !0);
  });
}
function Li(n) {
  return `${n.a.join(",")};${n.b.join(",")}`;
}
class $i {
  constructor(e, t) {
    bt(this, "_i", 0);
    bt(this, "_n", 0);
    bt(this, "_inc", 1);
    bt(this, "_xx");
    bt(this, "_yy");
    bt(this, "i", 0);
    bt(this, "x", 0);
    bt(this, "y", 0);
    this._xx = e, this._yy = t;
  }
}
function Vi(n, e, t, i) {
  let s = t | 0;
  const r = isNaN(i) ? n.length - s : i + s;
  let o, a, c, f, u, h;
  if (r > 0)
    c = u = n[s], f = h = e[s];
  else return [void 0, void 0, void 0, void 0];
  for (s++; s < r; s++)
    o = n[s], a = e[s], o < c && (c = o), o > u && (u = o), a < f && (f = a), a > h && (h = a);
  return [c, f, u, h];
}
class Be {
  constructor(...e) {
    bt(this, "xmin");
    bt(this, "ymin");
    bt(this, "xmax");
    bt(this, "ymax");
    e.length > 0 && this.setBounds(e);
  }
  // Return a bounding box with the same extent as this one.
  cloneBounds() {
    return this.clone();
  }
  clone() {
    return new Be(
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
  setBounds(e, t, i, s) {
    let r, o, a, c;
    if (arguments.length == 1)
      if (pn(e)) {
        const f = e;
        r = f[0], o = f[1], a = f[2], c = f[3];
      } else {
        const f = e;
        r = f.xmin, o = f.ymin, a = f.xmax, c = f.ymax;
      }
    else
      r = e, o = t, a = i, c = s;
    return this.xmin = r, this.ymin = o, this.xmax = a, this.ymax = c, (r > a || o > c) && this.update(), this;
  }
  update() {
    let e;
    this.xmin > this.xmax && (e = this.xmin, this.xmin = this.xmax, this.xmax = e), this.ymin > this.ymax && (e = this.ymin, this.ymin = this.ymax, this.ymax = e);
  }
  mergeBounds(e, ...t) {
    let i, s, r, o;
    return e instanceof Be ? (i = e.xmin, s = e.ymin, r = e.xmax, o = e.ymax) : t.length == 3 ? (i = e, s = t[0], r = t[1], o = t[2]) : e.length == 4 ? (i = e[0], s = e[1], r = e[2], o = e[3]) : dn("Bounds#mergeBounds() invalid argument:", e), this.xmin === void 0 ? this.setBounds(i, s, r, o) : (i < this.xmin && (this.xmin = i), s < this.ymin && (this.ymin = s), r > this.xmax && (this.xmax = r), o > this.ymax && (this.ymax = o)), this;
  }
}
function We(n) {
  const e = ["a", "b", "c"].map(
    (t) => n.properties[t].index
  );
  return [
    [0, 1],
    [0, 2],
    [1, 2],
    [0, 1, 2]
  ].map(
    (t) => t.map((i) => e[i]).sort().join("-")
  ).sort();
}
function or(n, e, t) {
  const i = We(e.forw), s = We(e.bakw);
  if (JSON.stringify(i) != JSON.stringify(s))
    throw `${JSON.stringify(e, null, 2)}
${JSON.stringify(
      i
    )}
${JSON.stringify(s)}`;
  for (let r = 0; r < i.length; r++) {
    const o = i[r];
    n[o] || (n[o] = []), n[o].push(e);
  }
  t && (t.forw.features.push(e.forw), t.bakw.features.push(e.bakw));
}
function $n(n, e, t) {
  const i = We(e.forw), s = We(e.bakw);
  if (JSON.stringify(i) != JSON.stringify(s))
    throw `${JSON.stringify(e, null, 2)}
${JSON.stringify(i)}
${JSON.stringify(s)}`;
  if (i.forEach((r) => {
    const o = n[r];
    if (!o) return;
    const a = o.filter((c) => c !== e);
    a.length === 0 ? delete n[r] : n[r] = a;
  }), t) {
    const r = (o, a) => {
      !o || !a || (o.features = o.features.filter((c) => c !== a));
    };
    r(t.forw, e.forw), r(t.bakw, e.bakw);
  }
}
function Ve(n, e, t) {
  return Qt(n, { target: { geom: e, index: t } });
}
function je(n) {
  return Qt(n.properties.target.geom, {
    target: {
      geom: n.geometry.coordinates,
      index: n.properties.target.index
    }
  });
}
function Vn(n, e) {
  const t = n.length, i = e.geometry.coordinates;
  return Array.from({ length: t }, (s, r) => r).map((s) => {
    const r = (s + 1) % t, o = n[s], a = n[r], c = o.geometry.coordinates, f = Math.atan2(
      c[0] - i[0],
      c[1] - i[1]
    ), u = [e, o, a, e].map(
      (g) => g.geometry.coordinates
    ), h = {
      a: {
        geom: e.properties.target.geom,
        index: e.properties.target.index
      },
      b: {
        geom: o.properties.target.geom,
        index: o.properties.target.index
      },
      c: {
        geom: a.properties.target.geom,
        index: a.properties.target.index
      }
    }, p = Vt([
      xe([u], h)
    ]);
    return [f, p];
  }).reduce(
    (s, r) => (s[0].push(r[0]), s[1].push(r[1]), s),
    [[], []]
  );
}
function ji(n) {
  const { tins: e, targets: t, includeReciprocals: i, numBoundaryVertices: s = 4 } = n, r = {};
  t.forEach((a) => {
    const c = e[a];
    if (!c || !c.features) return;
    r[a] = {};
    const f = {};
    c.features.forEach((u) => {
      const h = ["a", "b", "c"];
      for (let p = 0; p < 3; p++) {
        const g = (p + 1) % 3, _ = h[p], v = h[g], R = u.properties[_].index, C = u.properties[v].index, m = [R, C].sort().join("-");
        if (f[m]) continue;
        f[m] = !0;
        const y = u.geometry.coordinates[0][p], l = u.geometry.coordinates[0][g], w = u.properties[_].geom, x = u.properties[v].geom, I = Math.sqrt(
          Math.pow(w[0] - x[0], 2) + Math.pow(w[1] - x[1], 2)
        ) / Math.sqrt(
          Math.pow(y[0] - l[0], 2) + Math.pow(y[1] - l[1], 2)
        ), T = r[a];
        T[`${R}:${m}`] = I, T[`${C}:${m}`] = I;
      }
    });
  });
  const o = {};
  return i && (o.bakw = {}), t.forEach((a) => {
    const c = r[a];
    if (o[a] = {}, !c)
      return;
    const f = {};
    Object.keys(c).forEach((h) => {
      const [p] = h.split(":");
      f[p] || (f[p] = []), f[p].push(c[h]);
    }), Object.keys(f).forEach((h) => {
      const p = f[h], g = p.reduce((_, v) => _ + v, 0) / p.length;
      o[a][h] = g, i && o.bakw && (o.bakw[h] = 1 / g);
    });
    let u = 0;
    for (let h = 0; h < s; h++) {
      const p = `b${h}`, g = o[a][p] || 0;
      u += g;
    }
    o[a].c = u / s, i && o.bakw && (o.bakw.c = 1 / o[a].c);
  }), o;
}
function qi(n, e) {
  const t = n.split("-");
  if (t.length !== 2 || !t.every((r) => /^-?\d+$/.test(r))) return !1;
  const [i, s] = t.map((r) => parseInt(r, 10)).sort((r, o) => r - o);
  return e.some((r) => {
    if (r.length !== 2) return !1;
    const o = r.map((c) => parseInt(`${c}`, 10));
    if (o.some((c) => Number.isNaN(c))) return !1;
    const a = o.sort((c, f) => c - f);
    return a[0] === i && a[1] === s;
  });
}
function qe(n) {
  return ["a", "b", "c"].map((e, t) => ({
    prop: n.properties[e],
    geom: n.geometry.coordinates[0][t]
  }));
}
function Ui(n, e, t) {
  const i = /* @__PURE__ */ new Set();
  let s = !1;
  const r = Object.keys(e);
  for (const o of r) {
    if (i.has(o)) continue;
    i.add(o);
    const a = e[o];
    if (!a || a.length < 2) continue;
    const c = o.split("-");
    if (c.length !== 2 || qi(o, t)) continue;
    const f = qe(a[0].bakw), u = qe(a[1].bakw), h = qe(a[0].forw), p = qe(a[1].forw), g = c.map(
      (S) => f.find((A) => `${A.prop.index}` === S) || u.find((A) => `${A.prop.index}` === S)
    ), _ = c.map(
      (S) => h.find((A) => `${A.prop.index}` === S) || p.find((A) => `${A.prop.index}` === S)
    );
    if (g.some((S) => !S) || _.some((S) => !S))
      continue;
    const v = [f, u].map(
      (S) => S.find((A) => !c.includes(`${A.prop.index}`))
    ), R = [h, p].map(
      (S) => S.find((A) => !c.includes(`${A.prop.index}`))
    );
    if (v.some((S) => !S) || R.some((S) => !S))
      continue;
    const C = a[0].bakw.geometry.coordinates[0].slice(0, 3).map((S) => ye(S)), m = a[1].bakw.geometry.coordinates[0].slice(0, 3).map((S) => ye(S));
    if (!(jn(
      ye(v[0].geom),
      m
    ) || jn(
      ye(v[1].geom),
      C
    )))
      continue;
    const l = _.map(
      (S) => ye(S.geom)
    ), w = R.map(
      (S) => ye(S.geom)
    ), x = zi([
      ...l,
      ...w
    ]), I = Wi(x), T = qn(
      l[0],
      l[1],
      w[0]
    ) + qn(
      l[0],
      l[1],
      w[1]
    );
    hn(I, T) && ($n(e, a[0], n), $n(e, a[1], n), g.forEach((S) => {
      if (!S) return;
      const A = [
        S.geom,
        v[0].geom,
        v[1].geom,
        S.geom
      ], N = {
        a: S.prop,
        b: v[0].prop,
        c: v[1].prop
      }, Y = xe([A], N), q = Ut.counterTri(Y);
      or(e, {
        forw: q,
        bakw: Y
      }, n);
    }), s = !0);
  }
  return s;
}
function ye(n) {
  return [n[0], n[1]];
}
function jn(n, e) {
  const [t, i] = e[0], [s, r] = e[1], [o, a] = e[2], c = o - t, f = a - i, u = s - t, h = r - i, p = n[0] - t, g = n[1] - i, _ = c * c + f * f, v = c * u + f * h, R = c * p + f * g, C = u * u + h * h, m = u * p + h * g, y = _ * C - v * v;
  if (y === 0) return !1;
  const l = 1 / y, w = (C * R - v * m) * l, x = (_ * m - v * R) * l, I = 1e-9;
  return w >= -I && x >= -I && w + x <= 1 + I;
}
function zi(n) {
  const e = n.map((o) => o.slice()).filter(
    (o, a, c) => c.findIndex(
      (f) => hn(f[0], o[0]) && hn(f[1], o[1])
    ) === a
  );
  if (e.length <= 1) return e;
  const t = e.sort(
    (o, a) => o[0] === a[0] ? o[1] - a[1] : o[0] - a[0]
  ), i = (o, a, c) => (a[0] - o[0]) * (c[1] - o[1]) - (a[1] - o[1]) * (c[0] - o[0]), s = [];
  for (const o of t) {
    for (; s.length >= 2 && i(
      s[s.length - 2],
      s[s.length - 1],
      o
    ) <= 0; )
      s.pop();
    s.push(o);
  }
  const r = [];
  for (let o = t.length - 1; o >= 0; o--) {
    const a = t[o];
    for (; r.length >= 2 && i(
      r[r.length - 2],
      r[r.length - 1],
      a
    ) <= 0; )
      r.pop();
    r.push(a);
  }
  return r.pop(), s.pop(), s.concat(r);
}
function Wi(n) {
  if (n.length < 3) return 0;
  let e = 0;
  for (let t = 0; t < n.length; t++) {
    const [i, s] = n[t], [r, o] = n[(t + 1) % n.length];
    e += i * o - r * s;
  }
  return Math.abs(e) / 2;
}
function qn(n, e, t) {
  return Math.abs(
    (n[0] * (e[1] - t[1]) + e[0] * (t[1] - n[1]) + t[0] * (n[1] - e[1])) / 2
  );
}
function hn(n, e, t = 1e-9) {
  return Math.abs(n - e) <= t;
}
const Un = 3;
class Pt extends Ut.Transform {
  /**
   * Tinクラスのインスタンスを生成します
   * @param options - 初期化オプション
   */
  constructor(t = {}) {
    super();
    bt(this, "importance");
    bt(this, "priority");
    bt(this, "pointsSet");
    bt(this, "useV2Algorithm");
    t.bounds ? this.setBounds(t.bounds) : (this.setWh(t.wh), this.vertexMode = t.vertexMode || Pt.VERTEX_PLAIN), this.strictMode = t.strictMode || Pt.MODE_AUTO, this.yaxisMode = t.yaxisMode || Pt.YAXIS_INVERT, this.importance = t.importance || 0, this.priority = t.priority || 0, this.stateFull = t.stateFull || !1, this.useV2Algorithm = t.useV2Algorithm ?? !1, t.points && this.setPoints(t.points), t.edges && this.setEdges(t.edges);
  }
  /**
   * フォーマットバージョンを取得します
   */
  getFormatVersion() {
    return this.useV2Algorithm ? Ut.format_version : Un;
  }
  /**
   * 制御点（GCP: Ground Control Points）を設定します。
   * 指定した点群に合わせて内部のTINキャッシュをリセットします。
   */
  setPoints(t) {
    this.yaxisMode === Pt.YAXIS_FOLLOW && (t = t.map((i) => [
      i[0],
      [i[1][0], -1 * i[1][1]]
    ])), this.points = t, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * エッジ（制約線）を設定します。
   * 制約線を正規化した上で、依存するキャッシュをリセットします。
   */
  setEdges(t = []) {
    this.edges = Ut.normalizeEdges(t), this.edgeNodes = void 0, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 境界ポリゴンを設定します
   */
  setBounds(t) {
    this.bounds = t;
    let i = t[0][0], s = i, r = t[0][1], o = r;
    const a = [t[0]];
    for (let c = 1; c < t.length; c++) {
      const f = t[c];
      f[0] < i && (i = f[0]), f[0] > s && (s = f[0]), f[1] < r && (r = f[1]), f[1] > o && (o = f[1]), a.push(f);
    }
    a.push(t[0]), this.boundsPolygon = xe([a]), this.xy = [i, r], this.wh = [s - i, o - r], this.vertexMode = Pt.VERTEX_PLAIN, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 現在の設定を永続化可能な形式にコンパイルします
   */
  getCompiled() {
    var s;
    const t = {};
    t.version = this.useV2Algorithm ? Ut.format_version : Un, t.points = this.points, t.weight_buffer = this.pointsWeightBuffer ?? {}, t.centroid_point = [
      this.centroid.forw.geometry.coordinates,
      this.centroid.forw.properties.target.geom
    ], t.vertices_params = [
      this.vertices_params.forw[0],
      this.vertices_params.bakw[0]
    ], t.vertices_points = [];
    const i = this.vertices_params.forw[1];
    if (i)
      for (let r = 0; r < i.length; r++) {
        const o = i[r].features[0], a = o.geometry.coordinates[0][1], c = o.properties.b.geom;
        t.vertices_points[r] = [a, c];
      }
    return t.strict_status = this.strict_status, t.tins_points = [[]], this.tins.forw.features.map((r) => {
      t.tins_points[0].push(
        ["a", "b", "c"].map(
          (o) => r.properties[o].index
        )
      );
    }), this.strict_status === Pt.STATUS_LOOSE ? (t.tins_points[1] = [], this.tins.bakw.features.map((r) => {
      t.tins_points[1].push(
        ["a", "b", "c"].map(
          (o) => r.properties[o].index
        )
      );
    })) : this.strict_status === Pt.STATUS_ERROR && ((s = this.kinks) != null && s.bakw) && (t.kinks_points = this.kinks.bakw.features.map(
      (r) => r.geometry.coordinates
    )), t.yaxisMode = this.yaxisMode, t.vertexMode = this.vertexMode, t.strictMode = this.strictMode, this.bounds ? (t.bounds = this.bounds, t.boundsPolygon = this.boundsPolygon, t.xy = this.xy, t.wh = this.wh) : t.wh = this.wh, t.edges = this.edges ?? [], t.edgeNodes = this.edgeNodes ?? [], t;
  }
  /**
   * コンパイルされた設定を適用します（v3+フォーマット対応）
   *
   * バージョン3以上のコンパイル済みデータが渡された場合は restoreV3State() を
   * 使用してN頂点対応の復元を行います。それ以外は基底クラスの実装に委譲します。
   */
  setCompiled(t) {
    const i = t.version;
    if (typeof i == "number" && i >= 3) {
      const s = bi(t);
      this.points = s.points, this.pointsWeightBuffer = s.pointsWeightBuffer, this.strict_status = s.strictStatus, this.vertices_params = s.verticesParams, this.centroid = s.centroid, this.edges = s.edges, this.edgeNodes = s.edgeNodes || [], this.tins = s.tins, this.addIndexedTin(), this.kinks = s.kinks, this.yaxisMode = s.yaxisMode ?? Pt.YAXIS_INVERT, this.vertexMode = s.vertexMode ?? Pt.VERTEX_PLAIN, this.strictMode = s.strictMode ?? Pt.MODE_AUTO, s.bounds ? (this.bounds = s.bounds, this.boundsPolygon = s.boundsPolygon, this.xy = s.xy, this.wh = s.wh) : (this.bounds = void 0, this.boundsPolygon = void 0, this.xy = s.xy ?? [0, 0], s.wh && (this.wh = s.wh));
      return;
    }
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
  calcurateStrictTin() {
    var r;
    const t = this.tins.forw.features.map(
      (o) => Ut.counterTri(o)
    );
    this.tins.bakw = Vt(t);
    const i = {};
    this.tins.forw.features.forEach((o, a) => {
      const c = this.tins.bakw.features[a];
      or(i, { forw: o, bakw: c });
    }), Ui(
      this.tins,
      i,
      ((r = this.pointsSet) == null ? void 0 : r.edges) || []
    );
    const s = ["forw", "bakw"].map((o) => {
      const a = this.tins[o].features.map(
        (c) => c.geometry.coordinates[0]
      );
      return vi(a);
    });
    s[0].length === 0 && s[1].length === 0 ? (this.strict_status = Pt.STATUS_STRICT, delete this.kinks) : (this.strict_status = Pt.STATUS_ERROR, this.kinks = {
      forw: Vt(s[0]),
      bakw: Vt(s[1])
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
      const o = this.points[r][0], a = this.points[r][1], c = Ve(o, a, r);
      t.forw.push(c), t.bakw.push(je(c));
    }
    const i = [];
    let s = 0;
    this.edgeNodes = [], this.edges || (this.edges = []);
    for (let r = 0; r < this.edges.length; r++) {
      const o = this.edges[r][2], a = Object.assign([], this.edges[r][0]), c = Object.assign([], this.edges[r][1]);
      if (a.length === 0 && c.length === 0) {
        i.push(o);
        continue;
      }
      a.unshift(this.points[o[0]][0]), a.push(this.points[o[1]][0]), c.unshift(this.points[o[0]][1]), c.push(this.points[o[1]][1]);
      const f = [a, c].map((u) => {
        const h = u.map((g, _, v) => {
          if (_ === 0) return 0;
          const R = v[_ - 1];
          return Math.sqrt(
            Math.pow(g[0] - R[0], 2) + Math.pow(g[1] - R[1], 2)
          );
        }), p = h.reduce((g, _, v) => v === 0 ? [0] : (g.push(g[v - 1] + _), g), []);
        return p.map((g, _, v) => {
          const R = g / v[v.length - 1];
          return [u[_], h[_], p[_], R];
        });
      });
      f.map((u, h) => {
        const p = f[h ? 0 : 1];
        return u.filter((g, _) => !(_ === 0 || _ === u.length - 1 || g[4] === "handled")).flatMap((g) => {
          const _ = g[0], v = g[3], R = p.reduce(
            (C, m, y, l) => {
              if (C) return C;
              const w = l[y + 1];
              if (m[3] === v)
                return m[4] = "handled", [m];
              if (m[3] < v && w && w[3] > v)
                return [m, w];
            },
            void 0
          );
          if (R && R.length === 1)
            return h === 0 ? [[_, R[0][0], v]] : [[R[0][0], _, v]];
          if (R && R.length === 2) {
            const C = R[0], m = R[1], y = (v - C[3]) / (m[3] - C[3]), l = [
              (m[0][0] - C[0][0]) * y + C[0][0],
              (m[0][1] - C[0][1]) * y + C[0][1]
            ];
            return h === 0 ? [[_, l, v]] : [[l, _, v]];
          }
          return [];
        });
      }).reduce((u, h) => u.concat(h), []).sort((u, h) => u[2] < h[2] ? -1 : 1).map((u, h, p) => {
        this.edgeNodes[s] = [
          u[0],
          u[1]
        ];
        const g = Ve(
          u[0],
          u[1],
          `e${s}`
        );
        s++, t.forw.push(g), t.bakw.push(je(g)), h === 0 ? i.push([o[0], t.forw.length - 1]) : i.push([
          t.forw.length - 2,
          t.forw.length - 1
        ]), h === p.length - 1 && i.push([t.forw.length - 1, o[1]]);
      });
    }
    return {
      forw: t.forw,
      bakw: t.bakw,
      edges: i
    };
  }
  /**
   * 入力データの検証と初期データの準備
   */
  validateAndPrepareInputs() {
    const t = this.xy[0] - 0.05 * this.wh[0], i = this.xy[0] + 1.05 * this.wh[0], s = this.xy[1] - 0.05 * this.wh[1], r = this.xy[1] + 1.05 * this.wh[1];
    if (!this.points.reduce((c, f) => c && (this.bounds ? bn(f[0], this.boundsPolygon) : f[0][0] >= t && f[0][0] <= i && f[0][1] >= s && f[0][1] <= r), !0))
      throw "SOME POINTS OUTSIDE";
    let a = [];
    return this.wh && (a = [[t, s], [i, s], [t, r], [i, r]]), {
      pointsSet: this.generatePointsSet(),
      bbox: a,
      minx: t,
      maxx: i,
      miny: s,
      maxy: r
    };
  }
  /**
   * TINネットワークを同期的に更新し、座標変換の準備を行います。
   * 重めの計算を伴うため、呼び出し側が非同期制御を行いたい場合は
   * {@link updateTinAsync} を利用してください。
   */
  updateTin() {
    let t = this.strictMode;
    t !== Pt.MODE_STRICT && t !== Pt.MODE_LOOSE && (t = Pt.MODE_AUTO);
    const i = !this.useV2Algorithm && !this.bounds && this.vertexMode !== Pt.VERTEX_BIRDEYE;
    let s, r, o, a, c, f;
    if (i) {
      s = this.generatePointsSet();
      let A = 1 / 0, N = -1 / 0, Y = 1 / 0, q = -1 / 0;
      for (const M of this.points) {
        const B = M[0][0], X = M[0][1];
        B < A && (A = B), B > N && (N = B), X < Y && (Y = X), X > q && (q = X);
      }
      const d = N - A, k = q - Y;
      o = A - 0.05 * d, a = N + 0.05 * d, c = Y - 0.05 * k, f = q + 0.05 * k, r = [[o, c], [a, c], [o, f], [a, f]];
    } else {
      const A = this.validateAndPrepareInputs();
      s = A.pointsSet, r = A.bbox, o = A.minx, a = A.maxx, c = A.miny, f = A.maxy;
    }
    const u = {
      forw: Vt(s.forw),
      bakw: Vt(s.bakw)
    }, h = Fe(
      u.forw,
      s.edges,
      "target"
    ), p = Fe(
      u.bakw,
      s.edges,
      "target"
    );
    if (h.features.length === 0 || p.features.length === 0)
      throw "TOO LINEAR1";
    const g = Xr(u.forw), _ = In(u.forw);
    if (!_) throw "TOO LINEAR2";
    const v = {}, R = _.geometry.coordinates[0];
    let C;
    try {
      C = R.map((A) => ({
        forw: A,
        bakw: Ut.transformArr(Qt(A), h)
      })), C.forEach((A) => {
        v[`${A.forw[0]}:${A.forw[1]}`] = A;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const m = In(u.bakw);
    if (!m) throw "TOO LINEAR2";
    const y = m.geometry.coordinates[0];
    try {
      C = y.map((A) => ({
        bakw: A,
        forw: Ut.transformArr(Qt(A), p)
      })), C.forEach((A) => {
        v[`${A.forw[0]}:${A.forw[1]}`] = A;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    let l;
    if (i) {
      const A = g.geometry.coordinates, N = h.features.find(
        (Y) => bn(
          Qt(A),
          Y
        )
      );
      if (N) {
        const Y = N.geometry.coordinates[0], q = N.properties.a.geom, d = N.properties.b.geom, k = N.properties.c.geom;
        l = {
          forw: [
            (Y[0][0] + Y[1][0] + Y[2][0]) / 3,
            (Y[0][1] + Y[1][1] + Y[2][1]) / 3
          ],
          bakw: [
            (q[0] + d[0] + k[0]) / 3,
            (q[1] + d[1] + k[1]) / 3
          ]
        };
      } else
        l = {
          forw: A,
          bakw: Ut.transformArr(g, h)
        };
    } else
      l = {
        forw: g.geometry.coordinates,
        bakw: Ut.transformArr(g, h)
      };
    const w = Ve(l.forw, l.bakw, "c");
    this.centroid = {
      forw: w,
      bakw: je(w)
    };
    let x;
    if (i) {
      const A = this.points.map((N) => ({ forw: N[0], bakw: N[1] }));
      x = li({
        convexBuf: v,
        centroid: l,
        allGcps: A,
        minx: o,
        maxx: a,
        miny: c,
        maxy: f
      });
    } else {
      const A = {
        convexBuf: v,
        centroid: l,
        bbox: r,
        minx: o,
        maxx: a,
        miny: c,
        maxy: f
      };
      x = this.vertexMode === Pt.VERTEX_BIRDEYE ? ci(A) : ai(A);
    }
    const I = {
      forw: [],
      bakw: []
    };
    for (let A = 0; A < x.length; A++) {
      const N = x[A].forw, Y = x[A].bakw, q = Ve(N, Y, `b${A}`), d = je(q);
      s.forw.push(q), s.bakw.push(d), I.forw.push(q), I.bakw.push(d);
    }
    this.pointsSet = {
      forw: Vt(s.forw),
      bakw: Vt(s.bakw),
      edges: s.edges
    }, this.tins = {
      forw: Ut.rotateVerticesTriangle(
        Fe(
          this.pointsSet.forw,
          s.edges,
          "target"
        )
      )
    }, (t === Pt.MODE_STRICT || t === Pt.MODE_AUTO) && this.calcurateStrictTin(), (t === Pt.MODE_LOOSE || t === Pt.MODE_AUTO && this.strict_status === Pt.STATUS_ERROR) && (this.tins.bakw = Ut.rotateVerticesTriangle(
      Fe(
        this.pointsSet.bakw,
        s.edges,
        "target"
      )
    ), delete this.kinks, this.strict_status = Pt.STATUS_LOOSE), this.vertices_params = {
      forw: Vn(I.forw, this.centroid.forw),
      bakw: Vn(I.bakw, this.centroid.bakw)
    }, this.addIndexedTin();
    const T = ["forw"];
    this.strict_status === Pt.STATUS_LOOSE && T.push("bakw");
    const S = this.strict_status === Pt.STATUS_STRICT;
    this.pointsWeightBuffer = ji({
      tins: this.tins,
      targets: T,
      includeReciprocals: S,
      numBoundaryVertices: x.length
    });
  }
  /**
   * 非同期ラッパーを提供します。
   * 互換性のために Promise ベースの API を維持しますが、内部処理は同期的です。
   */
  async updateTinAsync() {
    this.updateTin();
  }
}
const Ki = Ut.format_version;
export {
  Pt as Tin,
  Fe as constrainedTin,
  je as counterPoint,
  Ve as createPoint,
  Pt as default,
  vi as findIntersections,
  Ki as format_version,
  or as insertSearchIndex,
  Vn as vertexCalc
};
