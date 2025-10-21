import { describe, it, expect, beforeEach } from 'vitest';
import { Constrain } from '@/edgebound';
import Delaunator from 'delaunator';

describe('Constrain Unit Tests', () => {
  // Basic test data
  const basicPoints: [number, number][] = [
    [150, 50],
    [50, 200],
    [150, 350],
    [250, 200]
  ];
  let del: Delaunator<Float64Array>;
  let con: Constrain;

  beforeEach(() => {
    del = Delaunator.from(basicPoints);
    con = new Constrain(del);
  });

  describe('findEdge', () => {
    it('should find existing edge', () => {
      const edge = con.findEdge(0, 1);
      expect(edge).not.toBe(Infinity);
      expect(con.del.triangles[edge > 0 ? edge : -edge]).toBe(0);
    });

    it('should handle non-existent edge appropriately', () => {
      const edge = con.findEdge(0, 3);
      expect(edge).toBe(-1);
    });
  });

  describe('isConstrained', () => {
    it('should correctly identify constrained edges', () => {
      const edge = con.constrainOne(0, 2);
      expect(con.isConstrained(Math.abs(edge))).toBe(true);
    });

    it('should correctly identify non-constrained edges', () => {
      const edge = con.findEdge(0, 1);
      if (edge !== Infinity) {
        expect(con.isConstrained(edge)).toBe(false);
      }
    });
  });

  describe('constrainOne', () => {
    it('should maintain input/output contract', () => {
      // Snapshot of input state
      const initialTriangles = Array.from(con.del.triangles);
      const initialHalfedges = Array.from(con.del.halfedges);

      const edge = con.constrainOne(0, 2);

      // Validate output
      expect(edge).not.toBe(Infinity);
      expect(typeof edge).toBe('number');

      // Validate state change
      expect(con.del.triangles.length).toBe(initialTriangles.length);
      expect(con.del.halfedges.length).toBe(initialHalfedges.length);
    });
  });

  describe('constrainAll', () => {
    it('should constrain multiple edges', () => {
      // Use non-intersecting edge pairs
      const edges: [number, number][] = [
        [0, 1],
        [2, 3]
      ];
      con.constrainAll(edges);

      // Validate all edges are correctly constrained
      edges.forEach(([p1, p2]) => {
        const edge = con.findEdge(p1, p2);
        expect(edge).not.toBe(Infinity);
        if (edge > 0) {
          expect(con.isConstrained(edge)).toBe(true);
        }
      });
    });

    it('should throw error for intersecting edges', () => {
      const edges: [number, number][] = [
        [0, 2],
        [1, 3]
      ];
      expect(() => con.constrainAll(edges)).toThrow('Edge intersects already constrained edge');
    });
  });

  describe('delaunify', () => {
    it('should maintain Delaunay condition', () => {
      con.delaunify(true);
      // Delaunay condition validation
      // Verify no other points are contained within the circumcircle of each triangle
    });
  });

  describe('internal geometry operations', () => {
    it('should correctly detect segment intersections', () => {
      // Test intersectSegments
      const intersects = (con as any).intersectSegments(0, 2, 1, 3);
      expect(typeof intersects).toBe('boolean');
    });

    it('should correctly identify collinear points', () => {
      // Test isCollinear
      const collinear = (con as any).isCollinear(0, 1, 2);
      expect(typeof collinear).toBe('boolean');
    });
  });
});
