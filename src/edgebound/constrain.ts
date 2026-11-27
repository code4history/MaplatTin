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

/**
 * 制約を張った途中の三角網の状態。{@link Constrain.snapshot} で控え、{@link Constrain.restore} で
 * 同じ状態から続きを張る（同じ制約を何度も張り直さずに済む）。
 */
export interface ConstrainSnapshot {
  coords: DelaunatorLike["coords"];
  hull: DelaunatorLike["hull"];
  triangles: Uint32Array;
  halfedges: Int32Array;
  vertMap: Uint32Array;
  flips: ReturnType<BitSet["copyBits"]>;
  consd: ReturnType<BitSet["copyBits"]>;
  /** 全部の辺の Delaunay 性の掃除（{@link Constrain.delaunify} の最初の 1 回）が済んでいるか。 */
  cleaned: boolean;
}

export class Constrain extends Base {
  vertMap: Uint32Array;
  flips: BitSet;
  consd: BitSet;
  /**
   * 全部の辺を調べる掃除（{@link delaunify} の最初の 1 回）が済んでいるか。済んだ後は、
   * 反転で触った辺（`flips` の印がある辺）だけを調べれば Delaunay 性が保たれる。
   * 掃除は制約を 1 本張るとき（`delaunify(true)`）にしか走らないので、制約を 1 本も張っていない網や、
   * 張った制約がすべて初めからある辺だった網は、まだ済んでいない。
   */
  cleaned = false;

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

  /** 現在の三角網と制約の状態を控える（三角網の配列は複製する）。 */
  snapshot(): ConstrainSnapshot {
    const { coords, hull, triangles, halfedges } = this.del;
    return {
      coords,
      hull,
      triangles: Uint32Array.from(triangles as ArrayLike<number>),
      halfedges: Int32Array.from(halfedges as ArrayLike<number>),
      vertMap: this.vertMap.slice(),
      flips: this.flips.copyBits(),
      consd: this.consd.copyBits(),
      cleaned: this.cleaned,
    };
  }

  /** {@link snapshot} で控えた状態を、新しい配列に複製して復元する（控えは何度でも使える）。 */
  static restore(snapshot: ConstrainSnapshot): Constrain {
    const constrain = new Constrain({
      coords: snapshot.coords,
      hull: snapshot.hull,
      triangles: snapshot.triangles.slice(),
      halfedges: snapshot.halfedges.slice(),
    });
    constrain.vertMap.set(snapshot.vertMap);
    constrain.flips.load(snapshot.flips);
    constrain.consd.load(snapshot.consd);
    constrain.cleaned = snapshot.cleaned;
    return constrain;
  }

  /**
   * Constrain the triangulation such that there is an edge between p1 and p2.
   */
  constrainOne(segP1: number, segP2: number): number {
    const { triangles, halfedges } = this.del;
    this.assertVertex(segP1, segP1, segP2);
    this.assertVertex(segP2, segP1, segP2);
    this.assertInTriangulation(segP1, segP1, segP2);
    this.assertInTriangulation(segP2, segP1, segP2);
    const start = this.vertMap[segP1];

    // The limit only guards against a walk that never terminates.
    // See maxConstrainSteps() for how it relates to valid input.
    const maxSteps = this.maxConstrainSteps();
    let steps = 0;

    // Loop over the edges touching segP1.
    let edg = start;
    do {
      if (++steps > maxSteps) {
        throw new Error(
          `Constraining edge [${segP1}, ${segP2}] exceeded the iteration limit`,
        );
      }
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
      if (++steps > maxSteps) {
        throw new Error(
          `Constraining edge [${segP1}, ${segP2}] exceeded the iteration limit`,
        );
      }
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
   * Upper bound for the number of steps taken while constraining one edge.
   *
   * A constraint that crosses k edges is resolved in passes over the crossed
   * edges, so the number of steps can grow with k squared (for example when
   * the crossed edges fan out between two bowed rows of points). k is less
   * than the number of half-edges, so the square of that number is never
   * reached by a walk that terminates. The floor keeps tiny meshes away from
   * the limit.
   */
  private maxConstrainSteps(): number {
    const numEdges = this.del.triangles.length;
    return Math.max(numEdges * numEdges, 4096);
  }

  /**
   * Throw unless `vertex` is part of the triangulation. Delaunator leaves out
   * points that coincide with another point, so a valid point id may have no
   * triangle. An edge cannot start or end at such a point.
   */
  private assertInTriangulation(
    vertex: number,
    segP1: number,
    segP2: number,
  ): void {
    if (this.vertMap[vertex] >= this.del.triangles.length) {
      throw new Error(
        `Invalid edge [${segP1}, ${segP2}]: vertex ${vertex} is not part of the triangulation`,
      );
    }
  }

  /**
   * Throw unless `vertex` is an id of a point given to Delaunator.
   */
  private assertVertex(vertex: number, segP1: number, segP2: number): void {
    const numPoints = this.vertMap.length;
    if (!Number.isInteger(vertex) || vertex < 0 || vertex >= numPoints) {
      throw new Error(
        `Invalid edge [${String(segP1)}, ${String(segP2)}]: vertex ids must be integers from 0 to ${numPoints - 1}`,
      );
    }
  }

  /**
   * Fix the Delaunay condition.
   *
   * 最初の 1 回（`deep` で、まだ掃除が済んでいないとき）だけは、制約でない全部の辺を調べる。
   * Delaunator の外接円の判定は浮動小数点なので、厳密な述語での掃除を 1 回は通すため。
   * その後は、反転で触った辺（`flips` の印がある辺）だけを調べる。掃除の後に Delaunay でなくなりうるのは、
   * 反転で触った辺とその周りだけで、{@link flipDiagonal} はそこに印を付けるから、結果は変わらない。
   */
  delaunify(deep = false): this {
    const { halfedges } = this.del;
    const flips = this.flips;
    const consd = this.consd;
    const len = halfedges.length;

    let flipped: number;
    // 全部の辺を調べるのは、掃除が済んでいない網の 1 周目だけ。済んだ網と、2 周目以降は印のある辺だけでよい。
    // deep でない呼び出しは、従来どおり全部の辺を 1 周調べる
    let all = !(deep && this.cleaned);
    do {
      flipped = 0;
      for (let edg = 0; edg < len; edg++) {
        if (consd.has(edg) || (!all && !flips.has(edg))) {
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
      all = false;
    } while (deep && flipped > 0);
    // 反転が無くなるまで調べ終えたとき（deep）だけ、掃除が済んだ扱いにする
    if (deep) this.cleaned = true;

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
   * 同じ群に属する点だけでできた三角形を、制約でない辺の反転で解消する（禁止制約）。
   *
   * 群の例: 四辺形の補助頂点の全体、必須エッジごとの端点と中継点。四辺形では角の前後の補助頂点を
   * 結ぶ弦（角と凸包の GCP の間をせき止める辺）が、必須エッジでは途中の点を飛ばす弦（片方の面で
   * 一直線に並び面積 0 になる三角形の辺）が反転される。
   *
   * 反転は、反転後の 2 つの三角形が `planes` のすべての面で、その面の三角網の向き（三角形の向きの
   * 多数決）と同じ向きの、面積 0 でない三角形になるときだけ行う。制約された辺・外周の辺は反転しない。
   * 違反が無くなるか、1 周して反転が起きなくなったら止める。
   *
   * @param groupsOf 点の番号から、その点が属する群の番号の配列（属さなければ空）
   * @param planes 向きを確かめる面の座標（`coords` と同じ並び）。既定は三角網を作った面だけ
   * @returns 反転した数と、解消できずに残った違反の三角形の数
   */
  forbidGroupTriangles(
    groupsOf: (vertex: number) => readonly number[],
    planes: readonly ArrayLike<number>[] = [this.del.coords],
  ): { flips: number; remaining: number } {
    const { triangles, halfedges } = this.del;
    const numTris = triangles.length / 3;
    const sharedGroup = (a: number, b: number, c: number): boolean => {
      const gb = groupsOf(b), gc = groupsOf(c);
      return groupsOf(a).some((g) => gb.includes(g) && gc.includes(g));
    };
    const violates = (t: number): boolean =>
      sharedGroup(triangles[t * 3], triangles[t * 3 + 1], triangles[t * 3 + 2]);
    const sign = (xy: ArrayLike<number>, a: number, b: number, c: number): number =>
      Math.sign(orient2d(xy[a * 2], xy[a * 2 + 1], xy[b * 2], xy[b * 2 + 1], xy[c * 2], xy[c * 2 + 1]));

    // 面ごとの三角網の向き（三角形の向きの多数決。既に折り返した三角形があっても、全体の向きで判定する）
    const planeSigns = planes.map((xy) => {
      let sum = 0;
      for (let t = 0; t < numTris; t++) sum += sign(xy, triangles[t * 3], triangles[t * 3 + 1], triangles[t * 3 + 2]);
      return sum < 0 ? -1 : 1;
    });

    // edg は違反の三角形の辺。反転すると p(edg の向かいの点)と q(adj の向かいの点)を結ぶ
    const canFlip = (edg: number): boolean => {
      if (this.consd.has(edg)) return false;
      const adj = halfedges[edg];
      if (adj === -1) return false;
      const u = triangles[edg], v = triangles[nextEdge(edg)];
      const p = triangles[prevEdge(edg)], q = triangles[prevEdge(adj)];
      // 反転後の三角形 (p, u, q) と (q, v, p) は、どの面でもその面の三角網と同じ向き（面積 0 は不可）
      return planes.every((xy, i) => sign(xy, p, u, q) === planeSigns[i] && sign(xy, q, v, p) === planeSigns[i]);
    };

    let flips = 0;
    let progressed = true;
    while (progressed) {
      progressed = false;
      for (let t = 0; t < numTris; t++) {
        if (!violates(t)) continue;
        for (let k = 0; k < 3; k++) {
          const edg = t * 3 + k;
          if (!canFlip(edg)) continue;
          const adj = halfedges[edg];
          // 反転で向こう側の三角形が違反に変わるなら、得にならないので行わない
          const u = triangles[edg], v = triangles[nextEdge(edg)];
          const p = triangles[prevEdge(edg)], q = triangles[prevEdge(adj)];
          if (sharedGroup(p, u, q) && sharedGroup(q, v, p)) continue;
          // flipDiagonal は新しい対角線（p → q）の半辺を返す。反転した辺は戻されないよう制約として扱う
          // （反転のたびに制約の辺が 1 本増えるので、繰り返しは必ず終わる）
          this.protect(this.flipDiagonal(edg));
          flips++;
          progressed = true;
          break;
        }
      }
    }

    let remaining = 0;
    for (let t = 0; t < numTris; t++) if (violates(t)) remaining++;
    return { flips, remaining };
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
    // p2 is not a point of the triangulation: there is no edge to find.
    if (!(start1 < triangles.length)) {
      return Infinity;
    }
    let edg = start1;
    let prv: number;
    // A walk around one vertex visits each half-edge at most once.
    let steps = 0;
    // Walk around p2, iterating over the edges pointing to it.
    do {
      if (++steps > triangles.length) {
        throw new Error(
          `Looking up edge [${p1}, ${p2}] exceeded the iteration limit`,
        );
      }
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
