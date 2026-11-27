import { describe, expect, it } from "vitest";
import type { Position } from "geojson";
import {
  edgeNodeMatchTolerance,
  interpolateEdgeNodes,
  MAX_RATIO_MATCH_TOLERANCE,
  RATIO_MATCH_TOLERANCE,
  ULP_TOLERANCE_FACTOR,
  ulp,
} from "../src/edge-nodes.ts";
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

  it("実スケールで 2.5 ULP ずれる折れ点も 1 つに統合される（ULP の誤差は updateTin の例外にもなる）", () => {
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

  it("許容幅内の相手が 2 つあるときは最も近い方に統合され、もう一方は同じ位置とみなして作らない", () => {
    // 地理面に比 0.5-4ULP と 0.5+12ULP の折れ点、紙面に比 0.5 の折れ点
    const d = Math.pow(2, -49);
    const illst: Position[] = [[0, 0], [2, 0], [4, 0]];
    const merc: Position[] = [[0, 0], [2 - d, 0], [2 + 3 * d, 0], [4, 0]];
    const nodes = interpolateEdgeNodes(illst, merc);
    // 最も近い 0.5-4ULP の折れ点と統合される
    expect(nodes.length).toBe(1);
    expect(nodes[0][0]).toEqual([2, 0]);
    expect(nodes[0][1]).toEqual([2 - d, 0]);
    expect(nodes[0][2]).toBe(0.5);
    // 0.5+12ULP の折れ点は紙面の同じ折れ点の許容幅にも入る。許容幅の中の余りなので、同じ位置と
    // みなして作らない（許容幅には上限があるので、はっきり別の折れ点を消すことはない）。
    // 注: この入力は master（固定の許容幅）では、余った折れ点が補間で作られ、重ならずに中継点 2 点に
    // なっていた。座標が大きく辺が短い入力では、許容幅の拡大でこの 2 点が重なる（Issue #106）ので、
    // 作らない。
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
  it("1 ULP ずれのエッジは、エッジノードが 1 組になる（三角網も構築できる）", () => {
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

  it("実スケールの 2.5 ULP ずれのエッジで、updateTin が例外にならない", () => {
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

  it("逆方向の ULP ずれのエッジも、エッジノードが 1 組になる（三角網も構築できる）", () => {
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

describe("edgeNodeMatchTolerance: 許容幅の上限", () => {
  it("片方の面の折れ線が極端に短いと、上限の値を返す（例外にしない）", () => {
    const illst: Position[] = [[0, 0], [500, 0], [1000, 0]];
    const merc: Position[] = [[1.5e7, 1.5e7], [1.5e7 + 1e-6, 1.5e7], [1.5e7 + 2e-6, 1.5e7]];
    expect(edgeNodeMatchTolerance(illst, merc)).toBe(MAX_RATIO_MATCH_TOLERANCE);
    expect(edgeNodeMatchTolerance(illst, merc, 1e30)).toBe(MAX_RATIO_MATCH_TOLERANCE);
  });

  it("上限は、Issue #106 の最悪の比のずれ（約 6e-11）より十分に大きく、固定の分より大きい", () => {
    expect(MAX_RATIO_MATCH_TOLERANCE).toBe(1e-9);
    expect(edgeNodeMatchTolerance([[0, 0], [1, 0]], [[0, 0], [1, 0]])).toBeLessThan(MAX_RATIO_MATCH_TOLERANCE);
  });

  it("再現 1: 片方の面が極端に短くても、紙面の 1 px の段差の折れ点は消えない（master と同じ 3 点）", () => {
    const illst: Position[] = [[0, 0], [500, 0], [500, 1], [1000, 0]];
    const merc: Position[] = [[1.5e7, 1.5e7], [1.5e7 + 1e-6, 1.5e7], [1.5e7 + 2e-6, 1.5e7]];
    const nodes = interpolateEdgeNodes(illst, merc);
    expect(nodes.length).toBe(3);
    // 紙面の折れ点 2 つと、地理面の折れ点 1 つが、それぞれ自分の位置のまま中継点になる
    expect(nodes.some((n) => n[0][0] === 500 && n[0][1] === 0)).toBe(true);
    expect(nodes.some((n) => n[0][0] === 500 && n[0][1] === 1)).toBe(true);
    expect(nodes.some((n) => n[1][0] === 1.5e7 + 1e-6 && n[1][1] === 1.5e7)).toBe(true);
  });

  it("再現 2: 0.5 px ずれた別の折れ点は、1 つにまとめない（master と同じ 2 点）", () => {
    const illst: Position[] = [[0, 0], [500, 10], [1000, 0]];
    const merc: Position[] = [[1.5e7, 1.5e7], [1.5e7 + 5.005e-6, 1.5e7], [1.5e7 + 1e-5, 1.5e7]];
    const nodes = interpolateEdgeNodes(illst, merc);
    expect(nodes.length).toBe(2);
    expect(nodes.some((n) => n[0][0] === 500 && n[0][1] === 10)).toBe(true);
    expect(nodes.some((n) => n[1][0] === 1.5e7 + 5.005e-6)).toBe(true);
  });
});

describe("ulp", () => {
  it("2 の冪の境界と非正規数で正しい", () => {
    expect(ulp(1)).toBe(Number.EPSILON);
    expect(ulp(1.9999999999999998)).toBe(Number.EPSILON);
    expect(ulp(2)).toBe(2 * Number.EPSILON);
    expect(ulp(-2)).toBe(2 * Number.EPSILON);
    expect(ulp(1.5e7)).toBe(Math.pow(2, -29));
    expect(ulp(0)).toBe(Number.MIN_VALUE);
    expect(ulp(Infinity)).toBeNaN();
  });
});

describe("edgeNodeMatchTolerance: 折れ線ごとの許容幅", () => {
  const near: Position[] = [[0, 0], [1, 1], [2, 0]];

  it("座標が小さく辺が長ければ、固定の分に ULP の項が少し足されるだけ", () => {
    const tol = edgeNodeMatchTolerance(near, near);
    expect(tol).toBeGreaterThan(RATIO_MATCH_TOLERANCE);
    expect(tol).toBeLessThan(RATIO_MATCH_TOLERANCE + 16 * Number.EPSILON);
  });

  it("座標が大きく辺が短いと、固定の分の 10 倍以上に広がる", () => {
    // 紙面 1e4 で全長 30 px、地理面 1.5e7 で全長 3000（倍率 100）
    const illst: Position[] = [[10000, 10000], [10010, 10010], [10020, 10000]];
    const merc: Position[] = [[1.5e7, 1.5e7], [1.5e7 + 1000, 1.5e7 + 1000], [1.5e7 + 2000, 1.5e7]];
    const tol = edgeNodeMatchTolerance(illst, merc);
    const expected =
      RATIO_MATCH_TOLERANCE +
      ULP_TOLERANCE_FACTOR * (ulp(10020) / (20 * Math.SQRT2) + ulp(1.5e7 + 2000) / (2000 * Math.SQRT2));
    expect(tol).toBe(expected);
    expect(tol).toBeGreaterThan(10 * RATIO_MATCH_TOLERANCE);
  });

  it("係数を 0 にすると固定の分だけになる", () => {
    expect(edgeNodeMatchTolerance(near, near, 0)).toBe(RATIO_MATCH_TOLERANCE);
  });

  it("全長 0 の折れ線でも有限の許容幅を返す", () => {
    const point: Position[] = [[1e7, 1e7], [1e7, 1e7], [1e7, 1e7]];
    const tol = edgeNodeMatchTolerance(point, near);
    expect(Number.isFinite(tol)).toBe(true);
  });
});

describe("interpolateEdgeNodes: 座標が大きく辺が短い必須エッジ（Issue #106）", () => {
  // 紙面 2000〜14000 px・倍率 50〜150・地理面 1.5e7 付近の実測で、#104 の許容幅（256 EPS）では
  // 折れ点が 2 つに分かれ、updateTin() が "Invalid edge ... is not part of the triangulation" で
  // 失敗した例。比のずれ（EPS）は、紙面と地理面の折れ点の比の差の最大。
  const cases: { name: string; illst: Position[]; merc: Position[] }[] = [
    {
      name: "辺 20 px・折れ点 1 つ・紙→地理（比のずれ 2048 EPS）",
      illst: [[6991.461727768183, 6737.160624936223], [6984.904284843906, 6735.444066698554], [6978.194748421265, 6734.2801716224185]],
      merc: [[15760329.605080187, 14172913.737595081], [15760249.865364222, 14172345.937667562], [15760122.02941808, 14171784.278930556]],
    },
    {
      name: "辺 3 px・折れ点 1 つ・地理→紙（比のずれ 1069 EPS）",
      illst: [[8278.879539109766, 5358.233097940683], [8280.324322346103, 5357.771053222882], [8280.804081617584, 5357.426509517649]],
      merc: [[15289917.218033224, 14528509.986121207], [15289997.18498712, 14528520.49912023], [15290028.06968751, 14528514.797026686]],
    },
    {
      name: "辺 12 px・折れ点 1 つ・紙→地理（比のずれ 553 EPS）",
      illst: [[2097.0901688560843, 11859.721255488694], [2089.8453561394435, 11864.573149886543], [2075.0545060920676, 11871.836359975494]],
      merc: [[14781795.444432646, 14101684.674620628], [14781243.341158329, 14101950.230789663], [14780142.413324153, 14102308.591738109]],
    },
    {
      name: "辺 20 px・折れ点 3 つ・紙→地理（比のずれ 2390 EPS）",
      illst: [[4307.27378744632, 8047.297417186201], [4312.531078044392, 8049.744245142505], [4314.267055031742, 8051.493414538685], [4316.044922239098, 8050.319951360312], [4325.605900818646, 8057.861322944149]],
      merc: [[15792483.617085963, 15363487.082067877], [15792144.758939583, 15362865.792126503], [15792101.084953843, 15362568.22390547], [15791841.469235355, 15362554.585995156], [15791449.287962398, 15361121.148985345]],
    },
  ];

  it.each(cases)("$name: 折れ点の数だけ、両面の折れ点の位置のまま中継点になる", ({ illst, merc }) => {
    // 前提: 修正前の許容幅（256 EPS）では、この折れ点の比は統合できないほどずれている
    const ratio = (nodes: Position[]): number[] => {
      const acc = [0];
      for (let i = 1; i < nodes.length; i++) {
        acc.push(acc[i - 1] + Math.hypot(nodes[i][0] - nodes[i - 1][0], nodes[i][1] - nodes[i - 1][1]));
      }
      return acc.map((x) => x / acc[acc.length - 1]);
    };
    const ri = ratio(illst);
    const rm = ratio(merc);
    const drift = Math.max(...ri.slice(1, -1).map((r, i) => Math.abs(r - rm[i + 1])));
    expect(drift).toBeGreaterThan(RATIO_MATCH_TOLERANCE);

    const nodes = interpolateEdgeNodes(illst, merc);
    expect(nodes.length).toBe(illst.length - 2);
    nodes.forEach((node, i) => {
      expect(node[0]).toEqual(illst[i + 1]);
      expect(node[1]).toEqual(merc[i + 1]);
    });
  });

  it.each(cases)("$name: updateTin() が例外にならない", ({ illst, merc }) => {
    const tin = new Tin({ wh: [16000, 16000], stateFull: false });
    tin.setPoints([
      [illst[0], merc[0]],
      [illst[illst.length - 1], merc[merc.length - 1]],
    ]);
    tin.setEdges([[illst.slice(1, -1), merc.slice(1, -1), [0, 1]]]);
    tin.generatePointsSet();
    expect(tin.edgeNodes!.length).toBe(illst.length - 2);
    expect(() => tin.updateTin()).not.toThrow();
  });

  it("座標が大きくても、辺が十分に長ければ別の折れ点は統合されない", () => {
    // 紙面 1e4・地理面 1.5e7、全長 3000 px の辺で、折れ点の位置が 1e-3 px 違う
    const illst: Position[] = [[10000, 10000], [10000 + 1500, 10000], [10000 + 3000, 10000]];
    const merc: Position[] = [[1.5e7, 1.5e7], [1.5e7 + 150000 + 0.1, 1.5e7], [1.5e7 + 300000, 1.5e7]];
    expect(interpolateEdgeNodes(illst, merc).length).toBe(2);
  });
});

describe("interpolateEdgeNodes: 許容幅内の折れ点が両面に複数あるとき", () => {
  const E = Number.EPSILON;

  it("紙面の順に最寄りを取らず、対応が交差しない（地理面の折れ線が逆戻りしない）", () => {
    // 紙面は比 0.5 と 0.5+6EPS、地理面は 0.5-100EPS と 0.5+4EPS（全長 1 の x 軸上）。
    // 紙面の順に最も近い相手を取ると 0.5↔0.5+4EPS、0.5+6EPS↔0.5-100EPS と交差する。
    const illst: Position[] = [[0, 0], [0.5, 0], [0.5 + 6 * E, 0], [1, 0]];
    const merc: Position[] = [[0, 0], [0.5 - 100 * E, 0], [0.5 + 4 * E, 0], [1, 0]];
    const nodes = interpolateEdgeNodes(illst, merc);
    expect(nodes.length).toBe(2);
    expect(nodes.map((n) => n[0][0])).toEqual([0.5, 0.5 + 6 * E]);
    expect(nodes.map((n) => n[1][0])).toEqual([0.5 - 100 * E, 0.5 + 4 * E]);
    // 比の順に並べた中継点の地理面の位置が単調に進む
    expect(nodes[0][1][0]).toBeLessThan(nodes[1][1][0]);
  });

  it("最寄りの貪欲では対応が 1 組取れなくなる入力でも、対応づけられる数が最大になる", () => {
    // 紙面 a1=0.5・a2=b2+(許容幅-4)EPS=0.5+(許容幅+6)EPS、地理面 b1=0.5-(許容幅-14)EPS・
    // b2=0.5+10EPS。a1 の最寄りは b2 だが、a2 が許容幅内に持つ相手は b2 だけ。a1↔b2 と取ると a2 が余って
    // 地理面に b2 と近接した補間点ができる。a1↔b1・a2↔b2 なら 2 組とも対応づけられる。
    const tolEps = edgeNodeMatchTolerance([[0, 0], [1, 0]], [[0, 0], [1, 0]]) / E;
    const a2 = 0.5 + (tolEps + 6) * E;
    const b1 = 0.5 - (tolEps - 14) * E;
    const b2 = 0.5 + 10 * E;
    const illst: Position[] = [[0, 0], [0.5, 0], [a2, 0], [1, 0]];
    const merc: Position[] = [[0, 0], [b1, 0], [b2, 0], [1, 0]];
    const nodes = interpolateEdgeNodes(illst, merc);
    expect(nodes.length).toBe(2);
    expect(nodes.map((n) => n[0][0])).toEqual([0.5, a2]);
    expect(nodes.map((n) => n[1][0])).toEqual([b1, b2]);
  });

  it("相手と比が厳密に同じ折れ点も、余りとして黙って消えず、同じ位置の中継点として吸収される", () => {
    // 紙面 0.5 と 0.5+1ULP、地理面 0.5+1ULP。比が厳密に同じ紙面の 0.5+1ULP が相手になり、
    // 0.5 の折れ点は同じ相手の許容幅に入るため、中継点を作らない（作ると同じ位置に重なる）
    const ulpHalf = Math.pow(2, -53);
    const illst: Position[] = [[0, 0], [0.5, 0], [0.5 + ulpHalf, 0], [1, 0]];
    const merc: Position[] = [[0, 0], [0.5 + ulpHalf, 0], [1, 0]];
    const nodes = interpolateEdgeNodes(illst, merc);
    expect(nodes.length).toBe(1);
    expect(nodes[0][0]).toEqual([0.5 + ulpHalf, 0]);
    expect(nodes[0][1]).toEqual([0.5 + ulpHalf, 0]);
    expect(nodes[0][2]).toBe(0.5 + ulpHalf);
  });
});
