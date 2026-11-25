import { describe, expect, it } from "vitest";
import fs from "node:fs";
import type { Position } from "geojson";
import { findIntersections, Tin } from "../src/index.ts";
import {
  findIntersectionsUpTo,
  MAX_KINKS_PER_DIRECTION,
} from "../src/kinks.ts";
import { REAL_DATA_TIMEOUT_MS } from "./timeouts.ts";

// 交差の件数は線分の数の 2 乗まで増えうる。
// 件数に上限を置き、上限に届いたら数え上げをやめることを確かめる。

function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 2 ** 32;
  };
}

/** 互いに交わる線分の束（縦 n 本 × 横 n 本 ∴ 交点は n×n 個） */
function lattice(n: number): Position[][] {
  const lines: Position[][] = [];
  for (let i = 0; i < n; i++) {
    lines.push([[i + 0.5, -1], [i + 0.5, n + 1]]);
    lines.push([[-1, i + 0.5], [n + 1, i + 0.5]]);
  }
  return lines;
}

/** 画像側と地図側の位置に関係が無い GCP */
function unrelatedPoints(n: number): [[number, number], [number, number]][] {
  const r = rng(n);
  const points: [[number, number], [number, number]][] = [];
  for (let i = 0; i < n; i++) {
    points.push([
      [r() * 5000, r() * 5000],
      [r() * 5000, r() * -5000],
    ]);
  }
  return points;
}

describe("findIntersectionsUpTo: 交差の件数の上限", () => {
  it("上限が件数より大きければ findIntersections と同じ結果を返す", () => {
    const coords = lattice(10);
    const all = findIntersections(coords);
    expect(all).toHaveLength(100);
    expect(findIntersectionsUpTo(coords, 1000)).toEqual(all);
    expect(findIntersectionsUpTo(coords, 100)).toEqual(all);
  });

  it("上限に届いたら数え上げをやめる", () => {
    const coords = lattice(10);
    expect(findIntersectionsUpTo(coords, 7)).toHaveLength(7);
    expect(findIntersectionsUpTo(coords, 1)).toHaveLength(1);
  });

  it("交差が無ければ上限に関係なく空を返す", () => {
    const parallel = [
      [[0, 0], [10, 0]],
      [[0, 10], [10, 10]],
    ];
    expect(findIntersectionsUpTo(parallel, 1)).toEqual([]);
  });

  it("公開関数 findIntersections は件数を切らない", () => {
    expect(findIntersections(lattice(40))).toHaveLength(1600);
  });
});

describe("Tin: 実データの kinks は上限で切れない", () => {
  // strict で交差が残る実データ。上限なしの結果と、現在の外周での実測件数に一致すること。
  it.each([
    ["V3", false, 27177],
    ["V2", true, 28599],
  ])("uno_bus_gtfs_error (%s) の bakw の kinks は全件残る", (_label, useV2, expected) => {
    const map = JSON.parse(
      fs.readFileSync(`${__dirname}/maps/uno_bus_gtfs_error.json`, "utf-8"),
    );
    const tin = new Tin({
      wh: [map.width, map.height],
      strictMode: "strict",
      vertexMode: map.vertexMode,
      stateFull: false,
      useV2Algorithm: useV2,
    });
    tin.setPoints(map.gcps);
    tin.setEdges(map.edges);
    tin.updateTin();
    expect(tin.strict_status).toBe(Tin.STATUS_ERROR);
    const all = findIntersections(
      tin.tins!.bakw!.features.map((tri) => tri.geometry!.coordinates[0]),
    );
    expect(tin.kinks!.bakw!.features).toHaveLength(all.length);
    expect(tin.kinks!.bakw!.features).toHaveLength(expected);
  }, REAL_DATA_TIMEOUT_MS);
});

describe("findIntersectionsUpTo: 上限は重複を除いた件数に掛かる", () => {
  it("同じ位置の交差が何度見つかっても、返す件数は上限まで届く", () => {
    // 3 本以上の線分が同じ点で交わると、同じ位置の交差が複数回見つかる
    const star = (cx: number): Position[][] => [
      [[cx - 1, -1], [cx + 1, 1]],
      [[cx - 1, 1], [cx + 1, -1]],
      [[cx - 1, 0], [cx + 1, 0]],
      [[cx, -1], [cx, 1]],
    ];
    const coords = [0, 10, 20, 30, 40].flatMap(star);
    expect(findIntersections(coords)).toHaveLength(5);
    expect(findIntersectionsUpTo(coords, 3)).toHaveLength(3);
    expect(findIntersectionsUpTo(coords, 5)).toEqual(findIntersections(coords));
  });
});

describe("findIntersectionsUpTo: 位置が重なる交差ばかりのとき", () => {
  it("件数の上限に届かなくても、見つけた交差の総数の上限で数え上げをやめる", () => {
    // 端点を 3×3 の格子点だけから選んだ線分。交差は多いが、位置は少数に重なる
    const r = rng(7);
    const node = (): Position => [Math.floor(r() * 3), Math.floor(r() * 3)];
    const coords: Position[][] = [];
    while (coords.length < 8000) {
      const a = node();
      const b = node();
      if (a[0] !== b[0] || a[1] !== b[1]) coords.push([a, b]);
    }
    const limit = 1000;
    const started = performance.now();
    const found = findIntersectionsUpTo(coords, limit);
    const elapsed = performance.now() - started;
    expect(found.length).toBeGreaterThan(0);
    expect(found.length).toBeLessThan(limit);
    // 上限が無いと数千万組を数え上げる（手元で 5 秒以上）。上限があれば一瞬で終わる
    expect(elapsed).toBeLessThan(2000);
  }, REAL_DATA_TIMEOUT_MS);
});

describe("Tin: 対応が乱れた GCP の交差の数え上げ", () => {
  it("strict では kinks の件数が上限を超えない", () => {
    const tin = new Tin({
      wh: [5000, 5000],
      strictMode: "strict",
      stateFull: false,
    });
    tin.setPoints(unrelatedPoints(400));
    tin.updateTin();
    expect(tin.strict_status).toBe(Tin.STATUS_ERROR);
    expect(tin.kinks!.bakw!.features.length).toBeGreaterThan(0);
    expect(tin.kinks!.bakw!.features.length).toBeLessThanOrEqual(
      MAX_KINKS_PER_DIRECTION,
    );
  }, REAL_DATA_TIMEOUT_MS);

  it("件数の上限を 1 にした数え上げ（auto が使う形）は交差を 1 件だけ持つ", () => {
    const tin = new Tin({
      wh: [5000, 5000],
      strictMode: "strict",
      stateFull: false,
    });
    tin.setPoints(unrelatedPoints(200));
    tin.updateTin();
    tin.calculateStrictTin(1);
    expect(tin.strict_status).toBe(Tin.STATUS_ERROR);
    expect(tin.kinks!.bakw!.features).toHaveLength(1);
  }, REAL_DATA_TIMEOUT_MS);

  it("auto では loose に切り替わり kinks を残さない（今までどおり）", () => {
    const tin = new Tin({ wh: [5000, 5000], stateFull: false });
    tin.setPoints(unrelatedPoints(200));
    tin.updateTin();
    expect(tin.strict_status).toBe(Tin.STATUS_LOOSE);
    expect(tin.kinks).toBeUndefined();
  }, REAL_DATA_TIMEOUT_MS);

  it("交差の無い GCP は strict のまま（上限は効かない）", () => {
    const points: [[number, number], [number, number]][] = [];
    for (let y = 0; y < 6; y++) {
      for (let x = 0; x < 6; x++) {
        points.push([
          [x * 100 + 50, y * 100 + 50],
          [x * 10 + 5, y * -10 - 5],
        ]);
      }
    }
    const tin = new Tin({ wh: [600, 600], stateFull: false });
    tin.setPoints(points);
    tin.updateTin();
    expect(tin.strict_status).toBe(Tin.STATUS_STRICT);
    expect(tin.kinks).toBeUndefined();
  });
});
