import { describe, expect, it } from "vitest";
import Delaunator from "delaunator";
import { featureCollection, point } from "@turf/turf";
import { constrainedTin, Tin } from "../src/index.ts";
import { Constrain } from "../src/edgebound/index.ts";
import { REAL_DATA_TIMEOUT_MS } from "./timeouts.ts";

// 制約線（edge）の端点は GCP の添字で指定する。
// 添字が GCP の範囲に無い・整数でない edge は、計算に入る前に例外で止める。
const GRID = 5;
const POINT_COUNT = GRID * GRID;
// 12 は格子の中央の点（外周に無い点）

function gridPoints(): [[number, number], [number, number]][] {
  const points: [[number, number], [number, number]][] = [];
  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < GRID; x++) {
      points.push([
        [x * 100 + 50, y * 100 + 50],
        [x * 10 + 5, y * -10 - 5],
      ]);
    }
  }
  return points;
}

function buildTin(): Tin {
  const tin = new Tin({ wh: [500, 500], stateFull: false });
  tin.setPoints(gridPoints());
  return tin;
}

const INVALID_ENDPOINTS: [string, unknown[]][] = [
  ["GCP の数と同じ添字", [12, POINT_COUNT]],
  ["GCP の数を大きく超える添字", [12, 5000]],
  ["負の添字", [-1, 3]],
  ["小数の添字", [1.5, 7]],
  ["NaN の添字", [12, NaN]],
  ["両端が NaN", [NaN, NaN]],
  ["Infinity の添字", [12, Infinity]],
  ["端点が 1 つしか無い", [12]],
  ["null の添字", [null, 5]],
  ["文字列の添字", ["a", "b"]],
  ["数字の文字列の添字", ["12", "7"]],
];

describe("Tin: edge の添字の検査", () => {
  describe.each(INVALID_ENDPOINTS)("%s", (_label, startEnd) => {
    it("中間点の無い edge は updateTin() が例外になる", () => {
      const tin = buildTin();
      tin.setEdges([[[], [], startEnd]] as never);
      expect(() => tin.updateTin()).toThrow(Error);
      expect(() => tin.updateTin()).toThrow(/Invalid edge/);
    });

    it("中間点のある edge は updateTin() が例外になる", () => {
      const tin = buildTin();
      tin.setEdges([[[[120, 80]], [[12, -8]], startEnd]] as never);
      expect(() => tin.updateTin()).toThrow(Error);
      expect(() => tin.updateTin()).toThrow(/Invalid edge/);
    });
  });

  it("setPoints より先に setEdges を呼んでも、正しい添字の edge は通る", () => {
    const tin = new Tin({ wh: [500, 500], stateFull: false });
    tin.setEdges([[[], [], [0, 7]]]);
    tin.setPoints(gridPoints());
    expect(() => tin.updateTin()).not.toThrow();
  });

  it("正しい添字の edge は TIN の辺として残る", () => {
    const tin = buildTin();
    // 格子の対角ではない 2 点を結ぶ（Delaunay 分割には現れない辺）
    tin.setEdges([[[], [], [0, 7]]]);
    tin.updateTin();
    const hasEdge = tin.tins!.forw!.features.some((tri) => {
      const indices = (["a", "b", "c"] as const).map(
        (key) => tri.properties![key].index,
      );
      return indices.includes(0) && indices.includes(7);
    });
    expect(hasEdge).toBe(true);
  });

  it("最後の GCP を端点にする edge は通る（上限の境界）", () => {
    const tin = buildTin();
    tin.setEdges([[[], [], [POINT_COUNT - 2, POINT_COUNT - 1]]]);
    expect(() => tin.updateTin()).not.toThrow();
  });
});

describe("Constrain / constrainedTin: edge の添字の検査", () => {
  const coords = gridPoints().map((p) => p[0]);

  it.each(INVALID_ENDPOINTS)("constrainOne: %s は例外になる", (_label, startEnd) => {
    const con = new Constrain(Delaunator.from(coords));
    expect(() =>
      con.constrainOne(startEnd[0] as number, startEnd[1] as number),
    ).toThrow(/Invalid edge/);
  });

  it.each(INVALID_ENDPOINTS)("constrainedTin: %s は例外になる", (_label, startEnd) => {
    const fc = featureCollection(
      coords.map((xy, index) => point(xy, { target: { index } })),
    );
    expect(() => constrainedTin(fc, [startEnd] as never, "target")).toThrow(
      /Invalid edge/,
    );
  });

  it("三角網に入らなかった頂点（重複点）を始点にする edge は例外になる", () => {
    // Delaunator は座標が重なる点の一方を三角網に入れない
    const withDuplicate = [...coords, coords[12]];
    const del = Delaunator.from(withDuplicate);
    const used = new Set(Array.from(del.triangles));
    const unused = [12, withDuplicate.length - 1].find((i) => !used.has(i));
    expect(unused).toBeDefined();
    const con = new Constrain(del);
    expect(() => con.constrainOne(unused!, 1)).toThrow(/Invalid edge/);
  });

  describe("同じ位置の点が 2 回あるとき（片方は三角網に入らない）", () => {
    // 少しずつずらした 10×10 の格子と、0 番（外周の角）と同じ位置の 100 番
    const jittered: [number, number][] = [];
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        jittered.push([x * 100 + 50 + (y % 2) * 13, y * 100 + 50 + (x % 3) * 7]);
      }
    }
    const withTwin: [number, number][] = [...jittered, [...jittered[0]]];
    const twins = (del: Delaunator<Float64Array>) => {
      const used = new Set(Array.from(del.triangles));
      const unused = [0, 100].find((i) => !used.has(i))!;
      return { unused, used: unused === 0 ? 100 : 0 };
    };

    it("その 2 点を結ぶ edge は、どちら向きでも例外になる", () => {
      const del = Delaunator.from(withTwin);
      const { unused, used } = twins(del);
      expect(unused).toBeDefined();
      expect(() => new Constrain(del).constrainOne(used, unused)).toThrow(
        /Invalid edge/,
      );
      expect(() => new Constrain(del).constrainOne(unused, used)).toThrow(
        /Invalid edge/,
      );
    });

    it("三角網に入らなかった点を終点にする edge は例外になる", () => {
      const del = Delaunator.from(withTwin);
      const { unused } = twins(del);
      for (const from of [3, 45, 99]) {
        expect(() => new Constrain(del).constrainOne(from, unused)).toThrow(
          /Invalid edge/,
        );
      }
    });

    it("findEdge は、三角網に無い点・範囲に無い点に対して Infinity を返す", () => {
      const del = Delaunator.from(withTwin);
      const { unused, used } = twins(del);
      const con = new Constrain(del);
      expect(con.findEdge(used, unused)).toBe(Infinity);
      expect(con.findEdge(unused, used)).toBe(Infinity);
      expect(con.findEdge(3, 9999)).toBe(Infinity);
      expect(con.findEdge(3, -1)).toBe(Infinity);
    });

    it("Tin: 同じ GCP を 2 回入れて線で結ぶと updateTin() が例外になる", () => {
      const gcps = withTwin.map(
        (p) => [p, [p[0] / 10, -p[1] / 10]] as [[number, number], [number, number]],
      );
      for (const edge of [[0, 100], [100, 0]] as [number, number][]) {
        const tin = new Tin({ wh: [1100, 1100], stateFull: false });
        tin.setPoints(gcps);
        tin.setEdges([[[], [], edge]]);
        expect(() => tin.updateTin()).toThrow(/Invalid edge/);
      }
    });
  });

  it("歩く回数の上限を超えたら例外になる（止まらない状態にならない）", () => {
    // 座標が数でない点を端点にすると、添字が正しくても歩きが終わらない
    const points: [number, number][] = [];
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) points.push([x * 100 + 50, y * 100 + 50]);
    }
    points.push([NaN, NaN]);
    const con = new Constrain(Delaunator.from(points));
    expect(() => con.constrainOne(44, 100)).toThrow(/iteration limit/);
  });

  it("多くの辺を横切る制約線は、歩く回数が増えても通る（上限が誤って効かない）", () => {
    // 制約線の上下に弓なりの点列を置き、1 本の制約線がその間の辺をすべて横切る配置。
    // 歩く回数は横切る辺の数の 2 乗に比例して増える。
    const half = 2500;
    const curve = 200 / (half * half);
    const points: [number, number][] = [];
    for (let i = 0; i < half; i++) {
      const upperX = i + 0.25;
      const lowerX = i + 0.75;
      points.push([upperX, 60 + curve * (upperX - half / 2) ** 2]);
      points.push([lowerX, -60 - curve * (lowerX - half / 2) ** 2]);
    }
    points.push([-half, 0.0007]);
    points.push([2 * half, -0.0011]);
    const start = points.length - 2;
    const end = points.length - 1;
    const con = new Constrain(Delaunator.from(points));
    const edge = con.constrainOne(start, end);
    expect(edge).not.toBe(Infinity);
    expect(con.isConstrained(Math.abs(edge))).toBe(true);
  }, REAL_DATA_TIMEOUT_MS);

  it("正しい添字の edge は constrainOne が辺を返す", () => {
    const con = new Constrain(Delaunator.from(coords));
    const edge = con.constrainOne(0, 7);
    expect(edge).not.toBe(Infinity);
    expect(con.isConstrained(Math.abs(edge))).toBe(true);
  });
});
