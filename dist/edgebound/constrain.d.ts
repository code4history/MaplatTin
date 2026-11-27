import { Base, DelaunatorLike, intersectSegments as baseIntersectSegments } from "./base.js";
import { BitSet } from "./bitset.js";
/**
 * 制約を張った途中の三角網の状態。{@link Constrain.snapshot} で控え、{@link Constrain.restore} で
 * 同じ状態から続きを張る（同じ制約を何度も張り直さずに済む）。
 */
export interface ConstrainSnapshot {
    coords: DelaunatorLike["coords"];
    hull: DelaunatorLike["hull"];
    triangles: Uint32Array;
    halfedges: Int32Array;
    vertMap: Uint32Array;
    flips: ReturnType<BitSet["copyBits"]>;
    consd: ReturnType<BitSet["copyBits"]>;
    /** 全部の辺の Delaunay 性の掃除（{@link Constrain.delaunify} の最初の 1 回）が済んでいるか。 */
    cleaned: boolean;
}
export declare class Constrain extends Base {
    vertMap: Uint32Array;
    flips: BitSet;
    consd: BitSet;
    /**
     * 全部の辺を調べる掃除（{@link delaunify} の最初の 1 回）が済んでいるか。済んだ後は、
     * 反転で触った辺（`flips` の印がある辺）だけを調べれば Delaunay 性が保たれる。
     * 掃除は制約を 1 本張るとき（`delaunify(true)`）にしか走らないので、制約を 1 本も張っていない網や、
     * 張った制約がすべて初めからある辺だった網は、まだ済んでいない。
     */
    cleaned: boolean;
    /**
     * Create a Constrain instance.
     *
     * @param del The triangulation output from Delaunator.
     * @param edges If provided, constrain these edges via constrainAll.
     */
    constructor(del: DelaunatorLike, edges?: readonly [number, number][]);
    /** 現在の三角網と制約の状態を控える（三角網の配列は複製する）。 */
    snapshot(): ConstrainSnapshot;
    /** {@link snapshot} で控えた状態を、新しい配列に複製して復元する（控えは何度でも使える）。 */
    static restore(snapshot: ConstrainSnapshot): Constrain;
    /**
     * Constrain the triangulation such that there is an edge between p1 and p2.
     */
    constrainOne(segP1: number, segP2: number): number;
    /**
     * Upper bound for the number of steps taken while constraining one edge.
     *
     * A constraint that crosses k edges is resolved in passes over the crossed
     * edges, so the number of steps can grow with k squared (for example when
     * the crossed edges fan out between two bowed rows of points). k is less
     * than the number of half-edges, so the square of that number is never
     * reached by a walk that terminates. The floor keeps tiny meshes away from
     * the limit.
     */
    private maxConstrainSteps;
    /**
     * Throw unless `vertex` is part of the triangulation. Delaunator leaves out
     * points that coincide with another point, so a valid point id may have no
     * triangle. An edge cannot start or end at such a point.
     */
    private assertInTriangulation;
    /**
     * Throw unless `vertex` is an id of a point given to Delaunator.
     */
    private assertVertex;
    /**
     * Fix the Delaunay condition.
     *
     * 最初の 1 回（`deep` で、まだ掃除が済んでいないとき）だけは、制約でない全部の辺を調べる。
     * Delaunator の外接円の判定は浮動小数点なので、厳密な述語での掃除を 1 回は通すため。
     * その後は、反転で触った辺（`flips` の印がある辺）だけを調べる。掃除の後に Delaunay でなくなりうるのは、
     * 反転で触った辺とその周りだけで、{@link flipDiagonal} はそこに印を付けるから、結果は変わらない。
     */
    delaunify(deep?: boolean): this;
    /**
     * Call constrainOne on each edge.
     */
    constrainAll(edges: readonly [number, number][]): this;
    /**
     * 同じ群に属する点だけでできた三角形を、制約でない辺の反転で解消する（禁止制約）。
     *
     * 群の例: 四辺形の補助頂点の全体、必須エッジごとの端点と中継点。四辺形では角の前後の補助頂点を
     * 結ぶ弦（角と凸包の GCP の間をせき止める辺）が、必須エッジでは途中の点を飛ばす弦（片方の面で
     * 一直線に並び面積 0 になる三角形の辺）が反転される。
     *
     * 反転は、反転後の 2 つの三角形が `planes` のすべての面で、その面の三角網の向き（三角形の向きの
     * 多数決）と同じ向きの、面積 0 でない三角形になるときだけ行う。制約された辺・外周の辺は反転しない。
     * 違反が無くなるか、1 周して反転が起きなくなったら止める。
     *
     * @param groupsOf 点の番号から、その点が属する群の番号の配列（属さなければ空）
     * @param planes 向きを確かめる面の座標（`coords` と同じ並び）。既定は三角網を作った面だけ
     * @returns 反転した数と、解消できずに残った違反の三角形の数
     */
    forbidGroupTriangles(groupsOf: (vertex: number) => readonly number[], planes?: readonly ArrayLike<number>[]): {
        flips: number;
        remaining: number;
    };
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
