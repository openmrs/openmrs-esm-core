import { describe, expect, it, vi } from 'vitest';
import type { Stats } from 'node:fs';

vi.mock('node:fs', () => ({
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
  statSync: vi.fn(),
}));

import { existsSync, readFileSync, statSync } from 'node:fs';
import { getMainBundle, getAppRoutes } from './dependencies';
import type { PackageJson } from './types';

const mockExistsSync = vi.mocked(existsSync);
const mockReadFileSync = vi.mocked(readFileSync);
const mockStatSync = vi.mocked(statSync);

function fakeStats(overrides: Partial<Stats> = {}): Stats {
  return {
    isFile: () => false,
    isDirectory: () => false,
    isBlockDevice: () => false,
    isCharacterDevice: () => false,
    isSymbolicLink: () => false,
    isFIFO: () => false,
    isSocket: () => false,
    dev: 0,
    ino: 0,
    mode: 0,
    nlink: 0,
    uid: 0,
    gid: 0,
    rdev: 0,
    size: 0,
    blksize: 0,
    blocks: 0,
    atimeMs: 0,
    mtimeMs: 0,
    ctimeMs: 0,
    birthtimeMs: 0,
    atime: new Date(0),
    mtime: new Date(0),
    ctime: new Date(0),
    birthtime: new Date(0),
    ...overrides,
  };
}

function pkg(overrides: Partial<PackageJson> = {}): PackageJson {
  return { name: '@openmrs/esm-test', ...overrides };
}

describe('getMainBundle', () => {
  it('returns info from project.browser when present', () => {
    const result = getMainBundle(pkg({ browser: 'dist/bundle.js', module: 'dist/esm.js', main: 'dist/cjs.js' }));
    expect(result).toEqual({ path: 'dist/bundle.js', name: 'bundle.js', dir: 'dist' });
  });

  it('falls back to project.module when browser is absent', () => {
    const result = getMainBundle(pkg({ module: 'dist/esm.js', main: 'dist/cjs.js' }));
    expect(result).toEqual({ path: 'dist/esm.js', name: 'esm.js', dir: 'dist' });
  });

  it('falls back to project.main when both browser and module are absent', () => {
    const result = getMainBundle(pkg({ main: 'dist/cjs.js' }));
    expect(result).toEqual({ path: 'dist/cjs.js', name: 'cjs.js', dir: 'dist' });
  });

  it('throws when none of browser, module, or main are present', () => {
    expect(() => getMainBundle(pkg())).toThrow();
  });
});

describe('getAppRoutes', () => {
  it('reads and parses routes.json with an incremented prerelease version', () => {
    mockExistsSync.mockReturnValue(true);
    mockStatSync.mockReturnValue(fakeStats({ isFile: () => true }));
    mockReadFileSync.mockReturnValue('{"pages":["/home"]}');

    const result = getAppRoutes('/src/project', pkg({ version: '1.0.0' }));

    expect(result.pages).toEqual(['/home']);
    // semver.inc('1.0.0', 'prerelease', 'local') => '1.0.1-local.0'
    expect(result.version).toBe('1.0.1-local.0');
  });

  it('returns an empty object when routes.json does not exist', () => {
    mockExistsSync.mockReturnValue(false);

    const result = getAppRoutes('/src/project', pkg({ version: '1.0.0' }));

    expect(result).toEqual({});
  });

  it('returns an empty object when the path is not a file', () => {
    mockExistsSync.mockReturnValue(true);
    mockStatSync.mockReturnValue(fakeStats({ isFile: () => false }));

    const result = getAppRoutes('/src/project', pkg({ version: '1.0.0' }));

    expect(result).toEqual({});
  });

  it('sets version to undefined when project.version is falsy', () => {
    mockExistsSync.mockReturnValue(true);
    mockStatSync.mockReturnValue(fakeStats({ isFile: () => true }));
    mockReadFileSync.mockReturnValue('{"pages":[]}');

    const result = getAppRoutes('/src/project', pkg());

    expect(result.version).toBeUndefined();
  });
});

describe('getAppRoutes and configuration schemas', () => {
  const routesPath = '/src/project/src/routes.json';
  const handWrittenPath = '/src/project/src/config-schema.json';
  const extractedPath = '/src/project/node_modules/.cache/openmrs/config-schema.json';

  const artifact = JSON.stringify({
    configurationSchema: { greeting: { _type: 'String', _default: 'hello' } },
    extensionConfigurationSchemas: { 'foo-link': { size: { _type: 'String', _default: 'small' } } },
  });

  /** Serves each of the files that make up an entry, and reports the rest as absent. */
  function onDisk(files: Record<string, string>) {
    mockStatSync.mockReturnValue(fakeStats({ isFile: () => true }));
    mockExistsSync.mockImplementation((path) => Object.hasOwn(files, String(path)));
    mockReadFileSync.mockImplementation((path) => files[String(path)]);
  }

  it('merges the schema a module extracted at build time into its entry', () => {
    onDisk({ [routesPath]: '{"pages":[]}', [extractedPath]: artifact });

    const result = getAppRoutes('/src/project', pkg({ version: '1.0.0' }));

    expect(result.configurationSchema).toEqual({ greeting: { _type: 'String', _default: 'hello' } });
    expect(result.extensionConfigurationSchemas).toEqual({
      'foo-link': { size: { _type: 'String', _default: 'small' } },
    });
  });

  it('prefers a hand-written schema, which is the one that module never extracts', () => {
    onDisk({
      [routesPath]: '{"pages":[]}',
      [handWrittenPath]: '{"configurationSchema":{"greeting":{"_type":"String","_default":"by hand"}}}',
      [extractedPath]: artifact,
    });

    const result = getAppRoutes('/src/project', pkg({ version: '1.0.0' }));

    expect(result.configurationSchema).toEqual({ greeting: { _type: 'String', _default: 'by hand' } });
  });

  it('leaves the entry alone when the module has no schema', () => {
    onDisk({ [routesPath]: '{"pages":[]}' });

    const result = getAppRoutes('/src/project', pkg({ version: '1.0.0' }));

    expect(result).not.toHaveProperty('configurationSchema');
    expect(result).not.toHaveProperty('extensionConfigurationSchemas');
  });

  it('serves the routes anyway when the schema cannot be parsed', () => {
    // Worth serving a module configured the old way rather than refusing to serve it at all.
    onDisk({ [routesPath]: '{"pages":["/home"]}', [extractedPath]: 'not json' });

    const result = getAppRoutes('/src/project', pkg({ version: '1.0.0' }));

    expect(result.pages).toEqual(['/home']);
    expect(result).not.toHaveProperty('configurationSchema');
  });
});

describe('getAppRoutes and a schema the framework would reject', () => {
  const routesPath = '/src/project/src/routes.json';
  const handWrittenPath = '/src/project/src/config-schema.json';

  function onDisk(files: Record<string, string>) {
    mockStatSync.mockReturnValue(fakeStats({ isFile: () => true }));
    mockExistsSync.mockImplementation((path) => Object.hasOwn(files, String(path)));
    mockReadFileSync.mockImplementation((path) => files[String(path)]);
  }

  // The framework validates a registry entry as a whole, and the registry all or nothing, so an
  // entry it rejects costs every *other* module its pages too. Nothing may go in that it would
  // refuse. What is left out is per schema, matching what `openmrs assemble` does with the same
  // file: this is the preview of that, and the two disagreeing is worse than either alone.
  it('keeps the extension schemas that are objects and leaves out the one that is not', () => {
    onDisk({
      [routesPath]: '{"pages":[]}',
      [handWrittenPath]: JSON.stringify({
        extensionConfigurationSchemas: { good: { a: { _type: 'String' } }, bad: 'nope' },
      }),
    });

    const result = getAppRoutes('/src/project', pkg({ version: '1.0.0' }));

    expect(Object.keys(result.extensionConfigurationSchemas as object)).toEqual(['good']);
  });

  it('leaves out a configurationSchema that is not an object, keeping the rest of the entry', () => {
    onDisk({
      [routesPath]: '{"pages":["/home"]}',
      [handWrittenPath]: JSON.stringify({ configurationSchema: ['not', 'an', 'object'] }),
    });

    const result = getAppRoutes('/src/project', pkg({ version: '1.0.0' }));

    expect(result.pages).toEqual(['/home']);
    expect(result).not.toHaveProperty('configurationSchema');
  });

  it('serves the module anyway when its routes file is mid-edit', () => {
    // Re-derived from a file watcher whose callback nothing awaits, so a throw here would take the
    // dev server down rather than being reported.
    onDisk({ [routesPath]: '{"pages": [' });

    expect(() => getAppRoutes('/src/project', pkg({ version: '1.0.0' }))).not.toThrow();
  });
});
