import { describe, expect, it, vi } from 'vitest';

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
  it('returns true for a valid routes registry', () => {
    expect(checkRoutesJson('{"routes":{"@openmrs/foo":{"pages":[]}}}')).toBe(true);
  });

  it('returns true when a top-level version is present', () => {
    expect(checkRoutesJson('{"version":"1.2.3","routes":{"@openmrs/foo":{"pages":[]}}}')).toBe(true);
  });

  it('returns true for an empty routes map', () => {
    expect(checkRoutesJson('{"routes":{}}')).toBe(true);
  });

  it('returns false for the legacy flat shape', () => {
    expect(checkRoutesJson('{"@openmrs/foo":{"pages":[]}}')).toBe(false);
  });

  it('returns false when the routes key is missing', () => {
    expect(checkRoutesJson('{}')).toBe(false);
  });

  it('returns false when version is not a string', () => {
    expect(checkRoutesJson('{"version":42,"routes":{}}')).toBe(false);
  });

  it('returns false for invalid JSON', () => {
    expect(checkRoutesJson('not json')).toBe(false);
  });

  it('returns false for a JSON array', () => {
    expect(checkRoutesJson('[]')).toBe(false);
  });

  it('returns false when a routes entry is not an object', () => {
    expect(checkRoutesJson('{"routes":{"key":"string_value"}}')).toBe(false);
  });

  it('returns false when a routes entry is null', () => {
    expect(checkRoutesJson('{"routes":{"@openmrs/foo":null}}')).toBe(false);
  });

  it('returns false when a routes entry is an array', () => {
    expect(checkRoutesJson('{"routes":{"@openmrs/foo":[]}}')).toBe(false);
  });

  it('returns false for null', () => {
    expect(checkRoutesJson('null')).toBe(false);
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
    const content = '{"version":"1.2.3","routes":{"@openmrs/foo":{"pages":[]}}}';
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
    const inlineJson = '{"routes":{"@openmrs/foo":{"pages":[]}}}';
    mockExistsSync.mockReturnValue(false);

    const result = await getRoutes(inlineJson);

    expect(result).toEqual({ type: 'inline', value: inlineJson });
  });

  it('converts a legacy local routes file (modules at the top level) into the nested format', async () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue('{"@openmrs/foo":{"pages":[]}}');

    const result = await getRoutes('/path/to/routes.json');

    expect(result).toEqual({ type: 'inline', value: '{"routes":{"@openmrs/foo":{"pages":[]}}}' });
  });

  it('converts a legacy inline routes JSON string into the nested format', async () => {
    mockExistsSync.mockReturnValue(false);

    const result = await getRoutes('{"@openmrs/foo":{"pages":[]}}');

    expect(result).toEqual({ type: 'inline', value: '{"routes":{"@openmrs/foo":{"pages":[]}}}' });
  });

  it('treats a legacy module coincidentally named "routes" as a module, not the wrapper key', async () => {
    mockExistsSync.mockReturnValue(true);
    // "routes" here is a module whose value is an OpenmrsAppRoutes (array-valued
    // pages), which is structurally distinct from the current-format wrapper.
    mockReadFileSync.mockReturnValue('{"routes":{"pages":["/foo"]}}');

    const result = await getRoutes('/path/to/routes.json');

    expect(result).toEqual({ type: 'inline', value: '{"routes":{"routes":{"pages":["/foo"]}}}' });
  });
});

// ─── mergeImportmapAndRoutes ────────────────────────────────────────────────

describe('mergeImportmapAndRoutes', () => {
  it('returns the original declarations unchanged when additionalImportsAndRoutes is false', async () => {
    const original: ImportmapAndRoutes = {
      importMap: { type: 'inline', value: '{"imports":{"a":"1"}}' },
      routes: { type: 'inline', value: '{"routes":{"@openmrs/a":{"pages":[]}}}' },
    };

    const result = await mergeImportmapAndRoutes(original, false);

    expect(result.importMap.value).toBe('{"imports":{"a":"1"}}');
    expect(result.routes.value).toBe('{"routes":{"@openmrs/a":{"pages":[]}}}');
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

  it('merges additional routes into the nested routes map, preserving the top-level version', async () => {
    const original: ImportmapAndRoutes = {
      importMap: { type: 'inline', value: '{"imports":{}}' },
      routes: { type: 'inline', value: '{"version":"1.2.3","routes":{"@openmrs/a":{"pages":[]}}}' },
    };

    const result = await mergeImportmapAndRoutes(original, {
      importMap: {},
      routes: { '@openmrs/b': { pages: ['/new'] } },
      watchedRoutesPaths: {},
    });

    const merged = JSON.parse(result.routes.value);
    expect(merged.version).toBe('1.2.3');
    expect(merged.routes['@openmrs/a']).toEqual({ pages: [] });
    expect(merged.routes['@openmrs/b']).toEqual({ pages: ['/new'] });
  });

  it('wraps a legacy inline routes registry (modules at the top level) into the nested format', async () => {
    const original: ImportmapAndRoutes = {
      importMap: { type: 'inline', value: '{"imports":{}}' },
      // Legacy shape: module entries live directly at the top level.
      routes: { type: 'inline', value: '{"@openmrs/a":{"pages":[]}}' },
    };

    const result = await mergeImportmapAndRoutes(original, {
      importMap: {},
      routes: { '@openmrs/b': { pages: ['/new'] } },
      watchedRoutesPaths: {},
    });

    const merged = JSON.parse(result.routes.value);
    expect(merged.routes['@openmrs/a']).toEqual({ pages: [] });
    expect(merged.routes['@openmrs/b']).toEqual({ pages: ['/new'] });
    // The legacy module must not leak as a stray top-level key.
    expect(merged['@openmrs/a']).toBeUndefined();
  });

  it('converts a legacy-format remote registry to the nested format when fetching a URL-type declaration', async () => {
    // The backend returns the legacy shape with modules at the top level.
    const remoteRoutes = { '@openmrs/backend': { pages: ['/backend'] } };
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(remoteRoutes),
      }),
    );

    const original: ImportmapAndRoutes = {
      importMap: { type: 'inline', value: '{"imports":{}}' },
      routes: { type: 'url', value: 'https://example.com/routes.registry.json' },
    };

    const result = await mergeImportmapAndRoutes(original, {
      importMap: {},
      routes: { '@openmrs/local': { pages: ['/local'] } },
      watchedRoutesPaths: {},
    });

    expect(result.routes.type).toBe('inline');
    const merged = JSON.parse(result.routes.value);
    // Both the converted backend module and the locally-served module survive.
    expect(merged.routes['@openmrs/backend']).toEqual({ pages: ['/backend'] });
    expect(merged.routes['@openmrs/local']).toEqual({ pages: ['/local'] });
    expect(merged['@openmrs/backend']).toBeUndefined();

    vi.unstubAllGlobals();
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
      /Could not resolve the import map to serve.*no local frontend/s,
    );
  });

  it('throws when called with non-inline routes', () => {
    const input: ImportmapAndRoutesWithWatches = {
      importMap: { type: 'inline', value: '{"imports":{}}' },
      routes: { type: 'url', value: 'https://example.com/routes.json' },
      watchedRoutesPaths: {},
    };

    expect(() => proxyImportmapAndRoutes(input, backend, spaPath)).toThrow(
      /Could not resolve the routes registry to serve.*no local frontend/s,
    );
  });
});
