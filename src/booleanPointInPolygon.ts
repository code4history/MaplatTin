import { Coord } from "@turf/helpers";
import { BBox, Feature, MultiPolygon, Polygon, GeoJsonProperties as Properties } from "geojson";
import { getCoord, getGeom } from "@turf/invariant";

// http://en.wikipedia.org/wiki/Even%E2%80%93odd_rule
// modified from: https://github.com/substack/point-in-polygon/blob/master/index.js
// which was modified from http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
/**
 * Takes a {@link Point} and a {@link Polygon} or {@link MultiPolygon} and determines if the point
 * resides inside the polygon. The polygon can be convex or concave. The function accounts for holes.
 *
 * @name booleanPointInPolygon
 * @param {Coord} point input point
 * @param {Feature<Polygon|MultiPolygon>} polygon input polygon or multipolygon
 * @param {Object} [options={}] Optional parameters
 * @param {boolean} [options.ignoreBoundary=false] True if polygon boundary should be ignored when determining if
 * the point is inside the polygon otherwise false.
 * @returns {boolean} `true` if the Point is inside the Polygon; `false` if the Point is not inside the Polygon
 * @example
 * var pt = turf.point([-77, 44]);
 * var poly = turf.polygon([[
 *   [-81, 41],
 *   [-81, 47],
 *   [-72, 47],
 *   [-72, 41],
 *   [-81, 41]
 * ]]);
 *
 * turf.booleanPointInPolygon(pt, poly);
 * //= true
 */
export default function booleanPointInPolygon<
  G extends Polygon | MultiPolygon,
  P = Properties
>(
  point: Coord,
  polygon: Feature<G, P> | G,
  options: {
    ignoreBoundary?: boolean;
  } = {}
) {
  // validation
  if (!point) {
    throw new Error("point is required");
  }
  if (!polygon) {
    throw new Error("polygon is required");
  }

  const pt = getCoord(point);
  const geom = getGeom(polygon as G);
  const type = geom.type;
  const bbox = polygon.bbox;
  let polys: any[] = geom.coordinates;

  // Quick elimination if point is not inside bbox
  if (bbox && !inBBox(pt, bbox)) {
    return false;
  }
  // normalize to multipolygon
  if (type === "Polygon") {
    polys = [polys];
  }
  let insidePoly = false;
  for (let i = 0; i < polys.length && !insidePoly; i++) {
    // check if it is in the outer ring first
    const res = pointInPolygon(pt, polys[i]);
    if ((res === 0 && !options.ignoreBoundary) || res) insidePoly = true;
  }
  return insidePoly;
}

/**
 * inBBox
 *
 * @private
 * @param {Position} pt point [x,y]
 * @param {BBox} bbox BBox [west, south, east, north]
 * @returns {boolean} true/false if point is inside BBox
 */
function inBBox(pt: number[], bbox: BBox) {
  return (
    bbox[0] <= pt[0] && bbox[1] <= pt[1] && bbox[2] >= pt[0] && bbox[3] >= pt[1]
  );
}

// This function is based on https://github.com/rowanwins/point-in-polygon-hao
// Because it did not work with TypeScript well, so I put it directly here.

function pointInPolygon(p: number[], polygon: number[][][]): boolean | 0 {
  let i = 0;
  let ii = 0;
  let k = 0;
  let f = 0;
  let u1 = 0;
  let v1 = 0;
  let u2 = 0;
  let v2 = 0;
  let currentP = null;
  let nextP = null;

  const x = p[0];
  const y = p[1];

  const numContours = polygon.length;
  for (i; i < numContours; i++) {
    ii = 0;
    const contourLen = polygon[i].length - 1;
    const contour = polygon[i];

    currentP = contour[0];
    u1 = currentP[0] - x;
    v1 = currentP[1] - y;

    for (ii; ii < contourLen; ii++) {
      nextP = contour[ii + 1];

      v2 = nextP[1] - y;

      if ((v1 < 0 && v2 < 0) || (v1 > 0 && v2 > 0)) {
        currentP = nextP;
        v1 = v2;
        u1 = currentP[0] - x;
        continue;
      }

      u2 = nextP[0] - p[0];

      if (v2 > 0 && v1 <= 0) {
        f = u1 * v2 - u2 * v1;
        if (f > 0) k = k + 1;
        else if (f === 0) return 0;
      } else if (v1 > 0 && v2 <= 0) {
        f = u1 * v2 - u2 * v1;
        if (f < 0) k = k + 1;
        else if (f === 0) return 0;
      } else if (v2 === 0 && v1 < 0) {
        f = u1 * v2 - u2 * v1;
        if (f === 0) return 0;
      } else if (v1 === 0 && v2 < 0) {
        f = u1 * v2 - u2 * v1;
        if (f === 0) return 0;
      } else if (v1 === 0 && v2 === 0) {
        if (u2 <= 0 && u1 >= 0) {
          return 0;
        } else if (u1 <= 0 && u2 >= 0) {
          return 0;
        }
      }
      currentP = nextP;
      v1 = v2;
      u1 = u2;
    }
  }

  if (k % 2 === 0) return false;
  return true;
}
