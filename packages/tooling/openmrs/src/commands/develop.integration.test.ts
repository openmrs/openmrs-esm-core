import { afterEach, describe, expect, it, vi } from 'vitest';
import { mkdtempSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { getAvailablePort } from '../utils/port';
import { runDevelop, type DevelopArgs } from './develop';

// Suppress log noise
vi.mock('../utils/logger', () => ({
  logInfo: vi.fn(),
  logWarn: vi.fn(),
  logFail: vi.fn(),
}));

// Prevent node-watch from setting up real filesystem watchers
vi.mock('node-watch', () => ({ default: vi.fn() }));

// Prevent browser from opening
vi.mock('open', () => ({ default: vi.fn().mockResolvedValue(undefined) }));

const tempDirs: string[] = [];

function createTempDir(): string {
  const dir = mkdtempSync(join(tmpdir(), 'develop-test-'));
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

function defaultArgs(overrides: Partial<DevelopArgs> = {}): DevelopArgs {
  return {
    port: 0, // will be overridden per-test
    host: 'localhost',
    backend: 'https://dev3.openmrs.org',
    open: false,
    importmap: { type: 'inline', value: '{"imports":{}}' },
    routes: { type: 'inline', value: '{}' },
    watchedRoutesPaths: {},
    spaPath: '/openmrs/spa',
    apiUrl: '/openmrs',
    configUrls: [],
    configFiles: [],
    addCookie: '',
    supportOffline: false,
    ...overrides,
  };
}

/** Starts the dev server and polls until it's ready. */
async function startDevServer(args: DevelopArgs) {
  runDevelop(args);

  const spaPath = args.spaPath.replace(/\/$/, '');
  const baseUrl = `http://${args.host}:${args.port}`;
  const probeUrl = `${baseUrl}${spaPath}/importmap.json`;

  for (let i = 0; i < 50; i++) {
    try {
      await fetch(probeUrl);
      return baseUrl;
    } catch {
      await new Promise((r) => setTimeout(r, 100));
    }
  }
  throw new Error(`Dev server did not start on ${baseUrl} within 5s`);
}

describe('runDevelop', () => {
  describe('with default spaPath (/openmrs/spa)', () => {
    it('serves a rewritten index.html with development env and configUrls', async () => {
      const port = await getAvailablePort(19000);
      const baseUrl = await startDevServer(
        defaultArgs({
          port,
          configUrls: ['https://example.com/config.json'],
        }),
      );

      const res = await fetch(`${baseUrl}/openmrs/spa/home`);
      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toContain('text/html');

      const html = await res.text();
      expect(html).toContain('env: "development"');
      expect(html).toContain('https://example.com/config.json');
    }, 15_000);

    it('serves the inline importmap at /importmap.json', async () => {
      const importmap = '{"imports":{"@openmrs/foo":"https://cdn.example.com/foo.js"}}';
      const port = await getAvailablePort(19100);
      const baseUrl = await startDevServer(defaultArgs({ port, importmap: { type: 'inline', value: importmap } }));

      const res = await fetch(`${baseUrl}/openmrs/spa/importmap.json`);
      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toContain('application/json');
      expect(await res.text()).toBe(importmap);
    }, 15_000);

    it('serves the inline routes at /routes.registry.json', async () => {
      const routes = '{"@openmrs/foo":{"pages":["/home"]}}';
      const port = await getAvailablePort(19200);
      const baseUrl = await startDevServer(defaultArgs({ port, routes: { type: 'inline', value: routes } }));

      const res = await fetch(`${baseUrl}/openmrs/spa/routes.registry.json`);
      expect(res.status).toBe(200);
      expect(await res.text()).toBe(routes);
    }, 15_000);

    it('serves config files at the local config URL prefix', async () => {
      const dir = createTempDir();
      const configFile = join(dir, 'my-config.json');
      writeFileSync(configFile, JSON.stringify({ setting: 'value' }));

      const port = await getAvailablePort(19300);
      const baseUrl = await startDevServer(defaultArgs({ port, configFiles: [configFile] }));

      const res = await fetch(`${baseUrl}/openmrs/spa/__local_config__/my-config.json`);
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ setting: 'value' });
    }, 15_000);

    it('serves static assets from the app shell dist directory', async () => {
      const port = await getAvailablePort(19400);
      const baseUrl = await startDevServer(defaultArgs({ port }));

      const indexRes = await fetch(`${baseUrl}/openmrs/spa/home`);
      const html = await indexRes.text();

      // Extract a CSS filename from the HTML and fetch it
      const cssMatch = html.match(/openmrs\.[a-f0-9]+\.css/);
      expect(cssMatch).not.toBeNull();

      const cssRes = await fetch(`${baseUrl}/openmrs/spa/${cssMatch![0]}`);
      expect(cssRes.status).toBe(200);
      expect(cssRes.headers.get('content-type')).toContain('css');
    }, 15_000);

    it('does not serve importmap.json from static assets when importmap is inline', async () => {
      const customImportmap = '{"imports":{"@openmrs/custom":"http://localhost/custom.js"}}';
      const port = await getAvailablePort(19500);
      const baseUrl = await startDevServer(
        defaultArgs({ port, importmap: { type: 'inline', value: customImportmap } }),
      );

      const res = await fetch(`${baseUrl}/openmrs/spa/importmap.json`);
      const body = await res.text();
      expect(body).toBe(customImportmap);
    }, 15_000);
  });

  describe('with custom spaPath', () => {
    it('serves the rewritten index.html under the custom spaPath', async () => {
      const port = await getAvailablePort(19600);
      const baseUrl = await startDevServer(
        defaultArgs({
          port,
          spaPath: '/custom/spa',
          apiUrl: '/custom/api',
        }),
      );

      const res = await fetch(`${baseUrl}/custom/spa/dashboard`);
      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toContain('text/html');

      const html = await res.text();
      expect(html).toContain('spaPath: "/custom/spa"');
      expect(html).toContain('apiUrl: "/custom/api"');
    }, 15_000);

    it('serves the inline importmap under the custom spaPath', async () => {
      const importmap = '{"imports":{"@openmrs/bar":"https://cdn.example.com/bar.js"}}';
      const port = await getAvailablePort(19700);
      const baseUrl = await startDevServer(
        defaultArgs({
          port,
          spaPath: '/custom/spa',
          importmap: { type: 'inline', value: importmap },
        }),
      );

      const res = await fetch(`${baseUrl}/custom/spa/importmap.json`);
      expect(res.status).toBe(200);
      expect(await res.text()).toBe(importmap);
    }, 15_000);

    it('serves the inline routes under the custom spaPath', async () => {
      const routes = '{"@openmrs/bar":{"pages":["/dashboard"]}}';
      const port = await getAvailablePort(19800);
      const baseUrl = await startDevServer(
        defaultArgs({
          port,
          spaPath: '/custom/spa',
          routes: { type: 'inline', value: routes },
        }),
      );

      const res = await fetch(`${baseUrl}/custom/spa/routes.registry.json`);
      expect(res.status).toBe(200);
      expect(await res.text()).toBe(routes);
    }, 15_000);
  });
});
