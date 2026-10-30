export interface IntersectionPoint {
  x: number;
  y: number;
  a: number[];
  b: number[];
}

export type ArcCallback = (
  i: number,
  j: number,
  xx: Float64Array,
  yy: Float64Array,
) => void;
export type ForEachSegmentCallback = (
  v1: number,
  v2: number,
  xx: Float64Array,
  yy: Float64Array,
) => void;

export interface Arc {
  i: number;
  j: number;
}
