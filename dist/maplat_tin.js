const Ct = 11102230246251565e-32, rt = 134217729, Xn = (3 + 8 * Ct) * Ct;
function Yt(o, t, e, n, r) {
  let i, s, a, c, h = t[0], u = n[0], f = 0, d = 0;
  u > h == u > -h ? (i = h, h = t[++f]) : (i = u, u = n[++d]);
  let y = 0;
  if (f < o && d < e)
    for (u > h == u > -h ? (s = h + i, a = i - (s - h), h = t[++f]) : (s = u + i, a = i - (s - u), u = n[++d]), i = s, a !== 0 && (r[y++] = a); f < o && d < e; )
      u > h == u > -h ? (s = i + h, c = s - i, a = i - (s - c) + (h - c), h = t[++f]) : (s = i + u, c = s - i, a = i - (s - c) + (u - c), u = n[++d]), i = s, a !== 0 && (r[y++] = a);
  for (; f < o; )
    s = i + h, c = s - i, a = i - (s - c) + (h - c), h = t[++f], i = s, a !== 0 && (r[y++] = a);
  for (; d < e; )
    s = i + u, c = s - i, a = i - (s - c) + (u - c), u = n[++d], i = s, a !== 0 && (r[y++] = a);
  return (i !== 0 || y === 0) && (r[y++] = i), y;
}
function Ut(o, t, e, n, r, i, s, a) {
  return Yt(Yt(o, t, e, n, s), s, r, i, a);
}
function U(o, t, e, n) {
  let r, i, s, a, c, h, u, f, d, y, E;
  u = rt * e, y = u - (u - e), E = e - y;
  let k = t[0];
  r = k * e, u = rt * k, f = u - (u - k), d = k - f, s = d * E - (r - f * y - d * y - f * E);
  let X = 0;
  s !== 0 && (n[X++] = s);
  for (let C = 1; C < o; C++)
    k = t[C], a = k * e, u = rt * k, f = u - (u - k), d = k - f, c = d * E - (a - f * y - d * y - f * E), i = r + c, h = i - r, s = r - (i - h) + (c - h), s !== 0 && (n[X++] = s), r = a + i, s = i - (r - a), s !== 0 && (n[X++] = s);
  return (r !== 0 || X === 0) && (n[X++] = r), X;
}
function Yn(o, t) {
  let e = t[0];
  for (let n = 1; n < o; n++) e += t[n];
  return e;
}
function vt(o) {
  return new Float64Array(o);
}
const Jn = (3 + 16 * Ct) * Ct, Kn = (2 + 12 * Ct) * Ct, Gn = (9 + 64 * Ct) * Ct * Ct, me = vt(4), cn = vt(8), hn = vt(12), fn = vt(16), Ft = vt(4);
function Qn(o, t, e, n, r, i, s) {
  let a, c, h, u, f, d, y, E, k, X, C, m, v, l, g, x, A, I;
  const b = o - r, T = e - r, R = t - i, D = n - i;
  l = b * D, d = rt * b, y = d - (d - b), E = b - y, d = rt * D, k = d - (d - D), X = D - k, g = E * X - (l - y * k - E * k - y * X), x = R * T, d = rt * R, y = d - (d - R), E = R - y, d = rt * T, k = d - (d - T), X = T - k, A = E * X - (x - y * k - E * k - y * X), C = g - A, f = g - C, me[0] = g - (C + f) + (f - A), m = l + C, f = m - l, v = l - (m - f) + (C - f), C = v - x, f = v - C, me[1] = v - (C + f) + (f - x), I = m + C, f = I - m, me[2] = m - (I - f) + (C - f), me[3] = I;
  let Q = Yn(4, me), p = Kn * s;
  if (Q >= p || -Q >= p || (f = o - b, a = o - (b + f) + (f - r), f = e - T, h = e - (T + f) + (f - r), f = t - R, c = t - (R + f) + (f - i), f = n - D, u = n - (D + f) + (f - i), a === 0 && c === 0 && h === 0 && u === 0) || (p = Gn * s + Xn * Math.abs(Q), Q += b * u + D * a - (R * h + T * c), Q >= p || -Q >= p)) return Q;
  l = a * D, d = rt * a, y = d - (d - a), E = a - y, d = rt * D, k = d - (d - D), X = D - k, g = E * X - (l - y * k - E * k - y * X), x = c * T, d = rt * c, y = d - (d - c), E = c - y, d = rt * T, k = d - (d - T), X = T - k, A = E * X - (x - y * k - E * k - y * X), C = g - A, f = g - C, Ft[0] = g - (C + f) + (f - A), m = l + C, f = m - l, v = l - (m - f) + (C - f), C = v - x, f = v - C, Ft[1] = v - (C + f) + (f - x), I = m + C, f = I - m, Ft[2] = m - (I - f) + (C - f), Ft[3] = I;
  const M = Yt(4, me, 4, Ft, cn);
  l = b * u, d = rt * b, y = d - (d - b), E = b - y, d = rt * u, k = d - (d - u), X = u - k, g = E * X - (l - y * k - E * k - y * X), x = R * h, d = rt * R, y = d - (d - R), E = R - y, d = rt * h, k = d - (d - h), X = h - k, A = E * X - (x - y * k - E * k - y * X), C = g - A, f = g - C, Ft[0] = g - (C + f) + (f - A), m = l + C, f = m - l, v = l - (m - f) + (C - f), C = v - x, f = v - C, Ft[1] = v - (C + f) + (f - x), I = m + C, f = I - m, Ft[2] = m - (I - f) + (C - f), Ft[3] = I;
  const _ = Yt(M, cn, 4, Ft, hn);
  l = a * u, d = rt * a, y = d - (d - a), E = a - y, d = rt * u, k = d - (d - u), X = u - k, g = E * X - (l - y * k - E * k - y * X), x = c * h, d = rt * c, y = d - (d - c), E = c - y, d = rt * h, k = d - (d - h), X = h - k, A = E * X - (x - y * k - E * k - y * X), C = g - A, f = g - C, Ft[0] = g - (C + f) + (f - A), m = l + C, f = m - l, v = l - (m - f) + (C - f), C = v - x, f = v - C, Ft[1] = v - (C + f) + (f - x), I = m + C, f = I - m, Ft[2] = m - (I - f) + (C - f), Ft[3] = I;
  const B = Yt(_, hn, 4, Ft, fn);
  return fn[B - 1];
}
function te(o, t, e, n, r, i) {
  const s = (t - i) * (e - r), a = (o - r) * (n - i), c = s - a, h = Math.abs(s + a);
  return Math.abs(c) >= Jn * h ? c : -Qn(o, t, e, n, r, i, h);
}
const Hn = (10 + 96 * Ct) * Ct, Zn = (4 + 48 * Ct) * Ct, tr = (44 + 576 * Ct) * Ct * Ct, re = vt(4), ie = vt(4), se = vt(4), Qt = vt(4), Ht = vt(4), Zt = vt(4), Lt = vt(4), Dt = vt(4), Ve = vt(8), We = vt(8), Je = vt(8), Ke = vt(8), Ge = vt(8), Qe = vt(8), Ae = vt(8), Pe = vt(8), Be = vt(8), fe = vt(4), ue = vt(4), le = vt(4), ot = vt(8), pt = vt(16), kt = vt(16), St = vt(16), bt = vt(32), oe = vt(32), Ot = vt(48), $t = vt(64);
let ye = vt(1152), He = vt(1152);
function It(o, t, e) {
  o = Yt(o, ye, t, e, He);
  const n = ye;
  return ye = He, He = n, o;
}
function er(o, t, e, n, r, i, s, a, c) {
  let h, u, f, d, y, E, k, X, C, m, v, l, g, x, A, I, b, T, R, D, Q, p, M, _, B, N, Y, w, O, $, q, V, z, K, j;
  const ct = o - s, ht = e - s, lt = r - s, dt = t - a, gt = n - a, mt = i - a;
  q = ht * mt, M = rt * ht, _ = M - (M - ht), B = ht - _, M = rt * mt, N = M - (M - mt), Y = mt - N, V = B * Y - (q - _ * N - B * N - _ * Y), z = lt * gt, M = rt * lt, _ = M - (M - lt), B = lt - _, M = rt * gt, N = M - (M - gt), Y = gt - N, K = B * Y - (z - _ * N - B * N - _ * Y), w = V - K, p = V - w, re[0] = V - (w + p) + (p - K), O = q + w, p = O - q, $ = q - (O - p) + (w - p), w = $ - z, p = $ - w, re[1] = $ - (w + p) + (p - z), j = O + w, p = j - O, re[2] = O - (j - p) + (w - p), re[3] = j, q = lt * dt, M = rt * lt, _ = M - (M - lt), B = lt - _, M = rt * dt, N = M - (M - dt), Y = dt - N, V = B * Y - (q - _ * N - B * N - _ * Y), z = ct * mt, M = rt * ct, _ = M - (M - ct), B = ct - _, M = rt * mt, N = M - (M - mt), Y = mt - N, K = B * Y - (z - _ * N - B * N - _ * Y), w = V - K, p = V - w, ie[0] = V - (w + p) + (p - K), O = q + w, p = O - q, $ = q - (O - p) + (w - p), w = $ - z, p = $ - w, ie[1] = $ - (w + p) + (p - z), j = O + w, p = j - O, ie[2] = O - (j - p) + (w - p), ie[3] = j, q = ct * gt, M = rt * ct, _ = M - (M - ct), B = ct - _, M = rt * gt, N = M - (M - gt), Y = gt - N, V = B * Y - (q - _ * N - B * N - _ * Y), z = ht * dt, M = rt * ht, _ = M - (M - ht), B = ht - _, M = rt * dt, N = M - (M - dt), Y = dt - N, K = B * Y - (z - _ * N - B * N - _ * Y), w = V - K, p = V - w, se[0] = V - (w + p) + (p - K), O = q + w, p = O - q, $ = q - (O - p) + (w - p), w = $ - z, p = $ - w, se[1] = $ - (w + p) + (p - z), j = O + w, p = j - O, se[2] = O - (j - p) + (w - p), se[3] = j, h = Yt(
    Yt(
      Yt(
        U(U(4, re, ct, ot), ot, ct, pt),
        pt,
        U(U(4, re, dt, ot), ot, dt, kt),
        kt,
        bt
      ),
      bt,
      Yt(
        U(U(4, ie, ht, ot), ot, ht, pt),
        pt,
        U(U(4, ie, gt, ot), ot, gt, kt),
        kt,
        oe
      ),
      oe,
      $t
    ),
    $t,
    Yt(
      U(U(4, se, lt, ot), ot, lt, pt),
      pt,
      U(U(4, se, mt, ot), ot, mt, kt),
      kt,
      bt
    ),
    bt,
    ye
  );
  let Pt = Yn(h, ye), Tt = Zn * c;
  if (Pt >= Tt || -Pt >= Tt || (p = o - ct, u = o - (ct + p) + (p - s), p = t - dt, y = t - (dt + p) + (p - a), p = e - ht, f = e - (ht + p) + (p - s), p = n - gt, E = n - (gt + p) + (p - a), p = r - lt, d = r - (lt + p) + (p - s), p = i - mt, k = i - (mt + p) + (p - a), u === 0 && f === 0 && d === 0 && y === 0 && E === 0 && k === 0) || (Tt = tr * c + Xn * Math.abs(Pt), Pt += (ct * ct + dt * dt) * (ht * k + mt * f - (gt * d + lt * E)) + 2 * (ct * u + dt * y) * (ht * mt - gt * lt) + ((ht * ht + gt * gt) * (lt * y + dt * d - (mt * u + ct * k)) + 2 * (ht * f + gt * E) * (lt * dt - mt * ct)) + ((lt * lt + mt * mt) * (ct * E + gt * u - (dt * f + ht * y)) + 2 * (lt * d + mt * k) * (ct * gt - dt * ht)), Pt >= Tt || -Pt >= Tt))
    return Pt;
  if ((f !== 0 || E !== 0 || d !== 0 || k !== 0) && (q = ct * ct, M = rt * ct, _ = M - (M - ct), B = ct - _, V = B * B - (q - _ * _ - (_ + _) * B), z = dt * dt, M = rt * dt, _ = M - (M - dt), B = dt - _, K = B * B - (z - _ * _ - (_ + _) * B), w = V + K, p = w - V, Qt[0] = V - (w - p) + (K - p), O = q + w, p = O - q, $ = q - (O - p) + (w - p), w = $ + z, p = w - $, Qt[1] = $ - (w - p) + (z - p), j = O + w, p = j - O, Qt[2] = O - (j - p) + (w - p), Qt[3] = j), (d !== 0 || k !== 0 || u !== 0 || y !== 0) && (q = ht * ht, M = rt * ht, _ = M - (M - ht), B = ht - _, V = B * B - (q - _ * _ - (_ + _) * B), z = gt * gt, M = rt * gt, _ = M - (M - gt), B = gt - _, K = B * B - (z - _ * _ - (_ + _) * B), w = V + K, p = w - V, Ht[0] = V - (w - p) + (K - p), O = q + w, p = O - q, $ = q - (O - p) + (w - p), w = $ + z, p = w - $, Ht[1] = $ - (w - p) + (z - p), j = O + w, p = j - O, Ht[2] = O - (j - p) + (w - p), Ht[3] = j), (u !== 0 || y !== 0 || f !== 0 || E !== 0) && (q = lt * lt, M = rt * lt, _ = M - (M - lt), B = lt - _, V = B * B - (q - _ * _ - (_ + _) * B), z = mt * mt, M = rt * mt, _ = M - (M - mt), B = mt - _, K = B * B - (z - _ * _ - (_ + _) * B), w = V + K, p = w - V, Zt[0] = V - (w - p) + (K - p), O = q + w, p = O - q, $ = q - (O - p) + (w - p), w = $ + z, p = w - $, Zt[1] = $ - (w - p) + (z - p), j = O + w, p = j - O, Zt[2] = O - (j - p) + (w - p), Zt[3] = j), u !== 0 && (X = U(4, re, u, Ve), h = It(h, Ut(
    U(X, Ve, 2 * ct, pt),
    pt,
    U(U(4, Zt, u, ot), ot, gt, kt),
    kt,
    U(U(4, Ht, u, ot), ot, -mt, St),
    St,
    bt,
    Ot
  ), Ot)), y !== 0 && (C = U(4, re, y, We), h = It(h, Ut(
    U(C, We, 2 * dt, pt),
    pt,
    U(U(4, Ht, y, ot), ot, lt, kt),
    kt,
    U(U(4, Zt, y, ot), ot, -ht, St),
    St,
    bt,
    Ot
  ), Ot)), f !== 0 && (m = U(4, ie, f, Je), h = It(h, Ut(
    U(m, Je, 2 * ht, pt),
    pt,
    U(U(4, Qt, f, ot), ot, mt, kt),
    kt,
    U(U(4, Zt, f, ot), ot, -dt, St),
    St,
    bt,
    Ot
  ), Ot)), E !== 0 && (v = U(4, ie, E, Ke), h = It(h, Ut(
    U(v, Ke, 2 * gt, pt),
    pt,
    U(U(4, Zt, E, ot), ot, ct, kt),
    kt,
    U(U(4, Qt, E, ot), ot, -lt, St),
    St,
    bt,
    Ot
  ), Ot)), d !== 0 && (l = U(4, se, d, Ge), h = It(h, Ut(
    U(l, Ge, 2 * lt, pt),
    pt,
    U(U(4, Ht, d, ot), ot, dt, kt),
    kt,
    U(U(4, Qt, d, ot), ot, -gt, St),
    St,
    bt,
    Ot
  ), Ot)), k !== 0 && (g = U(4, se, k, Qe), h = It(h, Ut(
    U(g, Qe, 2 * mt, pt),
    pt,
    U(U(4, Qt, k, ot), ot, ht, kt),
    kt,
    U(U(4, Ht, k, ot), ot, -ct, St),
    St,
    bt,
    Ot
  ), Ot)), u !== 0 || y !== 0) {
    if (f !== 0 || E !== 0 || d !== 0 || k !== 0 ? (q = f * mt, M = rt * f, _ = M - (M - f), B = f - _, M = rt * mt, N = M - (M - mt), Y = mt - N, V = B * Y - (q - _ * N - B * N - _ * Y), z = ht * k, M = rt * ht, _ = M - (M - ht), B = ht - _, M = rt * k, N = M - (M - k), Y = k - N, K = B * Y - (z - _ * N - B * N - _ * Y), w = V + K, p = w - V, Lt[0] = V - (w - p) + (K - p), O = q + w, p = O - q, $ = q - (O - p) + (w - p), w = $ + z, p = w - $, Lt[1] = $ - (w - p) + (z - p), j = O + w, p = j - O, Lt[2] = O - (j - p) + (w - p), Lt[3] = j, q = d * -gt, M = rt * d, _ = M - (M - d), B = d - _, M = rt * -gt, N = M - (M - -gt), Y = -gt - N, V = B * Y - (q - _ * N - B * N - _ * Y), z = lt * -E, M = rt * lt, _ = M - (M - lt), B = lt - _, M = rt * -E, N = M - (M - -E), Y = -E - N, K = B * Y - (z - _ * N - B * N - _ * Y), w = V + K, p = w - V, Dt[0] = V - (w - p) + (K - p), O = q + w, p = O - q, $ = q - (O - p) + (w - p), w = $ + z, p = w - $, Dt[1] = $ - (w - p) + (z - p), j = O + w, p = j - O, Dt[2] = O - (j - p) + (w - p), Dt[3] = j, A = Yt(4, Lt, 4, Dt, Pe), q = f * k, M = rt * f, _ = M - (M - f), B = f - _, M = rt * k, N = M - (M - k), Y = k - N, V = B * Y - (q - _ * N - B * N - _ * Y), z = d * E, M = rt * d, _ = M - (M - d), B = d - _, M = rt * E, N = M - (M - E), Y = E - N, K = B * Y - (z - _ * N - B * N - _ * Y), w = V - K, p = V - w, ue[0] = V - (w + p) + (p - K), O = q + w, p = O - q, $ = q - (O - p) + (w - p), w = $ - z, p = $ - w, ue[1] = $ - (w + p) + (p - z), j = O + w, p = j - O, ue[2] = O - (j - p) + (w - p), ue[3] = j, T = 4) : (Pe[0] = 0, A = 1, ue[0] = 0, T = 1), u !== 0) {
      const xt = U(A, Pe, u, St);
      h = It(h, Yt(
        U(X, Ve, u, pt),
        pt,
        U(xt, St, 2 * ct, bt),
        bt,
        Ot
      ), Ot);
      const Mt = U(T, ue, u, ot);
      h = It(h, Ut(
        U(Mt, ot, 2 * ct, pt),
        pt,
        U(Mt, ot, u, kt),
        kt,
        U(xt, St, u, bt),
        bt,
        oe,
        $t
      ), $t), E !== 0 && (h = It(h, U(U(4, Zt, u, ot), ot, E, pt), pt)), k !== 0 && (h = It(h, U(U(4, Ht, -u, ot), ot, k, pt), pt));
    }
    if (y !== 0) {
      const xt = U(A, Pe, y, St);
      h = It(h, Yt(
        U(C, We, y, pt),
        pt,
        U(xt, St, 2 * dt, bt),
        bt,
        Ot
      ), Ot);
      const Mt = U(T, ue, y, ot);
      h = It(h, Ut(
        U(Mt, ot, 2 * dt, pt),
        pt,
        U(Mt, ot, y, kt),
        kt,
        U(xt, St, y, bt),
        bt,
        oe,
        $t
      ), $t);
    }
  }
  if (f !== 0 || E !== 0) {
    if (d !== 0 || k !== 0 || u !== 0 || y !== 0 ? (q = d * dt, M = rt * d, _ = M - (M - d), B = d - _, M = rt * dt, N = M - (M - dt), Y = dt - N, V = B * Y - (q - _ * N - B * N - _ * Y), z = lt * y, M = rt * lt, _ = M - (M - lt), B = lt - _, M = rt * y, N = M - (M - y), Y = y - N, K = B * Y - (z - _ * N - B * N - _ * Y), w = V + K, p = w - V, Lt[0] = V - (w - p) + (K - p), O = q + w, p = O - q, $ = q - (O - p) + (w - p), w = $ + z, p = w - $, Lt[1] = $ - (w - p) + (z - p), j = O + w, p = j - O, Lt[2] = O - (j - p) + (w - p), Lt[3] = j, D = -mt, Q = -k, q = u * D, M = rt * u, _ = M - (M - u), B = u - _, M = rt * D, N = M - (M - D), Y = D - N, V = B * Y - (q - _ * N - B * N - _ * Y), z = ct * Q, M = rt * ct, _ = M - (M - ct), B = ct - _, M = rt * Q, N = M - (M - Q), Y = Q - N, K = B * Y - (z - _ * N - B * N - _ * Y), w = V + K, p = w - V, Dt[0] = V - (w - p) + (K - p), O = q + w, p = O - q, $ = q - (O - p) + (w - p), w = $ + z, p = w - $, Dt[1] = $ - (w - p) + (z - p), j = O + w, p = j - O, Dt[2] = O - (j - p) + (w - p), Dt[3] = j, I = Yt(4, Lt, 4, Dt, Be), q = d * y, M = rt * d, _ = M - (M - d), B = d - _, M = rt * y, N = M - (M - y), Y = y - N, V = B * Y - (q - _ * N - B * N - _ * Y), z = u * k, M = rt * u, _ = M - (M - u), B = u - _, M = rt * k, N = M - (M - k), Y = k - N, K = B * Y - (z - _ * N - B * N - _ * Y), w = V - K, p = V - w, le[0] = V - (w + p) + (p - K), O = q + w, p = O - q, $ = q - (O - p) + (w - p), w = $ - z, p = $ - w, le[1] = $ - (w + p) + (p - z), j = O + w, p = j - O, le[2] = O - (j - p) + (w - p), le[3] = j, R = 4) : (Be[0] = 0, I = 1, le[0] = 0, R = 1), f !== 0) {
      const xt = U(I, Be, f, St);
      h = It(h, Yt(
        U(m, Je, f, pt),
        pt,
        U(xt, St, 2 * ht, bt),
        bt,
        Ot
      ), Ot);
      const Mt = U(R, le, f, ot);
      h = It(h, Ut(
        U(Mt, ot, 2 * ht, pt),
        pt,
        U(Mt, ot, f, kt),
        kt,
        U(xt, St, f, bt),
        bt,
        oe,
        $t
      ), $t), k !== 0 && (h = It(h, U(U(4, Qt, f, ot), ot, k, pt), pt)), y !== 0 && (h = It(h, U(U(4, Zt, -f, ot), ot, y, pt), pt));
    }
    if (E !== 0) {
      const xt = U(I, Be, E, St);
      h = It(h, Yt(
        U(v, Ke, E, pt),
        pt,
        U(xt, St, 2 * gt, bt),
        bt,
        Ot
      ), Ot);
      const Mt = U(R, le, E, ot);
      h = It(h, Ut(
        U(Mt, ot, 2 * gt, pt),
        pt,
        U(Mt, ot, E, kt),
        kt,
        U(xt, St, E, bt),
        bt,
        oe,
        $t
      ), $t);
    }
  }
  if (d !== 0 || k !== 0) {
    if (u !== 0 || y !== 0 || f !== 0 || E !== 0 ? (q = u * gt, M = rt * u, _ = M - (M - u), B = u - _, M = rt * gt, N = M - (M - gt), Y = gt - N, V = B * Y - (q - _ * N - B * N - _ * Y), z = ct * E, M = rt * ct, _ = M - (M - ct), B = ct - _, M = rt * E, N = M - (M - E), Y = E - N, K = B * Y - (z - _ * N - B * N - _ * Y), w = V + K, p = w - V, Lt[0] = V - (w - p) + (K - p), O = q + w, p = O - q, $ = q - (O - p) + (w - p), w = $ + z, p = w - $, Lt[1] = $ - (w - p) + (z - p), j = O + w, p = j - O, Lt[2] = O - (j - p) + (w - p), Lt[3] = j, D = -dt, Q = -y, q = f * D, M = rt * f, _ = M - (M - f), B = f - _, M = rt * D, N = M - (M - D), Y = D - N, V = B * Y - (q - _ * N - B * N - _ * Y), z = ht * Q, M = rt * ht, _ = M - (M - ht), B = ht - _, M = rt * Q, N = M - (M - Q), Y = Q - N, K = B * Y - (z - _ * N - B * N - _ * Y), w = V + K, p = w - V, Dt[0] = V - (w - p) + (K - p), O = q + w, p = O - q, $ = q - (O - p) + (w - p), w = $ + z, p = w - $, Dt[1] = $ - (w - p) + (z - p), j = O + w, p = j - O, Dt[2] = O - (j - p) + (w - p), Dt[3] = j, x = Yt(4, Lt, 4, Dt, Ae), q = u * E, M = rt * u, _ = M - (M - u), B = u - _, M = rt * E, N = M - (M - E), Y = E - N, V = B * Y - (q - _ * N - B * N - _ * Y), z = f * y, M = rt * f, _ = M - (M - f), B = f - _, M = rt * y, N = M - (M - y), Y = y - N, K = B * Y - (z - _ * N - B * N - _ * Y), w = V - K, p = V - w, fe[0] = V - (w + p) + (p - K), O = q + w, p = O - q, $ = q - (O - p) + (w - p), w = $ - z, p = $ - w, fe[1] = $ - (w + p) + (p - z), j = O + w, p = j - O, fe[2] = O - (j - p) + (w - p), fe[3] = j, b = 4) : (Ae[0] = 0, x = 1, fe[0] = 0, b = 1), d !== 0) {
      const xt = U(x, Ae, d, St);
      h = It(h, Yt(
        U(l, Ge, d, pt),
        pt,
        U(xt, St, 2 * lt, bt),
        bt,
        Ot
      ), Ot);
      const Mt = U(b, fe, d, ot);
      h = It(h, Ut(
        U(Mt, ot, 2 * lt, pt),
        pt,
        U(Mt, ot, d, kt),
        kt,
        U(xt, St, d, bt),
        bt,
        oe,
        $t
      ), $t), y !== 0 && (h = It(h, U(U(4, Ht, d, ot), ot, y, pt), pt)), E !== 0 && (h = It(h, U(U(4, Qt, -d, ot), ot, E, pt), pt));
    }
    if (k !== 0) {
      const xt = U(x, Ae, k, St);
      h = It(h, Yt(
        U(g, Qe, k, pt),
        pt,
        U(xt, St, 2 * mt, bt),
        bt,
        Ot
      ), Ot);
      const Mt = U(b, fe, k, ot);
      h = It(h, Ut(
        U(Mt, ot, 2 * mt, pt),
        pt,
        U(Mt, ot, k, kt),
        kt,
        U(xt, St, k, bt),
        bt,
        oe,
        $t
      ), $t);
    }
  }
  return ye[h - 1];
}
function nr(o, t, e, n, r, i, s, a) {
  const c = o - s, h = e - s, u = r - s, f = t - a, d = n - a, y = i - a, E = h * y, k = u * d, X = c * c + f * f, C = u * f, m = c * y, v = h * h + d * d, l = c * d, g = h * f, x = u * u + y * y, A = X * (E - k) + v * (C - m) + x * (l - g), I = (Math.abs(E) + Math.abs(k)) * X + (Math.abs(C) + Math.abs(m)) * v + (Math.abs(l) + Math.abs(g)) * x, b = Hn * I;
  return A > b || -A > b ? A : er(o, t, e, n, r, i, s, a, I);
}
function rr(o, t) {
  var e, n, r = 0, i, s, a, c, h, u, f, d = o[0], y = o[1], E = t.length;
  for (e = 0; e < E; e++) {
    n = 0;
    var k = t[e], X = k.length - 1;
    if (u = k[0], u[0] !== k[X][0] && u[1] !== k[X][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (s = u[0] - d, a = u[1] - y, n; n < X; n++) {
      if (f = k[n + 1], c = f[0] - d, h = f[1] - y, a === 0 && h === 0) {
        if (c <= 0 && s >= 0 || s <= 0 && c >= 0)
          return 0;
      } else if (h >= 0 && a <= 0 || h <= 0 && a >= 0) {
        if (i = te(s, c, a, h, 0, 0), i === 0)
          return 0;
        (i > 0 && h > 0 && a <= 0 || i < 0 && h <= 0 && a > 0) && r++;
      }
      u = f, a = h, s = c;
    }
  }
  return r % 2 !== 0;
}
function Se(o, t, e = {}) {
  const n = { type: "Feature" };
  return (e.id === 0 || e.id) && (n.id = e.id), e.bbox && (n.bbox = e.bbox), n.properties = t || {}, n.geometry = o, n;
}
function de(o, t, e = {}) {
  if (!o)
    throw new Error("coordinates is required");
  if (!Array.isArray(o))
    throw new Error("coordinates must be an Array");
  if (o.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!ln(o[0]) || !ln(o[1]))
    throw new Error("coordinates must contain numbers");
  return Se({
    type: "Point",
    coordinates: o
  }, t, e);
}
function Ee(o, t, e = {}) {
  for (const r of o) {
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
  return Se({
    type: "Polygon",
    coordinates: o
  }, t, e);
}
function un(o, t, e = {}) {
  if (o.length < 2)
    throw new Error("coordinates must be an array of two or more positions");
  return Se({
    type: "LineString",
    coordinates: o
  }, t, e);
}
function Kt(o, t = {}) {
  const e = { type: "FeatureCollection" };
  return t.id && (e.id = t.id), t.bbox && (e.bbox = t.bbox), e.features = o, e;
}
function ln(o) {
  return !isNaN(o) && o !== null && !Array.isArray(o);
}
function ir(o) {
  if (!o)
    throw new Error("coord is required");
  if (!Array.isArray(o)) {
    if (o.type === "Feature" && o.geometry !== null && o.geometry.type === "Point")
      return [...o.geometry.coordinates];
    if (o.type === "Point")
      return [...o.coordinates];
  }
  if (Array.isArray(o) && o.length >= 2 && !Array.isArray(o[0]) && !Array.isArray(o[1]))
    return [...o];
  throw new Error("coord must be GeoJSON Point or an Array of numbers");
}
function sr(o) {
  return o.type === "Feature" ? o.geometry : o;
}
function or(o, t, e = {}) {
  if (!o)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const n = ir(o), r = sr(t), i = r.type, s = t.bbox;
  let a = r.coordinates;
  if (s && ar(n, s) === !1)
    return !1;
  i === "Polygon" && (a = [a]);
  let c = !1;
  for (var h = 0; h < a.length; ++h) {
    const u = rr(n, a[h]);
    if (u === 0) return !e.ignoreBoundary;
    u && (c = !0);
  }
  return c;
}
function ar(o, t) {
  return t[0] <= o[0] && t[1] <= o[1] && t[2] >= o[0] && t[3] >= o[1];
}
var cr = or;
function rn(o, t, e) {
  if (o !== null)
    for (var n, r, i, s, a, c, h, u = 0, f = 0, d, y = o.type, E = y === "FeatureCollection", k = y === "Feature", X = E ? o.features.length : 1, C = 0; C < X; C++) {
      h = E ? o.features[C].geometry : k ? o.geometry : o, d = h ? h.type === "GeometryCollection" : !1, a = d ? h.geometries.length : 1;
      for (var m = 0; m < a; m++) {
        var v = 0, l = 0;
        if (s = d ? h.geometries[m] : h, s !== null) {
          c = s.coordinates;
          var g = s.type;
          switch (u = e && (g === "Polygon" || g === "MultiPolygon") ? 1 : 0, g) {
            case null:
              break;
            case "Point":
              if (t(
                c,
                f,
                C,
                v,
                l
              ) === !1)
                return !1;
              f++, v++;
              break;
            case "LineString":
            case "MultiPoint":
              for (n = 0; n < c.length; n++) {
                if (t(
                  c[n],
                  f,
                  C,
                  v,
                  l
                ) === !1)
                  return !1;
                f++, g === "MultiPoint" && v++;
              }
              g === "LineString" && v++;
              break;
            case "Polygon":
            case "MultiLineString":
              for (n = 0; n < c.length; n++) {
                for (r = 0; r < c[n].length - u; r++) {
                  if (t(
                    c[n][r],
                    f,
                    C,
                    v,
                    l
                  ) === !1)
                    return !1;
                  f++;
                }
                g === "MultiLineString" && v++, g === "Polygon" && l++;
              }
              g === "Polygon" && v++;
              break;
            case "MultiPolygon":
              for (n = 0; n < c.length; n++) {
                for (l = 0, r = 0; r < c[n].length; r++) {
                  for (i = 0; i < c[n][r].length - u; i++) {
                    if (t(
                      c[n][r][i],
                      f,
                      C,
                      v,
                      l
                    ) === !1)
                      return !1;
                    f++;
                  }
                  l++;
                }
                v++;
              }
              break;
            case "GeometryCollection":
              for (n = 0; n < s.geometries.length; n++)
                if (rn(s.geometries[n], t, e) === !1)
                  return !1;
              break;
            default:
              throw new Error("Unknown Geometry Type");
          }
        }
      }
    }
}
function hr(o, t = {}) {
  let e = 0, n = 0, r = 0;
  return rn(
    o,
    function(i) {
      e += i[0], n += i[1], r++;
    },
    !0
  ), de([e / r, n / r], t.properties);
}
var fr = hr;
function ur(o) {
  return o && o.__esModule && Object.prototype.hasOwnProperty.call(o, "default") ? o.default : o;
}
function lr(o) {
  if (Object.prototype.hasOwnProperty.call(o, "__esModule")) return o;
  var t = o.default;
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
  return Object.defineProperty(e, "__esModule", { value: !0 }), Object.keys(o).forEach(function(n) {
    var r = Object.getOwnPropertyDescriptor(o, n);
    Object.defineProperty(e, n, r.get ? r : {
      enumerable: !0,
      get: function() {
        return o[n];
      }
    });
  }), e;
}
var Oe = { exports: {} }, $e = { exports: {} }, pr = $e.exports, pn;
function dr() {
  return pn || (pn = 1, (function(o, t) {
    (function(e, n) {
      o.exports = n();
    })(pr, function() {
      function e(m, v, l, g, x) {
        (function A(I, b, T, R, D) {
          for (; R > T; ) {
            if (R - T > 600) {
              var Q = R - T + 1, p = b - T + 1, M = Math.log(Q), _ = 0.5 * Math.exp(2 * M / 3), B = 0.5 * Math.sqrt(M * _ * (Q - _) / Q) * (p - Q / 2 < 0 ? -1 : 1), N = Math.max(T, Math.floor(b - p * _ / Q + B)), Y = Math.min(R, Math.floor(b + (Q - p) * _ / Q + B));
              A(I, b, N, Y, D);
            }
            var w = I[b], O = T, $ = R;
            for (n(I, T, b), D(I[R], w) > 0 && n(I, T, R); O < $; ) {
              for (n(I, O, $), O++, $--; D(I[O], w) < 0; ) O++;
              for (; D(I[$], w) > 0; ) $--;
            }
            D(I[T], w) === 0 ? n(I, T, $) : n(I, ++$, R), $ <= b && (T = $ + 1), b <= $ && (R = $ - 1);
          }
        })(m, v, l || 0, g || m.length - 1, x || r);
      }
      function n(m, v, l) {
        var g = m[v];
        m[v] = m[l], m[l] = g;
      }
      function r(m, v) {
        return m < v ? -1 : m > v ? 1 : 0;
      }
      var i = function(m) {
        m === void 0 && (m = 9), this._maxEntries = Math.max(4, m), this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries)), this.clear();
      };
      function s(m, v, l) {
        if (!l) return v.indexOf(m);
        for (var g = 0; g < v.length; g++) if (l(m, v[g])) return g;
        return -1;
      }
      function a(m, v) {
        c(m, 0, m.children.length, v, m);
      }
      function c(m, v, l, g, x) {
        x || (x = X(null)), x.minX = 1 / 0, x.minY = 1 / 0, x.maxX = -1 / 0, x.maxY = -1 / 0;
        for (var A = v; A < l; A++) {
          var I = m.children[A];
          h(x, m.leaf ? g(I) : I);
        }
        return x;
      }
      function h(m, v) {
        return m.minX = Math.min(m.minX, v.minX), m.minY = Math.min(m.minY, v.minY), m.maxX = Math.max(m.maxX, v.maxX), m.maxY = Math.max(m.maxY, v.maxY), m;
      }
      function u(m, v) {
        return m.minX - v.minX;
      }
      function f(m, v) {
        return m.minY - v.minY;
      }
      function d(m) {
        return (m.maxX - m.minX) * (m.maxY - m.minY);
      }
      function y(m) {
        return m.maxX - m.minX + (m.maxY - m.minY);
      }
      function E(m, v) {
        return m.minX <= v.minX && m.minY <= v.minY && v.maxX <= m.maxX && v.maxY <= m.maxY;
      }
      function k(m, v) {
        return v.minX <= m.maxX && v.minY <= m.maxY && v.maxX >= m.minX && v.maxY >= m.minY;
      }
      function X(m) {
        return { children: m, height: 1, leaf: !0, minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
      }
      function C(m, v, l, g, x) {
        for (var A = [v, l]; A.length; ) if (!((l = A.pop()) - (v = A.pop()) <= g)) {
          var I = v + Math.ceil((l - v) / g / 2) * g;
          e(m, I, v, l, x), A.push(v, I, I, l);
        }
      }
      return i.prototype.all = function() {
        return this._all(this.data, []);
      }, i.prototype.search = function(m) {
        var v = this.data, l = [];
        if (!k(m, v)) return l;
        for (var g = this.toBBox, x = []; v; ) {
          for (var A = 0; A < v.children.length; A++) {
            var I = v.children[A], b = v.leaf ? g(I) : I;
            k(m, b) && (v.leaf ? l.push(I) : E(m, b) ? this._all(I, l) : x.push(I));
          }
          v = x.pop();
        }
        return l;
      }, i.prototype.collides = function(m) {
        var v = this.data;
        if (!k(m, v)) return !1;
        for (var l = []; v; ) {
          for (var g = 0; g < v.children.length; g++) {
            var x = v.children[g], A = v.leaf ? this.toBBox(x) : x;
            if (k(m, A)) {
              if (v.leaf || E(m, A)) return !0;
              l.push(x);
            }
          }
          v = l.pop();
        }
        return !1;
      }, i.prototype.load = function(m) {
        if (!m || !m.length) return this;
        if (m.length < this._minEntries) {
          for (var v = 0; v < m.length; v++) this.insert(m[v]);
          return this;
        }
        var l = this._build(m.slice(), 0, m.length - 1, 0);
        if (this.data.children.length) if (this.data.height === l.height) this._splitRoot(this.data, l);
        else {
          if (this.data.height < l.height) {
            var g = this.data;
            this.data = l, l = g;
          }
          this._insert(l, this.data.height - l.height - 1, !0);
        }
        else this.data = l;
        return this;
      }, i.prototype.insert = function(m) {
        return m && this._insert(m, this.data.height - 1), this;
      }, i.prototype.clear = function() {
        return this.data = X([]), this;
      }, i.prototype.remove = function(m, v) {
        if (!m) return this;
        for (var l, g, x, A = this.data, I = this.toBBox(m), b = [], T = []; A || b.length; ) {
          if (A || (A = b.pop(), g = b[b.length - 1], l = T.pop(), x = !0), A.leaf) {
            var R = s(m, A.children, v);
            if (R !== -1) return A.children.splice(R, 1), b.push(A), this._condense(b), this;
          }
          x || A.leaf || !E(A, I) ? g ? (l++, A = g.children[l], x = !1) : A = null : (b.push(A), T.push(l), l = 0, g = A, A = A.children[0]);
        }
        return this;
      }, i.prototype.toBBox = function(m) {
        return m;
      }, i.prototype.compareMinX = function(m, v) {
        return m.minX - v.minX;
      }, i.prototype.compareMinY = function(m, v) {
        return m.minY - v.minY;
      }, i.prototype.toJSON = function() {
        return this.data;
      }, i.prototype.fromJSON = function(m) {
        return this.data = m, this;
      }, i.prototype._all = function(m, v) {
        for (var l = []; m; ) m.leaf ? v.push.apply(v, m.children) : l.push.apply(l, m.children), m = l.pop();
        return v;
      }, i.prototype._build = function(m, v, l, g) {
        var x, A = l - v + 1, I = this._maxEntries;
        if (A <= I) return a(x = X(m.slice(v, l + 1)), this.toBBox), x;
        g || (g = Math.ceil(Math.log(A) / Math.log(I)), I = Math.ceil(A / Math.pow(I, g - 1))), (x = X([])).leaf = !1, x.height = g;
        var b = Math.ceil(A / I), T = b * Math.ceil(Math.sqrt(I));
        C(m, v, l, T, this.compareMinX);
        for (var R = v; R <= l; R += T) {
          var D = Math.min(R + T - 1, l);
          C(m, R, D, b, this.compareMinY);
          for (var Q = R; Q <= D; Q += b) {
            var p = Math.min(Q + b - 1, D);
            x.children.push(this._build(m, Q, p, g - 1));
          }
        }
        return a(x, this.toBBox), x;
      }, i.prototype._chooseSubtree = function(m, v, l, g) {
        for (; g.push(v), !v.leaf && g.length - 1 !== l; ) {
          for (var x = 1 / 0, A = 1 / 0, I = void 0, b = 0; b < v.children.length; b++) {
            var T = v.children[b], R = d(T), D = (Q = m, p = T, (Math.max(p.maxX, Q.maxX) - Math.min(p.minX, Q.minX)) * (Math.max(p.maxY, Q.maxY) - Math.min(p.minY, Q.minY)) - R);
            D < A ? (A = D, x = R < x ? R : x, I = T) : D === A && R < x && (x = R, I = T);
          }
          v = I || v.children[0];
        }
        var Q, p;
        return v;
      }, i.prototype._insert = function(m, v, l) {
        var g = l ? m : this.toBBox(m), x = [], A = this._chooseSubtree(g, this.data, v, x);
        for (A.children.push(m), h(A, g); v >= 0 && x[v].children.length > this._maxEntries; ) this._split(x, v), v--;
        this._adjustParentBBoxes(g, x, v);
      }, i.prototype._split = function(m, v) {
        var l = m[v], g = l.children.length, x = this._minEntries;
        this._chooseSplitAxis(l, x, g);
        var A = this._chooseSplitIndex(l, x, g), I = X(l.children.splice(A, l.children.length - A));
        I.height = l.height, I.leaf = l.leaf, a(l, this.toBBox), a(I, this.toBBox), v ? m[v - 1].children.push(I) : this._splitRoot(l, I);
      }, i.prototype._splitRoot = function(m, v) {
        this.data = X([m, v]), this.data.height = m.height + 1, this.data.leaf = !1, a(this.data, this.toBBox);
      }, i.prototype._chooseSplitIndex = function(m, v, l) {
        for (var g, x, A, I, b, T, R, D = 1 / 0, Q = 1 / 0, p = v; p <= l - v; p++) {
          var M = c(m, 0, p, this.toBBox), _ = c(m, p, l, this.toBBox), B = (x = M, A = _, I = void 0, b = void 0, T = void 0, R = void 0, I = Math.max(x.minX, A.minX), b = Math.max(x.minY, A.minY), T = Math.min(x.maxX, A.maxX), R = Math.min(x.maxY, A.maxY), Math.max(0, T - I) * Math.max(0, R - b)), N = d(M) + d(_);
          B < D ? (D = B, g = p, Q = N < Q ? N : Q) : B === D && N < Q && (Q = N, g = p);
        }
        return g || l - v;
      }, i.prototype._chooseSplitAxis = function(m, v, l) {
        var g = m.leaf ? this.compareMinX : u, x = m.leaf ? this.compareMinY : f;
        this._allDistMargin(m, v, l, g) < this._allDistMargin(m, v, l, x) && m.children.sort(g);
      }, i.prototype._allDistMargin = function(m, v, l, g) {
        m.children.sort(g);
        for (var x = this.toBBox, A = c(m, 0, v, x), I = c(m, l - v, l, x), b = y(A) + y(I), T = v; T < l - v; T++) {
          var R = m.children[T];
          h(A, m.leaf ? x(R) : R), b += y(A);
        }
        for (var D = l - v - 1; D >= v; D--) {
          var Q = m.children[D];
          h(I, m.leaf ? x(Q) : Q), b += y(I);
        }
        return b;
      }, i.prototype._adjustParentBBoxes = function(m, v, l) {
        for (var g = l; g >= 0; g--) h(v[g], m);
      }, i.prototype._condense = function(m) {
        for (var v = m.length - 1, l = void 0; v >= 0; v--) m[v].children.length === 0 ? v > 0 ? (l = m[v - 1].children).splice(l.indexOf(m[v]), 1) : this.clear() : a(m[v], this.toBBox);
      }, i;
    });
  })($e)), $e.exports;
}
let mr = class {
  constructor(t = [], e = gr) {
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
      const i = t - 1 >> 1, s = e[i];
      if (n(r, s) >= 0) break;
      e[t] = s, t = i;
    }
    e[t] = r;
  }
  _down(t) {
    const { data: e, compare: n } = this, r = this.length >> 1, i = e[t];
    for (; t < r; ) {
      let s = (t << 1) + 1, a = e[s];
      const c = s + 1;
      if (c < this.length && n(e[c], a) < 0 && (s = c, a = e[c]), n(a, i) >= 0) break;
      e[t] = a, t = s;
    }
    e[t] = i;
  }
};
function gr(o, t) {
  return o < t ? -1 : o > t ? 1 : 0;
}
const wr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: mr
}, Symbol.toStringTag, { value: "Module" })), yr = /* @__PURE__ */ lr(wr);
var be = { exports: {} }, Ze, dn;
function vr() {
  return dn || (dn = 1, Ze = function(t, e, n, r) {
    var i = t[0], s = t[1], a = !1;
    n === void 0 && (n = 0), r === void 0 && (r = e.length);
    for (var c = (r - n) / 2, h = 0, u = c - 1; h < c; u = h++) {
      var f = e[n + h * 2 + 0], d = e[n + h * 2 + 1], y = e[n + u * 2 + 0], E = e[n + u * 2 + 1], k = d > s != E > s && i < (y - f) * (s - d) / (E - d) + f;
      k && (a = !a);
    }
    return a;
  }), Ze;
}
var tn, mn;
function br() {
  return mn || (mn = 1, tn = function(t, e, n, r) {
    var i = t[0], s = t[1], a = !1;
    n === void 0 && (n = 0), r === void 0 && (r = e.length);
    for (var c = r - n, h = 0, u = c - 1; h < c; u = h++) {
      var f = e[h + n][0], d = e[h + n][1], y = e[u + n][0], E = e[u + n][1], k = d > s != E > s && i < (y - f) * (s - d) / (E - d) + f;
      k && (a = !a);
    }
    return a;
  }), tn;
}
var gn;
function _r() {
  if (gn) return be.exports;
  gn = 1;
  var o = vr(), t = br();
  return be.exports = function(n, r, i, s) {
    return r.length > 0 && Array.isArray(r[0]) ? t(n, r, i, s) : o(n, r, i, s);
  }, be.exports.nested = t, be.exports.flat = o, be.exports;
}
var xe = { exports: {} }, xr = xe.exports, wn;
function Mr() {
  return wn || (wn = 1, (function(o, t) {
    (function(e, n) {
      n(t);
    })(xr, function(e) {
      const r = 33306690738754706e-32;
      function i(k, X, C, m, v) {
        let l, g, x, A, I = X[0], b = m[0], T = 0, R = 0;
        b > I == b > -I ? (l = I, I = X[++T]) : (l = b, b = m[++R]);
        let D = 0;
        if (T < k && R < C) for (b > I == b > -I ? (x = l - ((g = I + l) - I), I = X[++T]) : (x = l - ((g = b + l) - b), b = m[++R]), l = g, x !== 0 && (v[D++] = x); T < k && R < C; ) b > I == b > -I ? (x = l - ((g = l + I) - (A = g - l)) + (I - A), I = X[++T]) : (x = l - ((g = l + b) - (A = g - l)) + (b - A), b = m[++R]), l = g, x !== 0 && (v[D++] = x);
        for (; T < k; ) x = l - ((g = l + I) - (A = g - l)) + (I - A), I = X[++T], l = g, x !== 0 && (v[D++] = x);
        for (; R < C; ) x = l - ((g = l + b) - (A = g - l)) + (b - A), b = m[++R], l = g, x !== 0 && (v[D++] = x);
        return l === 0 && D !== 0 || (v[D++] = l), D;
      }
      function s(k) {
        return new Float64Array(k);
      }
      const a = 33306690738754716e-32, c = 22204460492503146e-32, h = 11093356479670487e-47, u = s(4), f = s(8), d = s(12), y = s(16), E = s(4);
      e.orient2d = function(k, X, C, m, v, l) {
        const g = (X - l) * (C - v), x = (k - v) * (m - l), A = g - x;
        if (g === 0 || x === 0 || g > 0 != x > 0) return A;
        const I = Math.abs(g + x);
        return Math.abs(A) >= a * I ? A : -(function(b, T, R, D, Q, p, M) {
          let _, B, N, Y, w, O, $, q, V, z, K, j, ct, ht, lt, dt, gt, mt;
          const Pt = b - Q, Tt = R - Q, xt = T - p, Mt = D - p;
          w = (lt = (q = Pt - ($ = (O = 134217729 * Pt) - (O - Pt))) * (z = Mt - (V = (O = 134217729 * Mt) - (O - Mt))) - ((ht = Pt * Mt) - $ * V - q * V - $ * z)) - (K = lt - (gt = (q = xt - ($ = (O = 134217729 * xt) - (O - xt))) * (z = Tt - (V = (O = 134217729 * Tt) - (O - Tt))) - ((dt = xt * Tt) - $ * V - q * V - $ * z))), u[0] = lt - (K + w) + (w - gt), w = (ct = ht - ((j = ht + K) - (w = j - ht)) + (K - w)) - (K = ct - dt), u[1] = ct - (K + w) + (w - dt), w = (mt = j + K) - j, u[2] = j - (mt - w) + (K - w), u[3] = mt;
          let Gt = (function(S, P) {
            let F = P[0];
            for (let L = 1; L < S; L++) F += P[L];
            return F;
          })(4, u), ce = c * M;
          if (Gt >= ce || -Gt >= ce || (_ = b - (Pt + (w = b - Pt)) + (w - Q), N = R - (Tt + (w = R - Tt)) + (w - Q), B = T - (xt + (w = T - xt)) + (w - p), Y = D - (Mt + (w = D - Mt)) + (w - p), _ === 0 && B === 0 && N === 0 && Y === 0) || (ce = h * M + r * Math.abs(Gt), (Gt += Pt * Y + Mt * _ - (xt * N + Tt * B)) >= ce || -Gt >= ce)) return Gt;
          w = (lt = (q = _ - ($ = (O = 134217729 * _) - (O - _))) * (z = Mt - (V = (O = 134217729 * Mt) - (O - Mt))) - ((ht = _ * Mt) - $ * V - q * V - $ * z)) - (K = lt - (gt = (q = B - ($ = (O = 134217729 * B) - (O - B))) * (z = Tt - (V = (O = 134217729 * Tt) - (O - Tt))) - ((dt = B * Tt) - $ * V - q * V - $ * z))), E[0] = lt - (K + w) + (w - gt), w = (ct = ht - ((j = ht + K) - (w = j - ht)) + (K - w)) - (K = ct - dt), E[1] = ct - (K + w) + (w - dt), w = (mt = j + K) - j, E[2] = j - (mt - w) + (K - w), E[3] = mt;
          const je = i(4, u, 4, E, f);
          w = (lt = (q = Pt - ($ = (O = 134217729 * Pt) - (O - Pt))) * (z = Y - (V = (O = 134217729 * Y) - (O - Y))) - ((ht = Pt * Y) - $ * V - q * V - $ * z)) - (K = lt - (gt = (q = xt - ($ = (O = 134217729 * xt) - (O - xt))) * (z = N - (V = (O = 134217729 * N) - (O - N))) - ((dt = xt * N) - $ * V - q * V - $ * z))), E[0] = lt - (K + w) + (w - gt), w = (ct = ht - ((j = ht + K) - (w = j - ht)) + (K - w)) - (K = ct - dt), E[1] = ct - (K + w) + (w - dt), w = (mt = j + K) - j, E[2] = j - (mt - w) + (K - w), E[3] = mt;
          const ze = i(je, f, 4, E, d);
          w = (lt = (q = _ - ($ = (O = 134217729 * _) - (O - _))) * (z = Y - (V = (O = 134217729 * Y) - (O - Y))) - ((ht = _ * Y) - $ * V - q * V - $ * z)) - (K = lt - (gt = (q = B - ($ = (O = 134217729 * B) - (O - B))) * (z = N - (V = (O = 134217729 * N) - (O - N))) - ((dt = B * N) - $ * V - q * V - $ * z))), E[0] = lt - (K + w) + (w - gt), w = (ct = ht - ((j = ht + K) - (w = j - ht)) + (K - w)) - (K = ct - dt), E[1] = ct - (K + w) + (w - dt), w = (mt = j + K) - j, E[2] = j - (mt - w) + (K - w), E[3] = mt;
          const qt = i(ze, d, 4, E, y);
          return y[qt - 1];
        })(k, X, C, m, v, l, I);
      }, e.orient2dfast = function(k, X, C, m, v, l) {
        return (X - l) * (C - v) - (k - v) * (m - l);
      }, Object.defineProperty(e, "__esModule", { value: !0 });
    });
  })(xe, xe.exports)), xe.exports;
}
var yn;
function kr() {
  if (yn) return Oe.exports;
  yn = 1;
  var o = dr(), t = yr, e = _r(), n = Mr().orient2d;
  t.default && (t = t.default), Oe.exports = r, Oe.exports.default = r;
  function r(l, g, x) {
    g = Math.max(0, g === void 0 ? 2 : g), x = x || 0;
    var A = y(l), I = new o(16);
    I.toBBox = function($) {
      return {
        minX: $[0],
        minY: $[1],
        maxX: $[0],
        maxY: $[1]
      };
    }, I.compareMinX = function($, q) {
      return $[0] - q[0];
    }, I.compareMinY = function($, q) {
      return $[1] - q[1];
    }, I.load(l);
    for (var b = [], T = 0, R; T < A.length; T++) {
      var D = A[T];
      I.remove(D), R = E(D, R), b.push(R);
    }
    var Q = new o(16);
    for (T = 0; T < b.length; T++) Q.insert(d(b[T]));
    for (var p = g * g, M = x * x; b.length; ) {
      var _ = b.shift(), B = _.p, N = _.next.p, Y = k(B, N);
      if (!(Y < M)) {
        var w = Y / p;
        D = i(I, _.prev.p, B, N, _.next.next.p, w, Q), D && Math.min(k(D, B), k(D, N)) <= w && (b.push(_), b.push(E(D, _)), I.remove(D), Q.remove(_), Q.insert(d(_)), Q.insert(d(_.next)));
      }
    }
    _ = R;
    var O = [];
    do
      O.push(_.p), _ = _.next;
    while (_ !== R);
    return O.push(_.p), O;
  }
  function i(l, g, x, A, I, b, T) {
    for (var R = new t([], s), D = l.data; D; ) {
      for (var Q = 0; Q < D.children.length; Q++) {
        var p = D.children[Q], M = D.leaf ? X(p, x, A) : a(x, A, p);
        M > b || R.push({
          node: p,
          dist: M
        });
      }
      for (; R.length && !R.peek().node.children; ) {
        var _ = R.pop(), B = _.node, N = X(B, g, x), Y = X(B, A, I);
        if (_.dist < N && _.dist < Y && h(x, B, T) && h(A, B, T)) return B;
      }
      D = R.pop(), D && (D = D.node);
    }
    return null;
  }
  function s(l, g) {
    return l.dist - g.dist;
  }
  function a(l, g, x) {
    if (c(l, x) || c(g, x)) return 0;
    var A = C(l[0], l[1], g[0], g[1], x.minX, x.minY, x.maxX, x.minY);
    if (A === 0) return 0;
    var I = C(l[0], l[1], g[0], g[1], x.minX, x.minY, x.minX, x.maxY);
    if (I === 0) return 0;
    var b = C(l[0], l[1], g[0], g[1], x.maxX, x.minY, x.maxX, x.maxY);
    if (b === 0) return 0;
    var T = C(l[0], l[1], g[0], g[1], x.minX, x.maxY, x.maxX, x.maxY);
    return T === 0 ? 0 : Math.min(A, I, b, T);
  }
  function c(l, g) {
    return l[0] >= g.minX && l[0] <= g.maxX && l[1] >= g.minY && l[1] <= g.maxY;
  }
  function h(l, g, x) {
    for (var A = Math.min(l[0], g[0]), I = Math.min(l[1], g[1]), b = Math.max(l[0], g[0]), T = Math.max(l[1], g[1]), R = x.search({ minX: A, minY: I, maxX: b, maxY: T }), D = 0; D < R.length; D++)
      if (f(R[D].p, R[D].next.p, l, g)) return !1;
    return !0;
  }
  function u(l, g, x) {
    return n(l[0], l[1], g[0], g[1], x[0], x[1]);
  }
  function f(l, g, x, A) {
    return l !== A && g !== x && u(l, g, x) > 0 != u(l, g, A) > 0 && u(x, A, l) > 0 != u(x, A, g) > 0;
  }
  function d(l) {
    var g = l.p, x = l.next.p;
    return l.minX = Math.min(g[0], x[0]), l.minY = Math.min(g[1], x[1]), l.maxX = Math.max(g[0], x[0]), l.maxY = Math.max(g[1], x[1]), l;
  }
  function y(l) {
    for (var g = l[0], x = l[0], A = l[0], I = l[0], b = 0; b < l.length; b++) {
      var T = l[b];
      T[0] < g[0] && (g = T), T[0] > A[0] && (A = T), T[1] < x[1] && (x = T), T[1] > I[1] && (I = T);
    }
    var R = [g, x, A, I], D = R.slice();
    for (b = 0; b < l.length; b++)
      e(l[b], R) || D.push(l[b]);
    return v(D);
  }
  function E(l, g) {
    var x = {
      p: l,
      prev: null,
      next: null,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };
    return g ? (x.next = g.next, x.prev = g, g.next.prev = x, g.next = x) : (x.prev = x, x.next = x), x;
  }
  function k(l, g) {
    var x = l[0] - g[0], A = l[1] - g[1];
    return x * x + A * A;
  }
  function X(l, g, x) {
    var A = g[0], I = g[1], b = x[0] - A, T = x[1] - I;
    if (b !== 0 || T !== 0) {
      var R = ((l[0] - A) * b + (l[1] - I) * T) / (b * b + T * T);
      R > 1 ? (A = x[0], I = x[1]) : R > 0 && (A += b * R, I += T * R);
    }
    return b = l[0] - A, T = l[1] - I, b * b + T * T;
  }
  function C(l, g, x, A, I, b, T, R) {
    var D = x - l, Q = A - g, p = T - I, M = R - b, _ = l - I, B = g - b, N = D * D + Q * Q, Y = D * p + Q * M, w = p * p + M * M, O = D * _ + Q * B, $ = p * _ + M * B, q = N * w - Y * Y, V, z, K, j, ct = q, ht = q;
    q === 0 ? (z = 0, ct = 1, j = $, ht = w) : (z = Y * $ - w * O, j = N * $ - Y * O, z < 0 ? (z = 0, j = $, ht = w) : z > ct && (z = ct, j = $ + Y, ht = w)), j < 0 ? (j = 0, -O < 0 ? z = 0 : -O > N ? z = ct : (z = -O, ct = N)) : j > ht && (j = ht, -O + Y < 0 ? z = 0 : -O + Y > N ? z = ct : (z = -O + Y, ct = N)), V = z === 0 ? 0 : z / ct, K = j === 0 ? 0 : j / ht;
    var lt = (1 - V) * l + V * x, dt = (1 - V) * g + V * A, gt = (1 - K) * I + K * T, mt = (1 - K) * b + K * R, Pt = gt - lt, Tt = mt - dt;
    return Pt * Pt + Tt * Tt;
  }
  function m(l, g) {
    return l[0] === g[0] ? l[1] - g[1] : l[0] - g[0];
  }
  function v(l) {
    l.sort(m);
    for (var g = [], x = 0; x < l.length; x++) {
      for (; g.length >= 2 && u(g[g.length - 2], g[g.length - 1], l[x]) <= 0; )
        g.pop();
      g.push(l[x]);
    }
    for (var A = [], I = l.length - 1; I >= 0; I--) {
      for (; A.length >= 2 && u(A[A.length - 2], A[A.length - 1], l[I]) <= 0; )
        A.pop();
      A.push(l[I]);
    }
    return A.pop(), g.pop(), g.concat(A);
  }
  return Oe.exports;
}
var Sr = kr();
const Er = /* @__PURE__ */ ur(Sr);
function Ar(o, t = {}) {
  t.concavity = t.concavity || 1 / 0;
  const e = [];
  if (rn(o, (r) => {
    e.push([r[0], r[1]]);
  }), !e.length)
    return null;
  const n = Er(e, t.concavity);
  return n.length > 3 ? Ee([n]) : null;
}
var vn = Ar, Me = { exports: {} }, Pr = Me.exports, bn;
function Br() {
  return bn || (bn = 1, (function(o, t) {
    (function(e, n) {
      n(t);
    })(Pr, function(e) {
      const n = 11102230246251565e-32, r = 134217729, i = (3 + 8 * n) * n;
      function s(S, P, F, L, tt) {
        let G, et, st, it, at = P[0], ft = L[0], J = 0, Z = 0;
        ft > at == ft > -at ? (G = at, at = P[++J]) : (G = ft, ft = L[++Z]);
        let ut = 0;
        if (J < S && Z < F) for (ft > at == ft > -at ? (et = at + G, st = G - (et - at), at = P[++J]) : (et = ft + G, st = G - (et - ft), ft = L[++Z]), G = et, st !== 0 && (tt[ut++] = st); J < S && Z < F; ) ft > at == ft > -at ? (et = G + at, it = et - G, st = G - (et - it) + (at - it), at = P[++J]) : (et = G + ft, it = et - G, st = G - (et - it) + (ft - it), ft = L[++Z]), G = et, st !== 0 && (tt[ut++] = st);
        for (; J < S; ) et = G + at, it = et - G, st = G - (et - it) + (at - it), at = P[++J], G = et, st !== 0 && (tt[ut++] = st);
        for (; Z < F; ) et = G + ft, it = et - G, st = G - (et - it) + (ft - it), ft = L[++Z], G = et, st !== 0 && (tt[ut++] = st);
        return (G !== 0 || ut === 0) && (tt[ut++] = G), ut;
      }
      function a(S, P) {
        let F = P[0];
        for (let L = 1; L < S; L++) F += P[L];
        return F;
      }
      function c(S) {
        return new Float64Array(S);
      }
      const h = (3 + 16 * n) * n, u = (2 + 12 * n) * n, f = (9 + 64 * n) * n * n, d = c(4), y = c(8), E = c(12), k = c(16), X = c(4);
      function C(S, P, F, L, tt, G, et) {
        let st, it, at, ft, J, Z, ut, _t, nt, H, W, wt, Et, At, Nt, yt, Bt, Rt;
        const zt = S - tt, Vt = F - tt, Wt = P - G, Jt = L - G;
        At = zt * Jt, Z = r * zt, ut = Z - (Z - zt), _t = zt - ut, Z = r * Jt, nt = Z - (Z - Jt), H = Jt - nt, Nt = _t * H - (At - ut * nt - _t * nt - ut * H), yt = Wt * Vt, Z = r * Wt, ut = Z - (Z - Wt), _t = Wt - ut, Z = r * Vt, nt = Z - (Z - Vt), H = Vt - nt, Bt = _t * H - (yt - ut * nt - _t * nt - ut * H), W = Nt - Bt, J = Nt - W, d[0] = Nt - (W + J) + (J - Bt), wt = At + W, J = wt - At, Et = At - (wt - J) + (W - J), W = Et - yt, J = Et - W, d[1] = Et - (W + J) + (J - yt), Rt = wt + W, J = Rt - wt, d[2] = wt - (Rt - J) + (W - J), d[3] = Rt;
        let he = a(4, d), ve = u * et;
        if (he >= ve || -he >= ve || (J = S - zt, st = S - (zt + J) + (J - tt), J = F - Vt, at = F - (Vt + J) + (J - tt), J = P - Wt, it = P - (Wt + J) + (J - G), J = L - Jt, ft = L - (Jt + J) + (J - G), st === 0 && it === 0 && at === 0 && ft === 0) || (ve = f * et + i * Math.abs(he), he += zt * ft + Jt * st - (Wt * at + Vt * it), he >= ve || -he >= ve)) return he;
        At = st * Jt, Z = r * st, ut = Z - (Z - st), _t = st - ut, Z = r * Jt, nt = Z - (Z - Jt), H = Jt - nt, Nt = _t * H - (At - ut * nt - _t * nt - ut * H), yt = it * Vt, Z = r * it, ut = Z - (Z - it), _t = it - ut, Z = r * Vt, nt = Z - (Z - Vt), H = Vt - nt, Bt = _t * H - (yt - ut * nt - _t * nt - ut * H), W = Nt - Bt, J = Nt - W, X[0] = Nt - (W + J) + (J - Bt), wt = At + W, J = wt - At, Et = At - (wt - J) + (W - J), W = Et - yt, J = Et - W, X[1] = Et - (W + J) + (J - yt), Rt = wt + W, J = Rt - wt, X[2] = wt - (Rt - J) + (W - J), X[3] = Rt;
        const zn = s(4, d, 4, X, y);
        At = zt * ft, Z = r * zt, ut = Z - (Z - zt), _t = zt - ut, Z = r * ft, nt = Z - (Z - ft), H = ft - nt, Nt = _t * H - (At - ut * nt - _t * nt - ut * H), yt = Wt * at, Z = r * Wt, ut = Z - (Z - Wt), _t = Wt - ut, Z = r * at, nt = Z - (Z - at), H = at - nt, Bt = _t * H - (yt - ut * nt - _t * nt - ut * H), W = Nt - Bt, J = Nt - W, X[0] = Nt - (W + J) + (J - Bt), wt = At + W, J = wt - At, Et = At - (wt - J) + (W - J), W = Et - yt, J = Et - W, X[1] = Et - (W + J) + (J - yt), Rt = wt + W, J = Rt - wt, X[2] = wt - (Rt - J) + (W - J), X[3] = Rt;
        const Vn = s(zn, y, 4, X, E);
        At = st * ft, Z = r * st, ut = Z - (Z - st), _t = st - ut, Z = r * ft, nt = Z - (Z - ft), H = ft - nt, Nt = _t * H - (At - ut * nt - _t * nt - ut * H), yt = it * at, Z = r * it, ut = Z - (Z - it), _t = it - ut, Z = r * at, nt = Z - (Z - at), H = at - nt, Bt = _t * H - (yt - ut * nt - _t * nt - ut * H), W = Nt - Bt, J = Nt - W, X[0] = Nt - (W + J) + (J - Bt), wt = At + W, J = wt - At, Et = At - (wt - J) + (W - J), W = Et - yt, J = Et - W, X[1] = Et - (W + J) + (J - yt), Rt = wt + W, J = Rt - wt, X[2] = wt - (Rt - J) + (W - J), X[3] = Rt;
        const Wn = s(Vn, E, 4, X, k);
        return k[Wn - 1];
      }
      function m(S, P, F, L, tt, G) {
        const et = (P - G) * (F - tt), st = (S - tt) * (L - G), it = et - st, at = Math.abs(et + st);
        return Math.abs(it) >= h * at ? it : -C(S, P, F, L, tt, G, at);
      }
      function v(S, P) {
        var F, L, tt = 0, G, et, st, it, at, ft, J, Z = S[0], ut = S[1], _t = P.length;
        for (F = 0; F < _t; F++) {
          L = 0;
          var nt = P[F], H = nt.length - 1;
          if (ft = nt[0], ft[0] !== nt[H][0] && ft[1] !== nt[H][1]) throw new Error("First and last coordinates in a ring must be the same");
          for (et = ft[0] - Z, st = ft[1] - ut, L; L < H; L++) {
            if (J = nt[L + 1], it = J[0] - Z, at = J[1] - ut, st === 0 && at === 0) {
              if (it <= 0 && et >= 0 || et <= 0 && it >= 0) return 0;
            } else if (at >= 0 && st <= 0 || at <= 0 && st >= 0) {
              if (G = m(et, it, st, at, 0, 0), G === 0) return 0;
              (G > 0 && at > 0 && st <= 0 || G < 0 && at <= 0 && st > 0) && tt++;
            }
            ft = J, st = at, et = it;
          }
        }
        return tt % 2 !== 0;
      }
      function l(S, P, F = {}) {
        const L = { type: "Feature" };
        return (F.id === 0 || F.id) && (L.id = F.id), F.bbox && (L.bbox = F.bbox), L.properties = P || {}, L.geometry = S, L;
      }
      function g(S, P, F = {}) {
        if (!S) throw new Error("coordinates is required");
        if (!Array.isArray(S)) throw new Error("coordinates must be an Array");
        if (S.length < 2) throw new Error("coordinates must be at least 2 numbers long");
        if (!I(S[0]) || !I(S[1])) throw new Error("coordinates must contain numbers");
        return l({ type: "Point", coordinates: S }, P, F);
      }
      function x(S, P, F = {}) {
        for (const L of S) {
          if (L.length < 4) throw new Error("Each LinearRing of a Polygon must have 4 or more Positions.");
          if (L[L.length - 1].length !== L[0].length) throw new Error("First and last Position are not equivalent.");
          for (let tt = 0; tt < L[L.length - 1].length; tt++) if (L[L.length - 1][tt] !== L[0][tt]) throw new Error("First and last Position are not equivalent.");
        }
        return l({ type: "Polygon", coordinates: S }, P, F);
      }
      function A(S, P = {}) {
        const F = { type: "FeatureCollection" };
        return P.id && (F.id = P.id), P.bbox && (F.bbox = P.bbox), F.features = S, F;
      }
      function I(S) {
        return !isNaN(S) && S !== null && !Array.isArray(S);
      }
      function b(S) {
        if (!S) throw new Error("coord is required");
        if (!Array.isArray(S)) {
          if (S.type === "Feature" && S.geometry !== null && S.geometry.type === "Point") return [...S.geometry.coordinates];
          if (S.type === "Point") return [...S.coordinates];
        }
        if (Array.isArray(S) && S.length >= 2 && !Array.isArray(S[0]) && !Array.isArray(S[1])) return [...S];
        throw new Error("coord must be GeoJSON Point or an Array of numbers");
      }
      function T(S) {
        if (Array.isArray(S)) return S;
        if (S.type === "Feature") {
          if (S.geometry !== null) return S.geometry.coordinates;
        } else if (S.coordinates) return S.coordinates;
        throw new Error("coords must be GeoJSON Feature, Geometry Object or an Array");
      }
      function R(S) {
        return S.type === "Feature" ? S.geometry : S;
      }
      function D(S, P, F = {}) {
        if (!S) throw new Error("point is required");
        if (!P) throw new Error("polygon is required");
        const L = b(S), tt = R(P), G = tt.type, et = P.bbox;
        let st = tt.coordinates;
        if (et && Q(L, et) === !1) return !1;
        G === "Polygon" && (st = [st]);
        let it = !1;
        for (var at = 0; at < st.length; ++at) {
          const ft = v(L, st[at]);
          if (ft === 0) return !F.ignoreBoundary;
          ft && (it = !0);
        }
        return it;
      }
      function Q(S, P) {
        return P[0] <= S[0] && P[1] <= S[1] && P[2] >= S[0] && P[3] >= S[1];
      }
      var p = D;
      function M(S, P) {
        for (let F = 0; F < P.features.length; F++) if (p(S, P.features[F])) return P.features[F];
      }
      function _(S, P, F) {
        const L = P.geometry.coordinates[0][0], tt = P.geometry.coordinates[0][1], G = P.geometry.coordinates[0][2], et = S.geometry.coordinates, st = P.properties.a.geom, it = P.properties.b.geom, at = P.properties.c.geom, ft = [tt[0] - L[0], tt[1] - L[1]], J = [G[0] - L[0], G[1] - L[1]], Z = [et[0] - L[0], et[1] - L[1]], ut = [it[0] - st[0], it[1] - st[1]], _t = [at[0] - st[0], at[1] - st[1]];
        let nt = (J[1] * Z[0] - J[0] * Z[1]) / (ft[0] * J[1] - ft[1] * J[0]), H = (ft[0] * Z[1] - ft[1] * Z[0]) / (ft[0] * J[1] - ft[1] * J[0]);
        if (F) {
          const W = F[P.properties.a.index], wt = F[P.properties.b.index], Et = F[P.properties.c.index];
          let At;
          if (nt < 0 || H < 0 || 1 - nt - H < 0) {
            const Nt = nt / (nt + H), yt = H / (nt + H);
            At = nt / wt / (Nt / wt + yt / Et), H = H / Et / (Nt / wt + yt / Et);
          } else At = nt / wt / (nt / wt + H / Et + (1 - nt - H) / W), H = H / Et / (nt / wt + H / Et + (1 - nt - H) / W);
          nt = At;
        }
        return [nt * ut[0] + H * _t[0] + st[0], nt * ut[1] + H * _t[1] + st[1]];
      }
      function B(S, P, F, L) {
        const tt = S.geometry.coordinates, G = F.geometry.coordinates, et = Math.atan2(tt[0] - G[0], tt[1] - G[1]), st = w(et, P[0]);
        if (st === void 0) throw new Error("Unable to determine vertex index");
        const it = P[1][st];
        return _(S, it.features[0], L);
      }
      function N(S, P, F, L, tt, G, et, st) {
        let it;
        if (et && (it = M(S, A([et]))), !it) {
          if (F) {
            const at = S.geometry.coordinates, ft = F.gridNum, J = F.xOrigin, Z = F.yOrigin, ut = F.xUnit, _t = F.yUnit, nt = F.gridCache, H = Y(at[0], J, ut, ft), W = Y(at[1], Z, _t, ft), wt = nt[H] ? nt[H][W] ? nt[H][W] : [] : [];
            P = A(wt.map((Et) => P.features[Et]));
          }
          it = M(S, P);
        }
        return st && st(it), it ? _(S, it, G) : B(S, L, tt, G);
      }
      function Y(S, P, F, L) {
        let tt = Math.floor((S - P) / F);
        return tt >= L && (tt = L - 1), tt;
      }
      function w(S, P) {
        let F = O(S - P[0]), L = Math.PI * 2, tt;
        for (let G = 0; G < P.length; G++) {
          const et = (G + 1) % P.length, st = O(S - P[et]), it = Math.min(Math.abs(F), Math.abs(st));
          F * st <= 0 && it < L && (L = it, tt = G), F = st;
        }
        return tt;
      }
      function O(S, P = !1) {
        const F = P ? function(L) {
          return !(L >= 0 && L < Math.PI * 2);
        } : function(L) {
          return !(L > -1 * Math.PI && L <= Math.PI);
        };
        for (; F(S); ) S = S + 2 * Math.PI * (S > 0 ? -1 : 1);
        return S;
      }
      function $(S, P) {
        return P && P >= 2.00703 || Array.isArray(S[0]) ? S : S.map((F) => [F.illstNodes, F.mercNodes, F.startEnd]);
      }
      function q(S) {
        const P = S.features;
        for (let F = 0; F < P.length; F++) {
          const L = P[F];
          `${L.properties.a.index}`.substring(0, 1) === "b" && `${L.properties.b.index}`.substring(0, 1) === "b" ? P[F] = { geometry: { type: "Polygon", coordinates: [[L.geometry.coordinates[0][2], L.geometry.coordinates[0][0], L.geometry.coordinates[0][1], L.geometry.coordinates[0][2]]] }, properties: { a: { geom: L.properties.c.geom, index: L.properties.c.index }, b: { geom: L.properties.a.geom, index: L.properties.a.index }, c: { geom: L.properties.b.geom, index: L.properties.b.index } }, type: "Feature" } : `${L.properties.c.index}`.substring(0, 1) === "b" && `${L.properties.a.index}`.substring(0, 1) === "b" && (P[F] = { geometry: { type: "Polygon", coordinates: [[L.geometry.coordinates[0][1], L.geometry.coordinates[0][2], L.geometry.coordinates[0][0], L.geometry.coordinates[0][1]]] }, properties: { a: { geom: L.properties.b.geom, index: L.properties.b.index }, b: { geom: L.properties.c.geom, index: L.properties.c.index }, c: { geom: L.properties.a.geom, index: L.properties.a.index } }, type: "Feature" });
        }
        return S;
      }
      function V(S) {
        const P = ["a", "b", "c", "a"].map((G) => S.properties[G].geom), F = S.geometry.coordinates[0], L = S.properties, tt = { a: { geom: F[0], index: L.a.index }, b: { geom: F[1], index: L.b.index }, c: { geom: F[2], index: L.c.index } };
        return x([P], tt);
      }
      function z(S) {
        const P = [0, 1, 2, 0].map((L) => S[L][0][0]), F = { a: { geom: S[0][0][1], index: S[0][1] }, b: { geom: S[1][0][1], index: S[1][1] }, c: { geom: S[2][0][1], index: S[2][1] } };
        return x([P], F);
      }
      function K(S, P, F, L, tt, G = !1, et) {
        const st = S.map((it) => {
          (!et || et < 2.00703) && (it = j(it));
          const at = isFinite(it) ? P[it] : it === "c" ? L : it === "b0" ? tt[0] : it === "b1" ? tt[1] : it === "b2" ? tt[2] : it === "b3" ? tt[3] : (function() {
            const ft = it.match(/e(\d+)/);
            if (ft) {
              const J = parseInt(ft[1]);
              return F[J];
            }
            throw "Bad index value for indexesToTri";
          })();
          return G ? [[at[1], at[0]], it] : [[at[0], at[1]], it];
        });
        return z(st);
      }
      function j(S) {
        return typeof S == "number" ? S : S.replace(/^(c|e|b)(?:ent|dgeNode|box)(\d+)?$/, "$1$2");
      }
      const ct = 2.00703;
      function ht(S) {
        return !!(S.version || !S.tins && S.points && S.tins_points);
      }
      function lt(S) {
        return { points: S.points, pointsWeightBuffer: gt(S), strictStatus: mt(S), verticesParams: Pt(S), centroid: xt(S), edges: $(S.edges || []), edgeNodes: S.edgeNodes || [], tins: Mt(S), kinks: Gt(S.kinks_points), yaxisMode: S.yaxisMode ?? "invert", strictMode: S.strictMode ?? "auto", vertexMode: S.vertexMode, bounds: S.bounds, boundsPolygon: S.boundsPolygon, wh: S.wh, xy: S.bounds ? S.xy : [0, 0] };
      }
      function dt(S) {
        const P = ce(S), F = P.tins;
        return { compiled: P, tins: F, points: je(F), strictStatus: P.strict_status, pointsWeightBuffer: P.weight_buffer, verticesParams: P.vertices_params, centroid: P.centroid, kinks: P.kinks };
      }
      function gt(S) {
        return !S.version || S.version < ct ? ["forw", "bakw"].reduce((P, F) => {
          const L = S.weight_buffer[F];
          return L && (P[F] = Object.keys(L).reduce((tt, G) => {
            const et = j(G);
            return tt[et] = L[G], tt;
          }, {})), P;
        }, {}) : S.weight_buffer;
      }
      function mt(S) {
        return S.strict_status ? S.strict_status : S.kinks_points ? "strict_error" : S.tins_points.length === 2 ? "loose" : "strict";
      }
      function Pt(S) {
        const P = { forw: [S.vertices_params[0]], bakw: [S.vertices_params[1]] };
        return P.forw[1] = Tt(S, !1), P.bakw[1] = Tt(S, !0), P;
      }
      function Tt(S, P) {
        return [0, 1, 2, 3].map((F) => {
          const L = (F + 1) % 4, tt = K(["c", `b${F}`, `b${L}`], S.points, S.edgeNodes || [], S.centroid_point, S.vertices_points, P, ct);
          return A([tt]);
        });
      }
      function xt(S) {
        return { forw: g(S.centroid_point[0], { target: { geom: S.centroid_point[1], index: "c" } }), bakw: g(S.centroid_point[1], { target: { geom: S.centroid_point[0], index: "c" } }) };
      }
      function Mt(S) {
        const P = S.tins_points.length === 1 ? 0 : 1;
        return { forw: A(S.tins_points[0].map((F) => K(F, S.points, S.edgeNodes || [], S.centroid_point, S.vertices_points, !1, S.version))), bakw: A(S.tins_points[P].map((F) => K(F, S.points, S.edgeNodes || [], S.centroid_point, S.vertices_points, !0, S.version))) };
      }
      function Gt(S) {
        if (S) return { bakw: A(S.map((P) => g(P))) };
      }
      function ce(S) {
        return JSON.parse(JSON.stringify(S).replace('"cent"', '"c"').replace(/"bbox(\d+)"/g, '"b$1"'));
      }
      function je(S) {
        const P = [], F = S.forw.features;
        for (let L = 0; L < F.length; L++) {
          const tt = F[L];
          ["a", "b", "c"].map((G, et) => {
            const st = tt.geometry.coordinates[0][et], it = tt.properties[G].geom, at = tt.properties[G].index;
            typeof at == "number" && (P[at] = [st, it]);
          });
        }
        return P;
      }
      const ze = ct;
      class qt {
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
        yaxisMode = qt.YAXIS_INVERT;
        strictMode = qt.MODE_AUTO;
        vertexMode = qt.VERTEX_PLAIN;
        bounds;
        boundsPolygon;
        wh;
        xy;
        indexedTins;
        stateFull = !1;
        stateTriangle;
        stateBackward;
        constructor() {
        }
        setCompiled(P) {
          if (ht(P)) {
            this.applyModernState(lt(P));
            return;
          }
          this.applyLegacyState(dt(P));
        }
        applyModernState(P) {
          this.points = P.points, this.pointsWeightBuffer = P.pointsWeightBuffer, this.strict_status = P.strictStatus, this.vertices_params = P.verticesParams, this.centroid = P.centroid, this.edges = P.edges, this.edgeNodes = P.edgeNodes || [], this.tins = P.tins, this.addIndexedTin(), this.kinks = P.kinks, this.yaxisMode = P.yaxisMode ?? qt.YAXIS_INVERT, this.vertexMode = P.vertexMode ?? qt.VERTEX_PLAIN, this.strictMode = P.strictMode ?? qt.MODE_AUTO, P.bounds ? (this.bounds = P.bounds, this.boundsPolygon = P.boundsPolygon, this.xy = P.xy, this.wh = P.wh) : (this.bounds = void 0, this.boundsPolygon = void 0, this.xy = P.xy ?? [0, 0], P.wh && (this.wh = P.wh));
        }
        applyLegacyState(P) {
          this.tins = P.tins, this.addIndexedTin(), this.strict_status = P.strictStatus, this.pointsWeightBuffer = P.pointsWeightBuffer, this.vertices_params = P.verticesParams, this.centroid = P.centroid, this.kinks = P.kinks, this.points = P.points;
        }
        addIndexedTin() {
          const P = this.tins, F = P.forw, L = P.bakw, tt = Math.ceil(Math.sqrt(F.features.length));
          if (tt < 3) {
            this.indexedTins = void 0;
            return;
          }
          let G = [], et = [];
          const st = F.features.map((nt) => {
            let H = [];
            return T(nt)[0].map((W) => {
              G.length === 0 ? G = [Array.from(W), Array.from(W)] : (W[0] < G[0][0] && (G[0][0] = W[0]), W[0] > G[1][0] && (G[1][0] = W[0]), W[1] < G[0][1] && (G[0][1] = W[1]), W[1] > G[1][1] && (G[1][1] = W[1])), H.length === 0 ? H = [Array.from(W), Array.from(W)] : (W[0] < H[0][0] && (H[0][0] = W[0]), W[0] > H[1][0] && (H[1][0] = W[0]), W[1] < H[0][1] && (H[0][1] = W[1]), W[1] > H[1][1] && (H[1][1] = W[1]));
            }), H;
          }), it = (G[1][0] - G[0][0]) / tt, at = (G[1][1] - G[0][1]) / tt, ft = st.reduce((nt, H, W) => {
            const wt = Y(H[0][0], G[0][0], it, tt), Et = Y(H[1][0], G[0][0], it, tt), At = Y(H[0][1], G[0][1], at, tt), Nt = Y(H[1][1], G[0][1], at, tt);
            for (let yt = wt; yt <= Et; yt++) {
              nt[yt] || (nt[yt] = []);
              for (let Bt = At; Bt <= Nt; Bt++) nt[yt][Bt] || (nt[yt][Bt] = []), nt[yt][Bt].push(W);
            }
            return nt;
          }, []), J = L.features.map((nt) => {
            let H = [];
            return T(nt)[0].map((W) => {
              et.length === 0 ? et = [Array.from(W), Array.from(W)] : (W[0] < et[0][0] && (et[0][0] = W[0]), W[0] > et[1][0] && (et[1][0] = W[0]), W[1] < et[0][1] && (et[0][1] = W[1]), W[1] > et[1][1] && (et[1][1] = W[1])), H.length === 0 ? H = [Array.from(W), Array.from(W)] : (W[0] < H[0][0] && (H[0][0] = W[0]), W[0] > H[1][0] && (H[1][0] = W[0]), W[1] < H[0][1] && (H[0][1] = W[1]), W[1] > H[1][1] && (H[1][1] = W[1]));
            }), H;
          }), Z = (et[1][0] - et[0][0]) / tt, ut = (et[1][1] - et[0][1]) / tt, _t = J.reduce((nt, H, W) => {
            const wt = Y(H[0][0], et[0][0], Z, tt), Et = Y(H[1][0], et[0][0], Z, tt), At = Y(H[0][1], et[0][1], ut, tt), Nt = Y(H[1][1], et[0][1], ut, tt);
            for (let yt = wt; yt <= Et; yt++) {
              nt[yt] || (nt[yt] = []);
              for (let Bt = At; Bt <= Nt; Bt++) nt[yt][Bt] || (nt[yt][Bt] = []), nt[yt][Bt].push(W);
            }
            return nt;
          }, []);
          this.indexedTins = { forw: { gridNum: tt, xOrigin: G[0][0], yOrigin: G[0][1], xUnit: it, yUnit: at, gridCache: ft }, bakw: { gridNum: tt, xOrigin: et[0][0], yOrigin: et[0][1], xUnit: Z, yUnit: ut, gridCache: _t } };
        }
        transform(P, F, L) {
          if (F && this.strict_status == qt.STATUS_ERROR) throw 'Backward transform is not allowed if strict_status == "strict_error"';
          this.yaxisMode == qt.YAXIS_FOLLOW && F && (P = [P[0], -1 * P[1]]);
          const tt = g(P);
          if (this.bounds && !F && !L && !p(tt, this.boundsPolygon)) return !1;
          const G = F ? this.tins.bakw : this.tins.forw, et = F ? this.indexedTins.bakw : this.indexedTins.forw, st = F ? this.vertices_params.bakw : this.vertices_params.forw, it = F ? this.centroid.bakw : this.centroid.forw, at = F ? this.pointsWeightBuffer.bakw : this.pointsWeightBuffer.forw;
          let ft, J;
          this.stateFull && (this.stateBackward == F ? ft = this.stateTriangle : (this.stateBackward = F, this.stateTriangle = void 0), J = (ut) => {
            this.stateTriangle = ut;
          });
          let Z = N(tt, G, et, st, it, at, ft, J);
          if (this.bounds && F && !L) {
            const ut = g(Z);
            if (!p(ut, this.boundsPolygon)) return !1;
          } else this.yaxisMode == qt.YAXIS_FOLLOW && !F && (Z = [Z[0], -1 * Z[1]]);
          return Z;
        }
      }
      e.Transform = qt, e.counterTri = V, e.format_version = ze, e.normalizeEdges = $, e.rotateVerticesTriangle = q, e.transformArr = N, Object.defineProperty(e, Symbol.toStringTag, { value: "Module" });
    });
  })(Me, Me.exports)), Me.exports;
}
var jt = Br();
const _n = Math.pow(2, -52), Ie = new Uint32Array(512);
class sn {
  static from(t, e = Xr, n = Yr) {
    const r = t.length, i = new Float64Array(r * 2);
    for (let s = 0; s < r; s++) {
      const a = t[s];
      i[2 * s] = e(a), i[2 * s + 1] = n(a);
    }
    return new sn(i);
  }
  constructor(t) {
    const e = t.length >> 1;
    if (e > 0 && typeof t[0] != "number") throw new Error("Expected coords to contain numbers.");
    this.coords = t;
    const n = Math.max(2 * e - 5, 0);
    this._triangles = new Uint32Array(n * 3), this._halfedges = new Int32Array(n * 3), this._hashSize = Math.ceil(Math.sqrt(e)), this._hullPrev = new Uint32Array(e), this._hullNext = new Uint32Array(e), this._hullTri = new Uint32Array(e), this._hullHash = new Int32Array(this._hashSize), this._ids = new Uint32Array(e), this._dists = new Float64Array(e), this.update();
  }
  update() {
    const { coords: t, _hullPrev: e, _hullNext: n, _hullTri: r, _hullHash: i } = this, s = t.length >> 1;
    let a = 1 / 0, c = 1 / 0, h = -1 / 0, u = -1 / 0;
    for (let b = 0; b < s; b++) {
      const T = t[2 * b], R = t[2 * b + 1];
      T < a && (a = T), R < c && (c = R), T > h && (h = T), R > u && (u = R), this._ids[b] = b;
    }
    const f = (a + h) / 2, d = (c + u) / 2;
    let y, E, k;
    for (let b = 0, T = 1 / 0; b < s; b++) {
      const R = en(f, d, t[2 * b], t[2 * b + 1]);
      R < T && (y = b, T = R);
    }
    const X = t[2 * y], C = t[2 * y + 1];
    for (let b = 0, T = 1 / 0; b < s; b++) {
      if (b === y) continue;
      const R = en(X, C, t[2 * b], t[2 * b + 1]);
      R < T && R > 0 && (E = b, T = R);
    }
    let m = t[2 * E], v = t[2 * E + 1], l = 1 / 0;
    for (let b = 0; b < s; b++) {
      if (b === y || b === E) continue;
      const T = Tr(X, C, m, v, t[2 * b], t[2 * b + 1]);
      T < l && (k = b, l = T);
    }
    let g = t[2 * k], x = t[2 * k + 1];
    if (l === 1 / 0) {
      for (let R = 0; R < s; R++)
        this._dists[R] = t[2 * R] - t[0] || t[2 * R + 1] - t[1];
      we(this._ids, this._dists, 0, s - 1);
      const b = new Uint32Array(s);
      let T = 0;
      for (let R = 0, D = -1 / 0; R < s; R++) {
        const Q = this._ids[R], p = this._dists[Q];
        p > D && (b[T++] = Q, D = p);
      }
      this.hull = b.subarray(0, T), this.triangles = new Uint32Array(0), this.halfedges = new Uint32Array(0);
      return;
    }
    if (te(X, C, m, v, g, x) < 0) {
      const b = E, T = m, R = v;
      E = k, m = g, v = x, k = b, g = T, x = R;
    }
    const A = Nr(X, C, m, v, g, x);
    this._cx = A.x, this._cy = A.y;
    for (let b = 0; b < s; b++)
      this._dists[b] = en(t[2 * b], t[2 * b + 1], A.x, A.y);
    we(this._ids, this._dists, 0, s - 1), this._hullStart = y;
    let I = 3;
    n[y] = e[k] = E, n[E] = e[y] = k, n[k] = e[E] = y, r[y] = 0, r[E] = 1, r[k] = 2, i.fill(-1), i[this._hashKey(X, C)] = y, i[this._hashKey(m, v)] = E, i[this._hashKey(g, x)] = k, this.trianglesLen = 0, this._addTriangle(y, E, k, -1, -1, -1);
    for (let b = 0, T, R; b < this._ids.length; b++) {
      const D = this._ids[b], Q = t[2 * D], p = t[2 * D + 1];
      if (b > 0 && Math.abs(Q - T) <= _n && Math.abs(p - R) <= _n || (T = Q, R = p, D === y || D === E || D === k)) continue;
      let M = 0;
      for (let w = 0, O = this._hashKey(Q, p); w < this._hashSize && (M = i[(O + w) % this._hashSize], !(M !== -1 && M !== n[M])); w++)
        ;
      M = e[M];
      let _ = M, B;
      for (; B = n[_], te(Q, p, t[2 * _], t[2 * _ + 1], t[2 * B], t[2 * B + 1]) >= 0; )
        if (_ = B, _ === M) {
          _ = -1;
          break;
        }
      if (_ === -1) continue;
      let N = this._addTriangle(_, D, n[_], -1, -1, r[_]);
      r[D] = this._legalize(N + 2), r[_] = N, I++;
      let Y = n[_];
      for (; B = n[Y], te(Q, p, t[2 * Y], t[2 * Y + 1], t[2 * B], t[2 * B + 1]) < 0; )
        N = this._addTriangle(Y, D, B, r[D], -1, r[Y]), r[D] = this._legalize(N + 2), n[Y] = Y, I--, Y = B;
      if (_ === M)
        for (; B = e[_], te(Q, p, t[2 * B], t[2 * B + 1], t[2 * _], t[2 * _ + 1]) < 0; )
          N = this._addTriangle(B, D, _, -1, r[_], r[B]), this._legalize(N + 2), r[B] = N, n[_] = _, I--, _ = B;
      this._hullStart = e[D] = _, n[_] = e[Y] = D, n[D] = Y, i[this._hashKey(Q, p)] = D, i[this._hashKey(t[2 * _], t[2 * _ + 1])] = _;
    }
    this.hull = new Uint32Array(I);
    for (let b = 0, T = this._hullStart; b < I; b++)
      this.hull[b] = T, T = n[T];
    this.triangles = this._triangles.subarray(0, this.trianglesLen), this.halfedges = this._halfedges.subarray(0, this.trianglesLen);
  }
  _hashKey(t, e) {
    return Math.floor(Or(t - this._cx, e - this._cy) * this._hashSize) % this._hashSize;
  }
  _legalize(t) {
    const { _triangles: e, _halfedges: n, coords: r } = this;
    let i = 0, s = 0;
    for (; ; ) {
      const a = n[t], c = t - t % 3;
      if (s = c + (t + 2) % 3, a === -1) {
        if (i === 0) break;
        t = Ie[--i];
        continue;
      }
      const h = a - a % 3, u = c + (t + 1) % 3, f = h + (a + 2) % 3, d = e[s], y = e[t], E = e[u], k = e[f];
      if (Ir(
        r[2 * d],
        r[2 * d + 1],
        r[2 * y],
        r[2 * y + 1],
        r[2 * E],
        r[2 * E + 1],
        r[2 * k],
        r[2 * k + 1]
      )) {
        e[t] = k, e[a] = d;
        const C = n[f];
        if (C === -1) {
          let v = this._hullStart;
          do {
            if (this._hullTri[v] === f) {
              this._hullTri[v] = t;
              break;
            }
            v = this._hullPrev[v];
          } while (v !== this._hullStart);
        }
        this._link(t, C), this._link(a, n[s]), this._link(s, f);
        const m = h + (a + 1) % 3;
        i < Ie.length && (Ie[i++] = m);
      } else {
        if (i === 0) break;
        t = Ie[--i];
      }
    }
    return s;
  }
  _link(t, e) {
    this._halfedges[t] = e, e !== -1 && (this._halfedges[e] = t);
  }
  // add a new triangle given vertex indices and adjacent half-edge ids
  _addTriangle(t, e, n, r, i, s) {
    const a = this.trianglesLen;
    return this._triangles[a] = t, this._triangles[a + 1] = e, this._triangles[a + 2] = n, this._link(a, r), this._link(a + 1, i), this._link(a + 2, s), this.trianglesLen += 3, a;
  }
}
function Or(o, t) {
  const e = o / (Math.abs(o) + Math.abs(t));
  return (t > 0 ? 3 - e : 1 + e) / 4;
}
function en(o, t, e, n) {
  const r = o - e, i = t - n;
  return r * r + i * i;
}
function Ir(o, t, e, n, r, i, s, a) {
  const c = o - s, h = t - a, u = e - s, f = n - a, d = r - s, y = i - a, E = c * c + h * h, k = u * u + f * f, X = d * d + y * y;
  return c * (f * X - k * y) - h * (u * X - k * d) + E * (u * y - f * d) < 0;
}
function Tr(o, t, e, n, r, i) {
  const s = e - o, a = n - t, c = r - o, h = i - t, u = s * s + a * a, f = c * c + h * h, d = 0.5 / (s * h - a * c), y = (h * u - a * f) * d, E = (s * f - c * u) * d;
  return y * y + E * E;
}
function Nr(o, t, e, n, r, i) {
  const s = e - o, a = n - t, c = r - o, h = i - t, u = s * s + a * a, f = c * c + h * h, d = 0.5 / (s * h - a * c), y = o + (h * u - a * f) * d, E = t + (s * f - c * u) * d;
  return { x: y, y: E };
}
function we(o, t, e, n) {
  if (n - e <= 20)
    for (let r = e + 1; r <= n; r++) {
      const i = o[r], s = t[i];
      let a = r - 1;
      for (; a >= e && t[o[a]] > s; ) o[a + 1] = o[a--];
      o[a + 1] = i;
    }
  else {
    const r = e + n >> 1;
    let i = e + 1, s = n;
    _e(o, r, i), t[o[e]] > t[o[n]] && _e(o, e, n), t[o[i]] > t[o[n]] && _e(o, i, n), t[o[e]] > t[o[i]] && _e(o, e, i);
    const a = o[i], c = t[a];
    for (; ; ) {
      do
        i++;
      while (t[o[i]] < c);
      do
        s--;
      while (t[o[s]] > c);
      if (s < i) break;
      _e(o, i, s);
    }
    o[e + 1] = o[s], o[s] = a, n - i + 1 >= s - e ? (we(o, t, i, n), we(o, t, e, s - 1)) : (we(o, t, e, s - 1), we(o, t, i, n));
  }
}
function _e(o, t, e) {
  const n = o[t];
  o[t] = o[e], o[e] = n;
}
function Xr(o) {
  return o[0];
}
function Yr(o) {
  return o[1];
}
class Rr {
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
class xn extends Rr {
  constructor(t) {
    super(8, new Uint8Array(Math.ceil(t / 8)).fill(0));
  }
}
function pe(o) {
  return o % 3 === 2 ? o - 2 : o + 1;
}
function ee(o) {
  return o % 3 === 0 ? o + 2 : o - 1;
}
function Mn(o, t, e, n, r, i, s, a) {
  const c = te(o, t, r, i, s, a), h = te(e, n, r, i, s, a);
  if (c > 0 && h > 0 || c < 0 && h < 0)
    return !1;
  const u = te(r, i, o, t, e, n), f = te(s, a, o, t, e, n);
  return u > 0 && f > 0 || u < 0 && f < 0 ? !1 : c === 0 && h === 0 && u === 0 && f === 0 ? !(Math.max(r, s) < Math.min(o, e) || Math.max(o, e) < Math.min(r, s) || Math.max(i, a) < Math.min(t, n) || Math.max(t, n) < Math.min(i, a)) : !0;
}
class Cr {
  /**
   * The triangulation object from Delaunator.
   */
  del;
  constructor(t) {
    this.del = t;
  }
}
class Fr extends Cr {
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
    this.vertMap = new Uint32Array(r).fill(n), this.flips = new xn(i), this.consd = new xn(i);
    for (let s = 0; s < i; s++) {
      const a = t.triangles[s];
      this.vertMap[a] === n && this.updateVert(s);
    }
    e && this.constrainAll(e);
  }
  /**
   * Constrain the triangulation such that there is an edge between p1 and p2.
   */
  constrainOne(t, e) {
    const { triangles: n, halfedges: r } = this.del, i = this.vertMap[t];
    let s = i;
    do {
      const h = n[s], u = pe(s);
      if (h === e)
        return this.protect(s);
      const f = ee(s), d = n[f];
      if (d === e)
        return this.protect(u), u;
      if (this.intersectSegments(t, e, d, h)) {
        s = f;
        break;
      }
      s = r[u];
    } while (s !== -1 && s !== i);
    let a = s, c = -1;
    for (; s !== -1; ) {
      const h = r[s], u = ee(s), f = ee(h), d = pe(h);
      if (h === -1)
        throw new Error("Constraining edge exited the hull");
      if (this.consd.has(s))
        throw new Error("Edge intersects already constrained edge");
      if (this.isCollinear(t, e, n[s]) || this.isCollinear(t, e, n[h]))
        throw new Error("Constraining edge intersects point");
      if (!this.intersectSegments(
        n[s],
        n[h],
        n[u],
        n[f]
      )) {
        if (c === -1 && (c = s), n[f] === e) {
          if (s === c)
            throw new Error("Infinite loop: non-convex quadrilateral");
          s = c, c = -1;
          continue;
        }
        if (this.intersectSegments(
          t,
          e,
          n[f],
          n[h]
        ))
          s = f;
        else if (this.intersectSegments(
          t,
          e,
          n[d],
          n[f]
        ))
          s = d;
        else if (c === s)
          throw new Error("Infinite loop: no further intersect after non-convex");
        continue;
      }
      if (this.flipDiagonal(s), this.intersectSegments(
        t,
        e,
        n[u],
        n[f]
      ) && (c === -1 && (c = u), c === u))
        throw new Error("Infinite loop: flipped diagonal still intersects");
      n[f] === e ? (a = f, s = c, c = -1) : this.intersectSegments(
        t,
        e,
        n[d],
        n[f]
      ) && (s = d);
    }
    return this.protect(a), this.delaunify(!0), this.findEdge(t, e);
  }
  /**
   * Fix the Delaunay condition.
   */
  delaunify(t = !1) {
    const { halfedges: e } = this.del, n = this.flips, r = this.consd, i = e.length;
    let s;
    do {
      s = 0;
      for (let a = 0; a < i; a++) {
        if (r.has(a))
          continue;
        n.delete(a);
        const c = e[a];
        c !== -1 && (n.delete(c), this.isDelaunay(a) || (this.flipDiagonal(a), s++));
      }
    } while (t && s > 0);
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
    let s = n, a = -1;
    do {
      if (r[s] === t)
        return s;
      a = pe(s), s = i[a];
    } while (s !== -1 && s !== n);
    return r[pe(a)] === t ? -a : 1 / 0;
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
    const { triangles: e, halfedges: n } = this.del, r = this.flips, i = this.consd, s = n[t], a = ee(t), c = pe(t), h = ee(s), u = pe(s), f = n[a], d = n[h];
    if (i.has(t))
      throw new Error("Trying to flip a constrained edge");
    return e[t] = e[h], n[t] = d, r.set(t, r.has(h)) || i.set(t, i.has(h)), d !== -1 && (n[d] = t), n[a] = h, e[s] = e[a], n[s] = f, r.set(s, r.has(a)) || i.set(s, i.has(a)), f !== -1 && (n[f] = s), n[h] = a, this.markFlip(t), this.markFlip(c), this.markFlip(s), this.markFlip(u), r.add(a), i.delete(a), r.add(h), i.delete(h), this.updateVert(t), this.updateVert(c), this.updateVert(s), this.updateVert(u), a;
  }
  /**
   * Whether point p1, p2, and p are collinear.
   */
  isCollinear(t, e, n) {
    const r = this.del.coords;
    return te(
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
    return nr(
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
    const i = e[ee(t)], s = e[t], a = e[pe(t)], c = e[ee(r)];
    return !this.inCircle(i, s, a, c);
  }
  /**
   * Update the vertex -> incoming edge map.
   */
  updateVert(t) {
    const { triangles: e, halfedges: n } = this.del, r = this.vertMap, i = e[t];
    let s = ee(t), a = n[s];
    for (; a !== -1 && a !== t; )
      s = ee(a), a = n[s];
    return r[i] = s, s;
  }
  /**
   * Whether the segments between vertices intersect.
   */
  intersectSegments(t, e, n, r) {
    const i = this.del.coords;
    return t === n || t === r || e === n || e === r ? !1 : Mn(
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
  static intersectSegments = Mn;
}
function Te(o, t, e) {
  if (t || (t = []), typeof o != "object" || o.type !== "FeatureCollection")
    throw "Argument points must be FeatureCollection";
  if (!Array.isArray(t)) throw "Argument points must be Array of Array";
  const n = o.features.map(
    (c) => c.geometry.coordinates
  ), r = sn.from(n);
  let i;
  const s = [];
  r.triangles.length !== 0 && t.length !== 0 && (i = new Fr(r), i.constrainAll(t));
  for (let c = 0; c < r.triangles.length; c += 3)
    s.push([r.triangles[c], r.triangles[c + 1], r.triangles[c + 2]]);
  const a = ["a", "b", "c"];
  return Kt(
    s.map((c) => {
      const h = {}, u = c.map((f, d) => {
        const y = o.features[f], E = y.geometry.coordinates, k = [E[0], E[1]];
        return E.length === 3 ? k[2] = E[2] : h[a[d]] = y.properties[e], k;
      });
      return u[3] = u[0], Ee([u], h);
    })
  );
}
class Rn {
  constructor(t = [], e = Lr) {
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
      const i = t - 1 >> 1, s = e[i];
      if (n(r, s) >= 0) break;
      e[t] = s, t = i;
    }
    e[t] = r;
  }
  _down(t) {
    const { data: e, compare: n } = this, r = this.length >> 1, i = e[t];
    for (; t < r; ) {
      let s = (t << 1) + 1, a = e[s];
      const c = s + 1;
      if (c < this.length && n(e[c], a) < 0 && (s = c, a = e[c]), n(a, i) >= 0) break;
      e[t] = a, t = s;
    }
    e[t] = i;
  }
}
function Lr(o, t) {
  return o < t ? -1 : o > t ? 1 : 0;
}
function Cn(o, t) {
  return o.p.x > t.p.x ? 1 : o.p.x < t.p.x ? -1 : o.p.y !== t.p.y ? o.p.y > t.p.y ? 1 : -1 : 1;
}
function Dr(o, t) {
  return o.rightSweepEvent.p.x > t.rightSweepEvent.p.x ? 1 : o.rightSweepEvent.p.x < t.rightSweepEvent.p.x ? -1 : o.rightSweepEvent.p.y !== t.rightSweepEvent.p.y ? o.rightSweepEvent.p.y < t.rightSweepEvent.p.y ? 1 : -1 : 1;
}
class kn {
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
function $r(o, t) {
  if (o.type === "FeatureCollection") {
    const e = o.features;
    for (let n = 0; n < e.length; n++)
      Sn(e[n], t);
  } else
    Sn(o, t);
}
let Ne = 0, Xe = 0, Ye = 0;
function Sn(o, t) {
  const e = o.type === "Feature" ? o.geometry : o;
  let n = e.coordinates;
  (e.type === "Polygon" || e.type === "MultiLineString") && (n = [n]), e.type === "LineString" && (n = [[n]]);
  for (let r = 0; r < n.length; r++)
    for (let i = 0; i < n[r].length; i++) {
      let s = n[r][i][0], a = null;
      Xe = Xe + 1;
      for (let c = 0; c < n[r][i].length - 1; c++) {
        a = n[r][i][c + 1];
        const h = new kn(s, Ne, Xe, Ye), u = new kn(a, Ne, Xe, Ye + 1);
        h.otherEvent = u, u.otherEvent = h, Cn(h, u) > 0 ? (u.isLeftEndpoint = !0, h.isLeftEndpoint = !1) : (h.isLeftEndpoint = !0, u.isLeftEndpoint = !1), t.push(h), t.push(u), s = a, Ye = Ye + 1;
      }
    }
  Ne = Ne + 1;
}
class qr {
  constructor(t) {
    this.leftSweepEvent = t, this.rightSweepEvent = t.otherEvent;
  }
}
function Ur(o, t) {
  if (o === null || t === null || o.leftSweepEvent.ringId === t.leftSweepEvent.ringId && (o.rightSweepEvent.isSamePoint(t.leftSweepEvent) || o.rightSweepEvent.isSamePoint(t.leftSweepEvent) || o.rightSweepEvent.isSamePoint(t.rightSweepEvent) || o.leftSweepEvent.isSamePoint(t.leftSweepEvent) || o.leftSweepEvent.isSamePoint(t.rightSweepEvent))) return !1;
  const e = o.leftSweepEvent.p.x, n = o.leftSweepEvent.p.y, r = o.rightSweepEvent.p.x, i = o.rightSweepEvent.p.y, s = t.leftSweepEvent.p.x, a = t.leftSweepEvent.p.y, c = t.rightSweepEvent.p.x, h = t.rightSweepEvent.p.y, u = (h - a) * (r - e) - (c - s) * (i - n), f = (c - s) * (n - a) - (h - a) * (e - s), d = (r - e) * (n - a) - (i - n) * (e - s);
  if (u === 0)
    return !1;
  const y = f / u, E = d / u;
  if (y >= 0 && y <= 1 && E >= 0 && E <= 1) {
    const k = e + y * (r - e), X = n + y * (i - n);
    return [k, X];
  }
  return !1;
}
function jr(o, t) {
  t = t || !1;
  const e = [], n = new Rn([], Dr);
  for (; o.length; ) {
    const r = o.pop();
    if (r.isLeftEndpoint) {
      const i = new qr(r);
      for (let s = 0; s < n.data.length; s++) {
        const a = n.data[s];
        if (t && a.leftSweepEvent.featureId === r.featureId)
          continue;
        const c = Ur(i, a);
        c !== !1 && e.push(c);
      }
      n.push(i);
    } else r.isLeftEndpoint === !1 && n.pop();
  }
  return e;
}
function zr(o, t) {
  const e = new Rn([], Cn);
  return $r(o, e), jr(e, t);
}
var Vr = zr;
function Wr(o, t, e = {}) {
  const { removeDuplicates: n = !0, ignoreSelfIntersections: r = !0 } = e;
  let i = [];
  o.type === "FeatureCollection" ? i = i.concat(o.features) : o.type === "Feature" ? i.push(o) : (o.type === "LineString" || o.type === "Polygon" || o.type === "MultiLineString" || o.type === "MultiPolygon") && i.push(Se(o)), t.type === "FeatureCollection" ? i = i.concat(t.features) : t.type === "Feature" ? i.push(t) : (t.type === "LineString" || t.type === "Polygon" || t.type === "MultiLineString" || t.type === "MultiPolygon") && i.push(Se(t));
  const s = Vr(
    Kt(i),
    r
  );
  let a = [];
  if (n) {
    const c = {};
    s.forEach((h) => {
      const u = h.join(",");
      c[u] || (c[u] = !0, a.push(h));
    });
  } else
    a = s;
  return Kt(a.map((c) => de(c)));
}
var Jr = Wr;
function Fn(o, t, e, n, r, i) {
  return Object.keys(o).reduce((s, a) => {
    const c = o[a], h = c.forw, u = c.bakw, f = {
      forw: [h[0] - t.forw[0], h[1] - t.forw[1]],
      bakw: [u[0] - t.bakw[0], u[1] - t.bakw[1]]
    }, d = f.forw[0] === 0 ? 1 / 0 : ((f.forw[0] < 0 ? e : n) - t.forw[0]) / f.forw[0], y = f.forw[1] === 0 ? 1 / 0 : ((f.forw[1] < 0 ? r : i) - t.forw[1]) / f.forw[1];
    if (Math.abs(d) / Math.abs(y) < 1.1) {
      const E = {
        forw: [
          f.forw[0] * d + t.forw[0],
          f.forw[1] * d + t.forw[1]
        ],
        bakw: [
          f.bakw[0] * d + t.bakw[0],
          f.bakw[1] * d + t.bakw[1]
        ]
      };
      f.forw[0] < 0 ? s[3].push(E) : s[1].push(E);
    }
    if (Math.abs(y) / Math.abs(d) < 1.1) {
      const E = {
        forw: [
          f.forw[0] * y + t.forw[0],
          f.forw[1] * y + t.forw[1]
        ],
        bakw: [
          f.bakw[0] * y + t.bakw[0],
          f.bakw[1] * y + t.bakw[1]
        ]
      };
      f.forw[1] < 0 ? s[0].push(E) : s[2].push(E);
    }
    return s;
  }, [[], [], [], []]);
}
function Kr(o, t) {
  const e = [[], [], [], []], n = [];
  return Object.keys(o).forEach((r) => {
    const i = o[r], s = i.forw, a = i.bakw, c = [
      s[0] - t.forw[0],
      s[1] - t.forw[1]
    ], h = [
      a[0] - t.bakw[0],
      t.bakw[1] - a[1]
    ], u = { forw: c, bakw: h };
    if (n.push(u), c[0] === 0 || c[1] === 0)
      return;
    let f = 0;
    c[0] > 0 && (f += 1), c[1] > 0 && (f += 2), e[f].push(u);
  }), { perQuad: e, aggregate: n };
}
function Gr(o) {
  let t = 1 / 0, e = 0, n = 0;
  return o.forEach((r) => {
    const { forw: i, bakw: s } = r, a = Math.hypot(i[0], i[1]), c = Math.hypot(s[0], s[1]);
    if (c === 0) return;
    const h = a / c, u = Math.atan2(i[0], i[1]) - Math.atan2(s[0], s[1]);
    t = Math.min(t, h), e += Math.cos(u), n += Math.sin(u);
  }), isFinite(t) ? [t, Math.atan2(n, e)] : [1, 0];
}
function Ln(o, t, e) {
  const { perQuad: n, aggregate: r } = Kr(o, t), i = n.every((c) => c.length > 0), a = (e === "birdeye" ? i ? n : [r] : [r]).map((c) => Gr(c));
  return a.length === 1 ? [a[0], a[0], a[0], a[0]] : a;
}
function Qr(o, t, e) {
  const n = [1, 1, 1, 1];
  for (let r = 0; r < 4; r++) {
    const i = (r + 1) % 4, s = un([o[r].bakw, o[i].bakw]);
    t[r].map((a) => {
      const c = un([e.bakw, a.bakw]), h = Jr(s, c);
      if (h.features.length > 0 && h.features[0].geometry) {
        const u = h.features[0], f = Math.sqrt(
          Math.pow(a.bakw[0] - e.bakw[0], 2) + Math.pow(a.bakw[1] - e.bakw[1], 2)
        ), d = Math.sqrt(
          Math.pow(
            u.geometry.coordinates[0] - e.bakw[0],
            2
          ) + Math.pow(
            u.geometry.coordinates[1] - e.bakw[1],
            2
          )
        ), y = f / d;
        y > n[r] && (n[r] = y), y > n[i] && (n[i] = y);
      }
    });
  }
  o.forEach((r, i) => {
    const s = n[i], a = [
      (r.bakw[0] - e.bakw[0]) * s + e.bakw[0],
      (r.bakw[1] - e.bakw[1]) * s + e.bakw[1]
    ];
    r.bakw = a;
  });
}
function Dn(o, t, e, n) {
  const r = o.map((s, a) => {
    const c = t[a], h = [
      c[0] - e.forw[0],
      c[1] - e.forw[1]
    ], f = Math.sqrt(
      Math.pow(h[0], 2) + Math.pow(h[1], 2)
    ) / s[0], d = Math.atan2(h[0], h[1]) - s[1], y = [
      e.bakw[0] + f * Math.sin(d),
      e.bakw[1] - f * Math.cos(d)
    ];
    return { forw: c, bakw: y };
  }), i = r[2];
  return r[2] = r[3], r[3] = i, Qr(r, n, e), r;
}
function Hr(o) {
  const { convexBuf: t, centroid: e, bbox: n, minx: r, maxx: i, miny: s, maxy: a } = o, c = Fn(t, e, r, i, s, a), h = Ln(t, e, "plain");
  return Dn(h, n, e, c);
}
function Zr(o) {
  const { convexBuf: t, centroid: e, bbox: n, minx: r, maxx: i, miny: s, maxy: a } = o, c = Fn(t, e, r, i, s, a), h = Ln(t, e, "birdeye");
  return Dn(h, n, e, c);
}
function ti(o) {
  const e = new ei(o).findSegmentIntersections(), n = Un(e), r = /* @__PURE__ */ new Map();
  return n.forEach((i) => {
    r.set(`${i.x}:${i.y}`, i);
  }), Array.from(r.values()).map(
    (i) => de([i.x, i.y])
  );
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
  _zz;
  _zlimit = 0;
  // simplification
  _bb;
  _allBounds;
  // bounding boxes
  _arcIter;
  _filteredArcIter;
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
      const s = i ? i.length : 0;
      for (let a = 0; a < s; a++)
        e.push(i[a][0]), n.push(i[a][1]);
      return s;
    });
    this.initXYData(r, e, n);
  }
  initXYData(t, e, n) {
    const r = t.length;
    this._xx = new Float64Array(e), this._yy = new Float64Array(n), this._nn = new Uint32Array(t), this._zz = null, this._zlimit = 0, this._filteredArcIter = null, this._ii = new Uint32Array(r);
    let i = 0;
    for (let s = 0; s < r; s++)
      this._ii[s] = i, i += t[s];
    (i != this._xx.length || this._xx.length != this._yy.length) && on("ArcCollection#initXYData() Counting error"), this.initBounds(), this._arcIter = new _i(this._xx, this._yy);
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
    const r = n.length, i = new Float64Array(r * 4), s = new qe();
    let a = 0, c, h, u;
    for (let f = 0; f < r; f++)
      c = n[f], c > 0 && (h = f * 4, u = xi(t, e, a, c), i[h++] = u[0], i[h++] = u[1], i[h++] = u[2], i[h] = u[3], a += c, s.mergeBounds(u));
    return {
      bb: i,
      bounds: s
    };
  }
  getBounds() {
    return this._allBounds.clone();
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
    const n = t >= 0, r = n ? t : ~t, i = this.getRetainedInterval(), s = this._nn[r], a = n ? 1 : -1;
    let c = n ? this._ii[r] : this._ii[r] + s - 1, h = c, u = 0;
    for (let f = 1; f < s; f++)
      h += a, (i === 0 || this._zz[h] >= i) && (e(c, h, this._xx, this._yy), c = h, u++);
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
      (r, i, s, a) => {
        t += Math.abs(s[r] - s[i]), e += Math.abs(a[r] - a[i]);
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
    const t = this.getBounds(), e = t.ymin, n = t.ymax - e, r = this.calcSegmentIntersectionStripeCount(), i = new Uint32Array(r), s = r > 1 ? (k) => Math.floor((r - 1) * (k - e) / n) : () => 0;
    let a, c;
    this.forEachSegment(
      (k, X, C, m) => {
        let v = s(m[k]);
        const l = s(m[X]);
        for (; i[v] = i[v] + 2, v != l; )
          v += l > v ? 1 : -1;
      }
    );
    const h = this.getUint32Array(ii(i));
    let u = 0;
    const f = [];
    si(i, (k) => {
      const X = u;
      u += k, f.push(h.subarray(X, u));
    }), oi(i, 0), this.forEachSegment(
      (k, X, C, m) => {
        let v = s(m[k]);
        const l = s(m[X]);
        let g, x;
        for (; g = i[v], i[v] = g + 2, x = f[v], x[g] = k, x[g + 1] = X, v != l; )
          v += l > v ? 1 : -1;
      }
    );
    const d = this.getVertexData(), y = [];
    let E;
    for (a = 0; a < r; a++)
      for (E = ai(f[a], d.xx, d.yy), c = 0; c < E.length; c++)
        y.push(E[c]);
    return Un(y);
  }
}
function on(...o) {
  const t = o.join(" ");
  throw new Error(t);
}
function an(o) {
  return o ? ri(o) ? !0 : ni(o) ? !1 : o.length === 0 ? !0 : o.length > 0 : !1;
}
function ni(o) {
  return o != null && o.toString === String.prototype.toString;
}
function ri(o) {
  return Array.isArray(o);
}
function ii(o, t) {
  an(o) || on("utils.sum() expects an array, received:", o);
  let e = 0, n;
  for (let r = 0, i = o.length; r < i; r++)
    n = o[r], n && (e += n);
  return e;
}
function si(o, t, e) {
  if (!an(o))
    throw new Error(`#forEach() takes an array-like argument. ${o}`);
  for (let n = 0, r = o.length; n < r; n++)
    t.call(e, o[n], n);
}
function oi(o, t) {
  for (let e = 0, n = o.length; e < n; e++)
    o[e] = t;
  return o;
}
function ai(o, t, e) {
  const n = o.length - 2, r = [];
  let i, s, a, c, h, u, f, d, y, E, k, X, C, m, v, l, g;
  for (wi(t, o), l = 0; l < n; ) {
    for (i = o[l], s = o[l + 1], h = t[i], u = t[s], y = e[i], E = e[s], g = l; g < n && (g += 2, a = o[g], f = t[a], !(u < f)); ) {
      if (k = e[a], c = o[g + 1], d = t[c], X = e[c], y >= k) {
        if (y > X && E > k && E > X) continue;
      } else if (y < X && E < k && E < X) continue;
      i == a || i == c || s == a || s == c || (C = ci(
        h,
        y,
        u,
        E,
        f,
        k,
        d,
        X
      ), C && (m = [i, s], v = [a, c], r.push(An(C, m, v, t, e)), C.length == 4 && r.push(
        An(C.slice(2), m, v, t, e)
      )));
    }
    l += 2;
  }
  return r;
}
function ci(o, t, e, n, r, i, s, a) {
  const c = hi(o, t, e, n, r, i, s, a);
  let h = null;
  return c && (h = fi(o, t, e, n, r, i, s, a), h ? gi(o, t, e, n, r, i, s, a) && (h = null) : h = mi(o, t, e, n, r, i, s, a)), h;
}
function hi(o, t, e, n, r, i, s, a) {
  return ke(o, t, e, n, r, i) * ke(o, t, e, n, s, a) <= 0 && ke(r, i, s, a, o, t) * ke(r, i, s, a, e, n) <= 0;
}
function ke(o, t, e, n, r, i) {
  return $n(o - r, t - i, e - r, n - i);
}
function $n(o, t, e, n) {
  return o * n - t * e;
}
function fi(o, t, e, n, r, i, s, a) {
  let c = Re(o, t, e, n, r, i, s, a), h;
  return c && (h = li(c[0], c[1], o, t, e, n, r, i, s, a), h == 1 ? c = Re(e, n, o, t, r, i, s, a) : h == 2 ? c = Re(r, i, s, a, o, t, e, n) : h == 3 && (c = Re(s, a, r, i, o, t, e, n))), c && di(c, o, t, e, n, r, i, s, a), c;
}
function Re(o, t, e, n, r, i, s, a) {
  const c = $n(e - o, n - t, s - r, a - i), h = 1e-18;
  let u;
  if (c === 0) return null;
  const f = ke(r, i, s, a, o, t) / c;
  return c <= h && c >= -h ? u = ui(o, t, e, n, r, i, s, a) : u = [o + f * (e - o), t + f * (n - t)], u;
}
function ui(o, t, e, n, r, i, s, a) {
  let c = null;
  return !ne(o, r, s) && !ne(t, i, a) ? c = [o, t] : !ne(e, r, s) && !ne(n, i, a) ? c = [e, n] : !ne(r, o, e) && !ne(i, t, n) ? c = [r, i] : !ne(s, o, e) && !ne(a, t, n) && (c = [s, a]), c;
}
function ne(o, t, e) {
  let n;
  return t < e ? n = o < t || o > e : t > e ? n = o > t || o < e : n = o != t, n;
}
function li(o, t, ...e) {
  let n = -1, r = 1 / 0, i;
  for (let s = 0, a = 0, c = e.length; a < c; s++, a += 2)
    i = pi(o, t, e[a], e[a + 1]), i < r && (r = i, n = s);
  return n;
}
function pi(o, t, e, n) {
  const r = o - e, i = t - n;
  return r * r + i * i;
}
function di(o, t, e, n, r, i, s, a, c) {
  let h = o[0], u = o[1];
  h = Ce(h, t, n), h = Ce(h, i, a), u = Ce(u, e, r), u = Ce(u, s, c), o[0] = h, o[1] = u;
}
function Ce(o, t, e) {
  let n;
  return ne(o, t, e) && (n = Math.abs(o - t) < Math.abs(o - e) ? t : e, o = n), o;
}
function mi(o, t, e, n, r, i, s, a) {
  const c = Math.min(o, e, r, s), h = Math.max(o, e, r, s), u = Math.min(t, n, i, a), f = Math.max(t, n, i, a), d = f - u > h - c;
  let y = [];
  return (d ? ae(t, u, f) : ae(o, c, h)) && y.push(o, t), (d ? ae(n, u, f) : ae(e, c, h)) && y.push(e, n), (d ? ae(i, u, f) : ae(r, c, h)) && y.push(r, i), (d ? ae(a, u, f) : ae(s, c, h)) && y.push(s, a), (y.length != 2 && y.length != 4 || y.length == 4 && y[0] == y[2] && y[1] == y[3]) && (y = null), y;
}
function gi(o, t, e, n, r, i, s, a) {
  return o == r && t == i || o == s && t == a || e == r && n == i || e == s && n == a;
}
function ae(o, t, e) {
  return o > t && o < e;
}
function wi(o, t) {
  yi(o, t), qn(o, t, 0, t.length - 2);
}
function yi(o, t) {
  for (let e = 0, n = t.length; e < n; e += 2)
    o[t[e]] > o[t[e + 1]] && vi(t, e, e + 1);
}
function vi(o, t, e) {
  const n = o[t];
  o[t] = o[e], o[e] = n;
}
function qn(o, t, e, n) {
  let r = e, i = n, s, a;
  for (; r < n; ) {
    for (s = o[t[e + n >> 2 << 1]]; r <= i; ) {
      for (; o[t[r]] < s; ) r += 2;
      for (; o[t[i]] > s; ) i -= 2;
      r <= i && (a = t[r], t[r] = t[i], t[i] = a, a = t[r + 1], t[r + 1] = t[i + 1], t[i + 1] = a, r += 2, i -= 2);
    }
    if (i - e < 40 ? En(o, t, e, i) : qn(o, t, e, i), n - r < 40) {
      En(o, t, r, n);
      return;
    }
    e = r, i = n;
  }
}
function En(o, t, e, n) {
  let r, i;
  for (let s = e + 2; s <= n; s += 2) {
    r = t[s], i = t[s + 1];
    let a;
    for (a = s - 2; a >= e && o[r] < o[t[a]]; a -= 2)
      t[a + 2] = t[a], t[a + 3] = t[a + 1];
    t[a + 2] = r, t[a + 3] = i;
  }
}
function An(o, t, e, n, r) {
  const i = o[0], s = o[1];
  t = Pn(i, s, t[0], t[1], n, r), e = Pn(i, s, e[0], e[1], n, r);
  const a = t[0] < e[0] ? t : e, c = a == t ? e : t;
  return { x: i, y: s, a, b: c };
}
function Pn(o, t, e, n, r, i) {
  let s = e < n ? e : n, a = s === e ? n : e;
  return r[s] == o && i[s] == t ? a = s : r[a] == o && i[a] == t && (s = a), [s, a];
}
function Un(o) {
  const t = {};
  return o.filter((e) => {
    const n = bi(e);
    return n in t ? !1 : (t[n] = !0, !0);
  });
}
function bi(o) {
  return `${o.a.join(",")};${o.b.join(",")}`;
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
function xi(o, t, e, n) {
  let r = e | 0;
  const i = isNaN(n) ? o.length - r : n + r;
  let s, a, c, h, u, f;
  if (i > 0)
    c = u = o[r], h = f = t[r];
  else return [void 0, void 0, void 0, void 0];
  for (r++; r < i; r++)
    s = o[r], a = t[r], s < c && (c = s), s > u && (u = s), a < h && (h = a), a > f && (f = a);
  return [c, h, u, f];
}
class qe {
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
    return new qe(this.xmin, this.ymin, this.xmax, this.ymax);
  }
  width() {
    return this.xmax - this.xmin || 0;
  }
  height() {
    return this.ymax - this.ymin || 0;
  }
  setBounds(t, e, n, r) {
    return arguments.length == 1 && (an(t) ? (e = t[1], n = t[2], r = t[3], t = t[0]) : (e = t.ymin, n = t.xmax, r = t.ymax, t = t.xmin)), this.xmin = t, this.ymin = e, this.xmax = n, this.ymax = r, (t > n || e > r) && this.update(), this;
  }
  update() {
    let t;
    this.xmin > this.xmax && (t = this.xmin, this.xmin = this.xmax, this.xmax = t), this.ymin > this.ymax && (t = this.ymin, this.ymin = this.ymax, this.ymax = t);
  }
  mergeBounds(t, ...e) {
    let n, r, i, s;
    return t instanceof qe ? (n = t.xmin, r = t.ymin, i = t.xmax, s = t.ymax) : e.length == 3 ? (n = t, r = e[0], i = e[1], s = e[2]) : t.length == 4 ? (n = t[0], r = t[1], i = t[2], s = t[3]) : on("Bounds#mergeBounds() invalid argument:", t), this.xmin === void 0 ? this.setBounds(n, r, i, s) : (n < this.xmin && (this.xmin = n), r < this.ymin && (this.ymin = r), i > this.xmax && (this.xmax = i), s > this.ymax && (this.ymax = s)), this;
  }
}
function Ue(o) {
  const t = ["a", "b", "c"].map(
    (e) => o.properties[e].index
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
function jn(o, t, e) {
  const n = Ue(t.forw), r = Ue(t.bakw);
  if (JSON.stringify(n) != JSON.stringify(r))
    throw `${JSON.stringify(t, null, 2)}
${JSON.stringify(
      n
    )}
${JSON.stringify(r)}`;
  for (let i = 0; i < n.length; i++) {
    const s = n[i];
    o[s] || (o[s] = []), o[s].push(t);
  }
  e && (e.forw.features.push(t.forw), e.bakw.features.push(t.bakw));
}
function Bn(o, t, e) {
  const n = Ue(t.forw), r = Ue(t.bakw);
  if (JSON.stringify(n) != JSON.stringify(r))
    throw `${JSON.stringify(t, null, 2)}
${JSON.stringify(n)}
${JSON.stringify(r)}`;
  if (n.forEach((i) => {
    const s = o[i];
    if (!s) return;
    const a = s.filter((c) => c !== t);
    a.length === 0 ? delete o[i] : o[i] = a;
  }), e) {
    const i = (s, a) => {
      !s || !a || (s.features = s.features.filter((c) => c !== a));
    };
    i(e.forw, t.forw), i(e.bakw, t.bakw);
  }
}
function Fe(o, t, e) {
  return de(o, { target: { geom: t, index: e } });
}
function Le(o) {
  return de(o.properties.target.geom, {
    target: {
      geom: o.geometry.coordinates,
      index: o.properties.target.index
    }
  });
}
function On(o, t) {
  const e = t.geometry.coordinates;
  return [0, 1, 2, 3].map((n) => {
    const r = (n + 1) % 4, i = o[n], s = o[r], a = i.geometry.coordinates, c = Math.atan2(
      a[0] - e[0],
      a[1] - e[1]
    ), h = [t, i, s, t].map(
      (d) => d.geometry.coordinates
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
        geom: s.properties.target.geom,
        index: s.properties.target.index
      }
    }, f = Kt([
      Ee([h], u)
    ]);
    return [c, f];
  }).reduce(
    (n, r) => (n[0].push(r[0]), n[1].push(r[1]), n),
    [[], []]
  );
}
function Mi(o) {
  const { tins: t, targets: e, includeReciprocals: n } = o, r = {};
  e.forEach((s) => {
    const a = t[s];
    if (!a || !a.features) return;
    r[s] = {};
    const c = {};
    a.features.forEach((h) => {
      const u = ["a", "b", "c"];
      for (let f = 0; f < 3; f++) {
        const d = (f + 1) % 3, y = u[f], E = u[d], k = h.properties[y].index, X = h.properties[E].index, C = [k, X].sort().join("-");
        if (c[C]) continue;
        c[C] = !0;
        const m = h.geometry.coordinates[0][f], v = h.geometry.coordinates[0][d], l = h.properties[y].geom, g = h.properties[E].geom, x = Math.sqrt(
          Math.pow(l[0] - g[0], 2) + Math.pow(l[1] - g[1], 2)
        ) / Math.sqrt(
          Math.pow(m[0] - v[0], 2) + Math.pow(m[1] - v[1], 2)
        ), A = r[s];
        A[`${k}:${C}`] = x, A[`${X}:${C}`] = x;
      }
    });
  });
  const i = {};
  return n && (i.bakw = {}), e.forEach((s) => {
    const a = r[s];
    if (i[s] = {}, !a)
      return;
    const c = {};
    Object.keys(a).forEach((u) => {
      const [f] = u.split(":");
      c[f] || (c[f] = []), c[f].push(a[u]);
    }), Object.keys(c).forEach((u) => {
      const f = c[u], d = f.reduce((y, E) => y + E, 0) / f.length;
      i[s][u] = d, n && i.bakw && (i.bakw[u] = 1 / d);
    });
    let h = 0;
    for (let u = 0; u < 4; u++) {
      const f = `b${u}`, d = i[s][f] || 0;
      h += d;
    }
    i[s].c = h / 4, n && i.bakw && (i.bakw.c = 1 / i[s].c);
  }), i;
}
function ki(o, t) {
  const e = o.split("-");
  if (e.length !== 2 || !e.every((i) => /^-?\d+$/.test(i))) return !1;
  const [n, r] = e.map((i) => parseInt(i, 10)).sort((i, s) => i - s);
  return t.some((i) => {
    if (i.length !== 2) return !1;
    const s = i.map((c) => parseInt(`${c}`, 10));
    if (s.some((c) => Number.isNaN(c))) return !1;
    const a = s.sort((c, h) => c - h);
    return a[0] === n && a[1] === r;
  });
}
function De(o) {
  return ["a", "b", "c"].map((t, e) => ({
    prop: o.properties[t],
    geom: o.geometry.coordinates[0][e]
  }));
}
function Si(o, t, e) {
  const n = /* @__PURE__ */ new Set();
  let r = !1;
  const i = Object.keys(t);
  for (const s of i) {
    if (n.has(s)) continue;
    n.add(s);
    const a = t[s];
    if (!a || a.length < 2) continue;
    const c = s.split("-");
    if (c.length !== 2 || ki(s, e)) continue;
    const h = De(a[0].bakw), u = De(a[1].bakw), f = De(a[0].forw), d = De(a[1].forw), y = c.map(
      (b) => h.find((T) => `${T.prop.index}` === b) || u.find((T) => `${T.prop.index}` === b)
    ), E = c.map(
      (b) => f.find((T) => `${T.prop.index}` === b) || d.find((T) => `${T.prop.index}` === b)
    );
    if (y.some((b) => !b) || E.some((b) => !b))
      continue;
    const k = [h, u].map(
      (b) => b.find((T) => !c.includes(`${T.prop.index}`))
    ), X = [f, d].map(
      (b) => b.find((T) => !c.includes(`${T.prop.index}`))
    );
    if (k.some((b) => !b) || X.some((b) => !b))
      continue;
    const C = a[0].bakw.geometry.coordinates[0].slice(0, 3).map((b) => ge(b)), m = a[1].bakw.geometry.coordinates[0].slice(0, 3).map((b) => ge(b));
    if (!(In(
      ge(k[0].geom),
      m
    ) || In(
      ge(k[1].geom),
      C
    )))
      continue;
    const l = E.map(
      (b) => ge(b.geom)
    ), g = X.map(
      (b) => ge(b.geom)
    ), x = Ei([
      ...l,
      ...g
    ]), A = Ai(x), I = Tn(
      l[0],
      l[1],
      g[0]
    ) + Tn(
      l[0],
      l[1],
      g[1]
    );
    nn(A, I) && (Bn(t, a[0], o), Bn(t, a[1], o), y.forEach((b) => {
      if (!b) return;
      const T = [
        b.geom,
        k[0].geom,
        k[1].geom,
        b.geom
      ], R = {
        a: b.prop,
        b: k[0].prop,
        c: k[1].prop
      }, D = Ee([T], R), Q = jt.counterTri(D);
      jn(t, {
        forw: Q,
        bakw: D
      }, o);
    }), r = !0);
  }
  return r;
}
function ge(o) {
  return [o[0], o[1]];
}
function In(o, t) {
  const [e, n] = t[0], [r, i] = t[1], [s, a] = t[2], c = s - e, h = a - n, u = r - e, f = i - n, d = o[0] - e, y = o[1] - n, E = c * c + h * h, k = c * u + h * f, X = c * d + h * y, C = u * u + f * f, m = u * d + f * y, v = E * C - k * k;
  if (v === 0) return !1;
  const l = 1 / v, g = (C * X - k * m) * l, x = (E * m - k * X) * l, A = 1e-9;
  return g >= -A && x >= -A && g + x <= 1 + A;
}
function Ei(o) {
  const t = o.map((s) => s.slice()).filter(
    (s, a, c) => c.findIndex(
      (h) => nn(h[0], s[0]) && nn(h[1], s[1])
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
  const i = [];
  for (let s = e.length - 1; s >= 0; s--) {
    const a = e[s];
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
function Ai(o) {
  if (o.length < 3) return 0;
  let t = 0;
  for (let e = 0; e < o.length; e++) {
    const [n, r] = o[e], [i, s] = o[(e + 1) % o.length];
    t += n * s - i * r;
  }
  return Math.abs(t) / 2;
}
function Tn(o, t, e) {
  return Math.abs(
    (o[0] * (t[1] - e[1]) + t[0] * (e[1] - o[1]) + e[0] * (o[1] - t[1])) / 2
  );
}
function nn(o, t, e = 1e-9) {
  return Math.abs(o - t) <= e;
}
const Pi = 2.00703, Nn = typeof jt.format_version < "u" ? jt.format_version : Pi;
class Xt extends jt.Transform {
  importance;
  priority;
  pointsSet;
  /**
   * Tinクラスのインスタンスを生成します
   * @param options - 初期化オプション
   */
  constructor(t = {}) {
    super(), t.bounds ? this.setBounds(t.bounds) : (this.setWh(t.wh), this.vertexMode = t.vertexMode || Xt.VERTEX_PLAIN), this.strictMode = t.strictMode || Xt.MODE_AUTO, this.yaxisMode = t.yaxisMode || Xt.YAXIS_INVERT, this.importance = t.importance || 0, this.priority = t.priority || 0, this.stateFull = t.stateFull || !1, t.points && this.setPoints(t.points), t.edges && this.setEdges(t.edges);
  }
  /**
   * フォーマットバージョンを取得します
   */
  getFormatVersion() {
    return Nn;
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
    this.edges = jt.normalizeEdges(t), this.edgeNodes = void 0, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 境界ポリゴンを設定します
   */
  setBounds(t) {
    this.bounds = t;
    let e = t[0][0], n = e, r = t[0][1], i = r;
    const s = [t[0]];
    for (let a = 1; a < t.length; a++) {
      const c = t[a];
      c[0] < e && (e = c[0]), c[0] > n && (n = c[0]), c[1] < r && (r = c[1]), c[1] > i && (i = c[1]), s.push(c);
    }
    s.push(t[0]), this.boundsPolygon = Ee([s]), this.xy = [e, r], this.wh = [n - e, i - r], this.vertexMode = Xt.VERTEX_PLAIN, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 現在の設定を永続化可能な形式にコンパイルします
   */
  getCompiled() {
    const t = {};
    t.version = Nn, t.points = this.points, t.weight_buffer = this.pointsWeightBuffer, t.centroid_point = [
      this.centroid.forw.geometry.coordinates,
      this.centroid.forw.properties.target.geom
    ], t.vertices_params = [
      this.vertices_params.forw[0],
      this.vertices_params.bakw[0]
    ], t.vertices_points = [];
    const e = this.vertices_params.forw[1];
    return e && [0, 1, 2, 3].map((n) => {
      const r = e[n].features[0], i = r.geometry.coordinates[0][1], s = r.properties.b.geom;
      t.vertices_points[n] = [i, s];
    }), t.strict_status = this.strict_status, t.tins_points = [[]], this.tins.forw.features.map((n) => {
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
    const t = this.tins.forw.features.map(
      (r) => jt.counterTri(r)
    );
    this.tins.bakw = Kt(t);
    const e = {};
    this.tins.forw.features.forEach((r, i) => {
      const s = this.tins.bakw.features[i];
      jn(e, { forw: r, bakw: s });
    }), Si(
      this.tins,
      e,
      this.pointsSet?.edges || []
    );
    const n = ["forw", "bakw"].map((r) => {
      const i = this.tins[r].features.map(
        (s) => s.geometry.coordinates[0]
      );
      return ti(i);
    });
    n[0].length === 0 && n[1].length === 0 ? (this.strict_status = Xt.STATUS_STRICT, delete this.kinks) : (this.strict_status = Xt.STATUS_ERROR, this.kinks = {
      forw: Kt(n[0]),
      bakw: Kt(n[1])
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
      const i = this.points[r][0], s = this.points[r][1], a = Fe(i, s, r);
      t.forw.push(a), t.bakw.push(Le(a));
    }
    const e = [];
    let n = 0;
    this.edgeNodes = [], this.edges || (this.edges = []);
    for (let r = 0; r < this.edges.length; r++) {
      const i = this.edges[r][2], s = Object.assign([], this.edges[r][0]), a = Object.assign([], this.edges[r][1]);
      if (s.length === 0 && a.length === 0) {
        e.push(i);
        continue;
      }
      s.unshift(this.points[i[0]][0]), s.push(this.points[i[1]][0]), a.unshift(this.points[i[0]][1]), a.push(this.points[i[1]][1]);
      const c = [s, a].map((h) => {
        const u = h.map((d, y, E) => {
          if (y === 0) return 0;
          const k = E[y - 1];
          return Math.sqrt(
            Math.pow(d[0] - k[0], 2) + Math.pow(d[1] - k[1], 2)
          );
        }), f = u.reduce((d, y, E) => E === 0 ? [0] : (d.push(d[E - 1] + y), d), []);
        return f.map((d, y, E) => {
          const k = d / E[E.length - 1];
          return [h[y], u[y], f[y], k];
        });
      });
      c.map((h, u) => {
        const f = c[u ? 0 : 1];
        return h.filter((d, y) => !(y === 0 || y === h.length - 1 || d[4] === "handled")).map((d) => {
          const y = d[0], E = d[3], k = f.reduce(
            (X, C, m, v) => {
              if (X) return X;
              const l = v[m + 1];
              if (C[3] === E)
                return C[4] = "handled", [C];
              if (C[3] < E && l && l[3] > E)
                return [C, l];
            },
            void 0
          );
          if (k && k.length === 1)
            return u === 0 ? [y, k[0][0], E] : [k[0][0], y, E];
          if (k && k.length === 2) {
            const X = k[0], C = k[1], m = (E - X[3]) / (C[3] - X[3]), v = [
              (C[0][0] - X[0][0]) * m + X[0][0],
              (C[0][1] - X[0][1]) * m + X[0][1]
            ];
            return u === 0 ? [y, v, E] : [v, y, E];
          }
          return [];
        });
      }).reduce((h, u) => h.concat(u), []).sort((h, u) => h[2] < u[2] ? -1 : 1).map((h, u, f) => {
        this.edgeNodes[n] = [
          h[0],
          h[1]
        ];
        const d = Fe(
          h[0],
          h[1],
          `e${n}`
        );
        n++, t.forw.push(d), t.bakw.push(Le(d)), u === 0 ? e.push([i[0], t.forw.length - 1]) : e.push([
          t.forw.length - 2,
          t.forw.length - 1
        ]), u === f.length - 1 && e.push([t.forw.length - 1, i[1]]);
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
    if (!this.points.reduce((a, c) => a && (this.bounds ? cr(c[0], this.boundsPolygon) : c[0][0] >= t && c[0][0] <= e && c[0][1] >= n && c[0][1] <= r), !0))
      throw "SOME POINTS OUTSIDE";
    let s = [];
    return this.wh && (s = [[t, n], [e, n], [t, r], [e, r]]), {
      pointsSet: this.generatePointsSet(),
      bbox: s,
      minx: t,
      maxx: e,
      miny: n,
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
    t !== Xt.MODE_STRICT && t !== Xt.MODE_LOOSE && (t = Xt.MODE_AUTO);
    const { pointsSet: e, bbox: n, minx: r, maxx: i, miny: s, maxy: a } = this.validateAndPrepareInputs(), c = {
      forw: Kt(e.forw),
      bakw: Kt(e.bakw)
    }, h = Te(
      c.forw,
      e.edges,
      "target"
    ), u = Te(
      c.bakw,
      e.edges,
      "target"
    );
    if (h.features.length === 0 || u.features.length === 0)
      throw "TOO LINEAR1";
    const f = fr(c.forw), d = vn(c.forw);
    if (!d) throw "TOO LINEAR2";
    const y = {}, E = d.geometry.coordinates[0];
    let k;
    try {
      k = E.map((b) => ({
        forw: b,
        bakw: jt.transformArr(de(b), h)
      })), k.forEach((b) => {
        y[`${b.forw[0]}:${b.forw[1]}`] = b;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const X = vn(c.bakw);
    if (!X) throw "TOO LINEAR2";
    const C = X.geometry.coordinates[0];
    try {
      k = C.map((b) => ({
        bakw: b,
        forw: jt.transformArr(de(b), u)
      })), k.forEach((b) => {
        y[`${b.forw[0]}:${b.forw[1]}`] = b;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const m = {
      forw: f.geometry.coordinates,
      bakw: jt.transformArr(f, h)
    }, v = Fe(m.forw, m.bakw, "c");
    this.centroid = {
      forw: v,
      bakw: Le(v)
    };
    const l = {
      convexBuf: y,
      centroid: m,
      bbox: n,
      minx: r,
      maxx: i,
      miny: s,
      maxy: a
    }, g = this.vertexMode === Xt.VERTEX_BIRDEYE ? Zr(l) : Hr(l), x = {
      forw: [],
      bakw: []
    };
    for (let b = 0; b < g.length; b++) {
      const T = g[b].forw, R = g[b].bakw, D = Fe(T, R, `b${b}`), Q = Le(D);
      e.forw.push(D), e.bakw.push(Q), x.forw.push(D), x.bakw.push(Q);
    }
    this.pointsSet = {
      forw: Kt(e.forw),
      bakw: Kt(e.bakw),
      edges: e.edges
    }, this.tins = {
      forw: jt.rotateVerticesTriangle(
        Te(
          this.pointsSet.forw,
          e.edges,
          "target"
        )
      )
    }, (t === Xt.MODE_STRICT || t === Xt.MODE_AUTO) && this.calcurateStrictTin(), (t === Xt.MODE_LOOSE || t === Xt.MODE_AUTO && this.strict_status === Xt.STATUS_ERROR) && (this.tins.bakw = jt.rotateVerticesTriangle(
      Te(
        this.pointsSet.bakw,
        e.edges,
        "target"
      )
    ), delete this.kinks, this.strict_status = Xt.STATUS_LOOSE), this.vertices_params = {
      forw: On(x.forw, this.centroid.forw),
      bakw: On(x.bakw, this.centroid.bakw)
    }, this.addIndexedTin();
    const A = ["forw"];
    this.strict_status === Xt.STATUS_LOOSE && A.push("bakw");
    const I = this.strict_status === Xt.STATUS_STRICT;
    this.pointsWeightBuffer = Mi({
      tins: this.tins,
      targets: A,
      includeReciprocals: I
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
const Oi = jt.format_version;
export {
  Xt as Tin,
  Te as constrainedTin,
  Le as counterPoint,
  Fe as createPoint,
  Xt as default,
  ti as findIntersections,
  Oi as format_version,
  jn as insertSearchIndex,
  On as vertexCalc
};
