import { polygon } from "@turf/helpers";
import { Position } from "geojson";
import { PropertyTriKey, Tri, Tins } from "./geometry";

/**
 * 三角形の頂点の順序を修正する
 * 地図外郭の頂点を含む三角形について、頂点の順序を統一する
 * @param tins 三角形群
 * @returns 頂点順序が修正された三角形群
 */
function rotateVerticesTriangle(tins: Tins) {
  const features = tins.features;
  for (let i = 0; i < features.length; i++) {
    const feature = features[i];
    if (
      `${feature.properties!.a.index}`.substring(0, 1) === "b" &&
      `${feature.properties!.b.index}`.substring(0, 1) === "b"
    ) {
      features[i] = {
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              feature.geometry!.coordinates[0][2],
              feature.geometry!.coordinates[0][0],
              feature.geometry!.coordinates[0][1],
              feature.geometry!.coordinates[0][2]
            ]
          ]
        },
        properties: {
          a: {
            geom: feature.properties!.c.geom,
            index: feature.properties!.c.index
          },
          b: {
            geom: feature.properties!.a.geom,
            index: feature.properties!.a.index
          },
          c: {
            geom: feature.properties!.b.geom,
            index: feature.properties!.b.index
          }
        },
        type: "Feature"
      };
    } else if (
      `${feature.properties!.c.index}`.substring(0, 1) === "b" &&
      `${feature.properties!.a.index}`.substring(0, 1) === "b"
    ) {
      features[i] = {
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              feature.geometry!.coordinates[0][1],
              feature.geometry!.coordinates[0][2],
              feature.geometry!.coordinates[0][0],
              feature.geometry!.coordinates[0][1]
            ]
          ]
        },
        properties: {
          a: {
            geom: feature.properties!.b.geom,
            index: feature.properties!.b.index
          },
          b: {
            geom: feature.properties!.c.geom,
            index: feature.properties!.c.index
          },
          c: {
            geom: feature.properties!.a.geom,
            index: feature.properties!.a.index
          }
        },
        type: "Feature"
      };
    }
  }
  return tins;
}

/**
 * 三角形の頂点の座標系を反転する
 * @param tri 元の三角形
 * @returns 座標系が反転された三角形
 */
function counterTri(tri: Tri): Tri {
  const coordinates = (["a", "b", "c", "a"] as PropertyTriKey[]).map(
    key => tri.properties![key].geom
  );
  const geoms = tri.geometry!.coordinates[0];
  const props = tri.properties!;
  const properties = {
    a: { geom: geoms[0], index: props["a"].index },
    b: { geom: geoms[1], index: props["b"].index },
    c: { geom: geoms[2], index: props["c"].index }
  };
  return polygon([coordinates], properties);
}

/**
 * 頂点座標群から三角形を生成する
 * @param points 頂点座標群 [座標, インデックス][]
 * @returns 生成された三角形
 */
function buildTri(points: [Position[], string | number][]): Tri {
  const coordinates = [0, 1, 2, 0].map(i => points[i][0][0]);
  const properties = {
    a: { geom: points[0][0][1], index: points[0][1] },
    b: { geom: points[1][0][1], index: points[1][1] },
    c: { geom: points[2][0][1], index: points[2][1] }
  };
  return polygon([coordinates], properties);
}

/**
 * インデックス配列から三角形を生成する
 * @param indexes インデックス配列
 * @param points 点群座標
 * @param edgeNodes エッジノード座標
 * @param cent 重心座標
 * @param bboxes バウンディングボックス座標
 * @param bakw 座標系を反転するかどうか
 * @param version バージョン番号（オプション）
 * @returns 生成された三角形
 */
function indexesToTri(
  indexes: (number | string)[],
  points: Position[][],
  edgeNodes: Position[][],
  cent: Position[],
  bboxes: Position[][],
  bakw = false,
  version?: number
): Tri {
  const points_: [Position[], string | number][] = indexes.map(
    (index: number | string) => {
      if (!version || version < 2.00703) index = normalizeNodeKey(index);
      const point_base = isFinite(index as any)
        ? points[index as number]
        : index === "c"
        ? cent
        : index === "b0"
        ? bboxes[0]
        : index === "b1"
        ? bboxes[1]
        : index === "b2"
        ? bboxes[2]
        : index === "b3"
        ? bboxes[3]
        : (function () {
            const match = (index as string).match(/e(\d+)/);
            if (match) {
              const nodeIndex = parseInt(match[1]);
              return edgeNodes[nodeIndex];
            }
            throw "Bad index value for indexesToTri";
          })();
      return bakw
        ? [[point_base![1], point_base![0]], index]
        : [[point_base![0], point_base![1]], index];
    }
  );
  return buildTri(points_);
}

// After 7.0.3 Normalizing node index key
function normalizeNodeKey(index: number | string) {
  if (typeof index === "number") return index;
  return index.replace(/^(c|e|b)(?:ent|dgeNode|box)(\d+)?$/, "$1$2");
}

export { 
  rotateVerticesTriangle,
  counterTri,
  indexesToTri,
  normalizeNodeKey
};