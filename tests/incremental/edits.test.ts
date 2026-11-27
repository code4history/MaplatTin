import { describe, expect, it } from "vitest";
import type { Position } from "geojson";
import { incircle } from "robust-predicates";
import {
  EDGE_HULL,
  EDGE_PROTECT,
  EDGE_REQUIRED,
  insertEdge,
  insertPoint,
  movePoint,
  removeEdge,
  removePoint,
  replaceEdgeNodes,
  Tin,
  type EditResult,
  type IncrementalMesh,
  type MeshModel
} from "../../src/index.ts";
import { locate } from "../../src/incremental/edits.ts";
import { findIntersectionsUpTo } from "../../src/kinks.ts";
import { digest, mapOptions } from "./fixtures.ts";
import { REAL_DATA_TIMEOUT_MS } from "../timeouts.ts";

// MaplatTin#100 の第 1 段 a の受け入れ条件の土台。
// T1: 内側の編集を乱数で 200 回重ねる。清書（全部組み直し）を 1 回も挟まず、毎回、網の全部を数え直す。
// T3: 局所の判定（S1 と S2）を、今の交差の数え上げ（findIntersectionsUpTo）と突き合わせる。
// T4: 局所で済まない編集は失敗を返し、網は変わらない（その後も編集できる。全部組み直しの結果を取り込み直せる）。
//
// 編集の種類: 対応点の追加・削除・移動（必須エッジの端点・地理面だけの移動を含む）、必須エッジの追加・削除、
// 折れ点の差し替え。帯（補助頂点・重心）を更新しなくてよい条件（§6.3）を満たさない編集は "unsupported"。

const TIMEOUT = REAL_DATA_TIMEOUT_MS * 6;

function build(name: string): MeshModel {
  const tin = new Tin({ ...mapOptions(name, "strict"), incremental: true });
  tin.updateTin();
  return tin.incrementalMesh!;
}

/** 乱数（線形合同法。種を固定して再現できるようにする）。 */
function random(seed: number): () => number {
  let state = seed >>> 0;
  return () => (state = (state * 1664525 + 1013904223) >>> 0) / 2 ** 32;
}

/** 網の三角形を、両面の座標の列にする（今の交差の数え上げに掛ける形）。 */
function rings(mesh: IncrementalMesh, plane: "forw" | "bakw"): Position[][] {
  return [...mesh.triangles.values()].map(([a, b, c]) => {
    const p = [a, b, c].map((v) => mesh.vertices.get(v)![plane]);
    return [...p, p[0]];
  });
}

const sweepKinks = (mesh: IncrementalMesh): number =>
  findIntersectionsUpTo(rings(mesh, "forw"), 1).length + findIntersectionsUpTo(rings(mesh, "bakw"), 1).length;

/** 紙の面の点を、その点を含む三角形で地理面へ写す。 */
function transform(mesh: IncrementalMesh, point: Position): Position | undefined {
  const found = locate(mesh, point, mesh.triangles.keys().next().value as number);
  if (!found) return undefined;
  const [A, B, C] = mesh.triangles.get(found.triangle)!.map((v) => mesh.vertices.get(v)!);
  const d = (B.forw[0] - A.forw[0]) * (C.forw[1] - A.forw[1]) - (C.forw[0] - A.forw[0]) * (B.forw[1] - A.forw[1]);
  const u = ((point[0] - A.forw[0]) * (C.forw[1] - A.forw[1]) - (C.forw[0] - A.forw[0]) * (point[1] - A.forw[1])) / d;
  const w = ((B.forw[0] - A.forw[0]) * (point[1] - A.forw[1]) - (point[0] - A.forw[0]) * (B.forw[1] - A.forw[1])) / d;
  return [
    A.bakw[0] + u * (B.bakw[0] - A.bakw[0]) + w * (C.bakw[0] - A.bakw[0]),
    A.bakw[1] + u * (B.bakw[1] - A.bakw[1]) + w * (C.bakw[1] - A.bakw[1])
  ];
}

/** 制約でなく、厳密な外接円の判定で反転すべき辺の数（劣化の指標）。 */
function nonDelaunayEdges(mesh: IncrementalMesh): number {
  let count = 0;
  for (const [key, owners] of mesh.byEdge) {
    if (owners.length !== 2) continue;
    if ((mesh.edgeFlags.get(key) ?? 0) & (EDGE_REQUIRED | EDGE_HULL | EDGE_PROTECT)) continue;
    const tri = mesh.positive(owners[0]);
    if (!tri) continue;
    const opposite = mesh.triangles.get(owners[1])!.find((v) => !tri.includes(v))!;
    const [a, b, c, d] = [...tri, opposite].map((v) => mesh.vertices.get(v)!.forw);
    // 紙の面で正の向きの三角形では、外接円の内側の点で incircle が負になる
    if (incircle(a[0], a[1], b[0], b[1], c[0], c[1], d[0], d[1]) < 0) count++;
  }
  return count;
}

/** 網の全部を数え直して、不変条件 S を確かめる。 */
function expectInvariant(model: MeshModel, initial: { forwArea: number; forbidden: number }, label: string) {
  const { mesh } = model;
  const audit = mesh.audit();
  expect(audit.bad, label).toEqual([]);
  expect(audit, label).toMatchObject({
    badMatches: true,
    indexMatches: true,
    nonManifoldEdges: 0,
    boundarySimple: true,
    missingRequired: 0,
    forbiddenMatches: true
  });
  expect(mesh.isStrict(), label).toBe(true);
  // S4: 禁止制約の三角形が増えていない
  expect(audit.forbiddenBoundary + audit.forbiddenEdge, label).toBeLessThanOrEqual(initial.forbidden);
  // 紙の面を重なりなく覆っている（外周を変えていないので、面積の和が変わらない）
  expect(Math.abs(audit.forwArea - initial.forwArea) / initial.forwArea, label).toBeLessThan(1e-9);
  // 点が網から消えていない
  for (const vertex of model.gcps) expect(mesh.byVertex.get(vertex)!.size, label).toBeGreaterThan(0);
  // S3: 必須エッジの全部の区間が、網の辺にあり、required の印が付いている
  for (const edge of model.edges) {
    const chain = [edge.start, ...edge.nodes, edge.end];
    for (let i = 0; i + 1 < chain.length; i++) {
      expect(mesh.hasEdge(chain[i], chain[i + 1]), label).toBe(true);
      expect(mesh.flagsOf(chain[i], chain[i + 1]) & EDGE_REQUIRED, label).toBe(EDGE_REQUIRED);
    }
    edge.nodes.forEach((vertex, order) =>
      expect(mesh.vertices.get(vertex)!.ref, label).toEqual({ kind: "edgeNode", edge: edge.id, order })
    );
  }
  return audit;
}

interface Summary {
  tried: Record<string, number>;
  done: Record<string, number>;
  failed: Record<string, number>;
  failedBy: Record<string, Record<string, number>>;
  flips: { overlap: number; forbidden: number; polish: number };
  grown: number;
  times: number[];
  samples: { edit: number; nonDelaunay: number; protect: number; triangles: number }[];
}

/** 乱数の内側の編集を重ねる。清書は挟まない。 */
function runEdits(model: MeshModel, edits: number, seed: number, sweepEvery: number): Summary {
  const { mesh } = model;
  const rnd = random(seed);
  const first = mesh.audit();
  const initial = { forwArea: first.forwArea, forbidden: first.forbiddenBoundary + first.forbiddenEdge };
  const summary: Summary = {
    tried: {}, done: {}, failed: {}, failedBy: {}, flips: { overlap: 0, forbidden: 0, polish: 0 }, grown: 0, times: [], samples: []
  };
  const xs = model.gcps.map((v) => mesh.vertices.get(v)!.forw[0]);
  const ys = model.gcps.map((v) => mesh.vertices.get(v)!.forw[1]);
  const box = { minx: Math.min(...xs), maxx: Math.max(...xs), miny: Math.min(...ys), maxy: Math.max(...ys) };
  const span = Math.hypot(box.maxx - box.minx, box.maxy - box.miny);
  let nextId = 1_000_000;
  let nextEdge = 2_000_000;
  const added: number[] = [];
  const position = (vertex: number) => mesh.vertices.get(vertex)!;
  const idOf = (vertex: number) => (position(vertex).ref as { id: number }).id;
  /** 対応点の、網の上での隣の対応点 */
  const neighbors = (vertex: number): number[] => {
    const out = new Set<number>();
    for (const t of mesh.byVertex.get(vertex)!) {
      for (const v of mesh.triangles.get(t)!) if (v !== vertex && position(v).ref.kind === "gcp") out.add(v);
    }
    return [...out];
  };
  /** 折れ点を 1 つ（線分の中ほどから、少し横へずらした位置） */
  const bend = (a: Position, b: Position, t: number, offset: number): Position => [
    a[0] + (b[0] - a[0]) * t - (b[1] - a[1]) * offset,
    a[1] + (b[1] - a[1]) * t + (b[0] - a[0]) * offset
  ];
  const nodesFor = (start: number, end: number): [Position[], Position[]] => {
    const kind = Math.floor(rnd() * 4);
    if (kind === 0) return [[], []];
    const forw = bend(position(start).forw, position(end).forw, 0.3 + rnd() * 0.4, (rnd() - 0.5) * 0.2);
    const bakw = bend(position(start).bakw, position(end).bakw, 0.3 + rnd() * 0.4, (rnd() - 0.5) * 0.2);
    // 片方の面だけの折れ点・両面の折れ点
    return kind === 1 ? [[forw], []] : kind === 2 ? [[], [bakw]] : [[forw], [bakw]];
  };
  let vertices = model.gcps.length;
  const pick = () => {
    const vertex = model.gcps[Math.floor(rnd() * model.gcps.length)];
    return (mesh.vertices.get(vertex)!.ref as { id: number }).id;
  };
  const sample = (edit: number) => {
    let protect = 0;
    for (const flags of mesh.edgeFlags.values()) if (flags & EDGE_PROTECT) protect++;
    summary.samples.push({ edit, nonDelaunay: nonDelaunayEdges(mesh), protect, triangles: mesh.triangles.size });
  };
  sample(0);
  for (let n = 1; n <= edits; n++) {
    const kind = (["move", "move", "moveBakw", "insert", "remove", "addEdge", "removeEdge", "replaceNodes"] as const)[
      Math.floor(rnd() * 8)
    ];
    let result: EditResult;
    const before = mesh.triangles.size;
    const start = performance.now();
    if (kind === "move") {
      // 紙の面で、対角線の 0.1〜1% 動かす
      const id = pick();
      const { forw } = mesh.vertices.get(model.pointVertex.get(id)!)!;
      const distance = span * (0.001 + rnd() * 0.009);
      const angle = rnd() * 2 * Math.PI;
      result = movePoint(model, id, { forw: [forw[0] + distance * Math.cos(angle), forw[1] + distance * Math.sin(angle)] });
    } else if (kind === "moveBakw") {
      const id = pick();
      const { bakw } = mesh.vertices.get(model.pointVertex.get(id)!)!;
      result = movePoint(model, id, { bakw: [bakw[0] + (rnd() - 0.5) * 10, bakw[1] + (rnd() - 0.5) * 10] });
    } else if (kind === "insert") {
      const forw: Position = [box.minx + rnd() * (box.maxx - box.minx), box.miny + rnd() * (box.maxy - box.miny)];
      const bakw = transform(mesh, forw);
      if (!bakw) continue;
      result = insertPoint(model, nextId, forw, [bakw[0] + (rnd() - 0.5) * 6, bakw[1] + (rnd() - 0.5) * 6]);
      if (result.ok) added.push(nextId);
      nextId++;
    } else if (kind === "addEdge") {
      // 隣の対応点（辺が既にある）か、隣の隣の対応点（三角形を横切る）へ、必須エッジを足す
      const start = model.gcps[Math.floor(rnd() * model.gcps.length)];
      const near = neighbors(start);
      if (near.length === 0) continue;
      let end = near[Math.floor(rnd() * near.length)];
      if (rnd() < 0.5) {
        const far = neighbors(end).filter((v) => v !== start);
        if (far.length > 0) end = far[Math.floor(rnd() * far.length)];
      }
      if (mesh.flagsOf(start, end) & EDGE_REQUIRED) continue;
      const [forwNodes, bakwNodes] = nodesFor(start, end);
      result = insertEdge(model, nextEdge++, idOf(start), idOf(end), forwNodes, bakwNodes);
    } else if (kind === "removeEdge") {
      if (model.edges.length === 0) continue;
      result = removeEdge(model, model.edges[Math.floor(rnd() * model.edges.length)].id);
    } else if (kind === "replaceNodes") {
      if (model.edges.length === 0) continue;
      const edge = model.edges[Math.floor(rnd() * model.edges.length)];
      const [forwNodes, bakwNodes] = nodesFor(edge.start, edge.end);
      result = replaceEdgeNodes(model, edge.id, forwNodes, bakwNodes);
    } else {
      // 足した点があれば、半分はそれを消す（もとの点は、必須エッジの端点が多く、消せないことが多い）
      const id = added.length > 0 && rnd() < 0.5 ? added.splice(Math.floor(rnd() * added.length), 1)[0] : pick();
      result = removePoint(model, id);
    }
    const elapsed = performance.now() - start;
    summary.tried[kind] = (summary.tried[kind] ?? 0) + 1;
    const label = `編集 ${n}（${kind}）`;
    if (result.ok) {
      summary.done[kind] = (summary.done[kind] ?? 0) + 1;
      summary.grown += result.grown;
      summary.times.push(elapsed);
      summary.flips.overlap += result.flips.overlap;
      summary.flips.forbidden += result.flips.forbidden;
      summary.flips.polish += result.flips.polish;
      if (kind === "insert") vertices++;
      if (kind === "remove") vertices--;
      // 差分の帳簿: 消えた三角形と増えた三角形の数が、頂点の増減と合う
      // （必須エッジの編集は、中継点が増減するので、頂点の差分から数える）
      const delta = 2 * (result.vertices.added.length - result.vertices.removed.length);
      if (kind === "insert") expect(delta, label).toBe(2);
      if (kind === "remove") expect(delta, label).toBe(-2);
      if (kind === "move" || kind === "moveBakw") expect(result.vertices.moved.length, label).toBe(1);
      expect(result.added.length - result.removed.length, label).toBe(delta);
      expect(mesh.triangles.size - before, label).toBe(delta);
      for (const id of result.added) expect(mesh.triangles.has(id), label).toBe(true);
      for (const id of result.removed) expect(mesh.triangles.has(id), label).toBe(false);
    } else {
      summary.failed[result.reason] = (summary.failed[result.reason] ?? 0) + 1;
      (summary.failedBy[kind] ??= {})[result.reason] = (summary.failedBy[kind]?.[result.reason] ?? 0) + 1;
      // 失敗した編集は、網を変えない
      expect(mesh.triangles.size, label).toBe(before);
    }
    expect(model.gcps.length, label).toBe(vertices);
    expectInvariant(model, initial, label);
    if (n % 20 === 0) sample(n);
    // T3: 局所の判定が strict と言う網で、今の交差の数え上げも 0 件
    if (n % sweepEvery === 0) expect(sweepKinks(mesh), label).toBe(0);
  }
  return summary;
}

function report(name: string, summary: Summary) {
  const sorted = [...summary.times].sort((a, b) => a - b);
  console.info(
    `[T1] ${name}: 試行 ${JSON.stringify(summary.tried)} 成功 ${JSON.stringify(summary.done)} 失敗 ${JSON.stringify(summary.failed)}` +
      `\n  種類ごとの失敗 ${JSON.stringify(summary.failedBy)} 反転 ${JSON.stringify(summary.flips)}` +
      ` 広げた回数の合計 ${summary.grown} 時間の中央値 ${sorted[Math.floor(sorted.length / 2)]?.toFixed(3)} ms 最大 ${sorted.at(-1)?.toFixed(3)} ms\n` +
      summary.samples.map((s) => `  編集 ${s.edit}: Delaunay でない辺 ${s.nonDelaunay} protect ${s.protect} 三角形 ${s.triangles}`).join("\n")
  );
}

describe("T1: 内側の編集を 200 回重ねる（清書なし・毎回、全部を数え直す）", () => {
  for (const [name, seed] of [
    ["naramachi_yasui_bunko_core", 20261127],
    ["fushimijo_maplat", 100],
    ["tatebayashi_castle_akimoto", 7]
  ] as const) {
    it(name, () => {
      const model = build(name);
      const summary = runEdits(model, 200, seed, 50);
      report(name, summary);
      const done = Object.values(summary.done).reduce((a, b) => a + b, 0);
      // 編集の大半が局所で済んでいること（済まない編集は、全部組み直しへ落とす。第 2 週）
      expect(done).toBeGreaterThan(100);
      for (const kind of ["move", "moveBakw", "insert", "remove", "addEdge", "removeEdge", "replaceNodes"]) {
        expect(summary.done[kind] ?? 0, kind).toBeGreaterThan(0);
      }
      // 編集を重ねた網を書き出して、読み直せる（番号の振り直し）
      const compiled = model.toCompiled();
      expect(compiled.strict_status).toBe("strict");
      expect(compiled.points.length).toBe(model.gcps.length);
      const reader = new Tin();
      reader.setCompiled(compiled);
      // GCP の往復: 対応点は三角形の頂点なので、紙 → 地理が一致する
      let worst = 0;
      for (const [forw, bakw] of compiled.points) {
        const out = reader.transform(forw, false) as Position;
        worst = Math.max(worst, Math.hypot(out[0] - bakw[0], out[1] - bakw[1]));
      }
      expect(worst).toBeLessThan(1e-6);
      // 同じ入力を全部組み直す。必須エッジの中継点（両面の折れ線の突き合わせ）は、1 ビットも違わない
      const inputs = model.inputs();
      const full = new Tin({ ...mapOptions(name, "strict"), points: inputs.points, edges: inputs.edges });
      let fullStatus: string;
      try {
        full.updateTin();
        fullStatus = full.strict_status!;
        const nodes = model.edges.reduce((sum, edge) => sum + edge.nodes.length, 0);
        expect(compiled.edgeNodes!.slice(0, nodes)).toEqual(full.getCompiled().edgeNodes!.slice(0, nodes));
      } catch (error) {
        fullStatus = `例外（${error instanceof Error ? error.message : String(error)}）`;
      }
      // E1: 局所更新の網は strict。全部組み直しのほうが悪い場合は、記録だけする
      console.info(`[T2] ${name}: 200 回の後、局所更新は strict・同じ入力の全部組み直しは ${fullStatus}`);
    }, TIMEOUT);
  }
});

describe("T3: 判定基準の突き合わせ", () => {
  it("向きが逆の三角形を入れると、局所の判定も、今の交差の数え上げも、strict でないと言う", () => {
    const model = build("fushimijo_maplat");
    const { mesh } = model;
    expect(mesh.isStrict()).toBe(true);
    expect(sweepKinks(mesh)).toBe(0);
    // 帯に触れない対応点を 1 つ、地理面で、星の外へ飛ばす（判定を通さずに座標だけ変える）
    const vertex = model.gcps.find((v) =>
      [...mesh.byVertex.get(v)!].every((t) => mesh.triangles.get(t)!.every((u) => mesh.vertices.get(u)!.ref.kind === "gcp"))
    )!;
    const { forw, bakw } = mesh.vertices.get(vertex)!;
    mesh.relocate(vertex, forw, [bakw[0] + 5000, bakw[1] + 5000]);
    expect(mesh.bad.size).toBeGreaterThan(0);
    expect(mesh.isStrict()).toBe(false);
    expect(mesh.audit().badMatches).toBe(true);
    expect(sweepKinks(mesh)).toBeGreaterThan(0);
    // 編集した網は、strict_error として書き出す
    expect(model.toCompiled().strict_status).toBe("strict_error");
    // 戻すと、strict に戻る
    mesh.relocate(vertex, forw, bakw);
    expect(mesh.isStrict()).toBe(true);
    expect(sweepKinks(mesh)).toBe(0);
  }, TIMEOUT);

  it("奈良町の採用済みの網の、面積が閾値未満の三角形は ok（S1 に面積の閾値を入れない）", () => {
    const model = build("naramachi_yasui_bunko_core");
    const { mesh } = model;
    let thin = 0;
    for (const [a, b, c] of mesh.triangles.values()) {
      if (mesh.ok(a, b, c) && !mesh.okNew(a, b, c)) thin++;
    }
    expect(thin).toBe(1);
    expect(mesh.bad.size).toBe(0);
    expect(sweepKinks(mesh)).toBe(0);
    // 採用済みの strict の網には、禁止制約の違反が無い（設計書 §9.5 (a)。診断の 30 は探索の時点の両面の合計）
    expect([mesh.forbiddenBoundary, mesh.forbiddenEdge]).toEqual([0, 0]);
  }, TIMEOUT);

  it("地理面だけの移動で、向きが逆になる位置へは動かせない（接続を変えて救えなければ失敗）", () => {
    const model = build("fushimijo_maplat");
    const { mesh } = model;
    const vertex = model.gcps.find((v) =>
      [...mesh.byVertex.get(v)!].every((t) => mesh.triangles.get(t)!.every((u) => mesh.vertices.get(u)!.ref.kind === "gcp"))
    )!;
    const id = (mesh.vertices.get(vertex)!.ref as { id: number }).id;
    const before = digest(model.toCompiled());
    const { bakw } = mesh.vertices.get(vertex)!;
    const result = movePoint(model, id, { bakw: [bakw[0] + 5000, bakw[1] + 5000] });
    expect(result.ok).toBe(false);
    expect(mesh.isStrict()).toBe(true);
    expect(digest(model.toCompiled())).toBe(before);
  }, TIMEOUT);
});

describe("T4: 落ちる経路", () => {
  it("局所で済まない編集は失敗を返し、網は変わらない。その後も編集でき、全部組み直しの結果を取り込み直せる", () => {
    const options = mapOptions("naramachi_yasui_bunko_core", "strict");
    const tin = new Tin({ ...options, incremental: true });
    tin.updateTin();
    const model = tin.incrementalMesh!;
    const { mesh } = model;
    const before = digest(model.toCompiled());
    const revision = mesh.revision;
    const vertexCount = mesh.vertices.size;
    // 対応点を、他の三角形と必須エッジをまたいで、紙の面で大きく動かす
    const reasons = new Map<string, number>();
    const failures: { id: number; to: Position; reason: string }[] = [];
    for (let id = 0; id < 60; id++) {
      const { forw } = mesh.vertices.get(model.pointVertex.get(id)!)!;
      const to: Position = [forw[0] + 1500, forw[1] + 900];
      const result = movePoint(model, id, { forw: to });
      // 60 点とも、局所では済まない
      expect(result.ok).toBe(false);
      if (result.ok) continue;
      reasons.set(result.reason, (reasons.get(result.reason) ?? 0) + 1);
      failures.push({ id, to, reason: result.reason });
    }
    console.info(`[T4] 奈良町で 60 点を大きく動かした: 失敗の理由 ${JSON.stringify([...reasons])}`);
    expect(insertPoint(model, 0, [10, 10], [0, 0])).toEqual({ ok: false, reason: "idInUse" });
    expect(removePoint(model, 9_999_999)).toEqual({ ok: false, reason: "unknownPoint" });
    // 失敗した編集は、網を 1 ビットも変えない
    expect(mesh.revision).toBe(revision);
    expect(mesh.vertices.size).toBe(vertexCount);
    expect(digest(model.toCompiled())).toBe(before);
    expect(mesh.audit()).toMatchObject({ bad: [], badMatches: true, indexMatches: true, nonManifoldEdges: 0, missingRequired: 0 });

    // 失敗の後も、編集できる
    const small = failures[0];
    const origin = mesh.vertices.get(model.pointVertex.get(small.id)!)!.bakw;
    expect(movePoint(model, small.id, { bakw: [origin[0] + 0.5, origin[1] + 0.5] }).ok).toBe(true);
    expect(mesh.isStrict()).toBe(true);

    // 落ちた先: 同じ編集を入力に入れて、全部組み直す。結果（strict_error・例外を含む）を、そのまま返せる
    const rebuild = (failure: { id: number; to: Position }) => {
      const points = options.points!.map(([forw, bakw], i) => (i === failure.id ? [failure.to, bakw] : [forw, bakw]));
      tin.setPoints(points as NonNullable<typeof options.points>);
      expect(tin.incrementalMesh).toBeUndefined();
      tin.updateTin();
    };
    // (1) 必須エッジが交差する入力は、今の updateTin() が例外を投げる。網は持たない
    const crossing = failures.find((failure) => failure.reason === "constraint")!;
    expect(() => rebuild(crossing)).toThrow(/constrained edge/);
    expect(tin.incrementalMesh).toBeUndefined();
    // (2) 組み直せる入力は、結果を取り込み直す
    const others = failures.filter((failure) => failure.reason !== "constraint" && failure.reason !== "unsupported");
    expect(others.length).toBeGreaterThan(0);
    let reimported = 0;
    for (const failure of others.slice(0, 3)) {
      try {
        rebuild(failure);
      } catch {
        continue;
      }
      const rebuilt = tin.incrementalMesh;
      if (tin.strict_status === "loose") {
        expect(rebuilt).toBeUndefined();
        continue;
      }
      expect(rebuilt).toBeDefined();
      expect(rebuilt).not.toBe(model);
      expect(JSON.stringify(rebuilt!.toCompiled())).toBe(JSON.stringify(tin.getCompiled()));
      expect(rebuilt!.mesh.isStrict()).toBe(tin.strict_status === "strict");
      expect(rebuilt!.mesh.audit().badMatches).toBe(true);
      console.info(`[T4] 点 ${failure.id}（局所の失敗の理由 ${failure.reason}）を全部組み直した: ${tin.strict_status}`);
      reimported++;
    }
    expect(reimported).toBeGreaterThan(0);
  }, TIMEOUT);

  it("失敗した差し替えは、網を 1 ビットも変えない", () => {
    const model = build("fushimijo_maplat");
    const { mesh } = model;
    const before = JSON.stringify(model.toCompiled());
    const ids = [...mesh.triangles.keys()];
    // 三角形が 1 つも無い範囲
    expect(mesh.replace(new Set())).toEqual({ ok: false, reason: "notDisk" });
    // 網の 20% を超える範囲
    expect(mesh.replace(new Set(ids))).toEqual({ ok: false, reason: "tooLarge" });
    // 輪の頂点は動かせない
    const [a] = mesh.triangles.get(ids[0])!;
    const position = mesh.vertices.get(a)!;
    expect(
      mesh.replace(new Set([ids[0]]), { move: new Map([[a, { forw: position.forw, bakw: position.bakw }]]) })
    ).toEqual({ ok: false, reason: "notDisk" });
    expect(mesh.revision).toBe(0);
    expect(JSON.stringify(model.toCompiled())).toBe(before);
    // 編集なしの差し替え（星を組み直すだけ）は成り立ち、strict のまま
    const vertex = model.gcps.find((v) =>
      [...mesh.byVertex.get(v)!].every((t) => mesh.triangles.get(t)!.every((u) => mesh.vertices.get(u)!.ref.kind === "gcp"))
    )!;
    const star = mesh.star(vertex);
    const result = mesh.replace(star);
    expect(result.ok).toBe(true);
    expect(mesh.triangles.size).toBe(ids.length);
    expect(mesh.isStrict()).toBe(true);
    expect(mesh.audit()).toMatchObject({ bad: [], badMatches: true, indexMatches: true, nonManifoldEdges: 0 });
    // 円板でない範囲（離れた 2 つの三角形・穴のある範囲）も、固定する辺の内側だけを組み直す
    const now = [...mesh.triangles.keys()];
    expect(mesh.replace(new Set([now[0], now[now.length - 1]])).ok).toBe(true);
    const ringOnly = mesh.grow(mesh.star(vertex));
    for (const t of mesh.star(vertex)) ringOnly.delete(t);
    const area = mesh.audit().forwArea;
    expect(mesh.replace(ringOnly).ok).toBe(true);
    expect(mesh.triangles.size).toBe(ids.length);
    expect(mesh.isStrict()).toBe(true);
    const after = mesh.audit();
    expect(after).toMatchObject({ bad: [], badMatches: true, indexMatches: true, nonManifoldEdges: 0 });
    expect(Math.abs(after.forwArea - area) / area).toBeLessThan(1e-12);
  }, TIMEOUT);
});

describe("網は、呼び出し側の座標の配列を持ち続けない（#103 レビュー M-1 ほか）", () => {
  const inner = (model: MeshModel, v: number) =>
    [...model.mesh.byVertex.get(v)!].every((t) =>
      model.mesh.triangles.get(t)!.every((u) => model.mesh.vertices.get(u)!.ref.kind === "gcp")
    );

  it("取り込んだ後に、入力の配列・書き出した compiled を書き換えても、網は変わらない", () => {
    const options = mapOptions("fushimijo_maplat", "strict");
    const points = options.points!.map(([forw, bakw]) => [[...forw], [...bakw]]) as NonNullable<typeof options.points>;
    const tin = new Tin({ ...options, points, incremental: true });
    tin.updateTin();
    const model = tin.incrementalMesh!;
    const { mesh } = model;
    const vertex = mesh.vertices.get(model.gcps[100])!;
    expect(vertex.forw).not.toBe(points[100][0]);
    expect(vertex.bakw).not.toBe(points[100][1]);
    const before = JSON.stringify(model.toCompiled());
    // 呼び出し側が、自分の配列をその場で書き換える（setPoints を呼ばない）
    points[100][1][0] += 5000;
    points[100][1][1] += 5000;
    // 書き出した compiled・入力を書き換える
    const compiled = model.toCompiled();
    compiled.points[100][0][0] += 123;
    compiled.centroid_point![0][0] += 123;
    compiled.vertices_points[0][1][1] += 123;
    model.inputs().points[50][1][0] += 123;
    expect(mesh.isStrict()).toBe(true);
    expect(mesh.audit().bad).toEqual([]);
    expect(JSON.stringify(model.toCompiled())).toBe(before);
  }, TIMEOUT);

  it("編集に渡した配列を後で書き換えても、網は変わらない。失敗した追加は、頂点の採番を進めない", () => {
    const model = build("fushimijo_maplat");
    const { mesh } = model;
    const vertex = model.gcps.find((v) => inner(model, v) && model.band()!.keeps(model, [{ vertex: v, gcp: true, counted: true }]))!;
    const id = (mesh.vertices.get(vertex)!.ref as { id: number }).id;
    const { forw, bakw } = mesh.vertices.get(vertex)!;
    const to: Position = [forw[0] + 0.5, forw[1] + 0.5];
    const toBakw: Position = [bakw[0] + 0.25, bakw[1] + 0.25];
    expect(movePoint(model, id, { forw: to, bakw: toBakw }).ok).toBe(true);
    to[0] += 1e6;
    toBakw[1] += 1e6;
    expect(mesh.vertices.get(vertex)!.forw).toEqual([forw[0] + 0.5, forw[1] + 0.5]);
    expect(mesh.vertices.get(vertex)!.bakw).toEqual([bakw[0] + 0.25, bakw[1] + 0.25]);
    expect(mesh.audit().bad).toEqual([]);
    // 折れ点の配列も同じ
    const neighbor = [...mesh.byVertex.get(vertex)!].flatMap((t) => mesh.triangles.get(t)!).find((u) => u !== vertex)!;
    const mid = mesh.vertices.get(neighbor)!.forw.map((x, i) => (x + mesh.vertices.get(vertex)!.forw[i]) / 2);
    const nodes: Position[] = [[mid[0] + 0.01, mid[1] + 0.01]];
    const added = insertEdge(model, 77, id, (mesh.vertices.get(neighbor)!.ref as { id: number }).id, nodes, []);
    if (added.ok) {
      nodes[0][0] += 1e6;
      expect(model.toCompiled().edges!.at(-1)![0]).toEqual([[mid[0] + 0.01, mid[1] + 0.01]]);
    }

    // ほかの頂点と同じ位置への移動・追加は "duplicate"。網も、頂点の採番も変わらない
    const state = () => JSON.stringify([[...mesh.vertices], [...mesh.triangles], (mesh as unknown as { nextVertex: number }).nextVertex, mesh.revision]);
    const before = state();
    const other = mesh.vertices.get(neighbor)!;
    const far = model.gcps.find((v) => v !== vertex && v !== neighbor && inner(model, v) && !mesh.hasEdge(v, neighbor))!;
    expect(movePoint(model, (mesh.vertices.get(far)!.ref as { id: number }).id, { forw: [...other.forw] })).toEqual({ ok: false, reason: "duplicate" });
    expect(insertPoint(model, 9_000_000, [...other.forw], [...other.bakw])).toEqual({ ok: false, reason: "duplicate" });
    // 有限でない座標は採らない
    expect(movePoint(model, id, { bakw: [NaN, NaN] }).ok).toBe(false);
    expect(movePoint(model, id, { forw: [NaN, 0] }).ok).toBe(false);
    expect(insertPoint(model, 9_000_001, [other.forw[0] + 3, other.forw[1] + 3], [NaN, 0]).ok).toBe(false);
    expect(state()).toBe(before);
  }, TIMEOUT);
});
