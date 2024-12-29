// vite.config.ts
import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MaplatTin',
      fileName: 'maplat-tin'
    },
    rollupOptions: {
      external: ['@turf/turf', 'delaunator', '@kninnug/constrainautor'],
      output: {
        globals: {
          '@turf/turf': 'turf',
          'delaunator': 'Delaunator',
          '@kninnug/constrainautor': 'Constrainautor'
        }
      }
    }
  },
  plugins: [
    dts({
      outDir: 'dist',
      exclude: ['test'],
      rollupTypes: true
    })
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts']
  }
});