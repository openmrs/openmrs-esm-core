// Checks that a real build emits a module's `config-schema.json` matching what its `startupApp()`
// declared. Real rspack and webpack builds, because the plugin runs a child compilation of each.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterAll, describe, expect, it, vi } from 'vitest';
import { buildFixtureApp, cleanUpFixtureBuilds, fixtureRootOf } from './build-fixture';

const bundlers = ['rspack', 'webpack'] as const;

// Every fixture imports `@openmrs/esm-framework`, so each first build compiles the whole framework.
// That takes several times the default on a busy CI runner.
vi.setConfig({ testTimeout: 60_000 });

afterAll(() => {
  cleanUpFixtureBuilds();
});

function artifactOf(build: { json: Record<string, string> }) {
  const raw = build.json['config-schema.json'];

  if (!raw) {
    throw new Error(`The build emitted no config-schema.json. Emitted: ${Object.keys(build.json).join(', ')}`);
  }

  return JSON.parse(raw);
}

describe.each(bundlers)('%s: extracting a schema from startupApp()', (bundler) => {
  it('writes the module schema, with built-in validators as references', async () => {
    const artifact = artifactOf(await buildFixtureApp(bundler, 'production', 'config-schema-app'));

    expect(artifact.configurationSchema).toMatchObject({
      label: {
        _type: 'String',
        _default: 'hello',
        _description: 'A label',
        _validators: [{ type: 'nonEmptyString' }],
      },
      count: { _type: 'Number', _default: 2, _validators: [{ type: 'greaterThan', args: [0] }] },
      nested: { mode: { _type: 'String', _default: 'a', _validators: [{ type: 'oneOf', args: [['a', 'b']] }] } },
    });
  });

  it('reads a default through the same compile-time definitions the real build uses', async () => {
    // Defaults can use values the bundler replaces, so extraction must see the parent build's
    // definitions. Development first, because the extraction cache is shared across modes and must
    // not serve the development answer to a production build.
    const development = artifactOf(await buildFixtureApp(bundler, 'development', 'config-schema-app'));
    const production = artifactOf(await buildFixtureApp(bundler, 'production', 'config-schema-app'));

    expect(development.configurationSchema.environment._default).toBe('development');
    expect(production.configurationSchema.environment._default).toBe('production');
    expect(production.configurationSchema.frameworkVersion._default).not.toBe('undefined');
  });

  it('writes extension schemas keyed by extension name', async () => {
    const artifact = artifactOf(await buildFixtureApp(bundler, 'production', 'config-schema-app'));

    expect(Object.keys(artifact.extensionConfigurationSchemas)).toEqual(['fixture-extension']);
    expect(artifact.extensionConfigurationSchemas['fixture-extension'].size).toMatchObject({
      _type: 'Number',
      _default: 1,
    });
  });

  it('refers to an exported custom validator by its export name', async () => {
    const artifact = artifactOf(await buildFixtureApp(bundler, 'production', 'config-schema-app'));

    expect(artifact.configurationSchema._validators).toEqual([{ type: 'custom', export: 'validateGreeting' }]);
  });

  it('lifts a custom validator written inline into the config-validators entry point', async () => {
    const build = await buildFixtureApp(bundler, 'production', 'config-schema-app');
    const artifact = artifactOf(build);

    // The extension's validator is written inline, so it has no export of its own to refer to.
    const [lifted] = artifact.extensionConfigurationSchemas['fixture-extension'].size._validators;

    expect(lifted).toEqual({ type: 'custom', export: 'validator1' });

    const generatedModule = readFileSync(
      join(fixtureRootOf('config-schema-app'), 'node_modules', '.cache', 'openmrs', 'config-validators.generated.js'),
      'utf8',
    );

    expect(generatedModule).toMatch(/export \* from .*config-validators/);
    // Written out as an ordinary call the bundler compiles, with the predicate's own source.
    expect(generatedModule).toMatch(/export const validator1 = validator\(/);
    expect(generatedModule).toMatch(/typeof value === ['"]number['"]/);
    expect(generatedModule).toMatch(/must be a number/);
  });

  it('leaves the config-validators entry point independent of the module it came from', async () => {
    // Loading a lifted validator costs this entry point's chunk, not the module's bundle.
    await buildFixtureApp(bundler, 'production', 'config-schema-app');

    const generatedModule = readFileSync(
      join(fixtureRootOf('config-schema-app'), 'node_modules', '.cache', 'openmrs', 'config-validators.generated.js'),
      'utf8',
    );

    expect(generatedModule).not.toContain('src/index');
    expect(generatedModule).not.toContain('startupApp');
    expect(generatedModule).not.toContain('recordConfigSchemas');
  });
});

it('produces the same artifact from either bundler', async () => {
  // The child compilation differs per bundler; the results must not.
  const [fromRspack, fromWebpack] = await Promise.all([
    buildFixtureApp('rspack', 'production', 'config-schema-app'),
    buildFixtureApp('webpack', 'production', 'config-schema-app'),
  ]);

  expect(artifactOf(fromRspack)).toEqual(artifactOf(fromWebpack));
});

describe.each(bundlers)('%s: a hand-written config-schema.json', (bundler) => {
  it('is shipped exactly as written', async () => {
    const build = await buildFixtureApp(bundler, 'production', 'hand-written-schema-app');
    const source = readFileSync(join(fixtureRootOf('hand-written-schema-app'), 'src', 'config-schema.json'), 'utf8');

    expect(build.json['config-schema.json']).toEqual(source);
  });

  it('still gets a ./config-validators expose, so its custom validator can resolve', async () => {
    // Nothing is extracted on this path, so the expose has to come from the authored file directly.
    const build = await buildFixtureApp(bundler, 'production', 'hand-written-schema-app');

    expect(build.entry).toMatch(/config-validators/);
  });
});

describe.each(bundlers)('%s: a schema that cannot be written down', (bundler) => {
  it('fails the build rather than shipping an artifact that disagrees with the module', async () => {
    // The fixture's default is a Date, which JSON would quietly turn into a string.
    await expect(buildFixtureApp(bundler, 'production', 'broken-schema-app')).rejects.toThrow(/JSON cannot represent/);
  });
});

describe.each(bundlers)('%s: an inline validator that reads its module', (bundler) => {
  it('fails the build, naming what it reads and where to put it', async () => {
    // Lifting it would drop the constant it reads, so it would throw at runtime.
    await expect(buildFixtureApp(bundler, 'production', 'capturing-validator-app')).rejects.toThrow(
      /`maximumLength`[\s\S]*src\/config-validators\.ts/,
    );
  });
});

describe.each(bundlers)('%s: the module stops declaring what the registry now carries', (bundler) => {
  /**
   * The chunk holding the module's own entry point, found by the one export name that survives
   * minification because it is part of the module's public shape.
   */
  function entryChunkOf(build: { scripts: Record<string, string> }) {
    const found = Object.entries(build.scripts).filter(([, code]) => code.includes('startupApp'));

    if (found.length !== 1) {
      throw new Error(`Expected exactly one chunk to define startupApp, found ${found.length}.`);
    }

    return found[0][1];
  }

  it('leaves no trace of either schema in the module that declared them', async () => {
    // The schemas travel in routes.registry.json, so the module shouldn't carry a second copy.
    // Schema keys survive minification, so they are the giveaway.
    const chunk = entryChunkOf(await buildFixtureApp(bundler, 'production', 'config-schema-app'));

    expect(chunk).not.toContain('_description');
    expect(chunk).not.toContain('_default');
    expect(chunk).not.toContain('A label');
  });

  it('still records both schemas, so the rewrite has not blinded extraction', async () => {
    // Extraction must see the entry point before it is rewritten, or this would come back empty.
    const artifact = artifactOf(await buildFixtureApp(bundler, 'production', 'config-schema-app'));

    expect(Object.keys(artifact.configurationSchema)).toContain('label');
    expect(artifact.extensionConfigurationSchemas).toHaveProperty('fixture-extension');
  });

  it('replaces each declaration with an assertion, keeping what was being configured', async () => {
    // Development, so the names survive minification; every chunk, because development splits
    // the entry point.
    const build = await buildFixtureApp(bundler, 'development', 'config-schema-app');
    const code = Object.values(build.scripts).join('\n');

    expect(code).toMatch(/requireStaticConfigSchema\)?\(\s*moduleName\s*\)/);
    expect(code).toMatch(/requireStaticExtensionConfigSchema\)?\(\s*['"]fixture-extension['"]\s*\)/);

    // No assertion that the original call is absent: the development source map embeds it.
  });

  it('leaves a module whose schema it did not extract alone', async () => {
    // Checked by the schema surviving, not the marker's name, which the framework bundle defines
    // whether or not anything calls it.
    const chunk = entryChunkOf(await buildFixtureApp(bundler, 'production', 'hand-written-schema-app'));

    expect(chunk).toContain('_default');
    expect(chunk).toContain('Hand written');
  });
});
