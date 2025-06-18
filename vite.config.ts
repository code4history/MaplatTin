import { defineConfig } from 'vitest/config';
import dts from 'vite-plugin-dts';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import process from 'node:process';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));
const isPackageBuild = process.env.BUILD_MODE === 'package';

// Plugin to remove .ts extensions from imports
const removeTsExtensions = () => {
  return {
    name: 'remove-ts-extensions',
    transform(code, id) {
      if (id.endsWith('.ts') || id.endsWith('.tsx')) {
        // Replace imports with .ts extensions
        return code.replace(
          /from\s+['"](\.\.\/[^'"]+)\.ts['"]/g,
          'from "$1"'
        );
      }
      return code;
    }
  };
};

export default defineConfig({
  build: isPackageBuild ? {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs', 'umd'],
      name: 'tin',
      fileName: (format) => {
        switch(format) {
          case 'es':
            return 'tin.js';
          case 'cjs':
            return 'tin.cjs';
          case 'umd':
            return 'tin.umd.js';
          default:
            return 'tin.js';
        }
      }
    },
    rollupOptions: {
      external: [
        '@turf/boolean-point-in-polygon',
        '@turf/centroid',
        '@turf/convex',
        '@turf/helpers',
        '@turf/line-intersect',
        'delaunator'
      ],
      output: {
        globals: {
          '@turf/boolean-point-in-polygon': 'turf.booleanPointInPolygon',
          '@turf/centroid': 'turf.centroid',
          '@turf/convex': 'turf.convex',
          '@turf/helpers': 'turf.helpers',
          '@turf/line-intersect': 'turf.lineIntersect',
          'delaunator': 'Delaunator'
        }
      }
    }
  } : {
    outDir: 'dist',
    emptyOutDir: true
  },
  plugins: [
    removeTsExtensions(),
    dts({
      outDir: 'dist',
      exclude: ['tests', 'node_modules', '../MaplatTransform', '../MaplatEdgeBound'],
      rollupTypes: false,
      tsconfigPath: './tsconfig.json',
      logLevel: 'silent',
      insertTypesEntry: true,
      staticImport: true,
      beforeWriteFile: (filePath, content) => {
        // Fix import paths for local dependencies and remove .ts extensions
        const fixedContent = content
          .replace(/from ['"]\.\.\/MaplatTransform['"]/g, 'from "@maplat/transform"')
          .replace(/from ['"]\.\.\/MaplatEdgeBound['"]/g, 'from "@maplat/edgebound"')
          .replace(/import\("\.\.\/MaplatTransform"\)/g, 'import("@maplat/transform")')
          .replace(/import\("\.\.\/MaplatEdgeBound"\)/g, 'import("@maplat/edgebound")')
          .replace(/from ['"](\.[^'"]+)\.ts['"]/g, 'from "$1"')
          .replace(/import\(["'](\.[^'"]+)\.ts["']\)/g, 'import("$1")');
        return {
          filePath,
          content: fixedContent
        };
      }
    })
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts']
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  define: {
    'import.meta.env.APP_VERSION': JSON.stringify(packageJson.version)
  }
});