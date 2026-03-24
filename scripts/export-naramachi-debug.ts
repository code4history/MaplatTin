/**
 * naramachi_yasui_bunko の TIN をビルドし、可視化用データを JSON として出力する。
 *
 * 出力先: dist-demo/naramachi-debug-data.json
 *
 * 含むデータ（コンパクト形式）:
 *   - forw / bakw TIN 全三角形の座標（[x0,y0,x1,y1,x2,y2] 形式）
 *   - forw kink 交差点座標
 *   - forw degenerate 三角形インデックス
 *   - bakw degenerate 三角形インデックス
 *   - bakw degenerate 隣接三角形インデックス
 *
 * Usage:
 *   npx tsx scripts/export-naramachi-debug.ts
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Tin } from "../src/index.ts";
import type { Options } from "../src/index.ts";
import type { Tri } from "@maplat/transform";
import type { Position } from "geojson";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const mapPath = path.join(root, "tests", "maps", "_suspended", "naramachi_yasui_bunko.json");
const data: Record<string, unknown> = JSON.parse(fs.readFileSync(mapPath, "utf-8"));

const wh = [data.width, data.height] as [number, number];
const strictMode = data.strictMode as Options["strictMode"];
const vertexMode = data.vertexMode as Options["vertexMode"];

function isDegenerate(coords: Position[], epsilon = 1e-6): boolean {
  const [ax, ay] = coords[0];
  const [bx, by] = coords[1];
  const [cx, cy] = coords[2];
  const doubleArea = Math.abs((bx - ax) * (cy - ay) - (cx - ax) * (by - ay));
  return doubleArea < epsilon;
}

function degenerateInfo(coords: Position[]): { doubleArea: number } {
  const [ax, ay] = coords[0];
  const [bx, by] = coords[1];
  const [cx, cy] = coords[2];
  const doubleArea = Math.abs((bx - ax) * (cy - ay) - (cx - ax) * (by - ay));
  return { doubleArea };
}

console.log("Building v2 TIN...");
const tin = new Tin({ useV2Algorithm: true, wh, strictMode, vertexMode, stateFull: false });
tin.setPoints(data.gcps as Parameters<Tin["setPoints"]>[0]);
if (data.edges) tin.setEdges(data.edges as Parameters<Tin["setEdges"]>[0]);
await tin.updateTinAsync();

const tinAny = tin as any;
const compiled = tin.getCompiled() as any;
const kinks = tinAny.kinks;
const tins = tinAny.tins;

// --- 三角形座標をコンパクト形式に変換 ---
type FlatTri = [number, number, number, number, number, number];
function toFlat(tri: Tri): FlatTri {
  const c = tri.geometry!.coordinates[0];
  return [c[0][0], c[0][1], c[1][0], c[1][1], c[2][0], c[2][1]];
}

const forwFlat: FlatTri[] = tins.forw.features.map((t: Tri) => toFlat(t));
const bakwFlat: FlatTri[] = tins.bakw.features.map((t: Tri) => toFlat(t));

// --- forw degenerate ---
const forwDegIdx: number[] = [];
for (let i = 0; i < forwFlat.length; i++) {
  const [x0,y0,x1,y1,x2,y2] = forwFlat[i];
  const da = Math.abs((x1-x0)*(y2-y0) - (x2-x0)*(y1-y0));
  if (da < 1e-6) forwDegIdx.push(i);
}

// --- bakw degenerate ---
const bakwDegIdx: number[] = [];
for (let i = 0; i < bakwFlat.length; i++) {
  const [x0,y0,x1,y1,x2,y2] = bakwFlat[i];
  const da = Math.abs((x1-x0)*(y2-y0) - (x2-x0)*(y1-y0));
  if (da < 1e-6) bakwDegIdx.push(i);
}

// --- bakw degenerate 隣接 ---
// 縮退三角形の頂点座標から隣接を判定（座標共有で判定、index共有より確実）
function coordKey(x: number, y: number): string {
  return `${x.toFixed(6)},${y.toFixed(6)}`;
}

// bakw三角形ごとに頂点座標セットを作成
const bakwVertexSets: Set<string>[] = bakwFlat.map(([x0,y0,x1,y1,x2,y2]) =>
  new Set([coordKey(x0,y0), coordKey(x1,y1), coordKey(x2,y2)])
);

const bakwDegSet = new Set(bakwDegIdx);
const bakwDegNeighborIdx = new Set<number>();
for (const di of bakwDegIdx) {
  const degVerts = bakwVertexSets[di];
  for (let i = 0; i < bakwFlat.length; i++) {
    if (bakwDegSet.has(i)) continue;
    let shared = 0;
    for (const v of bakwVertexSets[i]) {
      if (degVerts.has(v)) shared++;
    }
    if (shared >= 2) bakwDegNeighborIdx.add(i);
  }
}

// --- forw kink 交差点 ---
const forwKinkPoints: [number, number][] = kinks?.forw?.features?.map(
  (f: any) => f.geometry.coordinates as [number, number]
) ?? [];

// kink点を含む三角形インデックス（直接含む + 頂点が近い）
function pointInTri(px: number, py: number, flat: FlatTri): boolean {
  const [ax, ay, bx, by, cx, cy] = flat;
  const v0x = cx-ax, v0y = cy-ay, v1x = bx-ax, v1y = by-ay;
  const v2x = px-ax, v2y = py-ay;
  const dot00 = v0x*v0x+v0y*v0y, dot01 = v0x*v1x+v0y*v1y;
  const dot02 = v0x*v2x+v0y*v2y, dot11 = v1x*v1x+v1y*v1y, dot12 = v1x*v2x+v1y*v2y;
  const denom = dot00*dot11 - dot01*dot01;
  if (denom === 0) return false;
  const u = (dot11*dot02 - dot01*dot12) / denom;
  const v = (dot00*dot12 - dot01*dot02) / denom;
  return u >= -1e-6 && v >= -1e-6 && u+v <= 1+1e-6;
}

const forwKinkRelatedIdx = new Set<number>();
for (const [kx, ky] of forwKinkPoints) {
  for (let i = 0; i < forwFlat.length; i++) {
    if (pointInTri(kx, ky, forwFlat[i])) {
      forwKinkRelatedIdx.add(i);
    }
  }
  // kink点の近傍三角形（頂点が kink 近傍）
  const R = 5000; // 5km in web mercator
  for (let i = 0; i < forwFlat.length; i++) {
    const [x0,y0,x1,y1,x2,y2] = forwFlat[i];
    for (const [vx,vy] of [[x0,y0],[x1,y1],[x2,y2]] as [number,number][]) {
      const dx = vx-kx, dy = vy-ky;
      if (dx*dx+dy*dy < R*R) { forwKinkRelatedIdx.add(i); break; }
    }
  }
}

console.log(`  forwKinkPoints: ${forwKinkPoints.length}`);
console.log(`  forwDegIdx: ${forwDegIdx.length}`);
console.log(`  forwKinkRelated: ${forwKinkRelatedIdx.size}`);
console.log(`  bakwDegIdx: ${bakwDegIdx.length}`);
console.log(`  bakwDegNeighborIdx: ${bakwDegNeighborIdx.size}`);

// forw/bakw 全三角形の bounding box（オーバービュー用）
function computeBbox(tris: FlatTri[]): [number,number,number,number] {
  let minX=Infinity, minY=Infinity, maxX=-Infinity, maxY=-Infinity;
  for (const [x0,y0,x1,y1,x2,y2] of tris) {
    minX=Math.min(minX,x0,x1,x2); minY=Math.min(minY,y0,y1,y2);
    maxX=Math.max(maxX,x0,x1,x2); maxY=Math.max(maxY,y0,y1,y2);
  }
  return [minX,minY,maxX,maxY];
}

const result = {
  strictStatus: compiled.strict_status as string,
  wh: wh as [number,number],
  // 全三角形（平坦配列: [x0,y0,x1,y1,x2,y2][]）
  forw: forwFlat,
  bakw: bakwFlat,
  // bbox
  forwBbox: computeBbox(forwFlat),
  bakwBbox: computeBbox(bakwFlat),
  // kinks
  forwKinkPoints,
  // 問題のある三角形インデックス
  forwDegIdx,
  forwKinkRelatedIdx: [...forwKinkRelatedIdx],
  bakwDegIdx,
  bakwDegNeighborIdx: [...bakwDegNeighborIdx],
};

const outDir = path.join(root, "dist-demo");
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, "naramachi-debug-data.json");
fs.writeFileSync(outPath, JSON.stringify(result));
const size = fs.statSync(outPath).size;
console.log(`\n✅ 書き出し完了: ${outPath}`);
console.log(`   ファイルサイズ: ${(size/1024).toFixed(1)} KB`);
