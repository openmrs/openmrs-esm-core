import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    mockReset: true,
    setupFiles: ['./setup-tests.ts'],
    globals: true,
    alias: {
      '^lodash-es$': 'lodash',
      '^lodash-es/(.*)$': 'lodash/$1',
      '@openmrs/esm-framework/src/internal': '@openmrs/esm-framework/mock',
      '@openmrs/esm-framework': '@openmrs/esm-framework/mock',
    },
    coverage: {
      provider: 'v8',
    },
  },
});
