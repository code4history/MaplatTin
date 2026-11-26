import { describe, expect, it } from "vitest";
import { booleanPointInPolygon, polygon } from "@turf/turf";
import { readFileSync } from "node:fs";
import { Tin, type Compiled, type Options } from "../src/index.ts";
import { REAL_DATA_TIMEOUT_MS } from "./timeouts.ts";
import { intrusionFraction } from "./hull-intrusion.ts";

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

// ─── 緯線がわずかに曲がる格子 ────────────────────────────────────────────────
// 地理側の緯度に k·u²（u は格子の左右方向の位置 -1〜1）を足す。k=0.001 度は約 0.08 画素で、
// 地図面の凸包の辺が地理面ではわずかに外へ出る（凸包の辺にならない）。この程度の食い違いで
// 凸包の辺を制約から外すと、補助頂点の三角形が凸包に食い込む。
function bentGrid(n: number, lo: number, hi: number, k: number): NonNullable<Options["points"]> {
  const values = Array.from({ length: n }, (_, i) => lo + ((hi - lo) * i) / (n - 1));
  return values.flatMap((y) =>
    values.map((x) => {
      const u = (x - (lo + hi) / 2) / ((hi - lo) / 2);
      const [lon, lat] = pixelToLonLat([x, y]);
      return [[x, y], merc([lon, lat + k * u * u])] as [number[], number[]];
    })
  );
}

describe.each([
  { n: 3, lo: W * 0.35, hi: W * 0.65 },
  { n: 5, lo: W * 0.2, hi: W * 0.8 }
])("緯線が曲がる $n×$n の格子", ({ n, lo, hi }) => {
  describe.each([0.001, 0.0122, 0.1, -0.0122])("k=%s", (k) => {
    it.each(MODES)("strictMode=%s: GCP だけの三角形が埋め尽くし、食い込みが 0", (mode) => {
      const tin = build(bentGrid(n, lo, hi, k), mode);
      expect(tin.strict_status).toBe(mode === Tin.MODE_LOOSE ? Tin.STATUS_LOOSE : Tin.STATUS_STRICT);
      const gcpOnly = tin.tins!.forw!.features.filter(({ properties }) => {
        const { a, b, c } = properties!;
        return [a, b, c].every(({ index }) => typeof index === "number");
      });
      expect(gcpOnly).toHaveLength(2 * (n - 1) ** 2);
      // 地図面の凸包の内側は、GCP だけの三角形で埋まる。strict は地理面の三角網を地図面から写すので、
      // 地理面の凸包（緯線が曲がると写した三角網の外周とは一致しない）での食い込みは loose だけ確かめる。
      expect(intrusionFraction(tin, 0)).toBeLessThan(1e-9);
      if (mode === Tin.MODE_LOOSE) expect(intrusionFraction(tin, 1)).toBeLessThan(1e-9);
    });
  });
});

// ─── 隅の方向が 10° の区分の境界に一致する矩形 ───────────────────────────────
// 四隅・中心・四分点の 9 点。隅の方向（atan(幅/高さ) が 10° の倍数）を通る区分の補助頂点が、
// 隅の頂点と同じ位置になる（重複すると反転が大量に出て、strict が loose に落ちる）。
describe.each([50, 40, 60, 30])("隅の方向が %s° の矩形", (deg) => {
  it("補助頂点が隅と重複せず、strict のまま反転が 0", () => {
    const h = 1000;
    const w = h * Math.tan((deg * Math.PI) / 180);
    const points = [
      [0, 0], [w, 0], [w, h], [0, h], [w / 2, h / 2],
      [w * 0.75, h * 0.25], [w * 0.25, h * 0.75], [w * 0.75, h * 0.75], [w * 0.25, h * 0.25]
    ].map(([x, y]) => [[x, y], [x, -y]] as [number[], number[]]);
    const tin = new Tin({ wh: [w, h], points, strictMode: Tin.MODE_AUTO });
    tin.updateTin();
    const vertices = tin.getCompiled().vertices_points.map(([v]) => v);
    const duplicates = vertices.filter((v, i) =>
      vertices.some((u, j) => j < i && Math.abs(u[0] - v[0]) < 1e-6 && Math.abs(u[1] - v[1]) < 1e-6)
    );
    expect(duplicates).toHaveLength(0);
    expect(tin.strict_status).toBe(Tin.STATUS_STRICT);
    expect(tin.boundaryDiagnostics).toMatchObject({ boundaryTriangleFlips: 0, remainingForbiddenTriangles: 0 });
  });
});

// ─── 実データ: strict を保ったまま食い込みを減らす ──────────────────────────
// 食い込み = 補助頂点を含む三角形が凸包の内側に入る面積 / 凸包の面積（地図面。auto の strict の三角網）。
// 凸包の辺を全部制約にして組み、strict を壊す辺だけを外す。割合の上限は実測（括弧内は凸包の辺を
// 制約にしなかった版の割合）に少し余裕を持たせたもの。
interface MapFixture {
  width: number;
  height: number;
  gcps?: Options["points"];
  edges?: Options["edges"];
  vertexMode?: Options["vertexMode"];
  compiled?: Compiled;
}
function buildFixture(name: string, strictMode: Options["strictMode"]): Tin {
  const map: MapFixture = JSON.parse(readFileSync(new URL(`./maps/${name}.json`, import.meta.url), "utf8"));
  const compiled = map.compiled;
  const tin = new Tin({
    wh: compiled?.wh ?? [map.width, map.height],
    vertexMode: map.vertexMode ?? compiled?.vertexMode,
    strictMode,
    yaxisMode: compiled?.yaxisMode,
    points: map.gcps ?? compiled?.points,
    edges: map.edges ?? compiled?.edges
  });
  tin.updateTin();
  return tin;
}

describe.each([
  // [地図, strict の判定, 食い込みの上限]
  ["tatebayashi_kaei_jokamachi", Tin.STATUS_STRICT, 0.0005], // 0.04%（10.19%）全部の辺を制約にできる
  ["miesan_ginza_map", Tin.STATUS_STRICT, 0.001], // 0.05%（6.30%）1 本外す
  ["fushimijo_maplat", Tin.STATUS_STRICT, 0.0001], // 0.0003%（16.09%）
  ["1932_nobeoka", Tin.STATUS_STRICT, 0.045], // 3.80%（10.94%）
  ["tatebayashi_castle_akimoto", Tin.STATUS_STRICT, 0.055], // 4.98%（9.33%）
  ["naramachi_yasui_bunko", Tin.STATUS_STRICT, 0.04] // 3.61%（5.59%。base は strict_error）
] as const)("%s", (name, status, limit) => {
  it(
    `auto は ${status} のまま、食い込みが ${(limit * 100).toFixed(2)}% 以下`,
    () => {
      const tin = buildFixture(name, Tin.MODE_AUTO);
      expect(tin.strict_status).toBe(status);
      expect(intrusionFraction(tin, 0)).toBeLessThanOrEqual(limit);
    },
    REAL_DATA_TIMEOUT_MS
  );
});
