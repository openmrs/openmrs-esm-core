import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@openmrs/esm-framework/src/internal': resolve(__dirname, '../../framework/esm-emr-api/src/events/index.ts'),
    },
  },
  test: {
    environment: 'happy-dom',
    environmentOptions: {
      happyDOM: {
        url: 'http://localhost/',
      },
    },
    mockReset: true,
    // `browser-targets.test.ts` builds the real rspack config, which compiles the styleguide stylesheet
    // through sass; on CI that alone can exceed vitest's unit-test-sized default.
    testTimeout: 20_000,
  },
});
