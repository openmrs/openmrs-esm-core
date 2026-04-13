// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const {
  mockGetCurrentPageMap,
  mockGetImportMapOverrideMap,
  mockResetImportMapOverrides,
  mockDispatchToastShown,
  mockGetCoreTranslation,
} = vi.hoisted(() => ({
  mockGetCurrentPageMap: vi.fn(),
  mockGetImportMapOverrideMap: vi.fn().mockReturnValue({ imports: {} }),
  mockResetImportMapOverrides: vi.fn(),
  mockDispatchToastShown: vi.fn(),
  mockGetCoreTranslation: vi.fn((_key: string, fallback: string) => fallback),
}));

vi.mock('./import-maps', () => ({
  getCurrentPageMap: mockGetCurrentPageMap,
  getImportMapOverrideMap: mockGetImportMapOverrideMap,
  resetImportMapOverrides: mockResetImportMapOverrides,
}));

vi.mock('@openmrs/esm-globals', () => ({
  dispatchToastShown: mockDispatchToastShown,
}));

vi.mock('@openmrs/esm-translations', () => ({
  getCoreTranslation: mockGetCoreTranslation,
}));

import { importDynamic, preloadImport, slugify } from './dynamic-loading';

/**
 * Flushes pending microtasks so that async code that has been awaiting
 * a resolved promise can continue executing.
 */
async function flushMicrotasks() {
  for (let i = 0; i < 10; i++) {
    await Promise.resolve();
  }
}

/**
 * Waits until a `<script>` element with the given `src` appears in
 * `document.head`, then returns it. Flushes microtasks repeatedly
 * to allow async production code to run.
 */
async function waitForScript(src: string): Promise<HTMLScriptElement> {
  for (let i = 0; i < 20; i++) {
    await Promise.resolve();
    const el = document.head.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null;
    if (el) return el;
  }
  throw new Error(`Script with src="${src}" was not appended to <head>`);
}

describe('dynamic-loading', () => {
  beforeEach(() => {
    localStorage.clear();
    document.head.querySelectorAll('script').forEach((el) => el.remove());
    (globalThis as any).__webpack_share_scopes__ = { default: {} };
    (window as any).spaBase = '/openmrs/spa';
    mockGetImportMapOverrideMap.mockReturnValue({ imports: {} });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete (globalThis as any).__webpack_share_scopes__;
  });

  describe('slugify', () => {
    it('replaces slashes with underscores', () => {
      expect(slugify('a/b/c')).toBe('a_b_c');
    });

    it('replaces hyphens with underscores', () => {
      expect(slugify('esm-foo-bar')).toBe('esm_foo_bar');
    });

    it('replaces @ with underscores', () => {
      expect(slugify('@openmrs/esm-foo')).toBe('_openmrs_esm_foo');
    });

    it('handles a typical module name', () => {
      expect(slugify('@openmrs/esm-patient-chart-app')).toBe('_openmrs_esm_patient_chart_app');
    });

    it('returns the input unchanged when there are no special characters', () => {
      expect(slugify('simple')).toBe('simple');
    });
  });

  describe('preloadImport', () => {
    it('throws when called with an empty string', async () => {
      await expect(preloadImport('')).rejects.toThrow('without supplying a package');
    });

    it('throws when called with a whitespace-only string', async () => {
      await expect(preloadImport('   ')).rejects.toThrow('without supplying a package');
    });

    it('throws when the package is not in the import map', async () => {
      mockGetCurrentPageMap.mockResolvedValue({ imports: {} });
      await expect(preloadImport('@openmrs/esm-missing')).rejects.toThrow(
        'Could not find the package @openmrs/esm-missing',
      );
    });

    it('resolves immediately if the package is already loaded on window', async () => {
      const slug = '_openmrs_esm_foo';
      (window as any)[slug] = { init: vi.fn(), get: vi.fn() };

      await expect(preloadImport('@openmrs/esm-foo')).resolves.toBeUndefined();

      delete (window as any)[slug];
    });

    it('creates a script element and resolves on load', async () => {
      mockGetCurrentPageMap.mockResolvedValue({
        imports: { '@openmrs/esm-foo': 'http://localhost/foo.js' },
      });

      const promise = preloadImport('@openmrs/esm-foo');
      const script = await waitForScript('http://localhost/foo.js');

      expect(script.type).toBe('text/javascript');
      expect(script.async).toBe(true);

      script.dispatchEvent(new Event('load'));

      await expect(promise).resolves.toBeNull();
    });

    it('rejects when the script fails to load', async () => {
      mockGetCurrentPageMap.mockResolvedValue({
        imports: { '@openmrs/esm-foo': 'http://localhost/foo.js' },
      });

      const promise = preloadImport('@openmrs/esm-foo');
      const script = await waitForScript('http://localhost/foo.js');

      script.dispatchEvent(new ErrorEvent('error', { message: 'net::ERR_CONNECTION_REFUSED' }));

      await expect(promise).rejects.toBe('net::ERR_CONNECTION_REFUSED');
    });

    it('shows a toast when an overridden script fails to load', async () => {
      mockGetCurrentPageMap.mockResolvedValue({
        imports: { '@openmrs/esm-foo': 'http://localhost:8080/foo.js' },
      });
      mockGetImportMapOverrideMap.mockReturnValue({
        imports: { '@openmrs/esm-foo': 'http://localhost:8080/foo.js' },
      });

      const promise = preloadImport('@openmrs/esm-foo');
      const script = await waitForScript('http://localhost:8080/foo.js');

      script.dispatchEvent(new ErrorEvent('error', { message: 'net::ERR_CONNECTION_REFUSED' }));

      await expect(promise).rejects.toBe('net::ERR_CONNECTION_REFUSED');
      expect(mockDispatchToastShown).toHaveBeenCalledWith(
        expect.objectContaining({
          kind: 'error',
        }),
      );
    });

    it('calls resetImportMapOverrides when the toast action button is clicked', async () => {
      mockGetCurrentPageMap.mockResolvedValue({
        imports: { '@openmrs/esm-foo': 'http://localhost:8080/foo.js' },
      });
      mockGetImportMapOverrideMap.mockReturnValue({
        imports: { '@openmrs/esm-foo': 'http://localhost:8080/foo.js' },
      });

      const reloadMock = vi.fn();
      Object.defineProperty(window, 'location', {
        value: { ...window.location, reload: reloadMock },
        writable: true,
        configurable: true,
      });

      const promise = preloadImport('@openmrs/esm-foo');
      const script = await waitForScript('http://localhost:8080/foo.js');

      script.dispatchEvent(new ErrorEvent('error', { message: 'fail' }));
      await promise.catch(() => {});

      const toastArg = mockDispatchToastShown.mock.calls[0][0];
      toastArg.onActionButtonClick();

      expect(mockResetImportMapOverrides).toHaveBeenCalled();
      expect(reloadMock).toHaveBeenCalled();
    });

    it('uses the provided import map instead of fetching one', async () => {
      const importMap = { imports: { '@openmrs/esm-foo': 'http://localhost/foo.js' } };

      const promise = preloadImport('@openmrs/esm-foo', importMap);
      const script = await waitForScript('http://localhost/foo.js');

      script.dispatchEvent(new Event('load'));

      await expect(promise).resolves.toBeNull();
      expect(mockGetCurrentPageMap).not.toHaveBeenCalled();
    });

    it('prepends spaBase to relative URLs starting with ./', async () => {
      mockGetCurrentPageMap.mockResolvedValue({
        imports: { '@openmrs/esm-foo': './foo.js' },
      });

      const promise = preloadImport('@openmrs/esm-foo');
      const script = await waitForScript('/openmrs/spa/foo.js');

      expect(script).not.toBeNull();
      script.dispatchEvent(new Event('load'));

      await expect(promise).resolves.toBeNull();
    });

    it('does not reload a script that is already in the DOM and finished loading', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      mockGetCurrentPageMap.mockResolvedValue({
        imports: { '@openmrs/esm-foo': 'http://localhost/foo.js' },
      });

      // First load
      const firstPromise = preloadImport('@openmrs/esm-foo');
      const script = await waitForScript('http://localhost/foo.js');
      script.dispatchEvent(new Event('load'));
      await firstPromise;

      // Second load — script is in DOM but slug not on window, so it resolves with a warning
      await expect(preloadImport('@openmrs/esm-foo')).resolves.toBeNull();
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('already loaded'));
    });

    it('resolves both callers when the same script is preloaded concurrently', async () => {
      mockGetCurrentPageMap.mockResolvedValue({
        imports: { '@openmrs/esm-foo': 'http://localhost/foo.js' },
      });

      // Two concurrent preloads for the same package
      const first = preloadImport('@openmrs/esm-foo');
      const second = preloadImport('@openmrs/esm-foo');

      const script = await waitForScript('http://localhost/foo.js');
      script.dispatchEvent(new Event('load'));

      await expect(first).resolves.toBeNull();
      await expect(second).resolves.toBeNull();
    });

    it('rejects both callers when a concurrently-loaded script fails', async () => {
      mockGetCurrentPageMap.mockResolvedValue({
        imports: { '@openmrs/esm-foo': 'http://localhost/foo.js' },
      });

      const first = preloadImport('@openmrs/esm-foo');
      const second = preloadImport('@openmrs/esm-foo');

      const script = await waitForScript('http://localhost/foo.js');
      script.dispatchEvent(new ErrorEvent('error', { message: 'net::ERR_FAILED' }));

      await expect(first).rejects.toBe('net::ERR_FAILED');
      await expect(second).rejects.toBe('net::ERR_FAILED');
    });

    it('logs an error when a script takes longer than 5 seconds to load', async () => {
      vi.useFakeTimers();
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockGetCurrentPageMap.mockResolvedValue({
        imports: { '@openmrs/esm-foo': 'http://localhost/foo.js' },
      });

      preloadImport('@openmrs/esm-foo');
      await vi.advanceTimersByTimeAsync(1);

      expect(errorSpy).not.toHaveBeenCalled();

      vi.advanceTimersByTime(5_000);
      expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('did not load within 5 seconds'));

      vi.useRealTimers();
    });

    it('rejects with an empty string when the error event has no message', async () => {
      mockGetCurrentPageMap.mockResolvedValue({
        imports: { '@openmrs/esm-foo': 'http://localhost/foo.js' },
      });
      vi.spyOn(console, 'error').mockImplementation(() => {});

      const promise = preloadImport('@openmrs/esm-foo');
      const script = await waitForScript('http://localhost/foo.js');

      script.dispatchEvent(new ErrorEvent('error'));

      // ErrorEvent.message defaults to '' which is not nullish, so ?? doesn't trigger
      await expect(promise).rejects.toBe('');
    });
  });

  describe('importDynamic', () => {
    function setupFederatedModule(slug: string, moduleExports: Record<string, unknown>) {
      (window as any)[slug] = {
        init: vi.fn(),
        get: vi.fn().mockResolvedValue(() => moduleExports),
      };
    }

    afterEach(() => {
      delete (window as any)['_openmrs_esm_foo'];
    });

    it('returns the module exports from a federated module', async () => {
      const moduleExports = { default: 'hello', namedExport: 42 };
      setupFederatedModule('_openmrs_esm_foo', moduleExports);

      const result = await importDynamic('@openmrs/esm-foo');
      expect(result).toEqual(moduleExports);
    });

    it('calls container.init with the default webpack share scope', async () => {
      const initFn = vi.fn();
      (window as any)['_openmrs_esm_foo'] = {
        init: initFn,
        get: vi.fn().mockResolvedValue(() => ({ default: true })),
      };

      await importDynamic('@openmrs/esm-foo');
      expect(initFn).toHaveBeenCalledWith(__webpack_share_scopes__.default);
    });

    it('calls container.get with the specified share', async () => {
      const getFn = vi.fn().mockResolvedValue(() => ({ default: true }));
      (window as any)['_openmrs_esm_foo'] = { init: vi.fn(), get: getFn };

      await importDynamic('@openmrs/esm-foo', './custom-share');
      expect(getFn).toHaveBeenCalledWith('./custom-share');
    });

    it('uses ./start as the default share', async () => {
      const getFn = vi.fn().mockResolvedValue(() => ({ default: true }));
      (window as any)['_openmrs_esm_foo'] = { init: vi.fn(), get: getFn };

      await importDynamic('@openmrs/esm-foo');
      expect(getFn).toHaveBeenCalledWith('./start');
    });

    it('throws when the global is not a federated module', async () => {
      (window as any)['_openmrs_esm_foo'] = 'not a module';

      await expect(importDynamic('@openmrs/esm-foo')).rejects.toThrow('does not refer to a federated module');
    });

    it('throws when the factory returns null', async () => {
      (window as any)['_openmrs_esm_foo'] = {
        init: vi.fn(),
        get: vi.fn().mockResolvedValue(() => null),
      };

      await expect(importDynamic('@openmrs/esm-foo')).rejects.toThrow('did not return an ESM module');
    });

    it('throws when the factory returns a string', async () => {
      (window as any)['_openmrs_esm_foo'] = {
        init: vi.fn(),
        get: vi.fn().mockResolvedValue(() => 'not a module'),
      };

      await expect(importDynamic('@openmrs/esm-foo')).rejects.toThrow('did not return an ESM module');
    });

    it('rejects if preloading exceeds maxLoadingTime', async () => {
      vi.useFakeTimers();
      mockGetCurrentPageMap.mockReturnValue(new Promise(() => {}));

      const promise = importDynamic('@openmrs/esm-foo', './start', { maxLoadingTime: 100 });
      // Attach a no-op handler so the rejection is tracked before the timer fires
      promise.catch(() => {});

      vi.advanceTimersByTime(100);
      await flushMicrotasks();

      await expect(promise).rejects.toThrow('Could not resolve requested script');

      vi.useRealTimers();
    });

    it('defaults maxLoadingTime to 10 minutes', async () => {
      vi.useFakeTimers();
      mockGetCurrentPageMap.mockReturnValue(new Promise(() => {}));

      const promise = importDynamic('@openmrs/esm-foo');
      promise.catch(() => {});

      // Just under 10 minutes — should not have rejected yet
      vi.advanceTimersByTime(599_999);
      await flushMicrotasks();

      // Advance the remaining 1ms
      vi.advanceTimersByTime(1);
      await flushMicrotasks();

      await expect(promise).rejects.toThrow('10 minutes');

      vi.useRealTimers();
    });

    it('treats non-positive maxLoadingTime as the default', async () => {
      vi.useFakeTimers();
      mockGetCurrentPageMap.mockReturnValue(new Promise(() => {}));

      const promise = importDynamic('@openmrs/esm-foo', './start', { maxLoadingTime: -1 });
      promise.catch(() => {});

      vi.advanceTimersByTime(600_000);
      await flushMicrotasks();

      await expect(promise).rejects.toThrow('10 minutes');

      vi.useRealTimers();
    });
  });
});
