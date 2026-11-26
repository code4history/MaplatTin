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
    /**
     * 補助頂点の輪の手当て（strict にならないときだけ使う。MaplatTin#98）。省略すると 36 区分の全部。
     * `skipBins` の区分（重心から見た紙の角度を 10° ごとに区切った番号）の補助頂点は作らない。
     * `cornersOnly` は四隅だけにする（縮尺と回転の推定は変えない）。
     */
    ring?: RingOptions;
}
/** 補助頂点の輪の手当て。 */
export interface RingOptions {
    skipBins?: ReadonlySet<number>;
    cornersOnly?: boolean;
}
/**
 * 扇形外挿の縮尺と回転の推定方法。
 *
 * - `"min"`: 従来。縮尺は凸包の点の比の最小値、回転は重みなしの平均。V2・birdeye・world file 外周が使う。
 * - `"farLsq"`: 重心から遠い凸包の点の最小二乗（V3 の plain）。当てはまりが悪いときは `"min"` に戻る。
 */
export type RatioEstimator = "min" | "farLsq";
/** 重心から見た紙の位置の区分の番号（10° ごと、0〜35）。 */
export declare function ringBinOf(forw: Position, centroidForw: Position): number;
/**
 * 線分 a-b と線分 c-d の交点を、turf の `lineIntersect(lineString([a, b]), lineString([c, d]))` が最初に
 * 返す交点と、座標が 1 ビットも違わないように求める（交わらなければ null）。
 *
 * turf は GeoJSON の地物を作り、掃引線法で交差を調べる。2 本の線分だけなら、その中身は次のとおり。
 * 左端（x が小さい方。x が同じなら y が小さい方）が先の線分を seg2、後の線分を seg1 として、
 * 後の左端の時点で先の線分がまだ続いていれば、`orient2d`（厳密な述語）で両側にあるかを調べ、
 * 交点を `x1 + uA * (x2 - x1)` で求める。ここではその手順をスカラーで再現する。
 *
 * 2 本の線分の端点どうしで x が一致するとき（端点を共有するときを含む）と、線分の長さが 0 のときは、
 * turf のイベントの並べ方が入力の順に依るため、再現せずに turf を呼ぶ。
 */
export declare function firstSegmentIntersection(a: Position, b: Position, c: Position, d: Position): Position | null;
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
