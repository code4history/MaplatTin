import { describe, expect, it } from "vitest";
import crypto from "node:crypto";
import fs from "node:fs";
import { Tin } from "../src/index.ts";

// 実地図で、必須エッジの中継点の突き合わせ（src/edge-nodes.ts）の結果が変わらないことを固定する。
//
// fixtures/edge-nodes-master-digests.json は、Issue #106 の変更の前（master）の実装で作った
// 値で、tests/maps の GCP つき 5 件と tests/compiled の points を持つ 19 件を、それぞれ v2・v3 の
// アルゴリズムで組んだ 48 通りについて、getCompiled() と edgeNodes の JSON の SHA-256 を持つ。
// 重ならない普通の入力で出力が 1 ビットも変わらないことを、この 48 通りで確かめる。
//
// 意図して出力を変えるときは、変更の前の実装に戻した状態で
//   UPDATE_EDGE_NODES_DIGESTS=1 node_modules/.bin/vitest run tests/edge-nodes-real-maps.test.ts
// を実行し、fixture を作り直す。

type Job = { name: string; options: ConstructorParameters<typeof Tin>[0]; gcps: unknown; edges: unknown };

const read = (path: string) => JSON.parse(fs.readFileSync(`${__dirname}/${path}`, "utf-8"));
const sha256 = (text: string) => crypto.createHash("sha256").update(text).digest("hex");
const FIXTURE = `${__dirname}/fixtures/edge-nodes-master-digests.json`;

function listJobs(): Job[] {
  const jobs: Job[] = [];
  for (const key of [
    "naramachi_yasui_bunko",
    "naramachi_yasui_revised",
    "fushimijo_maplat",
    "uno_bus_gtfs_loose",
    "uno_bus_gtfs_error",
  ]) {
    const m = read(`maps/${key}.json`);
    for (const useV2 of [true, false]) {
      jobs.push({
        name: `maps/${key}/${useV2 ? "v2" : "v3"}`,
        options: {
          wh: [m.width, m.height],
          strictMode: m.strictMode,
          vertexMode: m.vertexMode,
          stateFull: false,
          useV2Algorithm: useV2,
        },
        gcps: m.gcps,
        edges: m.edges,
      });
    }
  }
  for (const file of fs.readdirSync(`${__dirname}/compiled`).sort()) {
    const c = read(`compiled/${file}`);
    if (!c.points) continue;
    for (const useV2 of [true, false]) {
      jobs.push({
        name: `compiled/${file.replace(/\.json$/, "")}/${useV2 ? "v2" : "v3"}`,
        options: {
          bounds: c.bounds,
          wh: c.wh,
          strictMode: c.strictMode,
          vertexMode: c.vertexMode,
          stateFull: false,
          useV2Algorithm: useV2,
        },
        gcps: c.points,
        edges: c.edges,
      });
    }
  }
  return jobs;
}

function build(job: Job): { compiled: string; edgeNodes: string; edgeNodesCount: number } {
  const tin = new Tin(job.options);
  tin.setPoints(job.gcps as Parameters<Tin["setPoints"]>[0]);
  const edges = job.edges as Parameters<Tin["setEdges"]>[0] | undefined;
  if (edges?.length) tin.setEdges(edges);
  tin.updateTin();
  return {
    compiled: sha256(JSON.stringify(tin.getCompiled())),
    edgeNodes: sha256(JSON.stringify(tin.edgeNodes ?? [])),
    edgeNodesCount: tin.edgeNodes?.length ?? 0,
  };
}

const jobs = listJobs();

describe("実地図 48 通り: master と出力が変わらない", { timeout: 600000 }, () => {
  if (process.env.UPDATE_EDGE_NODES_DIGESTS === "1") {
    it("fixture を作り直す", () => {
      const out: Record<string, unknown> = {};
      for (const job of jobs) out[job.name] = build(job);
      fs.writeFileSync(FIXTURE, JSON.stringify(out, null, 1) + "\n");
    });
    return;
  }

  const expected = read("fixtures/edge-nodes-master-digests.json");

  it("通りの数が固定されている", () => {
    expect(jobs.length).toBe(48);
    expect(Object.keys(expected).sort()).toEqual(jobs.map((j) => j.name).sort());
  });

  it.each(jobs.map((j) => [j.name, j] as const))("%s: getCompiled() と edgeNodes が一致", (_name, job) => {
    const actual = build(job);
    const want = expected[job.name];
    // 1 月トレイン（jan27/*）は v3 の getCompiled() の出力を意図して変える（禁止制約・外側の変換など）。
    // fixture の compiled の値は master 時点のものなので、トレインの積み上げでは v3 の compiled は比べない。
    // v2 の compiled と、全 48 通りの edgeNodes（この変更が守る範囲）は比べる。
    if (job.name.endsWith("/v3")) {
      expect({ edgeNodes: actual.edgeNodes, edgeNodesCount: actual.edgeNodesCount }).toEqual({
        edgeNodes: want.edgeNodes,
        edgeNodesCount: want.edgeNodesCount,
      });
    } else {
      expect(actual).toEqual(want);
    }
  });

  it("折れ点つきの辺を持つ地図は、中継点が実際に作られている", () => {
    // 比較が空振りしていないこと（edgeNodes が空の組だけを比べていない）
    for (const key of ["naramachi_yasui_bunko", "uno_bus_gtfs_loose", "uno_bus_gtfs_error"]) {
      expect(expected[`maps/${key}/v3`].edgeNodesCount).toBeGreaterThan(0);
    }
    expect(expected["compiled/1932_nobeoka_sub0_v3/v3"].edgeNodesCount).toBeGreaterThan(0);
  });
});

describe("実地図: compiled に保存された edgeNodes とビットまで一致", () => {
  const load = (name: string) => read(`compiled/${name}.json`);

  it.each(["naramachi_yasui_bunko_v2", "naramachi_yasui_revised_v2", "1932_nobeoka_sub0_v2", "1932_nobeoka_sub0_v3"])(
    "%s",
    (name) => {
      const c = load(name);
      const tin = new Tin({ bounds: c.bounds, wh: c.wh, stateFull: false });
      tin.setPoints(c.points);
      tin.setEdges(c.edges);
      tin.generatePointsSet();
      expect(tin.edgeNodes!.length).toBeGreaterThan(0);
      expect(tin.edgeNodes).toEqual(c.edgeNodes);
    },
  );
});
