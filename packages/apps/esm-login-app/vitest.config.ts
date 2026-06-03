import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    {
      name: 'scss-identity',
      enforce: 'pre',
      resolveId(id) {
        if (/\.scss(\?.*)?$/.test(id)) {
          return '\0scss-identity:' + id.replace(/\.scss(\?.*)?$/, '');
        }
      },
      load(id) {
        if (id.startsWith('\0scss-identity:')) {
          return `export default new Proxy({}, { get: (_, k) => typeof k === 'string' ? k : undefined });`;
        }
      },
    },
  ],
  test: {
    environment: 'happy-dom',
    mockReset: true,
    globals: true,
    setupFiles: ['./setup-tests.ts'],
    alias: {
      '@openmrs/esm-framework/src/internal': '@openmrs/esm-framework/mock',
      '@openmrs/esm-framework': '@openmrs/esm-framework/mock',
      '@openmrs/esm-styleguide/src/internal': path.resolve(__dirname, '../../framework/esm-styleguide/src/internal.ts'),
    },
  },
});
