import { featureCollection, polygon } from "@turf/turf";
import type { FeatureCollection, Point, Polygon } from "geojson";
import Delaunator from "delaunator";
import { Constrain as EdgeBound } from "./edgebound/index.ts";
import { nextEdge } from "./edgebound/base.ts";
import type { Edge } from "@maplat/transform";
import type { TriangleProperties } from "./types/tin.ts";

/**
 * 制約付きTIN（Triangulated Irregular Network）を生成します
 *
 * 点群から三角形分割を行い、指定されたエッジ（制約線）を
 * 必ず三角形の辺として含むように調整します。
 *
 * @param points - 点群を含むFeatureCollection
 *                各Featureは座標を持つPointである必要があります
 * @param edges - 制約として扱うエッジの配列
 *               各エッジは2つの頂点インデックスの組として指定
 * @param z - 生成される三角形のプロパティに含める項目の名前
 *           （例: "target"）
 *
 * @returns 三角形のFeatureCollectionを返します
 *          各三角形は以下の情報を持ちます：
 *          - geometry: 三角形の座標
 *          - properties: 頂点に関連付けられた情報（a, b, cプロパティ）
 *
 * @throws {Error} pointsがFeatureCollectionでない場合
 * @throws {Error} edgesが配列でない場合
 *
 * 処理の流れ：
 * 1. Delaunay三角分割を実行
 * 2. 制約エッジに基づいて三角分割を調整
 * 3. 結果をGeoJSON形式に変換
 */
export default function (
  points: FeatureCollection<Point>,
  edges: Edge[],
  z: string
): FeatureCollection<Polygon> {
  return buildConstrainedTin(points, edges, z).tin;
}

interface ForbiddenGroups {
  groupsOf: (vertex: number) => readonly number[];
  planes: readonly ArrayLike<number>[];
  boundary?: Edge[];
  /**
   * GCP（と必須エッジの中継点）の凸包の辺。制約の辺にして、補助頂点を含む三角形が凸包の内側に
   * 食い込まないようにする。必須エッジなどと両立しない辺は外す。
   */
  hull?: Edge[];
  allowUnusableBoundary?: boolean;
}

/** 制約付き三角分割を作り、指定された群の禁止制約と残数を求める。 */
export function buildConstrainedTin(
  points: FeatureCollection<Point>,
  edges: Edge[],
  z: string,
  forbidden?: ForbiddenGroups
): {
  tin: FeatureCollection<Polygon>;
  remaining: number;
  hasBoundary: boolean;
  /** 制約にできた凸包の辺 */
  hull: Edge[];
} {
  if (!edges) edges = [];
  if (typeof points !== "object" || points.type !== "FeatureCollection") {
    throw "Argument points must be FeatureCollection";
  }
  if (!Array.isArray(edges)) throw "Argument points must be Array of Array";

  const coordinates = points.features.map(
    (point) => point.geometry!.coordinates
  );
  let del = Delaunator.from(coordinates);
  let remaining = 0;
  let outside: Set<number> | undefined;
  const acceptedHull: Edge[] = [];
  if (del.triangles.length !== 0 && (edges.length !== 0 || forbidden)) {
    let con = new EdgeBound(del);
    try {
      con.constrainAll(edges);
    } catch (error) {
      if (!forbidden?.allowUnusableBoundary) throw error;
      // 補助頂点を加える前に検査済みの必須エッジがここで張れなければ、
      // この面の余白候補は使えない（例えば補助頂点が必須エッジに重なる）。
      return { tin: featureCollection([]), remaining: 0, hasBoundary: false, hull: [] };
    }
    // 凸包の辺を制約にする。必須エッジが辺の途中の点に当たるなど、両立しない辺は外し、
    // それまでに張れた辺だけで三角網を組み直す（失敗した制約は三角網を途中まで変えてしまうため）。
    for (const hullEdge of forbidden?.hull ?? []) {
      try {
        con.constrainOne(hullEdge[0], hullEdge[1]);
        acceptedHull.push(hullEdge);
      } catch {
        del = Delaunator.from(coordinates);
        con = new EdgeBound(del, [...edges, ...acceptedHull]);
      }
    }
    if (forbidden?.boundary) {
      outside = closeBoundary(con, forbidden.boundary);
      if (!outside) {
        // 外周の適用に失敗した候補も最少反転の選択肢に残す。
        // 必須エッジと凸包の辺を保つため、外周を適用する前の三角網を組み直す。
        del = Delaunator.from(coordinates);
        con = new EdgeBound(del, [...edges, ...acceptedHull]);
      }
    }
    if (forbidden) {
      ({ remaining } = con.forbidGroupTriangles(
        forbidden.groupsOf,
        forbidden.planes
      ));
      // 外周は制約エッジなので反転をまたがない。外側の三角形はすべて補助頂点群に属する。
      remaining -= outside?.size ?? 0;
    }
  }

  const tris = [];
  for (let i = 0; i < del.triangles.length; i += 3) {
    if (outside?.has(i / 3)) continue;
    tris.push([del.triangles[i], del.triangles[i + 1], del.triangles[i + 2]]);
  }

  // GeoJSON形式での出力
  const keys = ["a", "b", "c"] as const;
  const tin = featureCollection(
    tris.map((indices) => {
      const properties: TriangleProperties = {};
      const coords = indices.map((index, i) => {
        const point = points.features[index];
        const xyz = point.geometry!.coordinates as number[];
        const coord: number[] = [xyz[0], xyz[1]];
        if (xyz.length === 3) {
          coord[2] = xyz[2];
        } else {
          properties[keys[i]] = point.properties![z];
        }
        return coord;
      });
      coords[3] = coords[0];
      return polygon([coords], properties);
    })
  );
  return { tin, remaining, hasBoundary: outside !== undefined, hull: acceptedHull };
}

/**
 * 補助頂点の輪を制約し、輪の外にある三角形を求める。
 * GCP や必須エッジの中継点が輪の外に出る場合は、輪を閉じられなかったものとして扱う。
 */
function closeBoundary(
  con: EdgeBound,
  boundary: Edge[]
): Set<number> | undefined {
  try {
    con.constrainAll(boundary);
  } catch {
    return undefined;
  }
  const border = new Map(boundary);
  const { triangles, halfedges } = con.del;
  const isBorder = (e: number): boolean => {
    const a = triangles[e],
      b = triangles[nextEdge(e)];
    return border.get(a) === b || border.get(b) === a;
  };

  // 輪を越えずに凸包の外からたどれる三角形は、扇形で扱う領域にある。
  const outside = new Set<number>();
  const queue: number[] = [];
  const visit = (edge: number) => {
    const t = Math.floor(edge / 3);
    if (!outside.has(t)) {
      outside.add(t);
      queue.push(t);
    }
  };
  for (let e = 0; e < halfedges.length; e++) {
    if (halfedges[e] === -1 && !isBorder(e)) visit(e);
  }
  for (let i = 0; i < queue.length; i++) {
    for (let e = queue[i] * 3; e < queue[i] * 3 + 3; e++) {
      if (!border.has(triangles[e])) return undefined;
      if (halfedges[e] !== -1 && !isBorder(e)) visit(halfedges[e]);
    }
  }
  return outside;
}
