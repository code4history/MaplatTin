import { Position } from 'geojson';
import { VertexPosition } from "./types/tin.js";
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
 * 扇形外挿の縮尺と回転の推定方法。
 *
 * - `"min"`: 従来。縮尺は凸包の点の比の最小値、回転は重みなしの平均。V2・birdeye・world file 外周が使う。
 * - `"farLsq"`: 重心から遠い凸包の点の最小二乗（V3 の plain）。当てはまりが悪いときは `"min"` に戻る。
 */
export type RatioEstimator = "min" | "farLsq";
/**
 * Calculate boundary vertices in plain mode.
 *
 * @param params - Input parameters including GCPs, centroid, and bounding box.
 * @param v3 - When true (V3 format), runs the full 36-bin edge vertex pass
 *   (Phase 3) in addition to the 4 bbox corners, producing up to 36 vertices.
 *   When false (V2 format), returns only the 4 bbox corners.
 *
 * Plain mode uses a single aggregate [scale, rotation] ratio from all GCPs.
 * V3 estimates it by a least-squares fit to the hull points far from the
 * centroid; V2 keeps the minimum-ratio estimate.
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
/** 四隅と辺上の補助頂点を輪の順に並べ、地理側は world file の値で固定する。 */
export declare function calculateWorldFileVertices(params: BoundaryVerticesParams, project: (forw: Position) => Position): VertexPosition[];
export {};
