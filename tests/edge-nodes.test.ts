import { describe, expect, it } from "vitest";
import type { Position } from "geojson";
import { interpolateEdgeNodes, RATIO_MATCH_TOLERANCE } from "../src/edge-nodes.ts";
import { Tin } from "../src/index.ts";

// 丸めで 1 ULP ずれた中央折れ点の再現ケース（紙面は厳密に比 0.5、地理面は 0.5 + 1 ULP）
const ulpIllst: Position[] = [[0, 0], [1, 1], [2, 0]];
const ulpMerc: Position[] = [
  [0, 0],
  [0.7071067811865475, 0.7071067811865475],
  [1.4142135613730948, -1e-9],
];

// 逆方向（地理面が 0.5 - 2 ULP）の再現ケース・座標スケール 0.1
const ulpIllstSmall: Position[] = [[0, 0], [0.1, 0.1], [0.2, 0]];
const ulpMercSmall: Position[] = [
  [0, 0],
  [0.09999999999999823, 0.09999999999999823],
  [0.19999999999999662, 0],
];

// 実スケール（紙面 ~1e4 / 地理面 ~1.7e7）で 2.5 ULP ずれる再現ケース。
// 修正前は内挿点が折れ点の位置に厳密に丸まり、同一の EdgeNodeItem が 2 件
// 生成されて三角網の構築が "Invalid edge ... is not part of the triangulation"
// で失敗していた。
const realIllst: Position[] = [
  [8329.167165327817, 12547.815115656704],
  [8261.876844664865, 13041.493863973199],
  [8506.958076746489, 13475.293222520002],
];
const realMerc: Position[] = [
  [16981834.031458944, 6286941.161919385],
  [16887627.58253081, 6978091.409562478],
  [17230741.307445083, 7585410.511528003],
];

describe("interpolateEdgeNodes: 比の丸めずれの統合", () => {
  it("0.5 と 0.5+1ULP の折れ点は 1 つのエッジノードに統合される", () => {
    const nodes = interpolateEdgeNodes(ulpIllst, ulpMerc);
    expect(nodes.length).toBe(1);
    // 両面とも折れ点の位置をそのまま使う
    expect(nodes[0][0]).toEqual([1, 1]);
    expect(nodes[0][1]).toEqual([0.7071067811865475, 0.7071067811865475]);
    expect(nodes[0][2]).toBe(0.5);
  });

  it("0.5 と 0.5-2ULP（逆方向の誤差）も 1 つに統合される", () => {
    const nodes = interpolateEdgeNodes(ulpIllstSmall, ulpMercSmall);
    expect(nodes.length).toBe(1);
    expect(nodes[0][0]).toEqual([0.1, 0.1]);
    expect(nodes[0][1]).toEqual([0.09999999999999823, 0.09999999999999823]);
    expect(nodes[0][2]).toBe(0.5);
  });

  it("実スケールで 2.5 ULP ずれる折れ点も 1 つに統合される", () => {
    const nodes = interpolateEdgeNodes(realIllst, realMerc);
    expect(nodes.length).toBe(1);
    expect(nodes[0][0]).toEqual([8261.876844664865, 13041.493863973199]);
    expect(nodes[0][1]).toEqual([16887627.58253081, 6978091.409562478]);
  });

  it("比が厳密に一致する折れ点も 1 つに統合される", () => {
    const nodes = interpolateEdgeNodes(ulpIllst, ulpIllst.map((p) => [p[0] * 2, p[1] * 2]));
    expect(nodes.length).toBe(1);
    expect(nodes[0][0]).toEqual([1, 1]);
    expect(nodes[0][1]).toEqual([2, 2]);
  });

  it("複数の折れ点がそれぞれ数 ULP ずれていても、折れ点の数だけに統合される", () => {
    // 紙面: 軸上に 4 等分（比は厳密に 0.25/0.5/0.75）
    const illst: Position[] = [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]];
    // 地理面: 3 倍スケールの末尾だけ数 ULP ずらし、3 折れ点すべての比を数 ULP ずらす
    const merc: Position[] = [[0, 0], [3, 0], [6, 0], [9, 0], [12.000000000000004, 0]];
    const nodes = interpolateEdgeNodes(illst, merc);
    expect(nodes.length).toBe(3);
    for (let i = 0; i < 3; i++) {
      expect(nodes[i][0]).toEqual(illst[i + 1]);
      expect(nodes[i][1]).toEqual(merc[i + 1]);
    }
    expect(nodes.map((n) => n[2])).toEqual([0.25, 0.5, 0.75]);
  });

  it("正しく別の比の折れ点は統合されず、両面の折れ点がそれぞれ中継点になる", () => {
    const nodes = interpolateEdgeNodes(ulpIllst, [[0, 0], [0.3, 0.3], [1, 0]]);
    expect(nodes.length).toBe(2);
    // 比の順に並び、それぞれ自分の面の折れ点位置を使う
    expect(nodes[0][1]).toEqual([0.3, 0.3]);
    expect(nodes[1][0]).toEqual([1, 1]);
  });

  it("複数折れ点で相手面にない比は線形補間され、比の順に並ぶ", () => {
    const illst: Position[] = [[0, 0], [1, 0], [3, 0], [6, 0], [10, 0]];
    const merc: Position[] = [[0, 0], [4, 0], [10, 0]];
    const nodes = interpolateEdgeNodes(illst, merc);
    // 紙面の折れ点 3 つ（比 0.1/0.3/0.6）と地理面の折れ点 1 つ（比 0.4）
    expect(nodes.length).toBe(4);
    const keys = nodes.map((n) => n[2]);
    for (let i = 1; i < keys.length; i++) {
      expect(keys[i]).toBeGreaterThan(keys[i - 1]);
    }
    // 地理面の折れ点は自分の位置のまま、紙面側は補間される
    const mercSource = nodes.find((n) => n[1][0] === 4 && n[1][1] === 0);
    expect(mercSource).toBeDefined();
  });
});

describe("interpolateEdgeNodes: 許容幅の境界", () => {
  it("許容幅の半分のずれ（128 EPS）は統合される", () => {
    const illst: Position[] = [[0, 0], [1, 0], [2, 0]];
    const merc: Position[] = [[0, 0], [1, 0], [2 + 2 * 256 * Number.EPSILON, 0]];
    const nodes = interpolateEdgeNodes(illst, merc);
    expect(nodes.length).toBe(1);
  });

  it("許容幅の 2 倍のずれ（512 EPS）は統合されない", () => {
    const illst: Position[] = [[0, 0], [1, 0], [2, 0]];
    const merc: Position[] = [[0, 0], [1, 0], [2 + 2 * 1024 * Number.EPSILON, 0]];
    const nodes = interpolateEdgeNodes(illst, merc);
    expect(nodes.length).toBe(2);
  });

  it("許容幅内の相手が 2 つあるときは最も近い方に統合される", () => {
    // 地理面に比 0.5-4ULP と 0.5+12ULP の折れ点、紙面に比 0.5 の折れ点
    const d = Math.pow(2, -49);
    const illst: Position[] = [[0, 0], [2, 0], [4, 0]];
    const merc: Position[] = [[0, 0], [2 - d, 0], [2 + 3 * d, 0], [4, 0]];
    const nodes = interpolateEdgeNodes(illst, merc);
    // 最も近い 0.5-4ULP の折れ点と統合される
    expect(nodes[0][0]).toEqual([2, 0]);
    expect(nodes[0][1]).toEqual([2 - d, 0]);
    expect(nodes[0][2]).toBe(0.5);
    // もう一方の折れ点も残り、重複位置にはならない
    expect(nodes.length).toBe(2);
    expect(nodes[1][1]).toEqual([2 + 3 * d, 0]);
  });

  it("端点の比に許容幅内で近い内点は、端点と結ばず補間される", () => {
    // 紙面の先頭の内点が比 1.5e-14 で始点の比 0 に許容幅内で近い
    const illst: Position[] = [[0, 0], [3e-14, 0], [1, 0], [2, 0]];
    const merc: Position[] = [[0, 0], [1, 0], [2, 0], [3, 0]];
    const nodes = interpolateEdgeNodes(illst, merc);
    expect(nodes.length).toBe(4);
    const nearStart = nodes.find((n) => n[0][0] === 3e-14);
    expect(nearStart).toBeDefined();
    // 相手面の端点（GCP の位置）は使わず、区間の補間で作られる
    expect(nearStart![1]).not.toEqual([0, 0]);
  });

  it("比が端点と一致する退化した入力では中継点を作らない", () => {
    // 先頭のセグメント長 0（重複頂点）で比がちょうど 0 になる内点
    const illst: Position[] = [[1, 1], [1, 1], [2, 0], [3, 0]];
    const merc: Position[] = [[0, 0], [1, 0], [2, 0], [3, 0]];
    const nodes = interpolateEdgeNodes(illst, merc);
    // 比 0 の内点からは中継点が作られず、残りの内点からは 3 件作られる
    expect(nodes.length).toBe(3);
    for (const node of nodes) {
      // GCP と同じ位置の中継点は作られない
      expect(node[0]).not.toEqual([1, 1]);
      expect(node[1]).not.toEqual([0, 0]);
    }
  });
});

describe("Tin: 三角網の構築（回帰）", () => {
  it("1 ULP ずれのエッジでもエッジノードは 1 組になり三角網が構築できる", () => {
    const tin = new Tin({ wh: [10, 10], stateFull: false });
    tin.setPoints([
      [[0, 0], [0, 0]],
      [[2, 0], [1.4142135613730948, -1e-9]],
    ]);
    tin.setEdges([[[[1, 1]], [[0.7071067811865475, 0.7071067811865475]], [0, 1]]]);
    const ps = tin.generatePointsSet();
    expect(tin.edgeNodes!.length).toBe(1);
    expect(ps.edges).toEqual([[0, 2], [2, 1]]);
    expect(() => tin.updateTin()).not.toThrow();
  });

  it("実スケールの 2.5 ULP ずれのエッジで三角網の構築が失敗しない", () => {
    // 修正前は同一のエッジノードが 2 件生成され、
    // "Invalid edge [2, 3]: vertex 3 is not part of the triangulation" で失敗した
    const tin = new Tin({ wh: [20000, 20000], stateFull: false });
    tin.setPoints([
      [realIllst[0], realMerc[0]],
      [realIllst[2], realMerc[2]],
    ]);
    tin.setEdges([[[realIllst[1]], [realMerc[1]], [0, 1]]]);
    tin.generatePointsSet();
    expect(tin.edgeNodes!.length).toBe(1);
    expect(() => tin.updateTin()).not.toThrow();
  });

  it("逆方向の ULP ずれでも三角網が構築できる", () => {
    const tin = new Tin({ wh: [1, 1], stateFull: false });
    tin.setPoints([
      [[0, 0], [0, 0]],
      [[0.2, 0], [0.19999999999999662, 0]],
    ]);
    tin.setEdges([[[[0.1, 0.1]], [[0.09999999999999823, 0.09999999999999823]], [0, 1]]]);
    tin.generatePointsSet();
    expect(tin.edgeNodes!.length).toBe(1);
    expect(() => tin.updateTin()).not.toThrow();
  });
});

describe("RATIO_MATCH_TOLERANCE", () => {
  it("丸め誤差の上界と正当な折れ点の間隔の下界の間に収まる", () => {
    // 上界: 丸めのみの実測最大 2 EPS・理論界 (2n+12)EPS を n=122 まで覆う
    expect(RATIO_MATCH_TOLERANCE).toBe(256 * Number.EPSILON);
    expect(RATIO_MATCH_TOLERANCE).toBeGreaterThan(2 * Number.EPSILON);
    // 下界: 合成の悪条件（全長 1e7 で折れ点間 0.1mm）の比の間隔 1e-11 未満
    expect(RATIO_MATCH_TOLERANCE).toBeLessThan(1e-11);
  });
});
