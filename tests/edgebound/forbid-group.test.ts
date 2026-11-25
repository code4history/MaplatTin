import { describe, it, expect } from 'vitest';
import Delaunator from 'delaunator';
import { orient2d } from 'robust-predicates';
import { Constrain, type DelaunatorLike } from '@/edgebound';
import { validateDelaunator } from './validators';

type P2 = [number, number];

function tris(del: DelaunatorLike): number[][] {
  const out: number[][] = [];
  for (let i = 0; i < del.triangles.length; i += 3) out.push([del.triangles[i], del.triangles[i + 1], del.triangles[i + 2]]);
  return out;
}
const flat = (pts: P2[]) => Float64Array.from(pts.flat());
const orient = (xy: ArrayLike<number>, [a, b, c]: number[]) =>
  Math.sign(orient2d(xy[a * 2], xy[a * 2 + 1], xy[b * 2], xy[b * 2 + 1], xy[c * 2], xy[c * 2 + 1]));
const hasEdge = (del: DelaunatorLike, a: number, b: number) =>
  tris(del).some(t => t.includes(a) && t.includes(b));

describe('Constrain.forbidGroupTriangles（禁止制約）', () => {
  // 四辺形 [0,10]×[0,10] の補助頂点 12 点（角の近くに辺の上の点がある）と、中央に寄った GCP 4 点
  const aux: P2[] = [[0, 0], [2, 0], [8, 0], [10, 0], [10, 2], [10, 8], [10, 10], [8, 10], [2, 10], [0, 10], [0, 8], [0, 2]];
  const gcp: P2[] = [[4, 4], [6, 4], [6, 6], [4, 6]];
  const pts = [...aux, ...gcp];
  const AUX = 0;
  const groupsOf = (v: number) => (v < aux.length ? [AUX] : []);

  it('四辺形の角のせき止め（角の前後の補助頂点を結ぶ弦）を反転して、角を GCP とつなぐ', () => {
    const del = Delaunator.from(pts);
    const before = tris(del).filter(t => t.every(v => v < aux.length));
    expect(before.length).toBeGreaterThan(0); // 角をまたぐ弦の三角形ができている
    const n = del.triangles.length;

    const con = new Constrain(del);
    const res = con.forbidGroupTriangles(groupsOf);

    expect(res.remaining).toBe(0);
    expect(res.flips).toBe(before.length);
    expect(del.triangles.length).toBe(n);
    expect(tris(del).filter(t => t.every(v => v < aux.length))).toEqual([]);
    // 4 隅がどれも GCP と直接つながる
    for (const corner of [0, 3, 6, 9]) {
      expect(gcp.some((_, i) => hasEdge(del, corner, aux.length + i))).toBe(true);
    }
    // 向きはすべて同じ・面積 0 なし
    const xy = flat(pts);
    const s = orient(xy, tris(del)[0]);
    expect(s).not.toBe(0);
    for (const t of tris(del)) expect(orient(xy, t)).toBe(s);
    expect(() => validateDelaunator(pts, del)).not.toThrow();
  });

  it('必須エッジ上の中継点: 片方の面で一直線に並ぶ 3 点の三角形を、もう片方の面でも作らない', () => {
    // A(0) – B(1) – C(2) が 1 本の必須エッジ。地図面では B が持ち上がり、地理面では一直線（面積 0）
    const forw: P2[] = [[0, 0], [1, 0.5], [2, 0], [1, 3], [1, -3]];
    const bakw: P2[] = [[0, 0], [1, 0], [2, 0], [1, 3], [1, -3]];
    const del = Delaunator.from(forw);
    const abc = (d: DelaunatorLike) => tris(d).some(t => [0, 1, 2].every(v => t.includes(v)));
    expect(abc(del)).toBe(true);

    const con = new Constrain(del, [[0, 1], [1, 2]]);
    const res = con.forbidGroupTriangles(v => (v <= 2 ? [0] : []), [flat(forw), flat(bakw)]);

    expect(res).toEqual({ flips: 1, remaining: 0 });
    expect(abc(del)).toBe(false);
    expect(con.isConstrained(con.findEdge(0, 1))).toBe(true); // 必須エッジは残る
    for (const plane of [flat(forw), flat(bakw)]) {
      const s = orient(plane, tris(del)[0]);
      for (const t of tris(del)) {
        expect(orient(plane, t)).not.toBe(0);
        expect(orient(plane, t)).toBe(s);
      }
    }
  });

  it('どの面かで反転すると裏返るなら反転せず、残りの数として返す', () => {
    const forw: P2[] = [[0, 0], [1, 0.5], [2, 0], [1, 3], [1, -3]];
    // 地理面では下の点 4 が上へ回り込み、反転後の三角形が裏返る
    const bakw: P2[] = [[0, 0], [1, 0], [2, 0], [1, 3], [1, 0.2]];
    const del = Delaunator.from(forw);
    const con = new Constrain(del, [[0, 1], [1, 2]]);
    const res = con.forbidGroupTriangles(v => (v <= 2 ? [0] : []), [flat(forw), flat(bakw)]);
    expect(res).toEqual({ flips: 0, remaining: 1 });
  });

  it('制約された辺と外周の辺は反転しない', () => {
    // 3 点がすべて同じ群・辺はすべて外周 → 何もできない
    const del = Delaunator.from([[0, 0], [1, 0], [0, 1]]);
    const con = new Constrain(del);
    expect(con.forbidGroupTriangles(() => [0])).toEqual({ flips: 0, remaining: 1 });
  });

  it('群に属さない三角網は変えない', () => {
    const del = Delaunator.from(pts);
    const before = Array.from(del.triangles);
    const con = new Constrain(del);
    expect(con.forbidGroupTriangles(() => [])).toEqual({ flips: 0, remaining: 0 });
    expect(Array.from(del.triangles)).toEqual(before);
  });
});
