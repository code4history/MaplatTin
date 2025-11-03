import { Feature, Point, Position } from 'geojson';
/**
 * 線分の交差点を検出するメインの関数
 *
 * @param coords - 線分群の座標配列。各線分は始点と終点の座標で表現
 * @returns 検出された交差点のFeature配列
 */
export default function findIntersections(coords: Position[][]): Feature<Point>[];
