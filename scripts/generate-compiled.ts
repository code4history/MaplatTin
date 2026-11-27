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
 *   node scripts/generate-compiled.ts [--v3-only] [key ...]
 *   （Node 24 以降。それ以前は npx tsx scripts/generate-compiled.ts ...）
 *
 *   --v3-only  v3 の compiled だけを書く（v2 は既存のまま）。v3 の出力だけが変わる変更の
 *              期待値を作り直すときに使う（v2 の出力が変わっていないことの確認にもなる）。
 *   key        作り直す地図の key（例: tatebayashi_castle_akimoto）。省略時は全部。
 *
 * 作り方は tests/tin.test.ts の BUILD_DATASETS と同じ読み込み方（GCP・wh・strictMode・vertexMode は
 * 地図ファイルの値、無ければ v2 の compiled の値）にそろえてある。
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Tin, type Options } from "../src/index.ts";
import type { Compiled } from "../src/index.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const args = process.argv.slice(2);
const v3Only = args.includes("--v3-only");
const onlyKeys = args.filter((arg) => !arg.startsWith("--"));

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
  data: Record<string, unknown>,
): Promise<Compiled> {
  // 館林のように、地図ファイルの compiled に wh・strictMode・vertexMode が無く、
  // 地図ファイルの直下（width・height・strictMode・vertexMode）にある地図がある。
  // wh を落とすと既定の 100×100 になり、v2 は「SOME POINTS OUTSIDE」で止まる。
  const wh = (precompiled.wh ??
    (data.width !== undefined && data.height !== undefined
      ? [data.width, data.height]
      : undefined)) as [number, number] | undefined;
  const strictMode = (precompiled.strictMode ?? data.strictMode) as Options["strictMode"];
  const vertexMode = (precompiled.vertexMode ?? data.vertexMode) as Options["vertexMode"];
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
  if (onlyKeys.length > 0 && !onlyKeys.includes(key)) continue;
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
    compiledV2 = await buildFromPrecompiled(precompiled, true, data);
    console.log(`    vertices: ${compiledV2.vertices_points.length}, version: ${compiledV2.version}`);

    console.log(`  v3: compiled.points から再コンパイル中...`);
    compiledV3 = await buildFromPrecompiled(precompiled, false, data);
    console.log(`    vertices: ${compiledV3.vertices_points.length}, version: ${compiledV3.version}`);

  } else {
    console.warn(`  スキップ: GCP も compiled もなし`);
    continue;
  }

  const outV2 = path.join(outDir, `${key}_v2.json`);
  const outV3 = path.join(outDir, `${key}_v3.json`);
  if (!v3Only) {
    fs.writeFileSync(outV2, JSON.stringify(compiledV2, null, 2));
    console.log(`  ✓ ${outV2}`);
  }
  fs.writeFileSync(outV3, JSON.stringify(compiledV3, null, 2));
  console.log(`  ✓ ${outV3}`);
}

console.log("\n✅ 完了");
