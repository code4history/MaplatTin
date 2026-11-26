import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { Transform } from "@maplat/transform";
import { Tin, type Options } from "../src/index.ts";
import { REAL_DATA_TIMEOUT_MS } from "./timeouts.ts";
import { orientationFlips, fixtureOptions } from "./supplement-fixtures.ts";
import { intrusionFraction } from "./hull-intrusion.ts";

// MaplatTin#98: V2 では strict になるのに、V3 の 36 区分の補助頂点では strict にならない実地図の 2 層。
// 紙の面と地理の面で凸包の形が食い違い（打ち誤差のある GCP が一方の凸包の頂点になる）、36 区分の補助頂点が
// 内側の三角形と重なって、辺の反転で直せない。補助頂点を V2 と同じ四隅だけにして組み直すと strict になる。
//
// 地図は MaplatCore（public/maps）の地図の GCP・必須エッジ（画像は含まない）。地図の権利は
// 画像が PD、GCP のデータが CC BY-SA（作成者は大塚恒平。Code for History）で、tests/maps の他の地図と同じ扱い。

interface LayerFixture {
  strictMode: Options["strictMode"];
  vertexMode: Options["vertexMode"];
  yaxisMode?: Options["yaxisMode"];
  width?: number;
  height?: number;
  bounds?: Options["bounds"];
  importance?: number;
  priority?: number;
  gcps: NonNullable<Options["points"]>;
  edges: NonNullable<Options["edges"]>;
}

const LAYERS = ["kaisei_hiroshima_jissoku_sub1", "naramachi_yasui_bunko_core"] as const;

function load(name: string): LayerFixture {
  return JSON.parse(readFileSync(new URL(`./maps/${name}.json`, import.meta.url), "utf8"));
}

function options(name: string, strictMode: Options["strictMode"], extra: Partial<Options> = {}): Options {
  const layer = load(name);
  return {
    strictMode,
    vertexMode: layer.vertexMode,
    yaxisMode: layer.yaxisMode,
    points: layer.gcps,
    edges: layer.edges,
    ...(layer.bounds
      ? { bounds: layer.bounds, importance: layer.importance, priority: layer.priority }
      : { wh: [layer.width!, layer.height!] as [number, number] }),
    ...extra
  };
}

function build(name: string, strictMode: Options["strictMode"], extra: Partial<Options> = {}): Tin {
  const tin = new Tin(options(name, strictMode, extra));
  tin.updateTin();
  return tin;
}

const digest = (compiled: unknown) =>
  createHash("sha256").update(JSON.stringify(compiled)).digest("hex").slice(0, 16);

describe.each(LAYERS)("%s", (name) => {
  it("V2 は strict で、出力は #94 と 1 ビットも変わらない（V2 は変えない）", () => {
    const expected: Record<string, string> = {
      kaisei_hiroshima_jissoku_sub1: "c89fe600d7e63247",
      naramachi_yasui_bunko_core: "f4976cf199d54066"
    };
    const tin = build(name, "strict", { useV2Algorithm: true });
    expect(tin.strict_status).toBe(Tin.STATUS_STRICT);
    expect(tin.boundaryDiagnostics).toBeUndefined();
    expect(digest(tin.getCompiled())).toBe(expected[name]);
  });

  describe.each([Tin.MODE_STRICT, Tin.MODE_AUTO] as const)("strictMode=%s", (mode) => {
    const tin = build(name, mode);

    it(
      "V3 も strict になり、交差・向きの反転が無い（補助頂点は V2 と同じ四隅）",
      () => {
        expect(tin.strict_status).toBe(Tin.STATUS_STRICT);
        expect(tin.kinks).toBeUndefined();
        expect(orientationFlips(tin)).toBe(0);
        expect(tin.boundaryDiagnostics!.cornerRing).toBe(true);
        expect(tin.getCompiled().vertices_points).toHaveLength(4);
      },
      REAL_DATA_TIMEOUT_MS
    );

    it(
      "Transform で読み直しても、GCP が往復し、逆変換を拒まれない",
      () => {
        const compiled = JSON.parse(JSON.stringify(tin.getCompiled()));
        expect(compiled.strict_status).toBe("strict");
        const reader = new Transform();
        reader.setCompiled(compiled);
        for (const [forw, bakw] of tin.points) {
          const toGeo = reader.transform(forw, false) as number[];
          expect(Math.hypot(toGeo[0] - bakw[0], toGeo[1] - bakw[1])).toBeLessThanOrEqual(1e-6);
          const toPaper = reader.transform(bakw, true) as number[];
          expect(Math.hypot(toPaper[0] - forw[0], toPaper[1] - forw[1])).toBeLessThanOrEqual(1e-6);
        }
      },
      REAL_DATA_TIMEOUT_MS
    );

    // 補助頂点が凸包の内側へ入る面積の割合（紙の面）。V2 は 24.08%（広島）・2.65%（奈良町）、V3 は 7.45%・0.00%
    it("紙の面の食い込みが、V2 より大きくならない", () => {
      const v2 = build(name, "strict", { useV2Algorithm: true });
      expect(intrusionFraction(tin, 0)).toBeLessThanOrEqual(intrusionFraction(v2, 0));
    });
  });

  it("loose 指定は組み直さない（36 区分のまま）", () => {
    const tin = build(name, "loose");
    expect(tin.strict_status).toBe(Tin.STATUS_LOOSE);
    expect(tin.boundaryDiagnostics!.cornerRing).toBeUndefined();
    expect(tin.getCompiled().vertices_points).toHaveLength(36);
  });
});

describe("四隅への組み直しは、必要なときだけ・戻せるときだけ", () => {
  it("36 区分で strict になる地図は、四隅に組み直さない（出力が変わらない）", () => {
    for (const mode of [Tin.MODE_STRICT, Tin.MODE_AUTO] as const) {
      const tin = new Tin(fixtureOptions("1932_nobeoka", mode));
      tin.updateTin();
      expect(tin.strict_status).toBe(Tin.STATUS_STRICT);
      expect(tin.boundaryDiagnostics!.cornerRing).toBeUndefined();
      expect(tin.getCompiled().vertices_points).toHaveLength(36);
      expect(digest(tin.getCompiled())).toBe(mode === Tin.MODE_STRICT ? "c58f3ec7fd36b041" : "7b7fb3bdd2504d1e");
    }
  });

  it(
    "四隅にしても strict にならない入力は、36 区分の結果にそのまま戻る（#94 と同じ出力）",
    () => {
      const expected = { strict: "254d22379ccc1d95", auto: "d62e1c57c25186de" } as const;
      for (const mode of [Tin.MODE_STRICT, Tin.MODE_AUTO] as const) {
        const tin = new Tin(fixtureOptions("uno_bus_gtfs_error", mode));
        tin.updateTin();
        expect(tin.strict_status).toBe(mode === Tin.MODE_STRICT ? Tin.STATUS_ERROR : Tin.STATUS_LOOSE);
        expect(tin.boundaryDiagnostics!.cornerRing).toBeUndefined();
        expect(tin.getCompiled().vertices_points).toHaveLength(36);
        expect(digest(tin.getCompiled())).toBe(expected[mode]);
      }
    },
    REAL_DATA_TIMEOUT_MS * 2
  );
});
