import { FeatureCollection, Point, Polygon, Position } from 'geojson';
export interface PointsSetBD {
    forw: FeatureCollection<Point>;
    bakw: FeatureCollection<Point>;
    edges: number[][];
}
export interface VertexDelta {
    forw: [number, number];
    bakw?: [number, number];
}
/**
 * 三角形ごとの重み付き補間のバッファ（旧 compiled の weight_buffer の中身の形）。
 *
 * @deprecated 1.1.0（compiled 2.00704／3.00001）で weight_buffer の算出を廃止したため、Tin はこの型を使わない（MaplatTin#48）。代わりの型は無い。2.0.0 で削除する
 */
export interface WeightBuffer {
    [target: string]: {
        [vertexKey: string]: {
            [edgeKey: string]: number;
        };
    };
}
export type LengthItem = [Position, number, number, number, string?];
export interface EdgeProperties {
    a?: unknown;
    b?: unknown;
    c?: unknown;
    index?: string | number;
    geom?: Position;
    target?: {
        geom: Position;
        index: string | number;
    };
}
export type VertexParams = [number[], FeatureCollection<Polygon>[]];
export interface TriangleProperties {
    a?: unknown;
    b?: unknown;
    c?: unknown;
}
export interface VertexPosition {
    forw: Position;
    bakw: Position;
}
export interface ExpandConvexItem {
    forw: Position;
    bakw: Position;
}
export type ExpandConvexArray = ExpandConvexItem[][];
