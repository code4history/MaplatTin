import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    environmentOptions: {
      jsdom: {
        url: 'http://localhost'
      }
    },
    include: ['tests/**/*.test.{ts,js}'],
    exclude: ['tests/**/*.deno.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'dist/**',
        '**/*.d.ts',
        'tests/**',
        'vite.config.ts',
        'vitest.config.ts'
      ]
    },
    setupFiles: ['./tests/setup.ts'],
    silent: false
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
});