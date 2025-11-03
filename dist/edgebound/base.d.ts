export interface DelaunatorLike {
    coords: {
        readonly length: number;
        readonly [index: number]: number;
    };
    triangles: {
        readonly length: number;
        [index: number]: number;
    };
    halfedges: {
        readonly length: number;
        [index: number]: number;
    };
    hull: {
        readonly length: number;
        readonly [index: number]: number;
    };
}
export declare function nextEdge(edge: number): number;
export declare function prevEdge(edge: number): number;
/**
 * Compute if two line segments [p1, p2] and [p3, p4] intersect.
 */
export declare function intersectSegments(p1x: number, p1y: number, p2x: number, p2y: number, p3x: number, p3y: number, p4x: number, p4y: number): boolean;
export declare class Base {
    /**
     * The triangulation object from Delaunator.
     */
    del: DelaunatorLike;
    constructor(del: DelaunatorLike);
}
