// 組み直しの繰り返しを局所の操作に置き換えたとき（incrementalRebuild）と、今の手順を比べる。
//   node tests/incremental/compare-rebuild.mjs [地図,地図,...] [回数]
//   node tests/incremental/compare-rebuild.mjs --json > tests/incremental/rebuild-baseline.json
//     （今の手順の食い込みを、受け入れの試験の基準として書き出す）
import { Tin } from "../../src/index.ts";
import { intrusionFraction } from "../hull-intrusion.ts";
import { MAP_NAMES, MODES, mapOptions } from "./fixtures.ts";

const json = process.argv[2] === "--json";
const names = !json && process.argv[2] ? process.argv[2].split(",") : MAP_NAMES;
const repeat = Number(process.argv[3] ?? 1);
const build = (name, mode, extra) => {
  let best = Infinity, tin;
  for (let i = 0; i < repeat; i++) {
    tin = new Tin({ ...mapOptions(name, mode), ...extra });
    const start = performance.now();
    tin.updateTin();
    best = Math.min(best, performance.now() - start);
  }
  return { tin, ms: best };
};
const pct = (x) => (x * 100).toFixed(3) + "%";
/** 対応点の外接矩形を 30 × 30 に切った格子の変換の差（紙 → 地理。メートル）。 */
const gridDiff = (a, b) => {
  const xs = a.points.map((p) => p[0][0]), ys = a.points.map((p) => p[0][1]);
  const [minx, maxx, miny, maxy] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  let differ = 0, max = 0, total = 0;
  for (let i = 1; i < 30; i++) for (let j = 1; j < 30; j++) {
    const p = [minx + ((maxx - minx) * i) / 30, miny + ((maxy - miny) * j) / 30];
    const u = a.transform(p, false, true), v = b.transform(p, false, true);
    if (!u || !v) continue;
    total++;
    const d = Math.hypot(u[0] - v[0], u[1] - v[1]);
    if (d > 1e-6) differ++;
    max = Math.max(max, d);
  }
  return { total, differ, max };
};
const out = {};
for (const name of names) {
  for (const mode of MODES) {
    const off = build(name, mode, {});
    if (json) {
      out[`${name}|${mode}`] = {
        status: off.tin.strict_status,
        forw: intrusionFraction(off.tin, 0),
        bakw: intrusionFraction(off.tin, 1),
        supplements: off.tin.supplementPairs.length,
        ring: off.tin.getCompiled().vertices_points.length
      };
      continue;
    }
    const on = build(name, mode, { incrementalRebuild: true });
    const d = on.tin.rebuildDiagnostics;
    const g = gridDiff(off.tin, on.tin);
    console.log(
      `${name} ${mode}: 今 ${off.ms.toFixed(0)} ms ${off.tin.strict_status} 食い込み 紙 ${pct(intrusionFraction(off.tin, 0))} 地理 ${pct(intrusionFraction(off.tin, 1))} 補完点 ${off.tin.supplementPairs.length} 輪 ${off.tin.getCompiled().vertices_points.length} 試行 ${off.tin.attemptTotal}` +
      ` | 局所 ${on.ms.toFixed(0)} ms ${on.tin.strict_status} 食い込み 紙 ${pct(intrusionFraction(on.tin, 0))} 地理 ${pct(intrusionFraction(on.tin, 1))} 補完点 ${on.tin.supplementPairs.length} 輪 ${on.tin.getCompiled().vertices_points.length}` +
      ` 試行 全部 ${d.fullAttempts}・局所 ${d.localAttempts}（不成立 ${d.localFailures}・${d.localMs.toFixed(0)} ms）採用は局所 ${d.adoptedLocal} 戻した ${d.fellBack}` +
      ` | 格子 ${g.total} 点のうち差がある点 ${g.differ}・最大 ${g.max.toFixed(3)} m`
    );
  }
}
if (json) console.log(JSON.stringify(out, null, 2));
