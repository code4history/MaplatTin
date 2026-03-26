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

const MAPS = [
  "fushimijo_maplat",
  "naramachi_yasui_bunko",
  "naramachi_yasui_revised",
  "miesan_ginza_map",
  "tatebayashi_castle_akimoto",
  "tatebayashi_kaei_jokamachi",
  "1932_nobeoka",
  "1932_nobeoka_sub0",
] as const;

const VERS = ["v2", "v3"] as const;

const outDir = path.join(root, "tests", "cases");
fs.mkdirSync(outDir, { recursive: true });

/** サンプリング用の [width, height] を返す。
 *  wh がない場合（V3 サブマップ）は bounds ポリゴンの bbox から計算。 */
function samplingWH(compiled: Compiled): [number, number] {
  if (compiled.wh) return compiled.wh as [number, number];
  if (compiled.bounds && (compiled.bounds as number[][]).length > 0) {
    const pts = compiled.bounds as number[][];
    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);
    return [Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)];
  }
  throw new Error(`Cannot determine sampling range for ${JSON.stringify(compiled).slice(0, 80)}`);
}

/** サンプリング用の原点オフセット [x0, y0] を返す。 */
function samplingOrigin(compiled: Compiled): [number, number] {
  if (compiled.xy) return compiled.xy as [number, number];
  if (compiled.bounds && (compiled.bounds as number[][]).length > 0) {
    const pts = compiled.bounds as number[][];
    return [Math.min(...pts.map((p) => p[0])), Math.min(...pts.map((p) => p[1]))];
  }
  return [0, 0];
}

for (const key of MAPS) {
  console.log(`\n── ${key} ──`);
  for (const ver of VERS) {
    const compiledPath = path.join(root, "tests", "compiled", `${key}_${ver}.json`);
    const compiled: Compiled = JSON.parse(fs.readFileSync(compiledPath, "utf-8"));

    const tin = new Tin();
    tin.setCompiled(compiled);

    const [width, height] = samplingWH(compiled);
    const [x0, y0] = samplingOrigin(compiled);
    const cases: [[number, number], [number, number]][] = [];

    for (let xp = 0.1; xp < 1; xp += 0.1) {
      for (let yp = 0.1; yp < 1; yp += 0.1) {
        const x = x0 + width * xp;
        const y = y0 + height * yp;
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
