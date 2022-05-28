import { polygon, featureCollection } from "@turf/helpers";
import cdt2d from "cdt2d";
export default function (points, edges, z) {
    if (!edges)
        edges = [];
    if (typeof points !== "object" || points.type !== "FeatureCollection")
        throw "Argument points must be FeatureCollection";
    if (!Array.isArray(edges))
        throw "Argument points must be Array of Array";
    const del_points = points.features.map(point => point.geometry.coordinates);
    const tris = cdt2d(del_points, edges);
    const keys = ["a", "b", "c"];
    return featureCollection(tris.map(indices => {
        const properties = {};
        const coords = indices.map((index, i) => {
            const point = points.features[index];
            const xyz = point.geometry.coordinates;
            const coord = [xyz[0], xyz[1]];
            if (xyz.length === 3) {
                coord[2] = xyz[2];
            }
            else {
                properties[keys[i]] = point.properties[z];
            }
            return coord;
        });
        coords[3] = coords[0];
        return polygon([coords], properties);
    }));
}
//# sourceMappingURL=constrained-tin.js.map