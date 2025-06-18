import { build, emptyDir } from "https://deno.land/x/dnt@0.40.0/mod.ts";

await emptyDir("./npm");

await build({
  entryPoints: ["./src/index.ts"],
  outDir: "./npm",
  shims: {
    deno: false,
  },
  test: false,
  typeCheck: false,
  package: {
    name: "@maplat/tin",
    version: Deno.args[0] || "0.11.0",
    description: "JavaScript library which performs homeomorphic conversion mutually between the coordinate systems of two planes based on the control points.",
    type: "module",
    license: "Maplat Limited License 1.1",
    repository: {
      type: "git",
      url: "git+https://github.com/code4history/MaplatTin.git",
    },
    bugs: {
      url: "https://github.com/code4history/MaplatTin/issues",
    },
    homepage: "https://github.com/code4history/MaplatTin/wiki",
    keywords: [
      "triangulation",
      "warp",
      "GIS",
      "Maplat",
      "MaplatTin"
    ],
    dependencies: {
      "@maplat/edgebound": "^0.2.2",
      "@maplat/transform": "^0.2.2",
    },
    peerDependencies: {
      "@turf/boolean-point-in-polygon": "^7.2.0",
      "@turf/centroid": "^7.2.0",
      "@turf/convex": "^7.2.0",
      "@turf/helpers": "^7.2.0",
      "@turf/line-intersect": "^7.2.0",
      "delaunator": "^5.0.0",
    },
  },
  mappings: {
    "./src/types/kinks.d.ts": "./src/types/kinks.d.ts",
    "./src/types/tin.d.ts": "./src/types/tin.d.ts",
  },
  postBuild() {
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
    Deno.copyFileSync("README_ja.md", "npm/README_ja.md");
  },
});