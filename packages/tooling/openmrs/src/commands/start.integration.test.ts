import { describe, expect, it, vi } from 'vitest';
import { getAvailablePort } from '../utils/port';
import { runStart, type StartArgs } from './start';

// Suppress log noise
vi.mock('../utils/logger', () => ({
  logInfo: vi.fn(),
  logWarn: vi.fn(),
  logFail: vi.fn(),
}));

// Prevent browser from opening
vi.mock('open', () => ({ default: vi.fn().mockResolvedValue(undefined) }));

function defaultArgs(overrides: Partial<StartArgs> = {}): StartArgs {
  return {
    port: 0,
    host: 'localhost',
    open: false,
    backend: 'https://dev3.openmrs.org/',
    addCookie: '',
    ...overrides,
  };
}

/** Starts the server and polls until it's ready. */
async function startServer(args: StartArgs) {
  runStart(args);

  const baseUrl = `http://${args.host}:${args.port}`;
  for (let i = 0; i < 50; i++) {
    try {
      await fetch(`${baseUrl}/openmrs/spa/`);
      return baseUrl;
    } catch {
      await new Promise((r) => setTimeout(r, 100));
    }
  }
  throw new Error(`Server did not start on ${baseUrl} within 5s`);
}

describe('runStart', () => {
  it('serves the app shell index.html at the spa path', async () => {
    const port = await getAvailablePort(18000);
    const baseUrl = await startServer(defaultArgs({ port }));

    const res = await fetch(`${baseUrl}/openmrs/spa/`);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/html');

    const html = await res.text();
    expect(html).toContain('initializeSpa');
  }, 15_000);

  it('serves static JS bundles from the app shell dist', async () => {
    const port = await getAvailablePort(18100);
    const baseUrl = await startServer(defaultArgs({ port }));

    // Fetch index.html and extract a JS bundle reference
    const indexRes = await fetch(`${baseUrl}/openmrs/spa/`);
    const html = await indexRes.text();

    const jsMatch = html.match(/openmrs\.[a-f0-9]+\.js/);
    expect(jsMatch).not.toBeNull();

    const jsRes = await fetch(`${baseUrl}/openmrs/spa/${jsMatch![0]}`);
    expect(jsRes.status).toBe(200);
    expect(jsRes.headers.get('content-type')).toContain('javascript');
  }, 15_000);

  it('serves static CSS files from the app shell dist', async () => {
    const port = await getAvailablePort(18200);
    const baseUrl = await startServer(defaultArgs({ port }));

    const indexRes = await fetch(`${baseUrl}/openmrs/spa/`);
    const html = await indexRes.text();

    const cssMatch = html.match(/openmrs\.[a-f0-9]+\.css/);
    expect(cssMatch).not.toBeNull();

    const cssRes = await fetch(`${baseUrl}/openmrs/spa/${cssMatch![0]}`);
    expect(cssRes.status).toBe(200);
    expect(cssRes.headers.get('content-type')).toContain('css');
  }, 15_000);

  it('returns index.html for catch-all routes (SPA routing)', async () => {
    const port = await getAvailablePort(18300);
    const baseUrl = await startServer(defaultArgs({ port }));

    // A deep SPA route should still return index.html
    const res = await fetch(`${baseUrl}/some/deep/route`);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/html');

    const html = await res.text();
    expect(html).toContain('initializeSpa');
  }, 15_000);
});
