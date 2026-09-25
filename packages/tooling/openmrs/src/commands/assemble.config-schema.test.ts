// Covers merging each frontend module's `config-schema.json` build artifact into its entry in the
// routes registry, which is how a distribution learns every module's configuration without loading
// any of them.
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('node:fs/promises', () => ({
  readFile: vi.fn(),
  writeFile: vi.fn(),
  mkdir: vi.fn(),
  rm: vi.fn(),
}));

vi.mock('node:fs', () => ({
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
}));

vi.mock('npm-registry-fetch', () => ({ default: { json: vi.fn() } }));
vi.mock('pacote', () => ({ default: { manifest: vi.fn(), tarball: vi.fn() } }));

vi.mock('../utils', () => ({
  contentHash: vi.fn(),
  logInfo: vi.fn(),
  logWarn: vi.fn(),
  untar: vi.fn(),
}));

vi.mock('../utils/npmConfig', () => ({
  getNpmRegistryConfiguration: vi.fn().mockReturnValue({}),
}));

import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import pacote from 'pacote';
import { logWarn, untar } from '../utils';
import { getNpmRegistryConfiguration } from '../utils/npmConfig';
import { runAssemble, type AssembleArgs } from './assemble';

const mockReadFile = vi.mocked(readFile);
const mockWriteFile = vi.mocked(writeFile);
const mockExistsSync = vi.mocked(existsSync);
const mockUntar = vi.mocked(untar);
const mockLogWarn = vi.mocked(logWarn);

const configPath = '/path/to/config.json';

interface FakeModule {
  name: string;
  routes?: object;
  /** The contents of the module's `config-schema.json`, or a raw string for a malformed one. */
  configSchema?: object | string;
}

function defaultArgs(overrides: Partial<AssembleArgs> = {}): AssembleArgs {
  return {
    target: '/tmp/test-output',
    mode: 'config',
    config: [configPath],
    configFiles: [],
    hashFiles: false,
    fresh: false,
    buildRoutes: true,
    manifest: false,
    ensureEntrypoints: false,
    strictSchemas: false,
    ...overrides,
  };
}

/** Directory name assemble untars a package into, which is how its files are addressed. */
function directoryOf(name: string) {
  return `${name.replace(/^@/, '').replace(/\//, '-')}-1.0.0`;
}

function setupRun(modules: Array<FakeModule>) {
  const config = {
    frontendModules: Object.fromEntries(modules.map((module) => [module.name, '1.0.0'])),
    publicUrl: '.',
  };

  const fileFor = (path: string) =>
    modules.find((module) => path.includes(directoryOf(module.name)) && path.endsWith('config-schema.json'));
  const routesFor = (path: string) =>
    modules.find((module) => path.includes(directoryOf(module.name)) && path.endsWith('routes.json'));

  mockExistsSync.mockImplementation((p) => {
    const path = String(p);

    if (path === configPath || path.endsWith('main.js')) {
      return true;
    }

    if (path.endsWith('config-schema.json')) {
      return Boolean(fileFor(path)?.configSchema);
    }

    if (path.endsWith('routes.json')) {
      return Boolean(routesFor(path)?.routes);
    }

    return false;
  });

  mockReadFile.mockImplementation((p) => {
    const path = String(p);

    if (path === configPath) {
      return Promise.resolve(JSON.stringify(config));
    }

    if (path.endsWith('config-schema.json')) {
      const schema = fileFor(path)?.configSchema;
      return Promise.resolve(typeof schema === 'string' ? schema : JSON.stringify(schema));
    }

    if (path.endsWith('routes.json')) {
      return Promise.resolve(JSON.stringify(routesFor(path)?.routes));
    }

    return Promise.reject(new Error(`Unexpected readFile call: ${path}`));
  });

  vi.mocked(pacote.manifest).mockResolvedValue({
    _resolved: 'https://registry.npmjs.org/fake.tgz',
    _integrity: 'sha512-fake',
  } as never);
  vi.mocked(pacote.tarball).mockResolvedValue(Buffer.from('tarball') as never);

  mockUntar.mockImplementation((buffer) => {
    void buffer;
    // Every module in a run untars to the same shape; which one is being read is decided by the
    // path, above.
    return Promise.resolve({
      'package/package.json': Buffer.from(JSON.stringify({ name: 'x', version: '1.0.0', main: 'dist/main.js' })),
      'package/dist/main.js': Buffer.from('export default {};'),
    }) as never;
  });
}

function writtenRegistry() {
  const write = mockWriteFile.mock.calls.find(([path]) => String(path).endsWith('routes.registry.json'));

  if (!write) {
    throw new Error('assemble wrote no routes registry');
  }

  return JSON.parse(String(write[1])).routes;
}

const schemaFor = (label: string) => ({
  configurationSchema: { label: { _type: 'String', _default: label } },
});

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getNpmRegistryConfiguration).mockReturnValue({});
});

describe('merging config schemas into the routes registry', () => {
  it("puts a module's schema in its own registry entry", async () => {
    setupRun([{ name: '@openmrs/esm-a', routes: { pages: [] }, configSchema: schemaFor('A') }]);

    await runAssemble(defaultArgs());

    expect(writtenRegistry()['@openmrs/esm-a'].configurationSchema).toEqual({
      label: { _type: 'String', _default: 'A' },
    });
  });

  it('leaves the entry alone when a module ships no schema', async () => {
    // A module with no configuration is ordinary. It keeps being configured the old way.
    setupRun([{ name: '@openmrs/esm-a', routes: { pages: [] } }]);

    await runAssemble(defaultArgs());

    const entry = writtenRegistry()['@openmrs/esm-a'];

    expect(entry).toBeDefined();
    expect(entry).not.toHaveProperty('configurationSchema');
    expect(entry).not.toHaveProperty('extensionConfigurationSchemas');
  });

  it('carries extension schemas alongside the module schema', async () => {
    setupRun([
      {
        name: '@openmrs/esm-a',
        routes: { pages: [] },
        configSchema: {
          ...schemaFor('A'),
          extensionConfigurationSchemas: { 'ext-one': { size: { _type: 'Number', _default: 1 } } },
        },
      },
    ]);

    await runAssemble(defaultArgs());

    expect(writtenRegistry()['@openmrs/esm-a'].extensionConfigurationSchemas).toEqual({
      'ext-one': { size: { _type: 'Number', _default: 1 } },
    });
  });
});

describe('two modules defining a schema for the same extension name', () => {
  const colliding: Array<FakeModule> = [
    {
      name: '@openmrs/esm-a',
      routes: { pages: [] },
      configSchema: { extensionConfigurationSchemas: { shared: { from: { _type: 'String', _default: 'a' } } } },
    },
    {
      name: '@openmrs/esm-b',
      routes: { pages: [] },
      configSchema: { extensionConfigurationSchemas: { shared: { from: { _type: 'String', _default: 'b' } } } },
    },
  ];

  it('keeps the first and warns about the second', async () => {
    // First-wins is what makes the outcome stable: adding a module never changes how an existing
    // one is configured.
    setupRun(colliding);

    await runAssemble(defaultArgs());

    const registry = writtenRegistry();

    expect(registry['@openmrs/esm-a'].extensionConfigurationSchemas.shared).toEqual({
      from: { _type: 'String', _default: 'a' },
    });
    expect(registry['@openmrs/esm-b']).not.toHaveProperty('extensionConfigurationSchemas');
    expect(mockLogWarn.mock.calls.flat().join('\n')).toMatch(/'shared'/);
  });

  it('fails the run under --strict-schemas', async () => {
    setupRun(colliding);

    await expect(runAssemble(defaultArgs({ strictSchemas: true }))).rejects.toThrow(/shared/);
  });
});

describe('a config-schema.json that cannot be parsed', () => {
  const malformed: Array<FakeModule> = [{ name: '@openmrs/esm-a', routes: { pages: [] }, configSchema: '{ not json' }];

  it('warns and leaves the module without a static schema', async () => {
    setupRun(malformed);

    await runAssemble(defaultArgs());

    expect(writtenRegistry()['@openmrs/esm-a']).not.toHaveProperty('configurationSchema');
    expect(mockLogWarn.mock.calls.flat().join('\n')).toMatch(/configuration schema for @openmrs\/esm-a/);
  });

  it('fails the run under --strict-schemas', async () => {
    setupRun(malformed);

    await expect(runAssemble(defaultArgs({ strictSchemas: true }))).rejects.toThrow(/configuration schema/);
  });

  it('does not stop the module from being assembled', async () => {
    // The module still runs; it is only its static configuration that is lost.
    setupRun(malformed);

    await runAssemble(defaultArgs());

    expect(writtenRegistry()['@openmrs/esm-a']).toBeDefined();
  });
});

describe('a config-schema.json whose shape the framework would reject', () => {
  // The framework validates a registry entry as a whole, so a schema it rejects would cost the
  // module its pages and extensions too. Leaving the schema out keeps the cost to what the comment
  // in assemble.ts promises: a module with an unreadable schema still runs.
  it('leaves out a configurationSchema that is not an object, keeping the rest of the entry', async () => {
    setupRun([
      {
        name: '@openmrs/esm-a',
        routes: { pages: [{ component: 'root', route: 'a' }] },
        configSchema: { configurationSchema: ['not', 'an', 'object'] },
      },
    ]);

    await runAssemble(defaultArgs());

    const entry = writtenRegistry()['@openmrs/esm-a'];

    expect(entry).not.toHaveProperty('configurationSchema');
    expect(entry.pages).toHaveLength(1);
    expect(mockLogWarn.mock.calls.flat().join('\n')).toMatch(/not an object/);
  });

  it('leaves out an extension schema that is not an object', async () => {
    setupRun([
      {
        name: '@openmrs/esm-a',
        routes: { pages: [] },
        configSchema: { extensionConfigurationSchemas: { good: { a: { _type: 'String' } }, bad: 'nope' } },
      },
    ]);

    await runAssemble(defaultArgs());

    expect(Object.keys(writtenRegistry()['@openmrs/esm-a'].extensionConfigurationSchemas)).toEqual(['good']);
  });

  it('fails the run under --strict-schemas', async () => {
    setupRun([{ name: '@openmrs/esm-a', routes: { pages: [] }, configSchema: { configurationSchema: [] } }]);

    await expect(runAssemble(defaultArgs({ strictSchemas: true }))).rejects.toThrow(/not an object/);
  });

  it('says so when the extension schemas are not a map at all', () => {
    // The one rejection in this pass that used to be silent, which made `--strict-schemas` pass on
    // a file whose every extension schema had just been dropped.
    setupRun([
      { name: '@openmrs/esm-a', routes: { pages: [] }, configSchema: { extensionConfigurationSchemas: 'oops' } },
    ]);

    return expect(runAssemble(defaultArgs({ strictSchemas: true }))).rejects.toThrow(/extension configuration schemas/);
  });

  it('keeps an extension named __proto__ as an ordinary key', async () => {
    // Extension names come out of a downloaded package, and plain assignment would set the
    // prototype of the object being built rather than adding a key, losing the schema silently.
    setupRun([
      {
        name: '@openmrs/esm-a',
        routes: { pages: [] },
        configSchema: JSON.parse('{"extensionConfigurationSchemas": {"__proto__": {"a": {"_type": "String"}}}}'),
      },
    ]);

    await runAssemble(defaultArgs());

    const schemas = writtenRegistry()['@openmrs/esm-a'].extensionConfigurationSchemas;

    expect(Object.keys(schemas ?? {})).toEqual(['__proto__']);
    // Still the schema and not `Object.prototype`, which is what reading it back would give if
    // anything along the way had assigned rather than defined it.
    expect(Object.hasOwn(schemas, '__proto__')).toBe(true);
    expect(schemas['__proto__']).toEqual({ a: { _type: 'String' } });
  });
});

describe('a run with both entrypoints and schemas to complain about', () => {
  it('reports both, so one run names everything that has to be fixed', async () => {
    // Failing on the entrypoints first would hide every schema problem behind a second run.
    // No routes file, which is reported as a missing entrypoint, and a schema that will not parse.
    setupRun([{ name: '@openmrs/esm-a', configSchema: '{ not json' }]);

    await expect(runAssemble(defaultArgs({ strictSchemas: true, ensureEntrypoints: true }))).rejects.toThrow(
      /entrypoints[\s\S]*configuration schemas/,
    );
  });
});
