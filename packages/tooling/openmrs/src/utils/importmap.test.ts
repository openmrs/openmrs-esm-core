import { describe, expect, it, vi, beforeEach } from 'vitest';

// Mock node:fs selectively -- only the functions importmap.ts uses
vi.mock('node:fs', () => ({
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
}));

// Suppress logger output during tests
vi.mock('./logger', () => ({
  logInfo: vi.fn(),
  logWarn: vi.fn(),
  logFail: vi.fn(),
}));

// Mock dependencies and port utilities used by runProject (which we don't test directly,
// but they're imported at module scope)
vi.mock('./devserver', () => ({
  startDevServer: vi.fn(),
}));
vi.mock('./dependencies', () => ({
  getMainBundle: vi.fn(),
  getAppRoutes: vi.fn(),
}));
vi.mock('./port', () => ({
  getAvailablePort: vi.fn(),
}));

import { existsSync, readFileSync } from 'node:fs';
import {
  checkImportmapJson,
  checkRoutesJson,
  getImportMap,
  getRoutes,
  mergeImportmapAndRoutes,
  proxyImportmapAndRoutes,
  type ImportmapAndRoutes,
  type ImportmapAndRoutesWithWatches,
} from './importmap';

const mockExistsSync = vi.mocked(existsSync);
const mockReadFileSync = vi.mocked(readFileSync);

// ─── Validators ──────────────────────────────────────────────────────────────

describe('checkImportmapJson', () => {
  it('returns true for a valid import map', () => {
    expect(checkImportmapJson('{"imports":{"foo":"https://example.com/foo.js"}}')).toBe(true);
  });

  it('returns true for an import map with empty imports', () => {
    expect(checkImportmapJson('{"imports":{}}')).toBe(true);
  });

  it('returns false when the imports key is missing', () => {
    expect(checkImportmapJson('{"routes":{}}')).toBe(false);
  });

  it('returns false for invalid JSON', () => {
    expect(checkImportmapJson('not json')).toBe(false);
  });

  it('returns false for a JSON array', () => {
    expect(checkImportmapJson('[]')).toBe(false);
  });

  it('returns false for a JSON string primitive', () => {
    expect(checkImportmapJson('"hello"')).toBe(false);
  });
});

describe('checkRoutesJson', () => {
  it('returns true for a valid routes object', () => {
    expect(checkRoutesJson('{"@openmrs/foo":{"pages":[]}}')).toBe(true);
  });

  it('returns true for an empty object', () => {
    expect(checkRoutesJson('{}')).toBe(true);
  });

  it('returns false for invalid JSON', () => {
    expect(checkRoutesJson('not json')).toBe(false);
  });

  it('returns false for a JSON array', () => {
    expect(checkRoutesJson('[]')).toBe(false);
  });

  it('returns false when a value is not an object', () => {
    expect(checkRoutesJson('{"key":"string_value"}')).toBe(false);
  });
});

// ─── getImportMap ────────────────────────────────────────────────────────────

describe('getImportMap', () => {
  it('returns a url declaration for an HTTP URL', async () => {
    const result = await getImportMap('https://example.com/importmap.json');
    expect(result).toEqual({ type: 'url', value: 'https://example.com/importmap.json' });
  });

  it('returns an inline declaration when the local file exists and is valid', async () => {
    const content = '{"imports":{"foo":"bar"}}';
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(content);

    const result = await getImportMap('/path/to/importmap.json');

    expect(result).toEqual({ type: 'inline', value: content });
  });

  it('returns an inline empty value when the local file exists but is invalid', async () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue('not valid json');

    const result = await getImportMap('/path/to/importmap.json');

    expect(result).toEqual({ type: 'inline', value: '' });
  });

  it('returns an inline declaration when the path is valid import map JSON', async () => {
    const inlineJson = '{"imports":{"@openmrs/foo":"https://cdn.example.com/foo.js"}}';
    mockExistsSync.mockReturnValue(false);

    const result = await getImportMap(inlineJson);

    expect(result).toEqual({ type: 'inline', value: inlineJson });
  });

  it('returns a url declaration for a non-existent, non-JSON, non-URL path', async () => {
    mockExistsSync.mockReturnValue(false);

    const result = await getImportMap('some-nonexistent-file.json');

    expect(result).toEqual({ type: 'url', value: 'some-nonexistent-file.json' });
  });
});

// ─── getRoutes ───────────────────────────────────────────────────────────────

describe('getRoutes', () => {
  it('returns a url declaration for an HTTP URL', async () => {
    const result = await getRoutes('https://example.com/routes.json');
    expect(result).toEqual({ type: 'url', value: 'https://example.com/routes.json' });
  });

  it('returns an inline declaration when the local file exists and is valid', async () => {
    const content = '{"@openmrs/foo":{"pages":[]}}';
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(content);

    const result = await getRoutes('/path/to/routes.json');

    expect(result).toEqual({ type: 'inline', value: content });
  });

  it('returns an inline empty value when the local file exists but is invalid', async () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue('not valid json');

    const result = await getRoutes('/path/to/routes.json');

    expect(result).toEqual({ type: 'inline', value: '' });
  });

  it('returns an inline declaration when the path is valid routes JSON', async () => {
    const inlineJson = '{"@openmrs/foo":{"pages":[]}}';
    mockExistsSync.mockReturnValue(false);

    const result = await getRoutes(inlineJson);

    expect(result).toEqual({ type: 'inline', value: inlineJson });
  });
});

// ─── mergeImportmapAndRoutes ────────────────────────────────────────────────

describe('mergeImportmapAndRoutes', () => {
  it('returns the original declarations unchanged when additionalImportsAndRoutes is false', async () => {
    const original: ImportmapAndRoutes = {
      importMap: { type: 'inline', value: '{"imports":{"a":"1"}}' },
      routes: { type: 'inline', value: '{"@openmrs/a":{"pages":[]}}' },
    };

    const result = await mergeImportmapAndRoutes(original, false);

    expect(result.importMap.value).toBe('{"imports":{"a":"1"}}');
    expect(result.routes.value).toBe('{"@openmrs/a":{"pages":[]}}');
  });

  it('merges additional imports into an inline import map', async () => {
    const original: ImportmapAndRoutes = {
      importMap: { type: 'inline', value: '{"imports":{"a":"1"}}' },
      routes: { type: 'inline', value: '{}' },
    };

    const result = await mergeImportmapAndRoutes(original, {
      importMap: { b: '2' },
      routes: {},
      watchedRoutesPaths: {},
    });

    const merged = JSON.parse(result.importMap.value);
    expect(merged.imports).toEqual({ a: '1', b: '2' });
  });

  it('additional imports override existing ones with the same key', async () => {
    const original: ImportmapAndRoutes = {
      importMap: { type: 'inline', value: '{"imports":{"a":"old"}}' },
      routes: { type: 'inline', value: '{}' },
    };

    const result = await mergeImportmapAndRoutes(original, {
      importMap: { a: 'new' },
      routes: {},
      watchedRoutesPaths: {},
    });

    const merged = JSON.parse(result.importMap.value);
    expect(merged.imports.a).toBe('new');
  });

  it('fetches a URL-type import map and converts to inline before merging', async () => {
    const remoteMap = { imports: { remote: 'https://cdn.example.com/remote.js' } };
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(remoteMap),
      }),
    );

    const original: ImportmapAndRoutes = {
      importMap: { type: 'url', value: 'https://example.com/importmap.json' },
      routes: { type: 'inline', value: '{}' },
    };

    const result = await mergeImportmapAndRoutes(original, {
      importMap: { local: 'http://localhost:8080/local.js' },
      routes: {},
      watchedRoutesPaths: {},
    });

    expect(result.importMap.type).toBe('inline');
    const merged = JSON.parse(result.importMap.value);
    expect(merged.imports.local).toBe('http://localhost:8080/local.js');
    // The remote import URL should have been resolved against the fetch URL
    expect(merged.imports.remote).toBeDefined();

    vi.unstubAllGlobals();
  });

  it('merges additional routes into the routes declaration', async () => {
    const original: ImportmapAndRoutes = {
      importMap: { type: 'inline', value: '{"imports":{}}' },
      routes: { type: 'inline', value: '{"@openmrs/a":{"pages":[]}}' },
    };

    const result = await mergeImportmapAndRoutes(original, {
      importMap: {},
      routes: { '@openmrs/b': { pages: ['/new'] } },
      watchedRoutesPaths: {},
    });

    const merged = JSON.parse(result.routes.value);
    expect(merged['@openmrs/a']).toEqual({ pages: [] });
    expect(merged['@openmrs/b']).toEqual({ pages: ['/new'] });
  });
});

// ─── proxyImportmapAndRoutes ────────────────────────────────────────────────

describe('proxyImportmapAndRoutes', () => {
  const spaPath = '/openmrs/spa/';
  const backend = 'https://dev3.openmrs.org';

  it('rewrites backend URLs to relative paths, stripping the spaPath prefix', () => {
    const input: ImportmapAndRoutesWithWatches = {
      importMap: {
        type: 'inline',
        value: JSON.stringify({
          imports: {
            '@openmrs/foo': 'https://dev3.openmrs.org/openmrs/spa/foo-1.0.0/foo.js',
          },
        }),
      },
      routes: { type: 'inline', value: '{}' },
      watchedRoutesPaths: {},
    };

    const result = proxyImportmapAndRoutes(input, backend, spaPath);

    const map = JSON.parse(result.importmap.value);
    expect(map.imports['@openmrs/foo']).toBe('./foo-1.0.0/foo.js');
  });

  it('preserves URLs that point to different hosts', () => {
    const input: ImportmapAndRoutesWithWatches = {
      importMap: {
        type: 'inline',
        value: JSON.stringify({
          imports: {
            '@openmrs/local': 'http://localhost:8081/main.js',
            '@openmrs/remote': 'https://dev3.openmrs.org/openmrs/spa/remote.js',
          },
        }),
      },
      routes: { type: 'inline', value: '{}' },
      watchedRoutesPaths: {},
    };

    const result = proxyImportmapAndRoutes(input, backend, spaPath);

    const map = JSON.parse(result.importmap.value);
    expect(map.imports['@openmrs/local']).toBe('http://localhost:8081/main.js');
    expect(map.imports['@openmrs/remote']).toBe('./remote.js');
  });

  it('handles URLs with search params and hash fragments', () => {
    const input: ImportmapAndRoutesWithWatches = {
      importMap: {
        type: 'inline',
        value: JSON.stringify({
          imports: {
            '@openmrs/foo': 'https://dev3.openmrs.org/openmrs/spa/foo.js?v=1#section',
          },
        }),
      },
      routes: { type: 'inline', value: '{}' },
      watchedRoutesPaths: {},
    };

    const result = proxyImportmapAndRoutes(input, backend, spaPath);

    const map = JSON.parse(result.importmap.value);
    expect(map.imports['@openmrs/foo']).toBe('./foo.js?v=1#section');
  });

  it('throws when called with a non-inline import map', () => {
    const input: ImportmapAndRoutesWithWatches = {
      importMap: { type: 'url', value: 'https://example.com/importmap.json' },
      routes: { type: 'inline', value: '{}' },
      watchedRoutesPaths: {},
    };

    expect(() => proxyImportmapAndRoutes(input, backend, spaPath)).toThrow(
      'proxyImportmapAndRoutes called on non-inline import map',
    );
  });

  it('throws when called with non-inline routes', () => {
    const input: ImportmapAndRoutesWithWatches = {
      importMap: { type: 'inline', value: '{"imports":{}}' },
      routes: { type: 'url', value: 'https://example.com/routes.json' },
      watchedRoutesPaths: {},
    };

    expect(() => proxyImportmapAndRoutes(input, backend, spaPath)).toThrow(
      'proxyImportmapAndRoutes called on non-inline routes',
    );
  });
});
