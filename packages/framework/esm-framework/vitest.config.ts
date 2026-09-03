import { readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const frameworkRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/*
 * These tests exercise the framework end to end, so every package involved has to be the *same*
 * copy the components under test import. Without this, a test importing `../../../esm-extensions/src`
 * renders components that resolve `@openmrs/esm-extensions` through the workspace symlink to
 * `dist/` — two module instances, each with its own recomputation state, caches and subscriptions,
 * so a regression in `src` is masked by the previously built `dist`.
 *
 * Bare specifiers only: subpaths like `@openmrs/esm-api/mock` keep their own resolution.
 */
const frameworkSourceAliases = readdirSync(frameworkRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && entry.name.startsWith('esm-'))
  .map((entry) => ({
    find: new RegExp(`^@openmrs/${entry.name}$`),
    replacement: resolve(frameworkRoot, entry.name, 'src/index.ts'),
  }));

export default defineConfig({
  resolve: { alias: frameworkSourceAliases },
  test: {
    environment: 'happy-dom',
    mockReset: true,
    setupFiles: ['./setup-tests.ts'],
  },
});
