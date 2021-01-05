/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-var-requires */
import Tin, { Options } from "../src";
const load_cmp = require("./compiled/fushimijo_maplat.json");
const load_cmp_nara = require("./compiled/naramachi_yasui_bunko.json");

import { toBeDeepCloseTo } from "jest-matcher-deep-close-to";
expect.extend({ toBeDeepCloseTo });

let stateFull = false;
const testSet = () => {
  describe("Test by actual data (Fushimi)", () => {
    async () => {
      const load_map = await import("./maps/fushimijo_maplat.json");
      const tin = new Tin({
        wh: [load_map.width, load_map.height],
        strictMode: load_map.strictMode as Options["strictMode"],
        vertexMode: load_map.vertexMode as Options["vertexMode"],
        stateFull
      });
      tin.setPoints(load_map.gcps as Options["points"]);

      it("Compare with actual data", async done => {
        await tin.updateTinAsync();
        const target = JSON.parse(JSON.stringify(load_cmp));
        expect(tin.getCompiled()).not.toEqual(target.compiled);
        target.compiled.wh = tin.wh;
        expect(tin.getCompiled()).toEqual(target.compiled);
        done();
      });
    };
  });

  describe("Test by actual data (Nara)", () => {
    //async () => {

      it("Compare with actual data", async done => {
        const load_map = await import("./maps/naramachi_yasui_bunko.json");
        const tin = new Tin({
          wh: [load_map.width, load_map.height],
          strictMode: load_map.strictMode as Options["strictMode"],
          vertexMode: load_map.vertexMode as Options["vertexMode"],
          stateFull
        });
        tin.setPoints(load_map.gcps as Options["points"]);
        tin.setEdges(load_map.edges);
        await tin.updateTinAsync();
        const target = treeWalk(JSON.parse(JSON.stringify(load_cmp_nara)).compiled);
        const expected = treeWalk(tin.getCompiled());
        expect(expected).not.toEqual(target);
        target.wh = tin.wh;
        expect(expected).toEqual(target);
        done();
      });
    //};
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

function treeWalk(obj: any, n = 0) {
  //console.log(n + 1);
  /*if (Array.isArray(obj)) {
    [obj as any[]].forEach((val, idx) => obj[idx] = treeWalk(val, n + 1));
  } else*/ if (typeof obj === "object") {
    Object.keys(obj).forEach(key => obj[key] = treeWalk(obj[key], n + 1));
  } else if (typeof obj === "number" && !`${obj}`.match(/^\d+$/)) {
    obj = Math.round(obj * Math.pow(10, 7)) / Math.pow(10, 7);
  }
  return obj;
}
