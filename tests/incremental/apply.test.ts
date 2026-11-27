import { describe, expect, it } from "vitest";
import type { Position } from "geojson";
import type { PointSet } from "@maplat/transform";
import { Tin, type MeshModel, type Options, type TinEdit, type TinPatch, type VertexRef } from "../../src/index.ts";
import { applyToMesh } from "../../src/incremental/apply.ts";
import { digest, mapOptions } from "./fixtures.ts";
import { REAL_DATA_TIMEOUT_MS } from "../timeouts.ts";

// MaplatTin#100 の第 2 段 a: Tin#applyEdits（内側の編集）。
// - 局所で済めば、網の差分（TinPatch）を返す。差分だけで、表示用の網（頂点表 + 三角形）を最新にできる。
// - 済まなければ、編集を入力に当てて全部組み直す。その結果は、同じ入力を新しい Tin で組んだ結果と同じ。
// - T5: 局所更新を重ねた後の清書（updateTin）は、同じ入力を新しい Tin で組んだ結果と 1 ビットも違わない。
// - T7: 奈良町で 1 点の移動の時間。

const TIMEOUT = REAL_DATA_TIMEOUT_MS * 6;

function random(seed: number): () => number {
  let state = seed >>> 0;
  return () => (state = (state * 1664525 + 1013904223) >>> 0) / 2 ** 32;
}

const refKey = (ref: VertexRef) => JSON.stringify(ref);

/** Editor の表示用の網の代わり: 頂点表（指し方 → 座標）と、三角形（id → 頂点の指し方）。 */
class DisplayMesh {
  vertices = new Map<string, { forw: Position; bakw: Position }>();
  triangles = new Map<number, string[]>();

  /** 全部を取り直す（最初と、mode が "full" のとき）。 */
  reset(model: MeshModel) {
    this.vertices.clear();
    this.triangles.clear();
    for (const { ref, forw, bakw } of model.mesh.vertices.values()) this.vertices.set(refKey(ref), { forw, bakw });
    for (const [id, triangle] of model.mesh.triangles) {
      this.triangles.set(id, triangle.map((vertex) => refKey(model.mesh.vertices.get(vertex)!.ref)));
    }
  }

  apply(patch: TinPatch) {
    for (const id of patch.removedTriangles ?? []) expect(this.triangles.delete(id)).toBe(true);
    for (const ref of patch.removedVertices ?? []) expect(this.vertices.delete(refKey(ref))).toBe(true);
    for (const { ref, forw, bakw } of patch.addedVertices ?? []) {
      expect(this.vertices.has(refKey(ref))).toBe(false);
      this.vertices.set(refKey(ref), { forw, bakw });
    }
    for (const { ref, forw, bakw } of patch.movedVertices ?? []) {
      expect(this.vertices.has(refKey(ref))).toBe(true);
      this.vertices.set(refKey(ref), { forw, bakw });
    }
    for (const { id, vertices } of patch.addedTriangles ?? []) {
      expect(this.triangles.has(id)).toBe(false);
      this.triangles.set(id, vertices.map(refKey));
    }
  }

  /** 網と同じか。 */
  expectSame(model: MeshModel) {
    const other = new DisplayMesh();
    other.reset(model);
    expect(this.triangles.size).toBe(other.triangles.size);
    for (const [id, refs] of other.triangles) expect(this.triangles.get(id)).toEqual(refs);
    expect(this.vertices.size).toBe(other.vertices.size);
    for (const [key, position] of other.vertices) expect(this.vertices.get(key)).toEqual(position);
  }
}

/** 同じ入力を、新しい Tin で最初から組んだ compiled。 */
function rebuilt(options: Options, tin: Tin) {
  const compiled = tin.getCompiled();
  const fresh = new Tin({ ...options, points: undefined, edges: undefined });
  // compiled の点は内部の座標系なので、follow の反転を通さずに入れる
  fresh.points = compiled.points;
  fresh.setEdges(compiled.edges);
  fresh.updateTin();
  return fresh.getCompiled();
}

/** 帯を更新しなくてよい内側の対応点を探して、地理面で少し動かす編集を作る。 */
function smallMove(tin: Tin, rnd: () => number): TinEdit {
  const points = tin.getCompiled().points;
  const index = Math.floor(rnd() * points.length);
  const [, bakw] = points[index];
  const model = tin.incrementalMesh;
  const id = model ? (model.mesh.vertices.get(model.gcps[index])!.ref as { id: number }).id : index;
  return { type: "movePoint", id, bakw: [bakw[0] + (rnd() - 0.5) * 4, bakw[1] + (rnd() - 0.5) * 4] };
}

describe("applyEdits", () => {
  it("スイッチが切れていれば、編集を入力に当てて全部組み直す（noMesh）", () => {
    const options = mapOptions("kaisei_hiroshima_jissoku_sub1", "strict");
    const tin = new Tin(options);
    tin.updateTin();
    const [forw, bakw] = options.points![3];
    const patch = tin.applyEdits([{ type: "movePoint", id: 3, bakw: [bakw[0] + 1, bakw[1] + 1] }]);
    expect(patch).toEqual({ revision: 1, mode: "full", fallbackReason: "noMesh", strict_status: tin.strict_status, boundaryStale: false });
    expect(tin.incrementalMesh).toBeUndefined();
    const points = options.points!.map((point, i): PointSet => (i === 3 ? [forw, [bakw[0] + 1, bakw[1] + 1]] : point));
    const fresh = new Tin({ ...options, points });
    fresh.updateTin();
    expect(digest(tin.getCompiled())).toBe(digest(fresh.getCompiled()));
  }, TIMEOUT);

  it("局所で済む編集は差分を返し、差分だけで表示用の網を最新にできる（伏見・乱数の編集 120 回）", () => {
    const options = mapOptions("fushimijo_maplat", "strict");
    const tin = new Tin({ ...options, incremental: true });
    tin.updateTin();
    const display = new DisplayMesh();
    display.reset(tin.incrementalMesh!);
    // 全部組み直しの直後は、三角形の id が、compiled の tins_points の添字に一致する
    expect([...tin.incrementalMesh!.mesh.triangles.keys()]).toEqual(tin.getCompiled().tins_points[0].map((_, i) => i));
    const rnd = random(42);
    const counts = { local: 0, full: 0 } as Record<string, number>;
    const reasons: Record<string, number> = {};
    let nextPoint = 5_000;
    let nextEdge = 9_000;
    let revision = 0;
    for (let n = 0; n < 120; n++) {
      const model = tin.incrementalMesh!;
      const { mesh } = model;
      const points = model.inputs();
      const at = Math.floor(rnd() * points.points.length);
      const id = points.pointIds[at];
      const [forw, bakw] = points.points[at];
      const kind = Math.floor(rnd() * 6);
      let edits: TinEdit[];
      if (kind === 0) edits = [{ type: "movePoint", id, forw: [forw[0] + (rnd() - 0.5) * 30, forw[1] + (rnd() - 0.5) * 30] }];
      else if (kind === 1) edits = [{ type: "movePoint", id, bakw: [bakw[0] + (rnd() - 0.5) * 6, bakw[1] + (rnd() - 0.5) * 6] }];
      else if (kind === 2) {
        // 対応点のすぐ脇に 1 点足し、同じ呼び出しの中で、もとの点と必須エッジで結ぶ（折れ点つき）
        const added = nextPoint++;
        const to: [Position, Position] = [[forw[0] + 25, forw[1] + 12], [bakw[0] + 8, bakw[1] - 4]];
        edits = [
          { type: "addPoint", id: added, forw: to[0], bakw: to[1] },
          {
            type: "addEdge", id: nextEdge++, start: id, end: added,
            forwNodes: [[(forw[0] + to[0][0]) / 2 + 1, (forw[1] + to[0][1]) / 2 - 1]], bakwNodes: []
          }
        ];
      } else if (kind === 3 && points.edgeIds.length > 0) {
        edits = [{ type: "removeEdge", id: points.edgeIds[Math.floor(rnd() * points.edgeIds.length)] }];
      } else if (kind === 4 && points.edgeIds.length > 0) {
        edits = [{ type: "replaceEdgeNodes", id: points.edgeIds[Math.floor(rnd() * points.edgeIds.length)], forwNodes: [], bakwNodes: [] }];
      } else {
        // 必須エッジの端点でない点を消す
        const used = new Set(points.edges.flatMap((edge) => edge[2]));
        if (used.has(at)) continue;
        edits = [{ type: "removePoint", id }];
      }
      const before = mesh.triangles.size;
      const wasStrict = mesh.isStrict();
      const patch = tin.applyEdits(edits, revision);
      revision++;
      expect(patch.revision).toBe(revision);
      expect(tin.revision).toBe(revision);
      counts[patch.mode]++;
      if (patch.mode === "local") {
        expect(patch.fallbackReason).toBeUndefined();
        expect(patch.boundaryStale).toBe(true);
        expect(tin.incrementalMesh).toBe(model);
        // 局所更新は、strict の網を strict のまま保つ（strict_error は、全部組み直しへ落ちた結果としてだけ現れる）
        if (wasStrict) expect(patch.strict_status).toBe("strict");
        display.apply(patch);
        // 差し替えた範囲の外接矩形は、増えた三角形と動いた頂点を含む
        for (const { vertices } of patch.addedTriangles ?? []) {
          for (const ref of vertices) {
            const [x, y] = display.vertices.get(refKey(ref))!.forw;
            expect(x >= patch.dirtyBounds![0] && x <= patch.dirtyBounds![2] && y >= patch.dirtyBounds![1] && y <= patch.dirtyBounds![3]).toBe(true);
          }
        }
      } else {
        reasons[patch.fallbackReason!] = (reasons[patch.fallbackReason!] ?? 0) + 1;
        expect(patch.boundaryStale).toBe(false);
        expect(tin.incrementalMesh).not.toBe(model);
        expect(before).toBeGreaterThan(0);
        // 全部組み直しの後は、全部を取り直す
        if (!tin.incrementalMesh) break;
        display.reset(tin.incrementalMesh);
      }
      display.expectSame(tin.incrementalMesh!);
      expect(tin.incrementalMesh!.mesh.isStrict()).toBe(tin.strict_status === "strict");
    }
    console.info(`[applyEdits] 伏見 120 回: 局所 ${counts.local}・全部組み直し ${counts.full}（理由 ${JSON.stringify(reasons)}）`);
    expect(counts.local).toBeGreaterThan(60);
    expect(counts.full).toBeGreaterThan(0);

    // getCompiled() と transform() は、網から作り直した最新の状態を返す
    const compiled = tin.getCompiled();
    expect(JSON.stringify(compiled)).toBe(JSON.stringify(tin.incrementalMesh!.toCompiled()));
    for (const [forw, bakw] of compiled.points.slice(0, 50)) {
      const out = tin.transform(forw, false) as Position;
      expect(Math.hypot(out[0] - bakw[0], out[1] - bakw[1])).toBeLessThan(1e-6);
    }
    expect(tin.points).toEqual(compiled.points);
    expect(tin.edges).toEqual(compiled.edges);

    // T5: 清書（updateTin）は、同じ入力を新しい Tin で組んだ結果と 1 ビットも違わない
    const expected = rebuilt(options, tin);
    tin.updateTin();
    expect(JSON.stringify(tin.getCompiled())).toBe(JSON.stringify(expected));
    // 清書の後も、id は変わらない（足した点の id で、続けて編集できる）
    const added = tin.incrementalMesh?.inputs().pointIds.find((id) => id >= 5_000);
    if (tin.incrementalMesh && added !== undefined) {
      const index = tin.incrementalMesh.inputs().pointIds.indexOf(added);
      const [, bakw] = tin.getCompiled().points[index];
      const patch = tin.applyEdits([{ type: "movePoint", id: added, bakw: [bakw[0] + 0.25, bakw[1]] }], revision);
      expect(patch.revision).toBe(revision + 1);
      expect(tin.getCompiled().points[index][1]).toEqual([bakw[0] + 0.25, bakw[1]]);
    }
  }, TIMEOUT);

  it("版が合わなければ、何も変えずに revisionMismatch を返す。当てられない編集は、何も変えずに例外を投げる", () => {
    const options = mapOptions("kaisei_hiroshima_jissoku_sub1", "strict");
    const tin = new Tin({ ...options, incremental: true });
    tin.updateTin();
    const before = JSON.stringify(tin.getCompiled());
    const model = tin.incrementalMesh;
    const [, bakw] = options.points![3];
    const edit: TinEdit = { type: "movePoint", id: 3, bakw: [bakw[0] + 1, bakw[1] + 1] };
    expect(tin.applyEdits([edit], 7)).toEqual({
      revision: 0, mode: "full", fallbackReason: "revisionMismatch", strict_status: "strict", boundaryStale: false
    });
    expect(() => tin.applyEdits([edit, { type: "movePoint", id: 999, forw: [1, 1] }])).toThrow(/対応点 999/);
    expect(() => tin.applyEdits([{ type: "addPoint", id: 3, forw: [1, 1], bakw: [1, 1] }])).toThrow(/id 3/);
    expect(() => tin.applyEdits([{ type: "addPoint", id: 500, forw: [1, NaN], bakw: [1, 1] }])).toThrow(/有限/);
    expect(() => tin.applyEdits([{ type: "removeEdge", id: 0 }])).toThrow(/必須エッジ 0/);
    expect(() => tin.applyEdits([{ type: "addEdge", id: 0, start: 1, end: 1, forwNodes: [], bakwNodes: [] }])).toThrow(/両端/);
    expect(tin.revision).toBe(0);
    expect(tin.incrementalMesh).toBe(model);
    expect(JSON.stringify(tin.getCompiled())).toBe(before);
    // 入力を入れ直すと、版は 0 に戻る
    expect(tin.applyEdits([edit], 0).revision).toBe(1);
    tin.setPoints(options.points!);
    expect(tin.revision).toBe(0);
    expect(tin.incrementalMesh).toBeUndefined();
  }, TIMEOUT);

  it("局所で済まない編集は、全部組み直しへ落ちて、その結果を返す（id は保つ）", () => {
    const options = mapOptions("fushimijo_maplat", "strict");
    const tin = new Tin({ ...options, incremental: true });
    tin.updateTin();
    // 凸包の頂点（紙の面で x が最小の点）を消す: 帯に触れるので、局所では済まない
    const xs = options.points!.map(([forw]) => forw[0]);
    const corner = xs.indexOf(Math.min(...xs));
    const patch = tin.applyEdits([{ type: "removePoint", id: corner }], 0);
    expect(patch).toMatchObject({ revision: 1, mode: "full", fallbackReason: "unsupported", boundaryStale: false });
    expect(patch.addedTriangles).toBeUndefined();
    const points = options.points!.filter((_, i) => i !== corner);
    const fresh = new Tin({ ...options, points });
    fresh.updateTin();
    expect(digest(tin.getCompiled())).toBe(digest(fresh.getCompiled()));
    // 消した点より後ろの点の id は、詰まらない
    const model = tin.incrementalMesh!;
    expect(model.pointVertex.has(corner)).toBe(false);
    const last = options.points!.length - 1;
    expect(model.mesh.vertices.get(model.pointVertex.get(last)!)!.forw).toEqual(options.points![last][0]);
    expect(model.gcps.length).toBe(points.length);

    // 全部組み直しが例外を投げる入力では、同じ例外を投げる。入力は編集の後の状態になる
    const far = tin.getCompiled().points;
    expect(() =>
      tin.applyEdits(far.slice(2).map((_, i): TinEdit => ({ type: "removePoint", id: model.inputs().pointIds[i + 2] })))
    ).toThrow(/TOO LINEAR/);
    expect(tin.revision).toBe(2);
    expect(tin.incrementalMesh).toBeUndefined();
    expect(tin.points.length).toBe(2);
  }, TIMEOUT);

  it("follow の地図: 編集の地理面の座標は外の座標系で渡し、差分は内部の座標系で返る", () => {
    const options = mapOptions("fushimijo_maplat", "strict");
    const follow: Options = {
      ...options,
      yaxisMode: "follow",
      points: options.points!.map(([forw, bakw]): PointSet => [forw, [bakw[0], -bakw[1]]]),
      incremental: true
    };
    const tin = new Tin(follow);
    tin.updateTin();
    const plain = new Tin({ ...options, incremental: true });
    plain.updateTin();
    const rnd = random(7);
    let local = 0;
    for (let n = 0; n < 30; n++) {
      const edit = smallMove(plain, rnd);
      if (edit.type !== "movePoint") continue;
      const external: TinEdit = { ...edit, bakw: [edit.bakw![0], -edit.bakw![1]] };
      const a = plain.applyEdits([edit]);
      const b = tin.applyEdits([external]);
      expect(b.mode).toBe(a.mode);
      if (a.mode !== "local") continue;
      local++;
      // 差分の座標は、どちらも内部の座標系（invert の地図と同じ値）
      expect(b.movedVertices).toEqual(a.movedVertices);
      expect(b.movedVertices![0].bakw).toEqual(edit.bakw);
    }
    expect(local).toBeGreaterThan(5);
    expect(JSON.stringify({ ...tin.getCompiled(), yaxisMode: "invert" })).toBe(JSON.stringify(plain.getCompiled()));
  }, TIMEOUT);

  it("T7: 奈良町で、1 点の移動（局所で済んだもの）の時間の中央値が 5 ミリ秒以下", () => {
    const options = mapOptions("naramachi_yasui_bunko_core", "strict");
    const tin = new Tin({ ...options, incremental: true });
    tin.updateTin();
    const model = tin.incrementalMesh!;
    const rnd = random(2026);
    const times: number[] = [];
    const reasons: Record<string, number> = {};
    let tried = 0;
    // 全部組み直しへ落ちると 1 回 3 秒かかるので、ここでは網に直接当てて、局所で済むものだけを測る
    while (times.length < 100 && tried < 400) {
      tried++;
      const inputs = model.inputs();
      const at = Math.floor(rnd() * inputs.points.length);
      const [forw, bakw] = inputs.points[at];
      // 紙の面と地理面を、同じ向きへ少し動かす（紙の面で 2 ピクセル前後）
      const dx = (rnd() - 0.5) * 4,
        dy = (rnd() - 0.5) * 4;
      const edit: TinEdit = {
        type: "movePoint", id: inputs.pointIds[at],
        forw: [forw[0] + dx, forw[1] + dy], bakw: [bakw[0] + dx * 0.5, bakw[1] - dy * 0.5]
      };
      const start = performance.now();
      const patch = applyLocally(tin, model, edit);
      const elapsed = performance.now() - start;
      if (patch.ok) times.push(elapsed);
      else reasons[patch.reason] = (reasons[patch.reason] ?? 0) + 1;
    }
    times.sort((a, b) => a - b);
    const median = times[Math.floor(times.length / 2)];
    console.info(
      `[T7] 奈良町: 1 点の移動 ${tried} 回のうち局所 ${times.length} 回（済まなかった理由 ${JSON.stringify(reasons)}）` +
        ` 中央値 ${median.toFixed(3)} ms 最大 ${times.at(-1)!.toFixed(3)} ms`
    );
    expect(times.length).toBe(100);
    expect(median).toBeLessThan(5);
    expect(model.mesh.isStrict()).toBe(true);
    expect(model.mesh.audit()).toMatchObject({ bad: [], badMatches: true, indexMatches: true, missingRequired: 0 });
  }, TIMEOUT);
});

/** 網に直接当てる（全部組み直しへ落とさない）。失敗した編集は網を変えない（編集 1 つなので）。 */
function applyLocally(tin: Tin, model: MeshModel, edit: TinEdit) {
  return applyToMesh(model, [edit], tin.yaxisMode === "follow");
}

describe("applyEdits: 帯に触れる編集（スイッチ incrementalBand）", () => {
  it("凸包の頂点の削除・凸包の外への追加・凸包の頂点の移動を、帯の差し替えで局所に当てる", () => {
    const options = mapOptions("fushimijo_maplat", "strict");
    const tin = new Tin({ ...options, incremental: true, incrementalBand: true });
    tin.updateTin();
    const display = new DisplayMesh();
    display.reset(tin.incrementalMesh!);
    // 凸包の頂点（紙の面で x が最大の点）
    const xs = options.points!.map(([forw]) => forw[0]);
    const corner = xs.indexOf(Math.max(...xs));
    const [cornerForw, cornerBakw] = options.points![corner];
    const before = tin.getCompiled();
    const expectBand = (patch: TinPatch) => {
      expect(patch).toMatchObject({ mode: "local", strict_status: "strict", boundaryStale: false });
      // 帯を差し替えたときは、重心と補助頂点の扇形の値が入る
      expect(patch.centroid).toBeDefined();
      expect(patch.verticesParams).toHaveLength(2);
      display.apply(patch);
      const model = tin.incrementalMesh!;
      display.expectSame(model);
      const compiled = tin.getCompiled();
      expect(patch.centroid).toEqual({ forw: compiled.centroid_point![0], bakw: compiled.centroid_point![1] });
      expect(patch.verticesParams).toEqual(compiled.vertices_params);
      expect(compiled.vertices_points).toEqual(model.ring.map((v) => [model.mesh.vertices.get(v)!.forw, model.mesh.vertices.get(v)!.bakw]));
      expect(model.mesh.audit()).toMatchObject({
        bad: [], badMatches: true, indexMatches: true, nonManifoldEdges: 0, boundarySimple: true, missingRequired: 0, forbiddenBoundary: 0
      });
      return compiled;
    };
    // 1. 凸包の頂点を消す
    const removed = expectBand(tin.applyEdits([{ type: "removePoint", id: corner }], 0));
    expect(removed.points).toHaveLength(options.points!.length - 1);
    expect(removed.centroid_point).not.toEqual(before.centroid_point);
    // 2. 同じ位置（今は凸包の外）に、新しい id で足す
    const added = expectBand(tin.applyEdits([{ type: "addPoint", id: 7_000, forw: cornerForw, bakw: cornerBakw }], 1));
    expect(added.points.at(-1)).toEqual([cornerForw, cornerBakw]);
    // 3. 凸包の頂点を、内へ動かす
    const center = added.centroid_point!;
    expectBand(
      tin.applyEdits(
        [{
          type: "movePoint", id: 7_000,
          forw: [cornerForw[0] + (center[0][0] - cornerForw[0]) * 0.05, cornerForw[1] + (center[0][1] - cornerForw[1]) * 0.05],
          bakw: [cornerBakw[0] + (center[1][0] - cornerBakw[0]) * 0.05, cornerBakw[1] + (center[1][1] - cornerBakw[1]) * 0.05]
        }],
        2
      )
    );
    // 書き出した compiled を読み直して、GCP が往復する
    const reader = new Tin();
    reader.setCompiled(JSON.parse(JSON.stringify(tin.getCompiled())));
    for (const [forw, bakw] of tin.getCompiled().points) {
      const out = reader.transform(forw, false) as Position;
      expect(Math.hypot(out[0] - bakw[0], out[1] - bakw[1])).toBeLessThan(1e-6);
    }
    // 清書は、同じ入力を新しい Tin で組んだ結果と同じ
    const expected = rebuilt(options, tin);
    tin.updateTin();
    expect(JSON.stringify(tin.getCompiled())).toBe(JSON.stringify(expected));
  }, TIMEOUT);

  it("乱数の編集（凸包の外・凸包の頂点を含む）: 差分だけで表示用の網を最新にでき、strict を保つ", () => {
    // 奈良町は、スイッチを 3 つとも入れる（全部組み直しへ落ちたときも、局所の操作で組み直す）
    // [地図, スイッチ, 回数, 移動の大きさ（外接矩形に対する割合）]
    const runs: [string, Partial<Options>, number, number][] = [
      ["fushimijo_maplat", {}, 150, 0.02],
      ["tatebayashi_kaei_jokamachi", {}, 150, 0.02],
      ["naramachi_yasui_bunko_core", { incrementalRebuild: true }, 100, 0.002]
    ];
    for (const [name, extra, total, reach] of runs) {
      const options = { ...mapOptions(name, "strict"), ...extra };
      const tin = new Tin({ ...options, incremental: true, incrementalBand: true });
      tin.updateTin();
      const display = new DisplayMesh();
      display.reset(tin.incrementalMesh!);
      const rnd = random(11);
      const counts = { local: 0, band: 0, full: 0 };
      const reasons: Record<string, number> = {};
      let nextPoint = 50_000;
      const times: number[] = [];
      for (let n = 0; n < total; n++) {
        const model = tin.incrementalMesh;
        if (!model) break;
        const inputs = model.inputs();
        const xs = inputs.points.map(([forw]) => forw[0]);
        const ys = inputs.points.map(([forw]) => forw[1]);
        const [minx, maxx, miny, maxy] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
        const at = Math.floor(rnd() * inputs.points.length);
        const [forw, bakw] = inputs.points[at];
        const kind = Math.floor(rnd() * 4);
        let edit: TinEdit;
        if (kind === 0) {
          // 両面を、同じ向きへ少し動かす
          const dx = (rnd() - 0.5) * (maxx - minx) * reach, dy = (rnd() - 0.5) * (maxy - miny) * reach;
          const neighbor = inputs.points[(at + 1) % inputs.points.length];
          const scale = Math.hypot(neighbor[1][0] - bakw[0], neighbor[1][1] - bakw[1]) / (Math.hypot(neighbor[0][0] - forw[0], neighbor[0][1] - forw[1]) || 1);
          edit = { type: "movePoint", id: inputs.pointIds[at], forw: [forw[0] + dx, forw[1] + dy], bakw: [bakw[0] + dx * scale, bakw[1] - dy * scale] };
        } else if (kind === 1) {
          edit = { type: "movePoint", id: inputs.pointIds[at], bakw: [bakw[0] + (rnd() - 0.5) * 8, bakw[1] + (rnd() - 0.5) * 8] };
        } else if (kind === 2) {
          // 外接矩形を 3% 広げた範囲に足す（凸包の外にも落ちる）。地理面は、その場の変換から少しずらす
          const p: Position = [minx - 0.03 * (maxx - minx) + rnd() * 1.06 * (maxx - minx), miny - 0.03 * (maxy - miny) + rnd() * 1.06 * (maxy - miny)];
          const q = tin.transform(p, false, true) as Position | false;
          if (!q) continue;
          edit = { type: "addPoint", id: nextPoint++, forw: p, bakw: [q[0] + (rnd() - 0.5) * 4, q[1] + (rnd() - 0.5) * 4] };
        } else {
          const used = new Set(inputs.edges.flatMap((edge) => edge[2]));
          if (used.has(at) || inputs.points.length < 20) continue;
          edit = { type: "removePoint", id: inputs.pointIds[at] };
        }
        const wasStrict = model.mesh.isStrict();
        const started = performance.now();
        let patch: TinPatch;
        try {
          patch = tin.applyEdits([edit]);
        } catch {
          // 全部組み直しが例外を投げる入力（必須エッジが交差する、など）。網は無くなる
          reasons["例外"] = (reasons["例外"] ?? 0) + 1;
          expect(tin.incrementalMesh).toBeUndefined();
          break;
        }
        if (patch.mode === "local" && patch.centroid) times.push(performance.now() - started);
        if (patch.mode === "local") {
          if (patch.centroid) counts.band++;
          else counts.local++;
          expect(patch.boundaryStale).toBe(!patch.centroid && (patch.boundaryStale as boolean));
          if (wasStrict) expect(patch.strict_status).toBe("strict");
          display.apply(patch);
        } else {
          counts.full++;
          reasons[patch.fallbackReason!] = (reasons[patch.fallbackReason!] ?? 0) + 1;
          if (!tin.incrementalMesh) break;
          display.reset(tin.incrementalMesh);
        }
        const now = tin.incrementalMesh!;
        display.expectSame(now);
        const audit = now.mesh.audit();
        expect(audit, `${name} 編集 ${n}`).toMatchObject({ badMatches: true, indexMatches: true, nonManifoldEdges: 0, missingRequired: 0, forbiddenMatches: true });
        expect(audit.boundarySimple, `${name} 編集 ${n}`).toBe(now.mesh.boundarySimple);
        if (patch.mode === "local" && wasStrict) expect(audit.bad, `${name} 編集 ${n}`).toEqual([]);
      }
      times.sort((a, b) => a - b);
      console.info(
        `[帯] ${name} ${total} 回: 局所（帯は前のまま）${counts.local}・局所（帯を差し替え）${counts.band}・全部組み直し ${counts.full}（理由 ${JSON.stringify(reasons)}）` +
          ` 帯を差し替えた編集の時間の中央値 ${times[Math.floor(times.length / 2)]?.toFixed(2)} ms・最大 ${times.at(-1)?.toFixed(2)} ms`
      );
      expect(counts.band).toBeGreaterThan(name.startsWith("naramachi") ? 0 : 10);
      if (!tin.incrementalMesh) continue;
      // T5: 清書は、同じ入力を新しい Tin で組んだ結果と同じ
      const expected = rebuilt(options, tin);
      tin.updateTin();
      expect(JSON.stringify(tin.getCompiled())).toBe(JSON.stringify(expected));
    }
  }, TIMEOUT * 4);

  it("帯の差し替えが成り立たない編集は、全部組み直しへ落ちる（bandFailed）", () => {
    const options = mapOptions("fushimijo_maplat", "strict");
    const tin = new Tin({ ...options, incremental: true, incrementalBand: true });
    tin.updateTin();
    // 紙の面で x が最小の点を消すと、どの余白でも、新しい帯が strict にならない
    const xs = options.points!.map(([forw]) => forw[0]);
    const corner = xs.indexOf(Math.min(...xs));
    const patch = tin.applyEdits([{ type: "removePoint", id: corner }]);
    expect(patch).toMatchObject({ revision: 1, mode: "full", fallbackReason: "bandFailed", boundaryStale: false });
    const fresh = new Tin({ ...options, points: options.points!.filter((_, i) => i !== corner) });
    fresh.updateTin();
    expect(digest(tin.getCompiled())).toBe(digest(fresh.getCompiled()));
    expect(patch.strict_status).toBe(fresh.strict_status);
  }, TIMEOUT);

  it("スイッチが切れていれば、帯に触れる編集は全部組み直しへ落ちる", () => {
    const options = mapOptions("kaisei_hiroshima_jissoku_sub1", "strict");
    const tin = new Tin({ ...options, incremental: true });
    tin.updateTin();
    const xs = options.points!.map(([forw]) => forw[0]);
    const patch = tin.applyEdits([{ type: "removePoint", id: xs.indexOf(Math.min(...xs)) }]);
    expect(patch).toMatchObject({ mode: "full", fallbackReason: "unsupported" });
    expect(patch.centroid).toBeUndefined();
  }, TIMEOUT);
});

describe("applyEdits: 補完点の付いた対応点の削除・world file 外周の網", () => {
  it("補完点の付いた対応点を消すと、その補完点も消え、差分に補完点の一覧が入る", () => {
    const results: string[] = [];
    for (const name of ["fushimijo_maplat", "miesan_ginza_map", "tatebayashi_kaei_jokamachi", "1932_nobeoka"]) {
      const options = mapOptions(name, "strict");
      const base = new Tin({ ...options, incremental: true, incrementalBand: true });
      base.updateTin();
      const pairs = base.supplementPairs;
      expect(pairs.length).toBeGreaterThan(0);
      // 補完点の理由（凸包の辺の端点）になっている対応点を、1 つずつ試す
      for (const target of new Set(pairs.flatMap(({ edge }) => edge).filter((v): v is number => typeof v === "number"))) {
        const tin = new Tin({ ...options, incremental: true, incrementalBand: true });
        tin.updateTin();
        const display = new DisplayMesh();
        display.reset(tin.incrementalMesh!);
        const patch = tin.applyEdits([{ type: "removePoint", id: target }]);
        results.push(`${name}#${target}:${patch.mode === "local" ? "局所" : patch.fallbackReason}`);
        if (patch.mode !== "local") continue;
        const depending = pairs.filter(({ edge, anchor }) => edge.includes(target) || anchor === target).length;
        expect(patch.supplementPairs).toHaveLength(pairs.length - depending);
        expect(patch).toMatchObject({ strict_status: "strict", boundaryStale: false });
        expect(patch.centroid).toBeDefined();
        display.apply(patch);
        display.expectSame(tin.incrementalMesh!);
        const compiled = tin.getCompiled();
        // 補完点の一覧は、差分・書き出し・網で同じ（番号は、消した後の並びで振り直す）
        expect(compiled.supplementPairs ?? []).toEqual(patch.supplementPairs!.map(({ node, kind, edge, anchor }) => ({
          node, kind, edge, ...(anchor === undefined ? {} : { anchor })
        })));
        for (const pair of patch.supplementPairs!) expect(compiled.edgeNodes![pair.node]).toEqual([pair.forw, pair.bakw]);
        expect(tin.incrementalMesh!.mesh.audit()).toMatchObject({ bad: [], badMatches: true, indexMatches: true, boundarySimple: true });
        // 書き出した compiled を読み直せる
        const reader = new Tin({ incremental: true });
        expect(reader.restoreMesh(JSON.parse(JSON.stringify(compiled)))).toEqual({ ok: true });
      }
    }
    console.info(`[補完点] 補完点の付いた対応点の削除: ${results.join(" ")}`);
    expect(results.filter((r) => r.endsWith("局所")).length).toBeGreaterThan(0);
  }, TIMEOUT * 2);

  it("world file 外周の網: 内側の編集を局所に当てる。帯に触れる編集は全部組み直しへ落ちる", () => {
    const options = mapOptions("1932_nobeoka", "strict");
    const pts = options.points!;
    const mean = (side: 0 | 1, axis: number) => pts.reduce((sum, pair) => sum + pair[side][axis], 0) / pts.length;
    const [xm, ym] = [mean(0, 0), mean(0, 1)];
    const rows = pts.map(([[x, y], crs]) => [x - xm, y - ym, ...crs]);
    const dot = (a: number, b: number) => rows.reduce((sum, row) => sum + row[a] * row[b], 0);
    const det = dot(0, 0) * dot(1, 1) - dot(0, 1) ** 2;
    const fit = (axis: number) => {
      const x = (dot(1, 1) * dot(0, axis + 2) - dot(0, 1) * dot(1, axis + 2)) / det;
      const y = (dot(0, 0) * dot(1, axis + 2) - dot(0, 1) * dot(0, axis + 2)) / det;
      return [x, y, mean(1, axis) + x * (0.5 - xm) + y * (0.5 - ym)];
    };
    const [xScale, xSkew, xOrigin] = fit(0);
    const [ySkew, yScale, yOrigin] = fit(1);
    const world: Options = { ...options, outerTransform: "worldFile", worldFile: { xScale, xSkew, xOrigin, ySkew, yScale, yOrigin } };
    const tin = new Tin({ ...world, incremental: true, incrementalBand: true });
    tin.updateTin();
    expect((tin.getCompiled() as { outerTransform?: string }).outerTransform).toBe("worldFile");
    const model = tin.incrementalMesh!;
    const display = new DisplayMesh();
    display.reset(model);
    const rnd = random(77);
    const counts = { local: 0, skipped: 0 };
    let nextPoint = 80_000;
    for (let n = 0; n < 120; n++) {
      const inputs = model.inputs();
      const at = Math.floor(rnd() * inputs.points.length);
      const [forw, bakw] = inputs.points[at];
      const kind = Math.floor(rnd() * 3);
      let edit: TinEdit;
      if (kind === 0) edit = { type: "movePoint", id: inputs.pointIds[at], bakw: [bakw[0] + (rnd() - 0.5) * 6, bakw[1] + (rnd() - 0.5) * 6] };
      else if (kind === 1) {
        const dx = (rnd() - 0.5) * 6, dy = (rnd() - 0.5) * 6;
        edit = { type: "movePoint", id: inputs.pointIds[at], forw: [forw[0] + dx, forw[1] + dy], bakw: [bakw[0] + dx * xScale, bakw[1] + dy * yScale] };
      } else {
        const p: Position = [forw[0] + 15 + rnd() * 10, forw[1] + 15 + rnd() * 10];
        const q = tin.transform(p, false, true) as Position | false;
        if (!q) continue;
        edit = { type: "addPoint", id: nextPoint++, forw: p, bakw: [q[0] + (rnd() - 0.5) * 2, q[1] + (rnd() - 0.5) * 2] };
      }
      // 全部組み直しへ落ちると網が作り直されるので、ここでは網に直接当てて、局所で済むものだけを重ねる
      const applied = applyToMesh(model, [edit], false);
      if (!applied.ok) {
        counts.skipped++;
        continue;
      }
      counts.local++;
      display.apply({ revision: 0, mode: "local", boundaryStale: true, ...applied.patch });
      display.expectSame(model);
      expect(applied.patch.strict_status).toBe("strict");
      expect(model.mesh.audit()).toMatchObject({ bad: [], badMatches: true, indexMatches: true, nonManifoldEdges: 0, boundarySimple: true });
    }
    console.info(`[world file] 延岡 120 回: 局所 ${counts.local}・局所で済まなかった ${counts.skipped}`);
    expect(counts.local).toBeGreaterThan(60);
    // 書き出した compiled は world file 外周のままで、Transform で読み直すと、対応点が往復する
    const compiled = model.toCompiled();
    expect(compiled).toMatchObject({ outerTransform: "worldFile", strict_status: "strict" });
    const reader = new Tin();
    reader.setCompiled(JSON.parse(JSON.stringify(compiled)));
    for (const [forw, bakw] of compiled.points) {
      const out = reader.transform(forw, false) as Position;
      expect(Math.hypot(out[0] - bakw[0], out[1] - bakw[1])).toBeLessThan(1e-6);
    }
    // applyEdits でも局所で済む。帯に触れる編集（外接矩形の端の点を消す）は、全部組み直しへ落ちる
    const fresh = new Tin({ ...world, incremental: true, incrementalBand: true });
    fresh.updateTin();
    const inner = localEdit(fresh);
    expect(fresh.applyEdits([inner])).toMatchObject({ mode: "local", strict_status: "strict", boundaryStale: true });
    const xs = pts.map(([forw]) => forw[0]);
    expect(fresh.applyEdits([{ type: "removePoint", id: xs.indexOf(Math.max(...xs)) }])).toMatchObject({
      mode: "full", fallbackReason: "unsupported"
    });
    expect((fresh.getCompiled() as { outerTransform?: string }).outerTransform).toBeDefined();
  }, TIMEOUT * 2);
});

/** 帯を更新しなくてよい内側の点を、地理面で少し動かす編集。 */
function localEdit(tin: Tin): TinEdit {
  const model = tin.incrementalMesh!;
  const inputs = model.inputs();
  const at = model.gcps.findIndex((vertex) => model.band()?.keeps(model, [{ vertex, gcp: true, counted: true }]));
  const [, bakw] = inputs.points[at];
  return { type: "movePoint", id: inputs.pointIds[at], bakw: [bakw[0] + 0.5, bakw[1] + 0.5] };
}
