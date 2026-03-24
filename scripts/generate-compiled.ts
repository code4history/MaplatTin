/**
 * v2 / v3 両フォーマットの compiled ファイルを生成する。
 *
 * 出力先: tests/compiled/
 *   fushimijo_maplat_v2.json         (v2 アルゴリズム: wh bbox, turf centroid, 4 頂点)
 *   fushimijo_maplat_v3.json         (v3 アルゴリズム: GCP bbox, 三角形重心, N 頂点)
 *   miesan_ginza_map_v2.json         (pre-compiled → compiled フィールドをそのまま利用)
 *   miesan_ginza_map_v3.json         (compiled.points から v3 アルゴリズムで再コンパイル)
 *   iwaki_taira_genna2_v2.json       (pre-compiled → compiled フィールドをそのまま利用)
 *   iwaki_taira_genna2_v3.json       (compiled.points から v3 アルゴリズムで再コンパイル)
 *   himeji_fukkou_v2.json            (pre-compiled → compiled フィールドをそのまま利用)
 *   himeji_fukkou_v3.json            (compiled.points から v3 アルゴリズムで再コンパイル)
 *
 * Usage:
 *   npx tsx scripts/generate-compiled.ts
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Tin, type Options } from "../src/index.ts";
import type { Compiled } from "../src/index.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const outDir = path.join(root, "tests", "compiled");
fs.mkdirSync(outDir, { recursive: true });

interface MapDef {
  key: string;
  mapFile: string;
}

const MAPS: MapDef[] = [
  { key: "fushimijo_maplat",       mapFile: "tests/maps/fushimijo_maplat.json" },
  { key: "naramachi_yasui_bunko",  mapFile: "tests/maps/naramachi_yasui_bunko.json" },
  { key: "miesan_ginza_map",            mapFile: "tests/maps/miesan_ginza_map.json" },
  { key: "tatebayashi_castle_akimoto",  mapFile: "tests/maps/tatebayashi_castle_akimoto.json" },
  { key: "tatebayashi_kaei_jokamachi",  mapFile: "tests/maps/tatebayashi_kaei_jokamachi.json" },
];

async function buildFromGCPs(data: Record<string, unknown>, useV2: boolean): Promise<Compiled> {
  const tin = new Tin({
    wh: [data.width, data.height] as [number, number],
    strictMode: data.strictMode as Options["strictMode"],
    vertexMode: data.vertexMode as Options["vertexMode"],
    stateFull: false,
    useV2Algorithm: useV2,
  });
  tin.setPoints(data.gcps as Parameters<Tin["setPoints"]>[0]);
  if (data.edges) tin.setEdges(data.edges as Parameters<Tin["setEdges"]>[0]);
  await tin.updateTinAsync();
  return tin.getCompiled();
}

for (const { key, mapFile } of MAPS) {
  console.log(`\n── ${key} ──`);
  const data: Record<string, unknown> = JSON.parse(
    fs.readFileSync(path.join(root, mapFile), "utf-8")
  );

  let compiledV2: Compiled;
  let compiledV3: Compiled;

  if (data.gcps && Array.isArray(data.gcps) && (data.gcps as unknown[]).length > 0) {
    // GCP あり → 両バージョンを build
    console.log(`  Building v2 ...`);
    compiledV2 = await buildFromGCPs(data, true);
    console.log(`    vertices: ${compiledV2.vertices_points.length}, version: ${compiledV2.version}`);

    console.log(`  Building v3 ...`);
    compiledV3 = await buildFromGCPs(data, false);
    console.log(`    vertices: ${compiledV3.vertices_points.length}, version: ${compiledV3.version}`);
  } else if (data.compiled) {
    // pre-compiled のみ → compiled.points から v2/v3 それぞれ再コンパイル
    const precompiled = data.compiled as Compiled;
    // 旧フォーマットは wh/strictMode/vertexMode がトップレベルにある場合がある
    const wh = (precompiled.wh ?? (data.width ? [data.width as number, data.height as number] : undefined)) as [number, number];
    const strictMode = (precompiled.strictMode ?? data.strictMode) as Options["strictMode"];
    const vertexMode = (precompiled.vertexMode ?? data.vertexMode) as Options["vertexMode"];

    const makePreTin = (useV2: boolean) => {
      const t = new Tin({ useV2Algorithm: useV2, wh, strictMode, vertexMode, stateFull: false });
      t.setPoints(precompiled.points as Parameters<Tin["setPoints"]>[0]);
      if (precompiled.edges && precompiled.edges.length > 0) {
        t.setEdges(precompiled.edges as Parameters<Tin["setEdges"]>[0]);
      }
      return t;
    };

    console.log(`  v2: compiled.points から再コンパイル中...`);
    const tinV2 = makePreTin(true);
    await tinV2.updateTinAsync();
    compiledV2 = tinV2.getCompiled();
    console.log(`    vertices: ${compiledV2.vertices_points.length}, version: ${compiledV2.version}`);

    console.log(`  v3: compiled.points から再コンパイル中...`);
    const tinV3 = makePreTin(false);
    await tinV3.updateTinAsync();
    compiledV3 = tinV3.getCompiled();
    console.log(`    vertices: ${compiledV3.vertices_points.length}, version: ${compiledV3.version}`);
  } else {
    console.warn(`  スキップ: GCP も compiled もなし`);
    continue;
  }

  const outV2 = path.join(outDir, `${key}_v2.json`);
  const outV3 = path.join(outDir, `${key}_v3.json`);
  fs.writeFileSync(outV2, JSON.stringify(compiledV2, null, 2));
  fs.writeFileSync(outV3, JSON.stringify(compiledV3, null, 2));
  console.log(`  ✓ ${outV2}`);
  console.log(`  ✓ ${outV3}`);
}

console.log("\n✅ 完了");
