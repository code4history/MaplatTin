// incrementalRebuild で採った網に、禁止制約の三角形が残るかを数える（局所の試行は、禁止制約の増加を許している）。
//   node tests/incremental/count-forbidden-rebuild.mjs
import { Tin } from "../../src/index.ts";
import { MAP_NAMES, MODES, mapOptions } from "./fixtures.ts";

for (const name of MAP_NAMES) {
  for (const mode of MODES) {
    const rows = [];
    for (const extra of [{}, { incrementalRebuild: true }]) {
      const tin = new Tin({ ...mapOptions(name, mode), ...extra, incremental: true });
      tin.updateTin();
      const mesh = tin.incrementalMesh?.mesh;
      rows.push(mesh ? `補助頂点だけ ${mesh.forbiddenBoundary}・必須エッジ ${mesh.forbiddenEdge}` : `取り込まない（${tin.strict_status}）`);
    }
    console.log(`${name} ${mode}: 今 ${rows[0]} | incrementalRebuild ${rows[1]}`);
  }
}
