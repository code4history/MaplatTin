/**
 * Edge constraint engine used for enforcing required edges on a Delaunator mesh.
 * Based on @kninnug/constrainautor (ISC license, see this directory for details).
 */
import { orient2d, incircle } from "robust-predicates";
import { BitSet8 } from "./bitset.ts";
import {
  nextEdge,
  prevEdge,
  Base,
  type DelaunatorLike,
  intersectSegments as baseIntersectSegments,
} from "./base.ts";
import type { BitSet } from "./bitset.ts";

export class Constrain extends Base {
  vertMap: Uint32Array;
  flips: BitSet;
  consd: BitSet;

  /**
   * Create a Constrain instance.
   *
   * @param del The triangulation output from Delaunator.
   * @param edges If provided, constrain these edges via constrainAll.
   */
  constructor(del: DelaunatorLike, edges?: readonly [number, number][]) {
    if (
      !del ||
      typeof del !== "object" ||
      !del.triangles ||
      !del.halfedges ||
      !del.coords
    ) {
      throw new Error("Expected an object with Delaunator output");
    }
    if (
      del.triangles.length % 3 ||
      del.halfedges.length !== del.triangles.length ||
      del.coords.length % 2
    ) {
      throw new Error("Delaunator output appears inconsistent");
    }
    if (del.triangles.length < 3) {
      throw new Error("No edges in triangulation");
    }

    super(del);

    const U32NIL = 2 ** 32 - 1;
    const numPoints = del.coords.length >> 1;
    const numEdges = del.triangles.length;

    // Map every vertex id to the right-most edge that points to that vertex.
    this.vertMap = new Uint32Array(numPoints).fill(U32NIL);
    // Keep track of edges flipped while constraining.
    this.flips = new BitSet8(numEdges);
    // Keep track of constrained edges.
    this.consd = new BitSet8(numEdges);

    for (let e = 0; e < numEdges; e++) {
      const v = del.triangles[e];
      if (this.vertMap[v] === U32NIL) {
        this.updateVert(e);
      }
    }

    if (edges) {
      this.constrainAll(edges);
    }
  }

  /**
   * Constrain the triangulation such that there is an edge between p1 and p2.
   */
  constrainOne(segP1: number, segP2: number): number {
    const { triangles, halfedges } = this.del;
    const start = this.vertMap[segP1];

    // Loop over the edges touching segP1.
    let edg = start;
    do {
      const p4 = triangles[edg];
      const nxt = nextEdge(edg);

      // already constrained, but in reverse order
      if (p4 === segP2) {
        return this.protect(edg);
      }
      // The edge opposite segP1
      const opp = prevEdge(edg);
      const p3 = triangles[opp];

      // already constrained
      if (p3 === segP2) {
        this.protect(nxt);
        return nxt;
      }

      // edge opposite segP1 intersects constraint
      if (this.intersectSegments(segP1, segP2, p3, p4)) {
        edg = opp;
        break;
      }

      const adj = halfedges[nxt];
      // The next edge pointing to segP1
      edg = adj;
    } while (edg !== -1 && edg !== start);

    let conEdge = edg;
    // Walk through the triangulation looking for further intersecting
    // edges and flip them. If an intersecting edge cannot be flipped,
    // assign its id to `rescan` and restart from there, until there are
    // no more intersects.
    let rescan = -1;
    while (edg !== -1) {
      const adj = halfedges[edg];
      const bot = prevEdge(edg);
      const top = prevEdge(adj);
      const rgt = nextEdge(adj);

      if (adj === -1) {
        throw new Error("Constraining edge exited the hull");
      }

      if (this.consd.has(edg)) {
        throw new Error("Edge intersects already constrained edge");
      }

      if (
        this.isCollinear(segP1, segP2, triangles[edg]) ||
        this.isCollinear(segP1, segP2, triangles[adj])
      ) {
        throw new Error("Constraining edge intersects point");
      }

      const convex = this.intersectSegments(
        triangles[edg],
        triangles[adj],
        triangles[bot],
        triangles[top],
      );

      if (!convex) {
        if (rescan === -1) {
          rescan = edg;
        }

        if (triangles[top] === segP2) {
          if (edg === rescan) {
            throw new Error("Infinite loop: non-convex quadrilateral");
          }
          edg = rescan;
          rescan = -1;
          continue;
        }

        if (
          this.intersectSegments(
            segP1,
            segP2,
            triangles[top],
            triangles[adj],
          )
        ) {
          edg = top;
        } else if (
          this.intersectSegments(
            segP1,
            segP2,
            triangles[rgt],
            triangles[top],
          )
        ) {
          edg = rgt;
        } else if (rescan === edg) {
          throw new Error("Infinite loop: no further intersect after non-convex");
        }

        continue;
      }

      this.flipDiagonal(edg);

      if (
        this.intersectSegments(
          segP1,
          segP2,
          triangles[bot],
          triangles[top],
        )
      ) {
        if (rescan === -1) {
          rescan = bot;
        }
        if (rescan === bot) {
          throw new Error("Infinite loop: flipped diagonal still intersects");
        }
      }

      if (triangles[top] === segP2) {
        conEdge = top;
        edg = rescan;
        rescan = -1;
      } else if (
        this.intersectSegments(
          segP1,
          segP2,
          triangles[rgt],
          triangles[top],
        )
      ) {
        edg = rgt;
      }
    }

    this.protect(conEdge);
    this.delaunify(true);
    return this.findEdge(segP1, segP2);
  }

  /**
   * Fix the Delaunay condition.
   */
  delaunify(deep = false): this {
    const { halfedges } = this.del;
    const flips = this.flips;
    const consd = this.consd;
    const len = halfedges.length;

    let flipped: number;
    do {
      flipped = 0;
      for (let edg = 0; edg < len; edg++) {
        if (consd.has(edg)) {
          continue;
        }
        flips.delete(edg);

        const adj = halfedges[edg];
        if (adj === -1) {
          continue;
        }

        flips.delete(adj);
        if (!this.isDelaunay(edg)) {
          this.flipDiagonal(edg);
          flipped++;
        }
      }
    } while (deep && flipped > 0);

    return this;
  }

  /**
   * Call constrainOne on each edge.
   */
  constrainAll(edges: readonly [number, number][]): this {
    const len = edges.length;
    for (let i = 0; i < len; i++) {
      const e = edges[i];
      this.constrainOne(e[0], e[1]);
    }

    return this;
  }

  /**
   * Whether an edge is constrained.
   */
  isConstrained(edg: number): boolean {
    return this.consd.has(edg);
  }

  /**
   * Find the edge that points from p1 -> p2. If there is only an edge from
   * p2 -> p1 (i.e. it is on the hull), returns the negative id of it.
   */
  findEdge(p1: number, p2: number): number {
    const start1 = this.vertMap[p2];
    const { triangles, halfedges } = this.del;
    let edg = start1;
    let prv = -1;
    // Walk around p2, iterating over the edges pointing to it.
    do {
      if (triangles[edg] === p1) {
        return edg;
      }
      prv = nextEdge(edg);
      edg = halfedges[prv];
    } while (edg !== -1 && edg !== start1);

    // Did not find p1 -> p2, the only option is that it is on the hull on
    // the 'left-hand' side, pointing p2 -> p1 (or there is no edge)
    if (triangles[nextEdge(prv)] === p1) {
      return -prv;
    }

    return Infinity;
  }

  /**
   * Mark an edge as constrained, i.e. should not be touched by `delaunify`.
   */
  private protect(edg: number): number {
    const adj = this.del.halfedges[edg];
    const flips = this.flips;
    const consd = this.consd;
    flips.delete(edg);
    consd.add(edg);

    if (adj !== -1) {
      flips.delete(adj);
      consd.add(adj);
      return adj;
    }

    return -edg;
  }

  /**
   * Mark an edge as flipped unless constrained.
   */
  private markFlip(edg: number): boolean {
    const halfedges = this.del.halfedges;
    const flips = this.flips;
    const consd = this.consd;
    if (consd.has(edg)) {
      return false;
    }
    const adj = halfedges[edg];
    if (adj !== -1) {
      flips.add(edg);
      flips.add(adj);
    }
    return true;
  }

  /**
   * Flip the edge shared by two triangles.
   */
  private flipDiagonal(edg: number): number {
    const { triangles, halfedges } = this.del;
    const flips = this.flips;
    const consd = this.consd;
    const adj = halfedges[edg];
    const bot = prevEdge(edg);
    const lft = nextEdge(edg);
    const top = prevEdge(adj);
    const rgt = nextEdge(adj);
    const adjBot = halfedges[bot];
    const adjTop = halfedges[top];

    if (consd.has(edg)) {
      throw new Error("Trying to flip a constrained edge");
    }

    triangles[edg] = triangles[top];
    halfedges[edg] = adjTop;
    if (!flips.set(edg, flips.has(top))) {
      consd.set(edg, consd.has(top));
    }
    if (adjTop !== -1) {
      halfedges[adjTop] = edg;
    }
    halfedges[bot] = top;

    triangles[adj] = triangles[bot];
    halfedges[adj] = adjBot;
    if (!flips.set(adj, flips.has(bot))) {
      consd.set(adj, consd.has(bot));
    }
    if (adjBot !== -1) {
      halfedges[adjBot] = adj;
    }
    halfedges[top] = bot;

    this.markFlip(edg);
    this.markFlip(lft);
    this.markFlip(adj);
    this.markFlip(rgt);

    flips.add(bot);
    consd.delete(bot);
    flips.add(top);
    consd.delete(top);

    this.updateVert(edg);
    this.updateVert(lft);
    this.updateVert(adj);
    this.updateVert(rgt);

    return bot;
  }

  /**
   * Whether point p1, p2, and p are collinear.
   */
  private isCollinear(p1: number, p2: number, p: number): boolean {
    const pts = this.del.coords;
    return (
      orient2d(
        pts[p1 * 2],
        pts[p1 * 2 + 1],
        pts[p2 * 2],
        pts[p2 * 2 + 1],
        pts[p * 2],
        pts[p * 2 + 1],
      ) === 0.0
    );
  }

  /**
   * Whether the triangle formed by p1, p2, p3 keeps px outside the circumcircle.
   */
  private inCircle(p1: number, p2: number, p3: number, px: number): boolean {
    const pts = this.del.coords;
    return (
      incircle(
        pts[p1 * 2],
        pts[p1 * 2 + 1],
        pts[p2 * 2],
        pts[p2 * 2 + 1],
        pts[p3 * 2],
        pts[p3 * 2 + 1],
        pts[px * 2],
        pts[px * 2 + 1],
      ) < 0.0
    );
  }

  /**
   * Whether the triangles sharing edg conform to the Delaunay condition.
   */
  private isDelaunay(edg: number): boolean {
    const { triangles, halfedges } = this.del;
    const adj = halfedges[edg];
    if (adj === -1) {
      return true;
    }

    const p1 = triangles[prevEdge(edg)];
    const p2 = triangles[edg];
    const p3 = triangles[nextEdge(edg)];
    const px = triangles[prevEdge(adj)];

    return !this.inCircle(p1, p2, p3, px);
  }

  /**
   * Update the vertex -> incoming edge map.
   */
  private updateVert(start: number): number {
    const { triangles, halfedges } = this.del;
    const vm = this.vertMap;
    const v = triangles[start];

    let inc = prevEdge(start);
    let adj = halfedges[inc];

    while (adj !== -1 && adj !== start) {
      inc = prevEdge(adj);
      adj = halfedges[inc];
    }

    vm[v] = inc;
    return inc;
  }

  /**
   * Whether the segments between vertices intersect.
   */
  protected intersectSegments(
    p1: number,
    p2: number,
    p3: number,
    p4: number,
  ): boolean {
    const pts = this.del.coords;
    if (p1 === p3 || p1 === p4 || p2 === p3 || p2 === p4) {
      return false;
    }
    return baseIntersectSegments(
      pts[p1 * 2],
      pts[p1 * 2 + 1],
      pts[p2 * 2],
      pts[p2 * 2 + 1],
      pts[p3 * 2],
      pts[p3 * 2 + 1],
      pts[p4 * 2],
      pts[p4 * 2 + 1],
    );
  }

  static intersectSegments = baseIntersectSegments;
}
