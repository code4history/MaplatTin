import { FeatureCollection, Point, Polygon } from 'geojson';
import { Edge } from '@maplat/transform';
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
export default function (points: FeatureCollection<Point>, edges: Edge[], z: string): FeatureCollection<Polygon>;
