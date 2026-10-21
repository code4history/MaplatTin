import { describe, expect, it } from "vitest";
import { findIntersections } from "../src/index.ts";

// 有限数ではない座標（NaN / Infinity）を含む入力を渡したときの回帰テスト。
// 修正前は例外を投げず、そのまま戻ってきていた。
describe("findIntersections の非有限座標の扱い", () => {
  it("NaN を含む座標は例外になる（タイムアウトしない）", () => {
    const coords = [
      [
        [0, 0],
        [10, NaN]
      ],
      [
        [0, 10],
        [10, 0]
      ]
    ];
    expect(() => findIntersections(coords as never)).toThrow(Error);
    expect(() => findIntersections(coords as never)).toThrow(
      /findIntersections\(\) received non-finite coordinates/
    );
  });

  it("Infinity を含む座標は例外になる（タイムアウトしない）", () => {
    const coords = [
      [
        [0, 0],
        [10, Infinity]
      ],
      [
        [0, 10],
        [10, 0]
      ]
    ];
    expect(() => findIntersections(coords as never)).toThrow(Error);
    expect(() => findIntersections(coords as never)).toThrow(
      /findIntersections\(\) received non-finite coordinates/
    );
  });

  it("-Infinity を含む座標も例外になる", () => {
    const coords = [
      [
        [0, 0],
        [-Infinity, 10]
      ],
      [
        [0, 10],
        [10, 0]
      ]
    ];
    expect(() => findIntersections(coords as never)).toThrow(
      /findIntersections\(\) received non-finite coordinates/
    );
  });
});

describe("findIntersections の正常入力の回帰", () => {
  it("交差する 2 線分の交点を返す", () => {
    const coords = [
      [
        [0, 0],
        [10, 10]
      ],
      [
        [0, 10],
        [10, 0]
      ]
    ];
    expect(findIntersections(coords)).toEqual([
      {
        type: "Feature",
        properties: {},
        geometry: { type: "Point", coordinates: [5, 5] }
      }
    ]);
  });

  it("交差しない線分群では空配列を返す", () => {
    const parallel = [
      [
        [0, 0],
        [10, 0]
      ],
      [
        [0, 10],
        [10, 10]
      ]
    ];
    expect(findIntersections(parallel)).toEqual([]);
  });

  it("複数の交点を返す（折れ線と水平線の交差）", () => {
    const coords = [
      [
        [0, 0],
        [10, 0],
        [10, 10]
      ],
      [
        [5, -5],
        [5, 5]
      ],
      [
        [0, 5],
        [10, 5]
      ]
    ];
    expect(findIntersections(coords)).toEqual([
      {
        type: "Feature",
        properties: {},
        geometry: { type: "Point", coordinates: [5, 0] }
      },
      {
        type: "Feature",
        properties: {},
        geometry: { type: "Point", coordinates: [5, 5] }
      },
      {
        type: "Feature",
        properties: {},
        geometry: { type: "Point", coordinates: [10, 5] }
      }
    ]);
  });

  it("空の入力では空配列を返す", () => {
    expect(findIntersections([])).toEqual([]);
  });
});
