// test/tin.spec.ts
import { describe, it, expect } from 'vitest';
import Tin, { Options } from '../src';
import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

expect.extend({ toBeDeepCloseTo });

const loadMap = async (filename: string) => 
  (await import(`./maps/${filename}.json`)).default;

const loadCompiled = async (filename: string) => 
  (await import(`./compiled/${filename}.json`)).default;

function treeWalk(obj: any, depth: number) {
  if (typeof obj === "object") {
    Object.keys(obj).forEach(key => (obj[key] = treeWalk(obj[key], depth)));
  } else if (typeof obj === "number" && !`${obj}`.match(/^\d+$/)) {
    obj = Math.round(obj * Math.pow(10, depth)) / Math.pow(10, depth);
  }
  return obj;
}

function sortTinsPoint(tins_points: any[][]) {
  return tins_points
    .map(points =>
      points
        .map(key => `${key}`)
        .sort()
        .join("_")
    )
    .sort();
}

function sortKinksPoint(kinks_points: number[][]) {
  return (treeWalk(kinks_points, 5) as number[][]).sort((a, b) =>
    a[0] === b[0]
      ? a[1] === b[1]
        ? 0
        : a[1] > b[1]
        ? 1
        : -1
      : a[0] > b[0]
      ? 1
      : -1
  );
}

const datasets = [
  ["Nara", "naramachi_yasui_bunko"],
  ["Fushimi", "fushimijo_maplat"],
  ["Uno Loose", "uno_bus_gtfs_loose"],
  ["Uno Error", "uno_bus_gtfs_error"]
];

describe('Tin', () => {
  datasets.forEach(([town, filename]) => {
    describe(`Test by actual data (${town})`, () => {
      it(`Compare with actual data (${town})`, async () => {
        const load_m = await loadMap(filename);
        let load_c = await loadCompiled(filename);

        const tin = new Tin({
          wh: [load_m.width, load_m.height],
          strictMode: load_m.strictMode as Options["strictMode"],
          vertexMode: load_m.vertexMode as Options["vertexMode"],
          stateFull: false
        });

        tin.setPoints(load_m.gcps as Options["points"]);
        if (load_m.edges) {
          tin.setEdges(load_m.edges as Options["edges"]);
        }

        const lTin = new Tin({});
        lTin.setCompiled(load_c.compiled);

        // Normalizing node index and edges structure
        let load_c_str = JSON.stringify(load_c)
          .replace(/"edgeNode(\d+)"/g, '"e$1"')
          .replace(/"cent"/g, '"c"')
          .replace(/"bbox(\d+)"/g, '"b$1"')
          .replace(
            /{"illstNodes":(\[(?:[[\]\d.,]*)]),"mercNodes":(\[(?:[[\]\d.,]*)]),"startEnd":(\[(?:[\d,]+)])}/g,
            "[$1,$2,$3]"
          );
        
        load_c = JSON.parse(load_c_str);

        tin.updateTin();
        const compiled = JSON.parse(JSON.stringify(load_c.compiled));
        const expected = JSON.parse(JSON.stringify(tin.getCompiled()));
        const loaded = JSON.parse(JSON.stringify(lTin.getCompiled()));

        [compiled, loaded].forEach(target => {
          expect(treeWalk(expected.points, 5)).toEqual(
            treeWalk(target.points, 5)
          );

          expect(treeWalk(expected.edges, 5)).toEqual(
            treeWalk(target.edges, 5)
          );

          expected.tins_points.forEach((expected_tins: any, index: number) => {
            expect(sortTinsPoint(expected_tins)).toEqual(
              sortTinsPoint(target.tins_points[index])
            );
          });

          expect(treeWalk(expected.edgeNodes, 5)).toEqual(
            treeWalk(target.edgeNodes, 5)
          );

          if (expected.kinks_points) {
            expect(sortKinksPoint(expected.kinks_points)).toEqual(
              sortKinksPoint(target.kinks_points)
            );
          }
        });

        expect(expected.yaxisMode).toEqual(tin.yaxisMode);
        expect(expected.vertexMode).toEqual(tin.vertexMode);
        expect(expected.strictMode).toEqual(tin.strictMode);
        expect(expected.strict_status).toEqual(tin.strict_status);
        expect(compiled.version).toEqual(undefined);
        expect(loaded.version).toEqual(expected.version);
      });
    });
  });

  describe("bounds handling", () => {
    it("handles bounds without error", async () => {
      const tin = new Tin({
        bounds: [
          [100, 50],
          [150, 150],
          [150, 200],
          [60, 190],
          [50, 100]
        ],
        strictMode: Tin.MODE_STRICT,
        stateFull: false
      });

      tin.setPoints([
        [[80, 90], [160, -90]],
        [[120, 120], [240, -120]],
        [[100, 140], [200, -140]],
        [[130, 180], [260, -180]],
        [[70, 150], [140, -150]]
      ]);

      tin.updateTin();
      
      expect(tin.xy).toEqual([50, 50]);
      expect(tin.wh).toEqual([100, 150]);
      expect(tin.transform([140, 150])).toBeDeepCloseTo(
        [277.25085848926574, -162.19095375292216],
        7
      );
      expect(
        tin.transform([277.25085848926574, -162.19095375292216], true)
      ).toEqual([140, 150]);
    });
  });
});