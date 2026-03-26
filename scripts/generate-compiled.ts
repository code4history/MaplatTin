/**
 * v2 / v3 両フォーマットの compiled ファイルを生成する。
 *
 * 出力先: tests/compiled/
 *   fushimijo_maplat_v2.json         (v2 アルゴリズム: wh bbox, turf centroid, 4 頂点)
 *   fushimijo_maplat_v3.json         (v3 アルゴリズム: GCP bbox, 三角形重心, N 頂点)
 *   miesan_ginza_map_v2.json         (pre-compiled → compiled フィールドをそのまま利用)
 *   miesan_ginza_map_v3.json         (compiled.points から v3 アルゴリズムで再コンパイル)
 *   1932_nobeoka_v2.json             (pre-compiled → compiled フィールドをそのまま利用)
 *   1932_nobeoka_v3.json             (compiled.points から v3 アルゴリズムで再コンパイル)
 *   1932_nobeoka_sub0_v2.json        (サブマップ: bounds + compiled.points → v2)
 *   1932_nobeoka_sub0_v3.json        (サブマップ: bounds + compiled.points → v3)
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
  /** sub_maps 配列のインデックス。指定時はサブマップデータを使用 */
  subMapIndex?: number;
}

const MAPS: MapDef[] = [
  { key: "fushimijo_maplat",            mapFile: "tests/maps/fushimijo_maplat.json" },
  { key: "naramachi_yasui_bunko",       mapFile: "tests/maps/naramachi_yasui_bunko.json" },
  { key: "naramachi_yasui_revised",     mapFile: "tests/maps/naramachi_yasui_revised.json" },
  { key: "miesan_ginza_map",            mapFile: "tests/maps/miesan_ginza_map.json" },
  { key: "tatebayashi_castle_akimoto",  mapFile: "tests/maps/tatebayashi_castle_akimoto.json" },
  { key: "tatebayashi_kaei_jokamachi",  mapFile: "tests/maps/tatebayashi_kaei_jokamachi.json" },
  { key: "1932_nobeoka",                mapFile: "tests/maps/1932_nobeoka.json" },
  { key: "1932_nobeoka_sub0",           mapFile: "tests/maps/1932_nobeoka.json", subMapIndex: 0 },
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

async function buildFromPrecompiled(
  precompiled: Compiled,
  useV2: boolean,
): Promise<Compiled> {
  const wh = precompiled.wh as [number, number] | undefined;
  const strictMode = precompiled.strictMode as Options["strictMode"];
  const vertexMode = precompiled.vertexMode as Options["vertexMode"];
  const t = new Tin({ useV2Algorithm: useV2, wh, strictMode, vertexMode, stateFull: false });
  t.setPoints(precompiled.points as Parameters<Tin["setPoints"]>[0]);
  if (precompiled.edges && precompiled.edges.length > 0) {
    t.setEdges(precompiled.edges as Parameters<Tin["setEdges"]>[0]);
  }
  await t.updateTinAsync();
  return t.getCompiled();
}

async function buildFromSubmap(
  precompiled: Compiled,
  useV2: boolean,
): Promise<Compiled> {
  const strictMode = precompiled.strictMode as Options["strictMode"];
  const vertexMode = precompiled.vertexMode as Options["vertexMode"];
  const t = new Tin({
    bounds: precompiled.bounds as [number, number][],
    strictMode,
    vertexMode,
    stateFull: false,
    useV2Algorithm: useV2,
  });
  t.setPoints(precompiled.points as Parameters<Tin["setPoints"]>[0]);
  if (precompiled.edges && precompiled.edges.length > 0) {
    t.setEdges(precompiled.edges as Parameters<Tin["setEdges"]>[0]);
  }
  await t.updateTinAsync();
  return t.getCompiled();
}

for (const mapDef of MAPS) {
  const { key, mapFile, subMapIndex } = mapDef;
  console.log(`\n── ${key} ──`);
  const data: Record<string, unknown> = JSON.parse(
    fs.readFileSync(path.join(root, mapFile), "utf-8")
  );

  let compiledV2: Compiled;
  let compiledV3: Compiled;

  if (typeof subMapIndex === "number") {
    // ── サブマップ ──────────────────────────────────────────────────────────────
    const submaps = data.sub_maps as Record<string, unknown>[];
    const precompiled = submaps[subMapIndex].compiled as Compiled;

    console.log(`  v2: サブマップ(index=${subMapIndex}) を bounds + V2 アルゴリズムで再コンパイル中...`);
    compiledV2 = await buildFromSubmap(precompiled, true);
    console.log(`    vertices: ${compiledV2.vertices_points.length}, status: ${compiledV2.strict_status}`);

    console.log(`  v3: サブマップ(index=${subMapIndex}) を bounds + V3 アルゴリズムで再コンパイル中...`);
    compiledV3 = await buildFromSubmap(precompiled, false);
    console.log(`    vertices: ${compiledV3.vertices_points.length}, status: ${compiledV3.strict_status}`);

  } else if (data.gcps && Array.isArray(data.gcps) && (data.gcps as unknown[]).length > 0) {
    // ── GCP あり → 両バージョンを build ──────────────────────────────────────
    console.log(`  Building v2 ...`);
    compiledV2 = await buildFromGCPs(data, true);
    console.log(`    vertices: ${compiledV2.vertices_points.length}, version: ${compiledV2.version}`);

    console.log(`  Building v3 ...`);
    compiledV3 = await buildFromGCPs(data, false);
    console.log(`    vertices: ${compiledV3.vertices_points.length}, version: ${compiledV3.version}`);

  } else if (data.compiled) {
    // ── pre-compiled のみ → compiled.points から v2/v3 それぞれ再コンパイル ──
    const precompiled = data.compiled as Compiled;

    console.log(`  v2: compiled.points から再コンパイル中...`);
    compiledV2 = await buildFromPrecompiled(precompiled, true);
    console.log(`    vertices: ${compiledV2.vertices_points.length}, version: ${compiledV2.version}`);

    console.log(`  v3: compiled.points から再コンパイル中...`);
    compiledV3 = await buildFromPrecompiled(precompiled, false);
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
