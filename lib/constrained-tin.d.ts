import { FeatureCollection } from "@turf/helpers";
type Edge = [number, number];
export default function (points: FeatureCollection, edges: Edge[], z: string): FeatureCollection<import("@turf/helpers").Polygon, any>;
export {};
