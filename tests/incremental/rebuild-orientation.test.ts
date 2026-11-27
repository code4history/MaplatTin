import { expect, it, vi } from "vitest";
import { Tin } from "../../src/index.ts";
import { IncrementalMesh } from "../../src/incremental/mesh.ts";
import { digest, mapOptions } from "./fixtures.ts";
import { REAL_DATA_TIMEOUT_MS } from "../timeouts.ts";

// MaplatTin#100 の第 1 段 b: 採った三角網の最後の確かめは、「三角形ごとの向き」と「今の交差の数え上げ」の 2 つ。
// 交差の数え上げは、交差の無い「向きが逆・面積 0 の三角形」を拾わないことがある。ここでは、数え上げを
// 「何も見つけない」ように差し替えて、向きの検査だけで食い違いを拾えること（fellBack: true）を固定する。

const probe = vi.hoisted(() => ({ blind: () => false as boolean }));
vi.mock("../../src/kinks.ts", async (importOriginal) => {
  const original = await importOriginal<typeof import("../../src/kinks.ts")>();
  return {
    ...original,
    findIntersectionsUpTo: (...args: Parameters<typeof original.findIntersectionsUpTo>) =>
      probe.blind() ? [] : original.findIntersectionsUpTo(...args)
  };
});

it("交差の数え上げが何も見つけなくても、向きが逆の三角形を含む網は採らない（今の手順だけで組み直す）", () => {
  const options = mapOptions("uno_bus_gtfs_error", "strict");
  const off = new Tin(options);
  off.updateTin();
  const originalStrict = IncrementalMesh.prototype.isStrict;
  const on = new Tin({ ...options, incrementalRebuild: true });
  let blinded = 0;
  // 局所の試行をしている間（今の手順だけで組み直す前）だけ、局所の判定を「常に strict」にし、
  // 交差の数え上げを「1 件までの確かめでは何も見つけない」にする。最初の試行（今の手順）は、そのまま
  const local = () => !(on as unknown as { localRebuildDisabled: boolean }).localRebuildDisabled;
  let firstDone = false;
  IncrementalMesh.prototype.isStrict = function (this: IncrementalMesh) {
    firstDone = true;
    return local() ? true : originalStrict.call(this);
  };
  probe.blind = () => {
    if (!firstDone || !local()) return false;
    blinded++;
    return true;
  };
  try {
    on.updateTin();
  } finally {
    IncrementalMesh.prototype.isStrict = originalStrict;
    probe.blind = () => false;
  }
  // 向きの検査が先に落とすので、交差の数え上げ（差し替えた側）は 1 回も呼ばれない
  expect(blinded).toBe(0);
  expect(on.rebuildDiagnostics).toMatchObject({ fellBack: true, localAttempts: 0, adoptedLocal: false });
  expect(digest(on.getCompiled())).toBe(digest(off.getCompiled()));
  expect(on.strict_status).toBe(off.strict_status);
}, REAL_DATA_TIMEOUT_MS * 3);
