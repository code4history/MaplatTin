/**
 * miesan_ginza_map_v2.json と miesan_ginza_map_v3.json を
 * v2 compiled の GCP から現在の実装で再コンパイルして生成する。
 *
 * - v2: useV2Algorithm: true  → 4 頂点
 * - v3: useV2Algorithm: false → 16+ 頂点
 *
 * 既存の v2 compiled から GCP (points) と edges を取得する。
 * 注意: 元の miesan_ginza_map_v2.json (Maplat 旧ツール製) を
 *       現行実装で再生成したものに置き換えるため、
 *       テスト比較が現行コードと一致するようになる。
 *
 * Usage:
 *   npx tsx scripts/recompile-miesan.ts
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Tin } from "../src/index.ts";
import type { Compiled } from "../src/index.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const compiledDir = path.join(root, "tests", "compiled");
// GCP ソース: 元の v2 compiled ファイル（GCP 情報は共通）
const sourcePath = path.join(compiledDir, "miesan_ginza_map_v2.json");

console.log(`GCP ソース: ${sourcePath}`);
const source: Compiled = JSON.parse(fs.readFileSync(sourcePath, "utf-8"));

console.log(`元ファイル情報:`);
console.log(`  version: ${source.version}`);
console.log(`  wh: ${JSON.stringify(source.wh)}`);
console.log(`  vertexMode: ${source.vertexMode}`);
console.log(`  strictMode: ${source.strictMode}`);
console.log(`  GCP 数 (points): ${source.points.length}`);
console.log(`  edges 数: ${source.edges?.length ?? 0}`);

const baseOptions = {
  wh: source.wh as [number, number],
  strictMode: source.strictMode as "strict" | "auto" | "loose",
  vertexMode: source.vertexMode as "plain" | "birdeye",
  stateFull: false as const,
};

for (const useV2 of [true, false] as const) {
  const ver = useV2 ? "v2" : "v3";
  const outPath = path.join(compiledDir, `miesan_ginza_map_${ver}.json`);

  console.log(`\n── ${ver} (useV2Algorithm: ${useV2}) ──`);

  const tin = new Tin({ ...baseOptions, useV2Algorithm: useV2 });
  tin.setPoints(source.points as Parameters<Tin["setPoints"]>[0]);
  if (source.edges && source.edges.length > 0) {
    tin.setEdges(source.edges as Parameters<Tin["setEdges"]>[0]);
  }

  tin.updateTin();
  const compiled = tin.getCompiled() as Compiled;

  console.log(`  version: ${compiled.version}`);
  console.log(`  vertices_points 数: ${compiled.vertices_points.length}`);
  console.log(`  strict_status: ${compiled.strict_status}`);

  fs.writeFileSync(outPath, JSON.stringify(compiled, null, 2));
  console.log(`  ✅ 書き出し: ${outPath}`);
}

console.log("\n✅ 完了");
