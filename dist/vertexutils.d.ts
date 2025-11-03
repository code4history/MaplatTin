import { Feature, Point, Position } from 'geojson';
import { Tins } from '@maplat/transform';
/**
 * 座標と属性から点オブジェクトを生成する
 * @param xy 座標値
 * @param geom 変換先での座標値
 * @param index インデックス
 * @returns 生成された点オブジェクト
 */
declare function createPoint(xy: Position, geom: Position, index: string | number): Feature<Point>;
/**
 * 点オブジェクトの座標系を反転する
 * @param apoint 元の点オブジェクト
 * @returns 座標系が反転された点オブジェクト
 */
declare function counterPoint(apoint: Feature<Point>): Feature<Point>;
/**
 * 頂点リストから頂点パラメータを計算する
 * @param list 頂点リスト
 * @param centroid 重心点
 * @returns [角度リスト, 三角形リスト]
 */
declare function vertexCalc(list: Feature<Point>[], centroid: Feature<Point>): [number[], Tins[]?];
export { counterPoint, createPoint, vertexCalc };
