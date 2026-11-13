// Checks that a real build emits a module's `config-schema.json`, and that it says what the
// module's `startupApp()` actually declared.
//
// These go through genuine rspack *and* webpack builds because the plugin runs a second compilation
// derived from the first. Everything it has to survive is in the fixture rather than described
// here: `require.context`, a stylesheet import, a schema composed from an imported constant.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { buildFixtureApp, cleanUpFixtureBuilds, fixtureRootOf } from './build-fixture';

const bundlers = ['rspack', 'webpack'] as const;

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
    // Extraction is a second compilation, and a default can be written in terms of something the
    // bundler replaces. Reading `process.env.NODE_ENV` as 'development' in a production build, or
    // losing a `DefinePlugin` value entirely, puts a value in the registry that the module never
    // declared, and nothing downstream can tell.
    //
    // Built in both modes, development first, because the extraction cache is one file per module
    // shared across modes: a key that does not distinguish them serves the development answer to
    // the production build, which is what `yarn start` followed by `yarn build` does.
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
    // The point of lifting rather than referring back: loading a validator costs this entry point's
    // own chunk, not the module's bundle, and runs nothing twice.
    await buildFixtureApp(bundler, 'production', 'config-schema-app');

    const generatedModule = readFileSync(
      join(fixtureRootOf('config-schema-app'), 'node_modules', '.cache', 'openmrs', 'config-validators.generated.js'),
      'utf8',
    );

    expect(generatedModule).not.toContain('src/index');
    expect(generatedModule).not.toContain('startupApp');
    expect(generatedModule).not.toContain('recordConfigSchemas');
  });

  it('produces the same artifact from either bundler', async () => {
    // The child compilation is derived from whichever build is running, so the two paths are
    // genuinely different code. They must not disagree about what a module's configuration is.
    const [fromRspack, fromWebpack] = await Promise.all([
      buildFixtureApp('rspack', 'production', 'config-schema-app'),
      buildFixtureApp('webpack', 'production', 'config-schema-app'),
    ]);

    expect(artifactOf(fromRspack)).toEqual(artifactOf(fromWebpack));
  });
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
    // The fixture's default is a Date, which JSON would quietly turn into a string. A module
    // configured with a string where it declared a Date is a worse outcome than a failed build.
    await expect(buildFixtureApp(bundler, 'production', 'broken-schema-app')).rejects.toThrow(/JSON cannot represent/);
  });
});

describe.each(bundlers)('%s: an inline validator that reads its module', (bundler) => {
  it('fails the build, naming what it reads and where to put it', async () => {
    // Lifting it would drop the constant it depends on, and the validator would throw the first
    // time an implementer's configuration reached it. This is the guard that makes transposition
    // safe to do silently in every other case.
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
    // The point of the whole exercise: the schemas travel in routes.registry.json, so the module
    // should not be carrying a second copy. Schema keys are the giveaway, since minification cannot
    // rename an object's own property names.
    const chunk = entryChunkOf(await buildFixtureApp(bundler, 'production', 'config-schema-app'));

    expect(chunk).not.toContain('_description');
    expect(chunk).not.toContain('_default');
    expect(chunk).not.toContain('A label');
  });

  it('still records both schemas, so the rewrite has not blinded extraction', async () => {
    // The rewrite and the extraction read the same file, and extraction has to see it as written.
    // If its build ever inherited the rewriting loader, this artifact would come back empty.
    const artifact = artifactOf(await buildFixtureApp(bundler, 'production', 'config-schema-app'));

    expect(Object.keys(artifact.configurationSchema)).toContain('label');
    expect(artifact.extensionConfigurationSchemas).toHaveProperty('fixture-extension');
  });

  it('replaces each declaration with an assertion, keeping what was being configured', async () => {
    // Replaced rather than deleted, because a module whose registry entry lost its schema would
    // otherwise be configured by the implicit schema, which applies no defaults, and say nothing.
    // Read in development, where the names survive to be read; across every chunk, because in
    // development the entry point is split across more than one.
    const build = await buildFixtureApp(bundler, 'development', 'config-schema-app');
    const code = Object.values(build.scripts).join('\n');

    expect(code).toMatch(/requireStaticConfigSchema\)?\(\s*moduleName\s*\)/);
    expect(code).toMatch(/requireStaticExtensionConfigSchema\)?\(\s*['"]fixture-extension['"]\s*\)/);

    // Deliberately no assertion that the original call is absent: a development build embeds the
    // original source in its source map, which is exactly what should happen. Whether the schema
    // itself survives into the shipped code is settled on the production build above.
  });

  it('leaves a module whose schema it did not extract alone', async () => {
    // Nothing is extracted for a hand-written schema, so nothing can prove a declaration redundant
    // and the module goes on declaring whatever it declares.
    //
    // Asserted as the inverse of the first test in this block, on the schema the fixture declares
    // rather than on the name of the call. A rewritten call drops the only reference to the schema
    // object, so the schema surviving is what says the call was left alone; the marker's own name
    // is no use here, since the framework bundle defines it whether or not anything calls it.
    const chunk = entryChunkOf(await buildFixtureApp(bundler, 'production', 'hand-written-schema-app'));

    expect(chunk).toContain('_default');
    expect(chunk).toContain('Hand written');
  });
});
