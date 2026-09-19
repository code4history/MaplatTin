// m12 t2b: Tin の出力フィクスチャ（tests/compiled/*_v2.json / *_v3.json）の
// weight_buffer を {} に、version を 2.00703→2.00704 / 3→3.00001 に機械置換する。
// 原則: LLM の手編集で JSON を書き換えない。このスクリプトで書く（t2 設計 §5.1）。
//
// 使い方:
//   node scripts/m12-strip-weight-buffer.mjs --self-test   # 置換ガードの自己検査（書かない）
//   node scripts/m12-strip-weight-buffer.mjs               # 本実行（16 件を上書き）
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const EXPECT_COUNT = 16;

function loadTargets() {
  const dir = path.join(root, "tests", "compiled");
  const names = fs
    .readdirSync(dir)
    .filter((n) => /_(v2|v3)\.json$/.test(n))
    .sort();
  if (names.length !== EXPECT_COUNT) {
    throw new Error(
      `対象件数が想定と異なる: ${names.length}（期待 ${EXPECT_COUNT}）`,
    );
  }
  return names.map((n) => path.join(dir, n));
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

/** 対象外キー（version / weight_buffer 以外）が置換前後で JSON.stringify 等価か確認する */
function assertOnlyVersionAndWeightChanged(file, before, after) {
  const strip = (o) =>
    JSON.stringify(
      Object.fromEntries(
        Object.entries(o).filter(([k]) => k !== "version" && k !== "weight_buffer"),
      ),
    );
  if (strip(before) !== strip(after)) {
    throw new Error(`${file}: version・weight_buffer 以外のキーが変わった`);
  }
}

/** 単一ファイルの置換を（書き込みなしに）計算して返す */
function stripOne(file, json) {
  const version = json.version;
  if (version === 2.00703) {
    json = { ...json, version: 2.00704 };
  } else if (version === 3) {
    json = { ...json, version: 3.00001 };
  } else {
    throw new Error(`${file}: 想定外の version ${JSON.stringify(version)}`);
  }
  if (!Object.prototype.hasOwnProperty.call(json, "weight_buffer")) {
    throw new Error(`${file}: weight_buffer キーが無い`);
  }
  json = { ...json, weight_buffer: {} };
  return json;
}

function runSelfTest() {
  const files = loadTargets();
  for (const file of files) {
    const orig = readJson(file);
    // 1 回目の置換（メモリ上）
    const stripped = stripOne(file, orig);
    assertOnlyVersionAndWeightChanged(file, orig, stripped);
    // 2 回目の再適用は「想定外の version」で失敗すること（冪等ガード）
    let versionGuardHit = false;
    try {
      stripOne(file, stripped);
    } catch (e) {
      if (String(e.message).includes("想定外の version")) versionGuardHit = true;
      else throw e;
    }
    if (!versionGuardHit) {
      throw new Error(`${file}: 再適用しても「想定外の version」で失敗しなかった（ガード無効）`);
    }
    // weight_buffer キー欠落ガード（version は置換前の値のまま、
    // weight_buffer キーだけを削除した複製で確かめる）
    let missingGuardHit = false;
    try {
      const noWb = Object.fromEntries(
        Object.entries(orig).filter(([k]) => k !== "weight_buffer"),
      );
      stripOne(file, noWb);
    } catch (e) {
      if (String(e.message).includes("weight_buffer キーが無い")) missingGuardHit = true;
      else throw e;
    }
    if (!missingGuardHit) {
      throw new Error(`${file}: weight_buffer 欠落でも失敗しなかった（ガード無効）`);
    }
  }
  console.log(`--self-test: OK（${files.length} 件。再適用は「想定外の version」、キー欠落は「weight_buffer キーが無い」で各 exit 1 相当）`);
}

function run() {
  const files = loadTargets();
  for (const file of files) {
    const text = fs.readFileSync(file, "utf-8");
    const trailingNewline = text.endsWith("\n");
    const orig = JSON.parse(text);
    const next = stripOne(file, orig);
    assertOnlyVersionAndWeightChanged(file, orig, next);
    const out = JSON.stringify(next, null, 2) + (trailingNewline ? "\n" : "");
    fs.writeFileSync(file, out);
    console.log("stripped", path.relative(root, file), "version", next.version);
  }
  console.log(`完了（${files.length} 件）`);
}

if (process.argv.includes("--self-test")) {
  runSelfTest();
} else {
  run();
}