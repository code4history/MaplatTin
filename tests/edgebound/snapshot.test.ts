import { describe, it, expect } from "vitest";
import Delaunator from "delaunator";
import { Constrain } from "@/edgebound";
import { validateAllConstraints, validateDelaunay, validateVertMap } from "./validators";

type P2 = [number, number];

// 少し揺らした 8×8 の格子（添字は y*8+x）。隣り合う点どうしの辺は互いに交差しない
function jitteredGrid(): P2[] {
  let s = 7;
  const next = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296 - 0.5;
  };
  return Array.from({ length: 64 }, (_, i) => [
    (i % 8) * 100 + next() * 60,
    Math.floor(i / 8) * 100 + next() * 60
  ] as P2);
}

const trianglesOf = (c: Constrain) => Array.from(c.del.triangles as ArrayLike<number>);

describe("Constrain の snapshot / restore", () => {
  const coords = jitteredGrid();
  const required: [number, number][] = [[0, 1], [9, 10], [18, 19], [27, 28]];
  // 途中の点を飛ばす長い辺（三角網の辺の反転が要る）
  const later: [number, number][] = [[32, 35], [40, 43], [48, 51]];

  it("控えから復元して続きを張ると、最初から続けて張ったのと同じ三角網になる", () => {
    const direct = new Constrain(Delaunator.from(coords), required);
    const snapshot = direct.snapshot();
    direct.constrainAll(later);

    const restored = Constrain.restore(snapshot);
    restored.constrainAll(later);

    expect(trianglesOf(restored)).toEqual(trianglesOf(direct));
    expect(Array.from(restored.del.halfedges as ArrayLike<number>)).toEqual(
      Array.from(direct.del.halfedges as ArrayLike<number>)
    );
    validateVertMap(coords, restored);
    validateAllConstraints(coords, [...required, ...later], restored);
    validateDelaunay(restored);
  });

  it("控えは何度でも使え、復元したものへの変更は控えにも元の三角網にも及ばない", () => {
    const base = new Constrain(Delaunator.from(coords), required);
    const before = trianglesOf(base);
    const snapshot = base.snapshot();

    const first = Constrain.restore(snapshot);
    first.constrainAll(later);
    const second = Constrain.restore(snapshot);

    expect(trianglesOf(base)).toEqual(before);
    expect(trianglesOf(second)).toEqual(before);
    expect(trianglesOf(first)).not.toEqual(before);
    // 制約の印も複製されている（復元した側で張った制約は、別の復元に現れない）
    expect(second.isConstrained(first.findEdge(32, 35))).toBe(false);
  });
});
