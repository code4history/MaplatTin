import { describe, expect, it } from "vitest";
import { Transform } from "@maplat/transform";
import fs from "node:fs";

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
      const load_c = JSON.parse(
        fs.readFileSync(`${__dirname}/compiled/${filename}.json`, "utf-8"),
      );

      const tin = new Transform();
      const compiledData = load_c.compiled || load_c;
      tin.setCompiled(compiledData);
      console.log(`Compiled: ${compiledData}`);

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
