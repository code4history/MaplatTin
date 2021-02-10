import internal from "./mapshaper-maplat";
import { point } from "@turf/helpers";
export default function findIntersections(coords) {
    const arcs = new internal.ArcCollection(coords);
    const xy = internal.findSegmentIntersections(arcs);
    const retXy = internal
        .dedupIntersections(xy)
        .reduce((prev, apoint, index, array) => {
        if (!prev)
            prev = {};
        prev[`${apoint.x}:${apoint.y}`] = apoint;
        if (index != array.length - 1)
            return prev;
        return Object.keys(prev).map(key => point([prev[key].x, prev[key].y]));
    }, []);
    return retXy;
}
//# sourceMappingURL=kinks.js.map