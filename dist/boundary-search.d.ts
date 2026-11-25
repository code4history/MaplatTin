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
}
interface BoundaryCandidate {
    vertices: VertexPosition[];
    forw: Tins;
    bakw: Tins;
    diagnostics: BoundaryDiagnostics;
    /** 両面で補助頂点の輪が閉じた（扇形が星形で、輪の外に GCP・中継点が無い）か。 */
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
export declare function searchBoundary(params: BoundaryVerticesParams, calculateVertices: (params: BoundaryVerticesParams, v3: boolean) => VertexPosition[], points: {
    forw: Feature<Point>[];
    bakw: Feature<Point>[];
    edges: Edge[];
}, gcpCount: number): BoundaryCandidate;
export {};
