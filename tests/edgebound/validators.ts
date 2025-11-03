import { Constrain } from '@/edgebound';
import { DelaunatorLike } from '@/edgebound/base';
import { incircle, orient2d } from 'robust-predicates';
// @ts-expect-error robust-segment-intersect doesn't ship type definitions
import robustIntersect from 'robust-segment-intersect';

type P2 = [number, number];
type PTS = P2[];

/**
 * Maps keys to sets of values.
 */
class SetMap<Key, Value> extends Map<Key, Set<Value>> {
  set(key: Key, val: Set<Value>): this;
  set(key: Key, val: Value): this;
  set(key: Key, val: Value | Set<Value>): this {
    let set = this.get(key);
    if (!set) {
      set = new Set<Value>();
      super.set(key, set);
    }
    if (val instanceof Set) {
      for (const v of val) {
        set.add(v);
      }
    } else {
      set.add(val);
    }
    return this;
  }

  delete(key: Key, val?: Value) {
    if (val !== undefined) {
      const set = this.get(key);
      if (set) {
        const ret = set.delete(val);
        if (!set.size) {
          super.delete(key);
        }
        return ret;
      }
      return false;
    }
    return super.delete(key);
  }
}

function nextEdge(e: number) {
  return e % 3 === 2 ? e - 2 : e + 1;
}
function prevEdge(e: number) {
  return e % 3 === 0 ? e + 2 : e - 1;
}

function convex(r: P2, q: P2, p: P2) {
  return (
    (orient2d(...p, ...r, ...q) || orient2d(...r, ...q, ...p) || orient2d(...q, ...p, ...r)) >= 0
  );
}

// Kahan and Babuska summation, Neumaier variant
function sum(x: number[]) {
  let sum = x[0];
  let err = 0;
  for (let i = 1; i < x.length; i++) {
    const k = x[i];
    const m = sum + k;
    err += Math.abs(sum) >= Math.abs(k) ? sum - m + k : k - m + sum;
    sum = m;
  }
  return sum + err;
}

export function validateDelaunator(points: PTS, del: DelaunatorLike) {
  // Validate halfedges
  for (let edg = 0; edg < del.triangles.length; edg++) {
    const adj = del.halfedges[edg];
    if (adj === -1) continue;

    if (del.halfedges[adj] !== edg) {
      throw new Error(
        `invalid halfedge connection: ${edg} -> ${adj} != ${del.halfedges[adj]} -> ${edg}`
      );
    }

    const e1 = del.triangles[edg],
      e2 = del.triangles[nextEdge(edg)],
      a1 = del.triangles[adj],
      a2 = del.triangles[nextEdge(adj)];

    if (e1 !== a2 && e2 !== a1) {
      throw new Error(
        `halfedges ${edg}/${adj} do not share end-points (${e1}, ${e2}) / (${a2}, ${a1})`
      );
    }
  }

  // Validate hull
  const hullAreas: number[] = [],
    hulLen = del.hull.length;
  for (let i = 0, j = hulLen - 1; i < hulLen; j = i++) {
    const [x0, y0] = points[del.hull[j]];
    const [x, y] = points[del.hull[i]];
    hullAreas.push((x - x0) * (y + y0));
    const c = convex(
      points[del.hull[j]],
      points[del.hull[(j + 1) % del.hull.length]],
      points[del.hull[(j + 3) % del.hull.length]]
    );
    if (!c) {
      throw new Error(`hull is not convex at ${j}`);
    }
  }
  const hullArea = sum(hullAreas);

  // Validate triangulation area
  const triangleAreas: number[] = [];
  for (let i = 0; i < del.triangles.length; i += 3) {
    const [ax, ay] = points[del.triangles[i]];
    const [bx, by] = points[del.triangles[i + 1]];
    const [cx, cy] = points[del.triangles[i + 2]];
    triangleAreas.push(Math.abs((by - ay) * (cx - bx) - (bx - ax) * (cy - by)));
  }
  const trianglesArea = sum(triangleAreas);

  const err = Math.abs((hullArea - trianglesArea) / hullArea);
  if (err > Math.pow(2, -51)) {
    throw new Error(`triangulation is broken: ${err} error`);
  }
}

export function validateVertMap(points: PTS, con: Constrain) {
  const del = con.del,
    numPoints = points.length,
    numEdges = del.triangles.length,
    edgeMap = new SetMap<number, number>();

  for (let edg = 0; edg < numEdges; edg++) {
    const p1 = del.triangles[edg],
      p2 = del.triangles[nextEdge(edg)];
    edgeMap.set(p1, prevEdge(edg));
    edgeMap.set(p2, edg);
  }

  for (let i = 0; i < numPoints; i++) {
    const inc = edgeMap.get(i);
    if (!inc) continue;

    const start = con.vertMap[i];
    let edg = start;
    do {
      if (!inc.has(edg)) {
        throw new Error(`edge ${edg} incorrectly marked as incoming to point ${i}`);
      }

      inc.delete(edg);
      const nxt = nextEdge(edg),
        adj = del.halfedges[nxt];
      edg = adj;
    } while (edg !== -1 && edg !== start);

    if (inc.size) {
      throw new Error(`edges missed while walking around point: ${i}: ${inc}`);
    }
    edgeMap.delete(i);
  }

  if (edgeMap.size) {
    throw new Error(`invalid points in edge map: ${edgeMap}`);
  }
}

export function validateFlips(con: Constrain, clear = true) {
  const del = con.del,
    numEdges = del.triangles.length;

  for (let edg = 0; edg < numEdges; edg++) {
    const adj = del.halfedges[edg];

    if (clear && con.flips.has(edg)) {
      throw new Error(`flip not cleared for ${edg}/${adj}: ${con.flips.has(edg)}`);
    }

    if (adj === -1) continue;

    if (
      con.isConstrained(edg) !== con.isConstrained(adj) ||
      con.flips.has(edg) !== con.flips.has(adj)
    ) {
      throw new Error(
        `flip status inconsistent for ${edg}/${adj}: ${con.flips.has(edg)}/${con.flips.has(adj)}`
      );
    }
  }
}

export function validateDelaunay(con: Constrain) {
  const del = con.del,
    pts = del.coords,
    len = del.triangles.length;

  for (let edg = 0; edg < len; edg++) {
    const adj = del.halfedges[edg];
    if (con.isConstrained(edg) || adj < edg) continue;

    const e1 = del.triangles[edg],
      e2 = del.triangles[nextEdge(edg)],
      e3 = del.triangles[nextEdge(nextEdge(edg))],
      a3 = del.triangles[nextEdge(nextEdge(adj))],
      p1x = pts[e1 * 2],
      p1y = pts[e1 * 2 + 1],
      p2x = pts[e2 * 2],
      p2y = pts[e2 * 2 + 1],
      p3x = pts[e3 * 2],
      p3y = pts[e3 * 2 + 1],
      p4x = pts[a3 * 2],
      p4y = pts[a3 * 2 + 1];

    const isD = incircle(p1x, p1y, p2x, p2y, p3x, p3y, p4x, p4y);
    if (isD < 0) {
      throw new Error(`triangles shared by ${edg}/${adj} not Delaunay (${isD})`);
    }
  }
}

export function validateConstraint(
  points: PTS,
  con: Constrain,
  ret: number | undefined,
  p1: number,
  p2: number
) {
  const del = con.del,
    numEdges = del.triangles.length,
    [x1, y1] = points[p1],
    [x2, y2] = points[p2],
    re1 = ret === undefined ? -1 : ret < 0 ? del.triangles[nextEdge(-ret)] : del.triangles[ret],
    re2 = ret === undefined ? -1 : ret < 0 ? del.triangles[-ret] : del.triangles[nextEdge(ret)],
    find = con.findEdge(p1, p2);

  if (ret !== undefined && (re1 !== p1 || re2 !== p2)) {
    throw new Error(
      `invalid edge returned from constrainOne: ${ret}: ${re1} -> ${re2} !== ${p1} -> ${p2}`
    );
  }

  let found = -1,
    foundAdj = -1;

  for (let edg = 0; edg < numEdges; edg++) {
    const e1 = del.triangles[edg],
      e2 = del.triangles[nextEdge(edg)];

    if (e1 === p1 && e2 === p2) {
      if (found !== -1) {
        throw new Error(`edge ${edg} (${e1} -> ${e2}) is duplicate of constraint`);
      }
      found = edg;
    } else if (e1 === p2 && e2 === p1) {
      if (foundAdj !== -1) {
        throw new Error(`edge ${edg} (${e1} -> ${e2}) is reversed duplicate of constraint`);
      }
      foundAdj = edg;
    }

    if (e1 === p1 || e1 === p2 || e2 === p1 || e2 === p2) continue;

    const [x3, y3] = points[e1],
      [x4, y4] = points[e2];

    if (robustIntersect([x1, y1], [x2, y2], [x3, y3], [x4, y4])) {
      throw new Error(
        `edge ${edg} (${e1} -> ${e2}) intersects constrained edge ${p1} -> ${p2}`
      );
    }
  }

  if (found === -1 && foundAdj === -1) {
    throw new Error('constrained edge not in triangulation');
  }

  if (found !== -1) {
    if (!con.isConstrained(found)) {
      throw new Error('constrained edge not marked');
    }
    if (find !== found) {
      throw new Error(`findEdge returned wrong edge: ${find} !== ${found}`);
    }
  }

  if (foundAdj !== -1) {
    if (!con.isConstrained(foundAdj)) {
      throw new Error('reverse constrained edge not marked');
    }
    if (found === -1 && find !== -foundAdj) {
      throw new Error(`findEdge returned wrong edge: ${find} !== -${foundAdj}`);
    }
  }
}

export function validateAllConstraints(points: PTS, edges: [number, number][], con: Constrain) {
  for (const [p1, p2] of edges) {
    validateConstraint(points, con, undefined, p1, p2);
  }

  const del = con.del,
    triangles = del.triangles,
    numEdges = triangles.length,
    conEdges = new Set<number>();

  for (const [p1, p2] of edges) {
    const edg = con.findEdge(p1, p2),
      adj = con.findEdge(p2, p1);
    if (edg >= 0) {
      conEdges.add(edg);
    }
    if (adj >= 0) {
      conEdges.add(adj);
    }
  }

  for (let edg = 0; edg < numEdges; edg++) {
    if (conEdges.has(edg)) {
      if (!con.isConstrained(edg)) {
        throw new Error(
          `constrained edge ${edg} (${triangles[edg]} -> ${triangles[nextEdge(edg)]}) not marked as constrained`
        );
      }
    } else if (con.isConstrained(edg)) {
      throw new Error(
        `non-constrained edge ${edg} (${triangles[edg]} -> ${triangles[nextEdge(edg)]}) marked as constrained`
      );
    }
  }
}

export type { P2, PTS };
export { SetMap };
