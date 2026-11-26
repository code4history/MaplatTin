import { describe, expect, it } from "vitest";
import { booleanPointInPolygon, polygon } from "@turf/turf";
import { Tin, type Options } from "../src/index.ts";

// 紙 2048 画素四方の EPSG:4326 の等間隔図（東経 125〜150 度・北緯 25〜50 度）。
// 対称な格子の GCP を置き、補助頂点の三角形が凸包に食い込まないこと（凸包の辺の制約）と、
// 扇形の中心が GCP の重心そのものであること（V2 と同じ求め方）を確かめる。
const W = 2048;
const S = 25 / W;
const merc = ([lon, lat]: number[]): number[] => [
  (6378137 * lon * Math.PI) / 180,
  6378137 * Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360))
];
const pixelToLonLat = ([x, y]: number[]): number[] => [125 + S * (x - 0.5), 50 - S * (y - 0.5)];

function grid(n: number, lo: number, hi: number): NonNullable<Options["points"]> {
  const values = Array.from({ length: n }, (_, i) => lo + ((hi - lo) * i) / (n - 1));
  return values.flatMap((y) =>
    values.map((x) => [[x, y], merc(pixelToLonLat([x, y]))] as [number[], number[]])
  );
}

const GRIDS = [
  // 紙の中央 30% に 3×3（補助頂点の輪が GCP の格子から 62 画素しか離れない）
  { name: "3×3", n: 3, points: grid(3, W * 0.35, W * 0.65) },
  { name: "5×5", n: 5, points: grid(5, W * 0.2, W * 0.8) }
] as const;
const MODES = [Tin.MODE_STRICT, Tin.MODE_AUTO, Tin.MODE_LOOSE] as const;

function build(points: Options["points"], strictMode: Options["strictMode"]): Tin {
  const tin = new Tin({ wh: [W, W], yaxisMode: "invert", points, strictMode });
  tin.updateTin();
  return tin;
}

describe.each(GRIDS)("対称な格子 $name", ({ n, points }) => {
  const xs = points!.map(([forw]) => forw[0]);
  const ys = points!.map(([forw]) => forw[1]);
  const [left, right] = [Math.min(...xs), Math.max(...xs)];
  const [top, bottom] = [Math.min(...ys), Math.max(...ys)];
  const center = [(left + right) / 2, (top + bottom) / 2];

  describe.each(MODES)("strictMode=%s", (mode) => {
    const tin = build(points, mode);
    const compiled = tin.getCompiled();

    it("凸包の内側の三角形は GCP だけからなる（補助頂点が食い込まない）", () => {
      const hull = polygon([[[left, top], [right, top], [right, bottom], [left, bottom], [left, top]]]);
      const meshes = [tin.tins!.forw!, tin.tins!.bakw!];
      const gcpOnly = (index: unknown) => typeof index === "number";
      for (const [direction, mesh] of meshes.entries()) {
        // 地図面だけで判定できる（地理面は座標が違うので、頂点が GCP だけかどうかで数える）
        let gcpOnlyCount = 0;
        for (const triangle of mesh.features) {
          const { a, b, c } = triangle.properties!;
          const allGcp = [a, b, c].every(({ index }) => gcpOnly(index));
          if (allGcp) gcpOnlyCount++;
          if (direction === 0 && !allGcp) {
            const [p, q, r] = triangle.geometry!.coordinates[0];
            const mid = [(p[0] + q[0] + r[0]) / 3, (p[1] + q[1] + r[1]) / 3];
            const onBoundary = mid[0] <= left || mid[0] >= right || mid[1] <= top || mid[1] >= bottom;
            expect(!onBoundary && booleanPointInPolygon(mid, hull)).toBe(false);
          }
        }
        expect(gcpOnlyCount).toBe(2 * (n - 1) ** 2);
      }
    });

    it("凸包の内側で、経線のずれが 0（GCP の配置が線形の変換に乗る）", () => {
      const lat0 = pixelToLonLat([0, top])[1];
      const lat1 = pixelToLonLat([0, bottom])[1];
      for (let i = 1; i < 12; i++) {
        const lat = lat0 + ((lat1 - lat0) * i) / 12;
        for (const lon of [pixelToLonLat([left, 0])[0] + 0.01, 135]) {
          if (lon < pixelToLonLat([left, 0])[0] || lon > pixelToLonLat([right, 0])[0]) continue;
          const [x] = tin.transform(merc([lon, lat]), true) as number[];
          expect(x).toBeCloseTo((lon - 125) / S + 0.5, 6);
        }
      }
    });

    it("扇形の中心は GCP の重心そのもので、補助頂点が上下左右に対称", () => {
      const [forw] = compiled.centroid_point!;
      expect(forw[0]).toBeCloseTo(center[0], 9);
      expect(forw[1]).toBeCloseTo(center[1], 9);
      // 地理側は三角網で変換した値（中心の GCP の地理座標）
      const [, bakw] = compiled.centroid_point!;
      const middle = points![(points!.length - 1) / 2][1] as number[];
      expect(bakw[0]).toBeCloseTo(middle[0], 3);
      expect(bakw[1]).toBeCloseTo(middle[1], 3);

      const vertices = compiled.vertices_points.map(([v]) => v);
      const has = (x: number, y: number) =>
        vertices.some(([vx, vy]) => Math.abs(vx - x) < 1e-6 && Math.abs(vy - y) < 1e-6);
      for (const [x, y] of vertices) {
        expect(has(2 * center[0] - x, y)).toBe(true);
        expect(has(x, 2 * center[1] - y)).toBe(true);
      }
    });
  });
});
