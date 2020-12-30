/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-var-requires */
import Tin, { Options } from "../src";
const load_cmp = require("./compiled/fushimijo_maplat.json");

import { toBeDeepCloseTo } from "jest-matcher-deep-close-to";
expect.extend({ toBeDeepCloseTo });

let stateFull = false;
const testSet = () => {
  describe("実データテスト", () => {
    async () => {
      const load_map = await import("./maps/fushimijo_maplat.json");
      const tin = new Tin({
        wh: [load_map.width, load_map.height],
        strictMode: load_map.strictMode as Options["strictMode"],
        vertexMode: load_map.vertexMode as Options["vertexMode"],
        stateFull
      });
      tin.setPoints(load_map.gcps as Options["points"]);

      it("実データ比較", async done => {
        await tin.updateTinAsync();
        const target = JSON.parse(JSON.stringify(load_cmp));
        expect(tin.getCompiled()).not.toEqual(target.compiled);
        target.compiled.wh = tin.wh;
        expect(tin.getCompiled()).toEqual(target.compiled);
        done();
      });
    };
  });

  describe("boundsケーステスト(エラーなし)", () => {
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

    it("データコンパイルテスト", async done => {
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

  describe("boundsケーステスト(エラーあり)", () => {
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

    it("データコンパイルテスト", async done => {
      await tin.updateTinAsync();
      expect(tin.strict_status).toEqual(Tin.STATUS_LOOSE);
      let err: any = "";
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
      err = "";
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

  describe("エラーケーステスト", () => {
    it("コンストラクタ", async done => {
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

describe("Tin 動作テスト", testSet);
stateFull = true;
describe("Tin 動作テスト (StateFull)", testSet);
