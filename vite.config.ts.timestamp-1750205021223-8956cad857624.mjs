// vite.config.ts
import { defineConfig } from "file:///home/opc/dev/MaplatTin/node_modules/vite/dist/node/index.js";
import dts from "file:///home/opc/dev/MaplatTin/node_modules/vite-plugin-dts/dist/index.mjs";
import { resolve } from "path";
import { readFileSync } from "fs";
var __vite_injected_original_dirname = "/home/opc/dev/MaplatTin";
var packageJson = JSON.parse(readFileSync("./package.json", "utf-8"));
var isPackageBuild = process.env.BUILD_MODE === "package";
var removeTsExtensions = () => {
  return {
    name: "remove-ts-extensions",
    transform(code, id) {
      if (id.endsWith(".ts") || id.endsWith(".tsx")) {
        return code.replace(
          /from\s+['"](\.\.\/[^'"]+)\.ts['"]/g,
          'from "$1"'
        );
      }
      return code;
    }
  };
};
var vite_config_default = defineConfig({
  build: isPackageBuild ? {
    lib: {
      entry: resolve(__vite_injected_original_dirname, "src/index.ts"),
      formats: ["es", "cjs", "umd"],
      name: "tin",
      fileName: (format) => {
        switch (format) {
          case "es":
            return "tin.js";
          case "cjs":
            return "tin.cjs";
          case "umd":
            return "tin.umd.js";
          default:
            return "tin.js";
        }
      }
    },
    rollupOptions: {
      external: [
        "@turf/boolean-point-in-polygon",
        "@turf/centroid",
        "@turf/convex",
        "@turf/helpers",
        "@turf/line-intersect",
        "@maplat/edgeruler",
        "@maplat/transform",
        "delaunator"
      ]
    }
  } : {
    outDir: "dist",
    emptyOutDir: true
  },
  plugins: [
    removeTsExtensions(),
    dts({
      outDir: "dist",
      exclude: ["tests"],
      rollupTypes: true,
      skipDiagnostics: true,
      tsconfigPath: "./tsconfig.build.json",
      logLevel: "silent"
    })
  ],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./test/setup.ts"]
  },
  resolve: {
    alias: {
      "@": resolve(__vite_injected_original_dirname, "./src")
    }
  },
  define: {
    "import.meta.env.APP_VERSION": JSON.stringify(packageJson.version)
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9vcGMvZGV2L01hcGxhdFRpblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvb3BjL2Rldi9NYXBsYXRUaW4vdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvb3BjL2Rldi9NYXBsYXRUaW4vdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCBkdHMgZnJvbSAndml0ZS1wbHVnaW4tZHRzJztcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJztcbmltcG9ydCB7IHJlYWRGaWxlU3luYyB9IGZyb20gJ2ZzJztcblxuY29uc3QgcGFja2FnZUpzb24gPSBKU09OLnBhcnNlKHJlYWRGaWxlU3luYygnLi9wYWNrYWdlLmpzb24nLCAndXRmLTgnKSk7XG5jb25zdCBpc1BhY2thZ2VCdWlsZCA9IHByb2Nlc3MuZW52LkJVSUxEX01PREUgPT09ICdwYWNrYWdlJztcblxuLy8gUGx1Z2luIHRvIHJlbW92ZSAudHMgZXh0ZW5zaW9ucyBmcm9tIGltcG9ydHNcbmNvbnN0IHJlbW92ZVRzRXh0ZW5zaW9ucyA9ICgpID0+IHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAncmVtb3ZlLXRzLWV4dGVuc2lvbnMnLFxuICAgIHRyYW5zZm9ybShjb2RlLCBpZCkge1xuICAgICAgaWYgKGlkLmVuZHNXaXRoKCcudHMnKSB8fCBpZC5lbmRzV2l0aCgnLnRzeCcpKSB7XG4gICAgICAgIC8vIFJlcGxhY2UgaW1wb3J0cyB3aXRoIC50cyBleHRlbnNpb25zXG4gICAgICAgIHJldHVybiBjb2RlLnJlcGxhY2UoXG4gICAgICAgICAgL2Zyb21cXHMrWydcIl0oXFwuXFwuXFwvW14nXCJdKylcXC50c1snXCJdL2csXG4gICAgICAgICAgJ2Zyb20gXCIkMVwiJ1xuICAgICAgICApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvZGU7XG4gICAgfVxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgYnVpbGQ6IGlzUGFja2FnZUJ1aWxkID8ge1xuICAgIGxpYjoge1xuICAgICAgZW50cnk6IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjL2luZGV4LnRzJyksXG4gICAgICBmb3JtYXRzOiBbJ2VzJywgJ2NqcycsICd1bWQnXSxcbiAgICAgIG5hbWU6ICd0aW4nLFxuICAgICAgZmlsZU5hbWU6IChmb3JtYXQpID0+IHtcbiAgICAgICAgc3dpdGNoKGZvcm1hdCkge1xuICAgICAgICAgIGNhc2UgJ2VzJzpcbiAgICAgICAgICAgIHJldHVybiAndGluLmpzJztcbiAgICAgICAgICBjYXNlICdjanMnOlxuICAgICAgICAgICAgcmV0dXJuICd0aW4uY2pzJztcbiAgICAgICAgICBjYXNlICd1bWQnOlxuICAgICAgICAgICAgcmV0dXJuICd0aW4udW1kLmpzJztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuICd0aW4uanMnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBleHRlcm5hbDogW1xuICAgICAgICAnQHR1cmYvYm9vbGVhbi1wb2ludC1pbi1wb2x5Z29uJyxcbiAgICAgICAgJ0B0dXJmL2NlbnRyb2lkJyxcbiAgICAgICAgJ0B0dXJmL2NvbnZleCcsXG4gICAgICAgICdAdHVyZi9oZWxwZXJzJyxcbiAgICAgICAgJ0B0dXJmL2xpbmUtaW50ZXJzZWN0JyxcbiAgICAgICAgJ0BtYXBsYXQvZWRnZXJ1bGVyJyxcbiAgICAgICAgJ0BtYXBsYXQvdHJhbnNmb3JtJyxcbiAgICAgICAgJ2RlbGF1bmF0b3InXG4gICAgICBdXG4gICAgfVxuICB9IDoge1xuICAgIG91dERpcjogJ2Rpc3QnLFxuICAgIGVtcHR5T3V0RGlyOiB0cnVlXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICByZW1vdmVUc0V4dGVuc2lvbnMoKSxcbiAgICBkdHMoe1xuICAgICAgb3V0RGlyOiAnZGlzdCcsXG4gICAgICBleGNsdWRlOiBbJ3Rlc3RzJ10sXG4gICAgICByb2xsdXBUeXBlczogdHJ1ZSxcbiAgICAgIHNraXBEaWFnbm9zdGljczogdHJ1ZSxcbiAgICAgIHRzY29uZmlnUGF0aDogJy4vdHNjb25maWcuYnVpbGQuanNvbicsXG4gICAgICBsb2dMZXZlbDogJ3NpbGVudCdcbiAgICB9KVxuICBdLFxuICB0ZXN0OiB7XG4gICAgZW52aXJvbm1lbnQ6ICdqc2RvbScsXG4gICAgZ2xvYmFsczogdHJ1ZSxcbiAgICBzZXR1cEZpbGVzOiBbJy4vdGVzdC9zZXR1cC50cyddXG4gIH0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiByZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJylcbiAgICB9XG4gIH0sXG4gIGRlZmluZToge1xuICAgICdpbXBvcnQubWV0YS5lbnYuQVBQX1ZFUlNJT04nOiBKU09OLnN0cmluZ2lmeShwYWNrYWdlSnNvbi52ZXJzaW9uKVxuICB9XG59KTsiXSwKICAibWFwcGluZ3MiOiAiO0FBQXVQLFNBQVMsb0JBQW9CO0FBQ3BSLE9BQU8sU0FBUztBQUNoQixTQUFTLGVBQWU7QUFDeEIsU0FBUyxvQkFBb0I7QUFIN0IsSUFBTSxtQ0FBbUM7QUFLekMsSUFBTSxjQUFjLEtBQUssTUFBTSxhQUFhLGtCQUFrQixPQUFPLENBQUM7QUFDdEUsSUFBTSxpQkFBaUIsUUFBUSxJQUFJLGVBQWU7QUFHbEQsSUFBTSxxQkFBcUIsTUFBTTtBQUMvQixTQUFPO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixVQUFVLE1BQU0sSUFBSTtBQUNsQixVQUFJLEdBQUcsU0FBUyxLQUFLLEtBQUssR0FBRyxTQUFTLE1BQU0sR0FBRztBQUU3QyxlQUFPLEtBQUs7QUFBQSxVQUNWO0FBQUEsVUFDQTtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQ0EsYUFBTztBQUFBLElBQ1Q7QUFBQSxFQUNGO0FBQ0Y7QUFFQSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixPQUFPLGlCQUFpQjtBQUFBLElBQ3RCLEtBQUs7QUFBQSxNQUNILE9BQU8sUUFBUSxrQ0FBVyxjQUFjO0FBQUEsTUFDeEMsU0FBUyxDQUFDLE1BQU0sT0FBTyxLQUFLO0FBQUEsTUFDNUIsTUFBTTtBQUFBLE1BQ04sVUFBVSxDQUFDLFdBQVc7QUFDcEIsZ0JBQU8sUUFBUTtBQUFBLFVBQ2IsS0FBSztBQUNILG1CQUFPO0FBQUEsVUFDVCxLQUFLO0FBQ0gsbUJBQU87QUFBQSxVQUNULEtBQUs7QUFDSCxtQkFBTztBQUFBLFVBQ1Q7QUFDRSxtQkFBTztBQUFBLFFBQ1g7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsZUFBZTtBQUFBLE1BQ2IsVUFBVTtBQUFBLFFBQ1I7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGLElBQUk7QUFBQSxJQUNGLFFBQVE7QUFBQSxJQUNSLGFBQWE7QUFBQSxFQUNmO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxtQkFBbUI7QUFBQSxJQUNuQixJQUFJO0FBQUEsTUFDRixRQUFRO0FBQUEsTUFDUixTQUFTLENBQUMsT0FBTztBQUFBLE1BQ2pCLGFBQWE7QUFBQSxNQUNiLGlCQUFpQjtBQUFBLE1BQ2pCLGNBQWM7QUFBQSxNQUNkLFVBQVU7QUFBQSxJQUNaLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxNQUFNO0FBQUEsSUFDSixhQUFhO0FBQUEsSUFDYixTQUFTO0FBQUEsSUFDVCxZQUFZLENBQUMsaUJBQWlCO0FBQUEsRUFDaEM7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDakM7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTiwrQkFBK0IsS0FBSyxVQUFVLFlBQVksT0FBTztBQUFBLEVBQ25FO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
