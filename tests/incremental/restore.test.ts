import { describe, expect, it } from "vitest";
import type { Position } from "geojson";
import { Transform, type PointSet, type WorldFile } from "@maplat/transform";
import { Tin, type CompiledWithSupplement, type Options, type TinEdit } from "../../src/index.ts";
import { fitWorldFile, mapOptions } from "./fixtures.ts";
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
    expect(tamper((c) => { c.points[500][1][0] += 5000; c.points[500][1][1] += 5000; })).toEqual({ ok: false, reason: "notStrict" });
    expect(tamper((c) => { c.vertices_points[3][1][0] += 1; })).toEqual({ ok: false, reason: "verticesParams" });
    expect(tamper((c) => { (c as { vertices_params: number[][] }).vertices_params[0][0] += 1e-9; })).toEqual({ ok: false, reason: "verticesParams" });
    expect(tamper((c) => { c.tins_points[0][10][0] = 99_999; })).toEqual({ ok: false, reason: "inconsistent" });
    expect(tamper((c) => { c.supplementPairs = []; })).toEqual({ ok: false, reason: "edgeNodes" });
    expect(tamper((c) => { c.strict_status = "loose"; c.tins_points[1] = c.tins_points[0]; })).toEqual({ ok: false, reason: "loose" });
    // 補助頂点だけの三角形を作る（補助頂点 3 点に書き換える）
    expect(tamper((c) => { c.tins_points[0][0] = ["b0", "b1", "b2"]; })).toEqual({ ok: false, reason: "notStrict" });
    // 補完点の理由（凹みの点）が、網に無い番号を指している
    expect(tamper((c) => { c.supplementPairs![0].anchor = 99_999; })).toEqual({ ok: false, reason: "inconsistent" });
    // V2 の Tin に、world file 外周の compiled は読ませない（読む前に断る）
    expect(
      tamper((c) => { Object.assign(c, { outerTransform: "worldFile", worldFile: { xScale: 1, xSkew: 0, xOrigin: 0, ySkew: 0, yScale: -1, yOrigin: 0 } }); }, { incremental: true, useV2Algorithm: true })
    ).toEqual({ ok: false, reason: "v2" });
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

describe("restoreMesh: 両面で一緒に壊した compiled も断る（#103 第 4 週のレビュー M-1・m-1・m-2）", () => {
  const source = build(mapOptions("fushimijo_maplat", "strict"));
  const compiled = source.getCompiled();

  it("対応点を、両面で同じように遠くへ動かした compiled（向きの積は変わらない）は、strict として受け入れない", () => {
    let tried = 0;
    for (let i = 0; i < compiled.points.length && tried < 60; i += 3) {
      const c = clone(compiled);
      // 遠くの別の対応点と、その次の点の間へ（両面で同じ比）
      const j = (i + Math.floor(compiled.points.length / 2)) % compiled.points.length;
      const k = (j + 1) % compiled.points.length;
      const [tf, tb] = c.points[j];
      c.points[i] = [
        [tf[0] + (c.points[k][0][0] - tf[0]) * 0.3, tf[1] + (c.points[k][0][1] - tf[1]) * 0.3],
        [tb[0] + (c.points[k][1][0] - tb[0]) * 0.3, tb[1] + (c.points[k][1][1] - tb[1]) * 0.3]
      ];
      tried++;
      const tin = new Tin({ incremental: true });
      const result = tin.restoreMesh(c);
      expect(result.ok, `対応点 ${i}`).toBe(false);
      if (!result.ok) expect(["notStrict", "boundary", "verticesParams"], `対応点 ${i}`).toContain(result.reason);
      expect(tin.incrementalMesh).toBeUndefined();
    }
    expect(tried).toBe(60);
  }, TIMEOUT);

  it("網の形が壊れた compiled（網に無い対応点・重なった三角形・抜けた三角形）は断る", () => {
    const restore = (change: (c: CompiledWithSupplement) => void) => {
      const c = clone(compiled);
      change(c);
      return new Tin({ incremental: true }).restoreMesh(c);
    };
    // どの三角形にも入らない対応点
    expect(restore((c) => { c.points.push([[c.points[0][0][0] + 3, c.points[0][0][1] + 3], [c.points[0][1][0] + 3, c.points[0][1][1] + 3]]); }))
      .toEqual({ ok: false, reason: "inconsistent" });
    // 同じ三角形を 2 回
    expect(restore((c) => { c.tins_points[0].push([...c.tins_points[0][40]]); })).toEqual({ ok: false, reason: "inconsistent" });
    // 三角形を 1 つ抜く（穴）
    expect(restore((c) => { c.tins_points[0].splice(40, 1); })).toEqual({ ok: false, reason: "boundary" });
  }, TIMEOUT);

  it("断ったときは、印と strict の判定を引き継がない。対応点を入れ直すと、印は外れる", () => {
    const marked = clone(compiled);
    marked.meshOrigin = "incremental";
    // 印つきで、壊れた compiled
    const broken = clone(marked);
    broken.points[100][1][0] += 5000;
    broken.points[100][1][1] += 5000;
    const tin = new Tin({ incremental: true });
    // 網を調べて strict でないと分かったので、strict_error になる（未確定のままにしない）
    expect(tin.restoreMesh(broken)).toEqual({ ok: false, reason: "notStrict" });
    expect(tin.meshOrigin).toBeUndefined();
    expect(tin.strict_status).toBe("strict_error");
    expect(tin.getCompiled().meshOrigin).toBeUndefined();
    // 印つきを戻した後に、読めない compiled を渡しても、前の印は残らない
    expect(tin.restoreMesh(clone(marked))).toEqual({ ok: true });
    expect(tin.meshOrigin).toBe("incremental");
    const unreadable = clone(compiled);
    unreadable.tins_points[0][10][0] = 99_999;
    expect(tin.restoreMesh(unreadable)).toEqual({ ok: false, reason: "inconsistent" });
    expect(tin.meshOrigin).toBeUndefined();
    expect(tin.strict_status).toBeUndefined();
    // 印つきを戻した後に、対応点を入れ直すと、updateTin() の前でも印は外れる
    expect(tin.restoreMesh(clone(marked))).toEqual({ ok: true });
    tin.setPoints(mapOptions("fushimijo_maplat", "strict").points!);
    expect(tin.meshOrigin).toBeUndefined();
    // strict_error・loose と名乗る compiled を断ったときは、その値のまま残す（逆変換の歯止めを外さない）
    const errorSource = new Tin({ ...mapOptions("uno_bus_gtfs_error", "strict") });
    errorSource.updateTin();
    const errorCompiled = clone(errorSource.getCompiled());
    expect(errorCompiled.strict_status).toBe("strict_error");
    const refused = new Tin({ incremental: true });
    expect(refused.restoreMesh(clone(errorCompiled))).toEqual({ ok: false, reason: "notStrict" });
    expect(refused.strict_status).toBe("strict_error");
    expect(refused.getCompiled().strict_status).toBe("strict_error");
    expect(() => refused.transform(errorCompiled.points[0][1], true)).toThrow();
    // 読む前に断る組み合わせ（V2 の Tin に world file 外周）は、それまでの状態に触らない
    const v2 = new Tin({ ...mapOptions("fushimijo_maplat", "strict"), useV2Algorithm: true, incremental: true });
    v2.updateTin();
    const before = JSON.stringify(v2.getCompiled());
    const worldCompiled = { ...clone(compiled), outerTransform: "worldFile", worldFile: { xScale: 1, xSkew: 0, xOrigin: 0, ySkew: 0, yScale: -1, yOrigin: 0 } };
    expect(v2.restoreMesh(worldCompiled as CompiledWithSupplement)).toEqual({ ok: false, reason: "v2" });
    expect(v2.strict_status).toBe("strict");
    expect(v2.tins).toBeDefined();
    expect(JSON.stringify(v2.getCompiled())).toBe(before);
    // スイッチが切れているときは、setCompiled と同じ（印も状態も、compiled のまま）
    const off = new Tin({});
    expect(off.restoreMesh(clone(marked))).toEqual({ ok: false, reason: "disabled" });
    expect(off.meshOrigin).toBe("incremental");
    expect(off.strict_status).toBe("strict");
  }, TIMEOUT);

  it("strict と名乗る compiled を、網を調べて断ったときは、strict_error になり、逆変換が断られる", () => {
    // 伏見の対応点 30 を、両面で、対応点 300 の近くへ動かす（向きの積は変わらず、紙の面の折り返しだけで分かる）
    const c = clone(compiled);
    const [tf, tb] = c.points[300];
    const [nf, nb] = c.points[301];
    c.points[30] = [
      [tf[0] + (nf[0] - tf[0]) * 0.3, tf[1] + (nf[1] - tf[1]) * 0.3],
      [tb[0] + (nb[0] - tb[0]) * 0.3, tb[1] + (nb[1] - tb[1]) * 0.3]
    ];
    expect(c.strict_status).toBe("strict");
    const tin = new Tin({ incremental: true });
    expect(tin.restoreMesh(clone(c))).toEqual({ ok: false, reason: "notStrict" });
    expect(tin.strict_status).toBe("strict_error");
    expect(tin.incrementalMesh).toBeUndefined();
    // 順変換はできるが、逆変換は断られる
    expect(tin.transform(c.points[5][0], false)).not.toBe(false);
    expect(() => tin.transform(c.points[5][1], true)).toThrow();
    // 書き出した compiled も strict と名乗らない。Transform で読み直しても、逆変換は断られる
    const written = clone(tin.getCompiled());
    expect(written.strict_status).toBe("strict_error");
    const reader = new Transform();
    reader.setCompiled(written);
    expect(() => reader.transform(c.points[5][1], true)).toThrow();
    // 外周が単純でない（三角形を 1 つ抜いた）ときも同じ
    const holed = clone(compiled);
    holed.tins_points[0].splice(40, 1);
    const other = new Tin({ incremental: true });
    expect(other.restoreMesh(holed)).toEqual({ ok: false, reason: "boundary" });
    expect(other.strict_status).toBe("strict_error");
    // 網の形が読めない・食い違う、などのほかの理由では、未確定（undefined）
    const orphan = clone(compiled);
    orphan.points.push([[orphan.points[0][0][0] + 3, orphan.points[0][0][1] + 3], [orphan.points[0][1][0] + 3, orphan.points[0][1][1] + 3]]);
    const third = new Tin({ incremental: true });
    expect(third.restoreMesh(orphan)).toEqual({ ok: false, reason: "inconsistent" });
    expect(third.strict_status).toBeUndefined();
  }, TIMEOUT);

  it("follow の地図: 証拠 → 保存 → restoreMesh が通る（対応点の往復は、外の座標系で比べる）", () => {
    const options = mapOptions("fushimijo_maplat", "strict");
    const follow: Options = {
      ...options,
      yaxisMode: "follow",
      points: options.points!.map(([forw, bakw]): PointSet => [forw, [bakw[0], -bakw[1]]])
    };
    const tin = build(follow);
    const rnd = random(9);
    for (let n = 0; n < 5; n++) expect(tin.applyEdits([localMove(tin, rnd)]).mode).toBe("local");
    expect(tin.refreshBand()).toMatchObject({ mode: "local", boundaryStale: false });
    const evidence = tin.collectIncrementalEvidence({ status: "strict_error", kinks: 3 });
    expect(evidence).toMatchObject({ eligible: true, failed: [], forwFolds: 0, nonManifoldEdges: 0, indexMatches: true, sweepKinks: 0 });
    expect(evidence.gcpRoundTrip.forward).toBeLessThan(1e-6);
    expect(evidence.gcpRoundTrip.backward).toBeLessThan(1e-6);
    const saved = clone(evidence.compiled!);
    expect(saved).toMatchObject({ yaxisMode: "follow", meshOrigin: "incremental", strict_status: "strict" });
    const reopened = new Tin({ incremental: true, incrementalBand: true });
    // 呼び出し側の対応点（外の座標系）: compiled の内部の座標から、Y を戻したもの
    const external = saved.points.map(([forw, bakw]): PointSet => [forw, [bakw[0], -bakw[1]]]);
    expect(reopened.restoreMesh(clone(saved), { points: external })).toEqual({ ok: true });
    expect(reopened.meshOrigin).toBe("incremental");
    expect(JSON.stringify(reopened.getCompiled())).toBe(JSON.stringify(saved));
    expect(reopened.applyEdits([localMove(reopened, rnd)])).toMatchObject({ mode: "local", strict_status: "strict" });
  }, TIMEOUT);

  it("網の対応点 1 つを、両面で同じように遠くへ動かすと、証拠集めは不合格になる（紙の面の折り返しを見る）", () => {
    const tin = build(mapOptions("fushimijo_maplat", "strict"));
    const model = tin.incrementalMesh!;
    const { mesh } = model;
    // 遠くの別の対応点と、その次の点の間へ（両面で同じ比。三角形ごとの向きの積は、変わらないことが多い）
    const at = (i: number) => mesh.vertices.get(model.gcps[i])!;
    let folded = 0;
    for (const i of [30, 90, 150, 210]) {
      const j = (i + 250) % model.gcps.length;
      const forw: Position = [at(j).forw[0] + (at(j + 1).forw[0] - at(j).forw[0]) * 0.3, at(j).forw[1] + (at(j + 1).forw[1] - at(j).forw[1]) * 0.3];
      const bakw: Position = [at(j).bakw[0] + (at(j + 1).bakw[0] - at(j).bakw[0]) * 0.3, at(j).bakw[1] + (at(j + 1).bakw[1] - at(j).bakw[1]) * 0.3];
      const original = { forw: at(i).forw, bakw: at(i).bakw };
      mesh.relocate(model.gcps[i], forw, bakw);
      const evidence = tin.collectIncrementalEvidence();
      expect(evidence.eligible, `対応点 ${i}`).toBe(false);
      expect(evidence.forwFolds, `対応点 ${i}`).toBeGreaterThan(0);
      expect(evidence.failed, `対応点 ${i}`).toContain("badTriangles");
      expect(evidence.compiled).toBeUndefined();
      // 向きの積だけでは見えない場合がある（そのときも、紙の面の折り返しで不合格になる）
      if (evidence.badTriangles === 0) folded++;
      mesh.relocate(model.gcps[i], original.forw, original.bakw);
    }
    expect(tin.collectIncrementalEvidence().eligible).toBe(true);
    console.info(`[証拠] 両面で動かした 4 点のうち、向きの積では見えず、紙の面の折り返しだけで拾えたもの: ${folded}`);
  }, TIMEOUT);

  it("world file 外周: 補助頂点の地理面の位置が world file の値と違う compiled は断る。証拠集めも不合格にする", () => {
    // invert の実地図と、follow の合成図（tests/world-file-outer.test.ts と同じ）
    const real = mapOptions("1932_nobeoka", "strict");
    const unit: WorldFile = { xScale: 1, xSkew: 0, xOrigin: 0.5, yScale: -1, ySkew: 0, yOrigin: -0.5 };
    const synthetic: Options = {
      points: [[0, 0], [100, 0], [100, 100], [0, 100], [54, 47]].map(([x, y]): PointSet => [[x, y], [x + 40, -y]]),
      yaxisMode: "follow", strictMode: "strict", outerTransform: "worldFile", worldFile: unit
    };
    for (const options of [{ ...real, outerTransform: "worldFile" as const, worldFile: fitWorldFile(real.points!) }, synthetic]) {
      const source = build(options);
      const saved = clone(source.getCompiled());
      expect((saved as { outerTransform?: string }).outerTransform).toBe("worldFile");
      // 全部組み直した compiled は、差が 0 なので、そのまま戻せる
      expect(new Tin({ incremental: true }).restoreMesh(clone(saved))).toEqual({ ok: true });
      expect(source.collectIncrementalEvidence()).toMatchObject({ eligible: true, boundarySimple: true });
      // 補助頂点を、地理面で 1 mm 動かす（網は strict のまま）
      const moved = clone(saved);
      moved.vertices_points[2][1][0] += 0.001;
      expect(new Tin({ incremental: true }).restoreMesh(moved)).toEqual({ ok: false, reason: "inconsistent" });
      const vertex = source.incrementalMesh!.ring[2];
      const { forw, bakw } = source.incrementalMesh!.mesh.vertices.get(vertex)!;
      source.incrementalMesh!.mesh.relocate(vertex, forw, [bakw[0] + 0.001, bakw[1]]);
      const evidence = source.collectIncrementalEvidence();
      expect(evidence).toMatchObject({ eligible: false, boundarySimple: false, badTriangles: 0 });
      expect(evidence.failed).toContain("boundary");
    }
  }, TIMEOUT);

  it("証拠集めは、網の形（重なった三角形・索引）も見る", () => {
    const tin = build(mapOptions("fushimijo_maplat", "strict"));
    const { mesh } = tin.incrementalMesh!;
    const [a, b, c] = mesh.triangles.get(40)!;
    mesh.addTriangle(a, b, c);
    const evidence = tin.collectIncrementalEvidence();
    expect(evidence.eligible).toBe(false);
    expect(evidence.nonManifoldEdges).toBe(3);
    expect(evidence.failed).toContain("meshShape");
  }, TIMEOUT);
});
