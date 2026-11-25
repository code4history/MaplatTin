import { Feature, Point } from 'geojson';
import { Edge, Tins } from '@maplat/transform';
import { BoundaryVerticesParams } from "./boundary-vertices.js";
import { VertexPosition } from "./types/tin.js";
/** V3 の境界生成時の診断。件数は地図面と地理面の三角網の合計。 */
export interface BoundaryDiagnostics {
    /** GCP の外接矩形の幅・高さに対する、各辺に加えた余白の割合。 */
    readonly margin: number;
    /** 補助頂点を含む三角形のうち、向きが反転したか、面積が 0 のものの数。 */
    readonly boundaryTriangleFlips: number;
    /** 同じ群の点だけででき、辺反転で解消できなかった三角形の数。 */
    readonly remainingForbiddenTriangles: number;
}
interface BoundaryCandidate {
    vertices: VertexPosition[];
    forw: Tins;
    bakw: Tins;
    diagnostics: BoundaryDiagnostics;
}
export declare function searchBoundary(params: BoundaryVerticesParams, calculateVertices: (params: BoundaryVerticesParams, v3: boolean) => VertexPosition[], points: {
    forw: Feature<Point>[];
    bakw: Feature<Point>[];
    edges: Edge[];
}, gcpCount: number): BoundaryCandidate;
export {};
