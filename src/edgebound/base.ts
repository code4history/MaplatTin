import { orient2d } from "robust-predicates";

export interface DelaunatorLike {
  coords: { readonly length: number; readonly [index: number]: number };
  triangles: { readonly length: number; [index: number]: number };
  halfedges: { readonly length: number; [index: number]: number };
  hull: { readonly length: number; readonly [index: number]: number };
}

export function nextEdge(edge: number): number {
  return edge % 3 === 2 ? edge - 2 : edge + 1;
}

export function prevEdge(edge: number): number {
  return edge % 3 === 0 ? edge + 2 : edge - 1;
}

/**
 * Compute if two line segments [p1, p2] and [p3, p4] intersect.
 */
export function intersectSegments(
  p1x: number,
  p1y: number,
  p2x: number,
  p2y: number,
  p3x: number,
  p3y: number,
  p4x: number,
  p4y: number,
): boolean {
  const x0 = orient2d(p1x, p1y, p3x, p3y, p4x, p4y);
  const y0 = orient2d(p2x, p2y, p3x, p3y, p4x, p4y);
  if ((x0 > 0 && y0 > 0) || (x0 < 0 && y0 < 0)) {
    return false;
  }

  const x1 = orient2d(p3x, p3y, p1x, p1y, p2x, p2y);
  const y1 = orient2d(p4x, p4y, p1x, p1y, p2x, p2y);
  if ((x1 > 0 && y1 > 0) || (x1 < 0 && y1 < 0)) {
    return false;
  }

  // Handle the degenerate collinear case
  if (x0 === 0 && y0 === 0 && x1 === 0 && y1 === 0) {
    return !(
      Math.max(p3x, p4x) < Math.min(p1x, p2x) ||
      Math.max(p1x, p2x) < Math.min(p3x, p4x) ||
      Math.max(p3y, p4y) < Math.min(p1y, p2y) ||
      Math.max(p1y, p2y) < Math.min(p3y, p4y)
    );
  }

  return true;
}

export class Base {
  /**
   * The triangulation object from Delaunator.
   */
  public del: DelaunatorLike;

  constructor(del: DelaunatorLike) {
    this.del = del;
  }
}
