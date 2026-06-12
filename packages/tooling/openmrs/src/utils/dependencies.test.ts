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
