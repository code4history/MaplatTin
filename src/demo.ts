/**
 * MaplatTin Visualization Demo
 *
 * テストケース: 伏見城 / 奈良町 / 銀座  ×  v2 / v3
 * 可視化モード: 無限遠半直線 / グリッド変換 / ラウンドトリップ誤差
 *
 * compiled ファイルから直接読み込む（高速・再 build 不要）
 */

import { Tin } from "./index.ts";
import type { Compiled, PointSet } from "./index.ts";

// ─── 型 ──────────────────────────────────────────────────────────────────────

type Pos = [number, number];
type VizMode = "rays" | "grid" | "roundtrip";
type FormatVer = "v2" | "v3";

interface MapConfig {
  label: string;
  key: string;
  note?: string;
}

interface LoadedState {
  tin: Tin;
  compiled: Compiled;
  mapLabel: string;
  ver: FormatVer;
}

// ─── マップ定義 ───────────────────────────────────────────────────────────────

const MAPS: MapConfig[] = [
  { label: "伏見城 (plain)",           key: "fushimijo_maplat" },
  { label: "奈良町安井文庫 (birdeye)", key: "naramachi_yasui_bunko" },
  { label: "銀座 (pre-compiled)",      key: "miesan_ginza_map",
    note: "compiled データから GCP を復元して v2/v3 それぞれで再コンパイル済み" },
  { label: "館林城 (pre-compiled)",    key: "tatebayashi_castle_akimoto",
    note: "compiled データから GCP を復元して v2/v3 それぞれで再コンパイル済み" },
  { label: "館林城下町 (pre-compiled)", key: "tatebayashi_kaei_jokamachi",
    note: "compiled データから GCP を復元して v2/v3 それぞれで再コンパイル済み" },
];

// ─── 描画定数 ─────────────────────────────────────────────────────────────────

const CANVAS_SIZE = 540;
const PADDING = 32;
const GRID_N = 20;
const RT_GRID_N = 30;
const RT_ERROR_THRESHOLD = 0.1; // 0.1px 以下は視覚的に無意味（丸め誤差範囲）→ 青で表示

// ─── ビューポート ─────────────────────────────────────────────────────────────

class Viewport {
  private minX: number;
  private maxX: number;
  private minY: number;
  private maxY: number;
  readonly scale: number;
  private offX: number;
  private offY: number;
  readonly flipY: boolean;

  constructor(points: Pos[], flipY = false) {
    this.flipY = flipY;
    const xs = points.map(p => p[0]);
    const ys = points.map(p => p[1]);
    this.minX = Math.min(...xs);
    this.maxX = Math.max(...xs);
    this.minY = Math.min(...ys);
    this.maxY = Math.max(...ys);
    const mx = (this.maxX - this.minX) * 0.06 || 1;
    const my = (this.maxY - this.minY) * 0.06 || 1;
    this.minX -= mx; this.maxX += mx;
    this.minY -= my; this.maxY += my;
    const avail = CANVAS_SIZE - PADDING * 2;
    const scale = Math.min(avail / (this.maxX - this.minX), avail / (this.maxY - this.minY));
    this.scale = scale;
    this.offX = PADDING + (avail - (this.maxX - this.minX) * scale) / 2;
    this.offY = PADDING + (avail - (this.maxY - this.minY) * scale) / 2;
  }

  c(x: number, y: number): Pos {
    return [
      this.offX + (x - this.minX) * this.scale,
      this.flipY
        ? this.offY + (this.maxY - y) * this.scale
        : this.offY + (y - this.minY) * this.scale,
    ];
  }
}

// ─── envelope ユーティリティ ──────────────────────────────────────────────────

/**
 * envelope = メインマップの画像領域
 * Source 空間では wh から求まる矩形 [0,0,w,h] の4隅。
 * Target 空間ではその4隅を transform() した座標。
 */
function getEnvelopeCorners(compiled: Compiled, tin: Tin, dir: "forw" | "bakw"): Pos[] {
  const [w, h] = compiled.wh!;
  const forwCorners: Pos[] = [[0, 0], [w, 0], [w, h], [0, h]];
  if (dir === "forw") return forwCorners;
  // Target 側: 各隅を forward 変換して Target 座標を得る
  return forwCorners
    .map(pt => tin.transform(pt) as Pos | false)
    .filter((r): r is Pos => r !== false && r !== null);
}

/** envelope ([0,0,w,h]) 内に n+1 本のグリッド線座標を生成 */
function gridPoints(compiled: Compiled, n: number): { xs: number[]; ys: number[] } {
  const [w, h] = compiled.wh!;
  return {
    xs: Array.from({ length: n + 1 }, (_, i) => (i / n) * w),
    ys: Array.from({ length: n + 1 }, (_, j) => (j / n) * h),
  };
}

// ─── 描画ユーティリティ ───────────────────────────────────────────────────────

function clearCanvas(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  ctx.fillStyle = "#f8f9fa";
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
}

function buildViewport(compiled: Compiled, dir: "forw" | "bakw"): Viewport {
  const idx = dir === "forw" ? 0 : 1;
  const [w, h] = compiled.wh!;
  const pts: Pos[] = [
    ...compiled.points.map(p => p[idx] as Pos),
    ...compiled.vertices_points.map(v => v[idx] as Pos),
    ...(compiled.centroid_point?.[idx] ? [compiled.centroid_point[idx] as Pos] : []),
  ];
  // forw: envelope [0,0,w,h] の4隅を必ず含める（v2/v3 間で表示範囲を統一）
  if (dir === "forw") {
    pts.push([0, 0], [w, 0], [w, h], [0, h]);
  }
  return new Viewport(pts, dir === "bakw");
}

function drawTriangles(ctx: CanvasRenderingContext2D, tin: Tin, vp: Viewport, dir: "forw" | "bakw") {
  const tins = tin.tins?.[dir];
  if (!tins) return;
  ctx.save();
  ctx.fillStyle = "rgba(180,200,255,0.18)";
  ctx.strokeStyle = "rgba(100,130,200,0.35)";
  ctx.lineWidth = 0.6;
  for (const feat of tins.features) {
    const c = feat.geometry.coordinates[0];
    ctx.beginPath();
    const [x0, y0] = vp.c(c[0][0], c[0][1]);
    ctx.moveTo(x0, y0);
    for (let i = 1; i < c.length - 1; i++) {
      const [x, y] = vp.c(c[i][0], c[i][1]);
      ctx.lineTo(x, y);
    }
    ctx.closePath(); ctx.fill(); ctx.stroke();
  }
  ctx.restore();
}

function drawGCPs(ctx: CanvasRenderingContext2D, points: PointSet[], vp: Viewport, dir: "forw" | "bakw") {
  const idx = dir === "forw" ? 0 : 1;
  ctx.save();
  ctx.fillStyle = "#3a7bd5";
  for (const pt of points) {
    const [cx, cy] = vp.c(pt[idx][0], pt[idx][1]);
    ctx.beginPath();
    ctx.arc(cx, cy, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawCentroid(ctx: CanvasRenderingContext2D, coords: number[], vp: Viewport) {
  const [cx, cy] = vp.c(coords[0], coords[1]);
  ctx.save();
  ctx.fillStyle = "#f5c518";
  ctx.strokeStyle = "#c0900f";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy, 7, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();
  ctx.restore();
}

function drawVertices(ctx: CanvasRenderingContext2D, vertices: PointSet[], vp: Viewport, dir: "forw" | "bakw") {
  const idx = dir === "forw" ? 0 : 1;
  ctx.save();
  for (let i = 0; i < vertices.length; i++) {
    const pt = vertices[i][idx];
    const [cx, cy] = vp.c(pt[0], pt[1]);
    const hue = (i / vertices.length) * 360;
    ctx.fillStyle = `hsl(${hue},90%,50%)`;
    ctx.strokeStyle = "#333"; ctx.lineWidth = 1;
    const r = 6;
    ctx.beginPath();
    ctx.moveTo(cx, cy - r);
    ctx.lineTo(cx + r * 0.7, cy + r * 0.5);
    ctx.lineTo(cx - r * 0.7, cy + r * 0.5);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#333";
    ctx.font = "bold 9px sans-serif";
    ctx.fillText(String(i), cx + 8, cy + 4);
  }
  ctx.restore();
}

function drawRays(ctx: CanvasRenderingContext2D, centroid: number[], vertices: PointSet[], vp: Viewport, dir: "forw" | "bakw") {
  const idx = dir === "forw" ? 0 : 1;
  const [cx0, cy0] = vp.c(centroid[0], centroid[1]);
  ctx.save();
  ctx.lineWidth = 1.2;
  for (let i = 0; i < vertices.length; i++) {
    const vpt = vertices[i][idx];
    const [vx, vy] = vp.c(vpt[0], vpt[1]);
    const dx = vx - cx0; const dy = vy - cy0;
    const len = Math.hypot(dx, dy);
    if (len < 0.001) continue;
    const ext = (CANVAS_SIZE * 2) / len;
    const hue = (i / vertices.length) * 360;
    ctx.strokeStyle = `hsl(${hue},85%,45%)`;
    ctx.setLineDash([6, 3]);
    ctx.beginPath();
    ctx.moveTo(cx0, cy0);
    ctx.lineTo(cx0 + dx * ext, cy0 + dy * ext);
    ctx.stroke();
  }
  ctx.setLineDash([]); ctx.restore();
}

/**
 * envelope を描画する。
 * corners は Source/Target それぞれの座標の配列（4点）。
 * Source: wh から算出した矩形の4隅
 * Target: その4隅を transform() した座標
 */
function drawEnvelope(
  ctx: CanvasRenderingContext2D,
  corners: Pos[],
  vp: Viewport,
  label?: string,
) {
  if (corners.length < 3) return;
  ctx.save();
  ctx.strokeStyle = "#27ae60";
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 4]);
  ctx.beginPath();
  const [x0, y0] = vp.c(corners[0][0], corners[0][1]);
  ctx.moveTo(x0, y0);
  for (let i = 1; i < corners.length; i++) {
    const [x, y] = vp.c(corners[i][0], corners[i][1]);
    ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.setLineDash([]);
  if (label) {
    ctx.fillStyle = "#27ae60";
    ctx.font = "bold 10px sans-serif";
    ctx.fillText(label, x0 + 4, y0 - 4);
  }
  ctx.restore();
}

function drawLabel(ctx: CanvasRenderingContext2D, text: string) {
  ctx.save();
  ctx.fillStyle = "#333"; ctx.font = "bold 12px sans-serif";
  ctx.fillText(text, PADDING, 20);
  ctx.restore();
}

// ─── カラースケール ───────────────────────────────────────────────────────────

function errorColor(t: number): string {
  const r = Math.round(Math.min(1, t * 2) * 255);
  const g = Math.round(Math.max(0, 1 - Math.abs(t - 0.5) * 4) * 200);
  const b = Math.round(Math.max(0, 1 - t * 2) * 255);
  return `rgba(${r},${g},${b},0.75)`;
}

/**
 * err を 0–1 に正規化する（RT_ERROR_THRESHOLD 以下は 0 = 青）。
 * allBlue モードでは常に 0 を返す。
 */
function normalizedError(err: number, maxErr: number, allBlue: boolean): number {
  if (allBlue || err <= RT_ERROR_THRESHOLD) return 0;
  // threshold 超の範囲を 0–1 にリマップ
  return (err - RT_ERROR_THRESHOLD) / (maxErr - RT_ERROR_THRESHOLD);
}

function drawColorScale(ctx: CanvasRenderingContext2D, maxErr: number, allBlue: boolean) {
  const x0 = CANVAS_SIZE - PADDING - 110;
  const y0 = CANVAS_SIZE - PADDING - 20;
  const w = 100; const h = 10;
  ctx.save();
  if (allBlue) {
    ctx.fillStyle = "rgba(0,0,255,0.8)";
    ctx.fillRect(x0, y0, w, h);
    ctx.strokeStyle = "#555"; ctx.lineWidth = 0.5; ctx.strokeRect(x0, y0, w, h);
    ctx.fillStyle = "#333"; ctx.font = "9px sans-serif";
    ctx.fillText("全点 < 0.1px", x0, y0 - 2);
  } else {
    const grad = ctx.createLinearGradient(x0, 0, x0 + w, 0);
    grad.addColorStop(0, "rgba(0,0,255,0.8)");
    grad.addColorStop(0.5, "rgba(255,255,0,0.8)");
    grad.addColorStop(1, "rgba(255,0,0,0.8)");
    ctx.fillStyle = grad; ctx.fillRect(x0, y0, w, h);
    ctx.strokeStyle = "#555"; ctx.lineWidth = 0.5; ctx.strokeRect(x0, y0, w, h);
    ctx.fillStyle = "#333"; ctx.font = "9px sans-serif";
    ctx.fillText("≤0.1px", x0, y0 - 2);
    ctx.fillText(maxErr.toExponential(1), x0 + w - 30, y0 - 2);
  }
  ctx.restore();
}

// ─── 可視化: 無限遠半直線 ─────────────────────────────────────────────────────

function vizRays(ctxF: CanvasRenderingContext2D, ctxB: CanvasRenderingContext2D, state: LoadedState, legendEl: HTMLElement) {
  const { tin, compiled } = state;
  const vpF = buildViewport(compiled, "forw");
  const vpB = buildViewport(compiled, "bakw");
  const centF = compiled.centroid_point[0] as number[];
  const centB = compiled.centroid_point[1] as number[];

  const envF = getEnvelopeCorners(compiled, tin, "forw");
  const envB = getEnvelopeCorners(compiled, tin, "bakw");

  for (const [ctx, vp, dir, env] of [
    [ctxF, vpF, "forw", envF] as const,
    [ctxB, vpB, "bakw", envB] as const,
  ]) {
    clearCanvas(ctx);
    drawTriangles(ctx, tin, vp, dir);
    drawGCPs(ctx, compiled.points, vp, dir);
    drawRays(ctx, dir === "forw" ? centF : centB, compiled.vertices_points, vp, dir);
    drawEnvelope(ctx, env, vp, dir === "forw" ? "envelope" : undefined);
    drawVertices(ctx, compiled.vertices_points, vp, dir);
    drawCentroid(ctx, dir === "forw" ? centF : centB, vp);
    drawLabel(ctx, dir === "forw" ? "Source (Forw)" : "Target (Bakw)");
  }

  const n = compiled.vertices_points.length;
  const ver = compiled.version ?? "<=2.007";
  const vmode = compiled.vertexMode ?? "plain";
  legendEl.innerHTML = `
    <b>境界頂点数:</b> ${n} 個 &nbsp;|&nbsp;
    <b>version:</b> ${ver} &nbsp;|&nbsp;
    <b>vertexMode:</b> ${vmode} &nbsp;|&nbsp;
    <b>strict_status:</b> ${compiled.strict_status ?? "-"}<br>
    <span style="color:#27ae60">━━</span> envelope（マップ画像領域 [0,0,w,h]）&nbsp;
    <span style="background:#f5c518;padding:0 5px;border-radius:3px">●</span> 重心 &nbsp;
    ▲ 境界頂点 &nbsp;
    <span style="color:#3a7bd5">●</span> GCP &nbsp;
    <span style="color:rgba(100,130,200,0.9)">▭</span> TIN 三角形
  `;
}

// ─── 可視化: グリッド変換 ─────────────────────────────────────────────────────

function vizGrid(ctxF: CanvasRenderingContext2D, ctxB: CanvasRenderingContext2D, state: LoadedState, legendEl: HTMLElement) {
  const { tin, compiled } = state;
  const vpF = buildViewport(compiled, "forw");
  const vpB = buildViewport(compiled, "bakw");

  // グリッドの定義域は envelope = マップ画像領域 [0,0,w,h]
  const { xs, ys } = gridPoints(compiled, GRID_N);
  const envF = getEnvelopeCorners(compiled, tin, "forw");
  const envB = getEnvelopeCorners(compiled, tin, "bakw");

  const gridB: (Pos | null)[][] = ys.map(y =>
    xs.map(x => { const r = tin.transform([x, y]); return r ? r as Pos : null; })
  );

  const stroke = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = "rgba(40,120,40,0.7)"; ctx.lineWidth = 0.8;
  };

  // ─ Forw ─
  clearCanvas(ctxF);
  drawTriangles(ctxF, tin, vpF, "forw");
  ctxF.save(); stroke(ctxF);
  for (let j = 0; j <= GRID_N; j++) {
    ctxF.beginPath();
    for (let i = 0; i <= GRID_N; i++) {
      const [cx, cy] = vpF.c(xs[i], ys[j]);
      i === 0 ? ctxF.moveTo(cx, cy) : ctxF.lineTo(cx, cy);
    }
    ctxF.stroke();
  }
  for (let i = 0; i <= GRID_N; i++) {
    ctxF.beginPath();
    for (let j = 0; j <= GRID_N; j++) {
      const [cx, cy] = vpF.c(xs[i], ys[j]);
      j === 0 ? ctxF.moveTo(cx, cy) : ctxF.lineTo(cx, cy);
    }
    ctxF.stroke();
  }
  ctxF.restore();
  drawEnvelope(ctxF, envF, vpF, "envelope");
  drawGCPs(ctxF, compiled.points, vpF, "forw");
  drawLabel(ctxF, "Source (Forw) — regular grid");

  // ─ Bakw ─
  clearCanvas(ctxB);
  drawTriangles(ctxB, tin, vpB, "bakw");
  ctxB.save(); stroke(ctxB);
  for (let j = 0; j <= GRID_N; j++) {
    ctxB.beginPath(); let started = false;
    for (let i = 0; i <= GRID_N; i++) {
      const pt = gridB[j][i];
      if (!pt) { started = false; continue; }
      const [cx, cy] = vpB.c(pt[0], pt[1]);
      if (!started) { ctxB.moveTo(cx, cy); started = true; } else ctxB.lineTo(cx, cy);
    }
    ctxB.stroke();
  }
  for (let i = 0; i <= GRID_N; i++) {
    ctxB.beginPath(); let started = false;
    for (let j = 0; j <= GRID_N; j++) {
      const pt = gridB[j][i];
      if (!pt) { started = false; continue; }
      const [cx, cy] = vpB.c(pt[0], pt[1]);
      if (!started) { ctxB.moveTo(cx, cy); started = true; } else ctxB.lineTo(cx, cy);
    }
    ctxB.stroke();
  }
  ctxB.restore();
  drawEnvelope(ctxB, envB, vpB);
  drawGCPs(ctxB, compiled.points, vpB, "bakw");
  drawLabel(ctxB, "Target (Bakw) — deformed grid");

  legendEl.innerHTML = `
    <span style="color:rgba(40,120,40,0.9)">━━</span> グリッド (${GRID_N}×${GRID_N}、envelope 全域) &nbsp;|&nbsp;
    <span style="color:#27ae60">━━</span> envelope（マップ画像領域 [0,0,w,h]）&nbsp;|&nbsp;
    白抜け = transform() が false（変換不可）
  `;
}

// ─── 可視化: ラウンドトリップ誤差 ────────────────────────────────────────────

function vizRoundtrip(ctxF: CanvasRenderingContext2D, ctxB: CanvasRenderingContext2D, state: LoadedState, legendEl: HTMLElement) {
  const { tin, compiled } = state;
  const vpF = buildViewport(compiled, "forw");
  const vpB = buildViewport(compiled, "bakw");

  if (compiled.strict_status === "strict_error") {
    for (const ctx of [ctxF, ctxB]) {
      clearCanvas(ctx);
      ctx.save();
      ctx.fillStyle = "#c0392b"; ctx.font = "bold 15px sans-serif"; ctx.textAlign = "center";
      ctx.fillText("strict_status = strict_error のため", CANVAS_SIZE / 2, CANVAS_SIZE / 2 - 10);
      ctx.fillText("ラウンドトリップ変換は利用不可", CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 14);
      ctx.restore();
    }
    legendEl.innerHTML = `<span style="color:#c0392b">⚠ strict_error マップは backward transform が禁止されています</span>`;
    return;
  }

  // ヒートマップの定義域は envelope = マップ画像領域 [0,0,w,h]
  const { xs, ys } = gridPoints(compiled, RT_GRID_N);
  const envF = getEnvelopeCorners(compiled, tin, "forw");
  const envB = getEnvelopeCorners(compiled, tin, "bakw");

  type Cell = { err: number; bakwPt: Pos | null };
  const cells: Cell[][] = ys.map(y =>
    xs.map(x => {
      const p2 = tin.transform([x, y]);
      if (!p2) return { err: -1, bakwPt: null };
      let p3: number[] | false;
      try { p3 = tin.transform(p2, true); } catch { p3 = false; }
      if (!p3) return { err: -1, bakwPt: p2 as Pos };
      const dx = p3[0] - x; const dy = p3[1] - y;
      return { err: Math.sqrt(dx * dx + dy * dy), bakwPt: p2 as Pos };
    })
  );

  const validErrs = cells.flat().map(c => c.err).filter(e => e >= 0);
  const maxErr = validErrs.length > 0 ? Math.max(...validErrs) : 1;
  const meanErr = validErrs.reduce((a, b) => a + b, 0) / (validErrs.length || 1);
  // 全点が 0.1px 未満なら色スケール全体を青（視覚的ノイズを避ける）
  const allBlue = maxErr < RT_ERROR_THRESHOLD;

  // ─ Forw ヒートマップ ─
  clearCanvas(ctxF);
  drawTriangles(ctxF, tin, vpF, "forw");
  for (let j = 0; j < RT_GRID_N; j++) {
    for (let i = 0; i < RT_GRID_N; i++) {
      const { err } = cells[j][i];
      if (err < 0) continue;
      const [ax, ay] = vpF.c(xs[i], ys[j]);
      const [bx, by] = vpF.c(xs[i + 1], ys[j + 1]);
      ctxF.fillStyle = errorColor(normalizedError(err, maxErr, allBlue));
      ctxF.fillRect(ax, ay, bx - ax, by - ay);
    }
  }
  ctxF.save();
  ctxF.strokeStyle = "rgba(0,0,0,0.08)"; ctxF.lineWidth = 0.5;
  for (let j = 0; j <= RT_GRID_N; j++) {
    const [ax, ay] = vpF.c(xs[0], ys[j]); const [bx, by] = vpF.c(xs[RT_GRID_N], ys[j]);
    ctxF.beginPath(); ctxF.moveTo(ax, ay); ctxF.lineTo(bx, by); ctxF.stroke();
  }
  for (let i = 0; i <= RT_GRID_N; i++) {
    const [ax, ay] = vpF.c(xs[i], ys[0]); const [bx, by] = vpF.c(xs[i], ys[RT_GRID_N]);
    ctxF.beginPath(); ctxF.moveTo(ax, ay); ctxF.lineTo(bx, by); ctxF.stroke();
  }
  ctxF.restore();
  drawEnvelope(ctxF, envF, vpF, "envelope");
  drawLabel(ctxF, "Forw → Bakw → Forw 誤差");
  drawColorScale(ctxF, maxErr, allBlue);

  // ─ Bakw ─
  clearCanvas(ctxB);
  drawTriangles(ctxB, tin, vpB, "bakw");
  for (let j = 0; j < RT_GRID_N; j++) {
    for (let i = 0; i < RT_GRID_N; i++) {
      const { err, bakwPt } = cells[j][i];
      if (err < 0 || !bakwPt) continue;
      const corners = [
        cells[j][i].bakwPt, cells[j][i + 1]?.bakwPt ?? null,
        cells[j + 1]?.[i + 1]?.bakwPt ?? null, cells[j + 1]?.[i]?.bakwPt ?? null,
      ];
      if (corners.some(c => !c)) continue;
      ctxB.fillStyle = errorColor(normalizedError(err, maxErr, allBlue));
      ctxB.beginPath();
      const [x0, y0] = vpB.c(corners[0]![0], corners[0]![1]);
      ctxB.moveTo(x0, y0);
      for (let k = 1; k < 4; k++) {
        const [x, y] = vpB.c(corners[k]![0], corners[k]![1]);
        ctxB.lineTo(x, y);
      }
      ctxB.closePath(); ctxB.fill();
    }
  }
  drawEnvelope(ctxB, envB, vpB);
  drawLabel(ctxB, "対応する Bakw 空間でのセル");
  drawColorScale(ctxB, maxErr, allBlue);

  const thresholdNote = allBlue
    ? `<span style="color:#2471a3">全点 &lt; 0.1px（丸め誤差範囲）</span> &nbsp;|&nbsp; `
    : `<span style="color:#555">≤ 0.1px → 青</span> &nbsp;|&nbsp; `;
  legendEl.innerHTML = `
    ${thresholdNote}
    誤差範囲: <b>0 〜 ${maxErr.toExponential(3)}</b> px &nbsp;|&nbsp;
    平均誤差: <b>${meanErr.toExponential(3)}</b> px &nbsp;|&nbsp;
    有効点数: <b>${validErrs.length}</b> / ${(RT_GRID_N + 1) ** 2}<br>
    ${allBlue
      ? `<span style="background:rgba(0,0,255,0.8);display:inline-block;width:120px;height:12px;vertical-align:middle;border-radius:3px"></span>`
      : `<span style="background:linear-gradient(to right,#0000ff,#ffff00,#ff0000);display:inline-block;width:120px;height:12px;vertical-align:middle;border-radius:3px"></span>
    &nbsp; ≤0.1px → 高誤差`}
    &nbsp;|&nbsp;
    <span style="color:#27ae60">━━</span> envelope
  `;
}

// ─── マップ読み込み ───────────────────────────────────────────────────────────

async function loadState(mapConfig: MapConfig, ver: FormatVer): Promise<LoadedState> {
  const filePath = `./tests/compiled/${mapConfig.key}_${ver}.json`;
  const compiled: Compiled = await fetch(filePath).then(r => {
    if (!r.ok) throw new Error(`${r.status} ${r.url}`);
    return r.json();
  });
  const tin = new Tin();
  tin.setCompiled(compiled);
  return { tin, compiled, mapLabel: mapConfig.label, ver };
}

// ─── Canvas helper ────────────────────────────────────────────────────────────

function getCtx(id: string): CanvasRenderingContext2D {
  const el = document.getElementById(id) as HTMLCanvasElement;
  el.width = CANVAS_SIZE;
  el.height = CANVAS_SIZE;
  return el.getContext("2d")!;
}

// ─── エントリポイント ─────────────────────────────────────────────────────────

async function main() {
  const mapSelect = document.getElementById("map-select") as HTMLSelectElement;
  const verBtns = document.querySelectorAll<HTMLButtonElement>(".ver-btn");
  const vizTabs = document.querySelectorAll<HTMLButtonElement>(".viz-tab");
  const statusEl = document.getElementById("status")!;
  const noteEl = document.getElementById("map-note")!;
  const legendEl = document.getElementById("legend")!;

  // ドロップダウン生成
  MAPS.forEach((m, i) => {
    const opt = document.createElement("option");
    opt.value = String(i);
    opt.textContent = m.label;
    mapSelect.appendChild(opt);
  });

  let currentState: LoadedState | null = null;
  let currentMode: VizMode = "rays";
  let currentVer: FormatVer = "v3";
  let currentMapIdx = 0;

  function render() {
    if (!currentState) return;
    const ctxF = getCtx("canvas-forw");
    const ctxB = getCtx("canvas-bakw");
    if (currentMode === "rays") vizRays(ctxF, ctxB, currentState, legendEl);
    else if (currentMode === "grid") vizGrid(ctxF, ctxB, currentState, legendEl);
    else vizRoundtrip(ctxF, ctxB, currentState, legendEl);
  }

  async function loadAndRender(mapIdx: number, ver: FormatVer) {
    const mapConfig = MAPS[mapIdx];
    statusEl.textContent = `読み込み中: ${mapConfig.label} ${ver} ...`;
    statusEl.style.color = "#e67e22";
    currentState = null;

    try {
      currentState = await loadState(mapConfig, ver);
    } catch (e) {
      statusEl.textContent = `読み込みエラー: ${String(e)}`;
      statusEl.style.color = "#e74c3c";
      return;
    }

    const n = currentState.compiled.vertices_points.length;
    const fmtVer = currentState.compiled.version ?? "<=2.007";
    statusEl.textContent =
      `✓ ${mapConfig.label} [${ver}] — format v${fmtVer}, 境界頂点 ${n} 個, ${currentState.compiled.strict_status ?? "-"}`;
    statusEl.style.color = "#27ae60";

    noteEl.textContent = mapConfig.note ? `ℹ ${mapConfig.note}` : "";

    render();
  }

  // イベント: マップ切り替え
  mapSelect.addEventListener("change", () => {
    currentMapIdx = Number(mapSelect.value);
    void loadAndRender(currentMapIdx, currentVer);
  });

  // イベント: バージョン切り替え
  verBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      verBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentVer = btn.dataset.ver as FormatVer;
      void loadAndRender(currentMapIdx, currentVer);
    });
  });

  // イベント: 可視化モード切り替え
  vizTabs.forEach(btn => {
    btn.addEventListener("click", () => {
      vizTabs.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentMode = btn.dataset.viz as VizMode;
      render();
    });
  });

  // 初期ロード（伏見城 v3）
  void loadAndRender(0, "v3");
}

main();
