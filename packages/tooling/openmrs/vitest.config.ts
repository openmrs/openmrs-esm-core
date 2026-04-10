import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@xterm/headless': resolve(__dirname, '../../..', 'node_modules/@xterm/headless/lib-headless/xterm-headless.mjs'),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    mockReset: true,
    deps: {},
    setupFiles: ['./setup-tests.ts'],
  },
});
