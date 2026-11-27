import { Feature, Point } from 'geojson';
import { Edge, Tins } from '@maplat/transform';
import { BoundaryVerticesParams } from "./boundary-vertices.js";
import { VertexPosition } from "./types/tin.js";
/** V3 の境界生成時の診断。件数は地図面と地理面の三角網の合計。 */
export interface BoundaryDiagnostics {
    /** GCP の外接矩形の幅・高さに対する、各辺に加えた余白の割合。 */
    readonly margin: number;
    /**
     * 補助頂点を含む三角形のうち、向きが反転したか、面積が 0 のものの数。地図面で作った三角網と、
     * 地理面で独立に作った三角網（`loose` の経路で使うもの）の合計。`strict` で地理面の三角網を
     * 地図面から写して作る場合も、探索の判定に使った両面の値を返す（実際に使う三角網の反転の数とは
     * 一致しないことがある）。
     */
    readonly boundaryTriangleFlips: number;
    /** 同じ群の点だけででき、辺反転で解消できなかった三角形の数。 */
    readonly remainingForbiddenTriangles: number;
    /** world file 外周を指定した場合の要求方式。 */
    readonly requestedOuterTransform?: "worldFile";
    /** world file 外周を指定した場合に、実際に採用した方式。 */
    readonly outerTransform?: "worldFile" | "extrapolate";
    /** 上限までに使える world file 外周が見つからなかった。 */
    readonly fallbackReason?: "boundaryFlips";
}
export interface BoundaryCandidate {
    vertices: VertexPosition[];
    forw: Tins;
    bakw: Tins;
    diagnostics: BoundaryDiagnostics;
    /** 地図面で外周の辺を三角網の境界として確保できたか。 */
    hasMapBoundary: boolean;
    /** 両面で外周の辺を三角網の境界として確保できたか。 */
    hasBoundary: boolean;
}
/**
 * どの余白も合格しなかったときに、候補 a が b より良いか。
 * 両面で輪が閉じた候補を、反転の数より優先する（輪が閉じない候補は扇形の外挿が成り立たない）。
 * 同じ扱いの中では反転の少ない方。同数なら先に試した（小さい余白の）b を残す。
 */
export declare function isBetterBoundaryCandidate(a: {
    hasBoundary: boolean;
    diagnostics: Pick<BoundaryDiagnostics, "boundaryTriangleFlips">;
}, b: {
    hasBoundary: boolean;
    diagnostics: Pick<BoundaryDiagnostics, "boundaryTriangleFlips">;
} | undefined): boolean;
export declare function countBoundaryFlips(tin: Tins, expectedOrientation?: -1 | 1): number;
export declare function searchBoundary(params: BoundaryVerticesParams, calculateVertices: (params: BoundaryVerticesParams, v3: boolean) => VertexPosition[], points: {
    forw: Feature<Point>[];
    bakw: Feature<Point>[];
    edges: Edge[];
}, gcpCount: number, worldFile?: {
    orientation: -1 | 1;
    accept: (candidate: BoundaryCandidate) => boolean;
}): BoundaryCandidate | undefined;
