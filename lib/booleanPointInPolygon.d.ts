import { Coord, Feature, MultiPolygon, Polygon, Properties } from "@turf/helpers";
export default function booleanPointInPolygon<G extends Polygon | MultiPolygon, P = Properties>(point: Coord, polygon: Feature<G, P> | G, options?: {
    ignoreBoundary?: boolean;
}): boolean;
