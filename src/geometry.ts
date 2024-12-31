import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { featureCollection } from "@turf/helpers";
import { Feature, FeatureCollection, Polygon, Point, Position } from "geojson";
//import { Tri, Tins, IndexedTins, WeightBuffer, VerticesParams } from "./index";
type PropertyTri = { geom: Position; index: number | string };
export type PropertyTriKey = "a" | "b" | "c";
type PropertiesTri = { [key in PropertyTriKey]: PropertyTri };
export type Tri = Feature<Polygon, PropertiesTri>;
export type Tins = FeatureCollection<Polygon, PropertiesTri>;
export type WeightBuffer = { [index: string]: number };
export type VerticesParams = [number[], FeatureCollection<Polygon>[]?];
export interface IndexedTins {
  gridNum: number;
  xOrigin: number;
  yOrigin: number;
  xUnit: number;
  yUnit: number;
  gridCache: number[][][];
}

/**
 * 指定された点が三角形の内部に存在するかを判定し、該当する三角形を返す
 * @param point 判定する点
 * @param tins 三角形群
 * @returns 点を含む三角形、または未定義（点が三角形群の外部にある場合）
 */
function hit(point: Feature<Point>, tins: Tins): Tri | undefined {
  for (let i = 0; i < tins.features.length; i++) {
    const inside = booleanPointInPolygon(point, tins.features[i]);
    if (inside) {
      return tins.features[i];
    }
  }
}

/**
 * 三角形内の点の座標を、対応する三角形の座標系に変換する
 * @param of 変換する点
 * @param tri 三角形
 * @param weightBuffer 重み付けバッファ（オプション）
 * @returns 変換後の座標
 */
function transformTinArr(of: any, tri: any, weightBuffer: any) {
  const a = tri.geometry.coordinates[0][0];
  const b = tri.geometry.coordinates[0][1];
  const c = tri.geometry.coordinates[0][2];
  const o = of.geometry.coordinates;
  const ad = tri.properties.a.geom;
  const bd = tri.properties.b.geom;
  const cd = tri.properties.c.geom;
  const ab = [b[0] - a[0], b[1] - a[1]];
  const ac = [c[0] - a[0], c[1] - a[1]];
  const ao = [o[0] - a[0], o[1] - a[1]];
  const abd = [bd[0] - ad[0], bd[1] - ad[1]];
  const acd = [cd[0] - ad[0], cd[1] - ad[1]];
  let abv = (ac[1] * ao[0] - ac[0] * ao[1]) / (ab[0] * ac[1] - ab[1] * ac[0]);
  let acv = (ab[0] * ao[1] - ab[1] * ao[0]) / (ab[0] * ac[1] - ab[1] * ac[0]);

  // 重み付けがある場合は補正を行う
  if (weightBuffer) {
    const aW = weightBuffer[tri.properties.a.index];
    const bW = weightBuffer[tri.properties.b.index];
    const cW = weightBuffer[tri.properties.c.index];
    let nabv;
    if (abv < 0 || acv < 0 || 1 - abv - acv < 0) {
      const normB = abv / (abv + acv);
      const normC = acv / (abv + acv);
      nabv = abv / bW / (normB / bW + normC / cW);
      acv = acv / cW / (normB / bW + normC / cW);
    } else {
      nabv = abv / bW / (abv / bW + acv / cW + (1 - abv - acv) / aW);
      acv = acv / cW / (abv / bW + acv / cW + (1 - abv - acv) / aW);
    }
    abv = nabv;
  }
  return [
    abv * abd[0] + acv * acd[0] + ad[0],
    abv * abd[1] + acv * acd[1] + ad[1]
  ];
}

/**
 * 頂点パラメータを使用して点の座標を変換する
 * @param o 変換する点
 * @param verticesParams 頂点パラメータ
 * @param centroid 重心点
 * @param weightBuffer 重み付けバッファ
 * @returns 変換後の座標
 */
function useVerticesArr(
  o: Feature<Point>,
  verticesParams: VerticesParams,
  centroid: Feature<Point>,
  weightBuffer: WeightBuffer
): Position {
  const coord = o.geometry!.coordinates;
  const centCoord = centroid.geometry!.coordinates;
  const radian = Math.atan2(coord[0] - centCoord[0], coord[1] - centCoord[1]);
  const index = decideUseVertex(radian, verticesParams[0]);
  const tin = verticesParams[1]![index as any];
  return transformTinArr(o, tin.features[0], weightBuffer);
}

/**
 * 点の座標を変換する
 * 点が三角形の内部にある場合は三角形による変換を、
 * 外部にある場合は頂点パラメータによる変換を行う
 * @param point 変換する点
 * @param tins 三角形群
 * @param indexedTins インデックス付き三角形群（オプション）
 * @param verticesParams 頂点パラメータ（オプション）
 * @param centroid 重心点（オプション）
 * @param weightBuffer 重み付けバッファ（オプション）
 * @param stateTriangle 状態三角形（オプション）
 * @param stateSetFunc 状態設定関数（オプション）
 * @returns 変換後の座標
 */
function transformArr(
  point: Feature<Point>,
  tins: Tins,
  indexedTins?: IndexedTins,
  verticesParams?: VerticesParams,
  centroid?: Feature<Point>,
  weightBuffer?: WeightBuffer,
  stateTriangle?: Tri,
  stateSetFunc?: (tri?: Tri) => void
): Position {
  let tin: Tri | undefined;
  if (stateTriangle) {
    tin = hit(point, featureCollection([stateTriangle]));
  }
  if (!tin) {
    if (indexedTins) {
      const coords = point.geometry!.coordinates;
      const gridNum = indexedTins.gridNum;
      const xOrigin = indexedTins.xOrigin;
      const yOrigin = indexedTins.yOrigin;
      const xUnit = indexedTins.xUnit;
      const yUnit = indexedTins.yUnit;
      const gridCache = indexedTins.gridCache;
      const normX = unitCalc(coords[0], xOrigin, xUnit, gridNum);
      const normY = unitCalc(coords[1], yOrigin, yUnit, gridNum);
      const tinsKey = gridCache[normX]
        ? gridCache[normX][normY]
          ? gridCache[normX][normY]
          : []
        : [];
      tins = featureCollection(tinsKey.map((key: any) => tins.features[key]));
    }
    tin = hit(point, tins);
  }
  if (stateSetFunc) stateSetFunc(tin);
  return tin
    ? transformTinArr(point, tin, weightBuffer)
    : useVerticesArr(point, verticesParams!, centroid!, weightBuffer!);
}

/**
 * 座標値をグリッド単位に正規化する
 * @param coord 正規化する座標値
 * @param origin 原点座標
 * @param unit グリッド単位
 * @param gridNum グリッド数
 * @returns 正規化された座標値
 */
function unitCalc(
  coord: number,
  origin: number,
  unit: number,
  gridNum: number
) {
  let normCoord = Math.floor((coord - origin) / unit);
  if (normCoord >= gridNum) normCoord = gridNum - 1;
  return normCoord;
}

/**
 * 与えられた角度に最も近い頂点のインデックスを決定する
 * 
 * 目標の角度(radian)と頂点リストの角度(radianList)を比較し、
 * 目標の角度を挟む2つの頂点のうち、より近い方の頂点を選択する
 * 
 * @param radian 目標の角度（ラジアン）
 * @param radianList 頂点の角度リスト（ラジアン）
 * @returns 最適な頂点のインデックス。適切な頂点が見つからない場合はundefined
 * 
 * @example
 * // 例: 0.5ラジアンの角度に対して、[0, π/2, π, 3π/2]の頂点リストから最適な頂点を選択
 * const index = decideUseVertex(0.5, [0, Math.PI/2, Math.PI, Math.PI*3/2]);
 * // returns 0 (最初の頂点が最も近い)
 */
function decideUseVertex(radian: any, radianList: any) {
  // 最初の頂点との角度差を正規化
  let idel = normalizeRadian(radian - radianList[0]);
  let minTheta = Math.PI * 2;  // 最小角度差の初期値
  let minIndex;                 // 最適な頂点のインデックス

  // すべての隣接する頂点ペアをチェック
  for (let i = 0; i < radianList.length; i++) {
    const j = (i + 1) % radianList.length;        // 次の頂点のインデックス（最後の頂点の次は最初の頂点）
    const jdel = normalizeRadian(radian - radianList[j]);  // 次の頂点との角度差
    const minDel = Math.min(Math.abs(idel), Math.abs(jdel));  // 現在の頂点ペアとの最小角度差

    // 目標角度が現在の頂点ペア間にあり（idel * jdel <= 0）、
    // かつ、これまでの最小角度差より小さい場合
    if (idel * jdel <= 0 && minDel < minTheta) {
      minTheta = minDel;
      minIndex = i;
    }
    idel = jdel;  // 次のイテレーションのために現在の角度差を保存
  }
  return minIndex;
}

/**
* 角度を指定された範囲に正規化する
* 
* @param target 正規化する角度（ラジアン）
* @param noNegative trueの場合は[0, 2π)の範囲に、falseの場合は(-π, π]の範囲に正規化
* @returns 正規化された角度（ラジアン）
* 
* @example
* // [-π, π]の範囲に正規化
* normalizeRadian(3 * Math.PI); // returns -π
* 
* // [0, 2π)の範囲に正規化
* normalizeRadian(3 * Math.PI, true); // returns π
*/
function normalizeRadian(target: any, noNegative = false) {
 // 正規化の範囲を決定する関数
 const rangeFunc = noNegative
   ? function (val: any) {
       return !(val >= 0 && val < Math.PI * 2);  // [0, 2π)の範囲外
     }
   : function (val: any) {
       return !(val > -1 * Math.PI && val <= Math.PI);  // (-π, π]の範囲外
     };

 // 範囲内に収まるまで2πを加減算
 while (rangeFunc(target)) {
   target = target + 2 * Math.PI * (target > 0 ? -1 : 1);
 }
 return target;
}

export { transformArr, unitCalc };