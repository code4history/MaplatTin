import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import type { Compiled, Options } from "../../src/index.ts";

/** tests/maps の地図ファイルの形（最上位に gcps を持つ形と、compiled だけを持つ形がある）。 */
interface MapFile {
  width?: number;
  height?: number;
  bounds?: Options["bounds"];
  importance?: number;
  priority?: number;
  gcps?: NonNullable<Options["points"]>;
  edges?: NonNullable<Options["edges"]>;
  vertexMode?: Options["vertexMode"];
  yaxisMode?: Options["yaxisMode"];
  compiled?: Compiled;
}

const mapsDir = new URL("../maps/", import.meta.url);

/** tests/maps の全部の地図の名前（拡張子なし・名前順）。 */
export const MAP_NAMES: string[] = readdirSync(mapsDir)
  .filter((file) => file.endsWith(".json"))
  .map((file) => file.replace(/\.json$/, ""))
  .sort();

export function loadMap(name: string): MapFile {
  return JSON.parse(readFileSync(new URL(`${name}.json`, mapsDir), "utf8"));
}

/** 地図ファイルから Tin のオプションを作る（どちらの形の地図も読む）。 */
export function mapOptions(
  name: string,
  strictMode: Options["strictMode"],
  extra: Partial<Options> = {}
): Options {
  const map = loadMap(name);
  const compiled = map.compiled;
  return {
    strictMode,
    vertexMode: map.vertexMode ?? compiled?.vertexMode,
    yaxisMode: map.yaxisMode ?? compiled?.yaxisMode,
    points: map.gcps ?? compiled?.points,
    edges: map.edges ?? compiled?.edges,
    ...(map.bounds
      ? {
          bounds: map.bounds,
          importance: map.importance,
          priority: map.priority
        }
      : { wh: compiled?.wh ?? [map.width!, map.height!] }),
    ...extra
  };
}

export const digest = (compiled: unknown): string =>
  createHash("sha256")
    .update(JSON.stringify(compiled))
    .digest("hex")
    .slice(0, 16);

export const MODES = ["strict", "auto"] as const;
