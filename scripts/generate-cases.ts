/**
 * テスト用ケースファイルを生成する。
 *
 * 出力先: tests/cases/
 *   {key}_v2.json  (v2 compiled からの forward 変換結果)
 *   {key}_v3.json  (v3 compiled からの forward 変換結果)
 *
 * サンプリング: wh × (0.1, 0.2, ..., 0.9) の 9×9 = 81 点
 *   変換不可の点は除外するため、実際のケース数は 81 以下になる場合がある。
 *
 * Usage:
 *   npx tsx scripts/generate-cases.ts
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Tin } from "../src/index.ts";
import type { Compiled } from "../src/index.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

// NOTE: naramachi_yasui_bunko は strict_error 未修復問題により一時停止中。
// 詳細: openspec/known-issues/naramachi-strict-error.md
const MAPS = [
  "fushimijo_maplat",
  // "naramachi_yasui_bunko",
  "miesan_ginza_map",
  "tatebayashi_castle_akimoto",
  "tatebayashi_kaei_jokamachi",
] as const;

const VERS = ["v2", "v3"] as const;

const outDir = path.join(root, "tests", "cases");
fs.mkdirSync(outDir, { recursive: true });

for (const key of MAPS) {
  console.log(`\n── ${key} ──`);
  for (const ver of VERS) {
    const compiledPath = path.join(root, "tests", "compiled", `${key}_${ver}.json`);
    const compiled: Compiled = JSON.parse(fs.readFileSync(compiledPath, "utf-8"));

    const tin = new Tin();
    tin.setCompiled(compiled);

    const [width, height] = compiled.wh!;
    const cases: [[number, number], [number, number]][] = [];

    for (let xp = 0.1; xp < 1; xp += 0.1) {
      for (let yp = 0.1; yp < 1; yp += 0.1) {
        const x = width * xp;
        const y = height * yp;
        const result = tin.transform([x, y]);
        if (result) {
          cases.push([[x, y], result as [number, number]]);
        }
      }
    }

    const outPath = path.join(outDir, `${key}_${ver}.json`);
    fs.writeFileSync(outPath, JSON.stringify(cases, null, 2));
    console.log(`  ✓ ${outPath} (${cases.length} cases, strict_status: ${compiled.strict_status ?? "-"})`);
  }
}

console.log("\n✅ 完了");
