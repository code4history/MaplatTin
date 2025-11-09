import { describe, expect, it } from "vitest";
import { Options, Tin } from "../src/index.ts";
import { toBeDeepCloseTo } from "jest-matcher-deep-close-to";
import { polygon } from "@turf/helpers";
import { counterTri } from "@maplat/transform";
import type { Compiled, PropertyTriKey, Tri, Tins } from "@maplat/transform";
import { resolveOverlaps } from "../src/strict-overlap.ts";
import type { SearchIndex } from "../src/searchutils.ts";
import { insertSearchIndex } from "../src/searchutils.ts";
import { featureCollection } from "@turf/helpers";
import fs from "node:fs";

function hasCompiledPayload(
  payload: unknown,
): payload is { compiled: Compiled } {
  return !!payload && typeof payload === "object" && !Array.isArray(payload) &&
    "compiled" in payload;
}

expect.extend({ toBeDeepCloseTo });

const loadMap = async (filename: string) =>
  (await import(`./maps/${filename}.json`)).default;

const loadCompiled = async (filename: string) =>
  (await import(`./compiled/${filename}.json`)).default;

function treeWalk(obj: any, depth: number) {
  if (typeof obj === "object") {
    Object.keys(obj).forEach((key) => (obj[key] = treeWalk(obj[key], depth)));
  } else if (typeof obj === "number" && !`${obj}`.match(/^\d+$/)) {
    obj = Math.round(obj * Math.pow(10, depth)) / Math.pow(10, depth);
  }
  return obj;
}

function sortTinsPoint(tins_points: any[][]) {
  return tins_points
    .map((points) =>
      points
        .map((key) => `${key}`)
        .sort()
        .join("_")
    )
    .sort();
}

function sortKinksPoint(kinks_points: number[][]) {
  return (treeWalk(kinks_points, 5) as number[][]).sort((a, b) =>
    a[0] === b[0]
      ? a[1] === b[1] ? 0 : a[1] > b[1] ? 1 : -1
      : a[0] > b[0]
      ? 1
      : -1
  );
}

const datasets = [
  ["Nara", "naramachi_yasui_bunko"],
  ["Fushimi", "fushimijo_maplat"],
  ["Uno Loose", "uno_bus_gtfs_loose"],
  ["Uno Error", "uno_bus_gtfs_error"],
];

describe("Tin", () => {
  datasets.forEach(([town, filename]) => {
    describe(`Test by actual data (${town})`, () => {
      it(`Compare with actual data (${town})`, async () => {
        const load_m = await loadMap(filename);
        let load_c = await loadCompiled(filename);

        const tin = new Tin({
          wh: [load_m.width, load_m.height],
          strictMode: load_m.strictMode as Options["strictMode"],
          vertexMode: load_m.vertexMode as Options["vertexMode"],
          stateFull: false,
        });

        tin.setPoints(load_m.gcps);
        if (load_m.edges) {
          tin.setEdges(load_m.edges);
        }

        tin.updateTin();

        if (!hasCompiledPayload(load_c)) {
          return;
        }

        const lTin = new Tin({});
        lTin.setCompiled(load_c.compiled);

        // Normalizing node index and edges structure
        const load_c_str = JSON.stringify(load_c)
          .replace(/"edgeNode(\d+)"/g, '"e$1"')
          .replace(/"cent"/g, '"c"')
          .replace(/"bbox(\d+)"/g, '"b$1"')
          .replace(
            /{"illstNodes":(\[(?:[[\]\d.,]*)]),"mercNodes":(\[(?:[[\]\d.,]*)]),"startEnd":(\[(?:[\d,]+)])}/g,
            "[$1,$2,$3]",
          );

        load_c = JSON.parse(load_c_str);

        const compiled = JSON.parse(JSON.stringify(load_c.compiled));
        const expected = JSON.parse(JSON.stringify(tin.getCompiled()));
        const loaded = JSON.parse(JSON.stringify(lTin.getCompiled()));

        const [width, height] = tin.wh!;
        const testCase: [number, number][][] = [];
        for (let xp = 0.1; xp < 1; xp += 0.1) {
          const x = width * xp;
          for (let yp = 0.1; yp < 1; yp += 0.1) {
            const y = height * yp;
            const point = lTin.transform([x, y]) as [number, number];
            //const rt = lTin.transform(point, true) as [number, number];
            testCase.push([[x, y],point]/*, rt.map(v => Math.round(v)) as [number, number]]*/);
          }
        }
        fs.writeFileSync(`./tests/cases/${filename}_kkk.json`, JSON.stringify(testCase, null, 2));

        [compiled, loaded].forEach((target) => {
          expect(treeWalk(expected.points, 5)).toEqual(
            treeWalk(target.points, 5),
          );

          expect(treeWalk(expected.edges, 5)).toEqual(
            treeWalk(target.edges, 5),
          );

          expected.tins_points.forEach((expected_tins: any, index: number) => {
            expect(sortTinsPoint(expected_tins)).toEqual(
              sortTinsPoint(target.tins_points[index]),
            );
          });

          expect(treeWalk(expected.edgeNodes, 5)).toEqual(
            treeWalk(target.edgeNodes, 5),
          );

          if (expected.kinks_points) {
            expect(sortKinksPoint(expected.kinks_points)).toEqual(
              sortKinksPoint(target.kinks_points),
            );
          }
        });

        expect(expected.yaxisMode).toEqual(tin.yaxisMode);
        console.log(tin.yaxisMode);
        expect(expected.vertexMode).toEqual(tin.vertexMode);
        console.log(tin.vertexMode);
        expect(expected.strictMode).toEqual(tin.strictMode);
        console.log(tin.strictMode);
        expect(expected.strict_status).toEqual(tin.strict_status);
        console.log(tin.strict_status);
        expect(compiled.version).toEqual(expected.version);
        console.log(compiled.version);
        expect(loaded.version).toEqual(expected.version);
        console.log(loaded.version);
      });
    });
  });

  describe("bounds handling", () => {
    it("handles strict mode error correctly", () => {
      const tin = new Tin({
        bounds: [
          [0, 0],
          [100, 0],
          [100, 100],
          [0, 100],
        ],
        strictMode: Tin.MODE_STRICT,
        stateFull: false,
      });

      tin.setPoints([
        [[20, 20], [120, 20]],
        [[80, 20], [180, 20]],
        [[80, 80], [180, 80]],
        [[20, 80], [120, 80]],
        [[50, 50], [150, 50]],
      ]);

      tin.updateTin();

      expect(tin.xy).toEqual([0, 0]);
      expect(tin.wh).toEqual([100, 100]);

      // In strict mode with these points, it should result in error
      expect(tin.strict_status).toEqual(Tin.STATUS_ERROR);

      // In strict_error mode, backward transform should throw
      expect(() => tin.transform([50, 50], true)).toThrow(
        'Backward transform is not allowed if strict_status == "strict_error"',
      );

      // Forward transform should still work
      const forward = tin.transform([50, 50]);
      expect(forward).toBeDefined();
    });
  });
});

describe("Birdseye boundary handling", () => {
  it("uses quadrant-specific scaling when enough samples are available", () => {
    const baseOptions: Partial<Options> = {
      wh: [200, 200],
      strictMode: Tin.MODE_AUTO,
    };

    const gcps: Options["points"] = [
      [[0, 0], [0, 0]],
      [[200, 0], [260, -40]],
      [[200, 200], [240, 240]],
      [[0, 200], [-20, 220]],
      [[80, 120], [120, 180]],
    ];

    const plain = new Tin({ ...baseOptions, vertexMode: Tin.VERTEX_PLAIN });
    plain.setPoints(gcps);
    plain.updateTin();

    const bird = new Tin({ ...baseOptions, vertexMode: Tin.VERTEX_BIRDEYE });
    bird.setPoints(gcps);
    bird.updateTin();

    const plainVertices = plain.getCompiled().vertices_points;
    const birdVertices = bird.getCompiled().vertices_points;

    expect(birdVertices).not.toEqual(plainVertices);
  });
});

describe("Strict overlap remediation", () => {
  function createTriPair(
    forward: [number, number][],
    backward: [number, number][],
    indices: string[],
  ): { forw: Tri; bakw: Tri } {
    const closedForw = [...forward, forward[0]];
    const properties = ("abc".split("") as PropertyTriKey[]).reduce((acc, key, idx) => {
      acc[key] = { geom: backward[idx], index: indices[idx] };
      return acc;
    }, {} as Record<PropertyTriKey, { geom: [number, number]; index: string }>);

    const forwTri = polygon([closedForw], properties) as Tri;
    const bakwTri = counterTri(forwTri);
    return { forw: forwTri, bakw: bakwTri };
  }

  it("re-triangulates overlapping shared-edge triangles", () => {
    const triPairA = createTriPair(
      [
        [0, 0],
        [2, 0],
        [0, 2],
      ],
      [
        [0, 0],
        [2, 0],
        [0, 2],
      ],
      ["0", "1", "2"],
    );

    const triPairB = createTriPair(
      [
        [0, 0],
        [2, 0],
        [2, 2],
      ],
      [
        [0, 0],
        [2, 0],
        [1, 1],
      ],
      ["0", "1", "3"],
    );

    const tinsBD = {
      forw: featureCollection([triPairA.forw, triPairB.forw]) as Tins,
      bakw: featureCollection([triPairA.bakw, triPairB.bakw]) as Tins,
    };

    const searchIndex: SearchIndex = {};
    insertSearchIndex(searchIndex, triPairA, tinsBD);
    insertSearchIndex(searchIndex, triPairB, tinsBD);

    const repaired = resolveOverlaps(tinsBD, searchIndex, []);
    expect(repaired).toBe(true);

    const combos = tinsBD.bakw.features.map((tri) =>
      ("abc".split("") as PropertyTriKey[])
        .map((key) => `${tri.properties![key].index}`)
        .sort()
        .join("-"),
    );

    expect(combos).toContain("0-2-3");
    expect(combos).toContain("1-2-3");
  });
});
