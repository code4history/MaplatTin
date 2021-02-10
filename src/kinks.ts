import { Position } from "@turf/turf";
// @ts-expect-error
import internal from "./mapshaper-maplat";
import {point} from "@turf/helpers";

export default function findIntersections(coords: Position[][]) {
  const arcs = new ArcCollection(coords);
  // @ts-expect-error
  const xy = internal.findSegmentIntersections(arcs);
  // @ts-expect-error
  const retXy = internal
    .dedupIntersections(xy)
    .reduce((prev: any, apoint: any, index: any, array: any) => {
      if (!prev) prev = {};
      prev[`${apoint.x}:${apoint.y}`] = apoint;
      if (index != array.length - 1) return prev;
      return Object.keys(prev).map(key =>
        point([prev[key].x, prev[key].y])
      );
    }, []);
  return retXy;
}

class ArcCollection {
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

  constructor(coords: Position[][]) {
    this.initArcs(coords);
  }

  initArcs(arcs: Position[][]) {
    const xx: number[] = [], yy: number[] = [];
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

  calcArcBounds_(xx:Float64Array, yy:Float64Array, nn:Uint32Array) {
    const numArcs = nn.length,
      bb = new Float64Array(numArcs * 4),
      bounds = new Bounds();
    let arcOffs = 0,
      arcLen:number,
      j:number,
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
  forEachArcSegment(arcId:any, cb:any): any {
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

  getUint32Array(count:number) {
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
    const count = this.forEachSegment((i:number, j:number, xx:number[], yy:number[]) => {
      dx += Math.abs(xx[i] - xx[j]);
      dy += Math.abs(yy[i] - yy[j]);
    });
    return [dx / count || 0, dy / count || 0];
  }

  calcSegmentIntersectionStripeCount() {
    const yrange = this.getBounds().height(),
      segLen = this.getAvgSegment2()[1];
    let count = 1;
    if (segLen > 0 && yrange > 0) {
      count = Math.ceil(yrange / segLen / 20);
    }
    return count || 1;
  }

  findSegmentIntersections() {
    const bounds = this.getBounds(),
      ymin = bounds.ymin,
      yrange = bounds.ymax - ymin,
      stripeCount = this.calcSegmentIntersectionStripeCount(),
      stripeSizes = new Uint32Array(stripeCount),
      stripeId = stripeCount > 1 ?
        (y:number) => Math.floor(((stripeCount - 1) * (y - ymin)) / yrange) :
        () => 0;
    let i, j;

    // Count segments in each stripe
    this.forEachSegment((id1:number, id2:number, xx:number[], yy:number[]) => {
      let s1 = stripeId(yy[id1]);
      const s2 = stripeId(yy[id2]);
      // eslint-disable-next-line no-constant-condition
      while (true) {
        stripeSizes[s1] = stripeSizes[s1] + 2;
        if (s1 == s2) break;
        s1 += s2 > s1 ? 1 : -1;
      }
    });

    // Allocate arrays for segments in each stripe
    const stripeData = this.getUint32Array(utilsSum(stripeSizes));
    let offs = 0;
    const stripes:any[] = [];
    utilsForEach(stripeSizes, (stripeSize:number) => {
      const start = offs;
      offs += stripeSize;
      stripes.push(stripeData.subarray(start, offs));
    });
    // Assign segment ids to each stripe
    initializeArray(stripeSizes, 0);

    this.forEachSegment((id1:number, id2:number, xx:number[], yy:number[]) => {
      let s1 = stripeId(yy[id1]);
      const s2 = stripeId(yy[id2]);
      let count, stripe;
      // eslint-disable-next-line no-constant-condition
      while (true) {
        count = stripeSizes[s1];
        stripeSizes[s1] = count + 2;
        stripe = stripes[s1];
        stripe[count] = id1;
        stripe[count + 1] = id2;
        if (s1 == s2) break;
        s1 += s2 > s1 ? 1 : -1;
      }
    });

    // Detect intersections among segments in each stripe.
    const raw = this.getVertexData(),
      intersections = [];
    let arr;
    for (i = 0; i < stripeCount; i++) {
      // @ts-expect-error
      arr = internal.intersectSegments(stripes[i], raw.xx, raw.yy);
      for (j = 0; j < arr.length; j++) {
        intersections.push(arr[j]);
      }
    }
    // @ts-expect-error
    return internal.dedupIntersections(intersections);
  }
}

function error(...args: any[]) {
  const msg = args.join(" ");
  throw new Error(msg);
}

function isArrayLike(obj:any) {
  if (!obj) return false;
  if (isArray(obj)) return true;
  if (isString(obj)) return false;
  if (obj.length === 0) return true;
  return obj.length > 0;
}

function isString(obj:any) {
  return obj != null && obj.toString === String.prototype.toString;
}

function isArray(obj:any) {
  return Array.isArray(obj);
}

// Calc sum, skip falsy and NaN values
// Assumes: no other non-numeric objects in array
//
function utilsSum(arr:Uint32Array, info?:any) {
  if (!isArrayLike(arr))
    error("utils.sum() expects an array, received:", arr);
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
function utilsForEach(arr:any, func:any, ctx?:any) {
  if (!isArrayLike(arr)) {
    throw new Error(`#forEach() takes an array-like argument. ${arr}`);
  }
  for (let i = 0, n = arr.length; i < n; i++) {
    func.call(ctx, arr[i], i);
  }
}

function initializeArray(arr:any, init:any) {
  for (let i = 0, len = arr.length; i < len; i++) {
    arr[i] = init;
  }
  return arr;
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

  constructor(xx:Float64Array, yy:Float64Array) {
    this._xx = xx;
    this._yy = yy;
  }
}

function calcArcBounds(xx: Float64Array, yy:Float64Array, start:number, len:number) {
  let i = start | 0;
  const n = isNaN(len) ? xx.length - i : len + i;
  let x:number, y:number, xmin:number, ymin:number, xmax:number, ymax:number;
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
  xmin?:number;
  ymin?:number;
  xmax?:number;
  ymax?:number;

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


  setBounds(a:any, b?:number, c?:number, d?:number) {
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
    let tmp:number;
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
    let a:number, b:number, c:number, d:number;
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

/*Bounds.prototype.toString = function () {
    return JSON.stringify({
        xmin: this.xmin,
        xmax: this.xmax,
        ymin: this.ymin,
        ymax: this.ymax
    });
};

Bounds.prototype.toArray = function () {
    return this.hasBounds() ? [this.xmin, this.ymin, this.xmax, this.ymax] : [];
};

Bounds.prototype.hasBounds = function () {
    return this.xmin <= this.xmax && this.ymin <= this.ymax;
};

Bounds.prototype.sameBounds = Bounds.prototype.equals = function (bb) {
    return (
        bb &&
        this.xmin === bb.xmin &&
        this.xmax === bb.xmax &&
        this.ymin === bb.ymin &&
        this.ymax === bb.ymax
    );
};

Bounds.prototype.area = function () {
    return this.width() * this.height() || 0;
};

Bounds.prototype.empty = function () {
    this.xmin = this.ymin = this.xmax = this.ymax = void 0;
    return this;
};



Bounds.prototype.centerX = function () {
    const x = (this.xmin + this.xmax) * 0.5;
    return x;
};

Bounds.prototype.centerY = function () {
    const y = (this.ymax + this.ymin) * 0.5;
    return y;
};

Bounds.prototype.containsPoint = function (x, y) {
    if (x >= this.xmin && x <= this.xmax && y <= this.ymax && y >= this.ymin) {
        return true;
    }
    return false;
};

// intended to speed up slightly bubble symbol detection; could use intersects() instead
// TODO: fix false positive where circle is just outside a corner of the box
Bounds.prototype.containsBufferedPoint = Bounds.prototype.containsCircle = function (
    x,
    y,
    buf
) {
    if (x + buf > this.xmin && x - buf < this.xmax) {
        if (y - buf < this.ymax && y + buf > this.ymin) {
            return true;
        }
    }
    return false;
};

Bounds.prototype.intersects = function (bb) {
    if (
        bb.xmin <= this.xmax &&
        bb.xmax >= this.xmin &&
        bb.ymax >= this.ymin &&
        bb.ymin <= this.ymax
    ) {
        return true;
    }
    return false;
};

Bounds.prototype.contains = function (bb) {
    if (
        bb.xmin >= this.xmin &&
        bb.ymax <= this.ymax &&
        bb.xmax <= this.xmax &&
        bb.ymin >= this.ymin
    ) {
        return true;
    }
    return false;
};

Bounds.prototype.shift = function (x, y) {
    this.setBounds(this.xmin + x, this.ymin + y, this.xmax + x, this.ymax + y);
};

Bounds.prototype.padBounds = function (a, b, c, d) {
    this.xmin -= a;
    this.ymin -= b;
    this.xmax += c;
    this.ymax += d;
};

// Rescale the bounding box by a fraction. TODO: implement focus.
// @param {number} pct Fraction of original extents
// @param {number} pctY Optional amount to scale Y
//
Bounds.prototype.scale = function (pct, pctY) {
    /*, focusX, focusY* /
    const halfWidth = (this.xmax - this.xmin) * 0.5;
    const halfHeight = (this.ymax - this.ymin) * 0.5;
    const kx = pct - 1;
    const ky = pctY === undefined ? kx : pctY - 1;
    this.xmin -= halfWidth * kx;
    this.ymin -= halfHeight * ky;
    this.xmax += halfWidth * kx;
    this.ymax += halfHeight * ky;
};

Bounds.prototype.clearBounds = function () {
    this.setBounds(new Bounds());
};

Bounds.prototype.mergePoint = function (x, y) {
    if (this.xmin === void 0) {
        this.setBounds(x, y, x, y);
    } else {
        // this works even if x,y are NaN
        if (x < this.xmin) this.xmin = x;
        else if (x > this.xmax) this.xmax = x;

        if (y < this.ymin) this.ymin = y;
        else if (y > this.ymax) this.ymax = y;
    }
};

// expands either x or y dimension to match @aspect (width/height ratio)
// @focusX, @focusY (optional): expansion focus, as a fraction of width and height
Bounds.prototype.fillOut = function (aspect, focusX, focusY) {
    if (arguments.length < 3) {
        focusX = 0.5;
        focusY = 0.5;
    }
    const w = this.width(),
        h = this.height(),
        currAspect = w / h;
    let pad;
    if (isNaN(aspect) || aspect <= 0) {
        // error condition; don't pad
    } else if (currAspect < aspect) {
        // fill out x dimension
        pad = h * aspect - w;
        this.xmin -= (1 - focusX) * pad;
        this.xmax += focusX * pad;
    } else {
        pad = w / aspect - h;
        this.ymin -= (1 - focusY) * pad;
        this.ymax += focusY * pad;
    }
    return this;
};



Bounds.prototype.transform = function (t) {
    this.xmin = this.xmin * t.mx + t.bx;
    this.xmax = this.xmax * t.mx + t.bx;
    this.ymin = this.ymin * t.my + t.by;
    this.ymax = this.ymax * t.my + t.by;
    this.update();
    return this;
};

// Returns a Transform object for mapping this onto Bounds @b2
// @flipY (optional) Flip y-axis coords, for converting to/from pixel coords
//
Bounds.prototype.getTransform = function (b2, flipY) {
    const t = new Transform();
    t.mx = b2.width() / this.width() || 1; // TODO: better handling of 0 w,h
    t.bx = b2.xmin - t.mx * this.xmin;
    if (flipY) {
        t.my = -b2.height() / this.height() || 1;
        t.by = b2.ymax - t.my * this.ymin;
    } else {
        t.my = b2.height() / this.height() || 1;
        t.by = b2.ymin - t.my * this.ymin;
    }
    return t;
};

Bounds.prototype.mergeCircle = function (x, y, r) {
    if (r < 0) r = -r;
    this.mergeBounds([x - r, y - r, x + r, y + r]);
};*/

/*
function ArcCollection(...args) {

    if (args.length == 1) {
        initLegacyArcs(args[0]); // want to phase this out
    } else if (args.length == 3) {
        initXYData.apply(this, args);
    } else {
        error("ArcCollection() Invalid arguments");
    }

    function initZData(zz) {
        if (!zz) {
            _zz = null;
            _zlimit = 0;
            _filteredArcIter = null;
        } else {
            if (zz.length != _xx.length)
                error("ArcCollection#initZData() mismatched arrays");
            if (zz instanceof Array) zz = new Float64Array(zz);
            _zz = zz;
            _filteredArcIter = new FilteredArcIter(_xx, _yy, _zz);
        }
    }

    this.updateVertexData = function (nn, xx, yy, zz) {
        initXYData(nn, xx, yy);
        initZData(zz || null);
    };

    this.getCopy = function () {
        const copy = new ArcCollection(
            new Int32Array(_nn),
            new Float64Array(_xx),
            new Float64Array(_yy)
        );
        if (_zz) {
            copy.setThresholds(new Float64Array(_zz));
            copy.setRetainedInterval(_zlimit);
        }
        return copy;
    };

    function getFilteredPointCount() {
        const zz = _zz,
            z = _zlimit;
        if (!zz || !z) return this.getPointCount();
        let count = 0;
        for (let i = 0, n = zz.length; i < n; i++) {
            if (zz[i] >= z) count++;
        }
        return count;
    }

    function getFilteredVertexData() {
        const len2 = getFilteredPointCount();
        const arcCount = _nn.length;
        const xx2 = new Float64Array(len2),
            yy2 = new Float64Array(len2),
            zz2 = new Float64Array(len2),
            nn2 = new Int32Array(arcCount);
        let i = 0,
            i2 = 0,
            n,
            n2;

        for (let arcId = 0; arcId < arcCount; arcId++) {
            n2 = 0;
            n = _nn[arcId];
            for (let end = i + n; i < end; i++) {
                if (_zz[i] >= _zlimit) {
                    xx2[i2] = _xx[i];
                    yy2[i2] = _yy[i];
                    zz2[i2] = _zz[i];
                    i2++;
                    n2++;
                }
            }
            if (n2 < 2) error("Collapsed arc"); // endpoints should be z == Infinity
            nn2[arcId] = n2;
        }
        return {
            xx: xx2,
            yy: yy2,
            zz: zz2,
            nn: nn2
        };
    }

    this.getFilteredCopy = function () {
        if (!_zz || _zlimit === 0) return this.getCopy();
        const data = getFilteredVertexData();
        const copy = new ArcCollection(data.nn, data.xx, data.yy);
        copy.setThresholds(data.zz);
        return copy;
    };

    // Return arcs as arrays of [x, y] points (intended for testing).
    this.toArray = function () {
        const arr = [];
        this.forEach(iter => {
            const arc = [];
            while (iter.hasNext()) {
                arc.push([iter.x, iter.y]);
            }
            arr.push(arc);
        });
        return arr;
    };

    this.toJSON = function () {
        return this.toArray();
    };

    this.transformPoints = function (f) {
        const xx = _xx,
            yy = _yy;
        let arcId = -1,
            n = 0,
            p;
        for (let i = 0, len = xx.length; i < len; i++, n--) {
            while (n === 0) {
                n = _nn[++arcId];
            }
            p = f(xx[i], yy[i], arcId);
            if (p) {
                xx[i] = p[0];
                yy[i] = p[1];
            }
        }
        initBounds();
    };

    // Return an ArcIter object for each path in the dataset
    //
    this.forEach = function (cb) {
        for (let i = 0, n = this.size(); i < n; i++) {
            cb(this.getArcIter(i), i);
        }
    };

    // Iterate over arcs with access to low-level data
    //
    this.forEach2 = function (cb) {
        for (let arcId = 0, n = this.size(); arcId < n; arcId++) {
            cb(_ii[arcId], _nn[arcId], _xx, _yy, _zz, arcId);
        }
    };

    this.forEach3 = function (cb) {
        let start, end, xx, yy, zz;
        for (let arcId = 0, n = this.size(); arcId < n; arcId++) {
            start = _ii[arcId];
            end = start + _nn[arcId];
            xx = _xx.subarray(start, end);
            yy = _yy.subarray(start, end);
            if (_zz) zz = _zz.subarray(start, end);
            cb(xx, yy, zz, arcId);
        }
    };

    // Remove arcs that don't pass a filter test and re-index arcs
    // Return array mapping original arc ids to re-indexed ids. If arr[n] == -1
    // then arc n was removed. arr[n] == m indicates that the arc at n was
    // moved to index m.
    // Return null if no arcs were re-indexed (and no arcs were removed)
    //
    this.filter = function (cb) {
        const test = function (i) {
            return cb(this.getArcIter(i), i);
        }.bind(this);
        return this.deleteArcs(test);
    };

    this.deleteArcs = function (test) {
        const n = this.size(),
            map = new Int32Array(n);
        let goodArcs = 0;
        for (let i = 0; i < n; i++) {
            if (test(i)) {
                map[i] = goodArcs++;
            } else {
                map[i] = -1;
            }
        }
        if (goodArcs < n) {
            condenseArcs(map);
        }
        return map;
    };

    function condenseArcs(map) {
        let goodPoints = 0,
            goodArcs = 0;
        const copyElements = utils.copyElements;
        let k, arcLen;
        for (let i = 0, n = map.length; i < n; i++) {
            k = map[i];
            arcLen = _nn[i];
            if (k > -1) {
                copyElements(_xx, _ii[i], _xx, goodPoints, arcLen);
                copyElements(_yy, _ii[i], _yy, goodPoints, arcLen);
                if (_zz) copyElements(_zz, _ii[i], _zz, goodPoints, arcLen);
                _nn[k] = arcLen;
                goodPoints += arcLen;
                goodArcs++;
            }
        }

        initXYData(
            _nn.subarray(0, goodArcs),
            _xx.subarray(0, goodPoints),
            _yy.subarray(0, goodPoints)
        );
        if (_zz) initZData(_zz.subarray(0, goodPoints));
    }

    this.dedupCoords = function () {
        let arcId = 0,
            i = 0,
            i2 = 0;
        const arcCount = this.size(),
            zz = _zz;
        let arcLen, arcLen2;
        while (arcId < arcCount) {
            arcLen = _nn[arcId];
            arcLen2 = internal.dedupArcCoords(i, i2, arcLen, _xx, _yy, zz);
            _nn[arcId] = arcLen2;
            i += arcLen;
            i2 += arcLen2;
            arcId++;
        }
        if (i > i2) {
            initXYData(_nn, _xx.subarray(0, i2), _yy.subarray(0, i2));
            if (zz) initZData(zz.subarray(0, i2));
        }
        return i - i2;
    };

    this.getVertex = function (arcId, nth) {
        const i = this.indexOfVertex(arcId, nth);
        return {
            x: _xx[i],
            y: _yy[i]
        };
    };

    // @nth: index of vertex. ~(idx) starts from the opposite endpoint
    this.indexOfVertex = function (arcId, nth) {
        const absId = arcId < 0 ? ~arcId : arcId,
            len = _nn[absId];
        if (nth < 0) nth = len + nth;
        if (absId != arcId) nth = len - nth - 1;
        if (nth < 0 || nth >= len)
            error("[ArcCollection] out-of-range vertex id");
        return _ii[absId] + nth;
    };

    // Test whether the vertex at index @idx is the endpoint of an arc
    this.pointIsEndpoint = function (idx) {
        const ii = _ii,
            nn = _nn;
        for (let j = 0, n = ii.length; j < n; j++) {
            if (idx === ii[j] || idx === ii[j] + nn[j] - 1) return true;
        }
        return false;
    };

    // Tests if arc endpoints have same x, y coords
    // (arc may still have collapsed);
    this.arcIsClosed = function (arcId) {
        const i = this.indexOfVertex(arcId, 0),
            j = this.indexOfVertex(arcId, -1);
        return i != j && _xx[i] == _xx[j] && _yy[i] == _yy[j];
    };

    // Tests if first and last segments mirror each other
    // A 3-vertex arc with same endpoints tests true
    this.arcIsLollipop = function (arcId) {
        const len = this.getArcLength(arcId);
        if (len <= 2 || !this.arcIsClosed(arcId)) return false;
        const i = this.indexOfVertex(arcId, 1);
        const j = this.indexOfVertex(arcId, -2);
        return _xx[i] == _xx[j] && _yy[i] == _yy[j];
    };

    this.arcIsDegenerate = function (arcId) {
        const iter = this.getArcIter(arcId);
        let i = 0,
            x,
            y;
        while (iter.hasNext()) {
            if (i > 0) {
                if (x != iter.x || y != iter.y) return false;
            }
            x = iter.x;
            y = iter.y;
            i++;
        }
        return true;
    };

    this.getArcLength = function (arcId) {
        return _nn[absArcId(arcId)];
    };

    this.getArcIter = function (arcId) {
        const fw = arcId >= 0,
            i = fw ? arcId : ~arcId,
            iter = _zz && _zlimit ? _filteredArcIter : _arcIter;
        if (i >= _nn.length) {
            error("#getArcId() out-of-range arc id:", arcId);
        }
        return iter.init(_ii[i], _nn[i], fw, _zlimit);
    };

    this.getShapeIter = function (ids) {
        return new ShapeIter(this).init(ids);
    };

    // Add simplification data to the dataset
    // @thresholds is either a single typed array or an array of arrays of removal thresholds for each arc;
    //
    this.setThresholds = function (thresholds) {
        const n = this.getPointCount();
        let zz = null;
        if (!thresholds) {
            // nop
        } else if (thresholds.length == n) {
            zz = thresholds;
        } else if (thresholds.length == this.size()) {
            zz = flattenThresholds(thresholds, n);
        } else {
            error("Invalid threshold data");
        }
        initZData(zz);
        return this;
    };

    function flattenThresholds(arr, n) {
        const zz = new Float64Array(n);
        let i = 0;
        arr.forEach(arr => {
            for (let j = 0, n = arr.length; j < n; i++, j++) {
                zz[i] = arr[j];
            }
        });
        if (i != n) error("Mismatched thresholds");
        return zz;
    }

    // bake in current simplification level, if any
    this.flatten = function () {
        if (_zlimit > 0) {
            const data = getFilteredVertexData();
            this.updateVertexData(data.nn, data.xx, data.yy);
            _zlimit = 0;
        } else {
            _zz = null;
        }
    };

    this.setRetainedInterval = function (z) {
        _zlimit = z;
        return this;
    };

    this.getRetainedPct = function () {
        return this.getPctByThreshold(_zlimit);
    };

    this.setRetainedPct = function (pct) {
        if (pct >= 1) {
            _zlimit = 0;
        } else {
            _zlimit = this.getThresholdByPct(pct);
            _zlimit = internal.clampIntervalByPct(_zlimit, pct);
        }
        return this;
    };

    // Return array of z-values that can be removed for simplification
    //
    this.getRemovableThresholds = function (nth) {
        if (!_zz) error("[arcs] Missing simplification data.");
        const skip = nth | 1,
            arr = new Float64Array(Math.ceil(_zz.length / skip));
        let z, i, j, n;
        for (i = 0, j = 0, n = this.getPointCount(); i < n; i += skip) {
            z = _zz[i];
            if (z != Infinity) {
                arr[j++] = z;
            }
        }
        return arr.subarray(0, j);
    };

    this.getArcThresholds = function (arcId) {
        if (!(arcId >= 0 && arcId < this.size())) {
            error("[arcs] Invalid arc id:", arcId);
        }
        const start = _ii[arcId],
            end = start + _nn[arcId];
        return _zz.subarray(start, end);
    };

    // nth (optional): sample every nth threshold (use estimate for speed)
    this.getPctByThreshold = function (val, nth) {
        let arr, rank, pct;
        if (val > 0) {
            arr = this.getRemovableThresholds(nth);
            rank = utils.findRankByValue(arr, val);
            pct = arr.length > 0 ? 1 - (rank - 1) / arr.length : 1;
        } else {
            pct = 1;
        }
        return pct;
    };

    // nth (optional): sample every nth threshold (use estimate for speed)
    this.getThresholdByPct = function (pct, nth) {
        const tmp = this.getRemovableThresholds(nth);
        let rank, z;
        if (tmp.length === 0) {
            // No removable points
            rank = 0;
        } else {
            rank = Math.floor((1 - pct) * (tmp.length + 2));
        }

        if (rank <= 0) {
            z = 0;
        } else if (rank > tmp.length) {
            z = Infinity;
        } else {
            z = utils.findValueByRank(tmp, rank);
        }
        return z;
    };

    this.arcIntersectsBBox = function (i, b1) {
        const b2 = _bb,
            j = i * 4;
        return (
            b2[j] <= b1[2] &&
            b2[j + 2] >= b1[0] &&
            b2[j + 3] >= b1[1] &&
            b2[j + 1] <= b1[3]
        );
    };

    this.arcIsContained = function (i, b1) {
        const b2 = _bb,
            j = i * 4;
        return (
            b2[j] >= b1[0] &&
            b2[j + 2] <= b1[2] &&
            b2[j + 1] >= b1[1] &&
            b2[j + 3] <= b1[3]
        );
    };

    this.arcIsSmaller = function (i, units) {
        const bb = _bb,
            j = i * 4;
        return bb[j + 2] - bb[j] < units && bb[j + 3] - bb[j + 1] < units;
    };

    // TODO: allow datasets in lat-lng coord range to be flagged as planar
    this.isPlanar = function () {
        return !internal.probablyDecimalDegreeBounds(this.getBounds());
    };

    this.getPointCount = function () {
        return (_xx && _xx.length) || 0;
    };


    this.getSimpleShapeBounds = function (arcIds, bounds) {
        bounds = bounds || new Bounds();
        for (let i = 0, n = arcIds.length; i < n; i++) {
            this.mergeArcBounds(arcIds[i], bounds);
        }
        return bounds;
    };

    this.getSimpleShapeBounds2 = function (arcIds, arr) {
        const bbox = arr || [],
            bb = _bb;
        let id = absArcId(arcIds[0]) * 4;
        bbox[0] = bb[id];
        bbox[1] = bb[++id];
        bbox[2] = bb[++id];
        bbox[3] = bb[++id];
        for (let i = 1, n = arcIds.length; i < n; i++) {
            id = absArcId(arcIds[i]) * 4;
            if (bb[id] < bbox[0]) bbox[0] = bb[id];
            if (bb[++id] < bbox[1]) bbox[1] = bb[id];
            if (bb[++id] > bbox[2]) bbox[2] = bb[id];
            if (bb[++id] > bbox[3]) bbox[3] = bb[id];
        }
        return bbox;
    };

    // TODO: move this and similar methods out of ArcCollection
    this.getMultiShapeBounds = function (shapeIds, bounds) {
        bounds = bounds || new Bounds();
        if (shapeIds) {
            // handle null shapes
            for (let i = 0, n = shapeIds.length; i < n; i++) {
                this.getSimpleShapeBounds(shapeIds[i], bounds);
            }
        }
        return bounds;
    };

    this.mergeArcBounds = function (arcId, bounds) {
        if (arcId < 0) arcId = ~arcId;
        const offs = arcId * 4;
        bounds.mergeBounds(
            _bb[offs],
            _bb[offs + 1],
            _bb[offs + 2],
            _bb[offs + 3]
        );
    };
}

ArcCollection.prototype.inspect = function () {
    const n = this.getPointCount();
    let str;
    if (n < 50) {
        str = JSON.stringify(this.toArray());
    } else {
        str = `[ArcCollection (${this.size()})]`;
    }
    return str;
};
 */