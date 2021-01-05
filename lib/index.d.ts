import { Feature, FeatureCollection, Polygon, Point, Position } from "@turf/turf";
declare type VertexMode = "plain" | "birdeye";
declare type StrictMode = "strict" | "auto" | "loose";
declare type StrictStatus = "strict" | "strict_error" | "loose";
declare type YaxisMode = "follow" | "invert";
declare type PointSet = [Position, Position];
declare type Centroid = {
    forw: Feature<Point>;
    bakw: Feature<Point>;
};
declare type Edge = {
    illstNodes: Position[];
    mercNodes: Position[];
    startEnd: number[];
};
declare type Tins = {
    forw: FeatureCollection<Polygon>;
    bakw?: FeatureCollection<Polygon>;
};
declare type WeightBuffer = {
    [index: string]: number;
};
declare type Kinks = {
    forw?: FeatureCollection<Point>;
    bakw?: FeatureCollection<Point>;
};
declare type VerticesParams = {
    forw: [number[], FeatureCollection<Polygon>[]?];
    bakw: [number[], FeatureCollection<Polygon>[]?];
};
export interface Options {
    bounds: Position[];
    wh: number[];
    vertexMode: VertexMode;
    strictMode: StrictMode;
    yaxisMode: YaxisMode;
    importance: number;
    priority: number;
    stateFull: boolean;
    points: PointSet[];
    edges: Edge[];
}
export interface Compiled {
    tins?: Tins;
    centroid?: Centroid;
    kinks?: Kinks;
    points: PointSet[];
    tins_points: number[][];
    weight_buffer: WeightBuffer;
    strict_status?: StrictStatus;
    centroid_point: Position[];
    edgeNodes?: PointSet[];
    kinks_points?: Position[];
    yaxisMode?: YaxisMode;
    vertices_params: number[][] | VerticesParams;
    vertices_points: PointSet[];
    edges: Edge[];
    bounds?: number[][];
    boundsPolygon?: Feature<Polygon>;
    wh?: number[];
    xy?: number[];
}
declare class Tin {
    static VERTEX_PLAIN: "plain";
    static VERTEX_BIRDEYE: "birdeye";
    static MODE_STRICT: "strict";
    static MODE_AUTO: "auto";
    static MODE_LOOSE: "loose";
    static STATUS_STRICT: "strict";
    static STATUS_ERROR: "strict_error";
    static STATUS_LOOSE: "loose";
    static YAXIS_FOLLOW: "follow";
    static YAXIS_INVERT: "invert";
    bounds?: number[][];
    boundsPolygon?: Feature<Polygon>;
    centroid?: Centroid;
    edgeNodes?: PointSet[];
    edges?: Edge[];
    importance: number;
    indexedTins: any;
    kinks?: Kinks;
    points: PointSet[];
    pointsWeightBuffer?: WeightBuffer;
    priority: number;
    stateBackward: any;
    stateFull: boolean;
    stateTriangle: any;
    strictMode: StrictMode;
    strict_status?: StrictStatus;
    tins?: Tins;
    vertexMode?: VertexMode;
    vertices_params?: VerticesParams;
    wh?: number[];
    xy?: number[];
    yaxisMode: YaxisMode;
    pointsSet: any;
    constructor(options?: Partial<Options>);
    setPoints(points: PointSet[]): void;
    setEdges(edges?: Edge[]): void;
    setBounds(bounds: number[][]): void;
    setCompiled(compiled: Compiled): {
        tins: Tins | undefined;
        strict_status: "strict" | "loose" | "strict_error" | undefined;
        weight_buffer: WeightBuffer;
        vertices_params: VerticesParams;
        centroid: Centroid | undefined;
        kinks: Kinks | undefined;
    };
    getCompiled(): Compiled;
    addIndexedTin(): void;
    setWh(wh: number[]): void;
    setVertexMode(mode: VertexMode): void;
    setStrictMode(mode: StrictMode): void;
    calcurateStrictTinAsync(): Promise<void>;
    generatePointsSet(): {
        forw: FeatureCollection<import("@turf/helpers").Geometry, import("@turf/helpers").Properties>;
        bakw: FeatureCollection<import("@turf/helpers").Geometry, import("@turf/helpers").Properties>;
        edges: number[][];
    };
    updateTinAsync(): Promise<unknown>;
    transform(apoint: number[], backward?: boolean, ignoreBounds?: boolean): false | any[];
    calculatePointsWeightAsync(): Promise<void>;
}
export default Tin;
