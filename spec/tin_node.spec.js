import { Tin } from "../src/index.ts";
import { toBeDeepCloseTo } from "jest-matcher-deep-close-to";
import { expect, describe, it } from "vitest";

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

expect.extend({ toBeDeepCloseTo });

// m12 t2a: 独立アフィン参照（t1 設計 §5 T-AFF と同じ考え方。Cramer 式で重心座標を
// 求め、三角形の頂点の対応点から純アフィン補間を求める。@maplat/transform の
// geometry.ts の式は写さない）。三角形 geometry の座標は始点側、properties[k].geom は
// 目標側。戻り値は「点 p を含む可能性のある三角形のアフィン結果の候補配列」。
function affineRef(tri, p) {
  const s = tri.geometry.coordinates[0];
  const g = ["a", "b", "c"].map((k) => tri.properties[k].geom);
  const d =
    (s[1][0] - s[0][0]) * (s[2][1] - s[0][1]) -
    (s[2][0] - s[0][0]) * (s[1][1] - s[0][1]);
  const u =
    ((p[0] - s[0][0]) * (s[2][1] - s[0][1]) -
      (s[2][0] - s[0][0]) * (p[1] - s[0][1])) /
    d;
  const v =
    ((s[1][0] - s[0][0]) * (p[1] - s[0][1]) -
      (p[0] - s[0][0]) * (s[1][1] - s[0][1])) /
    d;
  return [
    g[0][0] + u * (g[1][0] - g[0][0]) + v * (g[2][0] - g[0][0]),
    g[0][1] + u * (g[1][1] - g[0][1]) + v * (g[2][1] - g[0][1]),
  ];
}

function sideSign(p, a, b) {
  return (p[0] - b[0]) * (a[1] - b[1]) - (a[0] - b[0]) * (p[1] - b[1]);
}

function inTriangle(p, a, b, c) {
  const d1 = sideSign(p, a, b);
  const d2 = sideSign(p, b, c);
  const d3 = sideSign(p, c, a);
  const hasNeg = d1 < 0 || d2 < 0 || d3 < 0;
  const hasPos = d1 > 0 || d2 > 0 || d3 > 0;
  return !(hasNeg && hasPos);
}

function m12AffineCandidates(tin, p, backward) {
  const dir = backward ? "bakw" : "forw";
  const tins = tin.tins && tin.tins[dir];
  const out = [];
  if (tins && tins.features) {
    for (const tri of tins.features) {
      const s = tri.geometry.coordinates[0];
      if (inTriangle(p, s[0], s[1], s[2])) {
        out.push(affineRef(tri, p));
      }
    }
  }
  if (out.length === 0) {
    const vp = tin.vertices_params && tin.vertices_params[dir];
    const fans = vp && vp[1];
    if (fans) {
      for (const fc of fans) {
        out.push(affineRef(fc.features[0], p));
      }
    }
  }
  return out;
}

let stateFull = false;
const testSet = () => {
  [
    ["Nara", "naramachi_yasui_bunko"],
    ["Nara Revised", "naramachi_yasui_revised"],
    ["Fushimi", "fushimijo_maplat"],
    ["Uno Loose", "uno_bus_gtfs_loose"],
    ["Uno Error", "uno_bus_gtfs_error"]
  ].map(dataset => {
    const town = dataset[0];
    const filename = dataset[1];


    describe(`Test by actual data (${town})`, () => {
      it(`Compare with actual data (${town})`, async () => {
        console.log("Debug: Starting test for", town);
        console.log("Debug: fs available:", !!fs);
        console.log("Debug: path available:", !!path);
        console.log("Debug: __dirname:", __dirname);

        const mapsPath = path.join(__dirname, `../tests/maps/${filename}.json`);
        const compiledPath = path.join(__dirname, `../tests/compiled/${filename}.json`);
        console.log("Debug: Reading map from:", mapsPath);

        let load_m, load_c;
        try {
          load_m = JSON.parse(fs.readFileSync(mapsPath, 'utf-8'));
          load_c = JSON.parse(fs.readFileSync(compiledPath, 'utf-8'));
          console.log("Debug: Loaded map data successfully");
        } catch (e) {
          console.error("Debug: Failed to read/parse files:", e);
          throw e;
        }

        const tin = new Tin({
          wh: [load_m.width, load_m.height],
          strictMode: load_m.strictMode,
          vertexMode: load_m.vertexMode,
          stateFull
        });
        console.log("Debug: Tin instance created");

        tin.setPoints(load_m.gcps);
        if (load_m.edges) {
          tin.setEdges(load_m.edges);
        }
        console.log("Debug: Points/Edges set");

        let compiled, loaded, expected;
        if (load_c.compiled) {
          const lTin = new Tin({});
          lTin.setCompiled(load_c.compiled);

          // Normalizing node index
          let load_c_str = JSON.stringify(load_c)
            .replace(/"edgeNode(\d+)"/g, '"e$1"')
            .replace(/"cent"/g, '"c"')
            .replace(/"bbox(\d+)"/g, '"b$1"');
          // Normalizing edges structure
          load_c_str = load_c_str.replace(
            /{"illstNodes":(\[(?:[[\]\d.,]*)]),"mercNodes":(\[(?:[[\]\d.,]*)]),"startEnd":(\[(?:[\d,]+)])}/g,
            "[$1,$2,$3]"
          );
          load_c = JSON.parse(load_c_str);

          await tin.updateTinAsync();
          compiled = JSON.parse(JSON.stringify(load_c.compiled));
          expected = JSON.parse(JSON.stringify(tin.getCompiled()));
          loaded = JSON.parse(JSON.stringify(lTin.getCompiled()));

          // After 0.7.3 Old format load test
          [compiled, loaded].forEach(target => {
            // points
            expect(treeWalk(expected.points, 5)).toEqual(
              treeWalk(target.points, 5)
            );

            // edges
            expect(treeWalk(expected.edges, 5)).toEqual(
              treeWalk(target.edges, 5)
            );

            // tins points
            expected.tins_points.forEach((expected_tins, index) => {
              expect(sortTinsPoint(expected_tins)).toEqual(
                sortTinsPoint(target.tins_points[index])
              );
            });

            // edge nodes
            expect(treeWalk(expected.edgeNodes, 5)).toEqual(
              treeWalk(target.edgeNodes, 5)
            );

            // kinks points
            if (expected.kinks_points) {
              expect(sortKinksPoint(expected.kinks_points)).toEqual(
                sortKinksPoint(target.kinks_points)
              );
            }
          });
        } else {
          console.log("Debug: Skipping comparison because load_c.compiled is undefined");
          await tin.updateTinAsync();
          expected = JSON.parse(JSON.stringify(tin.getCompiled()));
        }

        // After 0.7.3 Checking yAxisMode, vertexMode, strictMode & strictError
        expect(expected.yaxisMode).toEqual(tin.yaxisMode);
        expect(expected.vertexMode).toEqual(tin.vertexMode);
        expect(expected.strictMode).toEqual(tin.strictMode);
        expect(expected.strict_status).toEqual(tin.strict_status);

        // Checking format version
        if (compiled && loaded) {
          expect(compiled.version).toEqual(expected.version);
          expect(loaded.version).toEqual(expected.version);
        }
      });
    });
  });

  // This test uses the V2 algorithm deliberately: the GCP set was designed for V2
  // bounds behaviour (xy/wh bbox).  V3 submap support uses GCP-derived bbox and
  // 36-bin boundary vertices, which requires dedicated V3 test data.
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
      useV2Algorithm: true,
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

    it("Test for compiling data", async () => {
      await tin.updateTinAsync();
      expect(tin.xy).toEqual([50, 50]);
      expect(tin.wh).toEqual([100, 150]);

      // ① 順変換が含まれる三角形（凸包外なら扇形三角形）の純アフィン参照と 1e-7 以内
      const fwd = tin.transform([140, 150]);
      const fwdCands = m12AffineCandidates(tin, [140, 150], false);
      const fwdErr = Math.min(
        ...fwdCands.map((q) => Math.hypot(fwd[0] - q[0], fwd[1] - q[1])),
      );
      expect(fwdErr).toBeLessThanOrEqual(1e-7);

      // ② 逆変換が元の点に戻る（値の出所が実行時算出に変わったため 1e-7 に改める）
      expect(tin.transform(fwd, true)).toBeDeepCloseTo([140, 150], 7);

      // ③（不変）
      expect(tin.transform([200, 130])).toEqual(false);

      // ④ 凸包外の順変換（ignoreBounds）も同じ参照と 1e-7 以内
      const out = tin.transform([200, 130], false, true);
      const outCands = m12AffineCandidates(tin, [200, 130], false);
      const outErr = Math.min(
        ...outCands.map((q) => Math.hypot(out[0] - q[0], out[1] - q[1])),
      );
      expect(outErr).toBeLessThanOrEqual(1e-7);

      // ⑤（不変）
      expect(tin.transform(out, true)).toEqual(false);

      // ⑥ 逆変換（ignoreBounds）が元の点に戻る
      expect(tin.transform(out, true, true)).toBeDeepCloseTo([200, 130], 7);
    });
  });

  describe("Test case for bounds (w/ error)", () => {
    const tin = new Tin({
      bounds: [
        [0, 0],
        [100, 0],
        [100, 100],
        [0, 100]
      ],
      strictMode: Tin.MODE_AUTO,
      stateFull
    });
    tin.setPoints([
      [[10, 10], [10, 10]],
      [[90, 90], [90, 90]],
      [[90, 10], [90, 10]],
      [[10, 90], [10, 90]]
    ]);

    it("Test for compiling data", async () => {
      await tin.updateTinAsync();
      expect(tin.strict_status).toEqual(Tin.STATUS_LOOSE);
      let err;
      try {
        err = tin.transform([50, 50], true);
      } catch (e) {
        err = e;
      }
      expect(err).not.toMatchObject({
        message: 'Backward transform is not allowed if strict_status == "strict_error"'
      });
      tin.setStrictMode(Tin.MODE_STRICT);
      await tin.updateTinAsync();
      expect(tin.strict_status).toEqual(Tin.STATUS_ERROR);

      try {
        err = tin.transform([50, 50], true);
      } catch (e) {
        err = e;
      }
      expect(err).toMatchObject({
        message: 'Backward transform is not allowed if strict_status == "strict_error"'
      });
    });
  });

  describe("Test for exception case", () => {
    it("Constructor", async () => {
      let tin;
      let err = "";
      try {
        tin = new Tin({
          stateFull
        });
      } catch (_e) {
        err = "err";
      }

      expect(err).not.toEqual("err");
      tin.setWh([100, 100]);
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
      try {
        await tin.updateTinAsync();
      } catch (e) {
        err = e;
      }
      expect(err).toEqual("TOO LINEAR1");
    });
  });
};

describe("Test for Tin function", testSet);
stateFull = true;
describe("Test for Tin function (StateFull)", testSet);

function treeWalk(obj, depth) {
  if (typeof obj === "object") {
    Object.keys(obj).forEach(key => (obj[key] = treeWalk(obj[key], depth)));
  } else if (typeof obj === "number" && !`${obj}`.match(/^\d+$/)) {
    obj = Math.round(obj * Math.pow(10, depth)) / Math.pow(10, depth);
  }
  return obj;
}

function sortTinsPoint(tins_points) {
  return tins_points
    .map(points =>
      points
        .map(key => `${key}`)
        .sort()
        .join("_")
    )
    .sort();
}

function sortKinksPoint(kinks_points) {
  return treeWalk(kinks_points, 5).sort((a, b) =>
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
