import { polygon } from "@turf/turf";
import type { PropertyTriKey, TinsBD, Tri } from "@maplat/transform";
import type { Position } from "geojson";
import { counterTri } from "@maplat/transform";
import type { SearchIndex } from "./searchutils.ts";
import { insertSearchIndex, removeSearchIndex } from "./searchutils.ts";

type ConstraintEdges = number[][];

/** Matches the shape of PropertyTri in @maplat/transform (not publicly exported). */
type VertexInfo = {
  prop: { index: number | string; geom: Position };
  geom: Position;
};

type TrisEntry = {
  forw: Tri;
  bakw: Tri;
};

/**
 * bakw 三角形が縮退（面積ゼロ）かどうかを判定する。
 * pointInTriangle は denom=0 のとき false を返すため、縮退三角形を
 * 別途検出してフリップ対象に含める必要がある。
 *
 * 判定は 2×面積 = |cross product| < epsilon で行う。
 * web mercator 座標系（値域 ~1e7）での実用的な最小三角形面積は数 m² 以上であり、
 * epsilon=1e-6 は「実質ゼロ面積」のみを確実に捉える。
 */
function isDegenerate(triangle: [number, number][], epsilon = 1e-6): boolean {
  const [ax, ay] = triangle[0];
  const [bx, by] = triangle[1];
  const [cx, cy] = triangle[2];
  const doubleArea = Math.abs((bx - ax) * (cy - ay) - (cx - ax) * (by - ay));
  return doubleArea < epsilon;
}

function isConstraintEdge(key: string, edges: ConstraintEdges): boolean {
  const parts = key.split("-");
  if (parts.length !== 2) return false;
  if (!parts.every((value) => /^-?\d+$/.test(value))) return false;

  const [a, b] = parts.map((value) => parseInt(value, 10)).sort((x, y) => x - y);

  return edges.some((edge) => {
    if (edge.length !== 2) return false;
    const parsed = edge.map((value) => parseInt(`${value}`, 10));
    if (parsed.some((val) => Number.isNaN(val))) return false;
    const sorted = parsed.sort((x, y) => x - y);
    return sorted[0] === a && sorted[1] === b;
  });
}

function extractVertices(tri: Tri) {
  return (["a", "b", "c"] as PropertyTriKey[]).map((key, index) => ({
    prop: tri.properties![key],
    geom: tri.geometry!.coordinates[0][index],
  }));
}

// フリップ後に新規作成された三角形が forw 縮退になる場合があるため、
// 新規キーも処理できるよう反復ループを使用する（上限 MAX_FLIP_ITERATIONS 回）。
const MAX_FLIP_ITERATIONS = 10;

/**
 * bakw 縮退三角形のフリップ事前チェック:
 * 縮退 T_deg=(A,B,C) の C は辺 A-B 上にある。
 * フリップ後 T0_new=(A,C,D), T1_new=(B,C,D) が、
 * 隣接三角形 T2=(A,C,E), T3=(B,C,F) と重ならないことを確認する。
 * D と E が辺 AC の同じ側 → 重なり発生 → フリップ不可。同様に D と F で辺 BC を確認。
 */
function checkBakwDegenerateFlip(
  bakwDegen0: boolean,
  bakwDegen1: boolean,
  nonSharedBakw: (VertexInfo | undefined)[],
  sharedBakw: (VertexInfo | undefined)[],
  searchIndex: SearchIndex,
  trises: TrisEntry[],
): boolean {
  if (!bakwDegen0 && !bakwDegen1) return false;

  const degIdx = bakwDegen0 ? 0 : 1;           // 縮退している三角形のインデックス
  const otherIdx = 1 - degIdx;
  const degNonShared = nonSharedBakw[degIdx];  // C（辺 AB 上の縮退頂点）
  const otherNonShared = nonSharedBakw[otherIdx]; // D（正常三角形の非共有頂点）

  if (!degNonShared || !otherNonShared) return false;

  const D = toXY(otherNonShared.geom as Position);
  // 隣接三角形が少なくとも1つ見つかり、かつ全て干渉なし → フリップ有効
  // 隣接三角形がない場合はフリップ不要（干渉なし）と判断して false のまま
  let anyNeighborFound = false;
  let flipBlockedByNeighbor = false;

  // 共有頂点 A, B それぞれについて隣接三角形を確認
  for (let shIdx = 0; shIdx <= 1; shIdx++) {
    const sh = sharedBakw[shIdx];
    if (!sh) continue;

    // 辺 (A, C) または (B, C) の searchIndex キーを構築
    // calcSearchKeys と同じ文字列ソートを使うこと（prop.index は number | string 混在）
    const edgeKey = [String(sh.prop.index), String(degNonShared.prop.index)]
      .sort()
      .join("-");
    const neighborTris = searchIndex[edgeKey];
    if (!neighborTris || neighborTris.length < 2) continue;

    // 縮退三角形自身を除いた隣接三角形
    const neighbor = neighborTris.find(
      (t) => t.bakw !== trises[degIdx].bakw,
    );
    if (!neighbor) continue;

    const neighborVerts = extractVertices(neighbor.bakw);
    const neighborNonShared = neighborVerts.find(
      (v) =>
        String(v.prop.index) !== String(sh.prop.index) &&
        String(v.prop.index) !== String(degNonShared.prop.index),
    );
    if (!neighborNonShared) continue;

    anyNeighborFound = true;

    const E = toXY(neighborNonShared.geom as Position);
    const A_pos = toXY(sh.geom as Position);
    const C_pos = toXY(degNonShared.geom as Position);

    // D と E が辺 A-C の同じ側かを符号付き外積で判定
    // cross(A→C, A→D) と cross(A→C, A→E) の符号が同じ → 同じ側 → フリップ不可
    const acx = C_pos[0] - A_pos[0], acy = C_pos[1] - A_pos[1];
    const crossD = acx * (D[1] - A_pos[1]) - acy * (D[0] - A_pos[0]);
    const crossE = acx * (E[1] - A_pos[1]) - acy * (E[0] - A_pos[0]);

    if (crossD * crossE > 0) {
      // 同じ側 → フリップ後に T0_new/T1_new が隣接三角形と重なる
      flipBlockedByNeighbor = true;
      break;
    }
  }

  return anyNeighborFound && !flipBlockedByNeighbor;
}

/**
 * forw 縮退三角形のフリップ事前チェック:
 * forw 縮退の場合、bakw 空間の非共有2頂点が共有辺の両側にあるか確認し、
 * フリップ後に bakw TIN が壊れないことを保証する。
 * 面積比較は bakw 座標値（~1e7）で精度劣化するため、符号付き外積で凸性を直接判定する。
 */
function checkForwDegenerateFlip(
  forwDegen0: boolean,
  forwDegen1: boolean,
  nonSharedBakw: (VertexInfo | undefined)[],
  sharedBakw: (VertexInfo | undefined)[],
): boolean {
  if (!forwDegen0 && !forwDegen1) return false;

  if (nonSharedBakw[0] && nonSharedBakw[1] && sharedBakw[0] && sharedBakw[1]) {
    const sBakw = sharedBakw.map((item) => toXY(item!.geom as Position)) as [number, number][];
    const nsBakw = nonSharedBakw.map((item) => toXY(item!.geom as Position)) as [number, number][];
    // 共有辺方向ベクトル
    const dx = sBakw[1][0] - sBakw[0][0];
    const dy = sBakw[1][1] - sBakw[0][1];
    // 各非共有頂点の共有辺に対する外積（符号 = どちら側にあるか）
    const cross0 = dx * (nsBakw[0][1] - sBakw[0][1]) - dy * (nsBakw[0][0] - sBakw[0][0]);
    const cross1 = dx * (nsBakw[1][1] - sBakw[0][1]) - dy * (nsBakw[1][0] - sBakw[0][0]);
    // 符号が異なる（逆側にある）→ 凸四角形 → フリップ安全
    return cross0 * cross1 < 0;
  }
  return false;
}

export function resolveOverlaps(
  tins: TinsBD,
  searchIndex: SearchIndex,
  edges: ConstraintEdges,
): boolean {
  const processedKeys = new Set<string>();
  let repaired = false;

  for (let iter = 0; iter < MAX_FLIP_ITERATIONS; iter++) {
    let anyFlippedThisIter = false;

    for (const key of Object.keys(searchIndex)) {
      if (processedKeys.has(key)) continue;
      processedKeys.add(key);

      const trises = searchIndex[key];
      if (!trises || trises.length < 2) continue;

      const sharedKeys = key.split("-");
      if (sharedKeys.length !== 2) continue;

      if (isConstraintEdge(key, edges)) continue;

      const tri0Bakw = extractVertices(trises[0].bakw);
      const tri1Bakw = extractVertices(trises[1].bakw);
      const tri0Forw = extractVertices(trises[0].forw);
      const tri1Forw = extractVertices(trises[1].forw);

      const sharedBakw = sharedKeys.map((vertexKey) =>
        tri0Bakw.find((info) => `${info.prop.index}` === vertexKey) ||
        tri1Bakw.find((info) => `${info.prop.index}` === vertexKey),
      );
      const sharedForw = sharedKeys.map((vertexKey) =>
        tri0Forw.find((info) => `${info.prop.index}` === vertexKey) ||
        tri1Forw.find((info) => `${info.prop.index}` === vertexKey),
      );

      if (sharedBakw.some((vertex) => !vertex) || sharedForw.some((vertex) => !vertex)) {
        continue;
      }

      const nonSharedBakw = [tri0Bakw, tri1Bakw].map((vertices) =>
        vertices.find((info) => !sharedKeys.includes(`${info.prop.index}`)),
      );
      const nonSharedForw = [tri0Forw, tri1Forw].map((vertices) =>
        vertices.find((info) => !sharedKeys.includes(`${info.prop.index}`)),
      );

      if (
        nonSharedBakw.some((vertex) => !vertex) ||
        nonSharedForw.some((vertex) => !vertex)
      ) {
        continue;
      }

      const triangle0Bakw = trises[0].bakw.geometry!.coordinates[0]
        .slice(0, 3)
        .map((coord) => toXY(coord as Position)) as [number, number][];
      const triangle1Bakw = trises[1].bakw.geometry!.coordinates[0]
        .slice(0, 3)
        .map((coord) => toXY(coord as Position)) as [number, number][];

      const triangle0Forw = trises[0].forw.geometry!.coordinates[0]
        .slice(0, 3)
        .map((coord) => toXY(coord as Position)) as [number, number][];
      const triangle1Forw = trises[1].forw.geometry!.coordinates[0]
        .slice(0, 3)
        .map((coord) => toXY(coord as Position)) as [number, number][];

      // 縮退三角形（面積ゼロ）の検出: pointInTriangle は denom=0 のとき false を返すため
      // 別途面積チェックを行い、縮退三角形もフリップ候補に含める。
      // ただしフリップが有効か事前に隣接チェックを行う（後述）。
      const bakwDegen0 = isDegenerate(triangle0Bakw); // T0 が縮退（bakw）
      const bakwDegen1 = isDegenerate(triangle1Bakw); // T1 が縮退（bakw）

      // forw 側の縮退検出（forw kink の原因）
      const forwDegen0 = isDegenerate(triangle0Forw); // T0 が縮退（forw）
      const forwDegen1 = isDegenerate(triangle1Forw); // T1 が縮退（forw）

      const degenerateFlipValid = checkBakwDegenerateFlip(
        bakwDegen0,
        bakwDegen1,
        nonSharedBakw,
        sharedBakw,
        searchIndex,
        trises,
      );
      const forwDegenerateFlipValid = checkForwDegenerateFlip(
        forwDegen0,
        forwDegen1,
        nonSharedBakw,
        sharedBakw,
      );

      const overlaps =
        (degenerateFlipValid) ||
        (forwDegenerateFlipValid) ||
        pointInTriangle(
          toXY(nonSharedBakw[0]!.geom as Position),
          triangle1Bakw,
        ) ||
        pointInTriangle(
          toXY(nonSharedBakw[1]!.geom as Position),
          triangle0Bakw,
        );

      if (!overlaps) {
        continue;
      }

      const sharedForwPositions = sharedForw.map((item) =>
        toXY(item!.geom as Position)
      ) as [number, number][];
      const nonSharedForwPositions = nonSharedForw.map((item) =>
        toXY(item!.geom as Position)
      ) as [number, number][];

      const hull = convexHull([
        ...sharedForwPositions,
        ...nonSharedForwPositions,
      ]);
      const hullArea = polygonArea(hull);
      const unionArea = triangleArea(
        sharedForwPositions[0],
        sharedForwPositions[1],
        nonSharedForwPositions[0],
      ) + triangleArea(
        sharedForwPositions[0],
        sharedForwPositions[1],
        nonSharedForwPositions[1],
      );

      if (!almostEqual(hullArea, unionArea)) {
        continue;
      }

      removeSearchIndex(searchIndex, trises[0], tins);
      removeSearchIndex(searchIndex, trises[1], tins);

      sharedBakw.forEach((shared) => {
        if (!shared) return;
        const newCoords = [
          shared.geom,
          nonSharedBakw[0]!.geom,
          nonSharedBakw[1]!.geom,
          shared.geom,
        ];
        const newProps = {
          a: shared.prop,
          b: nonSharedBakw[0]!.prop,
          c: nonSharedBakw[1]!.prop,
        } as Tri["properties"];
        const newBakTri = polygon([newCoords], newProps) as Tri;
        const newForTri = counterTri(newBakTri);

        insertSearchIndex(searchIndex, {
          forw: newForTri,
          bakw: newBakTri,
        }, tins);
      });

      anyFlippedThisIter = true;
      repaired = true;
    }

    if (!anyFlippedThisIter) break;
  }

  return repaired;
}

function toXY(position: Position): [number, number] {
  return [position[0], position[1]];
}

function pointInTriangle(
  point: [number, number],
  triangle: [number, number][],
): boolean {
  const [ax, ay] = triangle[0];
  const [bx, by] = triangle[1];
  const [cx, cy] = triangle[2];

  const v0x = cx - ax;
  const v0y = cy - ay;
  const v1x = bx - ax;
  const v1y = by - ay;
  const v2x = point[0] - ax;
  const v2y = point[1] - ay;

  const dot00 = v0x * v0x + v0y * v0y;
  const dot01 = v0x * v1x + v0y * v1y;
  const dot02 = v0x * v2x + v0y * v2y;
  const dot11 = v1x * v1x + v1y * v1y;
  const dot12 = v1x * v2x + v1y * v2y;

  const denom = dot00 * dot11 - dot01 * dot01;
  if (denom === 0) return false;

  const invDenom = 1 / denom;
  const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
  const v = (dot00 * dot12 - dot01 * dot02) * invDenom;

  const epsilon = 1e-9;
  return u >= -epsilon && v >= -epsilon && u + v <= 1 + epsilon;
}

function convexHull(points: [number, number][]): [number, number][] {
  const unique = points
    .map((point) => point.slice() as [number, number])
    .filter(
      (point, index, arr) =>
        arr.findIndex(
          (candidate) =>
            almostEqual(candidate[0], point[0]) &&
            almostEqual(candidate[1], point[1]),
        ) === index,
    );

  if (unique.length <= 1) return unique;

  const sorted = unique.sort((a, b) =>
    a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]
  );

  const cross = (
    origin: [number, number],
    p1: [number, number],
    p2: [number, number],
  ) => (p1[0] - origin[0]) * (p2[1] - origin[1]) -
    (p1[1] - origin[1]) * (p2[0] - origin[0]);

  const lower: [number, number][] = [];
  for (const point of sorted) {
    while (lower.length >= 2 && cross(
      lower[lower.length - 2],
      lower[lower.length - 1],
      point,
    ) <= 0) {
      lower.pop();
    }
    lower.push(point);
  }

  const upper: [number, number][] = [];
  for (let i = sorted.length - 1; i >= 0; i--) {
    const point = sorted[i];
    while (upper.length >= 2 && cross(
      upper[upper.length - 2],
      upper[upper.length - 1],
      point,
    ) <= 0) {
      upper.pop();
    }
    upper.push(point);
  }

  upper.pop();
  lower.pop();

  return lower.concat(upper);
}

function polygonArea(points: [number, number][]): number {
  if (points.length < 3) return 0;
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[(i + 1) % points.length];
    area += x1 * y2 - x2 * y1;
  }
  return Math.abs(area) / 2;
}

function triangleArea(
  a: [number, number],
  b: [number, number],
  c: [number, number],
): number {
  return Math.abs(
    (a[0] * (b[1] - c[1]) +
      b[0] * (c[1] - a[1]) +
      c[0] * (a[1] - b[1])) / 2,
  );
}

function almostEqual(a: number, b: number, epsilon = 1e-9): boolean {
  return Math.abs(a - b) <= epsilon;
}
