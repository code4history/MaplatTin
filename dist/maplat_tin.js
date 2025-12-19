var tr = Object.defineProperty;
var er = (s, e, t) => e in s ? tr(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var bt = (s, e, t) => er(s, typeof e != "symbol" ? e + "" : e, t);
function Ae(s, e, t = {}) {
  const n = { type: "Feature" };
  return (t.id === 0 || t.id) && (n.id = t.id), t.bbox && (n.bbox = t.bbox), n.properties = e || {}, n.geometry = s, n;
}
function ge(s, e, t = {}) {
  if (!s)
    throw new Error("coordinates is required");
  if (!Array.isArray(s))
    throw new Error("coordinates must be an Array");
  if (s.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!dn(s[0]) || !dn(s[1]))
    throw new Error("coordinates must contain numbers");
  return Ae({
    type: "Point",
    coordinates: s
  }, e, t);
}
function Be(s, e, t = {}) {
  for (const i of s) {
    if (i.length < 4)
      throw new Error(
        "Each LinearRing of a Polygon must have 4 or more Positions."
      );
    if (i[i.length - 1].length !== i[0].length)
      throw new Error("First and last Position are not equivalent.");
    for (let r = 0; r < i[i.length - 1].length; r++)
      if (i[i.length - 1][r] !== i[0][r])
        throw new Error("First and last Position are not equivalent.");
  }
  return Ae({
    type: "Polygon",
    coordinates: s
  }, e, t);
}
function pn(s, e, t = {}) {
  if (s.length < 2)
    throw new Error("coordinates must be an array of two or more positions");
  return Ae({
    type: "LineString",
    coordinates: s
  }, e, t);
}
function Gt(s, e = {}) {
  const t = { type: "FeatureCollection" };
  return e.id && (t.id = e.id), e.bbox && (t.bbox = e.bbox), t.features = s, t;
}
function dn(s) {
  return !isNaN(s) && s !== null && !Array.isArray(s);
}
function nr(s) {
  if (!s)
    throw new Error("coord is required");
  if (!Array.isArray(s)) {
    if (s.type === "Feature" && s.geometry !== null && s.geometry.type === "Point")
      return [...s.geometry.coordinates];
    if (s.type === "Point")
      return [...s.coordinates];
  }
  if (Array.isArray(s) && s.length >= 2 && !Array.isArray(s[0]) && !Array.isArray(s[1]))
    return [...s];
  throw new Error("coord must be GeoJSON Point or an Array of numbers");
}
function rr(s) {
  return s.type === "Feature" ? s.geometry : s;
}
function hn(s, e, t) {
  if (s !== null)
    for (var n, i, r, o, a, c, h, u = 0, f = 0, g, m = s.type, x = m === "FeatureCollection", b = m === "Feature", Y = x ? s.features.length : 1, R = 0; R < Y; R++) {
      h = x ? s.features[R].geometry : b ? s.geometry : s, g = h ? h.type === "GeometryCollection" : !1, a = g ? h.geometries.length : 1;
      for (var d = 0; d < a; d++) {
        var y = 0, l = 0;
        if (o = g ? h.geometries[d] : h, o !== null) {
          c = o.coordinates;
          var v = o.type;
          switch (u = t && (v === "Polygon" || v === "MultiPolygon") ? 1 : 0, v) {
            case null:
              break;
            case "Point":
              if (e(
                c,
                f,
                R,
                y,
                l
              ) === !1)
                return !1;
              f++, y++;
              break;
            case "LineString":
            case "MultiPoint":
              for (n = 0; n < c.length; n++) {
                if (e(
                  c[n],
                  f,
                  R,
                  y,
                  l
                ) === !1)
                  return !1;
                f++, v === "MultiPoint" && y++;
              }
              v === "LineString" && y++;
              break;
            case "Polygon":
            case "MultiLineString":
              for (n = 0; n < c.length; n++) {
                for (i = 0; i < c[n].length - u; i++) {
                  if (e(
                    c[n][i],
                    f,
                    R,
                    y,
                    l
                  ) === !1)
                    return !1;
                  f++;
                }
                v === "MultiLineString" && y++, v === "Polygon" && l++;
              }
              v === "Polygon" && y++;
              break;
            case "MultiPolygon":
              for (n = 0; n < c.length; n++) {
                for (l = 0, i = 0; i < c[n].length; i++) {
                  for (r = 0; r < c[n][i].length - u; r++) {
                    if (e(
                      c[n][i][r],
                      f,
                      R,
                      y,
                      l
                    ) === !1)
                      return !1;
                    f++;
                  }
                  l++;
                }
                y++;
              }
              break;
            case "GeometryCollection":
              for (n = 0; n < o.geometries.length; n++)
                if (hn(o.geometries[n], e, t) === !1)
                  return !1;
              break;
            default:
              throw new Error("Unknown Geometry Type");
          }
        }
      }
    }
}
const Ft = 11102230246251565e-32, rt = 134217729, Ln = (3 + 8 * Ft) * Ft;
function Rt(s, e, t, n, i) {
  let r, o, a, c, h = e[0], u = n[0], f = 0, g = 0;
  u > h == u > -h ? (r = h, h = e[++f]) : (r = u, u = n[++g]);
  let m = 0;
  if (f < s && g < t)
    for (u > h == u > -h ? (o = h + r, a = r - (o - h), h = e[++f]) : (o = u + r, a = r - (o - u), u = n[++g]), r = o, a !== 0 && (i[m++] = a); f < s && g < t; )
      u > h == u > -h ? (o = r + h, c = o - r, a = r - (o - c) + (h - c), h = e[++f]) : (o = r + u, c = o - r, a = r - (o - c) + (u - c), u = n[++g]), r = o, a !== 0 && (i[m++] = a);
  for (; f < s; )
    o = r + h, c = o - r, a = r - (o - c) + (h - c), h = e[++f], r = o, a !== 0 && (i[m++] = a);
  for (; g < t; )
    o = r + u, c = o - r, a = r - (o - c) + (u - c), u = n[++g], r = o, a !== 0 && (i[m++] = a);
  return (r !== 0 || m === 0) && (i[m++] = r), m;
}
function Ut(s, e, t, n, i, r, o, a) {
  return Rt(Rt(s, e, t, n, o), o, i, r, a);
}
function j(s, e, t, n) {
  let i, r, o, a, c, h, u, f, g, m, x;
  u = rt * t, m = u - (u - t), x = t - m;
  let b = e[0];
  i = b * t, u = rt * b, f = u - (u - b), g = b - f, o = g * x - (i - f * m - g * m - f * x);
  let Y = 0;
  o !== 0 && (n[Y++] = o);
  for (let R = 1; R < s; R++)
    b = e[R], a = b * t, u = rt * b, f = u - (u - b), g = b - f, c = g * x - (a - f * m - g * m - f * x), r = i + c, h = r - i, o = i - (r - h) + (c - h), o !== 0 && (n[Y++] = o), i = a + r, o = r - (i - a), o !== 0 && (n[Y++] = o);
  return (i !== 0 || Y === 0) && (n[Y++] = i), Y;
}
function Dn(s, e) {
  let t = e[0];
  for (let n = 1; n < s; n++) t += e[n];
  return t;
}
function vt(s) {
  return new Float64Array(s);
}
const ir = (3 + 16 * Ft) * Ft, sr = (2 + 12 * Ft) * Ft, or = (9 + 64 * Ft) * Ft * Ft, we = vt(4), mn = vt(8), gn = vt(12), wn = vt(16), Lt = vt(4);
function ar(s, e, t, n, i, r, o) {
  let a, c, h, u, f, g, m, x, b, Y, R, d, y, l, v, M, A, T;
  const S = s - i, O = t - i, X = e - r, L = n - r;
  l = S * L, g = rt * S, m = g - (g - S), x = S - m, g = rt * L, b = g - (g - L), Y = L - b, v = x * Y - (l - m * b - x * b - m * Y), M = X * O, g = rt * X, m = g - (g - X), x = X - m, g = rt * O, b = g - (g - O), Y = O - b, A = x * Y - (M - m * b - x * b - m * Y), R = v - A, f = v - R, we[0] = v - (R + f) + (f - A), d = l + R, f = d - l, y = l - (d - f) + (R - f), R = y - M, f = y - R, we[1] = y - (R + f) + (f - M), T = d + R, f = T - d, we[2] = d - (T - f) + (R - f), we[3] = T;
  let K = Dn(4, we), p = sr * o;
  if (K >= p || -K >= p || (f = s - S, a = s - (S + f) + (f - i), f = t - O, h = t - (O + f) + (f - i), f = e - X, c = e - (X + f) + (f - r), f = n - L, u = n - (L + f) + (f - r), a === 0 && c === 0 && h === 0 && u === 0) || (p = or * o + Ln * Math.abs(K), K += S * u + L * a - (X * h + O * c), K >= p || -K >= p)) return K;
  l = a * L, g = rt * a, m = g - (g - a), x = a - m, g = rt * L, b = g - (g - L), Y = L - b, v = x * Y - (l - m * b - x * b - m * Y), M = c * O, g = rt * c, m = g - (g - c), x = c - m, g = rt * O, b = g - (g - O), Y = O - b, A = x * Y - (M - m * b - x * b - m * Y), R = v - A, f = v - R, Lt[0] = v - (R + f) + (f - A), d = l + R, f = d - l, y = l - (d - f) + (R - f), R = y - M, f = y - R, Lt[1] = y - (R + f) + (f - M), T = d + R, f = T - d, Lt[2] = d - (T - f) + (R - f), Lt[3] = T;
  const E = Rt(4, we, 4, Lt, mn);
  l = S * u, g = rt * S, m = g - (g - S), x = S - m, g = rt * u, b = g - (g - u), Y = u - b, v = x * Y - (l - m * b - x * b - m * Y), M = X * h, g = rt * X, m = g - (g - X), x = X - m, g = rt * h, b = g - (g - h), Y = h - b, A = x * Y - (M - m * b - x * b - m * Y), R = v - A, f = v - R, Lt[0] = v - (R + f) + (f - A), d = l + R, f = d - l, y = l - (d - f) + (R - f), R = y - M, f = y - R, Lt[1] = y - (R + f) + (f - M), T = d + R, f = T - d, Lt[2] = d - (T - f) + (R - f), Lt[3] = T;
  const _ = Rt(E, mn, 4, Lt, gn);
  l = a * u, g = rt * a, m = g - (g - a), x = a - m, g = rt * u, b = g - (g - u), Y = u - b, v = x * Y - (l - m * b - x * b - m * Y), M = c * h, g = rt * c, m = g - (g - c), x = c - m, g = rt * h, b = g - (g - h), Y = h - b, A = x * Y - (M - m * b - x * b - m * Y), R = v - A, f = v - R, Lt[0] = v - (R + f) + (f - A), d = l + R, f = d - l, y = l - (d - f) + (R - f), R = y - M, f = y - R, Lt[1] = y - (R + f) + (f - M), T = d + R, f = T - d, Lt[2] = d - (T - f) + (R - f), Lt[3] = T;
  const I = Rt(_, gn, 4, Lt, wn);
  return wn[I - 1];
}
function ne(s, e, t, n, i, r) {
  const o = (e - r) * (t - i), a = (s - i) * (n - r), c = o - a, h = Math.abs(o + a);
  return Math.abs(c) >= ir * h ? c : -ar(s, e, t, n, i, r, h);
}
const cr = (10 + 96 * Ft) * Ft, hr = (4 + 48 * Ft) * Ft, fr = (44 + 576 * Ft) * Ft * Ft, se = vt(4), oe = vt(4), ae = vt(4), Ht = vt(4), Zt = vt(4), te = vt(4), Dt = vt(4), $t = vt(4), Qe = vt(8), He = vt(8), Ze = vt(8), tn = vt(8), en = vt(8), nn = vt(8), Ie = vt(8), Te = vt(8), Ne = vt(8), le = vt(4), pe = vt(4), de = vt(4), ot = vt(8), pt = vt(16), kt = vt(16), Et = vt(16), _t = vt(32), ce = vt(32), It = vt(48), jt = vt(64);
let be = vt(1152), rn = vt(1152);
function Tt(s, e, t) {
  s = Rt(s, be, e, t, rn);
  const n = be;
  return be = rn, rn = n, s;
}
function ur(s, e, t, n, i, r, o, a, c) {
  let h, u, f, g, m, x, b, Y, R, d, y, l, v, M, A, T, S, O, X, L, K, p, E, _, I, N, D, w, B, F, q, U, z, Q, V;
  const ht = s - o, ct = t - o, ut = i - o, dt = e - a, gt = n - a, mt = r - a;
  q = ct * mt, E = rt * ct, _ = E - (E - ct), I = ct - _, E = rt * mt, N = E - (E - mt), D = mt - N, U = I * D - (q - _ * N - I * N - _ * D), z = ut * gt, E = rt * ut, _ = E - (E - ut), I = ut - _, E = rt * gt, N = E - (E - gt), D = gt - N, Q = I * D - (z - _ * N - I * N - _ * D), w = U - Q, p = U - w, se[0] = U - (w + p) + (p - Q), B = q + w, p = B - q, F = q - (B - p) + (w - p), w = F - z, p = F - w, se[1] = F - (w + p) + (p - z), V = B + w, p = V - B, se[2] = B - (V - p) + (w - p), se[3] = V, q = ut * dt, E = rt * ut, _ = E - (E - ut), I = ut - _, E = rt * dt, N = E - (E - dt), D = dt - N, U = I * D - (q - _ * N - I * N - _ * D), z = ht * mt, E = rt * ht, _ = E - (E - ht), I = ht - _, E = rt * mt, N = E - (E - mt), D = mt - N, Q = I * D - (z - _ * N - I * N - _ * D), w = U - Q, p = U - w, oe[0] = U - (w + p) + (p - Q), B = q + w, p = B - q, F = q - (B - p) + (w - p), w = F - z, p = F - w, oe[1] = F - (w + p) + (p - z), V = B + w, p = V - B, oe[2] = B - (V - p) + (w - p), oe[3] = V, q = ht * gt, E = rt * ht, _ = E - (E - ht), I = ht - _, E = rt * gt, N = E - (E - gt), D = gt - N, U = I * D - (q - _ * N - I * N - _ * D), z = ct * dt, E = rt * ct, _ = E - (E - ct), I = ct - _, E = rt * dt, N = E - (E - dt), D = dt - N, Q = I * D - (z - _ * N - I * N - _ * D), w = U - Q, p = U - w, ae[0] = U - (w + p) + (p - Q), B = q + w, p = B - q, F = q - (B - p) + (w - p), w = F - z, p = F - w, ae[1] = F - (w + p) + (p - z), V = B + w, p = V - B, ae[2] = B - (V - p) + (w - p), ae[3] = V, h = Rt(
    Rt(
      Rt(
        j(j(4, se, ht, ot), ot, ht, pt),
        pt,
        j(j(4, se, dt, ot), ot, dt, kt),
        kt,
        _t
      ),
      _t,
      Rt(
        j(j(4, oe, ct, ot), ot, ct, pt),
        pt,
        j(j(4, oe, gt, ot), ot, gt, kt),
        kt,
        ce
      ),
      ce,
      jt
    ),
    jt,
    Rt(
      j(j(4, ae, ut, ot), ot, ut, pt),
      pt,
      j(j(4, ae, mt, ot), ot, mt, kt),
      kt,
      _t
    ),
    _t,
    be
  );
  let Bt = Dn(h, be), Xt = hr * c;
  if (Bt >= Xt || -Bt >= Xt || (p = s - ht, u = s - (ht + p) + (p - o), p = e - dt, m = e - (dt + p) + (p - a), p = t - ct, f = t - (ct + p) + (p - o), p = n - gt, x = n - (gt + p) + (p - a), p = i - ut, g = i - (ut + p) + (p - o), p = r - mt, b = r - (mt + p) + (p - a), u === 0 && f === 0 && g === 0 && m === 0 && x === 0 && b === 0) || (Xt = fr * c + Ln * Math.abs(Bt), Bt += (ht * ht + dt * dt) * (ct * b + mt * f - (gt * g + ut * x)) + 2 * (ht * u + dt * m) * (ct * mt - gt * ut) + ((ct * ct + gt * gt) * (ut * m + dt * g - (mt * u + ht * b)) + 2 * (ct * f + gt * x) * (ut * dt - mt * ht)) + ((ut * ut + mt * mt) * (ht * x + gt * u - (dt * f + ct * m)) + 2 * (ut * g + mt * b) * (ht * gt - dt * ct)), Bt >= Xt || -Bt >= Xt))
    return Bt;
  if ((f !== 0 || x !== 0 || g !== 0 || b !== 0) && (q = ht * ht, E = rt * ht, _ = E - (E - ht), I = ht - _, U = I * I - (q - _ * _ - (_ + _) * I), z = dt * dt, E = rt * dt, _ = E - (E - dt), I = dt - _, Q = I * I - (z - _ * _ - (_ + _) * I), w = U + Q, p = w - U, Ht[0] = U - (w - p) + (Q - p), B = q + w, p = B - q, F = q - (B - p) + (w - p), w = F + z, p = w - F, Ht[1] = F - (w - p) + (z - p), V = B + w, p = V - B, Ht[2] = B - (V - p) + (w - p), Ht[3] = V), (g !== 0 || b !== 0 || u !== 0 || m !== 0) && (q = ct * ct, E = rt * ct, _ = E - (E - ct), I = ct - _, U = I * I - (q - _ * _ - (_ + _) * I), z = gt * gt, E = rt * gt, _ = E - (E - gt), I = gt - _, Q = I * I - (z - _ * _ - (_ + _) * I), w = U + Q, p = w - U, Zt[0] = U - (w - p) + (Q - p), B = q + w, p = B - q, F = q - (B - p) + (w - p), w = F + z, p = w - F, Zt[1] = F - (w - p) + (z - p), V = B + w, p = V - B, Zt[2] = B - (V - p) + (w - p), Zt[3] = V), (u !== 0 || m !== 0 || f !== 0 || x !== 0) && (q = ut * ut, E = rt * ut, _ = E - (E - ut), I = ut - _, U = I * I - (q - _ * _ - (_ + _) * I), z = mt * mt, E = rt * mt, _ = E - (E - mt), I = mt - _, Q = I * I - (z - _ * _ - (_ + _) * I), w = U + Q, p = w - U, te[0] = U - (w - p) + (Q - p), B = q + w, p = B - q, F = q - (B - p) + (w - p), w = F + z, p = w - F, te[1] = F - (w - p) + (z - p), V = B + w, p = V - B, te[2] = B - (V - p) + (w - p), te[3] = V), u !== 0 && (Y = j(4, se, u, Qe), h = Tt(h, Ut(
    j(Y, Qe, 2 * ht, pt),
    pt,
    j(j(4, te, u, ot), ot, gt, kt),
    kt,
    j(j(4, Zt, u, ot), ot, -mt, Et),
    Et,
    _t,
    It
  ), It)), m !== 0 && (R = j(4, se, m, He), h = Tt(h, Ut(
    j(R, He, 2 * dt, pt),
    pt,
    j(j(4, Zt, m, ot), ot, ut, kt),
    kt,
    j(j(4, te, m, ot), ot, -ct, Et),
    Et,
    _t,
    It
  ), It)), f !== 0 && (d = j(4, oe, f, Ze), h = Tt(h, Ut(
    j(d, Ze, 2 * ct, pt),
    pt,
    j(j(4, Ht, f, ot), ot, mt, kt),
    kt,
    j(j(4, te, f, ot), ot, -dt, Et),
    Et,
    _t,
    It
  ), It)), x !== 0 && (y = j(4, oe, x, tn), h = Tt(h, Ut(
    j(y, tn, 2 * gt, pt),
    pt,
    j(j(4, te, x, ot), ot, ht, kt),
    kt,
    j(j(4, Ht, x, ot), ot, -ut, Et),
    Et,
    _t,
    It
  ), It)), g !== 0 && (l = j(4, ae, g, en), h = Tt(h, Ut(
    j(l, en, 2 * ut, pt),
    pt,
    j(j(4, Zt, g, ot), ot, dt, kt),
    kt,
    j(j(4, Ht, g, ot), ot, -gt, Et),
    Et,
    _t,
    It
  ), It)), b !== 0 && (v = j(4, ae, b, nn), h = Tt(h, Ut(
    j(v, nn, 2 * mt, pt),
    pt,
    j(j(4, Ht, b, ot), ot, ct, kt),
    kt,
    j(j(4, Zt, b, ot), ot, -ht, Et),
    Et,
    _t,
    It
  ), It)), u !== 0 || m !== 0) {
    if (f !== 0 || x !== 0 || g !== 0 || b !== 0 ? (q = f * mt, E = rt * f, _ = E - (E - f), I = f - _, E = rt * mt, N = E - (E - mt), D = mt - N, U = I * D - (q - _ * N - I * N - _ * D), z = ct * b, E = rt * ct, _ = E - (E - ct), I = ct - _, E = rt * b, N = E - (E - b), D = b - N, Q = I * D - (z - _ * N - I * N - _ * D), w = U + Q, p = w - U, Dt[0] = U - (w - p) + (Q - p), B = q + w, p = B - q, F = q - (B - p) + (w - p), w = F + z, p = w - F, Dt[1] = F - (w - p) + (z - p), V = B + w, p = V - B, Dt[2] = B - (V - p) + (w - p), Dt[3] = V, q = g * -gt, E = rt * g, _ = E - (E - g), I = g - _, E = rt * -gt, N = E - (E - -gt), D = -gt - N, U = I * D - (q - _ * N - I * N - _ * D), z = ut * -x, E = rt * ut, _ = E - (E - ut), I = ut - _, E = rt * -x, N = E - (E - -x), D = -x - N, Q = I * D - (z - _ * N - I * N - _ * D), w = U + Q, p = w - U, $t[0] = U - (w - p) + (Q - p), B = q + w, p = B - q, F = q - (B - p) + (w - p), w = F + z, p = w - F, $t[1] = F - (w - p) + (z - p), V = B + w, p = V - B, $t[2] = B - (V - p) + (w - p), $t[3] = V, A = Rt(4, Dt, 4, $t, Te), q = f * b, E = rt * f, _ = E - (E - f), I = f - _, E = rt * b, N = E - (E - b), D = b - N, U = I * D - (q - _ * N - I * N - _ * D), z = g * x, E = rt * g, _ = E - (E - g), I = g - _, E = rt * x, N = E - (E - x), D = x - N, Q = I * D - (z - _ * N - I * N - _ * D), w = U - Q, p = U - w, pe[0] = U - (w + p) + (p - Q), B = q + w, p = B - q, F = q - (B - p) + (w - p), w = F - z, p = F - w, pe[1] = F - (w + p) + (p - z), V = B + w, p = V - B, pe[2] = B - (V - p) + (w - p), pe[3] = V, O = 4) : (Te[0] = 0, A = 1, pe[0] = 0, O = 1), u !== 0) {
      const St = j(A, Te, u, Et);
      h = Tt(h, Rt(
        j(Y, Qe, u, pt),
        pt,
        j(St, Et, 2 * ht, _t),
        _t,
        It
      ), It);
      const Mt = j(O, pe, u, ot);
      h = Tt(h, Ut(
        j(Mt, ot, 2 * ht, pt),
        pt,
        j(Mt, ot, u, kt),
        kt,
        j(St, Et, u, _t),
        _t,
        ce,
        jt
      ), jt), x !== 0 && (h = Tt(h, j(j(4, te, u, ot), ot, x, pt), pt)), b !== 0 && (h = Tt(h, j(j(4, Zt, -u, ot), ot, b, pt), pt));
    }
    if (m !== 0) {
      const St = j(A, Te, m, Et);
      h = Tt(h, Rt(
        j(R, He, m, pt),
        pt,
        j(St, Et, 2 * dt, _t),
        _t,
        It
      ), It);
      const Mt = j(O, pe, m, ot);
      h = Tt(h, Ut(
        j(Mt, ot, 2 * dt, pt),
        pt,
        j(Mt, ot, m, kt),
        kt,
        j(St, Et, m, _t),
        _t,
        ce,
        jt
      ), jt);
    }
  }
  if (f !== 0 || x !== 0) {
    if (g !== 0 || b !== 0 || u !== 0 || m !== 0 ? (q = g * dt, E = rt * g, _ = E - (E - g), I = g - _, E = rt * dt, N = E - (E - dt), D = dt - N, U = I * D - (q - _ * N - I * N - _ * D), z = ut * m, E = rt * ut, _ = E - (E - ut), I = ut - _, E = rt * m, N = E - (E - m), D = m - N, Q = I * D - (z - _ * N - I * N - _ * D), w = U + Q, p = w - U, Dt[0] = U - (w - p) + (Q - p), B = q + w, p = B - q, F = q - (B - p) + (w - p), w = F + z, p = w - F, Dt[1] = F - (w - p) + (z - p), V = B + w, p = V - B, Dt[2] = B - (V - p) + (w - p), Dt[3] = V, L = -mt, K = -b, q = u * L, E = rt * u, _ = E - (E - u), I = u - _, E = rt * L, N = E - (E - L), D = L - N, U = I * D - (q - _ * N - I * N - _ * D), z = ht * K, E = rt * ht, _ = E - (E - ht), I = ht - _, E = rt * K, N = E - (E - K), D = K - N, Q = I * D - (z - _ * N - I * N - _ * D), w = U + Q, p = w - U, $t[0] = U - (w - p) + (Q - p), B = q + w, p = B - q, F = q - (B - p) + (w - p), w = F + z, p = w - F, $t[1] = F - (w - p) + (z - p), V = B + w, p = V - B, $t[2] = B - (V - p) + (w - p), $t[3] = V, T = Rt(4, Dt, 4, $t, Ne), q = g * m, E = rt * g, _ = E - (E - g), I = g - _, E = rt * m, N = E - (E - m), D = m - N, U = I * D - (q - _ * N - I * N - _ * D), z = u * b, E = rt * u, _ = E - (E - u), I = u - _, E = rt * b, N = E - (E - b), D = b - N, Q = I * D - (z - _ * N - I * N - _ * D), w = U - Q, p = U - w, de[0] = U - (w + p) + (p - Q), B = q + w, p = B - q, F = q - (B - p) + (w - p), w = F - z, p = F - w, de[1] = F - (w + p) + (p - z), V = B + w, p = V - B, de[2] = B - (V - p) + (w - p), de[3] = V, X = 4) : (Ne[0] = 0, T = 1, de[0] = 0, X = 1), f !== 0) {
      const St = j(T, Ne, f, Et);
      h = Tt(h, Rt(
        j(d, Ze, f, pt),
        pt,
        j(St, Et, 2 * ct, _t),
        _t,
        It
      ), It);
      const Mt = j(X, de, f, ot);
      h = Tt(h, Ut(
        j(Mt, ot, 2 * ct, pt),
        pt,
        j(Mt, ot, f, kt),
        kt,
        j(St, Et, f, _t),
        _t,
        ce,
        jt
      ), jt), b !== 0 && (h = Tt(h, j(j(4, Ht, f, ot), ot, b, pt), pt)), m !== 0 && (h = Tt(h, j(j(4, te, -f, ot), ot, m, pt), pt));
    }
    if (x !== 0) {
      const St = j(T, Ne, x, Et);
      h = Tt(h, Rt(
        j(y, tn, x, pt),
        pt,
        j(St, Et, 2 * gt, _t),
        _t,
        It
      ), It);
      const Mt = j(X, de, x, ot);
      h = Tt(h, Ut(
        j(Mt, ot, 2 * gt, pt),
        pt,
        j(Mt, ot, x, kt),
        kt,
        j(St, Et, x, _t),
        _t,
        ce,
        jt
      ), jt);
    }
  }
  if (g !== 0 || b !== 0) {
    if (u !== 0 || m !== 0 || f !== 0 || x !== 0 ? (q = u * gt, E = rt * u, _ = E - (E - u), I = u - _, E = rt * gt, N = E - (E - gt), D = gt - N, U = I * D - (q - _ * N - I * N - _ * D), z = ht * x, E = rt * ht, _ = E - (E - ht), I = ht - _, E = rt * x, N = E - (E - x), D = x - N, Q = I * D - (z - _ * N - I * N - _ * D), w = U + Q, p = w - U, Dt[0] = U - (w - p) + (Q - p), B = q + w, p = B - q, F = q - (B - p) + (w - p), w = F + z, p = w - F, Dt[1] = F - (w - p) + (z - p), V = B + w, p = V - B, Dt[2] = B - (V - p) + (w - p), Dt[3] = V, L = -dt, K = -m, q = f * L, E = rt * f, _ = E - (E - f), I = f - _, E = rt * L, N = E - (E - L), D = L - N, U = I * D - (q - _ * N - I * N - _ * D), z = ct * K, E = rt * ct, _ = E - (E - ct), I = ct - _, E = rt * K, N = E - (E - K), D = K - N, Q = I * D - (z - _ * N - I * N - _ * D), w = U + Q, p = w - U, $t[0] = U - (w - p) + (Q - p), B = q + w, p = B - q, F = q - (B - p) + (w - p), w = F + z, p = w - F, $t[1] = F - (w - p) + (z - p), V = B + w, p = V - B, $t[2] = B - (V - p) + (w - p), $t[3] = V, M = Rt(4, Dt, 4, $t, Ie), q = u * x, E = rt * u, _ = E - (E - u), I = u - _, E = rt * x, N = E - (E - x), D = x - N, U = I * D - (q - _ * N - I * N - _ * D), z = f * m, E = rt * f, _ = E - (E - f), I = f - _, E = rt * m, N = E - (E - m), D = m - N, Q = I * D - (z - _ * N - I * N - _ * D), w = U - Q, p = U - w, le[0] = U - (w + p) + (p - Q), B = q + w, p = B - q, F = q - (B - p) + (w - p), w = F - z, p = F - w, le[1] = F - (w + p) + (p - z), V = B + w, p = V - B, le[2] = B - (V - p) + (w - p), le[3] = V, S = 4) : (Ie[0] = 0, M = 1, le[0] = 0, S = 1), g !== 0) {
      const St = j(M, Ie, g, Et);
      h = Tt(h, Rt(
        j(l, en, g, pt),
        pt,
        j(St, Et, 2 * ut, _t),
        _t,
        It
      ), It);
      const Mt = j(S, le, g, ot);
      h = Tt(h, Ut(
        j(Mt, ot, 2 * ut, pt),
        pt,
        j(Mt, ot, g, kt),
        kt,
        j(St, Et, g, _t),
        _t,
        ce,
        jt
      ), jt), m !== 0 && (h = Tt(h, j(j(4, Zt, g, ot), ot, m, pt), pt)), x !== 0 && (h = Tt(h, j(j(4, Ht, -g, ot), ot, x, pt), pt));
    }
    if (b !== 0) {
      const St = j(M, Ie, b, Et);
      h = Tt(h, Rt(
        j(v, nn, b, pt),
        pt,
        j(St, Et, 2 * mt, _t),
        _t,
        It
      ), It);
      const Mt = j(S, le, b, ot);
      h = Tt(h, Ut(
        j(Mt, ot, 2 * mt, pt),
        pt,
        j(Mt, ot, b, kt),
        kt,
        j(St, Et, b, _t),
        _t,
        ce,
        jt
      ), jt);
    }
  }
  return be[h - 1];
}
function lr(s, e, t, n, i, r, o, a) {
  const c = s - o, h = t - o, u = i - o, f = e - a, g = n - a, m = r - a, x = h * m, b = u * g, Y = c * c + f * f, R = u * f, d = c * m, y = h * h + g * g, l = c * g, v = h * f, M = u * u + m * m, A = Y * (x - b) + y * (R - d) + M * (l - v), T = (Math.abs(x) + Math.abs(b)) * Y + (Math.abs(R) + Math.abs(d)) * y + (Math.abs(l) + Math.abs(v)) * M, S = cr * T;
  return A > S || -A > S ? A : ur(s, e, t, n, i, r, o, a, T);
}
function pr(s, e) {
  var t, n, i = 0, r, o, a, c, h, u, f, g = s[0], m = s[1], x = e.length;
  for (t = 0; t < x; t++) {
    n = 0;
    var b = e[t], Y = b.length - 1;
    if (u = b[0], u[0] !== b[Y][0] && u[1] !== b[Y][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (o = u[0] - g, a = u[1] - m, n; n < Y; n++) {
      if (f = b[n + 1], c = f[0] - g, h = f[1] - m, a === 0 && h === 0) {
        if (c <= 0 && o >= 0 || o <= 0 && c >= 0)
          return 0;
      } else if (h >= 0 && a <= 0 || h <= 0 && a >= 0) {
        if (r = ne(o, c, a, h, 0, 0), r === 0)
          return 0;
        (r > 0 && h > 0 && a <= 0 || r < 0 && h <= 0 && a > 0) && i++;
      }
      u = f, a = h, o = c;
    }
  }
  return i % 2 !== 0;
}
function dr(s, e, t = {}) {
  if (!s)
    throw new Error("point is required");
  if (!e)
    throw new Error("polygon is required");
  const n = nr(s), i = rr(e), r = i.type, o = e.bbox;
  let a = i.coordinates;
  if (o && mr(n, o) === !1)
    return !1;
  r === "Polygon" && (a = [a]);
  let c = !1;
  for (var h = 0; h < a.length; ++h) {
    const u = pr(n, a[h]);
    if (u === 0) return !t.ignoreBoundary;
    u && (c = !0);
  }
  return c;
}
function mr(s, e) {
  return e[0] <= s[0] && e[1] <= s[1] && e[2] >= s[0] && e[3] >= s[1];
}
let $n = class {
  constructor(e = [], t = gr) {
    if (this.data = e, this.length = this.data.length, this.compare = t, this.length > 0)
      for (let n = (this.length >> 1) - 1; n >= 0; n--) this._down(n);
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
    const { data: t, compare: n } = this, i = t[e];
    for (; e > 0; ) {
      const r = e - 1 >> 1, o = t[r];
      if (n(i, o) >= 0) break;
      t[e] = o, e = r;
    }
    t[e] = i;
  }
  _down(e) {
    const { data: t, compare: n } = this, i = this.length >> 1, r = t[e];
    for (; e < i; ) {
      let o = (e << 1) + 1, a = t[o];
      const c = o + 1;
      if (c < this.length && n(t[c], a) < 0 && (o = c, a = t[c]), n(a, r) >= 0) break;
      t[e] = a, e = o;
    }
    t[e] = r;
  }
};
function gr(s, e) {
  return s < e ? -1 : s > e ? 1 : 0;
}
function qn(s, e) {
  return s.p.x > e.p.x ? 1 : s.p.x < e.p.x ? -1 : s.p.y !== e.p.y ? s.p.y > e.p.y ? 1 : -1 : 1;
}
function wr(s, e) {
  return s.rightSweepEvent.p.x > e.rightSweepEvent.p.x ? 1 : s.rightSweepEvent.p.x < e.rightSweepEvent.p.x ? -1 : s.rightSweepEvent.p.y !== e.rightSweepEvent.p.y ? s.rightSweepEvent.p.y < e.rightSweepEvent.p.y ? 1 : -1 : 1;
}
class yn {
  constructor(e, t, n, i) {
    this.p = {
      x: e[0],
      y: e[1]
    }, this.featureId = t, this.ringId = n, this.eventId = i, this.otherEvent = null, this.isLeftEndpoint = null;
  }
  isSamePoint(e) {
    return this.p.x === e.p.x && this.p.y === e.p.y;
  }
}
function yr(s, e) {
  if (s.type === "FeatureCollection") {
    const t = s.features;
    for (let n = 0; n < t.length; n++)
      vn(t[n], e);
  } else
    vn(s, e);
}
let Xe = 0, Ye = 0, Re = 0;
function vn(s, e) {
  const t = s.type === "Feature" ? s.geometry : s;
  let n = t.coordinates;
  (t.type === "Polygon" || t.type === "MultiLineString") && (n = [n]), t.type === "LineString" && (n = [[n]]);
  for (let i = 0; i < n.length; i++)
    for (let r = 0; r < n[i].length; r++) {
      let o = n[i][r][0], a = null;
      Ye = Ye + 1;
      for (let c = 0; c < n[i][r].length - 1; c++) {
        a = n[i][r][c + 1];
        const h = new yn(o, Xe, Ye, Re), u = new yn(a, Xe, Ye, Re + 1);
        h.otherEvent = u, u.otherEvent = h, qn(h, u) > 0 ? (u.isLeftEndpoint = !0, h.isLeftEndpoint = !1) : (h.isLeftEndpoint = !0, u.isLeftEndpoint = !1), e.push(h), e.push(u), o = a, Re = Re + 1;
      }
    }
  Xe = Xe + 1;
}
class vr {
  constructor(e) {
    this.leftSweepEvent = e, this.rightSweepEvent = e.otherEvent;
  }
}
function br(s, e) {
  if (s === null || e === null || s.leftSweepEvent.ringId === e.leftSweepEvent.ringId && (s.rightSweepEvent.isSamePoint(e.leftSweepEvent) || s.rightSweepEvent.isSamePoint(e.leftSweepEvent) || s.rightSweepEvent.isSamePoint(e.rightSweepEvent) || s.leftSweepEvent.isSamePoint(e.leftSweepEvent) || s.leftSweepEvent.isSamePoint(e.rightSweepEvent))) return !1;
  const t = s.leftSweepEvent.p.x, n = s.leftSweepEvent.p.y, i = s.rightSweepEvent.p.x, r = s.rightSweepEvent.p.y, o = e.leftSweepEvent.p.x, a = e.leftSweepEvent.p.y, c = e.rightSweepEvent.p.x, h = e.rightSweepEvent.p.y, u = (h - a) * (i - t) - (c - o) * (r - n), f = (c - o) * (n - a) - (h - a) * (t - o), g = (i - t) * (n - a) - (r - n) * (t - o);
  if (u === 0)
    return !1;
  const m = f / u, x = g / u;
  if (m >= 0 && m <= 1 && x >= 0 && x <= 1) {
    const b = t + m * (i - t), Y = n + m * (r - n);
    return [b, Y];
  }
  return !1;
}
function _r(s, e) {
  e = e || !1;
  const t = [], n = new $n([], wr);
  for (; s.length; ) {
    const i = s.pop();
    if (i.isLeftEndpoint) {
      const r = new vr(i);
      for (let o = 0; o < n.data.length; o++) {
        const a = n.data[o];
        if (e && a.leftSweepEvent.featureId === i.featureId)
          continue;
        const c = br(r, a);
        c !== !1 && t.push(c);
      }
      n.push(r);
    } else i.isLeftEndpoint === !1 && n.pop();
  }
  return t;
}
function xr(s, e) {
  const t = new $n([], qn);
  return yr(s, t), _r(t, e);
}
var Mr = xr;
function Sr(s, e, t = {}) {
  const { removeDuplicates: n = !0, ignoreSelfIntersections: i = !0 } = t;
  let r = [];
  s.type === "FeatureCollection" ? r = r.concat(s.features) : s.type === "Feature" ? r.push(s) : (s.type === "LineString" || s.type === "Polygon" || s.type === "MultiLineString" || s.type === "MultiPolygon") && r.push(Ae(s)), e.type === "FeatureCollection" ? r = r.concat(e.features) : e.type === "Feature" ? r.push(e) : (e.type === "LineString" || e.type === "Polygon" || e.type === "MultiLineString" || e.type === "MultiPolygon") && r.push(Ae(e));
  const o = Mr(
    Gt(r),
    i
  );
  let a = [];
  if (n) {
    const c = {};
    o.forEach((h) => {
      const u = h.join(",");
      c[u] || (c[u] = !0, a.push(h));
    });
  } else
    a = o;
  return Gt(a.map((c) => ge(c)));
}
function kr(s) {
  return s && s.__esModule && Object.prototype.hasOwnProperty.call(s, "default") ? s.default : s;
}
function Er(s) {
  if (Object.prototype.hasOwnProperty.call(s, "__esModule")) return s;
  var e = s.default;
  if (typeof e == "function") {
    var t = function n() {
      return this instanceof n ? Reflect.construct(e, arguments, this.constructor) : e.apply(this, arguments);
    };
    t.prototype = e.prototype;
  } else t = {};
  return Object.defineProperty(t, "__esModule", { value: !0 }), Object.keys(s).forEach(function(n) {
    var i = Object.getOwnPropertyDescriptor(s, n);
    Object.defineProperty(t, n, i.get ? i : {
      enumerable: !0,
      get: function() {
        return s[n];
      }
    });
  }), t;
}
function Ar(s, e = {}) {
  let t = 0, n = 0, i = 0;
  return hn(
    s,
    function(r) {
      t += r[0], n += r[1], i++;
    },
    !0
  ), ge([t / i, n / i], e.properties);
}
var Ce = { exports: {} }, ze = { exports: {} }, Or = ze.exports, bn;
function Br() {
  return bn || (bn = 1, (function(s, e) {
    (function(t, n) {
      s.exports = n();
    })(Or, function() {
      function t(d, y, l, v, M) {
        (function A(T, S, O, X, L) {
          for (; X > O; ) {
            if (X - O > 600) {
              var K = X - O + 1, p = S - O + 1, E = Math.log(K), _ = 0.5 * Math.exp(2 * E / 3), I = 0.5 * Math.sqrt(E * _ * (K - _) / K) * (p - K / 2 < 0 ? -1 : 1), N = Math.max(O, Math.floor(S - p * _ / K + I)), D = Math.min(X, Math.floor(S + (K - p) * _ / K + I));
              A(T, S, N, D, L);
            }
            var w = T[S], B = O, F = X;
            for (n(T, O, S), L(T[X], w) > 0 && n(T, O, X); B < F; ) {
              for (n(T, B, F), B++, F--; L(T[B], w) < 0; ) B++;
              for (; L(T[F], w) > 0; ) F--;
            }
            L(T[O], w) === 0 ? n(T, O, F) : n(T, ++F, X), F <= S && (O = F + 1), S <= F && (X = F - 1);
          }
        })(d, y, l || 0, v || d.length - 1, M || i);
      }
      function n(d, y, l) {
        var v = d[y];
        d[y] = d[l], d[l] = v;
      }
      function i(d, y) {
        return d < y ? -1 : d > y ? 1 : 0;
      }
      var r = function(d) {
        d === void 0 && (d = 9), this._maxEntries = Math.max(4, d), this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries)), this.clear();
      };
      function o(d, y, l) {
        if (!l) return y.indexOf(d);
        for (var v = 0; v < y.length; v++) if (l(d, y[v])) return v;
        return -1;
      }
      function a(d, y) {
        c(d, 0, d.children.length, y, d);
      }
      function c(d, y, l, v, M) {
        M || (M = Y(null)), M.minX = 1 / 0, M.minY = 1 / 0, M.maxX = -1 / 0, M.maxY = -1 / 0;
        for (var A = y; A < l; A++) {
          var T = d.children[A];
          h(M, d.leaf ? v(T) : T);
        }
        return M;
      }
      function h(d, y) {
        return d.minX = Math.min(d.minX, y.minX), d.minY = Math.min(d.minY, y.minY), d.maxX = Math.max(d.maxX, y.maxX), d.maxY = Math.max(d.maxY, y.maxY), d;
      }
      function u(d, y) {
        return d.minX - y.minX;
      }
      function f(d, y) {
        return d.minY - y.minY;
      }
      function g(d) {
        return (d.maxX - d.minX) * (d.maxY - d.minY);
      }
      function m(d) {
        return d.maxX - d.minX + (d.maxY - d.minY);
      }
      function x(d, y) {
        return d.minX <= y.minX && d.minY <= y.minY && y.maxX <= d.maxX && y.maxY <= d.maxY;
      }
      function b(d, y) {
        return y.minX <= d.maxX && y.minY <= d.maxY && y.maxX >= d.minX && y.maxY >= d.minY;
      }
      function Y(d) {
        return { children: d, height: 1, leaf: !0, minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
      }
      function R(d, y, l, v, M) {
        for (var A = [y, l]; A.length; ) if (!((l = A.pop()) - (y = A.pop()) <= v)) {
          var T = y + Math.ceil((l - y) / v / 2) * v;
          t(d, T, y, l, M), A.push(y, T, T, l);
        }
      }
      return r.prototype.all = function() {
        return this._all(this.data, []);
      }, r.prototype.search = function(d) {
        var y = this.data, l = [];
        if (!b(d, y)) return l;
        for (var v = this.toBBox, M = []; y; ) {
          for (var A = 0; A < y.children.length; A++) {
            var T = y.children[A], S = y.leaf ? v(T) : T;
            b(d, S) && (y.leaf ? l.push(T) : x(d, S) ? this._all(T, l) : M.push(T));
          }
          y = M.pop();
        }
        return l;
      }, r.prototype.collides = function(d) {
        var y = this.data;
        if (!b(d, y)) return !1;
        for (var l = []; y; ) {
          for (var v = 0; v < y.children.length; v++) {
            var M = y.children[v], A = y.leaf ? this.toBBox(M) : M;
            if (b(d, A)) {
              if (y.leaf || x(d, A)) return !0;
              l.push(M);
            }
          }
          y = l.pop();
        }
        return !1;
      }, r.prototype.load = function(d) {
        if (!d || !d.length) return this;
        if (d.length < this._minEntries) {
          for (var y = 0; y < d.length; y++) this.insert(d[y]);
          return this;
        }
        var l = this._build(d.slice(), 0, d.length - 1, 0);
        if (this.data.children.length) if (this.data.height === l.height) this._splitRoot(this.data, l);
        else {
          if (this.data.height < l.height) {
            var v = this.data;
            this.data = l, l = v;
          }
          this._insert(l, this.data.height - l.height - 1, !0);
        }
        else this.data = l;
        return this;
      }, r.prototype.insert = function(d) {
        return d && this._insert(d, this.data.height - 1), this;
      }, r.prototype.clear = function() {
        return this.data = Y([]), this;
      }, r.prototype.remove = function(d, y) {
        if (!d) return this;
        for (var l, v, M, A = this.data, T = this.toBBox(d), S = [], O = []; A || S.length; ) {
          if (A || (A = S.pop(), v = S[S.length - 1], l = O.pop(), M = !0), A.leaf) {
            var X = o(d, A.children, y);
            if (X !== -1) return A.children.splice(X, 1), S.push(A), this._condense(S), this;
          }
          M || A.leaf || !x(A, T) ? v ? (l++, A = v.children[l], M = !1) : A = null : (S.push(A), O.push(l), l = 0, v = A, A = A.children[0]);
        }
        return this;
      }, r.prototype.toBBox = function(d) {
        return d;
      }, r.prototype.compareMinX = function(d, y) {
        return d.minX - y.minX;
      }, r.prototype.compareMinY = function(d, y) {
        return d.minY - y.minY;
      }, r.prototype.toJSON = function() {
        return this.data;
      }, r.prototype.fromJSON = function(d) {
        return this.data = d, this;
      }, r.prototype._all = function(d, y) {
        for (var l = []; d; ) d.leaf ? y.push.apply(y, d.children) : l.push.apply(l, d.children), d = l.pop();
        return y;
      }, r.prototype._build = function(d, y, l, v) {
        var M, A = l - y + 1, T = this._maxEntries;
        if (A <= T) return a(M = Y(d.slice(y, l + 1)), this.toBBox), M;
        v || (v = Math.ceil(Math.log(A) / Math.log(T)), T = Math.ceil(A / Math.pow(T, v - 1))), (M = Y([])).leaf = !1, M.height = v;
        var S = Math.ceil(A / T), O = S * Math.ceil(Math.sqrt(T));
        R(d, y, l, O, this.compareMinX);
        for (var X = y; X <= l; X += O) {
          var L = Math.min(X + O - 1, l);
          R(d, X, L, S, this.compareMinY);
          for (var K = X; K <= L; K += S) {
            var p = Math.min(K + S - 1, L);
            M.children.push(this._build(d, K, p, v - 1));
          }
        }
        return a(M, this.toBBox), M;
      }, r.prototype._chooseSubtree = function(d, y, l, v) {
        for (; v.push(y), !y.leaf && v.length - 1 !== l; ) {
          for (var M = 1 / 0, A = 1 / 0, T = void 0, S = 0; S < y.children.length; S++) {
            var O = y.children[S], X = g(O), L = (K = d, p = O, (Math.max(p.maxX, K.maxX) - Math.min(p.minX, K.minX)) * (Math.max(p.maxY, K.maxY) - Math.min(p.minY, K.minY)) - X);
            L < A ? (A = L, M = X < M ? X : M, T = O) : L === A && X < M && (M = X, T = O);
          }
          y = T || y.children[0];
        }
        var K, p;
        return y;
      }, r.prototype._insert = function(d, y, l) {
        var v = l ? d : this.toBBox(d), M = [], A = this._chooseSubtree(v, this.data, y, M);
        for (A.children.push(d), h(A, v); y >= 0 && M[y].children.length > this._maxEntries; ) this._split(M, y), y--;
        this._adjustParentBBoxes(v, M, y);
      }, r.prototype._split = function(d, y) {
        var l = d[y], v = l.children.length, M = this._minEntries;
        this._chooseSplitAxis(l, M, v);
        var A = this._chooseSplitIndex(l, M, v), T = Y(l.children.splice(A, l.children.length - A));
        T.height = l.height, T.leaf = l.leaf, a(l, this.toBBox), a(T, this.toBBox), y ? d[y - 1].children.push(T) : this._splitRoot(l, T);
      }, r.prototype._splitRoot = function(d, y) {
        this.data = Y([d, y]), this.data.height = d.height + 1, this.data.leaf = !1, a(this.data, this.toBBox);
      }, r.prototype._chooseSplitIndex = function(d, y, l) {
        for (var v, M, A, T, S, O, X, L = 1 / 0, K = 1 / 0, p = y; p <= l - y; p++) {
          var E = c(d, 0, p, this.toBBox), _ = c(d, p, l, this.toBBox), I = (M = E, A = _, T = void 0, S = void 0, O = void 0, X = void 0, T = Math.max(M.minX, A.minX), S = Math.max(M.minY, A.minY), O = Math.min(M.maxX, A.maxX), X = Math.min(M.maxY, A.maxY), Math.max(0, O - T) * Math.max(0, X - S)), N = g(E) + g(_);
          I < L ? (L = I, v = p, K = N < K ? N : K) : I === L && N < K && (K = N, v = p);
        }
        return v || l - y;
      }, r.prototype._chooseSplitAxis = function(d, y, l) {
        var v = d.leaf ? this.compareMinX : u, M = d.leaf ? this.compareMinY : f;
        this._allDistMargin(d, y, l, v) < this._allDistMargin(d, y, l, M) && d.children.sort(v);
      }, r.prototype._allDistMargin = function(d, y, l, v) {
        d.children.sort(v);
        for (var M = this.toBBox, A = c(d, 0, y, M), T = c(d, l - y, l, M), S = m(A) + m(T), O = y; O < l - y; O++) {
          var X = d.children[O];
          h(A, d.leaf ? M(X) : X), S += m(A);
        }
        for (var L = l - y - 1; L >= y; L--) {
          var K = d.children[L];
          h(T, d.leaf ? M(K) : K), S += m(T);
        }
        return S;
      }, r.prototype._adjustParentBBoxes = function(d, y, l) {
        for (var v = l; v >= 0; v--) h(y[v], d);
      }, r.prototype._condense = function(d) {
        for (var y = d.length - 1, l = void 0; y >= 0; y--) d[y].children.length === 0 ? y > 0 ? (l = d[y - 1].children).splice(l.indexOf(d[y]), 1) : this.clear() : a(d[y], this.toBBox);
      }, r;
    });
  })(ze)), ze.exports;
}
class Pr {
  constructor(e = [], t = Ir) {
    if (this.data = e, this.length = this.data.length, this.compare = t, this.length > 0)
      for (let n = (this.length >> 1) - 1; n >= 0; n--) this._down(n);
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
    const { data: t, compare: n } = this, i = t[e];
    for (; e > 0; ) {
      const r = e - 1 >> 1, o = t[r];
      if (n(i, o) >= 0) break;
      t[e] = o, e = r;
    }
    t[e] = i;
  }
  _down(e) {
    const { data: t, compare: n } = this, i = this.length >> 1, r = t[e];
    for (; e < i; ) {
      let o = (e << 1) + 1, a = t[o];
      const c = o + 1;
      if (c < this.length && n(t[c], a) < 0 && (o = c, a = t[c]), n(a, r) >= 0) break;
      t[e] = a, e = o;
    }
    t[e] = r;
  }
}
function Ir(s, e) {
  return s < e ? -1 : s > e ? 1 : 0;
}
const Tr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Pr
}, Symbol.toStringTag, { value: "Module" })), Nr = /* @__PURE__ */ Er(Tr);
var xe = { exports: {} }, sn, _n;
function Xr() {
  return _n || (_n = 1, sn = function(e, t, n, i) {
    var r = e[0], o = e[1], a = !1;
    n === void 0 && (n = 0), i === void 0 && (i = t.length);
    for (var c = (i - n) / 2, h = 0, u = c - 1; h < c; u = h++) {
      var f = t[n + h * 2 + 0], g = t[n + h * 2 + 1], m = t[n + u * 2 + 0], x = t[n + u * 2 + 1], b = g > o != x > o && r < (m - f) * (o - g) / (x - g) + f;
      b && (a = !a);
    }
    return a;
  }), sn;
}
var on, xn;
function Yr() {
  return xn || (xn = 1, on = function(e, t, n, i) {
    var r = e[0], o = e[1], a = !1;
    n === void 0 && (n = 0), i === void 0 && (i = t.length);
    for (var c = i - n, h = 0, u = c - 1; h < c; u = h++) {
      var f = t[h + n][0], g = t[h + n][1], m = t[u + n][0], x = t[u + n][1], b = g > o != x > o && r < (m - f) * (o - g) / (x - g) + f;
      b && (a = !a);
    }
    return a;
  }), on;
}
var Mn;
function Rr() {
  if (Mn) return xe.exports;
  Mn = 1;
  var s = Xr(), e = Yr();
  return xe.exports = function(n, i, r, o) {
    return i.length > 0 && Array.isArray(i[0]) ? e(n, i, r, o) : s(n, i, r, o);
  }, xe.exports.nested = e, xe.exports.flat = s, xe.exports;
}
var Se = { exports: {} }, Cr = Se.exports, Sn;
function Fr() {
  return Sn || (Sn = 1, (function(s, e) {
    (function(t, n) {
      n(e);
    })(Cr, function(t) {
      const i = 33306690738754706e-32;
      function r(b, Y, R, d, y) {
        let l, v, M, A, T = Y[0], S = d[0], O = 0, X = 0;
        S > T == S > -T ? (l = T, T = Y[++O]) : (l = S, S = d[++X]);
        let L = 0;
        if (O < b && X < R) for (S > T == S > -T ? (M = l - ((v = T + l) - T), T = Y[++O]) : (M = l - ((v = S + l) - S), S = d[++X]), l = v, M !== 0 && (y[L++] = M); O < b && X < R; ) S > T == S > -T ? (M = l - ((v = l + T) - (A = v - l)) + (T - A), T = Y[++O]) : (M = l - ((v = l + S) - (A = v - l)) + (S - A), S = d[++X]), l = v, M !== 0 && (y[L++] = M);
        for (; O < b; ) M = l - ((v = l + T) - (A = v - l)) + (T - A), T = Y[++O], l = v, M !== 0 && (y[L++] = M);
        for (; X < R; ) M = l - ((v = l + S) - (A = v - l)) + (S - A), S = d[++X], l = v, M !== 0 && (y[L++] = M);
        return l === 0 && L !== 0 || (y[L++] = l), L;
      }
      function o(b) {
        return new Float64Array(b);
      }
      const a = 33306690738754716e-32, c = 22204460492503146e-32, h = 11093356479670487e-47, u = o(4), f = o(8), g = o(12), m = o(16), x = o(4);
      t.orient2d = function(b, Y, R, d, y, l) {
        const v = (Y - l) * (R - y), M = (b - y) * (d - l), A = v - M;
        if (v === 0 || M === 0 || v > 0 != M > 0) return A;
        const T = Math.abs(v + M);
        return Math.abs(A) >= a * T ? A : -(function(S, O, X, L, K, p, E) {
          let _, I, N, D, w, B, F, q, U, z, Q, V, ht, ct, ut, dt, gt, mt;
          const Bt = S - K, Xt = X - K, St = O - p, Mt = L - p;
          w = (ut = (q = Bt - (F = (B = 134217729 * Bt) - (B - Bt))) * (z = Mt - (U = (B = 134217729 * Mt) - (B - Mt))) - ((ct = Bt * Mt) - F * U - q * U - F * z)) - (Q = ut - (gt = (q = St - (F = (B = 134217729 * St) - (B - St))) * (z = Xt - (U = (B = 134217729 * Xt) - (B - Xt))) - ((dt = St * Xt) - F * U - q * U - F * z))), u[0] = ut - (Q + w) + (w - gt), w = (ht = ct - ((V = ct + Q) - (w = V - ct)) + (Q - w)) - (Q = ht - dt), u[1] = ht - (Q + w) + (w - dt), w = (mt = V + Q) - V, u[2] = V - (mt - w) + (Q - w), u[3] = mt;
          let Qt = (function(Ge, qt) {
            let Pe = qt[0];
            for (let k = 1; k < Ge; k++) Pe += qt[k];
            return Pe;
          })(4, u), fe = c * E;
          if (Qt >= fe || -Qt >= fe || (_ = S - (Bt + (w = S - Bt)) + (w - K), N = X - (Xt + (w = X - Xt)) + (w - K), I = O - (St + (w = O - St)) + (w - p), D = L - (Mt + (w = L - Mt)) + (w - p), _ === 0 && I === 0 && N === 0 && D === 0) || (fe = h * E + i * Math.abs(Qt), (Qt += Bt * D + Mt * _ - (St * N + Xt * I)) >= fe || -Qt >= fe)) return Qt;
          w = (ut = (q = _ - (F = (B = 134217729 * _) - (B - _))) * (z = Mt - (U = (B = 134217729 * Mt) - (B - Mt))) - ((ct = _ * Mt) - F * U - q * U - F * z)) - (Q = ut - (gt = (q = I - (F = (B = 134217729 * I) - (B - I))) * (z = Xt - (U = (B = 134217729 * Xt) - (B - Xt))) - ((dt = I * Xt) - F * U - q * U - F * z))), x[0] = ut - (Q + w) + (w - gt), w = (ht = ct - ((V = ct + Q) - (w = V - ct)) + (Q - w)) - (Q = ht - dt), x[1] = ht - (Q + w) + (w - dt), w = (mt = V + Q) - V, x[2] = V - (mt - w) + (Q - w), x[3] = mt;
          const We = r(4, u, 4, x, f);
          w = (ut = (q = Bt - (F = (B = 134217729 * Bt) - (B - Bt))) * (z = D - (U = (B = 134217729 * D) - (B - D))) - ((ct = Bt * D) - F * U - q * U - F * z)) - (Q = ut - (gt = (q = St - (F = (B = 134217729 * St) - (B - St))) * (z = N - (U = (B = 134217729 * N) - (B - N))) - ((dt = St * N) - F * U - q * U - F * z))), x[0] = ut - (Q + w) + (w - gt), w = (ht = ct - ((V = ct + Q) - (w = V - ct)) + (Q - w)) - (Q = ht - dt), x[1] = ht - (Q + w) + (w - dt), w = (mt = V + Q) - V, x[2] = V - (mt - w) + (Q - w), x[3] = mt;
          const Je = r(We, f, 4, x, g);
          w = (ut = (q = _ - (F = (B = 134217729 * _) - (B - _))) * (z = D - (U = (B = 134217729 * D) - (B - D))) - ((ct = _ * D) - F * U - q * U - F * z)) - (Q = ut - (gt = (q = I - (F = (B = 134217729 * I) - (B - I))) * (z = N - (U = (B = 134217729 * N) - (B - N))) - ((dt = I * N) - F * U - q * U - F * z))), x[0] = ut - (Q + w) + (w - gt), w = (ht = ct - ((V = ct + Q) - (w = V - ct)) + (Q - w)) - (Q = ht - dt), x[1] = ht - (Q + w) + (w - dt), w = (mt = V + Q) - V, x[2] = V - (mt - w) + (Q - w), x[3] = mt;
          const Ke = r(Je, g, 4, x, m);
          return m[Ke - 1];
        })(b, Y, R, d, y, l, T);
      }, t.orient2dfast = function(b, Y, R, d, y, l) {
        return (Y - l) * (R - y) - (b - y) * (d - l);
      }, Object.defineProperty(t, "__esModule", { value: !0 });
    });
  })(Se, Se.exports)), Se.exports;
}
var kn;
function Lr() {
  if (kn) return Ce.exports;
  kn = 1;
  var s = Br(), e = Nr, t = Rr(), n = Fr().orient2d;
  e.default && (e = e.default), Ce.exports = i, Ce.exports.default = i;
  function i(l, v, M) {
    v = Math.max(0, v === void 0 ? 2 : v), M = M || 0;
    var A = m(l), T = new s(16);
    T.toBBox = function(F) {
      return {
        minX: F[0],
        minY: F[1],
        maxX: F[0],
        maxY: F[1]
      };
    }, T.compareMinX = function(F, q) {
      return F[0] - q[0];
    }, T.compareMinY = function(F, q) {
      return F[1] - q[1];
    }, T.load(l);
    for (var S = [], O = 0, X; O < A.length; O++) {
      var L = A[O];
      T.remove(L), X = x(L, X), S.push(X);
    }
    var K = new s(16);
    for (O = 0; O < S.length; O++) K.insert(g(S[O]));
    for (var p = v * v, E = M * M; S.length; ) {
      var _ = S.shift(), I = _.p, N = _.next.p, D = b(I, N);
      if (!(D < E)) {
        var w = D / p;
        L = r(T, _.prev.p, I, N, _.next.next.p, w, K), L && Math.min(b(L, I), b(L, N)) <= w && (S.push(_), S.push(x(L, _)), T.remove(L), K.remove(_), K.insert(g(_)), K.insert(g(_.next)));
      }
    }
    _ = X;
    var B = [];
    do
      B.push(_.p), _ = _.next;
    while (_ !== X);
    return B.push(_.p), B;
  }
  function r(l, v, M, A, T, S, O) {
    for (var X = new e([], o), L = l.data; L; ) {
      for (var K = 0; K < L.children.length; K++) {
        var p = L.children[K], E = L.leaf ? Y(p, M, A) : a(M, A, p);
        E > S || X.push({
          node: p,
          dist: E
        });
      }
      for (; X.length && !X.peek().node.children; ) {
        var _ = X.pop(), I = _.node, N = Y(I, v, M), D = Y(I, A, T);
        if (_.dist < N && _.dist < D && h(M, I, O) && h(A, I, O)) return I;
      }
      L = X.pop(), L && (L = L.node);
    }
    return null;
  }
  function o(l, v) {
    return l.dist - v.dist;
  }
  function a(l, v, M) {
    if (c(l, M) || c(v, M)) return 0;
    var A = R(l[0], l[1], v[0], v[1], M.minX, M.minY, M.maxX, M.minY);
    if (A === 0) return 0;
    var T = R(l[0], l[1], v[0], v[1], M.minX, M.minY, M.minX, M.maxY);
    if (T === 0) return 0;
    var S = R(l[0], l[1], v[0], v[1], M.maxX, M.minY, M.maxX, M.maxY);
    if (S === 0) return 0;
    var O = R(l[0], l[1], v[0], v[1], M.minX, M.maxY, M.maxX, M.maxY);
    return O === 0 ? 0 : Math.min(A, T, S, O);
  }
  function c(l, v) {
    return l[0] >= v.minX && l[0] <= v.maxX && l[1] >= v.minY && l[1] <= v.maxY;
  }
  function h(l, v, M) {
    for (var A = Math.min(l[0], v[0]), T = Math.min(l[1], v[1]), S = Math.max(l[0], v[0]), O = Math.max(l[1], v[1]), X = M.search({ minX: A, minY: T, maxX: S, maxY: O }), L = 0; L < X.length; L++)
      if (f(X[L].p, X[L].next.p, l, v)) return !1;
    return !0;
  }
  function u(l, v, M) {
    return n(l[0], l[1], v[0], v[1], M[0], M[1]);
  }
  function f(l, v, M, A) {
    return l !== A && v !== M && u(l, v, M) > 0 != u(l, v, A) > 0 && u(M, A, l) > 0 != u(M, A, v) > 0;
  }
  function g(l) {
    var v = l.p, M = l.next.p;
    return l.minX = Math.min(v[0], M[0]), l.minY = Math.min(v[1], M[1]), l.maxX = Math.max(v[0], M[0]), l.maxY = Math.max(v[1], M[1]), l;
  }
  function m(l) {
    for (var v = l[0], M = l[0], A = l[0], T = l[0], S = 0; S < l.length; S++) {
      var O = l[S];
      O[0] < v[0] && (v = O), O[0] > A[0] && (A = O), O[1] < M[1] && (M = O), O[1] > T[1] && (T = O);
    }
    var X = [v, M, A, T], L = X.slice();
    for (S = 0; S < l.length; S++)
      t(l[S], X) || L.push(l[S]);
    return y(L);
  }
  function x(l, v) {
    var M = {
      p: l,
      prev: null,
      next: null,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };
    return v ? (M.next = v.next, M.prev = v, v.next.prev = M, v.next = M) : (M.prev = M, M.next = M), M;
  }
  function b(l, v) {
    var M = l[0] - v[0], A = l[1] - v[1];
    return M * M + A * A;
  }
  function Y(l, v, M) {
    var A = v[0], T = v[1], S = M[0] - A, O = M[1] - T;
    if (S !== 0 || O !== 0) {
      var X = ((l[0] - A) * S + (l[1] - T) * O) / (S * S + O * O);
      X > 1 ? (A = M[0], T = M[1]) : X > 0 && (A += S * X, T += O * X);
    }
    return S = l[0] - A, O = l[1] - T, S * S + O * O;
  }
  function R(l, v, M, A, T, S, O, X) {
    var L = M - l, K = A - v, p = O - T, E = X - S, _ = l - T, I = v - S, N = L * L + K * K, D = L * p + K * E, w = p * p + E * E, B = L * _ + K * I, F = p * _ + E * I, q = N * w - D * D, U, z, Q, V, ht = q, ct = q;
    q === 0 ? (z = 0, ht = 1, V = F, ct = w) : (z = D * F - w * B, V = N * F - D * B, z < 0 ? (z = 0, V = F, ct = w) : z > ht && (z = ht, V = F + D, ct = w)), V < 0 ? (V = 0, -B < 0 ? z = 0 : -B > N ? z = ht : (z = -B, ht = N)) : V > ct && (V = ct, -B + D < 0 ? z = 0 : -B + D > N ? z = ht : (z = -B + D, ht = N)), U = z === 0 ? 0 : z / ht, Q = V === 0 ? 0 : V / ct;
    var ut = (1 - U) * l + U * M, dt = (1 - U) * v + U * A, gt = (1 - Q) * T + Q * O, mt = (1 - Q) * S + Q * X, Bt = gt - ut, Xt = mt - dt;
    return Bt * Bt + Xt * Xt;
  }
  function d(l, v) {
    return l[0] === v[0] ? l[1] - v[1] : l[0] - v[0];
  }
  function y(l) {
    l.sort(d);
    for (var v = [], M = 0; M < l.length; M++) {
      for (; v.length >= 2 && u(v[v.length - 2], v[v.length - 1], l[M]) <= 0; )
        v.pop();
      v.push(l[M]);
    }
    for (var A = [], T = l.length - 1; T >= 0; T--) {
      for (; A.length >= 2 && u(A[A.length - 2], A[A.length - 1], l[T]) <= 0; )
        A.pop();
      A.push(l[T]);
    }
    return A.pop(), v.pop(), v.concat(A);
  }
  return Ce.exports;
}
var Dr = Lr();
const $r = /* @__PURE__ */ kr(Dr);
function En(s, e = {}) {
  e.concavity = e.concavity || 1 / 0;
  const t = [];
  if (hn(s, (i) => {
    t.push([i[0], i[1]]);
  }), !t.length)
    return null;
  const n = $r(t, e.concavity);
  return n.length > 3 ? Be([n]) : null;
}
var ke = { exports: {} }, qr = ke.exports, An;
function jr() {
  return An || (An = 1, (function(s, e) {
    (function(t, n) {
      n(e);
    })(qr, function(t) {
      var n = Object.defineProperty, i = (k, P, C) => P in k ? n(k, P, { enumerable: !0, configurable: !0, writable: !0, value: C }) : k[P] = C, r = (k, P, C) => i(k, typeof P != "symbol" ? P + "" : P, C);
      function o(k, P, C = {}) {
        const $ = { type: "Feature" };
        return (C.id === 0 || C.id) && ($.id = C.id), C.bbox && ($.bbox = C.bbox), $.properties = P || {}, $.geometry = k, $;
      }
      function a(k, P, C = {}) {
        if (!k) throw new Error("coordinates is required");
        if (!Array.isArray(k)) throw new Error("coordinates must be an Array");
        if (k.length < 2) throw new Error("coordinates must be at least 2 numbers long");
        if (!u(k[0]) || !u(k[1])) throw new Error("coordinates must contain numbers");
        return o({ type: "Point", coordinates: k }, P, C);
      }
      function c(k, P, C = {}) {
        for (const $ of k) {
          if ($.length < 4) throw new Error("Each LinearRing of a Polygon must have 4 or more Positions.");
          if ($[$.length - 1].length !== $[0].length) throw new Error("First and last Position are not equivalent.");
          for (let tt = 0; tt < $[$.length - 1].length; tt++) if ($[$.length - 1][tt] !== $[0][tt]) throw new Error("First and last Position are not equivalent.");
        }
        return o({ type: "Polygon", coordinates: k }, P, C);
      }
      function h(k, P = {}) {
        const C = { type: "FeatureCollection" };
        return P.id && (C.id = P.id), P.bbox && (C.bbox = P.bbox), C.features = k, C;
      }
      function u(k) {
        return !isNaN(k) && k !== null && !Array.isArray(k);
      }
      function f(k) {
        if (!k) throw new Error("coord is required");
        if (!Array.isArray(k)) {
          if (k.type === "Feature" && k.geometry !== null && k.geometry.type === "Point") return [...k.geometry.coordinates];
          if (k.type === "Point") return [...k.coordinates];
        }
        if (Array.isArray(k) && k.length >= 2 && !Array.isArray(k[0]) && !Array.isArray(k[1])) return [...k];
        throw new Error("coord must be GeoJSON Point or an Array of numbers");
      }
      function g(k) {
        if (Array.isArray(k)) return k;
        if (k.type === "Feature") {
          if (k.geometry !== null) return k.geometry.coordinates;
        } else if (k.coordinates) return k.coordinates;
        throw new Error("coords must be GeoJSON Feature, Geometry Object or an Array");
      }
      function m(k) {
        return k.type === "Feature" ? k.geometry : k;
      }
      const x = 11102230246251565e-32, b = 134217729, Y = (3 + 8 * x) * x;
      function R(k, P, C, $, tt) {
        let G, et, st, it, at = P[0], ft = $[0], J = 0, Z = 0;
        ft > at == ft > -at ? (G = at, at = P[++J]) : (G = ft, ft = $[++Z]);
        let lt = 0;
        if (J < k && Z < C) for (ft > at == ft > -at ? (et = at + G, st = G - (et - at), at = P[++J]) : (et = ft + G, st = G - (et - ft), ft = $[++Z]), G = et, st !== 0 && (tt[lt++] = st); J < k && Z < C; ) ft > at == ft > -at ? (et = G + at, it = et - G, st = G - (et - it) + (at - it), at = P[++J]) : (et = G + ft, it = et - G, st = G - (et - it) + (ft - it), ft = $[++Z]), G = et, st !== 0 && (tt[lt++] = st);
        for (; J < k; ) et = G + at, it = et - G, st = G - (et - it) + (at - it), at = P[++J], G = et, st !== 0 && (tt[lt++] = st);
        for (; Z < C; ) et = G + ft, it = et - G, st = G - (et - it) + (ft - it), ft = $[++Z], G = et, st !== 0 && (tt[lt++] = st);
        return (G !== 0 || lt === 0) && (tt[lt++] = G), lt;
      }
      function d(k, P) {
        let C = P[0];
        for (let $ = 1; $ < k; $++) C += P[$];
        return C;
      }
      function y(k) {
        return new Float64Array(k);
      }
      const l = (3 + 16 * x) * x, v = (2 + 12 * x) * x, M = (9 + 64 * x) * x * x, A = y(4), T = y(8), S = y(12), O = y(16), X = y(4);
      function L(k, P, C, $, tt, G, et) {
        let st, it, at, ft, J, Z, lt, xt, nt, H, W, wt, At, Ot, Nt, yt, Pt, Ct;
        const Vt = k - tt, Wt = C - tt, Jt = P - G, Kt = $ - G;
        Ot = Vt * Kt, Z = b * Vt, lt = Z - (Z - Vt), xt = Vt - lt, Z = b * Kt, nt = Z - (Z - Kt), H = Kt - nt, Nt = xt * H - (Ot - lt * nt - xt * nt - lt * H), yt = Jt * Wt, Z = b * Jt, lt = Z - (Z - Jt), xt = Jt - lt, Z = b * Wt, nt = Z - (Z - Wt), H = Wt - nt, Pt = xt * H - (yt - lt * nt - xt * nt - lt * H), W = Nt - Pt, J = Nt - W, A[0] = Nt - (W + J) + (J - Pt), wt = Ot + W, J = wt - Ot, At = Ot - (wt - J) + (W - J), W = At - yt, J = At - W, A[1] = At - (W + J) + (J - yt), Ct = wt + W, J = Ct - wt, A[2] = wt - (Ct - J) + (W - J), A[3] = Ct;
        let ue = d(4, A), _e = v * et;
        if (ue >= _e || -ue >= _e || (J = k - Vt, st = k - (Vt + J) + (J - tt), J = C - Wt, at = C - (Wt + J) + (J - tt), J = P - Jt, it = P - (Jt + J) + (J - G), J = $ - Kt, ft = $ - (Kt + J) + (J - G), st === 0 && it === 0 && at === 0 && ft === 0) || (_e = M * et + Y * Math.abs(ue), ue += Vt * ft + Kt * st - (Jt * at + Wt * it), ue >= _e || -ue >= _e)) return ue;
        Ot = st * Kt, Z = b * st, lt = Z - (Z - st), xt = st - lt, Z = b * Kt, nt = Z - (Z - Kt), H = Kt - nt, Nt = xt * H - (Ot - lt * nt - xt * nt - lt * H), yt = it * Wt, Z = b * it, lt = Z - (Z - it), xt = it - lt, Z = b * Wt, nt = Z - (Z - Wt), H = Wt - nt, Pt = xt * H - (yt - lt * nt - xt * nt - lt * H), W = Nt - Pt, J = Nt - W, X[0] = Nt - (W + J) + (J - Pt), wt = Ot + W, J = wt - Ot, At = Ot - (wt - J) + (W - J), W = At - yt, J = At - W, X[1] = At - (W + J) + (J - yt), Ct = wt + W, J = Ct - wt, X[2] = wt - (Ct - J) + (W - J), X[3] = Ct;
        const Qn = R(4, A, 4, X, T);
        Ot = Vt * ft, Z = b * Vt, lt = Z - (Z - Vt), xt = Vt - lt, Z = b * ft, nt = Z - (Z - ft), H = ft - nt, Nt = xt * H - (Ot - lt * nt - xt * nt - lt * H), yt = Jt * at, Z = b * Jt, lt = Z - (Z - Jt), xt = Jt - lt, Z = b * at, nt = Z - (Z - at), H = at - nt, Pt = xt * H - (yt - lt * nt - xt * nt - lt * H), W = Nt - Pt, J = Nt - W, X[0] = Nt - (W + J) + (J - Pt), wt = Ot + W, J = wt - Ot, At = Ot - (wt - J) + (W - J), W = At - yt, J = At - W, X[1] = At - (W + J) + (J - yt), Ct = wt + W, J = Ct - wt, X[2] = wt - (Ct - J) + (W - J), X[3] = Ct;
        const Hn = R(Qn, T, 4, X, S);
        Ot = st * ft, Z = b * st, lt = Z - (Z - st), xt = st - lt, Z = b * ft, nt = Z - (Z - ft), H = ft - nt, Nt = xt * H - (Ot - lt * nt - xt * nt - lt * H), yt = it * at, Z = b * it, lt = Z - (Z - it), xt = it - lt, Z = b * at, nt = Z - (Z - at), H = at - nt, Pt = xt * H - (yt - lt * nt - xt * nt - lt * H), W = Nt - Pt, J = Nt - W, X[0] = Nt - (W + J) + (J - Pt), wt = Ot + W, J = wt - Ot, At = Ot - (wt - J) + (W - J), W = At - yt, J = At - W, X[1] = At - (W + J) + (J - yt), Ct = wt + W, J = Ct - wt, X[2] = wt - (Ct - J) + (W - J), X[3] = Ct;
        const Zn = R(Hn, S, 4, X, O);
        return O[Zn - 1];
      }
      function K(k, P, C, $, tt, G) {
        const et = (P - G) * (C - tt), st = (k - tt) * ($ - G), it = et - st, at = Math.abs(et + st);
        return Math.abs(it) >= l * at ? it : -L(k, P, C, $, tt, G, at);
      }
      function p(k, P) {
        var C, $, tt = 0, G, et, st, it, at, ft, J, Z = k[0], lt = k[1], xt = P.length;
        for (C = 0; C < xt; C++) {
          $ = 0;
          var nt = P[C], H = nt.length - 1;
          if (ft = nt[0], ft[0] !== nt[H][0] && ft[1] !== nt[H][1]) throw new Error("First and last coordinates in a ring must be the same");
          for (et = ft[0] - Z, st = ft[1] - lt, $; $ < H; $++) {
            if (J = nt[$ + 1], it = J[0] - Z, at = J[1] - lt, st === 0 && at === 0) {
              if (it <= 0 && et >= 0 || et <= 0 && it >= 0) return 0;
            } else if (at >= 0 && st <= 0 || at <= 0 && st >= 0) {
              if (G = K(et, it, st, at, 0, 0), G === 0) return 0;
              (G > 0 && at > 0 && st <= 0 || G < 0 && at <= 0 && st > 0) && tt++;
            }
            ft = J, st = at, et = it;
          }
        }
        return tt % 2 !== 0;
      }
      function E(k, P, C = {}) {
        if (!k) throw new Error("point is required");
        if (!P) throw new Error("polygon is required");
        const $ = f(k), tt = m(P), G = tt.type, et = P.bbox;
        let st = tt.coordinates;
        if (et && _($, et) === !1) return !1;
        G === "Polygon" && (st = [st]);
        let it = !1;
        for (var at = 0; at < st.length; ++at) {
          const ft = p($, st[at]);
          if (ft === 0) return !C.ignoreBoundary;
          ft && (it = !0);
        }
        return it;
      }
      function _(k, P) {
        return P[0] <= k[0] && P[1] <= k[1] && P[2] >= k[0] && P[3] >= k[1];
      }
      function I(k, P) {
        for (let C = 0; C < P.features.length; C++) if (E(k, P.features[C])) return P.features[C];
      }
      function N(k, P, C) {
        const $ = P.geometry.coordinates[0][0], tt = P.geometry.coordinates[0][1], G = P.geometry.coordinates[0][2], et = k.geometry.coordinates, st = P.properties.a.geom, it = P.properties.b.geom, at = P.properties.c.geom, ft = [tt[0] - $[0], tt[1] - $[1]], J = [G[0] - $[0], G[1] - $[1]], Z = [et[0] - $[0], et[1] - $[1]], lt = [it[0] - st[0], it[1] - st[1]], xt = [at[0] - st[0], at[1] - st[1]];
        let nt = (J[1] * Z[0] - J[0] * Z[1]) / (ft[0] * J[1] - ft[1] * J[0]), H = (ft[0] * Z[1] - ft[1] * Z[0]) / (ft[0] * J[1] - ft[1] * J[0]);
        if (C) {
          const W = C[P.properties.a.index], wt = C[P.properties.b.index], At = C[P.properties.c.index];
          let Ot;
          if (nt < 0 || H < 0 || 1 - nt - H < 0) {
            const Nt = nt / (nt + H), yt = H / (nt + H);
            Ot = nt / wt / (Nt / wt + yt / At), H = H / At / (Nt / wt + yt / At);
          } else Ot = nt / wt / (nt / wt + H / At + (1 - nt - H) / W), H = H / At / (nt / wt + H / At + (1 - nt - H) / W);
          nt = Ot;
        }
        return [nt * lt[0] + H * xt[0] + st[0], nt * lt[1] + H * xt[1] + st[1]];
      }
      function D(k, P, C, $) {
        const tt = k.geometry.coordinates, G = C.geometry.coordinates, et = Math.atan2(tt[0] - G[0], tt[1] - G[1]), st = F(et, P[0]);
        if (st === void 0) throw new Error("Unable to determine vertex index");
        const it = P[1][st];
        return N(k, it.features[0], $);
      }
      function w(k, P, C, $, tt, G, et, st) {
        let it;
        if (et && (it = I(k, h([et]))), !it) {
          if (C) {
            const at = k.geometry.coordinates, ft = C.gridNum, J = C.xOrigin, Z = C.yOrigin, lt = C.xUnit, xt = C.yUnit, nt = C.gridCache, H = B(at[0], J, lt, ft), W = B(at[1], Z, xt, ft), wt = nt[H] ? nt[H][W] ? nt[H][W] : [] : [];
            P = h(wt.map((At) => P.features[At]));
          }
          it = I(k, P);
        }
        return st && st(it), it ? N(k, it, G) : D(k, $, tt, G);
      }
      function B(k, P, C, $) {
        let tt = Math.floor((k - P) / C);
        return tt >= $ && (tt = $ - 1), tt;
      }
      function F(k, P) {
        let C = q(k - P[0]), $ = Math.PI * 2, tt;
        for (let G = 0; G < P.length; G++) {
          const et = (G + 1) % P.length, st = q(k - P[et]), it = Math.min(Math.abs(C), Math.abs(st));
          C * st <= 0 && it < $ && ($ = it, tt = G), C = st;
        }
        return tt;
      }
      function q(k, P = !1) {
        const C = P ? function($) {
          return !($ >= 0 && $ < Math.PI * 2);
        } : function($) {
          return !($ > -1 * Math.PI && $ <= Math.PI);
        };
        for (; C(k); ) k = k + 2 * Math.PI * (k > 0 ? -1 : 1);
        return k;
      }
      function U(k, P) {
        return P && P >= 2.00703 || Array.isArray(k[0]) ? k : k.map((C) => [C.illstNodes, C.mercNodes, C.startEnd]);
      }
      function z(k) {
        const P = k.features;
        for (let C = 0; C < P.length; C++) {
          const $ = P[C];
          `${$.properties.a.index}`.substring(0, 1) === "b" && `${$.properties.b.index}`.substring(0, 1) === "b" ? P[C] = { geometry: { type: "Polygon", coordinates: [[$.geometry.coordinates[0][2], $.geometry.coordinates[0][0], $.geometry.coordinates[0][1], $.geometry.coordinates[0][2]]] }, properties: { a: { geom: $.properties.c.geom, index: $.properties.c.index }, b: { geom: $.properties.a.geom, index: $.properties.a.index }, c: { geom: $.properties.b.geom, index: $.properties.b.index } }, type: "Feature" } : `${$.properties.c.index}`.substring(0, 1) === "b" && `${$.properties.a.index}`.substring(0, 1) === "b" && (P[C] = { geometry: { type: "Polygon", coordinates: [[$.geometry.coordinates[0][1], $.geometry.coordinates[0][2], $.geometry.coordinates[0][0], $.geometry.coordinates[0][1]]] }, properties: { a: { geom: $.properties.b.geom, index: $.properties.b.index }, b: { geom: $.properties.c.geom, index: $.properties.c.index }, c: { geom: $.properties.a.geom, index: $.properties.a.index } }, type: "Feature" });
        }
        return k;
      }
      function Q(k) {
        const P = ["a", "b", "c", "a"].map((G) => k.properties[G].geom), C = k.geometry.coordinates[0], $ = k.properties, tt = { a: { geom: C[0], index: $.a.index }, b: { geom: C[1], index: $.b.index }, c: { geom: C[2], index: $.c.index } };
        return c([P], tt);
      }
      function V(k) {
        const P = [0, 1, 2, 0].map(($) => k[$][0][0]), C = { a: { geom: k[0][0][1], index: k[0][1] }, b: { geom: k[1][0][1], index: k[1][1] }, c: { geom: k[2][0][1], index: k[2][1] } };
        return c([P], C);
      }
      function ht(k, P, C, $, tt, G = !1, et) {
        const st = k.map((it) => {
          (!et || et < 2.00703) && (it = ct(it));
          const at = isFinite(it) ? P[it] : it === "c" ? $ : it === "b0" ? tt[0] : it === "b1" ? tt[1] : it === "b2" ? tt[2] : it === "b3" ? tt[3] : (function() {
            const ft = it.match(/e(\d+)/);
            if (ft) {
              const J = parseInt(ft[1]);
              return C[J];
            }
            throw "Bad index value for indexesToTri";
          })();
          return G ? [[at[1], at[0]], it] : [[at[0], at[1]], it];
        });
        return V(st);
      }
      function ct(k) {
        return typeof k == "number" ? k : k.replace(/^(c|e|b)(?:ent|dgeNode|box)(\d+)?$/, "$1$2");
      }
      const ut = 2.00703;
      function dt(k) {
        return !!(k.version || !k.tins && k.points && k.tins_points);
      }
      function gt(k) {
        return { points: k.points, pointsWeightBuffer: Bt(k), strictStatus: Xt(k), verticesParams: St(k), centroid: Qt(k), edges: U(k.edges || []), edgeNodes: k.edgeNodes || [], tins: fe(k), kinks: We(k.kinks_points), yaxisMode: k.yaxisMode ?? "invert", strictMode: k.strictMode ?? "auto", vertexMode: k.vertexMode, bounds: k.bounds, boundsPolygon: k.boundsPolygon, wh: k.wh, xy: k.bounds ? k.xy : [0, 0] };
      }
      function mt(k) {
        const P = Je(k), C = P.tins;
        return { compiled: P, tins: C, points: Ke(C), strictStatus: P.strict_status, pointsWeightBuffer: P.weight_buffer, verticesParams: P.vertices_params, centroid: P.centroid, kinks: P.kinks };
      }
      function Bt(k) {
        return !k.version || k.version < ut ? ["forw", "bakw"].reduce((P, C) => {
          const $ = k.weight_buffer[C];
          return $ && (P[C] = Object.keys($).reduce((tt, G) => {
            const et = ct(G);
            return tt[et] = $[G], tt;
          }, {})), P;
        }, {}) : k.weight_buffer;
      }
      function Xt(k) {
        return k.strict_status ? k.strict_status : k.kinks_points ? "strict_error" : k.tins_points.length === 2 ? "loose" : "strict";
      }
      function St(k) {
        const P = { forw: [k.vertices_params[0]], bakw: [k.vertices_params[1]] };
        return P.forw[1] = Mt(k, !1), P.bakw[1] = Mt(k, !0), P;
      }
      function Mt(k, P) {
        return [0, 1, 2, 3].map((C) => {
          const $ = (C + 1) % 4, tt = ht(["c", `b${C}`, `b${$}`], k.points, k.edgeNodes || [], k.centroid_point, k.vertices_points, P, ut);
          return h([tt]);
        });
      }
      function Qt(k) {
        return { forw: a(k.centroid_point[0], { target: { geom: k.centroid_point[1], index: "c" } }), bakw: a(k.centroid_point[1], { target: { geom: k.centroid_point[0], index: "c" } }) };
      }
      function fe(k) {
        const P = k.tins_points.length === 1 ? 0 : 1;
        return { forw: h(k.tins_points[0].map((C) => ht(C, k.points, k.edgeNodes || [], k.centroid_point, k.vertices_points, !1, k.version))), bakw: h(k.tins_points[P].map((C) => ht(C, k.points, k.edgeNodes || [], k.centroid_point, k.vertices_points, !0, k.version))) };
      }
      function We(k) {
        if (k) return { bakw: h(k.map((P) => a(P))) };
      }
      function Je(k) {
        return JSON.parse(JSON.stringify(k).replace('"cent"', '"c"').replace(/"bbox(\d+)"/g, '"b$1"'));
      }
      function Ke(k) {
        const P = [], C = k.forw.features;
        for (let $ = 0; $ < C.length; $++) {
          const tt = C[$];
          ["a", "b", "c"].map((G, et) => {
            const st = tt.geometry.coordinates[0][et], it = tt.properties[G].geom, at = tt.properties[G].index;
            typeof at == "number" && (P[at] = [st, it]);
          });
        }
        return P;
      }
      const Ge = ut, qt = class ee {
        constructor() {
          r(this, "points", []), r(this, "pointsWeightBuffer"), r(this, "strict_status"), r(this, "vertices_params"), r(this, "centroid"), r(this, "edgeNodes"), r(this, "edges"), r(this, "tins"), r(this, "kinks"), r(this, "yaxisMode", ee.YAXIS_INVERT), r(this, "strictMode", ee.MODE_AUTO), r(this, "vertexMode", ee.VERTEX_PLAIN), r(this, "bounds"), r(this, "boundsPolygon"), r(this, "wh"), r(this, "xy"), r(this, "indexedTins"), r(this, "stateFull", !1), r(this, "stateTriangle"), r(this, "stateBackward");
        }
        setCompiled(P) {
          if (dt(P)) {
            this.applyModernState(gt(P));
            return;
          }
          this.applyLegacyState(mt(P));
        }
        applyModernState(P) {
          this.points = P.points, this.pointsWeightBuffer = P.pointsWeightBuffer, this.strict_status = P.strictStatus, this.vertices_params = P.verticesParams, this.centroid = P.centroid, this.edges = P.edges, this.edgeNodes = P.edgeNodes || [], this.tins = P.tins, this.addIndexedTin(), this.kinks = P.kinks, this.yaxisMode = P.yaxisMode ?? ee.YAXIS_INVERT, this.vertexMode = P.vertexMode ?? ee.VERTEX_PLAIN, this.strictMode = P.strictMode ?? ee.MODE_AUTO, P.bounds ? (this.bounds = P.bounds, this.boundsPolygon = P.boundsPolygon, this.xy = P.xy, this.wh = P.wh) : (this.bounds = void 0, this.boundsPolygon = void 0, this.xy = P.xy ?? [0, 0], P.wh && (this.wh = P.wh));
        }
        applyLegacyState(P) {
          this.tins = P.tins, this.addIndexedTin(), this.strict_status = P.strictStatus, this.pointsWeightBuffer = P.pointsWeightBuffer, this.vertices_params = P.verticesParams, this.centroid = P.centroid, this.kinks = P.kinks, this.points = P.points;
        }
        addIndexedTin() {
          const P = this.tins, C = P.forw, $ = P.bakw, tt = Math.ceil(Math.sqrt(C.features.length));
          if (tt < 3) {
            this.indexedTins = void 0;
            return;
          }
          let G = [], et = [];
          const st = C.features.map((nt) => {
            let H = [];
            return g(nt)[0].map((W) => {
              G.length === 0 ? G = [Array.from(W), Array.from(W)] : (W[0] < G[0][0] && (G[0][0] = W[0]), W[0] > G[1][0] && (G[1][0] = W[0]), W[1] < G[0][1] && (G[0][1] = W[1]), W[1] > G[1][1] && (G[1][1] = W[1])), H.length === 0 ? H = [Array.from(W), Array.from(W)] : (W[0] < H[0][0] && (H[0][0] = W[0]), W[0] > H[1][0] && (H[1][0] = W[0]), W[1] < H[0][1] && (H[0][1] = W[1]), W[1] > H[1][1] && (H[1][1] = W[1]));
            }), H;
          }), it = (G[1][0] - G[0][0]) / tt, at = (G[1][1] - G[0][1]) / tt, ft = st.reduce((nt, H, W) => {
            const wt = B(H[0][0], G[0][0], it, tt), At = B(H[1][0], G[0][0], it, tt), Ot = B(H[0][1], G[0][1], at, tt), Nt = B(H[1][1], G[0][1], at, tt);
            for (let yt = wt; yt <= At; yt++) {
              nt[yt] || (nt[yt] = []);
              for (let Pt = Ot; Pt <= Nt; Pt++) nt[yt][Pt] || (nt[yt][Pt] = []), nt[yt][Pt].push(W);
            }
            return nt;
          }, []), J = $.features.map((nt) => {
            let H = [];
            return g(nt)[0].map((W) => {
              et.length === 0 ? et = [Array.from(W), Array.from(W)] : (W[0] < et[0][0] && (et[0][0] = W[0]), W[0] > et[1][0] && (et[1][0] = W[0]), W[1] < et[0][1] && (et[0][1] = W[1]), W[1] > et[1][1] && (et[1][1] = W[1])), H.length === 0 ? H = [Array.from(W), Array.from(W)] : (W[0] < H[0][0] && (H[0][0] = W[0]), W[0] > H[1][0] && (H[1][0] = W[0]), W[1] < H[0][1] && (H[0][1] = W[1]), W[1] > H[1][1] && (H[1][1] = W[1]));
            }), H;
          }), Z = (et[1][0] - et[0][0]) / tt, lt = (et[1][1] - et[0][1]) / tt, xt = J.reduce((nt, H, W) => {
            const wt = B(H[0][0], et[0][0], Z, tt), At = B(H[1][0], et[0][0], Z, tt), Ot = B(H[0][1], et[0][1], lt, tt), Nt = B(H[1][1], et[0][1], lt, tt);
            for (let yt = wt; yt <= At; yt++) {
              nt[yt] || (nt[yt] = []);
              for (let Pt = Ot; Pt <= Nt; Pt++) nt[yt][Pt] || (nt[yt][Pt] = []), nt[yt][Pt].push(W);
            }
            return nt;
          }, []);
          this.indexedTins = { forw: { gridNum: tt, xOrigin: G[0][0], yOrigin: G[0][1], xUnit: it, yUnit: at, gridCache: ft }, bakw: { gridNum: tt, xOrigin: et[0][0], yOrigin: et[0][1], xUnit: Z, yUnit: lt, gridCache: xt } };
        }
        transform(P, C, $) {
          if (C && this.strict_status == ee.STATUS_ERROR) throw 'Backward transform is not allowed if strict_status == "strict_error"';
          this.yaxisMode == ee.YAXIS_FOLLOW && C && (P = [P[0], -1 * P[1]]);
          const tt = a(P);
          if (this.bounds && !C && !$ && !E(tt, this.boundsPolygon)) return !1;
          const G = C ? this.tins.bakw : this.tins.forw, et = C ? this.indexedTins.bakw : this.indexedTins.forw, st = C ? this.vertices_params.bakw : this.vertices_params.forw, it = C ? this.centroid.bakw : this.centroid.forw, at = C ? this.pointsWeightBuffer.bakw : this.pointsWeightBuffer.forw;
          let ft, J;
          this.stateFull && (this.stateBackward == C ? ft = this.stateTriangle : (this.stateBackward = C, this.stateTriangle = void 0), J = (lt) => {
            this.stateTriangle = lt;
          });
          let Z = w(tt, G, et, st, it, at, ft, J);
          if (this.bounds && C && !$) {
            const lt = a(Z);
            if (!E(lt, this.boundsPolygon)) return !1;
          } else this.yaxisMode == ee.YAXIS_FOLLOW && !C && (Z = [Z[0], -1 * Z[1]]);
          return Z;
        }
      };
      r(qt, "VERTEX_PLAIN", "plain"), r(qt, "VERTEX_BIRDEYE", "birdeye"), r(qt, "MODE_STRICT", "strict"), r(qt, "MODE_AUTO", "auto"), r(qt, "MODE_LOOSE", "loose"), r(qt, "STATUS_STRICT", "strict"), r(qt, "STATUS_ERROR", "strict_error"), r(qt, "STATUS_LOOSE", "loose"), r(qt, "YAXIS_FOLLOW", "follow"), r(qt, "YAXIS_INVERT", "invert");
      let Pe = qt;
      t.Transform = Pe, t.counterTri = Q, t.format_version = Ge, t.normalizeEdges = U, t.rotateVerticesTriangle = z, t.transformArr = w, Object.defineProperty(t, Symbol.toStringTag, { value: "Module" });
    });
  })(ke, ke.exports)), ke.exports;
}
var zt = jr();
const On = Math.pow(2, -52), Fe = new Uint32Array(512);
class fn {
  static from(e, t = Jr, n = Kr) {
    const i = e.length, r = new Float64Array(i * 2);
    for (let o = 0; o < i; o++) {
      const a = e[o];
      r[2 * o] = t(a), r[2 * o + 1] = n(a);
    }
    return new fn(r);
  }
  constructor(e) {
    const t = e.length >> 1;
    if (t > 0 && typeof e[0] != "number") throw new Error("Expected coords to contain numbers.");
    this.coords = e;
    const n = Math.max(2 * t - 5, 0);
    this._triangles = new Uint32Array(n * 3), this._halfedges = new Int32Array(n * 3), this._hashSize = Math.ceil(Math.sqrt(t)), this._hullPrev = new Uint32Array(t), this._hullNext = new Uint32Array(t), this._hullTri = new Uint32Array(t), this._hullHash = new Int32Array(this._hashSize), this._ids = new Uint32Array(t), this._dists = new Float64Array(t), this.update();
  }
  update() {
    const { coords: e, _hullPrev: t, _hullNext: n, _hullTri: i, _hullHash: r } = this, o = e.length >> 1;
    let a = 1 / 0, c = 1 / 0, h = -1 / 0, u = -1 / 0;
    for (let S = 0; S < o; S++) {
      const O = e[2 * S], X = e[2 * S + 1];
      O < a && (a = O), X < c && (c = X), O > h && (h = O), X > u && (u = X), this._ids[S] = S;
    }
    const f = (a + h) / 2, g = (c + u) / 2;
    let m, x, b;
    for (let S = 0, O = 1 / 0; S < o; S++) {
      const X = an(f, g, e[2 * S], e[2 * S + 1]);
      X < O && (m = S, O = X);
    }
    const Y = e[2 * m], R = e[2 * m + 1];
    for (let S = 0, O = 1 / 0; S < o; S++) {
      if (S === m) continue;
      const X = an(Y, R, e[2 * S], e[2 * S + 1]);
      X < O && X > 0 && (x = S, O = X);
    }
    let d = e[2 * x], y = e[2 * x + 1], l = 1 / 0;
    for (let S = 0; S < o; S++) {
      if (S === m || S === x) continue;
      const O = Vr(Y, R, d, y, e[2 * S], e[2 * S + 1]);
      O < l && (b = S, l = O);
    }
    let v = e[2 * b], M = e[2 * b + 1];
    if (l === 1 / 0) {
      for (let X = 0; X < o; X++)
        this._dists[X] = e[2 * X] - e[0] || e[2 * X + 1] - e[1];
      ve(this._ids, this._dists, 0, o - 1);
      const S = new Uint32Array(o);
      let O = 0;
      for (let X = 0, L = -1 / 0; X < o; X++) {
        const K = this._ids[X], p = this._dists[K];
        p > L && (S[O++] = K, L = p);
      }
      this.hull = S.subarray(0, O), this.triangles = new Uint32Array(0), this.halfedges = new Uint32Array(0);
      return;
    }
    if (ne(Y, R, d, y, v, M) < 0) {
      const S = x, O = d, X = y;
      x = b, d = v, y = M, b = S, v = O, M = X;
    }
    const A = Wr(Y, R, d, y, v, M);
    this._cx = A.x, this._cy = A.y;
    for (let S = 0; S < o; S++)
      this._dists[S] = an(e[2 * S], e[2 * S + 1], A.x, A.y);
    ve(this._ids, this._dists, 0, o - 1), this._hullStart = m;
    let T = 3;
    n[m] = t[b] = x, n[x] = t[m] = b, n[b] = t[x] = m, i[m] = 0, i[x] = 1, i[b] = 2, r.fill(-1), r[this._hashKey(Y, R)] = m, r[this._hashKey(d, y)] = x, r[this._hashKey(v, M)] = b, this.trianglesLen = 0, this._addTriangle(m, x, b, -1, -1, -1);
    for (let S = 0, O, X; S < this._ids.length; S++) {
      const L = this._ids[S], K = e[2 * L], p = e[2 * L + 1];
      if (S > 0 && Math.abs(K - O) <= On && Math.abs(p - X) <= On || (O = K, X = p, L === m || L === x || L === b)) continue;
      let E = 0;
      for (let w = 0, B = this._hashKey(K, p); w < this._hashSize && (E = r[(B + w) % this._hashSize], !(E !== -1 && E !== n[E])); w++)
        ;
      E = t[E];
      let _ = E, I;
      for (; I = n[_], ne(K, p, e[2 * _], e[2 * _ + 1], e[2 * I], e[2 * I + 1]) >= 0; )
        if (_ = I, _ === E) {
          _ = -1;
          break;
        }
      if (_ === -1) continue;
      let N = this._addTriangle(_, L, n[_], -1, -1, i[_]);
      i[L] = this._legalize(N + 2), i[_] = N, T++;
      let D = n[_];
      for (; I = n[D], ne(K, p, e[2 * D], e[2 * D + 1], e[2 * I], e[2 * I + 1]) < 0; )
        N = this._addTriangle(D, L, I, i[L], -1, i[D]), i[L] = this._legalize(N + 2), n[D] = D, T--, D = I;
      if (_ === E)
        for (; I = t[_], ne(K, p, e[2 * I], e[2 * I + 1], e[2 * _], e[2 * _ + 1]) < 0; )
          N = this._addTriangle(I, L, _, -1, i[_], i[I]), this._legalize(N + 2), i[I] = N, n[_] = _, T--, _ = I;
      this._hullStart = t[L] = _, n[_] = t[D] = L, n[L] = D, r[this._hashKey(K, p)] = L, r[this._hashKey(e[2 * _], e[2 * _ + 1])] = _;
    }
    this.hull = new Uint32Array(T);
    for (let S = 0, O = this._hullStart; S < T; S++)
      this.hull[S] = O, O = n[O];
    this.triangles = this._triangles.subarray(0, this.trianglesLen), this.halfedges = this._halfedges.subarray(0, this.trianglesLen);
  }
  _hashKey(e, t) {
    return Math.floor(Ur(e - this._cx, t - this._cy) * this._hashSize) % this._hashSize;
  }
  _legalize(e) {
    const { _triangles: t, _halfedges: n, coords: i } = this;
    let r = 0, o = 0;
    for (; ; ) {
      const a = n[e], c = e - e % 3;
      if (o = c + (e + 2) % 3, a === -1) {
        if (r === 0) break;
        e = Fe[--r];
        continue;
      }
      const h = a - a % 3, u = c + (e + 1) % 3, f = h + (a + 2) % 3, g = t[o], m = t[e], x = t[u], b = t[f];
      if (zr(
        i[2 * g],
        i[2 * g + 1],
        i[2 * m],
        i[2 * m + 1],
        i[2 * x],
        i[2 * x + 1],
        i[2 * b],
        i[2 * b + 1]
      )) {
        t[e] = b, t[a] = g;
        const R = n[f];
        if (R === -1) {
          let y = this._hullStart;
          do {
            if (this._hullTri[y] === f) {
              this._hullTri[y] = e;
              break;
            }
            y = this._hullPrev[y];
          } while (y !== this._hullStart);
        }
        this._link(e, R), this._link(a, n[o]), this._link(o, f);
        const d = h + (a + 1) % 3;
        r < Fe.length && (Fe[r++] = d);
      } else {
        if (r === 0) break;
        e = Fe[--r];
      }
    }
    return o;
  }
  _link(e, t) {
    this._halfedges[e] = t, t !== -1 && (this._halfedges[t] = e);
  }
  // add a new triangle given vertex indices and adjacent half-edge ids
  _addTriangle(e, t, n, i, r, o) {
    const a = this.trianglesLen;
    return this._triangles[a] = e, this._triangles[a + 1] = t, this._triangles[a + 2] = n, this._link(a, i), this._link(a + 1, r), this._link(a + 2, o), this.trianglesLen += 3, a;
  }
}
function Ur(s, e) {
  const t = s / (Math.abs(s) + Math.abs(e));
  return (e > 0 ? 3 - t : 1 + t) / 4;
}
function an(s, e, t, n) {
  const i = s - t, r = e - n;
  return i * i + r * r;
}
function zr(s, e, t, n, i, r, o, a) {
  const c = s - o, h = e - a, u = t - o, f = n - a, g = i - o, m = r - a, x = c * c + h * h, b = u * u + f * f, Y = g * g + m * m;
  return c * (f * Y - b * m) - h * (u * Y - b * g) + x * (u * m - f * g) < 0;
}
function Vr(s, e, t, n, i, r) {
  const o = t - s, a = n - e, c = i - s, h = r - e, u = o * o + a * a, f = c * c + h * h, g = 0.5 / (o * h - a * c), m = (h * u - a * f) * g, x = (o * f - c * u) * g;
  return m * m + x * x;
}
function Wr(s, e, t, n, i, r) {
  const o = t - s, a = n - e, c = i - s, h = r - e, u = o * o + a * a, f = c * c + h * h, g = 0.5 / (o * h - a * c), m = s + (h * u - a * f) * g, x = e + (o * f - c * u) * g;
  return { x: m, y: x };
}
function ve(s, e, t, n) {
  if (n - t <= 20)
    for (let i = t + 1; i <= n; i++) {
      const r = s[i], o = e[r];
      let a = i - 1;
      for (; a >= t && e[s[a]] > o; ) s[a + 1] = s[a--];
      s[a + 1] = r;
    }
  else {
    const i = t + n >> 1;
    let r = t + 1, o = n;
    Me(s, i, r), e[s[t]] > e[s[n]] && Me(s, t, n), e[s[r]] > e[s[n]] && Me(s, r, n), e[s[t]] > e[s[r]] && Me(s, t, r);
    const a = s[r], c = e[a];
    for (; ; ) {
      do
        r++;
      while (e[s[r]] < c);
      do
        o--;
      while (e[s[o]] > c);
      if (o < r) break;
      Me(s, r, o);
    }
    s[t + 1] = s[o], s[o] = a, n - r + 1 >= o - t ? (ve(s, e, r, n), ve(s, e, t, o - 1)) : (ve(s, e, t, o - 1), ve(s, e, r, n));
  }
}
function Me(s, e, t) {
  const n = s[e];
  s[e] = s[t], s[t] = n;
}
function Jr(s) {
  return s[0];
}
function Kr(s) {
  return s[1];
}
class Gr {
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
    const t = Math.floor(e / this.width), n = e % this.width;
    return this.bs[t] |= 1 << n, this;
  }
  /**
   * Delete a number from the set.
   *
   * @param idx The number to delete. Must be 0 <= idx < len.
   */
  delete(e) {
    const t = Math.floor(e / this.width), n = e % this.width;
    return this.bs[t] &= ~(1 << n), this;
  }
  /**
   * Add or delete a number in the set, depending on the second argument.
   *
   * @param idx The number to add or delete. Must be 0 <= idx < len.
   * @param val If true, add the number, otherwise delete.
   */
  set(e, t) {
    const n = Math.floor(e / this.width), r = 1 << e % this.width;
    return this.bs[n] ^= (-Number(t) ^ this.bs[n]) & r, t;
  }
  /**
   * Whether the number is in the set.
   *
   * @param idx The number to test. Must be 0 <= idx < len.
   */
  has(e) {
    const t = Math.floor(e / this.width), n = e % this.width;
    return (this.bs[t] & 1 << n) !== 0;
  }
  /**
   * Iterate over the numbers that are in the set.
   */
  forEach(e) {
    const t = this.bs.length;
    for (let n = 0; n < t; n++) {
      let i = 0;
      for (; this.bs[n] && i < this.width; )
        this.bs[n] & 1 << i && e(n * this.width + i), i++;
    }
    return this;
  }
}
class Bn extends Gr {
  constructor(e) {
    super(8, new Uint8Array(Math.ceil(e / 8)).fill(0));
  }
}
function me(s) {
  return s % 3 === 2 ? s - 2 : s + 1;
}
function re(s) {
  return s % 3 === 0 ? s + 2 : s - 1;
}
function Pn(s, e, t, n, i, r, o, a) {
  const c = ne(s, e, i, r, o, a), h = ne(t, n, i, r, o, a);
  if (c > 0 && h > 0 || c < 0 && h < 0)
    return !1;
  const u = ne(i, r, s, e, t, n), f = ne(o, a, s, e, t, n);
  return u > 0 && f > 0 || u < 0 && f < 0 ? !1 : c === 0 && h === 0 && u === 0 && f === 0 ? !(Math.max(i, o) < Math.min(s, t) || Math.max(s, t) < Math.min(i, o) || Math.max(r, a) < Math.min(e, n) || Math.max(e, n) < Math.min(r, a)) : !0;
}
class Qr {
  constructor(e) {
    /**
     * The triangulation object from Delaunator.
     */
    bt(this, "del");
    this.del = e;
  }
}
class jn extends Qr {
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
    bt(this, "vertMap");
    bt(this, "flips");
    bt(this, "consd");
    const i = 2 ** 32 - 1, r = t.coords.length >> 1, o = t.triangles.length;
    this.vertMap = new Uint32Array(r).fill(i), this.flips = new Bn(o), this.consd = new Bn(o);
    for (let a = 0; a < o; a++) {
      const c = t.triangles[a];
      this.vertMap[c] === i && this.updateVert(a);
    }
    n && this.constrainAll(n);
  }
  /**
   * Constrain the triangulation such that there is an edge between p1 and p2.
   */
  constrainOne(t, n) {
    const { triangles: i, halfedges: r } = this.del, o = this.vertMap[t];
    let a = o;
    do {
      const u = i[a], f = me(a);
      if (u === n)
        return this.protect(a);
      const g = re(a), m = i[g];
      if (m === n)
        return this.protect(f), f;
      if (this.intersectSegments(t, n, m, u)) {
        a = g;
        break;
      }
      a = r[f];
    } while (a !== -1 && a !== o);
    let c = a, h = -1;
    for (; a !== -1; ) {
      const u = r[a], f = re(a), g = re(u), m = me(u);
      if (u === -1)
        throw new Error("Constraining edge exited the hull");
      if (this.consd.has(a))
        throw new Error("Edge intersects already constrained edge");
      if (this.isCollinear(t, n, i[a]) || this.isCollinear(t, n, i[u]))
        throw new Error("Constraining edge intersects point");
      if (!this.intersectSegments(
        i[a],
        i[u],
        i[f],
        i[g]
      )) {
        if (h === -1 && (h = a), i[g] === n) {
          if (a === h)
            throw new Error("Infinite loop: non-convex quadrilateral");
          a = h, h = -1;
          continue;
        }
        if (this.intersectSegments(
          t,
          n,
          i[g],
          i[u]
        ))
          a = g;
        else if (this.intersectSegments(
          t,
          n,
          i[m],
          i[g]
        ))
          a = m;
        else if (h === a)
          throw new Error("Infinite loop: no further intersect after non-convex");
        continue;
      }
      if (this.flipDiagonal(a), this.intersectSegments(
        t,
        n,
        i[f],
        i[g]
      ) && (h === -1 && (h = f), h === f))
        throw new Error("Infinite loop: flipped diagonal still intersects");
      i[g] === n ? (c = g, a = h, h = -1) : this.intersectSegments(
        t,
        n,
        i[m],
        i[g]
      ) && (a = m);
    }
    return this.protect(c), this.delaunify(!0), this.findEdge(t, n);
  }
  /**
   * Fix the Delaunay condition.
   */
  delaunify(t = !1) {
    const { halfedges: n } = this.del, i = this.flips, r = this.consd, o = n.length;
    let a;
    do {
      a = 0;
      for (let c = 0; c < o; c++) {
        if (r.has(c))
          continue;
        i.delete(c);
        const h = n[c];
        h !== -1 && (i.delete(h), this.isDelaunay(c) || (this.flipDiagonal(c), a++));
      }
    } while (t && a > 0);
    return this;
  }
  /**
   * Call constrainOne on each edge.
   */
  constrainAll(t) {
    const n = t.length;
    for (let i = 0; i < n; i++) {
      const r = t[i];
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
  findEdge(t, n) {
    const i = this.vertMap[n], { triangles: r, halfedges: o } = this.del;
    let a = i, c = -1;
    do {
      if (r[a] === t)
        return a;
      c = me(a), a = o[c];
    } while (a !== -1 && a !== i);
    return r[me(c)] === t ? -c : 1 / 0;
  }
  /**
   * Mark an edge as constrained, i.e. should not be touched by `delaunify`.
   */
  protect(t) {
    const n = this.del.halfedges[t], i = this.flips, r = this.consd;
    return i.delete(t), r.add(t), n !== -1 ? (i.delete(n), r.add(n), n) : -t;
  }
  /**
   * Mark an edge as flipped unless constrained.
   */
  markFlip(t) {
    const n = this.del.halfedges, i = this.flips;
    if (this.consd.has(t))
      return !1;
    const o = n[t];
    return o !== -1 && (i.add(t), i.add(o)), !0;
  }
  /**
   * Flip the edge shared by two triangles.
   */
  flipDiagonal(t) {
    const { triangles: n, halfedges: i } = this.del, r = this.flips, o = this.consd, a = i[t], c = re(t), h = me(t), u = re(a), f = me(a), g = i[c], m = i[u];
    if (o.has(t))
      throw new Error("Trying to flip a constrained edge");
    return n[t] = n[u], i[t] = m, r.set(t, r.has(u)) || o.set(t, o.has(u)), m !== -1 && (i[m] = t), i[c] = u, n[a] = n[c], i[a] = g, r.set(a, r.has(c)) || o.set(a, o.has(c)), g !== -1 && (i[g] = a), i[u] = c, this.markFlip(t), this.markFlip(h), this.markFlip(a), this.markFlip(f), r.add(c), o.delete(c), r.add(u), o.delete(u), this.updateVert(t), this.updateVert(h), this.updateVert(a), this.updateVert(f), c;
  }
  /**
   * Whether point p1, p2, and p are collinear.
   */
  isCollinear(t, n, i) {
    const r = this.del.coords;
    return ne(
      r[t * 2],
      r[t * 2 + 1],
      r[n * 2],
      r[n * 2 + 1],
      r[i * 2],
      r[i * 2 + 1]
    ) === 0;
  }
  /**
   * Whether the triangle formed by p1, p2, p3 keeps px outside the circumcircle.
   */
  inCircle(t, n, i, r) {
    const o = this.del.coords;
    return lr(
      o[t * 2],
      o[t * 2 + 1],
      o[n * 2],
      o[n * 2 + 1],
      o[i * 2],
      o[i * 2 + 1],
      o[r * 2],
      o[r * 2 + 1]
    ) < 0;
  }
  /**
   * Whether the triangles sharing edg conform to the Delaunay condition.
   */
  isDelaunay(t) {
    const { triangles: n, halfedges: i } = this.del, r = i[t];
    if (r === -1)
      return !0;
    const o = n[re(t)], a = n[t], c = n[me(t)], h = n[re(r)];
    return !this.inCircle(o, a, c, h);
  }
  /**
   * Update the vertex -> incoming edge map.
   */
  updateVert(t) {
    const { triangles: n, halfedges: i } = this.del, r = this.vertMap, o = n[t];
    let a = re(t), c = i[a];
    for (; c !== -1 && c !== t; )
      a = re(c), c = i[a];
    return r[o] = a, a;
  }
  /**
   * Whether the segments between vertices intersect.
   */
  intersectSegments(t, n, i, r) {
    const o = this.del.coords;
    return t === i || t === r || n === i || n === r ? !1 : Pn(
      o[t * 2],
      o[t * 2 + 1],
      o[n * 2],
      o[n * 2 + 1],
      o[i * 2],
      o[i * 2 + 1],
      o[r * 2],
      o[r * 2 + 1]
    );
  }
}
bt(jn, "intersectSegments", Pn);
function Le(s, e, t) {
  if (e || (e = []), typeof s != "object" || s.type !== "FeatureCollection")
    throw "Argument points must be FeatureCollection";
  if (!Array.isArray(e)) throw "Argument points must be Array of Array";
  const n = s.features.map(
    (c) => c.geometry.coordinates
  ), i = fn.from(n);
  let r;
  const o = [];
  i.triangles.length !== 0 && e.length !== 0 && (r = new jn(i), r.constrainAll(e));
  for (let c = 0; c < i.triangles.length; c += 3)
    o.push([i.triangles[c], i.triangles[c + 1], i.triangles[c + 2]]);
  const a = ["a", "b", "c"];
  return Gt(
    o.map((c) => {
      const h = {}, u = c.map((f, g) => {
        const m = s.features[f], x = m.geometry.coordinates, b = [x[0], x[1]];
        return x.length === 3 ? b[2] = x[2] : h[a[g]] = m.properties[t], b;
      });
      return u[3] = u[0], Be([u], h);
    })
  );
}
function Un(s, e, t, n, i, r) {
  return Object.keys(s).reduce((o, a) => {
    const c = s[a], h = c.forw, u = c.bakw, f = {
      forw: [h[0] - e.forw[0], h[1] - e.forw[1]],
      bakw: [u[0] - e.bakw[0], u[1] - e.bakw[1]]
    }, g = f.forw[0] === 0 ? 1 / 0 : ((f.forw[0] < 0 ? t : n) - e.forw[0]) / f.forw[0], m = f.forw[1] === 0 ? 1 / 0 : ((f.forw[1] < 0 ? i : r) - e.forw[1]) / f.forw[1];
    if (Math.abs(g) / Math.abs(m) < 1.1) {
      const x = {
        forw: [
          f.forw[0] * g + e.forw[0],
          f.forw[1] * g + e.forw[1]
        ],
        bakw: [
          f.bakw[0] * g + e.bakw[0],
          f.bakw[1] * g + e.bakw[1]
        ]
      };
      f.forw[0] < 0 ? o[3].push(x) : o[1].push(x);
    }
    if (Math.abs(m) / Math.abs(g) < 1.1) {
      const x = {
        forw: [
          f.forw[0] * m + e.forw[0],
          f.forw[1] * m + e.forw[1]
        ],
        bakw: [
          f.bakw[0] * m + e.bakw[0],
          f.bakw[1] * m + e.bakw[1]
        ]
      };
      f.forw[1] < 0 ? o[0].push(x) : o[2].push(x);
    }
    return o;
  }, [[], [], [], []]);
}
function Hr(s, e) {
  const t = [[], [], [], []], n = [];
  return Object.keys(s).forEach((i) => {
    const r = s[i], o = r.forw, a = r.bakw, c = [
      o[0] - e.forw[0],
      o[1] - e.forw[1]
    ], h = [
      a[0] - e.bakw[0],
      e.bakw[1] - a[1]
    ], u = { forw: c, bakw: h };
    if (n.push(u), c[0] === 0 || c[1] === 0)
      return;
    let f = 0;
    c[0] > 0 && (f += 1), c[1] > 0 && (f += 2), t[f].push(u);
  }), { perQuad: t, aggregate: n };
}
function Zr(s) {
  let e = 1 / 0, t = 0, n = 0;
  return s.forEach((i) => {
    const { forw: r, bakw: o } = i, a = Math.hypot(r[0], r[1]), c = Math.hypot(o[0], o[1]);
    if (c === 0) return;
    const h = a / c, u = Math.atan2(r[0], r[1]) - Math.atan2(o[0], o[1]);
    e = Math.min(e, h), t += Math.cos(u), n += Math.sin(u);
  }), isFinite(e) ? [e, Math.atan2(n, t)] : [1, 0];
}
function zn(s, e, t) {
  const { perQuad: n, aggregate: i } = Hr(s, e), r = n.every((c) => c.length > 0), a = (t === "birdeye" ? r ? n : [i] : [i]).map((c) => Zr(c));
  return a.length === 1 ? [a[0], a[0], a[0], a[0]] : a;
}
function ti(s, e, t) {
  const n = [1, 1, 1, 1];
  for (let i = 0; i < 4; i++) {
    const r = (i + 1) % 4, o = pn([s[i].bakw, s[r].bakw]);
    e[i].map((a) => {
      const c = pn([t.bakw, a.bakw]), h = Sr(o, c);
      if (h.features.length > 0 && h.features[0].geometry) {
        const u = h.features[0], f = Math.sqrt(
          Math.pow(a.bakw[0] - t.bakw[0], 2) + Math.pow(a.bakw[1] - t.bakw[1], 2)
        ), g = Math.sqrt(
          Math.pow(
            u.geometry.coordinates[0] - t.bakw[0],
            2
          ) + Math.pow(
            u.geometry.coordinates[1] - t.bakw[1],
            2
          )
        ), m = f / g;
        m > n[i] && (n[i] = m), m > n[r] && (n[r] = m);
      }
    });
  }
  s.forEach((i, r) => {
    const o = n[r], a = [
      (i.bakw[0] - t.bakw[0]) * o + t.bakw[0],
      (i.bakw[1] - t.bakw[1]) * o + t.bakw[1]
    ];
    i.bakw = a;
  });
}
function Vn(s, e, t, n) {
  const i = s.map((o, a) => {
    const c = e[a], h = [
      c[0] - t.forw[0],
      c[1] - t.forw[1]
    ], f = Math.sqrt(
      Math.pow(h[0], 2) + Math.pow(h[1], 2)
    ) / o[0], g = Math.atan2(h[0], h[1]) - o[1], m = [
      t.bakw[0] + f * Math.sin(g),
      t.bakw[1] - f * Math.cos(g)
    ];
    return { forw: c, bakw: m };
  }), r = i[2];
  return i[2] = i[3], i[3] = r, ti(i, n, t), i;
}
function ei(s) {
  const { convexBuf: e, centroid: t, bbox: n, minx: i, maxx: r, miny: o, maxy: a } = s, c = Un(e, t, i, r, o, a), h = zn(e, t, "plain");
  return Vn(h, n, t, c);
}
function ni(s) {
  const { convexBuf: e, centroid: t, bbox: n, minx: i, maxx: r, miny: o, maxy: a } = s, c = Un(e, t, i, r, o, a), h = zn(e, t, "birdeye");
  return Vn(h, n, t, c);
}
function ri(s) {
  const t = new ii(s).findSegmentIntersections(), n = Kn(t), i = /* @__PURE__ */ new Map();
  return n.forEach((r) => {
    i.set(`${r.x}:${r.y}`, r);
  }), Array.from(i.values()).map(
    (r) => ge([r.x, r.y])
  );
}
class ii {
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
    const t = [], n = [], i = e.map((r) => {
      const o = r ? r.length : 0;
      for (let a = 0; a < o; a++)
        t.push(r[a][0]), n.push(r[a][1]);
      return o;
    });
    this.initXYData(i, t, n);
  }
  initXYData(e, t, n) {
    const i = e.length;
    this._xx = new Float64Array(t), this._yy = new Float64Array(n), this._nn = new Uint32Array(e), this._zz = null, this._zlimit = 0, this._filteredArcIter = null, this._ii = new Uint32Array(i);
    let r = 0;
    for (let o = 0; o < i; o++)
      this._ii[o] = r, r += e[o];
    (r != this._xx.length || this._xx.length != this._yy.length) && un("ArcCollection#initXYData() Counting error"), this.initBounds(), this._arcIter = new Si(this._xx, this._yy);
  }
  initBounds() {
    const e = this.calcArcBounds_(this._xx, this._yy, this._nn);
    this._bb = e.bb, this._allBounds = e.bounds;
  }
  /**
   * データの境界を計算
   * @returns バウンディングボックス情報
   */
  calcArcBounds_(e, t, n) {
    const i = n.length, r = new Float64Array(i * 4), o = new Oe();
    let a = 0, c, h, u;
    for (let f = 0; f < i; f++)
      c = n[f], c > 0 && (h = f * 4, u = ki(e, t, a, c), r[h++] = u[0], r[h++] = u[1], r[h++] = u[2], r[h] = u[3], a += c, o.mergeBounds(u));
    return {
      bb: r,
      bounds: o
    };
  }
  getBounds() {
    return this._allBounds ? this._allBounds.clone() : new Oe();
  }
  // @cb function(i, j, xx, yy)
  forEachSegment(e) {
    let t = 0;
    for (let n = 0, i = this.size(); n < i; n++)
      t += this.forEachArcSegment(n, e);
    return t;
  }
  size() {
    return this._ii && this._ii.length || 0;
  }
  // @cb function(i, j, xx, yy)
  forEachArcSegment(e, t) {
    const n = e >= 0, i = n ? e : ~e, r = this.getRetainedInterval(), o = this._nn[i], a = n ? 1 : -1;
    let c = n ? this._ii[i] : this._ii[i] + o - 1, h = c, u = 0;
    for (let f = 1; f < o; f++)
      h += a, (r === 0 || this._zz[h] >= r) && (t(c, h, this._xx, this._yy), c = h, u++);
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
    const n = this.forEachSegment(
      (i, r, o, a) => {
        e += Math.abs(o[i] - o[r]), t += Math.abs(a[i] - a[r]);
      }
    );
    return [e / n || 0, t / n || 0];
  }
  /**
   * 交差判定のためのストライプ数を計算
   * 線分の平均長さに基づいて最適な分割数を決定
   */
  calcSegmentIntersectionStripeCount() {
    const e = this.getBounds().height(), t = this.getAvgSegment2()[1];
    let n = 1;
    return t > 0 && e > 0 && (n = Math.ceil(e / t / 20)), n || 1;
  }
  /**
   * 線分の交差を検出
   * ストライプ分割による効率的な判定を実装
   *
   * @returns 検出された交差点の配列
   */
  findSegmentIntersections() {
    const e = this.getBounds(), t = e.ymin || 0, n = (e.ymax || 0) - t, i = this.calcSegmentIntersectionStripeCount(), r = new Uint32Array(i), o = i > 1 ? (b) => Math.floor((i - 1) * (b - t) / n) : () => 0;
    let a, c;
    this.forEachSegment(
      (b, Y, R, d) => {
        let y = o(d[b]);
        const l = o(d[Y]);
        for (; r[y] = r[y] + 2, y != l; )
          y += l > y ? 1 : -1;
      }
    );
    const h = this.getUint32Array(ai(r));
    let u = 0;
    const f = [];
    ci(r, (b) => {
      const Y = u;
      u += b, f.push(h.subarray(Y, u));
    }), hi(r, 0), this.forEachSegment(
      (b, Y, R, d) => {
        let y = o(d[b]);
        const l = o(d[Y]);
        let v, M;
        for (; v = r[y], r[y] = v + 2, M = f[y], M[v] = b, M[v + 1] = Y, y != l; )
          y += l > y ? 1 : -1;
      }
    );
    const g = this.getVertexData(), m = [];
    let x;
    for (a = 0; a < i; a++)
      if (g.xx && g.yy)
        for (x = fi(f[a], g.xx, g.yy), c = 0; c < x.length; c++)
          m.push(x[c]);
    return Kn(m);
  }
}
function un(...s) {
  const e = s.join(" ");
  throw new Error(e);
}
function ln(s) {
  return s ? oi(s) ? !0 : si(s) ? !1 : s.length === 0 ? !0 : s.length > 0 : !1;
}
function si(s) {
  return s != null && s.toString === String.prototype.toString;
}
function oi(s) {
  return Array.isArray(s);
}
function ai(s, e) {
  ln(s) || un("utils.sum() expects an array, received:", s);
  let t = 0, n;
  for (let i = 0, r = s.length; i < r; i++)
    n = s[i], n && (t += n);
  return t;
}
function ci(s, e, t) {
  if (!ln(s))
    throw new Error(`#forEach() takes an array-like argument. ${s}`);
  for (let n = 0, i = s.length; n < i; n++)
    e.call(t, s[n], n);
}
function hi(s, e) {
  for (let t = 0, n = s.length; t < n; t++)
    s[t] = e;
  return s;
}
function fi(s, e, t) {
  const n = s.length - 2, i = [];
  let r, o, a, c, h, u, f, g, m, x, b, Y, R, d, y, l, v;
  for (bi(e, s), l = 0; l < n; ) {
    for (r = s[l], o = s[l + 1], h = e[r], u = e[o], m = t[r], x = t[o], v = l; v < n && (v += 2, a = s[v], f = e[a], !(u < f)); ) {
      if (b = t[a], c = s[v + 1], g = e[c], Y = t[c], m >= b) {
        if (m > Y && x > b && x > Y) continue;
      } else if (m < Y && x < b && x < Y) continue;
      r == a || r == c || o == a || o == c || (R = ui(
        h,
        m,
        u,
        x,
        f,
        b,
        g,
        Y
      ), R && (d = [r, o], y = [a, c], i.push(Tn(R, d, y, e, t)), R.length == 4 && i.push(
        Tn(R.slice(2), d, y, e, t)
      )));
    }
    l += 2;
  }
  return i;
}
function ui(s, e, t, n, i, r, o, a) {
  const c = li(s, e, t, n, i, r, o, a);
  let h = null;
  return c && (h = pi(s, e, t, n, i, r, o, a), h ? vi(s, e, t, n, i, r, o, a) && (h = null) : h = yi(s, e, t, n, i, r, o, a)), h;
}
function li(s, e, t, n, i, r, o, a) {
  return Ee(s, e, t, n, i, r) * Ee(s, e, t, n, o, a) <= 0 && Ee(i, r, o, a, s, e) * Ee(i, r, o, a, t, n) <= 0;
}
function Ee(s, e, t, n, i, r) {
  return Wn(s - i, e - r, t - i, n - r);
}
function Wn(s, e, t, n) {
  return s * n - e * t;
}
function pi(s, e, t, n, i, r, o, a) {
  let c = De(s, e, t, n, i, r, o, a), h;
  return c && (h = mi(c[0], c[1], s, e, t, n, i, r, o, a), h == 1 ? c = De(t, n, s, e, i, r, o, a) : h == 2 ? c = De(i, r, o, a, s, e, t, n) : h == 3 && (c = De(o, a, i, r, s, e, t, n))), c && wi(c, s, e, t, n, i, r, o, a), c;
}
function De(s, e, t, n, i, r, o, a) {
  const c = Wn(t - s, n - e, o - i, a - r), h = 1e-18;
  let u;
  if (c === 0) return null;
  const f = Ee(i, r, o, a, s, e) / c;
  return c <= h && c >= -h ? u = di(s, e, t, n, i, r, o, a) : u = [s + f * (t - s), e + f * (n - e)], u;
}
function di(s, e, t, n, i, r, o, a) {
  let c = null;
  return !ie(s, i, o) && !ie(e, r, a) ? c = [s, e] : !ie(t, i, o) && !ie(n, r, a) ? c = [t, n] : !ie(i, s, t) && !ie(r, e, n) ? c = [i, r] : !ie(o, s, t) && !ie(a, e, n) && (c = [o, a]), c;
}
function ie(s, e, t) {
  let n;
  return e < t ? n = s < e || s > t : e > t ? n = s > e || s < t : n = s != e, n;
}
function mi(s, e, ...t) {
  let n = -1, i = 1 / 0, r;
  for (let o = 0, a = 0, c = t.length; a < c; o++, a += 2)
    r = gi(s, e, t[a], t[a + 1]), r < i && (i = r, n = o);
  return n;
}
function gi(s, e, t, n) {
  const i = s - t, r = e - n;
  return i * i + r * r;
}
function wi(s, e, t, n, i, r, o, a, c) {
  let h = s[0], u = s[1];
  h = $e(h, e, n), h = $e(h, r, a), u = $e(u, t, i), u = $e(u, o, c), s[0] = h, s[1] = u;
}
function $e(s, e, t) {
  let n;
  return ie(s, e, t) && (n = Math.abs(s - e) < Math.abs(s - t) ? e : t, s = n), s;
}
function yi(s, e, t, n, i, r, o, a) {
  const c = Math.min(s, t, i, o), h = Math.max(s, t, i, o), u = Math.min(e, n, r, a), f = Math.max(e, n, r, a), g = f - u > h - c;
  let m = [];
  return (g ? he(e, u, f) : he(s, c, h)) && m.push(s, e), (g ? he(n, u, f) : he(t, c, h)) && m.push(t, n), (g ? he(r, u, f) : he(i, c, h)) && m.push(i, r), (g ? he(a, u, f) : he(o, c, h)) && m.push(o, a), (m.length != 2 && m.length != 4 || m.length == 4 && m[0] == m[2] && m[1] == m[3]) && (m = null), m;
}
function vi(s, e, t, n, i, r, o, a) {
  return s == i && e == r || s == o && e == a || t == i && n == r || t == o && n == a;
}
function he(s, e, t) {
  return s > e && s < t;
}
function bi(s, e) {
  _i(s, e), Jn(s, e, 0, e.length - 2);
}
function _i(s, e) {
  for (let t = 0, n = e.length; t < n; t += 2)
    s[e[t]] > s[e[t + 1]] && xi(e, t, t + 1);
}
function xi(s, e, t) {
  const n = s[e];
  s[e] = s[t], s[t] = n;
}
function Jn(s, e, t, n) {
  let i = t, r = n, o, a;
  for (; i < n; ) {
    for (o = s[e[t + n >> 2 << 1]]; i <= r; ) {
      for (; s[e[i]] < o; ) i += 2;
      for (; s[e[r]] > o; ) r -= 2;
      i <= r && (a = e[i], e[i] = e[r], e[r] = a, a = e[i + 1], e[i + 1] = e[r + 1], e[r + 1] = a, i += 2, r -= 2);
    }
    if (r - t < 40 ? In(s, e, t, r) : Jn(s, e, t, r), n - i < 40) {
      In(s, e, i, n);
      return;
    }
    t = i, r = n;
  }
}
function In(s, e, t, n) {
  let i, r;
  for (let o = t + 2; o <= n; o += 2) {
    i = e[o], r = e[o + 1];
    let a;
    for (a = o - 2; a >= t && s[i] < s[e[a]]; a -= 2)
      e[a + 2] = e[a], e[a + 3] = e[a + 1];
    e[a + 2] = i, e[a + 3] = r;
  }
}
function Tn(s, e, t, n, i) {
  const r = s[0], o = s[1];
  e = Nn(r, o, e[0], e[1], n, i), t = Nn(r, o, t[0], t[1], n, i);
  const a = e[0] < t[0] ? e : t, c = a == e ? t : e;
  return { x: r, y: o, a, b: c };
}
function Nn(s, e, t, n, i, r) {
  let o = t < n ? t : n, a = o === t ? n : t;
  return i[o] == s && r[o] == e ? a = o : i[a] == s && r[a] == e && (o = a), [o, a];
}
function Kn(s) {
  const e = {};
  return s.filter((t) => {
    const n = Mi(t);
    return n in e ? !1 : (e[n] = !0, !0);
  });
}
function Mi(s) {
  return `${s.a.join(",")};${s.b.join(",")}`;
}
class Si {
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
function ki(s, e, t, n) {
  let i = t | 0;
  const r = isNaN(n) ? s.length - i : n + i;
  let o, a, c, h, u, f;
  if (r > 0)
    c = u = s[i], h = f = e[i];
  else return [void 0, void 0, void 0, void 0];
  for (i++; i < r; i++)
    o = s[i], a = e[i], o < c && (c = o), o > u && (u = o), a < h && (h = a), a > f && (f = a);
  return [c, h, u, f];
}
class Oe {
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
    return new Oe(this.xmin, this.ymin, this.xmax, this.ymax);
  }
  width() {
    return this.xmax - this.xmin || 0;
  }
  height() {
    return this.ymax - this.ymin || 0;
  }
  setBounds(e, t, n, i) {
    return arguments.length == 1 && (ln(e) ? (t = e[1], n = e[2], i = e[3], e = e[0]) : (t = e.ymin, n = e.xmax, i = e.ymax, e = e.xmin)), this.xmin = e, this.ymin = t, this.xmax = n, this.ymax = i, (e > n || t > i) && this.update(), this;
  }
  update() {
    let e;
    this.xmin > this.xmax && (e = this.xmin, this.xmin = this.xmax, this.xmax = e), this.ymin > this.ymax && (e = this.ymin, this.ymin = this.ymax, this.ymax = e);
  }
  mergeBounds(e, ...t) {
    let n, i, r, o;
    return e instanceof Oe ? (n = e.xmin, i = e.ymin, r = e.xmax, o = e.ymax) : t.length == 3 ? (n = e, i = t[0], r = t[1], o = t[2]) : e.length == 4 ? (n = e[0], i = e[1], r = e[2], o = e[3]) : un("Bounds#mergeBounds() invalid argument:", e), this.xmin === void 0 ? this.setBounds(n, i, r, o) : (n < this.xmin && (this.xmin = n), i < this.ymin && (this.ymin = i), r > this.xmax && (this.xmax = r), o > this.ymax && (this.ymax = o)), this;
  }
}
function Ve(s) {
  const e = ["a", "b", "c"].map(
    (t) => s.properties[t].index
  );
  return [
    [0, 1],
    [0, 2],
    [1, 2],
    [0, 1, 2]
  ].map(
    (t) => t.map((n) => e[n]).sort().join("-")
  ).sort();
}
function Gn(s, e, t) {
  const n = Ve(e.forw), i = Ve(e.bakw);
  if (JSON.stringify(n) != JSON.stringify(i))
    throw `${JSON.stringify(e, null, 2)}
${JSON.stringify(
      n
    )}
${JSON.stringify(i)}`;
  for (let r = 0; r < n.length; r++) {
    const o = n[r];
    s[o] || (s[o] = []), s[o].push(e);
  }
  t && (t.forw.features.push(e.forw), t.bakw.features.push(e.bakw));
}
function Xn(s, e, t) {
  const n = Ve(e.forw), i = Ve(e.bakw);
  if (JSON.stringify(n) != JSON.stringify(i))
    throw `${JSON.stringify(e, null, 2)}
${JSON.stringify(n)}
${JSON.stringify(i)}`;
  if (n.forEach((r) => {
    const o = s[r];
    if (!o) return;
    const a = o.filter((c) => c !== e);
    a.length === 0 ? delete s[r] : s[r] = a;
  }), t) {
    const r = (o, a) => {
      !o || !a || (o.features = o.features.filter((c) => c !== a));
    };
    r(t.forw, e.forw), r(t.bakw, e.bakw);
  }
}
function qe(s, e, t) {
  return ge(s, { target: { geom: e, index: t } });
}
function je(s) {
  return ge(s.properties.target.geom, {
    target: {
      geom: s.geometry.coordinates,
      index: s.properties.target.index
    }
  });
}
function Yn(s, e) {
  const t = e.geometry.coordinates;
  return [0, 1, 2, 3].map((n) => {
    const i = (n + 1) % 4, r = s[n], o = s[i], a = r.geometry.coordinates, c = Math.atan2(
      a[0] - t[0],
      a[1] - t[1]
    ), h = [e, r, o, e].map(
      (g) => g.geometry.coordinates
    ), u = {
      a: {
        geom: e.properties.target.geom,
        index: e.properties.target.index
      },
      b: {
        geom: r.properties.target.geom,
        index: r.properties.target.index
      },
      c: {
        geom: o.properties.target.geom,
        index: o.properties.target.index
      }
    }, f = Gt([
      Be([h], u)
    ]);
    return [c, f];
  }).reduce(
    (n, i) => (n[0].push(i[0]), n[1].push(i[1]), n),
    [[], []]
  );
}
function Ei(s) {
  const { tins: e, targets: t, includeReciprocals: n } = s, i = {};
  t.forEach((o) => {
    const a = e[o];
    if (!a || !a.features) return;
    i[o] = {};
    const c = {};
    a.features.forEach((h) => {
      const u = ["a", "b", "c"];
      for (let f = 0; f < 3; f++) {
        const g = (f + 1) % 3, m = u[f], x = u[g], b = h.properties[m].index, Y = h.properties[x].index, R = [b, Y].sort().join("-");
        if (c[R]) continue;
        c[R] = !0;
        const d = h.geometry.coordinates[0][f], y = h.geometry.coordinates[0][g], l = h.properties[m].geom, v = h.properties[x].geom, M = Math.sqrt(
          Math.pow(l[0] - v[0], 2) + Math.pow(l[1] - v[1], 2)
        ) / Math.sqrt(
          Math.pow(d[0] - y[0], 2) + Math.pow(d[1] - y[1], 2)
        ), A = i[o];
        A[`${b}:${R}`] = M, A[`${Y}:${R}`] = M;
      }
    });
  });
  const r = {};
  return n && (r.bakw = {}), t.forEach((o) => {
    const a = i[o];
    if (r[o] = {}, !a)
      return;
    const c = {};
    Object.keys(a).forEach((u) => {
      const [f] = u.split(":");
      c[f] || (c[f] = []), c[f].push(a[u]);
    }), Object.keys(c).forEach((u) => {
      const f = c[u], g = f.reduce((m, x) => m + x, 0) / f.length;
      r[o][u] = g, n && r.bakw && (r.bakw[u] = 1 / g);
    });
    let h = 0;
    for (let u = 0; u < 4; u++) {
      const f = `b${u}`, g = r[o][f] || 0;
      h += g;
    }
    r[o].c = h / 4, n && r.bakw && (r.bakw.c = 1 / r[o].c);
  }), r;
}
function Ai(s, e) {
  const t = s.split("-");
  if (t.length !== 2 || !t.every((r) => /^-?\d+$/.test(r))) return !1;
  const [n, i] = t.map((r) => parseInt(r, 10)).sort((r, o) => r - o);
  return e.some((r) => {
    if (r.length !== 2) return !1;
    const o = r.map((c) => parseInt(`${c}`, 10));
    if (o.some((c) => Number.isNaN(c))) return !1;
    const a = o.sort((c, h) => c - h);
    return a[0] === n && a[1] === i;
  });
}
function Ue(s) {
  return ["a", "b", "c"].map((e, t) => ({
    prop: s.properties[e],
    geom: s.geometry.coordinates[0][t]
  }));
}
function Oi(s, e, t) {
  const n = /* @__PURE__ */ new Set();
  let i = !1;
  const r = Object.keys(e);
  for (const o of r) {
    if (n.has(o)) continue;
    n.add(o);
    const a = e[o];
    if (!a || a.length < 2) continue;
    const c = o.split("-");
    if (c.length !== 2 || Ai(o, t)) continue;
    const h = Ue(a[0].bakw), u = Ue(a[1].bakw), f = Ue(a[0].forw), g = Ue(a[1].forw), m = c.map(
      (S) => h.find((O) => `${O.prop.index}` === S) || u.find((O) => `${O.prop.index}` === S)
    ), x = c.map(
      (S) => f.find((O) => `${O.prop.index}` === S) || g.find((O) => `${O.prop.index}` === S)
    );
    if (m.some((S) => !S) || x.some((S) => !S))
      continue;
    const b = [h, u].map(
      (S) => S.find((O) => !c.includes(`${O.prop.index}`))
    ), Y = [f, g].map(
      (S) => S.find((O) => !c.includes(`${O.prop.index}`))
    );
    if (b.some((S) => !S) || Y.some((S) => !S))
      continue;
    const R = a[0].bakw.geometry.coordinates[0].slice(0, 3).map((S) => ye(S)), d = a[1].bakw.geometry.coordinates[0].slice(0, 3).map((S) => ye(S));
    if (!(Rn(
      ye(b[0].geom),
      d
    ) || Rn(
      ye(b[1].geom),
      R
    )))
      continue;
    const l = x.map(
      (S) => ye(S.geom)
    ), v = Y.map(
      (S) => ye(S.geom)
    ), M = Bi([
      ...l,
      ...v
    ]), A = Pi(M), T = Cn(
      l[0],
      l[1],
      v[0]
    ) + Cn(
      l[0],
      l[1],
      v[1]
    );
    cn(A, T) && (Xn(e, a[0], s), Xn(e, a[1], s), m.forEach((S) => {
      if (!S) return;
      const O = [
        S.geom,
        b[0].geom,
        b[1].geom,
        S.geom
      ], X = {
        a: S.prop,
        b: b[0].prop,
        c: b[1].prop
      }, L = Be([O], X), K = zt.counterTri(L);
      Gn(e, {
        forw: K,
        bakw: L
      }, s);
    }), i = !0);
  }
  return i;
}
function ye(s) {
  return [s[0], s[1]];
}
function Rn(s, e) {
  const [t, n] = e[0], [i, r] = e[1], [o, a] = e[2], c = o - t, h = a - n, u = i - t, f = r - n, g = s[0] - t, m = s[1] - n, x = c * c + h * h, b = c * u + h * f, Y = c * g + h * m, R = u * u + f * f, d = u * g + f * m, y = x * R - b * b;
  if (y === 0) return !1;
  const l = 1 / y, v = (R * Y - b * d) * l, M = (x * d - b * Y) * l, A = 1e-9;
  return v >= -A && M >= -A && v + M <= 1 + A;
}
function Bi(s) {
  const e = s.map((o) => o.slice()).filter(
    (o, a, c) => c.findIndex(
      (h) => cn(h[0], o[0]) && cn(h[1], o[1])
    ) === a
  );
  if (e.length <= 1) return e;
  const t = e.sort(
    (o, a) => o[0] === a[0] ? o[1] - a[1] : o[0] - a[0]
  ), n = (o, a, c) => (a[0] - o[0]) * (c[1] - o[1]) - (a[1] - o[1]) * (c[0] - o[0]), i = [];
  for (const o of t) {
    for (; i.length >= 2 && n(
      i[i.length - 2],
      i[i.length - 1],
      o
    ) <= 0; )
      i.pop();
    i.push(o);
  }
  const r = [];
  for (let o = t.length - 1; o >= 0; o--) {
    const a = t[o];
    for (; r.length >= 2 && n(
      r[r.length - 2],
      r[r.length - 1],
      a
    ) <= 0; )
      r.pop();
    r.push(a);
  }
  return r.pop(), i.pop(), i.concat(r);
}
function Pi(s) {
  if (s.length < 3) return 0;
  let e = 0;
  for (let t = 0; t < s.length; t++) {
    const [n, i] = s[t], [r, o] = s[(t + 1) % s.length];
    e += n * o - r * i;
  }
  return Math.abs(e) / 2;
}
function Cn(s, e, t) {
  return Math.abs(
    (s[0] * (e[1] - t[1]) + e[0] * (t[1] - s[1]) + t[0] * (s[1] - e[1])) / 2
  );
}
function cn(s, e, t = 1e-9) {
  return Math.abs(s - e) <= t;
}
const Ii = 2.00703, Fn = typeof zt.format_version < "u" ? zt.format_version : Ii;
class Yt extends zt.Transform {
  /**
   * Tinクラスのインスタンスを生成します
   * @param options - 初期化オプション
   */
  constructor(t = {}) {
    super();
    bt(this, "importance");
    bt(this, "priority");
    bt(this, "pointsSet");
    t.bounds ? this.setBounds(t.bounds) : (this.setWh(t.wh), this.vertexMode = t.vertexMode || Yt.VERTEX_PLAIN), this.strictMode = t.strictMode || Yt.MODE_AUTO, this.yaxisMode = t.yaxisMode || Yt.YAXIS_INVERT, this.importance = t.importance || 0, this.priority = t.priority || 0, this.stateFull = t.stateFull || !1, t.points && this.setPoints(t.points), t.edges && this.setEdges(t.edges);
  }
  /**
   * フォーマットバージョンを取得します
   */
  getFormatVersion() {
    return Fn;
  }
  /**
   * 制御点（GCP: Ground Control Points）を設定します。
   * 指定した点群に合わせて内部のTINキャッシュをリセットします。
   */
  setPoints(t) {
    this.yaxisMode === Yt.YAXIS_FOLLOW && (t = t.map((n) => [
      n[0],
      [n[1][0], -1 * n[1][1]]
    ])), this.points = t, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * エッジ（制約線）を設定します。
   * 制約線を正規化した上で、依存するキャッシュをリセットします。
   */
  setEdges(t = []) {
    this.edges = zt.normalizeEdges(t), this.edgeNodes = void 0, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 境界ポリゴンを設定します
   */
  setBounds(t) {
    this.bounds = t;
    let n = t[0][0], i = n, r = t[0][1], o = r;
    const a = [t[0]];
    for (let c = 1; c < t.length; c++) {
      const h = t[c];
      h[0] < n && (n = h[0]), h[0] > i && (i = h[0]), h[1] < r && (r = h[1]), h[1] > o && (o = h[1]), a.push(h);
    }
    a.push(t[0]), this.boundsPolygon = Be([a]), this.xy = [n, r], this.wh = [i - n, o - r], this.vertexMode = Yt.VERTEX_PLAIN, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 現在の設定を永続化可能な形式にコンパイルします
   */
  getCompiled() {
    var i;
    const t = {};
    t.version = Fn, t.points = this.points, t.weight_buffer = this.pointsWeightBuffer, t.centroid_point = [
      this.centroid.forw.geometry.coordinates,
      this.centroid.forw.properties.target.geom
    ], t.vertices_params = [
      this.vertices_params.forw[0],
      this.vertices_params.bakw[0]
    ], t.vertices_points = [];
    const n = this.vertices_params.forw[1];
    return n && [0, 1, 2, 3].map((r) => {
      const o = n[r].features[0], a = o.geometry.coordinates[0][1], c = o.properties.b.geom;
      t.vertices_points[r] = [a, c];
    }), t.strict_status = this.strict_status, t.tins_points = [[]], this.tins.forw.features.map((r) => {
      t.tins_points[0].push(
        ["a", "b", "c"].map(
          (o) => r.properties[o].index
        )
      );
    }), this.strict_status === Yt.STATUS_LOOSE ? (t.tins_points[1] = [], this.tins.bakw.features.map((r) => {
      t.tins_points[1].push(
        ["a", "b", "c"].map(
          (o) => r.properties[o].index
        )
      );
    })) : this.strict_status === Yt.STATUS_ERROR && ((i = this.kinks) != null && i.bakw) && (t.kinks_points = this.kinks.bakw.features.map(
      (r) => r.geometry.coordinates
    )), t.yaxisMode = this.yaxisMode, t.vertexMode = this.vertexMode, t.strictMode = this.strictMode, this.bounds ? (t.bounds = this.bounds, t.boundsPolygon = this.boundsPolygon, t.xy = this.xy, t.wh = this.wh) : t.wh = this.wh, t.edges = this.edges, t.edgeNodes = this.edgeNodes, t;
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
      (o) => zt.counterTri(o)
    );
    this.tins.bakw = Gt(t);
    const n = {};
    this.tins.forw.features.forEach((o, a) => {
      const c = this.tins.bakw.features[a];
      Gn(n, { forw: o, bakw: c });
    }), Oi(
      this.tins,
      n,
      ((r = this.pointsSet) == null ? void 0 : r.edges) || []
    );
    const i = ["forw", "bakw"].map((o) => {
      const a = this.tins[o].features.map(
        (c) => c.geometry.coordinates[0]
      );
      return ri(a);
    });
    i[0].length === 0 && i[1].length === 0 ? (this.strict_status = Yt.STATUS_STRICT, delete this.kinks) : (this.strict_status = Yt.STATUS_ERROR, this.kinks = {
      forw: Gt(i[0]),
      bakw: Gt(i[1])
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
      const o = this.points[r][0], a = this.points[r][1], c = qe(o, a, r);
      t.forw.push(c), t.bakw.push(je(c));
    }
    const n = [];
    let i = 0;
    this.edgeNodes = [], this.edges || (this.edges = []);
    for (let r = 0; r < this.edges.length; r++) {
      const o = this.edges[r][2], a = Object.assign([], this.edges[r][0]), c = Object.assign([], this.edges[r][1]);
      if (a.length === 0 && c.length === 0) {
        n.push(o);
        continue;
      }
      a.unshift(this.points[o[0]][0]), a.push(this.points[o[1]][0]), c.unshift(this.points[o[0]][1]), c.push(this.points[o[1]][1]);
      const h = [a, c].map((u) => {
        const f = u.map((m, x, b) => {
          if (x === 0) return 0;
          const Y = b[x - 1];
          return Math.sqrt(
            Math.pow(m[0] - Y[0], 2) + Math.pow(m[1] - Y[1], 2)
          );
        }), g = f.reduce((m, x, b) => b === 0 ? [0] : (m.push(m[b - 1] + x), m), []);
        return g.map((m, x, b) => {
          const Y = m / b[b.length - 1];
          return [u[x], f[x], g[x], Y];
        });
      });
      h.map((u, f) => {
        const g = h[f ? 0 : 1];
        return u.filter((m, x) => !(x === 0 || x === u.length - 1 || m[4] === "handled")).map((m) => {
          const x = m[0], b = m[3], Y = g.reduce(
            (R, d, y, l) => {
              if (R) return R;
              const v = l[y + 1];
              if (d[3] === b)
                return d[4] = "handled", [d];
              if (d[3] < b && v && v[3] > b)
                return [d, v];
            },
            void 0
          );
          if (Y && Y.length === 1)
            return f === 0 ? [x, Y[0][0], b] : [Y[0][0], x, b];
          if (Y && Y.length === 2) {
            const R = Y[0], d = Y[1], y = (b - R[3]) / (d[3] - R[3]), l = [
              (d[0][0] - R[0][0]) * y + R[0][0],
              (d[0][1] - R[0][1]) * y + R[0][1]
            ];
            return f === 0 ? [x, l, b] : [l, x, b];
          }
          return [];
        });
      }).reduce((u, f) => u.concat(f), []).sort((u, f) => u[2] < f[2] ? -1 : 1).map((u, f, g) => {
        this.edgeNodes[i] = [
          u[0],
          u[1]
        ];
        const m = qe(
          u[0],
          u[1],
          `e${i}`
        );
        i++, t.forw.push(m), t.bakw.push(je(m)), f === 0 ? n.push([o[0], t.forw.length - 1]) : n.push([
          t.forw.length - 2,
          t.forw.length - 1
        ]), f === g.length - 1 && n.push([t.forw.length - 1, o[1]]);
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
    const t = this.xy[0] - 0.05 * this.wh[0], n = this.xy[0] + 1.05 * this.wh[0], i = this.xy[1] - 0.05 * this.wh[1], r = this.xy[1] + 1.05 * this.wh[1];
    if (!this.points.reduce((c, h) => c && (this.bounds ? dr(h[0], this.boundsPolygon) : h[0][0] >= t && h[0][0] <= n && h[0][1] >= i && h[0][1] <= r), !0))
      throw "SOME POINTS OUTSIDE";
    let a = [];
    return this.wh && (a = [[t, i], [n, i], [t, r], [n, r]]), {
      pointsSet: this.generatePointsSet(),
      bbox: a,
      minx: t,
      maxx: n,
      miny: i,
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
    t !== Yt.MODE_STRICT && t !== Yt.MODE_LOOSE && (t = Yt.MODE_AUTO);
    const { pointsSet: n, bbox: i, minx: r, maxx: o, miny: a, maxy: c } = this.validateAndPrepareInputs(), h = {
      forw: Gt(n.forw),
      bakw: Gt(n.bakw)
    }, u = Le(
      h.forw,
      n.edges,
      "target"
    ), f = Le(
      h.bakw,
      n.edges,
      "target"
    );
    if (u.features.length === 0 || f.features.length === 0)
      throw "TOO LINEAR1";
    const g = Ar(h.forw), m = En(h.forw);
    if (!m) throw "TOO LINEAR2";
    const x = {}, b = m.geometry.coordinates[0];
    let Y;
    try {
      Y = b.map((O) => ({
        forw: O,
        bakw: zt.transformArr(ge(O), u)
      })), Y.forEach((O) => {
        x[`${O.forw[0]}:${O.forw[1]}`] = O;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const R = En(h.bakw);
    if (!R) throw "TOO LINEAR2";
    const d = R.geometry.coordinates[0];
    try {
      Y = d.map((O) => ({
        bakw: O,
        forw: zt.transformArr(ge(O), f)
      })), Y.forEach((O) => {
        x[`${O.forw[0]}:${O.forw[1]}`] = O;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const y = {
      forw: g.geometry.coordinates,
      bakw: zt.transformArr(g, u)
    }, l = qe(y.forw, y.bakw, "c");
    this.centroid = {
      forw: l,
      bakw: je(l)
    };
    const v = {
      convexBuf: x,
      centroid: y,
      bbox: i,
      minx: r,
      maxx: o,
      miny: a,
      maxy: c
    }, M = this.vertexMode === Yt.VERTEX_BIRDEYE ? ni(v) : ei(v), A = {
      forw: [],
      bakw: []
    };
    for (let O = 0; O < M.length; O++) {
      const X = M[O].forw, L = M[O].bakw, K = qe(X, L, `b${O}`), p = je(K);
      n.forw.push(K), n.bakw.push(p), A.forw.push(K), A.bakw.push(p);
    }
    this.pointsSet = {
      forw: Gt(n.forw),
      bakw: Gt(n.bakw),
      edges: n.edges
    }, this.tins = {
      forw: zt.rotateVerticesTriangle(
        Le(
          this.pointsSet.forw,
          n.edges,
          "target"
        )
      )
    }, (t === Yt.MODE_STRICT || t === Yt.MODE_AUTO) && this.calcurateStrictTin(), (t === Yt.MODE_LOOSE || t === Yt.MODE_AUTO && this.strict_status === Yt.STATUS_ERROR) && (this.tins.bakw = zt.rotateVerticesTriangle(
      Le(
        this.pointsSet.bakw,
        n.edges,
        "target"
      )
    ), delete this.kinks, this.strict_status = Yt.STATUS_LOOSE), this.vertices_params = {
      forw: Yn(A.forw, this.centroid.forw),
      bakw: Yn(A.bakw, this.centroid.bakw)
    }, this.addIndexedTin();
    const T = ["forw"];
    this.strict_status === Yt.STATUS_LOOSE && T.push("bakw");
    const S = this.strict_status === Yt.STATUS_STRICT;
    this.pointsWeightBuffer = Ei({
      tins: this.tins,
      targets: T,
      includeReciprocals: S
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
const Xi = zt.format_version;
export {
  Yt as Tin,
  Le as constrainedTin,
  je as counterPoint,
  qe as createPoint,
  Yt as default,
  ri as findIntersections,
  Xi as format_version,
  Gn as insertSearchIndex,
  Yn as vertexCalc
};
