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

export class ArcIter {
  _xx: Float64Array | null;
  _yy: Float64Array | null;
  _zz: Float64Array | null;
  _arc: Arc | null;
  _i: number;
  _n: number;
  _inc: number;
  _useZ: boolean;
  x: number;
  y: number;
  z: number;

  constructor(
    xx: Float64Array | null,
    yy: Float64Array | null,
    zz?: Float64Array | null,
  );
  init(i: number, len: number, fw: boolean, zlim?: number): ArcIter;
  hasNext(): boolean;
  next(): void;
}

export class FilteredArcIter extends ArcIter {
  constructor();
}
