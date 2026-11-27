// レビュー用の乱数の編集（帯に触れる編集・凸包の頂点・必須エッジを含む）。毎回、網の全部を kinks で数え直す。
import { describe, expect, it } from "vitest";
import { writeFileSync } from "node:fs";
import type { Position } from "geojson";
import { Transform } from "@maplat/transform";
import { Tin, type MeshModel, type Options, type TinEdit, type TinPatch, type VertexRef } from "../../src/index.ts";
import { findIntersectionsUpTo } from "../../src/kinks.ts";
import { edgeKey } from "../../src/incremental/mesh.ts";
import { fitWorldFile, mapOptions } from "./fixtures.ts";

// 既定は軽い設定（CI 用）。レビューのときの設定は、
//   REVIEW_STEPS=150 REVIEW_SEEDS=20261127,31337
//   REVIEW_MAPS=fushimijo_maplat,tatebayashi_kaei_jokamachi,tatebayashi_castle_akimoto,kaisei_hiroshima_jissoku_sub1,1932_nobeoka,miesan_ginza_map
const STEPS = Number(process.env.REVIEW_STEPS ?? 60);
const MAPS = (process.env.REVIEW_MAPS ?? "fushimijo_maplat,tatebayashi_kaei_jokamachi").split(",");
const SEEDS = (process.env.REVIEW_SEEDS ?? "20261127").split(",").map(Number);
const REBUILD = process.env.REVIEW_REBUILD === "1";
const MODE = (process.env.REVIEW_MODE ?? "strict") as "strict" | "auto";
const OUT = process.env.REVIEW_OUT;

function random(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s |= 0; s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const refKey = (ref: VertexRef) => JSON.stringify(ref);

class Display {
  vertices = new Map<string, { forw: Position; bakw: Position }>();
  triangles = new Map<number, string[]>();
  reset(model: MeshModel) {
    this.vertices.clear(); this.triangles.clear();
    for (const { ref, forw, bakw } of model.mesh.vertices.values()) this.vertices.set(refKey(ref), { forw: [...forw], bakw: [...bakw] });
    for (const [id, tri] of model.mesh.triangles) this.triangles.set(id, tri.map((v) => refKey(model.mesh.vertices.get(v)!.ref)));
  }
  apply(patch: TinPatch): string[] {
    const errors: string[] = [];
    for (const id of patch.removedTriangles ?? []) if (!this.triangles.delete(id)) errors.push(`removedTriangle ${id} 無い`);
    for (const ref of patch.removedVertices ?? []) if (!this.vertices.delete(refKey(ref))) errors.push(`removedVertex ${refKey(ref)} 無い`);
    for (const { ref, forw, bakw } of patch.addedVertices ?? []) {
      if (this.vertices.has(refKey(ref))) errors.push(`addedVertex ${refKey(ref)} 既にある`);
      this.vertices.set(refKey(ref), { forw: [...forw], bakw: [...bakw] });
    }
    for (const { ref, forw, bakw } of patch.movedVertices ?? []) {
      if (!this.vertices.has(refKey(ref))) errors.push(`movedVertex ${refKey(ref)} 無い`);
      this.vertices.set(refKey(ref), { forw: [...forw], bakw: [...bakw] });
    }
    for (const { id, vertices } of patch.addedTriangles ?? []) {
      if (this.triangles.has(id)) errors.push(`addedTriangle ${id} 既にある`);
      this.triangles.set(id, vertices.map(refKey));
    }
    return errors;
  }
  diff(model: MeshModel): string[] {
    const other = new Display(); other.reset(model);
    const errors: string[] = [];
    if (this.triangles.size !== other.triangles.size) errors.push(`三角形の数 ${this.triangles.size} != ${other.triangles.size}`);
    for (const [id, refs] of other.triangles) if (JSON.stringify(this.triangles.get(id)) !== JSON.stringify(refs)) { errors.push(`三角形 ${id} 違う`); break; }
    if (this.vertices.size !== other.vertices.size) errors.push(`頂点の数 ${this.vertices.size} != ${other.vertices.size}`);
    for (const [key, pos] of other.vertices) if (JSON.stringify(this.vertices.get(key)) !== JSON.stringify(pos)) { errors.push(`頂点 ${key} 違う`); break; }
    return errors;
  }
}

function kinksOf(model: MeshModel): number {
  const { mesh } = model;
  let total = 0;
  for (const plane of ["forw", "bakw"] as const) {
    const rings = [...mesh.triangles.values()].map((tri) => {
      const [a, b, c] = tri.map((v) => mesh.vertices.get(v)![plane]);
      return [a, b, c, a];
    });
    total += findIntersectionsUpTo(rings, 3).length;
  }
  return total;
}

function hullIds(points: Position[]): Set<number> {
  const idx = points.map((_, i) => i).sort((a, b) => points[a][0] - points[b][0] || points[a][1] - points[b][1]);
  const cross = (o: number, a: number, b: number) =>
    (points[a][0] - points[o][0]) * (points[b][1] - points[o][1]) - (points[a][1] - points[o][1]) * (points[b][0] - points[o][0]);
  const lower: number[] = [];
  for (const i of idx) { while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], i) <= 0) lower.pop(); lower.push(i); }
  const upper: number[] = [];
  for (const i of [...idx].reverse()) { while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], i) <= 0) upper.pop(); upper.push(i); }
  return new Set([...lower, ...upper]);
}

interface Finding { map: string; seed: number; step: number; kind: string; what: string; detail?: unknown }

// 外周の方式: 扇形の外挿と、world file 外周（world file は、対応点に最小二乗で当てはめる）。
// REVIEW_OUTER=fan か worldFile で、片方に絞れる
const OUTERS = (process.env.REVIEW_OUTER ?? "fan,worldFile").split(",") as ("fan" | "worldFile")[];

describe("レビュー: 乱数の編集", () => {
  for (const name of MAPS) {
    for (const seed of SEEDS) for (const outer of OUTERS) {
      it(`${name} seed=${seed} rebuild=${REBUILD} mode=${MODE} outer=${outer}`, () => {
        const plain = mapOptions(name, MODE);
        const options: Options = outer === "worldFile"
          ? { ...plain, outerTransform: "worldFile", worldFile: fitWorldFile(plain.points!) }
          : plain;
        let tin = new Tin({ ...options, incremental: true, incrementalBand: true, incrementalRebuild: REBUILD });
        tin.updateTin();
        const findings: Finding[] = [];
        const stats: Record<string, number> = {};
        const bump = (k: string) => (stats[k] = (stats[k] ?? 0) + 1);
        if (!tin.incrementalMesh) { console.info(`[review] ${name}: 網なし ${tin.incrementalFailure}`); return; }
        const display = new Display();
        display.reset(tin.incrementalMesh);
        const rnd = random(seed);
        let nextPoint = 100_000, nextEdge = 200_000;
        const pairCount = new Map<string, number>();
        let revision = tin.revision;
        for (let step = 0; step < STEPS; step++) {
          const model = tin.incrementalMesh;
          if (!model) { bump("網なしで終了"); break; }
          const inputs = model.inputs();
          const n = inputs.points.length;
          const forws = inputs.points.map(([f]) => f as Position);
          const xs = forws.map((p) => p[0]), ys = forws.map((p) => p[1]);
          const minx = Math.min(...xs), maxx = Math.max(...xs), miny = Math.min(...ys), maxy = Math.max(...ys);
          const w = maxx - minx, h = maxy - miny;
          const hull = [...hullIds(forws)];
          const used = new Set(inputs.edges.flatMap((e) => e[2]));
          const pick = () => Math.floor(rnd() * n);
          const pickHull = () => hull[Math.floor(rnd() * hull.length)];
          // 近くの点の地理面から、位置を写す（最も近い 3 点の平均のずれ）
          const guessBakw = (forw: Position): Position => {
            const near = inputs.points.map(([f, b]) => ({ d: Math.hypot(f[0] - forw[0], f[1] - forw[1]), f, b })).sort((a, b) => a.d - b.d).slice(0, 3);
            // 相似変換の当てはめの代わりに、最近点 2 つの差から局所の線形を取る
            const [p, q, r] = near;
            const det = (q.f[0] - p.f[0]) * (r.f[1] - p.f[1]) - (r.f[0] - p.f[0]) * (q.f[1] - p.f[1]);
            if (Math.abs(det) < 1e-9 || (p.b[0] === q.b[0] && p.b[1] === q.b[1]) || (p.b[0] === r.b[0] && p.b[1] === r.b[1])) {
              // 縮退（同じ位置の点がある）: 最近点から、紙の面のずれを縮尺だけ掛けて写す（同じ地理面の位置を作らない）
              const far = inputs.points[0][0] === p.f ? inputs.points[1] : inputs.points[0];
              const k = Math.hypot(far[1][0] - p.b[0], far[1][1] - p.b[1]) / (Math.hypot(far[0][0] - p.f[0], far[0][1] - p.f[1]) || 1);
              return [p.b[0] + (forw[0] - p.f[0]) * k, p.b[1] - (forw[1] - p.f[1]) * k];
            }
            const u = ((forw[0] - p.f[0]) * (r.f[1] - p.f[1]) - (r.f[0] - p.f[0]) * (forw[1] - p.f[1])) / det;
            const v = ((q.f[0] - p.f[0]) * (forw[1] - p.f[1]) - (forw[0] - p.f[0]) * (q.f[1] - p.f[1])) / det;
            return [p.b[0] + u * (q.b[0] - p.b[0]) + v * (r.b[0] - p.b[0]), p.b[1] + u * (q.b[1] - p.b[1]) + v * (r.b[1] - p.b[1])];
          };
          const kind = Math.floor(rnd() * 14);
          let label = "";
          let edits: TinEdit[];
          const moveOf = (at: number, scale: number, both: boolean): TinEdit => {
            const [f] = inputs.points[at];
            const nf: Position = [f[0] + (rnd() - 0.5) * w * scale, f[1] + (rnd() - 0.5) * h * scale];
            return both
              ? { type: "movePoint", id: inputs.pointIds[at], forw: nf, bakw: guessBakw(nf) }
              : { type: "movePoint", id: inputs.pointIds[at], forw: nf };
          };
          if (kind === 0) { label = "移動(紙・小)"; edits = [moveOf(pick(), 0.01, false)]; }
          else if (kind === 1) {
            label = "移動(地理・小)";
            const at = pick(); const [, b] = inputs.points[at];
            const others = inputs.points[(at + 1) % n][1];
            const span = Math.hypot(others[0] - b[0], others[1] - b[1]) || 1;
            edits = [{ type: "movePoint", id: inputs.pointIds[at], bakw: [b[0] + (rnd() - 0.5) * span * 0.05, b[1] + (rnd() - 0.5) * span * 0.05] }];
          } else if (kind === 2) { label = "移動(両面・中)"; edits = [moveOf(pick(), 0.05, true)]; }
          else if (kind === 3) { label = "凸包の頂点の移動(両面)"; edits = [moveOf(pickHull(), 0.06, true)]; }
          else if (kind === 4) {
            label = "凸包の頂点の削除";
            const at = pickHull();
            if (used.has(at) || n < 8) { bump("skip"); continue; }
            edits = [{ type: "removePoint", id: inputs.pointIds[at] }];
          } else if (kind === 5) {
            label = "内側の点の削除";
            const at = pick();
            if (used.has(at) || n < 8) { bump("skip"); continue; }
            edits = [{ type: "removePoint", id: inputs.pointIds[at] }];
          } else if (kind === 6) {
            label = "内側への追加";
            const f: Position = [minx + rnd() * w, miny + rnd() * h];
            edits = [{ type: "addPoint", id: nextPoint++, forw: f, bakw: guessBakw(f) }];
          } else if (kind === 7) {
            label = "凸包の外への追加";
            const at = pickHull(); const [f] = inputs.points[at];
            const cx = (minx + maxx) / 2, cy = (miny + maxy) / 2;
            const k = 1.02 + rnd() * 0.1;
            const nf: Position = [cx + (f[0] - cx) * k + (rnd() - 0.5) * w * 0.02, cy + (f[1] - cy) * k + (rnd() - 0.5) * h * 0.02];
            edits = [{ type: "addPoint", id: nextPoint++, forw: nf, bakw: guessBakw(nf) }];
          } else if (kind === 8 || kind === 9) {
            label = kind === 8 ? "必須エッジの追加(直線)" : "必須エッジの追加(折れ点)";
            const a = pick();
            const near = forws.map((p, i) => ({ i, d: Math.hypot(p[0] - forws[a][0], p[1] - forws[a][1]) })).filter(({ i }) => i !== a).sort((x, y) => x.d - y.d);
            const b = near[Math.floor(rnd() * Math.min(4, near.length))].i;
            const mid: Position = [(forws[a][0] + forws[b][0]) / 2 + (rnd() - 0.5) * 2, (forws[a][1] + forws[b][1]) / 2 + (rnd() - 0.5) * 2];
            edits = [{
              type: "addEdge", id: nextEdge++, start: inputs.pointIds[a], end: inputs.pointIds[b],
              forwNodes: kind === 9 ? [mid] : [], bakwNodes: kind === 9 && rnd() < 0.5 ? [guessBakw(mid)] : []
            }];
          } else if (kind === 10) {
            label = "必須エッジの削除";
            if (inputs.edgeIds.length === 0) { bump("skip"); continue; }
            edits = [{ type: "removeEdge", id: inputs.edgeIds[Math.floor(rnd() * inputs.edgeIds.length)] }];
          } else if (kind === 11) {
            label = "折れ点の差し替え";
            if (inputs.edgeIds.length === 0) { bump("skip"); continue; }
            const at = Math.floor(rnd() * inputs.edgeIds.length);
            const [a, b] = inputs.edges[at][2];
            const count = Math.floor(rnd() * 3);
            const nodes: Position[] = [];
            for (let i = 1; i <= count; i++) {
              const t = i / (count + 1);
              nodes.push([forws[a][0] + (forws[b][0] - forws[a][0]) * t + (rnd() - 0.5) * 3, forws[a][1] + (forws[b][1] - forws[a][1]) * t + (rnd() - 0.5) * 3]);
            }
            edits = [{ type: "replaceEdgeNodes", id: inputs.edgeIds[at], forwNodes: nodes, bakwNodes: rnd() < 0.5 ? nodes.map(guessBakw) : [] }];
          } else if (kind === 12) {
            label = "必須エッジの端点の移動";
            if (used.size === 0) { bump("skip"); continue; }
            const ends = [...used];
            edits = [moveOf(ends[Math.floor(rnd() * ends.length)], 0.02, true)];
          } else {
            label = "複数(外へ追加+内の移動+辺)";
            const at = pickHull(); const [f] = inputs.points[at];
            const cx = (minx + maxx) / 2, cy = (miny + maxy) / 2;
            const nf: Position = [cx + (f[0] - cx) * 1.05, cy + (f[1] - cy) * 1.05];
            const added = nextPoint++;
            edits = [
              { type: "addPoint", id: added, forw: nf, bakw: guessBakw(nf) },
              moveOf(pick(), 0.01, true),
              { type: "addEdge", id: nextEdge++, start: inputs.pointIds[at], end: added, forwNodes: [], bakwNodes: [] }
            ];
          }
          for (const e of edits) if (e.type === "addEdge") { const k = [e.start, e.end].sort().join("-"); pairCount.set(k, (pairCount.get(k) ?? 0) + 1); }
          const wasStrict = model.mesh.isStrict();
          const note = (what: string, detail?: unknown) => findings.push({ map: name, seed, step, kind: label, what, detail });
          let patch: TinPatch;
          try {
            patch = tin.applyEdits(edits, revision);
          } catch (error) {
            bump(`例外:${String(error).slice(0, 40)}`);
            // 同じ入力を新しく組んでも、同じ例外になるはず
            let freshError: string | undefined;
            try {
              const fresh = new Tin({ ...options, points: undefined, edges: undefined });
              fresh.points = tin.points; fresh.setEdges(tin.edges); fresh.updateTin();
            } catch (e) { freshError = String(e); }
            if (freshError !== String(error)) note("例外が全部組み直しと違う", { got: String(error), fresh: freshError });
            // 編集の前の入力から、作り直して続ける
            tin = new Tin({ ...options, points: undefined, edges: undefined, incremental: true, incrementalBand: true, incrementalRebuild: REBUILD });
            tin.points = inputs.points; tin.setEdges(inputs.edges); tin.updateTin();
            revision = tin.revision;
            if (tin.incrementalMesh) display.reset(tin.incrementalMesh);
            continue;
          }
          revision = patch.revision;
          bump(`${label}:${patch.mode}${patch.mode === "full" ? `(${patch.fallbackReason})` : patch.boundaryStale ? "" : "+帯"}`);
          bump(patch.mode === "local" ? (patch.boundaryStale ? "TOTAL 局所" : "TOTAL 局所+帯") : "TOTAL 全部");
          const now = tin.incrementalMesh;
          if (!now) { bump(`網なし(${tin.incrementalFailure})`); if (tin.strict_status === "strict") note("strict なのに網が無い", tin.incrementalFailure); break; }
          if (patch.mode === "local") {
            const errors = display.apply(patch);
            if (errors.length) note("差分が当たらない", errors);
            if (wasStrict && patch.strict_status !== "strict") note("局所更新が strict を壊した");
            // （world file 外周は、扇形の中心を持たない。帯は古くならないので、この検査の対象でない）
            if (!now.isWorldFile && !patch.boundaryStale && (!patch.centroid || !patch.verticesParams)) note("帯を差し替えたのに centroid/verticesParams が無い");
          } else display.reset(now);
          const d = display.diff(now);
          if (d.length) { note("表示用の網が網と違う", d); display.reset(now); }
          // 全部の数え直し
          const kinks = kinksOf(now);
          const localStrict = now.mesh.isStrict();
          if ((kinks === 0) !== localStrict) note("局所の判定と kinks が食い違う", { kinks, localStrict, bad: now.mesh.bad.size, simple: now.mesh.boundarySimple, mode: patch.mode, reason: patch.fallbackReason, diag: tin.rebuildDiagnostics,
            tris: [...now.mesh.bad].map((id) => { const t = now.mesh.triangles.get(id)!; const v = t.map((x) => now.mesh.vertices.get(x)!); const ar = (pl: "forw" | "bakw") => (v[1][pl][0] - v[0][pl][0]) * (v[2][pl][1] - v[0][pl][1]) - (v[2][pl][0] - v[0][pl][0]) * (v[1][pl][1] - v[0][pl][1]); return { id, refs: v.map((x) => x.ref), forw2A: ar("forw"), bakw2A: ar("bakw"), forw: v.map((x) => x.forw), bakw: v.map((x) => x.bakw) }; }) });
          if ((patch.strict_status === "strict") !== (kinks === 0)) note("patch.strict_status と kinks が食い違う", { status: patch.strict_status, kinks });
          if (tin.strict_status !== patch.strict_status) note("tin.strict_status と patch が違う");
          const audit = now.mesh.audit();
          if (!audit.badMatches || !audit.indexMatches || audit.nonManifoldEdges || audit.missingRequired || !audit.forbiddenMatches || audit.boundarySimple !== now.mesh.boundarySimple) note("audit が合わない", audit);
          // 点が網から消えていない・入力と合う
          const after = now.inputs();
          for (const v of [...now.gcps, ...now.nodeOrder(), ...now.ring]) if (!now.mesh.byVertex.get(v)?.size) { note("三角形を持たない頂点", now.mesh.vertices.get(v)?.ref); break; }
          if (now.mesh.vertices.size !== now.gcps.length + now.nodeOrder().length + now.ring.length) note("頂点表に余りがある");
          // 必須エッジの全部の区間が網の辺にあり、required の印がある
          for (const edge of now.edges) {
            const chain = [edge.start, ...edge.nodes, edge.end];
            for (let i = 0; i + 1 < chain.length; i++) {
              if (!now.mesh.byEdge.has(edgeKey(chain[i], chain[i + 1])) || !(now.mesh.flagsOf(chain[i], chain[i + 1]) & 1)) {
                const pid = (v: number) => (now.mesh.vertices.get(v)!.ref as { id: number }).id;
                const pairKey = [pid(edge.start), pid(edge.end)].sort().join("-");
                note("必須エッジの区間が網に無い", { edge: edge.id, pair: pairKey, nodes: edge.nodes.length, hasEdge: now.mesh.byEdge.has(edgeKey(chain[i], chain[i + 1])), flag: now.mesh.flagsOf(chain[i], chain[i + 1]),
                  同じ対の必須エッジを足した回数: pairCount.get(pairKey) ?? 0, 今ある同じ対の数: now.edges.filter((e) => [pid(e.start), pid(e.end)].sort().join("-") === pairKey).length });
                break;
              }
            }
          }
          // 入力（期待）: 編集を自分で当てた結果と合う
          if (patch.mode === "local") {
            const expectIds = new Set(inputs.pointIds);
            for (const e of edits) { if (e.type === "addPoint") expectIds.add(e.id); if (e.type === "removePoint") expectIds.delete(e.id); }
            if (after.pointIds.length !== expectIds.size || !after.pointIds.every((id) => expectIds.has(id))) note("対応点の id の集合が違う");
            for (const e of edits) {
              if (e.type === "addPoint" || e.type === "movePoint") {
                const at = after.pointIds.indexOf(e.id);
                if (e.forw && JSON.stringify(after.points[at][0]) !== JSON.stringify(e.forw)) note("点の座標が編集と違う");
              }
            }
          }
          // ときどき: compiled を Transform で読み直し、GCP の往復・中継点の位置が全部組み直しと同じか
          if (step % 10 === 9 || !patch.boundaryStale) {
            const compiled = tin.getCompiled();
            if (JSON.stringify(compiled) !== JSON.stringify(now.toCompiled())) note("getCompiled が網の書き出しと違う");
            const reader = new Transform();
            try {
              reader.setCompiled(JSON.parse(JSON.stringify(compiled)));
              let worst = 0;
              for (const [f, b] of compiled.points) {
                const out = reader.transform(f, false) as Position | false;
                if (!out) { worst = Infinity; break; }
                worst = Math.max(worst, Math.hypot(out[0] - b[0], out[1] - b[1]));
              }
              const scale = Math.hypot(compiled.points[0][1][0] - compiled.points[1][1][0], compiled.points[0][1][1] - compiled.points[1][1][1]) || 1;
              if (!(worst < 1e-6 * Math.max(1, scale))) note("GCP の往復が合わない", worst);
            } catch (error) { note("Transform が compiled を読めない", String(error)); }
            // tin.transform()（syncFromMesh を通る）の後も、同じ compiled
            tin.transform(compiled.points[0][0], false);
            if (JSON.stringify(tin.getCompiled()) !== JSON.stringify(compiled)) note("syncFromMesh の後の getCompiled が違う");
            if (tin.incrementalMesh !== now) note("syncFromMesh で網が入れ替わった");
          }
          if (!patch.boundaryStale && patch.mode === "local" && patch.centroid) {
            // 帯を差し替えた直後: centroid・verticesParams の意味を、全部組み直しと比べる
            const compiled = now.toCompiled();
            const fresh = new Tin({ ...options, points: undefined, edges: undefined });
            fresh.points = compiled.points; fresh.setEdges(compiled.edges);
            try {
              fresh.updateTin();
              const fc = fresh.getCompiled();
              const dc = Math.hypot(fc.centroid_point![0][0] - patch.centroid!.forw[0], fc.centroid_point![0][1] - patch.centroid!.forw[1]);
              if (dc > 1e-6) note("重心（紙の面）が全部組み直しと違う", dc);
              const db = Math.hypot(fc.centroid_point![1][0] - patch.centroid!.bakw[0], fc.centroid_point![1][1] - patch.centroid!.bakw[1]);
              stats["重心(地理)の差の最大"] = Math.max(stats["重心(地理)の差の最大"] ?? 0, db);
              const sameRing = fc.vertices_points!.length === compiled.vertices_points!.length;
              bump(sameRing ? "帯:輪の数が全部組み直しと同じ" : "帯:輪の数が違う");
              if (fc.strict_status !== "strict") bump("帯:全部組み直しは strict でない（局所は strict）");
              // verticesParams は、vertices_points と centroid から同じ式で出るか
              const vp = patch.verticesParams!;
              compiled.vertices_points!.forEach(([f, b], i) => {
                const af = Math.atan2(f[0] - patch.centroid!.forw[0], f[1] - patch.centroid!.forw[1]);
                const ab = Math.atan2(b[0] - patch.centroid!.bakw[0], b[1] - patch.centroid!.bakw[1]);
                if (vp[0][i] !== af || vp[1][i] !== ab) note("verticesParams が式と違う");
              });
              if (JSON.stringify(compiled.vertices_params) !== JSON.stringify(vp)) note("compiled.vertices_params が patch と違う");
            } catch (error) { bump(`帯:全部組み直しは例外 ${String(error).slice(0, 30)}`); }
          }
        }
        // 清書: 同じ入力を新しく組んだ結果と一致
        if (tin.incrementalMesh) {
          const compiled = tin.getCompiled();
          const fresh = new Tin({ ...options, points: undefined, edges: undefined, incrementalRebuild: REBUILD });
          fresh.points = compiled.points; fresh.setEdges(compiled.edges);
          let a: string, b: string;
          try { fresh.updateTin(); a = JSON.stringify(fresh.getCompiled()); } catch (e) { a = `throw ${String(e)}`; }
          try { tin.updateTin(); b = JSON.stringify(tin.getCompiled()); } catch (e) { b = `throw ${String(e)}`; }
          if (a !== b) findings.push({ map: name, seed, step: -1, kind: "清書", what: "清書が新しく組んだ結果と違う" });
          bump(`清書:${a.startsWith("throw") ? a : JSON.parse(a).strict_status}`);
        }
        const summary = { name, seed, rebuild: REBUILD, mode: MODE, outer, stats, findings };
        console.info(`[review] ${JSON.stringify(summary, null, 1)}`);
        if (OUT) writeFileSync(`${OUT}/${name}-${seed}-${REBUILD ? "rb" : "std"}-${MODE}-${outer}.json`, JSON.stringify(summary, null, 1));
        expect(findings).toEqual([]);
      }, 3_600_000);
    }
  }
});
