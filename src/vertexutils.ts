import { point } from "@turf/helpers";
import { featureCollection, polygon } from "@turf/helpers";

/**
 * 座標と属性から点オブジェクトを生成する
 * @param xy 座標値
 * @param geom 変換先での座標値
 * @param index インデックス
 * @returns 生成された点オブジェクト
 */
function createPoint(xy: any, geom: any, index: any) {
  return point(xy, { target: { geom, index } });
}

/**
 * 点オブジェクトの座標系を反転する
 * @param apoint 元の点オブジェクト
 * @returns 座標系が反転された点オブジェクト
 */
function counterPoint(apoint: any) {
  return point(apoint.properties.target.geom, {
    target: {
      geom: apoint.geometry.coordinates,
      index: apoint.properties.target.index
    }
  });
}

/**
 * 頂点リストから頂点パラメータを計算する
 * @param list 頂点リスト
 * @param centroid 重心点
 * @returns [角度リスト, 三角形リスト]
 */
function vertexCalc(list: any, centroid: any) {
  const centCoord = centroid.geometry.coordinates;
  return [0, 1, 2, 3]
    .map(i => {
      const j = (i + 1) % 4;
      const itemi = list[i];
      const itemj = list[j];
      const coord = itemi.geometry.coordinates;
      const radian = Math.atan2(
        coord[0] - centCoord[0],
        coord[1] - centCoord[1]
      );
      const coordinates = [centroid, itemi, itemj, centroid].map(
        point => point.geometry.coordinates
      );
      const properties = {
        a: {
          geom: centroid.properties.target.geom,
          index: centroid.properties.target.index
        },
        b: {
          geom: itemi.properties.target.geom,
          index: itemi.properties.target.index
        },
        c: {
          geom: itemj.properties.target.geom,
          index: itemj.properties.target.index
        }
      };
      const tin = featureCollection([polygon([coordinates], properties)]);
      return [radian, tin];
    })
    .reduce(
      (prev, curr) => {
        prev[0].push(curr[0]);
        prev[1].push(curr[1]);
        return prev;
      },
      [[] as any[], [] as any[]]
    );
}

export {
  createPoint,
  counterPoint,
  vertexCalc
};