import { beforeEach, describe, expect, it, vi } from 'vitest';
import { resolve } from 'node:path';

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

vi.mock('@inquirer/prompts', () => ({
  checkbox: vi.fn(),
  input: vi.fn(),
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
  getNpmRegistryConfiguration: vi.fn().mockReturnValue({}),
}));

import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { checkbox, input } from '@inquirer/prompts';
import npmRegistryFetch from 'npm-registry-fetch';
import pacote from 'pacote';
import { contentHash, untar } from '../utils';
import { getNpmRegistryConfiguration } from '../utils/npmConfig';
import { runAssemble, type AssembleArgs } from './assemble';

// Many of these functions have complex overloaded signatures that make vi.mocked()
// produce types no mock value can satisfy. Using vi.Mock lets us call mockResolvedValue
// etc. without fighting overload resolution.
const mockReadFile: vi.Mock = vi.mocked(readFile);
const mockWriteFile: vi.Mock = vi.mocked(writeFile);
const mockExistsSync: vi.Mock = vi.mocked(existsSync);
const mockReadFileSync: vi.Mock = vi.mocked(readFileSync);
const mockCheckbox: vi.Mock = vi.mocked(checkbox);
const mockInput: vi.Mock = vi.mocked(input);
const mockNpmFetchJson: vi.Mock = vi.mocked(npmRegistryFetch.json);
const mockPacoteManifest: vi.Mock = vi.mocked(pacote.manifest);
const mockPacoteTarball: vi.Mock = vi.mocked(pacote.tarball);
const mockRm: vi.Mock = vi.mocked(rm);
const mockUntar: vi.Mock = vi.mocked(untar);
const mockContentHash: vi.Mock = vi.mocked(contentHash);
const mockGetNpmRegistryConfiguration: vi.Mock = vi.mocked(getNpmRegistryConfiguration);

function defaultArgs(overrides: Partial<AssembleArgs> = {}): AssembleArgs {
  return {
    target: '/tmp/test-output',
    mode: 'config',
    config: ['/path/to/config.json'],
    configFiles: [],
    hashFiles: false,
    fresh: false,
    buildRoutes: false,
    manifest: false,
    ...overrides,
  };
}

/** Creates the files map that `untar` would return for a package tarball. */
function fakeUntarResult(name: string, version: string, entryPath = 'dist/main.js') {
  return {
    'package/package.json': Buffer.from(JSON.stringify({ name, version, main: entryPath })),
    [`package/${entryPath}`]: Buffer.from('export default {};'),
  };
}

/** Sets up mocks for a single-module happy path (config mode, npm download). */
function setupSingleModuleRun(
  moduleName: string,
  moduleVersion: string,
  entryPath = 'dist/main.js',
  routesJson?: object,
) {
  const config = {
    frontendModules: { [moduleName]: moduleVersion },
    publicUrl: '.',
  };

  mockExistsSync.mockImplementation((p: any) => {
    if (String(p) === '/path/to/config.json') return true;
    if (String(p).endsWith('routes.json')) return Boolean(routesJson);
    return false;
  });

  mockReadFile.mockImplementation((p: any, _enc?: any) => {
    if (String(p) === '/path/to/config.json') {
      return Promise.resolve(JSON.stringify(config));
    }
    if (String(p).endsWith('routes.json') && routesJson) {
      return Promise.resolve(JSON.stringify(routesJson));
    }
    return Promise.reject(new Error(`Unexpected readFile call: ${p}`));
  });

  mockPacoteManifest.mockResolvedValue({
    _resolved: `https://registry.npmjs.org/${moduleName}/-/${moduleName}-${moduleVersion}.tgz`,
    _integrity: 'sha512-fake',
  });
  mockPacoteTarball.mockResolvedValue(Buffer.from('fake-tarball'));
  mockUntar.mockResolvedValue(fakeUntarResult(moduleName, moduleVersion, entryPath));
}

// ─── Config mode ──────────────────────────────────────────────────────────────

describe('runAssemble', () => {
  beforeEach(() => {
    // getNpmRegistryConfiguration is used by every runAssemble call;
    // mockReset clears its return value so we re-set it here
    mockGetNpmRegistryConfiguration.mockReturnValue({});
  });

  describe('config mode', () => {
    it('reads a config file and writes an empty import map when no modules are specified', async () => {
      const config = { frontendModules: {}, publicUrl: '.' };
      mockExistsSync.mockReturnValue(true);
      mockReadFile.mockResolvedValue(JSON.stringify(config));

      await runAssemble(defaultArgs());

      expect(mockWriteFile).toHaveBeenCalledWith(
        resolve('/tmp/test-output', 'importmap.json'),
        JSON.stringify({ imports: {} }),
        'utf8',
      );
    });

    it('defaults to spa-build-config.json in cwd when no config paths are given', async () => {
      const config = { frontendModules: {}, publicUrl: '.' };
      mockExistsSync.mockReturnValue(true);
      mockReadFile.mockResolvedValue(JSON.stringify(config));

      await runAssemble(defaultArgs({ config: [] }));

      expect(mockReadFile).toHaveBeenCalledWith(resolve(process.cwd(), 'spa-build-config.json'), 'utf8');
    });

    it('throws when a config file does not exist', async () => {
      mockExistsSync.mockReturnValue(false);

      await expect(runAssemble(defaultArgs({ config: ['/missing/config.json'] }))).rejects.toThrow(
        'Could not find the config file "/missing/config.json"',
      );
    });

    it('merges multiple config files', async () => {
      const config1 = { frontendModules: { '@openmrs/esm-a': '1.0.0' }, publicUrl: '.' };
      const config2 = { frontendModules: { '@openmrs/esm-b': '2.0.0' } };

      mockExistsSync.mockReturnValue(true);
      mockReadFile.mockResolvedValueOnce(JSON.stringify(config1)).mockResolvedValueOnce(JSON.stringify(config2));

      // Both modules will be downloaded; set up minimal mocks
      mockPacoteManifest.mockResolvedValue({ _resolved: 'https://r.test/a.tgz', _integrity: 'sha512-a' });
      mockPacoteTarball.mockResolvedValue(Buffer.from('tarball'));
      mockUntar.mockResolvedValue(fakeUntarResult('@openmrs/esm-a', '1.0.0'));

      await runAssemble(
        defaultArgs({
          config: ['/path/config1.json', '/path/config2.json'],
        }),
      );

      // Both modules should appear in the import map
      const writeCall = mockWriteFile.mock.calls.find(([path]) => String(path).endsWith('importmap.json'));
      expect(writeCall).toBeDefined();
      const importmap = JSON.parse(writeCall![1] as string);
      expect(importmap.imports).toHaveProperty('@openmrs/esm-a');
      expect(importmap.imports).toHaveProperty('@openmrs/esm-b');
    });

    it('removes modules listed in frontendModuleExcludes', async () => {
      const config1 = {
        frontendModules: { '@openmrs/esm-a': '1.0.0', '@openmrs/esm-b': '2.0.0' },
        publicUrl: '.',
      };
      const config2 = {
        frontendModules: {},
        frontendModuleExcludes: ['@openmrs/esm-a'],
      };

      mockExistsSync.mockReturnValue(true);
      mockReadFile.mockResolvedValueOnce(JSON.stringify(config1)).mockResolvedValueOnce(JSON.stringify(config2));

      mockPacoteManifest.mockResolvedValue({ _resolved: 'https://r.test/b.tgz', _integrity: 'sha512-b' });
      mockPacoteTarball.mockResolvedValue(Buffer.from('tarball'));
      mockUntar.mockResolvedValue(fakeUntarResult('@openmrs/esm-b', '2.0.0'));

      await runAssemble(
        defaultArgs({
          config: ['/path/config1.json', '/path/config2.json'],
        }),
      );

      const writeCall = mockWriteFile.mock.calls.find(([path]) => String(path).endsWith('importmap.json'));
      const importmap = JSON.parse(writeCall![1] as string);
      expect(importmap.imports).not.toHaveProperty('@openmrs/esm-a');
      expect(importmap.imports).toHaveProperty('@openmrs/esm-b');
    });
  });

  // ─── Survey mode ──────────────────────────────────────────────────────────────

  describe('survey mode', () => {
    it('fetches packages from npm registry and offers only -app packages in the checkbox', async () => {
      mockNpmFetchJson.mockResolvedValue({
        objects: [
          { package: { name: '@openmrs/esm-home-app', version: '1.0.0' } },
          { package: { name: '@openmrs/esm-utils', version: '2.0.0' } },
          { package: { name: '@openmrs/esm-login-app', version: '3.0.0' } },
        ],
        total: 3,
      });

      // User selects no packages
      mockCheckbox.mockResolvedValue([]);

      await runAssemble(defaultArgs({ mode: 'survey', config: [] }));

      expect(mockNpmFetchJson).toHaveBeenCalledWith(expect.stringContaining('keywords:openmrs'), expect.any(Object));

      // The checkbox should only list -app packages
      const checkboxConfig = mockCheckbox.mock.calls[0][0];
      const choiceNames = checkboxConfig.choices.map((c: any) => c.name);
      expect(choiceNames).toContain('@openmrs/esm-home-app');
      expect(choiceNames).toContain('@openmrs/esm-login-app');
      expect(choiceNames).not.toContain('@openmrs/esm-utils');
    });

    it('prompts for version of each selected package with semver validation', async () => {
      mockNpmFetchJson.mockResolvedValue({
        objects: [{ package: { name: '@openmrs/esm-home-app', version: '1.0.0' } }],
        total: 1,
      });

      mockCheckbox.mockResolvedValue([{ name: '@openmrs/esm-home-app', version: '1.0.0' }]);
      mockInput.mockResolvedValue('1.2.0');

      mockPacoteManifest.mockResolvedValue({ _resolved: 'https://r.test/home.tgz', _integrity: 'sha512-h' });
      mockPacoteTarball.mockResolvedValue(Buffer.from('tarball'));
      mockUntar.mockResolvedValue(fakeUntarResult('@openmrs/esm-home-app', '1.2.0'));
      mockExistsSync.mockReturnValue(false);

      await runAssemble(defaultArgs({ mode: 'survey', config: [] }));

      // Should have prompted for the version of the selected package
      const inputConfig = mockInput.mock.calls[0][0];
      expect(inputConfig.message).toContain('@openmrs/esm-home-app');
      expect(inputConfig.default).toBe('1.0.0');

      // Verify the validation function accepts exact versions and ranges
      expect(inputConfig.validate('1.0.0')).toBe(true);
      expect(inputConfig.validate('^1.2.3')).toBe(true);
      expect(inputConfig.validate('>=1.0.0 <2.0.0')).toBe(true);
      expect(inputConfig.validate('not-semver')).toEqual(
        expect.stringContaining('does not appear to be a valid semver'),
      );

      // The package should be downloaded with the user-specified version
      expect(mockPacoteManifest).toHaveBeenCalledWith('@openmrs/esm-home-app@1.2.0', expect.any(Object));
    });
  });

  // ─── Package downloading ────────────────────────────────────────────────────

  describe('package downloading', () => {
    it('downloads npm packages using pacote', async () => {
      setupSingleModuleRun('@openmrs/esm-test-app', '1.0.0');

      await runAssemble(defaultArgs());

      expect(mockPacoteManifest).toHaveBeenCalledWith('@openmrs/esm-test-app@1.0.0', expect.any(Object));
      expect(mockPacoteTarball).toHaveBeenCalledWith(
        expect.stringContaining('registry.npmjs.org'),
        expect.objectContaining({ integrity: 'sha512-fake' }),
      );
    });

    it('downloads packages from HTTP URLs using fetch', async () => {
      const config = {
        frontendModules: { '@openmrs/esm-test-app': 'https://cdn.example.com/app-1.0.0.tgz' },
        publicUrl: '.',
      };

      mockExistsSync.mockImplementation((p: any) => {
        if (String(p) === '/path/to/config.json') return true;
        return false;
      });
      mockReadFile.mockImplementation((p: any) => {
        if (String(p) === '/path/to/config.json') {
          return Promise.resolve(JSON.stringify(config));
        }
        return Promise.reject(new Error(`Unexpected readFile: ${p}`));
      });

      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        arrayBuffer: () => Promise.resolve(Buffer.from('http-tarball').buffer),
      });
      vi.stubGlobal('fetch', mockFetch);

      mockUntar.mockResolvedValue(fakeUntarResult('@openmrs/esm-test-app', '1.0.0'));

      await runAssemble(defaultArgs());

      expect(mockFetch).toHaveBeenCalledWith('https://cdn.example.com/app-1.0.0.tgz');
      expect(mockPacoteManifest).not.toHaveBeenCalled();

      vi.unstubAllGlobals();
    });

    it('downloads packages from file:// paths using readFile', async () => {
      const config = {
        frontendModules: { '@openmrs/esm-test-app': 'file:./local-build.tgz' },
        publicUrl: '.',
      };

      mockExistsSync.mockImplementation((p: any) => {
        if (String(p) === '/path/to/config.json') return true;
        return false;
      });
      mockReadFile.mockImplementation((p: any, enc?: any) => {
        if (String(p) === '/path/to/config.json') {
          return Promise.resolve(JSON.stringify(config));
        }
        // file:// path resolves relative to cwd
        if (String(p) === resolve(process.cwd(), './local-build.tgz')) {
          return Promise.resolve(Buffer.from('local-tarball'));
        }
        return Promise.reject(new Error(`Unexpected readFile: ${p}`));
      });

      mockUntar.mockResolvedValue(fakeUntarResult('@openmrs/esm-test-app', '1.0.0'));

      await runAssemble(defaultArgs());

      expect(mockPacoteManifest).not.toHaveBeenCalled();
    });
  });

  // ─── Output generation ──────────────────────────────────────────────────────

  describe('output generation', () => {
    it('generates import map with correct module paths', async () => {
      setupSingleModuleRun('@openmrs/esm-test-app', '1.0.0', 'dist/main.js');

      await runAssemble(defaultArgs());

      const writeCall = mockWriteFile.mock.calls.find(([path]) => String(path).endsWith('importmap.json'));
      expect(writeCall).toBeDefined();
      const importmap = JSON.parse(writeCall![1] as string);
      // baseDirName = "openmrs-esm-test-app", dirName = "openmrs-esm-test-app-1.0.0"
      expect(importmap.imports['@openmrs/esm-test-app']).toBe('./openmrs-esm-test-app-1.0.0/main.js');
    });

    it('generates routes registry when buildRoutes is enabled', async () => {
      const routes = { pages: ['/home'], extensions: [] };
      setupSingleModuleRun('@openmrs/esm-test-app', '1.0.0', 'dist/main.js', routes);

      await runAssemble(defaultArgs({ buildRoutes: true }));

      const writeCall = mockWriteFile.mock.calls.find(([path]) => String(path).includes('routes.registry'));
      expect(writeCall).toBeDefined();
      const routesRegistry = JSON.parse(writeCall![1] as string);
      expect(routesRegistry['@openmrs/esm-test-app']).toEqual(
        expect.objectContaining({ pages: ['/home'], version: '1.0.0' }),
      );
    });

    it('does not generate routes registry when buildRoutes is disabled', async () => {
      setupSingleModuleRun('@openmrs/esm-test-app', '1.0.0');

      await runAssemble(defaultArgs({ buildRoutes: false }));

      const writeCall = mockWriteFile.mock.calls.find(([path]) => String(path).includes('routes.registry'));
      expect(writeCall).toBeUndefined();
    });

    it('warns and omits routes when routes.json does not exist for a module', async () => {
      setupSingleModuleRun('@openmrs/esm-test-app', '1.0.0', 'dist/main.js', undefined);
      const { logWarn } = await import('../utils');

      await runAssemble(defaultArgs({ buildRoutes: true }));

      expect(logWarn).toHaveBeenCalledWith(expect.stringContaining('Routes file'));

      const writeCall = mockWriteFile.mock.calls.find(([path]) => String(path).includes('routes.registry'));
      expect(writeCall).toBeDefined();
      const routesRegistry = JSON.parse(writeCall![1] as string);
      expect(routesRegistry).not.toHaveProperty('@openmrs/esm-test-app');
    });

    it('generates version manifest when manifest is enabled', async () => {
      setupSingleModuleRun('@openmrs/esm-test-app', '1.0.0');

      await runAssemble(defaultArgs({ manifest: true }));

      const writeCall = mockWriteFile.mock.calls.find(([path]) => String(path).endsWith('spa-assemble-config.json'));
      expect(writeCall).toBeDefined();
      const manifest = JSON.parse(writeCall![1] as string);
      expect(manifest.frontendModules['@openmrs/esm-test-app']).toBe('1.0.0');
      expect(manifest.coreVersion).toBeDefined();
    });

    it('merges configFiles into openmrs-config.json', async () => {
      const config = { frontendModules: {}, publicUrl: '.' };
      mockExistsSync.mockReturnValue(true);
      mockReadFile.mockResolvedValue(JSON.stringify(config));
      mockReadFileSync.mockReturnValue(JSON.stringify({ setting: 'value' }));

      await runAssemble(
        defaultArgs({
          configFiles: ['/path/to/extra-config.json'],
        }),
      );

      const writeCall = mockWriteFile.mock.calls.find(([path]) => String(path).includes('openmrs-config'));
      expect(writeCall).toBeDefined();
      const writtenConfig = JSON.parse(writeCall![1] as string);
      expect(writtenConfig.setting).toBe('value');
    });

    it('uses content hash in filenames when hashFiles is enabled', async () => {
      setupSingleModuleRun('@openmrs/esm-test-app', '1.0.0');
      mockContentHash.mockReturnValue('abc123');

      await runAssemble(defaultArgs({ hashFiles: true }));

      const importmapWrite = mockWriteFile.mock.calls.find(([path]) => String(path).includes('importmap'));
      expect(importmapWrite).toBeDefined();
      expect(String(importmapWrite![0])).toContain('importmap.abc123.json');
    });
  });

  // ─── Fresh mode ─────────────────────────────────────────────────────────────

  describe('fresh mode', () => {
    it('removes target directory before assembling when fresh is true and target exists', async () => {
      const config = { frontendModules: {}, publicUrl: '.' };

      mockExistsSync.mockImplementation((p: any) => {
        if (String(p) === '/path/to/config.json') return true;
        if (String(p) === '/tmp/test-output') return true;
        return false;
      });
      mockReadFile.mockResolvedValue(JSON.stringify(config));

      await runAssemble(defaultArgs({ fresh: true }));

      expect(mockRm).toHaveBeenCalledWith('/tmp/test-output', { recursive: true, force: true });
    });

    it('does not call rm when fresh is false', async () => {
      const config = { frontendModules: {}, publicUrl: '.' };
      mockExistsSync.mockReturnValue(true);
      mockReadFile.mockResolvedValue(JSON.stringify(config));

      await runAssemble(defaultArgs({ fresh: false }));

      expect(mockRm).not.toHaveBeenCalled();
    });
  });
});
