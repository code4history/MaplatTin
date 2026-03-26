import { Position, Feature, Point, FeatureCollection, GeoJsonProperties, Polygon } from 'geojson';
import { Compiled, PointSet, StrictStatus, Tins, WeightBufferBD, EdgeSet, YaxisMode, StrictMode, VertexMode } from '@maplat/transform';
/**
 * Build an array of N sector Tins for use in useVerticesArr().
 *
 * Sector i = triangle (centroid="c", b_i, b_{(i+1)%N}).
 */
export declare function buildVertexTinsV3(compiled: Compiled, bakw: boolean): Tins[];
/**
 * Restore the in-memory state from a v3 (or later) compiled payload.
 *
 * This mirrors restoreModernState() in @maplat/transform but uses N-vertex
 * variants wherever the base implementation is hardcoded to 4.
 */
export declare function restoreV3State(compiled: Compiled): {
    points: PointSet[];
    pointsWeightBuffer: WeightBufferBD;
    strictStatus: StrictStatus;
    verticesParams: {
        forw: [number[], Tins[]];
        bakw: [number[], Tins[]];
    };
    centroid: {
        forw: Feature<Point, {
            target: {
                geom: Position;
                index: string;
            };
        }>;
        bakw: Feature<Point, {
            target: {
                geom: Position;
                index: string;
            };
        }>;
    };
    edges: EdgeSet[];
    edgeNodes: PointSet[];
    tins: {
        forw: Tins;
        bakw: Tins;
    };
    kinks: {
        bakw: FeatureCollection<Point, GeoJsonProperties>;
    } | undefined;
    yaxisMode: YaxisMode;
    strictMode: StrictMode;
    vertexMode: VertexMode | undefined;
    bounds: number[][] | undefined;
    boundsPolygon: Feature<Polygon, GeoJsonProperties> | undefined;
    wh: number[] | undefined;
    xy: number[];
};
