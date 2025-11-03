import { Position } from 'geojson';
import { VertexPosition } from "./types/tin.d";
interface ConvexEntry {
    forw: Position;
    bakw: Position;
}
interface BoundaryVerticesParams {
    convexBuf: Record<string, ConvexEntry>;
    centroid: {
        forw: Position;
        bakw: Position;
    };
    bbox: Position[];
    minx: number;
    maxx: number;
    miny: number;
    maxy: number;
}
/**
 * Calculate the standard four boundary vertices around the centroid.
 */
export declare function calculatePlainVertices(params: BoundaryVerticesParams): VertexPosition[];
/**
 * Calculate boundary vertices for bird's-eye mode using quadrant-aware ratios.
 */
export declare function calculateBirdeyeVertices(params: BoundaryVerticesParams): VertexPosition[];
export {};
