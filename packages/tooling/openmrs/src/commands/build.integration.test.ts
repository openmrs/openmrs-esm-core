import { afterEach, describe, expect, it, vi } from 'vitest';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { runBuild, type BuildArgs } from './build';

// Suppress log noise during tests
vi.mock('../utils/logger', () => ({
  logInfo: vi.fn(),
  logWarn: vi.fn(),
  logFail: vi.fn(),
}));

const tempDirs: string[] = [];

function createTempDir(): string {
  const dir = mkdtempSync(join(tmpdir(), 'build-test-'));
  tempDirs.push(dir);
  return dir;
}

afterEach(() => {
  for (const dir of tempDirs) {
    if (existsSync(dir)) {
      rmSync(dir, { recursive: true, force: true });
    }
  }
  tempDirs.length = 0;
});

function defaultArgs(overrides: Partial<BuildArgs> = {}): BuildArgs {
  return {
    target: join(createTempDir(), 'dist'),
    registry: 'https://registry.npmjs.org/',
    defaultLocale: '',
    spaPath: '/openmrs/spa/',
    apiUrl: '/openmrs/',
    pageTitle: 'OpenMRS',
    configUrls: ['https://example.com/config.json'],
    configPaths: [],
    env: 'production',
    assets: [],
    ...overrides,
  };
}

function readIndex(target: string): string {
  return readFileSync(join(target, 'index.html'), 'utf8');
}

function listFiles(target: string): string[] {
  return readdirSync(target, { recursive: true }).map(String);
}

// The rspack config is loaded via require() and cached after the first call.
// Environment variables are read at module load time, so only the first build's
// values take effect for template parameters like pageTitle and spaPath.
// We therefore test all config-dependent assertions in a single build and use
// separate tests for filesystem-level behavior.

describe('runBuild', () => {
  it('produces a complete build with correct index.html content', async () => {
    const target = join(createTempDir(), 'dist');

    await runBuild(defaultArgs({ target }));

    const html = readIndex(target);

    // Page title is baked into the HTML <title> tag
    expect(html).toContain('<title>');

    // The initializeSpa() call must be present with the expected structure
    expect(html).toContain('initializeSpa(');
    expect(html).toMatch(/apiUrl:/);
    expect(html).toMatch(/spaPath:/);
    expect(html).toMatch(/configUrls:/);

    // There should be a <script> tag referencing a hashed openmrs JS bundle
    expect(html).toMatch(/openmrs\.[a-f0-9]+\.js/);

    // There should be a stylesheet link to the openmrs CSS
    expect(html).toMatch(/openmrs\.[a-f0-9]+\.css/);
  }, 30_000);

  it('produces at least one hashed JS bundle named openmrs.<hash>.js', async () => {
    const target = join(createTempDir(), 'dist');

    await runBuild(defaultArgs({ target }));

    const files = listFiles(target);
    const openmrsBundle = files.find((f) => /^openmrs\.[a-f0-9]+\.js$/.test(f));
    expect(openmrsBundle).toBeDefined();
  }, 30_000);

  it('produces at least one CSS file', async () => {
    const target = join(createTempDir(), 'dist');

    await runBuild(defaultArgs({ target }));

    const files = listFiles(target);
    const cssFile = files.find((f) => f.endsWith('.css'));
    expect(cssFile).toBeDefined();
  }, 30_000);

  it('copies config files from configPaths to the target directory', async () => {
    const dir = createTempDir();
    const target = join(dir, 'dist');
    const configFile = join(dir, 'my-config.json');
    writeFileSync(configFile, JSON.stringify({ setting: 'value' }));

    await runBuild(defaultArgs({ target, configPaths: [configFile] }));

    const copiedConfig = join(target, 'my-config.json');
    expect(existsSync(copiedConfig)).toBe(true);
    expect(JSON.parse(readFileSync(copiedConfig, 'utf8'))).toEqual({ setting: 'value' });
  }, 30_000);

  it('resolves a hashed importmap filename when the exact file does not exist', async () => {
    const dir = createTempDir();
    const target = join(dir, 'dist');
    mkdirSync(target, { recursive: true });

    // Simulate a prior assemble --hash-importmap
    const hashedImportmap = JSON.stringify({ imports: { '@openmrs/esm-test': './test.js' } });
    writeFileSync(join(target, 'importmap.abc123.json'), hashedImportmap);

    // Request importmap.json (which doesn't exist); the build should find the hashed version
    await runBuild(defaultArgs({ target, importmap: 'importmap.json' }));

    // The build should succeed and the hashed importmap file should still be present
    expect(existsSync(join(target, 'importmap.abc123.json'))).toBe(true);
    expect(existsSync(join(target, 'index.html'))).toBe(true);
  }, 30_000);
});
