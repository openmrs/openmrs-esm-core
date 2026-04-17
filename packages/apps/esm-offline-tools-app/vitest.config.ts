import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    mockReset: true,
    globals: true,
    setupFiles: ['./setup-tests.ts'],
    alias: {
      '@openmrs/esm-framework': '@openmrs/esm-framework/mock',
    },
  },
});
