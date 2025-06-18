import type { FeatureCollection, Point, Polygon, Position } from "geojson";

export interface PointsSetBD {
  forw: FeatureCollection<Point>;
  bakw: FeatureCollection<Point>;
  edges: number[][];
}

export interface VertexDelta {
  forw: [number, number];
  bakw?: [number, number];
}

export interface WeightBuffer {
  [target: string]: {
    [vertexKey: string]: {
      [edgeKey: string]: number;
    };
  };
}

export type LengthItem = [Position, number, number, number, string?];

export interface EdgeProperties {
  a?: any;
  b?: any;
  c?: any;
  index?: string | number;
  geom?: Position;
  target?: {
    geom: Position;
    index: string | number;
  };
}

export type VertexParams = [number[], FeatureCollection<Polygon>[]];

export interface TriangleProperties {
  a?: any; // This should match the z parameter type from @maplat/transform
  b?: any;
  c?: any;
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
