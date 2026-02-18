import { describe, expect, it, vi } from 'vitest';

vi.mock('node:fs', () => ({
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
  statSync: vi.fn(),
}));

import { existsSync, readFileSync, statSync } from 'node:fs';
import { getMainBundle, getAppRoutes } from './dependencies';

const mockExistsSync = vi.mocked(existsSync);
const mockReadFileSync = vi.mocked(readFileSync);
const mockStatSync = vi.mocked(statSync);

describe('getMainBundle', () => {
  it('returns info from project.browser when present', () => {
    const result = getMainBundle({ browser: 'dist/bundle.js', module: 'dist/esm.js', main: 'dist/cjs.js' });
    expect(result).toEqual({ path: 'dist/bundle.js', name: 'bundle.js', dir: 'dist' });
  });

  it('falls back to project.module when browser is absent', () => {
    const result = getMainBundle({ module: 'dist/esm.js', main: 'dist/cjs.js' });
    expect(result).toEqual({ path: 'dist/esm.js', name: 'esm.js', dir: 'dist' });
  });

  it('falls back to project.main when both browser and module are absent', () => {
    const result = getMainBundle({ main: 'dist/cjs.js' });
    expect(result).toEqual({ path: 'dist/cjs.js', name: 'cjs.js', dir: 'dist' });
  });

  it('throws when none of browser, module, or main are present', () => {
    expect(() => getMainBundle({})).toThrow();
  });
});

describe('getAppRoutes', () => {
  it('reads and parses routes.json with an incremented prerelease version', () => {
    mockExistsSync.mockReturnValue(true);
    mockStatSync.mockReturnValue({ isFile: () => true } as any);
    mockReadFileSync.mockReturnValue('{"pages":["/home"]}');

    const result = getAppRoutes('/src/project', { version: '1.0.0' });

    expect(result.pages).toEqual(['/home']);
    // semver.inc('1.0.0', 'prerelease', 'local') => '1.0.1-local.0'
    expect(result.version).toBe('1.0.1-local.0');
  });

  it('returns an empty object when routes.json does not exist', () => {
    mockExistsSync.mockReturnValue(false);

    const result = getAppRoutes('/src/project', { version: '1.0.0' });

    expect(result).toEqual({});
  });

  it('returns an empty object when the path is not a file', () => {
    mockExistsSync.mockReturnValue(true);
    mockStatSync.mockReturnValue({ isFile: () => false } as any);

    const result = getAppRoutes('/src/project', { version: '1.0.0' });

    expect(result).toEqual({});
  });

  it('sets version to undefined when project.version is falsy', () => {
    mockExistsSync.mockReturnValue(true);
    mockStatSync.mockReturnValue({ isFile: () => true } as any);
    mockReadFileSync.mockReturnValue('{"pages":[]}');

    const result = getAppRoutes('/src/project', {});

    expect(result.version).toBeUndefined();
  });
});
