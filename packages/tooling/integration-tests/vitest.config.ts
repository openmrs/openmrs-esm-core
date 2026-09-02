import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    // These tests run real production builds and `process.chdir` into a fixture, which needs the
    // `forks` pool and one file at a time.
    pool: 'forks',
    fileParallelism: false,
    include: ['src/**/*.test.ts'],
  },
});
