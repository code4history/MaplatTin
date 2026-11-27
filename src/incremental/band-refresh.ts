/**
 * 帯（補助頂点・重心）を、今の内側の点から作り直す（MaplatTin#100 の第 1 段 b。設計書 §6.2）。
 *
 * 補助頂点の位置は、今の `updateTin()` と同じ式（`calculateVertices`）で計算し直す。計算に要る量
 * （重心・両面の凸包の頂点・全部の点・対応点の外接矩形）は、網の頂点表から取る（対応点だけの三角網を
 * 組み直さない）。地理面の重心は、重心を含む網の三角形で写す。
 */
import type { Position } from "geojson";
import type { VertexMode } from "@maplat/transform";
import { MARGINS, isStarShaped } from "../boundary-search.ts";
import {
  calculateBirdeyeVertices,
  calculatePlainVertices,
  type BoundaryVerticesParams
} from "../boundary-vertices.ts";
import { convexHullEdges } from "../hull-edges.ts";
import { locate } from "./edits.ts";
import type { VertexRef } from "./mesh.ts";
import type { MeshModel } from "./model.ts";
import { replaceBand } from "./rebuild.ts";

export type BandRefresh =
  | {
      ok: true;
      /** 消えた三角形・増えた三角形の id */
      removed: number[];
      added: number[];
      /** 消えた補助頂点の指し方と、増えた補助頂点の id */
      removedVertices: VertexRef[];
      addedVertices: number[];
      /** 採った余白 */
      margin: number;
    }
  | { ok: false; reason: "bandNotAnnulus" | "bandFailed" };

/**
 * 帯を差し替える。余白を小さい順に試し、差し替えが成り立った（新しい三角形が全部 okNew・外周が両面で単純・
 * 禁止制約が増えない）最初の余白を採る。どの余白でも成り立たなければ、網を変えずに失敗を返す。
 */
export function refreshBand(model: MeshModel, vertexMode: VertexMode | undefined): BandRefresh {
  const { mesh } = model;
  if (!model.centroid) return { ok: false, reason: "bandNotAnnulus" };
  const at = (vertex: number) => mesh.vertices.get(vertex)!;
  const supplements = new Set(model.supplements.map(({ vertex }) => vertex));
  const interior = [...model.gcps, ...model.nodeOrder()];
  // 重心・凸包・扇形外挿の推定は、対応点と必須エッジの中継点だけで行う（補完点を入れない）
  const counted = interior.filter((vertex) => !supplements.has(vertex));
  if (counted.length < 3) return { ok: false, reason: "bandFailed" };

  // 重心（紙の面は算術平均。地理面は、重心を含む網の三角形で写す）
  let sx = 0,
    sy = 0;
  for (const vertex of counted) {
    sx += at(vertex).forw[0];
    sy += at(vertex).forw[1];
  }
  const forw: Position = [sx / counted.length, sy / counted.length];
  const hint = mesh.triangles.keys().next().value;
  const found = hint === undefined ? undefined : locate(mesh, forw, hint);
  if (!found) return { ok: false, reason: "bandFailed" };
  const [A, B, C] = mesh.triangles.get(found.triangle)!.map(at);
  const d = (B.forw[0] - A.forw[0]) * (C.forw[1] - A.forw[1]) - (C.forw[0] - A.forw[0]) * (B.forw[1] - A.forw[1]);
  if (d === 0) return { ok: false, reason: "bandFailed" };
  const u = ((forw[0] - A.forw[0]) * (C.forw[1] - A.forw[1]) - (C.forw[0] - A.forw[0]) * (forw[1] - A.forw[1])) / d;
  const w = ((B.forw[0] - A.forw[0]) * (forw[1] - A.forw[1]) - (forw[0] - A.forw[0]) * (B.forw[1] - A.forw[1])) / d;
  const centroid = {
    forw,
    bakw: [
      A.bakw[0] + u * (B.bakw[0] - A.bakw[0]) + w * (C.bakw[0] - A.bakw[0]),
      A.bakw[1] + u * (B.bakw[1] - A.bakw[1]) + w * (C.bakw[1] - A.bakw[1])
    ] as Position
  };

  // 両面の凸包の頂点（相手の面の位置は、頂点表から引く）
  const convexBuf: BoundaryVerticesParams["convexBuf"] = {};
  for (const plane of ["forw", "bakw"] as const) {
    for (const [a] of convexHullEdges(counted.map((vertex) => at(vertex)[plane]))) {
      const vertex = at(counted[a]);
      convexBuf[`${vertex.forw[0]}:${vertex.forw[1]}`] = { forw: vertex.forw, bakw: vertex.bakw };
    }
  }
  const xs = model.gcps.map((vertex) => at(vertex).forw[0]);
  const ys = model.gcps.map((vertex) => at(vertex).forw[1]);
  const minx = Math.min(...xs),
    maxx = Math.max(...xs),
    miny = Math.min(...ys),
    maxy = Math.max(...ys);
  const params: BoundaryVerticesParams = {
    convexBuf,
    centroid,
    allGcps: interior.map((vertex) => ({ forw: at(vertex).forw, bakw: at(vertex).bakw })),
    minx,
    maxx,
    miny,
    maxy
  };
  const calculate = vertexMode === "birdeye" ? calculateBirdeyeVertices : calculatePlainVertices;
  const hull = convexHullEdges(interior.map((vertex) => at(vertex).forw));
  const removedVertices = model.ring.map((vertex) => at(vertex).ref);
  const width = maxx - minx,
    height = maxy - miny;
  let reason: "bandNotAnnulus" | "bandFailed" = "bandFailed";
  for (const margin of MARGINS) {
    const vertices = calculate(
      {
        ...params,
        minx: minx - margin * width,
        maxx: maxx + margin * width,
        miny: miny - margin * height,
        maxy: maxy + margin * height
      },
      true
    );
    if (
      !vertices.every(({ bakw }) => bakw.every(Number.isFinite)) ||
      !isStarShaped(vertices.map((v) => v.forw), centroid.forw, -1) ||
      !isStarShaped(vertices.map((v) => v.bakw), centroid.bakw, 1)
    )
      continue;
    const build = { mesh, indexOf: new Map<number, number | string>(), interior, ring: model.ring };
    const replaced = replaceBand(build, { vertices, hull });
    if (!replaced.ok) {
      // 輪が閉じていない網は、余白を変えても同じ
      if (replaced.reason === "bandNotAnnulus") return { ok: false, reason: "bandNotAnnulus" };
      reason = "bandFailed";
      continue;
    }
    model.ring = build.ring;
    model.centroid = centroid;
    model.resetBand();
    return {
      ok: true,
      removed: replaced.removed,
      added: replaced.added,
      removedVertices,
      addedVertices: build.ring,
      margin
    };
  }
  return { ok: false, reason };
}
