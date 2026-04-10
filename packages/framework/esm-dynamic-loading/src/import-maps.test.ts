import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import createFetchMock from 'vitest-fetch-mock';

createFetchMock(vi).enableMocks();

describe('import-maps', () => {
  function setDomImportMaps(maps: Array<{ imports: Record<string, string> }>) {
    document.querySelectorAll('script[type="systemjs-importmap"]').forEach((el) => el.remove());

    for (const map of maps) {
      const script = document.createElement('script');
      script.type = 'systemjs-importmap';
      script.textContent = JSON.stringify(map);
      document.head.appendChild(script);
    }
  }

  beforeEach(() => {
    localStorage.clear();
    fetchMock.resetMocks();
    document.querySelectorAll('script[type="systemjs-importmap"]').forEach((el) => el.remove());
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // Reset spaEnv so it can be reassigned in next test
    Object.defineProperty(window, 'spaEnv', { value: undefined, writable: true, configurable: true });
  });

  describe('production mode', () => {
    beforeEach(async () => {
      (window as any).spaEnv = 'production';
      vi.resetModules();
    });

    it('getCurrentPageMap returns the base map without overrides', async () => {
      const { setupImportMapOverrides, getCurrentPageMap } = await import('./import-maps');
      setupImportMapOverrides();

      setDomImportMaps([
        { imports: { '@openmrs/esm-foo': '/foo.js' } },
        { imports: { '@openmrs/esm-bar': '/bar.js' } },
      ]);

      localStorage.setItem('import-map-override:@openmrs/esm-foo', 'http://evil.com/foo.js');

      const map = await getCurrentPageMap();
      expect(map.imports['@openmrs/esm-foo']).toBe('/foo.js');
      expect(map.imports['@openmrs/esm-bar']).toBe('/bar.js');
    });

    it('getImportMapOverrideMap returns empty imports', async () => {
      const { setupImportMapOverrides, getImportMapOverrideMap } = await import('./import-maps');
      setupImportMapOverrides();

      localStorage.setItem('import-map-override:@openmrs/esm-foo', 'http://evil.com/foo.js');
      const map = getImportMapOverrideMap();
      expect(map.imports).toEqual({});
    });

    it('addImportMapOverride is a no-op', async () => {
      const { setupImportMapOverrides, addImportMapOverride } = await import('./import-maps');
      setupImportMapOverrides();

      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      addImportMapOverride('@openmrs/esm-foo', 'http://evil.com/foo.js');
      expect(localStorage.getItem('import-map-override:@openmrs/esm-foo')).toBeNull();
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('disabled in production'));
    });

    it('removeImportMapOverride is a no-op', async () => {
      const { setupImportMapOverrides, removeImportMapOverride } = await import('./import-maps');
      setupImportMapOverrides();

      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      localStorage.setItem('import-map-override:@openmrs/esm-foo', '/foo.js');
      removeImportMapOverride('@openmrs/esm-foo');
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('disabled in production'));
    });

    it('resetImportMapOverrides is a no-op', async () => {
      const { setupImportMapOverrides, resetImportMapOverrides } = await import('./import-maps');
      setupImportMapOverrides();

      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      resetImportMapOverrides();
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('disabled in production'));
    });

    it('getImportMapDisabledOverrides returns empty array', async () => {
      const { setupImportMapOverrides, getImportMapDisabledOverrides } = await import('./import-maps');
      setupImportMapOverrides();

      expect(getImportMapDisabledOverrides()).toEqual([]);
    });

    it('isImportMapOverrideDisabled returns false', async () => {
      const { setupImportMapOverrides, isImportMapOverrideDisabled } = await import('./import-maps');
      setupImportMapOverrides();

      expect(isImportMapOverrideDisabled('@openmrs/esm-foo')).toBe(false);
    });
  });

  describe('development mode', () => {
    beforeEach(async () => {
      (window as any).spaEnv = 'development';
      vi.resetModules();
    });

    it('getCurrentPageMap merges base map with overrides', async () => {
      setDomImportMaps([{ imports: { '@openmrs/esm-foo': '/foo.js', '@openmrs/esm-bar': '/bar.js' } }]);
      localStorage.setItem('import-map-override:@openmrs/esm-foo', 'http://localhost:8080/foo.js');

      const { setupImportMapOverrides, getCurrentPageMap } = await import('./import-maps');
      setupImportMapOverrides();

      const map = await getCurrentPageMap();
      expect(map.imports['@openmrs/esm-foo']).toBe('http://localhost:8080/foo.js');
      expect(map.imports['@openmrs/esm-bar']).toBe('/bar.js');
    });

    it('getImportMapDefaultMap returns only the base map', async () => {
      setDomImportMaps([{ imports: { '@openmrs/esm-foo': '/foo.js' } }]);
      localStorage.setItem('import-map-override:@openmrs/esm-foo', 'http://localhost:8080/foo.js');

      const { setupImportMapOverrides, getImportMapDefaultMap } = await import('./import-maps');
      setupImportMapOverrides();

      const map = await getImportMapDefaultMap();
      expect(map.imports['@openmrs/esm-foo']).toBe('/foo.js');
    });

    it('addImportMapOverride stores in localStorage', async () => {
      const { setupImportMapOverrides, addImportMapOverride } = await import('./import-maps');
      setupImportMapOverrides();

      addImportMapOverride('@openmrs/esm-foo', 'http://localhost:8080/foo.js');
      expect(localStorage.getItem('import-map-override:@openmrs/esm-foo')).toBe('http://localhost:8080/foo.js');
    });

    it('removeImportMapOverride removes from localStorage', async () => {
      localStorage.setItem('import-map-override:@openmrs/esm-foo', 'http://localhost:8080/foo.js');

      const { setupImportMapOverrides, removeImportMapOverride } = await import('./import-maps');
      setupImportMapOverrides();

      removeImportMapOverride('@openmrs/esm-foo');
      expect(localStorage.getItem('import-map-override:@openmrs/esm-foo')).toBeNull();
    });

    it('resetImportMapOverrides clears all override keys', async () => {
      localStorage.setItem('import-map-override:@openmrs/esm-foo', '/foo.js');
      localStorage.setItem('import-map-override:@openmrs/esm-bar', '/bar.js');
      localStorage.setItem('unrelated-key', 'value');

      const { setupImportMapOverrides, resetImportMapOverrides } = await import('./import-maps');
      setupImportMapOverrides();

      resetImportMapOverrides();
      expect(localStorage.getItem('import-map-override:@openmrs/esm-foo')).toBeNull();
      expect(localStorage.getItem('import-map-override:@openmrs/esm-bar')).toBeNull();
      expect(localStorage.getItem('unrelated-key')).toBe('value');
    });

    it('addImportMapOverride fires change event', async () => {
      const { setupImportMapOverrides, addImportMapOverride } = await import('./import-maps');
      setupImportMapOverrides();

      const handler = vi.fn();
      window.addEventListener('import-map-overrides:change', handler);

      addImportMapOverride('@openmrs/esm-foo', '/foo.js');
      expect(handler).toHaveBeenCalledTimes(1);

      window.removeEventListener('import-map-overrides:change', handler);
    });

    it('getImportMapOverrideMap excludes disabled overrides by default', async () => {
      localStorage.setItem('import-map-override:@openmrs/esm-foo', '/foo.js');
      localStorage.setItem('import-map-override:@openmrs/esm-bar', '/bar.js');
      localStorage.setItem('import-map-overrides-disabled', JSON.stringify(['@openmrs/esm-foo']));

      const { setupImportMapOverrides, getImportMapOverrideMap } = await import('./import-maps');
      setupImportMapOverrides();

      const map = getImportMapOverrideMap();
      expect(map.imports['@openmrs/esm-foo']).toBeUndefined();
      expect(map.imports['@openmrs/esm-bar']).toBe('/bar.js');
    });

    it('getImportMapOverrideMap includes disabled overrides when requested', async () => {
      localStorage.setItem('import-map-override:@openmrs/esm-foo', '/foo.js');
      localStorage.setItem('import-map-overrides-disabled', JSON.stringify(['@openmrs/esm-foo']));

      const { setupImportMapOverrides, getImportMapOverrideMap } = await import('./import-maps');
      setupImportMapOverrides();

      const map = getImportMapOverrideMap(true);
      expect(map.imports['@openmrs/esm-foo']).toBe('/foo.js');
    });

    it('handles remote import maps via fetch', async () => {
      const script = document.createElement('script');
      script.type = 'systemjs-importmap';
      Object.defineProperty(script, 'src', { value: 'http://localhost/importmap.json', writable: false });
      document.head.appendChild(script);

      fetchMock.mockResponseOnce(JSON.stringify({ imports: { '@openmrs/esm-remote': '/remote.js' } }));

      const { setupImportMapOverrides, getCurrentPageMap } = await import('./import-maps');
      setupImportMapOverrides();

      const map = await getCurrentPageMap();
      expect(map.imports['@openmrs/esm-remote']).toBe('/remote.js');
    });
  });

  describe('merging behavior', () => {
    it('later maps override earlier ones', async () => {
      (window as any).spaEnv = 'production';
      vi.resetModules();

      setDomImportMaps([
        { imports: { '@openmrs/esm-foo': '/foo-v1.js' } },
        { imports: { '@openmrs/esm-foo': '/foo-v2.js' } },
      ]);

      const { setupImportMapOverrides, getCurrentPageMap } = await import('./import-maps');
      setupImportMapOverrides();

      const map = await getCurrentPageMap();
      expect(map.imports['@openmrs/esm-foo']).toBe('/foo-v2.js');
    });
  });
});
