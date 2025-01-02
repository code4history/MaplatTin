import { describe, it, expect } from 'vitest';
import { Transform } from '@maplat/transform';
import fs from 'fs';

const datasets = [
  ["Nara", "naramachi_yasui_bunko"],
  ["Fushimi", "fushimijo_maplat"]
];

describe('Tin', () => {
  datasets.forEach(([town, filename]) => {
    describe(`Test by actual data (${town})`, () => {
      const cases:[[[number,number], [number,number]]] = JSON.parse(fs.readFileSync(`${__dirname}/cases/${filename}.json`, 'utf-8'));
      const load_c = JSON.parse(fs.readFileSync(`${__dirname}/compiled/${filename}.json`, 'utf-8'));

      const tin = new Transform();
      tin.setCompiled(load_c.compiled);
      console.log(`Compiled: ${load_c.compiled}`);

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
    });
  });
});