import { Base, DelaunatorLike, intersectSegments as baseIntersectSegments } from "./base";
import { BitSet } from "./bitset";
export declare class Constrain extends Base {
    vertMap: Uint32Array;
    flips: BitSet;
    consd: BitSet;
    /**
     * Create a Constrain instance.
     *
     * @param del The triangulation output from Delaunator.
     * @param edges If provided, constrain these edges via constrainAll.
     */
    constructor(del: DelaunatorLike, edges?: readonly [number, number][]);
    /**
     * Constrain the triangulation such that there is an edge between p1 and p2.
     */
    constrainOne(segP1: number, segP2: number): number;
    /**
     * Fix the Delaunay condition.
     */
    delaunify(deep?: boolean): this;
    /**
     * Call constrainOne on each edge.
     */
    constrainAll(edges: readonly [number, number][]): this;
    /**
     * Whether an edge is constrained.
     */
    isConstrained(edg: number): boolean;
    /**
     * Find the edge that points from p1 -> p2. If there is only an edge from
     * p2 -> p1 (i.e. it is on the hull), returns the negative id of it.
     */
    findEdge(p1: number, p2: number): number;
    /**
     * Mark an edge as constrained, i.e. should not be touched by `delaunify`.
     */
    private protect;
    /**
     * Mark an edge as flipped unless constrained.
     */
    private markFlip;
    /**
     * Flip the edge shared by two triangles.
     */
    private flipDiagonal;
    /**
     * Whether point p1, p2, and p are collinear.
     */
    private isCollinear;
    /**
     * Whether the triangle formed by p1, p2, p3 keeps px outside the circumcircle.
     */
    private inCircle;
    /**
     * Whether the triangles sharing edg conform to the Delaunay condition.
     */
    private isDelaunay;
    /**
     * Update the vertex -> incoming edge map.
     */
    private updateVert;
    /**
     * Whether the segments between vertices intersect.
     */
    protected intersectSegments(p1: number, p2: number, p3: number, p4: number): boolean;
    static intersectSegments: typeof baseIntersectSegments;
}
