import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { orient2d } from "robust-predicates";
import type { Position } from "geojson";
import { Tin, type Compiled, type Options } from "../src/index.ts";
import { REAL_DATA_TIMEOUT_MS } from "./timeouts.ts";
import { countBoundaryFlips, isBetterBoundaryCandidate } from "../src/boundary-search.ts";

interface MapFixture {
  width: number;
  height: number;
  gcps?: Options["points"];
  edges?: Options["edges"];
  vertexMode?: Options["vertexMode"];
  compiled?: Compiled;
  sub_maps?: { compiled: Compiled }[];
}

function buildMap(name: string, submap = false, strictMode: Options["strictMode"] = Tin.MODE_LOOSE): Tin {
  const map: MapFixture = JSON.parse(
    readFileSync(new URL(`./maps/${name}.json`, import.meta.url), "utf8")
  );
  const compiled = submap ? map.sub_maps?.[0].compiled : map.compiled;
  const tin = new Tin({
    bounds: submap ? compiled?.bounds : undefined,
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

function orientation([a, b, c]: Position[]): number {
  return Math.sign(orient2d(a[0], a[1], b[0], b[1], c[0], c[1]));
}

function checkBoundary(
  tin: Tin,
  flips: readonly number[],
  cornersWithoutGcp: readonly number[]
): void {
  const vertices = tin.getCompiled().vertices_points.map(([point]) => point);
  const xs = vertices.map(([x]) => x);
  const ys = vertices.map(([, y]) => y);
  const left = Math.min(...xs),
    right = Math.max(...xs);
  const top = Math.min(...ys),
    bottom = Math.max(...ys);
  const corners = vertices.flatMap(([x, y], i) =>
    (x === left || x === right) && (y === top || y === bottom) ? [i] : []
  );
  expect(corners).toHaveLength(4);

  const meshes = [tin.tins!.forw!, tin.tins!.bakw!];
  for (const [direction, mesh] of meshes.entries()) {
    const verticesOf = (triangle: (typeof mesh.features)[number]) => {
      const { a, b, c } = triangle.properties!;
      return [a, b, c];
    };
    const isAuxiliary = (index: number | string) =>
      typeof index === "string" && index.startsWith("b");
    const reversed = mesh.features.filter((triangle) => {
      const vertices = verticesOf(triangle);
      return (
        vertices.some(({ index }) => isAuxiliary(index)) &&
        orientation(triangle.geometry!.coordinates[0]) *
          orientation(vertices.map(({ geom }) => geom)) >=
          0
      );
    });
    expect(reversed).toHaveLength(flips[direction]);

    const triangles = mesh.features.map((triangle) =>
      verticesOf(triangle).map(({ index }) => index)
    );
    const blockedCorners = corners.filter((i) => {
      const previous = `b${(i + vertices.length - 1) % vertices.length}`;
      const next = `b${(i + 1) % vertices.length}`;
      return triangles.some((t) => t.includes(previous) && t.includes(next));
    });
    expect(blockedCorners).toHaveLength(0);
    const neighbors = corners.map((i) =>
      triangles.filter((t) => t.includes(`b${i}`)).flat()
    );
    expect(
      neighbors.every((ns) => ns.some((index) => !isAuxiliary(index)))
    ).toBe(true);
    expect(
      neighbors.filter((ns) => !ns.some((index) => typeof index === "number"))
    ).toHaveLength(cornersWithoutGcp[direction]);
  }
}

it.each([
  ["1932_nobeoka", false, 0.1, [0, 0], 0],
  ["1932_nobeoka", true, 0.1, [0, 0], 18],
  ["fushimijo_maplat", false, 0.1, [0, 0], 0],
  ["miesan_ginza_map", false, 0.1, [0, 0], 0],
  ["tatebayashi_castle_akimoto", false, 0.15, [0, 0], 0],
  ["tatebayashi_kaei_jokamachi", false, 0.1, [0, 0], 0],
  ["naramachi_yasui_bunko", false, 0.1, [0, 0], 19],
  ["naramachi_yasui_revised", false, 0.1, [0, 0], 19]
] as const)(
  "%s（サブマップ %s）の外周",
  (name, submap, margin, flips, remaining) => {
    const tin = buildMap(name, submap);
    expect(tin.boundaryDiagnostics).toEqual({
      margin,
      boundaryTriangleFlips: flips[0] + flips[1],
      remainingForbiddenTriangles: remaining
    });
    // 凸包の辺を制約にしたので、延岡のサブマップでも、どの隅も GCP に（必須エッジの中継点だけでなく）つながる。
    checkBoundary(tin, flips, [0, 0]);
  },
  REAL_DATA_TIMEOUT_MS
);

it("必須エッジの端点と生成された中継点だけの三角形を解消する", () => {
  const tin = new Tin({
    strictMode: Tin.MODE_LOOSE,
    points: [
      [
        [10, 10],
        [10, -10]
      ],
      [
        [12, 10],
        [12, -10]
      ],
      [
        [11, 13],
        [11, -13]
      ],
      [
        [11, 7],
        [11, -7]
      ]
    ],
    edges: [[[[11, 10.5]], [], [0, 1]]]
  });
  tin.updateTin();

  expect(tin.edgeNodes).toEqual([
    [
      [11, 10.5],
      [11, -10]
    ]
  ]);
  expect(tin.boundaryDiagnostics?.remainingForbiddenTriangles).toBe(0);
  for (const mesh of [tin.tins!.forw!, tin.tins!.bakw!]) {
    const triangles = mesh.features.map(({ properties }) => [
      properties!.a.index,
      properties!.b.index,
      properties!.c.index
    ]);
    expect(triangles.some((t) => t.includes(0) && t.includes("e0"))).toBe(true);
    expect(triangles.some((t) => t.includes(1) && t.includes("e0"))).toBe(true);
    expect(
      triangles.some((t) => t.includes(0) && t.includes(1) && t.includes("e0"))
    ).toBe(false);
  }

  const compiled = tin.getCompiled();
  expect(compiled).not.toHaveProperty("boundaryDiagnostics");
  tin.setCompiled(compiled);
  expect(tin.boundaryDiagnostics).toBeUndefined();
  tin.updateTin();
  expect(tin.boundaryDiagnostics).toBeDefined();
  tin.setPoints(tin.points);
  expect(tin.boundaryDiagnostics).toBeUndefined();
});

it("どの余白も合格しないときは、輪が閉じる候補を反転の数より優先する", () => {
  const c = (hasBoundary: boolean, flips: number) => ({
    hasBoundary,
    diagnostics: { boundaryTriangleFlips: flips }
  });
  expect(isBetterBoundaryCandidate(c(false, 1), undefined)).toBe(true);
  // 輪が閉じる候補は、反転が多くても閉じない候補に勝つ
  expect(isBetterBoundaryCandidate(c(true, 3), c(false, 1))).toBe(true);
  expect(isBetterBoundaryCandidate(c(false, 0), c(true, 3))).toBe(false);
  // 同じ扱いの中では反転の少ない方、同数なら先の（小さい余白の）候補を残す
  expect(isBetterBoundaryCandidate(c(true, 1), c(true, 2))).toBe(true);
  expect(isBetterBoundaryCandidate(c(true, 2), c(true, 2))).toBe(false);
});

it("strict でも診断は探索の時点の両面の値を返す（実際の三角網の反転とは一致しないことがある）", () => {
  // 補助頂点を含む三角形の反転が、探索の時点（地図面と地理面の三角網を独立に作る）では 1 件あるが、
  // strict で地理面の三角網を地図面から写すと無くなる合成の配置
  const points: Options["points"] = [
    [[0, 0], [-6, -3]], [[100, 0], [81, -16]], [[100, 100], [118, -92]], [[0, 100], [-20, -98]],
    [[61, 35], [37, -47]], [[93, 24], [89, -19]], [[13, 93], [3, -106]]
  ];
  const tin = new Tin({ wh: [100, 100], strictMode: Tin.MODE_STRICT, points });
  tin.updateTin();
  expect(tin.strict_status).toBe(Tin.STATUS_STRICT);
  expect(tin.boundaryDiagnostics).toEqual({
    margin: 0.15,
    boundaryTriangleFlips: 1,
    remainingForbiddenTriangles: 0
  });
  // strict では地理面の三角網を地図面から写すので、実際の三角網には反転が無い
  expect(countBoundaryFlips(tin.tins!.forw!)).toBe(0);
  expect(countBoundaryFlips(tin.tins!.bakw!)).toBe(0);
});
