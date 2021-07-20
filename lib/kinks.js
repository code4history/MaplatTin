import { point } from "@turf/helpers";
export default function findIntersections(coords) {
    const arcs = new ArcCollection(coords);
    const xy = arcs.findSegmentIntersections();
    return dedupIntersections(xy).reduce((prev, apoint, index, array) => {
        if (!prev)
            prev = {};
        prev[`${apoint.x}:${apoint.y}`] = apoint;
        if (index != array.length - 1)
            return prev;
        return Object.keys(prev).map(key => point([prev[key].x, prev[key].y]));
    }, []);
}
class ArcCollection {
    constructor(coords) {
        this._zlimit = 0;
        this.initArcs(coords);
    }
    initArcs(arcs) {
        const xx = [], yy = [];
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
    initXYData(nn, xx, yy) {
        const size = nn.length;
        this._xx = new Float64Array(xx);
        this._yy = new Float64Array(yy);
        this._nn = new Uint32Array(nn);
        this._zz = null;
        this._zlimit = 0;
        this._filteredArcIter = null;
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
        this._arcIter = new ArcIter(this._xx, this._yy);
    }
    initBounds() {
        const data = this.calcArcBounds_(this._xx, this._yy, this._nn);
        this._bb = data.bb;
        this._allBounds = data.bounds;
    }
    calcArcBounds_(xx, yy, nn) {
        const numArcs = nn.length, bb = new Float64Array(numArcs * 4), bounds = new Bounds();
        let arcOffs = 0, arcLen, j, b;
        for (let i = 0; i < numArcs; i++) {
            arcLen = nn[i];
            if (arcLen > 0) {
                j = i * 4;
                b = calcArcBounds(xx, yy, arcOffs, arcLen);
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
    forEachSegment(cb) {
        let count = 0;
        for (let i = 0, n = this.size(); i < n; i++) {
            count += this.forEachArcSegment(i, cb);
        }
        return count;
    }
    size() {
        return (this._ii && this._ii.length) || 0;
    }
    forEachArcSegment(arcId, cb) {
        const fw = arcId >= 0, absId = fw ? arcId : ~arcId, zlim = this.getRetainedInterval(), n = this._nn[absId], step = fw ? 1 : -1;
        let v1 = fw ? this._ii[absId] : this._ii[absId] + n - 1, v2 = v1, count = 0;
        for (let j = 1; j < n; j++) {
            v2 += step;
            if (zlim === 0 || this._zz[v2] >= zlim) {
                cb(v1, v2, this._xx, this._yy);
                v1 = v2;
                count++;
            }
        }
        return count;
    }
    getRetainedInterval() {
        return this._zlimit;
    }
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
    getUint32Array(count) {
        const bytes = count * 4;
        if (!this.buf || this.buf.byteLength < bytes) {
            this.buf = new ArrayBuffer(bytes);
        }
        return new Uint32Array(this.buf, 0, count);
    }
    getAvgSegment2() {
        let dx = 0, dy = 0;
        const count = this.forEachSegment((i, j, xx, yy) => {
            dx += Math.abs(xx[i] - xx[j]);
            dy += Math.abs(yy[i] - yy[j]);
        });
        return [dx / count || 0, dy / count || 0];
    }
    calcSegmentIntersectionStripeCount() {
        const yrange = this.getBounds().height(), segLen = this.getAvgSegment2()[1];
        let count = 1;
        if (segLen > 0 && yrange > 0) {
            count = Math.ceil(yrange / segLen / 20);
        }
        return count || 1;
    }
    findSegmentIntersections() {
        const bounds = this.getBounds(), ymin = bounds.ymin, yrange = bounds.ymax - ymin, stripeCount = this.calcSegmentIntersectionStripeCount(), stripeSizes = new Uint32Array(stripeCount), stripeId = stripeCount > 1
            ? (y) => Math.floor(((stripeCount - 1) * (y - ymin)) / yrange)
            : () => 0;
        let i, j;
        this.forEachSegment((id1, id2, xx, yy) => {
            let s1 = stripeId(yy[id1]);
            const s2 = stripeId(yy[id2]);
            while (true) {
                stripeSizes[s1] = stripeSizes[s1] + 2;
                if (s1 == s2)
                    break;
                s1 += s2 > s1 ? 1 : -1;
            }
        });
        const stripeData = this.getUint32Array(utilsSum(stripeSizes));
        let offs = 0;
        const stripes = [];
        utilsForEach(stripeSizes, (stripeSize) => {
            const start = offs;
            offs += stripeSize;
            stripes.push(stripeData.subarray(start, offs));
        });
        initializeArray(stripeSizes, 0);
        this.forEachSegment((id1, id2, xx, yy) => {
            let s1 = stripeId(yy[id1]);
            const s2 = stripeId(yy[id2]);
            let count, stripe;
            while (true) {
                count = stripeSizes[s1];
                stripeSizes[s1] = count + 2;
                stripe = stripes[s1];
                stripe[count] = id1;
                stripe[count + 1] = id2;
                if (s1 == s2)
                    break;
                s1 += s2 > s1 ? 1 : -1;
            }
        });
        const raw = this.getVertexData(), intersections = [];
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
function error(...args) {
    const msg = args.join(" ");
    throw new Error(msg);
}
function isArrayLike(obj) {
    if (!obj)
        return false;
    if (isArray(obj))
        return true;
    if (isString(obj))
        return false;
    if (obj.length === 0)
        return true;
    return obj.length > 0;
}
function isString(obj) {
    return obj != null && obj.toString === String.prototype.toString;
}
function isArray(obj) {
    return Array.isArray(obj);
}
function utilsSum(arr, info) {
    if (!isArrayLike(arr))
        error("utils.sum() expects an array, received:", arr);
    let tot = 0, nan = 0, val;
    for (let i = 0, n = arr.length; i < n; i++) {
        val = arr[i];
        if (val) {
            tot += val;
        }
        else if (isNaN(val)) {
            nan++;
        }
    }
    if (info) {
        info.nan = nan;
    }
    return tot;
}
function utilsForEach(arr, func, ctx) {
    if (!isArrayLike(arr)) {
        throw new Error(`#forEach() takes an array-like argument. ${arr}`);
    }
    for (let i = 0, n = arr.length; i < n; i++) {
        func.call(ctx, arr[i], i);
    }
}
function initializeArray(arr, init) {
    for (let i = 0, len = arr.length; i < len; i++) {
        arr[i] = init;
    }
    return arr;
}
function intersectSegments(ids, xx, yy) {
    const lim = ids.length - 2, intersections = [];
    let s1p1, s1p2, s2p1, s2p2, s1p1x, s1p2x, s2p1x, s2p2x, s1p1y, s1p2y, s2p1y, s2p2y, hit, seg1, seg2, i, j;
    sortSegmentIds(xx, ids);
    i = 0;
    while (i < lim) {
        s1p1 = ids[i];
        s1p2 = ids[i + 1];
        s1p1x = xx[s1p1];
        s1p2x = xx[s1p2];
        s1p1y = yy[s1p1];
        s1p2y = yy[s1p2];
        j = i;
        while (j < lim) {
            j += 2;
            s2p1 = ids[j];
            s2p1x = xx[s2p1];
            if (s1p2x < s2p1x)
                break;
            s2p1y = yy[s2p1];
            s2p2 = ids[j + 1];
            s2p2x = xx[s2p2];
            s2p2y = yy[s2p2];
            if (s1p1y >= s2p1y) {
                if (s1p1y > s2p2y && s1p2y > s2p1y && s1p2y > s2p2y)
                    continue;
            }
            else {
                if (s1p1y < s2p2y && s1p2y < s2p1y && s1p2y < s2p2y)
                    continue;
            }
            if (s1p1 == s2p1 || s1p1 == s2p2 || s1p2 == s2p1 || s1p2 == s2p2) {
                continue;
            }
            hit = segmentIntersection(s1p1x, s1p1y, s1p2x, s1p2y, s2p1x, s2p1y, s2p2x, s2p2y);
            if (hit) {
                seg1 = [s1p1, s1p2];
                seg2 = [s2p1, s2p2];
                intersections.push(formatIntersection(hit, seg1, seg2, xx, yy));
                if (hit.length == 4) {
                    intersections.push(formatIntersection(hit.slice(2), seg1, seg2, xx, yy));
                }
            }
        }
        i += 2;
    }
    return intersections;
}
function segmentIntersection(ax, ay, bx, by, cx, cy, dx, dy) {
    const hit = segmentHit(ax, ay, bx, by, cx, cy, dx, dy);
    let p = null;
    if (hit) {
        p = crossIntersection(ax, ay, bx, by, cx, cy, dx, dy);
        if (!p) {
            p = collinearIntersection(ax, ay, bx, by, cx, cy, dx, dy);
        }
        else if (endpointHit(ax, ay, bx, by, cx, cy, dx, dy)) {
            p = null;
        }
    }
    return p;
}
function segmentHit(ax, ay, bx, by, cx, cy, dx, dy) {
    return (orient2D(ax, ay, bx, by, cx, cy) * orient2D(ax, ay, bx, by, dx, dy) <= 0 &&
        orient2D(cx, cy, dx, dy, ax, ay) * orient2D(cx, cy, dx, dy, bx, by) <= 0);
}
function orient2D(ax, ay, bx, by, cx, cy) {
    return determinant2D(ax - cx, ay - cy, bx - cx, by - cy);
}
function determinant2D(a, b, c, d) {
    return a * d - b * c;
}
function crossIntersection(ax, ay, bx, by, cx, cy, dx, dy) {
    let p = lineIntersection(ax, ay, bx, by, cx, cy, dx, dy);
    let nearest;
    if (p) {
        nearest = nearestPoint(p[0], p[1], ax, ay, bx, by, cx, cy, dx, dy);
        if (nearest == 1) {
            p = lineIntersection(bx, by, ax, ay, cx, cy, dx, dy);
        }
        else if (nearest == 2) {
            p = lineIntersection(cx, cy, dx, dy, ax, ay, bx, by);
        }
        else if (nearest == 3) {
            p = lineIntersection(dx, dy, cx, cy, ax, ay, bx, by);
        }
    }
    if (p) {
        clampIntersectionPoint(p, ax, ay, bx, by, cx, cy, dx, dy);
    }
    return p;
}
function lineIntersection(ax, ay, bx, by, cx, cy, dx, dy) {
    const den = determinant2D(bx - ax, by - ay, dx - cx, dy - cy);
    const eps = 1e-18;
    let p;
    if (den === 0)
        return null;
    const m = orient2D(cx, cy, dx, dy, ax, ay) / den;
    if (den <= eps && den >= -eps) {
        p = findEndpointInRange(ax, ay, bx, by, cx, cy, dx, dy);
    }
    else {
        p = [ax + m * (bx - ax), ay + m * (by - ay)];
    }
    return p;
}
function findEndpointInRange(ax, ay, bx, by, cx, cy, dx, dy) {
    let p = null;
    if (!outsideRange(ax, cx, dx) && !outsideRange(ay, cy, dy)) {
        p = [ax, ay];
    }
    else if (!outsideRange(bx, cx, dx) && !outsideRange(by, cy, dy)) {
        p = [bx, by];
    }
    else if (!outsideRange(cx, ax, bx) && !outsideRange(cy, ay, by)) {
        p = [cx, cy];
    }
    else if (!outsideRange(dx, ax, bx) && !outsideRange(dy, ay, by)) {
        p = [dx, dy];
    }
    return p;
}
function outsideRange(a, b, c) {
    let out;
    if (b < c) {
        out = a < b || a > c;
    }
    else if (b > c) {
        out = a > b || a < c;
    }
    else {
        out = a != b;
    }
    return out;
}
function nearestPoint(x, y, ...args) {
    let minIdx = -1, minDist = Infinity, dist;
    for (let i = 0, j = 0, n = args.length; j < n; i++, j += 2) {
        dist = distanceSq(x, y, args[j], args[j + 1]);
        if (dist < minDist) {
            minDist = dist;
            minIdx = i;
        }
    }
    return minIdx;
}
function distanceSq(ax, ay, bx, by) {
    const dx = ax - bx, dy = ay - by;
    return dx * dx + dy * dy;
}
function clampIntersectionPoint(p, ax, ay, bx, by, cx, cy, dx, dy) {
    let x = p[0], y = p[1];
    x = clampToCloseRange(x, ax, bx);
    x = clampToCloseRange(x, cx, dx);
    y = clampToCloseRange(y, ay, by);
    y = clampToCloseRange(y, cy, dy);
    p[0] = x;
    p[1] = y;
}
function clampToCloseRange(a, b, c) {
    let lim;
    if (outsideRange(a, b, c)) {
        lim = Math.abs(a - b) < Math.abs(a - c) ? b : c;
        if (Math.abs(a - lim) > 1e-15) {
        }
        a = lim;
    }
    return a;
}
function collinearIntersection(ax, ay, bx, by, cx, cy, dx, dy) {
    const minX = Math.min(ax, bx, cx, dx), maxX = Math.max(ax, bx, cx, dx), minY = Math.min(ay, by, cy, dy), maxY = Math.max(ay, by, cy, dy), useY = maxY - minY > maxX - minX;
    let coords = [];
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
    }
    else if (coords.length == 4 &&
        coords[0] == coords[2] &&
        coords[1] == coords[3]) {
        coords = null;
    }
    return coords;
}
function endpointHit(ax, ay, bx, by, cx, cy, dx, dy) {
    return ((ax == cx && ay == cy) ||
        (ax == dx && ay == dy) ||
        (bx == cx && by == cy) ||
        (bx == dx && by == dy));
}
function inside(x, minX, maxX) {
    return x > minX && x < maxX;
}
function sortSegmentIds(xx, ids) {
    orderSegmentIds(xx, ids);
    quicksortSegmentIds(xx, ids, 0, ids.length - 2);
}
function orderSegmentIds(xx, ids) {
    for (let i = 0, n = ids.length; i < n; i += 2) {
        if (xx[ids[i]] > xx[ids[i + 1]]) {
            swap(ids, i, i + 1);
        }
    }
}
function swap(ids, i, j) {
    const tmp = ids[i];
    ids[i] = ids[j];
    ids[j] = tmp;
}
function quicksortSegmentIds(a, ids, lo, hi) {
    let i = lo, j = hi, pivot, tmp;
    while (i < hi) {
        pivot = a[ids[((lo + hi) >> 2) << 1]];
        while (i <= j) {
            while (a[ids[i]] < pivot)
                i += 2;
            while (a[ids[j]] > pivot)
                j -= 2;
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
        if (j - lo < 40)
            insertionSortSegmentIds(a, ids, lo, j);
        else
            quicksortSegmentIds(a, ids, lo, j);
        if (hi - i < 40) {
            insertionSortSegmentIds(a, ids, i, hi);
            return;
        }
        lo = i;
        j = hi;
    }
}
function insertionSortSegmentIds(arr, ids, start, end) {
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
function formatIntersection(xy, s1, s2, xx, yy) {
    const x = xy[0], y = xy[1];
    s1 = formatIntersectingSegment(x, y, s1[0], s1[1], xx, yy);
    s2 = formatIntersectingSegment(x, y, s2[0], s2[1], xx, yy);
    const a = s1[0] < s2[0] ? s1 : s2;
    const b = a == s1 ? s2 : s1;
    return { x, y, a, b };
}
function formatIntersectingSegment(x, y, id1, id2, xx, yy) {
    let i = id1 < id2 ? id1 : id2, j = i === id1 ? id2 : id1;
    if (xx[i] == x && yy[i] == y) {
        j = i;
    }
    else if (xx[j] == x && yy[j] == y) {
        i = j;
    }
    return [i, j];
}
function dedupIntersections(arr) {
    const index = {};
    return arr.filter((o) => {
        const key = getIntersectionKey(o);
        if (key in index) {
            return false;
        }
        index[key] = true;
        return true;
    });
}
function getIntersectionKey(o) {
    return `${o.a.join(",")};${o.b.join(",")}`;
}
class ArcIter {
    constructor(xx, yy) {
        this._i = 0;
        this._n = 0;
        this._inc = 1;
        this.i = 0;
        this.x = 0;
        this.y = 0;
        this._xx = xx;
        this._yy = yy;
    }
}
function calcArcBounds(xx, yy, start, len) {
    let i = start | 0;
    const n = isNaN(len) ? xx.length - i : len + i;
    let x, y, xmin, ymin, xmax, ymax;
    if (n > 0) {
        xmin = xmax = xx[i];
        ymin = ymax = yy[i];
    }
    else
        return [undefined, undefined, undefined, undefined];
    for (i++; i < n; i++) {
        x = xx[i];
        y = yy[i];
        if (x < xmin)
            xmin = x;
        if (x > xmax)
            xmax = x;
        if (y < ymin)
            ymin = y;
        if (y > ymax)
            ymax = y;
    }
    return [xmin, ymin, xmax, ymax];
}
class Bounds {
    constructor(...args) {
        if (args.length > 0) {
            this.setBounds(args);
        }
    }
    cloneBounds() {
        return this.clone();
    }
    clone() {
        return new Bounds(this.xmin, this.ymin, this.xmax, this.ymax);
    }
    width() {
        return this.xmax - this.xmin || 0;
    }
    height() {
        return this.ymax - this.ymin || 0;
    }
    setBounds(a, b, c, d) {
        if (arguments.length == 1) {
            if (isArrayLike(a)) {
                b = a[1];
                c = a[2];
                d = a[3];
                a = a[0];
            }
            else {
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
        if (a > c || b > d)
            this.update();
        return this;
    }
    update() {
        let tmp;
        if (this.xmin > this.xmax) {
            tmp = this.xmin;
            this.xmin = this.xmax;
            this.xmax = tmp;
        }
        if (this.ymin > this.ymax) {
            tmp = this.ymin;
            this.ymin = this.ymax;
            this.ymax = tmp;
        }
    }
    mergeBounds(bb, ...args) {
        let a, b, c, d;
        if (bb instanceof Bounds) {
            a = bb.xmin;
            b = bb.ymin;
            c = bb.xmax;
            d = bb.ymax;
        }
        else if (args.length == 3) {
            a = bb;
            b = args[0];
            c = args[1];
            d = args[2];
        }
        else if (bb.length == 4) {
            a = bb[0];
            b = bb[1];
            c = bb[2];
            d = bb[3];
        }
        else {
            error("Bounds#mergeBounds() invalid argument:", bb);
        }
        if (this.xmin === void 0) {
            this.setBounds(a, b, c, d);
        }
        else {
            if (a < this.xmin)
                this.xmin = a;
            if (b < this.ymin)
                this.ymin = b;
            if (c > this.xmax)
                this.xmax = c;
            if (d > this.ymax)
                this.ymax = d;
        }
        return this;
    }
}
//# sourceMappingURL=kinks.js.map