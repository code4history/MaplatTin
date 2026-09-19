// m12 t1b/t2b 共通: tests/cases/*.json の出力（bakw）を、対応する compiled を読み込んだ
// Transform で再計算する。forw は据え置き（入力側の差分 0）。合格は旧結果一致ではなく、
// 「純アフィン参照と相対 1e-12 以内」「逆変換が forw と各成分 0.005 未満」で判定する。
// （t1 設計 §6.1 と同一内容。t2 は --only で *_v2.json / *_v3.json に絞って使う）
//
// 使い方:
//   node scripts/m12-regenerate-cases.mjs --lib <maplat_transform.js> --tests tests [--only '*_v2.json,*_v3.json']   # 検査のみ
//   node scripts/m12-regenerate-cases.mjs --lib <maplat_transform.js> --tests tests [--only ...] --write              # 書き出し
//   node scripts/m12-regenerate-cases.mjs --lib <maplat_transform.js> --tests tests [--only ...] --self-test          # 自己検査
import fs from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  const args = { lib: null, tests: null, write: false, selfTest: false, only: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--lib") args.lib = argv[++i];
    else if (a === "--tests") args.tests = argv[++i];
    else if (a === "--write") args.write = true;
    else if (a === "--self-test") args.selfTest = true;
    else if (a === "--only") args.only = argv[++i];
    else throw new Error(`未知の引数: ${a}`);
  }
  if (!args.lib) throw new Error("--lib を指定してください");
  if (!args.tests) throw new Error("--tests を指定してください");
  return args;
}

function globToRegExp(glob) {
  const src = glob
    .split("")
    .map((ch) => (ch === "*" ? ".*" : ch === "?" ? "." : ch.replace(/[.+^${}()|[\]\\]/g, "\\$&")))
    .join("");
  return new RegExp(`^${src}$`);
}

function listCaseFiles(testsDir, only) {
  const casesDir = path.join(testsDir, "cases");
  let names = fs.readdirSync(casesDir).filter((n) => n.endsWith(".json")).sort();
  if (only) {
    const res = only.split(",").map((s) => globToRegExp(s.trim()));
    names = names.filter((n) => res.some((re) => re.test(n)));
  }
  return names.map((n) => ({
    name: n,
    casePath: path.join(casesDir, n),
    compiledPath: path.join(testsDir, "compiled", n),
  }));
}

// 独立アフィン参照（Cramer 式）。tri.geometry.coordinates[0] が始点側、
// tri.properties[k].geom が目標側。@maplat/transform の geometry.ts の式は写さない。
function affineRef(tri, p) {
  const s = tri.geometry.coordinates[0];
  const g = ["a", "b", "c"].map((k) => tri.properties[k].geom);
  const d =
    (s[1][0] - s[0][0]) * (s[2][1] - s[0][1]) -
    (s[2][0] - s[0][0]) * (s[1][1] - s[0][1]);
  const u =
    ((p[0] - s[0][0]) * (s[2][1] - s[0][1]) -
      (s[2][0] - s[0][0]) * (p[1] - s[0][1])) /
    d;
  const v =
    ((s[1][0] - s[0][0]) * (p[1] - s[0][1]) -
      (p[0] - s[0][0]) * (s[1][1] - s[0][1])) /
    d;
  return [
    g[0][0] + u * (g[1][0] - g[0][0]) + v * (g[2][0] - g[0][0]),
    g[0][1] + u * (g[1][1] - g[0][1]) + v * (g[2][1] - g[0][1]),
  ];
}

// 「相対 X 以内」の分母: 当該 compiled の対応点の両座標系を通じた座標絶対値の最大
function maxAbsCoord(compiled) {
  let m = 0;
  for (const [forw, bakw] of compiled.points) {
    for (const c of [...forw, ...bakw]) {
      const a = Math.abs(c);
      if (a > m) m = a;
    }
  }
  return m;
}

// stateFull で transform した直後の stateTriangle（または扇形三角形）からアフィン参照候補を返す
function affineCandidatesFromState(T, p) {
  const dir = "forw";
  const out = [];
  if (T.stateTriangle) {
    out.push(affineRef(T.stateTriangle, p));
  } else {
    const vp = T.vertices_params && T.vertices_params[dir];
    const fans = vp && vp[1];
    if (fans) {
      for (const fc of fans) out.push(affineRef(fc.features[0], p));
    }
  }
  return out;
}

function relErr(a, b, maxAbs) {
  return Math.hypot(a[0] - b[0], a[1] - b[1]) / maxAbs;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const { Transform } = await import(path.resolve(args.lib));

  const targets = listCaseFiles(args.tests, args.only);
  if (targets.length === 0) throw new Error("対象の cases ファイルが 0 件");

  if (args.selfTest) {
    let deviations = 0;
    for (const t of targets) {
      if (!fs.existsSync(t.compiledPath)) throw new Error(`${t.name}: compiled が無い`);
      const raw = JSON.parse(fs.readFileSync(t.compiledPath, "utf-8"));
      const c = raw.compiled ?? raw;
      const T = new Transform();
      T.setCompiled(c);
      T.stateFull = true;
      const maxAbs = maxAbsCoord(c);
      const cases = JSON.parse(fs.readFileSync(t.casePath, "utf-8"));
      for (const [forw, oldBakw] of cases) {
        T.stateTriangle = undefined;
        T.stateBackward = false;
        T.transform(forw); // 旧 Transform（重み分岐あり）の出力は使わず、三角形だけ取得する
        const cands = affineCandidatesFromState(T, forw);
        if (cands.length === 0) continue;
        const err = Math.min(...cands.map((q) => relErr(oldBakw, q, maxAbs)));
        if (err > 1e-12) deviations++;
      }
    }
    if (deviations === 0) {
      console.error("--self-test: NG（重み付き旧出力と純アフィン参照の外れが 0 件。判定器が無力）");
      process.exit(1);
    }
    console.log(`--self-test: OK（重み付き旧出力と純アフィン参照の相対誤差 > 1e-12 が ${deviations} 点）`);
    return;
  }

  let anyFail = false;
  for (const t of targets) {
    if (!fs.existsSync(t.compiledPath)) throw new Error(`${t.name}: compiled が無い`);
    const raw = JSON.parse(fs.readFileSync(t.compiledPath, "utf-8"));
    const c = raw.compiled ?? raw;
    const backTested = c.strict_status !== "strict_error" && !c.bounds;

    const T = new Transform();
    T.setCompiled(c);
    T.stateFull = true;
    const maxAbs = maxAbsCoord(c);

    const cases = JSON.parse(fs.readFileSync(t.casePath, "utf-8"));
    const newCases = [];
    let maxRel = 0;
    let maxRt = 0;
    let maxMove = 0;
    for (const [forw, oldBakw] of cases) {
      T.stateTriangle = undefined;
      T.stateBackward = false;
      const nb = T.transform(forw); // テストと同じ呼び方（第 2・第 3 引数なし）
      if (!nb) throw new Error(`${t.name}: transform(forw) が false（forw=${JSON.stringify(forw)}）`);
      const cands = affineCandidatesFromState(T, forw);
      if (cands.length === 0) throw new Error(`${t.name}: アフィン参照候補が無い`);
      const err = Math.min(...cands.map((q) => relErr(nb, q, maxAbs)));
      if (err > maxRel) maxRel = err;
      if (err > 1e-12) {
        console.error(`${t.name}: 検査2 相対誤差 ${err} > 1e-12 (forw=${JSON.stringify(forw)})`);
        anyFail = true;
        break;
      }
      if (backTested) {
        const r = T.transform(nb, true);
        if (!r) {
          console.error(`${t.name}: 検査3 transform(bakw', true) が false`);
          anyFail = true;
          break;
        }
        const ex = Math.max(Math.abs(r[0] - forw[0]), Math.abs(r[1] - forw[1]));
        if (ex > maxRt) maxRt = ex;
        if (ex >= 0.005) {
          console.error(`${t.name}: 検査3 逆変換誤差 ${ex} >= 0.005 (forw=${JSON.stringify(forw)})`);
          anyFail = true;
          break;
        }
      }
      const move = Math.hypot(nb[0] - oldBakw[0], nb[1] - oldBakw[1]);
      if (move > maxMove) maxMove = move;
      newCases.push([forw, nb]);
    }
    const forwDiffMax = 0; // forw は元のオブジェクトを流用し書き戻すため常に 0
    console.log(
      `${t.name} n=${cases.length} backTested=${backTested} 検査2最大相対=${maxRel.toExponential(2)} ` +
        `検査3最大=${maxRt.toExponential(2)} moveMax(旧との差)=${maxMove.toFixed(2)} forw差分=${forwDiffMax}`,
    );
    if (args.write && !anyFail) {
      const text = fs.readFileSync(t.casePath, "utf-8");
      const trailingNewline = text.endsWith("\n");
      const out = JSON.stringify(newCases, null, 2) + (trailingNewline ? "\n" : "");
      fs.writeFileSync(t.casePath, out);
    }
  }

  if (anyFail) {
    console.error("検査に失敗したため書き出しません。exit 1");
    process.exit(1);
  }
  console.log(args.write ? `完了（${targets.length} 件書き出し）` : `検査のみ完了（${targets.length} 件・差分 0）`);
}

main().catch((e) => {
  console.error(e && e.stack ? e.stack : e);
  process.exit(1);
});