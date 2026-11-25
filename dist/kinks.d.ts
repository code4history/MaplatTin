import { Feature, Point, Position } from 'geojson';
/**
 * 線分の交差点を検出するメインの関数
 *
 * @param coords - 線分群の座標配列。各線分は始点と終点の座標で表現
 * @returns 検出された交差点のFeature配列
 * @throws {Error} 座標に有限数（Number.isFinite）でない値が含まれる場合
 */
export default function findIntersections(coords: Position[][]): Feature<Point>[];
/**
 * Tin が 1 方向（forw / bakw）について数え上げる交差の件数の上限
 * （同じ位置の交差を 1 件に数えた件数）。
 *
 * 交差の件数は線分の数の 2 乗まで増えうる。対応が大きく乱れた制御点では
 * 時間とメモリを使い切るため、ここで打ち切る。
 * 同梱の実データで strict の交差が最も多いもの（約 3 万件）の 3 倍強にあたる。
 */
export declare const MAX_KINKS_PER_DIRECTION = 100000;
/**
 * 線分の交差点を、件数の上限つきで検出する（Tin の内部用）
 *
 * @param coords - 線分群の座標配列
 * @param limit - 返す交差点の件数の上限。同じ位置の交差を 1 件に数えた件数で数え、
 *   届いた時点で検出をやめる
 * @returns 検出された交差点のFeature配列（同じ位置の重複なし・高々 limit 件）
 * @throws {Error} 座標に有限数（Number.isFinite）でない値が含まれる場合
 */
export declare function findIntersectionsUpTo(coords: Position[][], limit: number): Feature<Point>[];
