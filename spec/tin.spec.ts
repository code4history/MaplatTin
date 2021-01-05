/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-var-requires */
import Tin, { Options } from "../src";
import { toBeDeepCloseTo } from "jest-matcher-deep-close-to";
expect.extend({ toBeDeepCloseTo });

let stateFull = false;
const testSet = () => {
  [ ["Nara", "naramachi_yasui_bunko"],
    ["Fushimi", "fushimijo_maplat"] ].map((dataset) => {
    const town = dataset[0];
    const filename = dataset[1];
    describe(`Test by actual data (${town})`, () => {
      it(`Compare with actual data (${town})`, async done => {
        const load_m = await import(`./maps/${filename}.json`);
        const load_c = await import(`./compiled/${filename}.json`);

        const tin = new Tin({
          wh: [load_m.width, load_m.height],
          strictMode: load_m.strictMode as Options["strictMode"],
          vertexMode: load_m.vertexMode as Options["vertexMode"],
          stateFull
        });
        tin.setPoints(load_m.gcps as Options["points"]);
        if (load_m.edges) {
          tin.setEdges(load_m.edges as Options["edges"]);
        }

        await tin.updateTinAsync();
        const target = JSON.parse(JSON.stringify(load_c.compiled));
        const expected = JSON.parse(JSON.stringify(tin.getCompiled()));

        // points
        expect(treeWalk(expected.points, 5)).toEqual(treeWalk(target.points, 5));

        // edges
        expect(treeWalk(expected.edges, 5)).toEqual(treeWalk(target.edges, 5));

        // weight buffer
        expect(treeWalk(expected.weight_buffer.forw, 1)).toEqual(treeWalk(target.weight_buffer.forw, 1));
        expect(treeWalk(expected.weight_buffer.bakw, 1)).toEqual(treeWalk(target.weight_buffer.bakw, 1));

        // tins points
        expect(sortTinsPoint(expected.tins_points[0])).toEqual(sortTinsPoint(target.tins_points[0]));

        // edge nodes
        expect(treeWalk(expected.edgeNodes, 5)).toEqual(treeWalk(target.edgeNodes, 5));

        done();
      });
    });
  });

  describe("Test case for bounds (w/o error)", () => {
    const tin = new Tin({
      bounds: [
        [100, 50],
        [150, 150],
        [150, 200],
        [60, 190],
        [50, 100]
      ],
      strictMode: Tin.MODE_STRICT,
      stateFull
    });
    tin.setPoints([
      [
        [80, 90],
        [160, -90]
      ],
      [
        [120, 120],
        [240, -120]
      ],
      [
        [100, 140],
        [200, -140]
      ],
      [
        [130, 180],
        [260, -180]
      ],
      [
        [70, 150],
        [140, -150]
      ]
    ]);

    it("Test for compiling data", async done => {
      await tin.updateTinAsync();
      expect(tin.xy).toEqual([50, 50]);
      expect(tin.wh).toEqual([100, 150]);
      // @ts-expect-error
      expect(tin.transform([140, 150])).toBeDeepCloseTo(
        [277.25085848926574, -162.19095375292216],
        7
      );
      expect(
        tin.transform([277.25085848926574, -162.19095375292216], true)
      ).toEqual([140, 150]);
      expect(tin.transform([200, 130])).toEqual(false);
      expect(
        tin.transform([401.98029725204117, -110.95171624700066], true)
      ).toEqual(false);
      // @ts-expect-error
      expect(tin.transform([200, 130], false, true)).toBeDeepCloseTo(
        [401.98029725204117, -110.95171624700066],
        7
      );
      expect(
        tin.transform([401.98029725204117, -110.95171624700066], true, true)
      ).toEqual([200, 130]);
      done();
    });
  });

  describe("Test case for bounds (w/ error)", () => {
    const tin = new Tin({
      bounds: [
        [100, 50],
        [150, 150],
        [150, 200],
        [60, 190],
        [50, 100]
      ],
      strictMode: Tin.MODE_AUTO,
      stateFull
    });
    tin.setPoints([
      [
        [80, 90],
        [160, -90]
      ],
      [
        [120, 120],
        [240, 120]
      ],
      [
        [100, 140],
        [200, -140]
      ],
      [
        [130, 180],
        [260, 180]
      ],
      [
        [70, 150],
        [140, -150]
      ]
    ]);

    it("Test for compiling data", async done => {
      await tin.updateTinAsync();
      expect(tin.strict_status).toEqual(Tin.STATUS_LOOSE);
      let err: any;
      try {
        err = tin.transform([240, 120], true);
      } catch (e) {
        err = e;
      }
      expect(err).not.toEqual(
        'Backward transform is not allowed if strict_status == "strict_error"'
      );
      tin.setStrictMode(Tin.MODE_STRICT);
      await tin.updateTinAsync();
      expect(tin.strict_status).toEqual(Tin.STATUS_ERROR);

      try {
        err = tin.transform([240, 120], true);
      } catch (e) {
        err = e;
      }
      expect(err).toEqual(
        'Backward transform is not allowed if strict_status == "strict_error"'
      );
      done();
    });
  });

  describe("Test for exception case", () => {
    it("Constructor", async done => {
      let tin: Tin;
      let err = "";
      try {
        tin = new Tin({
          stateFull
        });
      } catch (e) {
        err = "err";
      }

      expect(err).not.toEqual("err");
      // @ts-ignore
      tin.setWh([100, 100]);
      // @ts-ignore
      tin.setPoints([
        [
          [20, 20],
          [20, 20]
        ],
        [
          [30, 30],
          [30, 30]
        ],
        [
          [40, 40],
          [40, 40]
        ]
      ]);
      err = "";
      // @ts-ignore
      await tin.updateTinAsync().catch(e => {
        err = e;
      });
      expect(err).toEqual("TOO LINEAR1");
      done();
    });
  });
};

describe("Test for Tin function", testSet);
stateFull = true;
describe("Test for Tin function (StateFull)", testSet);

function treeWalk(obj: any, depth: number) {
  if (typeof obj === "object") {
    Object.keys(obj).forEach(key => obj[key] = treeWalk(obj[key], depth));
  } else if (typeof obj === "number" && !`${obj}`.match(/^\d+$/)) {
    obj = Math.round(obj * Math.pow(10, depth)) / Math.pow(10, depth);
  }
  return obj;
}

function sortTinsPoint(tins_points: any[][]) {
  return tins_points.map(points => points.map(key => `${key}`).sort().join("_")).sort();
}