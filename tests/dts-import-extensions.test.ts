import { describe, expect, it } from "vitest";
import { addJsExtensions } from "../scripts/dts-import-extensions.ts";

const noDirectories = () => false;

describe("addJsExtensions", () => {
  it.each([
    ['export { Tin } from "./tin";', 'export { Tin } from "./tin.js";'],
    ["export type { A } from './types/tin';", 'export type { A } from "./types/tin.js";'],
    ['import { B } from "../base";', 'import { B } from "../base.js";'],
    ['import { C } from "./tin.ts";', 'import { C } from "./tin.js";'],
    ['import "./side-effect";', 'import "./side-effect.js";'],
    ['x: import("./tin").Options;', 'x: import("./tin.js").Options;'],
    ["x: import('./tin.ts').Options;", 'x: import("./tin.js").Options;'],
  ])("rewrites %s", (input, expected) => {
    expect(addJsExtensions(input, noDirectories)).toBe(expected);
  });

  it("points a directory at its index file", () => {
    const isDirectory = (specifier: string) => specifier === "./edgebound";
    expect(addJsExtensions('import { D } from "./edgebound";', isDirectory)).toBe(
      'import { D } from "./edgebound/index.js";',
    );
  });

  it.each([
    'import type { Position } from "geojson";',
    "import { Transform } from '@maplat/transform';",
    'x: import("@maplat/transform").Compiled;',
    'import { E } from "./already.js";',
    'declare const text = "a string from ./tin";',
  ])("keeps %s", (input) => {
    expect(addJsExtensions(input, noDirectories)).toBe(input);
  });
});
