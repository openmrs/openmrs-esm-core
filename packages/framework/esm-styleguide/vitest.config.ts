import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    environmentOptions: {
      happyDOM: {
        url: 'http://localhost/',
      },
      jsdom: {
        url: 'http://localhost/',
      },
    },
    mockReset: true,
    setupFiles: ['./setup-tests.ts'],
  },
});
