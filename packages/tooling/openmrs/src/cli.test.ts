import { beforeEach, describe, expect, it, vi } from 'vitest';

// The module-level `buildCli(yargs).argv` in cli.ts parses process.argv
// on import. Mock the yargs default export as a no-op proxy so the import
// doesn't trigger real parsing (and potentially process.exit from strict mode).
vi.mock('yargs', () => {
  const noop: any = new Proxy(() => noop, {
    get: (_, prop) => (prop === 'argv' ? {} : noop),
  });
  return { default: noop };
});

vi.mock('node:child_process');
vi.mock('./utils');

import { fork, type ChildProcess } from 'node:child_process';
import {
  getAvailablePort,
  getImportmapAndRoutes,
  isPortAvailable,
  mergeImportmapAndRoutes,
  proxyImportmapAndRoutes,
  resolvePackages,
  runProject,
  trimEnd,
} from './utils';
import { buildCli } from './cli';
import yargsFactory from 'yargs/yargs';

beforeEach(() => {
  vi.mocked(fork).mockReturnValue({
    send: vi.fn(),
    on: vi.fn(),
  } as unknown as ChildProcess);

  vi.mocked(getAvailablePort).mockResolvedValue(8080);
  vi.mocked(isPortAvailable).mockResolvedValue(true);
  vi.mocked(getImportmapAndRoutes).mockResolvedValue({
    importMap: { type: 'inline', value: '{"imports":{}}' },
    routes: { type: 'inline', value: '{}' },
  });
  vi.mocked(mergeImportmapAndRoutes).mockResolvedValue({
    importMap: { type: 'inline', value: '{"imports":{}}' },
    routes: { type: 'inline', value: '{}' },
    watchedRoutesPaths: {},
  });
  vi.mocked(proxyImportmapAndRoutes).mockReturnValue({
    importmap: { type: 'inline', value: '{"imports":{}}' },
    routes: { type: 'inline', value: '{}' },
    watchedRoutesPaths: {},
  });
  vi.mocked(resolvePackages).mockResolvedValue([]);
  vi.mocked(runProject).mockResolvedValue({
    importMap: {},
    routes: {},
    watchedRoutesPaths: {},
  });
  vi.mocked(trimEnd).mockImplementation((str: string, char: string) => {
    while (str.endsWith(char)) {
      str = str.slice(0, -1);
    }
    return str;
  });
});

function createCli(args: string[]) {
  return buildCli(yargsFactory(args).exitProcess(false).fail(false));
}

describe('develop command', () => {
  it('defaults backend to https://dev3.openmrs.org', async () => {
    const parsed = await createCli(['develop']).parseAsync();
    expect(parsed.backend).toBe('https://dev3.openmrs.org');
  });

  it('strips trailing slash from backend via coerce', async () => {
    const parsed = await createCli(['develop', '--backend', 'https://example.com/']).parseAsync();
    expect(parsed.backend).toBe('https://example.com');
  });

  it('defaults port to undefined (auto-detect)', async () => {
    const parsed = await createCli(['develop']).parseAsync();
    expect(parsed.port).toBeUndefined();
  });

  it('defaults open to true', async () => {
    const parsed = await createCli(['develop']).parseAsync();
    expect(parsed.open).toBe(true);
  });

  it('defaults spa-path to /openmrs/spa/', async () => {
    const parsed = await createCli(['develop']).parseAsync();
    expect(parsed.spaPath).toBe('/openmrs/spa/');
  });

  it('defaults api-url to /openmrs/', async () => {
    const parsed = await createCli(['develop']).parseAsync();
    expect(parsed.apiUrl).toBe('/openmrs/');
  });

  it('defaults sources to undefined (no default)', async () => {
    const parsed = await createCli(['develop']).parseAsync();
    expect(parsed.sources).toBeUndefined();
  });

  it('defaults packages to an empty array', async () => {
    const parsed = await createCli(['develop']).parseAsync();
    expect(parsed.packages).toEqual([]);
  });

  it('accepts multiple --packages flags', async () => {
    const parsed = await createCli([
      'develop',
      '--packages',
      '@openmrs/app-a',
      '--packages',
      '@openmrs/app-b',
    ]).parseAsync();
    expect(parsed.packages).toEqual(['@openmrs/app-a', '@openmrs/app-b']);
  });
});

describe('build command', () => {
  it('coerces target to an absolute path', async () => {
    const parsed = await createCli(['build', '--target', 'output']).parseAsync();
    expect(parsed.target).toMatch(/^\//);
    expect(parsed.target).toContain('output');
  });

  it('coerces build-config to an absolute path', async () => {
    const parsed = await createCli(['build', '--build-config', 'config.json']).parseAsync();
    expect(parsed.buildConfig).toMatch(/^\//);
    expect(parsed.buildConfig).toContain('config.json');
  });

  it('coerces config-path entries to absolute paths', async () => {
    const parsed = await createCli(['build', '--config-path', 'a.json', '--config-path', 'b.json']).parseAsync();
    const paths = parsed.configPath as string[];
    expect(paths).toHaveLength(2);
    paths.forEach((p) => expect(p).toMatch(/^\//));
  });

  it('coerces asset entries to absolute paths', async () => {
    const parsed = await createCli(['build', '--asset', 'style.css']).parseAsync();
    const assets = parsed.asset as string[];
    expect(assets).toHaveLength(1);
    expect(assets[0]).toMatch(/^\//);
  });

  it('defaults env to production', async () => {
    const parsed = await createCli(['build']).parseAsync();
    expect(parsed.env).toBe('production');
  });

  it('defaults page-title to OpenMRS', async () => {
    const parsed = await createCli(['build']).parseAsync();
    expect(parsed.pageTitle).toBe('OpenMRS');
  });

  it('defaults fresh to false', async () => {
    const parsed = await createCli(['build']).parseAsync();
    expect(parsed.fresh).toBe(false);
  });
});

describe('assemble command', () => {
  it('trims trailing slashes from registry via coerce', async () => {
    const parsed = await createCli(['assemble', '--registry', 'https://registry.npmjs.org/']).parseAsync();
    expect(parsed.registry).toBe('https://registry.npmjs.org');
  });

  it('coerces target to an absolute path', async () => {
    const parsed = await createCli(['assemble', '--target', 'output']).parseAsync();
    expect(parsed.target).toMatch(/^\//);
    expect(parsed.target).toContain('output');
  });

  it('defaults mode to survey', async () => {
    const parsed = await createCli(['assemble']).parseAsync();
    expect(parsed.mode).toBe('survey');
  });

  it('accepts config as a valid mode', async () => {
    const parsed = await createCli(['assemble', '--mode', 'config']).parseAsync();
    expect(parsed.mode).toBe('config');
  });

  it('rejects invalid mode values', async () => {
    await expect(async () => createCli(['assemble', '--mode', 'invalid']).parseAsync()).rejects.toThrow(
      /Invalid values/,
    );
  });

  it('defaults build-routes to true', async () => {
    const parsed = await createCli(['assemble']).parseAsync();
    expect(parsed.buildRoutes).toBe(true);
  });
});

describe('start command', () => {
  it('defaults port to 8080', async () => {
    const parsed = await createCli(['start']).parseAsync();
    expect(parsed.port).toBe(8080);
  });

  it('defaults open to false', async () => {
    const parsed = await createCli(['start']).parseAsync();
    expect(parsed.open).toBe(false);
  });

  it('defaults backend to https://dev3.openmrs.org/', async () => {
    const parsed = await createCli(['start']).parseAsync();
    expect(parsed.backend).toBe('https://dev3.openmrs.org/');
  });
});

describe('strict mode', () => {
  it('rejects unknown options', async () => {
    await expect(async () => createCli(['build', '--nonexistent']).parseAsync()).rejects.toThrow(/Unknown argument/);
  });
});
