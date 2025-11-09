const pt = 11102230246251565e-32, z = 134217729, Sn = (3 + 8 * pt) * pt;
function ut(r, t, e, n, s) {
  let i, o, a, c, f = t[0], l = n[0], h = 0, u = 0;
  l > f == l > -f ? (i = f, f = t[++h]) : (i = l, l = n[++u]);
  let p = 0;
  if (h < r && u < e)
    for (l > f == l > -f ? (o = f + i, a = i - (o - f), f = t[++h]) : (o = l + i, a = i - (o - l), l = n[++u]), i = o, a !== 0 && (s[p++] = a); h < r && u < e; )
      l > f == l > -f ? (o = i + f, c = o - i, a = i - (o - c) + (f - c), f = t[++h]) : (o = i + l, c = o - i, a = i - (o - c) + (l - c), l = n[++u]), i = o, a !== 0 && (s[p++] = a);
  for (; h < r; )
    o = i + f, c = o - i, a = i - (o - c) + (f - c), f = t[++h], i = o, a !== 0 && (s[p++] = a);
  for (; u < e; )
    o = i + l, c = o - i, a = i - (o - c) + (l - c), l = n[++u], i = o, a !== 0 && (s[p++] = a);
  return (i !== 0 || p === 0) && (s[p++] = i), p;
}
function bt(r, t, e, n, s, i, o, a) {
  return ut(ut(r, t, e, n, o), o, s, i, a);
}
function F(r, t, e, n) {
  let s, i, o, a, c, f, l, h, u, p, x;
  l = z * e, p = l - (l - e), x = e - p;
  let m = t[0];
  s = m * e, l = z * m, h = l - (l - m), u = m - h, o = u * x - (s - h * p - u * p - h * x);
  let E = 0;
  o !== 0 && (n[E++] = o);
  for (let S = 1; S < r; S++)
    m = t[S], a = m * e, l = z * m, h = l - (l - m), u = m - h, c = u * x - (a - h * p - u * p - h * x), i = s + c, f = i - s, o = s - (i - f) + (c - f), o !== 0 && (n[E++] = o), s = a + i, o = i - (s - a), o !== 0 && (n[E++] = o);
  return (s !== 0 || E === 0) && (n[E++] = s), E;
}
function kn(r, t) {
  let e = t[0];
  for (let n = 1; n < r; n++) e += t[n];
  return e;
}
function tt(r) {
  return new Float64Array(r);
}
const zn = (3 + 16 * pt) * pt, Vn = (2 + 12 * pt) * pt, Jn = (9 + 64 * pt) * pt * pt, qt = tt(4), qe = tt(8), ze = tt(12), Ve = tt(16), mt = tt(4);
function Wn(r, t, e, n, s, i, o) {
  let a, c, f, l, h, u, p, x, m, E, S, g, y, d, v, b, O, P;
  const _ = r - s, I = e - s, X = t - i, Y = n - i;
  d = _ * Y, u = z * _, p = u - (u - _), x = _ - p, u = z * Y, m = u - (u - Y), E = Y - m, v = x * E - (d - p * m - x * m - p * E), b = X * I, u = z * X, p = u - (u - X), x = X - p, u = z * I, m = u - (u - I), E = I - m, O = x * E - (b - p * m - x * m - p * E), S = v - O, h = v - S, qt[0] = v - (S + h) + (h - O), g = d + S, h = g - d, y = d - (g - h) + (S - h), S = y - b, h = y - S, qt[1] = y - (S + h) + (h - b), P = g + S, h = P - g, qt[2] = g - (P - h) + (S - h), qt[3] = P;
  let L = kn(4, qt), w = Vn * o;
  if (L >= w || -L >= w || (h = r - _, a = r - (_ + h) + (h - s), h = e - I, f = e - (I + h) + (h - s), h = t - X, c = t - (X + h) + (h - i), h = n - Y, l = n - (Y + h) + (h - i), a === 0 && c === 0 && f === 0 && l === 0) || (w = Jn * o + Sn * Math.abs(L), L += _ * l + Y * a - (X * f + I * c), L >= w || -L >= w)) return L;
  d = a * Y, u = z * a, p = u - (u - a), x = a - p, u = z * Y, m = u - (u - Y), E = Y - m, v = x * E - (d - p * m - x * m - p * E), b = c * I, u = z * c, p = u - (u - c), x = c - p, u = z * I, m = u - (u - I), E = I - m, O = x * E - (b - p * m - x * m - p * E), S = v - O, h = v - S, mt[0] = v - (S + h) + (h - O), g = d + S, h = g - d, y = d - (g - h) + (S - h), S = y - b, h = y - S, mt[1] = y - (S + h) + (h - b), P = g + S, h = P - g, mt[2] = g - (P - h) + (S - h), mt[3] = P;
  const A = ut(4, qt, 4, mt, qe);
  d = _ * l, u = z * _, p = u - (u - _), x = _ - p, u = z * l, m = u - (u - l), E = l - m, v = x * E - (d - p * m - x * m - p * E), b = X * f, u = z * X, p = u - (u - X), x = X - p, u = z * f, m = u - (u - f), E = f - m, O = x * E - (b - p * m - x * m - p * E), S = v - O, h = v - S, mt[0] = v - (S + h) + (h - O), g = d + S, h = g - d, y = d - (g - h) + (S - h), S = y - b, h = y - S, mt[1] = y - (S + h) + (h - b), P = g + S, h = P - g, mt[2] = g - (P - h) + (S - h), mt[3] = P;
  const k = ut(A, qe, 4, mt, ze);
  d = a * l, u = z * a, p = u - (u - a), x = a - p, u = z * l, m = u - (u - l), E = l - m, v = x * E - (d - p * m - x * m - p * E), b = c * f, u = z * c, p = u - (u - c), x = c - p, u = z * f, m = u - (u - f), E = f - m, O = x * E - (b - p * m - x * m - p * E), S = v - O, h = v - S, mt[0] = v - (S + h) + (h - O), g = d + S, h = g - d, y = d - (g - h) + (S - h), S = y - b, h = y - S, mt[1] = y - (S + h) + (h - b), P = g + S, h = P - g, mt[2] = g - (P - h) + (S - h), mt[3] = P;
  const B = ut(k, ze, 4, mt, Ve);
  return Ve[B - 1];
}
function Ot(r, t, e, n, s, i) {
  const o = (t - i) * (e - s), a = (r - s) * (n - i), c = o - a, f = Math.abs(o + a);
  return Math.abs(c) >= zn * f ? c : -Wn(r, t, e, n, s, i, f);
}
const Kn = (10 + 96 * pt) * pt, Gn = (4 + 48 * pt) * pt, Qn = (44 + 576 * pt) * pt * pt, Nt = tt(4), Xt = tt(4), Yt = tt(4), St = tt(4), kt = tt(4), Et = tt(4), gt = tt(4), wt = tt(4), Se = tt(8), ke = tt(8), Ee = tt(8), Ae = tt(8), Oe = tt(8), Pe = tt(8), ie = tt(8), se = tt(8), oe = tt(8), Ft = tt(4), Dt = tt(4), Lt = tt(4), V = tt(8), K = tt(16), nt = tt(16), rt = tt(16), et = tt(32), Rt = tt(32), ct = tt(48), vt = tt(64);
let Wt = tt(1152), Ie = tt(1152);
function ht(r, t, e) {
  r = ut(r, Wt, t, e, Ie);
  const n = Wt;
  return Wt = Ie, Ie = n, r;
}
function Hn(r, t, e, n, s, i, o, a, c) {
  let f, l, h, u, p, x, m, E, S, g, y, d, v, b, O, P, _, I, X, Y, L, w, A, k, B, N, C, M, T, R, D, j, $, q, U;
  const W = r - o, J = e - o, G = s - o, Q = t - a, Z = n - a, H = i - a;
  D = J * H, A = z * J, k = A - (A - J), B = J - k, A = z * H, N = A - (A - H), C = H - N, j = B * C - (D - k * N - B * N - k * C), $ = G * Z, A = z * G, k = A - (A - G), B = G - k, A = z * Z, N = A - (A - Z), C = Z - N, q = B * C - ($ - k * N - B * N - k * C), M = j - q, w = j - M, Nt[0] = j - (M + w) + (w - q), T = D + M, w = T - D, R = D - (T - w) + (M - w), M = R - $, w = R - M, Nt[1] = R - (M + w) + (w - $), U = T + M, w = U - T, Nt[2] = T - (U - w) + (M - w), Nt[3] = U, D = G * Q, A = z * G, k = A - (A - G), B = G - k, A = z * Q, N = A - (A - Q), C = Q - N, j = B * C - (D - k * N - B * N - k * C), $ = W * H, A = z * W, k = A - (A - W), B = W - k, A = z * H, N = A - (A - H), C = H - N, q = B * C - ($ - k * N - B * N - k * C), M = j - q, w = j - M, Xt[0] = j - (M + w) + (w - q), T = D + M, w = T - D, R = D - (T - w) + (M - w), M = R - $, w = R - M, Xt[1] = R - (M + w) + (w - $), U = T + M, w = U - T, Xt[2] = T - (U - w) + (M - w), Xt[3] = U, D = W * Z, A = z * W, k = A - (A - W), B = W - k, A = z * Z, N = A - (A - Z), C = Z - N, j = B * C - (D - k * N - B * N - k * C), $ = J * Q, A = z * J, k = A - (A - J), B = J - k, A = z * Q, N = A - (A - Q), C = Q - N, q = B * C - ($ - k * N - B * N - k * C), M = j - q, w = j - M, Yt[0] = j - (M + w) + (w - q), T = D + M, w = T - D, R = D - (T - w) + (M - w), M = R - $, w = R - M, Yt[1] = R - (M + w) + (w - $), U = T + M, w = U - T, Yt[2] = T - (U - w) + (M - w), Yt[3] = U, f = ut(
    ut(
      ut(
        F(F(4, Nt, W, V), V, W, K),
        K,
        F(F(4, Nt, Q, V), V, Q, nt),
        nt,
        et
      ),
      et,
      ut(
        F(F(4, Xt, J, V), V, J, K),
        K,
        F(F(4, Xt, Z, V), V, Z, nt),
        nt,
        Rt
      ),
      Rt,
      vt
    ),
    vt,
    ut(
      F(F(4, Yt, G, V), V, G, K),
      K,
      F(F(4, Yt, H, V), V, H, nt),
      nt,
      et
    ),
    et,
    Wt
  );
  let at = kn(f, Wt), lt = Gn * c;
  if (at >= lt || -at >= lt || (w = r - W, l = r - (W + w) + (w - o), w = t - Q, p = t - (Q + w) + (w - a), w = e - J, h = e - (J + w) + (w - o), w = n - Z, x = n - (Z + w) + (w - a), w = s - G, u = s - (G + w) + (w - o), w = i - H, m = i - (H + w) + (w - a), l === 0 && h === 0 && u === 0 && p === 0 && x === 0 && m === 0) || (lt = Qn * c + Sn * Math.abs(at), at += (W * W + Q * Q) * (J * m + H * h - (Z * u + G * x)) + 2 * (W * l + Q * p) * (J * H - Z * G) + ((J * J + Z * Z) * (G * p + Q * u - (H * l + W * m)) + 2 * (J * h + Z * x) * (G * Q - H * W)) + ((G * G + H * H) * (W * x + Z * l - (Q * h + J * p)) + 2 * (G * u + H * m) * (W * Z - Q * J)), at >= lt || -at >= lt))
    return at;
  if ((h !== 0 || x !== 0 || u !== 0 || m !== 0) && (D = W * W, A = z * W, k = A - (A - W), B = W - k, j = B * B - (D - k * k - (k + k) * B), $ = Q * Q, A = z * Q, k = A - (A - Q), B = Q - k, q = B * B - ($ - k * k - (k + k) * B), M = j + q, w = M - j, St[0] = j - (M - w) + (q - w), T = D + M, w = T - D, R = D - (T - w) + (M - w), M = R + $, w = M - R, St[1] = R - (M - w) + ($ - w), U = T + M, w = U - T, St[2] = T - (U - w) + (M - w), St[3] = U), (u !== 0 || m !== 0 || l !== 0 || p !== 0) && (D = J * J, A = z * J, k = A - (A - J), B = J - k, j = B * B - (D - k * k - (k + k) * B), $ = Z * Z, A = z * Z, k = A - (A - Z), B = Z - k, q = B * B - ($ - k * k - (k + k) * B), M = j + q, w = M - j, kt[0] = j - (M - w) + (q - w), T = D + M, w = T - D, R = D - (T - w) + (M - w), M = R + $, w = M - R, kt[1] = R - (M - w) + ($ - w), U = T + M, w = U - T, kt[2] = T - (U - w) + (M - w), kt[3] = U), (l !== 0 || p !== 0 || h !== 0 || x !== 0) && (D = G * G, A = z * G, k = A - (A - G), B = G - k, j = B * B - (D - k * k - (k + k) * B), $ = H * H, A = z * H, k = A - (A - H), B = H - k, q = B * B - ($ - k * k - (k + k) * B), M = j + q, w = M - j, Et[0] = j - (M - w) + (q - w), T = D + M, w = T - D, R = D - (T - w) + (M - w), M = R + $, w = M - R, Et[1] = R - (M - w) + ($ - w), U = T + M, w = U - T, Et[2] = T - (U - w) + (M - w), Et[3] = U), l !== 0 && (E = F(4, Nt, l, Se), f = ht(f, bt(
    F(E, Se, 2 * W, K),
    K,
    F(F(4, Et, l, V), V, Z, nt),
    nt,
    F(F(4, kt, l, V), V, -H, rt),
    rt,
    et,
    ct
  ), ct)), p !== 0 && (S = F(4, Nt, p, ke), f = ht(f, bt(
    F(S, ke, 2 * Q, K),
    K,
    F(F(4, kt, p, V), V, G, nt),
    nt,
    F(F(4, Et, p, V), V, -J, rt),
    rt,
    et,
    ct
  ), ct)), h !== 0 && (g = F(4, Xt, h, Ee), f = ht(f, bt(
    F(g, Ee, 2 * J, K),
    K,
    F(F(4, St, h, V), V, H, nt),
    nt,
    F(F(4, Et, h, V), V, -Q, rt),
    rt,
    et,
    ct
  ), ct)), x !== 0 && (y = F(4, Xt, x, Ae), f = ht(f, bt(
    F(y, Ae, 2 * Z, K),
    K,
    F(F(4, Et, x, V), V, W, nt),
    nt,
    F(F(4, St, x, V), V, -G, rt),
    rt,
    et,
    ct
  ), ct)), u !== 0 && (d = F(4, Yt, u, Oe), f = ht(f, bt(
    F(d, Oe, 2 * G, K),
    K,
    F(F(4, kt, u, V), V, Q, nt),
    nt,
    F(F(4, St, u, V), V, -Z, rt),
    rt,
    et,
    ct
  ), ct)), m !== 0 && (v = F(4, Yt, m, Pe), f = ht(f, bt(
    F(v, Pe, 2 * H, K),
    K,
    F(F(4, St, m, V), V, J, nt),
    nt,
    F(F(4, kt, m, V), V, -W, rt),
    rt,
    et,
    ct
  ), ct)), l !== 0 || p !== 0) {
    if (h !== 0 || x !== 0 || u !== 0 || m !== 0 ? (D = h * H, A = z * h, k = A - (A - h), B = h - k, A = z * H, N = A - (A - H), C = H - N, j = B * C - (D - k * N - B * N - k * C), $ = J * m, A = z * J, k = A - (A - J), B = J - k, A = z * m, N = A - (A - m), C = m - N, q = B * C - ($ - k * N - B * N - k * C), M = j + q, w = M - j, gt[0] = j - (M - w) + (q - w), T = D + M, w = T - D, R = D - (T - w) + (M - w), M = R + $, w = M - R, gt[1] = R - (M - w) + ($ - w), U = T + M, w = U - T, gt[2] = T - (U - w) + (M - w), gt[3] = U, D = u * -Z, A = z * u, k = A - (A - u), B = u - k, A = z * -Z, N = A - (A - -Z), C = -Z - N, j = B * C - (D - k * N - B * N - k * C), $ = G * -x, A = z * G, k = A - (A - G), B = G - k, A = z * -x, N = A - (A - -x), C = -x - N, q = B * C - ($ - k * N - B * N - k * C), M = j + q, w = M - j, wt[0] = j - (M - w) + (q - w), T = D + M, w = T - D, R = D - (T - w) + (M - w), M = R + $, w = M - R, wt[1] = R - (M - w) + ($ - w), U = T + M, w = U - T, wt[2] = T - (U - w) + (M - w), wt[3] = U, O = ut(4, gt, 4, wt, se), D = h * m, A = z * h, k = A - (A - h), B = h - k, A = z * m, N = A - (A - m), C = m - N, j = B * C - (D - k * N - B * N - k * C), $ = u * x, A = z * u, k = A - (A - u), B = u - k, A = z * x, N = A - (A - x), C = x - N, q = B * C - ($ - k * N - B * N - k * C), M = j - q, w = j - M, Dt[0] = j - (M + w) + (w - q), T = D + M, w = T - D, R = D - (T - w) + (M - w), M = R - $, w = R - M, Dt[1] = R - (M + w) + (w - $), U = T + M, w = U - T, Dt[2] = T - (U - w) + (M - w), Dt[3] = U, I = 4) : (se[0] = 0, O = 1, Dt[0] = 0, I = 1), l !== 0) {
      const st = F(O, se, l, rt);
      f = ht(f, ut(
        F(E, Se, l, K),
        K,
        F(st, rt, 2 * W, et),
        et,
        ct
      ), ct);
      const ot = F(I, Dt, l, V);
      f = ht(f, bt(
        F(ot, V, 2 * W, K),
        K,
        F(ot, V, l, nt),
        nt,
        F(st, rt, l, et),
        et,
        Rt,
        vt
      ), vt), x !== 0 && (f = ht(f, F(F(4, Et, l, V), V, x, K), K)), m !== 0 && (f = ht(f, F(F(4, kt, -l, V), V, m, K), K));
    }
    if (p !== 0) {
      const st = F(O, se, p, rt);
      f = ht(f, ut(
        F(S, ke, p, K),
        K,
        F(st, rt, 2 * Q, et),
        et,
        ct
      ), ct);
      const ot = F(I, Dt, p, V);
      f = ht(f, bt(
        F(ot, V, 2 * Q, K),
        K,
        F(ot, V, p, nt),
        nt,
        F(st, rt, p, et),
        et,
        Rt,
        vt
      ), vt);
    }
  }
  if (h !== 0 || x !== 0) {
    if (u !== 0 || m !== 0 || l !== 0 || p !== 0 ? (D = u * Q, A = z * u, k = A - (A - u), B = u - k, A = z * Q, N = A - (A - Q), C = Q - N, j = B * C - (D - k * N - B * N - k * C), $ = G * p, A = z * G, k = A - (A - G), B = G - k, A = z * p, N = A - (A - p), C = p - N, q = B * C - ($ - k * N - B * N - k * C), M = j + q, w = M - j, gt[0] = j - (M - w) + (q - w), T = D + M, w = T - D, R = D - (T - w) + (M - w), M = R + $, w = M - R, gt[1] = R - (M - w) + ($ - w), U = T + M, w = U - T, gt[2] = T - (U - w) + (M - w), gt[3] = U, Y = -H, L = -m, D = l * Y, A = z * l, k = A - (A - l), B = l - k, A = z * Y, N = A - (A - Y), C = Y - N, j = B * C - (D - k * N - B * N - k * C), $ = W * L, A = z * W, k = A - (A - W), B = W - k, A = z * L, N = A - (A - L), C = L - N, q = B * C - ($ - k * N - B * N - k * C), M = j + q, w = M - j, wt[0] = j - (M - w) + (q - w), T = D + M, w = T - D, R = D - (T - w) + (M - w), M = R + $, w = M - R, wt[1] = R - (M - w) + ($ - w), U = T + M, w = U - T, wt[2] = T - (U - w) + (M - w), wt[3] = U, P = ut(4, gt, 4, wt, oe), D = u * p, A = z * u, k = A - (A - u), B = u - k, A = z * p, N = A - (A - p), C = p - N, j = B * C - (D - k * N - B * N - k * C), $ = l * m, A = z * l, k = A - (A - l), B = l - k, A = z * m, N = A - (A - m), C = m - N, q = B * C - ($ - k * N - B * N - k * C), M = j - q, w = j - M, Lt[0] = j - (M + w) + (w - q), T = D + M, w = T - D, R = D - (T - w) + (M - w), M = R - $, w = R - M, Lt[1] = R - (M + w) + (w - $), U = T + M, w = U - T, Lt[2] = T - (U - w) + (M - w), Lt[3] = U, X = 4) : (oe[0] = 0, P = 1, Lt[0] = 0, X = 1), h !== 0) {
      const st = F(P, oe, h, rt);
      f = ht(f, ut(
        F(g, Ee, h, K),
        K,
        F(st, rt, 2 * J, et),
        et,
        ct
      ), ct);
      const ot = F(X, Lt, h, V);
      f = ht(f, bt(
        F(ot, V, 2 * J, K),
        K,
        F(ot, V, h, nt),
        nt,
        F(st, rt, h, et),
        et,
        Rt,
        vt
      ), vt), m !== 0 && (f = ht(f, F(F(4, St, h, V), V, m, K), K)), p !== 0 && (f = ht(f, F(F(4, Et, -h, V), V, p, K), K));
    }
    if (x !== 0) {
      const st = F(P, oe, x, rt);
      f = ht(f, ut(
        F(y, Ae, x, K),
        K,
        F(st, rt, 2 * Z, et),
        et,
        ct
      ), ct);
      const ot = F(X, Lt, x, V);
      f = ht(f, bt(
        F(ot, V, 2 * Z, K),
        K,
        F(ot, V, x, nt),
        nt,
        F(st, rt, x, et),
        et,
        Rt,
        vt
      ), vt);
    }
  }
  if (u !== 0 || m !== 0) {
    if (l !== 0 || p !== 0 || h !== 0 || x !== 0 ? (D = l * Z, A = z * l, k = A - (A - l), B = l - k, A = z * Z, N = A - (A - Z), C = Z - N, j = B * C - (D - k * N - B * N - k * C), $ = W * x, A = z * W, k = A - (A - W), B = W - k, A = z * x, N = A - (A - x), C = x - N, q = B * C - ($ - k * N - B * N - k * C), M = j + q, w = M - j, gt[0] = j - (M - w) + (q - w), T = D + M, w = T - D, R = D - (T - w) + (M - w), M = R + $, w = M - R, gt[1] = R - (M - w) + ($ - w), U = T + M, w = U - T, gt[2] = T - (U - w) + (M - w), gt[3] = U, Y = -Q, L = -p, D = h * Y, A = z * h, k = A - (A - h), B = h - k, A = z * Y, N = A - (A - Y), C = Y - N, j = B * C - (D - k * N - B * N - k * C), $ = J * L, A = z * J, k = A - (A - J), B = J - k, A = z * L, N = A - (A - L), C = L - N, q = B * C - ($ - k * N - B * N - k * C), M = j + q, w = M - j, wt[0] = j - (M - w) + (q - w), T = D + M, w = T - D, R = D - (T - w) + (M - w), M = R + $, w = M - R, wt[1] = R - (M - w) + ($ - w), U = T + M, w = U - T, wt[2] = T - (U - w) + (M - w), wt[3] = U, b = ut(4, gt, 4, wt, ie), D = l * x, A = z * l, k = A - (A - l), B = l - k, A = z * x, N = A - (A - x), C = x - N, j = B * C - (D - k * N - B * N - k * C), $ = h * p, A = z * h, k = A - (A - h), B = h - k, A = z * p, N = A - (A - p), C = p - N, q = B * C - ($ - k * N - B * N - k * C), M = j - q, w = j - M, Ft[0] = j - (M + w) + (w - q), T = D + M, w = T - D, R = D - (T - w) + (M - w), M = R - $, w = R - M, Ft[1] = R - (M + w) + (w - $), U = T + M, w = U - T, Ft[2] = T - (U - w) + (M - w), Ft[3] = U, _ = 4) : (ie[0] = 0, b = 1, Ft[0] = 0, _ = 1), u !== 0) {
      const st = F(b, ie, u, rt);
      f = ht(f, ut(
        F(d, Oe, u, K),
        K,
        F(st, rt, 2 * G, et),
        et,
        ct
      ), ct);
      const ot = F(_, Ft, u, V);
      f = ht(f, bt(
        F(ot, V, 2 * G, K),
        K,
        F(ot, V, u, nt),
        nt,
        F(st, rt, u, et),
        et,
        Rt,
        vt
      ), vt), p !== 0 && (f = ht(f, F(F(4, kt, u, V), V, p, K), K)), x !== 0 && (f = ht(f, F(F(4, St, -u, V), V, x, K), K));
    }
    if (m !== 0) {
      const st = F(b, ie, m, rt);
      f = ht(f, ut(
        F(v, Pe, m, K),
        K,
        F(st, rt, 2 * H, et),
        et,
        ct
      ), ct);
      const ot = F(_, Ft, m, V);
      f = ht(f, bt(
        F(ot, V, 2 * H, K),
        K,
        F(ot, V, m, nt),
        nt,
        F(st, rt, m, et),
        et,
        Rt,
        vt
      ), vt);
    }
  }
  return Wt[f - 1];
}
function Zn(r, t, e, n, s, i, o, a) {
  const c = r - o, f = e - o, l = s - o, h = t - a, u = n - a, p = i - a, x = f * p, m = l * u, E = c * c + h * h, S = l * h, g = c * p, y = f * f + u * u, d = c * u, v = f * h, b = l * l + p * p, O = E * (x - m) + y * (S - g) + b * (d - v), P = (Math.abs(x) + Math.abs(m)) * E + (Math.abs(S) + Math.abs(g)) * y + (Math.abs(d) + Math.abs(v)) * b, _ = Kn * P;
  return O > _ || -O > _ ? O : Hn(r, t, e, n, s, i, o, a, P);
}
function tr(r, t) {
  var e, n, s = 0, i, o, a, c, f, l, h, u = r[0], p = r[1], x = t.length;
  for (e = 0; e < x; e++) {
    n = 0;
    var m = t[e], E = m.length - 1;
    if (l = m[0], l[0] !== m[E][0] && l[1] !== m[E][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (o = l[0] - u, a = l[1] - p, n; n < E; n++) {
      if (h = m[n + 1], c = h[0] - u, f = h[1] - p, a === 0 && f === 0) {
        if (c <= 0 && o >= 0 || o <= 0 && c >= 0)
          return 0;
      } else if (f >= 0 && a <= 0 || f <= 0 && a >= 0) {
        if (i = Ot(o, c, a, f, 0, 0), i === 0)
          return 0;
        (i > 0 && f > 0 && a <= 0 || i < 0 && f <= 0 && a > 0) && s++;
      }
      l = h, a = f, o = c;
    }
  }
  return s % 2 !== 0;
}
function ee(r, t, e = {}) {
  const n = { type: "Feature" };
  return (e.id === 0 || e.id) && (n.id = e.id), e.bbox && (n.bbox = e.bbox), n.properties = t || {}, n.geometry = r, n;
}
function jt(r, t, e = {}) {
  if (!r)
    throw new Error("coordinates is required");
  if (!Array.isArray(r))
    throw new Error("coordinates must be an Array");
  if (r.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!We(r[0]) || !We(r[1]))
    throw new Error("coordinates must contain numbers");
  return ee({
    type: "Point",
    coordinates: r
  }, t, e);
}
function ne(r, t, e = {}) {
  for (const s of r) {
    if (s.length < 4)
      throw new Error(
        "Each LinearRing of a Polygon must have 4 or more Positions."
      );
    if (s[s.length - 1].length !== s[0].length)
      throw new Error("First and last Position are not equivalent.");
    for (let i = 0; i < s[s.length - 1].length; i++)
      if (s[s.length - 1][i] !== s[0][i])
        throw new Error("First and last Position are not equivalent.");
  }
  return ee({
    type: "Polygon",
    coordinates: r
  }, t, e);
}
function Je(r, t, e = {}) {
  if (r.length < 2)
    throw new Error("coordinates must be an array of two or more positions");
  return ee({
    type: "LineString",
    coordinates: r
  }, t, e);
}
function Mt(r, t = {}) {
  const e = { type: "FeatureCollection" };
  return t.id && (e.id = t.id), t.bbox && (e.bbox = t.bbox), e.features = r, e;
}
function We(r) {
  return !isNaN(r) && r !== null && !Array.isArray(r);
}
function er(r) {
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
function nr(r) {
  return r.type === "Feature" ? r.geometry : r;
}
function rr(r, t, e = {}) {
  if (!r)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const n = er(r), s = nr(t), i = s.type, o = t.bbox;
  let a = s.coordinates;
  if (o && ir(n, o) === !1)
    return !1;
  i === "Polygon" && (a = [a]);
  let c = !1;
  for (var f = 0; f < a.length; ++f) {
    const l = tr(n, a[f]);
    if (l === 0) return !e.ignoreBoundary;
    l && (c = !0);
  }
  return c;
}
function ir(r, t) {
  return t[0] <= r[0] && t[1] <= r[1] && t[2] >= r[0] && t[3] >= r[1];
}
var sr = rr;
function Fe(r, t, e) {
  if (r !== null)
    for (var n, s, i, o, a, c, f, l = 0, h = 0, u, p = r.type, x = p === "FeatureCollection", m = p === "Feature", E = x ? r.features.length : 1, S = 0; S < E; S++) {
      f = x ? r.features[S].geometry : m ? r.geometry : r, u = f ? f.type === "GeometryCollection" : !1, a = u ? f.geometries.length : 1;
      for (var g = 0; g < a; g++) {
        var y = 0, d = 0;
        if (o = u ? f.geometries[g] : f, o !== null) {
          c = o.coordinates;
          var v = o.type;
          switch (l = e && (v === "Polygon" || v === "MultiPolygon") ? 1 : 0, v) {
            case null:
              break;
            case "Point":
              if (t(
                c,
                h,
                S,
                y,
                d
              ) === !1)
                return !1;
              h++, y++;
              break;
            case "LineString":
            case "MultiPoint":
              for (n = 0; n < c.length; n++) {
                if (t(
                  c[n],
                  h,
                  S,
                  y,
                  d
                ) === !1)
                  return !1;
                h++, v === "MultiPoint" && y++;
              }
              v === "LineString" && y++;
              break;
            case "Polygon":
            case "MultiLineString":
              for (n = 0; n < c.length; n++) {
                for (s = 0; s < c[n].length - l; s++) {
                  if (t(
                    c[n][s],
                    h,
                    S,
                    y,
                    d
                  ) === !1)
                    return !1;
                  h++;
                }
                v === "MultiLineString" && y++, v === "Polygon" && d++;
              }
              v === "Polygon" && y++;
              break;
            case "MultiPolygon":
              for (n = 0; n < c.length; n++) {
                for (d = 0, s = 0; s < c[n].length; s++) {
                  for (i = 0; i < c[n][s].length - l; i++) {
                    if (t(
                      c[n][s][i],
                      h,
                      S,
                      y,
                      d
                    ) === !1)
                      return !1;
                    h++;
                  }
                  d++;
                }
                y++;
              }
              break;
            case "GeometryCollection":
              for (n = 0; n < o.geometries.length; n++)
                if (Fe(o.geometries[n], t, e) === !1)
                  return !1;
              break;
            default:
              throw new Error("Unknown Geometry Type");
          }
        }
      }
    }
}
function or(r, t = {}) {
  let e = 0, n = 0, s = 0;
  return Fe(
    r,
    function(i) {
      e += i[0], n += i[1], s++;
    },
    !0
  ), jt([e / s, n / s], t.properties);
}
var ar = or;
function cr(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
function hr(r) {
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
var ae = { exports: {} }, ve = { exports: {} }, fr = ve.exports, Ke;
function lr() {
  return Ke || (Ke = 1, (function(r, t) {
    (function(e, n) {
      r.exports = n();
    })(fr, function() {
      function e(g, y, d, v, b) {
        (function O(P, _, I, X, Y) {
          for (; X > I; ) {
            if (X - I > 600) {
              var L = X - I + 1, w = _ - I + 1, A = Math.log(L), k = 0.5 * Math.exp(2 * A / 3), B = 0.5 * Math.sqrt(A * k * (L - k) / L) * (w - L / 2 < 0 ? -1 : 1), N = Math.max(I, Math.floor(_ - w * k / L + B)), C = Math.min(X, Math.floor(_ + (L - w) * k / L + B));
              O(P, _, N, C, Y);
            }
            var M = P[_], T = I, R = X;
            for (n(P, I, _), Y(P[X], M) > 0 && n(P, I, X); T < R; ) {
              for (n(P, T, R), T++, R--; Y(P[T], M) < 0; ) T++;
              for (; Y(P[R], M) > 0; ) R--;
            }
            Y(P[I], M) === 0 ? n(P, I, R) : n(P, ++R, X), R <= _ && (I = R + 1), _ <= R && (X = R - 1);
          }
        })(g, y, d || 0, v || g.length - 1, b || s);
      }
      function n(g, y, d) {
        var v = g[y];
        g[y] = g[d], g[d] = v;
      }
      function s(g, y) {
        return g < y ? -1 : g > y ? 1 : 0;
      }
      var i = function(g) {
        g === void 0 && (g = 9), this._maxEntries = Math.max(4, g), this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries)), this.clear();
      };
      function o(g, y, d) {
        if (!d) return y.indexOf(g);
        for (var v = 0; v < y.length; v++) if (d(g, y[v])) return v;
        return -1;
      }
      function a(g, y) {
        c(g, 0, g.children.length, y, g);
      }
      function c(g, y, d, v, b) {
        b || (b = E(null)), b.minX = 1 / 0, b.minY = 1 / 0, b.maxX = -1 / 0, b.maxY = -1 / 0;
        for (var O = y; O < d; O++) {
          var P = g.children[O];
          f(b, g.leaf ? v(P) : P);
        }
        return b;
      }
      function f(g, y) {
        return g.minX = Math.min(g.minX, y.minX), g.minY = Math.min(g.minY, y.minY), g.maxX = Math.max(g.maxX, y.maxX), g.maxY = Math.max(g.maxY, y.maxY), g;
      }
      function l(g, y) {
        return g.minX - y.minX;
      }
      function h(g, y) {
        return g.minY - y.minY;
      }
      function u(g) {
        return (g.maxX - g.minX) * (g.maxY - g.minY);
      }
      function p(g) {
        return g.maxX - g.minX + (g.maxY - g.minY);
      }
      function x(g, y) {
        return g.minX <= y.minX && g.minY <= y.minY && y.maxX <= g.maxX && y.maxY <= g.maxY;
      }
      function m(g, y) {
        return y.minX <= g.maxX && y.minY <= g.maxY && y.maxX >= g.minX && y.maxY >= g.minY;
      }
      function E(g) {
        return { children: g, height: 1, leaf: !0, minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
      }
      function S(g, y, d, v, b) {
        for (var O = [y, d]; O.length; ) if (!((d = O.pop()) - (y = O.pop()) <= v)) {
          var P = y + Math.ceil((d - y) / v / 2) * v;
          e(g, P, y, d, b), O.push(y, P, P, d);
        }
      }
      return i.prototype.all = function() {
        return this._all(this.data, []);
      }, i.prototype.search = function(g) {
        var y = this.data, d = [];
        if (!m(g, y)) return d;
        for (var v = this.toBBox, b = []; y; ) {
          for (var O = 0; O < y.children.length; O++) {
            var P = y.children[O], _ = y.leaf ? v(P) : P;
            m(g, _) && (y.leaf ? d.push(P) : x(g, _) ? this._all(P, d) : b.push(P));
          }
          y = b.pop();
        }
        return d;
      }, i.prototype.collides = function(g) {
        var y = this.data;
        if (!m(g, y)) return !1;
        for (var d = []; y; ) {
          for (var v = 0; v < y.children.length; v++) {
            var b = y.children[v], O = y.leaf ? this.toBBox(b) : b;
            if (m(g, O)) {
              if (y.leaf || x(g, O)) return !0;
              d.push(b);
            }
          }
          y = d.pop();
        }
        return !1;
      }, i.prototype.load = function(g) {
        if (!g || !g.length) return this;
        if (g.length < this._minEntries) {
          for (var y = 0; y < g.length; y++) this.insert(g[y]);
          return this;
        }
        var d = this._build(g.slice(), 0, g.length - 1, 0);
        if (this.data.children.length) if (this.data.height === d.height) this._splitRoot(this.data, d);
        else {
          if (this.data.height < d.height) {
            var v = this.data;
            this.data = d, d = v;
          }
          this._insert(d, this.data.height - d.height - 1, !0);
        }
        else this.data = d;
        return this;
      }, i.prototype.insert = function(g) {
        return g && this._insert(g, this.data.height - 1), this;
      }, i.prototype.clear = function() {
        return this.data = E([]), this;
      }, i.prototype.remove = function(g, y) {
        if (!g) return this;
        for (var d, v, b, O = this.data, P = this.toBBox(g), _ = [], I = []; O || _.length; ) {
          if (O || (O = _.pop(), v = _[_.length - 1], d = I.pop(), b = !0), O.leaf) {
            var X = o(g, O.children, y);
            if (X !== -1) return O.children.splice(X, 1), _.push(O), this._condense(_), this;
          }
          b || O.leaf || !x(O, P) ? v ? (d++, O = v.children[d], b = !1) : O = null : (_.push(O), I.push(d), d = 0, v = O, O = O.children[0]);
        }
        return this;
      }, i.prototype.toBBox = function(g) {
        return g;
      }, i.prototype.compareMinX = function(g, y) {
        return g.minX - y.minX;
      }, i.prototype.compareMinY = function(g, y) {
        return g.minY - y.minY;
      }, i.prototype.toJSON = function() {
        return this.data;
      }, i.prototype.fromJSON = function(g) {
        return this.data = g, this;
      }, i.prototype._all = function(g, y) {
        for (var d = []; g; ) g.leaf ? y.push.apply(y, g.children) : d.push.apply(d, g.children), g = d.pop();
        return y;
      }, i.prototype._build = function(g, y, d, v) {
        var b, O = d - y + 1, P = this._maxEntries;
        if (O <= P) return a(b = E(g.slice(y, d + 1)), this.toBBox), b;
        v || (v = Math.ceil(Math.log(O) / Math.log(P)), P = Math.ceil(O / Math.pow(P, v - 1))), (b = E([])).leaf = !1, b.height = v;
        var _ = Math.ceil(O / P), I = _ * Math.ceil(Math.sqrt(P));
        S(g, y, d, I, this.compareMinX);
        for (var X = y; X <= d; X += I) {
          var Y = Math.min(X + I - 1, d);
          S(g, X, Y, _, this.compareMinY);
          for (var L = X; L <= Y; L += _) {
            var w = Math.min(L + _ - 1, Y);
            b.children.push(this._build(g, L, w, v - 1));
          }
        }
        return a(b, this.toBBox), b;
      }, i.prototype._chooseSubtree = function(g, y, d, v) {
        for (; v.push(y), !y.leaf && v.length - 1 !== d; ) {
          for (var b = 1 / 0, O = 1 / 0, P = void 0, _ = 0; _ < y.children.length; _++) {
            var I = y.children[_], X = u(I), Y = (L = g, w = I, (Math.max(w.maxX, L.maxX) - Math.min(w.minX, L.minX)) * (Math.max(w.maxY, L.maxY) - Math.min(w.minY, L.minY)) - X);
            Y < O ? (O = Y, b = X < b ? X : b, P = I) : Y === O && X < b && (b = X, P = I);
          }
          y = P || y.children[0];
        }
        var L, w;
        return y;
      }, i.prototype._insert = function(g, y, d) {
        var v = d ? g : this.toBBox(g), b = [], O = this._chooseSubtree(v, this.data, y, b);
        for (O.children.push(g), f(O, v); y >= 0 && b[y].children.length > this._maxEntries; ) this._split(b, y), y--;
        this._adjustParentBBoxes(v, b, y);
      }, i.prototype._split = function(g, y) {
        var d = g[y], v = d.children.length, b = this._minEntries;
        this._chooseSplitAxis(d, b, v);
        var O = this._chooseSplitIndex(d, b, v), P = E(d.children.splice(O, d.children.length - O));
        P.height = d.height, P.leaf = d.leaf, a(d, this.toBBox), a(P, this.toBBox), y ? g[y - 1].children.push(P) : this._splitRoot(d, P);
      }, i.prototype._splitRoot = function(g, y) {
        this.data = E([g, y]), this.data.height = g.height + 1, this.data.leaf = !1, a(this.data, this.toBBox);
      }, i.prototype._chooseSplitIndex = function(g, y, d) {
        for (var v, b, O, P, _, I, X, Y = 1 / 0, L = 1 / 0, w = y; w <= d - y; w++) {
          var A = c(g, 0, w, this.toBBox), k = c(g, w, d, this.toBBox), B = (b = A, O = k, P = void 0, _ = void 0, I = void 0, X = void 0, P = Math.max(b.minX, O.minX), _ = Math.max(b.minY, O.minY), I = Math.min(b.maxX, O.maxX), X = Math.min(b.maxY, O.maxY), Math.max(0, I - P) * Math.max(0, X - _)), N = u(A) + u(k);
          B < Y ? (Y = B, v = w, L = N < L ? N : L) : B === Y && N < L && (L = N, v = w);
        }
        return v || d - y;
      }, i.prototype._chooseSplitAxis = function(g, y, d) {
        var v = g.leaf ? this.compareMinX : l, b = g.leaf ? this.compareMinY : h;
        this._allDistMargin(g, y, d, v) < this._allDistMargin(g, y, d, b) && g.children.sort(v);
      }, i.prototype._allDistMargin = function(g, y, d, v) {
        g.children.sort(v);
        for (var b = this.toBBox, O = c(g, 0, y, b), P = c(g, d - y, d, b), _ = p(O) + p(P), I = y; I < d - y; I++) {
          var X = g.children[I];
          f(O, g.leaf ? b(X) : X), _ += p(O);
        }
        for (var Y = d - y - 1; Y >= y; Y--) {
          var L = g.children[Y];
          f(P, g.leaf ? b(L) : L), _ += p(P);
        }
        return _;
      }, i.prototype._adjustParentBBoxes = function(g, y, d) {
        for (var v = d; v >= 0; v--) f(y[v], g);
      }, i.prototype._condense = function(g) {
        for (var y = g.length - 1, d = void 0; y >= 0; y--) g[y].children.length === 0 ? y > 0 ? (d = g[y - 1].children).splice(d.indexOf(g[y]), 1) : this.clear() : a(g[y], this.toBBox);
      }, i;
    });
  })(ve)), ve.exports;
}
let ur = class {
  constructor(t = [], e = dr) {
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
      const i = t - 1 >> 1, o = e[i];
      if (n(s, o) >= 0) break;
      e[t] = o, t = i;
    }
    e[t] = s;
  }
  _down(t) {
    const { data: e, compare: n } = this, s = this.length >> 1, i = e[t];
    for (; t < s; ) {
      let o = (t << 1) + 1, a = e[o];
      const c = o + 1;
      if (c < this.length && n(e[c], a) < 0 && (o = c, a = e[c]), n(a, i) >= 0) break;
      e[t] = a, t = o;
    }
    e[t] = i;
  }
};
function dr(r, t) {
  return r < t ? -1 : r > t ? 1 : 0;
}
const pr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ur
}, Symbol.toStringTag, { value: "Module" })), mr = /* @__PURE__ */ hr(pr);
var Gt = { exports: {} }, Be, Ge;
function gr() {
  return Ge || (Ge = 1, Be = function(t, e, n, s) {
    var i = t[0], o = t[1], a = !1;
    n === void 0 && (n = 0), s === void 0 && (s = e.length);
    for (var c = (s - n) / 2, f = 0, l = c - 1; f < c; l = f++) {
      var h = e[n + f * 2 + 0], u = e[n + f * 2 + 1], p = e[n + l * 2 + 0], x = e[n + l * 2 + 1], m = u > o != x > o && i < (p - h) * (o - u) / (x - u) + h;
      m && (a = !a);
    }
    return a;
  }), Be;
}
var Te, Qe;
function wr() {
  return Qe || (Qe = 1, Te = function(t, e, n, s) {
    var i = t[0], o = t[1], a = !1;
    n === void 0 && (n = 0), s === void 0 && (s = e.length);
    for (var c = s - n, f = 0, l = c - 1; f < c; l = f++) {
      var h = e[f + n][0], u = e[f + n][1], p = e[l + n][0], x = e[l + n][1], m = u > o != x > o && i < (p - h) * (o - u) / (x - u) + h;
      m && (a = !a);
    }
    return a;
  }), Te;
}
var He;
function yr() {
  if (He) return Gt.exports;
  He = 1;
  var r = gr(), t = wr();
  return Gt.exports = function(n, s, i, o) {
    return s.length > 0 && Array.isArray(s[0]) ? t(n, s, i, o) : r(n, s, i, o);
  }, Gt.exports.nested = t, Gt.exports.flat = r, Gt.exports;
}
var Zt = { exports: {} }, vr = Zt.exports, Ze;
function br() {
  return Ze || (Ze = 1, (function(r, t) {
    (function(e, n) {
      n(t);
    })(vr, function(e) {
      const s = 33306690738754706e-32;
      function i(m, E, S, g, y) {
        let d, v, b, O, P = E[0], _ = g[0], I = 0, X = 0;
        _ > P == _ > -P ? (d = P, P = E[++I]) : (d = _, _ = g[++X]);
        let Y = 0;
        if (I < m && X < S) for (_ > P == _ > -P ? (b = d - ((v = P + d) - P), P = E[++I]) : (b = d - ((v = _ + d) - _), _ = g[++X]), d = v, b !== 0 && (y[Y++] = b); I < m && X < S; ) _ > P == _ > -P ? (b = d - ((v = d + P) - (O = v - d)) + (P - O), P = E[++I]) : (b = d - ((v = d + _) - (O = v - d)) + (_ - O), _ = g[++X]), d = v, b !== 0 && (y[Y++] = b);
        for (; I < m; ) b = d - ((v = d + P) - (O = v - d)) + (P - O), P = E[++I], d = v, b !== 0 && (y[Y++] = b);
        for (; X < S; ) b = d - ((v = d + _) - (O = v - d)) + (_ - O), _ = g[++X], d = v, b !== 0 && (y[Y++] = b);
        return d === 0 && Y !== 0 || (y[Y++] = d), Y;
      }
      function o(m) {
        return new Float64Array(m);
      }
      const a = 33306690738754716e-32, c = 22204460492503146e-32, f = 11093356479670487e-47, l = o(4), h = o(8), u = o(12), p = o(16), x = o(4);
      e.orient2d = function(m, E, S, g, y, d) {
        const v = (E - d) * (S - y), b = (m - y) * (g - d), O = v - b;
        if (v === 0 || b === 0 || v > 0 != b > 0) return O;
        const P = Math.abs(v + b);
        return Math.abs(O) >= a * P ? O : -(function(_, I, X, Y, L, w, A) {
          let k, B, N, C, M, T, R, D, j, $, q, U, W, J, G, Q, Z, H;
          const at = _ - L, lt = X - L, st = I - w, ot = Y - w;
          M = (G = (D = at - (R = (T = 134217729 * at) - (T - at))) * ($ = ot - (j = (T = 134217729 * ot) - (T - ot))) - ((J = at * ot) - R * j - D * j - R * $)) - (q = G - (Z = (D = st - (R = (T = 134217729 * st) - (T - st))) * ($ = lt - (j = (T = 134217729 * lt) - (T - lt))) - ((Q = st * lt) - R * j - D * j - R * $))), l[0] = G - (q + M) + (M - Z), M = (W = J - ((U = J + q) - (M = U - J)) + (q - M)) - (q = W - Q), l[1] = W - (q + M) + (M - Q), M = (H = U + q) - U, l[2] = U - (H - M) + (q - M), l[3] = H;
          let Tt = (function(qn, Ue) {
            let je = Ue[0];
            for (let Me = 1; Me < qn; Me++) je += Ue[Me];
            return je;
          })(4, l), Kt = c * A;
          if (Tt >= Kt || -Tt >= Kt || (k = _ - (at + (M = _ - at)) + (M - L), N = X - (lt + (M = X - lt)) + (M - L), B = I - (st + (M = I - st)) + (M - w), C = Y - (ot + (M = Y - ot)) + (M - w), k === 0 && B === 0 && N === 0 && C === 0) || (Kt = f * A + s * Math.abs(Tt), (Tt += at * C + ot * k - (st * N + lt * B)) >= Kt || -Tt >= Kt)) return Tt;
          M = (G = (D = k - (R = (T = 134217729 * k) - (T - k))) * ($ = ot - (j = (T = 134217729 * ot) - (T - ot))) - ((J = k * ot) - R * j - D * j - R * $)) - (q = G - (Z = (D = B - (R = (T = 134217729 * B) - (T - B))) * ($ = lt - (j = (T = 134217729 * lt) - (T - lt))) - ((Q = B * lt) - R * j - D * j - R * $))), x[0] = G - (q + M) + (M - Z), M = (W = J - ((U = J + q) - (M = U - J)) + (q - M)) - (q = W - Q), x[1] = W - (q + M) + (M - Q), M = (H = U + q) - U, x[2] = U - (H - M) + (q - M), x[3] = H;
          const $n = i(4, l, 4, x, h);
          M = (G = (D = at - (R = (T = 134217729 * at) - (T - at))) * ($ = C - (j = (T = 134217729 * C) - (T - C))) - ((J = at * C) - R * j - D * j - R * $)) - (q = G - (Z = (D = st - (R = (T = 134217729 * st) - (T - st))) * ($ = N - (j = (T = 134217729 * N) - (T - N))) - ((Q = st * N) - R * j - D * j - R * $))), x[0] = G - (q + M) + (M - Z), M = (W = J - ((U = J + q) - (M = U - J)) + (q - M)) - (q = W - Q), x[1] = W - (q + M) + (M - Q), M = (H = U + q) - U, x[2] = U - (H - M) + (q - M), x[3] = H;
          const Un = i($n, h, 4, x, u);
          M = (G = (D = k - (R = (T = 134217729 * k) - (T - k))) * ($ = C - (j = (T = 134217729 * C) - (T - C))) - ((J = k * C) - R * j - D * j - R * $)) - (q = G - (Z = (D = B - (R = (T = 134217729 * B) - (T - B))) * ($ = N - (j = (T = 134217729 * N) - (T - N))) - ((Q = B * N) - R * j - D * j - R * $))), x[0] = G - (q + M) + (M - Z), M = (W = J - ((U = J + q) - (M = U - J)) + (q - M)) - (q = W - Q), x[1] = W - (q + M) + (M - Q), M = (H = U + q) - U, x[2] = U - (H - M) + (q - M), x[3] = H;
          const jn = i(Un, u, 4, x, p);
          return p[jn - 1];
        })(m, E, S, g, y, d, P);
      }, e.orient2dfast = function(m, E, S, g, y, d) {
        return (E - d) * (S - y) - (m - y) * (g - d);
      }, Object.defineProperty(e, "__esModule", { value: !0 });
    });
  })(Zt, Zt.exports)), Zt.exports;
}
var tn;
function _r() {
  if (tn) return ae.exports;
  tn = 1;
  var r = lr(), t = mr, e = yr(), n = br().orient2d;
  t.default && (t = t.default), ae.exports = s, ae.exports.default = s;
  function s(d, v, b) {
    v = Math.max(0, v === void 0 ? 2 : v), b = b || 0;
    var O = p(d), P = new r(16);
    P.toBBox = function(R) {
      return {
        minX: R[0],
        minY: R[1],
        maxX: R[0],
        maxY: R[1]
      };
    }, P.compareMinX = function(R, D) {
      return R[0] - D[0];
    }, P.compareMinY = function(R, D) {
      return R[1] - D[1];
    }, P.load(d);
    for (var _ = [], I = 0, X; I < O.length; I++) {
      var Y = O[I];
      P.remove(Y), X = x(Y, X), _.push(X);
    }
    var L = new r(16);
    for (I = 0; I < _.length; I++) L.insert(u(_[I]));
    for (var w = v * v, A = b * b; _.length; ) {
      var k = _.shift(), B = k.p, N = k.next.p, C = m(B, N);
      if (!(C < A)) {
        var M = C / w;
        Y = i(P, k.prev.p, B, N, k.next.next.p, M, L), Y && Math.min(m(Y, B), m(Y, N)) <= M && (_.push(k), _.push(x(Y, k)), P.remove(Y), L.remove(k), L.insert(u(k)), L.insert(u(k.next)));
      }
    }
    k = X;
    var T = [];
    do
      T.push(k.p), k = k.next;
    while (k !== X);
    return T.push(k.p), T;
  }
  function i(d, v, b, O, P, _, I) {
    for (var X = new t([], o), Y = d.data; Y; ) {
      for (var L = 0; L < Y.children.length; L++) {
        var w = Y.children[L], A = Y.leaf ? E(w, b, O) : a(b, O, w);
        A > _ || X.push({
          node: w,
          dist: A
        });
      }
      for (; X.length && !X.peek().node.children; ) {
        var k = X.pop(), B = k.node, N = E(B, v, b), C = E(B, O, P);
        if (k.dist < N && k.dist < C && f(b, B, I) && f(O, B, I)) return B;
      }
      Y = X.pop(), Y && (Y = Y.node);
    }
    return null;
  }
  function o(d, v) {
    return d.dist - v.dist;
  }
  function a(d, v, b) {
    if (c(d, b) || c(v, b)) return 0;
    var O = S(d[0], d[1], v[0], v[1], b.minX, b.minY, b.maxX, b.minY);
    if (O === 0) return 0;
    var P = S(d[0], d[1], v[0], v[1], b.minX, b.minY, b.minX, b.maxY);
    if (P === 0) return 0;
    var _ = S(d[0], d[1], v[0], v[1], b.maxX, b.minY, b.maxX, b.maxY);
    if (_ === 0) return 0;
    var I = S(d[0], d[1], v[0], v[1], b.minX, b.maxY, b.maxX, b.maxY);
    return I === 0 ? 0 : Math.min(O, P, _, I);
  }
  function c(d, v) {
    return d[0] >= v.minX && d[0] <= v.maxX && d[1] >= v.minY && d[1] <= v.maxY;
  }
  function f(d, v, b) {
    for (var O = Math.min(d[0], v[0]), P = Math.min(d[1], v[1]), _ = Math.max(d[0], v[0]), I = Math.max(d[1], v[1]), X = b.search({ minX: O, minY: P, maxX: _, maxY: I }), Y = 0; Y < X.length; Y++)
      if (h(X[Y].p, X[Y].next.p, d, v)) return !1;
    return !0;
  }
  function l(d, v, b) {
    return n(d[0], d[1], v[0], v[1], b[0], b[1]);
  }
  function h(d, v, b, O) {
    return d !== O && v !== b && l(d, v, b) > 0 != l(d, v, O) > 0 && l(b, O, d) > 0 != l(b, O, v) > 0;
  }
  function u(d) {
    var v = d.p, b = d.next.p;
    return d.minX = Math.min(v[0], b[0]), d.minY = Math.min(v[1], b[1]), d.maxX = Math.max(v[0], b[0]), d.maxY = Math.max(v[1], b[1]), d;
  }
  function p(d) {
    for (var v = d[0], b = d[0], O = d[0], P = d[0], _ = 0; _ < d.length; _++) {
      var I = d[_];
      I[0] < v[0] && (v = I), I[0] > O[0] && (O = I), I[1] < b[1] && (b = I), I[1] > P[1] && (P = I);
    }
    var X = [v, b, O, P], Y = X.slice();
    for (_ = 0; _ < d.length; _++)
      e(d[_], X) || Y.push(d[_]);
    return y(Y);
  }
  function x(d, v) {
    var b = {
      p: d,
      prev: null,
      next: null,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };
    return v ? (b.next = v.next, b.prev = v, v.next.prev = b, v.next = b) : (b.prev = b, b.next = b), b;
  }
  function m(d, v) {
    var b = d[0] - v[0], O = d[1] - v[1];
    return b * b + O * O;
  }
  function E(d, v, b) {
    var O = v[0], P = v[1], _ = b[0] - O, I = b[1] - P;
    if (_ !== 0 || I !== 0) {
      var X = ((d[0] - O) * _ + (d[1] - P) * I) / (_ * _ + I * I);
      X > 1 ? (O = b[0], P = b[1]) : X > 0 && (O += _ * X, P += I * X);
    }
    return _ = d[0] - O, I = d[1] - P, _ * _ + I * I;
  }
  function S(d, v, b, O, P, _, I, X) {
    var Y = b - d, L = O - v, w = I - P, A = X - _, k = d - P, B = v - _, N = Y * Y + L * L, C = Y * w + L * A, M = w * w + A * A, T = Y * k + L * B, R = w * k + A * B, D = N * M - C * C, j, $, q, U, W = D, J = D;
    D === 0 ? ($ = 0, W = 1, U = R, J = M) : ($ = C * R - M * T, U = N * R - C * T, $ < 0 ? ($ = 0, U = R, J = M) : $ > W && ($ = W, U = R + C, J = M)), U < 0 ? (U = 0, -T < 0 ? $ = 0 : -T > N ? $ = W : ($ = -T, W = N)) : U > J && (U = J, -T + C < 0 ? $ = 0 : -T + C > N ? $ = W : ($ = -T + C, W = N)), j = $ === 0 ? 0 : $ / W, q = U === 0 ? 0 : U / J;
    var G = (1 - j) * d + j * b, Q = (1 - j) * v + j * O, Z = (1 - q) * P + q * I, H = (1 - q) * _ + q * X, at = Z - G, lt = H - Q;
    return at * at + lt * lt;
  }
  function g(d, v) {
    return d[0] === v[0] ? d[1] - v[1] : d[0] - v[0];
  }
  function y(d) {
    d.sort(g);
    for (var v = [], b = 0; b < d.length; b++) {
      for (; v.length >= 2 && l(v[v.length - 2], v[v.length - 1], d[b]) <= 0; )
        v.pop();
      v.push(d[b]);
    }
    for (var O = [], P = d.length - 1; P >= 0; P--) {
      for (; O.length >= 2 && l(O[O.length - 2], O[O.length - 1], d[P]) <= 0; )
        O.pop();
      O.push(d[P]);
    }
    return O.pop(), v.pop(), v.concat(O);
  }
  return ae.exports;
}
var xr = _r();
const Mr = /* @__PURE__ */ cr(xr);
function Sr(r, t = {}) {
  t.concavity = t.concavity || 1 / 0;
  const e = [];
  if (Fe(r, (s) => {
    e.push([s[0], s[1]]);
  }), !e.length)
    return null;
  const n = Mr(e, t.concavity);
  return n.length > 3 ? ne([n]) : null;
}
var en = Sr, kr = Object.defineProperty, Er = (r, t, e) => t in r ? kr(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e, it = (r, t, e) => Er(r, typeof t != "symbol" ? t + "" : t, e);
const Bt = 11102230246251565e-32, dt = 134217729, Ar = (3 + 8 * Bt) * Bt;
function Ne(r, t, e, n, s) {
  let i, o, a, c, f = t[0], l = n[0], h = 0, u = 0;
  l > f == l > -f ? (i = f, f = t[++h]) : (i = l, l = n[++u]);
  let p = 0;
  if (h < r && u < e)
    for (l > f == l > -f ? (o = f + i, a = i - (o - f), f = t[++h]) : (o = l + i, a = i - (o - l), l = n[++u]), i = o, a !== 0 && (s[p++] = a); h < r && u < e; )
      l > f == l > -f ? (o = i + f, c = o - i, a = i - (o - c) + (f - c), f = t[++h]) : (o = i + l, c = o - i, a = i - (o - c) + (l - c), l = n[++u]), i = o, a !== 0 && (s[p++] = a);
  for (; h < r; )
    o = i + f, c = o - i, a = i - (o - c) + (f - c), f = t[++h], i = o, a !== 0 && (s[p++] = a);
  for (; u < e; )
    o = i + l, c = o - i, a = i - (o - c) + (l - c), l = n[++u], i = o, a !== 0 && (s[p++] = a);
  return (i !== 0 || p === 0) && (s[p++] = i), p;
}
function Or(r, t) {
  let e = t[0];
  for (let n = 1; n < r; n++) e += t[n];
  return e;
}
function re(r) {
  return new Float64Array(r);
}
const Pr = (3 + 16 * Bt) * Bt, Ir = (2 + 12 * Bt) * Bt, Br = (9 + 64 * Bt) * Bt * Bt, zt = re(4), nn = re(8), rn = re(12), sn = re(16), yt = re(4);
function Tr(r, t, e, n, s, i, o) {
  let a, c, f, l, h, u, p, x, m, E, S, g, y, d, v, b, O, P;
  const _ = r - s, I = e - s, X = t - i, Y = n - i;
  d = _ * Y, u = dt * _, p = u - (u - _), x = _ - p, u = dt * Y, m = u - (u - Y), E = Y - m, v = x * E - (d - p * m - x * m - p * E), b = X * I, u = dt * X, p = u - (u - X), x = X - p, u = dt * I, m = u - (u - I), E = I - m, O = x * E - (b - p * m - x * m - p * E), S = v - O, h = v - S, zt[0] = v - (S + h) + (h - O), g = d + S, h = g - d, y = d - (g - h) + (S - h), S = y - b, h = y - S, zt[1] = y - (S + h) + (h - b), P = g + S, h = P - g, zt[2] = g - (P - h) + (S - h), zt[3] = P;
  let L = Or(4, zt), w = Ir * o;
  if (L >= w || -L >= w || (h = r - _, a = r - (_ + h) + (h - s), h = e - I, f = e - (I + h) + (h - s), h = t - X, c = t - (X + h) + (h - i), h = n - Y, l = n - (Y + h) + (h - i), a === 0 && c === 0 && f === 0 && l === 0) || (w = Br * o + Ar * Math.abs(L), L += _ * l + Y * a - (X * f + I * c), L >= w || -L >= w)) return L;
  d = a * Y, u = dt * a, p = u - (u - a), x = a - p, u = dt * Y, m = u - (u - Y), E = Y - m, v = x * E - (d - p * m - x * m - p * E), b = c * I, u = dt * c, p = u - (u - c), x = c - p, u = dt * I, m = u - (u - I), E = I - m, O = x * E - (b - p * m - x * m - p * E), S = v - O, h = v - S, yt[0] = v - (S + h) + (h - O), g = d + S, h = g - d, y = d - (g - h) + (S - h), S = y - b, h = y - S, yt[1] = y - (S + h) + (h - b), P = g + S, h = P - g, yt[2] = g - (P - h) + (S - h), yt[3] = P;
  const A = Ne(4, zt, 4, yt, nn);
  d = _ * l, u = dt * _, p = u - (u - _), x = _ - p, u = dt * l, m = u - (u - l), E = l - m, v = x * E - (d - p * m - x * m - p * E), b = X * f, u = dt * X, p = u - (u - X), x = X - p, u = dt * f, m = u - (u - f), E = f - m, O = x * E - (b - p * m - x * m - p * E), S = v - O, h = v - S, yt[0] = v - (S + h) + (h - O), g = d + S, h = g - d, y = d - (g - h) + (S - h), S = y - b, h = y - S, yt[1] = y - (S + h) + (h - b), P = g + S, h = P - g, yt[2] = g - (P - h) + (S - h), yt[3] = P;
  const k = Ne(A, nn, 4, yt, rn);
  d = a * l, u = dt * a, p = u - (u - a), x = a - p, u = dt * l, m = u - (u - l), E = l - m, v = x * E - (d - p * m - x * m - p * E), b = c * f, u = dt * c, p = u - (u - c), x = c - p, u = dt * f, m = u - (u - f), E = f - m, O = x * E - (b - p * m - x * m - p * E), S = v - O, h = v - S, yt[0] = v - (S + h) + (h - O), g = d + S, h = g - d, y = d - (g - h) + (S - h), S = y - b, h = y - S, yt[1] = y - (S + h) + (h - b), P = g + S, h = P - g, yt[2] = g - (P - h) + (S - h), yt[3] = P;
  const B = Ne(k, rn, 4, yt, sn);
  return sn[B - 1];
}
function Nr(r, t, e, n, s, i) {
  const o = (t - i) * (e - s), a = (r - s) * (n - i), c = o - a, f = Math.abs(o + a);
  return Math.abs(c) >= Pr * f ? c : -Tr(r, t, e, n, s, i, f);
}
function Xr(r, t) {
  var e, n, s = 0, i, o, a, c, f, l, h, u = r[0], p = r[1], x = t.length;
  for (e = 0; e < x; e++) {
    n = 0;
    var m = t[e], E = m.length - 1;
    if (l = m[0], l[0] !== m[E][0] && l[1] !== m[E][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (o = l[0] - u, a = l[1] - p, n; n < E; n++) {
      if (h = m[n + 1], c = h[0] - u, f = h[1] - p, a === 0 && f === 0) {
        if (c <= 0 && o >= 0 || o <= 0 && c >= 0)
          return 0;
      } else if (f >= 0 && a <= 0 || f <= 0 && a >= 0) {
        if (i = Nr(o, c, a, f, 0, 0), i === 0)
          return 0;
        (i > 0 && f > 0 && a <= 0 || i < 0 && f <= 0 && a > 0) && s++;
      }
      l = h, a = f, o = c;
    }
  }
  return s % 2 !== 0;
}
function En(r, t, e = {}) {
  const n = { type: "Feature" };
  return (e.id === 0 || e.id) && (n.id = e.id), e.bbox && (n.bbox = e.bbox), n.properties = t || {}, n.geometry = r, n;
}
function Qt(r, t, e = {}) {
  if (!r)
    throw new Error("coordinates is required");
  if (!Array.isArray(r))
    throw new Error("coordinates must be an Array");
  if (r.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!on(r[0]) || !on(r[1]))
    throw new Error("coordinates must contain numbers");
  return En({
    type: "Point",
    coordinates: r
  }, t, e);
}
function An(r, t, e = {}) {
  for (const n of r) {
    if (n.length < 4)
      throw new Error(
        "Each LinearRing of a Polygon must have 4 or more Positions."
      );
    if (n[n.length - 1].length !== n[0].length)
      throw new Error("First and last Position are not equivalent.");
    for (let s = 0; s < n[n.length - 1].length; s++)
      if (n[n.length - 1][s] !== n[0][s])
        throw new Error("First and last Position are not equivalent.");
  }
  return En({
    type: "Polygon",
    coordinates: r
  }, t, e);
}
function Ut(r, t = {}) {
  const e = { type: "FeatureCollection" };
  return t.id && (e.id = t.id), t.bbox && (e.bbox = t.bbox), e.features = r, e;
}
function on(r) {
  return !isNaN(r) && r !== null && !Array.isArray(r);
}
function Yr(r) {
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
function an(r) {
  if (Array.isArray(r))
    return r;
  if (r.type === "Feature") {
    if (r.geometry !== null)
      return r.geometry.coordinates;
  } else if (r.coordinates)
    return r.coordinates;
  throw new Error(
    "coords must be GeoJSON Feature, Geometry Object or an Array"
  );
}
function Rr(r) {
  return r.type === "Feature" ? r.geometry : r;
}
function Cr(r, t, e = {}) {
  if (!r)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const n = Yr(r), s = Rr(t), i = s.type, o = t.bbox;
  let a = s.coordinates;
  if (o && Fr(n, o) === !1)
    return !1;
  i === "Polygon" && (a = [a]);
  let c = !1;
  for (var f = 0; f < a.length; ++f) {
    const l = Xr(n, a[f]);
    if (l === 0) return !e.ignoreBoundary;
    l && (c = !0);
  }
  return c;
}
function Fr(r, t) {
  return t[0] <= r[0] && t[1] <= r[1] && t[2] >= r[0] && t[3] >= r[1];
}
var Ye = Cr;
function cn(r) {
  const t = r.features;
  for (let e = 0; e < t.length; e++) {
    const n = t[e];
    `${n.properties.a.index}`.substring(0, 1) === "b" && `${n.properties.b.index}`.substring(0, 1) === "b" ? t[e] = {
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            n.geometry.coordinates[0][2],
            n.geometry.coordinates[0][0],
            n.geometry.coordinates[0][1],
            n.geometry.coordinates[0][2]
          ]
        ]
      },
      properties: {
        a: {
          geom: n.properties.c.geom,
          index: n.properties.c.index
        },
        b: {
          geom: n.properties.a.geom,
          index: n.properties.a.index
        },
        c: {
          geom: n.properties.b.geom,
          index: n.properties.b.index
        }
      },
      type: "Feature"
    } : `${n.properties.c.index}`.substring(0, 1) === "b" && `${n.properties.a.index}`.substring(0, 1) === "b" && (t[e] = {
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            n.geometry.coordinates[0][1],
            n.geometry.coordinates[0][2],
            n.geometry.coordinates[0][0],
            n.geometry.coordinates[0][1]
          ]
        ]
      },
      properties: {
        a: {
          geom: n.properties.b.geom,
          index: n.properties.b.index
        },
        b: {
          geom: n.properties.c.geom,
          index: n.properties.c.index
        },
        c: {
          geom: n.properties.a.geom,
          index: n.properties.a.index
        }
      },
      type: "Feature"
    });
  }
  return r;
}
function On(r) {
  const t = ["a", "b", "c", "a"].map(
    (i) => r.properties[i].geom
  ), e = r.geometry.coordinates[0], n = r.properties, s = {
    a: { geom: e[0], index: n.a.index },
    b: { geom: e[1], index: n.b.index },
    c: { geom: e[2], index: n.c.index }
  };
  return An([t], s);
}
function Dr(r) {
  const t = [0, 1, 2, 0].map((n) => r[n][0][0]), e = {
    a: { geom: r[0][0][1], index: r[0][1] },
    b: { geom: r[1][0][1], index: r[1][1] },
    c: { geom: r[2][0][1], index: r[2][1] }
  };
  return An([t], e);
}
function ce(r, t, e, n, s, i = !1, o) {
  const a = r.map(
    (c) => {
      (!o || o < 2.00703) && (c = Pn(c));
      const f = isFinite(c) ? t[c] : c === "c" ? n : c === "b0" ? s[0] : c === "b1" ? s[1] : c === "b2" ? s[2] : c === "b3" ? s[3] : (function() {
        const l = c.match(/e(\d+)/);
        if (l) {
          const h = parseInt(l[1]);
          return e[h];
        }
        throw "Bad index value for indexesToTri";
      })();
      return i ? [[f[1], f[0]], c] : [[f[0], f[1]], c];
    }
  );
  return Dr(a);
}
function Pn(r) {
  return typeof r == "number" ? r : r.replace(/^(c|e|b)(?:ent|dgeNode|box)(\d+)?$/, "$1$2");
}
function In(r, t) {
  return t && t >= 2.00703 || Array.isArray(r[0]) ? r : r.map((e) => [
    e.illstNodes,
    e.mercNodes,
    e.startEnd
  ]);
}
function hn(r, t) {
  for (let e = 0; e < t.features.length; e++)
    if (Ye(r, t.features[e]))
      return t.features[e];
}
function Bn(r, t, e) {
  const n = t.geometry.coordinates[0][0], s = t.geometry.coordinates[0][1], i = t.geometry.coordinates[0][2], o = r.geometry.coordinates, a = t.properties.a.geom, c = t.properties.b.geom, f = t.properties.c.geom, l = [s[0] - n[0], s[1] - n[1]], h = [i[0] - n[0], i[1] - n[1]], u = [o[0] - n[0], o[1] - n[1]], p = [c[0] - a[0], c[1] - a[1]], x = [f[0] - a[0], f[1] - a[1]];
  let m = (h[1] * u[0] - h[0] * u[1]) / (l[0] * h[1] - l[1] * h[0]), E = (l[0] * u[1] - l[1] * u[0]) / (l[0] * h[1] - l[1] * h[0]);
  if (e) {
    const S = e[t.properties.a.index], g = e[t.properties.b.index], y = e[t.properties.c.index];
    let d;
    if (m < 0 || E < 0 || 1 - m - E < 0) {
      const v = m / (m + E), b = E / (m + E);
      d = m / g / (v / g + b / y), E = E / y / (v / g + b / y);
    } else
      d = m / g / (m / g + E / y + (1 - m - E) / S), E = E / y / (m / g + E / y + (1 - m - E) / S);
    m = d;
  }
  return [
    m * p[0] + E * x[0] + a[0],
    m * p[1] + E * x[1] + a[1]
  ];
}
function Lr(r, t, e, n) {
  const s = r.geometry.coordinates, i = e.geometry.coordinates, o = Math.atan2(s[0] - i[0], s[1] - i[1]), a = $r(o, t[0]);
  if (a === void 0)
    throw new Error("Unable to determine vertex index");
  const c = t[1][a];
  return Bn(r, c.features[0], n);
}
function be(r, t, e, n, s, i, o, a) {
  let c;
  if (o && (c = hn(r, Ut([o]))), !c) {
    if (e) {
      const f = r.geometry.coordinates, l = e.gridNum, h = e.xOrigin, u = e.yOrigin, p = e.xUnit, x = e.yUnit, m = e.gridCache, E = At(f[0], h, p, l), S = At(f[1], u, x, l), g = m[E] ? m[E][S] ? m[E][S] : [] : [];
      t = Ut(g.map((y) => t.features[y]));
    }
    c = hn(r, t);
  }
  return a && a(c), c ? Bn(r, c, i) : Lr(r, n, s, i);
}
function At(r, t, e, n) {
  let s = Math.floor((r - t) / e);
  return s >= n && (s = n - 1), s;
}
function $r(r, t) {
  let e = fn(r - t[0]), n = Math.PI * 2, s;
  for (let i = 0; i < t.length; i++) {
    const o = (i + 1) % t.length, a = fn(r - t[o]), c = Math.min(Math.abs(e), Math.abs(a));
    e * a <= 0 && c < n && (n = c, s = i), e = a;
  }
  return s;
}
function fn(r, t = !1) {
  const e = t ? function(n) {
    return !(n >= 0 && n < Math.PI * 2);
  } : function(n) {
    return !(n > -1 * Math.PI && n <= Math.PI);
  };
  for (; e(r); )
    r = r + 2 * Math.PI * (r > 0 ? -1 : 1);
  return r;
}
const Re = 2.00703, _t = class xt {
  constructor() {
    it(this, "points", []), it(this, "pointsWeightBuffer"), it(this, "strict_status"), it(this, "vertices_params"), it(this, "centroid"), it(this, "edgeNodes"), it(this, "edges"), it(this, "tins"), it(this, "kinks"), it(this, "yaxisMode", xt.YAXIS_INVERT), it(this, "strictMode", xt.MODE_AUTO), it(this, "vertexMode", xt.VERTEX_PLAIN), it(this, "bounds"), it(this, "boundsPolygon"), it(this, "wh"), it(this, "xy"), it(this, "indexedTins"), it(this, "stateFull", !1), it(this, "stateTriangle"), it(this, "stateBackward");
  }
  /**
   * コンパイルされた設定を適用します
   * 
   * @param compiled - コンパイルされた設定オブジェクト
   * @returns 変換に必要な主要なオブジェクトのセット
   * 
   * 以下の処理を行います：
   * 1. バージョンに応じた設定の解釈
   * 2. 各種パラメータの復元
   * 3. TINネットワークの再構築
   * 4. インデックスの作成
   */
  setCompiled(t) {
    if (t.version || !t.tins && t.points && t.tins_points) {
      this.points = t.points, this.pointsWeightBuffer = !t.version || t.version < 2.00703 ? ["forw", "bakw"].reduce((n, s) => {
        const i = t.weight_buffer[s];
        return i && (n[s] = Object.keys(i).reduce((o, a) => {
          const c = Pn(a);
          return o[c] = i[a], o;
        }, {})), n;
      }, {}) : t.weight_buffer, t.strict_status ? this.strict_status = t.strict_status : t.kinks_points ? this.strict_status = xt.STATUS_ERROR : t.tins_points.length == 2 ? this.strict_status = xt.STATUS_LOOSE : this.strict_status = xt.STATUS_STRICT, this.vertices_params = {
        forw: [t.vertices_params[0]],
        bakw: [t.vertices_params[1]]
      }, this.vertices_params.forw[1] = [0, 1, 2, 3].map((n) => {
        const s = (n + 1) % 4, i = ce(
          ["c", `b${n}`, `b${s}`],
          t.points,
          t.edgeNodes || [],
          t.centroid_point,
          t.vertices_points,
          !1,
          Re
        );
        return Ut([i]);
      }), this.vertices_params.bakw[1] = [0, 1, 2, 3].map((n) => {
        const s = (n + 1) % 4, i = ce(
          ["c", `b${n}`, `b${s}`],
          t.points,
          t.edgeNodes || [],
          t.centroid_point,
          t.vertices_points,
          !0,
          Re
        );
        return Ut([i]);
      }), this.centroid = {
        forw: Qt(t.centroid_point[0], {
          target: {
            geom: t.centroid_point[1],
            index: "c"
          }
        }),
        bakw: Qt(t.centroid_point[1], {
          target: {
            geom: t.centroid_point[0],
            index: "c"
          }
        })
      }, this.edges = In(t.edges || []), this.edgeNodes = t.edgeNodes || [];
      const e = t.tins_points.length == 1 ? 0 : 1;
      this.tins = {
        forw: Ut(
          t.tins_points[0].map(
            (n) => ce(
              n,
              t.points,
              t.edgeNodes || [],
              t.centroid_point,
              t.vertices_points,
              !1,
              t.version
            )
          )
        ),
        bakw: Ut(
          t.tins_points[e].map(
            (n) => ce(
              n,
              t.points,
              t.edgeNodes || [],
              t.centroid_point,
              t.vertices_points,
              !0,
              t.version
            )
          )
        )
      }, this.addIndexedTin(), t.kinks_points && (this.kinks = {
        bakw: Ut(
          t.kinks_points.map((n) => Qt(n))
        )
      }), t.yaxisMode ? this.yaxisMode = t.yaxisMode : this.yaxisMode = xt.YAXIS_INVERT, t.vertexMode && (this.vertexMode = t.vertexMode), t.strictMode && (this.strictMode = t.strictMode), t.bounds ? (this.bounds = t.bounds, this.boundsPolygon = t.boundsPolygon, this.xy = t.xy, this.wh = t.wh) : (this.xy = [0, 0], t.wh && (this.wh = t.wh), this.bounds = void 0, this.boundsPolygon = void 0);
    } else {
      t = JSON.parse(
        JSON.stringify(t).replace('"cent"', '"c"').replace(/"bbox(\d+)"/g, '"b$1"')
      ), this.tins = t.tins, this.addIndexedTin(), this.strict_status = t.strict_status, this.pointsWeightBuffer = t.weight_buffer, this.vertices_params = t.vertices_params, this.centroid = t.centroid, this.kinks = t.kinks;
      const e = [];
      for (let n = 0; n < this.tins.forw.features.length; n++) {
        const s = this.tins.forw.features[n];
        ["a", "b", "c"].map((i, o) => {
          const a = s.geometry.coordinates[0][o], c = s.properties[i].geom, f = s.properties[i].index;
          typeof f == "number" && (e[f] = [a, c]);
        });
      }
      this.points = e;
    }
  }
  /**
   * TINネットワークのインデックスを作成します
   * 
   * インデックスは変換処理を高速化するために使用されます。
   * グリッド形式のインデックスを作成し、各グリッドに
   * 含まれる三角形を記録します。
   */
  addIndexedTin() {
    const t = this.tins, e = t.forw, n = t.bakw, s = Math.ceil(Math.sqrt(e.features.length));
    if (s < 3) {
      this.indexedTins = void 0;
      return;
    }
    let i = [], o = [];
    const a = e.features.map((m) => {
      let E = [];
      return an(m)[0].map((S) => {
        i.length === 0 ? i = [Array.from(S), Array.from(S)] : (S[0] < i[0][0] && (i[0][0] = S[0]), S[0] > i[1][0] && (i[1][0] = S[0]), S[1] < i[0][1] && (i[0][1] = S[1]), S[1] > i[1][1] && (i[1][1] = S[1])), E.length === 0 ? E = [Array.from(S), Array.from(S)] : (S[0] < E[0][0] && (E[0][0] = S[0]), S[0] > E[1][0] && (E[1][0] = S[0]), S[1] < E[0][1] && (E[0][1] = S[1]), S[1] > E[1][1] && (E[1][1] = S[1]));
      }), E;
    }), c = (i[1][0] - i[0][0]) / s, f = (i[1][1] - i[0][1]) / s, l = a.reduce(
      (m, E, S) => {
        const g = At(
          E[0][0],
          i[0][0],
          c,
          s
        ), y = At(
          E[1][0],
          i[0][0],
          c,
          s
        ), d = At(
          E[0][1],
          i[0][1],
          f,
          s
        ), v = At(
          E[1][1],
          i[0][1],
          f,
          s
        );
        for (let b = g; b <= y; b++) {
          m[b] || (m[b] = []);
          for (let O = d; O <= v; O++)
            m[b][O] || (m[b][O] = []), m[b][O].push(S);
        }
        return m;
      },
      []
    ), h = n.features.map((m) => {
      let E = [];
      return an(m)[0].map((S) => {
        o.length === 0 ? o = [Array.from(S), Array.from(S)] : (S[0] < o[0][0] && (o[0][0] = S[0]), S[0] > o[1][0] && (o[1][0] = S[0]), S[1] < o[0][1] && (o[0][1] = S[1]), S[1] > o[1][1] && (o[1][1] = S[1])), E.length === 0 ? E = [Array.from(S), Array.from(S)] : (S[0] < E[0][0] && (E[0][0] = S[0]), S[0] > E[1][0] && (E[1][0] = S[0]), S[1] < E[0][1] && (E[0][1] = S[1]), S[1] > E[1][1] && (E[1][1] = S[1]));
      }), E;
    }), u = (o[1][0] - o[0][0]) / s, p = (o[1][1] - o[0][1]) / s, x = h.reduce(
      (m, E, S) => {
        const g = At(
          E[0][0],
          o[0][0],
          u,
          s
        ), y = At(
          E[1][0],
          o[0][0],
          u,
          s
        ), d = At(
          E[0][1],
          o[0][1],
          p,
          s
        ), v = At(
          E[1][1],
          o[0][1],
          p,
          s
        );
        for (let b = g; b <= y; b++) {
          m[b] || (m[b] = []);
          for (let O = d; O <= v; O++)
            m[b][O] || (m[b][O] = []), m[b][O].push(S);
        }
        return m;
      },
      []
    );
    this.indexedTins = {
      forw: {
        gridNum: s,
        xOrigin: i[0][0],
        yOrigin: i[0][1],
        xUnit: c,
        yUnit: f,
        gridCache: l
      },
      bakw: {
        gridNum: s,
        xOrigin: o[0][0],
        yOrigin: o[0][1],
        xUnit: u,
        yUnit: p,
        gridCache: x
      }
    };
  }
  /**
   * 座標変換を実行します
   * 
   * @param apoint - 変換する座標
   * @param backward - 逆方向の変換かどうか
   * @param ignoreBounds - 境界チェックを無視するかどうか
   * @returns 変換後の座標、または境界外の場合はfalse
   * 
   * @throws {Error} 逆方向変換が許可されていない状態での逆変換時
   */
  transform(t, e, n) {
    if (e && this.strict_status == xt.STATUS_ERROR)
      throw 'Backward transform is not allowed if strict_status == "strict_error"';
    this.yaxisMode == xt.YAXIS_FOLLOW && e && (t = [t[0], -1 * t[1]]);
    const s = Qt(t);
    if (this.bounds && !e && !n && !Ye(s, this.boundsPolygon))
      return !1;
    const i = e ? this.tins.bakw : this.tins.forw, o = e ? this.indexedTins.bakw : this.indexedTins.forw, a = e ? this.vertices_params.bakw : this.vertices_params.forw, c = e ? this.centroid.bakw : this.centroid.forw, f = e ? this.pointsWeightBuffer.bakw : this.pointsWeightBuffer.forw;
    let l, h;
    this.stateFull && (this.stateBackward == e ? l = this.stateTriangle : (this.stateBackward = e, this.stateTriangle = void 0), h = (p) => {
      this.stateTriangle = p;
    });
    let u = be(
      s,
      i,
      o,
      a,
      c,
      f,
      l,
      h
    );
    if (this.bounds && e && !n) {
      const p = Qt(u);
      if (!Ye(p, this.boundsPolygon)) return !1;
    } else this.yaxisMode == xt.YAXIS_FOLLOW && !e && (u = [u[0], -1 * u[1]]);
    return u;
  }
};
it(_t, "VERTEX_PLAIN", "plain"), it(_t, "VERTEX_BIRDEYE", "birdeye"), it(_t, "MODE_STRICT", "strict"), it(_t, "MODE_AUTO", "auto"), it(_t, "MODE_LOOSE", "loose"), it(_t, "STATUS_STRICT", "strict"), it(_t, "STATUS_ERROR", "strict_error"), it(_t, "STATUS_LOOSE", "loose"), it(_t, "YAXIS_FOLLOW", "follow"), it(_t, "YAXIS_INVERT", "invert");
let Ur = _t;
const ln = Math.pow(2, -52), he = new Uint32Array(512);
class De {
  static from(t, e = Jr, n = Wr) {
    const s = t.length, i = new Float64Array(s * 2);
    for (let o = 0; o < s; o++) {
      const a = t[o];
      i[2 * o] = e(a), i[2 * o + 1] = n(a);
    }
    return new De(i);
  }
  constructor(t) {
    const e = t.length >> 1;
    if (e > 0 && typeof t[0] != "number") throw new Error("Expected coords to contain numbers.");
    this.coords = t;
    const n = Math.max(2 * e - 5, 0);
    this._triangles = new Uint32Array(n * 3), this._halfedges = new Int32Array(n * 3), this._hashSize = Math.ceil(Math.sqrt(e)), this._hullPrev = new Uint32Array(e), this._hullNext = new Uint32Array(e), this._hullTri = new Uint32Array(e), this._hullHash = new Int32Array(this._hashSize), this._ids = new Uint32Array(e), this._dists = new Float64Array(e), this.update();
  }
  update() {
    const { coords: t, _hullPrev: e, _hullNext: n, _hullTri: s, _hullHash: i } = this, o = t.length >> 1;
    let a = 1 / 0, c = 1 / 0, f = -1 / 0, l = -1 / 0;
    for (let _ = 0; _ < o; _++) {
      const I = t[2 * _], X = t[2 * _ + 1];
      I < a && (a = I), X < c && (c = X), I > f && (f = I), X > l && (l = X), this._ids[_] = _;
    }
    const h = (a + f) / 2, u = (c + l) / 2;
    let p, x, m;
    for (let _ = 0, I = 1 / 0; _ < o; _++) {
      const X = Xe(h, u, t[2 * _], t[2 * _ + 1]);
      X < I && (p = _, I = X);
    }
    const E = t[2 * p], S = t[2 * p + 1];
    for (let _ = 0, I = 1 / 0; _ < o; _++) {
      if (_ === p) continue;
      const X = Xe(E, S, t[2 * _], t[2 * _ + 1]);
      X < I && X > 0 && (x = _, I = X);
    }
    let g = t[2 * x], y = t[2 * x + 1], d = 1 / 0;
    for (let _ = 0; _ < o; _++) {
      if (_ === p || _ === x) continue;
      const I = zr(E, S, g, y, t[2 * _], t[2 * _ + 1]);
      I < d && (m = _, d = I);
    }
    let v = t[2 * m], b = t[2 * m + 1];
    if (d === 1 / 0) {
      for (let X = 0; X < o; X++)
        this._dists[X] = t[2 * X] - t[0] || t[2 * X + 1] - t[1];
      Jt(this._ids, this._dists, 0, o - 1);
      const _ = new Uint32Array(o);
      let I = 0;
      for (let X = 0, Y = -1 / 0; X < o; X++) {
        const L = this._ids[X], w = this._dists[L];
        w > Y && (_[I++] = L, Y = w);
      }
      this.hull = _.subarray(0, I), this.triangles = new Uint32Array(0), this.halfedges = new Uint32Array(0);
      return;
    }
    if (Ot(E, S, g, y, v, b) < 0) {
      const _ = x, I = g, X = y;
      x = m, g = v, y = b, m = _, v = I, b = X;
    }
    const O = Vr(E, S, g, y, v, b);
    this._cx = O.x, this._cy = O.y;
    for (let _ = 0; _ < o; _++)
      this._dists[_] = Xe(t[2 * _], t[2 * _ + 1], O.x, O.y);
    Jt(this._ids, this._dists, 0, o - 1), this._hullStart = p;
    let P = 3;
    n[p] = e[m] = x, n[x] = e[p] = m, n[m] = e[x] = p, s[p] = 0, s[x] = 1, s[m] = 2, i.fill(-1), i[this._hashKey(E, S)] = p, i[this._hashKey(g, y)] = x, i[this._hashKey(v, b)] = m, this.trianglesLen = 0, this._addTriangle(p, x, m, -1, -1, -1);
    for (let _ = 0, I, X; _ < this._ids.length; _++) {
      const Y = this._ids[_], L = t[2 * Y], w = t[2 * Y + 1];
      if (_ > 0 && Math.abs(L - I) <= ln && Math.abs(w - X) <= ln || (I = L, X = w, Y === p || Y === x || Y === m)) continue;
      let A = 0;
      for (let M = 0, T = this._hashKey(L, w); M < this._hashSize && (A = i[(T + M) % this._hashSize], !(A !== -1 && A !== n[A])); M++)
        ;
      A = e[A];
      let k = A, B;
      for (; B = n[k], Ot(L, w, t[2 * k], t[2 * k + 1], t[2 * B], t[2 * B + 1]) >= 0; )
        if (k = B, k === A) {
          k = -1;
          break;
        }
      if (k === -1) continue;
      let N = this._addTriangle(k, Y, n[k], -1, -1, s[k]);
      s[Y] = this._legalize(N + 2), s[k] = N, P++;
      let C = n[k];
      for (; B = n[C], Ot(L, w, t[2 * C], t[2 * C + 1], t[2 * B], t[2 * B + 1]) < 0; )
        N = this._addTriangle(C, Y, B, s[Y], -1, s[C]), s[Y] = this._legalize(N + 2), n[C] = C, P--, C = B;
      if (k === A)
        for (; B = e[k], Ot(L, w, t[2 * B], t[2 * B + 1], t[2 * k], t[2 * k + 1]) < 0; )
          N = this._addTriangle(B, Y, k, -1, s[k], s[B]), this._legalize(N + 2), s[B] = N, n[k] = k, P--, k = B;
      this._hullStart = e[Y] = k, n[k] = e[C] = Y, n[Y] = C, i[this._hashKey(L, w)] = Y, i[this._hashKey(t[2 * k], t[2 * k + 1])] = k;
    }
    this.hull = new Uint32Array(P);
    for (let _ = 0, I = this._hullStart; _ < P; _++)
      this.hull[_] = I, I = n[I];
    this.triangles = this._triangles.subarray(0, this.trianglesLen), this.halfedges = this._halfedges.subarray(0, this.trianglesLen);
  }
  _hashKey(t, e) {
    return Math.floor(jr(t - this._cx, e - this._cy) * this._hashSize) % this._hashSize;
  }
  _legalize(t) {
    const { _triangles: e, _halfedges: n, coords: s } = this;
    let i = 0, o = 0;
    for (; ; ) {
      const a = n[t], c = t - t % 3;
      if (o = c + (t + 2) % 3, a === -1) {
        if (i === 0) break;
        t = he[--i];
        continue;
      }
      const f = a - a % 3, l = c + (t + 1) % 3, h = f + (a + 2) % 3, u = e[o], p = e[t], x = e[l], m = e[h];
      if (qr(
        s[2 * u],
        s[2 * u + 1],
        s[2 * p],
        s[2 * p + 1],
        s[2 * x],
        s[2 * x + 1],
        s[2 * m],
        s[2 * m + 1]
      )) {
        e[t] = m, e[a] = u;
        const S = n[h];
        if (S === -1) {
          let y = this._hullStart;
          do {
            if (this._hullTri[y] === h) {
              this._hullTri[y] = t;
              break;
            }
            y = this._hullPrev[y];
          } while (y !== this._hullStart);
        }
        this._link(t, S), this._link(a, n[o]), this._link(o, h);
        const g = f + (a + 1) % 3;
        i < he.length && (he[i++] = g);
      } else {
        if (i === 0) break;
        t = he[--i];
      }
    }
    return o;
  }
  _link(t, e) {
    this._halfedges[t] = e, e !== -1 && (this._halfedges[e] = t);
  }
  // add a new triangle given vertex indices and adjacent half-edge ids
  _addTriangle(t, e, n, s, i, o) {
    const a = this.trianglesLen;
    return this._triangles[a] = t, this._triangles[a + 1] = e, this._triangles[a + 2] = n, this._link(a, s), this._link(a + 1, i), this._link(a + 2, o), this.trianglesLen += 3, a;
  }
}
function jr(r, t) {
  const e = r / (Math.abs(r) + Math.abs(t));
  return (t > 0 ? 3 - e : 1 + e) / 4;
}
function Xe(r, t, e, n) {
  const s = r - e, i = t - n;
  return s * s + i * i;
}
function qr(r, t, e, n, s, i, o, a) {
  const c = r - o, f = t - a, l = e - o, h = n - a, u = s - o, p = i - a, x = c * c + f * f, m = l * l + h * h, E = u * u + p * p;
  return c * (h * E - m * p) - f * (l * E - m * u) + x * (l * p - h * u) < 0;
}
function zr(r, t, e, n, s, i) {
  const o = e - r, a = n - t, c = s - r, f = i - t, l = o * o + a * a, h = c * c + f * f, u = 0.5 / (o * f - a * c), p = (f * l - a * h) * u, x = (o * h - c * l) * u;
  return p * p + x * x;
}
function Vr(r, t, e, n, s, i) {
  const o = e - r, a = n - t, c = s - r, f = i - t, l = o * o + a * a, h = c * c + f * f, u = 0.5 / (o * f - a * c), p = r + (f * l - a * h) * u, x = t + (o * h - c * l) * u;
  return { x: p, y: x };
}
function Jt(r, t, e, n) {
  if (n - e <= 20)
    for (let s = e + 1; s <= n; s++) {
      const i = r[s], o = t[i];
      let a = s - 1;
      for (; a >= e && t[r[a]] > o; ) r[a + 1] = r[a--];
      r[a + 1] = i;
    }
  else {
    const s = e + n >> 1;
    let i = e + 1, o = n;
    Ht(r, s, i), t[r[e]] > t[r[n]] && Ht(r, e, n), t[r[i]] > t[r[n]] && Ht(r, i, n), t[r[e]] > t[r[i]] && Ht(r, e, i);
    const a = r[i], c = t[a];
    for (; ; ) {
      do
        i++;
      while (t[r[i]] < c);
      do
        o--;
      while (t[r[o]] > c);
      if (o < i) break;
      Ht(r, i, o);
    }
    r[e + 1] = r[o], r[o] = a, n - i + 1 >= o - e ? (Jt(r, t, i, n), Jt(r, t, e, o - 1)) : (Jt(r, t, e, o - 1), Jt(r, t, i, n));
  }
}
function Ht(r, t, e) {
  const n = r[t];
  r[t] = r[e], r[e] = n;
}
function Jr(r) {
  return r[0];
}
function Wr(r) {
  return r[1];
}
class Kr {
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
      let s = 0;
      for (; this.bs[n] && s < this.width; )
        this.bs[n] & 1 << s && t(n * this.width + s), s++;
    }
    return this;
  }
}
class un extends Kr {
  constructor(t) {
    super(8, new Uint8Array(Math.ceil(t / 8)).fill(0));
  }
}
function $t(r) {
  return r % 3 === 2 ? r - 2 : r + 1;
}
function Pt(r) {
  return r % 3 === 0 ? r + 2 : r - 1;
}
function dn(r, t, e, n, s, i, o, a) {
  const c = Ot(r, t, s, i, o, a), f = Ot(e, n, s, i, o, a);
  if (c > 0 && f > 0 || c < 0 && f < 0)
    return !1;
  const l = Ot(s, i, r, t, e, n), h = Ot(o, a, r, t, e, n);
  return l > 0 && h > 0 || l < 0 && h < 0 ? !1 : c === 0 && f === 0 && l === 0 && h === 0 ? !(Math.max(s, o) < Math.min(r, e) || Math.max(r, e) < Math.min(s, o) || Math.max(i, a) < Math.min(t, n) || Math.max(t, n) < Math.min(i, a)) : !0;
}
class Gr {
  /**
   * The triangulation object from Delaunator.
   */
  del;
  constructor(t) {
    this.del = t;
  }
}
class Qr extends Gr {
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
    const n = 2 ** 32 - 1, s = t.coords.length >> 1, i = t.triangles.length;
    this.vertMap = new Uint32Array(s).fill(n), this.flips = new un(i), this.consd = new un(i);
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
    const { triangles: n, halfedges: s } = this.del, i = this.vertMap[t];
    let o = i;
    do {
      const f = n[o], l = $t(o);
      if (f === e)
        return this.protect(o);
      const h = Pt(o), u = n[h];
      if (u === e)
        return this.protect(l), l;
      if (this.intersectSegments(t, e, u, f)) {
        o = h;
        break;
      }
      o = s[l];
    } while (o !== -1 && o !== i);
    let a = o, c = -1;
    for (; o !== -1; ) {
      const f = s[o], l = Pt(o), h = Pt(f), u = $t(f);
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
          n[u],
          n[h]
        ))
          o = u;
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
        n[u],
        n[h]
      ) && (o = u);
    }
    return this.protect(a), this.delaunify(!0), this.findEdge(t, e);
  }
  /**
   * Fix the Delaunay condition.
   */
  delaunify(t = !1) {
    const { halfedges: e } = this.del, n = this.flips, s = this.consd, i = e.length;
    let o;
    do {
      o = 0;
      for (let a = 0; a < i; a++) {
        if (s.has(a))
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
      const s = t[n];
      this.constrainOne(s[0], s[1]);
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
    const n = this.vertMap[e], { triangles: s, halfedges: i } = this.del;
    let o = n, a = -1;
    do {
      if (s[o] === t)
        return o;
      a = $t(o), o = i[a];
    } while (o !== -1 && o !== n);
    return s[$t(a)] === t ? -a : 1 / 0;
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
    const i = e[t];
    return i !== -1 && (n.add(t), n.add(i)), !0;
  }
  /**
   * Flip the edge shared by two triangles.
   */
  flipDiagonal(t) {
    const { triangles: e, halfedges: n } = this.del, s = this.flips, i = this.consd, o = n[t], a = Pt(t), c = $t(t), f = Pt(o), l = $t(o), h = n[a], u = n[f];
    if (i.has(t))
      throw new Error("Trying to flip a constrained edge");
    return e[t] = e[f], n[t] = u, s.set(t, s.has(f)) || i.set(t, i.has(f)), u !== -1 && (n[u] = t), n[a] = f, e[o] = e[a], n[o] = h, s.set(o, s.has(a)) || i.set(o, i.has(a)), h !== -1 && (n[h] = o), n[f] = a, this.markFlip(t), this.markFlip(c), this.markFlip(o), this.markFlip(l), s.add(a), i.delete(a), s.add(f), i.delete(f), this.updateVert(t), this.updateVert(c), this.updateVert(o), this.updateVert(l), a;
  }
  /**
   * Whether point p1, p2, and p are collinear.
   */
  isCollinear(t, e, n) {
    const s = this.del.coords;
    return Ot(
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
    const i = this.del.coords;
    return Zn(
      i[t * 2],
      i[t * 2 + 1],
      i[e * 2],
      i[e * 2 + 1],
      i[n * 2],
      i[n * 2 + 1],
      i[s * 2],
      i[s * 2 + 1]
    ) < 0;
  }
  /**
   * Whether the triangles sharing edg conform to the Delaunay condition.
   */
  isDelaunay(t) {
    const { triangles: e, halfedges: n } = this.del, s = n[t];
    if (s === -1)
      return !0;
    const i = e[Pt(t)], o = e[t], a = e[$t(t)], c = e[Pt(s)];
    return !this.inCircle(i, o, a, c);
  }
  /**
   * Update the vertex -> incoming edge map.
   */
  updateVert(t) {
    const { triangles: e, halfedges: n } = this.del, s = this.vertMap, i = e[t];
    let o = Pt(t), a = n[o];
    for (; a !== -1 && a !== t; )
      o = Pt(a), a = n[o];
    return s[i] = o, o;
  }
  /**
   * Whether the segments between vertices intersect.
   */
  intersectSegments(t, e, n, s) {
    const i = this.del.coords;
    return t === n || t === s || e === n || e === s ? !1 : dn(
      i[t * 2],
      i[t * 2 + 1],
      i[e * 2],
      i[e * 2 + 1],
      i[n * 2],
      i[n * 2 + 1],
      i[s * 2],
      i[s * 2 + 1]
    );
  }
  static intersectSegments = dn;
}
function fe(r, t, e) {
  if (t || (t = []), typeof r != "object" || r.type !== "FeatureCollection")
    throw "Argument points must be FeatureCollection";
  if (!Array.isArray(t)) throw "Argument points must be Array of Array";
  const n = r.features.map(
    (c) => c.geometry.coordinates
  ), s = De.from(n);
  let i;
  const o = [];
  s.triangles.length !== 0 && t.length !== 0 && (i = new Qr(s), i.constrainAll(t));
  for (let c = 0; c < s.triangles.length; c += 3)
    o.push([s.triangles[c], s.triangles[c + 1], s.triangles[c + 2]]);
  const a = ["a", "b", "c"];
  return Mt(
    o.map((c) => {
      const f = {}, l = c.map((h, u) => {
        const p = r.features[h], x = p.geometry.coordinates, m = [x[0], x[1]];
        return x.length === 3 ? m[2] = x[2] : f[a[u]] = p.properties[e], m;
      });
      return l[3] = l[0], ne([l], f);
    })
  );
}
class Tn {
  constructor(t = [], e = Hr) {
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
      const i = t - 1 >> 1, o = e[i];
      if (n(s, o) >= 0) break;
      e[t] = o, t = i;
    }
    e[t] = s;
  }
  _down(t) {
    const { data: e, compare: n } = this, s = this.length >> 1, i = e[t];
    for (; t < s; ) {
      let o = (t << 1) + 1, a = e[o];
      const c = o + 1;
      if (c < this.length && n(e[c], a) < 0 && (o = c, a = e[c]), n(a, i) >= 0) break;
      e[t] = a, t = o;
    }
    e[t] = i;
  }
}
function Hr(r, t) {
  return r < t ? -1 : r > t ? 1 : 0;
}
function Nn(r, t) {
  return r.p.x > t.p.x ? 1 : r.p.x < t.p.x ? -1 : r.p.y !== t.p.y ? r.p.y > t.p.y ? 1 : -1 : 1;
}
function Zr(r, t) {
  return r.rightSweepEvent.p.x > t.rightSweepEvent.p.x ? 1 : r.rightSweepEvent.p.x < t.rightSweepEvent.p.x ? -1 : r.rightSweepEvent.p.y !== t.rightSweepEvent.p.y ? r.rightSweepEvent.p.y < t.rightSweepEvent.p.y ? 1 : -1 : 1;
}
class pn {
  constructor(t, e, n, s) {
    this.p = {
      x: t[0],
      y: t[1]
    }, this.featureId = e, this.ringId = n, this.eventId = s, this.otherEvent = null, this.isLeftEndpoint = null;
  }
  isSamePoint(t) {
    return this.p.x === t.p.x && this.p.y === t.p.y;
  }
}
function ti(r, t) {
  if (r.type === "FeatureCollection") {
    const e = r.features;
    for (let n = 0; n < e.length; n++)
      mn(e[n], t);
  } else
    mn(r, t);
}
let le = 0, ue = 0, de = 0;
function mn(r, t) {
  const e = r.type === "Feature" ? r.geometry : r;
  let n = e.coordinates;
  (e.type === "Polygon" || e.type === "MultiLineString") && (n = [n]), e.type === "LineString" && (n = [[n]]);
  for (let s = 0; s < n.length; s++)
    for (let i = 0; i < n[s].length; i++) {
      let o = n[s][i][0], a = null;
      ue = ue + 1;
      for (let c = 0; c < n[s][i].length - 1; c++) {
        a = n[s][i][c + 1];
        const f = new pn(o, le, ue, de), l = new pn(a, le, ue, de + 1);
        f.otherEvent = l, l.otherEvent = f, Nn(f, l) > 0 ? (l.isLeftEndpoint = !0, f.isLeftEndpoint = !1) : (f.isLeftEndpoint = !0, l.isLeftEndpoint = !1), t.push(f), t.push(l), o = a, de = de + 1;
      }
    }
  le = le + 1;
}
class ei {
  constructor(t) {
    this.leftSweepEvent = t, this.rightSweepEvent = t.otherEvent;
  }
}
function ni(r, t) {
  if (r === null || t === null || r.leftSweepEvent.ringId === t.leftSweepEvent.ringId && (r.rightSweepEvent.isSamePoint(t.leftSweepEvent) || r.rightSweepEvent.isSamePoint(t.leftSweepEvent) || r.rightSweepEvent.isSamePoint(t.rightSweepEvent) || r.leftSweepEvent.isSamePoint(t.leftSweepEvent) || r.leftSweepEvent.isSamePoint(t.rightSweepEvent))) return !1;
  const e = r.leftSweepEvent.p.x, n = r.leftSweepEvent.p.y, s = r.rightSweepEvent.p.x, i = r.rightSweepEvent.p.y, o = t.leftSweepEvent.p.x, a = t.leftSweepEvent.p.y, c = t.rightSweepEvent.p.x, f = t.rightSweepEvent.p.y, l = (f - a) * (s - e) - (c - o) * (i - n), h = (c - o) * (n - a) - (f - a) * (e - o), u = (s - e) * (n - a) - (i - n) * (e - o);
  if (l === 0)
    return !1;
  const p = h / l, x = u / l;
  if (p >= 0 && p <= 1 && x >= 0 && x <= 1) {
    const m = e + p * (s - e), E = n + p * (i - n);
    return [m, E];
  }
  return !1;
}
function ri(r, t) {
  t = t || !1;
  const e = [], n = new Tn([], Zr);
  for (; r.length; ) {
    const s = r.pop();
    if (s.isLeftEndpoint) {
      const i = new ei(s);
      for (let o = 0; o < n.data.length; o++) {
        const a = n.data[o];
        if (t && a.leftSweepEvent.featureId === s.featureId)
          continue;
        const c = ni(i, a);
        c !== !1 && e.push(c);
      }
      n.push(i);
    } else s.isLeftEndpoint === !1 && n.pop();
  }
  return e;
}
function ii(r, t) {
  const e = new Tn([], Nn);
  return ti(r, e), ri(e, t);
}
var si = ii;
function oi(r, t, e = {}) {
  const { removeDuplicates: n = !0, ignoreSelfIntersections: s = !0 } = e;
  let i = [];
  r.type === "FeatureCollection" ? i = i.concat(r.features) : r.type === "Feature" ? i.push(r) : (r.type === "LineString" || r.type === "Polygon" || r.type === "MultiLineString" || r.type === "MultiPolygon") && i.push(ee(r)), t.type === "FeatureCollection" ? i = i.concat(t.features) : t.type === "Feature" ? i.push(t) : (t.type === "LineString" || t.type === "Polygon" || t.type === "MultiLineString" || t.type === "MultiPolygon") && i.push(ee(t));
  const o = si(
    Mt(i),
    s
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
  return Mt(a.map((c) => jt(c)));
}
var ai = oi;
function Xn(r, t, e, n, s, i) {
  return Object.keys(r).reduce((o, a) => {
    const c = r[a], f = c.forw, l = c.bakw, h = {
      forw: [f[0] - t.forw[0], f[1] - t.forw[1]],
      bakw: [l[0] - t.bakw[0], l[1] - t.bakw[1]]
    }, u = h.forw[0] === 0 ? 1 / 0 : ((h.forw[0] < 0 ? e : n) - t.forw[0]) / h.forw[0], p = h.forw[1] === 0 ? 1 / 0 : ((h.forw[1] < 0 ? s : i) - t.forw[1]) / h.forw[1];
    if (Math.abs(u) / Math.abs(p) < 1.1) {
      const x = {
        forw: [
          h.forw[0] * u + t.forw[0],
          h.forw[1] * u + t.forw[1]
        ],
        bakw: [
          h.bakw[0] * u + t.bakw[0],
          h.bakw[1] * u + t.bakw[1]
        ]
      };
      h.forw[0] < 0 ? o[3].push(x) : o[1].push(x);
    }
    if (Math.abs(p) / Math.abs(u) < 1.1) {
      const x = {
        forw: [
          h.forw[0] * p + t.forw[0],
          h.forw[1] * p + t.forw[1]
        ],
        bakw: [
          h.bakw[0] * p + t.bakw[0],
          h.bakw[1] * p + t.bakw[1]
        ]
      };
      h.forw[1] < 0 ? o[0].push(x) : o[2].push(x);
    }
    return o;
  }, [[], [], [], []]);
}
function ci(r, t) {
  const e = [[], [], [], []], n = [];
  return Object.keys(r).forEach((s) => {
    const i = r[s], o = i.forw, a = i.bakw, c = [
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
function hi(r) {
  let t = 1 / 0, e = 0, n = 0;
  return r.forEach((s) => {
    const { forw: i, bakw: o } = s, a = Math.hypot(i[0], i[1]), c = Math.hypot(o[0], o[1]);
    if (c === 0) return;
    const f = a / c, l = Math.atan2(i[0], i[1]) - Math.atan2(o[0], o[1]);
    t = Math.min(t, f), e += Math.cos(l), n += Math.sin(l);
  }), isFinite(t) ? [t, Math.atan2(n, e)] : [1, 0];
}
function Yn(r, t, e) {
  const { perQuad: n, aggregate: s } = ci(r, t), i = n.every((c) => c.length > 0), a = (e === "birdeye" ? i ? n : [s] : [s]).map((c) => hi(c));
  return a.length === 1 ? [a[0], a[0], a[0], a[0]] : a;
}
function fi(r, t, e) {
  const n = [1, 1, 1, 1];
  for (let s = 0; s < 4; s++) {
    const i = (s + 1) % 4, o = Je([r[s].bakw, r[i].bakw]);
    t[s].map((a) => {
      const c = Je([e.bakw, a.bakw]), f = ai(o, c);
      if (f.features.length > 0 && f.features[0].geometry) {
        const l = f.features[0], h = Math.sqrt(
          Math.pow(a.bakw[0] - e.bakw[0], 2) + Math.pow(a.bakw[1] - e.bakw[1], 2)
        ), u = Math.sqrt(
          Math.pow(
            l.geometry.coordinates[0] - e.bakw[0],
            2
          ) + Math.pow(
            l.geometry.coordinates[1] - e.bakw[1],
            2
          )
        ), p = h / u;
        p > n[s] && (n[s] = p), p > n[i] && (n[i] = p);
      }
    });
  }
  r.forEach((s, i) => {
    const o = n[i], a = [
      (s.bakw[0] - e.bakw[0]) * o + e.bakw[0],
      (s.bakw[1] - e.bakw[1]) * o + e.bakw[1]
    ];
    s.bakw = a;
  });
}
function Rn(r, t, e, n) {
  const s = r.map((o, a) => {
    const c = t[a], f = [
      c[0] - e.forw[0],
      c[1] - e.forw[1]
    ], h = Math.sqrt(
      Math.pow(f[0], 2) + Math.pow(f[1], 2)
    ) / o[0], u = Math.atan2(f[0], f[1]) - o[1], p = [
      e.bakw[0] + h * Math.sin(u),
      e.bakw[1] - h * Math.cos(u)
    ];
    return { forw: c, bakw: p };
  }), i = s[2];
  return s[2] = s[3], s[3] = i, fi(s, n, e), s;
}
function li(r) {
  const { convexBuf: t, centroid: e, bbox: n, minx: s, maxx: i, miny: o, maxy: a } = r, c = Xn(t, e, s, i, o, a), f = Yn(t, e, "plain");
  return Rn(f, n, e, c);
}
function ui(r) {
  const { convexBuf: t, centroid: e, bbox: n, minx: s, maxx: i, miny: o, maxy: a } = r, c = Xn(t, e, s, i, o, a), f = Yn(t, e, "birdeye");
  return Rn(f, n, e, c);
}
function di(r) {
  const e = new pi(r).findSegmentIntersections(), n = Dn(e), s = /* @__PURE__ */ new Map();
  return n.forEach((i) => {
    s.set(`${i.x}:${i.y}`, i);
  }), Array.from(s.values()).map(
    (i) => jt([i.x, i.y])
  );
}
class pi {
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
    const e = [], n = [], s = t.map((i) => {
      const o = i ? i.length : 0;
      for (let a = 0; a < o; a++)
        e.push(i[a][0]), n.push(i[a][1]);
      return o;
    });
    this.initXYData(s, e, n);
  }
  initXYData(t, e, n) {
    const s = t.length;
    this._xx = new Float64Array(e), this._yy = new Float64Array(n), this._nn = new Uint32Array(t), this._zz = null, this._zlimit = 0, this._filteredArcIter = null, this._ii = new Uint32Array(s);
    let i = 0;
    for (let o = 0; o < s; o++)
      this._ii[o] = i, i += t[o];
    (i != this._xx.length || this._xx.length != this._yy.length) && Le("ArcCollection#initXYData() Counting error"), this.initBounds(), this._arcIter = new Xi(this._xx, this._yy);
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
    const s = n.length, i = new Float64Array(s * 4), o = new _e();
    let a = 0, c, f, l;
    for (let h = 0; h < s; h++)
      c = n[h], c > 0 && (f = h * 4, l = Yi(t, e, a, c), i[f++] = l[0], i[f++] = l[1], i[f++] = l[2], i[f] = l[3], a += c, o.mergeBounds(l));
    return {
      bb: i,
      bounds: o
    };
  }
  getBounds() {
    return this._allBounds.clone();
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
    const n = t >= 0, s = n ? t : ~t, i = this.getRetainedInterval(), o = this._nn[s], a = n ? 1 : -1;
    let c = n ? this._ii[s] : this._ii[s] + o - 1, f = c, l = 0;
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
      (s, i, o, a) => {
        t += Math.abs(o[s] - o[i]), e += Math.abs(a[s] - a[i]);
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
    const t = this.getBounds(), e = t.ymin, n = t.ymax - e, s = this.calcSegmentIntersectionStripeCount(), i = new Uint32Array(s), o = s > 1 ? (m) => Math.floor((s - 1) * (m - e) / n) : () => 0;
    let a, c;
    this.forEachSegment(
      (m, E, S, g) => {
        let y = o(g[m]);
        const d = o(g[E]);
        for (; i[y] = i[y] + 2, y != d; )
          y += d > y ? 1 : -1;
      }
    );
    const f = this.getUint32Array(wi(i));
    let l = 0;
    const h = [];
    yi(i, (m) => {
      const E = l;
      l += m, h.push(f.subarray(E, l));
    }), vi(i, 0), this.forEachSegment(
      (m, E, S, g) => {
        let y = o(g[m]);
        const d = o(g[E]);
        let v, b;
        for (; v = i[y], i[y] = v + 2, b = h[y], b[v] = m, b[v + 1] = E, y != d; )
          y += d > y ? 1 : -1;
      }
    );
    const u = this.getVertexData(), p = [];
    let x;
    for (a = 0; a < s; a++)
      for (x = bi(h[a], u.xx, u.yy), c = 0; c < x.length; c++)
        p.push(x[c]);
    return Dn(p);
  }
}
function Le(...r) {
  const t = r.join(" ");
  throw new Error(t);
}
function $e(r) {
  return r ? gi(r) ? !0 : mi(r) ? !1 : r.length === 0 ? !0 : r.length > 0 : !1;
}
function mi(r) {
  return r != null && r.toString === String.prototype.toString;
}
function gi(r) {
  return Array.isArray(r);
}
function wi(r, t) {
  $e(r) || Le("utils.sum() expects an array, received:", r);
  let e = 0, n;
  for (let s = 0, i = r.length; s < i; s++)
    n = r[s], n && (e += n);
  return e;
}
function yi(r, t, e) {
  if (!$e(r))
    throw new Error(`#forEach() takes an array-like argument. ${r}`);
  for (let n = 0, s = r.length; n < s; n++)
    t.call(e, r[n], n);
}
function vi(r, t) {
  for (let e = 0, n = r.length; e < n; e++)
    r[e] = t;
  return r;
}
function bi(r, t, e) {
  const n = r.length - 2, s = [];
  let i, o, a, c, f, l, h, u, p, x, m, E, S, g, y, d, v;
  for (Ii(t, r), d = 0; d < n; ) {
    for (i = r[d], o = r[d + 1], f = t[i], l = t[o], p = e[i], x = e[o], v = d; v < n && (v += 2, a = r[v], h = t[a], !(l < h)); ) {
      if (m = e[a], c = r[v + 1], u = t[c], E = e[c], p >= m) {
        if (p > E && x > m && x > E) continue;
      } else if (p < E && x < m && x < E) continue;
      i == a || i == c || o == a || o == c || (S = _i(
        f,
        p,
        l,
        x,
        h,
        m,
        u,
        E
      ), S && (g = [i, o], y = [a, c], s.push(wn(S, g, y, t, e)), S.length == 4 && s.push(
        wn(S.slice(2), g, y, t, e)
      )));
    }
    d += 2;
  }
  return s;
}
function _i(r, t, e, n, s, i, o, a) {
  const c = xi(r, t, e, n, s, i, o, a);
  let f = null;
  return c && (f = Mi(r, t, e, n, s, i, o, a), f ? Pi(r, t, e, n, s, i, o, a) && (f = null) : f = Oi(r, t, e, n, s, i, o, a)), f;
}
function xi(r, t, e, n, s, i, o, a) {
  return te(r, t, e, n, s, i) * te(r, t, e, n, o, a) <= 0 && te(s, i, o, a, r, t) * te(s, i, o, a, e, n) <= 0;
}
function te(r, t, e, n, s, i) {
  return Cn(r - s, t - i, e - s, n - i);
}
function Cn(r, t, e, n) {
  return r * n - t * e;
}
function Mi(r, t, e, n, s, i, o, a) {
  let c = pe(r, t, e, n, s, i, o, a), f;
  return c && (f = ki(c[0], c[1], r, t, e, n, s, i, o, a), f == 1 ? c = pe(e, n, r, t, s, i, o, a) : f == 2 ? c = pe(s, i, o, a, r, t, e, n) : f == 3 && (c = pe(o, a, s, i, r, t, e, n))), c && Ai(c, r, t, e, n, s, i, o, a), c;
}
function pe(r, t, e, n, s, i, o, a) {
  const c = Cn(e - r, n - t, o - s, a - i), f = 1e-18;
  let l;
  if (c === 0) return null;
  const h = te(s, i, o, a, r, t) / c;
  return c <= f && c >= -f ? l = Si(r, t, e, n, s, i, o, a) : l = [r + h * (e - r), t + h * (n - t)], l;
}
function Si(r, t, e, n, s, i, o, a) {
  let c = null;
  return !It(r, s, o) && !It(t, i, a) ? c = [r, t] : !It(e, s, o) && !It(n, i, a) ? c = [e, n] : !It(s, r, e) && !It(i, t, n) ? c = [s, i] : !It(o, r, e) && !It(a, t, n) && (c = [o, a]), c;
}
function It(r, t, e) {
  let n;
  return t < e ? n = r < t || r > e : t > e ? n = r > t || r < e : n = r != t, n;
}
function ki(r, t, ...e) {
  let n = -1, s = 1 / 0, i;
  for (let o = 0, a = 0, c = e.length; a < c; o++, a += 2)
    i = Ei(r, t, e[a], e[a + 1]), i < s && (s = i, n = o);
  return n;
}
function Ei(r, t, e, n) {
  const s = r - e, i = t - n;
  return s * s + i * i;
}
function Ai(r, t, e, n, s, i, o, a, c) {
  let f = r[0], l = r[1];
  f = me(f, t, n), f = me(f, i, a), l = me(l, e, s), l = me(l, o, c), r[0] = f, r[1] = l;
}
function me(r, t, e) {
  let n;
  return It(r, t, e) && (n = Math.abs(r - t) < Math.abs(r - e) ? t : e, r = n), r;
}
function Oi(r, t, e, n, s, i, o, a) {
  const c = Math.min(r, e, s, o), f = Math.max(r, e, s, o), l = Math.min(t, n, i, a), h = Math.max(t, n, i, a), u = h - l > f - c;
  let p = [];
  return (u ? Ct(t, l, h) : Ct(r, c, f)) && p.push(r, t), (u ? Ct(n, l, h) : Ct(e, c, f)) && p.push(e, n), (u ? Ct(i, l, h) : Ct(s, c, f)) && p.push(s, i), (u ? Ct(a, l, h) : Ct(o, c, f)) && p.push(o, a), (p.length != 2 && p.length != 4 || p.length == 4 && p[0] == p[2] && p[1] == p[3]) && (p = null), p;
}
function Pi(r, t, e, n, s, i, o, a) {
  return r == s && t == i || r == o && t == a || e == s && n == i || e == o && n == a;
}
function Ct(r, t, e) {
  return r > t && r < e;
}
function Ii(r, t) {
  Bi(r, t), Fn(r, t, 0, t.length - 2);
}
function Bi(r, t) {
  for (let e = 0, n = t.length; e < n; e += 2)
    r[t[e]] > r[t[e + 1]] && Ti(t, e, e + 1);
}
function Ti(r, t, e) {
  const n = r[t];
  r[t] = r[e], r[e] = n;
}
function Fn(r, t, e, n) {
  let s = e, i = n, o, a;
  for (; s < n; ) {
    for (o = r[t[e + n >> 2 << 1]]; s <= i; ) {
      for (; r[t[s]] < o; ) s += 2;
      for (; r[t[i]] > o; ) i -= 2;
      s <= i && (a = t[s], t[s] = t[i], t[i] = a, a = t[s + 1], t[s + 1] = t[i + 1], t[i + 1] = a, s += 2, i -= 2);
    }
    if (i - e < 40 ? gn(r, t, e, i) : Fn(r, t, e, i), n - s < 40) {
      gn(r, t, s, n);
      return;
    }
    e = s, i = n;
  }
}
function gn(r, t, e, n) {
  let s, i;
  for (let o = e + 2; o <= n; o += 2) {
    s = t[o], i = t[o + 1];
    let a;
    for (a = o - 2; a >= e && r[s] < r[t[a]]; a -= 2)
      t[a + 2] = t[a], t[a + 3] = t[a + 1];
    t[a + 2] = s, t[a + 3] = i;
  }
}
function wn(r, t, e, n, s) {
  const i = r[0], o = r[1];
  t = yn(i, o, t[0], t[1], n, s), e = yn(i, o, e[0], e[1], n, s);
  const a = t[0] < e[0] ? t : e, c = a == t ? e : t;
  return { x: i, y: o, a, b: c };
}
function yn(r, t, e, n, s, i) {
  let o = e < n ? e : n, a = o === e ? n : e;
  return s[o] == r && i[o] == t ? a = o : s[a] == r && i[a] == t && (o = a), [o, a];
}
function Dn(r) {
  const t = {};
  return r.filter((e) => {
    const n = Ni(e);
    return n in t ? !1 : (t[n] = !0, !0);
  });
}
function Ni(r) {
  return `${r.a.join(",")};${r.b.join(",")}`;
}
class Xi {
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
function Yi(r, t, e, n) {
  let s = e | 0;
  const i = isNaN(n) ? r.length - s : n + s;
  let o, a, c, f, l, h;
  if (i > 0)
    c = l = r[s], f = h = t[s];
  else return [void 0, void 0, void 0, void 0];
  for (s++; s < i; s++)
    o = r[s], a = t[s], o < c && (c = o), o > l && (l = o), a < f && (f = a), a > h && (h = a);
  return [c, f, l, h];
}
class _e {
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
    return new _e(this.xmin, this.ymin, this.xmax, this.ymax);
  }
  width() {
    return this.xmax - this.xmin || 0;
  }
  height() {
    return this.ymax - this.ymin || 0;
  }
  setBounds(t, e, n, s) {
    return arguments.length == 1 && ($e(t) ? (e = t[1], n = t[2], s = t[3], t = t[0]) : (e = t.ymin, n = t.xmax, s = t.ymax, t = t.xmin)), this.xmin = t, this.ymin = e, this.xmax = n, this.ymax = s, (t > n || e > s) && this.update(), this;
  }
  update() {
    let t;
    this.xmin > this.xmax && (t = this.xmin, this.xmin = this.xmax, this.xmax = t), this.ymin > this.ymax && (t = this.ymin, this.ymin = this.ymax, this.ymax = t);
  }
  mergeBounds(t, ...e) {
    let n, s, i, o;
    return t instanceof _e ? (n = t.xmin, s = t.ymin, i = t.xmax, o = t.ymax) : e.length == 3 ? (n = t, s = e[0], i = e[1], o = e[2]) : t.length == 4 ? (n = t[0], s = t[1], i = t[2], o = t[3]) : Le("Bounds#mergeBounds() invalid argument:", t), this.xmin === void 0 ? this.setBounds(n, s, i, o) : (n < this.xmin && (this.xmin = n), s < this.ymin && (this.ymin = s), i > this.xmax && (this.xmax = i), o > this.ymax && (this.ymax = o)), this;
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
function Ln(r, t, e) {
  const n = xe(t.forw), s = xe(t.bakw);
  if (JSON.stringify(n) != JSON.stringify(s))
    throw `${JSON.stringify(t, null, 2)}
${JSON.stringify(
      n
    )}
${JSON.stringify(s)}`;
  for (let i = 0; i < n.length; i++) {
    const o = n[i];
    r[o] || (r[o] = []), r[o].push(t);
  }
  e && (e.forw.features.push(t.forw), e.bakw.features.push(t.bakw));
}
function vn(r, t, e) {
  const n = xe(t.forw), s = xe(t.bakw);
  if (JSON.stringify(n) != JSON.stringify(s))
    throw `${JSON.stringify(t, null, 2)}
${JSON.stringify(n)}
${JSON.stringify(s)}`;
  if (n.forEach((i) => {
    const o = r[i];
    if (!o) return;
    const a = o.filter((c) => c !== t);
    a.length === 0 ? delete r[i] : r[i] = a;
  }), e) {
    const i = (o, a) => {
      !o || !a || (o.features = o.features.filter((c) => c !== a));
    };
    i(e.forw, t.forw), i(e.bakw, t.bakw);
  }
}
function ge(r, t, e) {
  return jt(r, { target: { geom: t, index: e } });
}
function we(r) {
  return jt(r.properties.target.geom, {
    target: {
      geom: r.geometry.coordinates,
      index: r.properties.target.index
    }
  });
}
function bn(r, t) {
  const e = t.geometry.coordinates;
  return [0, 1, 2, 3].map((n) => {
    const s = (n + 1) % 4, i = r[n], o = r[s], a = i.geometry.coordinates, c = Math.atan2(
      a[0] - e[0],
      a[1] - e[1]
    ), f = [t, i, o, t].map(
      (u) => u.geometry.coordinates
    ), l = {
      a: {
        geom: t.properties.target.geom,
        index: t.properties.target.index
      },
      b: {
        geom: i.properties.target.geom,
        index: i.properties.target.index
      },
      c: {
        geom: o.properties.target.geom,
        index: o.properties.target.index
      }
    }, h = Mt([
      ne([f], l)
    ]);
    return [c, h];
  }).reduce(
    (n, s) => (n[0].push(s[0]), n[1].push(s[1]), n),
    [[], []]
  );
}
function Ri(r) {
  const { tins: t, targets: e, includeReciprocals: n } = r, s = {};
  e.forEach((o) => {
    const a = t[o];
    if (!a || !a.features) return;
    s[o] = {};
    const c = {};
    a.features.forEach((f) => {
      const l = ["a", "b", "c"];
      for (let h = 0; h < 3; h++) {
        const u = (h + 1) % 3, p = l[h], x = l[u], m = f.properties[p].index, E = f.properties[x].index, S = [m, E].sort().join("-");
        if (c[S]) continue;
        c[S] = !0;
        const g = f.geometry.coordinates[0][h], y = f.geometry.coordinates[0][u], d = f.properties[p].geom, v = f.properties[x].geom, b = Math.sqrt(
          Math.pow(d[0] - v[0], 2) + Math.pow(d[1] - v[1], 2)
        ) / Math.sqrt(
          Math.pow(g[0] - y[0], 2) + Math.pow(g[1] - y[1], 2)
        ), O = s[o];
        O[`${m}:${S}`] = b, O[`${E}:${S}`] = b;
      }
    });
  });
  const i = {};
  return n && (i.bakw = {}), e.forEach((o) => {
    const a = s[o];
    if (i[o] = {}, !a)
      return;
    const c = {};
    Object.keys(a).forEach((l) => {
      const [h] = l.split(":");
      c[h] || (c[h] = []), c[h].push(a[l]);
    }), Object.keys(c).forEach((l) => {
      const h = c[l], u = h.reduce((p, x) => p + x, 0) / h.length;
      i[o][l] = u, n && i.bakw && (i.bakw[l] = 1 / u);
    });
    let f = 0;
    for (let l = 0; l < 4; l++) {
      const h = `b${l}`, u = i[o][h] || 0;
      f += u;
    }
    i[o].c = f / 4, n && i.bakw && (i.bakw.c = 1 / i[o].c);
  }), i;
}
function Ci(r, t) {
  const e = r.split("-");
  if (e.length !== 2 || !e.every((i) => /^-?\d+$/.test(i))) return !1;
  const [n, s] = e.map((i) => parseInt(i, 10)).sort((i, o) => i - o);
  return t.some((i) => {
    if (i.length !== 2) return !1;
    const o = i.map((c) => parseInt(`${c}`, 10));
    if (o.some((c) => Number.isNaN(c))) return !1;
    const a = o.sort((c, f) => c - f);
    return a[0] === n && a[1] === s;
  });
}
function ye(r) {
  return ["a", "b", "c"].map((t, e) => ({
    prop: r.properties[t],
    geom: r.geometry.coordinates[0][e]
  }));
}
function Fi(r, t, e) {
  const n = /* @__PURE__ */ new Set();
  let s = !1;
  const i = Object.keys(t);
  for (const o of i) {
    if (n.has(o)) continue;
    n.add(o);
    const a = t[o];
    if (!a || a.length < 2) continue;
    const c = o.split("-");
    if (c.length !== 2 || Ci(o, e)) continue;
    const f = ye(a[0].bakw), l = ye(a[1].bakw), h = ye(a[0].forw), u = ye(a[1].forw), p = c.map(
      (_) => f.find((I) => `${I.prop.index}` === _) || l.find((I) => `${I.prop.index}` === _)
    ), x = c.map(
      (_) => h.find((I) => `${I.prop.index}` === _) || u.find((I) => `${I.prop.index}` === _)
    );
    if (p.some((_) => !_) || x.some((_) => !_))
      continue;
    const m = [f, l].map(
      (_) => _.find((I) => !c.includes(`${I.prop.index}`))
    ), E = [h, u].map(
      (_) => _.find((I) => !c.includes(`${I.prop.index}`))
    );
    if (m.some((_) => !_) || E.some((_) => !_))
      continue;
    const S = a[0].bakw.geometry.coordinates[0].slice(0, 3).map((_) => Vt(_)), g = a[1].bakw.geometry.coordinates[0].slice(0, 3).map((_) => Vt(_));
    if (!(_n(
      Vt(m[0].geom),
      g
    ) || _n(
      Vt(m[1].geom),
      S
    )))
      continue;
    const d = x.map(
      (_) => Vt(_.geom)
    ), v = E.map(
      (_) => Vt(_.geom)
    ), b = Di([
      ...d,
      ...v
    ]), O = Li(b), P = xn(
      d[0],
      d[1],
      v[0]
    ) + xn(
      d[0],
      d[1],
      v[1]
    );
    Ce(O, P) && (vn(t, a[0], r), vn(t, a[1], r), p.forEach((_) => {
      if (!_) return;
      const I = [
        _.geom,
        m[0].geom,
        m[1].geom,
        _.geom
      ], X = {
        a: _.prop,
        b: m[0].prop,
        c: m[1].prop
      }, Y = ne([I], X), L = On(Y);
      Ln(t, {
        forw: L,
        bakw: Y
      }, r);
    }), s = !0);
  }
  return s;
}
function Vt(r) {
  return [r[0], r[1]];
}
function _n(r, t) {
  const [e, n] = t[0], [s, i] = t[1], [o, a] = t[2], c = o - e, f = a - n, l = s - e, h = i - n, u = r[0] - e, p = r[1] - n, x = c * c + f * f, m = c * l + f * h, E = c * u + f * p, S = l * l + h * h, g = l * u + h * p, y = x * S - m * m;
  if (y === 0) return !1;
  const d = 1 / y, v = (S * E - m * g) * d, b = (x * g - m * E) * d, O = 1e-9;
  return v >= -O && b >= -O && v + b <= 1 + O;
}
function Di(r) {
  const t = r.map((o) => o.slice()).filter(
    (o, a, c) => c.findIndex(
      (f) => Ce(f[0], o[0]) && Ce(f[1], o[1])
    ) === a
  );
  if (t.length <= 1) return t;
  const e = t.sort(
    (o, a) => o[0] === a[0] ? o[1] - a[1] : o[0] - a[0]
  ), n = (o, a, c) => (a[0] - o[0]) * (c[1] - o[1]) - (a[1] - o[1]) * (c[0] - o[0]), s = [];
  for (const o of e) {
    for (; s.length >= 2 && n(
      s[s.length - 2],
      s[s.length - 1],
      o
    ) <= 0; )
      s.pop();
    s.push(o);
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
  return i.pop(), s.pop(), s.concat(i);
}
function Li(r) {
  if (r.length < 3) return 0;
  let t = 0;
  for (let e = 0; e < r.length; e++) {
    const [n, s] = r[e], [i, o] = r[(e + 1) % r.length];
    t += n * o - i * s;
  }
  return Math.abs(t) / 2;
}
function xn(r, t, e) {
  return Math.abs(
    (r[0] * (t[1] - e[1]) + t[0] * (e[1] - r[1]) + e[0] * (r[1] - t[1])) / 2
  );
}
function Ce(r, t, e = 1e-9) {
  return Math.abs(r - t) <= e;
}
const Mn = Re;
class ft extends Ur {
  importance;
  priority;
  pointsSet;
  /**
   * Tinクラスのインスタンスを生成します
   * @param options - 初期化オプション
   */
  constructor(t = {}) {
    super(), t.bounds ? this.setBounds(t.bounds) : (this.setWh(t.wh), this.vertexMode = t.vertexMode || ft.VERTEX_PLAIN), this.strictMode = t.strictMode || ft.MODE_AUTO, this.yaxisMode = t.yaxisMode || ft.YAXIS_INVERT, this.importance = t.importance || 0, this.priority = t.priority || 0, this.stateFull = t.stateFull || !1, t.points && this.setPoints(t.points), t.edges && this.setEdges(t.edges);
  }
  /**
   * フォーマットバージョンを取得します
   */
  getFormatVersion() {
    return Mn;
  }
  /**
   * 制御点（GCP: Ground Control Points）を設定します。
   * 指定した点群に合わせて内部のTINキャッシュをリセットします。
   */
  setPoints(t) {
    this.yaxisMode === ft.YAXIS_FOLLOW && (t = t.map((e) => [
      e[0],
      [e[1][0], -1 * e[1][1]]
    ])), this.points = t, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * エッジ（制約線）を設定します。
   * 制約線を正規化した上で、依存するキャッシュをリセットします。
   */
  setEdges(t = []) {
    this.edges = In(t), this.edgeNodes = void 0, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 境界ポリゴンを設定します
   */
  setBounds(t) {
    this.bounds = t;
    let e = t[0][0], n = e, s = t[0][1], i = s;
    const o = [t[0]];
    for (let a = 1; a < t.length; a++) {
      const c = t[a];
      c[0] < e && (e = c[0]), c[0] > n && (n = c[0]), c[1] < s && (s = c[1]), c[1] > i && (i = c[1]), o.push(c);
    }
    o.push(t[0]), this.boundsPolygon = ne([o]), this.xy = [e, s], this.wh = [n - e, i - s], this.vertexMode = ft.VERTEX_PLAIN, this.tins = void 0, this.indexedTins = void 0;
  }
  /**
   * 現在の設定を永続化可能な形式にコンパイルします
   */
  getCompiled() {
    const t = {};
    t.version = Mn, t.points = this.points, t.weight_buffer = this.pointsWeightBuffer, t.centroid_point = [
      this.centroid.forw.geometry.coordinates,
      this.centroid.forw.properties.target.geom
    ], t.vertices_params = [
      this.vertices_params.forw[0],
      this.vertices_params.bakw[0]
    ], t.vertices_points = [];
    const e = this.vertices_params.forw[1];
    return e && [0, 1, 2, 3].map((n) => {
      const s = e[n].features[0], i = s.geometry.coordinates[0][1], o = s.properties.b.geom;
      t.vertices_points[n] = [i, o];
    }), t.strict_status = this.strict_status, t.tins_points = [[]], this.tins.forw.features.map((n) => {
      t.tins_points[0].push(
        ["a", "b", "c"].map(
          (s) => n.properties[s].index
        )
      );
    }), this.strict_status === ft.STATUS_LOOSE ? (t.tins_points[1] = [], this.tins.bakw.features.map((n) => {
      t.tins_points[1].push(
        ["a", "b", "c"].map(
          (s) => n.properties[s].index
        )
      );
    })) : this.strict_status === ft.STATUS_ERROR && this.kinks?.bakw && (t.kinks_points = this.kinks.bakw.features.map(
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
      (s) => On(s)
    );
    this.tins.bakw = Mt(t);
    const e = {};
    this.tins.forw.features.forEach((s, i) => {
      const o = this.tins.bakw.features[i];
      Ln(e, { forw: s, bakw: o });
    }), Fi(
      this.tins,
      e,
      this.pointsSet?.edges || []
    );
    const n = ["forw", "bakw"].map((s) => {
      const i = this.tins[s].features.map(
        (o) => o.geometry.coordinates[0]
      );
      return di(i);
    });
    n[0].length === 0 && n[1].length === 0 ? (this.strict_status = ft.STATUS_STRICT, delete this.kinks) : (this.strict_status = ft.STATUS_ERROR, this.kinks = {
      forw: Mt(n[0]),
      bakw: Mt(n[1])
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
      const i = this.points[s][0], o = this.points[s][1], a = ge(i, o, s);
      t.forw.push(a), t.bakw.push(we(a));
    }
    const e = [];
    let n = 0;
    this.edgeNodes = [], this.edges || (this.edges = []);
    for (let s = 0; s < this.edges.length; s++) {
      const i = this.edges[s][2], o = Object.assign([], this.edges[s][0]), a = Object.assign([], this.edges[s][1]);
      if (o.length === 0 && a.length === 0) {
        e.push(i);
        continue;
      }
      o.unshift(this.points[i[0]][0]), o.push(this.points[i[1]][0]), a.unshift(this.points[i[0]][1]), a.push(this.points[i[1]][1]);
      const c = [o, a].map((f) => {
        const l = f.map((u, p, x) => {
          if (p === 0) return 0;
          const m = x[p - 1];
          return Math.sqrt(
            Math.pow(u[0] - m[0], 2) + Math.pow(u[1] - m[1], 2)
          );
        }), h = l.reduce((u, p, x) => x === 0 ? [0] : (u.push(u[x - 1] + p), u), []);
        return h.map((u, p, x) => {
          const m = u / x[x.length - 1];
          return [f[p], l[p], h[p], m];
        });
      });
      c.map((f, l) => {
        const h = c[l ? 0 : 1];
        return f.filter((u, p) => !(p === 0 || p === f.length - 1 || u[4] === "handled")).map((u) => {
          const p = u[0], x = u[3], m = h.reduce(
            (E, S, g, y) => {
              if (E) return E;
              const d = y[g + 1];
              if (S[3] === x)
                return S[4] = "handled", [S];
              if (S[3] < x && d && d[3] > x)
                return [S, d];
            },
            void 0
          );
          if (m && m.length === 1)
            return l === 0 ? [p, m[0][0], x] : [m[0][0], p, x];
          if (m && m.length === 2) {
            const E = m[0], S = m[1], g = (x - E[3]) / (S[3] - E[3]), y = [
              (S[0][0] - E[0][0]) * g + E[0][0],
              (S[0][1] - E[0][1]) * g + E[0][1]
            ];
            return l === 0 ? [p, y, x] : [y, p, x];
          }
          return [];
        });
      }).reduce((f, l) => f.concat(l), []).sort((f, l) => f[2] < l[2] ? -1 : 1).map((f, l, h) => {
        this.edgeNodes[n] = [
          f[0],
          f[1]
        ];
        const u = ge(
          f[0],
          f[1],
          `e${n}`
        );
        n++, t.forw.push(u), t.bakw.push(we(u)), l === 0 ? e.push([i[0], t.forw.length - 1]) : e.push([
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
    const t = this.xy[0] - 0.05 * this.wh[0], e = this.xy[0] + 1.05 * this.wh[0], n = this.xy[1] - 0.05 * this.wh[1], s = this.xy[1] + 1.05 * this.wh[1];
    if (!this.points.reduce((a, c) => a && (this.bounds ? sr(c[0], this.boundsPolygon) : c[0][0] >= t && c[0][0] <= e && c[0][1] >= n && c[0][1] <= s), !0))
      throw "SOME POINTS OUTSIDE";
    let o = [];
    return this.wh && (o = [[t, n], [e, n], [t, s], [e, s]]), {
      pointsSet: this.generatePointsSet(),
      bbox: o,
      minx: t,
      maxx: e,
      miny: n,
      maxy: s
    };
  }
  /**
   * TINネットワークを同期的に更新し、座標変換の準備を行います。
   * 重めの計算を伴うため、呼び出し側が非同期制御を行いたい場合は
   * {@link updateTinAsync} を利用してください。
   */
  updateTin() {
    let t = this.strictMode;
    t !== ft.MODE_STRICT && t !== ft.MODE_LOOSE && (t = ft.MODE_AUTO);
    const { pointsSet: e, bbox: n, minx: s, maxx: i, miny: o, maxy: a } = this.validateAndPrepareInputs(), c = {
      forw: Mt(e.forw),
      bakw: Mt(e.bakw)
    }, f = fe(
      c.forw,
      e.edges,
      "target"
    ), l = fe(
      c.bakw,
      e.edges,
      "target"
    );
    if (f.features.length === 0 || l.features.length === 0)
      throw "TOO LINEAR1";
    const h = ar(c.forw), u = en(c.forw);
    if (!u) throw "TOO LINEAR2";
    const p = {}, x = u.geometry.coordinates[0];
    let m;
    try {
      m = x.map((_) => ({
        forw: _,
        bakw: be(jt(_), f)
      })), m.forEach((_) => {
        p[`${_.forw[0]}:${_.forw[1]}`] = _;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const E = en(c.bakw);
    if (!E) throw "TOO LINEAR2";
    const S = E.geometry.coordinates[0];
    try {
      m = S.map((_) => ({
        bakw: _,
        forw: be(jt(_), l)
      })), m.forEach((_) => {
        p[`${_.forw[0]}:${_.forw[1]}`] = _;
      });
    } catch {
      throw "TOO LINEAR2";
    }
    const g = {
      forw: h.geometry.coordinates,
      bakw: be(h, f)
    }, y = ge(g.forw, g.bakw, "c");
    this.centroid = {
      forw: y,
      bakw: we(y)
    };
    const d = {
      convexBuf: p,
      centroid: g,
      bbox: n,
      minx: s,
      maxx: i,
      miny: o,
      maxy: a
    }, v = this.vertexMode === ft.VERTEX_BIRDEYE ? ui(d) : li(d), b = {
      forw: [],
      bakw: []
    };
    for (let _ = 0; _ < v.length; _++) {
      const I = v[_].forw, X = v[_].bakw, Y = ge(I, X, `b${_}`), L = we(Y);
      e.forw.push(Y), e.bakw.push(L), b.forw.push(Y), b.bakw.push(L);
    }
    this.pointsSet = {
      forw: Mt(e.forw),
      bakw: Mt(e.bakw),
      edges: e.edges
    }, this.tins = {
      forw: cn(
        fe(
          this.pointsSet.forw,
          e.edges,
          "target"
        )
      )
    }, (t === ft.MODE_STRICT || t === ft.MODE_AUTO) && this.calcurateStrictTin(), (t === ft.MODE_LOOSE || t === ft.MODE_AUTO && this.strict_status === ft.STATUS_ERROR) && (this.tins.bakw = cn(
      fe(
        this.pointsSet.bakw,
        e.edges,
        "target"
      )
    ), delete this.kinks, this.strict_status = ft.STATUS_LOOSE), this.vertices_params = {
      forw: bn(b.forw, this.centroid.forw),
      bakw: bn(b.bakw, this.centroid.bakw)
    }, this.addIndexedTin();
    const O = ["forw"];
    this.strict_status === ft.STATUS_LOOSE && O.push("bakw");
    const P = this.strict_status === ft.STATUS_STRICT;
    this.pointsWeightBuffer = Ri({
      tins: this.tins,
      targets: O,
      includeReciprocals: P
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
export {
  ft as Tin,
  fe as constrainedTin,
  we as counterPoint,
  ge as createPoint,
  ft as default,
  di as findIntersections,
  Re as format_version,
  Ln as insertSearchIndex,
  bn as vertexCalc
};
