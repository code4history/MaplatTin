import { readFileSync } from "node:fs";
import { orient2d } from "robust-predicates";
import { Tin, type Compiled, type Options } from "../src/index.ts";

/** tests/maps の地図ファイルの形（試験が使う項目だけ）。 */
export interface MapFixture {
  width: number;
  height: number;
  gcps?: Options["points"];
  edges?: Options["edges"];
  vertexMode?: Options["vertexMode"];
  compiled?: Compiled;
  sub_maps?: { compiled?: Compiled }[];
}

export function loadMapFixture(name: string): MapFixture {
  return JSON.parse(readFileSync(new URL(`./maps/${name}.json`, import.meta.url), "utf8"));
}

/** 地図ファイルから Tin のオプションを作る（tests/hull-edges-centroid.test.ts の実データと同じ読み方）。 */
export function fixtureOptions(name: string, strictMode: Options["strictMode"]): Options {
  const map = loadMapFixture(name);
  const compiled = map.compiled;
  return {
    wh: compiled?.wh ?? [map.width, map.height],
    vertexMode: map.vertexMode ?? compiled?.vertexMode,
    strictMode,
    yaxisMode: compiled?.yaxisMode,
    points: map.gcps ?? compiled?.points,
    edges: map.edges ?? compiled?.edges
  };
}

export function buildFixture(name: string, strictMode: Options["strictMode"], extra: Partial<Options> = {}): Tin {
  const tin = new Tin({ ...fixtureOptions(name, strictMode), ...extra });
  tin.updateTin();
  return tin;
}

const cache = new Map<string, Tin>();
/** 同じ入力は 1 回だけ組む（読み取りだけに使うこと）。 */
export function cachedFixture(name: string, strictMode: Options["strictMode"], extra: Partial<Options> = {}): Tin {
  const key = `${name}|${strictMode}|${JSON.stringify(extra)}`;
  let tin = cache.get(key);
  if (!tin) {
    tin = buildFixture(name, strictMode, extra);
    cache.set(key, tin);
  }
  return tin;
}

/**
 * 地図面の三角網 `tins.forw` のうち、地理側の向きが（地図面の向きに対して）多数派と逆か、面積 0 のものの数。
 * 補助頂点を含む三角形も含めて数える。strict の三角網では 0 になる。
 */
export function orientationFlips(tin: Tin): number {
  let positive = 0;
  let negative = 0;
  const signs = tin.tins!.forw!.features.map((triangle) => {
    const { a, b, c } = triangle.properties!;
    const [p, q, r] = triangle.geometry!.coordinates[0];
    const product =
      Math.sign(orient2d(p[0], p[1], q[0], q[1], r[0], r[1])) *
      Math.sign(orient2d(a.geom[0], a.geom[1], b.geom[0], b.geom[1], c.geom[0], c.geom[1]));
    if (product > 0) positive++;
    else if (product < 0) negative++;
    return product;
  });
  const majority = positive >= negative ? 1 : -1;
  return signs.filter((sign) => sign !== majority).length;
}
