// 局所で済まなかった移動を、全部組み直すとどうなるかを測る（設計書 §7.2 の E1 の材料）。
//   node tests/incremental/measure-fallback.mjs [地図] [件数]
import { Tin, movePoint } from "../../src/index.ts";
import { mapOptions } from "./fixtures.ts";

const name = process.argv[2] ?? "naramachi_yasui_bunko_core";
const limit = Number(process.argv[3] ?? 8);
const options = mapOptions(name, "strict");
const tin = new Tin({ ...options, incremental: true });
tin.updateTin();
const model = tin.incrementalMesh;
let state = 20261127;
const rnd = () => (state = (state * 1664525 + 1013904223) >>> 0) / 2 ** 32;
const xs = options.points.map((p) => p[0][0]), ys = options.points.map((p) => p[0][1]);
const span = Math.hypot(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
const tally = {};
let tried = 0, local = 0, measured = 0;
while (measured < limit && tried < 2000) {
  tried++;
  const id = Math.floor(rnd() * options.points.length);
  const [forw, bakw] = options.points[id];
  // 紙の面だけを、対角線の 0.1〜1% 動かす（T1 と同じ）
  const distance = span * (0.001 + rnd() * 0.009), angle = rnd() * 2 * Math.PI;
  const to = [forw[0] + distance * Math.cos(angle), forw[1] + distance * Math.sin(angle)];
  const result = movePoint(model, id, { forw: to });
  if (result.ok) {
    local++;
    movePoint(model, id, { forw });
    continue;
  }
  if (result.reason === "unsupported") continue;
  const full = new Tin({ ...options, points: options.points.map((p, i) => (i === id ? [to, bakw] : p)) });
  let status;
  try { full.updateTin(); status = full.strict_status; } catch { status = "例外"; }
  const key = `${result.reason} → 全部組み直しは ${status}`;
  tally[key] = (tally[key] ?? 0) + 1;
  measured++;
}
console.log(name, `試行 ${tried}・局所で済んだ ${local}・測った ${measured}`, JSON.stringify(tally, null, 1));
