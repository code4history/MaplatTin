import { point, featureCollection, polygon } from "@turf/turf";
import type { Feature, Point, Position } from "geojson";
import type { Tins } from "@maplat/transform";

/**
 * 座標と属性から点オブジェクトを生成する
 * @param xy 座標値
 * @param geom 変換先での座標値
 * @param index インデックス
 * @returns 生成された点オブジェクト
 */
function createPoint(
  xy: Position,
  geom: Position,
  index: string | number,
): Feature<Point> {
  return point(xy, { target: { geom, index } });
}

/**
 * 点オブジェクトの座標系を反転する
 * @param apoint 元の点オブジェクト
 * @returns 座標系が反転された点オブジェクト
 */
function counterPoint(apoint: Feature<Point>): Feature<Point> {
  return point(apoint.properties!.target.geom, {
    target: {
      geom: apoint.geometry!.coordinates,
      index: apoint.properties!.target.index,
    },
  });
}

/**
 * 頂点リストから頂点パラメータを計算する
 *
 * N 個の境界頂点（v2 では常に 4 個、v3 では任意）に対応した汎用版。
 * 各頂点について (重心, b_i, b_{(i+1)%N}) の扇形三角形と角度を計算する。
 *
 * @param list 境界頂点リスト（N 個）
 * @param centroid 重心点
 * @returns [角度リスト（N 個）, 三角形リスト（N 個）]
 */
function vertexCalc(
  list: Feature<Point>[],
  centroid: Feature<Point>,
): [number[], Tins[]?] {
  const N = list.length;
  const centCoord = centroid.geometry!.coordinates;
  return Array.from({ length: N }, (_, i) => i)
    .map((i) => {
      const j = (i + 1) % N;
      const itemi = list[i];
      const itemj = list[j];
      const coord = itemi.geometry!.coordinates;
      const radian = Math.atan2(
        coord[0] - centCoord[0],
        coord[1] - centCoord[1],
      );
      const coordinates = [centroid, itemi, itemj, centroid].map(
        (point) => point.geometry!.coordinates,
      );
      const properties = {
        a: {
          geom: centroid.properties!.target.geom,
          index: centroid.properties!.target.index,
        },
        b: {
          geom: itemi.properties!.target.geom,
          index: itemi.properties!.target.index,
        },
        c: {
          geom: itemj.properties!.target.geom,
          index: itemj.properties!.target.index,
        },
      };
      const tin = featureCollection([
        polygon([coordinates], properties),
      ]) as Tins;
      return [radian, tin] as [number, Tins];
    })
    .reduce(
      (prev, curr) => {
        prev[0].push(curr[0]);
        prev[1].push(curr[1]);
        return prev;
      },
      [[] as number[], [] as Tins[]],
    );
}

export { counterPoint, createPoint, vertexCalc };
