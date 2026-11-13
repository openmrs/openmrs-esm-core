import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { getConfigSchemaPaths } from './paths';

const roots: Array<string> = [];

function moduleWith(files: Record<string, string>): string {
  const root = mkdtempSync(join(tmpdir(), 'openmrs-config-paths-'));
  roots.push(root);
  mkdirSync(join(root, 'src'), { recursive: true });

  for (const [name, contents] of Object.entries(files)) {
    writeFileSync(join(root, 'src', name), contents, 'utf8');
  }

  return root;
}

afterEach(() => {
  for (const root of roots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe("locating a module's configuration", () => {
  it('finds no hand-written schema when there is none', () => {
    const paths = getConfigSchemaPaths(moduleWith({ 'index.ts': '' }));

    expect(paths.handWrittenSchema).toBeUndefined();
  });

  it('exposes the generated validators file when the schema is extracted', () => {
    const paths = getConfigSchemaPaths(moduleWith({ 'index.ts': '' }));

    expect(paths.configValidatorsExpose).toBe(paths.generatedValidators);
  });

  it.each(['ts', 'tsx', 'js', 'jsx', 'mjs', 'cjs'])('finds an authored config-validators.%s', (extension) => {
    const paths = getConfigSchemaPaths(moduleWith({ [`config-validators.${extension}`]: '' }));

    expect(paths.authoredValidators).toMatch(new RegExp(`config-validators\\.${extension}$`));
  });

  it('prefers TypeScript when a module has more than one', () => {
    const paths = getConfigSchemaPaths(moduleWith({ 'config-validators.ts': '', 'config-validators.js': '' }));

    expect(paths.authoredValidators).toMatch(/config-validators\.ts$/);
  });

  describe('when the schema is hand-written', () => {
    it('exposes the authored validators file directly, with no generated wrapper', () => {
      // Nothing is extracted on this path, so there is no wrapper to put in front of it, and
      // without this, a `{"type": "custom", "export": "..."}` written by hand could never resolve.
      const paths = getConfigSchemaPaths(moduleWith({ 'config-schema.json': '{}', 'config-validators.ts': '' }));

      expect(paths.handWrittenSchema).toMatch(/config-schema\.json$/);
      expect(paths.configValidatorsExpose).toBe(paths.authoredValidators);
    });

    it('exposes nothing when the module has no validators of its own', () => {
      const paths = getConfigSchemaPaths(moduleWith({ 'config-schema.json': '{}' }));

      expect(paths.configValidatorsExpose).toBeUndefined();
    });
  });
});
