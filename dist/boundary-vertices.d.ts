import { Position } from 'geojson';
import { VertexPosition } from "./types/tin.d";
interface ConvexEntry {
    forw: Position;
    bakw: Position;
}
/**
 * Unified parameters for all boundary vertex computations (V2 and V3).
 *
 * `allGcps` must include **all** interior points: GCPs from `this.points` **and**
 * edge intermediate nodes from `this.edgeNodes`.  This is necessary so that
 * `checkAndAdjustVerticesN` can guarantee that every constrained-edge vertex in
 * bakw space lies inside the boundary polygon.
 */
export interface BoundaryVerticesParams {
    convexBuf: Record<string, ConvexEntry>;
    centroid: {
        forw: Position;
        bakw: Position;
    };
    /** GCPs + edge intermediate nodes */
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
 * Calculate boundary vertices in plain mode.
 *
 * @param params - Input parameters including GCPs, centroid, and bounding box.
 * @param v3 - When true (V3 format), runs the full 36-bin edge vertex pass
 *   (Phase 3) in addition to the 4 bbox corners, producing up to 36 vertices.
 *   When false (V2 format), returns only the 4 bbox corners.
 *
 * Plain mode uses a single aggregate [scale, rotation] ratio from all GCPs.
 */
export declare function calculatePlainVertices(params: BoundaryVerticesParams, v3?: boolean): VertexPosition[];
/**
 * Calculate boundary vertices in bird's-eye mode.
 *
 * @param params - Input parameters including GCPs, centroid, and bounding box.
 * @param v3 - When true (V3 format), runs the full 36-bin edge vertex pass
 *   (Phase 3) in addition to the 4 bbox corners, producing up to 36 vertices.
 *   When false (V2 format), returns only the 4 bbox corners.
 *
 * Birdeye mode uses per-quadrant [scale, rotation] ratios to capture
 * perspective distortion in the 4 corner positions.
 */
export declare function calculateBirdeyeVertices(params: BoundaryVerticesParams, v3?: boolean): VertexPosition[];
export {};
