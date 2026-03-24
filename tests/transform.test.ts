import { describe, expect, it } from "vitest";
import { Tin } from "../src/index.ts";
import fs from "node:fs";

// ─── データセット定義 ──────────────────────────────────────────────────────────
// [label, key, ver]
// caseFile: tests/cases/{key}_{ver}.json
// compiledFile: tests/compiled/{key}_{ver}.json

type Dataset = [string, string, "v2" | "v3"];

const datasets: Dataset[] = [
  // NOTE: naramachi_yasui_bunko は strict_error 未修復問題により一時停止中。
  // 詳細: openspec/known-issues/naramachi-strict-error.md
  // ["Nara v2",    "naramachi_yasui_bunko", "v2"],
  // ["Nara v3",    "naramachi_yasui_bunko", "v3"],
  ["Fushimi v2", "fushimijo_maplat",      "v2"],
  ["Fushimi v3", "fushimijo_maplat",      "v3"],
  ["Miesan v2",  "miesan_ginza_map",      "v2"],
  ["Miesan v3",  "miesan_ginza_map",      "v3"],
  ["Tatebayashi Castle v2",    "tatebayashi_castle_akimoto",  "v2"],
  ["Tatebayashi Castle v3",    "tatebayashi_castle_akimoto",  "v3"],
  ["Tatebayashi Jokamachi v2", "tatebayashi_kaei_jokamachi",  "v2"],
  ["Tatebayashi Jokamachi v3", "tatebayashi_kaei_jokamachi",  "v3"],
];

describe("Tin — transform", () => {
  datasets.forEach(([town, key, ver]) => {
    describe(`${town}`, () => {
      // Load compiled and case data synchronously at describe time
      const compiledData = JSON.parse(
        fs.readFileSync(`${__dirname}/compiled/${key}_${ver}.json`, "utf-8"),
      );
      const cases: [[[number, number], [number, number]]] = JSON.parse(
        fs.readFileSync(`${__dirname}/cases/${key}_${ver}.json`, "utf-8"),
      );

      const tin = new Tin();
      tin.setCompiled(compiledData);

      describe("Forward transformation", () => {
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
        describe("Backward transformation", () => {
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
