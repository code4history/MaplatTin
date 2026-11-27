import { describe, expect, it } from "vitest";
import type { Position } from "geojson";
import { Transform, type PointSet, type WorldFile } from "@maplat/transform";
import { Tin, type CompiledWithSupplement, type Options, type TinEdit } from "../../src/index.ts";
import { mapOptions } from "./fixtures.ts";
import { REAL_DATA_TIMEOUT_MS } from "../timeouts.ts";

// MaplatTin#100 の特例の保存（設計書 §9.5）: 清書が strict にならず、局所更新の網が strict のとき、
// 局所更新の網をそのまま保存する。
// - Tin#restoreMesh(compiled): 保存した compiled から、三角網と局所更新の網を戻す（三角形分割はしない）
// - Tin#refreshBand(): 保存の直前に、帯を最新にする
// - Tin#collectIncrementalEvidence(): 保存してよいかの証拠（条件 (a)(b) と診断 (d)）を集める

const TIMEOUT = REAL_DATA_TIMEOUT_MS * 6;
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

function random(seed: number): () => number {
  let state = seed >>> 0;
  return () => (state = (state * 1664525 + 1013904223) >>> 0) / 2 ** 32;
}

function build(options: Options): Tin {
  const tin = new Tin({ ...options, incremental: true, incrementalBand: true });
  tin.updateTin();
  return tin;
}

/** 帯を更新しなくてよい内側の点を、地理面で少し動かす編集（局所で済むもの）を探す。 */
function localMove(tin: Tin, rnd: () => number): TinEdit {
  const model = tin.incrementalMesh!;
  for (;;) {
    const inputs = model.inputs();
    const at = Math.floor(rnd() * inputs.points.length);
    const vertex = model.gcps[at];
    if (!model.band()?.keeps(model, [{ vertex, gcp: true, counted: true }])) continue;
    const [, bakw] = inputs.points[at];
    const external = tin.yaxisMode === "follow" ? -bakw[1] : bakw[1];
    return { type: "movePoint", id: inputs.pointIds[at], bakw: [bakw[0] + 0.5, external + 0.5] };
  }
}

describe("restoreMesh: 保存した compiled から、局所更新の網を戻す", () => {
  const follow = (options: Options): Options => ({
    ...options,
    yaxisMode: "follow",
    points: options.points!.map(([forw, bakw]): PointSet => [forw, [bakw[0], -bakw[1]]])
  });
  const cases: [string, Options][] = [
    ["伏見", mapOptions("fushimijo_maplat", "strict")],
    ["伏見（follow）", follow(mapOptions("fushimijo_maplat", "strict"))],
    ["広島（サブマップ・間引いた輪）", mapOptions("kaisei_hiroshima_jissoku_sub1", "strict")],
    ["奈良町（必須エッジ・補完点）", mapOptions("naramachi_yasui_bunko_core", "strict")]
  ];
  for (const [label, options] of cases) {
    it(`${label}: getCompiled → restoreMesh → getCompiled が 1 ビットも変わらず、同じ編集が同じ差分になる`, () => {
      const source = build(options);
      const compiled = source.getCompiled();
      const text = JSON.stringify(compiled);
      const tin = new Tin({ incremental: true, incrementalBand: true });
      // 呼び出し側の対応点・必須エッジ（外の座標系）を渡すと、compiled と合うかを確かめる
      expect(tin.restoreMesh(clone(compiled), { points: options.points, edges: options.edges })).toEqual({ ok: true });
      expect(JSON.stringify(tin.getCompiled())).toBe(text);
      expect(JSON.stringify(tin.incrementalMesh!.toCompiled())).toBe(text);
      expect(tin.meshOrigin).toBeUndefined();
      expect(tin.strict_status).toBe("strict");
      // 中継点と補完点を見分けている
      const model = tin.incrementalMesh!;
      expect(model.supplements.length).toBe(source.supplementPairs.length);
      expect(model.edges.reduce((sum, edge) => sum + edge.nodes.length, 0) + model.supplements.length).toBe(
        (compiled.edgeNodes ?? []).length
      );
      // 戻した網から、局所更新を続けられる。全部組み直しの網と、同じ差分になる
      const rnd = random(3);
      for (let n = 0; n < 5; n++) {
        const edit = localMove(source, rnd);
        const a = source.applyEdits([edit]);
        const b = tin.applyEdits([edit]);
        expect(a.mode).toBe("local");
        expect(b).toEqual(a);
      }
      expect(JSON.stringify(tin.getCompiled())).toBe(JSON.stringify(source.getCompiled()));
      // 対応点が違えば、戻さない（follow の反転は restoreMesh が掛ける）
      const wrong = options.points!.map((point, i): PointSet => (i === 1 ? [point[0], [point[1][0] + 1, point[1][1]]] : point));
      expect(new Tin({ incremental: true }).restoreMesh(clone(compiled), { points: wrong })).toEqual({ ok: false, reason: "inputMismatch" });
    }, TIMEOUT);
  }

  it("world file 外周の compiled も戻せる", () => {
    const options = mapOptions("1932_nobeoka", "strict");
    const xs = options.points!;
    const mean = (side: 0 | 1, axis: number) => xs.reduce((sum, pair) => sum + pair[side][axis], 0) / xs.length;
    const [xm, ym] = [mean(0, 0), mean(0, 1)];
    const rows = xs.map(([[x, y], crs]) => [x - xm, y - ym, ...crs]);
    const dot = (a: number, b: number) => rows.reduce((sum, row) => sum + row[a] * row[b], 0);
    const det = dot(0, 0) * dot(1, 1) - dot(0, 1) ** 2;
    const fit = (axis: number) => {
      const x = (dot(1, 1) * dot(0, axis + 2) - dot(0, 1) * dot(1, axis + 2)) / det;
      const y = (dot(0, 0) * dot(1, axis + 2) - dot(0, 1) * dot(0, axis + 2)) / det;
      return [x, y, mean(1, axis) + x * (0.5 - xm) + y * (0.5 - ym)];
    };
    const [xScale, xSkew, xOrigin] = fit(0);
    const [ySkew, yScale, yOrigin] = fit(1);
    const worldFile: WorldFile = { xScale, xSkew, xOrigin, ySkew, yScale, yOrigin };
    const source = build({ ...options, outerTransform: "worldFile", worldFile });
    const compiled = source.getCompiled();
    expect((compiled as { outerTransform?: string }).outerTransform).toBe("worldFile");
    const tin = new Tin({ incremental: true });
    expect(tin.restoreMesh(clone(compiled))).toEqual({ ok: true });
    expect(JSON.stringify(tin.getCompiled())).toBe(JSON.stringify(compiled));
  }, TIMEOUT);

  it("外で書き換えられた compiled は戻さない（理由を返し、網を持たない）", () => {
    const source = build(mapOptions("naramachi_yasui_bunko_core", "strict"));
    const compiled = source.getCompiled();
    const tamper = (change: (c: CompiledWithSupplement) => void, options: Options = { incremental: true }) => {
      const copy = clone(compiled);
      change(copy);
      const tin = new Tin(options);
      const result = tin.restoreMesh(copy);
      if (!result.ok) expect(tin.incrementalMesh).toBeUndefined();
      return result;
    };
    expect(tamper(() => undefined)).toEqual({ ok: true });
    expect(tamper(() => undefined, {})).toEqual({ ok: false, reason: "disabled" });
    // 中継点（必須エッジから決まる）を動かす
    expect(tamper((c) => { c.edgeNodes![0][0][0] += 0.5; })).toEqual({ ok: false, reason: "edgeNodes" });
    // 対応点を、地理面で遠くへ動かす（向きが逆の三角形ができる）
    expect(tamper((c) => { c.points[500][1][0] += 5000; c.points[500][1][1] += 5000; }).ok).toBe(false);
    expect(tamper((c) => { c.vertices_points[3][1][0] += 1; })).toEqual({ ok: false, reason: "verticesParams" });
    expect(tamper((c) => { (c as { vertices_params: number[][] }).vertices_params[0][0] += 1e-9; })).toEqual({ ok: false, reason: "verticesParams" });
    expect(tamper((c) => { c.tins_points[0][10][0] = 99_999; })).toEqual({ ok: false, reason: "inconsistent" });
    expect(tamper((c) => { c.supplementPairs = []; })).toEqual({ ok: false, reason: "edgeNodes" });
    expect(tamper((c) => { c.strict_status = "loose"; c.tins_points[1] = c.tins_points[0]; })).toEqual({ ok: false, reason: "loose" });
    // 補助頂点だけの三角形を作る（補助頂点 3 点に書き換える）
    expect(tamper((c) => { c.tins_points[0][0] = ["b0", "b1", "b2"]; }).ok).toBe(false);
    // 失敗しても、setCompiled した状態で変換はできる
    const tin = new Tin({});
    expect(tin.restoreMesh(clone(compiled)).ok).toBe(false);
    const [forw, bakw] = compiled.points[10];
    const out = tin.transform(forw, false) as Position;
    expect(Math.hypot(out[0] - bakw[0], out[1] - bakw[1])).toBeLessThan(1e-6);
  }, TIMEOUT);
});

describe("特例の保存: 清書が strict にならず、局所更新の網が strict のとき", () => {
  it("帯を最新にして証拠を集め、保存し、読み直して strict のまま編集を続けられる。清書が strict になれば印が外れる", () => {
    // 館林城下町で、対応点の紙の面を少しずつ動かす（対角線の 0.04〜0.24%）。40 回で、清書だけが strict でなくなる
    const options = mapOptions("tatebayashi_kaei_jokamachi", "strict");
    const tin = build(options);
    const rnd = random(1);
    const xs = options.points!.map(([forw]) => forw[0]);
    const ys = options.points!.map(([forw]) => forw[1]);
    const span = Math.hypot(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
    // 清書は、別のインスタンスで行う（局所更新の網を上書きしない）
    const cleanBuild = () => {
      const inputs = tin.incrementalMesh!.inputs();
      const other = new Tin({ ...options, points: undefined, edges: undefined });
      other.points = inputs.points;
      other.setEdges(inputs.edges);
      other.updateTin();
      return other;
    };
    let clean: Tin | undefined;
    let edits = 0;
    for (let n = 0; n < 400 && !clean; n++) {
      const inputs = tin.incrementalMesh!.inputs();
      const at = Math.floor(rnd() * inputs.points.length);
      const [forw] = inputs.points[at];
      const distance = span * 0.002 * (0.2 + rnd());
      const angle = rnd() * 2 * Math.PI;
      const patch = tin.applyEdits([
        { type: "movePoint", id: inputs.pointIds[at], forw: [forw[0] + distance * Math.cos(angle), forw[1] + distance * Math.sin(angle)] }
      ]);
      // 全部組み直しへ落ちて strict でなくなったら、この試験の場面ではない
      if (patch.strict_status !== "strict") break;
      edits++;
      if (edits % 10 === 0) {
        const candidate = cleanBuild();
        if (candidate.strict_status !== "strict") clean = candidate;
      }
    }
    console.info(`[特例の保存] 館林城下町: 編集 ${edits} 回で、清書が ${clean?.strict_status ?? "strict のまま"}・局所更新の網は ${tin.strict_status}`);
    expect(clean).toBeDefined();
    expect(tin.incrementalMesh!.mesh.isStrict()).toBe(true);

    // (a) 帯が最新でなければ、条件を満たさない
    const stale = tin.collectIncrementalEvidence();
    if (!stale.boundaryFresh) {
      expect(stale).toMatchObject({ eligible: false, failed: ["boundaryStale"] });
      expect(stale.compiled).toBeUndefined();
    }
    const refreshed = tin.refreshBand();
    expect(refreshed).toMatchObject({ mode: "local", boundaryStale: false, strict_status: "strict" });
    expect(refreshed!.centroid).toBeDefined();
    // 証拠を集める（網は変えない）
    const revision = tin.revision;
    const kinks = clean!.kinks ? clean!.kinks.forw!.features.length + clean!.kinks.bakw!.features.length : 0;
    const evidence = tin.collectIncrementalEvidence({ status: clean!.strict_status!, kinks });
    expect(tin.revision).toBe(revision);
    expect(evidence).toMatchObject({
      eligible: true, failed: [], boundaryFresh: true, badTriangles: 0, boundarySimple: true, missingRequiredEdges: 0,
      boundaryOnlyTriangles: 0, sweepKinks: 0, rebuildStatus: clean!.strict_status, rebuildKinks: kinks
    });
    expect(evidence.editsSinceRebuild).toBeGreaterThan(0);
    expect(evidence.gcpRoundTrip.forward).toBeLessThan(1e-6);
    expect(evidence.gcpRoundTrip.backward).toBeLessThan(1e-6);
    const saved = clone(evidence.compiled!);
    expect(saved.meshOrigin).toBe("incremental");
    expect(saved.strict_status).toBe("strict");
    expect(saved.kinks_points).toBeUndefined();

    // 保存した compiled は、今の Transform がそのまま読める（印は無視される）
    const reader = new Transform();
    reader.setCompiled(clone(saved));
    const [forw, bakw] = saved.points[7];
    const out = reader.transform(forw, false) as number[];
    expect(Math.hypot(out[0] - bakw[0], out[1] - bakw[1])).toBeLessThan(1e-6);

    // (c) 読み直す: updateTin() を呼ばずに、網を戻す。strict のままで、印を引き継ぐ
    const reopened = new Tin({ incremental: true, incrementalBand: true });
    expect(reopened.restoreMesh(clone(saved))).toEqual({ ok: true });
    expect(reopened.meshOrigin).toBe("incremental");
    expect(reopened.strict_status).toBe("strict");
    expect(JSON.stringify(reopened.getCompiled())).toBe(JSON.stringify(saved));
    // 編集を続けても strict。書き出しにも印が残る
    const patch = reopened.applyEdits([localMove(reopened, random(5))]);
    expect(patch).toMatchObject({ mode: "local", strict_status: "strict" });
    expect(reopened.getCompiled().meshOrigin).toBe("incremental");
    // 同じ地図を updateTin() で開くと、清書と同じく strict にならない（特例の保存が要る理由）
    const naive = new Tin({ ...options, points: undefined, edges: undefined });
    naive.setCompiled(clone(saved));
    naive.updateTin();
    expect(naive.strict_status).not.toBe("strict");
    expect(naive.meshOrigin).toBeUndefined();
    expect(naive.getCompiled().meshOrigin).toBeUndefined();
  }, TIMEOUT * 2);

  it("strict でない網・網を持たない Tin は、条件を満たさない", () => {
    const options = mapOptions("fushimijo_maplat", "strict");
    expect(new Tin(options).collectIncrementalEvidence()).toMatchObject({ eligible: false, failed: ["noMesh"] });
    const tin = build(options);
    expect(tin.collectIncrementalEvidence()).toMatchObject({ eligible: true, editsSinceRebuild: 0 });
    // 判定を通さずに、向きが逆の三角形を作る
    const model = tin.incrementalMesh!;
    const vertex = model.gcps[200];
    const { forw, bakw } = model.mesh.vertices.get(vertex)!;
    model.mesh.relocate(vertex, forw, [bakw[0] + 5000, bakw[1] + 5000]);
    const evidence = tin.collectIncrementalEvidence();
    expect(evidence.eligible).toBe(false);
    expect(evidence.failed).toContain("badTriangles");
    expect(evidence.failed).toContain("sweepKinks");
    expect(evidence.compiled).toBeUndefined();
    // スイッチ incrementalBand が切れていれば、帯は作り直せない
    const plain = new Tin({ ...options, incremental: true });
    plain.updateTin();
    expect(plain.refreshBand()).toBeUndefined();
  }, TIMEOUT);
});
