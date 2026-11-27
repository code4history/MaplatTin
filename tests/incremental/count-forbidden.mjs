// 採用済みの網の、禁止制約の違反の内訳を数える（設計書 §9.5 (a)・Q9）。
//   node tests/incremental/count-forbidden.mjs
import { Tin } from "../../src/index.ts";
import { MAP_NAMES, MODES, mapOptions } from "./fixtures.ts";

for (const name of MAP_NAMES) {
  for (const mode of MODES) {
    const tin = new Tin({ ...mapOptions(name, mode), incremental: true });
    tin.updateTin();
    const model = tin.incrementalMesh;
    if (!model) {
      console.log(name, mode, tin.strict_status, "取り込まない:", tin.incrementalFailure);
      continue;
    }
    const { mesh } = model;
    // 必須エッジの違反の三角形のうち、両面とも 2×面積が 1e-6 以上のもの
    let edgeWithArea = 0;
    const area2 = (p, q, r) => Math.abs((q[0] - p[0]) * (r[1] - p[1]) - (r[0] - p[0]) * (q[1] - p[1]));
    for (const [a, b, c] of mesh.triangles.values()) {
      const group = mesh.forbiddenGroup(a, b, c);
      if (group === undefined || group === 0) continue;
      const [p, q, r] = [a, b, c].map((v) => mesh.vertices.get(v));
      if (area2(p.forw, q.forw, r.forw) >= 1e-6 && area2(p.bakw, q.bakw, r.bakw) >= 1e-6) edgeWithArea++;
    }
    console.log(
      name, mode, tin.strict_status,
      "診断の remainingForbiddenTriangles:", tin.boundaryDiagnostics?.remainingForbiddenTriangles,
      "| 採用済みの網: 補助頂点だけ", mesh.forbiddenBoundary,
      "必須エッジ", mesh.forbiddenEdge, `(うち両面で面積あり ${edgeWithArea})`,
      "| bad", mesh.bad.size, "外周が単純", mesh.boundarySimple
    );
  }
}
