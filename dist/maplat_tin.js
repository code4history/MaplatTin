function Te(s, t, e = {}) {
  const n = { type: "Feature" };
  return (e.id === 0 || e.id) && (n.id = e.id), e.bbox && (n.bbox = e.bbox), n.properties = t || {}, n.geometry = s, n;
}
function he(s, t, e = {}) {
  if (!s)
    throw new Error("coordinates is required");
  if (!Array.isArray(s))
    throw new Error("coordinates must be an Array");
  if (s.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!xn(s[0]) || !xn(s[1]))
    throw new Error("coordinates must contain numbers");
  return Te({
    type: "Point",
    coordinates: s
  }, t, e);
}
function Oe(s, t, e = {}) {
  for (const r of s) {
    if (r.length < 4)
      throw new Error(
        "Each LinearRing of a Polygon must have 4 or more Positions."
      );
    if (r[r.length - 1].length !== r[0].length)
      throw new Error("First and last Position are not equivalent.");
    for (let i = 0; i < r[r.length - 1].length; i++)
      if (r[r.length - 1][i] !== r[0][i])
        throw new Error("First and last Position are not equivalent.");
  }
  return Te({
    type: "Polygon",
    coordinates: s
  }, t, e);
}
function yn(s, t, e = {}) {
  if (s.length < 2)
    throw new Error("coordinates must be an array of two or more positions");
  return Te({
    type: "LineString",
    coordinates: s
  }, t, e);
}
function Qt(s, t = {}) {
  const e = { type: "FeatureCollection" };
  return t.id && (e.id = t.id), t.bbox && (e.bbox = t.bbox), e.features = s, e;
}
function xn(s) {
  return !isNaN(s) && s !== null && !Array.isArray(s);
}
function sr(s) {
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
function ar(s) {
  return s.type === "Feature" ? s.geometry : s;
}
function dn(s, t, e) {
  if (s !== null)
    for (var n, r, i, o, a, c, f, l = 0, h = 0, d, b = s.type, k = b === "FeatureCollection", E = b === "Feature", F = k ? s.features.length : 1, L = 0; L < F; L++) {
      f = k ? s.features[L].geometry : E ? s.geometry : s, d = f ? f.type === "GeometryCollection" : !1, a = d ? f.geometries.length : 1;
      for (var g = 0; g < a; g++) {
        var x = 0, u = 0;
        if (o = d ? f.geometries[g] : f, o !== null) {
          c = o.coordinates;
          var w = o.type;
          switch (l = e && (w === "Polygon" || w === "MultiPolygon") ? 1 : 0, w) {
            case null:
              break;
            case "Point":
              if (t(
                c,
                h,
                L,
                x,
                u
              ) === !1)
                return !1;
              h++, x++;
              break;
            case "LineString":
            case "MultiPoint":
              for (n = 0; n < c.length; n++) {
                if (t(
                  c[n],
                  h,
                  L,
                  x,
                  u
                ) === !1)
                  return !1;
                h++, w === "MultiPoint" && x++;
              }
              w === "LineString" && x++;
              break;
            case "Polygon":
            case "MultiLineString":
              for (n = 0; n < c.length; n++) {
                for (r = 0; r < c[n].length - l; r++) {
                  if (t(
                    c[n][r],
                    h,
                    L,
                    x,
                    u
                  ) === !1)
                    return !1;
                  h++;
                }
                w === "MultiLineString" && x++, w === "Polygon" && u++;
              }
              w === "Polygon" && x++;
              break;
            case "MultiPolygon":
              for (n = 0; n < c.length; n++) {
                for (u = 0, r = 0; r < c[n].length; r++) {
                  for (i = 0; i < c[n][r].length - l; i++) {
                    if (t(
                      c[n][r][i],
                      h,
                      L,
                      x,
                      u
                    ) === !1)
                      return !1;
                    h++;
                  }
                  u++;
                }
                x++;
              }
              break;
            case "GeometryCollection":
              for (n = 0; n < o.geometries.length; n++)
                if (dn(o.geometries[n], t, e) === !1)
                  return !1;
              break;
            default:
              throw new Error("Unknown Geometry Type");
          }
        }
      }
    }
}
const Rt = 11102230246251565e-32, st = 134217729, Wn = (3 + 8 * Rt) * Rt;
function Dt(s, t, e, n, r) {
  let i, o, a, c, f = t[0], l = n[0], h = 0, d = 0;
  l > f == l > -f ? (i = f, f = t[++h]) : (i = l, l = n[++d]);
  let b = 0;
  if (h < s && d < e)
    for (l > f == l > -f ? (o = f + i, a = i - (o - f), f = t[++h]) : (o = l + i, a = i - (o - l), l = n[++d]), i = o, a !== 0 && (r[b++] = a); h < s && d < e; )
      l > f == l > -f ? (o = i + f, c = o - i, a = i - (o - c) + (f - c), f = t[++h]) : (o = i + l, c = o - i, a = i - (o - c) + (l - c), l = n[++d]), i = o, a !== 0 && (r[b++] = a);
  for (; h < s; )
    o = i + f, c = o - i, a = i - (o - c) + (f - c), f = t[++h], i = o, a !== 0 && (r[b++] = a);
  for (; d < e; )
    o = i + l, c = o - i, a = i - (o - c) + (l - c), l = n[++d], i = o, a !== 0 && (r[b++] = a);
  return (i !== 0 || b === 0) && (r[b++] = i), b;
}
function zt(s, t, e, n, r, i, o, a) {
  return Dt(Dt(s, t, e, n, o), o, r, i, a);
}
function U(s, t, e, n) {
  let r, i, o, a, c, f, l, h, d, b, k;
  l = st * e, b = l - (l - e), k = e - b;
  let E = t[0];
  r = E * e, l = st * E, h = l - (l - E), d = E - h, o = d * k - (r - h * b - d * b - h * k);
  let F = 0;
  o !== 0 && (n[F++] = o);
  for (let L = 1; L < s; L++)
    E = t[L], a = E * e, l = st * E, h = l - (l - E), d = E - h, c = d * k - (a - h * b - d * b - h * k), i = r + c, f = i - r, o = r - (i - f) + (c - f), o !== 0 && (n[F++] = o), r = a + i, o = i - (r - a), o !== 0 && (n[F++] = o);
  return (r !== 0 || F === 0) && (n[F++] = r), F;
}
function Gn(s, t) {
  let e = t[0];
  for (let n = 1; n < s; n++) e += t[n];
  return e;
}
function bt(s) {
  return new Float64Array(s);
}
const cr = (3 + 16 * Rt) * Rt, fr = (2 + 12 * Rt) * Rt, hr = (9 + 64 * Rt) * Rt * Rt, xe = bt(4), bn = bt(8), vn = bt(12), _n = bt(16), Yt = bt(4);
function lr(s, t, e, n, r, i, o) {
  let a, c, f, l, h, d, b, k, E, F, L, g, x, u, w, m, T, O;
  const I = s - r, P = e - r, C = t - i, R = n - i;
  u = I * R, d = st * I, b = d - (d - I), k = I - b, d = st * R, E = d - (d - R), F = R - E, w = k * F - (u - b * E - k * E - b * F), m = C * P, d = st * C, b = d - (d - C), k = C - b, d = st * P, E = d - (d - P), F = P - E, T = k * F - (m - b * E - k * E - b * F), L = w - T, h = w - L, xe[0] = w - (L + h) + (h - T), g = u + L, h = g - u, x = u - (g - h) + (L - h), L = x - m, h = x - L, xe[1] = x - (L + h) + (h - m), O = g + L, h = O - g, xe[2] = g - (O - h) + (L - h), xe[3] = O;
  let G = Gn(4, xe), p = fr * o;
  if (G >= p || -G >= p || (h = s - I, a = s - (I + h) + (h - r), h = e - P, f = e - (P + h) + (h - r), h = t - C, c = t - (C + h) + (h - i), h = n - R, l = n - (R + h) + (h - i), a === 0 && c === 0 && f === 0 && l === 0) || (p = hr * o + Wn * Math.abs(G), G += I * l + R * a - (C * f + P * c), G >= p || -G >= p)) return G;
  u = a * R, d = st * a, b = d - (d - a), k = a - b, d = st * R, E = d - (d - R), F = R - E, w = k * F - (u - b * E - k * E - b * F), m = c * P, d = st * c, b = d - (d - c), k = c - b, d = st * P, E = d - (d - P), F = P - E, T = k * F - (m - b * E - k * E - b * F), L = w - T, h = w - L, Yt[0] = w - (L + h) + (h - T), g = u + L, h = g - u, x = u - (g - h) + (L - h), L = x - m, h = x - L, Yt[1] = x - (L + h) + (h - m), O = g + L, h = O - g, Yt[2] = g - (O - h) + (L - h), Yt[3] = O;
  const M = Dt(4, xe, 4, Yt, bn);
  u = I * l, d = st * I, b = d - (d - I), k = I - b, d = st * l, E = d - (d - l), F = l - E, w = k * F - (u - b * E - k * E - b * F), m = C * f, d = st * C, b = d - (d - C), k = C - b, d = st * f, E = d - (d - f), F = f - E, T = k * F - (m - b * E - k * E - b * F), L = w - T, h = w - L, Yt[0] = w - (L + h) + (h - T), g = u + L, h = g - u, x = u - (g - h) + (L - h), L = x - m, h = x - L, Yt[1] = x - (L + h) + (h - m), O = g + L, h = O - g, Yt[2] = g - (O - h) + (L - h), Yt[3] = O;
  const _ = Dt(M, bn, 4, Yt, vn);
  u = a * l, d = st * a, b = d - (d - a), k = a - b, d = st * l, E = d - (d - l), F = l - E, w = k * F - (u - b * E - k * E - b * F), m = c * f, d = st * c, b = d - (d - c), k = c - b, d = st * f, E = d - (d - f), F = f - E, T = k * F - (m - b * E - k * E - b * F), L = w - T, h = w - L, Yt[0] = w - (L + h) + (h - T), g = u + L, h = g - u, x = u - (g - h) + (L - h), L = x - m, h = x - L, Yt[1] = x - (L + h) + (h - m), O = g + L, h = O - g, Yt[2] = g - (O - h) + (L - h), Yt[3] = O;
  const X = Dt(_, vn, 4, Yt, _n);
  return _n[X - 1];
}
function ne(s, t, e, n, r, i) {
  const o = (t - i) * (e - r), a = (s - r) * (n - i), c = o - a, f = Math.abs(o + a);
  return Math.abs(c) >= cr * f ? c : -lr(s, t, e, n, r, i, f);
}
const ur = (10 + 96 * Rt) * Rt, pr = (4 + 48 * Rt) * Rt, dr = (44 + 576 * Rt) * Rt * Rt, oe = bt(4), se = bt(4), ae = bt(4), Zt = bt(4), te = bt(4), ee = bt(4), Lt = bt(4), $t = bt(4), en = bt(8), nn = bt(8), rn = bt(8), on = bt(8), sn = bt(8), an = bt(8), De = bt(8), Ce = bt(8), Re = bt(8), de = bt(4), me = bt(4), ge = bt(4), ct = bt(8), pt = bt(16), kt = bt(16), Et = bt(16), vt = bt(32), ce = bt(32), Tt = bt(48), Vt = bt(64);
let ve = bt(1152), cn = bt(1152);
function Pt(s, t, e) {
  s = Dt(s, ve, t, e, cn);
  const n = ve;
  return ve = cn, cn = n, s;
}
function mr(s, t, e, n, r, i, o, a, c) {
  let f, l, h, d, b, k, E, F, L, g, x, u, w, m, T, O, I, P, C, R, G, p, M, _, X, B, Y, y, D, j, q, Q, H, rt, J;
  const lt = s - o, ht = e - o, ut = r - o, dt = t - a, gt = n - a, mt = i - a;
  q = ht * mt, M = st * ht, _ = M - (M - ht), X = ht - _, M = st * mt, B = M - (M - mt), Y = mt - B, Q = X * Y - (q - _ * B - X * B - _ * Y), H = ut * gt, M = st * ut, _ = M - (M - ut), X = ut - _, M = st * gt, B = M - (M - gt), Y = gt - B, rt = X * Y - (H - _ * B - X * B - _ * Y), y = Q - rt, p = Q - y, oe[0] = Q - (y + p) + (p - rt), D = q + y, p = D - q, j = q - (D - p) + (y - p), y = j - H, p = j - y, oe[1] = j - (y + p) + (p - H), J = D + y, p = J - D, oe[2] = D - (J - p) + (y - p), oe[3] = J, q = ut * dt, M = st * ut, _ = M - (M - ut), X = ut - _, M = st * dt, B = M - (M - dt), Y = dt - B, Q = X * Y - (q - _ * B - X * B - _ * Y), H = lt * mt, M = st * lt, _ = M - (M - lt), X = lt - _, M = st * mt, B = M - (M - mt), Y = mt - B, rt = X * Y - (H - _ * B - X * B - _ * Y), y = Q - rt, p = Q - y, se[0] = Q - (y + p) + (p - rt), D = q + y, p = D - q, j = q - (D - p) + (y - p), y = j - H, p = j - y, se[1] = j - (y + p) + (p - H), J = D + y, p = J - D, se[2] = D - (J - p) + (y - p), se[3] = J, q = lt * gt, M = st * lt, _ = M - (M - lt), X = lt - _, M = st * gt, B = M - (M - gt), Y = gt - B, Q = X * Y - (q - _ * B - X * B - _ * Y), H = ht * dt, M = st * ht, _ = M - (M - ht), X = ht - _, M = st * dt, B = M - (M - dt), Y = dt - B, rt = X * Y - (H - _ * B - X * B - _ * Y), y = Q - rt, p = Q - y, ae[0] = Q - (y + p) + (p - rt), D = q + y, p = D - q, j = q - (D - p) + (y - p), y = j - H, p = j - y, ae[1] = j - (y + p) + (p - H), J = D + y, p = J - D, ae[2] = D - (J - p) + (y - p), ae[3] = J, f = Dt(
    Dt(
      Dt(
        U(U(4, oe, lt, ct), ct, lt, pt),
        pt,
        U(U(4, oe, dt, ct), ct, dt, kt),
        kt,
        vt
      ),
      vt,
      Dt(
        U(U(4, se, ht, ct), ct, ht, pt),
        pt,
        U(U(4, se, gt, ct), ct, gt, kt),
        kt,
        ce
      ),
      ce,
      Vt
    ),
    Vt,
    Dt(
      U(U(4, ae, ut, ct), ct, ut, pt),
      pt,
      U(U(4, ae, mt, ct), ct, mt, kt),
      kt,
      vt
    ),
    vt,
    ve
  );
  let It = Gn(f, ve), Nt = pr * c;
  if (It >= Nt || -It >= Nt || (p = s - lt, l = s - (lt + p) + (p - o), p = t - dt, b = t - (dt + p) + (p - a), p = e - ht, h = e - (ht + p) + (p - o), p = n - gt, k = n - (gt + p) + (p - a), p = r - ut, d = r - (ut + p) + (p - o), p = i - mt, E = i - (mt + p) + (p - a), l === 0 && h === 0 && d === 0 && b === 0 && k === 0 && E === 0) || (Nt = dr * c + Wn * Math.abs(It), It += (lt * lt + dt * dt) * (ht * E + mt * h - (gt * d + ut * k)) + 2 * (lt * l + dt * b) * (ht * mt - gt * ut) + ((ht * ht + gt * gt) * (ut * b + dt * d - (mt * l + lt * E)) + 2 * (ht * h + gt * k) * (ut * dt - mt * lt)) + ((ut * ut + mt * mt) * (lt * k + gt * l - (dt * h + ht * b)) + 2 * (ut * d + mt * E) * (lt * gt - dt * ht)), It >= Nt || -It >= Nt))
    return It;
  if ((h !== 0 || k !== 0 || d !== 0 || E !== 0) && (q = lt * lt, M = st * lt, _ = M - (M - lt), X = lt - _, Q = X * X - (q - _ * _ - (_ + _) * X), H = dt * dt, M = st * dt, _ = M - (M - dt), X = dt - _, rt = X * X - (H - _ * _ - (_ + _) * X), y = Q + rt, p = y - Q, Zt[0] = Q - (y - p) + (rt - p), D = q + y, p = D - q, j = q - (D - p) + (y - p), y = j + H, p = y - j, Zt[1] = j - (y - p) + (H - p), J = D + y, p = J - D, Zt[2] = D - (J - p) + (y - p), Zt[3] = J), (d !== 0 || E !== 0 || l !== 0 || b !== 0) && (q = ht * ht, M = st * ht, _ = M - (M - ht), X = ht - _, Q = X * X - (q - _ * _ - (_ + _) * X), H = gt * gt, M = st * gt, _ = M - (M - gt), X = gt - _, rt = X * X - (H - _ * _ - (_ + _) * X), y = Q + rt, p = y - Q, te[0] = Q - (y - p) + (rt - p), D = q + y, p = D - q, j = q - (D - p) + (y - p), y = j + H, p = y - j, te[1] = j - (y - p) + (H - p), J = D + y, p = J - D, te[2] = D - (J - p) + (y - p), te[3] = J), (l !== 0 || b !== 0 || h !== 0 || k !== 0) && (q = ut * ut, M = st * ut, _ = M - (M - ut), X = ut - _, Q = X * X - (q - _ * _ - (_ + _) * X), H = mt * mt, M = st * mt, _ = M - (M - mt), X = mt - _, rt = X * X - (H - _ * _ - (_ + _) * X), y = Q + rt, p = y - Q, ee[0] = Q - (y - p) + (rt - p), D = q + y, p = D - q, j = q - (D - p) + (y - p), y = j + H, p = y - j, ee[1] = j - (y - p) + (H - p), J = D + y, p = J - D, ee[2] = D - (J - p) + (y - p), ee[3] = J), l !== 0 && (F = U(4, oe, l, en), f = Pt(f, zt(
    U(F, en, 2 * lt, pt),
    pt,
    U(U(4, ee, l, ct), ct, gt, kt),
    kt,
    U(U(4, te, l, ct), ct, -mt, Et),
    Et,
    vt,
    Tt
  ), Tt)), b !== 0 && (L = U(4, oe, b, nn), f = Pt(f, zt(
    U(L, nn, 2 * dt, pt),
    pt,
    U(U(4, te, b, ct), ct, ut, kt),
    kt,
    U(U(4, ee, b, ct), ct, -ht, Et),
    Et,
    vt,
    Tt
  ), Tt)), h !== 0 && (g = U(4, se, h, rn), f = Pt(f, zt(
    U(g, rn, 2 * ht, pt),
    pt,
    U(U(4, Zt, h, ct), ct, mt, kt),
    kt,
    U(U(4, ee, h, ct), ct, -dt, Et),
    Et,
    vt,
    Tt
  ), Tt)), k !== 0 && (x = U(4, se, k, on), f = Pt(f, zt(
    U(x, on, 2 * gt, pt),
    pt,
    U(U(4, ee, k, ct), ct, lt, kt),
    kt,
    U(U(4, Zt, k, ct), ct, -ut, Et),
    Et,
    vt,
    Tt
  ), Tt)), d !== 0 && (u = U(4, ae, d, sn), f = Pt(f, zt(
    U(u, sn, 2 * ut, pt),
    pt,
    U(U(4, te, d, ct), ct, dt, kt),
    kt,
    U(U(4, Zt, d, ct), ct, -gt, Et),
    Et,
    vt,
    Tt
  ), Tt)), E !== 0 && (w = U(4, ae, E, an), f = Pt(f, zt(
    U(w, an, 2 * mt, pt),
    pt,
    U(U(4, Zt, E, ct), ct, ht, kt),
    kt,
    U(U(4, te, E, ct), ct, -lt, Et),
    Et,
    vt,
    Tt
  ), Tt)), l !== 0 || b !== 0) {
    if (h !== 0 || k !== 0 || d !== 0 || E !== 0 ? (q = h * mt, M = st * h, _ = M - (M - h), X = h - _, M = st * mt, B = M - (M - mt), Y = mt - B, Q = X * Y - (q - _ * B - X * B - _ * Y), H = ht * E, M = st * ht, _ = M - (M - ht), X = ht - _, M = st * E, B = M - (M - E), Y = E - B, rt = X * Y - (H - _ * B - X * B - _ * Y), y = Q + rt, p = y - Q, Lt[0] = Q - (y - p) + (rt - p), D = q + y, p = D - q, j = q - (D - p) + (y - p), y = j + H, p = y - j, Lt[1] = j - (y - p) + (H - p), J = D + y, p = J - D, Lt[2] = D - (J - p) + (y - p), Lt[3] = J, q = d * -gt, M = st * d, _ = M - (M - d), X = d - _, M = st * -gt, B = M - (M - -gt), Y = -gt - B, Q = X * Y - (q - _ * B - X * B - _ * Y), H = ut * -k, M = st * ut, _ = M - (M - ut), X = ut - _, M = st * -k, B = M - (M - -k), Y = -k - B, rt = X * Y - (H - _ * B - X * B - _ * Y), y = Q + rt, p = y - Q, $t[0] = Q - (y - p) + (rt - p), D = q + y, p = D - q, j = q - (D - p) + (y - p), y = j + H, p = y - j, $t[1] = j - (y - p) + (H - p), J = D + y, p = J - D, $t[2] = D - (J - p) + (y - p), $t[3] = J, T = Dt(4, Lt, 4, $t, Ce), q = h * E, M = st * h, _ = M - (M - h), X = h - _, M = st * E, B = M - (M - E), Y = E - B, Q = X * Y - (q - _ * B - X * B - _ * Y), H = d * k, M = st * d, _ = M - (M - d), X = d - _, M = st * k, B = M - (M - k), Y = k - B, rt = X * Y - (H - _ * B - X * B - _ * Y), y = Q - rt, p = Q - y, me[0] = Q - (y + p) + (p - rt), D = q + y, p = D - q, j = q - (D - p) + (y - p), y = j - H, p = j - y, me[1] = j - (y + p) + (p - H), J = D + y, p = J - D, me[2] = D - (J - p) + (y - p), me[3] = J, P = 4) : (Ce[0] = 0, T = 1, me[0] = 0, P = 1), l !== 0) {
      const _t = U(T, Ce, l, Et);
      f = Pt(f, Dt(
        U(F, en, l, pt),
        pt,
        U(_t, Et, 2 * lt, vt),
        vt,
        Tt
      ), Tt);
      const Mt = U(P, me, l, ct);
      f = Pt(f, zt(
        U(Mt, ct, 2 * lt, pt),
        pt,
        U(Mt, ct, l, kt),
        kt,
        U(_t, Et, l, vt),
        vt,
        ce,
        Vt
      ), Vt), k !== 0 && (f = Pt(f, U(U(4, ee, l, ct), ct, k, pt), pt)), E !== 0 && (f = Pt(f, U(U(4, te, -l, ct), ct, E, pt), pt));
    }
    if (b !== 0) {
      const _t = U(T, Ce, b, Et);
      f = Pt(f, Dt(
        U(L, nn, b, pt),
        pt,
        U(_t, Et, 2 * dt, vt),
        vt,
        Tt
      ), Tt);
      const Mt = U(P, me, b, ct);
      f = Pt(f, zt(
        U(Mt, ct, 2 * dt, pt),
        pt,
        U(Mt, ct, b, kt),
        kt,
        U(_t, Et, b, vt),
        vt,
        ce,
        Vt
      ), Vt);
    }
  }
  if (h !== 0 || k !== 0) {
    if (d !== 0 || E !== 0 || l !== 0 || b !== 0 ? (q = d * dt, M = st * d, _ = M - (M - d), X = d - _, M = st * dt, B = M - (M - dt), Y = dt - B, Q = X * Y - (q - _ * B - X * B - _ * Y), H = ut * b, M = st * ut, _ = M - (M - ut), X = ut - _, M = st * b, B = M - (M - b), Y = b - B, rt = X * Y - (H - _ * B - X * B - _ * Y), y = Q + rt, p = y - Q, Lt[0] = Q - (y - p) + (rt - p), D = q + y, p = D - q, j = q - (D - p) + (y - p), y = j + H, p = y - j, Lt[1] = j - (y - p) + (H - p), J = D + y, p = J - D, Lt[2] = D - (J - p) + (y - p), Lt[3] = J, R = -mt, G = -E, q = l * R, M = st * l, _ = M - (M - l), X = l - _, M = st * R, B = M - (M - R), Y = R - B, Q = X * Y - (q - _ * B - X * B - _ * Y), H = lt * G, M = st * lt, _ = M - (M - lt), X = lt - _, M = st * G, B = M - (M - G), Y = G - B, rt = X * Y - (H - _ * B - X * B - _ * Y), y = Q + rt, p = y - Q, $t[0] = Q - (y - p) + (rt - p), D = q + y, p = D - q, j = q - (D - p) + (y - p), y = j + H, p = y - j, $t[1] = j - (y - p) + (H - p), J = D + y, p = J - D, $t[2] = D - (J - p) + (y - p), $t[3] = J, O = Dt(4, Lt, 4, $t, Re), q = d * b, M = st * d, _ = M - (M - d), X = d - _, M = st * b, B = M - (M - b), Y = b - B, Q = X * Y - (q - _ * B - X * B - _ * Y), H = l * E, M = st * l, _ = M - (M - l), X = l - _, M = st * E, B = M - (M - E), Y = E - B, rt = X * Y - (H - _ * B - X * B - _ * Y), y = Q - rt, p = Q - y, ge[0] = Q - (y + p) + (p - rt), D = q + y, p = D - q, j = q - (D - p) + (y - p), y = j - H, p = j - y, ge[1] = j - (y + p) + (p - H), J = D + y, p = J - D, ge[2] = D - (J - p) + (y - p), ge[3] = J, C = 4) : (Re[0] = 0, O = 1, ge[0] = 0, C = 1), h !== 0) {
      const _t = U(O, Re, h, Et);
      f = Pt(f, Dt(
        U(g, rn, h, pt),
        pt,
        U(_t, Et, 2 * ht, vt),
        vt,
        Tt
      ), Tt);
      const Mt = U(C, ge, h, ct);
      f = Pt(f, zt(
        U(Mt, ct, 2 * ht, pt),
        pt,
        U(Mt, ct, h, kt),
        kt,
        U(_t, Et, h, vt),
        vt,
        ce,
        Vt
      ), Vt), E !== 0 && (f = Pt(f, U(U(4, Zt, h, ct), ct, E, pt), pt)), b !== 0 && (f = Pt(f, U(U(4, ee, -h, ct), ct, b, pt), pt));
    }
    if (k !== 0) {
      const _t = U(O, Re, k, Et);
      f = Pt(f, Dt(
        U(x, on, k, pt),
        pt,
        U(_t, Et, 2 * gt, vt),
        vt,
        Tt
      ), Tt);
      const Mt = U(C, ge, k, ct);
      f = Pt(f, zt(
        U(Mt, ct, 2 * gt, pt),
        pt,
        U(Mt, ct, k, kt),
        kt,
        U(_t, Et, k, vt),
        vt,
        ce,
        Vt
      ), Vt);
    }
  }
  if (d !== 0 || E !== 0) {
    if (l !== 0 || b !== 0 || h !== 0 || k !== 0 ? (q = l * gt, M = st * l, _ = M - (M - l), X = l - _, M = st * gt, B = M - (M - gt), Y = gt - B, Q = X * Y - (q - _ * B - X * B - _ * Y), H = lt * k, M = st * lt, _ = M - (M - lt), X = lt - _, M = st * k, B = M - (M - k), Y = k - B, rt = X * Y - (H - _ * B - X * B - _ * Y), y = Q + rt, p = y - Q, Lt[0] = Q - (y - p) + (rt - p), D = q + y, p = D - q, j = q - (D - p) + (y - p), y = j + H, p = y - j, Lt[1] = j - (y - p) + (H - p), J = D + y, p = J - D, Lt[2] = D - (J - p) + (y - p), Lt[3] = J, R = -dt, G = -b, q = h * R, M = st * h, _ = M - (M - h), X = h - _, M = st * R, B = M - (M - R), Y = R - B, Q = X * Y - (q - _ * B - X * B - _ * Y), H = ht * G, M = st * ht, _ = M - (M - ht), X = ht - _, M = st * G, B = M - (M - G), Y = G - B, rt = X * Y - (H - _ * B - X * B - _ * Y), y = Q + rt, p = y - Q, $t[0] = Q - (y - p) + (rt - p), D = q + y, p = D - q, j = q - (D - p) + (y - p), y = j + H, p = y - j, $t[1] = j - (y - p) + (H - p), J = D + y, p = J - D, $t[2] = D - (J - p) + (y - p), $t[3] = J, m = Dt(4, Lt, 4, $t, De), q = l * k, M = st * l, _ = M - (M - l), X = l - _, M = st * k, B = M - (M - k), Y = k - B, Q = X * Y - (q - _ * B - X * B - _ * Y), H = h * b, M = st * h, _ = M - (M - h), X = h - _, M = st * b, B = M - (M - b), Y = b - B, rt = X * Y - (H - _ * B - X * B - _ * Y), y = Q - rt, p = Q - y, de[0] = Q - (y + p) + (p - rt), D = q + y, p = D - q, j = q - (D - p) + (y - p), y = j - H, p = j - y, de[1] = j - (y + p) + (p - H), J = D + y, p = J - D, de[2] = D - (J - p) + (y - p), de[3] = J, I = 4) : (De[0] = 0, m = 1, de[0] = 0, I = 1), d !== 0) {
      const _t = U(m, De, d, Et);
      f = Pt(f, Dt(
        U(u, sn, d, pt),
        pt,
        U(_t, Et, 2 * ut, vt),
        vt,
        Tt
      ), Tt);
      const Mt = U(I, de, d, ct);
      f = Pt(f, zt(
        U(Mt, ct, 2 * ut, pt),
        pt,
        U(Mt, ct, d, kt),
        kt,
        U(_t, Et, d, vt),
        vt,
        ce,
        Vt
      ), Vt), b !== 0 && (f = Pt(f, U(U(4, te, d, ct), ct, b, pt), pt)), k !== 0 && (f = Pt(f, U(U(4, Zt, -d, ct), ct, k, pt), pt));
    }
    if (E !== 0) {
      const _t = U(m, De, E, Et);
      f = Pt(f, Dt(
        U(w, an, E, pt),
        pt,
        U(_t, Et, 2 * mt, vt),
        vt,
        Tt
      ), Tt);
      const Mt = U(I, de, E, ct);
      f = Pt(f, zt(
        U(Mt, ct, 2 * mt, pt),
        pt,
        U(Mt, ct, E, kt),
        kt,
        U(_t, Et, E, vt),
        vt,
        ce,
        Vt
      ), Vt);
    }
  }
  return ve[f - 1];
}
function gr(s, t, e, n, r, i, o, a) {
  const c = s - o, f = e - o, l = r - o, h = t - a, d = n - a, b = i - a, k = f * b, E = l * d, F = c * c + h * h, L = l * h, g = c * b, x = f * f + d * d, u = c * d, w = f * h, m = l * l + b * b, T = F * (k - E) + x * (L - g) + m * (u - w), O = (Math.abs(k) + Math.abs(E)) * F + (Math.abs(L) + Math.abs(g)) * x + (Math.abs(u) + Math.abs(w)) * m, I = ur * O;
  return T > I || -T > I ? T : mr(s, t, e, n, r, i, o, a, O);
}
function wr(s, t) {
  var e, n, r = 0, i, o, a, c, f, l, h, d = s[0], b = s[1], k = t.length;
  for (e = 0; e < k; e++) {
    n = 0;
    var E = t[e], F = E.length - 1;
    if (l = E[0], l[0] !== E[F][0] && l[1] !== E[F][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (o = l[0] - d, a = l[1] - b, n; n < F; n++) {
      if (h = E[n + 1], c = h[0] - d, f = h[1] - b, a === 0 && f === 0) {
        if (c <= 0 && o >= 0 || o <= 0 && c >= 0)
          return 0;
      } else if (f >= 0 && a <= 0 || f <= 0 && a >= 0) {
        if (i = ne(o, c, a, f, 0, 0), i === 0)
          return 0;
        (i > 0 && f > 0 && a <= 0 || i < 0 && f <= 0 && a > 0) && r++;
      }
      l = h, a = f, o = c;
    }
  }
  return r % 2 !== 0;
}
function fn(s, t, e = {}) {
  if (!s)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const n = sr(s), r = ar(t), i = r.type, o = t.bbox;
  let a = r.coordinates;
  if (o && yr(n, o) === !1)
    return !1;
  i === "Polygon" && (a = [a]);
  let c = !1;
  for (var f = 0; f < a.length; ++f) {
    const l = wr(n, a[f]);
    if (l === 0) return !e.ignoreBoundary;
    l && (c = !0);
  }
  return c;
}
function yr(s, t) {
  return t[0] <= s[0] && t[1] <= s[1] && t[2] >= s[0] && t[3] >= s[1];
}
let Jn = class {
  constructor(t = [], e = xr) {
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
      const i = t - 1 >> 1, o = e[i];
      if (n(r, o) >= 0) break;
      e[t] = o, t = i;
    }
    e[t] = r;
  }
  _down(t) {
    const { data: e, compare: n } = this, r = this.length >> 1, i = e[t];
    for (; t < r; ) {
      let o = (t << 1) + 1, a = e[o];
      const c = o + 1;
      if (c < this.length && n(e[c], a) < 0 && (o = c, a = e[c]), n(a, i) >= 0) break;
      e[t] = a, t = o;
    }
    e[t] = i;
  }
};
function xr(s, t) {
  return s < t ? -1 : s > t ? 1 : 0;
}
function Kn(s, t) {
  return s.p.x > t.p.x ? 1 : s.p.x < t.p.x ? -1 : s.p.y !== t.p.y ? s.p.y > t.p.y ? 1 : -1 : 1;
}
function br(s, t) {
  return s.rightSweepEvent.p.x > t.rightSweepEvent.p.x ? 1 : s.rightSweepEvent.p.x < t.rightSweepEvent.p.x ? -1 : s.rightSweepEvent.p.y !== t.rightSweepEvent.p.y ? s.rightSweepEvent.p.y < t.rightSweepEvent.p.y ? 1 : -1 : 1;
}
class Mn {
  constructor(t, e, n, r) {
    this.p = {
      x: t[0],
      y: t[1]
    }, this.featureId = e, this.ringId = n, this.eventId = r, this.otherEvent = null, this.isLeftEndpoint = null;
  }
  isSamePoint(t) {
    return this.p.x === t.p.x && this.p.y === t.p.y;
  }
}
function vr(s, t) {
  if (s.type === "FeatureCollection") {
    const e = s.features;
    for (let n = 0; n < e.length; n++)
      Sn(e[n], t);
  } else
    Sn(s, t);
}
let Fe = 0, Ye = 0, Le = 0;
function Sn(s, t) {
  const e = s.type === "Feature" ? s.geometry : s;
  let n = e.coordinates;
  (e.type === "Polygon" || e.type === "MultiLineString") && (n = [n]), e.type === "LineString" && (n = [[n]]);
  for (let r = 0; r < n.length; r++)
    for (let i = 0; i < n[r].length; i++) {
      let o = n[r][i][0], a = null;
      Ye = Ye + 1;
      for (let c = 0; c < n[r][i].length - 1; c++) {
        a = n[r][i][c + 1];
        const f = new Mn(o, Fe, Ye, Le), l = new Mn(a, Fe, Ye, Le + 1);
        f.otherEvent = l, l.otherEvent = f, Kn(f, l) > 0 ? (l.isLeftEndpoint = !0, f.isLeftEndpoint = !1) : (f.isLeftEndpoint = !0, l.isLeftEndpoint = !1), t.push(f), t.push(l), o = a, Le = Le + 1;
      }
    }
  Fe = Fe + 1;
}
class _r {
  constructor(t) {
    this.leftSweepEvent = t, this.rightSweepEvent = t.otherEvent;
  }
}
function Mr(s, t) {
  if (s === null || t === null || s.leftSweepEvent.ringId === t.leftSweepEvent.ringId && (s.rightSweepEvent.isSamePoint(t.leftSweepEvent) || s.rightSweepEvent.isSamePoint(t.leftSweepEvent) || s.rightSweepEvent.isSamePoint(t.rightSweepEvent) || s.leftSweepEvent.isSamePoint(t.leftSweepEvent) || s.leftSweepEvent.isSamePoint(t.rightSweepEvent))) return !1;
  const e = s.leftSweepEvent.p.x, n = s.leftSweepEvent.p.y, r = s.rightSweepEvent.p.x, i = s.rightSweepEvent.p.y, o = t.leftSweepEvent.p.x, a = t.leftSweepEvent.p.y, c = t.rightSweepEvent.p.x, f = t.rightSweepEvent.p.y, l = (f - a) * (r - e) - (c - o) * (i - n), h = (c - o) * (n - a) - (f - a) * (e - o), d = (r - e) * (n - a) - (i - n) * (e - o);
  if (l === 0)
    return !1;
  const b = h / l, k = d / l;
  if (b >= 0 && b <= 1 && k >= 0 && k <= 1) {
    const E = e + b * (r - e), F = n + b * (i - n);
    return [E, F];
  }
  return !1;
}
function Sr(s, t) {
  t = t || !1;
  const e = [], n = new Jn([], br);
  for (; s.length; ) {
    const r = s.pop();
    if (r.isLeftEndpoint) {
      const i = new _r(r);
      for (let o = 0; o < n.data.length; o++) {
        const a = n.data[o];
        if (t && a.leftSweepEvent.featureId === r.featureId)
          continue;
        const c = Mr(i, a);
        c !== !1 && e.push(c);
      }
      n.push(i);
    } else r.isLeftEndpoint === !1 && n.pop();
  }
  return e;
}
function kr(s, t) {
  const e = new Jn([], Kn);
  return vr(s, e), Sr(e, t);
}
var Er = kr;
function Ar(s, t, e = {}) {
  const { removeDuplicates: n = !0, ignoreSelfIntersections: r = !0 } = e;
  let i = [];
  s.type === "FeatureCollection" ? i = i.concat(s.features) : s.type === "Feature" ? i.push(s) : (s.type === "LineString" || s.type === "Polygon" || s.type === "MultiLineString" || s.type === "MultiPolygon") && i.push(Te(s)), t.type === "FeatureCollection" ? i = i.concat(t.features) : t.type === "Feature" ? i.push(t) : (t.type === "LineString" || t.type === "Polygon" || t.type === "MultiLineString" || t.type === "MultiPolygon") && i.push(Te(t));
  const o = Er(
    Qt(i),
    r
  );
  let a = [];
  if (n) {
    const c = {};
    o.forEach((f) => {
      const l = f.join(",");
      c[l] || (c[l] = !0, a.push(f));
    });
  } else
    a = o;
  return Qt(a.map((c) => he(c)));
}
function Ir(s) {
  return s && s.__esModule && Object.prototype.hasOwnProperty.call(s, "default") ? s.default : s;
}
function Br(s) {
  if (Object.prototype.hasOwnProperty.call(s, "__esModule")) return s;
  var t = s.default;
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
  return Object.defineProperty(e, "__esModule", { value: !0 }), Object.keys(s).forEach(function(n) {
    var r = Object.getOwnPropertyDescriptor(s, n);
    Object.defineProperty(e, n, r.get ? r : {
      enumerable: !0,
      get: function() {
        return s[n];
      }
    });
  }), e;
}
function Tr(s, t = {}) {
  let e = 0, n = 0, r = 0;
  return dn(
    s,
    function(i) {
      e += i[0], n += i[1], r++;
    },
    !0
  ), he([e / r, n / r], t.properties);
}
var $e = { exports: {} }, Je = { exports: {} }, Pr = Je.exports, kn;
function Or() {
  return kn || (kn = 1, (function(s, t) {
    (function(e, n) {
      s.exports = n();
    })(Pr, function() {
      function e(g, x, u, w, m) {
        (function T(O, I, P, C, R) {
          for (; C > P; ) {
            if (C - P > 600) {
              var G = C - P + 1, p = I - P + 1, M = Math.log(G), _ = 0.5 * Math.exp(2 * M / 3), X = 0.5 * Math.sqrt(M * _ * (G - _) / G) * (p - G / 2 < 0 ? -1 : 1), B = Math.max(P, Math.floor(I - p * _ / G + X)), Y = Math.min(C, Math.floor(I + (G - p) * _ / G + X));
              T(O, I, B, Y, R);
            }
            var y = O[I], D = P, j = C;
            for (n(O, P, I), R(O[C], y) > 0 && n(O, P, C); D < j; ) {
              for (n(O, D, j), D++, j--; R(O[D], y) < 0; ) D++;
              for (; R(O[j], y) > 0; ) j--;
            }
            R(O[P], y) === 0 ? n(O, P, j) : n(O, ++j, C), j <= I && (P = j + 1), I <= j && (C = j - 1);
          }
        })(g, x, u || 0, w || g.length - 1, m || r);
      }
      function n(g, x, u) {
        var w = g[x];
        g[x] = g[u], g[u] = w;
      }
      function r(g, x) {
        return g < x ? -1 : g > x ? 1 : 0;
      }
      var i = function(g) {
        g === void 0 && (g = 9), this._maxEntries = Math.max(4, g), this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries)), this.clear();
      };
      function o(g, x, u) {
        if (!u) return x.indexOf(g);
        for (var w = 0; w < x.length; w++) if (u(g, x[w])) return w;
        return -1;
      }
      function a(g, x) {
        c(g, 0, g.children.length, x, g);
      }
      function c(g, x, u, w, m) {
        m || (m = F(null)), m.minX = 1 / 0, m.minY = 1 / 0, m.maxX = -1 / 0, m.maxY = -1 / 0;
        for (var T = x; T < u; T++) {
          var O = g.children[T];
          f(m, g.leaf ? w(O) : O);
        }
        return m;
      }
      function f(g, x) {
        return g.minX = Math.min(g.minX, x.minX), g.minY = Math.min(g.minY, x.minY), g.maxX = Math.max(g.maxX, x.maxX), g.maxY = Math.max(g.maxY, x.maxY), g;
      }
      function l(g, x) {
        return g.minX - x.minX;
      }
      function h(g, x) {
        return g.minY - x.minY;
      }
      function d(g) {
        return (g.maxX - g.minX) * (g.maxY - g.minY);
      }
      function b(g) {
        return g.maxX - g.minX + (g.maxY - g.minY);
      }
      function k(g, x) {
        return g.minX <= x.minX && g.minY <= x.minY && x.maxX <= g.maxX && x.maxY <= g.maxY;
      }
      function E(g, x) {
        return x.minX <= g.maxX && x.minY <= g.maxY && x.maxX >= g.minX && x.maxY >= g.minY;
      }
      function F(g) {
        return { children: g, height: 1, leaf: !0, minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
      }
      function L(g, x, u, w, m) {
        for (var T = [x, u]; T.length; ) if (!((u = T.pop()) - (x = T.pop()) <= w)) {
          var O = x + Math.ceil((u - x) / w / 2) * w;
          e(g, O, x, u, m), T.push(x, O, O, u);
        }
      }
      return i.prototype.all = function() {
        return this._all(this.data, []);
      }, i.prototype.search = function(g) {
        var x = this.data, u = [];
        if (!E(g, x)) return u;
        for (var w = this.toBBox, m = []; x; ) {
          for (var T = 0; T < x.children.length; T++) {
            var O = x.children[T], I = x.leaf ? w(O) : O;
            E(g, I) && (x.leaf ? u.push(O) : k(g, I) ? this._all(O, u) : m.push(O));
          }
          x = m.pop();
        }
        return u;
      }, i.prototype.collides = function(g) {
        var x = this.data;
        if (!E(g, x)) return !1;
        for (var u = []; x; ) {
          for (var w = 0; w < x.children.length; w++) {
            var m = x.children[w], T = x.leaf ? this.toBBox(m) : m;
            if (E(g, T)) {
              if (x.leaf || k(g, T)) return !0;
              u.push(m);
            }
          }
          x = u.pop();
        }
        return !1;
      }, i.prototype.load = function(g) {
        if (!g || !g.length) return this;
        if (g.length < this._minEntries) {
          for (var x = 0; x < g.length; x++) this.insert(g[x]);
          return this;
        }
        var u = this._build(g.slice(), 0, g.length - 1, 0);
        if (this.data.children.length) if (this.data.height === u.height) this._splitRoot(this.data, u);
        else {
          if (this.data.height < u.height) {
            var w = this.data;
            this.data = u, u = w;
          }
          this._insert(u, this.data.height - u.height - 1, !0);
        }
        else this.data = u;
        return this;
      }, i.prototype.insert = function(g) {
        return g && this._insert(g, this.data.height - 1), this;
      }, i.prototype.clear = function() {
        return this.data = F([]), this;
      }, i.prototype.remove = function(g, x) {
        if (!g) return this;
        for (var u, w, m, T = this.data, O = this.toBBox(g), I = [], P = []; T || I.length; ) {
          if (T || (T = I.pop(), w = I[I.length - 1], u = P.pop(), m = !0), T.leaf) {
            var C = o(g, T.children, x);
            if (C !== -1) return T.children.splice(C, 1), I.push(T), this._condense(I), this;
          }
          m || T.leaf || !k(T, O) ? w ? (u++, T = w.children[u], m = !1) : T = null : (I.push(T), P.push(u), u = 0, w = T, T = T.children[0]);
        }
        return this;
      }, i.prototype.toBBox = function(g) {
        return g;
      }, i.prototype.compareMinX = function(g, x) {
        return g.minX - x.minX;
      }, i.prototype.compareMinY = function(g, x) {
        return g.minY - x.minY;
      }, i.prototype.toJSON = function() {
        return this.data;
      }, i.prototype.fromJSON = function(g) {
        return this.data = g, this;
      }, i.prototype._all = function(g, x) {
        for (var u = []; g; ) g.leaf ? x.push.apply(x, g.children) : u.push.apply(u, g.children), g = u.pop();
        return x;
      }, i.prototype._build = function(g, x, u, w) {
        var m, T = u - x + 1, O = this._maxEntries;
        if (T <= O) return a(m = F(g.slice(x, u + 1)), this.toBBox), m;
        w || (w = Math.ceil(Math.log(T) / Math.log(O)), O = Math.ceil(T / Math.pow(O, w - 1))), (m = F([])).leaf = !1, m.height = w;
        var I = Math.ceil(T / O), P = I * Math.ceil(Math.sqrt(O));
        L(g, x, u, P, this.compareMinX);
        for (var C = x; C <= u; C += P) {
          var R = Math.min(C + P - 1, u);
          L(g, C, R, I, this.compareMinY);
          for (var G = C; G <= R; G += I) {
            var p = Math.min(G + I - 1, R);
            m.children.push(this._build(g, G, p, w - 1));
          }
        }
        return a(m, this.toBBox), m;
      }, i.prototype._chooseSubtree = function(g, x, u, w) {
        for (; w.push(x), !x.leaf && w.length - 1 !== u; ) {
          for (var m = 1 / 0, T = 1 / 0, O = void 0, I = 0; I < x.children.length; I++) {
            var P = x.children[I], C = d(P), R = (G = g, p = P, (Math.max(p.maxX, G.maxX) - Math.min(p.minX, G.minX)) * (Math.max(p.maxY, G.maxY) - Math.min(p.minY, G.minY)) - C);
            R < T ? (T = R, m = C < m ? C : m, O = P) : R === T && C < m && (m = C, O = P);
          }
          x = O || x.children[0];
        }
        var G, p;
        return x;
      }, i.prototype._insert = function(g, x, u) {
        var w = u ? g : this.toBBox(g), m = [], T = this._chooseSubtree(w, this.data, x, m);
        for (T.children.push(g), f(T, w); x >= 0 && m[x].children.length > this._maxEntries; ) this._split(m, x), x--;
        this._adjustParentBBoxes(w, m, x);
      }, i.prototype._split = function(g, x) {
        var u = g[x], w = u.children.length, m = this._minEntries;
        this._chooseSplitAxis(u, m, w);
        var T = this._chooseSplitIndex(u, m, w), O = F(u.children.splice(T, u.children.length - T));
        O.height = u.height, O.leaf = u.leaf, a(u, this.toBBox), a(O, this.toBBox), x ? g[x - 1].children.push(O) : this._splitRoot(u, O);
      }, i.prototype._splitRoot = function(g, x) {
        this.data = F([g, x]), this.data.height = g.height + 1, this.data.leaf = !1, a(this.data, this.toBBox);
      }, i.prototype._chooseSplitIndex = function(g, x, u) {
        for (var w, m, T, O, I, P, C, R = 1 / 0, G = 1 / 0, p = x; p <= u - x; p++) {
          var M = c(g, 0, p, this.toBBox), _ = c(g, p, u, this.toBBox), X = (m = M, T = _, O = void 0, I = void 0, P = void 0, C = void 0, O = Math.max(m.minX, T.minX), I = Math.max(m.minY, T.minY), P = Math.min(m.maxX, T.maxX), C = Math.min(m.maxY, T.maxY), Math.max(0, P - O) * Math.max(0, C - I)), B = d(M) + d(_);
          X < R ? (R = X, w = p, G = B < G ? B : G) : X === R && B < G && (G = B, w = p);
        }
        return w || u - x;
      }, i.prototype._chooseSplitAxis = function(g, x, u) {
        var w = g.leaf ? this.compareMinX : l, m = g.leaf ? this.compareMinY : h;
        this._allDistMargin(g, x, u, w) < this._allDistMargin(g, x, u, m) && g.children.sort(w);
      }, i.prototype._allDistMargin = function(g, x, u, w) {
        g.children.sort(w);
        for (var m = this.toBBox, T = c(g, 0, x, m), O = c(g, u - x, u, m), I = b(T) + b(O), P = x; P < u - x; P++) {
          var C = g.children[P];
          f(T, g.leaf ? m(C) : C), I += b(T);
        }
        for (var R = u - x - 1; R >= x; R--) {
          var G = g.children[R];
          f(O, g.leaf ? m(G) : G), I += b(O);
        }
        return I;
      }, i.prototype._adjustParentBBoxes = function(g, x, u) {
        for (var w = u; w >= 0; w--) f(x[w], g);
      }, i.prototype._condense = function(g) {
        for (var x = g.length - 1, u = void 0; x >= 0; x--) g[x].children.length === 0 ? x > 0 ? (u = g[x - 1].children).splice(u.indexOf(g[x]), 1) : this.clear() : a(g[x], this.toBBox);
      }, i;
    });
  })(Je)), Je.exports;
}
class Nr {
  constructor(t = [], e = Xr) {
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
      const i = t - 1 >> 1, o = e[i];
      if (n(r, o) >= 0) break;
      e[t] = o, t = i;
    }
    e[t] = r;
  }
  _down(t) {
    const { data: e, compare: n } = this, r = this.length >> 1, i = e[t];
    for (; t < r; ) {
      let o = (t << 1) + 1, a = e[o];
      const c = o + 1;
      if (c < this.length && n(e[c], a) < 0 && (o = c, a = e[c]), n(a, i) >= 0) break;
      e[t] = a, t = o;
    }
    e[t] = i;
  }
}
function Xr(s, t) {
  return s < t ? -1 : s > t ? 1 : 0;
}
const Dr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Nr
}, Symbol.toStringTag, { value: "Module" })), Cr = /* @__PURE__ */ Br(Dr);
var Se = { exports: {} }, hn, En;
function Rr() {
  return En || (En = 1, hn = function(t, e, n, r) {
    var i = t[0], o = t[1], a = !1;
    n === void 0 && (n = 0), r === void 0 && (r = e.length);
    for (var c = (r - n) / 2, f = 0, l = c - 1; f < c; l = f++) {
      var h = e[n + f * 2 + 0], d = e[n + f * 2 + 1], b = e[n + l * 2 + 0], k = e[n + l * 2 + 1], E = d > o != k > o && i < (b - h) * (o - d) / (k - d) + h;
      E && (a = !a);
    }
    return a;
  }), hn;
}
var ln, An;
function Fr() {
  return An || (An = 1, ln = function(t, e, n, r) {
    var i = t[0], o = t[1], a = !1;
    n === void 0 && (n = 0), r === void 0 && (r = e.length);
    for (var c = r - n, f = 0, l = c - 1; f < c; l = f++) {
      var h = e[f + n][0], d = e[f + n][1], b = e[l + n][0], k = e[l + n][1], E = d > o != k > o && i < (b - h) * (o - d) / (k - d) + h;
      E && (a = !a);
    }
    return a;
  }), ln;
}
var In;
function Yr() {
  if (In) return Se.exports;
  In = 1;
  var s = Rr(), t = Fr();
  return Se.exports = function(n, r, i, o) {
    return r.length > 0 && Array.isArray(r[0]) ? t(n, r, i, o) : s(n, r, i, o);
  }, Se.exports.nested = t, Se.exports.flat = s, Se.exports;
}
var Ee = { exports: {} }, Lr = Ee.exports, Bn;
function $r() {
  return Bn || (Bn = 1, (function(s, t) {
    (function(e, n) {
      n(t);
    })(Lr, function(e) {
      const r = 33306690738754706e-32;
      function i(E, F, L, g, x) {
        let u, w, m, T, O = F[0], I = g[0], P = 0, C = 0;
        I > O == I > -O ? (u = O, O = F[++P]) : (u = I, I = g[++C]);
        let R = 0;
        if (P < E && C < L) for (I > O == I > -O ? (m = u - ((w = O + u) - O), O = F[++P]) : (m = u - ((w = I + u) - I), I = g[++C]), u = w, m !== 0 && (x[R++] = m); P < E && C < L; ) I > O == I > -O ? (m = u - ((w = u + O) - (T = w - u)) + (O - T), O = F[++P]) : (m = u - ((w = u + I) - (T = w - u)) + (I - T), I = g[++C]), u = w, m !== 0 && (x[R++] = m);
        for (; P < E; ) m = u - ((w = u + O) - (T = w - u)) + (O - T), O = F[++P], u = w, m !== 0 && (x[R++] = m);
        for (; C < L; ) m = u - ((w = u + I) - (T = w - u)) + (I - T), I = g[++C], u = w, m !== 0 && (x[R++] = m);
        return u === 0 && R !== 0 || (x[R++] = u), R;
      }
      function o(E) {
        return new Float64Array(E);
      }
      const a = 33306690738754716e-32, c = 22204460492503146e-32, f = 11093356479670487e-47, l = o(4), h = o(8), d = o(12), b = o(16), k = o(4);
      e.orient2d = function(E, F, L, g, x, u) {
        const w = (F - u) * (L - x), m = (E - x) * (g - u), T = w - m;
        if (w === 0 || m === 0 || w > 0 != m > 0) return T;
        const O = Math.abs(w + m);
        return Math.abs(T) >= a * O ? T : -(function(I, P, C, R, G, p, M) {
          let _, X, B, Y, y, D, j, q, Q, H, rt, J, lt, ht, ut, dt, gt, mt;
          const It = I - G, Nt = C - G, _t = P - p, Mt = R - p;
          y = (ut = (q = It - (j = (D = 134217729 * It) - (D - It))) * (H = Mt - (Q = (D = 134217729 * Mt) - (D - Mt))) - ((ht = It * Mt) - j * Q - q * Q - j * H)) - (rt = ut - (gt = (q = _t - (j = (D = 134217729 * _t) - (D - _t))) * (H = Nt - (Q = (D = 134217729 * Nt) - (D - Nt))) - ((dt = _t * Nt) - j * Q - q * Q - j * H))), l[0] = ut - (rt + y) + (y - gt), y = (lt = ht - ((J = ht + rt) - (y = J - ht)) + (rt - y)) - (rt = lt - dt), l[1] = lt - (rt + y) + (y - dt), y = (mt = J + rt) - J, l[2] = J - (mt - y) + (rt - y), l[3] = mt;
          let Ht = (function(Ne, ye) {
            let _e = ye[0];
            for (let ue = 1; ue < Ne; ue++) _e += ye[ue];
            return _e;
          })(4, l), le = c * M;
          if (Ht >= le || -Ht >= le || (_ = I - (It + (y = I - It)) + (y - G), B = C - (Nt + (y = C - Nt)) + (y - G), X = P - (_t + (y = P - _t)) + (y - p), Y = R - (Mt + (y = R - Mt)) + (y - p), _ === 0 && X === 0 && B === 0 && Y === 0) || (le = f * M + r * Math.abs(Ht), (Ht += It * Y + Mt * _ - (_t * B + Nt * X)) >= le || -Ht >= le)) return Ht;
          y = (ut = (q = _ - (j = (D = 134217729 * _) - (D - _))) * (H = Mt - (Q = (D = 134217729 * Mt) - (D - Mt))) - ((ht = _ * Mt) - j * Q - q * Q - j * H)) - (rt = ut - (gt = (q = X - (j = (D = 134217729 * X) - (D - X))) * (H = Nt - (Q = (D = 134217729 * Nt) - (D - Nt))) - ((dt = X * Nt) - j * Q - q * Q - j * H))), k[0] = ut - (rt + y) + (y - gt), y = (lt = ht - ((J = ht + rt) - (y = J - ht)) + (rt - y)) - (rt = lt - dt), k[1] = lt - (rt + y) + (y - dt), y = (mt = J + rt) - J, k[2] = J - (mt - y) + (rt - y), k[3] = mt;
          const Qe = i(4, l, 4, k, h);
          y = (ut = (q = It - (j = (D = 134217729 * It) - (D - It))) * (H = Y - (Q = (D = 134217729 * Y) - (D - Y))) - ((ht = It * Y) - j * Q - q * Q - j * H)) - (rt = ut - (gt = (q = _t - (j = (D = 134217729 * _t) - (D - _t))) * (H = B - (Q = (D = 134217729 * B) - (D - B))) - ((dt = _t * B) - j * Q - q * Q - j * H))), k[0] = ut - (rt + y) + (y - gt), y = (lt = ht - ((J = ht + rt) - (y = J - ht)) + (rt - y)) - (rt = lt - dt), k[1] = lt - (rt + y) + (y - dt), y = (mt = J + rt) - J, k[2] = J - (mt - y) + (rt - y), k[3] = mt;
          const Ft = i(Qe, h, 4, k, d);
          y = (ut = (q = _ - (j = (D = 134217729 * _) - (D - _))) * (H = Y - (Q = (D = 134217729 * Y) - (D - Y))) - ((ht = _ * Y) - j * Q - q * Q - j * H)) - (rt = ut - (gt = (q = X - (j = (D = 134217729 * X) - (D - X))) * (H = B - (Q = (D = 134217729 * B) - (D - B))) - ((dt = X * B) - j * Q - q * Q - j * H))), k[0] = ut - (rt + y) + (y - gt), y = (lt = ht - ((J = ht + rt) - (y = J - ht)) + (rt - y)) - (rt = lt - dt), k[1] = lt - (rt + y) + (y - dt), y = (mt = J + rt) - J, k[2] = J - (mt - y) + (rt - y), k[3] = mt;
          const qt = i(Ft, d, 4, k, b);
          return b[qt - 1];
        })(E, F, L, g, x, u, O);
      }, e.orient2dfast = function(E, F, L, g, x, u) {
        return (F - u) * (L - x) - (E - x) * (g - u);
      }, Object.defineProperty(e, "__esModule", { value: !0 });
    });
  })(Ee, Ee.exports)), Ee.exports;
}
var Tn;
function Vr() {
  if (Tn) return $e.exports;
  Tn = 1;
  var s = Or(), t = Cr, e = Yr(), n = $r().orient2d;
  t.default && (t = t.default), $e.exports = r, $e.exports.default = r;
  function r(u, w, m) {
    w = Math.max(0, w === void 0 ? 2 : w), m = m || 0;
    var T = b(u), O = new s(16);
    O.toBBox = function(j) {
      return {
        minX: j[0],
        minY: j[1],
        maxX: j[0],
        maxY: j[1]
      };
    }, O.compareMinX = function(j, q) {
      return j[0] - q[0];
    }, O.compareMinY = function(j, q) {
      return j[1] - q[1];
    }, O.load(u);
    for (var I = [], P = 0, C; P < T.length; P++) {
      var R = T[P];
      O.remove(R), C = k(R, C), I.push(C);
    }
    var G = new s(16);
    for (P = 0; P < I.length; P++) G.insert(d(I[P]));
    for (var p = w * w, M = m * m; I.length; ) {
      var _ = I.shift(), X = _.p, B = _.next.p, Y = E(X, B);
      if (!(Y < M)) {
        var y = Y / p;
        R = i(O, _.prev.p, X, B, _.next.next.p, y, G), R && Math.min(E(R, X), E(R, B)) <= y && (I.push(_), I.push(k(R, _)), O.remove(R), G.remove(_), G.insert(d(_)), G.insert(d(_.next)));
      }
    }
    _ = C;
    var D = [];
    do
      D.push(_.p), _ = _.next;
    while (_ !== C);
    return D.push(_.p), D;
  }
  function i(u, w, m, T, O, I, P) {
    for (var C = new t([], o), R = u.data; R; ) {
      for (var G = 0; G < R.children.length; G++) {
        var p = R.children[G], M = R.leaf ? F(p, m, T) : a(m, T, p);
        M > I || C.push({
          node: p,
          dist: M
        });
      }
      for (; C.length && !C.peek().node.children; ) {
        var _ = C.pop(), X = _.node, B = F(X, w, m), Y = F(X, T, O);
        if (_.dist < B && _.dist < Y && f(m, X, P) && f(T, X, P)) return X;
      }
      R = C.pop(), R && (R = R.node);
    }
    return null;
  }
  function o(u, w) {
    return u.dist - w.dist;
  }
  function a(u, w, m) {
    if (c(u, m) || c(w, m)) return 0;
    var T = L(u[0], u[1], w[0], w[1], m.minX, m.minY, m.maxX, m.minY);
    if (T === 0) return 0;
    var O = L(u[0], u[1], w[0], w[1], m.minX, m.minY, m.minX, m.maxY);
    if (O === 0) return 0;
    var I = L(u[0], u[1], w[0], w[1], m.maxX, m.minY, m.maxX, m.maxY);
    if (I === 0) return 0;
    var P = L(u[0], u[1], w[0], w[1], m.minX, m.maxY, m.maxX, m.maxY);
    return P === 0 ? 0 : Math.min(T, O, I, P);
  }
  function c(u, w) {
    return u[0] >= w.minX && u[0] <= w.maxX && u[1] >= w.minY && u[1] <= w.maxY;
  }
  function f(u, w, m) {
    for (var T = Math.min(u[0], w[0]), O = Math.min(u[1], w[1]), I = Math.max(u[0], w[0]), P = Math.max(u[1], w[1]), C = m.search({ minX: T, minY: O, maxX: I, maxY: P }), R = 0; R < C.length; R++)
      if (h(C[R].p, C[R].next.p, u, w)) return !1;
    return !0;
  }
  function l(u, w, m) {
    return n(u[0], u[1], w[0], w[1], m[0], m[1]);
  }
  function h(u, w, m, T) {
    return u !== T && w !== m && l(u, w, m) > 0 != l(u, w, T) > 0 && l(m, T, u) > 0 != l(m, T, w) > 0;
  }
  function d(u) {
    var w = u.p, m = u.next.p;
    return u.minX = Math.min(w[0], m[0]), u.minY = Math.min(w[1], m[1]), u.maxX = Math.max(w[0], m[0]), u.maxY = Math.max(w[1], m[1]), u;
  }
  function b(u) {
    for (var w = u[0], m = u[0], T = u[0], O = u[0], I = 0; I < u.length; I++) {
      var P = u[I];
      P[0] < w[0] && (w = P), P[0] > T[0] && (T = P), P[1] < m[1] && (m = P), P[1] > O[1] && (O = P);
    }
    var C = [w, m, T, O], R = C.slice();
    for (I = 0; I < u.length; I++)
      e(u[I], C) || R.push(u[I]);
    return x(R);
  }
  function k(u, w) {
    var m = {
      p: u,
      prev: null,
      next: null,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };
    return w ? (m.next = w.next, m.prev = w, w.next.prev = m, w.next = m) : (m.prev = m, m.next = m), m;
  }
  function E(u, w) {
    var m = u[0] - w[0], T = u[1] - w[1];
    return m * m + T * T;
  }
  function F(u, w, m) {
    var T = w[0], O = w[1], I = m[0] - T, P = m[1] - O;
    if (I !== 0 || P !== 0) {
      var C = ((u[0] - T) * I + (u[1] - O) * P) / (I * I + P * P);
      C > 1 ? (T = m[0], O = m[1]) : C > 0 && (T += I * C, O += P * C);
    }
    return I = u[0] - T, P = u[1] - O, I * I + P * P;
  }
  function L(u, w, m, T, O, I, P, C) {
    var R = m - u, G = T - w, p = P - O, M = C - I, _ = u - O, X = w - I, B = R * R + G * G, Y = R * p + G * M, y = p * p + M * M, D = R * _ + G * X, j = p * _ + M * X, q = B * y - Y * Y, Q, H, rt, J, lt = q, ht = q;
    q === 0 ? (H = 0, lt = 1, J = j, ht = y) : (H = Y * j - y * D, J = B * j - Y * D, H < 0 ? (H = 0, J = j, ht = y) : H > lt && (H = lt, J = j + Y, ht = y)), J < 0 ? (J = 0, -D < 0 ? H = 0 : -D > B ? H = lt : (H = -D, lt = B)) : J > ht && (J = ht, -D + Y < 0 ? H = 0 : -D + Y > B ? H = lt : (H = -D + Y, lt = B)), Q = H === 0 ? 0 : H / lt, rt = J === 0 ? 0 : J / ht;
    var ut = (1 - Q) * u + Q * m, dt = (1 - Q) * w + Q * T, gt = (1 - rt) * O + rt * P, mt = (1 - rt) * I + rt * C, It = gt - ut, Nt = mt - dt;
    return It * It + Nt * Nt;
  }
  function g(u, w) {
    return u[0] === w[0] ? u[1] - w[1] : u[0] - w[0];
  }
  function x(u) {
    u.sort(g);
    for (var w = [], m = 0; m < u.length; m++) {
      for (; w.length >= 2 && l(w[w.length - 2], w[w.length - 1], u[m]) <= 0; )
        w.pop();
      w.push(u[m]);
    }
    for (var T = [], O = u.length - 1; O >= 0; O--) {
      for (; T.length >= 2 && l(T[T.length - 2], T[T.length - 1], u[O]) <= 0; )
        T.pop();
      T.push(u[O]);
    }
    return T.pop(), w.pop(), w.concat(T);
  }
  return $e.exports;
}
var jr = Vr();
const qr = /* @__PURE__ */ Ir(jr);
function Pn(s, t = {}) {
  t.concavity = t.concavity || 1 / 0;
  const e = [];
  if (dn(s, (r) => {
    e.push([r[0], r[1]]);
  }), !e.length)
    return null;
  const n = qr(e, t.concavity);
  return n.length > 3 ? Oe([n]) : null;
}
var Ae = { exports: {} }, Ur = Ae.exports, On;
function zr() {
  return On || (On = 1, (function(s, t) {
    (function(e, n) {
      n(t);
    })(Ur, (function(e) {
      function n(S, v, A = {}) {
        const N = { type: "Feature" };
        return (A.id === 0 || A.id) && (N.id = A.id), A.bbox && (N.bbox = A.bbox), N.properties = v || {}, N.geometry = S, N;
      }
      function r(S, v, A = {}) {
        if (!S) throw new Error("coordinates is required");
        if (!Array.isArray(S)) throw new Error("coordinates must be an Array");
        if (S.length < 2) throw new Error("coordinates must be at least 2 numbers long");
        if (!a(S[0]) || !a(S[1])) throw new Error("coordinates must contain numbers");
        return n({ type: "Point", coordinates: S }, v, A);
      }
      function i(S, v, A = {}) {
        for (const N of S) {
          if (N.length < 4) throw new Error("Each LinearRing of a Polygon must have 4 or more Positions.");
          if (N[N.length - 1].length !== N[0].length) throw new Error("First and last Position are not equivalent.");
          for (let $ = 0; $ < N[N.length - 1].length; $++) if (N[N.length - 1][$] !== N[0][$]) throw new Error("First and last Position are not equivalent.");
        }
        return n({ type: "Polygon", coordinates: S }, v, A);
      }
      function o(S, v = {}) {
        const A = { type: "FeatureCollection" };
        return v.id && (A.id = v.id), v.bbox && (A.bbox = v.bbox), A.features = S, A;
      }
      function a(S) {
        return !isNaN(S) && S !== null && !Array.isArray(S);
      }
      function c(S) {
        if (!S) throw new Error("coord is required");
        if (!Array.isArray(S)) {
          if (S.type === "Feature" && S.geometry !== null && S.geometry.type === "Point") return [...S.geometry.coordinates];
          if (S.type === "Point") return [...S.coordinates];
        }
        if (Array.isArray(S) && S.length >= 2 && !Array.isArray(S[0]) && !Array.isArray(S[1])) return [...S];
        throw new Error("coord must be GeoJSON Point or an Array of numbers");
      }
      function f(S) {
        if (Array.isArray(S)) return S;
        if (S.type === "Feature") {
          if (S.geometry !== null) return S.geometry.coordinates;
        } else if (S.coordinates) return S.coordinates;
        throw new Error("coords must be GeoJSON Feature, Geometry Object or an Array");
      }
      function l(S) {
        return S.type === "Feature" ? S.geometry : S;
      }
      const h = 11102230246251565e-32, d = 134217729, b = (3 + 8 * h) * h;
      function k(S, v, A, N, $) {
        let V, z, et, Z, it = v[0], at = N[0], K = 0, tt = 0;
        at > it == at > -it ? (V = it, it = v[++K]) : (V = at, at = N[++tt]);
        let ft = 0;
        if (K < S && tt < A) for (at > it == at > -it ? (z = it + V, et = V - (z - it), it = v[++K]) : (z = at + V, et = V - (z - at), at = N[++tt]), V = z, et !== 0 && ($[ft++] = et); K < S && tt < A; ) at > it == at > -it ? (z = V + it, Z = z - V, et = V - (z - Z) + (it - Z), it = v[++K]) : (z = V + at, Z = z - V, et = V - (z - Z) + (at - Z), at = N[++tt]), V = z, et !== 0 && ($[ft++] = et);
        for (; K < S; ) z = V + it, Z = z - V, et = V - (z - Z) + (it - Z), it = v[++K], V = z, et !== 0 && ($[ft++] = et);
        for (; tt < A; ) z = V + at, Z = z - V, et = V - (z - Z) + (at - Z), at = N[++tt], V = z, et !== 0 && ($[ft++] = et);
        return (V !== 0 || ft === 0) && ($[ft++] = V), ft;
      }
      function E(S, v) {
        let A = v[0];
        for (let N = 1; N < S; N++) A += v[N];
        return A;
      }
      function F(S) {
        return new Float64Array(S);
      }
      const L = (3 + 16 * h) * h, g = (2 + 12 * h) * h, x = (9 + 64 * h) * h * h, u = F(4), w = F(8), m = F(12), T = F(16), O = F(4);
      function I(S, v, A, N, $, V, z) {
        let et, Z, it, at, K, tt, ft, wt, ot, nt, W, yt, At, St, Ot, xt, Bt, Ct;
        const Wt = S - $, Gt = A - $, Jt = v - V, Kt = N - V;
        St = Wt * Kt, tt = d * Wt, ft = tt - (tt - Wt), wt = Wt - ft, tt = d * Kt, ot = tt - (tt - Kt), nt = Kt - ot, Ot = wt * nt - (St - ft * ot - wt * ot - ft * nt), xt = Jt * Gt, tt = d * Jt, ft = tt - (tt - Jt), wt = Jt - ft, tt = d * Gt, ot = tt - (tt - Gt), nt = Gt - ot, Bt = wt * nt - (xt - ft * ot - wt * ot - ft * nt), W = Ot - Bt, K = Ot - W, u[0] = Ot - (W + K) + (K - Bt), yt = St + W, K = yt - St, At = St - (yt - K) + (W - K), W = At - xt, K = At - W, u[1] = At - (W + K) + (K - xt), Ct = yt + W, K = Ct - yt, u[2] = yt - (Ct - K) + (W - K), u[3] = Ct;
        let pe = E(4, u), Me = g * z;
        if (pe >= Me || -pe >= Me || (K = S - Wt, et = S - (Wt + K) + (K - $), K = A - Gt, it = A - (Gt + K) + (K - $), K = v - Jt, Z = v - (Jt + K) + (K - V), K = N - Kt, at = N - (Kt + K) + (K - V), et === 0 && Z === 0 && it === 0 && at === 0) || (Me = x * z + b * Math.abs(pe), pe += Wt * at + Kt * et - (Jt * it + Gt * Z), pe >= Me || -pe >= Me)) return pe;
        St = et * Kt, tt = d * et, ft = tt - (tt - et), wt = et - ft, tt = d * Kt, ot = tt - (tt - Kt), nt = Kt - ot, Ot = wt * nt - (St - ft * ot - wt * ot - ft * nt), xt = Z * Gt, tt = d * Z, ft = tt - (tt - Z), wt = Z - ft, tt = d * Gt, ot = tt - (tt - Gt), nt = Gt - ot, Bt = wt * nt - (xt - ft * ot - wt * ot - ft * nt), W = Ot - Bt, K = Ot - W, O[0] = Ot - (W + K) + (K - Bt), yt = St + W, K = yt - St, At = St - (yt - K) + (W - K), W = At - xt, K = At - W, O[1] = At - (W + K) + (K - xt), Ct = yt + W, K = Ct - yt, O[2] = yt - (Ct - K) + (W - K), O[3] = Ct;
        const rr = k(4, u, 4, O, w);
        St = Wt * at, tt = d * Wt, ft = tt - (tt - Wt), wt = Wt - ft, tt = d * at, ot = tt - (tt - at), nt = at - ot, Ot = wt * nt - (St - ft * ot - wt * ot - ft * nt), xt = Jt * it, tt = d * Jt, ft = tt - (tt - Jt), wt = Jt - ft, tt = d * it, ot = tt - (tt - it), nt = it - ot, Bt = wt * nt - (xt - ft * ot - wt * ot - ft * nt), W = Ot - Bt, K = Ot - W, O[0] = Ot - (W + K) + (K - Bt), yt = St + W, K = yt - St, At = St - (yt - K) + (W - K), W = At - xt, K = At - W, O[1] = At - (W + K) + (K - xt), Ct = yt + W, K = Ct - yt, O[2] = yt - (Ct - K) + (W - K), O[3] = Ct;
        const ir = k(rr, w, 4, O, m);
        St = et * at, tt = d * et, ft = tt - (tt - et), wt = et - ft, tt = d * at, ot = tt - (tt - at), nt = at - ot, Ot = wt * nt - (St - ft * ot - wt * ot - ft * nt), xt = Z * it, tt = d * Z, ft = tt - (tt - Z), wt = Z - ft, tt = d * it, ot = tt - (tt - it), nt = it - ot, Bt = wt * nt - (xt - ft * ot - wt * ot - ft * nt), W = Ot - Bt, K = Ot - W, O[0] = Ot - (W + K) + (K - Bt), yt = St + W, K = yt - St, At = St - (yt - K) + (W - K), W = At - xt, K = At - W, O[1] = At - (W + K) + (K - xt), Ct = yt + W, K = Ct - yt, O[2] = yt - (Ct - K) + (W - K), O[3] = Ct;
        const or = k(ir, m, 4, O, T);
        return T[or - 1];
      }
      function P(S, v, A, N, $, V) {
        const z = (v - V) * (A - $), et = (S - $) * (N - V), Z = z - et, it = Math.abs(z + et);
        return Math.abs(Z) >= L * it ? Z : -I(S, v, A, N, $, V, it);
      }
      function C(S, v) {
        var A, N, $ = 0, V, z, et, Z, it, at, K, tt = S[0], ft = S[1], wt = v.length;
        for (A = 0; A < wt; A++) {
          N = 0;
          var ot = v[A], nt = ot.length - 1;
          if (at = ot[0], at[0] !== ot[nt][0] && at[1] !== ot[nt][1]) throw new Error("First and last coordinates in a ring must be the same");
          for (z = at[0] - tt, et = at[1] - ft, N; N < nt; N++) {
            if (K = ot[N + 1], Z = K[0] - tt, it = K[1] - ft, et === 0 && it === 0) {
              if (Z <= 0 && z >= 0 || z <= 0 && Z >= 0) return 0;
            } else if (it >= 0 && et <= 0 || it <= 0 && et >= 0) {
              if (V = P(z, Z, et, it, 0, 0), V === 0) return 0;
              (V > 0 && it > 0 && et <= 0 || V < 0 && it <= 0 && et > 0) && $++;
            }
            at = K, et = it, z = Z;
          }
        }
        return $ % 2 !== 0;
      }
      function R(S, v, A = {}) {
        if (!S) throw new Error("point is required");
        if (!v) throw new Error("polygon is required");
        const N = c(S), $ = l(v), V = $.type, z = v.bbox;
        let et = $.coordinates;
        if (z && G(N, z) === !1) return !1;
        V === "Polygon" && (et = [et]);
        let Z = !1;
        for (var it = 0; it < et.length; ++it) {
          const at = C(N, et[it]);
          if (at === 0) return !A.ignoreBoundary;
          at && (Z = !0);
        }
        return Z;
      }
      function G(S, v) {
        return v[0] <= S[0] && v[1] <= S[1] && v[2] >= S[0] && v[3] >= S[1];
      }
      function p(S, v) {
        for (let A = 0; A < v.features.length; A++) if (R(S, v.features[A])) return v.features[A];
      }
      function M(S, v, A) {
        const N = v.geometry.coordinates[0][0], $ = v.geometry.coordinates[0][1], V = v.geometry.coordinates[0][2], z = S.geometry.coordinates, et = v.properties.a.geom, Z = v.properties.b.geom, it = v.properties.c.geom, at = [$[0] - N[0], $[1] - N[1]], K = [V[0] - N[0], V[1] - N[1]], tt = [z[0] - N[0], z[1] - N[1]], ft = [Z[0] - et[0], Z[1] - et[1]], wt = [it[0] - et[0], it[1] - et[1]];
        let ot = (K[1] * tt[0] - K[0] * tt[1]) / (at[0] * K[1] - at[1] * K[0]), nt = (at[0] * tt[1] - at[1] * tt[0]) / (at[0] * K[1] - at[1] * K[0]);
        if (A) {
          const W = A[v.properties.a.index], yt = A[v.properties.b.index], At = A[v.properties.c.index];
          let St;
          if (ot < 0 || nt < 0 || 1 - ot - nt < 0) {
            const Ot = ot / (ot + nt), xt = nt / (ot + nt);
            St = ot / yt / (Ot / yt + xt / At), nt = nt / At / (Ot / yt + xt / At);
          } else St = ot / yt / (ot / yt + nt / At + (1 - ot - nt) / W), nt = nt / At / (ot / yt + nt / At + (1 - ot - nt) / W);
          ot = St;
        }
        return [ot * ft[0] + nt * wt[0] + et[0], ot * ft[1] + nt * wt[1] + et[1]];
      }
      function _(S, v, A, N) {
        const $ = S.geometry.coordinates, V = A.geometry.coordinates, z = Math.atan2($[0] - V[0], $[1] - V[1]), et = Y(z, v[0]);
        if (et === void 0) throw new Error("Unable to determine vertex index");
        const Z = v[1][et];
        return M(S, Z.features[0], N);
      }
      function X(S, v, A, N, $, V, z, et) {
        let Z;
        if (z && (Z = p(S, o([z]))), !Z) if (A) {
          const it = S.geometry.coordinates, at = A.gridNum, K = A.xOrigin, tt = A.yOrigin, ft = A.xUnit, wt = A.yUnit, ot = A.gridCache, nt = B(it[0], K, ft, at), W = B(it[1], tt, wt, at), yt = ot[nt] ? ot[nt][W] ? ot[nt][W] : [] : [], At = o(yt.map((St) => v.features[St]));
          Z = p(S, At);
        } else Z = p(S, v);
        return et && et(Z), Z ? M(S, Z, V) : _(S, N, $, V);
      }
      function B(S, v, A, N) {
        let $ = Math.floor((S - v) / A);
        return $ < 0 && ($ = 0), $ >= N && ($ = N - 1), $;
      }
      function Y(S, v) {
        let A = y(S - v[0]), N = Math.PI * 2, $;
        for (let V = 0; V < v.length; V++) {
          const z = (V + 1) % v.length, et = y(S - v[z]), Z = Math.min(Math.abs(A), Math.abs(et));
          A * et <= 0 && Z < N && (N = Z, $ = V), A = et;
        }
        return $;
      }
      function y(S, v = !1) {
        const A = 2 * Math.PI, N = S - Math.floor(S / A) * A;
        return v ? N : N > Math.PI ? N - A : N;
      }
      function D(S) {
        const v = S.features;
        for (let A = 0; A < v.length; A++) {
          const N = v[A];
          `${N.properties.a.index}`.substring(0, 1) === "b" && `${N.properties.b.index}`.substring(0, 1) === "b" ? v[A] = { geometry: { type: "Polygon", coordinates: [[N.geometry.coordinates[0][2], N.geometry.coordinates[0][0], N.geometry.coordinates[0][1], N.geometry.coordinates[0][2]]] }, properties: { a: { geom: N.properties.c.geom, index: N.properties.c.index }, b: { geom: N.properties.a.geom, index: N.properties.a.index }, c: { geom: N.properties.b.geom, index: N.properties.b.index } }, type: "Feature" } : `${N.properties.c.index}`.substring(0, 1) === "b" && `${N.properties.a.index}`.substring(0, 1) === "b" && (v[A] = { geometry: { type: "Polygon", coordinates: [[N.geometry.coordinates[0][1], N.geometry.coordinates[0][2], N.geometry.coordinates[0][0], N.geometry.coordinates[0][1]]] }, properties: { a: { geom: N.properties.b.geom, index: N.properties.b.index }, b: { geom: N.properties.c.geom, index: N.properties.c.index }, c: { geom: N.properties.a.geom, index: N.properties.a.index } }, type: "Feature" });
        }
        return S;
      }
      function j(S) {
        const v = ["a", "b", "c", "a"].map((V) => S.properties[V].geom), A = S.geometry.coordinates[0], N = S.properties, $ = { a: { geom: A[0], index: N.a.index }, b: { geom: A[1], index: N.b.index }, c: { geom: A[2], index: N.c.index } };
        return i([v], $);
      }
      function q(S) {
        const v = [0, 1, 2, 0].map((N) => S[N][0][0]), A = { a: { geom: S[0][0][1], index: S[0][1] }, b: { geom: S[1][0][1], index: S[1][1] }, c: { geom: S[2][0][1], index: S[2][1] } };
        return i([v], A);
      }
      function Q(S, v, A, N, $, V = !1, z) {
        const et = S.map((Z) => {
          (!z || z < 2.00703) && (Z = H(Z));
          const it = isFinite(Z) ? v[Z] : Z === "c" ? N : (function() {
            const at = Z.match(/^b(\d+)$/);
            if (at) return $[parseInt(at[1])];
            const K = Z.match(/^e(\d+)$/);
            if (K) return A[parseInt(K[1])];
            throw new Error("Bad index value for indexesToTri");
          })();
          return V ? [[it[1], it[0]], Z] : [[it[0], it[1]], Z];
        });
        return q(et);
      }
      function H(S) {
        return typeof S == "number" ? S : S.replace(/^(c|e|b)(?:ent|dgeNode|box)(\d+)?$/, "$1$2");
      }
      function rt(S, v) {
        return v && v >= 2.00703 || Array.isArray(S[0]) ? S : S.map((A) => [A.illstNodes, A.mercNodes, A.startEnd]);
      }
      const J = 2.00703;
      function lt(S) {
        return !!(S.version !== void 0 || !S.tins && S.points && S.tins_points);
      }
      function ht(S) {
        return { points: S.points, pointsWeightBuffer: dt(S), strictStatus: gt(S), verticesParams: mt(S), centroid: Nt(S), edges: rt(S.edges || []), edgeNodes: S.edgeNodes || [], tins: _t(S), kinks: Mt(S.kinks_points), yaxisMode: S.yaxisMode ?? "invert", strictMode: S.strictMode ?? "auto", vertexMode: S.vertexMode, bounds: S.bounds, boundsPolygon: S.boundsPolygon, wh: S.wh, xy: S.xy ?? [0, 0] };
      }
      function ut(S) {
        const v = Ht(S), A = v.tins;
        return { compiled: v, tins: A, points: le(A), strictStatus: v.strict_status, pointsWeightBuffer: v.weight_buffer, verticesParams: v.vertices_params, centroid: v.centroid, kinks: v.kinks };
      }
      function dt(S) {
        return !S.version || S.version < J ? ["forw", "bakw"].reduce((v, A) => {
          const N = S.weight_buffer[A];
          return N && (v[A] = Object.keys(N).reduce(($, V) => {
            const z = H(V);
            return $[z] = N[V], $;
          }, {})), v;
        }, {}) : S.weight_buffer;
      }
      function gt(S) {
        return S.strict_status ? S.strict_status : S.kinks_points ? "strict_error" : S.tins_points.length === 2 ? "loose" : "strict";
      }
      function mt(S) {
        const v = { forw: [S.vertices_params[0]], bakw: [S.vertices_params[1]] };
        return v.forw[1] = It(S, !1), v.bakw[1] = It(S, !0), v;
      }
      function It(S, v) {
        const A = S.vertices_points.length;
        return Array.from({ length: A }, (N, $) => {
          const V = ($ + 1) % A, z = Q(["c", `b${$}`, `b${V}`], S.points, S.edgeNodes || [], S.centroid_point, S.vertices_points, v, J);
          return o([z]);
        });
      }
      function Nt(S) {
        return { forw: r(S.centroid_point[0], { target: { geom: S.centroid_point[1], index: "c" } }), bakw: r(S.centroid_point[1], { target: { geom: S.centroid_point[0], index: "c" } }) };
      }
      function _t(S) {
        const v = S.tins_points.length === 1 ? 0 : 1;
        return { forw: o(S.tins_points[0].map((A) => Q(A, S.points, S.edgeNodes || [], S.centroid_point, S.vertices_points, !1, S.version))), bakw: o(S.tins_points[v].map((A) => Q(A, S.points, S.edgeNodes || [], S.centroid_point, S.vertices_points, !0, S.version))) };
      }
      function Mt(S) {
        if (S) return { bakw: o(S.map((v) => r(v))) };
      }
      function Ht(S) {
        return JSON.parse(JSON.stringify(S).replace('"cent"', '"c"').replace(/"bbox(\d+)"/g, '"b$1"'));
      }
      function le(S) {
        const v = [], A = S.forw.features;
        for (let N = 0; N < A.length; N++) {
          const $ = A[N];
          ["a", "b", "c"].forEach((V, z) => {
            const et = $.geometry.coordinates[0][z], Z = $.properties[V].geom, it = $.properties[V].index;
            typeof it == "number" && (v[it] = [et, Z]);
          });
        }
        return v;
      }
      const Qe = J;
      class Ft {
        static VERTEX_PLAIN = "plain";
        static VERTEX_BIRDEYE = "birdeye";
        static MODE_STRICT = "strict";
        static MODE_AUTO = "auto";
        static MODE_LOOSE = "loose";
        static STATUS_STRICT = "strict";
        static STATUS_ERROR = "strict_error";
        static STATUS_LOOSE = "loose";
        static YAXIS_FOLLOW = "follow";
        static YAXIS_INVERT = "invert";
        points = [];
        pointsWeightBuffer;
        strict_status;
        vertices_params;
        centroid;
        edgeNodes;
        edges;
        tins;
        kinks;
        yaxisMode = Ft.YAXIS_INVERT;
        strictMode = Ft.MODE_AUTO;
        vertexMode = Ft.VERTEX_PLAIN;
        bounds;
        boundsPolygon;
        wh;
        xy;
        indexedTins;
        stateFull = !1;
        stateTriangle;
        stateBackward;
        priority;
        importance;
        xyBounds;
        mercBounds;
        constructor() {
        }
        setCompiled(v) {
          if (lt(v)) {
            this.applyModernState(ht(v));
            return;
          }
          this.applyLegacyState(ut(v));
        }
        applyModernState(v) {
          this.points = v.points, this.pointsWeightBuffer = v.pointsWeightBuffer, this.strict_status = v.strictStatus, this.vertices_params = v.verticesParams, this.centroid = v.centroid, this.edges = v.edges, this.edgeNodes = v.edgeNodes || [], this.tins = v.tins, this.addIndexedTin(), this.kinks = v.kinks, this.yaxisMode = v.yaxisMode ?? Ft.YAXIS_INVERT, this.vertexMode = v.vertexMode ?? Ft.VERTEX_PLAIN, this.strictMode = v.strictMode ?? Ft.MODE_AUTO, v.bounds ? (this.bounds = v.bounds, this.boundsPolygon = v.boundsPolygon, this.xy = v.xy, this.wh = v.wh) : (this.bounds = void 0, this.boundsPolygon = void 0, this.xy = v.xy ?? [0, 0], v.wh && (this.wh = v.wh));
        }
        applyLegacyState(v) {
          this.tins = v.tins, this.addIndexedTin(), this.strict_status = v.strictStatus, this.pointsWeightBuffer = v.pointsWeightBuffer, this.vertices_params = v.verticesParams, this.centroid = v.centroid, this.kinks = v.kinks, this.points = v.points;
        }
        addIndexedTin() {
          const v = this.tins, A = v.forw, N = v.bakw, $ = Math.ceil(Math.sqrt(A.features.length));
          if ($ < 3) {
            this.indexedTins = void 0;
            return;
          }
          let V = [], z = [];
          const et = A.features.map((ot) => {
            let nt = [];
            return f(ot)[0].map((W) => {
              V.length === 0 ? V = [Array.from(W), Array.from(W)] : (W[0] < V[0][0] && (V[0][0] = W[0]), W[0] > V[1][0] && (V[1][0] = W[0]), W[1] < V[0][1] && (V[0][1] = W[1]), W[1] > V[1][1] && (V[1][1] = W[1])), nt.length === 0 ? nt = [Array.from(W), Array.from(W)] : (W[0] < nt[0][0] && (nt[0][0] = W[0]), W[0] > nt[1][0] && (nt[1][0] = W[0]), W[1] < nt[0][1] && (nt[0][1] = W[1]), W[1] > nt[1][1] && (nt[1][1] = W[1]));
            }), nt;
          }), Z = (V[1][0] - V[0][0]) / $, it = (V[1][1] - V[0][1]) / $, at = et.reduce((ot, nt, W) => {
            const yt = B(nt[0][0], V[0][0], Z, $), At = B(nt[1][0], V[0][0], Z, $), St = B(nt[0][1], V[0][1], it, $), Ot = B(nt[1][1], V[0][1], it, $);
            for (let xt = yt; xt <= At; xt++) {
              ot[xt] || (ot[xt] = []);
              for (let Bt = St; Bt <= Ot; Bt++) ot[xt][Bt] || (ot[xt][Bt] = []), ot[xt][Bt].push(W);
            }
            return ot;
          }, []), K = N.features.map((ot) => {
            let nt = [];
            return f(ot)[0].map((W) => {
              z.length === 0 ? z = [Array.from(W), Array.from(W)] : (W[0] < z[0][0] && (z[0][0] = W[0]), W[0] > z[1][0] && (z[1][0] = W[0]), W[1] < z[0][1] && (z[0][1] = W[1]), W[1] > z[1][1] && (z[1][1] = W[1])), nt.length === 0 ? nt = [Array.from(W), Array.from(W)] : (W[0] < nt[0][0] && (nt[0][0] = W[0]), W[0] > nt[1][0] && (nt[1][0] = W[0]), W[1] < nt[0][1] && (nt[0][1] = W[1]), W[1] > nt[1][1] && (nt[1][1] = W[1]));
            }), nt;
          }), tt = (z[1][0] - z[0][0]) / $, ft = (z[1][1] - z[0][1]) / $, wt = K.reduce((ot, nt, W) => {
            const yt = B(nt[0][0], z[0][0], tt, $), At = B(nt[1][0], z[0][0], tt, $), St = B(nt[0][1], z[0][1], ft, $), Ot = B(nt[1][1], z[0][1], ft, $);
            for (let xt = yt; xt <= At; xt++) {
              ot[xt] || (ot[xt] = []);
              for (let Bt = St; Bt <= Ot; Bt++) ot[xt][Bt] || (ot[xt][Bt] = []), ot[xt][Bt].push(W);
            }
            return ot;
          }, []);
          this.indexedTins = { forw: { gridNum: $, xOrigin: V[0][0], yOrigin: V[0][1], xUnit: Z, yUnit: it, gridCache: at }, bakw: { gridNum: $, xOrigin: z[0][0], yOrigin: z[0][1], xUnit: tt, yUnit: ft, gridCache: wt } };
        }
        transform(v, A, N) {
          if (!this.tins) throw new Error("setCompiled() must be called before transform()");
          if (A && this.strict_status == Ft.STATUS_ERROR) throw new Error('Backward transform is not allowed if strict_status == "strict_error"');
          this.yaxisMode == Ft.YAXIS_FOLLOW && A && (v = [v[0], -1 * v[1]]);
          const $ = r(v);
          if (this.bounds && !A && !N && !R($, this.boundsPolygon)) return !1;
          const V = A ? this.tins.bakw : this.tins.forw, z = A ? this.indexedTins.bakw : this.indexedTins.forw, et = A ? this.vertices_params.bakw : this.vertices_params.forw, Z = A ? this.centroid.bakw : this.centroid.forw, it = A ? this.pointsWeightBuffer.bakw : this.pointsWeightBuffer.forw;
          let at, K;
          this.stateFull && (this.stateBackward == A ? at = this.stateTriangle : (this.stateBackward = A, this.stateTriangle = void 0), K = (ft) => {
            this.stateTriangle = ft;
          });
          let tt = X($, V, z, et, Z, it, at, K);
          if (this.bounds && A && !N) {
            const ft = r(tt);
            if (!R(ft, this.boundsPolygon)) return !1;
          } else this.yaxisMode == Ft.YAXIS_FOLLOW && !A && (tt = [tt[0], -1 * tt[1]]);
          return tt;
        }
      }
      const qt = 20037508342789244e-9, Ne = [[0, 0], [0, 1], [1, 0], [0, -1], [-1, 0]];
      function ye(S, v) {
        return Math.floor(Math.min(S[0], S[1]) / 4) * qt / 128 / Math.pow(2, v);
      }
      function _e(S, v) {
        const A = [];
        for (let N = 0; N < S.length; N++) {
          const $ = S[N], V = $[0] * Math.cos(v) - $[1] * Math.sin(v), z = $[0] * Math.sin(v) + $[1] * Math.cos(v);
          A.push([V, z]);
        }
        return A;
      }
      function ue(S, v, A, N) {
        const $ = ye(N, v);
        return _e(Ne, A).map((V) => [V[0] * $ + S[0], V[1] * $ + S[1]]);
      }
      function He(S, v) {
        const A = S[0], N = S.slice(1, 5).map((tt) => [tt[0] - A[0], tt[1] - A[1]]), $ = [[0, 1], [1, 0], [0, -1], [-1, 0]];
        let V = 0, z = 0, et = 0;
        for (let tt = 0; tt < 4; tt++) {
          const ft = N[tt], wt = $[tt], ot = Math.sqrt(Math.pow(ft[0], 2) + Math.pow(ft[1], 2));
          V += ot;
          const nt = ft[0] * wt[1] - ft[1] * wt[0], W = Math.acos((ft[0] * wt[0] + ft[1] * wt[1]) / ot), yt = nt > 0 ? -1 * W : W;
          z += Math.cos(yt), et += Math.sin(yt);
        }
        const Z = V / 4, it = Math.atan2(et, z), at = Math.floor(Math.min(v[0], v[1]) / 4), K = Math.log(at * qt / 128 / Z) / Math.log(2);
        return { center: A, zoom: K, rotation: it };
      }
      function Xe(S, v) {
        const A = S[0] * (2 * qt) / v - qt, N = -1 * (S[1] * (2 * qt) / v - qt);
        return [A, N];
      }
      function Ze(S, v) {
        const A = (S[0] + qt) * v / (2 * qt), N = (-S[1] + qt) * v / (2 * qt);
        return [A, N];
      }
      const tn = 256;
      class nr {
        mainTin = null;
        subTins = [];
        _maxxy = 0;
        setMapData(v) {
          const A = new Ft();
          if (A.setCompiled(v.compiled), this.mainTin = A, v.maxZoom !== void 0) this._maxxy = Math.pow(2, v.maxZoom) * tn;
          else if (v.compiled.wh) {
            const N = Math.max(v.compiled.wh[0], v.compiled.wh[1]), $ = Math.ceil(Math.log2(N / tn));
            this._maxxy = Math.pow(2, $) * tn;
          }
          if (this.subTins = [], v.sub_maps) for (const N of v.sub_maps) {
            const $ = new Ft();
            $.setCompiled(N.compiled);
            const V = N.bounds ?? N.compiled.bounds;
            if (!V) throw new Error("SubMapData must have bounds or compiled.bounds to create xyBounds polygon");
            const z = [...V, V[0]], et = z.map((Z) => {
              const it = $.transform(Z, !1);
              if (!it) throw new Error("Failed to transform sub-map bounds to mercator");
              return it;
            });
            this.subTins.push({ tin: $, priority: N.priority, importance: N.importance, xyBounds: i([z]), mercBounds: i([et]) });
          }
        }
        xy2Merc(v) {
          const A = this.xy2MercWithLayer(v);
          return A ? A[1] : !1;
        }
        merc2Xy(v) {
          const A = this.merc2XyWithLayer(v), N = A[0] || A[1];
          return N ? N[1] : !1;
        }
        xy2MercWithLayer(v) {
          this._assertMapData();
          const A = this._getTinsSortedByPriority();
          for (let N = 0; N < A.length; N++) {
            const { index: $, isMain: V } = A[N];
            if (V || R(r(v), this.subTins[$ - 1].xyBounds)) {
              const z = this._transformByIndex(v, $, !1);
              if (z === !1) continue;
              return [$, z];
            }
          }
          return !1;
        }
        merc2XyWithLayer(v) {
          return this._assertMapData(), this._getAllTinsWithIndex().map(({ index: A, tin: N, isMain: $ }) => {
            const V = this._transformByIndex(v, A, !0);
            return V === !1 ? [N, A] : $ || R(r(V), this.subTins[A - 1].xyBounds) ? [N, A, V] : [N, A];
          }).sort((A, N) => {
            const $ = A[0].priority ?? 0, V = N[0].priority ?? 0;
            return $ < V ? 1 : -1;
          }).reduce((A, N, $, V) => {
            const z = N[0], et = N[1], Z = N[2];
            if (!Z) return A;
            for (let it = 0; it < $; it++) {
              const at = V[it][1], K = at === 0;
              if (V[it][2] && (K || R(r(Z), this.subTins[at - 1].xyBounds))) if (A.length) {
                const tt = !A[0], ft = tt ? A[1][2] : A[0][2], wt = z.importance ?? 0, ot = ft.importance ?? 0;
                return tt ? wt < ot ? A : [void 0, [et, Z, z]] : [...A.filter((nt) => nt !== void 0), [et, Z, z]].sort((nt, W) => (nt[2].importance ?? 0) < (W[2].importance ?? 0) ? 1 : -1).slice(0, 2);
              } else return [[et, Z, z]];
            }
            return !A.length || !A[0] ? [[et, Z, z]] : (A.push([et, Z, z]), A.sort((it, at) => {
              const K = it[2].importance ?? 0, tt = at[2].importance ?? 0;
              return K < tt ? 1 : -1;
            }).filter((it, at) => at < 2));
          }, []).map((A) => {
            if (A) return [A[0], A[1]];
          });
        }
        mercs2SysCoords(v) {
          this._assertMapData();
          const A = this.merc2XyWithLayer(v[0]);
          let N = !1;
          return A.map(($, V) => {
            if (!$) {
              N = !0;
              return;
            }
            const z = $[0], et = $[1];
            return V !== 0 && !N ? [this.xy2SysCoordInternal(et)] : v.map((Z, it) => it === 0 ? et : this._transformByIndex(Z, z, !0)).map((Z) => this.xy2SysCoordInternal(Z));
          });
        }
        viewpoint2Mercs(v, A) {
          this._assertMapData(), this._assertMaxxy();
          const N = ue(v.center, v.zoom, v.rotation, A).map((et) => Ze(et, this._maxxy)), $ = this.xy2MercWithLayer(N[0]);
          if (!$) throw new Error("viewpoint2Mercs: center point is out of bounds");
          const V = $[0], z = $[1];
          return N.map((et, Z) => {
            if (Z === 0) return z;
            const it = this._transformByIndex(et, V, !1);
            if (it === !1) throw new Error(`viewpoint2Mercs: point ${Z} is out of bounds`);
            return it;
          });
        }
        mercs2Viewpoint(v, A) {
          this._assertMapData(), this._assertMaxxy();
          const N = this.merc2XyWithLayer(v[0]), $ = N[0] || N[1];
          if (!$) throw new Error("mercs2Viewpoint: center point is out of bounds");
          const V = $[0], z = $[1], et = v.map((Z, it) => {
            if (it === 0) return z;
            const at = this._transformByIndex(Z, V, !0);
            if (at === !1) throw new Error(`mercs2Viewpoint: point ${it} is out of bounds`);
            return at;
          }).map((Z) => Xe(Z, this._maxxy));
          return He(et, A);
        }
        static zoom2Radius(v, A) {
          return ye(v, A);
        }
        static mercViewpoint2Mercs(v, A, N, $) {
          return ue(v, A, N, $);
        }
        static mercs2MercViewpoint(v, A) {
          return He(v, A);
        }
        static xy2SysCoord(v, A) {
          return Xe(v, A);
        }
        static sysCoord2Xy(v, A) {
          return Ze(v, A);
        }
        _assertMapData() {
          if (!this.mainTin) throw new Error("setMapData() must be called before transformation");
        }
        _assertMaxxy() {
          if (this._maxxy === 0) throw new Error("MapData.maxZoom or compiled.wh must be set for viewpoint conversion (xy2SysCoord / sysCoord2Xy)");
        }
        getLayerTransform(v) {
          if (v === 0) return this.mainTin;
          const A = this.subTins[v - 1];
          return A ? A.tin : null;
        }
        get layerCount() {
          return 1 + this.subTins.length;
        }
        get maxxy() {
          return this._maxxy;
        }
        _getTinsSortedByPriority() {
          return this._getAllTinsWithIndex().sort((v, A) => {
            const N = v.tin.priority ?? 0, $ = A.tin.priority ?? 0;
            return N < $ ? 1 : -1;
          });
        }
        _getAllTinsWithIndex() {
          const v = [{ index: 0, tin: this.mainTin, isMain: !0 }];
          return this.subTins.forEach((A, N) => {
            A.tin.priority = A.priority, A.tin.importance = A.importance, v.push({ index: N + 1, tin: A.tin, isMain: !1 });
          }), v;
        }
        _transformByIndex(v, A, N) {
          if (A === 0) return this.mainTin.transform(v, N);
          const $ = this.subTins[A - 1];
          return $ ? $.tin.transform(v, N, !0) : !1;
        }
        xy2SysCoordInternal(v) {
          return Xe(v, this._maxxy);
        }
      }
      e.MERC_CROSSMATRIX = Ne, e.MERC_MAX = qt, e.MapTransform = nr, e.Transform = Ft, e.counterTri = j, e.format_version = Qe, e.mercViewpoint2Mercs = ue, e.mercs2MercViewpoint = He, e.normalizeEdges = rt, e.rotateMatrix = _e, e.rotateVerticesTriangle = D, e.sysCoord2Xy = Ze, e.transformArr = X, e.xy2SysCoord = Xe, e.zoom2Radius = ye, Object.defineProperty(e, Symbol.toStringTag, { value: "Module" });
    }));
  })(Ae, Ae.exports)), Ae.exports;
}
var Ut = zr();
const Nn = Math.pow(2, -52), Ve = new Uint32Array(512);
class mn {
  static from(t, e = Qr, n = Hr) {
    const r = t.length, i = new Float64Array(r * 2);
    for (let o = 0; o < r; o++) {
      const a = t[o];
      i[2 * o] = e(a), i[2 * o + 1] = n(a);
    }
    return new mn(i);
  }
  constructor(t) {
    const e = t.length >> 1;
    if (e > 0 && typeof t[0] != "number") throw new Error("Expected coords to contain numbers.");
    this.coords = t;
    const n = Math.max(2 * e - 5, 0);
    this._triangles = new Uint32Array(n * 3), this._halfedges = new Int32Array(n * 3), this._hashSize = Math.ceil(Math.sqrt(e)), this._hullPrev = new Uint32Array(e), this._hullNext = new Uint32Array(e), this._hullTri = new Uint32Array(e), this._hullHash = new Int32Array(this._hashSize), this._ids = new Uint32Array(e), this._dists = new Float64Array(e), this.update();
  }
  update() {
    const { coords: t, _hullPrev: e, _hullNext: n, _hullTri: r, _hullHash: i } = this, o = t.length >> 1;
    let a = 1 / 0, c = 1 / 0, f = -1 / 0, l = -1 / 0;
    for (let I = 0; I < o; I++) {
      const P = t[2 * I], C = t[2 * I + 1];
      P < a && (a = P), C < c && (c = C), P > f && (f = P), C > l && (l = C), this._ids[I] = I;
    }
    const h = (a + f) / 2, d = (c + l) / 2;
    let b, k, E;
    for (let I = 0, P = 1 / 0; I < o; I++) {
      const C = un(h, d, t[2 * I], t[2 * I + 1]);
      C < P && (b = I, P = C);
    }
    const F = t[2 * b], L = t[2 * b + 1];
    for (let I = 0, P = 1 / 0; I < o; I++) {
      if (I === b) continue;
      const C = un(F, L, t[2 * I], t[2 * I + 1]);
      C < P && C > 0 && (k = I, P = C);
    }
    let g = t[2 * k], x = t[2 * k + 1], u = 1 / 0;
    for (let I = 0; I < o; I++) {
      if (I === b || I === k) continue;
      const P = Jr(F, L, g, x, t[2 * I], t[2 * I + 1]);
      P < u && (E = I, u = P);
    }
    let w = t[2 * E], m = t[2 * E + 1];
    if (u === 1 / 0) {
      for (let C = 0; C < o; C++)
        this._dists[C] = t[2 * C] - t[0] || t[2 * C + 1] - t[1];
      be(this._ids, this._dists, 0, o - 1);
      const I = new Uint32Array(o);
      let P = 0;
      for (let C = 0, R = -1 / 0; C < o; C++) {
        const G = this._ids[C], p = this._dists[G];
        p > R && (I[P++] = G, R = p);
      }
      this.hull = I.subarray(0, P), this.triangles = new Uint32Array(0), this.halfedges = new Uint32Array(0);
      return;
    }
    if (ne(F, L, g, x, w, m) < 0) {
      const I = k, P = g, C = x;
      k = E, g = w, x = m, E = I, w = P, m = C;
    }
    const T = Kr(F, L, g, x, w, m);
    this._cx = T.x, this._cy = T.y;
    for (let I = 0; I < o; I++)
      this._dists[I] = un(t[2 * I], t[2 * I + 1], T.x, T.y);
    be(this._ids, this._dists, 0, o - 1), this._hullStart = b;
    let O = 3;
    n[b] = e[E] = k, n[k] = e[b] = E, n[E] = e[k] = b, r[b] = 0, r[k] = 1, r[E] = 2, i.fill(-1), i[this._hashKey(F, L)] = b, i[this._hashKey(g, x)] = k, i[this._hashKey(w, m)] = E, this.trianglesLen = 0, this._addTriangle(b, k, E, -1, -1, -1);
    for (let I = 0, P, C; I < this._ids.length; I++) {
      const R = this._ids[I], G = t[2 * R], p = t[2 * R + 1];
      if (I > 0 && Math.abs(G - P) <= Nn && Math.abs(p - C) <= Nn || (P = G, C = p, R === b || R === k || R === E)) continue;
      let M = 0;
      for (let y = 0, D = this._hashKey(G, p); y < this._hashSize && (M = i[(D + y) % this._hashSize], !(M !== -1 && M !== n[M])); y++)
        ;
      M = e[M];
      let _ = M, X;
      for (; X = n[_], ne(G, p, t[2 * _], t[2 * _ + 1], t[2 * X], t[2 * X + 1]) >= 0; )
        if (_ = X, _ === M) {
          _ = -1;
          break;
        }
      if (_ === -1) continue;
      let B = this._addTriangle(_, R, n[_], -1, -1, r[_]);
      r[R] = this._legalize(B + 2), r[_] = B, O++;
      let Y = n[_];
      for (; X = n[Y], ne(G, p, t[2 * Y], t[2 * Y + 1], t[2 * X], t[2 * X + 1]) < 0; )
        B = this._addTriangle(Y, R, X, r[R], -1, r[Y]), r[R] = this._legalize(B + 2), n[Y] = Y, O--, Y = X;
      if (_ === M)
        for (; X = e[_], ne(G, p, t[2 * X], t[2 * X + 1], t[2 * _], t[2 * _ + 1]) < 0; )
          B = this._addTriangle(X, R, _, -1, r[_], r[X]), this._legalize(B + 2), r[X] = B, n[_] = _, O--, _ = X;
      this._hullStart = e[R] = _, n[_] = e[Y] = R, n[R] = Y, i[this._hashKey(G, p)] = R, i[this._hashKey(t[2 * _], t[2 * _ + 1])] = _;
    }
    this.hull = new Uint32Array(O);
    for (let I = 0, P = this._hullStart; I < O; I++)
      this.hull[I] = P, P = n[P];
    this.triangles = this._triangles.subarray(0, this.trianglesLen), this.halfedges = this._halfedges.subarray(0, this.trianglesLen);
  }
  _hashKey(t, e) {
    return Math.floor(Wr(t - this._cx, e - this._cy) * this._hashSize) % this._hashSize;
  }
  _legalize(t) {
    const { _triangles: e, _halfedges: n, coords: r } = this;
    let i = 0, o = 0;
    for (; ; ) {
      const a = n[t], c = t - t % 3;
      if (o = c + (t + 2) % 3, a === -1) {
        if (i === 0) break;
        t = Ve[--i];
        continue;
      }
      const f = a - a % 3, l = c + (t + 1) % 3, h = f + (a + 2) % 3, d = e[o], b = e[t], k = e[l], E = e[h];
      if (Gr(
        r[2 * d],
        r[2 * d + 1],
        r[2 * b],
        r[2 * b + 1],
        r[2 * k],
        r[2 * k + 1],
        r[2 * E],
        r[2 * E + 1]
      )) {
        e[t] = E, e[a] = d;
        const L = n[h];
        if (L === -1) {
          let x = this._hullStart;
          do {
            if (this._hullTri[x] === h) {
              this._hullTri[x] = t;
              break;
            }
            x = this._hullPrev[x];
          } while (x !== this._hullStart);
        }
        this._link(t, L), this._link(a, n[o]), this._link(o, h);
        const g = f + (a + 1) % 3;
        i < Ve.length && (Ve[i++] = g);
      } else {
        if (i === 0) break;
        t = Ve[--i];
      }
    }
    return o;
  }
  _link(t, e) {
    this._halfedges[t] = e, e !== -1 && (this._halfedges[e] = t);
  }
  // add a new triangle given vertex indices and adjacent half-edge ids
  _addTriangle(t, e, n, r, i, o) {
    const a = this.trianglesLen;
    return this._triangles[a] = t, this._triangles[a + 1] = e, this._triangles[a + 2] = n, this._link(a, r), this._link(a + 1, i), this._link(a + 2, o), this.trianglesLen += 3, a;
  }
}
function Wr(s, t) {
  const e = s / (Math.abs(s) + Math.abs(t));
  return (t > 0 ? 3 - e : 1 + e) / 4;
}
function un(s, t, e, n) {
  const r = s - e, i = t - n;
  return r * r + i * i;
}
function Gr(s, t, e, n, r, i, o, a) {
  const c = s - o, f = t - a, l = e - o, h = n - a, d = r - o, b = i - a, k = c * c + f * f, E = l * l + h * h, F = d * d + b * b;
  return c * (h * F - E * b) - f * (l * F - E * d) + k * (l * b - h * d) < 0;
}
function Jr(s, t, e, n, r, i) {
  const o = e - s, a = n - t, c = r - s, f = i - t, l = o * o + a * a, h = c * c + f * f, d = 0.5 / (o * f - a * c), b = (f * l - a * h) * d, k = (o * h - c * l) * d;
  return b * b + k * k;
}
function Kr(s, t, e, n, r, i) {
  const o = e - s, a = n - t, c = r - s, f = i - t, l = o * o + a * a, h = c * c + f * f, d = 0.5 / (o * f - a * c), b = s + (f * l - a * h) * d, k = t + (o * h - c * l) * d;
  return { x: b, y: k };
}
function be(s, t, e, n) {
  if (n - e <= 20)
    for (let r = e + 1; r <= n; r++) {
      const i = s[r], o = t[i];
      let a = r - 1;
      for (; a >= e && t[s[a]] > o; ) s[a + 1] = s[a--];
      s[a + 1] = i;
    }
  else {
    const r = e + n >> 1;
    let i = e + 1, o = n;
    ke(s, r, i), t[s[e]] > t[s[n]] && ke(s, e, n), t[s[i]] > t[s[n]] && ke(s, i, n), t[s[e]] > t[s[i]] && ke(s, e, i);
    const a = s[i], c = t[a];
    for (; ; ) {
      do
        i++;
      while (t[s[i]] < c);
      do
        o--;
      while (t[s[o]] > c);
      if (o < i) break;
      ke(s, i, o);
    }
    s[e + 1] = s[o], s[o] = a, n - i + 1 >= o - e ? (be(s, t, i, n), be(s, t, e, o - 1)) : (be(s, t, e, o - 1), be(s, t, i, n));
  }
}
function ke(s, t, e) {
  const n = s[t];
  s[t] = s[e], s[e] = n;
}
function Qr(s) {
  return s[0];
}
function Hr(s) {
  return s[1];
}
class Zr {
  bs;
  width;
  constructor(t, e) {
    this.width = t, this.bs = e;
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
    const n = Math.floor(t / this.width), i = 1 << t % this.width;
    return this.bs[n] ^= (-Number(e) ^ this.bs[n]) & i, e;
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
class Xn extends Zr {
  constructor(t) {
    super(8, new Uint8Array(Math.ceil(t / 8)).fill(0));
  }
}
function we(s) {
  return s % 3 === 2 ? s - 2 : s + 1;
}
function re(s) {
  return s % 3 === 0 ? s + 2 : s - 1;
}
function Dn(s, t, e, n, r, i, o, a) {
  const c = ne(s, t, r, i, o, a), f = ne(e, n, r, i, o, a);
  if (c > 0 && f > 0 || c < 0 && f < 0)
    return !1;
  const l = ne(r, i, s, t, e, n), h = ne(o, a, s, t, e, n);
  return l > 0 && h > 0 || l < 0 && h < 0 ? !1 : c === 0 && f === 0 && l === 0 && h === 0 ? !(Math.max(r, o) < Math.min(s, e) || Math.max(s, e) < Math.min(r, o) || Math.max(i, a) < Math.min(t, n) || Math.max(t, n) < Math.min(i, a)) : !0;
}
class ti {
  /**
   * The triangulation object from Delaunator.
   */
  del;
  constructor(t) {
    this.del = t;
  }
}
class ei extends ti {
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
    const n = 2 ** 32 - 1, r = t.coords.length >> 1, i = t.triangles.length;
    this.vertMap = new Uint32Array(r).fill(n), this.flips = new Xn(i), this.consd = new Xn(i);
    for (let o = 0; o < i; o++) {
      const a = t.triangles[o];
      this.vertMap[a] === n && this.updateVert(o);
    }
    e && this.constrainAll(e);
  }
  /**
   * Constrain the triangulation such that there is an edge between p1 and p2.
   */
  constrainOne(t, e) {
    const { triangles: n, halfedges: r } = this.del, i = this.vertMap[t];
    let o = i;
    do {
      const f = n[o], l = we(o);
      if (f === e)
        return this.protect(o);
      const h = re(o), d = n[h];
      if (d === e)
        return this.protect(l), l;
      if (this.intersectSegments(t, e, d, f)) {
        o = h;
        break;
      }
      o = r[l];
    } while (o !== -1 && o !== i);
    let a = o, c = -1;
    for (; o !== -1; ) {
      const f = r[o], l = re(o), h = re(f), d = we(f);
      if (f === -1)
        throw new Error("Constraining edge exited the hull");
      if (this.consd.has(o))
        throw new Error("Edge intersects already constrained edge");
      if (this.isCollinear(t, e, n[o]) || this.isCollinear(t, e, n[f]))
        throw new Error("Constraining edge intersects point");
      if (!this.intersectSegments(
        n[o],
        n[f],
        n[l],
        n[h]
      )) {
        if (c === -1 && (c = o), n[h] === e) {
          if (o === c)
            throw new Error("Infinite loop: non-convex quadrilateral");
          o = c, c = -1;
          continue;
        }
        if (this.intersectSegments(
          t,
          e,
          n[h],
          n[f]
        ))
          o = h;
        else if (this.intersectSegments(
          t,
          e,
          n[d],
          n[h]
        ))
          o = d;
        else if (c === o)
          throw new Error("Infinite loop: no further intersect after non-convex");
        continue;
      }
      if (this.flipDiagonal(o), this.intersectSegments(
        t,
        e,
        n[l],
        n[h]
      ) && (c === -1 && (c = l), c === l))
        throw new Error("Infinite loop: flipped diagonal still intersects");
      n[h] === e ? (a = h, o = c, c = -1) : this.intersectSegments(
        t,
        e,
        n[d],
        n[h]
      ) && (o = d);
    }
    return this.protect(a), this.delaunify(!0), this.findEdge(t, e);
  }
  /**
   * Fix the Delaunay condition.
   */
  delaunify(t = !1) {
    const { halfedges: e } = this.del, n = this.flips, r = this.consd, i = e.length;
    let o;
    do {
      o = 0;
      for (let a = 0; a < i; a++) {
        if (r.has(a))
          continue;
        n.delete(a);
        const c = e[a];
        c !== -1 && (n.delete(c), this.isDelaunay(a) || (this.flipDiagonal(a), o++));
      }
    } while (t && o > 0);
    return this;
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
    const n = this.vertMap[e], { triangles: r, halfedges: i } = this.del;
    let o = n, a = -1;
    do {
      if (r[o] === t)
        return o;
      a = we(o), o = i[a];
    } while (o !== -1 && o !== n);
    return r[we(a)] === t ? -a : 1 / 0;
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
    const i = e[t];
    return i !== -1 && (n.add(t), n.add(i)), !0;
  }
  /**
   * Flip the edge shared by two triangles.
   */
  flipDiagonal(t) {
    const { triangles: e, halfedges: n } = this.del, r = this.flips, i = this.consd, o = n[t], a = re(t), c = we(t), f = re(o), l = we(o), h = n[a], d = n[f];
    if (i.has(t))
      throw new Error("Trying to flip a constrained edge");
    return e[t] = e[f], n[t] = d, r.set(t, r.has(f)) || i.set(t, i.has(f)), d !== -1 && (n[d] = t), n[a] = f, e[o] = e[a], n[o] = h, r.set(o, r.has(a)) || i.set(o, i.has(a)), h !== -1 && (n[h] = o), n[f] = a, this.markFlip(t), this.markFlip(c), this.markFlip(o), this.markFlip(l), r.add(a), i.delete(a), r.add(f), i.delete(f), this.updateVert(t), this.updateVert(c), this.updateVert(o), this.updateVert(l), a;
  }
  /**
   * Whether point p1, p2, and p are collinear.
   */
  isCollinear(t, e, n) {
    const r = this.del.coords;
    return ne(
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
    const i = this.del.coords;
    return gr(
      i[t * 2],
      i[t * 2 + 1],
      i[e * 2],
      i[e * 2 + 1],
      i[n * 2],
      i[n * 2 + 1],
      i[r * 2],
      i[r * 2 + 1]
    ) < 0;
  }
  /**
   * Whether the triangles sharing edg conform to the Delaunay condition.
   */
  isDelaunay(t) {
    const { triangles: e, halfedges: n } = this.del, r = n[t];
    if (r === -1)
      return !0;
    const i = e[re(t)], o = e[t], a = e[we(t)], c = e[re(r)];
    return !this.inCircle(i, o, a, c);
  }
  /**
   * Update the vertex -> incoming edge map.
   */
  updateVert(t) {
    const { triangles: e, halfedges: n } = this.del, r = this.vertMap, i = e[t];
    let o = re(t), a = n[o];
    for (; a !== -1 && a !== t; )
      o = re(a), a = n[o];
    return r[i] = o, o;
  }
  /**
   * Whether the segments between vertices intersect.
   */
  intersectSegments(t, e, n, r) {
    const i = this.del.coords;
    return t === n || t === r || e === n || e === r ? !1 : Dn(
      i[t * 2],
      i[t * 2 + 1],
      i[e * 2],
      i[e * 2 + 1],
      i[n * 2],
      i[n * 2 + 1],
      i[r * 2],
      i[r * 2 + 1]
    );
  }
  static intersectSegments = Dn;
}
function je(s, t, e) {
  if (t || (t = []), typeof s != "object" || s.type !== "FeatureCollection")
    throw "Argument points must be FeatureCollection";
  if (!Array.isArray(t)) throw "Argument points must be Array of Array";
  const n = s.features.map(
    (c) => c.geometry.coordinates
  ), r = mn.from(n);
  let i;
  const o = [];
  r.triangles.length !== 0 && t.length !== 0 && (i = new ei(r), i.constrainAll(t));
  for (let c = 0; c < r.triangles.length; c += 3)
    o.push([r.triangles[c], r.triangles[c + 1], r.triangles[c + 2]]);
  const a = ["a", "b", "c"];
  return Qt(
    o.map((c) => {
      const f = {}, l = c.map((h, d) => {
        const b = s.features[h], k = b.geometry.coordinates, E = [k[0], k[1]];
        return k.length === 3 ? E[2] = k[2] : f[a[d]] = b.properties[e], E;
      });
      return l[3] = l[0], Oe([l], f);
    })
  );
}
function ni(s, t) {
  const e = [[], [], [], []], n = [];
  return Object.keys(s).forEach((r) => {
    const i = s[r], o = i.forw, a = i.bakw, c = [
      o[0] - t.forw[0],
      o[1] - t.forw[1]
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
function ri(s) {
  let t = 1 / 0, e = 0, n = 0;
  return s.forEach((r) => {
    const { forw: i, bakw: o } = r, a = Math.hypot(i[0], i[1]), c = Math.hypot(o[0], o[1]);
    if (c === 0) return;
    const f = a / c, l = Math.atan2(i[0], i[1]) - Math.atan2(o[0], o[1]);
    t = Math.min(t, f), e += Math.cos(l), n += Math.sin(l);
  }), isFinite(t) ? [t, Math.atan2(n, e)] : [1, 0];
}
function ii(s, t, e) {
  const { perQuad: n, aggregate: r } = ni(s, t), i = n.every((c) => c.length > 0), a = (e === "birdeye" ? i ? n : [r] : [r]).map((c) => ri(c));
  return a.length === 1 ? [a[0], a[0], a[0], a[0]] : a;
}
function oi(s, t) {
  let e = 0;
  return s[0] > t[0] && (e += 1), s[1] > t[1] && (e += 2), e;
}
function si(s, t, e) {
  const n = [
    s[0] - t.forw[0],
    s[1] - t.forw[1]
  ], i = Math.sqrt(n[0] ** 2 + n[1] ** 2) / e[0], o = Math.atan2(n[0], n[1]) - e[1];
  return [
    t.bakw[0] + i * Math.sin(o),
    t.bakw[1] - i * Math.cos(o)
  ];
}
function ai(s, t, e, n) {
  const r = t[0] - s[0], i = t[1] - s[1];
  if (Math.abs(r) < 1e-12 && Math.abs(i) < 1e-12) return null;
  const o = n[0] - e[0], a = n[1] - e[1], c = e[0] - s[0], f = e[1] - s[1], l = r * a - i * o;
  if (Math.abs(l) < 1e-12) return null;
  const h = (c * a - f * o) / l, d = (c * i - f * r) / l;
  return h <= 1e-10 || d < -1e-10 || d > 1 + 1e-10 ? null : { t: h, point: [s[0] + h * r, s[1] + h * i] };
}
function ci(s, t, e) {
  const n = e.length;
  let r = -1 / 0, i = null;
  for (let o = 0; o < n; o++) {
    const a = (o + 1) % n, c = ai(
      s,
      t,
      e[o].bakw,
      e[a].bakw
    );
    c && c.t > r && (r = c.t, i = c.point);
  }
  return i;
}
function Cn(s, t) {
  const n = Math.atan2(s[0] - t[0], s[1] - t[1]) * (180 / Math.PI);
  return n < 0 ? n + 360 : n;
}
function Rn(s, t, e, n, r, i) {
  const o = t[0] - s[0], a = t[1] - s[1];
  if (o === 0 && a === 0) return null;
  const c = [];
  if (o !== 0)
    for (const l of [e, n]) {
      const h = (l - s[0]) / o;
      if (h > 0) {
        const d = s[1] + h * a;
        d >= r && d <= i && c.push({ t: h, x: l, y: d });
      }
    }
  if (a !== 0)
    for (const l of [r, i]) {
      const h = (l - s[1]) / a;
      if (h > 0) {
        const d = s[0] + h * o;
        d >= e && d <= n && c.push({ t: h, x: d, y: l });
      }
    }
  if (c.length === 0) return null;
  c.sort((l, h) => l.t - h.t);
  const f = c[0];
  return [f.x, f.y];
}
function Fn(s, t, e) {
  const n = s.length, r = new Array(n).fill(1);
  for (const i of t)
    for (let o = 0; o < n; o++) {
      const a = (o + 1) % n, c = yn([s[o].bakw, s[a].bakw]), f = yn([e.bakw, i.bakw]), l = Ar(c, f);
      if (l.features.length > 0 && l.features[0].geometry) {
        const h = l.features[0], d = Math.sqrt(
          Math.pow(i.bakw[0] - e.bakw[0], 2) + Math.pow(i.bakw[1] - e.bakw[1], 2)
        ), b = Math.sqrt(
          Math.pow(h.geometry.coordinates[0] - e.bakw[0], 2) + Math.pow(h.geometry.coordinates[1] - e.bakw[1], 2)
        ), k = d / b;
        k > r[o] && (r[o] = k), k > r[a] && (r[a] = k);
      }
    }
  s.forEach((i, o) => {
    const a = r[o];
    i.bakw = [
      (i.bakw[0] - e.bakw[0]) * a + e.bakw[0],
      (i.bakw[1] - e.bakw[1]) * a + e.bakw[1]
    ];
  });
}
function Qn(s, t, e) {
  const { convexBuf: n, centroid: r, allGcps: i, minx: o, maxx: a, miny: c, maxy: f } = s, l = ii(n, r, t), d = [
    [o, c],
    [a, c],
    [a, f],
    [o, f]
  ].map((m) => ({
    forw: m,
    bakw: si(
      m,
      r,
      l[oi(m, r.forw)]
    )
  }));
  if (d.sort(
    (m, T) => Math.atan2(m.forw[0] - r.forw[0], m.forw[1] - r.forw[1]) - Math.atan2(T.forw[0] - r.forw[0], T.forw[1] - r.forw[1])
  ), Fn(d, i, r), !e) return d;
  const b = 4, k = d.map(
    (m) => Math.atan2(m.forw[0] - r.forw[0], m.forw[1] - r.forw[1])
  ), E = d.map(
    (m) => Math.atan2(
      m.bakw[0] - r.bakw[0],
      -(m.bakw[1] - r.bakw[1])
    )
  );
  function F(m) {
    for (let T = 0; T < b; T++) {
      const O = (T + 1) % b, I = k[T], P = T < b - 1 ? k[O] : k[O] + 2 * Math.PI;
      let C = m;
      for (; C < I; ) C += 2 * Math.PI;
      for (; C >= I + 2 * Math.PI; ) C -= 2 * Math.PI;
      if (C >= I && C < P)
        return { i: T, j: O, frac: (C - I) / (P - I) };
    }
    return { i: 0, j: 1, frac: 0 };
  }
  function L(m) {
    const { i: T, j: O, frac: I } = F(m), P = E[T];
    let R = E[O] - P;
    for (; R > Math.PI; ) R -= 2 * Math.PI;
    for (; R < -Math.PI; ) R += 2 * Math.PI;
    return P + I * R;
  }
  const g = new Set(
    d.map(
      (m) => Math.floor(Cn(m.forw, r.forw) / 10) % 36
    )
  ), x = i.map((m) => ({
    forw: m.forw,
    bakw: m.bakw,
    angleDeg: Cn(m.forw, r.forw),
    forwDist: Math.hypot(m.forw[0] - r.forw[0], m.forw[1] - r.forw[1])
  })), u = [];
  for (let m = 0; m < 36; m++) {
    if (g.has(m)) continue;
    const T = m * 10, O = x.filter(
      (M) => M.angleDeg >= T && M.angleDeg < T + 10
    );
    let I = null;
    if (O.length > 0) {
      const M = O.reduce((_, X) => X.forwDist > _.forwDist ? X : _);
      I = Rn(r.forw, M.forw, o, a, c, f);
    }
    if (!I) {
      const M = (T + 5) % 360 * (Math.PI / 180), _ = [
        r.forw[0] + Math.sin(M),
        r.forw[1] + Math.cos(M)
      ];
      I = Rn(r.forw, _, o, a, c, f);
    }
    if (!I) continue;
    const P = [I[0] - r.forw[0], I[1] - r.forw[1]], C = Math.atan2(P[0], P[1]), R = L(C), G = [
      r.bakw[0] + Math.sin(R),
      r.bakw[1] - Math.cos(R)
    ], p = ci(r.bakw, G, d);
    p && u.push({ forw: I, bakw: p });
  }
  const w = [...d, ...u];
  return w.sort(
    (m, T) => Math.atan2(m.forw[0] - r.forw[0], m.forw[1] - r.forw[1]) - Math.atan2(T.forw[0] - r.forw[0], T.forw[1] - r.forw[1])
  ), Fn(w, i, r), w;
}
function fi(s, t = !1) {
  return Qn(s, "plain", t);
}
function hi(s, t = !1) {
  return Qn(s, "birdeye", t);
}
function li(s) {
  const e = new ui(s).findSegmentIntersections(), n = tr(e), r = /* @__PURE__ */ new Map();
  return n.forEach((i) => {
    r.set(`${i.x}:${i.y}`, i);
  }), Array.from(r.values()).map(
    (i) => he([i.x, i.y])
  );
}
class ui {
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
    const e = [], n = [], r = t.map((i) => {
      const o = i ? i.length : 0;
      for (let a = 0; a < o; a++)
        e.push(i[a][0]), n.push(i[a][1]);
      return o;
    });
    this.initXYData(r, e, n);
  }
  initXYData(t, e, n) {
    const r = t.length;
    this._xx = new Float64Array(e), this._yy = new Float64Array(n), this._nn = new Uint32Array(t), this._zz = null, this._zlimit = 0, this._filteredArcIter = null, this._ii = new Uint32Array(r);
    let i = 0;
    for (let o = 0; o < r; o++)
      this._ii[o] = i, i += t[o];
    (i != this._xx.length || this._xx.length != this._yy.length) && gn("ArcCollection#initXYData() Counting error"), this.initBounds(), this._arcIter = new Oi(this._xx, this._yy);
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
    const r = n.length, i = new Float64Array(r * 4), o = new Pe();
    let a = 0, c, f, l;
    for (let h = 0; h < r; h++)
      c = n[h], c > 0 && (f = h * 4, l = Ni(t, e, a, c), i[f++] = l[0], i[f++] = l[1], i[f++] = l[2], i[f] = l[3], a += c, o.mergeBounds(l));
    return {
      bb: i,
      bounds: o
    };
  }
  getBounds() {
    return this._allBounds ? this._allBounds.clone() : new Pe();
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
    const n = t >= 0, r = n ? t : ~t, i = this.getRetainedInterval(), o = this._nn[r], a = n ? 1 : -1;
    let c = n ? this._ii[r] : this._ii[r] + o - 1, f = c, l = 0;
    for (let h = 1; h < o; h++)
      f += a, (i === 0 || this._zz[f] >= i) && (e(c, f, this._xx, this._yy), c = f, l++);
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
      (r, i, o, a) => {
        t += Math.abs(o[r] - o[i]), e += Math.abs(a[r] - a[i]);
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
   * @returns 検出された交差点の配列
   */
  findSegmentIntersections() {
    const t = this.getBounds(), e = t.ymin || 0, n = (t.ymax || 0) - e, r = this.calcSegmentIntersectionStripeCount(), i = new Uint32Array(r), o = r > 1 ? (E) => Math.floor((r - 1) * (E - e) / n) : () => 0;
    let a, c;
    this.forEachSegment(
      (E, F, L, g) => {
        let x = o(g[E]);
        const u = o(g[F]);
        for (; i[x] = i[x] + 2, x != u; )
          x += u > x ? 1 : -1;
      }
    );
    const f = this.getUint32Array(mi(i));
    let l = 0;
    const h = [];
    gi(i, (E) => {
      const F = l;
      l += E, h.push(f.subarray(F, l));
    }), wi(i, 0), this.forEachSegment(
      (E, F, L, g) => {
        let x = o(g[E]);
        const u = o(g[F]);
        let w, m;
        for (; w = i[x], i[x] = w + 2, m = h[x], m[w] = E, m[w + 1] = F, x != u; )
          x += u > x ? 1 : -1;
      }
    );
    const d = this.getVertexData(), b = [];
    let k;
    for (a = 0; a < r; a++)
      if (d.xx && d.yy)
        for (k = yi(h[a], d.xx, d.yy), c = 0; c < k.length; c++)
          b.push(k[c]);
    return tr(b);
  }
}
function gn(...s) {
  const t = s.join(" ");
  throw new Error(t);
}
function wn(s) {
  return s ? di(s) ? !0 : pi(s) ? !1 : s.length === 0 ? !0 : s.length > 0 : !1;
}
function pi(s) {
  return s != null && s.toString === String.prototype.toString;
}
function di(s) {
  return Array.isArray(s);
}
function mi(s, t) {
  wn(s) || gn("utils.sum() expects an array, received:", s);
  let e = 0, n;
  for (let r = 0, i = s.length; r < i; r++)
    n = s[r], n && (e += n);
  return e;
}
function gi(s, t, e) {
  if (!wn(s))
    throw new Error(`#forEach() takes an array-like argument. ${s}`);
  for (let n = 0, r = s.length; n < r; n++)
    t.call(e, s[n], n);
}
function wi(s, t) {
  for (let e = 0, n = s.length; e < n; e++)
    s[e] = t;
  return s;
}
function yi(s, t, e) {
  const n = s.length - 2, r = [];
  let i, o, a, c, f, l, h, d, b, k, E, F, L, g, x, u, w;
  for (Ii(t, s), u = 0; u < n; ) {
    for (i = s[u], o = s[u + 1], f = t[i], l = t[o], b = e[i], k = e[o], w = u; w < n && (w += 2, a = s[w], h = t[a], !(l < h)); ) {
      if (E = e[a], c = s[w + 1], d = t[c], F = e[c], b >= E) {
        if (b > F && k > E && k > F) continue;
      } else if (b < F && k < E && k < F) continue;
      i == a || i == c || o == a || o == c || (L = xi(
        f,
        b,
        l,
        k,
        h,
        E,
        d,
        F
      ), L && (g = [i, o], x = [a, c], r.push(Ln(L, g, x, t, e)), L.length == 4 && r.push(
        Ln(L.slice(2), g, x, t, e)
      )));
    }
    u += 2;
  }
  return r;
}
function xi(s, t, e, n, r, i, o, a) {
  const c = bi(s, t, e, n, r, i, o, a);
  let f = null;
  return c && (f = vi(s, t, e, n, r, i, o, a), f ? Ai(s, t, e, n, r, i, o, a) && (f = null) : f = Ei(s, t, e, n, r, i, o, a)), f;
}
function bi(s, t, e, n, r, i, o, a) {
  return Ie(s, t, e, n, r, i) * Ie(s, t, e, n, o, a) <= 0 && Ie(r, i, o, a, s, t) * Ie(r, i, o, a, e, n) <= 0;
}
function Ie(s, t, e, n, r, i) {
  return Hn(s - r, t - i, e - r, n - i);
}
function Hn(s, t, e, n) {
  return s * n - t * e;
}
function vi(s, t, e, n, r, i, o, a) {
  let c = qe(s, t, e, n, r, i, o, a), f;
  return c && (f = Mi(c[0], c[1], s, t, e, n, r, i, o, a), f == 1 ? c = qe(e, n, s, t, r, i, o, a) : f == 2 ? c = qe(r, i, o, a, s, t, e, n) : f == 3 && (c = qe(o, a, r, i, s, t, e, n))), c && ki(c, s, t, e, n, r, i, o, a), c;
}
function qe(s, t, e, n, r, i, o, a) {
  const c = Hn(e - s, n - t, o - r, a - i), f = 1e-18;
  let l;
  if (c === 0) return null;
  const h = Ie(r, i, o, a, s, t) / c;
  return c <= f && c >= -f ? l = _i(s, t, e, n, r, i, o, a) : l = [s + h * (e - s), t + h * (n - t)], l;
}
function _i(s, t, e, n, r, i, o, a) {
  let c = null;
  return !ie(s, r, o) && !ie(t, i, a) ? c = [s, t] : !ie(e, r, o) && !ie(n, i, a) ? c = [e, n] : !ie(r, s, e) && !ie(i, t, n) ? c = [r, i] : !ie(o, s, e) && !ie(a, t, n) && (c = [o, a]), c;
}
function ie(s, t, e) {
  let n;
  return t < e ? n = s < t || s > e : t > e ? n = s > t || s < e : n = s != t, n;
}
function Mi(s, t, ...e) {
  let n = -1, r = 1 / 0, i;
  for (let o = 0, a = 0, c = e.length; a < c; o++, a += 2)
    i = Si(s, t, e[a], e[a + 1]), i < r && (r = i, n = o);
  return n;
}
function Si(s, t, e, n) {
  const r = s - e, i = t - n;
  return r * r + i * i;
}
function ki(s, t, e, n, r, i, o, a, c) {
  let f = s[0], l = s[1];
  f = Ue(f, t, n), f = Ue(f, i, a), l = Ue(l, e, r), l = Ue(l, o, c), s[0] = f, s[1] = l;
}
function Ue(s, t, e) {
  let n;
  return ie(s, t, e) && (n = Math.abs(s - t) < Math.abs(s - e) ? t : e, s = n), s;
}
function Ei(s, t, e, n, r, i, o, a) {
  const c = Math.min(s, e, r, o), f = Math.max(s, e, r, o), l = Math.min(t, n, i, a), h = Math.max(t, n, i, a), d = h - l > f - c;
  let b = [];
  return (d ? fe(t, l, h) : fe(s, c, f)) && b.push(s, t), (d ? fe(n, l, h) : fe(e, c, f)) && b.push(e, n), (d ? fe(i, l, h) : fe(r, c, f)) && b.push(r, i), (d ? fe(a, l, h) : fe(o, c, f)) && b.push(o, a), (b.length != 2 && b.length != 4 || b.length == 4 && b[0] == b[2] && b[1] == b[3]) && (b = null), b;
}
function Ai(s, t, e, n, r, i, o, a) {
  return s == r && t == i || s == o && t == a || e == r && n == i || e == o && n == a;
}
function fe(s, t, e) {
  return s > t && s < e;
}
function Ii(s, t) {
  Bi(s, t), Zn(s, t, 0, t.length - 2);
}
function Bi(s, t) {
  for (let e = 0, n = t.length; e < n; e += 2)
    s[t[e]] > s[t[e + 1]] && Ti(t, e, e + 1);
}
function Ti(s, t, e) {
  const n = s[t];
  s[t] = s[e], s[e] = n;
}
function Zn(s, t, e, n) {
  let r = e, i = n, o, a;
  for (; r < n; ) {
    for (o = s[t[e + n >> 2 << 1]]; r <= i; ) {
      for (; s[t[r]] < o; ) r += 2;
      for (; s[t[i]] > o; ) i -= 2;
      r <= i && (a = t[r], t[r] = t[i], t[i] = a, a = t[r + 1], t[r + 1] = t[i + 1], t[i + 1] = a, r += 2, i -= 2);
    }
    if (i - e < 40 ? Yn(s, t, e, i) : Zn(s, t, e, i), n - r < 40) {
      Yn(s, t, r, n);
      return;
    }
    e = r, i = n;
  }
}
function Yn(s, t, e, n) {
  let r, i;
  for (let o = e + 2; o <= n; o += 2) {
    r = t[o], i = t[o + 1];
    let a;
    for (a = o - 2; a >= e && s[r] < s[t[a]]; a -= 2)
      t[a + 2] = t[a], t[a + 3] = t[a + 1];
    t[a + 2] = r, t[a + 3] = i;
  }
}
function Ln(s, t, e, n, r) {
  const i = s[0], o = s[1];
  t = $n(i, o, t[0], t[1], n, r), e = $n(i, o, e[0], e[1], n, r);
  const a = t[0] < e[0] ? t : e, c = a == t ? e : t;
  return { x: i, y: o, a, b: c };
}
function $n(s, t, e, n, r, i) {
  let o = e < n ? e : n, a = o === e ? n : e;
  return r[o] == s && i[o] == t ? a = o : r[a] == s && i[a] == t && (o = a), [o, a];
}
function tr(s) {
  const t = {};
  return s.filter((e) => {
    const n = Pi(e);
    return n in t ? !1 : (t[n] = !0, !0);
  });
}
function Pi(s) {
  return `${s.a.join(",")};${s.b.join(",")}`;
}
class Oi {
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
function Ni(s, t, e, n) {
  let r = e | 0;
  const i = isNaN(n) ? s.length - r : n + r;
  let o, a, c, f, l, h;
  if (i > 0)
    c = l = s[r], f = h = t[r];
  else return [void 0, void 0, void 0, void 0];
  for (r++; r < i; r++)
    o = s[r], a = t[r], o < c && (c = o), o > l && (l = o), a < f && (f = a), a > h && (h = a);
  return [c, f, l, h];
}
class Pe {
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
    return new Pe(
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
    let i, o, a, c;
    if (arguments.length == 1)
      if (wn(t)) {
        const f = t;
        i = f[0], o = f[1], a = f[2], c = f[3];
      } else {
        const f = t;
        i = f.xmin, o = f.ymin, a = f.xmax, c = f.ymax;
      }
    else
      i = t, o = e, a = n, c = r;
    return this.xmin = i, this.ymin = o, this.xmax = a, this.ymax = c, (i > a || o > c) && this.update(), this;
  }
  update() {
    let t;
    this.xmin > this.xmax && (t = this.xmin, this.xmin = this.xmax, this.xmax = t), this.ymin > this.ymax && (t = this.ymin, this.ymin = this.ymax, this.ymax = t);
  }
  mergeBounds(t, ...e) {
    let n, r, i, o;
    return t instanceof Pe ? (n = t.xmin, r = t.ymin, i = t.xmax, o = t.ymax) : e.length == 3 ? (n = t, r = e[0], i = e[1], o = e[2]) : t.length == 4 ? (n = t[0], r = t[1], i = t[2], o = t[3]) : gn("Bounds#mergeBounds() invalid argument:", t), this.xmin === void 0 ? this.setBounds(n, r, i, o) : (n < this.xmin && (this.xmin = n), r < this.ymin && (this.ymin = r), i > this.xmax && (this.xmax = i), o > this.ymax && (this.ymax = o)), this;
  }
}
function Ke(s) {
  const t = ["a", "b", "c"].map(
    (e) => s.properties[e].index
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
function er(s, t, e) {
  const n = Ke(t.forw), r = Ke(t.bakw);
  if (JSON.stringify(n) != JSON.stringify(r))
    throw `${JSON.stringify(t, null, 2)}
${JSON.stringify(
      n
    )}
${JSON.stringify(r)}`;
  for (let i = 0; i < n.length; i++) {
    const o = n[i];
    s[o] || (s[o] = []), s[o].push(t);
  }
  e && (e.forw.features.push(t.forw), e.bakw.features.push(t.bakw));
}
function Vn(s, t, e) {
  const n = Ke(t.forw), r = Ke(t.bakw);
  if (JSON.stringify(n) != JSON.stringify(r))
    throw `${JSON.stringify(t, null, 2)}
${JSON.stringify(n)}
${JSON.stringify(r)}`;
  if (n.forEach((i) => {
    const o = s[i];
    if (!o) return;
    const a = o.filter((c) => c !== t);
    a.length === 0 ? delete s[i] : s[i] = a;
  }), e) {
    const i = (o, a) => {
      !o || !a || (o.features = o.features.filter((c) => c !== a));
    };
    i(e.forw, t.forw), i(e.bakw, t.bakw);
  }
}
function ze(s, t, e) {
  return he(s, { target: { geom: t, index: e } });
}
function We(s) {
  return he(s.properties.target.geom, {
    target: {
      geom: s.geometry.coordinates,
      index: s.properties.target.index
    }
  });
}
function jn(s, t) {
  const e = s.length, n = t.geometry.coordinates;
  return Array.from({ length: e }, (r, i) => i).map((r) => {
    const i = (r + 1) % e, o = s[r], a = s[i], c = o.geometry.coordinates, f = Math.atan2(
      c[0] - n[0],
      c[1] - n[1]
    ), l = [t, o, a, t].map(
      (b) => b.geometry.coordinates
    ), h = {
      a: {
        geom: t.properties.target.geom,
        index: t.properties.target.index
      },
      b: {
        geom: o.properties.target.geom,
        index: o.properties.target.index
      },
      c: {
        geom: a.properties.target.geom,
        index: a.properties.target.index
      }
    }, d = Qt([
      Oe([l], h)
    ]);
    return [f, d];
  }).reduce(
    (r, i) => (r[0].push(i[0]), r[1].push(i[1]), r),
    [[], []]
  );
}
function Xi(s) {
  const { tins: t, targets: e, includeReciprocals: n, numBoundaryVertices: r = 4 } = s, i = {};
  e.forEach((a) => {
    const c = t[a];
    if (!c || !c.features) return;
    i[a] = {};
    const f = {};
    c.features.forEach((l) => {
      const h = ["a", "b", "c"];
      for (let d = 0; d < 3; d++) {
        const b = (d + 1) % 3, k = h[d], E = h[b], F = l.properties[k].index, L = l.properties[E].index, g = [F, L].sort().join("-");
        if (f[g]) continue;
        f[g] = !0;
        const x = l.geometry.coordinates[0][d], u = l.geometry.coordinates[0][b], w = l.properties[k].geom, m = l.properties[E].geom, T = Math.sqrt(
          Math.pow(w[0] - m[0], 2) + Math.pow(w[1] - m[1], 2)
        ) / Math.sqrt(
          Math.pow(x[0] - u[0], 2) + Math.pow(x[1] - u[1], 2)
        ), O = i[a];
        O[`${F}:${g}`] = T, O[`${L}:${g}`] = T;
      }
    });
  });
  const o = {};
  return n && (o.bakw = {}), e.forEach((a) => {
    const c = i[a];
    if (o[a] = {}, !c)
      return;
    const f = {};
    Object.keys(c).forEach((h) => {
      const [d] = h.split(":");
      f[d] || (f[d] = []), f[d].push(c[h]);
    }), Object.keys(f).forEach((h) => {
      const d = f[h], b = d.reduce((k, E) => k + E, 0) / d.length;
      o[a][h] = b, n && o.bakw && (o.bakw[h] = 1 / b);
    });
    let l = 0;
    for (let h = 0; h < r; h++) {
      const d = `b${h}`, b = o[a][d] || 0;
      l += b;
    }
    o[a].c = l / r, n && o.bakw && (o.bakw.c = 1 / o[a].c);
  }), o;
}
function Ge(s, t = 1e-6) {
  const [e, n] = s[0], [r, i] = s[1], [o, a] = s[2];
  return Math.abs((r - e) * (a - n) - (o - e) * (i - n)) < t;
}
function Di(s, t) {
  const e = s.split("-");
  if (e.length !== 2 || !e.every((i) => /^-?\d+$/.test(i))) return !1;
  const [n, r] = e.map((i) => parseInt(i, 10)).sort((i, o) => i - o);
  return t.some((i) => {
    if (i.length !== 2) return !1;
    const o = i.map((c) => parseInt(`${c}`, 10));
    if (o.some((c) => Number.isNaN(c))) return !1;
    const a = o.sort((c, f) => c - f);
    return a[0] === n && a[1] === r;
  });
}
function Be(s) {
  return ["a", "b", "c"].map((t, e) => ({
    prop: s.properties[t],
    geom: s.geometry.coordinates[0][e]
  }));
}
const Ci = 10;
function Ri(s, t, e, n, r, i) {
  if (!s && !t) return !1;
  const o = s ? 0 : 1, a = 1 - o, c = e[o], f = e[a];
  if (!c || !f) return !1;
  const l = jt(f.geom);
  let h = !1, d = !1;
  for (let b = 0; b <= 1; b++) {
    const k = n[b];
    if (!k) continue;
    const E = [String(k.prop.index), String(c.prop.index)].sort().join("-"), F = r[E];
    if (!F || F.length < 2) continue;
    const L = F.find(
      (C) => C.bakw !== i[o].bakw
    );
    if (!L) continue;
    const x = Be(L.bakw).find(
      (C) => String(C.prop.index) !== String(k.prop.index) && String(C.prop.index) !== String(c.prop.index)
    );
    if (!x) continue;
    h = !0;
    const u = jt(x.geom), w = jt(k.geom), m = jt(c.geom), T = m[0] - w[0], O = m[1] - w[1], I = T * (l[1] - w[1]) - O * (l[0] - w[0]), P = T * (u[1] - w[1]) - O * (u[0] - w[0]);
    if (I * P > 0) {
      d = !0;
      break;
    }
  }
  return h && !d;
}
function Fi(s, t, e, n) {
  if (!s && !t) return !1;
  if (e[0] && e[1] && n[0] && n[1]) {
    const r = n.map((l) => jt(l.geom)), i = e.map((l) => jt(l.geom)), o = r[1][0] - r[0][0], a = r[1][1] - r[0][1], c = o * (i[0][1] - r[0][1]) - a * (i[0][0] - r[0][0]), f = o * (i[1][1] - r[0][1]) - a * (i[1][0] - r[0][0]);
    return c * f < 0;
  }
  return !1;
}
function Yi(s, t, e) {
  const n = /* @__PURE__ */ new Set();
  let r = !1;
  for (let i = 0; i < Ci; i++) {
    let o = !1;
    for (const a of Object.keys(t)) {
      if (n.has(a)) continue;
      n.add(a);
      const c = t[a];
      if (!c || c.length < 2) continue;
      const f = a.split("-");
      if (f.length !== 2 || Di(a, e)) continue;
      const l = Be(c[0].bakw), h = Be(c[1].bakw), d = Be(c[0].forw), b = Be(c[1].forw), k = f.map(
        (B) => l.find((Y) => `${Y.prop.index}` === B) || h.find((Y) => `${Y.prop.index}` === B)
      ), E = f.map(
        (B) => d.find((Y) => `${Y.prop.index}` === B) || b.find((Y) => `${Y.prop.index}` === B)
      );
      if (k.some((B) => !B) || E.some((B) => !B))
        continue;
      const F = [l, h].map(
        (B) => B.find((Y) => !f.includes(`${Y.prop.index}`))
      ), L = [d, b].map(
        (B) => B.find((Y) => !f.includes(`${Y.prop.index}`))
      );
      if (F.some((B) => !B) || L.some((B) => !B))
        continue;
      const g = c[0].bakw.geometry.coordinates[0].slice(0, 3).map((B) => jt(B)), x = c[1].bakw.geometry.coordinates[0].slice(0, 3).map((B) => jt(B)), u = c[0].forw.geometry.coordinates[0].slice(0, 3).map((B) => jt(B)), w = c[1].forw.geometry.coordinates[0].slice(0, 3).map((B) => jt(B)), m = Ge(g), T = Ge(x), O = Ge(u), I = Ge(w), P = Ri(
        m,
        T,
        F,
        k,
        t,
        c
      ), C = Fi(
        O,
        I,
        F,
        k
      );
      if (!(P || C || qn(
        jt(F[0].geom),
        x
      ) || qn(
        jt(F[1].geom),
        g
      )))
        continue;
      const G = E.map(
        (B) => jt(B.geom)
      ), p = L.map(
        (B) => jt(B.geom)
      ), M = Li([
        ...G,
        ...p
      ]), _ = $i(M), X = Un(
        G[0],
        G[1],
        p[0]
      ) + Un(
        G[0],
        G[1],
        p[1]
      );
      pn(_, X) && (Vn(t, c[0], s), Vn(t, c[1], s), k.forEach((B) => {
        if (!B) return;
        const Y = [
          B.geom,
          F[0].geom,
          F[1].geom,
          B.geom
        ], y = {
          a: B.prop,
          b: F[0].prop,
          c: F[1].prop
        }, D = Oe([Y], y), j = Ut.counterTri(D);
        er(t, {
          forw: j,
          bakw: D
        }, s);
      }), o = !0, r = !0);
    }
    if (!o) break;
  }
  return r;
}
function jt(s) {
  return [s[0], s[1]];
}
function qn(s, t) {
  const [e, n] = t[0], [r, i] = t[1], [o, a] = t[2], c = o - e, f = a - n, l = r - e, h = i - n, d = s[0] - e, b = s[1] - n, k = c * c + f * f, E = c * l + f * h, F = c * d + f * b, L = l * l + h * h, g = l * d + h * b, x = k * L - E * E;
  if (x === 0) return !1;
  const u = 1 / x, w = (L * F - E * g) * u, m = (k * g - E * F) * u, T = 1e-9;
  return w >= -T && m >= -T && w + m <= 1 + T;
}
function Li(s) {
  const t = s.map((o) => o.slice()).filter(
    (o, a, c) => c.findIndex(
      (f) => pn(f[0], o[0]) && pn(f[1], o[1])
    ) === a
  );
  if (t.length <= 1) return t;
  const e = t.sort(
    (o, a) => o[0] === a[0] ? o[1] - a[1] : o[0] - a[0]
  ), n = (o, a, c) => (a[0] - o[0]) * (c[1] - o[1]) - (a[1] - o[1]) * (c[0] - o[0]), r = [];
  for (const o of e) {
    for (; r.length >= 2 && n(
      r[r.length - 2],
      r[r.length - 1],
      o
    ) <= 0; )
      r.pop();
    r.push(o);
  }
  const i = [];
  for (let o = e.length - 1; o >= 0; o--) {
    const a = e[o];
    for (; i.length >= 2 && n(
      i[i.length - 2],
      i[i.length - 1],
      a
    ) <= 0; )
      i.pop();
    i.push(a);
  }
  return i.pop(), r.pop(), r.concat(i);
}
function $i(s) {
  if (s.length < 3) return 0;
  let t = 0;
  for (let e = 0; e < s.length; e++) {
    const [n, r] = s[e], [i, o] = s[(e + 1) % s.length];
    t += n * o - i * r;
  }
  return Math.abs(t) / 2;
}
function Un(s, t, e) {
  return Math.abs(
    (s[0] * (t[1] - e[1]) + t[0] * (e[1] - s[1]) + e[0] * (s[1] - t[1])) / 2
  );
}
function pn(s, t, e = 1e-9) {
  return Math.abs(s - t) <= e;
}
const zn = 3;
class Xt extends Ut.Transform {
  importance;
  priority;
  pointsSet;
  useV2Algorithm;
  /**
   * Tinクラスのインスタンスを生成します
   * @param options - 初期化オプション
   */
  constructor(t = {}) {
    super(), t.bounds ? this.setBounds(t.bounds) : (this.setWh(t.wh), this.vertexMode = t.vertexMode || Xt.VERTEX_PLAIN), this.strictMode = t.strictMode || Xt.MODE_AUTO, this.yaxisMode = t.yaxisMode || Xt.YAXIS_INVERT, this.importance = t.importance || 0, this.priority = t.priority || 0, this.stateFull = t.stateFull || !1, this.useV2Algorithm = t.useV2Algorithm ?? !1, t.points && this.setPoints(t.points), t.edges && this.setEdges(t.edges);
  }
  /**
   * フォーマットバージョンを取得します
   */
  getFormatVersion() {
    return this.useV2Algorithm ? Ut.format_version : zn;
  }
  /**
   * 制御点（GCP: Ground Control Points）を設定します。
   * 指定した点群に合わせて内部のTINキャッシュをリセットします。
   */
  setPoints(t) {
    this.yaxisMode === Xt.YAXIS_FOLLOW && (t = t.map((e) => [
      e[0],
      [e[1][0], -1 * e[1][1]]
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
    let e = t[0][0], n = e, r = t[0][1], i = r;
    const o = [t[0]];
    for (let a = 1; a < t.length; a++) {
      const c = t[a];
      c[0] < e && (e = c[0]), c[0] > n && (n = c[0]), c[1] < r && (r = c[1]), c[1] > i && (i = c[1]), o.push(c);
    }
    o.push(t[0]), this.boundsPolygon = Oe([o]), this.xy = [e, r], this.wh = [n - e, i - r], this.vertexMode = Xt.VERTEX_PLAIN, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 現在の設定を永続化可能な形式にコンパイルします
   */
  getCompiled() {
    const t = {};
    t.version = this.useV2Algorithm ? Ut.format_version : zn, t.points = this.points, t.weight_buffer = this.pointsWeightBuffer ?? {}, t.centroid_point = [
      this.centroid.forw.geometry.coordinates,
      this.centroid.forw.properties.target.geom
    ], t.vertices_params = [
      this.vertices_params.forw[0],
      this.vertices_params.bakw[0]
    ], t.vertices_points = [];
    const e = this.vertices_params.forw[1];
    if (e)
      for (let n = 0; n < e.length; n++) {
        const r = e[n].features[0], i = r.geometry.coordinates[0][1], o = r.properties.b.geom;
        t.vertices_points[n] = [i, o];
      }
    return t.strict_status = this.strict_status, t.tins_points = [[]], this.tins.forw.features.map((n) => {
      t.tins_points[0].push(
        ["a", "b", "c"].map(
          (r) => n.properties[r].index
        )
      );
    }), this.strict_status === Xt.STATUS_LOOSE ? (t.tins_points[1] = [], this.tins.bakw.features.map((n) => {
      t.tins_points[1].push(
        ["a", "b", "c"].map(
          (r) => n.properties[r].index
        )
      );
    })) : this.strict_status === Xt.STATUS_ERROR && this.kinks?.bakw && (t.kinks_points = this.kinks.bakw.features.map(
      (n) => n.geometry.coordinates
    )), t.yaxisMode = this.yaxisMode, t.vertexMode = this.vertexMode, t.strictMode = this.strictMode, this.bounds ? (t.bounds = this.bounds, t.boundsPolygon = this.boundsPolygon, this.useV2Algorithm && (t.xy = this.xy, t.wh = this.wh)) : t.wh = this.wh, t.edges = this.edges ?? [], t.edgeNodes = this.edgeNodes ?? [], t;
  }
  /**
   * コンパイルされた設定を適用します（v3+フォーマット対応）
   *
   * バージョン3以上のコンパイル済みデータが渡された場合は restoreV3State() を
   * 使用してN頂点対応の復元を行います。それ以外は基底クラスの実装に委譲します。
   */
  setCompiled(t) {
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
    const t = this.tins.forw.features.map(
      (r) => Ut.counterTri(r)
    );
    this.tins.bakw = Qt(t);
    const e = {};
    this.tins.forw.features.forEach((r, i) => {
      const o = this.tins.bakw.features[i];
      er(e, { forw: r, bakw: o });
    }), Yi(
      this.tins,
      e,
      this.pointsSet?.edges || []
    );
    const n = ["forw", "bakw"].map((r) => {
      const i = this.tins[r].features.map(
        (o) => o.geometry.coordinates[0]
      );
      return li(i);
    });
    n[0].length === 0 && n[1].length === 0 ? (this.strict_status = Xt.STATUS_STRICT, delete this.kinks) : (this.strict_status = Xt.STATUS_ERROR, this.kinks = {
      forw: Qt(n[0]),
      bakw: Qt(n[1])
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
      const i = this.points[r][0], o = this.points[r][1], a = ze(i, o, r);
      t.forw.push(a), t.bakw.push(We(a));
    }
    const e = [];
    let n = 0;
    this.edgeNodes = [], this.edges || (this.edges = []);
    for (let r = 0; r < this.edges.length; r++) {
      const i = this.edges[r][2], o = Object.assign([], this.edges[r][0]), a = Object.assign([], this.edges[r][1]);
      if (o.length === 0 && a.length === 0) {
        e.push(i);
        continue;
      }
      o.unshift(this.points[i[0]][0]), o.push(this.points[i[1]][0]), a.unshift(this.points[i[0]][1]), a.push(this.points[i[1]][1]);
      const c = [o, a].map((f) => {
        const l = f.map((d, b, k) => {
          if (b === 0) return 0;
          const E = k[b - 1];
          return Math.sqrt(
            Math.pow(d[0] - E[0], 2) + Math.pow(d[1] - E[1], 2)
          );
        }), h = l.reduce((d, b, k) => k === 0 ? [0] : (d.push(d[k - 1] + b), d), []);
        return h.map((d, b, k) => {
          const E = d / k[k.length - 1];
          return [f[b], l[b], h[b], E];
        });
      });
      c.map((f, l) => {
        const h = c[l ? 0 : 1];
        return f.filter((d, b) => !(b === 0 || b === f.length - 1 || d[4] === "handled")).flatMap((d) => {
          const b = d[0], k = d[3], E = h.reduce(
            (F, L, g, x) => {
              if (F) return F;
              const u = x[g + 1];
              if (L[3] === k)
                return L[4] = "handled", [L];
              if (L[3] < k && u && u[3] > k)
                return [L, u];
            },
            void 0
          );
          if (E && E.length === 1)
            return l === 0 ? [[b, E[0][0], k]] : [[E[0][0], b, k]];
          if (E && E.length === 2) {
            const F = E[0], L = E[1], g = (k - F[3]) / (L[3] - F[3]), x = [
              (L[0][0] - F[0][0]) * g + F[0][0],
              (L[0][1] - F[0][1]) * g + F[0][1]
            ];
            return l === 0 ? [[b, x, k]] : [[x, b, k]];
          }
          return [];
        });
      }).reduce((f, l) => f.concat(l), []).sort((f, l) => f[2] < l[2] ? -1 : 1).map((f, l, h) => {
        this.edgeNodes[n] = [
          f[0],
          f[1]
        ];
        const d = ze(
          f[0],
          f[1],
          `e${n}`
        );
        n++, t.forw.push(d), t.bakw.push(We(d)), l === 0 ? e.push([i[0], t.forw.length - 1]) : e.push([
          t.forw.length - 2,
          t.forw.length - 1
        ]), l === h.length - 1 && e.push([t.forw.length - 1, i[1]]);
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
    const i = this.bounds ? this.boundsPolygon : void 0;
    if (!this.points.reduce((c, f) => c && (i ? fn(f[0], i) : f[0][0] >= t && f[0][0] <= e && f[0][1] >= n && f[0][1] <= r), !0))
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
  /**
   * Compute a bounding box derived from GCP coordinates with a 5% margin.
   * Used in V3 plain mode where no explicit image bounds are available.
   */
  computeGcpBbox() {
    let t = 1 / 0, e = -1 / 0, n = 1 / 0, r = -1 / 0;
    for (const a of this.points) {
      const c = a[0][0], f = a[0][1];
      c < t && (t = c), c > e && (e = c), f < n && (n = f), f > r && (r = f);
    }
    const i = e - t, o = r - n;
    return {
      minx: t - 0.05 * i,
      maxx: e + 0.05 * i,
      miny: n - 0.05 * o,
      maxy: r + 0.05 * o
    };
  }
  /**
   * TINネットワークを同期的に更新し、座標変換の準備を行います。
   * 重めの計算を伴うため、呼び出し側が非同期制御を行いたい場合は
   * {@link updateTinAsync} を利用してください。
   */
  updateTin() {
    let t = this.strictMode;
    t !== Xt.MODE_STRICT && t !== Xt.MODE_LOOSE && (t = Xt.MODE_AUTO);
    const e = !this.useV2Algorithm;
    let n, r, i, o, a;
    if (e) {
      if (this.bounds) {
        const P = this.boundsPolygon;
        if (!P) throw new Error("Internal error: bounds is set but boundsPolygon is missing");
        if (!this.points.every(
          (R) => fn(R[0], P)
        )) throw "SOME POINTS OUTSIDE";
      }
      n = this.generatePointsSet(), { minx: r, maxx: i, miny: o, maxy: a } = this.computeGcpBbox();
    } else {
      const P = this.validateAndPrepareInputs();
      n = P.pointsSet, r = P.minx, i = P.maxx, o = P.miny, a = P.maxy;
    }
    const c = {
      forw: Qt(n.forw),
      bakw: Qt(n.bakw)
    }, f = je(
      c.forw,
      n.edges,
      "target"
    ), l = je(
      c.bakw,
      n.edges,
      "target"
    );
    if (f.features.length === 0 || l.features.length === 0)
      throw "TOO LINEAR1";
    const h = Tr(c.forw), d = Pn(c.forw);
    if (!d) throw "TOO LINEAR2";
    const b = {}, k = d.geometry.coordinates[0];
    let E;
    try {
      E = k.map((P) => ({
        forw: P,
        bakw: Ut.transformArr(he(P), f)
      })), E.forEach((P) => {
        b[`${P.forw[0]}:${P.forw[1]}`] = P;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const F = Pn(c.bakw);
    if (!F) throw "TOO LINEAR2";
    const L = F.geometry.coordinates[0];
    try {
      E = L.map((P) => ({
        bakw: P,
        forw: Ut.transformArr(he(P), l)
      })), E.forEach((P) => {
        b[`${P.forw[0]}:${P.forw[1]}`] = P;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    let g;
    if (e) {
      const P = h.geometry.coordinates, C = f.features.find(
        (R) => fn(
          he(P),
          R
        )
      );
      if (C) {
        const R = C.geometry.coordinates[0], G = C.properties.a.geom, p = C.properties.b.geom, M = C.properties.c.geom;
        g = {
          forw: [
            (R[0][0] + R[1][0] + R[2][0]) / 3,
            (R[0][1] + R[1][1] + R[2][1]) / 3
          ],
          bakw: [
            (G[0] + p[0] + M[0]) / 3,
            (G[1] + p[1] + M[1]) / 3
          ]
        };
      } else
        g = {
          forw: P,
          bakw: Ut.transformArr(h, f)
        };
    } else
      g = {
        forw: h.geometry.coordinates,
        bakw: Ut.transformArr(h, f)
      };
    const x = ze(g.forw, g.bakw, "c");
    this.centroid = {
      forw: x,
      bakw: We(x)
    };
    const u = [
      ...this.points.map((P) => ({ forw: P[0], bakw: P[1] })),
      ...(this.edgeNodes ?? []).map((P) => ({ forw: P[0], bakw: P[1] }))
    ], w = {
      convexBuf: b,
      centroid: g,
      allGcps: u,
      minx: r,
      maxx: i,
      miny: o,
      maxy: a
    }, m = this.vertexMode === Xt.VERTEX_BIRDEYE ? hi(w, e) : fi(w, e), T = {
      forw: [],
      bakw: []
    };
    for (let P = 0; P < m.length; P++) {
      const C = m[P].forw, R = m[P].bakw, G = ze(C, R, `b${P}`), p = We(G);
      n.forw.push(G), n.bakw.push(p), T.forw.push(G), T.bakw.push(p);
    }
    this.pointsSet = {
      forw: Qt(n.forw),
      bakw: Qt(n.bakw),
      edges: n.edges
    }, this.tins = {
      forw: Ut.rotateVerticesTriangle(
        je(
          this.pointsSet.forw,
          n.edges,
          "target"
        )
      )
    }, (t === Xt.MODE_STRICT || t === Xt.MODE_AUTO) && this.calcurateStrictTin(), (t === Xt.MODE_LOOSE || t === Xt.MODE_AUTO && this.strict_status === Xt.STATUS_ERROR) && (this.tins.bakw = Ut.rotateVerticesTriangle(
      je(
        this.pointsSet.bakw,
        n.edges,
        "target"
      )
    ), delete this.kinks, this.strict_status = Xt.STATUS_LOOSE), this.vertices_params = {
      forw: jn(T.forw, this.centroid.forw),
      bakw: jn(T.bakw, this.centroid.bakw)
    }, this.addIndexedTin();
    const O = ["forw"];
    this.strict_status === Xt.STATUS_LOOSE && O.push("bakw");
    const I = this.strict_status === Xt.STATUS_STRICT;
    this.pointsWeightBuffer = Xi({
      tins: this.tins,
      targets: O,
      includeReciprocals: I,
      numBoundaryVertices: m.length
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
const ji = Ut.format_version;
export {
  Xt as Tin,
  je as constrainedTin,
  We as counterPoint,
  ze as createPoint,
  Xt as default,
  li as findIntersections,
  ji as format_version,
  er as insertSearchIndex,
  jn as vertexCalc
};
