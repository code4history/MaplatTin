import { polygon, featureCollection, FeatureCollection } from "@turf/helpers";
import cdt2d from "cdt2d"

type Edge = [number, number];

export default function (points: FeatureCollection, edges: Edge[], z: string) {
    if (!edges) edges = [];
    if (typeof points !== "object" || points.type !== "FeatureCollection")
        throw "Argument points must be FeatureCollection";
    if (!Array.isArray(edges)) throw "Argument points must be Array of Array";

    const del_points = points.features.map(point => (point.geometry as any).coordinates as [number, number]);
    const tris = cdt2d(del_points, edges) as number[][];

    const keys = ["a", "b", "c"] as const;
    return featureCollection(
        tris.map(indices => {
            const properties: any = {};
            const coords = indices.map((index, i) => {
                const point = points.features[index];
                const xyz = (point.geometry as any).coordinates as number[];
                const coord: number[] = [xyz[0], xyz[1]];
                if (xyz.length === 3) {
                    coord[2] = xyz[2]
                } else {
                    properties[keys[i]] = point.properties![z];
                }
                return coord;
            });
            coords[3] = coords[0];
            return polygon([coords], properties);
        })
    );
}