import { Feature, FeatureCollection, Polygon, Point, Position } from "@turf/turf";
declare type VertexMode = "plain" | "birdeye";
declare type StrictMode = "strict" | "auto" | "loose";
declare type StrictStatus = "strict" | "strict_error" | "loose";
declare type YaxisMode = "follow" | "invert";
declare type BiDirectionKey = "forw" | "bakw";
declare type PointSet = [Position, Position];
declare type Centroid = Feature<Point>;
declare type CentroidBD = {
    [key in BiDirectionKey]?: Centroid;
};
declare type EdgeLegacy = {
    illstNodes: Position[];
    mercNodes: Position[];
    startEnd: number[];
};
declare type Edge = [Position[], Position[], number[]];
declare type WeightBuffer = {
    [index: string]: number;
};
declare type WeightBufferBD = {
    [key in BiDirectionKey]?: WeightBuffer;
};
declare type Kinks = FeatureCollection<Point>;
declare type KinksBD = {
    [key in BiDirectionKey]?: Kinks;
};
declare type VerticesParams = [number[], FeatureCollection<Polygon>[]?];
declare type VerticesParamsBD = {
    [key in BiDirectionKey]?: VerticesParams;
};
declare type PropertyTri = {
    geom: Position;
    index: number | string;
};
declare type PropertyTriKey = "a" | "b" | "c";
declare type PropertiesTri = {
    [key in PropertyTriKey]: PropertyTri;
};
declare type Tri = Feature<Polygon, PropertiesTri>;
declare type Tins = FeatureCollection<Polygon, PropertiesTri>;
declare type TinsBD = {
    [key in BiDirectionKey]?: Tins;
};
interface IndexedTins {
    gridNum: number;
    xOrigin: number;
    yOrigin: number;
    xUnit: number;
    yUnit: number;
    gridCache: number[][][];
}
declare type IndexedTinsBD = {
    [key in BiDirectionKey]?: IndexedTins;
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
    version?: number;
    points: PointSet[];
    tins_points: (number | string)[][][];
    weight_buffer: WeightBufferBD;
    strict_status?: StrictStatus;
    centroid_point: Position[];
    edgeNodes?: PointSet[];
    kinks_points?: Position[];
    yaxisMode?: YaxisMode;
    vertexMode?: VertexMode;
    strictMode?: StrictMode;
    vertices_params: number[][];
    vertices_points: PointSet[];
    edges: Edge[];
    bounds?: number[][];
    boundsPolygon?: Feature<Polygon>;
    wh?: number[];
    xy?: number[];
}
interface LegacyCompiled extends Compiled {
    tins?: TinsBD;
    centroid?: CentroidBD;
    kinks?: KinksBD;
    vertices_params: number[][] & VerticesParamsBD;
    edges: Edge[] & EdgeLegacy[];
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
    centroid?: CentroidBD;
    edgeNodes?: PointSet[];
    edges?: Edge[];
    importance: number;
    indexedTins?: IndexedTinsBD;
    kinks?: KinksBD;
    points: PointSet[];
    pointsWeightBuffer?: WeightBufferBD;
    priority: number;
    stateBackward?: boolean;
    stateFull: boolean;
    stateTriangle?: Tri;
    strictMode: StrictMode;
    strict_status?: StrictStatus;
    tins?: TinsBD;
    vertexMode?: VertexMode;
    vertices_params?: VerticesParamsBD;
    wh?: number[];
    xy?: number[];
    yaxisMode: YaxisMode;
    pointsSet: any;
    constructor(options?: Partial<Options>);
    getFormatVersion(): number;
    setPoints(points: PointSet[]): void;
    setEdges(edges?: Edge[] | EdgeLegacy[]): void;
    setBounds(bounds: number[][]): void;
    setCompiled(compiled: LegacyCompiled): {
        tins: TinsBD | undefined;
        strict_status: "strict" | "loose" | "strict_error" | undefined;
        weight_buffer: WeightBufferBD;
        vertices_params: VerticesParamsBD;
        centroid: CentroidBD | undefined;
        kinks: KinksBD | undefined;
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
    transform(apoint: number[], backward?: boolean, ignoreBounds?: boolean): false | Position;
    calculatePointsWeightAsync(): Promise<void>;
}
export default Tin;
