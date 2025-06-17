import { polygon, featureCollection } from "@turf/helpers";
import { FeatureCollection, Point, Polygon } from "geojson";
import Delaunator from "delaunator";
import EdgeRuler from "@maplat/edgeruler"
import { Edge } from "@maplat/transform";
import type { TriangleProperties } from "./types/tin.js";

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
export default function (points: FeatureCollection<Point>, edges: Edge[], z: string): FeatureCollection<Polygon> {
  if (!edges) edges = [];
  if (typeof points !== "object" || points.type !== "FeatureCollection")
    throw "Argument points must be FeatureCollection";
  if (!Array.isArray(edges)) throw "Argument points must be Array of Array";

  // Delaunay三角分割の実行
  const del_points = points.features.map(
    point => point.geometry!.coordinates as number[]
  );
  const del = Delaunator.from(del_points);

  // 制約エッジの適用
  let con;
  const tris = [];
  if (del.triangles.length !== 0 && edges.length !== 0) {
    con = new EdgeRuler(del);
    con.constrainAll(edges);
  }

  // 三角形リストの構築
  for (let i = 0; i < del.triangles.length; i += 3) {
    tris.push([del.triangles[i], del.triangles[i + 1], del.triangles[i + 2]]);
  }

  // GeoJSON形式での出力
  const keys = ["a", "b", "c"] as const;
  return featureCollection(
    tris.map(indices => {
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
}
