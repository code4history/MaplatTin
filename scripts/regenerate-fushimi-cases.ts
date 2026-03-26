/**
 * Regenerate tests/cases/fushimijo_maplat.json with v3-computed expected values.
 *
 * The v3 algorithm uses a GCP-based bounding box (min/max + 5% margin) and
 * triangle centroid rather than the v2 hardcoded [0,0,wh,wh] bbox + turf
 * centroid.  As a result, boundary-vertex positions differ for points that
 * fall in the extrapolation zone, so the v2-era expected values no longer
 * match.  This script rebuilds the cases file from the v3 transform.
 *
 * Usage:
 *   npx tsx scripts/regenerate-fushimi-cases.ts
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Tin, type Options } from "../src/index.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const FILENAME = "fushimijo_maplat";
const casesPath = path.join(root, "tests", "cases", `${FILENAME}.json`);
const mapPath   = path.join(root, "tests", "maps",  `${FILENAME}.json`);

// ── Load map definition ────────────────────────────────────────────────────
const loadMap = JSON.parse(fs.readFileSync(mapPath, "utf-8"));

// ── Build Tin (same settings as transform.test.ts) ─────────────────────────
const builder = new Tin({
  wh: [loadMap.width, loadMap.height],
  strictMode: loadMap.strictMode as Options["strictMode"],
  vertexMode: loadMap.vertexMode as Options["vertexMode"],
  stateFull: false,
});

builder.setPoints(loadMap.gcps);
if (loadMap.edges) {
  builder.setEdges(loadMap.edges);
}
builder.updateTin();

const compiled = builder.getCompiled();
console.log(`Built v${compiled.version} compiled data.`);
console.log(`strict_status: ${compiled.strict_status}`);
console.log(`vertices_points count: ${compiled.vertices_points.length}`);

// ── Restore from compiled (mirrors what the test does) ─────────────────────
const tin = new Tin();
tin.setCompiled(compiled);

// ── Load existing cases (forward coordinates stay the same) ────────────────
const existingCases: [[[number, number], [number, number]]] = JSON.parse(
  fs.readFileSync(casesPath, "utf-8")
);

console.log(`\nRegenerating ${existingCases.length} test cases…`);

// ── Recompute expected bakw for each forward coordinate ───────────────────
let failCount = 0;
const newCases = existingCases.map(([forw, _oldBakw], idx) => {
  const bakw = tin.transform(forw) as [number, number] | null;
  if (!bakw) {
    console.warn(`  Case ${idx + 1}: forward transform returned null – keeping old value`);
    failCount++;
    return [forw, _oldBakw] as [[number, number], [number, number]];
  }

  // Sanity check: backward transform should recover forw
  const backCheck = tin.transform(bakw, true) as [number, number] | null;
  if (backCheck) {
    const dx = Math.abs(backCheck[0] - forw[0]);
    const dy = Math.abs(backCheck[1] - forw[1]);
    if (dx > 1 || dy > 1) {
      console.warn(
        `  Case ${idx + 1}: round-trip error (dx=${dx.toFixed(3)}, dy=${dy.toFixed(3)})` +
        ` forw=[${forw}]`
      );
    }
  }

  return [forw, bakw] as [[number, number], [number, number]];
});

if (failCount > 0) {
  console.warn(`\n⚠  ${failCount} cases had null forward transform.`);
}

// ── Write new cases file ───────────────────────────────────────────────────
fs.writeFileSync(casesPath, JSON.stringify(newCases, null, 2));
console.log(`\n✅ Wrote ${newCases.length} cases to ${casesPath}`);
