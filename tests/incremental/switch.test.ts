import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { PointSet, WorldFile } from "@maplat/transform";
import { Tin, type Options } from "../../src/index.ts";
import { MAP_NAMES, MODES, digest, loadMap, mapOptions } from "./fixtures.ts";
import { REAL_DATA_TIMEOUT_MS } from "../timeouts.ts";

// MaplatTin#100 の第 1 段 a。局所更新は、スイッチ（Options#incremental）で切れる。
//
// 1. 切った状態（既定）の updateTin() の出力は、#102（80ab9b4）と 1 ビットも違わない。
//    基準は、#102 の src で作った compiled の digest（switch-off-baseline.json。作り方は gen-baseline.mjs）。
// 2. 入れた状態でも、updateTin() の出力は変わらない（第 1 段 a の部品は、三角網を取り込むだけ）。
// 3. 取り込んだ網を書き出した compiled は、getCompiled() と 1 ビットも違わない（JSON の文字列が一致）。

const baseline: Record<string, { digest: string; status: string; triangles: number }> = JSON.parse(
  readFileSync(new URL("./switch-off-baseline.json", import.meta.url), "utf8")
);
// 奈良町の 1 回の updateTin() は約 3 秒。CI は手元の 2〜5 倍遅いことがある
const TIMEOUT = REAL_DATA_TIMEOUT_MS * 3;

function fitWorldFile(points: PointSet[]): WorldFile {
  const mean = (side: 0 | 1, axis: number) =>
    points.reduce((sum, pair) => sum + pair[side][axis], 0) / points.length;
  const xMean = mean(0, 0);
  const yMean = mean(0, 1);
  const rows = points.map(([[x, y], crs]) => [x - xMean, y - yMean, ...crs]);
  const dot = (a: number, b: number) => rows.reduce((sum, row) => sum + row[a] * row[b], 0);
  const xx = dot(0, 0), xy = dot(0, 1), yy = dot(1, 1);
  const det = xx * yy - xy * xy;
  const fit = (axis: number) => {
    const x = (yy * dot(0, axis + 2) - xy * dot(1, axis + 2)) / det;
    const y = (xx * dot(1, axis + 2) - xy * dot(0, axis + 2)) / det;
    return [x, y, mean(1, axis) + x * (0.5 - xMean) + y * (0.5 - yMean)];
  };
  const [xScale, xSkew, xOrigin] = fit(0);
  const [ySkew, yScale, yOrigin] = fit(1);
  return { xScale, xSkew, xOrigin, ySkew, yScale, yOrigin };
}

/** スイッチを入れて組み、取り込みと書き出しを確かめる。 */
function expectRoundTrip(options: Options): Tin {
  const tin = new Tin({ ...options, incremental: true });
  tin.updateTin();
  const compiled = tin.getCompiled();
  const model = tin.incrementalMesh;
  if (compiled.strict_status === "loose") {
    // loose の網は取り込まない（全部組み直しのまま）
    expect(model).toBeUndefined();
    expect(tin.incrementalFailure).toBe("loose");
    return tin;
  }
  expect(tin.incrementalFailure).toBeUndefined();
  expect(model).toBeDefined();
  expect(JSON.stringify(model!.toCompiled())).toBe(JSON.stringify(compiled));
  // 局所の判定（S1 と S2）は、今の交差の数え上げと同じ結論になる
  expect(model!.mesh.isStrict()).toBe(compiled.strict_status === "strict");
  const audit = model!.mesh.audit();
  expect(audit).toMatchObject({
    triangles: compiled.tins_points[0].length,
    badMatches: true,
    indexMatches: true,
    nonManifoldEdges: 0,
    missingRequired: 0,
    forbiddenMatches: true
  });
  expect(audit.boundarySimple).toBe(model!.mesh.boundarySimple);
  return tin;
}

describe("局所更新のスイッチ: 切った状態の updateTin() は #102 と同じ", () => {
  for (const name of MAP_NAMES) {
    for (const mode of MODES) {
      it(`${name} (${mode})`, () => {
        const tin = new Tin(mapOptions(name, mode));
        expect(tin.incremental).toBe(false);
        tin.updateTin();
        const compiled = tin.getCompiled();
        expect({
          digest: digest(compiled),
          status: compiled.strict_status,
          triangles: compiled.tins_points[0].length
        }).toEqual(baseline[`${name}|${mode}`]);
        expect(tin.incrementalMesh).toBeUndefined();
        expect(tin.incrementalFailure).toBeUndefined();
      }, TIMEOUT);
    }
  }
});

describe("局所更新のスイッチ: 入れても updateTin() は変わらず、取り込み → 書き出しで compiled が一致", () => {
  for (const name of MAP_NAMES) {
    for (const mode of MODES) {
      it(`${name} (${mode})`, () => {
        const tin = expectRoundTrip(mapOptions(name, mode));
        expect(digest(tin.getCompiled())).toBe(baseline[`${name}|${mode}`].digest);
      }, TIMEOUT);
    }
  }

  it("follow の地図（地理面の Y を反転して持つ）", () => {
    const options = mapOptions("fushimijo_maplat", "strict");
    const follow = {
      ...options,
      yaxisMode: "follow" as const,
      points: options.points!.map(([forw, bakw]): PointSet => [forw, [bakw[0], -bakw[1]]])
    };
    const tin = expectRoundTrip(follow);
    // 内部の座標は invert の地図と同じなので、yaxisMode 以外は同じ compiled になる
    expect(JSON.stringify({ ...tin.getCompiled(), yaxisMode: "invert" })).toBe(
      JSON.stringify(expectRoundTrip(options).getCompiled())
    );
    // 取り込みは compiled の値を反転しない
    const vertex = tin.incrementalMesh!.mesh.vertices.get(tin.incrementalMesh!.gcps[0])!;
    expect(vertex.bakw).toEqual(options.points![0][1]);
  }, TIMEOUT);

  it("world file 外周の網・world file 外周から扇形へ落ちた網", () => {
    // 合成図は tests/world-file-outer.test.ts と同じ（東へずらした 5 点。70 画素では外周が成立せず扇形へ落ちる）
    const unit: WorldFile = { xScale: 1, xSkew: 0, xOrigin: 0.5, yScale: -1, ySkew: 0, yOrigin: -0.5 };
    const translated = (dx: number): PointSet[] =>
      [[0, 0], [100, 0], [100, 100], [0, 100], [54, 47]].map(([x, y]) => [[x, y], [x + dx, -y]]);
    const real = (name: string): Options => {
      const options = mapOptions(name, "strict");
      return { ...options, outerTransform: "worldFile", worldFile: fitWorldFile(options.points!) };
    };
    const cases: [Options, "worldFile" | "extrapolate", -1 | 1][] = [
      [real("1932_nobeoka"), "worldFile", -1],
      [real("naramachi_yasui_bunko"), "worldFile", -1],
      // follow の world file 外周は、網の向き σ が +1 になる
      [{ points: translated(40), yaxisMode: "follow", strictMode: "strict", outerTransform: "worldFile", worldFile: unit }, "worldFile", 1],
      [{ points: translated(70), strictMode: "strict", outerTransform: "worldFile", worldFile: unit }, "extrapolate", -1]
    ];
    for (const [options, outer, sigma] of cases) {
      const tin = expectRoundTrip(options);
      expect((tin.getCompiled() as { outerTransform?: string }).outerTransform).toBe(outer);
      expect(tin.incrementalMesh!.mesh.sigma).toBe(sigma);
    }
  }, TIMEOUT * 2);

  it("補完点のある網（奈良町）は、補完点を中継点と見分けて取り込む", () => {
    const tin = expectRoundTrip(mapOptions("naramachi_yasui_bunko_core", "strict"));
    const model = tin.incrementalMesh!;
    expect(model.supplements.length).toBe(tin.supplementPairs.length);
    expect(model.supplements.length).toBeGreaterThan(0);
    const nodes = model.edges.reduce((sum, edge) => sum + edge.nodes.length, 0);
    expect(nodes + model.supplements.length).toBe(tin.getCompiled().edgeNodes!.length);
    for (const edge of model.edges) {
      edge.nodes.forEach((vertex, order) =>
        expect(model.mesh.vertices.get(vertex)!.ref).toEqual({ kind: "edgeNode", edge: edge.id, order })
      );
    }
  }, TIMEOUT);

  it("V2 のアルゴリズムの網は取り込まない", () => {
    const tin = new Tin({ ...mapOptions("fushimijo_maplat", "strict"), useV2Algorithm: true, incremental: true });
    tin.updateTin();
    expect(tin.incrementalMesh).toBeUndefined();
    expect(tin.incrementalFailure).toBe("v2");
  }, TIMEOUT);

  it("入力を入れ直すと、網は捨てられる", () => {
    const options = mapOptions("kaisei_hiroshima_jissoku_sub1", "strict");
    const tin = new Tin({ ...options, incremental: true });
    tin.updateTin();
    expect(tin.incrementalMesh).toBeDefined();
    tin.setPoints(loadMap("kaisei_hiroshima_jissoku_sub1").gcps!);
    expect(tin.incrementalMesh).toBeUndefined();
  }, TIMEOUT);
});
