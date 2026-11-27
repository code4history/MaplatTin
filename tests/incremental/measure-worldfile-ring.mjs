// world file 外周の compiled で、補助頂点の地理面の位置が world file の値と一致するかを測る
// （restoreMesh の確かめに、許す誤差が要るかを決めるため）。
//   node tests/incremental/measure-worldfile-ring.mjs
import { worldFileToCrs } from "@maplat/transform";
import { Tin } from "../../src/index.ts";
import { MAP_NAMES, MODES, mapOptions } from "./fixtures.ts";
import { fitWorldFile } from "./compare-rebuild-worldfile.mjs";

// follow は、対応点に当てはめた world file が鏡像になって作れないので、実地図では測らない
// （follow の world file 外周は、tests/incremental/restore.test.ts の合成図で確かめる）
for (const follow of [false]) {
  for (const name of MAP_NAMES) {
    for (const mode of MODES) {
      const options = mapOptions(name, mode);
      if (options.bounds) continue;
      const points = follow ? options.points.map(([f, b]) => [f, [b[0], -b[1]]]) : options.points;
      for (const extra of [{}, { incrementalRebuild: true }]) {
        const tin = new Tin({ ...options, points, ...(follow ? { yaxisMode: "follow" } : {}), outerTransform: "worldFile", worldFile: fitWorldFile(points), ...extra });
        tin.updateTin();
        const c = tin.getCompiled();
        if (c.outerTransform !== "worldFile") continue;
        let max = 0, differ = 0;
        for (const [forw, bakw] of c.vertices_points) {
          const [x, y] = worldFileToCrs(c.worldFile, forw);
          const d = Math.hypot(bakw[0] - x, bakw[1] - (follow ? -y : y));
          if (d !== 0) differ++;
          max = Math.max(max, d);
        }
        console.log(`${follow ? "follow" : "invert"} ${name} ${mode} ${extra.incrementalRebuild ? "局所" : "今"}: 補助頂点 ${c.vertices_points.length}・違う ${differ}・最大の差 ${max}`);
      }
    }
  }
}
