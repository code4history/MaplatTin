import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { Tin, format_version } from "../src/index.ts";
import type { Options } from "../src/index.ts";
import type { Compiled, Tri } from "@maplat/transform";
import { format_version as resolvedTransformFormatVersion } from "@maplat/transform";
import type { Position } from "geojson";

// ─── データセット（tin.test.ts の BUILD_DATASETS と同じ 10 通り） ─────────────
type BuildDataset = {
  label: string;
  key: string;
  ver: "v2" | "v3";
  useV2: boolean;
  /** map ファイルから GCP を読み込む場合は "map"、compiled.points から読む場合は "compiled_points" */
  gcpSource?: "map" | "compiled_points";
};

const loadMap = (filename: string): Record<string, unknown> =>
  JSON.parse(fs.readFileSync(`${__dirname}/maps/${filename}.json`, "utf-8"));

const loadCompiled = (filename: string): Compiled =>
  JSON.parse(fs.readFileSync(`${__dirname}/compiled/${filename}.json`, "utf-8"));

const BUILD_DATASETS: BuildDataset[] = [
  { label: "Nara v2",    key: "naramachi_yasui_bunko", ver: "v2", useV2: true  },
  { label: "Nara v3",    key: "naramachi_yasui_bunko", ver: "v3", useV2: false },
  { label: "Fushimi v2", key: "fushimijo_maplat",      ver: "v2", useV2: true  },
  { label: "Fushimi v3", key: "fushimijo_maplat",      ver: "v3", useV2: false },
  { label: "Miesan v2",       key: "miesan_ginza_map",           ver: "v2", useV2: true,  gcpSource: "compiled_points" },
  { label: "Miesan v3",       key: "miesan_ginza_map",           ver: "v3", useV2: false, gcpSource: "compiled_points" },
  { label: "Tatebayashi Castle v2", key: "tatebayashi_castle_akimoto", ver: "v2", useV2: true,  gcpSource: "compiled_points" },
  { label: "Tatebayashi Castle v3", key: "tatebayashi_castle_akimoto", ver: "v3", useV2: false, gcpSource: "compiled_points" },
  { label: "Tatebayashi Jokamachi v2", key: "tatebayashi_kaei_jokamachi", ver: "v2", useV2: true,  gcpSource: "compiled_points" },
  { label: "Tatebayashi Jokamachi v3", key: "tatebayashi_kaei_jokamachi", ver: "v3", useV2: false, gcpSource: "compiled_points" },
];

function buildTin(dataset: BuildDataset): Tin {
  const { key, useV2, gcpSource = "map" } = dataset;
  let tinOptions: ConstructorParameters<typeof Tin>[0];
  let gcps: Parameters<Tin["setPoints"]>[0];
  let edges: Parameters<Tin["setEdges"]>[0] | undefined;

  if (gcpSource === "compiled_points") {
    const gcpSource2 = loadCompiled(`${key}_v2`);
    tinOptions = {
      wh: gcpSource2.wh as [number, number],
      strictMode: gcpSource2.strictMode as Options["strictMode"],
      vertexMode: gcpSource2.vertexMode as Options["vertexMode"],
      stateFull: false,
      useV2Algorithm: useV2,
    };
    gcps = gcpSource2.points;
    edges = gcpSource2.edges?.length
      ? (gcpSource2.edges as Parameters<Tin["setEdges"]>[0])
      : undefined;
  } else {
    const load_m = loadMap(key);
    tinOptions = {
      wh: [load_m.width, load_m.height] as [number, number],
      strictMode: load_m.strictMode as Options["strictMode"],
      vertexMode: load_m.vertexMode as Options["vertexMode"],
      stateFull: false,
      useV2Algorithm: useV2,
    };
    gcps = load_m.gcps as Parameters<Tin["setPoints"]>[0];
    edges = load_m.edges as Parameters<Tin["setEdges"]>[0] | undefined;
  }

  const tin = new Tin(tinOptions);
  tin.setPoints(gcps);
  if (edges) tin.setEdges(edges);
  tin.updateTin();
  return tin;
}

// ─── 独立アフィン参照（t1 設計 §5 T-AFF と同じ。Cramer 式。geometry.ts の式は写さない） ──
const PROP_KEYS = ["a", "b", "c"] as const;

function affineReference(tri: Tri, p: Position): Position {
  const s = tri.geometry.coordinates[0];
  const g = PROP_KEYS.map((k) => tri.properties[k].geom);
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

// GRID-P: 当該方向の対応点 bbox を各辺 20% 広げた 41×41 点（t1 設計 §5）
function gridPoints(compiled: Compiled, backward: boolean): Position[] {
  const src = compiled.points.map((p) => (backward ? p[1] : p[0]));
  const xs = src.map((p) => p[0]);
  const ys = src.map((p) => p[1]);
  const x0 = Math.min(...xs);
  const x1 = Math.max(...xs);
  const y0 = Math.min(...ys);
  const y1 = Math.max(...ys);
  const dx = x1 - x0;
  const dy = y1 - y0;
  const pts: Position[] = [];
  for (let i = 0; i <= 40; i++) {
    for (let j = 0; j <= 40; j++) {
      pts.push([
        x0 - 0.2 * dx + (1.4 * dx * i) / 40,
        y0 - 0.2 * dy + (1.4 * dy * j) / 40,
      ]);
    }
  }
  return pts;
}

// 「相対 X 以内」の分母: 対応点の両座標系を通じた座標絶対値の最大（m12 設計 §6 補足）
function relativeScale(compiled: Compiled): number {
  let scale = 0;
  for (const p of compiled.points) {
    scale = Math.max(
      scale,
      Math.abs(p[0][0]),
      Math.abs(p[0][1]),
      Math.abs(p[1][0]),
      Math.abs(p[1][1]),
    );
  }
  return scale;
}

function fanTriangles(tin: Tin, backward: boolean): Tri[] {
  const vp = tin.vertices_params![backward ? "bakw" : "forw"]!;
  const fans = vp[1];
  return (fans ?? []).map((fc) => fc.features[0]);
}

// stateFull の stateTriangle（設定されていれば）または扇形三角形のどれかと
// 相対 1e-12 以内であることを検査し、外れの点数を返す。
function affineDeviations(tin: Tin, compiled: Compiled, backward: boolean): number {
  const scale = relativeScale(compiled);
  const fans = fanTriangles(tin, backward);
  const grid = gridPoints(compiled, backward);
  let count = 0;
  for (const p of grid) {
    tin.stateTriangle = undefined;
    tin.stateBackward = backward;
    const r = tin.transform(p, backward, true);
    expect(r).not.toBe(false);
    const rp = r as number[];
    const cands = tin.stateTriangle ? [tin.stateTriangle] : fans;
    let best = Infinity;
    for (const tri of cands) {
      const q = affineReference(tri, p);
      const rel = Math.hypot(rp[0] - q[0], rp[1] - q[1]) / scale;
      if (rel < best) best = rel;
    }
    if (best > 1e-12) count++;
  }
  return count;
}

describe("m12 t2a — weight_buffer の廃止（純アフィン化）", () => {
  describe("T2-EMPTY (AC-4a)", () => {
    BUILD_DATASETS.forEach((dataset) => {
      it(`${dataset.label}: getCompiled() が weight_buffer キーを持ち値が {}`, () => {
        const tin = buildTin(dataset);
        const compiled = tin.getCompiled();
        expect(compiled).toHaveProperty("weight_buffer");
        expect(compiled.weight_buffer).toStrictEqual({});
      });
    });
  });

  describe("T2-RELOAD (AC-4a)", () => {
    it("重み入り旧 compiled（1932_nobeoka.json・V3/版3）の setCompiled 後は {} と 3.00001", () => {
      const weighted = loadCompiled("1932_nobeoka");
      // 陽性対照: 入力が本当に重み入りであること
      expect(weighted.weight_buffer).toBeDefined();
      const forwWeights = weighted.weight_buffer.forw ?? {};
      expect(Object.keys(forwWeights).length).toBeGreaterThan(0);

      const tin = new Tin();
      tin.setCompiled(weighted);
      const out = tin.getCompiled();
      expect(out.weight_buffer).toStrictEqual({});
      expect(out.version).toEqual(3.00001);
    });
  });

  describe("T2-VER (AC-4b)", () => {
    it("format_version === 2.00704 / getFormatVersion() が同値", () => {
      expect(format_version).toEqual(2.00704);
      expect(new Tin({ useV2Algorithm: true }).getFormatVersion()).toEqual(2.00704);
      expect(new Tin().getFormatVersion()).toEqual(3.00001);
    });

    it("V2/V3 で構築した getCompiled().version が新しい版", () => {
      const v2 = buildTin(
        BUILD_DATASETS.find((d) => d.key === "naramachi_yasui_bunko" && d.ver === "v2")!,
      ).getCompiled();
      const v3 = buildTin(
        BUILD_DATASETS.find((d) => d.key === "naramachi_yasui_bunko" && d.ver === "v3")!,
      ).getCompiled();
      expect(v2.version).toEqual(2.00704);
      expect(v3.version).toEqual(3.00001);
    });
  });

  describe("T2-AFF (AC-4c)", () => {
    BUILD_DATASETS.forEach((dataset) => {
      it(`${dataset.label}: setCompiled 後の順逆が純アフィン（相対 1e-12 以内）`, () => {
        const compiled = buildTin(dataset).getCompiled();
        const reader = new Tin();
        reader.setCompiled(compiled);
        reader.stateFull = true;
        const dirs = reader.strict_status === "strict_error" ? [false] : [false, true];
        for (const back of dirs) {
          const n = affineDeviations(reader, compiled, back);
          expect(n).toBe(0);
        }
      });
    });

    it("陽性対照: 重み入り 1932_nobeoka.json は版数で分岐して assert", () => {
      const weighted = loadCompiled("1932_nobeoka");
      expect(Object.keys(weighted.weight_buffer.forw ?? {}).length).toBeGreaterThan(0);

      const reader = new Tin();
      reader.setCompiled(weighted);
      reader.stateFull = true;
      const dirs = reader.strict_status === "strict_error" ? [false] : [false, true];
      let total = 0;
      for (const back of dirs) {
        total += affineDeviations(reader, weighted, back);
      }
      if (resolvedTransformFormatVersion === 2.00703) {
        expect(total).toBeGreaterThan(0);
      } else if (resolvedTransformFormatVersion === 2.00704) {
        expect(total).toBe(0);
      } else {
        throw new Error(
          `想定外の @maplat/transform format_version: ${resolvedTransformFormatVersion}`,
        );
      }
    });
  });

  describe("T2-DIRECT (AC-4c・MAJ-1)", () => {
    BUILD_DATASETS.forEach((dataset) => {
      it(`${dataset.label}: updateTin() 直後の Tin で直接 transform（相対 1e-12 以内・例外なし）`, () => {
        const tin = buildTin(dataset);
        tin.stateFull = true;
        const compiled = tin.getCompiled();
        const dirs = tin.strict_status === "strict_error" ? [false] : [false, true];
        for (const back of dirs) {
          const n = affineDeviations(tin, compiled, back);
          expect(n).toBe(0);
        }
      });
    });

    it("陽性対照: pointsWeightBuffer=undefined の直接 transform は版数で分岐して assert", () => {
      const tin = buildTin(BUILD_DATASETS[0]);
      const p = gridPoints(tin.getCompiled(), false)[0];
      tin.pointsWeightBuffer = undefined;
      const fn = () => tin.transform(p, false, true);
      if (resolvedTransformFormatVersion === 2.00703) {
        expect(fn).toThrow(TypeError);
      } else if (resolvedTransformFormatVersion === 2.00704) {
        expect(fn).not.toThrow();
      } else {
        throw new Error(
          `想定外の @maplat/transform format_version: ${resolvedTransformFormatVersion}`,
        );
      }
    });
  });
});