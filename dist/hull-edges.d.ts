import { Position } from 'geojson';
import { Edge } from '@maplat/transform';
/**
 * 点群の凸包の辺を、点の添字の組で返す。凸包の辺の上に一直線に並ぶ点も含め、
 * 隣り合う点どうしの区間を 1 本ずつの辺にする。
 *
 * 座標が同じ点は最初の添字だけを使う。一直線に並ぶ点しか無いとき（凸包が面を持たないとき）は空。
 * 「一直線」は正確な判定（orient2d が 0）で、わずかに内側にある点は辺の途中の点として扱わない
 * （その点は凸包の内側の点で、辺は隣り合う凸包の頂点どうしになる）。
 */
export declare function convexHullEdges(coordinates: readonly Position[]): Edge[];
/**
 * `coordinates` の面の凸包の辺のうち、もう一方の面（`otherCoordinates`、同じ添字の点）でも
 * 凸包の辺になるものだけを返す（もう一方の面で、辺を通る直線の片側にすべての点が並ぶもの）。
 *
 * 地図面の凸包の辺が地理面で内側へ凹む箇所では、その辺を制約にすると、strict で地理面へ写した
 * 三角形どうしが重なる。そのような辺は、両面で同じ三角網を使う限り張れないので制約にしない。
 */
export declare function sharedHullEdges(coordinates: readonly Position[], otherCoordinates: readonly Position[]): Edge[];
