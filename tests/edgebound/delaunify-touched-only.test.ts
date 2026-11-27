import { describe, expect, it } from "vitest";
import Delaunator from "delaunator";
import { Constrain } from "@/edgebound";
import { validateAllConstraints, validateDelaunay } from "./validators";

type P2 = [number, number];

/** 従来の delaunify（呼ぶたびに全部の辺を調べる）。掃除済みの印を毎回落として再現する。 */
class FullSweepConstrain extends Constrain {
  override delaunify(deep = false): this {
    this.cleaned = false;
    return super.delaunify(deep);
  }
}

function lcg(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
}

const triOf = (c: Constrain) => Array.from(c.del.triangles as ArrayLike<number>);
const halfOf = (c: Constrain) => Array.from(c.del.halfedges as ArrayLike<number>);

function randomPoints(rnd: () => number, n: number): P2[] {
  return Array.from({ length: n }, () => [rnd() * 1000, rnd() * 1000] as P2);
}

/** 制約として張れる線分を選ぶ。どれも交差しなくなるまで、先に選んだ線分と交差する候補は捨てる。 */
function pickEdges(rnd: () => number, coords: P2[], pool: [number, number][], count: number): [number, number][] {
  const picked: [number, number][] = [];
  const crosses = (a: [number, number], b: [number, number]) => {
    // 端点を共有する線分は交差とみなさない
    if (a[0] === b[0] || a[0] === b[1] || a[1] === b[0] || a[1] === b[1]) return false;
    const o = (p: P2, q: P2, r: P2) => Math.sign((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]));
    const [p1, p2, p3, p4] = [coords[a[0]], coords[a[1]], coords[b[0]], coords[b[1]]];
    return o(p1, p2, p3) !== o(p1, p2, p4) && o(p3, p4, p1) !== o(p3, p4, p2);
  };
  for (let i = 0; i < count * 8 && picked.length < count; i++) {
    const e = pool[Math.floor(rnd() * pool.length)];
    if (e[0] === e[1] || picked.some((q) => (q[0] === e[0] && q[1] === e[1]) || crosses(q, e))) continue;
    picked.push(e);
  }
  return picked;
}

describe("Constrain.delaunify は、掃除が済んだ後は触った辺だけを調べる", () => {
  it("全部の辺を毎回調べる従来の方式と、同じ三角網になる（制約 1〜8 本・200 通り）", () => {
    const rnd = lcg(31337);
    for (let k = 0; k < 200; k++) {
      const coords = randomPoints(rnd, 12 + Math.floor(rnd() * 40));
      const pool: [number, number][] = [];
      for (let i = 0; i < 80; i++) pool.push([Math.floor(rnd() * coords.length), Math.floor(rnd() * coords.length)]);
      const edges = pickEdges(rnd, coords, pool, 1 + Math.floor(rnd() * 8));
      const fast = new Constrain(Delaunator.from(coords), edges);
      const slow = new FullSweepConstrain(Delaunator.from(coords), edges);
      expect(triOf(fast), `case ${k}`).toEqual(triOf(slow));
      expect(halfOf(fast), `case ${k}`).toEqual(halfOf(slow));
      validateAllConstraints(coords, edges, fast);
      validateDelaunay(fast);
    }
  });

  it("制約を 1 本も張っていない網は掃除が済んでいない（控えにも済んだ印を付けない）", () => {
    const coords = randomPoints(lcg(5), 30);
    const con = new Constrain(Delaunator.from(coords), []);
    expect(con.cleaned).toBe(false);
    const snapshot = con.snapshot();
    expect(snapshot.cleaned).toBe(false);
    expect(Constrain.restore(snapshot).cleaned).toBe(false);
  });

  it("張った制約がすべて初めからある辺の網は、掃除が済んでいない（Major 4）", () => {
    const rnd = lcg(11);
    for (let k = 0; k < 50; k++) {
      const coords = randomPoints(rnd, 15 + Math.floor(rnd() * 30));
      const del = Delaunator.from(coords);
      const t = del.triangles;
      const initial: [number, number][] = [];
      for (let i = 0; i < t.length; i += 3) initial.push([t[i], t[i + 1]]);
      const edges = pickEdges(rnd, coords, initial, 1 + Math.floor(rnd() * 4));
      const con = new Constrain(Delaunator.from(coords), edges);
      expect(con.cleaned, `case ${k}`).toBe(false);
      expect(con.snapshot().cleaned).toBe(false);
    }
  });

  it("制約が 0 本・すべて初めからある辺の控えから復元して続きを張っても、従来の方式と同じ三角網になる", () => {
    const rnd = lcg(2026);
    for (let k = 0; k < 120; k++) {
      const coords = randomPoints(rnd, 15 + Math.floor(rnd() * 35));
      const initial: [number, number][] = [];
      const t = Delaunator.from(coords).triangles;
      for (let i = 0; i < t.length; i += 3) initial.push([t[i], t[i + 1]]);
      const pool: [number, number][] = [];
      for (let i = 0; i < 100; i++) pool.push([Math.floor(rnd() * coords.length), Math.floor(rnd() * coords.length)]);
      const later = pickEdges(rnd, coords, pool, 1 + Math.floor(rnd() * 6));
      for (const first of [[], pickEdges(rnd, coords, initial, 3)] as [number, number][][]) {
        // 続きの制約は、最初の制約と交差しないものだけを使う
        const rest = later.filter((e) => !first.some((q) => q[0] === e[0] && q[1] === e[1]));
        const fastBase = new Constrain(Delaunator.from(coords), first);
        const restored = Constrain.restore(fastBase.snapshot());
        let slow: FullSweepConstrain;
        try {
          restored.constrainAll(rest);
          slow = new FullSweepConstrain(Delaunator.from(coords), [...first]);
          slow.constrainAll(rest);
        } catch {
          // 張れない組み合わせ（交差など）は、どちらの方式でも張れないので比べない
          continue;
        }
        expect(triOf(restored), `case ${k}`).toEqual(triOf(slow));
        expect(halfOf(restored), `case ${k}`).toEqual(halfOf(slow));
      }
    }
  });

  it("控えに済んだ印を持つ網から復元すると、済んだ印も引き継ぐ", () => {
    const coords = randomPoints(lcg(77), 40);
    const rnd = lcg(78);
    const pool: [number, number][] = [];
    for (let i = 0; i < 60; i++) pool.push([Math.floor(rnd() * 40), Math.floor(rnd() * 40)]);
    const edges = pickEdges(rnd, coords, pool, 4);
    const con = new Constrain(Delaunator.from(coords), edges);
    // この配置（lcg 77・78）では張り直しが起きて済んだ印が立つ。印が立っていることを固定してから、引き継ぎを確かめる
    expect(con.cleaned).toBe(true);
    expect(Constrain.restore(con.snapshot()).cleaned).toBe(true);
  });

  it("Delaunator の初期の網が厳密な意味で Delaunay でない入力でも、掃除済みの印を偽らなければ従来の方式と同じになる（Major 4 の再現）", () => {
    // ほぼ同一円周上・ほぼ格子の点（浮動小数点の外接円の判定が外れる）。制約が 0 本の網から続きを張る
    const rnd = lcg(1);
    let forcedDiffers = 0;
    let actualDiffers = 0;
    let compared = 0;
    for (let k = 0; k < 700; k++) {
      const pts: P2[] = [];
      const off = k % 4 >= 2 ? 1e7 : 0;
      if (k % 2 === 0) {
        const m = 6 + Math.floor(rnd() * 20);
        const R = 1 + rnd() * 1000;
        for (let i = 0; i < m; i++) {
          const th = rnd() * 6.283;
          pts.push([off + R * Math.cos(th) + (rnd() - 0.5) * 1e-12 * R, off + R * Math.sin(th) + (rnd() - 0.5) * 1e-12 * R]);
        }
        for (let i = 0; i < 10; i++) pts.push([off + (rnd() - 0.5) * R, off + (rnd() - 0.5) * R]);
      } else {
        const n = 4 + Math.floor(rnd() * 6);
        for (let i = 0; i < n * n; i++) {
          pts.push([
            off + (i % n) * 0.1 + (rnd() - 0.5) * 1e-15 * (1 + (k % 7)),
            off + Math.floor(i / n) * 0.1 + (rnd() - 0.5) * 1e-15 * (1 + (k % 5))
          ]);
        }
      }
      const later: [number, number][] = [];
      for (let i = 0; i < 4; i++) {
        const a = Math.floor(rnd() * pts.length), b = Math.floor(rnd() * pts.length);
        if (a !== b) later.push([a, b]);
      }
      let actual: Constrain, forced: Constrain, slow: FullSweepConstrain;
      try {
        const base = new Constrain(Delaunator.from(pts), []);
        expect(base.snapshot().cleaned).toBe(false);
        actual = Constrain.restore(base.snapshot());
        actual.constrainAll(later);
        // 偽って「済んだ」と控えた場合（修正前の振る舞い）
        forced = Constrain.restore({ ...base.snapshot(), cleaned: true });
        forced.constrainAll(later);
        slow = new FullSweepConstrain(Delaunator.from(pts), []);
        slow.constrainAll(later);
      } catch {
        continue;
      }
      compared++;
      if (triOf(actual).join() !== triOf(slow).join()) actualDiffers++;
      if (triOf(forced).join() !== triOf(slow).join()) forcedDiffers++;
    }
    expect(compared).toBeGreaterThan(100);
    expect(actualDiffers).toBe(0);
    // この入力は、掃除済みの印を偽ると結果が変わる（テストが意味を持つことの確かめ）
    expect(forcedDiffers).toBeGreaterThan(0);
  });
});
