// 局所更新を切った状態の updateTin() の出力（compiled の digest）の基準を作る。
// 基準は #102（80ab9b4）の src で作ったもの。作り直すときは、その commit の src で走らせること。
//   node tests/incremental/gen-baseline.mjs > tests/incremental/switch-off-baseline.json
import { Tin } from "../../src/index.ts";
import { MAP_NAMES, MODES, digest, mapOptions } from "./fixtures.ts";

const out = {};
for (const name of MAP_NAMES) {
  for (const mode of MODES) {
    const tin = new Tin(mapOptions(name, mode));
    try {
      tin.updateTin();
      const compiled = tin.getCompiled();
      out[`${name}|${mode}`] = {
        digest: digest(compiled),
        status: compiled.strict_status,
        triangles: compiled.tins_points[0].length
      };
    } catch (error) {
      out[`${name}|${mode}`] = { error: String(error) };
    }
  }
}
console.log(JSON.stringify(out, null, 2));
