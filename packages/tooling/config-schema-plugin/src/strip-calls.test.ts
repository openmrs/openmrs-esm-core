import { describe, expect, it } from 'vitest';
import { stripSchemaCalls, type StripPlan } from './strip-calls';

const moduleName = '@openmrs/esm-foo-app';

const plan: StripPlan = {
  moduleName,
  hasModuleSchema: true,
  extensionNames: ['link', 'nav-group', 'dashboard'],
};

const strip = (source: string, overrides: Partial<StripPlan> = {}) =>
  stripSchemaCalls(source, 'index.ts', { ...plan, ...overrides });

describe('rewriting a module schema declaration', () => {
  it('replaces the call and drops the schema argument', () => {
    // The shape every frontend module in this repository actually uses.
    const { code, stripped } = strip(
      `import { defineConfigSchema, getSyncLifecycle } from '@openmrs/esm-framework';\n` +
        `import { configSchema } from './config-schema';\n` +
        `const moduleName = '${moduleName}';\n` +
        `export function startupApp() {\n  defineConfigSchema(moduleName, configSchema);\n}\n`,
    );

    expect(code).toContain('__openmrs_requireStaticConfigSchema(moduleName);');
    expect(code).not.toContain('defineConfigSchema(moduleName, configSchema)');
    expect(stripped).toEqual(['defineConfigSchema(...)']);
  });

  it('imports the marker from wherever the module imports the framework', () => {
    const { code } = strip(
      `import { defineConfigSchema } from '@openmrs/esm-framework/src/internal';\n` +
        `export function startupApp() {\n  defineConfigSchema(name, schema);\n}\n`,
    );

    expect(code).toContain(
      `import { requireStaticConfigSchema as __openmrs_requireStaticConfigSchema } from "@openmrs/esm-framework/src/internal";`,
    );
  });

  it('leaves the rest of the module untouched', () => {
    const source =
      `import { defineConfigSchema, getSyncLifecycle } from '@openmrs/esm-framework';\n` +
      `export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');\n` +
      `export function startupApp() {\n  defineConfigSchema(name, schema);\n}\n` +
      `export const root = getSyncLifecycle(rootComponent, options);\n`;

    const { code } = strip(source);

    expect(code).toContain("require.context('../translations', false, /.json$/, 'lazy')");
    expect(code).toContain('export const root = getSyncLifecycle(rootComponent, options);');
  });

  it('produces a source map carrying the source it rewrote', () => {
    const source =
      `import { defineConfigSchema } from '@openmrs/esm-framework';\n` +
      `export function startupApp() {\n  defineConfigSchema(name, schema);\n}\n`;
    const { code, map } = strip(source);

    expect(map).toBeDefined();

    const parsed = JSON.parse(map!);

    expect(parsed.sources).toEqual(['index.ts']);
    expect(parsed.sourcesContent).toEqual([source]);
    // Generated at full resolution, so every line of output carries mappings rather than the file
    // being mapped as one block from its first line.
    expect(parsed.mappings.split(';')).toHaveLength(code.split('\n').length);
  });
});

describe('rewriting extension schema declarations', () => {
  it('rewrites each one whose name the registry carries', () => {
    const { code, stripped } = strip(
      `import { defineConfigSchema, defineExtensionConfigSchema } from '@openmrs/esm-framework';\n` +
        `export function startupApp() {\n` +
        `  defineConfigSchema(moduleName, configSchema);\n` +
        `  defineExtensionConfigSchema('link', genericLinkConfigSchema);\n` +
        `  defineExtensionConfigSchema('nav-group', navGroupConfigSchema);\n` +
        `}\n`,
    );

    expect(code).toContain(`__openmrs_requireStaticExtensionConfigSchema('link');`);
    expect(code).toContain(`__openmrs_requireStaticExtensionConfigSchema('nav-group');`);
    expect(stripped).toHaveLength(3);
  });

  it('leaves alone an extension the registry does not carry', () => {
    const { code, stripped } = strip(
      `import { defineExtensionConfigSchema } from '@openmrs/esm-framework';\n` +
        `export function startupApp() {\n` +
        `  defineExtensionConfigSchema('link', a);\n` +
        `  defineExtensionConfigSchema('not-recorded', b);\n` +
        `}\n`,
    );

    expect(code).toContain(`defineExtensionConfigSchema('not-recorded', b);`);
    expect(stripped).toEqual(["defineExtensionConfigSchema('link')"]);
  });

  it('leaves alone an extension whose name is not written down in the source', () => {
    // Nothing here can show which extension this configures, so nothing about it can be proven.
    const { code, stripped } = strip(
      `import { defineExtensionConfigSchema } from '@openmrs/esm-framework';\n` +
        `export function startupApp() {\n  defineExtensionConfigSchema(someName, schema);\n}\n`,
    );

    expect(code).toContain('defineExtensionConfigSchema(someName, schema);');
    expect(stripped).toEqual([]);
  });
});

describe('what is left alone', () => {
  it('a module whose registry entry has no schema for it', () => {
    const { code, stripped } = strip(
      `import { defineConfigSchema } from '@openmrs/esm-framework';\n` +
        `export function startupApp() {\n  defineConfigSchema(moduleName, configSchema);\n}\n`,
      { hasModuleSchema: false },
    );

    expect(code).toContain('defineConfigSchema(moduleName, configSchema);');
    expect(stripped).toEqual([]);
  });

  it('a call naming some other module, which the registry entry does not cover', () => {
    const { code, stripped } = strip(
      `import { defineConfigSchema } from '@openmrs/esm-framework';\n` +
        `export function startupApp() {\n  defineConfigSchema('@openmrs/esm-other-app', schema);\n}\n`,
    );

    expect(code).toContain(`defineConfigSchema('@openmrs/esm-other-app', schema);`);
    expect(stripped).toEqual([]);
  });

  it('two module-schema calls, since neither can be shown to be the recorded one', () => {
    const { stripped } = strip(
      `import { defineConfigSchema } from '@openmrs/esm-framework';\n` +
        `export function startupApp() {\n` +
        `  defineConfigSchema(moduleName, configSchema);\n` +
        `  defineConfigSchema(otherName, otherSchema);\n` +
        `}\n`,
    );

    expect(stripped).toEqual([]);
  });

  it('a binding that is passed around rather than only called', () => {
    // Once it escapes, the calls visible here may not be all of them.
    const { code, stripped } = strip(
      `import { defineConfigSchema } from '@openmrs/esm-framework';\n` +
        `const define = defineConfigSchema;\n` +
        `export function startupApp() {\n  defineConfigSchema(moduleName, configSchema);\n}\n`,
    );

    expect(code).toContain('defineConfigSchema(moduleName, configSchema);');
    expect(stripped).toEqual([]);
  });

  it('a call whose result is used', () => {
    const { stripped } = strip(
      `import { defineConfigSchema } from '@openmrs/esm-framework';\n` +
        `export const result = defineConfigSchema(moduleName, configSchema);\n`,
    );

    expect(stripped).toEqual([]);
  });

  it('a name that comes from somewhere other than the framework', () => {
    const { code, stripped } = strip(
      `import { defineConfigSchema } from './my-own-helpers';\n` +
        `export function startupApp() {\n  defineConfigSchema(moduleName, configSchema);\n}\n`,
    );

    expect(code).toBe(
      `import { defineConfigSchema } from './my-own-helpers';\n` +
        `export function startupApp() {\n  defineConfigSchema(moduleName, configSchema);\n}\n`,
    );
    expect(stripped).toEqual([]);
  });

  it('a module that declares no schema at all', () => {
    const source = `import { getSyncLifecycle } from '@openmrs/esm-framework';\nexport const root = getSyncLifecycle(c, o);\n`;

    expect(strip(source).code).toBe(source);
  });

  it('a first argument that is spread, which hides what is being configured', () => {
    const { stripped } = strip(
      `import { defineExtensionConfigSchema } from '@openmrs/esm-framework';\n` +
        `export function startupApp() {\n  defineExtensionConfigSchema(...args);\n}\n`,
    );

    expect(stripped).toEqual([]);
  });
});

describe('sources that the offsets have to survive', () => {
  it('a file that starts with comments and blank lines', () => {
    // swc's offsets run from a counter that climbs across parses, and a program's span starts at
    // its first token, so leading trivia is exactly what throws naive offset arithmetic out.
    const { code } = strip(
      `/**\n * A licence header.\n */\n\n// and a note\n\n` +
        `import { defineConfigSchema } from '@openmrs/esm-framework';\n` +
        `export function startupApp() {\n  defineConfigSchema(moduleName, configSchema);\n}\n`,
    );

    expect(code).toContain('__openmrs_requireStaticConfigSchema(moduleName);');
    expect(code).toContain('A licence header.');
  });

  it('characters that are more than one byte', () => {
    // swc reports spans in bytes and MagicString indexes in UTF-16 code units, so anything
    // non-ASCII ahead of the call puts the two out of step. Every character here has a different
    // encoded width, and the accented ones appear after the call as well so that a mapping that
    // drifts in either direction shows up.
    const { code, stripped } = strip(
      `// café ☕ 🚀\n` +
        `import { defineConfigSchema } from '@openmrs/esm-framework';\n` +
        `const gruß = 'días';\n` +
        `export function startupApp() {\n  defineConfigSchema(moduleName, configSchema);\n}\n` +
        `export const note = 'naïve';\n`,
    );

    expect(stripped).toEqual(['defineConfigSchema(...)']);
    expect(code).toContain('__openmrs_requireStaticConfigSchema(moduleName);');
    expect(code).not.toContain('configSchema');
    expect(code).toContain(`const gruß = 'días';`);
    expect(code).toContain(`export const note = 'naïve';`);
  });

  it('an aliased import', () => {
    const { code } = strip(
      `import { defineConfigSchema as declareSchema } from '@openmrs/esm-framework';\n` +
        `export function startupApp() {\n  declareSchema(moduleName, configSchema);\n}\n`,
    );

    expect(code).toContain('__openmrs_requireStaticConfigSchema(moduleName);');
    expect(code).not.toContain('declareSchema(moduleName, configSchema)');
  });

  it('a call written across several lines', () => {
    const { code } = strip(
      `import { defineConfigSchema } from '@openmrs/esm-framework';\n` +
        `export function startupApp() {\n` +
        `  defineConfigSchema(\n    moduleName,\n    configSchema,\n  );\n` +
        `}\n`,
    );

    expect(code).toContain('__openmrs_requireStaticConfigSchema(\n    moduleName)');
    expect(code).not.toContain('configSchema');
  });

  it('TSX, which needs a different parser configuration', () => {
    const result = stripSchemaCalls(
      `import { defineConfigSchema } from '@openmrs/esm-framework';\n` +
        `const element = <div className="x" />;\n` +
        `export function startupApp() {\n  defineConfigSchema(moduleName, configSchema);\n}\n`,
      'index.tsx',
      plan,
    );

    expect(result.code).toContain('__openmrs_requireStaticConfigSchema(moduleName);');
    expect(result.code).toContain('<div className="x" />');
  });
});
