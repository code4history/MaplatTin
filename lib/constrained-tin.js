import { polygon, featureCollection } from "@turf/helpers";
import Delaunator from "delaunator";
import Constrainautor from "@kninnug/constrainautor";
export default function (points, edges, z) {
    if (!edges)
        edges = [];
    if (typeof points !== "object" || points.type !== "FeatureCollection")
        throw "Argument points must be FeatureCollection";
    if (!Array.isArray(edges))
        throw "Argument points must be Array of Array";
    const del_points = points.features.map(point => point.geometry.coordinates);
    let del = Delaunator.from(del_points);
    let con;
    const tris = [];
    if (del.triangles.length !== 0 && edges.length !== 0) {
        con = new Constrainautor(del);
        con.delaunify(true);
        del = con.del;
    }
    for (let i = 0; i < del.triangles.length; i += 3) {
        tris.push([
            del.triangles[i],
            del.triangles[i + 1],
            del.triangles[i + 2]
        ]);
    }
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