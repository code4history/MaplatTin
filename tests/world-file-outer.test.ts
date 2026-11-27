import { Transform, worldFileToCrs, type PointSet, type WorldFile } from "@maplat/transform";
import { expect, it } from "vitest";
import { Tin, type Options } from "../src/index.ts";
import naramachi from "./maps/naramachi_yasui_bunko.json";
import nobeoka from "./maps/1932_nobeoka.json";
import { REAL_DATA_TIMEOUT_MS } from "./timeouts.ts";

const worldFile: WorldFile = {
  xScale: 1, xSkew: 0, xOrigin: 0.5,
  yScale: -1, ySkew: 0, yOrigin: -0.5
};

function translatedPoints(dx: number): PointSet[] {
  return [[0, 0], [100, 0], [100, 100], [0, 100], [54, 47]].map(
    ([x, y]) => [[x, y], [x + dx, -y]]
  );
}

function fitWorldFile(points: PointSet[]): WorldFile {
  const mean = (side: 0 | 1, axis: number) =>
    points.reduce((sum, pair) => sum + pair[side][axis], 0) / points.length;
  const xMean = mean(0, 0);
  const yMean = mean(0, 1);
  const rows = points.map(([[x, y], crs]) => [x - xMean, y - yMean, ...crs]);
  const dot = (a: number, b: number) => rows.reduce((sum, row) => sum + row[a] * row[b], 0);
  const xx = dot(0, 0), xy = dot(0, 1), yy = dot(1, 1);
  const det = xx * yy - xy * xy;
  // 数値を中心化して最小二乗で大域アフィンを求め、左上画素の中心の座標を原点にする。
  const fit = (axis: number) => {
    const x = (yy * dot(0, axis + 2) - xy * dot(1, axis + 2)) / det;
    const y = (xx * dot(1, axis + 2) - xy * dot(0, axis + 2)) / det;
    return [x, y, mean(1, axis) + x * (0.5 - xMean) + y * (0.5 - yMean)];
  };
  const [xScale, xSkew, xOrigin] = fit(0);
  const [ySkew, yScale, yOrigin] = fit(1);
  return { xScale, xSkew, xOrigin, ySkew, yScale, yOrigin };
}

function distance(a: number[], b: number[]): number {
  return Math.hypot(a[0] - b[0], a[1] - b[1]);
}

function mapPoint(transform: Transform, xy: number[], backward = false): number[] {
  const result = transform.transform(xy, backward, true);
  expect(result).not.toBe(false);
  return result as number[];
}

function interpolate(a: number[], b: number[], t: number): number[] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

const nobeokaPoints = nobeoka.compiled.points as PointSet[];

const naramachiPoints = naramachi.gcps as PointSet[];
const naramachiModel = fitWorldFile(naramachiPoints);
const naramachiOptions: Options = {
  points: naramachiPoints,
  wh: [naramachi.width, naramachi.height],
  vertexMode: naramachi.vertexMode as Options["vertexMode"],
  edges: naramachi.edges as unknown as Options["edges"]
};

const cases: {
  name: string;
  margin: number;
  fallback: boolean;
  options: Options;
  model: WorldFile;
}[] = [
  {
    name: "延岡市街地図",
    margin: 0.1,
    fallback: false,
    options: { points: nobeokaPoints, wh: nobeoka.compiled.wh },
    model: fitWorldFile(nobeokaPoints)
  },
  {
    name: "東へ 40 画素相当ずれた合成図（follow）",
    margin: 0.5,
    fallback: false,
    options: { points: translatedPoints(40), yaxisMode: "follow" },
    model: worldFile
  },
  {
    name: "東へ 70 画素相当ずれた合成図",
    margin: 0.1,
    fallback: true,
    options: { points: translatedPoints(70) },
    model: worldFile
  }
];

it.each(cases)("$name の外周と compiled の受け渡し", ({ name, margin, fallback, options, model }) => {
  const tin = new Tin({ ...options, strictMode: "strict", outerTransform: "worldFile", worldFile: model });
  tin.updateTin();

  const outerTransform = fallback ? "extrapolate" : "worldFile";
  expect(tin.boundaryDiagnostics).toMatchObject({
    margin,
    requestedOuterTransform: "worldFile",
    outerTransform
  });
  expect(tin.boundaryDiagnostics?.fallbackReason).toBe(fallback ? "boundaryFlips" : undefined);

  const compiled = tin.getCompiled();
  expect(compiled).toHaveProperty("outerTransform", outerTransform);
  expect(compiled.vertices_points.length).toBeGreaterThan(4);
  if (fallback) {
    expect(compiled).not.toHaveProperty("worldFile");
    const extrapolate = new Tin({ ...options, strictMode: "strict" });
    extrapolate.updateTin();
    expect(compiled).toEqual({ ...extrapolate.getCompiled(), outerTransform: "extrapolate" });
  } else {
    expect(compiled).toHaveProperty("worldFile", model);
    expect(compiled).not.toHaveProperty("vertices_params");
    expect(compiled).not.toHaveProperty("centroid_point");
  }

  const wire = structuredClone(compiled);
  const restored = new Transform();
  restored.setCompiled(wire);
  const restoredTin = new Tin();
  restoredTin.setCompiled(wire);
  expect(restoredTin.getCompiled()).toEqual(compiled);

  const center = options.points!.at(-1)![0];
  const ring = compiled.vertices_points;
  let roundTripError = 0;
  const checkConversion = (xy: number[]) => {
    const projected = mapPoint(tin, xy);
    const back = mapPoint(tin, projected, true);
    roundTripError = Math.max(roundTripError, distance(xy, back));
    for (const reader of [restored, restoredTin]) {
      expect(distance(mapPoint(reader, xy), projected)).toBeLessThan(1e-7);
      expect(distance(mapPoint(reader, projected, true), back)).toBeLessThan(1e-7);
    }
    return projected;
  };
  expect(distance(checkConversion(center), options.points!.at(-1)![1])).toBeLessThan(1e-7);
  for (const [i, [xy, geographic]] of ring.entries()) {
    const [nextXY, nextGeographic] = ring[(i + 1) % ring.length];
    const [x, y] = geographic;
    const [nextX, nextY] = nextGeographic;
    const ySign = options.yaxisMode === "follow" ? -1 : 1;
    const edge = interpolate(xy, nextXY, 0.5);
    const edgeCrs = interpolate([x, ySign * y], [nextX, ySign * nextY], 0.5);
    const outside = interpolate(edge, center, -0.2);
    expect(distance(checkConversion(edge), edgeCrs)).toBeLessThan(1e-7);
    const outsideCrs = checkConversion(outside);
    if (!fallback) {
      expect(distance(geographic, worldFileToCrs(model, xy).map((n, j) => j === 1 ? ySign * n : n))).toBe(0);
      expect(distance(outsideCrs, worldFileToCrs(model, outside))).toBeLessThan(1e-7);
    }
    for (const t of [1e-8, -1e-8]) {
      const near = interpolate(edge, center, t);
      const nearCrs = checkConversion(near);
      expect(distance(nearCrs, edgeCrs)).toBeLessThan(1e-3);
      const crsProbe = interpolate(edgeCrs, options.points!.at(-1)![1], t);
      const inverse = mapPoint(tin, crsProbe, true);
      expect(distance(inverse, edge)).toBeLessThan(1e-3);
      for (const reader of [restored, restoredTin]) {
        expect(distance(mapPoint(reader, crsProbe, true), inverse)).toBeLessThan(1e-7);
      }
    }
  }
  const [a, b, c] = tin.tins!.forw!.features.find(({ properties }) =>
    [properties!.a, properties!.b, properties!.c].some(({ index }) => index === options.points!.length - 1)
  )!.geometry!.coordinates[0];
  checkConversion(interpolate(interpolate(a, b, 0.5), c, 1 / 3));
  expect(roundTripError).toBeLessThan(1e-7);
  console.info(`${name}の最大往復誤差: ${roundTripError.toExponential(3)} 画素`);
}, REAL_DATA_TIMEOUT_MS);

it("world file 外周で係数の欠落・不正・鏡像と V2 の指定を拒否する", () => {
  expect(() => new Tin({ outerTransform: "worldFile" })).toThrow(/worldFile/);
  expect(() => new Tin({ outerTransform: "worldFile", worldFile: { ...worldFile, yScale: 0 } })).toThrow(/非正則/);
  expect(() => new Tin({ outerTransform: "worldFile", worldFile: { ...worldFile, yScale: Infinity } })).toThrow(/有限/);
  expect(() => new Tin({ outerTransform: "worldFile", worldFile: { ...worldFile, yScale: 1 } })).toThrow(/鏡像/);
  expect(() => new Tin({ outerTransform: "worldFile", worldFile, useV2Algorithm: true })).toThrow(/V2/);
});

it("strict と loose は実際に使う三角網で余白を選ぶ", () => {
  const points: PointSet[] = [
    [[0, 0], [17, -18]], [[100, 0], [110, -9]],
    [[100, 100], [93, -87]], [[0, 100], [-14, -85]],
    [[10, 60], [-2, -79]], [[54, 47], [56, -66]], [[95, 39], [77, -35]]
  ];
  const strictTin = new Tin({ points, strictMode: "strict", outerTransform: "worldFile", worldFile });
  strictTin.updateTin();
  expect(strictTin.strict_status).toBe("strict");
  expect(strictTin.boundaryDiagnostics).toMatchObject({
    margin: 0.15, boundaryTriangleFlips: 1, outerTransform: "worldFile"
  });
  const looseTin = new Tin({ points, strictMode: "loose", outerTransform: "worldFile", worldFile });
  looseTin.updateTin();
  expect(looseTin.strict_status).toBe("loose");
  expect(looseTin.boundaryDiagnostics).toMatchObject({
    margin: 0.225, boundaryTriangleFlips: 0, outerTransform: "worldFile"
  });
});

// 余白の探索は 50% までなので、扇形に落ちる = 50% でも B が成立しないことになる。
it.each(["auto", "loose"] as const)(
  "奈良町八水文庫図の %s は 50% でも world file 外周が成立せず扇形に落ちる",
  (strictMode) => {
    const tin = new Tin({ ...naramachiOptions, strictMode, outerTransform: "worldFile", worldFile: naramachiModel });
    tin.updateTin();
    expect(tin.boundaryDiagnostics).toMatchObject({
      requestedOuterTransform: "worldFile",
      outerTransform: "extrapolate",
      fallbackReason: "boundaryFlips"
    });
    const compiled = tin.getCompiled();
    expect(compiled).toHaveProperty("outerTransform", "extrapolate");
    expect(compiled).not.toHaveProperty("worldFile");
  },
  REAL_DATA_TIMEOUT_MS
);

it("奈良町八水文庫図の strict は 50% の余白で world file 外周を成立させる", () => {
  const tin = new Tin({ ...naramachiOptions, strictMode: "strict", outerTransform: "worldFile", worldFile: naramachiModel });
  tin.updateTin();
  expect(tin.boundaryDiagnostics).toMatchObject({
    margin: 0.5,
    requestedOuterTransform: "worldFile",
    outerTransform: "worldFile"
  });
  const compiled = tin.getCompiled();
  expect(compiled).toHaveProperty("outerTransform", "worldFile");
  expect(compiled).toHaveProperty("worldFile", naramachiModel);
}, REAL_DATA_TIMEOUT_MS);

it("内側の交差は B を降格させず、strict と auto の逆変換規則を保つ", () => {
  const points: PointSet[] = [
    ...translatedPoints(0).slice(0, 4),
    [[25, 25], [25, -25]], [[75, 25], [75, -25]],
    [[75, 75], [75, -75]], [[25, 75], [25, -75]],
    [[45, 50], [55, -50]], [[55, 50], [45, -50]]
  ];
  const strictTin = new Tin({ points, strictMode: "strict", outerTransform: "worldFile", worldFile });
  strictTin.updateTin();
  expect(strictTin.boundaryDiagnostics).toMatchObject({ margin: 0.1, outerTransform: "worldFile" });
  expect(strictTin.strict_status).toBe("strict_error");
  const restored = new Transform();
  restored.setCompiled(strictTin.getCompiled());
  for (const transform of [strictTin, restored]) {
    expect(() => mapPoint(transform, [50, -50], true)).toThrow(/strict_error/);
    expect(mapPoint(transform, [-20, 30], true)).toEqual([-20, -30]);
  }
  const autoTin = new Tin({ points, outerTransform: "worldFile", worldFile });
  autoTin.updateTin();
  expect(autoTin.strict_status).toBe("loose");
  expect(autoTin.boundaryDiagnostics).toMatchObject({ margin: 0.1, outerTransform: "worldFile" });
  expect(mapPoint(autoTin, [55, -50], true)).toEqual([45, 50]);
});

it("同じ Tin で外周を再計算すると C への降格後も B を再試行する", () => {
  const options: Options = { points: translatedPoints(4), stateFull: true, outerTransform: "worldFile", worldFile };
  const tin = new Tin(options);
  tin.updateTin();
  expect(mapPoint(tin, [-30, 40])).toEqual([-30, -40]);
  mapPoint(tin, [44, 45]);

  tin.setPoints(translatedPoints(70));
  tin.updateTin();
  expect(tin.boundaryDiagnostics?.fallbackReason).toBe("boundaryFlips");
  expect(distance(mapPoint(tin, [-30, 40]), [40, -40])).toBeLessThan(1e-7);
  tin.setPoints(options.points!);
  tin.updateTin();
  expect(tin.boundaryDiagnostics?.outerTransform).toBe("worldFile");
  expect(mapPoint(tin, [-30, 40])).toEqual([-30, -40]);
});

it("有効な必須エッジが余白候補の補助頂点に重なったときは次の余白を試す", () => {
  const points: PointSet[] = translatedPoints(10).map(([xy, [x, y]]) => [xy, [x, y + 10]]);
  const tin = new Tin({
    points, edges: [[[], [], [0, 1]]], strictMode: "loose",
    outerTransform: "worldFile", worldFile
  });
  tin.updateTin();
  expect(tin.boundaryDiagnostics).toMatchObject({ margin: 0.15, outerTransform: "worldFile" });
  const reader = new Transform();
  reader.setCompiled(tin.getCompiled());
  expect(mapPoint(reader, [100, 0])).toEqual([110, 10]);
});

it("bounds を持つ副層でも world file 外周を作れる", () => {
  const sub = nobeoka.sub_maps[0].compiled;
  const points = sub.points as PointSet[];
  const model = fitWorldFile(points);
  const tin = new Tin({
    bounds: sub.bounds,
    points,
    edges: sub.edges as unknown as Options["edges"],
    strictMode: "loose",
    outerTransform: "worldFile",
    worldFile: model
  });
  tin.updateTin();
  expect(tin.boundaryDiagnostics).toMatchObject({
    margin: 0.15,
    requestedOuterTransform: "worldFile",
    outerTransform: "worldFile"
  });
  const compiled = tin.getCompiled();
  expect(compiled).toHaveProperty("outerTransform", "worldFile");
  expect(compiled).toHaveProperty("worldFile", model);
}, REAL_DATA_TIMEOUT_MS);

it("V2 の Tin に world file 外周の compiled を setCompiled すると拒否する", () => {
  const tin = new Tin({
    points: translatedPoints(40), yaxisMode: "follow",
    strictMode: "strict", outerTransform: "worldFile", worldFile
  });
  tin.updateTin();
  const compiled = tin.getCompiled();
  expect(compiled).toHaveProperty("outerTransform", "worldFile");
  expect(() => new Tin({ useV2Algorithm: true }).setCompiled(compiled)).toThrow(/V2/);
});
