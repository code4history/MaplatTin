/**
 * miesan_ginza_map_v3.json を v2 compiled の GCP から再コンパイルして生成する。
 *
 * 手順:
 *   1. tests/compiled/miesan_ginza_map_v2.json から GCP (points) と edges を取得
 *   2. new Tin({ useV2Algorithm: false }) で v3 アルゴリズムで再コンパイル
 *   3. tests/compiled/miesan_ginza_map_v3.json に書き出す
 *
 * Usage:
 *   npx tsx scripts/recompile-miesan-v3.ts
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Tin } from "../src/index.ts";
import type { Compiled } from "../src/index.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const v2Path = path.join(root, "tests", "compiled", "miesan_ginza_map_v2.json");
const v3Path = path.join(root, "tests", "compiled", "miesan_ginza_map_v3.json");

console.log(`読み込み: ${v2Path}`);
const v2compiled: Compiled = JSON.parse(fs.readFileSync(v2Path, "utf-8"));

console.log(`v2 情報:`);
console.log(`  version: ${v2compiled.version}`);
console.log(`  wh: ${JSON.stringify(v2compiled.wh)}`);
console.log(`  vertexMode: ${v2compiled.vertexMode}`);
console.log(`  strictMode: ${v2compiled.strictMode}`);
console.log(`  strict_status: ${v2compiled.strict_status}`);
console.log(`  GCP 数 (points): ${v2compiled.points.length}`);
console.log(`  edges 数: ${v2compiled.edges?.length ?? 0}`);
console.log(`  vertices_points 数: ${v2compiled.vertices_points.length}`);

// v2 compiled の GCP / edges / wh から v3 で再コンパイル
const tin = new Tin({
  useV2Algorithm: false,
  wh: v2compiled.wh as [number, number],
  strictMode: v2compiled.strictMode as "strict" | "auto" | "loose",
  vertexMode: v2compiled.vertexMode as "plain" | "birdeye",
  stateFull: false,
});

// compiled.points は [[x,y],[lng,lat]][] = setPoints の入力形式と同じ
tin.setPoints(v2compiled.points as Parameters<Tin["setPoints"]>[0]);

if (v2compiled.edges && v2compiled.edges.length > 0) {
  tin.setEdges(v2compiled.edges as Parameters<Tin["setEdges"]>[0]);
}

console.log(`\nv3 でコンパイル中...`);
tin.updateTin();

const v3compiled = tin.getCompiled() as Compiled;

console.log(`\nv3 情報:`);
console.log(`  version: ${v3compiled.version}`);
console.log(`  vertices_points 数: ${v3compiled.vertices_points.length}`);
console.log(`  strict_status: ${v3compiled.strict_status}`);

fs.writeFileSync(v3Path, JSON.stringify(v3compiled, null, 2));
console.log(`\n✅ 書き出し完了: ${v3Path}`);
