import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Transform, type PointSet, type WorldFile } from "@maplat/transform";
import { Tin, type Options } from "../src/index.ts";
import { REAL_DATA_TIMEOUT_MS } from "./timeouts.ts";
import { orientationFlips, fixtureOptions } from "./supplement-fixtures.ts";
import { intrusionFraction } from "./hull-intrusion.ts";

// MaplatTin#98: V2 では strict になるのに、V3 の 36 区分の補助頂点では strict にならない実地図の 2 層。
// 紙の面と地理の面で凸包の形が食い違い（打ち誤差のある GCP が一方の凸包の頂点になる）、その近くの補助頂点が
// 内側の三角形と重なって、辺の反転で直せない。strict を壊す補助頂点だけを外して組み直す（第 1 段）と、
// 2 層とも strict になる。それでもだめなら四隅だけにする（第 2 段）。
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

/** [地図, 紙の面の食い込みの上限, 地理面の食い込みの上限] */
const LAYERS = [
  ["kaisei_hiroshima_jissoku_sub1", 1e-4, 0.11],
  ["naramachi_yasui_bunko_core", 1e-4, 0.03]
] as const;

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

/** 手当てをしない #94 の出力（strict_error・loose のまま）の digest。 */
const BEFORE: Record<string, string> = {
  "kaisei_hiroshima_jissoku_sub1|strict": "f35098f61a862f75",
  "kaisei_hiroshima_jissoku_sub1|auto": "27acb2d9389b83c4",
  "naramachi_yasui_bunko_core|strict": "888d7073db914929",
  "naramachi_yasui_bunko_core|auto": "6a4819c955cc6ecd"
};

/**
 * 救えた 2 層の出力（compiled の digest）・輪の頂点数・補完点の数・組んだ三角網の試行数の上限。
 * [広島 strict・auto, 奈良町 strict・auto] のとおり。試行数は、最初の組み立ての試行数（広島 5・奈良町 5 前後）の
 * 倍数の上限（探索 4 倍・戻す試行を含めて 8 倍）の中に収まる。遅い退行は、この上限で気づく。
 */
const RESCUED: Record<string, { digest: string; ring: number; supplements: number; attempts: number; worldFile: { digest: string; ring: number; outer: string; attempts: number } }> = {
  "kaisei_hiroshima_jissoku_sub1|strict": {
    digest: "776ac9696ec63388", ring: 29, supplements: 2, attempts: 30,
    worldFile: { digest: "bd6484f82be9a783", ring: 33, outer: "worldFile", attempts: 12 }
  },
  "kaisei_hiroshima_jissoku_sub1|auto": {
    digest: "e1f484b56938bfd7", ring: 29, supplements: 2, attempts: 30,
    worldFile: { digest: "d3f35a1d08ad74ba", ring: 33, outer: "worldFile", attempts: 12 }
  },
  "naramachi_yasui_bunko_core|strict": {
    digest: "472986d0f4d9ac79", ring: 29, supplements: 6, attempts: 25,
    worldFile: { digest: "47cccc1b99b36161", ring: 29, outer: "extrapolate", attempts: 26 }
  },
  "naramachi_yasui_bunko_core|auto": {
    digest: "4232662ba90afa3c", ring: 29, supplements: 6, attempts: 25,
    worldFile: { digest: "af078cd9fe97b6fa", ring: 29, outer: "extrapolate", attempts: 26 }
  }
};

/** 三角網を組んだ試行の数（`updateTin()` の中で数える。手当ての手間の見張りに使う）。 */
const attemptsOf = (tin: Tin) => (tin as unknown as { attemptTotal: number }).attemptTotal;

describe.each(LAYERS)("%s", (name, paperLimit, geoLimit) => {
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
      "V3 も strict になり、交差・向きの反転が無い（strict を壊す補助頂点だけを外した輪）",
      () => {
        expect(tin.strict_status).toBe(Tin.STATUS_STRICT);
        expect(tin.kinks).toBeUndefined();
        expect(orientationFlips(tin)).toBe(0);
        expect(tin.boundaryDiagnostics!.ringRescue).toBe("thinned");
        // 外した区分のうち、strict に要らないものは戻す（要る区分だけを外した輪）。出力・手間を固定する
        const expected = RESCUED[`${name}|${mode}`];
        expect(tin.getCompiled().vertices_points).toHaveLength(expected.ring);
        expect(tin.supplementPairs).toHaveLength(expected.supplements);
        expect(digest(tin.getCompiled())).toBe(expected.digest);
        expect(attemptsOf(tin)).toBeLessThanOrEqual(expected.attempts);
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

    // 測った値: 紙の面 0.00%（V2 は 24.08%・2.65%）、地理面 10.87%（広島）・2.85%（奈良町）
    // （四隅だけにした版は、紙の面 7.45%・0.00%、地理面 26.78%・3.02%）
    it("食い込みが上限以下（紙の面・地理面）", () => {
      expect(intrusionFraction(tin, 0)).toBeLessThanOrEqual(paperLimit);
      expect(intrusionFraction(tin, 1)).toBeLessThanOrEqual(geoLimit);
    });
  });

  it("loose 指定は組み直さない（36 区分のまま）", () => {
    const tin = build(name, "loose");
    expect(tin.strict_status).toBe(Tin.STATUS_LOOSE);
    expect(tin.boundaryDiagnostics!.ringRescue).toBeUndefined();
    expect(tin.getCompiled().vertices_points).toHaveLength(36);
  });
});

describe("手当ては、必要なときだけ・戻せるときだけ", () => {
  afterEach(() => vi.restoreAllMocks());

  it("36 区分で strict になる地図は、手当てをしない（出力が変わらない）", () => {
    for (const mode of [Tin.MODE_STRICT, Tin.MODE_AUTO] as const) {
      const tin = new Tin(fixtureOptions("1932_nobeoka", mode));
      tin.updateTin();
      expect(tin.strict_status).toBe(Tin.STATUS_STRICT);
      expect(tin.boundaryDiagnostics!.ringRescue).toBeUndefined();
      expect(tin.getCompiled().vertices_points).toHaveLength(36);
      expect(digest(tin.getCompiled())).toBe(mode === Tin.MODE_STRICT ? "c58f3ec7fd36b041" : "7b7fb3bdd2504d1e");
    }
  });

  it(
    "手当てでも strict にならない入力（uno_bus）は、36 区分の結果にそのまま戻る（#94 と同じ出力）",
    () => {
      const expected = { strict: "254d22379ccc1d95", auto: "d62e1c57c25186de" } as const;
      for (const mode of [Tin.MODE_STRICT, Tin.MODE_AUTO] as const) {
        const tin = new Tin(fixtureOptions("uno_bus_gtfs_error", mode));
        tin.updateTin();
        expect(tin.strict_status).toBe(mode === Tin.MODE_STRICT ? Tin.STATUS_ERROR : Tin.STATUS_LOOSE);
        expect(tin.boundaryDiagnostics!.ringRescue).toBeUndefined();
        expect(tin.getCompiled().vertices_points).toHaveLength(36);
        expect(digest(tin.getCompiled())).toBe(expected[mode]);
        // 早く諦める。手当ての試行を含めて、三角網を組む試行は 6（#94 は最初の組み立てだけ）
        expect(attemptsOf(tin)).toBeLessThanOrEqual(8);
      }
    },
    REAL_DATA_TIMEOUT_MS * 2
  );

  // V2 は strict になるが、V3 は第 1 段・第 2 段でも救えない入力（乱数 1500 件のうち 3 件。四隅でも救えない）
  it("救えない入力は、元の結果（#94 と同じ出力）を返す", () => {
    const points: PointSet[] = [
      [[438.857, 109.416], [438.737, 305.068]],
      [[438.35, 225.301], [-16.822, 497.068]],
      [[775.673, 576.126], [563.669, -673.51]],
      [[624.196, 711.119], [66.849, -896.854]],
      [[492.825, 464.478], [-70.422, -159.299]],
      [[627.166, 379.828], [341.88, -51.01]],
      [[841.091, 621.774], [503.524, -435.753]]
    ];
    const v2 = new Tin({ wh: [1000, 800], points, strictMode: "strict", useV2Algorithm: true });
    v2.updateTin();
    expect(v2.strict_status).toBe(Tin.STATUS_STRICT);
    for (const [mode, status, expected] of [
      [Tin.MODE_STRICT, Tin.STATUS_ERROR, "4b548941ccaba512"],
      [Tin.MODE_AUTO, Tin.STATUS_LOOSE, "b415f79ce29c995f"]
    ] as const) {
      const tin = new Tin({ wh: [1000, 800], points, strictMode: mode });
      tin.updateTin();
      expect(tin.strict_status).toBe(status);
      expect(tin.boundaryDiagnostics!.ringRescue).toBeUndefined();
      expect(tin.getCompiled().vertices_points).toHaveLength(36);
      expect(digest(tin.getCompiled())).toBe(expected);
    }
  });

  // 補助頂点を外すだけでは救えず、四隅だけにして strict になる入力（乱数 1500 件のうち 4 件。5 点）。
  // 縮尺と回転の推定は V3 のまま（farLsq）。V2 と同じ min には戻さない
  it("第 1 段で救えない入力は、四隅だけの輪（第 2 段）で strict になる", () => {
    const points = JSON.parse(
      '[[[178.27627263963223,370.8580033108592],[312.5045376457274,-479.58504224196076]],' +
        '[[44.34795059263706,141.4984718337655],[166.7039531841874,-147.55739917978644]],' +
        '[[949.4191088527441,120.78235247172415],[1143.2666661031544,9.120643371716142]],' +
        '[[399.9954593926668,763.4223887231201],[213.9097062498331,-949.8301547486335]],' +
        '[[347.11599208414555,723.872491279617],[216.6357110068202,-883.1524332333356]]]'
    ) as PointSet[];
    const v2 = new Tin({ wh: [1000, 800], points, strictMode: "strict", useV2Algorithm: true });
    v2.updateTin();
    expect(v2.strict_status).toBe(Tin.STATUS_STRICT);
    for (const mode of [Tin.MODE_STRICT, Tin.MODE_AUTO] as const) {
      const tin = new Tin({ wh: [1000, 800], points, strictMode: mode });
      tin.updateTin();
      expect(tin.strict_status).toBe(Tin.STATUS_STRICT);
      expect(tin.boundaryDiagnostics!.ringRescue).toBe("corners");
      expect(tin.getCompiled().vertices_points).toHaveLength(4);
      // V2 の四隅（min の推定）とは、地理側の位置が違う（V3 の推定のまま）
      expect(tin.getCompiled().vertices_points).not.toEqual(v2.getCompiled().vertices_points);
    }
  });

  /** 最初の組み立ては本物、2 回目以降（手当て）に細工をする。 */
  function sabotageRescue(after: (tin: Tin, raw: { forw: unknown[]; bakw: unknown[] }, gcps: unknown[]) => void) {
    const proto = Tin.prototype as unknown as Record<string, (...args: unknown[]) => unknown>;
    const original = proto.buildWithSupplements;
    let calls = 0;
    vi.spyOn(proto, "buildWithSupplements").mockImplementation(function (this: Tin, ...args: unknown[]) {
      calls++;
      if (calls === 1) return original.apply(this, args);
      const result = original.apply(this, args);
      after(this, args[1] as { forw: unknown[]; bakw: unknown[] }, args[2] as unknown[]);
      return result;
    });
  }

  it(
    "手当ての組み立てが例外を投げたときは、元の結果（#94 と同じ出力）に戻る",
    () => {
      const proto = Tin.prototype as unknown as Record<string, (...args: unknown[]) => unknown>;
      const original = proto.buildWithSupplements;
      let calls = 0;
      vi.spyOn(proto, "buildWithSupplements").mockImplementation(function (this: Tin, ...args: unknown[]) {
        if (++calls > 1) throw new Error("手当ての組み立ての失敗");
        return original.apply(this, args);
      });
      for (const mode of [Tin.MODE_STRICT, Tin.MODE_AUTO] as const) {
        calls = 0;
        const tin = build("kaisei_hiroshima_jissoku_sub1", mode);
        expect(calls).toBeGreaterThan(1);
        expect(tin.boundaryDiagnostics!.ringRescue).toBeUndefined();
        expect(digest(tin.getCompiled())).toBe(BEFORE[`kaisei_hiroshima_jissoku_sub1|${mode}`]);
      }
    },
    REAL_DATA_TIMEOUT_MS
  );

  it(
    "手当てが strict にならず、補完点・中継点を足したままのときは、足した分も含めて元の状態に戻る",
    () => {
      for (const mode of [Tin.MODE_STRICT, Tin.MODE_AUTO] as const) {
        sabotageRescue((tin, raw, gcps) => {
          const t = tin as unknown as { edgeNodes: unknown[]; supplementRecords: unknown[]; strict_status: string };
          raw.forw.push(raw.forw[0]);
          raw.bakw.push(raw.bakw[0]);
          gcps.push(gcps[0]);
          t.edgeNodes.push([[0, 0], [0, 0]]);
          t.supplementRecords = [{ node: 0, kind: "hullEdge", edge: [0, 1] }];
          t.strict_status = "strict_error";
        });
        const tin = build("naramachi_yasui_bunko_core", mode);
        vi.restoreAllMocks();
        const t = tin as unknown as { edgeNodes: unknown[]; supplementRecords: unknown[] };
        expect(tin.strict_status).toBe(mode === Tin.MODE_STRICT ? Tin.STATUS_ERROR : Tin.STATUS_LOOSE);
        expect(tin.supplementPairs).toHaveLength(0);
        expect(t.supplementRecords).toHaveLength(0);
        expect(digest(tin.getCompiled())).toBe(BEFORE[`naramachi_yasui_bunko_core|${mode}`]);
      }
    },
    REAL_DATA_TIMEOUT_MS * 3
  );
});

// world file 外周（B）の経路。B が成立しても strict にならないときは、同じ 2 段の手当てをする。
// B の輪の補助頂点は、手当てで外した分だけ減り、`vertices_points` には採用した輪の全部を書く。
function fitWorldFile(points: PointSet[]): WorldFile {
  const mean = (side: 0 | 1, axis: number) =>
    points.reduce((sum, pair) => sum + pair[side][axis], 0) / points.length;
  const xMean = mean(0, 0);
  const yMean = mean(0, 1);
  const rows = points.map(([[x, y], crs]) => [x - xMean, y - yMean, ...crs]);
  const dot = (a: number, b: number) => rows.reduce((sum, row) => sum + row[a] * row[b], 0);
  const xx = dot(0, 0), xy = dot(0, 1), yy = dot(1, 1);
  const det = xx * yy - xy * xy;
  const fit = (axis: number) => {
    const x = (yy * dot(0, axis + 2) - xy * dot(1, axis + 2)) / det;
    const y = (xx * dot(1, axis + 2) - xy * dot(0, axis + 2)) / det;
    return [x, y, mean(1, axis) + x * (0.5 - xMean) + y * (0.5 - yMean)];
  };
  const [xScale, xSkew, xOrigin] = fit(0);
  const [ySkew, yScale, yOrigin] = fit(1);
  return { xScale, xSkew, xOrigin, ySkew, yScale, yOrigin };
}

describe("world file 外周（B）でも strict にする", () => {
  describe.each([Tin.MODE_STRICT, Tin.MODE_AUTO] as const)("広島 strictMode=%s", (mode) => {
    const worldFile = fitWorldFile(load("kaisei_hiroshima_jissoku_sub1").gcps as PointSet[]);
    const tin = build("kaisei_hiroshima_jissoku_sub1", mode, { outerTransform: "worldFile", worldFile });
    // 手当てをしない（loose）の、36 区分の輪
    const loose = build("kaisei_hiroshima_jissoku_sub1", "loose", { outerTransform: "worldFile", worldFile });

    it("B のまま strict になり、補助頂点を外した輪が compiled に全部書かれる", () => {
      expect(tin.strict_status).toBe(Tin.STATUS_STRICT);
      expect(tin.kinks).toBeUndefined();
      expect(tin.boundaryDiagnostics).toMatchObject({ outerTransform: "worldFile", ringRescue: "thinned" });
      const compiled = tin.getCompiled();
      expect(compiled).toHaveProperty("outerTransform", "worldFile");
      expect(compiled.vertices_points.length).toBeLessThan(36);
      const aux = tin
        .pointsSet!.forw.features.filter((f) => String(f.properties!.target.index).startsWith("b"))
        .map((f) => f.geometry.coordinates);
      expect(compiled.vertices_points.map(([forw]) => forw)).toEqual(aux);
      const expected = RESCUED[`kaisei_hiroshima_jissoku_sub1|${mode}`].worldFile;
      expect(compiled.vertices_points).toHaveLength(expected.ring);
      expect(compiled.vertices_points.length).toBeLessThan(loose.getCompiled().vertices_points.length);
      expect(digest(compiled)).toBe(expected.digest);
      expect(attemptsOf(tin)).toBeLessThanOrEqual(expected.attempts);
    });

    it("Transform で読み直して、GCP が往復する", () => {
      const reader = new Transform();
      reader.setCompiled(JSON.parse(JSON.stringify(tin.getCompiled())));
      for (const [forw, bakw] of tin.points) {
        const toGeo = reader.transform(forw, false, true) as number[];
        expect(Math.hypot(toGeo[0] - bakw[0], toGeo[1] - bakw[1])).toBeLessThanOrEqual(1e-6);
        const toPaper = reader.transform(bakw, true, true) as number[];
        expect(Math.hypot(toPaper[0] - forw[0], toPaper[1] - forw[1])).toBeLessThanOrEqual(1e-6);
      }
    });
  });

  it(
    "B から C（扇形）へ落ちる奈良町も、手当てで strict になる",
    () => {
      const worldFile = fitWorldFile(load("naramachi_yasui_bunko_core").gcps as PointSet[]);
      const tin = build("naramachi_yasui_bunko_core", "strict", { outerTransform: "worldFile", worldFile });
      expect(tin.getCompiled()).toHaveProperty("outerTransform", "extrapolate");
      expect(tin.strict_status).toBe(Tin.STATUS_STRICT);
      expect(tin.boundaryDiagnostics).toMatchObject({
        requestedOuterTransform: "worldFile",
        outerTransform: "extrapolate",
        fallbackReason: "boundaryFlips",
        ringRescue: "thinned"
      });
      const expected = RESCUED["naramachi_yasui_bunko_core|strict"].worldFile;
      expect(tin.getCompiled().vertices_points).toHaveLength(expected.ring);
      expect(digest(tin.getCompiled())).toBe(expected.digest);
      // C に落ちた後の手当ての手間は、C の最初の組み立てを基準にする（B の試行を基準に含めない）
      expect(attemptsOf(tin)).toBeLessThanOrEqual(expected.attempts);
    },
    REAL_DATA_TIMEOUT_MS * 3
  );

  // B が成立しなかった入力（扇形に落ちて、36 点で strict）に、四隅だけの B を採らせない。
  // 乱数 1,500 件・world file ありで、手当てが四隅の B を採った入力が strict で 12 件、auto で 23 件あった
  it("B が成立しなかったときは、四隅だけの B を試さない（C の 36 点のまま）", () => {
    const points: PointSet[] = [
      [[568.222, 203.489], [-1061.964, 707.662]],
      [[188.205, 661.909], [-409.976, 1340.703]],
      [[79.088, 194.051], [-183.894, 286.315]],
      [[520.127, 744.659], [-1205.755, 2128.619]],
      [[267.311, 734.207], [-294.846, 1749.292]],
      [[119.504, 480.916], [79.17, 1513.422]],
      [[452.085, 543.517], [-1056.412, 1416.951]]
    ];
    const worldFile = fitWorldFile(points);
    for (const [mode, expected] of [
      [Tin.MODE_STRICT, "e272e82c4337fcbc"],
      [Tin.MODE_AUTO, "a5985de2998d8b71"]
    ] as const) {
      const tin = new Tin({ wh: [1000, 800], points, strictMode: mode, outerTransform: "worldFile", worldFile });
      tin.updateTin();
      expect(tin.strict_status).toBe(Tin.STATUS_STRICT);
      expect(tin.getCompiled()).toHaveProperty("outerTransform", "extrapolate");
      expect(tin.getCompiled().vertices_points).toHaveLength(36);
      expect(tin.boundaryDiagnostics).toMatchObject({ outerTransform: "extrapolate", fallbackReason: "boundaryFlips" });
      expect(tin.boundaryDiagnostics!.ringRescue).toBeUndefined();
      expect(digest(tin.getCompiled())).toBe(expected);
    }
  });

  it("loose 指定の world file 外周は手当てをしない", () => {
    const worldFile = fitWorldFile(load("kaisei_hiroshima_jissoku_sub1").gcps as PointSet[]);
    const tin = build("kaisei_hiroshima_jissoku_sub1", "loose", { outerTransform: "worldFile", worldFile });
    expect(tin.boundaryDiagnostics!.ringRescue).toBeUndefined();
  });
});
