import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import { readFileSync } from 'fs';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));
const isPackageBuild = process.env.BUILD_MODE === 'package';

export default defineConfig({
  base: './',
  build: isPackageBuild ? {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs', 'umd'],
      name: 'maplat_tin',
      fileName: (format, entryName) => {
        switch(format) {
          case 'es':
            return 'maplat_tin.js';
          case 'cjs':
            return 'maplat_tin.cjs';
          case 'umd':
            return 'maplat_tin.umd.js';
          default:
            return 'maplat_tin.js';
        }
      }
    }
  } : {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      external: ['@turf/turf', 'delaunator', '@kninnug/constrainautor'],
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        globals: {
          '@turf/turf': 'turf',
          'delaunator': 'Delaunator',
          '@kninnug/constrainautor': 'Constrainautor'
        },
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash][extname]'
      }
    }
  },
  plugins: [
    dts({
      outDir: 'dist',
      exclude: ['tests'],
      rollupTypes: true
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