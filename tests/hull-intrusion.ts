import { orient2d } from "robust-predicates";
import type { Position } from "geojson";
import type { Tin } from "../src/index.ts";

type P = number[];

const cross = (o: P, a: P, b: P) => orient2d(o[0], o[1], a[0], a[1], b[0], b[1]);

function hullOf(points: P[]): P[] {
  const sorted = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const chain = (ps: P[]) => {
    const out: P[] = [];
    for (const p of ps) {
      while (out.length >= 2 && cross(out[out.length - 2], out[out.length - 1], p) <= 0) out.pop();
      out.push(p);
    }
    out.pop();
    return out;
  };
  return [...chain(sorted), ...chain([...sorted].reverse())];
}

function area(polygon: P[]): number {
  let a = 0;
  for (let i = 0; i < polygon.length; i++) {
    const p = polygon[i];
    const q = polygon[(i + 1) % polygon.length];
    a += p[0] * q[1] - q[0] * p[1];
  }
  return a / 2;
}

/** 凸多角形 hull（頂点の向きは問わない）で三角形 subject を切り抜く（Sutherland–Hodgman）。 */
function clip(subject: P[], hull: P[]): P[] {
  const sign = Math.sign(area(hull));
  let out = subject;
  for (let i = 0; i < hull.length && out.length > 0; i++) {
    const a = hull[i];
    const b = hull[(i + 1) % hull.length];
    const side = (p: P) => sign * ((b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]));
    const next: P[] = [];
    for (let k = 0; k < out.length; k++) {
      const p = out[k];
      const q = out[(k + 1) % out.length];
      const meet = (): P => {
        const t = side(p) / (side(p) - side(q));
        return [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
      };
      if (side(p) >= 0) {
        next.push(p);
        if (side(q) < 0) next.push(meet());
      } else if (side(q) >= 0) {
        next.push(meet());
      }
    }
    out = next;
  }
  return out;
}

/**
 * 補助頂点を含む三角形が、GCP（と必須エッジの中継点）の凸包の内側に食い込む面積の、凸包の面積に対する割合。
 * direction は 0 が地図面、1 が地理面。三角網は `tin.tins` の採用した三角網。
 */
export function intrusionFraction(tin: Tin, direction: 0 | 1): number {
  const side = direction === 0 ? "forw" : "bakw";
  const points: P[] = [...tin.points, ...((tin.edgeNodes ?? []) as Position[][])].map(
    (pair) => pair[direction] as P
  );
  const hull = hullOf(points);
  const hullArea = Math.abs(area(hull));
  let total = 0;
  for (const triangle of tin.tins![side]!.features) {
    const { a, b, c } = triangle.properties!;
    if ([a, b, c].every(({ index }) => typeof index === "number" || String(index).startsWith("e"))) continue;
    const corners = triangle.geometry!.coordinates[0].slice(0, 3) as P[];
    total += Math.abs(area(clip(corners, hull)));
  }
  return total / hullArea;
}
