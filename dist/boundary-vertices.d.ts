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
export interface BoundaryVerticesV3Params {
    convexBuf: Record<string, ConvexEntry>;
    centroid: {
        forw: Position;
        bakw: Position;
    };
    /** All GCPs as { forw, bakw } pairs — used for bin-based selection. */
    allGcps: Array<{
        forw: Position;
        bakw: Position;
    }>;
    minx: number;
    maxx: number;
    miny: number;
    maxy: number;
}
/**
 * Calculate boundary vertices for Format Version 3 plain mode.
 *
 * Algorithm: "10°-Uniform Bins + Corner Priority"
 *  - 36 bins of 10° each uniformly partition the 360° around the centroid.
 *  - The 4 bbox corners each claim the bin they fall into (up to 4 corner bins).
 *  - Each remaining bin selects the most-exterior GCP (max forw distance from
 *    centroid) in that angular range.
 *  - forw edge point = centroid_forw → selected_GCP_forw ray ∩ forw bbox
 *  - bakw edge point = centroid_bakw → selected_GCP_bakw ray ∩ bakw quad
 *    (computed independently — NOT via transform()).
 *  - Allocation per side is automatically proportional to each side's arc span.
 *
 * @returns Sorted list of up to 36 boundary vertices.
 */
export declare function calculatePlainVerticesV3(params: BoundaryVerticesV3Params): VertexPosition[];
export {};
