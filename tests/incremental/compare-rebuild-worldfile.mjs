// world file 外周で、incrementalRebuild と今の手順を比べる（world file は、対応点に最小二乗で当てはめたもの）。
//   node tests/incremental/compare-rebuild-worldfile.mjs
import { Tin } from "../../src/index.ts";
import { intrusionFraction } from "../hull-intrusion.ts";
import { MAP_NAMES, MODES, mapOptions } from "./fixtures.ts";

export function fitWorldFile(points) {
  const mean = (side, axis) => points.reduce((sum, pair) => sum + pair[side][axis], 0) / points.length;
  const xm = mean(0, 0), ym = mean(0, 1);
  const rows = points.map(([[x, y], crs]) => [x - xm, y - ym, ...crs]);
  const dot = (a, b) => rows.reduce((sum, row) => sum + row[a] * row[b], 0);
  const det = dot(0, 0) * dot(1, 1) - dot(0, 1) ** 2;
  const fit = (axis) => {
    const x = (dot(1, 1) * dot(0, axis + 2) - dot(0, 1) * dot(1, axis + 2)) / det;
    const y = (dot(0, 0) * dot(1, axis + 2) - dot(0, 1) * dot(0, axis + 2)) / det;
    return [x, y, mean(1, axis) + x * (0.5 - xm) + y * (0.5 - ym)];
  };
  const [xScale, xSkew, xOrigin] = fit(0);
  const [ySkew, yScale, yOrigin] = fit(1);
  return { xScale, xSkew, xOrigin, ySkew, yScale, yOrigin };
}
const pct = (x) => (x * 100).toFixed(3) + "%";
const main = process.argv[1]?.endsWith("compare-rebuild-worldfile.mjs");
for (const name of main ? MAP_NAMES : []) {
  for (const mode of MODES) {
    const options = mapOptions(name, mode);
    if (options.bounds) continue;
    const world = { ...options, outerTransform: "worldFile", worldFile: fitWorldFile(options.points) };
    const run = (extra) => {
      const tin = new Tin({ ...world, ...extra });
      const start = performance.now();
      tin.updateTin();
      return { tin, ms: performance.now() - start };
    };
    const off = run({}), on = run({ incrementalRebuild: true });
    const show = ({ tin, ms }) => `${ms.toFixed(0)} ms ${tin.strict_status} 外周 ${tin.getCompiled().outerTransform} 食い込み 紙 ${pct(intrusionFraction(tin, 0))} 地理 ${pct(intrusionFraction(tin, 1))} 補完点 ${tin.supplementPairs.length} 輪 ${tin.getCompiled().vertices_points.length}`;
    const d = on.tin.rebuildDiagnostics;
    console.log(`${name} ${mode}:\n   今 ${show(off)} 試行 ${off.tin.attemptTotal}\n   局所 ${show(on)} 試行 全部 ${d.fullAttempts}・局所 ${d.localAttempts}（不成立 ${d.localFailures}）採用は局所 ${d.adoptedLocal} 戻した ${d.fellBack}`);
  }
}
