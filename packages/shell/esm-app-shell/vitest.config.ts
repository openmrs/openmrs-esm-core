import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@openmrs/esm-framework/src/internal': resolve(__dirname, '../../framework/esm-emr-api/src/events/index.ts'),
      // Mirrors the alias in rspack.config.js; the package doesn't export its translation files.
      '@openmrs/esm-translations/translations': resolve(__dirname, '../../framework/esm-translations/translations'),
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
    setupFiles: ['./setup-tests.ts'],
    // `browser-targets.test.ts` builds the real rspack config, which compiles the styleguide stylesheet
    // through sass; on CI that alone can exceed vitest's unit-test-sized default.
    testTimeout: 20_000,
  },
});
