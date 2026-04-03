import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen } from '@inquirer/testing/vitest';

// Mock all external dependencies EXCEPT @inquirer/prompts
// (which is handled by @inquirer/testing/vitest to use real prompts with virtual I/O)

vi.mock('node:fs/promises', () => ({
  readFile: vi.fn(),
  writeFile: vi.fn(),
  mkdir: vi.fn(),
}));

vi.mock('node:fs', () => ({
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
}));

vi.mock('npm-registry-fetch', () => ({
  default: {
    json: vi.fn(),
  },
}));

vi.mock('pacote', () => ({
  default: {
    manifest: vi.fn(),
    tarball: vi.fn(),
  },
}));

vi.mock('../utils', () => ({
  contentHash: vi.fn(),
  logInfo: vi.fn(),
  logWarn: vi.fn(),
  untar: vi.fn(),
}));

vi.mock('../utils/npmConfig', () => ({
  getNpmRegistryConfiguration: vi.fn(),
}));

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import npmRegistryFetch from 'npm-registry-fetch';
import pacote from 'pacote';
import { untar } from '../utils';
import { getNpmRegistryConfiguration } from '../utils/npmConfig';
import { runAssemble, type AssembleArgs } from './assemble';

const mockReadFile: vi.Mock = vi.mocked(readFile);
const mockWriteFile: vi.Mock = vi.mocked(writeFile);
const mockExistsSync: vi.Mock = vi.mocked(existsSync);
const mockNpmFetchJson: vi.Mock = vi.mocked(npmRegistryFetch.json);
const mockPacoteManifest: vi.Mock = vi.mocked(pacote.manifest);
const mockPacoteTarball: vi.Mock = vi.mocked(pacote.tarball);
const mockUntar: vi.Mock = vi.mocked(untar);
const mockGetNpmRegistryConfiguration: vi.Mock = vi.mocked(getNpmRegistryConfiguration);

function defaultArgs(overrides: Partial<AssembleArgs> = {}): AssembleArgs {
  return {
    target: '/tmp/test-output',
    mode: 'survey',
    config: [],
    configFiles: [],
    hashFiles: false,
    fresh: false,
    buildRoutes: false,
    manifest: false,
    ...overrides,
  };
}

function fakeUntarResult(name: string, version: string, entryPath = 'dist/main.js') {
  return {
    'package/package.json': Buffer.from(JSON.stringify({ name, version, main: entryPath })),
    [`package/${entryPath}`]: Buffer.from('export default {};'),
  };
}

describe('assemble survey mode (integration with real @inquirer/prompts)', () => {
  beforeEach(() => {
    mockGetNpmRegistryConfiguration.mockReturnValue({});
  });

  it('checkbox prompt renders available packages and allows selection', async () => {
    mockNpmFetchJson.mockResolvedValue({
      objects: [
        { package: { name: '@openmrs/esm-home-app', version: '1.0.0' } },
        { package: { name: '@openmrs/esm-login-app', version: '2.0.0' } },
      ],
      total: 2,
    });

    // Set up download mocks for the selected package
    mockPacoteManifest.mockResolvedValue({
      _resolved: 'https://registry.npmjs.org/@openmrs/esm-home-app/-/esm-home-app-1.0.0.tgz',
      _integrity: 'sha512-test',
    });
    mockPacoteTarball.mockResolvedValue(Buffer.from('tarball'));
    mockUntar.mockResolvedValue(fakeUntarResult('@openmrs/esm-home-app', '1.0.0'));
    mockExistsSync.mockReturnValue(false);

    const resultPromise = runAssemble(defaultArgs());

    // Wait for the checkbox prompt to render
    await screen.next();
    expect(screen.getScreen()).toContain('Select frontend modules to include');
    expect(screen.getScreen()).toContain('@openmrs/esm-home-app');
    expect(screen.getScreen()).toContain('@openmrs/esm-login-app');

    // Select the first package (cursor starts on first item)
    screen.keypress('space');
    // Submit the selection
    screen.keypress('enter');

    // Wait for the version input prompt
    await screen.next();
    expect(screen.getScreen()).toContain('Version for');
    expect(screen.getScreen()).toContain('@openmrs/esm-home-app');

    // Accept the default version by pressing enter
    screen.keypress('enter');

    await resultPromise;

    // The selected package should have been downloaded with its default version
    expect(mockPacoteManifest).toHaveBeenCalledWith('@openmrs/esm-home-app@1.0.0', expect.any(Object));
  });

  it('selecting no packages in checkbox produces an empty import map', async () => {
    mockNpmFetchJson.mockResolvedValue({
      objects: [{ package: { name: '@openmrs/esm-home-app', version: '1.0.0' } }],
      total: 1,
    });

    const resultPromise = runAssemble(defaultArgs());

    // Wait for the checkbox prompt
    await screen.next();
    expect(screen.getScreen()).toContain('Select frontend modules');

    // Submit without selecting anything
    screen.keypress('enter');

    await resultPromise;

    // No packages should have been downloaded
    expect(mockPacoteManifest).not.toHaveBeenCalled();

    // Import map should be empty
    const importmapWrite = mockWriteFile.mock.calls.find(([path]) => String(path).endsWith('importmap.json'));
    expect(importmapWrite).toBeDefined();
    const importmap = JSON.parse(importmapWrite![1] as string);
    expect(importmap.imports).toEqual({});
  });

  it('input prompt accepts a custom version', async () => {
    mockNpmFetchJson.mockResolvedValue({
      objects: [{ package: { name: '@openmrs/esm-home-app', version: '1.0.0' } }],
      total: 1,
    });

    mockPacoteManifest.mockResolvedValue({
      _resolved: 'https://r.test/app.tgz',
      _integrity: 'sha512-test',
    });
    mockPacoteTarball.mockResolvedValue(Buffer.from('tarball'));
    mockUntar.mockResolvedValue(fakeUntarResult('@openmrs/esm-home-app', '2.0.0'));
    mockExistsSync.mockReturnValue(false);

    const resultPromise = runAssemble(defaultArgs());

    // Wait for checkbox
    await screen.next();

    // Select the package
    screen.keypress('space');
    screen.keypress('enter');

    // Wait for version input
    await screen.next();

    // Type a custom version (clear default first with backspace, or just type)
    screen.type('2.0.0');
    screen.keypress('enter');

    await resultPromise;

    // Should download the user-specified version
    expect(mockPacoteManifest).toHaveBeenCalledWith('@openmrs/esm-home-app@2.0.0', expect.any(Object));
  });

  it('input prompt rejects invalid semver and re-prompts', async () => {
    mockNpmFetchJson.mockResolvedValue({
      objects: [{ package: { name: '@openmrs/esm-home-app', version: '1.0.0' } }],
      total: 1,
    });

    mockPacoteManifest.mockResolvedValue({
      _resolved: 'https://r.test/app.tgz',
      _integrity: 'sha512-test',
    });
    mockPacoteTarball.mockResolvedValue(Buffer.from('tarball'));
    mockUntar.mockResolvedValue(fakeUntarResult('@openmrs/esm-home-app', '1.0.0'));
    mockExistsSync.mockReturnValue(false);

    const resultPromise = runAssemble(defaultArgs());

    // Wait for checkbox
    await screen.next();

    // Select and submit
    screen.keypress('space');
    screen.keypress('enter');

    // Wait for version input
    await screen.next();

    // Type an invalid version
    screen.type('not-a-version');
    screen.keypress('enter');

    // Wait for validation error to appear
    await screen.next();
    expect(screen.getScreen()).toContain('does not appear to be a valid semver');

    // Clear the invalid input and type a valid version
    // ctrl+u clears the line in @inquirer/prompts input
    screen.keypress({ name: 'u', ctrl: true });
    screen.type('1.0.0');
    screen.keypress('enter');

    await resultPromise;

    expect(mockPacoteManifest).toHaveBeenCalledWith('@openmrs/esm-home-app@1.0.0', expect.any(Object));
  });

  it('selecting multiple packages prompts for version of each', async () => {
    mockNpmFetchJson.mockResolvedValue({
      objects: [
        { package: { name: '@openmrs/esm-home-app', version: '1.0.0' } },
        { package: { name: '@openmrs/esm-login-app', version: '2.0.0' } },
      ],
      total: 2,
    });

    mockPacoteManifest.mockResolvedValue({
      _resolved: 'https://r.test/app.tgz',
      _integrity: 'sha512-test',
    });
    mockPacoteTarball.mockResolvedValue(Buffer.from('tarball'));
    mockUntar
      .mockResolvedValueOnce(fakeUntarResult('@openmrs/esm-home-app', '1.0.0'))
      .mockResolvedValueOnce(fakeUntarResult('@openmrs/esm-login-app', '2.0.0'));
    mockExistsSync.mockReturnValue(false);

    const resultPromise = runAssemble(defaultArgs());

    // Wait for checkbox
    await screen.next();

    // Select first item, move down, select second item
    screen.keypress('space');
    screen.keypress('down');
    screen.keypress('space');
    screen.keypress('enter');

    // First version prompt (home-app)
    await screen.next();
    expect(screen.getScreen()).toContain('@openmrs/esm-home-app');
    screen.keypress('enter'); // accept default 1.0.0

    // Second version prompt (login-app)
    await screen.next();
    expect(screen.getScreen()).toContain('@openmrs/esm-login-app');
    screen.keypress('enter'); // accept default 2.0.0

    await resultPromise;

    // Both packages should have been downloaded
    expect(mockPacoteManifest).toHaveBeenCalledTimes(2);
    expect(mockPacoteManifest).toHaveBeenCalledWith('@openmrs/esm-home-app@1.0.0', expect.any(Object));
    expect(mockPacoteManifest).toHaveBeenCalledWith('@openmrs/esm-login-app@2.0.0', expect.any(Object));
  });
});
