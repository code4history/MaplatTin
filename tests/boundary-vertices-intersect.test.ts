import { describe, expect, it } from "vitest";
import { lineIntersect, lineString } from "@turf/turf";
import type { Position } from "geojson";
import { firstSegmentIntersection } from "../src/boundary-vertices.ts";

// turf の lineIntersect が最初に返す交点（従来の checkAndAdjustVerticesN の呼び方）
function viaTurf(a: Position, b: Position, c: Position, d: Position): Position | null {
  const found = lineIntersect(lineString([a, b]), lineString([c, d]));
  return found.features.length > 0 && found.features[0].geometry
    ? found.features[0].geometry.coordinates
    : null;
}

function expectSame(a: Position, b: Position, c: Position, d: Position) {
  const expected = viaTurf(a, b, c, d);
  const actual = firstSegmentIntersection(a, b, c, d);
  if (expected === null) {
    expect(actual, JSON.stringify([a, b, c, d])).toBeNull();
  } else {
    expect(actual, JSON.stringify([a, b, c, d])).not.toBeNull();
    // 1 ビットも違わないこと（-0 と 0 も区別する）
    expect(Object.is(actual![0], expected[0]), JSON.stringify([a, b, c, d, actual, expected])).toBe(true);
    expect(Object.is(actual![1], expected[1]), JSON.stringify([a, b, c, d, actual, expected])).toBe(true);
  }
}

function lcg(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
}

describe("firstSegmentIntersection（turf の lineIntersect と同じ交点）", () => {
  it("実数の乱数の線分 20,000 組で、交点が 1 ビットも違わない", () => {
    const rnd = lcg(20261127);
    const p = (): Position => [rnd() * 1e4 - 5e3, rnd() * 1e4 - 5e3];
    let hits = 0;
    for (let k = 0; k < 20000; k++) {
      const [a, b, c, d] = [p(), p(), p(), p()];
      if (viaTurf(a, b, c, d)) hits++;
      expectSame(a, b, c, d);
    }
    // 交わる組が十分に含まれていること
    expect(hits).toBeGreaterThan(2000);
  });

  it("整数格子の線分（端点の共有・x や y の一致・縦線・共線・長さ 0 を多く含む）20,000 組でも同じ", () => {
    const rnd = lcg(7);
    const p = (): Position => [Math.floor(rnd() * 6), Math.floor(rnd() * 6)];
    for (let k = 0; k < 20000; k++) {
      expectSame(p(), p(), p(), p());
    }
  });

  it("補助頂点の使い方（重心から点への線分と、四辺形の辺）で同じ", () => {
    const rnd = lcg(99);
    for (let k = 0; k < 5000; k++) {
      const cx = rnd() * 1e5, cy = rnd() * 1e5, r = 1 + rnd() * 5e3;
      const a0 = rnd() * Math.PI * 2;
      const verts = Array.from({ length: 8 }, (_, i): Position => [
        cx + r * (0.8 + rnd() * 0.5) * Math.cos(a0 + (i * Math.PI) / 4),
        cy + r * (0.8 + rnd() * 0.5) * Math.sin(a0 + (i * Math.PI) / 4)
      ]);
      const node: Position = [cx + (rnd() - 0.5) * 3 * r, cy + (rnd() - 0.5) * 3 * r];
      for (let i = 0; i < 8; i++) expectSame(verts[i], verts[(i + 1) % 8], [cx, cy], node);
    }
  });

  it("NaN・無限大を含むときも turf と同じ結果になる（turf に委ねる）", () => {
    const bad: Position[][] = [
      [[0, 0], [1, 1], [0, 1], [1, NaN]],
      [[0, 0], [Infinity, 1], [0, 1], [1, 0]]
    ];
    for (const [a, b, c, d] of bad) {
      let expected: unknown, actual: unknown;
      try { expected = viaTurf(a, b, c, d); } catch (e) { expected = String(e); }
      try { actual = firstSegmentIntersection(a, b, c, d); } catch (e) { actual = String(e); }
      expect(actual).toEqual(expected);
    }
  });
});
