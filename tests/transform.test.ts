import { describe, expect, it } from "vitest";
import { Transform } from "@maplat/transform";
import { Tin, type Options } from "../src/index.ts";
import fs from "node:fs";

console.log("transform.test.ts module loaded");
process.on("uncaughtException", (err) => {
  console.error("uncaught exception in transform.test.ts", err);
});
process.on("unhandledRejection", (reason) => {
  console.error("unhandled rejection in transform.test.ts", reason);
});

const datasets = [
  ["Nara", "naramachi_yasui_bunko"],
  ["Fushimi", "fushimijo_maplat"],
];

describe("Tin", () => {
  datasets.forEach(([town, filename]) => {
    describe(`Test by actual data (${town})`, () => {
      const cases: [[[number, number], [number, number]]] = JSON.parse(
        fs.readFileSync(`${__dirname}/cases/${filename}.json`, "utf-8"),
      );

      const load_m = JSON.parse(
        fs.readFileSync(`${__dirname}/maps/${filename}.json`, "utf-8"),
      );

      const builder = new Tin({
        wh: [load_m.width, load_m.height],
        strictMode: load_m.strictMode as Options["strictMode"],
        vertexMode: load_m.vertexMode as Options["vertexMode"],
        stateFull: false,
      });

      builder.setPoints(load_m.gcps);
      if (load_m.edges) {
        builder.setEdges(load_m.edges);
      }
      builder.updateTin();

      const compiledData = builder.getCompiled();
      const tin = new Transform();
      tin.setCompiled(compiledData);

      describe(`Forward transformation`, () => {
        let i = 0;
        for (const [forw, bakw] of cases) {
          i++;
          const bakw_tr = tin.transform(forw) as [number, number];
          it(`Case ${i}`, () => {
            expect(bakw_tr[0]).toBeCloseTo(bakw[0]);
            expect(bakw_tr[1]).toBeCloseTo(bakw[1]);
          });
        }
      });

      if (compiledData.strict_status !== "strict_error") {
        describe(`Backward transformation`, () => {
          let i = 0;
          for (const [forw, bakw] of cases) {
            i++;
            const forw_tr = tin.transform(bakw, true) as [number, number];
            it(`Case ${i}`, () => {
              expect(forw_tr[0]).toBeCloseTo(forw[0]);
              expect(forw_tr[1]).toBeCloseTo(forw[1]);
            });
          }
        });
      }
    });
  });
});
