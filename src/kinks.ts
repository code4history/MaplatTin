import { Position } from "geojson";
import { point } from "@turf/helpers";

/**
 * 線分の交差点を検出するメインの関数
 * 
 * @param coords - 線分群の座標配列。各線分は始点と終点の座標で表現
 * @returns 検出された交差点のFeature配列
 */
export default function findIntersections(coords: Position[][]) {
  const arcs = new ArcCollection(coords);
  const xy = arcs.findSegmentIntersections();
  return dedupIntersections(xy).reduce(
    (prev: any, apoint: any, index: any, array: any) => {
      if (!prev) prev = {};
      prev[`${apoint.x}:${apoint.y}`] = apoint;
      if (index != array.length - 1) return prev;
      return Object.keys(prev).map(key => point([prev[key].x, prev[key].y]));
    },
    []
  );
}

/**
 * 線分群を管理するクラス
 * 効率的な交差判定のためのデータ構造と機能を提供
 */
class ArcCollection {
  /**
   * 座標データの配列
   * _xx, _yy: Float64Array形式で座標を保持
   * _ii: 各線分の開始インデックス
   * _nn: 各線分の頂点数
   */
  _xx?: Float64Array;
  _yy?: Float64Array; // coordinates data
  _ii?: Uint32Array;
  _nn?: Uint32Array; // indexes, sizes
  _zz: any;
  _zlimit = 0; // simplification
  _bb: any;
  _allBounds: any; // bounding boxes
  _arcIter: any;
  _filteredArcIter: any; // path iterators
  buf?: ArrayBuffer;

  /**
   * 線分群からArcCollectionを初期化
   * @param coords - 線分群の座標配列
   */
  constructor(coords: Position[][]) {
    this.initArcs(coords);
  }

  initArcs(arcs: Position[][]) {
    const xx: number[] = [],
      yy: number[] = [];
    const nn = arcs.map(points => {
      const n = points ? points.length : 0;
      for (let i = 0; i < n; i++) {
        xx.push(points[i][0]);
        yy.push(points[i][1]);
      }
      return n;
    });
    this.initXYData(nn, xx, yy);
  }

  initXYData(nn: number[], xx: number[], yy: number[]) {
    const size = nn.length;
    this._xx = new Float64Array(xx);
    this._yy = new Float64Array(yy);
    this._nn = new Uint32Array(nn);
    this._zz = null;
    this._zlimit = 0;
    this._filteredArcIter = null;

    // generate array of starting idxs of each arc
    this._ii = new Uint32Array(size);
    let idx = 0;
    for (let j = 0; j < size; j++) {
      this._ii[j] = idx;
      idx += nn[j];
    }

    if (idx != this._xx.length || this._xx.length != this._yy.length) {
      error("ArcCollection#initXYData() Counting error");
    }

    this.initBounds();
    // Pre-allocate some path iterators for repeated use.
    this._arcIter = new ArcIter(this._xx, this._yy);
  }

  initBounds() {
    const data = this.calcArcBounds_(this._xx!, this._yy!, this._nn!);
    this._bb = data.bb;
    this._allBounds = data.bounds;
  }

  /**
   * データの境界を計算
   * @returns バウンディングボックス情報
   */
  calcArcBounds_(xx: Float64Array, yy: Float64Array, nn: Uint32Array) {
    const numArcs = nn.length,
      bb = new Float64Array(numArcs * 4),
      bounds = new Bounds();
    let arcOffs = 0,
      arcLen: number,
      j: number,
      b: number[];
    for (let i = 0; i < numArcs; i++) {
      arcLen = nn[i];
      if (arcLen > 0) {
        j = i * 4;
        b = calcArcBounds(xx, yy, arcOffs, arcLen) as number[];
        bb[j++] = b[0];
        bb[j++] = b[1];
        bb[j++] = b[2];
        bb[j] = b[3];
        arcOffs += arcLen;
        bounds.mergeBounds(b);
      }
    }
    return {
      bb,
      bounds
    };
  }

  getBounds() {
    return this._allBounds.clone();
  }

  // @cb function(i, j, xx, yy)
  forEachSegment(cb: any) {
    let count = 0;
    for (let i = 0, n = this.size(); i < n; i++) {
      count += this.forEachArcSegment(i, cb);
    }
    return count;
  }

  size() {
    return (this._ii && this._ii.length) || 0;
  }

  // @cb function(i, j, xx, yy)
  forEachArcSegment(arcId: any, cb: any): any {
    const fw = arcId >= 0,
      absId = fw ? arcId : ~arcId,
      zlim = this.getRetainedInterval(),
      n = this._nn![absId],
      step = fw ? 1 : -1;
    let v1 = fw ? this._ii![absId] : this._ii![absId] + n - 1,
      v2 = v1,
      count = 0;

    for (let j = 1; j < n; j++) {
      v2 += step;
      if (zlim === 0 || this._zz![v2] >= zlim) {
        cb(v1, v2, this._xx!, this._yy!);
        v1 = v2;
        count++;
      }
    }
    return count;
  }

  getRetainedInterval() {
    return this._zlimit;
  }

  // Give access to raw data arrays...
  getVertexData() {
    return {
      xx: this._xx,
      yy: this._yy,
      zz: this._zz,
      bb: this._bb,
      nn: this._nn,
      ii: this._ii
    };
  }

  getUint32Array(count: number) {
    const bytes = count * 4;
    if (!this.buf || this.buf.byteLength < bytes) {
      this.buf = new ArrayBuffer(bytes);
    }
    return new Uint32Array(this.buf, 0, count);
  }

  // Return average magnitudes of dx, dy (with simplification)
  getAvgSegment2() {
    let dx = 0,
      dy = 0;
    const count = this.forEachSegment(
      (i: number, j: number, xx: number[], yy: number[]) => {
        dx += Math.abs(xx[i] - xx[j]);
        dy += Math.abs(yy[i] - yy[j]);
      }
    );
    return [dx / count || 0, dy / count || 0];
  }

  /**
   * 交差判定のためのストライプ数を計算
   * 線分の平均長さに基づいて最適な分割数を決定
   */
  calcSegmentIntersectionStripeCount() {
    const yrange = this.getBounds().height(),
      segLen = this.getAvgSegment2()[1];
    let count = 1;
    if (segLen > 0 && yrange > 0) {
      count = Math.ceil(yrange / segLen / 20);
    }
    return count || 1;
  }

  /**
   * 線分の交差を検出
   * ストライプ分割による効率的な判定を実装
   * 
   * @returns 検出された交差点の配列
   */
  findSegmentIntersections() {
    const bounds = this.getBounds(),
      ymin = bounds.ymin,
      yrange = bounds.ymax - ymin,
      stripeCount = this.calcSegmentIntersectionStripeCount(),
      stripeSizes = new Uint32Array(stripeCount),
      stripeId =
        stripeCount > 1
          ? (y: number) => Math.floor(((stripeCount - 1) * (y - ymin)) / yrange)
          : () => 0;
    let i, j;

    // Count segments in each stripe
    this.forEachSegment(
      (id1: number, id2: number, _xx: number[], yy: number[]) => {
        let s1 = stripeId(yy[id1]);
        const s2 = stripeId(yy[id2]);
        while (true) {
          stripeSizes[s1] = stripeSizes[s1] + 2;
          if (s1 == s2) break;
          s1 += s2 > s1 ? 1 : -1;
        }
      }
    );

    // Allocate arrays for segments in each stripe
    const stripeData = this.getUint32Array(utilsSum(stripeSizes));
    let offs = 0;
    const stripes: any[] = [];
    utilsForEach(stripeSizes, (stripeSize: number) => {
      const start = offs;
      offs += stripeSize;
      stripes.push(stripeData.subarray(start, offs));
    });
    // Assign segment ids to each stripe
    initializeArray(stripeSizes, 0);

    this.forEachSegment(
      (id1: number, id2: number, _xx: number[], yy: number[]) => {
        let s1 = stripeId(yy[id1]);
        const s2 = stripeId(yy[id2]);
        let count, stripe;
        while (true) {
          count = stripeSizes[s1];
          stripeSizes[s1] = count + 2;
          stripe = stripes[s1];
          stripe[count] = id1;
          stripe[count + 1] = id2;
          if (s1 == s2) break;
          s1 += s2 > s1 ? 1 : -1;
        }
      }
    );

    // Detect intersections among segments in each stripe.
    const raw = this.getVertexData(),
      intersections = [];
    let arr;
    for (i = 0; i < stripeCount; i++) {
      arr = intersectSegments(stripes[i], raw.xx, raw.yy);
      for (j = 0; j < arr.length; j++) {
        intersections.push(arr[j]);
      }
    }
    return dedupIntersections(intersections);
  }
}

function error(...args: any[]) {
  const msg = args.join(" ");
  throw new Error(msg);
}

function isArrayLike(obj: any) {
  if (!obj) return false;
  if (isArray(obj)) return true;
  if (isString(obj)) return false;
  if (obj.length === 0) return true;
  return obj.length > 0;
}

function isString(obj: any) {
  return obj != null && obj.toString === String.prototype.toString;
}

function isArray(obj: any) {
  return Array.isArray(obj);
}

// Calc sum, skip falsy and NaN values
// Assumes: no other non-numeric objects in array
//
function utilsSum(arr: Uint32Array, info?: any) {
  if (!isArrayLike(arr)) error("utils.sum() expects an array, received:", arr);
  let tot = 0,
    nan = 0,
    val;
  for (let i = 0, n = arr.length; i < n; i++) {
    val = arr[i];
    if (val) {
      tot += val;
    } else if (isNaN(val)) {
      nan++;
    }
  }
  if (info) {
    info.nan = nan;
  }
  return tot;
}

// Support for iterating over array-like objects, like typed arrays
function utilsForEach(arr: any, func: any, ctx?: any) {
  if (!isArrayLike(arr)) {
    throw new Error(`#forEach() takes an array-like argument. ${arr}`);
  }
  for (let i = 0, n = arr.length; i < n; i++) {
    func.call(ctx, arr[i], i);
  }
}

function initializeArray(arr: any, init: any) {
  for (let i = 0, len = arr.length; i < len; i++) {
    arr[i] = init;
  }
  return arr;
}

// Find intersections among a group of line segments
//
// TODO: handle case where a segment starts and ends at the same point (i.e. duplicate coords);
//
// @ids: Array of indexes: [s0p0, s0p1, s1p0, s1p1, ...] where xx[sip0] <= xx[sip1]
// @xx, @yy: Arrays of x- and y-coordinates
//
function intersectSegments(ids: any, xx: any, yy: any) {
  const lim = ids.length - 2,
    intersections = [];
  let s1p1,
    s1p2,
    s2p1,
    s2p2,
    s1p1x,
    s1p2x,
    s2p1x,
    s2p2x,
    s1p1y,
    s1p2y,
    s2p1y,
    s2p2y,
    hit,
    seg1,
    seg2,
    i,
    j;

  // Sort segments by xmin, to allow efficient exclusion of segments with
  // non-overlapping x extents.
  sortSegmentIds(xx, ids); // sort by ascending xmin

  i = 0;
  while (i < lim) {
    s1p1 = ids[i];
    s1p2 = ids[i + 1];
    s1p1x = xx[s1p1];
    s1p2x = xx[s1p2];
    s1p1y = yy[s1p1];
    s1p2y = yy[s1p2];
    // count++;

    j = i;
    while (j < lim) {
      j += 2;
      s2p1 = ids[j];
      s2p1x = xx[s2p1];

      if (s1p2x < s2p1x) break; // x extent of seg 2 is greater than seg 1: done with seg 1
      //if (s1p2x <= s2p1x) break; // this misses point-segment intersections when s1 or s2 is vertical

      s2p1y = yy[s2p1];
      s2p2 = ids[j + 1];
      s2p2x = xx[s2p2];
      s2p2y = yy[s2p2];

      // skip segments with non-overlapping y ranges
      if (s1p1y >= s2p1y) {
        if (s1p1y > s2p2y && s1p2y > s2p1y && s1p2y > s2p2y) continue;
      } else {
        if (s1p1y < s2p2y && s1p2y < s2p1y && s1p2y < s2p2y) continue;
      }

      // skip segments that are adjacent in a path (optimization)
      // TODO: consider if this eliminates some cases that should
      // be detected, e.g. spikes formed by unequal segments
      if (s1p1 == s2p1 || s1p1 == s2p2 || s1p2 == s2p1 || s1p2 == s2p2) {
        continue;
      }

      // test two candidate segments for intersection
      hit = segmentIntersection(
        s1p1x,
        s1p1y,
        s1p2x,
        s1p2y,
        s2p1x,
        s2p1y,
        s2p2x,
        s2p2y
      );
      if (hit) {
        seg1 = [s1p1, s1p2];
        seg2 = [s2p1, s2p2];
        intersections.push(formatIntersection(hit, seg1, seg2, xx, yy));
        if (hit.length == 4) {
          // two collinear segments may have two endpoint intersections
          intersections.push(
            formatIntersection(hit.slice(2), seg1, seg2, xx, yy)
          );
        }
      }
    }
    i += 2;
  }
  return intersections;
}

/**
 * 2つの2D線分間の交差を判定し、交差点を計算します
 * 
 * @param ax, ay - 第1線分の始点座標
 * @param bx, by - 第1線分の終点座標
 * @param cx, cy - 第2線分の始点座標
 * @param dx, dy - 第2線分の終点座標
 * 
 * @returns 以下のいずれか：
 * - null: 交差なし
 * - [x, y]: 1点での交差
 * - [x1, y1, x2, y2]: 線分が重なる場合の2点での交差
 * 
 * 特殊ケースの扱い：
 * 1. 両線分の端点で接触する場合 → 交差としない
 * 2. T字型に接触する場合 → 交差として扱う
 * 3. 線分が同一直線上で部分的に重なる場合 → 重なる部分の端点を交差点として扱う（1または2点）
 *    - 例: 線分ABとCDが重なる場合、重なり部分の両端点が交差点となる
 *    - [x1, y1, x2, y2] の形式で返される
 */
function segmentIntersection(
  ax: any,
  ay: any,
  bx: any,
  by: any,
  cx: any,
  cy: any,
  dx: any,
  dy: any
) {
  const hit = segmentHit(ax, ay, bx, by, cx, cy, dx, dy);
  let p = null;
  if (hit) {
    p = crossIntersection(ax, ay, bx, by, cx, cy, dx, dy);
    if (!p) {
      // collinear if p is null
      p = collinearIntersection(ax, ay, bx, by, cx, cy, dx, dy);
    } else if (endpointHit(ax, ay, bx, by, cx, cy, dx, dy)) {
      p = null; // filter out segments that only intersect at an endpoint
    }
  }
  return p;
}

// Source: Sedgewick, _Algorithms in C_
// (Tried various other functions that failed owing to floating point errors)
function segmentHit(
  ax: any,
  ay: any,
  bx: any,
  by: any,
  cx: any,
  cy: any,
  dx: any,
  dy: any
) {
  return (
    orient2D(ax, ay, bx, by, cx, cy) * orient2D(ax, ay, bx, by, dx, dy) <= 0 &&
    orient2D(cx, cy, dx, dy, ax, ay) * orient2D(cx, cy, dx, dy, bx, by) <= 0
  );
}

// returns a positive value if the points a, b, and c are arranged in
// counterclockwise order, a negative value if the points are in clockwise
// order, and zero if the points are collinear.
// Source: Jonathan Shewchuk http://www.cs.berkeley.edu/~jrs/meshpapers/robnotes.pdf
function orient2D(ax: any, ay: any, bx: any, by: any, cx: any, cy: any) {
  return determinant2D(ax - cx, ay - cy, bx - cx, by - cy);
}

/**
 * 2次元の行列式を計算
 * 
 * @param a, b - 行列の第1行
 * @param c, d - 行列の第2行
 * @returns 行列式の値
 */
function determinant2D(a: any, b: any, c: any, d: any) {
  return a * d - b * c;
}

// Get intersection point if segments are non-collinear, else return null
// Assumes that segments have been intersect
function crossIntersection(
  ax: any,
  ay: any,
  bx: any,
  by: any,
  cx: any,
  cy: any,
  dx: any,
  dy: any
) {
  let p = lineIntersection(ax, ay, bx, by, cx, cy, dx, dy);
  let nearest;
  if (p) {
    // Re-order operands so intersection point is closest to a (better precision)
    // Source: Jonathan Shewchuk http://www.cs.berkeley.edu/~jrs/meshpapers/robnotes.pdf
    nearest = nearestPoint(p[0], p[1], ax, ay, bx, by, cx, cy, dx, dy);
    if (nearest == 1) {
      p = lineIntersection(bx, by, ax, ay, cx, cy, dx, dy);
    } else if (nearest == 2) {
      p = lineIntersection(cx, cy, dx, dy, ax, ay, bx, by);
    } else if (nearest == 3) {
      p = lineIntersection(dx, dy, cx, cy, ax, ay, bx, by);
    }
  }
  if (p) {
    clampIntersectionPoint(p, ax, ay, bx, by, cx, cy, dx, dy);
  }
  return p;
}

function lineIntersection(
  ax: any,
  ay: any,
  bx: any,
  by: any,
  cx: any,
  cy: any,
  dx: any,
  dy: any
) {
  const den = determinant2D(bx - ax, by - ay, dx - cx, dy - cy);
  const eps = 1e-18;
  let p;
  if (den === 0) return null;
  const m = orient2D(cx, cy, dx, dy, ax, ay) / den;
  if (den <= eps && den >= -eps) {
    // tiny denominator = low precision; using one of the endpoints as intersection
    p = findEndpointInRange(ax, ay, bx, by, cx, cy, dx, dy);
    /*if (!p) {
      debug("[lineIntersection()]");
      debugSegmentIntersection([], ax, ay, bx, by, cx, cy, dx, dy);
    }*/
  } else {
    p = [ax + m * (bx - ax), ay + m * (by - ay)];
  }
  return p;
}

function findEndpointInRange(
  ax: any,
  ay: any,
  bx: any,
  by: any,
  cx: any,
  cy: any,
  dx: any,
  dy: any
) {
  let p = null;
  if (!outsideRange(ax, cx, dx) && !outsideRange(ay, cy, dy)) {
    p = [ax, ay];
  } else if (!outsideRange(bx, cx, dx) && !outsideRange(by, cy, dy)) {
    p = [bx, by];
  } else if (!outsideRange(cx, ax, bx) && !outsideRange(cy, ay, by)) {
    p = [cx, cy];
  } else if (!outsideRange(dx, ax, bx) && !outsideRange(dy, ay, by)) {
    p = [dx, dy];
  }
  return p;
}

/**
 * 点が線分の範囲外にあるかを判定
 * 
 * @param a - 判定する点の座標
 * @param b - 線分の一方の端点
 * @param c - 線分のもう一方の端点
 */
function outsideRange(a: any, b: any, c: any) {
  let out;
  if (b < c) {
    out = a < b || a > c;
  } else if (b > c) {
    out = a > b || a < c;
  } else {
    out = a != b;
  }
  return out;
}

// Return id of nearest point to x, y, among x0, y0, x1, y1, ...
function nearestPoint(x: any, y: any, ...args: any[]) {
  let minIdx = -1,
    minDist = Infinity,
    dist;
  for (let i = 0, j = 0, n = args.length; j < n; i++, j += 2) {
    dist = distanceSq(x, y, args[j], args[j + 1]);
    if (dist < minDist) {
      minDist = dist;
      minIdx = i;
    }
  }
  return minIdx;
}

function distanceSq(ax: any, ay: any, bx: any, by: any) {
  const dx = ax - bx,
    dy = ay - by;
  return dx * dx + dy * dy;
}

function clampIntersectionPoint(
  p: any,
  ax: any,
  ay: any,
  bx: any,
  by: any,
  cx: any,
  cy: any,
  dx: any,
  dy: any
) {
  // Handle intersection points that fall outside the x-y range of either
  // segment by snapping to nearest endpoint coordinate. Out-of-range
  // intersection points can be caused by floating point rounding errors
  // when a segment is vertical or horizontal. This has caused problems when
  // repeatedly applying bbox clipping along the same segment
  let x = p[0],
    y = p[1];
  // assumes that segment ranges intersect
  x = clampToCloseRange(x, ax, bx);
  x = clampToCloseRange(x, cx, dx);
  y = clampToCloseRange(y, ay, by);
  y = clampToCloseRange(y, cy, dy);
  p[0] = x;
  p[1] = y;
}

function clampToCloseRange(a: any, b: any, c: any) {
  let lim;
  if (outsideRange(a, b, c)) {
    lim = Math.abs(a - b) < Math.abs(a - c) ? b : c;
    if (Math.abs(a - lim) > 1e-15) {
      //debug("[clampToCloseRange()] large clamping interval", a, b, c);
    }
    a = lim;
  }
  return a;
}

// Assume segments s1 and s2 are collinear and overlap; find one or two internal endpoints
function collinearIntersection(
  ax: any,
  ay: any,
  bx: any,
  by: any,
  cx: any,
  cy: any,
  dx: any,
  dy: any
) {
  const minX = Math.min(ax, bx, cx, dx),
    maxX = Math.max(ax, bx, cx, dx),
    minY = Math.min(ay, by, cy, dy),
    maxY = Math.max(ay, by, cy, dy),
    useY = maxY - minY > maxX - minX;
  let coords: any = [];

  if (useY ? inside(ay, minY, maxY) : inside(ax, minX, maxX)) {
    coords.push(ax, ay);
  }
  if (useY ? inside(by, minY, maxY) : inside(bx, minX, maxX)) {
    coords.push(bx, by);
  }
  if (useY ? inside(cy, minY, maxY) : inside(cx, minX, maxX)) {
    coords.push(cx, cy);
  }
  if (useY ? inside(dy, minY, maxY) : inside(dx, minX, maxX)) {
    coords.push(dx, dy);
  }
  if (coords.length != 2 && coords.length != 4) {
    coords = null;
    //debug("Invalid collinear segment intersection", coords);
  } else if (
    coords.length == 4 &&
    coords[0] == coords[2] &&
    coords[1] == coords[3]
  ) {
    // segs that meet in the middle don't count
    coords = null;
  }
  return coords;
}

function endpointHit(
  ax: any,
  ay: any,
  bx: any,
  by: any,
  cx: any,
  cy: any,
  dx: any,
  dy: any
) {
  return (
    (ax == cx && ay == cy) ||
    (ax == dx && ay == dy) ||
    (bx == cx && by == cy) ||
    (bx == dx && by == dy)
  );
}

function inside(x: any, minX: any, maxX: any) {
  return x > minX && x < maxX;
}

// @xx array of x coords
// @ids an array of segment endpoint ids [a0, b0, a1, b1, ...]
// Sort @ids in place so that xx[a(n)] <= xx[b(n)] and xx[a(n)] <= xx[a(n+1)]
function sortSegmentIds(xx: any, ids: any) {
  orderSegmentIds(xx, ids);
  quicksortSegmentIds(xx, ids, 0, ids.length - 2);
}

function orderSegmentIds(xx: any, ids: any) {
  for (let i = 0, n = ids.length; i < n; i += 2) {
    if (xx[ids[i]] > xx[ids[i + 1]]) {
      swap(ids, i, i + 1);
    }
  }
}

function swap(ids: any, i: number, j: number) {
  const tmp = ids[i];
  ids[i] = ids[j];
  ids[j] = tmp;
}

function quicksortSegmentIds(a: any, ids: any, lo: any, hi: any) {
  let i = lo,
    j = hi,
    pivot,
    tmp;
  while (i < hi) {
    pivot = a[ids[((lo + hi) >> 2) << 1]]; // avoid n^2 performance on sorted arrays
    while (i <= j) {
      while (a[ids[i]] < pivot) i += 2;
      while (a[ids[j]] > pivot) j -= 2;
      if (i <= j) {
        tmp = ids[i];
        ids[i] = ids[j];
        ids[j] = tmp;
        tmp = ids[i + 1];
        ids[i + 1] = ids[j + 1];
        ids[j + 1] = tmp;
        i += 2;
        j -= 2;
      }
    }

    if (j - lo < 40) insertionSortSegmentIds(a, ids, lo, j);
    else quicksortSegmentIds(a, ids, lo, j);
    if (hi - i < 40) {
      insertionSortSegmentIds(a, ids, i, hi);
      return;
    }
    lo = i;
    j = hi;
  }
}

function insertionSortSegmentIds(arr: any, ids: any, start: any, end: any) {
  let id, id2;
  for (let j = start + 2; j <= end; j += 2) {
    id = ids[j];
    id2 = ids[j + 1];
    let i;
    for (i = j - 2; i >= start && arr[id] < arr[ids[i]]; i -= 2) {
      ids[i + 2] = ids[i];
      ids[i + 3] = ids[i + 1];
    }
    ids[i + 2] = id;
    ids[i + 3] = id2;
  }
}

function formatIntersection(xy: any, s1: any, s2: any, xx: any, yy: any) {
  const x = xy[0],
    y = xy[1];
  s1 = formatIntersectingSegment(x, y, s1[0], s1[1], xx, yy);
  s2 = formatIntersectingSegment(x, y, s2[0], s2[1], xx, yy);
  const a = s1[0] < s2[0] ? s1 : s2;
  const b = a == s1 ? s2 : s1;
  return { x, y, a, b };
}

function formatIntersectingSegment(
  x: any,
  y: any,
  id1: any,
  id2: any,
  xx: any,
  yy: any
) {
  let i = id1 < id2 ? id1 : id2,
    j = i === id1 ? id2 : id1;
  if (xx[i] == x && yy[i] == y) {
    j = i;
  } else if (xx[j] == x && yy[j] == y) {
    i = j;
  }
  return [i, j];
}

/**
 * 交差判定結果から重複を除去
 * 
 * @param arr - 交差点情報の配列
 * @returns 重複を除去した交差点情報の配列
 */
function dedupIntersections(arr: any) {
  const index: any = {};
  return arr.filter((o: any) => {
    const key = getIntersectionKey(o);
    if (key in index) {
      return false;
    }
    index[key] = true;
    return true;
  });
}

// Get an indexable key from an intersection object
// Assumes that vertex ids of o.a and o.b are sorted
function getIntersectionKey(o: any) {
  return `${o.a.join(",")};${o.b.join(",")}`;
}

// Constructor takes arrays of coords: xx, yy, zz (optional)
//
class ArcIter {
  _i = 0;
  _n = 0;
  _inc = 1;
  _xx: Float64Array;
  _yy: Float64Array;
  i = 0;
  x = 0;
  y = 0;

  constructor(xx: Float64Array, yy: Float64Array) {
    this._xx = xx;
    this._yy = yy;
  }
}

function calcArcBounds(
  xx: Float64Array,
  yy: Float64Array,
  start: number,
  len: number
) {
  let i = start | 0;
  const n = isNaN(len) ? xx.length - i : len + i;
  let x: number,
    y: number,
    xmin: number,
    ymin: number,
    xmax: number,
    ymax: number;
  if (n > 0) {
    xmin = xmax = xx[i];
    ymin = ymax = yy[i];
  } else return [undefined, undefined, undefined, undefined];
  for (i++; i < n; i++) {
    x = xx[i];
    y = yy[i];
    if (x < xmin) xmin = x;
    if (x > xmax) xmax = x;
    if (y < ymin) ymin = y;
    if (y > ymax) ymax = y;
  }
  return [xmin, ymin, xmax, ymax];
}

class Bounds {
  xmin?: number;
  ymin?: number;
  xmax?: number;
  ymax?: number;

  constructor(...args: any[]) {
    if (args.length > 0) {
      this.setBounds(args);
    }
  }

  // Return a bounding box with the same extent as this one.
  cloneBounds() {
    return this.clone();
  }

  clone() {
    // alias so child classes can override clone()
    return new Bounds(this.xmin, this.ymin, this.xmax, this.ymax);
  }

  width() {
    return this.xmax! - this.xmin! || 0;
  }

  height() {
    return this.ymax! - this.ymin! || 0;
  }

  setBounds(a: any, b?: number, c?: number, d?: number) {
    if (arguments.length == 1) {
      // assume first arg is a Bounds or array
      if (isArrayLike(a)) {
        b = a[1];
        c = a[2];
        d = a[3];
        a = a[0];
      } else {
        b = a.ymin;
        c = a.xmax;
        d = a.ymax;
        a = a.xmin;
      }
    }

    this.xmin = a;
    this.ymin = b;
    this.xmax = c;
    this.ymax = d;
    if (a > c! || b! > d!) this.update();
    // error("Bounds#setBounds() min/max reversed:", a, b, c, d);
    return this;
  }

  update() {
    let tmp: number;
    if (this.xmin! > this.xmax!) {
      tmp = this.xmin!;
      this.xmin = this.xmax;
      this.xmax = tmp;
    }
    if (this.ymin! > this.ymax!) {
      tmp = this.ymin!;
      this.ymin = this.ymax;
      this.ymax = tmp;
    }
  }

  mergeBounds(bb: number | number[] | Bounds, ...args: number[]) {
    let a: number, b: number, c: number, d: number;
    if (bb instanceof Bounds) {
      a = bb.xmin!;
      b = bb.ymin!;
      c = bb.xmax!;
      d = bb.ymax!;
    } else if (args.length == 3) {
      a = bb as number;
      b = args[0];
      c = args[1];
      d = args[2];
    } else if ((bb as number[]).length == 4) {
      // assume array: [xmin, ymin, xmax, ymax]
      a = (bb as number[])[0];
      b = (bb as number[])[1];
      c = (bb as number[])[2];
      d = (bb as number[])[3];
    } else {
      error("Bounds#mergeBounds() invalid argument:", bb);
    }

    if (this.xmin === void 0) {
      this.setBounds(a!, b!, c!, d!);
    } else {
      if (a! < this.xmin) this.xmin = a!;
      if (b! < this.ymin!) this.ymin = b!;
      if (c! > this.xmax!) this.xmax = c!;
      if (d! > this.ymax!) this.ymax = d!;
    }
    return this;
  }
}
